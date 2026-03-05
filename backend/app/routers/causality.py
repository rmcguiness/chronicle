"""
GET /api/causality — return all approved causality links.

Used by the Network view to render the full causality graph without
needing to know which events are in the current viewport.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink
from app.schemas import CausalityLinkItem, _LINK_TYPE_MAP

router = APIRouter(prefix="/api/causality", tags=["causality"])


@router.get("", response_model=dict)
async def get_all_causality_links(
    limit: int = Query(default=1000, ge=1, le=5000, description="Max links to return"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Return all approved causality links with from/to event IDs and relationship type."""
    stmt = (
        select(
            CausalityLink.id,
            CausalityLink.cause_event_id,
            CausalityLink.effect_event_id,
            CausalityLink.link_type,
            CausalityLink.strength,
            CausalityLink.description,
        )
        .where(CausalityLink.review_status == "approved")
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.fetchall()

    links = [
        CausalityLinkItem(
            id=row.id,
            cause_event_id=row.cause_event_id,
            effect_event_id=row.effect_event_id,
            connection_type=_LINK_TYPE_MAP.get(row.link_type, "context"),
            strength=row.strength,
            description=row.description,
        )
        for row in rows
    ]

    return {"links": [link.model_dump() for link in links]}
