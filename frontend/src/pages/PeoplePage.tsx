/**
 * PeoplePage.tsx — /people route
 *
 * Full-page browser for exploring 190+ historical figures in the Chronicle DB.
 * Features: search, era/region filters, sort options, responsive card grid,
 * and a slide-in detail panel with connected events and lifespan visualization.
 *
 * Does NOT own: person data schema, API endpoints, detail panel internals.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PersonCard from '../components/PersonCard';
import type { PersonCardData } from '../components/PersonCard';
import PersonDetailPanel from '../components/PersonDetailPanel';

// ── Named constants ─────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

/** Debounce delay for search input (ms). */
const SEARCH_DEBOUNCE_MS = 300;

/** Available era filters. */
const ERA_OPTIONS = [
  { value: '', label: 'All Eras' },
  { value: 'ancient', label: 'Ancient (pre-800 BCE)' },
  { value: 'classical', label: 'Classical (800 BCE – 500 CE)' },
  { value: 'medieval', label: 'Medieval (500 – 1500)' },
  { value: 'modern', label: 'Modern (1500 – 1900)' },
  { value: 'contemporary', label: 'Contemporary (1900+)' },
];

/** Sort options. */
const SORT_OPTIONS = [
  { value: 'birth_year_asc', label: 'Birth Year ↑' },
  { value: 'birth_year_desc', label: 'Birth Year ↓' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'event_count', label: 'Most Events' },
];

// ── Types ───────────────────────────────────────────────────────────────────

interface PeopleResponse {
  people: PersonCardData[];
  total: number;
}

// ── Shared styles ───────────────────────────────────────────────────────────

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 8, fontSize: 13,
  background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(148,163,184,0.15)',
  color: '#e2e8f0', fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
};

const inputStyle: React.CSSProperties = {
  ...selectStyle, width: '100%', minWidth: 200, cursor: 'text',
};

// ── Skeleton card (loading state) ───────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)', borderRadius: 12,
      border: '1px solid rgba(148,163,184,0.08)', padding: 20,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ height: 18, width: '60%', borderRadius: 4, background: 'rgba(148,163,184,0.1)' }} />
      <div style={{ height: 14, width: '40%', borderRadius: 4, background: 'rgba(148,163,184,0.07)' }} />
      <div style={{ height: 12, width: '30%', borderRadius: 4, background: 'rgba(148,163,184,0.05)' }} />
      <div style={{ height: 48, borderRadius: 4, background: 'rgba(148,163,184,0.05)' }} />
      <div style={{ height: 12, width: '25%', borderRadius: 4, background: 'rgba(148,163,184,0.05)' }} />
    </div>
  );
}

/** Number of skeleton cards to show while loading. */
const SKELETON_COUNT = 12;

// ── Component ───────────────────────────────────────────────────────────────

/**
 * PeoplePage — main page component for /people route.
 * Renders filters, card grid, and detail panel.
 */
export default function PeoplePage() {
  const navigate = useNavigate();

  // Data state
  const [people, setPeople] = useState<PersonCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [era, setEra] = useState('');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('birth_year_asc');

  // Detail panel
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch people
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (era) params.set('era', era);
    if (region) params.set('region', region);
    params.set('sort', sort);

    axios.get<PeopleResponse>(`${BASE_URL}/api/people?${params.toString()}`)
      .then(r => setPeople(r.data.people))
      .catch(() => setError('Failed to load historical figures.'))
      .finally(() => setLoading(false));
  }, [debouncedSearch, era, region, sort]);

  // Extract unique regions from loaded data for dropdown
  const regionOptions = useMemo(() => {
    const regions = new Set<string>();
    people.forEach(p => p.nationalities?.forEach(n => regions.add(n)));
    return Array.from(regions).sort();
  }, [people]);

  const handleCardClick = useCallback((p: PersonCardData) => {
    if (p.wikipedia_slug) setSelectedSlug(p.wikipedia_slug);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#020617',
      fontFamily: "'Inter', sans-serif", color: '#e2e8f0',
    }}>
      {/* Top nav bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: '#94a3b8',
              fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px',
            }}
          >
            ← Network
          </button>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
            Historical Figures
          </h1>
          {!loading && (
            <span style={{ fontSize: 13, color: '#64748b' }}>
              {people.length} people
            </span>
          )}
        </div>
      </header>

      {/* Filters bar */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid rgba(148,163,184,0.06)',
        display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={era} onChange={e => setEra(e.target.value)} style={selectStyle}>
          {ERA_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select value={region} onChange={e => setRegion(e.target.value)} style={selectStyle}>
          <option value="">All Regions</option>
          {regionOptions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <main style={{ padding: 24 }}>
        {error && (
          <div style={{
            textAlign: 'center', padding: 40, color: '#ef4444', fontSize: 15,
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && people.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 60, color: '#64748b',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>No people match your filters</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your search or filters.</div>
          </div>
        )}

        {!loading && !error && people.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            <AnimatePresence mode="popLayout">
              {people.map(p => (
                <PersonCard key={p.id} person={p} onClick={handleCardClick} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Detail panel */}
      <PersonDetailPanel
        slug={selectedSlug}
        onClose={() => setSelectedSlug(null)}
      />
    </div>
  );
}
