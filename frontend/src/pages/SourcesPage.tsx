/**
 * SourcesPage — curated library of famous primary historical documents.
 *
 * Route: /sources
 *
 * Features:
 *  - Document of the Day featured card (rotates by day of year)
 *  - Filter by era, category, difficulty
 *  - Search bar across all documents
 *  - Timeline view: horizontal time axis
 *  - Document cards with quotes, external links, related events
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PRIMARY_SOURCES,
  CATEGORY_COLORS,
  ERA_COLORS,
  DIFFICULTY_COLORS,
} from '../data/primarySources';
import type { PrimarySource, SourceCategory, Era, Difficulty } from '../data/primarySources';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getDocumentOfTheDay(): PrimarySource {
  const idx = getDayOfYear() % PRIMARY_SOURCES.length;
  return PRIMARY_SOURCES[idx];
}

const ALL_CATEGORIES: SourceCategory[] = ['Legal', 'Philosophy', 'Science', 'Literature', 'Political', 'Religious', 'Economic'];
const ALL_ERAS: Era[] = ['Ancient', 'Classical', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'];
const ALL_DIFFICULTIES: Difficulty[] = ['Easy Read', 'Accessible', 'Dense', 'Academic'];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function FilterPill({ label, active, color, onClick }: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        border: active ? `1px solid ${color}88` : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: active ? `${color}22` : 'transparent',
        color: active ? color : '#94a3b8',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  );
}

function DocumentCard({ source, featured }: { source: PrimarySource; featured?: boolean }) {
  const catColor = CATEGORY_COLORS[source.category];
  const eraColor = ERA_COLORS[source.era];
  const diffColor = DIFFICULTY_COLORS[source.difficulty];

  return (
    <div
      style={{
        backgroundColor: featured ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.03)',
        border: featured
          ? '1px solid rgba(59,130,246,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: featured ? '28px 28px 24px' : '22px 22px 18px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
        transition: 'border-color 0.15s, background-color 0.15s',
      }}
      onMouseEnter={(e) => {
        if (!featured) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!featured) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
        }
      }}
    >
      {/* Badges row */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, alignItems: 'center' }}>
        {featured && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
            backgroundColor: 'rgba(59,130,246,0.2)', color: '#60a5fa',
            textTransform: 'uppercase' as const, letterSpacing: '0.08em',
          }}>
            Document of the Day
          </span>
        )}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
          backgroundColor: `${catColor}22`, color: catColor,
          textTransform: 'uppercase' as const, letterSpacing: '0.06em',
        }}>
          {source.category}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
          backgroundColor: `${eraColor}22`, color: eraColor,
          textTransform: 'uppercase' as const, letterSpacing: '0.06em',
        }}>
          {source.era}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
          backgroundColor: `${diffColor}18`, color: diffColor,
        }}>
          {source.difficulty}
        </span>
      </div>

      {/* Title & metadata */}
      <div>
        <h3 style={{
          fontSize: featured ? 22 : 17,
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.25,
          margin: 0,
        }}>
          {source.title}
        </h3>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          {source.author} · {source.yearDisplay} · {source.origin}
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {source.description}
      </p>

      {/* Quote */}
      <blockquote style={{
        margin: 0,
        padding: '12px 16px',
        borderLeft: `3px solid ${catColor}66`,
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '0 8px 8px 0',
      }}>
        <p style={{
          fontSize: 13,
          color: '#cbd5e1',
          fontStyle: 'italic' as const,
          lineHeight: 1.6,
          margin: 0,
        }}>
          {source.quote}
        </p>
        <cite style={{
          display: 'block',
          fontSize: 11,
          color: '#64748b',
          marginTop: 6,
          fontStyle: 'normal' as const,
        }}>
          — {source.quoteAttribution}
        </cite>
      </blockquote>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginTop: 'auto', paddingTop: 4 }}>
        <Link
          to={`/?q=${encodeURIComponent(source.searchQuery)}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
            transition: 'background 0.15s',
          }}
        >
          Find related events →
        </Link>
        {source.readUrl && (
          <a
            href={source.readUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 600,
              color: '#10b981',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(16,185,129,0.3)',
              backgroundColor: 'rgba(16,185,129,0.08)',
              transition: 'background 0.15s',
            }}
          >
            Read it (free)
          </a>
        )}
      </div>
    </div>
  );
}

function TimelineView({ sources }: { sources: PrimarySource[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(
    () => [...sources].sort((a, b) => a.year - b.year),
    [sources],
  );

  if (sorted.length === 0) return null;

  const minYear = sorted[0].year;
  const maxYear = sorted[sorted.length - 1].year;
  const range = maxYear - minYear || 1;

  // Compute pixel position for a year
  const TIMELINE_WIDTH = Math.max(1200, sorted.length * 80);
  const yearToX = (year: number) => ((year - minYear) / range) * (TIMELINE_WIDTH - 80) + 40;

  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, color: '#475569',
        textTransform: 'uppercase' as const, letterSpacing: '0.08em',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        Timeline View
      </h2>
      <div
        ref={containerRef}
        style={{
          overflowX: 'auto',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.02)',
          padding: '20px 0 16px',
        }}
      >
        <div style={{ position: 'relative', width: TIMELINE_WIDTH, height: 130 }}>
          {/* Axis line */}
          <div style={{
            position: 'absolute',
            top: 60,
            left: 20,
            right: 20,
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 1,
          }} />

          {/* Era labels along axis */}
          {ALL_ERAS.map((era) => {
            const eraSources = sorted.filter((s) => s.era === era);
            if (eraSources.length === 0) return null;
            const startX = yearToX(eraSources[0].year);
            const endX = yearToX(eraSources[eraSources.length - 1].year);
            const midX = (startX + endX) / 2;
            return (
              <div
                key={era}
                style={{
                  position: 'absolute',
                  top: 72,
                  left: midX,
                  transform: 'translateX(-50%)',
                  fontSize: 9,
                  fontWeight: 700,
                  color: ERA_COLORS[era],
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap' as const,
                  opacity: 0.7,
                }}
              >
                {era}
              </div>
            );
          })}

          {/* Document dots */}
          {sorted.map((source) => {
            const x = yearToX(source.year);
            const catColor = CATEGORY_COLORS[source.category];
            return (
              <div
                key={source.id}
                style={{
                  position: 'absolute',
                  left: x,
                  top: 20,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'default',
                }}
                title={`${source.title} (${source.yearDisplay})`}
              >
                {/* Vertical tick */}
                <div style={{
                  width: 1, height: 24,
                  backgroundColor: `${catColor}44`,
                }} />
                {/* Dot */}
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: catColor,
                  boxShadow: `0 0 8px ${catColor}66`,
                  flexShrink: 0,
                }} />
                {/* Year label */}
                <div style={{
                  fontSize: 8, color: '#64748b',
                  whiteSpace: 'nowrap' as const,
                  marginTop: 12,
                }}>
                  {source.yearDisplay}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#475569', marginTop: 8, textAlign: 'center' as const }}>
        Scroll horizontally to explore · {sorted.length} documents plotted
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function SourcesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<SourceCategory>>(new Set());
  const [selectedEras, setSelectedEras] = useState<Set<Era>>(new Set());
  const [selectedDifficulties, setSelectedDifficulties] = useState<Set<Difficulty>>(new Set());

  const documentOfTheDay = useMemo(() => getDocumentOfTheDay(), []);

  // Override root overflow for scrollable page
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

  const toggleFilter = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    return PRIMARY_SOURCES.filter((s) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(s.category)) return false;
      if (selectedEras.size > 0 && !selectedEras.has(s.era)) return false;
      if (selectedDifficulties.size > 0 && !selectedDifficulties.has(s.difficulty)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.yearDisplay.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, selectedCategories, selectedEras, selectedDifficulties]);

  const hasFilters = selectedCategories.size > 0 || selectedEras.size > 0 || selectedDifficulties.size > 0 || search.trim().length > 0;

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ padding: '40px 0 24px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 24,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ← Back to Timeline
          </Link>

          <h1 style={{
            fontSize: 'clamp(26px, 4vw, 38px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            Primary Sources Library
          </h1>
          <p style={{
            fontSize: 15,
            color: '#64748b',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 640,
          }}>
            A curated collection of {PRIMARY_SOURCES.length} famous documents that shaped human history — from ancient law codes to modern manifestos. Read the originals, explore their context.
          </p>
        </div>

        {/* Document of the Day */}
        <div style={{ marginBottom: 32 }}>
          <DocumentCard source={documentOfTheDay} featured />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, author, origin, or keyword..."
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              color: '#f1f5f9',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box' as const,
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          />
        </div>

        {/* Filters */}
        <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {/* Category filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, minWidth: 64 }}>Category</span>
            {ALL_CATEGORIES.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={selectedCategories.has(cat)}
                color={CATEGORY_COLORS[cat]}
                onClick={() => toggleFilter(selectedCategories, cat, setSelectedCategories)}
              />
            ))}
          </div>
          {/* Era filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, minWidth: 64 }}>Era</span>
            {ALL_ERAS.map((era) => (
              <FilterPill
                key={era}
                label={era}
                active={selectedEras.has(era)}
                color={ERA_COLORS[era]}
                onClick={() => toggleFilter(selectedEras, era, setSelectedEras)}
              />
            ))}
          </div>
          {/* Difficulty filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600, minWidth: 64 }}>Difficulty</span>
            {ALL_DIFFICULTIES.map((d) => (
              <FilterPill
                key={d}
                label={d}
                active={selectedDifficulties.has(d)}
                color={DIFFICULTY_COLORS[d]}
                onClick={() => toggleFilter(selectedDifficulties, d, setSelectedDifficulties)}
              />
            ))}
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setSelectedCategories(new Set());
                setSelectedEras(new Set());
                setSelectedDifficulties(new Set());
                setSearch('');
              }}
              style={{
                alignSelf: 'flex-start',
                fontSize: 11,
                color: '#64748b',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 6,
                padding: '4px 10px',
                cursor: 'pointer',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 16 }}>
          Showing {filtered.length} of {PRIMARY_SOURCES.length} documents
        </div>

        {/* Timeline */}
        <TimelineView sources={filtered} />

        {/* Document grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: 20,
          paddingBottom: 60,
        }}>
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              padding: '40px 20px',
              textAlign: 'center' as const,
              color: '#64748b',
              fontSize: 14,
              fontStyle: 'italic' as const,
            }}>
              No documents match your filters. Try broadening your search.
            </div>
          ) : (
            filtered.map((source) => (
              <DocumentCard key={source.id} source={source} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
