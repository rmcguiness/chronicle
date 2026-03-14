/**
 * PeopleDirectoryPage — gallery grid of all historical figures.
 *
 * Route: /people
 *
 * Features:
 *  - Grid of person cards (name, dates, role, event count, influence)
 *  - Filters: era, region, role category
 *  - Sort: influence score, birth year, alphabetical
 *  - Client-side search input
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchPeople } from '../api/client';
import type { PersonSummary } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Style constants
// ─────────────────────────────────────────────────────────────────────────────

const BG = '#070e22';
const BG_CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#8b5cf6';
const ACCENT_BG = 'rgba(139,92,246,0.15)';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format life span as "birth - death". */
function lifeSpan(p: PersonSummary): string {
  const b = p.birth_year_display ?? '?';
  const d = p.death_year_display ?? '?';
  if (b === '?' && d === '?') return 'Dates unknown';
  return `${b} \u2013 ${d}`;
}

/** Influence score colour. */
function influenceColor(score: number): string {
  if (score >= 0.8) return '#22c55e';
  if (score >= 0.6) return '#f59e0b';
  if (score >= 0.4) return '#3b82f6';
  return '#6b7280';
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter / sort options
// ─────────────────────────────────────────────────────────────────────────────

const ERA_OPTIONS = [
  { value: '', label: 'All eras' },
  { value: 'ancient', label: 'Ancient (< 500 CE)' },
  { value: 'medieval', label: 'Medieval (500-1500)' },
  { value: 'early-modern', label: 'Early Modern (1500-1800)' },
  { value: 'modern', label: 'Modern (1800+)' },
];

const SORT_OPTIONS = [
  { value: 'influence', label: 'Influence' },
  { value: 'birth_year', label: 'Birth Year' },
  { value: 'name', label: 'Alphabetical' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Styled select dropdown. */
function FilterSelect({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '7px 12px', borderRadius: 6, fontSize: 13,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: `1px solid ${BORDER}`, color: TEXT_SECONDARY,
        cursor: 'pointer', outline: 'none',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/** Single person card in the grid. */
function PersonCard({ person, index }: { person: PersonSummary; index: number }) {
  const infColor = influenceColor(person.influence_score);
  const infPct = Math.round(person.influence_score * 100);
  const primaryRole = person.roles[0] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
    >
      <Link
        to={`/people/${person.slug}`}
        style={{
          display: 'block', textDecoration: 'none',
          padding: '18px 20px', borderRadius: 12,
          backgroundColor: BG_CARD, border: `1px solid ${BORDER}`,
          transition: 'border-color 0.15s, transform 0.15s',
          height: '100%',
        }}
      >
        {/* Name */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4, lineHeight: 1.3 }}>
          {person.name}
        </h3>

        {/* Dates */}
        <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 10 }}>
          {lifeSpan(person)}
        </div>

        {/* Role badge */}
        {primaryRole && (
          <span
            style={{
              display: 'inline-block', fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 4, marginBottom: 10,
              backgroundColor: ACCENT_BG, color: ACCENT,
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}
          >
            {primaryRole}
          </span>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: TEXT_SECONDARY }}>
            {person.event_count} event{person.event_count !== 1 ? 's' : ''}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}>
              <div style={{ width: `${infPct}%`, height: '100%', borderRadius: 2, backgroundColor: infColor }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: infColor }}>{infPct}</span>
          </div>
        </div>

        {/* Nationality */}
        {person.nationalities[0] && (
          <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6 }}>
            {person.nationalities.slice(0, 2).join(', ')}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PeopleDirectoryPage — searchable, filterable grid of all historical figures.
 */
export default function PeopleDirectoryPage() {
  const [search, setSearch] = useState('');
  const [era, setEra] = useState('');
  const [sort, setSort] = useState('influence');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['people', era, sort],
    queryFn: () => fetchPeople({ sort, era: era || undefined }),
    staleTime: 5 * 60 * 1000,
  });

  const people = data?.people ?? [];
  const total = data?.total ?? 0;

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return people;
    const q = search.toLowerCase();
    return people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.roles.some((r) => r.toLowerCase().includes(q)) ||
        p.nationalities.some((n) => n.toLowerCase().includes(q)) ||
        (p.description?.toLowerCase().includes(q) ?? false)
    );
  }, [people, search]);

  // Extract unique roles for display
  const roleSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of people) {
      for (const r of p.roles) s.add(r);
    }
    return Array.from(s).sort();
  }, [people]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: BG,
        color: TEXT_PRIMARY,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '40px 32px 24px',
          borderBottom: `1px solid ${BORDER}`,
          background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${ACCENT}10 100%)`,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: TEXT_MUTED, textDecoration: 'none',
            padding: '6px 12px', borderRadius: 6, marginBottom: 24,
            border: `1px solid ${BORDER}`, backgroundColor: BG_CARD,
          }}
        >
          \u2190 Back to Timeline
        </Link>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 8, color: TEXT_PRIMARY }}>
          Historical Figures
        </h1>
        <p style={{ fontSize: 14, color: TEXT_SECONDARY, marginBottom: 20 }}>
          {total} people across all eras of history
        </p>

        {/* Controls row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 14,
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BORDER}`, color: TEXT_PRIMARY,
              outline: 'none', width: 220,
            }}
          />

          <FilterSelect value={era} onChange={setEra} options={ERA_OPTIONS} />
          <FilterSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />

          <span style={{ fontSize: 12, color: TEXT_MUTED, marginLeft: 'auto' }}>
            Showing {filtered.length} of {total}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '24px 32px 60px' }}>
        {isLoading && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ textAlign: 'center', padding: 40, color: TEXT_MUTED, fontSize: 15 }}
          >
            Loading people...
          </motion.div>
        )}

        {isError && (
          <div style={{ textAlign: 'center', padding: 40, color: '#ef4444' }}>
            Failed to load people. Is the backend running?
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: TEXT_MUTED }}>
            No people found matching your filters.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {filtered.map((p, i) => (
            <PersonCard key={p.id} person={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
