# Chronicle — Frontend

Infinite canvas historical timeline app. X axis = time, Y axis = geographic latitude.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Canvas | @xyflow/react (react-flow v12) |
| Rendering | deck.gl layers |
| Routing | React Router |
| State | Zustand |
| Data fetching | TanStack React Query |
| HTTP | Axios |
| Animations | Framer Motion |

## Getting Started

Requires Node.js 22.

```bash
cd frontend
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:8000
npm ci
npm run dev            # full app, needs the backend: http://localhost:5173
npm run dev:demo       # read-only demo on public/demo/snapshot.json, no backend
```

Checks (the same ones CI runs): `npm run lint`, `npm run build`, `npm run build:demo`, `npm test`.

## Layout

```
src/
├── api/client.ts     Axios client; demo mode reads the JSON snapshot instead
├── components/       Canvas and NetworkView, EventNode, CausalityEdge, SearchBar,
│                     DetailPanel, TimelineScrubber, OnThisDay, SubmitEventModal, ...
├── pages/            Event page, /admin moderation queue, curated topic pages
├── config/demo.ts    IS_DEMO_MODE flag
├── hooks/            usePermalink
├── store/            Zustand app state + coordinate math
├── types/            TypeScript interfaces
└── utils/            Category colours, icons and labels
```

See the root [README](../README.md) for the full feature list and the demo mode details.

## Backend Integration

When backend is running at `http://localhost:8000`, the app automatically fetches:

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Availability check |
| `GET /api/canvas/tiles` | Events for current viewport |
| `GET /api/events/{slug}` | Full event detail with perspectives |
| `GET /api/search?q=` | Full-text event search |

The root README lists every endpoint.

Mock data is used as fallback when the backend is unavailable. The "📡 Mock data" badge shows when mock data is active.

## Category Colour Scheme

| Category | Colour |
|---|---|
| War | 🔴 Red |
| Discovery | 🔵 Blue |
| Political | 🟣 Purple |
| Cultural | 🟠 Orange |
| Natural | 🟢 Green |
| Person | 🟡 Yellow |

## Causality Edge Types

| Type | Colour |
|---|---|
| causes | Red (animated) |
| leads_to | Orange |
| enables | Blue |
| context | Grey (dashed) |
