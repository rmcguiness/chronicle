import { describe, expect, it } from 'vitest';
import { shortTitle, timelineHrefForEvent, timelineHrefForSpan, yearLabel } from './share';
import { parseHash } from './permalink';

describe('share URLs', () => {
  it('deep-links an event into the timeline', () => {
    const href = timelineHrefForEvent('battle-of-hastings-1066');
    expect(href).toBe('/#e=battle-of-hastings-1066');
    expect(parseHash(href.slice(1)).eventSlug).toBe('battle-of-hastings-1066');
  });

  it('opens a chain on its first event, zoomed out', () => {
    expect(timelineHrefForSpan('a')).toBe('/#z=0.6&e=a');
    const state = parseHash('#z=0.6&e=a');
    expect([state.zoom, state.eventSlug]).toEqual([0.6, 'a']);
  });

  it('formats years and titles', () => {
    expect(yearLabel(-480)).toBe('480 BCE');
    expect(yearLabel(1492)).toBe('1492');
    expect(shortTitle('Bronze Age Begins — Tin-Copper Alloy Revolution')).toBe('Bronze Age Begins');
  });
});
