"""Initial schema — events, perspectives, sources, causality_links, people, orgs, edit_log

Revision ID: 0001
Revises:
Create Date: 2026-03-02
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from geoalchemy2 import Geometry
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── Extensions ───────────────────────────────────────────────────────────
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
    op.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
    # pgvector — only if installed; skip gracefully
    op.execute(
        """
        DO $$
        BEGIN
            CREATE EXTENSION IF NOT EXISTS vector;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'pgvector not available, skipping';
        END;
        $$
        """
    )

    # ── EVENTS ───────────────────────────────────────────────────────────────
    op.create_table(
        "events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("slug", sa.Text, nullable=False, unique=True),
        sa.Column("title", sa.Text, nullable=False),
        sa.Column("title_alt", postgresql.ARRAY(sa.Text), nullable=True),
        # Dates
        sa.Column("date_exact", sa.Date, nullable=True),
        sa.Column("date_earliest", sa.Date, nullable=False),
        sa.Column("date_latest", sa.Date, nullable=False),
        sa.Column("date_confidence", sa.Float, nullable=True),
        sa.Column("date_circa", sa.Boolean, server_default="false"),
        sa.Column("date_disputed", sa.Boolean, server_default="false"),
        sa.Column("date_notes", sa.Text, nullable=True),
        sa.Column("is_bce", sa.Boolean, server_default="false"),
        sa.Column("year_approx", sa.Integer, nullable=True),
        # Geography
        sa.Column("geo_point", Geometry("POINT", srid=4326), nullable=True),
        sa.Column("geo_region", Geometry("POLYGON", srid=4326), nullable=True),
        sa.Column("geo_era_label", sa.Text, nullable=True),
        sa.Column("geo_modern", sa.Text, nullable=True),
        # Canvas rendering
        sa.Column("importance_score", sa.Float, server_default="0.5"),
        sa.Column("zoom_min", sa.Integer, server_default="1"),
        sa.Column("zoom_max", sa.Integer, server_default="10"),
        sa.Column("event_category", sa.Text, nullable=True),
        sa.Column("tags", postgresql.ARRAY(sa.Text), nullable=True),
        # Provenance
        sa.Column("version", sa.Integer, server_default="1"),
        sa.Column("content_hash", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("created_by", sa.Text, nullable=False),
        sa.Column("review_status", sa.Text, server_default="'pending'"),
        sa.Column("wikidata_id", sa.Text, nullable=True),
        sa.Column("wikipedia_slug", sa.Text, nullable=True),
        # Constraints
        sa.CheckConstraint("importance_score BETWEEN 0 AND 1", name="ck_events_importance_score"),
        sa.CheckConstraint(
            "review_status IN ('pending','approved','flagged','rejected')",
            name="ck_events_review_status",
        ),
    )
    # Spatial index
    op.create_index("idx_events_geo", "events", ["geo_point"], postgresql_using="gist")
    op.create_index("idx_events_year", "events", ["year_approx"])
    op.create_index("idx_events_date_range", "events", ["date_earliest", "date_latest"])
    op.create_index("idx_events_zoom_importance", "events", ["zoom_min", sa.text("importance_score DESC")])
    op.create_index("idx_events_category", "events", ["event_category"])
    op.create_index("idx_events_tags", "events", ["tags"], postgresql_using="gin")
    op.execute(
        """
        CREATE INDEX idx_events_fts ON events
        USING GIN (to_tsvector('english', title || ' ' || COALESCE(date_notes, '') || ' ' || COALESCE(geo_modern, '')))
        """
    )

    # ── PERSPECTIVES ──────────────────────────────────────────────────────────
    op.create_table(
        "perspectives",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("event_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("events.id", ondelete="CASCADE"), nullable=False),
        sa.Column("label", sa.Text, nullable=False),
        sa.Column("culture_code", sa.Text, nullable=True),
        sa.Column("era_written", sa.Text, nullable=True),
        sa.Column("viewpoint_type", sa.Text, nullable=True),
        sa.Column("language", sa.Text, server_default="'en'"),
        sa.Column("narrative", sa.Text, nullable=False),
        sa.Column("summary", sa.Text, nullable=True),
        sa.Column("key_claims", postgresql.JSONB, nullable=True),
        sa.Column("evidence_score", sa.Float, nullable=True),
        sa.Column("evidence_factors", postgresql.JSONB, nullable=True),
        sa.Column("last_scored_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("created_by", sa.Text, nullable=False),
        sa.Column("version", sa.Integer, server_default="1"),
        sa.Column("content_hash", sa.Text, nullable=True),
        sa.Column("upvotes", sa.Integer, server_default="0"),
        sa.Column("downvotes", sa.Integer, server_default="0"),
        sa.Column("community_score", sa.Float, server_default="0.5"),
        sa.CheckConstraint(
            "evidence_score IS NULL OR evidence_score BETWEEN 0 AND 1",
            name="ck_perspectives_evidence_score",
        ),
    )
    op.create_index("idx_perspectives_event", "perspectives", ["event_id"])
    op.create_index("idx_perspectives_score", "perspectives", ["event_id", sa.text("evidence_score DESC")])
    op.execute(
        "CREATE INDEX idx_perspectives_fts ON perspectives USING GIN (to_tsvector('english', narrative))"
    )

    # ── SOURCES ───────────────────────────────────────────────────────────────
    op.create_table(
        "sources",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("perspective_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("perspectives.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.Text, nullable=False),
        sa.Column("author", sa.Text, nullable=True),
        sa.Column("editors", postgresql.ARRAY(sa.Text), nullable=True),
        sa.Column("publication", sa.Text, nullable=True),
        sa.Column("publisher", sa.Text, nullable=True),
        sa.Column("publication_date", sa.Date, nullable=True),
        sa.Column("isbn", sa.Text, nullable=True),
        sa.Column("doi", sa.Text, nullable=True),
        sa.Column("page_numbers", sa.Text, nullable=True),
        sa.Column("quote", sa.Text, nullable=True),
        sa.Column("source_type", sa.Text, nullable=False),
        sa.Column("reliability_tier", sa.Integer, nullable=True),
        sa.Column("peer_reviewed", sa.Boolean, server_default="false"),
        sa.Column("language", sa.Text, server_default="'en'"),
        sa.Column("original_url", sa.Text, nullable=True),
        sa.Column("content_hash", sa.Text, nullable=True, unique=True),
        sa.Column("archive_url", sa.Text, nullable=True),
        sa.Column("ipfs_cid", sa.Text, nullable=True),
        sa.Column("local_mirror_path", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint(
            "source_type IN ('primary','secondary','tertiary','journalistic','oral','artifact')",
            name="ck_sources_source_type",
        ),
        sa.CheckConstraint(
            "reliability_tier IS NULL OR reliability_tier BETWEEN 1 AND 4",
            name="ck_sources_tier",
        ),
    )
    op.create_index("idx_sources_perspective", "sources", ["perspective_id"])
    op.create_index("idx_sources_hash", "sources", ["content_hash"])
    op.create_index("idx_sources_tier", "sources", ["reliability_tier"])

    # ── CAUSALITY LINKS ───────────────────────────────────────────────────────
    op.create_table(
        "causality_links",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("cause_event_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("events.id"), nullable=False),
        sa.Column("effect_event_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("events.id"), nullable=False),
        sa.Column("link_type", sa.Text, server_default="'direct'"),
        sa.Column("strength", sa.Float, server_default="0.5"),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("source_ids", postgresql.ARRAY(postgresql.UUID(as_uuid=True)), nullable=True),
        sa.Column("created_by", sa.Text, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("review_status", sa.Text, server_default="'approved'"),
        sa.CheckConstraint("cause_event_id != effect_event_id", name="ck_causality_no_self"),
        sa.CheckConstraint(
            "link_type IN ('direct','indirect','contributing','disputed')",
            name="ck_causality_link_type",
        ),
        sa.CheckConstraint("strength BETWEEN 0 AND 1", name="ck_causality_strength"),
        sa.CheckConstraint(
            "review_status IN ('pending','approved','flagged','rejected')",
            name="ck_causality_review_status",
        ),
        sa.UniqueConstraint("cause_event_id", "effect_event_id", name="uq_causality_pair"),
    )
    op.create_index("idx_causality_cause", "causality_links", ["cause_event_id"])
    op.create_index("idx_causality_effect", "causality_links", ["effect_event_id"])

    # ── PEOPLE ────────────────────────────────────────────────────────────────
    op.create_table(
        "people",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("aliases", postgresql.ARRAY(sa.Text), nullable=True),
        sa.Column("birth_year", sa.Integer, nullable=True),
        sa.Column("birth_year_circa", sa.Boolean, server_default="false"),
        sa.Column("death_year", sa.Integer, nullable=True),
        sa.Column("death_year_circa", sa.Boolean, server_default="false"),
        sa.Column("birth_location", Geometry("POINT", srid=4326), nullable=True),
        sa.Column("nationalities", postgresql.ARRAY(sa.Text), nullable=True),
        sa.Column("roles", postgresql.ARRAY(sa.Text), nullable=True),
        sa.Column("gender", sa.Text, nullable=True),
        sa.Column("wikidata_id", sa.Text, nullable=True, unique=True),
        sa.Column("wikipedia_slug", sa.Text, nullable=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("image_url", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_people_wikidata", "people", ["wikidata_id"])
    op.execute(
        "CREATE INDEX idx_people_name ON people USING GIN (to_tsvector('english', name))"
    )

    # ── ORGANIZATIONS ─────────────────────────────────────────────────────────
    op.create_table(
        "organizations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("aliases", postgresql.ARRAY(sa.Text), nullable=True),
        sa.Column("org_type", sa.Text, nullable=True),
        sa.Column("founded_year", sa.Integer, nullable=True),
        sa.Column("dissolved_year", sa.Integer, nullable=True),
        sa.Column("headquarters", Geometry("POINT", srid=4326), nullable=True),
        sa.Column("wikidata_id", sa.Text, nullable=True, unique=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # ── JUNCTION TABLES ───────────────────────────────────────────────────────
    op.create_table(
        "event_people",
        sa.Column("event_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("events.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("person_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("people.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("role", sa.Text, primary_key=True),
        sa.Column("role_notes", sa.Text, nullable=True),
    )

    op.create_table(
        "event_organizations",
        sa.Column("event_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("events.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("org_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("organizations.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("role", sa.Text, primary_key=True),
    )

    # ── EDIT LOG (append-only) ────────────────────────────────────────────────
    op.create_table(
        "edit_log",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True,
                  server_default=sa.text("gen_random_uuid()")),
        sa.Column("entity_type", sa.Text, nullable=False),
        sa.Column("entity_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("action", sa.Text, nullable=False),
        sa.Column("diff", postgresql.JSONB, nullable=True),
        sa.Column("previous_hash", sa.Text, nullable=True),
        sa.Column("new_hash", sa.Text, nullable=True),
        sa.Column("actor_id", sa.Text, nullable=False),
        sa.Column("actor_type", sa.Text, nullable=False),
        sa.Column("reason", sa.Text, nullable=True),
        sa.Column("ip_hash", sa.Text, nullable=True),
        sa.Column("parent_log_id", postgresql.UUID(as_uuid=True),
                  sa.ForeignKey("edit_log.id"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now(), nullable=False),
    )
    op.create_index("idx_edit_log_entity", "edit_log", ["entity_type", "entity_id"])
    op.create_index("idx_edit_log_actor", "edit_log", ["actor_id"])
    op.create_index("idx_edit_log_time", "edit_log", ["created_at"])

    # Append-only enforcement trigger
    op.execute(
        """
        CREATE OR REPLACE FUNCTION prevent_edit_log_mutation()
        RETURNS TRIGGER AS $$
        BEGIN
            RAISE EXCEPTION 'edit_log is append-only — no UPDATE or DELETE allowed';
        END;
        $$ LANGUAGE plpgsql
        """
    )
    op.execute(
        """
        CREATE TRIGGER enforce_edit_log_immutability
        BEFORE UPDATE OR DELETE ON edit_log
        FOR EACH ROW EXECUTE FUNCTION prevent_edit_log_mutation()
        """
    )

    # ── CANVAS TILE CACHE ─────────────────────────────────────────────────────
    op.create_table(
        "canvas_tiles",
        sa.Column("tile_key", sa.Text, primary_key=True),
        sa.Column("zoom_level", sa.Integer, nullable=False),
        sa.Column("time_start", sa.Integer, nullable=False),
        sa.Column("time_end", sa.Integer, nullable=False),
        sa.Column("h3_index", sa.Text, nullable=False),
        sa.Column("event_count", sa.Integer, nullable=True),
        sa.Column("payload", postgresql.JSONB, nullable=False),
        sa.Column("computed_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index("idx_canvas_tiles_zoom_time", "canvas_tiles",
                    ["zoom_level", "time_start", "time_end"])

    # ── updated_at trigger for events and perspectives ─────────────────────────
    op.execute(
        """
        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
        """
    )
    for table in ("events", "perspectives"):
        op.execute(
            f"""
            CREATE TRIGGER trg_updated_at_{table}
            BEFORE UPDATE ON {table}
            FOR EACH ROW EXECUTE FUNCTION update_updated_at()
            """
        )


def downgrade() -> None:
    op.execute("DROP TRIGGER IF EXISTS trg_updated_at_perspectives ON perspectives")
    op.execute("DROP TRIGGER IF EXISTS trg_updated_at_events ON events")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at()")
    op.execute("DROP TRIGGER IF EXISTS enforce_edit_log_immutability ON edit_log")
    op.execute("DROP FUNCTION IF EXISTS prevent_edit_log_mutation()")
    op.drop_table("canvas_tiles")
    op.drop_table("edit_log")
    op.drop_table("event_organizations")
    op.drop_table("event_people")
    op.drop_table("organizations")
    op.drop_table("people")
    op.drop_table("causality_links")
    op.drop_table("sources")
    op.drop_table("perspectives")
    op.drop_table("events")
