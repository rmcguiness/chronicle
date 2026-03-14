/**
 * RegionPage — dedicated history page for a single world region.
 *
 * Route: /region/:region
 *
 * Sections:
 *  1. RegionHero — name, emoji, stats, description
 *  2. TopEventsTimeline — vertical timeline of top 10 events
 *  3. KeyFigures — up to 8 people cards
 *  4. EraBreakdown — bar chart of events per era
 *  5. CategoryBreakdown — donut chart of events by category
 *  6. RegionalInfluence — causality links to/from other regions
 *  7. DecadeSparkline — mini bar chart of event density per decade
 *  8. RegionNavigation — cards linking to other regions
 */
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

import { fetchRegionDetail } from '../api/client';
import type {
  RegionSlug, RegionDetail, RegionEvent, RegionPerson,
  NeighborRegion, EraCount, CategoryCount, DecadeCount,
} from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

// ── Region metadata ─────────────────────────────────────────────────────────

interface RegionMeta {
  emoji: string;
  color: string;
  bgGradient: string;
  description: string;
}

const REGION_META: Record<string, RegionMeta> = {
  Europe: {
    emoji: '\u{1F30D}',
    color: '#3b82f6',
    bgGradient: 'from-blue-900 to-blue-700',
    description: "From ancient Greece to the modern EU, Europe's history shaped western civilization through empires, revolutions, and scientific breakthroughs.",
  },
  Asia: {
    emoji: '\u{1F30F}',
    color: '#ef4444',
    bgGradient: 'from-red-900 to-red-700',
    description: "Home to the world's oldest continuous civilizations, Asia's dynasties, philosophies, and trade routes influenced the entire globe.",
  },
  Americas: {
    emoji: '\u{1F30E}',
    color: '#22c55e',
    bgGradient: 'from-green-900 to-green-700',
    description: 'From the ancient Olmec and Maya to the modern superpowers, the Americas tell a story of indigenous innovation and colonial transformation.',
  },
  Africa: {
    emoji: '\u{1F30D}',
    color: '#f59e0b',
    bgGradient: 'from-amber-900 to-amber-700',
    description: "The cradle of humanity and home to powerful empires like Mali and Songhai, Africa's rich history predates all other civilizations.",
  },
  'Middle East': {
    emoji: '\u{1F54C}',
    color: '#a855f7',
    bgGradient: 'from-purple-900 to-purple-700',
    description: 'Birthplace of agriculture, writing, and three world religions, the Middle East has been the crossroads of human civilization for 10,000 years.',
  },
  Oceania: {
    emoji: '\u{1F3DD}\u{FE0F}',
    color: '#14b8a6',
    bgGradient: 'from-teal-900 to-teal-700',
    description: "The last major region settled by humans, Oceania's peoples developed unique cultures across 25,000+ Pacific islands over 3,000 years.",
  },
};

const ALL_REGIONS: { slug: RegionSlug; name: string }[] = [
  { slug: 'europe', name: 'Europe' },
  { slug: 'asia', name: 'Asia' },
  { slug: 'americas', name: 'Americas' },
  { slug: 'africa', name: 'Africa' },
  { slug: 'middle-east', name: 'Middle East' },
  { slug: 'oceania', name: 'Oceania' },
];

const PIE_COLORS = ['#ef4444', '#3b82f6', '#a855f7', '#f97316', '#22c55e', '#eab308', '#14b8a6', '#ec4899'];

/** Format year for display, handling negative (BCE) years. */
function fmtYear(y: number | null | undefined): string {
  if (y == null) return '?';
  if (y < 0) return `${Math.abs(y)} BCE`;
  return String(y);
}

// ── Sub-components ──────────────────────────────────────────────────────────

