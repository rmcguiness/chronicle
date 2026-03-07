/**
 * ThisWeekBanner — a slim dismissable banner showing 3 notable historical events
 * that occurred near today's date (±3 days) across all years of history.
 *
 * Sits between the toolbar and the timeline canvas. Fetches from
 * GET /api/events/this-week on mount. Dismissal is stored in sessionStorage
 * so the banner reappears on next page load.
 *
 * Clicking an event pill selects that event in the Zustand store, opening
 * the detail panel.
 */
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchThisWeek, type ThisWeekEvent } from '../api/client';
import { useAppStore } from '../store';

const DISMISS_KEY = 'chronicle:this-week-dismissed';

export default function ThisWeekBanner() {
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  });

  const { data } = useQuery({
    queryKey: ['this-week'],
    queryFn: fetchThisWeek,
    staleTime: 60 * 60 * 1000,
  });

  // Nothing to show
  if (dismissed || !data || data.events.length === 0) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  const handlePillClick = (event: ThisWeekEvent) => {
    // Find the event slug from visible events, or use id as fallback
    const visibleEvents = useAppStore.getState().visibleEvents;
    const match = visibleEvents.find((e) => e.id === event.id);
    if (match) {
      setSelectedEvent(match.slug);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      zIndex: 900,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 20px',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      borderBottom: '1px solid #f59e0b44',
      fontFamily: "'Inter', sans-serif",
      fontSize: 14,
      color: '#78350f',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <span style={{ fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
        This week in history:
      </span>

      <div style={{ display: 'flex', gap: 8, overflow: 'hidden', flex: 1, minWidth: 0 }}>
        {data.events.map((ev) => (
          <button
            key={ev.id}
            onClick={() => handlePillClick(ev)}
            title={ev.title}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 999,
              border: '1px solid #d97706',
              background: 'rgba(255,255,255,0.7)',
              color: '#92400e',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 260,
              flexShrink: 1,
              minWidth: 0,
              lineHeight: '20px',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ev.title}
            </span>
            {ev.year_approx != null && (
              <span style={{ opacity: 0.65, fontSize: 12, flexShrink: 0 }}>
                {ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : ev.year_approx}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss this week in history banner"
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 18,
          color: '#92400e',
          padding: '4px 8px',
          lineHeight: 1,
          opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
}
