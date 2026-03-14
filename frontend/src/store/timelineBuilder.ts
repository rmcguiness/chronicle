/**
 * Zustand store for the custom timeline builder.
 *
 * Manages: event list, timeline metadata, localStorage persistence.
 * All user-created timelines are stored in localStorage under "chronicle_timelines".
 */
import { create } from 'zustand';
import type { SearchResult, EventCategory } from '../types';

/** A single event in a custom timeline. */
export interface TimelineEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  category: EventCategory;
  geo_modern?: string;
  importance_score: number;
}

/** A saved custom timeline. */
export interface SavedTimeline {
  id: string;
  name: string;
  description: string;
  events: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

interface TimelineBuilderState {
  /** Current timeline name. */
  name: string;
  /** Current timeline description. */
  description: string;
  /** Events in the current timeline (ordered). */
  events: TimelineEvent[];
  /** Set the timeline name. */
  setName: (name: string) => void;
  /** Set the timeline description. */
  setDescription: (description: string) => void;
  /** Add an event from a search result. Returns false if already present. */
  addEvent: (result: SearchResult) => boolean;
  /** Remove an event by id. */
  removeEvent: (id: string) => void;
  /** Move an event up in the list. */
  moveUp: (index: number) => void;
  /** Move an event down in the list. */
  moveDown: (index: number) => void;
  /** Clear all events and reset name/description. */
  clearAll: () => void;
  /** Load a saved timeline into the builder. */
  loadTimeline: (timeline: SavedTimeline) => void;
}

/** Convert a SearchResult to a TimelineEvent. */
function toTimelineEvent(r: SearchResult): TimelineEvent {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    year_approx: r.year_approx,
    category: r.category,
    geo_modern: r.geo_modern,
    importance_score: r.importance_score,
  };
}

export const useTimelineBuilderStore = create<TimelineBuilderState>((set, get) => ({
  name: 'My Timeline',
  description: '',
  events: [],

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),

  addEvent: (result) => {
    const { events } = get();
    if (events.some((e) => e.id === result.id)) return false;
    set({ events: [...events, toTimelineEvent(result)] });
    return true;
  },

  removeEvent: (id) => {
    set((s) => ({ events: s.events.filter((e) => e.id !== id) }));
  },

  moveUp: (index) => {
    if (index <= 0) return;
    set((s) => {
      const next = [...s.events];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return { events: next };
    });
  },

  moveDown: (index) => {
    set((s) => {
      if (index >= s.events.length - 1) return s;
      const next = [...s.events];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return { events: next };
    });
  },

  clearAll: () => set({ name: 'My Timeline', description: '', events: [] }),

  loadTimeline: (timeline) =>
    set({
      name: timeline.name,
      description: timeline.description,
      events: timeline.events,
    }),
}));

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = 'chronicle_timelines';

/** Generate a short unique ID. */
function generateId(): string {
  return `tl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Read all saved timelines from localStorage. */
export function getSavedTimelines(): SavedTimeline[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedTimeline[];
  } catch {
    return [];
  }
}

/** Save or update a timeline. Returns the saved timeline (with id). */
export function saveTimeline(
  name: string,
  description: string,
  events: TimelineEvent[],
  existingId?: string,
): SavedTimeline {
  const timelines = getSavedTimelines();
  const now = new Date().toISOString();

  if (existingId) {
    const idx = timelines.findIndex((t) => t.id === existingId);
    if (idx !== -1) {
      timelines[idx] = { ...timelines[idx], name, description, events, updatedAt: now };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timelines));
      return timelines[idx];
    }
  }

  const timeline: SavedTimeline = {
    id: generateId(),
    name,
    description,
    events,
    createdAt: now,
    updatedAt: now,
  };
  timelines.push(timeline);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timelines));
  return timeline;
}

/** Get a single timeline by ID from localStorage. */
export function getTimelineById(id: string): SavedTimeline | null {
  return getSavedTimelines().find((t) => t.id === id) ?? null;
}

/** Delete a timeline by ID. */
export function deleteTimeline(id: string): void {
  const timelines = getSavedTimelines().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timelines));
}
