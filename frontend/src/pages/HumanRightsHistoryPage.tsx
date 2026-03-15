/**
 * HumanRightsHistoryPage — deep-dive page on the history of human rights.
 *
 * Route: /human-rights-history
 *
 * Sections:
 *  1. Before "Human Rights" — ancient codes of justice
 *  2. Enlightenment Foundations (1600s–1700s)
 *  3. American and French Revolutions (1776–1789)
 *  4. Abolition of Slavery (1787–1888)
 *  5. Women's Suffrage (1848–1928)
 *  6. Labor Rights (1800s–1900s)
 *  7. The Holocaust and the Turning Point (1933–1945)
 *  8. Universal Declaration of Human Rights (1948)
 *  9. Decolonization and Self-Determination (1945–1980)
 * 10. Civil Rights Movements (1950s–1970s)
 * 11. International Human Rights Architecture
 * 12. Current Frontiers
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Theme colors ───────────────────────────────────────────── */
const GOLD = '#f59e0b';
const EARTH = '#92400e';
const CRIMSON = '#dc2626';
const BLOOD_RED = '#991b1b';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const AMBER = '#d97706';
const PURPLE = '#a855f7';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const SKY = '#0ea5e9';
const JADE = '#059669';
const COPPER = '#b45309';
const OLIVE = '#65a30d';
const FLAME = '#ea580c';

/* ── Interfaces ─────────────────────────────────────────────── */
interface StatEntry {
  value: string;
  label: string;
  color: string;
}

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

interface ConnectionCard {
  title: string;
  path: string;
  description: string;
  color: string;
}

/* ── Data ───────────────────────────────────────────────────── */

const HERO_STATS: StatEntry[] = [
  { value: '30', label: 'Articles in the UDHR (1948)', color: BLUE },
  { value: '100M+', label: 'Displaced people worldwide (2023)', color: CRIMSON },
  { value: '40M', label: 'People in modern slavery today', color: BLOOD_RED },
  { value: '160M', label: 'Children still in child labor', color: AMBER },
  { value: '2015', label: 'Saudi Arabia allowed women to vote', color: PURPLE },
];

const ANCIENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Code of Hammurabi (1754 BCE)',
    detail:
      'The first written legal code. Not rights in the modern sense, but limits on power — establishing that even rulers must follow rules. "An eye for an eye" was actually a restraint: punishment could not exceed the crime.',
  },
  {
    label: 'Cyrus Cylinder (539 BCE)',
    detail:
      'After conquering Babylon, Cyrus the Great freed enslaved peoples, allowed religious freedom, and restored temples. Sometimes called the first human rights charter — though scholars debate whether it was genuine principle or political strategy.',
  },
  {
    label: 'Magna Carta (1215)',
    detail:
      'English barons forced King John to accept limits on royal power. "No free man shall be seized, imprisoned, or stripped of his rights except by the lawful judgment of his peers." A radical idea: even kings answer to law.',
  },
  {
    label: 'Iroquois Confederacy (c. 1450)',
    detail:
      'The Haudenosaunee created a democratic governance system with separation of powers, representative government, and protected freedoms — centuries before European Enlightenment. Their Great Law of Peace influenced the American founders.',
  },
];

const ENLIGHTENMENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'John Locke (1689)',
    detail:
      'Natural rights — life, liberty, and property. Government exists solely to protect these rights, and if it fails, the people may overthrow it. This single idea lit the fuse for two revolutions.',
  },
  {
    label: 'Montesquieu',
    detail:
      'Separation of powers — legislative, executive, judicial. No single branch should hold absolute authority. This structural insight became the architecture of modern democratic government.',
  },
  {
    label: 'Jean-Jacques Rousseau',
    detail:
      'The social contract: legitimate political authority comes from the consent of the governed. Popular sovereignty means the people are the ultimate source of power, not monarchs or priests.',
  },
  {
    label: 'Ideas → Revolutions',
    detail:
      'These philosophical arguments did not stay in salons. They became battle cries. Locke\'s natural rights appear almost verbatim in the Declaration of Independence. Montesquieu\'s separation of powers is the skeleton of the US Constitution.',
  },
];

