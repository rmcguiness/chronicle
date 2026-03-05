/**
 * ShareButton.tsx — "Share" toolbar button for Chronicle.
 *
 * Copies the current URL (including the live permalink hash) to the clipboard
 * and shows a brief "Copied!" toast notification for visual confirmation.
 *
 * Owns: clipboard interaction, toast visibility state.
 * Does NOT: read or write the URL hash directly (that is handled by usePermalink).
 */

import { useState, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Duration (ms) the "Copied!" feedback is displayed before reverting. */
const TOAST_VISIBLE_MS = 2_000;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Copy text to the clipboard, falling back to the `execCommand` API for
 * browsers / contexts where the Clipboard API is unavailable.
 *
 * @param text - The text to copy.
 * @returns A promise that resolves when the copy is complete (or attempted).
 */
async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Legacy fallback (e.g. non-HTTPS contexts)
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A toolbar button that copies the current Chronicle URL to the clipboard.
 *
 * The URL includes the live permalink hash encoded by `usePermalink`, so
 * recipients who open the link will see the exact same viewport, selected
 * event, and region visibility as the sender.
 *
 * After a successful copy, the button transitions to a green "✓ Copied!" state
 * for {@link TOAST_VISIBLE_MS} ms before reverting to its idle appearance.
 *
 * @returns The ShareButton component.
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = useCallback(async () => {
    try {
      await copyToClipboard(window.location.href);
    } catch {
      // Silently ignore copy errors (e.g. permissions denied)
      return;
    }

    clearTimeout(resetTimerRef.current);
    setCopied(true);
    resetTimerRef.current = setTimeout(() => setCopied(false), TOAST_VISIBLE_MS);
  }, []);

  return (
    <button
      onClick={handleClick}
      title="Copy link to this view"
      aria-label={copied ? 'Link copied to clipboard' : 'Share this view'}
      style={{
        padding: '6px 12px',
        borderRadius: 8,
        backgroundColor: copied
          ? 'rgba(34,197,94,0.15)'
          : 'rgba(7,14,34,0.9)',
        border: copied
          ? '1px solid rgba(34,197,94,0.4)'
          : '1px solid rgba(96,165,250,0.3)',
        color: copied ? '#4ade80' : '#e2e8f0',
        fontSize: 12,
        fontFamily: '"Inter","Segoe UI",sans-serif',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
        backdropFilter: 'blur(12px)',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? '✓ Copied!' : '🔗 Share'}
    </button>
  );
}
