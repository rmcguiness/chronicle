"""
Seed 5 example lessons for the teaching/classroom mode.

Run from the backend directory:
    python scripts/seed_lessons.py
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import text
from app.database import AsyncSessionLocal

LESSONS = [
    {
        "title": "Ancient River Civilizations",
        "subject": "World History",
        "grade_level": "elementary",
        "event_slugs": [
            "construction-great-pyramid-giza",
            "hammurabi-code-babylon",
            "indus-valley-civilization-2500bce",
        ],
        "learning_objectives": [
            "Identify the major river civilizations of the ancient world",
            "Explain why early civilizations formed along rivers",
            "Compare daily life in Mesopotamia, Egypt, and the Indus Valley",
        ],
        "guiding_questions": [
            "Why did all three civilizations develop near rivers?",
            "What do the Great Pyramid and Hammurabi's Code tell us about how these societies were organized?",
            "How was the Indus Valley civilization different from Egypt and Mesopotamia?",
            "Which achievements from these civilizations still affect our lives today?",
        ],
    },
    {
        "title": "The Age of Revolution",
        "subject": "World History",
        "grade_level": "high",
        "event_slugs": [
            "american-revolution-1776",
            "french-revolution-1789",
            "haitian-revolution-1791-1804",
            "latin-american-independence-movements",
        ],
        "learning_objectives": [
            "Trace the spread of revolutionary ideas from the Enlightenment through the Atlantic world",
            "Compare the causes, methods, and outcomes of each revolution",
            "Evaluate how ideas of liberty and equality were applied — and limited — differently in each context",
        ],
        "guiding_questions": [
            "What shared Enlightenment ideas inspired all four revolutions?",
            "Why did France's revolution become far more violent than America's?",
            "How did the Haitian Revolution challenge the limits of 'liberty' as defined by France and America?",
            "Why are the Latin American independence movements less well-known in Western curricula?",
            "Did these revolutions deliver on their promises of equality? For whom?",
        ],
    },
    {
        "title": "The World Wars",
        "subject": "World History",
        "grade_level": "middle",
        "event_slugs": [
            "assassination-franz-ferdinand-1914",
            "battle-verdun-1916",
            "treaty-of-versailles-1919",
            "hitler-appointed-chancellor-1933",
            "germany-invades-poland-1939",
            "d-day-normandy-1944",
            "atomic-bombing-hiroshima-nagasaki-1945",
        ],
        "learning_objectives": [
            "Explain the chain of events that led from WWI to WWII",
            "Understand how the Treaty of Versailles created conditions for the rise of fascism",
            "Describe key turning points in both world wars",
        ],
        "guiding_questions": [
            "How did the assassination of one person lead to a global war?",
            "Why is the Treaty of Versailles sometimes called 'the peace that led to war'?",
            "What role did economic hardship play in Hitler's rise to power?",
            "Was the use of atomic weapons justified? What perspectives exist on this question?",
            "What lessons from the World Wars are still relevant today?",
        ],
    },
    {
        "title": "Scientific Revolutions",
        "subject": "History of Science",
        "grade_level": "college",
        "event_slugs": [
            "copernicus-heliocentric-theory-1543",
            "newton-principia-1687",
            "darwin-on-the-origin-of-species-1859",
            "dna-double-helix-watson-crick-1953",
        ],
        "learning_objectives": [
            "Analyze how each scientific breakthrough challenged existing paradigms",
            "Evaluate the social and political resistance that accompanied each discovery",
            "Understand Kuhn's concept of paradigm shifts through concrete historical examples",
            "Examine the global intellectual traditions that contributed to European scientific advances",
        ],
        "guiding_questions": [
            "Why did it take over a century for Copernicus's heliocentric model to be widely accepted?",
            "How did Newton build on Islamic, Indian, and Chinese mathematical traditions?",
            "Why was Darwin's theory so threatening to Victorian society — and why does it remain controversial?",
            "What ethical questions arose from the discovery of DNA's structure, and how do they resonate today?",
            "Is scientific progress linear, or does it happen in revolutionary 'paradigm shifts'?",
        ],
    },
    {
        "title": "Rise of Democracy",
        "subject": "Government & Civics",
        "grade_level": "high",
        "event_slugs": [
            "magna-carta-1215",
            "enlightenment-encyclopedie",
            "american-constitution-1787",
        ],
        "learning_objectives": [
            "Trace the evolution of democratic ideas from medieval England to the modern era",
            "Understand how Enlightenment philosophy shaped constitutional government",
            "Critically evaluate who was included and excluded from early democratic systems",
        ],
        "guiding_questions": [
            "Was the Magna Carta truly a step toward democracy, or just a deal between a king and his barons?",
            "How did Enlightenment thinkers like Voltaire, Rousseau, and Montesquieu influence the U.S. Constitution?",
            "Who was left out of 'We the People' in 1787, and how has that changed over time?",
            "Is democracy a Western invention, or did other cultures develop similar ideas independently?",
            "What threats to democracy exist today, and how do they echo historical patterns?",
        ],
    },
]


async def seed_lessons():
    async with AsyncSessionLocal() as session:
        result = await session.execute(text("SELECT COUNT(*) FROM lessons"))
        count = result.scalar()
        if count and count > 0:
            print(f"Lessons table already has {count} rows — skipping seed.")
            return

        for lesson in LESSONS:
            await session.execute(
                text("""
                    INSERT INTO lessons (title, subject, grade_level, event_slugs, guiding_questions, learning_objectives)
                    VALUES (:title, :subject, :grade_level, :event_slugs, :guiding_questions, :learning_objectives)
                """),
                {
                    "title": lesson["title"],
                    "subject": lesson["subject"],
                    "grade_level": lesson["grade_level"],
                    "event_slugs": lesson["event_slugs"],
                    "guiding_questions": lesson["guiding_questions"],
                    "learning_objectives": lesson["learning_objectives"],
                },
            )
        await session.commit()
        print(f"Seeded {len(LESSONS)} lessons.")


if __name__ == "__main__":
    asyncio.run(seed_lessons())
