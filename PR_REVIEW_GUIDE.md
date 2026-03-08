# PR Review Guide — Chronicle (auto-generated 2026-03-08)

26 open PRs. This guide groups them by merge priority and flags likely conflicts.

---

## Tier 1 — Merge First (foundational, others depend on these)

These form the **groups pipeline** plus a bug fix. Merge in order.

| # | Title | What it adds |
|---|-------|-------------|
| **#36** | feat: groups — bounding box containers | `is_group` + `parent_event_id` columns, GroupNode component, admin UI, collapse/expand at zoom threshold |
| **#37** | data: 152 sub-events for group enrichment | Populates all 56 groups with 2-5 child events + 20 causality links |
| **#38** | fix: network view bugs | Zoom-compensated edge arrows, fitView consistency, lowered minZoom to 0.02 |
| **#39** | feat: group-aware network layout | `--groups` flag for layout script, pulls children near parent Y, collision resolution |

**Merge commands (run in order):**
```bash
gh pr merge 36 --squash --delete-branch
gh pr merge 37 --squash --delete-branch
gh pr merge 38 --squash --delete-branch
gh pr merge 39 --squash --delete-branch
```

> **Conflict note:** #36 touches `NetworkView.tsx`, `store/index.ts`, `App.tsx`, backend models, and canvas router — expect merge conflicts in many Tier 2 PRs after this lands. #38 also touches `NetworkView.tsx` and `CausalityEdge`.

---

## Tier 2 — Merge After Tier 1 (self-contained features)

These are independent of each other but may conflict on shared files (`App.tsx`, `store/index.ts`, `NetworkView.tsx`). Merge one at a time, resolving conflicts as you go.

### Core infrastructure / data

| # | Title | What it adds |
|---|-------|-------------|
| **#53** | feat: historical figures (People) node type | People DB table, API routes, PersonNode, toggle in network view, avatar chips in detail panel |
| **#64** | data: ancient history enrichment — 104 BCE events | Seed script adding 104 curated ancient events (idempotent) |
| **#40** | docs: open-source launch prep | README, CONTRIBUTING, LICENSE, PR template |

### Panels & exploration features

| # | Title | What it adds |
|---|-------|-------------|
| **#49** | feat: causal chain explorer panel | Recursive CTE traversal, accordion tree panel, forward/backward toggle |
| **#50** | feat: causal path finder | BFS shortest-path between two events, orange highlight + breadcrumb |
| **#43** | feat: related events panel (pgvector) | `GET /api/events/{slug}/similar` using cosine distance, panel in detail view |
| **#61** | feat: follow-on events panel | Events in next 1-50 years, same-region filter, chaining navigation |
| **#65** | feat: world context panel | Events within +-N years grouped by region, slide-in panel |

### Toolbar & UI features

| # | Title | What it adds |
|---|-------|-------------|
| **#55** | feat: importance threshold filter | Range slider in toolbar, local + debounced API filter |
| **#41** | feat: network view ego-graph focus mode | Click-to-highlight node + 1-hop neighbors, dim everything else |
| **#42** | feat: keyboard shortcuts | `/` search, `Esc` close, `R` random jump, `?` help modal |
| **#48** | feat: event comparison mode | Compare two events side-by-side, blue/orange rings, bottom panel |
| **#56** | feat: event connections badge | Connection count badge on nodes, "most connected" leaderboard panel |
| **#58** | feat: jump to era quick navigation | Dropdown with 8 preset historical eras |
| **#44** | feat: export network view as PNG | html2canvas-pro capture at 2x, download button |
| **#45** | feat: dark mode toggle | Tailwind dark mode, system preference detection, sun/moon toggle |
| **#46** | feat: timeline statistics panel | `/api/stats` endpoint, collapsible panel with category/era breakdowns |
| **#47** | feat: embeddable event widget | `/embed/event/:slug` standalone page, iframe snippet copy UI |

```bash
# Suggested order (infrastructure first, then panels, then toolbar)
gh pr merge 53 --squash --delete-branch
gh pr merge 64 --squash --delete-branch
gh pr merge 40 --squash --delete-branch
gh pr merge 49 --squash --delete-branch
gh pr merge 50 --squash --delete-branch
gh pr merge 43 --squash --delete-branch
gh pr merge 61 --squash --delete-branch
gh pr merge 65 --squash --delete-branch
gh pr merge 55 --squash --delete-branch
gh pr merge 41 --squash --delete-branch
gh pr merge 42 --squash --delete-branch
gh pr merge 48 --squash --delete-branch
gh pr merge 56 --squash --delete-branch
gh pr merge 58 --squash --delete-branch
gh pr merge 44 --squash --delete-branch
gh pr merge 45 --squash --delete-branch
gh pr merge 46 --squash --delete-branch
gh pr merge 47 --squash --delete-branch
```

> **Conflict hotspots:**
> - `App.tsx` — touched by #41, #42, #46, #48, #49, #50, #55, #61, #63, #65 (wire panels/buttons into MainView)
> - `store/index.ts` — touched by #41, #48, #49, #50, #55, #62, #65 (new Zustand state slices)
> - `NetworkView.tsx` — touched by #41, #45, #51, #55 (rendering logic, toolbar additions)
> - `EventDetailPanel` — touched by #43, #53 (adding sections to detail view)
> - `types/index.ts` — touched by #49, #50 (new type definitions)
> - `backend/app/routers/events.py` — touched by #49, #50, #56, #57 (new endpoints)

---

## Tier 3 — Nice-to-Have (batch later)

These are lower-priority features that can wait.

| # | Title | What it adds |
|---|-------|-------------|
| **#51** | feat: timeline density heatmap | Color-coded density band at top of viewport, 50-year buckets |
| **#54** | feat: era summary tooltip | Hover tooltip on canvas background showing decade/century stats |
| **#62** | feat: timeline minimap | 200x48px minimap with draggable viewport rectangle |
| **#63** | feat: this week in history banner | Slim amber banner showing 3 events matching today's date |

```bash
gh pr merge 51 --squash --delete-branch
gh pr merge 54 --squash --delete-branch
gh pr merge 62 --squash --delete-branch
gh pr merge 63 --squash --delete-branch
```

---

## Duplicates / Close

| # | Title | Reason |
|---|-------|--------|
| **#57** | feat: random event explore button | Duplicated by **#42** (keyboard shortcuts) which includes `R` to jump to a random high-importance event with the same viewport animation. Close #57 unless you want a visible toolbar button too. |
| **#66** | feat: fuzzy search with pg_trgm + person search | Depends on **#53** (People table). The commit `43920f7` on `feat/fuzzy-search` already landed on `main` as the top commit — verify if this PR is stale or still has delta. If already merged, close. |

```bash
# If confirmed as duplicates/stale:
gh pr close 57 --comment "Covered by #42 keyboard shortcuts (R key)"
gh pr close 66 --comment "Core commit already on main; people search depends on #53"
```

---

## Tips

- After each merge, pull main and check `npm run build` in frontend before merging the next PR
- The groups pipeline (#36-39) will cause the most downstream conflicts — resolve those first
- PRs touching only `scripts/` or `data/` (#37, #64) are lowest conflict risk
- Run `alembic upgrade head` after merging #36 and #53 (DB migrations)
