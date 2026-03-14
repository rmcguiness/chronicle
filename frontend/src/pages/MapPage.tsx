/**
 * MapPage — World map view for geographic exploration of historical events.
 *
 * Renders a Leaflet map with event markers colored by category. At low zoom
 * levels, events are clustered server-side into centroid markers. Includes a
 * sidebar listing viewport events and a filter bar for category/era/importance.
 *
 * Route: /map
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

// ── Constants ───────────────────────────────────────────────────────────────

/** Default map center: 20°N, 10°E (roughly centered on the Old World). */
const DEFAULT_CENTER: [number, number] = [20, 10];

/** Default zoom level showing most of the world. */
const DEFAULT_ZOOM = 3;

/** Width of the sidebar in pixels. */
const SIDEBAR_WIDTH = 320;

/** Cluster marker fill color. */
const CLUSTER_COLOR = '#6b7280';

/** Tile layer URL (OpenStreetMap). */
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

/** Tile layer attribution. */
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Debounce delay (ms) for map move events before fetching. */
const FETCH_DEBOUNCE_MS = 300;

/** Individual marker radius in pixels. */
const MARKER_RADIUS = 7;

/** Minimum cluster marker radius. */
const CLUSTER_MIN_RADIUS = 14;

/** Scale factor for cluster marker radius based on count. */
const CLUSTER_RADIUS_SCALE = 3;

// ── Types ───────────────────────────────────────────────────────────────────

interface MapEvent {
  slug: string;
  title: string;
  year_approx: number | null;
  lat: number;
  lng: number;
  category: string | null;
  importance_score: number | null;
  geo_modern: string | null;
}

interface ClusterPoint {
  lat: number;
  lng: number;
  count: number;
}

interface MapResponse {
  clustered: boolean;
  events: MapEvent[];
  clusters: ClusterPoint[];
}

type EraKey = 'ancient' | 'medieval' | 'early_modern' | 'modern' | 'contemporary';

const ERA_OPTIONS: { value: EraKey | ''; label: string }[] = [
  { value: '', label: 'All Eras' },
  { value: 'ancient', label: 'Ancient (–10000–500)' },
  { value: 'medieval', label: 'Medieval (500–1500)' },
  { value: 'early_modern', label: 'Early Modern (1500–1800)' },
  { value: 'modern', label: 'Modern (1800–1945)' },
  { value: 'contemporary', label: 'Contemporary (1945–)' },
];

/** All known frontend categories. */
const ALL_CATEGORIES: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

/**
 * Map backend categories (military, religious, etc.) to frontend EventCategory.
 * Categories that don't map directly get a fallback.
 */
function mapCategory(raw: string | null): EventCategory {
  if (!raw) return 'political';
  const map: Record<string, EventCategory> = {
    war: 'war',
    military: 'war',
    discovery: 'discovery',
    scientific: 'discovery',
    technological: 'discovery',
    political: 'political',
    economic: 'political',
    social: 'political',
    cultural: 'cultural',
    religious: 'cultural',
    natural: 'natural',
    disaster: 'natural',
    person: 'person',
  };
  return map[raw] ?? 'political';
}

// ── MapEventHandler ─────────────────────────────────────────────────────────

interface MapEventHandlerProps {
  onBoundsChange: (bbox: string, zoom: number) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
}

/**
 * Internal component that listens to Leaflet map events and reports
 * bounding box + zoom changes to the parent.
 */
