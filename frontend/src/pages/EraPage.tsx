/**
 * EraPage — dedicated landing page for a historical era at /era/:era.
 *
 * Sections:
 *  a) EraHero — name, year range, description, stats row
 *  b) KeyEventsTimeline — top 10 events as a vertical timeline
 *  c) KeyFigures — up to 8 historical figures grid
 *  d) RegionBar — horizontal bar chart of events per region
 *  e) CategoryDonut — donut chart of events by category
 *  f) DecadeSparkline — mini bar chart of event density per decade
 *  g) EraNavigation — previous/next era cards
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

import { fetchEra } from '../api/client';
import type { EraSlug, EraDetailResponse, EraTopEvent, EraKeyFigure } from '../types/era';
import { ERA_COLORS } from '../types/era';
import { CATEGORY_COLORS } from '../utils/categories';

// ─── Design tokens ──────────────────────────────────────────────────────────

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Format year with BCE/CE suffix. */
function fmtYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Render importance as star string. */
function stars(score: number): string {
  const n = Math.round(score * 5);
  return '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
}

const VALID_ERAS: EraSlug[] = ['ancient', 'classical', 'medieval', 'early-modern', 'modern', 'contemporary'];

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Hero section with era name, year range, description, and stats. */
function EraHero({ data }: { data: EraDetailResponse }) {
  const colors = ERA_COLORS[data.meta.slug];
  return (
    <section style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 48, fontWeight: 700, color: colors.accent, margin: 0 }}
      >
        {data.meta.name}
      </motion.h1>
      <p style={{ fontSize: 18, color: TEXT_SECONDARY, margin: '8px 0 0' }}>
        {fmtYear(data.meta.year_min)} &ndash; {fmtYear(data.meta.year_max)}
      </p>
      <p style={{ fontSize: 15, color: TEXT_MUTED, maxWidth: 700, margin: '16px auto 0', lineHeight: 1.7 }}>
        {data.meta.description}
      </p>
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Events', value: data.stats.total_events },
          { label: 'People', value: data.stats.total_people },
          { label: 'Connections', value: data.stats.total_links },
          { label: 'Avg Importance', value: data.stats.avg_importance.toFixed(2) },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: TEXT_PRIMARY }}>{s.value}</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Vertical timeline of top 10 events. */
