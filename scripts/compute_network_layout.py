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
import re
from collections import defaultdict, deque
from typing import Optional, Tuple

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ─────────────────────────────────────────────────────────────────────────────
# Reference viewport constants (from frontend/src/types/index.ts)
# ─────────────────────────────────────────────────────────────────────────────

REFERENCE_YEAR_MIN = -800        # Default timeViewport yearMin
REFERENCE_YEAR_MAX = 1500        # Default timeViewport yearMax
CANVAS_WIDTH = 2000              # px — reference canvas width

# ─────────────────────────────────────────────────────────────────────────────
# Node size constants (from frontend styles)
# ─────────────────────────────────────────────────────────────────────────────

NODE_SIZE_BASE = 50              # px — minimum circle size
NODE_SIZE_IMPORTANCE_RANGE = 20  # px — additional size for max importance

# ─────────────────────────────────────────────────────────────────────────────
# Y spacing constants (pixels in canvas space)
# ─────────────────────────────────────────────────────────────────────────────

DEPTH_SPACING = 180              # px between depth levels
MAX_DEPTH_LEVELS = [0, 180, 324, 432, 504, 540]  # depth 0–5+
ISOLATED_NUDGE = 90              # px for nodes with no connections
COLLISION_RADIUS = 55            # min vertical distance between node centers when overlapping
COLLISION_PASSES = 50            # many passes for full convergence in dense regions
HORIZONTAL_BUFFER = 10           # px — extra spacing for horizontal overlap detection


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


async def load_data(conn):
    """Load all events and causality links from the database."""
    # Cast dates to text to avoid asyncpg date parsing issues with unusual dates
    # Use is_bce flag to determine BC/BCE dates
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


def depth_to_y(depth: int, sign: int) -> float:
    """Map causal depth + sign to a canvas Y coordinate (pixels)."""
    if depth >= len(MAX_DEPTH_LEVELS):
        magnitude = MAX_DEPTH_LEVELS[-1]
    else:
        magnitude = MAX_DEPTH_LEVELS[depth]
    return sign * magnitude


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


def ranges_overlap(range_a: Tuple[float, float], range_b: Tuple[float, float]) -> bool:
    """Check if two X ranges overlap (with buffer)."""
    a_start, a_end = range_a
    b_start, b_end = range_b
    # Add buffer to each end
    return (a_start - HORIZONTAL_BUFFER) < (b_end + HORIZONTAL_BUFFER) and \
           (b_start - HORIZONTAL_BUFFER) < (a_end + HORIZONTAL_BUFFER)


def centers_close(range_a: Tuple[float, float], range_b: Tuple[float, float], threshold: float) -> bool:
    """Check if node centers are within threshold distance."""
    center_a = (range_a[0] + range_a[1]) / 2
    center_b = (range_b[0] + range_b[1]) / 2
    return abs(center_a - center_b) < threshold


def resolve_collisions(positions: dict, events, passes: int = COLLISION_PASSES) -> dict:
    """
    Push nodes apart if they're too close vertically and their X ranges overlap.

    Uses a simpler bucket-based approach: group nodes by X position (using node centers),
    then within each bucket, spread nodes vertically.
    
    Bucket size is based on typical node width to ensure overlapping nodes compete.

    Returns updated positions dict.
    """
    pos = dict(positions)
    x_ranges = compute_event_x_ranges(events)
    node_ids = [nid for nid in pos.keys() if nid in x_ranges]
    
    # Compute bucket size: based on typical node width
    # Use median width to avoid skew from very wide pills
    widths = sorted([x_ranges[nid][1] - x_ranges[nid][0] for nid in node_ids])
    median_width = widths[len(widths) // 2] if widths else NODE_SIZE_BASE
    bucket_size = max(median_width, NODE_SIZE_BASE)  # At least one node width
    
    # Compute node centers
    node_centers = {nid: (x_ranges[nid][0] + x_ranges[nid][1]) / 2 for nid in node_ids}
    
    for pass_num in range(passes):
        moved = False
        
        # Group by bucket (based on center position)
        buckets = defaultdict(list)
        for nid in node_ids:
            bucket_idx = int(node_centers[nid] // bucket_size)
            buckets[bucket_idx].append(nid)
        
        # Also check adjacent buckets for wide nodes
        all_bucket_keys = sorted(buckets.keys())
        
        for bucket_idx in all_bucket_keys:
            # Combine current bucket with adjacent buckets for collision check
            nodes_in_range = []
            for adj_idx in [bucket_idx - 1, bucket_idx, bucket_idx + 1]:
                nodes_in_range.extend(buckets.get(adj_idx, []))
            
            if len(nodes_in_range) < 2:
                continue
            
            # Sort by Y position
            nodes_sorted = sorted(set(nodes_in_range), key=lambda nid: pos[nid])
            
            # Push adjacent pairs apart if they overlap
            for i in range(len(nodes_sorted) - 1):
                node_a = nodes_sorted[i]
                node_b = nodes_sorted[i + 1]
                
                # Check actual overlap (ranges overlap, not just same bucket)
                if not ranges_overlap(x_ranges[node_a], x_ranges[node_b]):
                    continue
                
                gap = pos[node_b] - pos[node_a]
                if gap < COLLISION_RADIUS:
                    push = (COLLISION_RADIUS - gap) / 2 + 0.5
                    pos[node_a] -= push
                    pos[node_b] += push
                    moved = True
        
        if not moved:
            break

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
    
    # Check for remaining collisions
    x_ranges = compute_event_x_ranges(events)
    remaining_collisions = 0
    for i, e1 in enumerate(events):
        id1 = str(e1['id'])
        if id1 not in x_ranges:
            continue
        for e2 in events[i+1:]:
            id2 = str(e2['id'])
            if id2 not in x_ranges:
                continue
            if ranges_overlap(x_ranges[id1], x_ranges[id2]):
                gap = abs(positions[id1] - positions[id2])
                if gap < COLLISION_RADIUS:
                    remaining_collisions += 1
    if remaining_collisions > 0:
        print(f"  Note: {remaining_collisions} visually overlapping pairs (expected with dense data)")

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
