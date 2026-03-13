/**
 * SurpriseMeButton — Toolbar button that navigates to a random high-importance event.
 *
 * Picks a random event with importance_score >= 0.8 from the tile endpoint,
 * flies the canvas to that event, and opens its detail panel.
 */
import { useState, useCallback } from 'react';
import { fetchRandomFeaturedEvent } from '../api/featured';
import { useAppStore } from '../store';

export default function SurpriseMeButton() {
  const [loading, setLoading] = useState(false);
  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const event = await fetchRandomFeaturedEvent();
      if (event) {
        setFlyToEvent(event);
        setSelectedEvent(event.slug);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, setFlyToEvent, setSelectedEvent]);

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Surprise Me — random notable event"
      style={{
        position: 'fixed',
        top: 16,
        right: 310,
        zIndex: 30,
        padding: '8px 14px',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,17,23,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap' as const,
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ fontSize: 14 }}>🎲</span>
      Surprise Me
    </button>
  );
}
