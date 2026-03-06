#!/usr/bin/env python3
"""
compute_network_layout.py

Computes optimal network_y positions for all events in the Chronicle DB
and persists them to the events.network_y column.

Run whenever causality links change significantly:
  python3 scripts/compute_network_layout.py

With group-aware clustering (requires is_group / parent_event_id columns):
  python3 scripts/compute_network_layout.py --groups

Algorithm:
  1. Load all events + causality_links from DB
  2. Build directed adjacency graph (cause → effect)
  3. BFS from root nodes to assign causal depth
  4. Assign Y based on depth with sign inheritance from parent chain
  5. (--groups) Pull group children toward their parent's Y position
  6. (--groups) Compact oversized group spans to fit within MAX_GROUP_SPREAD
  7. UPDATE all events with computed network_y
"""

import argparse
import asyncio
import asyncpg
import re
from collections import defaultdict, deque
from typing import List, Optional, Tuple

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ─────────────────────────────────────────────────────────────────────────────
# Reference viewport constants (from frontend/src/types/index.ts)
# ─────────────────────────────────────────────────────────────────────────────

REFERENCE_YEAR_MIN = -800        # Default timeViewport yearMin
REFERENCE_YEAR_MAX = 1500        # Default timeViewport yearMax
REFERENCE_TIME_SPAN = REFERENCE_YEAR_MAX - REFERENCE_YEAR_MIN   # 2300 years
CANVAS_WIDTH = 2000              # px — reference canvas width

# ─────────────────────────────────────────────────────────────────────────────
# Node size constants — must match EventNode.tsx exactly.
#
# EventNode formula:
#   NODE_SIZE_BASE = timeSpan * 0.01 > 10 ? 500 / (timeSpan * 0.01) : 50
# At REFERENCE_TIME_SPAN = 2300: 2300 * 0.01 = 23 > 10
#   → NODE_SIZE_BASE = 500 / 23 ≈ 21.74 px
# ─────────────────────────────────────────────────────────────────────────────

NODE_SIZE_BASE = (
    500 / (REFERENCE_TIME_SPAN * 0.01)
    if REFERENCE_TIME_SPAN * 0.01 > 10
    else 50
)  # ≈ 21.74 px at reference span — matches EventNode.tsx
NODE_SIZE_IMPORTANCE_RANGE = 20  # px — additional size for max-importance nodes

# Max circle height at reference zoom (importance=1.0): NODE_SIZE_BASE + 20 ≈ 42 px
MAX_NODE_HEIGHT = NODE_SIZE_BASE + NODE_SIZE_IMPORTANCE_RANGE

# ─────────────────────────────────────────────────────────────────────────────
# Y spacing constants (pixels in canvas space)
# ─────────────────────────────────────────────────────────────────────────────

DEPTH_SPACING = 80               # px between depth levels (spine → branch 1 → branch 2 …)
# Cumulative Y magnitude at each depth (depth 0 = spine = 0, depth 1 = ±80, etc.)
MAX_DEPTH_LEVELS = [0, 80, 150, 210, 260, 300]
ISOLATED_NUDGE = 40              # px nudge for nodes with no causality connections
LANE_SPACING = 60                # px between lanes within the same (depth, sign) group
HORIZONTAL_GAP = 10              # px — minimum X clearance between nodes in the same lane

# ─────────────────────────────────────────────────────────────────────────────
# Group layout constants
# ─────────────────────────────────────────────────────────────────────────────

GROUP_CHILD_SPACING = 30         # px between children when distributing around parent Y
MAX_GROUP_SPREAD = 300           # px — maximum Y spread for a group's bounding box
COMPACT_THRESHOLD = 200          # px — start compacting if spread exceeds this
REPULSION_RADIUS = 50            # px — minimum Y distance between non-sibling nodes after group pull


def parse_year_from_date(date_str: Optional[str], is_bce: bool = False) -> Optional[int]:
    """
    Parse year from date string like "1939-09-01".
    Uses is_bce flag to determine if date is BC/BCE.
    Returns negative year for BC dates, None if unparseable.
    """
    if not date_str:
        return None
    date_str = date_str.strip()

    # Check for BC suffix in string (backup check)
    bc_match = re.match(r'^(\d{1,4})-\d{2}-\d{2}\s*BC$', date_str, re.IGNORECASE)
    if bc_match:
        return -int(bc_match.group(1))

    # Standard date format (CE or BCE based on flag)
    ce_match = re.match(r'^(-?\d{1,4})-\d{2}-\d{2}', date_str)
    if ce_match:
        year = int(ce_match.group(1))
        if is_bce:
            return -abs(year)  # Negate year for BCE
        return year

    return None


