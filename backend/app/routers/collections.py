"""
Collections router — curated "playlists" of historical events.

Endpoints:
  GET /api/collections         — list all collections with event counts
  GET /api/collections/{slug}  — single collection with full event details
"""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Collection, CollectionEvent, Event

router = APIRouter(prefix="/api/collections", tags=["collections"])


# ── Response schemas ──────────────────────────────────────────────────────────

class CollectionEventOut(BaseModel):
    """A single event within a collection, with display metadata."""
    model_config = ConfigDict(from_attributes=True)

    event_slug: str
    display_order: int
    title: str
    year_approx: Optional[int] = None
    article_summary: Optional[str] = None
    event_category: Optional[str] = None
    is_bce: bool = False


class CollectionSummaryOut(BaseModel):
    """Collection listing — no event details, just counts."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str
    theme_color: str
    icon_emoji: str
    event_count: int


class CollectionDetailOut(BaseModel):
    """Full collection with all events."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str
    theme_color: str
    icon_emoji: str
    events: List[CollectionEventOut]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("", response_model=List[CollectionSummaryOut])
async def list_collections(db: AsyncSession = Depends(get_db)):
    """
    GET /api/collections — returns all collections with event counts.
    """
    stmt = (
        select(
            Collection.id,
            Collection.slug,
            Collection.title,
            Collection.description,
            Collection.theme_color,
            Collection.icon_emoji,
            func.count(CollectionEvent.id).label("event_count"),
        )
        .outerjoin(CollectionEvent, Collection.id == CollectionEvent.collection_id)
        .group_by(Collection.id)
        .order_by(Collection.id)
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [
        CollectionSummaryOut(
            id=r.id,
            slug=r.slug,
            title=r.title,
            description=r.description,
            theme_color=r.theme_color,
            icon_emoji=r.icon_emoji,
            event_count=r.event_count,
        )
        for r in rows
    ]


@router.get("/{slug}", response_model=CollectionDetailOut)
async def get_collection(slug: str, db: AsyncSession = Depends(get_db)):
    """
    GET /api/collections/{slug} — collection detail with full event list.
    """
    # Fetch collection
    stmt = select(Collection).where(Collection.slug == slug)
    result = await db.execute(stmt)
    collection = result.scalar_one_or_none()
    if not collection:
        raise HTTPException(status_code=404, detail=f"Collection '{slug}' not found")

    # Fetch collection_events joined with events table for metadata
    events_stmt = (
        select(
            CollectionEvent.event_slug,
            CollectionEvent.display_order,
            Event.title,
            Event.year_approx,
            Event.article_summary,
            Event.event_category,
            Event.is_bce,
        )
        .outerjoin(Event, CollectionEvent.event_slug == Event.slug)
        .where(CollectionEvent.collection_id == collection.id)
        .order_by(CollectionEvent.display_order)
    )
    events_result = await db.execute(events_stmt)
    event_rows = events_result.all()

    events = [
        CollectionEventOut(
            event_slug=r.event_slug,
            display_order=r.display_order,
            title=r.title or r.event_slug,
            year_approx=r.year_approx,
            article_summary=r.article_summary,
            event_category=r.event_category,
            is_bce=r.is_bce if r.is_bce is not None else False,
        )
        for r in event_rows
    ]

    return CollectionDetailOut(
        id=collection.id,
        slug=collection.slug,
        title=collection.title,
        description=collection.description,
        theme_color=collection.theme_color,
        icon_emoji=collection.icon_emoji,
        events=events,
    )
