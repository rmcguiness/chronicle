/**
 * ClusterNode.tsx
 *
 * ReactFlow custom node rendered in the Macro (century) and Meso (decade) zoom
 * tiers.  Displays an event count badge and a time-bucket label (e.g. "1400s")
 * inside a pill-shaped container.  Clicking the node zooms the viewport to
 * frame the cluster's century or decade range within its region band.
 *
 * Responsibilities:
 *   - Render the cluster pill with count badge + bucket label
 *   - Scale the pill size proportionally to event count (logarithmic)
 *   - Zoom the ReactFlow viewport to fit the cluster's time range on click
 *
 * Does NOT:
 *   - Own clustering logic (that lives in utils/clustering.ts)
 *   - Manage global viewport / collapse state (Canvas.tsx / store)
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import type { ClusterNodeData } from '../utils/clustering';
import { CANVAS_CONSTANTS, REGIONS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Layout constants — no magic numbers in JSX
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN, BAND_HEIGHT } = CANVAS_CONSTANTS;

/** Minimum pill width in canvas pixels. Keeps single-event clusters readable. */
const MIN_PILL_WIDTH_PX = 56;

/** Maximum pill width cap so large clusters don't overflow their band. */
const MAX_PILL_WIDTH_PX = 240;

/** Log-scale factor used to expand width with event count. */
const LOG_WIDTH_FACTOR = 30;

/** Fixed pill height for Macro-tier (century) clusters. */
const MACRO_PILL_HEIGHT_PX = 44;

/** Fixed pill height for Meso-tier (decade) clusters. */
const MESO_PILL_HEIGHT_PX = 34;

/** Fractional padding added around the fit-bounds area when clicking. */
const FIT_BOUNDS_PADDING = 0.12;

/** Fly-in animation duration in milliseconds for cluster click. */
const FIT_BOUNDS_DURATION_MS = 600;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a region ID to its 0-based band index.
 *
 * Mirrors `regionBandIndex()` from categories.ts without creating a circular
 * import dependency.
 *
 * @param region - The region identifier.
 * @returns      0-based index into the REGIONS array.
 */
function regionBandIndex(region: ClusterNodeData['region']): number {
  const idx = REGIONS.findIndex((r) => r.id === region);
  return idx >= 0 ? idx : REGIONS.length - 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// ClusterNode component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom ReactFlow node component for Macro/Meso cluster nodes.
 *
 * Accepts {@link ClusterNodeData} via `NodeProps.data`.  On click, zooms the
 * ReactFlow viewport to frame the cluster's time range within its region band
 * using `reactFlow.fitBounds()`.
 *
 * Visual style:
 *   - Macro tier (centuries) — amber accent, taller pill
 *   - Meso tier (decades)   — cyan accent, shorter pill
 *
 * @param props - Standard ReactFlow {@link NodeProps}.
 */
function ClusterNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as ClusterNodeData;
  const reactFlow = useReactFlow();

  // ── Pill sizing ────────────────────────────────────────────────────────────
  // Logarithmic scaling: small clusters stay compact, large ones expand
  const rawWidth = LOG_WIDTH_FACTOR + Math.log1p(data.count) * LOG_WIDTH_FACTOR;
  const pillWidth = Math.min(MAX_PILL_WIDTH_PX, Math.max(MIN_PILL_WIDTH_PX, rawWidth));
  const pillHeight = data.tier === 'macro' ? MACRO_PILL_HEIGHT_PX : MESO_PILL_HEIGHT_PX;

  // ── Colour palette ─────────────────────────────────────────────────────────
  const accentColor = data.tier === 'macro' ? '#f59e0b' : '#22d3ee';
  const bgColor =
    data.tier === 'macro'
      ? 'rgba(245,158,11,0.14)'
      : 'rgba(34,211,238,0.11)';

  // ── Click: fit viewport to this cluster's time × band region ──────────────
  /**
   * Zoom the ReactFlow viewport to frame this cluster's time range + region
   * band with comfortable padding.  Uses `fitBounds` for an animated fly-in.
   */
  function handleClick() {
    const xMin = (data.yearStart - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    // yearEnd is inclusive, add 1 to reach the exclusive right boundary
    const xMax = (data.yearEnd + 1 - BASE_YEAR_MIN) * PIXELS_PER_YEAR;

    const bandIdx = regionBandIndex(data.region);
    const yMin = bandIdx * BAND_HEIGHT;
    const yMax = yMin + BAND_HEIGHT;

    reactFlow.fitBounds(
      { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin },
      { duration: FIT_BOUNDS_DURATION_MS, padding: FIT_BOUNDS_PADDING },
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      onClick={handleClick}
      title={`${data.count} event${data.count !== 1 ? 's' : ''} · ${data.bucketLabel} · click to zoom in`}
    >
      {/* Invisible handles so edges can still attach if needed */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, width: 1, height: 1, minWidth: 1 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, width: 1, height: 1, minWidth: 1 }}
      />

      {/* Pill body */}
      <div
        style={{
          width: pillWidth,
          height: pillHeight,
          borderRadius: pillHeight / 2,
          backgroundColor: bgColor,
          border: selected
            ? `2px solid ${accentColor}`
            : `1.5px solid ${accentColor}55`,
          boxShadow: selected
            ? `0 0 18px ${accentColor}55, 0 4px 14px rgba(0,0,0,0.5)`
            : `0 0 8px ${accentColor}28, 0 2px 8px rgba(0,0,0,0.4)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          transition: 'all 0.15s ease',
          transform: selected ? 'scale(1.08)' : 'scale(1)',
          backdropFilter: 'blur(4px)',
          userSelect: 'none',
        }}
      >
        {/* Count badge — primary focus */}
        <span
          style={{
            fontSize: data.tier === 'macro' ? 16 : 13,
            fontWeight: 800,
            color: accentColor,
            lineHeight: 1,
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
          }}
        >
          {data.count}
        </span>

        {/* Bucket label — secondary context */}
        <span
          style={{
            fontSize: data.tier === 'macro' ? 9 : 8,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: '"JetBrains Mono","Fira Code",monospace',
            lineHeight: 1,
          }}
        >
          {data.bucketLabel}
        </span>
      </div>
    </div>
  );
}

export default memo(ClusterNode);
