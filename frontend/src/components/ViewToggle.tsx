/**
 * ViewToggle — top-right button that opens the 3D space view from the 2D network view.
 * The space view has its own "2D view" button for the way back.
 */
export default function ViewToggle({ onSwitch }: { onSwitch: () => void }) {
  return (
    <button
      type="button"
      onClick={onSwitch}
      aria-label="Switch to the 3D space view"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 300,
        background: 'rgba(7, 14, 34, 0.9)',
        color: '#dbe4ff',
        border: '1px solid rgba(140, 170, 255, 0.3)',
        borderRadius: 8,
        padding: '7px 12px',
        fontSize: 13,
        cursor: 'pointer',
      }}
    >
      3D view
    </button>
  );
}
