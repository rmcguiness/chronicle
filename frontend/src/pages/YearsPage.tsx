/**
 * YearsPage — browse any year in history.
 *
 * Route: /years  (optional query: /years?y=1945)
 *
 * Sections:
 *  - Default: NotableYears gallery (grid of ~50 iconic years)
 *  - Selected: YearHeader → TopEventCard → WorldMapView (by region) → YearTimeline → ContemporaryContext
 *
 * Uses inline styles matching the dark Chronicle theme (no Tailwind).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import {
  fetchYearEvents,
  fetchNotableYears,
} from '../api/client';
import type { YearEvent, NotableYearItem } from '../api/client';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Era quick-jump presets for the year selector. */
const ERA_PRESETS: { label: string; year: number }[] = [
  { label: 'Ancient', year: -3000 },
  { label: '500 BCE', year: -500 },
  { label: '500 CE', year: 500 },
  { label: '1000', year: 1000 },
  { label: '1500', year: 1500 },
  { label: '1800', year: 1800 },
  { label: '1900', year: 1900 },
  { label: '2000', year: 2000 },
];

/** Map a year to an era name. */
function eraLabel(year: number): string {
  if (year < -3000) return 'Prehistoric';
  if (year < -800) return 'Ancient Near East';
  if (year < -500) return 'Archaic Period';
  if (year < 476) return 'Classical Antiquity';
  if (year < 1000) return 'Early Medieval';
  if (year < 1300) return 'High Medieval';
  if (year < 1500) return 'Late Medieval';
  if (year < 1650) return 'Renaissance';
  if (year < 1800) return 'Early Modern';
  if (year < 1900) return 'Industrial Age';
  if (year < 1945) return 'Modern Era';
  if (year < 2000) return 'Cold War Era';
  return 'Contemporary';
}

/** Era section header for notable years gallery. */
function eraBucket(year: number): string {
  if (year < -500) return 'Ancient';
  if (year < 500) return 'Classical';
  if (year < 1500) return 'Medieval';
  if (year < 1800) return 'Early Modern';
  if (year < 1950) return 'Modern';
  return 'Contemporary';
}

/** Format a year for display (handles BCE). */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Region emoji map. */
const REGION_EMOJI: Record<string, string> = {
  Europe: '\uD83C\uDF0D',
  Asia: '\uD83C\uDF0F',
  Americas: '\uD83C\uDF0E',
  Africa: '\uD83C\uDF0D',
  'Middle East': '\uD83D\uDD4C',
  Oceania: '\uD83C\uDF0A',
  Global: '\uD83C\uDF10',
};

// ─────────────────────────────────────────────────────────────────────────────
// Page shell (reused from EventDetailPage pattern)
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav bar
// ─────────────────────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link
        to="/"
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#f1f5f9',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        Chronicle
      </Link>
      <Link
        to="/"
        style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
      >
        Timeline
      </Link>
      <Link
        to="/years"
        style={{ fontSize: 13, color: '#60a5fa', textDecoration: 'none', fontWeight: 600 }}
      >
        Years
      </Link>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YearSelector — input + slider + era quick-jumps
// ─────────────────────────────────────────────────────────────────────────────

interface YearSelectorProps {
  onSelectYear: (year: number) => void;
  currentYear: number | null;
}

