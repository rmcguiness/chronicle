/**
 * SpaceRacePage — comprehensive deep-dive into the Space Race (1957–1972).
 *
 * Covers US vs USSR scoreboard, Sputnik shock, Gagarin, Apollo 11,
 * Apollo 13, the Soviet side, and the technological legacy.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Theme colours ─────────────────────────────────────────────── */
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(20,60,120,0.08)';
const CARD_BORDER = 'rgba(20,60,120,0.22)';

const NAVY = '#0d3b66';       // USA
const CRIMSON = '#8b1a1a';    // USSR
const SILVER = '#94a3b8';     // Neutral / hardware
const GOLD = '#c9a84c';       // Triumph
const TEAL = '#1a8a7d';       // Science & legacy
const FLAME = '#c2452d';      // Danger / disaster
const STEEL = '#4a6274';      // Engineering
const PURPLE = '#6a4c93';     // Cooperation
const AMBER = '#d4920b';      // Cost / sacrifice

/* ── Types ─────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'scoreboard'
  | 'timeline'
  | 'sputnik'
  | 'gagarin'
  | 'nasa'
  | 'apollo11'
  | 'apollo13'
  | 'soviet'
  | 'cost'
  | 'cooperation'
  | 'legacy';

interface Milestone {
  achievement: string;
  winner: 'USSR' | 'USA';
  detail: string;
  date: string;
}

interface TimelineYear {
  year: string;
  events: { title: string; detail: string; side: 'USA' | 'USSR' | 'Both'; color: string }[];
}

/* ── Data ──────────────────────────────────────────────────────── */
const OVERVIEW_TEXT =
  'The Space Race was a Cold War proxy battle between the United States and the Soviet Union — two superpowers racing to dominate the final frontier. ' +
  'From Sputnik\'s terrifying beep in 1957 to the triumphant Apollo 11 Moon landing in 1969, it reshaped geopolitics, technology, and humanity\'s sense of its own possibilities. ' +
  'What began as a missile competition became humanity\'s greatest adventure.';

const CONTEXT = {
  coldWar:
    'The Space Race was inseparable from the Cold War. Every rocket that could reach orbit could also deliver a nuclear warhead. ' +
    'Space supremacy meant military supremacy — or so both sides believed. The competition drove spending, innovation, and risk-taking on an unprecedented scale.',
  propaganda:
    'Every launch was a propaganda event. Soviet firsts — Sputnik, Gagarin, the first spacewalk — humiliated the US and seemed to prove the superiority of communism. ' +
    'The US response was equally political: Kennedy\'s Moon commitment was less about science than about demonstrating American capability to the world.',
  numbers:
    'NASA\'s Apollo program cost $25.4 billion (roughly $175 billion in 2024 dollars). At its peak, 400,000 people worked on Apollo. ' +
    'The Soviet space program\'s budget remains partially classified, but estimates suggest comparable spending in the early 1960s.',
};

const MILESTONES: Milestone[] = [
  { achievement: 'First satellite in orbit', winner: 'USSR', detail: 'Sputnik 1 — a 58cm polished sphere that beeped its way into history', date: 'Oct 4, 1957' },
  { achievement: 'First animal in space', winner: 'USSR', detail: 'Laika the dog aboard Sputnik 2 — she did not survive the mission', date: 'Nov 3, 1957' },
  { achievement: 'First human in space', winner: 'USSR', detail: 'Yuri Gagarin, Vostok 1 — 108 minutes that changed everything', date: 'Apr 12, 1961' },
  { achievement: 'First woman in space', winner: 'USSR', detail: 'Valentina Tereshkova, Vostok 6 — 48 orbits over 3 days', date: 'Jun 16, 1963' },
  { achievement: 'First spacewalk (EVA)', winner: 'USSR', detail: 'Alexei Leonov — his suit inflated dangerously, nearly killing him', date: 'Mar 18, 1965' },
  { achievement: 'First Moon landing', winner: 'USA', detail: 'Apollo 11 — Armstrong and Aldrin walk on the Moon while 600M watch', date: 'Jul 20, 1969' },
  { achievement: 'First space station', winner: 'USSR', detail: 'Salyut 1 — humanity\'s first orbital outpost', date: 'Apr 19, 1971' },
];

