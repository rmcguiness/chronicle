/**
 * NetworkView.tsx
 *
 * Force-directed graph view of historical events and their causality links.
 * Events are rendered as nodes (styled by category, sized by importance_score)
 * and causality links as directed edges with relationship_type labels.
 *
 * Owns: d3-force layout computation, react-flow rendering of the network graph.
 * Does NOT own: event detail panel, data fetching strategy, view mode toggling.
 */

import { useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';

import EventNode from './EventNode';
import CausalityEdge from './CausalityEdge';
import { fetchTiles, fetchAllCausalityLinks } from '../api/client';
import { CONNECTION_COLORS } from '../utils/categories';
import type { HistoricalEvent, CausalityLink } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum node size (px) for the least important events. */
const MIN_NODE_SIZE = 24;

/** Maximum node size (px) for the most important events. */
const MAX_NODE_SIZE = 56;

/** Viewport to request all events from the tile endpoint. */
const FULL_VIEWPORT = {
  year_min: -5000,
  year_max: 2100,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

const NODE_TYPES = { event: EventNode };
const EDGE_TYPES = { causality: CausalityEdge };

// ─────────────────────────────────────────────────────────────────────────────
// D3-force layout helpers
// ─────────────────────────────────────────────────────────────────────────────

interface ForceNode extends SimulationNodeDatum {
  id: string;
  event: HistoricalEvent;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  linkData: CausalityLink;
}

/**
 * Compute node size based on importance_score (0–1).
 * Linearly interpolates between MIN_NODE_SIZE and MAX_NODE_SIZE.
 */
function nodeSize(importance: number): number {
  return MIN_NODE_SIZE + importance * (MAX_NODE_SIZE - MIN_NODE_SIZE);
}

/**
 * Run a d3-force simulation synchronously and return positioned nodes.
 * We tick the simulation to completion rather than animating it.
 */
function computeForceLayout(
  events: HistoricalEvent[],
  links: CausalityLink[],
): { nodes: Node[]; edges: Edge[] } {
  // Build force nodes
  const forceNodes: ForceNode[] = events.map((e) => ({
    id: String(e.id),
    event: e,
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
  }));

  const nodeIdSet = new Set(forceNodes.map((n) => n.id));

  // Filter links to only those connecting visible events
  const validLinks = links.filter(
    (l) =>
      nodeIdSet.has(String(l.cause_event_id)) &&
      nodeIdSet.has(String(l.effect_event_id)),
  );

  const forceLinks: ForceLink[] = validLinks.map((l) => ({
    source: String(l.cause_event_id),
    target: String(l.effect_event_id),
    linkData: l,
  }));

  // Run simulation synchronously
  const simulation = forceSimulation<ForceNode>(forceNodes)
    .force(
      'link',
      forceLink<ForceNode, ForceLink>(forceLinks)
        .id((d) => d.id)
        .distance(150),
    )
    .force('charge', forceManyBody().strength(-300))
    .force('center', forceCenter(0, 0))
    .force('collide', forceCollide<ForceNode>().radius((d) => nodeSize(d.event.importance_score) / 2 + 10))
    .stop();

  // Tick to completion
  const TICK_COUNT = 300;
  for (let i = 0; i < TICK_COUNT; i++) {
    simulation.tick();
  }

  // Convert to react-flow nodes
  const rfNodes: Node[] = forceNodes.map((fn) => ({
    id: fn.id,
    type: 'event',
    position: { x: fn.x ?? 0, y: fn.y ?? 0 },
    data: { ...fn.event, showLabel: true },
    selectable: true,
    draggable: true,
  }));

  // Convert to react-flow edges
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
        width: 16,
        height: 16,
      },
      animated: l.connection_type === 'causes',
      style: { stroke: color },
      label: l.connection_type,
      labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
      labelBgStyle: { fill: 'rgba(15,17,23,0.85)' },
      labelBgPadding: [4, 2] as [number, number],
    };
  });

  return { nodes: rfNodes, edges: rfEdges };
}

// ─────────────────────────────────────────────────────────────────────────────
// NetworkViewInner — main component (inside ReactFlowProvider)
// ─────────────────────────────────────────────────────────────────────────────

function NetworkViewInner() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes, onNodesChange] = useNodesState([] as any[]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as any[]);

  // Fetch all events via the tile endpoint with a broad viewport
  const { data: tileData, isLoading: tilesLoading } = useQuery({
    queryKey: ['network-tiles'],
    queryFn: () => fetchTiles(FULL_VIEWPORT),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch all causality links
  const { data: allLinks, isLoading: linksLoading } = useQuery({
    queryKey: ['network-causality'],
    queryFn: fetchAllCausalityLinks,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = tilesLoading || linksLoading;

  // Compute layout when data arrives
  useEffect(() => {
    if (!tileData?.events) return;

    const events = tileData.events;
    // Prefer dedicated causality endpoint; fall back to tile links
    const links = allLinks ?? tileData.links ?? [];

    const { nodes: rfNodes, edges: rfEdges } = computeForceLayout(events, links);
    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [tileData, allLinks, setNodes, setEdges]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        minZoom={0.05}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
        elementsSelectable
        nodesDraggable
        panOnScroll={false}
        zoomOnScroll
        panOnDrag
      >
        <Background
          color="rgba(255,255,255,0.025)"
          gap={50}
          size={1}
          style={{ opacity: 0.5 }}
        />
      </ReactFlow>

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
          <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
          Loading network…
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Exported NetworkView wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NetworkView — force-directed graph of events and causality links.
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
      `}</style>

      <ReactFlowProvider>
        <NetworkViewInner />
      </ReactFlowProvider>
    </div>
  );
}
