/**
 * EventDetailPage — full-page view for a single historical event.
 *
 * Route: /event/:slug
 *
 * Sections rendered:
 *  1. Hero — title, date (BCE-aware), region badge, importance score
 *  2. Wikipedia summary — fetched from GET /api/events/{slug}/wiki
 *  3. Perspectives — per-viewpoint narrative cards
 *  4. Mini-timeline — causality chain (causes → this event → effects)
 *  5. Back-to-timeline navigation
 *
 * Does NOT own: routing setup (see App.tsx), global store, canvas/map state.
 */

import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchEventDetail, fetchWikiData } from '../api/client';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  PERSPECTIVE_COLORS,
  PERSPECTIVE_LABELS,
  evidenceColor,
  evidenceLabel,
} from '../utils/categories';
import type { Perspective, ConnectedEvent } from '../types';
import type { WikiData } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum characters shown in a perspective narrative before truncation. */
const NARRATIVE_TRUNCATE_LENGTH = 300;

/** Stagger delay (seconds) between perspective card animations. */
const CARD_STAGGER_DELAY = 0.07;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year for display, handling BCE flag.
 *
 * @param year - Approximate year (positive integer).
 * @param isBce - Whether the year is Before Common Era.
 * @returns Human-readable year string e.g. "1914" or "44 BCE".
 */
function formatYear(year: number | undefined | null, isBce: boolean | undefined): string {
  if (year == null) return 'Unknown date';
  return isBce ? `${year} BCE` : String(year);
}

/**
 * Format an importance score (0–1) as a percentage string.
 *
 * @param score - Importance score between 0 and 1.
 * @returns Percentage string e.g. "95%".
 */
