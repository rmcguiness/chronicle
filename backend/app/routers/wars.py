"""
Wars router — browse wars and conflicts from the Chronicle DB,
supplemented with hardcoded metadata for 20 major wars.

GET /api/wars?era=&region=&sort=casualties|date|duration&page=1
"""
from __future__ import annotations

import math
from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import or_, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/wars", tags=["wars"])

PAGE_SIZE = 30


# ────────────────────────────────────────────
# Pydantic models
# ────────────────────────────────────────────


class WarMetadata(BaseModel):
    estimated_casualties: int
    duration_years: float
    combatants: list[str]
    outcome: str  # "Victory", "Defeat", "Stalemate", "Ongoing", "Collapse"
    significance: int  # 1-5


class WarEvent(BaseModel):
    id: str
    slug: str
    title: str
    date_display: str
    year: int | None
    is_bce: bool
    era: str
    region: str | None
    description: str | None
    event_category: str | None
    importance_score: float
    # Enriched metadata (only for major wars)
    metadata: WarMetadata | None = None


class WarsStats(BaseModel):
    total_wars: int
    total_casualties: int
    deadliest_war: str
    longest_war: str


class WarsResponse(BaseModel):
    wars: list[WarEvent]
    stats: WarsStats
    total: int
    page: int
    total_pages: int


# ────────────────────────────────────────────
# Hardcoded metadata — 20 major wars
# ────────────────────────────────────────────

MAJOR_WARS: dict[str, WarMetadata] = {
    "Peloponnesian War": WarMetadata(
        estimated_casualties=50000,
        duration_years=27,
        combatants=["Athens & Delian League", "Sparta & Peloponnesian League"],
        outcome="Victory",
        significance=5,
    ),
    "Punic Wars": WarMetadata(
        estimated_casualties=1500000,
        duration_years=118,
        combatants=["Roman Republic", "Carthage"],
        outcome="Victory",
        significance=5,
    ),
    "Mongol conquests": WarMetadata(
        estimated_casualties=40000000,
        duration_years=162,
        combatants=["Mongol Empire", "Various Eurasian states"],
        outcome="Victory",
        significance=5,
    ),
    "Hundred Years' War": WarMetadata(
        estimated_casualties=3500000,
        duration_years=116,
        combatants=["Kingdom of England", "Kingdom of France"],
        outcome="Victory",
        significance=5,
    ),
    "Thirty Years' War": WarMetadata(
        estimated_casualties=8000000,
        duration_years=30,
        combatants=["Protestant states", "Catholic states & Holy Roman Empire"],
        outcome="Stalemate",
        significance=5,
    ),
    "Seven Years' War": WarMetadata(
        estimated_casualties=1400000,
        duration_years=7,
        combatants=["Great Britain & Prussia", "France & Austria & Russia"],
        outcome="Victory",
        significance=4,
    ),
    "American Revolutionary War": WarMetadata(
        estimated_casualties=130000,
        duration_years=8,
        combatants=["American colonies & France", "Great Britain"],
        outcome="Victory",
        significance=5,
    ),
    "Napoleonic Wars": WarMetadata(
        estimated_casualties=6500000,
        duration_years=12,
        combatants=["French Empire", "European coalitions"],
        outcome="Defeat",
        significance=5,
    ),
    "American Civil War": WarMetadata(
        estimated_casualties=750000,
        duration_years=4,
        combatants=["Union (United States)", "Confederate States"],
        outcome="Victory",
        significance=5,
    ),
    "Franco-Prussian War": WarMetadata(
        estimated_casualties=250000,
        duration_years=1,
        combatants=["Prussia & German states", "French Empire"],
        outcome="Victory",
        significance=4,
    ),
    "Russo-Japanese War": WarMetadata(
        estimated_casualties=158000,
        duration_years=2,
        combatants=["Empire of Japan", "Russian Empire"],
        outcome="Victory",
        significance=4,
    ),
    "World War I": WarMetadata(
        estimated_casualties=20000000,
        duration_years=4.3,
        combatants=["Allied Powers (UK, France, Russia, USA)", "Central Powers (Germany, Austria-Hungary, Ottoman Empire)"],
        outcome="Victory",
        significance=5,
    ),
    "Russian Civil War": WarMetadata(
        estimated_casualties=10000000,
        duration_years=5,
        combatants=["Red Army (Bolsheviks)", "White Army & foreign interventionists"],
        outcome="Victory",
        significance=4,
    ),
    "Spanish Civil War": WarMetadata(
        estimated_casualties=500000,
        duration_years=3,
        combatants=["Nationalists (Franco)", "Spanish Republic"],
        outcome="Victory",
        significance=4,
    ),
    "World War II": WarMetadata(
        estimated_casualties=85000000,
        duration_years=6,
        combatants=["Allies (UK, USA, USSR, China, France)", "Axis (Germany, Japan, Italy)"],
        outcome="Victory",
        significance=5,
    ),
    "Korean War": WarMetadata(
        estimated_casualties=5000000,
        duration_years=3,
        combatants=["South Korea & UN forces", "North Korea & China"],
        outcome="Stalemate",
        significance=4,
    ),
    "Vietnam War": WarMetadata(
        estimated_casualties=3500000,
        duration_years=20,
        combatants=["North Vietnam & Viet Cong", "South Vietnam & United States"],
        outcome="Victory",
        significance=5,
    ),
    "Soviet-Afghan War": WarMetadata(
        estimated_casualties=2000000,
        duration_years=10,
        combatants=["Soviet Union & Afghan government", "Mujahideen"],
        outcome="Defeat",
        significance=4,
    ),
    "Gulf War": WarMetadata(
        estimated_casualties=50000,
        duration_years=0.6,
        combatants=["US-led coalition", "Iraq"],
        outcome="Victory",
        significance=3,
    ),
    "War on Terror": WarMetadata(
        estimated_casualties=900000,
        duration_years=20,
        combatants=["US-led coalition", "Various non-state actors"],
        outcome="Ongoing",
        significance=4,
    ),
}

