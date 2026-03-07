/**
 * WhatHappenedNext.tsx
 *
 * Renders a "What happened next?" section showing up to 5 important events that
 * occurred in the following 50 years within the same geographic region.
 * Fetches from GET /api/events/{slug}/what-happened-next on mount, cancels on
 * unmount via AbortController.
 */
import { useState, useEffect } from 'react';
import { fetchWhatHappenedNext } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS } from '../utils/categories';
import type { WhatHappenedNextEvent } from '../types';

/** Format a year for display: negative = BCE. */
function fmtYear(y: number): string {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

/** Loading skeleton — 3 placeholder rows. */
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 38,
            borderRadius: 6,
            backgroundColor: 'rgba(255,255,255,0.05)',
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Single clickable row in the list. */
function EventRow({ event }: { event: WhatHappenedNextEvent }) {
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const catColor =
    (event.category ? CATEGORY_COLORS[event.category] : undefined) ?? '#6b7280';

  return (
    <button
      onClick={() => setSelectedEvent(event.slug)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        width: '100%',
        padding: '8px 10px',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#e2e8f0',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 12,
        transition: 'background 0.15s',
      }}
    >
      {/* Year badge */}
      <span
        style={{
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 6px',
          borderRadius: 4,
          backgroundColor: `${catColor}22`,
          color: catColor,
          whiteSpace: 'nowrap',
          marginTop: 1,
        }}
      >
        {fmtYear(event.year_approx)}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.title}
        </div>
        {event.description && (
          <div
            style={{
              fontSize: 11,
              color: '#94a3b8',
              marginTop: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {event.description}
          </div>
        )}
      </div>
    </button>
  );
}

/** Props for the WhatHappenedNext component. */
interface WhatHappenedNextProps {
  slug: string;
}

/**
 * WhatHappenedNext — "What happened next?" panel section.
 *
 * Displays up to 5 important events from the next 50 years in the same
 * geographic region. Clicking an item navigates to that event.
 */
export default function WhatHappenedNext({ slug }: WhatHappenedNextProps) {
  const [events, setEvents] = useState<WhatHappenedNextEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setEmpty(false);
    setEvents([]);

    fetchWhatHappenedNext(slug, controller.signal).then((resp) => {
      if (controller.signal.aborted) return;
      setLoading(false);
      if (!resp || resp.events.length === 0) {
        setEmpty(true);
      } else {
        setEvents(resp.events);
      }
    });

    return () => controller.abort();
  }, [slug]);

  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        What happened next?
      </div>

      {loading && <Skeleton />}

      {empty && (
        <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
          No significant events recorded in this region within 50 years.
        </div>
      )}

      {!loading && !empty && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {events.map((e) => (
            <EventRow key={e.slug} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}
