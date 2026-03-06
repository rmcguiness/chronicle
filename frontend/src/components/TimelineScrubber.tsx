/**
 * TimelineScrubber.tsx
 *
 * Bottom-of-screen scrubber that shows the full timeline (-5000 to 2100) and
 * highlights the year range currently visible on screen. The visible window is
 * derived from the ReactFlow camera position + timeViewport + canvas width.
 *
 * Drag behavior:
 *   - Body drag → pans the ReactFlow camera (shifts rfViewport.x) without
 *     changing timeViewport.
 *   - Edge handles → changes timeViewport (zoom in/out), same as before.
 *
 * Owns: scrubber UI, drag interaction.
 * Does NOT own: data fetching, layout computation, node rendering.
 */

import { useRef, useCallback } from 'react';
import { useAppStore } from '../store';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const { BASE_YEAR_MIN, BASE_YEAR_MAX, CANVAS_WIDTH } = CANVAS_CONSTANTS;

/** Full historical range shown in the scrubber track. */
const FULL_MIN = BASE_YEAR_MIN; // -5000
const FULL_MAX = BASE_YEAR_MAX; // 2100
const FULL_SPAN = FULL_MAX - FULL_MIN; // 7100

/** Minimum time span allowed (prevents collapsing the window to nothing). */
const MIN_TIME_SPAN = 50;

/** Default screen width fallback for SSR/tests. */
const DEFAULT_SCREEN_WIDTH = 1920;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a year to a percentage position on the scrubber track. */
function yearToPercent(year: number): number {
  return ((year - FULL_MIN) / FULL_SPAN) * 100;
}

/** Convert a percentage position on the track back to a year. */
function percentToYear(pct: number): number {
  return Math.round(FULL_MIN + (pct / 100) * FULL_SPAN);
}

/** Format a year for display (e.g. "3000 BCE", "1500", "CE"). */
function yearLabel(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 BCE/CE';
  return `${year}`;
}

// Tick every 500 years
const TICK_MARKERS: number[] = [];
for (let y = FULL_MIN; y <= FULL_MAX; y += 500) TICK_MARKERS.push(y);

// Labels at every 1000 years
const LABEL_MARKERS: number[] = [];
for (let y = FULL_MIN; y <= FULL_MAX; y += 1000) LABEL_MARKERS.push(y);

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fixed-position timeline scrubber at the bottom of the screen.
 * Shows the full historical range with tick marks, and highlights the year
 * range currently visible on the ReactFlow canvas.
 */
