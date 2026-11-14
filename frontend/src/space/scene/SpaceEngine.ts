/**
 * SpaceEngine: the three.js objects behind the space view, and their per-frame upkeep.
 *
 * Draw calls, whatever the event count:
 *   1. glow points: every planet as one additive point sprite (the far level of detail)
 *   2. planet spheres: two InstancedMeshes holding only the planets nearest the camera
 *      (a finer sphere for the closest few dozen, a coarser one for the rest)
 *   3. link lines: one LineSegments holding only the links near the focus or the selection
 *   4. the time axis, its year ticks and the "now" ring
 *
 * React owns none of this; SpaceView calls setFocus() when the selection or tour
 * changes and frame() once per frame. Keeping it in a class lets the frame loop
 * mutate buffers without going through React state.
 */
import * as THREE from 'three';
import type { SpaceModel } from '../spaceData';
import { CATEGORY_ORDER } from '../spaceData';
import { axisTicks, yearToX } from '../timeScale';
import { GLOW_BY_CONFIDENCE, GLOW_INTENSITY, LINK_BY_CONFIDENCE, PLANET_BODY } from './colors';
import { GLOW_FRAGMENT, GLOW_VERTEX, PLANET_FRAGMENT, PLANET_VERTEX } from './shaders';

/** Most planets drawn as spheres at once. */
export const NEAR_MAX = 500;
/** The closest this many spheres use the finer mesh. */
const NEAR_FINE = 64;
/** Planets closer than this to the camera are drawn as spheres. */
const NEAR_DISTANCE = 480;
/** Recompute the sphere set and ambient links every this many frames. */
const REFRESH_EVERY = 6;
/** Longest axis-tick list. */
const MAX_TICKS = 40;

export const STATE = { normal: 0, dim: 1, highlight: 2, selected: 3, hovered: 4 } as const;

export interface FocusState {
  selected: number | null;
  hovered: number | null;
  /** Event indices of the active tour, in order; null when no tour runs. */
  tour: number[] | null;
}

export class SpaceEngine {
  readonly group = new THREE.Group();
  readonly glow: THREE.Points;
  /** Sphere meshes, finest first. */
  readonly tiers: SphereTier[];
  readonly links: THREE.LineSegments;
  readonly axis: THREE.Group;
  /** Event indices currently drawn as spheres, nearest first. */
  nearList: number[] = [];
  /** Tick years currently on the axis. */
  ticks: number[] = [];
  /** Scene X range the axis covers. */
  readonly axisMinX: number;
  readonly axisMaxX: number;

  private readonly model: SpaceModel;
  private readonly states: Float32Array;
  private readonly glowState: THREE.BufferAttribute;
  private readonly glowColors: Float32Array;
  private readonly glowMaterial: THREE.ShaderMaterial;
  private readonly planetMaterial: THREE.ShaderMaterial;
  private readonly linkPositions: Float32Array;
  private readonly linkColors: Float32Array;
  private readonly tickGeometry: THREE.BufferGeometry;
  private readonly tickPositions: Float32Array;
  private readonly nowRing: THREE.LineLoop;
  private readonly highlightLinks = new Set<number>();
  private readonly tourLinks = new Set<number>();
  private focus: FocusState = { selected: null, hovered: null, tour: null };
  private frameNo = 0;
  private lastLinkTarget = new THREE.Vector3(Infinity, 0, 0);
  private lastLinkRadius = 0;
  private linksDirty = true;
  private tickKey = '';
  private readonly tmpMatrix = new THREE.Matrix4();
  private readonly tmpColor = new THREE.Color();

