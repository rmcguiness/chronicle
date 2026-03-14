/**
 * LifespansPage — "Historical Lifespans" Gantt-chart visualization.
 *
 * Shows horizontal bars for each historical figure's lifespan,
 * colored by region, with hover tooltips, overlap detection,
 * filtering/sorting controls, and insights.
 *
 * Route: /lifespans
 */
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { fetchLifespans } from '../api/client';
import type { LifespanPerson } from '../types';

// ─── Constants ───────────────────────────────────────────────────────────────

const REGION_COLORS: Record<string, string> = {
  Europe: '#3b82f6',
  Asia: '#ef4444',
  Americas: '#22c55e',
  Africa: '#f59e0b',
  'Middle East': '#a855f7',
  Oceania: '#06b6d4',
  Other: '#6b7280',
};

const ERAS = [
  { key: '', label: 'All' },
  { key: 'ancient', label: 'Ancient' },
  { key: 'classical', label: 'Classical' },
  { key: 'medieval', label: 'Medieval' },
  { key: 'early_modern', label: 'Early Modern' },
  { key: 'modern', label: 'Modern' },
] as const;

const REGIONS_LIST = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Oceania'] as const;

type SortKey = 'birth' | 'lifespan' | 'region' | 'events';

const CURRENT_YEAR = 2026;
const ROW_HEIGHT = 28;
const ROW_GAP = 2;
const CHART_PADDING_LEFT = 220;
const CHART_PADDING_RIGHT = 40;
const HEADER_HEIGHT = 50;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a year for display, handling BCE. */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 BCE';
  return `${year} CE`;
}

/** Get lifespan in years (to present if death unknown). */
function lifespan(p: LifespanPerson): number {
  return (p.death_year ?? CURRENT_YEAR) - p.birth_year;
}

/** Check if two people's lifetimes overlap. */
function overlaps(a: LifespanPerson, b: LifespanPerson): boolean {
  const aEnd = a.death_year ?? CURRENT_YEAR;
  const bEnd = b.death_year ?? CURRENT_YEAR;
  return a.birth_year < bEnd && b.birth_year < aEnd;
}

