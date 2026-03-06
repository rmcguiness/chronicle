/**
 * AdminPage — admin review dashboard for submitted events and group management.
 *
 * Owns: admin authentication (via localStorage key), event listing,
 *   approve/reject actions, group management (list groups, assign/unassign children).
 * Does NOT own: event rendering, canvas state.
 *
 * Accessible at /admin.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchGroups, patchEvent } from '../api/client';
import type { GroupEvent } from '../types';

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

/** Shape of a search result for child assignment. */
interface SearchEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number | null;
  category: string | null;
}

/** Shape of a child event returned by the tiles endpoint. */
interface ChildEvent {
  id: string;
  title: string;
  year_approx: number | null;
  category: string | null;
}

/** localStorage key for persisting the admin API key. */
const ADMIN_KEY_STORAGE = 'chronicle-admin-key';

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

/** Shared page styles. */
const pageStyle: React.CSSProperties = {
  minHeight: '100vh', backgroundColor: '#0f1117', color: '#e2e8f0',
  fontFamily: "'Inter', sans-serif", padding: 32,
};

/** Shared button style. */
const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 18px', borderRadius: 6, fontSize: 13, cursor: 'pointer',
  border: active ? '1px solid #3b82f6' : '1px solid rgba(148,163,184,0.3)',
  backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
  color: active ? '#60a5fa' : '#94a3b8',
});

