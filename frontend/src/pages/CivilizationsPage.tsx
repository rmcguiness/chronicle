/**
 * CivilizationsPage — "Civilizations at a Glance" interactive explorer.
 *
 * Owns: century slider, Play History animation, region grid, timeline chart,
 *       and "Simultaneous Giants" fun-facts section.
 * Does NOT own: civilization data (see data/civilizations-data.ts),
 *       individual card rendering (see components/CivilizationCard.tsx).
 *
 * Route: /civilizations
 */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CIVILIZATIONS,
  SIMULTANEOUS_FACTS,
  MIN_CENTURY,
  MAX_CENTURY,
  CENTURY_STEP,
  PLAY_INTERVAL_MS,
} from '../data/civilizations-data';
import type { Region } from '../data/civilizations-data';
import CivilizationCard from '../components/CivilizationCard';
import CivilizationTimeline from '../components/CivilizationTimeline';

/** Ordered list of regions for the grid layout. */
const REGION_ORDER: Region[] = ['europe', 'middle_east', 'africa', 'asia', 'americas', 'oceania'];

/**
 * Formats a century value for prominent display.
 * -500 → "500 BCE", 0 → "1 CE", 100 → "100 CE"
 */
function formatCentury(century: number): string {
  if (century < 0) return `${Math.abs(century)} BCE`;
  if (century === 0) return '1 CE';
  return `${century} CE`;
}

/**
 * Returns civilizations active during a given century.
 * A civilization is "active" if its startYear < century + 100 AND endYear > century.
 */
function getCivsForCentury(century: number) {
  return CIVILIZATIONS.filter(
    c => c.startYear < century + CENTURY_STEP && c.endYear > century
  );
}

/**
 * Main page component for the Civilizations at a Glance feature.
 */
export default function CivilizationsPage() {
  const [century, setCentury] = useState<number>(-500);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Active civilizations for the current century, grouped by region. */
  const activeCivs = useMemo(() => getCivsForCentury(century), [century]);

  const civsByRegion = useMemo(() => {
    const map = new Map<Region, typeof activeCivs>();
    for (const region of REGION_ORDER) {
      map.set(region, activeCivs.filter(c => c.region === region));
    }
    return map;
  }, [activeCivs]);

  /** Play/pause animation. */
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  /** Handle play animation. */
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCentury(prev => {
          if (prev >= MAX_CENTURY) {
            setIsPlaying(false);
            return prev;
          }
          return prev + CENTURY_STEP;
        });
      }, PLAY_INTERVAL_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  /** Handle slider change. */
  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCentury(val);
    setIsPlaying(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1e',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      padding: '24px 24px 80px',
      overflowY: 'auto',
    }}>
      {/* Header / nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Link to="/" style={{
          color: '#94a3b8', textDecoration: 'none', fontSize: 14,
          padding: '6px 12px', borderRadius: 8,
          border: '1px solid rgba(148,163,184,0.2)',
          transition: 'border-color 0.2s',
        }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
          🌍 Civilizations at a Glance
        </h1>
      </div>

      {/* ── SECTION 1: Century Slider ── */}
      <section style={{
        backgroundColor: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        textAlign: 'center',
      }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 32, fontWeight: 300, color: '#a5b4fc' }}>
          The World in {formatCentury(century)}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 20px' }}>
          {activeCivs.length} civilization{activeCivs.length !== 1 ? 's' : ''} active
        </p>

        {/* Slider */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 8px' }}>
          <input
            type="range"
            min={MIN_CENTURY}
            max={MAX_CENTURY}
            step={CENTURY_STEP}
            value={century}
            onChange={onSliderChange}
            style={{
              width: '100%',
              accentColor: '#6366f1',
              height: 8,
              cursor: 'pointer',
            }}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: '#64748b', marginTop: 4,
          }}>
            <span>3000 BCE</span>
            <span>2000 BCE</span>
            <span>1000 BCE</span>
            <span>1 CE</span>
            <span>1000 CE</span>
            <span>2000 CE</span>
          </div>
        </div>

        {/* Play button */}
        <button
          onClick={togglePlay}
          style={{
            marginTop: 16,
            padding: '10px 28px',
            borderRadius: 24,
            border: 'none',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: isPlaying ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)',
            color: isPlaying ? '#fca5a5' : '#a5b4fc',
            transition: 'all 0.2s',
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play History'}
        </button>
      </section>

      {/* ── SECTION 2: Active Civilizations Grid ── */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#cbd5e1' }}>
          Active Civilizations
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {REGION_ORDER.map(region => (
            <CivilizationCard
              key={region}
              region={region}
              activeCivs={civsByRegion.get(region) ?? []}
              selectedCentury={century}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION 3: Timeline Bar Chart ── */}
      <section style={{
        backgroundColor: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 48,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: '#cbd5e1' }}>
          Civilization Timeline
        </h2>
        <CivilizationTimeline civilizations={CIVILIZATIONS} />
      </section>

      {/* ── SECTION 4: Simultaneous Giants ── */}
      <section style={{
        backgroundColor: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: 16,
        padding: 24,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4, color: '#fbbf24' }}>
          ⚡ Simultaneous Giants
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 20px' }}>
          Did you know these empires existed at the same time?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SIMULTANEOUS_FACTS.map(fact => (
            <div key={fact.title} style={{
              padding: 16,
              borderRadius: 12,
              backgroundColor: 'rgba(251,191,36,0.06)',
              borderLeft: '3px solid #fbbf24',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
                  {fact.title}
                </h3>
                <button
                  onClick={() => { setCentury(fact.century); setIsPlaying(false); }}
                  style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 6,
                    border: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'transparent',
                    color: '#fbbf24', fontSize: 11, cursor: 'pointer',
                  }}
                >
                  Jump to era →
                </button>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(203,213,225,0.8)', lineHeight: 1.5 }}>
                {fact.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
