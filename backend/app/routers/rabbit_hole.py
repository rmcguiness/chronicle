"""
GET /api/rabbit-hole/random    — random high-importance event slug
GET /api/rabbit-hole/{slug}    — event detail + causes + effects for rabbit-hole explorer
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2.functions import ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event
from app.schemas import _LINK_TYPE_MAP

router = APIRouter(prefix="/api/rabbit-hole", tags=["rabbit-hole"])


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────


class RabbitHoleEventBrief(BaseModel):
    """Compact event used in causes/effects lists."""

    slug: str
    title: str
    year_approx: int | None
    region: str | None
    category: str | None
    importance_score: float
    article_summary: str | None


class RabbitHoleDetail(BaseModel):
    """Full event detail for the rabbit-hole focus card."""

    slug: str
    title: str
    year_approx: int | None
    is_bce: bool
    region: str | None
    geo_era_label: str | None
    category: str | None
    importance_score: float
    article_summary: str | None
    causes: list[RabbitHoleEventBrief]
    effects: list[RabbitHoleEventBrief]


class RandomEventResponse(BaseModel):
    """Slug of a random high-importance event."""

    slug: str


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/rabbit-hole/random
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/random", response_model=RandomEventResponse)
async def random_event(db: AsyncSession = Depends(get_db)) -> RandomEventResponse:
    """Return the slug of a random event with importance_score > 0.7."""
    stmt = (
        select(Event.slug)
        .where(
            Event.importance_score > 0.7,
            Event.review_status == "approved",
        )
        .order_by(func.random())
        .limit(1)
    )
    result = await db.execute(stmt)
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="No events found")
    return RandomEventResponse(slug=row.slug)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/rabbit-hole/{slug}
# ─────────────────────────────────────────────────────────────────────────────


async def _build_brief(event_id: UUID, db: AsyncSession) -> RabbitHoleEventBrief | None:
    """Load a compact event brief by ID."""
    stmt = select(
        Event.slug,
        Event.title,
        Event.year_approx,
        Event.geo_modern,
        Event.event_category,
        Event.importance_score,
    ).where(Event.id == event_id)
    result = await db.execute(stmt)
    row = result.fetchone()
    if row is None:
        return None
    return RabbitHoleEventBrief(
        slug=row.slug,
        title=row.title,
        year_approx=row.year_approx,
        region=row.geo_modern,
        category=row.event_category,
        importance_score=row.importance_score,
        article_summary=None,
    )


@router.get("/{slug}", response_model=RabbitHoleDetail)
async def get_rabbit_hole_event(
    slug: str, db: AsyncSession = Depends(get_db)
) -> RabbitHoleDetail:
    """Return event detail + causes (incoming links) + effects (outgoing links).

    If the event has no causality links, returns up to 3 random events from
    the same era and region as "related" in the effects list.
    """
    # ── 1. Load the event ────────────────────────────────────────────────────
    ev_stmt = select(
        Event.id,
        Event.slug,
        Event.title,
        Event.year_approx,
        Event.is_bce,
        Event.geo_modern,
        Event.geo_era_label,
        Event.event_category,
        Event.importance_score,
    ).where(Event.slug == slug)
    ev_result = await db.execute(ev_stmt)
    ev = ev_result.fetchone()
    if ev is None:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")

    event_id: UUID = ev.id

    # ── 2. Load causality links ──────────────────────────────────────────────
    link_stmt = select(
        CausalityLink.cause_event_id,
        CausalityLink.effect_event_id,
        CausalityLink.link_type,
        CausalityLink.strength,
    ).where(
        or_(
            CausalityLink.cause_event_id == event_id,
            CausalityLink.effect_event_id == event_id,
        )
    )
    link_result = await db.execute(link_stmt)
    raw_links = link_result.fetchall()

    cause_ids: list[UUID] = []
    effect_ids: list[UUID] = []
    for lnk in raw_links:
        if lnk.cause_event_id == event_id:
            effect_ids.append(lnk.effect_event_id)
        else:
            cause_ids.append(lnk.cause_event_id)

    # ── 3. Build cause/effect briefs (sorted by importance, limit 5) ─────────
    causes: list[RabbitHoleEventBrief] = []
    for cid in cause_ids:
        brief = await _build_brief(cid, db)
        if brief:
            causes.append(brief)
    causes.sort(key=lambda b: b.importance_score, reverse=True)
    causes = causes[:5]

    effects: list[RabbitHoleEventBrief] = []
    for eid in effect_ids:
        brief = await _build_brief(eid, db)
        if brief:
            effects.append(brief)
    effects.sort(key=lambda b: b.importance_score, reverse=True)
    effects = effects[:5]

    # ── 4. Fallback: same-era random events if no links ──────────────────────
    if not causes and not effects:
        year = ev.year_approx or 0
        fallback_stmt = (
            select(
                Event.slug,
                Event.title,
                Event.year_approx,
                Event.geo_modern,
                Event.event_category,
                Event.importance_score,
            )
            .where(
                Event.id != event_id,
                Event.review_status == "approved",
                Event.year_approx.isnot(None),
                Event.year_approx.between(year - 50, year + 50),
            )
            .order_by(func.random())
            .limit(3)
        )
        fb_result = await db.execute(fallback_stmt)
        for row in fb_result.fetchall():
            effects.append(
                RabbitHoleEventBrief(
                    slug=row.slug,
                    title=row.title,
                    year_approx=row.year_approx,
                    region=row.geo_modern,
                    category=row.event_category,
                    importance_score=row.importance_score,
                    article_summary=None,
                )
            )

    return RabbitHoleDetail(
        slug=ev.slug,
        title=ev.title,
        year_approx=ev.year_approx,
        is_bce=ev.is_bce,
        region=ev.geo_modern,
        geo_era_label=ev.geo_era_label,
        category=ev.event_category,
        importance_score=ev.importance_score,
        article_summary=None,
        causes=causes,
        effects=effects,
    )
