"""
GET /api/path?from={slug}&to={slug} — BFS shortest causal path between two events.

Returns the shortest chain of causality links connecting the two events,
or a "no path" response with nearest-connection hints.
"""
from __future__ import annotations

from collections import deque
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event
from app.schemas import _LINK_TYPE_MAP

router = APIRouter(prefix="/api/path", tags=["path"])


class PathEvent(BaseModel):
    """Lightweight event in a causal path."""
    id: str
    slug: str
    title: str
    year_approx: Optional[int] = None
    category: Optional[str] = None
    geo_modern: Optional[str] = None


class PathStep(BaseModel):
    """A single edge in the causal path."""
    from_event: PathEvent
    to_event: PathEvent
    connection_type: str
    description: Optional[str] = None


class PathFoundResponse(BaseModel):
    """Returned when a causal path exists between two events."""
    found: bool = True
    steps: int
    path: list[PathEvent]
    edges: list[PathStep]
    years_spanned: int
    regions: list[str]


class PathNotFoundResponse(BaseModel):
    """Returned when no causal path exists."""
    found: bool = False
    steps: int = -1
    path: list[PathEvent] = []
    edges: list[PathStep] = []
    nearest_from: Optional[PathEvent] = None
    nearest_from_steps: int = 0
    nearest_to: Optional[PathEvent] = None
    nearest_to_steps: int = 0


class GraphStats(BaseModel):
    """Global statistics about the causality graph."""
    total_events: int
    total_links: int
    avg_degree: float


@router.get("/stats", response_model=GraphStats)
async def get_graph_stats(db: AsyncSession = Depends(get_db)) -> GraphStats:
    """Return aggregate stats about the causality graph."""
    events_count = (
        await db.execute(
            select(func.count()).select_from(Event).where(Event.review_status == "approved")
        )
    ).scalar() or 0

    links_count = (
        await db.execute(
            select(func.count()).select_from(CausalityLink).where(
                CausalityLink.review_status == "approved"
            )
        )
    ).scalar() or 0

    avg_deg = (2 * links_count / events_count) if events_count > 0 else 0

    return GraphStats(
        total_events=events_count,
        total_links=links_count,
        avg_degree=round(avg_deg, 1),
    )


