"""Add wikipedia_cache table for event Wikipedia summary caching

Revision ID: 0002
Revises: 0001
Create Date: 2026-03-04

What this migration does:
  - Creates the ``wikipedia_cache`` table (keyed by event slug).
  - Stores the Wikipedia title, canonical URL, plain-text extract,
    thumbnail metadata, and a ``wiki_fetched_at`` timestamp.
  - Adds an index on ``wiki_fetched_at`` for efficient stale-cache queries.

What this migration does NOT do:
  - It does not add foreign key constraints to ``events.slug``; the cache
    can outlive an event deletion and is harmless if orphaned.
  - It does not pre-populate any rows (rows are created on first access).
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "wikipedia_cache",
        # Primary key — one cache row per event slug
        sa.Column("slug", sa.Text, primary_key=True, nullable=False),
        # Wikipedia page title (may differ from event slug after redirect resolution)
        sa.Column("wiki_title", sa.Text, nullable=True),
        # Canonical desktop URL for the Wikipedia article
        sa.Column("wiki_url", sa.Text, nullable=True),
        # Plain-text extract from the /page/summary endpoint
        sa.Column("wiki_summary", sa.Text, nullable=True),
        # Thumbnail metadata
        sa.Column("wiki_thumbnail_url", sa.Text, nullable=True),
        sa.Column("wiki_thumbnail_width", sa.Integer, nullable=True),
        sa.Column("wiki_thumbnail_height", sa.Integer, nullable=True),
        # Timestamp of the last fetch attempt (NULL = never attempted)
        sa.Column(
            "wiki_fetched_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )
    op.create_index(
        "idx_wikipedia_cache_fetched",
        "wikipedia_cache",
        ["wiki_fetched_at"],
    )


def downgrade() -> None:
    op.drop_index("idx_wikipedia_cache_fetched", table_name="wikipedia_cache")
    op.drop_table("wikipedia_cache")
