/**
 * GlossaryPage — searchable A–Z reference of historical terms.
 *
 * Route: /glossary
 *
 * Sections:
 *  1. GlossaryHero — title, term count, search input
 *  2. CategoryFilter — pill buttons to filter by category
 *  3. AlphabetNav — A–Z quick-jump, grayed if empty
 *  4. GlossaryEntries — alphabetically grouped cards with "Did you know?" cards
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORY_LABELS,
  GLOSSARY_CATEGORY_COLORS,
  DID_YOU_KNOW_FACTS,
} from '../data/glossary';
import type { GlossaryCategory, GlossaryTerm } from '../data/glossary';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ALL_CATEGORIES: GlossaryCategory[] = ['time', 'political', 'warfare', 'religion', 'economy', 'culture'];

/** Insert a "Did you know?" card every N entries. */
const DYK_INTERVAL = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Styles (inline, matching Chronicle's dark navy theme)
// ─────────────────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #070e22 0%, #0c1633 100%)',
    color: '#f1f5f9',
    fontFamily: "'Inter', system-ui, sans-serif",
  } as React.CSSProperties,

  container: {
    maxWidth: 920,
    margin: '0 auto',
    padding: '0 24px 80px',
  } as React.CSSProperties,

  // ── Top nav bar ──
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    maxWidth: 920,
    margin: '0 auto',
  } as React.CSSProperties,

  backLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'color 0.15s',
  } as React.CSSProperties,

  // ── Hero ──
  hero: {
    textAlign: 'center' as const,
    padding: '48px 0 36px',
  } as React.CSSProperties,

  heroTitle: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    margin: 0,
    lineHeight: 1.15,
  } as React.CSSProperties,

  heroSub: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
    lineHeight: 1.5,
  } as React.CSSProperties,

  // ── Search ──
  searchWrap: {
    position: 'relative' as const,
    maxWidth: 480,
    margin: '24px auto 0',
  } as React.CSSProperties,

  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 42px',
    fontSize: 15,
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#f1f5f9',
    outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  } as React.CSSProperties,

  searchIcon: {
    position: 'absolute' as const,
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    fontSize: 16,
    pointerEvents: 'none' as const,
  } as React.CSSProperties,

  // ── Category pills ──
  categoryBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
    justifyContent: 'center',
    margin: '28px 0 8px',
  } as React.CSSProperties,

  // ── Alphabet nav ──
  alphabetNav: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 4,
    justifyContent: 'center',
    margin: '20px 0 32px',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    background: 'rgba(7, 14, 34, 0.92)',
    backdropFilter: 'blur(10px)',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  } as React.CSSProperties,

  // ── Section header ──
  sectionHeader: {
    fontSize: 28,
    fontWeight: 800,
    color: '#f1f5f9',
    margin: '36px 0 16px',
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    scrollMarginTop: 70,
  } as React.CSSProperties,

  // ── Term card ──
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '18px 20px',
    marginBottom: 12,
    transition: 'border-color 0.15s, background 0.15s',
  } as React.CSSProperties,

  cardHover: {
    borderColor: 'rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.06)',
  },

  termName: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
  } as React.CSSProperties,

  pronunciation: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic' as const,
    marginLeft: 8,
    fontWeight: 400,
  } as React.CSSProperties,

  definition: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 1.65,
    marginTop: 8,
  } as React.CSSProperties,

  chipRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
    marginTop: 12,
    alignItems: 'center',
  } as React.CSSProperties,

  // ── DYK card ──
  dykCard: {
    background: 'rgba(59,130,246,0.08)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 12,
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  } as React.CSSProperties,

  dykIcon: {
    fontSize: 22,
    flexShrink: 0,
    lineHeight: 1,
    marginTop: 2,
  } as React.CSSProperties,

  dykText: {
    fontSize: 14,
    color: '#93c5fd',
    lineHeight: 1.6,
    fontStyle: 'italic' as const,
  } as React.CSSProperties,

  // ── Count bar ──
  countBar: {
    textAlign: 'center' as const,
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  } as React.CSSProperties,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Category filter pill button. */
function CategoryPill({
  label,
  color,
  active,
  count,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
        background: active ? `${color}22` : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: active ? color : '#94a3b8',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label} <span style={{ opacity: 0.6 }}>({count})</span>
    </button>
  );
}

