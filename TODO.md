# Chronicle — Task Backlog

Tasks are designed to be picked up by a subagent independently.
Each task should be a single PR. Always branch from `main`, open a PR, never push directly.

---

## UI Fixes

### [UI-01] Fix event tooltip scale at low zoom levels
**Problem:** Tooltip rendered inside react-flow scales with canvas zoom, so at zoom 0.1 it's unreadably tiny.
**Fix:** Render the tooltip as a React portal to `document.body`, positioned using `getBoundingClientRect()` on the node element, outside the scaled canvas entirely. Fixed pixel size at all zoom levels.
**Files:** `frontend/src/components/EventNode.tsx`, possibly a new `frontend/src/components/Tooltip.tsx`

### [UI-02] Fix geographic region label overlap
**Problem:** Swim-lane region labels (Europe, Americas, etc.) are rotated 90° and positioned at band center. They overlap each other when bands are small or zoom is low. Sometimes they render outside the viewport entirely.
**Fix:** Only render a label if the band occupies at least 60px of screen height. Clamp label vertical position so it stays within the visible band. Add a minimum band height check before rendering.
**Files:** `frontend/src/components/Canvas.tsx` → `SwimLaneOverlay`

### [UI-03] Dynamic band heights based on event density (funnel shape)
**Problem:** All 5 region bands are fixed at `BAND_HEIGHT=200px`. As data fills in, recent history has far more events than ancient history. Events in dense bands overlap; sparse ancient bands waste space.
**Approach:**
- After tile data loads, count events per region band
- Allocate band height proportionally: `minBandHeight=120`, `maxBandHeight=600`, total height = sum of allocated heights
- Update `CANVAS_CONSTANTS.BAND_HEIGHT` to a per-band array `BAND_HEIGHTS: number[]`
- Recompute `eventToNode` Y positions using cumulative band offsets
- Swim-lane overlay and labels should use the same cumulative offsets
- At low data density (ancient history), bands stay near min; high-density periods (19th-20th C) expand naturally
**Files:** `frontend/src/types/index.ts`, `frontend/src/components/Canvas.tsx`, `frontend/src/store/index.ts`

### [UI-04] Collision resolution within bands (prevent icon overlap)
**Problem:** Multiple events with the same `year_approx` or very similar years stack on top of each other in the same band.
**Fix:** After computing initial node positions, run a lightweight 1D collision resolution pass: sort events by Y within each band, then iteratively push overlapping nodes apart vertically (capped at band boundaries). Apply only at zoom < 1 where overlap is visible. At zoom >= 1 exact positions are fine.
**Files:** `frontend/src/components/Canvas.tsx` → `eventToNode` / build-nodes effect

### [UI-05] Expandable / collapsible region bands
**Problem:** Users can't focus on a specific geographic region without all bands taking up screen space.
**Feature:** Add a collapse toggle button to each swim-lane label. Collapsed bands shrink to a 32px header strip. Expanded = normal height. Persist collapse state in Zustand store.
**Files:** `frontend/src/components/Canvas.tsx`, `frontend/src/store/index.ts`

---

## Data & Backend

### [DATA-01] Seed historical events across full timeline (BCE → present)
**Problem:** DB currently has 120 events, mostly post-1500. Ancient history (-5000 to 0 CE) is sparse.
**Task:** Write a seed script (`backend/scripts/seed_extended.py`) that adds ~300 curated events spanning:
- Ancient civilizations (-3000 to -500 BCE): Mesopotamia, Egypt, Indus Valley, Zhou China, Greek city-states
- Classical period (-500 BCE to 500 CE): Rome, Han dynasty, Maurya, Hellenistic world
- Medieval (500-1500 CE): Islamic Golden Age, Tang/Song China, Byzantine, Mongols, Crusades
- Early modern (1500-1800): Columbian Exchange, printing press, Enlightenment, colonialism
Use `year_approx`, lat/lng, `importance_score` 0.4-1.0, proper categories and region tags.
**Files:** `backend/scripts/seed_extended.py`

### [DATA-02] Wikipedia / Grokipedia integration for event detail content
**Problem:** Events only have short blurbs. Ryan wants in-depth reading per event.
**Task:**
- Add a `wikipedia_slug` column to the `events` table (migration in `backend/alembic/`)
- Add a `GET /api/events/{slug}/article` endpoint that fetches the Wikipedia article summary + first 3 sections via the Wikipedia REST API (`en.wikipedia.org/api/rest_v1/page/summary/{title}`)
- Cache responses in a new `article_cache` DB table (TTL 7 days) to avoid hammering Wikipedia
- Return: `{ title, summary, sections: [{heading, content}], source_url, last_updated }`
**Files:** `backend/app/routers/events.py`, `backend/app/models.py`, new `backend/app/services/wikipedia.py`

### [DATA-03] Event detail page in frontend
**Problem:** No dedicated reading page — events only show a side panel blurb.
**Task:** Create `/event/:slug` route in the frontend:
- Full-page layout: title + date + region + category badge
- Map thumbnail (static image or small Leaflet map showing location)
- "Read More" section that fetches `/api/events/{slug}/article` and renders sections with headings
- Perspectives panel (existing `perspectives` data)
- Connected events graph (horizontal mini-timeline of `connected_events`)
- "Back to timeline" button that returns to the canvas centered on this event
**Files:** `frontend/src/pages/EventDetail.tsx` (new), `frontend/src/App.tsx` (add route), `frontend/src/api/client.ts`

---

## Performance & Scaling

