/**
 * ConnectionsPage — Historical Connections puzzle game.
 *
 * Route: /connections
 *
 * NYT Connections-style game: group 16 historical events into 4 categories
 * of 4 based on hidden themes. Uses real Chronicle event data.
 *
 * Features:
 *  - 5 pre-built puzzles with real historical events
 *  - 4×4 tile grid with selection, shake, and reveal animations
 *  - Mistake tracking (max 4), win/loss states
 *  - Shareable emoji result grid
 *  - localStorage persistence for completed puzzles & scores
 *  - Daily puzzle mode (cycles through puzzles by date)
 *  - How-to-play modal on first visit
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Difficulty tier for a group within a puzzle. */
type Difficulty = 'yellow' | 'green' | 'blue' | 'purple';

/** A single group of 4 events sharing a hidden theme. */
interface PuzzleGroup {
  /** The hidden theme name revealed on correct guess. */
  theme: string;
  /** Difficulty color tier. */
  difficulty: Difficulty;
  /** Exactly 4 event titles. */
  events: [string, string, string, string];
}

/** A complete puzzle with 4 groups (16 events total). */
interface Puzzle {
  /** Puzzle display name. */
  title: string;
  /** Difficulty label for the puzzle selector. */
  level: 'Beginner' | 'Intermediate' | 'Expert';
  /** Exactly 4 groups. */
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
}

/** Saved progress for a completed puzzle. */
interface PuzzleResult {
  /** Puzzle index (0-based). */
  puzzleIndex: number;
  /** Number of mistakes made (0–4). */
  mistakes: number;
  /** Whether the player won. */
  won: boolean;
  /** Order groups were solved in (by difficulty). */
  solveOrder: Difficulty[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
};

const DIFFICULTY_BG: Record<Difficulty, string> = {
  yellow: 'rgba(234, 179, 8, 0.15)',
  green: 'rgba(34, 197, 94, 0.15)',
  blue: 'rgba(59, 130, 246, 0.15)',
  purple: 'rgba(168, 85, 247, 0.15)',
};

const DIFFICULTY_EMOJI: Record<Difficulty, string> = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪',
};

const DIFFICULTY_ORDER: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];

const MAX_MISTAKES = 4;
const TILES_PER_GROUP = 4;

const STORAGE_KEY_RESULTS = 'chronicle_connections_results';
const STORAGE_KEY_SEEN_HOWTO = 'chronicle_connections_seen_howto';

