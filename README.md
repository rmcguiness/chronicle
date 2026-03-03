# Chronicle

**Open-source immutable historical timeline.**  
An infinite canvas where history is explored spatially — time on the X axis, geography on the Y axis, causality as visual connections.

---

## What Makes This Different

- **Multiple perspectives per event** — ranked by evidence quality, not popularity
- **Causality as a first-class visual element** — trace WWI → Versailles → WWII visually
- **Immutable edit log** — every change is recorded forever; nothing is deleted, only superseded
- **Evidence-based, not vote-based** — perspectives ranked by source quality (primary sources, peer review, diversity)

---

## Quick Start

### Prerequisites
- Docker + Docker Compose
- Python 3.11+

### 1. Start the database and search engine

```bash
docker-compose up -d
```

Wait for PostgreSQL and Meilisearch to be healthy:

```bash
docker-compose ps
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — defaults match docker-compose
```

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Seed 500 historical events

```bash
python scripts/seed_events.py
```

This populates ~500 real historical events spanning 3000 BCE–2000 CE, including:
- Rich WWI→WWII causality chains
- Multiple perspectives per event
- Source citations

### 6. Start the API server

```bash
uvicorn app.main:app --reload
```

API is now live at **http://localhost:8000**  
OpenAPI docs: **http://localhost:8000/docs**

> **Note:** The docker-compose maps PostgreSQL to **port 5433** (not 5432) to avoid conflicts
> with local PostgreSQL installations. The `.env` defaults are pre-configured for this.
> If port 5433 is free and you have no local PostgreSQL, you can change it to 5432.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/canvas/tiles` | Spatial+temporal tile query for canvas |
| GET | `/api/events/{slug}` | Full event with perspectives |
| GET | `/api/events/{slug}/connections` | Causality connections |
| GET | `/api/search?q=query` | Full-text search |

### Canvas tile query example

```
GET /api/canvas/tiles?zoom=5&year_min=1914&year_max=1945&bbox=-180,-90,180,90
```

### Search example

```
GET /api/search?q=World+War&limit=10
```

---

## Architecture

```
backend/
├── app/
│   ├── main.py          # FastAPI entry point
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic v2 response schemas
│   ├── database.py      # Async SQLAlchemy engine + session
│   └── routers/
│       ├── canvas.py    # /api/canvas/tiles
│       ├── events.py    # /api/events/{slug}
│       └── search.py    # /api/search
├── alembic/             # Database migrations
├── scripts/
│   └── seed_events.py   # 500-event seed script
├── requirements.txt
└── .env.example
```

**Database:** PostgreSQL 16 + PostGIS (geo) + pgvector (semantic search)  
**Search:** Meilisearch (full-text, instant)  
**API:** FastAPI + SQLAlchemy 2.x async + Pydantic v2

---

## Data Model

- **events** — core historical events with geo, date, importance
- **perspectives** — multiple accounts per event (e.g., Allied vs. German view of WWI)
- **sources** — bibliographic citations supporting each perspective
- **causality_links** — directed graph: cause → effect
- **people** — historical figures linked to events
- **edit_log** — immutable append-only audit trail

---

## License

- Code: MIT
- Data (events, perspectives, sources): ODBL 1.0
- Content text (narratives): CC-BY-SA 4.0

---

*Built as a proof of concept. Full architecture in `docs/architecture.md`.*
