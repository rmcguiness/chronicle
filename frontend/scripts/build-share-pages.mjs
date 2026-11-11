#!/usr/bin/env node
/**
 * Write crawler-readable share pages into dist/ after `vite build`.
 *
 * X, Slack, Discord and most link unfurlers read Open Graph tags from the raw HTML and
 * never run JavaScript, so the SPA's index.html alone would give every link the same
 * preview. For each event and chain in the demo snapshot this writes a copy of
 * dist/index.html with its own <title>, description, canonical URL, Open Graph and
 * Twitter card tags:
 *
 *   dist/event/<slug>.html  -> served at /event/<slug>  (vercel.json cleanUrls)
 *   dist/chain/<slug>.html  -> served at /chain/<slug>
 *   dist/chains.html        -> served at /chains
 *
 * The page still boots the SPA, so people who open the link land on the same route.
 * Card images come from the og function (api/og.js) at /og/<type>/<slug>.png.
 *
 * Absolute URLs need the site origin: SITE_URL if set, else the Vercel production
 * domain on production builds, else the deployment's branch or unique URL.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE_NAME = 'Chronicle';

export function siteOrigin(env = process.env) {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, '');
  if (env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  const host = env.VERCEL_BRANCH_URL || env.VERCEL_URL;
  return host ? `https://${host}` : 'http://localhost:4173';
}

export function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function yearLabel(year) {
  return year < 0 ? `${-year} BCE` : `${year}`;
}

function clip(text, max) {
  const s = String(text ?? '').trim();
  return s.length <= max ? s : `${s.slice(0, max - 1).trim()}…`;
}

/** Meta tags for one page. `image` must be absolute. */
export function metaTags({ title, description, url, image, imageAlt }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
  ].join('\n    ');
}

/** Replace index.html's <title> with the page's tags. */
export function injectMeta(indexHtml, tags) {
  const withoutTitle = indexHtml.replace(/<title>[\s\S]*?<\/title>\s*/, '');
  return withoutTitle.replace('</head>', `    ${tags}\n  </head>`);
}

function shortTitle(title) {
  return String(title).split(' — ')[0].trim();
}

export function eventPage(e, origin, linkCount) {
  const date = e.date_display || yearLabel(e.year_approx);
  const parts = [date, e.geo_modern, e.summary].filter(Boolean);
  const description = clip(
    `${parts.join(' · ')}${linkCount ? ` · ${linkCount} linked causes and effects on the Chronicle timeline.` : ''}`,
    200,
  );
  return {
    title: `${shortTitle(e.title)} (${date}) · ${SITE_NAME}`,
    description,
    url: `${origin}/event/${e.slug}`,
    image: `${origin}/og/event/${e.slug}.png`,
    imageAlt: `${shortTitle(e.title)}, ${date}, placed on a timeline of world history`,
  };
}

export function chainPage(chain, byId, origin) {
  const events = chain.event_ids.map((id) => byId.get(id));
  const steps = events.map((e) => `${shortTitle(e.title)} (${yearLabel(e.year_approx)})`);
  return {
    title: `${chain.title} · ${SITE_NAME}`,
    description: clip(`A ${events.length}-step cause and effect chain: ${steps.join(' → ')}`, 200),
    url: `${origin}/chain/${chain.slug}`,
    image: `${origin}/og/chain/${chain.slug}.png`,
    imageAlt: `Cause and effect chain: ${steps.join(', then ')}`,
  };
}

function main() {
  const snapshotPath = path.join(DIST, 'demo', 'snapshot.json');
  if (!existsSync(snapshotPath)) {
    // Non-demo builds drop dist/demo/; share pages are a demo feature.
    console.log('share pages: no dist/demo/snapshot.json (not a demo build), skipping');
    return;
  }
  const indexHtml = readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));
  const origin = siteOrigin();
  const byId = new Map(snapshot.events.map((e) => [e.id, e]));
  const degree = new Map();
  for (const l of snapshot.links) {
    degree.set(l.cause_event_id, (degree.get(l.cause_event_id) || 0) + 1);
    degree.set(l.effect_event_id, (degree.get(l.effect_event_id) || 0) + 1);
  }
  mkdirSync(path.join(DIST, 'event'), { recursive: true });
  mkdirSync(path.join(DIST, 'chain'), { recursive: true });
  for (const e of snapshot.events) {
    const html = injectMeta(indexHtml, metaTags(eventPage(e, origin, degree.get(e.id) || 0)));
    writeFileSync(path.join(DIST, 'event', `${e.slug}.html`), html);
  }
  const chains = snapshot.chains || [];
  for (const c of chains) {
    if (!c.event_ids.every((id) => byId.has(id))) continue;
    writeFileSync(path.join(DIST, 'chain', `${c.slug}.html`), injectMeta(indexHtml, metaTags(chainPage(c, byId, origin))));
  }
  const top = [...chains].sort((a, b) => b.score - a.score)[0];
  const indexTags = metaTags({
    title: `Cause and effect chains · ${SITE_NAME}`,
    description: `${chains.length} chains of linked historical events, from antiquity to today, drawn from the Chronicle timeline.`,
    url: `${origin}/chains`,
    image: top ? `${origin}/og/chain/${top.slug}.png` : `${origin}/og/event/${snapshot.events[0].slug}.png`,
    imageAlt: 'A cause and effect chain from the Chronicle timeline',
  });
  writeFileSync(path.join(DIST, 'chains.html'), injectMeta(indexHtml, indexTags));
  // Home page: the same chain card, so a bare link to the site unfurls with an image too.
  const homeTags = metaTags({
    title: 'Chronicle: an interactive timeline of history and its causes',
    description: `${snapshot.events.length.toLocaleString('en-US')} events from 3300 BCE to today on one zoomable canvas, joined by cause and effect links.`,
    url: `${origin}/`,
    image: top ? `${origin}/og/chain/${top.slug}.png` : `${origin}/og/event/${snapshot.events[0].slug}.png`,
    imageAlt: 'A cause and effect chain from the Chronicle timeline',
  }).replace('content="article"', 'content="website"');
  writeFileSync(path.join(DIST, 'index.html'), injectMeta(indexHtml, homeTags));
  console.log(`share pages: ${snapshot.events.length} events, ${chains.length} chains, origin ${origin}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