/**
 * Admin review page for managing submitted events and groups.
 * Prompts for admin key on first visit, stores in localStorage.
 */
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || '');
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'review' | 'groups'>('review');

  const isAuthenticated = adminKey.length > 0;

  const handleKeySubmit = useCallback(() => {
    if (keyInput.trim()) {
      const key = keyInput.trim();
      setAdminKey(key);
      localStorage.setItem(ADMIN_KEY_STORAGE, key);
    }
  }, [keyInput]);

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
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button style={tabBtnStyle(activeTab === 'review')} onClick={() => setActiveTab('review')}>
            Event Review
          </button>
          <button style={tabBtnStyle(activeTab === 'groups')} onClick={() => setActiveTab('groups')}>
            Groups
          </button>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: 12 }}>{error}</p>}

        {activeTab === 'review' && (
          <ReviewTab adminKey={adminKey} setAdminKey={setAdminKey} setError={setError} />
        )}
        {activeTab === 'groups' && (
          <GroupsTab adminKey={adminKey} setError={setError} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Review Tab (original functionality)
// ─────────────────────────────────────────────────────────────────────────────

/** Props for the ReviewTab sub-component. */
interface ReviewTabProps {
  adminKey: string;
  setAdminKey: (k: string) => void;
  setError: (e: string | null) => void;
}

/**
 * ReviewTab — lists events by review status with approve/reject actions.
 */
function ReviewTab({ adminKey, setAdminKey, setError }: ReviewTabProps) {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(false);

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
  }, [adminKey, statusFilter, setAdminKey, setError]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleReview = useCallback(async (id: string, review_status: string) => {
    try {
      const resp = await fetch(`/api/admin/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ review_status }),
      });
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    }
  }, [adminKey, setError]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, margin: 0 }}>Event Review</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {['pending', 'approved', 'rejected', ''].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={tabBtnStyle(statusFilter === s)}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={{ color: '#94a3b8' }}>Loading...</p>}
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
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Groups Tab
// ─────────────────────────────────────────────────────────────────────────────

/** Props for the GroupsTab sub-component. */
interface GroupsTabProps {
  adminKey: string;
  setError: (e: string | null) => void;
}

/**
 * GroupsTab — manage group events: list groups, view/manage children,
 * assign new children, and toggle is_group on any event.
 */
function GroupsTab({ adminKey, setError }: GroupsTabProps) {
  const [groups, setGroups] = useState<GroupEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupEvent | null>(null);
  const [children, setChildren] = useState<ChildEvent[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchEvent[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  /** Fetch all groups from the API. */
  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }, [setError]);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  /** Fetch children for a selected group. */
  const loadChildren = useCallback(async (groupId: string) => {
    setChildrenLoading(true);
    try {
      const resp = await fetch(
        `${BASE_URL}/api/canvas/tiles?zoom=10&year_min=-5000&year_max=2100&limit=2000`,
      );
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      const allEvents = data.events ?? [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw API response
      const filtered = allEvents.filter((e: any) => e.parent_event_id === groupId);
      setChildren(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch children');
    } finally {
      setChildrenLoading(false);
    }
  }, [setError]);

  /** Select a group and load its children. */
  const handleSelectGroup = useCallback((group: GroupEvent) => {
    setSelectedGroup(group);
    setSearchResults([]);
    setSearchQuery('');
    loadChildren(String(group.id));
  }, [loadChildren]);

  /** Unassign a child from its group. */
  const handleUnassign = useCallback(async (childId: string) => {
    try {
      await patchEvent(childId, { parent_event_id: null }, adminKey);
      setChildren(prev => prev.filter(c => c.id !== childId));
      loadGroups(); // Refresh child counts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unassign');
    }
  }, [adminKey, setError, loadGroups]);

  /** Search for events to assign as children. */
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const resp = await fetch(
        `${BASE_URL}/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`,
      );
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const data = await resp.json();
      const results = data.results ?? data;
      // Filter out events that are already groups or already assigned
      const groupIds = new Set(groups.map(g => String(g.id)));
      const childIds = new Set(children.map(c => c.id));
      setSearchResults(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw search results
        (results as any[]).filter((r: any) => !groupIds.has(r.id) && !childIds.has(r.id))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, groups, children, setError]);

  /** Assign an event as a child of the selected group. */
  const handleAssign = useCallback(async (eventId: string) => {
    if (!selectedGroup) return;
    try {
      await patchEvent(eventId, { parent_event_id: String(selectedGroup.id) }, adminKey);
      setSearchResults(prev => prev.filter(r => r.id !== eventId));
      loadChildren(String(selectedGroup.id));
      loadGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign');
    }
  }, [selectedGroup, adminKey, setError, loadChildren, loadGroups]);

  /** Toggle is_group on an event. */
  const handleToggleGroup = useCallback(async (eventId: string, currentlyGroup: boolean) => {
    try {
      await patchEvent(eventId, { is_group: !currentlyGroup }, adminKey);
      loadGroups();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  }, [adminKey, setError, loadGroups]);

  return (
    <>
      <h2 style={{ fontSize: 20, margin: '0 0 16px' }}>Group Management</h2>

      {loading && <p style={{ color: '#94a3b8' }}>Loading groups...</p>}

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left panel: Group list */}
        <div style={{ flex: '0 0 420px', maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)' }}>
                {['Title', 'Year', 'Children', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr
                  key={g.id}
                  onClick={() => handleSelectGroup(g)}
                  style={{
                    borderBottom: '1px solid rgba(148,163,184,0.1)',
                    cursor: 'pointer',
                    backgroundColor: selectedGroup?.id === g.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '8px', fontSize: 12, maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.title}</td>
                  <td style={{ padding: '8px', fontSize: 12 }}>{g.year_approx}</td>
                  <td style={{ padding: '8px', fontSize: 12, textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: g.child_count > 0 ? 'rgba(59,130,246,0.2)' : 'rgba(148,163,184,0.15)',
                      color: g.child_count > 0 ? '#60a5fa' : '#64748b',
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                    }}>
                      {g.child_count}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleGroup(String(g.id), true); }}
                      style={{ padding: '2px 8px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 10 }}
                      title="Remove group status"
                    >
                      Ungroup
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right panel: Selected group detail */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedGroup ? (
            <p style={{ color: '#64748b', marginTop: 48, textAlign: 'center' }}>
              Select a group to manage its children.
            </p>
          ) : (
            <>
              <h3 style={{ fontSize: 16, marginBottom: 12, color: '#f1f5f9' }}>
                {selectedGroup.title}
                <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                  ({selectedGroup.year_approx})
                </span>
              </h3>

              {/* Children list */}
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
                  Children ({children.length})
                </h4>
                {childrenLoading && <p style={{ fontSize: 12, color: '#64748b' }}>Loading...</p>}
                {!childrenLoading && children.length === 0 && (
                  <p style={{ fontSize: 12, color: '#475569' }}>No children assigned yet.</p>
                )}
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {children.map(c => (
                    <div key={c.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 8px', borderBottom: '1px solid rgba(148,163,184,0.08)',
                    }}>
                      <span style={{ fontSize: 12 }}>
                        {c.title}
                        <span style={{ color: '#64748b', marginLeft: 6 }}>({c.year_approx})</span>
                      </span>
                      <button
                        onClick={() => handleUnassign(c.id)}
                        style={{ padding: '2px 8px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 10 }}
                      >
                        Unassign
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search & assign */}
              <div style={{ borderTop: '1px solid rgba(148,163,184,0.15)', paddingTop: 12 }}>
                <h4 style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>Assign Events</h4>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    style={{
                      flex: 1, padding: '8px 10px', borderRadius: 6,
                      backgroundColor: '#1a1d2e', border: '1px solid rgba(148,163,184,0.3)',
                      color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box',
                    }}
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    style={{ padding: '8px 16px', borderRadius: 6, border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 13 }}
                  >
                    Search
                  </button>
                </div>

                {searchLoading && <p style={{ fontSize: 12, color: '#64748b' }}>Searching...</p>}
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {searchResults.map(r => (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 8px', borderBottom: '1px solid rgba(148,163,184,0.08)',
                    }}>
                      <span style={{ fontSize: 12 }}>
                        {r.title}
                        <span style={{ color: '#64748b', marginLeft: 6 }}>
                          ({r.year_approx}) {r.category}
                        </span>
                      </span>
                      <button
                        onClick={() => handleAssign(r.id)}
                        style={{ padding: '2px 8px', borderRadius: 4, border: 'none', backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e', cursor: 'pointer', fontSize: 10 }}
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
