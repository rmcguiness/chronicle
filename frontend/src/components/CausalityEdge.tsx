/**
 * CausalityEdge.tsx
 *
 * Custom react-flow edge component for cause→effect connections.
 *
 * Renders a bezier curve with a zoom-aware SVG arrowhead so the marker stays
 * visible down to the canvas minimum zoom (0.05).
 *
 * **Why a custom marker?**
 * React-flow's built-in `MarkerType.ArrowClosed` uses `markerUnits="strokeWidth"`,
 * which ties the arrowhead size to the SVG stroke width in canvas-coordinate
 * space.  The canvas is zoomed via CSS `transform: scale(zoom)`, so at zoom 0.05
 * a 1.5-unit stroke becomes 0.075 screen pixels — sub-pixel and invisible.
 *
 * **Fix:**
 * We render inline `<defs><marker markerUnits="userSpaceOnUse" …>` where
 * `markerWidth` and `markerHeight` equal `ARROW_SCREEN_PX / zoom`.  Because
 * `userSpaceOnUse` coordinates live in the same space as the edge path (before
 * CSS zoom), dividing by zoom keeps the rendered arrowhead a constant
 * `ARROW_SCREEN_PX` screen pixels regardless of zoom level.
 *
 * The stroke width and dash pattern are scaled by the same inverse-zoom factor
 * so every visual element of the edge stays legible at any zoom.
 *
 * Owns: edge visual rendering, hover label display.
 * Does NOT own: edge data (Canvas.tsx / linkToEdge), zoom state (read-only via useViewport).
 */

import { memo, useState } from 'react';
import {
  EdgeLabelRenderer,
  getBezierPath,
  useViewport,
  type EdgeProps,
} from '@xyflow/react';
import { CONNECTION_COLORS, CONNECTION_LABELS } from '../utils/categories';
import type { ConnectionType } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Desired arrowhead size in screen pixels, maintained at every zoom level. */
const ARROW_SCREEN_PX = 12;

/**
 * Minimum edge stroke width in screen pixels.
 * Prevents the edge from becoming sub-pixel at very low zoom.
 */
const MIN_STROKE_SCREEN_PX = 1.5;

/**
 * Hover hit-area width in screen pixels.
 * The invisible hit path is always this wide in screen space for easy interaction.
 */
