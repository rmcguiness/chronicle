/**
 * HistoriansPage — curated profiles of famous historians.
 *
 * Route: /historians
 *
 * Sections:
 *  1. Hero — "The People Who Wrote History"
 *  2. Era filter bar
 *  3. Historian cards grid
 *  4. Timeline view toggle
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Historian {
  name: string;
  dates: string;
  birthYear: number;
  deathYear: number | null;
  nationality: string;
  flag: string;
  era: Era;
  specialty: string;
  famousWorks: string[];
  bio: string;
  knownFor: string;
  quote: string;
  influence: number; // 1–5
}

type Era = 'Ancient' | 'Medieval' | 'Early Modern' | 'Modern' | 'Contemporary';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const HISTORIANS: Historian[] = [
  {
    name: 'Herodotus',
    dates: 'c. 484–425 BCE',
    birthYear: -484,
    deathYear: -425,
    nationality: 'Greek',
    flag: '\u{1F1EC}\u{1F1F7}',
    era: 'Ancient',
    specialty: 'Ancient Greece & Persia',
    famousWorks: ['Histories'],
    bio: 'Widely regarded as the "Father of History", Herodotus was the first writer to systematically collect materials, test their accuracy, and arrange them in a well-constructed narrative. His Histories documented the Greco-Persian Wars and the customs of the peoples he encountered.',
    knownFor: 'Father of History — invented historical inquiry',
    quote: 'Very few things happen at the right time, and the rest do not happen at all.',
    influence: 5,
  },
  {
    name: 'Thucydides',
    dates: 'c. 460–400 BCE',
    birthYear: -460,
    deathYear: -400,
    nationality: 'Greek',
    flag: '\u{1F1EC}\u{1F1F7}',
    era: 'Ancient',
    specialty: 'Military & Political History',
    famousWorks: ['History of the Peloponnesian War'],
    bio: 'An Athenian general turned historian, Thucydides pioneered "scientific history" by rejecting divine explanations in favor of rational, evidence-based analysis. His account of the Peloponnesian War remains a cornerstone of political realism and military strategy.',
    knownFor: 'Pioneer of scientific, evidence-based history',
    quote: 'The strong do what they can and the weak suffer what they must.',
    influence: 5,
  },
  {
    name: 'Sima Qian',
    dates: 'c. 145–86 BCE',
    birthYear: -145,
    deathYear: -86,
    nationality: 'Chinese',
    flag: '\u{1F1E8}\u{1F1F3}',
    era: 'Ancient',
    specialty: 'Chinese History',
    famousWorks: ['Records of the Grand Historian (Shiji)'],
    bio: 'Court historian of the Han dynasty, Sima Qian authored the monumental Shiji, covering over 2,000 years of Chinese history. Despite suffering castration for defending a disgraced general, he persevered to complete what became the model for all subsequent Chinese dynastic histories.',
    knownFor: 'Father of Chinese historiography',
    quote: 'A man has only one death. That death may be as weighty as Mount Tai, or it may be as light as a goose feather.',
    influence: 5,
  },
  {
    name: 'Livy',
    dates: '64 BCE–17 CE',
    birthYear: -64,
    deathYear: 17,
    nationality: 'Roman',
    flag: '\u{1F1EE}\u{1F1F9}',
    era: 'Ancient',
    specialty: 'Roman History',
    famousWorks: ['Ab Urbe Condita (From the Founding of the City)'],
    bio: 'Livy wrote a monumental history of Rome from its legendary founding in 753 BCE to his own time, spanning 142 books. Though only 35 survive, his vivid narrative style and moral focus shaped how generations understood Roman greatness and its lessons.',
    knownFor: 'Epic narrative of Rome from founding to empire',
    quote: 'There is nothing man will not attempt when great enterprises hold out the promise of great rewards.',
    influence: 4,
  },
  {
    name: 'Tacitus',
    dates: '56–120 CE',
    birthYear: 56,
    deathYear: 120,
    nationality: 'Roman',
    flag: '\u{1F1EE}\u{1F1F9}',
    era: 'Ancient',
    specialty: 'Roman Imperial History',
    famousWorks: ['Annals', 'Histories', 'Germania'],
    bio: 'A senator and historian of the Roman Empire, Tacitus is considered one of antiquity\'s greatest writers. His biting prose chronicled the tyranny of emperors from Tiberius to Domitian, exposing the corruption of absolute power with unmatched psychological insight.',
    knownFor: 'Unflinching chronicler of Roman imperial corruption',
    quote: 'The more corrupt the state, the more numerous the laws.',
    influence: 5,
  },
  {
    name: 'Bede',
    dates: '672–735 CE',
    birthYear: 672,
    deathYear: 735,
    nationality: 'English',
    flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
    era: 'Medieval',
    specialty: 'Early Medieval England',
    famousWorks: ['Ecclesiastical History of the English People'],
    bio: 'Known as the "Venerable Bede," this Northumbrian monk produced the single most important source for early English history. His meticulous dating system helped popularize the AD calendar, and his critical approach to sources set him apart from contemporaries.',
    knownFor: 'Father of English history, popularized the AD dating system',
    quote: 'It is better never to begin a good work than, having begun it, to stop.',
    influence: 4,
  },
  {
    name: 'Ibn Khaldun',
    dates: '1332–1406',
    birthYear: 1332,
    deathYear: 1406,
    nationality: 'Tunisian',
    flag: '\u{1F1F9}\u{1F1F3}',
    era: 'Medieval',
    specialty: 'Islamic History & Social Science',
    famousWorks: ['Muqaddimah (Introduction to History)', 'Kitab al-Ibar'],
    bio: 'Often called the "first sociologist," Ibn Khaldun developed a philosophy of history that analyzed the rise and fall of civilizations through social cohesion (asabiyyah). His Muqaddimah anticipated modern sociology, economics, and political science by centuries.',
    knownFor: 'First philosopher of history and proto-sociologist',
    quote: 'Geography is destiny.',
    influence: 5,
  },
  {
    name: 'Edward Gibbon',
    dates: '1737–1794',
    birthYear: 1737,
    deathYear: 1794,
    nationality: 'British',
    flag: '\u{1F1EC}\u{1F1E7}',
    era: 'Early Modern',
    specialty: 'Roman & Byzantine History',
    famousWorks: ['The History of the Decline and Fall of the Roman Empire'],
    bio: 'Gibbon\'s six-volume masterwork traced Rome\'s decline from the height of the Antonines to the fall of Constantinople in 1453. Written with literary brilliance and devastating irony, it remains the most influential single work of history in the English language.',
    knownFor: 'Definitive account of Rome\'s fall — a literary masterpiece',
    quote: 'History is indeed little more than the register of the crimes, follies, and misfortunes of mankind.',
    influence: 5,
  },
  {
    name: 'Leopold von Ranke',
    dates: '1795–1886',
    birthYear: 1795,
    deathYear: 1886,
    nationality: 'German',
    flag: '\u{1F1E9}\u{1F1EA}',
    era: 'Modern',
    specialty: 'European Diplomatic History',
    famousWorks: ['History of the Latin and Teutonic Nations'],
    bio: 'Ranke revolutionized historical practice by insisting on primary source research and archival evidence over narrative tradition. His seminar method trained a generation of professional historians and established history as an academic discipline.',
    knownFor: 'Father of modern source-based history — "wie es eigentlich gewesen"',
    quote: 'You have reckoned that history ought to judge the past and to instruct the contemporary world. I will merely tell what actually happened.',
    influence: 5,
  },
  {
    name: 'Jules Michelet',
    dates: '1798–1874',
    birthYear: 1798,
    deathYear: 1874,
    nationality: 'French',
    flag: '\u{1F1EB}\u{1F1F7}',
    era: 'Modern',
    specialty: 'French History',
    famousWorks: ['Histoire de France', 'Histoire de la Revolution francaise'],
    bio: 'Michelet wrote a sweeping, passionately literary history of France that championed the common people. He coined the term "Renaissance" as a historical period and brought emotional intensity to the discipline, seeing history as the story of human freedom.',
    knownFor: 'Coined "Renaissance," champion of people\'s history',
    quote: 'Each epoch dreams its successor.',
    influence: 4,
  },
  {
    name: 'Jacob Burckhardt',
    dates: '1818–1897',
    birthYear: 1818,
    deathYear: 1897,
    nationality: 'Swiss',
    flag: '\u{1F1E8}\u{1F1ED}',
    era: 'Modern',
    specialty: 'Cultural History & Renaissance',
    famousWorks: ['The Civilization of the Renaissance in Italy'],
    bio: 'Burckhardt pioneered cultural history by studying art, literature, and mentality rather than politics alone. His portrait of Renaissance Italy as the birthplace of modern individualism became one of the most influential interpretive frameworks in historiography.',
    knownFor: 'Pioneer of cultural history and Renaissance scholarship',
    quote: 'The essence of tyranny is the denial of complexity.',
    influence: 4,
  },
  {
    name: 'Frederick Jackson Turner',
    dates: '1861–1932',
    birthYear: 1861,
    deathYear: 1932,
    nationality: 'American',
    flag: '\u{1F1FA}\u{1F1F8}',
    era: 'Modern',
    specialty: 'American History',
    famousWorks: ['The Significance of the Frontier in American History'],
    bio: 'Turner\'s 1893 "Frontier Thesis" argued that westward expansion shaped American democracy and character. Though later challenged, it dominated American historiography for decades and remains one of the most debated interpretations in the field.',
    knownFor: 'Frontier Thesis — the West shaped American identity',
    quote: 'The existence of an area of free land, its continuous recession, and the advance of American settlement westward, explain American development.',
    influence: 4,
  },
  {
    name: 'Marc Bloch',
    dates: '1886–1944',
    birthYear: 1886,
    deathYear: 1944,
    nationality: 'French',
    flag: '\u{1F1EB}\u{1F1F7}',
    era: 'Modern',
    specialty: 'Medieval & Social History',
    famousWorks: ['Feudal Society', "The Historian's Craft"],
    bio: 'Co-founder of the Annales school, Bloch revolutionized medieval studies by integrating social science methods. A French Resistance fighter, he was captured and executed by the Gestapo in 1944, leaving behind an unfinished meditation on the historian\'s vocation.',
    knownFor: 'Annales school co-founder, died fighting fascism',
    quote: 'Misunderstanding of the present is the inevitable consequence of ignorance of the past.',
    influence: 5,
  },
  {
    name: 'Fernand Braudel',
    dates: '1902–1985',
    birthYear: 1902,
    deathYear: 1985,
    nationality: 'French',
    flag: '\u{1F1EB}\u{1F1F7}',
    era: 'Contemporary',
    specialty: 'Mediterranean & World History',
    famousWorks: ['The Mediterranean and the Mediterranean World', 'Civilization and Capitalism'],
    bio: 'Braudel transformed historical writing with his concept of the longue duree — slow-moving structures of geography, climate, and economy that underpin human events. His magisterial study of the Mediterranean world, largely written from memory in a POW camp, reshaped how historians think about time.',
    knownFor: 'Longue duree — history moves at multiple speeds',
    quote: 'Events are the ephemera of history; they pass across its stage like fireflies.',
    influence: 5,
  },
  {
    name: 'E.P. Thompson',
    dates: '1924–1993',
    birthYear: 1924,
    deathYear: 1993,
    nationality: 'British',
    flag: '\u{1F1EC}\u{1F1E7}',
    era: 'Contemporary',
    specialty: 'Social & Labor History',
    famousWorks: ['The Making of the English Working Class'],
    bio: 'Thompson\'s masterwork rescued working-class history from "the enormous condescension of posterity." By reconstructing the lived experiences of ordinary people, he helped found the "history from below" movement and redefined how social historians approach class and agency.',
    knownFor: '"History from below" — gave voice to ordinary people',
    quote: 'I am seeking to rescue the poor stockinger, the Luddite cropper, the obsolete hand-loom weaver from the enormous condescension of posterity.',
    influence: 5,
  },
  {
    name: 'Eric Hobsbawm',
    dates: '1917–2012',
    birthYear: 1917,
    deathYear: 2012,
    nationality: 'British',
    flag: '\u{1F1EC}\u{1F1E7}',
    era: 'Contemporary',
    specialty: 'Modern World History',
    famousWorks: ['The Age of Revolution', 'The Age of Capital', 'The Age of Empire', 'The Age of Extremes'],
    bio: 'Hobsbawm\'s four-volume history of the modern world from the French Revolution to the fall of the Soviet Union is unmatched in scope and analytical power. A committed Marxist, his ability to synthesize vast sweeps of history into compelling narrative made him the most widely read historian of the 20th century.',
    knownFor: 'Definitive tetralogy of the modern world',
    quote: 'The destruction of the past is one of the most characteristic and eerie phenomena of the late twentieth century.',
    influence: 5,
  },
  {
    name: 'Barbara Tuchman',
    dates: '1912–1989',
    birthYear: 1912,
    deathYear: 1989,
    nationality: 'American',
    flag: '\u{1F1FA}\u{1F1F8}',
    era: 'Contemporary',
    specialty: 'Military & Narrative History',
    famousWorks: ['The Guns of August', 'A Distant Mirror', 'The March of Folly'],
    bio: 'Two-time Pulitzer winner Tuchman proved that rigorous history could also be riveting literature. The Guns of August, her account of WWI\'s opening weeks, was so compelling that JFK kept it on his desk during the Cuban Missile Crisis as a warning against miscalculation.',
    knownFor: 'Made history a bestseller — JFK\'s crisis companion',
    quote: 'The unrecorded past is none other than our old friend, the tree in the forest which falls without being heard.',
    influence: 4,
  },
  {
    name: 'Howard Zinn',
    dates: '1922–2010',
    birthYear: 1922,
    deathYear: 2010,
    nationality: 'American',
    flag: '\u{1F1FA}\u{1F1F8}',
    era: 'Contemporary',
    specialty: 'American Social History',
    famousWorks: ["A People's History of the United States"],
    bio: 'Zinn\'s People\'s History told the American story from the perspective of slaves, workers, women, and Native Americans rather than presidents and generals. Controversial and beloved in equal measure, it sold over two million copies and fundamentally challenged how Americans understand their past.',
    knownFor: 'Radical retelling of US history from below',
    quote: 'You can\'t be neutral on a moving train.',
    influence: 4,
  },
  {
    name: 'David McCullough',
    dates: '1933–2022',
    birthYear: 1933,
    deathYear: 2022,
    nationality: 'American',
    flag: '\u{1F1FA}\u{1F1F8}',
    era: 'Contemporary',
    specialty: 'American Biography & History',
    famousWorks: ['John Adams', 'Truman', '1776', 'The Wright Brothers'],
    bio: 'McCullough brought American history to life for millions through vivid, deeply researched biographies and narratives. A two-time Pulitzer winner, his warm, authoritative voice — both on the page and as a narrator — made him America\'s most beloved popular historian.',
    knownFor: 'America\'s storyteller — biography as living history',
    quote: 'History is a guide to navigation in perilous times. History is who we are and why we are the way we are.',
    influence: 4,
  },
  {
    name: 'Yuval Noah Harari',
    dates: '1976–',
    birthYear: 1976,
    deathYear: null,
    nationality: 'Israeli',
    flag: '\u{1F1EE}\u{1F1F1}',
    era: 'Contemporary',
    specialty: 'World & Big History',
    famousWorks: ['Sapiens: A Brief History of Humankind', 'Homo Deus', '21 Lessons for the 21st Century'],
    bio: 'Harari\'s Sapiens synthesized 70,000 years of human history into a single compelling narrative, becoming a global phenomenon translated into 65 languages. His sweeping approach connects biology, anthropology, and history to ask fundamental questions about what it means to be human.',
    knownFor: 'Made big history a global conversation',
    quote: 'Fiction is among the most effective tools in humanity\'s toolkit.',
    influence: 4,
  },
  {
    name: 'Niall Ferguson',
    dates: '1964–',
    birthYear: 1964,
    deathYear: null,
    nationality: 'British',
    flag: '\u{1F1EC}\u{1F1E7}',
    era: 'Contemporary',
    specialty: 'Economic & Imperial History',
    famousWorks: ['Empire', 'The Ascent of Money', 'Civilization', 'Doom'],
    bio: 'Ferguson combines rigorous economic analysis with provocative counterfactual thinking to challenge conventional historical wisdom. A prolific author and public intellectual, he has brought financial and imperial history to mainstream audiences through books, TV series, and fierce academic debates.',
    knownFor: 'Counterfactual history and economic narrative',
    quote: 'The financial revolution preceded the industrial revolution.',
    influence: 3,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Era styling
// ─────────────────────────────────────────────────────────────────────────────

const ERA_COLORS: Record<Era, string> = {
  Ancient: '#8b5cf6',
  Medieval: '#f59e0b',
  'Early Modern': '#f97316',
  Modern: '#3b82f6',
  Contemporary: '#22c55e',
};

const ALL_ERAS: Era[] = ['Ancient', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'];

function influenceStars(n: number): string {
  return '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoriansPage() {
  const [selectedEra, setSelectedEra] = useState<Era | 'all'>('all');
  const [timelineView, setTimelineView] = useState(false);

  const filtered = useMemo(() => {
    if (selectedEra === 'all') return HISTORIANS;
    return HISTORIANS.filter((h) => h.era === selectedEra);
  }, [selectedEra]);

  // For timeline: sort by birth year
  const timelineSorted = useMemo(() => [...filtered].sort((a, b) => a.birthYear - b.birthYear), [filtered]);

  // Timeline range
  const minYear = Math.min(...HISTORIANS.map((h) => h.birthYear));
  const maxYear = Math.max(...HISTORIANS.map((h) => h.deathYear ?? 2026));
  const timelineSpan = maxYear - minYear;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav bar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Historians</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          The People Who Wrote History
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 700 }}
        >
          A tribute to the historians whose work shapes our understanding of the past — from Herodotus
          to the present day. Their writing, analysis, and courage made history itself possible.
        </motion.p>
      </header>

      {/* Controls: era filter + timeline toggle */}
      <section style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {/* Era filter pills */}
          <button
            onClick={() => setSelectedEra('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: selectedEra === 'all' ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
              color: selectedEra === 'all' ? '#0f172a' : '#94a3b8',
              transition: 'all 0.15s',
            }}
          >
            All ({HISTORIANS.length})
          </button>
          {ALL_ERAS.map((era) => {
            const count = HISTORIANS.filter((h) => h.era === era).length;
            return (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedEra === era ? ERA_COLORS[era] : 'rgba(255,255,255,0.08)',
                  color: selectedEra === era ? '#fff' : '#94a3b8',
                  transition: 'all 0.15s',
                }}
              >
                {era} ({count})
              </button>
            );
          })}

          <div style={{ flex: 1 }} />

          {/* Timeline toggle */}
          <button
            onClick={() => setTimelineView(!timelineView)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: timelineView ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: timelineView ? '#60a5fa' : '#94a3b8',
              transition: 'all 0.15s',
            }}
          >
            {timelineView ? 'Grid View' : 'Timeline View'}
          </button>
        </div>
      </section>

      {/* Timeline view */}
      <AnimatePresence>
        {timelineView && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto 32px', overflow: 'hidden' }}
          >
            <div
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '32px 24px 64px',
                overflowX: 'auto',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', margin: '0 0 24px', letterSpacing: 1, textTransform: 'uppercase' }}>
                Timeline of Historians
              </h3>

              {/* Axis */}
              <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 8 }}>
                {[
                  { year: -500, label: '500 BCE' },
                  { year: 0, label: '1 CE' },
                  { year: 500, label: '500' },
                  { year: 1000, label: '1000' },
                  { year: 1500, label: '1500' },
                  { year: 1800, label: '1800' },
                  { year: 2000, label: '2000' },
                ].map((m) => (
                  <div
                    key={m.year}
                    style={{
                      position: 'absolute',
                      left: `${((m.year - minYear) / timelineSpan) * 100}%`,
                      top: -6,
                      width: 1,
                      height: 16,
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <span style={{ position: 'absolute', top: 20, left: -16, fontSize: 10, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Historian bars */}
              <div style={{ position: 'relative', marginTop: 40 }}>
                {timelineSorted.map((h, i) => {
                  const left = ((h.birthYear - minYear) / timelineSpan) * 100;
                  const width = (((h.deathYear ?? 2026) - h.birthYear) / timelineSpan) * 100;
                  return (
                    <div
                      key={h.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        height: 22,
                        marginBottom: 4,
                      }}
                    >
                      <div style={{ width: 120, flexShrink: 0, fontSize: 11, color: '#94a3b8', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {h.name}
                      </div>
                      <div style={{ flex: 1, position: 'relative', height: 14 }}>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.03, duration: 0.3 }}
                          style={{
                            position: 'absolute',
                            left: `${left}%`,
                            width: `${Math.max(width, 0.5)}%`,
                            height: '100%',
                            background: ERA_COLORS[h.era],
                            borderRadius: 3,
                            opacity: 0.7,
                            transformOrigin: 'left',
                            cursor: 'pointer',
                          }}
                          title={`${h.name} (${h.dates})`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Historian cards grid */}
      <section style={{ padding: '0 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((h, i) => (
            <motion.div
              key={h.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                border: `1px solid ${ERA_COLORS[h.era]}22`,
                padding: 24,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${ERA_COLORS[h.era]}66`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLDivElement).style.borderColor = `${ERA_COLORS[h.era]}22`;
              }}
            >
              {/* Header: name, dates, flag */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                    {h.flag} {h.name}
                  </h3>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{h.dates}</div>
                </div>
                <div style={{ fontSize: 14, color: '#f59e0b', letterSpacing: 2, flexShrink: 0 }}>
                  {influenceStars(h.influence)}
                </div>
              </div>

              {/* Era + specialty badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${ERA_COLORS[h.era]}22`,
                    color: ERA_COLORS[h.era],
                  }}
                >
                  {h.era}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.08)',
                    color: '#cbd5e1',
                  }}
                >
                  {h.specialty}
                </span>
              </div>

              {/* Known for tagline */}
              <div style={{ fontSize: 13, fontWeight: 600, color: ERA_COLORS[h.era], marginBottom: 8 }}>
                {h.knownFor}
              </div>

              {/* Bio */}
              <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cbd5e1', margin: '0 0 12px' }}>
                {h.bio}
              </p>

              {/* Famous works */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  Key Works
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {h.famousWorks.map((w) => (
                    <span
                      key={w}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        background: 'rgba(255,255,255,0.06)',
                        color: '#e2e8f0',
                        fontStyle: 'italic',
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <blockquote
                style={{
                  margin: '0 0 16px',
                  padding: '8px 12px',
                  borderLeft: `3px solid ${ERA_COLORS[h.era]}66`,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '0 6px 6px 0',
                  fontSize: 12,
                  fontStyle: 'italic',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                }}
              >
                "{h.quote}"
              </blockquote>

              {/* Find their events button */}
              <a
                href={`/?search=${encodeURIComponent(h.name)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: `${ERA_COLORS[h.era]}18`,
                  color: ERA_COLORS[h.era],
                  textDecoration: 'none',
                  border: `1px solid ${ERA_COLORS[h.era]}33`,
                  transition: 'all 0.15s',
                }}
              >
                Find their events &rarr;
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
