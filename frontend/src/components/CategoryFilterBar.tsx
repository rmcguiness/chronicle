/**
 * CategoryFilterBar.tsx
 *
 * What it does:  Renders a horizontally-scrollable pill toggle bar that lets the
 *   user show or hide events by category. Positioned as a fixed overlay just
 *   below the search bar (top of canvas).
 * What it owns:  Pill layout, styling, and accessibility markup.
 * What it does NOT do: Manage filter state itself — all state lives in the
 *   `useCategoryFilter` hook owned by the parent (Canvas).
 *
 * @module CategoryFilterBar
 */

import type { EventCategory } from '../types';
import {
  CATEGORY_COLORS,
  CATEGORY_DARK_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Static category list (matches EventCategory union in types/index.ts)
// ─────────────────────────────────────────────────────────────────────────────

/** Ordered list of all recognised event categories. */
export const ALL_CATEGORIES: EventCategory[] = [
  'war',
  'discovery',
  'political',
  'cultural',
  'natural',
  'person',
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface CategoryFilterBarProps {
  /**
   * Set of currently-active category ids.
   * A category is "on" if its id is present in this set.
   */
  activeCategories: Set<string>;

  /**
   * Number of visible events per category id.
   * Shown as a count badge inside each pill.
   */
  eventCounts: Record<string, number>;

  /** Toggle a single category on/off. */
  toggleCategory: (id: string) => void;

  /**
   * Activate all categories at once ("All" button).
   * Receives the full id list so the hook can reconstruct its Set.
   */
  setAll: (ids: string[]) => void;

  /** Deactivate all categories at once ("None" button). */
  clearAll: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: individual pill
// ─────────────────────────────────────────────────────────────────────────────

interface PillProps {
  category: EventCategory;
  isActive: boolean;
  count: number;
  onToggle: () => void;
}

/**
 * A single category pill toggle button.
 * Active state uses the category's brand colour as the background;
 * inactive state renders as a ghost with a subtle border.
 */
function CategoryPill({ category, isActive, count, onToggle }: PillProps) {
  const color = CATEGORY_COLORS[category];
  const darkColor = CATEGORY_DARK_COLORS[category];
  const icon = CATEGORY_ICONS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <button
      role="button"
      aria-pressed={isActive}
      aria-label={`${label}: ${count} events. Click to ${isActive ? 'hide' : 'show'}.`}
      onClick={onToggle}
      title={`${label} (${count} events)`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 11px',
        borderRadius: 20,
        border: isActive
          ? `1.5px solid ${darkColor}`
          : '1.5px solid rgba(255,255,255,0.14)',
        backgroundColor: isActive
          ? color
          : 'rgba(7, 14, 34, 0.7)',
        color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: isActive ? 600 : 400,
        fontFamily: 'inherit',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background-color 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s',
        boxShadow: isActive ? `0 0 10px ${color}55` : 'none',
        userSelect: 'none',
        lineHeight: 1,
      }}
      /* Hover effect via inline JS (avoids stylesheet dependency) */
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = `${color}88`;
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)';
          (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
        }
      }}
    >
      {/* Category emoji icon */}
      <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>
        {icon}
      </span>

      {/* Category label */}
      <span>{label}</span>

      {/* Event count badge */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 18,
          height: 16,
          padding: '0 4px',
          borderRadius: 8,
          backgroundColor: isActive
            ? 'rgba(0,0,0,0.25)'
            : 'rgba(255,255,255,0.08)',
          fontSize: 10,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}
      >
        {count}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: "All" / "None" quick-toggle button
// ─────────────────────────────────────────────────────────────────────────────

interface QuickToggleProps {
  label: string;
  onClick: () => void;
}

/**
 * Compact text button for "All" or "None" quick toggles.
 */
function QuickToggleButton({ label, onClick }: QuickToggleProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 10px',
        borderRadius: 20,
        border: '1.5px solid rgba(255,255,255,0.20)',
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        transition: 'background-color 0.15s, color 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.12)';
        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Horizontal category-filter pill bar.
 *
 * Renders above the canvas as a fixed overlay. Each pill represents one event
 * category and can be toggled independently. "All" and "None" quick-toggle
 * buttons sit on the left. The bar is horizontally scrollable on narrow screens.
 *
 * Accessibility:
 * - Outer wrapper carries `role="group"` with an `aria-label`.
 * - Each pill is a `<button>` with `aria-pressed` reflecting active state.
 *
 * @param props - See {@link CategoryFilterBarProps}.
 */
export default function CategoryFilterBar({
  activeCategories,
  eventCounts,
  toggleCategory,
  setAll,
  clearAll,
}: CategoryFilterBarProps) {
  const allActive = ALL_CATEGORIES.every((c) => activeCategories.has(c));
  const noneActive = activeCategories.size === 0;

  return (
    <div
      role="group"
      aria-label="Filter events by category"
      style={{
        /* Fixed positioning: just below the search bar (~66px) with a 10px gap */
        position: 'fixed',
        top: 76,
        left: 0,
        right: 0,
        zIndex: 200,
        /* Horizontal scroll container */
        overflowX: 'auto',
        overflowY: 'hidden',
        /* Hide scrollbar on WebKit while keeping it functional */
        WebkitOverflowScrolling: 'touch',
        /* Layout */
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 16px',
        /* Frosted glass background */
        backgroundColor: 'rgba(7, 14, 34, 0.82)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        /* Prevent text selection during rapid clicking */
        userSelect: 'none',
        /* Scrollbar visual */
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.12) transparent',
      }}
    >
      {/* ── Left: quick toggles ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
          paddingRight: 8,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          marginRight: 4,
        }}
      >
        <QuickToggleButton
          label="All"
          onClick={() => setAll(ALL_CATEGORIES.slice())}
        />
        <QuickToggleButton label="None" onClick={clearAll} />
      </div>

      {/* ── Right: category pills ───────────────────────────────────── */}
      {ALL_CATEGORIES.map((cat) => (
        <CategoryPill
          key={cat}
          category={cat}
          isActive={activeCategories.has(cat)}
          count={eventCounts[cat] ?? 0}
          onToggle={() => toggleCategory(cat)}
        />
      ))}

      {/* Screen-reader-only status summary */}
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {allActive
          ? 'All categories visible'
          : noneActive
          ? 'No categories visible'
          : `${activeCategories.size} of ${ALL_CATEGORIES.length} categories visible`}
      </span>
    </div>
  );
}
