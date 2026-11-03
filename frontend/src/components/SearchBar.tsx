/**
 * SearchBar — global event search with keyword and semantic modes.
 *
 * Owns: search input, mode toggle (Keyword/Semantic), result dropdown.
 * Does NOT own: event detail display, map navigation logic.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchEvents, searchEventsSemantic } from '../api/client';
import { IS_DEMO_MODE } from '../config/demo';
import { formatYear } from '../utils/format';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { MOCK_EVENTS } from '../api/client';
import type { SearchResult } from '../types';

/** Max height (px) for the search results dropdown before it scrolls. */
const SEARCH_RESULTS_MAX_HEIGHT_PX = 360;

/** Debounce delay in ms for search input. */
const DEBOUNCE_DELAY_MS = 250;

/** Minimum query length to trigger search. */
const MIN_QUERY_LENGTH = 2;

/** localStorage key for search mode preference. */
const SEARCH_MODE_KEY = 'chronicle-search-mode';

/** Search mode type. */
type SearchMode = 'keyword' | 'semantic';

/**
 * Custom hook to debounce a value by a given delay.
 *
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

/**
 * SearchBar component with keyword/semantic mode toggle.
 * Displays a fixed search input at the top of the viewport with a dropdown
 * of results. Supports toggling between keyword (fast, Meilisearch/PG FTS)
 * and semantic (meaning-based, pgvector) search modes.
 */
export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>(() => {
    // Semantic search needs the backend's embeddings; the static demo is keyword-only.
    if (IS_DEMO_MODE) return 'keyword';
    const saved = localStorage.getItem(SEARCH_MODE_KEY);
    return saved === 'semantic' ? 'semantic' : 'keyword';
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const debouncedQuery = useDebounce(inputValue, DEBOUNCE_DELAY_MS);

  const searchFn = searchMode === 'semantic' ? searchEventsSemantic : searchEvents;

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', debouncedQuery, searchMode],
    queryFn: () => searchFn(debouncedQuery, searchMode === 'semantic' ? 20 : 10),
    enabled: debouncedQuery.length >= MIN_QUERY_LENGTH,
    staleTime: 2 * 60 * 1000,
  });

  // Persist mode preference
  const handleModeChange = useCallback((mode: SearchMode) => {
    setSearchMode(mode);
    localStorage.setItem(SEARCH_MODE_KEY, mode);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    const event = MOCK_EVENTS.find((e) => e.id === result.id) ?? result;
    setFlyToEvent(event as Parameters<typeof setFlyToEvent>[0]);
    setSelectedEvent(result.slug);
    setInputValue('');
    setOpen(false);
    inputRef.current?.blur();
  }, [setFlyToEvent, setSelectedEvent]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showDropdown = open && debouncedQuery.length >= MIN_QUERY_LENGTH;

  return (
    <div
      ref={containerRef}
      role="search"
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 300,
        width: 480,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {/* Input + Mode Toggle */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'rgba(7, 14, 34, 0.95)',
          backdropFilter: 'blur(20px)',
          border: open
            ? '1px solid rgba(96,165,250,0.5)'
            : '1px solid rgba(255,255,255,0.12)',
          borderRadius: showDropdown ? '12px 12px 0 0' : 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'border 0.15s, border-radius 0.1s',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b',
            fontSize: 16,
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        <label htmlFor="chronicle-search" className="sr-only">
          Search historical events
        </label>
        <input
          id="chronicle-search"
          ref={inputRef}
          type="search"
          autoComplete="off"
          aria-describedby="chronicle-search-status"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={searchMode === 'semantic'
            ? 'Search by meaning… e.g. "conflicts in ancient Greece"'
            : 'Search events, places, years…'}
          style={{
            width: '100%',
            padding: '13px 176px 13px 42px',
            textOverflow: 'ellipsis',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f1f5f9',
            fontSize: 15,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />

        {/* Mode Toggle Pill */}
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <ModeButton
            label="Keyword"
            active={searchMode === 'keyword'}
            onClick={() => handleModeChange('keyword')}
          />
          <ModeButton
            label="Semantic"
            active={searchMode === 'semantic'}
            onClick={() => handleModeChange('semantic')}
            disabled={IS_DEMO_MODE}
            disabledReason="Semantic search needs the backend — not available in the demo"
          />
        </div>

        {/* Loading spinner / clear button */}
        {isFetching && (
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#60a5fa',
              fontSize: 14,
              animation: 'spin 1s linear infinite',
            }}
          >
            ⟳
          </span>
        )}
        {inputValue && !isFetching && (
          <button
            onClick={() => { setInputValue(''); setOpen(false); }}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              fontSize: 16,
              padding: '4px 6px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {/* Announce result counts to screen readers */}
      <div id="chronicle-search-status" className="sr-only" aria-live="polite">
        {showDropdown && !isFetching
          ? `${results.length} result${results.length === 1 ? '' : 's'}`
          : ''}
      </div>

      {showDropdown && (
        <div
          className="chronicle-fade-in"
          style={{
            backgroundColor: 'rgba(7, 14, 34, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(96,165,250,0.3)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            /* Cap height and enable scrolling when many search results are returned */
            maxHeight: SEARCH_RESULTS_MAX_HEIGHT_PX,
            overflowY: 'auto',
          }}
        >
          {/* Semantic mode indicator */}
          {searchMode === 'semantic' && (
            <div style={{
              padding: '6px 16px',
              fontSize: 11,
              color: '#818cf8',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>🧠</span>
              <span>Semantic search — results ranked by meaning</span>
            </div>
          )}
          {results.length === 0 ? (
            <div
              role="status"
              style={{ padding: '14px 16px', color: '#94a3b8', fontSize: 13, textAlign: 'center' }}
            >
              {isFetching ? 'Searching…' : (
                <>
                  No events match “{debouncedQuery}”.
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    Try a place, a person, or a broader word{IS_DEMO_MODE ? ' — the demo holds a 300-event sample' : ''}.
                  </div>
                </>
              )}
            </div>
          ) : (
            results.map((result, i) => {
              const color = CATEGORY_COLORS[result.category] ?? '#6b7280';
              const icon = CATEGORY_ICONS[result.category] ?? '●';
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => handleSelect(result)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '11px 16px',
                    background: 'none',
                    border: 'none',
                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 13,
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${color}44`,
                    }}
                  >
                    {icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {result.title}
                      <span style={{
                        fontSize: 9,
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: 9,
                        backgroundColor: result.result_type === 'person' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                        color: result.result_type === 'person' ? '#4ade80' : '#60a5fa',
                        flexShrink: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {result.result_type === 'person' ? 'person' : 'event'}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {formatYear(result.year_approx)}
                      {result.geo_modern ? ` · ${result.geo_modern}` : ''}
                    </div>
                  </div>

                  {/* Fly-to indicator */}
                  <span aria-hidden="true" style={{ color: '#64748b', fontSize: 12, flexShrink: 0 }}>
                    ✈ fly to
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Spin animation for loading indicator */}
      <style>{`
        @keyframes spin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * Pill toggle button for switching between search modes.
 *
 * @param props.label - Button label text
 * @param props.active - Whether this mode is currently active
 * @param props.onClick - Click handler
 */
function ModeButton({
  label,
  active,
  onClick,
  disabled = false,
  disabledReason,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={disabled ? disabledReason : undefined}
      style={{
        padding: '3px 8px',
        fontSize: 10,
        fontWeight: active ? 600 : 400,
        color: active ? '#e0e7ff' : '#94a3b8',
        backgroundColor: active ? 'rgba(99,102,241,0.3)' : 'transparent',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
