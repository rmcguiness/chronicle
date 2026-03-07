/**
 * EraNav.tsx
 *
 * Compact "Jump to era" dropdown for the toolbar. Selecting a historical era
 * sets the timeViewport to that year range and resets the ReactFlow camera
 * to fit the new range, using the same viewport mechanics as the timeline
 * scrubber and permalink system.
 *
 * Owns: era definitions, dropdown UI, viewport navigation.
 * Does NOT own: data fetching, layout computation, node rendering.
 */

import { useCallback, useRef } from 'react';
import { useAppStore } from '../store';
import { CANVAS_CONSTANTS } from '../types';

const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// Era definitions
// ─────────────────────────────────────────────────────────────────────────────

interface Era {
  label: string;
  yearMin: number;
  yearMax: number;
}

const ERAS: Era[] = [
  { label: 'Ancient World', yearMin: -3000, yearMax: -500 },
  { label: 'Classical', yearMin: -500, yearMax: 500 },
  { label: 'Medieval', yearMin: 500, yearMax: 1500 },
  { label: 'Age of Exploration', yearMin: 1400, yearMax: 1700 },
  { label: 'Industrial Revolution', yearMin: 1750, yearMax: 1900 },
  { label: 'World Wars', yearMin: 1910, yearMax: 1950 },
  { label: 'Cold War', yearMin: 1945, yearMax: 1991 },
  { label: 'Contemporary', yearMin: 1990, yearMax: 2025 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A compact dropdown that flies the viewport to a preset historical era.
 * Positioned in the fixed toolbar area alongside other controls.
 */
export default function EraNav() {
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const idx = parseInt(e.target.value, 10);
      if (isNaN(idx)) return;

      const era = ERAS[idx];

      // 1. Set the time viewport to the era's year range.
      //    This re-maps all node X positions so the era fills the canvas.
      setTimeViewport({ yearMin: era.yearMin, yearMax: era.yearMax });

      // 2. Reset the ReactFlow camera so the full canvas is centered on screen.
      //    x=0 aligns the canvas origin with the left edge of the screen;
      //    zoom is chosen so the full CANVAS_WIDTH fits within the viewport.
      const screenWidth =
        typeof window !== 'undefined' ? window.innerWidth : 1920;
      const zoom = screenWidth / CANVAS_WIDTH;
      setPendingRfViewport({ x: 0, y: 0, zoom });

      // 3. Reset select to placeholder so the same era can be re-selected.
      if (selectRef.current) selectRef.current.value = '';
    },
    [setTimeViewport, setPendingRfViewport],
  );

  return (
    <select
      ref={selectRef}
      onChange={handleChange}
      defaultValue=""
      title="Jump to a historical era"
      aria-label="Jump to era"
      style={{
        position: 'fixed',
        top: 16,
        right: 290,
        zIndex: 30,
        padding: '8px 12px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        paddingRight: 28,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='1.5'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        transition: 'all 150ms ease',
      }}
    >
      <option value="" disabled hidden>
        Jump to era
      </option>
      {ERAS.map((era, i) => (
        <option key={era.label} value={i}>
          {era.label}
        </option>
      ))}
    </select>
  );
}
