/**
 * WelcomeOverlay — shown on first load, dismissed by button or canvas click.
 *
 * Clicking "Explore History" zooms to the WWI→WWII causality chain:
 *   year: 1910–1950 · lat: 35–60°N (Europe)
 */
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

const SESSION_KEY = 'chronicle_welcome_dismissed';

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState<boolean>(() => {
    // Persist dismissal for the session only (not localStorage — show each visit).
    // Shared links that select an event (#...e=slug) go straight to it.
    if (/(^#|&)e=/.test(window.location.hash)) return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });

  const setViewport = useAppStore((s) => s.setViewport);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  };

  const handleExplore = () => {
    // Zoom to WWI → WWII causality chain: Europe 1910–1950
    setViewport({
      year_min: 1910,
      year_max: 1950,
      lat_min: 35,
      lat_max: 62,
      zoom: 6,
    });
    dismiss();
  };

  // Dismiss on any canvas click (canvas is behind the overlay)
  useEffect(() => {
    if (!visible) return;

    // We listen on the overlay backdrop itself via React onClick on the outer div
    // This effect handles keyboard dismissal only
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onClick={(e) => {
        // Clicking the backdrop (not the card) dismisses
        if ((e.target as HTMLElement).closest('[data-welcome-card]')) return;
        dismiss();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 14, 28, 0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        cursor: 'default',
      }}
    >
      <div
        data-welcome-card
        style={{
          background: 'linear-gradient(160deg, #0f1c36 0%, #0a1120 100%)',
          border: '1px solid rgba(99, 179, 237, 0.2)',
          borderRadius: '16px',
          padding: '48px 52px',
          maxWidth: '480px',
          width: '90vw',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,179,237,0.08)',
          fontFamily: "'Inter', system-ui, sans-serif",
          cursor: 'default',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 26,
            boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          }}
        >
          🌐
        </div>

        {/* App name */}
        <h1
          style={{
            margin: '0 0 10px',
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#e2e8f0',
            lineHeight: 1.1,
          }}
        >
          Chronicle
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: '0 0 36px',
            fontSize: 15,
            color: '#64748b',
            lineHeight: 1.5,
            letterSpacing: '0.01em',
          }}
        >
          An open-source immutable historical record
        </p>

        {/* Separator */}
        <div
          style={{
            width: 40,
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.4), transparent)',
            margin: '0 auto 32px',
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            margin: '0 0 36px',
            fontSize: 14,
            color: '#475569',
            lineHeight: 1.7,
          }}
        >
          Explore 5,000+ years of history on an interactive canvas.
          Every event is cited, every perspective preserved.
        </p>

        {/* CTA button */}
        <button
          onClick={handleExplore}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '14px 32px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.01em',
            boxShadow: '0 4px 16px rgba(37,99,235,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 8px 24px rgba(37,99,235,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              '0 4px 16px rgba(37,99,235,0.4)';
          }}
        >
          Explore History
          <span style={{ fontSize: 18 }}>→</span>
        </button>

        {/* Dismiss hint */}
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            color: '#334155',
          }}
        >
          Press Esc or click anywhere to dismiss
        </p>
      </div>
    </div>
  );
}
