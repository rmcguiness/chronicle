import { useCallback, useEffect, useRef, useState } from 'react';
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
import { CONNECTION_COLORS, importanceThreshold, classifyRegion, regionBandIndex } from '../utils/categories';
import {
  computeBandLayout,
  defaultBandLayout,
  getBandByIndex,
} from '../utils/bandDensity';
import type { BandLayout } from '../utils/bandDensity';
import { CANVAS_CONSTANTS, REGIONS } from '../types';
import type { HistoricalEvent, CausalityLink, CanvasViewport } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const { PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

/**
 * Initial react-flow viewport. Used for BOTH the defaultViewport prop and
 * the rfTransform useState initial value so they are always in sync on first
 * render. Mismatching them causes nodes to render off-screen.
 *
 * x = viewportW/2 - year500_canvasX * zoom
 *   ≈ 960/2 - (500 - (-5000)) * 10 * 0.1
 *   = 480 - 5500 = -4540  → centers ~500 CE at load
 */
const INITIAL_VIEWPORT = { x: -4540, y: 80, zoom: 0.1 };

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// Convert events + links → react-flow nodes + edges
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute Y position within the appropriate region swim lane.
 *
 * @param event     - The historical event to position
 * @param rfZoom    - Current react-flow zoom level (controls label visibility)
 * @param bandLayout - Dynamic band layout from computeBandLayout; determines
 *                     each band's top and height in canvas space
 * @returns A react-flow Node with position derived from dynamic band heights
 */
function eventToNode(
  event: HistoricalEvent,
  rfZoom: number,
  bandLayout: BandLayout[],
): Node {
  const x = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
  const region = classifyRegion(event.lat, event.lng);
  const bandIdx = regionBandIndex(region);
  const band = getBandByIndex(bandLayout, bandIdx);

  const padding = 30;
  // Clamp usable height so we never get negative values when a band is tiny
  const usable = Math.max(0, band.height - 2 * padding);
  // Use longitude for intra-band spread (distributes events vertically)
  const lngNorm = Math.max(0, Math.min(1, (event.lng + 180) / 360));
  const y = band.top + padding + lngNorm * usable;

  return {
    id: String(event.id),
    type: 'event',
    position: { x, y },
    data: { ...event, showLabel: rfZoom >= 0.6 },
    selectable: true,
    draggable: false,
  };
}

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
// Timeline Ruler (sticky overlay — renders outside react-flow)
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineRulerProps {
  rfTransform: { x: number; y: number; zoom: number };
  width: number;
}

function TimelineRuler({ rfTransform, width }: TimelineRulerProps) {
  const { x: offsetX, zoom } = rfTransform;

  // Determine tick interval based on zoom
  let tickInterval: number;
  if (zoom < 0.15) tickInterval = 100;       // centuries
  else if (zoom < 0.5) tickInterval = 50;
  else if (zoom < 1.0) tickInterval = 10;     // decades
  else if (zoom < 2.0) tickInterval = 5;
  else tickInterval = 1;                       // years

  // Visible year range
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
      {/* Main horizontal line */}
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
      {/* Ticks */}
      {ticks.map((t) => {
        const isMajor = t.year % (tickInterval * 5 === 0 ? tickInterval * 5 : tickInterval >= 100 ? 100 : 50) === 0;
        const tickH = isMajor ? 16 : 8;
        return (
          <div key={t.year} style={{ position: 'absolute', left: t.screenX, top: -tickH }}>
            <div
              style={{
                width: 1,
                height: tickH * 2,
                backgroundColor: isMajor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
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
                  color: isMajor ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                }}
              >
                {t.year < 0 ? `${Math.abs(t.year)} BC` : t.year === 0 ? '1 AD' : `${t.year}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Region Swim Lane Labels (sticky left overlay)
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum rendered band height (px) below which the rotated label is hidden. */
const LABEL_MIN_SCREEN_HEIGHT = 60;

interface SwimLaneLabelsProps {
  rfTransform: { x: number; y: number; zoom: number };
  /** Dynamic band layout — determines each band's canvas top & height. */
  bandLayout: BandLayout[];
}

const BAND_COLORS = [
  'rgba(255,255,255,0.02)',
  'rgba(255,255,255,0.04)',
  'rgba(255,255,255,0.02)',
  'rgba(255,255,255,0.04)',
  'rgba(255,255,255,0.02)',
];

/**
 * Renders swim-lane band backgrounds and sticky region labels.
 * Band heights come from the dynamic bandLayout prop, so busy regions
 * automatically receive more vertical space.
 */
function SwimLaneOverlay({ rfTransform, bandLayout }: SwimLaneLabelsProps) {
  const { y: offsetY, zoom } = rfTransform;

  return (
    <>
      {/* Band backgrounds — height driven by dynamic layout */}
      {REGIONS.map((region, idx) => {
        const band = getBandByIndex(bandLayout, idx);
        const bandTop = band.top * zoom + offsetY;
        const bandH = band.height * zoom;
        return (
          <div
            key={region.id}
            style={{
              position: 'absolute',
              top: bandTop,
              left: 0,
              right: 0,
              height: bandH,
              backgroundColor: BAND_COLORS[idx],
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        );
      })}

      {/* Sticky labels — suppressed when the rendered band is too narrow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 48,
          zIndex: 12,
          pointerEvents: 'none',
        }}
      >
        {REGIONS.map((region, idx) => {
          const band = getBandByIndex(bandLayout, idx);
          const bandTop = band.top * zoom + offsetY;
          const bandH = band.height * zoom;
          // Hide label when the band is too small to render it legibly
          if (bandH < LABEL_MIN_SCREEN_HEIGHT) return null;
          let labelTop = bandTop + bandH / 2;
          // Clamp label within band bounds
          labelTop = Math.max(bandTop + 20, Math.min(bandTop + bandH - 20, labelTop));
          // Hide label when entirely off-screen
          if (labelTop < -40 || labelTop > window.innerHeight + 40) return null;

          return (
            <div
              key={region.id}
              style={{
                position: 'absolute',
                top: labelTop,
                left: 8,
                transform: 'translateY(-50%) rotate(-90deg)',
                transformOrigin: 'center center',
                fontSize: 10,
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {region.label}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner Canvas (has access to ReactFlow instance)
// ─────────────────────────────────────────────────────────────────────────────

function CanvasInner() {
  const reactFlow = useReactFlow();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);

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

  // ── WebGL tier state ─────────────────────────────────────────────────────
  // Start centered near year 500 CE at zoom 0.1 (century-level tick view, ~2000 years visible)
  // x = viewportW/2 - year500_canvasX * zoom = 960 - (500-(-5000))*10*0.1 = 960 - 5500 = -4540
  const [rfTransform, setRfTransform] = useState(INITIAL_VIEWPORT);
  const [allFilteredEvents, setAllFilteredEvents] = useState<HistoricalEvent[]>([]);

  // ── Dynamic band layout ──────────────────────────────────────────────────
  // Initialised with equal-height fallback; recomputed whenever the event set changes
  const [bandLayout, setBandLayout] = useState<BandLayout[]>(() => defaultBandLayout());
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setContainerSize({ width: rect.width, height: rect.height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const useWebGL = allFilteredEvents.length > GL_THRESHOLD;

  // Debounce tile fetch key
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

  // Tile query
  const { data: tileData, isLoading } = useQuery({
    queryKey: ['tiles', tileKey],
    queryFn: () => fetchTiles(tileKey),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Keep a ref to rfZoom so build-nodes effect can read current value
  // without having rfZoom as a dependency (which would cause constant rebuilds)
  const rfZoomRef = useRef(rfZoom);
  useEffect(() => { rfZoomRef.current = rfZoom; }, [rfZoom]);

  // Keep a ref to bandLayout for the same reason — avoids spurious flyover triggers
  const bandLayoutRef = useRef<BandLayout[]>(bandLayout);
  useEffect(() => { bandLayoutRef.current = bandLayout; }, [bandLayout]);

  // Build nodes + edges when tile data arrives — rfZoom intentionally excluded
  // from deps; positions are static per-event, LOD is handled by the effect below
  useEffect(() => {
    if (!tileData) return;

    const currentZoom = rfZoomRef.current;
    const threshold = importanceThreshold(currentZoom);
    const filteredEvents = tileData.events.filter(
      (e) => e.importance_score >= threshold
    );

    setAllFilteredEvents(filteredEvents);
    setVisibleEvents(filteredEvents);

    const isMock = filteredEvents.some((e) => String(e.id).length < 10);
    setUsingMockData(isMock);

    // Recompute dynamic band heights based on the new event density
    const newBandLayout = computeBandLayout(filteredEvents);
    setBandLayout(newBandLayout);

    if (filteredEvents.length <= GL_THRESHOLD) {
      const newNodes = filteredEvents.map((e) =>
        eventToNode(e, currentZoom, newBandLayout),
      );
      const eventIds = new Set(filteredEvents.map((e) => String(e.id)));
      const newEdges = (tileData.links ?? [])
        .filter(
          (l) =>
            eventIds.has(String(l.cause_event_id)) &&
            eventIds.has(String(l.effect_event_id))
        )
        .map(linkToEdge);

      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tileData, setNodes, setEdges, setVisibleEvents, setUsingMockData]);

  // Re-apply LOD when zoom changes (ReactFlow mode only)
  useEffect(() => {
    if (!tileData || useWebGL) return;
    const threshold = importanceThreshold(rfZoom);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        hidden: (n.data as HistoricalEvent).importance_score < threshold,
      }))
    );
  }, [rfZoom, tileData, setNodes, useWebGL]);

  // Flyover animation — centres the viewport on the target event's canvas position
  useEffect(() => {
    if (!flyToEvent) return;
    const x = (flyToEvent.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    const region = classifyRegion(flyToEvent.lat, flyToEvent.lng);
    const bandIdx = regionBandIndex(region);
    // Use dynamic layout so the flyover lands in the correct (density-adjusted) band
    const band = getBandByIndex(bandLayoutRef.current, bandIdx);
    const y = band.top + band.height / 2;

    reactFlow.setViewport({ x: 0, y: 0, zoom: 0.3 }, { duration: 500 });
    setTimeout(() => {
      reactFlow.setCenter(x, y, { zoom: 1.2, duration: 1000 });
    }, 600);

    setFlyToEvent(null);
  }, [flyToEvent, reactFlow, setFlyToEvent]);

  // Track RF viewport
  const onMoveHandler: OnMove = useCallback(
    (_event, rfVp) => {
      // Only update visual overlays (timeline ruler, swim lane labels) — do NOT
      // update rfZoom here. Updating store state every frame causes the build-nodes
      // effect to fire continuously, rebuilding the entire nodes array mid-interaction
      // and corrupting React-Flow's internal state.
      setRfTransform({ x: rfVp.x, y: rfVp.y, zoom: rfVp.zoom });
    },
    []
  );

  const onMoveEnd: OnMove = useCallback(
    (_event, rfViewport) => {
      const containerWidth = containerSize.width;
      const zoom = rfViewport.zoom;

      const leftX = -rfViewport.x / zoom;
      const rightX = (containerWidth - rfViewport.x) / zoom;

      const yearMin = Math.floor(leftX / PIXELS_PER_YEAR + BASE_YEAR_MIN);
      const yearMax = Math.ceil(rightX / PIXELS_PER_YEAR + BASE_YEAR_MIN);

      // Update rfZoom here (after interaction ends) so the build-nodes effect
      // only fires once per gesture, not on every animation frame
      setRfZoom(rfViewport.zoom);

      setViewport({
        year_min: Math.max(-5000, yearMin),
        year_max: Math.min(3000, yearMax),
        lat_min: -90,
        lat_max: 90,
        zoom: rfViewport.zoom,
      });
    },
    [containerSize, setViewport, setRfZoom]
  );

  // WebGL click handler
  const handleWebGLClick = useCallback(
    (event: HistoricalEvent) => {
      setSelectedEvent(event.slug);
    },
    [setSelectedEvent]
  );

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* Swim lane backgrounds + labels (behind everything) */}
      <SwimLaneOverlay rfTransform={rfTransform} bandLayout={bandLayout} />

      {/* React Flow — always rendered for pan/zoom interaction */}
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

          {/* Status panel */}
          <Panel position="top-left">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
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
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
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

      {/* ── WebGL overlay (deck.gl) — active when events > GL_THRESHOLD ── */}
      {useWebGL && (
        <WebGLEventLayer
          events={allFilteredEvents}
          rfViewport={rfTransform}
          width={containerSize.width}
          height={containerSize.height}
          onEventClick={handleWebGLClick}
        />
      )}

      {/* Timeline ruler (sticky overlay on top) */}
      <TimelineRuler rfTransform={rfTransform} width={containerSize.width} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Canvas wrapper (provides ReactFlow context)
// ─────────────────────────────────────────────────────────────────────────────

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
