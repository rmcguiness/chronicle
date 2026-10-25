/**
 * DemoBanner — small, persistent notice shown only in demo builds (VITE_DEMO_MODE=true).
 *
 * Owns: the "read-only sample data" label and data-license attribution link.
 * Does NOT own: any demo data loading (see api/demo.ts).
 */
import { IS_DEMO_MODE } from '../config/demo';

const REPO_URL = 'https://github.com/rmcguiness/chronicle';

/** Renders nothing outside demo mode. */
export default function DemoBanner() {
  if (!IS_DEMO_MODE) return null;
  return (
    <div
      role="status"
      aria-label="Demo mode notice"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 96,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        maxWidth: 'calc(100vw - 32px)',
        padding: '6px 12px',
        borderRadius: 999,
        background: 'rgba(15, 17, 23, 0.9)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        backdropFilter: 'blur(8px)',
        color: '#fde68a',
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.4,
        fontFamily: "'Inter', sans-serif",
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      }}
    >
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#fbbf24', flexShrink: 0 }} />
      <span>Demo mode: read-only sample data</span>
      <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
      <a
        href={`${REPO_URL}/blob/main/LICENSE-DATA.md`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#cbd5e1', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        Data: ODbL / CC BY-SA
      </a>
    </div>
  );
}

/** Shown at /admin in demo builds instead of the admin console. */
export function DemoUnavailable({ feature }: { feature: string }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1020',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 420, textAlign: 'center', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>{feature} isn't available in the demo</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 20px' }}>
          This is a read-only build with a static sample of the data. Run the full app with the
          backend to use this feature.
        </p>
        <a href="/" style={{ color: '#60a5fa', fontSize: 14 }}>
          ← Back to the timeline
        </a>
      </div>
    </main>
  );
}
