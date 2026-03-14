"""
GET /api/themes — browse history by thematic lens.

Each theme defines a filter (event_category + title ILIKE patterns) to group
events into cross-cutting themes like "Wars & Conflicts", "Empires & Dynasties",
etc.  Returns theme metadata, event counts, and top events by importance.
"""
from __future__ import annotations

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/themes", tags=["themes"])


# ── Theme definitions ────────────────────────────────────────────────────────

class _ThemeDef:
    """Internal theme definition with SQL filter builder."""

    def __init__(
        self,
        id: str,
        name: str,
        description: str,
        emoji: str,
        color: str,
        categories: list[str] | None,
        title_patterns: list[str] | None,
    ) -> None:
        self.id = id
        self.name = name
        self.description = description
        self.emoji = emoji
        self.color = color
        self.categories = categories or []
        self.title_patterns = title_patterns or []

    def build_filter(self) -> Any:
        """Build SQLAlchemy OR filter for this theme."""
        clauses = []
        if self.categories:
            clauses.append(Event.event_category.in_(self.categories))
        for pat in self.title_patterns:
            clauses.append(Event.title.ilike(f"%{pat}%"))
        return or_(*clauses)


THEMES: list[_ThemeDef] = [
    _ThemeDef(
        "wars-conflicts", "Wars & Conflicts",
        "Major wars, battles, and military campaigns that shaped borders and nations.",
        "⚔️", "#dc2626",
        ["military", "war"],
        ["war", "battle", "conquest"],
    ),
    _ThemeDef(
        "revolutions", "Revolutions & Uprisings",
        "Popular revolts and independence movements that toppled old orders.",
        "✊", "#ea580c",
        None,
        ["revolution", "revolt", "uprising", "independence"],
    ),
    _ThemeDef(
        "science", "Scientific Discoveries",
        "Breakthroughs in science that transformed our understanding of the world.",
        "🔬", "#2563eb",
        ["scientific"],
        ["discovered", "invention", "theory"],
    ),
    _ThemeDef(
        "empires", "Empires & Dynasties",
        "Great empires and ruling dynasties that dominated vast territories.",
        "👑", "#7c3aed",
        None,
        ["empire", "dynasty", "kingdom"],
    ),
    _ThemeDef(
        "religion", "Religion & Philosophy",
        "Spiritual movements and philosophical traditions that shaped civilizations.",
        "🕌", "#0d9488",
        ["religious"],
        ["church", "islam", "christianity", "buddhism"],
    ),
    _ThemeDef(
        "trade", "Trade & Economy",
        "Commerce, trade routes, and economic systems that connected the world.",
        "🏪", "#ca8a04",
        ["economic"],
        ["trade", "silk road", "economic", "merchant"],
    ),
    _ThemeDef(
        "art-culture", "Art & Culture",
        "Artistic achievements and cultural movements that defined eras.",
        "🎨", "#db2777",
        ["cultural"],
        ["renaissance", "art"],
    ),
    _ThemeDef(
        "exploration", "Exploration & Discovery",
        "Voyages of exploration and colonial expansion across the globe.",
        "🧭", "#059669",
        ["discovery"],
        ["explor", "voyage", "expedition", "coloniz"],
    ),
    _ThemeDef(
        "plagues", "Plagues & Disasters",
        "Pandemics, famines, and natural catastrophes that devastated populations.",
        "☠️", "#991b1b",
        ["disaster", "natural"],
        ["plague", "pandemic", "famine", "earthquake", "disaster"],
    ),
    _ThemeDef(
        "technology", "Technology & Innovation",
        "Inventions and technological leaps that accelerated human progress.",
        "⚙️", "#4f46e5",
        None,
        ["printing", "railroad", "telegraph", "industrial"],
    ),
    _ThemeDef(
        "political", "Political Systems",
        "The evolution of governance from monarchies to democracies.",
        "🏛️", "#0369a1",
        ["political"],
        ["democracy", "republic", "constitution", "parliament"],
    ),
    _ThemeDef(
        "people", "People & Leaders",
        "Influential rulers, leaders, and figures who left their mark on history.",
        "👤", "#78716c",
        ["person"],
        ["emperor", "king", "president", "leader"],
    ),
]


# ── Response schemas ─────────────────────────────────────────────────────────

class TopEventItem(BaseModel):
    """Minimal event info for theme preview."""
    id: UUID
    slug: str
    title: str
    year_approx: int | None
    importance_score: float
    region: str | None

class ThemeOut(BaseModel):
    """Single theme with metadata and top events."""
    id: str
    name: str
    description: str
    emoji: str
    color: str
    event_count: int
    top_events: list[TopEventItem]

class ThemeEventsOut(BaseModel):
    """Full event list for one theme."""
    id: str
    name: str
    event_count: int
    events: list[TopEventItem]


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("", response_model=list[ThemeOut])
async def list_themes(db: AsyncSession = Depends(get_db)) -> list[ThemeOut]:
    """Return all themes with event counts and top-5 events."""
    approved = Event.review_status == "approved"
    results: list[ThemeOut] = []

    for theme in THEMES:
        filt = theme.build_filter()

        # Count
        count_q = select(func.count()).select_from(Event).where(approved, filt)
        count_result = await db.execute(count_q)
        event_count = count_result.scalar() or 0

        # Top 5 by importance
        top_q = (
            select(
                Event.id,
                Event.slug,
                Event.title,
                Event.year_approx,
                Event.importance_score,
                Event.geo_modern,
            )
            .where(approved, filt)
            .order_by(Event.importance_score.desc())
            .limit(5)
        )
        top_result = await db.execute(top_q)
        top_events = [
            TopEventItem(
                id=row.id,
                slug=row.slug,
                title=row.title,
                year_approx=row.year_approx,
                importance_score=row.importance_score,
                region=row.geo_modern,
            )
            for row in top_result
        ]

        results.append(ThemeOut(
            id=theme.id,
            name=theme.name,
            description=theme.description,
            emoji=theme.emoji,
            color=theme.color,
            event_count=event_count,
            top_events=top_events,
        ))

    return results


@router.get("/{theme_id}/events", response_model=ThemeEventsOut)
async def get_theme_events(
    theme_id: str,
    db: AsyncSession = Depends(get_db),
) -> ThemeEventsOut:
    """Return all approved events for a specific theme, sorted by importance."""
    theme = next((t for t in THEMES if t.id == theme_id), None)
    if theme is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Theme '{theme_id}' not found")

    approved = Event.review_status == "approved"
    filt = theme.build_filter()

    q = (
        select(
            Event.id,
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.importance_score,
            Event.geo_modern,
        )
        .where(approved, filt)
        .order_by(Event.importance_score.desc())
    )
    result = await db.execute(q)
    events = [
        TopEventItem(
            id=row.id,
            slug=row.slug,
            title=row.title,
            year_approx=row.year_approx,
            importance_score=row.importance_score,
            region=row.geo_modern,
        )
        for row in result
    ]

    return ThemeEventsOut(
        id=theme.id,
        name=theme.name,
        event_count=len(events),
        events=events,
    )
