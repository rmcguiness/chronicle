# Curated batches

Each JSON file here is one researched batch of events, causal links and chains with
citations. Files are loaded in name order by `scripts/curated.py`, and the demo snapshot
exporter applies them on top of the seed data. Files whose names start with `_` are
skipped, which is useful for work in progress.

How to research, draft, review and validate a batch is described in
[`docs/DATA_PIPELINE.md`](../../docs/DATA_PIPELINE.md). The planned batches and their
status are listed in [`data/coverage.md`](../coverage.md).

Quick reference:

- `sources` maps a short id to `title`, `author`, `publication`, `publication_date`,
  `source_type` (`primary`, `secondary`, `tertiary`, `journalistic`, `oral`, `artifact`)
  and `url`. Wikipedia is not a source.
- A citation is `{"source": "<id>", "quote": "<verbatim text from the source>",
  "locator": "<section or page, optional>"}`.
- Every event, link and perspective needs at least one citation.
- Links carry `confidence` (`established`, `debated`, `speculative`) and a one-sentence
  `rationale`.
- Chains carry `chain_type`: `scholarly` or `popular_internet`. Popular internet chains
  say so in their title.

Check a batch with:

```bash
python scripts/validate_curated.py                  # structure, citations, wording
python scripts/validate_curated.py --verify-quotes  # also refetch every URL and look for each quote
python scripts/export_demo_snapshot.py              # rebuild frontend/public/demo/snapshot.json
```
