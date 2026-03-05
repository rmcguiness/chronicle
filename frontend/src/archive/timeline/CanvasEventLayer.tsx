/**
 * CanvasEventLayer — HTML5 Canvas 2D overlay for rendering events.
 *
 * Replaces the deck.gl WebGL-based WebGLEventLayer with a plain Canvas 2D
 * renderer that works in all browsers without WebGPU/WebGL dependencies.
 * Renders events as colored circles and handles click hit-testing.
 *
 * Activated when visible event count > CANVAS_LAYER_THRESHOLD.
 */
import { useRef, useEffect, useCallback, useMemo } from 'react';

import type { HistoricalEvent, EventCategory } from '../types';
import { CANVAS_CONSTANTS } from '../types';
import { CATEGORY_COLORS } from '../utils/categories';
import { classifyRegion, regionBandIndex } from '../utils/categories';

const { BAND_HEIGHT, PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

/** Minimum event count to activate this canvas overlay layer. */
export const CANVAS_LAYER_THRESHOLD = 500;

/** Base radius for events with importance_score = 0. */
const MIN_RADIUS = 4;
/** Radius scale factor multiplied by importance_score. */
const RADIUS_SCALE = 14;
/** Fill opacity for event circles (0–1). */
const FILL_ALPHA = 0.82;
/** Stroke colour for event circle outlines. */
const STROKE_COLOR = 'rgba(255,255,255,0.3)';
/** Stroke width for event circle outlines in pixels. */
const STROKE_WIDTH = 1;

interface RFViewport {
  x: number;
  y: number;
  zoom: number;
}

interface Props {
  events: HistoricalEvent[];
  rfViewport: RFViewport;
  width: number;
  height: number;
  onEventClick: (event: HistoricalEvent) => void;
}

/**
 * Compute canvas-space position for an event (before viewport transform).
 */
function eventCanvasPos(event: HistoricalEvent): { cx: number; cy: number } {
  const cx = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
  const region = classifyRegion(event.lat, event.lng);
  const bandIdx = regionBandIndex(region);
  const bandTop = bandIdx * BAND_HEIGHT;
  const padding = 30;
  const usable = BAND_HEIGHT - 2 * padding;
  const lngNorm = Math.max(0, Math.min(1, (event.lng + 180) / 360));
  const cy = bandTop + padding + lngNorm * usable;
  return { cx, cy };
}

/** Compute pixel radius for an event. */
function eventRadius(event: HistoricalEvent): number {
  return Math.max(MIN_RADIUS, event.importance_score * RADIUS_SCALE);
}

/** Pre-computed event data for rendering and hit-testing. */
interface EventRenderData {
  event: HistoricalEvent;
  cx: number;
  cy: number;
  radius: number;
  color: string;
}

/**
 * CanvasEventLayer renders historical events as colored circles on an HTML5
 * Canvas 2D surface, absolutely positioned over the react-flow container.
 *
 * @param props.events - Array of events to render
 * @param props.rfViewport - Current react-flow viewport transform {x, y, zoom}
 * @param props.width - Container width in pixels
 * @param props.height - Container height in pixels
 * @param props.onEventClick - Callback when an event circle is clicked
 */
export default function CanvasEventLayer({
  events,
  rfViewport,
  width,
  height,
  onEventClick,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pre-compute canvas positions and colors (stable across viewport changes)
  const renderData = useMemo<EventRenderData[]>(
    () =>
      events.map((e) => {
        const { cx, cy } = eventCanvasPos(e);
        return {
          event: e,
          cx,
          cy,
          radius: eventRadius(e),
          color:
            CATEGORY_COLORS[e.category as EventCategory] ?? '#6b7280',
        };
      }),
    [events]
  );

  // Draw all events on viewport change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const { x: panX, y: panY, zoom } = rfViewport;

    // Batch by color to minimize state changes
    const byColor = new Map<string, EventRenderData[]>();
    for (const rd of renderData) {
      // Frustum culling: skip events outside the visible area
      const sx = rd.cx * zoom + panX;
      const sy = rd.cy * zoom + panY;
      if (sx < -rd.radius || sx > width + rd.radius) continue;
      if (sy < -rd.radius || sy > height + rd.radius) continue;

      let group = byColor.get(rd.color);
      if (!group) {
        group = [];
        byColor.set(rd.color, group);
      }
      group.push(rd);
    }

    ctx.lineWidth = STROKE_WIDTH;
    ctx.strokeStyle = STROKE_COLOR;
    ctx.globalAlpha = FILL_ALPHA;

    for (const [color, items] of byColor) {
      ctx.fillStyle = color;
      ctx.beginPath();
      for (const rd of items) {
        const sx = rd.cx * zoom + panX;
        const sy = rd.cy * zoom + panY;
        ctx.moveTo(sx + rd.radius, sy);
        ctx.arc(sx, sy, rd.radius, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.globalAlpha = FILL_ALPHA;
    }

    ctx.globalAlpha = 1;
  }, [renderData, rfViewport, width, height]);

  // Click hit-testing
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { x: panX, y: panY, zoom } = rfViewport;

      // Search in reverse order (top-most drawn last) for correct z-order
      for (let i = renderData.length - 1; i >= 0; i--) {
        const rd = renderData[i];
        const sx = rd.cx * zoom + panX;
        const sy = rd.cy * zoom + panY;
        const dx = mx - sx;
        const dy = my - sy;
        if (dx * dx + dy * dy <= rd.radius * rd.radius) {
          onEventClick(rd.event);
          return;
        }
      }
    },
    [renderData, rfViewport, onEventClick]
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          position: 'absolute',
          inset: 0,
          width,
          height,
          cursor: 'crosshair',
        }}
      />

      {/* Canvas 2D mode badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: '4px 10px',
          borderRadius: 6,
          backgroundColor: 'rgba(7,14,34,0.85)',
          border: '1px solid rgba(34,197,94,0.35)',
          fontSize: 11,
          color: '#4ade80',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        🎨 Canvas 2D · {events.length} events
      </div>
    </div>
  );
}
