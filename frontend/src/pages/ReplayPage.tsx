/**
 * ReplayPage — animated timeline replay at /replay.
 *
 * Events appear chronologically as a time scrubber advances, with smooth
 * CSS transitions. Controls: play/pause, speed selector, era jumps, reset.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchReplayEvents, type ReplayEvent } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MIN_YEAR = -3500;
const MAX_YEAR = 2025;

/** Speed presets: label → milliseconds per century tick. */
const SPEED_PRESETS: { label: string; ms: number }[] = [
  { label: '1×', ms: 3000 },
  { label: '5×', ms: 600 },
  { label: '10×', ms: 300 },
  { label: '50×', ms: 60 },
];

interface Era {
  name: string;
  start: number;
  end: number;
  icon: string;
}

const ERAS: Era[] = [
  { name: 'Ancient', start: -3500, end: -800, icon: '🏺' },
  { name: 'Classical', start: -800, end: 500, icon: '🏛️' },
  { name: 'Medieval', start: 500, end: 1500, icon: '⚔️' },
  { name: 'Early Modern', start: 1500, end: 1800, icon: '🔭' },
  { name: 'Modern', start: 1800, end: 2025, icon: '🌍' },
];

/** Get the era for a given year. */
function getEra(year: number): Era {
  for (const era of ERAS) {
    if (year >= era.start && year < era.end) return era;
  }
  return ERAS[ERAS.length - 1];
}

/** Format a year for display: "1453 CE" or "450 BCE". */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 BCE';
  return `${year} CE`;
}

