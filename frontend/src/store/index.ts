/**
 * store/index.ts — Central Zustand store for Chronicle.
 *
 * Owns: all global client-side state including viewport, selected event,
 *   search, bookmarks, category filters, collapsed region bands, and
 *   pending viewport requests from the permalink system.
 *
 * Does NOT: fetch data (see api/client.ts), compute layout (see utils/).
 */
import { create } from 'zustand';
import type { HistoricalEvent, CanvasTransform, CanvasViewport, EventCategory, Region } from '../types';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Bookmark types & localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

const BOOKMARKS_STORAGE_KEY = 'chronicle_bookmarks';

/** localStorage key for persisting collapsed region bands. */
const COLLAPSED_REGIONS_STORAGE_KEY = 'chronicle:collapsedBands';

/** A saved viewport bookmark */
export interface Bookmark {
  id: string;
  name: string;
  x: number;
  y: number;
  zoom: number;
  /** Default bookmarks cannot be deleted */
  isDefault?: boolean;
}

/** Pre-seeded default bookmarks */
const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: 'default-ancient', name: 'Ancient Civilizations', x: -(-3000 - (-5000)) * CANVAS_CONSTANTS.PIXELS_PER_YEAR * 0.3 + 960, y: 80, zoom: 0.3, isDefault: true },
  { id: 'default-industrial', name: 'Industrial Revolution', x: -(1800 - (-5000)) * CANVAS_CONSTANTS.PIXELS_PER_YEAR * 0.3 + 960, y: 80, zoom: 0.3, isDefault: true },
  { id: 'default-wars', name: 'World Wars', x: -(1939 - (-5000)) * CANVAS_CONSTANTS.PIXELS_PER_YEAR * 0.3 + 960, y: 80, zoom: 0.3, isDefault: true },
];

/** Load bookmarks from localStorage, falling back to defaults */
function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Bookmark[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [...DEFAULT_BOOKMARKS];
}

/** Persist bookmarks to localStorage */
function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
}

/** Load persisted collapsed regions from localStorage. */
function loadCollapsedRegions(): Set<Region> {
  try {
    const raw = localStorage.getItem(COLLAPSED_REGIONS_STORAGE_KEY);
    if (!raw) return new Set<Region>();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<Region>();
    return new Set(parsed as Region[]);
  } catch {
    return new Set<Region>();
  }
}

/** Persist collapsed regions to localStorage. */
function saveCollapsedRegions(regions: Set<Region>): void {
  try {
    localStorage.setItem(COLLAPSED_REGIONS_STORAGE_KEY, JSON.stringify([...regions]));
  } catch {
    // Silently ignore quota errors or private-browsing restrictions
  }
}

/** All event categories for default active set */
const ALL_CATEGORIES: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

/** Supported view modes for the main canvas area. */
export type ViewMode = 'timeline' | 'network';

// ─────────────────────────────────────────────────────────────────────────────
// Canvas coordinate math
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN, LAT_MIN, LAT_MAX, CANVAS_HEIGHT } =
  CANVAS_CONSTANTS;

/**
 * Convert a historical year to an X pixel coordinate on the canvas.
 * At zoom=1, BASE_YEAR_MIN is at x=0.
 *
 * @param year - The historical year (negative = BCE).
 * @param transform - Optional canvas transform (zoom + offset).
 * @returns The screen X coordinate in pixels.
 */
export function yearToX(year: number, transform?: CanvasTransform): number {
  const zoom = transform?.zoom ?? 1;
  const offsetX = transform?.x ?? 0;
  return (year - BASE_YEAR_MIN) * PIXELS_PER_YEAR * zoom + offsetX;
}

/**
 * Convert a screen X coordinate back to a historical year.
 *
 * @param x - Screen X coordinate in pixels.
 * @param transform - Current canvas transform.
 * @returns The corresponding historical year.
 */
export function xToYear(x: number, transform: CanvasTransform): number {
  const { zoom, x: offsetX } = transform;
  return (x - offsetX) / (PIXELS_PER_YEAR * zoom) + BASE_YEAR_MIN;
}

/**
 * Convert geographic latitude to a Y pixel coordinate.
 * Simple linear mapping: LAT_MAX → top (y=0), LAT_MIN → bottom.
 *
 * @param lat - Geographic latitude in degrees.
 * @returns The screen Y coordinate in pixels.
 */
export function latToY(lat: number): number {
  const fraction = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);
  return fraction * CANVAS_HEIGHT;
}

/**
 * Convert a screen Y coordinate back to geographic latitude.
 *
 * @param y - Screen Y coordinate in pixels.
 * @returns The corresponding latitude in degrees.
 */
export function yToLat(y: number): number {
  const fraction = y / CANVAS_HEIGHT;
  return LAT_MAX - fraction * (LAT_MAX - LAT_MIN);
}

// ─────────────────────────────────────────────────────────────────────────────
// ReactFlow viewport type
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A pending ReactFlow viewport to be applied by NetworkView.
 * Set by the permalink system when restoring a shared URL.
 */
export interface PendingRfViewport {
  x: number;
  y: number;
  zoom: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// App state
// ─────────────────────────────────────────────────────────────────────────────

interface AppState {
  // Selected event (for detail panel)
  selectedEventSlug: string | null;
  setSelectedEvent: (slug: string | null) => void;

  // Detail panel open state
  detailPanelOpen: boolean;
  setDetailPanelOpen: (v: boolean) => void;

  // Viewport / transform
  viewport: CanvasViewport;
  setViewport: (viewport: Partial<CanvasViewport>) => void;

  // Zoom state (react-flow zoom is separate from our geo zoom LOD)
  rfZoom: number;
  setRfZoom: (z: number) => void;

