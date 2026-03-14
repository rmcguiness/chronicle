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

from fastapi import APIRouter, Depends, HTTPException, Query
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson
from app.schemas import (
    AdvancedSearchResponse,
    AdvancedSearchResultItem,
    SearchResponse,
    SearchResultItem,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["search"])

# ── Region mapping — geo_modern substring → canonical region ─────────────────
_REGION_KEYWORDS: dict[str, list[str]] = {
    "Europe": [
        "England", "France", "Germany", "Italy", "Spain", "Greece", "Rome",
        "Russia", "Poland", "Netherlands", "Austria", "Hungary", "Czech",
        "Sweden", "Norway", "Denmark", "Finland", "Portugal", "Belgium",
        "Switzerland", "Ireland", "Scotland", "Britain", "Byzantine",
        "Ottoman", "Ukraine", "Serbia", "Croatia", "Bosnia", "Bulgaria",
        "Romania", "Europe",
    ],
    "Asia": [
        "China", "Japan", "Korea", "India", "Vietnam", "Thailand",
        "Indonesia", "Philippines", "Cambodia", "Myanmar", "Mongolia",
        "Tibet", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal",
        "Singapore", "Malaysia", "Asia", "Manchuria", "Taiwan",
        "Central Asia", "Kazakhstan", "Uzbekistan",
    ],
    "Americas": [
        "USA", "United States", "America", "Canada", "Mexico", "Brazil",
        "Argentina", "Peru", "Colombia", "Chile", "Cuba", "Caribbean",
        "Venezuela", "Bolivia", "Ecuador", "Guatemala",
        "North Carolina", "New York", "Washington",
    ],
    "Africa": [
        "Africa", "Egypt", "Nigeria", "Ethiopia", "Kenya", "Ghana",
        "South Africa", "Morocco", "Algeria", "Tunisia", "Libya",
        "Sudan", "Congo", "Tanzania", "Mali", "Somalia", "Zimbabwe",
    ],
    "Middle East": [
        "Middle East", "Iraq", "Iran", "Persia", "Syria", "Palestine",
        "Israel", "Saudi", "Arabia", "Yemen", "Jordan", "Lebanon",
        "Turkey", "Anatolia", "Mesopotamia", "Babylon", "Assyria",
        "Jerusalem", "Mecca", "Medina", "Baghdad",
    ],
    "Oceania": [
        "Australia", "New Zealand", "Pacific", "Oceania", "Polynesia",
        "Melanesia", "Fiji", "Samoa", "Papua", "Hawaii",
    ],
}


def _classify_region(geo_modern: str | None, geo_era_label: str | None) -> str | None:
    """Classify an event's geo fields into a canonical region."""
    combined = f"{geo_modern or ''} {geo_era_label or ''}"
    if not combined.strip():
        return None
    for region, keywords in _REGION_KEYWORDS.items():
        for kw in keywords:
            if kw.lower() in combined.lower():
                return region
    return None


# ── Era year ranges ──────────────────────────────────────────────────────────
_ERA_RANGES: dict[str, tuple[int, int]] = {
    "Ancient": (-3500, -500),
    "Classical": (-500, 500),
    "Medieval": (500, 1500),
    "Early Modern": (1500, 1800),
    "Modern": (1800, 1945),
    "Contemporary": (1945, 2025),
}


@router.get("/search/categories", response_model=list[str])
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> list[str]:
    """Return all distinct event categories from approved events."""
    result = await db.execute(
        select(Event.event_category)
        .where(Event.review_status == "approved", Event.event_category.isnot(None))
        .distinct()
        .order_by(Event.event_category)
    )
    return [row[0] for row in result.fetchall()]


