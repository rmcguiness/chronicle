/**
 * CategoryCard — overview card for a single event category.
 *
 * Shows: emoji, name, event count badge, top-3 featured events, browse button.
 * Used on the /categories overview page.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CategorySummary } from '../api/client';
import {
  getCategoryEmoji,
  getCategoryLabel,
  CATEGORY_BG_COLORS,
  CATEGORY_ACCENT_COLORS,
} from '../utils/categoryConstants';

/** Props for CategoryCard. */
interface CategoryCardProps {
  /** Category data from the API. */
  category: CategorySummary;
}

/**
 * CategoryCard — renders a single category as a browsable card.
 * @param props - CategoryCardProps
 */
export default function CategoryCard({ category }: CategoryCardProps) {
  const emoji = getCategoryEmoji(category.category);
  const label = getCategoryLabel(category.category);
  const bg = CATEGORY_BG_COLORS[category.category] ?? '#f8fafc';
  const accent = CATEGORY_ACCENT_COLORS[category.category] ?? '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: bg,
        borderRadius: 16,
        border: `1px solid ${accent}33`,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minHeight: 280,
      }}
    >
      {/* Header: emoji + name + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{label}</h3>
        </div>
        <span
          style={{
            background: accent,
            color: '#fff',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {category.count.toLocaleString()}
        </span>
      </div>

      {/* Featured events */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {category.featured.map((ev) => (
          <Link
            key={ev.id}
            to={`/event/${ev.slug}`}
            style={{
              textDecoration: 'none',
              color: '#475569',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                background: accent + '22',
                color: accent,
                borderRadius: 6,
                padding: '2px 6px',
                fontSize: 12,
                fontWeight: 600,
                minWidth: 40,
                textAlign: 'center',
              }}
            >
              {ev.year_approx ?? '?'}
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ev.title}
            </span>
          </Link>
        ))}
      </div>

      {/* Browse button */}
      <Link
        to={`/categories/${category.category}`}
        style={{
          display: 'block',
          textAlign: 'center',
          background: accent,
          color: '#fff',
          borderRadius: 10,
          padding: '10px 16px',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Browse {label} →
      </Link>
    </motion.div>
  );
}
