/**
 * useCategoryFilter.ts
 *
 * What it does:  Custom React hook for managing category-based event filtering.
 * What it owns:  Active-category state and localStorage persistence.
 * What it does NOT do: Perform actual filtering of event arrays — callers are
 *   responsible for using `activeCategories` to filter their own data.
 *
 * @module useCategoryFilter
 */

import { useCallback, useEffect, useState } from 'react';

/** localStorage key used to persist the active category selection across sessions. */
const STORAGE_KEY = 'chronicle:categoryFilter';

/**
 * Return value of the `useCategoryFilter` hook.
 */
export interface UseCategoryFilterReturn {
  /**
   * The set of currently-active category ids.
   * Events whose category is NOT in this set should be hidden.
   */
  activeCategories: Set<string>;

  /**
   * Toggle a single category on or off.
   * @param id - The category id to toggle (e.g. `"war"`, `"discovery"`).
   */
  toggleCategory: (id: string) => void;

  /**
   * Activate exactly the provided ids (replaces the current selection).
   * Typically used by the "All" quick-toggle button.
   * @param ids - Array of category ids to mark as active.
   */
  setAll: (ids: string[]) => void;

  /**
   * Deactivate all categories (empty selection → no events visible).
   * Typically used by the "None" quick-toggle button.
   */
  clearAll: () => void;
}

/**
 * Hook that tracks which event categories are currently visible.
 *
 * On first mount all `allIds` are active by default.  The selection is persisted
 * to `localStorage` so it survives page refreshes.  If `allIds` changes (e.g.
 * new categories arrive from the backend), any previously-unknown ids are added
 * to the active set automatically.
 *
 * @example
 * ```tsx
 * const ALL_CATS = ['war', 'discovery', 'political'] as const;
 * const { activeCategories, toggleCategory, setAll, clearAll } = useCategoryFilter(ALL_CATS);
 *
 * const visibleEvents = events.filter(e => activeCategories.has(e.category));
 * ```
 *
 * @param allIds - Complete list of category ids the app knows about.
 * @returns Reactive filter state and mutators.
 */
export function useCategoryFilter(allIds: readonly string[]): UseCategoryFilterReturn {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(() => {
    // Attempt to restore from localStorage; fall back to all-active.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Only keep ids that are still valid; add any new ones as active.
          const stored = new Set<string>(parsed as string[]);
          const result = new Set<string>(stored);
          // Activate any brand-new categories not present in the stored selection.
          for (const id of allIds) {
            if (!stored.has(id)) result.add(id);
          }
          return result;
        }
      }
    } catch {
      // Malformed storage value — ignore and use default.
    }
    return new Set(allIds);
  });

  /** Persist any change to localStorage. */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...activeCategories]));
    } catch {
      // Storage quota or private-mode restriction — silently skip.
    }
  }, [activeCategories]);

  /**
   * Toggle one category: adds it if absent, removes it if present.
   */
  const toggleCategory = useCallback((id: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /**
   * Set the active selection to exactly the provided ids.
   */
  const setAll = useCallback((ids: string[]) => {
    setActiveCategories(new Set(ids));
  }, []);

  /**
   * Clear all active categories (zero visible events).
   */
  const clearAll = useCallback(() => {
    setActiveCategories(new Set<string>());
  }, []);

  return { activeCategories, toggleCategory, setAll, clearAll };
}
