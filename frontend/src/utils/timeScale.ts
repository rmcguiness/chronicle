/**
 * timeScale.ts
 *
 * Shared date/year utilities for the Chronicle network view.
 * Used by NetworkView (node X positioning) and EventNode (pill width calculation).
 *
 * Owns: fractional year parsing from ISO/PostgreSQL date strings.
 * Does NOT own: canvas coordinate math, viewport state, or ReactFlow logic.
 */

/** Number of months in a year — used for fractional year calculation. */
const MONTHS_PER_YEAR = 12;

/** Approximate days in a year — used for fractional day-within-year calculation. */
const DAYS_PER_YEAR = 365;

/**
 * Convert a date string from the Chronicle backend into a fractional year number.
 *
 * Handles two BCE formats:
 *   - PostgreSQL suffix:  "3200-01-01 BC"
 *   - ISO negative year: "-3200-01-01"
 *
 * @param dateStr  - Date string from the backend (ISO or PostgreSQL BC notation).
 * @param fallback - Returned as-is when parsing fails (typically event.year_approx).
 * @returns Fractional year, e.g. 1939.5 for mid-July 1939, -3200.0 for 3200 BCE.
 */
export function dateToFractionalYear(dateStr: string, fallback: number): number {
  let str = dateStr.trim();
  let isBC = false;

  // Handle PostgreSQL " BC" suffix, e.g. "3200-01-01 BC"
  if (str.endsWith(' BC')) {
    isBC = true;
    str = str.slice(0, -3).trim();
  }

  const parts = str.split('-');

  // Handle ISO negative year prefix, e.g. "-3200-01-01" → ["", "3200", "01", "01"]
  let yearStr: string;
  let monthStr: string;
  let dayStr: string | undefined;

  if (parts[0] === '' && parts.length >= 3) {
    isBC = true;
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

  const signedYear = isBC ? -year : year;
  return signedYear + (month - 1) / MONTHS_PER_YEAR + (day - 1) / DAYS_PER_YEAR;
}
