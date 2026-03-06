/**
 * EmbedEventPage — minimal standalone embed page for a single event.
 *
 * Route: /embed/event/:slug
 * Designed for 400x300 iframe embedding on external sites.
 * No authentication required. No navigation chrome.
 */
import { useParams } from 'react-router-dom';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchEventDetail } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils/categories';

// ─────────────────────────────────────────────────────────────────────────────
// Named constants
// ─────────────────────────────────────────────────────────────────────────────

const EMBED_BG = '#0f172a';
const EMBED_BORDER = 'rgba(255, 255, 255, 0.08)';
const MAX_IMPORTANCE_STARS = 5;
const CHRONICLE_URL = 'https://chronicle.app';

/** Standalone query client for the embed page (no shared provider needed). */
const embedQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatYear(year: number, dateDisplay?: string): string {
  if (dateDisplay) return dateDisplay;
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

function ImportanceStars({ score }: { score: number }) {
  const filled = Math.round(score * MAX_IMPORTANCE_STARS);
  return (
    <span style={{ fontSize: 13, letterSpacing: 1 }}>
      {Array.from({ length: MAX_IMPORTANCE_STARS }, (_, i) => (
        <span key={i} style={{ color: i < filled ? '#f59e0b' : '#334155' }}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner content (uses hooks — must be inside QueryClientProvider)
// ─────────────────────────────────────────────────────────────────────────────

function EmbedContent() {
  const { slug } = useParams<{ slug: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['embed-event', slug],
    queryFn: () => fetchEventDetail(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: 24,
            height: 24,
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: '#60a5fa',
            borderRadius: '50%',
            animation: 'embedSpin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
        Event not found
      </div>
    );
  }

  const color = CATEGORY_COLORS[event.category] ?? '#6b7280';
  const icon = CATEGORY_ICONS[event.category] ?? '';
  const label = CATEGORY_LABELS[event.category] ?? event.category;
  const eventUrl = `${CHRONICLE_URL}/event/${event.slug}`;

  // Build a short description from perspectives or tags
  const shortDescription =
    event.perspectives.length > 0
      ? event.perspectives[0].summary
      : event.tags?.join(', ') ?? '';

  return (
    <div style={cardStyle}>
      {/* Header: category badge + date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>{icon}</span> {label}
        </span>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
          {formatYear(event.year_approx, event.date_display)}
        </span>
      </div>

      {/* Title */}
      <h2
        style={{
          margin: '0 0 6px',
          fontSize: 18,
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.25,
        }}
      >
        {event.title}
      </h2>

      {/* Importance */}
      <div style={{ marginBottom: 10 }}>
        <ImportanceStars score={event.importance_score} />
      </div>

      {/* Short description */}
      {shortDescription && (
        <p
          style={{
            margin: '0 0 auto',
            fontSize: 13,
            color: '#cbd5e1',
            lineHeight: 1.55,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {shortDescription}
        </p>
      )}

      {/* Footer: Chronicle branding + link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: `1px solid ${EMBED_BORDER}`,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', letterSpacing: '0.05em' }}>
          Chronicle
        </span>
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: '#60a5fa',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          View on Chronicle →
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page wrapper
// ─────────────────────────────────────────────────────────────────────────────

export default function EmbedEventPage() {
  return (
    <QueryClientProvider client={embedQueryClient}>
      <style>{`
        @keyframes embedSpin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${EMBED_BG}; font-family: 'Inter', system-ui, sans-serif; }
      `}</style>
      <EmbedContent />
    </QueryClientProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
  width: '100%',
  height: '100vh',
  maxWidth: 400,
  maxHeight: 300,
  margin: '0 auto',
  padding: 20,
  backgroundColor: EMBED_BG,
  color: '#f1f5f9',
  fontFamily: "'Inter', system-ui, sans-serif",
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};
