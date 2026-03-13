/**
 * PeoplePage — Historical Figures Network visualization.
 *
 * Owns: People network graph rendering via React Flow, search/filter, detail panel.
 * Does NOT own: data fetching logic (delegated to api/people.ts), main timeline.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPeopleNetwork, type NetworkNode, type NetworkEdge } from '../api/people';
import PersonNode from '../components/PersonNode';
import PersonDetailPanel from '../components/PersonDetailPanel';
import {
  ROLE_COLORS,
  EDGE_THIN_WIDTH,
  EDGE_THICK_WIDTH,
  SHARED_EVENT_THICK_THRESHOLD,
} from '../constants/people';

/** Custom node types registered with React Flow. */
const nodeTypes: NodeTypes = {
  person: PersonNode,
};

/** Stale time for people network query (5 minutes). */
const NETWORK_STALE_TIME = 5 * 60 * 1000;

/**
 * Layout people nodes in a force-like circular arrangement.
 * Uses importance (event count) to determine distance from center.
 */
function layoutNodes(nodes: NetworkNode[]): Node[] {
  const count = nodes.length;
  if (count === 0) return [];

  /* Golden angle spiral — distributes nodes evenly in a circle */
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  const BASE_RADIUS = 80;
  const RADIUS_SCALE = 18;

  return nodes.map((n, i) => {
    const angle = i * GOLDEN_ANGLE;
    const radius = BASE_RADIUS + Math.sqrt(i) * RADIUS_SCALE;

    return {
      id: n.id,
      type: 'person',
      position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      data: {
        name: n.name,
        bornYear: n.born_year,
        diedYear: n.died_year,
        roles: n.roles,
        imageUrl: n.image_url,
      },
    };
  });
}

/**
 * Convert API network edges to React Flow edges with styled thickness.
 */
function layoutEdges(edges: NetworkEdge[]): Edge[] {
  return edges.map((e, i) => {
    const isThick = e.weight >= SHARED_EVENT_THICK_THRESHOLD;
    const isContemporary = e.edge_type === 'contemporary';

    return {
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      style: {
        strokeWidth: isThick ? EDGE_THICK_WIDTH : EDGE_THIN_WIDTH,
        stroke: isContemporary ? '#94a3b8' : '#64748b',
        strokeDasharray: isContemporary ? '5 5' : undefined,
        opacity: isContemporary ? 0.3 : 0.5,
      },
    };
  });
}

/**
 * Inner component — needs ReactFlowProvider context for useReactFlow().
 */
function PeopleGraphInner() {
  const { fitView } = useReactFlow();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: network, isLoading, error } = useQuery({
    queryKey: ['people-network'],
    queryFn: fetchPeopleNetwork,
    staleTime: NETWORK_STALE_TIME,
  });

  const flowNodes = useMemo(
    () => (network ? layoutNodes(network.nodes) : []),
    [network],
  );
  const flowEdges = useMemo(
    () => (network ? layoutEdges(network.edges) : []),
    [network],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  // Sync when data arrives
  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Fit view once nodes load
  useEffect(() => {
    if (nodes.length > 0) {
      // Small delay to let React Flow render
      const t = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(t);
    }
  }, [nodes.length, fitView]);

  // Search highlighting — update node styles when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Reset all nodes to full opacity
      setNodes((nds) =>
        nds.map((n) => ({ ...n, style: { ...n.style, opacity: 1 } })),
      );
      return;
    }

    const lower = searchQuery.toLowerCase();
    setNodes((nds) =>
      nds.map((n) => {
        const match = (n.data.name as string).toLowerCase().includes(lower);
        return { ...n, style: { ...n.style, opacity: match ? 1 : 0.15 } };
      }),
    );
  }, [searchQuery, setNodes]);

  /** Handle node click — open detail panel. */
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedPersonId(node.id);
  }, []);

  /** Focus on a specific person and select them. */
  const focusPerson = useCallback(
    (personId: string) => {
      setSelectedPersonId(personId);
      const node = nodes.find((n) => n.id === personId);
      if (node) {
        fitView({ nodes: [node], duration: 500, padding: 1 });
      }
    },
    [nodes, fitView],
  );

  // Filtered search results for dropdown
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !network) return [];
    const lower = searchQuery.toLowerCase();
    return network.nodes
      .filter((n) => n.name.toLowerCase().includes(lower))
      .slice(0, 8);
  }, [searchQuery, network]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Loading people network…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: '#ef4444', fontSize: '1.2rem' }}>Failed to load people network.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar with nav + search */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.75rem 1.5rem', background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)', borderBottom: '1px solid #1e293b',
      }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← Timeline
        </Link>
        <h1 style={{ color: '#e2e8f0', fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>
          Historical Figures Network
        </h1>
        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
          {network?.nodes.length ?? 0} people · {network?.edges.length ?? 0} connections
        </span>

        {/* Search */}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search people…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '0.5rem',
              border: '1px solid #334155', background: '#1e293b',
              color: '#e2e8f0', fontSize: '0.875rem', width: '240px',
              outline: 'none',
            }}
          />
          {/* Search dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '0.25rem',
              background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem',
              overflow: 'hidden', minWidth: '240px',
            }}>
              {searchResults.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { focusPerson(r.id); setSearchQuery(''); }}
                  style={{
                    display: 'block', width: '100%', padding: '0.5rem 1rem',
                    border: 'none', background: 'transparent', color: '#e2e8f0',
                    textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = '#334155'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'transparent'; }}
                >
                  {r.name}
                  {r.born_year != null && (
                    <span style={{ color: '#64748b', marginLeft: '0.5rem' }}>
                      b. {r.born_year}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fit all button */}
        <button
          onClick={() => fitView({ padding: 0.2, duration: 500 })}
          style={{
            padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
            border: '1px solid #334155', background: '#1e293b',
            color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem',
          }}
        >
          Fit All
        </button>
      </div>

      {/* React Flow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
        <Controls
          position="bottom-left"
          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }}
        />
      </ReactFlow>

      {/* Role legend */}
      <div style={{
        position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 10,
        background: 'rgba(15, 23, 42, 0.9)', padding: '0.75rem 1rem',
        borderRadius: '0.5rem', border: '1px solid #1e293b',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.7rem', margin: '0 0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Roles
        </p>
        {Object.entries(ROLE_COLORS).map(([role, color]) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
            <span style={{ color: '#cbd5e1', fontSize: '0.75rem', textTransform: 'capitalize' }}>{role}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      {selectedPersonId && (
        <PersonDetailPanel
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  );
}

/**
 * PeoplePage — wrapper providing ReactFlowProvider context.
 */
export default function PeoplePage() {
  return (
    <ReactFlowProvider>
      <PeopleGraphInner />
    </ReactFlowProvider>
  );
}
