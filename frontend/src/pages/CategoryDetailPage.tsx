/**
 * CategoryDetailPage — paginated events for a single category with filters.
 *
 * Route: /categories/:category
 *
 * Features:
 *  - Era filter (Ancient/Medieval/Early Modern/Modern/Contemporary)
 *  - Region dropdown filter
 *  - Sort (by year asc/desc, by importance)
 *  - 24 events per page with prev/next pagination
 *  - Century distribution timeline at bottom
 *
 * Does NOT own: category overview, event detail, routing setup.
 */

import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryDetail } from '../api/client';
import CategoryEventCard from '../components/CategoryEventCard';
import CategoryTimeline from '../components/CategoryTimeline';
import {
  getCategoryEmoji,
  getCategoryLabel,
  CATEGORY_ACCENT_COLORS,
  ERA_OPTIONS,
  SORT_OPTIONS,
  EVENTS_PER_PAGE,
} from '../utils/categoryConstants';

/** Stale time for category detail queries (2 minutes). */
const DETAIL_STALE_TIME = 2 * 60 * 1000;

/** Number of skeleton cards to show while loading. */
const SKELETON_COUNT = 12;

/**
 * Loading skeleton for an event card.
 */
function EventCardSkeleton() {
  return (
    <div
      style={{
        background: '#f1f5f9',
        borderRadius: 12,
        padding: 20,
        height: 160,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

/**
 * CategoryDetailPage — renders filtered, paginated events for one category.
 */
export default function CategoryDetailPage() {
  const { category = '' } = useParams<{ category: string }>();
  const [era, setEra] = useState('');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('year_asc');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['category-detail', category, era, region, sort, page],
    queryFn: () =>
      fetchCategoryDetail(category, {
        era: era || undefined,
        region: region || undefined,
        sort,
        page,
        limit: EVENTS_PER_PAGE,
      }),
    staleTime: DETAIL_STALE_TIME,
    enabled: !!category,
  });

  const handleEraClick = useCallback((newEra: string) => {
    setEra((prev) => (prev === newEra ? '' : newEra));
    setPage(1);
  }, []);

  const emoji = getCategoryEmoji(category);
  const label = getCategoryLabel(category);
  const accent = CATEGORY_ACCENT_COLORS[category] ?? '#3b82f6';

  /** Common select styling. */
  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    background: '#fff',
    color: '#1e293b',
    cursor: 'pointer',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          padding: '40px 24px 32px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
              ← Timeline
            </Link>
            <Link to="/categories" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
              / Categories
            </Link>
          </div>
          <h1 style={{ margin: '8px 0', fontSize: 28, fontWeight: 800 }}>
            {emoji} Events: {label}
          </h1>
          {data && (
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 15 }}>
              {data.total.toLocaleString()} events found
            </p>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 24,
            alignItems: 'center',
          }}
        >
          {/* Era pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ERA_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setEra(opt.value); setPage(1); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: era === opt.value ? accent : '#e2e8f0',
                  color: era === opt.value ? '#fff' : '#475569',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Region dropdown */}
          {data && data.regions.length > 0 && (
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); setPage(1); }}
              style={selectStyle}
            >
              <option value="">All Regions</option>
              {data.regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            style={selectStyle}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Error state */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, color: '#dc2626', marginBottom: 24 }}>
            Failed to load events. Please try again.
          </div>
        )}

        {/* Event grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => <EventCardSkeleton key={i} />)
            : data?.events.map((ev, i) => (
                <CategoryEventCard key={ev.id} event={ev} index={i} />
              ))}
        </div>

        {/* Empty state */}
        {data && data.events.length === 0 && !isLoading && (
          <div style={{ textAlign: 'center', padding: 48, color: '#64748b' }}>
            <p style={{ fontSize: 48, margin: '0 0 16px' }}>🔍</p>
            <p style={{ fontSize: 16 }}>No events found with these filters.</p>
          </div>
        )}

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              marginTop: 32,
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: page <= 1 ? '#f1f5f9' : '#fff',
                color: page <= 1 ? '#94a3b8' : '#1e293b',
                fontWeight: 600,
                fontSize: 14,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: 14, color: '#64748b' }}>
              Page {data.page} of {data.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={page >= data.pages}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                background: page >= data.pages ? '#f1f5f9' : '#fff',
                color: page >= data.pages ? '#94a3b8' : '#1e293b',
                fontWeight: 600,
                fontSize: 14,
                cursor: page >= data.pages ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* Timeline distribution */}
        {data && data.timeline.length > 0 && (
          <CategoryTimeline timeline={data.timeline} onEraClick={handleEraClick} />
        )}
      </main>

      {/* Pulse animation for skeletons */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
