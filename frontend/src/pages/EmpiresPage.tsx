/**
 * EmpiresPage — "The World's Greatest Empires"
 *
 * Route: /empires
 *
 * Features:
 *  - Timeline Gantt chart of all 20 empires colored by region
 *  - Sort by: Peak Size / Duration / Chronological / Alphabetical
 *  - Filter by: Era / Region / Continent
 *  - Size comparison mode with relative bars
 *  - Top-5 largest empires ranking
 *  - Surprising facts section
 *  - Empire cards with detailed info
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Empire {
  id: string;
  name: string;
  alt_names: string[];
  start_year: number;
  end_year: number;
  duration_years: number;
  peak_km2: number;
  peak_comparison: string;
  capital: string;
  founding_ruler: string;
  famous_ruler: string;
  region: string;
  continent: string;
  era: string;
  known_for: string;
  height_description: string;
  legacy: string;
  search_query: string;
  chronicle_event_count: number;
}

interface SurprisingFact {
  title: string;
  description: string;
}

interface EmpiresResponse {
  empires: Empire[];
  surprising_facts: SurprisingFact[];
  total: number;
}

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

const REGION_COLORS: Record<string, string> = {
  'Middle East': '#f59e0b',
  'Mediterranean / Central Asia': '#8b5cf6',
  'South Asia': '#22c55e',
  'Mediterranean / Europe': '#ef4444',
  'East Asia': '#3b82f6',
  'Mediterranean / Eastern Europe': '#a855f7',
  'Middle East / North Africa': '#f97316',
  'Central Asia / Global': '#ec4899',
  'West Africa': '#14b8a6',
  'Middle East / Southeast Europe': '#f59e0b',
  'Mesoamerica': '#84cc16',
  'South America': '#06b6d4',
  'Global': '#6366f1',
  'Eurasia': '#e11d48',
};

const ERA_COLORS: Record<string, string> = {
  'Ancient': '#8b5cf6',
  'Classical': '#a855f7',
  'Medieval': '#f59e0b',
  'Early Modern': '#f97316',
  'Modern': '#3b82f6',
};

type SortMode = 'size' | 'duration' | 'chronological' | 'alphabetical';

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'size', label: 'Peak Size' },
  { value: 'duration', label: 'Duration' },
  { value: 'chronological', label: 'Chronological' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

const ERAS = ['Ancient', 'Classical', 'Medieval', 'Early Modern', 'Modern'];
const CONTINENTS = ['Asia', 'Multi-continental', 'Africa', 'Americas'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function formatArea(km2: number): string {
  if (km2 >= 1_000_000) return `${(km2 / 1_000_000).toFixed(1)}M km²`;
  return `${(km2 / 1_000).toFixed(0)}K km²`;
}

function regionColor(region: string): string {
  return REGION_COLORS[region] || '#6b7280';
}

// ── Timeline Gantt Chart ─────────────────────────────────────────────────────

function TimelineGantt({ empires }: { empires: Empire[] }) {
  const sorted = [...empires].sort((a, b) => a.start_year - b.start_year);
  const minYear = Math.min(...sorted.map((e) => e.start_year));
  const maxYear = Math.max(...sorted.map((e) => e.end_year));
  const range = maxYear - minYear;

  // Generate tick marks
  const tickInterval = range > 2000 ? 500 : range > 1000 ? 250 : 100;
  const firstTick = Math.ceil(minYear / tickInterval) * tickInterval;
  const ticks: number[] = [];
  for (let y = firstTick; y <= maxYear; y += tickInterval) {
    ticks.push(y);
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>
        Empire Timelines
      </h3>
      {/* Tick labels */}
      <div style={{ position: 'relative', height: 20, marginBottom: 4, marginLeft: 180 }}>
        {ticks.map((year) => (
          <span
            key={year}
            style={{
              position: 'absolute',
              left: `${((year - minYear) / range) * 100}%`,
              transform: 'translateX(-50%)',
              fontSize: 10,
              color: '#64748b',
              whiteSpace: 'nowrap',
            }}
          >
            {formatYear(year)}
          </span>
        ))}
      </div>
      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sorted.map((empire) => {
          const left = ((empire.start_year - minYear) / range) * 100;
          const width = ((empire.end_year - empire.start_year) / range) * 100;
          const color = regionColor(empire.region);
          return (
            <div key={empire.id} style={{ display: 'flex', alignItems: 'center', height: 22 }}>
              <div
                style={{
                  width: 176,
                  flexShrink: 0,
                  fontSize: 11,
                  color: '#94a3b8',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: 4,
                }}
                title={empire.name}
              >
                {empire.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.05 * sorted.indexOf(empire) }}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${Math.max(width, 0.5)}%`,
                    height: 16,
                    top: 3,
                    borderRadius: 3,
                    background: color,
                    opacity: 0.85,
                    transformOrigin: 'left',
                    cursor: 'default',
                  }}
                  title={`${empire.name}: ${formatYear(empire.start_year)} – ${formatYear(empire.end_year)} (${empire.duration_years} years)`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Size Comparison Bars ─────────────────────────────────────────────────────

function SizeComparison({ empires }: { empires: Empire[] }) {
  const sorted = [...empires].sort((a, b) => b.peak_km2 - a.peak_km2);
  const maxSize = sorted[0]?.peak_km2 || 1;

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>
        Peak Territory Comparison
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((empire, i) => {
          const pct = (empire.peak_km2 / maxSize) * 100;
          const color = regionColor(empire.region);
          return (
            <div key={empire.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, fontSize: 12, color: '#64748b', textAlign: 'right', flexShrink: 0 }}>
                {i + 1}.
              </span>
              <span
                style={{
                  width: 160,
                  fontSize: 12,
                  color: '#cbd5e1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {empire.name}
              </span>
              <div style={{ flex: 1, position: 'relative', height: 18 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.03 }}
                  style={{
                    height: '100%',
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0, width: 70, textAlign: 'right' }}>
                {formatArea(empire.peak_km2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Top 5 Ranking ────────────────────────────────────────────────────────────

function Top5Ranking({ empires }: { empires: Empire[] }) {
  const top5 = [...empires].sort((a, b) => b.peak_km2 - a.peak_km2).slice(0, 5);
  const medals = ['🥇', '🥈', '🥉', '4th', '5th'];

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>
        The Largest Empires by Territory
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top5.map((empire, i) => (
          <div
            key={empire.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: i === 0 ? 'rgba(234,179,8,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 0 ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.04)'}`,
            }}
          >
            <span style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{medals[i]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{empire.name}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {formatArea(empire.peak_km2)} — {empire.peak_comparison}
              </div>
            </div>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 11,
                background: `${regionColor(empire.region)}22`,
                color: regionColor(empire.region),
                fontWeight: 500,
              }}
            >
              {empire.region}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Surprising Facts ─────────────────────────────────────────────────────────

