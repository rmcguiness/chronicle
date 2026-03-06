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
import { useState, useCallback, useRef, useMemo } from 'react';
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
import ShortcutsHelpModal from './components/ShortcutsHelpModal';
import EventDetailPage from './pages/EventDetailPage';
import AdminPage from './pages/AdminPage';
import { usePermalink } from './hooks/usePermalink';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { KeyboardShortcutHandlers } from './hooks/useKeyboardShortcuts';
import { useAppStore } from './store';
import { fetchHighImportanceEvents } from './api/client';
import type { HistoricalEvent } from './types';
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

/** Minimum importance threshold for the "random event" shortcut. */
const RANDOM_EVENT_MIN_IMPORTANCE = 0.8;

/**
 * Full-screen main view — renders the network graph with all overlaid UI panels.
 * Mounts `usePermalink` to enable shareable URL hash links.
 */
function MainView() {
  // Activates hash ↔ store sync: read on mount, write on change, listen for hashchange
  usePermalink();

  const [helpOpen, setHelpOpen] = useState(false);
  const [focusHint, setFocusHint] = useState(false);

  // Store accessors for escape-layer logic
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const searchOpen = useAppStore((s) => s.searchOpen);
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);
  const setDetailPanelOpen = useAppStore((s) => s.setDetailPanelOpen);
  const onThisDayOpen = useAppStore((s) => s.onThisDayOpen);
  const setOnThisDayOpen = useAppStore((s) => s.setOnThisDayOpen);
  const setPendingRfViewport = useAppStore((s) => s.setPendingRfViewport);
  const timeViewport = useAppStore((s) => s.timeViewport);

  // Ref to prevent duplicate random-event fetches while one is in flight
  const randomFetchingRef = useRef(false);

  // ── Keyboard shortcut handlers ──────────────────────────────────────────

  const handleSearch = useCallback(() => {
    setSearchOpen(true);
    // Focus the search input after React re-renders
    requestAnimationFrame(() => {
      const input = document.querySelector<HTMLInputElement>(
        'input[type="text"][placeholder*="Search"]',
      );
      input?.focus();
    });
  }, [setSearchOpen]);

  const handleEscape = useCallback(() => {
    // Priority order: help modal → search → detail panel → on-this-day → focus hint
    if (helpOpen) {
      setHelpOpen(false);
      return;
    }
    // If an input is focused, just blur it
    const active = document.activeElement as HTMLElement | null;
    if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') {
      active.blur();
      return;
    }
    if (searchOpen) {
      setSearchOpen(false);
      return;
    }
    if (detailPanelOpen) {
      setDetailPanelOpen(false);
      return;
    }
    if (onThisDayOpen) {
      setOnThisDayOpen(false);
      return;
    }
    if (focusHint) {
      setFocusHint(false);
    }
  }, [helpOpen, searchOpen, detailPanelOpen, onThisDayOpen, focusHint, setSearchOpen, setDetailPanelOpen, setOnThisDayOpen]);

  const handleRandom = useCallback(async () => {
    if (randomFetchingRef.current) return;
    randomFetchingRef.current = true;

    try {
      const events: HistoricalEvent[] = await fetchHighImportanceEvents(
        RANDOM_EVENT_MIN_IMPORTANCE,
        50,
      );
      if (events.length === 0) return;

      const event = events[Math.floor(Math.random() * events.length)];

      // Compute the canvas X position for this event
      const span = timeViewport.yearMax - timeViewport.yearMin;
      const canvasX =
        span > 0
          ? ((event.year_approx - timeViewport.yearMin) / span) * CANVAS_CONSTANTS.CANVAS_WIDTH
          : 0;

      // Pan the ReactFlow viewport to center on the event
      // setCenter is not directly available here, so use pendingRfViewport
      // with a zoom of 1.5 and centering math (screen center = 50vw, 50vh)
      const zoom = 1.5;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      setPendingRfViewport({
        x: screenW / 2 - canvasX * zoom,
        y: screenH / 2, // center vertically (event Y ~0 on spine)
        zoom,
      });
    } finally {
      randomFetchingRef.current = false;
    }
  }, [timeViewport, setPendingRfViewport]);

  const handleHelp = useCallback(() => {
    setHelpOpen((prev) => !prev);
  }, []);

  const handleFocus = useCallback(() => {
    setFocusHint((prev) => !prev);
  }, []);

  const handlers: KeyboardShortcutHandlers = useMemo(
    () => ({
      onSearch: handleSearch,
      onEscape: handleEscape,
      onRandom: handleRandom,
      onHelp: handleHelp,
      onFocus: handleFocus,
    }),
    [handleSearch, handleEscape, handleRandom, handleHelp, handleFocus],
  );

  useKeyboardShortcuts(handlers);

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

      {/* Right detail panel (slides in on event click) */}
      <EventDetailPanel />

      {/* On This Day slide-in panel */}
      <OnThisDayPanel />

      {/* Bottom timeline scrubber — shown in both timeline and network modes.
          In network mode it acts as a time-range filter for visible events. */}
      <TimelineScrubber />

      {/* Welcome overlay — shown on first load each session */}
      <WelcomeOverlay />

      {/* Keyboard shortcuts help modal */}
      <ShortcutsHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Focus-mode hint in status bar */}
      {focusHint && (
        <div
          style={{
            position: 'fixed',
            bottom: 110,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 16px',
            borderRadius: 8,
            backgroundColor: 'rgba(7, 14, 34, 0.92)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            color: '#94a3b8',
            fontSize: 12,
            zIndex: 50,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Focus mode: click a node to view its ego-graph. Press <kbd style={{ color: '#e0e7ff', fontFamily: 'monospace' }}>F</kbd> to dismiss.
        </div>
      )}

      {/* ? icon button for discoverability (top-right) */}
      <button
        onClick={() => setHelpOpen(true)}
        aria-label="Keyboard shortcuts"
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 300,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: 'rgba(7, 14, 34, 0.85)',
          backdropFilter: 'blur(12px)',
          color: '#64748b',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(96, 165, 250, 0.5)';
          (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.12)';
          (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
        }}
      >
        ?
      </button>
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
