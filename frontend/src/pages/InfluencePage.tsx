/**
 * InfluencePage — visualizes the most influential events and people in history.
 *
 * Route: /influence
 *
 * Sections:
 *  1. TopInfluencerCards — hero cards for top 3 events
 *  2. InfluenceLeaderboard — ranked list with Events/People tabs
 *  3. InfluenceTimeline — scatter plot of influence across time
 *  4. InfluenceByEra — bar chart of average influence per era
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip as ReTooltip,
  BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer,
} from 'recharts';

import { fetchInfluence } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';
import type { InfluentialEvent, InfluentialPerson, EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Era classification
// ─────────────────────────────────────────────────────────────────────────────

interface Era {
  label: string;
  min: number;
  max: number;
  color: string;
}

const ERAS: Era[] = [
  { label: 'Ancient',       min: -5000, max: -500,  color: '#a78bfa' },
  { label: 'Classical',     min: -500,  max: 500,   color: '#60a5fa' },
  { label: 'Medieval',      min: 500,   max: 1400,  color: '#34d399' },
  { label: 'Early Modern',  min: 1400,  max: 1750,  color: '#fbbf24' },
  { label: 'Modern',        min: 1750,  max: 1945,  color: '#f97316' },
  { label: 'Contemporary',  min: 1945,  max: 2100,  color: '#ef4444' },
];

/** Classify a year into an era label. */
function eraFor(year: number | null): string {
  if (year == null) return 'Unknown';
  for (const era of ERAS) {
    if (year >= era.min && year < era.max) return era.label;
  }
  return 'Unknown';
}

/** Format a year for display (handles negative = BCE). */
function fmtYear(y: number | null): string {
  if (y == null) return '?';
  return y < 0 ? `${Math.abs(y)} BCE` : String(y);
}

// ─────────────────────────────────────────────────────────────────────────────
// TopInfluencerCards — hero cards for top 3
// ─────────────────────────────────────────────────────────────────────────────

