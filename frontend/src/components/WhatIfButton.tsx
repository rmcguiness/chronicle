/**
 * WhatIfButton — toolbar button linking to the What If counterfactual explorer.
 * Positioned in the top toolbar area, near the On This Day button.
 */

import { Link } from 'react-router-dom';

export default function WhatIfButton() {
  return (
    <Link
      to="/what-if"
      title="What If — Counterfactual History Explorer"
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
      <span style={{ fontSize: 16 }}>🦋</span>
      What If
    </Link>
  );
}
