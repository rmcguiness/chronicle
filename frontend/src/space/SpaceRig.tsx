/**
 * SpaceRig: everything inside the <Canvas> that runs per frame.
 *
 * Owns: camera controls, flights, keyboard flying, the engine's frame upkeep,
 * picking (hover and click), in-scene labels and the year readout in the HUD.
 * Does NOT own: selection or tour state (SpaceView), panel content (EventDetailPanel).
 */
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { CameraControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SpaceModel } from './spaceData';
import type { SpaceEngine } from './scene/SpaceEngine';
import type { FlightController } from './FlightController';
import { formatYearLabel, xToYear, yearToX } from './timeScale';
import { overviewView } from './scene/overview';

/** Panel width in EventDetailPanel.tsx; the view centre shifts left by half of it while the panel is open. */
const PANEL_WIDTH = 480;
const LABEL_REFRESH_FRAMES = 12;
const MAX_NEARBY_LABELS = 7;
const TOUR_LABEL_DISTANCE = 340;

/** What the HUD shows; SpaceView writes it to the DOM without a React render. */
export interface HudInfo {
  year: string;
  era: string;
  range: string;
}

interface Props {
  model: SpaceModel;
  engine: SpaceEngine;
  flight: FlightController;
  /** Called when the year readout changes. */
  onHud: (info: HudInfo) => void;
  /** Called about twice a second with a frame-rate line. */
  onFps: (text: string) => void;
  /** Bumped by SpaceView to fly out to the overview. */
  overviewNonce: number;
  panelOpen: boolean;
  selected: number | null;
  hovered: number | null;
  tour: number[] | null;
  onHover: (index: number | null) => void;
  onPick: (index: number) => void;
}

const MOVE_KEYS = new Set(['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift']);

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
}

function shortTitle(title: string): string {
  const t = title.split(' — ')[0];
  return t.length > 48 ? `${t.slice(0, 46)}…` : t;
}

