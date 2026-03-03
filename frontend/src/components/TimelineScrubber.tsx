import { useRef, useCallback } from 'react';
import { useAppStore } from '../store';

const OVERALL_MIN = 1800;
const OVERALL_MAX = 1960;

function yearToPercent(year: number): number {
  return ((year - OVERALL_MIN) / (OVERALL_MAX - OVERALL_MIN)) * 100;
}

function percentToYear(pct: number): number {
  return Math.round(OVERALL_MIN + (pct / 100) * (OVERALL_MAX - OVERALL_MIN));
}

// Decade markers
const DECADE_MARKERS: number[] = [];
for (let y = OVERALL_MIN; y <= OVERALL_MAX; y += 10) {
  DECADE_MARKERS.push(y);
}

const CENTURY_MARKERS = [1800, 1850, 1900, 1950];

export default function TimelineScrubber() {
  const viewport = useAppStore((s) => s.viewport);
  const setViewport = useAppStore((s) => s.setViewport);

  const trackRef = useRef<HTMLDivElement>(null);

  const yearMin = Math.max(OVERALL_MIN, viewport.year_min);
  const yearMax = Math.min(OVERALL_MAX, viewport.year_max);

  const minPct = yearToPercent(yearMin);
  const maxPct = yearToPercent(yearMax);

  // Drag logic
  const dragging = useRef<null | 'min' | 'max' | 'range'>(null);
  const dragStart = useRef({ x: 0, yearMin: 0, yearMax: 0 });

  const getYearFromClientX = useCallback((clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return percentToYear(pct);
  }, []);

  const onMinMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'min';
    dragStart.current = { x: e.clientX, yearMin, yearMax };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMaxMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'max';
    dragStart.current = { x: e.clientX, yearMin, yearMax };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onRangeMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    e.preventDefault();
    dragging.current = 'range';
    dragStart.current = { x: e.clientX, yearMin, yearMax };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStart.current.x;
    const dYears = Math.round((dx / rect.width) * (OVERALL_MAX - OVERALL_MIN));

    if (dragging.current === 'min') {
      const newMin = Math.max(OVERALL_MIN, Math.min(dragStart.current.yearMax - 5, dragStart.current.yearMin + dYears));
      setViewport({ year_min: newMin });
    } else if (dragging.current === 'max') {
      const newMax = Math.min(OVERALL_MAX, Math.max(dragStart.current.yearMin + 5, dragStart.current.yearMax + dYears));
      setViewport({ year_max: newMax });
    } else if (dragging.current === 'range') {
      const span = dragStart.current.yearMax - dragStart.current.yearMin;
      let newMin = Math.round(dragStart.current.yearMin + dYears);
      let newMax = newMin + span;
      if (newMin < OVERALL_MIN) { newMin = OVERALL_MIN; newMax = OVERALL_MIN + span; }
      if (newMax > OVERALL_MAX) { newMax = OVERALL_MAX; newMin = OVERALL_MAX - span; }
      setViewport({ year_min: newMin, year_max: newMax });
    }
  }, [setViewport]);

  const onMouseUp = useCallback(() => {
    dragging.current = null;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseMove]);

  // Click on track to jump
  const onTrackClick = (e: React.MouseEvent) => {
    if (dragging.current) return;
    const year = getYearFromClientX(e.clientX);
    const span = yearMax - yearMin;
    const halfSpan = span / 2;
    let newMin = Math.round(year - halfSpan);
    let newMax = Math.round(year + halfSpan);
    if (newMin < OVERALL_MIN) { newMin = OVERALL_MIN; newMax = OVERALL_MIN + span; }
    if (newMax > OVERALL_MAX) { newMax = OVERALL_MAX; newMin = OVERALL_MAX - span; }
    setViewport({ year_min: newMin, year_max: newMax });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(7, 14, 34, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 24px 16px',
        userSelect: 'none',
      }}
    >
      {/* Year range indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>
          {yearMin}
        </span>
        <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.05em' }}>
          TIMELINE — {yearMax - yearMin} year span
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', fontFamily: 'monospace' }}>
          {yearMax}
        </span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        onClick={onTrackClick}
        style={{
          position: 'relative',
          height: 32,
          cursor: 'crosshair',
        }}
      >
        {/* Background rail */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 4,
          }}
        />

        {/* Decade markers */}
        {DECADE_MARKERS.map((year) => {
          const pct = yearToPercent(year);
          const isCentury = CENTURY_MARKERS.includes(year);
          return (
            <div
              key={year}
              style={{
                position: 'absolute',
                top: isCentury ? 6 : 9,
                left: `${pct}%`,
                width: 1,
                height: isCentury ? 18 : 12,
                backgroundColor: isCentury
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.1)',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Century labels */}
        {CENTURY_MARKERS.map((year) => (
          <div
            key={`label-${year}`}
            style={{
              position: 'absolute',
              top: 26,
              left: `${yearToPercent(year)}%`,
              transform: 'translateX(-50%)',
              fontSize: 9,
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              pointerEvents: 'none',
            }}
          >
            {year}
          </div>
        ))}

        {/* Active range highlight */}
        <div
          data-handle="range"
          onMouseDown={onRangeMouseDown}
          style={{
            position: 'absolute',
            top: 12,
            left: `${minPct}%`,
            width: `${maxPct - minPct}%`,
            height: 8,
            backgroundColor: '#3b82f6',
            borderRadius: 4,
            cursor: 'grab',
            boxShadow: '0 0 10px rgba(59,130,246,0.5)',
            opacity: 0.85,
          }}
        />

        {/* Min handle */}
        <div
          data-handle="min"
          onMouseDown={onMinMouseDown}
          style={{
            position: 'absolute',
            top: 6,
            left: `${minPct}%`,
            transform: 'translateX(-50%)',
            width: 18,
            height: 20,
            backgroundColor: '#60a5fa',
            borderRadius: 4,
            cursor: 'ew-resize',
            boxShadow: '0 0 8px rgba(96,165,250,0.6)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 2,
          }}
        />

        {/* Max handle */}
        <div
          data-handle="max"
          onMouseDown={onMaxMouseDown}
          style={{
            position: 'absolute',
            top: 6,
            left: `${maxPct}%`,
            transform: 'translateX(-50%)',
            width: 18,
            height: 20,
            backgroundColor: '#60a5fa',
            borderRadius: 4,
            cursor: 'ew-resize',
            boxShadow: '0 0 8px rgba(96,165,250,0.6)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
