/**
 * CountriesPage — directory listing all countries with event counts.
 *
 * Route: /countries
 *
 * Groups countries by region with flag emojis and event counts.
 * Links to individual /country/:slug detail pages.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCountries } from '../api/client';

// Region colors for grouping headers
const REGION_COLORS: Record<string, string> = {
  'Europe': '#3b82f6',
  'Americas': '#22c55e',
  'Asia': '#f97316',
  'Middle East': '#ef4444',
  'Africa': '#a855f7',
  'Oceania': '#14b8a6',
  'Europe / Asia': '#6366f1',
  'Other': '#6b7280',
};

interface CountryItem {
  name: string;
  slug: string;
  flag: string;
  region: string;
  event_count: number;
}

export default function CountriesPage() {
  const [search, setSearch] = useState('');

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 10 * 60 * 1000,
  });

  const countries = data?.countries ?? [];
  const filtered = search
    ? countries.filter((c: CountryItem) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  // Group by region
  const grouped: Record<string, CountryItem[]> = {};
  for (const c of filtered) {
    const r = c.region;
    if (!grouped[r]) grouped[r] = [];
    grouped[r].push(c);
  }

  const regionOrder = ['Europe', 'Americas', 'Asia', 'Middle East', 'Africa', 'Oceania', 'Europe / Asia', 'Other'];
  const sortedRegions = Object.keys(grouped).sort(
    (a, b) => (regionOrder.indexOf(a) === -1 ? 99 : regionOrder.indexOf(a)) -
              (regionOrder.indexOf(b) === -1 ? 99 : regionOrder.indexOf(b))
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{
          padding: '40px 0 32px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
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

          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            Countries
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', margin: 0 }}>
            Explore historical events by country. {countries.length} countries with recorded events.
          </p>

          {/* Search */}
          <div style={{ marginTop: 20, maxWidth: 400 }}>
            <input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
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
          </div>
        </div>

        {/* Loading / Error */}
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
            Loading countries...
          </div>
        )}

        {isError && (
          <div style={{
            margin: '32px 0', padding: '20px 24px', borderRadius: 10,
            backgroundColor: '#ef444418', border: '1px solid #ef444444',
            color: '#fca5a5', fontSize: 14,
          }}>
            Failed to load countries. Make sure the backend is running.
          </div>
        )}

        {/* Country groups */}
        {!isLoading && !isError && (
          <div style={{ paddingBottom: 60 }}>
            {sortedRegions.map(region => (
              <div key={region} style={{ marginTop: 36 }}>
                <h2 style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: REGION_COLORS[region] ?? '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    backgroundColor: REGION_COLORS[region] ?? '#94a3b8',
                    display: 'inline-block',
                  }} />
                  {region}
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: '#64748b',
                    textTransform: 'none', letterSpacing: 'normal',
                  }}>
                    ({grouped[region].length})
                  </span>
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12,
                }}>
                  {grouped[region].map((c, i) => (
                    <motion.div
                      key={c.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.25 }}
                    >
                      <Link
                        to={`/country/${c.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            padding: '14px 16px',
                            borderRadius: 10,
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            transition: 'background 0.15s, border-color 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = `${REGION_COLORS[region] ?? '#94a3b8'}44`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          }}
                        >
                          <span style={{ fontSize: 24 }}>{c.flag}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 14, fontWeight: 600, color: '#e2e8f0',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {c.name}
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                              {c.event_count} event{c.event_count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {sortedRegions.length === 0 && search && (
              <div style={{
                padding: '40px 0', textAlign: 'center', color: '#64748b', fontSize: 14,
              }}>
                No countries match "{search}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
