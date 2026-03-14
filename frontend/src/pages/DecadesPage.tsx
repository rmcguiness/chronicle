/**
 * DecadesPage — Browse history decade-by-decade at /decades.
 *
 * Sections:
 *  - DecadeStats: key statistics across all decades
 *  - DecadeJumper: era buttons + year input for quick navigation
 *  - DecadeHeatmap: compact grid showing event density per decade
 *  - DecadeTimeline: vertical scrollable list of all decades
 */
import { useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchDecades,
  fetchDecadeDetail,
  type DecadeSummary,
  type DecadeEventItem,
} from '../api/client';
import { CATEGORY_COLORS } from '../utils/categories';
import type { EventCategory } from '../types';

// ── Era definitions for the jumper ──────────────────────────────────────────

interface Era {
  label: string;
  minYear: number;
  maxYear: number;
}

const ERAS: Era[] = [
  { label: 'Prehistoric', minYear: -100000, maxYear: -3001 },
  { label: 'Ancient', minYear: -3000, maxYear: -801 },
  { label: 'Classical', minYear: -800, maxYear: 499 },
  { label: 'Medieval', minYear: 500, maxYear: 1399 },
  { label: 'Early Modern', minYear: 1400, maxYear: 1749 },
  { label: 'Modern', minYear: 1750, maxYear: 1899 },
  { label: 'Contemporary', minYear: 1900, maxYear: 2100 },
];

// ── Importance stars helper ─────────────────────────────────────────────────

