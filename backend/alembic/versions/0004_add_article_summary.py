"""Add article_summary column to events table

Revision ID: 0004
Revises: 0003
Create Date: 2026-03-08

Adds a TEXT column ``article_summary`` to ``events`` for caching a short
Wikipedia summary directly on the event row (first 500 chars).  This
complements the full ``wikipedia_cache`` table and avoids a join when
only a short blurb is needed.
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("events", sa.Column("article_summary", sa.Text, nullable=True))


def downgrade() -> None:
    op.drop_column("events", "article_summary")
