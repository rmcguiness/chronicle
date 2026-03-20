# Contributing to Chronicle

Thanks for your interest in contributing! This guide covers everything you need to get started.

## Prerequisites

- **Docker + Docker Compose** — runs the full stack
- **Node 18+** — for frontend development outside of Docker
- **Python 3.11+** — for backend development outside of Docker

## Dev Setup

```bash
# Clone and start everything
git clone https://github.com/rmcguiness/chronicle.git
cd chronicle
docker-compose up -d

# Frontend dev (hot reload)
cd frontend
npm install
npm run dev

# Backend runs inside Docker, but for local dev:
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Branch Naming

Use a prefix that describes the type of change:

| Prefix | Use for |
|--------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `data/` | Seed data, migrations, scripts |
| `docs/` | Documentation changes |

Examples: `feat/event-clustering`, `fix/edge-overlap`, `data/add-cold-war-events`

## Pull Request Requirements

1. **Write a clear description** — explain what changed and why
2. **CI must pass** — lint, build, and tests all green
3. **Link related issues** — reference with `#123` or `Closes #123`
4. **Keep PRs focused** — one logical change per PR

## Adding Historical Events

Event seed data lives in `scripts/`. To add new events:

1. Add event data to the appropriate seed script in `scripts/`
2. Include causality links to connect your events to existing ones
3. Run `python scripts/compute_network_layout.py` to update `network_y` positions
4. Test that events render correctly on the canvas

## Code Style

### TypeScript (Frontend)

- **Strict mode** enabled — no `any` types
- **JSDoc** on all exported functions and components
- **Named constants** — no magic numbers (e.g., `const MIN_ZOOM = 0.1`, not bare `0.1`)
- Run `npm run lint` before committing

### Python (Backend)

- Follow existing patterns in `backend/app/`
- Type hints on function signatures
- Pydantic v2 schemas for all API responses

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Lint
cd frontend
npm run lint
```

## Questions?

Open an issue or start a discussion — we're happy to help.
