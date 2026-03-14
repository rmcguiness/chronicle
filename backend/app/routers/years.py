"""
Notable Years browser — explore any year in history.

GET /api/years/notable   — curated list of historically significant years
GET /api/years/:year     — all events for a given year (±2 year fuzzy match)
"""
from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/years", tags=["years"])


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────


class YearEventItem(BaseModel):
    """An event returned in year results."""

    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    is_bce: bool = False
    category: Optional[str] = None
    importance_score: float = 0.5
    geo_modern: Optional[str] = None
    geo_era_label: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    tags: Optional[List[str]] = None
    description: Optional[str] = None


class YearResponse(BaseModel):
    """Response for GET /api/years/:year."""

    year: int
    is_bce: bool
    total_events: int
    regions: List[str]
    categories: List[str]
    most_important_event: Optional[YearEventItem] = None
    events: List[YearEventItem]


class NotableYearItem(BaseModel):
    """A single notable year card."""

    year: int
    is_bce: bool
    event_count: int
    avg_importance: float
    top_event_title: str
    top_event_slug: str
    top_event_category: Optional[str] = None


class NotableYearsResponse(BaseModel):
    """Response for GET /api/years/notable."""

    years: List[NotableYearItem]


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

# Curated set of iconic years — always included even if the DB has few events.
ICONIC_YEARS: set[int] = {
    -3100,  # Unification of Egypt
    -2560,  # Great Pyramid of Giza
    -1754,  # Code of Hammurabi
    -1200,  # Bronze Age Collapse
    -776,   # First Olympic Games
    -509,   # Roman Republic founded
    -490,   # Battle of Marathon
    -334,   # Alexander the Great's conquests begin
    -221,   # Qin Dynasty unifies China
    -44,    # Julius Caesar assassinated
    -4,     # Estimated birth of Jesus
    33,     # Crucifixion of Jesus
    70,     # Destruction of the Temple in Jerusalem
    313,    # Edict of Milan
    476,    # Fall of Western Roman Empire
    622,    # Hijra — beginning of Islamic calendar
    800,    # Coronation of Charlemagne
    1066,   # Battle of Hastings / Norman Conquest
    1215,   # Magna Carta
    1347,   # Black Death reaches Europe
    1453,   # Fall of Constantinople
    1492,   # Columbus reaches the Americas
    1517,   # Martin Luther's 95 Theses
    1543,   # Copernicus publishes heliocentric model
    1607,   # Jamestown colony founded
    1687,   # Newton's Principia
    1776,   # American Declaration of Independence
    1789,   # French Revolution begins
    1804,   # Haiti independence / Napoleon crowned
    1815,   # Battle of Waterloo / Congress of Vienna
    1848,   # Revolutions across Europe
    1861,   # American Civil War begins
    1865,   # End of American Civil War
    1869,   # Suez Canal opens
    1905,   # Einstein's miracle year
    1914,   # World War I begins
    1917,   # Russian Revolution
    1929,   # Wall Street Crash
    1939,   # World War II begins
    1945,   # End of WWII / Atomic bombings
    1947,   # Indian independence / Partition
    1948,   # State of Israel founded
    1957,   # Sputnik / Space Age begins
    1963,   # JFK assassination
    1969,   # Moon landing
    1989,   # Fall of Berlin Wall
    1991,   # Dissolution of Soviet Union
    2001,   # September 11 attacks
    2008,   # Global financial crisis
    2020,   # COVID-19 pandemic
}


def _classify_region(geo_modern: str | None, geo_era_label: str | None) -> str:
    """Classify an event into a display region from its location labels."""
    text = f"{geo_modern or ''} {geo_era_label or ''}".lower()
    if not text.strip():
        return "Global"

    if any(w in text for w in ["europe", "france", "germany", "britain", "england",
                                "spain", "italy", "rome", "greece", "russia",
                                "poland", "austria", "hungary", "netherlands",
                                "sweden", "norway", "denmark", "portugal",
                                "switzerland", "belgium", "ireland", "scotland",
                                "byzantine", "ottoman"]):
        return "Europe"
    if any(w in text for w in ["china", "japan", "india", "korea", "vietnam",
                                "mongol", "tibet", "burma", "myanmar", "thai",
                                "indonesia", "malaysia", "philippines", "cambodia",
                                "bengal", "mughal", "tang", "ming", "qing",
                                "tokugawa", "meiji"]):
        return "Asia"
    if any(w in text for w in ["america", "usa", "united states", "canada",
                                "mexico", "brazil", "argentina", "peru", "chile",
                                "colombia", "cuba", "caribbean", "inca", "aztec",
                                "maya"]):
        return "Americas"
    if any(w in text for w in ["africa", "egypt", "ethiopia", "mali", "ghana",
                                "nigeria", "congo", "kenya", "south africa",
                                "morocco", "algeria", "tunisia", "nubia",
                                "zimbabwe", "songhai"]):
        return "Africa"
    if any(w in text for w in ["middle east", "iraq", "iran", "persia", "syria",
                                "arabia", "saudi", "israel", "palestine",
                                "mesopotamia", "babylon", "assyria", "ottoman",
                                "jerusalem", "mecca", "medina", "turkey",
                                "afghanistan", "pakistan"]):
        return "Middle East"
    if any(w in text for w in ["oceania", "australia", "new zealand", "pacific",
                                "polynesia", "melanesia", "hawaii", "fiji",
                                "samoa", "tonga"]):
        return "Oceania"
    return "Global"


