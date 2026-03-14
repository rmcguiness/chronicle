import axios from 'axios';
import type {
  HistoricalEvent,
  EventDetail,
  TileResponse,
  SearchResult,
  CausalityLink,
  CanvasViewport,
  Perspective,
  ConnectedEvent,
} from '../types';
import { importanceThreshold } from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — reads VITE_API_URL from environment (with localhost fallback)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// ─────────────────────────────────────────────────────────────────────────────
// Mock data  (used when backend is unavailable)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: HistoricalEvent[] = [
  {
    id: '1',
    slug: 'assassination-franz-ferdinand-1914',
    title: 'Assassination of Franz Ferdinand',
    year_approx: 1914,
    lat: 43.85,
    lng: 18.41,
    geo_modern: 'Sarajevo, Bosnia',
    geo_era_label: 'Austria-Hungary',
    category: 'political',
    importance_score: 0.95,
    tags: ['assassination', 'austria-hungary', 'balkans'],
    perspective_count: 4,
  },
  {
    id: '2',
    slug: 'world-war-i-begins-1914',
    title: 'World War I Begins',
    year_approx: 1914,
    lat: 48.85,
    lng: 2.35,
    geo_modern: 'Paris, France',
    geo_era_label: 'Western Front',
    category: 'war',
    importance_score: 0.98,
    tags: ['wwi', 'world-war', 'europe'],
    perspective_count: 5,
  },
  {
    id: '3',
    slug: 'treaty-of-versailles-1919',
    title: 'Treaty of Versailles',
    year_approx: 1919,
    lat: 48.8,
    lng: 2.12,
    geo_modern: 'Versailles, France',
    geo_era_label: 'Post-WWI Europe',
    category: 'political',
    importance_score: 0.95,
    tags: ['treaty', 'wwi', 'peace-conference'],
    perspective_count: 6,
  },
  {
    id: '4',
    slug: 'world-war-ii-begins-1939',
    title: 'World War II Begins',
    year_approx: 1939,
    lat: 52.52,
    lng: 13.4,
    geo_modern: 'Berlin, Germany',
    geo_era_label: 'Nazi Germany',
    category: 'war',
    importance_score: 0.99,
    tags: ['wwii', 'world-war', 'nazi-germany'],
    perspective_count: 7,
  },
  {
    id: '5',
    slug: 'industrial-revolution-peak-1850',
    title: 'Industrial Revolution at Peak',
    year_approx: 1850,
    lat: 51.5,
    lng: -0.12,
    geo_modern: 'London, England',
    geo_era_label: 'British Empire',
    category: 'discovery',
    importance_score: 0.92,
    tags: ['industrial', 'economy', 'britain'],
    perspective_count: 3,
  },
  {
    id: '6',
    slug: 'meiji-restoration-1868',
    title: 'Meiji Restoration',
    year_approx: 1868,
    lat: 35.68,
    lng: 139.69,
    geo_modern: 'Tokyo, Japan',
    geo_era_label: 'Japanese Empire',
    category: 'political',
    importance_score: 0.88,
    tags: ['japan', 'modernization', 'asia'],
    perspective_count: 3,
  },
  {
    id: '7',
    slug: 'russian-revolution-1917',
    title: 'Russian Revolution',
    year_approx: 1917,
    lat: 59.93,
    lng: 30.32,
    geo_modern: 'Petrograd (Saint Petersburg), Russia',
    geo_era_label: 'Russian Empire',
    category: 'political',
    importance_score: 0.97,
    tags: ['russia', 'communism', 'revolution'],
    perspective_count: 5,
  },
  {
    id: '8',
    slug: 'wright-brothers-first-flight-1903',
    title: 'Wright Brothers First Flight',
    year_approx: 1903,
    lat: 36.0,
    lng: -75.67,
    geo_modern: 'Kitty Hawk, North Carolina, USA',
    geo_era_label: 'United States',
    category: 'discovery',
    importance_score: 0.91,
    tags: ['aviation', 'technology', 'usa'],
    perspective_count: 2,
  },
  {
    id: '9',
    slug: 'great-depression-1929',
    title: 'Wall Street Crash / Great Depression',
    year_approx: 1929,
    lat: 40.71,
    lng: -74.01,
    geo_modern: 'New York City, USA',
    geo_era_label: 'United States',
    category: 'cultural',
    importance_score: 0.93,
    tags: ['economic-crisis', 'usa', 'global-economy'],
    perspective_count: 4,
  },
  {
    id: '10',
    slug: 'hiroshima-bombing-1945',
    title: 'Atomic Bombing of Hiroshima',
    year_approx: 1945,
    lat: 34.39,
    lng: 132.45,
    geo_modern: 'Hiroshima, Japan',
    geo_era_label: 'Japanese Empire (final days)',
    category: 'war',
    importance_score: 0.98,
    tags: ['atomic-bomb', 'wwii', 'nuclear', 'japan'],
    perspective_count: 6,
  },
];

