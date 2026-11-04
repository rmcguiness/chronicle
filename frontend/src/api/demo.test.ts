import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CanvasViewport, HistoricalEvent } from '../types';
import {
  demoCategories,
  demoConnections,
  demoEventDetail,
  demoSearch,
  demoTiles,
  loadDemoSnapshot,
  parseSnapshot,
  resetDemoSnapshotCache,
  type DemoSnapshot,
} from './demo';
import { wikipediaSearchUrl } from '../config/demo';
import snapshotJson from '../../public/demo/snapshot.json';

function ev(slug: string, year: number, extra: Partial<HistoricalEvent> = {}): HistoricalEvent {
  return {
    id: slug,
    slug,
    title: slug.replace(/-/g, ' '),
    year_approx: year,
    lat: 0,
    lng: 0,
    category: 'political',
    importance_score: 0.5,
    ...extra,
  };
}

const fixture: DemoSnapshot = parseSnapshot({
  version: 1,
  license: { data: 'ODbL', text: 'CC BY-SA', credit: 'Chronicle', details: 'LICENSE-DATA.md' },
  events: [
    ev('french-revolution', 1789, { importance_score: 0.95, geo_modern: 'France' }),
    ev('napoleonic-wars', 1803, { category: 'war', importance_score: 0.9 }),
    ev('congress-of-vienna', 1815, { importance_score: 0.7, geo_modern: 'Austria' }),
    ev('printing-press', 1440, { category: 'discovery', importance_score: 0.9, lat: 50 }),
  ],
  links: [
    { id: 'a', cause_event_id: 'french-revolution', effect_event_id: 'napoleonic-wars', connection_type: 'causes', strength: 0.9 },
    { id: 'b', cause_event_id: 'napoleonic-wars', effect_event_id: 'congress-of-vienna', connection_type: 'causes', strength: 0.8, description: 'Post-war settlement' },
  ],
  details: {
    'french-revolution': {
      perspectives: [
        { id: 'p1', label: 'Academic', perspective_type: 'academic', viewpoint_type: 'academic', summary: 's', narrative: 'n', evidence_score: 0.8, sources: [] },
      ],
    },
  },
});

const ALL: CanvasViewport = { year_min: -5000, year_max: 2100, lat_min: -90, lat_max: 90, zoom: 1 };

describe('parseSnapshot', () => {
  it('rejects malformed input', () => {
    expect(() => parseSnapshot(null)).toThrow();
    expect(() => parseSnapshot({ events: [] })).toThrow(/links/);
  });
  it('defaults optional fields', () => {
    const s = parseSnapshot({ events: [], links: [] });
    expect(s.details).toEqual({});
    expect(s.version).toBe(1);
  });
});