# Search terms to match DB events to major wars
WAR_SEARCH_TERMS: dict[str, list[str]] = {
    "Peloponnesian War": ["peloponnesian"],
    "Punic Wars": ["punic"],
    "Mongol conquests": ["mongol conquest", "genghis khan", "mongol invasion"],
    "Hundred Years' War": ["hundred years"],
    "Thirty Years' War": ["thirty years"],
    "Seven Years' War": ["seven years"],
    "American Revolutionary War": ["american revolution", "revolutionary war"],
    "Napoleonic Wars": ["napoleonic", "napoleon"],
    "American Civil War": ["american civil war", "civil war america"],
    "Franco-Prussian War": ["franco-prussian"],
    "Russo-Japanese War": ["russo-japanese"],
    "World War I": ["world war i", "world war 1", "wwi", "great war"],
    "Russian Civil War": ["russian civil war"],
    "Spanish Civil War": ["spanish civil war"],
    "World War II": ["world war ii", "world war 2", "wwii"],
    "Korean War": ["korean war"],
    "Vietnam War": ["vietnam war"],
    "Soviet-Afghan War": ["soviet-afghan", "afghan war"],
    "Gulf War": ["gulf war"],
    "War on Terror": ["war on terror", "afghanistan war", "iraq war"],
}


def _year_display(ev: Event) -> str:
    y = ev.year_approx
    if y is None:
        return str(ev.date_earliest.year)
    if ev.is_bce:
        return f"{abs(y)} BCE"
    return f"{y} CE"


def _era_from_label(label: str | None, year: int | None, is_bce: bool) -> str:
    if label:
        for kw in ["Ancient", "Bronze", "Iron", "Classical", "Hellenistic", "Roman",
                    "Greek", "Mycenaean", "Minoan", "Achaemenid", "Maurya", "Han",
                    "Ptolemaic", "Akkadian", "Sumerian", "Babylonian", "Assyrian",
                    "Vedic", "Shang", "Zhou"]:
            if kw.lower() in label.lower():
                return "Ancient"
        for kw in ["Medieval", "Viking", "Crusad", "Byzantine", "Carolingian",
                    "Norman", "Mongol", "Seljuk", "Abbasid", "Umayyad", "Ottoman",
                    "Delhi", "Song", "Tang", "Ming", "Khmer", "Mali", "Ghana",
                    "Songhai", "Majapahit", "Kamakura", "Heian"]:
            if kw.lower() in label.lower():
                return "Medieval"
        for kw in ["Early Modern", "Renaissance", "Reformation", "Enlightenment",
                    "Colonial", "Mughal", "Safavid", "Tudor", "Stuart", "Edo",
                    "Tokugawa", "Qing"]:
            if kw.lower() in label.lower():
                return "Early Modern"
        for kw in ["Modern", "Industrial", "WWI", "WWII", "World War", "Cold War",
                    "Victorian", "Napoleonic", "Civil War", "Revolution", "Meiji",
                    "Contemporary", "Post", "Interwar", "Progressive", "Decoloniz"]:
            if kw.lower() in label.lower():
                return "Modern"
    # Fallback by year
    if year is not None:
        eff = -year if is_bce else year
        if eff < 500:
            return "Ancient"
        if eff < 1500:
            return "Medieval"
        if eff < 1800:
            return "Early Modern"
        return "Modern"
    return "Unknown"


