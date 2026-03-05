#!/usr/bin/env python3
"""
compute_network_layout.py

Computes optimal network_y positions for all events in the Chronicle DB
and persists them to the events.network_y column.

Run whenever causality links change significantly:
  python3 scripts/compute_network_layout.py

Algorithm:
  1. Load all events + causality_links from DB
  2. Build directed adjacency graph (cause → effect)
  3. BFS from root nodes to assign causal depth
  4. Assign Y based on depth with sign inheritance from parent chain
  5. Run 20 passes of collision resolution (more than client-side 3)
  6. UPDATE all events with computed network_y
"""

import asyncio
import asyncpg
from collections import defaultdict, deque
from typing import Optional

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ─────────────────────────────────────────────────────────────────────────────
# Y spacing constants (pixels in canvas space)
# ─────────────────────────────────────────────────────────────────────────────

DEPTH_SPACING = 180              # px between depth levels
MAX_DEPTH_LEVELS = [0, 180, 324, 432, 504, 540]  # depth 0–5+
ISOLATED_NUDGE = 90              # px for nodes with no connections
COLLISION_RADIUS = 55            # min distance between node centers at same X-bucket
COLLISION_PASSES = 20            # more passes than client-side 3 for better resolution
YEAR_BUCKET_SIZE = 60            # years — nodes within this range compete for Y space


async def load_data(conn):
    """Load all events and causality links from the database."""
    events = await conn.fetch("SELECT id, year_approx FROM events ORDER BY year_approx")
    links = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    return events, links


def build_graph(events, links):
    """Build adjacency maps (outgoing and incoming) from events and links."""
    all_ids = {str(e['id']) for e in events}
    outgoing = defaultdict(set)   # cause → set of effects
    incoming = defaultdict(set)   # effect → set of causes

    for link in links:
        c, e = str(link['cause_event_id']), str(link['effect_event_id'])
        if c in all_ids and e in all_ids:
            outgoing[c].add(e)
            incoming[e].add(c)

    return outgoing, incoming


def compute_depths_and_signs(events, outgoing, incoming):
    """
    BFS from root nodes to assign (depth, sign) to every connected node.

    Sign (+1 / -1) is inherited from parent so entire chains stay above/below
    the center spine. Root nodes alternate between +1 and -1.

    Returns dict: id → (depth, sign)
    """
    all_ids = [str(e['id']) for e in events]

    # Root nodes: have outgoing links but no incoming
    roots = [eid for eid in all_ids if outgoing[eid] and not incoming[eid]]

    assignment = {}       # id → (depth, sign)
    sign_counter = [0]    # alternates for different root chains

    queue = deque()
    for root in roots:
        sign = 1 if sign_counter[0] % 2 == 0 else -1
        sign_counter[0] += 1
        queue.append((root, 0, sign))

    while queue:
        node_id, depth, sign = queue.popleft()
        if node_id in assignment:
            continue
        assignment[node_id] = (depth, sign)

        for child in outgoing[node_id]:
            if child not in assignment:
                # Children alternate sign relative to parent at each level
                child_sign = sign if depth % 2 == 0 else -sign
                queue.append((child, depth + 1, child_sign))

    return assignment


def depth_to_y(depth: int, sign: int) -> float:
    """Map causal depth + sign to a canvas Y coordinate (pixels)."""
    if depth >= len(MAX_DEPTH_LEVELS):
        magnitude = MAX_DEPTH_LEVELS[-1]
    else:
        magnitude = MAX_DEPTH_LEVELS[depth]
    return sign * magnitude


def resolve_collisions(positions: dict, events, passes: int = COLLISION_PASSES) -> dict:
    """
    Push nodes apart if they're too close vertically within the same time bucket.

    Groups nodes by year_approx // YEAR_BUCKET_SIZE, then sorts by Y and
    pushes any pair closer than COLLISION_RADIUS apart.

    Returns updated positions dict.
    """
    event_years = {str(e['id']): e['year_approx'] for e in events}
    pos = dict(positions)

    for _ in range(passes):
        # Group by year bucket
        buckets = defaultdict(list)
        for node_id, y in pos.items():
            year = event_years.get(node_id)
            if year is None:
                continue
            bucket = year // YEAR_BUCKET_SIZE
            buckets[bucket].append(node_id)

        for bucket_nodes in buckets.values():
            # Sort by current Y position
            bucket_nodes.sort(key=lambda nid: pos[nid])
            # Push apart any nodes within COLLISION_RADIUS
            for i in range(len(bucket_nodes) - 1):
                a, b = bucket_nodes[i], bucket_nodes[i + 1]
                gap = pos[b] - pos[a]
                if gap < COLLISION_RADIUS:
                    push = (COLLISION_RADIUS - gap) / 2
                    pos[a] -= push
                    pos[b] += push

    return pos


async def compute_and_persist():
    """Main entry point: load data, compute layout, write back to DB."""
    conn = await asyncpg.connect(DB_URL)

    print("Loading events and links...")
    events, links = await load_data(conn)
    print(f"  {len(events)} events, {len(links)} links")

    if not events:
        print("No events found — nothing to compute.")
        await conn.close()
        return

    outgoing, incoming = build_graph(events, links)

    print("Computing depths and signs via BFS...")
    assignment = compute_depths_and_signs(events, outgoing, incoming)

    # Build initial Y positions
    positions = {}
    for event in events:
        eid = str(event['id'])
        if eid in assignment:
            depth, sign = assignment[eid]
            positions[eid] = depth_to_y(depth, sign)
        else:
            # Isolated node: deterministic nudge based on ID hash
            hex_tail = eid[-4:].replace('-', '')
            hval = int(hex_tail, 16) % 2 if hex_tail else 0
            positions[eid] = ISOLATED_NUDGE * (1 if hval == 0 else -1)

    print(f"Resolving collisions ({COLLISION_PASSES} passes)...")
    positions = resolve_collisions(positions, events)

    print("Persisting to DB...")
    updates = [(positions[str(e['id'])], e['id']) for e in events]
    await conn.executemany("UPDATE events SET network_y = $1 WHERE id = $2", updates)

    print(f"Done. Updated {len(updates)} events.")

    # Stats
    ys = list(positions.values())
    if ys:
        print(f"  Y range: {min(ys):.0f} to {max(ys):.0f}")
    print(f"  Connected nodes: {len(assignment)}")
    print(f"  Isolated nodes: {len(events) - len(assignment)}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(compute_and_persist())
