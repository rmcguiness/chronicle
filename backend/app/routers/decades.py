"""
GET /api/decades           — all decades with summary stats
GET /api/decades/:decade   — all events for a specific decade
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, select, case, literal_column
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/decades", tags=["decades"])


# ── Response schemas ─────────────────────────────────────────────────────────


class TopEvent(BaseModel):
    """Minimal event summary returned in decade overviews."""

    id: str
    slug: str
    title: str
    year_approx: int
    category: str | None
    importance_score: float


class DecadeSummary(BaseModel):
    """One decade row in the /api/decades listing."""

    decade: int
    label: str
    event_count: int
    top_events: list[TopEvent]
    avg_importance: float
    regions: list[str]


class DecadesResponse(BaseModel):
    """Wrapper for GET /api/decades."""

    decades: list[DecadeSummary]


class DecadeEventItem(BaseModel):
    """Full event row returned by GET /api/decades/:decade."""

    id: str
    slug: str
    title: str
    year_approx: int
    category: str | None
    importance_score: float
    region: str | None
    tags: list[str]


class DecadeDetailResponse(BaseModel):
    """Response for GET /api/decades/:decade."""

    decade: int
    label: str
    events: list[DecadeEventItem]


# ── Helpers ──────────────────────────────────────────────────────────────────


def _decade_label(decade: int) -> str:
    """Format a decade integer as a human-readable label (e.g. '1960s', '450s BCE')."""
    if decade >= 0:
        return f"{decade}s"
    return f"{abs(decade)}s BCE"


def _decade_expr():
    """SQLAlchemy expression: FLOOR(year_approx / 10) * 10."""
    return (func.floor(Event.year_approx / 10) * 10).label("decade")


# ── Routes ───────────────────────────────────────────────────────────────────


@router.get("", response_model=DecadesResponse)
async def list_decades(db: AsyncSession = Depends(get_db)) -> DecadesResponse:
    """Return all decades with event counts, top events, avg importance, and regions."""
    decade_col = _decade_expr()

    # Step 1: aggregate stats per decade
    agg_stmt = (
        select(
            decade_col,
            func.count().label("event_count"),
            func.avg(Event.importance_score).label("avg_importance"),
            func.array_agg(func.distinct(Event.geo_modern)).label("regions"),
        )
        .where(Event.year_approx.isnot(None))
        .group_by(literal_column("decade"))
        .order_by(literal_column("decade").asc())
    )
    agg_result = await db.execute(agg_stmt)
    agg_rows = agg_result.fetchall()

    # Collect all decade values for the top-events query
    decade_values = [int(r.decade) for r in agg_rows]

    # Step 2: fetch top 3 events per decade (by importance_score)
    # Use a window function to rank within each decade
    decade_col2 = _decade_expr()
    rank_col = func.row_number().over(
        partition_by=literal_column("decade"),
        order_by=Event.importance_score.desc(),
    ).label("rn")

    sub = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            decade_col2,
            rank_col,
        )
        .where(Event.year_approx.isnot(None))
        .subquery()
    )

    top_stmt = select(sub).where(sub.c.rn <= 3)
    top_result = await db.execute(top_stmt)
    top_rows = top_result.fetchall()

    # Group top events by decade
    top_by_decade: dict[int, list[TopEvent]] = {}
    for row in top_rows:
        d = int(row.decade)
        if d not in top_by_decade:
            top_by_decade[d] = []
        top_by_decade[d].append(
            TopEvent(
                id=str(row.id),
                slug=row.slug,
                title=row.title,
                year_approx=row.year_approx,
                category=row.event_category,
                importance_score=float(row.importance_score),
            )
        )

    # Step 3: assemble response
    summaries: list[DecadeSummary] = []
    for row in agg_rows:
        d = int(row.decade)
        regions_raw = row.regions or []
        regions = sorted(set(r for r in regions_raw if r))
        summaries.append(
            DecadeSummary(
                decade=d,
                label=_decade_label(d),
                event_count=row.event_count,
                top_events=top_by_decade.get(d, []),
                avg_importance=round(float(row.avg_importance or 0), 3),
                regions=regions,
            )
        )

    return DecadesResponse(decades=summaries)


@router.get("/{decade}", response_model=DecadeDetailResponse)
async def get_decade(decade: int, db: AsyncSession = Depends(get_db)) -> DecadeDetailResponse:
    """Return all events for a specific decade, sorted by importance_score DESC."""
    year_min = decade
    year_max = decade + 9

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
            Event.tags,
        )
        .where(
            Event.year_approx.isnot(None),
            Event.year_approx >= year_min,
            Event.year_approx <= year_max,
        )
        .order_by(Event.importance_score.desc())
    )
    result = await db.execute(stmt)
    rows = result.fetchall()

    if not rows:
        raise HTTPException(status_code=404, detail=f"No events found for decade {decade}")

    events = [
        DecadeEventItem(
            id=str(row.id),
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            category=row.event_category,
            importance_score=float(row.importance_score),
            region=row.geo_modern,
            tags=row.tags or [],
        )
        for row in rows
    ]

    return DecadeDetailResponse(
        decade=decade,
        label=_decade_label(decade),
        events=events,
    )
