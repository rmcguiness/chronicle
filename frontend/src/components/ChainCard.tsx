/**
 * ChainCard.tsx — single event card in the causal chain flow.
 *
 * Displays: year, title, category badge, short description.
 * Supports: expand/collapse for full description, click to re-root chain,
 * "View on Timeline" to navigate back to the main network view.
 *
 * Does NOT own: chain data fetching, flow layout, routing.
 */
import { useState, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

/** Event data as returned by the chain API. */
export interface ChainEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
  region: string | null;
  importance_score: number;
  short_description: string | null;
}

interface ChainCardProps {
  /** The event data to display. */
  event: ChainEvent;
  /** Whether this is the root event of the chain. */
  isRoot?: boolean;
  /** Callback when user clicks the card to re-root the chain. */
  onReRoot: (slug: string) => void;
  /** Callback to navigate to the timeline with this event selected. */
  onViewTimeline: (slug: string) => void;
}

// ── Category color map ───────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  political: '#f87171',
  military: '#fb923c',
  cultural: '#a78bfa',
  scientific: '#34d399',
  economic: '#fbbf24',
  religious: '#f472b6',
  social: '#60a5fa',
  technological: '#2dd4bf',
  exploration: '#818cf8',
  diplomatic: '#c084fc',
};

/** Get badge color for a category, with a sensible default. */
const getCategoryColor = (category: string | null): string =>
  category ? CATEGORY_COLORS[category.toLowerCase()] || '#64748b' : '#64748b';

/**
 * ChainCard — renders a single event in the vertical chain flow.
 *
 * @param props - ChainCardProps
 * @returns JSX element for the event card
 */
export default function ChainCard({ event, isRoot = false, onReRoot, onViewTimeline }: ChainCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = useCallback(() => {
    if (!isRoot) {
      onReRoot(event.slug);
    }
  }, [isRoot, event.slug, onReRoot]);

  const handleViewTimeline = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onViewTimeline(event.slug);
  }, [event.slug, onViewTimeline]);

  const handleToggleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  const categoryColor = getCategoryColor(event.category);
  const yearDisplay = event.year_approx
    ? event.year_approx < 0
      ? `${Math.abs(event.year_approx)} BCE`
      : `${event.year_approx} CE`
    : 'Date unknown';

  return (
    <div
      onClick={handleClick}
      style={{
        background: isRoot
          ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))'
          : 'rgba(15,23,42,0.8)',
        border: `1px solid ${isRoot ? 'rgba(99,102,241,0.4)' : 'rgba(148,163,184,0.15)'}`,
        borderRadius: 12,
        padding: '16px 20px',
        cursor: isRoot ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        maxWidth: 480,
        width: '100%',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => {
        if (!isRoot) {
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={e => {
        if (!isRoot) {
          e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Header: year + category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {yearDisplay}
        </span>
        {event.category && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: categoryColor,
              background: `${categoryColor}20`,
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {event.category}
          </span>
        )}
        {isRoot && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#6366f1',
              background: 'rgba(99,102,241,0.15)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            Root
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{ margin: '0 0 4px 0', fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
        {event.title}
      </h3>

      {/* Region */}
      {event.region && (
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
          📍 {event.region}
        </div>
      )}

      {/* Description (expandable) */}
      {event.short_description && (
        <div style={{ marginBottom: 8 }}>
          <p style={{
            margin: 0,
            fontSize: 13,
            color: '#94a3b8',
            lineHeight: 1.5,
            overflow: expanded ? 'visible' : 'hidden',
            display: expanded ? 'block' : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 2,
            WebkitBoxOrient: 'vertical' as const,
          }}>
            {event.short_description}
          </p>
          <button
            onClick={handleToggleExpand}
            style={{
              background: 'none',
              border: 'none',
              color: '#6366f1',
              cursor: 'pointer',
              fontSize: 12,
              padding: '4px 0',
              fontFamily: 'inherit',
            }}
          >
            {expanded ? '▲ Less' : '▼ More'}
          </button>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={handleViewTimeline}
          style={{
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          View on Timeline →
        </button>
        {!isRoot && (
          <button
            onClick={handleClick}
            style={{
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 500,
            }}
          >
            Explore from here
          </button>
        )}
      </div>
    </div>
  );
}