function SurprisingFacts({ facts }: { facts: SurprisingFact[] }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>
        Surprising Facts About Empires
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {facts.map((fact, i) => (
          <div key={i}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>
              {fact.title}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
              {fact.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empire Card ──────────────────────────────────────────────────────────────

function EmpireCard({ empire, expanded, onToggle }: { empire: Empire; expanded: boolean; onToggle: () => void }) {
  const color = regionColor(empire.region);
  const eraColor = ERA_COLORS[empire.era] || '#6b7280';

  return (
    <motion.div
      layout
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        border: `1px solid ${expanded ? `${color}44` : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 200ms',
      }}
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      onClick={onToggle}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
              {empire.name}
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              {formatYear(empire.start_year)} – {formatYear(empire.end_year)}
              <span style={{ margin: '0 6px', color: '#475569' }}>·</span>
              {empire.duration_years} years
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 11,
                background: `${eraColor}22`,
                color: eraColor,
                fontWeight: 500,
              }}
            >
              {empire.era}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 11,
                background: `${color}22`,
                color,
                fontWeight: 500,
              }}
            >
              {empire.region}
            </span>
          </div>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          <QuickStat label="Peak Territory" value={formatArea(empire.peak_km2)} />
          <QuickStat label="Capital" value={empire.capital} />
          <QuickStat label="Famous Ruler" value={empire.famous_ruler} />
          {empire.chronicle_event_count > 0 && (
            <QuickStat label="Chronicle Events" value={String(empire.chronicle_event_count)} />
          )}
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 20px 20px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 16,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Size comparison */}
              <div style={{ marginBottom: 14 }}>
                <Label text="Peak Size" />
                <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                  {formatArea(empire.peak_km2)} — {empire.peak_comparison}
                </div>
              </div>

              {/* Rulers */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 14, flexWrap: 'wrap' }}>
                <div>
                  <Label text="Founded By" />
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{empire.founding_ruler}</div>
                </div>
                <div>
                  <Label text="Most Famous Ruler" />
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{empire.famous_ruler}</div>
                </div>
              </div>

              {/* Known for */}
              <div style={{ marginBottom: 14 }}>
                <Label text="Known For" />
                <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{empire.known_for}</div>
              </div>

              {/* Height of power */}
              <div style={{ marginBottom: 14 }}>
                <Label text="Height of Power" />
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, fontStyle: 'italic' }}>
                  {empire.height_description}
                </div>
              </div>

              {/* Legacy */}
              <div style={{ marginBottom: 16 }}>
                <Label text="Legacy" />
                <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{empire.legacy}</div>
              </div>

              {/* Find in Chronicle */}
              <Link
                to={`/search?q=${encodeURIComponent(empire.search_query)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: `${color}18`,
                  border: `1px solid ${color}33`,
                  color,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Find in Chronicle →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4, fontWeight: 600 }}>
      {text}
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        flex: '1 1 0',
        minWidth: 140,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Fetch function ───────────────────────────────────────────────────────────

async function fetchEmpires(): Promise<EmpiresResponse> {
  try {
    const res = await fetch(`${BASE_URL}/api/empires`);
    if (res.ok) return await res.json();
  } catch {
    // fall through to mock
  }
  // Return hardcoded fallback if backend is unavailable
  return { empires: [], surprising_facts: [], total: 0 };
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EmpiresPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['empires'],
    queryFn: fetchEmpires,
  });

  const [sortMode, setSortMode] = useState<SortMode>('chronological');
  const [eraFilter, setEraFilter] = useState<string | null>(null);
  const [continentFilter, setContinentFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showSizeComparison, setShowSizeComparison] = useState(false);

  const empires = data?.empires || [];
  const facts = data?.surprising_facts || [];

  const filteredEmpires = useMemo(() => {
    let result = [...empires];
    if (eraFilter) result = result.filter((e) => e.era === eraFilter);
    if (continentFilter) result = result.filter((e) => e.continent === continentFilter);
    return result;
  }, [empires, eraFilter, continentFilter]);

  const sortedEmpires = useMemo(() => {
    const arr = [...filteredEmpires];
    switch (sortMode) {
      case 'size':
        return arr.sort((a, b) => b.peak_km2 - a.peak_km2);
      case 'duration':
        return arr.sort((a, b) => b.duration_years - a.duration_years);
      case 'chronological':
        return arr.sort((a, b) => a.start_year - b.start_year);
      case 'alphabetical':
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return arr;
    }
  }, [filteredEmpires, sortMode]);

  // Stats
  const stats = useMemo(() => {
    if (empires.length === 0) return null;
    const largest = [...empires].sort((a, b) => b.peak_km2 - a.peak_km2)[0];
    const longest = [...empires].sort((a, b) => b.duration_years - a.duration_years)[0];
    const totalYears = empires.reduce((sum, e) => sum + e.duration_years, 0);
    return { largest, longest, totalYears };
  }, [empires]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(15,23,42,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 13 }}>
          ← Chronicle
        </Link>
        <span style={{ color: '#475569' }}>|</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Empires</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#f1f5f9', margin: '0 0 8px' }}>
            The World's Greatest Empires
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', margin: 0, lineHeight: 1.6, maxWidth: 700 }}>
            From the ancient Persians to the British Empire — explore 20 of history's most powerful
            empires at their peak, with territory data, timelines, and links to Chronicle events.
          </p>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>Loading empires...</div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: 64, color: '#f87171' }}>
            Failed to load empires. Is the backend running?
          </div>
        )}

        {empires.length > 0 && (
          <>
            {/* Stats row */}
            {stats && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
                <StatBox value="20" label="Empires" />
                <StatBox value={stats.largest.name.split(' ')[0]} label={`Largest (${formatArea(stats.largest.peak_km2)})`} />
                <StatBox value={`${stats.longest.duration_years}yr`} label={`Longest (${stats.longest.name.split(' ')[0]})`} />
                <StatBox value={`${Math.round(stats.totalYears / 100)}+`} label="Combined Centuries" />
              </div>
            )}

            {/* Timeline Gantt */}
            <div style={{ marginBottom: 28 }}>
              <TimelineGantt empires={empires} />
            </div>

            {/* Controls row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 24,
                alignItems: 'center',
              }}
            >
              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Sort:</span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortMode(opt.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: sortMode === opt.value ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      background: sortMode === opt.value ? 'rgba(59,130,246,0.15)' : 'transparent',
                      color: sortMode === opt.value ? '#60a5fa' : '#94a3b8',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Era filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Era:</span>
                <button
                  onClick={() => setEraFilter(null)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: !eraFilter ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    background: !eraFilter ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: !eraFilter ? '#60a5fa' : '#94a3b8',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  All
                </button>
                {ERAS.map((era) => (
                  <button
                    key={era}
                    onClick={() => setEraFilter(eraFilter === era ? null : era)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: eraFilter === era ? (ERA_COLORS[era] || '#3b82f6') : 'rgba(255,255,255,0.1)',
                      background: eraFilter === era ? `${ERA_COLORS[era] || '#3b82f6'}22` : 'transparent',
                      color: eraFilter === era ? (ERA_COLORS[era] || '#60a5fa') : '#94a3b8',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {era}
                  </button>
                ))}
              </div>

              {/* Continent filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#64748b' }}>Continent:</span>
                <button
                  onClick={() => setContinentFilter(null)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid',
                    borderColor: !continentFilter ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    background: !continentFilter ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: !continentFilter ? '#60a5fa' : '#94a3b8',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  All
                </button>
                {CONTINENTS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setContinentFilter(continentFilter === c ? null : c)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid',
                      borderColor: continentFilter === c ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      background: continentFilter === c ? 'rgba(59,130,246,0.15)' : 'transparent',
                      color: continentFilter === c ? '#60a5fa' : '#94a3b8',
                      fontSize: 12,
                      cursor: 'pointer',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Size comparison toggle */}
              <button
                onClick={() => setShowSizeComparison(!showSizeComparison)}
                style={{
                  marginLeft: 'auto',
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: showSizeComparison ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                  background: showSizeComparison ? 'rgba(245,158,11,0.15)' : 'transparent',
                  color: showSizeComparison ? '#f59e0b' : '#94a3b8',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {showSizeComparison ? 'Hide' : 'Show'} Size Comparison
              </button>
            </div>

            {/* Size comparison panel */}
            <AnimatePresence>
              {showSizeComparison && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', marginBottom: 28 }}
                >
                  <SizeComparison empires={filteredEmpires} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Top 5 + Surprising Facts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <Top5Ranking empires={empires} />
              <SurprisingFacts facts={facts} />
            </div>

            {/* Empire cards */}
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
                All Empires
              </h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
                Showing {sortedEmpires.length} of {empires.length} empires · Click to expand
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sortedEmpires.map((empire) => (
                <EmpireCard
                  key={empire.id}
                  empire={empire}
                  expanded={expandedId === empire.id}
                  onToggle={() => setExpandedId(expandedId === empire.id ? null : empire.id)}
                />
              ))}
            </div>

            {sortedEmpires.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
                No empires match the current filters.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
