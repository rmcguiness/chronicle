# Roadmap

A high-level view of where Chronicle is headed. Task-sized items with implementation notes are in
[TODO.md](./TODO.md). This file covers direction and priorities.

## Now

- **Static demo mode.** A read-only build backed by a seed-data snapshot (`npm run build:demo`),
  for showing the project without running the backend. See the README.
- **UI polish and accessibility.** Shared design tokens, loading/error/empty states,
  `prefers-reduced-motion` support, labelled controls, keyboard focus styles, a skip link and
  Escape to close the detail panel.

## Next

- **Data quality.** Remove duplicate events in the seed data. The demo exporter merges them, but
  the database still has them. Backfill `wikipedia_slug` for more events.
- **Canvas usability.** `fitView` on first load across screen sizes, readable causality arrows at
  low zoom, and a better small-screen layout for the timeline scrubber.
- **Search.** Keyboard navigation through results (arrow keys plus Enter) and highlighting of the
  matching terms.
- **Accessibility.** A non-canvas list view of events, so screen-reader users can browse the
  timeline without the graph.

## Later

- **Scale.** Tile pagination and zoom-based level of detail, node virtualization, and clustering
  for dense periods (see PERF-* and FEAT-00 in TODO.md).
- **Contribution flow.** Public event and perspective submissions with source requirements and a
  documented review process.
- **Deployment.** A documented production setup for the API (database, Meilisearch, workers)
  alongside the static demo.

## Not planned

- Vote-based ranking. Perspectives are ranked by evidence quality, not popularity.
- Deleting history. The edit log stays append-only.
