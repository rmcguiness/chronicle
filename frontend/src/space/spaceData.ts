/**
 * Space view data model: the demo snapshot joined with the precomputed layout
 * (public/demo/space-layout.json, from scripts/compute_space_layout.py).
 *
 * Owns: parsing the layout file, building index-aligned typed arrays for the GPU,
 * link adjacency, and the guided tours.
 * Does NOT own: three.js objects (scene/SpaceEngine.ts) or React state.
 */
import type { CausalityLink, EventCategory, HistoricalEvent } from '../types';
import type { DemoChain, DemoSnapshot } from '../api/demo';
import { DEFAULT_TIME_SCALE, type TimeScaleParams } from './timeScale';

/** Shape of public/demo/space-layout.json. */
export interface SpaceLayoutDoc {
  version: number;
  time_scale: TimeScaleParams;
  count: number;
  /** FNV-1a hash of the snapshot event ids, in order (see idsHash). */
  ids_hash: string;
  /** Flat [x, y, z, x, y, z, …], in snapshot event order. */
  positions: number[];
  radius: number[];
  degree: number[];
  /** Best confidence of any link touching the event: 0 unrated, 1 speculative, 2 debated, 3 established. */
  confidence: number[];
}

export const CONFIDENCE_NAMES = ['unrated', 'speculative', 'debated', 'established'] as const;
const CONFIDENCE_RANK: Record<string, number> = { speculative: 1, debated: 2, established: 3 };

export const CATEGORY_ORDER: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

export interface SpaceTour {
  slug: string;
  title: string;
  description?: string;
  chainType?: string;
  /** Event indices into the model, in chain order. */
  steps: number[];
}

export interface SpaceModel {
  timeScale: TimeScaleParams;
  /** Total planets drawn, including synthetic stress-test copies. */
  count: number;
  /** Planets that are real snapshot events (indices below this are selectable). */
  realCount: number;
  events: HistoricalEvent[];
  positions: Float32Array;
  radius: Float32Array;
  confidence: Uint8Array;
  category: Uint8Array;
  degree: Uint16Array;
  /** Link endpoints as event indices, with the link's confidence rank. */
  linkA: Uint32Array;
  linkB: Uint32Array;
  linkConfidence: Uint8Array;
  /** For each event, indices into the link arrays. */
  linksOf: number[][];
  indexBySlug: Map<string, number>;
  tours: SpaceTour[];
}

/** Validate the layout file; throws on malformed data. */
export function parseSpaceLayout(raw: unknown): SpaceLayoutDoc {
  if (!raw || typeof raw !== 'object') throw new Error('Space layout: not an object');
  const d = raw as Partial<SpaceLayoutDoc>;
  if (typeof d.count !== 'number' || !Array.isArray(d.positions) || d.positions.length !== d.count * 3) {
    throw new Error('Space layout: count and positions do not line up');
  }
  const n = d.count;
  const fill = (arr: unknown, value: number) => (Array.isArray(arr) && arr.length === n ? (arr as number[]) : new Array<number>(n).fill(value));
  return {
    version: typeof d.version === 'number' ? d.version : 1,
    time_scale: d.time_scale ?? DEFAULT_TIME_SCALE,
    count: n,
    ids_hash: typeof d.ids_hash === 'string' ? d.ids_hash : '',
    positions: d.positions,
    radius: fill(d.radius, 2),
    degree: fill(d.degree, 0),
    confidence: fill(d.confidence, 0),
  };
}

