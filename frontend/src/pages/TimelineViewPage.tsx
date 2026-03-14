/**
 * TimelineViewPage — shareable read-only view of a custom timeline.
 *
 * Route: /timeline/:id
 *
 * Loads the timeline from localStorage by ID and renders it in a clean,
 * printable format. Falls back to featured timelines if not found in localStorage.
 */
import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTimelineById, type SavedTimeline } from '../store/timelineBuilder';
import { FEATURED_TIMELINES } from '../data/featuredTimelines';
import type { EventCategory } from '../types';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#3b82f6';

/** TimelineViewPage — renders a curated timeline in read-only mode. */
export default function TimelineViewPage() {
  const { id } = useParams<{ id: string }>();

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

  const timeline = useMemo((): SavedTimeline | null => {
    if (!id) return null;
    // Check localStorage first, then featured timelines
    const saved = getTimelineById(id);
    if (saved) return saved;

    const featured = FEATURED_TIMELINES.find((t) => t.id === id);
    if (featured) {
      return {
        id: featured.id,
        name: featured.name,
        description: featured.description,
        events: featured.events,
        createdAt: '',
        updatedAt: '',
      };
    }
    return null;
  }, [id]);

  if (!timeline) {
    return (
      <PageShell>
        <div style={{ padding: '60px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>&#128270;</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 8 }}>
            Timeline not found
          </div>
          <div style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 24 }}>
            This timeline may have been created on a different device or browser.
          </div>
          <Link
            to="/builder"
            style={{
              display: 'inline-block',
              fontSize: 14,
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: 8,
              backgroundColor: `${ACCENT}22`,
              border: `1px solid ${ACCENT}66`,
              color: ACCENT,
              textDecoration: 'none',
            }}
          >
            Build Your Own Timeline
          </Link>
        </div>
      </PageShell>
    );
  }

  const years = timeline.events.map((e) => e.year_approx);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <PageShell>
      {/* Header */}
      <div style={{ padding: '32px 32px 24px', borderBottom: `1px solid ${BORDER}` }}>
        <Link
          to="/timelines"
          style={{
            fontSize: 13,
            color: TEXT_MUTED,
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            backgroundColor: CARD_BG,
            display: 'inline-block',
            marginBottom: 20,
          }}
        >
          &larr; All Timelines
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: TEXT_PRIMARY, marginBottom: 8 }}>
          {timeline.name}
        </h1>
        {timeline.description && (
          <p style={{ fontSize: 14, color: TEXT_SECONDARY, margin: 0, marginBottom: 8 }}>
            {timeline.description}
          </p>
        )}
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>
          {timeline.events.length} events &middot; {minYear} &ndash; {maxYear}
        </div>
      </div>

      {/* Events timeline */}
      <div style={{ padding: '24px 32px' }}>
        {timeline.events.map((ev, i) => {
          const catColor = CATEGORY_COLORS[ev.category as EventCategory] ?? '#6b7280';
          const catIcon = CATEGORY_ICONS[ev.category as EventCategory] ?? '';
          const catLabel = CATEGORY_LABELS[ev.category as EventCategory] ?? ev.category;

          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              style={{ display: 'flex', gap: 16, marginBottom: 0 }}
            >
              {/* Vertical line + dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
                {i > 0 && <div style={{ width: 2, height: 16, backgroundColor: `${catColor}44` }} />}
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: catColor,
                    border: `2px solid ${catColor}88`,
                    boxShadow: `0 0 12px ${catColor}33`,
                    flexShrink: 0,
                  }}
                />
                {i < timeline.events.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 16, backgroundColor: `${catColor}22` }} />}
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  marginBottom: 12,
                  borderRadius: 10,
                  backgroundColor: CARD_BG,
                  border: `1px solid ${catColor}22`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{catIcon}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY }}>{ev.title}</span>
                </div>
                <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                  {ev.year_approx}
                  {ev.geo_modern && <> &middot; {ev.geo_modern}</>}
                  {' '}&middot;{' '}
                  <span style={{ color: catColor }}>{catLabel}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Build your own CTA */}
      <div
        style={{
          padding: '32px',
          borderTop: `1px solid ${BORDER}`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 12 }}>
          Inspired? Create your own history playlist.
        </div>
        <Link
          to="/builder"
          style={{
            display: 'inline-block',
            fontSize: 14,
            fontWeight: 700,
            padding: '12px 28px',
            borderRadius: 8,
            backgroundColor: `${ACCENT}22`,
            border: `1px solid ${ACCENT}66`,
            color: ACCENT,
            textDecoration: 'none',
          }}
        >
          Build Your Own Timeline
        </Link>
      </div>
    </PageShell>
  );
}

/** Page shell matching the dark Chronicle theme. */
function PageShell({ children }: { children: React.ReactNode }) {
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
      <div style={{ maxWidth: 800, margin: '0 auto' }}>{children}</div>
    </div>
  );
}