function formatImportance(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Map a connected event's direction+type to a short arrow label.
 *
 * @param direction - 'cause' or 'effect'.
 * @param connectionType - The causality link type string.
 * @returns Short label with arrow indicator.
 */
function connectionLabel(direction: ConnectedEvent['direction'], connectionType: string): string {
  const arrow = direction === 'cause' ? '←' : '→';
  const typeLabel =
    connectionType === 'causes' ? 'Caused by'
    : connectionType === 'enables' ? 'Enabled by'
    : connectionType === 'leads_to' ? 'Leads to'
    : 'Context';
  return direction === 'cause'
    ? `${arrow} ${typeLabel.replace('Caused by', 'Caused this').replace('Enabled by', 'Enabled this')}`
    : `${arrow} ${typeLabel}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Hero section ──────────────────────────────────────────────────────────────

interface HeroSectionProps {
  title: string;
  year: number | null | undefined;
  isBce: boolean | undefined;
  region: string | undefined;
  category: string | undefined;
  importanceScore: number;
}

/**
 * Full-width hero section displaying the event's primary metadata.
 *
 * @param props.title - Event title.
 * @param props.year - Approximate year (may be null).
 * @param props.isBce - Whether the year is Before Common Era.
 * @param props.region - Modern geographic region label.
 * @param props.category - Event category key (war, political, etc.).
 * @param props.importanceScore - Importance score 0–1.
 */
function HeroSection({ title, year, isBce, region, category, importanceScore }: HeroSectionProps) {
  const catKey = (category ?? 'political') as keyof typeof CATEGORY_COLORS;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const icon = CATEGORY_ICONS[catKey] ?? '📌';
  const catLabel = CATEGORY_LABELS[catKey] ?? category ?? '';
  const impColor = evidenceColor(importanceScore);
  const impPct = formatImportance(importanceScore);

  return (
    <div
      style={{
        padding: '40px 32px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${color}14 100%)`,
      }}
    >
      {/* Back link */}
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
          transition: 'color 0.15s',
        }}
      >
        ← Back to Timeline
      </Link>

      {/* Category badge + icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
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
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 6,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {catLabel}
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.2,
          marginBottom: 14,
        }}
      >
        {title}
      </h1>

      {/* Metadata row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        {/* Date */}
        <MetaBadge icon="📅" label={formatYear(year, isBce)} color="#94a3b8" />

        {/* Region */}
        {region && <MetaBadge icon="📍" label={region} color="#94a3b8" />}

        {/* Importance score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MetaBadge icon="⭐" label={`Importance ${impPct}`} color={impColor} />
          {/* Mini bar */}
          <div
            style={{
              width: 80,
              height: 5,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${importanceScore * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              style={{ height: '100%', backgroundColor: impColor, borderRadius: 3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetaBadgeProps {
  icon: string;
  label: string;
  color: string;
}

/**
 * Small inline badge showing an icon + label used in the hero metadata row.
 */
function MetaBadge({ icon, label, color }: MetaBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 13,
        color,
        padding: '4px 10px',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {icon} {label}
    </span>
  );
}

// ── Wikipedia section ─────────────────────────────────────────────────────────

interface WikiSectionProps {
  slug: string;
}

/**
 * Wikipedia summary block.
 * Fetches `/api/events/{slug}/wiki` and renders summary + thumbnail,
 * or shows a graceful fallback when no Wikipedia article is found.
 *
 * @param props.slug - Event slug used as the API key.
 */
function WikiSection({ slug }: WikiSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['wiki', slug],
    queryFn: () => fetchWikiData(slug),
    staleTime: 10 * 60 * 1000, // Wikipedia data changes rarely
  });

  return (
    <SectionWrapper title="Wikipedia" icon="📖">
      {isLoading && (
        <div style={{ color: '#64748b', fontSize: 13, padding: '8px 0' }}>
          Fetching Wikipedia summary…
        </div>
      )}

      {isError && (
        <FallbackNotice message="Could not fetch Wikipedia data." />
      )}

      {data && !data.found && (
        <FallbackNotice message="No Wikipedia article found for this event." />
      )}

      {data && data.found && (
        <WikiContent wiki={data} />
      )}
    </SectionWrapper>
  );
}

interface WikiContentProps {
  wiki: WikiData;
}

/** Renders the actual Wikipedia article content when found. */
function WikiContent({ wiki }: WikiContentProps) {
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      {/* Thumbnail */}
      {wiki.thumbnail && (
        <img
          src={wiki.thumbnail}
          alt={wiki.title}
          style={{
            width: 140,
            height: 100,
            objectFit: 'cover',
            borderRadius: 8,
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        />
      )}

      {/* Text content */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: 14,
            color: '#cbd5e1',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {wiki.summary}
        </p>
        <a
          href={wiki.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginTop: 12,
            fontSize: 13,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          🔗 Read more on Wikipedia
        </a>
      </div>
    </div>
  );
}

// ── Perspectives section ──────────────────────────────────────────────────────

interface PerspectivesSectionProps {
  perspectives: Perspective[];
}

/**
 * Renders all available perspectives as staggered animated cards.
 * Each card shows the viewpoint label, narrative, and evidence score.
 *
 * @param props.perspectives - Array of perspective objects from the event detail.
 */
function PerspectivesSection({ perspectives }: PerspectivesSectionProps) {
  if (perspectives.length === 0) {
    return (
      <SectionWrapper title="Perspectives" icon="🌐">
        <FallbackNotice message="No perspectives recorded for this event." />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title={`Perspectives (${perspectives.length})`} icon="🌐">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {perspectives.map((p, i) => (
          <PerspectiveCard key={p.id} perspective={p} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}

interface PerspectiveCardProps {
  perspective: Perspective;
  index: number;
}

/**
 * Individual perspective card with label, type badge, narrative, and evidence score.
 *
 * @param props.perspective - Perspective data object.
 * @param props.index - Position in list — used to compute stagger animation delay.
 */
function PerspectiveCard({ perspective, index }: PerspectiveCardProps) {
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
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Type badge */}
      <span
        style={{
          display: 'inline-block',
          alignSelf: 'flex-start',
          fontSize: 10,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 4,
          backgroundColor: `${color}22`,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
        }}
      >
        {typeLabel}
      </span>

      {/* Label */}
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
        {perspective.label}
      </div>

      {/* Narrative */}
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
        {displayText}
      </div>

      {/* Evidence score */}
      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: index * CARD_STAGGER_DELAY + 0.2 }}
              style={{ height: '100%', backgroundColor: scoreColor, borderRadius: 2 }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: scoreColor,
              fontFamily: 'monospace',
              minWidth: 90,
              textAlign: 'right',
            }}
          >
            {score.toFixed(2)} · {scoreLabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Mini-timeline section ─────────────────────────────────────────────────────

interface MiniTimelineProps {
  title: string;
  connectedEvents: ConnectedEvent[];
}

/**
 * Horizontal mini-timeline showing causality chain:
 *   [cause events] → [THIS EVENT] → [effect events]
 *
 * Connected events are sorted so causes appear left and effects appear right.
 * Clicking a related event navigates to its detail page.
 *
 * @param props.title - The current event's title (shown in center node).
 * @param props.connectedEvents - All causally related events with direction metadata.
 */
function MiniTimeline({ title, connectedEvents }: MiniTimelineProps) {
  if (connectedEvents.length === 0) {
    return (
      <SectionWrapper title="Causality Chain" icon="⛓️">
        <FallbackNotice message="No causality links found for this event." />
      </SectionWrapper>
    );
  }

  // Separate into causes (events that led to this) and effects (events this caused)
  const causes = connectedEvents.filter((e) => e.direction === 'cause');
  const effects = connectedEvents.filter((e) => e.direction === 'effect');

  return (
    <SectionWrapper title="Causality Chain" icon="⛓️">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 8,
          // Custom scrollbar via className would need CSS; use inline minimal override
        }}
      >
        {/* Cause nodes */}
        {causes.map((ev) => (
          <TimelineNodeGroup key={ev.id} event={ev} side="cause" />
        ))}

        {/* This event — center anchor */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              backgroundColor: '#3b82f622',
              border: '2px solid #3b82f6',
              fontSize: 13,
              fontWeight: 800,
              color: '#93c5fd',
              textAlign: 'center',
              maxWidth: 180,
              lineHeight: 1.3,
              boxShadow: '0 0 16px #3b82f633',
            }}
          >
            {title}
          </div>
          <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            This Event
          </span>
        </div>

        {/* Effect nodes */}
        {effects.map((ev) => (
          <TimelineNodeGroup key={ev.id} event={ev} side="effect" />
        ))}
      </div>
    </SectionWrapper>
  );
}

interface TimelineNodeGroupProps {
  event: ConnectedEvent;
  side: 'cause' | 'effect';
}

/**
 * A single causally-related event node plus its connecting arrow.
 *
 * @param props.event - The related event data.
 * @param props.side - 'cause' renders to the left, 'effect' to the right.
 */
function TimelineNodeGroup({ event, side }: TimelineNodeGroupProps) {
  const arrowColor = '#475569';
  const label = connectionLabel(event.direction, event.connection_type);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
      {/* Arrow connector — left side shows arrow before the node */}
      {side === 'effect' && (
        <Arrow color={arrowColor} label={label} />
      )}

      {/* Event node */}
      <Link
        to={`/event/${event.slug}`}
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 12,
            fontWeight: 600,
            color: '#e2e8f0',
            textAlign: 'center',
            maxWidth: 150,
            lineHeight: 1.3,
            cursor: 'pointer',
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.24)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          {event.title}
          {event.year_approx != null && (
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>
              {event.year_approx}
            </div>
          )}
        </div>
      </Link>

      {/* Arrow connector — right side for cause nodes */}
      {side === 'cause' && (
        <Arrow color={arrowColor} label={label} />
      )}
    </div>
  );
}

interface ArrowProps {
  color: string;
  label: string;
}

/**
 * Horizontal arrow connector with a small relationship label below.
 *
 * @param props.color - Arrow color (hex or CSS color).
 * @param props.label - Short text label shown beneath the arrow.
 */
function Arrow({ color, label }: ArrowProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '0 4px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <div style={{ width: 32, height: 2, backgroundColor: color }} />
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: `7px solid ${color}`,
          }}
        />
      </div>
      <span style={{ fontSize: 9, color, fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

interface SectionWrapperProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

/**
 * Consistent section container with a heading row and content area.
 *
 * @param props.title - Section heading text.
 * @param props.icon - Emoji icon shown before the heading.
 * @param props.children - Section body content.
 */
function SectionWrapper({ title, icon, children }: SectionWrapperProps) {
  return (
    <section
      style={{
        padding: '28px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

interface FallbackNoticeProps {
  message: string;
}

/**
 * Graceful fallback notice shown when data is absent or unavailable.
 *
 * @param props.message - Human-readable explanation.
 */
function FallbackNotice({ message }: FallbackNoticeProps) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EventDetailPage — top-level page component for `/event/:slug`.
 *
 * Fetches full event detail from the API and orchestrates all sub-sections.
 * Handles loading, error, and not-found states gracefully.
 */
export default function EventDetailPage() {
  // `slug` is guaranteed by the React Router path `/event/:slug`
  const { slug } = useParams<{ slug: string }>();

  // The Chronicle root CSS sets html/body/root to overflow:hidden for the canvas view.
  // Override to allow this page to scroll, then restore on unmount.
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

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <PageShell>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
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

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !event) {
    const message =
      error instanceof Error ? error.message : `Event "${slug}" not found.`;
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

  // ── Render full page ───────────────────────────────────────────────────────
  return (
    <PageShell>
      {/* 1. Hero */}
      <HeroSection
        title={event.title}
        year={event.year_approx}
        isBce={event.is_bce}
        region={event.geo_modern ?? event.geo_era_label}
        category={event.category}
        importanceScore={event.importance_score}
      />

      {/* 2. Wikipedia */}
      {slug && <WikiSection slug={slug} />}

      {/* 3. Perspectives */}
      <PerspectivesSection perspectives={event.perspectives ?? []} />

      {/* 4. Mini-timeline */}
      <MiniTimeline
        title={event.title}
        connectedEvents={event.connected_events ?? []}
      />

      {/* 5. Bottom back-link */}
      <div style={{ padding: '24px 32px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
            transition: 'background 0.15s',
          }}
        >
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────

interface PageShellProps {
  children: React.ReactNode;
}

/**
 * Scrollable full-viewport page shell matching the dark Chronicle theme.
 * All page content renders inside this container.
 *
 * @param props.children - Page sections.
 */
function PageShell({ children }: PageShellProps) {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
        // Reset root overflow:hidden from index.html for this page
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}
