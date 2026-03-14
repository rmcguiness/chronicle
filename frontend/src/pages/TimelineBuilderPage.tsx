/**
 * TimelineBuilderPage — the /builder page for curating custom timelines.
 *
 * Layout: sidebar (EventSearchPanel) + main area (TimelinePreview + TimelineStats).
 * Route: /builder
 */
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useTimelineBuilderStore,
  saveTimeline,
  type TimelineEvent,
} from '../store/timelineBuilder';
import { searchEvents } from '../api/client';
import type { SearchResult, EventCategory, Region } from '../types';
import { REGIONS } from '../types';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';

// ─── Styles ─────────────────────────────────────────────────────────────────

const PAGE_BG = '#070e22';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_PRIMARY = '#f1f5f9';
const TEXT_SECONDARY = '#94a3b8';
const TEXT_MUTED = '#64748b';
const ACCENT = '#3b82f6';

const categories: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

const ERA_OPTIONS = [
  { label: 'All Eras', min: -5000, max: 2100 },
  { label: 'Ancient (before 500)', min: -5000, max: 500 },
  { label: 'Medieval (500-1500)', min: 500, max: 1500 },
  { label: 'Early Modern (1500-1800)', min: 1500, max: 1800 },
  { label: 'Modern (1800-2000)', min: 1800, max: 2000 },
  { label: '21st Century', min: 2000, max: 2100 },
];

// ─── Page component ─────────────────────────────────────────────────────────