const TIMELINE_YEARS: TimelineYear[] = [
  {
    year: '1957',
    events: [
      { title: 'Sputnik 1 launched', detail: 'First artificial satellite. Its radio beep was picked up worldwide, triggering panic in the West about Soviet technological superiority.', side: 'USSR', color: CRIMSON },
      { title: 'Sputnik 2 with Laika', detail: 'First animal in orbit. Laika the dog became the first living creature in space, though she perished during the flight.', side: 'USSR', color: CRIMSON },
    ],
  },
  {
    year: '1958',
    events: [
      { title: 'Explorer 1 (US first satellite)', detail: 'America\'s answer to Sputnik. Discovered the Van Allen radiation belts — the first major scientific discovery of the Space Age.', side: 'USA', color: NAVY },
      { title: 'NASA established', detail: 'National Aeronautics and Space Act signed by Eisenhower on July 29. Transformed the space effort from a military to a civilian program.', side: 'USA', color: NAVY },
      { title: 'NDEA Act passed', detail: 'National Defense Education Act poured federal money into science and math education — Sputnik\'s most lasting domestic impact.', side: 'USA', color: NAVY },
    ],
  },
  {
    year: '1959',
    events: [
      { title: 'Luna 2 hits the Moon', detail: 'First human-made object to reach the Moon. The Soviet probe deliberately crashed into the lunar surface.', side: 'USSR', color: CRIMSON },
      { title: 'Luna 3 photographs far side', detail: 'First images of the Moon\'s far side — terrain no human had ever seen.', side: 'USSR', color: CRIMSON },
      { title: 'Mercury Seven selected', detail: 'NASA selects its first astronaut class: Shepard, Glenn, Grissom, Carpenter, Schirra, Cooper, Slayton.', side: 'USA', color: NAVY },
    ],
  },
  {
    year: '1961',
    events: [
      { title: 'Gagarin orbits Earth', detail: 'April 12: Yuri Gagarin becomes the first human in space aboard Vostok 1. 108 minutes. "Poyekhali!" (Let\'s go!)', side: 'USSR', color: CRIMSON },
      { title: 'Shepard\'s suborbital flight', detail: 'May 5: Alan Shepard becomes the first American in space — but only a 15-minute suborbital hop. The gap was clear.', side: 'USA', color: NAVY },
      { title: 'Kennedy\'s Moon speech', detail: 'May 25: "I believe this nation should commit itself to landing a man on the Moon and returning him safely to the Earth." The race had its finish line.', side: 'USA', color: GOLD },
    ],
  },
  {
    year: '1962',
    events: [
      { title: 'Glenn orbits Earth', detail: 'February 20: John Glenn becomes the first American to orbit Earth — three orbits in Friendship 7. National hero.', side: 'USA', color: NAVY },
      { title: 'Kennedy at Rice University', detail: '"We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard."', side: 'USA', color: GOLD },
    ],
  },
  {
    year: '1963',
    events: [
      { title: 'Tereshkova: first woman in space', detail: 'June 16: Valentina Tereshkova orbits Earth 48 times over 3 days aboard Vostok 6. The US wouldn\'t fly a woman until 1983.', side: 'USSR', color: CRIMSON },
    ],
  },
  {
    year: '1965',
    events: [
      { title: 'Leonov: first spacewalk', detail: 'March 18: Alexei Leonov floats outside Voskhod 2 for 12 minutes. His suit ballooned dangerously — he had to bleed air to re-enter.', side: 'USSR', color: CRIMSON },
      { title: 'Gemini program begins', detail: 'Gemini missions (March–December) practice rendezvous, docking, and EVA — all skills needed for a Moon mission.', side: 'USA', color: NAVY },
      { title: 'Ed White: first US spacewalk', detail: 'June 3: Ed White walks in space during Gemini 4. He was so exhilarated he didn\'t want to come back inside.', side: 'USA', color: NAVY },
    ],
  },
  {
    year: '1966',
    events: [
      { title: 'Gemini 8: first docking', detail: 'Neil Armstrong docks with an Agena target vehicle — then a thruster malfunction sends the capsule into a violent spin.', side: 'USA', color: NAVY },
      { title: 'Luna 9: first soft Moon landing', detail: 'First spacecraft to achieve a soft landing on the Moon and transmit photos from the surface.', side: 'USSR', color: CRIMSON },
      { title: 'Korolev dies', detail: 'January 14: Sergei Korolev, the secret mastermind of the Soviet space program, dies during surgery. The program never fully recovers.', side: 'USSR', color: FLAME },
    ],
  },
  {
    year: '1967',
    events: [
      { title: 'Apollo 1 fire', detail: 'January 27: Fire during a launch rehearsal test kills astronauts Gus Grissom, Ed White, and Roger Chaffee. Pure oxygen cabin atmosphere ignited.', side: 'USA', color: FLAME },
      { title: 'Soyuz 1 crash', detail: 'April 24: Vladimir Komarov dies when Soyuz 1\'s parachute fails on re-entry. He knew the spacecraft was flawed before launch.', side: 'USSR', color: FLAME },
    ],
  },
  {
    year: '1968',
    events: [
      { title: 'Apollo 7: first crewed Apollo', detail: 'October: After 21 months of redesign following the fire, Apollo 7 successfully orbits Earth for 11 days.', side: 'USA', color: NAVY },
      { title: 'Apollo 8: orbiting the Moon', detail: 'December 24: Frank Borman, Jim Lovell, Bill Anders orbit the Moon. "Earthrise" photo transforms humanity\'s self-image.', side: 'USA', color: GOLD },
      { title: 'Gagarin killed', detail: 'March 27: Yuri Gagarin dies in a MiG-15UTI training jet crash. He was 34.', side: 'USSR', color: FLAME },
    ],
  },
  {
    year: '1969',
    events: [
      { title: 'Apollo 11: Moon landing', detail: 'July 20: "The Eagle has landed." Armstrong and Aldrin walk on the Moon. 600 million people watch live. America wins the race.', side: 'USA', color: GOLD },
      { title: 'Apollo 12: precision landing', detail: 'November: Pete Conrad and Alan Bean land within walking distance of Surveyor 3 — proving precision lunar navigation.', side: 'USA', color: NAVY },
      { title: 'N1 rocket failures', detail: 'Two more catastrophic failures of the Soviet N1 Moon rocket. The second explosion was one of the largest non-nuclear blasts in history.', side: 'USSR', color: FLAME },
    ],
  },
  {
    year: '1970',
    events: [
      { title: 'Apollo 13: "Houston, we have a problem"', detail: 'April: Oxygen tank explodes en route to the Moon. NASA improvises a CO2 scrubber from duct tape and cardboard. All three astronauts survive.', side: 'USA', color: FLAME },
      { title: 'Luna 16: robotic sample return', detail: 'September: USSR returns lunar soil samples robotically — no cosmonauts needed. A different approach to lunar science.', side: 'USSR', color: CRIMSON },
    ],
  },
  {
    year: '1971',
    events: [
      { title: 'Salyut 1: first space station', detail: 'April 19: USSR launches the world\'s first space station. A new direction — long-duration spaceflight instead of the Moon.', side: 'USSR', color: CRIMSON },
      { title: 'Soyuz 11 tragedy', detail: 'June 30: Three cosmonauts die during re-entry when a valve opens and depressurizes their capsule. They were found seated, lifeless.', side: 'USSR', color: FLAME },
      { title: 'Apollo 15: lunar rover', detail: 'Astronauts drive on the Moon for the first time, greatly expanding exploration range.', side: 'USA', color: NAVY },
    ],
  },
  {
    year: '1972',
    events: [
      { title: 'Apollo 17: last Moon mission', detail: 'December: Gene Cernan becomes the last human to walk on the Moon. "We leave as we came and, God willing, as we shall return."', side: 'USA', color: NAVY },
      { title: 'N1 program cancelled', detail: 'The Soviet Moon landing program is quietly abandoned after four consecutive N1 launch failures. It would remain secret until 1989.', side: 'USSR', color: CRIMSON },
    ],
  },
];

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '🚀' },
  { key: 'scoreboard', label: 'Scoreboard', icon: '🏆' },
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'sputnik', label: 'Sputnik', icon: '📡' },
  { key: 'gagarin', label: 'Gagarin', icon: '👨‍🚀' },
  { key: 'nasa', label: 'NASA Heroes', icon: '🇺🇸' },
  { key: 'apollo11', label: 'Apollo 11', icon: '🌙' },
  { key: 'apollo13', label: 'Apollo 13', icon: '⚠️' },
  { key: 'soviet', label: 'Soviet Side', icon: '☭' },
  { key: 'cost', label: 'The Cost', icon: '🕯️' },
  { key: 'cooperation', label: 'Cooperation', icon: '🤝' },
  { key: 'legacy', label: 'Legacy', icon: '🛰️' },
];