const REVOLUTION_TIMELINE: TimelineEntry[] = [
  {
    year: '1776',
    title: 'Declaration of Independence',
    description:
      '"We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights." Transformative words — but enslaved people, women, and Indigenous peoples were excluded from "all men."',
    color: BLUE,
  },
  {
    year: '1789',
    title: 'French Declaration of the Rights of Man',
    description:
      'Liberté, égalité, fraternité. Proclaimed universal natural rights and the sovereignty of the nation over the king. Yet it excluded women, did not abolish slavery in the colonies, and was followed by the Terror.',
    color: CRIMSON,
  },
  {
    year: '1791',
    title: 'Olympe de Gouges — Declaration of the Rights of Woman',
    description:
      'De Gouges rewrote the Declaration article by article, replacing "man" with "woman." Article X: "Woman has the right to mount the scaffold; she must equally have the right to mount the rostrum." She was guillotined in 1793.',
    color: PURPLE,
  },
];

const ABOLITION_TIMELINE: TimelineEntry[] = [
  {
    year: '1787',
    title: 'Quaker Abolition Movement (London)',
    description:
      'Quakers organized the first systematic abolition campaign, forming the Society for Effecting the Abolition of the Slave Trade. They pioneered tactics still used today: consumer boycotts, petitions, personal testimony from survivors.',
    color: TEAL,
  },
  {
    year: '1791–1804',
    title: 'Haitian Revolution',
    description:
      'Enslaved people in Saint-Domingue rose up, defeated Napoleon\'s army, and created Haiti — the first nation founded by formerly enslaved people. The first successful slave revolution in history. It terrified slaveholding nations worldwide.',
    color: GOLD,
  },
  {
    year: '1807 / 1833',
    title: 'British Abolition',
    description:
      'Britain abolished the slave trade in 1807, then emancipation throughout the empire in 1833. The Royal Navy patrolled to enforce the ban — but Britain also compensated slaveholders, not the enslaved. That debt was only paid off in 2015.',
    color: BLUE,
  },
  {
    year: '1865',
    title: '13th Amendment (United States)',
    description:
      'After a civil war that killed 620,000, the 13th Amendment abolished slavery. But the loophole — "except as punishment for crime" — enabled convict leasing and mass incarceration that persists today.',
    color: INDIGO,
  },
  {
    year: '1888',
    title: 'Brazil — Last in the Western Hemisphere',
    description:
      'Brazil was the last country in the Americas to abolish slavery, freeing roughly 700,000 enslaved people. But abolition came without land reform or reparations, entrenching racial inequality that endures.',
    color: GREEN,
  },
];

const SUFFRAGE_TIMELINE: TimelineEntry[] = [
  {
    year: '1848',
    title: 'Seneca Falls Convention',
    description:
      'The first women\'s rights convention in the US. Elizabeth Cady Stanton\'s Declaration of Sentiments mirrored the Declaration of Independence: "We hold these truths to be self-evident: that all men and women are created equal."',
    color: PURPLE,
  },
  {
    year: '1893',
    title: 'New Zealand — First Country for Women\'s Suffrage',
    description:
      'New Zealand became the first self-governing country where all women won the right to vote. Kate Sheppard led a petition signed by nearly a quarter of the adult female population.',
    color: JADE,
  },
  {
    year: '1918 / 1928',
    title: 'United Kingdom',
    description:
      'Partial suffrage in 1918 (women over 30 who met property qualifications), full equal suffrage in 1928. The suffragettes used civil disobedience, hunger strikes, and were brutally force-fed in prison.',
    color: BLUE,
  },
  {
    year: '1920',
    title: 'United States — 19th Amendment',
    description:
      'After 72 years of campaigning since Seneca Falls, women won the vote. But the 19th Amendment did not protect Black women in the South, who were effectively disenfranchised until the Voting Rights Act of 1965.',
    color: INDIGO,
  },
  {
    year: '2015',
    title: 'Saudi Arabia',
    description:
      'Saudi women were allowed to vote and run in municipal elections for the first time. A reminder that women\'s suffrage is not ancient history — it is still being won.',
    color: AMBER,
  },
];

