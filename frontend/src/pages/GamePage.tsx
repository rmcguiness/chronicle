/**
 * GamePage — "Guess the Year" history quiz.
 *
 * Players see an event title, guess the year, and score points based on accuracy.
 * Session runs for 10 rounds, then shows a summary with letter grade.
 */
import '../game.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGameEvent, fetchGameReveal, type GameEvent, type GameReveal } from '../api/client';

// ── Constants ────────────────────────────────────────────────────────────────

const ROUNDS_PER_GAME = 10;
const MAX_SCORE_PER_ROUND = 1000;
const MAX_TOTAL = ROUNDS_PER_GAME * MAX_SCORE_PER_ROUND;

type Difficulty = 'easy' | 'medium' | 'hard' | 'random';

interface RoundResult {
  title: string;
  slug: string;
  guess: number;
  actual: number;
  score: number;
  diff: number;
}

interface HighScore {
  score: number;
  grade: string;
  avgError: number;
  date: string;
}

// ── Scoring ──────────────────────────────────────────────────────────────────

/** Calculate score for a guess based on year difference. */
function calcScore(diff: number): { score: number; label: string } {
  const d = Math.abs(diff);
  if (d === 0) return { score: 1000, label: 'EXACT! \u{1F3C6}' };
  if (d <= 1) return { score: 900, label: '\u2B50\u2B50\u2B50' };
  if (d <= 5) return { score: 750, label: '\u2B50\u2B50\u2B50' };
  if (d <= 10) return { score: 600, label: '\u2B50\u2B50' };
  if (d <= 25) return { score: 450, label: '\u2B50\u2B50' };
  if (d <= 50) return { score: 300, label: '\u2B50' };
  if (d <= 100) return { score: 150, label: '\u2B50' };
  if (d <= 500) return { score: 50, label: '' };
  return { score: 0, label: '' };
}

/** Letter grade from total score. */
function getGrade(total: number): string {
  const pct = total / MAX_TOTAL;
  if (pct >= 0.95) return 'S';
  if (pct >= 0.85) return 'A';
  if (pct >= 0.70) return 'B';
  if (pct >= 0.50) return 'C';
  return 'D';
}

/** Format a year for display (negative = BCE). */
function fmtYear(y: number): string {
  if (y < 0) return `${Math.abs(y)} BCE`;
  if (y === 0) return '1 BCE';
  return `${y} CE`;
}

/** Difficulty indicator from importance_score. */
function difficultyBadge(score: number): { emoji: string; text: string } {
  if (score > 0.8) return { emoji: '\u{1F7E2}', text: 'Easy' };
  if (score >= 0.5) return { emoji: '\u{1F7E1}', text: 'Medium' };
  return { emoji: '\u{1F534}', text: 'Hard' };
}

/** Category display name. */
function categoryLabel(cat: string | null): string {
  if (!cat) return 'Historical Event';
  const map: Record<string, string> = {
    war: 'Military Event',
    discovery: 'Scientific Discovery',
    political: 'Political Event',
    cultural: 'Cultural Event',
    natural: 'Natural Event',
    person: 'Notable Person',
  };
  return map[cat] ?? 'Historical Event';
}

// ── localStorage helpers ────────────────────────────────────────────────────

const LS_KEY_SCORES = 'chronicle-game-highscores';
const LS_KEY_BEST_STREAK = 'chronicle-game-best-streak';

function loadHighScores(): HighScore[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY_SCORES) ?? '[]');
  } catch {
    return [];
  }
}

function saveHighScore(entry: HighScore): HighScore[] {
  const scores = loadHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem(LS_KEY_SCORES, JSON.stringify(top10));
  return top10;
}

function loadBestStreak(): number {
  return parseInt(localStorage.getItem(LS_KEY_BEST_STREAK) ?? '0', 10);
}

function saveBestStreak(streak: number): void {
  const best = loadBestStreak();
  if (streak > best) localStorage.setItem(LS_KEY_BEST_STREAK, String(streak));
}

// ── Component ────────────────────────────────────────────────────────────────

