/**
 * DiscoveriesButton — toolbar button linking to /discoveries.
 *
 * Positioned in the top toolbar area alongside other navigation buttons.
 */

import { Link, useLocation } from 'react-router-dom';

export default function DiscoveriesButton() {
  const location = useLocation();
  const active = location.pathname === '/discoveries';

  return (
    <Link
      to="/discoveries"
      title="Scientific Discoveries"
      aria-label="Scientific Discoveries explorer"
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
        border: active
          ? '1px solid rgba(96,165,250,0.4)'
          : '1px solid rgba(255,255,255,0.1)',
        background: active
          ? 'rgba(96,165,250,0.12)'
          : 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: active ? '#60a5fa' : 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        cursor: 'pointer',
        transition: 'all 150ms ease',
        textDecoration: 'none',
      }}
    >
      <span style={{ fontSize: 16 }}>🔬</span>
      Discoveries
    </Link>
  );
}
