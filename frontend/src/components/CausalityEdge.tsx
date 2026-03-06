/**
 * CausalityEdge.tsx
 *
 * Custom ReactFlow edge for causality links between historical events.
 * Renders a bezier curve with connection-type colour coding and directional
 * animation (left-to-right for "causes" type). Hover reveals connection
 * type, description, and strength — no persistent label on the edge itself.
 *
 * Uses floating edge logic: EventNode handles are centred on each node, so
 * sourceX/sourceY and targetX/targetY arrive as node-centre canvas coords.
 * This component offsets those coords to the circle border before drawing,
 * producing clean lines that exit/enter nodes from the nearest border point.
 *
 * Owns: edge rendering, label display, hover tooltip, animation,
 *       floating border-exit/entry point computation.
 * Does NOT own: edge data structure, connection colours, layout positioning.
 */

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  useInternalNode,
  useStore,
  type EdgeProps,
} from '@xyflow/react';
import { CONNECTION_COLORS, CONNECTION_LABELS } from '../utils/categories';
import type { ConnectionType } from '../types';

/** Minimum stroke width in screen pixels, prevents edges from vanishing at low zoom. */
const MIN_STROKE_WIDTH_PX = 2;

/** Dash array length for the animated "causes" edges. */
const CAUSES_DASH_LENGTH = 10;

/** Animation speed for the "causes" edge pulse (seconds per cycle). */
const CAUSES_ANIMATION_SPEED = 0.8;

/**
 * Fallback radius when a node's measured dimensions are not yet available.
 * Matches the mid-range of EventNode's NODE_SIZE_BASE + importance range.
 */
const DEFAULT_NODE_RADIUS = 30;

interface CausalityEdgeData {
  connection_type: ConnectionType;
  strength: number;
  description?: string;
}

/**
 * Maps an angle (degrees, standard math convention) to the ReactFlow Position
 * that best represents that exit direction for bezier control point generation.
 *
 * @param angleDeg - Angle in degrees: 0 = right, 90 = down, 180/-180 = left, -90 = up.
 * @returns The closest cardinal Position for bezier curve shaping.
 */
function angleToPosition(angleDeg: number): Position {
  // Normalise to [-180, 180]
  const a = ((angleDeg % 360) + 360) % 360;
  const norm = a > 180 ? a - 360 : a;

  if (norm >= -45 && norm < 45) return Position.Right;
  if (norm >= 45 && norm < 135) return Position.Bottom;
  if (norm >= -135 && norm < -45) return Position.Top;
  return Position.Left;
}

/**
 * CausalityEdge — custom edge component for causality links.
 *
 * Floating edge logic: since EventNode places handles at the node centre,
 * sourceX/sourceY and targetX/targetY are the centre canvas coords. This
 * component offsets each endpoint outward by the node's circle radius so
 * edges appear to originate from and terminate at the node border.
 */
function CausalityEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data: rawData,
  markerEnd,
}: EdgeProps) {
  const data = rawData as CausalityEdgeData | undefined;
  const [hovered, setHovered] = useState(false);

  // Retrieve measured node sizes for accurate border-intersection computation.
  // useInternalNode re-renders this edge only when the specific node changes.
  // Both width and height are needed: circle nodes have width === height, but
  // pill (stretched) nodes have width > height, requiring ellipse math.
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const DEFAULT_DIAMETER = DEFAULT_NODE_RADIUS * 2;
  const srcA = (sourceNode?.measured?.width  ?? DEFAULT_DIAMETER) / 2; // semi-major axis
  const srcB = (sourceNode?.measured?.height ?? DEFAULT_DIAMETER) / 2; // semi-minor axis
  const tgtA = (targetNode?.measured?.width  ?? DEFAULT_DIAMETER) / 2;
  const tgtB = (targetNode?.measured?.height ?? DEFAULT_DIAMETER) / 2;

  const connectionType: ConnectionType = data?.connection_type ?? 'leads_to';
  const color = CONNECTION_COLORS[connectionType] ?? '#6b7280';
  const label = CONNECTION_LABELS[connectionType] ?? connectionType;
  const strength = data?.strength ?? 0.5;
  const zoom = useStore((s) => s.transform[2]);

  // Direction vector from source centre to target centre.
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1; // guard against zero-length
  const nx = dx / dist; // normalised x component
  const ny = dy / dist; // normalised y component

  /**
   * Ellipse border intersection: for a unit direction vector (nx, ny) from the
   * centre of an ellipse with semi-axes (a, b), the border point is at distance
   *   t = 1 / sqrt((nx/a)² + (ny/b)²)
   * For circles (a === b === r) this reduces to t = r, matching the old formula.
   * A small guard prevents division by zero on zero-length edges.
   */
  const DIVISION_GUARD = 1e-9;
  const sourceOffset = 1 / Math.sqrt((nx / srcA) ** 2 + (ny / srcB) ** 2 + DIVISION_GUARD);
  const targetOffset = 1 / Math.sqrt((nx / tgtA) ** 2 + (ny / tgtB) ** 2 + DIVISION_GUARD);

  // Offset endpoints to the actual node borders.
  const floatSourceX = sourceX + nx * sourceOffset;
  const floatSourceY = sourceY + ny * sourceOffset;
  const floatTargetX = targetX - nx * targetOffset;
  const floatTargetY = targetY - ny * targetOffset;

  // Derive bezier handle directions from the exit angle so the curve never
  // folds back on itself regardless of relative node positions.
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const srcPosition = angleToPosition(angleDeg);
  const tgtPosition = angleToPosition(angleDeg + 180);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: floatSourceX,
    sourceY: floatSourceY,
    sourcePosition: srcPosition,
    targetX: floatTargetX,
    targetY: floatTargetY,
    targetPosition: tgtPosition,
  });

  // Compensate stroke width so it never falls below MIN_STROKE_WIDTH_PX on screen.
  // ReactFlow applies the zoom transform to the SVG, so we divide by zoom.
  const baseStrokeWidth = Math.max(1.5, strength * 4);
  const strokeWidth = Math.max(baseStrokeWidth, MIN_STROKE_WIDTH_PX / zoom);

  const isCauses = connectionType === 'causes';
  const isContext = connectionType === 'context';

  return (
    <>
      {/* Invisible wider hit area for hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {/* Glow layer for better visibility on dark background */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={hovered ? 0.25 : 0.1}
        style={{
          pointerEvents: 'none',
          filter: 'blur(3px)',
          transition: 'stroke-opacity 0.15s',
        }}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd as string}
        style={{
          stroke: hovered ? '#ffffff' : color,
          strokeWidth: hovered ? strokeWidth + 1 : strokeWidth,
          strokeDasharray: isCauses
            ? `${CAUSES_DASH_LENGTH} ${CAUSES_DASH_LENGTH * 0.6}`
            : isContext
              ? '6 3'
              : undefined,
          // Animate dash offset for "causes" type — pulses in the direction of causation
          animation: isCauses
            ? `causality-flow ${CAUSES_ANIMATION_SPEED}s linear infinite`
            : undefined,
          opacity: hovered ? 1 : 0.8,
          filter: hovered ? `drop-shadow(0 0 6px ${color})` : undefined,
          transition: 'stroke 0.15s, opacity 0.15s',
          pointerEvents: 'none',
        }}
      />

      {/* Hover tooltip — shows connection type + optional description */}
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -130%) translate(${labelX}px,${labelY}px)`,
              background: 'rgba(15, 23, 42, 0.97)',
              border: `1px solid ${color}66`,
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 11,
              color: '#e2e8f0',
              maxWidth: 220,
              textAlign: 'center',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
              zIndex: 999,
              lineHeight: 1.4,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: data?.description ? 4 : 0,
              }}
            >
              {label}
            </div>
            {data?.description && <div>{data.description}</div>}
            {data?.strength != null && (
              <div style={{ marginTop: 4, fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                Strength: {Math.round(data.strength * 100)}%
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CausalityEdge);