export default function TimelineScrubber() {
  const timeViewport = useAppStore((s) => s.timeViewport);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);
  const rfViewport = useAppStore((s) => s.rfViewport);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);

  const trackRef = useRef<HTMLDivElement>(null);

  // ── Compute the year range currently visible on screen ──────────────────

  const tvSpan = timeViewport.yearMax - timeViewport.yearMin;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : DEFAULT_SCREEN_WIDTH;

  /**
   * Visible year range on screen, derived from ReactFlow camera position.
   * rfViewport.x is the screen-space offset of canvas origin; dividing by zoom
   * converts to canvas-space. That canvas-space offset as a fraction of
   * CANVAS_WIDTH tells us how far into timeViewport we are.
   */
  const visibleYearMin = timeViewport.yearMin + (-rfViewport.x / rfViewport.zoom / CANVAS_WIDTH) * tvSpan;
  const visibleYearMax = visibleYearMin + (screenWidth / rfViewport.zoom / CANVAS_WIDTH) * tvSpan;

  // Clamp to full range for display
  const windowMin = Math.max(FULL_MIN, visibleYearMin);
  const windowMax = Math.min(FULL_MAX, visibleYearMax);

  const minPct = yearToPercent(windowMin);
  const maxPct = yearToPercent(windowMax);

  // ── Drag state ──────────────────────────────────────────────────────────

  const dragging = useRef<null | 'min' | 'max' | 'range'>(null);
  const dragStart = useRef({
    x: 0,
    windowMin: 0,
    windowMax: 0,
    rfX: 0,
    tvYearMin: 0,
    tvYearMax: 0,
  });

  // ── Mouse handlers ──────────────────────────────────────────────────────

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.current.x;
    const dYears = Math.round((dx / rect.width) * FULL_SPAN);

    if (dragging.current === 'min') {
      // Left handle: change timeViewport.yearMin (zoom in/out from the left)
      const newMin = Math.max(FULL_MIN, Math.min(
        dragStart.current.tvYearMax - MIN_TIME_SPAN,
        dragStart.current.tvYearMin + dYears,
      ));
      setTimeViewport({ yearMin: newMin, yearMax: dragStart.current.tvYearMax });
    } else if (dragging.current === 'max') {
      // Right handle: change timeViewport.yearMax (zoom in/out from the right)
      const newMax = Math.min(FULL_MAX, Math.max(
        dragStart.current.tvYearMin + MIN_TIME_SPAN,
        dragStart.current.tvYearMax + dYears,
      ));
      setTimeViewport({ yearMin: dragStart.current.tvYearMin, yearMax: newMax });
    } else if (dragging.current === 'range') {
      // Body drag: pan the ReactFlow camera (shift rfViewport.x)
      const currentTvSpan = dragStart.current.tvYearMax - dragStart.current.tvYearMin;
      const dCanvasX = (dYears / currentTvSpan) * CANVAS_WIDTH;
      const newRfX = dragStart.current.rfX - dCanvasX * rfViewport.zoom;
      setPendingRfViewport({ x: newRfX, y: rfViewport.y, zoom: rfViewport.zoom });
    }
  }, [setTimeViewport, setPendingRfViewport, rfViewport.y, rfViewport.zoom]);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    // eslint-disable-next-line react-hooks/immutability
    window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  const onMinMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'min';
    dragStart.current = {
      x: e.clientX,
      windowMin,
      windowMax,
      rfX: rfViewport.x,
      tvYearMin: timeViewport.yearMin,
      tvYearMax: timeViewport.yearMax,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMaxMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'max';
    dragStart.current = {
      x: e.clientX,
      windowMin,
      windowMax,
      rfX: rfViewport.x,
      tvYearMin: timeViewport.yearMin,
      tvYearMax: timeViewport.yearMax,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onRangeMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.preventDefault();
    dragging.current = 'range';
    dragStart.current = {
      x: e.clientX,
      windowMin,
      windowMax,
      rfX: rfViewport.x,
      tvYearMin: timeViewport.yearMin,
      tvYearMax: timeViewport.yearMax,
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Click on track to jump (center the visible window on the clicked year)
  const onTrackClick = (e: React.MouseEvent) => {
    if (dragging.current) return;
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const clickedYear = percentToYear(pct);

    // Pan the camera so the clicked year is centered on screen
    const visibleSpanYears = (screenWidth / rfViewport.zoom / CANVAS_WIDTH) * tvSpan;
    const targetVisibleMin = clickedYear - visibleSpanYears / 2;
    const newRfX = -(((targetVisibleMin - timeViewport.yearMin) / tvSpan) * CANVAS_WIDTH) * rfViewport.zoom;
    setPendingRfViewport({ x: newRfX, y: rfViewport.y, zoom: rfViewport.zoom });
  };

  const windowSpan = windowMax - windowMin;

  return (
    <div
      className="bg-white/95 border-t border-gray-200 dark:bg-[rgba(7,14,34,0.95)] dark:border-white/[0.08]"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        padding: '12px 24px 16px',
        userSelect: 'none',
      }}
    >
      {/* Year range indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>
          {yearLabel(Math.round(windowMin))}
        </span>
        <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.05em' }}>
          TIMELINE — {windowSpan.toLocaleString(undefined, { maximumFractionDigits: 0 })} year span
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>
          {yearLabel(Math.round(windowMax))}
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onClick={onTrackClick}
        style={{
          position: 'relative',
          height: 36,
          cursor: 'crosshair',
        }}
      >
        {/* Background rail */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 4,
          }}
        />

        {/* BCE/CE divider (year 0) */}
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: `${yearToPercent(0)}%`,
            width: 2,
            height: 24,
            backgroundColor: 'rgba(251,191,36,0.5)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        />

        {/* 500-year tick marks */}
        {TICK_MARKERS.map((year) => {
          const pct = yearToPercent(year);
          const isMajor = year % 1000 === 0;
          return (
            <div
              key={year}
              style={{
                position: 'absolute',
                top: isMajor ? 6 : 9,
                left: `${pct}%`,
                width: 1,
                height: isMajor ? 18 : 12,
                backgroundColor: isMajor
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.1)',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* 1000-year labels */}
        {LABEL_MARKERS.map((year) => (
          <div
            key={`label-${year}`}
            style={{
              position: 'absolute',
              top: 26,
              left: `${yearToPercent(year)}%`,
              transform: 'translateX(-50%)',
              fontSize: 8,
              color: year === 0 ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.25)',
              fontFamily: 'monospace',
              letterSpacing: '0.03em',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {year === 0 ? 'CE' : yearLabel(year)}
          </div>
        ))}

        {/* Active range highlight (visible window on screen) */}
        <div
          data-handle="range"
          onMouseDown={onRangeMouseDown}
          style={{
            position: 'absolute',
            top: 12,
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
            height: 8,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            cursor: 'grab',
            boxShadow: '0 0 10px rgba(59,130,246,0.5)',
            opacity: 0.85,
          }}
        />

        {/* Min handle (left edge — changes timeViewport) */}
        <div
          data-handle="min"
          onMouseDown={onMinMouseDown}
          style={{
            position: 'absolute',
            top: 6,
            left: `${minPct}%`,
            transform: 'translateX(-50%)',
            width: 18,
            height: 20,
            backgroundColor: '#60a5fa',
            borderRadius: 4,
            cursor: 'ew-resize',
            boxShadow: '0 0 8px rgba(96,165,250,0.6)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 2,
          }}
        />

        {/* Max handle (right edge — changes timeViewport) */}
        <div
          data-handle="max"
          onMouseDown={onMaxMouseDown}
          style={{
            position: 'absolute',
            top: 6,
            left: `${maxPct}%`,
            transform: 'translateX(-50%)',
            width: 18,
            height: 20,
            backgroundColor: '#60a5fa',
            borderRadius: 4,
            cursor: 'ew-resize',
            boxShadow: '0 0 8px rgba(96,165,250,0.6)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
