/**
 * RabbitHoleButton — toolbar button that links to the /rabbit-hole explorer.
 *
 * Positioned in the top toolbar area next to the On This Day button.
 */

import { Link } from 'react-router-dom';

/** Toolbar link button that navigates to the Rabbit Hole explorer. */
export default function RabbitHoleButton() {
  return (
    <Link
      to="/rabbit-hole"
      title="History Rabbit Hole"
      aria-label="Open History Rabbit Hole explorer"
      style={{
        position: 'fixed',
        top: 16,
        right: 300,
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
      <span style={{ fontSize: 16 }}>🐇</span>
      Rabbit Hole
    </Link>
  );
}
