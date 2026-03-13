"""
GET /api/today — Today in History endpoint.

Returns events whose calendar date (month + day) matches the given date,
sorted by importance_score DESC. Falls back to notable events by year_approx
when no exact-date matches are found.
"""
from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Perspective

router = APIRouter(prefix="/api/today", tags=["today"])


class TodayEventItem(BaseModel):
    """A single event returned by the Today in History endpoint."""

    id: UUID
    slug: str
    title: str
    year_approx: int | None
    date_display: str | None
    is_bce: bool
    category: str | None
    importance_score: float
    region: str | None
    description: str | None


class TodayResponse(BaseModel):
    """Response for Today in History."""

    month: int
    day: int
    count: int
    events: list[TodayEventItem]
    fallback: bool


@router.get("", response_model=TodayResponse)
async def today_in_history(
    month: int | None = Query(default=None, ge=1, le=12, description="Month (1-12)"),
    day: int | None = Query(default=None, ge=1, le=31, description="Day (1-31)"),
    limit: int = Query(default=50, ge=1, le=200, description="Max events"),
    db: AsyncSession = Depends(get_db),
) -> TodayResponse:
    """Return events matching a calendar date across all years.

    1. Matches events with date_exact on this month/day.
    2. Falls back to top events by importance if no exact matches exist.
    """
    now = datetime.now(tz=timezone.utc)
    m = month or now.month
    d = day or now.day

    # ── Primary: match on date_exact month/day ──────────────────────────────
    date_col = func.cast(Event._date_exact, func.DATE)

    # Subquery to grab the first perspective summary per event as description
    desc_subq = (
        select(Perspective.event_id, Perspective.summary)
        .distinct(Perspective.event_id)
        .order_by(Perspective.event_id, Perspective.evidence_score.desc())
        .subquery()
    )

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.date_exact,
            Event.is_bce,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
            desc_subq.c.summary.label("description"),
        )
        .outerjoin(desc_subq, desc_subq.c.event_id == Event.id)
        .where(
            Event._date_exact.isnot(None),
            extract("month", date_col) == m,
            extract("day", date_col) == d,
        )
        .order_by(Event.importance_score.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    if rows:
        return _build_response(m, d, rows, fallback=False)

    # ── Fallback: no exact-date matches — pick top events by importance ─────
    fallback_stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.date_exact,
            Event.is_bce,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
            desc_subq.c.summary.label("description"),
        )
        .outerjoin(desc_subq, desc_subq.c.event_id == Event.id)
        .where(Event.importance_score >= 0.7)
        .order_by(Event.importance_score.desc())
        .limit(limit)
    )

    result = await db.execute(fallback_stmt)
    rows = result.fetchall()

    return _build_response(m, d, rows, fallback=True)


def _build_response(
    m: int, d: int, rows: list, *, fallback: bool
) -> TodayResponse:
    events = [
        TodayEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            date_display=row.date_exact,
            is_bce=row.is_bce or False,
            category=row.event_category,
            importance_score=row.importance_score,
            region=row.geo_modern,
            description=row.description,
        )
        for row in rows
    ]
    return TodayResponse(
        month=m,
        day=d,
        count=len(events),
        events=events,
        fallback=fallback,
    )
