/**
 * DailyButton — toolbar button linking to the daily challenge page.
 *
 * Shows a streak badge when user has an active streak.
 * Positioned in the top toolbar area, near the On This Day button.
 */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const STREAK_KEY = 'chronicle:dailyStreak';

/** Toolbar button that navigates to /daily. */
export default function DailyButton() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setStreak(data.current ?? 0);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <Link
      to="/daily"
      title="Daily History Challenge"
      aria-label="Daily History Challenge"
      style={{
        position: 'fixed',
        top: 16,
        right: 290,
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
      <span style={{ fontSize: 16 }}>📅</span>
      Daily
      {streak > 0 && (
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          backgroundColor: '#ef4444',
          color: '#fff',
          borderRadius: 10,
          padding: '1px 6px',
          marginLeft: 2,
        }}>
          🔥{streak}
        </span>
      )}
    </Link>
  );
}
