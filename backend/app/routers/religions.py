"""
World religions explorer — hardcoded dataset of 8 major religions plus
DB-sourced religious events.

Route prefix: /api/religions
"""
from __future__ import annotations

import logging

from fastapi import APIRouter
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select, or_, func

from app.database import AsyncSessionLocal
from app.models import Event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/religions", tags=["religions"])


# ── Models ────────────────────────────────────────────────────────────────────

class ReligionEvent(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    slug: str
    title: str
    year: int
    category: str
    importance: float


class ReligionsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    events: list[ReligionEvent]
    total: int


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.get("/events", response_model=ReligionsResponse)
async def get_religion_events():
    """Return religion-related events from the DB, sorted by year."""
    try:
        async with AsyncSessionLocal() as session:
            stmt = (
                select(Event)
                .where(
                    Event.review_status == "approved",
                    or_(
                        Event.event_category == "religious",
                        func.lower(Event.title).like("%religio%"),
                        func.lower(Event.title).like("%church%"),
                        func.lower(Event.title).like("%islam%"),
                        func.lower(Event.title).like("%christ%"),
                        func.lower(Event.title).like("%buddh%"),
                        func.lower(Event.title).like("%hindu%"),
                        func.lower(Event.title).like("%mosque%"),
                        func.lower(Event.title).like("%temple%"),
                        func.lower(Event.title).like("%pope%"),
                        func.lower(Event.title).like("%crusad%"),
                        func.lower(Event.title).like("%protestant%"),
                        func.lower(Event.title).like("%catholic%"),
                        func.lower(Event.title).like("%muhammad%"),
                        func.lower(Event.title).like("%confuci%"),
                        func.lower(Event.title).like("%zoroast%"),
                        func.lower(Event.title).like("%judaism%"),
                        func.lower(Event.title).like("%moses%"),
                        func.lower(Event.title).like("%jesus%"),
                        func.lower(Event.title).like("%vedic%"),
                        func.lower(Event.title).like("%sikh%"),
                        func.lower(Event.title).like("%monasti%"),
                        func.lower(Event.title).like("%quran%"),
                        func.lower(Event.title).like("%gospel%"),
                        func.lower(Event.title).like("%torah%"),
                        func.lower(Event.title).like("%caliphate%"),
                    ),
                )
                .order_by(Event.year_approx)
            )
            result = await session.execute(stmt)
            rows = result.scalars().all()

            events = [
                ReligionEvent(
                    slug=r.slug,
                    title=r.title,
                    year=r.year_approx or 0,
                    category=r.event_category or "unknown",
                    importance=r.importance_score or 0.0,
                )
                for r in rows
            ]
            return ReligionsResponse(events=events, total=len(events))
    except Exception as exc:
        logger.error("Error fetching religion events: %s", exc)
        return ReligionsResponse(events=[], total=0)