export default function SpaceRig(props: Props) {
  const { model, engine, flight, onHud, onFps, overviewNonce, panelOpen, selected, hovered, tour, onHover, onPick } = props;
  const controls = useRef<CameraControls>(null);
  const keys = useRef(new Set<string>());
  const fpsCounter = useRef({ frames: 0, since: 0 });
  const lastHud = useRef('');
  const frameNo = useRef(0);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const raycaster = useThree((s) => s.raycaster);
  const [labels, setLabels] = useState<number[]>([]);
  const [ticks, setTicks] = useState<number[]>([]);
  const [tickOffset, setTickOffset] = useState(4);

  // Start on the overview of all events.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const v = overviewView(engine, model, camera.fov, size.width / Math.max(size.height, 1));
    c.setLookAt(v.position.x, v.position.y, v.position.z, v.target.x, v.target.y, v.target.z, false);
    // Only on first mount for this model.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, model]);

  useEffect(() => {
    if (overviewNonce === 0) return;
    const v = overviewView(engine, model, camera.fov, size.width / Math.max(size.height, 1));
    flight.request({ kind: 'view', position: v.position, target: v.target });
    // Only when the nonce changes, not on resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overviewNonce]);

  // Any drag, wheel or touch on the canvas cancels a flight in progress.
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => flight.cancel();
    c.addEventListener('controlstart', stop);
    return () => c.removeEventListener('controlstart', stop);
  }, [flight]);

  // Keyboard flying (WASD / arrows, Q/E down/up, Shift faster).
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (MOVE_KEYS.has(k)) {
        keys.current.add(k);
        if (k.startsWith('arrow')) e.preventDefault();
        flight.cancel();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => keys.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, [flight]);

  // Shift the projection centre left while the event panel covers the right side.
  useEffect(() => {
    const offset = panelOpen && size.width > PANEL_WIDTH * 2 ? PANEL_WIDTH / 2 : 0;
    if (offset) camera.setViewOffset(size.width, size.height, offset, 0, size.width, size.height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  }, [panelOpen, size, camera]);

  const pos = useRef(new THREE.Vector3());
  const tgt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const c = controls.current;
    if (!c) return;
    const now = state.clock.elapsedTime;

    // Flights.
    if (flight.pending) {
      c.getPosition(pos.current);
      c.getTarget(tgt.current);
      flight.begin(pos.current, tgt.current, now);
    }
    if (flight.active && flight.sample(now, pos.current, tgt.current)) {
      const p = pos.current, t = tgt.current;
      c.setLookAt(p.x, p.y, p.z, t.x, t.y, t.z, false);
    }

    // Keyboard flying, scaled to how far out the camera is.
    c.getTarget(tgt.current);
    const camDist = camera.position.distanceTo(tgt.current);
    const held = keys.current;
    if (held.size > 0) {
      const speed = Math.min(Math.max(camDist * 0.9, 25), 2500) * (held.has('shift') ? 3 : 1) * Math.min(delta, 0.05);
      const fwd = (held.has('w') || held.has('arrowup') ? 1 : 0) - (held.has('s') || held.has('arrowdown') ? 1 : 0);
      const side = (held.has('d') || held.has('arrowright') ? 1 : 0) - (held.has('a') || held.has('arrowleft') ? 1 : 0);
      const lift = (held.has('e') ? 1 : 0) - (held.has('q') ? 1 : 0);
      if (fwd) c.forward(fwd * speed, false);
      if (side) c.truck(side * speed, 0, false);
      if (lift) c.elevate(lift * speed, false);
    }

    // Picking tolerance for the glow points follows the zoom level.
    const pointsParams = raycaster.params.Points;
    if (pointsParams) setPointsThreshold(pointsParams, Math.max(camDist * 0.008, 1.2));

    // Reduced motion freezes the selected planet's pulse.
    engine.frame(camera, tgt.current, state.gl.domElement.height, flight.reducedMotion ? 0 : now);

    // HUD: the year at the focus point and the span in view.
    const year = xToYear(tgt.current.x, model.timeScale);
    const half = camDist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const y0 = xToYear(Math.max(tgt.current.x - half, engine.axisMinX), model.timeScale);
    const y1 = Math.min(xToYear(tgt.current.x + half, model.timeScale), 2100);
    const yearText = formatYearLabel(Math.min(year, 2100));
    const rangeText = `${formatYearLabel(y0)} – ${formatYearLabel(y1)} in view`;
    const key = yearText + rangeText;
    if (key !== lastHud.current) {
      lastHud.current = key;
      onHud({ year: yearText.replace(' BCE', ''), era: year < -0.5 ? 'BCE' : 'CE', range: rangeText });
    }
    const fc = fpsCounter.current;
    fc.frames++;
    if (now - fc.since >= 0.5) {
      onFps(`${Math.round(fc.frames / (now - fc.since))} fps · ${model.count} planets · ${engine.sphereCount} spheres`);
      fc.frames = 0;
      fc.since = now;
    }

    // Labels and tick text refresh a few times a second.
    if (frameNo.current++ % LABEL_REFRESH_FRAMES === 0) {
      const want = new Set<number>();
      if (selected !== null) want.add(selected);
      if (hovered !== null) want.add(hovered);
      // Tour stops get labels only when the camera is near them, so a long flight does not stack ten labels.
      tour?.forEach((i) => {
        if (camera.position.distanceTo(engine.position(i, pos.current)) < TOUR_LABEL_DISTANCE) want.add(i);
      });
      let added = 0;
      for (const i of engine.nearList) {
        if (added >= MAX_NEARBY_LABELS) break;
        if (i >= model.realCount || want.has(i)) continue;
        const d = camera.position.distanceTo(engine.position(i, pos.current));
        if (d > 260) break;
        if (model.degree[i] >= 2 || model.events[i].importance_score >= 0.85) {
          want.add(i);
          added++;
        }
      }
      const next = [...want];
      setLabels((prev) => (prev.length === next.length && prev.every((v, k) => v === next[k]) ? prev : next));
      const nextTicks = engine.ticks;
      setTicks((prev) => (prev.length === nextTicks.length && prev.every((v, k) => v === nextTicks[k]) ? prev : [...nextTicks]));
      const off = Math.round(Math.max(camDist * 0.03, 1.5) * 10) / 10;
      setTickOffset((prev) => (Math.abs(prev - off) / Math.max(prev, 0.1) > 0.15 ? off : prev));
    }
  });

  const pickIndex = (e: ThreeEvent<PointerEvent | MouseEvent>): number | null =>
    e.object === engine.glow ? engine.selectable(e.index) : engine.eventForInstance(e.object, e.instanceId);

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const i = pickIndex(e);
    if (i !== hovered) onHover(i);
  };
  const handleOut = () => onHover(null);
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 4) return; // a drag, not a click
    const i = pickIndex(e);
    if (i !== null) onPick(i);
  };

  return (
    <>
      <CameraControls ref={controls} makeDefault smoothTime={0.22} draggingSmoothTime={0.08} minDistance={3} maxDistance={12000} dollyToCursor />
      <primitive object={engine.group} />
      {/* Picking: spheres near the camera, glow points everywhere else. */}
      {engine.tiers.map((tier, k) => (
        <primitive key={k} object={tier.mesh} onPointerMove={handleMove} onPointerOut={handleOut} onClick={handleClick} />
      ))}
      <primitive object={engine.glow} onPointerMove={handleMove} onPointerOut={handleOut} onClick={handleClick} />
      {labels.map((i) => (
        <Html
          key={i}
          position={[model.positions[3 * i], model.positions[3 * i + 1] + model.radius[i] * 1.5, model.positions[3 * i + 2]]}
          center
          zIndexRange={[40, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`space-label${i === selected ? ' is-selected' : ''}${tour?.includes(i) ? ' is-tour' : ''}`}>
            {tour?.includes(i) ? <span className="space-label-step">{tour.indexOf(i) + 1}</span> : null}
            {shortTitle(model.events[i].title)}
            <span className="space-label-year">{model.events[i].date_display ?? formatYearLabel(model.events[i].year_approx)}</span>
          </div>
        </Html>
      ))}
      {ticks.map((year) => (
        <Html key={year} position={[yearToX(year, model.timeScale), -tickOffset, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div className="space-tick">{formatYearLabel(year)}</div>
        </Html>
      ))}
    </>
  );
}

/** Kept outside the component so the frame loop can tune the raycaster without mutating hook values inline. */
function setPointsThreshold(params: { threshold: number }, value: number): void {
  params.threshold = value;
}
