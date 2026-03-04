/**
 * useCollapsedBands.ts
 *
 * React hook that manages the collapsed/expanded toggle state for region
 * swim-lane bands on the timeline canvas.
 *
 * Responsibilities:
 *   - Maintain a Set of currently-collapsed region IDs in component state
 *   - Persist and restore that set to/from localStorage so it survives
 *     page refreshes
 *   - Expose a stable toggle callback
 *
 * Does NOT:
 *   - Compute visual layout (see utils/bandDensity.ts)
 *   - Render anything
 */

import { useState, useCallback } from 'react';
import type { Region } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** localStorage key used to persist collapsed band IDs. */
const STORAGE_KEY = 'chronicle:collapsedBands';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read the persisted collapsed band IDs from localStorage.
 * Returns an empty Set if the key is absent or the value is malformed.
 */
function readPersistedBands(): Set<Region> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set<Region>();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<Region>();
    return new Set(parsed as Region[]);
  } catch {
    // Silently ignore parse errors (corrupted storage)
    return new Set<Region>();
  }
}

/**
 * Write the current collapsed band IDs to localStorage.
 * Silently ignores write errors (e.g. storage quota exceeded).
 *
 * @param bands - The set to persist.
 */
function persistBands(bands: Set<Region>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...bands]));
  } catch {
    // Silently ignore (private browsing mode / quota exceeded)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook return type
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return value of {@link useCollapsedBands}.
 */
export interface UseCollapsedBandsResult {
  /** Immutable snapshot of currently-collapsed region IDs. */
  collapsedBands: Set<Region>;
  /**
   * Toggle the collapsed state of a single region band.
   * Also persists the new state to localStorage.
   *
   * @param region - The region whose band should be toggled.
   */
  toggleBand: (region: Region) => void;
  /**
   * Returns `true` if the given region's band is currently collapsed.
   *
   * @param region - Region to query.
   */
  isCollapsed: (region: Region) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Manages which region swim-lane bands are currently collapsed.
 *
 * State is initialised from localStorage on first render and written back
 * whenever the user toggles a band.
 *
 * @returns {@link UseCollapsedBandsResult}
 *
 * @example
 * const { collapsedBands, toggleBand, isCollapsed } = useCollapsedBands();
 * // In JSX:
 * <button onClick={() => toggleBand('americas')}>
 *   {isCollapsed('americas') ? 'Expand' : 'Collapse'}
 * </button>
 */
export function useCollapsedBands(): UseCollapsedBandsResult {
  const [collapsedBands, setCollapsedBands] = useState<Set<Region>>(
    readPersistedBands,
  );

  const toggleBand = useCallback((region: Region) => {
    setCollapsedBands((prev) => {
      const next = new Set(prev);
      if (next.has(region)) {
        next.delete(region);
      } else {
        next.add(region);
      }
      persistBands(next);
      return next;
    });
  }, []);

  const isCollapsed = useCallback(
    (region: Region) => collapsedBands.has(region),
    [collapsedBands],
  );

  return { collapsedBands, toggleBand, isCollapsed };
}
