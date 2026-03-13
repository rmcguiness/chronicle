/**
 * SplashCard — Full-screen featured event overlay for first-time visitors.
 *
 * Shows a random high-importance event with its title, date, region, and
 * a short description. Dismissed by the CTA button, which sets the
 * localStorage flag and navigates the canvas to the featured event.
 *
 * Only renders when `chronicle_visited` is absent from localStorage.
 */
import { useEffect, useState, useCallback } from 'react';
import { fetchRandomFeaturedEvent } from '../api/featured';
import { fetchEventDetail } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_ICONS } from '../utils/categories';
import type { HistoricalEvent } from '../types';

const VISITED_KEY = 'chronicle_visited';

interface FeaturedData {
  event: HistoricalEvent;
  description: string;
  region: string;
}

export default function SplashCard() {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(VISITED_KEY),
  );
  const [featured, setFeatured] = useState<FeaturedData | null>(null);

  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  // Fetch a random featured event on mount
  useEffect(() => {
    if (!visible) return;
    let cancelled = false;

    (async () => {
      const event = await fetchRandomFeaturedEvent();
      if (cancelled || !event) return;

      // Try to get a description from the event detail
      let description = '';
      let region = event.geo_modern ?? '';
      try {
        const detail = await fetchEventDetail(event.slug);
        if (detail.perspectives?.length > 0) {
          // Use first perspective summary, truncate to ~2 sentences
          const summary = detail.perspectives[0].summary;
          const sentences = summary.match(/[^.!?]+[.!?]+/g) ?? [summary];
          description = sentences.slice(0, 2).join(' ').trim();
        }
      } catch {
        // Use a fallback description
        description = `A pivotal moment in history with an importance score of ${event.importance_score.toFixed(1)}.`;
      }

      if (!cancelled) {
        setFeatured({ event, description, region });
      }
    })();

    return () => { cancelled = true; };
  }, [visible]);

  const handleExplore = useCallback(() => {
    localStorage.setItem(VISITED_KEY, '1');
    if (featured) {
      setFlyToEvent(featured.event);
      setSelectedEvent(featured.event.slug);
    }
    setVisible(false);
  }, [featured, setFlyToEvent, setSelectedEvent]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(VISITED_KEY, '1');
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, handleDismiss]);

  if (!visible) return null;

  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    return `${year} CE`;
  };

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('[data-splash-card]')) return;
        handleDismiss();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 14, 28, 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'default',
      }}
    >
      <div
        data-splash-card
        style={{
          background: 'linear-gradient(160deg, #0f1c36 0%, #0a1120 100%)',
          border: '1px solid rgba(99, 179, 237, 0.2)',
          borderRadius: 16,
          padding: '44px 48px',
          maxWidth: 520,
          width: '92vw',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,179,237,0.08)',
          fontFamily: "'Inter', system-ui, sans-serif",
          cursor: 'default',
        }}
      >
        {/* Header */}
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#60a5fa',
          marginBottom: 20,
        }}>
          Featured Event
        </div>

        {!featured ? (
          <div style={{ color: '#64748b', fontSize: 14, padding: '40px 0' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Category icon */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: 24,
              boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
            }}>
              {CATEGORY_ICONS[featured.event.category] ?? '🌐'}
            </div>

            {/* Title */}
            <h1 style={{
              margin: '0 0 8px',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#e2e8f0',
              lineHeight: 1.2,
            }}>
              {featured.event.title}
            </h1>

            {/* Date + Region */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              marginBottom: 20,
              fontSize: 13,
              color: '#94a3b8',
            }}>
              <span>{featured.event.date_display ?? formatYear(featured.event.year_approx)}</span>
              {featured.region && (
                <>
                  <span style={{ opacity: 0.4 }}>|</span>
                  <span>{featured.region}</span>
                </>
              )}
            </div>

            {/* Separator */}
            <div style={{
              width: 40,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.4), transparent)',
              margin: '0 auto 20px',
            }} />

            {/* Description */}
            <p style={{
              margin: '0 0 32px',
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 400,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              {featured.description}
            </p>

            {/* CTA */}
            <button
              onClick={handleExplore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '0.01em',
                boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';
              }}
            >
              Explore the Timeline
              <span style={{ fontSize: 18 }}>→</span>
            </button>
          </>
        )}

        <p style={{ marginTop: 18, fontSize: 12, color: '#334155' }}>
          Press Esc or click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
