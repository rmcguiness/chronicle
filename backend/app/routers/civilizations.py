"""
Civilizations explorer — GET /api/civilizations

Returns a curated list of major world civilizations with event counts
and top events derived from the events table.
"""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/civilizations", tags=["civilizations"])


# ── Civilization metadata ────────────────────────────────────────────
class CivilizationDef:
    """Static definition for a civilization."""

    def __init__(
        self,
        id: str,
        name: str,
        region: str,
        start_year: int,
        end_year: int,
        color_accent: str,
        description: str,
        region_tags: list[str],
    ):
        self.id = id
        self.name = name
        self.region = region
        self.start_year = start_year
        self.end_year = end_year
        self.color_accent = color_accent
        self.description = description
        self.region_tags = region_tags


CIVILIZATIONS: list[CivilizationDef] = [
    CivilizationDef(
        id="mesopotamia",
        name="Mesopotamia",
        region="Middle East",
        start_year=-3500,
        end_year=-500,
        color_accent="#f59e0b",
        description="Cradle of civilization between the Tigris and Euphrates rivers. Gave rise to writing, law codes, and the first cities.",
        region_tags=["Middle East", "Mesopotamia", "Iraq", "Syria"],
    ),
    CivilizationDef(
        id="ancient-egypt",
        name="Ancient Egypt",
        region="Africa",
        start_year=-3100,
        end_year=-30,
        color_accent="#eab308",
        description="Nile Valley civilization famed for pyramids, pharaohs, and hieroglyphics. One of the longest-lasting civilizations in history.",
        region_tags=["Africa", "Egypt", "North Africa"],
    ),
    CivilizationDef(
        id="ancient-greece",
        name="Ancient Greece",
        region="Europe",
        start_year=-800,
        end_year=-146,
        color_accent="#3b82f6",
        description="Birthplace of democracy, philosophy, and Western theatre. City-states like Athens and Sparta shaped the ancient Mediterranean world.",
        region_tags=["Europe", "Greece", "Mediterranean"],
    ),
    CivilizationDef(
        id="roman-empire",
        name="Roman Empire",
        region="Europe",
        start_year=-27,
        end_year=476,
        color_accent="#ef4444",
        description="From republic to empire, Rome dominated the Mediterranean for centuries. Its legal, architectural, and cultural legacy endures worldwide.",
        region_tags=["Europe", "Rome", "Italy", "Mediterranean"],
    ),
    CivilizationDef(
        id="han-dynasty",
        name="Han Dynasty",
        region="Asia",
        start_year=-206,
        end_year=220,
        color_accent="#f97316",
        description="Golden age of Chinese civilization establishing the Silk Road and civil service. Paper, the compass, and key advances in science emerged during this era.",
        region_tags=["Asia", "China", "East Asia"],
    ),
    CivilizationDef(
        id="maurya-empire",
        name="Maurya Empire",
        region="Asia",
        start_year=-322,
        end_year=-185,
        color_accent="#a855f7",
        description="First empire to unify most of the Indian subcontinent under Chandragupta and Ashoka. Spread Buddhism and built sophisticated administrative systems.",
        region_tags=["Asia", "India", "South Asia"],
    ),
    CivilizationDef(
        id="byzantine-empire",
        name="Byzantine Empire",
        region="Europe/Middle East",
        start_year=330,
        end_year=1453,
        color_accent="#8b5cf6",
        description="Eastern continuation of the Roman Empire centered on Constantinople. Preserved classical knowledge and developed Orthodox Christianity.",
        region_tags=["Europe", "Middle East", "Turkey", "Constantinople", "Byzantine"],
    ),
    CivilizationDef(
        id="islamic-golden-age",
        name="Islamic Golden Age",
        region="Middle East",
        start_year=750,
        end_year=1258,
        color_accent="#10b981",
        description="Era of extraordinary scientific, cultural, and economic flourishing in the Islamic world. Scholars preserved and expanded upon Greek, Persian, and Indian knowledge.",
        region_tags=["Middle East", "Arabia", "Persia", "Islamic"],
    ),
    CivilizationDef(
        id="tang-song-dynasty",
        name="Tang/Song Dynasty",
        region="Asia",
        start_year=618,
        end_year=1279,
        color_accent="#f97316",
        description="Peak of Chinese cultural and technological achievement including gunpowder and printing. Poetry, trade, and cosmopolitan urban life flourished.",
        region_tags=["Asia", "China", "East Asia"],
    ),
    CivilizationDef(
        id="viking-age",
        name="Viking Age",
        region="Europe",
        start_year=793,
        end_year=1066,
        color_accent="#64748b",
        description="Norse seafarers explored, traded, and raided from Scandinavia across Europe and beyond. They reached North America and founded key settlements like Normandy and Kyiv.",
        region_tags=["Europe", "Scandinavia", "Norse", "Viking"],
    ),
    CivilizationDef(
        id="mongol-empire",
        name="Mongol Empire",
        region="Asia",
        start_year=1206,
        end_year=1368,
        color_accent="#dc2626",
        description="Largest contiguous land empire in history, founded by Genghis Khan. Connected East and West through trade, communication, and cultural exchange.",
        region_tags=["Asia", "Mongolia", "Central Asia"],
    ),
    CivilizationDef(
        id="ottoman-empire",
        name="Ottoman Empire",
        region="Middle East/Europe",
        start_year=1299,
        end_year=1922,
        color_accent="#059669",
        description="Multi-ethnic empire spanning Southeast Europe, Western Asia, and North Africa. Conquered Constantinople and became a major world power for six centuries.",
        region_tags=["Middle East", "Europe", "Turkey", "Ottoman"],
    ),
    CivilizationDef(
        id="aztec-empire",
        name="Aztec Empire",
        region="Americas",
        start_year=1345,
        end_year=1521,
        color_accent="#d946ef",
        description="Mesoamerican civilization centered on Tenochtitlan, one of the world's largest cities. Known for monumental architecture, complex calendar systems, and rich mythology.",
        region_tags=["Americas", "Mexico", "Mesoamerica", "Central America"],
    ),
    CivilizationDef(
        id="inca-empire",
        name="Inca Empire",
        region="Americas",
        start_year=1438,
        end_year=1533,
        color_accent="#ec4899",
        description="Largest empire in pre-Columbian America, stretching along the Andes. Built Machu Picchu and an extensive road system without the use of the wheel.",
        region_tags=["Americas", "Peru", "South America", "Andes"],
    ),
    CivilizationDef(
        id="british-empire",
        name="British Empire",
        region="Europe",
        start_year=1600,
        end_year=1997,
        color_accent="#6366f1",
        description="Largest empire in history, spanning every continent at its peak. Shaped modern global trade, language, legal systems, and political borders.",
        region_tags=["Europe", "Britain", "England", "United Kingdom"],
    ),
]


