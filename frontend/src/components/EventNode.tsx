import { memo, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../utils/categories";
import { dateToFractionalYear } from "../utils/timeScale";
import type { HistoricalEvent } from "../types";
import { CANVAS_CONSTANTS } from "../types";
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
  /** Circle diameter in canvas px — scales with timeSpan so nodes stay readable. */
  const NODE_SIZE_BASE = timeSpan * 0.01 > 10 ? 500 / (timeSpan * 0.01) : 50;
  const NODE_SIZE_IMPORTANCE_RANGE = 20;
  const size = Math.round(
    NODE_SIZE_BASE +
      (data.importance_score ?? 0.5) * NODE_SIZE_IMPORTANCE_RANGE,
  );

  /**
   * Pill width: how many canvas pixels the event's duration occupies at the
   * current timeViewport zoom level.
   *   - pillWidth > size  → render as rounded-rect pill (duration is visible)
   *   - pillWidth ≤ size  → render as circle (zoom out too far to see duration)
   */
  const startYear = data.date_earliest
    ? dateToFractionalYear(data.date_earliest, data.year_approx)
    : data.year_approx;
  const endYear = data.date_latest
    ? dateToFractionalYear(data.date_latest, data.year_approx)
    : data.year_approx;
  const durationYears = Math.max(0, endYear - startYear);
  /** Guard: avoid division by zero on degenerate viewports. */
  const safeTimeSpan = timeSpan > 0 ? timeSpan : 1;
  const pillWidth = (durationYears / safeTimeSpan) * CANVAS_CONSTANTS.CANVAS_WIDTH;
  const isPill = pillWidth > size;
  /** Rendered node width — pill stretches to duration; circle stays at size. */
  const nodeWidth = isPill ? pillWidth : size;

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
      {/*
       * Handles are pinned to the vertical centre of the shape (size/2 px from
       * top), not the centre of the full wrapper div. This matters when a label
       * is rendered below the node — without this fix the handle would sit at
       * (shape + label) / 2, causing edge misalignment on labelled nodes.
       */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: "none",
          left: "50%",
          top: size / 2,
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
          top: size / 2,
          transform: "translate(-50%, -50%)",
          width: 1,
          height: 1,
          minWidth: 1,
        }}
      />

      {/* Main circle */}
      <div
        style={{
          width: nodeWidth,
          height: size,
          /*
           * borderRadius: pill uses size/2 (half-height) for a true capsule shape;
           * circle uses "50%" so it stays perfectly round regardless of size value.
           */
          borderRadius: isPill ? size / 2 : "50%",
          backgroundColor: color,
          border: selected
            ? "3px solid #ffffff"
            : hovered
              ? `3px solid rgba(255,255,255,0.8)`
              : `2px solid rgba(255,255,255,0.3)`,
          display: "flex",
          alignItems: "center",
          /*
           * Pills: justify icon to the left cap so it stays visible as a spatial
           * anchor even when the pill stretches across a large canvas area.
           * Circles: centre the icon as before.
           */
          justifyContent: isPill ? "flex-start" : "center",
          paddingLeft: isPill ? size * 0.3 : 0,
          fontSize: size * 0.45,
          boxShadow:
            hovered || selected
              ? `0 0 ${size * 0.8}px ${color}88, 0 4px 12px rgba(0,0,0,0.5)`
              : `0 0 ${size * 0.4}px ${color}44, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: "all 0.15s ease",
          transform: hovered || selected ? "scale(1.05)" : "scale(1)",
          position: "relative",
          zIndex: hovered || selected ? 10 : 1,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <span style={{ lineHeight: 1, userSelect: "none", flexShrink: 0 }}>{icon}</span>
        {/* Show title inside the pill when zoomed in enough for the label to be readable */}
        {isPill && showLabel && (
          <span
            style={{
              marginLeft: size * 0.2,
              fontSize: size * 0.35,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              userSelect: "none",
            }}
          >
            {data.title}
          </span>
        )}
      </div>

      {/* Label below node — only for circles; pills show title inside their shape */}
      {showLabel && !isPill && (
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