/** Timeline builder page — create and curate custom history playlists. */
export default function TimelineBuilderPage() {
  // Enable page scrolling (root is overflow:hidden for canvas view)
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

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: PAGE_BG,
        color: TEXT_PRIMARY,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <TimelineBuilderHeader />
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          gap: 24,
          padding: '0 24px 48px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ width: 320, flexShrink: 0 }}>
          <EventSearchPanel />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TimelinePreview />
          <TimelineStats />
        </div>
      </div>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────

/** Top header with name/description inputs, share/export/clear buttons. */
function TimelineBuilderHeader() {
  const { name, description, events, setName, setDescription, clearAll } =
    useTimelineBuilderStore();
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const handleShare = useCallback(() => {
    if (events.length === 0) return;
    const saved = saveTimeline(name, description, events);
    const url = `${window.location.origin}/timeline/${saved.id}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
  }, [name, description, events]);

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  return (
    <div
      style={{
        padding: '24px 24px 20px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      {/* Nav row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: TEXT_MUTED,
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            backgroundColor: CARD_BG,
          }}
        >
          &larr; Back
        </Link>
        <Link
          to="/timelines"
          style={{
            fontSize: 13,
            color: TEXT_MUTED,
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: 6,
            border: `1px solid ${BORDER}`,
            backgroundColor: CARD_BG,
          }}
        >
          Browse Timelines
        </Link>
      </div>

      {/* Title + description */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="My Timeline"
        style={{
          display: 'block',
          width: '100%',
          fontSize: 28,
          fontWeight: 800,
          background: 'transparent',
          border: 'none',
          color: TEXT_PRIMARY,
          outline: 'none',
          marginBottom: 8,
          padding: 0,
          fontFamily: 'inherit',
        }}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a short description..."
        style={{
          display: 'block',
          width: '100%',
          fontSize: 14,
          background: 'transparent',
          border: 'none',
          color: TEXT_SECONDARY,
          outline: 'none',
          marginBottom: 16,
          padding: 0,
          fontFamily: 'inherit',
        }}
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <ActionButton label="Share" onClick={handleShare} disabled={events.length === 0} accent />
        <ActionButton label="Export PDF" onClick={handleExport} disabled={events.length === 0} />
        <ActionButton label="Clear All" onClick={clearAll} disabled={events.length === 0} danger />
        {shareUrl && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontSize: 12, color: '#22c55e' }}
          >
            Link copied!
          </motion.span>
        )}
      </div>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  accent?: boolean;
  danger?: boolean;
}

/** Small action button used in the header bar. */
function ActionButton({ label, onClick, disabled, accent, danger }: ActionButtonProps) {
  const bg = accent ? `${ACCENT}22` : danger ? 'rgba(239,68,68,0.12)' : CARD_BG;
  const borderColor = accent ? `${ACCENT}66` : danger ? 'rgba(239,68,68,0.4)' : BORDER;
  const color = accent ? ACCENT : danger ? '#ef4444' : TEXT_SECONDARY;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontSize: 13,
        fontWeight: 600,
        padding: '7px 16px',
        borderRadius: 6,
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        color: disabled ? TEXT_MUTED : color,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        transition: 'opacity 0.15s',
      }}
    >
      {label}
    </button>
  );
}

// ─── Event Search Panel (left sidebar) ──────────────────────────────────────

/** Left sidebar: search, filter, browse events to add. */
function EventSearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | ''>('');
  const [regionFilter, setRegionFilter] = useState<Region | ''>('');
  const [eraIdx, setEraIdx] = useState(0);

  const { events, addEvent } = useTimelineBuilderStore();
  const addedIds = new Set(events.map((e) => e.id));

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const hits = await searchEvents(query, 30);
        setResults(hits);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Apply client-side filters
  const era = ERA_OPTIONS[eraIdx];
  const filtered = results.filter((r) => {
    if (categoryFilter && r.category !== categoryFilter) return false;
    if (regionFilter) {
      const geo = (r.geo_modern ?? '').toLowerCase();
      const regionLabel = REGIONS.find((rg) => rg.id === regionFilter)?.label.toLowerCase() ?? '';
      if (!geo.includes(regionLabel) && regionFilter !== 'global') return false;
    }
    if (r.year_approx < era.min || r.year_approx > era.max) return false;
    return true;
  });

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 16,
        position: 'sticky',
        top: 16,
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: TEXT_MUTED,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        Search Events
      </h3>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, tag, region..."
        style={{
          width: '100%',
          padding: '9px 12px',
          fontSize: 13,
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          color: TEXT_PRIMARY,
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          marginBottom: 10,
        }}
      />

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <FilterSelect
          value={categoryFilter}
          onChange={(v) => setCategoryFilter(v as EventCategory | '')}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
          ]}
        />
        <FilterSelect
          value={regionFilter}
          onChange={(v) => setRegionFilter(v as Region | '')}
          options={[
            { value: '', label: 'All Regions' },
            ...REGIONS.map((r) => ({ value: r.id, label: r.label })),
          ]}
        />
        <FilterSelect
          value={String(eraIdx)}
          onChange={(v) => setEraIdx(Number(v))}
          options={ERA_OPTIONS.map((e, i) => ({ value: String(i), label: e.label }))}
        />
      </div>

      {/* Results */}
      <div style={{ maxHeight: 480, overflowY: 'auto' }}>
        {loading && (
          <div style={{ fontSize: 12, color: TEXT_MUTED, padding: 8 }}>Searching...</div>
        )}
        {!loading && query && filtered.length === 0 && (
          <div style={{ fontSize: 12, color: TEXT_MUTED, padding: 8 }}>No results found.</div>
        )}
        {filtered.map((r) => {
          const isAdded = addedIds.has(r.id);
          return (
            <SearchResultItem
              key={r.id}
              result={r}
              isAdded={isAdded}
              onAdd={() => addEvent(r)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

/** Compact filter dropdown. */
function FilterSelect({ value, onChange, options }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: 11,
        padding: '5px 8px',
        backgroundColor: 'rgba(255,255,255,0.06)',
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        color: TEXT_SECONDARY,
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'pointer',
        flex: '1 1 80px',
        minWidth: 0,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ backgroundColor: '#1e293b' }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  isAdded: boolean;
  onAdd: () => void;
}

/** Single search result row. */
function SearchResultItem({ result, isAdded, onAdd }: SearchResultItemProps) {
  const catColor = CATEGORY_COLORS[result.category] ?? '#6b7280';
  const catIcon = CATEGORY_ICONS[result.category] ?? '';

  return (
    <div
      onClick={isAdded ? undefined : onAdd}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 6,
        cursor: isAdded ? 'default' : 'pointer',
        opacity: isAdded ? 0.5 : 1,
        transition: 'background 0.1s',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isAdded) (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{catIcon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {result.title}
        </div>
        <div style={{ fontSize: 11, color: TEXT_MUTED }}>
          {result.year_approx} &middot;{' '}
          <span style={{ color: catColor }}>{CATEGORY_LABELS[result.category] ?? result.category}</span>
        </div>
      </div>
      {isAdded && (
        <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>
          Added
        </span>
      )}
    </div>
  );
}

// ─── Timeline Preview (main area) ───────────────────────────────────────────

/** Main area showing the curated timeline as ordered event cards. */
function TimelinePreview() {
  const { events, removeEvent, moveUp, moveDown } = useTimelineBuilderStore();

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 20,
        minHeight: 320,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: TEXT_MUTED,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Your Timeline
        </h3>
        <span style={{ fontSize: 12, color: TEXT_MUTED }}>
          {events.length} event{events.length !== 1 ? 's' : ''} in your timeline
        </span>
      </div>

      {events.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            color: TEXT_MUTED,
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>&#128218;</span>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Your timeline is empty</div>
          <div style={{ fontSize: 12 }}>Search for events on the left to build your timeline</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {events.map((ev, i) => (
              <TimelineEventCard
                key={ev.id}
                event={ev}
                index={i}
                total={events.length}
                onRemove={() => removeEvent(ev.id)}
                onMoveUp={() => moveUp(i)}
                onMoveDown={() => moveDown(i)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

interface TimelineEventCardProps {
  event: TimelineEvent;
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/** A single event card in the timeline preview. */
function TimelineEventCard({ event, index, total, onRemove, onMoveUp, onMoveDown }: TimelineEventCardProps) {
  const catColor = CATEGORY_COLORS[event.category] ?? '#6b7280';
  const catIcon = CATEGORY_ICONS[event.category] ?? '';
  const catLabel = CATEGORY_LABELS[event.category] ?? event.category;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        borderRadius: 8,
        border: `1px solid ${catColor}33`,
        backgroundColor: `${catColor}08`,
      }}
    >
      {/* Timeline dot + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, width: 20 }}>
        {index > 0 && <div style={{ width: 2, height: 8, backgroundColor: `${BORDER}` }} />}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: catColor,
            border: `2px solid ${catColor}66`,
            boxShadow: `0 0 8px ${catColor}44`,
          }}
        />
        {index < total - 1 && <div style={{ width: 2, height: 8, backgroundColor: `${BORDER}` }} />}
      </div>

      {/* Event info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>
          {catIcon} {event.title}
        </div>
        <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>
          {event.year_approx}
          {event.geo_modern && <> &middot; {event.geo_modern}</>}
          {' '}&middot;{' '}
          <span style={{ color: catColor }}>{catLabel}</span>
        </div>
      </div>

      {/* Reorder + remove buttons */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <SmallButton label="&#9650;" onClick={onMoveUp} disabled={index === 0} title="Move up" />
        <SmallButton label="&#9660;" onClick={onMoveDown} disabled={index === total - 1} title="Move down" />
        <SmallButton label="&times;" onClick={onRemove} danger title="Remove" />
      </div>
    </motion.div>
  );
}

interface SmallButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
}

/** Tiny icon button for reorder/remove. */
function SmallButton({ label, onClick, disabled, danger, title }: SmallButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      dangerouslySetInnerHTML={{ __html: label }}
      style={{
        width: 26,
        height: 26,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : BORDER}`,
        backgroundColor: danger ? 'rgba(239,68,68,0.1)' : CARD_BG,
        color: danger ? '#ef4444' : TEXT_SECONDARY,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        fontFamily: 'inherit',
        padding: 0,
      }}
    />
  );
}

