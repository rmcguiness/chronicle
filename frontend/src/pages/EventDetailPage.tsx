/**
 * EventDetailPage — full standalone event detail page.
 *
 * Route: /event/:slug
 *
 * Sections:
 *  1. EventHero — title, year, badges, importance stars, breadcrumb, share
 *  2. EventNarrative — full article_summary / Wikipedia content
 *  3. EventMetadata sidebar — date, region, category, coordinates, Wikipedia link
 *  4. CausalChain — incoming/outgoing causality links
 *  5. HistoricalContext — contemporary events from other regions
 *  6. PeopleInvolved — historical figures via event_people
 *  7. RelatedEvents — from connected_events (tag/category match)
 *  8. EraContext — collapsed accordion with era description
 *  9. NavigationFooter — prev/next event, random event
 *
 * Does NOT own: routing setup (App.tsx), global store, canvas/map state.
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import {
  fetchEventDetail,
  fetchWikiData,
  fetchEventPeople,
  fetchHistoricalContext,
  fetchEventNeighbors,
  searchEvents,
} from '../api/client';
import type { EventPerson, ContextEvent, EventNeighbors } from '../api/client';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  PERSPECTIVE_COLORS,
  PERSPECTIVE_LABELS,
  CONNECTION_COLORS,
  evidenceColor,
  evidenceLabel,
} from '../utils/categories';
import type { EventDetail, Perspective, ConnectedEvent, WikiData, EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum chars shown in a perspective narrative before truncation. */
const NARRATIVE_TRUNCATE_LENGTH = 300;

/** Stagger delay (seconds) between perspective card animations. */
const CARD_STAGGER_DELAY = 0.07;

/** Max importance stars to render. */
const MAX_STARS = 5;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year for display, handling BCE flag.
 * @param year - Approximate year.
 * @param isBce - Whether the year is Before Common Era.
 */
function formatYear(year: number | undefined | null, isBce: boolean | undefined): string {
  if (year == null) return 'Unknown date';
  return isBce ? `${year} BCE` : `${year} CE`;
}

/**
 * Render importance score as filled/empty stars.
 * @param score - 0 to 1 importance value
 */
function ImportanceStars({ score }: { score: number }) {
  const filled = Math.round(score * MAX_STARS);
  return (
    <span style={{ fontSize: 16, letterSpacing: 2 }}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span key={i} style={{ color: i < filled ? '#f59e0b' : '#334155' }}>
          ★
        </span>
      ))}
    </span>
  );
}

/**
 * Copy current URL to clipboard and show brief feedback.
 */
function useShareButton(): [boolean, () => void] {
  const [copied, setCopied] = useState(false);
  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return [copied, handleShare];
}

/**
 * Derive a simple era label from a year.
 */
function deriveEra(year: number | null | undefined, isBce: boolean | undefined): string {
  if (year == null) return 'Unknown Era';
  if (isBce) {
    if (year > 3000) return 'Prehistoric';
    if (year > 500) return 'Ancient World';
    return 'Classical Antiquity';
  }
  if (year < 500) return 'Late Antiquity';
  if (year < 1500) return 'Medieval Period';
  if (year < 1800) return 'Early Modern Period';
  if (year < 1900) return 'Age of Revolution';
  if (year < 2000) return '20th Century';
  return 'Contemporary';
}

/**
 * Get a brief era description for the collapsed accordion.
 */
function eraDescription(era: string): string {
  const descriptions: Record<string, string> = {
    'Prehistoric': 'The period before written records, spanning from the earliest human ancestors through the development of agriculture and the first settlements.',
    'Ancient World': 'The era of early civilizations including Mesopotamia, Egypt, the Indus Valley, and early China, marked by the invention of writing and monumental architecture.',
    'Classical Antiquity': 'The age of Greece and Rome, featuring the birth of democracy, philosophy, and the expansion of vast empires across the Mediterranean world.',
    'Late Antiquity': 'The transitional period from Classical Antiquity to the Middle Ages, witnessing the fall of Rome and the rise of new religious and political structures.',
    'Medieval Period': 'The Middle Ages, spanning from the fall of Rome to the Renaissance, characterized by feudalism, the Crusades, and the spread of major world religions.',
    'Early Modern Period': 'An era of exploration, reformation, and scientific revolution that reshaped global trade routes and challenged established institutions.',
    'Age of Revolution': 'A transformative century of political, industrial, and social revolutions that remade the modern world and its nation-states.',
    '20th Century': 'A century of world wars, decolonization, technological breakthroughs, and the rise of global interconnection.',
    'Contemporary': 'The current era defined by digital technology, globalization, climate change, and rapidly evolving geopolitics.',
  };
  return descriptions[era] ?? 'A period of significant historical events and transformations.';
}