  constructor(model: SpaceModel) {
    this.model = model;
    const n = model.count;
    this.states = new Float32Array(n);

    // ── Glow points (all planets) ────────────────────────────────────────────
    const glowGeom = new THREE.BufferGeometry();
    glowGeom.setAttribute('position', new THREE.BufferAttribute(model.positions, 3));
    glowGeom.setAttribute('aSize', new THREE.BufferAttribute(model.radius, 1));
    this.glowColors = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const rank = model.confidence[i];
      this.tmpColor.set(GLOW_BY_CONFIDENCE[rank]).multiplyScalar(GLOW_INTENSITY[rank] * (i < model.realCount ? 1 : 0.6));
      this.glowColors.set([this.tmpColor.r, this.tmpColor.g, this.tmpColor.b], i * 3);
    }
    glowGeom.setAttribute('aGlow', new THREE.BufferAttribute(this.glowColors, 3));
    this.glowState = new THREE.BufferAttribute(this.states, 1);
    this.glowState.setUsage(THREE.DynamicDrawUsage);
    glowGeom.setAttribute('aState', this.glowState);
    glowGeom.computeBoundingSphere();
    this.glowMaterial = new THREE.ShaderMaterial({
      vertexShader: GLOW_VERTEX,
      fragmentShader: GLOW_FRAGMENT,
      uniforms: { uScale: { value: 500 }, uTime: { value: 0 }, uFadeNear: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.glow = new THREE.Points(glowGeom, this.glowMaterial);
    this.glow.frustumCulled = false;
    this.glow.renderOrder = 2;

    // ── Planet spheres (nearest NEAR_MAX only) ───────────────────────────────
    this.planetMaterial = new THREE.ShaderMaterial({
      vertexShader: PLANET_VERTEX,
      fragmentShader: PLANET_FRAGMENT,
      uniforms: { uFadeNear: { value: 0 } },
    });
    this.tiers = [
      new SphereTier(new THREE.IcosahedronGeometry(1, 3), this.planetMaterial, NEAR_FINE),
      new SphereTier(new THREE.IcosahedronGeometry(1, 2), this.planetMaterial, NEAR_MAX - NEAR_FINE),
    ];

    // ── Links (rebuilt on demand) ────────────────────────────────────────────
    const linkCount = model.linkA.length;
    this.linkPositions = new Float32Array(Math.max(linkCount, 1) * 6);
    this.linkColors = new Float32Array(Math.max(linkCount, 1) * 6);
    const linkGeom = new THREE.BufferGeometry();
    linkGeom.setAttribute('position', new THREE.BufferAttribute(this.linkPositions, 3).setUsage(THREE.DynamicDrawUsage));
    linkGeom.setAttribute('color', new THREE.BufferAttribute(this.linkColors, 3).setUsage(THREE.DynamicDrawUsage));
    linkGeom.setDrawRange(0, 0);
    this.links = new THREE.LineSegments(
      linkGeom,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.links.frustumCulled = false;
    this.links.renderOrder = 3;

    // ── Time axis ────────────────────────────────────────────────────────────
    let minX = 0;
    for (let i = 0; i < model.realCount; i++) minX = Math.min(minX, model.positions[3 * i]);
    this.axisMinX = minX - 150;
    this.axisMaxX = yearToX(2100, model.timeScale) + 30;
    this.axis = new THREE.Group();
    const axisLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(this.axisMinX, 0, 0), new THREE.Vector3(this.axisMaxX, 0, 0)]),
      new THREE.LineBasicMaterial({ color: '#4d6fa8', transparent: true, opacity: 0.75, depthWrite: false }),
    );
    this.tickPositions = new Float32Array(MAX_TICKS * 6);
    this.tickGeometry = new THREE.BufferGeometry();
    this.tickGeometry.setAttribute('position', new THREE.BufferAttribute(this.tickPositions, 3).setUsage(THREE.DynamicDrawUsage));
    this.tickGeometry.setDrawRange(0, 0);
    const tickLines = new THREE.LineSegments(
      this.tickGeometry,
      new THREE.LineBasicMaterial({ color: '#6f8fc8', transparent: true, opacity: 0.6, depthWrite: false }),
    );
    tickLines.frustumCulled = false;
    const ringPoints: THREE.Vector3[] = [];
    for (let k = 0; k < 96; k++) {
      const a = (k / 96) * Math.PI * 2;
      ringPoints.push(new THREE.Vector3(0, Math.cos(a), Math.sin(a)));
    }
    this.nowRing = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(ringPoints),
      new THREE.LineBasicMaterial({ color: '#6f8fc8', transparent: true, opacity: 0.22, depthWrite: false }),
    );
    this.axis.add(axisLine, tickLines, this.nowRing);

