/**
 * ChainFlow.tsx — vertical flow renderer for causal chains.
 *
 * Renders a top-to-bottom (forward) or bottom-to-top (backward) vertical flow
 * of ChainCard components connected by labeled arrows.
 *
 * Owns: flow layout, arrow rendering, chain stats display.
 * Does NOT own: data fetching, card internals, routing.
 */
import ChainCard from './ChainCard';
import type { ChainEvent } from './ChainCard';

// ── Types ────────────────────────────────────────────────────────────────────

/** A single link in the chain (from API response). */
export interface ChainLinkData {
  event: ChainEvent;
  link_description: string | null;
  link_type: string;
  strength: number;
  hop_number: number;
}

interface ChainFlowProps {
  /** The root event of the chain. */
  root: ChainEvent;
  /** Ordered chain links from API. */
  chain: ChainLinkData[];
  /** Direction of traversal. */
  direction: 'forward' | 'backward';
  /** Callback when user clicks a card to re-root. */
  onReRoot: (slug: string) => void;
  /** Callback to view event on timeline. */
  onViewTimeline: (slug: string) => void;
}

// ── Link type labels ─────────────────────────────────────────────────────────

const LINK_TYPE_LABELS: Record<string, string> = {
  direct: 'caused',
  indirect: 'influenced',
  contributing: 'contributed to',
  disputed: 'disputed link',
};

/**
 * Arrow connector between chain cards with an optional label.
 *
 * @param label - The relationship label to show on the arrow
 * @param linkType - The type of causal link
 */
function ChainArrow({ label, linkType }: { label: string | null; linkType: string }) {
  const displayLabel = label || LINK_TYPE_LABELS[linkType] || 'led to';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
      <div style={{ width: 2, height: 16, background: 'rgba(99,102,241,0.3)' }} />
      <div
        style={{
          fontSize: 11,
          color: '#6366f1',
          background: 'rgba(99,102,241,0.08)',
          padding: '2px 10px',
          borderRadius: 10,
          fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        {displayLabel}
      </div>
      <div style={{ width: 2, height: 16, background: 'rgba(99,102,241,0.3)' }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid rgba(99,102,241,0.4)',
        }}
      />
    </div>
  );
}

/**
 * ChainFlow — renders the full vertical chain visualization.
 *
 * @param props - ChainFlowProps
 * @returns JSX element for the vertical chain flow
 */
export default function ChainFlow({ root, chain, direction, onReRoot, onViewTimeline }: ChainFlowProps) {
  if (chain.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
        <p style={{ fontSize: 15, margin: 0 }}>
          No {direction === 'forward' ? 'effects' : 'causes'} found for this event.
        </p>
        <p style={{ fontSize: 13, margin: '8px 0 0', color: '#475569' }}>
          Try switching direction or increasing the depth.
        </p>
      </div>
    );
  }

  // Group by hop number for visual clarity
  const hops = new Map<number, ChainLinkData[]>();
  for (const link of chain) {
    const existing = hops.get(link.hop_number) || [];
    existing.push(link);
    hops.set(link.hop_number, existing);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '20px 0' }}>
      {/* Root event */}
      <ChainCard event={root} isRoot onReRoot={onReRoot} onViewTimeline={onViewTimeline} />

      {/* Chain links by hop */}
      {Array.from(hops.entries())
        .sort(([a], [b]) => a - b)
        .map(([hopNum, links]) =>
          links.map((link, idx) => (
            <div key={`${hopNum}-${idx}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ChainArrow label={link.link_description} linkType={link.link_type} />
              <ChainCard event={link.event} onReRoot={onReRoot} onViewTimeline={onViewTimeline} />
            </div>
          ))
        )}
    </div>
  );
}
