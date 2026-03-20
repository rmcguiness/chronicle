/**
 * RegionColumn — displays a list of events for a single geographic region.
 *
 * Used in the "Around the World" section of the Year in Review page.
 * Shows region name as header, then a list of event summaries.
 */
import { Link } from 'react-router-dom';

/** Region → emoji mapping for visual flair. */
const REGION_EMOJI: Record<string, string> = {
  Europe: '🏰',
  'Middle East': '🕌',
  Africa: '🌍',
  Asia: '🏯',
  Americas: '🗽',
  Oceania: '🌊',
};

interface RegionEvent {
  slug: string;
  title: string;
  yearApprox: number | null;
  category: string | null;
  importanceScore: number;
}

interface RegionColumnProps {
  /** Region name (e.g., "Europe"). */
  region: string;
  /** Events in this region. */
  events: RegionEvent[];
}

/**
 * RegionColumn — renders a column of events for one region.
 */
export default function RegionColumn({ region, events }: RegionColumnProps) {
  const emoji = REGION_EMOJI[region] ?? '🌐';

  return (
    <div
      style={{
        flex: '1 1 280px',
        minWidth: 250,
        maxWidth: 400,
        background: '#fffbeb',
        border: '1px solid #e5e2d8',
        borderRadius: 4,
        padding: '1rem',
      }}
    >
      {/* Region header */}
      <h3
        style={{
          margin: '0 0 0.75rem 0',
          fontSize: '1rem',
          fontWeight: 700,
          fontFamily: "'Georgia', serif",
          color: '#292524',
          borderBottom: '2px solid #d4c89a',
          paddingBottom: '0.5rem',
        }}
      >
        {emoji} {region}
      </h3>

      {events.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: '#a8a29e', fontStyle: 'italic', margin: 0 }}>
          No recorded events
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {events.slice(0, 10).map((ev) => (
            <li key={ev.slug} style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
              <Link
                to={`/event/${ev.slug}`}
                style={{ color: '#1c1917', textDecoration: 'none', fontWeight: 500 }}
              >
                {ev.title}
              </Link>
              {ev.yearApprox !== null && (
                <span style={{ color: '#78716c', fontSize: '0.75rem', marginLeft: 6 }}>
                  ({ev.yearApprox < 0 ? `${Math.abs(ev.yearApprox)} BCE` : ev.yearApprox})
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
