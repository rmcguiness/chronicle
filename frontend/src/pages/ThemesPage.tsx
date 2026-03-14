/**
 * ThemesPage — browse history through thematic lenses.
 *
 * Displays a grid of ~12 theme cards. Clicking a card expands it to show
 * all events for that theme, sorted by importance. A sidebar (desktop)
 * shows a bar chart of event counts and most active era per theme.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { fetchThemes, fetchThemeEvents } from '../api/client';
import type { Theme, ThemeEvent } from '../types';

/** Render importance as star characters. */
function importanceStars(score: number): string {
  const count = Math.round(score * 5);
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

/** Format year with BCE suffix. */
function formatYear(year: number | null): string {
  if (year === null) return '?';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

/** Estimate the most active century for a list of events. */
function mostActiveCentury(events: ThemeEvent[]): string {
  const centuries: Record<number, number> = {};
  for (const e of events) {
    if (e.year_approx === null) continue;
    const c = Math.floor(e.year_approx / 100);
    centuries[c] = (centuries[c] || 0) + 1;
  }
  const entries = Object.entries(centuries);
  if (entries.length === 0) return '—';
  const [best] = entries.sort(([, a], [, b]) => b - a);
  const n = Number(best[0]);
  if (n < 0) return `${Math.abs(n)}th c. BCE`;
  return `${n + 1}th c.`;
}

// ─── ThemeCard ──────────────────────────────────────────────────────────────

interface ThemeCardProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

/** Single theme card in the grid. */
function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      className={`
        group relative rounded-xl border p-5 text-left
        transition-all duration-200 cursor-pointer
        hover:scale-[1.02] hover:shadow-lg
        ${isSelected
          ? 'ring-2 shadow-md bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
      style={{
        borderColor: isSelected ? theme.color : undefined,
        // @ts-expect-error CSS custom property
        '--tw-ring-color': theme.color,
      }}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full rounded-t-xl"
        style={{ backgroundColor: theme.color }}
      />

      <div className="flex items-start gap-3">
        <span className="text-3xl" role="img" aria-label={theme.name}>
          {theme.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {theme.name}
            </h3>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: theme.color }}
            >
              {theme.event_count}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {theme.description}
          </p>
        </div>
      </div>
    </button>
  );
}

// ─── ThemeEventList ─────────────────────────────────────────────────────────

interface ThemeEventListProps {
  themeId: string;
  themeName: string;
  themeColor: string;
}

/** Expanded panel showing all events for a theme. */
function ThemeEventList({ themeId, themeName, themeColor }: ThemeEventListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['theme-events', themeId],
    queryFn: () => fetchThemeEvents(themeId),
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 text-sm">
        Failed to load events for {themeName}.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: `${themeColor}08` }}>
        <h3 className="font-semibold text-gray-900">
          {themeName}
          <span className="ml-2 text-sm font-normal text-gray-500">
            — {data.event_count} events
          </span>
        </h3>
      </div>

      <div className="max-h-[28rem] overflow-y-auto divide-y divide-gray-50">
        {data.events.map((event) => (
          <Link
            key={event.id}
            to={`/?event=${event.slug}`}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="shrink-0 w-16 text-right text-xs font-mono text-gray-400">
              {formatYear(event.year_approx)}
            </span>
            <span className="flex-1 text-sm text-gray-800 truncate">
              {event.title}
            </span>
            {event.region && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                {event.region}
              </span>
            )}
            <span className="shrink-0 text-amber-400 text-xs tracking-tight" title={`Importance: ${event.importance_score.toFixed(2)}`}>
              {importanceStars(event.importance_score)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── ThemeStats ─────────────────────────────────────────────────────────────

interface ThemeStatsProps {
  themes: Theme[];
}

/** Sidebar with bar chart and era breakdown (desktop only). */
function ThemeStats({ themes }: ThemeStatsProps) {
  const chartData = themes
    .map((t) => ({ name: t.emoji, fullName: t.name, count: t.event_count, color: t.color }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Events by Theme</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={30} tick={{ fontSize: 16 }} />
            <Tooltip
              formatter={(value: number) => [value, 'Events']}
              labelFormatter={(label: string) => {
                const item = chartData.find((d) => d.name === label);
                return item?.fullName ?? label;
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most active era per theme */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Most Active Era</h3>
        <div className="space-y-2">
          {themes.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate flex-1">
                {t.emoji} {t.name}
              </span>
              <span className="shrink-0 text-gray-400 font-mono">
                {mostActiveCentury(t.top_events)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ThemesPage ─────────────────────────────────────────────────────────────

/** Main themes page — grid + optional expanded event list + stats sidebar. */
export default function ThemesPage() {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  const { data: themes, isLoading, error } = useQuery({
    queryKey: ['themes'],
    queryFn: fetchThemes,
  });

  const selectedTheme = themes?.find((t) => t.id === selectedThemeId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedThemeId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
            <span className="text-lg font-bold tracking-tight">Chronicle</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-gray-900">Timeline</Link>
            <Link to="/themes" className="text-gray-900 border-b-2 border-gray-900 pb-0.5">
              Themes
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse by Theme</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore history through thematic lenses — wars, revolutions, discoveries, and more.
        </p>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-red-700">
            Failed to load themes. Make sure the backend is running.
          </div>
        )}

        {themes && (
          <div className="flex gap-8">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Theme grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <ThemeCard
                    key={theme.id}
                    theme={theme}
                    isSelected={selectedThemeId === theme.id}
                    onSelect={handleSelect}
                  />
                ))}
              </div>

              {/* Expanded event list */}
              {selectedTheme && (
                <div className="animate-[slideDown_0.2s_ease-out]">
                  <ThemeEventList
                    themeId={selectedTheme.id}
                    themeName={selectedTheme.name}
                    themeColor={selectedTheme.color}
                  />
                </div>
              )}
            </div>

            {/* Stats sidebar — desktop only */}
            <div className="hidden xl:block w-80 shrink-0">
              <div className="sticky top-20">
                <ThemeStats themes={themes} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
