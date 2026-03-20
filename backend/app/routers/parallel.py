"""
GET /api/parallel — parallel history comparison endpoint.

Returns events from two regions within a year range, plus cross-region
causality links, for the side-by-side timeline comparison view.
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import func

from app.database import get_db
from app.models import CausalityLink, Event

# Maximum events returned per region to keep payloads manageable
MAX_EVENTS_PER_REGION = 100

router = APIRouter(prefix="/api/parallel", tags=["parallel"])


# ── Response schemas ──────────────────────────────────────────────────────────


class ParallelEventItem(BaseModel):
    """Compact event representation for the parallel timeline."""
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    event_category: str | None
    importance_score: float
    article_summary: str | None
    region: str | None

    class Config:
        from_attributes = True


class ParallelCrossLink(BaseModel):
    """A causality link connecting events across the two compared regions."""
    id: UUID
    cause_event_id: UUID
    effect_event_id: UUID
    link_type: str | None
    strength: float
    description: str | None

    class Config:
        from_attributes = True


class ParallelResponse(BaseModel):
    """Full response for the parallel comparison endpoint."""
    region1: list[ParallelEventItem]
    region2: list[ParallelEventItem]
    cross_links: list[ParallelCrossLink]


# ── Region name normalisation ────────────────────────────────────────────────

REGION_MAP: dict[str, list[str]] = {
    "europe": ["europe"],
    "americas": ["americas"],
    "africa": ["africa"],
    "asia": ["asia"],
    "middle_east": ["middle east", "middle_east"],
    "east_asia": ["east asia", "east_asia"],
    "south_asia": ["south asia", "south_asia"],
    "southeast_asia": ["southeast asia", "southeast_asia"],
    "oceania": ["oceania"],
}


def _region_filter(column, region_key: str):
    """Build an OR filter matching any known variant of a region key."""
    variants = REGION_MAP.get(region_key.lower(), [region_key])
    return or_(*[func.lower(column) == v.lower() for v in variants])


# ── Endpoint ──────────────────────────────────────────────────────────────────


@router.get("", response_model=ParallelResponse)
async def get_parallel(
    region1: str = Query(..., description="First region key (e.g. 'europe')"),
    region2: str = Query(..., description="Second region key (e.g. 'asia')"),
    start_year: int = Query(default=-3000, alias="startYear", description="Start year (negative = BCE)"),
    end_year: int = Query(default=2024, alias="endYear", description="End year"),
    db: AsyncSession = Depends(get_db),
) -> ParallelResponse:
    """Return events from two regions in a year range with cross-region causality links."""

    async def _fetch_region(region_key: str) -> list[ParallelEventItem]:
        stmt = (
            select(Event)
            .where(
                and_(
                    _region_filter(Event.region, region_key),
                    Event.year_approx >= start_year,
                    Event.year_approx <= end_year,
                )
            )
            .order_by(Event.year_approx, Event.importance_score.desc())
            .limit(MAX_EVENTS_PER_REGION)
        )
        result = await db.execute(stmt)
        rows = result.scalars().all()
        return [ParallelEventItem.model_validate(r) for r in rows]

    r1_events = await _fetch_region(region1)
    r2_events = await _fetch_region(region2)

    # Collect all event IDs to find cross-region links
    r1_ids = {e.id for e in r1_events}
    r2_ids = {e.id for e in r2_events}

    cross_links: list[ParallelCrossLink] = []
    if r1_ids and r2_ids:
        stmt = select(CausalityLink).where(
            or_(
                and_(
                    CausalityLink.cause_event_id.in_(r1_ids),
                    CausalityLink.effect_event_id.in_(r2_ids),
                ),
                and_(
                    CausalityLink.cause_event_id.in_(r2_ids),
                    CausalityLink.effect_event_id.in_(r1_ids),
                ),
            )
        )
        result = await db.execute(stmt)
        for link in result.scalars().all():
            cross_links.append(ParallelCrossLink(
                id=link.id,
                cause_event_id=link.cause_event_id,
                effect_event_id=link.effect_event_id,
                link_type=link.link_type,
                strength=link.strength,
                description=link.description,
            ))

    return ParallelResponse(
        region1=r1_events,
        region2=r2_events,
        cross_links=cross_links,
    )
