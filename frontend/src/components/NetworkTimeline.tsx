/**
 * NetworkTimeline.tsx
 *
 * Fixed horizontal timeline spine rendered at 50% viewport height.
 * Tick marks and year labels update dynamically based on the ReactFlow viewport
 * (pan + zoom), so the visible year range always matches the underlying canvas.
 *
 * Zoom-aware label levels:
 *   zoom < 0.15  → century labels
 *   0.15 – 0.4   → decade labels
 *   0.4 – 1.5    → year labels (adaptive density)
 *   1.5 – 5      → fine year labels with single-year ticks
 *   > 5          → month labels
 *
 * Owned by NetworkView. Does NOT own layout, node data, or pan/zoom state.
 * Purely decorative — no pointer events, no interaction.
 */

import {
  screenToYear,
  yearToScreenX,
  getTickLevel,
  generateTicks,
} from '../utils/timeScale';

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

  // ── visible range ───────────────────────────────────────────────────────

  const visibleYearMin = screenToYear(0, vpX, zoom);
  const visibleYearMax = screenToYear(screenWidth, vpX, zoom);

  // ── zoom-aware tick level ──────────────────────────────────────────────

  const tickLevel = getTickLevel(zoom);

  // Generate major ticks (labelled)
  const majorTicks = generateTicks(
    visibleYearMin,
    visibleYearMax,
    tickLevel.majorInterval,
  );

  // Generate minor ticks
  const minorTicks = generateTicks(
    visibleYearMin,
    visibleYearMax,
    tickLevel.minorInterval,
  );

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
        {/* Minor ticks (no labels) */}
        {minorTicks.map((year) => {
          const sx = yearToScreenX(year, vpX, zoom);
          if (sx < -10 || sx > screenWidth + 10) return null;

          // Skip if this tick falls on a major tick position
          const onMajor =
            tickLevel.majorInterval >= 1
              ? Math.abs(year % tickLevel.majorInterval) < 0.001
              : Math.abs((year - Math.round(year)) * 12 % (tickLevel.majorInterval * 12)) < 0.01;
          if (onMajor) return null;

          return (
            <line
              key={`m-${year}`}
              x1={sx}
              y1={-4}
              x2={sx}
              y2={4}
              stroke="rgba(96,165,250,0.25)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Major ticks (with labels) */}
        {majorTicks.map((year) => {
          const sx = yearToScreenX(year, vpX, zoom);
          if (sx < -10 || sx > screenWidth + 10) return null;

          const isZero = Math.abs(year) < 0.001;

          return (
            <g key={`M-${year}`}>
              <line
                x1={sx}
                y1={-8}
                x2={sx}
                y2={8}
                stroke={
                  isZero
                    ? 'rgba(251,191,36,0.6)'
                    : 'rgba(96,165,250,0.4)'
                }
                strokeWidth={1.5}
              />
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
                {tickLevel.formatLabel(year)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
