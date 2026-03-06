import { useState, useEffect, useCallback } from 'react';

/** CSS class applied to `document.documentElement` when dark mode is active. */
export const DARK_CLASS = 'dark';

/** localStorage key for persisting theme preference. */
const STORAGE_KEY = 'chronicle-theme';

/**
 * Determine the initial dark-mode preference.
 *
 * Reads from localStorage first; falls back to the OS-level
 * `prefers-color-scheme` media query.
 *
 * @returns `true` when dark mode should be active.
 */
function getInitialIsDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Apply or remove the `dark` CSS class on the root `<html>` element.
 *
 * @param isDark - Whether dark mode is active.
 */
function applyClass(isDark: boolean): void {
  if (isDark) {
    document.documentElement.classList.add(DARK_CLASS);
  } else {
    document.documentElement.classList.remove(DARK_CLASS);
  }
}

/**
 * Hook that manages light/dark theme state.
 *
 * Persists the user's choice in localStorage under `'chronicle-theme'`
 * and falls back to the operating-system preference on first visit.
 * Toggles a `'dark'` class on `<html>` so Tailwind's `dark:` variants
 * activate automatically.
 *
 * @returns An object with the current state and a toggle function.
 */
export function useDarkMode(): { isDark: boolean; toggle: () => void } {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  // Sync the class on mount and whenever isDark changes.
  useEffect(() => {
    applyClass(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggle };
}