@router.get("", response_model=WarsResponse)
async def list_wars(
    era: Optional[str] = Query(None),
    region: Optional[str] = Query(None),
    sort: Optional[str] = Query("date", regex="^(casualties|date|duration)$"),
    page: int = Query(1, ge=1),
    db: AsyncSession = Depends(get_db),
):
    """Return war/conflict events from the DB, enriched with major war metadata."""

    # Base filter: war-related events
    war_filter = or_(
        Event.event_category.in_(["war", "War", "conflict", "Conflict", "military", "Military"]),
        Event.title.ilike("%war%"),
        Event.title.ilike("%battle%"),
        Event.title.ilike("%conquest%"),
        Event.title.ilike("%siege%"),
        Event.title.ilike("%invasion%"),
        Event.title.ilike("%campaign%"),
        Event.title.ilike("%revolt%"),
        Event.title.ilike("%rebellion%"),
    )

    base = select(Event).where(
        Event.review_status == "approved",
        war_filter,
    )

    # Region filter
    if region:
        base = base.where(Event.region == region)

    # Era filter — need to filter in Python since era is derived
    # First get all matching events
    result = await db.execute(base)
    all_events = result.scalars().all()

    # Build war event list
    wars: list[WarEvent] = []
    for ev in all_events:
        year = ev.year_approx
        is_bce = ev.is_bce or False
        computed_era = _era_from_label(ev.geo_era_label, year, is_bce)

        if era and computed_era != era:
            continue

        # Try to match to major war metadata
        metadata = None
        title_lower = (ev.title or "").lower()
        for war_name, search_terms in WAR_SEARCH_TERMS.items():
            for term in search_terms:
                if term in title_lower:
                    metadata = MAJOR_WARS[war_name]
                    break
            if metadata:
                break

        wars.append(WarEvent(
            id=str(ev.id),
            slug=ev.slug,
            title=ev.title,
            date_display=_year_display(ev),
            year=year,
            is_bce=is_bce,
            era=computed_era,
            region=ev.region,
            description=ev.article_summary,
            event_category=ev.event_category,
            importance_score=ev.importance_score or 0.5,
            metadata=metadata,
        ))

    # Sort
    if sort == "casualties":
        wars.sort(key=lambda w: (w.metadata.estimated_casualties if w.metadata else 0), reverse=True)
    elif sort == "duration":
        wars.sort(key=lambda w: (w.metadata.duration_years if w.metadata else 0), reverse=True)
    else:  # date
        wars.sort(key=lambda w: (-w.year if w.is_bce else w.year) if w.year else 0)

    # Stats
    enriched = [w for w in wars if w.metadata]
    total_casualties = sum(w.metadata.estimated_casualties for w in enriched)
    deadliest = max(enriched, key=lambda w: w.metadata.estimated_casualties).title if enriched else "N/A"
    longest = max(enriched, key=lambda w: w.metadata.duration_years).title if enriched else "N/A"

    # Pagination
    total = len(wars)
    total_pages = max(1, math.ceil(total / PAGE_SIZE))
    start = (page - 1) * PAGE_SIZE
    page_wars = wars[start : start + PAGE_SIZE]

    return WarsResponse(
        wars=page_wars,
        stats=WarsStats(
            total_wars=total,
            total_casualties=total_casualties,
            deadliest_war=deadliest,
            longest_war=longest,
        ),
        total=total,
        page=page,
        total_pages=total_pages,
    )
