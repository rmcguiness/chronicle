/**
 * SubmitEventModal — modal form for submitting a new historical event.
 *
 * Owns: form state, validation, POST to /api/events/submit.
 * Does NOT own: canvas state, event rendering.
 */
import { useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import { CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';
import { IS_DEMO_MODE } from '../config/demo';

/** Props for SubmitEventModal. */
interface SubmitEventModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called to close the modal. */
  onClose: () => void;
}

/** All category keys for the select dropdown. */
const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as EventCategory[];

/** Minimum description length. */
const MIN_DESC_LENGTH = 20;

/**
 * Modal form allowing users to submit a new historical event for admin review.
 *
 * @param props - open/onClose controls
 */
export default function SubmitEventModal(props: SubmitEventModalProps) {
  // Read-only demo: submissions are disabled (there is no backend to receive them).
  if (IS_DEMO_MODE) return null;
  return <SubmitEventModalForm {...props} />;
}

function SubmitEventModalForm({ open, onClose }: SubmitEventModalProps) {
  const [title, setTitle] = useState('');
  const [yearApprox, setYearApprox] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [category, setCategory] = useState<EventCategory>('political');
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setTitle('');
    setYearApprox('');
    setLat('');
    setLng('');
    setCategory('political');
    setDescription('');
    setSourceUrl('');
    setError(null);
    setSuccess(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const yearNum = parseInt(yearApprox, 10);

    if (!title.trim()) { setError('Title is required'); return; }
    if (isNaN(yearNum)) { setError('Year must be a number'); return; }
    if (isNaN(latNum) || latNum < -90 || latNum > 90) { setError('Latitude must be between -90 and 90'); return; }
    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) { setError('Longitude must be between -180 and 180'); return; }
    if (description.length < MIN_DESC_LENGTH) { setError(`Description must be at least ${MIN_DESC_LENGTH} characters`); return; }

    setSubmitting(true);
    try {
      const resp = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          year_approx: yearNum,
          lat: latNum,
          lng: lngNum,
          category,
          description,
          source_url: sourceUrl.trim() || undefined,
        }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || `Server error ${resp.status}`);
      }
      setSuccess(true);
      setTimeout(handleClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [title, yearApprox, lat, lng, category, description, sourceUrl, handleClose]);

  if (!open) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#1a1d2e', borderRadius: 12, padding: 24,
    width: 440, maxHeight: '85vh', overflowY: 'auto',
    border: '1px solid rgba(96,165,250,0.2)', color: '#e2e8f0',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    backgroundColor: '#0f1117', border: '1px solid rgba(148,163,184,0.3)',
    color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, color: '#94a3b8', marginBottom: 4,
  };

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 16px', fontSize: 18, color: '#f1f5f9' }}>Submit Event</h2>

        {success && (
          <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', marginBottom: 12, fontSize: 13 }}>
            ✓ Event submitted for review!
          </div>
        )}

        {error && (
          <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', marginBottom: 12, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fall of Constantinople" />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Year * (negative for BCE)</label>
              <input style={inputStyle} type="number" value={yearApprox} onChange={e => setYearApprox(e.target.value)} placeholder="-500" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category *</label>
              <select style={inputStyle} value={category} onChange={e => setCategory(e.target.value as EventCategory)}>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Latitude * (-90 to 90)</label>
              <input style={inputStyle} type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="41.0082" />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Longitude * (-180 to 180)</label>
              <input style={inputStyle} type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="28.9784" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description * (min {MIN_DESC_LENGTH} chars)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the historical event..."
            />
          </div>

          <div>
            <label style={labelStyle}>Source URL (optional)</label>
            <input style={inputStyle} value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              type="button"
              onClick={handleClose}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(148,163,184,0.3)', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ padding: '8px 16px', borderRadius: 6, border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: submitting ? 'wait' : 'pointer', fontSize: 13, opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
