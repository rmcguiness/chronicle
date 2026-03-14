/**
 * SixDegreesButton — toolbar link to the Six Degrees of History page.
 *
 * Positioned in the top toolbar area alongside the On This Day button.
 */
import { Link } from 'react-router-dom';

/** Toolbar link styled as a button that navigates to /six-degrees. */
export default function SixDegreesButton() {
  return (
    <Link
      to="/six-degrees"
      title="Six Degrees of History"
      aria-label="Six Degrees of History"
      style={{
        position: 'fixed',
        top: 16,
        right: 310,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: 16 }}>🔗</span>
      Six Degrees
    </Link>
  );
}
