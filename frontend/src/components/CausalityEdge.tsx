import { memo, useState } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { CONNECTION_COLORS, CONNECTION_LABELS } from '../utils/categories';
import type { ConnectionType } from '../types';

interface CausalityEdgeData {
  connection_type: ConnectionType;
  strength: number;
  description?: string;
}

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
  const strength = data?.strength ?? 0.5;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeWidth = Math.max(1.5, strength * 4);

  return (
    <>
      {/* Invisible wider hit area for hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd as string}
        style={{
          stroke: hovered ? '#ffffff' : color,
          strokeWidth: hovered ? strokeWidth + 1 : strokeWidth,
          strokeDasharray: connectionType === 'context' ? '6 3' : undefined,
          opacity: hovered ? 1 : 0.7,
          filter: hovered ? `drop-shadow(0 0 4px ${color})` : undefined,
          transition: 'stroke 0.15s, opacity 0.15s',
          pointerEvents: 'none',
        }}
      />

      {/* Hover label */}
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
