/**
 * CausalChainButton.tsx
 *
 * Toolbar button that toggles the Causal Chain explorer panel.
 * Only visible when an event is selected.
 */

import { useAppStore } from '../store';

/**
 * Toolbar button that toggles the causal chain panel open/closed.
 * Positioned in the top toolbar area alongside other action buttons.
 */
export default function CausalChainButton() {
  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);
  const open = useAppStore((s) => s.causalChainOpen);
  const setOpen = useAppStore((s) => s.setCausalChainOpen);

  if (!selectedEventSlug) return null;

  return (
    <button
      onClick={() => setOpen(!open)}
      title="Trace causal chain"
      aria-label="Toggle Causal Chain panel"
      style={{
        position: 'fixed',
        top: 16,
        right: 320,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: open
          ? '1px solid rgba(168,85,247,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: open
          ? 'rgba(168,85,247,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: open ? '#c4b5fd' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 14 }}>&#x21C9;</span>
      Causal Chain
    </button>
  );
}
