/**
 * useCausalPath.ts
 *
 * Hook that manages the causal path finder workflow:
 * 1. User enters path mode (via toolbar button)
 * 2. First click sets start event, second click sets end event
 * 3. Automatically fetches shortest path via POST /api/events/causal-path
 * 4. Exposes path data, loading state, and a set of highlighted event IDs
 */

import { useCallback, useEffect } from 'react';
import { useAppStore } from '../store';
import { fetchCausalPath } from '../api/client';

/** Set of event IDs on the current causal path, for O(1) highlight lookups. */
export function usePathEventIds(): Set<string> {
  const causalPath = useAppStore((s) => s.causalPath);
  return new Set(causalPath.map((e) => e.id));
}

/**
 * Core path-finder hook. Call in the top-level MainView to wire up
 * the automatic fetch when both start and end slugs are set.
 */
export function useCausalPath() {
  const pathModeActive = useAppStore((s) => s.pathModeActive);
  const pathStartSlug = useAppStore((s) => s.pathStartSlug);
  const pathEndSlug = useAppStore((s) => s.pathEndSlug);
  const setCausalPath = useAppStore((s) => s.setCausalPath);
  const setCausalPathHops = useAppStore((s) => s.setCausalPathHops);
  const setPathLoading = useAppStore((s) => s.setPathLoading);

  // Fetch path when both endpoints are set
  useEffect(() => {
    if (!pathStartSlug || !pathEndSlug) return;

    let cancelled = false;
    setPathLoading(true);

    fetchCausalPath(pathStartSlug, pathEndSlug).then((result) => {
      if (cancelled) return;
      if (result && result.found) {
        setCausalPath(result.path);
        setCausalPathHops(result.hops);
      } else {
        setCausalPath([]);
        setCausalPathHops(0);
      }
      setPathLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [pathStartSlug, pathEndSlug, setCausalPath, setCausalPathHops, setPathLoading]);

  /** Handle a node click in path mode. Sets start then end. */
  const handlePathNodeClick = useCallback(
    (slug: string) => {
      if (!pathModeActive) return;

      const setStart = useAppStore.getState().setPathStartSlug;
      const setEnd = useAppStore.getState().setPathEndSlug;
      const currentStart = useAppStore.getState().pathStartSlug;

      if (!currentStart) {
        setStart(slug);
      } else if (currentStart !== slug) {
        setEnd(slug);
      }
    },
    [pathModeActive],
  );

  return { handlePathNodeClick };
}
