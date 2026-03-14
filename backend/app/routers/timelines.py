"""
Custom Timelines API — shareable public timeline collections.

Endpoints:
  GET  /api/timelines              — list public timelines
  GET  /api/timelines/{share_token} — get timeline with expanded events
  POST /api/timelines              — create a new timeline
"""
from __future__ import annotations

import secrets
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CustomTimeline, Event, Perspective
from app.schemas import (
    TimelineCreateRequest,
    TimelineDetailOut,
    TimelineEventItem,
    TimelineListItem,
)

router = APIRouter(prefix="/api/timelines", tags=["timelines"])


def _generate_share_token() -> str:
    """Generate a URL-safe share token (12 chars)."""
    return secrets.token_urlsafe(9)


@router.get("", response_model=List[TimelineListItem])
async def list_timelines(db: AsyncSession = Depends(get_db)):
    """List all public timelines ordered by creation date (newest first)."""
    result = await db.execute(
        select(CustomTimeline)
        .where(CustomTimeline.is_public.is_(True))
        .order_by(CustomTimeline.created_at.desc())
    )
    timelines = result.scalars().all()

    items = []
    for tl in timelines:
        slugs = tl.event_slugs or []
        preview: list[str] = []
        if slugs[:3]:
            title_result = await db.execute(
                select(Event.title)
                .where(Event.slug.in_(slugs[:3]))
                .where(Event.review_status == "approved")
            )
            preview = [row[0] for row in title_result.all()]

        items.append(TimelineListItem(
            id=tl.id,
            title=tl.title,
            description=tl.description,
            event_count=len(slugs),
            event_preview=preview,
            share_token=tl.share_token,
            created_at=tl.created_at,
        ))

    return items


@router.get("/{share_token}", response_model=TimelineDetailOut)
async def get_timeline(share_token: str, db: AsyncSession = Depends(get_db)):
    """Get a timeline by share token with all events expanded."""
    result = await db.execute(
        select(CustomTimeline).where(CustomTimeline.share_token == share_token)
    )
    tl = result.scalar_one_or_none()
    if not tl:
        raise HTTPException(status_code=404, detail="Timeline not found")

    events: list[TimelineEventItem] = []
    if tl.event_slugs:
        evt_result = await db.execute(
            select(
                Event.id,
                Event.slug,
                Event.title,
                Event.year_approx,
                Event.is_bce,
                Event.event_category,
                Event.importance_score,
                Event.geo_modern,
                func.ST_Y(Event.geo_point).label("lat"),
                func.ST_X(Event.geo_point).label("lng"),
            )
            .where(Event.slug.in_(tl.event_slugs))
            .where(Event.review_status == "approved")
        )
        rows = evt_result.all()
        slug_to_row = {row.slug: row for row in rows}

        desc_result = await db.execute(
            select(Perspective.event_id, Perspective.summary)
            .where(Perspective.event_id.in_([r.id for r in rows]))
            .distinct(Perspective.event_id)
            .order_by(Perspective.event_id, Perspective.evidence_score.desc().nullslast())
        )
        desc_map = {row.event_id: row.summary for row in desc_result.all()}

        for slug in tl.event_slugs:
            row = slug_to_row.get(slug)
            if row:
                events.append(TimelineEventItem(
                    id=row.id,
                    slug=row.slug,
                    title=row.title,
                    year_approx=row.year_approx,
                    is_bce=row.is_bce,
                    category=row.event_category,
                    importance_score=row.importance_score,
                    geo_modern=row.geo_modern,
                    lat=row.lat,
                    lng=row.lng,
                    short_description=desc_map.get(row.id),
                ))

    return TimelineDetailOut(
        id=tl.id,
        title=tl.title,
        description=tl.description,
        share_token=tl.share_token,
        created_at=tl.created_at,
        events=events,
    )


@router.post("", response_model=TimelineDetailOut, status_code=201)
async def create_timeline(
    body: TimelineCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a new public timeline and return it with expanded events."""
    share_token = _generate_share_token()

    tl = CustomTimeline(
        title=body.title,
        description=body.description,
        event_slugs=body.event_slugs,
        share_token=share_token,
    )
    db.add(tl)
    await db.commit()
    await db.refresh(tl)

    return await get_timeline(share_token, db)
