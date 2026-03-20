/**
 * ChainsPage.tsx — /chains route
 *
 * Visual explorer for following cause-and-effect relationships between
 * historical events. Users can search for an event, choose forward or backward
 * traversal, set depth (1–5 hops), and see a vertical flow of connected events.
 *
 * Sections:
 *  1. Explore a Causal Chain — search + controls
 *  2. Chain Visualization — vertical flow of ChainCards
 *  3. Notable Chains — pre-built compelling chain starters
 *  4. Chain Stats — summary stats for the loaded chain
 *
 * Owns: page layout, search/autocomplete, API calls, state management.
 * Does NOT own: card rendering (ChainCard), flow layout (ChainFlow), routing.
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChainFlow from '../components/ChainFlow';
import type { ChainLinkData } from '../components/ChainFlow';
import type { ChainEvent } from '../components/ChainCard';

// ── Named constants ──────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

/** Minimum chain traversal depth. */
const MIN_DEPTH = 1;

/** Maximum chain traversal depth. */
const MAX_DEPTH = 5;

/** Default chain traversal depth. */
const DEFAULT_DEPTH = 3;

/** Debounce delay for search input (ms). */
const SEARCH_DEBOUNCE_MS = 300;

/** Depth used for notable chain auto-loads. */
const NOTABLE_CHAIN_DEPTH = 4;

// ── Types ────────────────────────────────────────────────────────────────────

type Direction = 'forward' | 'backward';

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
}

interface ChainData {
  root: ChainEvent;
  chain: ChainLinkData[];
  direction: Direction;
  depth: number;
}

// ── Notable chains (pre-built) ───────────────────────────────────────────────

interface NotableChain {
  name: string;
  description: string;
  startSlug: string;
  events: string[];
}

const NOTABLE_CHAINS: NotableChain[] = [
  {
    name: 'The Print Revolution',
    description: 'Gutenberg Press → Protestant Reformation → Scientific Revolution → Enlightenment → American Revolution',
    startSlug: 'gutenberg-printing-press',
    events: ['Gutenberg Press', 'Protestant Reformation', 'Scientific Revolution', 'Enlightenment', 'American Revolution'],
  },
  {
    name: 'Fall of the Islamic Golden Age',
    description: 'Mongol Invasion of Baghdad → Islamic Golden Age ends → Ottoman Rise → Fall of Constantinople → Renaissance',
    startSlug: 'mongol-sack-of-baghdad',
    events: ['Siege of Baghdad', 'Ottoman Rise', 'Fall of Constantinople', 'Renaissance'],
  },
  {
    name: 'Road to World War I',
    description: "Napoleon's Defeats → Concert of Europe → Rise of Nationalism → World War I",
    startSlug: 'napoleonic-wars',
    events: ['Napoleonic Wars', 'Concert of Europe', 'Rise of Nationalism', 'World War I'],
  },
];

// ── Shared nav button style ──────────────────────────────────────────────────

const NAV_BTN_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 14px', borderRadius: 8,
  backgroundColor: 'rgba(7,14,34,0.9)', backdropFilter: 'blur(12px)',
  border: '1px solid rgba(167,139,250,0.25)', color: '#94a3b8',
  cursor: 'pointer', fontSize: 13, fontWeight: 500,
  fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
  textDecoration: 'none',
};

/**
 * ChainsPage — main page component for the Causal Chains Explorer.
 *
 * @returns JSX element for the /chains route
 */
