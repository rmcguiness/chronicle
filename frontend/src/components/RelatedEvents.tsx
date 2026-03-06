/**
 * RelatedEvents — displays a list of semantically similar events
 * fetched via pgvector cosine similarity.
 *
 * Rendered inside the EventDetailPanel scrollable area.
 * Clicking a related event navigates to that event's detail panel.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchSimilarEvents } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS } from '../utils/categories';
import type { EventCategory } from '../types';

/** Format year for display (negative = BCE). */
function fmtYear(year: number | null): string {
  if (year === null) return '';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Skeleton placeholder rows shown while loading. */
function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 38,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.04)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

interface RelatedEventsProps {
  slug: string;
}

/**
 * Fetches and renders semantically similar events for the given event slug.
 * Uses react-query with a 5-minute stale time for caching.
 */
export default function RelatedEvents({ slug }: RelatedEventsProps) {
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const { data: events, isLoading } = useQuery({
    queryKey: ['similar-events', slug],
    queryFn: () => fetchSimilarEvents(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingSkeleton />;

  if (!events || events.length === 0) {
    return (
      <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
        No related events found
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {events.map((evt) => {
        const dotColor = evt.category
          ? CATEGORY_COLORS[evt.category as EventCategory] ?? '#6b7280'
          : '#6b7280';

        return (
          <button
            key={evt.id}
            onClick={() => setSelectedEvent(evt.slug)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#e2e8f0',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 13,
              transition: 'background 0.15s',
              width: '100%',
            }}
          >
            {/* Category dot */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            {/* Title */}
            <span
              style={{
                flex: 1,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {evt.title}
            </span>
            {/* Year */}
            {evt.year_approx !== null && (
              <span
                style={{
                  fontSize: 11,
                  color: '#64748b',
                  flexShrink: 0,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {fmtYear(evt.year_approx)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
