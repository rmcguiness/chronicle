/**
 * CivilizationTimeline — horizontal bar chart showing civilization lifespans.
 *
 * Owns: rendering bars, region filters, sort controls, hover tooltips.
 * Does NOT own: civilization data or page layout.
 */
import { useState, useMemo } from 'react';
import type { Civilization, Region } from '../data/civilizations-data';
import { REGION_LABELS, REGION_COLORS, MIN_CENTURY, MAX_CENTURY } from '../data/civilizations-data';

/** All region keys for filter checkboxes. */
const ALL_REGIONS: Region[] = ['europe', 'middle_east', 'africa', 'asia', 'americas', 'oceania'];

/** Sort modes for the timeline. */
type SortMode = 'start' | 'duration';

interface CivilizationTimelineProps {
  /** Full list of civilizations. */
  civilizations: Civilization[];
}

/** Formats a year for display. */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 CE';
  return `${year} CE`;
}

/** Total year span for computing bar widths. */
const TOTAL_SPAN = MAX_CENTURY - MIN_CENTURY;

/**
 * Horizontal bar chart showing each civilization's lifespan, color-coded by region.
 */
export default function CivilizationTimeline({ civilizations }: CivilizationTimelineProps) {
  const [activeRegions, setActiveRegions] = useState<Set<Region>>(new Set(ALL_REGIONS));
  const [sortMode, setSortMode] = useState<SortMode>('start');
  const [hovered, setHovered] = useState<string | null>(null);

  /** Toggle a region filter. */
  const toggleRegion = (region: Region) => {
    setActiveRegions(prev => {
      const next = new Set(prev);
      if (next.has(region)) next.delete(region);
      else next.add(region);
      return next;
    });
  };

  /** Filtered and sorted civilizations. */
  const displayed = useMemo(() => {
    const filtered = civilizations.filter(c => activeRegions.has(c.region));
    return [...filtered].sort((a, b) => {
      if (sortMode === 'start') return a.startYear - b.startYear;
      return (b.endYear - b.startYear) - (a.endYear - a.startYear);
    });
  }, [civilizations, activeRegions, sortMode]);

  return (
    <div>
      {/* Controls */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16,
        alignItems: 'center',
      }}>
        {/* Region filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALL_REGIONS.map(region => (
            <label key={region} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              cursor: 'pointer', fontSize: 13, color: activeRegions.has(region) ? REGION_COLORS[region] : '#64748b',
              transition: 'color 0.2s',
            }}>
              <input
                type="checkbox"
                checked={activeRegions.has(region)}
                onChange={() => toggleRegion(region)}
                style={{ accentColor: REGION_COLORS[region] }}
              />
              {REGION_LABELS[region]}
            </label>
          ))}
        </div>

        {/* Sort controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {(['start', 'duration'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              style={{
                padding: '4px 12px', borderRadius: 6, border: 'none',
                fontSize: 12, cursor: 'pointer',
                backgroundColor: sortMode === mode ? 'rgba(99,102,241,0.3)' : 'rgba(51,65,85,0.5)',
                color: sortMode === mode ? '#a5b4fc' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              {mode === 'start' ? 'By Start Year' : 'By Duration'}
            </button>
          ))}
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {displayed.map(civ => {
          const leftPct = ((civ.startYear - MIN_CENTURY) / TOTAL_SPAN) * 100;
          const widthPct = ((civ.endYear - civ.startYear) / TOTAL_SPAN) * 100;
          const isHovered = hovered === civ.name;

          return (
            <div
              key={civ.name}
              style={{ display: 'flex', alignItems: 'center', height: 22, position: 'relative' }}
              onMouseEnter={() => setHovered(civ.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Label */}
              <div style={{
                width: 160, minWidth: 160, fontSize: 11, color: '#cbd5e1',
                textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
                paddingRight: 8,
              }}>
                {civ.name}
              </div>

              {/* Bar container */}
              <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                <div style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  width: `${Math.max(widthPct, 0.3)}%`,
                  height: 16,
                  top: 3,
                  backgroundColor: isHovered ? civ.color : `${civ.color}99`,
                  borderRadius: 3,
                  transition: 'background-color 0.15s',
                  cursor: 'pointer',
                }} />

                {/* Tooltip on hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    left: `${leftPct + widthPct / 2}%`,
                    top: -36,
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(148,163,184,0.3)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    color: '#e2e8f0',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}>
                    {civ.name} · {formatYear(civ.startYear)}–{formatYear(civ.endYear)} · Peak: {formatYear(civ.peak)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline axis */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 8, marginLeft: 160, fontSize: 10, color: '#64748b',
      }}>
        <span>3000 BCE</span>
        <span>2000 BCE</span>
        <span>1000 BCE</span>
        <span>1 CE</span>
        <span>1000 CE</span>
        <span>2000 CE</span>
      </div>
    </div>
  );
}
