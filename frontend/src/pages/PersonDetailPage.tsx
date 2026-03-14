/**
 * PersonDetailPage — detail page for a single historical figure.
 *
 * Route: /people/:slug
 */
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchPeople, type PersonListItem } from '../api/client';

function formatYear(year: number | null, circa?: boolean): string {
  if (year === null) return '?';
  const prefix = circa ? 'c.\u00A0' : '';
  if (year < 0) return `${prefix}${Math.abs(year)} BCE`;
  return `${prefix}${year}`;
}

export default function PersonDetailPage() {
  const { slug } = useParams<{ slug: string }>();

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

  const { data, isLoading } = useQuery({
    queryKey: ['people'],
    queryFn: () => fetchPeople(),
    staleTime: 10 * 60 * 1000,
  });

  const person = useMemo(() => {
    return data?.people.find((p: PersonListItem) => p.slug === slug) ?? null;
  }, [data, slug]);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <Link
          to="/people"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#64748b', textDecoration: 'none',
            marginBottom: 32, padding: '6px 12px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          &#8592; Back to People
        </Link>

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
          </div>
        )}

        {!isLoading && !person && (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '60px 0' }}>
            Person not found.
          </div>
        )}

        {person && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              {person.name}
            </h1>
            <div style={{ fontSize: 16, color: '#94a3b8', marginBottom: 24 }}>
              {formatYear(person.birth_year, person.birth_year_circa)}
              {' \u2013 '}
              {formatYear(person.death_year, person.death_year_circa)}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {person.roles?.map((role: string) => (
                <span key={role} style={{
                  fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 12,
                  backgroundColor: '#6366f122', border: '1px solid #6366f144', color: '#a5b4fc',
                  textTransform: 'capitalize',
                }}>
                  {role}
                </span>
              ))}
              {person.nationalities?.map((n: string) => (
                <span key={n} style={{
                  fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}>
                  {n}
                </span>
              ))}
            </div>

            {/* Description */}
            {person.description && (
              <div style={{
                padding: '20px 24px', borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 14, lineHeight: 1.7, color: '#cbd5e1',
                marginBottom: 24,
              }}>
                {person.description}
              </div>
            )}

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{
                padding: '14px 20px', borderRadius: 10,
                backgroundColor: '#3b82f612', border: '1px solid #3b82f633',
                fontSize: 14, color: '#60a5fa',
              }}>
                <span style={{ fontWeight: 700, fontSize: 20 }}>{person.event_count}</span>
                <span style={{ marginLeft: 8 }}>linked event{person.event_count !== 1 ? 's' : ''}</span>
              </div>
              {person.wikipedia_slug && (
                <a
                  href={`https://en.wikipedia.org/wiki/${person.wikipedia_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '14px 20px', borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 14, color: '#94a3b8', textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                >
                  Wikipedia &#8599;
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
