/**
 * ReadingListPage — curated history book recommendations by era.
 *
 * Route: /reading-list
 *
 * Sections:
 *  1. Hero — "Go Deeper — The Chronicle Reading List"
 *  2. Featured Pick — rotating standout book per selected era
 *  3. Era tabs — Ancient / Classical / Medieval / Early Modern / Modern / Contemporary
 *  4. Search/filter bar
 *  5. Book grid — 6-8 books per era with metadata badges
 *  6. My Reading List — localStorage-persisted personal list with status toggle
 *
 * All data is static (no API calls). Personal list persists via localStorage.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  BOOKS,
  ERAS,
  ERA_LABELS,
  ERA_COLORS,
  ERA_RANGES,
  type Era,
  type Book,
  type ReadingStatus,
} from '../data/readingList';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const LS_KEY = 'chronicle-reading-list';

const DIFFICULTY_COLORS: Record<string, string> = {
  Accessible: '#22c55e',
  Intermediate: '#f59e0b',
  Scholarly: '#ef4444',
};

const TAG_COLORS: Record<string, string> = {
  'Primary Source': '#a855f7',
  'Narrative History': '#3b82f6',
  Academic: '#6366f1',
  Biography: '#f97316',
  'Popular Science': '#06b6d4',
};

const STATUS_COLORS: Record<ReadingStatus, string> = {
  'Want to Read': '#f59e0b',
  Reading: '#3b82f6',
  Done: '#22c55e',
};

const STATUS_CYCLE: ReadingStatus[] = ['Want to Read', 'Reading', 'Done'];

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────

interface SavedBook {
  id: string;
  status: ReadingStatus;
}

function loadSavedBooks(): SavedBook[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedBooks(books: SavedBook[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(books));
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        backgroundColor: color + '22',
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  );
}

interface BookCardProps {
  book: Book;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  index: number;
}

function BookCard({ book, isSaved, onToggleSave, index }: BookCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 20,
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Header: emoji + title + author */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 32, lineHeight: 1 }}>{book.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>{book.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {book.author} · {formatYear(book.year)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
        {book.description}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <Badge label={book.tag} color={TAG_COLORS[book.tag] ?? '#6b7280'} />
        <Badge label={book.difficulty} color={DIFFICULTY_COLORS[book.difficulty] ?? '#6b7280'} />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
          ~{book.readTimeHours}h read
        </span>
      </div>

      {/* Add/remove button */}
      <button
        onClick={() => onToggleSave(book.id)}
        style={{
          marginTop: 'auto',
          padding: '6px 12px',
          borderRadius: 8,
          border: isSaved ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.15)',
          backgroundColor: isSaved ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
          color: isSaved ? '#ef4444' : 'rgba(255,255,255,0.8)',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {isSaved ? '✕ Remove from list' : '+ Add to your list'}
      </button>
    </motion.div>
  );
}

interface FeaturedPickProps {
  book: Book;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

function FeaturedPick({ book, isSaved, onToggleSave }: FeaturedPickProps) {
  const eraColor = ERA_COLORS[book.era];
  return (
    <motion.div
      key={book.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        background: `linear-gradient(135deg, ${eraColor}15 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid ${eraColor}44`,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 48, lineHeight: 1 }}>{book.emoji}</span>
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: eraColor,
            }}
          >
            ★ Featured Pick
          </span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>{book.title}</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
          {book.author} · {formatYear(book.year)}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)', marginTop: 12 }}>
          {book.description}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 12 }}>
          <Badge label={book.tag} color={TAG_COLORS[book.tag] ?? '#6b7280'} />
          <Badge label={book.difficulty} color={DIFFICULTY_COLORS[book.difficulty] ?? '#6b7280'} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
            ~{book.readTimeHours}h read
          </span>
        </div>
        <button
          onClick={() => onToggleSave(book.id)}
          style={{
            marginTop: 16,
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${isSaved ? 'rgba(239,68,68,0.4)' : eraColor + '66'}`,
            backgroundColor: isSaved ? 'rgba(239,68,68,0.1)' : eraColor + '18',
            color: isSaved ? '#ef4444' : eraColor,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {isSaved ? '✕ Remove from list' : '+ Add to your list'}
        </button>
      </div>
    </motion.div>
  );
}

interface SavedBookRowProps {
  book: Book;
  status: ReadingStatus;
  onCycleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

function SavedBookRow({ book, status, onCycleStatus, onRemove }: SavedBookRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span style={{ fontSize: 20 }}>{book.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{book.title}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{book.author}</div>
      </div>
      <button
        onClick={() => onCycleStatus(book.id)}
        style={{
          padding: '4px 10px',
          borderRadius: 999,
          border: `1px solid ${STATUS_COLORS[status]}44`,
          backgroundColor: STATUS_COLORS[status] + '18',
          color: STATUS_COLORS[status],
          fontSize: 11,
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.15s',
        }}
      >
        {status}
      </button>
      <button
        onClick={() => onRemove(book.id)}
        style={{
          padding: '4px 8px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'transparent',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function ReadingListPage() {
  // Override the global overflow:hidden for scrolling
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

  const [activeEra, setActiveEra] = useState<Era>('ancient');
  const [search, setSearch] = useState('');
  const [savedBooks, setSavedBooks] = useState<SavedBook[]>(loadSavedBooks);

  // Persist to localStorage whenever savedBooks changes
  useEffect(() => {
    persistSavedBooks(savedBooks);
  }, [savedBooks]);

  const toggleSave = useCallback((id: string) => {
    setSavedBooks((prev) => {
      const exists = prev.find((b) => b.id === id);
      if (exists) return prev.filter((b) => b.id !== id);
      return [...prev, { id, status: 'Want to Read' as ReadingStatus }];
    });
  }, []);

  const cycleStatus = useCallback((id: string) => {
    setSavedBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const idx = STATUS_CYCLE.indexOf(b.status);
        return { ...b, status: STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length] };
      }),
    );
  }, []);

  const removeSaved = useCallback((id: string) => {
    setSavedBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const savedIds = useMemo(() => new Set(savedBooks.map((b) => b.id)), [savedBooks]);

  // Featured book for the active era
  const featured = useMemo(
    () => BOOKS.find((b) => b.era === activeEra && b.featured) ?? null,
    [activeEra],
  );

  // Filtered books
  const filteredBooks = useMemo(() => {
    const q = search.toLowerCase().trim();
    let books = BOOKS.filter((b) => b.era === activeEra);
    if (q) {
      books = BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tag.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q),
      );
    }
    return books;
  }, [activeEra, search]);

  // Resolved saved books with full data
  const savedBooksFull = useMemo(() => {
    const bookMap = new Map(BOOKS.map((b) => [b.id, b]));
    return savedBooks
      .map((sb) => ({ book: bookMap.get(sb.id), status: sb.status }))
      .filter((x): x is { book: Book; status: ReadingStatus } => !!x.book);
  }, [savedBooks]);

  const isSearching = search.trim().length > 0;

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 24 }}>
          <Link
            to="/"
            style={{
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: 14,
              transition: 'color 0.15s',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', padding: '48px 0 32px' }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              letterSpacing: -0.5,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Go Deeper — The Chronicle Reading List
          </h1>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.55)',
              marginTop: 12,
              maxWidth: 560,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.5,
            }}
          >
            Books to read alongside your exploration. Curated real history — primary sources,
            narrative histories, and essential scholarship for every era.
          </p>
        </motion.div>

        {/* Era tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          {ERAS.map((era) => {
            const isActive = activeEra === era && !isSearching;
            const color = ERA_COLORS[era];
            return (
              <button
                key={era}
                onClick={() => {
                  setActiveEra(era);
                  setSearch('');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: `1px solid ${isActive ? color + '66' : 'rgba(255,255,255,0.1)'}`,
                  backgroundColor: isActive ? color + '22' : 'transparent',
                  color: isActive ? color : 'rgba(255,255,255,0.6)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {ERA_LABELS[era]}
              </button>
            );
          })}
        </div>

        {/* Era range */}
        {!isSearching && (
          <div
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 24,
            }}
          >
            {ERA_RANGES[activeEra]}
          </div>
        )}

        {/* Search bar */}
        <div style={{ marginBottom: 24 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all books by title, author, or tag..."
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
              color: '#f1f5f9',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        {/* Featured pick */}
        {!isSearching && featured && (
          <FeaturedPick
            book={featured}
            isSaved={savedIds.has(featured.id)}
            onToggleSave={toggleSave}
          />
        )}

        {/* Search results heading */}
        {isSearching && (
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
            {filteredBooks.length} result{filteredBooks.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}

        {/* Book grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSearching ? 'search' : activeEra}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filteredBooks.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                isSaved={savedIds.has(book.id)}
                onToggleSave={toggleSave}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredBooks.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 0',
              color: 'rgba(255,255,255,0.4)',
              fontSize: 14,
            }}
          >
            No books found. Try a different search term.
          </div>
        )}

        {/* My Reading List */}
        <div style={{ marginTop: 64, paddingBottom: 64 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>My Reading List</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            Your saved books — click the status badge to cycle through: Want to Read → Reading → Done
          </p>

          {savedBooksFull.length === 0 ? (
            <div
              style={{
                padding: '32px 0',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.3)',
                fontSize: 14,
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 12,
              }}
            >
              No books saved yet. Click "+ Add to your list" on any book above.
            </div>
          ) : (
            <div>
              {savedBooksFull.map(({ book, status }) => (
                <SavedBookRow
                  key={book.id}
                  book={book}
                  status={status}
                  onCycleStatus={cycleStatus}
                  onRemove={removeSaved}
                />
              ))}
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                {savedBooksFull.length} book{savedBooksFull.length !== 1 ? 's' : ''} ·{' '}
                {savedBooksFull.filter((b) => b.status === 'Done').length} done ·{' '}
                {savedBooksFull.filter((b) => b.status === 'Reading').length} reading
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
