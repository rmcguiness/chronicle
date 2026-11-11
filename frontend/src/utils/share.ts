/**
 * share.ts — URLs for share pages and timeline deep links.
 *
 * Owns: building /event, /chain and timeline permalink URLs from snapshot data.
 * Does NOT own: rendering, data loading, or the permalink hash parser (permalink.ts).
 */

/** Timeline URL that opens the network view centred on `slug` with it selected. */
export function timelineHrefForEvent(slug: string): string {
  return `/#e=${encodeURIComponent(slug)}`;
}

/** Zoom used when a chain opens on the timeline: wide enough to show its neighbours. */
const CHAIN_ZOOM = 0.6;

/** Timeline URL for a chain: centred on its first event, zoomed out a little. */
export function timelineHrefForSpan(slug: string): string {
  return `/#z=${CHAIN_ZOOM}&e=${encodeURIComponent(slug)}`;
}

/** Year as shown on share pages: "44 BCE" or "1914". */
export function yearLabel(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year}`;
}

/** Title without the " — subtitle" part the seed data often carries. */
export function shortTitle(title: string): string {
  return title.split(' — ')[0].trim();
}
