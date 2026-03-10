"""
Admin event submission and review endpoints (FEAT-02).

Owns:
- POST /api/admin/submit  — public: submit event to pending_events queue
- GET  /api/admin/pending — admin: list pending submissions
- POST /api/admin/approve/{id} — admin: copy pending → events, delete pending
- POST /api/admin/reject/{id}  — admin: delete pending event

Does NOT own: event discovery, search, canvas, causality.

Admin auth: X-Admin-Token header checked against CHRONICLE_ADMIN_TOKEN env var.
Default token for local dev: "chronicle-admin-dev".
"""
from __future__ import annotations

import os
import re
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from geoalchemy2.functions import ST_MakePoint, ST_SetSRID
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, PendingEvent

# ────────────────────────────────────────────
# Constants
# ────────────────────────────────────────────

#: Admin token — read from environment at module load time. Falls back to
#: the well-known dev default so local dev works without any .env setup.
_ADMIN_TOKEN: str = os.getenv("CHRONICLE_ADMIN_TOKEN", "chronicle-admin-dev")

VALID_CATEGORIES = frozenset(
    {"war", "discovery", "political", "cultural", "natural", "person"}
)

# ────────────────────────────────────────────
# Schemas
# ────────────────────────────────────────────


class SubmitPendingRequest(BaseModel):
    """Payload for the public event submission form."""

    title: str = Field(..., min_length=1, max_length=300)
    year_approx: int = Field(..., description="Negative values indicate BCE years.")
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    category: str
    importance_score: float = Field(..., ge=0.1, le=1.0)
    description: str = Field(..., min_length=10, max_length=5000)

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        """Reject categories not in the allowed set."""
        if v not in VALID_CATEGORIES:
            raise ValueError(f"category must be one of {sorted(VALID_CATEGORIES)}")
        return v


class SubmitPendingResponse(BaseModel):
    """Response returned after a successful pending submission."""

    id: uuid.UUID
    status: str


class PendingEventItem(BaseModel):
    """Single pending event item for the admin review listing."""

    id: uuid.UUID
    title: str
    year_approx: int
    lat: float
    lng: float
    category: str
    importance_score: float
    description: str
    status: str
    submitted_at: str


class ApproveResponse(BaseModel):
    """Response after approving a pending event (new events table row)."""

    pending_id: uuid.UUID
    event_id: uuid.UUID


class RejectResponse(BaseModel):
    """Response after rejecting a pending event."""

    pending_id: uuid.UUID
    deleted: bool


# ────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────


