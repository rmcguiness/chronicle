"""
Pydantic v2 response schemas — matches the API contract exactly.
"""
from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# ────────────────────────────────────────────
# Shared / small models
# ────────────────────────────────────────────
class SourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    author: Optional[str] = None
    publication: Optional[str] = None
    publication_date: Optional[date] = None
    source_type: str
    reliability_tier: Optional[int] = None
    peer_reviewed: bool = False
    quote: Optional[str] = None
    original_url: Optional[str] = None
    archive_url: Optional[str] = None
    ipfs_cid: Optional[str] = None


class EvidenceFactors(BaseModel):
    source_tier: Optional[float] = None
    source_count: Optional[float] = None
    source_diversity: Optional[float] = None
    temporal_proximity: Optional[float] = None
    peer_review: Optional[float] = None
    archive_integrity: Optional[float] = None


class PerspectiveOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    label: str
    culture_code: Optional[str] = None
    era_written: Optional[str] = None
    viewpoint_type: Optional[str] = None
    language: str = "en"
    summary: Optional[str] = None
    narrative: str
    evidence_score: Optional[float] = None
    evidence_factors: Optional[Dict[str, Any]] = None
    community_score: float = 0.5
    upvotes: int = 0
    downvotes: int = 0
    sources: List[SourceOut] = []


# ────────────────────────────────────────────
# Canvas tile response — GET /api/canvas/tiles
# ────────────────────────────────────────────
class CanvasEventItem(BaseModel):
    """Lightweight event item for canvas tile rendering."""

    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    category: Optional[str] = None
    importance_score: float = 0.5
    zoom_min: int = 1


class CanvasTileResponse(BaseModel):
    events: List[CanvasEventItem]


# ────────────────────────────────────────────
# Full event detail — GET /api/events/{slug}
# ────────────────────────────────────────────
class EventDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    title_alt: Optional[List[str]] = None

    date_exact: Optional[date] = None
    date_earliest: date
    date_latest: date
    date_confidence: Optional[float] = None
    date_circa: bool = False
    date_disputed: bool = False
    date_notes: Optional[str] = None
    is_bce: bool = False
    year_approx: Optional[int] = None

    geo_modern: Optional[str] = None
    geo_era_label: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None

    importance_score: float = 0.5
    zoom_min: int = 1
    zoom_max: int = 10
    event_category: Optional[str] = None
    tags: Optional[List[str]] = None

    review_status: str
    wikidata_id: Optional[str] = None
    wikipedia_slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    perspectives: List[PerspectiveOut] = []


# ────────────────────────────────────────────
# Connections — GET /api/events/{slug}/connections
# ────────────────────────────────────────────
class ConnectionItem(BaseModel):
    source_id: UUID
    target_id: UUID
    source_slug: str
    target_slug: str
    connection_type: str  # link_type from causality_links
    label: Optional[str] = None
    strength: float = 0.5


class ConnectionsResponse(BaseModel):
    connections: List[ConnectionItem]


# ────────────────────────────────────────────
# Search — GET /api/search
# ────────────────────────────────────────────
class SearchResultItem(BaseModel):
    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    geo_modern: Optional[str] = None
    category: Optional[str] = None
    score: float = 1.0


class SearchResponse(BaseModel):
    results: List[SearchResultItem]


# ────────────────────────────────────────────
# Health — GET /api/health
# ────────────────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    db: str
    events_count: int