// Mock causality links
const MOCK_LINKS: CausalityLink[] = [
  {
    id: 'l1',
    cause_event_id: '1',
    effect_event_id: '2',
    connection_type: 'causes',
    strength: 0.95,
    description: 'The assassination triggered the mobilisation of European alliances.',
  },
  {
    id: 'l2',
    cause_event_id: '2',
    effect_event_id: '3',
    connection_type: 'leads_to',
    strength: 0.99,
    description: 'WWI ended with the Paris Peace Conference and Treaty of Versailles.',
  },
  {
    id: 'l3',
    cause_event_id: '3',
    effect_event_id: '4',
    connection_type: 'causes',
    strength: 0.85,
    description: 'Harsh reparations and territorial changes fuelled German resentment.',
  },
  {
    id: 'l4',
    cause_event_id: '9',
    effect_event_id: '4',
    connection_type: 'enables',
    strength: 0.7,
    description: 'Economic instability enabled the rise of fascism across Europe.',
  },
  {
    id: 'l5',
    cause_event_id: '4',
    effect_event_id: '10',
    connection_type: 'leads_to',
    strength: 0.9,
    description: 'Pacific theatre of WWII culminated in the atomic bombings of Japan.',
  },
];

const MOCK_DETAIL_MAP: Record<string, Partial<EventDetail>> = {
  '1': {
    perspectives: [
      {
        id: 'p1a',
        label: 'Austro-Hungarian Imperial Account',
        perspective_type: 'government',
        summary: 'A direct act of Serbian-backed terrorism requiring decisive military response.',
        narrative:
          "The assassination of Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, by Gavrilo Princip was understood in Vienna as a state-sponsored act of terrorism by Serbia.",
        evidence_score: 0.88,
        sources: [
          {
            id: 's1',
            title: 'Austria-Hungary and the Origins of WWI',
            author: 'Samuel Williamson',
            publication: 'Journal of Modern History',
            publication_date: '1991-01-01',
            source_type: 'secondary',
            peer_reviewed: true,
            quote: 'Vienna saw the assassination as requiring a firm response.',
          },
        ],
      },
      {
        id: 'p1b',
        label: 'Serbian Nationalist Perspective',
        perspective_type: 'nationalist',
        summary: 'The assassination as an act of liberation from Austro-Hungarian oppression.',
        narrative:
          'For many Serbs and South Slav nationalists, Gavrilo Princip was a hero acting against imperial occupation.',
        evidence_score: 0.72,
        sources: [
          {
            id: 's2',
            title: 'The Black Hand: Terror and Assassination in Serbia',
            author: 'David MacKenzie',
            publication: 'Columbia University Press',
            publication_date: '1989-01-01',
            source_type: 'secondary',
            peer_reviewed: true,
          },
        ],
      },
    ],
    connected_events: [
      {
        id: '2',
        slug: 'world-war-i-begins-1914',
        title: 'World War I Begins',
        year_approx: 1914,
        connection_type: 'causes',
        direction: 'effect',
        strength: 0.95,
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Backend availability check
// ─────────────────────────────────────────────────────────────────────────────

let _backendAvailable: boolean | null = null;
let _checkPromise: Promise<boolean> | null = null;

async function isBackendAvailable(): Promise<boolean> {
  if (_backendAvailable !== null) return _backendAvailable;
  if (_checkPromise) return _checkPromise;

  _checkPromise = api
    .get('/api/health', { timeout: 2000 })
    .then(() => {
      _backendAvailable = true;
      return true;
    })
    .catch(() => {
      _backendAvailable = false;
      return false;
    });

  return _checkPromise;
}

// Reset cache every 30 s so the app can recover when the backend starts
setInterval(() => {
  _backendAvailable = null;
  _checkPromise = null;
}, 30_000);

// ─────────────────────────────────────────────────────────────────────────────
// API helpers — normalise backend UUID fields to strings
// ─────────────────────────────────────────────────────────────────────────────

// Backend returns `category` (mapped from event_category) — no transform needed.
// Backend id fields are UUIDs serialised as strings by Pydantic.

// ─────────────────────────────────────────────────────────────────────────────
// API functions
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchTiles(viewport: CanvasViewport): Promise<TileResponse> {
  const available = await isBackendAvailable();

  if (available) {
    try {
      // bbox = "west,south,east,north" — use full longitude range since we only
      // filter by lat in the viewport. The backend will also apply year_min/max.
      const bbox = `-180,${viewport.lat_min},180,${viewport.lat_max}`;
      // Map react-flow fractional zoom (0.05–4+) → backend tile zoom (int 2–10)
      // zoom_min in DB starts at 2, so floor at 2 to always return events
      const tileZoom = Math.max(2, Math.min(10, Math.floor(viewport.zoom * 8) + 2));
      const minImportance = importanceThreshold(viewport.zoom);
      const { data } = await api.get('/api/canvas/tiles', {
        params: {
          zoom: tileZoom,
          year_min: viewport.year_min,
          year_max: viewport.year_max,
          bbox,
          min_importance: minImportance,
        },
      });
      // Backend response: { events, links, computed_at } — matches TileResponse
      return {
        events: (data.events ?? []) as HistoricalEvent[],
        links: (data.links ?? []) as CausalityLink[],
        computed_at: data.computed_at ?? new Date().toISOString(),
      };
    } catch {
      // fall through to mock
    }
  }

  // ── Mock fallback ──────────────────────────────────────────────────────────
  const importance_threshold =
    viewport.zoom <= 2 ? 0.9 :
    viewport.zoom <= 4 ? 0.7 :
    viewport.zoom <= 6 ? 0.5 :
    viewport.zoom <= 8 ? 0.3 : 0;

  const events = MOCK_EVENTS.filter(
    (e) =>
      e.year_approx >= viewport.year_min &&
      e.year_approx <= viewport.year_max &&
      e.lat >= viewport.lat_min &&
      e.lat <= viewport.lat_max &&
      e.importance_score >= importance_threshold
  );

  const eventIds = new Set(events.map((e) => e.id));
  const links = MOCK_LINKS.filter(
    (l) => eventIds.has(l.cause_event_id) && eventIds.has(l.effect_event_id)
  );

  return { events, links, computed_at: new Date().toISOString() };
}

export async function fetchEventDetail(slug: string): Promise<EventDetail> {
  const available = await isBackendAvailable();

  if (available) {
    try {
      const { data } = await api.get(`/api/events/${slug}`);
      // Backend returns `category` directly (mapped from event_category)
      // and `connected_events` list — matches EventDetail shape.
      return data as EventDetail;
    } catch {
      // fall through to mock
    }
  }

  const base = MOCK_EVENTS.find((e) => e.slug === slug || e.id === slug);
  if (!base) throw new Error(`Event not found: ${slug}`);

  const extra = MOCK_DETAIL_MAP[base.id] ?? {};
  return {
    ...base,
    perspectives: extra.perspectives ?? [
      {
        id: `${base.id}-p1`,
        label: 'Primary Account',
        perspective_type: 'academic',
        summary: 'The mainstream historical consensus view of this event.',
        narrative: `${base.title} (${base.year_approx}) is considered one of the most significant events of the modern era.`,
        evidence_score: 0.75,
        sources: [],
      },
    ],
    connected_events: extra.connected_events ?? [],
  };
}

export async function fetchEventConnections(slug: string): Promise<CausalityLink[]> {
  const available = await isBackendAvailable();

  if (available) {
    try {
      const { data } = await api.get(`/api/events/${slug}/connections`);
      // Backend returns { connections: [...] } — extract the array
      const raw = data.connections ?? data;
      return Array.isArray(raw) ? (raw as CausalityLink[]) : [];
    } catch {
      // fall through
    }
  }

  const event = MOCK_EVENTS.find((e) => e.slug === slug || e.id === slug);
  if (!event) return [];
  return MOCK_LINKS.filter(
    (l) => l.cause_event_id === event.id || l.effect_event_id === event.id
  );
}

/**
 * Semantic search — calls /api/search/semantic for meaning-based event search.
 * Falls back to keyword search on error.
 *
 * @param q - Natural language query
 * @param limit - Max results to return
 * @returns Array of search results ordered by semantic similarity
 */
export async function searchEventsSemantic(q: string, limit = 20): Promise<SearchResult[]> {
  if (!q.trim()) return [];

  const available = await isBackendAvailable();
  if (!available) return searchEvents(q, limit);

  try {
    const { data } = await api.get('/api/search/semantic', { params: { q, limit }, timeout: 15000 });
    const hits = data.results ?? data.hits ?? (Array.isArray(data) ? data : []);
    return hits as SearchResult[];
  } catch {
    // Fall back to keyword search
    return searchEvents(q, limit);
  }
}

export async function searchEvents(q: string, limit = 10): Promise<SearchResult[]> {
  if (!q.trim()) return [];

  const available = await isBackendAvailable();

  if (available) {
    try {
      const { data } = await api.get('/api/search', { params: { q, limit } });
      // Backend returns { results: [...] }
      const hits = data.results ?? data.hits ?? (Array.isArray(data) ? data : []);
      return hits as SearchResult[];
    } catch {
      // fall through
    }
  }

  const lower = q.toLowerCase();
  return MOCK_EVENTS.filter(
    (e) =>
      e.title.toLowerCase().includes(lower) ||
      e.tags?.some((t) => t.includes(lower)) ||
      e.geo_modern?.toLowerCase().includes(lower)
  )
    .slice(0, limit)
    .map((e) => ({ ...e }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Article types & fetcher
// ─────────────────────────────────────────────────────────────────────────────

/** A single section from a Wikipedia article. */
export interface ArticleSection {
  heading: string;
  content: string;
}

/** Response shape from GET /api/events/{slug}/article. */
export interface ArticleResponse {
  title: string;
  summary: string | null;
  sections: ArticleSection[];
  source_url: string | null;
  source: string;
}

/**
 * Fetch the Wikipedia article summary for an event.
 * Returns null if the backend is unavailable.
 */
export async function fetchArticle(slug: string): Promise<ArticleResponse | null> {
  const available = await isBackendAvailable();
  if (!available) return null;

  try {
    const { data } = await api.get<ArticleResponse>(`/api/events/${slug}/article`);
    return data;
  } catch {
    return null;
  }
}

export type { Perspective, ConnectedEvent };

// ─────────────────────────────────────────────────────────────────────────────
// On This Day
// ─────────────────────────────────────────────────────────────────────────────

/** A single event returned by the On This Day endpoint. */
export interface OnThisDayEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  date_display: string | null;
  category: string | null;
  importance_score: number;
  region: string | null;
  short_description: string | null;
}

/** Response shape from GET /api/events/on-this-day. */
export interface OnThisDayResponse {
  month: number;
  day: number;
  events: OnThisDayEvent[];
}

/**
 * Fetch events that happened on a given month/day across all years.
 * Defaults to today's date when no params are provided.
 */
export async function fetchOnThisDay(month?: number, day?: number): Promise<OnThisDayResponse> {
  const params = new URLSearchParams();
  if (month !== undefined) params.set('month', String(month));
  if (day !== undefined) params.set('day', String(day));
  const { data } = await api.get<OnThisDayResponse>('/api/events/on-this-day', { params });
  return data;
}

/**
 * Fetch all causality links from the backend (or mock fallback).
 * Used by the Network view to render all edges in the force-directed graph.
 */
export async function fetchAllCausalityLinks(): Promise<CausalityLink[]> {
  const available = await isBackendAvailable();

  if (available) {
    try {
      const { data } = await api.get('/api/causality');
      return (data.links ?? data) as CausalityLink[];
    } catch {
      // fall through to mock
    }
  }

  return MOCK_LINKS;
}

/**
 * Fetch Wikipedia data for an event, returning a WikiData | WikiDataNotFound
 * discriminated union compatible with EventDetailPage.
 */
export async function fetchWikiData(
  slug: string,
): Promise<{ found: true; title: string; summary: string; thumbnail?: string; url: string } | { found: false }> {
  const result = await fetchArticle(slug);
  if (!result || !result.summary) return { found: false };
  return {
    found: true,
    title: result.title,
    summary: result.summary,
    url: result.source_url ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats — knowledge graph analytics
// ─────────────────────────────────────────────────────────────────────────────

import type { FullStats } from '../types/stats';

/**
 * Fetch full Chronicle knowledge graph statistics.
 * Returns null if the backend is unavailable.
 */
export async function fetchFullStats(): Promise<FullStats | null> {
  const available = await isBackendAvailable();
  if (!available) return null;

  try {
    const { data } = await api.get<FullStats>('/api/stats/full', { timeout: 15000 });
    return data;
  } catch {
    return null;
  }
}
