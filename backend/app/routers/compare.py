"""
GET /api/events/{slug}/causal-path?target={target_slug}  — BFS causal chain between two events
GET /api/compare/random-pair                              — two random high-importance events
GET /api/compare/shared-people?a={slugA}&b={slugB}        — people linked to both events
GET /api/compare/nearby?slug={slug}&years=50              — events within N years of a given event
"""
from __future__ import annotations

from collections import deque
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson, Person

router = APIRouter(tags=["compare"])


# ─── Schemas ─────────────────────────────────────────────────────────────────

class CausalPathStep(BaseModel):
    """A single node in the causal path."""
    slug: str
    title: str
    year_approx: Optional[int] = None


class CausalPathResponse(BaseModel):
    """Response for causal-path lookup between two events."""
    found: bool
    steps: list[CausalPathStep] = []
    length: int = 0


class RandomPairResponse(BaseModel):
    """Two random high-importance event slugs."""
    a: str
    b: str


class SharedPersonItem(BaseModel):
    """A person linked to both compared events."""
    id: UUID
    name: str
    roles_a: list[str] = []
    roles_b: list[str] = []
    description: Optional[str] = None
    image_url: Optional[str] = None


class SharedPeopleResponse(BaseModel):
    """People connected to both events."""
    people: list[SharedPersonItem] = []


class NearbyEventItem(BaseModel):
    """An event near another event in time."""
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None


class NearbyEventsResponse(BaseModel):
    """Events within a year range of a target event."""
    events: list[NearbyEventItem] = []


# ─── Causal path (BFS) ──────────────────────────────────────────────────────

