import { memo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { PersonSummary } from '../types';

function PersonNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as PersonSummary & { showLabel?: boolean };
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    above: boolean;
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const TOOLTIP_FLIP_THRESHOLD = 200;
  const SIZE = 36;
  const COLOR = '#8b5cf6'; // purple for people

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect();
      const above = rect.top > TOOLTIP_FLIP_THRESHOLD;
      setTooltipPos({
        top: above ? rect.top - 8 : rect.bottom + 8,
        left: rect.left + rect.width / 2,
        above,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTooltipPos(null);
  }, []);

  const showLabel = data.showLabel ?? true;

  const formatYears = () => {
    if (data.birth_year == null) return '';
    const birth = data.birth_year < 0 ? `${Math.abs(data.birth_year)} BCE` : `${data.birth_year}`;
    if (data.death_year == null) return birth;
    const death = data.death_year < 0 ? `${Math.abs(data.death_year)} BCE` : `${data.death_year}`;
    return `${birth} - ${death}`;
  };

  return (
    <div
      ref={nodeRef}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: SIZE / 2,
          transform: 'translate(-50%, -50%)',
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: SIZE / 2,
          transform: 'translate(-50%, -50%)',
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />

      {/* Circular avatar */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          backgroundColor: COLOR,
          border: selected
            ? '3px solid #ffffff'
            : hovered
              ? '3px solid rgba(255,255,255,0.8)'
              : '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          boxShadow:
            hovered || selected
              ? `0 0 ${SIZE * 0.8}px ${COLOR}88, 0 4px 12px rgba(0,0,0,0.5)`
              : `0 0 ${SIZE * 0.4}px ${COLOR}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: 'all 0.15s ease',
          transform: hovered || selected ? 'scale(1.1)' : 'scale(1)',
          position: 'relative',
          zIndex: hovered || selected ? 10 : 1,
        }}
      >
        <svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>

      {/* Label */}
      {showLabel && (
        <div
          style={{
            marginTop: 3,
            fontSize: 10,
            fontWeight: 600,
            color: '#c4b5fd',
            textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)',
            whiteSpace: 'nowrap',
            maxWidth: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {data.name}
        </div>
      )}

      {/* Tooltip */}
      {hovered &&
        tooltipPos &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: tooltipPos.above
                ? 'translate(-50%, -100%)'
                : 'translate(-50%, 0)',
              backgroundColor: 'rgba(7,14,34,0.97)',
              border: `1px solid ${COLOR}66`,
              borderRadius: 8,
              padding: '10px 14px',
              width: 240,
              zIndex: 10000,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              {data.name}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {formatYears()}
            </div>
            {data.nationality && (
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {data.nationality}
                {data.occupation ? ` · ${data.occupation}` : ''}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default memo(PersonNode);
