/**
 * StatsPage — Chronicle knowledge graph analytics at /stats.
 *
 * Sections:
 *  1. RecordsSection — hero superlative cards
 *  2. CoverageCharts — era/region/category breakdowns (recharts)
 *  3. GraphMetrics — network density, top connected events table
 *  4. TimelineCoverage — decade heatmap, coverage gap
 *  5. FunFacts — surprising data-driven facts
 */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { fetchFullStats } from '../api/client';
import type { FullStats, CountItem, EventRecord } from '../types/stats';

// ── Color palette ────────────────────────────────────────────────────────────

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c084fc',
  '#e879f9', '#f472b6', '#fb7185', '#f97316',
  '#facc15', '#4ade80', '#2dd4bf', '#22d3ee',
  '#38bdf8', '#60a5fa', '#818cf8', '#a5b4fc',
];

const CATEGORY_COLORS: Record<string, string> = {
  war: '#ef4444',
  political: '#6366f1',
  discovery: '#22d3ee',
  cultural: '#f59e0b',
  natural: '#10b981',
  person: '#a78bfa',
  Unknown: '#64748b',
};

// ── Shared styles ────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #070e22 0%, #0f172a 100%)',
  color: '#f1f5f9',
  fontFamily: "'Inter', system-ui, sans-serif",
  overflowY: 'auto',
  padding: '0 0 80px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px',
};

const sectionStyle: React.CSSProperties = {
  marginTop: 48,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 20,
  color: '#e2e8f0',
  letterSpacing: '-0.02em',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  padding: 20,
};

const heroCardStyle: React.CSSProperties = {
  ...cardStyle,
  textAlign: 'center' as const,
  flex: 1,
  minWidth: 200,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#94a3b8',
  marginTop: 4,
};

const bigNumber: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: '#a78bfa',
  lineHeight: 1.1,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Format year with BCE suffix. */
