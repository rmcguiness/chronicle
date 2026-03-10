/**
 * CategoryFilter.tsx
 *
 * Owns: a fixed-position horizontal bar of toggle pill buttons for filtering
 *   timeline events by category. Each pill shows a colored dot + label.
 *   Toggled-off categories are visually dimmed.
 *
 * Does NOT own: event data, layout computation, ReactFlow state.
 *
 * State is managed via the Zustand store's `activeCategories` set.
 * Positioned just above the TimelineScrubber (bottom: 98px).
 */

import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** All available categories in display order */
const CATEGORIES: { key: EventCategory; label: string }[] = [
  { key: 'war', label: 'War' },
  { key: 'discovery', label: 'Discovery' },
  { key: 'political', label: 'Political' },
  { key: 'cultural', label: 'Cultural' },
  { key: 'natural', label: 'Natural' },
  { key: 'person', label: 'Person' },
];

/**
 * Height of the TimelineScrubber in pixels.
 * The CategoryFilter bar is anchored directly above it.
 */
const SCRUBBER_HEIGHT_PX = 98;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Horizontal filter bar with toggle pills for each event category.
 * Rendered as a fixed overlay just above the TimelineScrubber.
 * All categories are active by default; clicking a pill hides/shows nodes of
 * that category on the network canvas.
 *
 * @returns The CategoryFilter bar component
 */
export default function CategoryFilter() {
  const activeCategories = useAppStore((s) => s.activeCategories);
  const toggleCategory = useAppStore((s) => s.toggleCategory);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: SCRUBBER_HEIGHT_PX,
        left: 0,
        right: 0,
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        padding: '6px 16px',
        backgroundColor: 'rgba(7, 14, 34, 0.85)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginRight: 4,
          flexShrink: 0,
        }}
      >
        Filter
      </span>

      {CATEGORIES.map(({ key, label }) => {
        const active = activeCategories.has(key);
        return (
          <button
            key={key}
            onClick={() => toggleCategory(key)}
            title={active ? `Hide ${label} events` : `Show ${label} events`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 999,
              border: `1px solid ${active ? CATEGORY_COLORS[key] : 'rgba(255,255,255,0.12)'}`,
              backgroundColor: active ? `${CATEGORY_COLORS[key]}22` : 'transparent',
              color: active ? '#e2e8f0' : 'rgba(255,255,255,0.35)',
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: '"Inter", "Segoe UI", sans-serif',
              /* Strikethrough label text when toggled off */
              textDecoration: active ? 'none' : 'line-through',
              opacity: active ? 1 : 0.55,
            }}
          >
            {/* Colored dot indicator */}
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: active ? CATEGORY_COLORS[key] : 'rgba(255,255,255,0.2)',
                flexShrink: 0,
              }}
            />
            {/* Category icon (emoji) */}
            <span style={{ fontSize: 12, lineHeight: 1, marginRight: 1 }}>
              {CATEGORY_ICONS[key]}
            </span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
