"""
GET /api/what-if/{slug} — counterfactual history explorer.

Uses a recursive CTE on causality_links to find all downstream effects
of a given event up to 4 hops. Returns the original event plus grouped
downstream effects, era impact, and notable effects.
"""
from __future__ import annotations

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(prefix="/api/what-if", tags=["what-if"])


# ── Response schemas ─────────────────────────────────────────────────────────

class DownstreamEvent(BaseModel):
    id: str
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None
    importance_score: float = 0.5
    geo_modern: Optional[str] = None
    hop: int
    link_description: Optional[str] = None


class WhatIfResponse(BaseModel):
    event: dict  # original event (id, slug, title, year_approx, category, importance_score, geo_modern)
    downstream_effects: dict[str, List[DownstreamEvent]]  # grouped by hop label
    total_downstream_count: int
    era_impact: List[str]  # distinct categories affected
    notable_effects: List[DownstreamEvent]  # top 3 by importance


# ── Endpoint ─────────────────────────────────────────────────────────────────

@router.get("/{slug}", response_model=WhatIfResponse)
async def get_what_if(slug: str, db: AsyncSession = Depends(get_db)) -> WhatIfResponse:
    """
    Given an event slug, find all downstream causal effects up to 4 hops
    using a recursive CTE on the causality_links table.
    """
    # 1. Fetch the source event
    event_row = await db.execute(
        text("""
            SELECT id, slug, title, year_approx, event_category, importance_score, geo_modern
            FROM events
            WHERE slug = :slug AND review_status = 'approved'
            LIMIT 1
        """),
        {"slug": slug},
    )
    event = event_row.fetchone()
    if not event:
        raise HTTPException(status_code=404, detail=f"Event not found: {slug}")

    event_dict = {
        "id": str(event.id),
        "slug": event.slug,
        "title": event.title,
        "year_approx": event.year_approx,
        "category": event.event_category,
        "importance_score": event.importance_score,
        "geo_modern": event.geo_modern,
    }

    # 2. Recursive CTE: find all downstream effects up to 4 hops
    result = await db.execute(
        text("""
            WITH RECURSIVE downstream AS (
                -- Base case: direct effects of the source event
                SELECT
                    cl.effect_event_id AS event_id,
                    1 AS hop,
                    cl.description AS link_description
                FROM causality_links cl
                WHERE cl.cause_event_id = :event_id
                  AND cl.review_status = 'approved'

                UNION

                -- Recursive case: effects of effects, up to 4 hops
                SELECT
                    cl.effect_event_id,
                    d.hop + 1,
                    cl.description
                FROM downstream d
                JOIN causality_links cl ON cl.cause_event_id = d.event_id
                WHERE d.hop < 4
                  AND cl.review_status = 'approved'
                  AND cl.effect_event_id != :event_id  -- prevent cycles back to source
            )
            SELECT DISTINCT ON (e.id)
                e.id, e.slug, e.title, e.year_approx, e.event_category,
                e.importance_score, e.geo_modern,
                d.hop, d.link_description
            FROM downstream d
            JOIN events e ON e.id = d.event_id
            WHERE e.review_status = 'approved'
            ORDER BY e.id, d.hop  -- keep the shortest path (smallest hop)
        """),
        {"event_id": event.id},
    )
    rows = result.fetchall()

    # 3. Build downstream effects grouped by hop
    hop_labels = {1: "direct", 2: "secondary", 3: "tertiary", 4: "quaternary"}
    grouped: dict[str, list[DownstreamEvent]] = {}
    all_effects: list[DownstreamEvent] = []

    for row in rows:
        effect = DownstreamEvent(
            id=str(row.id),
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            category=row.event_category,
            importance_score=row.importance_score,
            geo_modern=row.geo_modern,
            hop=row.hop,
            link_description=row.link_description,
        )
        label = hop_labels.get(row.hop, f"hop-{row.hop}")
        grouped.setdefault(label, []).append(effect)
        all_effects.append(effect)

    # Sort each group by year
    for effects in grouped.values():
        effects.sort(key=lambda e: e.year_approx or 9999)

    # 4. Era impact: distinct categories affected
    era_impact = sorted(set(
        e.category for e in all_effects if e.category
    ))

    # 5. Notable effects: top 3 by importance score
    notable = sorted(all_effects, key=lambda e: e.importance_score, reverse=True)[:3]

    return WhatIfResponse(
        event=event_dict,
        downstream_effects=grouped,
        total_downstream_count=len(all_effects),
        era_impact=era_impact,
        notable_effects=notable,
    )