function KeyEventsTimeline({ events, accent }: { events: EraTopEvent[]; accent: string }) {
  const navigate = useNavigate();
  return (
    <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 24 }}>
        Key Events
      </h2>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 7, top: 4, bottom: 4, width: 2,
          background: `linear-gradient(to bottom, ${accent}, transparent)`,
        }} />
        {events.map((ev, i) => (
          <motion.div
            key={ev.slug}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(`/?event=${ev.slug}`)}
            style={{
              position: 'relative', marginBottom: 20, cursor: 'pointer',
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
              borderRadius: 10, padding: '14px 16px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER; }}
          >
            {/* Dot on timeline */}
            <div style={{
              position: 'absolute', left: -24, top: 18, width: 10, height: 10,
              borderRadius: '50%', background: accent, border: `2px solid ${PAGE_BG}`,
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>
                {fmtYear(ev.year_approx)}
              </span>
              {ev.category && (
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 4,
                  background: CATEGORY_COLORS[ev.category as keyof typeof CATEGORY_COLORS] ?? '#6366f1',
                  color: '#fff', fontWeight: 500, textTransform: 'uppercase',
                }}>
                  {ev.category}
                </span>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY, marginTop: 4 }}>
              {ev.title}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
              {stars(ev.importance_score)} &middot; {ev.geo_modern ?? 'Unknown location'}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/** Grid of key historical figures. */
function KeyFigures({ figures, accent }: { figures: EraKeyFigure[]; accent: string }) {
  if (figures.length === 0) return null;
  return (
    <section style={{ maxWidth: 900, margin: '40px auto 0', padding: '0 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>
        Key Figures
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {figures.map((f) => (
          <div
            key={f.name}
            style={{
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
              borderRadius: 10, padding: 16, transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = accent; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER; }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRIMARY }}>{f.name}</div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>
              {f.birth_year != null && f.death_year != null
                ? `${fmtYear(f.birth_year)} – ${fmtYear(f.death_year)}`
                : f.birth_year != null
                  ? `b. ${fmtYear(f.birth_year)}`
                  : ''}
            </div>
            {f.roles.length > 0 && (
              <div style={{ fontSize: 11, color: accent, marginTop: 6 }}>
                {f.roles.slice(0, 3).join(', ')}
              </div>
            )}
            <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>
              {f.event_count} event{f.event_count !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Horizontal bar chart: events per region. */
function RegionBar({ regions, accent }: { regions: { region: string; count: number }[]; accent: string }) {
  if (regions.length === 0) return null;
  const top = regions.slice(0, 15);
  return (
    <section style={{ maxWidth: 700, margin: '40px auto 0', padding: '0 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>
        Events by Region
      </h2>
      <ResponsiveContainer width="100%" height={top.length * 32 + 20}>
        <BarChart data={top} layout="vertical" margin={{ left: 120, right: 20, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: TEXT_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category" dataKey="region" width={110}
            tick={{ fill: TEXT_SECONDARY, fontSize: 11 }} axisLine={false} tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: TEXT_PRIMARY }}
            itemStyle={{ color: accent }}
          />
          <Bar dataKey="count" fill={accent} radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

/** Donut chart: events by category. */
function CategoryDonut({ categories, accent }: { categories: { category: string; count: number }[]; accent: string }) {
  if (categories.length === 0) return null;
  const COLORS_LIST = ['#ef4444', '#3b82f6', '#a855f7', '#f59e0b', '#22c55e', '#14b8a6', '#ec4899', '#6366f1'];
  return (
    <section style={{ maxWidth: 500, margin: '40px auto 0', padding: '0 20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>
        Events by Category
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={categories}
            dataKey="count"
            nameKey="category"
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={100}
            paddingAngle={2}
            label={({ category, count }) => `${category} (${count})`}
          >
            {categories.map((_entry, i) => (
              <Cell
                key={i}
                fill={CATEGORY_COLORS[_entry.category as keyof typeof CATEGORY_COLORS] ?? COLORS_LIST[i % COLORS_LIST.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            itemStyle={{ color: accent }}
          />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
}

/** Mini bar chart: event density per decade. */
function DecadeSparkline({ decades, accent }: { decades: { decade: number; count: number }[]; accent: string }) {
  if (decades.length === 0) return null;
  return (
    <section style={{ maxWidth: 700, margin: '40px auto 0', padding: '0 20px' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, color: TEXT_PRIMARY, marginBottom: 20 }}>
        Event Density by Decade
      </h2>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={decades} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          <XAxis
            dataKey="decade" tick={{ fill: TEXT_MUTED, fontSize: 10 }}
            axisLine={false} tickLine={false}
            tickFormatter={(v: number) => (v < 0 ? `${Math.abs(v)} BCE` : String(v))}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: TEXT_PRIMARY }}
            labelFormatter={(v: number) => `${v < 0 ? `${Math.abs(v)}s BCE` : `${v}s`}`}
            itemStyle={{ color: accent }}
          />
          <Bar dataKey="count" fill={accent} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}

/** Bottom navigation: previous and next era. */
function EraNavigation({ data }: { data: EraDetailResponse }) {
  return (
    <section style={{
      maxWidth: 700, margin: '48px auto 0', padding: '0 20px 60px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
    }}>
      {data.prev_era ? (
        <Link to={`/era/${data.prev_era.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 10, padding: 16, transition: 'border-color 0.15s',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ERA_COLORS[data.prev_era!.slug].accent; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER; }}
          >
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>&larr; Previous Era</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, marginTop: 4 }}>
              {data.prev_era.name}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
              {fmtYear(data.prev_era.year_min)} – {fmtYear(data.prev_era.year_max)} &middot; {data.prev_era.event_count} events
            </div>
          </div>
        </Link>
      ) : <div />}
      {data.next_era ? (
        <Link to={`/era/${data.next_era.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 10, padding: 16, textAlign: 'right', transition: 'border-color 0.15s',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ERA_COLORS[data.next_era!.slug].accent; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = CARD_BORDER; }}
          >
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>Next Era &rarr;</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_PRIMARY, marginTop: 4 }}>
              {data.next_era.name}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
              {fmtYear(data.next_era.year_min)} – {fmtYear(data.next_era.year_max)} &middot; {data.next_era.event_count} events
            </div>
          </div>
        </Link>
      ) : <div />}
    </section>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function EraPage() {
  const { era } = useParams<{ era: string }>();
  const eraSlug = era as EraSlug;

  const { data, isLoading, error } = useQuery({
    queryKey: ['era', eraSlug],
    queryFn: () => fetchEra(eraSlug),
    enabled: VALID_ERAS.includes(eraSlug),
  });

  if (!VALID_ERAS.includes(eraSlug)) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh', color: TEXT_PRIMARY, padding: 40, textAlign: 'center' }}>
        <h1>Unknown Era</h1>
        <p style={{ color: TEXT_MUTED }}>"{era}" is not a valid era slug.</p>
        <Link to="/eras" style={{ color: '#6366f1' }}>View all eras</Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: TEXT_MUTED, fontSize: 16 }}>Loading era data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ background: PAGE_BG, minHeight: '100vh', color: TEXT_PRIMARY, padding: 40, textAlign: 'center' }}>
        <h1>Error</h1>
        <p style={{ color: TEXT_MUTED }}>Failed to load era data.</p>
        <Link to="/eras" style={{ color: '#6366f1' }}>Back to eras</Link>
      </div>
    );
  }

  const colors = ERA_COLORS[data.meta.slug];

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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link to="/" style={{ color: TEXT_SECONDARY, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
            Chronicle
          </Link>
          <span style={{ color: TEXT_MUTED }}>/</span>
          <Link to="/eras" style={{ color: TEXT_SECONDARY, textDecoration: 'none', fontSize: 13 }}>
            Eras
          </Link>
          <span style={{ color: TEXT_MUTED }}>/</span>
          <span style={{ color: colors.accent, fontSize: 13, fontWeight: 500 }}>
            {data.meta.name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link to="/" style={{ ...navLinkStyle }}>Graph</Link>
          <Link to="/explore" style={{ ...navLinkStyle }}>Explore</Link>
          <Link to="/eras" style={{ ...navLinkStyle }}>Eras</Link>
        </div>
      </nav>

      <EraHero data={data} />
      <KeyEventsTimeline events={data.top_events} accent={colors.accent} />
      <KeyFigures figures={data.key_figures} accent={colors.accent} />

      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <RegionBar regions={data.regions} accent={colors.accent} />
        <CategoryDonut categories={data.categories} accent={colors.accent} />
      </div>

      <DecadeSparkline decades={data.decades} accent={colors.accent} />
      <EraNavigation data={data} />
    </div>
  );
}

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
