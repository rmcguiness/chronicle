/**
 * CategoryEventCard — event card shown in the category detail listing.
 *
 * Shows: year badge, title, region, importance stars, "View Details" link.
 * Used on /categories/:category pages.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CategoryEventItem } from '../api/client';

/** Maximum importance stars to display. */
const MAX_STARS = 5;

/** Props for CategoryEventCard. */
interface CategoryEventCardProps {
  event: CategoryEventItem;
  index: number;
}

/**
 * Render importance as filled/empty stars.
 * @param score - Importance score 0–1
 * @returns Star string
 */
function renderStars(score: number): string {
  const filled = Math.round(score * MAX_STARS);
  return '★'.repeat(filled) + '☆'.repeat(MAX_STARS - filled);
}

/**
 * Format a year for display, handling BCE.
 * @param year - Approximate year
 * @param isBce - Whether the event is BCE
 */
function formatYear(year: number | null, isBce: boolean | null): string {
  if (year === null) return '?';
  if (isBce) return `${Math.abs(year)} BCE`;
  return String(year);
}

/**
 * CategoryEventCard — renders a single event in the category listing.
 * @param props - CategoryEventCardProps
 */
export default function CategoryEventCard({ event, index }: CategoryEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'box-shadow 0.2s',
      }}
      whileHover={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
    >
      {/* Year badge + title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span
          style={{
            background: '#1e293b',
            color: '#fff',
            borderRadius: 8,
            padding: '4px 10px',
            fontSize: 13,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {formatYear(event.year_approx, event.is_bce)}
        </span>
        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
          {event.title}
        </h4>
      </div>

      {/* Region */}
      {event.region && (
        <span style={{ fontSize: 13, color: '#64748b' }}>📍 {event.region}</span>
      )}

      {/* Importance */}
      <div style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 1 }}>
        {renderStars(event.importance_score)}
      </div>

      {/* Description if available */}
      {event.short_description && (
        <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
          {event.short_description}
        </p>
      )}

      {/* View Details */}
      <Link
        to={`/event/${event.slug}`}
        style={{
          marginTop: 'auto',
          fontSize: 13,
          fontWeight: 600,
          color: '#3b82f6',
          textDecoration: 'none',
        }}
      >
        View Details →
      </Link>
    </motion.div>
  );
}
