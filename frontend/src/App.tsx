/**
 * App — root application component.
 *
 * Owns: React Query client, top-level routing, TimelineScrubber placement.
 * Does NOT own: network view state, event selection, individual page layout.
 *
 * The TimelineScrubber acts as a time-range filter for visible event nodes
 * in the network view.
 *
 * Note: The original canvas-based timeline view has been archived to
 * src/archive/timeline/ in favour of the network view as the sole display.
 *
 * Routes:
 *  /              → Network view (force-directed causality graph)
 *  /event/:slug   → Full event detail page (DATA-03)
 */
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import NetworkView from './components/NetworkView';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import OnThisDayPanel from './components/OnThisDayPanel';
import OnThisDayButton from './components/OnThisDayButton';
import CompareButton from './components/CompareButton';
import ComparisonPanel from './components/ComparisonPanel';
import EventDetailPage from './pages/EventDetailPage';
import AdminPage from './pages/AdminPage';
import { usePermalink } from './hooks/usePermalink';
import { useAppStore } from './store';
import { fetchTiles, fetchAllCausalityLinks } from './api/client';
import { CANVAS_CONSTANTS } from './types';

/** React Query client — shared across both routes via context. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/**
 * Full-screen main view — renders the network graph with all overlaid UI panels.
 * Mounts `usePermalink` to enable shareable URL hash links.
 */
const FULL_VIEWPORT = {
  year_min: CANVAS_CONSTANTS.BASE_YEAR_MIN,
  year_max: CANVAS_CONSTANTS.BASE_YEAR_MAX,
  lat_min: -90,
  lat_max: 90,
  zoom: 10,
};

function MainView() {
  // Activates hash ↔ store sync: read on mount, write on change, listen for hashchange
  usePermalink();

  const compareMode = useAppStore((s) => s.compareMode);
  const compareEvents = useAppStore((s) => s.compareEvents);
  const setCompareMode = useAppStore((s) => s.setCompareMode);

  // Reuse the same tile/link queries as NetworkView (cached by React Query)
  const { data: tileData } = useQuery({
    queryKey: ['network-tiles'],
    queryFn: () => fetchTiles(FULL_VIEWPORT),
    staleTime: 5 * 60_000,
  });
  const { data: allLinks } = useQuery({
    queryKey: ['network-causality'],
    queryFn: fetchAllCausalityLinks,
    staleTime: 5 * 60_000,
  });

  const events = useMemo(() => tileData?.events ?? [], [tileData]);
  const links = useMemo(() => allLinks ?? tileData?.links ?? [], [allLinks, tileData]);

  const eventById = useMemo(() => {
    const map = new Map<string, (typeof events)[number]>();
    for (const e of events) map.set(String(e.id), e);
    return map;
  }, [events]);

  const compareA = compareEvents[0] ? eventById.get(compareEvents[0]) ?? null : null;
  const compareB = compareEvents[1] ? eventById.get(compareEvents[1]) ?? null : null;
  const showComparisonPanel = compareMode && compareA !== null && compareB !== null;

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Network causality graph — the primary view */}
      <NetworkView />

      {/* Top search bar */}
      <SearchBar />

      {/* Category legend (top-left) */}
      <CategoryLegend />

      {/* On This Day button (toolbar) */}
      <OnThisDayButton />

      {/* Compare button (toolbar) */}
      <CompareButton />

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* On This Day slide-in panel */}
      <OnThisDayPanel />

      {/* Bottom timeline scrubber — shown in both timeline and network modes.
          In network mode it acts as a time-range filter for visible events. */}
      <TimelineScrubber />

      {/* Comparison panel — slides up when two events are selected in compare mode */}
      {showComparisonPanel && (
        <ComparisonPanel
          eventA={compareA}
          eventB={compareB}
          edges={links}
          onClose={() => setCompareMode(false)}
        />
      )}

      {/* Welcome overlay — shown on first load each session */}
      <WelcomeOverlay />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/event/:slug" element={<EventDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
