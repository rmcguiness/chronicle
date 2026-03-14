/**
 * WhatIfPage — counterfactual history explorer.
 *
 * Route: /what-if
 *
 * Lets users pick a historical event and see its downstream causal effects
 * ("What if this never happened?"). Uses the /api/what-if/:slug endpoint
 * which performs a recursive CTE on causality_links up to 4 hops.
 */

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { searchEvents } from '../api/client';
import type { SearchResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DownstreamEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
  importance_score: number;
  geo_modern: string | null;
  hop: number;
  link_description: string | null;
}

interface WhatIfData {
  event: {
    id: string;
    slug: string;
    title: string;
    year_approx: number | null;
    category: string | null;
    importance_score: number;
    geo_modern: string | null;
  };
  downstream_effects: Record<string, DownstreamEvent[]>;
  total_downstream_count: number;
  era_impact: string[];
  notable_effects: DownstreamEvent[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

const EXAMPLE_SCENARIOS = [
  {
    slug: 'black-death-arrives-europe',
    label: 'What if the Black Death never reached Europe?',
    emoji: '🦠',
  },
  {
    slug: 'gutenberg-printing-press',
    label: 'What if the printing press was never invented?',
    emoji: '📜',
  },
  {
    slug: 'assassination-franz-ferdinand-1914',
    label: 'What if World War I never started?',
    emoji: '⚔️',
  },
  {
    slug: 'columbus-reaches-americas-1492',
    label: 'What if Columbus never reached the Americas?',
    emoji: '🚢',
  },
  {
    slug: 'fall-of-constantinople-1453',
    label: 'What if Constantinople never fell?',
    emoji: '🏰',
  },
];

const HOP_LABELS: Record<string, string> = {
  direct: 'Direct Effects',
  secondary: 'Secondary Effects',
  tertiary: 'Tertiary Effects',
  quaternary: 'Quaternary Effects',
};

const HOP_COLORS: Record<string, string> = {
  direct: '#ef4444',
  secondary: '#f59e0b',
  tertiary: '#3b82f6',
  quaternary: '#8b5cf6',
};

const CATEGORY_EMOJI: Record<string, string> = {
  war: '⚔️',
  political: '🏛️',
  cultural: '🎭',
  discovery: '🔬',
  natural: '🌍',
  person: '👤',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function butterflyScore(count: number): { score: number; label: string; color: string } {
  if (count >= 16) return { score: Math.min(10, 6 + Math.floor(count / 8)), label: 'High Chaos', color: '#ef4444' };
  if (count >= 6) return { score: Math.min(7, 3 + Math.floor(count / 3)), label: 'Medium', color: '#f59e0b' };
  return { score: Math.max(1, count), label: 'Low', color: '#22c55e' };
}

async function fetchWhatIf(slug: string): Promise<WhatIfData> {
  const res = await fetch(`${BASE_URL}/api/what-if/${slug}`);
  if (!res.ok) throw new Error(`Failed to fetch what-if data for ${slug}`);
  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Search bar component
// ─────────────────────────────────────────────────────────────────────────────

function EventSearch({ onSelect }: { onSelect: (slug: string) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    const hits = await searchEvents(q, 8);
    setResults(hits);
    setShowDropdown(hits.length > 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 250);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  return (
    <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        placeholder="Search for any historical event..."
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 15,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#f1f5f9',
          outline: 'none',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
        }}
      />
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            marginTop: 4,
            maxHeight: 320,
            overflowY: 'auto',
            zIndex: 100,
          }}
        >
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                onSelect(r.slug);
                setQuery('');
                setShowDropdown(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 16px',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                color: '#e2e8f0',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ fontWeight: 600 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                {r.year_approx ?? 'Unknown'} {r.geo_modern ? `· ${r.geo_modern}` : ''}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ripple visualization
// ─────────────────────────────────────────────────────────────────────────────

function RippleVisualization({ data }: { data: WhatIfData }) {
  const hops = ['direct', 'secondary', 'tertiary'] as const;
  const ringRadii = [80, 150, 220];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
      <svg viewBox="-260 -260 520 520" width="100%" style={{ maxWidth: 480, maxHeight: 480 }}>
        {/* Concentric rings */}
        {hops.map((hop, i) => {
          const events = data.downstream_effects[hop] ?? [];
          const color = HOP_COLORS[hop];
          return (
            <g key={hop}>
              <circle
                cx={0} cy={0} r={ringRadii[i]}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="4 4"
                opacity={0.3}
              />
              <text
                x={0} y={-ringRadii[i] - 8}
                textAnchor="middle"
                fill={color}
                fontSize={10}
                fontWeight={700}
                opacity={0.7}
              >
                {HOP_LABELS[hop]}
              </text>
              {/* Event dots around the ring */}
              {events.slice(0, 12).map((ev, j) => {
                const angle = (j / Math.max(events.length, 1)) * Math.PI * 2 - Math.PI / 2;
                const x = Math.cos(angle) * ringRadii[i];
                const y = Math.sin(angle) * ringRadii[i];
                return (
                  <g key={ev.id}>
                    <circle cx={x} cy={y} r={6} fill={color} opacity={0.8} />
                    <title>{ev.title} ({ev.year_approx ?? '?'})</title>
                    {events.length <= 6 && (
                      <text
                        x={x}
                        y={y + 18}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize={8}
                      >
                        {ev.title.length > 20 ? ev.title.slice(0, 18) + '...' : ev.title}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Center: the event */}
        <circle cx={0} cy={0} r={24} fill="#3b82f622" stroke="#3b82f6" strokeWidth={2} />
        <text x={0} y={4} textAnchor="middle" fill="#93c5fd" fontSize={10} fontWeight={700}>
          {data.event.title.length > 16 ? data.event.title.slice(0, 14) + '...' : data.event.title}
        </text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results panel
// ─────────────────────────────────────────────────────────────────────────────

function ResultsPanel({ slug }: { slug: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['what-if', slug],
    queryFn: () => fetchWhatIf(slug),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.08)',
            borderTopColor: '#3b82f6',
            margin: '0 auto 16px',
          }}
        />
        Exploring counterfactual timeline...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{
        padding: '20px 24px',
        borderRadius: 10,
        backgroundColor: '#ef444418',
        border: '1px solid #ef444444',
        color: '#fca5a5',
        fontSize: 14,
        marginTop: 24,
      }}>
        {error instanceof Error ? error.message : 'Failed to load counterfactual data.'}
      </div>
    );
  }

  const butterfly = butterflyScore(data.total_downstream_count);
  const hopOrder = ['direct', 'secondary', 'tertiary', 'quaternary'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: 32 }}
    >
      {/* Header */}
      <h2 style={{
        fontSize: 'clamp(18px, 3vw, 28px)',
        fontWeight: 800,
        color: '#f1f5f9',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 1.3,
      }}>
        If "{data.event.title}" never happened...
      </h2>

      {/* Impact summary */}
      <div style={{
        textAlign: 'center',
        marginBottom: 32,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
      }}>
        <StatBadge
          label="Events Affected"
          value={String(data.total_downstream_count)}
          color="#3b82f6"
        />
        <StatBadge
          label="Domains Impacted"
          value={String(data.era_impact.length)}
          color="#8b5cf6"
        />
        <StatBadge
          label="Butterfly Score"
          value={`${butterfly.score}/10`}
          color={butterfly.color}
          sublabel={butterfly.label}
        />
      </div>

      {/* Ripple visualization */}
      {data.total_downstream_count > 0 && <RippleVisualization data={data} />}

      {/* Notable effects */}
      {data.notable_effects.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <SectionHeading icon="⭐" title="Most Significant Effects" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}>
            {data.notable_effects.map((ev, i) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Link
                  to={`/event/${ev.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.09)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                      {CATEGORY_EMOJI[ev.category ?? ''] ?? '📌'} {ev.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {ev.year_approx ?? 'Unknown'} {ev.geo_modern ? `· ${ev.geo_modern}` : ''}
                    </div>
                    <div style={{
                      fontSize: 11,
                      color: HOP_COLORS[hopOrder[ev.hop - 1] ?? 'direct'],
                      marginTop: 6,
                      fontWeight: 600,
                    }}>
                      {HOP_LABELS[hopOrder[ev.hop - 1] ?? 'direct'] ?? `Hop ${ev.hop}`} · Importance {Math.round(ev.importance_score * 100)}%
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Downstream events grouped by hop */}
      {hopOrder.map((hop) => {
        const events = data.downstream_effects[hop];
        if (!events || events.length === 0) return null;
        const color = HOP_COLORS[hop];
        return (
          <div key={hop} style={{ marginBottom: 28 }}>
            <SectionHeading
              icon={hop === 'direct' ? '1️⃣' : hop === 'secondary' ? '2️⃣' : hop === 'tertiary' ? '3️⃣' : '4️⃣'}
              title={`${HOP_LABELS[hop]} (${events.length})`}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}>
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <Link to={`/event/${ev.slug}`} style={{ textDecoration: 'none' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${color}33`,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: color,
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                          {ev.title}
                        </div>
                        {ev.link_description && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, lineHeight: 1.4 }}>
                            {ev.link_description}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', flexShrink: 0, textAlign: 'right' }}>
                        <div>{ev.year_approx ?? '?'}</div>
                        {ev.geo_modern && (
                          <div style={{ fontSize: 10, marginTop: 1 }}>{ev.geo_modern}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {data.total_downstream_count === 0 && (
        <div style={{
          padding: '20px 24px',
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#64748b',
          fontSize: 14,
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: 16,
        }}>
          No downstream causal effects found for this event. This doesn't mean it had no impact
          — it means our causality database doesn't yet have links from this event to others.
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small UI helpers
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ label, value, color, sublabel }: {
  label: string; value: string; color: string; sublabel?: string;
}) {
  return (
    <div style={{
      padding: '12px 20px',
      borderRadius: 10,
      backgroundColor: `${color}12`,
      border: `1px solid ${color}44`,
      textAlign: 'center',
      minWidth: 120,
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'monospace' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 700 }}>{sublabel}</div>
      )}
    </div>
  );
}

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <h3 style={{
      fontSize: 13,
      fontWeight: 700,
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span>{icon}</span> {title}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function WhatIfPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

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
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px' }}>
        {/* Nav */}
        <div style={{ padding: '24px 0 0' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* Hero */}
        <div style={{
          textAlign: 'center',
          padding: '48px 0 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🦋</div>
          <h1 style={{
            fontSize: 'clamp(24px, 5vw, 42px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.2,
            marginBottom: 12,
          }}>
            What If...?
          </h1>
          <p style={{
            fontSize: 16,
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: 580,
            margin: '0 auto 8px',
          }}>
            Exploring Counterfactual History
          </p>
          <p style={{
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.6,
            maxWidth: 580,
            margin: '0 auto',
          }}>
            Select any historical event and trace the chain of causality forward.
            What might never have happened? Which eras would be unrecognizable?
          </p>
        </div>

        {/* Search bar */}
        <div style={{ marginBottom: 32 }}>
          <EventSearch onSelect={setSelectedSlug} />
        </div>

        {/* Example scenarios */}
        <div style={{ marginBottom: 40 }}>
          <SectionHeading icon="💡" title="Try an example scenario" />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 10,
          }}>
            {EXAMPLE_SCENARIOS.map((s) => (
              <button
                key={s.slug}
                onClick={() => setSelectedSlug(s.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 10,
                  backgroundColor: selectedSlug === s.slug
                    ? 'rgba(59,130,246,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: selectedSlug === s.slug
                    ? '1px solid #3b82f666'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (selectedSlug !== s.slug) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSlug !== s.slug) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
                  }
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {selectedSlug && (
            <motion.div
              key={selectedSlug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsPanel slug={selectedSlug} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div style={{
          padding: '24px 0 48px',
          marginTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{
            fontSize: 12,
            color: '#475569',
            lineHeight: 1.6,
            textAlign: 'center',
            fontStyle: 'italic',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            This is a speculative exploration tool, not an academic prediction engine.
            History is far more complex than any causal chain can capture. Events
            have multiple causes, and counterfactual reasoning is inherently uncertain.
            Use this as a starting point for thinking about historical interconnections,
            not as definitive analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
