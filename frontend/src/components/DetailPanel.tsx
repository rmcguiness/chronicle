import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchEventDetail } from '../api/client';
import { useAppStore } from '../store';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  PERSPECTIVE_COLORS,
  PERSPECTIVE_LABELS,
  evidenceColor,
  evidenceLabel,
} from '../utils/categories';
import type { Perspective, Source } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Evidence score bar
// ─────────────────────────────────────────────────────────────────────────────

function EvidenceBar({ score }: { score: number }) {
  const color = evidenceColor(score);
  const label = evidenceLabel(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', backgroundColor: color, borderRadius: 3 }}
        />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 700, fontFamily: 'monospace', minWidth: 60 }}>
        {score.toFixed(2)} · {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Source citation item
// ─────────────────────────────────────────────────────────────────────────────

function SourceItem({ source }: { source: Source }) {
  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor:
              source.source_type === 'primary' ? '#22c55e22' :
              source.source_type === 'secondary' ? '#3b82f622' : '#94a3b822',
            color:
              source.source_type === 'primary' ? '#22c55e' :
              source.source_type === 'secondary' ? '#60a5fa' : '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {source.source_type}
        </span>
        {source.peer_reviewed && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: '#a855f722',
              color: '#c084fc',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Peer reviewed
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{source.title}</div>
      {source.author && (
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
          {source.author}
          {source.publication ? ` · ${source.publication}` : ''}
          {source.publication_date ? ` · ${new Date(source.publication_date).getFullYear()}` : ''}
        </div>
      )}
      {source.quote && (
        <div
          style={{
            marginTop: 6,
            fontSize: 11,
            color: '#cbd5e1',
            fontStyle: 'italic',
            borderLeft: '2px solid rgba(255,255,255,0.2)',
            paddingLeft: 8,
          }}
        >
          "{source.quote}"
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {source.archive_url && (
          <a href={source.archive_url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            📦 Archive
          </a>
        )}
        {source.original_url && (
          <a href={source.original_url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            🔗 Source
          </a>
        )}
        {source.ipfs_cid && (
          <a
            href={`https://ipfs.io/ipfs/${source.ipfs_cid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            📄 IPFS
          </a>
        )}
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#60a5fa',
  textDecoration: 'none',
  padding: '2px 6px',
  borderRadius: 4,
  backgroundColor: 'rgba(96,165,250,0.1)',
  border: '1px solid rgba(96,165,250,0.2)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Perspective card
// ─────────────────────────────────────────────────────────────────────────────

function PerspectiveCard({ perspective, index }: { perspective: Perspective; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = PERSPECTIVE_COLORS[perspective.perspective_type] ?? '#6b7280';
  const label = PERSPECTIVE_LABELS[perspective.perspective_type] ?? perspective.perspective_type;

  const TRUNCATE = 220;
  const needsTruncation = perspective.narrative.length > TRUNCATE;

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}44`,
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 12,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: `${color}22`,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Label */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
        {perspective.label}
      </div>

      {/* Summary */}
      <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 6 }}>
        {perspective.summary}
      </div>

      {/* Evidence bar */}
      <EvidenceBar score={perspective.evidence_score} />

      {/* Narrative (expandable) */}
      <div style={{ marginTop: 10, fontSize: 12, color: '#cbd5e1', lineHeight: 1.6 }}>
        {expanded || !needsTruncation
          ? perspective.narrative
          : `${perspective.narrative.slice(0, TRUNCATE)}…`}
        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginLeft: 6,
              fontSize: 11,
              color: '#60a5fa',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            {expanded ? 'read less' : 'read more'}
          </button>
        )}
      </div>

      {/* Sources */}
      {perspective.sources.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            {perspective.sources.length} Source{perspective.sources.length > 1 ? 's' : ''}
          </div>
          {expanded && perspective.sources.map((s) => <SourceItem key={s.id} source={s} />)}
          {!expanded && (
            <div style={{ fontSize: 11, color: '#64748b' }}>
              Expand to view sources
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Detail Panel
// ─────────────────────────────────────────────────────────────────────────────

export default function DetailPanel() {
  const selectedEventSlug = useAppStore((s) => s.selectedEventSlug);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', selectedEventSlug],
    queryFn: () => fetchEventDetail(selectedEventSlug!),
    enabled: !!selectedEventSlug,
    staleTime: 5 * 60 * 1000,
  });

  const color = event ? CATEGORY_COLORS[event.category] : '#6b7280';
  const icon = event ? CATEGORY_ICONS[event.category] : '';

  return (
    <AnimatePresence>
      {selectedEventSlug && (
        <motion.div
          initial={{ x: 420 }}
          animate={{ x: 0 }}
          exit={{ x: 420 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 400,
            height: '100vh',
            backgroundColor: 'rgba(7, 14, 34, 0.97)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 20px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                {event && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                        boxShadow: `0 0 12px ${color}66`,
                      }}
                    >
                      {icon}
                    </span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 3 }}>
                        {event.year_approx}
                        {event.geo_modern ? ` · ${event.geo_modern}` : ''}
                      </div>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div style={{ color: '#64748b', fontSize: 14, padding: '8px 0' }}>
                    Loading event…
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px 10px',
                  fontSize: 14,
                  lineHeight: 1,
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  backgroundColor: '#ef444422',
                  border: '1px solid #ef444444',
                  color: '#fca5a5',
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                Failed to load event details
              </div>
            )}

            {event && (
              <>
                {/* Perspectives */}
                {event.perspectives.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 12,
                      }}
                    >
                      Perspectives ({event.perspectives.length})
                    </div>
                    {event.perspectives
                      .sort((a, b) => b.evidence_score - a.evidence_score)
                      .map((p, i) => (
                        <PerspectiveCard key={p.id} perspective={p} index={i} />
                      ))}
                  </div>
                )}

                {/* Connected events */}
                {event.connected_events && event.connected_events.length > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: 12,
                      }}
                    >
                      Connected Events
                    </div>
                    {event.connected_events.map((ce) => (
                      <button
                        key={ce.id}
                        onClick={() => {
                          const { visibleEvents } = useAppStore.getState();
                          const found = visibleEvents.find((e) => e.id === ce.id || e.slug === ce.slug);
                          if (found) setFlyToEvent(found);
                          setSelectedEvent(ce.slug);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 8,
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#e2e8f0',
                          cursor: 'pointer',
                          marginBottom: 8,
                          textAlign: 'left',
                          fontSize: 13,
                          transition: 'background 0.15s',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{ce.title}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {ce.year_approx} · {ce.direction === 'effect' ? '→ effect' : '← cause'}
                          </div>
                        </div>
                        <span style={{ color: '#475569', fontSize: 16 }}>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