function formatYear(year: number | null | undefined): string {
  if (year == null) return '???';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

/** Density label. */
function densityLabel(pct: number): { label: string; color: string } {
  if (pct < 1) return { label: 'Sparse', color: '#94a3b8' };
  if (pct < 5) return { label: 'Connected', color: '#22d3ee' };
  return { label: 'Dense', color: '#4ade80' };
}

// ── Sub-components ───────────────────────────────────────────────────────────

/** Hero superlative cards. */
function RecordsSection({ stats }: { stats: FullStats }) {
  const { graph, curiosity, people } = stats;
  const cards = [
    {
      emoji: '🌐',
      label: 'Most Connected',
      value: graph.most_connected_event?.title ?? '—',
      sub: graph.most_connected_event
        ? `${graph.most_connected_event.value} connections`
        : '',
    },
    {
      emoji: '🔗',
      label: 'Longest Causal Chain',
      value: `${graph.longest_chain} events deep`,
      sub: 'recursive cause → effect',
    },
    {
      emoji: '⭐',
      label: 'Highest Importance',
      value: curiosity.highest_importance_event?.title ?? '—',
      sub: curiosity.highest_importance_event
        ? `score ${curiosity.highest_importance_event.value.toFixed(2)}`
        : '',
    },
    {
      emoji: '📅',
      label: 'Oldest Event',
      value: curiosity.earliest_event_title ?? '—',
      sub: curiosity.earliest_year != null ? formatYear(curiosity.earliest_year) : '',
    },
    {
      emoji: '👤',
      label: 'Most Connected Person',
      value: people.most_connected_person?.name ?? '—',
      sub: people.most_connected_person
        ? `linked to ${people.most_connected_person.value} events`
        : '',
    },
  ];

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitle}>Chronicle Records</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {cards.map((c) => (
          <div key={c.label} style={heroCardStyle}>
            <div style={{ fontSize: 28 }}>{c.emoji}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {c.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: '#e2e8f0', lineHeight: 1.3 }}>
              {c.value}
            </div>
            {c.sub && <div style={subtitleStyle}>{c.sub}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Coverage charts row. */
function CoverageCharts({ stats }: { stats: FullStats }) {
  const { coverage } = stats;

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitle}>Coverage</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Events by Era */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>Events by Era</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={coverage.by_era} layout="vertical" margin={{ left: 90, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis dataKey="label" type="category" tick={{ fill: '#cbd5e1', fontSize: 11 }} width={85} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Events by Region — donut */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>Events by Region (top 10)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={coverage.by_region.slice(0, 10)}
                dataKey="count"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                label={({ label, percent }: { label: string; percent: number }) =>
                  percent > 0.04 ? label : ''
                }
                labelLine={false}
                style={{ fontSize: 10 }}
              >
                {coverage.by_region.slice(0, 10).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Events by Category */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>Events by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={coverage.by_category} margin={{ left: 16, right: 16, top: 4, bottom: 4 }}>
              <XAxis dataKey="label" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {coverage.by_category.map((item) => (
                  <Cell key={item.label} fill={CATEGORY_COLORS[item.label] || '#64748b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

/** Graph metrics — density gauge + top connected events table. */
function GraphMetricsSection({ stats }: { stats: FullStats }) {
  const { graph } = stats;
  const { label: dLabel, color: dColor } = densityLabel(graph.network_density);

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitle}>Graph Metrics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Density gauge */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Network Density
          </div>
          <div style={{ ...bigNumber, color: dColor, marginTop: 8 }}>
            {graph.network_density.toFixed(2)}%
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: dColor, marginTop: 4 }}>{dLabel}</div>
          <div style={{ ...subtitleStyle, marginTop: 12, textAlign: 'center' }}>
            <strong style={{ color: '#e2e8f0' }}>{graph.total_links}</strong> historical cause-effect relationships mapped
          </div>
          <div style={subtitleStyle}>
            Avg <strong style={{ color: '#e2e8f0' }}>{graph.avg_links_per_event}</strong> connections per event
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Total Events', value: graph.total_events, color: '#6366f1' },
            { label: 'Total Links', value: graph.total_links, color: '#8b5cf6' },
            { label: 'Total People', value: graph.total_people, color: '#a78bfa' },
            { label: 'Longest Chain', value: graph.longest_chain, color: '#c084fc' },
          ].map((m) => (
            <div key={m.label} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              <div style={{ ...bigNumber, color: m.color, fontSize: 28, marginTop: 6 }}>
                {m.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Top 10 Most Connected Events */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
            Top 10 Most Connected Events
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 500 }}>#</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 500 }}>Event</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px', color: '#94a3b8', fontWeight: 500 }}>Year</th>
                  <th style={{ textAlign: 'right', padding: '6px 8px', color: '#94a3b8', fontWeight: 500 }}>Degree</th>
                </tr>
              </thead>
              <tbody>
                {graph.top_connected_events.map((evt: EventRecord, i: number) => (
                  <tr key={evt.slug} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '6px 8px', color: '#64748b' }}>{i + 1}</td>
                    <td style={{ padding: '6px 8px' }}>
                      <Link to={`/event/${evt.slug}`} style={{ color: '#a5b4fc', textDecoration: 'none' }}>
                        {evt.title}
                      </Link>
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#94a3b8' }}>
                      {formatYear(evt.year_approx)}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: '#e2e8f0' }}>
                      {evt.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Decade heatmap + coverage gap. */
function TimelineCoverage({ stats }: { stats: FullStats }) {
  const { coverage } = stats;
  const maxCount = Math.max(...coverage.decade_heatmap.map((d) => d.count), 1);

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitle}>Timeline Coverage</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {/* Decade heatmap */}
        <div style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#cbd5e1' }}>
            Decade Heatmap
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {coverage.decade_heatmap.map((d) => {
              const intensity = d.count / maxCount;
              const bg = `rgba(99, 102, 241, ${0.1 + intensity * 0.85})`;
              return (
                <div
                  key={d.label}
                  title={`${d.label}: ${d.count} events`}
                  style={{
                    width: 36,
                    height: 28,
                    background: bg,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    color: intensity > 0.4 ? '#fff' : '#94a3b8',
                    cursor: 'default',
                  }}
                >
                  {d.count > 0 ? d.count : ''}
                </div>
              );
            })}
          </div>
          <div style={{ ...subtitleStyle, marginTop: 12 }}>
            Each cell = one decade. Hover for details.
          </div>
        </div>

        {/* Most eventful decade */}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Most Eventful Decade
          </div>
          <div style={{ ...bigNumber, marginTop: 8 }}>
            {coverage.most_represented_decade ?? '—'}
          </div>
          <div style={subtitleStyle}>
            {coverage.most_represented_decade_count} events
          </div>
        </div>

        {/* Most represented century */}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Most Eventful Century
          </div>
          <div style={{ ...bigNumber, marginTop: 8, fontSize: 24 }}>
            {coverage.most_represented_century ?? '—'}
          </div>
        </div>

        {/* Coverage gap alert */}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Largest Coverage Gap
          </div>
          <div style={{ ...bigNumber, color: '#f97316', marginTop: 8 }}>
            {coverage.largest_gap_years.toLocaleString()} years
          </div>
          <div style={subtitleStyle}>longest stretch with no events</div>
        </div>
      </div>
    </section>
  );
}

/** Fun facts section. */
function FunFacts({ stats }: { stats: FullStats }) {
  const { graph, coverage, curiosity } = stats;
  const topRegion = coverage.by_region[0];

  const facts = [
    `The average historical event in Chronicle influences ${graph.avg_links_per_event} other events.`,
    `${curiosity.major_event_pct}% of all events are classified as major (importance > 0.8).`,
    topRegion
      ? `The most documented region is ${topRegion.label} with ${topRegion.count} events.`
      : null,
    curiosity.total_years_covered > 0
      ? `Chronicle spans ${curiosity.total_years_covered.toLocaleString()} years of human history — from ${formatYear(curiosity.earliest_year)} to ${formatYear(curiosity.latest_year)}.`
      : null,
    graph.total_events > 0
      ? `If you read one event per day, it would take ${graph.total_events} days to read all of Chronicle.`
      : null,
  ].filter(Boolean) as string[];

  return (
    <section style={sectionStyle}>
      <h2 style={sectionTitle}>Fun Facts</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {facts.map((fact, i) => (
          <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>💡</span>
            <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{fact}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats-full'],
    queryFn: fetchFullStats,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div style={pageStyle}>
      {/* Top nav bar */}
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
        gap: 24,
      }}>
        <Link to="/" style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
          ← Chronicle
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Knowledge Graph Stats
        </h1>
      </nav>

      <div style={containerStyle}>
        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 16, color: '#94a3b8' }}>Loading statistics...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 16, color: '#f87171' }}>Failed to load statistics.</div>
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
              Make sure the backend is running at localhost:8000.
            </p>
          </div>
        )}

        {!isLoading && !stats && !error && (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 16, color: '#94a3b8' }}>Backend unavailable. Stats require a live database.</div>
          </div>
        )}

        {stats && (
          <>
            <RecordsSection stats={stats} />
            <CoverageCharts stats={stats} />
            <GraphMetricsSection stats={stats} />
            <TimelineCoverage stats={stats} />
            <FunFacts stats={stats} />
          </>
        )}
      </div>
    </div>
  );
}
