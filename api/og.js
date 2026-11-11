/**
 * GET /api/og?type=event|chain&slug=<slug>  (rewritten from /og/<type>/<slug>.png)
 *
 * Renders a 1200x630 Open Graph card for a demo event or cause-and-effect chain.
 * Data comes from the committed demo snapshot, so the function has no other inputs.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from '@vercel/og';
import { HEIGHT, WIDTH, chainCard, chainCardData, eventCard, eventCardData, indexSnapshot, loadFonts } from './_lib/cards.js';

let cached = null;
function load() {
  if (!cached) {
    const file = path.join(process.cwd(), 'frontend', 'public', 'demo', 'snapshot.json');
    cached = { index: indexSnapshot(JSON.parse(readFileSync(file, 'utf8'))), fonts: loadFonts() };
  }
  return cached;
}

export function GET(request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const slug = (url.searchParams.get('slug') || '').replace(/\.png$/, '');
  const host = process.env.SHARE_HOST || url.host;
  const { index, fonts } = load();
  const data = type === 'chain' ? chainCardData(index, slug, host) : type === 'event' ? eventCardData(index, slug, host) : null;
  if (!data) return new Response('Not found', { status: 404 });
  return new ImageResponse(type === 'chain' ? chainCard(data) : eventCard(data), {
    width: WIDTH,
    height: HEIGHT,
    fonts,
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' },
  });
}