/** Calculate overlap years between two people. */
function overlapYears(a: LifespanPerson, b: LifespanPerson): number {
  const aEnd = a.death_year ?? CURRENT_YEAR;
  const bEnd = b.death_year ?? CURRENT_YEAR;
  const start = Math.max(a.birth_year, b.birth_year);
  const end = Math.min(aEnd, bEnd);
  return Math.max(0, end - start);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LifespansPage() {
  const navigate = useNavigate();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // ── State ──
  const [era, setEra] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('birth');
  const [search, setSearch] = useState('');
  const [yearMin, setYearMin] = useState<number | ''>('');
  const [yearMax, setYearMax] = useState<number | ''>('');
  const [hoveredPerson, setHoveredPerson] = useState<LifespanPerson | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<LifespanPerson | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Data fetching ──
  const { data: people = [], isLoading, error } = useQuery({
    queryKey: ['lifespans', era],
    queryFn: () => fetchLifespans(era || undefined),
    staleTime: 5 * 60 * 1000,
  });

  // ── Filtering & sorting ──
  const filtered = useMemo(() => {
    let result = people;

    if (regionFilter !== 'All') {
      result = result.filter((p) => p.region === regionFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (yearMin !== '') {
      result = result.filter((p) => p.birth_year >= (yearMin as number));
    }
    if (yearMax !== '') {
      result = result.filter((p) => (p.death_year ?? CURRENT_YEAR) <= (yearMax as number));
    }

    // Sort
    const sorted = [...result];
    switch (sortKey) {
      case 'birth':
        sorted.sort((a, b) => a.birth_year - b.birth_year);
        break;
      case 'lifespan':
        sorted.sort((a, b) => lifespan(b) - lifespan(a));
        break;
      case 'region':
        sorted.sort((a, b) => a.region.localeCompare(b.region) || a.birth_year - b.birth_year);
        break;
      case 'events':
        sorted.sort((a, b) => b.event_count - a.event_count || a.birth_year - b.birth_year);
        break;
    }

    return sorted;
  }, [people, regionFilter, search, yearMin, yearMax, sortKey]);

  // ── Chart scale ──
  const { minYear, maxYear } = useMemo(() => {
    if (filtered.length === 0) return { minYear: -3000, maxYear: 2100 };
    const births = filtered.map((p) => p.birth_year);
    const deaths = filtered.map((p) => p.death_year ?? CURRENT_YEAR);
    const min = Math.min(...births);
    const max = Math.max(...deaths);
    // Add some padding
    const range = max - min;
    return { minYear: min - range * 0.02, maxYear: max + range * 0.02 };
  }, [filtered]);

  // ── Insights ──
  const insights = useMemo(() => {
    if (people.length === 0) return null;

    const withLifespan = people.filter((p) => p.death_year !== null);
    const oldest = withLifespan.length > 0
      ? withLifespan.reduce((a, b) => lifespan(a) > lifespan(b) ? a : b)
      : null;

    // Most contemporaries
    let mostContemporaries: { person: LifespanPerson; count: number } | null = null;
    for (const p of people) {
      const count = people.filter((q) => q.id !== p.id && overlaps(p, q)).length;
      if (!mostContemporaries || count > mostContemporaries.count) {
        mostContemporaries = { person: p, count };
      }
    }

    // Surprise overlap: pick a random interesting pair
    const surprises = findSurpriseOverlaps(people);
    const surprise = surprises.length > 0
      ? surprises[Math.floor(Math.random() * surprises.length)]
      : null;

    return { oldest, mostContemporaries, surprise };
  }, [people]);

  // ── Overlap panel data ──
  const contemporaries = useMemo(() => {
    const target = selectedPerson ?? hoveredPerson;
    if (!target) return [];
    return people
      .filter((p) => p.id !== target.id && overlaps(target, p))
      .map((p) => ({ person: p, years: overlapYears(target, p) }))
      .sort((a, b) => b.years - a.years);
  }, [selectedPerson, hoveredPerson, people]);

  // ── Famous contemporaries ──
  const famousContemporaries = useMemo(() => findSurpriseOverlaps(people).slice(0, 3), [people]);

  // ── Chart dimensions ──
  const chartWidth = 1200;
  const chartHeight = HEADER_HEIGHT + filtered.length * (ROW_HEIGHT + ROW_GAP) + 20;
  const timelineWidth = chartWidth - CHART_PADDING_LEFT - CHART_PADDING_RIGHT;
  const yearRange = maxYear - minYear || 1;

  const yearToX = useCallback(
    (year: number) => CHART_PADDING_LEFT + ((year - minYear) / yearRange) * timelineWidth,
    [minYear, yearRange, timelineWidth],
  );

  // ── Century tick marks ──
  const ticks = useMemo(() => {
    const result: number[] = [];
    const step = yearRange > 3000 ? 500 : yearRange > 1000 ? 200 : yearRange > 400 ? 100 : 50;
    const start = Math.ceil(minYear / step) * step;
    for (let y = start; y <= maxYear; y += step) {
      result.push(y);
    }
    return result;
  }, [minYear, maxYear, yearRange]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, person: LifespanPerson) => {
      const rect = chartContainerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({ x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10 });
      }
      setHoveredPerson(person);
    },
    [],
  );

  // ── Render ──
  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.spinner} />
        <p style={{ color: '#94a3b8', marginTop: 16 }}>Loading lifespans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: '#ef4444' }}>Failed to load lifespan data.</p>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Make sure the backend is running.</p>
      </div>
    );
  }

  const activePerson = selectedPerson ?? hoveredPerson;

  return (
    <div style={styles.page}>
      {/* ── Header ── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Link to="/" style={styles.backLink}>&larr; Chronicle</Link>
          <h1 style={styles.title}>Historical Lifespans</h1>
          <span style={styles.subtitle}>{people.length} figures across history</span>
        </div>
      </header>

      {/* ── Insights bar ── */}
      {insights && (
        <div style={styles.insightsBar}>
          {insights.oldest && (
            <div style={styles.insightCard}>
              <div style={styles.insightLabel}>Longest Lifespan</div>
              <div style={styles.insightValue}>
                {insights.oldest.name} ({lifespan(insights.oldest)} yrs)
              </div>
            </div>
          )}
          {insights.mostContemporaries && (
            <div style={styles.insightCard}>
              <div style={styles.insightLabel}>Most Contemporaries</div>
              <div style={styles.insightValue}>
                {insights.mostContemporaries.person.name} ({insights.mostContemporaries.count})
              </div>
            </div>
          )}
          {insights.surprise && (
            <div style={styles.insightCard}>
              <div style={styles.insightLabel}>Surprise Overlap</div>
              <div style={styles.insightValue}>
                {insights.surprise.a.name} & {insights.surprise.b.name}
                {' '}({insights.surprise.years} yrs)
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Controls ── */}
      <div style={styles.controls}>
        {/* Era filter */}
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Era</label>
          <div style={styles.buttonGroup}>
            {ERAS.map((e) => (
              <button
                key={e.key}
                onClick={() => setEra(e.key)}
                style={{
                  ...styles.filterBtn,
                  ...(era === e.key ? styles.filterBtnActive : {}),
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region filter */}
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Region</label>
          <div style={styles.buttonGroup}>
            {REGIONS_LIST.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                style={{
                  ...styles.filterBtn,
                  ...(regionFilter === r ? styles.filterBtnActive : {}),
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Sort</label>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={styles.select}
          >
            <option value="birth">Birth Year</option>
            <option value="lifespan">Lifespan Length</option>
            <option value="region">Region</option>
            <option value="events">Event Count</option>
          </select>
        </div>

        {/* Search */}
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Search</label>
          <input
            type="text"
            placeholder="Filter by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Year range */}
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Year Range</label>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="number"
              placeholder="From"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value ? Number(e.target.value) : '')}
              style={{ ...styles.searchInput, width: 80 }}
            />
            <span style={{ color: '#64748b' }}>to</span>
            <input
              type="number"
              placeholder="To"
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value ? Number(e.target.value) : '')}
              style={{ ...styles.searchInput, width: 80 }}
            />
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div style={styles.legend}>
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} style={styles.legendItem}>
            <div style={{ ...styles.legendSwatch, backgroundColor: color }} />
            <span style={styles.legendLabel}>{region}</span>
          </div>
        ))}
      </div>

      {/* ── Main content: chart + overlap panel ── */}
      <div style={styles.mainContent}>
        {/* ── Chart area ── */}
        <div style={styles.chartWrapper} ref={chartContainerRef}>
          {filtered.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
              No figures match the current filters.
            </div>
          ) : isMobile ? (
            /* ── Mobile: simplified list view ── */
            <div style={styles.mobileList}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={styles.mobileCard}
                  onClick={() => setSelectedPerson(selectedPerson?.id === p.id ? null : p)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: REGION_COLORS[p.region] ?? REGION_COLORS.Other,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{p.name}</span>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>
                    {formatYear(p.birth_year)} &ndash; {p.death_year ? formatYear(p.death_year) : 'present'}
                    {' '}&middot; {lifespan(p)} yrs
                    {p.role && <> &middot; {p.role}</>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── Desktop: SVG Gantt chart ── */
            <svg
              width={chartWidth}
              height={chartHeight}
              style={{ display: 'block' }}
            >
              {/* Background grid lines at century marks */}
              {ticks.map((year) => (
                <line
                  key={year}
                  x1={yearToX(year)}
                  y1={HEADER_HEIGHT - 5}
                  x2={yearToX(year)}
                  y2={chartHeight}
                  stroke="#1e293b"
                  strokeWidth={1}
                />
              ))}

              {/* X-axis labels */}
              {ticks.map((year) => (
                <text
                  key={`label-${year}`}
                  x={yearToX(year)}
                  y={HEADER_HEIGHT - 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={11}
                  fontFamily="'Inter', sans-serif"
                >
                  {formatYear(year)}
                </text>
              ))}

              {/* X-axis line */}
              <line
                x1={CHART_PADDING_LEFT}
                y1={HEADER_HEIGHT}
                x2={chartWidth - CHART_PADDING_RIGHT}
                y2={HEADER_HEIGHT}
                stroke="#334155"
                strokeWidth={1}
              />

              {/* Person rows */}
              {filtered.map((person, i) => {
                const y = HEADER_HEIGHT + i * (ROW_HEIGHT + ROW_GAP) + ROW_GAP;
                const x1 = yearToX(person.birth_year);
                const x2 = yearToX(person.death_year ?? CURRENT_YEAR);
                const barWidth = Math.max(2, x2 - x1);
                const color = REGION_COLORS[person.region] ?? REGION_COLORS.Other;
                const isHovered = hoveredPerson?.id === person.id;
                const isSelected = selectedPerson?.id === person.id;
                const isContemporary =
                  activePerson &&
                  activePerson.id !== person.id &&
                  overlaps(activePerson, person);
                const dimmed =
                  activePerson &&
                  activePerson.id !== person.id &&
                  !isContemporary;

                return (
                  <g
                    key={person.id}
                    onMouseMove={(e) => handleMouseMove(e, person)}
                    onMouseLeave={() => setHoveredPerson(null)}
                    onClick={() =>
                      setSelectedPerson(
                        selectedPerson?.id === person.id ? null : person,
                      )
                    }
                    style={{ cursor: 'pointer' }}
                    opacity={dimmed ? 0.2 : 1}
                  >
                    {/* Row background on hover */}
                    {(isHovered || isSelected) && (
                      <rect
                        x={0}
                        y={y}
                        width={chartWidth}
                        height={ROW_HEIGHT}
                        fill={isSelected ? '#1e293b' : '#0f172a'}
                        rx={3}
                      />
                    )}

                    {/* Person name label */}
                    <text
                      x={CHART_PADDING_LEFT - 8}
                      y={y + ROW_HEIGHT / 2 + 4}
                      textAnchor="end"
                      fill={isHovered || isSelected ? '#e2e8f0' : '#94a3b8'}
                      fontSize={12}
                      fontFamily="'Inter', sans-serif"
                      fontWeight={isSelected ? 600 : 400}
                    >
                      {person.name.length > 22
                        ? person.name.substring(0, 20) + '...'
                        : person.name}
                    </text>

                    {/* Lifespan bar */}
                    <rect
                      x={x1}
                      y={y + 4}
                      width={barWidth}
                      height={ROW_HEIGHT - 8}
                      rx={3}
                      fill={color}
                      opacity={isHovered || isSelected ? 1 : 0.75}
                      stroke={isSelected ? '#e2e8f0' : isContemporary ? '#fbbf24' : 'none'}
                      strokeWidth={isSelected ? 2 : isContemporary ? 1.5 : 0}
                    />

                    {/* Dashed right edge for living people */}
                    {person.death_year === null && (
                      <line
                        x1={x2}
                        y1={y + 4}
                        x2={x2}
                        y2={y + ROW_HEIGHT - 4}
                        stroke={color}
                        strokeWidth={2}
                        strokeDasharray="3,3"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* ── Tooltip ── */}
          {hoveredPerson && !isMobile && (
            <div
              style={{
                ...styles.tooltip,
                left: tooltipPos.x,
                top: tooltipPos.y,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>
                {hoveredPerson.name}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {formatYear(hoveredPerson.birth_year)} &ndash;{' '}
                {hoveredPerson.death_year
                  ? formatYear(hoveredPerson.death_year)
                  : 'present'}
                {' '}({lifespan(hoveredPerson)} years)
              </div>
              {hoveredPerson.role && (
                <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
                  {hoveredPerson.role}
                </div>
              )}
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                {hoveredPerson.region}
                {hoveredPerson.event_count > 0 &&
                  ` · ${hoveredPerson.event_count} event${hoveredPerson.event_count !== 1 ? 's' : ''}`}
              </div>
              {hoveredPerson.description && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, maxWidth: 280 }}>
                  {hoveredPerson.description.length > 150
                    ? hoveredPerson.description.substring(0, 147) + '...'
                    : hoveredPerson.description}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Overlap panel (sidebar) ── */}
        {activePerson && !isMobile && (
          <div style={styles.overlapPanel}>
            <div style={styles.overlapHeader}>
              <h3 style={styles.overlapTitle}>
                Contemporaries of
              </h3>
              <div style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 15 }}>
                {activePerson.name}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                {formatYear(activePerson.birth_year)} &ndash;{' '}
                {activePerson.death_year ? formatYear(activePerson.death_year) : 'present'}
              </div>
              {selectedPerson && (
                <button
                  onClick={() => setSelectedPerson(null)}
                  style={styles.clearBtn}
                >
                  Clear selection
                </button>
              )}
            </div>

            <div style={styles.overlapList}>
              {contemporaries.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: 13, padding: 12 }}>
                  No contemporaries found.
                </div>
              ) : (
                <>
                  <div style={{ color: '#64748b', fontSize: 12, padding: '4px 0' }}>
                    {contemporaries.length} people alive at the same time
                  </div>
                  {contemporaries.map(({ person: p, years }) => (
                    <div key={p.id} style={styles.overlapItem}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: REGION_COLORS[p.region] ?? REGION_COLORS.Other,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: 13 }}>
                          {p.name}
                        </span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>
                        {p.role ?? 'Unknown role'} &middot; {years} yrs overlap
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Famous contemporaries ── */}
      {famousContemporaries.length > 0 && (
        <div style={styles.famousSection}>
          <h3 style={styles.famousSectionTitle}>
            Famous contemporaries you might not know about
          </h3>
          <div style={styles.famousGrid}>
            {famousContemporaries.map((pair, i) => (
              <div key={i} style={styles.famousCard}>
                <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 14 }}>
                  {pair.a.name} & {pair.b.name}
                </div>
                <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>
                  {formatYear(pair.a.birth_year)}&ndash;
                  {pair.a.death_year ? formatYear(pair.a.death_year) : 'present'}
                  {' '}and{' '}
                  {formatYear(pair.b.birth_year)}&ndash;
                  {pair.b.death_year ? formatYear(pair.b.death_year) : 'present'}
                </div>
                <div style={{ color: '#f59e0b', fontSize: 12, marginTop: 2 }}>
                  Overlapped by {pair.years} years
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Surprise overlaps ───────────────────────────────────────────────────────

interface OverlapPair {
  a: LifespanPerson;
  b: LifespanPerson;
  years: number;
}

/**
 * Find surprising historical overlaps — people from different regions
 * or different roles who were alive at the same time.
 */
function findSurpriseOverlaps(people: LifespanPerson[]): OverlapPair[] {
  const pairs: OverlapPair[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const a = people[i];
      const b = people[j];

      // Only interesting if different regions
      if (a.region === b.region) continue;
      if (!overlaps(a, b)) continue;

      const years = overlapYears(a, b);
      if (years < 5) continue;

      const key = [a.id, b.id].sort().join('-');
      if (seen.has(key)) continue;
      seen.add(key);

      pairs.push({ a, b, years });
    }
  }

  // Sort by overlap years descending, then by how different the regions are
  pairs.sort((x, y) => y.years - x.years);
  return pairs.slice(0, 10);
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: "'Inter', sans-serif",
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #334155',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #1e293b',
    backgroundColor: '#0f172a',
    position: 'sticky' as const,
    top: 0,
    zIndex: 20,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  backLink: {
    color: '#64748b',
    textDecoration: 'none',
    fontSize: 14,
    transition: 'color 0.15s',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
    color: '#e2e8f0',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  insightsBar: {
    display: 'flex',
    gap: 16,
    padding: '12px 24px',
    borderBottom: '1px solid #1e293b',
    overflowX: 'auto' as const,
  },
  insightCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: '10px 16px',
    minWidth: 180,
    flexShrink: 0,
  },
  insightLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  insightValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e2e8f0',
    marginTop: 2,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 16,
    padding: '12px 24px',
    borderBottom: '1px solid #1e293b',
    alignItems: 'flex-end',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
  },
  controlLabel: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  buttonGroup: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap' as const,
  },
  filterBtn: {
    padding: '4px 10px',
    fontSize: 12,
    border: '1px solid #334155',
    borderRadius: 4,
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: "'Inter', sans-serif",
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff',
  },
  select: {
    padding: '5px 8px',
    fontSize: 12,
    border: '1px solid #334155',
    borderRadius: 4,
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  searchInput: {
    padding: '5px 10px',
    fontSize: 12,
    border: '1px solid #334155',
    borderRadius: 4,
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    outline: 'none',
    width: 160,
    fontFamily: "'Inter', sans-serif",
  },
  legend: {
    display: 'flex',
    gap: 16,
    padding: '8px 24px',
    borderBottom: '1px solid #1e293b',
    flexWrap: 'wrap' as const,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  mainContent: {
    display: 'flex',
    gap: 0,
  },
  chartWrapper: {
    flex: 1,
    overflowX: 'auto' as const,
    overflowY: 'auto' as const,
    maxHeight: 'calc(100vh - 280px)',
    position: 'relative' as const,
    padding: '8px 0',
  },
  tooltip: {
    position: 'absolute' as const,
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 8,
    padding: '10px 14px',
    pointerEvents: 'none' as const,
    zIndex: 30,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    maxWidth: 320,
  },
  overlapPanel: {
    width: 280,
    borderLeft: '1px solid #1e293b',
    backgroundColor: '#0f172a',
    overflowY: 'auto' as const,
    maxHeight: 'calc(100vh - 280px)',
    flexShrink: 0,
  },
  overlapHeader: {
    padding: '16px 14px',
    borderBottom: '1px solid #1e293b',
  },
  overlapTitle: {
    fontSize: 12,
    color: '#64748b',
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  clearBtn: {
    marginTop: 8,
    padding: '3px 8px',
    fontSize: 11,
    border: '1px solid #334155',
    borderRadius: 3,
    backgroundColor: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
  },
  overlapList: {
    padding: '8px 14px',
  },
  overlapItem: {
    padding: '8px 0',
    borderBottom: '1px solid #1e293b',
  },
  mobileList: {
    padding: '8px 16px',
  },
  mobileCard: {
    padding: '10px 12px',
    borderBottom: '1px solid #1e293b',
    cursor: 'pointer',
  },
  famousSection: {
    padding: '24px',
    borderTop: '1px solid #1e293b',
  },
  famousSectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#e2e8f0',
    margin: '0 0 12px 0',
  },
  famousGrid: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap' as const,
  },
  famousCard: {
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: '14px 18px',
    minWidth: 240,
    flex: '1 1 240px',
    maxWidth: 360,
  },
};
