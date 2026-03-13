"""
Quiz router — generates random quiz questions from historical events.

Owns: GET /api/quiz/questions endpoint.
Does NOT own: event CRUD, user sessions, scoring persistence.

Questions are generated server-side from approved events with
importance_score >= MIN_IMPORTANCE. Three question types are mixed:
  1. year_guess  — "What year did X occur?"
  2. region      — "Which region did X occur in?"
  3. chronological — "Which event came first?"
"""
from __future__ import annotations

import random
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

# ── Constants ─────────────────────────────────────────────
MIN_IMPORTANCE = 0.5
MAX_YEAR_OFFSET = 200       # Range for plausible wrong year answers
WRONG_OPTIONS_COUNT = 3     # Number of wrong answers per question
DEFAULT_QUESTION_COUNT = 10
MAX_QUESTION_COUNT = 30
# Pool size multiplier — fetch more events than needed so we can filter
POOL_MULTIPLIER = 5


async def _fetch_event_pool(
    db: AsyncSession, pool_size: int
) -> list[dict[str, Any]]:
    """
    Fetch a random pool of approved events with importance >= threshold.
    Returns dicts with id, title, year_approx, is_bce, geo_modern,
    article_summary, and event_category.
    """
    result = await db.execute(
        select(
            Event.id,
            Event.title,
            Event.year_approx,
            Event.is_bce,
            Event.geo_modern,
            Event.article_summary,
            Event.event_category,
        )
        .where(
            Event.review_status == "approved",
            Event.importance_score >= MIN_IMPORTANCE,
            Event.year_approx.isnot(None),
        )
        .order_by(func.random())
        .limit(pool_size)
    )
    return [dict(row._mapping) for row in result.all()]


def _make_year_question(event: dict[str, Any]) -> dict[str, Any]:
    """Generate a 'What year did X occur?' multiple-choice question."""
    correct_year = event["year_approx"]
    is_bce = event["is_bce"]

    # Generate 3 plausible wrong years within ±MAX_YEAR_OFFSET
    wrong_years: set[int] = set()
    while len(wrong_years) < WRONG_OPTIONS_COUNT:
        offset = random.randint(1, MAX_YEAR_OFFSET)
        sign = random.choice([-1, 1])
        candidate = correct_year + (sign * offset)
        if candidate != correct_year:
            wrong_years.add(candidate)

    all_options = [correct_year] + list(wrong_years)
    random.shuffle(all_options)

    # Format years for display (handle BCE)
    def fmt_year(y: int) -> str:
        if is_bce or y < 0:
            return f"{abs(y)} BCE"
        return f"{y} CE"

    return {
        "type": "year_guess",
        "question": f"What year did \"{event['title']}\" occur?",
        "options": [fmt_year(y) for y in all_options],
        "correct_index": all_options.index(correct_year),
        "event_title": event["title"],
        "explanation": event["article_summary"] or f"{event['title']} occurred in {fmt_year(correct_year)}.",
    }


def _make_region_question(
    event: dict[str, Any], all_regions: list[str]
) -> dict[str, Any] | None:
    """Generate a 'Which region did X occur in?' question."""
    correct_region = event["geo_modern"]
    if not correct_region or len(all_regions) < 4:
        return None

    # Pick 3 wrong regions
    wrong_regions = [r for r in all_regions if r != correct_region]
    if len(wrong_regions) < WRONG_OPTIONS_COUNT:
        return None
    wrong_regions = random.sample(wrong_regions, WRONG_OPTIONS_COUNT)

    all_options = [correct_region] + wrong_regions
    random.shuffle(all_options)

    return {
        "type": "region",
        "question": f"Which region did \"{event['title']}\" occur in?",
        "options": all_options,
        "correct_index": all_options.index(correct_region),
        "event_title": event["title"],
        "explanation": event["article_summary"] or f"{event['title']} took place in {correct_region}.",
    }


def _make_chronological_question(
    event_a: dict[str, Any], event_b: dict[str, Any]
) -> dict[str, Any] | None:
    """Generate a 'Which event came first?' question from two events."""
    year_a = event_a["year_approx"]
    year_b = event_b["year_approx"]
    if year_a == year_b:
        return None

    # The earlier event (lower year_approx — already accounts for BCE as negative)
    first_idx = 0 if year_a < year_b else 1
    options = [event_a["title"], event_b["title"]]

    first_event = event_a if first_idx == 0 else event_b
    def fmt_year(e: dict) -> str:
        y = e["year_approx"]
        return f"{abs(y)} BCE" if (e["is_bce"] or y < 0) else f"{y} CE"

    return {
        "type": "chronological",
        "question": "Which event came FIRST?",
        "options": options,
        "correct_index": first_idx,
        "event_title": f"{event_a['title']} vs {event_b['title']}",
        "explanation": (
            f"{first_event['title']} ({fmt_year(first_event)}) came before "
            f"{(event_b if first_idx == 0 else event_a)['title']} "
            f"({fmt_year(event_b if first_idx == 0 else event_a)})."
        ),
    }


@router.get("/questions")
async def get_quiz_questions(
    count: int = Query(default=DEFAULT_QUESTION_COUNT, ge=1, le=MAX_QUESTION_COUNT),
    db: AsyncSession = Depends(get_db),
) -> list[dict[str, Any]]:
    """
    GET /api/quiz/questions?count=10

    Returns a list of quiz questions generated from random DB events.
    Each question has: type, question, options, correct_index,
    event_title, explanation.
    """
    pool = await _fetch_event_pool(db, count * POOL_MULTIPLIER)
    if len(pool) < 4:
        return []

    # Collect distinct regions for region questions
    all_regions = list({e["geo_modern"] for e in pool if e["geo_modern"]})

    questions: list[dict[str, Any]] = []
    used_titles: set[str] = set()
    pool_iter = iter(pool)

    # Question type weights: year_guess, region, chronological
    question_types = ["year_guess", "region", "chronological"]

    attempts = 0
    max_attempts = count * 10  # prevent infinite loops

    while len(questions) < count and attempts < max_attempts:
        attempts += 1
        qtype = random.choice(question_types)

        if qtype == "year_guess":
            event = _pick_unused(pool, used_titles)
            if not event:
                continue
            q = _make_year_question(event)
            used_titles.add(event["title"])
            questions.append(q)

        elif qtype == "region":
            event = _pick_unused(pool, used_titles, needs_region=True)
            if not event:
                continue
            q = _make_region_question(event, all_regions)
            if q:
                used_titles.add(event["title"])
                questions.append(q)

        elif qtype == "chronological":
            event_a = _pick_unused(pool, used_titles)
            event_b = _pick_unused(pool, used_titles, exclude_title=event_a["title"] if event_a else None)
            if not event_a or not event_b:
                continue
            q = _make_chronological_question(event_a, event_b)
            if q:
                used_titles.add(event_a["title"])
                used_titles.add(event_b["title"])
                questions.append(q)

    return questions


def _pick_unused(
    pool: list[dict[str, Any]],
    used: set[str],
    needs_region: bool = False,
    exclude_title: str | None = None,
) -> dict[str, Any] | None:
    """Pick a random unused event from the pool."""
    candidates = [
        e for e in pool
        if e["title"] not in used
        and e["title"] != exclude_title
        and (not needs_region or e["geo_modern"])
    ]
    return random.choice(candidates) if candidates else None
