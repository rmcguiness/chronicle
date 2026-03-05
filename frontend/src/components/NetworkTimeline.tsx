/**
 * NetworkTimeline.tsx
 *
 * Fixed horizontal timeline spine rendered at 50% viewport height.
 * Tick marks and year labels update dynamically based on the ReactFlow viewport
 * (pan + zoom) AND the scrubber year range from the Zustand store.
 *
 * The dynamic mapping means the full CANVAS_WIDTH always represents the
 * scrubber's [yearMin, yearMax] range. When combined with ReactFlow's
 * pan/zoom (vpX, rfZoom), we can compute exact screen positions for any year.
 *
 * Tick intervals adapt from centuries down to individual days based on the
 * visible year span on screen.
 *
 * Owned by NetworkView. Does NOT own layout, node data, or pan/zoom state.
 * Purely decorative — no pointer events, no interaction.
 */

import { useAppStore } from '../store';

// ─────────────────────────────────────────────────────────────────────────────
// Constants (must stay in sync with NetworkView layout)
// ─────────────────────────────────────────────────────────────────────────────

/** Total canvas width in pixels — matches NetworkView's CANVAS_WIDTH. */
const CANVAS_WIDTH = 15_000;

/** Maximum number of ticks to render — prevents runaway loops. */
const MAX_TICK_COUNT = 2000;

// ─────────────────────────────────────────────────────────────────────────────
// Tick interval thresholds — each entry defines when to use which spacing.
// Ordered from largest to smallest visible span.
// ─────────────────────────────────────────────────────────────────────────────

/** Major/minor tick intervals keyed by the minimum visible year span. */
interface TickLevel {
  /** Minimum visible year span for this level to apply. */
  minSpan: number;
  /** Year interval between major ticks (labelled). */
  major: number;
  /** Year interval between minor ticks (unlabelled). */
  minor: number;
}

const TICK_LEVELS: TickLevel[] = [
  { minSpan: 2000, major: 500, minor: 100 },
  { minSpan: 500,  major: 100, minor: 50 },
  { minSpan: 100,  major: 50,  minor: 10 },
  { minSpan: 20,   major: 10,  minor: 5 },
  { minSpan: 5,    major: 5,   minor: 1 },
  { minSpan: 1,    major: 1,   minor: 0.25 },
  { minSpan: 0.1,  major: 1 / 12, minor: 1 / 52 },
  { minSpan: 0,    major: 1 / 52, minor: 1 / 365 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Label formatting helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Short month names for sub-year label formatting. */
const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Format a fractional year as a human-readable tick label.
 * Adapts from "3000 BCE" / "1500" for whole years to "Mar 1939" for months
 * to "Mar 15" for sub-month precision.
 *
 * @param fractionalYear - The year value (may have fractional component).
 * @param tickInterval   - The current minor tick interval, used to pick format.
 * @returns Formatted label string.
 */
function formatTickLabel(fractionalYear: number, tickInterval: number): string {
  const absYear = Math.abs(fractionalYear);
  const wholeYear = Math.trunc(fractionalYear);
  const frac = fractionalYear - wholeYear;

  // Sub-month precision: show "Mon DD"
  if (tickInterval < 1 / 12) {
    const monthIdx = Math.floor(Math.abs(frac) * 12);
    const dayInMonth = Math.round((Math.abs(frac) * 12 - monthIdx) * 30) + 1;
    const month = MONTH_NAMES[Math.min(monthIdx, 11)];
    return `${month} ${dayInMonth}`;
  }

  // Month precision: show "Mon YYYY"
  if (tickInterval <= 0.25) {
    const monthIdx = Math.round(Math.abs(frac) * 12);
    const month = MONTH_NAMES[Math.min(monthIdx, 11)];
    const yearLabel = fractionalYear < 0
      ? `${Math.abs(wholeYear)} BCE`
      : `${wholeYear}`;
    return `${month} ${yearLabel}`;
  }

  // Whole-year precision
  if (fractionalYear < 0) return `${Math.round(absYear)} BCE`;
  if (Math.abs(fractionalYear) < 0.5) return 'CE';
  return `${Math.round(fractionalYear)}`;
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
 * Uses the scrubber's year range (from Zustand store) combined with the
 * ReactFlow transform to compute screen positions. Tick intervals adapt
 * from centuries down to individual days based on the visible span.
 *
 * @param props.viewport - Current ReactFlow viewport `{ x, y, zoom }`.
 */
export default function NetworkTimeline({ viewport }: NetworkTimelineProps) {
  const { x: vpX, zoom: rfZoom } = viewport;
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;

  // Subscribe to the scrubber year range from the Zustand store
  const yearMin = useAppStore((s) => s.viewport.year_min);
  const yearMax = useAppStore((s) => s.viewport.year_max);
  const span = yearMax - yearMin;

  // ── coordinate conversions (dynamic mapping) ────────────────────────────

  /**
   * Convert a historical year to a screen-space X pixel.
   * Uses the dynamic mapping where CANVAS_WIDTH represents [yearMin, yearMax].
   */
  const yearToScreenX = (year: number): number => {
    if (span <= 0) return 0;
    const canvasX = ((year - yearMin) / span) * CANVAS_WIDTH;
    return canvasX * rfZoom + vpX;
  };

  // ── visible year range on screen ────────────────────────────────────────

  const visibleYearMin = span > 0
    ? ((-vpX) / rfZoom / CANVAS_WIDTH) * span + yearMin
    : yearMin;
  const visibleYearMax = span > 0
    ? ((screenWidth - vpX) / rfZoom / CANVAS_WIDTH) * span + yearMin
    : yearMax;
  const visibleSpan = visibleYearMax - visibleYearMin;

  // ── adaptive tick spacing ───────────────────────────────────────────────

  let majorInterval: number;
  let minorInterval: number;

  // Find the appropriate tick level for the current visible span
  const level = TICK_LEVELS.find((l) => visibleSpan > l.minSpan) ?? TICK_LEVELS[TICK_LEVELS.length - 1];
  majorInterval = level.major;
  minorInterval = level.minor;

  // ── generate ticks for visible range ────────────────────────────────────

  const ticks: { year: number; isMajor: boolean }[] = [];

  if (minorInterval > 0 && visibleSpan > 0) {
    const firstTick = Math.ceil(visibleYearMin / minorInterval) * minorInterval;
    let count = 0;
    for (let y = firstTick; y <= visibleYearMax && count < MAX_TICK_COUNT; y += minorInterval) {
      // Determine if this tick is a major tick
      // Use a small epsilon for floating-point modulo comparison
      const modResult = Math.abs(y % majorInterval);
      const isMajor =
        modResult < majorInterval * 0.01 ||
        modResult > majorInterval * 0.99 ||
        Math.abs(y) < minorInterval * 0.5; // year 0 / CE
      ticks.push({ year: y, isMajor });
      count++;
    }
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
        {ticks.map(({ year, isMajor }) => {
          const sx = yearToScreenX(year);
          // Skip ticks that fall outside the visible screen (plus small bleed)
          if (sx < -10 || sx > screenWidth + 10) return null;

          const isZero = Math.abs(year) < minorInterval * 0.5;

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
                  {formatTickLabel(year, minorInterval)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
