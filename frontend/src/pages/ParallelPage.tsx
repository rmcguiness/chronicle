/**
 * ParallelPage — "Parallel History" comparison page.
 *
 * Route: /parallel
 *
 * Lets users compare two regions' timelines side-by-side, revealing what was
 * happening simultaneously across the world.
 *
 * Owns: page layout, API calls, state management for region/era selection.
 * Does NOT own: individual event card rendering, timeline column sync logic.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import axios from 'axios';
import ParallelTimeline from '../components/ParallelTimeline';
import type { ParallelEvent } from '../components/ParallelEventCard';

// ── Constants ────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

/** Minimum importance score for notable parallels detection. */
const NOTABLE_PARALLELS_MIN_IMPORTANCE = 0.7;

/** Maximum year gap for two events to be considered "simultaneous". */
const NOTABLE_PARALLELS_MAX_GAP_YEARS = 10;

/** Maximum notable parallels to display. */
const NOTABLE_PARALLELS_LIMIT = 5;

// ── Region options ───────────────────────────────────────────────────────────

interface RegionOption {
  value: string;
  label: string;
}

const REGION_OPTIONS: RegionOption[] = [
  { value: 'europe', label: 'Europe' },
  { value: 'americas', label: 'Americas' },
  { value: 'africa', label: 'Africa' },
  { value: 'asia', label: 'Asia' },
  { value: 'middle_east', label: 'Middle East' },
  { value: 'east_asia', label: 'East Asia' },
  { value: 'south_asia', label: 'South Asia' },
  { value: 'southeast_asia', label: 'Southeast Asia' },
  { value: 'oceania', label: 'Oceania' },
];

// ── Era presets ──────────────────────────────────────────────────────────────

interface EraPreset {
  label: string;
  startYear: number;
  endYear: number;
}

const PRESET_ERAS: EraPreset[] = [
  { label: 'Ancient World', startYear: -3000, endYear: 500 },
  { label: 'Medieval', startYear: 500, endYear: 1500 },
  { label: 'Early Modern', startYear: 1500, endYear: 1800 },
  { label: 'Industrial Age', startYear: 1800, endYear: 1900 },
  { label: 'Modern', startYear: 1900, endYear: 2000 },
];

// ── Pre-built comparisons ────────────────────────────────────────────────────

interface PrebuiltComparison {
  label: string;
  subtitle: string;
  region1: string;
  region2: string;
  startYear: number;
  endYear: number;
}

const PREBUILT_COMPARISONS: PrebuiltComparison[] = [
  { label: 'Rome meets Han Dynasty', subtitle: '500 BCE – 500 CE', region1: 'europe', region2: 'east_asia', startYear: -500, endYear: 500 },
  { label: 'Conquest of Americas', subtitle: '1400 – 1600', region1: 'europe', region2: 'americas', startYear: 1400, endYear: 1600 },
  { label: 'Islamic Expansion vs Carolingians', subtitle: '600 – 1100', region1: 'middle_east', region2: 'europe', startYear: 600, endYear: 1100 },
  { label: 'Mali Empire vs Renaissance', subtitle: '1300 – 1600', region1: 'africa', region2: 'europe', startYear: 1300, endYear: 1600 },
  { label: 'Maurya/Gupta vs Han/Three Kingdoms', subtitle: '200 BCE – 600 CE', region1: 'south_asia', region2: 'east_asia', startYear: -200, endYear: 600 },
  { label: 'Mongol Invasions', subtitle: '1200 – 1400', region1: 'europe', region2: 'asia', startYear: 1200, endYear: 1400 },
  { label: 'Independence Movements', subtitle: '1750 – 1850', region1: 'americas', region2: 'europe', startYear: 1750, endYear: 1850 },
  { label: 'Colonial Era + Resistance', subtitle: '1850 – 1950', region1: 'asia', region2: 'europe', startYear: 1850, endYear: 1950 },
];

// ── API types ────────────────────────────────────────────────────────────────

