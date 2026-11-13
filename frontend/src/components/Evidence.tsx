/**
 * Evidence.tsx — citations, confidence badges and per-party perspectives for cited data.
 *
 * Owns: presentation of curated (data/curated/) evidence: a source list, a confidence
 * badge, a party perspective card and a "how these events connect" list.
 * Does NOT own: data loading or the event panel layout (EventDetailPanel.tsx).
 */
import { useState } from 'react';
import type { ConnectedEvent, LinkConfidence, Perspective, Source } from '../types';
import { CONFIDENCE_COLORS, CONFIDENCE_HINTS, CONFIDENCE_LABELS, publicationYear } from '../utils/evidence';

const MUTED = '#94a3b8';
const FAINT = '#64748b';

/** Small pill for a link's confidence. Speculative uses a dashed outline. */
export function ConfidenceBadge({ level }: { level: LinkConfidence }) {
  const color = CONFIDENCE_COLORS[level];
  return (
    <span
      title={CONFIDENCE_HINTS[level]}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: 10,
        fontWeight: 700,
        padding: '1px 7px',
        borderRadius: 999,
        color,
        border: `1px ${level === 'speculative' ? 'dashed' : 'solid'} ${color}88`,
        backgroundColor: level === 'established' ? `${color}1a` : 'transparent',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {CONFIDENCE_LABELS[level]}
    </span>
  );
}

/** Numbered list of citations: title (linked), author · publisher · year, quote, locator. */
export function CitationList({ citations }: { citations: Source[] }) {
  return (
    <ol style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 8 }}>
      {citations.map((c) => {
        const year = publicationYear(c.publication_date);
        const meta = [c.author, c.publication, year].filter(Boolean).join(' · ');
        return (
          <li key={c.id} style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
            {c.original_url ? (
              <a href={c.original_url} target="_blank" rel="noopener noreferrer" style={{ color: '#bfdbfe', fontWeight: 600 }}>
                {c.title}
              </a>
            ) : (
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{c.title}</span>
            )}
            {meta && <span> · {meta}</span>}
            {c.source_type === 'primary' && <span style={{ color: '#4ade80' }}> · primary source</span>}
            {c.quote && (
              <div style={{ marginTop: 3, color: '#cbd5e1', fontStyle: 'italic', borderLeft: '2px solid rgba(255,255,255,0.15)', paddingLeft: 8 }}>
                &ldquo;{c.quote}&rdquo;{c.locator ? <span style={{ fontStyle: 'normal', color: FAINT }}> ({c.locator})</span> : null}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** "3 sources" toggle that reveals a CitationList. */
export function SourcesToggle({ citations, label }: { citations: Source[]; label?: string }) {
  const [open, setOpen] = useState(false);
  if (!citations.length) return null;
  const text = label ?? `${citations.length} source${citations.length === 1 ? '' : 's'}`;
  return (
    <div style={{ marginTop: 6 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 11, color: '#60a5fa' }}
      >
        {open ? '▾' : '▸'} {text}
      </button>
      {open && <CitationList citations={citations} />}
    </div>
  );
}

/** A sourced account of the event (curated events replace the Wikipedia stub with this). */
export function SourcedAccount({ description, citations }: { description: string; citations: Source[] }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{description}</p>
      <SourcesToggle citations={citations} />
    </div>
  );
}

function Row({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: FAINT, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</div>
      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

/** One party's view of an event: what it wanted, believed or feared, and how it remembers it. */
export function PartyPerspectiveCard({ perspective }: { perspective: Perspective }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        padding: '12px 14px',
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{perspective.party}</div>
      <Row label="Wanted" text={perspective.wanted} />
      <Row label="Believed or feared" text={perspective.feared} />
      <Row label="Remembered as" text={perspective.remembered} />
      <SourcesToggle citations={perspective.sources} />
    </div>
  );
}

/** Cited causes and effects of an event, each with its confidence and rationale. */
export function LinkEvidenceList({
  links,
  onSelect,
}: {
  links: ConnectedEvent[];
  onSelect: (slug: string) => void;
}) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
      {links.map((l) => (
        <li
          key={`${l.direction}-${l.id}`}
          style={{
            borderLeft: `2px ${l.confidence === 'speculative' ? 'dashed' : 'solid'} ${l.confidence ? CONFIDENCE_COLORS[l.confidence] : FAINT}`,
            paddingLeft: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: FAINT }}>{l.direction === 'cause' ? 'Cause' : 'Effect'}</span>
            <button
              type="button"
              onClick={() => onSelect(l.slug)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#e2e8f0', fontSize: 13, fontWeight: 600, textAlign: 'left' }}
            >
              {l.title}
            </button>
            {l.confidence && <ConfidenceBadge level={l.confidence} />}
          </div>
          {l.rationale && <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.55, marginTop: 3 }}>{l.rationale}</div>}
          <SourcesToggle citations={l.citations ?? []} />
        </li>
      ))}
    </ul>
  );
}
