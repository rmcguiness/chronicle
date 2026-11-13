import { describe, expect, it } from 'vitest';
import type { DemoSnapshot } from '../api/demo';
import type { HistoricalEvent } from '../types';
import { buildSpaceModel, idsHash, linkedEvents, parseSpaceLayout } from './spaceData';

function ev(id: string, year: number): HistoricalEvent {
  return { id, slug: id, title: id, year_approx: year, lat: 0, lng: 0, category: 'political', importance_score: 0.5 };
}

const snapshot: DemoSnapshot = {
  version: 1,
  license: { data: '', text: '', credit: '', details: '' },
  events: [ev('a', 1878), ev('b', 1908), ev('c', 1914)],
  links: [
    { id: 'a__b', cause_event_id: 'a', effect_event_id: 'b', connection_type: 'causes', strength: 0.5, confidence: 'established' } as never,
    { id: 'b__c', cause_event_id: 'b', effect_event_id: 'c', connection_type: 'causes', strength: 0.5 } as never,
    { id: 'c__gone', cause_event_id: 'c', effect_event_id: 'gone', connection_type: 'causes', strength: 0.5 } as never,
  ],
  details: {},
  chains: [
    { slug: 'road', title: 'Road', event_ids: ['a', 'b', 'c'], link_ids: [], score: 1, chain_type: 'scholarly' },
    { slug: 'auto', title: 'Auto', event_ids: ['a', 'b'], link_ids: [], score: 1, chain_type: 'generated' },
  ],
};

const layout = parseSpaceLayout({
  version: 1,
  time_scale: { ref_year: 2100, tau: 60, units: 1000 },
  count: 3,
  ids_hash: idsHash(['a', 'b', 'c']),
  positions: [-1500, 1, 2, -1430, 3, 4, -1411, 5, 6],
  radius: [2, 3, 4],
  degree: [1, 2, 1],
  confidence: [3, 3, 0],
});

describe('parseSpaceLayout', () => {
  it('rejects positions that do not match the count', () => {
    expect(() => parseSpaceLayout({ count: 1, positions: [1, 2] })).toThrow();
    expect(() => parseSpaceLayout(null)).toThrow();
  });

  it('fills missing optional arrays', () => {
    const d = parseSpaceLayout({ count: 1, positions: [1, 2, 3] });
    expect(d.radius).toEqual([2]);
    expect(d.time_scale.units).toBe(1000);
  });
});

describe('buildSpaceModel', () => {
  const model = buildSpaceModel(snapshot, layout);

  it('keeps arrays index-aligned with the snapshot events', () => {
    expect(model.realCount).toBe(3);
    expect(Array.from(model.positions.slice(6, 9))).toEqual([-1411, 5, 6]);
    expect(model.indexBySlug.get('c')).toBe(2);
  });

  it('refuses a layout built from a different event list', () => {
    const reordered = { ...snapshot, events: [snapshot.events[1], snapshot.events[0], snapshot.events[2]] };
    expect(() => buildSpaceModel(reordered, layout)).toThrow(/compute_space_layout/);
    expect(() => buildSpaceModel({ ...snapshot, events: snapshot.events.slice(0, 2) }, layout)).toThrow();
  });

  it('hashes ids the same way as the Python layout script', () => {
    expect(idsHash([])).toBe('811c9dc5');
    expect(idsHash(['a', 'b'])).toBe('28e4c710');
    expect(idsHash(['treaty-of-berlin-of-1878', 'é'])).toBe('92dc40aa');
  });

  it('keeps links between placed events and records their confidence', () => {
    expect(model.linkA.length).toBe(2);
    expect(Array.from(model.linkConfidence)).toEqual([3, 0]);
    expect(linkedEvents(model, 1).sort()).toEqual([0, 2]);
  });

  it('turns curated chains into tours and leaves generated chains out', () => {
    expect(model.tours.map((t) => t.slug)).toEqual(['road']);
    expect(model.tours[0].steps).toEqual([0, 1, 2]);
  });

  it('pads to the stress-test size with copies that keep their year', () => {
    const big = buildSpaceModel(snapshot, layout, { stressTotal: 10 });
    expect(big.count).toBe(10);
    expect(big.realCount).toBe(3);
    expect(big.positions[3 * 4]).toBe(big.positions[3 * 1]);
    expect(Math.hypot(big.positions[3 * 4 + 1], big.positions[3 * 4 + 2])).toBeGreaterThan(250);
  });
});
