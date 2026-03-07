/**
 * MinimapButton.tsx — Toolbar button that toggles the timeline minimap overlay.
 *
 * Positioned in the top toolbar area next to the On This Day button.
 * Only shown when the minimap is hidden; clicking re-opens it.
 */

import { useAppStore } from '../store';

export default function MinimapButton() {
  const visible = useAppStore((s) => s.minimapVisible);
  const setVisible = useAppStore((s) => s.setMinimapVisible);

  // Only show the button when the minimap is hidden
  if (visible) return null;

  return (
    <button
      onClick={() => setVisible(true)}
      title="Show minimap"
      aria-label="Show timeline minimap"
      style={{
        position: 'fixed',
        top: 16,
        right: 110,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 14 }}>&#x1F5FA;&#xFE0E;</span>
      Minimap
    </button>
  );
}