// ─────────────────────────────────────────────────────────────────────────────
// og:meta tags — set document head for social sharing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Set Open Graph meta tags in the document head for social sharing.
 * @param event - The event detail data.
 * @param slug - Event slug for URL construction.
 */
function useOgMeta(event: EventDetail | undefined, slug: string | undefined) {
  useEffect(() => {
    if (!event || !slug) return;

    const description = (event.perspectives?.[0]?.narrative ?? event.title).slice(0, 160);
    const tags: Record<string, string> = {
      'og:title': `${event.title} — Chronicle`,
      'og:description': description,
      'og:url': `https://chronicle.app/event/${slug}`,
      'og:type': 'article',
    };

    // Also set document title
    document.title = `${event.title} — Chronicle`;

    const created: HTMLMetaElement[] = [];
    for (const [property, content] of Object.entries(tags)) {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
        created.push(el);
      }
      el.setAttribute('content', content);
    }

    return () => {
      document.title = 'Chronicle — Immutable Historical Timeline';
      created.forEach((el) => el.remove());
    };
  }, [event, slug]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: EventHero
// ─────────────────────────────────────────────────────────────────────────────

interface EventHeroProps {
  event: EventDetail;
  slug: string;
}

/** Full-width hero with title, year, badges, importance, breadcrumb, share. */
function EventHero({ event, slug }: EventHeroProps) {
  const catKey = (event.category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const icon = CATEGORY_ICONS[catKey] ?? '📌';
  const catLabel = CATEGORY_LABELS[catKey] ?? event.category ?? '';
  const era = deriveEra(event.year_approx, event.is_bce);
  const region = event.geo_modern ?? event.geo_era_label ?? 'Unknown';
  const [copied, handleShare] = useShareButton();

  return (
    <div
      style={{
        padding: '40px 32px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${color}14 100%)`,
      }}
    >
      {/* Breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          color: '#64748b',
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>Home</Link>
        <span style={{ color: '#475569' }}>›</span>
        <span>{region}</span>
        <span style={{ color: '#475569' }}>›</span>
        <span>{era}</span>
        <span style={{ color: '#475569' }}>›</span>
        <span style={{ color: '#94a3b8' }}>{event.title}</span>
      </nav>

      {/* Category + Era + Region badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: `${color}22`,
            border: `2px solid ${color}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
            boxShadow: `0 0 20px ${color}33`,
          }}
        >
          {icon}
        </span>
        <Badge label={catLabel} color={color} />
        <Badge label={era} color="#6366f1" />
        <Badge label={region} color="#14b8a6" />
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.15,
          marginBottom: 12,
        }}
      >
        {event.title}
      </h1>

      {/* Year display */}
      <div
        style={{
          fontSize: 'clamp(18px, 3vw, 28px)',
          fontWeight: 300,
          color: '#94a3b8',
          letterSpacing: '0.02em',
          marginBottom: 16,
          fontFamily: 'monospace',
        }}
      >
        {formatYear(event.year_approx, event.is_bce)}
      </div>

      {/* Importance stars */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <ImportanceStars score={event.importance_score} />
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Importance: {Math.round(event.importance_score * 10)}/10
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link
          to={`/?event=${slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
            transition: 'background 0.15s',
          }}
        >
          🗺️ View on Timeline
        </Link>
        <button
          onClick={handleShare}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: copied ? '#22c55e' : '#94a3b8',
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: EventNarrative + EventMetadata (main content area)
// ─────────────────────────────────────────────────────────────────────────────

interface ContentAreaProps {
  event: EventDetail;
  slug: string;
}

/** Two-column layout: narrative + sidebar metadata. */
function ContentArea({ event, slug }: ContentAreaProps) {
  return (
    <div className="edp-content-grid">
      <EventNarrative slug={slug} event={event} />
      <EventMetadata event={event} />
    </div>
  );
}

/** Main narrative content — Wikipedia article summary. */
function EventNarrative({ slug, event }: { slug: string; event: EventDetail }) {
  const { data: wiki, isLoading } = useQuery({
    queryKey: ['wiki', slug],
    queryFn: () => fetchWikiData(slug),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div>
      <h2 style={sectionHeadingStyle}>
        <span>📖</span> Overview
      </h2>

      {isLoading && (
        <div style={{ color: '#64748b', fontSize: 13, padding: '8px 0' }}>
          Fetching article summary…
        </div>
      )}

      {wiki && wiki.found && (
        <>
          {/* Thumbnail */}
          {'thumbnail' in wiki && wiki.thumbnail && (
            <img
              src={wiki.thumbnail}
              alt={event.title}
              style={{
                float: 'right',
                width: 180,
                marginLeft: 20,
                marginBottom: 12,
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          )}

          {/* Full summary text */}
          <p style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, margin: '0 0 16px' }}>
            {wiki.summary}
          </p>

          {/* Wikipedia attribution */}
          <a
            href={wiki.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
              fontSize: 13,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            📚 Source: Wikipedia — {wiki.title}
          </a>
        </>
      )}

      {wiki && !wiki.found && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b',
            fontSize: 13,
            fontStyle: 'italic',
          }}
        >
          No article summary available yet. Content for this event is being expanded.
        </div>
      )}

      {/* Perspectives section, inline */}
      {event.perspectives.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={sectionHeadingStyle}>
            <span>🌐</span> Perspectives ({event.perspectives.length})
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {event.perspectives.map((p, i) => (
              <PerspectiveCard key={p.id} perspective={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Right-column metadata sidebar. */
function EventMetadata({ event }: { event: EventDetail }) {
  const catKey = (event.category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const era = deriveEra(event.year_approx, event.is_bce);

  return (
    <aside
      style={{
        padding: '20px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        alignSelf: 'start',
        position: 'sticky',
        top: 20,
      }}
    >
      <h3
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Event Details
      </h3>

      <MetaRow label="Date" value={formatYear(event.year_approx, event.is_bce)} />
      {event.date_circa && (
        <div style={{ fontSize: 11, color: '#64748b', marginTop: -8, marginBottom: 12 }}>
          (approximate date)
        </div>
      )}
      <MetaRow label="Region" value={event.geo_modern ?? 'Unknown'} />
      <MetaRow label="Category">
        <Badge label={CATEGORY_LABELS[catKey] ?? event.category ?? ''} color={color} />
      </MetaRow>
      <MetaRow label="Era" value={era} />
      <MetaRow label="Importance">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>
            {Math.round(event.importance_score * 10)}/10
          </span>
          <ImportanceStars score={event.importance_score} />
        </div>
      </MetaRow>

      {event.lat != null && event.lng != null && (
        <MetaRow label="Location" value={`${event.lat.toFixed(2)}°, ${event.lng.toFixed(2)}°`}>
          {event.geo_modern && (
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              📍 {event.geo_modern}
            </div>
          )}
        </MetaRow>
      )}

      {event.wikipedia_slug && (
        <div style={{ marginTop: 12 }}>
          <a
            href={`https://en.wikipedia.org/wiki/${event.wikipedia_slug}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            🔗 Wikipedia
          </a>
        </div>
      )}

      {event.tags && event.tags.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {event.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: CausalChain
// ─────────────────────────────────────────────────────────────────────────────

interface CausalChainProps {
  event: EventDetail;
}

/** Causality links — "What caused this?" and "What happened next?" */
function CausalChain({ event }: CausalChainProps) {
  const connected = event.connected_events ?? [];
  if (connected.length === 0) return null;

  const causes = connected.filter((e) => e.direction === 'cause').slice(0, 5);
  const effects = connected.filter((e) => e.direction === 'effect').slice(0, 5);

  return (
    <SectionWrapper title="Causality Chain" icon="⛓️">
      <div className="edp-causal-grid">
        {/* Causes */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
            ← What caused this?
          </h4>
          {causes.length === 0 ? (
            <FallbackNotice message="No known causes recorded." />
          ) : (
            causes.map((ce) => <CausalEventCard key={ce.id} event={ce} />)
          )}
        </div>

        {/* Effects */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
            What happened next? →
          </h4>
          {effects.length === 0 ? (
            <FallbackNotice message="No known effects recorded." />
          ) : (
            effects.map((ce) => <CausalEventCard key={ce.id} event={ce} />)
          )}
        </div>
      </div>

      {/* Exploration links */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <Link
          to={`/?event=${event.slug}`}
          style={{
            fontSize: 12,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          🕸️ Explore the full chain
        </Link>
      </div>
    </SectionWrapper>
  );
}

/** Card for a single causal event link. */
function CausalEventCard({ event }: { event: ConnectedEvent }) {
  const typeColor = CONNECTION_COLORS[event.connection_type] ?? '#6b7280';
  return (
    <Link
      to={`/event/${event.slug}`}
      style={{ textDecoration: 'none', display: 'block', marginBottom: 8 }}
    >
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: `1px solid ${typeColor}33`,
          transition: 'background 0.15s, border-color 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.borderColor = `${typeColor}66`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = `${typeColor}33`;
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>
            {event.title}
          </div>
          <span style={{ fontSize: 11, color: '#64748b', flexShrink: 0, fontFamily: 'monospace' }}>
            {event.year_approx}
          </span>
        </div>
        {event.description && (
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, lineHeight: 1.5 }}>
            {event.description.slice(0, 120)}{event.description.length > 120 ? '…' : ''}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <Badge label={event.connection_type} color={typeColor} />
          {event.strength != null && (
            <span style={{ fontSize: 10, color: '#64748b' }}>
              strength: {event.strength.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: HistoricalContext
// ─────────────────────────────────────────────────────────────────────────────

interface HistoricalContextProps {
  slug: string;
  year: number | null | undefined;
}

/** "What else was happening?" — contemporary events from other regions. */
function HistoricalContext({ slug, year }: HistoricalContextProps) {
  const { data: contextEvents = [] } = useQuery({
    queryKey: ['context', slug],
    queryFn: () => fetchHistoricalContext(slug),
    staleTime: 10 * 60 * 1000,
  });

  if (contextEvents.length === 0) return null;

  return (
    <SectionWrapper
      title={`World Context: ${year ?? 'Unknown'} (±10 years)`}
      icon="🌍"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {contextEvents.map((ce) => {
          const catColor = CATEGORY_COLORS[(ce.category ?? 'political') as EventCategory] ?? '#6b7280';
          return (
            <Link
              key={ce.id}
              to={`/event/${ce.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
                  {ce.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
                    {ce.year_approx}
                  </span>
                  {ce.geo_modern && (
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>
                      · {ce.geo_modern}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Badge label={ce.category ?? 'event'} color={catColor} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: PeopleInvolved
// ─────────────────────────────────────────────────────────────────────────────

interface PeopleInvolvedProps {
  slug: string;
}

/** Historical figures linked to this event. */
function PeopleInvolved({ slug }: PeopleInvolvedProps) {
  const { data: people = [] } = useQuery({
    queryKey: ['people', slug],
    queryFn: () => fetchEventPeople(slug),
    staleTime: 10 * 60 * 1000,
  });

  if (people.length === 0) return null;

  return (
    <SectionWrapper title="People Involved" icon="👤">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {people.map((person) => (
          <PersonCard key={`${person.id}-${person.role}`} person={person} />
        ))}
      </div>
    </SectionWrapper>
  );
}

/** Card for a single person. */
function PersonCard({ person }: { person: EventPerson }) {
  const dates = [
    person.birth_year != null ? String(person.birth_year) : '?',
    person.death_year != null ? String(person.death_year) : '?',
  ].join(' – ');

  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
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
              backgroundColor: '#eab30822',
              border: '1px solid #eab30844',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            👤
          </div>
        )}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>
            {person.name}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>{dates}</div>
        </div>
      </div>
      <Badge label={person.role} color="#f59e0b" />
      {person.description && (
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
          {person.description.slice(0, 100)}{person.description.length > 100 ? '…' : ''}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: RelatedEvents (from connected_events — similar in category/tags)
// ─────────────────────────────────────────────────────────────────────────────

interface RelatedEventsProps {
  event: EventDetail;
}

/** "You might also find interesting" — events with shared tags/category. */
function RelatedEvents({ event }: RelatedEventsProps) {
  // Use the first tag as a search query to find semantically related events
  const searchTerm = event.tags?.[0] ?? event.category ?? event.title.split(' ')[0];

  const { data: related = [] } = useQuery({
    queryKey: ['related', event.slug, searchTerm],
    queryFn: () => searchEvents(searchTerm, 6),
    staleTime: 10 * 60 * 1000,
  });

  // Filter out self
  const filtered = related.filter((r) => r.slug !== event.slug).slice(0, 5);
  if (filtered.length === 0) return null;

  return (
    <SectionWrapper title="You Might Also Find Interesting" icon="🔮">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {filtered.map((r) => {
          const catColor = CATEGORY_COLORS[(r.category ?? 'political') as EventCategory] ?? '#6b7280';
          const catIcon = CATEGORY_ICONS[(r.category ?? 'political') as EventCategory] ?? '📌';
          return (
            <Link key={r.id} to={`/event/${r.slug}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{catIcon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{r.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{r.year_approx}</span>
                  {r.geo_modern && <span style={{ fontSize: 10, color: '#94a3b8' }}>· {r.geo_modern}</span>}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Badge label={r.category ?? 'event'} color={catColor} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: EraContext (collapsed accordion)
// ─────────────────────────────────────────────────────────────────────────────

interface EraContextProps {
  year: number | null | undefined;
  isBce: boolean | undefined;
}

/** Collapsible era context accordion. */
function EraContext({ year, isBce }: EraContextProps) {
  const [expanded, setExpanded] = useState(false);
  const era = deriveEra(year, isBce);
  const desc = eraDescription(era);

  return (
    <SectionWrapper title={`Era: ${era}`} icon="📜">
      <div
        style={{
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#e2e8f0',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span>About the {era}</span>
          <span style={{ color: '#64748b', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            ▼
          </span>
        </button>
        {expanded && (
          <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
            {desc}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: NavigationFooter
// ─────────────────────────────────────────────────────────────────────────────

interface NavigationFooterProps {
  slug: string;
}

/** Prev/next event navigation + random event button. */
function NavigationFooter({ slug }: NavigationFooterProps) {
  const navigate = useNavigate();
  const { data: neighbors } = useQuery({
    queryKey: ['neighbors', slug],
    queryFn: () => fetchEventNeighbors(slug),
    staleTime: 10 * 60 * 1000,
  });

  const handleRandom = useCallback(async () => {
    // Search for a common term to get random-ish results
    const terms = ['war', 'revolution', 'discovery', 'empire', 'treaty', 'battle'];
    const term = terms[Math.floor(Math.random() * terms.length)];
    const results = await searchEvents(term, 20);
    if (results.length > 0) {
      const pick = results[Math.floor(Math.random() * results.length)];
      if (pick.slug !== slug) {
        navigate(`/event/${pick.slug}`);
        return;
      }
    }
    navigate('/');
  }, [navigate, slug]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 32px 40px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* Previous */}
      <div style={{ flex: 1 }}>
        {neighbors?.previous ? (
          <Link
            to={`/event/${neighbors.previous.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            ← {neighbors.previous.title}
            <span style={{ fontSize: 11, color: '#64748b' }}>({neighbors.previous.year_approx})</span>
          </Link>
        ) : (
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ← Back to Timeline
          </Link>
        )}
      </div>

      {/* Random */}
      <button
        onClick={handleRandom}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#f59e0b',
          padding: '8px 16px',
          borderRadius: 8,
          border: '1px solid rgba(245,158,11,0.3)',
          backgroundColor: 'rgba(245,158,11,0.08)',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        🎲 Random Event
      </button>

      {/* Next */}
      <div style={{ flex: 1, textAlign: 'right' }}>
        {neighbors?.next ? (
          <Link
            to={`/event/${neighbors.next.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            <span style={{ fontSize: 11, color: '#64748b' }}>({neighbors.next.year_approx})</span>
            {neighbors.next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Small inline badge pill. */
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 4,
        backgroundColor: `${color}22`,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {label}
    </span>
  );
}

/** Metadata row in sidebar. */
function MetaRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      {value && <div style={{ fontSize: 13, color: '#e2e8f0' }}>{value}</div>}
      {children}
    </div>
  );
}

/** Perspective card with evidence bar. */
function PerspectiveCard({ perspective, index }: { perspective: Perspective; index: number }) {
  const ptKey = (perspective.perspective_type ?? 'academic') as keyof typeof PERSPECTIVE_COLORS;
  const color = PERSPECTIVE_COLORS[ptKey] ?? '#6b7280';
  const typeLabel = PERSPECTIVE_LABELS[ptKey] ?? perspective.perspective_type ?? '';

  const narrative = perspective.narrative ?? perspective.summary ?? '';
  const isTruncated = narrative.length > NARRATIVE_TRUNCATE_LENGTH;
  const displayText = isTruncated
    ? `${narrative.slice(0, NARRATIVE_TRUNCATE_LENGTH)}…`
    : narrative;

  const score = perspective.evidence_score ?? 0;
  const scoreColor = evidenceColor(score);
  const scoreLabel = evidenceLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * CARD_STAGGER_DELAY, duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}44`,
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <Badge label={typeLabel} color={color} />
      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
        {perspective.label}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
        {displayText}
      </div>
      {/* Evidence bar */}
      <div style={{ marginTop: 'auto', paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * CARD_STAGGER_DELAY + 0.2 }}
              style={{ height: '100%', backgroundColor: scoreColor, borderRadius: 2 }}
            />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor, fontFamily: 'monospace', minWidth: 80, textAlign: 'right' }}>
            {score.toFixed(2)} · {scoreLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/** Section container with heading. */
function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2 style={sectionHeadingStyle}>
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Fallback notice for empty data. */
function FallbackNotice({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#64748b',
        fontSize: 13,
        fontStyle: 'italic',
      }}
    >
      {message}
    </div>
  );
}

/** Shared heading style for sections. */
const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 18,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────

/** Inject responsive styles once. */
let _responsiveInjected = false;
function injectResponsiveStyles(): void {
  if (_responsiveInjected) return;
  _responsiveInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    .edp-content-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 32px;
      padding: 32px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .edp-causal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    @media (max-width: 768px) {
      .edp-content-grid { grid-template-columns: 1fr; }
      .edp-causal-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

/** Scrollable full-viewport shell matching the dark Chronicle theme. */
function PageShell({ children }: { children: React.ReactNode }) {
  injectResponsiveStyles();
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
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EventDetailPage — top-level page component for `/event/:slug`.
 *
 * Fetches full event detail and orchestrates all sub-sections.
 * Handles loading, error, and not-found states.
 */
export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  // Override root overflow:hidden for scrollable page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';

    // Scroll to top on slug change
    window.scrollTo(0, 0);

    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, [slug]);

  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => fetchEventDetail(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  // Set og:meta tags
  useOgMeta(event, slug);

  // ── Loading ──
  if (isLoading) {
    return (
      <PageShell>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            gap: 16,
            color: '#64748b',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.08)',
              borderTopColor: '#3b82f6',
            }}
          />
          <span style={{ fontSize: 14 }}>Loading event…</span>
        </div>
      </PageShell>
    );
  }

  // ── Error ──
  if (isError || !event) {
    const message = error instanceof Error ? error.message : `Event "${slug}" not found.`;
    return (
      <PageShell>
        <div style={{ padding: '40px 32px' }}>
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
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 10,
              backgroundColor: '#ef444418',
              border: '1px solid #ef444444',
              color: '#fca5a5',
              fontSize: 14,
            }}
          >
            <strong>Error:</strong> {message}
          </div>
        </div>
      </PageShell>
    );
  }

  // ── Full page ──
  return (
    <PageShell>
      {/* 1. Hero */}
      <EventHero event={event} slug={slug!} />

      {/* 2-3. Narrative + Metadata sidebar */}
      <ContentArea event={event} slug={slug!} />

      {/* 4. Causality Chain */}
      <CausalChain event={event} />

      {/* 5. Historical Context */}
      <HistoricalContext slug={slug!} year={event.year_approx} />

      {/* 6. People Involved */}
      <PeopleInvolved slug={slug!} />

      {/* 7. Related Events */}
      <RelatedEvents event={event} />

      {/* 8. Era Context */}
      <EraContext year={event.year_approx} isBce={event.is_bce} />

      {/* 9. Navigation Footer */}
      <NavigationFooter slug={slug!} />
    </PageShell>
  );
}
