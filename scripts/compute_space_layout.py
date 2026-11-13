#!/usr/bin/env python3
"""Precompute 3D positions for the space view (frontend/src/space/).

Reads the demo snapshot (events and links) and writes a small JSON file that the
space view loads next to it:

    python3 scripts/compute_space_layout.py
    python3 scripts/compute_space_layout.py --snapshot path/to/snapshot.json --out /tmp/space-layout.json

Layout:
  * X is time. A log scale on "years before REF_YEAR" gives recent centuries more
    room than the Neolithic: x = -UNITS * ln(1 + (REF_YEAR - year) / TAU).
    The frontend reads the same constants from the output file, so the year axis
    and the planets always agree.
  * Y and Z come from a force layout with X held fixed. Linked events pull
    together, nearby events push apart, and a weak pull toward the time axis
    keeps the cloud around it.

Standard library only, and deterministic: the same snapshot always produces the
same file, so CI can check that the committed layout is up to date.
"""
from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SNAPSHOT = ROOT / "frontend" / "public" / "demo" / "snapshot.json"
DEFAULT_OUT = ROOT / "frontend" / "public" / "demo" / "space-layout.json"

LAYOUT_VERSION = 1

# Time scale (shared with the frontend through the output file).
REF_YEAR = 2100.0   # the scale's zero point, a little past the newest event
TAU = 60.0          # years; below this distance from REF_YEAR the scale is close to linear
UNITS = 1000.0      # scene units per e-fold of "years before REF_YEAR"

# Force layout.
ITERATIONS = 240
REST_LENGTH = 14.0      # preferred 3D distance between linked events
SPRING = 0.06           # link pull
REPULSION = 900.0       # push between nearby events
CUTOFF = 60.0           # events farther apart than this do not push each other
GRAVITY = 0.004         # pull toward the time axis (y = z = 0)
START_RADIUS = 160.0    # initial spread around the axis
MAX_STEP_START = 18.0   # largest move per iteration, cooled linearly
MAX_STEP_END = 0.4

# Planet radius from link count.
RADIUS_BASE = 1.2
RADIUS_PER_SQRT_DEGREE = 0.8
RADIUS_MAX = 5.0

CONFIDENCE_RANK = {"established": 3, "debated": 2, "speculative": 1}


def year_to_x(year: float, ref_year: float = REF_YEAR, tau: float = TAU, units: float = UNITS) -> float:
    """Scene X for a year (negative years are BCE). Monotonic: later years sit further right."""
    before = max(ref_year - year, 0.0)
    return -units * math.log1p(before / tau)


def x_to_year(x: float, ref_year: float = REF_YEAR, tau: float = TAU, units: float = UNITS) -> float:
    """Inverse of year_to_x."""
    return ref_year - tau * math.expm1(-x / units)


def _hash01(text: str, salt: int) -> float:
    """Deterministic value in [0, 1) from a string (FNV-1a, so it does not depend on PYTHONHASHSEED)."""
    h = 2166136261 ^ salt
    for ch in text.encode("utf-8"):
        h ^= ch
        h = (h * 16777619) & 0xFFFFFFFF
    return h / 4294967296.0


def ids_hash(ids: list[str]) -> str:
    """FNV-1a (32-bit, hex) of the newline-joined event ids. The frontend computes the same
    value from the snapshot to check that the layout lines up with it."""
    h = 2166136261
    for ch in "\n".join(ids).encode("utf-8"):
        h ^= ch
        h = (h * 16777619) & 0xFFFFFFFF
    return f"{h:08x}"


def _initial_yz(event_id: str) -> tuple[float, float]:
    angle = 2.0 * math.pi * _hash01(event_id, 1)
    radius = START_RADIUS * math.sqrt(_hash01(event_id, 2))
    return radius * math.cos(angle), radius * math.sin(angle)


