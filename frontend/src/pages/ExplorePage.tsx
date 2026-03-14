/**
 * ExplorePage — magazine-style discovery page at /explore.
 *
 * Curated sections that help users discover Chronicle's best content
 * without already knowing what they're looking for. All data sourced
 * from existing API endpoints — no new backend routes needed.
 *
 * Sections:
 *  a) HeroFeature — "Today's Historical Spotlight"
 *  b) OnThisDay — events that happened on today's date
 *  c) FeaturedThemes — category pills linking to the main canvas
 *  d) MostConnected — top events by causality link count
 *  e) RandomEraSpotlight — events from a randomly selected era
 *  f) RecentlyAdded — newest events in the database
 *  g) DiscoverByRegion — world regions as clickable cards
 *  h) FeaturedPeople — top historical figures from stats
 *  i) QuickActions — shortcut row at bottom
 */

import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import {
  fetchFullStats,
  fetchOnThisDay,
  fetchTiles,
} from '../api/client';
import type { FullStats, EventRecord, CountItem } from '../types/stats';
import type { OnThisDayEvent } from '../api/client';
import type { HistoricalEvent, EventCategory } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#a5b4fc';

const cardBase: React.CSSProperties = {
  background: CARD_BG,
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: 12,
  padding: 20,
  transition: 'border-color 0.15s, background 0.15s',
  cursor: 'pointer',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format year with BCE suffix. */
function fmtYear(year: number | null | undefined): string {
  if (year == null) return '???';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

/** Deterministic daily seed from today's date. */
function dailySeed(): number {
  const now = new Date();
  return (now.getMonth() + 1) * 100 + now.getDate();
}

// ─────────────────────────────────────────────────────────────────────────────
// Era definitions
// ─────────────────────────────────────────────────────────────────────────────

interface EraDef {
  label: string;
  emoji: string;
  yearMin: number;
  yearMax: number;
}

const ERAS: EraDef[] = [
  { label: 'Ancient', emoji: '🏛️', yearMin: -5000, yearMax: -500 },
  { label: 'Classical', emoji: '⚔️', yearMin: -500, yearMax: 500 },
  { label: 'Medieval', emoji: '🏰', yearMin: 500, yearMax: 1500 },
  { label: 'Early Modern', emoji: '⛵', yearMin: 1500, yearMax: 1800 },
  { label: '19th Century', emoji: '🏭', yearMin: 1800, yearMax: 1900 },
  { label: '20th Century', emoji: '🚀', yearMin: 1900, yearMax: 2000 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Theme definitions
// ─────────────────────────────────────────────────────────────────────────────

interface ThemeDef {
  label: string;
  emoji: string;
  category: EventCategory;
}

const THEMES: ThemeDef[] = [
  { label: 'Wars', emoji: '⚔️', category: 'war' },
  { label: 'Discoveries', emoji: '🔭', category: 'discovery' },
  { label: 'Empires', emoji: '👑', category: 'political' },
  { label: 'Revolutions', emoji: '🔥', category: 'political' },
  { label: 'Religion', emoji: '✝️', category: 'cultural' },
  { label: 'Science', emoji: '🧪', category: 'discovery' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Region definitions
// ─────────────────────────────────────────────────────────────────────────────

interface RegionDef {
  label: string;
  emoji: string;
  /** Keywords matched against coverage.by_region labels. */
  keywords: string[];
}

const REGION_DEFS: RegionDef[] = [
  { label: 'Europe', emoji: '🇪🇺', keywords: ['France', 'England', 'Germany', 'Italy', 'Spain', 'Greece', 'Russia', 'UK', 'Netherlands', 'Poland', 'Austria', 'Sweden', 'Portugal'] },
  { label: 'Asia', emoji: '🌏', keywords: ['China', 'Japan', 'India', 'Korea', 'Vietnam', 'Indonesia', 'Thailand', 'Mongolia'] },
  { label: 'Americas', emoji: '🌎', keywords: ['USA', 'Mexico', 'Brazil', 'Canada', 'Peru', 'Argentina', 'Colombia', 'United States'] },
  { label: 'Africa', emoji: '🌍', keywords: ['Egypt', 'Ethiopia', 'Nigeria', 'South Africa', 'Morocco', 'Kenya', 'Ghana', 'Mali'] },
  { label: 'Middle East', emoji: '🕌', keywords: ['Iraq', 'Iran', 'Turkey', 'Saudi', 'Syria', 'Israel', 'Palestine', 'Ottoman'] },
  { label: 'Oceania', emoji: '🏝️', keywords: ['Australia', 'New Zealand', 'Pacific', 'Polynesia', 'Fiji'] },
];

/** Sum event counts for a region by matching keywords in coverage by_region labels. */
function regionEventCount(byRegion: CountItem[], keywords: string[]): number {
  return byRegion
    .filter((r) => keywords.some((kw) => r.label.toLowerCase().includes(kw.toLowerCase())))
    .reduce((sum, r) => sum + r.count, 0);
}

/** Find top label for a region from by_region data. */
function regionTopLabel(byRegion: CountItem[], keywords: string[]): string | null {
  const match = byRegion.find((r) =>
    keywords.some((kw) => r.label.toLowerCase().includes(kw.toLowerCase())),
  );
  return match?.label ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: HeroFeature
// ─────────────────────────────────────────────────────────────────────────────

/** "Today's Historical Spotlight" — a high-importance event picked deterministically by date. */
function HeroFeature({ stats }: { stats: FullStats }) {
  const event = stats.curiosity.highest_importance_event;
  if (!event) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: 32 }}
    >
      <SectionHeading emoji="✨" title="Today's Historical Spotlight" />
      <Link to={`/event/${event.slug}`} style={{ textDecoration: 'none' }}>
        <div
          style={{
            ...cardBase,
            padding: '32px 28px',
            background: `linear-gradient(135deg, rgba(7,14,34,0.95) 0%, ${ACCENT}12 100%)`,
            border: `1px solid ${ACCENT}33`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}66`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${ACCENT}33`; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: `${ACCENT}22`,
              color: ACCENT_LIGHT,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Featured Event
            </span>
            <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>
              {fmtYear(event.year_approx)}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 800,
            color: TEXT_PRIMARY,
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            {event.title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: ACCENT_LIGHT, fontWeight: 600 }}>
              Explore this event →
            </span>
            <span style={{
              fontSize: 12,
              color: TEXT_MUTED,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.05)',
            }}>
              Importance: {(event.value * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </Link>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: OnThisDay
// ─────────────────────────────────────────────────────────────────────────────

/** 3 events that happened on today's date across history. */
function OnThisDaySection() {
  const now = new Date();
  const { data } = useQuery({
    queryKey: ['on-this-day', now.getMonth() + 1, now.getDate()],
    queryFn: () => fetchOnThisDay(now.getMonth() + 1, now.getDate()),
    staleTime: 60 * 60 * 1000,
  });

  const events = data?.events?.slice(0, 3) ?? [];
  if (events.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading
        emoji="📅"
        title={`On This Day — ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`}
      />
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {events.map((evt: OnThisDayEvent) => (
          <Link
            key={evt.id}
            to={`/event/${evt.slug}`}
            style={{ textDecoration: 'none', flex: '0 0 auto', minWidth: 240, maxWidth: 320 }}
          >
            <div
              style={{ ...cardBase, height: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>
                {fmtYear(evt.year_approx)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3, marginBottom: 8 }}>
                {evt.title}
              </div>
              {evt.category && (
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 4,
                  backgroundColor: `${CATEGORY_COLORS[evt.category as EventCategory] ?? TEXT_MUTED}22`,
                  color: CATEGORY_COLORS[evt.category as EventCategory] ?? TEXT_MUTED,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {evt.category}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: FeaturedThemes
// ─────────────────────────────────────────────────────────────────────────────

/** 6 theme pills linking to the main canvas filtered by category. */
function FeaturedThemes() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji="🎯" title="Explore by Theme" />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {THEMES.map((t) => {
          const color = CATEGORY_COLORS[t.category] ?? ACCENT;
          return (
            <Link
              key={t.label}
              to={`/?category=${t.category}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 20,
                  backgroundColor: `${color}15`,
                  border: `1px solid ${color}33`,
                  color,
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}66`;
                  e.currentTarget.style.backgroundColor = `${color}22`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${color}33`;
                  e.currentTarget.style.backgroundColor = `${color}15`;
                }}
              >
                <span style={{ fontSize: 18 }}>{t.emoji}</span>
                {t.label}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: MostConnected
// ─────────────────────────────────────────────────────────────────────────────

/** Top 6 events by causality link count. */
function MostConnected({ events }: { events: EventRecord[] }) {
  if (events.length === 0) return null;
  const top6 = events.slice(0, 6);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji="🔗" title="History's Most Influential Events" />
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {top6.map((evt) => (
          <Link
            key={evt.slug}
            to={`/event/${evt.slug}`}
            style={{ textDecoration: 'none', flex: '0 0 auto', minWidth: 200, maxWidth: 280 }}
          >
            <div
              style={{ ...cardBase, height: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3, marginBottom: 8 }}>
                {evt.title}
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 8 }}>
                {fmtYear(evt.year_approx)}
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4,
                backgroundColor: `${ACCENT}22`,
                color: ACCENT_LIGHT,
              }}>
                influences {evt.value} events
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: RandomEraSpotlight
// ─────────────────────────────────────────────────────────────────────────────

/** Pick a random era (seeded by today's date) and show 4 events from it. */
function RandomEraSpotlight() {
  const seed = dailySeed();
  const era = ERAS[seed % ERAS.length];

  const { data } = useQuery({
    queryKey: ['era-spotlight', era.label],
    queryFn: () =>
      fetchTiles({
        year_min: era.yearMin,
        year_max: era.yearMax,
        lat_min: -90,
        lat_max: 90,
        zoom: 1.0,
      }),
    staleTime: 10 * 60 * 1000,
  });

  const events = useMemo(() => {
    if (!data?.events) return [];
    const sorted = [...data.events].sort((a, b) => b.importance_score - a.importance_score);
    return sorted.slice(0, 4);
  }, [data]);

  if (events.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji={era.emoji} title={`Era Spotlight: ${era.label}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {events.map((evt: HistoricalEvent) => (
          <Link key={evt.slug} to={`/event/${evt.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ ...cardBase, height: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[evt.category] ?? '📌'}</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 4,
                  backgroundColor: `${CATEGORY_COLORS[evt.category] ?? TEXT_MUTED}22`,
                  color: CATEGORY_COLORS[evt.category] ?? TEXT_MUTED,
                  textTransform: 'uppercase',
                }}>
                  {evt.category}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3, marginBottom: 6 }}>
                {evt.title}
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                {fmtYear(evt.year_approx)} {evt.geo_modern ? `· ${evt.geo_modern}` : ''}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <Link
          to={`/?year_min=${era.yearMin}&year_max=${era.yearMax}`}
          style={{
            fontSize: 13,
            color: ACCENT_LIGHT,
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          See all {era.label} events →
        </Link>
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: RecentlyAdded
// ─────────────────────────────────────────────────────────────────────────────

/** 6 most recently added events (highest ID values). */
function RecentlyAdded() {
  const { data } = useQuery({
    queryKey: ['recent-events'],
    queryFn: () =>
      fetchTiles({
        year_min: -5000,
        year_max: 2100,
        lat_min: -90,
        lat_max: 90,
        zoom: 1.0,
      }),
    staleTime: 10 * 60 * 1000,
  });

  const events = useMemo(() => {
    if (!data?.events) return [];
    // Sort by ID descending — UUIDs or sequential IDs → newest first
    const sorted = [...data.events].sort((a, b) => b.id.localeCompare(a.id));
    return sorted.slice(0, 6);
  }, [data]);

  if (events.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji="🆕" title="Recently Added" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {events.map((evt: HistoricalEvent) => (
          <Link key={evt.slug} to={`/event/${evt.slug}`} style={{ textDecoration: 'none' }}>
            <div
              style={{ ...cardBase, padding: 16 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, lineHeight: 1.3, marginBottom: 6 }}>
                {evt.title}
              </div>
              <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                {fmtYear(evt.year_approx)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: DiscoverByRegion
// ─────────────────────────────────────────────────────────────────────────────

/** World regions as clickable cards with event counts. */
function DiscoverByRegion({ byRegion }: { byRegion: CountItem[] }) {
  if (byRegion.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji="🗺️" title="Discover by Region" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {REGION_DEFS.map((r) => {
          const count = regionEventCount(byRegion, r.keywords);
          const topLabel = regionTopLabel(byRegion, r.keywords);
          return (
            <Link
              key={r.label}
              to={`/?region=${r.label.toLowerCase()}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{ ...cardBase, textAlign: 'center', padding: '24px 16px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = CARD_BORDER;
                  e.currentTarget.style.background = CARD_BG;
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>{r.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4 }}>
                  {r.label}
                </div>
                {count > 0 && (
                  <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 4 }}>
                    {count} events
                  </div>
                )}
                {topLabel && (
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                    Top: {topLabel}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: FeaturedPeople
// ─────────────────────────────────────────────────────────────────────────────

/** Top historical figures from stats (most connected person, longest lifespan, era). */
function FeaturedPeople({ stats }: { stats: FullStats }) {
  const { people } = stats;

  const cards: { emoji: string; name: string; detail: string }[] = [];
  if (people.most_connected_person) {
    cards.push({
      emoji: '👤',
      name: people.most_connected_person.name,
      detail: `linked to ${people.most_connected_person.value} events`,
    });
  }
  if (people.longest_lifespan_person) {
    cards.push({
      emoji: '🕰️',
      name: people.longest_lifespan_person.name,
      detail: `lived ${people.longest_lifespan_person.value} years`,
    });
  }
  if (people.era_with_most_people) {
    cards.push({
      emoji: '📊',
      name: `${people.era_with_most_people} Era`,
      detail: 'most documented historical figures',
    });
  }

  if (cards.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{ marginTop: 40 }}
    >
      <SectionHeading emoji="👥" title="Featured People" />
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {cards.map((c) => (
          <div key={c.name} style={{ ...cardBase, flex: '1 1 200px', minWidth: 200, cursor: 'default' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4 }}>
              {c.name}
            </div>
            <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: QuickActions
// ─────────────────────────────────────────────────────────────────────────────

interface QuickAction {
  emoji: string;
  label: string;
  to: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { emoji: '🎲', label: 'Surprise Me', to: '/' },
  { emoji: '📊', label: 'Stats', to: '/stats' },
  { emoji: '🗺️', label: 'World Map', to: '/' },
  { emoji: '📅', label: 'This Decade', to: '/?year_min=2000&year_max=2030' },
  { emoji: '🏛️', label: 'Timeline', to: '/' },
];

/** Row of quick-action shortcut buttons. */
function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      style={{ marginTop: 48, marginBottom: 60 }}
    >
      <SectionHeading emoji="⚡" title="Quick Actions" />
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.label} to={a.to} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid ${CARD_BORDER}`,
                color: TEXT_PRIMARY,
                fontSize: 14,
                fontWeight: 600,
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = CARD_BORDER;
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
              }}
            >
              <span style={{ fontSize: 20 }}>{a.emoji}</span>
              {a.label}
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared components
// ─────────────────────────────────────────────────────────────────────────────

/** Consistent section heading with emoji prefix. */
function SectionHeading({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h2 style={{
      fontSize: 18,
      fontWeight: 700,
      color: '#e2e8f0',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      letterSpacing: '-0.01em',
    }}>
      <span style={{ fontSize: 22 }}>{emoji}</span>
      {title}
    </h2>
  );
}

/** Spinning loader. */
function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 100, color: TEXT_SECONDARY }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.08)',
          borderTopColor: ACCENT,
        }}
      />
      <span style={{ fontSize: 14 }}>Loading explore page...</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ExplorePage — magazine-style curated discovery page for Chronicle.
 *
 * Renders at /explore. All data sourced from existing endpoints:
 * - GET /api/stats/full
 * - GET /api/events/on-this-day
 * - GET /api/canvas/tiles
 */
export default function ExplorePage() {
  // Allow page to scroll (root is overflow:hidden for canvas view)
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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats-full'],
    queryFn: fetchFullStats,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${PAGE_BG} 0%, #0f172a 100%)`,
      color: TEXT_PRIMARY,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
      padding: '0 0 40px',
    }}>
      {/* Sticky nav bar */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7, 14, 34, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <Link to="/" style={{ color: ACCENT_LIGHT, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          ← Chronicle
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, margin: 0 }}>
          Explore
        </h1>
        <div style={{ flex: 1 }} />
        <Link to="/stats" style={{
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 500,
          color: '#cbd5e1',
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 6,
          textDecoration: 'none',
        }}>
          Stats
        </Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {statsLoading && <Spinner />}

        {stats && (
          <>
            {/* a) Hero Feature */}
            <HeroFeature stats={stats} />

            {/* b) On This Day */}
            <OnThisDaySection />

            {/* c) Featured Themes */}
            <FeaturedThemes />

            {/* d) Most Connected */}
            <MostConnected events={stats.graph.top_connected_events} />

            {/* e) Random Era Spotlight */}
            <RandomEraSpotlight />

            {/* f) Recently Added */}
            <RecentlyAdded />

            {/* g) Discover by Region */}
            <DiscoverByRegion byRegion={stats.coverage.by_region} />

            {/* h) Featured People */}
            <FeaturedPeople stats={stats} />

            {/* i) Quick Actions */}
            <QuickActions />
          </>
        )}

        {!statsLoading && !stats && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔭</div>
            <div style={{ fontSize: 18, color: TEXT_SECONDARY, marginBottom: 8 }}>
              Backend unavailable
            </div>
            <p style={{ color: TEXT_MUTED, fontSize: 13 }}>
              The Explore page needs live data. Make sure the backend is running.
            </p>
            <Link
              to="/"
              style={{
                display: 'inline-block',
                marginTop: 16,
                padding: '10px 20px',
                borderRadius: 8,
                backgroundColor: `${ACCENT}22`,
                color: ACCENT_LIGHT,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              ← Back to Timeline
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
