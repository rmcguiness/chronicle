"""
GET /api/events/{slug}             — full event detail with perspectives + connected events
GET /api/events/{slug}/connections — causality connections (flat list)
GET /api/events/{slug}/wiki        — Wikipedia summary (cached, TTL 7 days)
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from geoalchemy2.functions import ST_X, ST_Y
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import CausalityLink, Event, Perspective, Source, WikipediaCache
from app.schemas import (
    CausalityLinkItem,
    ConnectedEventItem,
    ConnectionsResponse,
    EventDetailOut,
    PerspectiveOut,
    SourceOut,
    WikiSummaryOut,
    _LINK_TYPE_MAP,
)
from app.services.wiki_service import fetch_wikipedia_summary

# Wikipedia cache TTL: re-fetch after 7 days
_WIKI_CACHE_TTL = timedelta(days=7)

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
    """Full event detail including perspectives, sources, and connected events."""
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
            # Map viewpoint_type → perspective_type for frontend compatibility
            perspective_type=p.viewpoint_type,
            viewpoint_type=p.viewpoint_type,
            culture_code=p.culture_code,
            era_written=p.era_written,
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

    # ── Load connected events ──────────────────────────────────────────────
    link_stmt = select(
        CausalityLink.id,
        CausalityLink.cause_event_id,
        CausalityLink.effect_event_id,
        CausalityLink.link_type,
        CausalityLink.strength,
        CausalityLink.description,
    ).where(
        or_(
            CausalityLink.cause_event_id == event.id,
            CausalityLink.effect_event_id == event.id,
        )
    )
    link_result = await db.execute(link_stmt)
    raw_links = link_result.fetchall()

    connected_ids: set[UUID] = set()
    for lnk in raw_links:
        other = lnk.effect_event_id if lnk.cause_event_id == event.id else lnk.cause_event_id
        connected_ids.add(other)

    # Fetch connected event titles + slugs + year
    connected_events_out: list[ConnectedEventItem] = []
    if connected_ids:
        ev_stmt = select(Event.id, Event.slug, Event.title, Event.year_approx).where(
            Event.id.in_(list(connected_ids))
        )
        ev_result = await db.execute(ev_stmt)
        id_to_ev = {row.id: row for row in ev_result.fetchall()}

        for lnk in raw_links:
            is_cause = lnk.cause_event_id == event.id
            other_id = lnk.effect_event_id if is_cause else lnk.cause_event_id
            other_ev = id_to_ev.get(other_id)
            if other_ev is None:
                continue
            connected_events_out.append(
                ConnectedEventItem(
                    id=other_ev.id,
                    slug=other_ev.slug,
                    title=other_ev.title,
                    year_approx=other_ev.year_approx,
                    connection_type=_LINK_TYPE_MAP.get(lnk.link_type, "context"),
                    direction="effect" if is_cause else "cause",
                    strength=lnk.strength,
                    description=lnk.description,
                )
            )

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
        category=event.event_category,        # ← mapped from DB event_category
        tags=event.tags,
        review_status=event.review_status,
        wikidata_id=event.wikidata_id,
        wikipedia_slug=event.wikipedia_slug,
        created_at=event.created_at,
        updated_at=event.updated_at,
        perspectives=perspectives_out,
        connected_events=connected_events_out,
    )


@router.get("/{slug}/connections", response_model=ConnectionsResponse)
async def get_connections(
    slug: str, db: AsyncSession = Depends(get_db)
) -> ConnectionsResponse:
    """
    Returns all causality connections for this event.
    Field names match the frontend CausalityLink type.
    """
    event_stmt = select(Event.id).where(Event.slug == slug)
    result = await db.execute(event_stmt)
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")
    event_id: UUID = row[0]

    link_stmt = select(
        CausalityLink.id,
        CausalityLink.cause_event_id,
        CausalityLink.effect_event_id,
        CausalityLink.link_type,
        CausalityLink.strength,
        CausalityLink.description,
    ).where(
        or_(
            CausalityLink.cause_event_id == event_id,
            CausalityLink.effect_event_id == event_id,
        )
    )
    links_result = await db.execute(link_stmt)
    links = links_result.fetchall()

    return ConnectionsResponse(
        connections=[
            CausalityLinkItem(
                id=lnk.id,
                cause_event_id=lnk.cause_event_id,
                effect_event_id=lnk.effect_event_id,
                connection_type=_LINK_TYPE_MAP.get(lnk.link_type, "context"),
                strength=lnk.strength,
                description=lnk.description,
            )
            for lnk in links
        ]
    )


@router.get("/{slug}/wiki", response_model=WikiSummaryOut)
async def get_event_wiki(
    slug: str, db: AsyncSession = Depends(get_db)
) -> WikiSummaryOut:
    """
    GET /api/events/{slug}/wiki

    Returns a Wikipedia article summary for the event.

    Cache strategy:
    - Checks the ``wikipedia_cache`` table first.
    - If a fresh entry exists (fetched within the last 7 days), returns it immediately.
    - Otherwise fetches from the Wikipedia REST API, updates the cache, then returns.
    - Events with no matching Wikipedia article return ``{"found": false}``.

    The Wikipedia title used for the lookup is, in preference order:
    1. ``Event.wikipedia_slug`` (explicit override set during data import)
    2. The event ``slug`` itself (hyphens converted to underscores)
    """
    # ── 1. Verify event exists ───────────────────────────────────────────────
    ev_stmt = select(Event.wikipedia_slug).where(Event.slug == slug)
    ev_result = await db.execute(ev_stmt)
    ev_row = ev_result.fetchone()
    if ev_row is None:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")

    # ── 2. Check cache ────────────────────────────────────────────────────────
    cache_stmt = select(WikipediaCache).where(WikipediaCache.slug == slug)
    cache_result = await db.execute(cache_stmt)
    cache_entry: WikipediaCache | None = cache_result.scalar_one_or_none()

    now = datetime.now(tz=timezone.utc)
    cache_is_fresh = (
        cache_entry is not None
        and cache_entry.wiki_fetched_at is not None
        and (now - cache_entry.wiki_fetched_at) < _WIKI_CACHE_TTL
    )

    if cache_is_fresh:
        assert cache_entry is not None  # narrowing for type checkers
        found = cache_entry.wiki_summary is not None
        return WikiSummaryOut(
            found=found,
            wiki_url=cache_entry.wiki_url,
            wiki_title=cache_entry.wiki_title,
            summary=cache_entry.wiki_summary,
            thumbnail_url=cache_entry.wiki_thumbnail_url,
            thumbnail_width=cache_entry.wiki_thumbnail_width,
            thumbnail_height=cache_entry.wiki_thumbnail_height,
            fetched_at=cache_entry.wiki_fetched_at,
        )

    # ── 3. Determine Wikipedia title ─────────────────────────────────────────
    # Prefer the explicit wikipedia_slug on the event; fall back to the event slug.
    wiki_title_raw: str = ev_row.wikipedia_slug or slug
    # Normalise to Wikipedia title convention: underscores instead of hyphens
    wiki_title = wiki_title_raw.replace("-", "_")

    # ── 4. Fetch from Wikipedia ──────────────────────────────────────────────
    wiki_result = await fetch_wikipedia_summary(wiki_title)

    # ── 5. Upsert cache entry ────────────────────────────────────────────────
    if cache_entry is None:
        cache_entry = WikipediaCache(slug=slug)
        db.add(cache_entry)

    cache_entry.wiki_fetched_at = now

    if wiki_result is not None:
        cache_entry.wiki_title = wiki_result.title
        cache_entry.wiki_url = wiki_result.wiki_url
        cache_entry.wiki_summary = wiki_result.summary
        cache_entry.wiki_thumbnail_url = wiki_result.thumbnail_url
        cache_entry.wiki_thumbnail_width = wiki_result.thumbnail_width
        cache_entry.wiki_thumbnail_height = wiki_result.thumbnail_height
    else:
        # No article found — store a NULL summary so we don't hammer Wikipedia
        # again until the TTL expires
        cache_entry.wiki_title = None
        cache_entry.wiki_url = None
        cache_entry.wiki_summary = None
        cache_entry.wiki_thumbnail_url = None
        cache_entry.wiki_thumbnail_width = None
        cache_entry.wiki_thumbnail_height = None

    await db.commit()

    # ── 6. Build response ─────────────────────────────────────────────────────
    if wiki_result is None:
        return WikiSummaryOut(found=False, fetched_at=now)

    return WikiSummaryOut(
        found=True,
        wiki_url=wiki_result.wiki_url,
        wiki_title=wiki_result.title,
        summary=wiki_result.summary,
        thumbnail_url=wiki_result.thumbnail_url,
        thumbnail_width=wiki_result.thumbnail_width,
        thumbnail_height=wiki_result.thumbnail_height,
        fetched_at=now,
    )
