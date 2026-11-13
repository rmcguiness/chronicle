/**
 * Which main view to show: the 3D space view or the 2D network view.
 *
 * Desktop browsers with WebGL 2 get the space view. Phones, narrow windows and
 * browsers without WebGL 2 keep the 2D view. `?view=3d` or `?view=2d` in the URL,
 * or the toggle (saved in localStorage), override the default.
 */
export type MainViewKind = '3d' | '2d';

export const VIEW_STORAGE_KEY = 'chronicle.mainView';

/** Narrowest window that gets the space view by default. */
export const MIN_SPACE_VIEW_WIDTH = 900;

export interface ViewEnvironment {
  /** Space view needs the demo snapshot, so it is off in API builds for now. */
  spaceAvailable: boolean;
  webgl2: boolean;
  width: number;
  /** True when the only pointer is a finger (phones, most tablets). */
  coarsePointerOnly: boolean;
  urlParam: string | null;
  stored: string | null;
}

function parseKind(v: string | null): MainViewKind | null {
  if (v === '3d' || v === 'space') return '3d';
  if (v === '2d' || v === 'network') return '2d';
  return null;
}

/** True when this browser can run the space view at all. */
export function canUseSpaceView(env: Pick<ViewEnvironment, 'spaceAvailable' | 'webgl2'>): boolean {
  return env.spaceAvailable && env.webgl2;
}

export function chooseMainView(env: ViewEnvironment): MainViewKind {
  if (!canUseSpaceView(env)) return '2d';
  const forced = parseKind(env.urlParam) ?? parseKind(env.stored);
  if (forced) return forced;
  return env.width >= MIN_SPACE_VIEW_WIDTH && !env.coarsePointerOnly ? '3d' : '2d';
}

/** Probe for WebGL 2 once (creates and discards a tiny canvas). */
export function detectWebGL2(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const ok = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Read the current browser environment. */
export function readViewEnvironment(spaceAvailable: boolean): ViewEnvironment {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  let stored: string | null;
  try {
    stored = typeof localStorage !== 'undefined' ? localStorage.getItem(VIEW_STORAGE_KEY) : null;
  } catch {
    stored = null;
  }
  return {
    spaceAvailable,
    webgl2: detectWebGL2(),
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    coarsePointerOnly:
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(pointer: coarse)').matches &&
      !window.matchMedia?.('(any-pointer: fine)').matches,
    urlParam: params?.get('view') ?? null,
    stored,
  };
}

export function saveMainView(kind: MainViewKind): void {
  try {
    localStorage.setItem(VIEW_STORAGE_KEY, kind);
  } catch {
    // Private mode or storage disabled: the choice lasts for this page only.
  }
}
