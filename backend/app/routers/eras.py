"""
Era pages — GET /api/era/:era and GET /api/era

Returns comprehensive data for a historical era: metadata, stats,
top events, key figures, regional/category/decade breakdowns, and
neighboring eras.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Float, and_, case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson, Person

router = APIRouter(prefix="/api/era", tags=["eras"])

# ── Era definitions ──────────────────────────────────────────────────────────

ERA_SLUGS = ["ancient", "classical", "medieval", "early-modern", "modern", "contemporary"]

ERA_META: dict[str, dict] = {
    "ancient": {
        "name": "The Ancient Era",
        "slug": "ancient",
        "year_min": -5000,
        "year_max": -501,
        "description": (
            "The Ancient Era spans the earliest civilizations — from the first city-states "
            "of Mesopotamia and the Nile Valley through the rise of empires in Persia, China, "
            "and the Indus. Writing, agriculture, monumental architecture, and the foundational "
            "legal and religious texts that still shape the world today all emerged in this period."
        ),
    },
    "classical": {
        "name": "The Classical Era",
        "slug": "classical",
        "year_min": -500,
        "year_max": 500,
        "description": (
            "The Classical Era witnessed the golden ages of Greece and Rome, the unification "
            "of China under the Qin and Han dynasties, and the rise of the Maurya and Gupta "
            "empires in South Asia. Philosophy, democracy, vast road networks, and world "
            "religions including Christianity and Buddhism spread across continents."
        ),
    },
    "medieval": {
        "name": "The Medieval Era",
        "slug": "medieval",
        "year_min": 501,
        "year_max": 1400,
        "description": (
            "The Medieval Era saw the fragmentation and eventual resurgence of political power "
            "across Eurasia. The Islamic Golden Age, the Byzantine Empire, the Crusades, the "
            "Mongol conquests, and the feudal systems of Europe defined a millennium of cultural "
            "exchange, religious conflict, and gradual technological advancement."
        ),
    },
    "early-modern": {
        "name": "The Early Modern Era",
        "slug": "early-modern",
        "year_min": 1401,
        "year_max": 1800,
        "description": (
            "The Early Modern Era encompasses the Renaissance, the Age of Exploration, the "
            "Reformation, the Scientific Revolution, and the Enlightenment. European empires "
            "expanded across the globe, reshaping economies and societies while indigenous "
            "civilizations faced colonization and upheaval."
        ),
    },
    "modern": {
        "name": "The Modern Era",
        "slug": "modern",
        "year_min": 1801,
        "year_max": 1945,
        "description": (
            "The Modern Era was defined by industrialization, nationalism, and two devastating "
            "world wars. Rapid technological progress, mass movements for democracy and civil "
            "rights, the abolition of slavery, and the rise and fall of colonial empires "
            "transformed every corner of the globe."
        ),
    },
    "contemporary": {
        "name": "The Contemporary Era",
        "slug": "contemporary",
        "year_min": 1946,
        "year_max": 2100,
        "description": (
            "The Contemporary Era spans the Cold War, decolonization, the digital revolution, "
            "and globalization. Nuclear deterrence, space exploration, the internet, and "
            "climate change have reshaped geopolitics and daily life in ways still unfolding."
        ),
    },
}


def _year_filter(meta: dict):
    """Return a SQLAlchemy WHERE clause for approved events in this era."""
    return and_(
        Event.review_status == "approved",
        Event.year_approx >= meta["year_min"],
        Event.year_approx <= meta["year_max"],
    )


def _neighbor(slug: str, direction: int) -> str | None:
    """Return the slug of the neighboring era, or None if at boundary."""
    idx = ERA_SLUGS.index(slug)
    n = idx + direction
    if 0 <= n < len(ERA_SLUGS):
        return ERA_SLUGS[n]
    return None


@router.get("/{era}")
async def get_era(era: str, db: AsyncSession = Depends(get_db)):
    """Return full era page data for a given era slug."""
    meta = ERA_META.get(era)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Unknown era: {era}")

    year_cond = _year_filter(meta)

    # ── Stats ────────────────────────────────────────────────────────────────
    stats_stmt = select(
        func.count(Event.id).label("total_events"),
        func.coalesce(func.avg(Event.importance_score), 0).label("avg_importance"),
    ).where(year_cond)
    stats_row = (await db.execute(stats_stmt)).one()
    total_events: int = stats_row.total_events
    avg_importance: float = round(float(stats_row.avg_importance), 3)

    # People count
    people_stmt = (
        select(func.count(func.distinct(EventPerson.person_id)))
        .join(Event, Event.id == EventPerson.event_id)
        .where(year_cond)
    )
    total_people: int = (await db.execute(people_stmt)).scalar() or 0

    # Causality links count
    links_stmt = (
        select(func.count(CausalityLink.id))
        .join(Event, Event.id == CausalityLink.cause_event_id)
        .where(
            and_(
                CausalityLink.review_status == "approved",
                Event.review_status == "approved",
                Event.year_approx >= meta["year_min"],
                Event.year_approx <= meta["year_max"],
            )
        )
    )
    total_links: int = (await db.execute(links_stmt)).scalar() or 0

    # Most connected event (by total cause+effect links)
    cause_count = (
        select(
            CausalityLink.cause_event_id.label("eid"),
            func.count().label("cnt"),
        )
        .where(CausalityLink.review_status == "approved")
        .group_by(CausalityLink.cause_event_id)
        .subquery()
    )
    effect_count = (
        select(
            CausalityLink.effect_event_id.label("eid"),
            func.count().label("cnt"),
        )
        .where(CausalityLink.review_status == "approved")
        .group_by(CausalityLink.effect_event_id)
        .subquery()
    )
    mc_stmt = (
        select(
            Event.slug,
            Event.title,
            (func.coalesce(cause_count.c.cnt, 0) + func.coalesce(effect_count.c.cnt, 0)).label("link_count"),
        )
        .outerjoin(cause_count, cause_count.c.eid == Event.id)
        .outerjoin(effect_count, effect_count.c.eid == Event.id)
        .where(year_cond)
        .order_by(
            (func.coalesce(cause_count.c.cnt, 0) + func.coalesce(effect_count.c.cnt, 0)).desc(),
            Event.importance_score.desc(),
        )
        .limit(1)
    )
    mc_row = (await db.execute(mc_stmt)).first()
    most_connected = (
        {"slug": mc_row.slug, "title": mc_row.title, "link_count": mc_row.link_count}
        if mc_row
        else None
    )

    # ── Top 10 events ────────────────────────────────────────────────────────
    top_stmt = (
        select(
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.event_category,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(year_cond)
        .order_by(Event.importance_score.desc())
        .limit(10)
    )
    top_rows = (await db.execute(top_stmt)).all()
    top_events = [
        {
            "slug": r.slug,
            "title": r.title,
            "year_approx": r.year_approx,
            "category": r.event_category,
            "importance_score": round(float(r.importance_score), 3),
            "geo_modern": r.geo_modern,
        }
        for r in top_rows
    ]

    # ── Key figures ──────────────────────────────────────────────────────────
    figures_stmt = (
        select(
            Person.name,
            Person.wikipedia_slug,
            Person.birth_year,
            Person.death_year,
            Person.roles,
            Person.description,
            func.count(EventPerson.event_id).label("event_count"),
        )
        .join(EventPerson, EventPerson.person_id == Person.id)
        .join(Event, Event.id == EventPerson.event_id)
        .where(year_cond)
        .group_by(Person.id)
        .order_by(func.count(EventPerson.event_id).desc())
        .limit(8)
    )
    figures_rows = (await db.execute(figures_stmt)).all()
    key_figures = [
        {
            "name": r.name,
            "slug": r.wikipedia_slug,
            "birth_year": r.birth_year,
            "death_year": r.death_year,
            "roles": r.roles or [],
            "description": r.description,
            "event_count": r.event_count,
        }
        for r in figures_rows
    ]

    # ── Regional breakdown ───────────────────────────────────────────────────
    region_stmt = (
        select(
            Event.geo_modern,
            func.count().label("count"),
        )
        .where(year_cond)
        .where(Event.geo_modern.isnot(None))
        .group_by(Event.geo_modern)
        .order_by(func.count().desc())
    )
    region_rows = (await db.execute(region_stmt)).all()
    regions = [{"region": r.geo_modern, "count": r.count} for r in region_rows]

    # ── Category breakdown ───────────────────────────────────────────────────
    cat_stmt = (
        select(
            Event.event_category,
            func.count().label("count"),
        )
        .where(year_cond)
        .where(Event.event_category.isnot(None))
        .group_by(Event.event_category)
        .order_by(func.count().desc())
    )
    cat_rows = (await db.execute(cat_stmt)).all()
    categories = [{"category": r.event_category, "count": r.count} for r in cat_rows]

    # ── Decade breakdown ─────────────────────────────────────────────────────
    decade_simple = (func.floor(Event.year_approx.cast(Float) / 10) * 10).label("decade")
    decade_stmt = (
        select(
            decade_simple,
            func.count().label("count"),
        )
        .where(year_cond)
        .where(Event.year_approx.isnot(None))
        .group_by(decade_simple)
        .order_by(decade_simple)
    )
    decade_rows = (await db.execute(decade_stmt)).all()
    decades = [{"decade": int(r.decade), "count": r.count} for r in decade_rows]

    # ── Neighboring eras ─────────────────────────────────────────────────────
    prev_slug = _neighbor(era, -1)
    next_slug = _neighbor(era, 1)

    async def _era_summary(slug: str | None):
        if slug is None:
            return None
        m = ERA_META[slug]
        cond = _year_filter(m)
        cnt = (await db.execute(select(func.count(Event.id)).where(cond))).scalar() or 0
        return {
            "slug": slug,
            "name": m["name"],
            "year_min": m["year_min"],
            "year_max": m["year_max"],
            "event_count": cnt,
        }

    prev_era = await _era_summary(prev_slug)
    next_era = await _era_summary(next_slug)

    return {
        "meta": meta,
        "stats": {
            "total_events": total_events,
            "total_people": total_people,
            "total_links": total_links,
            "avg_importance": avg_importance,
            "most_connected_event": most_connected,
        },
        "top_events": top_events,
        "key_figures": key_figures,
        "regions": regions,
        "categories": categories,
        "decades": decades,
        "prev_era": prev_era,
        "next_era": next_era,
    }


@router.get("")
async def list_eras(db: AsyncSession = Depends(get_db)):
    """Return summary data for all eras (used by /eras directory page)."""
    eras = []
    for slug, meta in ERA_META.items():
        cond = _year_filter(meta)

        stats_stmt = select(
            func.count(Event.id).label("total_events"),
        ).where(cond)
        total = (await db.execute(stats_stmt)).scalar() or 0

        # Top event
        top_stmt = (
            select(Event.slug, Event.title, Event.year_approx, Event.importance_score)
            .where(cond)
            .order_by(Event.importance_score.desc())
            .limit(1)
        )
        top_row = (await db.execute(top_stmt)).first()
        top_event = (
            {
                "slug": top_row.slug,
                "title": top_row.title,
                "year_approx": top_row.year_approx,
                "importance_score": round(float(top_row.importance_score), 3),
            }
            if top_row
            else None
        )

        eras.append({
            "slug": slug,
            "name": meta["name"],
            "year_min": meta["year_min"],
            "year_max": meta["year_max"],
            "description": meta["description"],
            "event_count": total,
            "top_event": top_event,
        })

    return {"eras": eras}
