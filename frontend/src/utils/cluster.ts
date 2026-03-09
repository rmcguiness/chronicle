/**
 * cluster.ts
 *
 * Pure function that groups nearby events into zoom-appropriate clusters
 * using 1D X-axis binning by year. At low ReactFlow zoom levels, events
 * within the same century or decade window collapse into a single
 * ClusterNode bubble; at higher zoom levels all events render individually.
 *
 * Owns: clustering algorithm, bin-width selection, cluster construction.
 * Does NOT own: rendering, viewport state, or layout computation.
 */

import type { Node } from '@xyflow/react';
import type { HistoricalEvent, ClusterNode, EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Clustering zoom thresholds and bin widths
// ─────────────────────────────────────────────────────────────────────────────

/** Below this RF zoom: use century-wide (100-year) bins. */
const CLUSTER_TIER1_ZOOM = 0.15;

/** Below this RF zoom: use decade-wide (20-year) bins. */
const CLUSTER_TIER2_ZOOM = 0.5;

/** Bin width in years for tier 1 (deep zoom-out). */
const CLUSTER_BIN_YEARS_TIER1 = 100;

/** Bin width in years for tier 2 (moderate zoom-out). */
const CLUSTER_BIN_YEARS_TIER2 = 20;

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups ReactFlow event nodes into zoom-appropriate clusters using 1D
 * year-axis binning. Returns a mix of original event nodes (singletons or
 * at high zoom) and new cluster nodes.
 *
 * Clustering tiers:
 * - Tier 1 (zoom < 0.15): 100-year bins.
 * - Tier 2 (zoom 0.15–0.5): 20-year bins.
 * - Tier 3+ (zoom ≥ 0.5): no clustering — all events returned as-is.
 *
 * Within each bin the highest-importance event's position is used as the
 * cluster center.
 *
 * @param nodes   - ReactFlow nodes with type='event' and HistoricalEvent data.
 * @param zoom    - Current ReactFlow camera zoom level.
 * @param timeToX - Converts a historical year to a canvas X coordinate.
 * @returns Mixed array of original event nodes and new cluster nodes.
 */
export function clusterEvents(
  nodes: Node[],
  zoom: number,
  timeToX: (year: number) => number,
): Node[] {
  // Tier 3+: no clustering
  if (zoom >= CLUSTER_TIER2_ZOOM) return nodes;

  const binYears =
    zoom < CLUSTER_TIER1_ZOOM
      ? CLUSTER_BIN_YEARS_TIER1
      : CLUSTER_BIN_YEARS_TIER2;

  // Group event nodes into year bins; pass through non-event nodes unchanged.
  const bins = new Map<number, Node[]>();
  const passThrough: Node[] = [];

  for (const node of nodes) {
    if (node.type !== 'event') {
      passThrough.push(node);
      continue;
    }
    const event = node.data as unknown as HistoricalEvent;
    const binKey = Math.floor(event.year_approx / binYears);
    const existing = bins.get(binKey);
    if (existing) {
      existing.push(node);
    } else {
      bins.set(binKey, [node]);
    }
  }

  const result: Node[] = [...passThrough];

  for (const [, binNodes] of bins) {
    // Singleton bins: keep the event node as-is
    if (binNodes.length <= 1) {
      result.push(...binNodes);
      continue;
    }

    // ── Build cluster from multiple events ────────────────────────────────

    let bestNode = binNodes[0];
    let bestImportance = (bestNode.data as unknown as HistoricalEvent).importance_score;

    const events: HistoricalEvent[] = [];
    const categoryCounts = new Map<string, number>();
    let minYear = Infinity;
    let maxYear = -Infinity;

    for (const node of binNodes) {
      const event = node.data as unknown as HistoricalEvent;
      events.push(event);

      if (event.importance_score > bestImportance) {
        bestNode = node;
        bestImportance = event.importance_score;
      }

      categoryCounts.set(
        event.category,
        (categoryCounts.get(event.category) ?? 0) + 1,
      );

      if (event.year_approx < minYear) minYear = event.year_approx;
      if (event.year_approx > maxYear) maxYear = event.year_approx;
    }

    // Dominant category = most frequent
    let dominantCategory: EventCategory = 'political';
    let maxCount = 0;
    for (const [cat, count] of categoryCounts) {
      if (count > maxCount) {
        dominantCategory = cat as EventCategory;
        maxCount = count;
      }
    }

    const midYear = (minYear + maxYear) / 2;

    const clusterData: ClusterNode = {
      id: `cluster-${minYear}-${maxYear}`,
      type: 'cluster',
      x: timeToX(midYear),
      y: bestNode.position.y,
      count: binNodes.length,
      events,
      dominantCategory,
      minYear,
      maxYear,
      importance: bestImportance,
    };

    result.push({
      id: clusterData.id,
      type: 'cluster',
      position: { x: bestNode.position.x, y: bestNode.position.y },
      data: clusterData,
      selectable: false,
      draggable: false,
    });
  }

  return result;
}

/**
 * Collect the set of individual event node IDs still visible after clustering.
 * Used to filter edges — edges connecting clustered (hidden) events are removed.
 *
 * @param clusteredNodes - Output of `clusterEvents`.
 * @returns Set of event node IDs that are individually rendered.
 */
export function getVisibleEventIds(clusteredNodes: Node[]): Set<string> {
  const ids = new Set<string>();
  for (const node of clusteredNodes) {
    if (node.type === 'event') {
      ids.add(node.id);
    }
  }
  return ids;
}
