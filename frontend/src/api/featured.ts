/**
 * featured.ts — Fetch a random high-importance event for the splash card / Surprise Me.
 *
 * Uses the tile endpoint with a broad viewport and high min_importance filter,
 * then picks a random event from the result set.
 */
import { fetchTiles } from './client';
import type { HistoricalEvent } from '../types';

const MIN_IMPORTANCE = 0.8;

/**
 * Fetch all events with importance_score >= 0.8 and return one at random.
 * Returns null only if there are zero qualifying events.
 */
export async function fetchRandomFeaturedEvent(): Promise<HistoricalEvent | null> {
  const { events } = await fetchTiles({
    year_min: -5000,
    year_max: 2025,
    lat_min: -90,
    lat_max: 90,
    zoom: 10,
  });

  const high = events.filter((e) => e.importance_score >= MIN_IMPORTANCE);
  if (high.length === 0) return null;
  return high[Math.floor(Math.random() * high.length)];
}
