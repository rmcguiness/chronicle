# Roadmap

A high-level view of where Chronicle is headed. Task-sized items with implementation notes are in
[TODO.md](./TODO.md). This file covers direction and priorities.

## Done

- **Static demo mode.** A read-only build backed by a seed-data snapshot (`npm run build:demo`),
  for showing the project without running the backend. See the README.
- **UI polish and accessibility.** Shared design tokens, loading/error/empty states,
  `prefers-reduced-motion` support, labelled controls, keyboard focus styles, a skip link and
  Escape to close the detail panel.
- **Security hardening.** `ADMIN_KEY` required for moderation, rate limits on submission and
  search, a CI secret scan and Dependabot. See SECURITY.md.
- **Search.** Keyboard navigation through results (arrow keys, Home/End, Enter) using the ARIA
  combobox pattern, and highlighting of the matching words.
- **Demo data quality.** The demo exporter catches more duplicate seed events, and CI checks that
  the committed snapshot matches the exporter output.
- **Dependency upgrade pass** (#271): React 19.3, deck.gl 9.4, ESLint 10, Vitest 5,
  sentence-transformers 6, and CI on Node 22.
- **Vercel preview config** (#265): a preview deployment of the static demo for each pull request.

## Now (in review)

- **Contributor docs.** CONTRIBUTING.md, a code of conduct, and issue and PR templates.
- **Feature backlog** (#231–#247): open PRs for topic deep-dive pages and browsers (people, causal
  chains, parallel history, year in review, categories, quotes, on-this-day) plus a canvas fix,
  waiting for review.

## Next

- **Data quality.** Remove duplicate events from the seed scripts themselves. The demo exporter
  now merges them (including the same event dated a few years apart in different batches), but a
  database seeded from the scripts still has them. Backfill `wikipedia_slug` for more events.
- **Canvas usability.** `fitView` on first load across screen sizes, readable causality arrows at
  low zoom, and a better small-screen layout for the timeline scrubber.
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
