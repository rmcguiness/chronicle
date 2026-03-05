"""
Add embedding vector(384) column to events table for semantic search.

Revision ID: 0003
Revises: 0002
"""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # pgvector extension should already be installed
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.add_column("events", sa.Column("embedding", sa.Text(), nullable=True))
    # Use raw SQL to set the correct vector type since SQLAlchemy doesn't know pgvector
    op.execute("ALTER TABLE events ALTER COLUMN embedding TYPE vector(384) USING embedding::vector(384)")
    # IVFFlat index for cosine similarity search
    op.execute(
        "CREATE INDEX idx_events_embedding ON events "
        "USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_events_embedding")
    op.drop_column("events", "embedding")