# ── Response schemas ─────────────────────────────────────────────────
class TopEventOut(BaseModel):
    """A top event within a civilization's timespan."""

    slug: str
    title: str
    year_approx: Optional[int] = None
    importance_score: float = 0.5


class CivilizationOut(BaseModel):
    """Full civilization card data returned by the API."""

    id: str
    name: str
    region: str
    start_year: int
    end_year: int
    color_accent: str
    description: str
    key_events_count: int
    most_important_event: Optional[TopEventOut] = None
    top_events: list[TopEventOut] = []


class CivilizationsResponse(BaseModel):
    """Response wrapper for the civilizations list."""

    civilizations: list[CivilizationOut]


class SharedEventOut(BaseModel):
    """Event falling within overlapping era of two civilizations."""

    slug: str
    title: str
    year_approx: Optional[int] = None
    importance_score: float = 0.5
    geo_modern: Optional[str] = None


class ComparisonResponse(BaseModel):
    """Side-by-side comparison of two civilizations."""

    a: CivilizationOut
    b: CivilizationOut
    shared_era_events: list[SharedEventOut]
    overlap_start: Optional[int] = None
    overlap_end: Optional[int] = None


# ── Helpers ──────────────────────────────────────────────────────────
def _region_filter(region_tags: list[str]):
    """Build an OR filter matching any of the region tags against geo_modern."""
    from sqlalchemy import or_

    return or_(
        *[Event.geo_modern.ilike(f"%{tag}%") for tag in region_tags]
    )


