/**
 * ApiDocsPage.tsx — Developer API documentation for Chronicle.
 *
 * Stripe/ReadMe-style layout: dark sidebar TOC + scrollable main content
 * with endpoint documentation, parameter tables, and curl examples.
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Param {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

interface Endpoint {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  params: Param[];
  curl: string;
  response: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint data (derived from FastAPI routers)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'http://localhost:8000';

const endpoints: Endpoint[] = [
  {
    id: 'canvas-tiles',
    method: 'GET',
    path: '/api/canvas/tiles',
    title: 'List Canvas Tiles',
    description:
      'Returns event nodes and causality links for a given viewport. Use zoom, year range, and bounding box to control which events are returned. This is the primary endpoint that powers the Chronicle network view.',
    params: [
      { name: 'zoom', type: 'integer', required: false, default: '5', description: 'Zoom level (1–10). Higher zoom returns more detailed events.' },
      { name: 'year_min', type: 'integer', required: false, default: '-3000', description: 'Earliest year (negative = BCE).' },
      { name: 'year_max', type: 'integer', required: false, default: '2000', description: 'Latest year.' },
      { name: 'bbox', type: 'string', required: false, description: 'Bounding box as "west,south,east,north" in WGS84.' },
      { name: 'min_importance', type: 'float', required: false, default: '0.0', description: 'Minimum importance_score filter (0.0–1.0). Acts as level-of-detail threshold.' },
      { name: 'limit', type: 'integer', required: false, default: '500', description: 'Max events to return (1–2000).' },
      { name: 'offset', type: 'integer', required: false, default: '0', description: 'Pagination offset.' },
    ],
    curl: `curl "${BASE_URL}/api/canvas/tiles?zoom=5&year_min=1900&year_max=2000&limit=10"`,
    response: `{
  "events": [
    {
      "id": "a1b2c3d4-...",
      "slug": "world-war-i",
      "title": "World War I",
      "year_approx": 1914,
      "lat": 50.85,
      "lng": 4.35,
      "category": "war",
      "importance_score": 0.95,
      "tags": ["global-conflict", "europe"],
      "perspective_count": 3,
      "zoom_min": 1
    }
  ],
  "links": [
    {
      "id": "e5f6a7b8-...",
      "cause_event_id": "a1b2c3d4-...",
      "effect_event_id": "c3d4e5f6-...",
      "connection_type": "caused",
      "strength": 0.9,
      "description": "Treaty of Versailles led to..."
    }
  ],
  "computed_at": "2026-03-13T12:00:00Z"
}`,
  },
  {
    id: 'event-detail',
    method: 'GET',
    path: '/api/events/{slug}',
    title: 'Get Event Detail',
    description:
      'Returns full event detail including all perspectives, sources, and connected events (causal links).',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'URL-safe event identifier (path parameter).' },
    ],
    curl: `curl "${BASE_URL}/api/events/world-war-i"`,
    response: `{
  "id": "a1b2c3d4-...",
  "slug": "world-war-i",
  "title": "World War I",
  "year_approx": 1914,
  "date_earliest": "1914-07-28",
  "date_latest": "1918-11-11",
  "lat": 50.85,
  "lng": 4.35,
  "geo_modern": "Belgium",
  "category": "war",
  "importance_score": 0.95,
  "tags": ["global-conflict"],
  "perspectives": [
    {
      "id": "p1-...",
      "label": "Western Front Perspective",
      "perspective_type": "military",
      "narrative": "The Great War began...",
      "evidence_score": 0.88,
      "sources": [
        {
          "title": "The Guns of August",
          "author": "Barbara Tuchman",
          "source_type": "book",
          "peer_reviewed": false
        }
      ]
    }
  ],
  "connected_events": [
    {
      "slug": "treaty-of-versailles",
      "title": "Treaty of Versailles",
      "year_approx": 1919,
      "connection_type": "caused",
      "direction": "effect",
      "strength": 0.95
    }
  ]
}`,
  },
  {
    id: 'event-connections',
    method: 'GET',
    path: '/api/events/{slug}/connections',
    title: 'Get Event Connections',
    description:
      'Returns all causality links for an event — both where it is a cause and where it is an effect.',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Event slug (path parameter).' },
    ],
    curl: `curl "${BASE_URL}/api/events/world-war-i/connections"`,
    response: `{
  "connections": [
    {
      "id": "link-1-...",
      "cause_event_id": "a1b2c3d4-...",
      "effect_event_id": "c3d4e5f6-...",
      "connection_type": "caused",
      "strength": 0.9,
      "description": "Direct political consequence"
    }
  ]
}`,
  },
  {
    id: 'event-article',
    method: 'GET',
    path: '/api/events/{slug}/article',
    title: 'Get Event Article',
    description:
      'Returns structured Wikipedia article content for an event. Sections are parsed from the wiki page. Results are cached server-side.',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Event slug (path parameter).' },
    ],
    curl: `curl "${BASE_URL}/api/events/world-war-i/article"`,
    response: `{
  "title": "World War I",
  "summary": "World War I was a global conflict...",
  "sections": [
    {
      "heading": "Background",
      "content": "The war began after the assassination..."
    },
    {
      "heading": "Western Front",
      "content": "Trench warfare dominated..."
    }
  ],
  "source_url": "https://en.wikipedia.org/wiki/World_War_I",
  "source": "wikipedia"
}`,
  },
  {
    id: 'event-wiki',
    method: 'GET',
    path: '/api/events/{slug}/wiki',
    title: 'Get Wiki Summary',
    description:
      'Returns a brief Wikipedia summary and thumbnail for an event. Useful for preview cards and tooltips.',
    params: [
      { name: 'slug', type: 'string', required: true, description: 'Event slug (path parameter).' },
    ],
    curl: `curl "${BASE_URL}/api/events/world-war-i/wiki"`,
    response: `{
  "found": true,
  "wiki_url": "https://en.wikipedia.org/wiki/World_War_I",
  "wiki_title": "World War I",
  "summary": "World War I was a global conflict...",
  "thumbnail_url": "https://upload.wikimedia.org/...",
  "thumbnail_width": 220,
  "thumbnail_height": 165,
  "fetched_at": "2026-03-13T10:00:00Z"
}`,
  },
  {
    id: 'on-this-day',
    method: 'GET',
    path: '/api/events/on-this-day',
    title: 'On This Day',
    description:
      'Returns historical events that occurred on a given month/day across all years. Defaults to today if no date is specified.',
    params: [
      { name: 'month', type: 'integer', required: false, description: 'Month (1–12). Defaults to current month.' },
      { name: 'day', type: 'integer', required: false, description: 'Day (1–31). Defaults to current day.' },
    ],
    curl: `curl "${BASE_URL}/api/events/on-this-day?month=7&day=4"`,
    response: `{
  "month": 7,
  "day": 4,
  "events": [
    {
      "id": "evt-...",
      "slug": "us-declaration-of-independence",
      "title": "United States Declaration of Independence",
      "year_approx": 1776,
      "category": "political",
      "importance_score": 0.98,
      "region": "North America",
      "short_description": "The Continental Congress adopted..."
    }
  ]
}`,
  },
  {
    id: 'search',
    method: 'GET',
    path: '/api/search',
    title: 'Search Events',
    description:
      'Full-text search across event titles and descriptions. Supports optional filtering by category and year range.',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Search query string.' },
      { name: 'limit', type: 'integer', required: false, default: '20', description: 'Max results (1–100).' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category (war, discovery, political, cultural, natural, person).' },
      { name: 'year_min', type: 'integer', required: false, description: 'Filter by minimum year.' },
      { name: 'year_max', type: 'integer', required: false, description: 'Filter by maximum year.' },
    ],
    curl: `curl "${BASE_URL}/api/search?q=renaissance&category=cultural&limit=5"`,
    response: `{
  "results": [
    {
      "id": "evt-...",
      "slug": "italian-renaissance",
      "title": "Italian Renaissance",
      "year_approx": 1400,
      "geo_modern": "Italy",
      "category": "cultural",
      "importance_score": 0.9,
      "lat": 43.77,
      "lng": 11.25,
      "score": 0.95
    }
  ]
}`,
  },
  {
    id: 'search-semantic',
    method: 'GET',
    path: '/api/search/semantic',
    title: 'Semantic Search',
    description:
      'Natural language search using pgvector embeddings. Returns events ranked by semantic similarity to the query.',
    params: [
      { name: 'q', type: 'string', required: true, description: 'Natural language search query.' },
      { name: 'limit', type: 'integer', required: false, default: '20', description: 'Max results (1–100).' },
    ],
    curl: `curl "${BASE_URL}/api/search/semantic?q=events%20that%20changed%20democracy&limit=5"`,
    response: `{
  "results": [
    {
      "id": "evt-...",
      "slug": "magna-carta",
      "title": "Magna Carta",
      "year_approx": 1215,
      "geo_modern": "England",
      "category": "political",
      "importance_score": 0.92,
      "score": 0.87
    }
  ]
}`,
  },
  {
    id: 'causality',
    method: 'GET',
    path: '/api/causality',
    title: 'List Causality Links',
    description:
      'Returns all causality links in the database. Use this to build your own graph visualizations or analyze historical cause-effect relationships.',
    params: [
      { name: 'limit', type: 'integer', required: false, default: '1000', description: 'Max links to return (1–5000).' },
    ],
    curl: `curl "${BASE_URL}/api/causality?limit=50"`,
    response: `{
  "links": [
    {
      "id": "link-...",
      "cause_event_id": "a1b2c3d4-...",
      "effect_event_id": "c3d4e5f6-...",
      "connection_type": "caused",
      "strength": 0.85,
      "description": "The assassination directly triggered..."
    }
  ]
}`,
  },
  {
    id: 'submit-event',
    method: 'POST',
    path: '/api/events/submit',
    title: 'Submit Event',
    description:
      'Submit a new historical event for review. Events enter a moderation queue and must be approved by an admin before appearing on the timeline.',
    params: [
      { name: 'title', type: 'string', required: true, description: 'Event title (1–300 chars).' },
      { name: 'year_approx', type: 'integer', required: true, description: 'Approximate year.' },
      { name: 'lat', type: 'float', required: true, description: 'Latitude (-90 to 90).' },
      { name: 'lng', type: 'float', required: true, description: 'Longitude (-180 to 180).' },
      { name: 'category', type: 'string', required: true, description: 'One of: war, discovery, political, cultural, natural, person.' },
      { name: 'description', type: 'string', required: true, description: 'Event description (20–5000 chars).' },
      { name: 'source_url', type: 'string', required: false, description: 'URL of a primary source.' },
    ],
    curl: `curl -X POST "${BASE_URL}/api/events/submit" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Gutenberg Printing Press",
    "year_approx": 1440,
    "lat": 49.99,
    "lng": 8.27,
    "category": "discovery",
    "description": "Johannes Gutenberg introduces movable type printing to Europe, revolutionizing information dissemination."
  }'`,
    response: `{
  "id": "new-evt-...",
  "slug": "gutenberg-printing-press"
}`,
  },
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    title: 'Health Check',
    description:
      'Returns service health status including database connectivity and total event count. Useful for monitoring and integration testing.',
    params: [],
    curl: `curl "${BASE_URL}/api/health"`,
    response: `{
  "status": "ok",
  "db": "ok",
  "events_count": 1247
}`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const colors = {
  bg: '#070e22',
  sidebar: '#0a1128',
  sidebarBorder: 'rgba(96,165,250,0.15)',
  card: 'rgba(15,23,42,0.8)',
  cardBorder: 'rgba(96,165,250,0.2)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  accent: '#60a5fa',
  accentDim: 'rgba(96,165,250,0.15)',
  green: '#4ade80',
  greenDim: 'rgba(34,197,94,0.15)',
  orange: '#fb923c',
  orangeDim: 'rgba(251,146,60,0.15)',
  purple: '#a78bfa',
  codeBg: '#0f172a',
  codeText: '#cbd5e1',
};

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: colors.greenDim, text: colors.green },
  POST: { bg: colors.orangeDim, text: colors.orange },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const c = methodColors[method] ?? methodColors.GET;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        backgroundColor: c.bg,
        color: c.text,
        letterSpacing: '0.05em',
      }}
    >
      {method}
    </span>
  );
}

function ParamTable({ params }: { params: Param[] }) {
  if (params.length === 0) return <p style={{ color: colors.textMuted, fontSize: 14 }}>No parameters.</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
          fontFamily: '"Inter", sans-serif',
        }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
            {['Parameter', 'Type', 'Required', 'Default', 'Description'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  color: colors.textMuted,
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} style={{ borderBottom: `1px solid rgba(96,165,250,0.08)` }}>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: colors.accent }}>{p.name}</td>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: colors.purple }}>{p.type}</td>
              <td style={{ padding: '8px 12px', color: p.required ? colors.orange : colors.textDim }}>
                {p.required ? 'yes' : 'no'}
              </td>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: colors.textDim }}>
                {p.default ?? '—'}
              </td>
              <td style={{ padding: '8px 12px', color: colors.textMuted }}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 12px',
          backgroundColor: 'rgba(15,23,42,0.6)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottom: `1px solid ${colors.cardBorder}`,
        }}
      >
        <span style={{ fontSize: 11, color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: 'none',
            border: 'none',
            color: copied ? colors.green : colors.textDim,
            fontSize: 11,
            cursor: 'pointer',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: 16,
          backgroundColor: colors.codeBg,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          overflowX: 'auto',
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          color: colors.codeText,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <section
      id={endpoint.id}
      style={{
        marginBottom: 48,
        scrollMarginTop: 24,
      }}
    >
      <div
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: 12,
          padding: 28,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <MethodBadge method={endpoint.method} />
          <code style={{ fontSize: 15, color: colors.text, fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}>
            {endpoint.path}
          </code>
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: colors.text }}>
          {endpoint.title}
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: colors.textMuted, lineHeight: 1.6 }}>
          {endpoint.description}
        </p>

        {/* Parameters */}
        <h4 style={{ fontSize: 13, fontWeight: 600, color: colors.textDim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Parameters
        </h4>
        <ParamTable params={endpoint.params} />

        {/* Curl example */}
        <CodeBlock code={endpoint.curl} label="Example Request" />

        {/* Response example */}
        <CodeBlock code={endpoint.response} label="Example Response" />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar({ activeId }: { activeId: string }) {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 260,
        height: '100vh',
        backgroundColor: colors.sidebar,
        borderRight: `1px solid ${colors.sidebarBorder}`,
        overflowY: 'auto',
        padding: '24px 0',
        fontFamily: '"Inter", sans-serif',
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          display: 'block',
          padding: '0 20px',
          marginBottom: 4,
          fontSize: 18,
          fontWeight: 700,
          color: colors.text,
          textDecoration: 'none',
        }}
      >
        Chronicle
      </Link>
      <div style={{ padding: '0 20px', marginBottom: 20, fontSize: 12, color: colors.textDim }}>
        API Documentation
      </div>

      <div style={{ padding: '0 12px', marginBottom: 16 }}>
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            backgroundColor: colors.accentDim,
            fontSize: 12,
            color: colors.accent,
            lineHeight: 1.5,
          }}
        >
          <strong>Base URL</strong>
          <br />
          <code style={{ fontSize: 11 }}>{BASE_URL}</code>
        </div>
      </div>

      <nav>
        <div
          style={{
            padding: '0 20px',
            marginBottom: 8,
            fontSize: 10,
            fontWeight: 600,
            color: colors.textDim,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Endpoints
        </div>
        {endpoints.map((ep) => {
          const isActive = activeId === ep.id;
          return (
            <a
              key={ep.id}
              href={`#${ep.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 20px',
                fontSize: 13,
                color: isActive ? colors.text : colors.textMuted,
                textDecoration: 'none',
                backgroundColor: isActive ? 'rgba(96,165,250,0.08)' : 'transparent',
                borderLeft: isActive ? `2px solid ${colors.accent}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <MethodBadge method={ep.method} />
              <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{ep.path.replace('/api/', '/')}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ApiDocsPage() {
  const [activeId, setActiveId] = useState(endpoints[0].id);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, fontFamily: '"Inter", sans-serif' }}>
      <Sidebar activeId={activeId} />

      <div ref={mainRef} style={{ marginLeft: 260, padding: '40px 48px 80px', maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: colors.text }}>API Reference</h1>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: colors.textMuted, lineHeight: 1.6 }}>
            Chronicle exposes a REST API for building custom visualizations, integrations, and research tools
            on top of the historical event graph. All responses are JSON.
          </p>
          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              borderRadius: 8,
              backgroundColor: colors.accentDim,
              border: `1px solid rgba(96,165,250,0.2)`,
              fontSize: 13,
              color: colors.textMuted,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: colors.accent }}>Base URL:</strong>{' '}
            <code style={{ color: colors.text }}>{BASE_URL}</code>{' '}
            — for local development. In production, replace with your deployment URL. All endpoints are prefixed with{' '}
            <code style={{ color: colors.text }}>/api</code>.
          </div>
        </div>

        {/* Endpoints */}
        {endpoints.map((ep) => (
          <EndpointCard key={ep.id} endpoint={ep} />
        ))}

        {/* Footer */}
        <div
          style={{
            marginTop: 40,
            padding: '20px 0',
            borderTop: `1px solid ${colors.cardBorder}`,
            fontSize: 13,
            color: colors.textDim,
          }}
        >
          Chronicle is open source. See the{' '}
          <a href="https://github.com" style={{ color: colors.accent, textDecoration: 'none' }}>
            repository
          </a>{' '}
          for backend source code and contribution guidelines.
        </div>
      </div>
    </div>
  );
}
