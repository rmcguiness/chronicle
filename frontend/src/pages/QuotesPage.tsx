/**
 * QuotesPage — "Words That Changed History"
 *
 * Route: /quotes
 *
 * Displays 60+ famous historical quotes with full context, significance,
 * category filtering, search, and links to Chronicle events/people.
 *
 * Sections:
 *  1. Featured Quote — large hero with full context (random on load)
 *  2. Quote of the Day — deterministic daily pick
 *  3. Browse by Category — filter chips
 *  4. Search — keyword, author, year range
 *  5. Quote Cards Grid — 3-col responsive grid with expand
 *  6. Related Events — links to Chronicle event pages
 *
 * Owns: quote display, filtering, search, pagination.
 * Does NOT own: quote data (imported from data/historical-quotes.ts).
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HISTORICAL_QUOTES,
  CATEGORY_META,
  QUOTES_PER_PAGE,
  getQuoteOfTheDay,
  formatQuoteYear,
  type HistoricalQuote,
  type QuoteCategory,
} from '../data/historical-quotes';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURFACE_HOVER = '#334155';
const TEXT = '#f8fafc';
const TEXT_MUTED = '#94a3b8';
const TEXT_DIM = '#64748b';
const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#818cf8';
const BORDER = '#334155';
const CARD_BG = '#1e293b';

/** Maximum characters before truncating a quote in grid view. */
const QUOTE_TRUNCATE_LENGTH = 180;

/** Number of featured quotes to cycle through. */
const FEATURED_ROTATION_INTERVAL_MS = 12000;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * QuotesPage — main page component for /quotes.
 *
 * Renders a searchable, filterable grid of historical quotes with
 * a featured hero section and quote of the day.
 */