/** FNV-1a (32-bit, hex) of the newline-joined ids; matches ids_hash() in scripts/compute_space_layout.py. */
export function idsHash(ids: string[]): string {
  let h = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(ids.join('\n'))) {
    h ^= byte;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** Deterministic pseudo-random value in [0, 1) for stress-test placement. */
function hash01(i: number, salt: number): number {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(salt + 7, 2246822519);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export interface BuildOptions {
  /**
   * Pad the planet count up to this many with synthetic copies of real events
   * (same year, placed in an outer shell, not selectable). For measuring frame rate only.
   */
  stressTotal?: number;
}

/**
 * Join the snapshot and layout into index-aligned arrays. The layout lists positions in
 * snapshot event order; a different event list (a stale layout) throws.
 */
export function buildSpaceModel(snapshot: DemoSnapshot, layout: SpaceLayoutDoc, opts: BuildOptions = {}): SpaceModel {
  const events = snapshot.events;
  if (layout.count !== events.length || (layout.ids_hash && layout.ids_hash !== idsHash(events.map((e) => e.id)))) {
    throw new Error('Space layout does not match the snapshot: run python3 scripts/compute_space_layout.py');
  }
  const realCount = events.length;
  const count = Math.max(realCount, Math.floor(opts.stressTotal ?? 0));

  const positions = new Float32Array(count * 3);
  const radius = new Float32Array(count);
  const confidence = new Uint8Array(count);
  const category = new Uint8Array(count);
  const degree = new Uint16Array(count);
  const indexBySlug = new Map<string, number>();

  positions.set(layout.positions);
  events.forEach((e, i) => {
    radius[i] = layout.radius[i];
    confidence[i] = layout.confidence[i];
    degree[i] = layout.degree[i];
    category[i] = Math.max(0, CATEGORY_ORDER.indexOf(e.category));
    indexBySlug.set(e.slug, i);
    indexBySlug.set(e.id, i);
  });

  for (let i = realCount; i < count && realCount > 0; i++) {
    const src = i % realCount;
    const angle = 2 * Math.PI * hash01(i, 1);
    const r = 280 + 260 * hash01(i, 2);
    positions[3 * i] = positions[3 * src];
    positions[3 * i + 1] = r * Math.cos(angle);
    positions[3 * i + 2] = r * Math.sin(angle);
    radius[i] = radius[src];
    category[i] = category[src];
  }

  const linkA: number[] = [];
  const linkB: number[] = [];
  const linkConf: number[] = [];
  const linksOf: number[][] = Array.from({ length: realCount }, () => []);
  const linkIndexById = new Map<string, number>();
  snapshot.links.forEach((l: CausalityLink) => {
    const a = indexBySlug.get(l.cause_event_id);
    const b = indexBySlug.get(l.effect_event_id);
    if (a === undefined || b === undefined || a === b) return;
    const k = linkA.length;
    linkA.push(a);
    linkB.push(b);
    linkConf.push(CONFIDENCE_RANK[l.confidence ?? ''] ?? 0);
    linksOf[a].push(k);
    linksOf[b].push(k);
    linkIndexById.set(l.id, k);
  });

  return {
    timeScale: layout.time_scale,
    count,
    realCount,
    events,
    positions,
    radius,
    confidence,
    category,
    degree,
    linkA: Uint32Array.from(linkA),
    linkB: Uint32Array.from(linkB),
    linkConfidence: Uint8Array.from(linkConf),
    linksOf,
    indexBySlug,
    tours: buildTours(snapshot.chains ?? [], indexBySlug),
  };
}

/** Curated chains (scholarly and popular-internet) become guided tours; generated chains are left out. */
export function buildTours(chains: DemoChain[], indexBySlug: Map<string, number>): SpaceTour[] {
  return chains
    .filter((c) => c.chain_type === 'scholarly' || c.chain_type === 'popular_internet')
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      description: c.description,
      chainType: c.chain_type,
      steps: c.event_ids.map((id) => indexBySlug.get(id)).filter((i): i is number => i !== undefined),
    }))
    .filter((t) => t.steps.length >= 2);
}

/** Events linked to `index` (either direction), nearest in time first. */
export function linkedEvents(model: SpaceModel, index: number): number[] {
  const out = new Set<number>();
  for (const k of model.linksOf[index] ?? []) out.add(model.linkA[k] === index ? model.linkB[k] : model.linkA[k]);
  const x = model.positions[3 * index];
  return [...out].sort((a, b) => Math.abs(model.positions[3 * a] - x) - Math.abs(model.positions[3 * b] - x));
}
