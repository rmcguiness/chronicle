/**
 * ContributePage — community event submission form.
 *
 * Sections: ContributeHero, ContributionForm, ContributionGuidelines,
 * RecentSubmissions sidebar, ContributeStats.
 *
 * Submits via POST /api/events/submit (existing endpoint from submit.py).
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../utils/categories';
import { searchEvents } from '../api/client';
import type { EventCategory, SearchResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABELS) as EventCategory[];

/** Region → approximate centre coordinates for the geo_point. */
const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  europe: { lat: 50, lng: 10 },
  asia: { lat: 35, lng: 105 },
  americas: { lat: 15, lng: -80 },
  africa: { lat: 5, lng: 25 },
  middle_east: { lat: 30, lng: 45 },
  oceania: { lat: -25, lng: 135 },
};

const REGION_LABELS: Record<string, string> = {
  europe: 'Europe',
  asia: 'Asia',
  americas: 'Americas',
  africa: 'Africa',
  middle_east: 'Middle East',
  oceania: 'Oceania',
};

const IMPORTANCE_LABELS = ['Minor', 'Notable', 'Significant', 'Major', 'World-Changing'];

const MIN_DESC = 50;
const MAX_DESC = 2000;
const MIN_TITLE = 3;
const MAX_TITLE = 200;
const MIN_YEAR = -5000;
const MAX_YEAR = 2026;

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#070e22',
  color: '#e2e8f0',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '0 24px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  backgroundColor: '#0f1117',
  border: '1px solid rgba(148,163,184,0.3)',
  color: '#e2e8f0',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: '#94a3b8',
  marginBottom: 6,
  fontWeight: 500,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#1a1d2e',
  borderRadius: 12,
  border: '1px solid rgba(96,165,250,0.15)',
  padding: 24,
};

// ─────────────────────────────────────────────────────────────────────────────
// EventSearchBox — typeahead for linking causal events
// ─────────────────────────────────────────────────────────────────────────────

interface EventSearchBoxProps {
  /** Placeholder text. */
  placeholder: string;
  /** Called when a result is selected. */
  onSelect: (result: SearchResult) => void;
  /** Currently selected event (if any). */
  selected: SearchResult | null;
  /** Called to clear selection. */
  onClear: () => void;
}

