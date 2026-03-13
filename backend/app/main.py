"""
Chronicle API — FastAPI entry point.

Start with:
    uvicorn app.main:app --reload
"""
from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import AsyncSessionLocal
from app.routers import canvas, causality, events, people, search
from app.routers.submit import submit_router, admin_router

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup + shutdown lifecycle."""
    logger.info("Chronicle API starting up …")
    # Verify DB is reachable on startup
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        logger.info("Database connection OK")
    except Exception as exc:
        logger.error("Database connection FAILED: %s", exc)
    yield
    logger.info("Chronicle API shutting down …")


app = FastAPI(
    title="Chronicle API",
    description="Immutable historical timeline — open source, multi-perspective.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev servers
cors_origins = os.getenv(
    "CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────
app.include_router(canvas.router)
app.include_router(causality.router)
app.include_router(events.router)
app.include_router(people.router)
app.include_router(search.router)
app.include_router(submit_router)
app.include_router(admin_router)


# ── Health endpoint ───────────────────────
@app.get("/api/health", tags=["health"])
async def health():
    """
    GET /api/health
    Returns: { status, db, events_count }
    """
    from sqlalchemy import select, func
    from app.models import Event

    db_status = "error"
    events_count = 0
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(func.count()).select_from(Event).where(
                    Event.review_status == "approved"
                )
            )
            events_count = result.scalar() or 0
            db_status = "ok"
    except Exception as exc:
        logger.error("Health check DB error: %s", exc)

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "db": db_status,
        "events_count": events_count,
    }


@app.get("/", tags=["root"])
async def root():
    return {
        "name": "Chronicle API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/api/health",
    }
