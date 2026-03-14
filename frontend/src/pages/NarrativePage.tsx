/**
 * NarrativePage — immersive deep-read mode for a single historical event.
 *
 * Route: /narrative/:slug
 *
 * Assembles article summary, causal chain (predecessors + successors),
 * related events, historical figures, and collection membership into
 * a single essay-style reading page. All data from the DB, no LLM.
 *
 * Does NOT own: routing (App.tsx), global store, canvas state.
 */

import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchNarrative } from '../api/client';
import type {
  NarrativeResponse,
  NarrativeChainEvent,
  NarrativeRelatedEvent,
  NarrativePerson,
  NarrativeCollection,
} from '../api/client';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum width of the reading column in pixels. */
const MAX_CONTENT_WIDTH = 800;

/** Number of importance stars to display. */
const MAX_IMPORTANCE_STARS = 5;

/** Animation stagger delay between list items (seconds). */
const LIST_STAGGER_DELAY = 0.06;

/** Snippet length for related event descriptions. */
const RELATED_SNIPPET_LENGTH = 120;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year for display, handling BCE flag.
 *
 * @param year - Approximate year (positive integer).
 * @param isBce - Whether the year is Before Common Era.
 * @returns Human-readable year string.
 */
function formatYear(year: number | null | undefined, isBce: boolean | undefined): string {
  if (year == null) return 'Unknown date';
  return isBce ? `${year} BCE` : String(year);
}

/**
 * Render importance as star characters.
 *
 * @param score - Importance score from 0 to 1.
 * @returns String of filled and empty stars.
 */
function importanceStars(score: number): string {
  const filled = Math.round(score * MAX_IMPORTANCE_STARS);
  return '★'.repeat(filled) + '☆'.repeat(MAX_IMPORTANCE_STARS - filled);
}

/**
 * Truncate text to a maximum length with ellipsis.
 *
 * @param text - Source text.
 * @param maxLen - Maximum character count.
 * @returns Truncated string.
 */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Copy the current page URL to the clipboard.
 */
