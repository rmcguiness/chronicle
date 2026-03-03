// Core data types for Chronicle frontend

export type EventCategory =
  | 'war'
  | 'discovery'
  | 'political'
  | 'cultural'
  | 'natural'
  | 'person';

export type ConnectionType = 'causes' | 'leads_to' | 'enables' | 'context';

export type SourceType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'journalistic'
  | 'oral'
  | 'artifact';

export type PerspectiveType =
  | 'government'
  | 'civilian'
  | 'foreign'
  | 'academic'
  | 'nationalist'
  | 'colonial'
  | 'indigenous'
  | 'religious'
  | 'journalistic';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface HistoricalEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  date_display?: string;
  lat: number;
  lng: number;
  geo_modern?: string;
  geo_era_label?: string;
  category: EventCategory;
  importance_score: number;
  tags?: string[];
  perspective_count?: number;
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  publication?: string;
  publication_date?: string;
  source_type: SourceType;
  reliability_tier?: number;
  peer_reviewed?: boolean;
  quote?: string;
  original_url?: string;
  archive_url?: string;
  ipfs_cid?: string;
}

export interface Perspective {
  id: string;
  label: string;
  perspective_type: PerspectiveType;
  culture_code?: string;
  viewpoint_type?: string;
  summary: string;
  narrative: string;
  evidence_score: number;
  evidence_factors?: Record<string, number>;
  community_score?: number;
  upvotes?: number;
  downvotes?: number;
  sources: Source[];
}

export interface EventDetail extends HistoricalEvent {
  perspectives: Perspective[];
  connected_events: ConnectedEvent[];
}

export interface ConnectedEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  connection_type: ConnectionType;
  direction: 'cause' | 'effect';
  strength?: number;
  description?: string;
}

export interface CausalityLink {
  id: string;
  cause_event_id: string;
  effect_event_id: string;
  connection_type: ConnectionType;
  strength: number;
  description?: string;
}

export interface CanvasViewport {
  year_min: number;
  year_max: number;
  lat_min: number;
  lat_max: number;
  zoom: number;
}

export interface TileResponse {
  events: HistoricalEvent[];
  links: CausalityLink[];
  computed_at: string;
}

export interface SearchResult {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  geo_modern?: string;
  category: EventCategory;
  importance_score: number;
  lat: number;
  lng: number;
}

export interface CanvasTransform {
  x: number;
  y: number;
  zoom: number;
}

// ─── Region / swim-lane types ────────────────────────────────────────────────

export type Region = 'europe' | 'americas' | 'asia' | 'middle_east_africa' | 'global';

export const REGIONS: { id: Region; label: string }[] = [
  { id: 'europe', label: 'Europe' },
  { id: 'americas', label: 'Americas' },
  { id: 'asia', label: 'Asia' },
  { id: 'middle_east_africa', label: 'Middle East & Africa' },
  { id: 'global', label: 'Global / Multi-region' },
];

// Canvas coordinate helpers
export const CANVAS_CONSTANTS = {
  // Time axis: pixels per year at zoom 1
  // At zoom=0.1 (default), effective = 1px/year → 1920px screen = 1920 years visible
  PIXELS_PER_YEAR: 10,
  // Full history range
  BASE_YEAR_MIN: -5000,
  BASE_YEAR_MAX: 2100,
  // Region swim-lane layout
  BAND_HEIGHT: 200,
  BAND_COUNT: 5,
  // Canvas height = BAND_COUNT * BAND_HEIGHT
  CANVAS_HEIGHT: 1000,
  // Legacy lat bounds (used by store coordinate helpers)
  LAT_MIN: -60,
  LAT_MAX: 75,
};
