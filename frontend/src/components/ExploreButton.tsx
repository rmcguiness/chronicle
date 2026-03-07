/**
 * ExploreButton.tsx
 *
 * Toolbar button that navigates to a random notable event for casual discovery.
 * Fetches from GET /api/events/random and animates the ReactFlow viewport
 * to center on the returned event's canvas position.
 *
 * Owns: button rendering, random-event fetch, viewport animation.
 * Does NOT own: node layout, detail panel content.
 */

import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAppStore } from '../store';
import { fetchRandomEvent } from '../api/client';
import { CANVAS_CONSTANTS } from '../types';

const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

/**
 * Compute the canvas X position for a year within the current time viewport.
 * Mirrors the yearToX logic in NetworkView.
 */
function yearToCanvasX(year: number, yearMin: number, yearMax: number): number {
  const span = yearMax - yearMin;
  if (span <= 0) return 0;
  return ((year - yearMin) / span) * CANVAS_WIDTH;
}

/**
 * Toolbar button that flies the viewport to a random notable event.
 * Shows a brief loading state while the fetch is in progress.
 */
export default function ExploreButton() {
  const [loading, setLoading] = useState(false);
  const reactFlow = useReactFlow();
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const timeViewport = useAppStore((s) => s.timeViewport);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const event = await fetchRandomEvent(0.6);

      // Select the event (opens detail panel)
      setSelectedEvent(event.slug);

      // Compute canvas position and animate viewport to center on it
      const x = yearToCanvasX(event.year_approx, timeViewport.yearMin, timeViewport.yearMax);
      const y = event.network_y ?? CANVAS_CONSTANTS.CANVAS_HEIGHT / 2;

      const currentVp = reactFlow.getViewport();
      const zoom = currentVp.zoom;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      reactFlow.setViewport(
        {
          x: -x * zoom + screenW / 2,
          y: -y * zoom + screenH / 2,
          zoom,
        },
        { duration: 800 },
      );
    } catch {
      // Silently ignore — the user can just click again
    } finally {
      setLoading(false);
    }
  }, [reactFlow, setSelectedEvent, timeViewport]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Explore a random event"
      aria-label="Explore a random event"
      style={{
        position: 'fixed',
        top: 16,
        right: 300,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: loading ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 16 }}>{loading ? '\u23F3' : '\u{1F500}'}</span>
      {loading ? 'Loading\u2026' : 'Explore'}
    </button>
  );
}
