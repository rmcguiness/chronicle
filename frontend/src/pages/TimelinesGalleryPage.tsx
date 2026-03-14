/**
 * TimelinesGalleryPage — browse public timelines.
 *
 * Route: /timelines
 *
 * Card grid showing title, description, event count badge,
 * preview of first 3 event names, and a "View Timeline" button.
 */
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchTimelines } from '../api/client';
import type { TimelineListItem } from '../api/client';

const CARD_STAGGER = 0.06;

export default function TimelinesGalleryPage() {
  const { data: timelines, isLoading, error } = useQuery({
    queryKey: ['timelines'],
    queryFn: fetchTimelines,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: "'Inter', sans-serif",
      color: '#e2e8f0',
    }}>
      {/* Header */}
      <header style={{
        padding: '48px 24px 32px',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <Link to="/" style={{
          color: '#94a3b8',
          textDecoration: 'none',
          fontSize: 14,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 24,
        }}>
          &larr; Back to Chronicle
        </Link>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 12px', color: '#f8fafc' }}>
          Timelines
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', margin: 0, maxWidth: 640 }}>
          Curated collections of historical events. Explore a timeline or build your own.
        </p>
      </header>

      {/* Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>
            Loading timelines...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 80, color: '#f87171' }}>
            Failed to load timelines. Is the backend running?
          </div>
        )}

        {timelines && timelines.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>
            No timelines yet. Be the first to create one!
          </div>
        )}

        {timelines && timelines.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24,
          }}>
            {timelines.map((tl, i) => (
              <TimelineCard key={tl.id} timeline={tl} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: 56,
          padding: '40px 24px',
          borderRadius: 16,
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 12px', color: '#f8fafc' }}>
            Build Your Own Timeline
          </h2>
          <p style={{ color: '#94a3b8', margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Select events from Chronicle's database and create a shareable timeline.
          </p>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 8,
            background: '#6366f1',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 15,
          }}>
            Explore Events
          </Link>
        </div>
      </main>
    </div>
  );
}

function TimelineCard({ timeline: tl, index }: { timeline: TimelineListItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * CARD_STAGGER, duration: 0.35 }}
    >
      <Link
        to={`/timeline/${tl.share_token}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(148, 163, 184, 0.12)',
          borderRadius: 14,
          padding: 28,
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99, 102, 241, 0.5)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(148, 163, 184, 0.12)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          }}
        >
          {/* Title + badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#f8fafc', lineHeight: 1.3 }}>
              {tl.title}
            </h3>
            <span style={{
              flexShrink: 0,
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              {tl.event_count} events
            </span>
          </div>

          {/* Description */}
          {tl.description && (
            <p style={{
              fontSize: 14,
              color: '#94a3b8',
              margin: '0 0 16px',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {tl.description}
            </p>
          )}

          {/* Event preview */}
          {tl.event_preview.length > 0 && (
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Featured events:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {tl.event_preview.map((name, i) => (
                  <span key={i} style={{
                    background: 'rgba(148, 163, 184, 0.08)',
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#cbd5e1',
                  }}>
                    {name}
                  </span>
                ))}
                {tl.event_count > 3 && (
                  <span style={{
                    padding: '3px 10px',
                    fontSize: 12,
                    color: '#64748b',
                  }}>
                    +{tl.event_count - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            marginTop: 16,
            color: '#818cf8',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            View Timeline &rarr;
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
