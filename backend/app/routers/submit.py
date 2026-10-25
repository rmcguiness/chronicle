"""
Event submission & admin review routes.

POST /api/events/submit       — public: submit a new event for review
GET  /api/admin/events        — admin: list events by review_status
PATCH /api/admin/events/{id}  — admin: approve/reject an event
"""
from __future__ import annotations

import logging
import os
import re
import secrets
import time
import uuid
from collections import defaultdict
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from geoalchemy2.functions import ST_MakePoint, ST_SetSRID
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

# ────────────────────────────────────────────
# Constants
# ────────────────────────────────────────────

# Admin API key comes from the environment only. Admin endpoints are disabled when it is
# unset or too short. Generate one with: python -c "import secrets; print(secrets.token_urlsafe(32))"
ADMIN_KEY = os.getenv("ADMIN_KEY", "")
if ADMIN_KEY and len(ADMIN_KEY) < 24:
    logging.getLogger(__name__).warning("ADMIN_KEY is shorter than 24 characters; admin endpoints disabled")
    ADMIN_KEY = ""

# Anonymous submissions: per-client limit (in memory, per worker).
SUBMIT_RATE_LIMIT = int(os.getenv("SUBMIT_RATE_LIMIT_PER_HOUR", "10"))
_submit_requests: dict[str, list[float]] = defaultdict(list)

VALID_CATEGORIES = {"war", "discovery", "political", "cultural", "natural", "person"}

VALID_REVIEW_STATUSES = {"pending", "approved", "rejected"}

# ────────────────────────────────────────────
# Schemas
# ────────────────────────────────────────────


class SubmitEventRequest(BaseModel):
    """Payload for submitting a new historical event."""
    title: str = Field(..., min_length=1, max_length=300)
    year_approx: int = Field(..., ge=-10000, le=2100)
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    category: str
    description: str = Field(..., min_length=20, max_length=5000)
    source_url: Optional[str] = Field(default=None, max_length=2000, pattern=r"^https?://")

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: str) -> str:
        if v not in VALID_CATEGORIES:
            raise ValueError(f"category must be one of {sorted(VALID_CATEGORIES)}")
        return v


class SubmitEventResponse(BaseModel):
    """Response after successful event submission."""
    id: uuid.UUID
    slug: str


class AdminEventItem(BaseModel):
    """Single event in the admin listing."""
    id: uuid.UUID
    title: str
    year_approx: Optional[int]
    category: Optional[str]
    description: Optional[str]
    review_status: str
    created_at: str


class AdminReviewRequest(BaseModel):
    """Payload for approving/rejecting an event."""
    review_status: str
    admin_note: Optional[str] = None

    @field_validator("review_status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_REVIEW_STATUSES:
            raise ValueError(f"review_status must be one of {sorted(VALID_REVIEW_STATUSES)}")
        return v


class AdminReviewResponse(BaseModel):
    """Response after updating review status."""
    id: uuid.UUID
    review_status: str


# ────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────


def _slugify(title: str, year: int) -> str:
    """Generate a URL-safe slug from title and year."""
    text = f"{title}-{year}".lower()
    text = re.sub(r"[^a-z0-9\-]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:120]


def _require_admin(x_admin_key: Optional[str]) -> None:
    """Raise 403 if the admin key header is missing or wrong (constant-time compare)."""
    if not ADMIN_KEY:
        raise HTTPException(status_code=503, detail="Admin API is not configured")
    if not x_admin_key or not secrets.compare_digest(x_admin_key.encode(), ADMIN_KEY.encode()):
        raise HTTPException(status_code=403, detail="Invalid or missing admin key")


def _check_submit_rate_limit(client: str) -> None:
    now = time.time()
    window_start = now - 3600.0
    recent = [t for t in _submit_requests[client] if t > window_start]
    if len(recent) >= SUBMIT_RATE_LIMIT:
        _submit_requests[client] = recent
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")
    recent.append(now)
    _submit_requests[client] = recent
    if len(_submit_requests) > 10_000:
        for k in [k for k, v in _submit_requests.items() if not v or v[-1] <= window_start]:
            del _submit_requests[k]


# ────────────────────────────────────────────
# Routers
# ────────────────────────────────────────────

submit_router = APIRouter(prefix="/api/events", tags=["submit"])
admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


@submit_router.post("/submit", response_model=SubmitEventResponse)
async def submit_event(
    body: SubmitEventRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> SubmitEventResponse:
    """
    Submit a new historical event for admin review.

    Inserts with review_status='pending'. Returns the generated id and slug.
    """
    _check_submit_rate_limit(request.client.host if request.client else "unknown")
    slug = _slugify(body.title, body.year_approx)

    # Ensure slug uniqueness by appending a short suffix if needed
    existing = await db.execute(select(Event.id).where(Event.slug == slug))
    if existing.scalar_one_or_none() is not None:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    is_bce = body.year_approx < 0
    geo_point = ST_SetSRID(ST_MakePoint(body.lng, body.lat), 4326)

    event = Event(
        slug=slug,
        title=body.title,
        year_approx=body.year_approx,
        is_bce=is_bce,
        geo_point=geo_point,
        event_category=body.category,
        review_status="pending",
        created_by="user-submission",
        importance_score=0.3,
    )
    db.add(event)
    await db.flush()  # get the generated id

    await db.commit()
    return SubmitEventResponse(id=event.id, slug=slug)


@admin_router.get("/events", response_model=list[AdminEventItem])
async def list_admin_events(
    status: Optional[str] = None,
    x_admin_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> list[AdminEventItem]:
    """
    List events for admin review, optionally filtered by review_status.

    Protected by X-Admin-Key header.
    """
    _require_admin(x_admin_key)

    stmt = select(Event)
    if status:
        stmt = stmt.where(Event.review_status == status)
    stmt = stmt.order_by(Event.created_at.desc()).limit(200)

    result = await db.execute(stmt)
    events = result.scalars().all()

    return [
        AdminEventItem(
            id=e.id,
            title=e.title,
            year_approx=e.year_approx,
            category=e.event_category,
            description=None,  # description not stored as separate column yet
            review_status=e.review_status,
            created_at=e.created_at.isoformat() if e.created_at else "",
        )
        for e in events
    ]


@admin_router.patch("/events/{event_id}", response_model=AdminReviewResponse)
async def review_event(
    event_id: uuid.UUID,
    body: AdminReviewRequest,
    x_admin_key: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> AdminReviewResponse:
    """
    Approve or reject an event submission.

    Protected by X-Admin-Key header.
    """
    _require_admin(x_admin_key)

    stmt = select(Event).where(Event.id == event_id)
    result = await db.execute(stmt)
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.review_status = body.review_status
    await db.commit()

    return AdminReviewResponse(id=event.id, review_status=event.review_status)
