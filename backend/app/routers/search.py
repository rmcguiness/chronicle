"""
GET /api/search?q={query}&limit={n}
Full-text search using Meilisearch (primary) with PostgreSQL tsvector fallback.
"""
from __future__ import annotations

import logging
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event
from app.schemas import SearchResponse, SearchResultItem

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["search"])

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
