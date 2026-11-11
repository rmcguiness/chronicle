/**
 * Open Graph card layouts for Chronicle share pages (1200x630), rendered with satori via
 * @vercel/og. Layouts are plain element objects so this file needs no JSX build step.
 *
 * Used by api/og.js (served at /og/event/<slug>.png and /og/chain/<slug>.png) and by
 * frontend/scripts/render-og-samples.mjs for local previews.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const WIDTH = 1200;
export const HEIGHT = 630;

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const CATEGORY_COLORS = {
  war: '#ef4444',
  discovery: '#3b82f6',
  political: '#a855f7',
  cultural: '#f97316',
  natural: '#22c55e',
  person: '#eab308',
};
export const CATEGORY_LABELS = {
  war: 'War & Conflict',
  discovery: 'Discovery & Science',
  political: 'Political',
  cultural: 'Culture & Society',
  natural: 'Natural Event',
  person: 'Person',
};
const LINK_VERB = { causes: 'caused', enables: 'enabled', context: 'led to' };

const BG = '#070e22';
const PANEL = '#0d1733';
const TEXT = '#f1f5f9';
const MUTED = '#94a3b8';
const FAINT = '#475569';
const ACCENT = '#60a5fa';

/** Inter (SIL OFL 1.1, api/_fonts/LICENSE-Inter-OFL.txt), Latin + Latin Extended. */
export function loadFonts() {
  const fonts = [];
  for (const weight of [400, 600, 800]) {
    for (const subset of ['latin', 'latin-ext']) {
      fonts.push({
        name: 'Inter',
        weight,
        style: 'normal',
        data: readFileSync(path.join(HERE, '..', '_fonts', `inter-${subset}-${weight}-normal.woff`)),
      });
    }
  }
  return fonts;
}

function h(type, style, ...children) {
  const kids = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  return { type, props: { style: { display: 'flex', ...style }, children: kids.length === 1 ? kids[0] : kids } };
}

export function yearLabel(year) {
  return year < 0 ? `${-year} BCE` : `${year}`;
}

function shortTitle(title) {
  return String(title).split(' — ')[0].trim();
}