function TopInfluencerCards({ events }: { events: InfluentialEvent[] }) {
  const top3 = events.slice(0, 3);
  const medals = ['#fbbf24', '#94a3b8', '#cd7f32']; // gold, silver, bronze

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {top3.map((ev, i) => {
        const catKey = (ev.category ?? 'political') as EventCategory;
        const catColor = CATEGORY_COLORS[catKey] ?? '#6b7280';
        return (
          <Link
            key={ev.event_slug}
            to={`/?event=${ev.event_slug}`}
            className="block no-underline"
          >
            <div
              className="rounded-xl p-5 border transition-colors hover:border-white/20"
              style={{
                backgroundColor: `${catColor}10`,
                borderColor: `${catColor}33`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ backgroundColor: medals[i] + '33', color: medals[i] }}
                >
                  #{i + 1}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ backgroundColor: `${catColor}22`, color: catColor }}
                >
                  {CATEGORY_LABELS[catKey] ?? ev.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 leading-tight mb-2">
                {ev.title}
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                {fmtYear(ev.year_approx)} &middot; {ev.region ?? 'Global'}
              </p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>
                  <span className="text-slate-300 font-semibold">{ev.ripple_count}</span> downstream events
                </span>
                <span>
                  <span className="text-slate-300 font-semibold">{ev.direct_count}</span> direct
                </span>
                <span>
                  Score: <span className="text-slate-300 font-semibold">{ev.influence_score.toFixed(1)}</span>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfluenceLeaderboard — tabbed list
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'events' | 'people';

function InfluenceLeaderboard({
  events,
  people,
}: {
  events: InfluentialEvent[];
  people: InfluentialPerson[];
}) {
  const [tab, setTab] = useState<Tab>('events');

  return (
    <div className="mb-8">
      {/* Tab bar */}
      <div className="flex gap-1 mb-4 bg-white/5 rounded-lg p-1 w-fit">
        {(['events', 'people'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === t
                ? 'bg-blue-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === 'events' ? 'Events' : 'People'}
          </button>
        ))}
      </div>

      {tab === 'events' ? (
        <div className="space-y-1">
          {events.map((ev, i) => {
            const catKey = (ev.category ?? 'political') as EventCategory;
            const catColor = CATEGORY_COLORS[catKey] ?? '#6b7280';
            return (
              <Link
                key={ev.event_slug}
                to={`/?event=${ev.event_slug}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors no-underline group"
              >
                <span className="text-slate-500 font-mono text-sm w-8 text-right shrink-0">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100 font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">
                      {ev.title}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: `${catColor}22`, color: catColor }}
                    >
                      {CATEGORY_LABELS[catKey] ?? ev.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {fmtYear(ev.year_approx)} &middot; influences {ev.ripple_count} events across history
                    &middot; {ev.direct_count} direct
                  </div>
                </div>
                <span className="text-sm font-mono text-slate-400 shrink-0">
                  {ev.influence_score.toFixed(1)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1">
          {people.map((p, i) => (
            <div
              key={p.person_id}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-slate-500 font-mono text-sm w-8 text-right shrink-0">
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-100 font-semibold text-sm">
                  {p.name}
                </span>
                <div className="text-xs text-slate-500 mt-0.5">
                  {p.birth_year != null && p.death_year != null
                    ? `${fmtYear(p.birth_year)} – ${fmtYear(p.death_year)}`
                    : p.birth_year != null
                    ? `b. ${fmtYear(p.birth_year)}`
                    : ''}
                  {p.top_event_title && (
                    <>
                      {' '}&middot;{' '}
                      <Link
                        to={`/?event=${p.top_event_slug}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {p.top_event_title}
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <span className="text-sm font-mono text-slate-400 shrink-0">
                {p.total_ripple} ripple
              </span>
            </div>
          ))}
          {people.length === 0 && (
            <div className="text-slate-500 text-sm italic px-4 py-6">
              No people data available yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfluenceTimeline — scatter plot
// ─────────────────────────────────────────────────────────────────────────────

interface ScatterPoint {
  x: number;
  y: number;
  z: number;
  title: string;
  category: string | null;
  slug: string;
}

function InfluenceTimeline({ events }: { events: InfluentialEvent[] }) {
  const points: ScatterPoint[] = events
    .filter((ev) => ev.year_approx != null)
    .map((ev) => ({
      x: ev.year_approx!,
      y: ev.ripple_count,
      z: ev.influence_score,
      title: ev.title,
      category: ev.category,
      slug: ev.event_slug,
    }));

  // Group by category for coloring
  const categories = [...new Set(points.map((p) => p.category ?? 'political'))];

  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
        Influence Across Time
      </h2>
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              dataKey="x"
              name="Year"
              domain={['dataMin', 'dataMax']}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Ripple Count"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 400]} />
            <ReTooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload as ScatterPoint;
                return (
                  <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-lg">
                    <div className="text-slate-100 font-semibold">{d.title}</div>
                    <div className="text-slate-400 mt-1">
                      Year: {fmtYear(d.x)} &middot; Ripple: {d.y} &middot; Score: {d.z.toFixed(1)}
                    </div>
                  </div>
                );
              }}
            />
            {categories.map((cat) => {
              const catColor = CATEGORY_COLORS[cat as EventCategory] ?? '#6b7280';
              const data = points.filter((p) => (p.category ?? 'political') === cat);
              return (
                <Scatter
                  key={cat}
                  name={CATEGORY_LABELS[cat as EventCategory] ?? cat}
                  data={data}
                  fill={catColor}
                  fillOpacity={0.7}
                />
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InfluenceByEra — horizontal bar chart
// ─────────────────────────────────────────────────────────────────────────────

function InfluenceByEra({ events }: { events: InfluentialEvent[] }) {
  const eraMap = new Map<string, { sum: number; count: number; color: string }>();

  for (const era of ERAS) {
    eraMap.set(era.label, { sum: 0, count: 0, color: era.color });
  }

  for (const ev of events) {
    const label = eraFor(ev.year_approx);
    const entry = eraMap.get(label);
    if (entry) {
      entry.sum += ev.influence_score;
      entry.count += 1;
    }
  }

  const barData = ERAS.map((era) => {
    const entry = eraMap.get(era.label)!;
    return {
      era: era.label,
      avg: entry.count > 0 ? +(entry.sum / entry.count).toFixed(2) : 0,
      color: era.color,
    };
  });

  return (
    <div className="mb-8">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
        Average Influence by Era
      </h2>
      <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              type="category"
              dataKey="era"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              width={80}
            />
            <ReTooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="avg" name="Avg. Influence" radius={[0, 4, 4, 0]}>
              {barData.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/** InfluencePage — top-level page component for `/influence`. */
export default function InfluencePage() {
  // Allow scrolling on this page (Chronicle root sets overflow:hidden)
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['influence'],
    queryFn: fetchInfluence,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div
      className="w-screen min-h-screen text-slate-100"
      style={{
        backgroundColor: '#070e22',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Nav */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors no-underline
                       px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03]"
          >
            &larr; Timeline
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Historical Influence
          </h1>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mr-3" />
            Computing influence scores...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 p-4 text-sm">
            Failed to load influence data. Make sure the backend is running.
          </div>
        )}

        {/* Content */}
        {data && (
          <>
            <TopInfluencerCards events={data.events} />
            <InfluenceTimeline events={data.events} />
            <InfluenceByEra events={data.events} />
            <InfluenceLeaderboard events={data.events} people={data.people} />
          </>
        )}
      </div>
    </div>
  );
}
