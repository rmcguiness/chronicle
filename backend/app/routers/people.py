"""
People API routes.

GET /api/people            — list people (optional ?search= param)
GET /api/people/:slug      — person detail with linked events
GET /api/events/:slug/people — people linked to an event
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Event, EventPerson, Person
from app.schemas import (
    EventPersonOut,
    PersonDetailOut,
    PersonLinkedEventOut,
    PersonListResponse,
    PersonOut,
)

router = APIRouter(tags=["people"])


@router.get("/api/people", response_model=PersonListResponse)
async def list_people(
    search: str | None = Query(default=None, description="Filter by name (case-insensitive)"),
    db: AsyncSession = Depends(get_db),
) -> PersonListResponse:
    stmt = select(Person).order_by(Person.importance_score.desc())
    if search:
        stmt = stmt.where(Person.name.ilike(f"%{search}%"))
    result = await db.execute(stmt)
    people = result.scalars().all()
    return PersonListResponse(
        people=[
            PersonOut(
                id=p.id,
                name=p.name,
                slug=p.slug,
                birth_year=p.birth_year,
                death_year=p.death_year,
                nationality=p.nationality,
                occupation=p.occupation,
                importance_score=p.importance_score,
                wikipedia_slug=p.wikipedia_slug,
            )
            for p in people
        ]
    )


@router.get("/api/people/{slug}", response_model=PersonDetailOut)
async def get_person(
    slug: str, db: AsyncSession = Depends(get_db)
) -> PersonDetailOut:
    stmt = (
        select(Person)
        .where(Person.slug == slug)
        .options(selectinload(Person.event_people))
    )
    result = await db.execute(stmt)
    person = result.scalar_one_or_none()
    if not person:
        raise HTTPException(status_code=404, detail=f"Person '{slug}' not found")

    # Fetch linked events
    linked_events: list[PersonLinkedEventOut] = []
    if person.event_people:
        event_ids = [ep.event_id for ep in person.event_people]
        ev_stmt = select(Event.id, Event.slug, Event.title, Event.year_approx, Event.event_category).where(
            Event.id.in_(event_ids)
        )
        ev_result = await db.execute(ev_stmt)
        ev_map = {row.id: row for row in ev_result.fetchall()}
        for ep in person.event_people:
            ev = ev_map.get(ep.event_id)
            if ev:
                linked_events.append(
                    PersonLinkedEventOut(
                        event_id=ev.id,
                        slug=ev.slug,
                        title=ev.title,
                        year_approx=ev.year_approx,
                        category=ev.event_category,
                        role=ep.role,
                    )
                )

    return PersonDetailOut(
        id=person.id,
        name=person.name,
        slug=person.slug,
        birth_year=person.birth_year,
        death_year=person.death_year,
        nationality=person.nationality,
        occupation=person.occupation,
        importance_score=person.importance_score,
        bio=person.bio,
        wikipedia_slug=person.wikipedia_slug,
        linked_events=linked_events,
    )


@router.get("/api/events/{slug}/people", response_model=list[EventPersonOut])
async def get_event_people(
    slug: str, db: AsyncSession = Depends(get_db)
) -> list[EventPersonOut]:
    ev_stmt = select(Event.id).where(Event.slug == slug)
    ev_result = await db.execute(ev_stmt)
    ev_row = ev_result.fetchone()
    if ev_row is None:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")
    event_id: UUID = ev_row[0]

    ep_stmt = (
        select(EventPerson, Person)
        .join(Person, EventPerson.person_id == Person.id)
        .where(EventPerson.event_id == event_id)
    )
    result = await db.execute(ep_stmt)
    rows = result.all()

    return [
        EventPersonOut(
            person_id=person.id,
            name=person.name,
            slug=person.slug,
            birth_year=person.birth_year,
            death_year=person.death_year,
            nationality=person.nationality,
            occupation=person.occupation,
            importance_score=person.importance_score,
            role=ep.role,
        )
        for ep, person in rows
    ]
