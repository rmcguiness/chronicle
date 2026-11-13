/** Planet and glow colors for the space view. */
import type { EventCategory } from '../../types';

/** Planet body color by category: muted versions of the 2D view's category colors. */
export const PLANET_BODY: Record<EventCategory, string> = {
  war: '#c0504d',
  discovery: '#4f7fd1',
  political: '#8e6cc9',
  cultural: '#d08a48',
  natural: '#4fa76a',
  person: '#c9a93c',
};

/** Glow color by the best confidence of the links touching an event (index = rank). */
export const GLOW_BY_CONFIDENCE = ['#6f86b8', '#a78bfa', '#fbbf24', '#fff1cf'] as const;

/** Glow strength by confidence rank: unrated planets glow least. */
export const GLOW_INTENSITY = [0.55, 0.85, 1.0, 1.15] as const;

/** Link line color by confidence rank. */
export const LINK_BY_CONFIDENCE = ['#5d7bb0', '#a78bfa', '#fbbf24', '#ffe9b8'] as const;

export const CONFIDENCE_LABELS = ['Imported link, not rated', 'Speculative', 'Debated', 'Established'] as const;
