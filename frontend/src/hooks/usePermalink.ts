/**
 * usePermalink.ts — React hook that syncs Chronicle's UI state with the URL hash.
 *
 * Owns:
 *   - Restoring viewport state and selected event from the URL hash on
 *     initial page load
 *   - Subscribing to Zustand store changes and writing the new hash (debounced
 *     800 ms) via `history.replaceState` (no new browser history entry on every pan)
 *   - Listening to `hashchange` events so the browser back/forward buttons
 *     correctly restore previous views
 *
 * Hash format: #z={zoom}&cx={centerX}&cy={centerY}&e={eventSlug}
 *
 * Does NOT:
 *   - Parse or serialize hash strings (see utils/permalink.ts)
 *   - Directly control the ReactFlow viewport — it sets `pendingRfViewport`
 *     in the store; NetworkView consumes and applies it
 */

import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import {
  parseHash,
  serializeHash,
  centerToRfViewport,
  rfViewportToCenter,
} from '../utils/permalink';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Debounce delay (ms) between viewport/state changes and the hash write. */
const HASH_UPDATE_DEBOUNCE_MS = 800;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Synchronise the URL hash with the current Chronicle viewport state.
 *
 * Call this hook once, at the app level inside `MainView`, to activate
 * permalink support. It has no return value — side effects only.
 *
 * **Lifecycle:**
 * 1. On mount → reads `window.location.hash` and restores any encoded state.
 * 2. On store change → debounces 800 ms then calls `history.replaceState` to
 *    update the hash without creating a browser history entry.
 * 3. On `hashchange` → restores state from the new hash (handles back/forward).
 */
export function usePermalink(): void {
  const rfViewport = useAppStore((s) => s.rfViewport);
  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);

  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /**
   * Parse the given hash and apply all encoded state to the store.
   * Kept in a ref so the `hashchange` listener always has the latest setters
   * without needing to be re-registered.
   */
  const restoreFromHash = useRef((hash: string): void => {
    const state = parseHash(hash);

    // ── Viewport: restore center + zoom ───────────────────────────────────
    if (
      state.centerX !== undefined &&
      state.centerY !== undefined &&
      state.zoom !== undefined
    ) {
      const vp = centerToRfViewport(state.centerX, state.centerY, state.zoom);
      setPendingRfViewport(vp);
    }

    // ── Selected event ───────────────────────────────────────────────────
    if (state.eventSlug) {
      setSelectedEvent(state.eventSlug);
    }
  });

  // ── On mount: restore from the current hash ────────────────────────────
  useEffect(() => {
    if (window.location.hash) {
      restoreFromHash.current(window.location.hash);
    }
  }, []);

  // ── Back/forward navigation: hashchange listener ───────────────────────
  useEffect(() => {
    const handler = (): void => {
      restoreFromHash.current(window.location.hash);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // ── Debounced hash update on state changes ─────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const { centerX, centerY } = rfViewportToCenter(rfViewport);

      const fragment = serializeHash({
        zoom: rfViewport.zoom,
        centerX,
        centerY,
        eventSlug: selectedEventSlug ?? undefined,
      });

      const newHash = fragment ? `#${fragment}` : '';
      const currentHash = window.location.hash;

      if (newHash !== currentHash) {
        history.replaceState(null, '', newHash || window.location.pathname);
      }
    }, HASH_UPDATE_DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [rfViewport, selectedEventSlug]);
}
