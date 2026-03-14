/**
 * CivilizationsPage — explore and compare major world civilizations.
 *
 * Grid of civilization cards with compare functionality.
 * Selecting exactly 2 civilizations opens a comparison modal.
 */
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

// ── Types ───────────────────────────────────────────────────────────

/** A top event within a civilization's timespan. */
interface TopEvent {
  slug: string;
  title: string;
  year_approx: number | null;
  importance_score: number;
}

/** Civilization card data from the API. */
interface Civilization {
  id: string;
  name: string;
  region: string;
  start_year: number;
  end_year: number;
  color_accent: string;
  description: string;
  key_events_count: number;
  most_important_event: TopEvent | null;
  top_events: TopEvent[];
}

/** Shared event during overlapping era. */
interface SharedEvent {
  slug: string;
  title: string;
  year_approx: number | null;
  importance_score: number;
  geo_modern: string | null;
}

/** Comparison response from the API. */
interface ComparisonData {
  a: Civilization;
  b: Civilization;
  shared_era_events: SharedEvent[];
  overlap_start: number | null;
  overlap_end: number | null;
}

// ── Constants ───────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BG_COLOR = '#070e22';
const CARD_BG = 'rgba(255, 255, 255, 0.04)';
const CARD_BG_HOVER = 'rgba(255, 255, 255, 0.07)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';
const CARD_BORDER_SELECTED = 'rgba(59, 130, 246, 0.6)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const MODAL_OVERLAY = 'rgba(0, 0, 0, 0.7)';
const MODAL_BG = '#0f172a';
const BADGE_BG = 'rgba(255, 255, 255, 0.08)';

const REGION_COLORS: Record<string, string> = {
  'Middle East': '#f59e0b',
  'Africa': '#eab308',
  'Europe': '#3b82f6',
  'Asia': '#f97316',
  'Americas': '#d946ef',
  'Europe/Middle East': '#8b5cf6',
  'Middle East/Europe': '#059669',
};

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Formats a year for display, converting negative years to BCE notation.
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/**
 * Formats a timespan string from start/end years.
 */
function formatTimespan(start: number, end: number): string {
  return `${formatYear(start)} \u2013 ${formatYear(end)}`;
}

/**
 * Fetches the list of civilizations from the API.
 */
async function fetchCivilizations(): Promise<Civilization[]> {
  const res = await fetch(`${API_BASE}/api/civilizations`);
  if (!res.ok) throw new Error(`Failed to fetch civilizations: ${res.status}`);
  const data = await res.json();
  return data.civilizations;
}

/**
 * Fetches comparison data for two civilizations.
 */
async function fetchComparison(a: string, b: string): Promise<ComparisonData> {
  const res = await fetch(
    `${API_BASE}/api/civilizations/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch comparison: ${res.status}`);
  return res.json();
}

// ── Sub-components ──────────────────────────────────────────────────

/**
 * RegionBadge — colored badge showing civilization's region.
 */
function RegionBadge({ region }: { region: string }) {
  const color = REGION_COLORS[region] || '#64748b';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {region}
    </span>
  );
}

/**
 * CivilizationCard — displays a single civilization in the grid.
 */
