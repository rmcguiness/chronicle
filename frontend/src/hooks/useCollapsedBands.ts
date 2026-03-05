/**
 * useCollapsedBands.ts
 *
 * React hook that manages the collapsed/expanded toggle state for region
 * swim-lane bands on the timeline canvas.
 *
 * Responsibilities:
 *   - Expose a stable read + toggle interface for region band collapse state
 *   - Delegate all state and localStorage persistence to the Zustand store
 *     (see store/index.ts), so the permalink system can also read/write it
 *
 * Does NOT:
 *   - Hold its own local React state (state lives in the store)
 *   - Compute visual layout (see utils/bandDensity.ts)
 *   - Render anything
 *
 * @deprecated Direct store usage (`useAppStore(s => s.collapsedRegions)`) is
 *   preferred for new code. This hook remains for backward compatibility with
 *   Canvas.tsx.
 */

import { useCallback } from 'react';
import { useAppStore } from '../store';
import type { Region } from '../types';

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
   * Persists the new state to localStorage via the store.
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
 * State is stored in (and persisted by) the Zustand store so that the
 * permalink system can restore collapsed bands from a shared URL without
 * needing to reach into component-local state.
 *
 * @returns {@link UseCollapsedBandsResult}
 *
 * @example
 * const { collapsedBands, toggleBand, isCollapsed } = useCollapsedBands();
 * <button onClick={() => toggleBand('americas')}>
 *   {isCollapsed('americas') ? 'Expand' : 'Collapse'}
 * </button>
 */
export function useCollapsedBands(): UseCollapsedBandsResult {
  const collapsedBands = useAppStore((s) => s.collapsedRegions);
  const toggleCollapsedRegion = useAppStore((s) => s.toggleCollapsedRegion);

  const toggleBand = useCallback(
    (region: Region) => toggleCollapsedRegion(region),
    [toggleCollapsedRegion],
  );

  const isCollapsed = useCallback(
    (region: Region) => collapsedBands.has(region),
    [collapsedBands],
  );

  return { collapsedBands, toggleBand, isCollapsed };
}
