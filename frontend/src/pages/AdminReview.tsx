/**
 * AdminReview — password-gated admin review page for pending event submissions (FEAT-02).
 *
 * Owns: admin token auth (sessionStorage), listing of pending events,
 *       approve and reject actions.
 * Does NOT own: event rendering, main timeline, submission form.
 *
 * Accessible at /admin/review.
 *
 * Auth flow:
 *   1. On mount, read token from sessionStorage (key: chronicle-admin-token).
 *   2. If missing, render a password prompt.
 *   3. On entry, store token in sessionStorage and attempt a fetch.
 *   4. On 403, clear token and re-show prompt.
 *
 * The token is sent as the X-Admin-Token header on every authenticated call.
 */
import { useState, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Shape of a pending event returned by GET /api/admin/pending. */
interface PendingEvent {
  id: string;
  title: string;
  year_approx: number;
  lat: number;
  lng: number;
  category: string;
  importance_score: number;
  description: string;
  status: string;
  submitted_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** sessionStorage key for persisting the admin token within a tab session. */
const TOKEN_KEY = 'chronicle-admin-token';

// ─── Shared styles ───────────────────────────────────────────────────────────

const PAGE_STYLE: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#0f1117',
  color: '#e2e8f0',
  fontFamily: "'Inter', sans-serif",
  padding: 32,
};

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: 11,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 600,
};

const TD_STYLE: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 13,
  verticalAlign: 'top',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

interface AuthPromptProps {
  error: string | null;
  onSubmit: (token: string) => void;
}

/**
 * Renders the admin token input prompt shown when unauthenticated.
 *
 * @param error  - Optional error message to display below the form.
 * @param onSubmit - Callback invoked with the trimmed token string.
 */
