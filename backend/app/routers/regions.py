"""
Region endpoints — GET /api/regions, GET /api/region/{slug}

Returns rich region data for dedicated region pages: stats, top events,
key figures, era breakdown, category breakdown, neighboring regions,
and decade density.
"""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select, text, case, literal_column

from app.database import AsyncSessionLocal
from app.models import CausalityLink, Event, EventPerson, Person

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["regions"])

# ── Slug → DB region mapping ────────────────────────────────────────────────
REGION_SLUG_MAP: dict[str, str] = {
    "europe": "Europe",
    "asia": "Asia",
    "americas": "Americas",
    "africa": "Africa",
    "middle-east": "Middle East",
    "oceania": "Oceania",
}

ALL_REGION_SLUGS = list(REGION_SLUG_MAP.keys())

# ── Era classification from year_approx ─────────────────────────────────────
ERA_RANGES: list[tuple[str, int, int]] = [
    ("Prehistoric", -100000, -3001),
    ("Ancient", -3000, -500),
    ("Classical", -499, 500),
    ("Medieval", 501, 1400),
    ("Early Modern", 1401, 1700),
    ("Enlightenment", 1701, 1800),
    ("Industrial", 1801, 1900),
    ("Modern", 1901, 1950),
    ("Cold War", 1951, 1991),
    ("Contemporary", 1992, 2100),
]


def _era_for_year(year: int | None) -> str:
    """Classify a year into a named era."""
    if year is None:
        return "Unknown"
    for name, lo, hi in ERA_RANGES:
        if lo <= year <= hi:
            return name
    return "Unknown"


# ── Pydantic response models ────────────────────────────────────────────────
class RegionEventItem(BaseModel):
    """Lightweight event for the top-events list."""
    id: str
    slug: str
    title: str
    year_approx: Optional[int] = None
    importance_score: float = 0.5
    category: Optional[str] = None


class RegionPersonItem(BaseModel):
    """Person card for key-figures row."""
    id: str
    slug: Optional[str] = None
    name: str
    birth_year: Optional[int] = None
    death_year: Optional[int] = None
    roles: Optional[list[str]] = None


class NeighborRegion(BaseModel):
    """Region with shared causality link count."""
    region: str
    slug: str
    count: int


class RegionStats(BaseModel):
    """Aggregate stats for a region."""
    total_events: int
    total_people: int
    avg_importance: float
    min_year: Optional[int] = None
    max_year: Optional[int] = None


class EraCount(BaseModel):
    """Event count for a named era."""
    era: str
    count: int


class CategoryCount(BaseModel):
    """Event count for a category."""
    category: str
    count: int


class DecadeCount(BaseModel):
    """Event count for a decade."""
    decade: int
    count: int


class RegionDetailResponse(BaseModel):
    """Full response for GET /api/region/{slug}."""
    region: str
    slug: str
    stats: RegionStats
    top_events: list[RegionEventItem]
    key_figures: list[RegionPersonItem]
    by_era: list[EraCount]
    by_category: list[CategoryCount]
    influenced_by: list[NeighborRegion]
    influenced: list[NeighborRegion]
    by_decade: list[DecadeCount]


class RegionSummaryItem(BaseModel):
    """Summary for the /regions directory listing."""
    region: str
    slug: str
    event_count: int
    min_year: Optional[int] = None
    max_year: Optional[int] = None
    top_event_title: Optional[str] = None


class RegionsDirectoryResponse(BaseModel):
    """Full response for GET /api/regions."""
    regions: list[RegionSummaryItem]
    total_events: int
    most_documented_region: Optional[str] = None


# ── Helpers ──────────────────────────────────────────────────────────────────

def _region_to_slug(db_region: str) -> str:
    """Convert DB region name to URL slug."""
    for slug, name in REGION_SLUG_MAP.items():
        if name == db_region:
            return slug
    return db_region.lower().replace(" ", "-")


# ── GET /api/regions — directory listing ─────────────────────────────────────

@router.get("/regions", response_model=RegionsDirectoryResponse)
async def list_regions() -> RegionsDirectoryResponse:
    """Return summary stats for all six regions."""
    async with AsyncSessionLocal() as session:
        # Per-region stats
        rows = (await session.execute(
            select(
                Event.region,
                func.count().label("cnt"),
                func.min(Event.year_approx).label("min_year"),
                func.max(Event.year_approx).label("max_year"),
            )
            .where(Event.review_status == "approved", Event.region.isnot(None))
            .group_by(Event.region)
            .order_by(func.count().desc())
        )).all()

        total = sum(r.cnt for r in rows)
        most_doc = rows[0].region if rows else None

        summaries: list[RegionSummaryItem] = []
        for r in rows:
            if r.region not in REGION_SLUG_MAP.values():
                continue
            # Top event for this region
            top_evt = (await session.execute(
                select(Event.title)
                .where(
                    Event.review_status == "approved",
                    Event.region == r.region,
                )
                .order_by(Event.importance_score.desc())
                .limit(1)
            )).scalar()

            summaries.append(RegionSummaryItem(
                region=r.region,
                slug=_region_to_slug(r.region),
                event_count=r.cnt,
                min_year=r.min_year,
                max_year=r.max_year,
                top_event_title=top_evt,
            ))

        return RegionsDirectoryResponse(
            regions=summaries,
            total_events=total,
            most_documented_region=most_doc,
        )


# ── GET /api/region/{slug} — full region detail ─────────────────────────────