/* ── Helper components ─────────────────────────────────────────── */

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? NAVY : CARD_BORDER}`,
        backgroundColor: active ? `${NAVY}22` : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        borderRadius: 8,
        backgroundColor: `${NAVY}15`,
        border: `1px solid ${NAVY}33`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800, color: GOLD, fontFamily: 'monospace' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function NarrativeCard({
  children,
  color = NAVY,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: '18px 22px',
        borderRadius: 10,
        backgroundColor: CARD_BG,
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        marginBottom: 16,
        lineHeight: 1.75,
        fontSize: 14,
        color: TEXT_DIM,
      }}
    >
      {children}
    </div>
  );
}

function QuoteBlock({ quote, attribution }: { quote: string; attribution: string }) {
  return (
    <blockquote
      style={{
        margin: '20px 0',
        padding: '16px 24px',
        borderLeft: `3px solid ${GOLD}`,
        backgroundColor: `${GOLD}08`,
        borderRadius: '0 8px 8px 0',
        fontStyle: 'italic',
        color: TEXT,
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      "{quote}"
      <div style={{ marginTop: 8, fontSize: 12, color: TEXT_DIM, fontStyle: 'normal' }}>
        — {attribution}
      </div>
    </blockquote>
  );
}

/* ── Main component ────────────────────────────────────────────── */

export default function SpaceRacePage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');
  const [expandedYear, setExpandedYear] = useState<string | null>(TIMELINE_YEARS[0].year);

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: BG,
        color: TEXT,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* ── Hero ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '48px 32px 36px',
            borderBottom: `1px solid ${CARD_BORDER}`,
            background: `linear-gradient(135deg, ${BG} 0%, rgba(13,59,102,0.12) 100%)`,
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: TEXT_DIM,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 20,
              padding: '4px 0',
            }}
          >
            ← Back to Timeline
          </Link>

          <h1
            style={{
              fontSize: 'clamp(26px, 4vw, 38px)',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 12px',
              color: TEXT,
              letterSpacing: '-0.02em',
            }}
          >
            The Space Race
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: TEXT_DIM,
              margin: '0 0 24px',
              lineHeight: 1.5,
            }}
          >
            Humanity's Greatest Competition (1957–1972)
          </p>
          <p
            style={{
              fontSize: 14,
              color: TEXT_MUTED,
              margin: '0 0 28px',
              lineHeight: 1.7,
              maxWidth: 700,
            }}
          >
            A Cold War proxy battle between two superpowers racing to dominate the final frontier —
            from Sputnik's terrifying beep to bootprints on the Moon.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatBadge value="1957–72" label="Duration" />
            <StatBadge value="$25.4B" label="Apollo Cost" />
            <StatBadge value="400K" label="Workers (peak)" />
            <StatBadge value="600M" label="TV Viewers" />
            <StatBadge value="12" label="Moonwalkers" />
          </div>
        </motion.div>

        {/* ── Tab bar (sticky) ──────────────────────────────────── */}
        <div
          style={{
            padding: '16px 32px',
            borderBottom: `1px solid ${CARD_BORDER}`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            position: 'sticky',
            top: 0,
            backgroundColor: BG,
            zIndex: 10,
          }}
        >
          {SECTION_TABS.map((t) => (
            <TabButton
              key={t.key}
              label={t.label}
              icon={t.icon}
              active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            />
          ))}
        </div>

        {/* ── Content area ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '28px 32px 64px' }}
          >
            {/* ── Overview ─────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div>
                <SectionHeader icon="🚀" title="The Space Race" />
                <NarrativeCard>{OVERVIEW_TEXT}</NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Cold War Context
                </h3>
                <NarrativeCard color={CRIMSON}>{CONTEXT.coldWar}</NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Propaganda War
                </h3>
                <NarrativeCard color={GOLD}>{CONTEXT.propaganda}</NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  By the Numbers
                </h3>
                <NarrativeCard color={TEAL}>{CONTEXT.numbers}</NarrativeCard>
              </div>
            )}

            {/* ── Scoreboard ───────────────────────────────────── */}
            {activeTab === 'scoreboard' && (
              <div>
                <SectionHeader icon="🏆" title="US vs USSR — Who Got There First?" />
                <p style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 20, lineHeight: 1.6 }}>
                  The USSR dominated the early milestones. The US won the prize that mattered most.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {MILESTONES.map((m) => (
                    <div
                      key={m.achievement}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 20px',
                        borderRadius: 10,
                        backgroundColor: CARD_BG,
                        border: `1px solid ${m.winner === 'USSR' ? CRIMSON : NAVY}33`,
                        borderLeft: `4px solid ${m.winner === 'USSR' ? CRIMSON : NAVY}`,
                      }}
                    >
                      {/* Winner flag */}
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          backgroundColor:
                            m.winner === 'USSR' ? `${CRIMSON}20` : `${NAVY}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          fontWeight: 800,
                          color: m.winner === 'USSR' ? CRIMSON : NAVY,
                          flexShrink: 0,
                        }}
                      >
                        {m.winner === 'USSR' ? '☭' : '🇺🇸'}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
                            {m.achievement}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 4,
                              backgroundColor:
                                m.winner === 'USSR' ? `${CRIMSON}25` : `${NAVY}25`,
                              color: m.winner === 'USSR' ? '#e06060' : '#6090e0',
                            }}
                          >
                            {m.winner} ✓
                          </span>
                        </div>
                        <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.5 }}>
                          {m.detail}
                        </div>
                        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4 }}>{m.date}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    padding: '16px 20px',
                    borderRadius: 10,
                    backgroundColor: `${GOLD}10`,
                    border: `1px solid ${GOLD}30`,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.6 }}>
                    <strong style={{ color: CRIMSON }}>USSR: 5 firsts</strong> — first satellite, first animal, first human, first spacewalk, first space station
                  </div>
                  <div style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.6, marginTop: 4 }}>
                    <strong style={{ color: NAVY }}>USA: 1 first</strong> — but it was the <span style={{ color: GOLD, fontWeight: 700 }}>Moon</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── Timeline ─────────────────────────────────────── */}
            {activeTab === 'timeline' && (
              <div>
                <SectionHeader icon="📅" title="Year-by-Year Timeline (1957–1972)" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TIMELINE_YEARS.map((ty) => {
                    const isExpanded = expandedYear === ty.year;
                    return (
                      <div key={ty.year}>
                        <button
                          onClick={() => setExpandedYear(isExpanded ? null : ty.year)}
                          style={{
                            width: '100%',
                            padding: '12px 18px',
                            borderRadius: isExpanded ? '10px 10px 0 0' : 10,
                            border: `1px solid ${CARD_BORDER}`,
                            borderBottom: isExpanded ? 'none' : `1px solid ${CARD_BORDER}`,
                            backgroundColor: isExpanded ? `${NAVY}12` : 'transparent',
                            color: TEXT,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontFamily: "'Inter', system-ui, sans-serif",
                          }}
                        >
                          <span>{ty.year}</span>
                          <span style={{ fontSize: 12, color: TEXT_DIM }}>
                            {ty.events.length} event{ty.events.length > 1 ? 's' : ''}{' '}
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div
                            style={{
                              border: `1px solid ${CARD_BORDER}`,
                              borderTop: 'none',
                              borderRadius: '0 0 10px 10px',
                              padding: '12px 18px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 10,
                            }}
                          >
                            {ty.events.map((ev, i) => (
                              <div
                                key={i}
                                style={{
                                  padding: '12px 16px',
                                  borderRadius: 8,
                                  backgroundColor: `${ev.color}08`,
                                  borderLeft: `3px solid ${ev.color}`,
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <span
                                    style={{
                                      fontSize: 10,
                                      fontWeight: 700,
                                      padding: '2px 6px',
                                      borderRadius: 3,
                                      backgroundColor:
                                        ev.side === 'USSR'
                                          ? `${CRIMSON}25`
                                          : ev.side === 'USA'
                                          ? `${NAVY}25`
                                          : `${PURPLE}25`,
                                      color:
                                        ev.side === 'USSR'
                                          ? '#e06060'
                                          : ev.side === 'USA'
                                          ? '#6090e0'
                                          : '#a080d0',
                                    }}
                                  >
                                    {ev.side}
                                  </span>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>
                                    {ev.title}
                                  </span>
                                </div>
                                <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>
                                  {ev.detail}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Sputnik ──────────────────────────────────────── */}
            {activeTab === 'sputnik' && (
              <div>
                <SectionHeader icon="📡" title="Sputnik Shock (October 4, 1957)" />

                <NarrativeCard color={CRIMSON}>
                  On October 4, 1957, the Soviet Union launched a 58-centimetre polished metal sphere into orbit.
                  It did nothing except emit a steady <em>beep… beep… beep…</em> on 20.005 MHz —
                  and it terrified the Western world. Sputnik wasn't dangerous. What it represented was:
                  any country that could put a satellite in orbit could put a nuclear warhead on any city on Earth.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The Sound That Changed the World
                </h3>
                <NarrativeCard color={STEEL}>
                  Amateur radio operators across America tuned in to Sputnik's signal and heard
                  the beep of Soviet technology passing overhead every 96 minutes. Newspapers
                  printed the frequency so ordinary citizens could listen. The psychological impact
                  was enormous — the feeling that Soviet eyes were watching from above, that nowhere was safe.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The Missile Gap Panic
                </h3>
                <NarrativeCard color={FLAME}>
                  If Soviet rockets could reach space, they could reach New York. Sputnik created an
                  immediate fear of a "missile gap" — that the USSR had leapt ahead in intercontinental
                  ballistic missile technology. This fear (which turned out to be exaggerated) drove
                  massive defence spending increases and reshaped American politics.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  America's Response
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    {
                      title: 'NASA created (1958)',
                      detail: 'The National Aeronautics and Space Administration was established as a civilian agency to lead the US space effort — separating it from the military.',
                      color: NAVY,
                    },
                    {
                      title: 'NDEA Act (1958)',
                      detail: 'The National Defense Education Act poured $1 billion into science, math, and foreign language education. Sputnik did more for American education than any education reformer.',
                      color: TEAL,
                    },
                    {
                      title: 'DARPA established (1958)',
                      detail: 'The Advanced Research Projects Agency (now DARPA) was created to ensure the US would never again be surprised by a technological breakthrough. It would later create the internet.',
                      color: STEEL,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 8,
                        backgroundColor: CARD_BG,
                        borderLeft: `3px solid ${item.color}`,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Gagarin ──────────────────────────────────────── */}
            {activeTab === 'gagarin' && (
              <div>
                <SectionHeader icon="👨‍🚀" title="Yuri Gagarin — First Human in Space" />

                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 12,
                    backgroundColor: `${CRIMSON}10`,
                    border: `1px solid ${CRIMSON}30`,
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👨‍🚀</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>
                    April 12, 1961
                  </div>
                  <div style={{ fontSize: 15, color: GOLD, fontWeight: 600, marginTop: 4 }}>
                    108 minutes that changed history
                  </div>
                </div>

                <QuoteBlock
                  quote="Poyekhali!"
                  attribution='Yuri Gagarin at launch — "Let\'s go!"'
                />

                <NarrativeCard color={CRIMSON}>
                  Yuri Alekseyevich Gagarin, a 27-year-old Soviet Air Force pilot, became the first human being
                  to journey into outer space. His Vostok 1 spacecraft completed one orbit of Earth in 108 minutes.
                  He had no control over the spacecraft — it was fully automated, because engineers weren't sure
                  a human could function in weightlessness. The re-entry was harrowing: the service module
                  failed to fully separate, causing the capsule to tumble violently until the straps burned through.
                  Gagarin ejected at 7 km altitude and parachuted to a field near Saratov, landing near a
                  startled farmer and her granddaughter.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The American Response
                </h3>
                <NarrativeCard color={NAVY}>
                  Gagarin's flight was a shock to America comparable to Sputnik. Three weeks later, Alan Shepard
                  made a 15-minute suborbital hop — barely a fraction of what Gagarin achieved. The gap was
                  painfully clear. On May 25, 1961, just six weeks after Gagarin's flight, President Kennedy
                  went before Congress and committed the United States to landing a man on the Moon before the
                  decade was out. It was a breathtaking gamble — the US had barely 15 minutes of spaceflight
                  experience.
                </NarrativeCard>

                <QuoteBlock
                  quote="We choose to go to the Moon in this decade and do the other things, not because they are easy, but because they are hard."
                  attribution="John F. Kennedy, Rice University, September 12, 1962"
                />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Life After the Flight
                </h3>
                <NarrativeCard color={STEEL}>
                  Gagarin became the most famous person on Earth. He toured 30 countries, met crowds
                  of hundreds of thousands, and became a living symbol of Soviet achievement. But he was
                  never allowed to fly in space again — he was too valuable as a propaganda asset to risk losing.
                  He returned to test flying, and on March 27, 1968, at age 34, he was killed in a routine
                  MiG-15UTI training flight crash. The exact cause remains debated. He never saw the Moon
                  landing he had helped provoke.
                </NarrativeCard>
              </div>
            )}

            {/* ── NASA Heroes ──────────────────────────────────── */}
            {activeTab === 'nasa' && (
              <div>
                <SectionHeader icon="🇺🇸" title="The NASA Heroes" />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>
                  Mercury 7 — America's First Astronauts (1959)
                </h3>
                <NarrativeCard color={NAVY}>
                  Selected from military test pilots, the Mercury Seven became instant celebrities:
                  Alan Shepard, John Glenn, Gus Grissom, Scott Carpenter, Wally Schirra, Gordon Cooper,
                  and Deke Slayton. Glenn's three-orbit flight in February 1962 made him a national hero
                  and proved America could match the Soviets in orbit. Shepard would later walk on the Moon
                  during Apollo 14 — and hit a golf ball on the lunar surface.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Gemini Program (1965–1966) — Learning to Fly
                </h3>
                <NarrativeCard color={TEAL}>
                  Ten crewed missions in twenty months. Gemini was the bridge between Mercury and Apollo —
                  the program where NASA learned every skill needed for a Moon mission: spacewalking,
                  rendezvous, docking, long-duration flight, and precision re-entry. It was gruelling, dangerous,
                  and absolutely essential. Neil Armstrong nearly died during Gemini 8 when a stuck thruster
                  sent his capsule into a violent spin — his cool-headed response helped get him selected
                  to command Apollo 11.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Apollo Program (1967–1972) — To the Moon
                </h3>
                <NarrativeCard color={GOLD}>
                  The most ambitious engineering project in human history. Apollo required inventing entirely
                  new technologies: the Saturn V rocket (still the most powerful ever flown), the Lunar Module,
                  the guidance computer (a groundbreaking miniaturized computer with less processing power
                  than a modern calculator), and new life-support systems. At its peak, 400,000 people across
                  20,000 companies worked on Apollo. Six missions landed on the Moon successfully. Twelve
                  humans have walked on the lunar surface — all of them American men, all between 1969 and 1972.
                </NarrativeCard>
              </div>
            )}

            {/* ── Apollo 11 ────────────────────────────────────── */}
            {activeTab === 'apollo11' && (
              <div>
                <SectionHeader icon="🌙" title="Apollo 11 — First Moon Landing" />

                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 12,
                    backgroundColor: `${GOLD}10`,
                    border: `1px solid ${GOLD}30`,
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🌙</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>July 20, 1969</div>
                  <div style={{ fontSize: 15, color: GOLD, fontWeight: 600, marginTop: 4 }}>
                    "The Eagle has landed"
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>
                  The Crew
                </h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                  {[
                    { name: 'Neil Armstrong', role: 'Commander', detail: 'First human on the Moon. Test pilot, engineer, famously private.' },
                    { name: 'Buzz Aldrin', role: 'Lunar Module Pilot', detail: 'Second on the Moon. PhD in orbital mechanics. Took communion on the lunar surface.' },
                    { name: 'Michael Collins', role: 'Command Module Pilot', detail: 'The "forgotten third" — orbited alone while the others walked. Called himself "not lonely, but aware."' },
                  ].map((a) => (
                    <div
                      key={a.name}
                      style={{
                        flex: '1 1 200px',
                        padding: '14px 18px',
                        borderRadius: 10,
                        backgroundColor: CARD_BG,
                        border: `1px solid ${NAVY}33`,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 6 }}>
                        {a.role}
                      </div>
                      <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.5 }}>{a.detail}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>
                  The Landing
                </h3>
                <NarrativeCard color={FLAME}>
                  The Eagle's descent was terrifying. The onboard computer threw repeated 1202 alarms —
                  it was overloaded. Mission Control had seconds to decide: abort or continue. 26-year-old
                  engineer Steve Bales called "GO" and became a hero. Then Armstrong saw the planned
                  landing site was a boulder field. He took manual control, skimming over the rocks,
                  searching for a clear spot while fuel ran critically low. When Eagle finally touched down,
                  only about 25 seconds of fuel remained. Charlie Duke in Houston keyed the mic:
                  "Roger, Tranquility, we copy you on the ground. You got a bunch of guys about to turn
                  blue. We're breathing again."
                </NarrativeCard>

                <QuoteBlock
                  quote="That's one small step for man, one giant leap for mankind."
                  attribution="Neil Armstrong, stepping onto the lunar surface, July 20, 1969"
                />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  What They Left Behind
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { item: 'A plaque', detail: '"Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind."' },
                    { item: 'The American flag', detail: 'Planted by Aldrin. Knocked over by engine blast on takeoff. (Later flags were placed farther away.)' },
                    { item: 'A laser retroreflector', detail: 'Still in use today — scientists bounce lasers off it to measure the Moon\'s distance to within centimetres.' },
                    { item: 'Armstrong\'s boot prints', detail: 'With no wind or weather on the Moon, they\'re expected to last millions of years.' },
                    { item: 'Medals and a disc', detail: 'Medals honouring fallen cosmonauts Gagarin and Komarov, and a silicon disc with messages from 73 world leaders.' },
                  ].map((item) => (
                    <div
                      key={item.item}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        backgroundColor: CARD_BG,
                        borderLeft: `3px solid ${SILVER}`,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{item.item}: </span>
                      <span style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.5 }}>
                        {item.detail}
                      </span>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The Audience
                </h3>
                <NarrativeCard color={GOLD}>
                  An estimated 600 million people watched the Moon landing live — roughly 20% of the world's
                  population at the time. It was the largest television audience in history. In living rooms,
                  bars, and public squares across every continent, humanity watched together as one of its own
                  stepped onto another world. Even the Soviet state news agency TASS reported it, though briefly.
                </NarrativeCard>
              </div>
            )}

            {/* ── Apollo 13 ────────────────────────────────────── */}
            {activeTab === 'apollo13' && (
              <div>
                <SectionHeader icon="⚠️" title='Apollo 13 — "Houston, We Have a Problem"' />

                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 12,
                    backgroundColor: `${FLAME}10`,
                    border: `1px solid ${FLAME}30`,
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>April 13, 1970</div>
                  <div style={{ fontSize: 15, color: FLAME, fontWeight: 600, marginTop: 4 }}>
                    The Successful Failure
                  </div>
                </div>

                <QuoteBlock
                  quote="Houston, we've had a problem here."
                  attribution="Jack Swigert, Apollo 13 (often misquoted as 'Houston, we have a problem')"
                />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '0 0 12px' }}>
                  What Went Wrong
                </h3>
                <NarrativeCard color={FLAME}>
                  55 hours into the mission, an oxygen tank in the Service Module exploded. The bang was
                  heard by the crew — Jim Lovell, Jack Swigert, and Fred Haise — and within minutes,
                  it was clear the mission was over. Not only could they not land on the Moon, they might
                  not survive to get home. The explosion had knocked out two of three fuel cells, crippled
                  the electrical system, and vented their oxygen supply into space.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  How NASA Improvised
                </h3>
                <NarrativeCard color={TEAL}>
                  The crew moved into the Lunar Module — designed for two people for two days — and used
                  it as a lifeboat for three people for four days. Power was rationed to critical minimums.
                  The cabin temperature dropped to near freezing. Water was rationed to 6 ounces per person per day.
                  The most famous improvisation: CO2 was building to dangerous levels because the LM's round
                  air scrubber canisters were incompatible with the Command Module's square ones. Engineers
                  on the ground devised a jury-rigged adapter using cardboard, plastic bags, and duct tape —
                  and talked the crew through building it. It worked.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The Return
                </h3>
                <NarrativeCard color={NAVY}>
                  Using the Moon's gravity to slingshot back toward Earth, the crew endured four freezing,
                  exhausting days. The re-entry was the tensest moment — if the heat shield had been damaged
                  by the explosion, they would burn up. There was a standard blackout period as the capsule
                  hit the atmosphere. It lasted longer than expected. Mission Control waited in silence.
                  Then Swigert's voice crackled through: "OK, Joe." All three splashed down safely. Apollo 13
                  is called NASA's "successful failure" — a testament to engineering ingenuity under pressure.
                </NarrativeCard>
              </div>
            )}

            {/* ── Soviet Side ──────────────────────────────────── */}
            {activeTab === 'soviet' && (
              <div>
                <SectionHeader icon="☭" title="The Soviet Side — Often Overlooked" />

                <NarrativeCard color={CRIMSON}>
                  Western histories of the Space Race often treat the Soviet program as a faceless adversary.
                  In reality, it was driven by brilliant engineers, courageous cosmonauts, and a chief designer
                  whose name was kept secret from the world until after his death.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Sergei Korolev — The Secret Chief Designer
                </h3>
                <NarrativeCard color={STEEL}>
                  Sergei Pavlovich Korolev was the genius behind Sputnik, Vostok, and the entire early Soviet
                  space program. But the Soviet government kept his identity classified — he was referred to only
                  as "The Chief Designer." He had survived six years in the Gulag, where his jaw was broken and
                  his health permanently damaged. Despite this, he drove the Soviet space program to one triumph
                  after another through sheer force of will. He died on January 14, 1966, during surgery —
                  his identity was only revealed in his obituary. The Soviet space program never fully recovered
                  from his loss.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Valentina Tereshkova — First Woman in Space (1963)
                </h3>
                <NarrativeCard color={PURPLE}>
                  On June 16, 1963, Valentina Tereshkova became the first woman in space, orbiting Earth
                  48 times over nearly three days aboard Vostok 6. She was a textile factory worker and amateur
                  parachutist — selected partly to demonstrate that even ordinary Soviet citizens could conquer
                  space. The United States would not fly a woman in space until Sally Ride in 1983, twenty years later.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The N1 Rocket — Four Failures, Zero Successes
                </h3>
                <NarrativeCard color={FLAME}>
                  The Soviet Moon rocket, the N1, was an engineering nightmare. With 30 engines in its first stage
                  alone (compared to Saturn V's 5), it was impossibly complex. All four launch attempts between
                  1969 and 1972 ended in catastrophic failure. The second launch, on July 3, 1969 — just two weeks
                  before Apollo 11 — exploded on the pad in one of the largest non-nuclear explosions in history,
                  destroying the launch complex. The Soviet Moon program was quietly abandoned and kept secret
                  from the world until glasnost in 1989.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Why the USSR Lost the Moon Race
                </h3>
                <NarrativeCard color={SILVER}>
                  Several factors: Korolev's death left the program without unified leadership. Rival design
                  bureaus competed rather than cooperated. Funding was split across too many projects. The N1's
                  design was rushed and never adequately tested. And critically, the Soviet program operated in
                  secrecy — failures could be hidden, removing the pressure to fix problems publicly. Meanwhile,
                  NASA had Kennedy's clear deadline, $25.4 billion in funding, and an open program where every
                  failure was analyzed in public.
                </NarrativeCard>
              </div>
            )}

            {/* ── The Cost ─────────────────────────────────────── */}
            {activeTab === 'cost' && (
              <div>
                <SectionHeader icon="🕯️" title="The Cost" />

                <NarrativeCard color={FLAME}>
                  The Space Race was not just a story of triumph. People died — on both sides — and the
                  political pressure to beat the other side sometimes overrode safety concerns.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Apollo 1 — January 27, 1967
                </h3>
                <NarrativeCard color={AMBER}>
                  During a launch rehearsal test on the pad, a fire broke out in the pure-oxygen atmosphere
                  of the Apollo 1 command module. Astronauts Gus Grissom, Ed White, and Roger Chaffee were
                  trapped — the inward-opening hatch could not be opened against the internal pressure.
                  All three died. The disaster led to a complete redesign of the Apollo spacecraft and an
                  18-month delay, but the changes likely saved lives on later missions. Gus Grissom was a
                  Mercury and Gemini veteran. Ed White was America's first spacewalker. Roger Chaffee never
                  got to fly.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Soyuz 1 — April 24, 1967
                </h3>
                <NarrativeCard color={CRIMSON}>
                  Vladimir Komarov knew his spacecraft was flawed — more than 200 structural problems had been
                  identified. But political pressure to launch was immense. On re-entry, the main parachute
                  failed. The backup tangled. Soyuz 1 hit the ground at full speed. Komarov became the first
                  person to die during a spaceflight. He reportedly knew before launch that he would likely die,
                  but flew anyway so his backup pilot — his close friend Yuri Gagarin — wouldn't have to.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Soyuz 11 — June 30, 1971
                </h3>
                <NarrativeCard color={CRIMSON}>
                  After a successful 23-day stay on Salyut 1 — a record at the time — cosmonauts Georgy Dobrovolsky,
                  Vladislav Volkov, and Viktor Patsayev died during re-entry when a ventilation valve opened
                  and depressurized their capsule. They were not wearing spacesuits (a design decision later reversed).
                  The recovery crew opened the hatch to find all three men seated in their couches, lifeless,
                  with dark-blue patches on their faces. They had died in about 30 seconds.
                </NarrativeCard>
              </div>
            )}

            {/* ── Cooperation ──────────────────────────────────── */}
            {activeTab === 'cooperation' && (
              <div>
                <SectionHeader icon="🤝" title="Apollo-Soyuz — A Handshake in Space" />

                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 12,
                    backgroundColor: `${PURPLE}10`,
                    border: `1px solid ${PURPLE}30`,
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🤝</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>July 17, 1975</div>
                  <div style={{ fontSize: 15, color: PURPLE, fontWeight: 600, marginTop: 4 }}>
                    Former rivals dock in orbit
                  </div>
                </div>

                <NarrativeCard color={PURPLE}>
                  Three years after the last Moon landing, the Space Race ended not with a bang but with a
                  handshake. On July 17, 1975, an American Apollo spacecraft and a Soviet Soyuz spacecraft
                  docked in orbit. Astronaut Tom Stafford and cosmonaut Alexei Leonov (the first spacewalker)
                  shook hands through the open hatch — the first international crewed space mission. They
                  exchanged gifts, shared meals, and conducted joint experiments. The docking required engineers
                  from both countries to develop a compatible docking module, working together despite decades
                  of rivalry.
                </NarrativeCard>

                <NarrativeCard color={TEAL}>
                  Apollo-Soyuz was a symbol of détente — the thawing of Cold War tensions in the 1970s.
                  It laid the groundwork for future cooperation: the Shuttle-Mir program in the 1990s and
                  eventually the International Space Station, where Americans and Russians have lived and
                  worked together continuously since 2000. The competition that began with Sputnik's beep
                  evolved into humanity's most sustained international scientific collaboration.
                </NarrativeCard>
              </div>
            )}

            {/* ── Legacy ───────────────────────────────────────── */}
            {activeTab === 'legacy' && (
              <div>
                <SectionHeader icon="🛰️" title="Legacy — What the Space Race Gave Us" />

                <NarrativeCard color={TEAL}>
                  The Space Race's most enduring legacy isn't the Moon landing — it's the technologies and
                  institutions created to get there, which transformed everyday life on Earth.
                </NarrativeCard>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  Technologies Born from Space
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { tech: 'Satellite communications', detail: 'Direct descendant of the technology race. GPS, weather forecasting, global TV broadcasting, and the modern internet all rely on orbital satellites.', color: NAVY },
                    { tech: 'GPS', detail: 'Originally a military navigation system, GPS was enabled by the satellite technology developed during the Space Race. It now underpins everything from ride-sharing to precision agriculture.', color: TEAL },
                    { tech: 'Miniaturized computers', detail: 'The Apollo Guidance Computer drove massive advances in integrated circuit technology. MIT\'s work on Apollo helped launch the microcomputer revolution.', color: STEEL },
                    { tech: 'Memory foam', detail: 'Developed by NASA in 1966 to improve crash protection in aircraft seats. Now in mattresses, shoes, and medical equipment worldwide.', color: SILVER },
                    { tech: 'Scratch-resistant lenses', detail: 'NASA needed visors that wouldn\'t scratch in the harsh space environment. The coating technology is now standard in eyeglasses.', color: SILVER },
                    { tech: 'Water purification', detail: 'NASA\'s need to purify water in spacecraft led to advances now used in developing countries and disaster relief.', color: TEAL },
                    { tech: 'Freeze-dried food', detail: 'Developed for space missions, now used in camping, military rations, and emergency food supplies.', color: SILVER },
                    { tech: 'Tang (myth!)', detail: 'Contrary to popular belief, Tang was NOT invented by NASA. It existed before the space program but became famous when astronauts drank it in orbit.', color: AMBER },
                  ].map((item) => (
                    <div
                      key={item.tech}
                      style={{
                        padding: '14px 18px',
                        borderRadius: 8,
                        backgroundColor: CARD_BG,
                        borderLeft: `3px solid ${item.color}`,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
                        {item.tech}
                      </div>
                      <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.6 }}>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: '24px 0 12px' }}>
                  The Bigger Picture
                </h3>
                <NarrativeCard color={GOLD}>
                  Perhaps the greatest legacy is the "Earthrise" photograph taken by Apollo 8 astronaut
                  Bill Anders on December 24, 1968 — the first colour photo of Earth from deep space.
                  Seeing our planet as a fragile blue marble floating in the void helped launch the modern
                  environmental movement. We went to the Moon and discovered Earth.
                </NarrativeCard>

                <QuoteBlock
                  quote="We came all this way to explore the Moon, and the most important thing is that we discovered the Earth."
                  attribution="Bill Anders, Apollo 8 astronaut"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
