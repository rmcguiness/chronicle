"""
GET /api/people/{slug}  — person detail with connected events + contemporaries

The slug is derived from the person's name: lowercased, spaces/punctuation replaced
with hyphens, consecutive hyphens collapsed (e.g. "Julius Caesar" → "julius-caesar").
"""
from __future__ import annotations

import re
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Event, EventPerson, Person

router = APIRouter(prefix="/api/people", tags=["people"])


def _slugify(name: str) -> str:
    """Convert a person name to a URL slug."""
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip("-")


# ─────────────────────────────────────────────────────────────────────────────
# Response models (co-located with the router to keep schemas.py unchanged)
# ─────────────────────────────────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Optional


class PersonEventItem(BaseModel):
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    category: str | None
    description: str | None
    role: str | None
    role_notes: str | None


class ContemporaryItem(BaseModel):
    id: UUID
    name: str
    slug: str
    birth_year: int | None
    death_year: int | None
    roles: list[str] | None
    image_url: str | None


class PersonDetailOut(BaseModel):
    id: UUID
    name: str
    slug: str
    aliases: list[str] | None
    birth_year: int | None
    birth_year_circa: bool
    death_year: int | None
    death_year_circa: bool
    nationalities: list[str] | None
    roles: list[str] | None
    gender: str | None
    description: str | None
    image_url: str | None
    wikipedia_slug: str | None
    wikidata_id: str | None
    events: list[PersonEventItem]
    contemporaries: list[ContemporaryItem]


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/{slug}", response_model=PersonDetailOut)
async def get_person(slug: str, db: AsyncSession = Depends(get_db)) -> PersonDetailOut:
    """Full person detail including connected events and contemporaries."""

    # Look up person by matching slugified name.
    # We apply the same slugification in SQL: lower + replace spaces with hyphens.
    # For robustness, fetch all people and match in Python (people table is small).
    stmt = select(Person).options(selectinload(Person.event_people))
    result = await db.execute(stmt)
    people = result.scalars().all()

    person: Person | None = None
    for p in people:
        if _slugify(p.name) == slug:
            person = p
            break

    if person is None:
        raise HTTPException(status_code=404, detail=f"Person '{slug}' not found")

    person_slug = _slugify(person.name)

    # ── Connected events ──────────────────────────────────────────────────
    ep_stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            EventPerson.role,
            EventPerson.role_notes,
        )
        .join(EventPerson, EventPerson.event_id == Event.id)
        .where(EventPerson.person_id == person.id)
        .order_by(Event.year_approx.asc().nullslast())
    )
    ep_result = await db.execute(ep_stmt)
    event_rows = ep_result.fetchall()

    events_out = [
        PersonEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            category=row.event_category,
            description=None,
            role=row.role,
            role_notes=row.role_notes,
        )
        for row in event_rows
    ]

    # ── Contemporaries (birth/death year overlap) ─────────────────────────
    contemporaries_out: list[ContemporaryItem] = []
    if person.birth_year is not None or person.death_year is not None:
        birth = person.birth_year or person.death_year
        death = person.death_year or person.birth_year
        assert birth is not None and death is not None

        # Other people whose lifespans overlap: their birth <= this death AND their death >= this birth
        contemp_stmt = (
            select(Person)
            .where(
                Person.id != person.id,
                or_(
                    # Has both birth and death years — check overlap
                    and_(
                        Person.birth_year.isnot(None),
                        Person.death_year.isnot(None),
                        Person.birth_year <= death,
                        Person.death_year >= birth,
                    ),
                    # Has only birth year — alive during this person's lifetime
                    and_(
                        Person.birth_year.isnot(None),
                        Person.death_year.is_(None),
                        Person.birth_year <= death,
                        Person.birth_year >= birth,
                    ),
                    # Has only death year
                    and_(
                        Person.death_year.isnot(None),
                        Person.birth_year.is_(None),
                        Person.death_year >= birth,
                        Person.death_year <= death,
                    ),
                ),
            )
            .limit(20)
        )
        contemp_result = await db.execute(contemp_stmt)
        for c in contemp_result.scalars().all():
            contemporaries_out.append(
                ContemporaryItem(
                    id=c.id,
                    name=c.name,
                    slug=_slugify(c.name),
                    birth_year=c.birth_year,
                    death_year=c.death_year,
                    roles=c.roles,
                    image_url=c.image_url,
                )
            )

    return PersonDetailOut(
        id=person.id,
        name=person.name,
        slug=person_slug,
        aliases=person.aliases,
        birth_year=person.birth_year,
        birth_year_circa=person.birth_year_circa,
        death_year=person.death_year,
        death_year_circa=person.death_year_circa,
        nationalities=person.nationalities,
        roles=person.roles,
        gender=person.gender,
        description=person.description,
        image_url=person.image_url,
        wikipedia_slug=person.wikipedia_slug,
        wikidata_id=person.wikidata_id,
        events=events_out,
        contemporaries=contemporaries_out,
    )