@router.get("/region/{slug}", response_model=RegionDetailResponse)
async def get_region(slug: str) -> RegionDetailResponse:
    """Return detailed data for a single region."""
    db_region = REGION_SLUG_MAP.get(slug)
    if db_region is None:
        raise HTTPException(status_code=404, detail=f"Unknown region: {slug}")

    async with AsyncSessionLocal() as session:
        base_filter = [Event.review_status == "approved", Event.region == db_region]

        # ── Stats ────────────────────────────────────────────────────────────
        stats_row = (await session.execute(
            select(
                func.count().label("cnt"),
                func.avg(Event.importance_score).label("avg_imp"),
                func.min(Event.year_approx).label("min_year"),
                func.max(Event.year_approx).label("max_year"),
            ).where(*base_filter)
        )).one()

        people_count = (await session.execute(
            select(func.count(func.distinct(EventPerson.person_id)))
            .join(Event, Event.id == EventPerson.event_id)
            .where(*base_filter)
        )).scalar() or 0

        stats = RegionStats(
            total_events=stats_row.cnt,
            total_people=people_count,
            avg_importance=round(float(stats_row.avg_imp or 0), 3),
            min_year=stats_row.min_year,
            max_year=stats_row.max_year,
        )

        # ── Top 10 events ───────────────────────────────────────────────────
        top_rows = (await session.execute(
            select(Event.id, Event.slug, Event.title, Event.year_approx,
                   Event.importance_score, Event.event_category)
            .where(*base_filter)
            .order_by(Event.importance_score.desc())
            .limit(10)
        )).all()

        top_events = [
            RegionEventItem(
                id=str(r.id), slug=r.slug, title=r.title,
                year_approx=r.year_approx, importance_score=r.importance_score,
                category=r.event_category,
            )
            for r in top_rows
        ]

        # ── Key figures (up to 8) ───────────────────────────────────────────
        people_rows = (await session.execute(
            select(
                Person.id, Person.name, Person.birth_year, Person.death_year,
                Person.roles, Person.wikipedia_slug,
                func.count().label("evt_count"),
            )
            .join(EventPerson, EventPerson.person_id == Person.id)
            .join(Event, Event.id == EventPerson.event_id)
            .where(*base_filter)
            .group_by(Person.id)
            .order_by(func.count().desc())
            .limit(8)
        )).all()

        key_figures = [
            RegionPersonItem(
                id=str(r.id), name=r.name, birth_year=r.birth_year,
                death_year=r.death_year, roles=r.roles,
                slug=r.wikipedia_slug,
            )
            for r in people_rows
        ]

        # ── By era ──────────────────────────────────────────────────────────
        year_rows = (await session.execute(
            select(Event.year_approx).where(*base_filter, Event.year_approx.isnot(None))
        )).scalars().all()

        era_counts: dict[str, int] = {}
        for y in year_rows:
            era = _era_for_year(y)
            era_counts[era] = era_counts.get(era, 0) + 1

        by_era = [EraCount(era=e, count=c) for e, c in sorted(
            era_counts.items(),
            key=lambda x: next((lo for nm, lo, _ in ERA_RANGES if nm == x[0]), 99999),
        )]

        # ── By category ─────────────────────────────────────────────────────
        cat_rows = (await session.execute(
            select(Event.event_category, func.count().label("cnt"))
            .where(*base_filter, Event.event_category.isnot(None))
            .group_by(Event.event_category)
            .order_by(func.count().desc())
        )).all()

        by_category = [
            CategoryCount(category=r.event_category, count=r.cnt)
            for r in cat_rows
        ]

        # ── Neighboring regions: influenced BY (causality links into region)
        influenced_by_rows = (await session.execute(text("""
            SELECT e1.region AS src_region, COUNT(*) AS cnt
            FROM causality_links cl
            JOIN events e1 ON e1.id = cl.cause_event_id
            JOIN events e2 ON e2.id = cl.effect_event_id
            WHERE e2.region = :region
              AND e1.region != :region
              AND e1.region IS NOT NULL
              AND cl.review_status = 'approved'
            GROUP BY e1.region
            ORDER BY cnt DESC
            LIMIT 3
        """), {"region": db_region})).all()

        influenced_by = [
            NeighborRegion(region=r.src_region, slug=_region_to_slug(r.src_region), count=r.cnt)
            for r in influenced_by_rows
        ]

        # ── Neighboring regions: this region INFLUENCED
        influenced_rows = (await session.execute(text("""
            SELECT e2.region AS tgt_region, COUNT(*) AS cnt
            FROM causality_links cl
            JOIN events e1 ON e1.id = cl.cause_event_id
            JOIN events e2 ON e2.id = cl.effect_event_id
            WHERE e1.region = :region
              AND e2.region != :region
              AND e2.region IS NOT NULL
              AND cl.review_status = 'approved'
            GROUP BY e2.region
            ORDER BY cnt DESC
            LIMIT 3
        """), {"region": db_region})).all()

        influenced = [
            NeighborRegion(region=r.tgt_region, slug=_region_to_slug(r.tgt_region), count=r.cnt)
            for r in influenced_rows
        ]

        # ── Decade breakdown ────────────────────────────────────────────────
        decade_rows = (await session.execute(text("""
            SELECT (year_approx / 10) * 10 AS decade, COUNT(*) AS cnt
            FROM events
            WHERE review_status = 'approved'
              AND region = :region
              AND year_approx IS NOT NULL
            GROUP BY decade
            ORDER BY decade
        """), {"region": db_region})).all()

        by_decade = [DecadeCount(decade=r.decade, count=r.cnt) for r in decade_rows]

        return RegionDetailResponse(
            region=db_region,
            slug=slug,
            stats=stats,
            top_events=top_events,
            key_figures=key_figures,
            by_era=by_era,
            by_category=by_category,
            influenced_by=influenced_by,
            influenced=influenced,
            by_decade=by_decade,
        )
