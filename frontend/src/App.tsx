import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Canvas from './components/Canvas';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
