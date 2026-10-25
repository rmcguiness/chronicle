import { describe, expect, it } from 'vitest';
import { highlightParts, nextActiveIndex } from './searchNav';

describe('nextActiveIndex', () => {
  it('moves down from the input into the list and wraps at the end', () => {
    expect(nextActiveIndex(-1, 3, 'ArrowDown')).toBe(0);
    expect(nextActiveIndex(0, 3, 'ArrowDown')).toBe(1);
    expect(nextActiveIndex(2, 3, 'ArrowDown')).toBe(0);
  });

  it('moves up and wraps to the last option', () => {
    expect(nextActiveIndex(-1, 3, 'ArrowUp')).toBe(2);
    expect(nextActiveIndex(0, 3, 'ArrowUp')).toBe(2);
    expect(nextActiveIndex(2, 3, 'ArrowUp')).toBe(1);
  });

  it('jumps with Home and End', () => {
    expect(nextActiveIndex(1, 5, 'Home')).toBe(0);
    expect(nextActiveIndex(1, 5, 'End')).toBe(4);
  });

  it('returns -1 when there are no options and ignores other keys', () => {
    expect(nextActiveIndex(0, 0, 'ArrowDown')).toBe(-1);
    expect(nextActiveIndex(1, 3, 'a')).toBe(1);
  });

  it('recovers from a stale index after the list shrinks', () => {
    expect(nextActiveIndex(7, 3, 'ArrowDown')).toBe(0);
  });
});

describe('highlightParts', () => {
  it('marks case-insensitive matches of each query word', () => {
    expect(highlightParts('Fall of Rome', 'rome fall')).toEqual([
      { text: 'Fall', match: true },
      { text: ' of ', match: false },
      { text: 'Rome', match: true },
    ]);
  });

  it('ignores one-letter words and returns plain text when nothing matches', () => {
    expect(highlightParts('Treaty of Versailles', 'a')).toEqual([{ text: 'Treaty of Versailles', match: false }]);
    expect(highlightParts('Treaty of Versailles', 'zulu')).toEqual([{ text: 'Treaty of Versailles', match: false }]);
  });

  it('treats regex characters in the query literally', () => {
    expect(highlightParts('C++ (1985)', 'c++ (1985)')).toEqual([
      { text: 'C++', match: true },
      { text: ' ', match: false },
      { text: '(1985)', match: true },
    ]);
  });

  it('prefers the longest overlapping term', () => {
    expect(highlightParts('Romans', 'rom romans')).toEqual([{ text: 'Romans', match: true }]);
  });

  it('handles empty text', () => {
    expect(highlightParts('', 'rome')).toEqual([]);
  });
});
