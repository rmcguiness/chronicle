/**
 * TodayInHistoryPage — dedicated /today page.
 *
 * Owns: page layout, data fetching via /api/today, event card rendering,
 *       share-this-date button, link back to main timeline.
 * Does NOT own: event detail, canvas navigation.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTodayInHistory } from '../api/client';
import type { TodayEvent } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const colors = {
  bg: '#070e22',
  card: 'rgba(255,255,255,0.03)',
  cardBorder: 'rgba(255,255,255,0.06)',
  cardHover: 'rgba(255,255,255,0.07)',
  accent: '#60a5fa',
  text: 'rgba(255,255,255,0.9)',
  textMuted: 'rgba(255,255,255,0.5)',
  textDim: 'rgba(255,255,255,0.35)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function yearLabel(year: number | null, isBce: boolean): string {
  if (year == null) return 'Unknown year';
  if (isBce || year < 0) return `${Math.abs(year)} BC`;
  return String(year);
}

function importanceStars(score: number): string {
  const filled = Math.round(score * 5);
  return '\u2605'.repeat(filled) + '\u2606'.repeat(5 - filled);
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Card
// ─────────────────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: TodayEvent }) {
  const cat = (event.category ?? 'cultural') as EventCategory;
  const color = CATEGORY_COLORS[cat] ?? '#6b7280';
  const icon = CATEGORY_ICONS[cat] ?? '';
  const year = yearLabel(event.year_approx, event.is_bce);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '16px 20px',
        background: colors.card,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: 10,
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.cardHover;
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.card;
        e.currentTarget.style.borderColor = colors.cardBorder;
      }}
    >
      {/* Top row: year + category badge + importance */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 15,
          fontWeight: 700,
          color: colors.accent,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          {year}
        </span>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          backgroundColor: color + '22',
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {icon} {cat}
        </span>
        <span style={{
          fontSize: 12,
          color: '#fbbf24',
          letterSpacing: 1,
          marginLeft: 'auto',
        }}>
          {importanceStars(event.importance_score)}
        </span>
      </div>

      {/* Title */}
      <span style={{ fontSize: 16, fontWeight: 600, color: colors.text, lineHeight: 1.3 }}>
        {event.title}
      </span>

      {/* Description (2 lines max) */}
      {event.description && (
        <span style={{
          fontSize: 13,
          color: colors.textMuted,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {event.description}
        </span>
      )}

      {/* Bottom: region + view on timeline */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        {event.region ? (
          <span style={{ fontSize: 11, color: colors.textDim }}>
            {event.region}
          </span>
        ) : <span />}
        <Link
          to={`/?event=${event.slug}`}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.accent,
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: 6,
            border: `1px solid ${colors.accent}44`,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${colors.accent}15`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          View on timeline
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Share Button
// ─────────────────────────────────────────────────────────────────────────────

function ShareButton({ month, day }: { month: number; day: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/today?month=${month}&day=${day}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        backgroundColor: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`,
        color: copied ? '#22c55e' : colors.textMuted,
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {copied ? 'Link copied!' : 'Share this date'}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function TodayInHistoryPage() {
  const params = new URLSearchParams(window.location.search);
  const now = new Date();
  const month = Number(params.get('month')) || (now.getMonth() + 1);
  const day = Number(params.get('day')) || now.getDate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['today-in-history', month, day],
    queryFn: () => fetchTodayInHistory(month, day),
    staleTime: 60 * 60 * 1000,
  });

  const events = data?.events ?? [];
  const isFallback = data?.fallback ?? false;
  const dateLabel = `${MONTH_NAMES[month]} ${day}`;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.bg,
      fontFamily: "'Inter', sans-serif",
      color: colors.text,
    }}>
      {/* Nav bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: 'rgba(7,14,34,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{
            color: colors.text,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 16,
          }}>
            Chronicle
          </Link>
          <span style={{ color: colors.textDim, fontSize: 12 }}>/</span>
          <span style={{ color: colors.textMuted, fontSize: 14 }}>Today in History</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShareButton month={month} day={day} />
          <Link
            to="/api-docs"
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: colors.textMuted,
              fontSize: 12,
              textDecoration: 'none',
            }}
          >
            {'{ }'} API
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px 80px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.2,
          }}>
            {dateLabel} in History
          </h1>
          {!isLoading && !error && (
            <p style={{
              fontSize: 14,
              color: colors.textMuted,
              margin: '8px 0 0',
            }}>
              {isFallback
                ? 'No exact date matches found — showing notable events from all of history'
                : `${data?.count ?? 0} event${(data?.count ?? 0) !== 1 ? 's' : ''} on this date in history`
              }
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ padding: 40, textAlign: 'center', color: colors.textMuted, fontSize: 14 }}>
            Loading events...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: 24,
            textAlign: 'center',
            color: '#ef4444',
            fontSize: 14,
            background: 'rgba(239,68,68,0.08)',
            borderRadius: 10,
            border: '1px solid rgba(239,68,68,0.2)',
          }}>
            Failed to load events. Is the backend running?
          </div>
        )}

        {/* Event list */}
        {!isLoading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && events.length === 0 && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: colors.textMuted,
            fontSize: 14,
          }}>
            No events found for this date.
          </div>
        )}
      </main>
    </div>
  );
}
