"""
GET /api/events/{slug}/chain — recursive causal chain traversal.

Forward mode: follows cause → effect links (what did this event cause?)
Backward mode: follows effect → cause links (what caused this event?)
Uses a recursive CTE for efficient multi-hop traversal.

Owns: chain endpoint only.
Does NOT own: causality_links schema, event detail, search.
"""
from __future__ import annotations

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from geoalchemy2.functions import ST_X, ST_Y
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(prefix="/api/events", tags=["chains"])

# ── Constants ─────────────────────────────────────────────────────────────────
MIN_DEPTH = 1
MAX_DEPTH = 5
DEFAULT_DEPTH = 3


# ── Response schemas ──────────────────────────────────────────────────────────

class ChainEventItem(BaseModel):
    """A single event node in the causal chain."""
    id: UUID
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None
    region: Optional[str] = None
    importance_score: float = 0.5
    lat: Optional[float] = None
    lng: Optional[float] = None
    short_description: Optional[str] = None


class ChainLink(BaseModel):
    """One hop in the causal chain: event + the link that connects it."""
    event: ChainEventItem
    link_description: Optional[str] = None
    link_type: str = "direct"
    strength: float = 0.5
    hop_number: int


class ChainResponse(BaseModel):
    """Full chain response with root event and ordered hops."""
    root: ChainEventItem
    chain: list[ChainLink]
    direction: str
    depth: int


@router.get("/{slug}/chain", response_model=ChainResponse)
async def get_causal_chain(
    slug: str,
    direction: str = Query(default="forward", regex="^(forward|backward)$"),
    depth: int = Query(default=DEFAULT_DEPTH, ge=MIN_DEPTH, le=MAX_DEPTH),
    db: AsyncSession = Depends(get_db),
) -> ChainResponse:
    """
    Traverse the causal chain from a root event.

    - **forward**: follow cause_event_id → effect_event_id (what did this cause?)
    - **backward**: follow effect_event_id → cause_event_id (what caused this?)
    - **depth**: number of hops (1–5, default 3)

    Returns the root event and an ordered list of chain links with hop numbers.
    """
    # Resolve root event
    root_result = await db.execute(
        text("""
            SELECT id, slug, title, year_approx, event_category, geo_modern,
                   importance_score, ST_X(geo_point) as lng, ST_Y(geo_point) as lat
            FROM events WHERE slug = :slug AND review_status = 'approved'
        """),
        {"slug": slug},
    )
    root_row = root_result.fetchone()
    if not root_row:
        raise HTTPException(status_code=404, detail=f"Event '{slug}' not found")

    root_event = ChainEventItem(
        id=root_row.id,
        slug=root_row.slug,
        title=root_row.title,
        year_approx=root_row.year_approx,
        category=root_row.event_category,
        region=root_row.geo_modern,
        importance_score=root_row.importance_score or 0.5,
        lat=float(root_row.lat) if root_row.lat is not None else None,
        lng=float(root_row.lng) if root_row.lng is not None else None,
    )

    # Build recursive CTE based on direction
    if direction == "forward":
        # cause → effect: start from root as cause, follow to effects
        cte_sql = """
            WITH RECURSIVE chain AS (
                SELECT cl.effect_event_id AS event_id,
                       cl.description AS link_description,
                       cl.link_type,
                       cl.strength,
                       1 AS hop,
                       ARRAY[cl.cause_event_id] AS visited
                FROM causality_links cl
                WHERE cl.cause_event_id = :root_id
                  AND cl.review_status = 'approved'

                UNION ALL

                SELECT cl.effect_event_id,
                       cl.description,
                       cl.link_type,
                       cl.strength,
                       c.hop + 1,
                       c.visited || cl.cause_event_id
                FROM chain c
                JOIN causality_links cl ON cl.cause_event_id = c.event_id
                WHERE c.hop < :depth
                  AND cl.review_status = 'approved'
                  AND NOT (cl.effect_event_id = ANY(c.visited))
            )
            SELECT DISTINCT ON (e.id)
                   e.id, e.slug, e.title, e.year_approx, e.event_category,
                   e.geo_modern, e.importance_score,
                   ST_X(e.geo_point) as lng, ST_Y(e.geo_point) as lat,
                   c.link_description, c.link_type, c.strength, c.hop
            FROM chain c
            JOIN events e ON e.id = c.event_id
            WHERE e.review_status = 'approved'
            ORDER BY e.id, c.hop
        """
    else:
        # backward: effect → cause
        cte_sql = """
            WITH RECURSIVE chain AS (
                SELECT cl.cause_event_id AS event_id,
                       cl.description AS link_description,
                       cl.link_type,
                       cl.strength,
                       1 AS hop,
                       ARRAY[cl.effect_event_id] AS visited
                FROM causality_links cl
                WHERE cl.effect_event_id = :root_id
                  AND cl.review_status = 'approved'

                UNION ALL

                SELECT cl.cause_event_id,
                       cl.description,
                       cl.link_type,
                       cl.strength,
                       c.hop + 1,
                       c.visited || cl.effect_event_id
                FROM chain c
                JOIN causality_links cl ON cl.effect_event_id = c.event_id
                WHERE c.hop < :depth
                  AND cl.review_status = 'approved'
                  AND NOT (cl.cause_event_id = ANY(c.visited))
            )
            SELECT DISTINCT ON (e.id)
                   e.id, e.slug, e.title, e.year_approx, e.event_category,
                   e.geo_modern, e.importance_score,
                   ST_X(e.geo_point) as lng, ST_Y(e.geo_point) as lat,
                   c.link_description, c.link_type, c.strength, c.hop
            FROM chain c
            JOIN events e ON e.id = c.event_id
            WHERE e.review_status = 'approved'
            ORDER BY e.id, c.hop
        """

    result = await db.execute(text(cte_sql), {"root_id": str(root_row.id), "depth": depth})
    rows = result.fetchall()

    chain_links = sorted(
        [
            ChainLink(
                event=ChainEventItem(
                    id=row.id,
                    slug=row.slug,
                    title=row.title,
                    year_approx=row.year_approx,
                    category=row.event_category,
                    region=row.geo_modern,
                    importance_score=row.importance_score or 0.5,
                    lat=float(row.lat) if row.lat is not None else None,
                    lng=float(row.lng) if row.lng is not None else None,
                ),
                link_description=row.link_description,
                link_type=row.link_type,
                strength=row.strength,
                hop_number=row.hop,
            )
            for row in rows
        ],
        key=lambda x: (x.hop_number, x.event.year_approx or 0),
    )

    return ChainResponse(
        root=root_event,
        chain=chain_links,
        direction=direction,
        depth=depth,
    )
