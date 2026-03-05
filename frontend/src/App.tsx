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
import AdminPage from './pages/AdminPage';
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
 * Full-screen canvas timeline view (the original Chronicle experience).
 * Extracted as a named component so React Router can swap it cleanly.
 *
 * Mounts `usePermalink` to enable shareable URL hash links that encode
 * the current viewport state, selected event, and region visibility.
 */
function TimelineView() {
  // Activates hash ↔ store sync: read on mount, write on change, listen for hashchange
  usePermalink();

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      {/* Background canvas (map + events) — also renders the Share + Bookmarks toolbar */}
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
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
