/**
 * ConnectionsBadge.tsx — Small circular badge showing total causal connections.
 *
 * Rendered in the bottom-right corner of each EventNode. Shows the total
 * connection count (incoming + outgoing). Blue when >= 5 connections, gray
 * otherwise. Displays a tooltip on hover with the exact count.
 *
 * Fetches GET /api/events/{slug}/connection-count on mount and caches the
 * result in component state to avoid redundant network requests.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchConnectionCount } from '../api/client';

interface ConnectionsBadgeProps {
  slug: string;
  /** Node diameter in px — used to position the badge relative to the circle. */
  nodeSize: number;
}

export default function ConnectionsBadge({ slug, nodeSize }: ConnectionsBadgeProps) {
  const [total, setTotal] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchConnectionCount(slug).then((data) => {
      if (!cancelled && data) setTotal(data.total);
    });
    return () => { cancelled = true; };
  }, [slug]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  if (total === null || total === 0) return null;

  const color = total >= 5 ? '#3b82f6' : '#6b7280';
  const badgeSize = Math.max(16, Math.min(20, nodeSize * 0.4));
  const fontSize = badgeSize * 0.55;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: badgeSize,
        height: badgeSize,
        borderRadius: '50%',
        backgroundColor: color,
        border: '1.5px solid rgba(255,255,255,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1,
        pointerEvents: 'auto',
        cursor: 'default',
        zIndex: 5,
      }}
    >
      {total}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: badgeSize + 4,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(7,14,34,0.95)',
            border: `1px solid ${color}66`,
            borderRadius: 4,
            padding: '3px 7px',
            whiteSpace: 'nowrap',
            fontSize: 11,
            color: '#e2e8f0',
            pointerEvents: 'none',
            zIndex: 10001,
          }}
        >
          {total} connection{total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
