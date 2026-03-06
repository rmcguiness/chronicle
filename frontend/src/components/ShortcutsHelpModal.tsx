/**
 * ShortcutsHelpModal — centered overlay listing all keyboard shortcuts.
 *
 * Press `?` or `Escape` to close. Uses inline styles consistent with the
 * rest of the Chronicle UI (dark glass-morphism aesthetic).
 */

import {
  KEY_SEARCH,
  KEY_ESCAPE,
  KEY_FOCUS,
  KEY_RANDOM,
  KEY_HELP,
} from '../hooks/useKeyboardShortcuts';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ShortcutsHelpModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the user wants to close the modal. */
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shortcut definitions
// ─────────────────────────────────────────────────────────────────────────────

interface ShortcutEntry {
  key: string;
  label: string;
  description: string;
}

const SHORTCUTS: ShortcutEntry[] = [
  { key: KEY_SEARCH, label: '/', description: 'Open / focus search' },
  { key: KEY_ESCAPE, label: 'Esc', description: 'Close panel / clear search / exit focus mode' },
  { key: KEY_FOCUS.toUpperCase(), label: 'F', description: 'Toggle focus-mode hint' },
  { key: KEY_RANDOM.toUpperCase(), label: 'R', description: 'Jump to random important event' },
  { key: KEY_HELP, label: '?', description: 'Show this help' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A modal overlay that displays all available keyboard shortcuts.
 *
 * @param props.open - Whether the modal is visible.
 * @param props.onClose - Callback to close the modal.
 */
export default function ShortcutsHelpModal({ open, onClose }: ShortcutsHelpModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'rgba(7, 14, 34, 0.97)',
          border: '1px solid rgba(96, 165, 250, 0.25)',
          borderRadius: 16,
          padding: '28px 32px',
          minWidth: 340,
          maxWidth: 420,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: '#e2e8f0',
              letterSpacing: '0.02em',
            }}
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 18,
              cursor: 'pointer',
              padding: '2px 6px',
              lineHeight: 1,
            }}
            aria-label="Close shortcuts help"
          >
            &times;
          </button>
        </div>

        {/* Shortcut list */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {SHORTCUTS.map((s) => (
              <tr key={s.key}>
                <td
                  style={{
                    padding: '8px 16px 8px 0',
                    verticalAlign: 'middle',
                  }}
                >
                  <kbd
                    style={{
                      display: 'inline-block',
                      minWidth: 28,
                      padding: '3px 8px',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: '#e0e7ff',
                      fontSize: 13,
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </kbd>
                </td>
                <td
                  style={{
                    padding: '8px 0',
                    color: '#94a3b8',
                    fontSize: 13,
                    verticalAlign: 'middle',
                  }}
                >
                  {s.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
