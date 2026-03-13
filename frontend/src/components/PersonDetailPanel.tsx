/**
 * PersonDetailPanel.tsx
 *
 * Slide-in side panel (480px, right) for historical figures.
 * Shows biography, connected events timeline, and contemporaries.
 * Mirrors the EventDetailPanel pattern (slide animation, dark theme, same z-index).
 */
import { useQuery } from '@tanstack/react-query';
import { fetchPersonDetail } from '../api/client';
import type { PersonEventItem, ContemporaryItem } from '../types';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

const PANEL_WIDTH = 480;
const PANEL_Z_INDEX = 110;
const SCRUBBER_HEIGHT = 84;
const SLIDE_TRANSITION = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
const BG_COLOR = 'rgba(7, 14, 34, 0.97)';
const BORDER_COLOR = 'rgba(255, 255, 255, 0.1)';

function formatYear(year: number | null, circa?: boolean): string {
  if (year === null) return '?';
  const suffix = circa ? ' c.' : '';
  if (year < 0) return `${Math.abs(year)} BCE${suffix}`;
  return `${year} CE${suffix}`;
}

function formatLifespan(
  birth: number | null,
  birthCirca: boolean,
  death: number | null,
  deathCirca: boolean,
): string {
  const b = birth !== null ? formatYear(birth, birthCirca) : '?';
  const d = death !== null ? formatYear(death, deathCirca) : 'present';
  return `${b} — ${d}`;
}

/** Section heading style matching EventDetailPanel. */
const sectionHeaderStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 12,
};

/** A single event row in the connected events timeline. */
function PersonEventRow({ event }: { event: PersonEventItem }) {
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const setSelectedPerson = useAppStore((s) => s.setSelectedPerson);
  const color = CATEGORY_COLORS[(event.category as EventCategory) ?? 'person'] ?? '#6b7280';
  const icon = CATEGORY_ICONS[(event.category as EventCategory) ?? 'person'] ?? '●';

  const handleViewOnTimeline = () => {
    setSelectedPerson(null);
    setSelectedEvent(event.slug);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Year + category icon */}
      <div style={{ flexShrink: 0, textAlign: 'center', width: 60 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>
          {event.year_approx !== null ? formatYear(event.year_approx) : '?'}
        </div>
        <span
          style={{
            display: 'inline-block',
            marginTop: 4,
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
          }}
        >
          {icon} {event.category ?? 'event'}
        </span>
      </div>

      {/* Event info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{event.title}</div>
        {event.role && (
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            Role: {event.role}
            {event.role_notes ? ` — ${event.role_notes}` : ''}
          </div>
        )}
      </div>

      {/* View on timeline button */}
      <button
        onClick={handleViewOnTimeline}
        style={{
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 600,
          color: '#60a5fa',
          background: 'rgba(96,165,250,0.1)',
          border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 6,
          padding: '4px 8px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        View on timeline
      </button>
    </div>
  );
}

/** Contemporary person chip. */
function ContemporaryChip({ person }: { person: ContemporaryItem }) {
  const setSelectedPerson = useAppStore((s) => s.setSelectedPerson);

  return (
    <button
      onClick={() => setSelectedPerson(person.slug)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#e2e8f0',
        cursor: 'pointer',
        fontSize: 12,
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#eab308',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          flexShrink: 0,
        }}
      >
        👤
      </span>
      <div style={{ textAlign: 'left' }}>
        <div style={{ fontWeight: 600, fontSize: 11, lineHeight: 1.2 }}>{person.name}</div>
        {(person.birth_year !== null || person.death_year !== null) && (
          <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.2 }}>
            {formatYear(person.birth_year)} — {formatYear(person.death_year)}
          </div>
        )}
      </div>
    </button>
  );
}

/** Loading spinner (matches EventDetailPanel). */
function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#eab308',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default function PersonDetailPanel() {
  const selectedPersonSlug = useAppStore((s) => s.selectedPersonSlug);
  const setSelectedPerson = useAppStore((s) => s.setSelectedPerson);

  const { data: person, isLoading, error } = useQuery({
    queryKey: ['person', selectedPersonSlug],
    queryFn: () => fetchPersonDetail(selectedPersonSlug!),
    enabled: !!selectedPersonSlug,
    staleTime: 5 * 60 * 1000,
  });

  const isOpen = selectedPersonSlug !== null;

  const handleClose = () => setSelectedPerson(null);

  const handleShare = () => {
    if (person) {
      const url = `${window.location.origin}/people/${person.slug}`;
      navigator.clipboard.writeText(url);
    }
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
            {person && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {/* Avatar circle */}
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: '#eab308',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      flexShrink: 0,
                      boxShadow: '0 0 12px rgba(234,179,8,0.4)',
                    }}
                  >
                    👤
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
                      {person.name}
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                      {formatLifespan(
                        person.birth_year,
                        person.birth_year_circa,
                        person.death_year,
                        person.death_year_circa,
                      )}
                    </div>
                  </div>
                </div>

                {/* Roles / titles */}
                {person.roles && person.roles.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {person.roles.map((role) => (
                      <span
                        key={role}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor: 'rgba(234,179,8,0.15)',
                          color: '#eab308',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
            {isLoading && (
              <div style={{ color: '#64748b', fontSize: 14, padding: '8px 0' }}>
                Loading person…
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {person && (
              <button
                onClick={handleShare}
                aria-label="Copy share link"
                title="Copy link"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: 8,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  fontSize: 14,
                  lineHeight: 1,
                  transition: 'all 0.15s',
                }}
              >
                🔗
              </button>
            )}
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
                transition: 'all 0.15s',
              }}
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────── */}
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
            Failed to load person details
          </div>
        )}

        {isLoading && <Spinner />}

        {person && (
          <>
            {/* ── Nationalities / Region ──────────────────────────── */}
            {person.nationalities && person.nationalities.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={sectionHeaderStyle}>Region</div>
                <div style={{ fontSize: 13, color: '#e2e8f0' }}>
                  {person.nationalities.join(', ')}
                </div>
              </div>
            )}

            {/* ── Biography ──────────────────────────────────────── */}
            <div style={{ marginBottom: 20 }}>
              <div style={sectionHeaderStyle}>Biography</div>
              {person.description ? (
                <p
                  style={{
                    fontSize: 13,
                    color: '#cbd5e1',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {person.description}
                </p>
              ) : (
                <p
                  style={{
                    fontSize: 13,
                    color: '#64748b',
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  No biography available yet.
                </p>
              )}
              {person.wikipedia_slug && (
                <a
                  href={`https://en.wikipedia.org/wiki/${person.wikipedia_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    marginTop: 8,
                    fontSize: 11,
                    color: '#60a5fa',
                    textDecoration: 'none',
                  }}
                >
                  Read more on Wikipedia →
                </a>
              )}
            </div>

            {/* ── Connected Events Timeline ───────────────────────── */}
            {person.events.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={sectionHeaderStyle}>
                  Events ({person.events.length})
                </div>
                {person.events.map((evt, i) => (
                  <PersonEventRow key={`${evt.id}-${evt.role}-${i}`} event={evt} />
                ))}
              </div>
            )}

            {/* ── Contemporaries ──────────────────────────────────── */}
            {person.contemporaries.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={sectionHeaderStyle}>
                  Contemporaries ({person.contemporaries.length})
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {person.contemporaries.map((c) => (
                    <ContemporaryChip key={c.id} person={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
