/**
 * CausalityEdge.tsx
 *
 * Custom ReactFlow edge for causality links between historical events.
 * Renders a bezier curve with connection-type colour coding and directional
 * animation (left-to-right for "causes" type). Hover reveals connection
 * type, description, and strength — no persistent label on the edge itself.
 *
 * Owns: edge rendering, label display, hover tooltip, animation.
 * Does NOT own: edge data structure, connection colours, layout positioning.
 */

import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
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

interface CausalityEdgeData {
  connection_type: ConnectionType;
  strength: number;
  description?: string;
}

/**
 * CausalityEdge — custom edge component for causality links.
 * Renders a colour-coded bezier curve with directional animation
 * and a persistent connection-type label.
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
  markerEnd,
}: EdgeProps) {
  const data = rawData as CausalityEdgeData | undefined;
  const [hovered, setHovered] = useState(false);

  const connectionType: ConnectionType = data?.connection_type ?? 'leads_to';
  const color = CONNECTION_COLORS[connectionType] ?? '#6b7280';
  const label = CONNECTION_LABELS[connectionType] ?? connectionType;
  const strength = data?.strength ?? 0.5;
  const zoom = useStore((s) => s.transform[2]);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Compensate stroke width so it never falls below MIN_STROKE_WIDTH_PX on screen.
  // React Flow applies the zoom transform to the SVG, so we divide by zoom.
  const baseStrokeWidth = Math.max(1.5, strength * 4);
  const strokeWidth = Math.max(baseStrokeWidth, MIN_STROKE_WIDTH_PX / zoom);

  // For "causes" type: animate dash to pulse left-to-right (in direction of time)
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
          filter: `blur(3px)`,
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
          // Animate dash offset for "causes" type — moves left to right
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
            <div style={{ fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: data?.description ? 4 : 0 }}>
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
