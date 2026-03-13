/**
 * permalink.ts — URL hash encoding/decoding for Chronicle shareable links.
 *
 * Owns: parsing and serializing viewport state to/from the URL hash fragment.
 *
 * Does NOT: read or write the DOM, manage React state, or trigger navigation.
 *
 * Hash format:
 *   #z={zoom}&cx={centerX}&cy={centerY}&e={eventSlug}
 *
 *   - z  = ReactFlow zoom level float, e.g. z=0.45
 *   - cx = center X coordinate in canvas space, e.g. cx=1200
 *   - cy = center Y coordinate in canvas space, e.g. cy=800
 *   - e  = selected event slug (optional), e.g. e=world-war-ii
 *
 * All parameters are optional. Missing params → use app defaults.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum ReactFlow zoom level. */
const MIN_ZOOM = 0.01;

/** Maximum ReactFlow zoom level. */
const MAX_ZOOM = 10;

/** Number of decimal places to preserve when serializing zoom. */
const ZOOM_DECIMAL_PLACES = 4;

/** Number of decimal places to preserve when serializing center coordinates. */
const COORD_DECIMAL_PLACES = 1;

/** Regex that valid event slugs must match (alphanumeric, hyphens, underscores). */
const SLUG_PATTERN = /^[\w-]+$/;

/** Reasonable bounds for center coordinates to reject garbage values. */
const MIN_COORD = -1_000_000;
const MAX_COORD = 1_000_000;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decoded permalink state. All fields are optional — missing means "use default".
 */
export interface PermalinkState {
  /** ReactFlow zoom level. */
  zoom?: number;
  /** Center X coordinate in canvas space. */
  centerX?: number;
  /** Center Y coordinate in canvas space. */
  centerY?: number;
  /** Slug of the currently selected/highlighted event. */
  eventSlug?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp `value` between `min` and `max`.
 * Returns `undefined` if `value` is not a finite number.
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
 * parseHash('#z=0.45&cx=1200&cy=800&e=world-war-ii')
 * // → { zoom: 0.45, centerX: 1200, centerY: 800, eventSlug: 'world-war-ii' }
 */
export function parseHash(hash: string): PermalinkState {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return {};

  const params = new URLSearchParams(raw);
  const result: PermalinkState = {};

  // ── z = zoom ──────────────────────────────────────────────────────────────
  const z = params.get('z');
  if (z !== null) {
    const clamped = clampFinite(parseFloat(z), MIN_ZOOM, MAX_ZOOM);
    if (clamped !== undefined) result.zoom = clamped;
  }

  // ── cx = center X ─────────────────────────────────────────────────────────
  const cx = params.get('cx');
  if (cx !== null) {
    const clamped = clampFinite(parseFloat(cx), MIN_COORD, MAX_COORD);
    if (clamped !== undefined) result.centerX = clamped;
  }

  // ── cy = center Y ─────────────────────────────────────────────────────────
  const cy = params.get('cy');
  if (cy !== null) {
    const clamped = clampFinite(parseFloat(cy), MIN_COORD, MAX_COORD);
    if (clamped !== undefined) result.centerY = clamped;
  }

  // ── e = event slug ────────────────────────────────────────────────────────
  const e = params.get('e');
  if (e && SLUG_PATTERN.test(e)) {
    result.eventSlug = e;
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
 * @param state - The permalink state to encode.
 * @returns A query-string-style fragment, e.g. `z=0.4500&cx=1200.0&cy=800.0&e=world-war-ii`.
 *          Returns an empty string when there is nothing to encode.
 */
export function serializeHash(state: PermalinkState): string {
  const params = new URLSearchParams();

  if (state.zoom !== undefined) {
    params.set('z', state.zoom.toFixed(ZOOM_DECIMAL_PLACES));
  }

  if (state.centerX !== undefined) {
    params.set('cx', state.centerX.toFixed(COORD_DECIMAL_PLACES));
  }

  if (state.centerY !== undefined) {
    params.set('cy', state.centerY.toFixed(COORD_DECIMAL_PLACES));
  }

  if (state.eventSlug) {
    params.set('e', state.eventSlug);
  }

  return params.toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport math
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the ReactFlow viewport `{ x, y, zoom }` from canvas-space center
 * coordinates, given the current screen dimensions.
 *
 * The center point (cx, cy) is the canvas coordinate that should appear at the
 * center of the browser window.
 *
 * @param centerX - Canvas X coordinate at viewport center.
 * @param centerY - Canvas Y coordinate at viewport center.
 * @param zoom    - ReactFlow zoom level.
 * @returns A `{ x, y, zoom }` object suitable for `reactFlow.setViewport()`.
 */
export function centerToRfViewport(
  centerX: number,
  centerY: number,
  zoom: number,
): { x: number; y: number; zoom: number } {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;
  return {
    x: -(centerX * zoom) + screenW / 2,
    y: -(centerY * zoom) + screenH / 2,
    zoom,
  };
}

/**
 * Compute canvas-space center coordinates from a ReactFlow viewport,
 * given the current screen dimensions.
 *
 * @param rfViewport - The ReactFlow viewport `{ x, y, zoom }`.
 * @returns `{ centerX, centerY }` in canvas space.
 */
export function rfViewportToCenter(
  rfViewport: { x: number; y: number; zoom: number },
): { centerX: number; centerY: number } {
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 1080;
  return {
    centerX: (-rfViewport.x + screenW / 2) / rfViewport.zoom,
    centerY: (-rfViewport.y + screenH / 2) / rfViewport.zoom,
  };
}