// ─── Timeline Stats ─────────────────────────────────────────────────────────

/** Statistics panel below the timeline preview. */
function TimelineStats() {
  const { events } = useTimelineBuilderStore();
  if (events.length === 0) return null;

  const years = events.map((e) => e.year_approx);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const regions = [...new Set(events.map((e) => e.geo_modern).filter(Boolean))];

  const categoryCounts: Record<string, number> = {};
  for (const e of events) {
    categoryCounts[e.category] = (categoryCounts[e.category] ?? 0) + 1;
  }

  const topEvent = events.reduce((a, b) => (a.importance_score >= b.importance_score ? a : b));

  return (
    <div
      style={{
        marginTop: 16,
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}
    >
      {/* Time span */}
      <StatCard
        label="Time Span"
        value={minYear === maxYear ? String(minYear) : `${minYear} \u2192 ${maxYear}`}
        sub={`${maxYear - minYear} years`}
      />

      {/* Regions */}
      <StatCard
        label="Regions"
        value={`${regions.length} region${regions.length !== 1 ? 's' : ''}`}
        sub={regions.slice(0, 3).join(', ') + (regions.length > 3 ? '...' : '')}
      />

      {/* Categories */}
      <div>
        <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Categories
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const color = CATEGORY_COLORS[cat as EventCategory] ?? '#6b7280';
            return (
              <span
                key={cat}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: `${color}22`,
                  color,
                  fontWeight: 600,
                }}
              >
                {CATEGORY_LABELS[cat as EventCategory] ?? cat}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Most important */}
      <StatCard
        label="Most Important Event"
        value={topEvent.title}
        sub={`Score: ${Math.round(topEvent.importance_score * 100)}%`}
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

/** A single stat display. */
function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div>
      <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_PRIMARY, marginBottom: 2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: TEXT_SECONDARY }}>{sub}</div>}
    </div>
  );
}
