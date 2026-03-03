import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Canvas from './components/Canvas';
import SearchBar from './components/SearchBar';
import DetailPanel from './components/DetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';

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
        <DetailPanel />

        {/* Bottom timeline scrubber */}
        <TimelineScrubber />
      </div>
    </QueryClientProvider>
  );
}
