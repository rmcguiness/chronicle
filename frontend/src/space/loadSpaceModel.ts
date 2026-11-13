/** Fetches the demo snapshot and the precomputed layout, and joins them. */
import { loadDemoSnapshot } from '../api/demo';
import { buildSpaceModel, parseSpaceLayout, type SpaceModel } from './spaceData';

export function spaceLayoutUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}demo/space-layout.json`;
}

/** `?stress=6000` pads the scene with synthetic planets for frame-rate tests. */
export function stressTotalFromUrl(search: string): number {
  const n = Number(new URLSearchParams(search).get('stress'));
  return Number.isFinite(n) && n > 0 ? Math.min(Math.floor(n), 50000) : 0;
}

export async function loadSpaceModel(stressTotal = 0): Promise<SpaceModel> {
  const [snapshot, layoutRaw] = await Promise.all([
    loadDemoSnapshot(),
    fetch(spaceLayoutUrl()).then((res) => {
      if (!res.ok) throw new Error(`Space layout: HTTP ${res.status}`);
      return res.json();
    }),
  ]);
  return buildSpaceModel(snapshot, parseSpaceLayout(layoutRaw), { stressTotal });
}
