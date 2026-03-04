/**
 * BookmarkPanel.tsx
 *
 * Collapsible panel (fixed, bottom-right, above React-Flow zoom controls) that
 * lets the user save, browse, and jump to named viewport bookmarks.
 *
 * Responsibilities:
 *   - Render the toggle button (bookmark icon).
 *   - Render the "Save current view" input + button.
 *   - Render the list of saved bookmarks with jump / delete actions.
 *   - Delegate all state / persistence to `useBookmarks`.
 *
 * Does NOT:
 *   - Own bookmark data (that's useBookmarks).
 *   - Touch the react-flow viewport directly (that's useBookmarks).
 */

import { useState, useCallback, type KeyboardEvent, type ChangeEvent } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Number of ms used for CSS transitions. */
const TRANSITION_MS = 200 as const;

/** Width of the expanded panel in pixels. */
const PANEL_WIDTH = 280 as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format the current date + time as the default bookmark name.
 * e.g. "2026-03-04 03:41 AM"
 */
function defaultBookmarkName(): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BookmarkRowProps {
  id: string;
  name: string;
  onJump: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * A single row in the bookmark list: name (click to jump) + delete button.
 */
function BookmarkRow({ id, name, onJump, onDelete }: BookmarkRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 8px',
        borderRadius: 6,
        backgroundColor: hovered ? 'var(--surface-hover, rgba(255,255,255,0.06))' : 'transparent',
        transition: `background-color ${TRANSITION_MS}ms ease`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Jump button — full remaining width */}
      <button
        onClick={() => onJump(id)}
        title={`Jump to "${name}"`}
        style={{
          flex: 1,
          textAlign: 'left',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontSize: 13,
          color: 'var(--text-primary, #e2e8f0)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        📍 {name}
      </button>

      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        title="Delete bookmark"
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          fontSize: 14,
          color: 'var(--text-muted, rgba(255,255,255,0.35))',
          borderRadius: 4,
          lineHeight: 1,
          transition: `color ${TRANSITION_MS}ms ease`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-red, #f87171)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted, rgba(255,255,255,0.35))';
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * BookmarkPanel — collapsible UI for managing timeline viewport bookmarks.
 *
 * Must be rendered inside a `<ReactFlowProvider>` subtree so that the
 * underlying `useBookmarks` hook can access `useReactFlow()`.
 *
 * Position: fixed, bottom-right, sitting above React-Flow's built-in controls
 * (which sit at bottom-right with ~40px margin).
 */
export default function BookmarkPanel() {
  const { bookmarks, saveBookmark, deleteBookmark, jumpToBookmark } = useBookmarks();

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        // Pre-fill with current date/time when opening
        setInputValue(defaultBookmarkName());
      }
      return !prev;
    });
  }, []);

  const handleSave = useCallback(() => {
    const name = inputValue.trim() || defaultBookmarkName();
    saveBookmark(name);
    setInputValue(defaultBookmarkName());
  }, [inputValue, saveBookmark]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave],
  );

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,   // sit above react-flow zoom controls (~60px high)
        right: 12,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        pointerEvents: 'auto',
      }}
    >
      {/* ── Expanded panel ── */}
      {open && (
        <div
          style={{
            width: PANEL_WIDTH,
            backgroundColor: 'var(--surface, rgba(15,17,23,0.95))',
            border: '1px solid var(--border, rgba(255,255,255,0.1))',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted, rgba(255,255,255,0.45))',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            }}
          >
            Bookmarks ({bookmarks.length}/20)
          </div>

          {/* Save row */}
          <div
            style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--border, rgba(255,255,255,0.08))',
              display: 'flex',
              gap: 6,
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Bookmark name…"
              aria-label="Bookmark name"
              style={{
                flex: 1,
                minWidth: 0,
                padding: '5px 8px',
                borderRadius: 6,
                border: '1px solid var(--border, rgba(255,255,255,0.15))',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary, #e2e8f0)',
                fontSize: 12,
                outline: 'none',
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--accent-blue, #60a5fa)';
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor =
                  'var(--border, rgba(255,255,255,0.15))';
              }}
            />
            <button
              onClick={handleSave}
              title="Save current view"
              style={{
                flexShrink: 0,
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid var(--accent-blue, #3b82f6)',
                backgroundColor: 'var(--accent-blue, #3b82f6)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: `opacity ${TRANSITION_MS}ms ease`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
            >
              Save
            </button>
          </div>

          {/* Bookmark list */}
          <div
            style={{
              maxHeight: 300,
              overflowY: 'auto',
              padding: '6px 4px',
            }}
          >
            {bookmarks.length === 0 ? (
              <div
                style={{
                  padding: '16px 12px',
                  fontSize: 12,
                  color: 'var(--text-muted, rgba(255,255,255,0.35))',
                  textAlign: 'center',
                }}
              >
                No bookmarks yet.
                <br />
                Navigate somewhere and save!
              </div>
            ) : (
              bookmarks.map((bm) => (
                <BookmarkRow
                  key={bm.id}
                  id={bm.id}
                  name={bm.name}
                  onJump={jumpToBookmark}
                  onDelete={deleteBookmark}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={handleToggle}
        title={open ? 'Close bookmarks' : 'Open bookmarks'}
        aria-label={open ? 'Close bookmarks' : 'Open bookmarks'}
        aria-expanded={open}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1px solid ${open ? 'var(--accent-blue, #3b82f6)' : 'var(--border, rgba(255,255,255,0.15))'}`,
          backgroundColor: open
            ? 'var(--accent-blue, #3b82f6)'
            : 'var(--surface, rgba(15,17,23,0.92))',
          color: open ? '#fff' : 'var(--text-primary, #e2e8f0)',
          cursor: 'pointer',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          transition: `background-color ${TRANSITION_MS}ms ease, border-color ${TRANSITION_MS}ms ease, color ${TRANSITION_MS}ms ease`,
        }}
      >
        🔖
      </button>
    </div>
  );
}
