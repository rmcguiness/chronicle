/**
 * PersonDetailPage — full-page view for a historical figure.
 *
 * Route: /people/:slug
 *
 * Sections: Hero (name, lifespan, roles), biography, events timeline,
 * contemporaries, back-to-timeline link.
 */

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { fetchPersonDetail } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory, PersonEventItem, ContemporaryItem } from '../types';

function formatYear(year: number | null, circa?: boolean): string {
  if (year === null) return '?';
  const suffix = circa ? ' c.' : '';
  if (year < 0) return `${Math.abs(year)} BCE${suffix}`;
  return `${year} CE${suffix}`;
}

function EventRow({ event }: { event: PersonEventItem }) {
  const color = CATEGORY_COLORS[(event.category as EventCategory) ?? 'person'] ?? '#6b7280';
  const icon = CATEGORY_ICONS[(event.category as EventCategory) ?? 'person'] ?? '●';

  return (
    <Link
      to={`/event/${event.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          padding: '12px 16px',
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 8,
          transition: 'background 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
        }}
      >
        <div style={{ flexShrink: 0, textAlign: 'center', width: 60 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>
            {event.year_approx !== null ? formatYear(event.year_approx) : '?'}
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: 4,
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: `${color}22`,
              color,
              textTransform: 'uppercase',
            }}
          >
            {icon} {event.category ?? 'event'}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{event.title}</div>
          {event.role && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
              Role: {event.role}{event.role_notes ? ` — ${event.role_notes}` : ''}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function ContemporaryChip({ person }: { person: ContemporaryItem }) {
  return (
    <Link to={`/people/${person.slug}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e2e8f0',
          cursor: 'pointer',
          fontSize: 12,
          transition: 'background 0.15s',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#eab308',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          👤
        </span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.2 }}>{person.name}</div>
          {(person.birth_year !== null || person.death_year !== null) && (
            <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.2 }}>
              {formatYear(person.birth_year)} — {formatYear(person.death_year)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 18,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

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

  const { data: person, isLoading, isError, error } = useQuery({
    queryKey: ['person', slug],
    queryFn: () => fetchPersonDetail(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Shell>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, color: '#64748b' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#eab308', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: 14 }}>Loading person…</span>
        </div>
      </Shell>
    );
  }

  if (isError || !person) {
    return (
      <Shell>
        <div style={{ padding: '40px 32px' }}>
          <BackLink />
          <div style={{ padding: '20px 24px', borderRadius: 10, backgroundColor: '#ef444418', border: '1px solid #ef444444', color: '#fca5a5', fontSize: 14 }}>
            <strong>Error:</strong> {error instanceof Error ? error.message : `Person "${slug}" not found.`}
          </div>
        </div>
      </Shell>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/people/${person.slug}`);
  };

  return (
    <Shell>
      {/* Hero */}
      <div style={{ padding: '40px 32px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(234,179,8,0.06) 100%)' }}>
        <BackLink />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: '0 0 20px rgba(234,179,8,0.3)' }}>👤</span>
          <div>
            <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, margin: 0 }}>{person.name}</h1>
            <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>
              {formatYear(person.birth_year, person.birth_year_circa)} — {formatYear(person.death_year, person.death_year_circa)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {person.roles?.map((role) => (
            <span key={role} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, backgroundColor: 'rgba(234,179,8,0.15)', color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{role}</span>
          ))}
          {person.nationalities?.map((n) => (
            <span key={n} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>{n}</span>
          ))}
          <button onClick={handleShare} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa', cursor: 'pointer' }}>🔗 Share</button>
        </div>
      </div>

      {/* Biography */}
      <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2 style={sectionHeaderStyle}><span>📖</span> Biography</h2>
        {person.description ? (
          <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{person.description}</p>
        ) : (
          <p style={{ fontSize: 14, color: '#64748b', fontStyle: 'italic', margin: 0 }}>No biography available yet.</p>
        )}
        {person.wikipedia_slug && (
          <a href={`https://en.wikipedia.org/wiki/${person.wikipedia_slug}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 12, fontSize: 13, color: '#60a5fa', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(96,165,250,0.3)', backgroundColor: 'rgba(96,165,250,0.08)' }}>
            Read more on Wikipedia →
          </a>
        )}
      </section>

      {/* Events timeline */}
      {person.events.length > 0 && (
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={sectionHeaderStyle}><span>📅</span> Events ({person.events.length})</h2>
          {person.events.map((evt, i) => (
            <EventRow key={`${evt.id}-${evt.role}-${i}`} event={evt} />
          ))}
        </section>
      )}

      {/* Contemporaries */}
      {person.contemporaries.length > 0 && (
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={sectionHeaderStyle}><span>👥</span> Contemporaries ({person.contemporaries.length})</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {person.contemporaries.map((c) => (
              <ContemporaryChip key={c.id} person={c} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <div style={{ padding: '24px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#60a5fa', textDecoration: 'none', padding: '10px 20px', borderRadius: 8, border: '1px solid rgba(96,165,250,0.3)', backgroundColor: 'rgba(96,165,250,0.08)' }}>
          ← Back to Timeline
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 24, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
      ← Back to Timeline
    </Link>
  );
}
