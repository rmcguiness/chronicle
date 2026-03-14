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
import NetworkView from './components/NetworkView';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import OnThisDayPanel from './components/OnThisDayPanel';
import OnThisDayButton from './components/OnThisDayButton';
import EventDetailPage from './pages/EventDetailPage';
import FeaturedPage from './pages/FeaturedPage';
import CountriesPage from './pages/CountriesPage';
import CountryDetailPage from './pages/CountryDetailPage';
import AdminPage from './pages/AdminPage';
import { usePermalink } from './hooks/usePermalink';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Network causality graph — the primary view */}
      <NetworkView />

      {/* Top search bar */}
      <SearchBar />

      {/* Featured nav button (top-right) */}
      <button
        onClick={() => navigate('/featured')}
        style={{
          position: 'fixed', top: 20, right: 20, zIndex: 300,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          backgroundColor: 'rgba(7,14,34,0.9)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(96,165,250,0.25)', color: '#94a3b8',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
          fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)'; e.currentTarget.style.color = '#e2e8f0'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        Featured
      </button>

      {/* Category legend (top-left) */}
      <CategoryLegend />

      {/* On This Day button (toolbar) */}
      <OnThisDayButton />

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
        <Route path="/featured" element={<FeaturedPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