export default function ChainsPage() {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [direction, setDirection] = useState<Direction>('forward');
  const [depth, setDepth] = useState(DEFAULT_DEPTH);
  const [chainData, setChainData] = useState<ChainData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Search autocomplete ────────────────────────────────────────────────────

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const { data } = await axios.get<{ results: SearchResult[] }>(
          `${BASE_URL}/api/search`,
          { params: { q: searchQuery, limit: 8 } }
        );
        setSearchResults(data.results);
        setShowDropdown(data.results.length > 0);
      } catch {
        setSearchResults([]);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Fetch chain ────────────────────────────────────────────────────────────

  const fetchChain = useCallback(async (slug: string, dir: Direction, d: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<ChainData>(
        `${BASE_URL}/api/events/${slug}/chain`,
        { params: { direction: dir, depth: d } }
      );
      setChainData(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError(`Event "${slug}" not found in the database.`);
      } else {
        setError('Failed to load chain. Please try again.');
      }
      setChainData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExplore = useCallback(() => {
    if (selectedSlug) {
      fetchChain(selectedSlug, direction, depth);
    }
  }, [selectedSlug, direction, depth, fetchChain]);

  const handleSelectResult = useCallback((result: SearchResult) => {
    setSelectedSlug(result.slug);
    setSelectedTitle(result.title);
    setSearchQuery(result.title);
    setShowDropdown(false);
  }, []);

  const handleReRoot = useCallback((slug: string) => {
    setSelectedSlug(slug);
    fetchChain(slug, direction, depth);
  }, [direction, depth, fetchChain]);

  const handleViewTimeline = useCallback((slug: string) => {
    navigate(`/?event=${slug}`);
  }, [navigate]);

  const handleNotableChain = useCallback((chain: NotableChain) => {
    setSelectedSlug(chain.startSlug);
    setSelectedTitle(chain.events[0]);
    setSearchQuery(chain.events[0]);
    setDirection('forward');
    setDepth(NOTABLE_CHAIN_DEPTH);
    fetchChain(chain.startSlug, 'forward', NOTABLE_CHAIN_DEPTH);
  }, [fetchChain]);

  // ── Chain stats ────────────────────────────────────────────────────────────

  const chainStats = useMemo(() => {
    if (!chainData || chainData.chain.length === 0) return null;

    const allEvents = [chainData.root, ...chainData.chain.map(l => l.event)];
    const years = allEvents.map(e => e.year_approx).filter((y): y is number => y !== null);
    const regions = [...new Set(allEvents.map(e => e.region).filter((r): r is string => r !== null))];

    // Most connected = appears most in the chain links
    const connectionCount = new Map<string, number>();
    for (const e of allEvents) {
      connectionCount.set(e.slug, (connectionCount.get(e.slug) || 0) + 1);
    }
    let mostConnected = chainData.root;
    let maxCount = 0;
    for (const [slug, count] of connectionCount) {
      if (count > maxCount) {
        maxCount = count;
        mostConnected = allEvents.find(e => e.slug === slug) || chainData.root;
      }
    }

    return {
      totalEvents: allEvents.length,
      timeSpan: years.length >= 2 ? Math.abs(Math.max(...years) - Math.min(...years)) : 0,
      yearRange: years.length >= 2 ? `${Math.min(...years)}–${Math.max(...years)}` : 'N/A',
      regions,
      mostConnected,
    };
  }, [chainData]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #020617 0%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{ ...NAV_BTN_STYLE }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)'; e.currentTarget.style.color = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(167,139,250,0.25)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            ← Back to Timeline
          </button>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#e2e8f0' }}>
            🔗 Causal Chains Explorer
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>

        {/* ── Section 1: Explore a Causal Chain ──────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#cbd5e1', marginBottom: 16 }}>
            Explore a Causal Chain
          </h2>

          {/* Search input with autocomplete */}
          <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 12 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSelectedSlug(''); }}
              placeholder="Search for an event..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(15,23,42,0.8)',
                color: '#e2e8f0',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && selectedSlug) handleExplore();
              }}
            />
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 100,
                background: 'rgba(15,23,42,0.98)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: 8,
                marginTop: 4,
                maxHeight: 240,
                overflowY: 'auto',
              }}>
                {searchResults.map(result => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(148,163,184,0.08)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{result.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      {result.year_approx ? (result.year_approx < 0 ? `${Math.abs(result.year_approx)} BCE` : `${result.year_approx} CE`) : ''}
                      {result.category ? ` · ${result.category}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Direction toggle */}
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.2)' }}>
              {(['forward', 'backward'] as Direction[]).map(dir => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  style={{
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    border: 'none',
                    cursor: 'pointer',
                    background: direction === dir ? 'rgba(99,102,241,0.2)' : 'rgba(15,23,42,0.6)',
                    color: direction === dir ? '#818cf8' : '#64748b',
                    transition: 'all 0.15s',
                  }}
                >
                  {dir === 'forward' ? '→ Forward' : '← Backward'}
                </button>
              ))}
            </div>

            {/* Depth selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <label style={{ fontSize: 13, color: '#64748b' }}>Depth:</label>
              <select
                value={depth}
                onChange={e => setDepth(Number(e.target.value))}
                style={{
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(148,163,184,0.2)',
                  background: 'rgba(15,23,42,0.8)',
                  color: '#e2e8f0',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                {Array.from({ length: MAX_DEPTH - MIN_DEPTH + 1 }, (_, i) => i + MIN_DEPTH).map(d => (
                  <option key={d} value={d}>{d} hop{d > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Explore button */}
            <button
              onClick={handleExplore}
              disabled={!selectedSlug || loading}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: 'none',
                background: selectedSlug ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(100,116,139,0.3)',
                color: selectedSlug ? '#fff' : '#64748b',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: selectedSlug ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Loading...' : 'Explore'}
            </button>
          </div>

          {selectedTitle && selectedSlug && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
              Selected: <strong style={{ color: '#94a3b8' }}>{selectedTitle}</strong>
              {' · '}
              {direction === 'forward' ? 'What did this cause?' : 'What caused this?'}
              {' · '}
              {depth} hop{depth > 1 ? 's' : ''}
            </div>
          )}
        </section>

        {/* ── Section 2: Chain Visualization ──────────────────────────────── */}
        {error && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            fontSize: 14,
            marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        {chainData && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#cbd5e1', marginBottom: 4 }}>
              Chain Visualization
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>
              {direction === 'forward' ? 'Effects flow downward ↓' : 'Causes flow downward ↓'}
              {' · Click any card to re-root the chain'}
            </p>
            <ChainFlow
              root={chainData.root}
              chain={chainData.chain}
              direction={chainData.direction as 'forward' | 'backward'}
              onReRoot={handleReRoot}
              onViewTimeline={handleViewTimeline}
            />
          </section>
        )}

        {/* ── Section 3: Notable Chains ──────────────────────────────────── */}
        {!chainData && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#cbd5e1', marginBottom: 16 }}>
              Notable Chains
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NOTABLE_CHAINS.map(chain => (
                <button
                  key={chain.name}
                  onClick={() => handleNotableChain(chain)}
                  style={{
                    textAlign: 'left',
                    padding: '14px 18px',
                    borderRadius: 10,
                    border: '1px solid rgba(148,163,184,0.12)',
                    background: 'rgba(15,23,42,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                    e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)';
                    e.currentTarget.style.background = 'rgba(15,23,42,0.6)';
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                    {chain.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
                    {chain.description}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 4: Chain Stats ──────────────────────────────────────── */}
        {chainStats && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#cbd5e1', marginBottom: 16 }}>
              Chain Stats
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
            }}>
              <StatCard label="Total Events" value={String(chainStats.totalEvents)} />
              <StatCard label="Time Span" value={chainStats.timeSpan > 0 ? `${chainStats.timeSpan} years` : 'N/A'} />
              <StatCard label="Year Range" value={chainStats.yearRange} />
              <StatCard label="Regions" value={chainStats.regions.length > 0 ? chainStats.regions.join(', ') : 'N/A'} />
              <StatCard label="Most Connected" value={chainStats.mostConnected.title} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// ── Stat card sub-component ──────────────────────────────────────────────────

/**
 * StatCard — small metric display card.
 *
 * @param props.label - The metric label
 * @param props.value - The metric value
 */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: 8,
      background: 'rgba(15,23,42,0.6)',
      border: '1px solid rgba(148,163,184,0.1)',
    }}>
      <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 600, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  );
}
