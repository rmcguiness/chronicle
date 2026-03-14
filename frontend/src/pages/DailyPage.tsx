/**
 * DailyPage — Wordle-style daily history challenge.
 *
 * Every day, all users get the same historical event to guess.
 * 6 guesses max, progressive hints revealed per wrong guess.
 * Streak tracking + shareable emoji results.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDailyChallenge, fetchDailyReveal } from '../api/client';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../utils/categories';
import type { EventCategory } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DailyChallenge {
  slug: string;
  title: string;
  category: string | null;
  region: string | null;
  importance_score: number;
  day_number: number;
}

interface DailyReveal {
  slug: string;
  year_approx: number | null;
  is_bce: boolean;
  article_summary: string | null;
  geo_modern: string | null;
}

interface GuessRecord {
  value: number;
  diff: number;
  color: GuessColor;
}

type GuessColor = 'green' | 'yellow' | 'orange' | 'red';

interface DailyGameState {
  dayNumber: number;
  guesses: GuessRecord[];
  completed: boolean;
  won: boolean;
  revealedYear: number | null;
  isBce: boolean;
  articleSummary: string | null;
}

interface DailyStreakData {
  current: number;
  best: number;
  totalCompleted: number;
  /** Map of dayNumber → boolean (completed) */
  history: Record<string, boolean>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAX_GUESSES = 6;
const STORAGE_KEY = 'chronicle:dailyGameState';
const STREAK_KEY = 'chronicle:dailyStreak';

