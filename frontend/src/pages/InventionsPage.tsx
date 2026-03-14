/**
 * InventionsPage — curated timeline of world-changing inventions and discoveries.
 *
 * Route: /inventions
 *
 * Features:
 *  - Vertical alternating timeline layout with year markers
 *  - Filter by category, impact, and era
 *  - Search bar
 *  - Chronological vs Most Impactful sort
 *  - Links to Chronicle search for each invention
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  INVENTIONS,
  CATEGORY_COLORS,
  ERA_COLORS,
  type InventionCategory,
  type Era,
  type Invention,
} from '../data/inventions';

const ALL_CATEGORIES: InventionCategory[] = [
  'Science',
  'Technology',
  'Medicine',
  'Communication',
  'Transportation',
  'Agriculture',
];

const ALL_ERAS: Era[] = ['Ancient', 'Medieval', 'Early Modern', 'Industrial', 'Modern', 'Digital'];

type SortMode = 'chronological' | 'impact';

function Stars({ count }: { count: number }) {
  return (
    <span style={{ letterSpacing: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? '#fbbf24' : '#334155', fontSize: 14 }}>
          ★
        </span>
      ))}
    </span>
  );
}

function yearSpan(): string {
  const sorted = [...INVENTIONS].sort((a, b) => a.year - b.year);
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  const span = newest.year - oldest.year;
  if (span > 1_000_000) return `${(span / 1_000_000).toFixed(1)} million`;
  if (span > 1000) return `${Math.round(span / 1000).toLocaleString()},000+`;
  return span.toLocaleString();
}

export default function InventionsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<InventionCategory | null>(null);
  const [eraFilter, setEraFilter] = useState<Era | null>(null);
  const [impactFilter, setImpactFilter] = useState(false); // show only 4-5 star
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  // Allow scrolling on this page
  useEffect(() => {
    const root = document.getElementById('root');
    const html = document.documentElement;
    const body = document.body;
    if (root) root.style.overflow = 'auto';
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    return () => {
      if (root) root.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    };
  }, []);

  const filtered = useMemo(() => {
    let items = [...INVENTIONS];

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (inv) =>
          inv.name.toLowerCase().includes(q) ||
          inv.inventor.toLowerCase().includes(q) ||
          inv.origin.toLowerCase().includes(q) ||
          inv.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter) {
      items = items.filter((inv) => inv.category === categoryFilter);
    }

    if (eraFilter) {
      items = items.filter((inv) => inv.era === eraFilter);
    }

    if (impactFilter) {
      items = items.filter((inv) => inv.impact >= 4);
    }

    if (sortMode === 'chronological') {
      items.sort((a, b) => a.year - b.year);
    } else {
      items.sort((a, b) => b.impact - a.impact || a.year - b.year);
    }

    return items;
  }, [search, categoryFilter, eraFilter, impactFilter, sortMode]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav breadcrumb */}
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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Inventions</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 16px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          Inventions &amp; Discoveries
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 700 }}
        >
          A curated timeline of humanity's most transformative breakthroughs — from stone tools to
          artificial intelligence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'inline-block',
            fontSize: 14,
            color: '#cbd5e1',
          }}
        >
          These {INVENTIONS.length} inventions span{' '}
          <strong style={{ color: '#fbbf24' }}>{yearSpan()} years</strong> of human ingenuity
        </motion.div>
      </header>

      {/* Filters */}
      <section style={{ padding: '16px 24px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search inventions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              maxWidth: 400,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#e2e8f0',
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {/* Sort toggle */}
          <div style={{ display: 'flex', gap: 4, marginRight: 12 }}>
            {(['chronological', 'impact'] as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: sortMode === mode ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  background: sortMode === mode ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: sortMode === mode ? '#93c5fd' : '#94a3b8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {mode === 'chronological' ? 'Chronological' : 'Most Impactful'}
              </button>
            ))}
          </div>

          {/* Impact filter */}
          <button
            onClick={() => setImpactFilter(!impactFilter)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: impactFilter ? '#fbbf24' : 'rgba(255,255,255,0.1)',
              background: impactFilter ? 'rgba(251,191,36,0.15)' : 'transparent',
              color: impactFilter ? '#fbbf24' : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.15s',
              marginRight: 12,
            }}
          >
            ★ High Impact Only
          </button>

          {/* Category pills */}
          {ALL_CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(active ? null : cat)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: active ? color : 'rgba(255,255,255,0.1)',
                  background: active ? `${color}22` : 'transparent',
                  color: active ? color : '#94a3b8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Era pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {ALL_ERAS.map((e) => {
            const active = eraFilter === e;
            const color = ERA_COLORS[e];
            return (
              <button
                key={e}
                onClick={() => setEraFilter(active ? null : e)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: active ? color : 'rgba(255,255,255,0.1)',
                  background: active ? `${color}22` : 'transparent',
                  color: active ? color : '#94a3b8',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.15s',
                }}
              >
                {e}
              </button>
            );
          })}
          {(categoryFilter || eraFilter || impactFilter || search) && (
            <button
              onClick={() => {
                setCategoryFilter(null);
                setEraFilter(null);
                setImpactFilter(false);
                setSearch('');
              }}
              style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent',
                color: '#ef4444',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>
          Showing {filtered.length} of {INVENTIONS.length} inventions
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '24px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          {/* Central timeline line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(255,255,255,0.08)',
              transform: 'translateX(-1px)',
            }}
          />

          {filtered.map((inv, i) => (
            <TimelineCard key={inv.name} invention={inv} index={i} side={i % 2 === 0 ? 'left' : 'right'} />
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>
              No inventions match your filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TimelineCard({
  invention: inv,
  index,
  side,
}: {
  invention: Invention;
  index: number;
  side: 'left' | 'right';
}) {
  const catColor = CATEGORY_COLORS[inv.category];
  const eraColor = ERA_COLORS[inv.era];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
        paddingLeft: side === 'right' ? 'calc(50% + 24px)' : 0,
        paddingRight: side === 'left' ? 'calc(50% + 24px)' : 0,
        marginBottom: 24,
        position: 'relative',
      }}
    >
      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 20,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: catColor,
          border: '2px solid #0f172a',
          transform: 'translateX(-6px)',
          zIndex: 1,
        }}
      />

      {/* Year marker */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 18,
          transform: side === 'left' ? 'translateX(20px)' : 'translateX(-100%) translateX(-20px)',
          fontSize: 11,
          fontWeight: 700,
          color: '#64748b',
          whiteSpace: 'nowrap',
        }}
      >
        {inv.yearLabel}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: side === 'left' ? 30 : -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.04, 1.2), duration: 0.4 }}
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '18px 20px',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.15s',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
          (e.currentTarget as HTMLDivElement).style.borderColor = `${catColor}44`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        {/* Top row: badges */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              background: `${catColor}22`,
              color: catColor,
            }}
          >
            {inv.category}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              background: `${eraColor}22`,
              color: eraColor,
            }}
          >
            {inv.era}
          </span>
          <span style={{ marginLeft: 'auto' }}>
            <Stars count={inv.impact} />
          </span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 18 }}>{inv.flag}</span>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#f1f5f9' }}>{inv.name}</h3>
        </div>

        {/* Inventor + origin */}
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
          {inv.inventor} · {inv.origin}
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cbd5e1', margin: '0 0 10px' }}>
          {inv.description}
        </p>

        {/* Changed everything */}
        <div
          style={{
            fontSize: 13,
            fontStyle: 'italic',
            color: '#fbbf24',
            marginBottom: 12,
            paddingLeft: 10,
            borderLeft: '2px solid #fbbf2444',
          }}
        >
          "{inv.changedEverything}"
        </div>

        {/* Search link */}
        <Link
          to={`/?q=${encodeURIComponent(inv.name)}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 6,
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#93c5fd',
            fontSize: 12,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          Find in Chronicle →
        </Link>
      </motion.div>
    </div>
  );
}
