/**
 * HumanOriginsPage — comprehensive deep-dive on human evolution and prehistory.
 *
 * Route: /human-origins
 *
 * Sections:
 *  1. Hero — headline framing
 *  2. The Family Tree — our closest relatives
 *  3. Key hominin species — Sahelanthropus to Homo sapiens
 *  4. Key milestones — stone tools to writing
 *  5. Why Homo sapiens survived
 *  6. The Cognitive Revolution
 *  7. The Agricultural Revolution
 *  8. Population milestones
 *  9. Human genetic diversity
 * 10. What makes us human
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#f59e0b';
const EARTH = '#a16207';
const GREEN = '#22c55e';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const ORANGE = '#f97316';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface RelativeEntry {
  name: string;
  dnaMatch: string;
  divergence: string;
  detail: string;
  color: string;
}

const CLOSEST_RELATIVES: RelativeEntry[] = [
  {
    name: 'Chimpanzees',
    dnaMatch: '98.7%',
    divergence: '~6–7 million years ago',
    detail:
      'Our closest living relatives. We share 98.7% of our DNA with chimps. They use tools, have complex social hierarchies, and can learn sign language. The 1.3% DNA difference translates to roughly 35 million nucleotide differences — enough to produce profoundly different brains, vocal tracts, and body plans.',
    color: ACCENT,
  },
  {
    name: 'Gorillas',
    dnaMatch: '98.3%',
    divergence: '~9 million years ago',
    detail:
      'The largest living primates. Despite diverging earlier, gorillas share many traits with humans: long childhoods, complex social bonds, and the capacity for rudimentary tool use in the wild.',
    color: GREEN,
  },
  {
    name: 'Orangutans',
    dnaMatch: '96.9%',
    divergence: '~14 million years ago',
    detail:
      'The most distant great apes. Orangutans are highly intelligent, use tools, and teach skills to their young. Their solitary nature contrasts with the social lives of chimps and humans.',
    color: ORANGE,
  },
];

interface HomininEntry {
  species: string;
  timeRange: string;
  nickname: string;
  description: string;
  color: string;
}

const HOMININ_SPECIES: HomininEntry[] = [
  {
    species: 'Sahelanthropus tchadensis',
    timeRange: '~7 Ma',
    nickname: 'The oldest known hominin',
    description:
      'Discovered in Chad in 2001. Shows evidence of bipedal posture — walking upright may be what first separated our lineage from the apes. Brain size similar to modern chimps (~350 cc).',
    color: EARTH,
  },
  {
    species: 'Australopithecus afarensis',
    timeRange: '3.9–2.9 Ma',
    nickname: '"Lucy" — discovered 1974 in Ethiopia',
    description:
      'The most famous early hominin. Lucy stood about 3.5 feet tall, walked upright, but had a brain only about a third the size of ours (~430 cc). Her discovery proved bipedalism evolved millions of years before large brains.',
    color: ACCENT,
  },
  {
    species: 'Homo habilis',
    timeRange: '2.4–1.4 Ma',
    nickname: '"Handy man" — first stone toolmaker',
    description:
      'The first member of genus Homo. Had a larger brain (~600 cc) and was associated with the Oldowan stone tool industry — simple but effective flaked pebbles. Marks the beginning of human technology.',
    color: GREEN,
  },
  {
    species: 'Homo erectus',
    timeRange: '1.9 Ma – 110,000 years',
    nickname: 'First to leave Africa, first to control fire',
    description:
      'A transformative species. Homo erectus had a much larger brain (~900 cc), made sophisticated Acheulean hand axes, controlled fire, and was the first hominin to migrate out of Africa — reaching Java and China by 1.5 million years ago. Survived for nearly 2 million years.',
    color: RED,
  },
  {
    species: 'Homo neanderthalensis',
    timeRange: '400,000–40,000 years',
    nickname: 'Our closest extinct relative — and we interbred',
    description:
      'Neanderthals had brains as large as ours (sometimes larger), buried their dead, made jewelry, and may have had language. They coexisted with Homo sapiens in Europe and Western Asia for at least 5,000 years. Interbreeding means 1–4% of DNA in non-African modern humans is Neanderthal.',
    color: BLUE,
  },
  {
    species: 'Homo sapiens',
    timeRange: '300,000 years – present',
    nickname: 'Us — anatomically modern humans',
    description:
      'Emerged in Africa around 300,000 years ago (earliest fossils from Jebel Irhoud, Morocco). Characterized by a high, rounded skull, prominent chin, and — eventually — unprecedented cognitive abilities that enabled art, language, and civilization.',
    color: PURPLE,
  },
  {
    species: 'Denisovans',
    timeRange: 'At least 200,000–50,000 years',
    nickname: 'The ghost lineage — discovered 2010 from a finger bone',
    description:
      'Known almost entirely from DNA. Denisovans interbred with both Homo sapiens and Neanderthals. Modern Tibetans carry a Denisovan gene (EPAS1) that enables them to thrive at high altitudes — evolution\'s gift from a vanished cousin.',
    color: TEAL,
  },
];

interface MilestoneEntry {
  when: string;
  title: string;
  description: string;
  color: string;
}

const MILESTONES: MilestoneEntry[] = [
  {
    when: '3.3 million years ago',
    title: 'First stone tools (Lomekwi, Kenya)',
    description: 'Predates Homo habilis by 700,000 years — possibly made by Australopithecus. The oldest known technology on Earth.',
    color: EARTH,
  },
  {
    when: '1 million years ago',
    title: 'Controlled use of fire',
    description: 'Fire gave warmth, protection from predators, and cooked food — which may have driven brain growth by making calories more accessible.',
    color: RED,
  },
  {
    when: '300,000 years ago',
    title: 'Homo sapiens appear',
    description: 'The oldest known Homo sapiens fossils come from Jebel Irhoud, Morocco. Not yet behaviorally modern, but anatomically recognizable as us.',
    color: PURPLE,
  },
  {
    when: '100,000 years ago',
    title: 'Ochre use and early symbolic thinking',
    description: 'Blombos Cave (South Africa) — engraved ochre, shell beads. The first signs that humans were thinking abstractly and creating symbols.',
    color: ORANGE,
  },
  {
    when: '70,000 years ago',
    title: '"Out of Africa" migration',
    description: 'Anatomically modern humans leave Africa, eventually colonizing every continent. A small founding population — perhaps a few thousand — gave rise to all non-African humanity.',
    color: BLUE,
  },
  {
    when: '50,000 years ago',
    title: 'The Cognitive Revolution',
    description: 'Explosion of art, music, complex language, abstract thought, and trade networks. Whatever changed — possibly a genetic mutation affecting brain wiring — it made us fully "modern" in behavior.',
    color: ACCENT,
  },
  {
    when: '40,000 years ago',
    title: 'Cave paintings',
    description: 'Chauvet (36,000 BP), Lascaux (17,000 BP), Altamira. Stunning, fully modern artistic expression deep underground. Proof of imagination, planning, and cultural transmission.',
    color: GREEN,
  },
  {
    when: '12,000 years ago',
    title: 'The Agricultural Revolution',
    description: 'The single biggest lifestyle change in human history. Humans domesticated wheat, rice, and animals, settled in villages, and abandoned 200,000+ years of hunter-gatherer life. Everything since flows from this.',
    color: TEAL,
  },
  {
    when: '5,000 years ago',
    title: 'First writing (Sumer)',
    description: 'Cuneiform in Mesopotamia — initially for accounting, then laws, literature, and history. Writing is where prehistory ends and history begins.',
    color: BLUE,
  },
];

interface SurvivalFactor {
  title: string;
  detail: string;
  color: string;
}

const SURVIVAL_FACTORS: SurvivalFactor[] = [
  {
    title: 'Language and complex social cooperation',
    detail: 'Homo sapiens developed fully syntactic language — the ability to discuss things that don\'t exist, plan for the future, and coordinate in groups of hundreds. Neanderthals may have had some language, but likely less complex.',
    color: BLUE,
  },
  {
    title: 'Abstract thinking and planning',
    detail: 'We could imagine scenarios, create mental maps, plan multi-step hunts, and think about the thoughts of others (theory of mind). This let us outmaneuver competitors in rapidly changing environments.',
    color: PURPLE,
  },
  {
    title: 'Technology and cultural transmission',
    detail: 'Unlike other hominins, Homo sapiens rapidly iterated on tools and passed innovations across generations through teaching — creating cumulative culture. Each generation started where the last left off.',
    color: GREEN,
  },
  {
    title: 'Outcompeted and absorbed Neanderthals',
    detail: 'We may have outcompeted Neanderthals for resources, carried diseases they had no immunity to, and — as DNA evidence shows — interbred with them. They didn\'t simply vanish; part of them lives on in us.',
    color: RED,
  },
];

interface PopulationMilestone {
  year: string;
  population: string;
  note: string;
}

const POPULATION_MILESTONES: PopulationMilestone[] = [
  { year: '70,000 years ago', population: '~15,000', note: 'Near-extinction event (Toba catastrophe theory)' },
  { year: '10,000 BCE', population: '~5 million', note: 'Start of agriculture' },
  { year: '1 CE', population: '~200 million', note: 'Roman Empire era' },
  { year: '1804', population: '1 billion', note: 'Took all of human history to reach' },
  { year: '1927', population: '2 billion', note: '123 years' },
  { year: '1960', population: '3 billion', note: '33 years' },
  { year: '1974', population: '4 billion', note: '14 years' },
  { year: '1987', population: '5 billion', note: '13 years' },
  { year: '1999', population: '6 billion', note: '12 years' },
  { year: '2011', population: '7 billion', note: '12 years' },
  { year: '2022', population: '8 billion', note: '11 years' },
];

const WHAT_MAKES_US_HUMAN = [
  { trait: 'Language', detail: 'Fully recursive, syntactic language with infinite expressive power. No other species comes close.' },
  { trait: 'Culture', detail: 'Cumulative cultural evolution — each generation builds on the last. Ideas outlive individuals.' },
  { trait: 'Technology', detail: 'From stone tools to spacecraft. We reshape our environment rather than adapting biologically.' },
  { trait: 'Cooperation at scale', detail: 'We cooperate with millions of strangers through shared fictions: money, law, religion, nations.' },
  { trait: 'Self-awareness', detail: 'We know we exist, we know we will die, and we spend our lives searching for meaning.' },
  { trait: 'Art', detail: 'We create for beauty, for expression, for the sheer joy of it. From cave walls to concert halls.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function RelativeCard({ entry, index }: { entry: RelativeEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      style={{
        padding: '20px 22px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${entry.color}44`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{entry.name}</div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: entry.color,
            padding: '4px 10px',
            borderRadius: 6,
            backgroundColor: `${entry.color}18`,
          }}
        >
          {entry.dnaMatch} identical DNA
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace', marginBottom: 12 }}>
        Diverged {entry.divergence}
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.detail}</div>
    </motion.div>
  );
}

function HomininCard({ entry, index }: { entry: HomininEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}33`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 90,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.timeRange}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, fontStyle: 'italic' }}>
          {entry.species}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: entry.color, marginBottom: 8 }}>{entry.nickname}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function MilestoneCard({ entry, index }: { entry: MilestoneEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 18px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}33`,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 140,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.when}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{entry.title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function SurvivalCard({ factor, index }: { factor: SurvivalFactor; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      style={{
        padding: '16px 18px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderLeft: `3px solid ${factor.color}`,
        marginBottom: 10,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{factor.title}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{factor.detail}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function HumanOriginsPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
      if (root) root.style.overflow = '';
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '40px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${ACCENT}10 100%)`,
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              marginBottom: 28,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            &larr; Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Human Origins &mdash; 6 Million Years from Ape to Astronaut
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 720,
              padding: '16px 20px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Every human alive today descends from a small population of{' '}
            <strong style={{ color: ACCENT }}>Homo sapiens</strong> that emerged in Africa roughly{' '}
            <strong style={{ color: BLUE }}>300,000 years ago</strong>. We share{' '}
            <strong style={{ color: GREEN }}>98.7%</strong> of our DNA with chimpanzees. In the 1.3% difference
            lies everything that makes us human: language, art, science, civilization, and the ability to
            wonder where we came from.
          </motion.div>
        </div>

        {/* ── The Family Tree ─────────────────────────────────────────────── */}
        <SectionWrapper title="The Family Tree — Our Closest Relatives" icon={'\u{1F9EC}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Humans are great apes. We belong to the family Hominidae alongside chimps, gorillas, and orangutans.
            The DNA numbers are striking — but what does 1.3% difference actually mean? The human genome has
            about 3 billion base pairs. A 1.3% difference means roughly <strong style={{ color: ACCENT }}>35 million nucleotide changes</strong> —
            enough to produce different brains, vocal tracts, skeletal structures, and the cognitive capacity for
            language, abstract thought, and cumulative culture.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {CLOSEST_RELATIVES.map((entry, i) => (
              <RelativeCard key={entry.name} entry={entry} index={i} />
            ))}
          </div>
        </SectionWrapper>

        {/* ── Key Hominin Species ─────────────────────────────────────────── */}
        <SectionWrapper title="Key Hominin Species on the Path to Modern Humans" icon={'\u{1F9B4}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The human family tree isn&rsquo;t a straight line — it&rsquo;s a bush with many branches. Most went extinct.
            Here are the species that mark the key waypoints on our journey.
          </p>
          {HOMININ_SPECIES.map((entry, i) => (
            <HomininCard key={entry.species} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Milestones ──────────────────────────────────────────────── */}
        <SectionWrapper title="Key Milestones in Human Development" icon={'\u{1F525}'}>
          {MILESTONES.map((entry, i) => (
            <MilestoneCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Why Homo sapiens survived ───────────────────────────────────── */}
        <SectionWrapper title="Why Did Homo Sapiens Survive?" icon={'\u{1F9E0}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            At least 20 hominin species have walked the Earth. All are extinct except us. Neanderthals had
            larger brains, Homo erectus survived for nearly 2 million years, and Denisovans adapted to extreme
            altitudes. So why are we the last ones standing?
          </p>
          {SURVIVAL_FACTORS.map((factor, i) => (
            <SurvivalCard key={factor.title} factor={factor} index={i} />
          ))}
        </SectionWrapper>

        {/* ── The Cognitive Revolution ─────────────────────────────────────── */}
        <SectionWrapper title="The Cognitive Revolution" icon={'\u{1F4A1}'}>
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 12,
              backgroundColor: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.25)',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 10 }}>
              The Harari Framework: Imagined Realities
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
              Around 70,000–30,000 years ago, something changed in Homo sapiens. Historian Yuval Noah Harari
              calls it the <strong style={{ color: '#f1f5f9' }}>Cognitive Revolution</strong> — the point at which
              humans developed the ability to believe in things that exist purely in the collective imagination.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Religion', detail: 'Shared myths that bind thousands of strangers into cooperative groups', color: PURPLE },
              { label: 'Money', detail: 'The most universal system of mutual trust ever devised — worthless paper we all agree has value', color: GREEN },
              { label: 'Nations', detail: 'Imagined communities of millions who will never meet but share an identity', color: BLUE },
              { label: 'Corporations', detail: 'Legal fictions that can own property, sue, and outlive any individual', color: ORANGE },
              { label: 'Human rights', detail: 'A powerful fiction — there is no "natural" right, but believing in rights changes reality', color: RED },
              { label: 'Laws', detail: 'Rules we invent, write down, and then treat as if they exist independently of us', color: TEAL },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${item.color}33`,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{item.detail}</div>
              </motion.div>
            ))}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8, marginTop: 16 }}>
            This ability to create and believe in shared fictions is uniquely powerful. It allows millions
            of strangers to cooperate flexibly — something no other species can do. A chimpanzee troop maxes
            out at about 150 individuals. A human nation can mobilize millions, because they all believe in
            the same imagined reality.
          </div>
        </SectionWrapper>

        {/* ── The Agricultural Revolution ──────────────────────────────────── */}
        <SectionWrapper title="The Agricultural Revolution" icon={'\u{1F33E}'}>
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 12,
              backgroundColor: 'rgba(20,184,166,0.06)',
              border: '1px solid rgba(20,184,166,0.25)',
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginBottom: 10 }}>
              ~12,000 years ago — the biggest lifestyle change in human history
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
              For over 200,000 years, Homo sapiens lived as hunter-gatherers. Then, independently in several
              regions (Fertile Crescent, China, Mesoamerica), humans began domesticating plants and animals.
              We stopped following food and started growing it. This single shift made everything else possible:
              cities, writing, armies, empires, science, and — eventually — you reading this.
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div
              style={{
                padding: '16px 18px',
                borderRadius: 10,
                backgroundColor: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 10 }}>What agriculture enabled</div>
              {['Permanent settlements and cities', 'Food surplus → specialization of labor', 'Writing (to track grain stores)', 'Large-scale political organization', 'Population explosion'].map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: GREEN }}>+</span>
                  {item}
                </div>
              ))}
            </div>
            <div
              style={{
                padding: '16px 18px',
                borderRadius: 10,
                backgroundColor: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 10 }}>What agriculture cost us</div>
              {['Reduced diet diversity (grain monocultures)', 'New diseases from animal proximity', 'Social inequality (haves vs. have-nots)', 'Longer working hours than foragers', 'Environmental degradation'].map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 4, paddingLeft: 12, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: RED }}>&minus;</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </SectionWrapper>

        {/* ── Population Milestones ────────────────────────────────────────── */}
        <SectionWrapper title="Population Milestones" icon={'\u{1F4C8}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            It took all of human history — millions of years — to reach 1 billion people in 1804.
            Now we add a billion roughly every 12 years. The acceleration is staggering.
          </p>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: 7,
                top: 4,
                bottom: 4,
                width: 2,
                backgroundColor: `${ACCENT}44`,
                borderRadius: 1,
              }}
            />
            {POPULATION_MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: -20,
                    top: 5,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: ACCENT,
                    border: '2px solid #070e22',
                    boxShadow: `0 0 8px ${ACCENT}66`,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, fontFamily: 'monospace', minWidth: 130, flexShrink: 0 }}>
                  {m.year}
                </span>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{m.population}</span>
                  <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>&mdash; {m.note}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>

        {/* ── Human Genetic Diversity ──────────────────────────────────────── */}
        <SectionWrapper title="Human Genetic Diversity" icon={'\u{1F30D}'}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${PURPLE}44`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 8 }}>The African origin</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                All modern humans descend from a surprisingly small African population. Genetic studies
                show that two random people from different African ethnic groups are typically <strong style={{ color: '#f1f5f9' }}>more
                genetically different</strong> from each other than a European and an East Asian person.
                Africa contains more human genetic diversity than the rest of the world combined.
              </div>
            </div>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${BLUE}44`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: BLUE, marginBottom: 8 }}>The founder effect</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                When small groups left Africa ~70,000 years ago, they carried only a subset of African genetic
                variation. Each subsequent migration further reduced diversity. This is why genetic diversity
                decreases with distance from Africa — a clear signature of the Out of Africa migration in our DNA.
              </div>
            </div>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: `1px solid ${TEAL}44`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginBottom: 8 }}>Race is not biological</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                Genetically, all humans are 99.9% identical. The visible differences we call "race" — skin
                color, hair texture, facial features — involve a tiny fraction of our genome, driven by
                adaptation to local environments (UV radiation, climate). There is more genetic variation
                <em> within</em> any "racial" group than <em>between</em> groups.
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* ── What Makes Us Human ─────────────────────────────────────────── */}
        <SectionWrapper title="What Makes Us Human" icon={'\u2728'}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {WHAT_MAKES_US_HUMAN.map((item, i) => (
              <motion.div
                key={item.trait}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                style={{
                  padding: '16px 18px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>{item.trait}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{item.detail}</div>
              </motion.div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: '18px 22px',
              borderRadius: 10,
              backgroundColor: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 13,
              color: '#94a3b8',
              lineHeight: 1.8,
              fontStyle: 'italic',
            }}
          >
            &ldquo;We are the only species on this planet that has ever asked <em>why</em>. We are the only species
            that paints its caves, buries its dead with flowers, writes symphonies, splits atoms, and sends
            robots to Mars. All from a lineage of African apes who learned to walk upright, make tools,
            and — most importantly — tell stories.&rdquo;
          </div>
        </SectionWrapper>

        {/* ── Bottom nav ───────────────────────────────────────────────────── */}
        <div style={{ padding: '24px 32px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
