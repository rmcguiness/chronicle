/**
 * MostConnectedPanel.tsx — Collapsible bottom-left panel showing the top 20
 * most causally connected events.
 *
 * Toggle button reads "Top events". Clicking a row navigates to that event
 * by setting it as the selected event (opens detail panel). Each row shows
 * the event title, year, and a proportional bar visualising connection count.
 *
 * Collapsed/expanded state is persisted in the Zustand store.
 */
import { useState, useEffect } from 'react';
import { fetchMostConnected, type MostConnectedEvent } from '../api/client';
import { useAppStore } from '../store';

export default function MostConnectedPanel() {
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState<MostConnectedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  useEffect(() => {
    if (!expanded || events.length > 0) return;
    setLoading(true);
    fetchMostConnected()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [expanded, events.length]);

  const maxCount = events.length > 0 ? events[0].total_connections : 1;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 60,
        left: 16,
        zIndex: 30,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(100, 116, 139, 0.4)',
          borderRadius: 8,
          color: '#e2e8f0',
          padding: '6px 12px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 14 }}>&#128279;</span>
        Top events
        <span style={{ fontSize: 10, opacity: 0.6 }}>{expanded ? '▼' : '▲'}</span>
      </button>

      {/* Expanded list */}
      {expanded && (
        <div
          style={{
            marginTop: 6,
            background: 'rgba(7, 14, 34, 0.95)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: 10,
            padding: '8px 0',
            maxHeight: 380,
            overflowY: 'auto',
            width: 320,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {loading && (
            <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>
              Loading...
            </div>
          )}
          {!loading && events.length === 0 && (
            <div style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>
              No connected events found.
            </div>
          )}
          {events.map((ev) => (
            <button
              key={ev.slug}
              onClick={() => setSelectedEvent(ev.slug)}
              style={{
                display: 'block',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '6px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                color: '#e2e8f0',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(100,116,139,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>
                  {ev.title}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 11, flexShrink: 0 }}>
                  {ev.year_approx ?? '—'} · {ev.total_connections}
                </span>
              </div>
              {/* Proportional bar */}
              <div
                style={{
                  marginTop: 3,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(100,116,139,0.2)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(ev.total_connections / maxCount) * 100}%`,
                    backgroundColor: ev.total_connections >= 5 ? '#3b82f6' : '#6b7280',
                    borderRadius: 2,
                  }}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
