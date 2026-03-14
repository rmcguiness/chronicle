/** Types for the /api/stats/full response. */

export interface EventRecord {
  slug: string;
  title: string;
  year_approx: number | null;
  value: number;
}

export interface PersonRecord {
  name: string;
  value: number;
}

export interface CountItem {
  label: string;
  count: number;
}

export interface GraphMetrics {
  total_events: number;
  total_links: number;
  total_people: number;
  avg_links_per_event: number;
  network_density: number;
  most_connected_event: EventRecord | null;
  longest_chain: number;
  most_isolated_era: string | null;
  top_connected_events: EventRecord[];
}

export interface CoverageStats {
  by_era: CountItem[];
  by_region: CountItem[];
  by_category: CountItem[];
  most_represented_decade: string | null;
  most_represented_decade_count: number;
  most_represented_century: string | null;
  year_with_most_events: number | null;
  year_with_most_events_count: number;
  decade_heatmap: CountItem[];
  largest_gap_years: number;
}

export interface PeopleStats {
  most_connected_person: PersonRecord | null;
  longest_lifespan_person: PersonRecord | null;
  era_with_most_people: string | null;
}

export interface CuriosityStats {
  earliest_year: number | null;
  earliest_event_title: string | null;
  latest_year: number | null;
  latest_event_title: string | null;
  total_years_covered: number;
  avg_importance: number;
  major_event_pct: number;
  highest_importance_event: EventRecord | null;
}

export interface FullStats {
  graph: GraphMetrics;
  coverage: CoverageStats;
  people: PeopleStats;
  curiosity: CuriosityStats;
}
