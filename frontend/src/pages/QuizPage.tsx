/**
 * /quiz — Interactive history quiz with multiple-choice questions
 * generated from real Chronicle database events.
 *
 * Three screens: Landing → Quiz → Results
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

// ── Types ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  event_slug: string | null;
}

type Screen = 'landing' | 'quiz' | 'results';
type Era = 'all' | 'ancient' | 'medieval' | 'modern' | 'contemporary';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizAnswer {
  questionIndex: number;
  selectedIndex: number;
  correct: boolean;
}

// ── Styles ───────────────────────────────────────────────────────────────────

const PAGE: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #070e22 0%, #0c1631 40%, #111827 100%)',
  color: '#e2e8f0',
  fontFamily: "'Inter', system-ui, sans-serif",
  overflowX: 'hidden',
};

const CONTAINER: React.CSSProperties = {
  maxWidth: 800,
  margin: '0 auto',
  padding: '0 24px 80px',
};

const CARD: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.7)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
  overflow: 'hidden',
};

const BTN_BASE: React.CSSProperties = {
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 600,
  transition: 'all 0.2s',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const ERA_LABELS: Record<Era, string> = {
  all: 'All Eras',
  ancient: 'Ancient',
  medieval: 'Medieval',
  modern: 'Modern',
  contemporary: 'Contemporary',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: '#34d399',
  medium: '#fbbf24',
  hard: '#f87171',
};

const BADGES = [
  { min: 0, max: 40, label: 'Apprentice', icon: '📜', color: '#94a3b8' },
  { min: 41, max: 70, label: 'Scholar', icon: '📚', color: '#60a5fa' },
  { min: 71, max: 90, label: 'Historian', icon: '🏛️', color: '#a78bfa' },
  { min: 91, max: 100, label: 'Chronicle Master', icon: '👑', color: '#fbbf24' },
];

function getBadge(pct: number) {
  return BADGES.find(b => pct >= b.min && pct <= b.max) || BADGES[0];
}

function getBestScore(era: string, difficulty: string, count: number): number | null {
  try {
    const key = `chronicle_quiz_best_${era}_${difficulty}_${count}`;
    const val = localStorage.getItem(key);
    return val !== null ? Number(val) : null;
  } catch { return null; }
}

function saveBestScore(era: string, difficulty: string, count: number, score: number) {
  try {
    const key = `chronicle_quiz_best_${era}_${difficulty}_${count}`;
    const prev = getBestScore(era, difficulty, count);
    if (prev === null || score > prev) {
      localStorage.setItem(key, String(score));
    }
  } catch { /* ignore */ }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── NavBar ───────────────────────────────────────────────────────────────────

function NavBar() {
  const navigate = useNavigate();
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px',
      background: 'rgba(7,14,34,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', color: '#94a3b8',
          cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <span style={{ fontSize: 18 }}>&larr;</span> Back to Timeline
      </button>
      <h1 style={{
        margin: 0, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 700,
        background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '0.04em',
      }}>
        History Quiz
      </h1>
      <div style={{ width: 100 }} />
    </nav>
  );
}

// ── Landing Screen ───────────────────────────────────────────────────────────