const HINT_LABELS = [
  'Event title shown',
  'Region revealed',
  'Category revealed',
  'Era revealed',
  'Century revealed',
  'Decade revealed',
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Classify guess accuracy by distance from answer. */
function guessColor(diff: number): GuessColor {
  const abs = Math.abs(diff);
  if (abs <= 10) return 'green';
  if (abs <= 50) return 'yellow';
  if (abs <= 200) return 'orange';
  return 'red';
}

/** Map GuessColor to display values. */
function colorToEmoji(c: GuessColor): string {
  switch (c) {
    case 'green': return '🟩';
    case 'yellow': return '🟨';
    case 'orange': return '🟧';
    case 'red': return '🟥';
  }
}

function colorToHex(c: GuessColor): string {
  switch (c) {
    case 'green': return '#22c55e';
    case 'yellow': return '#eab308';
    case 'orange': return '#f97316';
    case 'red': return '#ef4444';
  }
}

/** Determine the era label for a year. */
function eraLabel(year: number, isBce: boolean): string {
  if (isBce || year < 0) {
    const y = Math.abs(year);
    if (y > 3000) return 'Ancient era, before 3000 BCE';
    if (y > 500) return 'Ancient era, 3000–500 BCE';
    return 'Classical era, 500–1 BCE';
  }
  if (year <= 500) return 'Late Antiquity, 1–500 CE';
  if (year <= 1400) return 'Medieval era, 501–1400 CE';
  if (year <= 1600) return 'Renaissance era, 1401–1600 CE';
  if (year <= 1800) return 'Early Modern era, 1601–1800 CE';
  if (year <= 1900) return 'Industrial era, 1801–1900 CE';
  return 'Modern era, 1901–present';
}

/** Get the century label for a year. */
function centuryLabel(year: number, isBce: boolean): string {
  if (isBce || year < 0) {
    const y = Math.abs(year);
    const c = Math.ceil(y / 100);
    return `the ${c}${ordinal(c)} century BCE`;
  }
  const c = Math.ceil(year / 100);
  return `the ${c}${ordinal(c)} century CE`;
}

/** Get the decade label for a year. */
function decadeLabel(year: number, isBce: boolean): string {
  if (isBce || year < 0) {
    const y = Math.abs(year);
    const d = Math.floor(y / 10) * 10;
    return `the ${d}s BCE`;
  }
  const d = Math.floor(year / 10) * 10;
  return `the ${d}s`;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/** Format a year for display. */
function formatYear(year: number, isBce: boolean): string {
  if (isBce || year < 0) return `${Math.abs(year)} BCE`;
  return `${year} CE`;
}

/** Load state from localStorage. */
function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Save state to localStorage. */
function saveState(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Time until midnight UTC. */
function msUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return midnight.getTime() - now.getTime();
}

/** Format ms as HH:MM:SS. */
function formatCountdown(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Region string for hint. */
function regionHint(region: string | null): string {
  if (!region) return 'Unknown region';
  // geo_modern is like "Sarajevo, Bosnia" — extract last part or whole string
  const parts = region.split(',').map((s) => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : region;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default state factories
// ─────────────────────────────────────────────────────────────────────────────

function defaultGameState(dayNumber: number): DailyGameState {
  return {
    dayNumber,
    guesses: [],
    completed: false,
    won: false,
    revealedYear: null,
    isBce: false,
    articleSummary: null,
  };
}

function defaultStreak(): DailyStreakData {
  return { current: 0, best: 0, totalCompleted: 0, history: {} };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Streak stats bar. */
function DailyStreak({ streak }: { streak: DailyStreakData }) {
  // Last 30 days completion calendar
  const today = Math.floor((Date.now() - new Date('2024-01-01T00:00:00Z').getTime()) / 86400000);
  const dots: { day: number; done: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = today - i;
    dots.push({ day: d, done: !!streak.history[String(d)] });
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 12,
      padding: 16, backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
    }}>
      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        <StatBox label="Current Streak" value={`${streak.current}`} icon="🔥" />
        <StatBox label="Best Streak" value={`${streak.best}`} icon="⭐" />
        <StatBox label="Completed" value={`${streak.totalCompleted}`} icon="✅" />
      </div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
        {dots.map((d) => (
          <div
            key={d.day}
            style={{
              width: 12, height: 12, borderRadius: 3,
              backgroundColor: d.done ? '#22c55e' : 'rgba(255,255,255,0.08)',
            }}
            title={d.done ? 'Completed' : 'Missed'}
          />
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{icon} {value}</div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

/** A single guess row. */
function GuessRow({
  index,
  guess,
  isActive,
  inputValue,
  onInput,
  onSubmit,
  isBce,
}: {
  index: number;
  guess: GuessRecord | null;
  isActive: boolean;
  inputValue: string;
  onInput: (v: string) => void;
  onSubmit: () => void;
  isBce: boolean;
}) {
  const bgColor = guess ? colorToHex(guess.color) : isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)';
  const borderColor = guess ? colorToHex(guess.color) : isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)';

  return (
    <motion.div
      initial={guess ? { scale: 0.95, opacity: 0.7 } : false}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px', borderRadius: 10,
        backgroundColor: guess ? `${bgColor}22` : bgColor,
        border: `1px solid ${borderColor}`,
        minHeight: 48, transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: guess ? colorToHex(guess.color) : 'rgba(255,255,255,0.1)',
        fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>
        {guess ? colorToEmoji(guess.color) : index + 1}
      </div>

      {guess ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{formatYear(guess.value, isBce && guess.value < 0)}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            {guess.diff === 0 ? 'Exact!' : `Off by ${Math.abs(guess.diff)} year${Math.abs(guess.diff) !== 1 ? 's' : ''}`}
          </span>
        </div>
      ) : isActive ? (
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
          style={{ flex: 1, display: 'flex', gap: 8, alignItems: 'center' }}
        >
          <input
            type="number"
            value={inputValue}
            onChange={(e) => onInput(e.target.value)}
            placeholder="Enter year (e.g. 1492)"
            autoFocus
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              backgroundColor: 'rgba(255,255,255,0.06)', color: '#f1f5f9',
              fontSize: 16, fontFamily: "'Inter', sans-serif",
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 20px', borderRadius: 8, border: 'none',
              backgroundColor: '#3b82f6', color: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Guess
          </button>
        </form>
      ) : (
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>—</span>
      )}
    </motion.div>
  );
}

/** Progressive hints panel. */
function HintsPanel({
  guessCount,
  challenge,
  revealYear,
  isBce,
}: {
  guessCount: number;
  challenge: DailyChallenge;
  revealYear: number | null;
  isBce: boolean;
}) {
  const year = revealYear;
  const hints: { label: string; value: string; revealed: boolean }[] = [
    { label: 'Event', value: challenge.title, revealed: true },
    {
      label: 'Region',
      value: `This happened in ${regionHint(challenge.region)}`,
      revealed: guessCount >= 1,
    },
    {
      label: 'Category',
      value: `This was a ${CATEGORY_LABELS[(challenge.category as EventCategory) ?? 'political'] ?? challenge.category} event ${CATEGORY_ICONS[(challenge.category as EventCategory) ?? 'political'] ?? ''}`,
      revealed: guessCount >= 2,
    },
    {
      label: 'Era',
      value: year != null ? `This happened in the ${eraLabel(year, isBce)}` : '...',
      revealed: guessCount >= 3,
    },
    {
      label: 'Century',
      value: year != null ? `This happened in ${centuryLabel(year, isBce)}` : '...',
      revealed: guessCount >= 4,
    },
    {
      label: 'Decade',
      value: year != null ? `This happened in ${decadeLabel(year, isBce)}` : '...',
      revealed: guessCount >= 5,
    },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: 16, backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
        Hints
      </div>
      {hints.map((h, i) => (
        <motion.div
          key={i}
          initial={h.revealed ? { opacity: 1 } : { opacity: 0.3 }}
          animate={{ opacity: h.revealed ? 1 : 0.3 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8,
            backgroundColor: h.revealed ? 'rgba(255,255,255,0.04)' : 'transparent',
          }}
        >
          <span style={{
            fontSize: 11, fontWeight: 700, color: h.revealed ? '#3b82f6' : 'rgba(255,255,255,0.2)',
            width: 60, textTransform: 'uppercase',
          }}>
            {h.label}
          </span>
          <span style={{ fontSize: 14, color: h.revealed ? '#f1f5f9' : 'rgba(255,255,255,0.15)' }}>
            {h.revealed ? h.value : `Reveal after guess ${i + 1}`}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** Result card shown after game ends. */
function DailyResult({
  game,
  challenge,
  streak,
  onShare,
}: {
  game: DailyGameState;
  challenge: DailyChallenge;
  streak: DailyStreakData;
  onShare: () => void;
}) {
  const [countdown, setCountdown] = useState(msUntilMidnightUTC());

  useEffect(() => {
    const id = setInterval(() => setCountdown(msUntilMidnightUTC()), 1000);
    return () => clearInterval(id);
  }, []);

  const score = game.won ? 1000 - (game.guesses.length - 1) * 150 : 0;
  const catColor = CATEGORY_COLORS[(challenge.category as EventCategory) ?? 'political'] ?? '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        padding: 24, backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
      }}
    >
      <div style={{ textAlign: 'center', fontSize: 28 }}>
        {game.won ? '🎉' : '😔'}
      </div>
      <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }}>
        {game.won
          ? `You got it in ${game.guesses.length} guess${game.guesses.length !== 1 ? 'es' : ''}!`
          : `Better luck tomorrow!`}
      </div>

      {game.revealedYear != null && (
        <div style={{
          textAlign: 'center', padding: 16, borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: `1px solid ${catColor}33`,
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>The answer was</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: catColor }}>
            {formatYear(game.revealedYear, game.isBce)}
          </div>
          <div style={{ fontSize: 15, marginTop: 8, fontWeight: 600 }}>{challenge.title}</div>
          {challenge.region && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{challenge.region}</div>
          )}
          {game.articleSummary && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8, lineHeight: 1.5, fontStyle: 'italic' }}>
              {game.articleSummary}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <StatBox label="Score" value={`${score}`} icon="🏆" />
        <StatBox label="Streak" value={`${streak.current}`} icon="🔥" />
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={onShare}
          style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            backgroundColor: '#22c55e', color: '#fff',
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Share Results
        </button>
        <Link
          to={`/event/${challenge.slug}`}
          style={{
            padding: '10px 24px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent', color: '#f1f5f9',
            fontWeight: 600, fontSize: 14, textDecoration: 'none',
            display: 'flex', alignItems: 'center',
          }}
        >
          Learn more about this event
        </Link>
      </div>

      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
        Next challenge in <span style={{ fontWeight: 700, color: '#3b82f6' }}>{formatCountdown(countdown)}</span>
      </div>
    </motion.div>
  );
}

/** Past 7 days challenges (collapsed). */
function PastChallenges({ streak, currentDay }: { streak: DailyStreakData; currentDay: number }) {
  const [open, setOpen] = useState(false);
  const days = Array.from({ length: 7 }, (_, i) => currentDay - 1 - i);
  const completed = days.filter((d) => streak.history[String(d)]).length;

  return (
    <div style={{
      padding: 16, backgroundColor: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12,
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'none', border: 'none', color: '#f1f5f9',
          cursor: 'pointer', width: '100%', textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 0, fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600 }}>Past Challenges</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {completed}/7 this week {open ? '▲' : '▼'}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginTop: 12 }}
          >
            {days.map((d) => (
              <div
                key={d}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  fontSize: 13,
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: streak.history[String(d)] ? '#22c55e' : 'rgba(255,255,255,0.1)',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Day #{d}</span>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>
                  {streak.history[String(d)] ? 'Completed' : 'Missed'}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/** Daily History Challenge page — /daily route. */
export default function DailyPage() {
  const { data: challenge, isLoading, error } = useQuery<DailyChallenge>({
    queryKey: ['daily-challenge'],
    queryFn: fetchDailyChallenge,
    staleTime: 60_000,
  });

  const [game, setGame] = useState<DailyGameState | null>(null);
  const [streak, setStreak] = useState<DailyStreakData>(defaultStreak());
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const revealFetched = useRef(false);

  // Load persisted state when challenge arrives
  useEffect(() => {
    if (!challenge) return;

    const savedStreak = loadState<DailyStreakData>(STREAK_KEY, defaultStreak());
    setStreak(savedStreak);

    const saved = loadState<DailyGameState | null>(STORAGE_KEY, null);
    if (saved && saved.dayNumber === challenge.day_number) {
      setGame(saved);
    } else {
      setGame(defaultGameState(challenge.day_number));
    }
  }, [challenge]);

  // Fetch reveal data when we need year info for hints (after first wrong guess)
  // or when game is completed
  const { data: reveal } = useQuery<DailyReveal>({
    queryKey: ['daily-reveal'],
    queryFn: fetchDailyReveal,
    staleTime: 60_000,
    enabled: !!game && (game.guesses.length > 0 || game.completed),
  });

  // When reveal arrives, update game state if completed
  useEffect(() => {
    if (!reveal || !game || revealFetched.current) return;
    if (game.completed && game.revealedYear == null) {
      revealFetched.current = true;
      const updated = {
        ...game,
        revealedYear: reveal.year_approx,
        isBce: reveal.is_bce,
        articleSummary: reveal.article_summary,
      };
      setGame(updated);
      saveState(STORAGE_KEY, updated);
    }
  }, [reveal, game]);

  /** Submit a guess. */
  const handleGuess = useCallback(() => {
    if (!game || !reveal || game.completed) return;
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) return;

    const answer = reveal.year_approx;
    if (answer == null) return;

    const diff = parsed - answer;
    const color = guessColor(diff);
    const record: GuessRecord = { value: parsed, diff, color };
    const newGuesses = [...game.guesses, record];
    const won = diff === 0;
    const completed = won || newGuesses.length >= MAX_GUESSES;

    const updated: DailyGameState = {
      ...game,
      guesses: newGuesses,
      completed,
      won,
      revealedYear: completed ? answer : null,
      isBce: reveal.is_bce,
      articleSummary: completed ? reveal.article_summary : null,
    };

    setGame(updated);
    saveState(STORAGE_KEY, updated);
    setInputValue('');

    // Update streak on completion
    if (completed) {
      setStreak((prev) => {
        const dayStr = String(game.dayNumber);
        const prevDayStr = String(game.dayNumber - 1);
        const wasYesterday = prev.history[prevDayStr];
        const newCurrent = wasYesterday ? prev.current + 1 : 1;
        const next: DailyStreakData = {
          current: newCurrent,
          best: Math.max(prev.best, newCurrent),
          totalCompleted: prev.totalCompleted + 1,
          history: { ...prev.history, [dayStr]: true },
        };
        saveState(STREAK_KEY, next);
        return next;
      });
    }
  }, [game, reveal, inputValue]);

  /** Build and copy shareable result text. */
  const handleShare = useCallback(() => {
    if (!game || !challenge) return;
    const grid = game.guesses.map((g) => colorToEmoji(g.color)).join('');
    const result = game.won ? `${game.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
    const text = `Chronicle Daily #${challenge.day_number}\n${grid} (${result})\nplay.chronicle.app/daily`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [game, challenge]);

  // ── Render ──────────────────────────────────────────────────────────────────

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  if (isLoading || !game) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          Loading daily challenge...
        </motion.div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", gap: 16,
      }}>
        <div style={{ fontSize: 18, color: '#ef4444' }}>Failed to load today's challenge</div>
        <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Back to Timeline</Link>
      </div>
    );
  }

  const activeIndex = game.completed ? -1 : game.guesses.length;

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14 }}>
          ← Back to Timeline
        </Link>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          {dateStr}
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 560, margin: '0 auto', padding: '24px 16px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>
            Daily Challenge
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
            When did this happen?
          </h1>
        </div>

        {/* Streak */}
        <DailyStreak streak={streak} />

        {/* Hints */}
        <HintsPanel
          guessCount={game.guesses.length}
          challenge={challenge}
          revealYear={reveal?.year_approx ?? null}
          isBce={reveal?.is_bce ?? false}
        />

        {/* Guess rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: MAX_GUESSES }, (_, i) => (
            <GuessRow
              key={i}
              index={i}
              guess={game.guesses[i] ?? null}
              isActive={i === activeIndex}
              inputValue={inputValue}
              onInput={setInputValue}
              onSubmit={handleGuess}
              isBce={reveal?.is_bce ?? false}
            />
          ))}
        </div>

        {/* Result */}
        <AnimatePresence>
          {game.completed && (
            <DailyResult
              game={game}
              challenge={challenge}
              streak={streak}
              onShare={handleShare}
            />
          )}
        </AnimatePresence>

        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: 'center', padding: '8px 16px', borderRadius: 8,
              backgroundColor: '#22c55e33', color: '#22c55e',
              fontSize: 13, fontWeight: 600,
            }}
          >
            Copied to clipboard!
          </motion.div>
        )}

        {/* Past challenges */}
        {challenge && <PastChallenges streak={streak} currentDay={challenge.day_number} />}
      </div>
    </div>
  );
}
