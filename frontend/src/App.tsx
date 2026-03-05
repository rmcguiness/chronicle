/**
 * App — root application component.
 *
 * Owns: React Query client, top-level routing.
 * Does NOT own: canvas state, event selection, individual page layout.
 *
 * Routes:
 *  /              → Canvas timeline view (existing map + panels)
 *  /event/:slug   → Full event detail page (DATA-03)
 */
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Canvas from './components/Canvas';
import NetworkView from './components/NetworkView';
import ViewToggle from './components/ViewToggle';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import OnThisDayPanel from './components/OnThisDayPanel';
import OnThisDayButton from './components/OnThisDayButton';
import EventDetailPage from './pages/EventDetailPage';
import AdminPage from './pages/AdminPage';
import { usePermalink } from './hooks/usePermalink';
import { useAppStore } from './store';

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
 * Full-screen main view — switches between Timeline (canvas) and Network
 * (force-directed graph) based on the Zustand viewMode state.
 * Mounts `usePermalink` to enable shareable URL hash links.
 */
function MainView() {
  const viewMode = useAppStore((s) => s.viewMode);

  // Activates hash ↔ store sync: read on mount, write on change, listen for hashchange
  usePermalink();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Background canvas or network graph */}
      {viewMode === 'timeline' ? <Canvas /> : <NetworkView />}

      {/* View mode toggle (top-right) */}
      <ViewToggle />

      {/* Top search bar */}
      <SearchBar />

      {/* Category legend (top-left) */}
      <CategoryLegend />

      {/* On This Day button (toolbar) */}
      <OnThisDayButton />

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* On This Day slide-in panel */}
      <OnThisDayPanel />

      {/* Bottom timeline scrubber — only shown in timeline mode */}
      {viewMode === 'timeline' && <TimelineScrubber />}

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
