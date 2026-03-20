/**
 * YearPage — "Year in Review" almanac page.
 *
 * Route: /year/:year (e.g., /year/1066, /year/-44, /year/1945)
 *
 * Newspaper/almanac aesthetic with sections:
 *  1. Hero banner with year, era, navigation
 *  2. Top Headlines (most important events)
 *  3. Around the World (geographic breakdown by region)
 *  4. Notable People Active This Year
 *  5. Causality context (forward + backward links)
 *  6. Explore Nearby Years (decade nav)
 *
 * Does NOT own: event detail rendering, network view state.
 */
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import HeadlineCard from '../components/HeadlineCard';
import RegionColumn from '../components/RegionColumn';

// ── Constants ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const MAX_HEADLINES = 6;
const REGIONS = ['Europe', 'Middle East', 'Africa', 'Asia', 'Americas', 'Oceania'] as const;
const MAX_PEOPLE = 8;
const DECADE_RANGE_BEFORE = 5;
const DECADE_RANGE_AFTER = 4;

// ── Types ────────────────────────────────────────────────────────────────────

interface YearEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  date_display: string | null;
  category: string | null;
  importance_score: number;
  region: string | null;
  short_description: string | null;
}

interface YearPerson {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  roles: string[] | null;
  description: string | null;
  image_url: string | null;
}

interface CausalityLink {
  link_id: string;
  source_event_id: string;
  source_event_title: string;
  source_event_slug: string;
  source_year: number | null;
  target_event_id: string;
  target_event_title: string;
  target_event_slug: string;
  target_year: number | null;
  link_type: string | null;
  strength: number | null;
}

interface YearData {
  year: number;
  era_label: string;
  events_count: number;
  headlines: YearEvent[];
  events_by_region: Record<string, YearEvent[]>;
  people: YearPerson[];
  forward_links: CausalityLink[];
  backward_links: CausalityLink[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Format year for display — handles BCE. */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Fetch year data from the API. */
async function fetchYearData(year: number): Promise<YearData> {
  const res = await fetch(`${API_BASE}/api/year/${year}`);
  if (!res.ok) throw new Error(`Failed to fetch year ${year}`);
  return res.json();
}

// ── Styles ───────────────────────────────────────────────────────────────────

const PAGE_BG = '#faf8f0';
const HEADER_BG = '#1c1917';
const SEPIA_BORDER = '#d4c89a';
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS = "'Inter', -apple-system, sans-serif";

const sectionHeaderStyle: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#1c1917',
  borderBottom: `3px double ${SEPIA_BORDER}`,
  paddingBottom: '0.5rem',
  marginBottom: '1.25rem',
};

const navButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.3)',
  color: '#fff',
  padding: '8px 16px',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontFamily: SANS,
};

// ── Component ────────────────────────────────────────────────────────────────

/**
 * YearPage — newspaper-style almanac for any year in history.
 */
