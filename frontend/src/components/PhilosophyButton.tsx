/**
 * PhilosophyButton.tsx
 *
 * Toolbar button that navigates to the /philosophy guide page.
 * Positioned in the top toolbar area near other navigation buttons.
 */

import { useNavigate } from 'react-router-dom';

export default function PhilosophyButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/philosophy')}
      title="Philosophy Guide"
      aria-label="Open Philosophy Guide"
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
      }}
    >
      <span style={{ fontSize: 14 }}>&#x2696;</span>
      Philosophy
    </button>
  );
}
