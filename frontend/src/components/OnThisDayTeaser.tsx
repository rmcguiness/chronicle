/**
 * OnThisDayTeaser — dismissible banner on the main canvas showing 3 random
 * on-this-day events with a "See all →" link to /on-this-day.
 *
 * Owns: teaser visibility (session-scoped), random event selection.
 * Does NOT own: full on-this-day page, API client.
 */
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchOnThisDay } from '../api/client';

/** Number of events to show in the teaser. */
const TEASER_EVENT_COUNT = 3;

/** Month names for display. */
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * OnThisDayTeaser — renders a dismissible floating banner with a few
 * random events from today's date.
 */
export default function OnThisDayTeaser() {
  const [dismissed, setDismissed] = useState(false);
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { data } = useQuery({
    queryKey: ['on-this-day-teaser', month, day],
    queryFn: () => fetchOnThisDay(month, day),
    staleTime: 60 * 60 * 1000,
  });

  /** Pick up to TEASER_EVENT_COUNT random events. */
  const teaserEvents = useMemo(() => {
    if (!data?.events || data.events.length === 0) return [];
    const shuffled = [...data.events].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, TEASER_EVENT_COUNT);
  }, [data?.events]);

  if (dismissed || teaserEvents.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1f2937 100%)',
      border: '1px solid #374151',
      borderRadius: 12,
      padding: '12px 16px',
      maxWidth: 600,
      width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>
          📅 On This Day — {MONTH_NAMES[month]} {day}
        </span>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 16, padding: 0 }}
          aria-label="Dismiss On This Day teaser"
        >
          ✕
        </button>
      </div>

      {/* Events */}
      {teaserEvents.map(event => {
        const yearText = event.year_approx != null
          ? (event.year_approx < 0 ? `${Math.abs(event.year_approx)} BCE` : `${event.year_approx}`)
          : '';
        return (
          <div key={event.id} style={{ padding: '4px 0', borderTop: '1px solid #374151' }}>
            <Link
              to={`/event/${event.slug}`}
              style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
            >
              {yearText && <span style={{ color: '#f59e0b', marginRight: 6 }}>{yearText}</span>}
              {event.title}
            </Link>
          </div>
        );
      })}

      {/* See all link */}
      <div style={{ marginTop: 8, textAlign: 'right' }}>
        <Link
          to={`/on-this-day?month=${month}&day=${day}`}
          style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
        >
          See all →
        </Link>
      </div>
    </div>
  );
}
