"""
GET /api/featured — curated editorial content for the Featured page.

Returns: event of the week, person spotlight, featured era, hidden gem,
did-you-know facts, and trending events (by causality link count).
"""
from __future__ import annotations

import hashlib
import random
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson, Person, Perspective

router = APIRouter(prefix="/api/featured", tags=["featured"])


# ── Response schemas ─────────────────────────────────────────────────────────


class FeaturedEvent(BaseModel):
    id: str
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None
    importance_score: float = 0.5
    region: Optional[str] = None
    summary: Optional[str] = None
    causality_count: int = 0


class FeaturedPerson(BaseModel):
    id: str
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    roles: list[str] = []
    description: Optional[str] = None
    event_count: int = 0
    wikipedia_slug: Optional[str] = None


class FeaturedEra(BaseModel):
    name: str
    year_start: int
    year_end: int
    description: str
    color: str
    top_events: list[FeaturedEvent] = []


class FeaturedResponse(BaseModel):
    event_of_the_week: Optional[FeaturedEvent] = None
    person_spotlight: Optional[FeaturedPerson] = None
    featured_era: Optional[FeaturedEra] = None
    hidden_gem: Optional[FeaturedEvent] = None
    did_you_know: list[str] = []
    trending: list[FeaturedEvent] = []


# ── Predefined eras ──────────────────────────────────────────────────────────

ERAS = [
    {
        "name": "The Ancient World",
        "year_start": -3000,
        "year_end": -500,
        "description": "From the rise of Mesopotamian city-states to the dawn of Classical Greece — humanity's first empires, writing systems, and monumental architecture.",
        "color": "#d97706",
    },
    {
        "name": "Classical Antiquity",
        "year_start": -500,
        "year_end": 500,
        "description": "The age of Athens and Rome, the Silk Road, and the great philosophical traditions that still shape our world.",
        "color": "#7c3aed",
    },
    {
        "name": "The Medieval World",
        "year_start": 500,
        "year_end": 1400,
        "description": "Feudal kingdoms, the Islamic Golden Age, Viking expansion, and the seeds of the Renaissance.",
        "color": "#059669",
    },
    {
        "name": "Age of Exploration",
        "year_start": 1400,
        "year_end": 1700,
        "description": "Maritime voyages reshaped the globe — the Columbian Exchange, the printing press, and the Scientific Revolution.",
        "color": "#2563eb",
    },
    {
        "name": "Revolutions & Enlightenment",
        "year_start": 1700,
        "year_end": 1850,
        "description": "Political and industrial revolutions transformed society — from the fall of the Bastille to the steam engine.",
        "color": "#dc2626",
    },
    {
        "name": "The Modern Era",
        "year_start": 1850,
        "year_end": 1945,
        "description": "Rapid industrialization, world wars, and the birth of the modern nation-state system.",
        "color": "#475569",
    },
    {
        "name": "The Contemporary World",
        "year_start": 1945,
        "year_end": 2030,
        "description": "The Cold War, decolonization, the digital revolution, and globalization.",
        "color": "#0891b2",
    },
]


def _pick_era() -> dict:
    """Rotate era based on the current ISO week number."""
    week = datetime.now(tz=timezone.utc).isocalendar()[1]
    return ERAS[week % len(ERAS)]


# ── Endpoint ─────────────────────────────────────────────────────────────────