const LABOR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Child Labor in Factories',
    detail:
      'In 1800s England, children as young as 6 worked 16-hour days in textile mills and coal mines. Tiny bodies fit in narrow mine shafts. Many were maimed or killed. Factory Acts gradually raised the minimum working age.',
  },
  {
    label: 'Triangle Shirtwaist Fire (1911)',
    detail:
      '146 workers — mostly young immigrant women — died when fire broke out in a New York garment factory. The doors were locked to prevent breaks. Workers jumped from the 8th and 9th floors. The outrage fueled sweeping labor reform.',
  },
  {
    label: 'International Labour Organization (1919)',
    detail:
      'Founded as part of the Treaty of Versailles, the ILO became the first global body setting labor standards: limits on working hours, minimum age for workers, workplace safety. It remains a UN agency today.',
  },
  {
    label: 'Hard-Won Standards',
    detail:
      'The 40-hour work week, minimum wage, workplace safety regulations, ban on child labor — none of these were gifts. Every one was fought for, often with blood. The Triangle fire alone changed 36 laws in one year.',
  },
];

const HOLOCAUST_TIMELINE: TimelineEntry[] = [
  {
    year: '1933–1938',
    title: 'Systematic Legal Stripping of Rights',
    description:
      'The Nazis did not start with gas chambers. They started with laws — stripping citizenship, banning professions, forbidding marriage. The Nuremberg Laws (1935) made persecution legal. Rights were removed one by one, until none remained.',
    color: BLOOD_RED,
  },
  {
    year: '1938',
    title: 'Evian Conference — The World Refused',
    description:
      '32 nations gathered at Evian, France to discuss the Jewish refugee crisis. Nearly all refused to take refugees. The Dominican Republic was the only country to offer significant resettlement. The message to Hitler: no one will stop you.',
    color: ASH,
  },
  {
    year: '1941–1945',
    title: 'The Holocaust',
    description:
      'The systematic, industrial murder of 6 million Jews and 5–6 million others — Roma, disabled people, homosexuals, political prisoners, Slavic peoples. The machinery of genocide: ghettos, deportations, death camps, gas chambers.',
    color: CRIMSON,
  },
  {
    year: '1945–1946',
    title: 'Nuremberg Trials',
    description:
      'The first international tribunal for crimes against humanity. "I was following orders" was rejected as a defense. For the first time, individuals were held personally responsible for state-sponsored atrocities. A new principle: some acts are crimes against all humanity.',
    color: BLUE,
  },
];

const UDHR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Article 1',
    detail:
      '"All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood."',
  },
  {
    label: 'Scope: 30 Articles',
    detail:
      'Civil and political rights (freedom of speech, assembly, religion). Economic and social rights (education, healthcare, adequate standard of living). Cultural rights (participate in cultural life, benefit from scientific progress). The first document to treat all these as inseparable.',
  },
  {
    label: 'The Vote',
    detail:
      'Passed on December 10, 1948. 48 nations voted in favor, none against, 8 abstained — including the USSR, South Africa, and Saudi Arabia. South Africa objected because apartheid violated it. Saudi Arabia objected to articles on marriage and religion.',
  },
  {
    label: 'Legal Status',
    detail:
      'Not legally binding — but morally authoritative. It became the foundation of all international human rights law: the two 1966 Covenants, the Convention Against Torture, the Convention on the Rights of the Child, and dozens of national constitutions.',
  },
];