def compute_layout(events: list[dict], links: list[dict], iterations: int = ITERATIONS) -> dict:
    """Return the space-layout document for the given snapshot events and links."""
    ids = [e["id"] for e in events]
    index = {eid: i for i, eid in enumerate(ids)}
    n = len(ids)

    xs = [round(year_to_x(float(e.get("year_approx", 0))), 2) for e in events]
    ys = [0.0] * n
    zs = [0.0] * n
    for i, eid in enumerate(ids):
        ys[i], zs[i] = _initial_yz(eid)

    edges: list[tuple[int, int, float]] = []
    degree = [0] * n
    confidence = [0] * n
    seen: set[tuple[int, int]] = set()
    for link in links:
        a = index.get(link.get("cause_event_id"))
        b = index.get(link.get("effect_event_id"))
        if a is None or b is None or a == b:
            continue
        key = (min(a, b), max(a, b))
        rank = CONFIDENCE_RANK.get(link.get("confidence", ""), 0)
        confidence[a] = max(confidence[a], rank)
        confidence[b] = max(confidence[b], rank)
        if key in seen:
            continue
        seen.add(key)
        degree[a] += 1
        degree[b] += 1
        # Curated, cited links pull harder than imported "part of" context links.
        weight = 1.0 + 0.5 * rank + float(link.get("strength", 0.5) or 0.5)
        edges.append((a, b, weight))

    # Linked events start next to their partner so springs do not have to drag them across the cloud.
    for _ in range(4):
        for a, b, _w in edges:
            my = (ys[a] + ys[b]) / 2.0
            mz = (zs[a] + zs[b]) / 2.0
            ys[a] = ys[a] * 0.6 + my * 0.4
            zs[a] = zs[a] * 0.6 + mz * 0.4
            ys[b] = ys[b] * 0.6 + my * 0.4
            zs[b] = zs[b] * 0.6 + mz * 0.4

    cell = CUTOFF
    cutoff_sq = CUTOFF * CUTOFF
    for it in range(iterations):
        fy = [0.0] * n
        fz = [0.0] * n

        # Repulsion between nearby events (spatial hash on all three axes).
        grid: dict[tuple[int, int, int], list[int]] = defaultdict(list)
        for i in range(n):
            grid[(math.floor(xs[i] / cell), math.floor(ys[i] / cell), math.floor(zs[i] / cell))].append(i)
        for (cx, cy, cz), members in grid.items():
            neighbours: list[int] = []
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    for dz in (-1, 0, 1):
                        neighbours.extend(grid.get((cx + dx, cy + dy, cz + dz), ()))
            for i in members:
                xi, yi, zi = xs[i], ys[i], zs[i]
                for j in neighbours:
                    if j <= i:
                        continue
                    ddy = yi - ys[j]
                    ddz = zi - zs[j]
                    ddx = xi - xs[j]
                    d_sq = ddx * ddx + ddy * ddy + ddz * ddz
                    if d_sq >= cutoff_sq:
                        continue
                    yz_sq = ddy * ddy + ddz * ddz
                    if yz_sq < 1e-6:
                        angle = 2.0 * math.pi * _hash01(ids[i] + ids[j], 3)
                        ddy, ddz, yz_sq = math.cos(angle), math.sin(angle), 1.0
                    yz = math.sqrt(yz_sq)
                    push = REPULSION / max(d_sq, 1.0)
                    py = push * ddy / yz
                    pz = push * ddz / yz
                    fy[i] += py
                    fz[i] += pz
                    fy[j] -= py
                    fz[j] -= pz

        # Springs along links.
        for a, b, w in edges:
            ddx = xs[b] - xs[a]
            ddy = ys[b] - ys[a]
            ddz = zs[b] - zs[a]
            dist = math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) or 1e-6
            yz = math.sqrt(ddy * ddy + ddz * ddz)
            if yz < 1e-6:
                continue
            # Pull only in Y/Z. When X alone already exceeds the rest length, close the Y/Z gap fully.
            pull = SPRING * w * min(dist - REST_LENGTH, yz) if dist > REST_LENGTH else -SPRING * w * (REST_LENGTH - dist)
            py = pull * ddy / yz
            pz = pull * ddz / yz
            fy[a] += py
            fz[a] += pz
            fy[b] -= py
            fz[b] -= pz

        max_step = MAX_STEP_START + (MAX_STEP_END - MAX_STEP_START) * it / max(iterations - 1, 1)
        for i in range(n):
            gy = fy[i] - GRAVITY * ys[i]
            gz = fz[i] - GRAVITY * zs[i]
            mag = math.sqrt(gy * gy + gz * gz)
            if mag > max_step:
                gy *= max_step / mag
                gz *= max_step / mag
            ys[i] += gy
            zs[i] += gz

    radius = [round(min(RADIUS_BASE + RADIUS_PER_SQRT_DEGREE * math.sqrt(d), RADIUS_MAX), 2) for d in degree]
    positions: list[float] = []
    for i in range(n):
        positions.extend((xs[i], round(ys[i], 2), round(zs[i], 2)))

    return {
        "version": LAYOUT_VERSION,
        "generator": "scripts/compute_space_layout.py",
        "time_scale": {"ref_year": REF_YEAR, "tau": TAU, "units": UNITS},
        "count": n,
        # Positions follow the snapshot's event order. The ids are not repeated here
        # (they would add ~75 KB); this hash lets the frontend check the order instead.
        "ids_hash": ids_hash(ids),
        "positions": positions,
        "radius": radius,
        "degree": degree,
        # 0 = no rated link, 1 = speculative, 2 = debated, 3 = established (best link touching the event).
        "confidence": confidence,
    }


def dumps(doc: dict) -> str:
    return json.dumps(doc, separators=(",", ":"), ensure_ascii=False) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--snapshot", type=Path, default=DEFAULT_SNAPSHOT)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--iterations", type=int, default=ITERATIONS)
    args = parser.parse_args()

    snapshot = json.loads(args.snapshot.read_text(encoding="utf-8"))
    doc = compute_layout(snapshot["events"], snapshot["links"], iterations=args.iterations)
    args.out.write_text(dumps(doc), encoding="utf-8")
    print(f"Wrote {args.out} ({doc['count']} events, {len(doc['positions']) // 3} positions)")


if __name__ == "__main__":
    main()
