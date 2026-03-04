/**
 * bandDensity.ts
 *
 * Single-responsibility module for computing swim-lane band heights based on
 * event density AND collapse state. Busier bands receive proportionally more
 * vertical space, while every band is guaranteed a minimum floor height so
 * labels remain visible. Collapsed bands receive a fixed minimal height.
 *
 * Owns:  density counting, proportional height allocation, cumulative layout,
 *        collapsed band height
 * Does NOT own: rendering, coordinate transforms, React state, toggle logic
 */

import { classifyRegion } from './categories';
import { REGIONS, CANVAS_CONSTANTS } from '../types';
import type { HistoricalEvent, Region } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum pixel height per band (canvas units at zoom=1). Keeps labels legible. */
export const MIN_BAND_HEIGHT = 80;

/**
 * Minimum height (in screen pixels) for a collapsed band.
 * Enough to show the label and toggle button, but nothing else.
 */
export const COLLAPSED_BAND_HEIGHT_PX = 24;

/**
 * Default per-band height used when no events are loaded yet (equal-height
 * fallback). Matches the legacy CANVAS_CONSTANTS.BAND_HEIGHT value.
 */
export const DEFAULT_BAND_HEIGHT = CANVAS_CONSTANTS.BAND_HEIGHT;

/**
 * Default total canvas height distributed across all bands.
 * Equal to BAND_COUNT * DEFAULT_BAND_HEIGHT so the initial layout is
 * backward-compatible with the previous fixed-height design.
 */
export const DEFAULT_TOTAL_HEIGHT =
  CANVAS_CONSTANTS.BAND_COUNT * CANVAS_CONSTANTS.BAND_HEIGHT;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Computed layout for a single region swim-lane band. */
export interface BandLayout {
  /** Region id — matches REGIONS[i].id */
  region: Region;
  /** Display label for the band. */
  label: string;
  /** Top Y coordinate in canvas space (px at zoom=1) */
  top: number;
  /** Height of this band in canvas space (px at zoom=1) */
  height: number;
  /** Whether this band is currently collapsed. */
  isCollapsed: boolean;
}

/**
 * Screen-space layout entry with pixel heights (used for rendering overlays).
 */
export interface BandLayoutEntry {
  /** Region identifier. */
  region: Region;
  /** Display label for the band. */
  label: string;
  /** Allocated height of this band in screen pixels. */
  screenHeight: number;
  /** Cumulative top offset from the layout origin in screen pixels. */
  screenTop: number;
  /** Whether this band is currently collapsed. */
  isCollapsed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Count the number of events in each region band.
 *
 * @param events - Array of historical events to tally
 * @returns Record mapping every Region id to its event count (0 if none)
 */
export function countEventsPerRegion(
  events: HistoricalEvent[],
): Record<Region, number> {
  const counts = Object.fromEntries(
    REGIONS.map((r) => [r.id, 0]),
  ) as Record<Region, number>;

  for (const event of events) {
    const region = classifyRegion(event.lat, event.lng);
    counts[region]++;
  }

  return counts;
}

/**
 * Compute dynamic band heights proportional to event density.
 *
 * Algorithm:
 *  1. Reserve `minHeight` px for every band (the floor).
 *  2. Distribute the remaining `totalHeight − n*minHeight` pixels proportionally
 *     to each band's share of the total event count.
 *  3. When no events are present (cold start), all bands get equal height.
 *  4. Accumulate tops so callers receive absolute canvas Y coordinates.
 *
 * @param events       - The visible/filtered event set used for density sampling
 * @param totalHeight  - Total canvas height to distribute (default: 5 × 200 = 1000)
 * @param minHeight    - Minimum height floor per band (default: MIN_BAND_HEIGHT = 80)
 * @returns Ordered array of BandLayout entries (same order as REGIONS constant)
 */
export function computeBandLayout(
  events: HistoricalEvent[],
  totalHeight: number = DEFAULT_TOTAL_HEIGHT,
  minHeight: number = MIN_BAND_HEIGHT,
): BandLayout[] {
  const n = REGIONS.length;
  const counts = countEventsPerRegion(events);
  const totalEvents = Object.values(counts).reduce((sum, c) => sum + c, 0);

  // Space available beyond the per-band minimum floor
  const reservedHeight = n * minHeight;
  const distributedHeight = Math.max(0, totalHeight - reservedHeight);

  // Compute each band's height: floor + proportional share of extra space
  const heights: number[] = REGIONS.map((r) => {
    const fraction =
      totalEvents > 0 ? counts[r.id] / totalEvents : 1 / n;
    return minHeight + fraction * distributedHeight;
  });

  // Build cumulative tops
  const layout: BandLayout[] = [];
  let y = 0;
  for (let i = 0; i < n; i++) {
    layout.push({
      region: REGIONS[i].id,
      label: REGIONS[i].label,
      top: y,
      height: heights[i],
      isCollapsed: false,
    });
    y += heights[i];
  }

  return layout;
}

/**
 * Compute the screen-space layout for all region swim-lane bands, taking
 * collapse state into account.
 *
 * Collapsed bands receive {@link COLLAPSED_BAND_HEIGHT_PX} (a fixed, zoom-
 * independent height so the label is always legible). Expanded bands receive
 * their dynamic density-based height × zoom.
 *
 * @param collapsedBands - Set of region IDs that are currently collapsed.
 * @param zoom           - Current ReactFlow zoom level (scales expanded height).
 * @param bandLayout     - Canvas-space layout from computeBandLayout.
 * @param offsetY        - Canvas Y pan offset in screen pixels (default 0).
 * @returns              An ordered array of {@link BandLayoutEntry}, one per
 *                       region, in the same order as {@link REGIONS}.
 */
export function computeScreenLayout(
  collapsedBands: Set<Region>,
  zoom: number,
  bandLayout: BandLayout[],
  offsetY = 0,
): BandLayoutEntry[] {
  let cursor = offsetY;

  return bandLayout.map((band) => {
    const isCollapsed = collapsedBands.has(band.region);
    const screenHeight = isCollapsed
      ? COLLAPSED_BAND_HEIGHT_PX
      : band.height * zoom;

    const entry: BandLayoutEntry = {
      region: band.region,
      label: band.label,
      screenTop: cursor,
      screenHeight,
      isCollapsed,
    };

    cursor += screenHeight;
    return entry;
  });
}

/**
 * Look up a BandLayout entry by band index.
 * Falls back to the last band if the index is out of range.
 *
 * @param layout   - Full band layout array from computeBandLayout
 * @param bandIdx  - Index into the REGIONS array (0-based)
 * @returns The matching BandLayout entry
 */
export function getBandByIndex(
  layout: BandLayout[],
  bandIdx: number,
): BandLayout {
  return layout[bandIdx] ?? layout[layout.length - 1];
}

/**
 * Compute the default equal-height band layout used before any events load.
 * Convenience wrapper around computeBandLayout with an empty event array.
 *
 * @returns BandLayout[] with all bands equal to DEFAULT_BAND_HEIGHT
 */
export function defaultBandLayout(): BandLayout[] {
  return computeBandLayout([]);
}
