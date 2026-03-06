/**
 * GroupNode.tsx
 *
 * Custom ReactFlow node for group events — container events that span a date
 * range and hold child events.
 *
 * Two visual modes based on zoom level:
 *   COLLAPSED (rfZoom < GROUP_COLLAPSE_ZOOM): elongated pill spanning the
 *     group's date range, with dashed border and child count badge.
 *   EXPANDED (rfZoom >= GROUP_COLLAPSE_ZOOM or user-expanded): translucent
 *     bounding box wrapping child EventNodes, with label and collapse toggle.
 *
 * Owns: group visual rendering, expand/collapse toggle.
 * Does NOT own: child node positioning (handled by NetworkView), data fetching.
 */

import { memo, useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { CATEGORY_COLORS } from '../utils/categories';
import { GROUP_COLLAPSE_ZOOM } from '../types';
import type { EventCategory } from '../types';
import { useAppStore } from '../store';

/** Data shape passed to GroupNode via ReactFlow node.data. */
interface GroupNodeData {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  category: EventCategory;
  importance_score: number;
  child_count: number;
  /** Collapsed pill width in canvas pixels (set by NetworkView layout). */
  pillWidth: number;
  /** Collapsed pill height in canvas pixels. */
  pillHeight: number;
  /** Expanded bounding box width (set by NetworkView when expanded). */
  boxWidth?: number;
  /** Expanded bounding box height (set by NetworkView when expanded). */
  boxHeight?: number;
  /** Whether the group is currently expanded. */
  expanded?: boolean;
}

/**
 * GroupNode — ReactFlow custom node for group events.
 *
 * Renders as a collapsed pill or expanded bounding box depending on the
 * current ReactFlow zoom level and user interaction.
 */
function GroupNode({ data: rawData }: NodeProps) {
  const data = rawData as unknown as GroupNodeData;
  const [userExpanded, setUserExpanded] = useState(false);
  const rfViewport = useAppStore((s) => s.rfViewport);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const rfZoom = rfViewport.zoom;
  const isExpanded = data.expanded || userExpanded || rfZoom >= GROUP_COLLAPSE_ZOOM;

  const color = CATEGORY_COLORS[data.category] ?? '#6b7280';

  const handleToggle = useCallback(() => {
    setUserExpanded((prev) => !prev);
  }, []);

  const handleClick = useCallback(() => {
    setSelectedEvent(data.slug);
  }, [data.slug, setSelectedEvent]);

  const pillHeight = data.pillHeight || 30;

  if (!isExpanded) {
    // ── Collapsed pill mode ──────────────────────────────────────────────
    const pillWidth = Math.max(data.pillWidth || 60, 60);

    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={handleClick}
        onDoubleClick={handleToggle}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{
            opacity: 0,
            pointerEvents: 'none',
            left: '50%',
            top: pillHeight / 2,
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
            top: pillHeight / 2,
            transform: 'translate(-50%, -50%)',
            width: 1,
            height: 1,
            minWidth: 1,
          }}
        />

        {/* Pill shape */}
        <div
          style={{
            width: pillWidth,
            height: pillHeight,
            borderRadius: pillHeight / 2,
            backgroundColor: `${color}30`,
            border: `2px dashed ${color}aa`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 8,
            paddingRight: 8,
            boxSizing: 'border-box',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: Math.min(14, pillHeight * 0.45),
              fontWeight: 700,
              color: '#e2e8f0',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              userSelect: 'none',
            }}
          >
            {data.title}
          </span>

          {/* Child count badge */}
          {data.child_count > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                backgroundColor: color,
                color: '#fff',
                fontSize: 9,
                fontWeight: 700,
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}
            >
              {data.child_count}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── Expanded bounding box mode ───────────────────────────────────────
  const boxWidth = data.boxWidth || data.pillWidth || 200;
  const boxHeight = data.boxHeight || 200;

  return (
    <div
      style={{
        position: 'relative',
        width: boxWidth,
        height: boxHeight,
        cursor: 'default',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: 'none',
          left: '50%',
          top: '50%',
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
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />

      {/* Bounding box rectangle */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          backgroundColor: `${color}08`,
          border: `2px dashed ${color}55`,
          pointerEvents: 'none',
        }}
      />

      {/* Label in top-left */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={handleToggle}
          style={{
            background: `${color}33`,
            border: `1px solid ${color}66`,
            borderRadius: 4,
            color: '#e2e8f0',
            fontSize: 10,
            cursor: 'pointer',
            padding: '2px 6px',
            lineHeight: 1,
          }}
          title="Collapse group"
        >
          ▾
        </button>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: `${color}cc`,
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {data.title}
        </span>
      </div>
    </div>
  );
}

export default memo(GroupNode);
