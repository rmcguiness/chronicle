/**
 * RandomButton.tsx
 *
 * Toolbar button that fetches a random event from the backend,
 * animates the react-flow canvas to center on it, and opens its
 * detail panel. Must be rendered inside a ReactFlowProvider.
 */

import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { fetchRandomEvent } from '../api/client';
import { useAppStore } from '../store';

export default function RandomButton() {
  const [loading, setLoading] = useState(false);
  const reactFlow = useReactFlow();
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const event = await fetchRandomEvent();
      const node = reactFlow.getNode(event.id);
      if (node) {
        await reactFlow.setCenter(node.position.x, node.position.y, {
          zoom: 1.5,
          duration: 800,
        });
      }
      setSelectedEvent(event.slug);
    } catch {
      // silently ignore — button returns to idle state
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Random Event"
      aria-label="Navigate to a random event"
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
        opacity: loading ? 0.7 : 1,
      }}
    >
      <span
        style={{
          fontSize: 16,
          display: 'inline-block',
          ...(loading
            ? { animation: 'spin 1s linear infinite' }
            : {}),
        }}
      >
        {loading ? '\u27F3' : '\uD83C\uDFB2'}
      </span>
      Random
    </button>
  );
}
