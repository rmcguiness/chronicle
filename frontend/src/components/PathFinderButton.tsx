/**
 * PathFinderButton.tsx
 *
 * Toolbar button that toggles causal path selection mode.
 * Shows a link-chain icon and "Path" label. When active, shows
 * start/end selection state and a clear button.
 */

import { useAppStore } from '../store';

/** Accent color for the path finder feature. */
const PATH_ACCENT = '#f97316';
const PATH_ACCENT_BG = 'rgba(249,115,22,0.12)';
const PATH_ACCENT_BORDER = 'rgba(249,115,22,0.4)';

/**
 * Toolbar button to enter/exit causal path selection mode.
 * When path mode is active, also shows a Clear button.
 */
export default function PathFinderButton() {
  const pathModeActive = useAppStore((s) => s.pathModeActive);
  const setPathModeActive = useAppStore((s) => s.setPathModeActive);
  const resetPathMode = useAppStore((s) => s.resetPathMode);
  const pathStartSlug = useAppStore((s) => s.pathStartSlug);
  const pathEndSlug = useAppStore((s) => s.pathEndSlug);

  const handleClick = () => {
    if (pathModeActive) {
      resetPathMode();
    } else {
      setPathModeActive(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 160,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <button
        onClick={handleClick}
        title={pathModeActive ? 'Exit path mode' : 'Find causal path between two events'}
        aria-label="Toggle Path Finder mode"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          borderRadius: 8,
          border: pathModeActive
            ? `1px solid ${PATH_ACCENT_BORDER}`
            : '1px solid rgba(255,255,255,0.1)',
          background: pathModeActive ? PATH_ACCENT_BG : 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          color: pathModeActive ? PATH_ACCENT : 'rgba(255,255,255,0.7)',
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
      >
        {/* Link chain icon (Unicode) */}
        <span style={{ fontSize: 14 }}>&#x1F517;</span>
        Path
      </button>

      {/* Status indicator when in path mode */}
      {pathModeActive && (
        <span
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {!pathStartSlug && 'Click start event'}
          {pathStartSlug && !pathEndSlug && 'Click end event'}
        </span>
      )}

      {/* Clear button — visible when path mode is active */}
      {pathModeActive && (pathStartSlug || pathEndSlug) && (
        <button
          onClick={resetPathMode}
          title="Clear path selection"
          aria-label="Clear path"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15,17,23,0.85)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
