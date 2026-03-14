"""
GET /api/quiz — generate multiple-choice history quiz from real DB events.

Query params:
  count      — number of questions (default 10, max 50)
  era        — ancient / medieval / modern / contemporary / all (default all)
  difficulty — easy / medium / hard (default medium)
"""
from __future__ import annotations

import random
import uuid
from enum import Enum
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event, EventPerson, Person

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


# ── Enums & schemas ──────────────────────────────────────────────────────────

class Era(str, Enum):
    all = "all"
    ancient = "ancient"
    medieval = "medieval"
    modern = "modern"
    contemporary = "contemporary"


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class QuizOption(BaseModel):
    label: str
    value: str


class QuizQuestion(BaseModel):
    id: str
    type: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str
    event_slug: Optional[str] = None


# ── Era year boundaries ──────────────────────────────────────────────────────

ERA_RANGES = {
    "ancient": (-5000, 500),
    "medieval": (500, 1500),
    "modern": (1500, 1900),
    "contemporary": (1900, 2100),
}

# Difficulty → year offset range for wrong-answer generation
YEAR_OFFSETS = {
    "easy": (20, 100),
    "medium": (5, 30),
    "hard": (1, 10),
}


def _era_filter(era: str):
    """Return SQLAlchemy filter clause for era, or None for 'all'."""
    if era == "all":
        return None
    lo, hi = ERA_RANGES[era]
    return Event.year_approx.between(lo, hi)


def _format_year(year: int) -> str:
    if year < 0:
        return f"{abs(year)} BCE"
    return str(year)


def _build_explanation(event) -> str:
    """Build a short 1-2 sentence explanation from event data."""
    notes = event.date_notes
    if notes and len(notes) > 10:
        sentences = notes.split(". ")
        short = ". ".join(sentences[:2])
        if not short.endswith("."):
            short += "."
        return short
    year_str = _format_year(event.year_approx) if event.year_approx else "an unknown year"
    cat = f" ({event.event_category})" if event.event_category else ""
    return f"{event.title}{cat} occurred in {year_str}."


# ── Question generators ──────────────────────────────────────────────────────

def _gen_year_question(event, all_events, difficulty: str) -> Optional[QuizQuestion]:
    """Type A: What year did [event] occur?"""
    if event.year_approx is None:
        return None

    correct = event.year_approx
    lo_off, hi_off = YEAR_OFFSETS[difficulty]

    # Generate 3 wrong years
    wrong_years = set()
    attempts = 0
    while len(wrong_years) < 3 and attempts < 50:
        offset = random.randint(lo_off, hi_off) * random.choice([-1, 1])
        candidate = correct + offset
        if candidate != correct and candidate not in wrong_years:
            wrong_years.add(candidate)
        attempts += 1

    if len(wrong_years) < 3:
        return None

    options_raw = [correct] + list(wrong_years)
    random.shuffle(options_raw)
    correct_idx = options_raw.index(correct)

    return QuizQuestion(
        id=str(uuid.uuid4()),
        type="year",
        question=f"What year did \"{event.title}\" occur?",
        options=[_format_year(y) for y in options_raw],
        correctIndex=correct_idx,
        explanation=_build_explanation(event),
        event_slug=event.slug,
    )


def _gen_category_question(event, all_events, difficulty: str) -> Optional[QuizQuestion]:
    """Type B: Which category does [event] belong to?"""
    if not event.event_category:
        return None

    correct = event.event_category
    other_cats = list({e.event_category for e in all_events if e.event_category and e.event_category != correct})
    if len(other_cats) < 3:
        return None

    wrong = random.sample(other_cats, 3)
    options = [correct] + wrong
    random.shuffle(options)
    correct_idx = options.index(correct)

    return QuizQuestion(
        id=str(uuid.uuid4()),
        type="category",
        question=f"Which category does \"{event.title}\" belong to?",
        options=[o.capitalize() for o in options],
        correctIndex=correct_idx,
        explanation=_build_explanation(event),
        event_slug=event.slug,
    )


def _gen_what_happened_question(event, all_events, difficulty: str) -> Optional[QuizQuestion]:
    """Type C: What happened in [year]?"""
    if event.year_approx is None:
        return None

    correct = event.title
    year = event.year_approx

    # Find other events from a similar era for wrong answers
    lo_off, hi_off = YEAR_OFFSETS[difficulty]
    candidates = [
        e for e in all_events
        if e.title != correct
        and e.year_approx is not None
        and abs(e.year_approx - year) <= hi_off * 3
    ]
    if len(candidates) < 3:
        # Fall back to any other events
        candidates = [e for e in all_events if e.title != correct]
    if len(candidates) < 3:
        return None

    wrong = random.sample(candidates, 3)
    options = [correct] + [w.title for w in wrong]
    random.shuffle(options)
    correct_idx = options.index(correct)

    return QuizQuestion(
        id=str(uuid.uuid4()),
        type="what_happened",
        question=f"What happened in {_format_year(year)}?",
        options=options,
        correctIndex=correct_idx,
        explanation=_build_explanation(event),
        event_slug=event.slug,
    )


def _gen_person_question(person, all_people, difficulty: str) -> Optional[QuizQuestion]:
    """Type D: Who is [person] known for?"""
    if not person.description:
        return None

    correct = person.description
    others = [p for p in all_people if p.description and p.id != person.id]
    if len(others) < 3:
        return None

    wrong = random.sample(others, 3)
    options = [correct] + [w.description for w in wrong]
    random.shuffle(options)
    correct_idx = options.index(correct)

    return QuizQuestion(
        id=str(uuid.uuid4()),
        type="person",
        question=f"What is {person.name} known for?",
        options=options,
        correctIndex=correct_idx,
        explanation=f"{person.name}: {correct}",
        event_slug=None,
    )


# ── Main endpoint ────────────────────────────────────────────────────────────

@router.get("", response_model=List[QuizQuestion])
async def generate_quiz(
    count: int = Query(10, ge=1, le=50),
    era: Era = Query(Era.all),
    difficulty: Difficulty = Query(Difficulty.medium),
    db: AsyncSession = Depends(get_db),
):
    """Generate a quiz with mixed question types from real historical events."""

    # Fetch approved events with year data
    stmt = (
        select(Event)
        .where(Event.review_status == "approved")
        .where(Event.year_approx.is_not(None))
    )
    era_clause = _era_filter(era.value)
    if era_clause is not None:
        stmt = stmt.where(era_clause)

    # Prefer higher-importance events for better questions
    if difficulty.value == "hard":
        stmt = stmt.order_by(func.random())
    else:
        stmt = stmt.order_by(Event.importance_score.desc())

    stmt = stmt.limit(200)
    result = await db.execute(stmt)
    events = list(result.scalars().all())

    if not events:
        return []

    # Fetch people for person questions
    people_result = await db.execute(
        select(Person).where(Person.description.is_not(None)).limit(100)
    )
    people = list(people_result.scalars().all())

    # Build question pool
    questions: List[QuizQuestion] = []
    event_generators = [_gen_year_question, _gen_category_question, _gen_what_happened_question]

    random.shuffle(events)

    for event in events:
        if len(questions) >= count * 3:
            break
        gen = random.choice(event_generators)
        q = gen(event, events, difficulty.value)
        if q:
            questions.append(q)

    # Add person questions (up to ~25% of total)
    if people:
        person_count = max(1, count // 4)
        random.shuffle(people)
        for person in people[:person_count * 3]:
            q = _gen_person_question(person, people, difficulty.value)
            if q:
                questions.append(q)

    # Shuffle and trim to requested count
    random.shuffle(questions)
    return questions[:count]
