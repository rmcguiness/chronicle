/**
 * bandDensity.ts
 *
 * Computes the visual layout (height allocation) for each region swim-lane
 * band on the timeline canvas.  This module is the single source of truth for
 * how vertical space is distributed across bands.
 *
 * Responsibilities:
 *   - Assign screen-pixel heights to expanded and collapsed bands
 *   - Treat collapsed bands as zero-density entries (minimal height)
 *   - Expose the accumulated top offsets so callers can use absolute positioning
 *     if they prefer it over a CSS flex-column container
 *
 * Does NOT:
 *   - Manage collapse toggle state (see hooks/useCollapsedBands.ts)
 *   - Position events within bands (see Canvas.tsx / eventBandY in categories.ts)
 */

import type { Region } from '../types';
import { REGIONS, CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimum height (in screen pixels) for a collapsed band.
 * Enough to show the label and toggle button, but nothing else.
 */
export const COLLAPSED_BAND_HEIGHT_PX = 24;

/** Full canvas-unit height of an expanded band (mirrors CANVAS_CONSTANTS). */
const { BAND_HEIGHT } = CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Describes the rendered dimensions of one region swim-lane band.
 *
 * All pixel values are in **screen pixels** so they can be applied directly to
 * CSS properties without further scaling.
 */
export interface BandLayoutEntry {
  /** Region identifier. */
  region: Region;
  /** Display label for the band. */
  label: string;
  /**
   * Allocated height of this band in screen pixels.
   *   - Collapsed → {@link COLLAPSED_BAND_HEIGHT_PX}
   *   - Expanded  → `BAND_HEIGHT * zoom`
   */
  screenHeight: number;
  /**
   * Cumulative top offset from the layout origin (i.e. from wherever offsetY
   * puts the first band).  Useful for callers that use absolute positioning.
   * When using a CSS flex-column container positioned at `top: offsetY`, you
   * can ignore this value.
   */
  screenTop: number;
  /** Whether this band is currently collapsed. */
  isCollapsed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// computeBandLayout
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the screen-space layout for all region swim-lane bands.
 *
 * Collapsed bands receive {@link COLLAPSED_BAND_HEIGHT_PX} (a fixed, zoom-
 * independent height so the label is always legible).  Expanded bands receive
 * `BAND_HEIGHT × zoom` screen pixels.
 *
 * Bands are stacked sequentially in the order defined by {@link REGIONS}.
 * Each entry's `screenTop` accumulates from `offsetY`.
 *
 * @param collapsedBands - Set of region IDs that are currently collapsed.
 * @param zoom           - Current ReactFlow zoom level (scales expanded height).
 * @param offsetY        - Canvas Y pan offset in screen pixels (default 0).
 *                         Pass the current `rfTransform.y` when you need
 *                         absolute-positioned tops.  Omit when using a flex
 *                         container positioned at `top: offsetY`.
 * @returns              An ordered array of {@link BandLayoutEntry}, one per
 *                       region, in the same order as {@link REGIONS}.
 *
 * @example
 * // Absolute-positioned backgrounds:
 * const layout = computeBandLayout(collapsedBands, zoom, rfTransform.y);
 * layout.forEach(({ screenTop, screenHeight }) => { ... });
 *
 * @example
 * // Flex-column container (position the parent at top: offsetY):
 * const layout = computeBandLayout(collapsedBands, zoom);
 * layout.forEach(({ screenHeight }) => { ... }); // just use height
 */
export function computeBandLayout(
  collapsedBands: Set<Region>,
  zoom: number,
  offsetY = 0,
): BandLayoutEntry[] {
  let cursor = offsetY;

  return REGIONS.map((r) => {
    const isCollapsed = collapsedBands.has(r.id);
    const screenHeight = isCollapsed
      ? COLLAPSED_BAND_HEIGHT_PX
      : BAND_HEIGHT * zoom;

    const entry: BandLayoutEntry = {
      region: r.id,
      label: r.label,
      screenTop: cursor,
      screenHeight,
      isCollapsed,
    };

    cursor += screenHeight;
    return entry;
  });
}
