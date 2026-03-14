"""
Seed 5 example public timelines into the custom_timelines table.

Usage:
    python scripts/seed_timelines.py
"""
from __future__ import annotations

import asyncio
import os

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://chronicle:chronicle@localhost:5433/chronicle",
)

TIMELINES = [
    {
        "title": "Rise and Fall of Rome",
        "description": "From the founding myths to the fall of the Western Empire \u2014 trace Rome\u2019s arc across a millennium of conquest, civil war, and transformation.",
        "event_slugs": [
            "punic-wars-rome-carthage",
            "assassination-julius-caesar",
            "battle-actium-31bce",
            "eruption-vesuvius-pompeii",
            "fall-western-roman-empire-476",
        ],
        "share_token": "rome-rise-fall",
    },
    {
        "title": "The Scientific Revolution",
        "description": "Key breakthroughs that transformed humanity\u2019s understanding of the natural world, from Copernicus to Darwin.",
        "event_slugs": [
            "copernicus-heliocentric-theory-1543",
            "vesalius-human-anatomy-1543",
            "kepler-planetary-laws-1609",
            "harvey-blood-circulation-1628",
            "scientific-revolution-newton-laws-1687",
            "lavoisier-oxygen-chemistry-1789",
            "jenner-smallpox-vaccination-1796",
            "darwin-on-the-origin-of-species-1859",
            "pasteur-germ-theory-1862",
        ],
        "share_token": "scientific-revolution",
    },
    {
        "title": "World Wars Timeline",
        "description": "The two global conflicts that reshaped the 20th century \u2014 from the assassination in Sarajevo to the atomic age.",
        "event_slugs": [
            "assassination-franz-ferdinand-1914",
            "germany-invades-belgium-1914",
            "battle-verdun-1916",
            "russian-revolution-1917",
            "armistice-wwi-november-1918",
            "treaty-of-versailles-1919",
            "hitler-appointed-chancellor-1933",
            "germany-invades-poland-1939",
            "fall-of-france-1940",
            "operation-barbarossa-1941",
            "pearl-harbor-1941",
            "battle-stalingrad-1942-1943",
            "d-day-normandy-1944",
            "atomic-bombing-hiroshima-nagasaki-1945",
            "germany-surrenders-wwii-1945",
        ],
        "share_token": "world-wars",
    },
    {
        "title": "Ancient Civilizations",
        "description": "The great civilizations that built the foundations of human society \u2014 from the pyramids to the Silk Road.",
        "event_slugs": [
            "construction-great-pyramid-giza",
            "hammurabi-code-babylon",
            "indus-valley-civilization-2500bce",
            "olmec-civilization-1500bce",
            "battle-thermopylae-480bce",
            "alexander-conquests-334bce",
            "maurya-empire-chandragupta-322bce",
            "qin-unification-china-221bce",
            "silk-road-opens-130bce",
        ],
        "share_token": "ancient-civilizations",
    },
    {
        "title": "The Space Race",
        "description": "From Cold War rivalry to giant leaps \u2014 humanity\u2019s journey beyond Earth.",
        "event_slugs": [
            "cuban-missile-crisis-resolution-1962-detail",
            "nuclear-test-ban-treaty-1963",
            "berlin-wall-construction-1961",
        ],
        "share_token": "space-race",
    },
]


async def main():
    conn = await asyncpg.connect(DATABASE_URL)

    exists = await conn.fetchval(
        "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'custom_timelines')"
    )
    if not exists:
        print("custom_timelines table does not exist. Run migration 0004 first.")
        await conn.close()
        return

    for tl in TIMELINES:
        existing = await conn.fetchval(
            "SELECT id FROM custom_timelines WHERE share_token = $1",
            tl["share_token"],
        )
        if existing:
            print(f"  Skipping '{tl['title']}' \u2014 already seeded (token={tl['share_token']})")
            continue

        await conn.execute(
            """
            INSERT INTO custom_timelines (title, description, event_slugs, share_token, is_public)
            VALUES ($1, $2, $3, $4, true)
            """,
            tl["title"],
            tl["description"],
            tl["event_slugs"],
            tl["share_token"],
        )
        print(f"  Seeded '{tl['title']}' (token={tl['share_token']}, {len(tl['event_slugs'])} events)")

    await conn.close()
    print("Done \u2014 5 example timelines seeded.")


if __name__ == "__main__":
    asyncio.run(main())
