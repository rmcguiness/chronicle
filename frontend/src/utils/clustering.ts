/**
 * clustering.ts
 *
 * Owns all zoom-based event clustering logic for the Chronicle timeline.
 * Converts a flat list of HistoricalEvents into ReactFlow nodes — either
 * individual event nodes or cluster nodes — based on the current zoom tier.
 *
 * Responsibilities:
 *   - Define zoom tier thresholds (Macro / Meso / Standard / Detail)
 *   - Group events into century or decade buckets per region
 *   - Return the correct ReactFlow node array for the active tier
 *
 * Does NOT:
 *   - Render any UI (that lives in ClusterNode.tsx and EventNode.tsx)
 *   - Manage viewport state or collapse state (Canvas.tsx / store)
 *   - Handle edges (edges are unaffected by clustering)
 */

import type { Node } from '@xyflow/react';
import type { HistoricalEvent, Region } from '../types';
import { CANVAS_CONSTANTS } from '../types';
import { classifyRegion, regionBandIndex } from './categories';

// ─────────────────────────────────────────────────────────────────────────────
// Zoom tier thresholds — single source of truth, no magic numbers elsewhere
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Zoom level boundaries that separate the four display tiers.
 *
 * ```
 * zoom < MACRO_MAX              → Macro    (century cluster nodes)
 * MACRO_MAX ≤ zoom < MESO_MAX   → Meso     (decade cluster nodes)
 * MESO_MAX  ≤ zoom < DETAIL_MIN → Standard (individual event nodes, no labels)
 * zoom ≥ DETAIL_MIN             → Detail   (individual event nodes + name labels)
 * ```
 */
