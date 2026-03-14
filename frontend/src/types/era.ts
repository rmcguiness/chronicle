/**
 * Era types — shared type definitions for /era/:era and /eras pages.
 */

/** Valid era slug literals. */
export type EraSlug =
  | 'ancient'
  | 'classical'
  | 'medieval'
  | 'early-modern'
  | 'modern'
  | 'contemporary';

/** Era metadata returned by the backend. */
export interface EraMeta {
  name: string;
  slug: EraSlug;
  year_min: number;
  year_max: number;
  description: string;
}

/** A top event within an era. */
export interface EraTopEvent {
  slug: string;
  title: string;
  year_approx: number;
  category: string | null;
  importance_score: number;
  geo_modern: string | null;
}

/** A key historical figure within an era. */
export interface EraKeyFigure {
  name: string;
  slug: string | null;
  birth_year: number | null;
  death_year: number | null;
  roles: string[];
  description: string | null;
  event_count: number;
}

/** Most connected event in an era. */
export interface EraMostConnectedEvent {
  slug: string;
  title: string;
  link_count: number;
}

/** Stats block for an era. */
export interface EraStats {
  total_events: number;
  total_people: number;
  total_links: number;
  avg_importance: number;
  most_connected_event: EraMostConnectedEvent | null;
}

/** Neighboring era summary. */
export interface EraNeighbor {
  slug: EraSlug;
  name: string;
  year_min: number;
  year_max: number;
  event_count: number;
}

/** Full response from GET /api/era/:era. */
export interface EraDetailResponse {
  meta: EraMeta;
  stats: EraStats;
  top_events: EraTopEvent[];
  key_figures: EraKeyFigure[];
  regions: { region: string; count: number }[];
  categories: { category: string; count: number }[];
  decades: { decade: number; count: number }[];
  prev_era: EraNeighbor | null;
  next_era: EraNeighbor | null;
}

/** Summary for the eras directory page. */
export interface EraSummary {
  slug: EraSlug;
  name: string;
  year_min: number;
  year_max: number;
  description: string;
  event_count: number;
  top_event: {
    slug: string;
    title: string;
    year_approx: number;
    importance_score: number;
  } | null;
}

/** Response from GET /api/era (list all eras). */
export interface EraListResponse {
  eras: EraSummary[];
}

/** Era color scheme — accent color and subtle background. */
export interface EraColorScheme {
  accent: string;
  bg: string;
}

/** Color palette per era. */
export const ERA_COLORS: Record<EraSlug, EraColorScheme> = {
  ancient:        { accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
  classical:      { accent: '#3b82f6', bg: 'rgba(59,130,246,0.06)' },
  medieval:       { accent: '#a855f7', bg: 'rgba(168,85,247,0.06)' },
  'early-modern': { accent: '#14b8a6', bg: 'rgba(20,184,166,0.06)' },
  modern:         { accent: '#ef4444', bg: 'rgba(239,68,68,0.06)' },
  contemporary:   { accent: '#22c55e', bg: 'rgba(34,197,94,0.06)' },
};
