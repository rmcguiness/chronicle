/**
 * PersonDetailPage — full biography page for a historical figure.
 *
 * Route: /people/:slug
 *
 * Sections:
 *  1. BiographyHero — name, dates, nationality, role, contemporaries
 *  2. BiographyNarrative — full description text + Wikipedia link
 *  3. AssociatedEventsTimeline — vertical timeline of linked events
 *  4. InfluenceScore — influence metric, percentile, leaderboard
 *  5. RelatedPeople — people who share events
 */

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchPersonDetail } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { PersonDetail, PersonSummary, PersonEvent } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Style constants — matching EventDetailPage's dark theme
// ─────────────────────────────────────────────────────────────────────────────

const BG = '#070e22';
const BG_CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#8b5cf6';
const ACCENT_BG = 'rgba(139,92,246,0.15)';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format a year for display, handling BCE. */
function formatYear(year: number | null | undefined, circa?: boolean): string {
  if (year == null) return '?';
  const prefix = circa ? 'c. ' : '';
  return year < 0 ? `${prefix}${Math.abs(year)} BCE` : `${prefix}${year}`;
}

/** Format life span as "birth – death". */
function lifeSpan(p: PersonSummary): string {
  const b = p.birth_year_display ?? '?';
  const d = p.death_year_display ?? '?';
  if (b === '?' && d === '?') return 'Dates unknown';
  return `${b} \u2013 ${d}`;
}

/** Map category key to colour, with fallback. */
function catColor(cat: string | null): string {
  return CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] ?? '#6b7280';
}

/** Map category key to icon, with fallback. */
function catIcon(cat: string | null): string {
  return CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS] ?? '\u{1F4CC}';
}

/** Assign an era label from a year. */
function eraLabel(year: number | null): string {
  if (year == null) return '';
  if (year < -3000) return 'Prehistoric';
  if (year < 500) return 'Ancient';
  if (year < 1500) return 'Medieval';
  if (year < 1800) return 'Early Modern';
  return 'Modern';
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** A small inline badge with icon + label. */
function Badge({ icon, label, color = TEXT_SECONDARY }: { icon: string; label: string; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 13,
        color,
        padding: '4px 10px',
        borderRadius: 6,
        backgroundColor: BG_CARD,
        border: `1px solid ${BORDER}`,
      }}
    >
      {icon} {label}
    </span>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ padding: '28px 32px', borderBottom: `1px solid ${BORDER}` }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </motion.section>
  );
}

// ── BiographyHero ───────────────────────────────────────────────────────────

