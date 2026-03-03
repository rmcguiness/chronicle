import { create } from 'zustand';
import type { HistoricalEvent, CanvasTransform, CanvasViewport } from '../types';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Canvas coordinate math
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN, LAT_MIN, LAT_MAX, CANVAS_HEIGHT } =
  CANVAS_CONSTANTS;

/**
 * Convert a historical year to an X pixel coordinate on the canvas.
 * At zoom=1, BASE_YEAR_MIN is at x=0.
 */
export function yearToX(year: number, transform?: CanvasTransform): number {
  const zoom = transform?.zoom ?? 1;
  const offsetX = transform?.x ?? 0;
  return (year - BASE_YEAR_MIN) * PIXELS_PER_YEAR * zoom + offsetX;
}

export function xToYear(x: number, transform: CanvasTransform): number {
  const { zoom, x: offsetX } = transform;
  return (x - offsetX) / (PIXELS_PER_YEAR * zoom) + BASE_YEAR_MIN;
}

/**
 * Convert geographic latitude to a Y pixel coordinate.
 * Simple linear mapping: LAT_MAX → top (y=0), LAT_MIN → bottom.
 */
export function latToY(lat: number, _transform?: CanvasTransform): number {
  const fraction = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN);
  return fraction * CANVAS_HEIGHT;
}

export function yToLat(y: number): number {
  const fraction = y / CANVAS_HEIGHT;
  return LAT_MAX - fraction * (LAT_MAX - LAT_MIN);
}

// ─────────────────────────────────────────────────────────────────────────────
// App state
// ─────────────────────────────────────────────────────────────────────────────

interface AppState {
  // Selected event (for detail panel)
  selectedEventSlug: string | null;
  setSelectedEvent: (slug: string | null) => void;

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
}

export const useAppStore = create<AppState>((set) => ({
  selectedEventSlug: null,
  setSelectedEvent: (slug) => set({ selectedEventSlug: slug }),

  viewport: {
    year_min: 1850,
    year_max: 1960,
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
}));
