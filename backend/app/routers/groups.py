"""
Group event endpoints.

GET  /api/groups                — list all group events with child counts
PATCH /api/events/{id}         — update is_group and/or parent_event_id (admin)

Does NOT own: event detail, canvas tile rendering, causality links.
"""
from __future__ import annotations

import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy import cast, func, select, Text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event
from app.schemas import GroupEventItem

ADMIN_KEY = "chronicle-admin"

router = APIRouter(tags=["groups"])


def _require_admin(x_admin_key: Optional[str]) -> None:
    """Raise 403 if the admin key header is missing or wrong."""
    if x_admin_key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing admin key")


class EventGroupPatch(BaseModel):
    """Payload for updating group-related fields on an event."""
    is_group: Optional[bool] = None
    parent_event_id: Optional[uuid.UUID | None] = None


@router.get("/api/groups", response_model=list[GroupEventItem])
async def list_groups(
    db: AsyncSession = Depends(get_db),
) -> list[GroupEventItem]:
    """
    List all group events with child counts.

    Returns every event where is_group=TRUE, including the count
    of child events referencing it via parent_event_id.
    """
    child_count_sq = (
        select(
            Event.parent_event_id.label("gid"),
            func.count(Event.id).label("cnt"),
        )
        .where(Event.parent_event_id.isnot(None))
        .group_by(Event.parent_event_id)
        .subquery()
    )

    stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            cast(Event._date_earliest, Text).label("date_earliest"),
            cast(Event._date_latest, Text).label("date_latest"),
            Event.event_category,
            Event.importance_score,
            func.coalesce(child_count_sq.c.cnt, 0).label("child_count"),
        )
        .outerjoin(child_count_sq, Event.id == child_count_sq.c.gid)
        .where(Event.is_group == True)  # noqa: E712
        .order_by(Event.year_approx)
    )

    result = await db.execute(stmt)
    rows = result.fetchall()

    return [
        GroupEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            date_earliest=row.date_earliest,
            date_latest=row.date_latest,
            event_category=row.event_category,
            importance_score=row.importance_score or 0.5,
            child_count=row.child_count,
        )
        for row in rows
    ]


@router.patch("/api/events/{event_id}")
async def patch_event(
    event_id: uuid.UUID,
    body: EventGroupPatch,
    x_admin_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Update group-related fields on an event.

    Protected by X-Admin-Key header. Accepts partial updates to
    is_group and parent_event_id.
    """
    _require_admin(x_admin_key)

    stmt = select(Event).where(Event.id == event_id)
    result = await db.execute(stmt)
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if body.is_group is not None:
        event.is_group = body.is_group
    # Allow explicitly setting parent_event_id to None (unassign)
    if "parent_event_id" in body.model_fields_set:
        event.parent_event_id = body.parent_event_id

    await db.commit()
    return {
        "id": str(event.id),
        "is_group": event.is_group,
        "parent_event_id": str(event.parent_event_id) if event.parent_event_id else None,
    }
