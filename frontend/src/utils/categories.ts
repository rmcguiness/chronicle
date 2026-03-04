import type { EventCategory, ConnectionType, PerspectiveType, Region } from '../types';
import { REGIONS, CANVAS_CONSTANTS } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Category colours
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  war: '#ef4444',        // red
  discovery: '#3b82f6',  // blue
  political: '#a855f7',  // purple
  cultural: '#f97316',   // orange
  natural: '#22c55e',    // green
  person: '#eab308',     // yellow
};

export const CATEGORY_DARK_COLORS: Record<EventCategory, string> = {
  war: '#b91c1c',
  discovery: '#1d4ed8',
  political: '#7e22ce',
  cultural: '#c2410c',
  natural: '#15803d',
  person: '#a16207',
};

// Simple SVG icon characters / emoji for each category
export const CATEGORY_ICONS: Record<EventCategory, string> = {
  war: '⚔️',
  discovery: '🔭',
  political: '🏛️',
  cultural: '🎨',
  natural: '🌿',
  person: '👤',
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  war: 'War & Conflict',
  discovery: 'Discovery & Science',
  political: 'Political',
  cultural: 'Culture & Society',
  natural: 'Natural Event',
  person: 'Person',
};

// ─────────────────────────────────────────────────────────────────────────────
// Connection (causality edge) colours
// ─────────────────────────────────────────────────────────────────────────────

export const CONNECTION_COLORS: Record<ConnectionType, string> = {
  causes: '#ef4444',     // red — direct cause
  leads_to: '#f97316',  // orange — leads to
  enables: '#3b82f6',   // blue — enables / facilitates
  context: '#6b7280',   // grey — contextual
};

export const CONNECTION_LABELS: Record<ConnectionType, string> = {
  causes: 'Causes',
  leads_to: 'Leads To',
  enables: 'Enables',
  context: 'Context',
};

// ─────────────────────────────────────────────────────────────────────────────
// Perspective type colours
// ─────────────────────────────────────────────────────────────────────────────

export const PERSPECTIVE_COLORS: Record<PerspectiveType, string> = {
  government: '#6366f1',   // indigo
  civilian: '#14b8a6',     // teal
  foreign: '#f59e0b',      // amber
  academic: '#8b5cf6',     // violet
  nationalist: '#ec4899',  // pink
  colonial: '#f97316',     // orange
  indigenous: '#22c55e',   // green
  religious: '#a78bfa',    // light violet
  journalistic: '#60a5fa', // light blue
};

export const PERSPECTIVE_LABELS: Record<PerspectiveType, string> = {
  government: 'Government',
  civilian: 'Civilian',
  foreign: 'Foreign',
  academic: 'Academic',
  nationalist: 'Nationalist',
  colonial: 'Colonial',
  indigenous: 'Indigenous',
  religious: 'Religious',
  journalistic: 'Journalistic',
};

// ─────────────────────────────────────────────────────────────────────────────
// Evidence score helpers
// ─────────────────────────────────────────────────────────────────────────────

export function evidenceColor(score: number): string {
  if (score >= 0.7) return '#22c55e';  // green
  if (score >= 0.4) return '#f59e0b';  // amber
  return '#ef4444';                     // red
}

export function evidenceLabel(score: number): string {
  if (score >= 0.7) return 'Strong';
  if (score >= 0.4) return 'Moderate';
  return 'Weak';
}

// ─────────────────────────────────────────────────────────────────────────────
// LOD (Level of Detail) threshold by react-flow zoom
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the minimum importance score threshold based on react-flow zoom level.
 * At low zoom (zoomed out, e.g. 0.05) → high threshold (~0.9), showing only major events.
 * At high zoom (zoomed in, e.g. 1.0+) → low threshold (0.3), showing all detail.
 * @param rfZoom - React Flow zoom level (typically 0.05–4.0)
 * @returns Importance threshold in [0.3, 0.9]
 */
export function importanceThreshold(rfZoom: number): number {
  /** Minimum threshold at max zoom — always show events scoring ≥ 0.3 */
  const MIN_THRESHOLD = 0.3;
  /** Maximum threshold at min zoom — only show events scoring ≥ 0.9 */
  const MAX_THRESHOLD = 0.9;
  /** Scaling factor mapping zoom to threshold reduction */
  const ZOOM_SCALE = 0.8;

  return Math.max(MIN_THRESHOLD, MAX_THRESHOLD - rfZoom * ZOOM_SCALE);
}

// ─────────────────────────────────────────────────────────────────────────────
// Region classification for swim lanes
// ─────────────────────────────────────────────────────────────────────────────

export function classifyRegion(lat: number, lng: number): Region {
  if (lng < -25) return 'americas';
  if (lng > 65) return 'asia';
  if (lat >= 35) return 'europe';
  if (lat < 35) return 'middle_east_africa';
  return 'global';
}

export function regionBandIndex(region: Region): number {
  const idx = REGIONS.findIndex((r) => r.id === region);
  return idx >= 0 ? idx : REGIONS.length - 1;
}

/**
 * Compute canvas-space Y for an event based on its region band.
 * Uses longitude for vertical spread within the band to avoid overlap.
 *
 * @deprecated Uses the legacy fixed BAND_HEIGHT constant.
 * For dynamic density-based heights use `computeBandLayout` + `getBandByIndex`
 * from `utils/bandDensity` instead.
 */
export function eventBandY(lat: number, lng: number): number {
  const region = classifyRegion(lat, lng);
  const bandIdx = regionBandIndex(region);
  const { BAND_HEIGHT } = CANVAS_CONSTANTS;
  const bandTop = bandIdx * BAND_HEIGHT;
  const padding = 30;
  const usable = BAND_HEIGHT - 2 * padding;
  // Normalise longitude to [0, 1] for intra-band spread
  const lngNorm = Math.max(0, Math.min(1, (lng + 180) / 360));
  return bandTop + padding + lngNorm * usable;
}
