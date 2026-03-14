"""
People router — biography pages and people directory.

Endpoints:
  GET /api/people          — list all people with stats
  GET /api/people/{slug}   — person detail + events + contemporaries + related
"""
from __future__ import annotations

import re
import unicodedata
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select, and_, or_, literal_column
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Person, Event, EventPerson, CausalityLink

router = APIRouter(prefix="/api/people", tags=["people"])


def _slugify(name: str) -> str:
    """Generate a URL-safe slug from a person's name."""
    # Normalise unicode → ASCII
    value = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s]+", "-", value)


def _format_year(year: int | None, circa: bool = False) -> str | None:
    """Format a year for display, handling BCE."""
    if year is None:
        return None
    prefix = "c. " if circa else ""
    if year < 0:
        return f"{prefix}{abs(year)} BCE"
    return f"{prefix}{year}"


def _person_to_dict(person: Person, event_count: int = 0, influence_score: float = 0.0) -> dict:
    """Serialise a Person row to a JSON-safe dict."""
    slug = _slugify(person.name)
    return {
        "id": str(person.id),
        "slug": slug,
        "name": person.name,
        "aliases": person.aliases or [],
        "birth_year": person.birth_year,
        "birth_year_circa": person.birth_year_circa,
        "death_year": person.death_year,
        "death_year_circa": person.death_year_circa,
        "birth_year_display": _format_year(person.birth_year, person.birth_year_circa),
        "death_year_display": _format_year(person.death_year, person.death_year_circa),
        "nationalities": person.nationalities or [],
        "roles": person.roles or [],
        "gender": person.gender,
        "description": person.description,
        "image_url": person.image_url,
        "wikipedia_slug": person.wikipedia_slug,
        "wikidata_id": person.wikidata_id,
        "event_count": event_count,
        "influence_score": round(influence_score, 3),
    }


