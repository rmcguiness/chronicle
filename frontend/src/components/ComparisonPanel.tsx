/**
 * ComparisonPanel.tsx
 *
 * Bottom slide-in panel showing a side-by-side comparison of two selected events.
 * Displays titles, dates, categories, importance, shared connections, and
 * timeline distance.
 */

import type { HistoricalEvent, CausalityLink } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';

const COMPARE_COLOR_A = '#3b82f6';
const COMPARE_COLOR_B = '#f97316';

interface ComparisonPanelProps {
  eventA: HistoricalEvent;
  eventB: HistoricalEvent;
  edges: CausalityLink[];
  onClose: () => void;
}

function getNeighborIds(eventId: string, edges: CausalityLink[]): Set<string> {
  const neighbors = new Set<string>();
  for (const edge of edges) {
    const cause = String(edge.cause_event_id);
    const effect = String(edge.effect_event_id);
    if (cause === eventId) neighbors.add(effect);
    if (effect === eventId) neighbors.add(cause);
  }
  return neighbors;
}

function formatDistance(yearA: number, yearB: number): string {
  const diff = Math.abs(yearA - yearB);
  if (diff === 0) return 'Same year';
  if (diff === 1) return '~1 year apart';
  if (diff < 100) return `~${diff} years apart`;
  return `~${Math.round(diff / 10) * 10} years apart`;
}

function importanceStars(score: number): string {
  const count = Math.round(score * 5);
  return '\u2605'.repeat(count) + '\u2606'.repeat(5 - count);
}

function EventColumn({ event, color }: { event: HistoricalEvent; color: string }) {
  const catColor = CATEGORY_COLORS[event.category] ?? '#6b7280';
  const catIcon = CATEGORY_ICONS[event.category] ?? '\u25CF';
  const description = (event as HistoricalEvent & { description?: string }).description;
  const shortDesc = description
    ? description.length > 120
      ? description.slice(0, 120) + '\u2026'
      : description
    : null;

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#f1f5f9',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {event.title}
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
        {event.date_display ?? event.year_approx}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 12,
            backgroundColor: catColor + '22',
            border: `1px solid ${catColor}44`,
            fontSize: 12,
            color: catColor,
            fontWeight: 600,
          }}
        >
          <span>{catIcon}</span>
          {event.category}
        </span>
      </div>
      <div style={{ fontSize: 13, color: '#eab308', letterSpacing: 2, marginBottom: 4 }}>
        {importanceStars(event.importance_score)}
      </div>
      {shortDesc && (
        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
          {shortDesc}
        </div>
      )}
    </div>
  );
}

export default function ComparisonPanel({ eventA, eventB, edges, onClose }: ComparisonPanelProps) {
  const neighborsA = getNeighborIds(String(eventA.id), edges);
  const neighborsB = getNeighborIds(String(eventB.id), edges);

  // Find shared connections: events in both neighbor sets
  const sharedIds = new Set<string>();
  for (const id of neighborsA) {
    if (neighborsB.has(id)) sharedIds.add(id);
  }

  // Also check if they are directly connected to each other
  const directlyConnected = neighborsA.has(String(eventB.id));

  // We need event titles for shared connections — build a map from edges
  // Since we only have edges, we'll show IDs. But the edge data doesn't have titles.
  // We'll note direct connection and shared neighbor count.

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 280,
        zIndex: 50,
        backgroundColor: 'rgba(7,14,34,0.97)',
        borderTop: '1px solid rgba(96,165,250,0.2)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        animation: 'slideUpComparison 200ms ease-out',
      }}
    >
      <style>{`
        @keyframes slideUpComparison {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      {/* Close button */}
      <button
        onClick={onClose}
        title="Close comparison"
        style={{
          position: 'absolute',
          top: 12,
          right: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          color: '#94a3b8',
          fontSize: 16,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ padding: '12px 20px 0', fontSize: 12, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Event Comparison
      </div>

      {/* Content: two columns + center */}
      <div style={{ flex: 1, display: 'flex', padding: '12px 20px', gap: 24, overflow: 'auto' }}>
        <EventColumn event={eventA} color={COMPARE_COLOR_A} />

        {/* Center column — timeline distance & shared connections */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '0 12px',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Timeline Distance
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0' }}>
              {formatDistance(eventA.year_approx, eventB.year_approx)}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Shared Connections
            </div>
            {directlyConnected && (
              <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 600, marginBottom: 4 }}>
                Directly connected
              </div>
            )}
            {sharedIds.size > 0 ? (
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {sharedIds.size} shared neighbor{sharedIds.size > 1 ? 's' : ''}
              </div>
            ) : !directlyConnected ? (
              <div style={{ fontSize: 13, color: '#475569' }}>
                No direct connections
              </div>
            ) : null}
          </div>
        </div>

        <EventColumn event={eventB} color={COMPARE_COLOR_B} />
      </div>
    </div>
  );
}
