/**
 * HeadlineCard — newspaper-style large event card for the Year in Review page.
 *
 * Displays: title, date, category badge, 2-line description.
 * Links to /event/:slug for full detail.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/** Category → color mapping for badges. */
const CATEGORY_COLORS: Record<string, string> = {
  war: '#dc2626',
  politics: '#2563eb',
  science: '#16a34a',
  culture: '#9333ea',
  religion: '#d97706',
  economics: '#0891b2',
  exploration: '#059669',
  disaster: '#ef4444',
};

interface HeadlineCardProps {
  /** Event slug for link. */
  slug: string;
  /** Event title. */
  title: string;
  /** Display date string. */
  dateDisplay: string | null;
  /** Event category. */
  category: string | null;
  /** Importance score 0–1. */
  importanceScore: number;
  /** Short description (2 lines max). */
  description: string | null;
  /** Approximate year. */
  yearApprox: number | null;
}

/**
 * HeadlineCard — renders a single headline event as a newspaper card.
 */
export default function HeadlineCard({
  slug,
  title,
  dateDisplay,
  category,
  importanceScore,
  description,
  yearApprox,
}: HeadlineCardProps) {
  // yearApprox available for future use (e.g., BCE indicator in date display)
  void yearApprox;
  const badgeColor = category ? (CATEGORY_COLORS[category.toLowerCase()] ?? '#6b7280') : '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: '#fefce8',
        border: '1px solid #d4c89a',
        borderRadius: 4,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minHeight: 160,
      }}
    >
      {/* Category badge + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {category && (
          <span
            style={{
              background: badgeColor,
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 3,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {category}
          </span>
        )}
        {dateDisplay && (
          <span style={{ fontSize: '0.75rem', color: '#78716c', fontStyle: 'italic' }}>
            {dateDisplay}
          </span>
        )}
      </div>

      {/* Title */}
      <Link
        to={`/event/${slug}`}
        style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#1c1917',
          textDecoration: 'none',
          lineHeight: 1.3,
          fontFamily: "'Georgia', 'Times New Roman', serif",
        }}
      >
        {title}
      </Link>

      {/* Description — 2 lines max */}
      {description && (
        <p
          style={{
            fontSize: '0.85rem',
            color: '#57534e',
            margin: 0,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>
      )}

      {/* Importance indicator */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
        <div
          style={{
            width: 40,
            height: 3,
            background: '#e7e5e4',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${importanceScore * 100}%`,
              height: '100%',
              background: badgeColor,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
