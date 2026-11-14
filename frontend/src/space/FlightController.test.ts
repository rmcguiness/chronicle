import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { FlightController, arrivalDistance, easeInOutCubic, flightDuration } from './FlightController';

describe('flight timing', () => {
  it('keeps short hops quick and caps long trips', () => {
    expect(flightDuration(0)).toBeCloseTo(0.9);
    expect(flightDuration(50)).toBeLessThan(flightDuration(2000));
    expect(flightDuration(1e7)).toBe(2.6);
  });

  it('eases from 0 to 1', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});

describe('FlightController', () => {
  it('flies from the current camera to a point near the planet and ends there', () => {
    const fc = new FlightController();
    const planet = new THREE.Vector3(-1411, 50, 60);
    fc.request({ kind: 'event', position: planet, radius: 4 });
    const f = fc.begin(new THREE.Vector3(-2000, 0, 3000), new THREE.Vector3(-2000, 0, 0), 10)!;
    expect(f.from.toArray()).toEqual([-2000, 0, 3000]);
    const pos = new THREE.Vector3();
    const tgt = new THREE.Vector3();
    expect(fc.sample(10, pos, tgt)).toBe(true);
    expect(pos.toArray()).toEqual([-2000, 0, 3000]);
    fc.sample(10 + f.duration + 0.01, pos, tgt);
    expect(tgt.distanceTo(planet)).toBeLessThan(1e-6);
    expect(pos.distanceTo(planet)).toBeCloseTo(arrivalDistance(4));
    expect(fc.active).toBeNull();
    expect(fc.sample(99, pos, tgt)).toBe(false);
  });

  it('jumps straight to the end when reduced motion is on', () => {
    const fc = new FlightController();
    fc.reducedMotion = true;
    fc.request({ kind: 'view', position: new THREE.Vector3(1, 2, 3), target: new THREE.Vector3() });
    fc.begin(new THREE.Vector3(500, 0, 0), new THREE.Vector3(), 0);
    const pos = new THREE.Vector3();
    fc.sample(0, pos, new THREE.Vector3());
    expect(pos.toArray()).toEqual([1, 2, 3]);
  });
});
