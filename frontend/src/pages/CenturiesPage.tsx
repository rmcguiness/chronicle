/**
 * CenturiesPage — browse all centuries that contain historical events.
 * Route: /centuries
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchCenturies, type CenturySummary } from '../api/client';
import { CATEGORY_COLORS } from '../utils/categories';
import type { EventCategory } from '../types';

function eraColor(c: CenturySummary): string {
  if (c.is_bce) return '#8b5cf6';
  if (c.century_number <= 5) return '#a855f7';
  if (c.century_number <= 15) return '#f59e0b';
  if (c.century_number <= 18) return '#f97316';
  if (c.century_number <= 20) return '#3b82f6';
  return '#22c55e';
}

function eraLabel(c: CenturySummary): string {
  if (c.is_bce) return 'Ancient';
  if (c.century_number <= 5) return 'Classical';
  if (c.century_number <= 15) return 'Medieval';
  if (c.century_number <= 18) return 'Early Modern';
  if (c.century_number <= 20) return 'Modern';
  return 'Contemporary';
}

type SortField = 'label' | 'event_count' | 'era';
type SortDir = 'asc' | 'desc';

function sortValue(c: CenturySummary, field: SortField): number | string {
  if (field === 'event_count') return c.event_count;
  if (field === 'era') return (c.is_bce ? -1 : 1) * c.century_number;
  return c.label;
}

export default function CenturiesPage() {
  const { data: centuries, isLoading, error } = useQuery({
    queryKey: ['centuries'],
    queryFn: fetchCenturies,
  });

  const [sortField, setSortField] = useState<SortField>('era');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    if (!centuries) return [];
    const copy = [...centuries];
    copy.sort((a, b) => {
      const av = sortValue(a, sortField);
      const bv = sortValue(b, sortField);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [centuries, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  const sortArrow = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : '';

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
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Centuries</span>
      </nav>

      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          Browse by Century
        </motion.h1>
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 600 }}>
          Explore history one century at a time — from the ancient world to the modern era.
        </p>
      </header>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>Loading centuries...</div>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: 64, color: '#ef4444' }}>
          Failed to load centuries. Is the backend running?
        </div>
      )}

      {centuries && centuries.length > 0 && (
        <>
          {/* Timeline bar */}
          <section style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                gap: 12,
                overflowX: 'auto',
                paddingBottom: 16,
                scrollSnapType: 'x mandatory',
              }}
            >
              {centuries.map((c, i) => (
                <motion.div
                  key={c.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <Link to={`/century/${c.key}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div
                      style={{
                        minWidth: 180,
                        padding: '16px 16px 14px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${eraColor(c)}33`,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = eraColor(c);
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                        (e.currentTarget as HTMLDivElement).style.borderColor = `${eraColor(c)}33`;
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          background: `${eraColor(c)}22`,
                          color: eraColor(c),
                          marginBottom: 8,
                        }}
                      >
                        {eraLabel(c)}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>{c.year_range}</div>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: 'rgba(255,255,255,0.1)',
                        }}
                      >
                        {c.event_count} event{c.event_count !== 1 ? 's' : ''}
                      </div>
                      {c.top_categories.length > 0 && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                          {c.top_categories.map((cat) => (
                            <span
                              key={cat}
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: CATEGORY_COLORS[cat as EventCategory] || '#6b7280',
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {c.most_important_event && (
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            color: '#cbd5e1',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 160,
                          }}
                        >
                          {c.most_important_event.title}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sortable table */}
          <section style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>All Centuries</h2>
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th
                      onClick={() => toggleSort('era')}
                      style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}
                    >
                      Century{sortArrow('era')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#94a3b8' }}>
                      Year Range
                    </th>
                    <th
                      onClick={() => toggleSort('event_count')}
                      style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}
                    >
                      Events{sortArrow('event_count')}
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#94a3b8' }}>
                      Key Event
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((c) => (
                    <tr
                      key={c.key}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '10px 16px' }}>
                        <Link to={`/century/${c.key}`} style={{ color: eraColor(c), textDecoration: 'none', fontWeight: 600 }}>
                          {c.label}
                        </Link>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#94a3b8' }}>{c.year_range}</td>
                      <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600 }}>{c.event_count}</td>
                      <td style={{ padding: '10px 16px', color: '#cbd5e1', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.most_important_event ? (
                          <Link to={`/event/${c.most_important_event.slug}`} style={{ color: '#cbd5e1', textDecoration: 'none' }}>
                            {c.most_important_event.title}
                          </Link>
                        ) : '\u2014'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
