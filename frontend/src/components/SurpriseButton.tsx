import { useState, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAppStore } from '../store';
import { fetchRandomEvent } from '../api/client';

export default function SurpriseButton() {
  const [loading, setLoading] = useState(false);
  const { getNodes, setCenter } = useReactFlow();
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);
  const setTimeViewport = useAppStore((s) => s.setTimeViewport);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const event = await fetchRandomEvent(0.7);

      // Expand the time viewport so the event is visible
      const year = event.year_approx ?? 0;
      setTimeViewport({ yearMin: year - 200, yearMax: year + 200 });

      // Wait a tick for nodes to re-render with the new time viewport
      await new Promise((r) => setTimeout(r, 300));

      // Find the node in react-flow
      const node = getNodes().find((n) => n.id === String(event.id));
      if (node) {
        // Center viewport on the node
        setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 800 });

        // Add highlight class to the node's DOM element
        const el = document.querySelector(`[data-id="${node.id}"]`);
        if (el) {
          el.classList.add('surprise-highlight');
          setTimeout(() => el.classList.remove('surprise-highlight'), 2000);
        }
      }

      // Select the event to open the detail panel
      setSelectedEvent(event.slug);
    } catch {
      // Silently ignore errors
    } finally {
      setLoading(false);
    }
  }, [loading, getNodes, setCenter, setSelectedEvent, setTimeViewport]);

  return (
    <button
      onClick={handleClick}
      title="Surprise me! Discover a random important event"
      aria-label="Surprise me with a random event"
      style={{
        position: 'fixed',
        top: 16,
        right: 280,
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
        cursor: loading ? 'wait' : 'pointer',
        transition: 'all 150ms ease',
        opacity: loading ? 0.6 : 1,
      }}
    >
      <span
        style={{
          fontSize: 16,
          display: 'inline-block',
          animation: loading ? 'spin 0.6s linear infinite' : 'none',
        }}
      >
        {loading ? '\u27F3' : '\uD83C\uDFB2'}
      </span>
      Surprise me!
    </button>
  );
}
