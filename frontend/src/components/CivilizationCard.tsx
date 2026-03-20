/**
 * CivilizationCard — displays active civilizations for a single world region.
 *
 * Owns: rendering a region card with a list of civilizations active in the selected century.
 * Does NOT own: filtering logic, slider state, or data.
 */
import type { Civilization, Region } from '../data/civilizations-data';
import { REGION_LABELS, REGION_COLORS } from '../data/civilizations-data';

/** Region emoji icons for visual identification. */
const REGION_ICONS: Record<Region, string> = {
  europe: '🏛️',
  middle_east: '🕌',
  africa: '🌍',
  asia: '🏯',
  americas: '🗿',
  oceania: '🌊',
};

interface CivilizationCardProps {
  /** Region to display */
  region: Region;
  /** Civilizations active in the selected century */
  activeCivs: Civilization[];
  /** Currently selected century */
  selectedCentury: number;
}

/**
 * Formats a year for display (e.g., -500 → "500 BCE", 100 → "100 CE").
 */
function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year === 0) return '1 CE';
  return `${year} CE`;
}

/**
 * Region card showing which civilizations were active in a given century.
 */
export default function CivilizationCard({ region, activeCivs, selectedCentury }: CivilizationCardProps) {
  const regionColor = REGION_COLORS[region];

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      border: `1px solid ${activeCivs.length > 0 ? regionColor : 'rgba(100,116,139,0.3)'}`,
      borderRadius: 12,
      padding: 16,
      minHeight: 120,
      transition: 'border-color 0.3s, box-shadow 0.3s',
      boxShadow: activeCivs.length > 0 ? `0 0 20px ${regionColor}22` : 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 20 }}>{REGION_ICONS[region]}</span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: regionColor }}>
          {REGION_LABELS[region]}
        </h3>
        <span style={{
          marginLeft: 'auto',
          fontSize: 12,
          color: 'rgba(148,163,184,0.7)',
          backgroundColor: 'rgba(148,163,184,0.1)',
          padding: '2px 8px',
          borderRadius: 10,
        }}>
          {activeCivs.length}
        </span>
      </div>

      {activeCivs.length === 0 ? (
        <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
          No major civilizations recorded
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeCivs.map(civ => {
            const isPeak = selectedCentury >= Math.floor(civ.peak / 100) * 100
              && selectedCentury < Math.floor(civ.peak / 100) * 100 + 100;
            return (
              <div key={civ.name} style={{
                padding: '8px 10px',
                borderRadius: 8,
                backgroundColor: `${civ.color}18`,
                borderLeft: `3px solid ${civ.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>
                    {civ.name}
                  </span>
                  {isPeak && (
                    <span style={{ fontSize: 10, color: '#fbbf24' }} title="Peak period">⭐</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.8)', marginTop: 2 }}>
                  {formatYear(civ.startYear)} – {formatYear(civ.endYear)}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(203,213,225,0.7)', marginTop: 4 }}>
                  {civ.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