async function shareUrl(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    // Fallback: silent fail in non-secure contexts
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Props for the causal chain timeline section. */
interface ChainSectionProps {
  title: string;
  events: NarrativeChainEvent[];
}

/**
 * ChainSection — renders a numbered timeline list of causal events.
 * Each item links to /narrative/{slug} for that event.
 */
function ChainSection({ title, events }: ChainSectionProps): JSX.Element | null {
  if (events.length === 0) return null;
  return (
    <section style={{ marginTop: 48 }}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <ol style={{ paddingLeft: 24, margin: 0 }}>
        {events.map((evt, i) => (
          <motion.li
            key={evt.slug}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * LIST_STAGGER_DELAY }}
            style={{ marginBottom: 16, lineHeight: 1.6 }}
          >
            <Link to={`/narrative/${evt.slug}`} style={styles.chainLink}>
              <span style={styles.chainYear}>
                {formatYear(evt.year_approx, evt.is_bce)}
              </span>
              {' — '}
              <strong>{evt.title}</strong>
            </Link>
            {evt.link_description && (
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 14 }}>
                {evt.link_description}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/**
 * PersonCard — horizontal card for a historical figure.
 */
function PersonCard({ person }: { person: NarrativePerson }): JSX.Element {
  const years =
    person.birth_year != null
      ? `${person.birth_year}–${person.death_year ?? '?'}`
      : '';

  return (
    <Link
      to={`/people?q=${encodeURIComponent(person.name)}`}
      style={styles.personCard}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
        {person.name}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
        {person.role}
      </div>
      {years && (
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
          {years}
        </div>
      )}
    </Link>
  );
}

/**
 * RelatedCard — card for a related event in the 3-column grid.
 */
function RelatedCard({ event }: { event: NarrativeRelatedEvent }): JSX.Element {
  const snippet = event.article_summary
    ? truncate(event.article_summary, RELATED_SNIPPET_LENGTH)
    : 'No description available.';

  return (
    <Link to={`/narrative/${event.slug}`} style={styles.relatedCard}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
        {formatYear(event.year_approx, event.is_bce)}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>
        {event.title}
      </div>
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
        {snippet}
      </p>
      <div style={{ marginTop: 12, fontSize: 13, color: '#818cf8' }}>
        Read more →
      </div>
    </Link>
  );
}

/**
 * CollectionCard — card linking to a collection the event belongs to.
 */
function CollectionCard({ collection }: { collection: NarrativeCollection }): JSX.Element {
  return (
    <Link to={`/collections/${collection.slug}`} style={styles.collectionCard}>
      <span style={{ fontSize: 24, marginRight: 12 }}>{collection.icon_emoji}</span>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
          {collection.title}
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
          {collection.description}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * NarrativePage — renders the full narrative deep-read view for one event.
 */
export default function NarrativePage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<NarrativeResponse | null>({
    queryKey: ['narrative', slug],
    queryFn: () => fetchNarrative(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: 120 }}>
            Loading narrative…
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p style={{ color: '#ef4444', textAlign: 'center', marginTop: 120 }}>
            Event not found or failed to load.
          </p>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/" style={{ color: '#818cf8' }}>← Back to timeline</Link>
          </div>
        </div>
      </div>
    );
  }

  const { event, predecessors, successors, related, people, collections } = data;
  const categoryColor = CATEGORY_COLORS[event.event_category ?? ''] ?? '#64748b';
  const categoryIcon = CATEGORY_ICONS[event.event_category ?? ''] ?? '📌';
  const categoryLabel = CATEGORY_LABELS[event.event_category ?? ''] ?? event.event_category ?? 'Event';

  return (
    <div style={styles.container}>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={styles.topBar}>
        <button
          onClick={() => navigate(`/#event=${event.slug}`)}
          style={styles.backBtn}
          title="Back to canvas"
        >
          ← Canvas
        </button>
        <button onClick={shareUrl} style={styles.shareBtn} title="Copy link">
          🔗 Share
        </button>
      </div>

      <motion.div
        style={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── 1. Hero ──────────────────────────────────────────────────── */}
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                ...styles.badge,
                backgroundColor: categoryColor + '22',
                color: categoryColor,
                border: `1px solid ${categoryColor}44`,
              }}
            >
              {categoryIcon} {categoryLabel}
            </span>
            {event.geo_modern && (
              <span style={{ fontSize: 13, color: '#94a3b8' }}>📍 {event.geo_modern}</span>
            )}
          </div>
          <h1 style={styles.heroTitle}>{event.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 18, color: '#94a3b8' }}>
              {formatYear(event.year_approx, event.is_bce)}
              {event.date_circa ? ' (circa)' : ''}
            </span>
            <span style={{ fontSize: 18, color: '#f59e0b', letterSpacing: 2 }}>
              {importanceStars(event.importance_score)}
            </span>
          </div>
        </header>

        {/* ── 2. The Story ─────────────────────────────────────────────── */}
        {event.article_summary && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={styles.sectionTitle}>The Story</h2>
            <div style={styles.storyText}>
              {event.article_summary.split('\n').map((para, i) => (
                <p key={i} style={{ marginBottom: 16 }}>{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* ── 3. What Led Here ─────────────────────────────────────────── */}
        <ChainSection title="What Led Here" events={predecessors} />

        {/* ── 4. What Happened Next ────────────────────────────────────── */}
        <ChainSection title="What Happened Next" events={successors} />

        {/* ── 5. Key Figures ───────────────────────────────────────────── */}
        {people.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={styles.sectionTitle}>Key Figures</h2>
            <div style={styles.peopleRow}>
              {people.map((p) => (
                <PersonCard key={`${p.name}-${p.role}`} person={p} />
              ))}
            </div>
          </section>
        )}

        {/* ── 6. Related Events ────────────────────────────────────────── */}
        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <h2 style={styles.sectionTitle}>Related Events</h2>
            <div style={styles.relatedGrid}>
              {related.map((r) => (
                <RelatedCard key={r.slug} event={r} />
              ))}
            </div>
          </section>
        )}

        {/* ── 7. Part of Collection ────────────────────────────────────── */}
        {collections.length > 0 && (
          <section style={{ marginTop: 48, marginBottom: 64 }}>
            <h2 style={styles.sectionTitle}>Part of Collection</h2>
            {collections.map((c) => (
              <CollectionCard key={c.slug} collection={c} />
            ))}
          </section>
        )}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles (inline — consistent with project conventions)
// ─────────────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    padding: '0 24px 64px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: MAX_CONTENT_WIDTH,
    margin: '0 auto',
    padding: '20px 0',
  },
  backBtn: {
    background: 'none',
    border: '1px solid #334155',
    borderRadius: 8,
    color: '#94a3b8',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
  },
  shareBtn: {
    background: 'none',
    border: '1px solid #334155',
    borderRadius: 8,
    color: '#94a3b8',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 14,
  },
  content: {
    maxWidth: MAX_CONTENT_WIDTH,
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 700,
    lineHeight: 1.2,
    margin: 0,
    color: '#f8fafc',
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 6,
    display: 'inline-block',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 600,
    color: '#f8fafc',
    marginBottom: 20,
    borderBottom: '1px solid #1e293b',
    paddingBottom: 8,
  },
  storyText: {
    fontSize: 17,
    lineHeight: 1.8,
    color: '#cbd5e1',
  },
  chainLink: {
    color: '#e2e8f0',
    textDecoration: 'none',
  },
  chainYear: {
    color: '#818cf8',
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  },
  peopleRow: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto' as const,
    paddingBottom: 8,
  },
  personCard: {
    display: 'block',
    textDecoration: 'none',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: '16px 20px',
    minWidth: 140,
    flexShrink: 0,
    border: '1px solid #334155',
    transition: 'border-color 0.2s',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
  },
  relatedCard: {
    display: 'block',
    textDecoration: 'none',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 20,
    border: '1px solid #334155',
    transition: 'border-color 0.2s',
  },
  collectionCard: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: '16px 20px',
    border: '1px solid #334155',
    marginBottom: 12,
  },
};