function AuthPrompt({ error, onSubmit }: AuthPromptProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) onSubmit(trimmed);
  }, [input, onSubmit]);

  return (
    <div style={PAGE_STYLE}>
      <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, marginBottom: 8, fontWeight: 700 }}>Admin Review</h1>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
          Enter your admin token to access the review queue.
        </p>
        <input
          type="password"
          placeholder="Admin token"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 6,
            backgroundColor: '#1a1d2e',
            border: '1px solid rgba(148,163,184,0.3)',
            color: '#e2e8f0',
            fontSize: 14,
            boxSizing: 'border-box',
            marginBottom: 12,
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 28px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Enter
        </button>
        {error !== null && (
          <p style={{ color: '#ef4444', marginTop: 16, fontSize: 14 }}>{error}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * Admin review dashboard for pending event submissions.
 *
 * Password-gated: prompts for the admin token on first load.
 * Stores token in sessionStorage (cleared when the tab closes).
 * Displays pending events with Approve / Reject actions.
 */
export default function AdminReview() {
  const [token, setToken] = useState<string>(
    () => sessionStorage.getItem(TOKEN_KEY) ?? '',
  );
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track per-row action state to show inline loading without blocking the table
  const [actionIds, setActionIds] = useState<Set<string>>(new Set());

  const isAuthenticated = token.length > 0;

  // ── Fetch pending events ──────────────────────────────────────────────────

  const fetchPending = useCallback(async (tkn: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/admin/pending', {
        headers: { 'X-Admin-Token': tkn },
      });
      if (resp.status === 403) {
        setError('Invalid admin token.');
        setToken('');
        sessionStorage.removeItem(TOKEN_KEY);
        return;
      }
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      const data: PendingEvent[] = await resp.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPending(token);
  }, [isAuthenticated, token, fetchPending]);

  // ── Auth prompt handler ───────────────────────────────────────────────────

  const handleTokenSubmit = useCallback((tkn: string) => {
    sessionStorage.setItem(TOKEN_KEY, tkn);
    setToken(tkn);
  }, []);

  // ── Row actions ───────────────────────────────────────────────────────────

  /**
   * Call approve or reject for a pending event, then remove from local list.
   *
   * @param id     - The pending event UUID.
   * @param action - 'approve' or 'reject'.
   */
  const handleAction = useCallback(
    async (id: string, action: 'approve' | 'reject') => {
      setActionIds(prev => new Set(prev).add(id));
      setError(null);
      try {
        const resp = await fetch(`/api/admin/${action}/${id}`, {
          method: 'POST',
          headers: { 'X-Admin-Token': token },
        });
        if (resp.status === 403) {
          setError('Admin token rejected — please log in again.');
          setToken('');
          sessionStorage.removeItem(TOKEN_KEY);
          return;
        }
        if (!resp.ok) {
          const data: { detail?: string } = await resp.json().catch(() => ({}));
          throw new Error(data.detail ?? `Server error ${resp.status}`);
        }
        // Remove the row from the list on success
        setEvents(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Action failed.');
      } finally {
        setActionIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [token],
  );

  // ── Render: unauthenticated ───────────────────────────────────────────────

  if (!isAuthenticated) {
    return <AuthPrompt error={error} onSubmit={handleTokenSubmit} />;
  }

  // ── Render: authenticated ─────────────────────────────────────────────────

  return (
    <div style={PAGE_STYLE}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Pending Submissions</h1>
            <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>
              {events.length} event{events.length !== 1 ? 's' : ''} awaiting review
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => fetchPending(token)}
              disabled={loading}
              style={{
                padding: '7px 14px',
                borderRadius: 6,
                border: '1px solid rgba(148,163,184,0.3)',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13,
              }}
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem(TOKEN_KEY);
                setToken('');
              }}
              style={{
                padding: '7px 14px',
                borderRadius: 6,
                border: '1px solid rgba(148,163,184,0.3)',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Global error */}
        {error !== null && (
          <p
            style={{
              color: '#f87171',
              backgroundColor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              padding: '10px 14px',
              borderRadius: 6,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error}
          </p>
        )}

        {/* Loading state */}
        {loading && events.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: 48 }}>
            Loading…
          </p>
        )}

        {/* Empty state */}
        {!loading && events.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 64,
              color: '#475569',
            }}
          >
            <p style={{ fontSize: 32, margin: 0 }}>✓</p>
            <p style={{ fontSize: 15, marginTop: 8 }}>No pending submissions.</p>
          </div>
        )}

        {/* Events table */}
        {events.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                  {[
                    'Title',
                    'Year',
                    'Category',
                    'Importance',
                    'Location',
                    'Description',
                    'Submitted',
                    'Actions',
                  ].map(h => (
                    <th key={h} style={TH_STYLE}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(ev => {
                  const busy = actionIds.has(ev.id);
                  const yearLabel =
                    ev.year_approx < 0
                      ? `${Math.abs(ev.year_approx)} BCE`
                      : String(ev.year_approx);

                  return (
                    <tr
                      key={ev.id}
                      style={{
                        borderBottom: '1px solid rgba(148,163,184,0.08)',
                        opacity: busy ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <td style={{ ...TD_STYLE, fontWeight: 500, maxWidth: 200 }}>
                        {ev.title}
                      </td>
                      <td style={TD_STYLE}>{yearLabel}</td>
                      <td style={{ ...TD_STYLE, textTransform: 'capitalize' }}>
                        {ev.category}
                      </td>
                      <td style={TD_STYLE}>{ev.importance_score.toFixed(2)}</td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: '#94a3b8' }}>
                        {ev.lat.toFixed(3)}, {ev.lng.toFixed(3)}
                      </td>
                      <td
                        style={{
                          ...TD_STYLE,
                          maxWidth: 260,
                          fontSize: 12,
                          color: '#94a3b8',
                          lineHeight: 1.5,
                        }}
                      >
                        {ev.description.length > 120
                          ? `${ev.description.slice(0, 120)}…`
                          : ev.description}
                      </td>
                      <td style={{ ...TD_STYLE, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {ev.submitted_at
                          ? new Date(ev.submitted_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td style={TD_STYLE}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                          <button
                            onClick={() => handleAction(ev.id, 'approve')}
                            disabled={busy}
                            title="Approve — moves to events table"
                            style={{
                              padding: '5px 11px',
                              borderRadius: 5,
                              border: 'none',
                              backgroundColor: 'rgba(34,197,94,0.18)',
                              color: '#22c55e',
                              cursor: busy ? 'not-allowed' : 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleAction(ev.id, 'reject')}
                            disabled={busy}
                            title="Reject — permanently deletes"
                            style={{
                              padding: '5px 11px',
                              borderRadius: 5,
                              border: 'none',
                              backgroundColor: 'rgba(239,68,68,0.18)',
                              color: '#ef4444',
                              cursor: busy ? 'not-allowed' : 'pointer',
                              fontSize: 12,
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer nav */}
        <p style={{ marginTop: 40, fontSize: 13, color: '#475569' }}>
          <a href="/admin/submit" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Submit a new event
          </a>
          {' · '}
          <a href="/admin" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Legacy admin
          </a>
          {' · '}
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            Timeline
          </a>
        </p>
      </div>
    </div>
  );
}
