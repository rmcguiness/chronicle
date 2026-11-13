/**
 * ChainPages — shareable cause-and-effect chains from the demo snapshot.
 *
 * Routes:
 *  /chains        → ChainsIndexPage: every chain, oldest first
 *  /chain/:slug   → ChainPage: one chain drawn as a sequence, with link notes
 *
 * Chains are computed by scripts/chains.py and stored in public/demo/snapshot.json.
 * The snapshot is a static file, so these pages work with or without the backend.
 * Crawler-facing meta tags for the same URLs are written at build time by
 * scripts/build-share-pages.mjs.
 */
import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadDemoSnapshot, type DemoChain, type DemoSnapshot } from '../api/demo';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';
import { shortTitle, timelineHrefForSpan, yearLabel } from '../utils/share';
import type { CausalityLink, HistoricalEvent } from '../types';
import { ConfidenceBadge, SourcesToggle } from '../components/Evidence';
import { CHAIN_TYPE_LABELS, CONFIDENCE_COLORS, CONFIDENCE_HINTS, CONFIDENCE_LABELS } from '../utils/evidence';

const LINK_VERB: Record<string, string> = { causes: 'caused', enables: 'enabled', context: 'led to' };

function useSnapshot() {
  return useQuery({ queryKey: ['demo-snapshot'], queryFn: () => loadDemoSnapshot(), staleTime: Infinity });
}

function resolveChain(snapshot: DemoSnapshot, chain: DemoChain) {
  const byId = new Map(snapshot.events.map((e) => [e.id, e]));
  const linkById = new Map(snapshot.links.map((l) => [l.id, l]));
  const events = chain.event_ids.map((id) => byId.get(id)).filter((e): e is HistoricalEvent => Boolean(e));
  const links = chain.link_ids.map((id) => linkById.get(id));
  return { events, links };
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '32px 24px 96px' }}>{children}</div>
    </div>
  );
}

const navLink = {
  display: 'inline-flex',
  fontSize: 13,
  color: '#94a3b8',
  textDecoration: 'none',
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(255,255,255,0.04)',
} as const;

function Status({ text }: { text: string }) {
  return <p style={{ color: '#94a3b8', fontSize: 15, padding: '48px 0' }}>{text}</p>;
}

function Step({ event, index }: { event: HistoricalEvent; index: number }) {
  const color = CATEGORY_COLORS[event.category] ?? '#60a5fa';
  return (
    <li style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: 18,
          height: 18,
          marginTop: 4,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 0 4px #070e22, 0 0 0 6px ${color}`,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color, fontWeight: 700, letterSpacing: 0.3 }}>
          {event.date_display ?? yearLabel(event.year_approx)} · {CATEGORY_LABELS[event.category] ?? event.category}
        </div>
        <Link
          to={`/event/${event.slug}`}
          style={{ display: 'block', fontSize: 20, fontWeight: 700, color: '#f1f5f9', textDecoration: 'none', margin: '4px 0' }}
        >
          <span className="sr-only">Step {index + 1}: </span>
          {shortTitle(event.title)}
        </Link>
        {(event.geo_modern || event.summary) && (
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.5 }}>
            {[event.geo_modern, event.summary].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </li>
  );
}

function Connector({ link }: { link: CausalityLink | undefined }) {
  const level = link?.confidence;
  const lineColor = level ? `${CONFIDENCE_COLORS[level]}99` : 'rgba(148,163,184,0.35)';
  return (
    <li aria-hidden={!link?.description} style={{ display: 'flex', gap: 16, margin: '6px 0' }}>
      <span style={{ width: 18, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <span
          style={{
            width: 0,
            minHeight: 36,
            borderLeft: `2px ${level === 'speculative' ? 'dashed' : 'solid'} ${lineColor}`,
          }}
        />
      </span>
      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, padding: '6px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong style={{ color: '#94a3b8' }}>↓ {LINK_VERB[link?.connection_type ?? 'context'] ?? 'led to'}</strong>
          {level && <ConfidenceBadge level={level} />}
        </div>
        {link?.rationale ? (
          <p style={{ marginTop: 2 }}>{link.rationale}</p>
        ) : link?.description ? (
          <p style={{ marginTop: 2 }}>{link.description}</p>
        ) : null}
        {link?.citations && <SourcesToggle citations={link.citations} />}
      </div>
    </li>
  );
}

function ChainEvidenceSummary({ chain }: { chain: DemoChain }) {
  const tally = chain.confidence;
  if (!tally || chain.chain_type === 'generated') return null;
  const levels = (['established', 'debated', 'speculative'] as const).filter((l) => (tally[l] ?? 0) > 0);
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
      {levels.map((l) => (
        <span key={l} title={CONFIDENCE_HINTS[l]} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: CONFIDENCE_COLORS[l] }} />
          {tally[l]} {CONFIDENCE_LABELS[l].toLowerCase()}
        </span>
      ))}
      {chain.source_count ? <span>· {chain.source_count} sources cited</span> : null}
    </div>
  );
}