describe('demoTiles', () => {
  it('filters by year window and keeps only links with both ends visible', () => {
    const t = demoTiles(fixture, { ...ALL, year_min: 1780, year_max: 1810 });
    expect(t.events.map((e) => e.slug)).toEqual(['french-revolution', 'napoleonic-wars']);
    expect(t.links.map((l) => l.id)).toEqual(['a']);
  });
  it('filters by latitude', () => {
    const t = demoTiles(fixture, { ...ALL, lat_min: 40, lat_max: 60 });
    expect(t.events.map((e) => e.slug)).toEqual(['printing-press']);
  });
  it('sorts by importance descending', () => {
    const scores = demoTiles(fixture, ALL).events.map((e) => e.importance_score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe('demoEventDetail', () => {
  it('derives causes and effects from links', () => {
    const d = demoEventDetail(fixture, 'napoleonic-wars');
    expect(d).not.toBeNull();
    expect(d!.connected_events).toEqual([
      expect.objectContaining({ slug: 'french-revolution', direction: 'cause', connection_type: 'causes' }),
      expect.objectContaining({ slug: 'congress-of-vienna', direction: 'effect', description: 'Post-war settlement' }),
    ]);
    expect(d!.perspectives).toEqual([]);
  });
  it('includes perspectives and is_bce', () => {
    const d = demoEventDetail(fixture, 'french-revolution')!;
    expect(d.perspectives).toHaveLength(1);
    expect(d.is_bce).toBe(false);
  });
  it('returns null for unknown slugs', () => {
    expect(demoEventDetail(fixture, 'nope')).toBeNull();
  });
});

describe('demoConnections', () => {
  it('returns links touching the event', () => {
    expect(demoConnections(fixture, 'napoleonic-wars').map((l) => l.id)).toEqual(['a', 'b']);
    expect(demoConnections(fixture, 'printing-press')).toEqual([]);
    expect(demoConnections(fixture, 'missing')).toEqual([]);
  });
});

describe('demoSearch', () => {
  it('is case-insensitive and matches place names', () => {
    expect(demoSearch(fixture, 'FRENCH').map((r) => r.slug)).toEqual(['french-revolution']);
    expect(demoSearch(fixture, 'austria').map((r) => r.slug)).toEqual(['congress-of-vienna']);
  });
  it('ranks title-prefix matches first and honours limit', () => {
    const r = demoSearch(fixture, 'n');
    expect(r[0].slug).toBe('napoleonic-wars');
    expect(demoSearch(fixture, 'n', 1)).toHaveLength(1);
  });
  it('returns nothing for blank queries', () => {
    expect(demoSearch(fixture, '   ')).toEqual([]);
  });
});

describe('demoCategories', () => {
  it('counts events per category, largest first', () => {
    const { categories } = demoCategories(fixture);
    expect(categories.map((c) => [c.category, c.count])).toEqual([
      ['political', 2],
      ['discovery', 1],
      ['war', 1],
    ]);
    expect(categories[0].featured[0].slug).toBe('french-revolution');
  });
});

describe('loadDemoSnapshot', () => {
  afterEach(() => resetDemoSnapshotCache());

  it('fetches once and caches', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ events: [], links: [] }) });
    await loadDemoSnapshot(fetchMock as unknown as typeof fetch);
    await loadDemoSnapshot(fetchMock as unknown as typeof fetch);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toMatch(/demo\/snapshot\.json$/);
  });

  it('allows a retry after a failed fetch', async () => {
    const bad = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    await expect(loadDemoSnapshot(bad as unknown as typeof fetch)).rejects.toThrow(/404/);
    const good = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ events: [], links: [] }) });
    await expect(loadDemoSnapshot(good as unknown as typeof fetch)).resolves.toBeTruthy();
  });
});

describe('wikipediaSearchUrl', () => {
  it('encodes the title', () => {
    expect(wikipediaSearchUrl('Battle of Hastings & co')).toBe(
      'https://en.wikipedia.org/w/index.php?search=Battle%20of%20Hastings%20%26%20co',
    );
  });
});

describe('committed snapshot (public/demo/snapshot.json)', () => {
  const snapshot = parseSnapshot(snapshotJson);

  it('carries the data license and attribution', () => {
    expect(snapshot.license.data).toMatch(/ODbL/);
    expect(snapshot.license.text).toMatch(/CC BY-SA/);
  });

  it('has no duplicate event titles', () => {
    const titles = snapshot.events.map((e) => e.title.trim().toLowerCase());
    const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(dupes).toEqual([]);
  });

  it('has unique ids and only links between included events', () => {
    const ids = new Set(snapshot.events.map((e) => e.id));
    expect(ids.size).toBe(snapshot.events.length);
    for (const l of snapshot.links) {
      expect(ids.has(l.cause_event_id)).toBe(true);
      expect(ids.has(l.effect_event_id)).toBe(true);
    }
  });

  it('uses only frontend categories and connection types', () => {
    const cats = new Set(['war', 'discovery', 'political', 'cultural', 'natural', 'person']);
    const types = new Set(['causes', 'leads_to', 'enables', 'context']);
    expect(snapshot.events.every((e) => cats.has(e.category))).toBe(true);
    expect(snapshot.links.every((l) => types.has(l.connection_type))).toBe(true);
  });
});