    // Planets and glow points are mounted separately by SpaceRig so they can take pointer events.
    this.group.add(this.links, this.axis);
    this.applyStates();
  }

  /** Update selection, hover and tour; dims everything outside the focus. */
  setFocus(focus: FocusState): void {
    this.focus = focus;
    const { selected, hovered, tour } = focus;
    const m = this.model;
    this.highlightLinks.clear();
    this.tourLinks.clear();
    const keep = new Set<number>();
    if (tour) {
      tour.forEach((i) => keep.add(i));
      for (let s = 0; s + 1 < tour.length; s++) {
        for (const k of m.linksOf[tour[s]] ?? []) {
          const other = m.linkA[k] === tour[s] ? m.linkB[k] : m.linkA[k];
          if (other === tour[s + 1]) this.tourLinks.add(k);
        }
      }
    }
    if (selected !== null) {
      keep.add(selected);
      for (const k of m.linksOf[selected] ?? []) {
        this.highlightLinks.add(k);
        keep.add(m.linkA[k]);
        keep.add(m.linkB[k]);
      }
    }
    const dimOthers = keep.size > 0;
    this.states.fill(dimOthers ? STATE.dim : STATE.normal);
    keep.forEach((i) => (this.states[i] = STATE.highlight));
    if (hovered !== null) this.states[hovered] = STATE.hovered;
    if (selected !== null) this.states[selected] = STATE.selected;
    this.applyStates();
    this.linksDirty = true;
  }

  private applyStates(): void {
    this.glowState.needsUpdate = true;
    for (const tier of this.tiers) {
      for (let k = 0; k < tier.mesh.count; k++) tier.state.setX(k, this.states[tier.index[k]]);
      tier.state.needsUpdate = true;
    }
  }

  /**
   * Per-frame upkeep.
   * @param camera   the rendering camera
   * @param target   the orbit target (focus point)
   * @param heightPx drawing-buffer height in device pixels
   */
  frame(camera: THREE.PerspectiveCamera, target: THREE.Vector3, heightPx: number, time: number): void {
    this.glowMaterial.uniforms.uScale.value = camera.projectionMatrix.elements[5] * heightPx * 0.5;
    this.glowMaterial.uniforms.uTime.value = time;
    const camDist = camera.position.distanceTo(target);
    const fadeNear = camDist * 0.55;
    this.glowMaterial.uniforms.uFadeNear.value = fadeNear;
    this.planetMaterial.uniforms.uFadeNear.value = fadeNear;
    this.updateAxis(camera, target, camDist);
    if (this.frameNo++ % REFRESH_EVERY === 0) this.updateNear(camera.position);
    const radius = Math.min(Math.max(camDist * 0.7, 60), 420);
    if (
      this.linksDirty ||
      target.distanceTo(this.lastLinkTarget) > radius * 0.15 ||
      Math.abs(radius - this.lastLinkRadius) > this.lastLinkRadius * 0.2
    ) {
      this.updateLinks(target, radius);
    }
  }

  private updateNear(cameraPos: THREE.Vector3): void {
    const m = this.model;
    const p = m.positions;
    const cx = cameraPos.x, cy = cameraPos.y, cz = cameraPos.z;
    const limit = NEAR_DISTANCE * NEAR_DISTANCE;
    const candidates: { i: number; d: number }[] = [];
    for (let i = 0; i < m.count; i++) {
      const dx = p[3 * i] - cx;
      if (dx > NEAR_DISTANCE || dx < -NEAR_DISTANCE) continue;
      const dy = p[3 * i + 1] - cy, dz = p[3 * i + 2] - cz;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < limit) candidates.push({ i, d });
    }
    candidates.sort((a, b) => a.d - b.d);
    const count = Math.min(candidates.length, NEAR_MAX);
    this.nearList = [];
    let k = 0;
    for (const tier of this.tiers) {
      const colors = tier.mesh.instanceColor!;
      let used = 0;
      while (used < tier.capacity && k < count) {
        const i = candidates[k++].i;
        this.nearList.push(i);
        tier.index[used] = i;
        const r = m.radius[i];
        this.tmpMatrix.makeScale(r, r, r).setPosition(p[3 * i], p[3 * i + 1], p[3 * i + 2]);
        tier.mesh.setMatrixAt(used, this.tmpMatrix);
        this.tmpColor.set(PLANET_BODY[CATEGORY_ORDER[m.category[i]] ?? 'political']);
        colors.setXYZ(used, this.tmpColor.r, this.tmpColor.g, this.tmpColor.b);
        tier.glow.setXYZ(used, this.glowColors[3 * i], this.glowColors[3 * i + 1], this.glowColors[3 * i + 2]);
        tier.state.setX(used, this.states[i]);
        used++;
      }
      tier.mesh.count = used;
      tier.mesh.instanceMatrix.needsUpdate = true;
      colors.needsUpdate = true;
      tier.glow.needsUpdate = true;
      tier.state.needsUpdate = true;
    }
  }

  /** Spheres drawn this frame. */
  get sphereCount(): number {
    return this.tiers.reduce((n, t) => n + t.mesh.count, 0);
  }

  private updateLinks(target: THREE.Vector3, radius: number): void {
    const m = this.model;
    const p = m.positions;
    const r2 = radius * radius;
    let v = 0;
    const tourActive = this.focus.tour !== null;
    const anyFocus = tourActive || this.focus.selected !== null;
    const push = (k: number, strength: number) => {
      const a = m.linkA[k], b = m.linkB[k];
      this.tmpColor.set(LINK_BY_CONFIDENCE[m.linkConfidence[k]]);
      const c = this.tmpColor;
      this.linkPositions.set([p[3 * a], p[3 * a + 1], p[3 * a + 2], p[3 * b], p[3 * b + 1], p[3 * b + 2]], v * 6);
      // The cause end is dimmer than the effect end, so direction reads without arrowheads.
      const s0 = strength * 0.35, s1 = strength;
      this.linkColors.set([c.r * s0, c.g * s0, c.b * s0, c.r * s1, c.g * s1, c.b * s1], v * 6);
      v++;
    };
    for (let k = 0; k < m.linkA.length; k++) {
      if (this.tourLinks.has(k)) push(k, 1.0);
      else if (this.highlightLinks.has(k)) push(k, tourActive ? 0.45 : 0.85);
      else {
        const a = m.linkA[k], b = m.linkB[k];
        const mx = (p[3 * a] + p[3 * b]) / 2 - target.x;
        const my = (p[3 * a + 1] + p[3 * b + 1]) / 2 - target.y;
        const mz = (p[3 * a + 2] + p[3 * b + 2]) / 2 - target.z;
        if (mx * mx + my * my + mz * mz < r2) push(k, anyFocus ? 0.06 : 0.2 + 0.1 * m.linkConfidence[k]);
      }
    }
    const geom = this.links.geometry;
    geom.setDrawRange(0, v * 2);
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
    this.lastLinkTarget.copy(target);
    this.lastLinkRadius = radius;
    this.linksDirty = false;
  }

  /** Visible half-width in scene units at the target's distance. */
  static halfWidth(camera: THREE.PerspectiveCamera, camDist: number): number {
    return camDist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
  }

  private updateAxis(camera: THREE.PerspectiveCamera, target: THREE.Vector3, camDist: number): void {
    const half = SpaceEngine.halfWidth(camera, camDist);
    const xMin = Math.max(target.x - half, this.axisMinX);
    const xMax = Math.min(target.x + half, this.axisMaxX);
    const count = Math.max(4, Math.min(12, Math.round(camera.aspect * 7)));
    const ticks = axisTicks(xMin, xMax, count, this.model.timeScale).slice(0, MAX_TICKS);
    const tickHeight = Math.max(camDist * 0.012, 0.6);
    const key = `${ticks.join(',')}|${tickHeight.toFixed(1)}`;
    if (key !== this.tickKey) {
      this.tickKey = key;
      this.ticks = ticks;
      ticks.forEach((year, k) => {
        const x = yearToX(year, this.model.timeScale);
        this.tickPositions.set([x, -tickHeight, 0, x, tickHeight, 0], k * 6);
      });
      this.tickGeometry.setDrawRange(0, ticks.length * 2);
      this.tickGeometry.attributes.position.needsUpdate = true;
    }
    const ringRadius = Math.min(Math.max(camDist * 0.18, 20), 260);
    this.nowRing.position.set(target.x, 0, 0);
    this.nowRing.scale.setScalar(ringRadius);
  }

  /** Event index for a sphere instance id (from a raycast), or null for synthetic or missing ones. */
  eventForInstance(object: THREE.Object3D, instanceId: number | undefined): number | null {
    const tier = this.tiers.find((t) => t.mesh === object);
    if (!tier || instanceId === undefined || instanceId >= tier.mesh.count) return null;
    return this.selectable(tier.index[instanceId]);
  }

  /** Event index if it is a real (not stress-test) event. */
  selectable(index: number | undefined): number | null {
    return index !== undefined && index >= 0 && index < this.model.realCount ? index : null;
  }

  position(index: number, out = new THREE.Vector3()): THREE.Vector3 {
    const p = this.model.positions;
    return out.set(p[3 * index], p[3 * index + 1], p[3 * index + 2]);
  }

  dispose(): void {
    this.glow.geometry.dispose();
    this.glowMaterial.dispose();
    this.tiers.forEach((t) => t.mesh.geometry.dispose());
    this.planetMaterial.dispose();
    this.group.traverse((obj) => {
      const o = obj as THREE.Mesh;
      o.geometry?.dispose();
      const mat = o.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
  }
}

/** One InstancedMesh of spheres plus its per-instance attributes. */
export class SphereTier {
  readonly mesh: THREE.InstancedMesh;
  readonly glow: THREE.InstancedBufferAttribute;
  readonly state: THREE.InstancedBufferAttribute;
  /** Event index for each instance id. */
  readonly index: Int32Array;
  readonly capacity: number;

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, capacity: number) {
    this.capacity = capacity;
    this.index = new Int32Array(capacity);
    this.glow = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.state = new THREE.InstancedBufferAttribute(new Float32Array(capacity), 1).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('aGlow', this.glow);
    geometry.setAttribute('aState', this.state);
    this.mesh = new THREE.InstancedMesh(geometry, material, capacity);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
  }
}
