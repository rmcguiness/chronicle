/**
 * EventDetailPanel.tsx
 *
 * A polished 480px-wide slide-in side panel that displays full event details.
 * Owns: header (title, date, category, importance), location, article content
 * (fetched from Wikipedia via backend), perspectives, and connected events.
 *
 * Does NOT own: event data fetching for the detail (uses react-query),
 * store state shape, or canvas rendering.
 */
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEventDetail, fetchArticle } from '../api/client';
import { IS_DEMO_MODE, wikipediaSearchUrl } from '../config/demo';
import type { ArticleResponse } from '../api/client';
import type { Perspective, ConnectedEvent, Source } from '../types';
import { useAppStore } from '../store';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PERSPECTIVE_COLORS,
  PERSPECTIVE_LABELS,
  evidenceColor,
  evidenceLabel,
} from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Named constants
// ─────────────────────────────────────────────────────────────────────────────

/** Panel width in pixels. */
const PANEL_WIDTH = 480;

/** Z-index — must be above the timeline scrubber (z-index 100). */
const PANEL_Z_INDEX = 110;

/**
 * Height of the TimelineScrubber bar at the bottom of the screen (px).
 * Panel bottom is offset by this amount so content is never hidden behind it.
 */
const SCRUBBER_HEIGHT = 84;

/** CSS transition duration for the slide animation. */
const SLIDE_TRANSITION = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

/** Maximum importance dots to display. */
const MAX_IMPORTANCE_DOTS = 5;

/** Panel background color (dark theme). */
const BG_COLOR = 'rgba(7, 14, 34, 0.97)';

/** Panel border color. */
const BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';

/** Truncation length for perspective narratives. */
const NARRATIVE_TRUNCATE_LENGTH = 220;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: format year (negative = BCE)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year number for display. Negative years show as "X BCE".
 * @param year - The approximate year (negative for BCE)
 * @param dateDisplay - Optional pre-formatted date string
 */
