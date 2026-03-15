import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS, CONNECTION_COLORS, CONNECTION_LABELS } from '../utils/categories';
import type { EventCategory, ConnectionType } from '../types';

const CATEGORIES: EventCategory[] = ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];
const CONNECTIONS: ConnectionType[] = ['causes', 'leads_to', 'enables', 'context'];

export default function CategoryLegend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        left: 16,
        zIndex: 150,
        backgroundColor: 'rgba(7, 14, 34, 0.90)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: collapsed ? '10px 14px' : '14px 16px',
        minWidth: collapsed ? 'auto' : 180,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        transition: 'all 0.2s',
      }}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#94a3b8',
          padding: 0,
          marginBottom: collapsed ? 0 : 12,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <span>Legend</span>
        <span style={{ fontSize: 14 }}>{collapsed ? '▸' : '▾'}</span>
      </button>

      {!collapsed && (
        <>
          {/* Event categories */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, fontWeight: 700 }}>
              Event Type
            </div>
            {CATEGORIES.map((cat) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    backgroundColor: CATEGORY_COLORS[cat],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {CATEGORY_ICONS[cat]}
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{CATEGORY_LABELS[cat]}</span>
              </div>
            ))}
          </div>

          {/* Causality edges */}
          <div>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, fontWeight: 700 }}>
              Causality
            </div>
            {CONNECTIONS.map((conn) => (
              <div key={conn} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: 18 }}>
                  <div
                    style={{
                      width: 18,
                      height: 2.5,
                      backgroundColor: CONNECTION_COLORS[conn],
                      borderRadius: 2,
                      opacity: 0.85,
                      boxShadow: `0 0 4px ${CONNECTION_COLORS[conn]}66`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{CONNECTION_LABELS[conn]}</span>
              </div>
            ))}
          </div>

          {/* Deep Dives */}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, fontWeight: 700 }}>
              Deep Dives
            </div>
            <Link
              to="/human-origins"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: '#60a5fa',
                textDecoration: 'none',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 12 }}>{'\u{1F9B4}'}</span>
              Human Origins
            </Link>
            <Link
              to="/psychology-history"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                color: '#60a5fa',
                textDecoration: 'none',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 12 }}>{'\u{1F9E0}'}</span>
              History of Psychology
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
