"""
People router — historical figures endpoints.

GET /api/lifespans — Gantt-chart data for historical figure lifespans.
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Person, EventPerson
from app.schemas import LifespanPersonOut

router = APIRouter(prefix="/api", tags=["people"])

# Era boundaries (year ranges)
ERA_RANGES: dict[str, tuple[int, int]] = {
    "ancient": (-5000, -800),
    "classical": (-800, 500),
    "medieval": (500, 1400),
    "early_modern": (1400, 1800),
    "modern": (1800, 2100),
}


@router.get("/lifespans", response_model=list[LifespanPersonOut])
async def get_lifespans(
    era: Optional[str] = Query(None, description="Filter by era: ancient|classical|medieval|early_modern|modern"),
    db: AsyncSession = Depends(get_db),
) -> list[LifespanPersonOut]:
    """
    Return all people with at least a birth_year, ordered by birth_year ASC.

    Each person includes an event_count from the event_people junction table
    and a derived region based on their first nationality.
    """
    # Subquery: count events per person
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
            Person.id,
            Person.name,
            Person.birth_year,
            Person.death_year,
            Person.birth_year_circa,
            Person.death_year_circa,
            Person.roles,
            Person.nationalities,
            Person.description,
            Person.image_url,
            Person.wikipedia_slug,
            func.coalesce(event_count_sq.c.event_count, 0).label("event_count"),
        )
        .outerjoin(event_count_sq, Person.id == event_count_sq.c.person_id)
        .where(Person.birth_year.isnot(None))
        .order_by(Person.birth_year.asc(), Person.name.asc())
    )

    # Era filter
    if era and era in ERA_RANGES:
        year_min, year_max = ERA_RANGES[era]
        stmt = stmt.where(Person.birth_year >= year_min, Person.birth_year < year_max)

    result = await db.execute(stmt)
    rows = result.all()

    return [
        LifespanPersonOut(
            id=str(row.id),
            name=row.name,
            birth_year=row.birth_year,
            death_year=row.death_year,
            birth_year_circa=row.birth_year_circa,
            death_year_circa=row.death_year_circa,
            role=row.roles[0] if row.roles else None,
            roles=row.roles or [],
            region=_nationality_to_region(row.nationalities),
            nationalities=row.nationalities or [],
            description=row.description,
            image_url=row.image_url,
            wikipedia_slug=row.wikipedia_slug,
            event_count=row.event_count,
        )
        for row in rows
    ]


def _nationality_to_region(nationalities: list[str] | None) -> str:
    """Map the first nationality to a broad region for coloring."""
    if not nationalities:
        return "Other"

    nat = nationalities[0].lower()

    europe = {
        "english", "british", "french", "german", "italian", "spanish",
        "portuguese", "dutch", "russian", "polish", "austrian", "greek",
        "roman", "byzantine", "norse", "danish", "icelandic", "scottish",
        "norman", "anglo-saxon", "frankish", "celtic", "prussian", "genoese",
        "venetian", "swiss", "swedish", "norwegian", "finnish", "hungarian",
        "czech", "corsican",
    }
    asia = {
        "chinese", "japanese", "indian", "mongol", "mongolian", "mughal",
        "vietnamese", "korean", "thai", "burmese", "javanese", "nepalese",
        "rajput", "maratha", "khwarezmian", "timurid", "tamil", "sikh",
        "tibetan", "filipino", "cambodian", "indonesian", "uzbek",
        "pakistani", "bengali",
    }
    middle_east = {
        "persian", "ottoman", "arab", "arabian", "babylonian", "akkadian",
        "sumerian", "hebrew", "jewish", "egyptian", "omani", "kurdish",
        "assyrian", "iraqi", "turkish", "carthaginian", "berber", "moroccan",
    }
    africa = {
        "ethiopian", "malian", "mandinka", "hausa", "kanuri", "angolan",
        "ndongo", "matamba", "bornu", "zulu", "shona", "swahili",
        "malagasy", "somali", "ghanaian", "nigerian", "senegalese",
        "haitian",
    }
    americas = {
        "american", "mexican", "peruvian", "aztec", "inca", "incan",
        "mexica", "quechua", "mapuche", "lakota sioux", "mohawk",
        "onondaga", "apache", "brazilian", "chilean", "colombian",
        "argentine", "canadian", "cuban",
    }
    oceania = {
        "australian", "polynesian", "maori", "hawaiian", "fijian",
        "samoan", "tongan", "papuan",
    }

    if nat in europe:
        return "Europe"
    if nat in asia:
        return "Asia"
    if nat in middle_east:
        return "Middle East"
    if nat in africa:
        return "Africa"
    if nat in americas:
        return "Americas"
    if nat in oceania:
        return "Oceania"
    # Fallback: check partial matches
    for keyword, region in [
        ("european", "Europe"), ("asian", "Asia"), ("african", "Africa"),
        ("american", "Americas"),
    ]:
        if keyword in nat:
            return region
    return "Other"
