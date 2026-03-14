/**
 * TimelinesGalleryPage — /timelines gallery of featured and user-created timelines.
 *
 * Shows 6 pre-built featured timelines and any user-saved timelines from localStorage.
 * Route: /timelines
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FEATURED_TIMELINES, type FeaturedTimeline } from '../data/featuredTimelines';
import { getSavedTimelines, deleteTimeline, type SavedTimeline } from '../store/timelineBuilder';
import type { EventCategory } from '../types';
import { CATEGORY_COLORS } from '../utils/categories';

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#3b82f6';

/** TimelinesGalleryPage — browse featured and user timelines. */
export default function TimelinesGalleryPage() {
  const [userTimelines, setUserTimelines] = useState<SavedTimeline[]>([]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    setUserTimelines(getSavedTimelines());
  }, []);

  const handleDelete = (id: string) => {
    deleteTimeline(id);
    setUserTimelines(getSavedTimelines());
  };

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: PAGE_BG,
        color: TEXT_PRIMARY,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Nav */}
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: TEXT_MUTED,
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            backgroundColor: CARD_BG,
            display: 'inline-block',
            marginBottom: 24,
          }}
        >
          &larr; Back to Timeline
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY, marginBottom: 8 }}>
          Timeline Gallery
        </h1>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 32 }}>
          Explore curated history playlists or create your own.
        </p>

        {/* Create Your Own hero card */}
        <Link
          to="/builder"
          style={{ textDecoration: 'none' }}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            style={{
              padding: '28px 32px',
              borderRadius: 14,
              border: `2px dashed ${ACCENT}44`,
              backgroundColor: `${ACCENT}08`,
              textAlign: 'center',
              marginBottom: 32,
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.6 }}>+</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: ACCENT, marginBottom: 4 }}>
              Create Your Own
            </div>
            <div style={{ fontSize: 13, color: TEXT_SECONDARY }}>
              Pick events, arrange them, and share your history playlist
            </div>
          </motion.div>
        </Link>

        {/* Featured timelines */}
        <h2
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: TEXT_MUTED,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
          }}
        >
          Featured Timelines
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}
        >
          {FEATURED_TIMELINES.map((t, i) => (
            <FeaturedTimelineCard key={t.id} timeline={t} index={i} />
          ))}
        </div>

        {/* User timelines */}
        {userTimelines.length > 0 && (
          <>
            <h2
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: TEXT_MUTED,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 16,
              }}
            >
              Your Timelines
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {userTimelines.map((t, i) => (
                <UserTimelineCard key={t.id} timeline={t} index={i} onDelete={() => handleDelete(t.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface FeaturedTimelineCardProps {
  timeline: FeaturedTimeline;
  index: number;
}

/** Card for a featured timeline. */
function FeaturedTimelineCard({ timeline, index }: FeaturedTimelineCardProps) {
  const years = timeline.events.map((e) => e.year_approx);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Color accent from most common category
  const catCounts: Record<string, number> = {};
  for (const e of timeline.events) {
    catCounts[e.category] = (catCounts[e.category] ?? 0) + 1;
  }
  const topCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'political';
  const accentColor = CATEGORY_COLORS[topCat as EventCategory] ?? ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
    >
      <Link
        to={`/timeline/${timeline.id}`}
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            padding: '20px',
            borderRadius: 12,
            border: `1px solid ${accentColor}33`,
            backgroundColor: CARD_BG,
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            height: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${accentColor}66`;
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = `${accentColor}33`;
            e.currentTarget.style.backgroundColor = CARD_BG;
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 6 }}>
            {timeline.name}
          </div>
          <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 12, lineHeight: 1.5 }}>
            {timeline.description}
          </div>
          <div style={{ display: 'flex', gap: 8, fontSize: 11, color: TEXT_MUTED }}>
            <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: `${accentColor}15`, color: accentColor }}>
              {timeline.events.length} events
            </span>
            <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}>
              {minYear} &ndash; {maxYear}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

interface UserTimelineCardProps {
  timeline: SavedTimeline;
  index: number;
  onDelete: () => void;
}

/** Card for a user-created timeline. */
function UserTimelineCard({ timeline, index, onDelete }: UserTimelineCardProps) {
  const years = timeline.events.map((e) => e.year_approx);
  const minYear = years.length ? Math.min(...years) : 0;
  const maxYear = years.length ? Math.max(...years) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      style={{
        padding: '20px',
        borderRadius: 12,
        border: `1px solid ${BORDER}`,
        backgroundColor: CARD_BG,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 6 }}>
        {timeline.name}
      </div>
      {timeline.description && (
        <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 10 }}>
          {timeline.description}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, fontSize: 11, color: TEXT_MUTED, marginBottom: 12 }}>
        <span>{timeline.events.length} events</span>
        {years.length > 0 && <span>&middot; {minYear} &ndash; {maxYear}</span>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link
          to={`/timeline/${timeline.id}`}
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '5px 14px',
            borderRadius: 6,
            backgroundColor: `${ACCENT}22`,
            border: `1px solid ${ACCENT}44`,
            color: ACCENT,
            textDecoration: 'none',
          }}
        >
          View
        </Link>
        <button
          onClick={onDelete}
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: '5px 14px',
            borderRadius: 6,
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
