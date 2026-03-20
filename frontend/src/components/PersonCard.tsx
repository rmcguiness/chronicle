/**
 * PersonCard.tsx
 *
 * Displays a historical figure as a card in the /people grid.
 * Shows name, era badge, lifespan, region, short bio, event count,
 * and Wikipedia link. Click opens the detail panel.
 *
 * Does NOT own: data fetching, detail panel state, routing.
 */
import { motion } from 'framer-motion';

// ── Named constants ─────────────────────────────────────────────────────────

/** Maximum characters for the bio excerpt. */
const BIO_MAX_CHARS = 180;

/** Era badge colors. */
const ERA_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ancient: { bg: 'rgba(234,179,8,0.15)', text: '#eab308', label: 'Ancient' },
  classical: { bg: 'rgba(168,85,247,0.15)', text: '#a855f7', label: 'Classical' },
  medieval: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'Medieval' },
  modern: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', label: 'Modern' },
  contemporary: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'Contemporary' },
};

// ── Types ───────────────────────────────────────────────────────────────────

export interface PersonCardData {
  id: string;
  name: string;
  birth_year: number | null;
  death_year: number | null;
  birth_year_circa: boolean;
  death_year_circa: boolean;
  description: string | null;
  nationalities: string[] | null;
  roles: string[] | null;
  wikipedia_slug: string | null;
  image_url: string | null;
  event_count: number;
}

interface PersonCardProps {
  person: PersonCardData;
  onClick: (person: PersonCardData) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Determine the era of a person based on birth year.
 * Negative years are BCE.
 */
function getEra(birthYear: number | null): string {
  if (birthYear === null) return 'unknown';
  if (birthYear < -800) return 'ancient';
  if (birthYear < 500) return 'classical';
  if (birthYear < 1500) return 'medieval';
  if (birthYear < 1900) return 'modern';
  return 'contemporary';
}

/**
 * Format a year for display. Negative = BCE, positive = CE/AD.
 */
function formatYear(year: number | null, circa: boolean): string {
  if (year === null) return '?';
  const prefix = circa ? 'c. ' : '';
  if (year < 0) return `${prefix}${Math.abs(year)} BCE`;
  return `${prefix}${year}`;
}

/**
 * Truncate description to a short bio excerpt.
 */
function truncateBio(desc: string | null): string {
  if (!desc) return 'No biography available.';
  if (desc.length <= BIO_MAX_CHARS) return desc;
  return desc.slice(0, BIO_MAX_CHARS).replace(/\s+\S*$/, '') + '…';
}

// ── Component ───────────────────────────────────────────────────────────────

/**
 * PersonCard — clickable card showing a historical figure's summary.
 *
 * @param person - Person data to display
 * @param onClick - Handler called when card is clicked
 */
export default function PersonCard({ person, onClick }: PersonCardProps) {
  const era = getEra(person.birth_year);
  const eraStyle = ERA_COLORS[era] || { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', label: 'Unknown' };
  const lifespan = `${formatYear(person.birth_year, person.birth_year_circa)} – ${formatYear(person.death_year, person.death_year_circa)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick(person)}
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.4)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.12)'; }}
    >
      {/* Name + Era badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#f1f5f9', lineHeight: 1.3 }}>
          {person.name}
        </h3>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6,
          background: eraStyle.bg, color: eraStyle.text, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {eraStyle.label}
        </span>
      </div>

      {/* Lifespan */}
      <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
        {lifespan}
      </div>

      {/* Region / Roles */}
      {(person.nationalities || person.roles) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {person.nationalities?.slice(0, 2).map(n => (
            <span key={n} style={{
              fontSize: 11, padding: '1px 6px', borderRadius: 4,
              background: 'rgba(148,163,184,0.1)', color: '#64748b',
            }}>{n}</span>
          ))}
          {person.roles?.slice(0, 2).map(r => (
            <span key={r} style={{
              fontSize: 11, padding: '1px 6px', borderRadius: 4,
              background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
            }}>{r}</span>
          ))}
        </div>
      )}

      {/* Bio excerpt */}
      <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.5, flex: 1 }}>
        {truncateBio(person.description)}
      </p>

      {/* Footer: event count + wikipedia */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {person.event_count} connected event{person.event_count !== 1 ? 's' : ''}
        </span>
        {person.wikipedia_slug && (
          <a
            href={`https://en.wikipedia.org/wiki/${person.wikipedia_slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: 11, color: '#60a5fa', textDecoration: 'none',
              padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(96,165,250,0.25)',
            }}
          >
            Wikipedia ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}
