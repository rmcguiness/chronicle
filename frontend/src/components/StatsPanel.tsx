/**
 * StatsPanel — collapsible bottom-left panel showing aggregate timeline statistics.
 *
 * Fetches data from GET /api/stats on mount via React Query.
 * Shows: total events, time span, events by era/category, most connected
 * event, total causal links, and Wikipedia data coverage.
 *
 * Collapsed by default. Toggle via the bar-chart icon button.
 * Responsive: hidden on very small screens when collapsed.
 */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStats } from '../api/client';
import type { TimelineStats, CategoryCount } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  war: '#ef4444',
  political: '#3b82f6',
  discovery: '#22c55e',
  cultural: '#a855f7',
  natural: '#f59e0b',
  person: '#ec4899',
};

/** Skeleton line used while loading. */
function SkeletonLine({ width = '100%' }: { width?: string }) {
  return (
    <div
      className="h-3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
      style={{ width }}
    />
  );
}

/** Mini horizontal bar for category/era breakdown. */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/** Stat label + value row. */
function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right truncate">
        {value}
      </span>
    </div>
  );
}

export default function StatsPanel() {
  const [open, setOpen] = useState(false);

  const { data: stats, isLoading } = useQuery<TimelineStats | null>({
    queryKey: ['timeline-stats'],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const maxCategory = stats?.byCategory?.reduce(
    (m: number, c: CategoryCount) => Math.max(m, c.count),
    0,
  ) ?? 0;

  const maxEra = stats?.byEra?.reduce(
    (m: number, e: { era: string; count: number }) => Math.max(m, e.count),
    0,
  ) ?? 0;

  return (
    <div className="fixed bottom-16 left-3 z-20 flex flex-col items-start" style={{ maxWidth: 280 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700
                        bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg
                        p-4 space-y-3 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 160px)' }}
          >
            {isLoading || !stats ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonLine key={i} width={`${60 + Math.random() * 40}%`} />
                ))}
              </div>
            ) : (
              <>
                {/* Total Events */}
                <StatRow label="Total Events" value={stats.totalEvents.toLocaleString()} />

                {/* Time Span */}
                <StatRow label="Time Span" value={stats.timeSpan.label} />

                {/* Total Causal Links */}
                <StatRow label="Causal Links" value={stats.totalLinks.toLocaleString()} />

                {/* Data Coverage */}
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Wiki Coverage</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {stats.coveragePct}%
                    </span>
                  </div>
                  <MiniBar value={stats.coveragePct} max={100} color="#6366f1" />
                </div>

                {/* Most Connected Event */}
                {stats.mostConnected && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-0.5">
                      Most Connected
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 block truncate">
                      {stats.mostConnected.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {stats.mostConnected.connectionCount} connections
                    </span>
                  </div>
                )}

                {/* Events by Era */}
                {stats.byEra.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1.5">
                      Events by Era
                    </span>
                    <div className="space-y-1.5">
                      {stats.byEra.map((e) => (
                        <div key={e.era}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 dark:text-gray-300">{e.era}</span>
                            <span className="text-gray-400 dark:text-gray-500">{e.count}</span>
                          </div>
                          <MiniBar value={e.count} max={maxEra} color="#8b5cf6" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events by Category (top 5) */}
                {stats.byCategory.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1.5">
                      Top Categories
                    </span>
                    <div className="space-y-1.5">
                      {stats.byCategory.map((c) => (
                        <div key={c.category}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 dark:text-gray-300 capitalize">
                              {c.category}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">{c.count}</span>
                          </div>
                          <MiniBar
                            value={c.count}
                            max={maxCategory}
                            color={CATEGORY_COLORS[c.category] ?? '#6b7280'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                   bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200
                   dark:border-gray-700 text-gray-600 dark:text-gray-300
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
        title="Timeline Statistics"
      >
        {/* Bar chart icon (inline SVG to avoid extra deps) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="12" width="4" height="9" rx="1" />
          <rect x="10" y="7" width="4" height="14" rx="1" />
          <rect x="17" y="3" width="4" height="18" rx="1" />
        </svg>
        Stats
      </button>
    </div>
  );
}