  // Events currently in view (populated by tile loader)
  visibleEvents: HistoricalEvent[];
  setVisibleEvents: (events: HistoricalEvent[]) => void;

  // Loading / error
  isLoading: boolean;
  setLoading: (v: boolean) => void;
  error: string | null;
  setError: (e: string | null) => void;

  // Search panel
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;

  // Target event for flyover (set by search)
  flyToEvent: HistoricalEvent | null;
  setFlyToEvent: (event: HistoricalEvent | null) => void;

  // Mock backend notice
  usingMockData: boolean;
  setUsingMockData: (v: boolean) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (bm: Omit<Bookmark, 'id' | 'isDefault'>) => void;
  removeBookmark: (id: string) => void;

  // Category filter
  activeCategories: Set<EventCategory>;
  toggleCategory: (cat: EventCategory) => void;

  // Region swim-lane collapsed state (source of truth)
  collapsedRegions: Set<Region>;
  setCollapsedRegions: (regions: Set<Region>) => void;
  toggleCollapsedRegion: (region: Region) => void;

  // Pending ReactFlow viewport — set by permalink restore; consumed by NetworkView
  pendingRfViewport: PendingRfViewport | null;
  setPendingRfViewport: (vp: PendingRfViewport | null) => void;

  // View mode (timeline vs network)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  /** Whether the "On This Day" slide-in panel is visible. */
  onThisDayOpen: boolean;
  /** Toggle or set the "On This Day" panel open state. */
  setOnThisDayOpen: (v: boolean) => void;

  // Selected person (for person detail panel)
  selectedPersonSlug: string | null;
  setSelectedPerson: (slug: string | null) => void;

  /** The currently visible year range on the network canvas. Single source of truth for X mapping, node sizing, and the minimap. */
  timeViewport: { yearMin: number; yearMax: number };
  setTimeViewport: (v: { yearMin: number; yearMax: number }) => void;

  /** Current ReactFlow camera — updated on every move/zoom so other components can read it. */
  rfViewport: { x: number; y: number; zoom: number };
  setRfViewport: (vp: { x: number; y: number; zoom: number }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedEventSlug: null,
  setSelectedEvent: (slug) =>
    set({
      selectedEventSlug: slug,
      detailPanelOpen: slug !== null,
      ...(slug ? { selectedPersonSlug: null } : {}),
    }),

  detailPanelOpen: false,
  setDetailPanelOpen: (detailPanelOpen) =>
    set(() => ({
      detailPanelOpen,
      ...(!detailPanelOpen ? { selectedEventSlug: null } : {}),
    })),

  viewport: {
    year_min: -800,
    year_max: 1500,
    lat_min: -10,
    lat_max: 70,
    zoom: 5,
  },
  setViewport: (v) => set((s) => ({ viewport: { ...s.viewport, ...v } })),

  rfZoom: 1,
  setRfZoom: (rfZoom) => set({ rfZoom }),

  visibleEvents: [],
  setVisibleEvents: (visibleEvents) => set({ visibleEvents }),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),

  flyToEvent: null,
  setFlyToEvent: (flyToEvent) => set({ flyToEvent }),

  usingMockData: false,
  setUsingMockData: (usingMockData) => set({ usingMockData }),

  // Bookmarks
  bookmarks: loadBookmarks(),
  addBookmark: (bm) =>
    set((s) => {
      const newBookmark: Bookmark = { ...bm, id: `bm-${Date.now()}` };
      const updated = [...s.bookmarks, newBookmark];
      saveBookmarks(updated);
      return { bookmarks: updated };
    }),
  removeBookmark: (id) =>
    set((s) => {
      const updated = s.bookmarks.filter((b) => b.id !== id);
      saveBookmarks(updated);
      return { bookmarks: updated };
    }),

  // Category filter
  activeCategories: new Set<EventCategory>(ALL_CATEGORIES),
  toggleCategory: (cat) =>
    set((s) => {
      const next = new Set(s.activeCategories);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return { activeCategories: next };
    }),

  // Collapsed region bands — initialised from localStorage, kept in sync
  collapsedRegions: loadCollapsedRegions(),
  setCollapsedRegions: (regions) => {
    saveCollapsedRegions(regions);
    set({ collapsedRegions: regions });
  },
  toggleCollapsedRegion: (region) =>
    set((s) => {
      const next = new Set(s.collapsedRegions);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      saveCollapsedRegions(next);
      return { collapsedRegions: next };
    }),

  // Pending ReactFlow viewport from permalink restore
  pendingRfViewport: null,
  setPendingRfViewport: (pendingRfViewport) => set({ pendingRfViewport }),

  // View mode (network is the only active view; timeline is archived)
  viewMode: 'network' as ViewMode,
  setViewMode: (viewMode) => set({ viewMode }),

  // On This Day panel
  onThisDayOpen: false,
  setOnThisDayOpen: (onThisDayOpen) => set({ onThisDayOpen }),

  // Selected person (for person detail panel)
  selectedPersonSlug: null,
  setSelectedPerson: (slug) =>
    set({
      selectedPersonSlug: slug,
      // Close event panel when opening person panel
      ...(slug ? { detailPanelOpen: false, selectedEventSlug: null } : {}),
    }),

  // Time viewport — visible year range on the network canvas
  timeViewport: { yearMin: -800, yearMax: 1500 },
  setTimeViewport: (timeViewport) => set({ timeViewport }),

  // ReactFlow camera — synced on every move/zoom for scrubber + other readers
  rfViewport: { x: 0, y: 0, zoom: 0.08 },
  setRfViewport: (rfViewport) => set({ rfViewport }),
}));
