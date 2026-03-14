/**
 * SixDegreesPage — /six-degrees
 *
 * Given any two historical events, find the shortest causal chain connecting them.
 * Uses BFS on the backend causality graph via GET /api/path?from=slug&to=slug.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchCausalPath,
  fetchGraphStats,
  searchEvents,
  type GraphStats,
  type PathEvent,
  type PathResponse,
  type PathStep,
  type SearchResult,
} from '../api/client';
import type { EventCategory } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Style constants (dark theme matching the rest of the app)
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(15, 23, 42, 0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#60a5fa';
const ACCENT_BRIGHT = '#3b82f6';

// ─────────────────────────────────────────────────────────────────────────────
// Featured paths — pre-computed interesting chains
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturedPath {
  fromSlug: string;
  fromTitle: string;
  toSlug: string;
  toTitle: string;
  label: string;
}

const FEATURED_PATHS: FeaturedPath[] = [
  {
    fromSlug: 'invention-of-the-printing-press-1440',
    fromTitle: 'Printing Press',
    toSlug: 'protestant-reformation-begins-1517',
    toTitle: 'Protestant Reformation',
    label: 'Printing Press → Protestant Reformation',
  },
  {
    fromSlug: 'black-death-in-europe-1347',
    fromTitle: 'Black Death',
    toSlug: 'italian-renaissance-begins-1400',
    toTitle: 'Renaissance',
    label: 'Black Death → Renaissance',
  },
  {
    fromSlug: 'fall-of-the-western-roman-empire-476',
    fromTitle: 'Fall of Rome',
    toSlug: 'islamic-golden-age-begins-750',
    toTitle: 'Islamic Golden Age',
    label: 'Fall of Rome → Islamic Golden Age',
  },
  {
    fromSlug: 'invention-of-gunpowder-850',
    fromTitle: 'Gunpowder',
    toSlug: 'rise-of-the-mongol-empire-1206',
    toTitle: 'Mongol Empire',
    label: 'Gunpowder → Mongol Empire',
  },
  {
    fromSlug: 'columbian-exchange-begins-1492',
    fromTitle: 'Columbian Exchange',
    toSlug: 'industrial-revolution-begins-1760',
    toTitle: 'Industrial Revolution',
    label: 'Columbian Exchange → Industrial Revolution',
  },
  {
    fromSlug: 'french-revolution-begins-1789',
    fromTitle: 'French Revolution',
    toSlug: 'napoleonic-wars-begin-1803',
    toTitle: 'Napoleonic Wars',
    label: 'French Revolution → Napoleonic Wars',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic daily challenge
// ─────────────────────────────────────────────────────────────────────────────

const CHALLENGE_PAIRS: [string, string, string, string][] = [
  ['assassination-franz-ferdinand-1914', 'Assassination of Franz Ferdinand', 'treaty-of-versailles-1919', 'Treaty of Versailles'],
  ['invention-of-the-printing-press-1440', 'Printing Press', 'french-revolution-begins-1789', 'French Revolution'],
  ['black-death-in-europe-1347', 'Black Death', 'protestant-reformation-begins-1517', 'Protestant Reformation'],
  ['fall-of-the-western-roman-empire-476', 'Fall of Rome', 'rise-of-the-mongol-empire-1206', 'Mongol Empire'],
  ['columbian-exchange-begins-1492', 'Columbian Exchange', 'american-revolution-begins-1775', 'American Revolution'],
  ['russian-revolution-1917', 'Russian Revolution', 'world-war-ii-begins-1939', 'World War II'],
  ['industrial-revolution-begins-1760', 'Industrial Revolution', 'world-war-i-begins-1914', 'World War I'],
];

/** Get today's challenge based on date. */
function getDailyChallenge(): { fromSlug: string; fromTitle: string; toSlug: string; toTitle: string } {
  const now = new Date();
  const dayIndex = (now.getFullYear() * 366 + now.getMonth() * 31 + now.getDate()) % CHALLENGE_PAIRS.length;
  const [fromSlug, fromTitle, toSlug, toTitle] = CHALLENGE_PAIRS[dayIndex];
  return { fromSlug, fromTitle, toSlug, toTitle };
}

// ─────────────────────────────────────────────────────────────────────────────
// EventSearchInput — typeahead search for events
// ─────────────────────────────────────────────────────────────────────────────

interface SelectedEvent {
  slug: string;
  title: string;
  year_approx: number | null;
  category: EventCategory | null;
}

