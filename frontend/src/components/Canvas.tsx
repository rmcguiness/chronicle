/**
 * Canvas.tsx
 *
 * The main interactive timeline canvas.  Owns the ReactFlow instance, all
 * data-fetching, the swim-lane overlay (backgrounds + sticky labels + collapse
 * toggles), the WebGL fallback layer, and the timeline ruler.
 *
 * Responsibilities:
 *   - Fetch tile data (events + causality links) for the current viewport
 *   - Convert events ↔ ReactFlow nodes, links ↔ edges
 *   - Render region swim-lane backgrounds with expand/collapse toggles (UI-05)
 *   - Render a sticky timeline ruler overlay
 *   - Run Y-axis collision resolution at zoom < 1 (UI-04)
 *   - Fall back to a WebGL (deck.gl) ScatterplotLayer when event count exceeds
 *     GL_THRESHOLD to maintain 60fps at scale
 *
 * Does NOT:
 *   - Render the detail panel (EventDetailPanel.tsx)
 *   - Manage search state (SearchBar.tsx)
 *   - Own the app's routing (App.tsx)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type OnMove,
  MarkerType,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';

import EventNode from './EventNode';
import CausalityEdge from './CausalityEdge';
import WebGLEventLayer, { GL_THRESHOLD } from './WebGLEventLayer';
import { useAppStore } from '../store';
import { fetchTiles } from '../api/client';
import {
  CONNECTION_COLORS,
  importanceThreshold,
  classifyRegion,
  regionBandIndex,
} from '../utils/categories';
import {
  computeBandLayout,
  computeScreenLayout,
  defaultBandLayout,
  getBandByIndex,
  COLLAPSED_BAND_HEIGHT_PX,
} from '../utils/bandDensity';
import type { BandLayout } from '../utils/bandDensity';
import { resolveCollisions } from '../utils/collisionResolution';
import { useCollapsedBands } from '../hooks/useCollapsedBands';
import { CANVAS_CONSTANTS } from '../types';
import type { HistoricalEvent, CausalityLink, CanvasViewport, Region } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

/**
 * Initial react-flow viewport. Used for BOTH the defaultViewport prop and
 * the rfTransform useState initial value so they are always in sync on first
 * render. Mismatching them causes nodes to render off-screen.
 */
const INITIAL_VIEWPORT = { x: -4540, y: 80, zoom: 0.1 };

/** Width (px) of the sticky label strip on the left edge of the canvas. */
const LABEL_STRIP_WIDTH = 72;

/** Duration (ms) for the band collapse/expand CSS height transition. */
const BAND_TRANSITION_MS = 220;

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

/** Alternating background colours for region swim-lane bands. */
const BAND_COLORS: readonly string[] = [
  'rgba(255,255,255,0.02)',
  'rgba(255,255,255,0.04)',
  'rgba(255,255,255,0.02)',
  'rgba(255,255,255,0.04)',
  'rgba(255,255,255,0.02)',
];

// ─────────────────────────────────────────────────────────────────────────────
// Convert events + links → react-flow nodes + edges
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a historical event to a ReactFlow node.
 *
 * Y position is derived from the event's region band index and dynamic band
 * layout (density-based). Nodes in collapsed bands are marked hidden so
 * ReactFlow skips rendering them entirely.
 *
 * @param event         - The historical event to convert.
 * @param rfZoom        - Current ReactFlow zoom level (controls label visibility).
 * @param bandLayout    - Dynamic band layout from computeBandLayout.
 * @param collapsedBands - Set of region IDs currently collapsed (UI-05).
 * @returns A ReactFlow Node object ready for setNodes().
 */
function eventToNode(
  event: HistoricalEvent,
  rfZoom: number,
  bandLayout: BandLayout[],
  collapsedBands: Set<Region>,
): Node {
  const x = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
  const region = classifyRegion(event.lat, event.lng);
  const bandIdx = regionBandIndex(region);
  const band = getBandByIndex(bandLayout, bandIdx);

  const padding = 30;
  const usable = Math.max(0, band.height - 2 * padding);
  // Use longitude to spread events vertically within their band
  const lngNorm = Math.max(0, Math.min(1, (event.lng + 180) / 360));
  const y = band.top + padding + lngNorm * usable;

  return {
    id: String(event.id),
    type: 'event',
    position: { x, y },
    data: { ...event, showLabel: rfZoom >= 0.6 },
    selectable: true,
    draggable: false,
    hidden: collapsedBands.has(region),
  };
}

