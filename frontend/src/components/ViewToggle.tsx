/**
 * ViewToggle.tsx
 *
 * A segmented toggle button for switching between Timeline and Network views.
 * Renders in the top toolbar area and persists the selection in the Zustand store.
 *
 * Owns: toggle UI rendering and click handling.
 * Does NOT own: view mode state (that's in the store), or rendering either view.
 */

import { memo } from 'react';
import { useAppStore, type ViewMode } from '../store';

/** Button config for each view mode. */
const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: string }[] = [
  { mode: 'timeline', label: 'Timeline', icon: '📅' },
  { mode: 'network', label: 'Network', icon: '🕸️' },
];

/**
 * Segmented toggle for switching between Timeline and Network view modes.
 * Positioned absolutely in the top-right area of the viewport.
 */
function ViewToggle() {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 16,
        zIndex: 50,
        display: 'flex',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(7,14,34,0.9)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {VIEW_OPTIONS.map(({ mode, label, icon }) => {
        const isActive = viewMode === mode;
        return (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            aria-pressed={isActive}
            aria-label={`Switch to ${label} view`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 14px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              fontFamily: "'Inter', sans-serif",
              color: isActive ? '#f1f5f9' : 'rgba(255,255,255,0.5)',
              backgroundColor: isActive
                ? 'rgba(96,165,250,0.2)'
                : 'transparent',
              transition: 'all 0.15s ease',
              borderRight: mode === 'timeline' ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
          >
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default memo(ViewToggle);
