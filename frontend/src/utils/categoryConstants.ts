/**
 * categoryConstants — shared emoji map, labels, and colors for event categories.
 *
 * Owns: category display metadata.
 * Does NOT own: DB queries, routing, component rendering.
 */

/** Emoji icons for each normalised event category. */
export const CATEGORY_EMOJIS: Record<string, string> = {
  war: '⚔️',
  science: '🔬',
  cultural: '🎨',
  political: '⚖️',
  natural: '🌋',
  discovery: '🌍',
  religion: '🕊️',
  trade: '💰',
  social: '👥',
  person: '👤',
  technology: '💻',
};

/** Human-readable labels for each category. */
export const CATEGORY_DISPLAY_LABELS: Record<string, string> = {
  war: 'War & Conflict',
  science: 'Science',
  cultural: 'Culture & Society',
  political: 'Political',
  natural: 'Natural Events',
  discovery: 'Discovery & Exploration',
  religion: 'Religion',
  trade: 'Trade & Economics',
  social: 'Social',
  person: 'People',
  technology: 'Technology',
};

/** Background colors (soft pastels) for category cards. */
export const CATEGORY_BG_COLORS: Record<string, string> = {
  war: '#fef2f2',
  science: '#eff6ff',
  cultural: '#fff7ed',
  political: '#faf5ff',
  natural: '#f0fdf4',
  discovery: '#eff6ff',
  religion: '#fdf4ff',
  trade: '#fffbeb',
  social: '#f0fdfa',
  person: '#fefce8',
  technology: '#f0f9ff',
};

/** Accent colors for category badges/borders. */
export const CATEGORY_ACCENT_COLORS: Record<string, string> = {
  war: '#ef4444',
  science: '#3b82f6',
  cultural: '#f97316',
  political: '#a855f7',
  natural: '#22c55e',
  discovery: '#0ea5e9',
  religion: '#8b5cf6',
  trade: '#f59e0b',
  social: '#14b8a6',
  person: '#eab308',
  technology: '#06b6d4',
};

/** Era filter options for category detail page. */
export const ERA_OPTIONS = [
  { value: '', label: 'All Eras' },
  { value: 'ancient', label: 'Ancient (–3000 to 500)' },
  { value: 'medieval', label: 'Medieval (500–1500)' },
  { value: 'early_modern', label: 'Early Modern (1500–1800)' },
  { value: 'modern', label: 'Modern (1800–1950)' },
  { value: 'contemporary', label: 'Contemporary (1950+)' },
] as const;

/** Sort options for category detail page. */
export const SORT_OPTIONS = [
  { value: 'year_asc', label: 'Oldest First' },
  { value: 'year_desc', label: 'Newest First' },
  { value: 'importance', label: 'By Importance' },
] as const;

/** Default number of events per page. */
export const EVENTS_PER_PAGE = 24;

/**
 * Get the emoji for a category, with fallback.
 * @param category - The event category string
 * @returns Emoji string
 */
export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] ?? '📌';
}

/**
 * Get the display label for a category, with fallback.
 * @param category - The event category string
 * @returns Human-readable label
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_DISPLAY_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}