def _event_to_item(row: Event) -> YearEventItem:
    """Convert an Event ORM row to a YearEventItem."""
    lat = None
    lng = None
    try:
        if row.geo_point is not None:
            # geo_point might be WKB; we'll handle lat/lng from ST_X/ST_Y in the query
            pass
    except Exception:
        pass

    return YearEventItem(
        id=row.id,
        slug=row.slug,
        title=row.title,
        year_approx=row.year_approx,
        is_bce=row.is_bce,
        category=row.event_category,
        importance_score=row.importance_score,
        geo_modern=row.geo_modern,
        geo_era_label=row.geo_era_label,
        lat=lat,
        lng=lng,
        tags=row.tags,
        description=None,
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/years/notable
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/notable", response_model=NotableYearsResponse)
async def get_notable_years(db: AsyncSession = Depends(get_db)) -> NotableYearsResponse:
    """
    Return a curated list of ~50 historically significant years.

    Strategy: query years with the most events and highest average importance,
    merge with ICONIC_YEARS, and return the top 50 sorted chronologically.
    """
    # Get the top years by event count + avg importance from the database
    stmt = (
        select(
            Event.year_approx,
            func.count().label("cnt"),
            func.avg(Event.importance_score).label("avg_imp"),
        )
        .where(Event.review_status == "approved")
        .where(Event.year_approx.isnot(None))
        .group_by(Event.year_approx)
        .order_by(
            (func.count() * func.avg(Event.importance_score)).desc()
        )
        .limit(200)
    )
    result = await db.execute(stmt)
    db_years = {row.year_approx: (row.cnt, float(row.avg_imp)) for row in result}

    # Merge iconic years — ensure they're always present
    all_years = set(db_years.keys()) | ICONIC_YEARS

    # For each year, get the top event
    year_items: list[NotableYearItem] = []
    for year in all_years:
        cnt, avg_imp = db_years.get(year, (0, 0.0))

        # Score: combination of event count, avg importance, and iconic bonus
        iconic_bonus = 0.5 if year in ICONIC_YEARS else 0.0
        score = cnt * avg_imp + iconic_bonus

        # We'll fetch top events for the final selected years below
        year_items.append(
            NotableYearItem(
                year=year,
                is_bce=year < 0,
                event_count=cnt,
                avg_importance=round(avg_imp, 3),
                top_event_title="",
                top_event_slug="",
                top_event_category=None,
            )
        )

    # Sort by score descending, take top 50
    year_items.sort(
        key=lambda y: (
            db_years.get(y.year, (0, 0.0))[0] * db_years.get(y.year, (0, 0.0))[1]
            + (0.5 if y.year in ICONIC_YEARS else 0.0)
        ),
        reverse=True,
    )
    year_items = year_items[:50]

    # Fetch top event for each selected year
    selected_years = [y.year for y in year_items]
    if selected_years:
        top_events_stmt = (
            select(Event)
            .where(Event.review_status == "approved")
            .where(Event.year_approx.in_(selected_years))
            .order_by(Event.importance_score.desc())
        )
        top_result = await db.execute(top_events_stmt)
        events_by_year: dict[int, Event] = {}
        for ev in top_result.scalars():
            if ev.year_approx is not None and ev.year_approx not in events_by_year:
                events_by_year[ev.year_approx] = ev

        for item in year_items:
            ev = events_by_year.get(item.year)
            if ev:
                item.top_event_title = ev.title
                item.top_event_slug = ev.slug
                item.top_event_category = ev.event_category

    # Sort chronologically for display
    year_items.sort(key=lambda y: y.year)

    return NotableYearsResponse(years=year_items)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/years/{year}
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/{year}", response_model=YearResponse)
async def get_year_events(
    year: int,
    fuzzy: int = Query(default=2, ge=0, le=5, description="±year fuzzy range"),
    db: AsyncSession = Depends(get_db),
) -> YearResponse:
    """
    Return all events for a given year.

    First tries exact match (year_approx = year). If fewer than 3 results,
    expands to ±fuzzy year range for sparse eras.
    """
    # Exact match first
    exact_stmt = (
        select(Event)
        .where(Event.review_status == "approved")
        .where(Event.year_approx == year)
        .order_by(Event.importance_score.desc())
    )
    exact_result = await db.execute(exact_stmt)
    events = list(exact_result.scalars().all())

    # If sparse, expand range
    if len(events) < 3 and fuzzy > 0:
        fuzzy_stmt = (
            select(Event)
            .where(Event.review_status == "approved")
            .where(Event.year_approx.between(year - fuzzy, year + fuzzy))
            .order_by(Event.importance_score.desc())
        )
        fuzzy_result = await db.execute(fuzzy_stmt)
        events = list(fuzzy_result.scalars().all())

    # Build response
    event_items = [_event_to_item(ev) for ev in events]

    regions = sorted(
        set(
            _classify_region(ev.geo_modern, ev.geo_era_label)
            for ev in events
        )
    )
    categories = sorted(
        set(ev.event_category for ev in events if ev.event_category)
    )

    most_important = event_items[0] if event_items else None

    return YearResponse(
        year=year,
        is_bce=year < 0,
        total_events=len(event_items),
        regions=regions,
        categories=categories,
        most_important_event=most_important,
        events=event_items,
    )
