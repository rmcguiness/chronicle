/**
 * TimelineDetailPage — shareable public timeline view.
 *
 * Route: /timeline/:shareToken
 *
 * Renders a vertical chronological timeline with:
 *  - Title + description header
 *  - Key events count badge
 *  - Share button (copy URL)
 *  - Chronological event list with year, title, description, category color
 *  - "Explore on map" link if events have locations
 *  - "Build your own" CTA at bottom
 */
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchTimelineByToken } from '../api/client';
import type { TimelineEvent } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

const CARD_STAGGER = 0.05;

function formatYear(year: number | null, isBce: boolean): string {
  if (year == null) return 'Unknown';
  return isBce ? `${year} BCE` : String(year);
}

function categoryColor(cat: string | null): string {
  return CATEGORY_COLORS[cat as EventCategory] ?? '#6b7280';
}

function categoryLabel(cat: string | null): string {
  return CATEGORY_LABELS[cat as EventCategory] ?? cat ?? 'Event';
}

export default function TimelineDetailPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [copied, setCopied] = useState(false);

  const { data: timeline, isLoading, error } = useQuery({
    queryKey: ['timeline', shareToken],
    queryFn: () => fetchTimelineByToken(shareToken!),
    enabled: !!shareToken,
  });

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const hasLocations = timeline?.events.some(e => e.lat != null && e.lng != null);

  // Sort events chronologically (BCE events have negative effective year)
  const sortedEvents = timeline?.events
    ? [...timeline.events].sort((a, b) => {
        const ya = a.year_approx != null ? (a.is_bce ? -a.year_approx : a.year_approx) : 0;
        const yb = b.year_approx != null ? (b.is_bce ? -b.year_approx : b.year_approx) : 0;
        return ya - yb;
      })
    : [];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: "'Inter', sans-serif",
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <header style={{
        padding: '48px 24px 0',
        maxWidth: 800,
        margin: '0 auto',
      }}>
        <Link to="/timelines" style={{
          color: '#94a3b8',
          textDecoration: 'none',
          fontSize: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 24,
        }}>
          &larr; All Timelines
        </Link>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>
            Loading timeline...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 80, color: '#f87171' }}>
            Timeline not found or backend unavailable.
          </div>
        )}
      </header>

      {timeline && (
        <main style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 64px' }}>
          {/* Title section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 12px', color: '#f8fafc' }}>
              {timeline.title}
            </h1>
            {timeline.description && (
              <p style={{ fontSize: 17, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.6 }}>
                {timeline.description}
              </p>
            )}

            {/* Action bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <span style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
              }}>
                Key events: {timeline.events.length}
              </span>

              <button
                onClick={handleShare}
                style={{
                  background: 'rgba(148, 163, 184, 0.1)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  color: '#e2e8f0',
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {copied ? 'Copied!' : 'Share'}
              </button>

              {hasLocations && (
                <Link to="/" style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#86efac',
                  padding: '6px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  Explore on map
                </Link>
              )}
            </div>
          </motion.div>

          {/* Vertical timeline */}
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 15,
              top: 8,
              bottom: 8,
              width: 2,
              background: 'rgba(148, 163, 184, 0.15)',
              borderRadius: 1,
            }} />

            {sortedEvents.map((event, i) => (
              <TimelineEventCard key={event.id} event={event} index={i} />
            ))}
          </div>

          {/* Build your own CTA */}
          <div style={{
            textAlign: 'center',
            marginTop: 56,
            padding: '40px 24px',
            borderRadius: 16,
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 12px', color: '#f8fafc' }}>
              Build Your Own Timeline
            </h2>
            <p style={{ color: '#94a3b8', margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              Explore Chronicle's events and create a custom shareable timeline.
            </p>
            <Link to="/timelines" style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 8,
              background: '#6366f1',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
              marginRight: 12,
            }}>
              Browse Timelines
            </Link>
            <Link to="/" style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: 8,
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
            }}>
              Explore Events
            </Link>
          </div>
        </main>
      )}
    </div>
  );
}

function TimelineEventCard({ event, index }: { event: TimelineEvent; index: number }) {
  const color = categoryColor(event.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * CARD_STAGGER, duration: 0.35 }}
      style={{ position: 'relative', marginBottom: 24 }}
    >
      {/* Dot on the timeline */}
      <div style={{
        position: 'absolute',
        left: -33,
        top: 18,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: color,
        border: '2px solid #0f172a',
        boxShadow: `0 0 0 3px ${color}33`,
      }} />

      <Link
        to={`/event/${event.slug}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: 12,
          padding: '20px 24px',
          transition: 'border-color 0.2s',
          cursor: 'pointer',
          borderLeft: `3px solid ${color}`,
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${color}66`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(148, 163, 184, 0.1)';
            (e.currentTarget as HTMLDivElement).style.borderLeftColor = color;
          }}
        >
          {/* Year + category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>
              {formatYear(event.year_approx, event.is_bce)}
            </span>
            <span style={{
              fontSize: 11,
              color: '#94a3b8',
              background: 'rgba(148, 163, 184, 0.08)',
              padding: '2px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {categoryLabel(event.category)}
            </span>
            {event.geo_modern && (
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {event.geo_modern}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 6px', color: '#f8fafc' }}>
            {event.title}
          </h3>

          {/* Description snippet */}
          {event.short_description && (
            <p style={{
              fontSize: 14,
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {event.short_description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