@router.get("/search/advanced", response_model=AdvancedSearchResponse)
async def advanced_search(
    q: Optional[str] = Query(default=None, description="Text search (title + description)"),
    region: Optional[str] = Query(default=None, description="Filter by region (comma-sep)"),
    category: Optional[str] = Query(default=None, description="Filter by category (comma-sep)"),
    era: Optional[str] = Query(default=None, description="Era name (sets year range)"),
    year_from: Optional[int] = Query(default=None, description="Min year_approx (negative=BCE)"),
    year_to: Optional[int] = Query(default=None, description="Max year_approx"),
    min_importance: Optional[float] = Query(default=None, ge=0.0, le=1.0),
    has_people: Optional[bool] = Query(default=None),
    has_causes: Optional[bool] = Query(default=None),
    has_effects: Optional[bool] = Query(default=None),
    sort: str = Query(default="importance_desc"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
) -> AdvancedSearchResponse:
    """Advanced multi-filter search for events."""
    from sqlalchemy import or_

    # Sub-queries for counts
    cause_count_sq = (
        select(func.count())
        .select_from(CausalityLink)
        .where(
            CausalityLink.effect_event_id == Event.id,
            CausalityLink.review_status == "approved",
        )
        .correlate(Event)
        .scalar_subquery()
        .label("cause_count")
    )
    effect_count_sq = (
        select(func.count())
        .select_from(CausalityLink)
        .where(
            CausalityLink.cause_event_id == Event.id,
            CausalityLink.review_status == "approved",
        )
        .correlate(Event)
        .scalar_subquery()
        .label("effect_count")
    )
    people_count_sq = (
        select(func.count())
        .select_from(EventPerson)
        .where(EventPerson.event_id == Event.id)
        .correlate(Event)
        .scalar_subquery()
        .label("people_count")
    )

    conditions: list = [Event.review_status == "approved"]

    # Text search
    if q and q.strip():
        pattern = f"%{q.strip()}%"
        conditions.append(
            (Event.title.ilike(pattern)) | (Event.geo_modern.ilike(pattern))
        )

    # Category filter (supports comma-separated)
    if category:
        cats = [c.strip() for c in category.split(",") if c.strip()]
        if len(cats) == 1:
            conditions.append(Event.event_category == cats[0])
        elif cats:
            conditions.append(Event.event_category.in_(cats))

    # Year range — era overrides explicit year params
    eff_year_from = year_from
    eff_year_to = year_to
    if era and era in _ERA_RANGES:
        eff_year_from, eff_year_to = _ERA_RANGES[era]
    if eff_year_from is not None:
        conditions.append(Event.year_approx >= eff_year_from)
    if eff_year_to is not None:
        conditions.append(Event.year_approx <= eff_year_to)

    # Importance
    if min_importance is not None:
        conditions.append(Event.importance_score >= min_importance)

    # Region filter (supports comma-separated)
    if region:
        regions = [r.strip() for r in region.split(",") if r.strip()]
        all_region_conds = []
        for r in regions:
            if r in _REGION_KEYWORDS:
                for kw in _REGION_KEYWORDS[r]:
                    all_region_conds.append(Event.geo_modern.ilike(f"%{kw}%"))
                    all_region_conds.append(Event.geo_era_label.ilike(f"%{kw}%"))
        if all_region_conds:
            conditions.append(or_(*all_region_conds))

    # Has-people / has-causes / has-effects
    if has_people:
        conditions.append(
            select(func.count()).select_from(EventPerson)
            .where(EventPerson.event_id == Event.id)
            .correlate(Event).scalar_subquery() > 0
        )
    if has_causes:
        conditions.append(
            select(func.count()).select_from(CausalityLink)
            .where(CausalityLink.effect_event_id == Event.id, CausalityLink.review_status == "approved")
            .correlate(Event).scalar_subquery() > 0
        )
    if has_effects:
        conditions.append(
            select(func.count()).select_from(CausalityLink)
            .where(CausalityLink.cause_event_id == Event.id, CausalityLink.review_status == "approved")
            .correlate(Event).scalar_subquery() > 0
        )

    # Sorting
    if sort == "year_asc":
        order_clauses = [Event.year_approx.asc().nullslast()]
    elif sort == "year_desc":
        order_clauses = [Event.year_approx.desc().nullslast()]
    elif sort == "connections_desc":
        order_clauses = [(cause_count_sq + effect_count_sq).desc()]
    else:
        order_clauses = [Event.importance_score.desc()]

    # Count total
    count_stmt = select(func.count()).select_from(Event).where(*conditions)
    total = (await db.execute(count_stmt)).scalar() or 0

    # Fetch results
    stmt = (
        select(
            Event.slug, Event.title, Event.year_approx,
            Event.geo_modern, Event.geo_era_label, Event.event_category,
            Event.importance_score, cause_count_sq, effect_count_sq, people_count_sq,
        )
        .where(*conditions)
        .order_by(*order_clauses)
        .limit(limit)
        .offset(offset)
    )
    rows = (await db.execute(stmt)).fetchall()

    results = [
        AdvancedSearchResultItem(
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            region=_classify_region(row.geo_modern, row.geo_era_label),
            category=row.event_category,
            importance_score=row.importance_score or 0.5,
            cause_count=row.cause_count or 0,
            effect_count=row.effect_count or 0,
            people_count=row.people_count or 0,
        )
        for row in rows
    ]

    return AdvancedSearchResponse(
        results=results,
        total=total,
        page_info={
            "limit": limit,
            "offset": offset,
            "has_next": offset + limit < total,
            "has_prev": offset > 0,
        },
    )


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
    q: str = Query(..., description="Search query"),
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
    """PostgreSQL tsvector search fallback — includes lat/lng."""
    tsq = func.plainto_tsquery("english", q)
    tsvec = func.to_tsvector(
        "english",
        func.coalesce(Event.title, "")
        + " "
        + func.coalesce(Event.geo_modern, "")
        + " "
        + func.coalesce(Event.geo_era_label, ""),
    )
    rank = func.ts_rank(tsvec, tsq).label("rank")

    conditions = [
        tsvec.op("@@")(tsq),
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
            rank,
        )
        .where(*conditions)
        .order_by(rank.desc(), Event.importance_score.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
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
                score=float(row.rank) if row.rank else 0.0,
            )
            for row in rows
        ]
    )


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
        .where(Event.slug.in_(slugs))
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
            # Use data from Meilisearch hit directly (no geo)
            results.append(
                SearchResultItem(
                    id=str(hit.get("id", "")),
                    slug=slug,
                    title=hit.get("title", ""),
                    year_approx=hit.get("year_approx"),
                    geo_modern=hit.get("geo_modern"),
                    category=hit.get("category"),
                    importance_score=float(hit.get("importance_score") or 0.5),
                    lat=None,
                    lng=None,
                    score=float(hit.get("_rankingScore", 1.0)),
                )
            )
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
    if len(_semantic_requests[client_ip]) >= SEMANTIC_RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded (30 req/min)")
    _semantic_requests[client_ip].append(now)


@router.get("/search/semantic", response_model=SearchResponse)
async def semantic_search(
    q: str = Query(..., description="Natural language search query"),
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

    # Rate limit (use a fixed key since we don't have request object)
    _check_rate_limit("global")

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
    query_embedding = model.encode([q])[0]
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
