"""
GET /api/search?q={query}&limit={n}       — keyword search (Meilisearch / PG FTS)
GET /api/search/semantic?q={query}&limit=20 — semantic vector search (pgvector)

Owns: all search endpoints.
Does NOT own: embedding generation (see scripts/generate_embeddings.py).
"""
from __future__ import annotations

import logging
import os
import time
from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from starlette.concurrency import run_in_threadpool
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Person
from app.schemas import SearchResponse, SearchResultItem

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["search"])

# ── Ensure pg_trgm extension is available ─────────────────────────────────────
_pg_trgm_initialized = False


async def _ensure_pg_trgm(db: AsyncSession) -> None:
    """Create pg_trgm extension if it doesn't exist (idempotent)."""
    global _pg_trgm_initialized
    if _pg_trgm_initialized:
        return
    try:
        await db.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm"))
        await db.commit()
        _pg_trgm_initialized = True
    except Exception as exc:
        logger.warning("Could not enable pg_trgm extension: %s", exc)
        await db.rollback()
        _pg_trgm_initialized = True  # don't retry every request

# ── Rate limiting for semantic search ─────────────────────────────────────────
SEMANTIC_RATE_LIMIT = 30  # requests per minute
_semantic_requests: defaultdict[str, list[float]] = defaultdict(list)

# Meilisearch client — optional, gracefully degrades to PG FTS
_meili_client = None
_meili_failed = False  # sticky flag reset by lifespan or explicit reset


def reset_meili_client() -> None:
    """Reset the cached Meilisearch client (called on startup or config change)."""
    global _meili_client, _meili_failed
    _meili_client = None
    _meili_failed = False


def get_meili_client():
    """
    Lazily initialise Meilisearch client (optional).
    Returns None if Meilisearch is unavailable OR the events index has no docs.
    """
    global _meili_client, _meili_failed

    # Already confirmed working
    if _meili_client is not None:
        return _meili_client

    # Previously failed — don't retry on every request (would add latency).
    # The client is reset on startup or by explicit reset_meili_client().
    if _meili_failed:
        return None

    try:
        import meilisearch

        url = os.getenv("MEILI_URL", "http://localhost:7700")
        key = os.getenv("MEILI_MASTER_KEY", "")
        client = meilisearch.Client(url, key)
        client.health()  # raises if down

        # Verify the events index exists and has documents
        try:
            stats = client.index("events").get_stats()
            if stats.number_of_documents == 0:
                logger.warning(
                    "Meilisearch events index is empty — falling back to PostgreSQL FTS. "
                    "Run scripts/index_meilisearch.py to populate it."
                )
                _meili_failed = True
                return None
        except Exception:
            logger.warning("Meilisearch events index not found — will use PostgreSQL FTS")
            _meili_failed = True
            return None

        _meili_client = client
        logger.info(
            "Meilisearch client connected at %s (%d docs indexed)",
            url,
            stats.number_of_documents,
        )
    except Exception as exc:
        logger.warning("Meilisearch unavailable (%s), using PostgreSQL FTS fallback", exc)
        _meili_failed = True
        return None

    return _meili_client


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., max_length=200, description="Search query"),
    limit: int = Query(default=20, ge=1, le=100),
    category: Optional[str] = Query(default=None, description="Filter by category"),
    year_min: Optional[int] = Query(default=None, description="Filter by minimum year"),
    year_max: Optional[int] = Query(default=None, description="Filter by maximum year"),
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """
    Search events by title, narrative, tags, geography.
    Uses Meilisearch (fast, typo-tolerant) if available; falls back to PostgreSQL FTS.
    Response: { results: SearchResultItem[] } with lat/lng included.
    """
    if not q.strip():
        return SearchResponse(results=[])

    meili = get_meili_client()
    if meili is not None:
        try:
            return await _search_meili(q, limit, category, year_min, year_max, meili, db)
        except Exception as exc:
            logger.warning("Meilisearch search failed (%s), falling back to PG FTS", exc)

    return await _search_postgres(q, limit, category, year_min, year_max, db)


