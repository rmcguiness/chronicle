/**
 * PeoplePage — browsable directory of all historical figures.
 *
 * Route: /people
 *
 * Features: search, era filter tabs, sort dropdown, person cards grid,
 * random figure button, pagination.
 */
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchPeople, type PersonListItem } from '../api/client';

const ERA_TABS = [
  { key: 'all', label: 'All' },
  { key: 'ancient', label: 'Ancient', hint: 'pre-500 BCE' },
  { key: 'classical', label: 'Classical', hint: '500 BCE \u2013 500 CE' },
  { key: 'medieval', label: 'Medieval', hint: '500\u20131500' },
  { key: 'early-modern', label: 'Early Modern', hint: '1500\u20131700' },
  { key: 'modern', label: 'Modern', hint: '1700\u20131900' },
  { key: 'contemporary', label: 'Contemporary', hint: '1900+' },
] as const;

const SORT_OPTIONS = [
  { value: 'name', label: 'A\u2013Z' },
  { value: 'events', label: 'Most Connected' },
  { value: 'birth_year', label: 'Earliest Born' },
  { value: '-birth_year', label: 'Latest Born' },
] as const;

const ERA_COLORS: Record<string, string> = {
  ancient: '#a78bfa',
  classical: '#8b5cf6',
  medieval: '#f59e0b',
  'early-modern': '#f97316',
  modern: '#22c55e',
  contemporary: '#3b82f6',
  unknown: '#6b7280',
};

const ROLE_COLORS: Record<string, string> = {
  king: '#f59e0b',
  queen: '#ec4899',
  emperor: '#ef4444',
  empress: '#ec4899',
  pharaoh: '#a78bfa',
  general: '#6366f1',
  conqueror: '#ef4444',
  admiral: '#3b82f6',
  philosopher: '#8b5cf6',
  scientist: '#22c55e',
  explorer: '#14b8a6',
  prophet: '#f97316',
  pope: '#f59e0b',
  president: '#3b82f6',
  revolutionary: '#ef4444',
  artist: '#ec4899',
  writer: '#a855f7',
  poet: '#a855f7',
  inventor: '#22c55e',
  mathematician: '#22c55e',
  diplomat: '#6366f1',
};

const PAGE_SIZE = 48;

function formatYear(year: number | null, circa?: boolean): string {
  if (year === null) return '?';
  const prefix = circa ? 'c.\u00A0' : '';
  if (year < 0) return `${prefix}${Math.abs(year)} BCE`;
  return `${prefix}${year}`;
}

function getEraColor(era: string): string {
  return ERA_COLORS[era] ?? '#6b7280';
}

function getRoleColor(role: string): string {
  const lower = role.toLowerCase();
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return '#64748b';
}