interface CrossLink {
  id: string;
  cause_event_id: string;
  effect_event_id: string;
  link_type: string | null;
  strength: number;
  description: string | null;
}

interface ParallelResponse {
  region1: ParallelEvent[];
  region2: ParallelEvent[];
  cross_links: CrossLink[];
}

/** Fetch parallel history data from the API. */
async function fetchParallel(
  region1: string, region2: string, startYear: number, endYear: number,
): Promise<ParallelResponse> {
  const { data } = await axios.get<ParallelResponse>(`${BASE_URL}/api/parallel`, {
    params: { region1, region2, startYear, endYear },
  });
  return data;
}

// ── Notable parallels detection ──────────────────────────────────────────────

interface NotableParallel {
  year: number;
  event1: ParallelEvent;
  event2: ParallelEvent;
}

/** Find pairs of high-importance events happening within 10 years of each other. */
function detectNotableParallels(r1: ParallelEvent[], r2: ParallelEvent[]): NotableParallel[] {
  const results: NotableParallel[] = [];
  const r1Important = r1.filter((e) => e.importance_score >= NOTABLE_PARALLELS_MIN_IMPORTANCE && e.year_approx !== null);
  const r2Important = r2.filter((e) => e.importance_score >= NOTABLE_PARALLELS_MIN_IMPORTANCE && e.year_approx !== null);

  for (const e1 of r1Important) {
    for (const e2 of r2Important) {
      const gap = Math.abs(e1.year_approx! - e2.year_approx!);
      if (gap <= NOTABLE_PARALLELS_MAX_GAP_YEARS) {
        results.push({ year: Math.round((e1.year_approx! + e2.year_approx!) / 2), event1: e1, event2: e2 });
      }
    }
  }
  results.sort((a, b) => (b.event1.importance_score + b.event2.importance_score) - (a.event1.importance_score + a.event2.importance_score));
  return results.slice(0, NOTABLE_PARALLELS_LIMIT);
}

function regionLabel(key: string): string {
  return REGION_OPTIONS.find((r) => r.value === key)?.label ?? key;
}

function fmtYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';

const selectStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.06)', color: '#e2e8f0',
  fontSize: '14px', outline: 'none', cursor: 'pointer', minWidth: '140px',
};

const cardBg = 'rgba(255,255,255,0.04)';