@router.get("", response_model=FeaturedResponse)
async def get_featured(
    seed: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
) -> FeaturedResponse:
    """Return curated editorial featured content."""

    rng = random.Random(seed) if seed is not None else random.Random()

    # ── Event of the Week: highest causality link count ──────────────────
    eotw_q = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
            func.count().label("link_count"),
        )
        .join(
            CausalityLink,
            (CausalityLink.cause_event_id == Event.id)
            | (CausalityLink.effect_event_id == Event.id),
        )
        .where(Event.review_status == "approved")
        .group_by(Event.id)
        .order_by(func.count().desc())
        .limit(1)
    )
    eotw_row = (await db.execute(eotw_q)).first()

    event_of_the_week = None
    if eotw_row:
        # Get a summary from the first perspective
        summary_q = (
            select(Perspective.summary, Perspective.narrative)
            .where(Perspective.event_id == eotw_row.id)
            .limit(1)
        )
        summary_row = (await db.execute(summary_q)).first()
        summary = None
        if summary_row:
            summary = summary_row.summary or (summary_row.narrative[:200] + "…" if summary_row.narrative and len(summary_row.narrative) > 200 else summary_row.narrative)

        event_of_the_week = FeaturedEvent(
            id=str(eotw_row.id),
            slug=eotw_row.slug,
            title=eotw_row.title,
            year_approx=eotw_row.year_approx,
            category=eotw_row.event_category,
            importance_score=eotw_row.importance_score or 0.5,
            region=eotw_row.geo_modern,
            summary=summary,
            causality_count=eotw_row.link_count,
        )

    # ── Person Spotlight: most event links ───────────────────────────────
    person_q = (
        select(
            Person.id,
            Person.name,
            Person.birth_year,
            Person.death_year,
            Person.roles,
            Person.description,
            Person.wikipedia_slug,
            func.count(EventPerson.event_id).label("event_count"),
        )
        .join(EventPerson, EventPerson.person_id == Person.id)
        .group_by(Person.id)
        .order_by(func.count(EventPerson.event_id).desc())
        .limit(1)
    )
    person_row = (await db.execute(person_q)).first()

    person_spotlight = None
    if person_row:
        person_spotlight = FeaturedPerson(
            id=str(person_row.id),
            name=person_row.name,
            birth_year=person_row.birth_year,
            death_year=person_row.death_year,
            roles=person_row.roles or [],
            description=person_row.description,
            event_count=person_row.event_count,
            wikipedia_slug=person_row.wikipedia_slug,
        )

    # ── Featured Era ─────────────────────────────────────────────────────
    era_data = _pick_era()
    era_events_q = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(
            Event.review_status == "approved",
            Event.year_approx >= era_data["year_start"],
            Event.year_approx <= era_data["year_end"],
        )
        .order_by(Event.importance_score.desc())
        .limit(3)
    )
    era_events = (await db.execute(era_events_q)).all()
    featured_era = FeaturedEra(
        name=era_data["name"],
        year_start=era_data["year_start"],
        year_end=era_data["year_end"],
        description=era_data["description"],
        color=era_data["color"],
        top_events=[
            FeaturedEvent(
                id=str(e.id),
                slug=e.slug,
                title=e.title,
                year_approx=e.year_approx,
                category=e.event_category,
                importance_score=e.importance_score or 0.5,
                region=e.geo_modern,
                causality_count=0,
            )
            for e in era_events
        ],
    )

    # ── Hidden Gem: random low-importance event ──────────────────────────
    gem_q = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(
            Event.review_status == "approved",
            Event.importance_score < 0.5,
        )
    )
    gem_rows = (await db.execute(gem_q)).all()
    hidden_gem = None
    if gem_rows:
        gem = rng.choice(gem_rows)
        # Get summary
        gem_summary_q = (
            select(Perspective.summary, Perspective.narrative)
            .where(Perspective.event_id == gem.id)
            .limit(1)
        )
        gem_summary_row = (await db.execute(gem_summary_q)).first()
        gem_summary = None
        if gem_summary_row:
            gem_summary = gem_summary_row.summary or (gem_summary_row.narrative[:200] + "…" if gem_summary_row.narrative and len(gem_summary_row.narrative) > 200 else gem_summary_row.narrative)

        hidden_gem = FeaturedEvent(
            id=str(gem.id),
            slug=gem.slug,
            title=gem.title,
            year_approx=gem.year_approx,
            category=gem.event_category,
            importance_score=gem.importance_score or 0.5,
            region=gem.geo_modern,
            summary=gem_summary,
            causality_count=0,
        )

    # ── Did You Know: surprising facts from event data ───────────────────
    did_you_know: list[str] = []

    # Oldest event
    oldest_q = (
        select(Event.title, Event.year_approx)
        .where(Event.review_status == "approved", Event.year_approx.isnot(None))
        .order_by(Event.year_approx.asc())
        .limit(1)
    )
    oldest = (await db.execute(oldest_q)).first()
    if oldest and oldest.year_approx is not None:
        yr = abs(oldest.year_approx)
        suffix = "BCE" if oldest.year_approx < 0 else "CE"
        did_you_know.append(f"The oldest event in Chronicle is \"{oldest.title}\" from {yr} {suffix}.")

    # Total events count
    count_q = select(func.count()).select_from(Event).where(Event.review_status == "approved")
    total = (await db.execute(count_q)).scalar() or 0
    did_you_know.append(f"Chronicle contains {total:,} historical events and counting.")

    # Most connected event
    if eotw_row:
        did_you_know.append(
            f"\"{eotw_row.title}\" is the most connected event with {eotw_row.link_count} causality links."
        )

    # Total causality links
    links_count = (await db.execute(select(func.count()).select_from(CausalityLink))).scalar() or 0
    did_you_know.append(f"There are {links_count:,} causality links mapping how events influenced each other.")

    # Category distribution — most common
    cat_q = (
        select(Event.event_category, func.count().label("cnt"))
        .where(Event.review_status == "approved", Event.event_category.isnot(None))
        .group_by(Event.event_category)
        .order_by(func.count().desc())
        .limit(1)
    )
    cat_row = (await db.execute(cat_q)).first()
    if cat_row:
        did_you_know.append(
            f"The most common event category is \"{cat_row.event_category}\" with {cat_row.cnt:,} events."
        )

    # Shuffle and pick 5
    rng.shuffle(did_you_know)
    did_you_know = did_you_know[:5]

    # ── Trending: top 5 events by causality link count ───────────────────
    trending_q = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
            func.count().label("link_count"),
        )
        .join(
            CausalityLink,
            (CausalityLink.cause_event_id == Event.id)
            | (CausalityLink.effect_event_id == Event.id),
        )
        .where(Event.review_status == "approved")
        .group_by(Event.id)
        .order_by(func.count().desc())
        .limit(5)
    )
    trending_rows = (await db.execute(trending_q)).all()
    trending = [
        FeaturedEvent(
            id=str(r.id),
            slug=r.slug,
            title=r.title,
            year_approx=r.year_approx,
            category=r.event_category,
            importance_score=r.importance_score or 0.5,
            region=r.geo_modern,
            causality_count=r.link_count,
        )
        for r in trending_rows
    ]

    return FeaturedResponse(
        event_of_the_week=event_of_the_week,
        person_spotlight=person_spotlight,
        featured_era=featured_era,
        hidden_gem=hidden_gem,
        did_you_know=did_you_know,
        trending=trending,
    )
