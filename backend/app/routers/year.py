"""
GET /api/year/{year} — Year in Review endpoint.

Returns events, notable people, and causality context for a given year.
Events use a ±2 year buffer for sparse years; people use ±5.
"""
from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select, and_, or_, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson, Person

# ── Constants ────────────────────────────────────────────────────────────────
YEAR_BUFFER_EVENTS = 2
YEAR_BUFFER_REGIONS = 5
MAX_HEADLINES = 6
HEADLINE_MIN_IMPORTANCE = 0.7
MAX_PEOPLE = 8

router = APIRouter(prefix="/api/year", tags=["year"])


# ── Response schemas ─────────────────────────────────────────────────────────

class YearEventItem(BaseModel):
    """A single event in the year response."""
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    date_display: str | None
    category: str | None
    importance_score: float
    region: str | None
    short_description: str | None


class YearPersonItem(BaseModel):
    """A notable person active during the year."""
    id: UUID
    name: str
    birth_year: int | None
    death_year: int | None
    roles: list[str] | None
    description: str | None
    image_url: str | None


class CausalityItem(BaseModel):
    """A causality link with event summary."""
    link_id: UUID
    source_event_id: UUID
    source_event_title: str
    source_event_slug: str
    source_year: int | None
    target_event_id: UUID
    target_event_title: str
    target_event_slug: str
    target_year: int | None
    link_type: str | None
    strength: float | None


class YearResponse(BaseModel):
    """Full response for /api/year/{year}."""
    year: int
    era_label: str
    events_count: int
    headlines: list[YearEventItem]
    events_by_region: dict[str, list[YearEventItem]]
    people: list[YearPersonItem]
    forward_links: list[CausalityItem]
    backward_links: list[CausalityItem]


# ── Helpers ──────────────────────────────────────────────────────────────────

def get_era_label(year: int) -> str:
    """Return a human-readable era label for a given year."""
    if year < -3000:
        return "Prehistoric"
    if year < -1200:
        return "Bronze Age"
    if year < -800:
        return "Iron Age"
    if year < -500:
        return "Archaic Period"
    if year < -323:
        return "Classical Antiquity"
    if year < -31:
        return "Hellenistic Period"
    if year < 0:
        return "Late Republic"
    if year < 285:
        return "Roman Imperial"
    if year < 476:
        return "Late Antiquity"
    if year < 800:
        return "Early Medieval"
    if year < 1066:
        return "High Medieval"
    if year < 1300:
        return "High Medieval"
    if year < 1500:
        return "Late Medieval"
    if year < 1600:
        return "Renaissance"
    if year < 1700:
        return "Early Modern"
    if year < 1800:
        return "Age of Enlightenment"
    if year < 1900:
        return "Industrial Age"
    if year < 1945:
        return "Early 20th Century"
    if year < 2000:
        return "Post-War Modern"
    return "Contemporary"


def _event_to_item(e: Event) -> YearEventItem:
    """Convert an Event ORM object to a YearEventItem."""
    return YearEventItem(
        id=e.id,
        slug=e.slug,
        title=e.title,
        year_approx=e.year_approx,
        date_display=e.date_notes or (str(e.year_approx) if e.year_approx else None),
        category=e.event_category,
        importance_score=e.importance_score or 0.0,
        region=e.region,
        short_description=(e.article_summary[:200] if e.article_summary else None),
    )


# ── Regions ──────────────────────────────────────────────────────────────────
REGIONS = ["Europe", "Middle East", "Africa", "Asia", "Americas", "Oceania"]


