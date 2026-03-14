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
 *  /explore       → Magazine-style curated discovery page
 *  /stats         → Knowledge graph analytics
 */
import { Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkView from './components/NetworkView';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import OnThisDayPanel from './components/OnThisDayPanel';
import OnThisDayButton from './components/OnThisDayButton';
import EventDetailPage from './pages/EventDetailPage';
import AdminPage from './pages/AdminPage';
import StatsPage from './pages/StatsPage';
import ExplorePage from './pages/ExplorePage';
import { usePermalink } from './hooks/usePermalink';

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
function MainView() {
  // Activates hash ↔ store sync: read on mount, write on change, listen for hashchange
  usePermalink();

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

      {/* Top-right nav links */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 300,
        display: 'flex',
        gap: 6,
      }}>
        <Link
          to="/explore"
          style={{
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 500,
            color: '#cbd5e1',
            background: 'rgba(7, 14, 34, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Explore
        </Link>
        <Link
          to="/stats"
          style={{
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 500,
            color: '#cbd5e1',
            background: 'rgba(7, 14, 34, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          Stats
        </Link>
      </div>

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* On This Day slide-in panel */}
      <OnThisDayPanel />

      {/* Bottom timeline scrubber — shown in both timeline and network modes.
          In network mode it acts as a time-range filter for visible events. */}
      <TimelineScrubber />

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
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
