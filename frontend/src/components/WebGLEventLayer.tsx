/**
 * WebGLEventLayer.tsx
 *
 * GPU-accelerated event rendering fallback using deck.gl ScatterplotLayer.
 *
 * Activated when visible node count > GL_THRESHOLD. Renders events as
 * GPU-accelerated circles using OrthographicView so that 1 world unit = 1
 * screen pixel, letting us pre-project canvas→screen coords before passing
 * to the GPU.
 *
 * ReactFlow viewport transform: { x (pan), y (pan), zoom (scale) }
 * Canvas → screen:  screenX = canvasX * zoom + panX
 *                   screenY = canvasY * zoom + panY
 *
 * Owns:  GPU circle rendering, WebGL mode badge
 * Does NOT own: event data fetching, zoom/pan state, node selection details
 */

import { useMemo, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { OrthographicView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';

import type { HistoricalEvent } from '../types';
import { CANVAS_CONSTANTS } from '../types';
import { CATEGORY_COLORS } from '../utils/categories';

const { LAT_MAX, LAT_MIN, CANVAS_HEIGHT, PIXELS_PER_YEAR, BASE_YEAR_MIN } =
  CANVAS_CONSTANTS;

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Event count threshold above which WebGL rendering is activated.
 * Set high enough that the current dataset stays in ReactFlow mode.
 * deck.gl 9.x probes WebGPU at init regardless of deviceProps, which crashes
 * browsers without WebGPU support. ReactFlow handles <500 nodes fine without GPU.
 */
export const GL_THRESHOLD = 500;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

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

/** Projected event data passed to the ScatterplotLayer. */
interface ProjectedEvent {
  event: HistoricalEvent;
  pos: [number, number, number];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a hex colour string to an [r, g, b] tuple.
 *
 * @param hex - Hex colour string (with or without leading #)
 * @returns RGB components as integers [0–255]
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

/**
 * Convert a HistoricalEvent's canvas position to screen coordinates,
 * given the current ReactFlow viewport transform.
 *
 * @param event     - The event to project.
 * @param rfViewport - Current pan/zoom state from ReactFlow.
 * @returns Screen-space [x, y, z=0] position for deck.gl.
 */
function toScreenPos(
  event: HistoricalEvent,
  { x: panX, y: panY, zoom }: RFViewport,
): [number, number, number] {
  const canvasX = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
  const fraction = (LAT_MAX - event.lat) / (LAT_MAX - LAT_MIN);
  const canvasY = fraction * CANVAS_HEIGHT;
  return [canvasX * zoom + panX, canvasY * zoom + panY, 0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GPU-accelerated event layer rendered as a transparent overlay above the
 * ReactFlow canvas. Only mounted when event count exceeds GL_THRESHOLD.
 *
 * @param events       - Visible events to render (collapsed bands pre-filtered).
 * @param rfViewport   - Current ReactFlow pan/zoom transform.
 * @param width        - Container width in px.
 * @param height       - Container height in px.
 * @param onEventClick - Called with the clicked event when the user taps a circle.
 */
export default function WebGLEventLayer({
  events,
  rfViewport,
  width,
  height,
  onEventClick,
}: Props) {
  // Re-project events whenever the rfViewport changes
  const projected = useMemo<ProjectedEvent[]>(
    () =>
      events.map((e) => ({
        event: e,
        pos: toScreenPos(e, rfViewport),
      })),
    [events, rfViewport],
  );

  const layer = new ScatterplotLayer<ProjectedEvent>({
    id: 'events-webgl',
    data: projected,
    getPosition: (d) => d.pos,
    getRadius: (d) => Math.max(4, d.event.importance_score * 14),
    radiusUnits: 'pixels',
    getFillColor: (d) => {
      const hex =
        CATEGORY_COLORS[d.event.category as keyof typeof CATEGORY_COLORS] ??
        '#6b7280';
      const [r, g, b] = hexToRgb(hex);
      return [r, g, b, 210];
    },
    getLineColor: [255, 255, 255, 80],
    lineWidthMinPixels: 1,
    stroked: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 255, 60],
    updateTriggers: {
      getPosition: rfViewport,
    },
  });

  const handleClick = useCallback(
    (info: PickingInfo) => {
      const d = info.object as ProjectedEvent | null;
      if (d?.event) onEventClick(d.event);
    },
    [onEventClick],
  );

  // OrthographicView with 1:1 pixel mapping — world origin at top-left
  const view = new OrthographicView({
    id: 'ortho',
    flipY: false,
  });

  const viewState = {
    target: [width / 2, height / 2, 0] as [number, number, number],
    zoom: 0,
    minZoom: 0,
    maxZoom: 0,
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 5,
        pointerEvents: 'auto',
      }}
    >
      <DeckGL
        width={width}
        height={height}
        views={view}
        viewState={viewState}
        controller={false}
        layers={[layer]}
        onClick={handleClick}
        style={{ position: 'absolute', inset: '0' }}
        getCursor={({ isDragging }) => (isDragging ? 'grabbing' : 'crosshair')}
        // Force WebGL1 to avoid deck.gl 9.x WebGPU probe crash on unsupported browsers
        deviceProps={{ type: 'webgl' }}
      />

      {/* WebGL mode indicator badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          padding: '4px 10px',
          borderRadius: 6,
          backgroundColor: 'rgba(7,14,34,0.85)',
          border: '1px solid rgba(59,130,246,0.35)',
          fontSize: 11,
          color: '#60a5fa',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ⚡ WebGL tier active · {events.length} events
      </div>
    </div>
  );
}
