/**
 * OnThisDayPage — "/on-this-day" route.
 *
 * Full-page browser for historical events that occurred on a given calendar
 * date across all years. Auto-detects today's date, allows date picking via
 * sidebar dropdowns, and groups results by century.
 *
 * Owns: page layout, date state, data fetching, century grouping.
 * Does NOT own: individual event rendering (EventCard), date selection UI
 * (DatePickerSidebar), or century headers (CenturySection).
 */

import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchOnThisDay } from '../api/client';
import type { OnThisDayEvent } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants (matches Chronicle dark aesthetic)
// ─────────────────────────────────────────────────────────────────────────────

const BG = '#0f172a';
const SURFACE = '#1e293b';
const SURFACE_HOVER = '#334155';
const TEXT = '#f8fafc';
const TEXT_MUTED = '#94a3b8';
const TEXT_DIM = '#64748b';
const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#818cf8';
const BORDER = '#334155';
const CARD_BG = '#1e293b';

/** Month names for display. */
const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** Days per month (non-leap). */
const DAYS_IN_MONTH = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the English ordinal suffix for a day number (1st, 2nd, 3rd, 4th…).
 */
function ordinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Determine the century label for a given year.
 * Handles BCE years with proper labeling.
 */
function getCenturyLabel(year: number, isBce: boolean): string {
  if (isBce) {
    const century = Math.ceil(Math.abs(year) / 100);
    return `${century}${ordinalSuffix(century)} Century BCE`;
  }
  const century = Math.ceil(year / 100);
  const labels: Record<number, string> = {
    21: '21st Century',
    20: '20th Century',
    19: '19th Century',
    18: '18th Century',
    17: '17th Century',
    16: '16th Century',
    15: '15th Century',
  };
  return labels[century] || `${century}${ordinalSuffix(century)} Century`;
}

/**
 * Get a sort key for century grouping — higher = more recent.
 */
function getCenturySortKey(year: number, isBce: boolean): number {
  if (isBce) return -Math.ceil(Math.abs(year) / 100);
  return Math.ceil(year / 100);
}

/**
 * Group events by century, sorted most recent first.
 */
