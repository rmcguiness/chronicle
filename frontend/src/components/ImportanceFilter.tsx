/**
 * ImportanceFilter.tsx — Compact slider for filtering events by importance_score.
 *
 * Owns: the range input UI and its label, writing `minImportance` to the Zustand store.
 *
 * Does NOT: perform the actual filtering of events (NetworkView reads the store value
 * and applies both a local fast-filter and a debounced API refetch).
 */
import { useAppStore } from '../store';

export default function ImportanceFilter() {
  const minImportance = useAppStore((s) => s.minImportance);
  const setMinImportance = useAppStore((s) => s.setMinImportance);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 10px',
        borderRadius: 8,
        backgroundColor: 'rgba(7,14,34,0.85)',
        border: '1px solid rgba(96,165,250,0.2)',
        fontSize: 11,
        color: '#94a3b8',
        fontFamily: "'Inter', sans-serif",
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      <label
        htmlFor="importance-slider"
        style={{ cursor: 'default' }}
      >
        Min importance: {minImportance.toFixed(2)}
      </label>
      <input
        id="importance-slider"
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={minImportance}
        onChange={(e) => setMinImportance(parseFloat(e.target.value))}
        style={{
          width: 100,
          accentColor: '#60a5fa',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