/**
 * Convert a causality link to a ReactFlow edge.
 *
 * @param link - The causality relationship between two events.
 * @returns A ReactFlow Edge with type, color, and animation set.
 */
function linkToEdge(link: CausalityLink): Edge {
  const color = CONNECTION_COLORS[link.connection_type] ?? '#6b7280';
  return {
    id: String(link.id),
    source: String(link.cause_event_id),
    target: String(link.effect_event_id),
    type: 'causality',
    data: {
      connection_type: link.connection_type,
      strength: link.strength,
      description: link.description,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color,
      width: 16,
      height: 16,
    },
    animated: link.connection_type === 'causes',
    style: { stroke: color },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ChevronIcon — inline SVG chevron for band toggle (UI-05)
// ─────────────────────────────────────────────────────────────────────────────

interface ChevronIconProps {
  collapsed: boolean;
}

/** Animated ▶/▼ chevron indicating collapsed/expanded band state. */
function ChevronIcon({ collapsed }: ChevronIconProps) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)',
        transition: `transform ${BAND_TRANSITION_MS}ms ease`,
        color: 'rgba(255,255,255,0.45)',
      }}
    >
      <path
        d="M3 2 L7 5 L3 8"
        stroke="currentColor"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline Ruler (sticky overlay — renders outside react-flow)
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineRulerProps {
  rfTransform: { x: number; y: number; zoom: number };
  width: number;
}

