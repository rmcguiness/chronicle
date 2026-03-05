"""
Generate semantic embeddings for all events in the Chronicle database.

Uses sentence-transformers (all-MiniLM-L6-v2, 384-dim) to create embeddings
from event metadata. Idempotent — skips events that already have embeddings.

Owns: embedding generation pipeline.
Does NOT own: search logic, API endpoints, model serving.
"""
from __future__ import annotations

import logging
import os
import sys

import psycopg2
from sentence_transformers import SentenceTransformer

# ── Constants ─────────────────────────────────────────────────────────────────
MODEL_NAME = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384
BATCH_SIZE = 64

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


def get_sync_db_url() -> str:
    """Build a psycopg2-compatible connection string from environment."""
    url = os.getenv("DATABASE_URL_SYNC", "")
    if url:
        return url
    # Fall back to async URL, converting driver
    async_url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
    )
    return async_url.replace("postgresql+asyncpg://", "postgresql://")


def build_text(row: tuple) -> str:
    """Build the text string to embed from an event row."""
    title, description, category, year_approx, region = row[1], row[2], row[3], row[4], row[5]
    parts = []
    if title:
        parts.append(title)
    if description:
        parts.append(description)
    if category:
        parts.append(f"Category: {category}")
    if year_approx is not None:
        parts.append(f"Year: {year_approx}")
    if region:
        parts.append(f"Region: {region}")
    return ". ".join(parts) + "."


def main() -> None:
    """Generate embeddings for events missing them."""
    logger.info("Loading model: %s", MODEL_NAME)
    model = SentenceTransformer(MODEL_NAME)

    db_url = get_sync_db_url()
    logger.info("Connecting to database...")
    conn = psycopg2.connect(db_url)

    try:
        cur = conn.cursor()

        # Fetch events without embeddings
        # Note: description comes from perspectives narrative (first one), or empty
        cur.execute("""
            SELECT e.id, e.title,
                   COALESCE((SELECT p.narrative FROM perspectives p WHERE p.event_id = e.id LIMIT 1), ''),
                   e.event_category, e.year_approx, e.geo_modern
            FROM events e
            WHERE e.embedding IS NULL
            ORDER BY e.importance_score DESC
        """)
        rows = cur.fetchall()

        if not rows:
            logger.info("All events already have embeddings. Nothing to do.")
            return

        logger.info("Generating embeddings for %d events...", len(rows))

        # Process in batches
        for i in range(0, len(rows), BATCH_SIZE):
            batch = rows[i : i + BATCH_SIZE]
            texts = [build_text(row) for row in batch]
            embeddings = model.encode(texts, show_progress_bar=False)

            for row, emb in zip(batch, embeddings):
                event_id = row[0]
                vec_str = "[" + ",".join(str(float(x)) for x in emb) + "]"
                cur.execute(
                    "UPDATE events SET embedding = %s::vector WHERE id = %s",
                    (vec_str, event_id),
                )

            conn.commit()
            logger.info("  Processed %d / %d", min(i + BATCH_SIZE, len(rows)), len(rows))

        logger.info("Done! Generated embeddings for %d events.", len(rows))

    finally:
        conn.close()


if __name__ == "__main__":
    main()