function importanceStars(score: number): string {
  const count = Math.round(score * 5);
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

// ── DecadeStats ─────────────────────────────────────────────────────────────

interface DecadeStatsProps {
  decades: DecadeSummary[];
}

/** Key statistics displayed at the top of the page. */
function DecadeStats({ decades }: DecadeStatsProps) {
  const mostEventful = useMemo(
    () => decades.reduce<DecadeSummary | null>((best, d) => (!best || d.event_count > best.event_count ? d : best), null),
    [decades],
  );

  const mostImpactful = useMemo(
    () => decades.reduce<DecadeSummary | null>((best, d) => (!best || d.avg_importance > best.avg_importance ? d : best), null),
    [decades],
  );

  const quietestCentury = useMemo(() => {
    const centuryMap = new Map<number, number>();
    for (const d of decades) {
      const century = Math.floor(d.decade / 100) * 100;
      centuryMap.set(century, (centuryMap.get(century) ?? 0) + d.event_count);
    }
    let minCentury = 0;
    let minCount = Infinity;
    for (const [c, count] of centuryMap) {
      if (count < minCount) {
        minCentury = c;
        minCount = count;
      }
    }
    const label = minCentury >= 0 ? `${minCentury}s` : `${Math.abs(minCentury)}s BCE`;
    return { label, count: minCount };
  }, [decades]);

  const cards = [
    { title: 'Most Eventful Decade', value: mostEventful?.label ?? '—', sub: `${mostEventful?.event_count ?? 0} events` },
    { title: 'Most Impactful Decade', value: mostImpactful?.label ?? '—', sub: `avg ${(mostImpactful?.avg_importance ?? 0).toFixed(2)}` },
    { title: 'Quietest Century', value: quietestCentury.label, sub: `${quietestCentury.count} events` },
    { title: 'Decades Covered', value: String(decades.length), sub: 'with at least 1 event' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((c) => (
        <div key={c.title} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{c.title}</p>
          <p className="text-2xl font-bold text-white">{c.value}</p>
          <p className="text-sm text-slate-400">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── DecadeJumper ────────────────────────────────────────────────────────────

interface DecadeJumperProps {
  decades: DecadeSummary[];
  onJumpToDecade: (decade: number) => void;
}

/** Era buttons + year input for quick navigation. */
function DecadeJumper({ decades, onJumpToDecade }: DecadeJumperProps) {
  const [yearInput, setYearInput] = useState('');

  const jumpToEra = useCallback(
    (era: Era) => {
      const match = decades.find((d) => d.decade >= era.minYear && d.decade <= era.maxYear);
      if (match) onJumpToDecade(match.decade);
    },
    [decades, onJumpToDecade],
  );

  const handleYearSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const year = parseInt(yearInput, 10);
      if (isNaN(year)) return;
      const targetDecade = Math.floor(year / 10) * 10;
      // Find nearest decade
      let nearest = decades[0];
      let minDist = Infinity;
      for (const d of decades) {
        const dist = Math.abs(d.decade - targetDecade);
        if (dist < minDist) {
          minDist = dist;
          nearest = d;
        }
      }
      if (nearest) onJumpToDecade(nearest.decade);
    },
    [yearInput, decades, onJumpToDecade],
  );

  return (
    <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-6 py-3 flex flex-wrap items-center gap-3">
      <span className="text-xs text-slate-400 uppercase tracking-wider mr-2">Jump to era:</span>
      {ERAS.map((era) => (
        <button
          key={era.label}
          onClick={() => jumpToEra(era)}
          className="px-3 py-1 text-sm rounded-full bg-slate-700/60 text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors"
        >
          {era.label}
        </button>
      ))}
      <form onSubmit={handleYearSubmit} className="flex items-center gap-2 ml-auto">
        <label className="text-xs text-slate-400">Year:</label>
        <input
          type="number"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          placeholder="e.g. 1776"
          className="w-24 px-2 py-1 text-sm rounded bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          Go
        </button>
      </form>
    </div>
  );
}

// ── DecadeHeatmap ───────────────────────────────────────────────────────────

interface DecadeHeatmapProps {
  decades: DecadeSummary[];
  onSelectDecade: (decade: number) => void;
}

/** Compact grid heatmap (like GitHub contributions) of event density per decade. */
function DecadeHeatmap({ decades, onSelectDecade }: DecadeHeatmapProps) {
  const cellColor = (count: number): string => {
    if (count <= 1) return 'bg-slate-700/40';
    if (count <= 5) return 'bg-blue-800/60';
    if (count <= 10) return 'bg-blue-600/80';
    return 'bg-amber-500/90';
  };

  return (
    <div className="mb-8">
      <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-3">Event density by decade</h3>
      <div className="flex flex-wrap gap-1">
        {decades.map((d) => (
          <button
            key={d.decade}
            onClick={() => onSelectDecade(d.decade)}
            title={`${d.label}: ${d.event_count} events`}
            className={`w-4 h-4 rounded-sm ${cellColor(d.event_count)} hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-slate-700/40 inline-block" /> 0–1</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-800/60 inline-block" /> 2–5</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-600/80 inline-block" /> 6–10</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500/90 inline-block" /> 10+</span>
      </div>
    </div>
  );
}

// ── DecadeRow (expandable) ──────────────────────────────────────────────────

interface DecadeRowProps {
  summary: DecadeSummary;
  isExpanded: boolean;
  onToggle: () => void;
}

/** A single decade row in the timeline. Fetches detail on expand. */
function DecadeRow({ summary, isExpanded, onToggle }: DecadeRowProps) {
  const { data: detail, isLoading } = useQuery({
    queryKey: ['decade-detail', summary.decade],
    queryFn: () => fetchDecadeDetail(summary.decade),
    enabled: isExpanded,
    staleTime: 5 * 60 * 1000,
  });

  const barWidth = Math.max(4, Math.round(summary.avg_importance * 100));

  return (
    <div
      id={`decade-${summary.decade}`}
      className="border-b border-slate-700/30"
    >
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-800/40 transition-colors text-left"
      >
        {/* Left: label + count */}
        <div className="w-32 shrink-0">
          <span className="text-lg font-semibold text-white">{summary.label}</span>
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">
            {summary.event_count}
          </span>
        </div>

        {/* Region tags */}
        <div className="hidden md:flex flex-wrap gap-1 w-48 shrink-0">
          {summary.regions.slice(0, 3).map((r) => (
            <span key={r} className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 truncate max-w-[120px]">
              {r}
            </span>
          ))}
          {summary.regions.length > 3 && (
            <span className="text-xs text-slate-500">+{summary.regions.length - 3}</span>
          )}
        </div>

        {/* Top event chips */}
        <div className="flex-1 flex flex-wrap gap-1.5">
          {summary.top_events.map((ev) => {
            const color = CATEGORY_COLORS[ev.category as EventCategory] ?? '#6b7280';
            return (
              <span
                key={ev.id}
                className="text-xs px-2.5 py-1 rounded-full text-white truncate max-w-[200px]"
                style={{ backgroundColor: `${color}33`, border: `1px solid ${color}66` }}
              >
                {ev.title}
              </span>
            );
          })}
        </div>

        {/* Importance bar */}
        <div className="w-24 shrink-0 hidden lg:block">
          <div className="h-2 rounded-full bg-slate-700/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>

        {/* Expand indicator */}
        <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 bg-slate-800/20">
          {isLoading && <p className="text-sm text-slate-400">Loading events…</p>}
          {detail && (
            <div className="grid gap-2">
              {detail.events.map((ev: DecadeEventItem) => {
                const color = CATEGORY_COLORS[ev.category as EventCategory] ?? '#6b7280';
                return (
                  <Link
                    key={ev.id}
                    to={`/event/${ev.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
                  >
                    {/* Category badge */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {/* Title */}
                    <span className="flex-1 text-sm text-slate-200 group-hover:text-white">
                      {ev.title}
                    </span>
                    {/* Year */}
                    <span className="text-xs text-slate-400 shrink-0">
                      {ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : ev.year_approx}
                    </span>
                    {/* Region */}
                    {ev.region && (
                      <span className="text-xs text-slate-500 shrink-0 hidden sm:inline max-w-[150px] truncate">
                        {ev.region}
                      </span>
                    )}
                    {/* Category */}
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
                    >
                      {ev.category ?? 'unknown'}
                    </span>
                    {/* Importance stars */}
                    <span className="text-xs text-amber-400 shrink-0" title={`Importance: ${ev.importance_score.toFixed(2)}`}>
                      {importanceStars(ev.importance_score)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── DecadesPage (main export) ───────────────────────────────────────────────

/** Browse history decade-by-decade. */
export default function DecadesPage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [expandedDecade, setExpandedDecade] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['decades'],
    queryFn: fetchDecades,
    staleTime: 5 * 60 * 1000,
  });

  const decades = data?.decades ?? [];

  const scrollToDecade = useCallback((decade: number) => {
    const el = document.getElementById(`decade-${decade}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setExpandedDecade(decade);
    }
  }, []);

  const toggleDecade = useCallback((decade: number) => {
    setExpandedDecade((prev) => (prev === decade ? null : decade));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-lg">Loading decades…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">Failed to load decades.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav bar */}
      <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-700/50 px-6 py-3 flex items-center gap-6">
        <Link to="/" className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
          Chronicle
        </Link>
        <Link to="/decades" className="text-sm text-indigo-400 font-medium">
          Decades
        </Link>
        <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">
          Admin
        </Link>
      </nav>

      {/* Jumper */}
      <DecadeJumper decades={decades} onJumpToDecade={scrollToDecade} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Browse by Decade</h1>
        <p className="text-slate-400 mb-8">
          Scroll through history decade-by-decade. Click any decade to see all its events.
        </p>

        {/* Stats */}
        <DecadeStats decades={decades} />

        {/* Heatmap */}
        <DecadeHeatmap decades={decades} onSelectDecade={scrollToDecade} />

        {/* Timeline */}
        <div ref={timelineRef} className="border border-slate-700/30 rounded-xl overflow-hidden">
          {decades.map((d) => (
            <DecadeRow
              key={d.decade}
              summary={d}
              isExpanded={expandedDecade === d.decade}
              onToggle={() => toggleDecade(d.decade)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