const ELEANOR_ROOSEVELT: FigureEntry = {
  name: 'Eleanor Roosevelt',
  years: '1884–1962',
  contribution:
    'Chaired the UN Human Rights Commission that drafted the UDHR. She navigated Cold War tensions between Western emphasis on civil liberties and Soviet emphasis on economic rights — insisting the Declaration must include both. Called the "First Lady of the World."',
};

const DECOLONIZATION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Self-Determination',
    detail:
      'The UN Charter enshrined the right of peoples to self-determination. Between 1945 and 1965, over 50 nations gained independence from colonial rule — across Africa, Asia, the Middle East, and the Caribbean.',
  },
  {
    label: 'Independence ≠ Rights',
    detail:
      'Many newly independent nations replaced colonial rulers with authoritarian governments. The end of empire did not automatically mean the beginning of freedom. Rights continued to be violated — now by local leaders instead of foreign ones.',
  },
  {
    label: 'Ongoing Legacy',
    detail:
      'Colonial borders drawn by Europeans divided ethnic groups and merged rivals. Extraction economies, institutional damage, and psychological wounds persisted long after flags changed. Decolonization was a necessary but insufficient step toward rights.',
  },
];

const CIVIL_RIGHTS_TIMELINE: TimelineEntry[] = [
  {
    year: '1955–1968',
    title: 'US Civil Rights Movement',
    description:
      'Rosa Parks refused to give up her bus seat (1955). Martin Luther King Jr. led the March on Washington (1963). The Birmingham campaign, Freedom Rides, Selma marches. The Civil Rights Act (1964) and Voting Rights Act (1965) dismantled legal segregation — but not its legacy.',
    color: INDIGO,
  },
  {
    year: '1948–1994',
    title: 'Anti-Apartheid (South Africa)',
    description:
      'Nelson Mandela and the ANC fought the apartheid system of racial separation. Mandela spent 27 years in prison. International sanctions, boycotts, and internal resistance finally forced change. Mandela walked free in 1990, became president in 1994.',
    color: GREEN,
  },
  {
    year: '1969–present',
    title: 'LGBT Rights',
    description:
      'The Stonewall uprising (1969) launched the modern gay rights movement. Gradual decriminalization, anti-discrimination laws, and marriage equality followed — the US Supreme Court ruled for marriage equality in 2015. But in 64 countries, homosexuality remains criminalized.',
    color: ROSE,
  },
];

const ARCHITECTURE_INSIGHTS: InsightEntry[] = [
  {
    label: 'International Criminal Court (2002)',
    detail:
      'The first permanent international tribunal to prosecute individuals for genocide, crimes against humanity, and war crimes. Based in The Hague. Notable: the United States, Russia, and China have not joined.',
  },
  {
    label: 'Human Rights Council & NGOs',
    detail:
      'The UN Human Rights Council reviews countries\' rights records. Amnesty International (1961) and Human Rights Watch (1978) document abuses worldwide. These watchdogs have no enforcement power — their weapon is exposure.',
  },
  {
    label: 'Convention on the Rights of the Child',
    detail:
      'The most widely ratified human rights treaty in history — 193 signatories. Every UN member nation except the United States has ratified it. It establishes children\'s rights to protection, education, health, and a voice in decisions affecting them.',
  },
];

