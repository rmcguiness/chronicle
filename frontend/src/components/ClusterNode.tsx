/**
 * ClusterNode.tsx — ReactFlow custom node for clustered event groups.
 *
 * Renders as a circle with a count badge, colored by the dominant event
 * category. On click, animates the viewport to zoom into the cluster's
 * time window. On hover, shows a tooltip listing the top 3 child events.
 */

import { memo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import { CATEGORY_COLORS } from '../utils/categories';
import { clusterDiameter } from '../utils/cluster';
import type { EventCluster } from '../utils/cluster';
import type { EventCategory } from '../types';
import { CANVAS_CONSTANTS } from '../types';
import { useAppStore } from '../store';

/** Props passed via ReactFlow node data. */
interface ClusterNodeData extends EventCluster {
  /** Maximum cluster size in the current view, for relative diameter scaling. */
  maxClusterCount: number;
}

/**
 * ClusterNode — circular node representing a group of temporally-close events.
 *
 * @param props - Standard ReactFlow NodeProps with ClusterNodeData.
 */
function ClusterNode({ data: rawData }: NodeProps) {
  const data = rawData as unknown as ClusterNodeData;
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    above: boolean;
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { fitBounds } = useReactFlow();
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);

  const color = CATEGORY_COLORS[data.dominantCategory as EventCategory] ?? '#6b7280';
  const diameter = clusterDiameter(data.count, data.maxClusterCount);

  const TOOLTIP_FLIP_THRESHOLD = 200;

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

  /**
   * On click: zoom the time viewport into this cluster's bin range,
   * causing the cluster to expand into individual events.
   */
  const handleClick = useCallback(() => {
    // Add some padding to the bin range
    const padding = (data.binEnd - data.binStart) * 0.1;
    setTimeViewport({
      yearMin: data.binStart - padding,
      yearMax: data.binEnd + padding,
    });
  }, [data.binStart, data.binEnd, setTimeViewport]);

  // Top 3 child titles for tooltip
  const topChildren = [...data.children]
    .sort((a, b) => b.importance_score - a.importance_score)
    .slice(0, 3);
  const remaining = data.count - topChildren.length;

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
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: diameter / 2,
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
          top: diameter / 2,
          transform: 'translate(-50%, -50%)',
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />

      {/* Cluster circle */}
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          backgroundColor: color,
          border: hovered
            ? '3px solid rgba(255,255,255,0.8)'
            : '2px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: diameter * 0.35,
          fontWeight: 800,
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          boxShadow: hovered
            ? `0 0 ${diameter * 0.6}px ${color}88, 0 4px 12px rgba(0,0,0,0.5)`
            : `0 0 ${diameter * 0.3}px ${color}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: 'all 0.15s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {data.count}
      </div>

      {/* Year range label below */}
      <div
        style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        {formatBinLabel(data.binStart, data.binEnd)}
      </div>

      {/* Hover tooltip — portal to escape canvas zoom */}
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
              border: `1px solid ${color}66`,
              borderRadius: 8,
              padding: '10px 14px',
              width: 280,
              zIndex: 10000,
              pointerEvents: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>
              {data.count} events ({formatBinLabel(data.binStart, data.binEnd)})
            </div>
            {topChildren.map((child) => (
              <div
                key={child.id}
                style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}
              >
                {CATEGORY_COLORS[child.category] && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: CATEGORY_COLORS[child.category],
                      marginRight: 6,
                    }}
                  />
                )}
                {child.title} ({child.year_approx})
              </div>
            ))}
            {remaining > 0 && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                ...and {remaining} more
              </div>
            )}
            <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 600 }}>
              Click to zoom in
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * Format a bin range as a human-readable label.
 *
 * @param start - Bin start year.
 * @param end - Bin end year.
 * @returns Formatted string like "1900–1950" or "500 BCE–450 BCE".
 */
function formatBinLabel(start: number, end: number): string {
  const fmt = (y: number) => (y < 0 ? `${Math.abs(y)} BCE` : `${y}`);
  return `${fmt(start)}–${fmt(end)}`;
}

export default memo(ClusterNode);
