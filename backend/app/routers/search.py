"""
GET /api/search?q={query}&limit={n}
Full-text search using PostgreSQL tsvector (with Meilisearch as optional enhancement).
"""
from __future__ import annotations

import logging
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, text
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
        # Quick health check (doesn't require auth)
        _meili_client.health()
        # Verify the key works by listing indexes
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
    """
    if not q.strip():
        return SearchResponse(results=[])

    # Try Meilisearch first
    meili = get_meili_client()
    if meili is not None:
        try:
            return await _search_meili(q, limit, meili, db)
        except Exception as exc:
            logger.warning("Meilisearch search failed (%s), falling back to PG FTS", exc)

    # Fallback: PostgreSQL full-text search
    return await _search_postgres(q, limit, db)


async def _search_postgres(q: str, limit: int, db: AsyncSession) -> SearchResponse:
    """PostgreSQL tsvector search fallback."""
    # Use plainto_tsquery for user-friendly query parsing
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
                score=float(row.rank) if row.rank else 0.0,
            )
            for row in rows
        ]
    )


async def _search_meili(q: str, limit: int, meili, db: AsyncSession) -> SearchResponse:
    """Meilisearch search — returns slugs, then fetches from PG."""
    index = meili.index("events")
    res = index.search(q, {"limit": limit, "attributesToRetrieve": ["slug", "title", "year_approx", "geo_modern", "event_category"]})
    hits = res.get("hits", [])

    results = [
        SearchResultItem(
            id=hit.get("id", "00000000-0000-0000-0000-000000000000"),
            slug=hit["slug"],
            title=hit["title"],
            year_approx=hit.get("year_approx"),
            geo_modern=hit.get("geo_modern"),
            category=hit.get("event_category"),
            score=float(hit.get("_rankingScore", 1.0)),
        )
        for hit in hits
        if "slug" in hit
    ]
    return SearchResponse(results=results)