@router.get("")
async def find_causal_path(
    from_slug: str = Query(..., alias="from", description="Start event slug"),
    to_slug: str = Query(..., alias="to", description="End event slug"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """BFS shortest causal path between two events.

    Treats all causality links as undirected edges (cause <-> effect)
    so that the path can traverse the graph in either direction.
    """
    # ── 1. Resolve slugs to UUIDs ────────────────────────────────────────────
    from_row = (
        await db.execute(
            select(Event.id, Event.slug, Event.title, Event.year_approx, Event.event_category, Event.geo_modern)
            .where(Event.slug == from_slug)
        )
    ).fetchone()
    if not from_row:
        raise HTTPException(404, f"Event '{from_slug}' not found")

    to_row = (
        await db.execute(
            select(Event.id, Event.slug, Event.title, Event.year_approx, Event.event_category, Event.geo_modern)
            .where(Event.slug == to_slug)
        )
    ).fetchone()
    if not to_row:
        raise HTTPException(404, f"Event '{to_slug}' not found")

    from_id: UUID = from_row.id
    to_id: UUID = to_row.id

    if from_id == to_id:
        ev = PathEvent(
            id=str(from_row.id), slug=from_row.slug, title=from_row.title,
            year_approx=from_row.year_approx, category=from_row.event_category,
            geo_modern=from_row.geo_modern,
        )
        return PathFoundResponse(
            steps=0, path=[ev], edges=[], years_spanned=0, regions=_unique_regions([ev]),
        ).model_dump()

    # ── 2. Load full adjacency list ──────────────────────────────────────────
    link_stmt = select(
        CausalityLink.cause_event_id,
        CausalityLink.effect_event_id,
        CausalityLink.link_type,
        CausalityLink.description,
    ).where(CausalityLink.review_status == "approved")

    link_rows = (await db.execute(link_stmt)).fetchall()

    # Build bidirectional adjacency: event_id -> [(neighbour_id, link_type, description)]
    adj: dict[UUID, list[tuple[UUID, str, str | None]]] = {}
    for row in link_rows:
        cause, effect, lt, desc = row.cause_event_id, row.effect_event_id, row.link_type, row.description
        conn = _LINK_TYPE_MAP.get(lt, "context")
        adj.setdefault(cause, []).append((effect, conn, desc))
        adj.setdefault(effect, []).append((cause, conn, desc))

    # ── 3. BFS ───────────────────────────────────────────────────────────────
    queue: deque[UUID] = deque([from_id])
    parent: dict[UUID, tuple[UUID | None, str, str | None]] = {from_id: (None, "", None)}

    while queue:
        current = queue.popleft()
        if current == to_id:
            break
        for neighbour, conn_type, desc in adj.get(current, []):
            if neighbour not in parent:
                parent[neighbour] = (current, conn_type, desc)
                queue.append(neighbour)

    if to_id not in parent:
        # No path found — find nearest connected events for hints
        from_ev = PathEvent(
            id=str(from_row.id), slug=from_row.slug, title=from_row.title,
            year_approx=from_row.year_approx, category=from_row.event_category,
            geo_modern=from_row.geo_modern,
        )
        to_ev = PathEvent(
            id=str(to_row.id), slug=to_row.slug, title=to_row.title,
            year_approx=to_row.year_approx, category=to_row.event_category,
            geo_modern=to_row.geo_modern,
        )
        return PathNotFoundResponse(
            nearest_from=from_ev,
            nearest_from_steps=len(parent) - 1,
            nearest_to=to_ev,
            nearest_to_steps=0,
        ).model_dump()

    # ── 4. Reconstruct path ──────────────────────────────────────────────────
    chain_ids: list[UUID] = []
    edge_meta: list[tuple[str, str | None]] = []
    cur: UUID | None = to_id
    while cur is not None:
        chain_ids.append(cur)
        p, conn_type, desc = parent[cur]
        if p is not None:
            edge_meta.append((conn_type, desc))
        cur = p
    chain_ids.reverse()
    edge_meta.reverse()

    # ── 5. Fetch event details for each node in the chain ────────────────────
    ev_stmt = select(
        Event.id, Event.slug, Event.title, Event.year_approx, Event.event_category, Event.geo_modern,
    ).where(Event.id.in_([uid for uid in chain_ids]))
    ev_rows = (await db.execute(ev_stmt)).fetchall()
    ev_map = {row.id: row for row in ev_rows}

    path_events: list[PathEvent] = []
    for uid in chain_ids:
        row = ev_map.get(uid)
        if row:
            path_events.append(PathEvent(
                id=str(row.id), slug=row.slug, title=row.title,
                year_approx=row.year_approx, category=row.event_category,
                geo_modern=row.geo_modern,
            ))

    edges: list[PathStep] = []
    for i, (conn_type, desc) in enumerate(edge_meta):
        if i < len(path_events) - 1:
            edges.append(PathStep(
                from_event=path_events[i],
                to_event=path_events[i + 1],
                connection_type=conn_type,
                description=desc,
            ))

    years = [e.year_approx for e in path_events if e.year_approx is not None]
    years_spanned = (max(years) - min(years)) if len(years) >= 2 else 0

    return PathFoundResponse(
        steps=len(edges),
        path=path_events,
        edges=edges,
        years_spanned=abs(years_spanned),
        regions=_unique_regions(path_events),
    ).model_dump()


def _unique_regions(events: list[PathEvent]) -> list[str]:
    """Extract unique non-None regions preserving order."""
    seen: set[str] = set()
    result: list[str] = []
    for ev in events:
        if ev.geo_modern and ev.geo_modern not in seen:
            seen.add(ev.geo_modern)
            result.append(ev.geo_modern)
    return result
