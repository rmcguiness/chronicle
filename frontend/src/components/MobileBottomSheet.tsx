import { useEffect, useRef, useCallback } from 'react';
import type { HistoricalEvent, EventDetail } from '../types';
import { useQuery } from '@tanstack/react-query';
import { fetchEventDetail } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '../utils/categories';

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return String(year);
}

function importanceStars(score: number): string {
  if (score >= 0.9) return '★★★';
  if (score >= 0.7) return '★★';
  return '★';
}

interface Props {
  event: HistoricalEvent | null;
  onClose: () => void;
}

export default function MobileBottomSheet({ event, onClose }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const { data: detail } = useQuery<EventDetail>({
    queryKey: ['event-detail', event?.slug],
    queryFn: () => fetchEventDetail(event!.slug),
    enabled: !!event,
  });

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [event]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (dy > 80) onClose(); // swipe down threshold
  }, [onClose]);

  const isOpen = !!event;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '85vh',
          background: '#0f172a',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          zIndex: 9999,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Drag handle + close button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px 0' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: '#475569' }} />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 16,
              top: 12,
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: 24,
              cursor: 'pointer',
              lineHeight: 1,
              padding: 4,
            }}
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '16px 20px 32px', flex: 1 }}>
          {event && (
            <>
              {/* Year + Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
                  {formatYear(event.year_approx)}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                    color: CATEGORY_COLORS[event.category],
                    background: `${CATEGORY_COLORS[event.category]}18`,
                    padding: '2px 8px',
                    borderRadius: 12,
                  }}
                >
                  {CATEGORY_ICONS[event.category]} {CATEGORY_LABELS[event.category]}
                </span>
                <span style={{ color: '#eab308', fontSize: 13, marginLeft: 'auto' }}>
                  {importanceStars(event.importance_score)}
                </span>
              </div>

              {/* Title */}
              <h2 style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>
                {event.title}
              </h2>

              {/* Location */}
              {(event.geo_modern || event.geo_era_label) && (
                <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px' }}>
                  {event.geo_modern}{event.geo_era_label ? ` — ${event.geo_era_label}` : ''}
                </p>
              )}

              {/* Date display */}
              {event.date_display && (
                <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 12px' }}>
                  {event.date_display}
                </p>
              )}

              {/* Perspectives / description */}
              {detail?.perspectives && detail.perspectives.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {detail.perspectives.map((p) => (
                    <div key={p.id} style={{ marginBottom: 16 }}>
                      <h4 style={{ color: '#cbd5e1', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                        {p.label}
                      </h4>
                      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                        {p.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Connected events */}
              {detail?.connected_events && detail.connected_events.length > 0 && (
                <div style={{ marginTop: 16, borderTop: '1px solid #1e293b', paddingTop: 12 }}>
                  <h4 style={{ color: '#cbd5e1', fontSize: 13, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Connected Events
                  </h4>
                  {detail.connected_events.map((ce) => (
                    <div key={ce.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: '#64748b', fontSize: 12, minWidth: 50 }}>
                        {formatYear(ce.year_approx)}
                      </span>
                      <span style={{ color: '#e2e8f0', fontSize: 13 }}>{ce.title}</span>
                      <span style={{ color: '#475569', fontSize: 11, marginLeft: 'auto' }}>
                        {ce.connection_type.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        color: '#94a3b8',
                        background: '#1e293b',
                        padding: '2px 8px',
                        borderRadius: 10,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
