"""
GET /api/replay — paginated events sorted by year for timeline replay.

Returns lightweight event items in chronological order (year_approx ASC),
paginated via start_year / end_year / limit / offset.
"""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/replay", tags=["replay"])


class ReplayEventItem(BaseModel):
    """Lightweight event for replay feed."""

    id: str
    slug: str
    title: str
    year_approx: int
    category: Optional[str] = None
    region: Optional[str] = None
    importance_score: float = 0.5
    geo_modern: Optional[str] = None


class ReplayResponse(BaseModel):
    """Paginated replay response."""

    events: List[ReplayEventItem]
    total: int
    has_more: bool


@router.get("", response_model=ReplayResponse)
async def get_replay_events(
    start_year: int = Query(default=-3500, description="Start year (negative = BCE)"),
    end_year: int = Query(default=2025, description="End year"),
    limit: int = Query(default=200, ge=1, le=500, description="Max events per page"),
    offset: int = Query(default=0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db),
) -> ReplayResponse:
    """
    Returns approved events sorted by year_approx ASC for timeline replay.

    The client fetches chunks as the replay advances, using offset pagination.
    """
    conditions = [
        Event.year_approx.isnot(None),
        Event.year_approx >= start_year,
        Event.year_approx <= end_year,
        Event.review_status == "approved",
    ]

    # Count total matching events
    from sqlalchemy import func

    count_stmt = (
        select(func.count())
        .select_from(Event)
        .where(and_(*conditions))
    )
    total = (await db.execute(count_stmt)).scalar() or 0

    # Fetch events
    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(and_(*conditions))
        .order_by(Event.year_approx.asc(), Event.importance_score.desc())
        .offset(offset)
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    events = [
        ReplayEventItem(
            id=str(row.id),
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            category=row.event_category,
            importance_score=row.importance_score or 0.5,
            geo_modern=row.geo_modern,
        )
        for row in rows
    ]

    return ReplayResponse(
        events=events,
        total=total,
        has_more=(offset + limit) < total,
    )