async def _search_postgres(
    q: str,
    limit: int,
    category: Optional[str],
    year_min: Optional[int],
    year_max: Optional[int],
    db: AsyncSession,
) -> SearchResponse:
    """
    PostgreSQL search with trigram fuzzy matching + FTS fallback.
    Searches event titles, geo fields, and perspective narratives.
    Also searches the people table for person results.
    """
    await _ensure_pg_trgm(db)

    # ── Event search: trigram similarity + ILIKE + FTS (union for recall) ──────
    tsq = func.plainto_tsquery("english", q)
    tsvec = func.to_tsvector(
        "english",
        func.coalesce(Event.title, "")
        + " "
        + func.coalesce(Event.geo_modern, "")
        + " "
        + func.coalesce(Event.geo_era_label, ""),
    )
    ilike_pattern = f"%{q}%"

    # Trigram similarity on title (fuzzy typo-tolerant matching)
    trgm_score = func.similarity(Event.title, q).label("trgm_score")
    fts_rank = func.ts_rank(tsvec, tsq).label("fts_rank")

    # Combined relevance: max of trigram similarity and FTS rank
    combined_rank = func.greatest(trgm_score, fts_rank).label("rank")

    # Match if ANY of: trigram similar, ILIKE title, ILIKE geo, or FTS matches
    match_condition = (
        (func.similarity(Event.title, q) > 0.3)
        | Event.title.ilike(ilike_pattern)
        | Event.geo_modern.ilike(ilike_pattern)
        | Event.geo_era_label.ilike(ilike_pattern)
        | tsvec.op("@@")(tsq)
    )

    conditions = [
        match_condition,
        Event.review_status == "approved",
    ]
    if category:
        conditions.append(Event.event_category == category)
    if year_min is not None:
        conditions.append(Event.year_approx >= year_min)
    if year_max is not None:
        conditions.append(Event.year_approx <= year_max)

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.geo_modern,
            Event.event_category,
            Event.importance_score,
            ST_X(Event.geo_point).label("lng"),
            ST_Y(Event.geo_point).label("lat"),
            combined_rank,
        )
        .where(*conditions)
        .order_by(combined_rank.desc(), Event.importance_score.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    results: list[SearchResultItem] = [
        SearchResultItem(
            id=str(row.id),
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            geo_modern=row.geo_modern,
            category=row.event_category,
            importance_score=row.importance_score or 0.5,
            lat=float(row.lat) if row.lat is not None else None,
            lng=float(row.lng) if row.lng is not None else None,
            score=float(row.rank) if row.rank else 0.0,
            result_type="event",
        )
        for row in rows
    ]

    # ── Person search: trigram similarity on name ─────────────────────────────
    person_trgm = func.similarity(Person.name, q).label("person_score")
    person_match = (
        (func.similarity(Person.name, q) > 0.3)
        | Person.name.ilike(ilike_pattern)
    )

    person_stmt = (
        select(
            Person.id,
            Person.name,
            Person.birth_year,
            Person.death_year,
            Person.description,
            person_trgm,
        )
        .where(person_match)
        .order_by(person_trgm.desc())
        .limit(min(limit, 5))  # cap person results
    )

    person_result = await db.execute(person_stmt)
    person_rows = person_result.fetchall()

    for row in person_rows:
        # Build a display string for geo_modern from lifespan
        lifespan = ""
        if row.birth_year and row.death_year:
            lifespan = f"{row.birth_year}–{row.death_year}"
        elif row.birth_year:
            lifespan = f"b. {row.birth_year}"

        results.append(
            SearchResultItem(
                id=str(row.id),
                slug=f"person-{row.id}",
                title=row.name,
                year_approx=row.birth_year,
                geo_modern=lifespan or None,
                category="person",
                importance_score=0.5,
                lat=None,
                lng=None,
                score=float(row.person_score) if row.person_score else 0.0,
                result_type="person",
            )
        )

    # Sort combined results by score descending
    results.sort(key=lambda r: r.score, reverse=True)
    return SearchResponse(results=results[:limit])


async def _search_meili(
    q: str,
    limit: int,
    category: Optional[str],
    year_min: Optional[int],
    year_max: Optional[int],
    meili,
    db: AsyncSession,
) -> SearchResponse:
    """
    Meilisearch search — fetches lat/lng from PG for matched slugs.
    Uses showRankingScore for result ordering by relevance.
    """
    index = meili.index("events")

    # Build filter expression
    filters: list[str] = []
    if category:
        filters.append(f'category = "{category}"')
    if year_min is not None:
        filters.append(f"year_approx >= {year_min}")
    if year_max is not None:
        filters.append(f"year_approx <= {year_max}")

    search_params: dict = {
        "limit": limit,
        "showRankingScore": True,
        "attributesToRetrieve": [
            "id",
            "slug",
            "title",
            "year_approx",
            "geo_modern",
            "category",
            "importance_score",
        ],
    }
    if filters:
        search_params["filter"] = " AND ".join(filters)

    res = index.search(q, search_params)
    hits = res.get("hits", [])
    if not hits:
        return SearchResponse(results=[])

    slugs = [h["slug"] for h in hits if "slug" in h]

    # Fetch lat/lng from PG (not stored in Meilisearch to keep index lean)
    ev_stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.geo_modern,
            Event.event_category,
            Event.importance_score,
            ST_X(Event.geo_point).label("lng"),
            ST_Y(Event.geo_point).label("lat"),
        )
        .where(Event.slug.in_(slugs), Event.review_status == "approved")
    )
    ev_result = await db.execute(ev_stmt)
    ev_map = {row.slug: row for row in ev_result.fetchall()}

    results = []
    for hit in hits:
        slug = hit.get("slug")
        if not slug:
            continue
        ev = ev_map.get(slug)
        if ev is None:
            # Not (or no longer) an approved event in the database: don't trust the
            # possibly stale search index.
            continue
        results.append(
            SearchResultItem(
                id=str(ev.id),
                slug=ev.slug,
                title=ev.title,
                year_approx=ev.year_approx,
                geo_modern=ev.geo_modern,
                category=ev.event_category,
                importance_score=ev.importance_score or 0.5,
                lat=float(ev.lat) if ev.lat is not None else None,
                lng=float(ev.lng) if ev.lng is not None else None,
                score=float(hit.get("_rankingScore", 1.0)),
            )
        )
    return SearchResponse(results=results)


