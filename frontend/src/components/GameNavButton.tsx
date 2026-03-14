/**
 * GameNavButton — fixed toolbar button linking to the /game page.
 *
 * Positioned in the top toolbar area alongside the On This Day button.
 */
import { useNavigate } from 'react-router-dom';

export default function GameNavButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/game')}
      title="Guess the Year Game"
      aria-label="Open history game"
      style={{
        position: 'fixed',
        top: 16,
        right: 100,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        backgroundColor: 'rgba(7, 14, 34, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        color: '#94a3b8',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
        e.currentTarget.style.color = '#e0e7ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.color = '#94a3b8';
      }}
    >
      <span style={{ fontSize: 15 }}>{'\u{1F3AE}'}</span>
      Game
    </button>
  );
}
