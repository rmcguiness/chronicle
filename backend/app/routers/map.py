"""
GET /api/events/map — geographic event data for the world map view.

Returns events within a bounding box, with server-side clustering at low zoom levels.
Clustering groups nearby events into centroid points with counts when zoom < 4.
"""
from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from geoalchemy2.functions import ST_MakeEnvelope, ST_Within, ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api", tags=["map"])

# ── Constants ────────────────────────────────────────────────────────────────

"""Zoom level below which events are clustered into centroids."""
CLUSTER_ZOOM_THRESHOLD = 4

"""Maximum individual events returned per request."""
MAX_EVENTS = 1000

"""Grid size in degrees for clustering at low zoom."""
CLUSTER_GRID_SIZE = 10.0

"""Era year boundaries for filtering."""
ERA_RANGES: dict[str, tuple[int, int]] = {
    "ancient":      (-10000, 500),
    "medieval":     (500, 1500),
    "early_modern": (1500, 1800),
    "modern":       (1800, 1945),
    "contemporary": (1945, 2100),
}


# ── Response schemas ─────────────────────────────────────────────────────────

class MapEventItem(BaseModel):
    """A single event marker on the map."""
    slug: str
    title: str
    year_approx: Optional[int] = None
    lat: float
    lng: float
    category: Optional[str] = None
    importance_score: Optional[float] = None
    geo_modern: Optional[str] = None


class ClusterItem(BaseModel):
    """A cluster centroid representing multiple nearby events."""
    lat: float
    lng: float
    count: int


class MapResponse(BaseModel):
    """Response for the map endpoint — either events or clusters."""
    clustered: bool
    events: List[MapEventItem] = []
    clusters: List[ClusterItem] = []


# ── Endpoint ─────────────────────────────────────────────────────────────────

@router.get("/map/events", response_model=MapResponse)
async def get_map_events(
    bbox: str = Query(
        description="Bounding box: minLng,minLat,maxLng,maxLat",
        default="-180,-90,180,90",
    ),
    zoom: int = Query(default=3, ge=1, le=20, description="Map zoom level"),
    category: Optional[str] = Query(default=None, description="Filter by event_category"),
    era: Optional[str] = Query(default=None, description="Era filter key"),
    min_importance: float = Query(default=0.0, ge=0.0, le=1.0),
    db: AsyncSession = Depends(get_db),
) -> MapResponse:
    """Return map events or clusters within the given bounding box."""
    # Parse bbox
    try:
        parts = [float(x) for x in bbox.split(",")]
        min_lng, min_lat, max_lng, max_lat = parts
    except (ValueError, IndexError):
        return MapResponse(clustered=False, events=[], clusters=[])

    # Base filters
    envelope = ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
    filters = [
        Event.geo_point.isnot(None),
        ST_Within(Event.geo_point, envelope),
        Event.importance_score >= min_importance,
    ]

    if category:
        filters.append(Event.event_category == category)

    if era and era in ERA_RANGES:
        yr_min, yr_max = ERA_RANGES[era]
        filters.append(Event.year_approx.isnot(None))
        filters.append(Event.year_approx >= yr_min)
        filters.append(Event.year_approx <= yr_max)

    # Clustered mode at low zoom
    if zoom < CLUSTER_ZOOM_THRESHOLD:
        grid = CLUSTER_GRID_SIZE
        lat_bucket = func.floor(ST_Y(Event.geo_point) / grid) * grid + grid / 2
        lng_bucket = func.floor(ST_X(Event.geo_point) / grid) * grid + grid / 2

        stmt = (
            select(
                lat_bucket.label("lat"),
                lng_bucket.label("lng"),
                func.count().label("count"),
            )
            .where(and_(*filters))
            .group_by(lat_bucket, lng_bucket)
            .having(func.count() > 0)
        )
        result = await db.execute(stmt)
        clusters = [
            ClusterItem(lat=float(row.lat), lng=float(row.lng), count=row.count)
            for row in result.all()
        ]
        return MapResponse(clustered=True, clusters=clusters)

    # Individual events mode
    stmt = (
        select(
            Event.slug,
            Event.title,
            Event.year_approx,
            ST_Y(Event.geo_point).label("lat"),
            ST_X(Event.geo_point).label("lng"),
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(and_(*filters))
        .order_by(Event.importance_score.desc())
        .limit(MAX_EVENTS)
    )
    result = await db.execute(stmt)
    events = [
        MapEventItem(
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            lat=float(row.lat),
            lng=float(row.lng),
            category=row.event_category,
            importance_score=row.importance_score,
            geo_modern=row.geo_modern,
        )
        for row in result.all()
    ]
    return MapResponse(clustered=False, events=events)
