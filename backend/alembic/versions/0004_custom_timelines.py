"""
Add custom_timelines table for shareable public timelines.

Revision ID: 0004
Revises: 0003
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "custom_timelines",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("event_slugs", ARRAY(sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("is_public", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("share_token", sa.Text(), unique=True, nullable=False),
    )
    op.create_index("idx_custom_timelines_share_token", "custom_timelines", ["share_token"])
    op.create_index("idx_custom_timelines_public", "custom_timelines", ["is_public", "created_at"])


def downgrade() -> None:
    op.drop_index("idx_custom_timelines_public")
    op.drop_index("idx_custom_timelines_share_token")
    op.drop_table("custom_timelines")
