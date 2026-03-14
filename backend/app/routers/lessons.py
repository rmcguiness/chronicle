"""
GET /api/lessons         — list all lessons
GET /api/lessons/{id}    — lesson detail with events expanded
"""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, Lesson, Perspective

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


# ── Response schemas ─────────────────────────────────────────────────────────

class LessonListItem(BaseModel):
    id: UUID
    title: str
    subject: str
    grade_level: str
    event_count: int
    created_at: str


class LessonEventItem(BaseModel):
    slug: str
    title: str
    year_approx: int | None = None
    is_bce: bool = False
    date_display: str | None = None
    category: str | None = None
    geo_modern: str | None = None
    importance_score: float = 0.5
    summary: str | None = None


class LessonDetail(BaseModel):
    id: UUID
    title: str
    subject: str
    grade_level: str
    learning_objectives: list[str]
    guiding_questions: list[str]
    events: list[LessonEventItem]
    created_at: str


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.get("", response_model=list[LessonListItem])
async def list_lessons(db: AsyncSession = Depends(get_db)) -> list[LessonListItem]:
    """List all available lessons."""
    stmt = select(Lesson).order_by(Lesson.created_at.desc())
    result = await db.execute(stmt)
    lessons = result.scalars().all()

    return [
        LessonListItem(
            id=lesson.id,
            title=lesson.title,
            subject=lesson.subject,
            grade_level=lesson.grade_level,
            event_count=len(lesson.event_slugs),
            created_at=lesson.created_at.isoformat(),
        )
        for lesson in lessons
    ]


@router.get("/{lesson_id}", response_model=LessonDetail)
async def get_lesson(lesson_id: UUID, db: AsyncSession = Depends(get_db)) -> LessonDetail:
    """Get lesson detail with expanded event data."""
    stmt = select(Lesson).where(Lesson.id == lesson_id)
    result = await db.execute(stmt)
    lesson = result.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    # Fetch events by slug, preserving lesson order
    events_out: list[LessonEventItem] = []
    if lesson.event_slugs:
        ev_stmt = select(
            Event.slug,
            Event.title,
            Event.year_approx,
            Event.is_bce,
            Event.date_exact,
            Event.event_category,
            Event.geo_modern,
            Event.importance_score,
        ).where(Event.slug.in_(lesson.event_slugs))
        ev_result = await db.execute(ev_stmt)
        slug_to_event = {row.slug: row for row in ev_result.fetchall()}

        for slug in lesson.event_slugs:
            ev = slug_to_event.get(slug)
            if not ev:
                events_out.append(LessonEventItem(slug=slug, title=slug.replace("-", " ").title()))
                continue

            # Get first perspective summary
            persp_stmt = (
                select(Perspective.summary)
                .join(Event, Perspective.event_id == Event.id)
                .where(Event.slug == slug)
                .order_by(Perspective.evidence_score.desc().nulls_last())
                .limit(1)
            )
            persp_result = await db.execute(persp_stmt)
            persp_row = persp_result.fetchone()
            summary = persp_row.summary if persp_row else None

            events_out.append(
                LessonEventItem(
                    slug=ev.slug,
                    title=ev.title,
                    year_approx=ev.year_approx,
                    is_bce=ev.is_bce,
                    date_display=ev.date_exact,
                    category=ev.event_category,
                    geo_modern=ev.geo_modern,
                    importance_score=ev.importance_score,
                    summary=summary,
                )
            )

    return LessonDetail(
        id=lesson.id,
        title=lesson.title,
        subject=lesson.subject,
        grade_level=lesson.grade_level,
        learning_objectives=list(lesson.learning_objectives),
        guiding_questions=list(lesson.guiding_questions),
        events=events_out,
        created_at=lesson.created_at.isoformat(),
    )