function YearSelector({ onSelectYear, currentYear }: YearSelectorProps) {
  const [input, setInput] = useState(currentYear != null ? String(currentYear) : '');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input when external year changes (e.g. from notable card click)
  useEffect(() => {
    if (currentYear != null) {
      setInput(String(currentYear));
    }
  }, [currentYear]);

  const handleSubmit = () => {
    const trimmed = input.trim().toUpperCase();
    let year: number;
    if (trimmed.endsWith('BCE') || trimmed.endsWith('BC')) {
      const num = parseInt(trimmed.replace(/\s*(BCE|BC)\s*$/i, ''), 10);
      year = isNaN(num) ? 0 : -num;
    } else if (trimmed.endsWith('CE') || trimmed.endsWith('AD')) {
      year = parseInt(trimmed.replace(/\s*(CE|AD)\s*$/i, ''), 10);
    } else {
      year = parseInt(trimmed, 10);
    }
    if (!isNaN(year)) {
      onSelectYear(year);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{ padding: '32px 32px 24px' }}>
      <h1
        style={{
          fontSize: 'clamp(20px, 3vw, 28px)',
          fontWeight: 800,
          color: '#f1f5f9',
          marginBottom: 6,
        }}
      >
        Notable Years
      </h1>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.5 }}>
        Pick any year in history and see everything that happened — spanning all regions and categories.
      </p>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 1776, 44 BCE, -3100"
          style={{
            flex: '1 1 200px',
            minWidth: 160,
            padding: '12px 16px',
            fontSize: 18,
            fontWeight: 700,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '2px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            color: '#f1f5f9',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '12px 28px',
            fontSize: 15,
            fontWeight: 700,
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3b82f6'; }}
        >
          Go
        </button>
      </div>

      {/* Slider */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="range"
          min={-3500}
          max={2025}
          step={1}
          value={currentYear ?? 0}
          onChange={(e) => {
            const y = parseInt(e.target.value, 10);
            setInput(String(y));
            onSelectYear(y);
          }}
          style={{
            width: '100%',
            accentColor: '#3b82f6',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 10,
            color: '#475569',
            marginTop: 2,
          }}
        >
          <span>3500 BCE</span>
          <span>0 CE</span>
          <span>2025 CE</span>
        </div>
      </div>

      {/* Era quick-jumps */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {ERA_PRESETS.map((preset) => (
          <button
            key={preset.year}
            onClick={() => onSelectYear(preset.year)}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              backgroundColor:
                currentYear === preset.year
                  ? 'rgba(59,130,246,0.2)'
                  : 'rgba(255,255,255,0.05)',
              border: `1px solid ${
                currentYear === preset.year
                  ? 'rgba(59,130,246,0.5)'
                  : 'rgba(255,255,255,0.1)'
              }`,
              borderRadius: 6,
              color: currentYear === preset.year ? '#60a5fa' : '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YearHeader
// ─────────────────────────────────────────────────────────────────────────────

interface YearHeaderProps {
  year: number;
  totalEvents: number;
  regions: string[];
  categories: string[];
}

function YearHeader({ year, totalEvents, regions, categories }: YearHeaderProps) {
  return (
    <div
      style={{
        padding: '24px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(59,130,246,0.05) 100%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8, flexWrap: 'wrap' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            color: '#f1f5f9',
            fontFamily: 'monospace',
            letterSpacing: '-0.03em',
            margin: 0,
          }}
        >
          {formatYear(year)}
        </h2>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 6,
            backgroundColor: 'rgba(59,130,246,0.15)',
            color: '#60a5fa',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {eraLabel(year)}
        </span>
      </div>
      <p style={{ fontSize: 14, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
        {totalEvents} recorded event{totalEvents !== 1 ? 's' : ''} in {formatYear(year)} ±2 years
      </p>
      {totalEvents > 0 && (
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
          What else was happening in the world?
        </p>
      )}
      {/* Region + category pills */}
      {(regions.length > 0 || categories.length > 0) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {regions.map((r) => (
            <span
              key={r}
              style={{
                fontSize: 11,
                padding: '3px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8',
              }}
            >
              {REGION_EMOJI[r] || '\uD83C\uDF10'} {r}
            </span>
          ))}
          {categories.map((c) => {
            const catColor = CATEGORY_COLORS[c as EventCategory] ?? '#6b7280';
            return (
              <span
                key={c}
                style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  borderRadius: 6,
                  backgroundColor: `${catColor}18`,
                  border: `1px solid ${catColor}44`,
                  color: catColor,
                }}
              >
                {CATEGORY_ICONS[c as EventCategory] ?? ''} {CATEGORY_LABELS[c as EventCategory] ?? c}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TopEventCard — hero card for the most important event
// ─────────────────────────────────────────────────────────────────────────────

function TopEventCard({ event }: { event: YearEvent }) {
  const catKey = (event.category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const icon = CATEGORY_ICONS[catKey] ?? '\uD83D\uDCCC';
  const catLabel = CATEGORY_LABELS[catKey] ?? event.category ?? '';
  const stars = Math.round(event.importance_score * 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        margin: '0 32px',
        padding: 24,
        borderRadius: 14,
        backgroundColor: `${color}0a`,
        border: `2px solid ${color}33`,
        boxShadow: `0 4px 24px ${color}18`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Most Important Event
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: `${color}22`,
            border: `2px solid ${color}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 6px', lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              {event.geo_modern || event.geo_era_label || 'Unknown location'}
            </span>
            <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, backgroundColor: `${color}22`, color }}>
              {catLabel}
            </span>
            <span style={{ fontSize: 13, color: '#f59e0b', letterSpacing: 1 }}>
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            </span>
          </div>
          <Link
            to={`/event/${event.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
              transition: 'background 0.15s',
            }}
          >
            Explore this event →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WorldMapView — events grouped by region
// ─────────────────────────────────────────────────────────────────────────────

/** Classify an event into a display region. */
function classifyEventRegion(event: YearEvent): string {
  const text = `${event.geo_modern ?? ''} ${event.geo_era_label ?? ''}`.toLowerCase();
  if (!text.trim()) return 'Global';
  if (/europe|france|germany|britain|england|spain|italy|rome|greece|russia|poland|austria|hungary|netherlands|sweden|norway|denmark|portugal|switzerland|belgium|ireland|scotland|byzantine/.test(text)) return 'Europe';
  if (/china|japan|india|korea|vietnam|mongol|tibet|burma|myanmar|thai|indonesia|malaysia|philippines|cambodia|bengal|mughal|tang|ming|qing|tokugawa|meiji/.test(text)) return 'Asia';
  if (/america|usa|united states|canada|mexico|brazil|argentina|peru|chile|colombia|cuba|caribbean|inca|aztec|maya/.test(text)) return 'Americas';
  if (/africa|egypt|ethiopia|mali|ghana|nigeria|congo|kenya|south africa|morocco|algeria|tunisia|nubia|zimbabwe|songhai/.test(text)) return 'Africa';
  if (/middle east|iraq|iran|persia|syria|arabia|saudi|israel|palestine|mesopotamia|babylon|assyria|jerusalem|mecca|medina|turkey|afghanistan|pakistan/.test(text)) return 'Middle East';
  if (/oceania|australia|new zealand|pacific|polynesia|melanesia|hawaii|fiji|samoa|tonga/.test(text)) return 'Oceania';
  return 'Global';
}

const REGION_ORDER = ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Oceania', 'Global'];

function WorldMapView({ events, year }: { events: YearEvent[]; year: number }) {
  const grouped = useMemo(() => {
    const map = new Map<string, YearEvent[]>();
    for (const r of REGION_ORDER) map.set(r, []);
    for (const ev of events) {
      const region = classifyEventRegion(ev);
      const arr = map.get(region) || [];
      arr.push(ev);
      map.set(region, arr);
    }
    return map;
  }, [events]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const toggle = (region: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  };

  return (
    <div style={{ padding: '20px 32px' }}>
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 16,
        }}
      >
        Events by Region
      </h3>
      {REGION_ORDER.map((region) => {
        const regionEvents = grouped.get(region) || [];
        const isEmpty = regionEvents.length === 0;
        const isCollapsed = collapsed.has(region);

        return (
          <div
            key={region}
            style={{
              marginBottom: 8,
              borderRadius: 10,
              border: `1px solid ${isEmpty ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
              backgroundColor: isEmpty ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
              overflow: 'hidden',
            }}
          >
            {/* Region header */}
            <button
              onClick={() => !isEmpty && toggle(region)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: isEmpty ? 'default' : 'pointer',
                color: isEmpty ? '#334155' : '#e2e8f0',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'Inter', system-ui, sans-serif",
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{REGION_EMOJI[region] || '\uD83C\uDF10'}</span>
              <span>{region}</span>
              {!isEmpty && (
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 400 }}>
                  ({regionEvents.length} event{regionEvents.length !== 1 ? 's' : ''})
                </span>
              )}
              {isEmpty && (
                <span style={{ fontSize: 12, color: '#334155', fontStyle: 'italic', fontWeight: 400 }}>
                  No recorded events in this region for {formatYear(year)}
                </span>
              )}
              {!isEmpty && (
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#475569' }}>
                  {isCollapsed ? '▶' : '▼'}
                </span>
              )}
            </button>

            {/* Events list */}
            {!isEmpty && !isCollapsed && (
              <div style={{ padding: '0 16px 12px' }}>
                {regionEvents.map((ev) => (
                  <EventRow key={ev.id} event={ev} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EventRow — compact event in the timeline / region list
// ─────────────────────────────────────────────────────────────────────────────

function EventRow({ event }: { event: YearEvent }) {
  const catKey = (event.category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const icon = CATEGORY_ICONS[catKey] ?? '';
  const stars = Math.round(event.importance_score * 5);

  return (
    <Link
      to={`/event/${event.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '10px 12px',
          borderRadius: 8,
          borderLeft: `3px solid ${color}`,
          backgroundColor: 'rgba(255,255,255,0.02)',
          marginBottom: 6,
          cursor: 'pointer',
          transition: 'background 0.12s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
      >
        <span style={{ fontSize: 14 }}>{icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.3 }}>
            {event.title}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {event.geo_modern || event.geo_era_label || ''}
            {event.year_approx != null && event.year_approx !== 0 && (
              <span style={{ marginLeft: 8, color: '#475569' }}>
                {formatYear(event.year_approx)}
              </span>
            )}
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#f59e0b', letterSpacing: 1, flexShrink: 0 }}>
          {'★'.repeat(stars)}
        </span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContemporaryContext sidebar — events from nearby years
// ─────────────────────────────────────────────────────────────────────────────

function ContemporaryContext({ year }: { year: number }) {
  const before = year - 10;
  const after = year + 10;

  const { data: dataBefore } = useQuery({
    queryKey: ['year-events', before],
    queryFn: () => fetchYearEvents(before),
    staleTime: 5 * 60 * 1000,
  });
  const { data: dataAfter } = useQuery({
    queryKey: ['year-events', after],
    queryFn: () => fetchYearEvents(after),
    staleTime: 5 * 60 * 1000,
  });

  const topBefore = dataBefore?.most_important_event;
  const topAfter = dataAfter?.most_important_event;

  if (!topBefore && !topAfter) return null;

  return (
    <div
      style={{
        margin: '0 32px 24px',
        padding: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 14,
        }}
      >
        Other Years Nearby
      </h3>

      {topBefore && (
        <ContextRow label={`10 years earlier (${formatYear(before)})`} event={topBefore} />
      )}
      {topAfter && (
        <ContextRow label={`10 years later (${formatYear(after)})`} event={topAfter} />
      )}
    </div>
  );
}

function ContextRow({ label, event }: { label: string; event: YearEvent }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <Link
        to={`/event/${event.slug}`}
        style={{
          fontSize: 13,
          color: '#60a5fa',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        {event.title}
      </Link>
      <span style={{ fontSize: 12, color: '#475569', marginLeft: 8 }}>
        {event.geo_modern || event.geo_era_label || ''}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotableYears Gallery — default view
// ─────────────────────────────────────────────────────────────────────────────

function NotableYearsGallery({ onSelectYear }: { onSelectYear: (year: number) => void }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notable-years'],
    queryFn: fetchNotableYears,
    staleTime: 10 * 60 * 1000,
  });

  const handleSurprise = () => {
    if (!data?.years.length) return;
    const random = data.years[Math.floor(Math.random() * data.years.length)];
    onSelectYear(random.year);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center', color: '#64748b' }}>
        Loading notable years...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center', color: '#64748b' }}>
        Could not load notable years. Try entering a year above.
      </div>
    );
  }

  // Group by era bucket
  const buckets = new Map<string, NotableYearItem[]>();
  for (const y of data.years) {
    const bucket = eraBucket(y.year);
    if (!buckets.has(bucket)) buckets.set(bucket, []);
    buckets.get(bucket)!.push(y);
  }

  return (
    <div style={{ padding: '0 32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Notable Years in History
        </h3>
        <button
          onClick={handleSurprise}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            backgroundColor: 'rgba(249,115,22,0.12)',
            border: '1px solid rgba(249,115,22,0.3)',
            borderRadius: 6,
            color: '#f97316',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(249,115,22,0.12)'; }}
        >
          Surprise me
        </button>
      </div>

      {Array.from(buckets.entries()).map(([bucket, years]) => (
        <div key={bucket} style={{ marginBottom: 24 }}>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 10,
              paddingBottom: 6,
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {bucket}
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 10,
            }}
          >
            {years.map((y, i) => (
              <NotableYearCard key={y.year} item={y} index={i} onClick={() => onSelectYear(y.year)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NotableYearCard({
  item,
  index,
  onClick,
}: {
  item: NotableYearItem;
  index: number;
  onClick: () => void;
}) {
  const catColor = CATEGORY_COLORS[(item.top_event_category ?? 'political') as EventCategory] ?? '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        cursor: 'pointer',
        transition: 'background 0.12s, border-color 0.12s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.07)';
        (e.currentTarget as HTMLDivElement).style.borderColor = `${catColor}44`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,255,255,0.03)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'monospace',
          color: '#f1f5f9',
          marginBottom: 4,
          letterSpacing: '-0.02em',
        }}
      >
        {formatYear(item.year)}
      </div>
      <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4, marginBottom: 6 }}>
        {item.top_event_title || 'Notable events'}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: 'rgba(59,130,246,0.12)',
            color: '#60a5fa',
          }}
        >
          {eraLabel(item.year).split(' ')[0]}
        </span>
        {item.event_count > 0 && (
          <span style={{ fontSize: 10, color: '#475569' }}>
            {item.event_count} event{item.event_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading spinner
// ─────────────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 0',
        gap: 16,
        color: '#64748b',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '3px solid rgba(255,255,255,0.08)',
          borderTopColor: '#3b82f6',
        }}
      />
      <span style={{ fontSize: 14 }}>Loading year data...</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YearView — rendered once a year is selected
// ─────────────────────────────────────────────────────────────────────────────

function YearView({ year }: { year: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['year-events', year],
    queryFn: () => fetchYearEvents(year),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Spinner />;

  if (isError || !data) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center', color: '#64748b' }}>
        Could not load events for {formatYear(year)}.
      </div>
    );
  }

  return (
    <>
      <YearHeader
        year={year}
        totalEvents={data.total_events}
        regions={data.regions}
        categories={data.categories}
      />

      {data.most_important_event && (
        <div style={{ paddingTop: 24 }}>
          <TopEventCard event={data.most_important_event} />
        </div>
      )}

      {data.events.length > 0 && (
        <WorldMapView events={data.events} year={year} />
      )}

      {data.events.length === 0 && (
        <div
          style={{
            padding: '40px 32px',
            textAlign: 'center',
            color: '#475569',
            fontSize: 14,
            fontStyle: 'italic',
          }}
        >
          No events recorded for {formatYear(year)}. Try a nearby year!
        </div>
      )}

      <ContemporaryContext year={year} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * YearsPage — main page component for /years.
 *
 * Shows a year selector, and either:
 *  - NotableYears gallery (default, no year selected)
 *  - Full year view (events, regions, top event card, context)
 */
export default function YearsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const yearParam = searchParams.get('y');
  const selectedYear = yearParam != null ? parseInt(yearParam, 10) : null;
  const validYear = selectedYear != null && !isNaN(selectedYear) ? selectedYear : null;

  // Allow this page to scroll
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  const handleSelectYear = (year: number) => {
    setSearchParams({ y: String(year) });
  };

  return (
    <PageShell>
      <NavBar />
      <YearSelector onSelectYear={handleSelectYear} currentYear={validYear} />

      {validYear != null ? (
        <YearView year={validYear} />
      ) : (
        <NotableYearsGallery onSelectYear={handleSelectYear} />
      )}

      {/* Bottom back-link */}
      <div style={{ padding: '24px 32px 40px' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
            transition: 'background 0.15s',
          }}
        >
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