const CURRENT_FRONTIERS: InsightEntry[] = [
  {
    label: 'Digital Rights',
    detail:
      'Privacy vs. surveillance. Internet access as a human right. AI bias and algorithmic discrimination. Data sovereignty. The digital frontier is where 21st-century rights battles are being fought — often before laws catch up.',
  },
  {
    label: 'Climate Rights',
    detail:
      'The right to a healthy environment. Climate change disproportionately harms those who contributed least to it. Courts are beginning to recognize climate obligations. In 2024, the ICJ was asked for an advisory opinion on states\' climate duties.',
  },
  {
    label: 'Refugee Rights',
    detail:
      'Over 100 million people displaced worldwide (2023) — the highest ever recorded. Climate displacement is rising. The 1951 Refugee Convention was designed for a different era. The gap between rights on paper and reality grows wider.',
  },
  {
    label: 'Economic Rights',
    detail:
      'The right to food, housing, healthcare — enshrined in the UDHR but fiercely debated in the Global North. Are these aspirations or enforceable rights? Much of the world has decided they are rights. The debate continues.',
  },
  {
    label: 'Women\'s Rights — Still Contested',
    detail:
      'Reproductive rights rolled back in some countries, expanded in others. Gender-based violence remains a global pandemic — 1 in 3 women experience it. Equal pay, political representation, bodily autonomy: progress is real but uneven.',
  },
];

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'Slavery & Abolition',
    path: '/slavery',
    description:
      'The abolition of slavery — from the Quaker movement to the 13th Amendment and beyond.',
    color: GOLD,
  },
  {
    title: 'Civil Rights Movement',
    path: '/civil-rights',
    description:
      'From Rosa Parks to the Voting Rights Act — the fight for racial equality in America.',
    color: INDIGO,
  },
  {
    title: 'Women\'s History',
    path: '/womens-history',
    description:
      'The long struggle for women\'s suffrage, rights, and equality across centuries.',
    color: PURPLE,
  },
  {
    title: 'Decolonization',
    path: '/decolonization',
    description:
      'How empires fell and new nations rose — self-determination and its unfinished legacy.',
    color: JADE,
  },
  {
    title: 'The Holocaust',
    path: '/holocaust',
    description:
      'The systematic genocide that shocked the world into creating international human rights law.',
    color: CRIMSON,
  },
];

/* ── Sub-components ─────────────────────────────────────────── */

const FIGURE_COLORS = [JADE, GOLD, CRIMSON, BLUE, TEAL, PURPLE, AMBER, COPPER, GREEN, INDIGO];

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 14,
        marginTop: 28,
        marginBottom: 8,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.color}44`,
            borderRadius: 10,
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: s.color, fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
            {s.value}
          </p>
          <p style={{ color: SLATE, fontSize: '0.78rem', lineHeight: 1.4 }}>{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function SectionWrapper({
  id,
  icon,
  title,
  accentColor,
  intro,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  accentColor: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>{intro}</p>
      </motion.div>
      {children}
    </section>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: e.color,
              marginRight: 8,
              verticalAlign: 'middle',
            }}
          />
          <p
            style={{
              display: 'inline',
              color: e.color,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </p>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureSpotlight({ figure }: { figure: FigureEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${BLUE}44`,
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: BLUE, marginBottom: 4 }}>
        {figure.name}
      </h3>
      <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 10 }}>{figure.years}</p>
      <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>{figure.contribution}</p>
    </motion.div>
  );
}