@router.get("/{year}", response_model=YearResponse)
async def get_year(year: int, db: AsyncSession = Depends(get_db)) -> YearResponse:
    """
    GET /api/year/{year}

    Returns events, notable people, and causality context for the given year.
    """

    # ── 1. Count exact-year events ───────────────────────────────────────────
    count_q = select(func.count()).select_from(Event).where(
        Event.year_approx == year,
        Event.review_status == "approved",
    )
    events_count = (await db.execute(count_q)).scalar() or 0

    # ── 2. Headlines: top events by importance (±2 year buffer) ──────────────
    headlines_q = (
        select(Event)
        .where(
            Event.year_approx.between(year - YEAR_BUFFER_EVENTS, year + YEAR_BUFFER_EVENTS),
            Event.review_status == "approved",
            Event.importance_score >= HEADLINE_MIN_IMPORTANCE,
        )
        .order_by(Event.importance_score.desc())
        .limit(MAX_HEADLINES)
    )
    headlines_result = await db.execute(headlines_q)
    headlines = [_event_to_item(e) for e in headlines_result.scalars().all()]

    # ── 3. Events by region (±5 year buffer for sparse years) ────────────────
    region_q = (
        select(Event)
        .where(
            Event.year_approx.between(year - YEAR_BUFFER_REGIONS, year + YEAR_BUFFER_REGIONS),
            Event.review_status == "approved",
            Event.region.isnot(None),
        )
        .order_by(Event.importance_score.desc())
    )
    region_result = await db.execute(region_q)
    all_region_events = region_result.scalars().all()

    events_by_region: dict[str, list[YearEventItem]] = {r: [] for r in REGIONS}
    for e in all_region_events:
        region = e.region
        if region in events_by_region:
            events_by_region[region].append(_event_to_item(e))
        # Map unknown regions to closest match or skip

    # ── 4. Notable people ────────────────────────────────────────────────────
    people_q = (
        select(Person)
        .where(
            or_(
                # Born in this era
                Person.birth_year.between(year - 5, year + 5),
                # Alive during this year
                and_(
                    Person.birth_year <= year,
                    or_(
                        Person.death_year.is_(None),
                        Person.death_year >= year,
                    ),
                ),
            )
        )
        .order_by(Person.birth_year.asc())
        .limit(MAX_PEOPLE)
    )
    people_result = await db.execute(people_q)
    people = [
        YearPersonItem(
            id=p.id,
            name=p.name,
            birth_year=p.birth_year,
            death_year=p.death_year,
            roles=p.roles,
            description=p.description,
            image_url=p.image_url,
        )
        for p in people_result.scalars().all()
    ]

    # ── 5. Causality: forward links (this year's events → future) ────────────
    cause_alias = select(Event).where(
        Event.year_approx == year,
        Event.review_status == "approved",
    ).subquery()

    forward_q = (
        select(
            CausalityLink.id.label("link_id"),
            CausalityLink.cause_event_id,
            CausalityLink.effect_event_id,
            CausalityLink.link_type,
            CausalityLink.strength,
        )
        .where(
            CausalityLink.cause_event_id.in_(
                select(Event.id).where(
                    Event.year_approx == year,
                    Event.review_status == "approved",
                )
            )
        )
    )
    forward_result = await db.execute(forward_q)
    forward_rows = forward_result.all()

    # Collect all event IDs we need to look up
    fwd_event_ids = set()
    for row in forward_rows:
        fwd_event_ids.add(row.cause_event_id)
        fwd_event_ids.add(row.effect_event_id)

    # Backward links (prior events → this year's events)
    backward_q = (
        select(
            CausalityLink.id.label("link_id"),
            CausalityLink.cause_event_id,
            CausalityLink.effect_event_id,
            CausalityLink.link_type,
            CausalityLink.strength,
        )
        .where(
            CausalityLink.effect_event_id.in_(
                select(Event.id).where(
                    Event.year_approx == year,
                    Event.review_status == "approved",
                )
            )
        )
    )
    backward_result = await db.execute(backward_q)
    backward_rows = backward_result.all()

    bwd_event_ids = set()
    for row in backward_rows:
        bwd_event_ids.add(row.cause_event_id)
        bwd_event_ids.add(row.effect_event_id)

    # Fetch all referenced events in one query
    all_link_ids = fwd_event_ids | bwd_event_ids
    event_map: dict[UUID, Event] = {}
    if all_link_ids:
        ev_q = select(Event).where(Event.id.in_(list(all_link_ids)))
        ev_result = await db.execute(ev_q)
        for ev in ev_result.scalars().all():
            event_map[ev.id] = ev

    def _build_causality(rows: list, is_forward: bool) -> list[CausalityItem]:
        items = []
        for row in rows:
            cause = event_map.get(row.cause_event_id)
            effect = event_map.get(row.effect_event_id)
            if not cause or not effect:
                continue
            items.append(CausalityItem(
                link_id=row.link_id,
                source_event_id=cause.id,
                source_event_title=cause.title,
                source_event_slug=cause.slug,
                source_year=cause.year_approx,
                target_event_id=effect.id,
                target_event_title=effect.title,
                target_event_slug=effect.slug,
                target_year=effect.year_approx,
                link_type=row.link_type,
                strength=row.strength,
            ))
        return items

    forward_links = _build_causality(forward_rows, True)
    backward_links = _build_causality(backward_rows, False)

    return YearResponse(
        year=year,
        era_label=get_era_label(year),
        events_count=events_count,
        headlines=headlines,
        events_by_region=events_by_region,
        people=people,
        forward_links=forward_links,
        backward_links=backward_links,
    )