function CivilizationCard({
  civ,
  selected,
  onToggle,
  compareCount,
}: {
  civ: Civilization;
  selected: boolean;
  onToggle: () => void;
  compareCount: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: hovered ? CARD_BG_HOVER : CARD_BG,
        border: `1px solid ${selected ? CARD_BORDER_SELECTED : CARD_BORDER}`,
        borderRadius: 12,
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        borderLeft: `3px solid ${civ.color_accent}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {/* Selection indicator */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          &#10003;
        </div>
      )}

      {/* Header */}
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: TEXT_PRIMARY,
          margin: '0 0 6px 0',
          paddingRight: selected ? 32 : 0,
        }}
      >
        {civ.name}
      </h3>

      {/* Timespan */}
      <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 10 }}>
        {formatTimespan(civ.start_year, civ.end_year)}
      </div>

      {/* Region + event count row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <RegionBadge region={civ.region} />
        <span style={{ fontSize: 12, color: TEXT_MUTED }}>
          {civ.key_events_count} event{civ.key_events_count !== 1 ? 's' : ''} in DB
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 13,
          color: TEXT_SECONDARY,
          lineHeight: 1.5,
          margin: '0 0 14px 0',
        }}
      >
        {civ.description}
      </p>

      {/* Key achievement */}
      {civ.most_important_event && (
        <div
          style={{
            fontSize: 12,
            color: TEXT_MUTED,
            padding: '8px 12px',
            background: BADGE_BG,
            borderRadius: 8,
          }}
        >
          <span style={{ color: TEXT_SECONDARY, fontWeight: 500 }}>Top event: </span>
          {civ.most_important_event.title}
          {civ.most_important_event.year_approx != null && (
            <span style={{ color: TEXT_MUTED }}>
              {' '}({formatYear(civ.most_important_event.year_approx)})
            </span>
          )}
        </div>
      )}

      {/* Compare button */}
      <button
        style={{
          marginTop: 14,
          padding: '6px 16px',
          borderRadius: 8,
          border: selected
            ? '1px solid #3b82f6'
            : '1px solid rgba(255, 255, 255, 0.15)',
          background: selected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
          color: selected ? '#60a5fa' : TEXT_SECONDARY,
          fontSize: 13,
          fontWeight: 500,
          cursor: compareCount >= 2 && !selected ? 'not-allowed' : 'pointer',
          opacity: compareCount >= 2 && !selected ? 0.4 : 1,
          transition: 'all 0.15s ease',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        disabled={compareCount >= 2 && !selected}
      >
        {selected ? 'Selected' : 'Compare'}
      </button>
    </div>
  );
}

/**
 * TimelineBar — horizontal bar visualization showing a civilization's active years.
 */
function TimelineBar({
  start,
  end,
  color,
  label,
  globalMin,
  globalMax,
}: {
  start: number;
  end: number;
  color: string;
  label: string;
  globalMin: number;
  globalMax: number;
}) {
  const range = globalMax - globalMin;
  const leftPct = ((start - globalMin) / range) * 100;
  const widthPct = ((end - start) / range) * 100;

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          fontSize: 12,
          color: TEXT_SECONDARY,
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: 'relative',
          height: 20,
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            height: '100%',
            background: `${color}88`,
            borderRadius: 4,
            border: `1px solid ${color}`,
            minWidth: 2,
          }}
        />
      </div>
    </div>
  );
}

/**
 * TimelineAxis — renders year markers below timeline bars.
 */
function TimelineAxis({ globalMin, globalMax }: { globalMin: number; globalMax: number }) {
  const range = globalMax - globalMin;
  const step = range > 3000 ? 1000 : range > 1000 ? 500 : 200;
  const ticks: number[] = [];
  const first = Math.ceil(globalMin / step) * step;
  for (let y = first; y <= globalMax; y += step) {
    ticks.push(y);
  }

  return (
    <div
      style={{
        position: 'relative',
        height: 20,
        marginTop: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {ticks.map((year) => {
        const leftPct = ((year - globalMin) / range) * 100;
        return (
          <span
            key={year}
            style={{
              position: 'absolute',
              left: `${leftPct}%`,
              transform: 'translateX(-50%)',
              fontSize: 10,
              color: TEXT_MUTED,
              top: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {formatYear(year)}
          </span>
        );
      })}
    </div>
  );
}

/**
 * ComparisonModal — side-by-side comparison of two selected civilizations.
 */
function ComparisonModal({
  idA,
  idB,
  onClose,
}: {
  idA: string;
  idB: string;
  onClose: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['civilizations-compare', idA, idB],
    queryFn: () => fetchComparison(idA, idB),
    staleTime: 5 * 60 * 1000,
  });

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const globalMin = data
    ? Math.min(data.a.start_year, data.b.start_year) - 100
    : -4000;
  const globalMax = data
    ? Math.max(data.a.end_year, data.b.end_year) + 100
    : 2100;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: MODAL_OVERLAY,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: MODAL_BG,
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 900,
          width: '95vw',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: 32,
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: TEXT_SECONDARY,
            fontSize: 24,
            cursor: 'pointer',
            lineHeight: 1,
            padding: 4,
          }}
          aria-label="Close comparison"
        >
          &#215;
        </button>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: TEXT_PRIMARY,
            margin: '0 0 24px 0',
          }}
        >
          Civilization Comparison
        </h2>

        {isLoading && (
          <div style={{ textAlign: 'center', color: TEXT_SECONDARY, padding: 40 }}>
            Loading comparison...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 40 }}>
            Failed to load comparison data.
          </div>
        )}

        {data && (
          <>
            {/* Side by side */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                marginBottom: 28,
              }}
            >
              {[data.a, data.b].map((civ) => (
                <div
                  key={civ.id}
                  style={{
                    background: CARD_BG,
                    borderRadius: 12,
                    padding: 20,
                    borderLeft: `3px solid ${civ.color_accent}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: TEXT_PRIMARY,
                      margin: '0 0 8px 0',
                    }}
                  >
                    {civ.name}
                  </h3>
                  <div style={{ fontSize: 13, color: TEXT_SECONDARY, marginBottom: 6 }}>
                    {formatTimespan(civ.start_year, civ.end_year)}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <RegionBadge region={civ.region} />
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 8 }}>
                    {civ.key_events_count} events in database
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: TEXT_SECONDARY,
                      lineHeight: 1.5,
                      margin: '0 0 14px 0',
                    }}
                  >
                    {civ.description}
                  </p>

                  {/* Top 3 events */}
                  {civ.top_events.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: TEXT_SECONDARY,
                          marginBottom: 6,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        Key Events
                      </div>
                      {civ.top_events.map((evt) => (
                        <Link
                          key={evt.slug}
                          to={`/event/${evt.slug}`}
                          style={{
                            display: 'block',
                            fontSize: 12,
                            color: '#60a5fa',
                            textDecoration: 'none',
                            padding: '4px 0',
                          }}
                        >
                          {evt.title}
                          {evt.year_approx != null && (
                            <span style={{ color: TEXT_MUTED }}>
                              {' '}({formatYear(evt.year_approx)})
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline overlap */}
            <div style={{ marginBottom: 28 }}>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: TEXT_PRIMARY,
                  margin: '0 0 14px 0',
                }}
              >
                Timeline Overlap
              </h3>
              <TimelineBar
                start={data.a.start_year}
                end={data.a.end_year}
                color={data.a.color_accent}
                label={data.a.name}
                globalMin={globalMin}
                globalMax={globalMax}
              />
              <TimelineBar
                start={data.b.start_year}
                end={data.b.end_year}
                color={data.b.color_accent}
                label={data.b.name}
                globalMin={globalMin}
                globalMax={globalMax}
              />
              <TimelineAxis globalMin={globalMin} globalMax={globalMax} />
              {data.overlap_start != null && data.overlap_end != null && (
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    marginTop: 12,
                    padding: '8px 12px',
                    background: BADGE_BG,
                    borderRadius: 8,
                  }}
                >
                  Overlapping era: {formatYear(data.overlap_start)} {'\u2013'}{' '}
                  {formatYear(data.overlap_end)} (
                  {data.overlap_end - data.overlap_start} years)
                </div>
              )}
              {data.overlap_start == null && (
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_MUTED,
                    marginTop: 12,
                    fontStyle: 'italic',
                  }}
                >
                  These civilizations did not overlap in time.
                </div>
              )}
            </div>

            {/* Shared era events */}
            {data.shared_era_events.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                    margin: '0 0 14px 0',
                  }}
                >
                  Shared Era Events
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 8,
                  }}
                >
                  {data.shared_era_events.map((evt) => (
                    <Link
                      key={evt.slug}
                      to={`/event/${evt.slug}`}
                      style={{
                        display: 'block',
                        padding: '10px 14px',
                        background: CARD_BG,
                        borderRadius: 8,
                        textDecoration: 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 13, color: TEXT_PRIMARY, fontWeight: 500 }}>
                        {evt.title}
                      </div>
                      <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                        {evt.year_approx != null && formatYear(evt.year_approx)}
                        {evt.geo_modern && ` \u00b7 ${evt.geo_modern}`}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────

/**
 * CivilizationsPage — grid of civilization cards with comparison feature.
 */
export default function CivilizationsPage() {
  const [selected, setSelected] = useState<string[]>([]);

  const { data: civilizations, isLoading, error } = useQuery({
    queryKey: ['civilizations'],
    queryFn: fetchCivilizations,
    staleTime: 5 * 60 * 1000,
  });

  // Allow page to scroll (override root overflow:hidden)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      rootOverflow: root?.style.overflow || '',
    };
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      if (root) root.style.overflow = prev.rootOverflow;
    };
  }, []);

  /** Toggle a civilization in the compare selection (max 2). */
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const showComparison = selected.length === 2;

  // Filter by region
  const [regionFilter, setRegionFilter] = useState<string | null>(null);

  const regions = useMemo(() => {
    if (!civilizations) return [];
    const set = new Set(civilizations.map((c) => c.region));
    return Array.from(set).sort();
  }, [civilizations]);

  const filtered = useMemo(() => {
    if (!civilizations) return [];
    if (!regionFilter) return civilizations;
    return civilizations.filter((c) => c.region === regionFilter);
  }, [civilizations, regionFilter]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG_COLOR,
        color: TEXT_PRIMARY,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '32px 32px 0',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: TEXT_MUTED,
              textDecoration: 'none',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: '0 0 8px 0',
          }}
        >
          Civilizations Explorer
        </h1>
        <p style={{ fontSize: 15, color: TEXT_SECONDARY, margin: '0 0 20px 0' }}>
          Browse major world civilizations and compare them side by side.
          Select exactly 2 to compare.
        </p>

        {/* Region filter + selection status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 24,
          }}
        >
          <button
            onClick={() => setRegionFilter(null)}
            style={{
              padding: '5px 14px',
              borderRadius: 8,
              border: `1px solid ${!regionFilter ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
              background: !regionFilter ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              color: !regionFilter ? '#60a5fa' : TEXT_SECONDARY,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(r === regionFilter ? null : r)}
              style={{
                padding: '5px 14px',
                borderRadius: 8,
                border: `1px solid ${r === regionFilter ? '#3b82f6' : 'rgba(255,255,255,0.12)'}`,
                background:
                  r === regionFilter ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: r === regionFilter ? '#60a5fa' : TEXT_SECONDARY,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}

          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              style={{
                marginLeft: 'auto',
                padding: '5px 14px',
                borderRadius: 8,
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Clear selection ({selected.length}/2)
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '0 32px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {isLoading && (
          <div style={{ textAlign: 'center', color: TEXT_SECONDARY, padding: 60 }}>
            Loading civilizations...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: 60 }}>
            Failed to load civilizations. Is the API running?
          </div>
        )}

        {filtered && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {filtered.map((civ) => (
              <CivilizationCard
                key={civ.id}
                civ={civ}
                selected={selected.includes(civ.id)}
                onToggle={() => toggleSelect(civ.id)}
                compareCount={selected.length}
              />
            ))}
          </div>
        )}
      </main>

      {/* Comparison modal */}
      {showComparison && (
        <ComparisonModal
          idA={selected[0]}
          idB={selected[1]}
          onClose={() => setSelected([])}
        />
      )}
    </div>
  );
}
