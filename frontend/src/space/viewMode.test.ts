import { describe, expect, it } from 'vitest';
import { chooseMainView, type ViewEnvironment } from './viewMode';

const desktop: ViewEnvironment = {
  spaceAvailable: true,
  webgl2: true,
  width: 1440,
  coarsePointerOnly: false,
  urlParam: null,
  stored: null,
};

describe('chooseMainView', () => {
  it('gives desktops with WebGL 2 the space view', () => {
    expect(chooseMainView(desktop)).toBe('3d');
  });

  it('keeps phones and narrow windows on the 2D view', () => {
    expect(chooseMainView({ ...desktop, width: 390, coarsePointerOnly: true })).toBe('2d');
    expect(chooseMainView({ ...desktop, width: 700 })).toBe('2d');
  });

  it('falls back to 2D without WebGL 2 or demo data, even when 3D is requested', () => {
    expect(chooseMainView({ ...desktop, webgl2: false, urlParam: '3d' })).toBe('2d');
    expect(chooseMainView({ ...desktop, spaceAvailable: false, stored: '3d' })).toBe('2d');
  });

  it('lets the URL beat the saved choice, and the saved choice beat the default', () => {
    expect(chooseMainView({ ...desktop, stored: '2d' })).toBe('2d');
    expect(chooseMainView({ ...desktop, stored: '2d', urlParam: 'space' })).toBe('3d');
    expect(chooseMainView({ ...desktop, width: 390, stored: '3d' })).toBe('3d');
  });
});
