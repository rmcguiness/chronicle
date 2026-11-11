/**
 * evidence.ts — labels, colours and counts for cited (curated) data.
 *
 * Owns: confidence-level presentation and citation tallies shared by the event panel,
 * chain pages and tests. Does NOT own: rendering (components/Evidence.tsx).
 */
import type { LinkConfidence, Source } from '../types';

export const CONFIDENCE_LABELS: Record<LinkConfidence, string> = {
  established: 'Established',
  debated: 'Debated',
  speculative: 'Speculative',
};

/** One-line meaning of each level, used as a tooltip and in the legend. */
export const CONFIDENCE_HINTS: Record<LinkConfidence, string> = {
  established: 'Two or more independent sources support this link and no notable dispute is known.',
  debated: 'Historians or sources disagree about this link or how much it mattered.',
  speculative: 'Supported by one source or by inference only.',
};

export const CONFIDENCE_COLORS: Record<LinkConfidence, string> = {
  established: '#34d399',
  debated: '#fbbf24',
  speculative: '#94a3b8',
};

/** Labels for chain origins. */
export const CHAIN_TYPE_LABELS: Record<string, string> = {
  scholarly: 'Sourced cause & effect chain',
  popular_internet: 'Popular internet chain',
  generated: 'Cause & effect chain',
};

/** Distinct sources among citations (by URL, else title). */
export function distinctSources(citations: (Source | undefined)[]): number {
  const keys = new Set<string>();
  for (const c of citations) {
    if (!c) continue;
    const key = c.original_url || c.title;
    if (key) keys.add(key);
  }
  return keys.size;
}

/** "Established · 2 sources" style summary for a set of links. */
export function confidenceTally(
  levels: (LinkConfidence | undefined)[],
): Record<LinkConfidence, number> {
  const tally: Record<LinkConfidence, number> = { established: 0, debated: 0, speculative: 0 };
  for (const l of levels) if (l) tally[l] += 1;
  return tally;
}

/** Year part of a publication date ("1914", "2015-12-16" → "2015"); empty when unknown. */
export function publicationYear(date?: string): string {
  const m = date ? /^-?\d{3,4}/.exec(date) : null;
  return m ? m[0] : '';
}