/** Sticky horizontal ruler showing year labels that track the pan/zoom transform. */
function TimelineRuler({ rfTransform, width }: TimelineRulerProps) {
  const { x: offsetX, zoom } = rfTransform;

  let tickInterval: number;
  if (zoom < 0.15) tickInterval = 100;
  else if (zoom < 0.5) tickInterval = 50;
  else if (zoom < 1.0) tickInterval = 10;
  else if (zoom < 2.0) tickInterval = 5;
  else tickInterval = 1;

  const yearLeft = Math.floor(-offsetX / (PIXELS_PER_YEAR * zoom) + BASE_YEAR_MIN);
  const yearRight = Math.ceil((width - offsetX) / (PIXELS_PER_YEAR * zoom) + BASE_YEAR_MIN);
  const startYear = Math.floor(yearLeft / tickInterval) * tickInterval;
  const endYear = Math.ceil(yearRight / tickInterval) * tickInterval;

  const ticks: { year: number; screenX: number }[] = [];
  for (let y = startYear; y <= endYear; y += tickInterval) {
    const canvasX = (y - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    const screenX = canvasX * zoom + offsetX;
    if (screenX >= -50 && screenX <= width + 50) {
      ticks.push({ year: y, screenX });
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 0,
        zIndex: 10,
        pointerEvents: 'none',
        transform: 'translateY(-50%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.12)',
        }}
      />
      {ticks.map((t) => {
        const isMajor =
          t.year %
            (tickInterval * 5 === 0
              ? tickInterval * 5
              : tickInterval >= 100
              ? 100
              : 50) ===
          0;
        const tickH = isMajor ? 16 : 8;
        return (
          <div key={t.year} style={{ position: 'absolute', left: t.screenX, top: -tickH }}>
            <div
              style={{
                width: 1,
                height: tickH * 2,
                backgroundColor: isMajor
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.1)',
              }}
            />
            {(isMajor || tickInterval <= 10) && (
              <div
                style={{
                  position: 'absolute',
                  top: tickH * 2 + 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  color: isMajor
                    ? 'rgba(255,255,255,0.45)'
                    : 'rgba(255,255,255,0.2)',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {t.year < 0
                  ? `${Math.abs(t.year)} BC`
                  : t.year === 0
                  ? '1 AD'
                  : `${t.year}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Region Swim Lane Overlay — backgrounds + sticky labels + collapse toggles
// UI-05: Each band has a chevron button; clicking collapses/expands the band.
// ─────────────────────────────────────────────────────────────────────────────

interface SwimLaneOverlayProps {
  rfTransform: { x: number; y: number; zoom: number };
  bandLayout: BandLayout[];
  collapsedBands: Set<Region>;
  onToggleBand: (region: Region) => void;
}

/**
 * Renders alternating band backgrounds and sticky left-edge labels with
 * collapse toggle buttons for each region swim-lane.
 *
 * @param rfTransform   - Current ReactFlow pan/zoom state for tracking offsetY.
 * @param bandLayout    - Canvas-space band heights from computeBandLayout.
 * @param collapsedBands - Set of currently-collapsed region IDs.
 * @param onToggleBand  - Callback to toggle a band's collapsed state.
 */
function SwimLaneOverlay({
  rfTransform,
  bandLayout,
  collapsedBands,
  onToggleBand,
}: SwimLaneOverlayProps) {
  const { y: offsetY, zoom } = rfTransform;

  // Derive screen-space heights considering collapsed state and current zoom
  const layout = computeScreenLayout(collapsedBands, zoom, bandLayout);

  const transitionStyle = `height ${BAND_TRANSITION_MS}ms ease, min-height ${BAND_TRANSITION_MS}ms ease`;

  return (
    <>
      {/* Alternating band background colours */}
      <div
        style={{
          position: 'absolute',
          top: offsetY,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {layout.map(({ region, screenHeight }, idx) => (
          <div
            key={region}
            style={{
              height: screenHeight,
              minHeight: screenHeight,
              overflow: 'hidden',
              transition: transitionStyle,
              backgroundColor: BAND_COLORS[idx % BAND_COLORS.length],
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          />
        ))}
      </div>

      {/* Sticky label strip with collapse toggle buttons */}
      <div
        style={{
          position: 'absolute',
          top: offsetY,
          left: 0,
          width: LABEL_STRIP_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          zIndex: 12,
        }}
      >
        {layout.map(({ region, label, screenHeight, isCollapsed }) => (
          <div
            key={region}
            style={{
              height: screenHeight,
              minHeight: screenHeight,
              overflow: 'hidden',
              transition: transitionStyle,
              position: 'relative',
            }}
          >
            {/* ▶/▼ collapse toggle button — always visible at the top of each band */}
            <button
              onClick={() => onToggleBand(region)}
              title={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
              aria-label={isCollapsed ? `Expand ${label}` : `Collapse ${label}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: LABEL_STRIP_WIDTH,
                height: COLLAPSED_BAND_HEIGHT_PX,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '0 6px',
                background: 'rgba(15,17,23,0.6)',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                zIndex: 13,
                borderRadius: 0,
              }}
            >
              <ChevronIcon collapsed={isCollapsed} />
              <span
                style={{
                  fontSize: 9,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  userSelect: 'none',
                }}
              >
                {label}
              </span>
            </button>

            {/* Rotated band label — only visible when expanded */}
            {!isCollapsed && (
              <div
                style={{
                  position: 'absolute',
                  top: screenHeight / 2,
                  left: 8,
                  transform: 'translateY(-50%) rotate(-90deg)',
                  transformOrigin: 'center center',
                  fontSize: 9,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  color: 'rgba(255,255,255,0.15)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                {label}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner Canvas (has access to ReactFlow instance via hook)
// ─────────────────────────────────────────────────────────────────────────────

function CanvasInner() {
  const reactFlow = useReactFlow();
  // ReactFlow state — typed as any[] to avoid fighting with internal generics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);

  // ── Store selectors ────────────────────────────────────────────────────────
  const viewport = useAppStore((s) => s.viewport);
  const setViewport = useAppStore((s) => s.setViewport);
  const rfZoom = useAppStore((s) => s.rfZoom);
  const setRfZoom = useAppStore((s) => s.setRfZoom);
  const flyToEvent = useAppStore((s) => s.flyToEvent);
  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);
  const setVisibleEvents = useAppStore((s) => s.setVisibleEvents);
  const usingMockData = useAppStore((s) => s.usingMockData);
  const setUsingMockData = useAppStore((s) => s.setUsingMockData);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  // ── UI-05: Collapsed band state ────────────────────────────────────────────
  const { collapsedBands, toggleBand } = useCollapsedBands();

  // ── Local state ────────────────────────────────────────────────────────────
  const [rfTransform, setRfTransform] = useState(INITIAL_VIEWPORT);
  const [allFilteredEvents, setAllFilteredEvents] = useState<HistoricalEvent[]>([]);
  const [bandLayout, setBandLayout] = useState<BandLayout[]>(() => defaultBandLayout());
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track container size for the WebGL overlay
  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setContainerSize({ width: rect.width, height: rect.height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Visible events for the WebGL fallback layer (excludes collapsed regions)
  const webGLVisibleEvents = useMemo(
    () =>
      allFilteredEvents.filter(
        (e) => !collapsedBands.has(classifyRegion(e.lat, e.lng)),
      ),
    [allFilteredEvents, collapsedBands],
  );

  const useWebGL = allFilteredEvents.length > GL_THRESHOLD;

  // ── Tile fetch with debounce ───────────────────────────────────────────────
  const [tileKey, setTileKey] = useState<CanvasViewport>(viewport);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const scheduleTileFetch = useCallback(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setTileKey({ ...viewport });
    }, 300);
  }, [viewport]);

  useEffect(() => {
    scheduleTileFetch();
  }, [scheduleTileFetch]);

  const { data: tileData, isLoading } = useQuery({
    queryKey: ['tiles', tileKey],
    queryFn: () => fetchTiles(tileKey),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // ── Refs to avoid stale closures ───────────────────────────────────────────
  const rfZoomRef = useRef(rfZoom);
  useEffect(() => { rfZoomRef.current = rfZoom; }, [rfZoom]);

  const bandLayoutRef = useRef<BandLayout[]>(bandLayout);
  useEffect(() => { bandLayoutRef.current = bandLayout; }, [bandLayout]);

  // ── Rebuild nodes + edges when tile data changes ───────────────────────────
  useEffect(() => {
    if (!tileData) return;

    const currentZoom = rfZoomRef.current;
    const threshold = importanceThreshold(currentZoom);
    const filteredEvents = tileData.events.filter(
      (e) => e.importance_score >= threshold,
    );

    setAllFilteredEvents(filteredEvents);
    setVisibleEvents(
      filteredEvents.filter((e) => !collapsedBands.has(classifyRegion(e.lat, e.lng))),
    );

    const isMock = filteredEvents.some((e) => String(e.id).length < 10);
    setUsingMockData(isMock);

    // Density-based band heights (UI-05 layout)
    const newBandLayout = computeBandLayout(filteredEvents);
    setBandLayout(newBandLayout);

    if (filteredEvents.length <= GL_THRESHOLD) {
      // Build initial node positions
      const rawNodes = filteredEvents.map((e) =>
        eventToNode(e, currentZoom, newBandLayout, collapsedBands),
      );

      // UI-04: Resolve Y-axis collisions to prevent event icon stacking
      const newNodes = resolveCollisions(rawNodes);

      const eventIds = new Set(filteredEvents.map((e) => String(e.id)));
      const newEdges = (tileData.links ?? [])
        .filter(
          (l) =>
            eventIds.has(String(l.cause_event_id)) &&
            eventIds.has(String(l.effect_event_id)),
        )
        .map(linkToEdge);

      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      // Hand off to WebGL for large datasets
      setNodes([]);
      setEdges([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileData, setNodes, setEdges, setVisibleEvents, setUsingMockData]);

  // ── Apply importance + collapse filters when zoom or collapse changes ──────
  useEffect(() => {
    if (!tileData || useWebGL) return;
    const threshold = importanceThreshold(rfZoom);
    setNodes((nds) =>
      nds.map((n) => {
        const evt = n.data as HistoricalEvent;
        const region = classifyRegion(evt.lat, evt.lng);
        return {
          ...n,
          hidden: evt.importance_score < threshold || collapsedBands.has(region),
        };
      }),
    );
  }, [rfZoom, collapsedBands, tileData, setNodes, useWebGL]);

  // ── Sync visible events with collapse state ────────────────────────────────
  useEffect(() => {
    setVisibleEvents(
      allFilteredEvents.filter(
        (e) => !collapsedBands.has(classifyRegion(e.lat, e.lng)),
      ),
    );
  }, [collapsedBands, allFilteredEvents, setVisibleEvents]);

  // ── Fly-to animation (triggered by search/bookmark selection) ─────────────
  useEffect(() => {
    if (!flyToEvent) return;
    const x = (flyToEvent.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    const region = classifyRegion(flyToEvent.lat, flyToEvent.lng);
    const bandIdx = regionBandIndex(region);
    const band = getBandByIndex(bandLayoutRef.current, bandIdx);
    const y = band.top + band.height / 2;

    reactFlow.setViewport({ x: 0, y: 0, zoom: 0.3 }, { duration: 500 });
    setTimeout(() => {
      reactFlow.setCenter(x, y, { zoom: 1.2, duration: 1000 });
    }, 600);

    setFlyToEvent(null);
  }, [flyToEvent, reactFlow, setFlyToEvent]);

  // ── ReactFlow move handlers ────────────────────────────────────────────────

  /** Track pan/zoom for swim-lane overlay positioning. */
  const onMoveHandler: OnMove = useCallback(
    (_event, rfVp) => {
      setRfTransform({ x: rfVp.x, y: rfVp.y, zoom: rfVp.zoom });
    },
    [],
  );

  /** Update viewport store on pan/zoom end so tile fetching re-evaluates. */
  const onMoveEnd: OnMove = useCallback(
    (_event, rfViewport) => {
      const containerWidth = containerSize.width;
      const zoom = rfViewport.zoom;

      const leftX = -rfViewport.x / zoom;
      const rightX = (containerWidth - rfViewport.x) / zoom;

      const yearMin = Math.floor(leftX / PIXELS_PER_YEAR + BASE_YEAR_MIN);
      const yearMax = Math.ceil(rightX / PIXELS_PER_YEAR + BASE_YEAR_MIN);

      setRfZoom(rfViewport.zoom);

      setViewport({
        year_min: Math.max(-5000, yearMin),
        year_max: Math.min(3000, yearMax),
        lat_min: -90,
        lat_max: 90,
        zoom: rfViewport.zoom,
      });
    },
    [containerSize, setViewport, setRfZoom],
  );

  const handleWebGLClick = useCallback(
    (event: HistoricalEvent) => {
      setSelectedEvent(event.slug);
    },
    [setSelectedEvent],
  );

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* UI-05: Swim-lane backgrounds + sticky labels + collapse toggles */}
      <SwimLaneOverlay
        rfTransform={rfTransform}
        bandLayout={bandLayout}
        collapsedBands={collapsedBands}
        onToggleBand={toggleBand}
      />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onMove={onMoveHandler}
          onMoveEnd={onMoveEnd}
          minZoom={0.05}
          maxZoom={4}
          defaultViewport={INITIAL_VIEWPORT}
          style={{ background: 'transparent' }}
          proOptions={{ hideAttribution: true }}
          fitViewOptions={{ padding: 0.3 }}
          elementsSelectable={true}
          nodesDraggable={false}
          panOnScroll={false}
          zoomOnScroll={true}
          panOnDrag={true}
        >
          <Background
            color="rgba(255,255,255,0.025)"
            gap={PIXELS_PER_YEAR * 10}
            size={1}
            style={{ opacity: 0.5 }}
          />

          <Panel position="top-left">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginTop: 16,
                marginLeft: LABEL_STRIP_WIDTH,
              }}
            >
              {isLoading && (
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(7,14,34,0.9)',
                    border: '1px solid rgba(96,165,250,0.3)',
                    fontSize: 12,
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
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
                  Loading events…
                </div>
              )}

              {usingMockData && (
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(7,14,34,0.85)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    fontSize: 11,
                    color: '#f59e0b',
                  }}
                >
                  📡 Mock data · Start backend for live data
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* WebGL fallback for large event counts */}
      {useWebGL && (
        <WebGLEventLayer
          events={webGLVisibleEvents}
          rfViewport={rfTransform}
          width={containerSize.width}
          height={containerSize.height}
          onEventClick={handleWebGLClick}
        />
      )}

      {/* Sticky timeline ruler */}
      <TimelineRuler rfTransform={rfTransform} width={containerSize.width} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Canvas wrapper — provides ReactFlow context via ReactFlowProvider
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The root timeline canvas component. Wraps the inner canvas with a
 * ReactFlowProvider so child components can access the ReactFlow instance.
 */
export default function Canvas() {
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
      `}</style>

      <ReactFlowProvider>
        <CanvasInner />
      </ReactFlowProvider>
    </div>
  );
}
