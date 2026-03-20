"""
SQLAlchemy ORM models — full Chronicle schema.

Matches the architecture doc exactly:
- events, perspectives, sources, causality_links, people, organizations
- event_people, event_organizations junction tables
- edit_log (append-only, enforced via DB trigger)
- canvas_tiles (pre-computed cache)
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import List, Optional

from geoalchemy2 import Geometry
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    cast,
    literal_column,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, column_property, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


# ────────────────────────────────────────────
# EVENTS
# ────────────────────────────────────────────
class Event(Base):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    title_alt: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)

    # ── BCE date handling (verified end-to-end FIX-BCE) ──────────────────────
    # Python's datetime.date requires ordinal >= 1 (year >= 1 CE). PostgreSQL
    # stores BCE dates fine (e.g. '2560-01-01 BC'), but asyncpg's date decoder
    # raises OverflowError when it tries to convert them into datetime.date.
    #
    # Fix: declare the underlying Date columns as deferred (not fetched by
    # default) and expose CAST(col AS TEXT) versions via column_property.
    # All date reads arrive as plain strings; no Python date object is ever
    # created. The BCE/CE distinction is tracked separately via is_bce + year_approx.
    #
    # Do NOT change these back to mapped_column(Date, ...) — that will re-introduce
    # the asyncpg OverflowError on any event with year < 1 CE.
    _date_exact = mapped_column("date_exact", String, nullable=True, deferred=True)
    _date_earliest = mapped_column("date_earliest", String, nullable=True, deferred=True)
    _date_latest = mapped_column("date_latest", String, nullable=True, deferred=True)
    date_exact: Mapped[Optional[str]] = column_property(cast(_date_exact, Text))
    date_earliest: Mapped[Optional[str]] = column_property(cast(_date_earliest, Text))
    date_latest: Mapped[Optional[str]] = column_property(cast(_date_latest, Text))
    date_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    date_circa: Mapped[bool] = mapped_column(Boolean, default=False)
    date_disputed: Mapped[bool] = mapped_column(Boolean, default=False)
    date_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_bce: Mapped[bool] = mapped_column(Boolean, default=False)
    year_approx: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Geography (PostGIS)
    geo_point: Mapped[Optional[object]] = mapped_column(
        Geometry("POINT", srid=4326), nullable=True
    )
    geo_region: Mapped[Optional[object]] = mapped_column(
        Geometry("POLYGON", srid=4326), nullable=True
    )
    geo_era_label: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    geo_modern: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Canvas rendering — precomputed network layout
    network_y: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)

    importance_score: Mapped[float] = mapped_column(Float, default=0.5)
    zoom_min: Mapped[int] = mapped_column(Integer, default=1)
    zoom_max: Mapped[int] = mapped_column(Integer, default=10)
    event_category: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)

    # Versioning / provenance
    version: Mapped[int] = mapped_column(Integer, default=1)
    content_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    created_by: Mapped[str] = mapped_column(Text, nullable=False)
    review_status: Mapped[str] = mapped_column(Text, default="pending")
    wikidata_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    wikipedia_slug: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Text region label (e.g., "Europe", "Asia")
    region: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Wikipedia article summary cache
    article_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    perspectives: Mapped[List["Perspective"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    causality_causes: Mapped[List["CausalityLink"]] = relationship(
        "CausalityLink",
        foreign_keys="CausalityLink.cause_event_id",
        back_populates="cause_event",
        cascade="all, delete-orphan",
    )
    causality_effects: Mapped[List["CausalityLink"]] = relationship(
        "CausalityLink",
        foreign_keys="CausalityLink.effect_event_id",
        back_populates="effect_event",
        cascade="all, delete-orphan",
    )
    event_people: Mapped[List["EventPerson"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    event_organizations: Mapped[List["EventOrganization"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "importance_score BETWEEN 0 AND 1", name="ck_events_importance_score"
        ),
        CheckConstraint("review_status IN ('pending','approved','flagged','rejected')", name="ck_events_review_status"),
        Index("idx_events_year", "year_approx"),
        Index("idx_events_date_range", "date_earliest", "date_latest"),
        Index("idx_events_zoom_importance", "zoom_min", "importance_score"),
        Index("idx_events_category", "event_category"),
    )


# ────────────────────────────────────────────
# PERSPECTIVES
# ────────────────────────────────────────────
class Perspective(Base):
    __tablename__ = "perspectives"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=False
    )

    label: Mapped[str] = mapped_column(Text, nullable=False)
    culture_code: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    era_written: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    viewpoint_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[str] = mapped_column(Text, default="en")

    narrative: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    key_claims: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    evidence_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    evidence_factors: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    last_scored_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    created_by: Mapped[str] = mapped_column(Text, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1)
    content_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    upvotes: Mapped[int] = mapped_column(Integer, default=0)
    downvotes: Mapped[int] = mapped_column(Integer, default=0)
    community_score: Mapped[float] = mapped_column(Float, default=0.5)

    # Relationships
    event: Mapped["Event"] = relationship(back_populates="perspectives")
    sources: Mapped[List["Source"]] = relationship(
        back_populates="perspective", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "evidence_score IS NULL OR evidence_score BETWEEN 0 AND 1",
            name="ck_perspectives_evidence_score",
        ),
        Index("idx_perspectives_event", "event_id"),
        Index("idx_perspectives_score", "event_id", "evidence_score"),
    )


# ────────────────────────────────────────────
# SOURCES / CITATIONS
# ────────────────────────────────────────────
class Source(Base):
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    perspective_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("perspectives.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(Text, nullable=False)
    author: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    editors: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)
    publication: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    publisher: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    publication_date: Mapped[Optional[str]] = column_property(cast(literal_column("publication_date"), Text))
    isbn: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    doi: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    page_numbers: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quote: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    source_type: Mapped[str] = mapped_column(Text, nullable=False)
    reliability_tier: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    peer_reviewed: Mapped[bool] = mapped_column(Boolean, default=False)
    language: Mapped[str] = mapped_column(Text, default="en")

    original_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True, unique=True)
    archive_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ipfs_cid: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    local_mirror_path: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    perspective: Mapped["Perspective"] = relationship(back_populates="sources")

    __table_args__ = (
        CheckConstraint(
            "source_type IN ('primary','secondary','tertiary','journalistic','oral','artifact')",
            name="ck_sources_source_type",
        ),
        CheckConstraint(
            "reliability_tier IS NULL OR reliability_tier BETWEEN 1 AND 4",
            name="ck_sources_tier",
        ),
        Index("idx_sources_perspective", "perspective_id"),
        Index("idx_sources_tier", "reliability_tier"),
    )


# ────────────────────────────────────────────
# CAUSALITY LINKS
# ────────────────────────────────────────────
class CausalityLink(Base):
    __tablename__ = "causality_links"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    cause_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id"), nullable=False
    )
    effect_event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id"), nullable=False
    )

    link_type: Mapped[str] = mapped_column(Text, default="direct")
    strength: Mapped[float] = mapped_column(Float, default=0.5)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_ids: Mapped[Optional[List[uuid.UUID]]] = mapped_column(
        ARRAY(UUID(as_uuid=True)), nullable=True
    )

    created_by: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    review_status: Mapped[str] = mapped_column(Text, default="approved")

    # Relationships
    cause_event: Mapped["Event"] = relationship(
        foreign_keys=[cause_event_id], back_populates="causality_causes"
    )
    effect_event: Mapped["Event"] = relationship(
        foreign_keys=[effect_event_id], back_populates="causality_effects"
    )

    __table_args__ = (
        CheckConstraint("cause_event_id != effect_event_id", name="ck_causality_no_self"),
        CheckConstraint(
            "link_type IN ('direct','indirect','contributing','disputed')",
            name="ck_causality_link_type",
        ),
        CheckConstraint("strength BETWEEN 0 AND 1", name="ck_causality_strength"),
        CheckConstraint(
            "review_status IN ('pending','approved','flagged','rejected')",
            name="ck_causality_review_status",
        ),
        UniqueConstraint("cause_event_id", "effect_event_id", name="uq_causality_pair"),
        Index("idx_causality_cause", "cause_event_id"),
        Index("idx_causality_effect", "effect_event_id"),
    )


# ────────────────────────────────────────────
# PEOPLE
# ────────────────────────────────────────────
class Person(Base):
    __tablename__ = "people"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    aliases: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)
    birth_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    birth_year_circa: Mapped[bool] = mapped_column(Boolean, default=False)
    death_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    death_year_circa: Mapped[bool] = mapped_column(Boolean, default=False)
    birth_location: Mapped[Optional[object]] = mapped_column(
        Geometry("POINT", srid=4326), nullable=True
    )
    nationalities: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)
    roles: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    wikidata_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True, unique=True)
    wikipedia_slug: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event_people: Mapped[List["EventPerson"]] = relationship(back_populates="person")


# ────────────────────────────────────────────
# ORGANIZATIONS
# ────────────────────────────────────────────
class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    aliases: Mapped[Optional[List[str]]] = mapped_column(ARRAY(Text), nullable=True)
    org_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    founded_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    dissolved_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    headquarters: Mapped[Optional[object]] = mapped_column(
        Geometry("POINT", srid=4326), nullable=True
    )
    wikidata_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True, unique=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event_organizations: Mapped[List["EventOrganization"]] = relationship(
        back_populates="organization"
    )


# ────────────────────────────────────────────
# JUNCTION TABLES
# ────────────────────────────────────────────
class EventPerson(Base):
    __tablename__ = "event_people"

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events.id", ondelete="CASCADE"),
        primary_key=True,
    )
    person_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("people.id", ondelete="CASCADE"),
        primary_key=True,
    )
    role: Mapped[str] = mapped_column(Text, primary_key=True)
    role_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    event: Mapped["Event"] = relationship(back_populates="event_people")
    person: Mapped["Person"] = relationship(back_populates="event_people")


class EventOrganization(Base):
    __tablename__ = "event_organizations"

    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("events.id", ondelete="CASCADE"),
        primary_key=True,
    )
    org_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="CASCADE"),
        primary_key=True,
    )
    role: Mapped[str] = mapped_column(Text, primary_key=True)

    event: Mapped["Event"] = relationship(back_populates="event_organizations")
    organization: Mapped["Organization"] = relationship(back_populates="event_organizations")


# ────────────────────────────────────────────
# EDIT LOG (append-only)
# ────────────────────────────────────────────
class EditLog(Base):
    __tablename__ = "edit_log"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")
    )
    entity_type: Mapped[str] = mapped_column(Text, nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    diff: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    previous_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    new_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    actor_id: Mapped[str] = mapped_column(Text, nullable=False)
    actor_type: Mapped[str] = mapped_column(Text, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ip_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_log_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("edit_log.id"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("idx_edit_log_entity", "entity_type", "entity_id"),
        Index("idx_edit_log_actor", "actor_id"),
        Index("idx_edit_log_time", "created_at"),
    )


# ────────────────────────────────────────────
# WIKIPEDIA SUMMARY CACHE
# ────────────────────────────────────────────
class WikipediaCache(Base):
    """
    Caches Wikipedia REST API summary responses keyed by event slug.

    - Owns NO business logic — that lives in wiki_service.py.
    - A NULL wiki_summary means Wikipedia has no matching article.
    - wiki_fetched_at tracks when we last attempted the fetch (even on 404).
    """

    __tablename__ = "wikipedia_cache"

    # The event slug is the primary key — one cache entry per event
    slug: Mapped[str] = mapped_column(Text, primary_key=True)

    # Wikipedia page title used to build the API URL (may differ from slug)
    wiki_title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Canonical Wikipedia article URL (e.g. https://en.wikipedia.org/wiki/…)
    wiki_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Plain-text extract from the Wikipedia summary endpoint
    wiki_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Thumbnail image URL returned by the Wikipedia summary endpoint
    wiki_thumbnail_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Thumbnail dimensions for responsive rendering
    wiki_thumbnail_width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    wiki_thumbnail_height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # When the cache entry was last populated (or attempted)
    wiki_fetched_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        Index("idx_wikipedia_cache_fetched", "wiki_fetched_at"),
    )


# ────────────────────────────────────────────
# CANVAS TILE CACHE
# ────────────────────────────────────────────
class CanvasTile(Base):
    __tablename__ = "canvas_tiles"

    tile_key: Mapped[str] = mapped_column(Text, primary_key=True)
    zoom_level: Mapped[int] = mapped_column(Integer, nullable=False)
    time_start: Mapped[int] = mapped_column(Integer, nullable=False)
    time_end: Mapped[int] = mapped_column(Integer, nullable=False)
    h3_index: Mapped[str] = mapped_column(Text, nullable=False)
    event_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        Index("idx_canvas_tiles_zoom_time", "zoom_level", "time_start", "time_end"),
    )
