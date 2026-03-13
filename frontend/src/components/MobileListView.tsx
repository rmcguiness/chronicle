import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { HistoricalEvent, EventCategory } from '../types';
import { fetchTiles } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_ICONS } from '../utils/categories';
import MobileBottomSheet from './MobileBottomSheet';

const ALL_CATEGORIES: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BC`;
  return String(year);
}

function importanceStars(score: number): string {
  if (score >= 0.9) return '★★★';
  if (score >= 0.7) return '★★';
  return '★';
}

interface Props {
  onSwitchToDesktop: () => void;
}

export default function MobileListView({ onSwitchToDesktop }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const setUsingMockData = useAppStore((s) => s.setUsingMockData);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Fetch all events with a wide viewport
  const { data, isLoading } = useQuery({
    queryKey: ['mobile-all-events'],
    queryFn: () =>
      fetchTiles({
        year_min: -5000,
        year_max: 2100,
        lat_min: -90,
        lat_max: 90,
        zoom: 10, // high zoom = low importance threshold = show everything
      }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data && data.events.length <= 10) {
      setUsingMockData(true);
    }
  }, [data, setUsingMockData]);

  const events = useMemo(() => {
    if (!data) return [];
    let filtered = [...data.events];

    // Category filter
    if (activeCategory) {
      filtered = filtered.filter((e) => e.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.geo_modern?.toLowerCase().includes(q) ||
          e.geo_era_label?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Sort chronologically
    filtered.sort((a, b) => a.year_approx - b.year_approx);
    return filtered;
  }, [data, activeCategory, search]);

  const handleCategoryTap = useCallback((cat: EventCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#070e22',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        color: '#f1f5f9',
      }}
    >
      {/* Sticky header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: '#0f172a',
          borderBottom: '1px solid #1e293b',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>Chronicle</span>
          <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Historical Timeline</span>
        </div>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: 8,
            color: '#f1f5f9',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category filter bar */}
      <div
        ref={filterBarRef}
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 16px',
          overflowX: 'auto',
          background: '#0b1328',
          borderBottom: '1px solid #1e293b',
          flexShrink: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryTap(cat)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 12px',
                borderRadius: 16,
                border: `1px solid ${isActive ? CATEGORY_COLORS[cat] : '#334155'}`,
                background: isActive ? `${CATEGORY_COLORS[cat]}20` : 'transparent',
                color: isActive ? CATEGORY_COLORS[cat] : '#94a3b8',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading events...</div>
        )}

        {!isLoading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            No events found{search ? ` for "${search}"` : ''}.
          </div>
        )}

        {events.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            style={{
              display: 'flex',
              width: '100%',
              textAlign: 'left',
              padding: '12px 14px',
              marginBottom: 6,
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            {/* Year column */}
            <div
              style={{
                minWidth: 56,
                fontSize: 13,
                fontWeight: 700,
                color: '#94a3b8',
                paddingTop: 2,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {formatYear(event.year_approx)}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {/* Category dot */}
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: CATEGORY_COLORS[event.category],
                    flexShrink: 0,
                  }}
                />
                {/* Title */}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#e2e8f0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.title}
                </span>
                {/* Importance stars */}
                <span style={{ color: '#eab308', fontSize: 11, marginLeft: 'auto', flexShrink: 0 }}>
                  {importanceStars(event.importance_score)}
                </span>
              </div>

              {/* Description line — location / era */}
              <div
                style={{
                  fontSize: 12,
                  color: '#64748b',
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {event.geo_modern || event.geo_era_label || ''}
                {event.geo_modern && event.geo_era_label ? ` — ${event.geo_era_label}` : ''}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop mode FAB */}
      <button
        onClick={onSwitchToDesktop}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: 22,
          background: '#1e293b',
          border: '1px solid #334155',
          color: '#94a3b8',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          fontFamily: "'Inter', sans-serif",
        }}
        title="Switch to desktop view"
      >
        🖥
      </button>

      {/* Bottom sheet detail */}
      <MobileBottomSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
