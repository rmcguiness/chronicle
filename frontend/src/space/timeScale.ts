/**
 * Time scale for the space view: year ↔ scene X.
 *
 * x = -units · ln(1 + (refYear − year) / tau)
 *
 * Later years sit further right. Spacing per year grows toward the present, so the
 * last few centuries get more room than the Neolithic. The constants come from
 * public/demo/space-layout.json (written by scripts/compute_space_layout.py), so the
 * year axis and the precomputed planet positions always use the same scale.
 */

export interface TimeScaleParams {
  ref_year: number;
  tau: number;
  units: number;
}

/** Same values as scripts/compute_space_layout.py; used when no layout file is loaded (tests, stress mode). */
export const DEFAULT_TIME_SCALE: TimeScaleParams = { ref_year: 2100, tau: 60, units: 1000 };

/** Scene X for a year (negative = BCE). */
export function yearToX(year: number, p: TimeScaleParams = DEFAULT_TIME_SCALE): number {
  const before = Math.max(p.ref_year - year, 0);
  return -p.units * Math.log1p(before / p.tau);
}

/** Year for a scene X (inverse of yearToX). */
export function xToYear(x: number, p: TimeScaleParams = DEFAULT_TIME_SCALE): number {
  return p.ref_year - p.tau * Math.expm1(-x / p.units);
}

/** Scene units per year at a given year (the local slope of the scale). */
export function unitsPerYear(year: number, p: TimeScaleParams = DEFAULT_TIME_SCALE): number {
  return p.units / (p.tau + Math.max(p.ref_year - year, 0));
}

/** "1914", "44 BCE". Years are rounded to whole numbers. */
export function formatYearLabel(year: number): string {
  const y = Math.round(year);
  if (y < 0) return `${-y} BCE`;
  return `${y}`;
}

const NICE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000];

/** Smallest round step (in years) that is at least `years`. */
export function niceYearStep(years: number): number {
  return NICE_STEPS.find((s) => s >= years) ?? NICE_STEPS[NICE_STEPS.length - 1];
}

/**
 * Year ticks for the axis between scene X `xMin` and `xMax`, about `count` of them,
 * spaced evenly on screen. Because the scale is not linear, each tick is rounded to a
 * step that fits the local years-per-gap, so a zoomed-out axis reads
 * "-3000 … 0 … 1500 … 1900 … 2000" instead of crowding the old end.
 */
export function axisTicks(xMin: number, xMax: number, count = 10, p: TimeScaleParams = DEFAULT_TIME_SCALE): number[] {
  if (!(xMax > xMin) || count < 1) return [];
  const lastYear = xToYear(Math.min(xMax, 0), p);
  const gap = (xMax - xMin) / count;
  const ticks: number[] = [];
  for (let k = 0; k <= count; k++) {
    const x = xMin + k * gap;
    if (x > 0) break;
    const year = xToYear(x, p);
    const step = niceYearStep(gap / unitsPerYear(year, p));
    const rounded = Math.round(year / step) * step;
    if (rounded > lastYear) continue;
    const last = ticks[ticks.length - 1];
    if (last === undefined || rounded > last) ticks.push(rounded === 0 ? 0 : rounded);
  }
  return ticks;
}
