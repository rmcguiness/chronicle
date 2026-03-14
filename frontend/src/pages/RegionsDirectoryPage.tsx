/**
 * RegionsDirectoryPage — /regions directory listing all six world regions.
 *
 * Shows a grid of region cards with event counts, time spans, and top events,
 * plus global stats (total events, most documented region).
 */
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

import { fetchRegionsDirectory } from '../api/client';
import type { RegionsDirectory, RegionSummary } from '../types';

// ── Region metadata (shared with RegionPage) ────────────────────────────────

interface RegionCardMeta {
  emoji: string;
  color: string;
  bgGradient: string;
}

const REGION_META: Record<string, RegionCardMeta> = {
  Europe: { emoji: '\u{1F30D}', color: '#3b82f6', bgGradient: 'from-blue-800/40 to-blue-900/60' },
  Asia: { emoji: '\u{1F30F}', color: '#ef4444', bgGradient: 'from-red-800/40 to-red-900/60' },
  Americas: { emoji: '\u{1F30E}', color: '#22c55e', bgGradient: 'from-green-800/40 to-green-900/60' },
  Africa: { emoji: '\u{1F30D}', color: '#f59e0b', bgGradient: 'from-amber-800/40 to-amber-900/60' },
  'Middle East': { emoji: '\u{1F54C}', color: '#a855f7', bgGradient: 'from-purple-800/40 to-purple-900/60' },
  Oceania: { emoji: '\u{1F3DD}\u{FE0F}', color: '#14b8a6', bgGradient: 'from-teal-800/40 to-teal-900/60' },
};

/** Format year for display. */
function fmtYear(y: number | null | undefined): string {
  if (y == null) return '?';
  if (y < 0) return `${Math.abs(y)} BCE`;
  return String(y);
}

/** Single region card in the directory grid. */
function RegionCard({ region, index }: { region: RegionSummary; index: number }) {
  const meta = REGION_META[region.region] ?? REGION_META.Europe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link
        to={`/region/${region.slug}`}
        className={`block bg-gradient-to-br ${meta.bgGradient} rounded-xl p-6 border border-gray-700 hover:border-gray-500 transition-all hover:scale-[1.02]`}
      >
        <div className="text-4xl mb-3">{meta.emoji}</div>
        <h2 className="text-xl font-bold text-white mb-2">{region.region}</h2>
        <div className="space-y-1 text-sm text-gray-300">
          <p>
            <span className="font-semibold text-white">{region.event_count}</span> events
          </p>
          <p>
            {fmtYear(region.min_year)} \u2013 {fmtYear(region.max_year)}
          </p>
          {region.top_event_title && (
            <p className="text-gray-400 text-xs mt-2 italic truncate">
              Top: {region.top_event_title}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function RegionsDirectoryPage() {
  const { data, isLoading, error } = useQuery<RegionsDirectory>({
    queryKey: ['regions-directory'],
    queryFn: fetchRegionsDirectory,
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Nav bar */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <Link to="/" className="text-white font-bold text-lg">Chronicle</Link>
          <span className="text-white text-sm">Regions</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">World Regions</h1>
          <p className="text-gray-400 text-lg">Explore the history of every corner of the world</p>
          {data && (
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-300">
              <span>
                <span className="text-white font-semibold">{data.total_events}</span> total events
              </span>
              {data.most_documented_region && (
                <span>
                  Most documented: <span className="text-white font-semibold">{data.most_documented_region}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {isLoading && (
          <div className="text-center text-gray-400 py-20">Loading regions...</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-20">Failed to load regions</div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.regions.map((region, i) => (
              <RegionCard key={region.slug} region={region} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/" className="text-blue-400 hover:underline text-sm">
            \u2190 Back to Timeline
          </Link>
        </div>
      </main>
    </div>
  );
}
