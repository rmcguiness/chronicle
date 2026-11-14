/** Camera framing for the "all of history" overview. */
import * as THREE from 'three';
import type { SpaceModel } from '../spaceData';
import { yearToX } from '../timeScale';
import type { SpaceEngine } from './SpaceEngine';

/** Camera position and target that frame every event, for the given aspect ratio. */
export function overviewView(engine: SpaceEngine, model: SpaceModel, fovDeg: number, aspect: number) {
  const xMin = engine.axisMinX + 120;
  const xMax = yearToX(2030, model.timeScale);
  const half = ((xMax - xMin) / 2) * 0.92;
  const dist = half / (Math.tan(THREE.MathUtils.degToRad(fovDeg / 2)) * Math.max(aspect, 0.5));
  const target = new THREE.Vector3((xMin + xMax) / 2, 0, 0);
  // Slightly above and to the right, so the time axis recedes a little toward the deep past.
  const position = target.clone().add(new THREE.Vector3(dist * 0.12, dist * 0.34, dist * 0.82));
  return { position, target };
}
