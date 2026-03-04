/**
 * useBookmarks.ts
 *
 * SRP hook for managing timeline bookmarks (named viewport positions).
 *
 * Responsibilities:
 *   - Own the bookmark list state.
 *   - Persist / hydrate from localStorage (key: `chronicle:bookmarks`).
 *   - Expose save / delete / jump operations.
 *
 * Does NOT:
 *   - Own any UI state (open/closed panel, input values, etc.) — that lives in BookmarkPanel.
 *   - Know about tile fetching, events, or the app store.
 */

import { useState, useCallback, useEffect } from 'react';
import { useReactFlow, type Viewport } from '@xyflow/react';

// ─── Constants ────────────────────────────────────────────────────────────────

/** localStorage key used to persist bookmarks across sessions. */
const STORAGE_KEY = 'chronicle:bookmarks' as const;

/** Maximum bookmarks retained; oldest (by createdAt) is dropped when exceeded. */
const MAX_BOOKMARKS = 20 as const;

/** Animation duration (ms) when jumping to a bookmark. */
const JUMP_DURATION_MS = 800 as const;

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * A saved viewport bookmark.
 */
export interface Bookmark {
  /** UUID-style identifier, generated at save time. */
  id: string;
  /** Human-readable label given by the user. */
  name: string;
  /** React-Flow viewport x offset (screen pixels). */
  x: number;
  /** React-Flow viewport y offset (screen pixels). */
  y: number;
  /** React-Flow viewport zoom level. */
  zoom: number;
  /** Unix timestamp (ms) when the bookmark was created. */
  createdAt: number;
}

/**
 * Return shape of {@link useBookmarks}.
 */
export interface UseBookmarksReturn {
  /** Current ordered list of bookmarks (newest first). */
  bookmarks: Bookmark[];
  /**
   * Capture the current React-Flow viewport and save it as a bookmark.
   *
   * @param name - Display label for the bookmark. Whitespace is trimmed.
   *   Passing an empty string after trimming is a no-op.
   */
  saveBookmark: (name: string) => void;
  /**
   * Remove a bookmark by its id.
   *
   * @param id - The {@link Bookmark.id} to delete.
   */
  deleteBookmark: (id: string) => void;
  /**
   * Animate the React-Flow canvas to the viewport stored in the bookmark.
   *
   * @param id - The {@link Bookmark.id} to jump to.
   */
  jumpToBookmark: (id: string) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Load bookmarks from localStorage, returning an empty array on any failure
 * (missing key, malformed JSON, schema mismatch).
 */
function loadFromStorage(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Basic runtime shape guard — keeps stale data from crashing
    return parsed.filter(
      (b): b is Bookmark =>
        typeof b === 'object' &&
        b !== null &&
        typeof (b as Bookmark).id === 'string' &&
        typeof (b as Bookmark).name === 'string' &&
        typeof (b as Bookmark).x === 'number' &&
        typeof (b as Bookmark).y === 'number' &&
        typeof (b as Bookmark).zoom === 'number' &&
        typeof (b as Bookmark).createdAt === 'number',
    );
  } catch {
    return [];
  }
}

/**
 * Persist a bookmark array to localStorage. Silently swallows QuotaExceededError.
 */
function saveToStorage(bookmarks: Bookmark[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // QuotaExceededError — best effort, no crash
  }
}

/**
 * Generate a simple pseudo-UUID (no external dependency required).
 * Sufficient for client-side collision avoidance.
 */
function generateId(): string {
  return `bm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages timeline bookmarks: save, delete, and jump-to viewport positions.
 *
 * Must be called inside a `<ReactFlowProvider>` subtree (which `CanvasInner`
 * already provides via `Canvas`).
 *
 * @returns {@link UseBookmarksReturn}
 *
 * @example
 * ```tsx
 * const { bookmarks, saveBookmark, deleteBookmark, jumpToBookmark } = useBookmarks();
 * ```
 */
export function useBookmarks(): UseBookmarksReturn {
  const { getViewport, setViewport } = useReactFlow();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadFromStorage);

  // Sync to localStorage whenever the list changes
  useEffect(() => {
    saveToStorage(bookmarks);
  }, [bookmarks]);

  const saveBookmark = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      const vp: Viewport = getViewport();
      const next: Bookmark = {
        id: generateId(),
        name: trimmed,
        x: vp.x,
        y: vp.y,
        zoom: vp.zoom,
        createdAt: Date.now(),
      };

      setBookmarks((prev) => {
        // Prepend newest; trim oldest when over limit
        const updated = [next, ...prev];
        return updated.length > MAX_BOOKMARKS
          ? updated.slice(0, MAX_BOOKMARKS)
          : updated;
      });
    },
    [getViewport],
  );

  const deleteBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const jumpToBookmark = useCallback(
    (id: string) => {
      const target = bookmarks.find((b) => b.id === id);
      if (!target) return;
      void setViewport(
        { x: target.x, y: target.y, zoom: target.zoom },
        { duration: JUMP_DURATION_MS },
      );
    },
    [bookmarks, setViewport],
  );

  return { bookmarks, saveBookmark, deleteBookmark, jumpToBookmark };
}
