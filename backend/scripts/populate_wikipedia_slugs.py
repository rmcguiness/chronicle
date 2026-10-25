#!/usr/bin/env python3
"""
Populate wikipedia_slug and article_summary for Chronicle events.

For each event without a wikipedia_slug, searches Wikipedia's REST API
to find a matching article, then stores the slug and a summary excerpt.

Run from project root:
    python3 backend/scripts/populate_wikipedia_slugs.py [--limit N]
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
SESSION.headers.update({"User-Agent": "Chronicle/1.0 (https://github.com/rmcguiness/chronicle; contact via repo issues)"})


def title_variants(title: str) -> list[str]:
    """Generate search variants from an event title."""
    variants = [title]
    base = title

    # Remove em-dash suffixes: "X — Y" -> "X", then "Y"
    if " — " in title:
        before = title.split(" — ")[0].strip()
        after = title.split(" — ", 1)[1].strip()
        variants.append(before)
        variants.append(after)
        base = before

    # Remove parenthetical qualifiers
    no_parens = re.sub(r"\s*\(.*?\)", "", base).strip()
    if no_parens and no_parens != base:
        variants.append(no_parens)

    # Remove quoted parts: "X — 'What Hath God Wrought'" -> X
    no_quotes = re.sub(r"\s*['\u2018\u2019\u201c\u201d].+?['\u2018\u2019\u201c\u201d]", "", base).strip()
    if no_quotes and no_quotes != base:
        variants.append(no_quotes)

    # "Subject Verbs Object" -> "Subject" (expanded verb list)
    m = re.match(
        r"^(.+?)\s+(?:Constructed|Founded|Established|Built|Completed|Signed|"
        r"Begins|Ends|Erupts|Falls|Invented|Discovered|Appear|Appears|Revolutionizes|"
        r"Abdicates|Unifies|Redraws|Enters|Conquers|Rebuilds|Centralizes|"
        r"Invades|Spreads|Reforms|Defeats|Publishes|Composes|Writes|Destroys|"
        r"Captures|Adopts|Emerges|Collapses|Expands|Launches|Creates|Introduces)\b",
        base, re.IGNORECASE,
    )
    if m:
        variants.append(m.group(1))

    # "Subject Verbs Object" -> full title for search (good for Wikipedia search API)
    # Also try "Subject Object" without the verb
    m = re.match(
        r"^(.+?)\s+(?:Conquers|Enters|Invades|Redraws|Rebuilds|Defeats|Captures)\s+(.+)$",
        base, re.IGNORECASE,
    )
    if m:
        variants.append(f"{m.group(1)} {m.group(2)}")

    # "Event of Subject" -> full phrase, then "Subject" alone
    m = re.match(
        r"^((?:Assassination|Death|Birth|Execution|Coronation|Founding|"
        r"Fall|Rise|Siege|Battle|Treaty|Sack|Discovery|Invention|"
        r"Construction|Signing|Declaration|Dissolution|Unification|"
        r"Liberation|Conquest|Invasion|Domestication|Rebellion|Split) of .+)$",
        base, re.IGNORECASE,
    )
    if m:
        variants.append(m.group(1))
    m = re.match(
        r"^(?:Assassination|Death|Birth|Execution|Coronation|Founding|"
        r"Fall|Rise|Siege|Battle|Treaty|Sack|Discovery|Invention|"
        r"Construction|Signing|Declaration|Dissolution|Unification|"
        r"Liberation|Conquest|Invasion|Domestication|Rebellion|Split) of (.+)$",
        base, re.IGNORECASE,
    )
    if m:
        variants.append(m.group(1))

    # "X Publishes/Composes/Writes Y" -> "Y"
    m = re.match(r"^.+?\s+(?:Publishes|Composes|Writes)\s+(.+)$", base, re.IGNORECASE)
    if m:
        variants.append(m.group(1))

    # "X's Y" -> "Y", and also "X's Y" as-is (possessive titles often match)
    m = re.match(r"^(.+?)['\u2019]s\s+(.+)$", base)
    if m:
        variants.append(f"{m.group(1)}'s {m.group(2)}")
        variants.append(m.group(2))
        variants.append(m.group(1))

    # Remove leading articles
    no_article = re.sub(r"^(The|A|An)\s+", "", base, flags=re.IGNORECASE).strip()
    if no_article and no_article != base:
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

    # Fallback: Wikipedia search API with more results
    for search_query in variants[:3]:
        params = {
            "action": "query",
            "list": "search",
            "srsearch": search_query,
            "srlimit": 3,
            "format": "json",
            "utf8": 1,
        }
        try:
            resp = SESSION.get(WIKIPEDIA_SEARCH_API, params=params, timeout=10)
            time.sleep(REQUEST_DELAY)
            if resp.status_code == 200:
                results = resp.json().get("query", {}).get("search", [])
                for result in results:
                    found_title = result["title"]
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

        for i, row in enumerate(batch):
            event_id = row["id"]
            event_title = row["title"]

            slug, summary = search_wikipedia(event_title)

            if slug:
                print(f"  \u2705 {event_title} \u2192 {slug}")
                updates.append((event_id, slug, summary))
                found += 1
            else:
                print(f"  \u274c {event_title}")
                not_found += 1

            idx = batch_start + i + 1
            if idx % 10 == 0:
                print(f"  ... progress: {idx}/{total} ({found} found so far)")

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

        print(f"\n--- Batch {batch_start // BATCH_SIZE + 1} complete ({batch_start + len(batch)}/{total}) ---\n")

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
