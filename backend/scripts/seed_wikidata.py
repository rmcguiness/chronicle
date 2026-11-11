#!/usr/bin/env python3
"""Seed events and causality links imported from Wikidata.

The data lives in ``backend/scripts/data/wikidata_events.json``, produced by
``import_wikidata.py``. This module exposes it in the same shape as the hand-written
seed scripts (``EVENTS`` and ``CAUSALITY_LINKS``) so the duplicate check and the demo
snapshot exporter read it like any other seed batch.

Wikidata content is CC0; see LICENSE-DATA.md for how the compiled dataset is licensed.

Run (after the hand-written seeds, since some links point at their events):
    python backend/scripts/seed_wikidata.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent / "data" / "wikidata_events.json"
CREATED_BY = "seed-script:wikidata-v1"


def _load() -> dict[str, Any]:
    return json.loads(DATA_PATH.read_text(encoding="utf-8"))


_DATA = _load()

EVENTS: list[dict[str, Any]] = [
    {**ev, "is_bce": ev["year"] < 0, "zoom_min": 3, "perspectives": []} for ev in _DATA["events"]
]
CAUSALITY_LINKS: list[dict[str, Any]] = [
    {k: link[k] for k in ("cause", "effect", "type", "strength", "desc")} for link in _DATA["links"]
]
# Wikidata QIDs that match an event already in the hand-written seeds: qid -> slug.
ALIASES: dict[str, str] = _DATA.get("aliases", {})


def _date_literals(year: int) -> tuple[str, str]:
    abs_year = min(abs(year), 4712)  # Postgres BC limit
    era = " BC" if year < 0 else ""
    return f"'{abs_year:04d}-01-01{era}'::date", f"'{abs_year:04d}-12-31{era}'::date"


async def seed(conn: Any) -> None:
    has_summary = await conn.fetchval(
        "SELECT EXISTS (SELECT 1 FROM information_schema.columns "
        "WHERE table_name = 'events' AND column_name = 'article_summary')"
    )
    inserted = skipped = 0
    for ev in EVENTS:
        if await conn.fetchval("SELECT id FROM events WHERE slug = $1 OR wikidata_id = $2", ev["slug"], ev["wikidata_id"]):
            skipped += 1
            continue
        date_e, date_l = _date_literals(ev["year"])
        content_hash = hashlib.sha256(json.dumps(ev, sort_keys=True).encode()).hexdigest()
        event_id = await conn.fetchval(
            f"""
            INSERT INTO events (
                slug, title, date_earliest, date_latest, year_approx, is_bce,
                geo_point, geo_modern, geo_era_label, importance_score, zoom_min, event_category,
                wikidata_id, wikipedia_slug, review_status, created_by, content_hash
            ) VALUES (
                $1, $2, {date_e}, {date_l}, $3, $4,
                ST_GeomFromEWKT($5), $6, $7, $8, $9, $10,
                $11, $12, 'approved', $13, $14
            ) RETURNING id
            """,
            ev["slug"], ev["title"], ev["year"], ev["is_bce"],
            f"SRID=4326;POINT({ev['lng']} {ev['lat']})", ev.get("geo_modern"), ev.get("geo_era_label"),
            ev["importance_score"], ev["zoom_min"], ev["category"],
            ev["wikidata_id"], ev.get("wikipedia_slug"), CREATED_BY, content_hash,
        )
        if has_summary and ev.get("summary"):
            await conn.execute("UPDATE events SET article_summary = $1 WHERE id = $2", ev["summary"], event_id)
        inserted += 1
    for qid, slug in ALIASES.items():
        await conn.execute("UPDATE events SET wikidata_id = $1 WHERE slug = $2 AND wikidata_id IS NULL", qid, slug)

    linked = 0
    for link in CAUSALITY_LINKS:
        ids = await conn.fetch("SELECT slug, id FROM events WHERE slug = ANY($1::text[])", [link["cause"], link["effect"]])
        by_slug = {r["slug"]: r["id"] for r in ids}
        if link["cause"] not in by_slug or link["effect"] not in by_slug:
            continue
        exists = await conn.fetchval(
            "SELECT 1 FROM causality_links WHERE cause_event_id = $1 AND effect_event_id = $2",
            by_slug[link["cause"]], by_slug[link["effect"]],
        )
        if exists:
            continue
        await conn.execute(
            """
            INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            by_slug[link["cause"]], by_slug[link["effect"]], link["type"], link["strength"], link["desc"], CREATED_BY,
        )
        linked += 1
    print(f"Wikidata seed: {inserted} events inserted, {skipped} skipped, {linked} links inserted")


async def main() -> None:
    import asyncpg

    dsn = os.getenv("DATABASE_URL", "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle")
    conn = await asyncpg.connect(dsn.replace("postgresql+asyncpg://", "postgresql://"))
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
