/**
 * bandDensity.ts
 *
 * Single-responsibility module for computing swim-lane band heights based on
 * event density AND collapse state. Busier bands receive proportionally more
 * vertical space, capped at MAX_BAND_HEIGHT, while every band is guaranteed a
 * minimum floor height (MIN_BAND_HEIGHT) so labels remain visible. Collapsed
 * bands receive a fixed minimal height.
 *
 * Owns:  density counting, proportional height allocation (with min/max clamp),
 *        cumulative layout, collapsed band height constant
 * Does NOT own: rendering, coordinate transforms, React state, toggle logic
 */

import { classifyRegion } from './categories';
import { REGIONS, CANVAS_CONSTANTS } from '../types';
import type { HistoricalEvent, Region } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimum pixel height per band (canvas units at zoom=1).
 * Ancient/sparse periods stay near this floor to avoid wasting space.
 */
export const MIN_BAND_HEIGHT = 120;

/**
 * Maximum pixel height per band (canvas units at zoom=1).
 * Prevents high-density modern periods from becoming unnavigable.
 */
export const MAX_BAND_HEIGHT = 600;

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
 * Compute dynamic band heights proportional to event density, with floor and
 * ceiling clamping so sparse bands stay compact and dense bands don't overflow.
 *
 * Algorithm:
 *  1. When no events are loaded yet (cold start), return equal-height bands
 *     using DEFAULT_BAND_HEIGHT — backward-compatible with the old fixed layout.
 *  2. Otherwise, compute each band's proportional share of `totalHeight`,
 *     reserving `minHeight` as a guaranteed floor for every band.
 *  3. Clamp every band height to [minHeight, maxHeight].
 *     Total canvas height becomes the sum of clamped heights (may differ from
 *     `totalHeight` when capping kicks in — that's intentional).
 *  4. Accumulate tops so callers receive absolute canvas Y coordinates.
 *
 * @param events      - The visible/filtered event set used for density sampling.
 *                      Pass [] to get the equal-height default layout.
 * @param totalHeight - Nominal canvas height to distribute proportionally
 *                      (default: BAND_COUNT × BAND_HEIGHT = 1000).
 * @param minHeight   - Floor per band (default: MIN_BAND_HEIGHT = 120).
 * @param maxHeight   - Ceiling per band (default: MAX_BAND_HEIGHT = 600).
 * @returns Ordered BandLayout[] — one entry per region in REGIONS order.
 */
export function computeBandLayout(
  events: HistoricalEvent[],
  totalHeight: number = DEFAULT_TOTAL_HEIGHT,
  minHeight: number = MIN_BAND_HEIGHT,
  maxHeight: number = MAX_BAND_HEIGHT,
): BandLayout[] {
  const n = REGIONS.length;
  const counts = countEventsPerRegion(events);
  const totalEvents = Object.values(counts).reduce((sum, c) => sum + c, 0);

  let heights: number[];

  if (totalEvents === 0) {
    // Cold start — equal heights matching the legacy fixed-height layout.
    // Use DEFAULT_BAND_HEIGHT so bands look the same before any data loads.
    heights = REGIONS.map(() => DEFAULT_BAND_HEIGHT);
  } else {
    // Space available beyond the per-band minimum floor
    const reservedHeight = n * minHeight;
    const distributedHeight = Math.max(0, totalHeight - reservedHeight);

    // Proportional allocation: floor + fraction of the extra space
    const raw = REGIONS.map((r) => {
      const fraction = counts[r.id] / totalEvents;
      return minHeight + fraction * distributedHeight;
    });

    // Clamp each band to [minHeight, maxHeight].
    // Dense modern periods hit the ceiling; sparse ancient periods stay at floor.
    heights = raw.map((h) => Math.min(maxHeight, Math.max(minHeight, h)));
  }

  // Build cumulative Y offsets (band baselines)
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
 * @param bandLayout     - Canvas-space layout from {@link computeBandLayout}.
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
 * @param layout   - Full band layout array from {@link computeBandLayout}
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
 * Equivalent to `computeBandLayout([])` — all bands get DEFAULT_BAND_HEIGHT.
 *
 * @returns BandLayout[] with all bands equal to DEFAULT_BAND_HEIGHT (200px)
 */
export function defaultBandLayout(): BandLayout[] {
  return computeBandLayout([]);
}
