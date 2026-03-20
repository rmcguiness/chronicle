/**
 * ParallelTimeline — dual-column synchronized timeline view.
 *
 * Renders two columns of events (one per region) with synchronized year markers
 * that appear at the same vertical position in both columns.
 *
 * Owns: year marker generation, column layout, cross-link highlighting.
 * Does NOT own: data fetching, region/era selection.
 */

import ParallelEventCard, { type ParallelEvent } from './ParallelEventCard';

interface CrossLink {
  id: string;
  cause_event_id: string;
  effect_event_id: string;
  link_type: string | null;
  strength: number;
  description: string | null;
}

interface ParallelTimelineProps {
  region1Events: ParallelEvent[];
  region2Events: ParallelEvent[];
  crossLinks: CrossLink[];
  region1Label: string;
  region2Label: string;
}

/** Choose year marker interval based on range size. */
function getMarkerInterval(startYear: number, endYear: number): number {
  const range = endYear - startYear;
  if (range > 3000) return 500;
  if (range > 1000) return 200;
  if (range > 500) return 100;
  if (range > 200) return 50;
  return 25;
}

function formatMarkerYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 CE';
  return `${year} CE`;
}

interface TimelineRow {
  type: 'marker' | 'event';
  year?: number;
  event?: ParallelEvent;
  column: 'both' | 'left' | 'right';
}

/** Merge events and year markers into a single sorted timeline. */
function buildMergedTimeline(
  r1: ParallelEvent[],
  r2: ParallelEvent[],
  startYear: number,
  endYear: number,
): TimelineRow[] {
  const interval = getMarkerInterval(startYear, endYear);
  const firstMarker = Math.ceil(startYear / interval) * interval;

  type Item = { year: number; kind: 'marker' | 'r1' | 'r2'; event?: ParallelEvent };
  const items: Item[] = [];

  for (let y = firstMarker; y <= endYear; y += interval) {
    items.push({ year: y, kind: 'marker' });
  }
  for (const e of r1) if (e.year_approx !== null) items.push({ year: e.year_approx, kind: 'r1', event: e });
  for (const e of r2) if (e.year_approx !== null) items.push({ year: e.year_approx, kind: 'r2', event: e });

  items.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    if (a.kind === 'marker') return -1;
    if (b.kind === 'marker') return 1;
    return 0;
  });

  return items.map((item): TimelineRow => {
    if (item.kind === 'marker') return { type: 'marker', year: item.year, column: 'both' };
    return { type: 'event', event: item.event!, column: item.kind === 'r1' ? 'left' : 'right' };
  });
}

/**
 * ParallelTimeline — renders two synchronised columns of historical events.
 */
export default function ParallelTimeline({
  region1Events, region2Events, crossLinks, region1Label, region2Label,
}: ParallelTimelineProps) {
  const crossLinkedIds = new Set<string>();
  for (const link of crossLinks) {
    crossLinkedIds.add(link.cause_event_id);
    crossLinkedIds.add(link.effect_event_id);
  }

  const allYears = [
    ...region1Events.map((e) => e.year_approx),
    ...region2Events.map((e) => e.year_approx),
  ].filter((y): y is number => y !== null);

  if (allYears.length === 0) {
    return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No events found.</div>;
  }

  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const rows = buildMergedTimeline(region1Events, region2Events, minYear, maxYear);

  return (
    <div style={{ width: '100%' }}>
      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
        marginBottom: '16px', position: 'sticky', top: 0, zIndex: 10,
        background: '#0f172a', padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#60a5fa' }}>{region1Label}</div>
        <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', color: '#f472b6' }}>{region2Label}</div>
      </div>

      {rows.map((row, idx) => {
        if (row.type === 'marker') {
          return (
            <div key={`m-${row.year}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0 8px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
              <span style={{
                fontSize: '13px', fontWeight: 700, color: '#fbbf24', whiteSpace: 'nowrap',
                padding: '2px 12px', borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)',
              }}>
                {formatMarkerYear(row.year!)}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
            </div>
          );
        }

        const isLeft = row.column === 'left';
        return (
          <div key={`e-${row.event!.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>{isLeft && <ParallelEventCard event={row.event!} hasCrossLink={crossLinkedIds.has(row.event!.id)} />}</div>
            <div>{!isLeft && <ParallelEventCard event={row.event!} hasCrossLink={crossLinkedIds.has(row.event!.id)} />}</div>
          </div>
        );
      })}
    </div>
  );
}
