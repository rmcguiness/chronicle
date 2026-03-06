import { memo, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/categories";
import type { HistoricalEvent } from "../types";
import { useAppStore } from "../store";

function EventNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as unknown as HistoricalEvent & { showLabel?: boolean };
  const [hovered, setHovered] = useState(false);
  /**
   * Tooltip position + whether to render above (true) or below (false) the node.
   * We flip to below when the node is in the top 200px of the viewport so the
   * tooltip doesn't render off-screen above.
   */
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    above: boolean;
  } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  /** Minimum pixels from top before we flip the tooltip to render below. */
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

  const color = CATEGORY_COLORS[data.category] ?? "#6b7280";
  const icon = CATEGORY_ICONS[data.category] ?? "●";
  // showLabel is set by clusterEvents() based on the active zoom tier:
  //   Standard tier (0.4–1.2) → false  (no label to reduce clutter)
  //   Detail tier   (≥ 1.2)   → true   (event name shown below node)
  const showLabel = data.showLabel ?? false;
  const timeViewport = useAppStore((s) => s.timeViewport);
  const timeSpan = timeViewport.yearMax - timeViewport.yearMin;
  /** Fixed node size in canvas px — 20–40px based on importance. No zoom math needed. */
  const NODE_SIZE_BASE = timeSpan * 0.01 > 10 ? 500 / (timeSpan * 0.01) : 50;
  const NODE_SIZE_IMPORTANCE_RANGE = 20;
  const size = Math.round(
    NODE_SIZE_BASE +
      (data.importance_score ?? 0.5) * NODE_SIZE_IMPORTANCE_RANGE,
  );

  return (
    <div
      ref={nodeRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedEvent(data.slug)}
    >
      {/*
       * Floating edge handles — both centred on the node so that CausalityEdge
       * can compute the actual circle-border intersection dynamically per edge.
       * Keeping Position.Left / Position.Right as the anchor enum to satisfy
       * ReactFlow's required prop, but style overrides move them to centre.
       */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: "none",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
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
          pointerEvents: "none",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />

      {/* Main circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          border: selected
            ? "3px solid #ffffff"
            : hovered
              ? `3px solid rgba(255,255,255,0.8)`
              : `2px solid rgba(255,255,255,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.45,
          boxShadow:
            hovered || selected
              ? `0 0 ${size * 0.8}px ${color}88, 0 4px 12px rgba(0,0,0,0.5)`
              : `0 0 ${size * 0.4}px ${color}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: "all 0.15s ease",
          transform: hovered || selected ? "scale(1.15)" : "scale(1)",
          position: "relative",
          zIndex: hovered || selected ? 10 : 1,
        }}
      >
        <span style={{ lineHeight: 1, userSelect: "none" }}>{icon}</span>
      </div>

      {/* Label */}
      {showLabel && (
        <div
          style={{
            marginTop: 4,
            fontSize: timeSpan > 10 ? 30 / timeSpan : 30,
            fontWeight: 600,
            color: "#e2e8f0",
            textShadow: "0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7)",
            whiteSpace: "nowrap",
            maxWidth: timeSpan > 10 ? 350 / timeSpan : 350,
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "center",
            letterSpacing: "0.01em",
            pointerEvents: "none",
          }}
        >
          {data.title}
        </div>
      )}

      {/* Hover tooltip — rendered as a portal so it's not affected by canvas zoom */}
      {hovered &&
        tooltipPos &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              /* Flip transform based on whether we render above or below the node */
              transform: tooltipPos.above
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
              backgroundColor: "rgba(7,14,34,0.97)",
              border: `1px solid ${color}66`,
              borderRadius: 8,
              padding: "10px 14px",
              width: 280,
              zIndex: 10000,
              pointerEvents: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
              {data.title}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              {data.year_approx} · {data.category}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
              Importance: {Math.round(data.importance_score * 100)}%
              {data.geo_modern ? ` · ${data.geo_modern}` : ""}
            </div>
            {data.perspective_count && (
              <div
                style={{ fontSize: 11, color, marginTop: 4, fontWeight: 600 }}
              >
                {data.perspective_count} perspective
                {data.perspective_count > 1 ? "s" : ""} · click to explore
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default memo(EventNode);
