import { describe, expect, it } from 'vitest';
import { axisTicks, formatYearLabel, niceYearStep, unitsPerYear, xToYear, yearToX } from './timeScale';

describe('yearToX / xToYear', () => {
  it('places later years further right', () => {
    const years = [-5000, -500, 0, 1066, 1878, 1914, 2001, 2026];
    const xs = years.map((y) => yearToX(y));
    expect([...xs].sort((a, b) => a - b)).toEqual(xs);
  });

  it('round-trips', () => {
    for (const y of [-5000, -44, 0, 1914.5, 2026]) expect(xToYear(yearToX(y))).toBeCloseTo(y, 6);
  });

  it('gives recent centuries more room than deep history', () => {
    expect(yearToX(2000) - yearToX(1900)).toBeGreaterThan(10 * (yearToX(-2900) - yearToX(-3000)));
    expect(unitsPerYear(1914)).toBeGreaterThan(unitsPerYear(-3000));
  });
});

describe('axisTicks', () => {
  it('returns increasing round years inside the span', () => {
    const xMin = yearToX(1890);
    const xMax = yearToX(1940);
    const ticks = axisTicks(xMin, xMax, 10);
    expect(ticks.length).toBeGreaterThan(5);
    expect([...ticks].sort((a, b) => a - b)).toEqual(ticks);
    for (const t of ticks) {
      expect(t).toBeGreaterThanOrEqual(1885);
      expect(t).toBeLessThanOrEqual(1945);
      expect(t % 5).toBe(0);
    }
  });

  it('uses coarser steps for deep history than for recent years on a zoomed-out axis', () => {
    const ticks = axisTicks(yearToX(-5000), yearToX(2026), 12);
    expect(ticks[0]).toBeLessThanOrEqual(-4000);
    expect(Math.abs(ticks[0] % 500)).toBe(0);
    const yearGaps = ticks.slice(1).map((t, i) => t - ticks[i]);
    expect(yearGaps[0]).toBeGreaterThan(10 * yearGaps[yearGaps.length - 1]);
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(2100);
  });

  it('spaces ticks roughly evenly on screen', () => {
    const ticks = axisTicks(yearToX(-3000), yearToX(2000), 10);
    const gaps = ticks.slice(1).map((t, i) => yearToX(t) - yearToX(ticks[i]));
    expect(Math.max(...gaps) / Math.min(...gaps)).toBeLessThan(4);
  });

  it('returns nothing for an empty span', () => {
    expect(axisTicks(10, 10)).toEqual([]);
  });

  it('picks the smallest round step that covers a gap', () => {
    expect(niceYearStep(3)).toBe(5);
    expect(niceYearStep(30)).toBe(50);
    expect(niceYearStep(1)).toBe(1);
  });
});

describe('formatYearLabel', () => {
  it('labels BCE years', () => {
    expect(formatYearLabel(-44.2)).toBe('44 BCE');
    expect(formatYearLabel(1914.4)).toBe('1914');
  });
});
