/**
 * CategoriesPage — overview grid showing all event categories.
 *
 * Route: /categories
 *
 * Each category card shows: emoji, name, event count, top-3 featured events,
 * and a "Browse" button linking to /categories/:category.
 *
 * Does NOT own: category detail, event detail, routing setup.
 */

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchCategories } from '../api/client';
import CategoryCard from '../components/CategoryCard';

/** Stale time for the categories query (5 minutes). */
const CATEGORIES_STALE_TIME = 5 * 60 * 1000;

/** Number of skeleton cards to show while loading. */
const SKELETON_COUNT = 8;

/**
 * Loading skeleton for a category card.
 */
function CategoryCardSkeleton() {
  return (
    <div
      style={{
        background: '#f1f5f9',
        borderRadius: 16,
        padding: 24,
        minHeight: 280,
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e2e8f0' }} />
        <div style={{ flex: 1, height: 20, borderRadius: 4, background: '#e2e8f0' }} />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ height: 16, borderRadius: 4, background: '#e2e8f0', marginBottom: 8, width: `${85 - i * 10}%` }} />
      ))}
    </div>
  );
}

/**
 * CategoriesPage — renders the category overview grid.
 */
export default function CategoriesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: CATEGORIES_STALE_TIME,
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#fff',
          padding: '40px 24px 32px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
            ← Back to Timeline
          </Link>
          <h1 style={{ margin: '16px 0 8px', fontSize: 32, fontWeight: 800 }}>
            📚 Browse by Category
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: 16 }}>
            Explore historical events organized by type
          </p>
        </div>
      </header>

      {/* Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, color: '#dc2626', marginBottom: 24 }}>
            Failed to load categories. Please try again.
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => <CategoryCardSkeleton key={i} />)
            : data?.categories.map((cat) => (
                <CategoryCard key={cat.category} category={cat} />
              ))}
        </div>
      </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
