/**
 * CategoryFilter.tsx
 *
 * A horizontal bar of toggle pill buttons for filtering timeline events by category.
 * Each pill shows a colored dot and label. Toggling hides/shows nodes of that category.
 *
 * State is managed via the Zustand store's `activeCategories` set.
 */

import { useAppStore } from '../store';
import { CATEGORY_COLORS } from '../utils/categories';
import type { EventCategory } from '../types';

/** All available categories in display order */
const CATEGORIES: { key: EventCategory; label: string }[] = [
  { key: 'war', label: 'War' },
  { key: 'discovery', label: 'Discovery' },
  { key: 'political', label: 'Political' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'natural', label: 'Natural' },
  { key: 'person', label: 'Person' },
];

const BAR_STYLE: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  padding: '6px 12px',
  flexWrap: 'wrap',
};

/**
 * Horizontal filter bar with toggle pills for each event category.
 * Renders above the timeline scrubber.
 *
 * @returns The CategoryFilter component
 */
export default function CategoryFilter() {
  const activeCategories = useAppStore((s) => s.activeCategories);
  const toggleCategory = useAppStore((s) => s.toggleCategory);

  return (
    <div style={BAR_STYLE}>
      {CATEGORIES.map(({ key, label }) => {
        const active = activeCategories.has(key);
        return (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 999,
              border: `1px solid ${active ? CATEGORY_COLORS[key] : 'rgba(255,255,255,0.15)'}`,
              backgroundColor: active ? `${CATEGORY_COLORS[key]}22` : 'rgba(7,14,34,0.7)',
              color: active ? '#e2e8f0' : 'rgba(255,255,255,0.4)',
              fontSize: 11,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: active ? CATEGORY_COLORS[key] : 'rgba(255,255,255,0.2)',
              }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
