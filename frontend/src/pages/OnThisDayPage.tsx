/**
 * OnThisDayPage — dedicated page at /on-this-day showing historical events
 * that occurred on a given month/day across all years, grouped by era.
 *
 * Owns: date picker, era grouping, share buttons, nearby events fallback.
 * Does NOT own: API fetching logic (delegates to api/client), navigation chrome.
 */
import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchOnThisDay } from '../api/client';
import type { OnThisDayEvent } from '../api/client';
import { CATEGORY_COLORS } from '../utils/categories';
import type { EventCategory } from '../types';

// ── Era boundaries ──────────────────────────────────────────────────────────

/** Year boundaries for era grouping. */
const ERA_BOUNDARIES = {
  ANCIENT_END: 500,
  MEDIEVAL_END: 1500,
  EARLY_MODERN_END: 1800,
  MODERN_END: 1950,
} as const;

/** Era definitions for grouping events by historical period. */
const ERAS = [
  { key: 'ancient', label: 'Ancient', subtitle: 'Before 500 CE', filter: (y: number) => y < ERA_BOUNDARIES.ANCIENT_END },
  { key: 'medieval', label: 'Medieval', subtitle: '500–1500', filter: (y: number) => y >= ERA_BOUNDARIES.ANCIENT_END && y < ERA_BOUNDARIES.MEDIEVAL_END },
  { key: 'early-modern', label: 'Early Modern', subtitle: '1500–1800', filter: (y: number) => y >= ERA_BOUNDARIES.MEDIEVAL_END && y < ERA_BOUNDARIES.EARLY_MODERN_END },
  { key: 'modern', label: 'Modern', subtitle: '1800–1950', filter: (y: number) => y >= ERA_BOUNDARIES.EARLY_MODERN_END && y < ERA_BOUNDARIES.MODERN_END },
  { key: 'contemporary', label: 'Contemporary', subtitle: '1950–Present', filter: (y: number) => y >= ERA_BOUNDARIES.MODERN_END },
] as const;

/** Maximum importance score used for rendering filled circles. */
const MAX_IMPORTANCE = 1.0;
/** Number of importance indicator circles to display. */
const IMPORTANCE_CIRCLE_COUNT = 5;
/** Maximum characters for truncated article summary. */
const SUMMARY_MAX_CHARS = 200;

/** Month names for display. */
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Truncate text to a maximum length, ending at a sentence boundary if possible.
 */
function truncateSummary(text: string | null, maxLen: number = SUMMARY_MAX_CHARS): string {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  // Try to end at sentence boundary
  const truncated = text.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf('. ');
  if (lastPeriod > maxLen * 0.5) {
    return truncated.slice(0, lastPeriod + 1);
  }
  return truncated.trimEnd() + '…';
}

/**
 * Render importance as filled/empty circles.
 */