function ConnectionCards({ connections }: { connections: ConnectionCard[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {connections.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Link
            to={c.path}
            style={{
              display: 'block',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.color}33`,
              borderRadius: 10,
              padding: 18,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}33`;
            }}
          >
            <h4 style={{ fontWeight: 600, color: c.color, marginBottom: 8, fontSize: '1.05rem' }}>
              {c.title} →
            </h4>
            <p style={{ color: ASH, lineHeight: 1.6, fontSize: '0.85rem' }}>{c.description}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

export default function HumanRightsHistoryPage() {
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
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────── */}
        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${BLUE}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Long Arc — History of Human Rights (539 BCE–Present)
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '1.05rem', maxWidth: 800 }}>
              Human rights were not discovered — they were fought for. From ancient codes that first
              dared to limit the power of rulers, through Enlightenment philosophy, bloody revolutions,
              the horrors of genocide, and the painstaking construction of international law — the story
              of human rights is the story of humanity arguing about what every person deserves simply
              for being human.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
                marginTop: 12,
              }}
            >
              The arc is long. It does not always bend toward justice. But at every turning point,
              people refused to accept that cruelty was inevitable — and built something new.
            </p>
          </motion.div>

          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Precursors callout ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${EARTH}44`,
            borderRadius: 14,
            padding: 24,
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: EARTH,
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            Precursors — Before the Word "Rights" Existed
          </h3>
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              textAlign: 'center',
              marginBottom: 18,
              lineHeight: 1.6,
            }}
          >
            The Cyrus Cylinder, the Magna Carta, the Iroquois Great Law of Peace — centuries before
            anyone spoke of "human rights," people were already reaching for the idea that power must
            have limits and dignity must be protected.
          </p>
        </motion.div>

        {/* ── 1. Ancient concepts ───────────────────────────── */}
        <SectionWrapper
          id="ancient"
          icon="📜"
          title='Before "Human Rights" — Ancient Codes of Justice'
          accentColor={EARTH}
          intro="Long before the Enlightenment, civilizations across the world grappled with justice, limits on power, and the dignity of the individual. These were not rights in the modern sense — but they planted seeds that would grow for millennia."
        >
          <InsightGrid items={ANCIENT_INSIGHTS} />
        </SectionWrapper>

        {/* ── 2. Enlightenment ──────────────────────────────── */}
        <SectionWrapper
          id="enlightenment"
          icon="💡"
          title="Enlightenment Foundations (1600s–1700s)"
          accentColor={AMBER}
          intro="The 17th and 18th centuries produced the philosophical framework that still underpins human rights today. Thinkers argued that rights are not granted by kings — they are inherent in being human."
        >
          <InsightGrid items={ENLIGHTENMENT_INSIGHTS} />
        </SectionWrapper>

        {/* ── 3. Revolutions ────────────────────────────────── */}
        <SectionWrapper
          id="revolutions"
          icon="⚔️"
          title="American and French Revolutions (1776–1789)"
          accentColor={CRIMSON}
          intro="Philosophy became revolution. Both the American and French declarations proclaimed universal rights — but both were written by men who excluded most of humanity from those rights. The contradiction between the words and the reality would drive centuries of struggle."
        >
          <TimelineCard entries={REVOLUTION_TIMELINE} />
        </SectionWrapper>

        {/* ── 4. Abolition ──────────────────────────────────── */}
        <SectionWrapper
          id="abolition"
          icon="⛓️"
          title="Abolition of Slavery (1787–1888)"
          accentColor={GOLD}
          intro="The abolition of slavery was the first great human rights campaign — and it was waged not by governments, but by the enslaved themselves and their allies. It took a century, a revolution, a civil war, and immeasurable suffering."
        >
          <TimelineCard entries={ABOLITION_TIMELINE} />
        </SectionWrapper>

        {/* ── 5. Women's Suffrage ───────────────────────────── */}
        <SectionWrapper
          id="suffrage"
          icon="🗳️"
          title="Women's Suffrage (1848–2015)"
          accentColor={PURPLE}
          intro='The right to vote — the most basic political right — was denied to half the world\'s population for most of history. The fight for women\'s suffrage was global, spanning from Seneca Falls to Riyadh.'
        >
          <TimelineCard entries={SUFFRAGE_TIMELINE} />
        </SectionWrapper>

        {/* ── 6. Labor Rights ───────────────────────────────── */}
        <SectionWrapper
          id="labor"
          icon="🏭"
          title="Labor Rights (1800s–1900s)"
          accentColor={FLAME}
          intro="The Industrial Revolution created unprecedented wealth — and unprecedented exploitation. The labor rights movement fought for the basic dignities we now take for granted: limits on working hours, safe workplaces, and the end of child labor."
        >
          <InsightGrid items={LABOR_INSIGHTS} />
        </SectionWrapper>

        {/* ── 7. Holocaust ──────────────────────────────────── */}
        <SectionWrapper
          id="holocaust"
          icon="🕯️"
          title="The Holocaust and the Turning Point (1933–1945)"
          accentColor={BLOOD_RED}
          intro="The Holocaust was the catastrophe that forced the world to confront a terrible truth: without international protection, rights mean nothing. The systematic, industrial murder of millions proved that nations could not be trusted to protect their own people."
        >
          <TimelineCard entries={HOLOCAUST_TIMELINE} />
        </SectionWrapper>

        {/* ── 8. UDHR — Centerpiece ─────────────────────────── */}
        <SectionWrapper
          id="udhr"
          icon="🌍"
          title="30 Articles That Changed the World — The UDHR (1948)"
          accentColor={BLUE}
          intro='Out of the ashes of World War II came the most ambitious moral document in human history. The Universal Declaration of Human Rights attempted to define, for the first time, what every human being deserves — regardless of nationality, race, sex, or creed.'
        >
          <FigureSpotlight figure={ELEANOR_ROOSEVELT} />
          <InsightGrid items={UDHR_INSIGHTS} />

          {/* UDHR quote callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BLUE}44`,
              borderRadius: 14,
              padding: 24,
              marginTop: 24,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                color: '#f1f5f9',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                maxWidth: 700,
                margin: '0 auto',
              }}
            >
              "All human beings are born free and equal in dignity and rights. They are endowed with
              reason and conscience and should act towards one another in a spirit of brotherhood."
            </p>
            <p style={{ color: SLATE, fontSize: '0.85rem', marginTop: 12 }}>
              — Universal Declaration of Human Rights, Article 1 (1948)
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── 9. Decolonization ─────────────────────────────── */}
        <SectionWrapper
          id="decolonization"
          icon="🗺️"
          title="Decolonization and Self-Determination (1945–1980)"
          accentColor={JADE}
          intro="The post-war era saw the greatest wave of decolonization in history. Over 50 nations gained independence in two decades. But the end of empire was just the beginning — not the end — of the struggle for rights."
        >
          <InsightGrid items={DECOLONIZATION_INSIGHTS} />
        </SectionWrapper>

        {/* ── 10. Civil Rights ──────────────────────────────── */}
        <SectionWrapper
          id="civil-rights"
          icon="✊"
          title="Civil Rights Movements (1950s–Present)"
          accentColor={INDIGO}
          intro="The UDHR proclaimed rights. Civil rights movements demanded them. Across the world, people organized, marched, sat in, and sacrificed to close the gap between what was written and what was real."
        >
          <TimelineCard entries={CIVIL_RIGHTS_TIMELINE} />
        </SectionWrapper>

        {/* ── 11. International Architecture ────────────────── */}
        <SectionWrapper
          id="architecture"
          icon="🏛️"
          title="International Human Rights Architecture"
          accentColor={SKY}
          intro="After the UDHR, the world built institutions to enforce and monitor human rights. They are imperfect, often toothless, and politically compromised — but they exist, and their existence matters."
        >
          <InsightGrid items={ARCHITECTURE_INSIGHTS} />
        </SectionWrapper>

        {/* ── 12. Still Unfinished ──────────────────────────── */}
        <SectionWrapper
          id="frontiers"
          icon="🔮"
          title="Still Unfinished — Current Frontiers"
          accentColor={ROSE}
          intro="Human rights are not a finished project. New technologies, climate crisis, mass displacement, and persistent inequality mean the struggle continues — in new forms, on new fronts, with new urgency."
        >
          <InsightGrid items={CURRENT_FRONTIERS} />
        </SectionWrapper>

        {/* ── Connections ───────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Connected Stories"
          accentColor={TEAL}
          intro="Human rights history connects to every struggle for dignity. Explore the deeper stories behind each movement."
        >
          <ConnectionCards connections={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 20px',
              fontStyle: 'italic',
            }}
          >
            "The arc of the moral universe is long, but it bends toward justice." — Theodore Parker,
            popularized by Martin Luther King Jr.
          </p>
          <Link
            to="/"
            style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
