/**
 * AdminSubmit — public event submission form (FEAT-02).
 *
 * Owns: form state, validation, POST /api/admin/submit call, success/error UI.
 * Does NOT own: admin authentication, event approval, review flow.
 *
 * Accessible at /admin/submit — no login required.
 * Submissions land in the pending_events queue; admin approval is required
 * before an event appears on the public timeline.
 */
import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Valid event categories matching the backend enum. */
type EventCategory =
  | 'war'
  | 'discovery'
  | 'political'
  | 'cultural'
  | 'natural'
  | 'person';

/** Shape of the form fields. All values are strings until submission converts them. */
interface FormFields {
  title: string;
  year_approx: string;
  lat: string;
  lng: string;
  category: EventCategory | '';
  importance_score: string;
  description: string;
}

/** Successful response from POST /api/admin/submit. */
interface SubmitResponse {
  id: string;
  status: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Categories available in the dropdown, with human-readable labels. */
const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'war', label: 'War & Conflict' },
  { value: 'discovery', label: 'Discovery & Exploration' },
  { value: 'political', label: 'Political' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'natural', label: 'Natural Event' },
  { value: 'person', label: 'Notable Person' },
];

const INITIAL_FORM: FormFields = {
  title: '',
  year_approx: '',
  lat: '',
  lng: '',
  category: '',
  importance_score: '0.5',
  description: '',
};

// ─── Shared styles ───────────────────────────────────────────────────────────

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 6,
  backgroundColor: '#1a1d2e',
  border: '1px solid rgba(148,163,184,0.3)',
  color: '#e2e8f0',
  fontSize: 14,
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: '#94a3b8',
  marginBottom: 6,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const FIELD_STYLE: React.CSSProperties = { marginBottom: 20 };

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Public event submission form.
 *
 * Collects: title, year (negative = BCE), lat/lng, category, importance,
 * and a short description. On success shows a confirmation with the pending ID.
 */
export default function AdminSubmit() {
  const [form, setForm] = useState<FormFields>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Update a single text field in form state. */
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    },
    [],
  );

  /** Validate, serialise and POST the form to the backend. */
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      // ── Client-side validation ──────────────────────────────────────────
      const yearNum = parseInt(form.year_approx, 10);
      if (isNaN(yearNum)) {
        setError('Year must be a valid integer (use negative values for BCE).');
        return;
      }
      const latNum = parseFloat(form.lat);
      const lngNum = parseFloat(form.lng);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        setError('Latitude must be a number between -90 and 90.');
        return;
      }
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        setError('Longitude must be a number between -180 and 180.');
        return;
      }
      if (!form.category) {
        setError('Please select a category.');
        return;
      }
      const importanceNum = parseFloat(form.importance_score);
      if (isNaN(importanceNum) || importanceNum < 0.1 || importanceNum > 1.0) {
        setError('Importance must be between 0.1 and 1.0.');
        return;
      }

      setSubmitting(true);
      try {
        const resp = await fetch('/api/admin/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title.trim(),
            year_approx: yearNum,
            lat: latNum,
            lng: lngNum,
            category: form.category,
            importance_score: importanceNum,
            description: form.description.trim(),
          }),
        });
        if (!resp.ok) {
          const data: { detail?: string } = await resp.json().catch(() => ({}));
          throw new Error(data.detail ?? `Server error ${resp.status}`);
        }
        const data: SubmitResponse = await resp.json();
        setSuccessId(data.id);
        setForm(INITIAL_FORM);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [form],
  );

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#0f1117',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    padding: '40px 16px',
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 640,
    margin: '0 auto',
    backgroundColor: '#13161f',
    borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.15)',
    padding: 32,
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, marginTop: 0 }}>
          Submit a Historical Event
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32, marginTop: 0 }}>
          Your submission will be reviewed by a moderator before appearing on the timeline.
        </p>

        {/* Success banner */}
        {successId !== null && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.3)',
              color: '#4ade80',
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            ✓ Submitted successfully! Your event is pending review.
            <br />
            <span style={{ fontSize: 11, opacity: 0.7 }}>Ref: {successId}</span>
          </div>
        )}

        {/* Error banner */}
        {error !== null && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div style={FIELD_STYLE}>
            <label htmlFor="title" style={LABEL_STYLE}>Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={300}
              placeholder="e.g. Fall of the Roman Republic"
              value={form.title}
              onChange={handleChange}
              style={INPUT_STYLE}
            />
          </div>

          {/* Year */}
          <div style={FIELD_STYLE}>
            <label htmlFor="year_approx" style={LABEL_STYLE}>
              Year * <span style={{ textTransform: 'none', fontWeight: 400 }}>(negative for BCE)</span>
            </label>
            <input
              id="year_approx"
              name="year_approx"
              type="number"
              required
              placeholder="e.g. -44 for 44 BCE, or 1969"
              value={form.year_approx}
              onChange={handleChange}
              style={INPUT_STYLE}
            />
          </div>

          {/* Lat / Lng row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label htmlFor="lat" style={LABEL_STYLE}>Latitude *</label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                required
                placeholder="-90 to 90"
                value={form.lat}
                onChange={handleChange}
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label htmlFor="lng" style={LABEL_STYLE}>Longitude *</label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                required
                placeholder="-180 to 180"
                value={form.lng}
                onChange={handleChange}
                style={INPUT_STYLE}
              />
            </div>
          </div>

          {/* Category */}
          <div style={FIELD_STYLE}>
            <label htmlFor="category" style={LABEL_STYLE}>Category *</label>
            <select
              id="category"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              style={{ ...INPUT_STYLE, cursor: 'pointer' }}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Importance slider */}
          <div style={FIELD_STYLE}>
            <label htmlFor="importance_score" style={LABEL_STYLE}>
              Importance{' '}
              <span style={{ textTransform: 'none', fontWeight: 400 }}>
                — {parseFloat(form.importance_score).toFixed(2)}
              </span>
            </label>
            <input
              id="importance_score"
              name="importance_score"
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={form.importance_score}
              onChange={handleChange}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginTop: 4 }}>
              <span>0.1 — Minor</span>
              <span>1.0 — Major</span>
            </div>
          </div>

          {/* Description */}
          <div style={FIELD_STYLE}>
            <label htmlFor="description" style={LABEL_STYLE}>Description * (10–5000 chars)</label>
            <textarea
              id="description"
              name="description"
              required
              minLength={10}
              maxLength={5000}
              rows={5}
              placeholder="Provide a brief description of this historical event…"
              value={form.description}
              onChange={handleChange}
              style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
            />
            <div style={{ textAlign: 'right', fontSize: 11, color: '#475569', marginTop: 4 }}>
              {form.description.length} / 5000
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: submitting ? '#1e40af' : '#3b82f6',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              transition: 'opacity 0.15s, background-color 0.15s',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit for Review'}
          </button>
        </form>

        {/* Back link */}
        <p style={{ textAlign: 'center', marginTop: 24, marginBottom: 0, fontSize: 13 }}>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>
            ← Back to Timeline
          </a>
        </p>
      </div>
    </div>
  );
}
