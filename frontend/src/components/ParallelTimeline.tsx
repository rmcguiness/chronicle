/**
 * ParallelTimeline — dual-column synchronized timeline view.
 *
 * Renders two columns of events (one per region) with synchronized year markers
 * that appear at the same vertical position in both columns. This makes it easy
 * to see what was happening simultaneously in two different parts of the world.
 *
 * Owns: year marker generation, column layout, cross-link highlighting.
 * Does NOT own: data fetching, region/era selection, notable parallels.
 */

import { useRef, useCallback } from 'react';
import ParallelEventCard, { type ParallelEvent } from './ParallelEventCard';

// ── Types ────────────────────────────────────────────────────────────────────

interface CrossLink {
  id: string;
  cause_event_id: string;
  effect_event_id: string;
  link_type: string | null;
  strength: number;
  description: string | null;
}

interface ParallelTimelineProps {
  /** Events for region 1 (left column), sorted by year_approx. */
  region1Events: ParallelEvent[];
  /** Events for region 2 (right column), sorted by year_approx. */
  region2Events: ParallelEvent[];
  /** Cross-region causality links. */
  crossLinks: CrossLink[];
  /** Display label for region 1. */
  region1Label: string;
  /** Display label for region 2. */
  region2Label: string;
}

/** Interval (in years) between year markers. Adapts to range size. */
function getMarkerInterval(startYear: number, endYear: number): number {
  const range = endYear - startYear;
  if (range > 3000) return 500;
  if (range > 1000) return 200;
  if (range > 500) return 100;
  if (range > 200) return 50;
  return 25;
}

/**
 * Format a year for display as a year marker.
 *
 * @param year - The year (negative = BCE).
 * @returns Formatted string like "500 BCE" or "1000 CE".
 */
function formatMarkerYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 CE';
  return `${year} CE`;
}

/**
 * Build a merged timeline structure with year markers interleaved with events.
 * Both columns get year markers at the same positions for synchronisation.
 */
interface TimelineRow {
  type: 'marker' | 'event';
  year?: number;
  event?: ParallelEvent;
  column: 'both' | 'left' | 'right';
}

function buildMergedTimeline(
  r1: ParallelEvent[],
  r2: ParallelEvent[],
  startYear: number,
  endYear: number,
): TimelineRow[] {
  const interval = getMarkerInterval(startYear, endYear);
  // Generate year markers
  const markers: number[] = [];
  const firstMarker = Math.ceil(startYear / interval) * interval;
  for (let y = firstMarker; y <= endYear; y += interval) {
    markers.push(y);
  }

  // Merge events and markers into a single sorted list
  const rows: TimelineRow[] = [];
  let i1 = 0;
  let i2 = 0;
  let mi = 0;

  // Process everything in year order
  type Item = { year: number; kind: 'marker' | 'r1' | 'r2'; event?: ParallelEvent };
  const items: Item[] = [];

  for (const m of markers) items.push({ year: m, kind: 'marker' });
  for (const e of r1) if (e.year_approx !== null) items.push({ year: e.year_approx, kind: 'r1', event: e });
  for (const e of r2) if (e.year_approx !== null) items.push({ year: e.year_approx, kind: 'r2', event: e });

  // Sort by year, markers first at same year
  items.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.kind === 'marker') return -1;
    if (b.kind === 'marker') return 1;
    return 0;
  });

  for (const item of items) {
    if (item.kind === 'marker') {
      rows.push({ type: 'marker', year: item.year, column: 'both' });
    } else if (item.kind === 'r1') {
      rows.push({ type: 'event', event: item.event!, column: 'left' });
    } else {
      rows.push({ type: 'event', event: item.event!, column: 'right' });
    }
  }

  return rows;
}

/**
 * ParallelTimeline — renders two synchronised columns of historical events
 * with year markers for temporal alignment.
 *
 * @param props - Events for both regions, cross-links, and labels.
 */
export default function ParallelTimeline({
  region1Events,
  region2Events,
  crossLinks,
  region1Label,
  region2Label,
}: ParallelTimelineProps) {
  // Build set of event IDs that have cross-links for quick lookup
  const crossLinkedIds = new Set<string>();
  for (const link of crossLinks) {
    crossLinkedIds.add(link.cause_event_id);
    crossLinkedIds.add(link.effect_event_id);
  }

  // Determine year range from the data
  const allYears = [
    ...region1Events.map((e) => e.year_approx),
    ...region2Events.map((e) => e.year_approx),
  ].filter((y): y is number => y !== null);

  if (allYears.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
        No events found for the selected regions and era.
      </div>
    );
  }

  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const rows = buildMergedTimeline(region1Events, region2Events, minYear, maxYear);

  return (
    <div style={{ width: '100%' }}>
      {/* Column headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#0f172a',
          padding: '12px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
        className="parallel-header"
      >
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#60a5fa' }}>
          {region1Label}
        </div>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#f472b6' }}>
          {region2Label}
        </div>
      </div>

      {/* Timeline rows */}
      <div>
        {rows.map((row, idx) => {
          if (row.type === 'marker') {
            return (
              <div
                key={`marker-${row.year}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  margin: '16px 0 8px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#fbbf24',
                    whiteSpace: 'nowrap',
                    padding: '2px 12px',
                    borderRadius: '12px',
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                  }}
                >
                  {formatMarkerYear(row.year!)}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
              </div>
            );
          }

          // Event row — placed in left or right column
          const isLeft = row.column === 'left';
          return (
            <div
              key={`event-${row.event!.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>{isLeft && <ParallelEventCard event={row.event!} hasCrossLink={crossLinkedIds.has(row.event!.id)} />}</div>
              <div>{!isLeft && <ParallelEventCard event={row.event!} hasCrossLink={crossLinkedIds.has(row.event!.id)} />}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
