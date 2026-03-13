/**
 * ShareButton.tsx — "Share" toolbar button for Chronicle.
 *
 * Copies the current URL (including the live permalink hash) to the clipboard
 * and shows a brief "Link copied!" toast. On mobile, uses the Web Share API
 * if available for a native share sheet experience.
 *
 * Owns: clipboard interaction, Web Share API integration, toast visibility state.
 * Does NOT: read or write the URL hash directly (that is handled by usePermalink).
 */

import { useState, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Duration (ms) the "Link copied!" toast is displayed before reverting. */
const TOAST_VISIBLE_MS = 2_000;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Copy text to the clipboard, falling back to the `execCommand` API for
 * browsers / contexts where the Clipboard API is unavailable.
 */
async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

/** Check if Web Share API is available (typically mobile browsers). */
function canWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

// ─────────────────────────────────────────────────────────────────────────────
// Chain-link icon (SVG)
// ─────────────────────────────────────────────────────────────────────────────

function LinkIcon({ color }: { color: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A toolbar button that shares the current Chronicle URL.
 *
 * On mobile (Web Share API available): opens the native share sheet.
 * On desktop: copies the URL to clipboard and shows a toast.
 */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleClick = useCallback(async () => {
    const url = window.location.href;

    // Try Web Share API first (mobile)
    if (canWebShare()) {
      try {
        await navigator.share({
          title: 'Chronicle — Interactive Historical Timeline',
          url,
        });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard copy
      }
    }

    // Desktop fallback: copy to clipboard
    try {
      await copyToClipboard(url);
    } catch {
      return;
    }

    clearTimeout(resetTimerRef.current);
    setCopied(true);
    resetTimerRef.current = setTimeout(() => setCopied(false), TOAST_VISIBLE_MS);
  }, []);

  return (
    <>
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
        <LinkIcon color={copied ? '#4ade80' : '#e2e8f0'} />
        {copied ? 'Link copied!' : 'Share'}
      </button>

      {/* Toast notification — top-right corner */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            padding: '10px 16px',
            borderRadius: 8,
            backgroundColor: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.4)',
            color: '#4ade80',
            fontSize: 13,
            fontFamily: '"Inter","Segoe UI",sans-serif',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            animation: 'toast-fade-in 0.2s ease-out',
          }}
        >
          Link copied!
        </div>
      )}
    </>
  );
}
