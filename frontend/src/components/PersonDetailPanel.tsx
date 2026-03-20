/**
 * PersonDetailPanel.tsx
 *
 * Slide-in right panel showing full details for a selected historical figure.
 * Shows: full bio, lifespan visualization bar, connected events list,
 * and a "View on network" navigation button.
 *
 * Does NOT own: data fetching for the person list, grid layout, or routing.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ── Named constants ─────────────────────────────────────────────────────────

/** Panel width in pixels. */
const PANEL_WIDTH = 480;

/** Z-index — must be above most UI. */
const PANEL_Z_INDEX = 200;

/** Timeline range for the lifespan bar visualization (BCE negative). */
const TIMELINE_MIN = -3000;
const TIMELINE_MAX = 2025;
const TIMELINE_SPAN = TIMELINE_MAX - TIMELINE_MIN;

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

// ── Types ───────────────────────────────────────────────────────────────────

interface ConnectedEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
  role: string;
  role_notes: string | null;
}

interface PersonDetail {
  id: string;
  name: string;
  aliases: string[] | null;
  birth_year: number | null;
  death_year: number | null;
  birth_year_circa: boolean;
  death_year_circa: boolean;
  description: string | null;
  nationalities: string[] | null;
  roles: string[] | null;
  gender: string | null;
  wikipedia_slug: string | null;
  image_url: string | null;
  wikidata_id: string | null;
  connected_events: ConnectedEvent[];
}

interface PersonDetailPanelProps {
  /** Wikipedia slug of the selected person, or null to hide the panel. */
  slug: string | null;
  /** Callback to close the panel. */
  onClose: () => void;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Format year for display. */
function fmtYear(y: number | null, circa: boolean): string {
  if (y === null) return '?';
  const p = circa ? 'c. ' : '';
  return y < 0 ? `${p}${Math.abs(y)} BCE` : `${p}${y}`;
}

/** Category color map (matches main app). */
const CAT_COLORS: Record<string, string> = {
  war: '#ef4444',
  political: '#a855f7',
  cultural: '#eab308',
  discovery: '#22c55e',
  natural: '#06b6d4',
  person: '#f97316',
};

// ── Component ───────────────────────────────────────────────────────────────

/**
 * PersonDetailPanel — slide-in right panel for a historical figure.
 *
 * @param slug - Wikipedia slug of the person to show (null = hidden)
 * @param onClose - Called when user closes the panel
 */
export default function PersonDetailPanel({ slug, onClose }: PersonDetailPanelProps) {
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setPerson(null); return; }
    setLoading(true);
    setError(null);
    axios.get<PersonDetail>(`${BASE_URL}/api/people/${slug}`)
      .then(r => setPerson(r.data))
      .catch(() => setError('Failed to load person details.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Lifespan bar positioning
  const lifespanLeft = person?.birth_year != null
    ? ((person.birth_year - TIMELINE_MIN) / TIMELINE_SPAN) * 100
    : 0;
  const lifespanWidth = person?.birth_year != null && person?.death_year != null
    ? Math.max(((person.death_year - person.birth_year) / TIMELINE_SPAN) * 100, 0.5)
    : 1;

  return (
    <AnimatePresence>
      {slug && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: PANEL_Z_INDEX - 1,
              background: 'rgba(0,0,0,0.4)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: PANEL_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: PANEL_WIDTH }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: PANEL_WIDTH, maxWidth: '100vw',
              zIndex: PANEL_Z_INDEX,
              background: 'rgba(7,14,34,0.97)',
              backdropFilter: 'blur(20px)',
              borderLeft: '1px solid rgba(148,163,184,0.12)',
              overflowY: 'auto',
              padding: 28,
              fontFamily: "'Inter', sans-serif",
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                background: 'none', border: 'none', color: '#94a3b8',
                fontSize: 22, cursor: 'pointer', padding: 4,
              }}
            >
              ✕
            </button>

            {loading && (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>Loading…</div>
            )}

            {error && (
              <div style={{ color: '#ef4444', textAlign: 'center', padding: 40 }}>{error}</div>
            )}

            {person && !loading && (
              <>
                {/* Header */}
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#f1f5f9' }}>
                    {person.name}
                  </h2>
                  {person.aliases && person.aliases.length > 0 && (
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                      Also known as: {person.aliases.join(', ')}
                    </div>
                  )}
                  <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>
                    {fmtYear(person.birth_year, person.birth_year_circa)} – {fmtYear(person.death_year, person.death_year_circa)}
                  </div>
                  {person.nationalities && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                      {person.nationalities.map(n => (
                        <span key={n} style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4,
                          background: 'rgba(148,163,184,0.1)', color: '#94a3b8',
                        }}>{n}</span>
                      ))}
                    </div>
                  )}
                  {person.roles && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
                      {person.roles.map(r => (
                        <span key={r} style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 4,
                          background: 'rgba(59,130,246,0.1)', color: '#60a5fa',
                        }}>{r}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lifespan bar */}
                {person.birth_year != null && (
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
                      Lifespan
                    </div>
                    <div style={{
                      position: 'relative', height: 20, borderRadius: 6,
                      background: 'rgba(148,163,184,0.08)',
                      border: '1px solid rgba(148,163,184,0.1)',
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: `${lifespanLeft}%`,
                        width: `${lifespanWidth}%`,
                        top: 2, bottom: 2,
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                        minWidth: 4,
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', marginTop: 2 }}>
                      <span>3000 BCE</span>
                      <span>1 CE</span>
                      <span>2025</span>
                    </div>
                  </div>
                )}

                {/* Full bio */}
                {person.description && (
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6, fontWeight: 500 }}>
                      Biography
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: '#cbd5e1', lineHeight: 1.65 }}>
                      {person.description}
                    </p>
                  </div>
                )}

                {/* Connected events */}
                {person.connected_events.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>
                      Connected Events ({person.connected_events.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {person.connected_events.map(ev => (
                        <div
                          key={`${ev.id}-${ev.role}`}
                          onClick={() => navigate(`/event/${ev.slug}`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '8px 10px', borderRadius: 8,
                            background: 'rgba(148,163,184,0.05)',
                            border: '1px solid rgba(148,163,184,0.08)',
                            cursor: 'pointer', transition: 'border-color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.3)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148,163,184,0.08)'; }}
                        >
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                            background: CAT_COLORS[ev.category || ''] || '#94a3b8',
                          }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 13, color: '#e2e8f0', fontWeight: 500,
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {ev.title}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {ev.year_approx != null
                                ? (ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : ev.year_approx)
                                : 'Unknown date'}
                              {' · '}{ev.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => navigate(`/?person=${person.wikipedia_slug}`)}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 8,
                      background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
                      color: '#818cf8', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    View on Network
                  </button>
                  {person.wikipedia_slug && (
                    <a
                      href={`https://en.wikipedia.org/wiki/${person.wikipedia_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 8, textAlign: 'center',
                        background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
                        color: '#60a5fa', fontSize: 13, fontWeight: 500, textDecoration: 'none',
                      }}
                    >
                      Wikipedia ↗
                    </a>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
