/**
 * TimelineMinimap.tsx — Fixed-position thumbnail showing the full timeline extent.
 *
 * Renders ALL events as tiny colored dots (2px circles) on a canvas element,
 * with a white/30% rectangle overlay showing the current viewport. Users can
 * click anywhere to jump to that era, or drag the viewport rectangle.
 *
 * Does NOT: fetch data (shares the react-query cache with NetworkView),
 *   own event selection, or control the scrubber range.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../store';
import { fetchTiles } from '../api/client';
import { CANVAS_CONSTANTS } from '../types';
import type { HistoricalEvent, EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAP_W = 200;
const MAP_H = 48;
const MARGIN = 8;
const DOT_RADIUS = 2;

const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

const FULL_VIEWPORT = {
  year_min: CANVAS_CONSTANTS.BASE_YEAR_MIN,
  year_max: CANVAS_CONSTANTS.BASE_YEAR_MAX,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

/** Category → dot color mapping. */
const CATEGORY_COLORS: Record<EventCategory | 'other', string> = {
  war: '#ef4444',
  discovery: '#3b82f6',
  political: '#a855f7',
  cultural: '#f97316',
  natural: '#22c55e',
  person: '#14b8a6',
  other: '#9ca3af',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * TimelineMinimap — a 200×48px fixed overlay in the bottom-right corner.
 *
 * Shows every event as a colored dot and highlights the current viewport as a
 * draggable white rectangle. Clicking jumps the ReactFlow camera to that year.
 *
 * @returns The minimap JSX, or null when hidden via store state.
 */
export default function TimelineMinimap() {
  const visible = useAppStore((s) => s.minimapVisible);
  const setVisible = useAppStore((s) => s.setMinimapVisible);
  const timeViewport = useAppStore((s) => s.timeViewport);
  const rfViewport = useAppStore((s) => s.rfViewport);
  const setRfViewport = useAppStore((s) => s.setPendingRfViewport);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startYearMin: number; startYearMax: number } | null>(null);

  // Fetch all events — shares cache with NetworkView (same queryKey)
  const { data: tileData } = useQuery({
    queryKey: ['network-tiles'],
    queryFn: () => fetchTiles(FULL_VIEWPORT),
    staleTime: 5 * 60_000,
  });

  const allEvents: HistoricalEvent[] = tileData?.events ?? [];

  // Compute global year extent from all events
  const yearExtent = allEvents.length > 0
    ? {
        min: Math.min(...allEvents.map((e) => e.year_approx)),
        max: Math.max(...allEvents.map((e) => e.year_approx)),
      }
    : { min: -5000, max: 2100 };

  // Add padding so edge dots aren't clipped
  const extentMin = yearExtent.min - 50;
  const extentMax = yearExtent.max + 50;
  const extentSpan = extentMax - extentMin;

  /** Map a year to minimap X pixel. */
  const yearToMiniX = useCallback(
    (year: number) => ((year - extentMin) / extentSpan) * MAP_W,
    [extentMin, extentSpan],
  );

  /** Map a minimap X pixel to a year. */
  const miniXToYear = useCallback(
    (px: number) => (px / MAP_W) * extentSpan + extentMin,
    [extentMin, extentSpan],
  );

  // ── Draw the minimap ────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // HiDPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = MAP_W * dpr;
    canvas.height = MAP_H * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, MAP_W, MAP_H);

    // Draw event dots
    for (const event of allEvents) {
      const x = yearToMiniX(event.year_approx);
      const color = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.other;
      ctx.beginPath();
      ctx.arc(x, MAP_H / 2, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Draw viewport rectangle
    const vpLeft = yearToMiniX(timeViewport.yearMin);
    const vpRight = yearToMiniX(timeViewport.yearMax);
    const vpWidth = Math.max(2, vpRight - vpLeft);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(vpLeft, 0, vpWidth, MAP_H);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpLeft, 0, vpWidth, MAP_H);
  }, [visible, allEvents, timeViewport, yearToMiniX]);

  // ── Click handler — jump to clicked year ────────────────────────────────

  /**
   * Handle click on the minimap canvas. Computes the target year from the
   * click position and re-centers the timeViewport around that year, keeping
   * the current span width.
   *
   * @param e - React mouse event on the canvas element.
   */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const localX = e.clientX - rect.left;
      const targetYear = miniXToYear(localX);
      const span = timeViewport.yearMax - timeViewport.yearMin;
      const halfSpan = span / 2;

      const newMin = Math.max(-5000, targetYear - halfSpan);
      const newMax = Math.min(2100, newMin + span);

      setTimeViewport({ yearMin: newMin, yearMax: newMax });

      // Also center the ReactFlow camera X on the target position
      const canvasFraction = (targetYear - newMin) / (newMax - newMin);
      const canvasTargetX = canvasFraction * CANVAS_WIDTH;
      const screenCenterX = window.innerWidth / 2;
      const newRfX = screenCenterX - canvasTargetX * rfViewport.zoom;

      setRfViewport({ x: newRfX, y: rfViewport.y, zoom: rfViewport.zoom });
    },
    [isDragging, miniXToYear, timeViewport, rfViewport, setTimeViewport, setRfViewport],
  );

  // ── Drag handler — drag the viewport rectangle ─────────────────────────

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const localX = e.clientX - rect.left;
      const vpLeft = yearToMiniX(timeViewport.yearMin);
      const vpRight = yearToMiniX(timeViewport.yearMax);

      // Only start drag if clicking inside the viewport rectangle
      if (localX >= vpLeft && localX <= vpRight) {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
          startX: e.clientX,
          startYearMin: timeViewport.yearMin,
          startYearMax: timeViewport.yearMax,
        };
      }
    },
    [yearToMiniX, timeViewport],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dx = e.clientX - dragStartRef.current.startX;
      const yearDelta = (dx / MAP_W) * extentSpan;
      const span = dragStartRef.current.startYearMax - dragStartRef.current.startYearMin;

      let newMin = dragStartRef.current.startYearMin + yearDelta;
      let newMax = newMin + span;

      // Clamp
      if (newMin < -5000) { newMin = -5000; newMax = newMin + span; }
      if (newMax > 2100) { newMax = 2100; newMin = newMax - span; }

      setTimeViewport({ yearMin: newMin, yearMax: newMax });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, extentSpan, setTimeViewport]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: MARGIN,
        right: MARGIN,
        width: MAP_W,
        height: MAP_H,
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
        zIndex: 30,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'pointer',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: MAP_W, height: MAP_H, display: 'block' }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      />

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); setVisible(false); }}
        title="Hide minimap"
        aria-label="Hide minimap"
        style={{
          position: 'absolute',
          top: 2,
          right: 4,
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          fontSize: 12,
          cursor: 'pointer',
          padding: '0 2px',
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}