function MapEventHandler({ onBoundsChange, mapRef }: MapEventHandlerProps) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ].join(',');
      onBoundsChange(bbox, map.getZoom());
    },
    zoomend: () => {
      const bounds = map.getBounds();
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ].join(',');
      onBoundsChange(bbox, map.getZoom());
    },
  });

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  // Trigger initial load
  useEffect(() => {
    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(',');
    onBoundsChange(bbox, map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ── MapPage ─────────────────────────────────────────────────────────────────

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<LeafletMap | null>(null);

  // Data state
  const [data, setData] = useState<MapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(
    new Set(ALL_CATEGORIES)
  );
  const [era, setEra] = useState<EraKey | ''>('');
  const [minImportance, setMinImportance] = useState(0);

  // Current bbox/zoom for refetching on filter change
  const currentBbox = useRef('-180,-90,180,90');
  const currentZoom = useRef(DEFAULT_ZOOM);

  // Debounce timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fetch map events from the API.
   */
  const fetchEvents = useCallback(
    async (bbox: string, zoom: number) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          bbox,
          zoom: String(zoom),
          min_importance: String(minImportance / 100),
        });
        if (era) params.set('era', era);
        // Category filter: if not all selected, pick first (API supports single)
        // For multi-select, we filter client-side
        const res = await fetch(`/api/map/events?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: MapResponse = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    },
    [era, minImportance]
  );

  /** Handle map bounds/zoom change with debounce. */
  const handleBoundsChange = useCallback(
    (bbox: string, zoom: number) => {
      currentBbox.current = bbox;
      currentZoom.current = zoom;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchEvents(bbox, zoom);
      }, FETCH_DEBOUNCE_MS);
    },
    [fetchEvents]
  );

  // Refetch when filters change
  useEffect(() => {
    fetchEvents(currentBbox.current, currentZoom.current);
  }, [fetchEvents]);

  /** Filter events by selected categories (client-side). */
  const filteredEvents = useMemo(() => {
    if (!data || data.clustered) return [];
    return data.events.filter((e) => selectedCategories.has(mapCategory(e.category)));
  }, [data, selectedCategories]);

  /** Sidebar events sorted by importance. */
  const sidebarEvents = useMemo(
    () => [...filteredEvents].sort((a, b) => (b.importance_score ?? 0) - (a.importance_score ?? 0)),
    [filteredEvents]
  );

  /** Toggle a category in the filter. */
  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  /** Pan map to an event and open context (used by sidebar). */
  const focusEvent = (evt: MapEvent) => {
    if (mapRef.current) {
      mapRef.current.setView([evt.lat, evt.lng], Math.max(currentZoom.current, 6), {
        animate: true,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav style={styles.navbar}>
        <Link to="/" style={styles.navLink}>← Timeline</Link>
        <span style={styles.navTitle}>🗺️ World Map</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/people" style={styles.navLink}>People</Link>
          <Link to="/collections" style={styles.navLink}>Collections</Link>
          <Link to="/on-this-day" style={styles.navLink}>On This Day</Link>
        </div>
      </nav>

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <div style={styles.filterBar}>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {ALL_CATEGORIES.map((cat) => {
            const active = selectedCategories.has(cat);
            const color = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  ...styles.chip,
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.2)'}`,
                  backgroundColor: active ? `${color}33` : 'rgba(255,255,255,0.05)',
                  color: active ? color : 'rgba(255,255,255,0.5)',
                }}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Era dropdown */}
        <select
          value={era}
          onChange={(e) => setEra(e.target.value as EraKey | '')}
          style={styles.select}
        >
          {ERA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Importance slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Importance</span>
          <input
            type="range"
            min={0}
            max={100}
            value={minImportance}
            onChange={(e) => setMinImportance(Number(e.target.value))}
            style={{ width: 100 }}
          />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, minWidth: 28 }}>
            {minImportance}%
          </span>
        </div>
      </div>

      {/* ── Main content (map + sidebar) ────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ width: '100%', height: '100%' }}
            minZoom={2}
            maxZoom={18}
          >
            <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
            <MapEventHandler onBoundsChange={handleBoundsChange} mapRef={mapRef} />

            {/* Cluster markers */}
            {data?.clustered &&
              data.clusters.map((c, i) => (
                <CircleMarker
                  key={`cluster-${i}`}
                  center={[c.lat, c.lng]}
                  radius={Math.min(CLUSTER_MIN_RADIUS + Math.sqrt(c.count) * CLUSTER_RADIUS_SCALE, 40)}
                  pathOptions={{ color: CLUSTER_COLOR, fillColor: CLUSTER_COLOR, fillOpacity: 0.6 }}
                  eventHandlers={{
                    click: () => {
                      mapRef.current?.setView([c.lat, c.lng], currentZoom.current + 2, { animate: true });
                    },
                  }}
                >
                  <Popup>
                    <strong>{c.count} events</strong>
                    <br />
                    <em>Zoom in to explore</em>
                  </Popup>
                </CircleMarker>
              ))}

            {/* Individual event markers */}
            {!data?.clustered &&
              filteredEvents.map((evt) => {
                const cat = mapCategory(evt.category);
                const color = CATEGORY_COLORS[cat] ?? '#6b7280';
                return (
                  <CircleMarker
                    key={evt.slug}
                    center={[evt.lat, evt.lng]}
                    radius={MARKER_RADIUS}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.8, weight: 1 }}
                  >
                    <Popup>
                      <div style={{ minWidth: 180, fontFamily: "'Inter', sans-serif" }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                          {evt.title}
                        </div>
                        {evt.year_approx != null && (
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                            {evt.year_approx < 0 ? `${Math.abs(evt.year_approx)} BCE` : `${evt.year_approx} CE`}
                          </div>
                        )}
                        {evt.geo_modern && (
                          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                            📍 {evt.geo_modern}
                          </div>
                        )}
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 10,
                            backgroundColor: `${color}22`,
                            color,
                            border: `1px solid ${color}`,
                            marginBottom: 8,
                          }}
                        >
                          {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat] ?? evt.category}
                        </span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          <button
                            onClick={() => navigate(`/?event=${evt.slug}`)}
                            style={styles.popupLink}
                          >
                            View on Timeline →
                          </button>
                          <button
                            onClick={() => navigate(`/narrative/${evt.slug}`)}
                            style={styles.popupLink}
                          >
                            Read Narrative →
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
          </MapContainer>

          {/* Loading/error overlay */}
          {loading && (
            <div style={styles.overlay}>Loading…</div>
          )}
          {error && (
            <div style={{ ...styles.overlay, color: '#ef4444' }}>Error: {error}</div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={{ margin: 0, fontSize: 14 }}>
              Events in View
              {!data?.clustered && (
                <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>
                  ({filteredEvents.length})
                </span>
              )}
            </h3>
          </div>
          <div style={styles.sidebarList}>
            {data?.clustered ? (
              <div style={{ padding: 16, color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' }}>
                Zoom in to see individual events
              </div>
            ) : sidebarEvents.length === 0 ? (
              <div style={{ padding: 16, color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center' }}>
                No events in this area
              </div>
            ) : (
              sidebarEvents.map((evt) => {
                const cat = mapCategory(evt.category);
                const color = CATEGORY_COLORS[cat] ?? '#6b7280';
                return (
                  <button
                    key={evt.slug}
                    onClick={() => focusEvent(evt)}
                    style={styles.sidebarItem}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#fff', textAlign: 'left' }}>
                        {evt.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 16, marginTop: 2 }}>
                      {evt.year_approx != null
                        ? evt.year_approx < 0
                          ? `${Math.abs(evt.year_approx)} BCE`
                          : `${evt.year_approx} CE`
                        : ''}
                      {evt.geo_modern ? ` · ${evt.geo_modern}` : ''}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    backgroundColor: '#070e22',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    zIndex: 1000,
  },
  navLink: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: 13,
  },
  navTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '8px 16px',
    backgroundColor: '#0d1529',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    flexWrap: 'wrap' as const,
    zIndex: 999,
  },
  chip: {
    padding: '4px 10px',
    borderRadius: 16,
    fontSize: 12,
    cursor: 'pointer',
    background: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  select: {
    padding: '4px 8px',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    fontSize: 12,
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#070e22',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
  },
  sidebarList: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  sidebarItem: {
    display: 'block',
    width: '100%',
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottomStyle: 'solid' as const,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    textAlign: 'left' as const,
    fontFamily: "'Inter', sans-serif",
  },
  popupLink: {
    fontSize: 12,
    color: '#3b82f6',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Inter', sans-serif",
    textDecoration: 'underline',
  },
  overlay: {
    position: 'absolute' as const,
    top: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: 6,
    fontSize: 12,
    zIndex: 1000,
    pointerEvents: 'none' as const,
  },
};
