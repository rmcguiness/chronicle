# Chronicle PoC — Manual Testing Checklist

## Prerequisites
- Docker Desktop running
- Node.js 18+ and Python 3.11+ available

---

## 1. Start Infrastructure (Docker)

```bash
cd ~/projects/chronicle
docker compose up -d
```

Wait ~15 seconds, then verify:
```bash
docker compose ps
```
Both `chronicle-db-1` (PostgreSQL) and `chronicle-meilisearch-1` should show **healthy**.

---

## 2. Start Backend (FastAPI)

```bash
cd ~/projects/chronicle/backend
.venv/bin/uvicorn app.main:app --reload --port 8000
```

Verify at: http://localhost:8000/docs  
→ You should see the FastAPI Swagger UI with `/events`, `/tiles`, `/causality` endpoints.

Quick smoke test:
```bash
curl http://localhost:8000/tiles?year_min=-500&year_max=1500&lat_min=-60&lat_max=75&zoom=3
```
→ Should return JSON with `events` and `links` arrays.

---

## 3. Start Frontend (Vite)

```bash
cd ~/projects/chronicle/frontend
npm run dev
```

Open: http://localhost:5173

---

## 4. What to Look For

### DOM mode (< 50 events visible)
- [ ] Events render as colored circular nodes on the canvas
- [ ] Edges (causality arrows) draw between related events
- [ ] Clicking a node opens the Detail Panel on the right
- [ ] Zooming in/out adjusts which events are visible (LOD filtering)

### WebGL mode (> 50 events visible)
- [ ] Zoom out until you see **"⚡ WebGL tier active · N events"** badge (bottom-right corner)
- [ ] Events render as GPU-accelerated dots (much faster than DOM nodes)
- [ ] Clicking a dot still opens the Detail Panel
- [ ] ReactFlow pan/zoom still works (panning the canvas moves WebGL dots in sync)

### General
- [ ] MapLibre background map loads (dark-tinted OSM tiles)
- [ ] Search bar (top) returns and flies to events
- [ ] Timeline scrubber (bottom) filters events by year range
- [ ] Category legend (right panel) shows color keys
- [ ] "📡 Mock data" banner disappears when backend is live

---

## 5. Build Check (CI verification)

```bash
cd ~/projects/chronicle/frontend
npm run build
```
→ Should complete with `✓ built` and **no TypeScript errors**.

---

## Known Issues

- **Chunk size warning**: `maplibre` and the deck.gl bundle each exceed 1 MB minified. This is a warning, not an error — the app still runs. Code-splitting can be added as a follow-up.
- **`@loaders.gl/worker-utils` spawn warning**: A non-critical rollup warning about Node `spawn` in a browser bundle. Does not affect runtime.
- **Backend requires venv**: Use `.venv/bin/uvicorn` (not system `uvicorn`) — FastAPI and dependencies are installed only in the project venv.
- **Docker required**: The backend will fail to connect to PostgreSQL if containers are not running. Frontend falls back to mock data automatically (banner shown).
