/**
 * NetworkView.tsx
 *
 * Chronological graph view of historical events and their causality links.
 * Events are positioned left-to-right by year_approx using a deterministic
 * tree layout (X pinned to year, Y branching off a center spine by causal
 * depth). Root events sit on the spine; their effects branch above/below,
 * making causal chains easy to trace visually.
 *
 * A fixed timeline spine (NetworkTimeline) overlays the viewport at 50 %
 * screen height, providing persistent year-reference tick marks.
 *
 * Owns: tree layout computation, ReactFlow rendering, viewport
 *   filtering (events outside the scrubber range are hidden).
 * Does NOT own: event detail panel, data fetching strategy, view mode
 *   toggling, timeline scrubber (rendered by App.tsx).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
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

/** Total canvas width in pixels — from shared constants. */
const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

/** Viewport to request all events from the tile endpoint. */
const FULL_VIEWPORT = {
  year_min: CANVAS_CONSTANTS.BASE_YEAR_MIN,
  year_max: CANVAS_CONSTANTS.BASE_YEAR_MAX,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

/** Vertical spacing between causal depth levels (px). */
const DEPTH_SPACING = 160;

/** Maximum causal depth for layout purposes (deeper nodes are capped). */
const MAX_DEPTH = 4;

/** Gentle Y offset for isolated (unlinked) nodes. */
const ISOLATED_Y_NUDGE = 80;

/** Gentle Y offset for isolated nodes in precomputed layout (matches server). */
const ISOLATED_NUDGE_PX = 90;

/** Number of collision-resolution passes. */
const COLLISION_PASSES = 3;

/** Multiplier for collision spread distance relative to node radius. */
const COLLISION_SPREAD_FACTOR = 2.5;

/**
 * Threshold: if this fraction of events have precomputed network_y,
 * use DB positions instead of client-side tree layout.
 */
const PRECOMPUTED_THRESHOLD = 0.8;

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map a historical year to a canvas X coordinate using the current viewport
 * year range. When the scrubber is narrowed (e.g. 1939–1945), the full
 * CANVAS_WIDTH represents only those years — nodes spread out automatically.
 *
 * @param year    - Year (negative = BCE).
 * @param yearMin - Left edge of the viewport year range (from scrubber).
 * @param yearMax - Right edge of the viewport year range (from scrubber).
 * @returns X pixel on the canvas.
 */
function yearToX(year: number, yearMin: number, yearMax: number): number {
  const span = yearMax - yearMin;
  if (span <= 0) return 0;
  return ((year - yearMin) / span) * CANVAS_WIDTH;
}

/**
 * Parse a date string (ISO or PostgreSQL BCE format) into a fractional year.
 *
 * PostgreSQL returns BCE dates as "3200-01-01 BC" (with " BC" suffix), NOT
 * as "-3200-01-01". This function handles both formats.
 *
 * @param dateStr  - Date string from the backend.
 * @param fallback - Fallback value if parsing fails.
 * @returns Fractional year (e.g. 1939.5 for July 1939).
 */
function dateToFractionalYear(dateStr: string, fallback: number): number {
  let str = dateStr.trim();
  let isBC = false;

  // Handle PostgreSQL " BC" suffix
  if (str.endsWith(' BC')) {
    isBC = true;
    str = str.slice(0, -3).trim();
  }

  const parts = str.split('-');

  // Handle ISO negative year prefix (leading "-"), e.g. "-3200-01-01"
  let yearStr: string;
  let monthStr: string;
  let dayStr: string | undefined;

  if (parts[0] === '' && parts.length >= 3) {
    // e.g. "-3200-01-01" splits as ["", "3200", "01", "01"]
    isBC = true;
    yearStr = parts[1];
    monthStr = parts[2];
    dayStr = parts[3];
  } else {
    yearStr = parts[0];
    monthStr = parts[1];
    dayStr = parts[2];
  }

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = dayStr ? parseInt(dayStr, 10) : 1;

  if (isNaN(year) || isNaN(month)) return fallback;

  /** Fraction-of-year constants */
  const MONTHS_PER_YEAR = 12;
  const DAYS_PER_YEAR = 365;

  const signedYear = isBC ? -year : year;
  return signedYear + (month - 1) / MONTHS_PER_YEAR + (day - 1) / DAYS_PER_YEAR;
}

/**
 * Compute canvas X for a historical event using its most precise date.
 * Prefers date_earliest (sub-year precision) over year_approx.
 *
 * @param event   - The historical event.
 * @param yearMin - Left edge of the viewport year range.
 * @param yearMax - Right edge of the viewport year range.
 * @returns X pixel on the canvas.
 */
function eventToX(
  event: HistoricalEvent,
  yearMin: number,
  yearMax: number,
): number {
  if (event.date_earliest) {
    return yearToX(
      dateToFractionalYear(event.date_earliest, event.year_approx),
      yearMin,
      yearMax,
    );
  }
  return yearToX(event.year_approx, yearMin, yearMax);
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
// Tree layout types
// ─────────────────────────────────────────────────────────────────────────────

/** Adjacency info for a single node in the causal graph. */
interface AdjacencyEntry {
  outgoing: Set<string>;
  incoming: Set<string>;
}

/** Y-depth multipliers by BFS depth. Depth 0 is on the spine (Y=0). */
const DEPTH_Y_MULTIPLIERS: Record<number, number> = {
  0: 0,
  1: 1.0,
  2: 1.8,
  3: 2.4,
};

/**
 * Get the Y-multiplier for a given causal depth.
 * Depths beyond 3 use a constant cap to prevent runaway offsets.
 *
 * @param depth - BFS causal depth (0 = root).
 * @returns Multiplier to apply to DEPTH_SPACING.
 */
function depthMultiplier(depth: number): number {
  if (depth in DEPTH_Y_MULTIPLIERS) return DEPTH_Y_MULTIPLIERS[depth];
  return 2.8; // cap for depth >= 4
}

/**
 * Deterministic sign (+1 or -1) derived from a node id.
 * Uses the last 4 hex characters of the UUID to pick a side.
 *
 * @param id - Node id string (UUID).
 * @returns +1 or -1.
 */
function deterministicSign(id: string): number {
  return parseInt(id.slice(-4), 16) % 2 === 0 ? 1 : -1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Precomputed DB layout (preferred path — instant, stable)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple fallback Y for events without a precomputed network_y position.
 * Uses the last 4 hex chars of the UUID for a deterministic above/below nudge.
 *
 * @param event - The event needing a fallback Y.
 * @returns Y offset in pixels.
 */
function computeFallbackY(event: HistoricalEvent): number {
  const tail = String(event.id).slice(-4).replace(/-/g, '');
  const hval = parseInt(tail, 16);
  return (hval % 2 === 0 ? 1 : -1) * ISOLATED_NUDGE_PX;
}

/**
 * Builds ReactFlow nodes + edges from precomputed network_y values stored in DB.
 * Falls back to full client-side tree layout when < 80 % of events have network_y.
 *
 * This is the primary layout path — it avoids all BFS / collision computation
 * on the client, making the network view load instantly with stable positions.
 *
 * @param events  - Filtered historical events (must include network_y field).
 * @param links   - All causality links (filtered to visible set internally).
 * @param yearMin - Left edge of the viewport year range (from scrubber).
 * @param yearMax - Right edge of the viewport year range (from scrubber).
 * @returns ReactFlow-compatible nodes and edges.
 */
function buildFromPrecomputed(
  events: HistoricalEvent[],
  links: CausalityLink[],
  yearMin: number,
  yearMax: number,
): { nodes: Node[]; edges: Edge[] } | null {
  // Check how many events have precomputed positions
  const precomputed = events.filter((e) => e.network_y != null);
  if (precomputed.length < events.length * PRECOMPUTED_THRESHOLD) {
    return null; // fall back to client-side tree layout
  }

  const nodeIdSet = new Set(events.map((e) => String(e.id)));

  // Filter links to visible nodes
  const validLinks = links.filter((l) => {
    const causeId = String(l.cause_event_id);
    const effectId = String(l.effect_event_id);
    return nodeIdSet.has(causeId) && nodeIdSet.has(effectId);
  });

  // Build ReactFlow nodes from DB positions
  const rfNodes: Node[] = events.map((event) => {
    const id = String(event.id);
    return {
      id,
      type: 'event',
      position: {
        x: eventToX(event, yearMin, yearMax),
        y: event.network_y ?? computeFallbackY(event),
      },
      data: { ...event, showLabel: true },
      selectable: true,
      draggable: true,
    };
  });

  // Build ReactFlow edges between all visible nodes (no viewport culling —
  // events are already limited to the current timeViewport).
  const ARROWHEAD_SIZE = 8;
  const rfEdges: Edge[] = validLinks
    .map((l) => {
      const color = CONNECTION_COLORS[l.connection_type] ?? '#6b7280';
      const strength = l.strength ?? 0.5;
      const baseStrokeWidth = Math.max(0.8, strength * 2.5);
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
          width: ARROWHEAD_SIZE,
          height: ARROWHEAD_SIZE,
          color,
        },
        animated: l.connection_type === 'causes',
        style: { stroke: color, strokeWidth: baseStrokeWidth },
        label: l.connection_type,
        labelStyle: { fill: color, fontSize: 11, fontWeight: 700 },
        labelBgStyle: { fill: 'rgba(15,17,23,0.92)', rx: 4 },
        labelBgPadding: [6, 3] as [number, number],
      };
    });

  return { nodes: rfNodes, edges: rfEdges };
}

// ─────────────────────────────────────────────────────────────────────────────
// Client-side tree layout (fallback when DB positions unavailable)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute a deterministic tree layout for historical events and causality links.
 *
 * Root events (no incoming causal links) sit on the Y=0 spine. Events they
 * cause branch above or below the spine at increasing depth, keeping entire
 * causal chains on the same side for visual coherence. Isolated nodes get a
 * gentle Y nudge.
 *
 * X is dynamically mapped using the viewport year range so that narrowing
 * the scrubber spreads nodes across the full canvas width.
 *
 * @param events  - Filtered historical events.
 * @param links   - All causality links (will be filtered to the visible set).
 * @param yearMin - Left edge of the viewport year range (from scrubber).
 * @param yearMax - Right edge of the viewport year range (from scrubber).
 * @returns ReactFlow-compatible nodes and edges.
 */
function computeTreeLayout(
  events: HistoricalEvent[],
  links: CausalityLink[],
  yearMin: number,
  yearMax: number,
): { nodes: Node[]; edges: Edge[] } {
  const nodeIdSet = new Set(events.map((e) => String(e.id)));

  // ── 1. Filter links to visible nodes ────────────────────────────────────

  const validLinks = links.filter((l) => {
    const causeId = String(l.cause_event_id);
    const effectId = String(l.effect_event_id);
    return nodeIdSet.has(causeId) && nodeIdSet.has(effectId);
  });

  // ── 2. Build adjacency map ──────────────────────────────────────────────

  const adjacency = new Map<string, AdjacencyEntry>();
  for (const id of nodeIdSet) {
    adjacency.set(id, { outgoing: new Set(), incoming: new Set() });
  }
  for (const l of validLinks) {
    const causeId = String(l.cause_event_id);
    const effectId = String(l.effect_event_id);
    adjacency.get(causeId)!.outgoing.add(effectId);
    adjacency.get(effectId)!.incoming.add(causeId);
  }

  // ── 3. BFS to compute causal depth ─────────────────────────────────────

  /** depth per node id; -1 = isolated (no links at all). */
  const depthMap = new Map<string, number>();
  /** Inherited branch sign per node id (above or below spine). */
  const signMap = new Map<string, number>();

  // Root nodes: no incoming links AND at least one outgoing link
  const bfsQueue: string[] = [];
  for (const [id, adj] of adjacency) {
    if (adj.incoming.size === 0 && adj.outgoing.size > 0) {
      depthMap.set(id, 0);
      signMap.set(id, 0); // roots sit on the spine
      bfsQueue.push(id);
    }
  }

  // BFS from all roots simultaneously
  let head = 0;
  while (head < bfsQueue.length) {
    const currentId = bfsQueue[head++];
    const currentDepth = depthMap.get(currentId)!;
    const currentSign = signMap.get(currentId)!;
    const childDepth = Math.min(currentDepth + 1, MAX_DEPTH);

    for (const childId of adjacency.get(currentId)!.outgoing) {
      if (depthMap.has(childId)) continue; // already visited
      depthMap.set(childId, childDepth);

      // Inherit parent's sign, or pick a deterministic one for depth-1 children of roots
      const childSign =
        currentSign !== 0
          ? currentSign
          : deterministicSign(childId);
      signMap.set(childId, childSign);
      bfsQueue.push(childId);
    }
  }

  // Assign depth -1 to isolated nodes (no links) and nodes unreachable from roots
  for (const id of nodeIdSet) {
    if (!depthMap.has(id)) {
      const adj = adjacency.get(id)!;
      if (adj.incoming.size === 0 && adj.outgoing.size === 0) {
        depthMap.set(id, -1); // truly isolated
      } else {
        // Has links but unreachable from BFS roots (e.g. pure effect with no root ancestor)
        depthMap.set(id, -1);
      }
      signMap.set(id, deterministicSign(id));
    }
  }

  // ── 4. Build position map ───────────────────────────────────────────────

  const eventById = new Map(events.map((e) => [String(e.id), e]));
  const positions = new Map<string, { x: number; y: number; radius: number }>();

  for (const id of nodeIdSet) {
    const event = eventById.get(id)!;
    const x = eventToX(event, yearMin, yearMax);
    const depth = depthMap.get(id)!;
    const sign = signMap.get(id)!;
    const radius = nodeRadius(event.importance_score);

    let y: number;
    if (depth === -1) {
      // Isolated node: gentle nudge
      y = sign * ISOLATED_Y_NUDGE;
    } else if (depth === 0) {
      y = 0;
    } else {
      y = sign * DEPTH_SPACING * depthMultiplier(depth);
    }

    positions.set(id, { x, y, radius });
  }

  // ── 5. Collision resolution ─────────────────────────────────────────────

  const posArray = Array.from(positions.entries());
  for (let pass = 0; pass < COLLISION_PASSES; pass++) {
    for (let i = 0; i < posArray.length; i++) {
      for (let j = i + 1; j < posArray.length; j++) {
        const [, posA] = posArray[i];
        const [, posB] = posArray[j];
        const dx = posA.x - posB.x;
        const dy = posA.y - posB.y;
        const minDist = (posA.radius + posB.radius) * COLLISION_SPREAD_FACTOR;

        if (Math.abs(dx) < minDist && Math.abs(dy) < minDist) {
          const nudge = posA.radius * COLLISION_SPREAD_FACTOR;
          posA.y -= nudge;
          posB.y += nudge;
        }
      }
    }
  }

  // Write resolved positions back
  for (const [id, pos] of posArray) {
    positions.set(id, pos);
  }

  // ── 6. Convert to ReactFlow nodes ───────────────────────────────────────

  const rfNodes: Node[] = events.map((event) => {
    const id = String(event.id);
    const pos = positions.get(id)!;
    return {
      id,
      type: 'event',
      position: { x: pos.x, y: pos.y },
      data: { ...event, showLabel: true },
      selectable: true,
      draggable: true,
    };
  });

  // ── 7. Convert to ReactFlow edges (all edges between rendered nodes) ──

  /** Smaller arrowhead size for cleaner visuals. */
  const ARROWHEAD_SIZE = 8;

  const rfEdges: Edge[] = validLinks
    .map((l) => {
      const color = CONNECTION_COLORS[l.connection_type] ?? '#6b7280';
      const strength = l.strength ?? 0.5;
      const baseStrokeWidth = Math.max(0.8, strength * 2.5);
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
          width: ARROWHEAD_SIZE,
          height: ARROWHEAD_SIZE,
          color,
        },
        animated: l.connection_type === 'causes',
        style: { stroke: color, strokeWidth: baseStrokeWidth },
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

  // Subscribe to timeViewport — single source of truth for the visible year range
  const timeViewport = useAppStore((s) => s.timeViewport);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);

  // Keep store's rfViewport in sync with the ReactFlow camera
  const setRfViewportStore = useAppStore((s) => s.setRfViewport);

  /** Throttle onMove store updates to max ~10/sec to avoid 60fps re-renders. */
  const RF_VIEWPORT_THROTTLE_MS = 100;
  const lastRfViewportUpdateRef = useRef(0);

  // Consume pendingRfViewport from the store (set by scrubber body drag / permalink)
  const pendingRfViewport = useAppStore((s) => s.pendingRfViewport);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);
  const viewportYearMin = timeViewport.yearMin;
  const viewportYearMax = timeViewport.yearMax;

  // Track whether we've done an initial fitView
  const hasFitViewRef = useRef(false);

  // Refs for stale closure safety in wheel handler
  const timeViewportRef = useRef(timeViewport);
  useEffect(() => { timeViewportRef.current = timeViewport; }, [timeViewport]);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Importance filter — local fast-filter + debounced API refetch
  const minImportance = useAppStore((s) => s.minImportance);
  const [debouncedMinImportance, setDebouncedMinImportance] = useState(minImportance);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMinImportance(minImportance), 300);
    return () => clearTimeout(timer);
  }, [minImportance]);

  // Fetch all events via the tile endpoint with a broad viewport.
  // The debounced min_importance is passed as a query param for server-side filtering.
  const { data: tileData, isLoading: tilesLoading } = useQuery({
    queryKey: ['network-tiles', debouncedMinImportance],
    queryFn: () => fetchTiles(FULL_VIEWPORT, debouncedMinImportance),
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

  // Local fast-filter: instantly hide events below the slider threshold
  // (no debounce — feels snappy). The debounced API refetch keeps the server in sync.
  const filteredEvents = useMemo(
    () => minImportance > 0
      ? allEvents.filter((e) => e.importance_score >= minImportance)
      : allEvents,
    [allEvents, minImportance],
  );

  // Compute layout: prefer precomputed DB positions, fall back to client-side tree.
  // Re-runs when the scrubber range changes so nodes reposition dynamically.
  useEffect(() => {
    if (filteredEvents.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Try precomputed DB layout first (instant, stable)
    const precomputed = buildFromPrecomputed(
      filteredEvents,
      allCausalityLinks,
      viewportYearMin,
      viewportYearMax,
    );
    if (precomputed) {
      setNodes(precomputed.nodes);
      setEdges(precomputed.edges);
      return;
    }

    // Fall back to full client-side tree layout
    const { nodes: rfNodes, edges: rfEdges } = computeTreeLayout(
      filteredEvents,
      allCausalityLinks,
      viewportYearMin,
      viewportYearMax,
    );
    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [filteredEvents, allCausalityLinks, viewportYearMin, viewportYearMax, setNodes, setEdges]);

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

  // NOTE: handleFitView on timeViewport change was removed — the scrubber now controls the
  // ReactFlow camera directly via setPendingRfViewport. Auto-fitView on every scroll-zoom
  // tick caused the camera to snap back to fit-all, making the view drift left.

  // ── Scroll-based time zoom + Ctrl+scroll visual zoom ──────────────────
  const { setViewport: setRfViewport, getViewport } = useReactFlow();

  // Apply pending ReactFlow viewport from scrubber body drag or permalink restore
  useEffect(() => {
    if (!pendingRfViewport) return;
    setRfViewport(pendingRfViewport, { duration: 0 });
    setPendingRfViewport(null);
  }, [pendingRfViewport, setRfViewport, setPendingRfViewport]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    /** Minimum time span in years (~1 month). */
    const MIN_SPAN = 0.083;
    /** Maximum time span in years. */
    const MAX_SPAN = 7_100;
    /** Zoom factor per wheel tick — gentler than 1.25 for a Google Maps feel. */
    const ZOOM_FACTOR = 1.15;

    const onWheel = (e: WheelEvent) => {
      const rfVp = getViewport();

      if (e.ctrlKey) {
        // Ctrl+scroll → visual zoom (ReactFlow camera)
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.9 : 1 / 0.9;
        const newZoom = Math.min(4, Math.max(0.02, rfVp.zoom * factor));
        const newX = e.clientX - (e.clientX - rfVp.x) * (newZoom / rfVp.zoom);
        const newY = e.clientY - (e.clientY - rfVp.y) * (newZoom / rfVp.zoom);
        setRfViewport({ x: newX, y: newY, zoom: newZoom });
        return;
      }

      // No modifier → time zoom
      e.preventDefault();
      e.stopPropagation();

      const tv = timeViewportRef.current;
      const span = tv.yearMax - tv.yearMin;
      const canvasX = (e.clientX - rfVp.x) / rfVp.zoom;
      const cursorYear = tv.yearMin + (canvasX / CANVAS_WIDTH) * span;

      // Scroll up (deltaY < 0) = zoom in (narrow year range)
      // Scroll down (deltaY > 0) = zoom out (widen year range)
      const factor = e.deltaY < 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR;
      const newSpan = Math.min(MAX_SPAN, Math.max(MIN_SPAN, span * factor));

      const ratio = span > 0 ? (cursorYear - tv.yearMin) / span : 0.5;
      const newYearMin = cursorYear - ratio * newSpan;
      const newYearMax = newYearMin + newSpan;

      const clampedMin = Math.max(-5000, newYearMin);
      const clampedMax = Math.min(2100, newYearMax);
      // Guard: ensure a minimum span (~1 month) and valid range
      if (clampedMax - clampedMin < MIN_SPAN) return;
      setTimeViewport({ yearMin: clampedMin, yearMax: clampedMax });
    };

    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => el.removeEventListener('wheel', onWheel, { capture: true } as EventListenerOptions);
  }, [getViewport, setRfViewport, setTimeViewport]);

  return (
    <div ref={wrapperRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        minZoom={0.3}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
        elementsSelectable
        nodesDraggable
        panOnScroll={false}
        zoomOnScroll={false}
        panOnDrag
        onMove={(_event, vp) => {
          const now = Date.now();
          if (now - lastRfViewportUpdateRef.current > RF_VIEWPORT_THROTTLE_MS) {
            lastRfViewportUpdateRef.current = now;
            setRfViewportStore(vp);
          }
        }}
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
 * NetworkView — deterministic tree-based chronological graph of events and
 * causality links. X is pinned to year; Y branches off a center spine by
 * causal depth. A fixed timeline spine overlays the viewport for persistent
 * year reference. Drop-in replacement for the Canvas component when
 * viewMode === 'network'.
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