def compute_event_width(
    date_earliest: Optional[str],
    date_latest: Optional[str],
    year_approx: int,
    importance_score: float,
    is_bce: bool = False
) -> float:
    """
    Compute the width of an event node in canvas pixels.

    Pills (events with duration) are sized by their time span.
    Circles (point-in-time) use the importance-based node size.
    Returns the larger of the two.
    """
    # Node size based on importance (circle size)
    node_size = NODE_SIZE_BASE + importance_score * NODE_SIZE_IMPORTANCE_RANGE

    # Parse years from dates
    start_year = parse_year_from_date(date_earliest, is_bce)
    end_year = parse_year_from_date(date_latest, is_bce)

    # Fall back to year_approx if dates are missing
    if start_year is None:
        start_year = year_approx
    if end_year is None:
        end_year = year_approx

    # Check for placeholder dates (Jan 1 / Dec 31 same year = no real duration)
    if date_earliest and date_latest:
        # If both are just the year boundaries, treat as point-in-time
        is_placeholder = (
            date_earliest.endswith("-01-01") and
            date_latest.endswith("-12-31") and
            start_year == end_year
        )
        if is_placeholder:
            return node_size

    # Compute pill width based on duration
    duration_years = end_year - start_year
    if duration_years <= 0:
        return node_size

    time_span = REFERENCE_YEAR_MAX - REFERENCE_YEAR_MIN
    pill_width = (duration_years / time_span) * CANVAS_WIDTH

    return max(node_size, pill_width)


def event_to_x(year: int) -> float:
    """Convert year to X position in canvas pixels."""
    time_span = REFERENCE_YEAR_MAX - REFERENCE_YEAR_MIN
    return ((year - REFERENCE_YEAR_MIN) / time_span) * CANVAS_WIDTH


async def load_data(conn, include_groups=False):
    """Load all events and causality links from the database."""
    # Cast dates to text to avoid asyncpg date parsing issues with unusual dates
    # Use is_bce flag to determine BC/BCE dates
    if include_groups:
        events = await conn.fetch("""
            SELECT
                id,
                year_approx,
                date_earliest::text as date_earliest,
                date_latest::text as date_latest,
                is_bce,
                importance_score,
                is_group,
                parent_event_id
            FROM events
            ORDER BY year_approx
        """)
    else:
        events = await conn.fetch("""
            SELECT
                id,
                year_approx,
                date_earliest::text as date_earliest,
                date_latest::text as date_latest,
                is_bce,
                importance_score
            FROM events
            ORDER BY year_approx
        """)
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
                # Inherit sign unchanged — entire causal chain stays on same side of spine
                queue.append((child, depth + 1, sign))

    return assignment


def compute_event_x_ranges(events) -> dict:
    """
    Compute X position and width for each event.

    Returns dict: id → (x_start, x_end)
    """
    x_ranges = {}
    for e in events:
        eid = str(e['id'])
        is_bce = e['is_bce'] if e['is_bce'] is not None else False

        # Get start year for X position
        start_year = parse_year_from_date(e['date_earliest'], is_bce)
        if start_year is None:
            start_year = e['year_approx']

        # Compute node width
        width = compute_event_width(
            e['date_earliest'],
            e['date_latest'],
            e['year_approx'],
            e['importance_score'] if e['importance_score'] is not None else 0.5,
            is_bce
        )

        x_start = event_to_x(start_year)
        x_end = x_start + width
        x_ranges[eid] = (x_start, x_end)

    return x_ranges


