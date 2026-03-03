"""
GET /api/search?q={query}&limit={n}
Full-text search using PostgreSQL tsvector (with Meilisearch as optional enhancement).
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


def get_meili_client():
    """Lazily initialise Meilisearch client (optional)."""
    global _meili_client
    if _meili_client is not None:
        return _meili_client
    try:
        import meilisearch
        url = os.getenv("MEILI_URL", "http://localhost:7700")
        key = os.getenv("MEILI_MASTER_KEY", "")
        _meili_client = meilisearch.Client(url, key)
        _meili_client.health()
        _meili_client.get_indexes()
        logger.info("Meilisearch client connected at %s", url)
    except Exception as exc:
        logger.warning("Meilisearch unavailable (%s), using PostgreSQL FTS fallback", exc)
        _meili_client = None
    return _meili_client


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., description="Search query"),
    limit: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> SearchResponse:
    """
    Search events by title, narrative, tags.
    Uses Meilisearch if available; falls back to PostgreSQL FTS.
    Response: { results: SearchResultItem[] } with lat/lng included.
    """
    if not q.strip():
        return SearchResponse(results=[])

    meili = get_meili_client()
    if meili is not None:
        try:
            return await _search_meili(q, limit, meili, db)
        except Exception as exc:
            logger.warning("Meilisearch search failed (%s), falling back to PG FTS", exc)

    return await _search_postgres(q, limit, db)


async def _search_postgres(q: str, limit: int, db: AsyncSession) -> SearchResponse:
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
        .where(
            tsvec.op("@@")(tsq),
            Event.review_status == "approved",
        )
        .order_by(rank.desc(), Event.importance_score.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    return SearchResponse(
        results=[
            SearchResultItem(
                id=row.id,
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


async def _search_meili(q: str, limit: int, meili, db: AsyncSession) -> SearchResponse:
    """Meilisearch search — fetches lat/lng from PG for matched slugs."""
    index = meili.index("events")
    res = index.search(q, {
        "limit": limit,
        "attributesToRetrieve": ["slug", "title", "year_approx", "geo_modern", "event_category"],
    })
    hits = res.get("hits", [])
    if not hits:
        return SearchResponse(results=[])

    slugs = [h["slug"] for h in hits if "slug" in h]
    # Fetch lat/lng from PG
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
            continue
        results.append(
            SearchResultItem(
                id=ev.id,
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