function formatYear(year: number, dateDisplay?: string): string {
  if (dateDisplay) return dateDisplay;
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/**
 * Render importance score as filled/empty dots (e.g. ●●●○○).
 * @param score - 0 to 1 importance value
 */
function ImportanceDots({ score }: { score: number }) {
  const filled = Math.round(score * MAX_IMPORTANCE_DOTS);
  return (
    <span style={{ fontSize: 12, letterSpacing: 2, color: '#94a3b8' }}>
      {Array.from({ length: MAX_IMPORTANCE_DOTS }, (_, i) => (
        <span key={i} style={{ color: i < filled ? '#f59e0b' : '#334155' }}>
          ●
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Evidence score horizontal bar. */
function EvidenceBar({ score }: { score: number }) {
  const color = evidenceColor(score);
  const label = evidenceLabel(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${score * 100}%`,
            backgroundColor: color,
            borderRadius: 3,
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color,
          fontWeight: 700,
          fontFamily: 'monospace',
          minWidth: 60,
        }}
      >
        {score.toFixed(2)} · {label}
      </span>
    </div>
  );
}

/** Source citation item within a perspective card. */
function SourceItem({ source }: { source: Source }) {
  const typeColor =
    source.source_type === 'primary'
      ? '#22c55e'
      : source.source_type === 'secondary'
        ? '#60a5fa'
        : '#94a3b8';

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: `${typeColor}22`,
            color: typeColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {source.source_type}
        </span>
        {source.peer_reviewed && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: '#a855f722',
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Peer reviewed
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{source.title}</div>
      {source.author && (
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
          {source.author}
          {source.publication ? ` · ${source.publication}` : ''}
          {source.publication_date
            ? ` · ${new Date(source.publication_date).getFullYear()}`
            : ''}
        </div>
      )}
      {source.quote && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: '#cbd5e1',
            fontStyle: 'italic',
            borderLeft: '2px solid rgba(255,255,255,0.2)',
            paddingLeft: 8,
          }}
        >
          &ldquo;{source.quote}&rdquo;
        </div>
      )}
    </div>
  );
}

/** Expandable perspective card. */
function PerspectiveCard({
  perspective,
  index,
}: {
  perspective: Perspective;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = PERSPECTIVE_COLORS[perspective.perspective_type] ?? '#6b7280';
  const label =
    PERSPECTIVE_LABELS[perspective.perspective_type] ?? perspective.perspective_type;

  const needsTruncation = perspective.narrative.length > NARRATIVE_TRUNCATE_LENGTH;

  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}44`,
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 12,
        opacity: 0,
        animation: `fadeSlideIn 0.3s ease-out ${index * 0.07}s forwards`,
      }}
    >
      {/* Type badge */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>

      {/* Label + summary */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
        {perspective.label}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 6 }}>
        {perspective.summary}
      </div>

      <EvidenceBar score={perspective.evidence_score} />

      {/* Narrative */}
      <div style={{ marginTop: 10, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
        {expanded || !needsTruncation
          ? perspective.narrative
          : `${perspective.narrative.slice(0, NARRATIVE_TRUNCATE_LENGTH)}…`}
        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginLeft: 6,
              fontSize: 11,
              color: '#60a5fa',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {expanded ? 'read less' : 'read more'}
          </button>
        )}
      </div>

      {/* Sources */}
      {perspective.sources.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginBottom: 6,
            }}
          >
            {perspective.sources.length} Source
            {perspective.sources.length > 1 ? 's' : ''}
          </div>
          {expanded
            ? perspective.sources.map((s) => <SourceItem key={s.id} source={s} />)
            : (
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  Expand to view sources
                </div>
              )}
        </div>
      )}
    </div>
  );
}

/** Loading spinner (simple CSS-based). */
function Spinner() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 0',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#60a5fa',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

/** Connected event chip for the horizontal mini-timeline. */
function ConnectedEventChip({ event }: { event: ConnectedEvent }) {
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  return (
    <button
      onClick={() => setSelectedEvent(event.slug)}
      style={{
        flexShrink: 0,
        padding: '8px 14px',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#e2e8f0',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 12,
        transition: 'background 0.15s',
        minWidth: 120,
        maxWidth: 180,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 11, color: '#60a5fa' }}>
        {formatYear(event.year_approx)}
      </div>
      <div
        style={{
          marginTop: 2,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {event.title}
      </div>
      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
        {event.direction === 'effect' ? '→ effect' : '← cause'}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Article section component
// ─────────────────────────────────────────────────────────────────────────────

/** Combined fetch state for ArticleContent — batched into one object to avoid
 *  synchronous multi-setState calls inside a useEffect (react-hooks/set-state-in-effect). */
interface ArticleFetchState {
  loading: boolean;
  notFound: boolean;
  article: ArticleResponse | null;
}

/** Renders the Wikipedia article content or a fallback message. */
function ArticleContent({ slug, title }: { slug: string; title?: string }) {
  const [fetchState, setFetchState] = useState<ArticleFetchState>({
    loading: true,
    notFound: false,
    article: null,
  });

  const { loading, notFound, article } = fetchState;

  useEffect(() => {
    let cancelled = false;
    // Reset all fetch state atomically before re-fetching. The single setState call avoids
    // multiple cascade renders; the synchronous call is intentional (slug-change reset).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetchState({ loading: true, notFound: false, article: null });

    fetchArticle(slug).then((result) => {
      if (cancelled) return;
      if (!result || result.summary === null) {
        setFetchState({ loading: false, notFound: true, article: null });
      } else {
        setFetchState({ loading: false, notFound: false, article: result });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <Spinner />;

  if (notFound) {
    if (IS_DEMO_MODE) {
      return (
        <div style={{ fontSize: 13, color: '#94a3b8', padding: '8px 0', lineHeight: 1.6 }}>
          Wikipedia article text loads from the backend, so it isn't part of this read-only demo.{' '}
          {title && (
            <a
              href={wikipediaSearchUrl(title)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#60a5fa' }}
            >
              Look it up on Wikipedia →
            </a>
          )}
        </div>
      );
    }
    return (
      <div style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', padding: '8px 0' }}>
        No article available yet.
      </div>
    );
  }

  if (!article) return null;

  return (
    <div>
      <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 12px' }}>
        {article.summary}
      </p>
      {article.sections.map((section, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
            {section.heading}
          </h4>
          <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            {section.content}
          </p>
        </div>
      ))}
      {article.source_url && (
        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11,
            color: '#60a5fa',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Read more on Wikipedia →
        </a>
      )}
      <p style={{ fontSize: 10, color: '#64748b', margin: '6px 0 0' }}>
        Text from Wikipedia, available under{' '}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#64748b' }}
        >
          CC BY-SA 4.0
        </a>
        .
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Global CSS keyframes (injected once)
// ─────────────────────────────────────────────────────────────────────────────

let stylesInjected = false;
function injectStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EventDetailPanel — slide-in side panel showing full event details.
 *
 * Reads `selectedEventSlug` and `detailPanelOpen` from the Zustand store.
 * When open, fetches event detail via react-query and article via the
 * `/article` endpoint.
 */
export default function EventDetailPanel() {
  injectStyles();

  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const setDetailPanelOpen = useAppStore((s) => s.setDetailPanelOpen);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', selectedEventSlug],
    queryFn: () => fetchEventDetail(selectedEventSlug!),
    enabled: !!selectedEventSlug,
    staleTime: 5 * 60 * 1000,
  });

  const isOpen = detailPanelOpen && selectedEventSlug !== null;
  const color = event ? CATEGORY_COLORS[event.category] : '#6b7280';
  const icon = event ? CATEGORY_ICONS[event.category] : '';

  /** Close the panel and clear selection. */
  const handleClose = () => {
    setDetailPanelOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: SCRUBBER_HEIGHT,
        width: PANEL_WIDTH,
        backgroundColor: BG_COLOR,
        backdropFilter: 'blur(16px)',
        borderLeft: `1px solid ${BORDER_COLOR}`,
        zIndex: PANEL_Z_INDEX,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
        transform: isOpen ? 'translateX(0)' : `translateX(${PANEL_WIDTH}px)`,
        transition: SLIDE_TRANSITION,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${BORDER_COLOR}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            {event && (
              <>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}
                >
                  {/* Category badge */}
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                      boxShadow: `0 0 12px ${color}66`,
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#f1f5f9',
                        lineHeight: 1.2,
                      }}
                    >
                      {event.title}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                      {formatYear(event.year_approx, event.date_display)}
                    </div>
                  </div>
                </div>
                {/* Importance dots */}
                <div style={{ marginTop: 4 }}>
                  <ImportanceDots score={event.importance_score} />
                </div>
              </>
            )}
            {isLoading && (
              <div style={{ color: '#64748b', fontSize: 14, padding: '8px 0' }}>
                Loading event…
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close detail panel"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: 8,
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: 18,
              lineHeight: 1,
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
      {/* minHeight: 0 is required for overflow-y:auto to work inside a flex column */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px' }}>
        {error && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: '#ef444422',
              border: '1px solid #ef444444',
              color: '#fca5a5',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            Failed to load event details
          </div>
        )}

        {event && (
          <>
            {/* ── Location ──────────────────────────────────────────── */}
            {event.geo_modern && (
              <div style={{ marginBottom: 20 }}>
                <div style={sectionHeaderStyle}>Location</div>
                <div style={{ fontSize: 13, color: '#e2e8f0' }}>
                  {event.geo_modern}
                  {event.geo_era_label &&
                    event.geo_era_label !== event.geo_modern && (
                      <span style={{ color: '#64748b' }}>
                        {' '}
                        (historically: {event.geo_era_label})
                      </span>
                    )}
                </div>
              </div>
            )}

            {/* ── Article ───────────────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={sectionHeaderStyle}>Article</div>
              <ArticleContent slug={event.slug} title={event.title} />
            </div>

            {/* ── Perspectives ──────────────────────────────────────── */}
            {event.perspectives.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={sectionHeaderStyle}>
                  Perspectives ({event.perspectives.length})
                </div>
                {event.perspectives
                  .sort((a, b) => b.evidence_score - a.evidence_score)
                  .map((p, i) => (
                    <PerspectiveCard key={p.id} perspective={p} index={i} />
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Connected events mini-timeline ─────────────────────────── */}
      {event && event.connected_events && event.connected_events.length > 0 && (
        <div
          style={{
            flexShrink: 0,
            borderTop: `1px solid ${BORDER_COLOR}`,
            padding: '12px 20px 16px',
          }}
        >
          <div style={{ ...sectionHeaderStyle, marginBottom: 8 }}>Connected Events</div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {event.connected_events.map((ce) => (
              <ConnectedEventChip key={ce.id} event={ce} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Shared style for section heading labels. */
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 12,
};
