/**
 * NetworkView.tsx
 *
 * Chronological graph view of historical events and their causality links.
 * Events are laid out left-to-right by year_approx (like a horizontal timeline),
 * with vertical staggering to avoid overlap. Causality edges draw as bezier
 * curves from cause → effect (earlier → later in time).
 *
 * Owns: chronological layout computation, react-flow rendering, year-axis ruler,
 *   viewport filtering (events outside the scrubber range are hidden).
 * Does NOT own: event detail panel, data fetching strategy, view mode toggling,
 *   timeline scrubber (rendered by App.tsx).
 */

import { useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';

import EventNode from './EventNode';
import CausalityEdge from './CausalityEdge';
import { fetchTiles, fetchAllCausalityLinks } from '../api/client';
import { CONNECTION_COLORS } from '../utils/categories';
import { useAppStore } from '../store';
import type { HistoricalEvent, CausalityLink } from '../types';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Total canvas width in pixels (wide enough to be scrollable). */
const CANVAS_WIDTH = 15000;

/** Number of vertical swim-lane rows for staggering. */
const ROW_COUNT = 7;

/** Vertical spacing in pixels between each row. */
const ROW_SPACING = 120;

/** Top padding before the first row of nodes. */
const TOP_PADDING = 60;

/** Year bucket size — events within this many years share a bucket for row assignment. */
const BUCKET_SIZE_YEARS = 50;

/** Height reserved for the year-axis info bar (px). */
const AXIS_HEIGHT = 40;

/** Viewport to request all events from the tile endpoint. */
const FULL_VIEWPORT = {
  year_min: CANVAS_CONSTANTS.BASE_YEAR_MIN,
  year_max: CANVAS_CONSTANTS.BASE_YEAR_MAX,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Linearly map a value from one range to another.
 *
 * @param value - The input value to map.
 * @param inMin - Input range minimum.
 * @param inMax - Input range maximum.
 * @param outMin - Output range minimum.
 * @param outMax - Output range maximum.
 * @returns The mapped value in the output range.
 */
function linearMap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

/**
 * Convert a year to an X pixel coordinate on the chronological canvas.
 *
 * @param year - Historical year (negative = BCE).
 * @returns X coordinate in pixels.
 */
function yearToX(year: number): number {
  return linearMap(
    year,
    CANVAS_CONSTANTS.BASE_YEAR_MIN,
    CANVAS_CONSTANTS.BASE_YEAR_MAX,
    0,
    CANVAS_WIDTH,
  );
}

/**
 * Assign each event a vertical row index to minimize overlap.
 * Events are bucketed by time period (BUCKET_SIZE_YEARS), and within each
 * bucket, events are distributed across ROW_COUNT rows round-robin style.
 *
 * @param events - Array of historical events to assign rows.
 * @returns Map from event ID to row index (0-based).
 */
function assignRows(events: HistoricalEvent[]): Map<string, number> {
  const rowMap = new Map<string, number>();

  // Sort events by year for consistent bucketing
  const sorted = [...events].sort((a, b) => a.year_approx - b.year_approx);

  // Track how many events have been placed in each bucket so far
  const bucketCounters = new Map<number, number>();

  for (const event of sorted) {
    const bucketKey = Math.floor(event.year_approx / BUCKET_SIZE_YEARS);
    const countInBucket = bucketCounters.get(bucketKey) ?? 0;
    const row = countInBucket % ROW_COUNT;

    rowMap.set(String(event.id), row);
    bucketCounters.set(bucketKey, countInBucket + 1);
  }

  return rowMap;
}

/**
 * Compute the Y coordinate for a given row index.
 *
 * @param row - Row index (0 to ROW_COUNT-1).
 * @returns Y pixel coordinate.
 */
function rowToY(row: number): number {
  return TOP_PADDING + row * ROW_SPACING;
}

/**
 * Compute chronological layout — positions nodes left-to-right by year
 * with vertical staggering, and builds edge data for causality links.
 *
 * @param events - All historical events to display.
 * @param links - All causality links between events.
 * @returns ReactFlow nodes and edges arrays.
 */
function computeChronologicalLayout(
  events: HistoricalEvent[],
  links: CausalityLink[],
): { nodes: Node[]; edges: Edge[] } {
  const rowMap = assignRows(events);
  const nodeIdSet = new Set(events.map((e) => String(e.id)));

  // Build ReactFlow nodes with chronological positions
  const rfNodes: Node[] = events.map((event) => {
    const row = rowMap.get(String(event.id)) ?? 0;
    return {
      id: String(event.id),
      type: 'event',
      position: {
        x: yearToX(event.year_approx),
        y: rowToY(row),
      },
      data: { ...event, showLabel: true },
      selectable: true,
      draggable: true,
    };
  });

  // Filter links to only those connecting visible events
  const validLinks = links.filter(
    (l) =>
      nodeIdSet.has(String(l.cause_event_id)) &&
      nodeIdSet.has(String(l.effect_event_id)),
  );

  // Build ReactFlow edges
  const rfEdges: Edge[] = validLinks.map((l) => {
    const color = CONNECTION_COLORS[l.connection_type] ?? '#6b7280';
    return {
      id: String(l.id),
      source: String(l.cause_event_id),
      target: String(l.effect_event_id),
      type: 'causality',
      data: {
        connection_type: l.connection_type,
        strength: l.strength,
        description: l.description,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color,
        width: 18,
        height: 18,
      },
      animated: l.connection_type === 'causes',
      style: { stroke: color },
      label: l.connection_type,
      labelStyle: { fill: color, fontSize: 11, fontWeight: 700 },
      labelBgStyle: { fill: 'rgba(15,17,23,0.92)', rx: 4 },
      labelBgPadding: [6, 3] as [number, number],
    };
  });

  return { nodes: rfNodes, edges: rfEdges };
}

// ─────────────────────────────────────────────────────────────────────────────
// Year-axis ruler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year as a human-readable label (e.g. "3000 BCE", "1500", "CE").
 *
 * @param year - The historical year.
 * @returns Formatted string.
 */
function formatYearLabel(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return 'CE';
  return `${year}`;
}

/* Year-axis ruler is rendered as an info bar overlay rather than
   a full SVG ruler — avoids z-index issues with ReactFlow's pan layer. */

// ─────────────────────────────────────────────────────────────────────────────
// NetworkViewInner — main component (inside ReactFlowProvider)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inner network view component that uses ReactFlow hooks.
 * Handles data fetching, layout computation, and viewport filtering.
 */
function NetworkViewInner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ReactFlow generic requires any[] for initial empty state
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ReactFlow generic requires any[] for initial empty state
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);
  const { fitView } = useReactFlow();

  // Subscribe to store viewport for time filtering via the scrubber
  const viewportYearMin = useAppStore((s) => s.viewport.year_min);
  const viewportYearMax = useAppStore((s) => s.viewport.year_max);

  // Track whether we've done an initial fitView
  const hasFitViewRef = useRef(false);

  // Fetch all events via the tile endpoint with a broad viewport
  const { data: tileData, isLoading: tilesLoading } = useQuery({
    queryKey: ['network-tiles'],
    queryFn: () => fetchTiles(FULL_VIEWPORT),
    staleTime: 5 * 60_000,
  });

  // Fetch all causality links
  const { data: allLinks, isLoading: linksLoading } = useQuery({
    queryKey: ['network-causality'],
    queryFn: fetchAllCausalityLinks,
    staleTime: 5 * 60_000,
  });

  const isLoading = tilesLoading || linksLoading;

  // All events from the data source (unfiltered)
  const allEvents: HistoricalEvent[] = useMemo(
    () => tileData?.events ?? [],
    [tileData],
  );

  // All causality links
  const allCausalityLinks: CausalityLink[] = useMemo(
    () => allLinks ?? tileData?.links ?? [],
    [allLinks, tileData],
  );

  // Filter events by the current scrubber viewport
  const filteredEvents = useMemo(
    () =>
      allEvents.filter(
        (e) =>
          e.year_approx >= viewportYearMin &&
          e.year_approx <= viewportYearMax,
      ),
    [allEvents, viewportYearMin, viewportYearMax],
  );

  // Compute layout whenever filtered events or links change
  useEffect(() => {
    if (filteredEvents.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: rfNodes, edges: rfEdges } = computeChronologicalLayout(
      filteredEvents,
      allCausalityLinks,
    );
    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [filteredEvents, allCausalityLinks, setNodes, setEdges]);

  // fitView when data first loads
  useEffect(() => {
    if (filteredEvents.length > 0 && !hasFitViewRef.current) {
      // Small delay to let ReactFlow render nodes before fitting
      const timer = setTimeout(() => {
        fitView({ padding: 0.15, duration: 300 });
        hasFitViewRef.current = true;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [filteredEvents.length, fitView]);

  // Re-fit when viewport scrubber changes significantly
  const handleFitView = useCallback(() => {
    setTimeout(() => {
      fitView({ padding: 0.15, duration: 400 });
    }, 50);
  }, [fitView]);

  // Track previous viewport to detect scrubber changes
  const prevViewportRef = useRef({ min: viewportYearMin, max: viewportYearMax });
  useEffect(() => {
    const prev = prevViewportRef.current;
    const changed =
      Math.abs(prev.min - viewportYearMin) > 100 ||
      Math.abs(prev.max - viewportYearMax) > 100;

    if (changed && filteredEvents.length > 0) {
      handleFitView();
    }
    prevViewportRef.current = { min: viewportYearMin, max: viewportYearMax };
  }, [viewportYearMin, viewportYearMax, filteredEvents.length, handleFitView]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        minZoom={0.02}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
        elementsSelectable
        nodesDraggable
        panOnScroll={false}
        zoomOnScroll
        panOnDrag
      >
        <Background
          color="rgba(255,255,255,0.02)"
          gap={50}
          size={1}
          style={{ opacity: 0.5 }}
        />
      </ReactFlow>

      {/* Year-axis ruler — positioned at the bottom of the node area, rendered
          inside the same coordinate space as a fixed overlay that scrolls with
          the flow. We use a portal-like approach via absolute positioning. */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0,
          height: AXIS_HEIGHT,
          pointerEvents: 'none',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Axis info label */}
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          {filteredEvents.length} events · {formatYearLabel(viewportYearMin)} — {formatYearLabel(viewportYearMax)}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: 'rgba(7,14,34,0.9)',
            border: '1px solid rgba(96,165,250,0.3)',
            fontSize: 12,
            color: '#60a5fa',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 20,
          }}
        >
          <span
            style={{
              animation: 'spin 1s linear infinite',
              display: 'inline-block',
            }}
          >
            ⟳
          </span>
          Loading network…
        </div>
      )}

      {/* Empty state when no events match the filter */}
      {!isLoading && filteredEvents.length === 0 && allEvents.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px 24px',
            borderRadius: 12,
            backgroundColor: 'rgba(7,14,34,0.9)',
            border: '1px solid rgba(96,165,250,0.2)',
            fontSize: 14,
            color: '#94a3b8',
            textAlign: 'center',
            zIndex: 20,
          }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔍</div>
          No events in the selected time range.
          <br />
          <span style={{ fontSize: 12, color: '#475569' }}>
            Adjust the timeline scrubber to see events.
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported NetworkView wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NetworkView — chronological graph of events and causality links.
 * Arranges events left-to-right by year with vertical staggering.
 * Drop-in replacement for the Canvas component when viewMode === 'network'.
 */
export default function NetworkView() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0f1117',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .react-flow__edge-path { pointer-events: none; }
        @keyframes causality-flow {
          from { stroke-dashoffset: 16; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      <ReactFlowProvider>
        <NetworkViewInner />
      </ReactFlowProvider>
    </div>
  );
}