export function ChainPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: snapshot, isLoading, isError } = useSnapshot();
  const chain = snapshot?.chains?.find((c) => c.slug === slug);

  useEffect(() => {
    if (chain) document.title = `${chain.title} · Chronicle`;
  }, [chain]);

  if (isLoading) return <Shell><Status text="Loading chain…" /></Shell>;
  if (isError || !snapshot) return <Shell><Status text="Couldn't load the timeline data." /></Shell>;
  if (!chain) {
    return (
      <Shell>
        <Status text="This chain isn't in the current dataset." />
        <Link to="/chains" style={navLink}>See all chains</Link>
      </Shell>
    );
  }
  const { events, links } = resolveChain(snapshot, chain);
  const first = events[0];
  const last = events[events.length - 1];
  return (
    <Shell>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        <Link to="/" style={navLink}>← Timeline</Link>
        <Link to="/chains" style={navLink}>All chains</Link>
      </nav>
      <p
        style={{
          fontSize: 13,
          color: chain.chain_type === 'popular_internet' ? '#fbbf24' : '#60a5fa',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        {CHAIN_TYPE_LABELS[chain.chain_type ?? 'generated']}
      </p>
      <h1 style={{ fontSize: 32, lineHeight: 1.15, margin: '8px 0 8px' }}>{chain.title}</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 12 }}>
        {events.length} linked events, {yearLabel(first.year_approx)} to {yearLabel(last.year_approx)}
      </p>
      {chain.description && (
        <p style={{ color: '#cbd5e1', fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{chain.description}</p>
      )}
      <ChainEvidenceSummary chain={chain} />
      <ol style={{ listStyle: 'none', padding: 0 }}>
        {events.flatMap((e, i) =>
          i < events.length - 1
            ? [<Step key={e.id} event={e} index={i} />, <Connector key={`${e.id}-link`} link={links[i]} />]
            : [<Step key={e.id} event={e} index={i} />],
        )}
      </ol>
      <a
        href={timelineHrefForSpan(first.slug)}
        style={{ ...navLink, marginTop: 32, color: '#60a5fa', fontSize: 15, padding: '10px 16px' }}
      >
        Follow this chain on the timeline →
      </a>
    </Shell>
  );
}

export function ChainsIndexPage() {
  const { data: snapshot, isLoading, isError } = useSnapshot();

  useEffect(() => {
    document.title = 'Cause and effect chains · Chronicle';
  }, []);

  if (isLoading) return <Shell><Status text="Loading chains…" /></Shell>;
  if (isError || !snapshot) return <Shell><Status text="Couldn't load the timeline data." /></Shell>;
  const chains = snapshot.chains ?? [];
  return (
    <Shell>
      <nav style={{ marginBottom: 28 }}>
        <Link to="/" style={navLink}>← Timeline</Link>
      </nav>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Cause and effect chains</h1>
      <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 28 }}>
        {chains.length} sequences of linked events from the timeline, each with its own shareable page.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
        {chains.map((c) => {
          const { events } = resolveChain(snapshot, c);
          if (events.length < 2) return null;
          return (
            <li key={c.slug}>
              <Link
                to={`/chain/${c.slug}`}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f1f5f9',
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                  {yearLabel(events[0].year_approx)} → {yearLabel(events[events.length - 1].year_approx)} · {events.length} events
                  {c.chain_type && c.chain_type !== 'generated' && (
                    <span style={{ color: c.chain_type === 'popular_internet' ? '#fbbf24' : '#60a5fa' }}>
                      {' '}
                      · {CHAIN_TYPE_LABELS[c.chain_type]}
                      {c.source_count ? `, ${c.source_count} sources` : ''}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, margin: '2px 0 6px' }}>{c.title}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  {events.map((e, i) => (
                    <span key={e.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#cbd5e1' }}>
                      <span
                        aria-hidden
                        style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[e.category] ?? '#60a5fa' }}
                      />
                      {shortTitle(e.title)}
                      {i < events.length - 1 && <span style={{ color: '#475569' }}>→</span>}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
