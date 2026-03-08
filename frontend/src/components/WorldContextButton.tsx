/**
 * WorldContextButton.tsx
 *
 * A toolbar button that opens the "World at That Time" slide-in panel.
 * Only visible when an event is selected (selectedEventSlug is set).
 *
 * Owns: button rendering and click handler.
 * Does NOT own: panel content or data fetching.
 */
import { useAppStore } from '../store';

/**
 * Toolbar button with a globe icon that toggles the World Context panel.
 * Positioned next to the "On This Day" button in the top toolbar.
 */
export default function WorldContextButton() {
  const open = useAppStore((s) => s.worldContextOpen);
  const setOpen = useAppStore((s) => s.setWorldContextOpen);
  const selectedSlug = useAppStore((s) => s.selectedEventSlug);

  // Only show when an event is selected
  if (!selectedSlug) return null;

  return (
    <button
      onClick={() => setOpen(!open)}
      title="World at That Time"
      aria-label="Toggle World Context panel"
      style={{
        position: 'fixed',
        top: 16,
        right: 300,
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
      <span style={{ fontSize: 16 }}>🌍</span>
      World
    </button>
  );
}