/** Single alphabet letter button. */
function AlphabetButton({
  letter,
  hasTerms,
  onClick,
}: {
  letter: string;
  hasTerms: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={!hasTerms}
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        border: 'none',
        background: hovered && hasTerms ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: hasTerms ? '#f1f5f9' : '#334155',
        fontSize: 13,
        fontWeight: 700,
        cursor: hasTerms ? 'pointer' : 'default',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'all 0.15s',
      }}
    >
      {letter}
    </button>
  );
}

/** Clickable related-term chip. */
function RelatedChip({
  term,
  onClick,
}: {
  term: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '3px 10px',
        borderRadius: 14,
        border: '1px solid rgba(59,130,246,0.3)',
        background: hovered ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)',
        color: '#93c5fd',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: "'Inter', system-ui, sans-serif",
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {term}
    </button>
  );
}

/** Category badge on a term card. */
function CategoryBadge({ category }: { category: GlossaryCategory }) {
  const color = GLOSSARY_CATEGORY_COLORS[category];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color,
        background: `${color}18`,
        padding: '2px 8px',
        borderRadius: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {GLOSSARY_CATEGORY_LABELS[category]}
    </span>
  );
}

/** A single glossary term card. */
function TermCard({
  entry,
  onRelatedClick,
}: {
  entry: GlossaryTerm;
  onRelatedClick: (term: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...S.card,
        ...(hovered ? S.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h3 style={S.termName}>{entry.term}</h3>
        {entry.pronunciation && (
          <span style={S.pronunciation}>/{entry.pronunciation}/</span>
        )}
        <CategoryBadge category={entry.category} />
      </div>
      <p style={S.definition}>{entry.definition}</p>
      {entry.relatedTerms.length > 0 && (
        <div style={S.chipRow}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginRight: 2 }}>
            Related:
          </span>
          {entry.relatedTerms.map((rt) => (
            <RelatedChip key={rt} term={rt} onClick={() => onRelatedClick(rt)} />
          ))}
        </div>
      )}
    </div>
  );
}

