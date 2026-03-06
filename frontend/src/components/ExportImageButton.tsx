/**
 * ExportImageButton.tsx
 *
 * Toolbar button that captures the current network view as a PNG image
 * and downloads it. Shows a brief "Exporting..." disabled state while
 * html2canvas renders the viewport.
 *
 * Owns: export trigger, loading state.
 * Does NOT own: capture logic (delegated to exportCanvas util).
 */

import { useState, useCallback } from 'react';
import { exportNetworkAsImage } from '../utils/exportCanvas';

/**
 * A toolbar button with a camera icon that exports the network view as PNG.
 */
export default function ExportImageButton() {
  const [exporting, setExporting] = useState(false);

  const handleClick = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await exportNetworkAsImage();
    } catch {
      // Silently ignore — the viewport may not be rendered yet
    } finally {
      setExporting(false);
    }
  }, [exporting]);

  return (
    <button
      onClick={handleClick}
      disabled={exporting}
      title="Export network as image"
      aria-label={exporting ? 'Exporting image…' : 'Export network as image'}
      style={{
        position: 'fixed',
        top: 16,
        right: 60,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: exporting
          ? '1px solid rgba(34,197,94,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: exporting
          ? 'rgba(34,197,94,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: exporting ? '#4ade80' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: exporting ? 'wait' : 'pointer',
        opacity: exporting ? 0.7 : 1,
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 16 }}>{exporting ? '⏳' : '📷'}</span>
      {exporting ? 'Exporting…' : 'Export'}
    </button>
  );
}
