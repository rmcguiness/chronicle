/**
 * SpaceView: the 3D "outer space" view of Chronicle (desktop, WebGL 2).
 *
 * Each event is a planet. X is time (left = older), and linked events sit close
 * together in Y/Z (positions precomputed by scripts/compute_space_layout.py).
 * Selecting a planet flies the camera to it and opens the existing EventDetailPanel.
 * Curated chains run as guided tours with Back and Next.
 *
 * Owns: loading the space model, selection ↔ camera flights, tours, the HUD.
 * Does NOT own: event detail content (EventDetailPanel), search (SearchBar).
 * The design is in docs/design/SPACE_VIEW.md.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { linkedEvents, type SpaceModel } from './spaceData';
import { loadSpaceModel, stressTotalFromUrl } from './loadSpaceModel';
import { SpaceEngine } from './scene/SpaceEngine';
import { FlightController } from './FlightController';
import SpaceRig, { type HudInfo } from './SpaceRig';
import { CONFIDENCE_LABELS, GLOW_BY_CONFIDENCE } from './scene/colors';
import { formatYearLabel } from './timeScale';
import './space.css';

interface TourState {
  tour: number;
  step: number;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export default function SpaceView({ onSwitchTo2D }: { onSwitchTo2D: () => void }) {
  const stress = useMemo(() => (typeof window !== 'undefined' ? stressTotalFromUrl(window.location.search) : 0), []);
  const { data: model, error } = useQuery({
    queryKey: ['space-model', stress],
    queryFn: () => loadSpaceModel(stress),
    staleTime: Infinity,
  });

  if (error) {
    return (
      <div className="space-root space-message" role="alert">
        <p>The 3D view could not load its data ({String((error as Error).message)}).</p>
        <button type="button" className="space-button" onClick={onSwitchTo2D}>
          Open the 2D view
        </button>
      </div>
    );
  }
  if (!model) {
    return (
      <div className="space-root space-message" aria-busy="true">
        <p>Loading the 3D view…</p>
      </div>
    );
  }
  return <SpaceScene model={model} onSwitchTo2D={onSwitchTo2D} />;
}

function SpaceScene({ model, onSwitchTo2D }: { model: SpaceModel; onSwitchTo2D: () => void }) {
  const selectedSlug = useAppStore((s) => s.selectedEventSlug);
  const panelOpen = useAppStore((s) => s.detailPanelOpen);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const runtime = useMemo(() => ({ engine: new SpaceEngine(model), flight: new FlightController() }), [model]);
  const { engine, flight } = runtime;
  const yearEl = useRef<HTMLSpanElement>(null);
  const eraEl = useRef<HTMLSpanElement>(null);
  const rangeEl = useRef<HTMLDivElement>(null);
  const fpsEl = useRef<HTMLDivElement>(null);
  const [overviewNonce, setOverviewNonce] = useState(0);
  const flyOverview = useCallback(() => setOverviewNonce((n) => n + 1), []);
  // The frame loop updates the year readout directly, without a React render per frame.
  const onHud = useCallback((info: HudInfo) => {
    if (yearEl.current) yearEl.current.textContent = info.year;
    if (eraEl.current) eraEl.current.textContent = info.era;
    if (rangeEl.current) rangeEl.current.textContent = info.range;
  }, []);
  const onFps = useCallback((text: string) => {
    if (fpsEl.current) fpsEl.current.textContent = text;
  }, []);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tourState, setTourState] = useState<TourState | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  const showFps = useMemo(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fps'), []);

  const selected = selectedSlug ? (model.indexBySlug.get(selectedSlug) ?? null) : null;
  const tour = tourState ? model.tours[tourState.tour] : null;
  const tourSteps = tour?.steps ?? null;

  useEffect(() => () => engine.dispose(), [engine]);
  useEffect(() => flight.setReducedMotion(prefersReducedMotion()), [flight]);

  useEffect(() => {
    engine.setFocus({ selected, hovered, tour: tourSteps });
  }, [engine, selected, hovered, tourSteps]);

  // Every new selection (click, search, panel link, permalink, tour step) flies the camera there.
  useEffect(() => {
    if (selected === null) return;
    flight.request({ kind: 'event', position: engine.position(selected, new THREE.Vector3()), radius: model.radius[selected] });
  }, [selected, engine, flight, model]);

  const pick = useCallback((i: number) => setSelectedEvent(model.events[i].slug), [model, setSelectedEvent]);

  const goToStep = useCallback(
    (tourIndex: number, step: number) => {
      const t = model.tours[tourIndex];
      if (!t) return;
      const s = Math.max(0, Math.min(step, t.steps.length - 1));
      setTourState({ tour: tourIndex, step: s });
      setSelectedEvent(model.events[t.steps[s]].slug);
    },
    [model, setSelectedEvent],
  );

  const exitTour = useCallback(() => setTourState(null), []);

  // Tour and selection keys. Movement keys live in SpaceRig.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (tourState && (e.key === ']' || e.key === 'n' || e.key === 'PageDown')) {
        e.preventDefault();
        goToStep(tourState.tour, tourState.step + 1);
      } else if (tourState && (e.key === '[' || e.key === 'p' || e.key === 'PageUp')) {
        e.preventDefault();
        goToStep(tourState.tour, tourState.step - 1);
      } else if ((e.key === '.' || e.key === ',') && selected !== null) {
        const linked = linkedEvents(model, selected);
        if (linked.length === 0) return;
        const x = model.positions[3 * selected];
        const later = linked.filter((i) => model.positions[3 * i] >= x);
        const earlier = linked.filter((i) => model.positions[3 * i] < x);
        const next = e.key === '.' ? (later[0] ?? linked[0]) : (earlier[0] ?? linked[0]);
        pick(next);
      } else if (e.key === 'Escape') {
        if (tourState) setTourState(null);
        else if (selected !== null) setSelectedEvent(null);
      } else if (e.key === 'h' || e.key === 'Home') {
        flyOverview();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tourState, goToStep, selected, model, pick, setSelectedEvent, flyOverview]);

  const selectedEvent = selected !== null ? model.events[selected] : null;
  const hoveredEvent = hovered !== null ? model.events[hovered] : null;
  const centerShift = panelOpen ? 'space-shifted' : '';

  return (
    <div className="space-root" style={{ cursor: hovered !== null ? 'pointer' : undefined }}>
      <Canvas
        className="space-canvas"
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
        camera={{ fov: 50, near: 0.5, far: 40000, position: [0, 0, 3000] }}
        onCreated={({ gl }) => gl.setClearColor('#000000')}
        aria-label="3D view of historical events. Drag to orbit, right-drag to pan, scroll to zoom, W A S D to fly."
        tabIndex={0}
      >
        <SpaceRig
          model={model}
          engine={engine}
          flight={flight}
          onHud={onHud}
          onFps={onFps}
          overviewNonce={overviewNonce}
          panelOpen={panelOpen}
          selected={selected}
          hovered={hovered}
          tour={tourSteps}
          onHover={setHovered}
          onPick={pick}
        />
      </Canvas>

      {/* Year at the centre of the view, on a hairline through the screen centre. */}
      <div className={`space-hairline ${centerShift}`} aria-hidden="true" />
      <div className={`space-year ${centerShift}`} aria-live="off">
        <div>
          <span ref={yearEl} className="space-year-value">
            —
          </span>
          <span ref={eraEl} className="space-year-era" />
        </div>
        <div ref={rangeEl} className="space-year-range" />
      </div>

      {/* Top-left: view switch, tours, legend. */}
      <div className="space-panel space-topleft">
        <div className="space-row">
          <button type="button" className="space-button" onClick={onSwitchTo2D} aria-label="Switch to the 2D view">
            2D view
          </button>
          <button type="button" className="space-button" onClick={flyOverview} aria-label="Fly out to see all events (H)">
            All of history
          </button>
        </div>
        <h2 className="space-heading">Guided tours</h2>
        <ul className="space-tours">
          {model.tours.map((t, k) => (
            <li key={t.slug}>
              <button
                type="button"
                className={`space-tour-button${tourState?.tour === k ? ' is-active' : ''}`}
                onClick={() => goToStep(k, 0)}
                aria-pressed={tourState?.tour === k}
              >
                {t.title}
                <span className="space-tour-meta">{t.steps.length} stops</span>
              </button>
            </li>
          ))}
        </ul>
        <h2 className="space-heading">Glow: best link rating</h2>
        <ul className="space-legend">
          {[3, 2, 1, 0].map((rank) => (
            <li key={rank}>
              <span className="space-swatch" style={{ background: GLOW_BY_CONFIDENCE[rank], boxShadow: `0 0 8px ${GLOW_BY_CONFIDENCE[rank]}` }} />
              {CONFIDENCE_LABELS[rank]}
            </li>
          ))}
        </ul>
        <p className="space-note">Planet size follows the number of links.</p>
      </div>

      {/* Tour controls. */}
      {tour && tourState ? (
        <div className={`space-panel space-tourbar ${centerShift}`} role="region" aria-label={`Tour: ${tour.title}`}>
          <div className="space-tourbar-title">{tour.title}</div>
          <div className="space-tourbar-step">
            Stop {tourState.step + 1} of {tour.steps.length}: {model.events[tour.steps[tourState.step]].title}
          </div>
          <div className="space-row">
            <button type="button" className="space-button" disabled={tourState.step === 0} onClick={() => goToStep(tourState.tour, tourState.step - 1)}>
              ← Back
            </button>
            <button
              type="button"
              className="space-button is-primary"
              disabled={tourState.step >= tour.steps.length - 1}
              onClick={() => goToStep(tourState.tour, tourState.step + 1)}
            >
              Next →
            </button>
            <button type="button" className="space-button" onClick={exitTour}>
              End tour
            </button>
          </div>
        </div>
      ) : null}

      {/* Hover card. */}
      {hoveredEvent && hovered !== selected ? (
        <div className="space-panel space-hover" aria-hidden="true">
          <strong>{hoveredEvent.title}</strong>
          <span>{hoveredEvent.date_display ?? formatYearLabel(hoveredEvent.year_approx)}</span>
        </div>
      ) : null}

      {/* Controls help. */}
      {showHelp ? (
        <div className="space-panel space-help">
          <button type="button" className="space-close" onClick={() => setShowHelp(false)} aria-label="Hide controls help">
            ×
          </button>
          <div>Drag to orbit · right-drag to pan · scroll to zoom</div>
          <div>W A S D or arrows to fly · Q/E down/up · Shift for speed</div>
          <div>Click a planet to fly there · , and . step through its links</div>
          <div>[ and ] step through a tour · H for all of history · Esc to clear</div>
        </div>
      ) : (
        <button type="button" className="space-button space-help-toggle" onClick={() => setShowHelp(true)}>
          Controls
        </button>
      )}

      {showFps ? <div ref={fpsEl} className="space-fps" /> : null}

      <div className="sr-only" aria-live="polite">
        {selectedEvent ? `Selected ${selectedEvent.title}, ${selectedEvent.date_display ?? formatYearLabel(selectedEvent.year_approx)}.` : ''}
        {tour && tourState ? ` Tour stop ${tourState.step + 1} of ${tour.steps.length}.` : ''}
      </div>
    </div>
  );
}