/** "Did you know?" interstitial card. */
function DidYouKnowCard({ fact }: { fact: string }) {
  return (
    <div style={S.dykCard}>
      <span style={S.dykIcon}>💡</span>
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Did you know?
        </span>
        <p style={{ ...S.dykText, margin: '4px 0 0' }}>{fact}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/** GlossaryPage — /glossary route. Searchable A–Z historical term reference. */
export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /** Filter terms by search query and active category. */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return GLOSSARY_TERMS.filter((t) => {
      if (activeCategory && t.category !== activeCategory) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.relatedTerms.some((rt) => rt.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  /** Group filtered terms by first letter. */
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    }
    // Sort entries within each letter
    for (const arr of Object.values(map)) {
      arr.sort((a, b) => a.term.localeCompare(b.term));
    }
    return map;
  }, [filtered]);

  /** Letters that have at least one term. */
  const activeLetters = useMemo(() => new Set(Object.keys(grouped)), [grouped]);

  /** Category counts (against current search, not against active category). */
  const categoryCounts = useMemo(() => {
    const q = search.toLowerCase().trim();
    const counts: Record<string, number> = {};
    for (const cat of ALL_CATEGORIES) {
      counts[cat] = GLOSSARY_TERMS.filter((t) => {
        if (t.category !== cat) return false;
        if (!q) return true;
        return (
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
        );
      }).length;
    }
    return counts;
  }, [search]);

  /** Scroll to a letter section. */
  const scrollToLetter = useCallback((letter: string) => {
    sectionRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /** When a related-term chip is clicked, search for that term. */
  const handleRelatedClick = useCallback((term: string) => {
    setSearch(term);
    setActiveCategory(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Toggle a category filter. */
  const toggleCategory = useCallback((cat: GlossaryCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  }, []);

  // Build a flat render list with DYK cards interspersed
  const renderSections = useMemo(() => {
    const sections: React.ReactNode[] = [];
    let globalIndex = 0;
    let dykIndex = 0;

    const sortedLetters = ALPHABET.filter((l) => grouped[l]);

    for (const letter of sortedLetters) {
      sections.push(
        <div
          key={`hdr-${letter}`}
          ref={(el) => { sectionRefs.current[letter] = el; }}
          style={S.sectionHeader}
        >
          {letter}
        </div>
      );

      for (const entry of grouped[letter]) {
        // Insert DYK card every N entries
        if (globalIndex > 0 && globalIndex % DYK_INTERVAL === 0 && dykIndex < DID_YOU_KNOW_FACTS.length) {
          sections.push(
            <DidYouKnowCard key={`dyk-${dykIndex}`} fact={DID_YOU_KNOW_FACTS[dykIndex]} />
          );
          dykIndex++;
        }
        sections.push(
          <TermCard key={entry.term} entry={entry} onRelatedClick={handleRelatedClick} />
        );
        globalIndex++;
      }
    }
    return sections;
  }, [grouped, handleRelatedClick]);

  const totalCount = GLOSSARY_TERMS.length;

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topBar}>
        <Link to="/" style={S.backLink}>
          <span>←</span> Back to Chronicle
        </Link>
        <Link to="/" style={{ ...S.backLink, fontWeight: 700, color: '#f1f5f9', fontSize: 15, letterSpacing: '-0.01em' }}>
          Chronicle
        </Link>
      </div>

      <div style={S.container}>
        {/* Hero */}
        <header style={S.hero}>
          <h1 style={S.heroTitle}>Historical Glossary</h1>
          <p style={S.heroSub}>
            {totalCount} terms defined — from <em>BCE</em> to <em>empire</em> to <em>feudalism</em>
          </p>

          {/* Search */}
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms, definitions, or related concepts…"
              style={S.searchInput}
            />
          </div>
        </header>

        {/* Category filter */}
        <div style={S.categoryBar}>
          <CategoryPill
            label="All"
            color="#3b82f6"
            active={activeCategory === null}
            count={GLOSSARY_TERMS.filter((t) => {
              const q = search.toLowerCase().trim();
              if (!q) return true;
              return t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
            }).length}
            onClick={() => setActiveCategory(null)}
          />
          {ALL_CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat}
              label={GLOSSARY_CATEGORY_LABELS[cat]}
              color={GLOSSARY_CATEGORY_COLORS[cat]}
              active={activeCategory === cat}
              count={categoryCounts[cat]}
              onClick={() => toggleCategory(cat)}
            />
          ))}
        </div>

        {/* Count */}
        <p style={S.countBar}>
          {filtered.length === totalCount
            ? `Showing all ${totalCount} terms`
            : `${filtered.length} of ${totalCount} terms`}
          {activeCategory && ` in ${GLOSSARY_CATEGORY_LABELS[activeCategory]}`}
        </p>

        {/* Alphabet nav */}
        <nav style={S.alphabetNav} aria-label="Alphabet navigation">
          {ALPHABET.map((letter) => (
            <AlphabetButton
              key={letter}
              letter={letter}
              hasTerms={activeLetters.has(letter)}
              onClick={() => scrollToLetter(letter)}
            />
          ))}
        </nav>

        {/* Entries */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No terms match your search.</p>
            <p style={{ fontSize: 14 }}>
              Try a different keyword or{' '}
              <button
                onClick={() => { setSearch(''); setActiveCategory(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: 14,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                clear all filters
              </button>
            </p>
          </div>
        ) : (
          <div>{renderSections}</div>
        )}
      </div>
    </div>
  );
}
