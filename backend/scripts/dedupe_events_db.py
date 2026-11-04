#!/usr/bin/env python3
"""Merge duplicate events that are already in a Chronicle database.

The seed scripts no longer create the duplicates listed in duplicate_events.MERGED_DUPLICATES,
but a database seeded earlier still has them. For each (duplicate -> kept) pair present in
the database this re-points causality links and people/organization links to the kept event,
drops links that would become self-links or repeat an existing pair, then deletes the
duplicate (its perspectives and sources cascade).

Run from backend/:
    python scripts/dedupe_events_db.py           # dry run: show what would change
    python scripts/dedupe_events_db.py --apply   # do it, in one transaction
"""
from __future__ import annotations

import asyncio
import os
import sys

import asyncpg

sys.path.insert(0, os.path.dirname(__file__))
from duplicate_events import MERGED_DUPLICATES  # noqa: E402

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

MERGE_SQL = [
    # Links that would duplicate an existing pair or become a self-link are dropped first.
    """DELETE FROM causality_links l USING causality_links k
       WHERE l.cause_event_id = $1 AND k.cause_event_id = $2 AND k.effect_event_id = l.effect_event_id""",
    """DELETE FROM causality_links l USING causality_links k
       WHERE l.effect_event_id = $1 AND k.effect_event_id = $2 AND k.cause_event_id = l.cause_event_id""",
    """DELETE FROM causality_links
       WHERE (cause_event_id = $1 AND effect_event_id = $2) OR (cause_event_id = $2 AND effect_event_id = $1)""",
    "UPDATE causality_links SET cause_event_id = $2 WHERE cause_event_id = $1",
    "UPDATE causality_links SET effect_event_id = $2 WHERE effect_event_id = $1",
    """INSERT INTO event_people (event_id, person_id, role, role_notes)
       SELECT $2, person_id, role, role_notes FROM event_people WHERE event_id = $1
       ON CONFLICT DO NOTHING""",
    """INSERT INTO event_organizations (event_id, org_id, role)
       SELECT $2, org_id, role FROM event_organizations WHERE event_id = $1
       ON CONFLICT DO NOTHING""",
    "DELETE FROM events WHERE id = $1",
]


async def main(apply: bool) -> None:
    conn = await asyncpg.connect(PG_DSN)
    try:
        rows = await conn.fetch(
            "SELECT slug, id FROM events WHERE slug = ANY($1::text[])",
            list(MERGED_DUPLICATES) + list(set(MERGED_DUPLICATES.values())),
        )
        ids = {r["slug"]: r["id"] for r in rows}
        pairs = [(d, k) for d, k in MERGED_DUPLICATES.items() if d in ids and k in ids]
        missing_target = [d for d, k in MERGED_DUPLICATES.items() if d in ids and k not in ids]
        for d, k in pairs:
            print(f"merge {d} -> {k}")
        for d in missing_target:
            print(f"skip {d}: target {MERGED_DUPLICATES[d]} is not in the database")
        print(f"{len(pairs)} duplicate(s) to merge")
        if not apply or not pairs:
            if pairs:
                print("Dry run; re-run with --apply to merge.")
            return
        async with conn.transaction():
            for d, k in pairs:
                for sql in MERGE_SQL:
                    await conn.execute(sql, ids[d], ids[k]) if "$2" in sql else await conn.execute(sql, ids[d])
        print("Merged.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main("--apply" in sys.argv))
