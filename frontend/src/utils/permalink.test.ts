/**
 * permalink.test.ts — Unit tests for the permalink parse/serialize utilities.
 *
 * Tests cover:
 *   - parseHash: happy path, missing params, edge cases, invalid values
 *   - serializeHash: round-trip, empty state, partial state
 *   - centerToRfViewport / rfViewportToCenter: viewport math round-trip
 */

import { describe, it, expect } from 'vitest';
import { parseHash, serializeHash, centerToRfViewport, rfViewportToCenter } from './permalink';

// ─────────────────────────────────────────────────────────────────────────────
// parseHash
// ─────────────────────────────────────────────────────────────────────────────

describe('parseHash', () => {
  it('parses a full hash with all params', () => {
    const result = parseHash('#z=0.45&cx=1200&cy=800&e=world-war-ii');
    expect(result).toEqual({
      zoom: 0.45,
      centerX: 1200,
      centerY: 800,
      eventSlug: 'world-war-ii',
    });
  });

  it('works without the leading #', () => {
    const result = parseHash('z=0.5&cx=100&cy=200');
    expect(result.zoom).toBe(0.5);
    expect(result.centerX).toBe(100);
    expect(result.centerY).toBe(200);
  });

  it('returns empty object for empty hash', () => {
    expect(parseHash('')).toEqual({});
    expect(parseHash('#')).toEqual({});
  });

  it('omits zoom when z is not a number', () => {
    expect(parseHash('#z=notanumber').zoom).toBeUndefined();
  });

  it('clamps zoom to valid range', () => {
    expect(parseHash('#z=0.0001').zoom).toBe(0.01);
    expect(parseHash('#z=999').zoom).toBe(10);
  });

  it('parses negative center coordinates', () => {
    const result = parseHash('#cx=-500&cy=-300');
    expect(result.centerX).toBe(-500);
    expect(result.centerY).toBe(-300);
  });

  it('omits center coords when not a number', () => {
    expect(parseHash('#cx=abc').centerX).toBeUndefined();
    expect(parseHash('#cy=abc').centerY).toBeUndefined();
  });

  it('omits eventSlug for slugs with invalid characters', () => {
    expect(parseHash('#e=has space').eventSlug).toBeUndefined();
    expect(parseHash('#e=has/slash').eventSlug).toBeUndefined();
    expect(parseHash('#e=valid-slug_123').eventSlug).toBe('valid-slug_123');
  });

  it('handles partial params gracefully', () => {
    const result = parseHash('#z=0.5&e=test-event');
    expect(result.zoom).toBe(0.5);
    expect(result.centerX).toBeUndefined();
    expect(result.centerY).toBeUndefined();
    expect(result.eventSlug).toBe('test-event');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// serializeHash
// ─────────────────────────────────────────────────────────────────────────────

describe('serializeHash', () => {
  it('serializes a full state', () => {
    const fragment = serializeHash({
      zoom: 0.45,
      centerX: 1200,
      centerY: 800,
      eventSlug: 'world-war-ii',
    });
    expect(fragment).toContain('z=0.4500');
    expect(fragment).toContain('cx=1200.0');
    expect(fragment).toContain('cy=800.0');
    expect(fragment).toContain('e=world-war-ii');
  });

  it('returns empty string for empty state', () => {
    expect(serializeHash({})).toBe('');
  });

  it('omits e when eventSlug is falsy', () => {
    expect(serializeHash({ eventSlug: undefined })).not.toContain('e=');
    expect(serializeHash({ eventSlug: '' })).not.toContain('e=');
  });

  it('round-trips through parse → serialize', () => {
    const original = '#z=0.4500&cx=1200.0&cy=800.0&e=fall-of-rome';
    const parsed = parseHash(original);
    const reserialized = serializeHash(parsed);
    expect(parseHash(reserialized)).toEqual(parsed);
  });

  it('uses fixed 4 decimal places for zoom', () => {
    expect(serializeHash({ zoom: 0.1 })).toContain('z=0.1000');
    expect(serializeHash({ zoom: 1 })).toContain('z=1.0000');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// centerToRfViewport / rfViewportToCenter
// ─────────────────────────────────────────────────────────────────────────────

describe('viewport math', () => {
  it('round-trips center → rfViewport → center', () => {
    const centerX = 1200;
    const centerY = 800;
    const zoom = 0.45;

    const rfVp = centerToRfViewport(centerX, centerY, zoom);
    const recovered = rfViewportToCenter(rfVp);

    expect(recovered.centerX).toBeCloseTo(centerX);
    expect(recovered.centerY).toBeCloseTo(centerY);
  });

  it('preserves the zoom value', () => {
    const vp = centerToRfViewport(0, 0, 0.3);
    expect(vp.zoom).toBe(0.3);
  });

  it('computes correct RF viewport for center at origin', () => {
    const vp = centerToRfViewport(0, 0, 1);
    // At zoom=1, center (0,0) should place RF origin offset by half screen
    expect(vp.x).toBeGreaterThan(0); // screenW/2
    expect(vp.y).toBeGreaterThan(0); // screenH/2
    expect(vp.zoom).toBe(1);
  });
});
