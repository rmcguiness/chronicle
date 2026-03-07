/**
 * FollowOnPanel.tsx
 *
 * A 360px slide-in panel on the right side showing up to 10 events that
 * occurred in the 1–50 years after the currently selected event, sorted
 * by importance. Lets users chain through history by clicking results.
 *
 * Owns: panel visibility, data fetching, same-region toggle.
 * Does NOT own: event selection logic (delegates to Zustand store).
 */

import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFollowOnEvents, fetchEventDetail } from '../api/client';
import type { FollowOnEvent } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

const PANEL_WIDTH = 360;

// ─────────────────────────────────────────────────────────────────────────────
// Importance stars (1–5)
// ─────────────────────────────────────────────────────────────────────────────

function ImportanceStars({ score }: { score: number }) {
  const stars = Math.max(1, Math.min(5, Math.round(score * 5)));
  return (
    <span
      style={{ fontSize: 11, color: '#eab308', letterSpacing: 1 }}
      title={`Importance: ${stars}/5`}
    >
      {'★'.repeat(stars)}
      {'☆'.repeat(5 - stars)}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              height: 10,
              width: '40%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.08)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: 14,
              width: '80%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.08)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: 10,
              width: '30%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.06)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Event card
// ─────────────────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: FollowOnEvent;
  onSelect: (event: FollowOnEvent) => void;
}

function EventCard({ event, onSelect }: EventCardProps) {
  const cat = (event.category ?? 'cultural') as EventCategory;
  const color = CATEGORY_COLORS[cat] ?? '#6b7280';
  const icon = CATEGORY_ICONS[cat] ?? '📌';
  const yearLabel = event.year_approx
    ? event.year_approx < 0
      ? `${Math.abs(event.year_approx)} BC`
      : `${event.year_approx} AD`
    : event.date_display ?? 'Unknown year';

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
        <span
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {yearLabel}
        </span>
      </div>

      {/* Title */}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
          lineHeight: 1.3,
        }}
      >
        {event.title}
      </span>

      {/* Bottom row: region + importance stars */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {event.region ? (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
            {event.region}
          </span>
        ) : (
          <span />
        )}
        <ImportanceStars score={event.importance_score} />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main panel
// ─────────────────────────────────────────────────────────────────────────────

export default function FollowOnPanel() {
  const selectedSlug = useAppStore((s) => s.selectedEventSlug);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);

  const [open, setOpen] = useState(false);
  const [sameRegion, setSameRegion] = useState(false);

  // Open the panel whenever an event is selected and the detail panel is open
  useEffect(() => {
    setOpen(detailPanelOpen && selectedSlug !== null);
  }, [detailPanelOpen, selectedSlug]);

  // Fetch the selected event's title for the header
  const { data: eventDetail } = useQuery({
    queryKey: ['event-detail-header', selectedSlug],
    queryFn: () => fetchEventDetail(selectedSlug!),
    enabled: open && selectedSlug !== null,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch follow-on events
  const { data: followOnEvents, isLoading, error } = useQuery({
    queryKey: ['followon', selectedSlug, sameRegion],
    queryFn: () => fetchFollowOnEvents(selectedSlug!, sameRegion),
    enabled: open && selectedSlug !== null,
    staleTime: 5 * 60 * 1000,
  });

  // ESC key closes the panel
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = useCallback(
    (event: FollowOnEvent) => {
      // Chain: select the follow-on event, which re-triggers the panel
      setSelectedEvent(event.slug);
      // Reset same-region toggle when chaining
      setSameRegion(false);
    },
    [setSelectedEvent],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const events = followOnEvents ?? [];
  const eventTitle = eventDetail?.title ?? selectedSlug ?? '';

  // Position to the left of the EventDetailPanel (which is 480px on the right)
  const DETAIL_PANEL_WIDTH = 480;
  const panelRight = detailPanelOpen ? DETAIL_PANEL_WIDTH : 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: panelRight,
        width: PANEL_WIDTH,
        height: '100vh',
        backgroundColor: 'rgba(15, 17, 23, 0.95)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        zIndex: 49,
        transform: open ? 'translateX(0)' : `translateX(${PANEL_WIDTH + panelRight}px)`,
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
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 4,
            }}
          >
            What happened next?
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={eventTitle}
          >
            {eventTitle}
          </div>
        </div>
        <button
          onClick={handleClose}
          aria-label="Close follow-on panel"
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
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          ✕
        </button>
      </div>

      {/* Same-region toggle */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0,
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={sameRegion}
            onChange={(e) => setSameRegion(e.target.checked)}
            style={{ accentColor: '#3b82f6' }}
          />
          Same region only
        </label>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 12px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {isLoading && <SkeletonRows />}

        {error && (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              color: '#ef4444',
              fontSize: 13,
            }}
          >
            Failed to load follow-on events.
          </div>
        )}

        {!isLoading &&
          !error &&
          events.map((evt) => (
            <EventCard key={evt.id} event={evt} onSelect={handleSelect} />
          ))}

        {/* Empty state */}
        {!isLoading && !error && events.length === 0 && (
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
            No recorded events in the 50 years following this event.
          </div>
        )}
      </div>
    </div>
  );
}
