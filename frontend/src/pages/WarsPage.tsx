/**
 * WarsPage — "The History of Conflict"
 *
 * Route: /wars
 *
 * Features:
 *  - War/conflict events from Chronicle DB with major war metadata enrichment
 *  - Era / Region / Sort filters
 *  - Stats bar: total wars, total casualties, deadliest, longest
 *  - War cards with casualty scale bars, outcome badges, combatants
 *  - Deadliest Wars top-10 horizontal bar chart
 *  - Longest Wars section
 *  - Wars by Era breakdown chart
 *  - Expandable detail for enriched wars
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// -- Types --------------------------------------------------------------------

interface WarMetadata {
  estimated_casualties: number;
  duration_years: number;
  combatants: string[];
  outcome: string;
  significance: number;
}

interface WarEvent {
  id: string;
  slug: string;
  title: string;
  date_display: string;
  year: number | null;
  is_bce: boolean;
  era: string;
  region: string | null;
  description: string | null;
  event_category: string | null;
  importance_score: number;
  metadata: WarMetadata | null;
}

interface WarsStats {
  total_wars: number;
  total_casualties: number;
  deadliest_war: string;
  longest_war: string;
}

interface WarsData {
  wars: WarEvent[];
  stats: WarsStats;
  total: number;
  page: number;
  total_pages: number;
}

// -- Constants ----------------------------------------------------------------

const ERA_COLORS: Record<string, string> = {
  Ancient: '#f59e0b',
  Medieval: '#ef4444',
  'Early Modern': '#8b5cf6',
  Modern: '#3b82f6',
  Unknown: '#64748b',
};

const OUTCOME_COLORS: Record<string, string> = {
  Victory: '#22c55e',
  Defeat: '#ef4444',
  Stalemate: '#f59e0b',
  Ongoing: '#3b82f6',
  Collapse: '#a855f7',
};

const ERAS = ['All', 'Ancient', 'Medieval', 'Early Modern', 'Modern'];
const REGIONS = ['All', 'Europe', 'Middle East', 'Asia', 'Americas', 'Africa', 'Oceania'];
const SORTS = [
  { key: 'date', label: 'By Date' },
  { key: 'casualties', label: 'By Casualties' },
  { key: 'duration', label: 'By Duration' },
] as const;

type SortKey = (typeof SORTS)[number]['key'];

// -- Helpers ------------------------------------------------------------------

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function casualtyColor(n: number): string {
  if (n >= 10_000_000) return '#ef4444';
  if (n >= 1_000_000) return '#f97316';
  if (n >= 100_000) return '#f59e0b';
  return '#22c55e';
}

// -- Component ----------------------------------------------------------------

export default function WarsPage() {
  const [eraFilter, setEraFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const queryParams = new URLSearchParams();
  if (eraFilter !== 'All') queryParams.set('era', eraFilter);
  if (regionFilter !== 'All') queryParams.set('region', regionFilter);
  queryParams.set('sort', sortKey);
  queryParams.set('page', String(page));

  const { data, isLoading, isError, refetch } = useQuery<WarsData>({
    queryKey: ['wars', eraFilter, regionFilter, sortKey, page],
    queryFn: async () => {
      const res = await fetch(`${API}/api/wars?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load wars');
      return res.json();
    },
  });

  // Also fetch all wars (page 1 with no filters) for charts
  const { data: allData } = useQuery<WarsData>({
    queryKey: ['wars-all'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/wars?sort=casualties&page=1`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const wars = data?.wars ?? [];
  const stats = data?.stats;

  // Enriched wars for charts (from current filtered data + all data)
  const enrichedWars = useMemo(() => {
    const src = allData?.wars ?? wars;
    return src.filter((w) => w.metadata !== null);
  }, [allData, wars]);

  const deadliestTop10 = useMemo(() => {
    return [...enrichedWars]
      .sort((a, b) => (b.metadata!.estimated_casualties) - (a.metadata!.estimated_casualties))
      .slice(0, 10);
  }, [enrichedWars]);

  const longestTop10 = useMemo(() => {
    return [...enrichedWars]
      .sort((a, b) => (b.metadata!.duration_years) - (a.metadata!.duration_years))
      .slice(0, 10);
  }, [enrichedWars]);

  const eraBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const w of (allData?.wars ?? wars)) {
      counts[w.era] = (counts[w.era] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allData, wars]);

  const maxEraCount = Math.max(...eraBreakdown.map(([, c]) => c), 1);

  const maxCasualties = deadliestTop10[0]?.metadata?.estimated_casualties ?? 1;
  const maxDuration = longestTop10[0]?.metadata?.duration_years ?? 1;

  const filterBtn = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: 6,
    border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
    background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Back nav */}
      <Link
        to="/"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 40,
          padding: '8px 14px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
          textDecoration: 'none', transition: 'all 150ms ease',
        }}
      >
        &larr; Chronicle
      </Link>

      {/* Hero Header */}
      <header style={{ padding: '80px 24px 32px', textAlign: 'center', maxWidth: 960, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, margin: 0, letterSpacing: -0.5 }}
        >
          The History of Conflict
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ fontSize: 20, color: '#94a3b8', marginTop: 12, fontWeight: 400 }}
        >
          From ancient battles to modern warfare
        </motion.p>

        {/* Stats bar */}
        {!isLoading && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 28, flexWrap: 'wrap' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{stats.total_wars}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Wars Tracked</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#f97316' }}>{formatNumber(stats.total_casualties)}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Est. Casualties</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f59e0b', lineHeight: 1.3 }}>{stats.deadliest_war}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Deadliest</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6', lineHeight: 1.3 }}>{stats.longest_war}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Longest</div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Filters */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 24px' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, padding: 12,
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>Era</span>
          {ERAS.map((e) => (
            <button key={e} onClick={() => handleFilterChange(setEraFilter, e)} style={filterBtn(eraFilter === e)}>{e}</button>
          ))}

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>Region</span>
          {REGIONS.map((r) => (
            <button key={r} onClick={() => handleFilterChange(setRegionFilter, r)} style={filterBtn(regionFilter === r)}>{r}</button>
          ))}

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 4px' }} />

          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>Sort</span>
          {SORTS.map((s) => (
            <button key={s.key} onClick={() => { setSortKey(s.key); setPage(1); }} style={filterBtn(sortKey === s.key)}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 64px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: 28, marginBottom: 16,
            }}>
              <div style={{ height: 20, width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 12 }} />
              <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 14, width: '80%', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: '#ef4444', marginBottom: 16 }}>Failed to load wars data.</p>
          <button onClick={() => refetch()} style={{
            padding: '10px 24px', borderRadius: 8, border: 'none',
            background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Retry</button>
        </div>
      )}

      {/* War cards */}
      {!isLoading && !isError && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 40px' }}>
          {wars.length === 0 && (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, padding: '40px 0' }}>
              No wars match the selected filters.
            </p>
          )}

          {wars.map((war, i) => {
            const eraColor = ERA_COLORS[war.era] || '#64748b';
            const isExpanded = expandedSlug === war.slug;
            const meta = war.metadata;

            return (
              <motion.div
                key={war.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.4) }}
                style={{ marginBottom: 14 }}
              >
                <div
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${meta ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12,
                    padding: 20,
                    cursor: meta ? 'pointer' : 'default',
                    transition: 'border-color 200ms ease, box-shadow 200ms ease',
                  }}
                  onClick={() => meta && setExpandedSlug(isExpanded ? null : war.slug)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.18)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 24px rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = meta ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Badges row */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
                    {/* Era badge */}
                    <span style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: `${eraColor}22`, color: eraColor, border: `1px solid ${eraColor}33`,
                    }}>{war.era}</span>
                    {/* Region badge */}
                    {war.region && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>{war.region}</span>
                    )}
                    {/* Category badge */}
                    {war.event_category && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.2)',
                      }}>{war.event_category}</span>
                    )}
                    {/* Outcome badge */}
                    {meta && (
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: `${OUTCOME_COLORS[meta.outcome] || '#64748b'}18`,
                        color: OUTCOME_COLORS[meta.outcome] || '#64748b',
                        border: `1px solid ${OUTCOME_COLORS[meta.outcome] || '#64748b'}33`,
                      }}>{meta.outcome}</span>
                    )}
                    {/* Significance stars */}
                    {meta && (
                      <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 4 }}>
                        {'*'.repeat(meta.significance)}
                      </span>
                    )}
                  </div>

                  {/* Title + date */}
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
                    {war.title}
                  </h3>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: meta ? 12 : 6 }}>
                    {war.date_display}
                    {meta && ` \u00b7 ${meta.duration_years < 1 ? `${Math.round(meta.duration_years * 12)} months` : `${meta.duration_years} years`}`}
                  </div>

                  {/* Combatants */}
                  {meta && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                        {meta.combatants[0]}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>VS</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                        {meta.combatants[1]}
                      </span>
                    </div>
                  )}

                  {/* Casualties bar */}
                  {meta && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Estimated Casualties
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: casualtyColor(meta.estimated_casualties) }}>
                          {formatNumber(meta.estimated_casualties)}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, (meta.estimated_casualties / 85_000_000) * 100)}%`,
                          height: '100%', borderRadius: 3,
                          background: casualtyColor(meta.estimated_casualties),
                          transition: 'width 300ms ease',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {war.description && (
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.5 }}>
                      {war.description.length > 200 && !isExpanded
                        ? war.description.slice(0, 200) + '...'
                        : war.description}
                    </p>
                  )}

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && meta && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: 12, paddingTop: 12,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                        }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Duration</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                                {meta.duration_years < 1 ? `${Math.round(meta.duration_years * 12)} months` : `${meta.duration_years} years`}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Significance</div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b' }}>
                                {meta.significance}/5
                              </div>
                            </div>
                          </div>
                          <Link
                            to={`/search?q=${encodeURIComponent(war.title)}`}
                            style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6', textDecoration: 'none' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Find in Chronicle &rarr;
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand indicator for enriched wars */}
                  {meta && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 8, textAlign: 'right' }}>
                      {isExpanded ? 'Click to collapse' : 'Click for details'}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={{
                  ...filterBtn(false),
                  opacity: page <= 1 ? 0.3 : 1,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: 13, color: '#94a3b8', alignSelf: 'center' }}>
                Page {page} of {data.total_pages}
              </span>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setPage(page + 1)}
                style={{
                  ...filterBtn(false),
                  opacity: page >= data.total_pages ? 0.3 : 1,
                  cursor: page >= data.total_pages ? 'not-allowed' : 'pointer',
                }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Charts Section ── */}
      {!isLoading && !isError && enrichedWars.length > 0 && (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 60px' }}>

          {/* Deadliest Wars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 24, marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>
              Deadliest Wars
              <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b', marginLeft: 8 }}>Top 10 by estimated casualties</span>
            </h2>
            {deadliestTop10.map((w) => {
              const cas = w.metadata!.estimated_casualties;
              const pct = (cas / maxCasualties) * 100;
              return (
                <div key={w.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{w.title}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: casualtyColor(cas) }}>{formatNumber(cas)}</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 5, background: casualtyColor(cas) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Longest Wars */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 24, marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>
              Longest Wars
              <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b', marginLeft: 8 }}>Top 10 by duration</span>
            </h2>
            {longestTop10.map((w) => {
              const dur = w.metadata!.duration_years;
              const pct = (dur / maxDuration) * 100;
              return (
                <div key={w.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{w.title}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#8b5cf6' }}>
                      {dur < 1 ? `${Math.round(dur * 12)} months` : `${dur} years`}
                    </span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 5, background: '#8b5cf6' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wars by Era */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 24,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#fff' }}>
              Wars by Era
              <span style={{ fontSize: 13, fontWeight: 400, color: '#64748b', marginLeft: 8 }}>Conflict count per era</span>
            </h2>
            {eraBreakdown.map(([era, count]) => {
              const pct = (count / maxEraCount) * 100;
              const color = ERA_COLORS[era] || '#64748b';
              return (
                <div key={era} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color }}>{era}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                  </div>
                  <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 5, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: 24, color: '#475569', fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        Chronicle &mdash; Open-source historical events explorer &middot;{' '}
        <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Back to timeline</Link>
      </footer>
    </div>
  );
}
