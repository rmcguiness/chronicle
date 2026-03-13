/**
 * PersonNode — custom React Flow node for a historical figure.
 *
 * Owns: circular avatar-style node rendering with name, birth year, role badge.
 * Does NOT own: click handling (delegated to React Flow onNodeClick), layout.
 */
import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ROLE_COLORS, getRoleCategory } from '../constants/people';

/** Data shape passed to each person node. */
interface PersonNodeData {
  name: string;
  bornYear: number | null;
  diedYear: number | null;
  roles: string[] | null;
  imageUrl: string | null;
  [key: string]: unknown;
}

/** Diameter of the circular node in pixels. */
const NODE_SIZE = 60;

/** Font size for the name label. */
const NAME_FONT_SIZE = '0.65rem';

/**
 * PersonNode — renders a circular node with name, birth year, and color-coded role ring.
 */
function PersonNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as PersonNodeData;
  const category = getRoleCategory(nodeData.roles);
  const color = ROLE_COLORS[category] ?? ROLE_COLORS.other;
  const initials = nodeData.name
    .split(' ')
    .map((w: string) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Hidden handles for edge connections */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
        {/* Circular avatar with role-colored border */}
        <div
          style={{
            width: NODE_SIZE,
            height: NODE_SIZE,
            borderRadius: '50%',
            border: `3px solid ${color}`,
            background: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {nodeData.imageUrl ? (
            <img
              src={nodeData.imageUrl}
              alt={nodeData.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            <span style={{ color: '#e2e8f0', fontSize: '1rem', fontWeight: 700 }}>
              {initials}
            </span>
          )}
        </div>

        {/* Name label */}
        <div style={{
          marginTop: '0.25rem',
          color: '#e2e8f0',
          fontSize: NAME_FONT_SIZE,
          fontWeight: 500,
          textAlign: 'center',
          maxWidth: '80px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        }}>
          {nodeData.name}
        </div>

        {/* Birth year */}
        {nodeData.bornYear != null && (
          <div style={{ color: '#64748b', fontSize: '0.55rem' }}>
            {nodeData.bornYear < 0 ? `${Math.abs(nodeData.bornYear)} BCE` : nodeData.bornYear}
          </div>
        )}

        {/* Role badge */}
        {nodeData.roles && nodeData.roles.length > 0 && (
          <div style={{
            marginTop: '0.15rem',
            padding: '0.1rem 0.35rem',
            borderRadius: '0.25rem',
            background: color,
            color: '#fff',
            fontSize: '0.5rem',
            fontWeight: 600,
            textTransform: 'capitalize',
            opacity: 0.9,
          }}>
            {nodeData.roles[0].length > 12 ? nodeData.roles[0].slice(0, 12) + '…' : nodeData.roles[0]}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(PersonNodeComponent);
