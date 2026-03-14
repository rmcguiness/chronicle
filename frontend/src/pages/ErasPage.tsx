/**
 * ErasPage — era directory at /eras.
 *
 * Displays all 6 historical eras as cards in a grid, each linking to
 * the dedicated /era/:era detail page.
 */

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchEraList } from '../api/client';
import { ERA_COLORS } from '../types/era';
import type { EraSlug, EraSummary } from '../types/era';

// ─── Design tokens ──────────────────────────────────────────────────────────

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';

const navLinkStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 500,
  color: '#cbd5e1',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  textDecoration: 'none',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Format year with BCE/CE suffix. */
function fmtYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

// ─── Era Card ───────────────────────────────────────────────────────────────

function EraCard({ era, index }: { era: EraSummary; index: number }) {
  const colors = ERA_COLORS[era.slug];

  return (
    <Link to={`/era/${era.slug}`} style={{ textDecoration: 'none' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          padding: 24,
          height: '100%',
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = colors.accent;
          (e.currentTarget as HTMLElement).style.background = colors.bg;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER;
          (e.currentTarget as HTMLElement).style.background = CARD_BG;
        }}
      >
        {/* Color accent bar */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: colors.accent, marginBottom: 14,
        }} />

        <h3 style={{ fontSize: 20, fontWeight: 700, color: colors.accent, margin: 0 }}>
          {era.name}
        </h3>

        <p style={{ fontSize: 13, color: TEXT_SECONDARY, margin: '6px 0 0' }}>
          {fmtYear(era.year_min)} &ndash; {fmtYear(era.year_max)}
        </p>

        <p style={{
          fontSize: 13, color: TEXT_MUTED, margin: '12px 0 0',
          lineHeight: 1.6, display: '-webkit-box',
          WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {era.description}
        </p>

        <div style={{
          display: 'flex', gap: 16, marginTop: 16, paddingTop: 14,
          borderTop: `1px solid ${CARD_BORDER}`,
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_PRIMARY }}>{era.event_count}</div>
            <div style={{ fontSize: 11, color: TEXT_MUTED }}>events</div>
          </div>
          {era.top_event && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>Top event</div>
              <div style={{
                fontSize: 13, color: TEXT_SECONDARY, fontWeight: 500, marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {era.top_event.title} ({fmtYear(era.top_event.year_approx)})
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ErasPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['eras'],
    queryFn: fetchEraList,
  });

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Top nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,14,34,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px',
      }}>
        <Link to="/" style={{ color: TEXT_SECONDARY, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          Chronicle
        </Link>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link to="/" style={navLinkStyle}>Graph</Link>
          <Link to="/explore" style={navLinkStyle}>Explore</Link>
          <Link to="/eras" style={{ ...navLinkStyle, color: '#6366f1' }}>Eras</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px 60px' }}>
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 40, fontWeight: 700, color: TEXT_PRIMARY, margin: 0, textAlign: 'center' }}
        >
          Historical Eras
        </motion.h1>
        <p style={{ fontSize: 15, color: TEXT_MUTED, textAlign: 'center', margin: '12px 0 40px', lineHeight: 1.6 }}>
          Explore world history across six major periods — from the earliest civilizations to the present day.
        </p>

        {isLoading && (
          <div style={{ textAlign: 'center', color: TEXT_MUTED, padding: 60 }}>Loading eras...</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 60 }}>
            Failed to load eras. Is the backend running?
          </div>
        )}

        {data && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 18,
          }}>
            {data.eras.map((era, i) => (
              <EraCard key={era.slug} era={era} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