@router.get("")
async def list_people(
    limit: int = Query(500, ge=1, le=2000),
    offset: int = Query(0, ge=0),
    sort: str = Query("influence", regex="^(influence|birth_year|name)$"),
    era: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    GET /api/people — list all people with event counts and influence scores.

    Returns: { people: [...], total: int }
    """
    # Subquery: event count per person
    event_count_sq = (
        select(
            EventPerson.person_id,
            func.count(func.distinct(EventPerson.event_id)).label("event_count"),
        )
        .group_by(EventPerson.person_id)
        .subquery()
    )

    # Subquery: avg importance score of linked events (proxy for influence)
    influence_sq = (
        select(
            EventPerson.person_id,
            func.avg(Event.importance_score).label("avg_importance"),
        )
        .join(Event, Event.id == EventPerson.event_id)
        .group_by(EventPerson.person_id)
        .subquery()
    )

    stmt = (
        select(
            Person,
            func.coalesce(event_count_sq.c.event_count, 0).label("event_count"),
            func.coalesce(influence_sq.c.avg_importance, 0.0).label("influence_score"),
        )
        .outerjoin(event_count_sq, Person.id == event_count_sq.c.person_id)
        .outerjoin(influence_sq, Person.id == influence_sq.c.person_id)
    )

    # Filters
    if role:
        stmt = stmt.where(Person.roles.any(role))
    if region:
        stmt = stmt.where(
            or_(
                Person.nationalities.any(region),
                func.array_to_string(Person.nationalities, " ").ilike(f"%{region}%"),
            )
        )
    if era:
        era_ranges = {
            "ancient": (-5000, 500),
            "medieval": (500, 1500),
            "early-modern": (1500, 1800),
            "modern": (1800, 2100),
        }
        if era in era_ranges:
            y_min, y_max = era_ranges[era]
            stmt = stmt.where(
                and_(
                    Person.birth_year.isnot(None),
                    Person.birth_year >= y_min,
                    Person.birth_year < y_max,
                )
            )

    # Sorting
    if sort == "influence":
        stmt = stmt.order_by(func.coalesce(influence_sq.c.avg_importance, 0.0).desc())
    elif sort == "birth_year":
        stmt = stmt.order_by(func.coalesce(Person.birth_year, 9999))
    else:
        stmt = stmt.order_by(Person.name)

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    # Paginate
    stmt = stmt.offset(offset).limit(limit)
    result = await db.execute(stmt)
    rows = result.all()

    people = [
        _person_to_dict(row[0], event_count=row[1], influence_score=float(row[2]))
        for row in rows
    ]

    return {"people": people, "total": total}


@router.get("/{slug}")
async def get_person(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    GET /api/people/{slug} — full person detail.

    Returns person info + associated events + contemporaries + related people.
    """
    # Find person by matching slugified name
    all_people_stmt = select(Person)
    all_people_result = await db.execute(all_people_stmt)
    all_people = all_people_result.scalars().all()

    person = None
    for p in all_people:
        if _slugify(p.name) == slug:
            person = p
            break

    if not person:
        raise HTTPException(status_code=404, detail=f"Person not found: {slug}")

    # Get associated events via event_people join
    events_stmt = (
        select(Event, EventPerson.role, EventPerson.role_notes)
        .join(EventPerson, Event.id == EventPerson.event_id)
        .where(EventPerson.person_id == person.id)
        .where(Event.review_status == "approved")
        .order_by(func.coalesce(Event.year_approx, 0))
    )
    events_result = await db.execute(events_stmt)
    event_rows = events_result.all()

    # Build events list
    associated_events = []
    event_ids = set()
    total_importance = 0.0
    for event, role, role_notes in event_rows:
        event_ids.add(event.id)
        total_importance += event.importance_score or 0.5
        associated_events.append({
            "id": str(event.id),
            "slug": event.slug,
            "title": event.title,
            "year_approx": event.year_approx,
            "is_bce": event.is_bce,
            "category": event.event_category,
            "importance_score": event.importance_score,
            "geo_modern": event.geo_modern,
            "role": role,
            "role_notes": role_notes,
        })

    event_count = len(associated_events)
    influence_score = (total_importance / event_count) if event_count > 0 else 0.0

    # Compute influence percentile
    all_influence_stmt = (
        select(
            EventPerson.person_id,
            func.avg(Event.importance_score).label("avg_imp"),
        )
        .join(Event, Event.id == EventPerson.event_id)
        .group_by(EventPerson.person_id)
    )
    all_influence_result = await db.execute(all_influence_stmt)
    all_scores = [float(row[1]) for row in all_influence_result.all()]
    if all_scores:
        below = sum(1 for s in all_scores if s < influence_score)
        percentile = round((below / len(all_scores)) * 100, 1)
    else:
        percentile = 50.0

    # Contemporaries: people who lived at roughly the same time
    contemporaries = []
    if person.birth_year is not None:
        b = person.birth_year
        d = person.death_year if person.death_year is not None else b + 60
        contemp_stmt = (
            select(Person)
            .where(Person.id != person.id)
            .where(Person.birth_year.isnot(None))
            .where(
                and_(
                    Person.birth_year <= d + 20,
                    or_(
                        Person.death_year >= b - 20,
                        Person.death_year.is_(None),
                    ),
                )
            )
            .limit(6)
        )
        contemp_result = await db.execute(contemp_stmt)
        for cp in contemp_result.scalars().all():
            # Compute their influence score too
            cp_inf_stmt = (
                select(func.avg(Event.importance_score))
                .join(EventPerson, Event.id == EventPerson.event_id)
                .where(EventPerson.person_id == cp.id)
            )
            cp_inf = (await db.execute(cp_inf_stmt)).scalar() or 0.0
            contemporaries.append({
                **_person_to_dict(cp, influence_score=float(cp_inf)),
            })

    # Related people: share events with this person
    related_people = []
    if event_ids:
        related_stmt = (
            select(
                Person,
                func.count(func.distinct(EventPerson.event_id)).label("shared_events"),
            )
            .join(EventPerson, Person.id == EventPerson.person_id)
            .where(EventPerson.event_id.in_(event_ids))
            .where(Person.id != person.id)
            .group_by(Person.id)
            .order_by(func.count(func.distinct(EventPerson.event_id)).desc())
            .limit(6)
        )
        related_result = await db.execute(related_stmt)
        for rp, shared in related_result.all():
            related_people.append({
                **_person_to_dict(rp),
                "shared_event_count": shared,
            })

    # Contemporaries leaderboard (top 3 by influence, same era)
    leaderboard = sorted(contemporaries, key=lambda c: c["influence_score"], reverse=True)[:3]

    person_dict = _person_to_dict(person, event_count=event_count, influence_score=influence_score)

    return {
        **person_dict,
        "influence_percentile": percentile,
        "associated_events": associated_events,
        "contemporaries": contemporaries[:4],
        "related_people": related_people,
        "leaderboard": leaderboard,
    }