function ImportanceIndicator({ score }: { score: number }) {
  const filled = Math.round((score / MAX_IMPORTANCE) * IMPORTANCE_CIRCLE_COUNT);
  return (
    <span style={{ display: 'inline-flex', gap: 3 }} title={`Importance: ${(score * 100).toFixed(0)}%`}>
      {Array.from({ length: IMPORTANCE_CIRCLE_COUNT }, (_, i) => (
        <span
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: i < filled ? '#f59e0b' : '#374151',
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}

/**
 * Share button that copies formatted text to clipboard.
 */
function ShareButton({ event, month, day }: { event: OnThisDayEvent; month: number; day: number }) {
  const handleShare = useCallback(async () => {
    const yearText = event.year_approx ? `${Math.abs(event.year_approx)}${event.year_approx < 0 ? ' BCE' : ''}` : 'an unknown year';
    const text = `On ${MONTH_NAMES[month]} ${day}, ${yearText}, ${event.title}. Learn more: ${window.location.origin}/event/${event.slug}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback: silent fail
    }
  }, [event, month, day]);

  return (
    <button
      onClick={handleShare}
      style={{
        background: 'none',
        border: '1px solid #4b5563',
        color: '#9ca3af',
        borderRadius: 4,
        padding: '2px 8px',
        cursor: 'pointer',
        fontSize: 12,
      }}
      title="Copy share text to clipboard"
    >
      📋 Share
    </button>
  );
}

/**
 * A single event card in the timeline.
 */
function EventCard({ event, month, day }: { event: OnThisDayEvent; month: number; day: number }) {
  const categoryColor = CATEGORY_COLORS[(event.category ?? 'political') as EventCategory] ?? '#6b7280';
  const yearDisplay = event.year_approx != null
    ? (event.year_approx < 0 ? `${Math.abs(event.year_approx)} BCE` : `${event.year_approx}`)
    : '?';

  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: 16,
      background: '#1f2937',
      borderRadius: 8,
      borderLeft: `4px solid ${categoryColor}`,
      marginBottom: 12,
    }}>
      {/* Year */}
      <div style={{
        minWidth: 80,
        textAlign: 'right',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#e5e7eb', lineHeight: 1.1 }}>
          {yearDisplay}
        </div>
        <ImportanceIndicator score={event.importance_score} />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <Link
          to={`/event/${event.slug}`}
          style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 16, fontWeight: 600 }}
        >
          {event.title}
        </Link>

        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
          {event.category && (
            <span style={{
              fontSize: 11,
              padding: '1px 6px',
              borderRadius: 4,
              background: categoryColor + '33',
              color: categoryColor,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}>
              {event.category}
            </span>
          )}
          {event.geo_modern && (
            <span style={{ fontSize: 12, color: '#9ca3af' }}>📍 {event.geo_modern}</span>
          )}
        </div>

        {event.article_summary && (
          <p style={{ color: '#d1d5db', fontSize: 13, margin: '8px 0 4px', lineHeight: 1.5 }}>
            {truncateSummary(event.article_summary)}
          </p>
        )}

        <ShareButton event={event} month={month} day={day} />
      </div>
    </div>
  );
}

/**
 * OnThisDayPage — the main page component.
 */
export default function OnThisDayPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = new Date();
  const month = parseInt(searchParams.get('month') ?? String(today.getMonth() + 1), 10);
  const day = parseInt(searchParams.get('day') ?? String(today.getDate()), 10);

  const [pickerMonth, setPickerMonth] = useState(month);
  const [pickerDay, setPickerDay] = useState(day);

  const { data, isLoading, error } = useQuery({
    queryKey: ['on-this-day', month, day],
    queryFn: () => fetchOnThisDay(month, day),
  });

  /** Group events by era. */
  const groupedEvents = useMemo(() => {
    if (!data?.events) return [];
    return ERAS.map(era => ({
      ...era,
      events: data.events.filter(e => e.year_approx != null && era.filter(e.year_approx)),
    })).filter(g => g.events.length > 0);
  }, [data?.events]);

  const handleDateChange = useCallback(() => {
    setSearchParams({ month: String(pickerMonth), day: String(pickerDay) });
  }, [pickerMonth, pickerDay, setSearchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      color: '#e5e7eb',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #111827 100%)',
        padding: '32px 24px',
        textAlign: 'center',
        borderBottom: '1px solid #1f2937',
      }}>
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>
          ← Back to Chronicle
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '16px 0 4px', color: '#f9fafb' }}>
          📅 {MONTH_NAMES[month]} {day}
        </h1>
        <p style={{ fontSize: 18, color: '#9ca3af', margin: 0, fontStyle: 'italic' }}>
          Through the Ages
        </p>

        {/* Date picker */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={pickerMonth}
            onChange={e => setPickerMonth(Number(e.target.value))}
            style={{ background: '#1f2937', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: 4, padding: '4px 8px' }}
          >
            {MONTH_NAMES.slice(1).map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={31}
            value={pickerDay}
            onChange={e => setPickerDay(Number(e.target.value))}
            style={{ width: 60, background: '#1f2937', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: 4, padding: '4px 8px' }}
          />
          <button
            onClick={handleDateChange}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Go
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
        {isLoading && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40 }}>Loading events…</p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#ef4444', padding: 40 }}>
            Failed to load events. Please try again.
          </p>
        )}

        {data && data.events.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: 40, fontSize: 18 }}>
            No events recorded for {MONTH_NAMES[month]} {day}. Try a different date!
          </p>
        )}

        {/* Grouped timeline */}
        {groupedEvents.map(group => (
          <section key={group.key} style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
              borderBottom: '1px solid #374151',
              paddingBottom: 8,
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb', margin: 0 }}>
                {group.label}
              </h2>
              <span style={{ fontSize: 13, color: '#6b7280' }}>{group.subtitle}</span>
              <span style={{
                fontSize: 11,
                background: '#374151',
                borderRadius: 10,
                padding: '2px 8px',
                color: '#9ca3af',
              }}>
                {group.events.length}
              </span>
            </div>
            {group.events.map(event => (
              <EventCard key={event.id} event={event} month={month} day={day} />
            ))}
          </section>
        ))}

        {/* Nearby events */}
        {data && data.nearby_events && data.nearby_events.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f9fafb', marginBottom: 12, borderBottom: '1px solid #374151', paddingBottom: 8 }}>
              📆 Also Nearby
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 12 }}>
              Events from surrounding dates (±3 days)
            </p>
            {data.nearby_events.map(event => (
              <EventCard key={event.id} event={event} month={month} day={day} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
