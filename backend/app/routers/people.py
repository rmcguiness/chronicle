"""
People router — serves people list and network graph data.

Owns: /api/people, /api/people/network
Does NOT own: event detail, search, or canvas endpoints.
"""

import uuid
from collections import defaultdict
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select, func, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Person, EventPerson

router = APIRouter(prefix="/api/people", tags=["people"])

# ── Constants ──────────────────────────────────────────────────────────────
CONTEMPORARY_YEAR_RANGE = 50
"""Two people born within this many years are considered contemporaries."""

SHARED_EVENT_THICK_THRESHOLD = 4
"""Edge is 'thick' when shared event count >= this value."""


# ── Response schemas ───────────────────────────────────────────────────────

class PersonOut(BaseModel):
    """Public representation of a historical figure."""
    id: str
    name: str
    slug: Optional[str]
    born_year: Optional[int]
    died_year: Optional[int]
    nationality: Optional[str]
    roles: Optional[List[str]]
    bio: Optional[str]
    importance_score: Optional[float]
    image_url: Optional[str]

    class Config:
        from_attributes = True


class NetworkNode(BaseModel):
    """A node in the people network graph."""
    id: str
    name: str
    born_year: Optional[int]
    died_year: Optional[int]
    roles: Optional[List[str]]
    image_url: Optional[str]


class NetworkEdge(BaseModel):
    """An edge connecting two people in the network graph."""
    source: str
    target: str
    weight: int
    edge_type: str  # "shared_event" or "contemporary"


class NetworkResponse(BaseModel):
    """Full network payload: nodes + edges."""
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]


# ── Helpers ────────────────────────────────────────────────────────────────

def _person_to_out(p: Person) -> PersonOut:
    """Convert a Person ORM instance to the API response model."""
    return PersonOut(
        id=str(p.id),
        name=p.name,
        slug=p.wikipedia_slug or str(p.id),
        born_year=p.birth_year,
        died_year=p.death_year,
        nationality=p.nationalities[0] if p.nationalities else None,
        roles=p.roles,
        bio=p.description,
        importance_score=None,  # Computed below if needed
        image_url=p.image_url,
    )


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.get("", response_model=List[PersonOut])
async def list_people(session: AsyncSession = Depends(get_db)):
    """Return all people with core fields."""
    result = await session.execute(select(Person).order_by(Person.name))
    people = result.scalars().all()

    # Compute importance_score: number of events each person is linked to
    ep_result = await session.execute(
        select(EventPerson.person_id, func.count().label("cnt"))
        .group_by(EventPerson.person_id)
    )
    event_counts = {str(row.person_id): row.cnt for row in ep_result}

    out = []
    for p in people:
        po = _person_to_out(p)
        po.importance_score = event_counts.get(str(p.id), 0)
        out.append(po)
    return out


@router.get("/network", response_model=NetworkResponse)
async def people_network(session: AsyncSession = Depends(get_db)):
    """
    Return the people network graph: nodes + edges.

    Edges are derived from:
    1. Shared events — two people linked to the same event via event_people.
       Weight = number of shared events.
    2. Contemporary proximity — born within CONTEMPORARY_YEAR_RANGE years.
       Weight = 1 (weak link), only added if no shared-event edge exists.
    """
    # Fetch all people
    result = await session.execute(select(Person).order_by(Person.name))
    people = result.scalars().all()

    nodes = [
        NetworkNode(
            id=str(p.id),
            name=p.name,
            born_year=p.birth_year,
            died_year=p.death_year,
            roles=p.roles,
            image_url=p.image_url,
        )
        for p in people
    ]

    # Build shared-event edges via SQL: self-join event_people on event_id
    shared_q = text("""
        SELECT
            ep1.person_id AS p1,
            ep2.person_id AS p2,
            COUNT(DISTINCT ep1.event_id) AS shared_count
        FROM event_people ep1
        JOIN event_people ep2
            ON ep1.event_id = ep2.event_id
            AND ep1.person_id < ep2.person_id
        GROUP BY ep1.person_id, ep2.person_id
    """)
    shared_result = await session.execute(shared_q)

    edges: list[NetworkEdge] = []
    shared_pairs: set[tuple[str, str]] = set()

    for row in shared_result:
        p1, p2, cnt = str(row.p1), str(row.p2), row.shared_count
        edges.append(NetworkEdge(source=p1, target=p2, weight=cnt, edge_type="shared_event"))
        shared_pairs.add((p1, p2))

    # Contemporary edges for pairs without shared events
    people_with_birth = [(str(p.id), p.birth_year) for p in people if p.birth_year is not None]
    for i, (id_a, year_a) in enumerate(people_with_birth):
        for j in range(i + 1, len(people_with_birth)):
            id_b, year_b = people_with_birth[j]
            if abs(year_a - year_b) <= CONTEMPORARY_YEAR_RANGE:
                pair = (min(id_a, id_b), max(id_a, id_b))
                if pair not in shared_pairs:
                    edges.append(NetworkEdge(source=pair[0], target=pair[1], weight=1, edge_type="contemporary"))

    return NetworkResponse(nodes=nodes, edges=edges)
