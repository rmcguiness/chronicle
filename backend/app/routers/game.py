"""
Game router — serves random events for the "Guess the Year" history game.

Endpoints:
    GET /api/game/event?difficulty=easy|medium|hard|random
    GET /api/game/reveal/{slug}
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Perspective

router = APIRouter(prefix="/api/game", tags=["game"])

# ── Difficulty → importance_score thresholds ─────────────────────────────────

_DIFFICULTY_THRESHOLDS: dict[str, float] = {
    "easy": 0.8,
    "medium": 0.5,
    "hard": 0.0,
    "random": 0.0,
}


# ── Response schemas ─────────────────────────────────────────────────────────


class GameEventOut(BaseModel):
    """Returned by GET /api/game/event — no year revealed."""

    slug: str
    title: str
    category: str | None
    importance_score: float


class GameRevealOut(BaseModel):
    """Returned by GET /api/game/reveal/{slug} — reveals year + summary."""

    slug: str
    title: str
    year_approx: int
    category: str | None
    importance_score: float
    article_summary: str | None
    region: str | None


# ── Endpoints ────────────────────────────────────────────────────────────────


@router.get("/event", response_model=GameEventOut)
async def get_game_event(
    difficulty: str = Query("medium", pattern="^(easy|medium|hard|random)$"),
    db: AsyncSession = Depends(get_db),
) -> GameEventOut:
    """
    Return a random approved event for the game.

    Filters by importance_score based on difficulty.
    Excludes events without a year_approx.
    """
    min_importance = _DIFFICULTY_THRESHOLDS.get(difficulty, 0.0)

    stmt = (
        select(Event)
        .where(
            Event.year_approx.isnot(None),
            Event.review_status == "approved",
            Event.importance_score >= min_importance,
        )
        .order_by(func.random())
        .limit(1)
    )

    result = await db.execute(stmt)
    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(status_code=404, detail="No events available for this difficulty")

    return GameEventOut(
        slug=event.slug,
        title=event.title,
        category=event.event_category,
        importance_score=event.importance_score,
    )


@router.get("/reveal/{slug}", response_model=GameRevealOut)
async def reveal_event(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> GameRevealOut:
    """
    Reveal the year and summary for a game event after the player guesses.
    """
    stmt = select(Event).where(Event.slug == slug)
    result = await db.execute(stmt)
    event = result.scalar_one_or_none()

    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    # Get summary from the first perspective (highest evidence_score)
    summary_stmt = (
        select(Perspective.summary)
        .where(Perspective.event_id == event.id)
        .order_by(Perspective.evidence_score.desc())
        .limit(1)
    )
    summary_result = await db.execute(summary_stmt)
    article_summary = summary_result.scalar_one_or_none()

    return GameRevealOut(
        slug=event.slug,
        title=event.title,
        year_approx=event.year_approx,
        category=event.event_category,
        importance_score=event.importance_score,
        article_summary=article_summary,
        region=event.geo_modern,
    )
