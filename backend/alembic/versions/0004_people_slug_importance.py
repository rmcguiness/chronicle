"""Add slug, nationality, occupation, importance_score, bio to people table

Revision ID: 0004
Revises: 0003
Create Date: 2026-03-06
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
    op.add_column("people", sa.Column("slug", sa.Text, nullable=True, unique=True))
    op.add_column("people", sa.Column("nationality", sa.Text, nullable=True))
    op.add_column("people", sa.Column("occupation", sa.Text, nullable=True))
    op.add_column("people", sa.Column("importance_score", sa.Float, server_default="0.5", nullable=False))
    op.add_column("people", sa.Column("bio", sa.Text, nullable=True))

    # Backfill slug from name for any existing rows
    op.execute(
        "UPDATE people SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '.', '')) WHERE slug IS NULL"
    )
    op.alter_column("people", "slug", nullable=False)

    op.create_index("idx_people_slug", "people", ["slug"])
    op.create_index("idx_people_importance", "people", ["importance_score"])
    op.create_check_constraint("ck_people_importance_score", "people", "importance_score BETWEEN 0 AND 1")


def downgrade() -> None:
    op.drop_constraint("ck_people_importance_score", "people", type_="check")
    op.drop_index("idx_people_importance", table_name="people")
    op.drop_index("idx_people_slug", table_name="people")
    op.drop_column("people", "bio")
    op.drop_column("people", "importance_score")
    op.drop_column("people", "occupation")
    op.drop_column("people", "nationality")
    op.drop_column("people", "slug")