/** Pre-built puzzles using real Chronicle historical events. */
const PUZZLES: Puzzle[] = [
  {
    title: 'Empires that Fell',
    level: 'Beginner',
    groups: [
      {
        theme: 'Fell in the 5th Century',
        difficulty: 'yellow',
        events: [
          'Fall of Rome (476)',
          'Sack of Rome by Vandals',
          'Fall of the Western Roman Empire',
          'Collapse of the Hunnic Empire',
        ],
      },
      {
        theme: 'Conquered by Mongols',
        difficulty: 'green',
        events: [
          'Fall of the Abbasid Caliphate',
          'Mongol Conquest of Song Dynasty',
          'Destruction of Kievan Rus',
          'Siege of Baghdad (1258)',
        ],
      },
      {
        theme: 'Ended by Napoleon',
        difficulty: 'blue',
        events: [
          'Dissolution of the Holy Roman Empire',
          'Fall of the Venetian Republic',
          'End of the Papal States',
          'Collapse of the Spanish Bourbons',
        ],
      },
      {
        theme: 'Lasted Less than 15 Years',
        difficulty: 'purple',
        events: [
          'Empire of Maximilian in Mexico',
          'Central Powers Alliance',
          'Confederate States of America',
          'Reign of the Hundred Days',
        ],
      },
    ],
  },
  {
    title: 'Scientific Firsts',
    level: 'Beginner',
    groups: [
      {
        theme: 'Astronomy Discoveries',
        difficulty: 'yellow',
        events: [
          'Copernicus Proposes Heliocentrism',
          'Galileo Observes Jupiter\'s Moons',
          'Newton Publishes Principia',
          'Hubble Discovers Galaxies Beyond Milky Way',
        ],
      },
      {
        theme: 'Medical Breakthroughs',
        difficulty: 'green',
        events: [
          'Pasteur\'s Germ Theory of Disease',
          'Discovery of Penicillin',
          'Jenner\'s Smallpox Vaccination',
          'Röntgen Discovers X-rays',
        ],
      },
      {
        theme: 'Physics Revolutions',
        difficulty: 'blue',
        events: [
          'Einstein\'s Special Relativity',
          'Planck Launches Quantum Mechanics',
          'First Nuclear Fission Achieved',
          'Lemaître Proposes the Big Bang',
        ],
      },
      {
        theme: 'Computer Milestones',
        difficulty: 'purple',
        events: [
          'ENIAC Becomes Operational',
          'ARPANET First Message Sent',
          'Tim Berners-Lee Invents the Web',
          'First Transistor at Bell Labs',
        ],
      },
    ],
  },
  {
    title: 'Revolutions',
    level: 'Intermediate',
    groups: [
      {
        theme: 'Inspired by Enlightenment Ideas',
        difficulty: 'yellow',
        events: [
          'American Revolution (1776)',
          'French Revolution (1789)',
          'Haitian Revolution (1791)',
          'Latin American Independence Wars',
        ],
      },
      {
        theme: 'Communist Revolutions',
        difficulty: 'green',
        events: [
          'Russian October Revolution (1917)',
          'Chinese Communist Revolution',
          'Cuban Revolution (1959)',
          'Vietnamese August Revolution',
        ],
      },
      {
        theme: 'Ended a Monarchy',
        difficulty: 'blue',
        events: [
          'English Civil War Execution of Charles I',
          'Fall of the Ottoman Sultanate',
          'Abolition of the Brazilian Monarchy',
          'Iranian Revolution (1979)',
        ],
      },
      {
        theme: 'Primarily Non-violent',
        difficulty: 'purple',
        events: [
          'Indian Independence Movement',
          'Velvet Revolution in Czechoslovakia',
          'Fall of the Berlin Wall',
          'Philippine People Power Revolution',
        ],
      },
    ],
  },
  {
    title: 'Ancient Wonders',
    level: 'Intermediate',
    groups: [
      {
        theme: 'Built in Ancient Egypt',
        difficulty: 'yellow',
        events: [
          'Construction of the Great Pyramid',
          'Building of the Sphinx',
          'Founding of Alexandria',
          'Construction of Karnak Temple',
        ],
      },
      {
        theme: 'Greek Golden Age',
        difficulty: 'green',
        events: [
          'Construction of the Parthenon',
          'Socrates Teaches in Athens',
          'First Olympic Games Held',
          'Herodotus Writes the Histories',
        ],
      },
      {
        theme: 'Along the Silk Road',
        difficulty: 'blue',
        events: [
          'Zhang Qian Opens the Silk Road',
          'Construction of Petra',
          'Rise of the Kushan Empire',
          'Founding of Samarkand',
        ],
      },
      {
        theme: 'Destroyed or Lost to Time',
        difficulty: 'purple',
        events: [
          'Burning of the Library of Alexandria',
          'Eruption Buries Pompeii (79 AD)',
          'Collapse of the Colossus of Rhodes',
          'Destruction of the Hanging Gardens',
        ],
      },
    ],
  },
  {
    title: '20th Century Turning Points',
    level: 'Expert',
    groups: [
      {
        theme: 'World War I Triggers',
        difficulty: 'yellow',
        events: [
          'Assassination of Archduke Franz Ferdinand',
          'Sinking of the Lusitania',
          'Zimmermann Telegram Intercepted',
          'Battle of the Somme',
        ],
      },
      {
        theme: 'World War II Decisive Moments',
        difficulty: 'green',
        events: [
          'D-Day Normandy Landings',
          'Atomic Bombing of Hiroshima',
          'Battle of Stalingrad',
          'Attack on Pearl Harbor',
        ],
      },
      {
        theme: 'Cold War Flashpoints',
        difficulty: 'blue',
        events: [
          'Cuban Missile Crisis',
          'Korean War Begins (1950)',
          'Berlin Airlift',
          'Soviet Invasion of Afghanistan',
        ],
      },
      {
        theme: 'Space Race Milestones',
        difficulty: 'purple',
        events: [
          'Sputnik Launch (1957)',
          'Yuri Gagarin First Human in Space',
          'Apollo 11 Moon Landing',
          'Launch of Hubble Space Telescope',
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Load saved puzzle results from localStorage. */
function loadResults(): PuzzleResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    return raw ? (JSON.parse(raw) as PuzzleResult[]) : [];
  } catch {
    return [];
  }
}

/** Save puzzle results to localStorage. */
function saveResult(result: PuzzleResult): void {
  const existing = loadResults();
  const idx = existing.findIndex((r) => r.puzzleIndex === result.puzzleIndex);
  if (idx >= 0) {
    existing[idx] = result;
  } else {
    existing.push(result);
  }
  localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(existing));
}

/** Check if the how-to-play modal has been shown. */
function hasSeenHowTo(): boolean {
  return localStorage.getItem(STORAGE_KEY_SEEN_HOWTO) === '1';
}

/** Mark how-to-play as seen. */
function markHowToSeen(): void {
  localStorage.setItem(STORAGE_KEY_SEEN_HOWTO, '1');
}

/** Get today's daily puzzle index (deterministic by date, cycles through 5). */
function getDailyPuzzleIndex(): number {
  const now = new Date();
  const daysSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % PUZZLES.length;
}

/** Build a shuffled array of all 16 event titles for a puzzle. */
function shuffleEvents(puzzle: Puzzle): string[] {
  const all = puzzle.groups.flatMap((g) => g.events);
  // Fisher-Yates shuffle with seeded-ish randomness
  const shuffled = [...all];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Find which group an event belongs to. */
function findGroup(puzzle: Puzzle, event: string): PuzzleGroup | undefined {
  return puzzle.groups.find((g) => g.events.includes(event));
}

/** Truncate text to maxLen characters with ellipsis. */
function truncate(text: string, maxLen: number): string {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text;
}

/** Generate shareable emoji grid for results. */
function generateShareText(
  puzzleIndex: number,
  mistakes: number,
  solveOrder: Difficulty[],
  won: boolean,
): string {
  const lines: string[] = [
    `Chronicle Connections #${puzzleIndex + 1}`,
  ];

  if (won) {
    const emojis = solveOrder.map((d) => DIFFICULTY_EMOJI[d]).join('');
    lines.push(`${emojis} (${mistakes} mistake${mistakes !== 1 ? 's' : ''})`);
  } else {
    lines.push(`❌ (did not solve)`);
  }

  lines.push('');
  for (const diff of solveOrder) {
    lines.push(Array(4).fill(DIFFICULTY_EMOJI[diff]).join(''));
  }

  lines.push('');
  lines.push('chronicle.app/connections');
  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline keyframes (injected once)
// ─────────────────────────────────────────────────────────────────────────────

let stylesInjected = false;

function injectStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes connections-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    }
    .connections-shake {
      animation: connections-shake 0.5s ease-in-out;
    }
    @keyframes connections-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .connections-pop {
      animation: connections-pop 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** How-to-play overlay modal. */
function HowToPlayModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(7, 14, 34, 0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          padding: '32px 28px',
          maxWidth: 440,
          width: '90vw',
          color: '#f1f5f9',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 700 }}>How to Play</h2>
        <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6, color: '#94a3b8' }}>
          Find four groups of four historical events that share a hidden connection.
        </p>
        <ul style={{ margin: '0 0 16px', paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: '#cbd5e1' }}>
          <li>Select 4 tiles you think belong together, then hit <strong>Submit</strong></li>
          <li>If correct, the group is revealed with its theme</li>
          <li>If wrong, you lose a mistake — you get 4 total</li>
          <li>Find all 4 groups to win!</li>
        </ul>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8' }}>
          <strong>Difficulty:</strong>{' '}
          <span style={{ color: DIFFICULTY_COLORS.yellow }}>🟨 Easiest</span>{' → '}
          <span style={{ color: DIFFICULTY_COLORS.green }}>🟩 Medium</span>{' → '}
          <span style={{ color: DIFFICULTY_COLORS.blue }}>🟦 Hard</span>{' → '}
          <span style={{ color: DIFFICULTY_COLORS.purple }}>🟪 Trickiest</span>
        </p>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px 0',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}

/** Mistake tracker dots. */
function MistakeTracker({ mistakes }: { mistakes: number }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#94a3b8', marginRight: 4 }}>Mistakes:</span>
      {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.2)',
            background: i < mistakes ? '#ef4444' : 'transparent',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

/** Individual event tile in the grid. */
function EventTile({
  title,
  selected,
  shaking,
  disabled,
  onClick,
}: {
  title: string;
  selected: boolean;
  shaking: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      layout
      className={shaking ? 'connections-shake' : ''}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      style={{
        padding: '14px 10px',
        background: selected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.06)',
        border: selected ? '2px solid #3b82f6' : '2px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        color: '#f1f5f9',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        cursor: disabled ? 'default' : 'pointer',
        textAlign: 'center',
        lineHeight: 1.3,
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.2s, border-color 0.2s, opacity 0.2s',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
      }}
    >
      {truncate(title, 32)}
    </motion.button>
  );
}

/** Revealed group banner. */
function GroupBanner({ group }: { group: PuzzleGroup }) {
  const color = DIFFICULTY_COLORS[group.difficulty];
  const bg = DIFFICULTY_BG[group.difficulty];
  const emoji = DIFFICULTY_EMOJI[group.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: bg,
        border: `1px solid ${color}`,
        borderRadius: 12,
        padding: '14px 18px',
        marginBottom: 8,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color, marginBottom: 6 }}>
        {emoji} {group.theme}
      </div>
      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
        {group.events.join(' · ')}
      </div>
    </motion.div>
  );
}

