#!/usr/bin/env python3
"""
Export a static, read-only demo snapshot for the Chronicle frontend.

Writes ``frontend/public/demo/snapshot.json``: a modest, well-linked subset of the
events, causality links, and perspectives defined in the repository's seed scripts
(``backend/scripts/seed_*.py``). The frontend reads this file when built with
``VITE_DEMO_MODE=true`` (``npm run build:demo``), so the demo needs no backend.

Why seed files instead of the API? The backend needs PostGIS + pgvector and a seeded
database; the seed scripts are the source of truth for that data, so reading them
directly is reproducible on any machine with Python 3.10+ and no extra packages.

The seed modules are imported with their database drivers stubbed out; nothing
connects to a database and nothing runs their ``main()``.

Data licensing: the exported data is Chronicle data under ODbL 1.0 (structure) and
CC BY-SA 4.0 (narrative text) — see LICENSE-DATA.md. The snapshot embeds that notice.
No Wikipedia text is exported (the app fetches it at runtime in normal mode only).

Usage (from the repo root):
    python3 scripts/export_demo_snapshot.py            # default: 300 events
    python3 scripts/export_demo_snapshot.py --limit 400
"""
from __future__ import annotations

import argparse
import os
import re
import importlib.util
import json
import sys
import types
from collections import defaultdict
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SEED_DIR = ROOT / "backend" / "scripts"
OUT_PATH = ROOT / "frontend" / "public" / "demo" / "snapshot.json"

# Seed scripts whose EVENTS lists are dicts with slug/title/year/lat/lng (+ perspectives).
EVENT_MODULES = [
    "seed_events",
    "seed_prehistoric",
    "seed_prehistoric_enrichment",
    "seed_bronze_classical",
    "seed_early_medieval",
    "seed_medieval_early_modern",
    "seed_early_modern_enrichment",
    "seed_19th_century",
    "seed_19c_modern",
    "seed_20th_century",
    "seed_regional_enrichment_2",
    "seed_underrepresented_regions",
    "seed_underrepresented_v2",
]

# Modules that define causality links, and the attribute names they use.
LINK_SOURCES = [
    ("seed_events", "CAUSALITY_LINKS"),
    ("seed_prehistoric_enrichment", "CAUSALITY_LINKS"),
    ("seed_medieval_early_modern", "CAUSALITY_LINKS"),
    ("seed_early_modern_enrichment", "CAUSALITY_LINKS"),
    ("seed_regional_enrichment_2", "CAUSALITY_LINKS"),
    ("seed_underrepresented_v2", "CAUSALITY_LINKS"),
    ("seed_causality_batch2", "LINKS"),
    ("causality_20th_century", "LINKS"),
    ("seed_ancient_classical_medieval_figures", "CAUSALITY_LINKS"),
]

# Mirrors backend/app/schemas.py::_LINK_TYPE_MAP
LINK_TYPE_MAP = {
    "direct": "causes",
    "indirect": "context",
    "contributing": "enables",
    "disputed": "context",
}

# Frontend EventCategory values; anything else is folded into the closest one.
FRONTEND_CATEGORIES = {"war", "discovery", "political", "cultural", "natural", "person"}
CATEGORY_FALLBACK = {
    "science": "discovery",
    "technology": "discovery",
    "exploration": "discovery",
    "religion": "cultural",
    "religious": "cultural",
    "trade": "cultural",
    "economic": "cultural",
    "social": "cultural",
    "disaster": "natural",
}

# Frontend PerspectiveType values (viewpoint_type is passed through as perspective_type).
PERSPECTIVE_TYPES = {
    "government", "civilian", "foreign", "academic", "nationalist",
    "colonial", "indigenous", "religious", "journalistic",
}

LICENSE_NOTICE = {
    "data": "Open Database License (ODbL) 1.0 — https://opendatacommons.org/licenses/odbl/1-0/",
    "text": "CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/",
    "credit": "Chronicle (https://github.com/rmcguiness/chronicle) and contributors",
    "details": "See LICENSE-DATA.md. Wikipedia article text is not included in this snapshot.",
}


