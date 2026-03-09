/**
 * ClusterNode.tsx
 *
 * Renders a cluster bubble for collapsed events at low zoom levels.
 * Displays a colored circle with the event count; clicking zooms the
 * time viewport to fit the cluster's year range, expanding the events.
 *
 * Owns: cluster visual rendering, click-to-zoom interaction, hover tooltip.
 * Does NOT own: clustering logic (see utils/cluster.ts), layout, or zoom state.
 */

import { memo, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CATEGORY_COLORS } from '../utils/categories';
import type { ClusterNode as ClusterNodeData, EventCategory } from '../types';
import { useAppStore } from '../store';

// ─────────────────────────────────────────────────────────────────────────────
// Size constants
// ─────────────────────────────────────────────────────────────────────────────

/** Radius in px for small clusters (2–5 events). */
const RADIUS_SMALL = 20;

/** Radius in px for medium clusters (6–20 events). */
const RADIUS_MEDIUM = 28;

/** Radius in px for large clusters (21+ events). */
const RADIUS_LARGE = 36;

/** Cluster count threshold for medium radius. */
const MEDIUM_THRESHOLD = 6;

/** Cluster count threshold for large radius. */
const LARGE_THRESHOLD = 21;

/** Minimum padding in years when zooming into a cluster. */
const MIN_ZOOM_PADDING_YEARS = 1;

/** Fraction of the cluster's year span used as padding. */
const ZOOM_PADDING_FRACTION = 0.2;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the circle radius based on the number of collapsed events.
 *
 * @param count - Number of events in the cluster.
 * @returns Radius in pixels.
 */
function clusterRadius(count: number): number {
  if (count >= LARGE_THRESHOLD) return RADIUS_LARGE;
  if (count >= MEDIUM_THRESHOLD) return RADIUS_MEDIUM;
  return RADIUS_SMALL;
}

/**
 * Format a year for display in the tooltip. BCE years are shown as
 * positive numbers with a "BCE" suffix.
 *
 * @param year - Historical year (negative = BCE).
 * @returns Formatted string (e.g. "3000 BCE", "1500").
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(Math.round(year))} BCE`;
  return `${Math.round(year)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ClusterNode — a circle bubble representing multiple collapsed events.
 * Shows the count in the center; colored by dominant category.
 * Clicking zooms the time viewport to the cluster's year range.
 *
 * @param props - ReactFlow NodeProps with ClusterNodeData payload.
 */
function ClusterNodeComponent({ data: rawData }: NodeProps) {
  const data = rawData as unknown as ClusterNodeData;
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);

  const radius = clusterRadius(data.count);
  const diameter = radius * 2;
  const color =
    CATEGORY_COLORS[data.dominantCategory as EventCategory] ?? '#6b7280';

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      setTooltipPos({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTooltipPos(null);
  }, []);

  /** Zoom the time viewport to fit this cluster's year range with padding. */
  const handleClick = useCallback(() => {
    const span = data.maxYear - data.minYear;
    const padding = Math.max(MIN_ZOOM_PADDING_YEARS, span * ZOOM_PADDING_FRACTION);
    setTimeViewport({
      yearMin: data.minYear - padding,
      yearMax: data.maxYear + padding,
    });
  }, [data.minYear, data.maxYear, setTimeViewport]);

  return (
    <div
      ref={nodeRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: 1,
        transition: 'opacity 0.2s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Hidden handles so ReactFlow doesn't warn about missing connection points */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />

      {/* Cluster bubble */}
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: `${color}cc`,
          border: hovered
            ? '2px solid rgba(255,255,255,0.8)'
            : '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hovered
            ? `0 0 ${radius}px ${color}88, 0 4px 12px rgba(0,0,0,0.5)`
            : `0 0 ${radius * 0.6}px ${color}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: 'all 0.2s ease',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontWeight: 700,
            fontSize: radius * 0.6,
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {data.count}
        </span>
      </div>

      {/* Hover tooltip — rendered as a portal */}
      {hovered &&
        tooltipPos &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'rgba(7,14,34,0.97)',
              border: `1px solid ${color}66`,
              borderRadius: 8,
              padding: '8px 12px',
              zIndex: 10000,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              fontSize: 13,
              color: '#e2e8f0',
              whiteSpace: 'nowrap',
            }}
          >
            {data.count} events · {formatYear(data.minYear)}–
            {formatYear(data.maxYear)}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default memo(ClusterNodeComponent);
