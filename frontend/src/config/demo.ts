/**
 * Demo-mode flag.
 *
 * `VITE_DEMO_MODE=true` (set by `npm run build:demo` / `npm run dev:demo`) builds a
 * backend-free, read-only demo that reads `public/demo/snapshot.json` instead of the API.
 * Write features (event submission, admin review) and semantic search are disabled.
 */
export const IS_DEMO_MODE: boolean = import.meta.env.VITE_DEMO_MODE === 'true';

/** Public URL of the static demo snapshot (respects Vite's `base`). */
export function demoSnapshotUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}demo/snapshot.json`;
}

/** Build a Wikipedia search URL for an event title (used for attribution links in demo mode). */
export function wikipediaSearchUrl(title: string): string {
  return `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`;
}

/** Link to an English Wikipedia article from its page slug (e.g. "Battle_of_Hastings"). */
export function wikipediaArticleUrl(slug: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(slug.replace(/ /g, '_'))}`;
}
