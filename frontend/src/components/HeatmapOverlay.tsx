/**
 * HeatmapOverlay.tsx
 *
 * Semi-transparent horizontal band showing event density across time periods.
 * Positioned at the top of the viewport, fixed to the screen (not the flow
 * canvas), so it stays in place during pan/zoom.
 *
 * Color scale: cool blue (sparse) -> yellow -> hot red (dense).
 * Hover tooltip shows event count and year range per bucket.
 *
 * Owns: bucket computation, color interpolation, rendering.
 * Does NOT own: toggle state (read from store), node data (passed as prop).
 */

import { useState, useMemo } from 'react';
import type { Node } from '@xyflow/react';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Height of the heatmap band in pixels. */
const HEATMAP_HEIGHT_PX = 40;

/** Width of each time bucket in years. */
const BUCKET_YEARS = 50;

/** Opacity of the heatmap overlay. */
const HEATMAP_OPACITY = 0.55;

/** Color stops for the density scale. */
const COLOR_COLD: [number, number, number] = [59, 130, 246];   // blue
const COLOR_MID: [number, number, number] = [234, 179, 8];     // yellow
const COLOR_HOT: [number, number, number] = [239, 68, 68];     // red

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Props for the HeatmapOverlay component. */
interface HeatmapOverlayProps {
  /** ReactFlow nodes currently rendered on the canvas. */
  nodes: Node[];
  /** ReactFlow viewport transform (x, y, zoom). */
  viewport: { x: number; y: number; zoom: number };
  /** The visible year range from the time viewport. */
  yearMin: number;
  /** The visible year range from the time viewport. */
  yearMax: number;
}

/** A single density bucket with its computed metadata. */
interface Bucket {
  /** Start year of the bucket (inclusive). */
  yearStart: number;
  /** End year of the bucket (exclusive). */
  yearEnd: number;
  /** Number of events in this bucket. */
  count: number;
  /** Normalized density value in [0, 1]. */
  normalized: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

/**
 * Linearly interpolate between two RGB colors.
 */
function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

/**
 * Map a normalized value [0, 1] to a color on the blue -> yellow -> red scale.
 */
function densityColor(normalized: number): string {
  if (normalized <= 0.5) {
    return lerpColor(COLOR_COLD, COLOR_MID, normalized * 2);
  }
  return lerpColor(COLOR_MID, COLOR_HOT, (normalized - 0.5) * 2);
}

/**
 * Format a year as a human-readable label (e.g. "3000 BCE", "1850 CE").
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/**
 * Convert a canvas X coordinate to a screen X pixel using the viewport transform.
 */
function canvasXToScreen(
  canvasX: number,
  viewport: { x: number; zoom: number },
): number {
  return canvasX * viewport.zoom + viewport.x;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * HeatmapOverlay renders a semi-transparent density band at the top of the
 * viewport, showing how many events fall into each 50-year time bucket.
 * Blue = sparse, yellow = moderate, red = dense.
 */
export default function HeatmapOverlay({
  nodes,
  viewport,
  yearMin,
  yearMax,
}: HeatmapOverlayProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Compute buckets from node X positions
  const buckets: Bucket[] = useMemo(() => {
    const span = yearMax - yearMin;
    if (span <= 0 || nodes.length === 0) return [];

    // Determine bucket boundaries across the full year range
    const bucketStart = Math.floor(yearMin / BUCKET_YEARS) * BUCKET_YEARS;
    const bucketEnd = Math.ceil(yearMax / BUCKET_YEARS) * BUCKET_YEARS;
    const numBuckets = Math.round((bucketEnd - bucketStart) / BUCKET_YEARS);

    // Count events per bucket using node canvas X -> year mapping
    const counts = new Array<number>(numBuckets).fill(0);
    for (const node of nodes) {
      const canvasX = node.position.x;
      // Map canvas X back to year
      const year = yearMin + (canvasX / CANVAS_WIDTH) * span;
      const idx = Math.floor((year - bucketStart) / BUCKET_YEARS);
      if (idx >= 0 && idx < numBuckets) {
        counts[idx]++;
      }
    }

    const maxCount = Math.max(...counts, 1);

    return counts.map((count, i) => ({
      yearStart: bucketStart + i * BUCKET_YEARS,
      yearEnd: bucketStart + (i + 1) * BUCKET_YEARS,
      count,
      normalized: count / maxCount,
    }));
  }, [nodes, yearMin, yearMax]);

  if (buckets.length === 0) return null;

  const span = yearMax - yearMin;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEATMAP_HEIGHT_PX,
        opacity: HEATMAP_OPACITY,
        zIndex: 10,
        display: 'flex',
        pointerEvents: 'auto',
      }}
    >
      {buckets.map((bucket, i) => {
        // Map bucket year boundaries to screen pixels via canvas -> screen transform
        const bucketCanvasXStart =
          ((bucket.yearStart - yearMin) / span) * CANVAS_WIDTH;
        const bucketCanvasXEnd =
          ((bucket.yearEnd - yearMin) / span) * CANVAS_WIDTH;

        const screenLeft = canvasXToScreen(bucketCanvasXStart, viewport);
        const screenRight = canvasXToScreen(bucketCanvasXEnd, viewport);
        const width = screenRight - screenLeft;

        // Skip buckets that are off-screen
        if (screenRight < 0 || screenLeft > window.innerWidth || width < 0.5) {
          return null;
        }

        return (
          <div
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: 'absolute',
              left: screenLeft,
              width,
              height: HEATMAP_HEIGHT_PX,
              backgroundColor: densityColor(bucket.normalized),
              cursor: 'default',
            }}
          >
            {hoveredIdx === i && bucket.count > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: HEATMAP_HEIGHT_PX + 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(15, 17, 23, 0.95)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#e2e8f0',
                  fontSize: 11,
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                  pointerEvents: 'none',
                }}
              >
                {bucket.count} event{bucket.count !== 1 ? 's' : ''} |{' '}
                {formatYear(bucket.yearStart)}–{formatYear(bucket.yearEnd)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
