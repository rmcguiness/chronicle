"""
Add lessons table for teaching/classroom mode.

Revision ID: 0005
Revises: 0004
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, ARRAY

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "lessons",
        sa.Column("id", UUID(as_uuid=True), server_default=sa.text("gen_random_uuid()"), primary_key=True),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("subject", sa.Text(), nullable=False),
        sa.Column("grade_level", sa.Text(), nullable=False),
        sa.Column("event_slugs", ARRAY(sa.Text()), nullable=False),
        sa.Column("guiding_questions", ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("learning_objectives", ARRAY(sa.Text()), nullable=False, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_lessons_grade_level", "lessons", ["grade_level"])
    op.create_index("idx_lessons_subject", "lessons", ["subject"])


def downgrade() -> None:
    op.drop_table("lessons")
