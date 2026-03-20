"""
Category browsing endpoints.

GET /api/categories           — all categories with counts and featured events
GET /api/categories/{category} — paginated events for a single category with filters

Does NOT own: event detail, causality, search.
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from geoalchemy2.functions import ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import func, select, case, literal_column
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/categories", tags=["categories"])

# ─────────────────────────────────────────────────────────────────────────────
# Era boundaries used for filtering
# ─────────────────────────────────────────────────────────────────────────────

ERA_RANGES: dict[str, tuple[int, int]] = {
    "ancient": (-3000, 500),
    "medieval": (500, 1500),
    "early_modern": (1500, 1800),
    "modern": (1800, 1950),
    "contemporary": (1950, 2100),
}


# ─────────────────────────────────────────────────────────────────────────────
# Response schemas
# ─────────────────────────────────────────────────────────────────────────────

class FeaturedEventItem(BaseModel):
    """Minimal event shown on category overview cards."""
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    importance_score: float


class CategorySummary(BaseModel):
    """One category in the overview list."""
    category: str
    count: int
    featured: list[FeaturedEventItem]


class CategoriesResponse(BaseModel):
    """GET /api/categories response."""
    categories: list[CategorySummary]


class CategoryEventItem(BaseModel):
    """A single event in the category detail list."""
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    region: str | None
    importance_score: float
    category: str | None
    short_description: str | None
    is_bce: bool | None


class CenturyBucket(BaseModel):
    """Event count for a single century (used in timeline chart)."""
    century: int
    count: int


class CategoryDetailResponse(BaseModel):
    """GET /api/categories/{category} response."""
    category: str
    total: int
    page: int
    limit: int
    pages: int
    events: list[CategoryEventItem]
    regions: list[str]
    timeline: list[CenturyBucket]


# ─────────────────────────────────────────────────────────────────────────────
# Normalise similar category names in the DB
# ─────────────────────────────────────────────────────────────────────────────

CATEGORY_ALIASES: dict[str, str] = {
    "military": "war",
    "religious": "religion",
    "economic": "trade",
    "disaster": "natural",
    "scientific": "science",
    "technological": "technology",
    "exploration": "discovery",
}


def _normalised_category_expr():
    """Build a SQL CASE expression that normalises event_category aliases."""
    whens = [(Event.event_category == alias, literal_column(f"'{canonical}'"))
             for alias, canonical in CATEGORY_ALIASES.items()]
    return case(*whens, else_=Event.event_category).label("norm_category")


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/categories — overview
# ─────────────────────────────────────────────────────────────────────────────

@router.get("", response_model=CategoriesResponse)
async def list_categories(db: AsyncSession = Depends(get_db)) -> CategoriesResponse:
    """Return all categories with event counts and top-3 featured events."""
    norm = _normalised_category_expr()

    # 1. counts
    count_stmt = (
        select(norm, func.count().label("cnt"))
        .where(Event.event_category.isnot(None))
        .group_by(literal_column("norm_category"))
        .order_by(func.count().desc())
    )
    result = await db.execute(count_stmt)
    cat_rows = result.fetchall()

    summaries: list[CategorySummary] = []
    for row in cat_rows:
        cat_name: str = row.norm_category
        count: int = row.cnt

        # Resolve which raw categories map to this normalised name
        raw_cats = [cat_name] + [alias for alias, canon in CATEGORY_ALIASES.items() if canon == cat_name]

        # 2. top-3 featured events per category
        feat_stmt = (
            select(Event.id, Event.slug, Event.title, Event.year_approx, Event.importance_score)
            .where(Event.event_category.in_(raw_cats))
            .order_by(Event.importance_score.desc())
            .limit(3)
        )
        feat_result = await db.execute(feat_stmt)
        featured = [
            FeaturedEventItem(
                id=r.id,
                slug=r.slug,
                title=r.title,
                year_approx=r.year_approx,
                importance_score=r.importance_score,
            )
            for r in feat_result.fetchall()
        ]

        summaries.append(CategorySummary(category=cat_name, count=count, featured=featured))

    return CategoriesResponse(categories=summaries)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/categories/{category} — detail with filters + pagination
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/{category}", response_model=CategoryDetailResponse)
async def get_category(
    category: str,
    era: str | None = Query(default=None, description="Era filter: ancient|medieval|early_modern|modern|contemporary"),
    region: str | None = Query(default=None, description="Region filter (geo_modern substring)"),
    sort: str = Query(default="year_asc", description="Sort: year_asc|year_desc|importance"),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=24, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> CategoryDetailResponse:
    """Paginated events in a single category with era/region filters."""
    # Resolve raw category names
    raw_cats = [category] + [alias for alias, canon in CATEGORY_ALIASES.items() if canon == category]
    # Also check if the requested category itself is an alias
    if category in CATEGORY_ALIASES:
        canonical = CATEGORY_ALIASES[category]
        raw_cats = [canonical] + [alias for alias, canon in CATEGORY_ALIASES.items() if canon == canonical]

    base = select(Event).where(Event.event_category.in_(raw_cats))

    # Era filter
    if era and era in ERA_RANGES:
        lo, hi = ERA_RANGES[era]
        base = base.where(Event.year_approx >= lo, Event.year_approx < hi)

    # Region filter
    if region:
        base = base.where(Event.geo_modern.ilike(f"%{region}%"))

    # Count
    count_stmt = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_stmt)).scalar() or 0

    # Sort
    if sort == "year_desc":
        base = base.order_by(Event.year_approx.desc().nullslast())
    elif sort == "importance":
        base = base.order_by(Event.importance_score.desc())
    else:
        base = base.order_by(Event.year_approx.asc().nullslast())

    # Pagination
    offset = (page - 1) * limit
    pages = max(1, (total + limit - 1) // limit)
    stmt = base.offset(offset).limit(limit)

    result = await db.execute(stmt)
    events_out = [
        CategoryEventItem(
            id=ev.id,
            slug=ev.slug,
            title=ev.title,
            year_approx=ev.year_approx,
            region=ev.geo_modern,
            importance_score=ev.importance_score,
            category=ev.event_category,
            short_description=None,
            is_bce=ev.is_bce,
        )
        for ev in result.scalars().all()
    ]

    # Distinct regions for filter dropdown
    region_stmt = (
        select(Event.geo_modern)
        .where(Event.event_category.in_(raw_cats), Event.geo_modern.isnot(None))
        .distinct()
        .order_by(Event.geo_modern)
    )
    region_result = await db.execute(region_stmt)
    regions = [r[0] for r in region_result.fetchall() if r[0]]

    # Century distribution for timeline
    century_expr = func.floor(Event.year_approx / 100).label("century")
    timeline_stmt = (
        select(century_expr, func.count().label("cnt"))
        .where(Event.event_category.in_(raw_cats), Event.year_approx.isnot(None))
        .group_by(century_expr)
        .order_by(century_expr)
    )
    timeline_result = await db.execute(timeline_stmt)
    timeline = [
        CenturyBucket(century=int(r.century), count=r.cnt)
        for r in timeline_result.fetchall()
    ]

    return CategoryDetailResponse(
        category=category,
        total=total,
        page=page,
        limit=limit,
        pages=pages,
        events=events_out,
        regions=regions,
        timeline=timeline,
    )
