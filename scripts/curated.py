"""Load the hand-researched, cited data batches in ``data/curated/``.

Each batch is one JSON file (see ``data/curated/README.md`` and ``docs/DATA_PIPELINE.md``)
with a source registry and the events, causal links, chains and retractions it adds:

    {
      "batch": "wwi-origins",
      "sources": {"<source-id>": {"title", "author", "publication", "publication_date",
                                  "source_type", "url"}},
      "events": [{"slug", "title", "year", "date_display", "lat", "lng", "category",
                  "summary", "description", "citations": [...],
                  "perspectives": [{"party", "perspective_type", "wanted", "feared",
                                    "remembered", "citations": [...]}]}],
      "links": [{"cause", "effect", "type", "strength", "confidence", "rationale",
                 "citations": [...]}],
      "chains": [{"slug", "title", "chain_type", "description", "event_ids"}],
      "retracted_links": [{"cause", "effect", "reason"}]
    }

A citation is ``{"source": "<source-id>", "quote": "...", "locator": "..."}``; the loader
expands it into the frontend ``Source`` shape (title, author, publication, url, quote).

Curated data wins over the older seed scripts: an event whose slug already exists is
updated field by field, a curated link replaces a seed link between the same two events,
and retracted links are dropped from every source. Standard library only.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
CURATED_DIR = ROOT / "data" / "curated"

CONFIDENCE_LEVELS = ("established", "debated", "speculative")
CHAIN_TYPES = ("scholarly", "popular_internet")
SOURCE_TYPES = ("primary", "secondary", "tertiary", "journalistic", "oral", "artifact")
LINK_TYPES = ("direct", "contributing", "indirect", "disputed")


def batch_files(directory: Path = CURATED_DIR) -> list[Path]:
    return sorted(p for p in directory.glob("*.json") if not p.name.startswith("_"))


def load_batches(directory: Path = CURATED_DIR) -> list[dict[str, Any]]:
    batches = []
    for path in batch_files(directory):
        data = json.loads(path.read_text(encoding="utf-8"))
        data.setdefault("batch", path.stem)
        data["_path"] = str(path.relative_to(ROOT) if path.is_relative_to(ROOT) else path)
        batches.append(data)
    return batches


def resolve_citation(cite: dict[str, Any], sources: dict[str, Any], cite_id: str) -> dict[str, Any]:
    """Expand ``{"source": id, "quote", "locator"}`` into the frontend Source shape."""
    src = sources.get(cite.get("source", ""), {})
    out: dict[str, Any] = {"id": cite_id, "title": src.get("title", "")}
    for key in ("author", "publication", "publication_date"):
        if src.get(key):
            out[key] = str(src[key])
    out["source_type"] = src.get("source_type", "secondary")
    if src.get("url"):
        out["original_url"] = src["url"]
    if cite.get("quote"):
        out["quote"] = cite["quote"]
    if cite.get("locator"):
        out["locator"] = cite["locator"]
    return out


def _cites(items: list[dict[str, Any]], sources: dict[str, Any], prefix: str) -> list[dict[str, Any]]:
    return [resolve_citation(c, sources, f"{prefix}-c{i + 1}") for i, c in enumerate(items or [])]


def curated_data(directory: Path = CURATED_DIR) -> dict[str, Any]:
    """Merge every batch into {events: {slug: event}, links: [...], chains: [...], retracted: set}."""
    events: dict[str, dict[str, Any]] = {}
    links: list[dict[str, Any]] = []
    chains: list[dict[str, Any]] = []
    retracted: set[tuple[str, str]] = set()
    for batch in load_batches(directory):
        sources = batch.get("sources", {})
        for ev in batch.get("events", []):
            slug = ev["slug"]
            out = {k: v for k, v in ev.items() if k not in ("citations", "perspectives")}
            out["curated"] = True
            out["batch"] = batch["batch"]
            out["citations"] = _cites(ev.get("citations", []), sources, slug)
            if ev.get("perspectives"):
                out["perspectives"] = [
                    {
                        **{k: v for k, v in p.items() if k != "citations"},
                        "citations": _cites(p.get("citations", []), sources, f"{slug}-p{i + 1}"),
                    }
                    for i, p in enumerate(ev["perspectives"])
                ]
            events[slug] = out
        for link in batch.get("links", []):
            lid = f"{link['cause']}__{link['effect']}"
            links.append(
                {
                    "cause": link["cause"],
                    "effect": link["effect"],
                    "type": link.get("type", "direct"),
                    "strength": link.get("strength", 0.6),
                    "desc": link.get("rationale"),
                    "confidence": link.get("confidence", "speculative"),
                    "rationale": link.get("rationale"),
                    "citations": _cites(link.get("citations", []), sources, lid),
                    "curated": True,
                }
            )
        for chain in batch.get("chains", []):
            chains.append({**chain, "batch": batch["batch"]})
        for r in batch.get("retracted_links", []):
            retracted.add((r["cause"], r["effect"]))
    return {"events": events, "links": links, "chains": chains, "retracted": retracted}
