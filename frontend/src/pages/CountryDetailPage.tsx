/**
 * CountryDetailPage — individual country page showing events, people, era breakdown.
 *
 * Route: /country/:country
 */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCountryDetail } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';

interface EraCount {
  era: string;
  count: number;
  color: string;
}

interface CountryEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
  importance_score: number;
  geo_modern: string | null;
  era: string;
}

interface CountryPerson {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  roles: string[] | null;
  description: string | null;
  wikipedia_slug: string | null;
}

interface NeighborCountry {
  name: string;
  slug: string;
  flag: string;
  region: string;
  event_count: number;
}

interface CountryDetail {
  name: string;
  slug: string;
  flag: string;
  region: string;
  total_events: number;
  earliest_year: number | null;
  latest_year: number | null;
  notable_people_count: number;
  era_breakdown: EraCount[];
  events: CountryEvent[];
  notable_people: CountryPerson[];
  neighboring_countries: NeighborCountry[];
}

export default function CountryDetailPage() {
  const { country } = useParams<{ country: string }>();
  const [eraFilter, setEraFilter] = useState<string | null>(null);

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

  const { data, isLoading, isError } = useQuery<CountryDetail>({
    queryKey: ['country', country, eraFilter],
    queryFn: () => fetchCountryDetail(country!, eraFilter),
    enabled: !!country,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <PageShell>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '60vh', gap: 16, color: '#64748b',
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#3b82f6',
            }}
          />
          <span style={{ fontSize: 14 }}>Loading country...</span>
        </div>
      </PageShell>
    );
  }

  if (isError || !data) {
    return (
      <PageShell>
        <div style={{ padding: '40px 32px' }}>
          <Link to="/countries" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#64748b', textDecoration: 'none',
            marginBottom: 24, padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}>
            &#8592; Back to Countries
          </Link>
          <div style={{
            padding: '20px 24px', borderRadius: 10,
            backgroundColor: '#ef444418', border: '1px solid #ef444444',
            color: '#fca5a5', fontSize: 14,
          }}>
            Country not found.
          </div>
        </div>
      </PageShell>
    );
  }

  const maxEraCount = Math.max(...data.era_breakdown.map(e => e.count), 1);

  return (
    <PageShell>
      {/* Hero */}
      <div style={{
        padding: '40px 32px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(59,130,246,0.06) 100%)',
      }}>
        <Link to="/countries" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: '#64748b', textDecoration: 'none',
          marginBottom: 24, padding: '6px 12px', borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}>
          &#8592; Back to Countries
        </Link>

        {/* Country name + flag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 48 }}>{data.flag}</span>
          <div>
            <h1 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, margin: 0,
            }}>
              {data.name}
            </h1>
            <span style={{
              display: 'inline-block', marginTop: 6,
              fontSize: 11, fontWeight: 700, padding: '4px 10px',
              borderRadius: 6, backgroundColor: 'rgba(59,130,246,0.15)',
              color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {data.region}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <StatBadge icon="&#128197;" label={`${data.total_events} events`} />
          <StatBadge
            icon="&#128197;"
            label={
              data.earliest_year != null && data.latest_year != null
                ? `${data.earliest_year < 0 ? `${Math.abs(data.earliest_year)} BCE` : data.earliest_year} \u2192 ${data.latest_year}`
                : 'Date range unknown'
            }
          />
          <StatBadge icon="&#128100;" label={`${data.notable_people_count} notable people`} />
        </div>
      </div>

      {/* Era Breakdown */}
      <Section title="Era Breakdown" icon="&#128202;">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.era_breakdown.map(era => (
            <button
              key={era.era}
              onClick={() => setEraFilter(eraFilter === era.era ? null : era.era)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 0', width: '100%', textAlign: 'left',
                opacity: eraFilter && eraFilter !== era.era ? 0.4 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <span style={{
                fontSize: 13, fontWeight: 600, color: '#e2e8f0',
                minWidth: 180, flexShrink: 0,
              }}>
                {era.era}
              </span>
              <div style={{
                flex: 1, height: 20, borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(era.count / maxEraCount) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: 4,
                    backgroundColor: era.color,
                    minWidth: 2,
                  }}
                />
              </div>
              <span style={{
                fontSize: 13, fontWeight: 700, color: era.color,
                minWidth: 36, textAlign: 'right', fontFamily: 'monospace',
              }}>
                {era.count}
              </span>
            </button>
          ))}
        </div>
        {eraFilter && (
          <button
            onClick={() => setEraFilter(null)}
            style={{
              marginTop: 12, fontSize: 12, color: '#60a5fa',
              background: 'none', border: '1px solid rgba(96,165,250,0.3)',
              borderRadius: 6, padding: '4px 12px', cursor: 'pointer',
            }}
          >
            Clear filter
          </button>
        )}
      </Section>

      {/* Events */}
      <Section
        title={`Events${eraFilter ? ` \u2014 ${eraFilter}` : ''} (${data.events.length})`}
        icon="&#128218;"
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {data.events.map((ev, i) => {
            const catKey = (ev.category ?? 'political') as keyof typeof CATEGORY_COLORS;
            const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
            const icon = CATEGORY_ICONS[catKey] ?? '';

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5), duration: 0.25 }}
              >
                <Link to={`/event/${ev.slug}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${color}22`,
                      cursor: 'pointer',
                      transition: 'background 0.15s, border-color 0.15s',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.borderColor = `${color}44`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = `${color}22`;
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '2px 6px',
                        borderRadius: 4, backgroundColor: `${color}22`, color,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {ev.category ?? 'event'}
                      </span>
                      {ev.year_approx != null && (
                        <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>
                          {ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : ev.year_approx}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3,
                    }}>
                      {ev.title}
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{
                        fontSize: 10, color: '#64748b', padding: '2px 6px',
                        borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.05)',
                      }}>
                        {ev.era}
                      </span>
                      {/* Importance dot */}
                      <div style={{
                        marginLeft: 'auto',
                        width: 6, height: 6, borderRadius: '50%',
                        backgroundColor: ev.importance_score >= 0.9 ? '#22c55e'
                          : ev.importance_score >= 0.7 ? '#f59e0b'
                          : '#6b7280',
                      }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {data.events.length === 0 && (
          <div style={{
            padding: '20px', borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', fontSize: 13, fontStyle: 'italic',
          }}>
            No events found{eraFilter ? ` for ${eraFilter}` : ''}.
          </div>
        )}
      </Section>

      {/* Notable People */}
      {data.notable_people.length > 0 && (
        <Section title={`Notable People (${data.notable_people.length})`} icon="&#128100;">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {data.notable_people.map((person, i) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                style={{
                  padding: '16px 18px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(234,179,8,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {person.birth_year != null && (
                    <span>
                      {person.birth_year < 0 ? `${Math.abs(person.birth_year)} BCE` : person.birth_year}
                      {person.death_year != null && ` \u2013 ${person.death_year < 0 ? `${Math.abs(person.death_year)} BCE` : person.death_year}`}
                    </span>
                  )}
                </div>
                {person.roles && person.roles.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {person.roles.slice(0, 3).map(role => (
                      <span key={role} style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px',
                        borderRadius: 4, backgroundColor: 'rgba(234,179,8,0.12)',
                        color: '#eab308', textTransform: 'capitalize',
                      }}>
                        {role}
                      </span>
                    ))}
                  </div>
                )}
                {person.description && (
                  <div style={{
                    fontSize: 12, color: '#94a3b8', lineHeight: 1.5,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {person.description}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Neighboring Countries */}
      {data.neighboring_countries.length > 0 && (
        <Section title="Neighboring Countries" icon="&#127758;">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10,
          }}>
            {data.neighboring_countries.map(n => (
              <Link key={n.slug} to={`/country/${n.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                >
                  <span style={{ fontSize: 20 }}>{n.flag}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                      {n.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      {n.event_count} events
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Bottom nav */}
      <div style={{ padding: '24px 32px', display: 'flex', gap: 12 }}>
        <Link to="/countries" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, color: '#60a5fa',
          textDecoration: 'none', padding: '10px 20px', borderRadius: 8,
          border: '1px solid rgba(96,165,250,0.3)',
          backgroundColor: 'rgba(96,165,250,0.08)',
        }}>
          &#8592; All Countries
        </Link>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, color: '#94a3b8',
          textDecoration: 'none', padding: '10px 20px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}>
          Timeline
        </Link>
      </div>
    </PageShell>
  );
}

// ─── Shared components ──────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      backgroundColor: '#070e22', color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function StatBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 13, color: '#94a3b8', padding: '4px 10px',
      borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <span dangerouslySetInnerHTML={{ __html: icon }} /> {label}
    </span>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, color: '#475569',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span dangerouslySetInnerHTML={{ __html: icon }} />
        {title}
      </h2>
      {children}
    </section>
  );
}
