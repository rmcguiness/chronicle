"""
GET /api/events/{slug}        — full event detail with perspectives
GET /api/events/{slug}/connections — causality connections
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import CausalityLink, Event, Perspective, Source
from app.schemas import (
    ConnectionItem,
    ConnectionsResponse,
    EventDetailOut,
    PerspectiveOut,
    SourceOut,
)

router = APIRouter(prefix="/api/events", tags=["events"])


async def _get_event_by_slug(slug: str, db: AsyncSession) -> Event:
    stmt = (
        select(Event)
        .where(Event.slug == slug)
        .options(
            selectinload(Event.perspectives).selectinload(Perspective.sources)
        )
    )
    result = await db.execute(stmt)
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")
    return event


@router.get("/{slug}", response_model=EventDetailOut)
async def get_event(slug: str, db: AsyncSession = Depends(get_db)) -> EventDetailOut:
    """Full event detail including perspectives and source citations."""
    event = await _get_event_by_slug(slug, db)

    # Extract lat/lng from PostGIS geo_point
    lat: float | None = None
    lng: float | None = None
    if event.geo_point is not None:
        geo_stmt = select(
            ST_X(Event.geo_point).label("lng"),
            ST_Y(Event.geo_point).label("lat"),
        ).where(Event.id == event.id)
        geo_result = await db.execute(geo_stmt)
        geo_row = geo_result.fetchone()
        if geo_row:
            lng = float(geo_row.lng) if geo_row.lng is not None else None
            lat = float(geo_row.lat) if geo_row.lat is not None else None

    # Sort perspectives by evidence_score desc
    sorted_perspectives = sorted(
        event.perspectives,
        key=lambda p: p.evidence_score or 0.0,
        reverse=True,
    )

    perspectives_out = [
        PerspectiveOut(
            id=p.id,
            label=p.label,
            culture_code=p.culture_code,
            era_written=p.era_written,
            viewpoint_type=p.viewpoint_type,
            language=p.language,
            summary=p.summary,
            narrative=p.narrative,
            evidence_score=p.evidence_score,
            evidence_factors=p.evidence_factors,
            community_score=p.community_score,
            upvotes=p.upvotes,
            downvotes=p.downvotes,
            sources=[
                SourceOut(
                    id=s.id,
                    title=s.title,
                    author=s.author,
                    publication=s.publication,
                    publication_date=s.publication_date,
                    source_type=s.source_type,
                    reliability_tier=s.reliability_tier,
                    peer_reviewed=s.peer_reviewed,
                    quote=s.quote,
                    original_url=s.original_url,
                    archive_url=s.archive_url,
                    ipfs_cid=s.ipfs_cid,
                )
                for s in p.sources
            ],
        )
        for p in sorted_perspectives
    ]

    return EventDetailOut(
        id=event.id,
        slug=event.slug,
        title=event.title,
        title_alt=event.title_alt,
        date_exact=event.date_exact,
        date_earliest=event.date_earliest,
        date_latest=event.date_latest,
        date_confidence=event.date_confidence,
        date_circa=event.date_circa,
        date_disputed=event.date_disputed,
        date_notes=event.date_notes,
        is_bce=event.is_bce,
        year_approx=event.year_approx,
        geo_modern=event.geo_modern,
        geo_era_label=event.geo_era_label,
        lat=lat,
        lng=lng,
        importance_score=event.importance_score,
        zoom_min=event.zoom_min,
        zoom_max=event.zoom_max,
        event_category=event.event_category,
        tags=event.tags,
        review_status=event.review_status,
        wikidata_id=event.wikidata_id,
        wikipedia_slug=event.wikipedia_slug,
        created_at=event.created_at,
        updated_at=event.updated_at,
        perspectives=perspectives_out,
    )


@router.get("/{slug}/connections", response_model=ConnectionsResponse)
async def get_connections(
    slug: str, db: AsyncSession = Depends(get_db)
) -> ConnectionsResponse:
    """
    Returns all causality connections (incoming and outgoing) for this event.
    """
    # Resolve event id from slug
    event_stmt = select(Event.id).where(Event.slug == slug)
    result = await db.execute(event_stmt)
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")
    event_id: UUID = row[0]

    # Outgoing (this event is the CAUSE)
    out_stmt = (
        select(
            CausalityLink.id,
            CausalityLink.cause_event_id,
            CausalityLink.effect_event_id,
            CausalityLink.link_type,
            CausalityLink.description,
            CausalityLink.strength,
        )
        .where(
            (CausalityLink.cause_event_id == event_id)
            | (CausalityLink.effect_event_id == event_id)
        )
    )
    links_result = await db.execute(out_stmt)
    links = links_result.fetchall()

    if not links:
        return ConnectionsResponse(connections=[])

    # Collect all referenced event IDs so we can resolve their slugs
    all_event_ids = set()
    for link in links:
        all_event_ids.add(link.cause_event_id)
        all_event_ids.add(link.effect_event_id)

    slug_stmt = select(Event.id, Event.slug).where(Event.id.in_(list(all_event_ids)))
    slugs_result = await db.execute(slug_stmt)
    id_to_slug: dict[UUID, str] = {row.id: row.slug for row in slugs_result.fetchall()}

    connections = [
        ConnectionItem(
            source_id=link.cause_event_id,
            target_id=link.effect_event_id,
            source_slug=id_to_slug.get(link.cause_event_id, ""),
            target_slug=id_to_slug.get(link.effect_event_id, ""),
            connection_type=link.link_type,
            label=link.description,
            strength=link.strength,
        )
        for link in links
    ]

    return ConnectionsResponse(connections=connections)
