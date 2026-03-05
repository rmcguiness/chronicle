/**
 * NetworkTimeline.tsx
 *
 * Fixed horizontal timeline spine rendered at 50% viewport height.
 * Tick marks and year labels update dynamically based on the ReactFlow viewport
 * (pan + zoom), so the visible year range always matches the underlying canvas.
 *
 * Owned by NetworkView. Does NOT own layout, node data, or pan/zoom state.
 * Purely decorative — no pointer events, no interaction.
 */

import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants (must stay in sync with NetworkView layout)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_YEAR_MIN = CANVAS_CONSTANTS.BASE_YEAR_MIN; // -5000
const BASE_YEAR_MAX = CANVAS_CONSTANTS.BASE_YEAR_MAX; // 2100
const CANVAS_WIDTH = 15_000;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a historical year to a canvas-space X coordinate.
 *
 * @param year - Year (negative = BCE).
 * @returns X pixel on the 15 000 px canvas.
 */
function yearToCanvasX(year: number): number {
  return ((year - BASE_YEAR_MIN) / (BASE_YEAR_MAX - BASE_YEAR_MIN)) * CANVAS_WIDTH;
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

/** Viewport state forwarded from the parent (via `useViewport()`). */
export interface NetworkTimelineProps {
  viewport: { x: number; y: number; zoom: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NetworkTimeline — fixed overlay rendering a horizontal timeline spine with
 * adaptive tick marks and year labels.  Stays pinned at 50 % of the browser
 * viewport height regardless of canvas pan / zoom.
 *
 * @param props.viewport - Current ReactFlow viewport `{ x, y, zoom }`.
 */
export default function NetworkTimeline({ viewport }: NetworkTimelineProps) {
  const { x: vpX, zoom } = viewport;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;

  // ── coordinate conversions ──────────────────────────────────────────────

  /** Convert a screen-space X pixel to a historical year. */
  const screenToYear = (screenX: number): number =>
    ((screenX - vpX) / zoom / CANVAS_WIDTH) * (BASE_YEAR_MAX - BASE_YEAR_MIN) +
    BASE_YEAR_MIN;

  /** Convert a historical year to a screen-space X pixel. */
  const yearToScreenX = (year: number): number =>
    yearToCanvasX(year) * zoom + vpX;

  // ── visible range ───────────────────────────────────────────────────────

  const visibleYearMin = screenToYear(0);
  const visibleYearMax = screenToYear(screenWidth);

  // ── adaptive tick spacing ───────────────────────────────────────────────

  const yearSpan = visibleYearMax - visibleYearMin;
  const tickInterval =
    yearSpan > 3000
      ? 500
      : yearSpan > 1000
        ? 200
        : yearSpan > 400
          ? 100
          : 50;
  /** Major ticks (with label) are every 4th tick interval. */
  const labelInterval = tickInterval * 4;

  // ── generate ticks for visible range ────────────────────────────────────

  const firstTick = Math.ceil(visibleYearMin / tickInterval) * tickInterval;
  const ticks: number[] = [];
  for (let y = firstTick; y <= visibleYearMax; y += tickInterval) {
    ticks.push(y);
  }

  // ── render ──────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: 0,
        right: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Spine line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: 'rgba(96, 165, 250, 0.25)',
          boxShadow: '0 0 8px rgba(96, 165, 250, 0.15)',
        }}
      />

      {/* Tick marks + year labels */}
      <svg
        style={{
          position: 'absolute',
          top: -20,
          left: 0,
          width: '100%',
          height: 40,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        {ticks.map((year) => {
          const sx = yearToScreenX(year);
          // Skip ticks that fall outside the visible screen (plus small bleed)
          if (sx < -10 || sx > screenWidth + 10) return null;

          const isMajor = year % labelInterval === 0 || year === 0;
          const isZero = year === 0;

          return (
            <g key={year}>
              <line
                x1={sx}
                y1={isMajor ? -8 : -4}
                x2={sx}
                y2={isMajor ? 8 : 4}
                stroke={
                  isZero
                    ? 'rgba(251,191,36,0.6)'
                    : 'rgba(96,165,250,0.4)'
                }
                strokeWidth={isMajor ? 1.5 : 1}
              />
              {isMajor && (
                <text
                  x={sx}
                  y={18}
                  textAnchor="middle"
                  fill={
                    isZero
                      ? 'rgba(251,191,36,0.7)'
                      : 'rgba(148,163,184,0.6)'
                  }
                  fontSize={10}
                  fontFamily="monospace"
                >
                  {year < 0
                    ? `${Math.abs(year)} BCE`
                    : year === 0
                      ? 'CE'
                      : String(year)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
