import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchEvents } from '../api/client';
import { useAppStore } from '../store';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { MOCK_EVENTS } from '../api/client';
import type { SearchResult } from '../types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setFlyToEvent = useAppStore((s) => s.setFlyToEvent);
  const setSelectedEvent = useAppStore((s) => s.setSelectedEvent);

  const debouncedQuery = useDebounce(inputValue, 300);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchEvents(debouncedQuery, 10),
    enabled: debouncedQuery.length >= 2,
    staleTime: 2 * 60 * 1000,
  });

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
    // Find full event in mock data for flyover
    const event = MOCK_EVENTS.find((e) => e.id === result.id) ?? result;
    setFlyToEvent(event as any);
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

  const showDropdown = open && debouncedQuery.length >= 2;

  return (
    <div
      ref={containerRef}
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
      {/* Input */}
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
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#475569',
            fontSize: 16,
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search events, places, years…"
          style={{
            width: '100%',
            padding: '13px 40px 13px 42px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#f1f5f9',
            fontSize: 15,
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
        {isFetching && (
          <span
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#475569',
              fontSize: 12,
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
      {showDropdown && (
        <div
          style={{
            backgroundColor: 'rgba(7, 14, 34, 0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(96,165,250,0.3)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {results.length === 0 ? (
            <div style={{ padding: '14px 16px', color: '#475569', fontSize: 13, textAlign: 'center' }}>
              {isFetching ? 'Searching…' : 'No events found'}
            </div>
          ) : (
            results.map((result, i) => {
              const color = CATEGORY_COLORS[result.category] ?? '#6b7280';
              const icon = CATEGORY_ICONS[result.category] ?? '●';
              return (
                <button
                  key={result.id}
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
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                      {result.year_approx}
                      {result.geo_modern ? ` · ${result.geo_modern}` : ''}
                    </div>
                  </div>

                  {/* Fly-to indicator */}
                  <span style={{ color: '#475569', fontSize: 12, flexShrink: 0 }}>
                    ✈ fly to
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