function LandingScreen({
  onStart,
}: {
  onStart: (era: Era, difficulty: Difficulty, count: number) => void;
}) {
  const [era, setEra] = useState<Era>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState<number>(10);

  const best = getBestScore(era, difficulty, count);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ ...CONTAINER, paddingTop: 60, textAlign: 'center' }}
    >
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏛️</div>
      <h2 style={{
        fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800,
        margin: '0 0 12px', letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        History Quiz
      </h2>
      <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 48, maxWidth: 500, margin: '0 auto 48px' }}>
        Test your knowledge of world history with questions drawn from real historical events.
      </p>

      <div style={{ ...CARD, padding: '32px 28px', maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
        {/* Era selector */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 8 }}>
            Era
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(Object.keys(ERA_LABELS) as Era[]).map(e => (
              <button
                key={e}
                onClick={() => setEra(e)}
                style={{
                  ...BTN_BASE,
                  padding: '8px 16px', fontSize: 13,
                  background: era === e ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.04)',
                  color: era === e ? '#60a5fa' : '#94a3b8',
                  border: `1px solid ${era === e ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {ERA_LABELS[e]}
              </button>
            ))}
          </div>
        </label>

        {/* Difficulty selector */}
        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 8 }}>
            Difficulty
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  ...BTN_BASE,
                  padding: '8px 16px', fontSize: 13, flex: 1,
                  background: difficulty === d ? `${DIFFICULTY_COLORS[d]}20` : 'rgba(255,255,255,0.04)',
                  color: difficulty === d ? DIFFICULTY_COLORS[d] : '#94a3b8',
                  border: `1px solid ${difficulty === d ? `${DIFFICULTY_COLORS[d]}40` : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </label>

        {/* Question count */}
        <label style={{ display: 'block', marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: 8 }}>
            Questions
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[5, 10, 20].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                style={{
                  ...BTN_BASE,
                  padding: '8px 16px', fontSize: 13, flex: 1,
                  background: count === n ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                  color: count === n ? '#a78bfa' : '#94a3b8',
                  border: `1px solid ${count === n ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </label>

        {/* Best score */}
        {best !== null && (
          <div style={{
            textAlign: 'center', marginBottom: 20,
            fontSize: 13, color: '#94a3b8',
          }}>
            Best score: <span style={{ color: '#fbbf24', fontWeight: 700 }}>{best}%</span>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => onStart(era, difficulty, count)}
          style={{
            ...BTN_BASE,
            width: '100%', padding: '14px 24px', fontSize: 16,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Start Quiz
        </button>
      </div>
    </motion.div>
  );
}

// ── Quiz Screen ──────────────────────────────────────────────────────────────

function QuizScreen({
  questions,
  onFinish,
}: {
  questions: QuizQuestion[];
  onFinish: (answers: QuizAnswer[], elapsed: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const navigate = useNavigate();

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex) / total) * 100;

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleSelect = useCallback((idx: number) => {
    if (selectedIndex !== null) return; // already answered
    setSelectedIndex(idx);
    setShowExplanation(true);
    const correct = idx === question.correctIndex;
    setAnswers(prev => [...prev, { questionIndex: currentIndex, selectedIndex: idx, correct }]);
  }, [selectedIndex, question, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      clearInterval(timerRef.current);
      const finalAnswers = answers;
      onFinish(finalAnswers, elapsed);
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedIndex(null);
      setShowExplanation(false);
    }
  }, [currentIndex, total, answers, elapsed, onFinish]);

  const optionColor = (idx: number) => {
    if (selectedIndex === null) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#e2e8f0' };
    if (idx === question.correctIndex) return { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.5)', text: '#34d399' };
    if (idx === selectedIndex) return { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.5)', text: '#f87171' };
    return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', text: '#64748b' };
  };

  const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ ...CONTAINER, paddingTop: 32 }}
    >
      {/* Progress bar + timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          flex: 1, height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}>
          <motion.div
            style={{
              height: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span style={{ fontSize: 13, color: '#94a3b8', whiteSpace: 'nowrap' }}>
          {currentIndex + 1} / {total}
        </span>
        <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
          {formatTime(elapsed)}
        </span>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ ...CARD, padding: '32px 28px', marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: '#64748b', marginBottom: 12,
            }}>
              {question.type === 'year' && 'Date Question'}
              {question.type === 'category' && 'Category Question'}
              {question.type === 'what_happened' && 'Event Question'}
              {question.type === 'person' && 'People Question'}
            </div>
            <h3 style={{
              margin: 0, fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700,
              lineHeight: 1.3, letterSpacing: '-0.01em',
            }}>
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {question.options.map((opt, idx) => {
              const colors = optionColor(idx);
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  whileHover={selectedIndex === null ? { scale: 1.01 } : {}}
                  whileTap={selectedIndex === null ? { scale: 0.99 } : {}}
                  style={{
                    ...BTN_BASE,
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 20px', fontSize: 15, fontWeight: 500,
                    textAlign: 'left', width: '100%',
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    color: colors.text,
                    cursor: selectedIndex === null ? 'pointer' : 'default',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: selectedIndex !== null && idx === question.correctIndex
                      ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
                    color: selectedIndex !== null && idx === question.correctIndex
                      ? '#34d399' : '#94a3b8',
                  }}>
                    {OPTION_LETTERS[idx]}
                  </span>
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  ...CARD, padding: '16px 20px', marginBottom: 20,
                  borderColor: 'rgba(96,165,250,0.2)',
                  background: 'rgba(96,165,250,0.06)',
                }}
              >
                <p style={{ margin: 0, fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
                  {question.explanation}
                </p>
                {question.event_slug && (
                  <button
                    onClick={() => navigate(`/event/${question.event_slug}`)}
                    style={{
                      ...BTN_BASE, marginTop: 8,
                      padding: '4px 0', fontSize: 12,
                      background: 'none', color: '#60a5fa',
                    }}
                  >
                    View event details &rarr;
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selectedIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
              <button
                onClick={handleNext}
                style={{
                  ...BTN_BASE,
                  padding: '12px 40px', fontSize: 15,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: '#fff',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  questions,
  answers,
  elapsed,
  era,
  difficulty,
  count,
  onPlayAgain,
}: {
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  elapsed: number;
  era: string;
  difficulty: string;
  count: number;
  onPlayAgain: () => void;
}) {
  const correct = answers.filter(a => a.correct).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const badge = getBadge(pct);

  useEffect(() => {
    saveBestScore(era, difficulty, count, pct);
  }, [era, difficulty, count, pct]);

  const handleShare = useCallback(() => {
    const text = `I scored ${correct}/${total} (${pct}%) on the Chronicle History Quiz! ${badge.icon} ${badge.label}\n\nTry it: ${window.location.origin}/quiz`;
    if (navigator.share) {
      navigator.share({ title: 'Chronicle Quiz Score', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }, [correct, total, pct, badge]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ ...CONTAINER, paddingTop: 48 }}
    >
      {/* Score display */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>{badge.icon}</div>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800,
          margin: '0 0 4px', color: badge.color,
        }}>
          {badge.label}
        </h2>
        <div style={{
          fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 800,
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1.1, margin: '8px 0',
        }}>
          {correct} / {total}
        </div>
        <div style={{ fontSize: 20, color: '#94a3b8', marginBottom: 8 }}>
          {pct}% correct
        </div>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          Completed in {formatTime(elapsed)}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 40 }}>
        <button
          onClick={onPlayAgain}
          style={{
            ...BTN_BASE,
            padding: '12px 28px', fontSize: 15,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: '#fff',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          style={{
            ...BTN_BASE,
            padding: '12px 28px', fontSize: 15,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Share Score
        </button>
      </div>

      {/* Question review list */}
      <div style={{ ...CARD, padding: '24px 20px' }}>
        <h3 style={{
          margin: '0 0 20px', fontSize: 14, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8',
        }}>
          Question Review
        </h3>
        {questions.map((q, i) => {
          const answer = answers[i];
          const isCorrect = answer?.correct;
          return (
            <div
              key={q.id}
              style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                alignItems: 'flex-start',
              }}
            >
              <span style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, marginTop: 2,
                background: isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                color: isCorrect ? '#34d399' : '#f87171',
              }}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, lineHeight: 1.4 }}>
                  {q.question}
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  {isCorrect
                    ? `Correct: ${q.options[q.correctIndex]}`
                    : `Your answer: ${q.options[answer?.selectedIndex ?? 0]} · Correct: ${q.options[q.correctIndex]}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({ era: 'all' as Era, difficulty: 'medium' as Difficulty, count: 10 });

  const handleStart = useCallback(async (era: Era, difficulty: Difficulty, count: number) => {
    setSettings({ era, difficulty, count });
    setLoading(true);
    setError(null);
    try {
      const resp = await axios.get<QuizQuestion[]>(`${BASE_URL}/api/quiz`, {
        params: { era, difficulty, count },
        timeout: 10000,
      });
      if (!resp.data.length) {
        setError('No questions available for this combination. Try different settings.');
        setLoading(false);
        return;
      }
      setQuestions(resp.data);
      setAnswers([]);
      setElapsed(0);
      setScreen('quiz');
    } catch {
      setError('Failed to load quiz. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFinish = useCallback((ans: QuizAnswer[], time: number) => {
    setAnswers(ans);
    setElapsed(time);
    setScreen('results');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setScreen('landing');
    setQuestions([]);
    setAnswers([]);
  }, []);

  return (
    <div style={PAGE}>
      <NavBar />

      {loading && (
        <div style={{ textAlign: 'center', paddingTop: 80 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(96,165,250,0.2)',
              borderTopColor: '#60a5fa',
              margin: '0 auto 16px',
            }}
          />
          <div style={{ color: '#94a3b8', fontSize: 14 }}>Generating quiz...</div>
        </div>
      )}

      {error && (
        <div style={{ ...CONTAINER, paddingTop: 48, textAlign: 'center' }}>
          <div style={{
            ...CARD, padding: '24px 20px', display: 'inline-block',
            borderColor: 'rgba(248,113,113,0.2)',
          }}>
            <p style={{ margin: 0, color: '#f87171', fontSize: 14 }}>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && screen === 'landing' && (
        <LandingScreen onStart={handleStart} />
      )}

      {!loading && screen === 'quiz' && (
        <QuizScreen questions={questions} onFinish={handleFinish} />
      )}

      {screen === 'results' && (
        <ResultsScreen
          questions={questions}
          answers={answers}
          elapsed={elapsed}
          era={settings.era}
          difficulty={settings.difficulty}
          count={settings.count}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
