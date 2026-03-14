/**
 * /featured — Magazine-style editorial page with curated historical content.
 *
 * Sections: Event of the Week (hero), Person Spotlight, Featured Era,
 * Hidden Gem, Did You Know, Trending Events.
 */
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchFeatured } from '../api/client';
import type { FeaturedEvent, FeaturedPerson, FeaturedEra } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatYear(year: number | null): string {
  if (year === null) return '';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function catColor(cat: string | null): string {
  return CATEGORY_COLORS[cat as EventCategory] ?? '#64748b';
}

function catIcon(cat: string | null): string {
  return CATEGORY_ICONS[cat as EventCategory] ?? '';
}

// ── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

// ── Styles ──────────────────────────────────────────────────────────────────

const PAGE: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #070e22 0%, #0c1631 40%, #111827 100%)',
  color: '#e2e8f0',
  fontFamily: "'Inter', system-ui, sans-serif",
  overflowX: 'hidden',
};

const CONTAINER: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '0 24px 80px',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 'clamp(14px, 1.2vw, 16px)',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  marginBottom: 20,
};

const CARD: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.7)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
};

// ── Sub-components ──────────────────────────────────────────────────────────

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px',
      background: 'rgba(7,14,34,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', color: '#94a3b8',
          cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ fontSize: 18 }}>&larr;</span> Back to Timeline
      </button>
      <h1 style={{
        margin: 0, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 700,
        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '0.04em',
      }}>
        Featured
      </h1>
      <div style={{ width: 100 }} />
    </nav>
  );
}

function HeroCard({ event, navigate }: { event: FeaturedEvent; navigate: (p: string) => void }) {
  const color = catColor(event.category);
  return (
    <motion.div
      custom={0} variants={fadeUp} initial="hidden" animate="visible"
      style={{
        ...CARD,
        position: 'relative',
        padding: '48px 40px',
        cursor: 'pointer',
        background: `linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.95)), linear-gradient(135deg, ${color}22, transparent)`,
        borderColor: `${color}30`,
      }}
      onClick={() => navigate(`/event/${event.slug}`)}
      whileHover={{ scale: 1.005 }}
    >
      <div style={{ ...SECTION_TITLE, color: color, marginBottom: 12 }}>
        Event of the Week
      </div>
      <h2 style={{
        margin: '0 0 12px', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
        lineHeight: 1.1, letterSpacing: '-0.02em',
      }}>
        {event.title}
      </h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, fontSize: 14, color: '#94a3b8' }}>
        {event.year_approx !== null && <span>{formatYear(event.year_approx)}</span>}
        {event.region && <span>{event.region}</span>}
        {event.category && (
          <span style={{ color }}>{catIcon(event.category)} {CATEGORY_LABELS[event.category as EventCategory] ?? event.category}</span>
        )}
      </div>
      {event.summary && (
        <p style={{ margin: 0, fontSize: 'clamp(15px, 1.4vw, 18px)', lineHeight: 1.65, color: '#cbd5e1', maxWidth: 700 }}>
          {event.summary}
        </p>
      )}
      <div style={{
        marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20,
        background: `${color}18`, color, fontSize: 13, fontWeight: 600,
      }}>
        {event.causality_count} causality links
      </div>
    </motion.div>
  );
}