function BiographyHero({ person }: { person: PersonDetail }) {
  const primaryRole = person.roles[0] ?? 'Historical Figure';
  const nationality = person.nationalities[0] ?? null;

  return (
    <div
      style={{
        padding: '40px 32px 32px',
        borderBottom: `1px solid ${BORDER}`,
        background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${ACCENT}14 100%)`,
      }}
    >
      {/* Back links */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: TEXT_MUTED, textDecoration: 'none',
            padding: '6px 12px', borderRadius: 6,
            border: `1px solid ${BORDER}`, backgroundColor: BG_CARD,
          }}
        >
          \u2190 Timeline
        </Link>
        <Link
          to="/people"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: TEXT_MUTED, textDecoration: 'none',
            padding: '6px 12px', borderRadius: 6,
            border: `1px solid ${BORDER}`, backgroundColor: BG_CARD,
          }}
        >
          \u2190 People
        </Link>
      </div>

      {/* Role badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span
          style={{
            width: 44, height: 44, borderRadius: '50%',
            backgroundColor: `${ACCENT}22`, border: `2px solid ${ACCENT}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0, boxShadow: `0 0 20px ${ACCENT}33`,
          }}
        >
          \u{1F464}
        </span>
        <span
          style={{
            fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
            backgroundColor: ACCENT_BG, color: ACCENT,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          {primaryRole}
        </span>
      </div>

      {/* Name */}
      <h1
        style={{
          fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800,
          color: TEXT_PRIMARY, lineHeight: 1.2, marginBottom: 10,
        }}
      >
        {person.name}
      </h1>

      {/* Metadata row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Badge icon="\u{1F4C5}" label={lifeSpan(person)} />
        {nationality && <Badge icon="\u{1F30D}" label={nationality} color={ACCENT} />}
        {person.event_count > 0 && <Badge icon="\u{1F4DC}" label={`${person.event_count} events`} />}
      </div>

      {/* Description */}
      {person.description && (
        <p style={{ color: TEXT_SECONDARY, fontSize: 15, lineHeight: 1.65, maxWidth: 720, margin: 0 }}>
          {person.description}
        </p>
      )}

      {/* Contemporaries mini-row */}
      {person.contemporaries.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <span style={{ fontSize: 12, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Contemporaries
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {person.contemporaries.map((c) => (
              <Link
                key={c.id}
                to={`/people/${c.slug}`}
                style={{
                  textDecoration: 'none', padding: '5px 12px', borderRadius: 8,
                  backgroundColor: BG_CARD, border: `1px solid ${BORDER}`,
                  color: TEXT_SECONDARY, fontSize: 13, transition: 'border-color 0.15s',
                }}
              >
                {c.name} <span style={{ color: TEXT_MUTED, fontSize: 11 }}>({lifeSpan(c)})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── BiographyNarrative ──────────────────────────────────────────────────────

function BiographyNarrative({ person }: { person: PersonDetail }) {
  const bio = person.description ?? '';
  const isShort = bio.length < 200;
  const wikiUrl = person.wikipedia_slug
    ? `https://en.wikipedia.org/wiki/${person.wikipedia_slug}`
    : null;

  return (
    <Section title="Biography" icon="\u{1F4D6}">
      {bio && (
        <p style={{ color: TEXT_SECONDARY, fontSize: 15, lineHeight: 1.7, maxWidth: 720, margin: '0 0 16px' }}>
          {bio}
        </p>
      )}

      {isShort && person.associated_events.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <span style={{ color: TEXT_MUTED, fontSize: 13, fontWeight: 600 }}>Known for: </span>
          <span style={{ color: TEXT_SECONDARY, fontSize: 13 }}>
            {person.associated_events
              .sort((a, b) => (b.importance_score ?? 0) - (a.importance_score ?? 0))
              .slice(0, 3)
              .map((e) => e.title)
              .join(', ')}
          </span>
        </div>
      )}

      {wikiUrl && (
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: '#60a5fa', textDecoration: 'none',
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid rgba(96,165,250,0.25)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          \u{1F310} Read on Wikipedia
        </a>
      )}
    </Section>
  );
}

// ── AssociatedEventsTimeline ─────────────────────────────────────────────────

function AssociatedEventsTimeline({ events }: { events: PersonEvent[] }) {
  if (events.length === 0) return null;

  // Group by era if >10 events
  const shouldGroup = events.length > 10;
  type Group = { label: string; events: PersonEvent[] };
  let groups: Group[];

  if (shouldGroup) {
    const eraMap = new Map<string, PersonEvent[]>();
    for (const ev of events) {
      const era = eraLabel(ev.year_approx);
      const list = eraMap.get(era) ?? [];
      list.push(ev);
      eraMap.set(era, list);
    }
    groups = Array.from(eraMap.entries()).map(([label, evts]) => ({ label, events: evts }));
  } else {
    groups = [{ label: '', events }];
  }

  return (
    <Section title="Associated Events" icon="\u{1F4C5}">
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: group.label ? 20 : 0 }}>
          {group.label && (
            <h3 style={{ fontSize: 14, fontWeight: 700, color: TEXT_MUTED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {group.label}
            </h3>
          )}
          <div style={{ position: 'relative', paddingLeft: 28 }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute', left: 8, top: 4, bottom: 4,
                width: 2, backgroundColor: BORDER, borderRadius: 1,
              }}
            />
            {group.events.map((ev, i) => {
              const color = catColor(ev.category);
              const icon = catIcon(ev.category);
              const yearStr = formatYear(ev.year_approx, ev.is_bce);

              return (
                <motion.div
                  key={ev.id + ev.role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  style={{
                    position: 'relative', marginBottom: 14,
                    padding: '10px 14px', borderRadius: 8,
                    backgroundColor: BG_CARD, border: `1px solid ${BORDER}`,
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    style={{
                      position: 'absolute', left: -24, top: 14,
                      width: 10, height: 10, borderRadius: '50%',
                      backgroundColor: color, border: `2px solid ${BG}`,
                      boxShadow: `0 0 6px ${color}66`,
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 700, minWidth: 64 }}>
                      {yearStr}
                    </span>
                    <Link
                      to={`/?event=${ev.slug}`}
                      style={{ color: TEXT_PRIMARY, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                    >
                      {ev.title}
                    </Link>
                    <span style={{ fontSize: 12 }}>{icon}</span>
                    {/* Importance stars */}
                    <span style={{ color: '#eab308', fontSize: 11 }}>
                      {'\u2605'.repeat(Math.round((ev.importance_score ?? 0.5) * 5))}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color, padding: '2px 6px', borderRadius: 4, backgroundColor: `${color}18` }}>
                      {ev.role}
                    </span>
                    {ev.geo_modern && (
                      <span style={{ fontSize: 11, color: TEXT_MUTED }}>{ev.geo_modern}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </Section>
  );
}

// ── InfluenceScore ──────────────────────────────────────────────────────────

function InfluenceScore({ person }: { person: PersonDetail }) {
  const pct = Math.round(person.influence_score * 100);
  const percentileColor = person.influence_percentile >= 75 ? '#22c55e'
    : person.influence_percentile >= 50 ? '#f59e0b' : '#94a3b8';

  return (
    <Section title="Influence Score" icon="\u{2B50}">
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Score display */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: ACCENT }}>{pct}</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>/ 100</div>
          <div
            style={{
              marginTop: 8, padding: '4px 12px', borderRadius: 12,
              backgroundColor: `${percentileColor}18`, color: percentileColor,
              fontSize: 13, fontWeight: 600,
            }}
          >
            More influential than {person.influence_percentile}% of people
          </div>
        </div>

        {/* Mini bar */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ width: '100%', height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 6 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              style={{ height: '100%', borderRadius: 4, backgroundColor: ACCENT }}
            />
          </div>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>
            Based on average importance of {person.event_count} linked event{person.event_count !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {person.leaderboard.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontSize: 13, color: TEXT_MUTED, fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Compared to contemporaries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {person.leaderboard.map((c, i) => {
              const isThis = c.id === person.id;
              const score = Math.round(c.influence_score * 100);
              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 12px', borderRadius: 6,
                    backgroundColor: isThis ? ACCENT_BG : BG_CARD,
                    border: `1px solid ${isThis ? `${ACCENT}44` : BORDER}`,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_MUTED, width: 20 }}>
                    {i + 1}.
                  </span>
                  <Link
                    to={`/people/${c.slug}`}
                    style={{ flex: 1, color: isThis ? ACCENT : TEXT_PRIMARY, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
                  >
                    {c.name}
                  </Link>
                  <span style={{ fontSize: 13, color: TEXT_SECONDARY }}>{score}/100</span>
                  <div style={{ width: 60, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ width: `${score}%`, height: '100%', borderRadius: 2, backgroundColor: isThis ? ACCENT : TEXT_MUTED }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Section>
  );
}

// ── RelatedPeople ───────────────────────────────────────────────────────────

function RelatedPeople({ people }: { people: (PersonSummary & { shared_event_count: number })[] }) {
  if (people.length === 0) return null;

  return (
    <Section title="Related People" icon="\u{1F465}">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {people.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
          >
            <Link
              to={`/people/${p.slug}`}
              style={{
                display: 'block', textDecoration: 'none',
                padding: '14px 16px', borderRadius: 10,
                backgroundColor: BG_CARD, border: `1px solid ${BORDER}`,
                transition: 'border-color 0.15s, transform 0.15s',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 4 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>
                {lifeSpan(p)}
              </div>
              {p.roles[0] && (
                <span
                  style={{
                    display: 'inline-block', fontSize: 10, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 4,
                    backgroundColor: ACCENT_BG, color: ACCENT,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    marginBottom: 6,
                  }}
                >
                  {p.roles[0]}
                </span>
              )}
              <div style={{ fontSize: 11, color: TEXT_SECONDARY }}>
                {p.shared_event_count} shared event{p.shared_event_count !== 1 ? 's' : ''}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PersonDetailPage — renders the full biography for a historical figure.
 * Fetches data from GET /api/people/:slug.
 */
export default function PersonDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: person, isLoading, isError, error } = useQuery({
    queryKey: ['person', slug],
    queryFn: () => fetchPersonDetail(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: BG,
        color: TEXT_PRIMARY,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Loading state */}
      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 16, color: TEXT_MUTED }}
          >
            Loading biography...
          </motion.div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', fontSize: 20, marginBottom: 12 }}>Person not found</h2>
          <p style={{ color: TEXT_MUTED, fontSize: 14 }}>
            {(error as Error)?.message ?? 'Could not load this person.'}
          </p>
          <Link to="/people" style={{ color: '#60a5fa', fontSize: 14 }}>
            \u2190 Back to People directory
          </Link>
        </div>
      )}

      {/* Content */}
      {person && (
        <>
          <BiographyHero person={person} />
          <BiographyNarrative person={person} />
          <AssociatedEventsTimeline events={person.associated_events} />
          <InfluenceScore person={person} />
          <RelatedPeople people={person.related_people} />
        </>
      )}
    </div>
  );
}
