#!/usr/bin/env python3
"""
Populate wikipedia_slug and article_summary for Chronicle events.

For each event without a wikipedia_slug, searches Wikipedia's REST API
to find a matching article, then stores the slug and a summary excerpt.

Run from backend/ directory:
    python scripts/populate_wikipedia_slugs.py [--limit N]
"""
from __future__ import annotations

import argparse
import asyncio
import os
import re
import time
import urllib.parse

import asyncpg
import requests

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

WIKIPEDIA_SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary"
WIKIPEDIA_SEARCH_API = "https://en.wikipedia.org/w/api.php"
BATCH_SIZE = 50
REQUEST_DELAY = 0.1  # seconds between Wikipedia requests

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Chronicle/1.0 (historical-timeline-app; contact@example.com)"})


def title_variants(title: str) -> list[str]:
    """Generate search variants from an event title."""
    variants = [title]

    # Remove em-dash suffixes: "X — Y" -> "X", then "Y"
    if " — " in title:
        variants.append(title.split(" — ")[0].strip())
        variants.append(title.split(" — ")[1].strip())

    # Remove parenthetical qualifiers
    no_parens = re.sub(r"\s*\(.*?\)", "", title).strip()
    if no_parens and no_parens != title:
        variants.append(no_parens)

    # "X Constructed/Founded/etc" -> "X"
    m = re.match(
        r"^(.+?)\s+(?:Constructed|Founded|Established|Built|Completed|Signed|"
        r"Begins|Ends|Erupts|Falls|Invented|Discovered|Appear|Revolutionizes|"
        r"Abdicates|Unifies)$",
        title, re.IGNORECASE,
    )
    if m:
        variants.append(m.group(1))

    # "Event of Subject" -> "Subject"
    m = re.match(
        r"^(?:Assassination|Death|Birth|Execution|Coronation|Founding|"
        r"Fall|Rise|Siege|Battle|Treaty|Sack|Discovery|Invention|"
        r"Construction|Signing|Declaration|Dissolution|Unification|"
        r"Liberation|Conquest) of (.+)$",
        title, re.IGNORECASE,
    )
    if m:
        variants.append(m.group(1))

    # "X Publishes/Composes Y" -> "Y"
    m = re.match(r"^.+?\s+(?:Publishes|Composes|Writes)\s+(.+)$", title, re.IGNORECASE)
    if m:
        variants.append(m.group(1))

    # "X's Y" -> "Y" (e.g. "Newton's Principia" -> "Principia")
    m = re.match(r"^.+?'s\s+(.+)$", title)
    if m:
        variants.append(m.group(1))

    # Remove leading articles
    no_article = re.sub(r"^(The|A|An)\s+", "", title, flags=re.IGNORECASE).strip()
    if no_article and no_article != title:
        variants.append(no_article)

    # Deduplicate while preserving order
    seen = set()
    result = []
    for v in variants:
        v = v.strip()
        if v and v not in seen:
            seen.add(v)
            result.append(v)
    return result


def fetch_summary(title_slug: str) -> dict | None:
    """Fetch Wikipedia summary for a title slug. Returns JSON or None."""
    encoded = urllib.parse.quote(title_slug.replace(" ", "_"), safe="/:")
    url = f"{WIKIPEDIA_SUMMARY_API}/{encoded}"
    try:
        resp = SESSION.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("type") != "disambiguation":
                return data
    except Exception:
        pass
    return None


def search_wikipedia(title: str) -> tuple[str | None, str | None]:
    """Try to find a Wikipedia article for the given event title.

    Returns (wikipedia_slug, article_summary) or (None, None).
    """
    variants = title_variants(title)

    for variant in variants:
        data = fetch_summary(variant)
        time.sleep(REQUEST_DELAY)
        if data:
            slug = data.get("title", variant).replace(" ", "_")
            extract = data.get("extract", "")[:500]
            return slug, extract

    # Fallback: Wikipedia search API
    params = {
        "action": "query",
        "list": "search",
        "srsearch": title,
        "srlimit": 1,
        "format": "json",
    }
    try:
        resp = SESSION.get(WIKIPEDIA_SEARCH_API, params=params, timeout=10)
        time.sleep(REQUEST_DELAY)
        if resp.status_code == 200:
            results = resp.json().get("query", {}).get("search", [])
            if results:
                found_title = results[0]["title"]
                data = fetch_summary(found_title)
                time.sleep(REQUEST_DELAY)
                if data:
                    slug = data.get("title", found_title).replace(" ", "_")
                    extract = data.get("extract", "")[:500]
                    return slug, extract
    except Exception:
        pass

    return None, None


async def main(limit: int | None = None) -> None:
    pool = await asyncpg.create_pool(PG_DSN, min_size=1, max_size=2)

    query = """
        SELECT id, title FROM events
        WHERE wikipedia_slug IS NULL OR wikipedia_slug = ''
        ORDER BY importance_score DESC NULLS LAST
    """
    if limit:
        query += f" LIMIT {limit}"

    async with pool.acquire() as conn:
        rows = await conn.fetch(query)

    total = len(rows)
    found = 0
    not_found = 0

    print(f"Processing {total} events...\n")

    for batch_start in range(0, total, BATCH_SIZE):
        batch = rows[batch_start : batch_start + BATCH_SIZE]
        updates: list[tuple] = []

        for row in batch:
            event_id = row["id"]
            event_title = row["title"]

            slug, summary = search_wikipedia(event_title)

            if slug:
                print(f"✅ Found: {event_title} → {slug}")
                updates.append((event_id, slug, summary))
                found += 1
            else:
                print(f"❌ Not found: {event_title}")
                not_found += 1

        if updates:
            async with pool.acquire() as conn:
                await conn.executemany(
                    """
                    UPDATE events
                    SET wikipedia_slug = $2, article_summary = $3
                    WHERE id = $1
                    """,
                    updates,
                )

        print(f"\n--- Batch complete ({batch_start + len(batch)}/{total}) ---\n")

    SESSION.close()
    await pool.close()

    print(f"\n{'='*50}")
    print(f"Done! {found} found, {not_found} not found, {total} total processed")
    print(f"{'='*50}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Populate Wikipedia slugs for events")
    parser.add_argument("--limit", type=int, default=None, help="Max events to process")
    args = parser.parse_args()
    asyncio.run(main(limit=args.limit))