def _stub_db_modules() -> None:
    """Seed scripts import DB drivers at module level; stub them so import is side-effect free."""
    for name in ("asyncpg", "psycopg2", "psycopg2.extras"):
        sys.modules.setdefault(name, types.ModuleType(name))


def _load(name: str) -> types.ModuleType | None:
    path = SEED_DIR / f"{name}.py"
    if not path.exists():
        print(f"  [skip] {name}: not found", file=sys.stderr)
        return None
    spec = importlib.util.spec_from_file_location(f"_chronicle_seed_{name}", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _norm_category(raw: Any) -> str:
    cat = str(raw or "political").lower()
    if cat in FRONTEND_CATEGORIES:
        return cat
    return CATEGORY_FALLBACK.get(cat, "cultural")


# network_y is intentionally omitted: the DB value comes from scripts/compute_network_layout.py
# (pixel offsets), and without it NetworkView computes the same tree layout client-side.


def _year_label(year: int) -> str:
    return f"{abs(year)} BCE" if year < 0 else f"{year} CE"


def collect_events() -> dict[str, dict[str, Any]]:
    """Return slug → raw event dict (first definition wins, like the seeders' skip-if-exists)."""
    events: dict[str, dict[str, Any]] = {}
    for name in EVENT_MODULES:
        module = _load(name)
        if module is None:
            continue
        for ev in getattr(module, "EVENTS", []) or []:
            if not isinstance(ev, dict) or not ev.get("slug"):
                continue
            if ev.get("lat") is None or ev.get("lng") is None or ev.get("year") is None:
                continue
            events.setdefault(ev["slug"], ev)
    return events


def _resolve_fragment(fragment: str, by_title: list[tuple[str, str, float]]) -> str | None:
    """Mimic the seeders' ``title ILIKE '%a%b%'`` lookup (highest importance wins)."""
    parts = [p.lower() for p in fragment.split("%") if p.strip()]
    best: tuple[float, str] | None = None
    for slug, title, importance in by_title:
        t = title.lower()
        pos = 0
        ok = True
        for p in parts:
            idx = t.find(p, pos)
            if idx < 0:
                ok = False
                break
            pos = idx + len(p)
        if ok and (best is None or importance > best[0]):
            best = (importance, slug)
    return best[1] if best else None


def collect_links(events: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    by_title = [(s, e["title"], float(e.get("importance_score", 0.5))) for s, e in events.items()]
    links: dict[tuple[str, str], dict[str, Any]] = {}
    for module_name, attr in LINK_SOURCES:
        module = _load(module_name)
        if module is None:
            continue
        for raw in getattr(module, attr, []) or []:
            if isinstance(raw, dict):
                cause, effect = raw.get("cause"), raw.get("effect")
                link_type = raw.get("type") or raw.get("link_type") or "direct"
                strength = raw.get("strength", 0.5)
                desc = raw.get("desc") or raw.get("description")
                cause = cause if cause in events else None
                effect = effect if effect in events else None
            elif isinstance(raw, (tuple, list)) and len(raw) >= 5:
                c_frag, e_frag, link_type, strength, desc = raw[:5]
                cause = c_frag if c_frag in events else _resolve_fragment(str(c_frag), by_title)
                effect = e_frag if e_frag in events else _resolve_fragment(str(e_frag), by_title)
            else:
                continue
            if not cause or not effect or cause == effect:
                continue
            links.setdefault(
                (cause, effect),
                {
                    "cause": cause,
                    "effect": effect,
                    "connection_type": LINK_TYPE_MAP.get(str(link_type), "context"),
                    "strength": round(float(strength), 3),
                    "description": desc,
                },
            )
    return list(links.values())


VERBOSE = bool(os.environ.get("CHRONICLE_EXPORT_VERBOSE"))
_STOPWORDS = {"the", "of", "and", "a", "an", "in", "on", "to", "for", "at", "by", "with", "from"}


# Words too generic to identify an event on their own ("Battle of Midway — Turning Point"
# vs "Battle of Stalingrad — Turning Point" are different events).
_GENERIC = {
    "battle", "turning", "point", "war", "wars", "settlement", "death", "rise", "founding",
    "founds", "founded", "first", "end", "begins", "age", "empire", "kingdom", "great", "new",
    "birth", "peak", "construction", "after", "under", "its", "publishes", "published",
}


# Words are cut to this many characters before comparing, a cheap stand-in for stemming
# ("decolonize" / "decolonization", "conquers" / "conquest").
_STEM_CHARS = 6

# Seed batches sometimes date the same event a year or two apart (start vs. end of a
# conquest). Near-identical titles within this many years are treated as one event.
NEAR_YEAR_WINDOW = 3


def _title_words(title: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", title.lower().replace("\u2019s", "").replace("'s", ""))
    return {w for w in words if w not in _STOPWORDS}


def _key_words(title: str) -> set[str]:
    """Distinctive, roughly stemmed title words used to spot duplicates."""
    return {w[:_STEM_CHARS] for w in _title_words(title) - _GENERIC}


def is_duplicate(a: dict[str, Any], b: dict[str, Any]) -> bool:
    """True when two seed events describe the same thing.

    Same year: the titles share two or more key words covering half of the shorter title,
    or one title's key words are a subset of the other's. Up to NEAR_YEAR_WINDOW years
    apart: one title's key words (at least two of them) are a subset of the other's.
    """
    gap = abs(int(a["year"]) - int(b["year"]))
    if gap > NEAR_YEAR_WINDOW:
        return False
    words, other = _key_words(a["title"]), _key_words(b["title"])
    if not words or not other:
        return False
    shared = len(words & other)
    subset = words <= other or other <= words
    if gap == 0:
        return (shared >= 2 and shared / min(len(words), len(other)) >= 0.5) or subset
    return subset and min(len(words), len(other)) >= 2


def merge_duplicates(
    events: dict[str, dict[str, Any]], links: list[dict[str, Any]]
) -> tuple[dict[str, dict[str, Any]], list[dict[str, Any]]]:
    """Collapse near-duplicate events that different seed batches added under different slugs.

    See ``is_duplicate`` for the matching rule, e.g. "Revolutions of 1848 — The Springtime
    of Nations" and "Revolutions of 1848 — Springtime of Peoples" (same year), or
    "Spanish Conquest of the Aztec Empire" dated 1519 in one batch and 1521 in another.
    The better-connected (then more important) one is kept and links are re-pointed to it.
    """
    degree: dict[str, int] = defaultdict(int)
    for link in links:
        degree[link["cause"]] += 1
        degree[link["effect"]] += 1
    rank = lambda s: (-degree.get(s, 0), -float(events[s].get("importance_score", 0.5)), s)  # noqa: E731
    canonical: dict[str, str] = {}
    kept: list[str] = []
    for slug in sorted(events, key=rank):
        for k in kept:
            if is_duplicate(events[slug], events[k]):
                canonical[slug] = k
                if VERBOSE:
                    print(f"  merge: {events[slug]['title']!r} -> {events[k]['title']!r}", file=sys.stderr)
                break
        else:
            kept.append(slug)
    merged_links: dict[tuple[str, str], dict[str, Any]] = {}
    for link in links:
        cause = canonical.get(link["cause"], link["cause"])
        effect = canonical.get(link["effect"], link["effect"])
        if cause != effect:
            merged_links.setdefault((cause, effect), {**link, "cause": cause, "effect": effect})
    return {s: e for s, e in events.items() if s not in canonical}, list(merged_links.values())


def select_subset(
    events: dict[str, dict[str, Any]], links: list[dict[str, Any]], limit: int
) -> tuple[list[str], list[dict[str, Any]]]:
    """Pick the best-connected events (degree, then importance) and the links among them."""
    degree: dict[str, int] = defaultdict(int)
    for link in links:
        degree[link["cause"]] += 1
        degree[link["effect"]] += 1
    ranked = sorted(
        events,
        key=lambda s: (-degree.get(s, 0), -float(events[s].get("importance_score", 0.5)), s),
    )
    chosen = set(ranked[:limit])
    kept = [l for l in links if l["cause"] in chosen and l["effect"] in chosen]
    # Order events chronologically for readability / stable diffs.
    ordered = sorted(chosen, key=lambda s: (events[s]["year"], s))
    return ordered, kept


def build_snapshot(min_year: int, limit: int) -> dict[str, Any]:
    _stub_db_modules()
    events = collect_events()
    # The canvas spans 5000 BCE – 2100 CE (CANVAS_CONSTANTS); deep-prehistory events
    # would never be visible in the demo, so leave them out.
    events = {slug: ev for slug, ev in events.items() if int(ev["year"]) >= min_year}
    links = collect_links(events)
    events, links = merge_duplicates(events, links)
    slugs, kept_links = select_subset(events, links, limit)

    out_events = []
    details: dict[str, Any] = {}
    for slug in slugs:
        ev = events[slug]
        year = int(ev["year"])
        raw_cat = str(ev.get("category") or "political").lower()
        importance = float(ev.get("importance_score", 0.5))
        perspectives = []
        for i, p in enumerate((ev.get("perspectives") or [])[:3]):
            vtype = str(p.get("viewpoint_type") or "academic")
            perspectives.append(
                {
                    "id": f"{slug}-p{i + 1}",
                    "label": p.get("label", "Perspective"),
                    "perspective_type": vtype if vtype in PERSPECTIVE_TYPES else "academic",
                    "viewpoint_type": vtype,
                    "culture_code": p.get("culture_code"),
                    "summary": p.get("summary") or "",
                    "narrative": p.get("narrative") or "",
                    "evidence_score": float(p.get("evidence_score") or 0.5),
                    "sources": [
                        {
                            "id": f"{slug}-p{i + 1}-s{j + 1}",
                            "title": s.get("title", ""),
                            **({"author": s["author"]} if s.get("author") else {}),
                            **({"publication": s["publication"]} if s.get("publication") else {}),
                            "source_type": s.get("source_type", "secondary"),
                            **({"reliability_tier": s["reliability_tier"]} if s.get("reliability_tier") else {}),
                            "peer_reviewed": bool(s.get("peer_reviewed", False)),
                        }
                        for j, s in enumerate((p.get("sources") or [])[:3])
                        if isinstance(s, dict)
                    ],
                }
            )
        out_events.append(
            {
                "id": slug,
                "slug": slug,
                "title": ev["title"],
                "year_approx": year,
                "date_display": ev.get("date_display") or _year_label(year),
                "lat": round(float(ev["lat"]), 4),
                "lng": round(float(ev["lng"]), 4),
                "geo_modern": ev.get("geo_modern"),
                "geo_era_label": ev.get("geo_era_label"),
                "category": _norm_category(raw_cat),
                "importance_score": round(importance, 3),
                "perspective_count": len(ev.get("perspectives") or []),
                "is_bce": year < 0,
            }
        )
        if perspectives:
            details[slug] = {"perspectives": perspectives}

    out_links = [
        {
            "id": f"{l['cause']}__{l['effect']}",
            "cause_event_id": l["cause"],
            "effect_event_id": l["effect"],
            "connection_type": l["connection_type"],
            "strength": l["strength"],
            **({"description": l["description"]} if l.get("description") else {}),
        }
        for l in sorted(kept_links, key=lambda l: (l["cause"], l["effect"]))
    ]

    return {
        "version": 1,
        "generator": "scripts/export_demo_snapshot.py",
        "source": "backend/scripts seed data",
        "license": LICENSE_NOTICE,
        "stats": {
            "events": len(out_events),
            "links": len(out_links),
            "source_events": len(events),
            "source_links": len(links),
        },
        "events": out_events,
        "links": out_links,
        "details": details,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--limit", type=int, default=300, help="max events in the snapshot (default 300)")
    parser.add_argument("--min-year", type=int, default=-5000, help="earliest year to include (default -5000)")
    parser.add_argument("--out", type=Path, default=OUT_PATH, help="output path")
    args = parser.parse_args()

    snapshot = build_snapshot(args.min_year, args.limit)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(snapshot, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    s = snapshot["stats"]
    size_kb = args.out.stat().st_size / 1024
    print(
        f"Wrote {args.out.relative_to(ROOT) if args.out.is_relative_to(ROOT) else args.out}: "
        f"{s['events']} events, {s['links']} links "
        f"(from {s['source_events']} events / {s['source_links']} links), {size_kb:.0f} KB"
    )


if __name__ == "__main__":
    main()
