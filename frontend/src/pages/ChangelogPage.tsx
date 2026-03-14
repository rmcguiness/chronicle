/**
 * ChangelogPage — /changelog route.
 *
 * Displays a chronological log of feature releases and data updates,
 * plus a roadmap teaser at the bottom.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface ChangelogEntry {
  icon: string;
  text: string;
  route?: string;
}

interface ChangelogRelease {
  date: string;
  title: string;
  entries: ChangelogEntry[];
}

const RELEASES: ChangelogRelease[] = [
  {
    date: 'March 14, 2026',
    title: 'Major Feature Sprint',
    entries: [
      { icon: '✨', text: 'Civilizations Explorer — Compare 15 major world civilizations', route: '/civilizations' },
      { icon: '✨', text: 'Historical Influence Map — See which events shaped history most', route: '/influence' },
      { icon: '✨', text: 'Timeline Replay — Watch history unfold with animated playback', route: '/replay' },
      { icon: '✨', text: 'Themes Explorer — Browse history by wars, discoveries, empires + more', route: '/themes' },
      { icon: '✨', text: 'History Rabbit Hole — Follow causal chains across history', route: '/rabbit-hole' },
      { icon: '✨', text: 'Decades Browser — Decade-by-decade history with heatmap', route: '/decades' },
      { icon: '✨', text: 'Biography Pages — Full profiles for historical figures', route: '/people/:slug' },
      { icon: '✨', text: 'Stats Page — Chronicle knowledge graph analytics', route: '/stats' },
      { icon: '✨', text: 'Timeline Builder — Create custom history playlists', route: '/builder' },
      { icon: '✨', text: 'Explore Page — Curated history discovery', route: '/explore' },
      { icon: '✨', text: 'Advanced Search — Multi-filter power search', route: '/search' },
      { icon: '✨', text: 'Era Pages — Dedicated pages for all 6 historical eras', route: '/era/:era' },
      { icon: '✨', text: 'Guess the Year — Test your history knowledge', route: '/game' },
      { icon: '✨', text: 'Daily Challenge — Wordle-style daily event', route: '/daily' },
      { icon: '✨', text: 'Connections Puzzle — Group events by hidden themes', route: '/connections' },
      { icon: '✨', text: 'Event Comparison — Side-by-side event analysis', route: '/compare' },
      { icon: '✨', text: 'Notable Years — Browse any year in history', route: '/years' },
      { icon: '✨', text: 'Region Pages — Dedicated world region history', route: '/region/:region' },
      { icon: '✨', text: 'Historical Lifespans — Gantt chart of when people lived', route: '/lifespans' },
      { icon: '✨', text: 'Six Degrees of History — Find causal paths between events', route: '/six-degrees' },
      { icon: '✨', text: 'Event Pages — Standalone shareable event detail pages', route: '/event/:slug' },
      { icon: '✨', text: 'Historical Glossary — 80+ historical terms defined', route: '/glossary' },
    ],
  },
  {
    date: 'March 2026',
    title: 'Previous Releases',
    entries: [
      { icon: '🔧', text: 'Data: 1,560 events with Wikipedia summaries and pgvector embeddings' },
      { icon: '🔧', text: 'Data: 1,419 causality links mapped across all of history' },
      { icon: '🔧', text: 'Data: 51 historical figures with biographies' },
      { icon: '🔧', text: 'Perf: React-flow viewport culling (PERF-02)' },
      { icon: '🔧', text: 'Perf: Tile API LOD + pagination (PERF-03)' },
    ],
  },
];

const ROADMAP = [
  { emoji: '🌍', text: 'Country-specific history pages' },
  { emoji: '📱', text: 'Mobile app' },
  { emoji: '🤝', text: 'Community event submissions (voting, moderation)' },
  { emoji: '🔊', text: 'Audio narration for events' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Hero section. */
function ChangelogHero() {
  return (
    <div
      style={{
        padding: '80px 32px 48px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(168,85,247,0.08) 0%, rgba(7,14,34,1) 100%)',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#64748b',
          textDecoration: 'none',
          marginBottom: 32,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      >
        ← Back to Timeline
      </Link>

      <h1
        style={{
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: 900,
          color: '#f1f5f9',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          marginBottom: 12,
        }}
      >
        What's New in Chronicle
      </h1>
      <p style={{ fontSize: 16, color: '#94a3b8', margin: 0 }}>
        Latest updates and feature releases
      </p>
    </div>
  );
}

/** Single release block with date, title, and entries list. */
function ReleaseBlock({ release, index }: { release: ChangelogRelease; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      style={{
        padding: '32px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Date badge + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#a855f7',
            padding: '4px 10px',
            borderRadius: 6,
            backgroundColor: 'rgba(168,85,247,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            flexShrink: 0,
          }}
        >
          {release.date}
        </span>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
          {release.title}
        </span>
      </div>

      {/* Entry list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {release.entries.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '8px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: 14,
              color: '#cbd5e1',
              lineHeight: 1.5,
            }}
          >
            <span style={{ flexShrink: 0 }}>{entry.icon}</span>
            <span>
              {entry.icon === '✨' && (
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>New: </span>
              )}
              {entry.text}
              {entry.route && (
                <span style={{ color: '#64748b', fontSize: 12, marginLeft: 6 }}>
                  ({entry.route})
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/** Roadmap teaser section at the bottom. */
function RoadmapTeaser() {
  return (
    <section style={{ padding: '32px 32px 48px' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>🚀</span> Coming Soon
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROADMAP.map((item) => (
          <div
            key={item.text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.1)',
              fontSize: 14,
              color: '#94a3b8',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.emoji}</span>
            {item.text}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────

/** Scrollable dark page wrapper. */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ChangelogPage — renders /changelog with release history and roadmap teaser.
 */
export default function ChangelogPage() {
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

  return (
    <PageShell>
      <ChangelogHero />
      {RELEASES.map((release, i) => (
        <ReleaseBlock key={release.date} release={release} index={i} />
      ))}
      <RoadmapTeaser />
    </PageShell>
  );
}
