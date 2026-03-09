"""
Populate wikipedia_slug and article_summary for events missing them.

For each event without a wikipedia_slug:
  1. Search Wikipedia's search API for the event title.
  2. If the top result has a title similarity > 0.7 (via SequenceMatcher), save
     the slug (title with spaces replaced by underscores).
  3. Fetch the Wikipedia summary and cache the first 500 chars in article_summary.

Rate-limited to 100ms between requests to be polite to Wikipedia.

Usage:
  docker exec chronicle-backend-1 python scripts/populate_wikipedia_slugs.py
  # or locally:
  python scripts/populate_wikipedia_slugs.py
"""
from __future__ import annotations

import logging
import os
import time
from difflib import SequenceMatcher

import psycopg2
import requests

# ── Config ────────────────────────────────────────────────────────────────────

SEARCH_API = "https://en.wikipedia.org/w/api.php"
SUMMARY_API = "https://en.wikipedia.org/api/rest_v1/page/summary"
RATE_LIMIT_SECS = 0.1  # 100ms between requests
SIMILARITY_THRESHOLD = 0.7
SUMMARY_MAX_CHARS = 500

USER_AGENT = (
    "ChronicleHistoricalTimeline/0.1 "
    "(https://github.com/chronicle; contact via repo issues)"
)
HEADERS = {"User-Agent": USER_AGENT}

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def get_sync_db_url() -> str:
    """Build a psycopg2-compatible connection string from environment."""
    url = os.getenv("DATABASE_URL_SYNC", "")
    if url:
        return url
    async_url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
    )
    return async_url.replace("postgresql+asyncpg://", "postgresql://")


def title_similarity(a: str, b: str) -> float:
    """Return SequenceMatcher ratio between two titles (case-insensitive)."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def search_wikipedia(title: str) -> str | None:
    """
    Search Wikipedia for a title and return the best-matching page title.

    Returns None if no result meets the similarity threshold.
    """
    params = {
        "action": "query",
        "list": "search",
        "srsearch": title,
        "format": "json",
        "srlimit": 1,
    }
    try:
        resp = requests.get(SEARCH_API, params=params, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        results = resp.json().get("query", {}).get("search", [])
        if not results:
            return None
        hit_title = results[0]["title"]
        sim = title_similarity(title, hit_title)
        if sim >= SIMILARITY_THRESHOLD:
            return hit_title
        logger.debug(
            "Low similarity %.2f for %r -> %r, skipping", sim, title, hit_title
        )
        return None
    except requests.RequestException as exc:
        logger.warning("Wikipedia search failed for %r: %s", title, exc)
        return None


def fetch_summary(wiki_title: str) -> str | None:
    """Fetch the plain-text summary for a Wikipedia page title."""
    slug = wiki_title.replace(" ", "_")
    url = f"{SUMMARY_API}/{requests.utils.quote(slug, safe='')}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        data = resp.json()
        if data.get("type") == "disambiguation":
            return None
        return (data.get("extract") or "")[:SUMMARY_MAX_CHARS] or None
    except requests.RequestException as exc:
        logger.warning("Wikipedia summary failed for %r: %s", wiki_title, exc)
        return None


def main() -> None:
    """Populate wikipedia_slug and article_summary for events missing them."""
    conn = psycopg2.connect(get_sync_db_url())
    conn.autocommit = False
    cur = conn.cursor()

    # Fetch events missing wikipedia_slug
    cur.execute(
        "SELECT id, title FROM events WHERE wikipedia_slug IS NULL ORDER BY title"
    )
    rows = cur.fetchall()
    logger.info("Found %d events without wikipedia_slug", len(rows))

    updated = 0
    for event_id, event_title in rows:
        wiki_title = search_wikipedia(event_title)
        time.sleep(RATE_LIMIT_SECS)

        if wiki_title is None:
            logger.debug("No Wikipedia match for %r", event_title)
            continue

        wiki_slug = wiki_title.replace(" ", "_")
        summary = fetch_summary(wiki_title)
        time.sleep(RATE_LIMIT_SECS)

        cur.execute(
            """
            UPDATE events
            SET wikipedia_slug = %s,
                article_summary = %s
            WHERE id = %s
            """,
            (wiki_slug, summary, event_id),
        )
        updated += 1
        if updated % 25 == 0:
            conn.commit()
            logger.info("Progress: %d/%d events updated", updated, len(rows))

    conn.commit()
    cur.close()
    conn.close()
    logger.info("Done. Updated %d of %d events.", updated, len(rows))


if __name__ == "__main__":
    main()