function groupByCentury(events: OnThisDayEvent[]): { label: string; events: OnThisDayEvent[] }[] {
  const groups = new Map<string, { sortKey: number; events: OnThisDayEvent[] }>();

  for (const event of events) {
    if (event.year_approx == null) continue;
    const label = getCenturyLabel(event.year_approx, event.is_bce);
    const sortKey = getCenturySortKey(event.year_approx, event.is_bce);
    if (!groups.has(label)) {
      groups.set(label, { sortKey, events: [] });
    }
    groups.get(label)!.events.push(event);
  }

  // Sort events within each century by year (most recent first for CE, oldest first for BCE)
  for (const group of groups.values()) {
    group.events.sort((a, b) => (b.year_approx ?? 0) - (a.year_approx ?? 0));
  }

  return Array.from(groups.entries())
    .map(([label, { sortKey, events }]) => ({ label, sortKey, events }))
    .sort((a, b) => b.sortKey - a.sortKey)
    .map(({ label, events }) => ({ label, events }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EventCard — displays a single historical event with year, title,
 * category badge, and region tag.
 */
function EventCard({ event }: { event: OnThisDayEvent }) {
  const yearDisplay = event.is_bce
    ? `${Math.abs(event.year_approx ?? 0)} BCE`
    : String(event.year_approx ?? '?');

  const categoryColor = CATEGORY_COLORS[event.category as EventCategory] ?? '#64748b';
  const categoryIcon = CATEGORY_ICONS[event.category as EventCategory] ?? '📌';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.15s',
      }}
      whileHover={{
        borderColor: ACCENT,
        scale: 1.01,
      }}
    >
      <Link
        to={`/event/${event.slug}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          {/* Year badge */}
          <span style={{
            background: ACCENT,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 6,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.5px',
          }}>
            {yearDisplay}
          </span>

          {/* Category badge */}
          {event.category && (
            <span style={{
              background: `${categoryColor}22`,
              color: categoryColor,
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {categoryIcon} {event.category}
            </span>
          )}

          {/* Region tag */}
          {event.region && (
            <span style={{
              color: TEXT_DIM,
              fontSize: 11,
              marginLeft: 'auto',
            }}>
              🌍 {event.region}
            </span>
          )}
        </div>

        <h3 style={{
          color: TEXT,
          fontSize: 16,
          fontWeight: 600,
          margin: 0,
          lineHeight: 1.4,
        }}>
          {event.title}
        </h3>

        {event.short_description && (
          <p style={{
            color: TEXT_MUTED,
            fontSize: 13,
            margin: '6px 0 0',
            lineHeight: 1.5,
          }}>
            {event.short_description}
          </p>
        )}
      </Link>
    </motion.div>
  );
}

/**
 * CenturySection — renders a group of events under a century header.
 */
function CenturySection({ label, events }: { label: string; events: OnThisDayEvent[] }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}>
        <div style={{
          width: 4,
          height: 24,
          background: ACCENT,
          borderRadius: 2,
        }} />
        <h2 style={{
          color: TEXT,
          fontSize: 18,
          fontWeight: 700,
          margin: 0,
          letterSpacing: '0.3px',
        }}>
          {label}
        </h2>
        <span style={{
          color: TEXT_DIM,
          fontSize: 12,
          fontWeight: 500,
        }}>
          ({events.length} event{events.length !== 1 ? 's' : ''})
        </span>
      </div>

      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

/**
 * DatePickerSidebar — month and day dropdowns for exploring dates,
 * plus a "Random Date" button.
 */
function DatePickerSidebar({
  month,
  day,
  onDateChange,
  onRandomDate,
}: {
  month: number;
  day: number;
  onDateChange: (month: number, day: number) => void;
  onRandomDate: () => void;
}) {
  const maxDays = DAYS_IN_MONTH[month] ?? 31;

  return (
    <div style={{
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: 20,
      minWidth: 200,
    }}>
      <h3 style={{ color: TEXT, fontSize: 14, fontWeight: 600, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Pick a Date
      </h3>

      {/* Month dropdown */}
      <label style={{ color: TEXT_MUTED, fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>
        Month
      </label>
      <select
        value={month}
        onChange={(e) => {
          const newMonth = Number(e.target.value);
          const newMaxDays = DAYS_IN_MONTH[newMonth] ?? 31;
          onDateChange(newMonth, Math.min(day, newMaxDays));
        }}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: BG,
          color: TEXT,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          fontSize: 14,
          marginBottom: 12,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{MONTH_NAMES[m]}</option>
        ))}
      </select>

      {/* Day dropdown */}
      <label style={{ color: TEXT_MUTED, fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>
        Day
      </label>
      <select
        value={day}
        onChange={(e) => onDateChange(month, Number(e.target.value))}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: BG,
          color: TEXT,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          fontSize: 14,
          marginBottom: 16,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Today button */}
      <button
        onClick={() => {
          const now = new Date();
          onDateChange(now.getMonth() + 1, now.getDate());
        }}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: 'transparent',
          color: ACCENT_LIGHT,
          border: `1px solid ${ACCENT}`,
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 8,
          transition: 'background 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = `${ACCENT}22`)}
        onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        📅 Today
      </button>

      {/* Random date button */}
      <button
        onClick={onRandomDate}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: ACCENT,
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        🎲 Random Date
      </button>
    </div>
  );
}

/**
 * Loading skeleton shown while events are being fetched.
 */
function LoadingSkeleton() {
  return (
    <div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: SURFACE,
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 12,
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 60, height: 22, background: BORDER, borderRadius: 6 }} />
            <div style={{ width: 80, height: 22, background: BORDER, borderRadius: 4 }} />
          </div>
          <div style={{ width: '70%', height: 18, background: BORDER, borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: '50%', height: 14, background: BORDER, borderRadius: 4 }} />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

/**
 * StatsBar — summary of results: event count, year span, region count.
 */
function StatsBar({ totalCount, earliestYear, latestYear, regionCount }: {
  totalCount: number;
  earliestYear: number | null;
  latestYear: number | null;
  regionCount: number;
}) {
  const yearSpan = earliestYear != null && latestYear != null
    ? Math.abs(latestYear - earliestYear)
    : 0;

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      padding: '12px 20px',
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      borderRadius: 10,
      marginBottom: 24,
      flexWrap: 'wrap',
    }}>
      <StatItem icon="📜" value={totalCount} label="events found" />
      {yearSpan > 0 && <StatItem icon="⏳" value={yearSpan} label="years spanned" />}
      {regionCount > 0 && <StatItem icon="🌍" value={regionCount} label="regions" />}
    </div>
  );
}

/** A single stat display. */
function StatItem({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: ACCENT_LIGHT, fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
        {value.toLocaleString()}
      </span>
      <span style={{ color: TEXT_MUTED, fontSize: 13 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * OnThisDayPage — full-page "On This Day in History" browser.
 *
 * @returns React element for the /on-this-day route.
 */
export default function OnThisDayPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [day, setDay] = useState(now.getDate());

  const { data, isLoading, isError } = useQuery({
    queryKey: ['on-this-day', month, day],
    queryFn: () => fetchOnThisDay(month, day),
    staleTime: 5 * 60 * 1000,
  });

  const centuryGroups = useMemo(
    () => (data?.events ? groupByCentury(data.events) : []),
    [data?.events],
  );

  const handleDateChange = useCallback((m: number, d: number) => {
    setMonth(m);
    setDay(d);
  }, []);

  const handleRandomDate = useCallback(() => {
    const randMonth = Math.floor(Math.random() * 12) + 1;
    const maxDay = DAYS_IN_MONTH[randMonth] ?? 28;
    const randDay = Math.floor(Math.random() * maxDay) + 1;
    setMonth(randMonth);
    setDay(randDay);
  }, []);

  const dateHeadline = `${MONTH_NAMES[month]} ${day}${ordinalSuffix(day)} — throughout history`;

  return (
    <div style={{
      minHeight: '100vh',
      background: BG,
      color: TEXT,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <Link to="/" style={{ color: TEXT_MUTED, textDecoration: 'none', fontSize: 13, display: 'block', marginBottom: 4 }}>
            ← Chronicle
          </Link>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
            📅 On This Day in History
          </h1>
        </div>
      </header>

      {/* Date headline */}
      <div style={{
        textAlign: 'center',
        padding: '32px 20px 8px',
      }}>
        <motion.h2
          key={`${month}-${day}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: ACCENT_LIGHT,
            margin: 0,
          }}
        >
          {dateHeadline}
        </motion.h2>
      </div>

      {/* Layout: sidebar + main content */}
      <div style={{
        display: 'flex',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 32px 64px',
        gap: 32,
        alignItems: 'flex-start',
      }}>
        {/* Sidebar */}
        <aside style={{
          position: 'sticky',
          top: 24,
          flexShrink: 0,
        }}
          className="on-this-day-sidebar"
        >
          <DatePickerSidebar
            month={month}
            day={day}
            onDateChange={handleDateChange}
            onRandomDate={handleRandomDate}
          />
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Stats bar */}
          {data && data.total_count > 0 && (
            <StatsBar
              totalCount={data.total_count}
              earliestYear={data.earliest_year}
              latestYear={data.latest_year}
              regionCount={data.regions.length}
            />
          )}

          {/* Loading state */}
          {isLoading && <LoadingSkeleton />}

          {/* Error state */}
          {isError && (
            <div style={{
              textAlign: 'center',
              padding: 48,
              color: TEXT_MUTED,
            }}>
              <p style={{ fontSize: 18 }}>⚠️ Failed to load events. Please try again.</p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && data && data.events.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 64,
              color: TEXT_MUTED,
            }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>📭</p>
              <p style={{ fontSize: 18, fontWeight: 600 }}>No recorded events for this date</p>
              <p style={{ fontSize: 14 }}>Try a nearby date or hit the 🎲 Random Date button</p>
            </div>
          )}

          {/* Century-grouped events */}
          {!isLoading && !isError && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${month}-${day}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {centuryGroups.map((group) => (
                  <CenturySection key={group.label} label={group.label} events={group.events} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .on-this-day-sidebar {
            position: static !important;
            width: 100% !important;
          }
        }
        @media (max-width: 768px) {
          /* Stack layout vertically on mobile */
          div[style*="display: flex"][style*="maxWidth: 1200"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