export const ZOOM_TIER_THRESHOLDS = {
  /** Below this zoom: century-level cluster nodes. */
  MACRO_MAX: 0.15,
  /** Below this zoom (above MACRO_MAX): decade-level cluster nodes. */
  MESO_MAX: 0.4,
  /** At or above this zoom: individual events with name labels. */
  DETAIL_MIN: 1.2,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ZoomTier
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The four display tiers of the Chronicle timeline.
 *
 * - `macro`    – century clusters  (zoom < 0.15)
 * - `meso`     – decade clusters   (0.15 ≤ zoom < 0.4)
 * - `standard` – individual nodes  (0.4 ≤ zoom < 1.2)
 * - `detail`   – individual nodes + name labels (zoom ≥ 1.2)
 */
export type ZoomTier = 'macro' | 'meso' | 'standard' | 'detail';

/**
 * Determine the active {@link ZoomTier} for a given ReactFlow zoom level.
 *
 * @param zoom - The current ReactFlow viewport zoom value.
 * @returns    The corresponding {@link ZoomTier}.
 */
export function getZoomTier(zoom: number): ZoomTier {
  if (zoom < ZOOM_TIER_THRESHOLDS.MACRO_MAX) return 'macro';
  if (zoom < ZOOM_TIER_THRESHOLDS.MESO_MAX) return 'meso';
  if (zoom < ZOOM_TIER_THRESHOLDS.DETAIL_MIN) return 'standard';
  return 'detail';
}

// ─────────────────────────────────────────────────────────────────────────────
// ClusterNodeData
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data payload attached to a cluster ReactFlow node.
 *
 * @example
 * // A century cluster covering the 1400s in the Europe band:
 * {
 *   count: 14,
 *   bucketLabel: '1400s',
 *   region: 'europe',
 *   yearStart: 1400,
 *   yearEnd: 1499,
 *   bucketSize: 100,
 *   tier: 'macro',
 * }
 */
export interface ClusterNodeData extends Record<string, unknown> {
  /** Number of events aggregated in this cluster. */
  count: number;
  /** Human-readable bucket label, e.g. "1400s" or "1450s". */
  bucketLabel: string;
  /** The region swim-lane this cluster belongs to. */
  region: Region;
  /** First year (inclusive) of this bucket. */
  yearStart: number;
  /** Last year (inclusive) of this bucket. */
  yearEnd: number;
  /** Bucket width in years (100 for macro, 10 for meso). */
  bucketSize: number;
  /** Which tier produced this cluster (for visual differentiation). */
  tier: ZoomTier;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN, BAND_HEIGHT } = CANVAS_CONSTANTS;

/**
 * Round a year down to the nearest bucket boundary.
 *
 * @param year       - The year to snap.
 * @param bucketSize - Bucket width in years (100 or 10).
 * @returns          The start year of the bucket containing `year`.
 */
function bucketStart(year: number, bucketSize: number): number {
  return Math.floor(year / bucketSize) * bucketSize;
}

/**
 * Format a bucket start year into a human-readable label.
 *
 * - Positive centuries → "1400s"
 * - Negative centuries → "500s BC"
 * - Decades follow the same rules at 10-year resolution.
 *
 * @param start      - The bucket start year.
 * @param bucketSize - Bucket width in years.
 * @returns          A display label string.
 */
function formatBucketLabel(start: number): string {
  if (start < 0) {
    return `${Math.abs(start)}s BC`;
  }
  return `${start}s`;
}

/**
 * Compute the canvas-space X coordinate for the centre of a time bucket.
 *
 * @param yearStart  - First year of the bucket.
 * @param bucketSize - Bucket width in years.
 * @returns          X coordinate in canvas pixels.
 */
function bucketCentreX(yearStart: number, bucketSize: number): number {
  const centreYear = yearStart + bucketSize / 2;
  return (centreYear - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
}

/**
 * Compute the canvas-space Y coordinate for the centre of a region band.
 *
 * @param region - The target region.
 * @returns      Y coordinate in canvas pixels.
 */
function bandCentreY(region: Region): number {
  const idx = regionBandIndex(region);
  return idx * BAND_HEIGHT + BAND_HEIGHT / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// Node builders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build individual event nodes for the Standard and Detail tiers.
 *
 * Mirrors the previous `eventToNode()` helper in Canvas.tsx.  The `showLabel`
 * flag in node data is `true` only in the Detail tier (zoom ≥ 1.2).
 *
 * @param events         - Events to convert.
 * @param tier           - Active zoom tier ('standard' | 'detail').
 * @param collapsedBands - Collapsed region IDs.
 * @returns              ReactFlow nodes with `type: 'event'`.
 */
function buildIndividualNodes(
  events: HistoricalEvent[],
  tier: 'standard' | 'detail',
  collapsedBands: Set<Region>,
): Node[] {
  const showLabel = tier === 'detail';

  return events.map((event) => {
    const x = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    const region = classifyRegion(event.lat, event.lng);
    const bandIdx = regionBandIndex(region);
    const bandTop = bandIdx * BAND_HEIGHT;
    const padding = 30;
    const usable = BAND_HEIGHT - 2 * padding;
    // Use longitude for intra-band Y spread to reduce overlap
    const lngNorm = Math.max(0, Math.min(1, (event.lng + 180) / 360));
    const y = bandTop + padding + lngNorm * usable;

    return {
      id: String(event.id),
      type: 'event',
      position: { x, y },
      data: { ...event, showLabel },
      selectable: true,
      draggable: false,
      hidden: collapsedBands.has(region),
    };
  });
}

/**
 * Build cluster nodes for the Macro and Meso tiers.
 *
 * Groups events by `(region, bucketStart)` key.  Each unique group becomes one
 * cluster node positioned at the horizontal centre of the bucket and the
 * vertical centre of the region band.
 *
 * @param events         - Events to cluster.
 * @param bucketSize     - Bucket width in years (100 = macro, 10 = meso).
 * @param tier           - Active zoom tier ('macro' | 'meso').
 * @param collapsedBands - Collapsed region IDs.
 * @returns              ReactFlow cluster nodes with `type: 'cluster'`.
 */
function buildClusterNodes(
  events: HistoricalEvent[],
  bucketSize: number,
  tier: 'macro' | 'meso',
  collapsedBands: Set<Region>,
): Node[] {
  // Accumulate event counts per (region, bucketStart) key
  const buckets = new Map<string, { count: number; region: Region; yearStart: number }>();

  for (const event of events) {
    const region = classifyRegion(event.lat, event.lng);
    const start = bucketStart(event.year_approx, bucketSize);
    const key = `${region}::${start}`;

    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      buckets.set(key, { count: 1, region, yearStart: start });
    }
  }

  // Convert each bucket to a ReactFlow node
  const nodes: Node[] = [];

  for (const [key, { count, region, yearStart }] of buckets) {
    const yearEnd = yearStart + bucketSize - 1;
    const x = bucketCentreX(yearStart, bucketSize);
    const y = bandCentreY(region);

    const data: ClusterNodeData = {
      count,
      bucketLabel: formatBucketLabel(yearStart),
      region,
      yearStart,
      yearEnd,
      bucketSize,
      tier,
    };

    nodes.push({
      id: `cluster-${key}`,
      type: 'cluster',
      position: { x, y },
      data,
      selectable: true,
      draggable: false,
      hidden: collapsedBands.has(region),
    });
  }

  return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// clusterEvents — primary export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a list of {@link HistoricalEvent}s into ReactFlow nodes appropriate
 * for the current zoom level.
 *
 * - **Macro / Meso tiers:** Events are grouped into century / decade buckets
 *   per region.  Each bucket becomes a single "cluster" node whose width scales
 *   logarithmically with the event count.  Collapsed regions are hidden.
 *
 * - **Standard / Detail tiers:** Each event becomes an individual "event" node
 *   (same structure as the pre-clustering code).  At the Detail tier the
 *   `showLabel` flag is set to `true` so the event name renders below the node.
 *
 * @param events         - All importance-filtered events to display.
 * @param zoom           - Current ReactFlow viewport zoom.
 * @param collapsedBands - Set of region IDs whose swim-lane bands are collapsed.
 * @returns              An array of ReactFlow {@link Node}s ready for `setNodes`.
 *                       Does NOT include edges.
 *
 * @example
 * const nodes = clusterEvents(filteredEvents, rfZoom, collapsedBands);
 * setNodes(nodes);
 */
export function clusterEvents(
  events: HistoricalEvent[],
  zoom: number,
  collapsedBands: Set<Region>,
): Node[] {
  const tier = getZoomTier(zoom);

  if (tier === 'standard' || tier === 'detail') {
    return buildIndividualNodes(events, tier, collapsedBands);
  }

  const bucketSize = tier === 'macro' ? 100 : 10;
  return buildClusterNodes(events, bucketSize, tier, collapsedBands);
}
