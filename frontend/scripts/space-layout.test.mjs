// Checks that the committed space layout (scripts/compute_space_layout.py) and the
// frontend time scale (src/space/timeScale.ts) agree, and that every snapshot event has a position.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { DEFAULT_TIME_SCALE, yearToX } from '../src/space/timeScale.ts';
import { idsHash } from '../src/space/spaceData.ts';

const read = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const layout = read('../public/demo/space-layout.json');
const snapshot = read('../public/demo/snapshot.json');

describe('public/demo/space-layout.json', () => {
  it('uses the same time scale as the frontend', () => {
    expect(layout.time_scale).toEqual(DEFAULT_TIME_SCALE);
  });

  it('has one position per snapshot event, in snapshot order', () => {
    expect(layout.count).toBe(snapshot.events.length);
    expect(layout.ids_hash).toBe(idsHash(snapshot.events.map((e) => e.id)));
    expect(layout.positions).toHaveLength(3 * snapshot.events.length);
  });

  it('puts every event at the X its year maps to', () => {
    snapshot.events.forEach((e, i) => {
      expect(Math.abs(layout.positions[3 * i] - yearToX(e.year_approx, layout.time_scale))).toBeLessThan(0.01);
    });
  });
});
