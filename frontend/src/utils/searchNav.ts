/**
 * Pure helpers for the search dropdown: keyboard navigation and match highlighting.
 * Kept free of React so they can be unit-tested directly.
 */

/**
 * Next active option index for a key press in a listbox of `count` options.
 * -1 means "no option active" (focus stays on the input). Arrow keys wrap around;
 * Home/End jump to the first/last option. Returns `current` for unrelated keys.
 */
export function nextActiveIndex(current: number, count: number, key: string): number {
  if (count <= 0) return -1;
  switch (key) {
    case 'ArrowDown':
      return current < 0 || current >= count - 1 ? 0 : current + 1;
    case 'ArrowUp':
      return current <= 0 ? count - 1 : current - 1;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return current;
  }
}

/** A run of text, flagged when it matches one of the query terms. */
export interface HighlightPart {
  text: string;
  match: boolean;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split `text` into matching and non-matching runs for the words in `query`
 * (case-insensitive; words shorter than 2 characters are ignored).
 */
export function highlightParts(text: string, query: string): HighlightPart[] {
  const terms = Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length >= 2),
    ),
  ).sort((a, b) => b.length - a.length);
  if (!text) return [];
  if (terms.length === 0) return [{ text, match: false }];
  const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const parts: HighlightPart[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), match: false });
    parts.push({ text: m[0], match: true });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts;
}