export default function PeoplePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [era, setEra] = useState('all');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Enable scrolling on this page
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

  // Debounce search
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['people', debouncedSearch, sort],
    queryFn: () => fetchPeople({
      q: debouncedSearch || undefined,
      sort,
    }),
    staleTime: 10 * 60 * 1000,
  });

  const allPeople = data?.people ?? [];
  const eraCounts = data?.era_counts ?? {};

  // Client-side era filter (so tab counts stay accurate)
  const filtered = useMemo(() => {
    if (era === 'all') return allPeople;
    return allPeople.filter(p => p.era === era);
  }, [allPeople, era]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Compute century span for hero subtitle
  const centurySpan = useMemo(() => {
    const years = allPeople.map(p => p.birth_year).filter((y): y is number => y !== null);
    if (years.length === 0) return 0;
    const min = Math.min(...years);
    const max = Math.max(...years);
    return Math.ceil((max - min) / 100);
  }, [allPeople]);

  // Random figure
  const goRandom = () => {
    if (allPeople.length === 0) return;
    const person = allPeople[Math.floor(Math.random() * allPeople.length)];
    navigate(`/people/${person.slug}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ padding: '40px 0 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: '#64748b', textDecoration: 'none',
              marginBottom: 24, padding: '6px 12px', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            &#8592; Back to Timeline
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800,
                color: '#f1f5f9',
                lineHeight: 1.2,
                marginBottom: 8,
              }}>
                Historical Figures
              </h1>
              <p style={{ fontSize: 15, color: '#94a3b8', margin: 0 }}>
                {allPeople.length} people across {centurySpan} centuries
              </p>
            </div>

            {/* Random Figure button */}
            <button
              onClick={goRandom}
              disabled={allPeople.length === 0}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                backgroundColor: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.4)',
                color: '#a5b4fc',
                fontSize: 13,
                fontWeight: 600,
                cursor: allPeople.length ? 'pointer' : 'default',
                fontFamily: 'inherit',
                transition: 'background 0.15s, border-color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
            >
              Random Figure
            </button>
          </div>

          {/* Search + Sort row */}
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              style={{
                flex: '1 1 280px',
                maxWidth: 400,
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#0f1117',
                border: '1px solid rgba(148,163,184,0.3)',
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: '#0f1117',
                border: '1px solid rgba(148,163,184,0.3)',
                color: '#e2e8f0',
                fontSize: 14,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Era filter tabs */}
          <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ERA_TABS.map(tab => {
              const isActive = era === tab.key;
              const count = tab.key === 'all'
                ? allPeople.length
                : (eraCounts[tab.key] ?? 0);
              const color = tab.key === 'all' ? '#94a3b8' : getEraColor(tab.key);
              return (
                <button
                  key={tab.key}
                  onClick={() => { setEra(tab.key); setPage(1); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    border: `1px solid ${isActive ? color + '66' : 'rgba(255,255,255,0.08)'}`,
                    backgroundColor: isActive ? color + '22' : 'rgba(255,255,255,0.04)',
                    color: isActive ? color : '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                  {count > 0 && (
                    <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.08)',
                borderTopColor: '#3b82f6',
                margin: '0 auto 16px',
              }}
            />
            Loading people...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={{
            margin: '32px 0', padding: '20px 24px', borderRadius: 10,
            backgroundColor: '#ef444418', border: '1px solid #ef444444',
            color: '#fca5a5', fontSize: 14,
          }}>
            Failed to load people. Make sure the backend is running.
          </div>
        )}

        {/* People grid */}
        {!isLoading && !isError && (
          <div style={{ paddingTop: 28, paddingBottom: 60 }}>
            {paginated.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
                {debouncedSearch ? `No people match "${debouncedSearch}"` : 'No people found'}
                {era !== 'all' && ` in the ${ERA_TABS.find(t => t.key === era)?.label} era`}
              </div>
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: 14,
            }}>
              {paginated.map((person, i) => (
                <PersonCard key={person.id} person={person} index={i} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 8,
                marginTop: 36, flexWrap: 'wrap',
              }}>
                <PaginationButton
                  label="\u2190 Prev"
                  disabled={page <= 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('dots');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === 'dots' ? (
                      <span key={`dots-${idx}`} style={{ color: '#64748b', padding: '6px 4px', fontSize: 13 }}>...</span>
                    ) : (
                      <PaginationButton
                        key={item}
                        label={String(item)}
                        active={item === page}
                        onClick={() => { setPage(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      />
                    )
                  )}
                <PaginationButton
                  label="Next \u2192"
                  disabled={page >= totalPages}
                  onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Person Card
// ─────────────────────────────────────────────────────────────────────────────

function PersonCard({ person, index }: { person: PersonListItem; index: number }) {
  const eraColor = getEraColor(person.era);
  const snippet = person.description
    ? person.description.length > 120
      ? person.description.slice(0, 120) + '...'
      : person.description
    : null;

  const primaryRole = person.roles?.[0];
  const nationality = person.nationalities?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.25 }}
    >
      <Link
        to={`/people/${person.slug}`}
        style={{ textDecoration: 'none', display: 'block', height: '100%' }}
      >
        <div
          style={{
            padding: '18px 20px',
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.borderColor = eraColor + '44';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Name + years */}
          <div style={{ marginBottom: 8 }}>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#f1f5f9',
              lineHeight: 1.3,
              marginBottom: 4,
            }}>
              {person.name}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {formatYear(person.birth_year, person.birth_year_circa)}
              {' \u2013 '}
              {formatYear(person.death_year, person.death_year_circa)}
            </div>
          </div>

          {/* Tags row: role + nationality */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {primaryRole && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 10,
                backgroundColor: getRoleColor(primaryRole) + '22',
                border: `1px solid ${getRoleColor(primaryRole)}44`,
                color: getRoleColor(primaryRole),
                textTransform: 'capitalize',
              }}>
                {primaryRole}
              </span>
            )}
            {nationality && (
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
              }}>
                {nationality}
              </span>
            )}
          </div>

          {/* Description snippet */}
          {snippet && (
            <div style={{
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.5,
              flex: 1,
              marginBottom: 10,
            }}>
              {snippet}
            </div>
          )}

          {/* Bottom: event count + era badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
          }}>
            {/* Event count badge */}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 10,
              backgroundColor: person.event_count > 0 ? '#3b82f622' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${person.event_count > 0 ? '#3b82f644' : 'rgba(255,255,255,0.08)'}`,
              color: person.event_count > 0 ? '#60a5fa' : '#475569',
            }}>
              {person.event_count} event{person.event_count !== 1 ? 's' : ''}
            </span>

            {/* Era dot */}
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              color: eraColor,
              fontWeight: 500,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                backgroundColor: eraColor,
                display: 'inline-block',
              }} />
              {person.era === 'early-modern' ? 'Early Mod.' : person.era.charAt(0).toUpperCase() + person.era.slice(1)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pagination Button
// ─────────────────────────────────────────────────────────────────────────────

function PaginationButton({ label, active, disabled, onClick }: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        fontFamily: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        border: active ? '1px solid #3b82f666' : '1px solid rgba(255,255,255,0.08)',
        backgroundColor: active ? '#3b82f622' : 'rgba(255,255,255,0.04)',
        color: disabled ? '#475569' : active ? '#60a5fa' : '#94a3b8',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}
