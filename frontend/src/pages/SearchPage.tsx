/**
 * SearchPage — Advanced multi-filter search interface at /search.
 *
 * Owns: search form state, filter management, results display, pagination.
 * Does NOT own: API calls (see api/client.ts), global app state.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { advancedSearch, fetchCategories } from '../api/client';
import type { AdvancedSearchParams, AdvancedSearchResult } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const REGIONS = ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Oceania'] as const;

const ERAS: { label: string; year_from: number; year_to: number }[] = [
  { label: 'Ancient', year_from: -3500, year_to: -500 },
  { label: 'Classical', year_from: -500, year_to: 500 },
  { label: 'Medieval', year_from: 500, year_to: 1500 },
  { label: 'Early Modern', year_from: 1500, year_to: 1800 },
  { label: 'Modern', year_from: 1800, year_to: 1945 },
  { label: 'Contemporary', year_from: 1945, year_to: 2025 },
];

const IMPORTANCE_OPTIONS = [
  { label: 'Any', value: undefined },
  { label: 'Significant (>0.4)', value: 0.4 },
  { label: 'Major (>0.7)', value: 0.7 },
  { label: 'Landmark (>0.9)', value: 0.9 },
] as const;

const SORT_OPTIONS = [
  { label: 'Most Important', value: 'importance_desc' },
  { label: 'Earliest First', value: 'year_asc' },
  { label: 'Latest First', value: 'year_desc' },
  { label: 'Most Connected', value: 'connections_desc' },
] as const;

const EXAMPLE_QUERIES = [
  'Roman Empire', 'Scientific Revolution', 'World War II', 'Ottoman',
  'plague', 'revolution', 'China', 'trade',
];

const POPULAR_SEARCHES = [
  { slug: 'world-war-ii-begins-1939', title: 'World War II Begins', year: 1939 },
  { slug: 'french-revolution-begins-1789', title: 'French Revolution', year: 1789 },
  { slug: 'fall-of-rome-476', title: 'Fall of Rome', year: 476 },
  { slug: 'industrial-revolution-peak-1850', title: 'Industrial Revolution', year: 1850 },
  { slug: 'apollo-11-moon-landing-1969', title: 'Moon Landing', year: 1969 },
];

const PAGE_SIZE = 20;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Format a year as BCE/CE string. */
function formatYear(year: number | null): string {
  if (year === null) return 'Unknown';
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Render importance as stars (1-5). */
function importanceStars(score: number): string {
  const stars = Math.round(score * 5);
  return '\u2605'.repeat(stars) + '\u2606'.repeat(5 - stars);
}

/** Category color map for badges. */
const CATEGORY_COLORS: Record<string, string> = {
  war: 'bg-red-500/20 text-red-300 border-red-500/30',
  discovery: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  political: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  cultural: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  natural: 'bg-green-500/20 text-green-300 border-green-500/30',
  person: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  religion: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  science: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  economics: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  exploration: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

function categoryClass(cat: string | null): string {
  if (!cat) return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  return CATEGORY_COLORS[cat] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30';
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(() => {
    const r = searchParams.get('region');
    return r ? new Set(r.split(',')) : new Set();
  });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
    const c = searchParams.get('category');
    return c ? new Set(c.split(',')) : new Set();
  });
  const [selectedEra, setSelectedEra] = useState<string | null>(searchParams.get('era'));
  const [yearFrom, setYearFrom] = useState<string>(searchParams.get('year_from') ?? '');
  const [yearTo, setYearTo] = useState<string>(searchParams.get('year_to') ?? '');
  const [minImportance, setMinImportance] = useState<number | undefined>(() => {
    const v = searchParams.get('min_importance');
    return v ? parseFloat(v) : undefined;
  });
  const [hasPeople, setHasPeople] = useState(searchParams.get('has_people') === 'true');
  const [hasCauses, setHasCauses] = useState(searchParams.get('has_causes') === 'true');
  const [hasEffects, setHasEffects] = useState(searchParams.get('has_effects') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'importance_desc');
  const [page, setPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch categories from DB
  const { data: dbCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Build search params
  const buildParams = useCallback((): AdvancedSearchParams => {
    const params: AdvancedSearchParams = {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
      sort,
    };
    if (query.trim()) params.q = query.trim();
    if (selectedRegions.size > 0) params.region = [...selectedRegions].join(',');
    if (selectedCategories.size > 0) params.category = [...selectedCategories].join(',');
    if (selectedEra) params.era = selectedEra;
    if (yearFrom) params.year_from = parseInt(yearFrom, 10);
    if (yearTo) params.year_to = parseInt(yearTo, 10);
    if (minImportance !== undefined) params.min_importance = minImportance;
    if (hasPeople) params.has_people = true;
    if (hasCauses) params.has_causes = true;
    if (hasEffects) params.has_effects = true;
    return params;
  }, [query, selectedRegions, selectedCategories, selectedEra, yearFrom, yearTo, minImportance, hasPeople, hasCauses, hasEffects, sort, page]);

  // Search query
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['advancedSearch', buildParams()],
    queryFn: () => advancedSearch(buildParams()),
    enabled: hasSearched,
  });

  // Auto-focus search input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Sync URL params
  useEffect(() => {
    if (!hasSearched) return;
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (selectedRegions.size > 0) p.set('region', [...selectedRegions].join(','));
    if (selectedCategories.size > 0) p.set('category', [...selectedCategories].join(','));
    if (selectedEra) p.set('era', selectedEra);
    if (yearFrom) p.set('year_from', yearFrom);
    if (yearTo) p.set('year_to', yearTo);
    if (minImportance !== undefined) p.set('min_importance', String(minImportance));
    if (hasPeople) p.set('has_people', 'true');
    if (hasCauses) p.set('has_causes', 'true');
    if (hasEffects) p.set('has_effects', 'true');
    if (sort !== 'importance_desc') p.set('sort', sort);
    setSearchParams(p, { replace: true });
  }, [hasSearched, query, selectedRegions, selectedCategories, selectedEra, yearFrom, yearTo, minImportance, hasPeople, hasCauses, hasEffects, sort, setSearchParams]);

  const doSearch = useCallback(() => {
    setPage(0);
    setHasSearched(true);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') doSearch();
  };

  const clearAll = () => {
    setQuery('');
    setSelectedRegions(new Set());
    setSelectedCategories(new Set());
    setSelectedEra(null);
    setYearFrom('');
    setYearTo('');
    setMinImportance(undefined);
    setHasPeople(false);
    setHasCauses(false);
    setHasEffects(false);
    setSort('importance_desc');
    setPage(0);
    setHasSearched(false);
    setSearchParams({}, { replace: true });
    inputRef.current?.focus();
  };

  const toggleRegion = (r: string) => {
    setSelectedRegions(prev => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r); else next.add(r);
      return next;
    });
  };

  const toggleCategory = (c: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c); else next.add(c);
      return next;
    });
  };

  const selectEra = (label: string) => {
    const era = ERAS.find(e => e.label === label);
    if (!era) return;
    if (selectedEra === label) {
      setSelectedEra(null);
      setYearFrom('');
      setYearTo('');
    } else {
      setSelectedEra(label);
      setYearFrom(String(era.year_from));
      setYearTo(String(era.year_to));
    }
  };

  // Active filters for chip display
  const activeFilters: { label: string; onRemove: () => void }[] = [];
  if (query) activeFilters.push({ label: `"${query}"`, onRemove: () => setQuery('') });
  for (const r of selectedRegions) {
    activeFilters.push({ label: `Region: ${r}`, onRemove: () => toggleRegion(r) });
  }
  for (const c of selectedCategories) {
    activeFilters.push({ label: `Category: ${c}`, onRemove: () => toggleCategory(c) });
  }
  if (selectedEra) activeFilters.push({ label: `Era: ${selectedEra}`, onRemove: () => { setSelectedEra(null); setYearFrom(''); setYearTo(''); } });
  if (yearFrom && !selectedEra) activeFilters.push({ label: `From: ${formatYear(parseInt(yearFrom))}`, onRemove: () => setYearFrom('') });
  if (yearTo && !selectedEra) activeFilters.push({ label: `To: ${formatYear(parseInt(yearTo))}`, onRemove: () => setYearTo('') });
  if (minImportance !== undefined) activeFilters.push({ label: `Importance: >${minImportance}`, onRemove: () => setMinImportance(undefined) });
  if (hasPeople) activeFilters.push({ label: 'Has linked people', onRemove: () => setHasPeople(false) });
  if (hasCauses) activeFilters.push({ label: 'Has causes', onRemove: () => setHasCauses(false) });
  if (hasEffects) activeFilters.push({ label: 'Has effects', onRemove: () => setHasEffects(false) });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const categories = dbCategories ?? ['war', 'discovery', 'political', 'cultural', 'natural', 'person'];

  // ─── Render ──────────────────────────────────────────────────────────────────

  const filterPanel = (
    <div className="space-y-5">
      {/* Year Range */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Year Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="-3500"
            value={yearFrom}
            onChange={e => { setYearFrom(e.target.value); setSelectedEra(null); }}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          <span className="text-slate-500 text-sm">to</span>
          <input
            type="number"
            placeholder="2025"
            value={yearTo}
            onChange={e => { setYearTo(e.target.value); setSelectedEra(null); }}
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Negative = BCE</p>
      </section>

      {/* Era Quick Select */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Era</h3>
        <div className="flex flex-wrap gap-1.5">
          {ERAS.map(era => (
            <button
              key={era.label}
              onClick={() => selectEra(era.label)}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                selectedEra === era.label
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </section>

      {/* Region */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Region</h3>
        <div className="space-y-1">
          {REGIONS.map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedRegions.has(r)}
                onChange={() => toggleRegion(r)}
                className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{r}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Category */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {categories.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.has(c)}
                onChange={() => toggleCategory(c)}
                className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors capitalize">{c}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Importance */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Importance</h3>
        <div className="space-y-1">
          {IMPORTANCE_OPTIONS.map(opt => (
            <label key={opt.label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="importance"
                checked={minImportance === opt.value}
                onChange={() => setMinImportance(opt.value)}
                className="border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Connections */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Connections</h3>
        <div className="space-y-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={hasCauses} onChange={e => setHasCauses(e.target.checked)} className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0" />
            <span className="text-sm text-slate-300 group-hover:text-white">Has causes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={hasEffects} onChange={e => setHasEffects(e.target.checked)} className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0" />
            <span className="text-sm text-slate-300 group-hover:text-white">Has effects</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={hasPeople} onChange={e => setHasPeople(e.target.checked)} className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/30 focus:ring-offset-0" />
            <span className="text-sm text-slate-300 group-hover:text-white">Has linked people</span>
          </label>
        </div>
      </section>

      {/* Sort */}
      <section>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sort By</h3>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </section>

      {/* Reset */}
      <button
        onClick={clearAll}
        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070e22] text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-[#070e22]/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="text-lg font-bold text-white hover:text-blue-400 transition-colors shrink-0">
            Chronicle
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <Link to="/eras" className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">Eras</Link>
            <Link to="/search" className="px-3 py-1.5 text-xs font-medium text-blue-400 border-b-2 border-blue-400">
              <span className="inline-flex items-center gap-1">&#128269; Search</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search historical events..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={doSearch}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shrink-0"
          >
            Search
          </button>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden px-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && hasSearched && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {activeFilters.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-full text-slate-300">
                {f.label}
                <button onClick={() => { f.onRemove(); doSearch(); }} className="text-slate-500 hover:text-white ml-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
            <button onClick={clearAll} className="text-xs text-blue-400 hover:text-blue-300 ml-1">Clear all</button>
          </div>
        )}
      </div>

      {/* Main content: sidebar + results */}
      <div className="max-w-7xl mx-auto px-4 pb-12 flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="sticky top-20 bg-slate-900/50 border border-slate-800 rounded-xl p-4 max-h-[calc(100vh-100px)] overflow-y-auto">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Filters</h2>
            {filterPanel}
          </div>
        </aside>

        {/* Mobile filter drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-[#0b1328] border-r border-slate-800 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-200">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {filterPanel}
              <button
                onClick={() => { setMobileFiltersOpen(false); doSearch(); }}
                className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results area */}
        <main className="flex-1 min-w-0">
          {!hasSearched ? (
            <SearchSuggestions
              onQueryClick={(q) => { setQuery(q); setHasSearched(true); }}
            />
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-slate-400">Searching...</span>
            </div>
          ) : data && data.results.length > 0 ? (
            <div>
              <p className="text-sm text-slate-400 mb-4">
                <span className="text-white font-medium">{data.total}</span> events found
              </p>

              <div className="space-y-3">
                {data.results.map(result => (
                  <ResultCard key={result.slug} result={result} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const pageNum = totalPages <= 7 ? i : (
                      page < 4 ? i :
                      page > totalPages - 4 ? totalPages - 7 + i :
                      page - 3 + i
                    );
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                          pageNum === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No results found</p>
              <p className="text-slate-500 text-sm mt-1">Try broadening your search or removing some filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Search suggestions shown when no search has been performed. */
function SearchSuggestions({ onQueryClick }: { onQueryClick: (q: string) => void }) {
  return (
    <div className="py-12">
      <section className="mb-10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Try searching for</h3>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => onQueryClick(q)}
              className="px-4 py-2 text-sm bg-slate-800/80 border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular searches</h3>
        <div className="space-y-2">
          {POPULAR_SEARCHES.map(item => (
            <Link
              key={item.slug}
              to={`/?event=${item.slug}`}
              className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-600 transition-colors group"
            >
              <span className="text-sm text-slate-200 group-hover:text-white">{item.title}</span>
              <span className="text-xs text-slate-500 ml-auto">{item.year} CE</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Single result card in the search results list. */
function ResultCard({ result }: { result: AdvancedSearchResult }) {
  return (
    <Link
      to={`/?event=${result.slug}`}
      className="block p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-600 hover:bg-slate-900/80 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium text-slate-100 group-hover:text-white truncate">
            {result.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-slate-400">{formatYear(result.year_approx)}</span>
            {result.region && (
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-700/50 text-slate-300 rounded-full border border-slate-700">
                {result.region}
              </span>
            )}
            {result.category && (
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize ${categoryClass(result.category)}`}>
                {result.category}
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-amber-400" title={`Importance: ${(result.importance_score * 100).toFixed(0)}%`}>
            {importanceStars(result.importance_score)}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
            {result.cause_count > 0 && (
              <span title={`${result.cause_count} cause(s)`}>
                &#8592; {result.cause_count}
              </span>
            )}
            {result.effect_count > 0 && (
              <span title={`${result.effect_count} effect(s)`}>
                {result.effect_count} &#8594;
              </span>
            )}
            {result.people_count > 0 && (
              <span title={`${result.people_count} linked person(s)`}>
                &#128100; {result.people_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
