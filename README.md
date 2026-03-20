# Chronicle

![CI](https://github.com/rmcguiness/chronicle/actions/workflows/ci.yml/badge.svg)

**An open-source infinite canvas for exploring history — time on the X axis, causality as edges, events as nodes you can zoom into forever.**

## What is this?

Chronicle is a visual, network-graph timeline of world history. Instead of a flat list of dates, events are nodes on an infinite canvas connected by causality links — trace the path from the assassination of Archduke Franz Ferdinand through the Treaty of Versailles to World War II, visually. The time axis adapts as you zoom (like Google Maps switching from countries to streets), long-duration events stretch into pill-shaped nodes, and semantic search lets you find anything instantly. 434 events and 505 causality links are included out of the box.

## Features

- **Infinite canvas network view** — explore history spatially with ReactFlow; time on X, related events cluster on Y
- **Dynamic time axis** — Google Maps-style density switching: zoom out to see centuries, zoom in to see days
- **Causality visualization** — directed edges show cause-and-effect chains across events
- **Pill nodes for durations** — events with duration stretch into pill shapes at the right zoom level
- **Semantic search** — pgvector embeddings + Meilisearch full-text for instant, meaning-aware results
- **Shareable permalink URLs** — share your exact viewport, zoom level, and selected event
- **Category filter bar** — toggle event categories on/off to focus your exploration
- **Timeline bookmarks** — save and jump to favorite time periods
- **Admin submission flow** — submit new events for review through a built-in form
- **434 historical events, 505 causality links** — seeded and ready to explore

## Screenshot

> Run locally and visit http://localhost:5173 to see the full interactive canvas.

## Quick Start

```bash
git clone https://github.com/rmcguiness/chronicle.git
cd chronicle
docker-compose up -d
```

Then visit:
- **Frontend:** http://localhost:5173
- **API docs:** http://localhost:8000/docs

> **Note:** The first run installs Python dependencies inside the container (~60s).
> PostgreSQL is mapped to **port 5433** to avoid conflicts with local installs.

## Architecture

```
Browser ──> React + ReactFlow (5173)
               │
               ▼
         FastAPI (8000)
           │         │
           ▼         ▼
   PostgreSQL    Meilisearch (7700)
   + PostGIS
   + pgvector
```

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | React, ReactFlow, Zustand | Infinite canvas, node rendering, state |
| API | FastAPI, SQLAlchemy 2.x async, Pydantic v2 | REST endpoints, query building |
| Database | PostgreSQL 16, PostGIS, pgvector | Geo, temporal, semantic storage |
| Search | Meilisearch | Instant full-text search |
| Orchestration | Docker Compose | One-command startup |

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI entry point
│   ├── models.py          # SQLAlchemy ORM models
│   ├── schemas.py         # Pydantic v2 response schemas
│   ├── database.py        # Async engine + session
│   ├── routers/
│   │   ├── canvas.py      # /api/canvas/tiles
│   │   ├── events.py      # /api/events
│   │   ├── search.py      # /api/search
│   │   ├── causality.py   # /api/groups, causality edges
│   │   └── submit.py      # /api/submit (admin flow)
│   └── services/
│       └── wiki_service.py
├── alembic/               # Database migrations
└── requirements.txt

frontend/
├── src/
│   ├── App.tsx            # Root component
│   ├── components/
│   │   ├── NetworkView.tsx     # Main ReactFlow canvas
│   │   ├── EventNode.tsx       # Node renderer (pill + circle)
│   │   ├── CausalityEdge.tsx   # Floating edge renderer
│   │   ├── SearchBar.tsx       # Semantic + full-text search
│   │   ├── CategoryFilter.tsx  # Category toggle bar
│   │   └── ...
│   ├── utils/
│   │   ├── timeScale.ts   # Dynamic axis density logic
│   │   └── permalink.ts   # Shareable URL encoding
│   └── store/index.ts     # Zustand state
└── tsconfig.json

scripts/
├── compute_network_layout.py  # Precompute network_y positions
└── enrich_causality.py        # Build causality link data
```

## Database

**Connection:** `postgresql://chronicle:chronicle@localhost:5433/chronicle`

Key tables:

| Table | Purpose |
|-------|---------|
| `events` | Core events with title, date, geo, importance, `network_y` |
| `causality_links` | Directed edges: `cause_event_id` -> `effect_event_id` |
| `perspectives` | Multiple accounts per event, ranked by evidence quality |
| `sources` | Bibliographic citations per perspective |

> `network_y` is precomputed by `scripts/compute_network_layout.py` so children cluster near their parent on the Y axis.

## API

Full interactive docs at [localhost:8000/docs](http://localhost:8000/docs) when running.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (paginated) |
| GET | `/api/events/{slug}` | Full event with perspectives |
| GET | `/api/canvas/tiles` | Spatial + temporal tile query |
| GET | `/api/groups` | Event groups and causality chains |
| GET | `/api/search?q=...` | Full-text + semantic search |
| POST | `/api/submit` | Submit a new event for review |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, branch naming conventions, and PR requirements.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

MIT License. See [LICENSE](LICENSE) for details.