export default function GamePage() {
  // Game state
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(loadBestStreak);
  const [gameOver, setGameOver] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>(loadHighScores);

  // Current round state
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [guess, setGuess] = useState('');
  const [reveal, setReveal] = useState<GameReveal | null>(null);
  const [roundScore, setRoundScore] = useState<{ score: number; label: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Derived stats
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalError = results.reduce((sum, r) => sum + Math.abs(r.diff), 0);
  const avgError = results.length > 0 ? Math.round(totalError / results.length) : 0;

  // ── Load next event ─────────────────────────────────────────────────────

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReveal(null);
    setRoundScore(null);
    setGuess('');
    setAnimatedScore(0);
    try {
      const event = await fetchGameEvent(difficulty);
      setCurrentEvent(event);
    } catch {
      setError('Failed to load event. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  // Load first event on mount / difficulty change
  useEffect(() => {
    if (!gameOver) loadEvent();
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus input when event loads
  useEffect(() => {
    if (currentEvent && !reveal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentEvent, reveal]);

  // Animate score counter
  useEffect(() => {
    if (!roundScore) return;
    const target = roundScore.score;
    if (target === 0) { setAnimatedScore(0); return; }
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimatedScore(current);
      if (current >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [roundScore]);

  // ── Submit guess ────────────────────────────────────────────────────────

  const submitGuess = async () => {
    if (!currentEvent || guess === '') return;
    const guessYear = parseInt(guess, 10);
    if (isNaN(guessYear)) return;

    setLoading(true);
    try {
      const data = await fetchGameReveal(currentEvent.slug);
      setReveal(data);

      const diff = guessYear - data.year_approx;
      const scoring = calcScore(diff);
      setRoundScore(scoring);

      const result: RoundResult = {
        title: currentEvent.title,
        slug: currentEvent.slug,
        guess: guessYear,
        actual: data.year_approx,
        score: scoring.score,
        diff,
      };
      const newResults = [...results, result];
      setResults(newResults);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        saveBestStreak(newStreak);
      }

      // Check if game is over
      if (newResults.length >= ROUNDS_PER_GAME) {
        const total = newResults.reduce((s, r) => s + r.score, 0);
        const err = newResults.reduce((s, r) => s + Math.abs(r.diff), 0);
        const grade = getGrade(total);
        const updated = saveHighScore({
          score: total,
          grade,
          avgError: Math.round(err / newResults.length),
          date: new Date().toISOString().split('T')[0],
        });
        setHighScores(updated);
        // Delay showing game over so player sees last reveal
      }
    } catch {
      setError('Failed to reveal. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const nextRound = () => {
    if (results.length >= ROUNDS_PER_GAME) {
      setGameOver(true);
      return;
    }
    setRound(round + 1);
    loadEvent();
  };

  const resetGame = () => {
    setRound(0);
    setResults([]);
    setStreak(0);
    setGameOver(false);
    setReveal(null);
    setRoundScore(null);
    setGuess('');
    setAnimatedScore(0);
    loadEvent();
  };

  const shareScore = () => {
    const total = results.reduce((s, r) => s + r.score, 0);
    const text = `I scored ${total}/${MAX_TOTAL} on Chronicle History Challenge! Can you beat me?`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (reveal) nextRound();
      else submitGuess();
    }
  };

  // ── Render: Game Over ───────────────────────────────────────────────────

  if (gameOver) {
    const total = results.reduce((s, r) => s + r.score, 0);
    const grade = getGrade(total);
    const bestRound = results.reduce((best, r) => r.score > best.score ? r : best, results[0]);
    const worstRound = results.reduce((worst, r) => r.score < worst.score ? r : worst, results[0]);

    return (
      <div className="min-h-screen bg-[#070e22] text-slate-100 font-[Inter,sans-serif]">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800/60 rounded-2xl p-8 border border-slate-700/50 text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <div className="text-7xl font-black my-6">{grade}</div>
            <p className="text-2xl font-semibold text-amber-400 mb-1">{total} / {MAX_TOTAL}</p>
            <p className="text-slate-400 mb-6">Average error: {avgError} years</p>

            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Best Round</p>
                <p className="font-semibold text-green-400 truncate">{bestRound.title}</p>
                <p className="text-sm text-slate-400">{bestRound.score} pts (off by {Math.abs(bestRound.diff)})</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Worst Round</p>
                <p className="font-semibold text-red-400 truncate">{worstRound.title}</p>
                <p className="text-sm text-slate-400">{worstRound.score} pts (off by {Math.abs(worstRound.diff)})</p>
              </div>
            </div>

            {/* Round-by-round breakdown */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">All Rounds</h3>
              <div className="space-y-1">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-slate-900/30 rounded px-3 py-1.5">
                    <span className="text-slate-500 w-6 text-right">{i + 1}.</span>
                    <span className="flex-1 truncate text-left">{r.title}</span>
                    <span className="text-slate-500">{fmtYear(r.guess)} → {fmtYear(r.actual)}</span>
                    <span className={`font-mono w-16 text-right ${r.score >= 600 ? 'text-green-400' : r.score >= 150 ? 'text-amber-400' : 'text-red-400'}`}>
                      +{r.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                Play Again
              </button>
              <button
                onClick={shareScore}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-semibold transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Share Score'}
              </button>
            </div>
          </motion.div>

          <HighScoreTable scores={highScores} />
        </div>
      </div>
    );
  }

  // ── Render: Main Game ───────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#070e22] text-slate-100 font-[Inter,sans-serif]">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Score Panel */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <div className="flex gap-4">
            <Stat label="Score" value={String(totalScore)} />
            <Stat label="Round" value={`${Math.min(results.length + 1, ROUNDS_PER_GAME)} / ${ROUNDS_PER_GAME}`} />
            <Stat label="Streak" value={String(streak)} />
            <Stat label="Best Streak" value={String(bestStreak)} />
            {results.length > 0 && <Stat label="Avg Error" value={`${avgError}y`} />}
          </div>
          <DifficultySelector value={difficulty} onChange={(d) => { setDifficulty(d); setRound(0); setResults([]); setStreak(0); setGameOver(false); }} />
        </div>

        {/* Game Card */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/30 border border-red-800 rounded-2xl p-8 text-center"
            >
              <p className="text-red-300 text-lg">{error}</p>
              <button onClick={loadEvent} className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg transition-colors cursor-pointer">
                Retry
              </button>
            </motion.div>
          ) : loading && !currentEvent ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/60 rounded-2xl p-16 text-center"
            >
              <div className="text-2xl animate-pulse text-slate-400">Loading event...</div>
            </motion.div>
          ) : currentEvent ? (
            <motion.div
              key={currentEvent.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden"
            >
              {/* Event Header */}
              <div className="p-8 pb-6">
                <div className="flex items-center gap-3 mb-4 justify-center">
                  <span className="px-3 py-1 bg-slate-700/60 rounded-full text-xs font-medium text-slate-300">
                    {categoryLabel(currentEvent.category)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {difficultyBadge(currentEvent.importance_score).emoji}{' '}
                    {difficultyBadge(currentEvent.importance_score).text}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight">
                  {currentEvent.title}
                </h2>
              </div>

              {/* Input / Reveal Area */}
              {!reveal ? (
                <div className="px-8 pb-8">
                  <div className="flex gap-3 max-w-md mx-auto">
                    <input
                      ref={inputRef}
                      type="number"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter year (negative = BCE)"
                      className="flex-1 bg-slate-900/80 border border-slate-600 rounded-xl px-4 py-3 text-lg text-center font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={loading}
                    />
                    <button
                      onClick={submitGuess}
                      disabled={loading || guess === ''}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      Guess!
                    </button>
                  </div>
                </div>
              ) : (
                <ResultReveal
                  reveal={reveal}
                  guess={parseInt(guess, 10)}
                  roundScore={roundScore!}
                  animatedScore={animatedScore}
                  isLastRound={results.length >= ROUNDS_PER_GAME}
                  onNext={nextRound}
                />
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* High Scores */}
        {highScores.length > 0 && !reveal && (
          <HighScoreTable scores={highScores} />
        )}
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

/** Top navigation bar. */
function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors text-sm">
        &larr; Chronicle
      </Link>
      <h1 className="text-lg font-semibold">
        <span className="mr-2">{'\u{1F3AE}'}</span>Guess the Year
      </h1>
      <div className="w-20" />
    </nav>
  );
}

/** Small stat chip for the score panel. */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-800/80 rounded-lg px-3 py-2 text-center min-w-[70px]">
      <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

/** Difficulty selector buttons. */
function DifficultySelector({ value, onChange }: { value: Difficulty; onChange: (d: Difficulty) => void }) {
  const options: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: '\u{1F7E2} Easy' },
    { key: 'medium', label: '\u{1F7E1} Medium' },
    { key: 'hard', label: '\u{1F534} Hard' },
    { key: 'random', label: '\u{1F3B2} Random' },
  ];
  return (
    <div className="flex gap-1 bg-slate-900/60 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            value === opt.key
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Result reveal section after guess. */
function ResultReveal({
  reveal,
  guess,
  roundScore,
  animatedScore,
  isLastRound,
  onNext,
}: {
  reveal: GameReveal;
  guess: number;
  roundScore: { score: number; label: string };
  animatedScore: number;
  isLastRound: boolean;
  onNext: () => void;
}) {
  const diff = guess - reveal.year_approx;
  const absDiff = Math.abs(diff);
  const summary = reveal.article_summary
    ? reveal.article_summary.length > 150
      ? reveal.article_summary.slice(0, 150) + '...'
      : reveal.article_summary
    : null;

  // Timeline visualization: scale diff to a bar position
  const maxRange = Math.max(100, absDiff * 2);
  const guessPct = 50 + (diff / maxRange) * 50;
  const clampedPct = Math.max(5, Math.min(95, guessPct));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-8 pb-8 space-y-5"
    >
      {/* Actual year + diff */}
      <div className="text-center">
        <div className="text-sm text-slate-400 mb-1">The answer is</div>
        <div className="text-5xl font-black text-amber-400">{fmtYear(reveal.year_approx)}</div>
        <div className="mt-2 text-slate-400">
          Your guess: <span className="text-white font-semibold">{fmtYear(guess)}</span>
          {' — '}
          <span className={absDiff === 0 ? 'text-green-400 font-bold' : absDiff <= 10 ? 'text-green-400' : absDiff <= 100 ? 'text-amber-400' : 'text-red-400'}>
            {absDiff === 0 ? 'Perfect!' : `off by ${absDiff} year${absDiff === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <motion.div
          className="text-4xl font-black"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
        >
          <span className={animatedScore >= 600 ? 'text-green-400' : animatedScore >= 150 ? 'text-amber-400' : 'text-red-400'}>
            +{animatedScore}
          </span>
        </motion.div>
        {roundScore.label && <div className="text-lg mt-1">{roundScore.label}</div>}
      </div>

      {/* Timeline bar */}
      <div className="relative h-8 bg-slate-900/60 rounded-full overflow-hidden">
        {/* Actual year marker (center) */}
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-amber-400/60" />
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-amber-400 font-mono">
          {fmtYear(reveal.year_approx)}
        </div>
        {/* Guess marker */}
        <motion.div
          className="absolute top-0 h-full w-1 bg-indigo-400 rounded-full"
          initial={{ left: '50%' }}
          animate={{ left: `${clampedPct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        />
        <motion.div
          className="absolute bottom-1 -translate-x-1/2 text-[10px] text-indigo-300 font-mono"
          initial={{ left: '50%' }}
          animate={{ left: `${clampedPct}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {fmtYear(guess)}
        </motion.div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-slate-400 text-center italic">{summary}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to={`/?event=${reveal.slug}`}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-colors"
        >
          Learn more
        </Link>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors cursor-pointer"
        >
          {isLastRound ? 'See Results' : 'Next Event →'}
        </button>
      </div>
    </motion.div>
  );
}

/** High scores table. */
function HighScoreTable({ scores }: { scores: HighScore[] }) {
  if (scores.length === 0) return null;
  return (
    <div className="mt-8 bg-slate-800/40 rounded-xl p-5 border border-slate-700/30">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Best Scores</h3>
      <div className="space-y-1">
        {scores.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-sm py-1.5 px-2 rounded hover:bg-slate-800/60">
            <span className="text-slate-500 w-5 text-right font-mono">{i + 1}.</span>
            <span className="text-2xl w-8 text-center font-black">{s.grade}</span>
            <span className="flex-1 font-semibold">{s.score} pts</span>
            <span className="text-slate-500">~{s.avgError}y avg error</span>
            <span className="text-slate-600 text-xs">{s.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
