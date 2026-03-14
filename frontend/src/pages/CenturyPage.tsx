/**
 * CenturyPage — detailed view for a single century.
 * Route: /century/:century
 */

import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchCenturyDetail, type CenturyEvent, type NotablePerson } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

function eraColor(c: { is_bce: boolean; century_number: number }): string {
  if (c.is_bce) return '#8b5cf6';
  if (c.century_number <= 5) return '#a855f7';
  if (c.century_number <= 15) return '#f59e0b';
  if (c.century_number <= 18) return '#f97316';
  if (c.century_number <= 20) return '#3b82f6';
  return '#22c55e';
}

function eraLabel(c: { is_bce: boolean; century_number: number }): string {
  if (c.is_bce) return 'Ancient';
  if (c.century_number <= 5) return 'Classical';
  if (c.century_number <= 15) return 'Medieval';
  if (c.century_number <= 18) return 'Early Modern';
  if (c.century_number <= 20) return 'Modern';
  return 'Contemporary';
}

function formatYear(year: number, isBce: boolean): string {
  return isBce ? `${year} BCE` : String(year);
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        flex: '1 1 0',
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function EventCard({ event, isBce }: { event: CenturyEvent; isBce: boolean }) {
  const catColor = CATEGORY_COLORS[(event.category ?? 'political') as EventCategory] || '#6b7280';
  const catLabel = CATEGORY_LABELS[(event.category ?? 'political') as EventCategory] || event.category || 'Unknown';

  return (
    <Link to={`/event/${event.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '16px 20px',
          borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.07)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{event.title}</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>
              {formatYear(event.year_approx, isBce)}
              {event.geo_modern && <> &middot; {event.geo_modern}</>}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${catColor}22`,
                color: catColor,
              }}
            >
              {catLabel}
            </span>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              {Math.round(event.importance_score * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function PersonCard({ person }: { person: NotablePerson }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {person.image_url ? (
        <img
          src={person.image_url}
          alt={person.name}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            color: '#94a3b8',
          }}
        >
          {person.name.charAt(0)}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{person.name}</div>
        {person.roles.length > 0 && (
          <div style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {person.roles.join(', ')}
          </div>
        )}
      </div>
      {person.birth_year != null && (
        <div style={{ fontSize: 11, color: '#64748b', flexShrink: 0 }}>
          {person.birth_year}\u2013{person.death_year ?? '?'}
        </div>
      )}
    </div>
  );
}

export default function CenturyPage() {
  const { century } = useParams<{ century: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['century', century],
    queryFn: () => fetchCenturyDetail(century!),
    enabled: !!century,
  });

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading century...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#e2e8f0',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <div style={{ color: '#ef4444', fontSize: 18 }}>Century not found</div>
        <Link to="/centuries" style={{ color: '#3b82f6', textDecoration: 'none' }}>
          Back to centuries
        </Link>
      </div>
    );
  }

  const color = eraColor(data);
  const era = eraLabel(data);
  const catEntries = Object.entries(data.category_distribution).sort((a, b) => b[1] - a[1]);
  const canvasYearMin = data.is_bce ? -(data.year_end) : data.year_start;
  const canvasYearMax = data.is_bce ? -(data.year_start) : data.year_end;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Chronicle</Link>
        <span style={{ color: '#475569' }}>/</span>
        <Link to="/centuries" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Centuries</Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>{data.label}</span>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 64px' }}>
        <header style={{ padding: '48px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: `${color}22`, color }}>{era}</span>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>{data.year_range}</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
            The {data.label}
          </motion.h1>
        </header>

        <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          <StatCard label="Total Events" value={data.event_count} />
          <StatCard label="Categories" value={catEntries.length} />
          <StatCard label="Notable People" value={data.notable_people_count} />
          <StatCard label="Decades Covered" value={data.decade_breakdown.length} />
        </section>

        {catEntries.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Categories</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {catEntries.map(([cat, count]) => {
                const cc = CATEGORY_COLORS[cat as EventCategory] || '#6b7280';
                const cl = CATEGORY_LABELS[cat as EventCategory] || cat;
                return (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: `${cc}15`, border: `1px solid ${cc}33` }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cc }} />
                    <span style={{ fontSize: 13, color: cc, fontWeight: 600 }}>{cl}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>({count})</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Top Events</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.top_events.map((event) => (
              <EventCard key={event.id} event={event} isBce={data.is_bce} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>By Decade</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {data.decade_breakdown.map((dec) => (
              <div key={dec.decade}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color, marginBottom: 8, borderBottom: `1px solid ${color}33`, paddingBottom: 6 }}>
                  {dec.decade_label}
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400, marginLeft: 8 }}>
                    ({dec.events.length} event{dec.events.length !== 1 ? 's' : ''})
                  </span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {dec.events.map((event) => {
                    const cc = CATEGORY_COLORS[(event.category ?? 'political') as EventCategory] || '#6b7280';
                    return (
                      <Link
                        key={event.id}
                        to={`/event/${event.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, transition: 'background 0.1s' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: cc, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, width: 60, flexShrink: 0 }}>
                          {formatYear(event.year_approx, data.is_bce)}
                        </span>
                        <span style={{ fontSize: 14 }}>{event.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {data.notable_people.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Notable People</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
              {data.notable_people.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 32, textAlign: 'center' }}>
          <Link
            to={`/#year_min=${canvasYearMin}&year_max=${canvasYearMax}`}
            style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: `${color}22`, border: `1px solid ${color}55`, color, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
          >
            Explore on canvas
          </Link>
        </section>

        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {data.prev_century ? (
            <Link to={`/century/${data.prev_century}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              &larr; Previous century
            </Link>
          ) : <span />}
          {data.next_century && (
            <Link to={`/century/${data.next_century}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              Next century &rarr;
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
