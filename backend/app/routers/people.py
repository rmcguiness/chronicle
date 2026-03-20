"""
People API — browse and search historical figures.

Endpoints:
  GET /api/people          — list all people with filters (name, era, region, sort)
  GET /api/people/{slug}   — person detail + connected events (via wikipedia_slug)
"""
from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func, select, or_, String, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Event, EventPerson, Person

router = APIRouter(prefix="/api/people", tags=["people"])

# ── Era boundaries (negative = BCE) ──────────────────────────────────────────
ERA_RANGES = {
    "ancient": (-10000, -800),
    "classical": (-800, 500),
    "medieval": (500, 1500),
    "modern": (1500, 1900),
    "contemporary": (1900, 2100),
}


# ── Response schemas ─────────────────────────────────────────────────────────

class PersonListItem(BaseModel):
    """Summary of a person for list/grid views."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    birth_year_circa: bool = False
    death_year_circa: bool = False
    description: Optional[str] = None
    nationalities: Optional[list[str]] = None
    roles: Optional[list[str]] = None
    wikipedia_slug: Optional[str] = None
    image_url: Optional[str] = None
    event_count: int = 0


class ConnectedEventItem(BaseModel):
    """An event connected to a person."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None
    role: str
    role_notes: Optional[str] = None


class PersonDetailOut(BaseModel):
    """Full person detail with connected events."""
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    aliases: Optional[list[str]] = None
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    birth_year_circa: bool = False
    death_year_circa: bool = False
    description: Optional[str] = None
    nationalities: Optional[list[str]] = None
    roles: Optional[list[str]] = None
    gender: Optional[str] = None
    wikipedia_slug: Optional[str] = None
    image_url: Optional[str] = None
    wikidata_id: Optional[str] = None
    connected_events: list[ConnectedEventItem] = []


class PeopleListResponse(BaseModel):
    """Paginated list of people."""
    people: list[PersonListItem]
    total: int


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("", response_model=PeopleListResponse)
async def list_people(
    search: Optional[str] = Query(default=None, description="Filter by name (case-insensitive substring)"),
    era: Optional[str] = Query(default=None, description="Era filter: ancient|classical|medieval|modern|contemporary"),
    region: Optional[str] = Query(default=None, description="Filter by nationality"),
    sort: str = Query(default="birth_year_asc", description="Sort: birth_year_asc|birth_year_desc|name|event_count"),
    db: AsyncSession = Depends(get_db),
) -> PeopleListResponse:
    """List all people with optional filters and sorting."""

    # Subquery for event count per person
    event_count_sq = (
        select(
            EventPerson.person_id,
            func.count(func.distinct(EventPerson.event_id)).label("event_count"),
        )
        .group_by(EventPerson.person_id)
        .subquery()
    )

    stmt = (
        select(Person, func.coalesce(event_count_sq.c.event_count, 0).label("event_count"))
        .outerjoin(event_count_sq, Person.id == event_count_sq.c.person_id)
    )

    # Filters
    if search:
        stmt = stmt.where(Person.name.ilike(f"%{search}%"))

    if era and era in ERA_RANGES:
        lo, hi = ERA_RANGES[era]
        stmt = stmt.where(Person.birth_year.isnot(None), Person.birth_year >= lo, Person.birth_year < hi)

    if region:
        stmt = stmt.where(Person.nationalities.any(region))

    # Sorting
    if sort == "birth_year_desc":
        stmt = stmt.order_by(Person.birth_year.desc().nulls_last())
    elif sort == "name":
        stmt = stmt.order_by(Person.name.asc())
    elif sort == "event_count":
        stmt = stmt.order_by(func.coalesce(event_count_sq.c.event_count, 0).desc())
    else:  # birth_year_asc (default)
        stmt = stmt.order_by(Person.birth_year.asc().nulls_last())

    result = await db.execute(stmt)
    rows = result.all()

    people = []
    for row in rows:
        person = row[0]
        count = row[1]
        item = PersonListItem(
            id=person.id,
            name=person.name,
            birth_year=person.birth_year,
            death_year=person.death_year,
            birth_year_circa=person.birth_year_circa,
            death_year_circa=person.death_year_circa,
            description=person.description,
            nationalities=person.nationalities,
            roles=person.roles,
            wikipedia_slug=person.wikipedia_slug,
            image_url=person.image_url,
            event_count=count,
        )
        people.append(item)

    return PeopleListResponse(people=people, total=len(people))


@router.get("/{slug}", response_model=PersonDetailOut)
async def get_person(slug: str, db: AsyncSession = Depends(get_db)) -> PersonDetailOut:
    """Get a single person by wikipedia_slug, with connected events."""

    stmt = select(Person).where(Person.wikipedia_slug == slug)
    result = await db.execute(stmt)
    person = result.scalar_one_or_none()

    if not person:
        raise HTTPException(status_code=404, detail=f"Person with slug '{slug}' not found")

    # Fetch connected events
    ev_stmt = (
        select(Event, EventPerson.role, EventPerson.role_notes)
        .join(EventPerson, EventPerson.event_id == Event.id)
        .where(EventPerson.person_id == person.id)
        .order_by(Event.year_approx.asc().nulls_last())
    )
    ev_result = await db.execute(ev_stmt)
    ev_rows = ev_result.all()

    connected = [
        ConnectedEventItem(
            id=ev.id,
            slug=ev.slug,
            title=ev.title,
            year_approx=ev.year_approx,
            category=ev.event_category,
            role=role,
            role_notes=role_notes,
        )
        for ev, role, role_notes in ev_rows
    ]

    return PersonDetailOut(
        id=person.id,
        name=person.name,
        aliases=person.aliases,
        birth_year=person.birth_year,
        death_year=person.death_year,
        birth_year_circa=person.birth_year_circa,
        death_year_circa=person.death_year_circa,
        description=person.description,
        nationalities=person.nationalities,
        roles=person.roles,
        gender=person.gender,
        wikipedia_slug=person.wikipedia_slug,
        image_url=person.image_url,
        wikidata_id=person.wikidata_id,
        connected_events=connected,
    )
