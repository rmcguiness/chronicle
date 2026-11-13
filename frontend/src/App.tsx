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
 *  /chain/:slug   → Shareable cause-and-effect chain
 *  /chains        → Index of chains
 */
import { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import NetworkView from './components/NetworkView';
import SearchBar from './components/SearchBar';
import EventDetailPanel from './components/EventDetailPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CategoryLegend from './components/CategoryLegend';
import WelcomeOverlay from './components/WelcomeOverlay';
import OnThisDayPanel from './components/OnThisDayPanel';
import OnThisDayButton from './components/OnThisDayButton';
import EventDetailPage from './pages/EventDetailPage';
import { ChainPage, ChainsIndexPage } from './pages/ChainPages';
import AdminPage from './pages/AdminPage';
import KoreanWarPage from './pages/KoreanWarPage';
import HistoryOfFilmPage from './pages/HistoryOfFilmPage';
import AgeOfSailPage from './pages/AgeOfSailPage';
import MedievalJapanPage from './pages/MedievalJapanPage';
import { usePermalink } from './hooks/usePermalink';
import DemoBanner, { DemoUnavailable } from './components/DemoBanner';
import { IS_DEMO_MODE } from './config/demo';
import ViewToggle from './components/ViewToggle';
import { chooseMainView, canUseSpaceView, readViewEnvironment, saveMainView, type MainViewKind } from './space/viewMode';

/** The 3D view (three.js) loads only when it is shown, so the 2D view and phones never download it. */
const SpaceView = lazy(() => import('./space/SpaceView'));

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

  // Desktop + WebGL 2 starts in the 3D space view; phones and ?view=2d keep the 2D network view.
  // The space view reads the demo snapshot, so API builds stay on 2D for now.
  const [env] = useState(() => readViewEnvironment(IS_DEMO_MODE));
  const [view, setView] = useState<MainViewKind>(() => chooseMainView(env));
  const spaceAvailable = canUseSpaceView(env);
  const switchView = (next: MainViewKind) => {
    saveMainView(next);
    setView(next);
  };
  const is3d = view === '3d';

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <a className="skip-link" href="#chronicle-search">
        Skip to search
      </a>
      <h1 className="sr-only">Chronicle — interactive timeline of historical events and their causes</h1>

      {is3d ? (
        <main aria-label="Events in 3D space">
          <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#000' }} aria-busy="true" />}>
            <SpaceView onSwitchTo2D={() => switchView('2d')} />
          </Suspense>
        </main>
      ) : (
        /* Network causality graph — the 2D view */
        <main aria-label="Event network">
          <NetworkView />
        </main>
      )}

      {/* Top search bar */}
      <SearchBar />

      {/* Category legend (top-left); the space view has its own legend */}
      {!is3d && <CategoryLegend />}

      {/* On This Day button (toolbar) */}
      <OnThisDayButton />

      {/* 2D ↔ 3D switch (top-right), only where the space view can run */}
      {spaceAvailable && !is3d && <ViewToggle onSwitch={() => switchView('3d')} />}

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* On This Day slide-in panel */}
      <OnThisDayPanel />

      {/* Bottom timeline scrubber for the 2D view; the space view shows the year on its own axis */}
      {!is3d && <TimelineScrubber />}

      {/* Welcome overlay — shown on first load each session (2D view) */}
      {!is3d && <WelcomeOverlay />}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Framer Motion honours the OS "reduce motion" setting app-wide */}
      <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/event/:slug" element={<EventDetailPage />} />
        <Route path="/chain/:slug" element={<ChainPage />} />
        <Route path="/chains" element={<ChainsIndexPage />} />
        <Route
          path="/admin"
          element={IS_DEMO_MODE ? <DemoUnavailable feature="Admin review" /> : <AdminPage />}
        />
        <Route path="/korean-war" element={<KoreanWarPage />} />
        <Route path="/history-of-film" element={<HistoryOfFilmPage />} />
        <Route path="/age-of-sail" element={<AgeOfSailPage />} />
        <Route path="/medieval-japan" element={<MedievalJapanPage />} />
      </Routes>
      {/* Demo-only notice (renders nothing in normal builds) */}
      <DemoBanner />
      </MotionConfig>
    </QueryClientProvider>
  );
}
