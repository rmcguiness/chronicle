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
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import EventDetailPage from './pages/EventDetailPage';

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
 * Full-screen canvas timeline view (the original Chronicle experience).
 * Extracted as a named component so React Router can swap it cleanly.
 */
function TimelineView() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Background canvas (map + events) */}
      <Canvas />

      {/* Top search bar */}
      <SearchBar />

      {/* Category legend (top-left) */}
      <CategoryLegend />

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* Bottom timeline scrubber */}
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
        <Route path="/" element={<TimelineView />} />
        <Route path="/event/:slug" element={<EventDetailPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
