/**
 * CollectionsPage — grid of curated history collections ("playlists").
 *
 * Owns: fetching collection list, rendering card grid.
 * Does NOT own: individual collection detail (see CollectionDetailPage).
 */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchCollections } from '../api/client';
import type { CollectionSummary } from '../api/client';

/** Stale time for collections list query (5 minutes). */
const COLLECTIONS_STALE_TIME_MS = 5 * 60 * 1000;

/**
 * Card component for a single collection in the grid.
 */
function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      to={`/collections/${collection.slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: 16,
          padding: 28,
          border: `1px solid ${collection.theme_color}33`,
          borderTop: `3px solid ${collection.theme_color}`,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 40px ${collection.theme_color}30`;
          e.currentTarget.style.borderColor = `${collection.theme_color}88`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = `${collection.theme_color}33`;
        }}
      >
        <div style={{ fontSize: 36 }}>{collection.icon_emoji}</div>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>
          {collection.title}
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, flex: 1 }}>
          {collection.description}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: collection.theme_color,
            fontWeight: 600,
          }}
        >
          <span>{collection.event_count} events</span>
          <span style={{ marginLeft: 'auto', fontSize: 18 }}>→</span>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsPage() {
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    staleTime: COLLECTIONS_STALE_TIME_MS,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        fontFamily: "'Inter', sans-serif",
        padding: '40px 20px',
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 40 }}>
        <Link
          to="/"
          style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 20,
          }}
        >
          ← Back to Timeline
        </Link>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: '#f1f5f9' }}>
          📚 Curated Collections
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 600 }}>
          Hand-picked sets of events that tell a focused story. Think of them as playlists for history.
        </p>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {isLoading && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>
            Loading collections…
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', color: '#f87171', padding: 60 }}>
            Failed to load collections. Please try again.
          </div>
        )}

        {collections && collections.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}

        {collections && collections.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>
            No collections found.
          </div>
        )}
      </div>
    </div>
  );
}