/** Hero banner for the region. */
function RegionHero({ data }: { data: RegionDetail }) {
  const meta = REGION_META[data.region] ?? REGION_META.Europe;
  const centuries = data.stats.min_year != null && data.stats.max_year != null
    ? Math.max(1, Math.round((data.stats.max_year - data.stats.min_year) / 100))
    : null;

  return (
    <div className={`bg-gradient-to-r ${meta.bgGradient} text-white px-8 py-12 rounded-2xl mb-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-2">
          {meta.emoji} {data.region}
        </h1>
        {data.stats.min_year != null && data.stats.max_year != null && (
          <p className="text-lg opacity-80 mb-4">
            From {fmtYear(data.stats.min_year)} to {fmtYear(data.stats.max_year)}
          </p>
        )}
        <div className="flex gap-6 text-sm opacity-90 mb-6">
          <span className="bg-white/20 px-3 py-1 rounded-full">{data.stats.total_events} events</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">{data.stats.total_people} people</span>
          {centuries && (
            <span className="bg-white/20 px-3 py-1 rounded-full">{centuries} centuries of history</span>
          )}
        </div>
        <p className="text-lg leading-relaxed max-w-3xl">{meta.description}</p>
      </div>
    </div>
  );
}

/** Vertical timeline of top 10 events. */
function TopEventsTimeline({ events, color }: { events: RegionEvent[]; color: string }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-6">Top Events</h2>
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-700" />
        {events.map((evt, i) => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative mb-6"
          >
            {/* Dot */}
            <div
              className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 border-gray-900"
              style={{ backgroundColor: color }}
            />
            <Link
              to={`/event/${evt.slug}`}
              className="block bg-gray-800 hover:bg-gray-750 rounded-lg p-4 transition-colors border border-gray-700 hover:border-gray-600"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-white font-semibold">{evt.title}</h3>
                <span className="text-gray-400 text-sm ml-4 whitespace-nowrap">{fmtYear(evt.year_approx)}</span>
              </div>
              <div className="flex gap-2 mt-1">
                {evt.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                    {(CATEGORY_LABELS as Record<string, string>)[evt.category] ?? evt.category}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  Importance: {Math.round(evt.importance_score * 100)}%
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/** Key figures row. */
function KeyFigures({ people }: { people: RegionPerson[] }) {
  if (people.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-6">Key Figures</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {people.map((p) => (
          <Link
            key={p.id}
            to={p.slug ? `/people/${p.slug}` : '#'}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-colors"
          >
            <h3 className="text-white font-semibold text-sm">{p.name}</h3>
            <p className="text-gray-400 text-xs mt-1">
              {p.birth_year != null ? fmtYear(p.birth_year) : '?'}
              {' \u2013 '}
              {p.death_year != null ? fmtYear(p.death_year) : '?'}
            </p>
            {p.roles && p.roles.length > 0 && (
              <p className="text-gray-500 text-xs mt-1 truncate">
                {p.roles.join(', ')}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Bar chart: events per era. */
function EraBreakdown({ data, color }: { data: EraCount[]; color: string }) {
  if (data.length === 0) return null;
  const best = data.reduce((a, b) => (b.count > a.count ? b : a), data[0]);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-2">Events by Era</h2>
      <p className="text-gray-400 text-sm mb-4">
        Most documented era: <span className="text-white font-medium">{best.era}</span> with {best.count} events
      </p>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="era" tick={{ fill: '#9ca3af', fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
            />
            <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Donut chart: events by category. */
function CategoryBreakdown({ data }: { data: CategoryCount[] }) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    name: (CATEGORY_LABELS as Record<string, string>)[d.category] ?? d.category,
    value: d.count,
    color: (CATEGORY_COLORS as Record<string, string>)[d.category] ?? '#6b7280',
  }));

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">Events by Category</h2>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center gap-8" style={{ height: 280 }}>
        <div style={{ width: 220, height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-gray-300">{d.name}</span>
              <span className="text-gray-500">({d.value})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Regional influence — causality links to/from other regions. */
function RegionalInfluence({ influencedBy, influenced }: { influencedBy: NeighborRegion[]; influenced: NeighborRegion[] }) {
  if (influencedBy.length === 0 && influenced.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">Regional Influence</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {influencedBy.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-3">Most influenced by</h3>
            {influencedBy.map((r) => {
              const meta = REGION_META[r.region];
              return (
                <Link
                  key={r.slug}
                  to={`/region/${r.slug}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-750 rounded px-2 transition-colors"
                >
                  <span className="text-white">
                    {meta?.emoji} {r.region}
                  </span>
                  <span className="text-gray-400 text-sm">{r.count} causal links \u2192</span>
                </Link>
              );
            })}
          </div>
        )}
        {influenced.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-5 border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium mb-3">Most influenced</h3>
            {influenced.map((r) => {
              const meta = REGION_META[r.region];
              return (
                <Link
                  key={r.slug}
                  to={`/region/${r.slug}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-750 rounded px-2 transition-colors"
                >
                  <span className="text-white">
                    {meta?.emoji} {r.region}
                  </span>
                  <span className="text-gray-400 text-sm">\u2190 {r.count} causal links</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

/** Mini bar chart: event density per decade. */
function DecadeSparkline({ data, color }: { data: DecadeCount[]; color: string }) {
  if (data.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">Event Density by Decade</h2>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="decade"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(v: number) => (v < 0 ? `${Math.abs(v)} BCE` : String(v))}
            />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
              labelFormatter={(v: number) => `${v < 0 ? `${Math.abs(v)} BCE` : v}s`}
            />
            <Bar dataKey="count" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Navigation grid to other regions. */
function RegionNavigation({ currentSlug }: { currentSlug: string }) {
  const others = ALL_REGIONS.filter((r) => r.slug !== currentSlug);
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4">Explore Other Regions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {others.map((r) => {
          const meta = REGION_META[r.name] ?? REGION_META.Europe;
          return (
            <Link
              key={r.slug}
              to={`/region/${r.slug}`}
              className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-500 transition-colors text-center"
            >
              <span className="text-3xl">{meta.emoji}</span>
              <p className="text-white font-semibold mt-2">{r.name}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Main page component ─────────────────────────────────────────────────────

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const slug = region ?? '';

  const { data, isLoading, error } = useQuery<RegionDetail>({
    queryKey: ['region', slug],
    queryFn: () => fetchRegionDetail(slug),
    enabled: slug.length > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading region...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-lg">Region not found</p>
        <Link to="/regions" className="text-blue-400 hover:underline">Browse all regions</Link>
      </div>
    );
  }

  const meta = REGION_META[data.region] ?? REGION_META.Europe;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Nav bar */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-lg">Chronicle</Link>
          <Link to="/regions" className="text-gray-400 hover:text-white transition-colors text-sm">Regions</Link>
          <span className="text-gray-600 text-sm">/</span>
          <span className="text-white text-sm">{data.region}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <RegionHero data={data} />
        <TopEventsTimeline events={data.top_events} color={meta.color} />
        <KeyFigures people={data.key_figures} />

        <div className="grid md:grid-cols-2 gap-8">
          <EraBreakdown data={data.by_era} color={meta.color} />
          <CategoryBreakdown data={data.by_category} />
        </div>

        <RegionalInfluence influencedBy={data.influenced_by} influenced={data.influenced} />
        <DecadeSparkline data={data.by_decade} color={meta.color} />
        <RegionNavigation currentSlug={slug} />
      </main>
    </div>
  );
}
