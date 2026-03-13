/**
 * PersonDetailPanel — slide-in panel showing details of a selected person.
 *
 * Owns: person bio, dates, nationality, linked events display.
 * Does NOT own: person data fetching logic (uses api/people.ts), graph layout.
 */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPersonById, type PersonDetail } from '../api/people';
import { ROLE_COLORS, getRoleCategory } from '../constants/people';

/** Stale time for person detail queries (5 minutes). */
const DETAIL_STALE_TIME = 5 * 60 * 1000;

interface PersonDetailPanelProps {
  /** UUID of the selected person. */
  personId: string;
  /** Callback to close the panel. */
  onClose: () => void;
}

/**
 * Format a year for display, handling BCE dates.
 * @param year - Year number (negative = BCE)
 * @returns Formatted year string
 */
function formatYear(year: number | null | undefined): string {
  if (year == null) return 'Unknown';
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
}

/**
 * PersonDetailPanel — slides in from the right when a person node is clicked.
 */
export default function PersonDetailPanel({ personId, onClose }: PersonDetailPanelProps) {
  const { data: person, isLoading, error } = useQuery<PersonDetail>({
    queryKey: ['person-detail', personId],
    queryFn: () => fetchPersonById(personId),
    staleTime: DETAIL_STALE_TIME,
  });

  const category = person ? getRoleCategory(person.roles) : 'other';
  const color = ROLE_COLORS[category] ?? ROLE_COLORS.other;

  return (
    <div style={{
      position: 'absolute', top: 0, right: 0, bottom: 0,
      width: '360px', background: '#0f172a', borderLeft: '1px solid #1e293b',
      zIndex: 20, overflowY: 'auto', padding: '1.5rem',
      fontFamily: "'Inter', sans-serif",
      animation: 'slideIn 0.2s ease-out',
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', color: '#94a3b8',
          fontSize: '1.25rem', cursor: 'pointer',
        }}
        aria-label="Close panel"
      >
        ✕
      </button>

      {isLoading && <p style={{ color: '#94a3b8' }}>Loading…</p>}
      {error && <p style={{ color: '#ef4444' }}>Failed to load person details.</p>}

      {person && (
        <>
          {/* Header with avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: `3px solid ${color}`, background: '#1e293b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {person.image_url ? (
                <img src={person.image_url} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <span style={{ color: '#e2e8f0', fontSize: '1.2rem', fontWeight: 700 }}>
                  {person.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 style={{ color: '#e2e8f0', margin: 0, fontSize: '1.2rem' }}>{person.name}</h2>
              {person.roles && person.roles.length > 0 && (
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {person.roles.map((role) => (
                    <span key={role} style={{
                      padding: '0.15rem 0.5rem', borderRadius: '0.25rem',
                      background: color, color: '#fff', fontSize: '0.7rem',
                      fontWeight: 600, textTransform: 'capitalize',
                    }}>
                      {role}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dates + nationality */}
          <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <div><strong style={{ color: '#cbd5e1' }}>Born:</strong> {formatYear(person.born_year)}</div>
            <div><strong style={{ color: '#cbd5e1' }}>Died:</strong> {formatYear(person.died_year)}</div>
            {person.nationality && (
              <div><strong style={{ color: '#cbd5e1' }}>Nationality:</strong> {person.nationality}</div>
            )}
            {person.importance_score != null && person.importance_score > 0 && (
              <div><strong style={{ color: '#cbd5e1' }}>Linked events:</strong> {person.importance_score}</div>
            )}
          </div>

          {/* Bio */}
          {person.bio && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Biography
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
                {person.bio}
              </p>
            </div>
          )}

          {/* Link to timeline */}
          <Link
            to="/"
            style={{
              display: 'inline-block', padding: '0.5rem 1rem',
              background: '#1e293b', border: '1px solid #334155',
              borderRadius: '0.375rem', color: '#e2e8f0',
              textDecoration: 'none', fontSize: '0.85rem',
            }}
          >
            View on Timeline →
          </Link>
        </>
      )}

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
