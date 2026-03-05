/**
 * timeScale.ts
 *
 * Dynamic time-axis scale system for the network view.
 * Replaces the old fixed PIXELS_PER_YEAR constant with a zoom-aware scale
 * so that node positions and timeline labels adapt to the current zoom level.
 *
 * The canvas width grows with zoom: at default zoom (~0.08–0.1) the visual
 * density is roughly the same as the old 15 000 px / 7 100 year layout.
 */

import { CANVAS_CONSTANTS } from '../types';

const { BASE_YEAR_MIN, BASE_YEAR_MAX } = CANVAS_CONSTANTS;

/** Total year span covered by the canvas. */
const YEAR_SPAN = BASE_YEAR_MAX - BASE_YEAR_MIN; // 7100

/**
 * Base canvas width in pixels (at zoom = 1).
 * This is intentionally larger than the old fixed 15 000 px canvas so that
 * at the typical default zoom (0.08) the effective screen density is similar.
 *
 * Old system: 15 000 px canvas, default zoom 0.08 → effective ~1 200 px visible
 * New system: same 15 000 px canvas, but yearToX now accepts fractional years
 * from date_earliest for sub-year precision.
 */
const CANVAS_WIDTH = 15_000;

/**
 * Convert a historical year (or fractional year) to a canvas X coordinate.
 *
 * Accepts fractional years for sub-year precision when date_earliest is
 * available (e.g. 1939.67 for September 1939).
 *
 * @param year - Year value (negative = BCE). May be fractional.
 * @returns X pixel position on the canvas.
 */
export function yearToX(year: number): number {
  return ((year - BASE_YEAR_MIN) / YEAR_SPAN) * CANVAS_WIDTH;
}

/**
 * Convert a canvas X coordinate back to a (fractional) year.
 *
 * @param x - X pixel position on the canvas.
 * @returns Historical year (may be fractional).
 */
export function xToYear(x: number): number {
  return (x / CANVAS_WIDTH) * YEAR_SPAN + BASE_YEAR_MIN;
}

/**
 * Convert a screen-space X pixel to a historical year given viewport state.
 *
 * @param screenX - Pixel position on screen.
 * @param vpX     - Viewport X translation (from ReactFlow).
 * @param zoom    - Viewport zoom level.
 * @returns Historical year (fractional).
 */
export function screenToYear(screenX: number, vpX: number, zoom: number): number {
  return xToYear((screenX - vpX) / zoom);
}

/**
 * Convert a historical year to a screen-space X pixel given viewport state.
 *
 * @param year - Year value (may be fractional).
 * @param vpX  - Viewport X translation (from ReactFlow).
 * @param zoom - Viewport zoom level.
 * @returns Screen X pixel.
 */
export function yearToScreenX(year: number, vpX: number, zoom: number): number {
  return yearToX(year) * zoom + vpX;
}

/**
 * Parse an ISO date string (e.g. "1939-09-01") into a fractional year.
 *
 * Month and day are converted to a year fraction:
 *   "1939-09-01" → 1939 + (9-1)/12 + (1-1)/365 ≈ 1939.667
 *
 * Falls back to the integer year_approx if parsing fails.
 *
 * @param dateStr    - ISO date string like "1939-09-01".
 * @param fallback   - Integer year to use if parsing fails.
 * @returns Fractional year.
 */
