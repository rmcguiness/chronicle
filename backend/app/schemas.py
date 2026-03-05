"""
Pydantic v2 response schemas — aligned exactly with the frontend API contract.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


# ────────────────────────────────────────────
# Shared / small models
# ────────────────────────────────────────────
class SourceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    author: Optional[str] = None
    publication: Optional[str] = None
    publication_date: Optional[str] = None
    source_type: str
    reliability_tier: Optional[int] = None
    peer_reviewed: bool = False
    quote: Optional[str] = None
    original_url: Optional[str] = None
    archive_url: Optional[str] = None
    ipfs_cid: Optional[str] = None


class PerspectiveOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    label: str
    # perspective_type maps from viewpoint_type in the DB — exposed under both names
    perspective_type: Optional[str] = None  # frontend key
    viewpoint_type: Optional[str] = None    # DB key (kept for compat)
    culture_code: Optional[str] = None
    era_written: Optional[str] = None
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
# Causality link — used in canvas tile + connections endpoint
# ────────────────────────────────────────────

# DB link_type → frontend ConnectionType
_LINK_TYPE_MAP: dict[str, str] = {
    "direct": "causes",
    "indirect": "context",
    "contributing": "enables",
    "disputed": "context",
}


class CausalityLinkItem(BaseModel):
    """Frontend-aligned causality link shape."""
    id: UUID
    cause_event_id: UUID
    effect_event_id: UUID
    connection_type: str   # mapped from link_type
    strength: float = 0.5
    description: Optional[str] = None


# ────────────────────────────────────────────
# Canvas tile response — GET /api/canvas/tiles
# ────────────────────────────────────────────
class CanvasEventItem(BaseModel):
    """Lightweight event item for canvas tile rendering — mirrors HistoricalEvent."""

    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    geo_modern: Optional[str] = None
    geo_era_label: Optional[str] = None
    category: Optional[str] = None          # mapped from event_category
    importance_score: float = 0.5
    tags: Optional[List[str]] = None
    perspective_count: Optional[int] = None
    zoom_min: int = 1
    network_y: Optional[float] = None       # precomputed Y for network view


class CanvasTileResponse(BaseModel):
    """Full tile response — matches TileResponse in frontend types."""
    events: List[CanvasEventItem]
    links: List[CausalityLinkItem] = []
    computed_at: str                        # ISO datetime string


# ────────────────────────────────────────────
# Full event detail — GET /api/events/{slug}
# ────────────────────────────────────────────
class ConnectedEventItem(BaseModel):
    """Connected event for the detail panel — matches ConnectedEvent type."""
    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    connection_type: str    # mapped link_type
    direction: str          # 'cause' | 'effect'
    strength: Optional[float] = None
    description: Optional[str] = None


class EventDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    slug: str
    title: str
    title_alt: Optional[List[str]] = None

    date_exact: Optional[str] = None
    date_earliest: Optional[str] = None
    date_latest: Optional[str] = None
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
    category: Optional[str] = None         # frontend key (event_category in DB)
    tags: Optional[List[str]] = None

    review_status: str
    wikidata_id: Optional[str] = None
    wikipedia_slug: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    perspectives: List[PerspectiveOut] = []
    connected_events: List[ConnectedEventItem] = []


# ────────────────────────────────────────────
# Connections — GET /api/events/{slug}/connections
# Returns a flat list matching CausalityLink[] in frontend
# ────────────────────────────────────────────
class ConnectionsResponse(BaseModel):
    """Flat list of causality links for an event."""
    connections: List[CausalityLinkItem] = []


# ────────────────────────────────────────────
# Search — GET /api/search
# ────────────────────────────────────────────
class SearchResultItem(BaseModel):
    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    geo_modern: Optional[str] = None
    category: Optional[str] = None         # mapped from event_category
    importance_score: float = 0.5
    lat: Optional[float] = None
    lng: Optional[float] = None
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


# ────────────────────────────────────────────
# Wikipedia cache — GET /api/events/{slug}/wiki
# ────────────────────────────────────────────
class WikiSummaryOut(BaseModel):
    """
    Wikipedia summary response for an event.

    ``found`` is False when no Wikipedia article exists for this event;
    all other fields will be None in that case.
    """

    found: bool
    wiki_url: Optional[str] = None
    wiki_title: Optional[str] = None
    summary: Optional[str] = None
    thumbnail_url: Optional[str] = None
    thumbnail_width: Optional[int] = None
    thumbnail_height: Optional[int] = None
    # ISO 8601 timestamp of when the cache was last populated
    fetched_at: Optional[datetime] = None
