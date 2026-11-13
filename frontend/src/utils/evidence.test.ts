import { describe, expect, it } from 'vitest';
import { confidenceTally, distinctSources, publicationYear } from './evidence';

describe('evidence helpers', () => {
  it('counts distinct sources by URL, then title', () => {
    expect(
      distinctSources([
        { id: '1', title: 'A', source_type: 'secondary', original_url: 'https://a' },
        { id: '2', title: 'A again', source_type: 'secondary', original_url: 'https://a' },
        { id: '3', title: 'B', source_type: 'primary' },
        undefined,
      ]),
    ).toBe(2);
  });

  it('tallies confidence levels', () => {
    expect(confidenceTally(['established', 'debated', 'debated', undefined])).toEqual({
      established: 1,
      debated: 2,
      speculative: 0,
    });
  });

  it('reads the year from a publication date', () => {
    expect(publicationYear('2015-12-16')).toBe('2015');
    expect(publicationYear('1914')).toBe('1914');
    expect(publicationYear(undefined)).toBe('');
  });
});
