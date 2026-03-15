/**
 * DemocracyHistoryPage — comprehensive deep-dive on the history of democracy.
 *
 * Route: /democracy
 *
 * Sections:
 *  1. Hero — headline stat, framing
 *  2. Ancient origins — Athens, Rome, Indian gana-sanghas, Iroquois
 *  3. Medieval & early modern — Magna Carta, Althing, Parliament, Dutch Republic
 *  4. Enlightenment foundations — Locke, Montesquieu, Rousseau
 *  5. Democratic revolutions — American, French, Haitian, Latin American
 *  6. The long march of suffrage — who got the vote when
 *  7. Democratic waves — Huntington framework + recession
 *  8. Key figures gallery
 *  9. Modern threats & resilience
 * 10. The data — Freedom House, V-Dem
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';
const ACCENT_DIM = 'rgba(59,130,246,0.12)';
const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

const ANCIENT_ORIGINS: TimelineEntry[] = [
  {
    year: '6th c. BCE',
    title: 'Indian Gana-Sanghas',
    description:
      'Early republican governance in Vaishali and other Gana-sanghas (tribal republics). Assemblies deliberated and voted on policy — among the earliest known forms of collective self-governance.',
    color: TEAL,
  },
  {
    year: '509 BCE',
    title: 'Roman Republic',
    description:
      'Rome overthrew its monarchy and established a republic with a Senate, elected consuls, and tribunes of the plebs — introducing representative elements and checks on power that lasted nearly 500 years.',
    color: RED,
  },
  {
    year: '508 BCE',
    title: 'Athenian Democracy',
    description:
      'Cleisthenes\' reforms created the first direct democracy. Citizens debated and voted directly on laws in the Assembly. But "citizen" meant adult free males only — excluding women, slaves, and foreigners (roughly 90% of the population).',
    color: ACCENT,
  },
  {
    year: 'c. 1100–1500s',
    title: 'Iroquois Confederacy (Haudenosaunee)',
    description:
      'The Great Law of Peace established a sophisticated consensus-based governance model among five (later six) nations. Clan mothers held veto power. Benjamin Franklin and other founders studied this system.',
    color: GREEN,
  },
];

const MEDIEVAL_ENTRIES: TimelineEntry[] = [
  {
    year: '930 CE',
    title: 'Althing of Iceland',
    description:
      'One of the oldest continuously operating parliaments in the world. Free Viking settlers gathered annually at Thingvellir to debate laws, resolve disputes, and share news.',
    color: TEAL,
  },
  {
    year: '1215',
    title: 'Magna Carta',
    description:
      'English barons forced King John to sign a charter limiting royal power. It established that even the king was subject to law — a foundational concept for constitutional governance and individual rights.',
    color: GOLD,
  },
  {
    year: '1265',
    title: 'English Parliament Evolves',
    description:
      'Simon de Montfort summoned the first elected Parliament, including commoners. Over centuries, Parliament evolved from a feudal council into a representative legislature that gradually gained supremacy over the monarchy.',
    color: ACCENT,
  },
  {
    year: '1581',
    title: 'Dutch Republic',
    description:
      'The Act of Abjuration declared independence from Spain, creating the first modern republic. The Dutch Republic featured religious tolerance, a proto-federal structure, and significant (though limited) civic participation.',
    color: PURPLE,
  },
];

interface EnlightenmentThinker {
  name: string;
  years: string;
  idea: string;
  impact: string;
  color: string;
}

const ENLIGHTENMENT_THINKERS: EnlightenmentThinker[] = [
  {
    name: 'John Locke',
    years: '1632–1704',
    idea: 'Natural rights, consent of the governed, right to revolution',
    impact:
      'Argued that governments derive legitimacy from the consent of the people, and that citizens have the right to overthrow tyranny. Directly influenced the Declaration of Independence.',
    color: ACCENT,
  },
  {
    name: 'Montesquieu',
    years: '1689–1755',
    idea: 'Separation of powers (executive, legislative, judicial)',
    impact:
      'His framework for dividing government into three branches became the structural blueprint for the US Constitution and countless democracies that followed.',
    color: GOLD,
  },
  {
    name: 'Jean-Jacques Rousseau',
    years: '1712–1778',
    idea: 'General will, popular sovereignty, social contract',
    impact:
      'Articulated the idea that legitimate political authority must be based on the collective will of the people. His ideas fueled the French Revolution and modern democratic theory.',
    color: RED,
  },
];

interface RevolutionEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

const REVOLUTIONS: RevolutionEntry[] = [
  {
    year: '1776',
    title: 'American Revolution',
    description:
      'Created the first modern democratic republic. The Declaration of Independence asserted that governments derive "their just powers from the consent of the governed." The Constitution (1787) and Bill of Rights (1791) established enduring institutional frameworks.',
    color: ACCENT,
  },
  {
    year: '1789',
    title: 'French Revolution',
    description:
      'Liberty, equality, fraternity. The Revolution abolished feudal privileges and issued the Declaration of the Rights of Man. But it also descended into the Terror, illustrating how democratic upheaval can produce instability — and Napoleon.',
    color: RED,
  },
  {
    year: '1804',
    title: 'Haitian Revolution',
    description:
      'The only successful large-scale slave revolt in history. Haiti became the first Black republic and the first nation to permanently abolish slavery. A radical expansion of who "the people" in self-governance could be.',
    color: GREEN,
  },
  {
    year: '1810s–1820s',
    title: 'Latin American Independence',
    description:
      'Led by figures like Simon Bolivar and Jose de San Martin, most of Spanish America won independence. These new nations experimented with republican governance, though many oscillated between democracy and authoritarianism.',
    color: GOLD,
  },
];

interface SuffrageEntry {
  year: string;
  group: string;
  note: string;
}

const US_SUFFRAGE: SuffrageEntry[] = [
  { year: '1776', group: 'White male property owners', note: 'Original franchise' },
  { year: '1820s', group: 'All white men', note: 'Property requirements dropped' },
  { year: '1870', group: 'Black men (15th Amendment)', note: 'Then blocked by Jim Crow laws' },
  { year: '1920', group: 'Women (19th Amendment)', note: 'After 72 years of activism' },
  { year: '1965', group: 'Black Americans effectively', note: 'Voting Rights Act enforcement' },
];

const GLOBAL_SUFFRAGE: SuffrageEntry[] = [
  { year: '1893', group: 'Women in New Zealand', note: 'First country for women\'s suffrage' },
  { year: '1918/1928', group: 'Women in the UK', note: 'Over 30 in 1918, all adults in 1928' },
  { year: '1944', group: 'Women in France', note: 'After liberation' },
  { year: '1971', group: 'Women in Switzerland', note: 'Federal level; some cantons later' },
  { year: '2015', group: 'Women in Saudi Arabia', note: 'Municipal elections only' },
];

interface WaveEntry {
  period: string;
  label: string;
  description: string;
  color: string;
  direction: 'up' | 'down';
}

const DEMOCRATIC_WAVES: WaveEntry[] = [
  {
    period: '1828–1926',
    label: 'First Wave',
    description: 'Gradual democratization in Western Europe and the Americas. Expansion of male suffrage, rise of parliamentary systems. About 29 democracies by 1922.',
    color: ACCENT,
    direction: 'up',
  },
  {
    period: '1922–1942',
    label: 'First Reverse Wave',
    description: 'Rise of fascism in Italy, Germany, Spain. Military coups and authoritarian consolidation. Democracies fell to about 12 by 1942.',
    color: RED,
    direction: 'down',
  },
  {
    period: '1943–1962',
    label: 'Second Wave',
    description: 'Post-WWII decolonization created new democracies across Asia, Africa, and the Middle East. Allied victory reinforced democratic ideals. About 36 democracies by 1962.',
    color: GREEN,
    direction: 'up',
  },
  {
    period: '1958–1975',
    label: 'Second Reverse Wave',
    description: 'Military coups across Latin America and Africa. One-party states consolidated. Cold War proxy conflicts undermined fledgling democracies. Down to about 30.',
    color: RED,
    direction: 'down',
  },
  {
    period: '1974–1991',
    label: 'Third Wave',
    description: 'Began with Portugal\'s Carnation Revolution (1974). Spread to Spain, Latin America, East Asia, and culminated in the fall of the Berlin Wall (1989) and the dissolution of the Soviet Union. Democracies surged past 70.',
    color: ACCENT,
    direction: 'up',
  },
  {
    period: '2006–present',
    label: 'Democratic Recession',
    description: 'Freedom House has documented 18 consecutive years of global democratic decline. Backsliding in Hungary, Turkey, India. Rising authoritarianism worldwide. Three in four people live in declining or autocratic states.',
    color: RED,
    direction: 'down',
  },
];

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Cleisthenes', years: 'c. 570–508 BCE', contribution: 'Father of Athenian democracy; redesigned political system around citizen participation' },
  { name: 'Cicero', years: '106–43 BCE', contribution: 'Roman statesman who defended republican government and the rule of law' },
  { name: 'Magna Carta Barons', years: '1215', contribution: 'Forced the English king to accept limits on royal power' },
  { name: 'John Locke', years: '1632–1704', contribution: 'Philosopher of natural rights, consent of the governed, and the right to revolution' },
  { name: 'Montesquieu', years: '1689–1755', contribution: 'Theorist of separation of powers — the structural blueprint of modern democracies' },
  { name: 'Jean-Jacques Rousseau', years: '1712–1778', contribution: 'Articulated popular sovereignty and the social contract' },
  { name: 'Thomas Jefferson', years: '1743–1826', contribution: 'Primary author of the Declaration of Independence; champion of democratic ideals' },
  { name: 'James Madison', years: '1751–1836', contribution: '"Father of the Constitution" — architect of checks and balances and the Bill of Rights' },
  { name: 'Simon Bolivar', years: '1783–1830', contribution: 'Liberator of six South American nations from Spanish colonial rule' },
  { name: 'Susan B. Anthony', years: '1820–1906', contribution: 'Leader of the American women\'s suffrage movement for over 50 years' },
  { name: 'Mahatma Gandhi', years: '1869–1948', contribution: 'Led India to independence through nonviolent resistance; inspired democratic movements globally' },
  { name: 'Nelson Mandela', years: '1918–2013', contribution: 'Anti-apartheid leader who became South Africa\'s first Black president; model of democratic reconciliation' },
  { name: 'Vaclav Havel', years: '1936–2011', contribution: 'Dissident playwright who led Czechoslovakia\'s Velvet Revolution and became its democratic president' },
  { name: 'Aung San Suu Kyi', years: 'b. 1945', contribution: 'Nobel laureate who led Myanmar\'s democracy movement through decades of military rule' },
  { name: 'Desmond Tutu', years: '1931–2021', contribution: 'Archbishop who championed democratic transition and reconciliation in South Africa' },
];

const MODERN_THREATS = [
  { label: 'Populist authoritarianism', detail: 'Elected leaders dismantling democratic institutions from within — eroding judicial independence, press freedom, and election integrity.' },
  { label: 'Misinformation & disinformation', detail: 'Social media amplification of false narratives degrades the shared factual basis that democratic debate requires.' },
  { label: 'Gerrymandering & voter suppression', detail: 'Manipulating electoral boundaries and restricting ballot access to entrench power regardless of popular will.' },
  { label: 'Money in politics', detail: 'Concentrated wealth translating into outsized political influence, undermining the principle of political equality.' },
  { label: 'Authoritarian learning', detail: 'Autocracies studying and adopting democratic language and institutions as a facade while hollowing them out.' },
  { label: 'Democratic fatigue', detail: 'Declining public trust in institutions, falling voter participation, and growing tolerance for anti-democratic alternatives.' },
];

const RESILIENCE_FACTORS = [
  { label: 'Independent judiciary', detail: 'Courts that can check executive overreach and protect individual rights without political interference.' },
  { label: 'Free press', detail: 'Independent media that investigates power, informs citizens, and sustains public accountability.' },
  { label: 'Civil society', detail: 'NGOs, unions, community organizations, and civic groups that organize citizens and hold government accountable.' },
  { label: 'Electoral integrity', detail: 'Transparent, well-administered elections with universal access, independent oversight, and peaceful transfers of power.' },
  { label: 'Democratic culture', detail: 'A citizenry that values pluralism, tolerates disagreement, respects rules, and participates actively in civic life.' },
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

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
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
          width: 80,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.year}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{entry.title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function ThinkerCard({ thinker, index }: { thinker: EnlightenmentThinker; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      style={{
        padding: '20px 22px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${thinker.color}44`,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{thinker.name}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12, fontFamily: 'monospace' }}>{thinker.years}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: thinker.color,
          marginBottom: 10,
          padding: '6px 12px',
          borderRadius: 6,
          backgroundColor: `${thinker.color}14`,
          display: 'inline-block',
        }}
      >
        {thinker.idea}
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{thinker.impact}</div>
    </motion.div>
  );
}

function SuffrageTimeline({ title, entries, color }: { title: string; entries: SuffrageEntry[]; color: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', marginBottom: 14 }}>{title}</h3>
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 7,
            top: 4,
            bottom: 4,
            width: 2,
            backgroundColor: `${color}44`,
            borderRadius: 1,
          }}
        />
        {entries.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, position: 'relative' }}
          >
            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: 5,
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: color,
                border: '2px solid #070e22',
                boxShadow: `0 0 8px ${color}66`,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: 'monospace', minWidth: 80, flexShrink: 0 }}>
              {e.year}
            </span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{e.group}</span>
              <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>— {e.note}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WaveCard({ wave, index }: { wave: WaveEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 14,
        padding: '16px 18px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${wave.color}33`,
        marginBottom: 10,
      }}
    >
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 48 }}>
        <span style={{ fontSize: 20 }}>{wave.direction === 'up' ? '\u2191' : '\u2193'}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: wave.color,
            padding: '2px 6px',
            borderRadius: 4,
            backgroundColor: `${wave.color}22`,
          }}
        >
          {wave.direction === 'up' ? 'WAVE' : 'DECLINE'}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>{wave.label}</span>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{wave.period}</span>
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{wave.description}</div>
      </div>
    </motion.div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginBottom: 8 }}>{f.years}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.contribution}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ThreatAndResilienceCards({ threats, resilience }: { threats: typeof MODERN_THREATS; resilience: typeof RESILIENCE_FACTORS }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 14 }}>Threats</h3>
        {threats.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>What Makes Democracy Resilient</h3>
        {resilience.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{r.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function DemocracyHistoryPage() {
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
            Democracy &mdash; 2,500 Years of People Fighting for a Voice
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
            In 1900, only about <strong style={{ color: ACCENT }}>10 democracies</strong> existed worldwide. Today, roughly{' '}
            <strong style={{ color: GREEN }}>100 countries</strong> are classified as democracies. But democracy is fragile:{' '}
            <strong style={{ color: RED }}>3 in 4 people</strong> on Earth now live in countries where democracy is declining
            or under autocratic rule (V-Dem Institute, 2023).
          </motion.div>
        </div>

        {/* ── Ancient Origins ─────────────────────────────────────────────── */}
        <SectionWrapper title="Ancient Origins" icon="\u{1F3DB}">
          {ANCIENT_ORIGINS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Medieval & Early Modern ─────────────────────────────────────── */}
        <SectionWrapper title="Medieval & Early Modern Steps" icon="\u{1F3F0}">
          {MEDIEVAL_ENTRIES.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Enlightenment Foundations ────────────────────────────────────── */}
        <SectionWrapper title="The Enlightenment Foundations" icon="\u{1F4A1}">
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Three philosophers laid the intellectual foundation for modern democracy. Their ideas directly shaped the US Constitution and the French Revolution.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
            {ENLIGHTENMENT_THINKERS.map((t, i) => (
              <ThinkerCard key={t.name} thinker={t} index={i} />
            ))}
          </div>
        </SectionWrapper>

        {/* ── Democratic Revolutions ───────────────────────────────────────── */}
        <SectionWrapper title="Democratic Revolutions" icon="\u{1F525}">
          {REVOLUTIONS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── The Long March of Suffrage ───────────────────────────────────── */}
        <SectionWrapper title="The Long March of Suffrage" icon="\u{1F5F3}">
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
            Democracy's promise has always outpaced its practice. The story of suffrage is the story of excluded groups fighting — sometimes for centuries — to be included in "We the People."
          </p>
          <SuffrageTimeline title="United States" entries={US_SUFFRAGE} color={ACCENT} />
          <SuffrageTimeline title="Global Women's Suffrage" entries={GLOBAL_SUFFRAGE} color={PURPLE} />
        </SectionWrapper>

        {/* ── Democratic Waves ─────────────────────────────────────────────── */}
        <SectionWrapper title="Democratic Waves (Huntington Framework)" icon="\u{1F30A}">
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Political scientist Samuel Huntington identified three "waves" of democratization — periods when many countries transitioned to democracy — each followed by a reverse wave of backsliding.
          </p>
          {DEMOCRATIC_WAVES.map((wave, i) => (
            <WaveCard key={wave.label} wave={wave} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────────── */}
        <SectionWrapper title={`Key Figures (${KEY_FIGURES.length})`} icon="\u{1F9D1}\u{200D}\u{2696}\u{FE0F}">
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Modern Threats & Resilience ──────────────────────────────────── */}
        <SectionWrapper title="Modern Threats & Resilience" icon="\u{1F6E1}">
          <ThreatAndResilienceCards threats={MODERN_THREATS} resilience={RESILIENCE_FACTORS} />
        </SectionWrapper>

        {/* ── The Data ─────────────────────────────────────────────────────── */}
        <SectionWrapper title="The Data" icon="\u{1F4CA}">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(59,130,246,0.25)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT, marginBottom: 8 }}>Freedom House</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                Annual "Freedom in the World" report rates every country on political rights and civil liberties (Free / Partly Free / Not Free). Has documented 18 consecutive years of net democratic decline as of 2024.
              </div>
            </div>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(168,85,247,0.25)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: PURPLE, marginBottom: 8 }}>V-Dem Institute</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                The Varieties of Democracy project provides the most granular democracy data available — over 470 indicators across 202 countries dating back to 1789. Their Liberal Democracy Index is widely used in academic research.
              </div>
            </div>
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
