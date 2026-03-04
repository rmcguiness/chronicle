/**
 * BookmarksMenu.tsx
 *
 * A dropdown menu in the top-right corner of the canvas that lets users
 * save and restore named viewport bookmarks. Bookmarks persist in localStorage
 * under the key `chronicle_bookmarks`.
 *
 * This component owns the bookmark UI only; state lives in the Zustand store.
 */

import { useState, useRef, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAppStore } from '../store';
import type { Bookmark } from '../store';

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const MENU_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 20,
  fontFamily: '"Inter", "Segoe UI", sans-serif',
};

const BUTTON_STYLE: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  backgroundColor: 'rgba(7,14,34,0.9)',
  border: '1px solid rgba(96,165,250,0.3)',
  color: '#e2e8f0',
  fontSize: 12,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 4,
  minWidth: 240,
  backgroundColor: 'rgba(7,14,34,0.95)',
  border: '1px solid rgba(96,165,250,0.25)',
  borderRadius: 8,
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const ITEM_STYLE: React.CSSProperties = {
  padding: '6px 10px',
  borderRadius: 6,
  backgroundColor: 'transparent',
  border: 'none',
  color: '#cbd5e1',
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dropdown menu for saving/restoring named viewport bookmarks.
 * Renders in the top-right corner of the canvas.
 *
 * @returns The BookmarksMenu component
 */
export default function BookmarksMenu() {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  const bookmarks = useAppStore((s) => s.bookmarks);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /** Restore viewport from a bookmark */
  const handleRestore = (bookmark: Bookmark) => {
    reactFlow.setViewport(
      { x: bookmark.x, y: bookmark.y, zoom: bookmark.zoom },
      { duration: 800 }
    );
    setOpen(false);
  };

  /** Save the current viewport as a new bookmark */
  const handleSave = () => {
    const name = newName.trim();
    if (!name) return;
    const vp = reactFlow.getViewport();
    addBookmark({ name, x: vp.x, y: vp.y, zoom: vp.zoom });
    setNewName('');
  };

  return (
    <div ref={menuRef} style={MENU_STYLE}>
      <button style={BUTTON_STYLE} onClick={() => setOpen(!open)}>
        🔖 Bookmarks
      </button>

      {open && (
        <div style={DROPDOWN_STYLE}>
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              style={ITEM_STYLE}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(96,165,250,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              }}
            >
              <span
                style={{ cursor: 'pointer', flex: 1 }}
                onClick={() => handleRestore(bm)}
              >
                {bm.name}
              </span>
              {!bm.isDefault && (
                <button
                  onClick={() => removeBookmark(bm.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: '0 4px',
                  }}
                  title="Delete bookmark"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {/* Save current view */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 6, marginTop: 4, display: 'flex', gap: 4 }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Save current view…"
              style={{
                flex: 1,
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#e2e8f0',
                fontSize: 11,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSave}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid rgba(96,165,250,0.3)',
                backgroundColor: 'rgba(96,165,250,0.15)',
                color: '#60a5fa',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
