/**
 * permalink.test.ts — Unit tests for the permalink parse/serialize utilities.
 *
 * Tests cover:
 *   - parseHash: happy path, missing params, edge cases, invalid values
 *   - serializeHash: round-trip, empty state, partial state
 *   - yearRangeToRfViewport: viewport math
 */

import { describe, it, expect } from 'vitest';
import { parseHash, serializeHash, yearRangeToRfViewport } from './permalink';
import { CANVAS_CONSTANTS } from '../types';

const { PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// parseHash
// ─────────────────────────────────────────────────────────────────────────────

describe('parseHash', () => {
  it('parses a full hash with all params', () => {
    const result = parseHash('#t=-500,1500&z=0.3&e=fall-of-rome&r=americas,asia');
    expect(result).toEqual({
      startYear: -500,
      endYear: 1500,
      zoom: 0.3,
      eventSlug: 'fall-of-rome',
      hiddenRegions: ['americas', 'asia'],
    });
  });

  it('works without the leading #', () => {
    const result = parseHash('t=100,200&z=0.5');
    expect(result.startYear).toBe(100);
    expect(result.endYear).toBe(200);
    expect(result.zoom).toBe(0.5);
  });

  it('returns empty object for empty hash', () => {
    expect(parseHash('')).toEqual({});
    expect(parseHash('#')).toEqual({});
  });

  it('omits startYear/endYear when t param is malformed', () => {
    expect(parseHash('#t=notanumber')).toEqual({});
    expect(parseHash('#t=100')).toEqual({}); // only one part
    expect(parseHash('#t=abc,xyz')).toEqual({});
  });

  it('rejects startYear >= endYear', () => {
    expect(parseHash('#t=500,500')).toEqual({});
    expect(parseHash('#t=1000,500')).toEqual({});
  });

  it('clamps extreme year values to bounds', () => {
    const result = parseHash('#t=-99999,99999&z=0.1');
    expect(result.startYear).toBe(-10_000);
    expect(result.endYear).toBe(3_000);
  });

  it('omits zoom when z is not a number', () => {
    expect(parseHash('#z=notanumber').zoom).toBeUndefined();
  });

  it('clamps zoom to valid range', () => {
    expect(parseHash('#z=0.0001').zoom).toBe(0.01);
    expect(parseHash('#z=999').zoom).toBe(10);
  });

  it('omits eventSlug for slugs with invalid characters', () => {
    expect(parseHash('#e=has space').eventSlug).toBeUndefined();
    expect(parseHash('#e=has/slash').eventSlug).toBeUndefined();
    // Valid slug
    expect(parseHash('#e=valid-slug_123').eventSlug).toBe('valid-slug_123');
  });

  it('filters out invalid region codes from r param', () => {
    const result = parseHash('#r=americas,invalid_region,asia');
    expect(result.hiddenRegions).toEqual(['americas', 'asia']);
  });

  it('omits hiddenRegions when all region codes are invalid', () => {
    expect(parseHash('#r=invalid').hiddenRegions).toBeUndefined();
  });

  it('handles all valid region codes', () => {
    const result = parseHash('#r=europe,americas,asia,middle_east_africa,global');
    expect(result.hiddenRegions).toEqual([
      'europe', 'americas', 'asia', 'middle_east_africa', 'global',
    ]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// serializeHash
// ─────────────────────────────────────────────────────────────────────────────

describe('serializeHash', () => {
  it('serializes a full state', () => {
    const fragment = serializeHash({
      startYear: -500,
      endYear: 1500,
      zoom: 0.3,
      eventSlug: 'fall-of-rome',
      hiddenRegions: ['americas', 'asia'],
    });
    expect(fragment).toContain('t=-500,1500');
    expect(fragment).toContain('z=0.3000');
    expect(fragment).toContain('e=fall-of-rome');
    expect(fragment).toContain('r=americas,asia');
  });

  it('returns empty string for empty state', () => {
    expect(serializeHash({})).toBe('');
  });

  it('omits t when only one of startYear/endYear is provided', () => {
    expect(serializeHash({ startYear: 100 })).not.toContain('t=');
    expect(serializeHash({ endYear: 100 })).not.toContain('t=');
  });

  it('omits e when eventSlug is falsy', () => {
    expect(serializeHash({ eventSlug: undefined })).not.toContain('e=');
    expect(serializeHash({ eventSlug: '' })).not.toContain('e=');
  });

  it('omits r when hiddenRegions is empty', () => {
    expect(serializeHash({ hiddenRegions: [] })).not.toContain('r=');
  });

  it('round-trips through parse → serialize', () => {
    const original = '#t=-500,1500&z=0.3000&e=fall-of-rome&r=americas,asia';
    const parsed = parseHash(original);
    const reserialized = serializeHash(parsed);
    // Re-parse the reserialized to verify structural equality (order may differ)
    expect(parseHash(reserialized)).toEqual(parsed);
  });

  it('uses fixed 4 decimal places for zoom', () => {
    expect(serializeHash({ zoom: 0.1 })).toContain('z=0.1000');
    expect(serializeHash({ zoom: 1 })).toContain('z=1.0000');
  });

  it('uses readable commas (not %2C) in t and r', () => {
    const fragment = serializeHash({
      startYear: 0, endYear: 1000,
      hiddenRegions: ['europe', 'americas'],
    });
    expect(fragment).not.toContain('%2C');
    expect(fragment).toContain('t=0,1000');
    expect(fragment).toContain('r=europe,americas');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// yearRangeToRfViewport
// ─────────────────────────────────────────────────────────────────────────────

describe('yearRangeToRfViewport', () => {
  it('returns y=0 always', () => {
    expect(yearRangeToRfViewport(0, 1).y).toBe(0);
    expect(yearRangeToRfViewport(-500, 0.5).y).toBe(0);
  });

  it('preserves the zoom value', () => {
    expect(yearRangeToRfViewport(0, 0.3).zoom).toBe(0.3);
    expect(yearRangeToRfViewport(1000, 2).zoom).toBe(2);
  });

  it('computes correct x for BASE_YEAR_MIN start (x should be 0)', () => {
    const { x } = yearRangeToRfViewport(BASE_YEAR_MIN, 1);
    expect(x).toBeCloseTo(0);
  });

  it('computes correct x for a known year + zoom', () => {
    const year = 0;
    const zoom = 0.1;
    const { x } = yearRangeToRfViewport(year, zoom);
    // x = -(year - BASE_YEAR_MIN) * PPY * zoom
    const expected = -(year - BASE_YEAR_MIN) * PIXELS_PER_YEAR * zoom;
    expect(x).toBeCloseTo(expected);
  });

  it('is the inverse of the onMoveEnd year calculation', () => {
    // If we start at year 500 with zoom 0.3, compute the RF x.
    // Then verify that recovering yearMin from that x gives back 500.
    const startYear = 500;
    const zoom = 0.3;
    const { x } = yearRangeToRfViewport(startYear, zoom);
    // From Canvas onMoveEnd: yearMin = (-rfX / zoom) / PPY + BASE_YEAR_MIN
    const recovered = (-x / zoom) / PIXELS_PER_YEAR + BASE_YEAR_MIN;
    expect(recovered).toBeCloseTo(startYear);
  });
});
