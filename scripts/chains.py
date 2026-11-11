"""Pick shareable cause-and-effect chains from the demo snapshot's causality graph.

A chain is a path of 3 to 6 events where each step is a link from the snapshot and
time runs forward (a cause never starts after its effect). Chains are scored by how
well known their events are and how strong their links are, then picked greedily so
the published set does not repeat the same stretch of history.

Each chain gets a stable slug built from its first and last event slugs, so a link
posted today keeps working as long as both endpoints stay in the snapshot.

Standard library only; imported by export_demo_snapshot.py.
"""
from __future__ import annotations

from collections import defaultdict
from typing import Any

MIN_LEN = 3
MAX_LEN = 6
# Followed per node while searching; keeps the search small on dense graphs.
BRANCH = 5
TYPE_WEIGHT = {"causes": 1.0, "enables": 0.85, "context": 0.45}
# At least this share of a chain's steps must be causes/enables links.
MIN_CAUSAL_SHARE = 0.5
MAX_OVERLAP = 0.5


def _short(title: str) -> str:
    return title.split(" — ")[0].strip()


def chain_title(events: list[dict[str, Any]]) -> str:
    return f"From {_short(events[0]['title'])} to {_short(events[-1]['title'])}"


def find_chains(events: list[dict[str, Any]], links: list[dict[str, Any]], limit: int = 120) -> list[dict[str, Any]]:
    """Return up to ``limit`` chains as {slug, title, event_ids, link_ids, score}."""
    by_id = {e["id"]: e for e in events}
    order = {e["id"]: (e["year_approx"], e["id"]) for e in events}
    out_edges: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for link in links:
        c, e = link["cause_event_id"], link["effect_event_id"]
        if c not in by_id or e not in by_id:
            continue
        if order[c] >= order[e]:  # time must run forward; also breaks cycles
            continue
        out_edges[c].append(link)

    def edge_rank(link: dict[str, Any]) -> tuple[float, str]:
        target = by_id[link["effect_event_id"]]
        w = TYPE_WEIGHT.get(link["connection_type"], 0.4) * float(link["strength"])
        return (-(w + target["importance_score"]), link["effect_event_id"])

    for c in out_edges:
        out_edges[c].sort(key=edge_rank)
        out_edges[c] = out_edges[c][:BRANCH]

    candidates: list[tuple[float, list[str], list[str]]] = []

    def score(path: list[str], steps: list[dict[str, Any]]) -> float | None:
        causal = sum(1 for s in steps if s["connection_type"] in ("causes", "enables"))
        if causal / len(steps) < MIN_CAUSAL_SHARE:
            return None
        imp = sum(by_id[p]["importance_score"] for p in path) / len(path)
        link_w = sum(TYPE_WEIGHT.get(s["connection_type"], 0.4) * float(s["strength"]) for s in steps) / len(steps)
        span = by_id[path[-1]]["year_approx"] - by_id[path[0]]["year_approx"]
        # Longer chains and chains that cross more time read better as a story.
        return round(imp * link_w * (1 + 0.12 * (len(path) - MIN_LEN)) * (1 + min(span, 300) / 1500), 6)

    def walk(path: list[str], steps: list[dict[str, Any]]) -> None:
        if len(path) >= MIN_LEN:
            s = score(path, steps)
            if s is not None:
                candidates.append((s, list(path), [f"{x['cause_event_id']}__{x['effect_event_id']}" for x in steps]))
        if len(path) == MAX_LEN:
            return
        for link in out_edges.get(path[-1], []):
            nxt = link["effect_event_id"]
            if nxt in path:
                continue
            path.append(nxt)
            steps.append(link)
            walk(path, steps)
            path.pop()
            steps.pop()

    has_incoming = {l["effect_event_id"] for ls in out_edges.values() for l in ls}
    starts = sorted((n for n in out_edges if n not in has_incoming or by_id[n]["importance_score"] >= 0.75), key=lambda n: order[n])
    for start in starts:
        walk([start], [])

    candidates.sort(key=lambda c: (-c[0], c[1]))
    chosen: list[dict[str, Any]] = []
    used_pairs: set[tuple[str, str]] = set()
    seen_slugs: set[str] = set()
    for s, path, link_ids in candidates:
        pset = set(path)
        if any(len(pset & set(c["event_ids"])) / min(len(pset), len(c["event_ids"])) > MAX_OVERLAP for c in chosen):
            continue
        ends = (path[0], path[-1])
        if ends in used_pairs:
            continue
        slug = f"{path[0]}-to-{path[-1]}"
        if slug in seen_slugs:
            continue
        used_pairs.add(ends)
        seen_slugs.add(slug)
        chosen.append({
            "slug": slug,
            "title": chain_title([by_id[p] for p in path]),
            "event_ids": path,
            "link_ids": link_ids,
            "score": s,
        })
        if len(chosen) >= limit:
            break
    chosen.sort(key=lambda c: (by_id[c["event_ids"][0]]["year_approx"], c["slug"]))
    return chosen
