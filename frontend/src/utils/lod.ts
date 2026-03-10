/**
 * lod.ts — Level of Detail (LOD) utilities for Chronicle's canvas tile system.
 *
 * Owns: zoom-to-importance-threshold mapping (importanceThreshold).
 * Does NOT own: category colours, region classification, or canvas layout logic.
 *
 * At low zoom (globe view) only the most historically significant events are
 * fetched, reducing tile API payload by an order of magnitude. As the user
 * zooms in, progressively less important events become visible.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Breakpoint constants — named so callers can reference them without magic numbers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LOD breakpoints keyed by zoom-level upper bound → minimum importance score.
 *
 * Each entry means: "when zoom < zoomBound, require importance >= minImportance".
 * Entries must be ordered from smallest to largest zoomBound.
 */
export const LOD_THRESHOLDS = [
  /** Globe / world-overview zoom — only landmark events (≥ 0.8) */
  { zoomBound: 0.1, minImportance: 0.8 },
  /** Continental zoom — major events (≥ 0.6) */
  { zoomBound: 0.3, minImportance: 0.6 },
  /** Regional zoom — notable events (≥ 0.4) */
  { zoomBound: 0.6, minImportance: 0.4 },
  /** Country / city zoom — most events (≥ 0.2) */
  { zoomBound: 1.0, minImportance: 0.2 },
] as const;

/** Show all events at this zoom level and above (importance ≥ 0). */
const LOD_FULL_DETAIL_ZOOM = 1.0 as const;

// ─────────────────────────────────────────────────────────────────────────────
// Core utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a React Flow zoom level to the minimum `importance_score` that should
 * be requested from the tile API.
 *
 * Uses discrete breakpoints (see {@link LOD_THRESHOLDS}) rather than a
 * continuous function, so the tile cache has fewer distinct URL shapes and
 * can be invalidated cleanly.
 *
 * @param zoom - React Flow fractional zoom level (typically 0.05 – 4.0).
 *               Values ≤ 0 are treated as the minimum zoom.
 * @returns Minimum importance score in [0, 0.8]. Pass this as `min_importance`
 *          to `GET /api/canvas/tiles`.
 *
 * @example
 * // At globe view
 * importanceThreshold(0.05); // → 0.8
 *
 * @example
 * // Fully zoomed in
 * importanceThreshold(2.0); // → 0
 */
export function importanceThreshold(zoom: number): number {
  for (const { zoomBound, minImportance } of LOD_THRESHOLDS) {
    if (zoom < zoomBound) {
      return minImportance;
    }
  }
  // zoom >= LOD_FULL_DETAIL_ZOOM — show everything
  return 0;
}
