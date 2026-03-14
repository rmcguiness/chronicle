"""
Stats router — rich analytics from the Chronicle knowledge graph.

GET /api/stats/full
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import CausalityLink, Event, EventPerson, Person

router = APIRouter(prefix="/api/stats", tags=["stats"])


# ── Response schemas ──────────────────────────────────────────────────────────


class EventRecord(BaseModel):
    """Minimal event reference used in stats responses."""
    slug: str
    title: str
    year_approx: Optional[int] = None
    value: float  # degree, importance, etc.


class PersonRecord(BaseModel):
    """Minimal person reference used in stats responses."""
    name: str
    value: int  # event count or lifespan


class CountItem(BaseModel):
    """Generic label→count pair."""
    label: str
    count: int


class GraphMetrics(BaseModel):
    """Network-level stats."""
    total_events: int
    total_links: int
    total_people: int
    avg_links_per_event: float
    network_density: float
    most_connected_event: Optional[EventRecord] = None
    longest_chain: int
    most_isolated_era: Optional[str] = None
    top_connected_events: List[EventRecord] = []


class CoverageStats(BaseModel):
    """Distribution breakdowns."""
    by_era: List[CountItem] = []
    by_region: List[CountItem] = []
    by_category: List[CountItem] = []
    most_represented_decade: Optional[str] = None
    most_represented_decade_count: int = 0
    most_represented_century: Optional[str] = None
    year_with_most_events: Optional[int] = None
    year_with_most_events_count: int = 0
    decade_heatmap: List[CountItem] = []
    largest_gap_years: int = 0


class PeopleStats(BaseModel):
    """People analytics."""
    most_connected_person: Optional[PersonRecord] = None
    longest_lifespan_person: Optional[PersonRecord] = None
    era_with_most_people: Optional[str] = None


class CuriosityStats(BaseModel):
    """Fun facts / curiosities."""
    earliest_year: Optional[int] = None
    earliest_event_title: Optional[str] = None
    latest_year: Optional[int] = None
    latest_event_title: Optional[str] = None
    total_years_covered: int = 0
    avg_importance: float = 0.0
    major_event_pct: float = 0.0
    highest_importance_event: Optional[EventRecord] = None


class FullStatsResponse(BaseModel):
    """Complete stats payload for GET /api/stats/full."""
    graph: GraphMetrics
    coverage: CoverageStats
    people: PeopleStats
    curiosity: CuriosityStats


# ── Era classification helper ─────────────────────────────────────────────────

def _classify_era(year: Optional[int]) -> str:
    """Classify a year_approx into a broad historical era."""
    if year is None:
        return "Unknown"
    if year < -3000:
        return "Prehistory"
    if year < -500:
        return "Ancient"
    if year < 500:
        return "Classical"
    if year < 1500:
        return "Medieval"
    if year < 1800:
        return "Early Modern"
    if year < 1900:
        return "19th Century"
    if year < 2000:
        return "20th Century"
    return "21st Century"


def _decade_label(year: int) -> str:
    """Return the decade label for a year, e.g. '1920s'."""
    if year < 0:
        decade = (year // 10) * 10
        return f"{abs(decade)}s BCE"
    decade = (year // 10) * 10
    return f"{decade}s"


def _century_label(year: int) -> str:
    """Return the century label for a year."""
    if year <= 0:
        century = (-year // 100) + 1
        return f"{century}th century BCE"
    century = ((year - 1) // 100) + 1
    suffixes = {1: "st", 2: "nd", 3: "rd"}
    suffix = suffixes.get(century % 10, "th")
    if 11 <= century % 100 <= 13:
        suffix = "th"
    return f"{century}{suffix} century"


# ── Endpoint ──────────────────────────────────────────────────────────────────


@router.get("/full", response_model=FullStatsResponse)
async def get_full_stats(db: AsyncSession = Depends(get_db)) -> FullStatsResponse:
    """Compute rich statistics from the Chronicle knowledge graph."""

    approved = Event.review_status == "approved"

    # ── Counts ────────────────────────────────────────────────────────────────
    total_events_q = await db.execute(
        select(func.count()).select_from(Event).where(approved)
    )
    total_events: int = total_events_q.scalar() or 0

    total_links_q = await db.execute(
        select(func.count()).select_from(CausalityLink)
    )
    total_links: int = total_links_q.scalar() or 0

    total_people_q = await db.execute(
        select(func.count()).select_from(Person)
    )
    total_people: int = total_people_q.scalar() or 0

    avg_links = (total_links * 2 / total_events) if total_events > 0 else 0.0
    density = (
        total_links / (total_events * (total_events - 1))
        if total_events > 1
        else 0.0
    )

    # ── Most connected events (top 10) ────────────────────────────────────────
    degree_q = text("""
        SELECT e.slug, e.title, e.year_approx, COUNT(*) as degree
        FROM causality_links cl
        JOIN events e ON (e.id = cl.cause_event_id OR e.id = cl.effect_event_id)
        WHERE e.review_status = 'approved'
        GROUP BY e.id, e.slug, e.title, e.year_approx
        ORDER BY degree DESC
        LIMIT 10
    """)
    degree_result = await db.execute(degree_q)
    top_connected = [
        EventRecord(slug=r.slug, title=r.title, year_approx=r.year_approx, value=float(r.degree))
        for r in degree_result
    ]
    most_connected_event = top_connected[0] if top_connected else None

    # ── Longest causal chain (recursive CTE) ──────────────────────────────────
    chain_q = text("""
        WITH RECURSIVE chain AS (
            SELECT cl.effect_event_id AS current_id, 1 AS depth
            FROM causality_links cl
            WHERE cl.cause_event_id NOT IN (
                SELECT effect_event_id FROM causality_links
            )
            UNION ALL
            SELECT cl2.effect_event_id, chain.depth + 1
            FROM chain
            JOIN causality_links cl2 ON cl2.cause_event_id = chain.current_id
            WHERE chain.depth < 100
        )
        SELECT COALESCE(MAX(depth), 0) AS max_depth FROM chain
    """)
    chain_result = await db.execute(chain_q)
    longest_chain: int = chain_result.scalar() or 0

    # ── All approved events for coverage analysis ─────────────────────────────
    all_events_q = await db.execute(
        select(
            Event.year_approx,
            Event.geo_modern,
            Event.event_category,
            Event.importance_score,
            Event.slug,
            Event.title,
        ).where(approved)
    )
    all_events = all_events_q.all()

    # ── Era breakdown & most isolated era ─────────────────────────────────────
    era_counts: Dict[str, int] = {}
    region_counts: Dict[str, int] = {}
    category_counts: Dict[str, int] = {}
    decade_counts: Dict[str, int] = {}
    century_counts: Dict[str, int] = {}
    year_counts: Dict[int, int] = {}

    for row in all_events:
        era = _classify_era(row.year_approx)
        era_counts[era] = era_counts.get(era, 0) + 1

        region = row.geo_modern or "Unknown"
        # Simplify region to country/area
        region_simple = region.split(",")[-1].strip() if "," in region else region
        region_counts[region_simple] = region_counts.get(region_simple, 0) + 1

        cat = row.event_category or "Unknown"
        category_counts[cat] = category_counts.get(cat, 0) + 1

        if row.year_approx is not None:
            dl = _decade_label(row.year_approx)
            decade_counts[dl] = decade_counts.get(dl, 0) + 1

            cl = _century_label(row.year_approx)
            century_counts[cl] = century_counts.get(cl, 0) + 1

            year_counts[row.year_approx] = year_counts.get(row.year_approx, 0) + 1

    by_era = sorted(
        [CountItem(label=k, count=v) for k, v in era_counts.items()],
        key=lambda x: x.count,
        reverse=True,
    )
    by_region = sorted(
        [CountItem(label=k, count=v) for k, v in region_counts.items()],
        key=lambda x: x.count,
        reverse=True,
    )[:20]  # top 20 regions
    by_category = sorted(
        [CountItem(label=k, count=v) for k, v in category_counts.items()],
        key=lambda x: x.count,
        reverse=True,
    )

    # Most represented decade/century
    top_decade = max(decade_counts.items(), key=lambda x: x[1]) if decade_counts else (None, 0)
    top_century = max(century_counts.items(), key=lambda x: x[1]) if century_counts else (None, 0)
    top_year = max(year_counts.items(), key=lambda x: x[1]) if year_counts else (None, 0)

    # Decade heatmap — sorted chronologically
    def _decade_sort_key(label: str) -> int:
        """Extract numeric decade for sorting."""
        if "BCE" in label:
            return -int(label.replace("s BCE", ""))
        return int(label.replace("s", ""))

    decade_heatmap = sorted(
        [CountItem(label=k, count=v) for k, v in decade_counts.items()],
        key=lambda x: _decade_sort_key(x.label),
    )

    # Largest year gap
    sorted_years = sorted(set(y for y in (r.year_approx for r in all_events) if y is not None))
    largest_gap = 0
    if len(sorted_years) > 1:
        for i in range(1, len(sorted_years)):
            gap = sorted_years[i] - sorted_years[i - 1]
            if gap > largest_gap:
                largest_gap = gap

    # Most isolated era = era with lowest average links per event
    # Count links per era
    era_link_counts: Dict[str, int] = {}
    era_event_ids: Dict[str, int] = {}
    for row in all_events:
        era = _classify_era(row.year_approx)
        era_event_ids[era] = era_event_ids.get(era, 0) + 1

    # We already have era_counts, and avg links per era requires link data
    # Approximate: era with fewest links proportional to events
    link_era_q = text("""
        SELECT e.year_approx, COUNT(*) as cnt
        FROM causality_links cl
        JOIN events e ON (e.id = cl.cause_event_id OR e.id = cl.effect_event_id)
        WHERE e.review_status = 'approved'
        GROUP BY e.year_approx
    """)
    link_era_result = await db.execute(link_era_q)
    era_links: Dict[str, int] = {}
    for r in link_era_result:
        era = _classify_era(r.year_approx)
        era_links[era] = era_links.get(era, 0) + r.cnt

    most_isolated_era = None
    min_avg = float("inf")
    for era, count in era_counts.items():
        if count < 3:
            continue  # skip eras with very few events
        avg = era_links.get(era, 0) / count
        if avg < min_avg:
            min_avg = avg
            most_isolated_era = era

    # ── People stats ──────────────────────────────────────────────────────────
    # Most connected person
    person_q = text("""
        SELECT p.name, COUNT(DISTINCT ep.event_id) as event_count
        FROM people p
        JOIN event_people ep ON ep.person_id = p.id
        GROUP BY p.id, p.name
        ORDER BY event_count DESC
        LIMIT 1
    """)
    person_result = await db.execute(person_q)
    person_row = person_result.first()
    most_connected_person = (
        PersonRecord(name=person_row.name, value=person_row.event_count)
        if person_row
        else None
    )

    # Person with longest lifespan
    lifespan_q = text("""
        SELECT name, (death_year - birth_year) AS lifespan
        FROM people
        WHERE birth_year IS NOT NULL AND death_year IS NOT NULL
        ORDER BY lifespan DESC
        LIMIT 1
    """)
    lifespan_result = await db.execute(lifespan_q)
    lifespan_row = lifespan_result.first()
    longest_lifespan_person = (
        PersonRecord(name=lifespan_row.name, value=lifespan_row.lifespan)
        if lifespan_row
        else None
    )

    # Era with most people
    people_era_q = text("""
        SELECT birth_year FROM people WHERE birth_year IS NOT NULL
    """)
    people_era_result = await db.execute(people_era_q)
    people_era_counts: Dict[str, int] = {}
    for r in people_era_result:
        era = _classify_era(r.birth_year)
        people_era_counts[era] = people_era_counts.get(era, 0) + 1
    era_with_most_people = (
        max(people_era_counts.items(), key=lambda x: x[1])[0]
        if people_era_counts
        else None
    )

    # ── Curiosity stats ───────────────────────────────────────────────────────
    years_with_events = [
        r for r in all_events if r.year_approx is not None
    ]

    earliest = min(years_with_events, key=lambda r: r.year_approx) if years_with_events else None
    latest = max(years_with_events, key=lambda r: r.year_approx) if years_with_events else None

    importance_scores = [r.importance_score for r in all_events if r.importance_score is not None]
    avg_importance = sum(importance_scores) / len(importance_scores) if importance_scores else 0.0
    major_pct = (
        sum(1 for s in importance_scores if s > 0.8) / len(importance_scores) * 100
        if importance_scores
        else 0.0
    )

    # Highest importance event
    highest_imp_q = await db.execute(
        select(Event.slug, Event.title, Event.year_approx, Event.importance_score)
        .where(approved)
        .order_by(Event.importance_score.desc())
        .limit(1)
    )
    highest_imp_row = highest_imp_q.first()
    highest_importance_event = (
        EventRecord(
            slug=highest_imp_row.slug,
            title=highest_imp_row.title,
            year_approx=highest_imp_row.year_approx,
            value=float(highest_imp_row.importance_score),
        )
        if highest_imp_row
        else None
    )

    return FullStatsResponse(
        graph=GraphMetrics(
            total_events=total_events,
            total_links=total_links,
            total_people=total_people,
            avg_links_per_event=round(avg_links, 2),
            network_density=round(density * 100, 4),  # as percentage
            most_connected_event=most_connected_event,
            longest_chain=longest_chain,
            most_isolated_era=most_isolated_era,
            top_connected_events=top_connected,
        ),
        coverage=CoverageStats(
            by_era=by_era,
            by_region=by_region,
            by_category=by_category,
            most_represented_decade=top_decade[0],
            most_represented_decade_count=top_decade[1],
            most_represented_century=top_century[0],
            year_with_most_events=top_year[0],
            year_with_most_events_count=top_year[1],
            decade_heatmap=decade_heatmap,
            largest_gap_years=largest_gap,
        ),
        people=PeopleStats(
            most_connected_person=most_connected_person,
            longest_lifespan_person=longest_lifespan_person,
            era_with_most_people=era_with_most_people,
        ),
        curiosity=CuriosityStats(
            earliest_year=earliest.year_approx if earliest else None,
            earliest_event_title=earliest.title if earliest else None,
            latest_year=latest.year_approx if latest else None,
            latest_event_title=latest.title if latest else None,
            total_years_covered=(
                (latest.year_approx - earliest.year_approx)
                if earliest and latest and earliest.year_approx is not None and latest.year_approx is not None
                else 0
            ),
            avg_importance=round(avg_importance, 3),
            major_event_pct=round(major_pct, 1),
            highest_importance_event=highest_importance_event,
        ),
    )
