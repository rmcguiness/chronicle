/**
 * WorldContextPanel.tsx
 *
 * A slide-in panel from the right that shows what else was happening in the
 * world around the same time (±window_years) as the currently selected event.
 *
 * Events are grouped by geographic region (Europe, Americas, Asia, etc.)
 * and sorted by importance_score within each group.
 *
 * Owns: panel UI, region group rendering, event row click-to-select.
 * Does NOT own: data fetching logic (uses react-query), store state shape.
 */
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorldContext } from '../api/client';
import type { WorldContextEvent } from '../api/client';
import { useAppStore } from '../store';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Panel width in pixels. */
const PANEL_WIDTH = 400;

/** Z-index — between OnThisDayPanel (50) and EventDetailPanel (110). */
const PANEL_Z_INDEX = 105;

/** Height of the TimelineScrubber bar at the bottom of the screen. */
const SCRUBBER_HEIGHT = 84;

/** CSS transition for the slide animation. */
const SLIDE_TRANSITION = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

/** Panel background color (dark theme). */
const BG_COLOR = 'rgba(7, 14, 34, 0.97)';

/** Panel border color. */
const BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';

/** Default year window for the query. */
const DEFAULT_WINDOW_YEARS = 25;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format a year number for display. Negative years show as "X BCE". */
function formatYear(year: number | null): string {
  if (year === null) return '?';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/**
 * Return a color for an importance score dot.
 * High importance = brighter / warmer, low = dimmer.
 */
function importanceDotColor(score: number): string {
  if (score >= 0.9) return '#f59e0b'; // amber — landmark
  if (score >= 0.7) return '#3b82f6'; // blue — major
  if (score >= 0.5) return '#22c55e'; // green — notable
  return '#6b7280';                    // gray — minor
}

/** Region emoji lookup. */
const REGION_EMOJI: Record<string, string> = {
  Europe: '🏰',
  Americas: '🗽',
  Asia: '🏯',
  'Middle East & Africa': '🕌',
  Global: '🌐',
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Loading skeleton for the panel body. */
function LoadingSkeleton() {
  const barStyle = (width: string, delay: string): React.CSSProperties => ({
    height: 14,
    width,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.06)',
    animation: `worldCtxPulse 1.2s ease-in-out ${delay} infinite`,
  });

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {[0, 1, 2].map((g) => (
        <div key={g} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={barStyle('40%', `${g * 0.15}s`)} />
          {[0, 1].map((r) => (
            <div key={r} style={{ ...barStyle('80%', `${g * 0.15 + r * 0.1}s`), marginLeft: 12 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * A single event row inside a region group.
 * Shows importance dot + title + year. Clickable to select the event.
 */
function EventRow({
  event,
  onSelect,
}: {
  event: WorldContextEvent;
  onSelect: (slug: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(event.slug)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '8px 12px',
        borderRadius: 6,
        border: 'none',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: '#f1f5f9',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        transition: 'background 0.15s ease',
      }}
    >
      {/* Importance dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: importanceDotColor(event.importance_score),
          flexShrink: 0,
        }}
      />

      {/* Title */}
      <span
        style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: 500,
        }}
      >
        {event.title}
      </span>

      {/* Year */}
      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
        {formatYear(event.year_approx)}
      </span>
    </button>
  );
}

/**
 * A collapsible region group (e.g. "Europe") containing event rows.
 */
function RegionGroup({
  region,
  events,
  onSelectEvent,
}: {
  region: string;
  events: WorldContextEvent[];
  onSelectEvent: (slug: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const emoji = REGION_EMOJI[region] ?? '📍';

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Region header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          borderRadius: 6,
          background: 'rgba(255,255,255,0.04)',
          color: '#e2e8f0',
          cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <span style={{ fontSize: 14, transition: 'transform 0.15s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)' }}>
          ▾
        </span>
        <span>{emoji}</span>
        <span>{region}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b', fontWeight: 400 }}>
          {events.length} event{events.length !== 1 ? 's' : ''}
        </span>
      </button>

      {/* Event rows */}
      {!collapsed && (
        <div style={{ paddingLeft: 8, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {events.map((ev) => (
            <EventRow key={ev.id} event={ev} onSelect={onSelectEvent} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS keyframe injection (pulse animation for skeleton)
// ─────────────────────────────────────────────────────────────────────────────

let _stylesInjected = false;
function injectStyles() {
  if (_stylesInjected) return;
  _stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes worldCtxPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * WorldContextPanel — slide-in panel showing nearby world events grouped by region.
 *
 * Triggered by `worldContextOpen` in the Zustand store. Fetches data from
 * `GET /api/events/{slug}/world-context?window_years=25` when the selected
 * event changes. Clicking an event row selects it and pans the canvas to it.
 */
export default function WorldContextPanel() {
  useEffect(injectStyles, []);

  const open = useAppStore((s) => s.worldContextOpen);
  const setOpen = useAppStore((s) => s.setWorldContextOpen);
  const selectedSlug = useAppStore((s) => s.selectedEventSlug);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const visibleEvents = useAppStore((s) => s.visibleEvents);
  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);

  const slug = selectedSlug ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['world-context', slug],
    queryFn: () => fetchWorldContext(slug, DEFAULT_WINDOW_YEARS),
    enabled: !!slug && open,
    staleTime: 5 * 60 * 1000,
  });

  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  /** Select an event and fly to it on the canvas. */
  const handleSelectEvent = useCallback(
    (eventSlug: string) => {
      setSelectedEvent(eventSlug);
      // Find the event in visibleEvents to fly to it
      const ev = visibleEvents.find((e) => e.slug === eventSlug);
      if (ev) setFlyToEvent(ev);
    },
    [setSelectedEvent, visibleEvents, setFlyToEvent],
  );

  const centerYear = data?.center_event?.year_approx;
  const windowYears = data?.window_years ?? DEFAULT_WINDOW_YEARS;
  const hasRegions = data?.regions && data.regions.length > 0;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: PANEL_WIDTH,
        height: `calc(100vh - ${SCRUBBER_HEIGHT}px)`,
        zIndex: PANEL_Z_INDEX,
        background: BG_COLOR,
        backdropFilter: 'blur(16px)',
        borderLeft: `1px solid ${BORDER_COLOR}`,
        transform: open && selectedSlug ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
        transition: SLIDE_TRANSITION,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        pointerEvents: open && selectedSlug ? 'auto' : 'none',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 24px 16px',
          borderBottom: `1px solid ${BORDER_COLOR}`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 22 }}>🌍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>
            World in {centerYear !== null && centerYear !== undefined ? formatYear(centerYear) : '…'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '1px 6px',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.06)',
                fontSize: 10,
                color: '#94a3b8',
              }}
            >
              ±{windowYears} yr
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: 20,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 4,
            lineHeight: 1,
          }}
          aria-label="Close world context panel"
        >
          ×
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {isLoading && <LoadingSkeleton />}

        {!isLoading && !hasRegions && (
          <div
            style={{
              textAlign: 'center',
              color: '#64748b',
              padding: '48px 24px',
              fontSize: 13,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌐</div>
            No nearby events found
          </div>
        )}

        {!isLoading &&
          hasRegions &&
          data!.regions.map((group) => (
            <RegionGroup
              key={group.region}
              region={group.region}
              events={group.events}
              onSelectEvent={handleSelectEvent}
            />
          ))}
      </div>
    </div>
  );
}