function PersonCard({ person }: { person: FeaturedPerson }) {
  const lifespan = [
    person.birth_year !== null ? formatYear(person.birth_year) : null,
    person.death_year !== null ? formatYear(person.death_year) : null,
  ].filter(Boolean).join(' — ');

  return (
    <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" style={{ ...CARD, padding: '32px 36px' }}>
      <div style={{ ...SECTION_TITLE, color: '#eab308' }}>
        Person Spotlight
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #eab308, #f59e0b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, color: '#0f172a', fontWeight: 700,
        }}>
          {person.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: '0 0 6px', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700 }}>{person.name}</h3>
          {lifespan && <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>{lifespan}</div>}
          {person.roles.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {person.roles.map(r => (
                <span key={r} style={{
                  padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                  background: 'rgba(234,179,8,0.12)', color: '#eab308',
                }}>{r}</span>
              ))}
            </div>
          )}
          {person.description && (
            <p style={{ margin: '0 0 8px', fontSize: 15, lineHeight: 1.6, color: '#cbd5e1' }}>
              {person.description.length > 300 ? person.description.slice(0, 300) + '…' : person.description}
            </p>
          )}
          <div style={{ fontSize: 13, color: '#94a3b8' }}>
            Linked to <strong style={{ color: '#eab308' }}>{person.event_count}</strong> events
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EraSection({ era, navigate }: { era: FeaturedEra; navigate: (p: string) => void }) {
  return (
    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" style={{ ...CARD, padding: '32px 36px' }}>
      <div style={{ ...SECTION_TITLE, color: era.color }}>
        Featured Era
      </div>
      <h3 style={{ margin: '0 0 4px', fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700 }}>{era.name}</h3>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>
        {formatYear(era.year_start)} — {formatYear(era.year_end)}
      </div>
      <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.65, color: '#94a3b8', maxWidth: 700 }}>
        {era.description}
      </p>
      {era.top_events.length > 0 && (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {era.top_events.map(ev => (
            <div
              key={ev.id}
              onClick={() => navigate(`/event/${ev.slug}`)}
              style={{
                flex: '1 1 200px', padding: '16px 20px', borderRadius: 8, cursor: 'pointer',
                background: `${era.color}10`, border: `1px solid ${era.color}20`,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${era.color}50`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = `${era.color}20`)}
            >
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>
                {formatYear(ev.year_approx)} {ev.region && `· ${ev.region}`}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function HiddenGemCard({ event, navigate }: { event: FeaturedEvent; navigate: (p: string) => void }) {
  return (
    <motion.div
      custom={3} variants={fadeUp} initial="hidden" animate="visible"
      style={{
        ...CARD, padding: '28px 32px', cursor: 'pointer',
        background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(20,30,55,0.9))',
        borderColor: 'rgba(168,85,247,0.2)',
      }}
      onClick={() => navigate(`/event/${event.slug}`)}
      whileHover={{ scale: 1.005 }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 20, marginBottom: 14,
        background: 'rgba(168,85,247,0.15)', color: '#a855f7',
        fontSize: 13, fontWeight: 700,
      }}>
        Hidden Gem
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700 }}>{event.title}</h3>
      <div style={{ fontSize: 14, color: '#64748b', marginBottom: 10 }}>
        {formatYear(event.year_approx)} {event.region && `· ${event.region}`}
      </div>
      {event.summary && (
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#94a3b8' }}>{event.summary}</p>
      )}
    </motion.div>
  );
}

function DidYouKnowSection({ facts }: { facts: string[] }) {
  return (
    <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" style={{ ...CARD, padding: '28px 32px' }}>
      <div style={{ ...SECTION_TITLE, color: '#3b82f6' }}>
        Did You Know?
      </div>
      <ol style={{ margin: 0, paddingLeft: 24 }}>
        {facts.map((fact, i) => (
          <li key={i} style={{
            fontSize: 15, lineHeight: 1.7, color: '#cbd5e1',
            marginBottom: i < facts.length - 1 ? 12 : 0,
          }}>
            {fact}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function TrendingSection({ events, navigate }: { events: FeaturedEvent[]; navigate: (p: string) => void }) {
  return (
    <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
      <div style={{ ...SECTION_TITLE, color: '#ef4444', marginBottom: 16 }}>
        Trending Events
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {events.map((ev, i) => {
          const color = catColor(ev.category);
          return (
            <div
              key={ev.id}
              onClick={() => navigate(`/event/${ev.slug}`)}
              style={{
                ...CARD, padding: '16px 20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `linear-gradient(135deg, ${color}30, ${color}10)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {formatYear(ev.year_approx)} {ev.region && `· ${ev.region}`}
                </div>
              </div>
              <div style={{
                padding: '4px 10px', borderRadius: 12, flexShrink: 0,
                background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                fontSize: 12, fontWeight: 700,
              }}>
                {ev.causality_count} links
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function FeaturedPage() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState<number | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ['featured', seed],
    queryFn: () => fetchFeatured(seed),
    staleTime: 60_000,
  });

  const handleRefresh = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1_000_000));
  }, []);

  if (isLoading) {
    return (
      <div style={PAGE}>
        <NavBar />
        <div style={{ ...CONTAINER, paddingTop: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#64748b' }}>Loading featured content...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={PAGE}>
        <NavBar />
        <div style={{ ...CONTAINER, paddingTop: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#ef4444' }}>Failed to load featured content</div>
          <button
            onClick={handleRefresh}
            style={{
              marginTop: 16, padding: '10px 24px', borderRadius: 8,
              background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={PAGE}>
      <NavBar />

      {/* Header */}
      <header style={{
        padding: '48px 24px 32px', textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(96,165,250,0.06) 0%, transparent 100%)',
      }}>
        <h1 style={{
          margin: '0 0 8px', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em',
        }}>
          Featured
        </h1>
        <p style={{ margin: '0 0 24px', fontSize: 'clamp(14px, 1.4vw, 18px)', color: '#64748b' }}>
          Curated highlights from across history
        </p>
        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 20px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e2e8f0'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          Refresh
        </button>
      </header>

      <div style={CONTAINER}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Event of the Week — Hero */}
          {data.event_of_the_week && <HeroCard event={data.event_of_the_week} navigate={navigate} />}

          {/* Two-column: Person + Hidden Gem */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {data.person_spotlight && <PersonCard person={data.person_spotlight} />}
            {data.hidden_gem && <HiddenGemCard event={data.hidden_gem} navigate={navigate} />}
          </div>

          {/* Featured Era */}
          {data.featured_era && <EraSection era={data.featured_era} navigate={navigate} />}

          {/* Two-column: Did You Know + Trending */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {data.did_you_know.length > 0 && <DidYouKnowSection facts={data.did_you_know} />}
            {data.trending.length > 0 && <TrendingSection events={data.trending} navigate={navigate} />}
          </div>
        </div>
      </div>
    </div>
  );
}