export default function ParallelPage() {
  const [region1, setRegion1] = useState('europe');
  const [region2, setRegion2] = useState('asia');
  const [startYear, setStartYear] = useState(-3000);
  const [endYear, setEndYear] = useState(2024);
  const [queryParams, setQueryParams] = useState<{ r1: string; r2: string; sy: number; ey: number } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['parallel', queryParams],
    queryFn: () => queryParams ? fetchParallel(queryParams.r1, queryParams.r2, queryParams.sy, queryParams.ey) : Promise.resolve(null),
    enabled: queryParams !== null,
    staleTime: 5 * 60 * 1000,
  });

  const notableParallels = useMemo(() => {
    if (!data) return [];
    return detectNotableParallels(data.region1, data.region2);
  }, [data]);

  const handleCompare = () => setQueryParams({ r1: region1, r2: region2, sy: startYear, ey: endYear });

  const applyPreset = (preset: PrebuiltComparison) => {
    setRegion1(preset.region1);
    setRegion2(preset.region2);
    setStartYear(preset.startYear);
    setEndYear(preset.endYear);
    setQueryParams({ r1: preset.region1, r2: preset.region2, sy: preset.startYear, ey: preset.endYear });
  };

  const applyEra = (era: EraPreset) => { setStartYear(era.startYear); setEndYear(era.endYear); };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '14px' }}>← Back to Chronicle</Link>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>|</span>
        <span style={{ fontWeight: 700, fontSize: '16px', color: '#fbbf24' }}>⚡ Parallel History</span>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', color: '#f8fafc' }}>Parallel History</h1>
          <p style={{ color: '#94a3b8', fontSize: '15px', margin: 0 }}>While one civilisation was rising, what was happening on the other side of the world?</p>
        </motion.div>

        {/* Section 1: Choose Regions & Era */}
        <section style={{ background: cardBg, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', color: '#f8fafc' }}>Choose Your Regions & Era</h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <select value={region1} onChange={(e) => setRegion1(e.target.value)} style={selectStyle} aria-label="Region 1">
              {REGION_OPTIONS.map((r) => <option key={r.value} value={r.value} style={{ background: '#1e293b' }}>{r.label}</option>)}
            </select>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>vs</span>
            <select value={region2} onChange={(e) => setRegion2(e.target.value)} style={selectStyle} aria-label="Region 2">
              {REGION_OPTIONS.map((r) => <option key={r.value} value={r.value} style={{ background: '#1e293b' }}>{r.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>From:</label>
            <input type="number" value={startYear} onChange={(e) => setStartYear(Number(e.target.value))} min={-3000} max={2024} style={{ ...selectStyle, width: '100px', minWidth: 'auto' }} aria-label="Start year" />
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>To:</label>
            <input type="number" value={endYear} onChange={(e) => setEndYear(Number(e.target.value))} min={-3000} max={2024} style={{ ...selectStyle, width: '100px', minWidth: 'auto' }} aria-label="End year" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {PRESET_ERAS.map((era) => (
              <button key={era.label} onClick={() => applyEra(era)} style={{
                padding: '5px 12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)',
                background: startYear === era.startYear && endYear === era.endYear ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: '#cbd5e1', fontSize: '12px', cursor: 'pointer',
              }}>{era.label}</button>
            ))}
          </div>

          <button onClick={handleCompare} style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}>Compare ⚡</button>
        </section>

        {/* Section 2: Timeline */}
        {isLoading && <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading parallel timeline…</div>}
        {error && <div style={{ textAlign: 'center', padding: '40px', color: '#f87171' }}>Failed to load data. Please try again.</div>}

        {data && queryParams && (
          <>
            <section style={{ background: cardBg, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', marginBottom: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', color: '#f8fafc' }}>Parallel Timeline</h2>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
                {data.region1.length} events in {regionLabel(queryParams.r1)} · {data.region2.length} events in {regionLabel(queryParams.r2)}
                {data.cross_links.length > 0 && <span> · {data.cross_links.length} cross-region connections</span>}
              </div>
              <ParallelTimeline
                region1Events={data.region1} region2Events={data.region2}
                crossLinks={data.cross_links}
                region1Label={regionLabel(queryParams.r1)} region2Label={regionLabel(queryParams.r2)}
              />
            </section>

            {/* Section 3: Notable Parallels */}
            {notableParallels.length > 0 && (
              <section style={{ background: cardBg, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', color: '#f8fafc' }}>🔗 Notable Parallels</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px' }}>High-importance events happening simultaneously in both regions:</p>
                {notableParallels.map((np, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', marginBottom: '8px', fontSize: '14px', lineHeight: 1.5 }}>
                    <span style={{ color: '#fbbf24', fontWeight: 700 }}>~{fmtYear(np.year)}</span>
                    <span style={{ color: '#94a3b8' }}>{' : '}</span>
                    <span style={{ color: '#60a5fa' }}>{np.event1.title}</span>
                    <span style={{ color: '#64748b' }}> — while — </span>
                    <span style={{ color: '#f472b6' }}>{np.event2.title}</span>
                  </motion.div>
                ))}
              </section>
            )}
          </>
        )}

        {/* Section 4: Pre-built Comparisons */}
        <section style={{ background: cardBg, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px', color: '#f8fafc' }}>🌍 Pre-built Comparisons</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {PREBUILT_COMPARISONS.map((preset) => (
              <motion.button key={preset.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(preset)} style={{
                  padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)', color: '#e2e8f0', textAlign: 'left', cursor: 'pointer',
                }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{preset.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{preset.subtitle}</div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
