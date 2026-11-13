import { describe, expect, it } from 'vitest';
import { chainPage, escapeHtml, eventPage, injectMeta, metaTags, siteOrigin } from './build-share-pages.mjs';
import { cardSteps } from '../../api/_lib/cards.js';

const event = {
  id: 'battle-of-hastings-1066',
  slug: 'battle-of-hastings-1066',
  title: 'Battle of Hastings — Norman Conquest Begins',
  year_approx: 1066,
  date_display: 'October 14, 1066',
  geo_modern: 'Battle, England',
  summary: 'Battle between Normans and Anglo-Saxons',
};

describe('share page meta', () => {
  it('builds absolute OG and Twitter tags for an event', () => {
    const page = eventPage(event, 'https://example.vercel.app', 3);
    const tags = metaTags(page);
    expect(page.title).toBe('Battle of Hastings (October 14, 1066) · Chronicle');
    expect(tags).toContain('<meta property="og:image" content="https://example.vercel.app/og/event/battle-of-hastings-1066.png" />');
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(tags).toContain('<meta property="og:url" content="https://example.vercel.app/event/battle-of-hastings-1066" />');
    expect(page.description).toContain('3 linked causes and effects');
  });

  it('describes a chain step by step', () => {
    const other = { ...event, id: 'b', slug: 'b', title: 'Domesday Book', year_approx: 1086 };
    const byId = new Map([
      [event.id, event],
      ['b', other],
    ]);
    const page = chainPage({ slug: 'x-to-b', title: 'From Hastings to Domesday', event_ids: [event.id, 'b'] }, byId, 'https://e.app');
    expect(page.image).toBe('https://e.app/og/chain/x-to-b.png');
    expect(page.description).toContain('Battle of Hastings (1066) → Domesday Book (1086)');
  });

  it('uses a curated chain description and its confidence tally', () => {
    const byId = new Map([[event.id, event], ['b', { title: 'Domesday Book', year_approx: 1086 }]]);
    const chain = {
      slug: 'x-to-b', title: 'From Hastings to Domesday', event_ids: [event.id, 'b'],
      chain_type: 'scholarly', description: 'The conquest led to a survey of England.',
      confidence: { established: 1, debated: 0, speculative: 0 }, source_count: 2,
    };
    const page = chainPage(chain, byId, 'https://e.app');
    expect(page.description).toBe('The conquest led to a survey of England. Links rated: 1 established; 2 sources cited.');
    const generated = chainPage({ ...chain, chain_type: 'generated', description: undefined }, byId, 'https://e.app');
    expect(generated.description).not.toContain('Links rated');
  });

  it('keeps long chains readable on a card', () => {
    const events = Array.from({ length: 10 }, (_, i) => ({ title: `E${i}` }));
    const links = Array.from({ length: 9 }, (_, i) => ({ connection_type: 'direct', i }));
    const steps = cardSteps(events, links);
    expect(steps.events.map((e) => e.title)).toEqual(['E0', 'E1', 'E6', 'E7', 'E8', 'E9']);
    expect(steps.links[1]).toEqual({ gap: 4 });
    expect(steps.links).toHaveLength(steps.events.length - 1);
    expect(cardSteps(events.slice(0, 5), links.slice(0, 4)).events).toHaveLength(5);
  });

  it('replaces the title and escapes attribute values', () => {
    const html = '<html><head><title>Old</title></head><body></body></html>';
    const out = injectMeta(html, metaTags({ title: 'A "quoted" <title>', description: 'd', url: 'u', image: 'i', imageAlt: 'a' }));
    expect(out).not.toContain('<title>Old</title>');
    expect(out).toContain('<title>A &quot;quoted&quot; &lt;title&gt;</title>');
    expect(escapeHtml('&')).toBe('&amp;');
  });

  it('picks the production domain on production builds and the branch URL on previews', () => {
    expect(siteOrigin({ VERCEL_ENV: 'production', VERCEL_PROJECT_PRODUCTION_URL: 'chronicle.example' })).toBe('https://chronicle.example');
    expect(siteOrigin({ VERCEL_ENV: 'preview', VERCEL_BRANCH_URL: 'b.vercel.app', VERCEL_URL: 'u.vercel.app' })).toBe('https://b.vercel.app');
    expect(siteOrigin({ SITE_URL: 'https://x.dev/' })).toBe('https://x.dev');
  });
});
