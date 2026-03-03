# Chronicle — Frontend

Infinite canvas historical timeline app. X axis = time, Y axis = geographic latitude.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Canvas | @xyflow/react (react-flow v12) |
| Map | MapLibre GL JS (free Mapbox fork) |
| State | Zustand |
| Data fetching | TanStack React Query |
| HTTP | Axios |
| Animations | Framer Motion |

## Getting Started

```bash
cd frontend
npm install
npm run dev         # → http://localhost:5173
```

## Architecture

```
src/
├── api/
│   └── client.ts         Axios instance + mock data fallback
├── components/
│   ├── Canvas.tsx        Main canvas (MapLibre + ReactFlow)
│   ├── CategoryLegend.tsx  Left sidebar legend
│   ├── CausalityEdge.tsx  Custom edge for causality chains
│   ├── DetailPanel.tsx    Right slide-in panel on event click
│   ├── EventNode.tsx      Custom circular event node
│   ├── SearchBar.tsx      Top-center search with dropdown
│   └── TimelineScrubber.tsx  Bottom timeline with drag handles
├── store/
│   └── index.ts          Zustand app state + coordinate math
├── types/
│   └── index.ts          TypeScript interfaces
└── utils/
    └── categories.ts     Color/icon/label maps per category
```

## Features

- **Infinite 2D canvas**: Pan left/right = time travel, scroll = time resolution
- **MapLibre GL background**: OpenStreetMap tiles filtered to dark navy aesthetic
- **10 mock events**: 1850–1950, spanning wars, politics, science, culture
- **Causality chains**: Coloured curved edges with arrows connecting cause → effect
- **Level of Detail**: Higher importance events visible at lower zoom levels
- **Event detail panel**: Perspective cards sorted by evidence score, expandable narratives, source citations
- **Search**: 300ms debounced search with flyover animation to target event
- **Timeline scrubber**: Draggable range handles, click-to-jump
- **Mock data fallback**: Works standalone — no backend required

## Backend Integration

When backend is running at `http://localhost:8000`, the app automatically fetches:

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Availability check |
| `GET /api/canvas/tiles` | Events for current viewport |
| `GET /api/events/{slug}` | Full event detail with perspectives |
| `GET /api/search?q=` | Full-text event search |

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
