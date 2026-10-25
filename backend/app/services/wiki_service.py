"""
Wikipedia REST API service.

What this module does:
  - Owns ALL communication with the Wikipedia REST API.
  - Fetches page/summary JSON for a given title.
  - Returns a structured WikipediaResult (or None on 404 / missing article).

What this module does NOT do:
  - It does not touch the database (that's the caller's job).
  - It does not handle caching logic (TTL, stale checks, etc.).
  - It does not know about FastAPI, SQLAlchemy, or Chronicle events.

Wikipedia REST API reference:
  https://en.wikipedia.org/api/rest_v1/page/summary/{title}
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional
from urllib.parse import quote

import httpx

logger = logging.getLogger(__name__)

# ── Constants ─────────────────────────────────────────────────────────────────

WIKIPEDIA_SUMMARY_BASE = "https://en.wikipedia.org/api/rest_v1/page/summary"

# Wikipedia requests timeout (connect, read)
_TIMEOUT = httpx.Timeout(5.0, read=10.0)

# Polite User-Agent as recommended by Wikipedia API guidelines
_USER_AGENT = (
    "ChronicleHistoricalTimeline/0.1 "
    "(https://github.com/rmcguiness/chronicle; contact via repo issues)"
)


# ── Result dataclass ──────────────────────────────────────────────────────────


@dataclass
class WikipediaResult:
    """Parsed, minimal representation of a Wikipedia summary response."""

    title: str
    wiki_url: str
    summary: str
    thumbnail_url: Optional[str]
    thumbnail_width: Optional[int]
    thumbnail_height: Optional[int]


# ── Public API ────────────────────────────────────────────────────────────────


async def fetch_wikipedia_summary(title: str) -> Optional[WikipediaResult]:
    """
    Fetch a Wikipedia article summary for the given page title.

    Uses the Wikipedia REST v1 ``/page/summary/{title}`` endpoint.
    Titles are URL-encoded; spaces should be underscores per Wikipedia convention.

    Args:
        title: Wikipedia page title (e.g. ``"French_Revolution"``).

    Returns:
        A :class:`WikipediaResult` on success, or ``None`` when:
        - The title returns a 404 (no matching article).
        - Wikipedia returns a ``"disambiguation"`` type page.
        - Any network or HTTP error occurs (logged, not raised).
    """
    encoded = quote(title.replace(" ", "_"), safe="")
    url = f"{WIKIPEDIA_SUMMARY_BASE}/{encoded}"

    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT, headers={"User-Agent": _USER_AGENT}) as client:
            response = await client.get(url, follow_redirects=True)
    except httpx.TimeoutException:
        logger.warning("Wikipedia request timed out for title=%r", title)
        return None
    except httpx.RequestError as exc:
        logger.warning("Wikipedia request error for title=%r: %s", title, exc)
        return None

    if response.status_code == 404:
        # Normal case — not every event has a Wikipedia article
        logger.debug("Wikipedia 404 for title=%r", title)
        return None

    if response.status_code != 200:
        logger.warning(
            "Wikipedia unexpected status %d for title=%r",
            response.status_code,
            title,
        )
        return None

    try:
        data = response.json()
    except ValueError:
        logger.warning("Wikipedia returned non-JSON for title=%r", title)
        return None

    # Disambiguation pages are not useful — skip them
    if data.get("type") == "disambiguation":
        logger.debug("Wikipedia title=%r is a disambiguation page, skipping", title)
        return None

    extract: str = data.get("extract") or data.get("description") or ""
    wiki_url: str = (
        data.get("content_urls", {}).get("desktop", {}).get("page")
        or data.get("url")
        or url
    )

    # Parse optional thumbnail
    thumbnail = data.get("thumbnail") or {}
    thumbnail_url: Optional[str] = thumbnail.get("source")
    thumbnail_width: Optional[int] = thumbnail.get("width")
    thumbnail_height: Optional[int] = thumbnail.get("height")

    # Use the canonical title returned by Wikipedia, not what we sent
    canonical_title: str = data.get("title") or title

    return WikipediaResult(
        title=canonical_title,
        wiki_url=wiki_url,
        summary=extract,
        thumbnail_url=thumbnail_url,
        thumbnail_width=thumbnail_width,
        thumbnail_height=thumbnail_height,
    )
