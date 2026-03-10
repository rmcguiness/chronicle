/**
 * BookmarksMenu.tsx
 *
 * Owns: bookmark dropdown UI — save/restore/delete named viewport states.
 * Does NOT own: bookmark persistence (store/index.ts), layout logic (NetworkView),
 *   or scrubber time-range state (TimelineScrubber).
 *
 * Renders as a floating button in the top-right corner of the canvas. Clicking
 * it opens a dropdown listing saved bookmarks. Each bookmark restores both the
 * ReactFlow camera transform AND the scrubber year range so nodes reposition
 * correctly for that era.
 *
 * Accessibility: keyboard-navigable dropdown (↑↓ to move, Enter/Space to
 * activate, Escape to close), ARIA menu roles, focus trap while open, and
 * returns focus to the trigger button on close.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAppStore } from '../store';
import type { Bookmark } from '../store';

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

/** Wrapper is `position: relative` so the dropdown anchors to it. */
const MENU_WRAPPER_STYLE: React.CSSProperties = {
  position: 'relative',
  fontFamily: '"Inter", "Segoe UI", sans-serif',
  zIndex: 30,
};

const TRIGGER_STYLE: React.CSSProperties = {
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
  whiteSpace: 'nowrap',
};

const DROPDOWN_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 4,
  minWidth: 256,
  maxHeight: 420,
  overflowY: 'auto',
  backgroundColor: 'rgba(7,14,34,0.97)',
  border: '1px solid rgba(96,165,250,0.25)',
  borderRadius: 8,
  padding: '6px 0',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
};

const SECTION_LABEL_STYLE: React.CSSProperties = {
  padding: '4px 12px 2px',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: 'rgba(148,163,184,0.5)',
  userSelect: 'none',
};

const DIVIDER_STYLE: React.CSSProperties = {
  borderTop: '1px solid rgba(255,255,255,0.08)',
  margin: '4px 0',
};

const ITEM_BASE_STYLE: React.CSSProperties = {
  padding: '7px 12px',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#cbd5e1',
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
};

const ITEM_FOCUSED_BG = 'rgba(96,165,250,0.12)';

const DELETE_BTN_STYLE: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  fontSize: 16,
  lineHeight: 1,
  padding: '0 2px',
  borderRadius: 3,
  flexShrink: 0,
  outline: 'none',
};

const SAVE_AREA_STYLE: React.CSSProperties = {
  padding: '8px 10px 4px',
  display: 'flex',
  gap: 6,
};

const INPUT_STYLE: React.CSSProperties = {
  flex: 1,
  padding: '5px 8px',
  borderRadius: 4,
  border: '1px solid rgba(255,255,255,0.15)',
  backgroundColor: 'rgba(0,0,0,0.3)',
  color: '#e2e8f0',
  fontSize: 11,
  outline: 'none',
  minWidth: 0,
};

const SAVE_BTN_STYLE: React.CSSProperties = {
  padding: '5px 10px',
  borderRadius: 4,
  border: '1px solid rgba(96,165,250,0.3)',
  backgroundColor: 'rgba(96,165,250,0.15)',
  color: '#60a5fa',
  fontSize: 11,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  outline: 'none',
  flexShrink: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a year as "3000 BCE", "1492", or "CE" for bookmark labels.
 *
 * @param year - Historical year (negative = BCE).
 * @returns Human-readable label string.
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return 'CE';
  return `${year}`;
}

/**
 * Build a human-readable era label from optional yearMin/yearMax.
 *
 * @param yearMin - Start year of the era.
 * @param yearMax - End year of the era.
 * @returns Era range string, or empty string if not available.
 */