export function dateToFractionalYear(dateStr: string, fallback: number): number {
  // Handle PostgreSQL BCE format: "3200-01-01 BC"
  let normalised = dateStr;
  let bcSuffix = false;
  if (normalised.endsWith(' BC')) {
    normalised = normalised.slice(0, -3);
    bcSuffix = true;
  }

  const parts = normalised.split('-');
  if (parts.length < 2) return fallback;

  // Handle negative years (BCE): "-0500-03-15" splits as ["", "0500", "03", "15"]
  let yearStr: string;
  let monthStr: string;
  let dayStr: string | undefined;
  let negative = false;

  if (parts[0] === '' && parts.length >= 3) {
    // Negative year (ISO format fallback)
    negative = true;
    yearStr = parts[1];
    monthStr = parts[2];
    dayStr = parts[3];
  } else {
    yearStr = parts[0];
    monthStr = parts[1];
    dayStr = parts[2];
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = dayStr ? parseInt(dayStr, 10) : 1;

  if (isNaN(year) || isNaN(month)) return fallback;

  const signedYear = (negative || bcSuffix) ? -year : year;
  return signedYear + (month - 1) / 12 + (day - 1) / 365;
}

/** Tick level descriptor for zoom-aware timeline labels. */
export interface TickLevel {
  /** Interval between major (labelled) ticks in years. */
  majorInterval: number;
  /** Interval between minor ticks in years. */
  minorInterval: number;
  /** Format function for major tick labels. */
  formatLabel: (year: number) => string;
}

/**
 * Format a year as a human-readable label (e.g. "3000 BCE", "1500", "CE").
 *
 * @param year - The historical year.
 * @returns Formatted string.
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return 'CE';
  return `${year}`;
}

/** Month abbreviations for sub-year labels. */
const MONTH_ABBR = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Determine the appropriate tick level for a given ReactFlow zoom.
 *
 * | Zoom range    | Major labels  | Minor ticks     |
 * |---------------|---------------|-----------------|
 * | < 0.15        | centuries      | 50 years        |
 * | 0.15 – 0.4   | decades        | 10 years        |
 * | 0.4 – 1.5    | years (×10)    | years            |
 * | 1.5 – 5      | years          | quarters         |
 * | > 5           | months         | months           |
 *
 * @param zoom - Current ReactFlow zoom level.
 * @returns TickLevel descriptor.
 */
export function getTickLevel(zoom: number): TickLevel {
  if (zoom < 0.15) {
    // Century labels
    return {
      majorInterval: 100,
      minorInterval: 50,
      formatLabel: formatYear,
    };
  }
  if (zoom < 0.4) {
    // Decade labels
    return {
      majorInterval: 50,
      minorInterval: 10,
      formatLabel: formatYear,
    };
  }
  if (zoom < 1.5) {
    // Year labels (every 10 years major, every year minor for high end)
    const yearSpanPerScreen = window.innerWidth / (CANVAS_WIDTH * zoom) * YEAR_SPAN;
    const majInterval = yearSpanPerScreen > 200 ? 50 : yearSpanPerScreen > 80 ? 20 : 10;
    const minInterval = yearSpanPerScreen > 200 ? 10 : yearSpanPerScreen > 80 ? 5 : 1;
    return {
      majorInterval: majInterval,
      minorInterval: minInterval,
      formatLabel: formatYear,
    };
  }
  if (zoom < 5) {
    // Year labels with finer ticks
    return {
      majorInterval: 5,
      minorInterval: 1,
      formatLabel: formatYear,
    };
  }
  if (zoom < 50) {
    // Year labels with month minor ticks
    return {
      majorInterval: 1,
      minorInterval: 1 / 12,
      formatLabel: (year: number) => {
        const wholeYear = Math.floor(year);
        const monthFrac = year - wholeYear;
        const monthIdx = Math.round(monthFrac * 12);
        if (monthIdx === 0 || monthIdx === 12) return formatYear(wholeYear);
        return `${MONTH_ABBR[monthIdx % 12]} ${wholeYear}`;
      },
    };
  }
  if (zoom < 500) {
    // Month major labels with week minor ticks
    return {
      majorInterval: 1 / 12,
      minorInterval: 1 / 52,
      formatLabel: (year: number) => {
        const wholeYear = Math.floor(year);
        const monthFrac = year - wholeYear;
        const monthIdx = Math.round(monthFrac * 12);
        if (monthIdx === 0 || monthIdx === 12) return `Jan ${wholeYear}`;
        return `${MONTH_ABBR[monthIdx % 12]} ${wholeYear}`;
      },
    };
  }
  // Day major labels with week minor ticks
  return {
    majorInterval: 1 / 365,
    minorInterval: 1 / 52,
    formatLabel: (year: number) => {
      const wholeYear = Math.floor(year);
      const dayOfYear = Math.round((year - wholeYear) * 365);
      // Approximate month/day from day-of-year
      const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let remaining = dayOfYear;
      let monthIdx = 0;
      for (let i = 0; i < 12; i++) {
        if (remaining < DAYS_IN_MONTH[i]) {
          monthIdx = i;
          break;
        }
        remaining -= DAYS_IN_MONTH[i];
        monthIdx = i + 1;
      }
      if (monthIdx >= 12) monthIdx = 11;
      const dayNum = remaining + 1;
      return `${MONTH_ABBR[monthIdx]} ${dayNum}`;
    },
  };
}

/**
 * Generate tick positions (in years) for the visible range.
 *
 * @param visibleMin - Leftmost visible year (fractional).
 * @param visibleMax - Rightmost visible year (fractional).
 * @param interval   - Tick interval in years.
 * @returns Array of tick year values within the visible range.
 */
export function generateTicks(
  visibleMin: number,
  visibleMax: number,
  interval: number,
): number[] {
  const ticks: number[] = [];
  // Snap to interval grid
  const firstIndex = Math.ceil(visibleMin / interval);
  const lastIndex = Math.floor(visibleMax / interval);
  // Cap tick count to avoid performance issues at extreme zoom
  const maxTicks = 2000;
  const count = lastIndex - firstIndex + 1;
  if (count > maxTicks) {
    // Skip ticks to stay within budget
    const step = Math.ceil(count / maxTicks);
    for (let i = firstIndex; i <= lastIndex; i += step) {
      ticks.push(Math.round(i * interval * 100000) / 100000);
    }
  } else {
    for (let i = firstIndex; i <= lastIndex; i++) {
      ticks.push(Math.round(i * interval * 100000) / 100000);
    }
  }
  return ticks;
}

/** Re-export CANVAS_WIDTH for consumers that need it. */
export { CANVAS_WIDTH, YEAR_SPAN, BASE_YEAR_MIN, BASE_YEAR_MAX };
