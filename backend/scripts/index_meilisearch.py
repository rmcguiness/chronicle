#!/usr/bin/env python3
"""
Chronicle → Meilisearch indexer

Fetches all approved events (+ their perspectives) from PostgreSQL and indexes
them into Meilisearch so search.py can use fast, typo-tolerant full-text search.

Run from backend/ directory:
    DATABASE_URL="postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle" \
    python scripts/index_meilisearch.py
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from typing import Any

import asyncpg
import meilisearch

# ─── Config ──────────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

MEILI_URL = os.getenv("MEILI_URL", "http://localhost:7700")
MEILI_KEY = os.getenv("MEILI_MASTER_KEY", "chronicle_meili_master_key")
INDEX_NAME = "events"
BATCH_SIZE = 100

# ─── Meilisearch settings for historical search ───────────────────────────────
SEARCH_SETTINGS = {
    "searchableAttributes": [
        "title",
        "title_alt",
        "geo_modern",
        "geo_era_label",
        "tags",
        "perspective_excerpts",
        "category",
    ],
    "filterableAttributes": [
        "category",
        "year_approx",
        "importance_score",
        "review_status",
        "is_bce",
    ],
    "sortableAttributes": [
        "importance_score",
        "year_approx",
    ],
    "rankingRules": [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
    ],
    "typoTolerance": {
        "enabled": True,
        "minWordSizeForTypos": {
            "oneTypo": 4,
            "twoTypos": 8,
        },
    },
    "pagination": {
        "maxTotalHits": 1000,
    },
    "displayedAttributes": [
        "id",
        "slug",
        "title",
        "title_alt",
        "year_approx",
        "geo_modern",
        "geo_era_label",
        "category",
        "importance_score",
        "is_bce",
        "tags",
        "perspective_excerpts",
    ],
}


async def fetch_events(conn: asyncpg.Connection) -> list[dict[str, Any]]:
    """Fetch all approved events with their perspectives from PostgreSQL."""
    print("Fetching events from PostgreSQL...")

    rows = await conn.fetch(
        """
        SELECT
            e.id::text,
            e.slug,
            e.title,
            e.title_alt,
            e.year_approx,
            e.geo_modern,
            e.geo_era_label,
            e.event_category AS category,
            e.importance_score,
            e.tags,
            e.is_bce,
            e.review_status,
            ARRAY_AGG(
                LEFT(p.narrative, 500)
                ORDER BY p.evidence_score DESC NULLS LAST
            ) FILTER (WHERE p.narrative IS NOT NULL) AS narrative_excerpts,
            ARRAY_AGG(p.summary ORDER BY p.evidence_score DESC NULLS LAST)
                FILTER (WHERE p.summary IS NOT NULL) AS summaries,
            ARRAY_AGG(p.label ORDER BY p.evidence_score DESC NULLS LAST)
                FILTER (WHERE p.label IS NOT NULL) AS perspective_labels
        FROM events e
        LEFT JOIN perspectives p ON p.event_id = e.id
        WHERE e.review_status = 'approved'
        GROUP BY e.id
        ORDER BY e.importance_score DESC NULLS LAST, e.year_approx
        """
    )

    documents = []
    for row in rows:
        # Combine narrative excerpts + summaries into searchable text blobs
        perspective_parts = []
        if row["narrative_excerpts"]:
            perspective_parts.extend(row["narrative_excerpts"])
        if row["summaries"]:
            perspective_parts.extend(row["summaries"])
        if row["perspective_labels"]:
            perspective_parts.extend(row["perspective_labels"])

        doc = {
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "title_alt": list(row["title_alt"]) if row["title_alt"] else [],
            "year_approx": row["year_approx"] or 0,
            "geo_modern": row["geo_modern"] or "",
            "geo_era_label": row["geo_era_label"] or "",
            "category": row["category"] or "unknown",
            "importance_score": float(row["importance_score"] or 0.5),
            "tags": list(row["tags"]) if row["tags"] else [],
            "is_bce": bool(row["is_bce"]),
            "review_status": row["review_status"],
            "perspective_excerpts": " ".join(perspective_parts) if perspective_parts else "",
        }
        documents.append(doc)

    print(f"  → Fetched {len(documents)} approved events")
    return documents


def configure_index(client: meilisearch.Client) -> meilisearch.index.Index:
    """Create or get the events index and apply settings."""
    print(f"Configuring Meilisearch index '{INDEX_NAME}'...")

    # Create index if it doesn't exist (primary key = id)
    try:
        index = client.get_index(INDEX_NAME)
        print(f"  → Index '{INDEX_NAME}' already exists")
    except Exception:
        task = client.create_index(INDEX_NAME, {"primaryKey": "id"})
        client.wait_for_task(task.task_uid, timeout_in_ms=30_000)
        index = client.get_index(INDEX_NAME)
        print(f"  → Created index '{INDEX_NAME}'")

    # Apply settings
    task = index.update_settings(SEARCH_SETTINGS)
    client.wait_for_task(task.task_uid, timeout_in_ms=30_000)
    print("  → Settings applied")
    return index


def index_documents(
    index: meilisearch.index.Index,
    client: meilisearch.Client,
    documents: list[dict[str, Any]],
) -> None:
    """Index documents in batches."""
    total = len(documents)
    print(f"Indexing {total} documents in batches of {BATCH_SIZE}...")

    task_uids = []
    for i in range(0, total, BATCH_SIZE):
        batch = documents[i : i + BATCH_SIZE]
        task = index.add_documents(batch)
        task_uids.append(task.task_uid)
        print(f"  → Queued batch {i // BATCH_SIZE + 1} ({len(batch)} docs, task {task.task_uid})")

    print("Waiting for all indexing tasks to complete...")
    for uid in task_uids:
        result = client.wait_for_task(uid, timeout_in_ms=120_000)
        if result.status == "failed":
            print(f"  ✗ Task {uid} failed: {result.error}", file=sys.stderr)
        else:
            print(f"  ✓ Task {uid} complete ({result.status})")

    stats = index.get_stats()
    print(f"\nIndex stats: {stats.number_of_documents} documents indexed")


async def main() -> None:
    print("Chronicle → Meilisearch Indexer")
    print("=" * 40)

    # Connect to Meilisearch
    print(f"Connecting to Meilisearch at {MEILI_URL}...")
    client = meilisearch.Client(MEILI_URL, MEILI_KEY)
    health = client.health()
    print(f"  → Meilisearch health: {health}")

    # Connect to PostgreSQL
    print(f"Connecting to PostgreSQL...")
    conn = await asyncpg.connect(PG_DSN)
    print("  → PostgreSQL connected")

    try:
        documents = await fetch_events(conn)
    finally:
        await conn.close()

    if not documents:
        print("No approved events found — have you run the seed script?", file=sys.stderr)
        sys.exit(1)

    index = configure_index(client)
    index_documents(index, client, documents)

    print("\n✅ Indexing complete!")
    print(f"   Run: curl 'http://localhost:7700/indexes/events/stats'")
    print(f"   to verify.")


if __name__ == "__main__":
    asyncio.run(main())
