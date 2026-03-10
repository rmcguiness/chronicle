"""
Add pending_events table for public event submission queue (FEAT-02).

Events submitted via POST /api/admin/submit land here first.
An admin must approve (copies to events table) or reject them.

Revision ID: a4e3ef3f6da4
Revises: 0003
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import UUID

revision = "a4e3ef3f6da4"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "pending_events",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
            nullable=False,
        ),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("year_approx", sa.Integer(), nullable=False),
        sa.Column("lat", sa.Float(), nullable=False),
        sa.Column("lng", sa.Float(), nullable=False),
        sa.Column("category", sa.Text(), nullable=False),
        sa.Column("importance_score", sa.Float(), nullable=False, server_default="0.5"),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column(
            "submitted_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "importance_score BETWEEN 0.1 AND 1.0",
            name="ck_pending_events_importance_score",
        ),
        sa.CheckConstraint(
            "status IN ('pending', 'approved', 'rejected')",
            name="ck_pending_events_status",
        ),
    )
    op.create_index("idx_pending_events_status", "pending_events", ["status"])


def downgrade() -> None:
    op.drop_index("idx_pending_events_status", table_name="pending_events")
    op.drop_table("pending_events")
