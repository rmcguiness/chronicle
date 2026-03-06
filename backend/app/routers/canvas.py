"""
GET /api/canvas/tiles
Query params: zoom, year_min, year_max, bbox ("west,south,east,north")
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_MakeEnvelope, ST_Within, ST_X, ST_Y
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, Perspective
from app.schemas import (
    CanvasEventItem,
    CanvasTileResponse,
    CausalityLinkItem,
    _LINK_TYPE_MAP,
)

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
    limit: int = Query(default=500, ge=1, le=2000, description="Max events to return"),
    offset: int = Query(default=0, ge=0, description="Pagination offset"),
    min_importance: float = Query(
        default=0.0, ge=0.0, le=1.0,
        description="Minimum importance_score filter (LOD threshold)",
    ),
    db: AsyncSession = Depends(get_db),
) -> CanvasTileResponse:
    """
    Returns events + causality links for the canvas tile.
    Only returns events whose zoom_min <= requested zoom.
    Ordered by importance_score DESC.
    Supports pagination via limit/offset and LOD via min_importance.
    """
    conditions = [
        Event.year_approx >= year_min,
        Event.year_approx <= year_max,
        Event.zoom_min <= zoom,
        Event.importance_score >= min_importance,
        Event.review_status == "approved",
        Event.importance_score >= min_importance,
    ]

    # Parse and apply bounding box filter
    if bbox:
        try:
            parts = [float(x.strip()) for x in bbox.split(",")]
            west, south, east, north = parts
            envelope = ST_MakeEnvelope(west, south, east, north, 4326)
            conditions.append(Event.geo_point.isnot(None))
            conditions.append(ST_Within(Event.geo_point, envelope))
        except (ValueError, AttributeError):
            pass  # bad bbox — return without geo filter

    # ── Perspective count subquery ──────────────────────────────────────────
    persp_count_sq = (
        select(
            Perspective.event_id,
            func.count(Perspective.id).label("cnt"),
        )
        .group_by(Perspective.event_id)
        .subquery()
    )

    # ── Main event query ────────────────────────────────────────────────────
    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.date_earliest,
            Event.date_latest,
            ST_X(Event.geo_point).label("lng"),
            ST_Y(Event.geo_point).label("lat"),
            Event.geo_modern,
            Event.geo_era_label,
            Event.event_category,
            Event.importance_score,
            Event.tags,
            Event.zoom_min,
            Event.network_y,
            persp_count_sq.c.cnt.label("perspective_count"),
        )
        .outerjoin(persp_count_sq, Event.id == persp_count_sq.c.event_id)
        .where(and_(*conditions))
        .order_by(Event.importance_score.desc())
        .offset(offset)
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    event_ids: list[UUID] = [row.id for row in rows]

    events = [
        CanvasEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            date_earliest=row.date_earliest,
            date_latest=row.date_latest,
            lat=float(row.lat) if row.lat is not None else None,
            lng=float(row.lng) if row.lng is not None else None,
            geo_modern=row.geo_modern,
            geo_era_label=row.geo_era_label,
            category=row.event_category,
            importance_score=row.importance_score or 0.5,
            tags=list(row.tags) if row.tags else None,
            perspective_count=row.perspective_count,
            zoom_min=row.zoom_min or 1,
            network_y=row.network_y,
        )
        for row in rows
    ]

    # ── Causality links between visible events ─────────────────────────────
    links: list[CausalityLinkItem] = []
    if event_ids:
        link_stmt = select(
            CausalityLink.id,
            CausalityLink.cause_event_id,
            CausalityLink.effect_event_id,
            CausalityLink.link_type,
            CausalityLink.strength,
            CausalityLink.description,
        ).where(
            CausalityLink.cause_event_id.in_(event_ids),
            CausalityLink.effect_event_id.in_(event_ids),
            CausalityLink.review_status == "approved",
        )
        link_result = await db.execute(link_stmt)
        links = [
            CausalityLinkItem(
                id=lr.id,
                cause_event_id=lr.cause_event_id,
                effect_event_id=lr.effect_event_id,
                connection_type=_LINK_TYPE_MAP.get(lr.link_type, "context"),
                strength=lr.strength,
                description=lr.description,
            )
            for lr in link_result.fetchall()
        ]

    return CanvasTileResponse(
        events=events,
        links=links,
        computed_at=datetime.now(timezone.utc).isoformat(),
    )