/** Generate 1–5 star string for importance. */
function importanceStars(score: number): string {
  const count = Math.max(1, Math.min(5, Math.round(score * 5)));
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function ReplayPage() {
  // All events loaded so far (sorted by year_approx)
  const [allEvents, setAllEvents] = useState<ReplayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const loadedOffset = useRef(0);

  // Replay state
  const [currentYear, setCurrentYear] = useState(MIN_YEAR);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [discoveredCount, setDiscoveredCount] = useState(0);

  // Era transition banner
  const [eraBanner, setEraBanner] = useState<Era | null>(null);
  const eraBannerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevEraRef = useRef<string>(getEra(MIN_YEAR).name);

  // Visible feed (last 8 events)
  const [visibleEvents, setVisibleEvents] = useState<ReplayEvent[]>([]);
  const discoveredRef = useRef(0);

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load events ─────────────────────────────────────────────────────────
  const loadEvents = useCallback(async (offset: number) => {
    try {
      const resp = await fetchReplayEvents(MIN_YEAR, MAX_YEAR, 500, offset);
      setAllEvents((prev) => {
        // Deduplicate by id
        const ids = new Set(prev.map((e) => e.id));
        const newEvents = resp.events.filter((e) => !ids.has(e.id));
        return [...prev, ...newEvents];
      });
      setHasMore(resp.has_more);
      loadedOffset.current = offset + resp.events.length;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(0);
  }, [loadEvents]);

  // ── Advance year on play ────────────────────────────────────────────────
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!playing) return;

    const speed = SPEED_PRESETS[speedIdx];
    // Each tick = 1 century advancement. Interval = speed.ms
    // But we step by a variable amount based on speed:
    // At 1x: 100 years per tick (1 century / 3s)
    // We always step 100 years; the interval controls speed.
    const step = 100;

    timerRef.current = setInterval(() => {
      setCurrentYear((prev) => {
        const next = prev + step;
        if (next > MAX_YEAR) {
          setPlaying(false);
          return MAX_YEAR;
        }
        return next;
      });
    }, speed.ms);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speedIdx]);

  // ── Update visible events as year advances ──────────────────────────────
  useEffect(() => {
    const visible = allEvents.filter((e) => e.year_approx <= currentYear);
    const count = visible.length;
    discoveredRef.current = count;
    setDiscoveredCount(count);
    // Show last 8
    setVisibleEvents(visible.slice(-8));

    // Load more if we're getting close to the end of loaded data
    if (hasMore && visible.length > allEvents.length - 50) {
      loadEvents(loadedOffset.current);
    }

    // Era transition check
    const currentEra = getEra(currentYear);
    if (currentEra.name !== prevEraRef.current) {
      prevEraRef.current = currentEra.name;
      setEraBanner(currentEra);
      if (eraBannerTimeout.current) clearTimeout(eraBannerTimeout.current);
      eraBannerTimeout.current = setTimeout(() => setEraBanner(null), 3000);
    }
  }, [currentYear, allEvents, hasMore, loadEvents]);

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setPlaying(false);
    setCurrentYear(MIN_YEAR);
    setVisibleEvents([]);
    discoveredRef.current = 0;
    setDiscoveredCount(0);
    prevEraRef.current = getEra(MIN_YEAR).name;
  };

  const handleEraJump = (era: Era) => {
    setCurrentYear(era.start);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentYear(Number(e.target.value));
  };

  const currentEra = getEra(currentYear);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #111827 100%)',
        color: '#f3f4f6',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#9ca3af',
            textDecoration: 'none',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back to Timeline
        </Link>
        <h1
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#d1d5db',
          }}
        >
          Timeline Replay
        </h1>
        <div style={{ width: 120 }} /> {/* spacer */}
      </header>

      {/* ── "Now Playing" header ────────────────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          padding: '32px 24px 16px',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {currentEra.icon} {currentEra.name} Era
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #f9fafb 0%, #9ca3af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {formatYear(currentYear)}
        </div>
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          {discoveredCount} event{discoveredCount !== 1 ? 's' : ''} discovered
        </div>
      </div>

      {/* ── Era transition banner ───────────────────────────────────────── */}
      {eraBanner && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            border: '2px solid rgba(251,191,36,0.6)',
            borderRadius: 16,
            padding: '24px 48px',
            textAlign: 'center',
            animation: 'fadeInOut 3s ease-in-out',
          }}
        >
          <div style={{ fontSize: 40 }}>{eraBanner.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, color: '#fbbf24' }}>
            Entering the {eraBanner.name} Era
          </div>
        </div>
      )}

      {/* ── Event feed ──────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 16,
          minHeight: 0,
        }}
      >
        {loading && allEvents.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40, fontSize: 15 }}>
            Loading events…
          </div>
        ) : visibleEvents.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: 40, fontSize: 15 }}>
            Press Play to begin the replay
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visibleEvents.map((event, idx) => {
              const isMajor = event.importance_score > 0.8;
              const catColor = event.category
                ? CATEGORY_COLORS[event.category as EventCategory] ?? '#6b7280'
                : '#6b7280';
              const isNewest = idx === visibleEvents.length - 1;
              return (
                <Link
                  key={event.id}
                  to={`/event/${event.slug}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    opacity: isNewest ? 1 : 0.5 + (idx / visibleEvents.length) * 0.5,
                    transition: 'opacity 0.5s ease, transform 0.4s ease',
                    transform: isNewest ? 'translateX(0)' : undefined,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: isMajor ? '16px 20px' : '12px 16px',
                      background: isMajor
                        ? 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 100%)'
                        : 'rgba(255,255,255,0.04)',
                      border: isMajor
                        ? '1.5px solid rgba(251,191,36,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {/* Year */}
                    <div
                      style={{
                        minWidth: 90,
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#9ca3af',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatYear(event.year_approx)}
                    </div>

                    {/* Category badge */}
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: `${catColor}22`,
                        color: catColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.category
                        ? CATEGORY_ICONS[event.category as EventCategory] ?? ''
                        : ''}{' '}
                      {event.category
                        ? CATEGORY_LABELS[event.category as EventCategory] ?? event.category
                        : 'Unknown'}
                    </div>

                    {/* Title + region */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: isMajor ? 16 : 14,
                          fontWeight: isMajor ? 700 : 500,
                          color: isMajor ? '#fbbf24' : '#f3f4f6',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {event.title}
                      </div>
                      {event.geo_modern && (
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                          {event.geo_modern}
                        </div>
                      )}
                    </div>

                    {/* Importance stars */}
                    <div
                      style={{
                        fontSize: 13,
                        color: isMajor ? '#fbbf24' : '#4b5563',
                        whiteSpace: 'nowrap',
                        letterSpacing: 1,
                      }}
                    >
                      {importanceStars(event.importance_score)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Controls bar ────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.4)',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: '#6b7280', minWidth: 60 }}>
            {formatYear(MIN_YEAR)}
          </span>
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={currentYear}
            onChange={handleScrub}
            style={{
              flex: 1,
              accentColor: '#fbbf24',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 11, color: '#6b7280', minWidth: 60, textAlign: 'right' }}>
            {formatYear(MAX_YEAR)}
          </span>
        </div>

        {/* Buttons row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Play / Pause */}
          <button
            onClick={() => setPlaying((p) => !p)}
            style={{
              background: playing ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
              border: `1px solid ${playing ? 'rgba(239,68,68,0.5)' : 'rgba(34,197,94,0.5)'}`,
              color: playing ? '#ef4444' : '#22c55e',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 80,
            }}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>

          {/* Speed selector */}
          <div style={{ display: 'flex', gap: 4 }}>
            {SPEED_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                onClick={() => setSpeedIdx(idx)}
                style={{
                  background: idx === speedIdx ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${idx === speedIdx ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: idx === speedIdx ? '#fbbf24' : '#9ca3af',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

          {/* Era jumps */}
          {ERAS.map((era) => (
            <button
              key={era.name}
              onClick={() => handleEraJump(era)}
              style={{
                background:
                  currentEra.name === era.name
                    ? 'rgba(99,102,241,0.2)'
                    : 'rgba(255,255,255,0.05)',
                border: `1px solid ${currentEra.name === era.name ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: currentEra.name === era.name ? '#818cf8' : '#6b7280',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {era.name}
            </button>
          ))}

          {/* Separator */}
          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />

          {/* Reset */}
          <button
            onClick={handleReset}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* ── CSS animation for era banner ────────────────────────────────── */}
      <style>{`
        @keyframes fadeInOut {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
          15%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80%  { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
