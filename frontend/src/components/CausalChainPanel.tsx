/**
 * CausalChainPanel.tsx
 *
 * A fixed-position right-side panel (~360px wide) that traces the forward or
 * backward causal chain from a selected event. Shows an accordion-style
 * vertical tree of connected events up to 5 hops deep.
 *
 * Reads the selected event from the Zustand store and fetches the causal chain
 * via react-query. Clicking an item in the chain selects that event in the
 * store (which updates the network focus).
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCausalChain } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS } from '../utils/categories';
import type { CausalChainNode } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Named constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum traversal depth for the causal chain query. */
const MAX_DEPTH = 5;

/** Maximum total nodes the backend will return. */
const MAX_NODES = 50;

/** Panel width in pixels. */
const PANEL_WIDTH = 360;

/** Z-index — above the detail panel (110) so it layers correctly. */
const PANEL_Z_INDEX = 115;

/** Height of the TimelineScrubber bar at the bottom of the screen (px). */
const SCRUBBER_HEIGHT = 84;

/** CSS transition for the slide animation. */
const SLIDE_TRANSITION = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

/** Panel background color (dark theme). */
const BG_COLOR = 'rgba(7, 14, 34, 0.97)';

/** Panel border color. */
const BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: format year
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year number for display. Negative years show as "X BCE".
 * @param year - The approximate year (negative for BCE, null for unknown)
 */
function formatYear(year: number | null): string {
  if (year === null) return 'Unknown';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain node component (recursive accordion)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for a single chain node in the accordion tree. */
interface ChainNodeProps {
  node: CausalChainNode;
  isRoot?: boolean;
  onSelect: (slug: string) => void;
}

/**
 * Renders a single node in the causal chain tree. Expandable accordion
 * reveals child nodes when clicked.
 */
function ChainNodeItem({ node, isRoot, onSelect }: ChainNodeProps) {
  const [expanded, setExpanded] = useState(node.depth <= 1);
  const hasChildren = node.children.length > 0;
  const categoryColor = node.event.category
    ? CATEGORY_COLORS[node.event.category] ?? '#6b7280'
    : '#6b7280';

  return (
    <div style={{ marginLeft: isRoot ? 0 : 16 }}>
      {/* Connector arrow (not for root) */}
      {!isRoot && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '2px 0 2px 8px',
            color: '#475569',
            fontSize: 12,
          }}
        >
          <span style={{ marginRight: 4 }}>↓</span>
          <span style={{ fontSize: 10, color: '#334155' }}>depth {node.depth}</span>
        </div>
      )}

      {/* Node card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 8,
          backgroundColor: isRoot ? 'rgba(96, 165, 250, 0.12)' : 'rgba(255,255,255,0.04)',
          border: isRoot
            ? '1px solid rgba(96, 165, 250, 0.3)'
            : '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onClick={() => onSelect(node.event.slug)}
        title={`Click to navigate to ${node.event.title}`}
      >
        {/* Category dot */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: categoryColor,
            flexShrink: 0,
          }}
        />

        {/* Event info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: isRoot ? 700 : 600,
              color: isRoot ? '#93c5fd' : '#e2e8f0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {node.event.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'monospace' }}>
              {formatYear(node.event.year_approx)}
            </span>
            {node.event.category && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 3,
                  backgroundColor: `${categoryColor}22`,
                  color: categoryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {node.event.category}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '2px 4px',
              fontSize: 14,
              flexShrink: 0,
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
            aria-label={expanded ? 'Collapse children' : 'Expand children'}
          >
            ›
          </button>
        )}
      </div>

      {/* Children (accordion) */}
      {hasChildren && expanded && (
        <div style={{ marginTop: 2 }}>
          {node.children.map((child) => (
            <ChainNodeItem key={child.event.id} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main panel component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CausalChainPanel — right-side slide-in panel that traces forward/backward
 * causal chains from the currently selected event.
 *
 * Shows an accordion tree of causally linked events, up to
 * {@link MAX_DEPTH} hops and {@link MAX_NODES} total nodes.
 */
export default function CausalChainPanel() {
  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);
  const causalChainOpen = useAppStore((s) => s.causalChainOpen);
  const setCausalChainOpen = useAppStore((s) => s.setCausalChainOpen);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const isOpen = causalChainOpen && selectedEventSlug !== null;

  const { data: chainData, isLoading } = useQuery({
    queryKey: ['causal-chain', selectedEventSlug, direction],
    queryFn: () => fetchCausalChain(selectedEventSlug!, direction, MAX_DEPTH),
    enabled: isOpen && !!selectedEventSlug,
    staleTime: 5 * 60_000,
  });

  const handleSelectEvent = (slug: string) => {
    setSelectedEvent(slug);
  };

  const handleClose = () => {
    setCausalChainOpen(false);
  };

  const hasChain = chainData && chainData.chain.length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: SCRUBBER_HEIGHT,
        width: PANEL_WIDTH,
        backgroundColor: BG_COLOR,
        backdropFilter: 'blur(16px)',
        borderLeft: `1px solid ${BORDER_COLOR}`,
        zIndex: PANEL_Z_INDEX,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
        transform: isOpen ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
        transition: SLIDE_TRANSITION,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '16px 16px 12px',
          borderBottom: `1px solid ${BORDER_COLOR}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Causal Chain
            </div>
            {chainData?.root && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {chainData.root.title}
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Close causal chain panel"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 8,
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            ×
          </button>
        </div>

        {/* Direction toggle */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            marginTop: 10,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: 6,
            padding: 3,
          }}
        >
          <button
            onClick={() => setDirection('forward')}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 4,
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: direction === 'forward' ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
              color: direction === 'forward' ? '#93c5fd' : '#64748b',
            }}
          >
            Forward →
          </button>
          <button
            onClick={() => setDirection('backward')}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 4,
              border: 'none',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              backgroundColor: direction === 'backward' ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: direction === 'backward' ? '#c4b5fd' : '#64748b',
            }}
          >
            ← Backward
          </button>
        </div>
      </div>

      {/* ── Scrollable chain content ────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 14px' }}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: 24,
                height: 24,
                border: '2px solid rgba(255,255,255,0.1)',
                borderTopColor: '#60a5fa',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        )}

        {!isLoading && hasChain && chainData.root && (
          <div>
            {/* Root event */}
            <ChainNodeItem
              node={{
                event: chainData.root,
                depth: 0,
                children: chainData.chain,
              }}
              isRoot
              onSelect={handleSelectEvent}
            />

            {/* Summary */}
            <div
              style={{
                marginTop: 12,
                padding: '8px 12px',
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,0.03)',
                fontSize: 11,
                color: '#475569',
                textAlign: 'center',
              }}
            >
              {chainData.total_nodes} event{chainData.total_nodes !== 1 ? 's' : ''} in{' '}
              {direction === 'forward' ? 'forward' : 'backward'} chain
              {chainData.total_nodes >= MAX_NODES && ' (limit reached)'}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasChain && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 16px',
              color: '#475569',
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.5 }}>~</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
              No causal links found for this event
            </div>
            <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.5 }}>
              Try switching between forward and backward directions,
              or zoom out and explore events with more connections.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
