/**
 * CompareButton.tsx
 *
 * Toolbar toggle button for Event Comparison mode.
 * Positioned near the On This Day button in the top toolbar area.
 */

import { useAppStore } from '../store';

export default function CompareButton() {
  const active = useAppStore((s) => s.compareMode);
  const setCompareMode = useAppStore((s) => s.setCompareMode);

  return (
    <button
      onClick={() => setCompareMode(!active)}
      title="Compare two events"
      aria-label="Toggle event comparison mode"
      style={{
        position: 'fixed',
        top: 16,
        right: 310,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: active
          ? '1px solid rgba(96,165,250,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: active
          ? 'rgba(96,165,250,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: active ? '#60a5fa' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 15 }}>&#x2194;</span>
      Compare
    </button>
  );
}
