/**
 * CategoryTimeline — horizontal century distribution bar chart.
 *
 * Shows event count per century as bars. Clicking a bar sets the era filter.
 * Used at the bottom of /categories/:category pages.
 */

import type { CenturyBucket } from '../api/client';

/** Props for CategoryTimeline. */
interface CategoryTimelineProps {
  /** Century buckets from the API. */
  timeline: CenturyBucket[];
  /** Callback when a century bar is clicked — receives era string or empty to clear. */
  onEraClick: (era: string) => void;
}

/** Maximum bar height in pixels. */
const MAX_BAR_HEIGHT = 120;

/** Map century number to the closest era filter value. */
function centuryToEra(century: number): string {
  const year = century * 100;
  if (year < 500) return 'ancient';
  if (year < 1500) return 'medieval';
  if (year < 1800) return 'early_modern';
  if (year < 1950) return 'modern';
  return 'contemporary';
}

/** Format a century number as a label (e.g., -5 → "6th c. BCE", 19 → "20th c."). */
function formatCentury(century: number): string {
  if (century < 0) {
    const num = Math.abs(century) + 1;
    return `${num}c BCE`;
  }
  const num = century + 1;
  return `${num}c`;
}

/**
 * CategoryTimeline — renders a horizontal bar chart of events by century.
 * @param props - CategoryTimelineProps
 */
export default function CategoryTimeline({ timeline, onEraClick }: CategoryTimelineProps) {
  if (timeline.length === 0) return null;

  const maxCount = Math.max(...timeline.map((b) => b.count));

  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>
        📊 Timeline Distribution
      </h3>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2,
          height: MAX_BAR_HEIGHT + 40,
          overflowX: 'auto',
          paddingBottom: 24,
        }}
      >
        {timeline.map((bucket) => {
          const height = maxCount > 0 ? (bucket.count / maxCount) * MAX_BAR_HEIGHT : 0;
          return (
            <div
              key={bucket.century}
              onClick={() => onEraClick(centuryToEra(bucket.century))}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                minWidth: 32,
                flex: '1 0 32px',
              }}
              title={`${formatCentury(bucket.century)}: ${bucket.count} events`}
            >
              {/* Count label */}
              <span style={{ fontSize: 10, color: '#64748b', marginBottom: 2 }}>{bucket.count}</span>
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 40,
                  height: Math.max(4, height),
                  background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.7'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
              />
              {/* Century label */}
              <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, whiteSpace: 'nowrap' }}>
                {formatCentury(bucket.century)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
