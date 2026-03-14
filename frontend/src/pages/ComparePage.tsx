/**
 * ComparePage — side-by-side comparison of two historical events.
 *
 * URL patterns:
 *   /compare                     — empty state with two search boxes
 *   /compare?a=slug-1&b=slug-2   — shareable comparison URL
 *   /compare/:slugA/:slugB        — alternative shareable URL
 *
 * Sub-sections: EventSelector, ComparisonHeader, ComparisonGrid,
 * ConnectionSection, ContemporaryEventsPanel, SharedPeople,
 * ArticleSummaries, SimilarEvents.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchEventDetail,
  fetchCausalPath,
  fetchRandomPair,
  fetchSharedPeople,
  fetchNearbyEvents,
  searchEvents,
} from '../api/client';
import type {
  CausalPathStep,
  SharedPersonItem,
  NearbyEventItem,
} from '../api/client';
import type { EventDetail, SearchResult, EventCategory } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../utils/categories';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a year as BCE/CE string. */
function formatYear(year: number | null | undefined, isBce?: boolean): string {
  if (year == null) return 'Unknown';
  if (isBce || year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Compute absolute year gap. */
function yearGap(a: number | null | undefined, b: number | null | undefined): number | null {
  if (a == null || b == null) return null;
  return Math.abs(a - b);
}

/** Rough era label from year. */
function eraLabel(year: number | null | undefined): string {
  if (year == null) return 'Unknown';
  if (year < -3000) return 'Prehistoric';
  if (year < -500) return 'Ancient';
  if (year < 500) return 'Classical';
  if (year < 1500) return 'Medieval';
  if (year < 1800) return 'Early Modern';
  if (year < 1945) return 'Modern';
  return 'Contemporary';
}

/** Importance stars (0-1 → 1-5 stars). */
function importanceStars(score: number): string {
  const count = Math.max(1, Math.min(5, Math.round(score * 5)));
  return '\u2605'.repeat(count) + '\u2606'.repeat(5 - count);
}

// ─── Event Search Box ────────────────────────────────────────────────────────

interface EventSearchBoxProps {
  label: string;
  selected: EventDetail | null;
  onSelect: (slug: string) => void;
  onClear: () => void;
}

function EventSearchBox({ label, selected, onSelect, onClear }: EventSearchBoxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const { data: results = [] } = useQuery({
    queryKey: ['compare-search', query],
    queryFn: () => searchEvents(query, 8),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000,
  });

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2">
        <span className="text-sm font-medium text-white truncate flex-1">
          {selected.title}
        </span>
        <span className="shrink-0 rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
          {formatYear(selected.year_approx, selected.is_bce)}
        </span>
        <button
          onClick={onClear}
          className="shrink-0 text-slate-400 hover:text-white transition-colors"
          aria-label={`Clear ${label}`}
        >
          &times;
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="Search events..."
        className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-slate-600 bg-slate-800 shadow-xl">
          {results.map((r: SearchResult) => (
            <li key={r.slug}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(r.slug);
                  setQuery('');
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors"
              >
                <span className="truncate text-white">{r.title}</span>
                <span className="shrink-0 text-xs text-slate-400">
                  {formatYear(r.year_approx)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Comparison Grid Row ─────────────────────────────────────────────────────

interface GridRowProps {
  label: string;
  valueA: string;
  valueB: string;
  highlight?: boolean;
}

function GridRow({ label, valueA, valueB, highlight }: GridRowProps) {
  const matchClass = highlight ? 'bg-blue-900/30' : '';
  return (
    <tr className={`border-b border-slate-700/50 ${matchClass}`}>
      <td className="px-4 py-2.5 text-sm font-medium text-slate-400 w-40">{label}</td>
      <td className="px-4 py-2.5 text-sm text-white">{valueA}</td>
      <td className="px-4 py-2.5 text-sm text-white">{valueB}</td>
    </tr>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ComparePage() {
  const navigate = useNavigate();
  const params = useParams<{ slugA?: string; slugB?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine slugs from route params or query params
  const slugA = params.slugA ?? searchParams.get('a') ?? '';
  const slugB = params.slugB ?? searchParams.get('b') ?? '';

  // ── Fetch event details ─────────────────────────────────────────────────
  const { data: eventA, isLoading: loadingA } = useQuery({
    queryKey: ['event', slugA],
    queryFn: () => fetchEventDetail(slugA),
    enabled: slugA.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const { data: eventB, isLoading: loadingB } = useQuery({
    queryKey: ['event', slugB],
    queryFn: () => fetchEventDetail(slugB),
    enabled: slugB.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const bothSelected = !!eventA && !!eventB;

  // ── Fetch comparison data (only when both are selected) ────────────────
  const { data: causalPath } = useQuery({
    queryKey: ['causal-path', slugA, slugB],
    queryFn: () => fetchCausalPath(slugA, slugB),
    enabled: bothSelected,
    staleTime: 10 * 60 * 1000,
  });

  const { data: sharedPeople = [] } = useQuery({
    queryKey: ['shared-people', slugA, slugB],
    queryFn: () => fetchSharedPeople(slugA, slugB),
    enabled: bothSelected,
    staleTime: 10 * 60 * 1000,
  });

  const { data: nearbyA = [] } = useQuery({
    queryKey: ['nearby', slugA],
    queryFn: () => fetchNearbyEvents(slugA, 50, 3),
    enabled: !!eventA,
    staleTime: 10 * 60 * 1000,
  });

  const { data: nearbyB = [] } = useQuery({
    queryKey: ['nearby', slugB],
    queryFn: () => fetchNearbyEvents(slugB, 50, 3),
    enabled: !!eventB,
    staleTime: 10 * 60 * 1000,
  });

  const { data: similarA = [] } = useQuery({
    queryKey: ['nearby-wide', slugA],
    queryFn: () => fetchNearbyEvents(slugA, 200, 3),
    enabled: !!eventA,
    staleTime: 10 * 60 * 1000,
  });

  const { data: similarB = [] } = useQuery({
    queryKey: ['nearby-wide', slugB],
    queryFn: () => fetchNearbyEvents(slugB, 200, 3),
    enabled: !!eventB,
    staleTime: 10 * 60 * 1000,
  });

  // ── URL sync ──────────────────────────────────────────────────────────
  const updateUrl = useCallback(
    (a: string, b: string) => {
      const params = new URLSearchParams();
      if (a) params.set('a', a);
      if (b) params.set('b', b);
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const handleSelectA = useCallback(
    (slug: string) => updateUrl(slug, slugB),
    [slugB, updateUrl],
  );

  const handleSelectB = useCallback(
    (slug: string) => updateUrl(slugA, slug),
    [slugA, updateUrl],
  );

  const handleClearA = useCallback(() => updateUrl('', slugB), [slugB, updateUrl]);
  const handleClearB = useCallback(() => updateUrl(slugA, ''), [slugA, updateUrl]);

  const handleSwap = useCallback(() => updateUrl(slugB, slugA), [slugA, slugB, updateUrl]);

  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const handleSurprise = useCallback(async () => {
    setSurpriseLoading(true);
    try {
      const pair = await fetchRandomPair();
      if (pair) updateUrl(pair.a, pair.b);
    } finally {
      setSurpriseLoading(false);
    }
  }, [updateUrl]);

  // ── Derived comparison data ───────────────────────────────────────────
  const gap = bothSelected ? yearGap(eventA.year_approx, eventB.year_approx) : null;
  const eraA = eventA ? eraLabel(eventA.year_approx) : '';
  const eraB = eventB ? eraLabel(eventB.year_approx) : '';
  const sameEra = eraA === eraB && eraA !== '';

  const causesA = eventA?.connected_events?.filter((e) => e.direction === 'cause').length ?? 0;
  const effectsA = eventA?.connected_events?.filter((e) => e.direction === 'effect').length ?? 0;
  const causesB = eventB?.connected_events?.filter((e) => e.direction === 'cause').length ?? 0;
  const effectsB = eventB?.connected_events?.filter((e) => e.direction === 'effect').length ?? 0;

  // Article summaries (first perspective narrative truncated)
  const summaryA = eventA?.perspectives?.[0]?.narrative?.slice(0, 200) ?? '';
  const summaryB = eventB?.perspectives?.[0]?.narrative?.slice(0, 200) ?? '';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ── Top nav bar ──────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-700 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold text-white hover:text-blue-400 transition-colors">
            Chronicle
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">
              Timeline
            </Link>
            <span className="text-sm font-medium text-blue-400">Compare</span>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* ── Page title ────────────────────────────────────────────────── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event Comparison</h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare two historical events side by side
          </p>
        </div>

        {/* ── a) Event Selector ─────────────────────────────────────────── */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <EventSearchBox
              label="Event A"
              selected={eventA ?? null}
              onSelect={handleSelectA}
              onClear={handleClearA}
            />
            <button
              onClick={handleSwap}
              disabled={!slugA && !slugB}
              className="self-end mb-0.5 rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors disabled:opacity-40"
              title="Swap events"
            >
              &#8644;
            </button>
            <EventSearchBox
              label="Event B"
              selected={eventB ?? null}
              onSelect={handleSelectB}
              onClear={handleClearB}
            />
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={handleSurprise}
              disabled={surpriseLoading}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
            >
              {surpriseLoading ? 'Loading...' : 'Surprise me'}
            </button>
          </div>
        </div>

        {/* Loading state */}
        {(loadingA || loadingB) && (
          <div className="text-center text-slate-400 py-8">Loading event details...</div>
        )}

        {/* ── b) Comparison Header ─────────────────────────────────────── */}
        {bothSelected && (
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-5">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <h2 className="text-xl font-bold text-white">{eventA.title}</h2>
                <p className="text-lg text-blue-400 mt-1">
                  {formatYear(eventA.year_approx, eventA.is_bce)}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{eventB.title}</h2>
                <p className="text-lg text-blue-400 mt-1">
                  {formatYear(eventB.year_approx, eventB.is_bce)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              {gap != null && (
                <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
                  {gap === 0 ? 'Same year' : `${gap.toLocaleString()} years apart`}
                </span>
              )}
              {sameEra ? (
                <span className="rounded-full bg-blue-900/40 border border-blue-700 px-3 py-1 text-sm text-blue-300">
                  Same era: {eraA}
                </span>
              ) : (
                eraA && eraB && (
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-300">
                    {eraA} / {eraB}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* ── c) Comparison Grid ───────────────────────────────────────── */}
        {bothSelected && (
          <Section title="Side-by-Side Comparison">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider w-40">
                      Dimension
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {eventA.title}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {eventB.title}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <GridRow
                    label="Year"
                    valueA={formatYear(eventA.year_approx, eventA.is_bce)}
                    valueB={formatYear(eventB.year_approx, eventB.is_bce)}
                    highlight={eventA.year_approx === eventB.year_approx}
                  />
                  <GridRow
                    label="Era"
                    valueA={eraA}
                    valueB={eraB}
                    highlight={sameEra}
                  />
                  <GridRow
                    label="Region"
                    valueA={eventA.geo_modern ?? 'Unknown'}
                    valueB={eventB.geo_modern ?? 'Unknown'}
                    highlight={eventA.geo_modern === eventB.geo_modern && !!eventA.geo_modern}
                  />
                  <GridRow
                    label="Category"
                    valueA={CATEGORY_LABELS[(eventA.category as EventCategory) ?? ''] ?? eventA.category ?? 'Unknown'}
                    valueB={CATEGORY_LABELS[(eventB.category as EventCategory) ?? ''] ?? eventB.category ?? 'Unknown'}
                    highlight={eventA.category === eventB.category && !!eventA.category}
                  />
                  <GridRow
                    label="Importance"
                    valueA={`${importanceStars(eventA.importance_score)} (${eventA.importance_score.toFixed(2)})`}
                    valueB={`${importanceStars(eventB.importance_score)} (${eventB.importance_score.toFixed(2)})`}
                  />
                  <GridRow
                    label="Causes"
                    valueA={`${causesA} event${causesA !== 1 ? 's' : ''} led to this`}
                    valueB={`${causesB} event${causesB !== 1 ? 's' : ''} led to this`}
                  />
                  <GridRow
                    label="Effects"
                    valueA={`This caused ${effectsA} event${effectsA !== 1 ? 's' : ''}`}
                    valueB={`This caused ${effectsB} event${effectsB !== 1 ? 's' : ''}`}
                  />
                  <GridRow
                    label="People"
                    valueA={`${eventA.connected_events?.length ?? 0} connections`}
                    valueB={`${eventB.connected_events?.length ?? 0} connections`}
                  />
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── d) Connection Section ────────────────────────────────────── */}
        {bothSelected && (
          <Section title="Are these events connected?">
            {causalPath?.found ? (
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {causalPath.steps.map((step: CausalPathStep, i: number) => (
                    <span key={step.slug} className="flex items-center gap-2">
                      <Link
                        to={`/event/${step.slug}`}
                        className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-600 transition-colors"
                      >
                        {step.title}
                        {step.year_approx != null && (
                          <span className="ml-1.5 text-xs text-slate-400">
                            ({formatYear(step.year_approx)})
                          </span>
                        )}
                      </Link>
                      {i < causalPath.steps.length - 1 && (
                        <span className="text-blue-400 text-lg">&rarr;</span>
                      )}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {causalPath.length} step{causalPath.length !== 1 ? 's' : ''} apart in the causal chain
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No direct causal link found &mdash; they happened in parallel
              </p>
            )}
          </Section>
        )}

        {/* ── e) Contemporary Events ──────────────────────────────────── */}
        {bothSelected && (nearbyA.length > 0 || nearbyB.length > 0) && (
          <Section title="What else was happening?">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  At the time of {eventA.title}...
                </h3>
                <ul className="space-y-1.5">
                  {nearbyA.map((e: NearbyEventItem) => (
                    <li key={e.slug}>
                      <Link
                        to={`/event/${e.slug}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {e.title}
                      </Link>
                      <span className="ml-1.5 text-xs text-slate-500">
                        {formatYear(e.year_approx)}
                      </span>
                    </li>
                  ))}
                  {nearbyA.length === 0 && (
                    <li className="text-sm text-slate-500">No contemporary events found</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  At the time of {eventB.title}...
                </h3>
                <ul className="space-y-1.5">
                  {nearbyB.map((e: NearbyEventItem) => (
                    <li key={e.slug}>
                      <Link
                        to={`/event/${e.slug}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {e.title}
                      </Link>
                      <span className="ml-1.5 text-xs text-slate-500">
                        {formatYear(e.year_approx)}
                      </span>
                    </li>
                  ))}
                  {nearbyB.length === 0 && (
                    <li className="text-sm text-slate-500">No contemporary events found</li>
                  )}
                </ul>
              </div>
            </div>
          </Section>
        )}

        {/* ── f) Shared People ─────────────────────────────────────────── */}
        {bothSelected && sharedPeople.length > 0 && (
          <Section title={`${sharedPeople.length} ${sharedPeople.length === 1 ? 'person appears' : 'people appear'} in both events' histories`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sharedPeople.map((p: SharedPersonItem) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-slate-600 bg-slate-700/50 p-3"
                >
                  <div className="flex items-center gap-2">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-300">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium text-sm text-white">{p.name}</span>
                  </div>
                  {(p.roles_a.length > 0 || p.roles_b.length > 0) && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      {[...new Set([...p.roles_a, ...p.roles_b])].join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── g) Article Summaries ─────────────────────────────────────── */}
        {bothSelected && (summaryA || summaryB) && (
          <Section title="Quick Summaries">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {summaryA ? `${summaryA}...` : 'No summary available.'}
                </p>
                <Link
                  to={`/event/${eventA.slug}`}
                  className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Learn more &rarr;
                </Link>
              </div>
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {summaryB ? `${summaryB}...` : 'No summary available.'}
                </p>
                <Link
                  to={`/event/${eventB.slug}`}
                  className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          </Section>
        )}

        {/* ── h) Similar Events ────────────────────────────────────────── */}
        {bothSelected && (similarA.length > 0 || similarB.length > 0) && (
          <Section title="Similar Events">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  Events similar to {eventA.title}
                </h3>
                <ul className="space-y-1.5">
                  {similarA.map((e: NearbyEventItem) => (
                    <li key={e.slug}>
                      <Link
                        to={`/event/${e.slug}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {e.title}
                      </Link>
                      <span className="ml-1.5 text-xs text-slate-500">
                        {formatYear(e.year_approx)}
                        {e.category && ` \u00B7 ${CATEGORY_LABELS[e.category as EventCategory] ?? e.category}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  Events similar to {eventB.title}
                </h3>
                <ul className="space-y-1.5">
                  {similarB.map((e: NearbyEventItem) => (
                    <li key={e.slug}>
                      <Link
                        to={`/event/${e.slug}`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {e.title}
                      </Link>
                      <span className="ml-1.5 text-xs text-slate-500">
                        {formatYear(e.year_approx)}
                        {e.category && ` \u00B7 ${CATEGORY_LABELS[e.category as EventCategory] ?? e.category}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