const HIT_AREA_SCREEN_PX = 20;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CausalityEdgeData {
  connection_type: ConnectionType;
  strength: number;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CausalityEdge — zoom-aware bezier edge with a consistently visible arrowhead.
 *
 * All size values (marker, stroke, dash pattern, hit area) are scaled by
 * `1 / zoom` so they render at a fixed number of screen pixels regardless
 * of the current canvas zoom level.
 *
 * The `markerEnd` prop provided by react-flow is intentionally unused here;
 * this component manages its own SVG marker via inline `<defs>` to achieve
 * zoom-independent sizing.
 *
 * @param props - Standard react-flow EdgeProps
 */
function CausalityEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data: rawData,
}: EdgeProps) {
  const data = rawData as CausalityEdgeData | undefined;
  const [hovered, setHovered] = useState(false);

  // useViewport gives the live react-flow zoom without subscribing to the
  // global store or triggering parent re-renders.
  const { zoom } = useViewport();

  const connectionType: ConnectionType = data?.connection_type ?? 'leads_to';
  const color = CONNECTION_COLORS[connectionType] ?? '#6b7280';
  const strength = data?.strength ?? 0.5;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // ── Zoom-compensated sizes ─────────────────────────────────────────────────
  // All sizes below are in SVG user-space (canvas coordinates).
  // Dividing by effectiveZoom converts screen-pixel targets to canvas units,
  // so the CSS `transform: scale(zoom)` applied by react-flow restores them
  // to their intended screen size.
  //
  // Clamped to 0.01 to avoid division by zero at pathological zoom values.
  const effectiveZoom = Math.max(0.01, zoom);

  /** Stroke width: design value OR minimum screen size, whichever is larger. */
  const baseStrokeWidth = Math.max(1.5, strength * 4);
  const strokeWidth = Math.max(baseStrokeWidth, MIN_STROKE_SCREEN_PX / effectiveZoom);

  /**
   * Marker dimensions in SVG user-space.
   *
   * With `markerUnits="userSpaceOnUse"`, markerWidth/markerHeight are in the
   * same coordinate space as the edge path (before CSS zoom).  Dividing the
   * desired screen size by the current zoom gives canvas units that CSS zoom
   * scales back to the original screen size.
   *
   * Screen size = (ARROW_SCREEN_PX / zoom) × zoom = ARROW_SCREEN_PX  ✓
   */
  const markerSize = ARROW_SCREEN_PX / effectiveZoom;

  /** Unique marker id — SVG marker ids are scoped to the SVG element. */
  const markerId = `causality-arrow-${id}`;

  /**
   * Dash pattern for context-type edges, scaled so dash and gap remain
   * visible in screen space (target: 6 px dash / 3 px gap).
   */
  const dashArray =
    connectionType === 'context'
      ? `${6 / effectiveZoom} ${3 / effectiveZoom}`
      : undefined;

  /** Hit area stroke width in canvas units → HIT_AREA_SCREEN_PX on screen. */
  const hitAreaWidth = HIT_AREA_SCREEN_PX / effectiveZoom;

  return (
    <>
      {/*
       * Inline marker definition with `markerUnits="userSpaceOnUse"`.
       *
       * SVG spec allows <defs> anywhere inside an SVG document tree, including
       * inside <g> elements (which is where react-flow mounts edge components).
       * The marker id is unique per edge so concurrent edges never collide.
       *
       * Arrow geometry (closed triangle pointing right):
       *   - Left vertices: (0, 0) and (0, markerSize)
       *   - Tip:           (markerSize, markerSize/2)
       *   - refX=markerSize aligns the tip exactly with the path endpoint
       *   - refY=markerSize/2 centres the arrow on the path
       *   - orient="auto" rotates the marker to match the path direction
       */}
      <defs>
        <marker
          id={markerId}
          markerUnits="userSpaceOnUse"
          markerWidth={markerSize}
          markerHeight={markerSize}
          refX={markerSize}
          refY={markerSize / 2}
          orient="auto"
        >
          <path
            d={`M 0 0 L ${markerSize} ${markerSize / 2} L 0 ${markerSize} z`}
            fill={hovered ? '#ffffff' : color}
          />
        </marker>
      </defs>

      {/* Invisible wider hit area — keeps hover/click reliable at any zoom */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={hitAreaWidth}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/*
       * Visible edge path.
       * className="react-flow__edge-path" preserves react-flow's built-in
       * animated-edge CSS animation (marching-ants for `animated: true` edges).
       */}
      <path
        className="react-flow__edge-path"
        d={edgePath}
        fill="none"
        strokeDasharray={dashArray}
        markerEnd={`url(#${markerId})`}
        style={{
          stroke: hovered ? '#ffffff' : color,
          strokeWidth,
          opacity: hovered ? 1 : 0.7,
          filter: hovered ? `drop-shadow(0 0 4px ${color})` : undefined,
          transition: 'stroke 0.15s, opacity 0.15s',
          pointerEvents: 'none',
        }}
      />

      {/* Hover label — rendered via EdgeLabelRenderer to escape the SVG */}
      {hovered && data?.description && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${color}88`,
              borderRadius: 6,
              padding: '5px 10px',
              fontSize: 11,
              color: '#e2e8f0',
              maxWidth: 200,
              textAlign: 'center',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
          >
            <span style={{ color, fontWeight: 700, marginRight: 4 }}>
              {CONNECTION_LABELS[connectionType]}:
            </span>
            {data.description}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CausalityEdge);
