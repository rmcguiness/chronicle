"""
Centuries router — browse history century by century.

GET /api/centuries       → all centuries with summary stats
GET /api/centuries/{key} → all events for a single century
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select, cast, Integer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Person, EventPerson

router = APIRouter(prefix="/api/centuries", tags=["centuries"])


# ── Helpers ──────────────────────────────────────────────────────────────────

def _ordinal(n: int) -> str:
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def _century_label(num: int, is_bce: bool) -> str:
    label = f"{_ordinal(num)} Century"
    if is_bce:
        label += " BCE"
    return label


def _century_year_range(num: int, is_bce: bool) -> tuple[int, int]:
    start = (num - 1) * 100 + 1
    end = num * 100
    return (start, end)


def _parse_century_key(key: str) -> tuple[int, bool]:
    is_bce = key.startswith("-")
    raw = key.lstrip("-")
    for suffix in ("st", "nd", "rd", "th"):
        if raw.endswith(suffix):
            raw = raw[: -len(suffix)]
            break
    try:
        num = int(raw)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid century key: {key}")
    if num < 1:
        raise HTTPException(status_code=400, detail=f"Century number must be >= 1, got {num}")
    return num, is_bce


def _century_url_key(num: int, is_bce: bool) -> str:
    prefix = "-" if is_bce else ""
    return f"{prefix}{_ordinal(num)}"


# SQL expression for century number: CEIL(ABS(year_approx) / 100.0)
# year_approx is negative for BCE events, so we use ABS
_century_expr = func.ceil(func.abs(cast(Event.year_approx, Integer)) / 100.0)


# ── GET /api/centuries ───────────────────────────────────────────────────────

@router.get("")
async def list_centuries(db: AsyncSession = Depends(get_db)):
    """Return all centuries with summary stats, sorted oldest to newest."""
    stmt = (
        select(
            _century_expr.label("century_num"),
            Event.is_bce,
            func.count().label("event_count"),
        )
        .where(
            Event.review_status == "approved",
            Event.year_approx.isnot(None),
        )
        .group_by(_century_expr, Event.is_bce)
        .order_by(Event.is_bce.desc(), _century_expr.asc())
    )

    rows = (await db.execute(stmt)).all()

    centuries = []
    for row in rows:
        num = int(row.century_num)
        is_bce = row.is_bce

        # Most important event
        top_evt_stmt = (
            select(Event.title, Event.slug, Event.importance_score)
            .where(
                Event.review_status == "approved",
                Event.year_approx.isnot(None),
                Event.is_bce == is_bce,
                _century_expr == num,
            )
            .order_by(Event.importance_score.desc())
            .limit(1)
        )
        top_evt = (await db.execute(top_evt_stmt)).first()

        # Top categories
        cat_stmt = (
            select(Event.event_category, func.count().label("cnt"))
            .where(
                Event.review_status == "approved",
                Event.year_approx.isnot(None),
                Event.is_bce == is_bce,
                _century_expr == num,
                Event.event_category.isnot(None),
            )
            .group_by(Event.event_category)
            .order_by(func.count().desc())
            .limit(3)
        )
        cats = (await db.execute(cat_stmt)).all()

        yr_start, yr_end = _century_year_range(num, is_bce)

        centuries.append({
            "key": _century_url_key(num, is_bce),
            "label": _century_label(num, is_bce),
            "century_number": num,
            "is_bce": is_bce,
            "event_count": row.event_count,
            "year_range": f"{yr_start}\u2013{yr_end}" + (" BCE" if is_bce else ""),
            "year_start": yr_start,
            "year_end": yr_end,
            "top_categories": [c.event_category for c in cats],
            "most_important_event": {
                "title": top_evt.title,
                "slug": top_evt.slug,
                "importance_score": float(top_evt.importance_score),
            } if top_evt else None,
        })

    # Sort: BCE centuries descending (oldest first), then CE ascending
    centuries.sort(key=lambda c: -c["century_number"] if c["is_bce"] else c["century_number"] + 100000)

    return {"centuries": centuries}


# ── GET /api/centuries/{key} ─────────────────────────────────────────────────

@router.get("/{key}")
async def get_century(key: str, db: AsyncSession = Depends(get_db)):
    """Return detailed data for a single century."""
    num, is_bce = _parse_century_key(key)

    events_stmt = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.is_bce,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(
            Event.review_status == "approved",
            Event.year_approx.isnot(None),
            Event.is_bce == is_bce,
            _century_expr == num,
        )
        .order_by(Event.year_approx.asc())
    )
    event_rows = (await db.execute(events_stmt)).all()

    if not event_rows:
        raise HTTPException(status_code=404, detail=f"No events found for {_century_label(num, is_bce)}")

    events = []
    for e in event_rows:
        events.append({
            "id": str(e.id),
            "slug": e.slug,
            "title": e.title,
            "year_approx": abs(e.year_approx) if e.year_approx else 0,
            "is_bce": e.is_bce,
            "category": e.event_category,
            "importance_score": float(e.importance_score),
            "geo_modern": e.geo_modern,
        })

    # Decade breakdown
    decades: dict[int, list] = {}
    for e in events:
        yr = e["year_approx"]
        decade = (yr // 10) * 10
        decades.setdefault(decade, []).append(e)

    decade_breakdown = [
        {"decade": d, "decade_label": f"{d}s" + (" BCE" if is_bce else ""), "events": evts}
        for d, evts in sorted(decades.items())
    ]

    # Category distribution
    cat_dist: dict[str, int] = {}
    for e in events:
        cat = e["category"] or "unknown"
        cat_dist[cat] = cat_dist.get(cat, 0) + 1

    top_events = sorted(events, key=lambda e: e["importance_score"], reverse=True)[:5]

    # Notable people
    event_ids = [e["id"] for e in events]
    people_stmt = (
        select(
            Person.id,
            Person.name,
            Person.birth_year,
            Person.death_year,
            Person.roles,
            Person.description,
            Person.image_url,
        )
        .join(EventPerson, EventPerson.person_id == Person.id)
        .where(EventPerson.event_id.in_(event_ids))
        .distinct(Person.id)
        .limit(20)
    )
    people_rows = (await db.execute(people_stmt)).all()

    notable_people = [
        {
            "id": str(p.id),
            "name": p.name,
            "birth_year": p.birth_year,
            "death_year": p.death_year,
            "roles": p.roles or [],
            "description": p.description,
            "image_url": p.image_url,
        }
        for p in people_rows
    ]

    yr_start, yr_end = _century_year_range(num, is_bce)

    prev_key = None
    next_key = None
    if is_bce:
        next_key = _century_url_key(num - 1, True) if num > 1 else _century_url_key(1, False)
        prev_key = _century_url_key(num + 1, True)
    else:
        prev_key = _century_url_key(num - 1, False) if num > 1 else _century_url_key(1, True)
        next_key = _century_url_key(num + 1, False)

    return {
        "key": _century_url_key(num, is_bce),
        "label": _century_label(num, is_bce),
        "century_number": num,
        "is_bce": is_bce,
        "year_range": f"{yr_start}\u2013{yr_end}" + (" BCE" if is_bce else ""),
        "year_start": yr_start,
        "year_end": yr_end,
        "event_count": len(events),
        "events": events,
        "decade_breakdown": decade_breakdown,
        "category_distribution": cat_dist,
        "top_events": top_events,
        "notable_people": notable_people,
        "notable_people_count": len(notable_people),
        "prev_century": prev_key,
        "next_century": next_key,
    }