export default function YearPage() {
  const { year: yearParam } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const year = yearParam ? parseInt(yearParam, 10) : 1066;

  // Redirect bare /year to /year/1066
  useEffect(() => {
    if (!yearParam) navigate('/year/1066', { replace: true });
  }, [yearParam, navigate]);

  const { data, isLoading, error } = useQuery<YearData>({
    queryKey: ['year', year],
    queryFn: () => fetchYearData(year),
    enabled: !isNaN(year),
  });

  /** Navigate to a random year between -3000 and 2024. */
  const goRandom = useCallback(() => {
    const randomYear = Math.floor(Math.random() * 5024) - 3000;
    navigate(`/year/${randomYear}`);
  }, [navigate]);

  /** Copy current URL to clipboard. */
  const shareUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  if (isNaN(year)) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', fontFamily: SANS }}>
        <h1>Invalid Year</h1>
        <Link to="/year/1066" style={{ color: '#2563eb' }}>Go to 1066</Link>
      </div>
    );
  }

  // ── Decade navigation buttons ─────────────────────────────────────────────
  const decadeYears = Array.from(
    { length: DECADE_RANGE_BEFORE + DECADE_RANGE_AFTER + 1 },
    (_, i) => year - DECADE_RANGE_BEFORE + i
  );
  const centuryStart = Math.floor(year / 100) * 100;

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG, fontFamily: SANS }}>
      {/* ── SECTION 1: Hero Banner ─────────────────────────────────────────── */}
      <header
        style={{
          background: HEADER_BG,
          color: '#fff',
          padding: '2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Back to main */}
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ color: '#a8a29e', textDecoration: 'none', fontSize: '0.85rem' }}>
            ← Back to Chronicle
          </Link>
        </div>

        {/* Navigation arrows */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => navigate(`/year/${year - 1}`)}
            style={navButtonStyle}
            title="Previous year"
          >
            ◀ {formatYear(year - 1)}
          </button>

          <div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 900,
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {formatYear(year)}
            </h1>
            {data && (
              <p style={{ margin: '0.25rem 0 0', color: '#d4c89a', fontSize: '1.1rem', fontFamily: SERIF }}>
                {data.era_label}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(`/year/${year + 1}`)}
            style={navButtonStyle}
            title="Next year"
          >
            {formatYear(year + 1)} ▶
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button onClick={goRandom} style={{ ...navButtonStyle, background: 'rgba(255,255,255,0.1)' }}>
            🎲 Random Year
          </button>
          <button onClick={shareUrl} style={{ ...navButtonStyle, background: 'rgba(255,255,255,0.1)' }}>
            {copied ? '✓ Copied!' : '🔗 Share'}
          </button>
          {data && (
            <span
              style={{
                background: 'rgba(255,255,255,0.15)',
                padding: '8px 16px',
                borderRadius: 4,
                fontSize: '0.85rem',
              }}
            >
              📜 {data.events_count} recorded event{data.events_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </header>

      {/* Loading / Error states */}
      {isLoading && (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#78716c' }}>
          Loading year data…
        </div>
      )}
      {error && (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#dc2626' }}>
          Failed to load data for {formatYear(year)}.
        </div>
      )}

      {data && (
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
          {/* ── SECTION 2: Top Headlines ─────────────────────────────────── */}
          {data.headlines.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={sectionHeaderStyle}>📰 Top Headlines</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1rem',
                }}
              >
                {data.headlines.slice(0, MAX_HEADLINES).map((ev) => (
                  <HeadlineCard
                    key={ev.id}
                    slug={ev.slug}
                    title={ev.title}
                    dateDisplay={ev.date_display}
                    category={ev.category}
                    importanceScore={ev.importance_score}
                    description={ev.short_description}
                    yearApprox={ev.year_approx}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 3: Around the World ──────────────────────────────── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={sectionHeaderStyle}>🌍 Around the World</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {REGIONS.map((region) => (
                <RegionColumn
                  key={region}
                  region={region}
                  events={(data.events_by_region[region] ?? []).map((ev) => ({
                    slug: ev.slug,
                    title: ev.title,
                    yearApprox: ev.year_approx,
                    category: ev.category,
                    importanceScore: ev.importance_score,
                  }))}
                />
              ))}
            </div>
          </section>

          {/* ── SECTION 4: Notable People ─────────────────────────────────── */}
          {data.people.length > 0 && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={sectionHeaderStyle}>👤 Notable People Active This Year</h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1rem',
                }}
              >
                {data.people.slice(0, MAX_PEOPLE).map((person) => (
                  <motion.div
                    key={person.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: '#fffbeb',
                      border: `1px solid ${SEPIA_BORDER}`,
                      borderRadius: 4,
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '1rem', color: '#1c1917' }}>
                      {person.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#78716c' }}>
                      {person.birth_year !== null
                        ? formatYear(person.birth_year)
                        : '?'}{' '}
                      –{' '}
                      {person.death_year !== null
                        ? formatYear(person.death_year)
                        : 'present'}
                    </span>
                    {person.roles && person.roles.length > 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#a8a29e', fontStyle: 'italic' }}>
                        {person.roles.join(', ')}
                      </span>
                    )}
                    {person.description && (
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#57534e',
                          margin: '0.25rem 0 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {person.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ── SECTION 5: Causality ─────────────────────────────────────── */}
          {(data.forward_links.length > 0 || data.backward_links.length > 0) && (
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={sectionHeaderStyle}>🔗 Causality in This Year</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                {/* Forward links */}
                {data.forward_links.length > 0 && (
                  <div style={{ flex: '1 1 400px' }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.1rem', color: '#1c1917', margin: '0 0 0.75rem' }}>
                      Events of {formatYear(year)} that caused later events →
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {data.forward_links.map((link) => (
                        <li
                          key={link.link_id}
                          style={{
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: 4,
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          <Link to={`/event/${link.source_event_slug}`} style={{ fontWeight: 600, color: '#1c1917', textDecoration: 'none' }}>
                            {link.source_event_title}
                          </Link>
                          <span style={{ color: '#78716c' }}> → </span>
                          <Link to={`/event/${link.target_event_slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                            {link.target_event_title}
                          </Link>
                          {link.target_year !== null && (
                            <span style={{ color: '#a8a29e', marginLeft: 6, fontSize: '0.75rem' }}>
                              ({formatYear(link.target_year)})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Backward links */}
                {data.backward_links.length > 0 && (
                  <div style={{ flex: '1 1 400px' }}>
                    <h3 style={{ fontFamily: SERIF, fontSize: '1.1rem', color: '#1c1917', margin: '0 0 0.75rem' }}>
                      ← Events leading to {formatYear(year)}'s events
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {data.backward_links.map((link) => (
                        <li
                          key={link.link_id}
                          style={{
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            borderRadius: 4,
                            padding: '0.75rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          <Link to={`/event/${link.source_event_slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                            {link.source_event_title}
                          </Link>
                          {link.source_year !== null && (
                            <span style={{ color: '#a8a29e', marginLeft: 4, fontSize: '0.75rem' }}>
                              ({formatYear(link.source_year)})
                            </span>
                          )}
                          <span style={{ color: '#78716c' }}> → </span>
                          <Link to={`/event/${link.target_event_slug}`} style={{ fontWeight: 600, color: '#1c1917', textDecoration: 'none' }}>
                            {link.target_event_title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── SECTION 6: Explore Nearby Years ──────────────────────────── */}
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={sectionHeaderStyle}>🧭 Explore Nearby Years</h2>

            {/* Decade buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {decadeYears.map((y) => (
                <button
                  key={y}
                  onClick={() => navigate(`/year/${y}`)}
                  style={{
                    background: y === year ? '#1c1917' : '#fffbeb',
                    color: y === year ? '#fff' : '#1c1917',
                    border: `1px solid ${y === year ? '#1c1917' : SEPIA_BORDER}`,
                    padding: '8px 14px',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: y === year ? 700 : 400,
                    fontSize: '0.85rem',
                    fontFamily: SANS,
                  }}
                >
                  {formatYear(y)}
                </button>
              ))}
            </div>

            {/* Century jumps */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/year/${centuryStart - 100}`)}
                style={{ ...navButtonStyle, color: '#1c1917', borderColor: SEPIA_BORDER }}
              >
                ◀ {formatYear(centuryStart - 100)}
              </button>
              <button
                onClick={() => navigate(`/year/${centuryStart}`)}
                style={{ ...navButtonStyle, color: '#1c1917', borderColor: SEPIA_BORDER, fontWeight: 700 }}
              >
                {formatYear(centuryStart)}
              </button>
              <button
                onClick={() => navigate(`/year/${centuryStart + 100}`)}
                style={{ ...navButtonStyle, color: '#1c1917', borderColor: SEPIA_BORDER }}
              >
                {formatYear(centuryStart + 100)} ▶
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
