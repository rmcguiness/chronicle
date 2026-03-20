/**
 * ParallelEventCard — compact event card for the parallel timeline view.
 *
 * Displays: year badge, title, category icon, one-line description.
 * Optionally shows a cross-link indicator when the event has a
 * causality connection to an event in the other region.
 *
 * Does NOT own: data fetching, layout positioning, scroll synchronisation.
 */

import { motion } from 'framer-motion';

/** Map event categories to display icons. */
const CATEGORY_ICONS: Record<string, string> = {
  war: '⚔️',
  discovery: '🔬',
  political: '🏛️',
  cultural: '🎭',
  natural: '🌍',
  person: '👤',
};

export interface ParallelEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  event_category: string | null;
  importance_score: number;
  article_summary: string | null;
  region: string | null;
}

interface ParallelEventCardProps {
  event: ParallelEvent;
  hasCrossLink?: boolean;
}

/** Maximum characters for the summary line. */
const SUMMARY_MAX_LENGTH = 120;

function formatYear(year: number | null): string {
  if (year === null) return '???';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

/**
 * ParallelEventCard — a compact card showing one event in the parallel timeline.
 */
export default function ParallelEventCard({ event, hasCrossLink = false }: ParallelEventCardProps) {
  const icon = CATEGORY_ICONS[event.event_category ?? ''] ?? '📌';
  const summary = event.article_summary
    ? truncate(event.article_summary, SUMMARY_MAX_LENGTH)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        padding: '10px 14px',
        borderRadius: '8px',
        background: hasCrossLink ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.04)',
        border: hasCrossLink ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255,255,255,0.08)',
        marginBottom: '6px',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.08)' }}
    >
      <div style={{
        minWidth: '72px', padding: '3px 8px', borderRadius: '4px',
        background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd',
        fontSize: '12px', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap',
      }}>
        {formatYear(event.year_approx)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span style={{
            fontSize: '14px', fontWeight: 600, color: '#e2e8f0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {event.title}
          </span>
          {hasCrossLink && (
            <span title="Connected to an event in the other region" style={{ fontSize: '12px', color: '#818cf8' }}>↔</span>
          )}
        </div>
        {summary && (
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4 }}>
            {summary}
          </div>
        )}
      </div>
    </motion.div>
  );
}