interface EventSearchInputProps {
  label: string;
  value: SelectedEvent | null;
  onChange: (ev: SelectedEvent | null) => void;
  placeholder?: string;
}

function EventSearchInput({ label, value, onChange, placeholder }: EventSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInput = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const hits = await searchEvents(q, 8);
        setResults(hits);
        setIsOpen(hits.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, []);

  const handleSelect = useCallback((r: SearchResult) => {
    onChange({
      slug: r.slug,
      title: r.title,
      year_approx: r.year_approx ?? null,
      category: (r.category as EventCategory) ?? null,
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  }, [onChange]);

  if (value) {
    const catColor = value.category ? CATEGORY_COLORS[value.category] : TEXT_MUTED;
    return (
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          {label}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(30, 41, 59, 0.8)',
          border: `2px solid ${catColor}40`,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: catColor, flexShrink: 0 }} />
          <span style={{ color: TEXT_PRIMARY, fontWeight: 600, fontSize: 14, flex: 1 }}>
            {value.title}
          </span>
          {value.year_approx != null && (
            <span style={{
              fontSize: 11, color: ACCENT, background: 'rgba(96,165,250,0.12)',
              padding: '2px 8px', borderRadius: 6, fontWeight: 600,
            }}>
              {value.year_approx < 0 ? `${Math.abs(value.year_approx)} BCE` : value.year_approx}
            </span>
          )}
          <button
            onClick={() => onChange(null)}
            style={{
              background: 'none', border: 'none', color: TEXT_MUTED, cursor: 'pointer',
              fontSize: 16, padding: '0 4px', lineHeight: 1,
            }}
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ flex: 1, minWidth: 200, position: 'relative' }}>
      <div style={{ fontSize: 12, color: TEXT_SECONDARY, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => { if (results.length) setIsOpen(true); }}
        placeholder={placeholder ?? 'Search events...'}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10,
          background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)',
          color: TEXT_PRIMARY, fontSize: 14, outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {loading && (
        <div style={{ position: 'absolute', right: 14, top: 38, color: TEXT_MUTED, fontSize: 12 }}>
          ...
        </div>
      )}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          marginTop: 4, borderRadius: 10, overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxHeight: 300, overflowY: 'auto',
        }}>
          {results.map((r) => {
            const color = r.category ? CATEGORY_COLORS[r.category as EventCategory] ?? TEXT_MUTED : TEXT_MUTED;
            return (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                  padding: '10px 14px', background: 'none', border: 'none',
                  color: TEXT_PRIMARY, cursor: 'pointer', textAlign: 'left',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(96,165,250,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13 }}>{r.title}</span>
                {r.year_approx != null && (
                  <span style={{ fontSize: 11, color: TEXT_MUTED }}>
                    {r.year_approx < 0 ? `${Math.abs(r.year_approx)} BCE` : r.year_approx}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PathChainVisualization — renders the causal chain
// ─────────────────────────────────────────────────────────────────────────────

function PathChainVisualization({ path, edges }: { path: PathEvent[]; edges: PathStep[] }) {
  if (path.length === 0) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'row', alignItems: 'center',
      overflowX: 'auto', padding: '20px 0', gap: 0,
      flexWrap: 'nowrap',
    }}>
      {path.map((ev, i) => {
        const catColor = ev.category ? CATEGORY_COLORS[ev.category as EventCategory] ?? TEXT_MUTED : TEXT_MUTED;
        const edge = i < edges.length ? edges[i] : null;
        return (
          <div key={ev.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* Event node */}
            <Link
              to={`/event/${ev.slug}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '12px 16px', borderRadius: 12,
                background: `${catColor}15`, border: `2px solid ${catColor}40`,
                textDecoration: 'none', minWidth: 120, maxWidth: 180,
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = catColor;
                e.currentTarget.style.background = `${catColor}25`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${catColor}40`;
                e.currentTarget.style.background = `${catColor}15`;
              }}
            >
              <span style={{
                fontSize: 11, fontWeight: 600, color: ACCENT,
                background: 'rgba(96,165,250,0.12)', padding: '1px 8px',
                borderRadius: 6, marginBottom: 6,
              }}>
                {ev.year_approx != null
                  ? (ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : String(ev.year_approx))
                  : '?'}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY,
                textAlign: 'center', lineHeight: 1.3,
              }}>
                {ev.title}
              </span>
              {ev.category && (
                <span style={{ fontSize: 10, color: catColor, marginTop: 4 }}>
                  {CATEGORY_LABELS[ev.category as EventCategory] ?? ev.category}
                </span>
              )}
            </Link>

            {/* Arrow + label */}
            {edge && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                margin: '0 4px', minWidth: 60,
              }}>
                <span style={{ fontSize: 10, color: TEXT_MUTED, marginBottom: 2, whiteSpace: 'nowrap' }}>
                  {edge.connection_type === 'causes' ? 'caused' :
                   edge.connection_type === 'leads_to' ? 'led to' :
                   edge.connection_type === 'enables' ? 'enabled' : 'context'}
                </span>
                <div style={{
                  display: 'flex', alignItems: 'center', color: TEXT_MUTED,
                }}>
                  <div style={{ width: 30, height: 2, background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{ fontSize: 14 }}>▶</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DegreeMeter — visual progress bar for 1–6+ steps
// ─────────────────────────────────────────────────────────────────────────────

function DegreeMeter({ steps }: { steps: number }) {
  const max = 6;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const active = steps >= n;
        const isExact = steps === n;
        return (
          <div key={n} style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: active ? (isExact ? ACCENT_BRIGHT : 'rgba(59,130,246,0.3)') : 'rgba(255,255,255,0.05)',
            color: active ? '#fff' : TEXT_MUTED,
            fontSize: 13, fontWeight: 700,
            border: isExact ? `2px solid ${ACCENT}` : '2px solid transparent',
            transition: 'all 0.3s',
          }}>
            {n === max ? '6+' : n}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PathStats panel
// ─────────────────────────────────────────────────────────────────────────────

function PathStats({ steps, yearsSpanned, regions }: { steps: number; yearsSpanned: number; regions: string[] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 16, marginTop: 20,
    }}>
      <StatCard label="Steps" value={steps === 0 ? 'Same event' : String(steps)} />
      <StatCard label="Years Spanned" value={yearsSpanned.toLocaleString()} />
      <StatCard label="Regions Crossed" value={String(regions.length)} />
      <div style={{
        background: CARD_BG, borderRadius: 12, padding: 16,
        border: `1px solid ${CARD_BORDER}`,
      }}>
        <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
          Degrees of Separation
        </div>
        <DegreeMeter steps={steps} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: CARD_BG, borderRadius: 12, padding: 16,
      border: `1px solid ${CARD_BORDER}`,
    }}>
      <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: TEXT_PRIMARY }}>{value}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function SixDegreesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromEvent, setFromEvent] = useState<SelectedEvent | null>(null);
  const [toEvent, setToEvent] = useState<SelectedEvent | null>(null);
  const [activeFrom, setActiveFrom] = useState<string | null>(null);
  const [activeTo, setActiveTo] = useState<string | null>(null);
  const [challengeResult, setChallengeResult] = useState<PathResponse | null>(null);

  // Load graph stats
  const { data: stats } = useQuery<GraphStats>({
    queryKey: ['graph-stats'],
    queryFn: fetchGraphStats,
    staleTime: 60_000,
  });

  // Sync from URL params on mount
  useEffect(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    if (fromParam && toParam) {
      // Pre-fill from URL — set as selected events with minimal info
      setFromEvent({ slug: fromParam, title: fromParam.replace(/-/g, ' '), year_approx: null, category: null });
      setToEvent({ slug: toParam, title: toParam.replace(/-/g, ' '), year_approx: null, category: null });
      setActiveFrom(fromParam);
      setActiveTo(toParam);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Path query
  const { data: pathResult, isFetching: pathLoading } = useQuery<PathResponse>({
    queryKey: ['causal-path', activeFrom, activeTo],
    queryFn: () => fetchCausalPath(activeFrom!, activeTo!),
    enabled: !!activeFrom && !!activeTo,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  // When path loads, update the selected events with full info
  useEffect(() => {
    if (pathResult?.found && pathResult.path.length >= 2) {
      const first = pathResult.path[0];
      const last = pathResult.path[pathResult.path.length - 1];
      setFromEvent({
        slug: first.slug, title: first.title,
        year_approx: first.year_approx, category: first.category as EventCategory | null,
      });
      setToEvent({
        slug: last.slug, title: last.title,
        year_approx: last.year_approx, category: last.category as EventCategory | null,
      });
    }
  }, [pathResult]);

  const handleSubmit = useCallback(() => {
    if (!fromEvent || !toEvent) return;
    setActiveFrom(fromEvent.slug);
    setActiveTo(toEvent.slug);
    setSearchParams({ from: fromEvent.slug, to: toEvent.slug });
  }, [fromEvent, toEvent, setSearchParams]);

  const handleSwap = useCallback(() => {
    const tmp = fromEvent;
    setFromEvent(toEvent);
    setToEvent(tmp);
  }, [fromEvent, toEvent]);

  const handleSurprise = useCallback(() => {
    const pair = FEATURED_PATHS[Math.floor(Math.random() * FEATURED_PATHS.length)];
    const from: SelectedEvent = { slug: pair.fromSlug, title: pair.fromTitle, year_approx: null, category: null };
    const to: SelectedEvent = { slug: pair.toSlug, title: pair.toTitle, year_approx: null, category: null };
    setFromEvent(from);
    setToEvent(to);
    setActiveFrom(pair.fromSlug);
    setActiveTo(pair.toSlug);
    setSearchParams({ from: pair.fromSlug, to: pair.toSlug });
  }, [setSearchParams]);

  const handleFeaturedClick = useCallback((fp: FeaturedPath) => {
    const from: SelectedEvent = { slug: fp.fromSlug, title: fp.fromTitle, year_approx: null, category: null };
    const to: SelectedEvent = { slug: fp.toSlug, title: fp.toTitle, year_approx: null, category: null };
    setFromEvent(from);
    setToEvent(to);
    setActiveFrom(fp.fromSlug);
    setActiveTo(fp.toSlug);
    setSearchParams({ from: fp.fromSlug, to: fp.toSlug });
  }, [setSearchParams]);

  const challenge = useMemo(() => getDailyChallenge(), []);

  const handleChallengeClick = useCallback(() => {
    const from: SelectedEvent = { slug: challenge.fromSlug, title: challenge.fromTitle, year_approx: null, category: null };
    const to: SelectedEvent = { slug: challenge.toSlug, title: challenge.toTitle, year_approx: null, category: null };
    setFromEvent(from);
    setToEvent(to);
    setActiveFrom(challenge.fromSlug);
    setActiveTo(challenge.toSlug);
    setSearchParams({ from: challenge.fromSlug, to: challenge.toSlug });
  }, [challenge, setSearchParams]);

  const shareText = pathResult?.found
    ? `I found a ${pathResult.steps}-step path from ${pathResult.path[0]?.title} to ${pathResult.path[pathResult.path.length - 1]?.title}! Can you find a shorter one?`
    : null;

  return (
    <div style={{
      minHeight: '100vh', background: PAGE_BG, color: TEXT_PRIMARY,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Top nav bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px',
        background: 'rgba(7, 14, 34, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link to="/" style={{ color: ACCENT, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
          ← Chronicle
        </Link>
        <span style={{ color: TEXT_SECONDARY, fontSize: 13 }}>Six Degrees of History</span>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: -1, color: TEXT_PRIMARY }}>
            Six Degrees of History
          </h1>
          <p style={{ fontSize: 16, color: TEXT_SECONDARY, marginTop: 8 }}>
            Every event in history is connected — find the path
          </p>
          {stats && (
            <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8 }}>
              {stats.total_events.toLocaleString()} events connected by {stats.total_links.toLocaleString()} causality links
              {stats.avg_degree > 0 && ` · avg ${stats.avg_degree} connections per event`}
            </p>
          )}
        </header>

        {/* Event Pair Selector */}
        <section style={{
          background: CARD_BG, borderRadius: 16, padding: 24,
          border: `1px solid ${CARD_BORDER}`, marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', gap: 12, alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}>
            <EventSearchInput
              label="Start Event"
              value={fromEvent}
              onChange={setFromEvent}
              placeholder="e.g. Printing Press"
            />

            <button
              onClick={handleSwap}
              style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: TEXT_SECONDARY, cursor: 'pointer', borderRadius: 10,
                padding: '10px 12px', fontSize: 16, marginBottom: 0,
                alignSelf: 'flex-end', transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              title="Swap events"
            >
              ⇄
            </button>

            <EventSearchInput
              label="End Event"
              value={toEvent}
              onChange={setToEvent}
              placeholder="e.g. French Revolution"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              onClick={handleSubmit}
              disabled={!fromEvent || !toEvent || pathLoading}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: (!fromEvent || !toEvent) ? 'rgba(255,255,255,0.05)' : ACCENT_BRIGHT,
                color: (!fromEvent || !toEvent) ? TEXT_MUTED : '#fff',
                fontSize: 14, fontWeight: 700, cursor: (!fromEvent || !toEvent) ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {pathLoading ? 'Searching...' : 'Find Path'}
            </button>
            <button
              onClick={handleSurprise}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: TEXT_SECONDARY, fontSize: 14, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              Surprise me
            </button>
          </div>
        </section>

        {/* Loading state */}
        {pathLoading && (
          <section style={{
            background: CARD_BG, borderRadius: 16, padding: 32,
            border: `1px solid ${CARD_BORDER}`, textAlign: 'center', marginBottom: 24,
          }}>
            <div style={{ fontSize: 20, color: ACCENT, marginBottom: 8 }}>
              Searching...
            </div>
            <div style={{ fontSize: 14, color: TEXT_MUTED }}>
              Searching through {stats?.total_links?.toLocaleString() ?? 'many'} causality links...
            </div>
          </section>
        )}

        {/* Path result */}
        {!pathLoading && pathResult && (
          <section style={{
            background: CARD_BG, borderRadius: 16, padding: 24,
            border: `1px solid ${CARD_BORDER}`, marginBottom: 24,
          }}>
            {pathResult.found ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: ACCENT, margin: 0 }}>
                    {pathResult.steps === 0
                      ? 'Same event!'
                      : `Connected in ${pathResult.steps} step${pathResult.steps !== 1 ? 's' : ''}!`}
                  </h2>
                  {pathResult.path.length >= 2 && (
                    <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginTop: 8 }}>
                      The path from <strong>{pathResult.path[0].title}</strong> to{' '}
                      <strong>{pathResult.path[pathResult.path.length - 1].title}</strong>{' '}
                      spans {pathResult.years_spanned.toLocaleString()} years
                      {pathResult.regions.length > 0 && (
                        <> across {pathResult.regions.length} region{pathResult.regions.length !== 1 ? 's' : ''}</>
                      )}
                    </p>
                  )}
                </div>

                <PathChainVisualization path={pathResult.path} edges={pathResult.edges} />

                <PathStats
                  steps={pathResult.steps}
                  yearsSpanned={pathResult.years_spanned}
                  regions={pathResult.regions}
                />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {shareText && (
                    <button
                      onClick={() => navigator.clipboard?.writeText(shareText)}
                      style={{
                        padding: '8px 16px', borderRadius: 8,
                        background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)',
                        color: ACCENT, fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      Copy share text
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f97316', margin: 0 }}>
                  No direct causal path found
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginTop: 8 }}>
                  These events happened in parallel but without a direct causal link in our database.
                </p>
                {!pathResult.found && pathResult.nearest_from && (
                  <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 8 }}>
                    <strong>{pathResult.nearest_from.title}</strong> has{' '}
                    {pathResult.nearest_from_steps} reachable connections from the start
                  </p>
                )}
                <p style={{ fontSize: 13, color: TEXT_MUTED, marginTop: 12 }}>
                  Try one of the featured paths below, or pick events that are closer in time or region.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Daily Challenge */}
        <section style={{
          background: 'rgba(59, 130, 246, 0.06)', borderRadius: 16, padding: 24,
          border: '1px solid rgba(59, 130, 246, 0.15)', marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Today's Challenge
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: TEXT_PRIMARY }}>
            Connect <span style={{ color: ACCENT }}>{challenge.fromTitle}</span> to{' '}
            <span style={{ color: ACCENT }}>{challenge.toTitle}</span>
          </h3>
          <p style={{ fontSize: 13, color: TEXT_SECONDARY, marginTop: 4 }}>
            How few steps does it take?
          </p>
          <button
            onClick={handleChallengeClick}
            style={{
              marginTop: 12, padding: '8px 20px', borderRadius: 8,
              background: ACCENT_BRIGHT, border: 'none', color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Try it
          </button>
          {challengeResult?.found && (
            <div style={{ marginTop: 12, fontSize: 13, color: ACCENT }}>
              Solved in {challengeResult.steps} steps!
            </div>
          )}
        </section>

        {/* Featured Paths */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: TEXT_PRIMARY }}>
            Featured Paths
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}>
            {FEATURED_PATHS.map((fp) => (
              <button
                key={fp.label}
                onClick={() => handleFeaturedClick(fp)}
                style={{
                  background: CARD_BG, borderRadius: 12, padding: 16,
                  border: `1px solid ${CARD_BORDER}`, cursor: 'pointer',
                  textAlign: 'left', transition: 'border-color 0.2s',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = CARD_BORDER; }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY }}>
                  {fp.label}
                </span>
                <span style={{ fontSize: 12, color: ACCENT }}>
                  Try it →
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
