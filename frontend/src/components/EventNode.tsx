import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { HistoricalEvent } from '../types';
import { useAppStore } from '../store';

function EventNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as HistoricalEvent & { showLabel?: boolean };
  const [hovered, setHovered] = useState(false);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const rfZoom = useAppStore((s) => s.rfZoom);

  const color = CATEGORY_COLORS[data.category] ?? '#6b7280';
  const icon = CATEGORY_ICONS[data.category] ?? '●';
  const showLabel = rfZoom >= 0.6;

  // Node size scales with importance and zoom
  const baseSize = 20 + data.importance_score * 20;
  const size = Math.max(16, Math.min(48, baseSize));

  return (
    <div
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setSelectedEvent(data.slug)}
      title={`${data.title} (${data.year_approx})`}
    >
      {/* Invisible handles for edges */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1, minWidth: 1 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 1, height: 1, minWidth: 1 }} />

      {/* Main circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          border: selected
            ? '3px solid #ffffff'
            : hovered
            ? `3px solid rgba(255,255,255,0.8)`
            : `2px solid rgba(255,255,255,0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.45,
          boxShadow: hovered || selected
            ? `0 0 ${size * 0.8}px ${color}88, 0 4px 12px rgba(0,0,0,0.5)`
            : `0 0 ${size * 0.4}px ${color}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: 'all 0.15s ease',
          transform: hovered || selected ? 'scale(1.15)' : 'scale(1)',
          position: 'relative',
          zIndex: hovered || selected ? 10 : 1,
        }}
      >
        <span style={{ lineHeight: 1, userSelect: 'none' }}>{icon}</span>
      </div>

      {/* Label */}
      {showLabel && (
        <div
          style={{
            marginTop: 4,
            fontSize: 10,
            fontWeight: 600,
            color: '#e2e8f0',
            textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)',
            whiteSpace: 'nowrap',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            letterSpacing: '0.01em',
            pointerEvents: 'none',
          }}
        >
          {data.title}
        </div>
      )}

      {/* Hover tooltip */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: size + 10,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            border: `1px solid ${color}66`,
            borderRadius: 8,
            padding: '8px 12px',
            minWidth: 160,
            maxWidth: 220,
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
            {data.title}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {data.year_approx}
            {data.geo_modern ? ` · ${data.geo_modern}` : ''}
          </div>
          {data.perspective_count && (
            <div style={{ fontSize: 10, color, marginTop: 3, fontWeight: 600 }}>
              {data.perspective_count} perspective{data.perspective_count > 1 ? 's' : ''} · click to explore
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(EventNode);
