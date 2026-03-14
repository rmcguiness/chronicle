/**
 * CollectionDetailPage — vertical timeline view of events in a curated collection.
 *
 * Owns: fetching collection detail, rendering vertical timeline.
 * Does NOT own: collection list (see CollectionsPage), canvas view (see MainView).
 */
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchCollection } from '../api/client';
import type { CollectionEventItem } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';

/** Stale time for collection detail query (5 minutes). */
const DETAIL_STALE_TIME_MS = 5 * 60 * 1000;

/** Maximum characters to show in event summary before truncating. */
const SUMMARY_TRUNCATE_LENGTH = 200;

/** Category badge styles lookup. Falls back to gray for unknown categories. */
const DEFAULT_CATEGORY_COLOR = '#64748b';

/**
 * Format a year for display, handling BCE dates.
 * @param year - The approximate year.
 * @param isBce - Whether the year is BCE.
 * @returns Formatted year string (e.g. "1543" or "500 BCE").
 */
function formatYear(year: number | null, isBce: boolean): string {
  if (year === null) return 'Unknown';
  if (isBce) return `${Math.abs(year)} BCE`;
  return String(year);
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed.
 */
function truncate(text: string | null, maxLen: number): string {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Single event in the vertical timeline.
 */
function TimelineEvent({ event, themeColor }: { event: CollectionEventItem; themeColor: string }) {
  const navigate = useNavigate();
  const categoryColor = (CATEGORY_COLORS as Record<string, string>)[event.event_category ?? ''] ?? DEFAULT_CATEGORY_COLOR;
  const categoryIcon = (CATEGORY_ICONS as Record<string, string>)[event.event_category ?? ''] ?? '📌';

  return (
    <div
      onClick={() => navigate(`/#event=${event.event_slug}`)}
      style={{
        display: 'flex',
        gap: 20,
        cursor: 'pointer',
        padding: '20px 24px',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(15, 23, 42, 0.6)',
        transition: 'background 0.15s, border-color 0.15s, transform 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
        e.currentTarget.style.borderColor = `${themeColor}55`;
        e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.6)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Year column */}
      <div
        style={{
          minWidth: 80,
          textAlign: 'right',
          fontWeight: 700,
          fontSize: 16,
          color: themeColor,
          paddingTop: 2,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatYear(event.year_approx, event.is_bce)}
      </div>

      {/* Dot on timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: themeColor,
            boxShadow: `0 0 8px ${themeColor}60`,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>
            {event.title}
          </h4>
          {event.event_category && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 99,
                background: `${categoryColor}22`,
                color: categoryColor,
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
              }}
            >
              {categoryIcon} {event.event_category}
            </span>
          )}
        </div>
        {event.article_summary && (
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            {truncate(event.article_summary, SUMMARY_TRUNCATE_LENGTH)}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18, paddingTop: 2, flexShrink: 0 }}>→</div>
    </div>
  );
}

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: collection, isLoading, error } = useQuery({
    queryKey: ['collection', slug],
    queryFn: () => fetchCollection(slug!),
    staleTime: DETAIL_STALE_TIME_MS,
    enabled: !!slug,
  });

  /** Build a URL that filters the main canvas to just these events. */
  const startExploringUrl = collection
    ? `/?events=${collection.events.map((e) => e.event_slug).join(',')}`
    : '/';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '40px 20px',
      }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Back link */}
        <Link
          to="/collections"
          style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 24,
          }}
        >
          ← Back to Collections
        </Link>

        {isLoading && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>
            Loading collection…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#f87171', padding: 60 }}>
            Failed to load collection.
          </div>
        )}

        {collection && (
          <>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{collection.icon_emoji}</div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#f1f5f9' }}>
                {collection.title}
              </h1>
              <p style={{ margin: '12px 0 20px', fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                {collection.description}
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 14,
                    color: collection.theme_color,
                    fontWeight: 600,
                  }}
                >
                  {collection.events.length} events
                </span>
                <Link
                  to={startExploringUrl}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 20px',
                    borderRadius: 10,
                    background: collection.theme_color,
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  🗺️ Start Exploring
                </Link>
              </div>
            </div>

            {/* Timeline */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                borderLeft: `2px solid ${collection.theme_color}33`,
                marginLeft: 100,
                paddingLeft: 0,
                position: 'relative',
              }}
            >
              {collection.events.map((event) => (
                <TimelineEvent
                  key={event.event_slug}
                  event={event}
                  themeColor={collection.theme_color}
                />
              ))}
            </div>
          </>
        )}

        {collection === null && !isLoading && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>
            Collection not found.
          </div>
        )}
      </div>
    </div>
  );
}