function clip(text, max) {
  const s = String(text ?? '').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 12)).trim()}…`;
}

// Piecewise time axis: equal width per segment, so antiquity is not squeezed to a sliver.
const AXIS_STOPS = [-3500, -1000, 0, 1000, 1500, 1800, 2030];
function axisX(year, width) {
  const y = Math.max(AXIS_STOPS[0], Math.min(AXIS_STOPS[AXIS_STOPS.length - 1], year));
  const seg = width / (AXIS_STOPS.length - 1);
  for (let i = 0; i < AXIS_STOPS.length - 1; i++) {
    const a = AXIS_STOPS[i];
    const b = AXIS_STOPS[i + 1];
    if (y <= b) return seg * i + (seg * (y - a)) / (b - a);
  }
  return width;
}

function brand(host) {
  return h(
    'div',
    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 14 },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 6 },
        h('div', { width: 10, height: 10, borderRadius: 5, background: '#ef4444' }),
        h('div', { width: 22, height: 2, background: FAINT }),
        h('div', { width: 10, height: 10, borderRadius: 5, background: '#3b82f6' }),
        h('div', { width: 22, height: 2, background: FAINT }),
        h('div', { width: 10, height: 10, borderRadius: 5, background: '#a855f7' }),
      ),
      h('div', { fontSize: 24, fontWeight: 800, letterSpacing: 6, color: TEXT }, 'CHRONICLE'),
    ),
    h('div', { fontSize: 20, color: MUTED }, host),
  );
}

function miniTimeline({ year, color, related }) {
  const width = 1056;
  const x = axisX(year, width);
  const ticks = AXIS_STOPS.slice(0, -1).map((t) => ({ t, x: axisX(t, width) }));
  return h(
    'div',
    { display: 'flex', flexDirection: 'column', width, position: 'relative', height: 64 },
    h('div', { position: 'absolute', left: 0, top: 22, width, height: 2, background: '#1e293b' }),
    ...ticks.map(({ t, x: tx }) =>
      h(
        'div',
        { position: 'absolute', left: tx, top: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
        h('div', { width: 2, height: 14, background: '#334155' }),
        h('div', { fontSize: 16, color: FAINT, marginTop: 8 }, t === 0 ? '1 CE' : yearLabel(t)),
      ),
    ),
    ...(related || []).map((r) =>
      h('div', {
        position: 'absolute',
        left: axisX(r.year, width) - 5,
        top: 18,
        width: 10,
        height: 10,
        borderRadius: 5,
        background: CATEGORY_COLORS[r.category] || MUTED,
        opacity: 0.75,
      }),
    ),
    h('div', {
      position: 'absolute',
      left: x - 13,
      top: 10,
      width: 26,
      height: 26,
      borderRadius: 13,
      background: color,
      border: `4px solid ${BG}`,
      boxShadow: `0 0 0 3px ${color}`,
    }),
  );
}

/**
 * @param {{title:string, date:string, year:number, place?:string, summary?:string,
 *          category:string, era?:string, related?:{year:number,category:string}[],
 *          connections?:number, host:string}} e
 */
export function eventCard(e) {
  const color = CATEGORY_COLORS[e.category] || ACCENT;
  const title = shortTitle(e.title);
  const titleSize = title.length > 70 ? 46 : title.length > 44 ? 56 : 68;
  return h(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '44px 72px 40px',
      background: `linear-gradient(135deg, ${BG} 0%, ${PANEL} 100%)`,
      color: TEXT,
      fontFamily: 'Inter',
      borderTop: `10px solid ${color}`,
    },
    brand(e.host),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: 18 },
      h(
        'div',
        { display: 'flex', alignItems: 'center', gap: 16, fontSize: 24 },
        h(
          'div',
          {
            display: 'flex',
            padding: '6px 16px',
            borderRadius: 999,
            background: `${color}26`,
            color,
            fontWeight: 600,
          },
          CATEGORY_LABELS[e.category] || 'Event',
        ),
        h('div', { color: TEXT, fontWeight: 600 }, e.date),
        e.era ? h('div', { color: MUTED }, `· ${e.era}`) : null,
      ),
      h('div', { fontSize: titleSize, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1 }, clip(title, 110)),
      e.place ? h('div', { fontSize: 26, color: MUTED }, clip(e.place, 70)) : null,
      e.summary ? h('div', { fontSize: 26, color: '#cbd5e1', lineHeight: 1.35 }, clip(e.summary, 150)) : null,
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: 6 },
      miniTimeline({ year: e.year, color, related: e.related }),
      h(
        'div',
        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: MUTED },
        h('div', {}, e.connections ? `${e.connections} linked ${e.connections === 1 ? 'event' : 'events'} on the timeline` : 'On the Chronicle timeline'),
        h('div', { color: ACCENT, fontWeight: 600 }, 'Explore the timeline →'),
      ),
    ),
  );
}

/**
 * @param {{title:string, events:{title:string,date:string,year:number,category:string}[],
 *          links:{connection_type:string}[], host:string}} c
 */
export function chainCard(c) {
  const n = c.events.length;
  const first = c.events[0];
  const last = c.events[n - 1];
  const nodeW = n <= 4 ? 220 : n === 5 ? 160 : 128;
  const titleSize = n <= 4 ? 24 : n === 5 ? 21 : 19;
  return h(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '44px 64px 40px',
      background: `linear-gradient(135deg, ${BG} 0%, ${PANEL} 100%)`,
      color: TEXT,
      fontFamily: 'Inter',
      borderTop: `10px solid ${ACCENT}`,
    },
    brand(c.host),
    h(
      'div',
      { display: 'flex', flexDirection: 'column', gap: 10 },
      h('div', { fontSize: 22, color: ACCENT, fontWeight: 600, letterSpacing: 3 }, 'CAUSE & EFFECT CHAIN'),
      h(
        'div',
        { fontSize: c.title.length > 70 ? 38 : 46, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.5 },
        clip(c.title, 100),
      ),
    ),
    h(
      'div',
      { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' },
      ...c.events.flatMap((e, i) => {
        const color = CATEGORY_COLORS[e.category] || ACCENT;
        const node = h(
          'div',
          { display: 'flex', flexDirection: 'column', alignItems: 'center', width: nodeW, flexShrink: 0, gap: 10 },
          h('div', { fontSize: 22, fontWeight: 800, color }, e.date),
          h('div', {
            width: 30,
            height: 30,
            borderRadius: 15,
            background: color,
            border: `5px solid ${BG}`,
            boxShadow: `0 0 0 3px ${color}`,
          }),
          h(
            'div',
            { fontSize: titleSize, fontWeight: 600, textAlign: 'center', lineHeight: 1.2, color: TEXT },
            clip(shortTitle(e.title), n <= 4 ? 60 : n === 5 ? 46 : 38),
          ),
        );
        if (i === n - 1) return [node];
        const verb = LINK_VERB[c.links[i]?.connection_type] || 'led to';
        const arrow = h(
          'div',
          { display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 40, marginTop: 47, gap: 6 },
          h(
            'div',
            { display: 'flex', alignItems: 'center', width: '100%' },
            h('div', { flexGrow: 1, height: 3, background: '#475569' }),
            {
              type: 'svg',
              props: {
                width: 14,
                height: 16,
                viewBox: '0 0 14 16',
                children: { type: 'path', props: { d: 'M0 0 L14 8 L0 16 Z', fill: '#64748b' } },
              },
            },
          ),
          h('div', { fontSize: 15, color: MUTED }, verb),
        );
        return [node, arrow];
      }),
    ),
    h(
      'div',
      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 20, color: MUTED },
      h('div', {}, `${first.date} → ${last.date} · ${n} linked events`),
      h('div', { color: ACCENT, fontWeight: 600 }, 'Follow the chain on the timeline →'),
    ),
  );
}

/** Index the demo snapshot for card lookups. */
export function indexSnapshot(snapshot) {
  const events = new Map(snapshot.events.map((e) => [e.slug, e]));
  const chains = new Map((snapshot.chains || []).map((c) => [c.slug, c]));
  const neighbors = new Map();
  for (const l of snapshot.links) {
    for (const [a, b] of [
      [l.cause_event_id, l.effect_event_id],
      [l.effect_event_id, l.cause_event_id],
    ]) {
      if (!neighbors.has(a)) neighbors.set(a, []);
      neighbors.get(a).push(b);
    }
  }
  const links = new Map(snapshot.links.map((l) => [l.id, l]));
  return { events, chains, neighbors, links };
}

export function eventCardData(index, slug, host) {
  const e = index.events.get(slug);
  if (!e) return null;
  const related = (index.neighbors.get(e.id) || [])
    .map((id) => index.events.get(id))
    .filter(Boolean)
    .map((r) => ({ year: r.year_approx, category: r.category }));
  return {
    title: e.title,
    date: e.date_display || yearLabel(e.year_approx),
    year: e.year_approx,
    place: e.geo_modern,
    summary: e.summary,
    category: e.category,
    era: e.geo_era_label,
    related,
    connections: related.length,
    host,
  };
}

export function chainCardData(index, slug, host) {
  const c = index.chains.get(slug);
  if (!c) return null;
  const events = c.event_ids.map((id) => index.events.get(id)).filter(Boolean);
  if (events.length !== c.event_ids.length) return null;
  return {
    title: c.title,
    events: events.map((e) => ({
      title: e.title,
      date: yearLabel(e.year_approx),
      year: e.year_approx,
      category: e.category,
    })),
    links: c.link_ids.map((id) => index.links.get(id) || { connection_type: 'context' }),
    host,
  };
}