/** Debounced typeahead search for existing Chronicle events. */
function EventSearchBox({ placeholder, onSelect, selected, onClear }: EventSearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const hits = await searchEvents(query, 6);
      setResults(hits);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  if (selected) {
    return (
      <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13 }}>{selected.title} ({selected.year_approx})</span>
        <button
          type="button"
          onClick={onClear}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
          aria-label="Clear selection"
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        style={inputStyle}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
      />
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          backgroundColor: '#1a1d2e', border: '1px solid rgba(96,165,250,0.2)',
          borderRadius: 8, marginTop: 4, maxHeight: 200, overflowY: 'auto',
        }}>
          {results.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => { onSelect(r); setQuery(''); setOpen(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer',
                fontSize: 13, borderBottom: '1px solid rgba(148,163,184,0.1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span style={{ fontWeight: 500 }}>{r.title}</span>
              <span style={{ color: '#94a3b8', marginLeft: 8 }}>{r.year_approx}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContributeHero
// ─────────────────────────────────────────────────────────────────────────────

function ContributeHero() {
  return (
    <div style={{ textAlign: 'center', padding: '56px 0 40px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, color: '#f1f5f9', margin: '0 0 12px', letterSpacing: -0.5 }}>
        Help build the world's most connected history
      </h1>
      <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.6 }}>
        Chronicle grows with community contributions &mdash; add an event you know that's missing.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        <Stat label="Events in Chronicle" value="2,800+" />
        <Stat label="Causality links" value="1,200+" />
        <Stat label="Community contributions" value="Growing" />
      </div>
      <p style={{ fontSize: 13, color: '#64748b', marginTop: 16 }}>
        Every submission is reviewed by our team before publishing.
      </p>
    </div>
  );
}

/** Small stat badge used in the hero section. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContributionGuidelines (accordion)
// ─────────────────────────────────────────────────────────────────────────────

interface GuidelineSectionProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function GuidelineSection({ icon, title, children, defaultOpen = false }: GuidelineSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '14px 0', background: 'none', border: 'none', color: '#e2e8f0',
          cursor: 'pointer', fontSize: 15, fontWeight: 500, textAlign: 'left',
        }}
      >
        <span>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ color: '#64748b', fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          &#9660;
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 0 16px 28px', color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ContributionGuidelines() {
  return (
    <div style={{ ...cardStyle, marginTop: 32 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 16, color: '#f1f5f9' }}>Contribution Guidelines</h3>
      <GuidelineSection icon="&#x2705;" title="What makes a good Chronicle event" defaultOpen>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li><strong>Historically significant</strong> &mdash; had a notable impact on the world or a region</li>
          <li><strong>Verifiable</strong> &mdash; can be sourced to Wikipedia or a reputable reference</li>
          <li><strong>Specific</strong> &mdash; a defined event, not a vague period (&ldquo;The Roman Empire falls&rdquo; not &ldquo;Rome declined&rdquo;)</li>
          <li><strong>Correctly dated</strong> &mdash; year known within reasonable accuracy</li>
        </ul>
      </GuidelineSection>
      <GuidelineSection icon="&#x274C;" title="What we don't accept">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Fictional or mythological events</li>
          <li>Events from the last 2 years (too recent for historical context)</li>
          <li>Duplicate events already in Chronicle</li>
          <li>Promotional or biased submissions</li>
        </ul>
      </GuidelineSection>
      <GuidelineSection icon="&#x1F4DD;" title="Tips for great submissions">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Check if the event already exists using the search bar</li>
          <li>Include the Wikipedia article URL if one exists</li>
          <li>Link it to related events using the &ldquo;caused by / led to&rdquo; fields</li>
          <li>Write a clear, concise description (2&ndash;4 sentences)</li>
        </ul>
      </GuidelineSection>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RecentSubmissions sidebar
// ─────────────────────────────────────────────────────────────────────────────

/** Example events to display as "recently added" inspiration. */
const EXAMPLE_EVENTS = [
  { title: 'Meiji Restoration', year: 1868, contributor: 'Anonymous' },
  { title: 'Treaty of Westphalia', year: 1648, contributor: 'Anonymous' },
  { title: 'Haitian Revolution', year: 1791, contributor: 'Anonymous' },
  { title: 'Printing Press Invented', year: 1440, contributor: 'Anonymous' },
  { title: 'Fall of Constantinople', year: 1453, contributor: 'Anonymous' },
];

function RecentSubmissions() {
  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 16px', fontSize: 15, color: '#f1f5f9' }}>Recently Added</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {EXAMPLE_EVENTS.map(ev => (
          <div key={ev.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: '#e2e8f0' }}>{ev.title}</span>
            <span style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', marginLeft: 8 }}>{ev.year}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 16, fontStyle: 'italic' }}>
        Inspire others to contribute what they know.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContributeStats
// ─────────────────────────────────────────────────────────────────────────────

function ContributeStats() {
  return (
    <div style={{ ...cardStyle, marginTop: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#f1f5f9' }}>Help Us Fill the Gaps</h3>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.6 }}>
        We especially need events from:
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['Oceania', 'Africa', 'Pre-Columbian Americas'].map(tag => (
          <span key={tag} style={{
            padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500,
            backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa',
          }}>
            {tag}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>
        Ancient &amp; medieval eras are also underrepresented.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContributionForm
// ─────────────────────────────────────────────────────────────────────────────

/** Main event submission form. */
function ContributionForm() {
  const navigate = useNavigate();

  // Required fields
  const [title, setTitle] = useState('');
  const [yearApprox, setYearApprox] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('europe');
  const [category, setCategory] = useState<EventCategory>('political');

  // Optional fields
  const [importance, setImportance] = useState(0.5);
  const [location, setLocation] = useState('');
  const [wikiUrl, setWikiUrl] = useState('');
  const [causedBy, setCausedBy] = useState<SearchResult | null>(null);
  const [ledTo, setLedTo] = useState<SearchResult | null>(null);
  const [submitterName, setSubmitterName] = useState('');
  const [sourceRef, setSourceRef] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setTitle('');
    setYearApprox('');
    setDescription('');
    setRegion('europe');
    setCategory('political');
    setImportance(0.5);
    setLocation('');
    setWikiUrl('');
    setCausedBy(null);
    setLedTo(null);
    setSubmitterName('');
    setSourceRef('');
    setError(null);
    setSuccess(false);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!title.trim() || title.trim().length < MIN_TITLE) {
      setError(`Title is required (${MIN_TITLE}–${MAX_TITLE} characters)`);
      return;
    }
    if (title.trim().length > MAX_TITLE) {
      setError(`Title must be ${MAX_TITLE} characters or fewer`);
      return;
    }

    const yearNum = parseInt(yearApprox, 10);
    if (isNaN(yearNum)) {
      setError('Year is required and must be a number');
      return;
    }
    if (yearNum < MIN_YEAR || yearNum > MAX_YEAR) {
      setError(`Year must be between ${MIN_YEAR} and ${MAX_YEAR}`);
      return;
    }

    if (description.length < MIN_DESC) {
      setError(`Description must be at least ${MIN_DESC} characters (currently ${description.length})`);
      return;
    }
    if (description.length > MAX_DESC) {
      setError(`Description must be ${MAX_DESC} characters or fewer`);
      return;
    }

    // Build coordinates from region (or we could let the user input lat/lng)
    const coords = REGION_COORDS[region] ?? REGION_COORDS.europe;

    setSubmitting(true);
    try {
      const resp = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          year_approx: yearNum,
          lat: coords.lat,
          lng: coords.lng,
          category,
          description: description.trim(),
          source_url: wikiUrl.trim() || sourceRef.trim() || undefined,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || `Server error ${resp.status}`);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [title, yearApprox, description, region, category, wikiUrl, sourceRef]);

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ ...cardStyle, textAlign: 'center', padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#127881;</div>
        <h2 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: 22 }}>Thank you!</h2>
        <p style={{ color: '#22c55e', fontSize: 16, margin: '0 0 8px' }}>Your submission is under review.</p>
        <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 28px' }}>
          We'll add it to Chronicle within 1&ndash;3 days if it meets our guidelines.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={resetForm}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer',
              fontSize: 14, fontWeight: 500,
            }}
          >
            Submit another event
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px', borderRadius: 8,
              border: '1px solid rgba(148,163,184,0.3)',
              backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Explore Chronicle
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div style={cardStyle}>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, color: '#f1f5f9' }}>Submit an Event</h2>

      {error && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 16,
          backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444', fontSize: 13,
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* ── Title ─────────────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            style={inputStyle}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What happened? (e.g. 'Battle of Hastings')"
            maxLength={MAX_TITLE}
          />
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, textAlign: 'right' }}>
            {title.length}/{MAX_TITLE}
          </div>
        </div>

        {/* ── Year + Category row ─────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Year *</label>
            <input
              style={inputStyle}
              type="number"
              value={yearApprox}
              onChange={e => setYearApprox(e.target.value)}
              placeholder="Use negative for BCE, e.g. -44"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Category *</label>
            <select
              style={inputStyle}
              value={category}
              onChange={e => setCategory(e.target.value as EventCategory)}
            >
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Region ──────────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Region *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(REGION_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRegion(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 13,
                  border: region === key ? '1px solid #3b82f6' : '1px solid rgba(148,163,184,0.2)',
                  backgroundColor: region === key ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: region === key ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Description ─────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.5 }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description (2-4 sentences). What happened and why was it significant?"
            maxLength={MAX_DESC}
          />
          <div style={{
            fontSize: 11, marginTop: 4, textAlign: 'right',
            color: description.length < MIN_DESC ? '#f59e0b' : '#64748b',
          }}>
            {description.length}/{MAX_DESC}
            {description.length > 0 && description.length < MIN_DESC &&
              ` (${MIN_DESC - description.length} more needed)`
            }
          </div>
        </div>

        {/* ── Optional fields divider ─────────────────────────────── */}
        <div style={{
          borderTop: '1px solid rgba(148,163,184,0.1)',
          paddingTop: 16, marginTop: 4,
        }}>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 14px' }}>
            Optional &mdash; these help us publish faster
          </p>
        </div>

        {/* ── Importance slider ───────────────────────────────────── */}
        <div>
          <label style={labelStyle}>
            Importance: <span style={{ color: '#e2e8f0' }}>{IMPORTANCE_LABELS[Math.min(4, Math.floor(importance * 5))]}</span>
            <span style={{ color: '#64748b' }}> ({importance.toFixed(1)})</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.1}
            value={importance}
            onChange={e => setImportance(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
            <span>Minor</span>
            <span>World-Changing</span>
          </div>
        </div>

        {/* ── Location ────────────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Location (modern name)</label>
          <input
            style={inputStyle}
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Rome, Italy or Athens, Greece"
          />
        </div>

        {/* ── Wikipedia URL ───────────────────────────────────────── */}
        <div>
          <label style={labelStyle}>Wikipedia URL</label>
          <input
            style={inputStyle}
            value={wikiUrl}
            onChange={e => setWikiUrl(e.target.value)}
            placeholder="https://en.wikipedia.org/wiki/..."
          />
        </div>

        {/* ── Causal links ────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Caused by (preceding event)</label>
            <EventSearchBox
              placeholder="Search existing events..."
              selected={causedBy}
              onSelect={setCausedBy}
              onClear={() => setCausedBy(null)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Led to (resulting event)</label>
            <EventSearchBox
              placeholder="Search existing events..."
              selected={ledTo}
              onSelect={setLedTo}
              onClear={() => setLedTo(null)}
            />
          </div>
        </div>

        {/* ── Submitter + source ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Your name (for attribution)</label>
            <input
              style={inputStyle}
              value={submitterName}
              onChange={e => setSubmitterName(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Source / reference</label>
            <input
              style={inputStyle}
              value={sourceRef}
              onChange={e => setSourceRef(e.target.value)}
              placeholder="Book, website, etc."
            />
          </div>
        </div>

        {/* ── Submit button ───────────────────────────────────────── */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: submitting ? '#1e3a5f' : '#3b82f6',
            color: '#fff',
            cursor: submitting ? 'wait' : 'pointer',
            fontSize: 15,
            fontWeight: 600,
            marginTop: 8,
            transition: 'background-color 0.15s',
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Event for Review'}
        </button>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

/** /contribute — community event submission page. */
export default function ContributePage() {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(148,163,184,0.1)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: '#60a5fa',
            cursor: 'pointer', fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ fontSize: 18 }}>&larr;</span> Chronicle
        </button>
        <span style={{ fontSize: 13, color: '#64748b' }}>Community Contributions</span>
      </div>

      <div style={containerStyle}>
        <ContributeHero />

        {/* ── Main layout: form + sidebar ─────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 24,
          alignItems: 'start',
        }}>
          {/* Left column: form + guidelines */}
          <div>
            <ContributionForm />
            <ContributionGuidelines />
          </div>

          {/* Right sidebar */}
          <div style={{ position: 'sticky', top: 24 }}>
            <RecentSubmissions />
            <ContributeStats />
          </div>
        </div>

        {/* ── Footer padding ──────────────────────────────────────── */}
        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}
