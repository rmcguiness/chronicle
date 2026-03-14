/**
 * RabbitHolePage — serendipitous history exploration at /rabbit-hole.
 *
 * Start at a random event, then follow causes and effects to discover
 * how history connects. The breadcrumb trail tracks your journey.
 *
 * Route: /rabbit-hole
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRabbitHoleEvent, fetchRandomRabbitHoleSlug } from '../api/client';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from '../utils/categories';
import type { EventCategory, RabbitHoleEventBrief } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Era emoji map based on year range. */
const ERA_LABELS: { max: number; emoji: string; label: string }[] = [
  { max: -3000, emoji: '🏺', label: 'Ancient World' },
  { max: -500, emoji: '🏛️', label: 'Classical Antiquity' },
  { max: 500, emoji: '⚔️', label: 'Late Antiquity' },
  { max: 1400, emoji: '🗡️', label: 'Medieval' },
  { max: 1600, emoji: '🧭', label: 'Age of Exploration' },
  { max: 1800, emoji: '📜', label: 'Early Modern' },
  { max: 1900, emoji: '🏭', label: 'Industrial Age' },
  { max: 1945, emoji: '💣', label: 'World Wars' },
  { max: 1991, emoji: '☢️', label: 'Cold War' },
  { max: Infinity, emoji: '🌐', label: 'Modern Era' },
];