def assign_y_positions(events, assignment: dict, x_ranges: dict) -> dict:
    """
    Assign Y positions using BFS depth groups + greedy interval-scheduling lanes.

    Algorithm (replaces the old iterative-push approach):
    1. Group nodes by (depth, sign) — the BFS result.
    2. Within each group, sort nodes by X-start and greedily pack them into
       horizontal lanes (standard 1D interval scheduling / earliest-deadline-
       first). Each lane k within a group gets Y = base_y + k * LANE_SPACING,
       spreading away from the spine.
    3. Isolated nodes (not reachable by BFS) get a small fixed nudge.

    Properties:
    - Zero overlap within each depth group by construction.
    - No cascading or oscillation (single-pass).
    - Compact: uses the minimum number of lanes actually needed.
    - Preserves causal chain structure (BFS depth drives Y, not arbitrary push).
    """
    positions: dict[str, float] = {}

    # Group nodes by (depth, sign), collapse depth-0 sign into one group
    groups: dict[tuple, List[str]] = defaultdict(list)
    isolated: List[str] = []

    for e in events:
        eid = str(e['id'])
        if eid in assignment:
            depth, sign = assignment[eid]
            key = (depth, sign) if depth > 0 else (0, 1)  # depth-0 all share spine
            groups[key].append(eid)
        else:
            isolated.append(eid)

    for (depth, sign), node_ids in groups.items():
        base_magnitude = MAX_DEPTH_LEVELS[min(depth, len(MAX_DEPTH_LEVELS) - 1)]
        base_y = sign * base_magnitude

        # Sort by X start for greedy lane assignment
        ordered = sorted(
            node_ids,
            key=lambda nid: x_ranges.get(nid, (0, 0))[0]
        )

        # lane_ends[k] = rightmost X end currently in lane k
        lane_ends: List[float] = []
        lane_of: dict[str, int] = {}

        for nid in ordered:
            x_start, x_end = x_ranges.get(nid, (0.0, 0.0))
            assigned_lane = None
            for k, lane_end in enumerate(lane_ends):
                if x_start >= lane_end + HORIZONTAL_GAP:
                    assigned_lane = k
                    lane_ends[k] = x_end
                    break
            if assigned_lane is None:
                assigned_lane = len(lane_ends)
                lane_ends.append(x_end)
            lane_of[nid] = assigned_lane

        for nid, lane in lane_of.items():
            # Lane 0 sits at base_y; subsequent lanes spread away from the spine
            positions[nid] = base_y + lane * LANE_SPACING * sign

    # Isolated nodes: deterministic nudge from ID hash
    for eid in isolated:
        hex_tail = eid[-4:].replace('-', '')
        hval = int(hex_tail, 16) % 2 if hex_tail else 0
        positions[eid] = ISOLATED_NUDGE * (1 if hval == 0 else -1)

    return positions


# ─────────────────────────────────────────────────────────────────────────────
# Group-aware layout functions (Phase 1–2)
# ─────────────────────────────────────────────────────────────────────────────


def build_group_map(events):
    """
    Build mappings from the is_group / parent_event_id columns.

    Returns:
      group_children: dict mapping group_id (str) → list of child_id (str)
      child_to_group: dict mapping child_id (str) → group_id (str)
    """
    group_children: dict[str, List[str]] = defaultdict(list)
    child_to_group: dict[str, str] = {}

    for e in events:
        parent_id = e.get('parent_event_id')
        if parent_id is not None:
            gid = str(parent_id)
            cid = str(e['id'])
            group_children[gid].append(cid)
            child_to_group[cid] = gid

    return group_children, child_to_group


def pull_children_to_parent(positions, group_children):
    """
    Phase 1: Pull each group's children toward the parent group's Y position.

    For each group, evenly distribute children around the group's Y center
    using GROUP_CHILD_SPACING between each child. For example, 5 children
    get offsets: -60, -30, 0, +30, +60.
    """
    for gid, children in group_children.items():
        if gid not in positions or not children:
            continue

        group_y = positions[gid]
        n = len(children)

        # Evenly space children centered on group_y
        total_span = (n - 1) * GROUP_CHILD_SPACING
        start_offset = -total_span / 2

        # Sort children by their current Y so relative ordering is preserved
        children_sorted = sorted(children, key=lambda c: positions.get(c, 0))

        for i, cid in enumerate(children_sorted):
            if cid in positions:
                offset = start_offset + i * GROUP_CHILD_SPACING
                positions[cid] = group_y + offset


