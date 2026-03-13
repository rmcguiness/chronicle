/**
 * People network constants — role colors, edge sizing, thresholds.
 *
 * Owns: visual constants for the people network graph.
 * Does NOT own: layout logic, data fetching.
 */

/** Color mapping for person role categories. */
export const ROLE_COLORS: Record<string, string> = {
  ruler: '#a855f7',       // purple
  scientist: '#3b82f6',   // blue
  military: '#ef4444',     // red
  religious: '#eab308',    // yellow
  artist: '#22c55e',       // green
  explorer: '#f97316',     // orange
  other: '#64748b',        // slate
} as const;

/** Edge thickness for connections with fewer shared events. */
export const EDGE_THIN_WIDTH = 1;

/** Edge thickness for connections with many shared events. */
export const EDGE_THICK_WIDTH = 3;

/** Minimum shared events for a thick edge. */
export const SHARED_EVENT_THICK_THRESHOLD = 4;

/**
 * Keywords that map a role string to a role category for color coding.
 * Checked in order — first match wins.
 */
const ROLE_CATEGORY_KEYWORDS: Array<[string[], string]> = [
  [['ruler', 'king', 'queen', 'emperor', 'empress', 'pharaoh', 'sultan', 'tsar', 'leader', 'president', 'chancellor', 'statesman', 'politician'], 'ruler'],
  [['scientist', 'physicist', 'chemist', 'biologist', 'mathematician', 'astronomer', 'philosopher', 'inventor', 'engineer'], 'scientist'],
  [['military', 'general', 'admiral', 'warrior', 'commander', 'conqueror', 'soldier'], 'military'],
  [['religious', 'pope', 'priest', 'bishop', 'prophet', 'saint', 'monk', 'cardinal', 'reformer'], 'religious'],
  [['artist', 'painter', 'sculptor', 'composer', 'musician', 'writer', 'poet', 'playwright', 'author', 'architect'], 'artist'],
  [['explorer', 'navigator', 'cartographer', 'voyager', 'colonizer'], 'explorer'],
];

/**
 * Determine the role category for a person based on their roles array.
 * Returns the first matching category, or 'other' if none match.
 *
 * @param roles - Array of role strings from the backend
 * @returns Role category key matching ROLE_COLORS
 */
export function getRoleCategory(roles: string[] | null | undefined): string {
  if (!roles || roles.length === 0) return 'other';

  const lowerRoles = roles.map((r) => r.toLowerCase());

  for (const [keywords, category] of ROLE_CATEGORY_KEYWORDS) {
    for (const role of lowerRoles) {
      if (keywords.some((kw) => role.includes(kw))) {
        return category;
      }
    }
  }

  return 'other';
}
