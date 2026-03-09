/**
 * cluster.ts — Zoom-based event clustering for the Chronicle timeline.
 *
 * Groups nearby events into clusters at low zoom levels using a 1D sweep
 * on year_approx. At higher zoom levels events are shown individually.
 *
 * 4 zoom tiers:
 *   Tier 1 (zoom < 0.15): 50-year windows → large cluster bubbles
 *   Tier 2 (zoom 0.15–0.5): 10-year windows → small group chips
 *   Tier 3 (zoom 0.5–2.0): individual events (current behavior)
 *   Tier 4 (zoom > 2.0): individual events with date_display shown
 */

import type { HistoricalEvent, EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Zoom threshold below which Tier 1 (century-scale) clustering activates. */
export const CLUSTER_TIER1_ZOOM = 0.15;

/** Zoom threshold below which Tier 2 (decade-scale) clustering activates. */
export const CLUSTER_TIER2_ZOOM = 0.5;

/** Zoom threshold above which Tier 4 (date display) activates. */
export const CLUSTER_TIER4_ZOOM = 2.0;

/** Time window in years for Tier 1 clustering. */
export const CLUSTER_TIER1_WINDOW_YEARS = 50;

/** Time window in years for Tier 2 clustering. */
export const CLUSTER_TIER2_WINDOW_YEARS = 10;

/** Minimum cluster node diameter in pixels. */
export const CLUSTER_MIN_SIZE_PX = 40;

/** Maximum cluster node diameter in pixels. */
export const CLUSTER_MAX_SIZE_PX = 80;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** The current zoom tier (1–4). */
export type ZoomTier = 1 | 2 | 3 | 4;

/**
 * A cluster of events grouped by temporal proximity.
 * The `representative` is the highest-importance event in the cluster.
 */
export interface EventCluster {
  /** The highest-importance event, used as the cluster's position anchor. */
  representative: HistoricalEvent;
  /** All events in the cluster (including the representative). */
  children: HistoricalEvent[];
  /** Dominant category color of the cluster. */
  dominantCategory: EventCategory;
  /** Total count of events in the cluster. */
  count: number;
  /** Year range of the cluster bin. */
  binStart: number;
  /** Year range of the cluster bin. */
  binEnd: number;
}

/** Result of clustering: either a single event or a cluster. */
export type ClusterResult =
  | { type: 'single'; event: HistoricalEvent }
  | { type: 'cluster'; cluster: EventCluster };

// ─────────────────────────────────────────────────────────────────────────────
// Tier computation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine the current zoom tier from the timeViewport span.
 * We use timeSpan (yearMax - yearMin) as the zoom proxy since the ReactFlow
 * camera zoom is separate from the time-axis zoom in this app.
 *
 * Mapping (approximate):
 *   span > 2000 years → Tier 1 (century view)
 *   span 200–2000     → Tier 2 (decade view)
 *   span 5–200        → Tier 3 (individual events)
 *   span < 5          → Tier 4 (date display)
 *
 * @param timeSpan - The visible year range (yearMax - yearMin).
 * @returns The active zoom tier.
 */
export function getZoomTier(timeSpan: number): ZoomTier {
  if (timeSpan > 2000) return 1;
  if (timeSpan > 200) return 2;
  if (timeSpan > 5) return 3;
  return 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// Clustering algorithm
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Find the most common category among a set of events.
 *
 * @param events - Array of events to analyze.
 * @returns The most frequent EventCategory.
 */
function findDominantCategory(events: HistoricalEvent[]): EventCategory {
  const counts = new Map<EventCategory, number>();
  for (const e of events) {
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  }
  let best: EventCategory = events[0].category;
  let bestCount = 0;
  for (const [cat, count] of counts) {
    if (count > bestCount) {
      best = cat;
      bestCount = count;
    }
  }
  return best;
}

/**
 * Cluster events using a 1D sweep on year_approx with fixed-width time bins.
 *
 * Algorithm:
 * 1. Sort events by year_approx
 * 2. Assign each event to a bin: floor(year_approx / windowYears) * windowYears
 * 3. For each bin with 2+ events, create a cluster with the highest-importance
 *    event as representative
 * 4. Bins with a single event pass through as-is
 *
 * @param events - All events to cluster.
 * @param windowYears - Width of each time bin in years.
 * @returns Array of ClusterResult items.
 */
export function clusterEvents(
  events: HistoricalEvent[],
  windowYears: number,
): ClusterResult[] {
  if (events.length === 0) return [];

  // Group events into fixed-width bins
  const bins = new Map<number, HistoricalEvent[]>();
  for (const event of events) {
    const binKey = Math.floor(event.year_approx / windowYears) * windowYears;
    const bin = bins.get(binKey);
    if (bin) {
      bin.push(event);
    } else {
      bins.set(binKey, [event]);
    }
  }

  const results: ClusterResult[] = [];

  for (const [binStart, binEvents] of bins) {
    if (binEvents.length === 1) {
      results.push({ type: 'single', event: binEvents[0] });
      continue;
    }

    // Pick highest importance as representative
    let representative = binEvents[0];
    for (let i = 1; i < binEvents.length; i++) {
      if (binEvents[i].importance_score > representative.importance_score) {
        representative = binEvents[i];
      }
    }

    results.push({
      type: 'cluster',
      cluster: {
        representative,
        children: binEvents,
        dominantCategory: findDominantCategory(binEvents),
        count: binEvents.length,
        binStart,
        binEnd: binStart + windowYears,
      },
    });
  }

  // Sort results by representative year for stable ordering
  results.sort((a, b) => {
    const yearA = a.type === 'single' ? a.event.year_approx : a.cluster.representative.year_approx;
    const yearB = b.type === 'single' ? b.event.year_approx : b.cluster.representative.year_approx;
    return yearA - yearB;
  });

  return results;
}

/**
 * Compute the pixel diameter for a cluster node based on child count.
 * Scales linearly between CLUSTER_MIN_SIZE_PX and CLUSTER_MAX_SIZE_PX.
 *
 * @param count - Number of events in the cluster.
 * @param maxCount - Maximum cluster size in the current view (for relative scaling).
 * @returns Diameter in pixels.
 */
export function clusterDiameter(count: number, maxCount: number): number {
  if (maxCount <= 1) return CLUSTER_MIN_SIZE_PX;
  const t = Math.min(1, (count - 1) / (maxCount - 1));
  return CLUSTER_MIN_SIZE_PX + t * (CLUSTER_MAX_SIZE_PX - CLUSTER_MIN_SIZE_PX);
}
