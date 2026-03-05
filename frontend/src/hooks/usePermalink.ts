/**
 * usePermalink.ts — React hook that syncs Chronicle's UI state with the URL hash.
 *
 * Owns:
 *   - Restoring viewport state, selected event, and region visibility from
 *     the URL hash on initial page load
 *   - Subscribing to Zustand store changes and writing the new hash (debounced)
 *     via `history.replaceState` (no new browser history entry on every pan)
 *   - Listening to `hashchange` events so the browser back/forward buttons
 *     correctly restore previous views
 *
 * Does NOT:
 *   - Parse or serialize hash strings (see utils/permalink.ts)
 *   - Directly control the ReactFlow viewport — it sets `pendingRfViewport`
 *     in the store; Canvas.tsx (CanvasInner) consumes and applies it
 */

import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import { parseHash, serializeHash, yearRangeToRfViewport } from '../utils/permalink';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Debounce delay (ms) between viewport/state changes and the hash write. */
const HASH_UPDATE_DEBOUNCE_MS = 500;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Synchronise the URL hash with the current Chronicle viewport state.
 *
 * Call this hook once, at the app level inside `TimelineView`, to activate
 * permalink support. It has no return value — side effects only.
 *
 * **Lifecycle:**
 * 1. On mount → reads `window.location.hash` and restores any encoded state.
 * 2. On store change → debounces 500 ms then calls `history.replaceState` to
 *    update the hash without creating a browser history entry.
 * 3. On `hashchange` → restores state from the new hash (handles back/forward).
 *
 * @example
 * function TimelineView() {
 *   usePermalink();
 *   return <Canvas />;
 * }
 */
export function usePermalink(): void {
  const viewport = useAppStore((s) => s.viewport);
  const rfZoom = useAppStore((s) => s.rfZoom);
  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);
  const collapsedRegions = useAppStore((s) => s.collapsedRegions);

  const setViewport = useAppStore((s) => s.setViewport);
  const setRfZoom = useAppStore((s) => s.setRfZoom);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const setCollapsedRegions = useAppStore((s) => s.setCollapsedRegions);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * Parse the given hash and apply all encoded state to the store.
   * Kept in a ref so the `hashchange` listener always has the latest setters
   * without needing to be re-registered.
   */
  const restoreFromHash = useRef((hash: string): void => {
    const state = parseHash(hash);

    // ── Viewport + ReactFlow transform ───────────────────────────────────────
    if (
      state.startYear !== undefined &&
      state.endYear !== undefined &&
      state.zoom !== undefined
    ) {
      setViewport({
        year_min: state.startYear,
        year_max: state.endYear,
        zoom: state.zoom,
      });
      setRfZoom(state.zoom);
      // Signal CanvasInner to apply the viewport once ReactFlow is ready
      setPendingRfViewport(yearRangeToRfViewport(state.startYear, state.zoom));
    }

    // ── Selected event ───────────────────────────────────────────────────────
    if (state.eventSlug) {
      // setSelectedEvent also opens the detail panel (see store)
      setSelectedEvent(state.eventSlug);
    }

    // ── Hidden region bands ──────────────────────────────────────────────────
    if (state.hiddenRegions) {
      setCollapsedRegions(new Set(state.hiddenRegions));
    }
  });

  // ── On mount: restore from the current hash ────────────────────────────────
  // Empty deps: intentionally runs once on mount. restoreFromHash is a stable ref
  // (a useRef wrapper), so it never needs to be in the dependency array.
  useEffect(() => {
    if (window.location.hash) {
      restoreFromHash.current(window.location.hash);
    }
  }, []);

  // ── Back/forward navigation: hashchange listener ───────────────────────────
  useEffect(() => {
    const handler = (): void => {
      restoreFromHash.current(window.location.hash);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // ── Debounced hash update on state changes ─────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const fragment = serializeHash({
        startYear: viewport.year_min,
        endYear: viewport.year_max,
        zoom: rfZoom,
        eventSlug: selectedEventSlug ?? undefined,
        hiddenRegions: collapsedRegions.size > 0 ? [...collapsedRegions] : undefined,
      });

      const newHash = fragment ? `#${fragment}` : '';
      const currentHash = window.location.hash;

      if (newHash !== currentHash) {
        // replaceState keeps the URL current without polluting browser history
        history.replaceState(null, '', newHash || window.location.pathname);
      }
    }, HASH_UPDATE_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [
    viewport.year_min,
    viewport.year_max,
    rfZoom,
    selectedEventSlug,
    collapsedRegions,
  ]);
}
