"""
People directory API endpoints.

GET /api/people — list all people with event counts, search, era filter, sort
"""
from __future__ import annotations

import re
from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import EventPerson, Person

router = APIRouter(prefix="/api/people", tags=["people"])


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def person_slug(name: str) -> str:
    """Convert person name to URL slug."""
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


ERA_RANGES: dict[str, tuple[int | None, int | None]] = {
    "ancient":       (None, -500),
    "classical":     (-500, 500),
    "medieval":      (500, 1500),
    "early-modern":  (1500, 1700),
    "modern":        (1700, 1900),
    "contemporary":  (1900, None),
}


def classify_person_era(birth_year: int | None) -> str:
    """Classify a person's era based on birth year."""
    if birth_year is None:
        return "unknown"
    for era, (lo, hi) in ERA_RANGES.items():
        if (lo is None or birth_year >= lo) and (hi is None or birth_year < hi):
            return era
    return "unknown"


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────

class PersonListItem(BaseModel):
    id: str
    name: str
    slug: str
    birth_year: int | None
    death_year: int | None
    birth_year_circa: bool
    death_year_circa: bool
    description: str | None
    nationalities: list[str] | None
    roles: list[str] | None
    event_count: int
    era: str
    wikipedia_slug: str | None
    image_url: str | None


class PeopleListResponse(BaseModel):
    people: list[PersonListItem]
    total: int
    era_counts: dict[str, int]


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("", response_model=PeopleListResponse)
async def list_people(
    q: Optional[str] = Query(default=None, description="Search by name"),
    era: Optional[str] = Query(default=None, description="Filter by era key"),
    sort: Optional[str] = Query(default="name", description="Sort: name, events, birth_year, -birth_year"),
    db: AsyncSession = Depends(get_db),
) -> PeopleListResponse:
    """Return all people with event counts, search, era filter, and sort."""
    # Subquery: event count per person
    event_count_sq = (
        select(
            EventPerson.person_id,
            func.count(EventPerson.event_id.distinct()).label("event_count"),
        )
        .group_by(EventPerson.person_id)
        .subquery()
    )

    stmt = (
        select(
            Person,
            func.coalesce(event_count_sq.c.event_count, 0).label("event_count"),
        )
        .outerjoin(event_count_sq, Person.id == event_count_sq.c.person_id)
    )

    # Name search filter
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(Person.name.ilike(pattern))

    result = await db.execute(stmt)
    rows = result.all()

    # Build items and compute era counts (before era filter, for tab counts)
    all_items: list[PersonListItem] = []
    era_counts: dict[str, int] = {}

    for person, ev_count in rows:
        p_era = classify_person_era(person.birth_year)
        era_counts[p_era] = era_counts.get(p_era, 0) + 1
        all_items.append(PersonListItem(
            id=str(person.id),
            name=person.name,
            slug=person_slug(person.name),
            birth_year=person.birth_year,
            death_year=person.death_year,
            birth_year_circa=person.birth_year_circa,
            death_year_circa=person.death_year_circa,
            description=person.description,
            nationalities=person.nationalities,
            roles=person.roles,
            event_count=ev_count,
            era=p_era,
            wikipedia_slug=person.wikipedia_slug,
            image_url=person.image_url,
        ))

    # Era filter (after counting for tabs)
    if era and era in ERA_RANGES:
        all_items = [p for p in all_items if p.era == era]

    # Sort
    if sort == "events":
        all_items.sort(key=lambda p: (-p.event_count, p.name))
    elif sort == "birth_year":
        all_items.sort(key=lambda p: (p.birth_year if p.birth_year is not None else 99999, p.name))
    elif sort == "-birth_year":
        all_items.sort(key=lambda p: (-(p.birth_year if p.birth_year is not None else -99999), p.name))
    else:  # default: name
        all_items.sort(key=lambda p: p.name.lower())

    return PeopleListResponse(
        people=all_items,
        total=len(all_items),
        era_counts=era_counts,
    )
