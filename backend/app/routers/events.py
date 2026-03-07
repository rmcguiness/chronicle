"""
GET /api/events/{slug}             — full event detail with perspectives + connected events
GET /api/events/{slug}/connections — causality connections (flat list)
GET /api/events/{slug}/article     — Wikipedia article summary for an event
GET /api/events/{slug}/wiki        — Wikipedia summary (cached, TTL 7 days)
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from urllib.parse import quote as url_quote
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from geoalchemy2.functions import ST_DWithin, ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import and_, extract, func, or_, select
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
    WhatHappenedNextEventItem,
    WhatHappenedNextResponse,
    WikiSummaryOut,
    _LINK_TYPE_MAP,
)
from app.services.wiki_service import fetch_wikipedia_summary

# Wikipedia cache TTL: re-fetch after 7 days
_WIKI_CACHE_TTL = timedelta(days=7)

router = APIRouter(prefix="/api/events", tags=["events"])


# ─────────────────────────────────────────────────────────────────────────────
# On This Day — events matching a given month/day across all years
# ─────────────────────────────────────────────────────────────────────────────


class OnThisDayEventItem(BaseModel):
    """A single event item returned by the On This Day endpoint."""

    id: UUID
    slug: str
    title: str
    year_approx: int | None
    date_display: str | None
    category: str | None
    importance_score: float
    region: str | None
    short_description: str | None


class OnThisDayResponse(BaseModel):
    """Response wrapper for the On This Day endpoint."""

    month: int
    day: int
    events: list[OnThisDayEventItem]


@router.get("/on-this-day", response_model=OnThisDayResponse)
async def on_this_day(
    month: int | None = Query(default=None, ge=1, le=12, description="Month (1-12), defaults to today"),
    day: int | None = Query(default=None, ge=1, le=31, description="Day (1-31), defaults to today"),
    db: AsyncSession = Depends(get_db),
) -> OnThisDayResponse:
    """Return up to 20 events that occurred on this month/day across all years.

    Matches events whose ``date_exact`` column has the same month and day,
    sorted by ``importance_score`` descending.
    """
    now = datetime.now(tz=timezone.utc)
    m = month or now.month
    d = day or now.day

    date_col = func.cast(Event._date_exact, func.DATE)

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.date_exact,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(
            Event._date_exact.isnot(None),
            extract("month", date_col) == m,
            extract("day", date_col) == d,
        )
        .order_by(Event.importance_score.desc())
        .limit(20)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    events_out = [
        OnThisDayEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            date_display=row.date_exact,
            category=row.event_category,
            importance_score=row.importance_score,
            region=row.geo_modern,
            short_description=None,
        )
        for row in rows
    ]

    return OnThisDayResponse(month=m, day=d, events=events_out)


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


# ─────────────────────────────────────────────────────────────────────────────
# What Happened Next — top events in next 50 years, same region
# ─────────────────────────────────────────────────────────────────────────────

# ~20 degrees ≈ 2 200 km at the equator — a generous "same region" radius
_REGION_DISTANCE_DEG = 20.0


@router.get("/{slug}/what-happened-next", response_model=WhatHappenedNextResponse)
async def what_happened_next(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> WhatHappenedNextResponse:
    """Return the 5 most important events in the next 50 years near the source event.

    Geographic proximity is determined by PostGIS ``ST_DWithin`` (≈ 2 200 km
    radius).  Events tagged ``'global'`` are always included regardless of
    location.  Results are ordered by ``importance_score`` descending.
    """
    # ── 1. Fetch source event ────────────────────────────────────────────────
    src_stmt = select(
        Event.id,
        Event.slug,
        Event.year_approx,
        Event.geo_point,
    ).where(Event.slug == slug)
    src_result = await db.execute(src_stmt)
    src = src_result.fetchone()
    if src is None:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")

    if src.year_approx is None:
        return WhatHappenedNextResponse(source_slug=slug, source_year=0, events=[])

    year_lo = src.year_approx + 1
    year_hi = src.year_approx + 50

    # ── 2. Build the candidate query ─────────────────────────────────────────
    base_filter = and_(
        Event.year_approx.isnot(None),
        Event.year_approx >= year_lo,
        Event.year_approx <= year_hi,
        Event.id != src.id,
    )

    geo_or_global: list = []
    if src.geo_point is not None:
        geo_or_global.append(
            and_(
                Event.geo_point.isnot(None),
                ST_DWithin(Event.geo_point, src.geo_point, _REGION_DISTANCE_DEG),
            )
        )
    # Always include global events
    geo_or_global.append(Event.tags.any("global"))

    stmt = (
        select(
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.importance_score,
            Event.event_category,
        )
        .where(base_filter, or_(*geo_or_global))
        .order_by(Event.importance_score.desc())
        .limit(5)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    events_out = [
        WhatHappenedNextEventItem(
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            importance_score=row.importance_score,
            category=row.event_category,
        )
        for row in rows
    ]

    return WhatHappenedNextResponse(
        source_slug=slug,
        source_year=src.year_approx,
        events=events_out,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Article endpoint — fetches from Wikipedia REST API with in-memory cache
# ─────────────────────────────────────────────────────────────────────────────

_article_cache: dict[str, "ArticleResponse"] = {}


class ArticleSection(BaseModel):
    """A single section heading + body from the article."""
    heading: str
    content: str


class ArticleResponse(BaseModel):
    """Wikipedia article summary returned by GET /api/events/{slug}/article."""
    title: str
    summary: str | None
    sections: list[ArticleSection]
    source_url: str | None
    source: str


@router.get("/{slug}/article", response_model=ArticleResponse)
async def get_event_article(
    slug: str, db: AsyncSession = Depends(get_db)
) -> ArticleResponse:
    """Fetch a Wikipedia article summary for the given event.

    Results are cached in memory (no TTL for this iteration).
    Returns an empty article body if Wikipedia has no matching page.
    """
    if slug in _article_cache:
        return _article_cache[slug]

    event = await _get_event_by_slug(slug, db)
    encoded_title = url_quote(event.title, safe="")

    wiki_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_title}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(wiki_url)

        if resp.status_code == 200:
            data = resp.json()
            result = ArticleResponse(
                title=data.get("title", event.title),
                summary=data.get("extract"),
                sections=[],
                source_url=data.get("content_urls", {})
                .get("desktop", {})
                .get("page"),
                source="wikipedia",
            )
        else:
            result = ArticleResponse(
                title=event.title,
                summary=None,
                sections=[],
                source_url=None,
                source="wikipedia",
            )
    except httpx.HTTPError:
        result = ArticleResponse(
            title=event.title,
            summary=None,
            sections=[],
            source_url=None,
            source="wikipedia",
        )

    _article_cache[slug] = result
    return result


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
