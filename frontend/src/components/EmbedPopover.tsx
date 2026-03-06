/**
 * EmbedPopover — popover showing embeddable iframe snippet and direct URL.
 *
 * Triggered by the '</> Embed' button in EventDetailPanel.
 * Copies iframe code or direct URL to clipboard with a brief "Copied!" toast.
 */
import { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Named constants
// ─────────────────────────────────────────────────────────────────────────────

const CHRONICLE_URL = 'https://chronicle.app';
const IFRAME_WIDTH = 400;
const IFRAME_HEIGHT = 300;
const COPIED_TOAST_MS = 1500;
const POPOVER_Z_INDEX = 120;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface EmbedPopoverProps {
  slug: string;
  onClose: () => void;
}

export default function EmbedPopover({ slug, onClose }: EmbedPopoverProps) {
  const [copiedField, setCopiedField] = useState<'iframe' | 'url' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const embedUrl = `${CHRONICLE_URL}/embed/event/${slug}`;
  const directUrl = `${CHRONICLE_URL}/event/${slug}`;
  const iframeSnippet = `<iframe src="${embedUrl}" width="${IFRAME_WIDTH}" height="${IFRAME_HEIGHT}" frameborder="0"></iframe>`;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  async function copyToClipboard(text: string, field: 'iframe' | 'url') {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), COPIED_TOAST_MS);
    } catch {
      // Fallback: select text manually (rare in modern browsers)
    }
  }

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        width: 340,
        padding: 16,
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: POPOVER_Z_INDEX,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Embed Event</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: 16,
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Iframe snippet */}
      <label style={labelStyle}>Embed Code</label>
      <div style={codeBoxStyle}>
        <code style={{ fontSize: 11, color: '#94a3b8', wordBreak: 'break-all', lineHeight: 1.5 }}>
          {iframeSnippet}
        </code>
      </div>
      <button
        onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
        style={copyBtnStyle}
      >
        {copiedField === 'iframe' ? 'Copied!' : 'Copy Code'}
      </button>

      {/* Direct URL */}
      <label style={{ ...labelStyle, marginTop: 14 }}>Direct URL</label>
      <div style={codeBoxStyle}>
        <code style={{ fontSize: 11, color: '#94a3b8', wordBreak: 'break-all' }}>
          {directUrl}
        </code>
      </div>
      <button
        onClick={() => copyToClipboard(directUrl, 'url')}
        style={copyBtnStyle}
      >
        {copiedField === 'url' ? 'Copied!' : 'Copy URL'}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
};

const codeBoxStyle: React.CSSProperties = {
  padding: '8px 10px',
  backgroundColor: 'rgba(0,0,0,0.3)',
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.08)',
  marginBottom: 8,
};

const copyBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 0',
  fontSize: 12,
  fontWeight: 700,
  color: '#e2e8f0',
  backgroundColor: 'rgba(96, 165, 250, 0.15)',
  border: '1px solid rgba(96, 165, 250, 0.3)',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'background 0.15s',
};
