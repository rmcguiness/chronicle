import type { EventCategory, ConnectionType, PerspectiveType } from '../types';

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

export function importanceThreshold(rfZoom: number): number {
  if (rfZoom <= 0.3) return 0.9;
  if (rfZoom <= 0.5) return 0.7;
  if (rfZoom <= 1.0) return 0.5;
  if (rfZoom <= 2.0) return 0.3;
  return 0;
}