def repulse_non_siblings(positions, child_to_group, x_ranges):
    """
    Post-pull collision resolution: push apart nodes that aren't siblings
    but now overlap in Y after children were pulled toward their parent.

    One pass over all node pairs sharing similar X ranges — if two non-sibling
    nodes are closer than REPULSION_RADIUS, push them apart.
    """
    ids_by_x = sorted(positions.keys(), key=lambda nid: x_ranges.get(nid, (0, 0))[0])

    for i in range(len(ids_by_x)):
        a = ids_by_x[i]
        ax_start, ax_end = x_ranges.get(a, (0, 0))

        for j in range(i + 1, len(ids_by_x)):
            b = ids_by_x[j]
            bx_start, bx_end = x_ranges.get(b, (0, 0))

            # Stop scanning once b is too far right to overlap with a
            if bx_start > ax_end + HORIZONTAL_GAP:
                break

            # Skip if they're siblings in the same group — they were intentionally placed
            group_a = child_to_group.get(a)
            group_b = child_to_group.get(b)
            if group_a and group_a == group_b:
                continue

            # Check Y proximity and push apart if too close
            dy = positions[b] - positions[a]
            if abs(dy) < REPULSION_RADIUS:
                push = (REPULSION_RADIUS - abs(dy)) / 2
                if dy >= 0:
                    positions[a] -= push
                    positions[b] += push
                else:
                    positions[a] += push
                    positions[b] -= push


def compact_group_spreads(positions, group_children):
    """
    Phase 2: Compact oversized group bounding boxes.

    For each group, if the Y spread of its children exceeds COMPACT_THRESHOLD,
    scale children inward toward the group center. The final spread is capped
    at MAX_GROUP_SPREAD.
    """
    for gid, children in group_children.items():
        if gid not in positions or not children:
            continue

        child_ys = [positions[cid] for cid in children if cid in positions]
        if not child_ys:
            continue

        spread = max(child_ys) - min(child_ys)
        if spread <= COMPACT_THRESHOLD:
            continue

        # Scale children inward toward the group center
        group_y = positions[gid]
        scale = min(MAX_GROUP_SPREAD / spread, 1.0)

        for cid in children:
            if cid in positions:
                positions[cid] = group_y + (positions[cid] - group_y) * scale


def apply_group_layout(positions, events, x_ranges):
    """
    Run the full group-aware layout pass: pull children, resolve collisions,
    then compact oversized spreads.

    Only affects events that have group relationships (is_group or parent_event_id).
    Non-group events keep their BFS-assigned positions unchanged.
    """
    group_children, child_to_group = build_group_map(events)

    if not group_children:
        print("  No group relationships found — skipping group layout.")
        return

    print(f"  {len(group_children)} groups, {len(child_to_group)} children")

    # Phase 1: Pull children toward their parent group's Y
    pull_children_to_parent(positions, group_children)

    # Post-pull collision resolution
    repulse_non_siblings(positions, child_to_group, x_ranges)

    # Phase 2: Compact oversized group spreads
    compact_group_spreads(positions, group_children)

    # Report group stats
    for gid, children in group_children.items():
        child_ys = [positions[cid] for cid in children if cid in positions]
        if child_ys:
            spread = max(child_ys) - min(child_ys)
            if spread > COMPACT_THRESHOLD:
                print(f"  Warning: group {gid[:8]}… spread={spread:.0f}px (>{COMPACT_THRESHOLD})")


async def compute_and_persist(include_groups=False):
    """Main entry point: load data, compute layout, write back to DB."""
    conn = await asyncpg.connect(DB_URL)

    print("Loading events and links...")
    events, links = await load_data(conn, include_groups=include_groups)
    print(f"  {len(events)} events, {len(links)} links")

    if not events:
        print("No events found — nothing to compute.")
        await conn.close()
        return

    outgoing, incoming = build_graph(events, links)

    print("Computing depths and signs via BFS...")
    assignment = compute_depths_and_signs(events, outgoing, incoming)

    print("Assigning Y positions via interval scheduling...")
    x_ranges = compute_event_x_ranges(events)
    positions = assign_y_positions(events, assignment, x_ranges)

    if include_groups:
        print("Applying group-aware layout...")
        apply_group_layout(positions, events, x_ranges)

    print("Persisting to DB...")
    updates = [(positions[str(e['id'])], e['id']) for e in events]
    await conn.executemany("UPDATE events SET network_y = $1 WHERE id = $2", updates)

    ys = list(positions.values())
    print(f"Done. Updated {len(updates)} events.")
    if ys:
        print(f"  Y range: {min(ys):.0f} to {max(ys):.0f}")
    print(f"  Connected nodes: {len(assignment)}")
    print(f"  Isolated nodes: {len(events) - len(assignment)}")

    await conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compute network_y layout for Chronicle events")
    parser.add_argument(
        "--groups",
        action="store_true",
        help="Enable group-aware layout: cluster children near their parent group's Y position",
    )
    args = parser.parse_args()

    asyncio.run(compute_and_persist(include_groups=args.groups))
