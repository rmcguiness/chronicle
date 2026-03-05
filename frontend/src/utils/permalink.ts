/**
 * permalink.ts — URL hash encoding/decoding for Chronicle shareable links.
 *
 * Owns: parsing and serializing viewport state to/from the URL hash fragment.
 *       Computing a ReactFlow viewport transform from a year range + zoom.
 *
 * Does NOT: read or write the DOM, manage React state, or trigger navigation.
 *
 * Hash format:
 *   #t={startYear},{endYear}&z={zoom}&e={eventSlug}&r={regionCodes}
 *
 *   - t = visible year range, e.g. t=-500,1500
 *   - z = ReactFlow zoom level float, e.g. z=0.3
 *   - e = selected event slug, e.g. e=fall-of-rome
 *   - r = comma-separated region codes to hide, e.g. r=americas,asia
 *
 * All parameters are optional. Missing params → use app defaults.
 */

import { CANVAS_CONSTANTS } from '../types';
import type { Region } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum allowed year value (deep prehistory guard). */
const MIN_YEAR = -10_000;

/** Maximum allowed year value (far future guard). */
const MAX_YEAR = 3_000;

/** Minimum ReactFlow zoom level. */
const MIN_ZOOM = 0.01;

/** Maximum ReactFlow zoom level. */
const MAX_ZOOM = 10;

/** Number of decimal places to preserve when serializing zoom. */
const ZOOM_DECIMAL_PLACES = 4;

/** Regex that valid event slugs must match (alphanumeric, hyphens, underscores). */
const SLUG_PATTERN = /^[\w-]+$/;

/** Canonical set of valid region codes for hash validation. */
const VALID_REGIONS = new Set<Region>([
  'europe',
  'americas',
  'asia',
  'middle_east_africa',
  'global',
]);

const { PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decoded permalink state. All fields are optional — missing means "use default".
 */
export interface PermalinkState {
  /** Start of the visible year range (left edge of viewport). */
  startYear?: number;
  /** End of the visible year range (right edge of viewport). */
  endYear?: number;
  /** ReactFlow zoom level. */
  zoom?: number;
  /** Slug of the currently selected/highlighted event. */
  eventSlug?: string;
  /** Region codes whose swim-lane bands should be collapsed (hidden). */
  hiddenRegions?: Region[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp `value` between `min` and `max`.
 * Returns `undefined` if `value` is not a finite number.
 *
 * @param value - The raw number to validate and clamp.
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 */
function clampFinite(value: number, min: number, max: number): number | undefined {
  if (!Number.isFinite(value)) return undefined;
  return Math.max(min, Math.min(max, value));
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a URL hash string into a {@link PermalinkState}.
 *
 * Silently ignores malformed or out-of-range values — invalid params are
 * simply omitted from the returned object rather than throwing.
 *
 * @param hash - The `window.location.hash` value (leading `#` is optional).
 * @returns A partial state object containing only the valid, in-range params.
 *
 * @example
 * parseHash('#t=-500,1500&z=0.3&e=fall-of-rome&r=americas')
 * // → { startYear: -500, endYear: 1500, zoom: 0.3, eventSlug: 'fall-of-rome',
 * //     hiddenRegions: ['americas'] }
 */
export function parseHash(hash: string): PermalinkState {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return {};

  const params = new URLSearchParams(raw);
  const result: PermalinkState = {};

  // ── t = startYear,endYear ─────────────────────────────────────────────────
  const t = params.get('t');
  if (t) {
    const parts = t.split(',');
    if (parts.length === 2) {
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);
      const clampedStart = clampFinite(start, MIN_YEAR, MAX_YEAR);
      const clampedEnd = clampFinite(end, MIN_YEAR, MAX_YEAR);
      if (
        clampedStart !== undefined &&
        clampedEnd !== undefined &&
        clampedStart < clampedEnd
      ) {
        result.startYear = clampedStart;
        result.endYear = clampedEnd;
      }
    }
  }

  // ── z = zoom ──────────────────────────────────────────────────────────────
  const z = params.get('z');
  if (z !== null) {
    const clamped = clampFinite(parseFloat(z), MIN_ZOOM, MAX_ZOOM);
    if (clamped !== undefined) result.zoom = clamped;
  }

  // ── e = event slug ────────────────────────────────────────────────────────
  const e = params.get('e');
  if (e && SLUG_PATTERN.test(e)) {
    result.eventSlug = e;
  }

  // ── r = comma-separated hidden region codes ───────────────────────────────
  const r = params.get('r');
  if (r) {
    const regions = r
      .split(',')
      .filter((code): code is Region => VALID_REGIONS.has(code as Region));
    if (regions.length > 0) {
      result.hiddenRegions = regions;
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Serialize
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serialize a {@link PermalinkState} into a URL hash fragment string
 * (without the leading `#`).
 *
 * Parameters with undefined values are omitted from the output.
 * An empty year range or zoom produces no `t`/`z` param.
 *
 * @param state - The permalink state to encode.
 * @returns A query-string-style fragment, e.g. `t=-500,1500&z=0.3000&e=fall-of-rome`.
 *          Returns an empty string when there is nothing to encode.
 *
 * @example
 * serializeHash({ startYear: -500, endYear: 1500, zoom: 0.3 })
 * // → 't=-500%2C1500&z=0.3000'
 */
export function serializeHash(state: PermalinkState): string {
  const params = new URLSearchParams();

  if (state.startYear !== undefined && state.endYear !== undefined) {
    params.set('t', `${state.startYear},${state.endYear}`);
  }

  if (state.zoom !== undefined) {
    // Fixed precision avoids floating-point noise in the URL
    params.set('z', state.zoom.toFixed(ZOOM_DECIMAL_PLACES));
  }

  if (state.eventSlug) {
    params.set('e', state.eventSlug);
  }

  if (state.hiddenRegions && state.hiddenRegions.length > 0) {
    params.set('r', state.hiddenRegions.join(','));
  }

  // URLSearchParams encodes commas; replace %2C with , for readability
  return params.toString().replace(/%2C/g, ',');
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport math
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the ReactFlow viewport transform `{ x, y, zoom }` that frames the
 * given year range at the given zoom level.
 *
 * The x offset is derived so that `startYear` appears at the left edge of
 * the viewport (screen x = 0). The y offset defaults to 0 since vertical
 * position is not encoded in the hash.
 *
 * Inverse of the transform applied in `onMoveEnd` in Canvas.tsx:
 *   yearMin = (-rfX / zoom) / PPY + BASE_YEAR_MIN
 *   ⟹  rfX = -(yearMin - BASE_YEAR_MIN) * PPY * zoom
 *
 * @param startYear - The leftmost visible year (left edge of viewport).
 * @param zoom - The ReactFlow zoom level to apply.
 * @returns A `{ x, y, zoom }` object suitable for `reactFlow.setViewport()`.
 */
export function yearRangeToRfViewport(
  startYear: number,
  zoom: number,
): { x: number; y: number; zoom: number } {
  const x = -(startYear - BASE_YEAR_MIN) * PIXELS_PER_YEAR * zoom;
  return { x, y: 0, zoom };
}
