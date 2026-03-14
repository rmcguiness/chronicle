"""
GET /api/influence — compute historical influence scores from the causality graph.

Returns:
  - Top 50 most influential events (by ripple score across causality chains)
  - Top 20 most influential people (by summed ripple scores of linked events)
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db

router = APIRouter(prefix="/api/influence", tags=["influence"])


class InfluentialEvent(BaseModel):
    """A single event with computed influence metrics."""

    event_slug: str
    title: str
    year_approx: int | None
    category: str | None
    region: str | None
    direct_count: int
    ripple_count: int
    people_count: int
    influence_score: float


class InfluentialPerson(BaseModel):
    """A person ranked by the aggregate influence of their linked events."""

    person_id: str
    name: str
    birth_year: int | None
    death_year: int | None
    total_ripple: int
    top_event_title: str | None
    top_event_slug: str | None


class InfluenceResponse(BaseModel):
    """Response wrapper for the influence endpoint."""

    events: list[InfluentialEvent]
    people: list[InfluentialPerson]


# Raw SQL for the recursive influence computation.
# Using raw SQL because SQLAlchemy's ORM makes recursive CTEs verbose
# and this is a read-only analytics query.
_EVENTS_QUERY = text("""
WITH RECURSIVE downstream AS (
    -- Base: direct effects of each event
    SELECT
        cl.cause_event_id AS root_id,
        cl.effect_event_id AS reached_id,
        1 AS depth
    FROM causality_links cl
    WHERE cl.review_status = 'approved'

    UNION ALL

    -- Recurse up to 4 hops
    SELECT
        d.root_id,
        cl.effect_event_id AS reached_id,
        d.depth + 1
    FROM downstream d
    JOIN causality_links cl
        ON cl.cause_event_id = d.reached_id
       AND cl.review_status = 'approved'
    WHERE d.depth < 4
),
direct_counts AS (
    SELECT
        cause_event_id AS event_id,
        COUNT(DISTINCT effect_event_id) AS direct_count
    FROM causality_links
    WHERE review_status = 'approved'
    GROUP BY cause_event_id
),
ripple_counts AS (
    SELECT
        root_id AS event_id,
        COUNT(DISTINCT reached_id) AS ripple_count
    FROM downstream
    GROUP BY root_id
),
people_counts AS (
    SELECT
        ep.event_id,
        COUNT(DISTINCT ep.person_id) AS people_count
    FROM event_people ep
    GROUP BY ep.event_id
)
SELECT
    e.slug AS event_slug,
    e.title,
    e.year_approx,
    e.event_category AS category,
    e.geo_modern AS region,
    COALESCE(dc.direct_count, 0) AS direct_count,
    COALESCE(rc.ripple_count, 0) AS ripple_count,
    COALESCE(pc.people_count, 0) AS people_count,
    (COALESCE(dc.direct_count, 0) * 1.0
     + COALESCE(rc.ripple_count, 0) * 0.3
     + COALESCE(pc.people_count, 0) * 2.0) AS influence_score
FROM events e
LEFT JOIN direct_counts dc ON dc.event_id = e.id
LEFT JOIN ripple_counts rc ON rc.event_id = e.id
LEFT JOIN people_counts pc ON pc.event_id = e.id
WHERE e.review_status = 'approved'
  AND (COALESCE(dc.direct_count, 0) > 0
       OR COALESCE(rc.ripple_count, 0) > 0
       OR COALESCE(pc.people_count, 0) > 0)
ORDER BY influence_score DESC
LIMIT 50
""")

_PEOPLE_QUERY = text("""
WITH RECURSIVE downstream AS (
    SELECT
        cl.cause_event_id AS root_id,
        cl.effect_event_id AS reached_id,
        1 AS depth
    FROM causality_links cl
    WHERE cl.review_status = 'approved'

    UNION ALL

    SELECT
        d.root_id,
        cl.effect_event_id AS reached_id,
        d.depth + 1
    FROM downstream d
    JOIN causality_links cl
        ON cl.cause_event_id = d.reached_id
       AND cl.review_status = 'approved'
    WHERE d.depth < 4
),
ripple_counts AS (
    SELECT
        root_id AS event_id,
        COUNT(DISTINCT reached_id) AS ripple_count
    FROM downstream
    GROUP BY root_id
),
person_scores AS (
    SELECT
        ep.person_id,
        SUM(COALESCE(rc.ripple_count, 0)) AS total_ripple,
        -- pick the event with the highest ripple for this person
        (ARRAY_AGG(e.title ORDER BY COALESCE(rc.ripple_count, 0) DESC))[1] AS top_event_title,
        (ARRAY_AGG(e.slug ORDER BY COALESCE(rc.ripple_count, 0) DESC))[1] AS top_event_slug
    FROM event_people ep
    JOIN events e ON e.id = ep.event_id AND e.review_status = 'approved'
    LEFT JOIN ripple_counts rc ON rc.event_id = ep.event_id
    GROUP BY ep.person_id
)
SELECT
    p.id::text AS person_id,
    p.name,
    p.birth_year,
    p.death_year,
    COALESCE(ps.total_ripple, 0)::int AS total_ripple,
    ps.top_event_title,
    ps.top_event_slug
FROM people p
JOIN person_scores ps ON ps.person_id = p.id
ORDER BY ps.total_ripple DESC
LIMIT 20
""")


@router.get("", response_model=InfluenceResponse)
async def get_influence(db: AsyncSession = Depends(get_db)) -> InfluenceResponse:
    """Compute and return historical influence rankings for events and people."""
    events_result = await db.execute(_EVENTS_QUERY)
    events_rows = events_result.fetchall()

    people_result = await db.execute(_PEOPLE_QUERY)
    people_rows = people_result.fetchall()

    events = [
        InfluentialEvent(
            event_slug=row.event_slug,
            title=row.title,
            year_approx=row.year_approx,
            category=row.category,
            region=row.region,
            direct_count=row.direct_count,
            ripple_count=row.ripple_count,
            people_count=row.people_count,
            influence_score=float(row.influence_score),
        )
        for row in events_rows
    ]

    people = [
        InfluentialPerson(
            person_id=row.person_id,
            name=row.name,
            birth_year=row.birth_year,
            death_year=row.death_year,
            total_ripple=row.total_ripple,
            top_event_title=row.top_event_title,
            top_event_slug=row.top_event_slug,
        )
        for row in people_rows
    ]

    return InfluenceResponse(events=events, people=people)
