/**
 * NetworkView.tsx
 *
 * Chronological graph view of historical events and their causality links.
 * Events are positioned left-to-right by year_approx using a d3-force
 * simulation (X pinned to year, Y organic via repulsion + link forces).
 * Connected event chains cluster near Y = 0, while isolated nodes drift
 * gently above / below for visual separation.
 *
 * A fixed timeline spine (NetworkTimeline) overlays the viewport at 50 %
 * screen height, providing persistent year-reference tick marks.
 *
 * Owns: force-directed layout computation, ReactFlow rendering, viewport
 *   filtering (events outside the scrubber range are hidden).
 * Does NOT own: event detail panel, data fetching strategy, view mode
 *   toggling, timeline scrubber (rendered by App.tsx).
 */

import { useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useViewport,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import {
  forceSimulation,
  forceX,
  forceY,
  forceLink,
  forceManyBody,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';

import EventNode from './EventNode';
import CausalityEdge from './CausalityEdge';
import NetworkTimeline from './NetworkTimeline';
import { fetchTiles, fetchAllCausalityLinks } from '../api/client';
import { CONNECTION_COLORS } from '../utils/categories';
import { useAppStore } from '../store';
import type { HistoricalEvent, CausalityLink } from '../types';
import { CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Total canvas width in pixels — kept wide for smooth pan / zoom. */
const CANVAS_WIDTH = 15_000;

/** Viewport to request all events from the tile endpoint. */
const FULL_VIEWPORT = {
  year_min: CANVAS_CONSTANTS.BASE_YEAR_MIN,
  year_max: CANVAS_CONSTANTS.BASE_YEAR_MAX,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

/** Number of ticks to run the force simulation to completion. */
const SIMULATION_TICKS = 300;

/** Force-link resting distance (px). */
const LINK_DISTANCE = 120;

/** Force-link strength (mainly affects Y since X is pinned). */
const LINK_STRENGTH = 0.2;

/** Charge repulsion strength (negative = repel). */
const CHARGE_STRENGTH = -200;

/** Extra collision padding beyond node radius (px). */
const COLLISION_PADDING = 10;

/** Y-offset for isolated (unlinked) nodes. */
const ISOLATED_Y_OFFSET = 120;

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a historical year to a canvas X coordinate.
 *
 * @param year - Year (negative = BCE).
 * @returns X pixel on the 15 000 px canvas.
 */
function yearToX(year: number): number {
  return (
    ((year - CANVAS_CONSTANTS.BASE_YEAR_MIN) /
      (CANVAS_CONSTANTS.BASE_YEAR_MAX - CANVAS_CONSTANTS.BASE_YEAR_MIN)) *
    CANVAS_WIDTH
  );
}

/**
 * Compute visual node radius from importance_score (mirrors EventNode sizing).
 *
 * @param importance - importance_score in [0, 1].
 * @returns Radius in pixels.
 */
function nodeRadius(importance: number): number {
  const baseSize = 20 + importance * 20;
  return Math.max(16, Math.min(48, baseSize)) / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// d3-force simulation types
// ─────────────────────────────────────────────────────────────────────────────

interface ForceNode extends SimulationNodeDatum {
  id: string;
  targetX: number;
  targetY: number;
  radius: number;
  isConnected: boolean;
  event: HistoricalEvent;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  causalityLink: CausalityLink;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a d3-force simulation to compute organic Y positions while pinning X
 * to the chronological year.  Connected events cluster near Y = 0; isolated
 * nodes float gently above / below.
 *
 * @param events - Filtered historical events.
 * @param links  - All causality links (will be filtered to visible set).
 * @returns ReactFlow-compatible nodes and edges.
 */
function computeForceLayout(
  events: HistoricalEvent[],
  links: CausalityLink[],
): { nodes: Node[]; edges: Edge[] } {
  const nodeIdSet = new Set(events.map((e) => String(e.id)));

  // Determine which nodes participate in at least one link
  const connectedIds = new Set<string>();
  const validLinks = links.filter((l) => {
    const causeId = String(l.cause_event_id);
    const effectId = String(l.effect_event_id);
    const valid = nodeIdSet.has(causeId) && nodeIdSet.has(effectId);
    if (valid) {
      connectedIds.add(causeId);
      connectedIds.add(effectId);
    }
    return valid;
  });

  // Build force-simulation nodes
  const forceNodes: ForceNode[] = events.map((event) => {
    const id = String(event.id);
    const isConnected = connectedIds.has(id);
    const targetX = yearToX(event.year_approx);

    // Deterministic sign for isolated nodes based on last hex char of id
    const lastChar = id.slice(-1);
    const sign = parseInt(lastChar, 16) % 2 === 0 ? 1 : -1;
    const targetY = isConnected ? 0 : sign * ISOLATED_Y_OFFSET;

    return {
      id,
      x: targetX,
      y: targetY,
      targetX,
      targetY,
      radius: nodeRadius(event.importance_score),
      isConnected,
      event,
    };
  });

  // Build a lookup for force-link source/target resolution
  const nodeById = new Map(forceNodes.map((n) => [n.id, n]));

  // Build force-simulation links
  const forceLinks: ForceLink[] = validLinks
    .map((l) => ({
      source: nodeById.get(String(l.cause_event_id))!,
      target: nodeById.get(String(l.effect_event_id))!,
      causalityLink: l,
    }))
    .filter((fl) => fl.source && fl.target);

  // ── Run simulation ──────────────────────────────────────────────────────

  const simulation = forceSimulation<ForceNode>(forceNodes)
    .force(
      'x',
      forceX<ForceNode>((d) => d.targetX).strength(1.0),
    )
    .force(
      'y',
      forceY<ForceNode>((d) => d.targetY).strength((d) =>
        d.isConnected ? 0.04 : 0.1,
      ),
    )
    .force(
      'link',
      forceLink<ForceNode, ForceLink>(forceLinks)
        .id((d) => d.id)
        .distance(LINK_DISTANCE)
        .strength(LINK_STRENGTH),
    )
    .force('charge', forceManyBody<ForceNode>().strength(CHARGE_STRENGTH))
    .force(
      'collide',
      forceCollide<ForceNode>((d) => d.radius + COLLISION_PADDING),
    )
    .stop();

  // Run synchronously to completion
  for (let i = 0; i < SIMULATION_TICKS; i++) {
    simulation.tick();
  }

  // ── Convert to ReactFlow nodes ──────────────────────────────────────────

  const rfNodes: Node[] = forceNodes.map((n) => ({
    id: n.id,
    type: 'event',
    position: {
      x: n.x!,
      y: n.y!,
    },
    data: { ...n.event, showLabel: true },
    selectable: true,
    draggable: true,
  }));

  // ── Convert to ReactFlow edges ──────────────────────────────────────────

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
// Year-axis label formatter
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

// ─────────────────────────────────────────────────────────────────────────────
// NetworkViewInner — main component (inside ReactFlowProvider)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inner network view component that uses ReactFlow hooks.
 * Handles data fetching, force-directed layout, viewport filtering, and the
 * fixed timeline spine overlay.
 */
function NetworkViewInner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ReactFlow generic requires any[] for initial empty state
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ReactFlow generic requires any[] for initial empty state
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);
  const { fitView } = useReactFlow();
  const viewport = useViewport();

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

  // Compute force-directed layout whenever filtered events or links change
  useEffect(() => {
    if (filteredEvents.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const { nodes: rfNodes, edges: rfEdges } = computeForceLayout(
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
        defaultViewport={{
          x: 0,
          y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
          zoom: 0.08,
        }}
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

      {/* Fixed timeline spine overlay — always at 50 % viewport height */}
      <NetworkTimeline viewport={viewport} />

      {/* Year-axis info label */}
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0,
          height: 40,
          pointerEvents: 'none',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
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
          {filteredEvents.length} events · {formatYearLabel(viewportYearMin)} —{' '}
          {formatYearLabel(viewportYearMax)}
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
 * NetworkView — force-directed chronological graph of events and causality
 * links.  X is pinned to year; Y is organic via d3-force simulation.
 * A fixed timeline spine overlays the viewport for persistent year reference.
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