def _slugify(title: str, year: int) -> str:
    """Generate a URL-safe slug from title and year (max 120 chars)."""
    text = f"{title}-{year}".lower()
    text = re.sub(r"[^a-z0-9\-]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:120]


def _require_admin_token(x_admin_token: Optional[str]) -> None:
    """Raise HTTP 403 when the X-Admin-Token header is missing or incorrect."""
    if x_admin_token != _ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid or missing admin token")


# ────────────────────────────────────────────
# Router
# ────────────────────────────────────────────

router = APIRouter(prefix="/api/admin", tags=["admin-submit"])


@router.post("/submit", response_model=SubmitPendingResponse, status_code=201)
async def submit_pending_event(
    body: SubmitPendingRequest,
    db: AsyncSession = Depends(get_db),
) -> SubmitPendingResponse:
    """
    Submit a new historical event for admin review.

    This endpoint is public — no authentication required. The submitted event
    lands in the ``pending_events`` table and is NOT visible in the timeline
    until an admin approves it.

    Args:
        body: Validated event submission payload.
        db: Async database session (injected).

    Returns:
        ``SubmitPendingResponse`` with the generated pending event id and status.
    """
    pending = PendingEvent(
        title=body.title,
        year_approx=body.year_approx,
        lat=body.lat,
        lng=body.lng,
        category=body.category,
        importance_score=body.importance_score,
        description=body.description,
        status="pending",
    )
    db.add(pending)
    await db.commit()
    await db.refresh(pending)
    return SubmitPendingResponse(id=pending.id, status=pending.status)


@router.get("/pending", response_model=list[PendingEventItem])
async def list_pending_events(
    x_admin_token: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> list[PendingEventItem]:
    """
    List all pending event submissions awaiting review.

    Protected by ``X-Admin-Token`` header (env var ``CHRONICLE_ADMIN_TOKEN``).

    Args:
        x_admin_token: Value from the X-Admin-Token request header.
        db: Async database session (injected).

    Returns:
        Ordered list of ``PendingEventItem`` (newest first, max 500).
    """
    _require_admin_token(x_admin_token)

    result = await db.execute(
        select(PendingEvent)
        .where(PendingEvent.status == "pending")
        .order_by(PendingEvent.submitted_at.desc())
        .limit(500)
    )
    rows = result.scalars().all()

    return [
        PendingEventItem(
            id=row.id,
            title=row.title,
            year_approx=row.year_approx,
            lat=row.lat,
            lng=row.lng,
            category=row.category,
            importance_score=row.importance_score,
            description=row.description,
            status=row.status,
            submitted_at=row.submitted_at.isoformat() if row.submitted_at else "",
        )
        for row in rows
    ]


@router.post("/approve/{pending_id}", response_model=ApproveResponse)
async def approve_pending_event(
    pending_id: uuid.UUID,
    x_admin_token: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> ApproveResponse:
    """
    Approve a pending submission: copy it to the ``events`` table, then delete it.

    Protected by ``X-Admin-Token`` header.

    Args:
        pending_id: UUID of the ``PendingEvent`` row to approve.
        x_admin_token: Value from the X-Admin-Token request header.
        db: Async database session (injected).

    Returns:
        ``ApproveResponse`` with both the original pending_id and the new event_id.

    Raises:
        HTTPException 404: When ``pending_id`` does not exist.
    """
    _require_admin_token(x_admin_token)

    result = await db.execute(
        select(PendingEvent).where(PendingEvent.id == pending_id)
    )
    pending = result.scalar_one_or_none()
    if pending is None:
        raise HTTPException(status_code=404, detail="Pending event not found")

    # Build slug — ensure uniqueness by appending a random suffix when needed
    slug = _slugify(pending.title, pending.year_approx)
    existing = await db.execute(select(Event.id).where(Event.slug == slug))
    if existing.scalar_one_or_none() is not None:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    geo_point = ST_SetSRID(ST_MakePoint(pending.lng, pending.lat), 4326)

    event = Event(
        slug=slug,
        title=pending.title,
        year_approx=pending.year_approx,
        is_bce=pending.year_approx < 0,
        geo_point=geo_point,
        event_category=pending.category,
        importance_score=pending.importance_score,
        review_status="approved",
        created_by="admin-approved",
    )
    db.add(event)
    await db.flush()  # get the generated UUID before deleting pending

    event_id = event.id
    await db.delete(pending)
    await db.commit()

    return ApproveResponse(pending_id=pending_id, event_id=event_id)


@router.post("/reject/{pending_id}", response_model=RejectResponse)
async def reject_pending_event(
    pending_id: uuid.UUID,
    x_admin_token: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> RejectResponse:
    """
    Reject and permanently delete a pending submission.

    Protected by ``X-Admin-Token`` header.

    Args:
        pending_id: UUID of the ``PendingEvent`` row to reject.
        x_admin_token: Value from the X-Admin-Token request header.
        db: Async database session (injected).

    Returns:
        ``RejectResponse`` confirming deletion.

    Raises:
        HTTPException 404: When ``pending_id`` does not exist.
    """
    _require_admin_token(x_admin_token)

    result = await db.execute(
        select(PendingEvent).where(PendingEvent.id == pending_id)
    )
    pending = result.scalar_one_or_none()
    if pending is None:
        raise HTTPException(status_code=404, detail="Pending event not found")

    await db.delete(pending)
    await db.commit()

    return RejectResponse(pending_id=pending_id, deleted=True)
