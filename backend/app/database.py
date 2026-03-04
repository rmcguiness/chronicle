"""
Async SQLAlchemy engine + session factory.
"""
from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)


async def _init_asyncpg_connection(conn) -> None:
    """Register safe text codecs for PostgreSQL date types.

    Python's datetime.date only supports year >= 1, so BCE dates
    (e.g. '2560-01-01 BC') crash asyncpg's default decoder.
    Returning them as plain strings avoids the ordinal-must-be->=1 error.
    """
    await conn.set_type_codec(
        "date",
        encoder=str,
        decoder=str,
        schema="pg_catalog",
        format="text",
    )
    await conn.set_type_codec(
        "timestamp",
        encoder=str,
        decoder=str,
        schema="pg_catalog",
        format="text",
    )
    await conn.set_type_codec(
        "timestamptz",
        encoder=str,
        decoder=str,
        schema="pg_catalog",
        format="text",
    )


engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    connect_args={"init": _init_asyncpg_connection},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency — yields a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
