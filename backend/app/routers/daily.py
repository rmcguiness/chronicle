"""
Daily History Challenge — Wordle-style daily event guessing game.

GET /api/daily         — today's challenge event (no year revealed)
GET /api/daily/reveal  — reveal the answer (year + summary) after game ends
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event


router = APIRouter(prefix="/api/daily", tags=["daily"])


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────


class DailyChallengeOut(BaseModel):
    """Today's challenge — intentionally omits year_approx."""

    slug: str
    title: str
    category: str | None
    region: str | None
    importance_score: float
    day_number: int


class DailyRevealOut(BaseModel):
    """Revealed after game ends — includes the answer."""

    slug: str
    year_approx: int | None
    is_bce: bool
    article_summary: str | None
    geo_modern: str | None


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────


def _day_number_utc() -> int:
    """Days since epoch (UTC) — unique per calendar day, deterministic."""
    now = datetime.now(tz=timezone.utc)
    epoch = datetime(2024, 1, 1, tzinfo=timezone.utc)
    return (now - epoch).days


async def _pick_daily_event(db: AsyncSession) -> Event:
    """Deterministically select today's event from all approved events with importance > 0.6."""
    day = _day_number_utc()

    # Count eligible events
    count_q = select(func.count()).select_from(Event).where(
        Event.review_status == "approved",
        Event.importance_score > 0.6,
        Event.year_approx.is_not(None),
    )
    total = (await db.execute(count_q)).scalar() or 0
    if total == 0:
        raise HTTPException(status_code=503, detail="No eligible events for daily challenge")

    # Deterministic offset using day number — scramble with a prime multiplier
    offset = (day * 7 + 13) % total

    pick_q = (
        select(Event)
        .where(
            Event.review_status == "approved",
            Event.importance_score > 0.6,
            Event.year_approx.is_not(None),
        )
        .order_by(Event.id)
        .offset(offset)
        .limit(1)
    )
    result = await db.execute(pick_q)
    event = result.scalar_one_or_none()
    if event is None:
        raise HTTPException(status_code=503, detail="Failed to select daily event")
    return event


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────


@router.get("", response_model=DailyChallengeOut)
async def get_daily_challenge(
    db: AsyncSession = Depends(get_db),
) -> DailyChallengeOut:
    """Return today's daily challenge event. Year is NOT included."""
    event = await _pick_daily_event(db)
    return DailyChallengeOut(
        slug=event.slug,
        title=event.title,
        category=event.event_category,
        region=event.geo_modern,
        importance_score=event.importance_score,
        day_number=_day_number_utc(),
    )


@router.get("/reveal", response_model=DailyRevealOut)
async def reveal_daily(
    db: AsyncSession = Depends(get_db),
) -> DailyRevealOut:
    """Reveal the answer for today's daily challenge."""
    event = await _pick_daily_event(db)

    # Try to get a short description from the first perspective
    summary: str | None = None
    if event.perspectives:
        for p in event.perspectives:
            if p.summary:
                summary = p.summary
                break

    return DailyRevealOut(
        slug=event.slug,
        year_approx=event.year_approx,
        is_bce=event.is_bce or False,
        article_summary=summary,
        geo_modern=event.geo_modern,
    )
