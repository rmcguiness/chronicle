/**
 * PathBreadcrumb.tsx
 *
 * Displays the causal path as a breadcrumb trail above the timeline:
 * "Event A -> Event B -> Event C (3 hops)"
 *
 * Visible only when a causal path has been found.
 */

import { useAppStore } from '../store';

/** Accent color matching the path highlight. */
const PATH_COLOR = '#f97316';

/** Breadcrumb trail showing the discovered causal path between two events. */
export default function PathBreadcrumb() {
  const causalPath = useAppStore((s) => s.causalPath);
  const causalPathHops = useAppStore((s) => s.causalPathHops);
  const pathLoading = useAppStore((s) => s.pathLoading);
  const pathStartSlug = useAppStore((s) => s.pathStartSlug);
  const pathEndSlug = useAppStore((s) => s.pathEndSlug);
  const pathModeActive = useAppStore((s) => s.pathModeActive);

  if (!pathModeActive) return null;

  // Loading state
  if (pathLoading) {
    return (
      <div style={containerStyle}>
        <span style={{ color: PATH_COLOR, fontSize: 12 }}>Searching for path...</span>
      </div>
    );
  }

  // No path found
  if (pathStartSlug && pathEndSlug && causalPath.length === 0) {
    return (
      <div style={containerStyle}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
          No causal path found between these events
        </span>
      </div>
    );
  }

  // Path found — render breadcrumb
  if (causalPath.length === 0) return null;

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        {causalPath.map((event, i) => (
          <span key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span
              style={{
                color: i === 0 || i === causalPath.length - 1 ? PATH_COLOR : 'rgba(255,255,255,0.8)',
                fontSize: 12,
                fontWeight: i === 0 || i === causalPath.length - 1 ? 600 : 400,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {event.title}
            </span>
            {i < causalPath.length - 1 && (
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>&rarr;</span>
            )}
          </span>
        ))}
        <span
          style={{
            color: PATH_COLOR,
            fontSize: 11,
            fontWeight: 600,
            marginLeft: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          ({causalPathHops} {causalPathHops === 1 ? 'hop' : 'hops'})
        </span>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 70,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 25,
  padding: '8px 16px',
  borderRadius: 8,
  background: 'rgba(15,17,23,0.92)',
  border: '1px solid rgba(249,115,22,0.2)',
  backdropFilter: 'blur(8px)',
  maxWidth: '80vw',
  overflow: 'hidden',
};
