"""
GET /api/canvas/tiles
Query params: zoom, year_min, year_max, bbox ("west,south,east,north")
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_MakeEnvelope, ST_Within, ST_X, ST_Y
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event
from app.schemas import CanvasEventItem, CanvasTileResponse

router = APIRouter(prefix="/api/canvas", tags=["canvas"])


@router.get("/tiles", response_model=CanvasTileResponse)
async def get_tiles(
    zoom: int = Query(default=5, ge=1, le=10, description="Zoom level 1-10"),
    year_min: int = Query(default=-3000, description="Earliest year (negative = BCE)"),
    year_max: int = Query(default=2000, description="Latest year"),
    bbox: Optional[str] = Query(
        default=None,
        description='Bounding box "west,south,east,north" in WGS84',
    ),
    db: AsyncSession = Depends(get_db),
) -> CanvasTileResponse:
    """
    Returns events for the canvas tile defined by zoom + year range + bbox.
    Only returns events whose zoom_min <= requested zoom.
    Ordered by importance_score DESC, capped at 500 per request.
    """
    conditions = [
        Event.year_approx >= year_min,
        Event.year_approx <= year_max,
        Event.zoom_min <= zoom,
        Event.review_status == "approved",
    ]

    # Parse and apply bounding box filter
    if bbox:
        try:
            parts = [float(x.strip()) for x in bbox.split(",")]
            west, south, east, north = parts
            # ST_MakeEnvelope(xmin, ymin, xmax, ymax, srid)
            envelope = ST_MakeEnvelope(west, south, east, north, 4326)
            conditions.append(Event.geo_point.isnot(None))
            conditions.append(ST_Within(Event.geo_point, envelope))
        except (ValueError, AttributeError):
            pass  # bad bbox — return without geo filter

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            ST_X(Event.geo_point).label("lng"),
            ST_Y(Event.geo_point).label("lat"),
            Event.event_category,
            Event.importance_score,
            Event.zoom_min,
        )
        .where(and_(*conditions))
        .order_by(Event.importance_score.desc())
        .limit(500)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    events = [
        CanvasEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            lat=float(row.lat) if row.lat is not None else None,
            lng=float(row.lng) if row.lng is not None else None,
            category=row.event_category,
            importance_score=row.importance_score or 0.5,
            zoom_min=row.zoom_min or 1,
        )
        for row in rows
    ]

    return CanvasTileResponse(events=events)