function buildEraLabel(yearMin?: number, yearMax?: number): string {
  if (yearMin == null || yearMax == null) return '';
  return `${formatYear(yearMin)} – ${formatYear(yearMax)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * BookmarksMenu — dropdown button for saving and restoring named viewport
 * bookmarks on the Chronicle network canvas.
 *
 * Must be rendered inside a `ReactFlowProvider` so that `useReactFlow()` works.
 *
 * @returns The BookmarksMenu component.
 */
export default function BookmarksMenu() {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  /** Index of the keyboard-focused menu item (-1 = none, -2 = input, -3 = save button). */
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const reactFlow = useReactFlow();

  const bookmarks = useAppStore((s) => s.bookmarks);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);
  const timeViewport = useAppStore((s) => s.timeViewport);

  const defaultBookmarks = bookmarks.filter((b) => b.isDefault);
  const userBookmarks = bookmarks.filter((b) => !b.isDefault);
  /** Flat ordered list matching itemRefs indices. */
  const allItems: Bookmark[] = [...defaultBookmarks, ...userBookmarks];

  // ── Close on outside click ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Focus management ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    // Focus first item when menu opens
    setFocusedIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.focus();
    } else if (focusedIndex === -2) {
      inputRef.current?.focus();
    }
  }, [focusedIndex, open]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusedIndex(-1);
    // Return focus to trigger button
    triggerRef.current?.focus();
  }, []);

  const toggleMenu = () => {
    if (open) {
      closeMenu();
    } else {
      setOpen(true);
    }
  };

  // ── Restore bookmark ────────────────────────────────────────────────────
  /** Navigate to a saved bookmark by restoring its viewport and year range. */
  const handleRestore = useCallback(
    (bookmark: Bookmark) => {
      // Restore scrubber year range first so nodes reposition before the camera moves
      if (bookmark.yearMin != null && bookmark.yearMax != null) {
        setTimeViewport({ yearMin: bookmark.yearMin, yearMax: bookmark.yearMax });
      }
      // Animate to the saved ReactFlow camera position
      reactFlow.setViewport(
        { x: bookmark.x, y: bookmark.y, zoom: bookmark.zoom },
        { duration: 600 },
      );
      closeMenu();
    },
    [reactFlow, setTimeViewport, closeMenu],
  );

  // ── Save current viewport ───────────────────────────────────────────────
  /** Capture the current viewport + scrubber range as a named bookmark. */
  const handleSave = useCallback(() => {
    const name = newName.trim();
    if (!name) {
      inputRef.current?.focus();
      return;
    }
    const vp = reactFlow.getViewport();
    addBookmark({
      name,
      x: vp.x,
      y: vp.y,
      zoom: vp.zoom,
      yearMin: timeViewport.yearMin,
      yearMax: timeViewport.yearMax,
    });
    setNewName('');
    inputRef.current?.focus();
  }, [newName, reactFlow, addBookmark, timeViewport]);

  // ── Keyboard navigation ─────────────────────────────────────────────────
  /** Handle arrow-key / Escape / Enter navigation within the open dropdown. */
  const handleMenuKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeMenu();
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => {
            if (prev < allItems.length - 1) return prev + 1;
            return -2; // move to input
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => {
            if (prev === -2) return allItems.length - 1;
            if (prev > 0) return prev - 1;
            return -2; // wrap to input
          });
          break;

        case 'Tab':
          // Trap focus inside the dropdown
          e.preventDefault();
          if (e.shiftKey) {
            setFocusedIndex((prev) => {
              if (prev === -2) return allItems.length - 1;
              if (prev > 0) return prev - 1;
              return -2;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < allItems.length - 1) return prev + 1;
              return -2;
            });
          }
          break;

        default:
          break;
      }
    },
    [open, allItems.length, closeMenu],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapperRef}
      style={MENU_WRAPPER_STYLE}
      onKeyDown={handleMenuKeyDown}
    >
      {/* Trigger button */}
      <button
        ref={triggerRef}
        style={TRIGGER_STYLE}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Bookmarks menu"
        title="Saved viewport bookmarks"
      >
        🔖 Bookmarks
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Saved bookmarks"
          style={DROPDOWN_STYLE}
        >
          {/* Default era bookmarks */}
          <div style={SECTION_LABEL_STYLE} aria-hidden="true">
            Built-in Eras
          </div>
          {defaultBookmarks.map((bm, i) => (
            <button
              key={bm.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              role="menuitem"
              style={{
                ...ITEM_BASE_STYLE,
                backgroundColor:
                  focusedIndex === i ? ITEM_FOCUSED_BG : 'transparent',
              }}
              onClick={() => handleRestore(bm)}
              onMouseEnter={() => setFocusedIndex(i)}
              onMouseLeave={() => setFocusedIndex(-1)}
              title={buildEraLabel(bm.yearMin, bm.yearMax)}
            >
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bm.name}
              </span>
              {bm.yearMin != null && (
                <span style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', marginLeft: 8, flexShrink: 0 }}>
                  {formatYear(bm.yearMin)}
                </span>
              )}
            </button>
          ))}

          {/* User bookmarks section — only shown when user has saved some */}
          {userBookmarks.length > 0 && (
            <>
              <div style={DIVIDER_STYLE} />
              <div style={SECTION_LABEL_STYLE} aria-hidden="true">
                My Bookmarks
              </div>
              {userBookmarks.map((bm, i) => {
                const absIndex = defaultBookmarks.length + i;
                return (
                  <div
                    key={bm.id}
                    style={{
                      ...ITEM_BASE_STYLE,
                      backgroundColor:
                        focusedIndex === absIndex ? ITEM_FOCUSED_BG : 'transparent',
                      gap: 4,
                    }}
                    onMouseEnter={() => setFocusedIndex(absIndex)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                  >
                    <button
                      ref={(el) => { itemRefs.current[absIndex] = el; }}
                      role="menuitem"
                      style={{
                        flex: 1,
                        background: 'none',
                        border: 'none',
                        color: '#cbd5e1',
                        fontSize: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: 0,
                        outline: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                      }}
                      onClick={() => handleRestore(bm)}
                      title={buildEraLabel(bm.yearMin, bm.yearMax)}
                    >
                      {bm.name}
                    </button>
                    <button
                      role="menuitem"
                      aria-label={`Delete bookmark "${bm.name}"`}
                      onClick={() => removeBookmark(bm.id)}
                      style={DELETE_BTN_STYLE}
                      title={`Delete "${bm.name}"`}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {/* Save current view */}
          <div style={DIVIDER_STYLE} />
          <div style={SAVE_AREA_STYLE}>
            <input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  closeMenu();
                }
              }}
              onFocus={() => setFocusedIndex(-2)}
              placeholder="Save current view as…"
              aria-label="Bookmark name"
              style={INPUT_STYLE}
              maxLength={80}
            />
            <button
              onClick={handleSave}
              style={SAVE_BTN_STYLE}
              aria-label="Save current viewport as bookmark"
              title="Save current viewport"
              disabled={!newName.trim()}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
