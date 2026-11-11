#!/usr/bin/env node
/**
 * Render sample Open Graph cards locally with the same layouts api/og.js serves.
 *
 * Usage (repo root, after `npm ci`):
 *   node scripts/render-og-samples.mjs [outDir] [count]
 *
 * Writes event-<slug>.png and chain-<slug>.png for the best-known events and the
 * top-scoring chains in frontend/public/demo/snapshot.json.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from '@vercel/og';
import {
  HEIGHT,
  WIDTH,
  chainCard,
  chainCardData,
  eventCard,
  eventCardData,
  indexSnapshot,
  loadFonts,
} from '../api/_lib/cards.js';

const outDir = process.argv[2] || 'og-samples';
const count = Number(process.argv[3] || 4);
const host = process.env.SHARE_HOST || 'chronicle-taupe-seven.vercel.app';
const snapshot = JSON.parse(readFileSync('frontend/public/demo/snapshot.json', 'utf8'));
const index = indexSnapshot(snapshot);
const fonts = loadFonts();
mkdirSync(outDir, { recursive: true });

async function render(element, file) {
  const res = new ImageResponse(element, { width: WIDTH, height: HEIGHT, fonts });
  writeFileSync(path.join(outDir, file), Buffer.from(await res.arrayBuffer()));
  console.log(path.join(outDir, file));
}

const events = [...snapshot.events]
  .sort((a, b) => b.importance_score - a.importance_score || a.slug.localeCompare(b.slug))
  .filter((e, i, all) => all.findIndex((x) => Math.floor(x.year_approx / 500) === Math.floor(e.year_approx / 500)) === i)
  .slice(0, count);
for (const e of events) await render(eventCard(eventCardData(index, e.slug, host)), `event-${e.slug}.png`);

const chains = [...(snapshot.chains || [])].sort((a, b) => b.score - a.score).slice(0, count);
for (const c of chains) await render(chainCard(chainCardData(index, c.slug, host)), `chain-${c.slug}.png`);

// Extra cards by name: node scripts/render-og-samples.mjs out 4 event:<slug> chain:<slug>
for (const arg of process.argv.slice(4)) {
  const [type, slug] = arg.split(':');
  const card = type === 'chain' ? chainCard(chainCardData(index, slug, host)) : eventCard(eventCardData(index, slug, host));
  await render(card, `${type}-${slug}.png`);
}
