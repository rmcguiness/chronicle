# Contributing to Chronicle

Thanks for your interest. Chronicle is a small personal open-source project, so reviews can take a
while, but issues and pull requests are welcome.

## Ways to help

- **Report a bug** with the bug report template. Include steps, what you expected and a screenshot
  if it's visual.
- **Suggest a feature** with the feature request template. Check [ROADMAP.md](./ROADMAP.md) and
  [TODO.md](./TODO.md) first; many ideas are already written up there as task-sized items.
- **Fix historical data.** Wrong dates, places or causality links are bugs. Please cite a source.
  Disputes about interpretation belong in an issue, not a silent edit. Perspectives are ranked by
  evidence quality, not votes.
- **Security problems:** don't open a public issue. See [SECURITY.md](./SECURITY.md).

## Development setup

You only need Node to work on the UI:

```bash
cd frontend
cp .env.example .env     # VITE_API_URL, defaults to http://localhost:8000
npm ci
npm run dev:demo         # read-only demo on the bundled sample data, no backend needed
```

For the full app (backend, database, search), follow the Quick Start in the [README](./README.md):
Docker Compose for PostgreSQL + PostGIS + pgvector and Meilisearch, then the FastAPI backend, then
`npm run dev` in `frontend/`.

## Before you open a pull request

Run the same checks CI runs (Node 22, Python 3.11):

```bash
cd frontend
npm run lint
npm run build        # includes the TypeScript check (tsc -b)
npm run build:demo
npm test
```

For backend changes, also make sure every file compiles (`python -m py_compile` on what you touched)
and run any tests you added with `pytest`.

## Pull request guidelines

- Branch from `main` and keep each PR to one change. Small PRs get reviewed faster.
- Describe what changed and why, and how you tested it. Use the PR template.
- Add screenshots or a short clip for UI changes. Use the demo data or made-up data only, never
  personal data.
- Don't commit secrets, `.env` files or database dumps. CI runs a secret scan.
- New data or narrative text is contributed under the data licenses in
  [LICENSE-DATA.md](./LICENSE-DATA.md) (ODbL 1.0 for data, CC BY-SA 4.0 for text). Code is
  contributed under the [MIT License](./LICENSE).

## Code of conduct

This project follows the [Code of Conduct](./CODE_OF_CONDUCT.md). By taking part you agree to it.
