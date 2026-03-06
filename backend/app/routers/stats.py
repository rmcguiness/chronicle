"""
GET /api/stats — aggregate timeline statistics.

Returns event counts, time span, era/category breakdowns,
most-connected event, total causal links, and Wikipedia coverage.
Cached for 5 minutes to avoid repeated heavy queries.
"""
from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import case, func, literal_column, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, WikipediaCache

router = APIRouter(prefix="/api/stats", tags=["stats"])

# ── Era range constants ──────────────────────────────────────────────────────
ERA_ANCIENT_START = -3000
ERA_ANCIENT_END = 500
ERA_MEDIEVAL_START = 500
ERA_MEDIEVAL_END = 1500
ERA_EARLY_MODERN_START = 1500
ERA_EARLY_MODERN_END = 1800
ERA_MODERN_START = 1800
ERA_MODERN_END = 2000
ERA_CONTEMPORARY_START = 2000

# ── Simple TTL cache ─────────────────────────────────────────────────────────
CACHE_TTL_SECONDS = 300  # 5 minutes

_cache: dict[str, Any] = {}
_cache_ts: float = 0.0


@router.get("", response_model=dict)
async def get_stats(db: AsyncSession = Depends(get_db)) -> dict:
    """
    GET /api/stats

    Returns aggregate statistics for the entire event dataset:
    - totalEvents: count of all approved events
    - timeSpan: { earliest, latest, label } (e.g. "3000 BCE - 2024 CE")
    - byEra: list of { era, count } for five historical eras
    - byCategory: top 5 event categories with count
    - mostConnected: { title, slug, connectionCount } for the most-connected event
    - totalLinks: count of approved causality links
    - coveragePct: percentage of events with a cached Wikipedia article
    """
    global _cache, _cache_ts

    now = time.monotonic()
    if _cache and (now - _cache_ts) < CACHE_TTL_SECONDS:
        return _cache

    approved = Event.review_status == "approved"

    # 1. Total events
    total_q = select(func.count()).select_from(Event).where(approved)
    total_events: int = (await db.execute(total_q)).scalar() or 0

    # 2. Time span (earliest and latest year_approx)
    span_q = select(
        func.min(Event.year_approx).label("earliest"),
        func.max(Event.year_approx).label("latest"),
    ).where(approved)
    span_row = (await db.execute(span_q)).one()
    earliest: int | None = span_row.earliest
    latest: int | None = span_row.latest

    def _year_label(y: int | None) -> str:
        if y is None:
            return "?"
        if y < 0:
            return f"{abs(y)} BCE"
        return f"{y} CE"

    time_span = {
        "earliest": earliest,
        "latest": latest,
        "label": f"{_year_label(earliest)} — {_year_label(latest)}" if earliest is not None else "No data",
    }

    # 3. Events by era
    era_case = case(
        (Event.year_approx < ERA_ANCIENT_END, "Ancient"),
        (Event.year_approx < ERA_MEDIEVAL_END, "Medieval"),
        (Event.year_approx < ERA_EARLY_MODERN_END, "Early Modern"),
        (Event.year_approx < ERA_MODERN_END, "Modern"),
        else_="Contemporary",
    )
    era_q = (
        select(era_case.label("era"), func.count().label("count"))
        .where(approved)
        .where(Event.year_approx.is_not(None))
        .group_by(literal_column("era"))
        .order_by(func.count().desc())
    )
    era_rows = (await db.execute(era_q)).fetchall()
    by_era = [{"era": r.era, "count": r.count} for r in era_rows]

    # 4. Events by category (top 5)
    cat_q = (
        select(Event.event_category.label("category"), func.count().label("count"))
        .where(approved)
        .where(Event.event_category.is_not(None))
        .group_by(Event.event_category)
        .order_by(func.count().desc())
        .limit(5)
    )
    cat_rows = (await db.execute(cat_q)).fetchall()
    by_category = [{"category": r.category, "count": r.count} for r in cat_rows]

    # 5. Most connected event (node with most causality edges)
    cause_count = (
        select(
            CausalityLink.cause_event_id.label("event_id"),
            func.count().label("cnt"),
        )
        .where(CausalityLink.review_status == "approved")
        .group_by(CausalityLink.cause_event_id)
    )
    effect_count = (
        select(
            CausalityLink.effect_event_id.label("event_id"),
            func.count().label("cnt"),
        )
        .where(CausalityLink.review_status == "approved")
        .group_by(CausalityLink.effect_event_id)
    )
    union_q = cause_count.union_all(effect_count).subquery()
    agg_q = (
        select(
            union_q.c.event_id,
            func.sum(union_q.c.cnt).label("total"),
        )
        .group_by(union_q.c.event_id)
        .order_by(func.sum(union_q.c.cnt).desc())
        .limit(1)
    )
    top_row = (await db.execute(agg_q)).first()

    most_connected: dict[str, object] | None = None
    if top_row:
        ev_q = select(Event.title, Event.slug).where(Event.id == top_row.event_id)
        ev = (await db.execute(ev_q)).first()
        if ev:
            most_connected = {
                "title": ev.title,
                "slug": ev.slug,
                "connectionCount": int(top_row.total),
            }

    # 6. Total causal links
    links_q = select(func.count()).select_from(CausalityLink).where(
        CausalityLink.review_status == "approved"
    )
    total_links: int = (await db.execute(links_q)).scalar() or 0

    # 7. Data coverage % (events with wikipedia_cache entry vs total)
    cached_q = (
        select(func.count(func.distinct(WikipediaCache.slug)))
        .select_from(WikipediaCache)
        .join(Event, Event.wikipedia_slug == WikipediaCache.slug)
        .where(approved)
    )
    cached_count: int = (await db.execute(cached_q)).scalar() or 0
    coverage_pct = round((cached_count / total_events * 100), 1) if total_events > 0 else 0.0

    result = {
        "totalEvents": total_events,
        "timeSpan": time_span,
        "byEra": by_era,
        "byCategory": by_category,
        "mostConnected": most_connected,
        "totalLinks": total_links,
        "coveragePct": coverage_pct,
    }

    _cache = result
    _cache_ts = now

    return result
