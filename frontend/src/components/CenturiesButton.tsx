/**
 * CenturiesButton — toolbar link to the /centuries directory page.
 * Positioned in the top toolbar area.
 */

import { Link } from 'react-router-dom';

export default function CenturiesButton() {
  return (
    <Link
      to="/centuries"
      title="Browse by Century"
      aria-label="Browse by Century"
      style={{
        position: 'fixed',
        top: 16,
        right: 56,
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
      Centuries
    </Link>
  );
}