/** Breadcrumb entry — slug + title for display. */
interface BreadcrumbEntry {
  slug: string;
  title: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Get a dramatic era label from a year. */
function getEraLabel(year: number | null, isBce: boolean, region: string | null): string {
  if (year == null) return '🌍 Unknown Era';
  const displayYear = isBce ? `${year} BCE` : String(year);
  const effectiveYear = isBce ? -year : year;
  const era = ERA_LABELS.find((e) => effectiveYear <= e.max) ?? ERA_LABELS[ERA_LABELS.length - 1];
  const regionStr = region ? `, ${region}` : '';
  return `${era.emoji} ${era.label}${regionStr}, ${displayYear}`;
}

/** Render importance as star characters. */
function importanceStars(score: number): string {
  const count = Math.max(1, Math.min(5, Math.round(score * 5)));
  return '★'.repeat(count) + '☆'.repeat(5 - count);
}

/** Format year for display. */
function formatYear(year: number | null, isBce: boolean): string {
  if (year == null) return '??';
  return isBce ? `${year} BCE` : String(year);
}

/** Truncate text to a max length. */
function truncate(text: string | null, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Category badge with icon and color. */
function CategoryBadge({ category }: { category: EventCategory | string | null }) {
  const catKey = (category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';
  const icon = CATEGORY_ICONS[catKey] ?? '📌';
  const label = CATEGORY_LABELS[catKey] ?? category ?? 'Unknown';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {icon} {label}
    </span>
  );
}

/** Breadcrumb trail showing the user's path through history. */
function BreadcrumbTrail({
  trail,
  onJump,
}: {
  trail: BreadcrumbEntry[];
  onJump: (index: number) => void;
}) {
  if (trail.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs text-slate-400 mt-3">
      {trail.map((entry, i) => (
        <span key={`${entry.slug}-${i}`} className="flex items-center gap-1">
          {i > 0 && <span className="text-slate-600 mx-0.5">→</span>}
          {i < trail.length - 1 ? (
            <button
              onClick={() => onJump(i)}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 font-medium"
            >
              {entry.title}
            </button>
          ) : (
            <span className="text-slate-200 font-semibold">{entry.title}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/** A single event card in the causes/effects list. */
function EventListCard({
  event,
  onClick,
}: {
  event: RabbitHoleEventBrief;
  onClick: () => void;
}) {
  const catKey = (event.category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border transition-all duration-150 cursor-pointer group bg-transparent"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}66`;
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-slate-200 leading-tight">
          {event.title}
        </span>
        <span className="text-xs text-slate-500 shrink-0 tabular-nums">
          {formatYear(event.year_approx, false)}
        </span>
      </div>
      {event.region && (
        <span className="text-xs text-slate-500">{event.region}</span>
      )}
      {event.article_summary && (
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {truncate(event.article_summary, 50)}
        </p>
      )}
    </button>
  );
}

/** Loading spinner matching the Chronicle theme. */
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="w-8 h-8 rounded-full border-[3px] animate-spin"
        style={{
          borderColor: 'rgba(255,255,255,0.08)',
          borderTopColor: '#3b82f6',
        }}
      />
      <span className="text-sm text-slate-500">Loading event…</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Focus Card — the main event display with slide transition
// ─────────────────────────────────────────────────────────────────────────────

interface FocusCardProps {
  slug: string;
  title: string;
  year: number | null;
  isBce: boolean;
  region: string | null;
  geoEraLabel: string | null;
  category: EventCategory | string | null;
  importanceScore: number;
  articleSummary: string | null;
  slideDirection: 'left' | 'right' | 'none';
}

/** The large center card showing the currently focused event. */
function FocusCard({
  slug,
  title,
  year,
  isBce,
  region,
  geoEraLabel,
  category,
  importanceScore,
  articleSummary,
  slideDirection,
}: FocusCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const catKey = (category ?? 'political') as EventCategory;
  const color = CATEGORY_COLORS[catKey] ?? '#6b7280';

  useEffect(() => {
    const el = cardRef.current;
    if (!el || slideDirection === 'none') return;

    // Animate slide-in
    const startX = slideDirection === 'left' ? '60px' : '-60px';
    el.style.transform = `translateX(${startX})`;
    el.style.opacity = '0';

    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    });

    return () => {
      el.style.transition = '';
    };
  }, [slug, slideDirection]);

  const eraLabel = getEraLabel(year, isBce, geoEraLabel ?? region);

  return (
    <div
      ref={cardRef}
      className="rounded-xl border p-6 sm:p-8"
      style={{
        borderColor: `${color}33`,
        background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${color}0a 100%)`,
      }}
    >
      {/* Era label */}
      <div className="text-sm text-slate-400 mb-4 font-medium">{eraLabel}</div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight mb-3">
        {title}
      </h1>

      {/* Metadata row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <CategoryBadge category={category} />
        <span className="text-xs text-slate-500 font-mono">
          {formatYear(year, isBce)}
        </span>
        {region && (
          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            📍 {region}
          </span>
        )}
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color: importanceScore >= 0.7 ? '#22c55e' : importanceScore >= 0.4 ? '#f59e0b' : '#ef4444' }}
        >
          {importanceStars(importanceScore)}
        </span>
      </div>

      {/* Article summary */}
      {articleSummary && (
        <p className="text-sm text-slate-400 leading-relaxed">
          {truncate(articleSummary, 300)}
        </p>
      )}

      {/* Link to full detail */}
      <Link
        to={`/event/${slug}`}
        className="inline-flex items-center gap-1.5 mt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors no-underline"
      >
        View full detail →
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/** RabbitHolePage — the main rabbit-hole explorer page at /rabbit-hole. */
export default function RabbitHolePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trail, setTrail] = useState<BreadcrumbEntry[]>([]);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'none'>('none');
  const [initialLoading, setInitialLoading] = useState(true);

  // Current slug is the last entry in the trail, or from URL params
  const currentSlug = trail.length > 0 ? trail[trail.length - 1].slug : null;

  // Override overflow for scrollable page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  // Initialize from URL params or fetch random
  useEffect(() => {
    const pathParam = searchParams.get('path');
    if (pathParam) {
      // Decode shared path: comma-separated slug:title pairs
      try {
        const entries: BreadcrumbEntry[] = pathParam.split(',').map((pair) => {
          const [slug, ...titleParts] = pair.split(':');
          return { slug, title: decodeURIComponent(titleParts.join(':')) };
        });
        if (entries.length > 0) {
          setTrail(entries);
          setInitialLoading(false);
          return;
        }
      } catch {
        // Fall through to random
      }
    }

    // Start with a random event
    fetchRandomRabbitHoleSlug()
      .then((slug) => {
        setTrail([{ slug, title: slug }]);
        setInitialLoading(false);
      })
      .catch(() => {
        setInitialLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch current event detail
  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['rabbit-hole', currentSlug],
    queryFn: () => fetchRabbitHoleEvent(currentSlug!),
    enabled: !!currentSlug,
    staleTime: 5 * 60 * 1000,
  });

  // Once we get the event title, update the breadcrumb if it was just a slug
  useEffect(() => {
    if (event && trail.length > 0) {
      const last = trail[trail.length - 1];
      if (last.title === last.slug && event.title !== last.slug) {
        setTrail((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { slug: last.slug, title: event.title };
          return copy;
        });
      }
    }
  }, [event, trail]);

  /** Navigate to an event from the causes/effects list. */
  const navigateTo = useCallback(
    (slug: string, title: string, direction: 'left' | 'right') => {
      setSlideDirection(direction);
      setTrail((prev) => [...prev, { slug, title }]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [],
  );

  /** Jump back to a breadcrumb entry. */
  const jumpTo = useCallback((index: number) => {
    setSlideDirection('right');
    setTrail((prev) => prev.slice(0, index + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Surprise Me — random event. */
  const surpriseMe = useCallback(() => {
    fetchRandomRabbitHoleSlug()
      .then((slug) => {
        setSlideDirection('left');
        setTrail((prev) => [...prev, { slug, title: slug }]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {});
  }, []);

  /** Start Over — clear trail, new random. */
  const startOver = useCallback(() => {
    fetchRandomRabbitHoleSlug()
      .then((slug) => {
        setSlideDirection('none');
        setTrail([{ slug, title: slug }]);
        setSearchParams({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {});
  }, [setSearchParams]);

  /** Share this path — encode trail into URL params. */
  const sharePath = useCallback(() => {
    if (trail.length === 0) return;
    const encoded = trail
      .map((e) => `${e.slug}:${encodeURIComponent(e.title)}`)
      .join(',');
    setSearchParams({ path: encoded });
    navigator.clipboard?.writeText(
      `${window.location.origin}/rabbit-hole?path=${encodeURIComponent(encoded)}`,
    );
  }, [trail, setSearchParams]);

  // Build the path string for display
  const pathSummary = useMemo(() => {
    if (trail.length <= 1) return null;
    return `${trail.length} stops deep`;
  }, [trail]);

  if (initialLoading) {
    return (
      <PageShell>
        <Spinner />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors no-underline px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03]"
          >
            ← Timeline
          </Link>
          <h2 className="text-lg font-bold text-slate-200">
            🐇 Rabbit Hole
          </h2>
          {pathSummary && (
            <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
              {pathSummary}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={surpriseMe}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer bg-transparent"
            style={{
              color: '#f59e0b',
              border: '1px solid rgba(245,158,11,0.3)',
              backgroundColor: 'rgba(245,158,11,0.08)',
            }}
          >
            🎲 Surprise Me
          </button>
          <button
            onClick={sharePath}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer bg-transparent"
            style={{
              color: '#60a5fa',
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            🔗 Share Path
          </button>
          <button
            onClick={startOver}
            className="text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer bg-transparent"
            style={{
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ↺ Start Over
          </button>
        </div>
      </div>

      {/* Breadcrumb trail */}
      <div className="px-4 sm:px-8 pb-4">
        <BreadcrumbTrail trail={trail} onJump={jumpTo} />
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-8 pb-8">
        {isLoading && <Spinner />}

        {isError && (
          <div className="p-5 rounded-lg text-sm" style={{ backgroundColor: '#ef444418', border: '1px solid #ef444444', color: '#fca5a5' }}>
            Failed to load event. Try another one or hit Surprise Me.
          </div>
        )}

        {event && !isLoading && (
          <>
            {/* Focus card */}
            <FocusCard
              slug={event.slug}
              title={event.title}
              year={event.year_approx}
              isBce={event.is_bce}
              region={event.region}
              geoEraLabel={event.geo_era_label}
              category={event.category}
              importanceScore={event.importance_score}
              articleSummary={event.article_summary}
              slideDirection={slideDirection}
            />

            {/* Navigation: causes & effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Causes — left column */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="text-base">←</span> What caused this?
                </h3>
                {event.causes.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-3">
                    No known causes in the database.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {event.causes.map((cause) => (
                      <EventListCard
                        key={cause.slug}
                        event={cause}
                        onClick={() => navigateTo(cause.slug, cause.title, 'right')}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Effects — right column */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  What happened next? <span className="text-base">→</span>
                </h3>
                {event.effects.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-3">
                    No known effects in the database.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {event.effects.map((effect) => (
                      <EventListCard
                        key={effect.slug}
                        event={effect}
                        onClick={() => navigateTo(effect.slug, effect.title, 'left')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page shell
// ─────────────────────────────────────────────────────────────────────────────

/** Scrollable full-viewport page shell matching the dark Chronicle theme. */
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-screen min-h-screen"
      style={{
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
