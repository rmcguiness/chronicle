/**
 * HeatmapToggle.tsx
 *
 * Toolbar button that toggles the timeline density heatmap overlay.
 * Uses a fire/flame icon to indicate heat-map mode.
 *
 * Positioned near the other toolbar buttons in the top-right area.
 */

import { useAppStore } from '../store';

/**
 * Toolbar button that toggles the heatmap overlay on/off.
 */
export default function HeatmapToggle() {
  const show = useAppStore((s) => s.showHeatmap);
  const setShow = useAppStore((s) => s.setShowHeatmap);

  return (
    <button
      onClick={() => setShow(!show)}
      title="Toggle density heatmap"
      aria-label="Toggle timeline density heatmap"
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
        border: show
          ? '1px solid rgba(239,68,68,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: show
          ? 'rgba(239,68,68,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: show ? '#ef4444' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
      Heatmap
    </button>
  );
}