@router.get(
    "/api/events/{slug}/causal-path",
    response_model=CausalPathResponse,
)
async def causal_path(
    slug: str,
    target: str = Query(..., description="Target event slug"),
    max_depth: int = Query(default=10, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> CausalPathResponse:
    """Find the shortest causal chain between two events via BFS."""
    # Resolve slugs → IDs
    stmt = select(Event.id, Event.slug, Event.title, Event.year_approx).where(
        Event.slug.in_([slug, target])
    )
    result = await db.execute(stmt)
    rows = {r.slug: r for r in result.fetchall()}

    if slug not in rows:
        raise HTTPException(404, f"Event '{slug}' not found")
    if target not in rows:
        raise HTTPException(404, f"Event '{target}' not found")

    source_id = rows[slug].id
    target_id = rows[target].id

    if source_id == target_id:
        step = CausalPathStep(
            slug=rows[slug].slug,
            title=rows[slug].title,
            year_approx=rows[slug].year_approx,
        )
        return CausalPathResponse(found=True, steps=[step], length=0)

    # Load all approved causality links into an adjacency list
    link_stmt = select(
        CausalityLink.cause_event_id,
        CausalityLink.effect_event_id,
    ).where(CausalityLink.review_status == "approved")
    link_result = await db.execute(link_stmt)

    adjacency: dict[UUID, set[UUID]] = {}
    for lnk in link_result.fetchall():
        adjacency.setdefault(lnk.cause_event_id, set()).add(lnk.effect_event_id)
        adjacency.setdefault(lnk.effect_event_id, set()).add(lnk.cause_event_id)

    # BFS
    visited: set[UUID] = {source_id}
    queue: deque[list[UUID]] = deque([[source_id]])

    found_path: list[UUID] | None = None
    while queue:
        path = queue.popleft()
        if len(path) > max_depth + 1:
            break
        current = path[-1]
        for neighbor in adjacency.get(current, set()):
            if neighbor in visited:
                continue
            new_path = path + [neighbor]
            if neighbor == target_id:
                found_path = new_path
                break
            visited.add(neighbor)
            queue.append(new_path)
        if found_path:
            break

    if not found_path:
        return CausalPathResponse(found=False)

    # Resolve IDs → event info
    path_ids = list(found_path)
    ev_stmt = select(
        Event.id, Event.slug, Event.title, Event.year_approx
    ).where(Event.id.in_(path_ids))
    ev_result = await db.execute(ev_stmt)
    id_map = {r.id: r for r in ev_result.fetchall()}

    steps = []
    for eid in path_ids:
        ev = id_map.get(eid)
        if ev:
            steps.append(CausalPathStep(
                slug=ev.slug, title=ev.title, year_approx=ev.year_approx
            ))

    return CausalPathResponse(found=True, steps=steps, length=len(steps) - 1)


# ─── Random pair ─────────────────────────────────────────────────────────────

@router.get("/api/compare/random-pair", response_model=RandomPairResponse)
async def random_pair(
    db: AsyncSession = Depends(get_db),
) -> RandomPairResponse:
    """Return two random high-importance approved events."""
    stmt = (
        select(Event.slug)
        .where(
            Event.review_status == "approved",
            Event.importance_score >= 0.7,
        )
        .order_by(func.random())
        .limit(2)
    )
    result = await db.execute(stmt)
    slugs = [r.slug for r in result.fetchall()]

    if len(slugs) < 2:
        raise HTTPException(503, "Not enough events for a random pair")

    return RandomPairResponse(a=slugs[0], b=slugs[1])


# ─── Shared people ───────────────────────────────────────────────────────────

@router.get("/api/compare/shared-people", response_model=SharedPeopleResponse)
async def shared_people(
    a: str = Query(..., description="Event A slug"),
    b: str = Query(..., description="Event B slug"),
    db: AsyncSession = Depends(get_db),
) -> SharedPeopleResponse:
    """Find historical figures linked to both events."""
    # Resolve slugs → IDs
    ev_stmt = select(Event.id, Event.slug).where(Event.slug.in_([a, b]))
    ev_result = await db.execute(ev_stmt)
    ev_map = {r.slug: r.id for r in ev_result.fetchall()}

    if a not in ev_map:
        raise HTTPException(404, f"Event '{a}' not found")
    if b not in ev_map:
        raise HTTPException(404, f"Event '{b}' not found")

    id_a, id_b = ev_map[a], ev_map[b]

    # Find person IDs in both events
    stmt = text("""
        SELECT ep_a.person_id,
               array_agg(DISTINCT ep_a.role) AS roles_a,
               array_agg(DISTINCT ep_b.role) AS roles_b
        FROM event_people ep_a
        JOIN event_people ep_b ON ep_a.person_id = ep_b.person_id
        WHERE ep_a.event_id = :id_a AND ep_b.event_id = :id_b
        GROUP BY ep_a.person_id
    """)
    result = await db.execute(stmt, {"id_a": str(id_a), "id_b": str(id_b)})
    rows = result.fetchall()

    if not rows:
        return SharedPeopleResponse(people=[])

    person_ids = [r.person_id for r in rows]
    roles_map = {r.person_id: (r.roles_a, r.roles_b) for r in rows}

    # Fetch person details
    p_stmt = select(
        Person.id, Person.name, Person.description, Person.image_url
    ).where(Person.id.in_(person_ids))
    p_result = await db.execute(p_stmt)

    people = []
    for p in p_result.fetchall():
        roles_a, roles_b = roles_map.get(p.id, ([], []))
        people.append(SharedPersonItem(
            id=p.id,
            name=p.name,
            roles_a=roles_a or [],
            roles_b=roles_b or [],
            description=p.description,
            image_url=p.image_url,
        ))

    return SharedPeopleResponse(people=people)


# ─── Nearby events (within N years) ─────────────────────────────────────────

@router.get("/api/compare/nearby", response_model=NearbyEventsResponse)
async def nearby_events(
    slug: str = Query(..., description="Event slug"),
    years: int = Query(default=50, ge=1, le=500),
    limit: int = Query(default=5, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
) -> NearbyEventsResponse:
    """Return events within N years of the given event (excluding itself)."""
    ev_stmt = select(Event.id, Event.year_approx).where(Event.slug == slug)
    ev_result = await db.execute(ev_stmt)
    ev = ev_result.fetchone()

    if not ev:
        raise HTTPException(404, f"Event '{slug}' not found")
    if ev.year_approx is None:
        return NearbyEventsResponse(events=[])

    year = ev.year_approx
    stmt = (
        select(Event.slug, Event.title, Event.year_approx, Event.event_category)
        .where(
            Event.review_status == "approved",
            Event.id != ev.id,
            Event.year_approx.isnot(None),
            Event.year_approx >= year - years,
            Event.year_approx <= year + years,
        )
        .order_by(Event.importance_score.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)

    return NearbyEventsResponse(
        events=[
            NearbyEventItem(
                slug=r.slug,
                title=r.title,
                year_approx=r.year_approx,
                category=r.event_category,
            )
            for r in result.fetchall()
        ]
    )
