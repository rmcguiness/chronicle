#!/usr/bin/env python3
"""
Chronicle seed script — 30 notable historical figures.

Run from backend/ directory:
    python scripts/seed_people.py

Requires a running PostgreSQL with the schema already applied (alembic upgrade head).
"""
from __future__ import annotations

import asyncio
import os
import sys
from typing import Any

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")


PEOPLE: list[dict[str, Any]] = [
    {"slug": "julius-caesar", "name": "Julius Caesar", "birth_year": -100, "death_year": -44, "nationality": "Roman", "occupation": "Military leader, Dictator", "importance_score": 0.95, "bio": "Roman general and statesman who played a critical role in the events that led to the demise of the Roman Republic and the rise of the Roman Empire.", "wikipedia_slug": "Julius_Caesar"},
    {"slug": "augustus", "name": "Augustus", "birth_year": -63, "death_year": 14, "nationality": "Roman", "occupation": "Emperor", "importance_score": 0.93, "bio": "Founder of the Roman Principate and the first Roman emperor, ruling from 27 BC until his death in AD 14.", "wikipedia_slug": "Augustus"},
    {"slug": "cleopatra", "name": "Cleopatra VII", "birth_year": -69, "death_year": -30, "nationality": "Egyptian (Ptolemaic)", "occupation": "Pharaoh", "importance_score": 0.88, "bio": "Last active ruler of the Ptolemaic Kingdom of Egypt, known for her relationships with Julius Caesar and Mark Antony.", "wikipedia_slug": "Cleopatra"},
    {"slug": "alexander-the-great", "name": "Alexander the Great", "birth_year": -356, "death_year": -323, "nationality": "Macedonian", "occupation": "King, Military commander", "importance_score": 0.96, "bio": "King of the ancient Greek kingdom of Macedon who created one of the largest empires in ancient history.", "wikipedia_slug": "Alexander_the_Great"},
    {"slug": "genghis-khan", "name": "Genghis Khan", "birth_year": 1162, "death_year": 1227, "nationality": "Mongol", "occupation": "Khan, Conqueror", "importance_score": 0.95, "bio": "Founder and first Great Khan of the Mongol Empire, which became the largest contiguous land empire in history.", "wikipedia_slug": "Genghis_Khan"},
    {"slug": "napoleon-bonaparte", "name": "Napoleon Bonaparte", "birth_year": 1769, "death_year": 1821, "nationality": "French", "occupation": "Emperor, Military commander", "importance_score": 0.95, "bio": "French military leader who rose to prominence during the French Revolution and led several successful campaigns during the Revolutionary Wars.", "wikipedia_slug": "Napoleon"},
    {"slug": "abraham-lincoln", "name": "Abraham Lincoln", "birth_year": 1809, "death_year": 1865, "nationality": "American", "occupation": "President, Lawyer", "importance_score": 0.93, "bio": "16th president of the United States who led the nation through the Civil War and abolished slavery.", "wikipedia_slug": "Abraham_Lincoln"},
    {"slug": "winston-churchill", "name": "Winston Churchill", "birth_year": 1874, "death_year": 1965, "nationality": "British", "occupation": "Prime Minister, Author", "importance_score": 0.92, "bio": "British statesman who served as Prime Minister during World War II and led Britain to victory against Nazi Germany.", "wikipedia_slug": "Winston_Churchill"},
    {"slug": "adolf-hitler", "name": "Adolf Hitler", "birth_year": 1889, "death_year": 1945, "nationality": "Austrian-German", "occupation": "Dictator", "importance_score": 0.95, "bio": "Leader of Nazi Germany from 1933 to 1945 whose aggressive foreign policy precipitated World War II and the Holocaust.", "wikipedia_slug": "Adolf_Hitler"},
    {"slug": "joseph-stalin", "name": "Joseph Stalin", "birth_year": 1878, "death_year": 1953, "nationality": "Georgian-Soviet", "occupation": "General Secretary, Dictator", "importance_score": 0.92, "bio": "Leader of the Soviet Union from the mid-1920s until his death in 1953, overseeing rapid industrialization and the victory over Nazi Germany.", "wikipedia_slug": "Joseph_Stalin"},
    {"slug": "mao-zedong", "name": "Mao Zedong", "birth_year": 1893, "death_year": 1976, "nationality": "Chinese", "occupation": "Chairman, Revolutionary", "importance_score": 0.92, "bio": "Founding father of the People's Republic of China who led the Communist Party of China to victory in the Chinese Civil War.", "wikipedia_slug": "Mao_Zedong"},
    {"slug": "mahatma-gandhi", "name": "Mahatma Gandhi", "birth_year": 1869, "death_year": 1948, "nationality": "Indian", "occupation": "Political leader, Activist", "importance_score": 0.93, "bio": "Indian lawyer and anti-colonial nationalist who employed nonviolent resistance to lead India to independence from British rule.", "wikipedia_slug": "Mahatma_Gandhi"},
    {"slug": "isaac-newton", "name": "Isaac Newton", "birth_year": 1643, "death_year": 1727, "nationality": "English", "occupation": "Physicist, Mathematician", "importance_score": 0.95, "bio": "English mathematician, physicist, and astronomer who is widely recognized as one of the greatest mathematicians and most influential scientists of all time.", "wikipedia_slug": "Isaac_Newton"},
    {"slug": "charles-darwin", "name": "Charles Darwin", "birth_year": 1809, "death_year": 1882, "nationality": "English", "occupation": "Naturalist, Biologist", "importance_score": 0.92, "bio": "English naturalist whose theory of evolution by natural selection is the foundation of modern evolutionary studies.", "wikipedia_slug": "Charles_Darwin"},
    {"slug": "albert-einstein", "name": "Albert Einstein", "birth_year": 1879, "death_year": 1955, "nationality": "German-American", "occupation": "Physicist", "importance_score": 0.96, "bio": "Theoretical physicist who developed the theory of relativity, one of the two pillars of modern physics alongside quantum mechanics.", "wikipedia_slug": "Albert_Einstein"},
    {"slug": "thomas-edison", "name": "Thomas Edison", "birth_year": 1847, "death_year": 1931, "nationality": "American", "occupation": "Inventor, Businessman", "importance_score": 0.85, "bio": "American inventor and businessman who developed many devices including the phonograph, the motion picture camera, and the long-lasting practical electric light bulb.", "wikipedia_slug": "Thomas_Edison"},
    {"slug": "nikola-tesla", "name": "Nikola Tesla", "birth_year": 1856, "death_year": 1943, "nationality": "Serbian-American", "occupation": "Inventor, Electrical engineer", "importance_score": 0.85, "bio": "Serbian-American inventor and engineer known for his contributions to the design of the modern alternating current electricity supply system.", "wikipedia_slug": "Nikola_Tesla"},
    {"slug": "william-shakespeare", "name": "William Shakespeare", "birth_year": 1564, "death_year": 1616, "nationality": "English", "occupation": "Playwright, Poet", "importance_score": 0.93, "bio": "English playwright and poet widely regarded as the greatest writer in the English language and the world's greatest dramatist.", "wikipedia_slug": "William_Shakespeare"},
    {"slug": "michelangelo", "name": "Michelangelo", "birth_year": 1475, "death_year": 1564, "nationality": "Italian", "occupation": "Sculptor, Painter, Architect", "importance_score": 0.90, "bio": "Italian sculptor, painter, architect, and poet of the High Renaissance, known for the ceiling of the Sistine Chapel and the statue of David.", "wikipedia_slug": "Michelangelo"},
    {"slug": "leonardo-da-vinci", "name": "Leonardo da Vinci", "birth_year": 1452, "death_year": 1519, "nationality": "Italian", "occupation": "Polymath, Artist, Inventor", "importance_score": 0.94, "bio": "Italian polymath whose areas of interest included painting, sculpting, architecture, science, music, mathematics, engineering, and invention.", "wikipedia_slug": "Leonardo_da_Vinci"},
    {"slug": "christopher-columbus", "name": "Christopher Columbus", "birth_year": 1451, "death_year": 1506, "nationality": "Genoese (Italian)", "occupation": "Explorer, Navigator", "importance_score": 0.90, "bio": "Italian explorer and navigator who completed four voyages across the Atlantic Ocean, opening the way for European exploration and colonization of the Americas.", "wikipedia_slug": "Christopher_Columbus"},
    {"slug": "ferdinand-magellan", "name": "Ferdinand Magellan", "birth_year": 1480, "death_year": 1521, "nationality": "Portuguese", "occupation": "Explorer, Navigator", "importance_score": 0.82, "bio": "Portuguese explorer who organized the first circumnavigation of the Earth, though he died before completing the voyage.", "wikipedia_slug": "Ferdinand_Magellan"},
    {"slug": "george-washington", "name": "George Washington", "birth_year": 1732, "death_year": 1799, "nationality": "American", "occupation": "President, Military commander", "importance_score": 0.93, "bio": "American Founding Father, military officer, and first president of the United States who led the Continental Army to victory in the Revolutionary War.", "wikipedia_slug": "George_Washington"},
    {"slug": "thomas-jefferson", "name": "Thomas Jefferson", "birth_year": 1743, "death_year": 1826, "nationality": "American", "occupation": "President, Statesman", "importance_score": 0.88, "bio": "American Founding Father, third president of the United States, and principal author of the Declaration of Independence.", "wikipedia_slug": "Thomas_Jefferson"},
    {"slug": "karl-marx", "name": "Karl Marx", "birth_year": 1818, "death_year": 1883, "nationality": "German", "occupation": "Philosopher, Economist", "importance_score": 0.90, "bio": "German philosopher, economist, and political theorist whose works formed the basis of modern communism and socialism.", "wikipedia_slug": "Karl_Marx"},
    {"slug": "sigmund-freud", "name": "Sigmund Freud", "birth_year": 1856, "death_year": 1939, "nationality": "Austrian", "occupation": "Neurologist, Psychoanalyst", "importance_score": 0.85, "bio": "Austrian neurologist and the founder of psychoanalysis, whose theories about the unconscious mind profoundly influenced Western thought.", "wikipedia_slug": "Sigmund_Freud"},
    {"slug": "louis-pasteur", "name": "Louis Pasteur", "birth_year": 1822, "death_year": 1895, "nationality": "French", "occupation": "Chemist, Microbiologist", "importance_score": 0.88, "bio": "French chemist and microbiologist renowned for his discoveries of the principles of vaccination, microbial fermentation, and pasteurization.", "wikipedia_slug": "Louis_Pasteur"},
    {"slug": "marie-curie", "name": "Marie Curie", "birth_year": 1867, "death_year": 1934, "nationality": "Polish-French", "occupation": "Physicist, Chemist", "importance_score": 0.90, "bio": "Polish-French physicist and chemist who conducted pioneering research on radioactivity and was the first woman to win a Nobel Prize.", "wikipedia_slug": "Marie_Curie"},
    {"slug": "muhammad", "name": "Muhammad", "birth_year": 570, "death_year": 632, "nationality": "Arabian", "occupation": "Prophet, Political leader", "importance_score": 0.97, "bio": "Founder of Islam and regarded by Muslims as the last prophet sent by God. His teachings form the basis of one of the world's major religions.", "wikipedia_slug": "Muhammad"},
    {"slug": "siddhartha-gautama", "name": "Siddhartha Gautama (Buddha)", "birth_year": -563, "death_year": -483, "nationality": "Indian (Shakya)", "occupation": "Spiritual teacher", "importance_score": 0.95, "bio": "Spiritual teacher from ancient India who founded Buddhism. His teachings on the path to enlightenment have influenced billions across Asia and the world.", "wikipedia_slug": "Gautama_Buddha"},
]


async def seed_people() -> None:
    conn = await asyncpg.connect(PG_DSN)
    try:
        existing = await conn.fetch("SELECT slug FROM people")
        existing_slugs = {row["slug"] for row in existing}

        inserted = 0
        for p in PEOPLE:
            if p["slug"] in existing_slugs:
                continue
            await conn.execute(
                """
                INSERT INTO people (slug, name, birth_year, death_year, nationality, occupation,
                                    importance_score, bio, wikipedia_slug)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                """,
                p["slug"],
                p["name"],
                p["birth_year"],
                p["death_year"],
                p["nationality"],
                p["occupation"],
                p["importance_score"],
                p["bio"],
                p["wikipedia_slug"],
            )
            inserted += 1

        print(f"Seeded {inserted} people ({len(existing_slugs)} already existed)")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(seed_people())
