/**
 * OnThisDayPanel.tsx
 *
 * A 360px slide-in panel on the right side showing historical events that
 * occurred on today's month/day across all years. Fetches data from
 * GET /api/events/on-this-day and renders a scrollable list.
 *
 * Owns: panel visibility, data fetching, event list rendering.
 * Does NOT own: canvas navigation (delegates to store's flyToEvent + setSelectedEvent).
 */

import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOnThisDay } from '../api/client';
import type { OnThisDayEvent } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Panel width in pixels. */
const PANEL_WIDTH = 360;

/** Minimum results before showing the "sparse history" note. */
const SPARSE_THRESHOLD = 3;

/** Month names for the header. */
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/**
 * Get the English ordinal suffix for a day number (1st, 2nd, 3rd, 4th…).
 */
function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: OnThisDayEvent;
  onSelect: (event: OnThisDayEvent) => void;
}

/** A single event card in the On This Day list. */
function EventCard({ event, onSelect }: EventCardProps) {
  const cat = (event.category ?? 'cultural') as EventCategory;
  const color = CATEGORY_COLORS[cat] ?? '#6b7280';
  const icon = CATEGORY_ICONS[cat] ?? '📌';
  const yearLabel = event.year_approx
    ? event.year_approx < 0
      ? `${Math.abs(event.year_approx)} BC`
      : `${event.year_approx} AD`
    : 'Unknown year';

  return (
    <button
      onClick={() => onSelect(event)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background 150ms ease, border-color 150ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Category badge + year */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: color + '22',
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {icon} {cat}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace' }}>
          {yearLabel}
        </span>
      </div>

      {/* Title */}
      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>
        {event.title}
      </span>

      {/* Region */}
      {event.region && (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          📍 {event.region}
        </span>
      )}

      {/* Short description */}
      {event.article_summary && (
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
          {event.article_summary?.slice(0, 150)}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Slide-in panel displaying "On This Day" events.
 * Reads `onThisDayOpen` from Zustand; ESC key and close button dismiss it.
 */
export default function OnThisDayPanel() {
  const open = useAppStore((s) => s.onThisDayOpen);
  const setOpen = useAppStore((s) => s.setOnThisDayOpen);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['on-this-day', month, day],
    queryFn: () => fetchOnThisDay(month, day),
    enabled: open,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  // ESC key closes the panel
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  /** Navigate the timeline to the selected event and open its detail panel. */
  const handleSelect = useCallback(
    (event: OnThisDayEvent) => {
      // Build a minimal HistoricalEvent for flyToEvent (needs year_approx, lat, lng)
      // We don't have lat/lng from this endpoint, so just select the event by slug
      setSelectedEvent(event.slug);
      // Close on-this-day panel to avoid overlap with detail panel
      setOpen(false);
    },
    [setSelectedEvent, setOpen],
  );

  const dateLabel = `${MONTH_NAMES[month]} ${day}${ordinalSuffix(day)}`;
  const events = data?.events ?? [];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: PANEL_WIDTH,
        height: '100vh',
        backgroundColor: 'rgba(15, 17, 23, 0.95)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 50,
        transform: open ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
        transition: 'transform 250ms ease',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            📅 On This Day
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
            {dateLabel}
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close On This Day panel"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: 6,
            width: 32,
            height: 32,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {isLoading && (
          <div style={{ padding: 20, textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Loading events…
          </div>
        )}

        {error && (
          <div style={{ padding: 20, textAlign: 'center', color: '#ef4444', fontSize: 13 }}>
            Failed to load events. Is the backend running?
          </div>
        )}

        {!isLoading && !error && events.map((evt) => (
          <EventCard key={evt.id} event={evt} onSelect={handleSelect} />
        ))}

        {/* Sparse results note */}
        {!isLoading && !error && events.length < SPARSE_THRESHOLD && (
          <div
            style={{
              marginTop: 12,
              padding: '12px 14px',
              background: 'rgba(96,165,250,0.06)',
              border: '1px solid rgba(96,165,250,0.15)',
              borderRadius: 8,
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.5,
            }}
          >
            ✨ Not many recorded events on this date — history is still being written.
          </div>
        )}
      </div>
    </div>
  );
}