/** Results screen after game ends. */
function ResultsScreen({
  won,
  mistakes,
  puzzle,
  puzzleIndex,
  solveOrder,
  onNextPuzzle,
}: {
  won: boolean;
  mistakes: number;
  puzzle: Puzzle;
  puzzleIndex: number;
  solveOrder: Difficulty[];
  onNextPuzzle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const text = generateShareText(puzzleIndex, mistakes, solveOrder, won);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [puzzleIndex, mistakes, solveOrder, won]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ textAlign: 'center', padding: '20px 0' }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>
        {won ? '🎉 Brilliant!' : '😔 So Close!'}
      </div>
      <p style={{ fontSize: 15, color: '#94a3b8', marginBottom: 24 }}>
        {won
          ? `You solved it with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}!`
          : "Here were the groups:"}
      </p>

      <div style={{ marginBottom: 24 }}>
        {(won ? solveOrder : DIFFICULTY_ORDER).map((diff) => {
          const group = puzzle.groups.find((g) => g.difficulty === diff);
          return group ? <GroupBanner key={diff} group={group} /> : null;
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleShare}
          style={{
            padding: '10px 24px',
            background: copied ? '#22c55e' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {copied ? 'Copied!' : '📋 Share Results'}
        </button>
        <button
          onClick={onNextPuzzle}
          style={{
            padding: '10px 24px',
            background: 'rgba(255,255,255,0.08)',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Play next puzzle →
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

/** ConnectionsPage — the full puzzle game page. */
export default function ConnectionsPage() {
  // Inject CSS keyframes on mount
  useEffect(() => {
    injectStyles();
    // Restore page scrolling (root div is overflow:hidden)
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  // ── State ───────────────────────────────────────────────────────────────
  const [puzzleIndex, setPuzzleIndex] = useState(getDailyPuzzleIndex);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [solvedGroups, setSolvedGroups] = useState<PuzzleGroup[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shaking, setShaking] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [solveOrder, setSolveOrder] = useState<Difficulty[]>([]);
  const [showHowTo, setShowHowTo] = useState(!hasSeenHowTo());
  const [tiles, setTiles] = useState<string[]>([]);

  const puzzle = PUZZLES[puzzleIndex];

  // Shuffle tiles on puzzle change
  useEffect(() => {
    setTiles(shuffleEvents(puzzle));
    setSelected(new Set());
    setSolvedGroups([]);
    setMistakes(0);
    setShaking(new Set());
    setGameOver(false);
    setWon(false);
    setSolveOrder([]);
  }, [puzzleIndex, puzzle]);

  // Initialize tiles on first render
  useEffect(() => {
    if (tiles.length === 0) {
      setTiles(shuffleEvents(puzzle));
    }
  }, [puzzle, tiles.length]);

  // Remaining (unsolved) tiles
  const remainingTiles = useMemo(() => {
    const solvedEvents = new Set(solvedGroups.flatMap((g) => g.events));
    return tiles.filter((t) => !solvedEvents.has(t));
  }, [tiles, solvedGroups]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleTileClick = useCallback(
    (event: string) => {
      if (gameOver) return;
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(event)) {
          next.delete(event);
        } else if (next.size < TILES_PER_GROUP) {
          next.add(event);
        }
        return next;
      });
    },
    [gameOver],
  );

  const handleSubmit = useCallback(() => {
    if (selected.size !== TILES_PER_GROUP || gameOver) return;

    const selectedArr = Array.from(selected);
    const group = findGroup(puzzle, selectedArr[0]);

    // Check if all 4 selected events belong to the same group
    const isCorrect =
      group !== undefined && selectedArr.every((e) => group.events.includes(e));

    if (isCorrect) {
      const newSolved = [...solvedGroups, group];
      const newOrder = [...solveOrder, group.difficulty];
      setSolvedGroups(newSolved);
      setSolveOrder(newOrder);
      setSelected(new Set());

      // Check win condition
      if (newSolved.length === 4) {
        setWon(true);
        setGameOver(true);
        saveResult({ puzzleIndex, mistakes, won: true, solveOrder: newOrder });
      }
    } else {
      // Wrong guess
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setShaking(new Set(selectedArr));
      setTimeout(() => setShaking(new Set()), 500);
      setSelected(new Set());

      // Check lose condition
      if (newMistakes >= MAX_MISTAKES) {
        setGameOver(true);
        setWon(false);
        // Reveal all groups on loss
        const revealOrder = DIFFICULTY_ORDER.filter(
          (d) => !solvedGroups.find((g) => g.difficulty === d),
        );
        const finalOrder = [...solveOrder, ...revealOrder];
        setSolveOrder(finalOrder);
        saveResult({ puzzleIndex, mistakes: newMistakes, won: false, solveOrder: finalOrder });
      }
    }
  }, [selected, puzzle, solvedGroups, solveOrder, mistakes, gameOver, puzzleIndex]);

  const handleDeselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleNextPuzzle = useCallback(() => {
    setPuzzleIndex((prev) => (prev + 1) % PUZZLES.length);
  }, []);

  const handlePrevPuzzle = useCallback(() => {
    setPuzzleIndex((prev) => (prev - 1 + PUZZLES.length) % PUZZLES.length);
  }, []);

  const handleDailyPuzzle = useCallback(() => {
    setPuzzleIndex(getDailyPuzzleIndex());
  }, []);

  const handleCloseHowTo = useCallback(() => {
    setShowHowTo(false);
    markHowToSeen();
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  const levelColors: Record<string, string> = {
    Beginner: '#22c55e',
    Intermediate: '#eab308',
    Expert: '#ef4444',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
        padding: '0 16px 60px',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '16px 0 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Chronicle
        </Link>
        <button
          onClick={() => setShowHowTo(true)}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#94a3b8',
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          ? How to Play
        </button>
      </div>

      {/* Title */}
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '12px 0 4px' }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
          🔗 Historical Connections
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#64748b' }}>
          Group the 16 events into 4 hidden categories
        </p>
      </div>

      {/* Puzzle selector */}
      <div
        style={{
          maxWidth: 600,
          margin: '16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <button
          onClick={handlePrevPuzzle}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: 18,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>
            {puzzle.title}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Puzzle {puzzleIndex + 1} of {PUZZLES.length}
            {' · '}
            <span style={{ color: levelColors[puzzle.level] }}>{puzzle.level}</span>
          </div>
        </div>
        <button
          onClick={handleNextPuzzle}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: 18,
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ›
        </button>
      </div>

      {/* Daily puzzle link */}
      <div style={{ maxWidth: 600, margin: '0 auto 16px', textAlign: 'center' }}>
        <button
          onClick={handleDailyPuzzle}
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#3b82f6',
            borderRadius: 20,
            padding: '5px 16px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📅 Daily Puzzle
        </button>
      </div>

      {/* Main game area */}
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Solved groups (banners) */}
        <AnimatePresence>
          {solvedGroups.map((group) => (
            <GroupBanner key={group.difficulty} group={group} />
          ))}
        </AnimatePresence>

        {/* Game board or results */}
        {gameOver ? (
          <ResultsScreen
            won={won}
            mistakes={mistakes}
            puzzle={puzzle}
            puzzleIndex={puzzleIndex}
            solveOrder={solveOrder}
            onNextPuzzle={handleNextPuzzle}
          />
        ) : (
          <>
            {/* 4×4 grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <AnimatePresence>
                {remainingTiles.map((event) => (
                  <EventTile
                    key={event}
                    title={event}
                    selected={selected.has(event)}
                    shaking={shaking.has(event)}
                    disabled={gameOver}
                    onClick={() => handleTileClick(event)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <MistakeTracker mistakes={mistakes} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleDeselectAll}
                  disabled={selected.size === 0}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.06)',
                    color: selected.size === 0 ? '#475569' : '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: selected.size === 0 ? 'default' : 'pointer',
                  }}
                >
                  Deselect All
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selected.size !== TILES_PER_GROUP}
                  style={{
                    padding: '8px 20px',
                    background:
                      selected.size === TILES_PER_GROUP ? '#3b82f6' : 'rgba(59,130,246,0.2)',
                    color: selected.size === TILES_PER_GROUP ? '#fff' : '#475569',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: selected.size === TILES_PER_GROUP ? 'pointer' : 'default',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* How to play modal */}
      <AnimatePresence>
        {showHowTo && <HowToPlayModal onClose={handleCloseHowTo} />}
      </AnimatePresence>
    </div>
  );
}
