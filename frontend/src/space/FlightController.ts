/**
 * Camera flights for the space view.
 *
 * React code queues a request (fly to an event, or back to the overview); the
 * render loop picks it up and moves the camera along a curved path. Pure math
 * (path and timing) is exported for tests.
 */
import * as THREE from 'three';

export type FlightRequest =
  | { kind: 'event'; position: THREE.Vector3; radius: number }
  | { kind: 'view'; position: THREE.Vector3; target: THREE.Vector3 };

export interface ActiveFlight {
  from: THREE.Vector3;
  fromTarget: THREE.Vector3;
  to: THREE.Vector3;
  toTarget: THREE.Vector3;
  control: THREE.Vector3;
  start: number;
  duration: number;
}

/** Seconds for a flight covering `distance` scene units: short hops stay quick, long ones top out. */
export function flightDuration(distance: number): number {
  return Math.min(2.6, Math.max(0.9, 0.9 + 0.55 * Math.log10(1 + distance / 40)));
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Camera distance from a planet after arriving, so it fills part of the screen with neighbours in view. */
export function arrivalDistance(radius: number): number {
  return Math.max(radius * 16, 70);
}

/** Point on a quadratic Bézier curve. */
export function bezier(a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, t: number, out = new THREE.Vector3()): THREE.Vector3 {
  const u = 1 - t;
  return out
    .copy(a)
    .multiplyScalar(u * u)
    .addScaledVector(c, 2 * u * t)
    .addScaledVector(b, t * t);
}

/** Preferred viewing direction: a little above and in front of the time axis. */
const PREFERRED_DIR = new THREE.Vector3(0.18, 0.32, 1).normalize();

export class FlightController {
  pending: FlightRequest | null = null;
  active: ActiveFlight | null = null;
  reducedMotion = false;

  request(r: FlightRequest): void {
    this.pending = r;
  }

  setReducedMotion(on: boolean): void {
    this.reducedMotion = on;
  }

  cancel(): void {
    this.active = null;
  }

  /** Turn a pending request into an active flight starting from the current camera. */
  begin(camera: THREE.Vector3, target: THREE.Vector3, now: number): ActiveFlight | null {
    const r = this.pending;
    this.pending = null;
    if (!r) return null;
    let to: THREE.Vector3;
    let toTarget: THREE.Vector3;
    if (r.kind === 'event') {
      toTarget = r.position.clone();
      const dir = camera.clone().sub(r.position);
      if (dir.lengthSq() < 1e-6) dir.copy(PREFERRED_DIR);
      dir.normalize().lerp(PREFERRED_DIR, 0.55).normalize();
      to = r.position.clone().addScaledVector(dir, arrivalDistance(r.radius));
    } else {
      to = r.position.clone();
      toTarget = r.target.clone();
    }
    const travel = camera.distanceTo(to);
    const mid = camera.clone().add(to).multiplyScalar(0.5);
    const midTarget = target.clone().add(toTarget).multiplyScalar(0.5);
    const out = mid.clone().sub(midTarget);
    if (out.lengthSq() < 1e-6) out.set(0, 1, 0);
    // Bow the path outward so long trips pull back, cross over, and come in again.
    const control = mid.addScaledVector(out.normalize(), Math.min(travel * 0.35, 1600));
    this.active = {
      from: camera.clone(),
      fromTarget: target.clone(),
      to,
      toTarget,
      control,
      start: now,
      duration: this.reducedMotion ? 0 : flightDuration(travel),
    };
    return this.active;
  }

  /** Camera position and target at time `now`; returns false once the flight has ended. */
  sample(now: number, outPos: THREE.Vector3, outTarget: THREE.Vector3): boolean {
    const f = this.active;
    if (!f) return false;
    const t = f.duration <= 0 ? 1 : Math.min(1, (now - f.start) / f.duration);
    const e = easeInOutCubic(t);
    bezier(f.from, f.control, f.to, e, outPos);
    // The look-at point leads the camera slightly, so the destination comes into view early.
    outTarget.copy(f.fromTarget).lerp(f.toTarget, easeInOutCubic(Math.min(1, t * 1.25)));
    if (t >= 1) this.active = null;
    return true;
  }
}