### [PERF-01] Replace deck.gl with canvas 2D renderer for high event counts
**Problem:** GL_THRESHOLD is temporarily set to 500 to avoid a WebGPU crash in deck.gl 9.x. A real solution is needed for when the dataset grows to thousands of events.
**Task:** Replace `WebGLEventLayer` (deck.gl) with a plain HTML5 Canvas 2D renderer:
- Render a `<canvas>` element absolutely positioned over react-flow
- On each `rfTransform` change, clear and redraw all events as colored circles using `ctx.arc()`
- Handle click detection with `canvas.addEventListener('click')` + point-in-circle test
- This eliminates the WebGPU/WebGL dependency entirely, works in all browsers, and easily handles 10,000+ events
**Files:** `frontend/src/components/WebGLEventLayer.tsx` → replace with `CanvasEventLayer.tsx`

### [PERF-02] React-flow virtualization for large node counts
**Problem:** react-flow renders all nodes in the DOM regardless of visibility. At 500+ events this causes jank.
**Task:** In the build-nodes effect, filter nodes to only those whose canvas X position falls within the current viewport (with a buffer). Update on `onMoveEnd`. This is a manual viewport culling pass.
**Files:** `frontend/src/components/Canvas.tsx`

### [PERF-03] Tile API pagination and zoom-based LOD
**Problem:** `/api/tiles` returns all events in the viewport at any zoom. At zoom 0.05 (full history visible), this could be thousands of events.
**Task:**
- Add `limit` and `offset` query params to `GET /api/tiles`
- Add `min_importance` param (backend already computes this for zoom level)
- Frontend passes `importanceThreshold(rfZoom)` as `min_importance` to avoid fetching low-importance events the user can't see anyway
- This reduces payload size drastically at low zoom levels
**Files:** `backend/app/routers/tiles.py`, `frontend/src/api/client.ts`

---

## Features

### [FEAT-00] Zoom-based event clustering and daily-level resolution
**Idea:** At low zoom (century/decade view) nearby events cluster into a single bubble showing a count badge.
Zooming in progressively splits clusters → groups of related events → individual events → daily precision.

**Approach — 4 zoom tiers:**
- Tier 1 (zoom < 0.15): cluster events within the same ~100-year window into a single node. Badge shows count + dominant category color.
- Tier 2 (zoom 0.15–0.5): decade grouping. Events within ~10 years collapse into a small group chip. Clicking expands in place.
- Tier 3 (zoom 0.5–2.0): individual events, year-level labels, current behavior.
- Tier 4 (zoom > 2.0): daily resolution. `date_display` shown on node. Events on the same day stack vertically with a shared date header.

**Clustering algorithm:** For Tier 1 and 2, use a simple 1D sweep along the X axis — bin events into fixed time windows, pick the highest `importance_score` event as the cluster representative, attach the rest as children. On click/expand, animate children fanning out from the representative node.

**Data needed:** `date_display` field is already in `HistoricalEvent` (optional string). Backend already stores `date_exact` as text. No schema changes needed for Tier 4.

**Why this works:** It matches how humans think about history — you start at the big picture (World Wars, Industrial Revolution) and zoom into specifics (Battle of Stalingrad, specific dates). Related events that happen within days naturally surface together at high zoom.

**Files:** `frontend/src/components/Canvas.tsx` (eventToNode, LOD effects), new `frontend/src/utils/cluster.ts`, `frontend/src/components/EventNode.tsx` (cluster variant render)

### [FEAT-01] Timeline bookmarks / named views
**Task:** Let users save the current viewport (year range, zoom, visible regions) as a named bookmark. Store in localStorage. Show as a dropdown in the top-right corner. "Ancient Civilizations", "World Wars", "Industrial Revolution" etc.
**Files:** `frontend/src/components/` (new `BookmarksMenu.tsx`), `frontend/src/store/index.ts`

### [FEAT-02] Event submission form
**Task:** Add an `/admin/submit` page (password-protected, same pattern as mcg-consulting admin) where new events can be submitted with title, year, lat/lng, category, importance, and a short description. Submitted events go into a `pending_events` table and can be approved via `/admin/review`.
**Files:** `backend/app/models.py`, `backend/app/routers/admin.py` (new), `frontend/src/pages/AdminSubmit.tsx` (new)

### [FEAT-03] Category filter toggle bar
**Task:** Add a filter bar (above the timeline scrubber) with toggle buttons for each category (war, discovery, political, cultural, natural, person). Toggling hides/shows nodes of that category. State in Zustand.
**Files:** `frontend/src/components/Canvas.tsx`, `frontend/src/store/index.ts`, new `frontend/src/components/CategoryFilter.tsx`

---

## Infrastructure

### [INFRA-01] Dockerize frontend for production
**Task:** Add a `frontend/Dockerfile` (multi-stage: node build → nginx serve). Add `frontend` service to `docker-compose.yml`. The app should be fully launchable with `docker-compose up` — no separate `npm run dev` needed.
**Files:** `frontend/Dockerfile` (new), `docker-compose.yml`

### [INFRA-02] GitHub Actions CI pipeline
**Task:** Add `.github/workflows/ci.yml`:
- Backend: `pip install -r requirements.txt && pytest`
- Frontend: `npm ci && npm run build && npm run lint`
- Run on all PRs to `main`
**Files:** `.github/workflows/ci.yml` (new)

---

## Fix Queue (known bugs)
- [x] BCE date fix verified end-to-end: `GET /api/events/{slug}` on a BCE event returns 200 ✓ (FIX-BCE — asyncpg OverflowError resolved via CAST(date AS TEXT) column_property; wiki endpoint also returns 200 with `found: false` when no wikipedia_slug is set)
- [ ] Initial react-flow viewport doesn't match `defaultViewport` prop consistently across screen sizes — use `fitView` instead with padding
- [ ] Search results don't scroll when there are many matches (overflow hidden on search panel)
- [ ] Causality edge arrows not visible at zoom < 0.3 (strokeWidth too thin to see)
