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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useQuery } from '@tanstack/react-query';

import EventNode from './EventNode';
import CausalityEdge from './CausalityEdge';
import WebGLEventLayer, { GL_THRESHOLD } from './WebGLEventLayer';
import { useAppStore } from '../store';
import { fetchTiles } from '../api/client';
import { CONNECTION_COLORS, importanceThreshold } from '../utils/categories';
import { CANVAS_CONSTANTS } from '../types';
import type { HistoricalEvent, CausalityLink, CanvasViewport } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const { LAT_MIN, LAT_MAX, CANVAS_HEIGHT, PIXELS_PER_YEAR, BASE_YEAR_MIN } = CANVAS_CONSTANTS;

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// Convert events + links → react-flow nodes + edges
// ─────────────────────────────────────────────────────────────────────────────

function eventToNode(event: HistoricalEvent, rfZoom: number): Node {
  const x = (event.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
  const fraction = (LAT_MAX - event.lat) / (LAT_MAX - LAT_MIN);
  const y = fraction * CANVAS_HEIGHT;

  return {
    id: String(event.id),           // ensure string ID (UUIDs from backend are already strings)
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
// MapLibre background
// ─────────────────────────────────────────────────────────────────────────────

function MapBackground() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
            maxzoom: 19,
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
        glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
      },
      center: [10, 45],
      zoom: 2.5,
      interactive: false,
      attributionControl: false,
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.45,
        filter: 'saturate(0.5) brightness(0.35) hue-rotate(200deg)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
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
  // Real-time RF viewport transform for WebGL projection
  const [rfTransform, setRfTransform] = useState({ x: 20, y: 80, zoom: 0.22 });
  // All events (unfiltered by LOD) for the WebGL layer
  const [allFilteredEvents, setAllFilteredEvents] = useState<HistoricalEvent[]>([]);
  // Container size for deck.gl
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

  // Decide render mode
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

  // Build nodes + edges when tile data arrives
  useEffect(() => {
    if (!tileData) return;

    const threshold = importanceThreshold(rfZoom);
    const filteredEvents = tileData.events.filter(
      (e) => e.importance_score >= threshold
    );

    setAllFilteredEvents(filteredEvents);
    setVisibleEvents(filteredEvents);

    // Detect mock data
    const isMock = filteredEvents.some((e) => String(e.id).length < 10);
    setUsingMockData(isMock);

    if (filteredEvents.length <= GL_THRESHOLD) {
      // ReactFlow mode — build nodes + edges
      const newNodes = filteredEvents.map((e) => eventToNode(e, rfZoom));
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
      // WebGL mode — clear RF nodes so ReactFlow is just the pan/zoom layer
      setNodes([]);
      setEdges([]);
    }
  }, [tileData, rfZoom, setNodes, setEdges, setVisibleEvents, setUsingMockData]);

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

  // Flyover animation
  useEffect(() => {
    if (!flyToEvent) return;
    const x = (flyToEvent.year_approx - BASE_YEAR_MIN) * PIXELS_PER_YEAR;
    const fraction = (LAT_MAX - flyToEvent.lat) / (LAT_MAX - LAT_MIN);
    const y = fraction * CANVAS_HEIGHT;

    reactFlow.setViewport({ x: 0, y: 0, zoom: 0.3 }, { duration: 500 });
    setTimeout(() => {
      reactFlow.setCenter(x, y, { zoom: 1.2, duration: 1000 });
    }, 600);

    setFlyToEvent(null);
  }, [flyToEvent, reactFlow, setFlyToEvent]);

  // Track RF viewport — used for both the geo viewport store AND the WebGL projection
  const onMoveHandler: OnMove = useCallback(
    (_event, rfVp) => {
      // Update real-time transform for WebGL
      setRfTransform({ x: rfVp.x, y: rfVp.y, zoom: rfVp.zoom });
      setRfZoom(rfVp.zoom);
    },
    [setRfZoom]
  );

  const onMoveEnd: OnMove = useCallback(
    (_event, rfViewport) => {
      const containerWidth = containerSize.width;
      const containerHeight = containerSize.height - 80;
      const zoom = rfViewport.zoom;

      const leftX = -rfViewport.x / zoom;
      const rightX = (containerWidth - rfViewport.x) / zoom;
      const topY = -rfViewport.y / zoom;
      const bottomY = (containerHeight - rfViewport.y) / zoom;

      const yearMin = Math.floor(leftX / PIXELS_PER_YEAR + BASE_YEAR_MIN);
      const yearMax = Math.ceil(rightX / PIXELS_PER_YEAR + BASE_YEAR_MIN);
      const latMax = LAT_MAX - (topY / CANVAS_HEIGHT) * (LAT_MAX - LAT_MIN);
      const latMin = LAT_MAX - (bottomY / CANVAS_HEIGHT) * (LAT_MAX - LAT_MIN);

      setViewport({
        year_min: Math.max(-5000, yearMin),
        year_max: Math.min(3000, yearMax),
        lat_min: Math.max(-90, latMin),
        lat_max: Math.min(90, latMax),
        zoom: Math.round(rfViewport.zoom * 5),
      });
    },
    [containerSize, setViewport]
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
      {/* Map background */}
      <MapBackground />

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
          defaultViewport={{ x: 20, y: 80, zoom: 0.22 }}
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

          {/* Lat axis labels */}
          <Panel position="center-left" style={{ pointerEvents: 'none' }}>
            {[60, 45, 30, 15, 0, -15, -30].map((lat) => (
              <div
                key={lat}
                style={{
                  position: 'absolute',
                  top: `${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
                  right: 0,
                  transform: 'translateY(-50%)',
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.18)',
                  fontFamily: 'monospace',
                  paddingRight: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {lat}°
              </div>
            ))}
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

      {/* Equator line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${((LAT_MAX - 0) / (LAT_MAX - LAT_MIN)) * 100}%`,
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.07)',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported Canvas wrapper (provides ReactFlow context)
// ─────────────────────────────────────────────────────────────────────────────

import { ReactFlowProvider } from '@xyflow/react';

export default function Canvas() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#070e22',
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
