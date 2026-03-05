/**
 * collisionResolution.ts
 *
 * Iterative Y-axis collision resolution for react-flow event nodes within
 * their swim-lane bands. When multiple events cluster around the same time
 * period, their rendered circles can overlap and obscure each other. This
 * module pushes overlapping nodes apart vertically so every event remains
 * readable — without moving them horizontally (preserving the time axis).
 *
 * Owns:  per-band Y-axis overlap detection and iterative push simulation
 * Does NOT own: X positioning (time axis), band layout, rendering, or node types
 *
 * Algorithm overview
 * ──────────────────
 * 1. Group nodes by the swim-lane band they belong to (derived from Y).
 * 2. For each band, run up to MAX_ITERATIONS of pairwise overlap detection:
 *      – Two nodes overlap when their bounding circles intersect.
 *      – When they do, each node is pushed ½ the overlap distance along Y.
 *      – Every node is then clamped to the usable vertical range inside its band.
 * 3. Return the full node array with updated `position.y` values.
 *
 * The algorithm is deterministic (no randomness) and inexpensive for the
 * event counts handled by react-flow (below GL_THRESHOLD).
 */

import type { Node } from '@xyflow/react';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum push iterations per invocation before giving up. */
const MAX_ITERATIONS = 60;

/**
 * Extra gap (px) added to each node's effective radius during collision checks.
 * Provides breathing room so adjacent node labels don't crowd each other.
 */
const COLLISION_PADDING = 6;

/**
 * Minimum distance (px) from the band's top/bottom edge that a node centre may
 * reach after clamping. Keeps nodes visually within their band boundaries.
 */
const BAND_EDGE_MARGIN = 8;

const { BAND_HEIGHT } = CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the rendered circle radius for an event node from its importance score.
 * Must mirror the size formula in EventNode.tsx exactly so the collision radius
 * matches the rendered circle.
 *
 * @param importanceScore - Normalised [0, 1] importance value
 * @returns Half the rendered circle diameter (px)
 */
function nodeRadius(importanceScore: number): number {
  const size = Math.max(16, Math.min(48, 20 + importanceScore * 20));
  return size / 2;
}

/**
 * Derive which swim-lane band a node belongs to from its Y coordinate.
 * Returns a zero-based band index (clamped to 0 for nodes above the canvas).
 *
 * @param y - Node's canvas Y coordinate
 * @returns Band index (0 = top band)
 */
function bandIndexForY(y: number): number {
  return Math.max(0, Math.floor(y / BAND_HEIGHT));
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve Y-axis collisions for all react-flow nodes within their swim-lane bands.
 *
 * Input nodes are never mutated. Only `position.y` is modified; `position.x`
 * (the time axis) is always preserved. A new node object is returned only when
 * its position actually changes, so react-flow can skip re-renders for untouched
 * nodes via referential equality.
 *
 * @param nodes - Array of react-flow Node objects to resolve
 * @returns New array of nodes with collision-free Y positions (within band bounds)
 */
export function resolveCollisions(nodes: Node[]): Node[] {
  if (nodes.length < 2) return nodes;

  // ── 1. Clone mutable position state (never mutate originals) ─────────────
  const positions: { x: number; y: number }[] = nodes.map((n) => ({
    x: n.position.x,
    y: n.position.y,
  }));

  // ── 2. Compute per-node collision radius (circle radius + padding) ────────
  const radii: number[] = nodes.map((n) => {
    const data = n.data as Record<string, unknown>;
    const importance =
      typeof data.importance_score === 'number' ? data.importance_score : 0.5;
    return nodeRadius(importance) + COLLISION_PADDING;
  });

  // ── 3. Group node indices by band for O(band_size²) per band ─────────────
  //       rather than O(n²) across the whole canvas.
  const bandGroups = new Map<number, number[]>();
  for (let i = 0; i < nodes.length; i++) {
    const bi = bandIndexForY(positions[i].y);
    let group = bandGroups.get(bi);
    if (!group) {
      group = [];
      bandGroups.set(bi, group);
    }
    group.push(i);
  }

  // ── 4. Per-band iterative push simulation ────────────────────────────────
  for (const [bandIdx, group] of bandGroups) {
    if (group.length < 2) continue;

    // Usable Y range for node centres inside this band
    const bandTop = bandIdx * BAND_HEIGHT;
    const yMin = bandTop + BAND_EDGE_MARGIN;
    const yMax = bandTop + BAND_HEIGHT - BAND_EDGE_MARGIN;

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      let anyOverlap = false;

      for (let a = 0; a < group.length - 1; a++) {
        for (let b = a + 1; b < group.length; b++) {
          const ia = group[a];
          const ib = group[b];

          const dx = Math.abs(positions[ia].x - positions[ib].x);
          const dy = positions[ia].y - positions[ib].y; // signed: + means ia is below ib
          const minDist = radii[ia] + radii[ib];

          // Fast X-axis cull: skip pairs that are too far apart horizontally
          // to ever overlap, avoiding the sqrt in the common case.
          if (dx >= minDist) continue;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= minDist) continue; // no overlap

          anyOverlap = true;
          const overlap = minDist - dist;

          if (Math.abs(dy) < 0.001) {
            // Nodes at identical Y: push one up, one down symmetrically
            positions[ia].y += overlap / 2;
            positions[ib].y -= overlap / 2;
          } else {
            // Push each node half the overlap in the direction it already leans
            const half = (overlap / 2) * Math.sign(dy);
            positions[ia].y += half;
            positions[ib].y -= half;
          }

          // Clamp both nodes to stay inside their band
          positions[ia].y = Math.max(yMin, Math.min(yMax, positions[ia].y));
          positions[ib].y = Math.max(yMin, Math.min(yMax, positions[ib].y));
        }
      }

      // Early exit once the layout has fully converged
      if (!anyOverlap) break;
    }
  }

  // ── 5. Return rebuilt node array (new object only when position changed) ──
  return nodes.map((n, i) => {
    const { x, y } = positions[i];
    if (x === n.position.x && y === n.position.y) return n;
    return { ...n, position: { x, y } };
  });
}