export default function QuotesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(() =>
    Math.floor(Math.random() * HISTORICAL_QUOTES.length)
  );

  const quoteOfTheDay = useMemo(() => getQuoteOfTheDay(), []);

  // Auto-rotate featured quote
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % HISTORICAL_QUOTES.length);
    }, FEATURED_ROTATION_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const featured = HISTORICAL_QUOTES[featuredIndex];

  // Filter + search
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return HISTORICAL_QUOTES.filter(quote => {
      if (selectedCategory && quote.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        quote.text.toLowerCase().includes(q) ||
        quote.author.toLowerCase().includes(q) ||
        quote.context.toLowerCase().includes(q) ||
        quote.tags.some(t => t.includes(q))
      );
    });
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filtered.length / QUOTES_PER_PAGE);
  const paginated = filtered.slice((page - 1) * QUOTES_PER_PAGE, page * QUOTES_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, selectedCategory]);

  const handleCategoryClick = useCallback((cat: QuoteCategory) => {
    setSelectedCategory(prev => (prev === cat ? null : cat));
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 32px',
        borderBottom: `1px solid ${BORDER}`, background: SURFACE,
      }}>
        <Link to="/" style={{ color: ACCENT_LIGHT, textDecoration: 'none', fontWeight: 600, fontSize: 18 }}>
          ← Chronicle
        </Link>
        <span style={{ color: TEXT_DIM }}>|</span>
        <span style={{ color: TEXT, fontWeight: 700, fontSize: 18 }}>Words That Changed History</span>
      </nav>

      {/* ── HERO: Featured Quote ─────────────────────────────────────── */}
      <section style={{
        padding: '64px 32px', textAlign: 'center',
        background: `linear-gradient(135deg, ${BG} 0%, #1a1a3e 50%, ${BG} 100%)`,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote style={{
              fontSize: 28, fontStyle: 'italic', lineHeight: 1.5,
              maxWidth: 800, margin: '0 auto 24px', color: TEXT,
              fontWeight: 300,
            }}>
              "{featured.text}"
            </blockquote>
            <p style={{ fontSize: 18, color: ACCENT_LIGHT, marginBottom: 8 }}>
              — {featured.author}, {formatQuoteYear(featured.year)}
            </p>
            <p style={{ fontSize: 14, color: TEXT_MUTED, maxWidth: 600, margin: '0 auto 8px' }}>
              {featured.context}
            </p>
            <span style={{
              display: 'inline-block', marginTop: 12, padding: '4px 12px',
              borderRadius: 12, fontSize: 12, fontWeight: 600,
              background: CATEGORY_META[featured.category].color + '30',
              color: CATEGORY_META[featured.category].color,
            }}>
              {CATEGORY_META[featured.category].emoji} {CATEGORY_META[featured.category].label}
            </span>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Quote of the Day ─────────────────────────────────────────── */}
      <section style={{
        padding: '32px', maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{
          background: SURFACE, border: `1px solid ${ACCENT}40`, borderRadius: 12,
          padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 32 }}>📅</span>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, color: ACCENT_LIGHT, textTransform: 'uppercase', letterSpacing: 1 }}>
              Quote of the Day
            </h3>
            <blockquote style={{ fontSize: 18, fontStyle: 'italic', margin: '0 0 8px', color: TEXT }}>
              "{quoteOfTheDay.text.length > 200 ? quoteOfTheDay.text.slice(0, 200) + '…' : quoteOfTheDay.text}"
            </blockquote>
            <p style={{ margin: 0, color: TEXT_MUTED, fontSize: 14 }}>
              — {quoteOfTheDay.author}, {formatQuoteYear(quoteOfTheDay.year)}
            </p>
          </div>
        </div>
      </section>

      {/* ── Search & Filters ─────────────────────────────────────────── */}
      <section style={{ padding: '0 32px 24px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search quotes by keyword, author, or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 8,
            border: `1px solid ${BORDER}`, background: SURFACE, color: TEXT,
            fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 16,
          }}
        />

        {/* Category filter chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(Object.keys(CATEGORY_META) as QuoteCategory[]).map(cat => {
            const meta = CATEGORY_META[cat];
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                  background: isActive ? meta.color : SURFACE,
                  color: isActive ? '#fff' : TEXT_MUTED,
                  outline: isActive ? 'none' : `1px solid ${BORDER}`,
                }}
              >
                {meta.emoji} {meta.label}
              </button>
            );
          })}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, background: 'transparent', color: TEXT_DIM,
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        <p style={{ color: TEXT_DIM, fontSize: 13, marginTop: 12 }}>
          Showing {filtered.length} of {HISTORICAL_QUOTES.length} quotes
        </p>
      </section>

      {/* ── Quote Cards Grid ─────────────────────────────────────────── */}
      <section style={{
        padding: '0 32px 48px', maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {paginated.map(quote => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            isExpanded={expandedId === quote.id}
            onToggle={() => toggleExpand(quote.id)}
          />
        ))}
        {paginated.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: TEXT_DIM, padding: 48 }}>
            No quotes match your search. Try different keywords.
          </p>
        )}
      </section>

      {/* ── Pagination ───────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8,
          paddingBottom: 48,
        }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setPage(i + 1); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
              style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: page === i + 1 ? ACCENT : SURFACE,
                color: page === i + 1 ? '#fff' : TEXT_MUTED,
                fontWeight: 600, fontSize: 14,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        padding: '24px 32px', borderTop: `1px solid ${BORDER}`,
        textAlign: 'center', color: TEXT_DIM, fontSize: 13,
      }}>
        {HISTORICAL_QUOTES.length} quotes spanning {Math.abs(Math.min(...HISTORICAL_QUOTES.map(q => q.year)))} BCE
        to {Math.max(...HISTORICAL_QUOTES.map(q => q.year))} CE •{' '}
        <Link to="/" style={{ color: ACCENT_LIGHT, textDecoration: 'none' }}>Back to Chronicle</Link>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QuoteCard sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface QuoteCardProps {
  quote: HistoricalQuote;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * QuoteCard — individual quote card in the grid.
 *
 * Shows truncated quote, author, year, category badge.
 * Expands to show full text, context, significance, and related event links.
 */
function QuoteCard({ quote, isExpanded, onToggle }: QuoteCardProps) {
  const meta = CATEGORY_META[quote.category];
  const needsTruncation = quote.text.length > QUOTE_TRUNCATE_LENGTH;
  const displayText = !isExpanded && needsTruncation
    ? quote.text.slice(0, QUOTE_TRUNCATE_LENGTH) + '…'
    : quote.text;

  return (
    <motion.div
      layout
      style={{
        background: CARD_BG, borderRadius: 12, padding: 20,
        border: `1px solid ${BORDER}`, cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: meta.color }}
      onClick={onToggle}
    >
      {/* Category badge */}
      <span style={{
        display: 'inline-block', padding: '3px 10px', borderRadius: 10,
        fontSize: 11, fontWeight: 600, marginBottom: 12,
        background: meta.color + '25', color: meta.color,
      }}>
        {meta.emoji} {meta.label}
      </span>

      {/* Quote text */}
      <blockquote style={{
        fontSize: 15, fontStyle: 'italic', lineHeight: 1.6,
        margin: '0 0 12px', color: TEXT,
      }}>
        "{displayText}"
      </blockquote>

      {/* Author + year */}
      <p style={{ margin: '0 0 4px', color: TEXT_MUTED, fontSize: 13, fontWeight: 600 }}>
        — {quote.author}
      </p>
      <p style={{ margin: 0, color: TEXT_DIM, fontSize: 12 }}>
        {formatQuoteYear(quote.year)}
      </p>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 16 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 13, color: ACCENT_LIGHT, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Context
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6 }}>
                {quote.context}
              </p>

              <h4 style={{ margin: '0 0 6px', fontSize: 13, color: ACCENT_LIGHT, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Significance
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6 }}>
                {quote.significance}
              </p>

              {/* Related Chronicle links */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {quote.eventSlug && (
                  <Link
                    to={`/event/${quote.eventSlug}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: ACCENT + '20', color: ACCENT_LIGHT, textDecoration: 'none',
                    }}
                  >
                    📍 View Related Event
                  </Link>
                )}
                {quote.personSlug && (
                  <Link
                    to={`/event/${quote.personSlug}`}
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      background: SURFACE_HOVER, color: TEXT_MUTED, textDecoration: 'none',
                    }}
                  >
                    👤 {quote.author}
                  </Link>
                )}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                {quote.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: 11,
                    background: SURFACE_HOVER, color: TEXT_DIM,
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand hint */}
      {!isExpanded && (needsTruncation || quote.eventSlug) && (
        <p style={{ margin: '8px 0 0', fontSize: 11, color: TEXT_DIM }}>
          Click to read more →
        </p>
      )}
    </motion.div>
  );
}