# ── Semantic search ───────────────────────────────────────────────────────────

# Lazy-loaded sentence-transformers model
_embedding_model = None
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"


def _get_embedding_model():
    """Lazily load the sentence-transformers model (first call ~2-5s)."""
    global _embedding_model
    if _embedding_model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
            logger.info("Loaded embedding model: %s", EMBEDDING_MODEL_NAME)
        except ImportError:
            logger.error("sentence-transformers not installed — semantic search unavailable")
            raise HTTPException(
                status_code=503,
                detail="Semantic search unavailable: sentence-transformers not installed",
            )
        except Exception as exc:
            logger.error("Failed to load embedding model: %s", exc)
            raise HTTPException(
                status_code=503,
                detail="Semantic search unavailable: model load failed",
            )
    return _embedding_model


def _check_rate_limit(client_ip: str) -> None:
    """Simple in-memory rate limiter: 30 req/min per IP."""
    now = time.time()
    window_start = now - 60.0
    # Prune old entries
    _semantic_requests[client_ip] = [
        t for t in _semantic_requests[client_ip] if t > window_start
    ]
    if len(_semantic_requests) > 10_000:  # drop idle clients so memory stays bounded
        for ip in [k for k, v in _semantic_requests.items() if not v or v[-1] <= window_start]:
            del _semantic_requests[ip]
    if len(_semantic_requests[client_ip]) >= SEMANTIC_RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded (30 req/min)")
    _semantic_requests[client_ip].append(now)


@router.get("/search/semantic", response_model=SearchResponse)
async def semantic_search(
    request: Request,
    q: str = Query(..., max_length=200, description="Natural language search query"),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """
    Semantic search using pgvector cosine similarity.
    Embeds the query with all-MiniLM-L6-v2, then finds nearest events.
    Falls back to keyword search if no embeddings exist yet.
    """
    if not q.strip():
        return SearchResponse(results=[])

    # Rate limit per client so one caller can't exhaust semantic search for everyone.
    # Behind a proxy, run uvicorn with --proxy-headers/--forwarded-allow-ips so this is the real client.
    _check_rate_limit(request.client.host if request.client else "unknown")

    # Check if any embeddings exist
    count_result = await db.execute(
        text("SELECT COUNT(*) FROM events WHERE embedding IS NOT NULL")
    )
    embedding_count = count_result.scalar() or 0

    if embedding_count == 0:
        logger.info("No embeddings found — falling back to keyword search")
        return await _search_postgres(q, limit, None, None, None, db)

    # Encode query
    model = _get_embedding_model()
    # encode() is CPU-bound; keep it off the event loop.
    query_embedding = (await run_in_threadpool(model.encode, [q]))[0]
    vec_str = "[" + ",".join(str(float(x)) for x in query_embedding) + "]"

    # pgvector cosine similarity search
    stmt = text("""
        SELECT id, slug, title, year_approx, geo_modern, event_category,
               importance_score,
               ST_X(geo_point) as lng, ST_Y(geo_point) as lat,
               embedding <=> :query_vec AS distance
        FROM events
        WHERE embedding IS NOT NULL
          AND review_status = 'approved'
        ORDER BY embedding <=> :query_vec
        LIMIT :lim
    """)

    result = await db.execute(stmt, {"query_vec": vec_str, "lim": limit})
    rows = result.fetchall()

    return SearchResponse(
        results=[
            SearchResultItem(
                id=str(row.id),
                slug=row.slug,
                title=row.title,
                year_approx=row.year_approx,
                geo_modern=row.geo_modern,
                category=row.event_category,
                importance_score=row.importance_score or 0.5,
                lat=float(row.lat) if row.lat is not None else None,
                lng=float(row.lng) if row.lng is not None else None,
                score=float(1.0 - row.distance) if row.distance is not None else 0.0,
            )
            for row in rows
        ]
    )
