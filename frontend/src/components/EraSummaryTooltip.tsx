import { useState, useCallback, useRef, useEffect } from 'react';
import { useViewport } from '@xyflow/react';
import { fetchEraSummary } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS } from '../utils/categories';
import { CANVAS_CONSTANTS } from '../types';
import type { EraSummary, EventCategory } from '../types';
import { useDebouncedCallback } from '../hooks/useDebounce';

const { CANVAS_WIDTH } = CANVAS_CONSTANTS;

/** Tooltip card width in pixels. */
const CARD_WIDTH = 280;

/** Offset from cursor so the card doesn't block it. */
const CURSOR_OFFSET = 20;

/**
 * Format an era label for a given year range.
 * e.g. 1940-1949 -> "1940s", 1300-1399 -> "14th Century"
 */
function eraLabel(yearFrom: number, yearTo: number): string {
  const span = yearTo - yearFrom;
  if (span >= 100) {
    // Century mode
    if (yearFrom < 0) {
      const century = Math.ceil(Math.abs(yearFrom) / 100);
      return `${century}${ordinalSuffix(century)} Century BCE`;
    }
    const century = Math.floor(yearFrom / 100) + 1;
    return `${century}${ordinalSuffix(century)} Century`;
  }
  // Decade mode
  if (yearFrom < 0) {
    return `${Math.abs(yearFrom)}s BCE`;
  }
  return `${yearFrom}s`;
}

function ordinalSuffix(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return 'th';
  const mod10 = n % 10;
  if (mod10 === 1) return 'st';
  if (mod10 === 2) return 'nd';
  if (mod10 === 3) return 'rd';
  return 'th';
}

interface EraSummaryTooltipProps {
  /** Ref to the wrapper div that contains ReactFlow */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function EraSummaryTooltip({ containerRef }: EraSummaryTooltipProps) {
  const viewport = useViewport();
  const timeViewport = useAppStore((s) => s.timeViewport);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const [summary, setSummary] = useState<EraSummary | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [eraRange, setEraRange] = useState<{ from: number; to: number } | null>(null);
  const [visible, setVisible] = useState(false);

  // Track whether the mouse is over a node (suppress tooltip)
  const overNodeRef = useRef(false);
  // Track current fetch to avoid stale results
  const fetchIdRef = useRef(0);

  const handleHover = useDebouncedCallback(
    (clientX: number, clientY: number, rfZoom: number) => {
      if (overNodeRef.current) return;

      // Convert screen X to canvas X, then to year
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const canvasX = (clientX - rect.left - viewport.x) / viewport.zoom;

      const yearSpan = timeViewport.yearMax - timeViewport.yearMin;
      if (yearSpan <= 0) return;
      const year = timeViewport.yearMin + (canvasX / CANVAS_WIDTH) * yearSpan;

      // Determine granularity from zoom
      let yearFrom: number;
      let yearTo: number;
      if (rfZoom < 0.3) {
        // Century
        const centuryStart = Math.floor(year / 100) * 100;
        yearFrom = centuryStart;
        yearTo = centuryStart + 99;
      } else {
        // Decade
        const decadeStart = Math.floor(year / 10) * 10;
        yearFrom = decadeStart;
        yearTo = decadeStart + 9;
      }

      const id = ++fetchIdRef.current;
      setPos({ x: clientX - (containerRef.current?.getBoundingClientRect().left ?? 0), y: clientY - (containerRef.current?.getBoundingClientRect().top ?? 0) });
      setEraRange({ from: yearFrom, to: yearTo });

      fetchEraSummary(yearFrom, yearTo).then((data) => {
        if (fetchIdRef.current !== id) return; // stale
        if (data && data.event_count > 0) {
          setSummary(data);
          setVisible(true);
        } else {
          setVisible(false);
        }
      });
    },
    800,
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over a node or edge (ReactFlow adds data attributes)
      const isNode = target.closest('.react-flow__node');
      const isEdge = target.closest('.react-flow__edge');
      if (isNode || isEdge) {
        overNodeRef.current = true;
        setVisible(false);
        return;
      }
      overNodeRef.current = false;
      handleHover(e.clientX, e.clientY, viewport.zoom);
    },
    [handleHover, viewport.zoom],
  );

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
    fetchIdRef.current++; // cancel pending
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef, handleMouseMove, handleMouseLeave]);

  if (!visible || !summary || !pos || !eraRange) return null;

  const topEvents = summary.top_events.slice(0, 3);
  const categoryEntries = Object.entries(summary.categories);

  // Position the card: offset from cursor, clamp to container bounds
  const container = containerRef.current;
  const containerWidth = container?.clientWidth ?? 800;
  const containerHeight = container?.clientHeight ?? 600;
  let left = pos.x + CURSOR_OFFSET;
  let top = pos.y + CURSOR_OFFSET;
  if (left + CARD_WIDTH > containerWidth) {
    left = pos.x - CARD_WIDTH - CURSOR_OFFSET;
  }
  if (top + 200 > containerHeight) {
    top = pos.y - 200 - CURSOR_OFFSET;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: CARD_WIDTH,
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        borderRadius: 10,
        padding: '14px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 50,
        pointerEvents: 'none',
        fontSize: 13,
        lineHeight: 1.5,
        border: '1px solid rgba(148,163,184,0.15)',
      }}
    >
      {/* Header */}
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#e2e8f0' }}>
        {eraLabel(eraRange.from, eraRange.to)}
      </div>

      {/* Event count */}
      <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 8 }}>
        {summary.event_count} event{summary.event_count !== 1 ? 's' : ''}
        {summary.avg_importance > 0 && (
          <span style={{ marginLeft: 8 }}>
            avg importance: {Math.round(summary.avg_importance * 100)}%
          </span>
        )}
      </div>

      {/* Category breakdown dots */}
      {categoryEntries.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {categoryEntries.map(([cat, count]) => (
            <div
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: '#94a3b8',
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_COLORS[cat as EventCategory] ?? '#6b7280',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {cat} ({count})
            </div>
          ))}
        </div>
      )}

      {/* Top events */}
      {topEvents.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(148,163,184,0.15)', paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Top Events
          </div>
          {topEvents.map((evt) => (
            <div
              key={evt.slug}
              onClick={() => setSelectedEvent(evt.slug)}
              style={{
                padding: '3px 0',
                fontSize: 12,
                color: '#93c5fd',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              {evt.title}
              <span style={{ color: '#475569', marginLeft: 6, fontSize: 11 }}>
                {Math.round(evt.importance_score * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
