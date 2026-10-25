import { describe, expect, it } from 'vitest';
import { formatYear } from './format';

describe('formatYear', () => {
  it('formats BCE years with separators', () => {
    expect(formatYear(-3300)).toBe('3,300 BCE');
    expect(formatYear(-44)).toBe('44 BCE');
  });
  it('labels early CE years', () => {
    expect(formatYear(632)).toBe('632 CE');
    expect(formatYear(0)).toBe('0 CE');
  });
  it('leaves modern years bare', () => {
    expect(formatYear(1789)).toBe('1789');
  });
  it('handles missing values', () => {
    expect(formatYear(null)).toBe('Unknown date');
    expect(formatYear(Number.NaN)).toBe('Unknown date');
  });
});
