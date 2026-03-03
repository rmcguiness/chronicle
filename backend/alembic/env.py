"""
Alembic env.py — async-compatible via asyncio.run().

Reads DATABASE_URL from environment. Converts asyncpg URL to psycopg2-style
for synchronous migration runs, or uses the sync URL directly.
"""
from __future__ import annotations

import asyncio
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool, text
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

# Ensure the backend/app package is importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Import all models so Alembic can detect schema changes
from app.database import Base  # noqa: F401
from app.models import (  # noqa: F401
    CanvasTile,
    CausalityLink,
    EditLog,
    Event,
    EventOrganization,
    EventPerson,
    Organization,
    Person,
    Perspective,
    Source,
)

# alembic.ini config object
config = context.config

# Setup logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Use metadata from our models for auto-generation
target_metadata = Base.metadata

# Build the async DB URL from environment
def get_url() -> str:
    url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
    )
    return url


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode — emit SQL to stdout."""
    url = get_url().replace("+asyncpg", "")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations using the async engine."""
    url = get_url()
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = url

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
