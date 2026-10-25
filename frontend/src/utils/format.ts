/**
 * Display formatting helpers shared across components.
 */

/**
 * Human-readable year: negative years become BCE ("3300 BCE"), years before
 * 1000 CE get an explicit "CE" so "632" isn't mistaken for a number.
 *
 * @param year - Year (negative = BCE). Non-finite input returns "Unknown date".
 */
export function formatYear(year: number | null | undefined): string {
  if (year == null || !Number.isFinite(year)) return 'Unknown date';
  const y = Math.round(year);
  if (y < 0) return `${Math.abs(y).toLocaleString('en-US')} BCE`;
  if (y < 1000) return `${y} CE`;
  return String(y);
}
