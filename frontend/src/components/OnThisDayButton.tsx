/**
 * OnThisDayButton.tsx
 *
 * A toolbar button that opens the "On This Day" slide-in panel.
 * Positioned in the top toolbar area, near the view toggle.
 *
 * Owns: button rendering and click handler.
 * Does NOT own: panel content or data fetching.
 */

import { useAppStore } from '../store';
import { IS_DEMO_MODE } from '../config/demo';

/**
 * Toolbar button with a calendar icon that toggles the On This Day panel.
 */
export default function OnThisDayButton() {
  const open = useAppStore((s) => s.onThisDayOpen);
  const setOpen = useAppStore((s) => s.setOnThisDayOpen);

  // The demo sample has years only (no calendar days), so On This Day is hidden.
  if (IS_DEMO_MODE) return null;

  return (
    <button
      onClick={() => setOpen(!open)}
      title="On This Day"
      aria-label="Toggle On This Day panel"
      style={{
        position: 'fixed',
        top: 16,
        right: 160,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: open
          ? '1px solid rgba(96,165,250,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: open
          ? 'rgba(96,165,250,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: open ? '#60a5fa' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 16 }}>📅</span>
      On This Day
    </button>
  );
}