async def _load_civilization(
    civ: CivilizationDef, db: AsyncSession
) -> CivilizationOut:
    """Query DB to enrich a civilization definition with event data."""
    base_filter = and_(
        Event.year_approx.isnot(None),
        Event.year_approx >= civ.start_year,
        Event.year_approx <= civ.end_year,
        Event.review_status == "approved",
        _region_filter(civ.region_tags),
    )

    # Count events
    count_stmt = select(func.count()).select_from(Event).where(base_filter)
    count_result = await db.execute(count_stmt)
    key_events_count = count_result.scalar() or 0

    # Top 3 events by importance_score
    top_stmt = (
        select(Event.slug, Event.title, Event.year_approx, Event.importance_score)
        .where(base_filter)
        .order_by(Event.importance_score.desc())
        .limit(3)
    )
    top_result = await db.execute(top_stmt)
    top_rows = top_result.all()

    top_events = [
        TopEventOut(
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            importance_score=row.importance_score,
        )
        for row in top_rows
    ]

    most_important = top_events[0] if top_events else None

    return CivilizationOut(
        id=civ.id,
        name=civ.name,
        region=civ.region,
        start_year=civ.start_year,
        end_year=civ.end_year,
        color_accent=civ.color_accent,
        description=civ.description,
        key_events_count=key_events_count,
        most_important_event=most_important,
        top_events=top_events,
    )


# ── Endpoints ────────────────────────────────────────────────────────
@router.get("", response_model=CivilizationsResponse)
async def list_civilizations(
    db: AsyncSession = Depends(get_db),
) -> CivilizationsResponse:
    """
    GET /api/civilizations

    Returns all curated civilizations with event counts and top events.
    """
    results: list[CivilizationOut] = []
    for civ in CIVILIZATIONS:
        results.append(await _load_civilization(civ, db))
    return CivilizationsResponse(civilizations=results)


@router.get("/compare", response_model=ComparisonResponse)
async def compare_civilizations(
    a: str = Query(..., description="ID of first civilization"),
    b: str = Query(..., description="ID of second civilization"),
    db: AsyncSession = Depends(get_db),
) -> ComparisonResponse:
    """
    GET /api/civilizations/compare?a=roman-empire&b=han-dynasty

    Returns side-by-side data for two civilizations plus shared-era events.
    """
    from fastapi import HTTPException

    civ_map = {c.id: c for c in CIVILIZATIONS}
    if a not in civ_map:
        raise HTTPException(status_code=404, detail=f"Civilization '{a}' not found")
    if b not in civ_map:
        raise HTTPException(status_code=404, detail=f"Civilization '{b}' not found")

    civ_a = civ_map[a]
    civ_b = civ_map[b]

    data_a = await _load_civilization(civ_a, db)
    data_b = await _load_civilization(civ_b, db)

    # Calculate overlap
    overlap_start = max(civ_a.start_year, civ_b.start_year)
    overlap_end = min(civ_a.end_year, civ_b.end_year)

    shared_events: list[SharedEventOut] = []
    if overlap_start <= overlap_end:
        # Combine region tags from both civilizations
        combined_tags = list(set(civ_a.region_tags + civ_b.region_tags))
        shared_filter = and_(
            Event.year_approx.isnot(None),
            Event.year_approx >= overlap_start,
            Event.year_approx <= overlap_end,
            Event.review_status == "approved",
            _region_filter(combined_tags),
        )
        shared_stmt = (
            select(
                Event.slug,
                Event.title,
                Event.year_approx,
                Event.importance_score,
                Event.geo_modern,
            )
            .where(shared_filter)
            .order_by(Event.importance_score.desc())
            .limit(10)
        )
        shared_result = await db.execute(shared_stmt)
        shared_events = [
            SharedEventOut(
                slug=row.slug,
                title=row.title,
                year_approx=row.year_approx,
                importance_score=row.importance_score,
                geo_modern=row.geo_modern,
            )
            for row in shared_result.all()
        ]

    return ComparisonResponse(
        a=data_a,
        b=data_b,
        shared_era_events=shared_events,
        overlap_start=overlap_start if overlap_start <= overlap_end else None,
        overlap_end=overlap_end if overlap_start <= overlap_end else None,
    )
