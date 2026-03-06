/**
 * useKeyboardShortcuts — registers global keyboard shortcuts for the network view.
 *
 * Ignores keypresses when focus is inside an input, textarea, or contenteditable
 * element so that typing in the search bar or other form fields is not intercepted.
 */
import { useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Named key constants
// ─────────────────────────────────────────────────────────────────────────────

/** Open / focus the search panel. */
export const KEY_SEARCH = '/';

/** Close the innermost open layer. */
export const KEY_ESCAPE = 'Escape';

/** Toggle focus-mode hint in the status bar. */
export const KEY_FOCUS = 'f';

/** Jump to a random high-importance event. */
export const KEY_RANDOM = 'r';

/** Show the keyboard shortcuts help modal. */
export const KEY_HELP = '?';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Handlers supplied by the consuming component. All are optional. */
export interface KeyboardShortcutHandlers {
  /** Called when the user presses `/` — open/focus search. */
  onSearch?: () => void;
  /** Called when the user presses `Escape` — close innermost layer. */
  onEscape?: () => void;
  /** Called when the user presses `F` — toggle focus mode hint. */
  onFocus?: () => void;
  /** Called when the user presses `R` — jump to random event. */
  onRandom?: () => void;
  /** Called when the user presses `?` — show shortcuts help modal. */
  onHelp?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Register global `keydown` listeners for Chronicle keyboard shortcuts.
 *
 * Keypresses are ignored when the active element is an `<input>`, `<textarea>`,
 * or has `contentEditable` set, so search / form typing is never intercepted.
 *
 * @param handlers - Callback map keyed by shortcut action.
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Skip when typing in form elements (except Escape, which always works)
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (e.key === KEY_ESCAPE) {
        // Escape always fires — even from inputs (to blur / close panels)
        handlers.onEscape?.();
        return;
      }

      if (isInput) return;

      switch (e.key) {
        case KEY_SEARCH:
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case KEY_HELP:
          e.preventDefault();
          handlers.onHelp?.();
          break;
        case KEY_FOCUS:
        case KEY_FOCUS.toUpperCase():
          handlers.onFocus?.();
          break;
        case KEY_RANDOM:
        case KEY_RANDOM.toUpperCase():
          handlers.onRandom?.();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
}
