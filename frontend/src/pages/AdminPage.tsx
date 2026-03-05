/**
 * AdminPage — admin review dashboard for submitted events.
 *
 * Owns: admin authentication (via localStorage key), event listing, approve/reject actions.
 * Does NOT own: event rendering, canvas state.
 *
 * Accessible at /admin.
 */
import { useState, useEffect, useCallback } from 'react';

/** Shape of an event item from the admin API. */
interface AdminEvent {
  id: string;
  title: string;
  year_approx: number | null;
  category: string | null;
  description: string | null;
  review_status: string;
  created_at: string;
}

/** localStorage key for persisting the admin API key. */
const ADMIN_KEY_STORAGE = 'chronicle-admin-key';

/**
 * Admin review page for managing submitted events.
 * Prompts for admin key on first visit, stores in localStorage.
 */
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || '');
  const [keyInput, setKeyInput] = useState('');
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = adminKey.length > 0;

  const fetchEvents = useCallback(async () => {
    if (!adminKey) return;
    setLoading(true);
    setError(null);
    try {
      const url = statusFilter ? `/api/admin/events?status=${statusFilter}` : '/api/admin/events';
      const resp = await fetch(url, { headers: { 'X-Admin-Key': adminKey } });
      if (resp.status === 403) { setError('Invalid admin key'); setAdminKey(''); localStorage.removeItem(ADMIN_KEY_STORAGE); return; }
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      setEvents(await resp.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [adminKey, statusFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleReview = useCallback(async (id: string, review_status: string) => {
    try {
      const resp = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ review_status }),
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      // Remove from list after action
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  }, [adminKey]);

  const handleKeySubmit = useCallback(() => {
    if (keyInput.trim()) {
      const key = keyInput.trim();
      setAdminKey(key);
      localStorage.setItem(ADMIN_KEY_STORAGE, key);
    }
  }, [keyInput]);

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh', backgroundColor: '#0f1117', color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif", padding: 32,
  };

  if (!isAuthenticated) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 16 }}>Admin Access</h1>
          <input
            style={{ width: '100%', padding: '10px 12px', borderRadius: 6, backgroundColor: '#1a1d2e', border: '1px solid rgba(148,163,184,0.3)', color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box', marginBottom: 12 }}
            type="password"
            placeholder="Enter admin key"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleKeySubmit()}
          />
          <button
            onClick={handleKeySubmit}
            style={{ padding: '10px 24px', borderRadius: 6, border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 14 }}
          >
            Enter
          </button>
          {error && <p style={{ color: '#ef4444', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, margin: 0 }}>Event Review</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            {['pending', 'approved', 'rejected', ''].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  border: statusFilter === s ? '1px solid #3b82f6' : '1px solid rgba(148,163,184,0.3)',
                  backgroundColor: statusFilter === s ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: statusFilter === s ? '#60a5fa' : '#94a3b8',
                }}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: 12 }}>{error}</p>}
        {loading && <p style={{ color: '#94a3b8' }}>Loading…</p>}

        {!loading && events.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', marginTop: 48 }}>No events found.</p>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
              {['Title', 'Year', 'Category', 'Status', 'Submitted', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map(ev => (
              <tr key={ev.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{ev.title}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{ev.year_approx}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{ev.category}</td>
                <td style={{ padding: '10px 12px', fontSize: 13 }}>{ev.review_status}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: '#94a3b8' }}>
                  {ev.created_at ? new Date(ev.created_at).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  {ev.review_status === 'pending' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleReview(ev.id, 'approved')}
                        style={{ padding: '4px 10px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e', cursor: 'pointer', fontSize: 12 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(ev.id, 'rejected')}
                        style={{ padding: '4px 10px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
