/**
 * RevolutionsPage — curated browser of 21 political revolutions that changed world order.
 *
 * Standalone page with inline data, filters, pattern analysis, and lessons section.
 * Route: /revolutions
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────────────

type Outcome = 'Success' | 'Partial' | 'Failed';
type Cause = 'Economic' | 'Political' | 'Colonial' | 'Religious' | 'Social';

interface Revolution {
  name: string;
  dates: string;
  yearStart: number;
  country: string;
  flag: string;
  outcome: Outcome;
  causes: Cause[];
  deathToll: string;
  leaders: string[];
  famousMoment: string;
  impact: string;
  summary: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const REVOLUTIONS: Revolution[] = [
  {
    name: 'English Revolution',
    dates: '1640–1660',
    yearStart: 1640,
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    outcome: 'Partial',
    causes: ['Political', 'Religious'],
    deathToll: '~200,000',
    leaders: ['Oliver Cromwell', 'Charles I', 'Thomas Fairfax'],
    famousMoment: 'Execution of King Charles I (January 30, 1649) — first time a reigning monarch was publicly tried and beheaded by his own subjects.',
    impact: 'Established that Parliament, not the monarch, held supreme authority. Created the model for constitutional limits on royal power that influenced all subsequent democratic movements.',
    summary: 'Parliament challenged the divine right of kings, culminating in civil war, regicide, a brief republic under Cromwell, and eventual restoration — but with permanent limits on royal power.',
  },
  {
    name: 'Glorious Revolution',
    dates: '1688–1689',
    yearStart: 1688,
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    outcome: 'Success',
    causes: ['Political', 'Religious'],
    deathToll: '~50 (largely bloodless)',
    leaders: ['William III of Orange', 'Mary II', 'John Locke'],
    famousMoment: 'James II fled to France without a fight — power transferred through an invitation, not a battle.',
    impact: 'Produced the English Bill of Rights (1689), establishing constitutional monarchy, parliamentary sovereignty, and individual rights. Direct intellectual ancestor of the American Revolution.',
    summary: 'Protestant nobles invited William of Orange to replace the Catholic James II. Nearly bloodless transfer of power that permanently established constitutional monarchy and parliamentary supremacy.',
  },
  {
    name: 'American Revolution',
    dates: '1765–1783',
    yearStart: 1765,
    country: 'United States',
    flag: '🇺🇸',
    outcome: 'Success',
    causes: ['Political', 'Economic', 'Colonial'],
    deathToll: '~25,000–70,000',
    leaders: ['George Washington', 'Thomas Jefferson', 'Benjamin Franklin', 'John Adams'],
    famousMoment: 'Signing of the Declaration of Independence (July 4, 1776) — "We hold these truths to be self-evident, that all men are created equal."',
    impact: 'Created the first modern republic based on Enlightenment ideals. The Constitution and Bill of Rights became templates for democratic governance worldwide.',
    summary: 'Thirteen colonies broke from Britain over taxation without representation, declaring independence and establishing a constitutional republic after eight years of war.',
  },
  {
    name: 'French Revolution',
    dates: '1789–1799',
    yearStart: 1789,
    country: 'France',
    flag: '🇫🇷',
    outcome: 'Partial',
    causes: ['Economic', 'Political', 'Social'],
    deathToll: '~40,000 (Reign of Terror) + ~250,000 (wars)',
    leaders: ['Maximilien Robespierre', 'Georges Danton', 'Marquis de Lafayette', 'Napoleon Bonaparte'],
    famousMoment: 'Storming of the Bastille (July 14, 1789) — a medieval fortress-prison became the symbol of royal tyranny torn down by the people.',
    impact: 'Ended feudalism in France, established the metric system, civil code (Napoleonic Code), and the concept of citizens\' rights. Inspired revolutionary movements worldwide for two centuries.',
    summary: 'Economic crisis and Enlightenment ideas fueled popular uprising against the monarchy. Produced the Declaration of the Rights of Man, but devolved into the Terror before Napoleon seized control.',
  },
  {
    name: 'Haitian Revolution',
    dates: '1791–1804',
    yearStart: 1791,
    country: 'Haiti',
    flag: '🇭🇹',
    outcome: 'Success',
    causes: ['Colonial', 'Social', 'Economic'],
    deathToll: '~100,000–350,000',
    leaders: ['Toussaint Louverture', 'Jean-Jacques Dessalines', 'Henri Christophe'],
    famousMoment: 'Dessalines proclaimed independence (January 1, 1804) — the only successful large-scale slave revolt in history.',
    impact: 'First Black republic, first post-colonial independent nation in Latin America. Proved that enslaved people could overthrow colonial powers. Inspired abolitionist movements globally.',
    summary: 'Enslaved Africans in the French colony of Saint-Domingue rose up, defeated French, Spanish, and British forces, and established the first free Black republic in the Western Hemisphere.',
  },
  {
    name: 'Latin American Revolutions',
    dates: '1808–1826',
    yearStart: 1808,
    country: 'South America',
    flag: '🌎',
    outcome: 'Success',
    causes: ['Colonial', 'Political', 'Economic'],
    deathToll: '~500,000–1,000,000',
    leaders: ['Simón Bolívar', 'José de San Martín', 'Bernardo O\'Higgins', 'Miguel Hidalgo'],
    famousMoment: 'Bolívar\'s crossing of the Andes (1819) — a military feat rivaling Hannibal\'s, leading to the liberation of Colombia.',
    impact: 'Ended Spanish and Portuguese colonial rule across the Americas. Created over a dozen independent nations. Established the principle that colonized peoples had the right to self-determination.',
    summary: 'Wave of independence movements swept across Spanish and Portuguese America, led by creole elites inspired by Enlightenment ideals and taking advantage of Napoleon\'s invasion of Spain.',
  },
  {
    name: 'Greek War of Independence',
    dates: '1821–1829',
    yearStart: 1821,
    country: 'Greece',
    flag: '🇬🇷',
    outcome: 'Success',
    causes: ['Colonial', 'Political', 'Social'],
    deathToll: '~50,000–120,000',
    leaders: ['Theodoros Kolokotronis', 'Alexandros Ypsilantis', 'Lord Byron'],
    famousMoment: 'Lord Byron\'s death at Missolonghi (1824) — the Romantic poet\'s sacrifice galvanized European support for Greek independence.',
    impact: 'First successful national liberation movement in the Ottoman Empire. Sparked Romantic nationalism across Europe and established the principle of national self-determination.',
    summary: 'Greeks rose against four centuries of Ottoman rule, supported by Romantic idealists across Europe. Resulted in an independent Greek state and inspired nationalist movements throughout the Balkans.',
  },
  {
    name: 'Revolutions of 1848',
    dates: '1848–1849',
    yearStart: 1848,
    country: 'Europe',
    flag: '🌍',
    outcome: 'Failed',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~10,000+',
    leaders: ['Lajos Kossuth', 'Giuseppe Mazzini', 'Louis Blanc', 'Frederick William IV'],
    famousMoment: 'The "Springtime of Nations" — over 50 countries erupted in revolution within months, the most widespread revolutionary wave in European history.',
    impact: 'Though mostly defeated, the revolutions ended serfdom in the Habsburg Empire, planted seeds for Italian and German unification, and advanced workers\' rights movements.',
    summary: 'Unprecedented wave of liberal, nationalist, and socialist uprisings swept across Europe. Nearly all were suppressed within a year, but they permanently shifted the political landscape.',
  },
  {
    name: 'Paris Commune',
    dates: '1871',
    yearStart: 1871,
    country: 'France',
    flag: '🇫🇷',
    outcome: 'Failed',
    causes: ['Economic', 'Social', 'Political'],
    deathToll: '~10,000–20,000 (Bloody Week)',
    leaders: ['Louise Michel', 'Eugène Varlin', 'Charles Delescluze'],
    famousMoment: 'Bloody Week (May 21–28, 1871) — the French Army massacred an estimated 10,000–20,000 Communards in the streets of Paris.',
    impact: 'First working-class government in history, lasting 72 days. Inspired Marx, Lenin, and all subsequent socialist movements. Introduced progressive policies: free education, separation of church and state, women\'s rights.',
    summary: 'After France\'s defeat by Prussia, Parisian workers established a radical socialist government for 72 days before being crushed by the French army in a week of brutal street fighting.',
  },
  {
    name: 'Mexican Revolution',
    dates: '1910–1920',
    yearStart: 1910,
    country: 'Mexico',
    flag: '🇲🇽',
    outcome: 'Partial',
    causes: ['Economic', 'Social', 'Political'],
    deathToll: '~1,000,000–2,000,000',
    leaders: ['Emiliano Zapata', 'Pancho Villa', 'Francisco Madero', 'Venustiano Carranza'],
    famousMoment: 'Zapata\'s Plan de Ayala (1911) — "Tierra y Libertad" (Land and Liberty) became the rallying cry of peasant revolutionaries demanding agrarian reform.',
    impact: 'Produced one of the world\'s first social constitutions (1917), enshrining labor rights, land reform, and public education. Shaped modern Mexican identity and politics.',
    summary: 'Dictator Porfirio Díaz was ousted by a coalition of peasants, workers, and middle-class reformers. A decade of civil war produced a new constitution but left deep political divisions.',
  },
  {
    name: 'Russian Revolution',
    dates: '1917',
    yearStart: 1917,
    country: 'Russia',
    flag: '🇷🇺',
    outcome: 'Success',
    causes: ['Economic', 'Political', 'Social'],
    deathToll: '~5,000,000–9,000,000 (revolution + civil war)',
    leaders: ['Vladimir Lenin', 'Leon Trotsky', 'Alexander Kerensky', 'Tsar Nicholas II'],
    famousMoment: 'Storming of the Winter Palace (October 25, 1917) — Bolsheviks seized the seat of government, marking the birth of the Soviet state.',
    impact: 'Created the world\'s first socialist state, reshaping global politics for 74 years. Inspired communist movements worldwide and defined the ideological battle lines of the 20th century.',
    summary: 'Two revolutions in one year: February toppled the Tsar, October brought Lenin\'s Bolsheviks to power. The resulting Soviet Union became a superpower that shaped the entire 20th century.',
  },
  {
    name: 'Chinese Revolution',
    dates: '1946–1949',
    yearStart: 1946,
    country: 'China',
    flag: '🇨🇳',
    outcome: 'Success',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~6,000,000 (civil war)',
    leaders: ['Mao Zedong', 'Zhou Enlai', 'Chiang Kai-shek', 'Zhu De'],
    famousMoment: 'Mao proclaimed the People\'s Republic from Tiananmen Gate (October 1, 1949) — "The Chinese people have stood up!"',
    impact: 'Transformed the world\'s most populous nation into a communist state. Reshaped Cold War dynamics, led to massive social experiments (Great Leap Forward, Cultural Revolution), and set the stage for China\'s current superpower status.',
    summary: 'After decades of civil war, foreign invasion, and warlord chaos, Mao\'s Communist forces defeated the Nationalists and established the People\'s Republic, transforming China and global power dynamics.',
  },
  {
    name: 'Cuban Revolution',
    dates: '1953–1959',
    yearStart: 1953,
    country: 'Cuba',
    flag: '🇨🇺',
    outcome: 'Success',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~2,000–5,000',
    leaders: ['Fidel Castro', 'Che Guevara', 'Camilo Cienfuegos', 'Raúl Castro'],
    famousMoment: 'Castro\'s guerrillas entered Havana (January 1, 1959) — Batista had fled the night before, and crowds poured into the streets.',
    impact: 'Brought Cold War confrontation to the Western Hemisphere (Bay of Pigs, Missile Crisis). Che Guevara became the universal icon of revolutionary struggle. Cuba\'s socialist model influenced movements across Latin America and Africa.',
    summary: 'Small guerrilla force under Castro overthrew the US-backed Batista dictatorship, establishing a socialist state 90 miles from Florida that defied American hegemony for decades.',
  },
  {
    name: 'Algerian War of Independence',
    dates: '1954–1962',
    yearStart: 1954,
    country: 'Algeria',
    flag: '🇩🇿',
    outcome: 'Success',
    causes: ['Colonial', 'Political', 'Social'],
    deathToll: '~400,000–1,500,000',
    leaders: ['Ahmed Ben Bella', 'Houari Boumédiène', 'Frantz Fanon', 'Djamila Bouhired'],
    famousMoment: 'Battle of Algiers (1956–57) — the urban guerrilla warfare that exposed the moral contradictions of colonialism and inspired anti-colonial struggles worldwide.',
    impact: 'Ended 132 years of French colonial rule. Frantz Fanon\'s "The Wretched of the Earth" became the bible of decolonization movements. Contributed to the fall of France\'s Fourth Republic.',
    summary: 'The FLN waged a brutal eight-year war against French colonial rule, using guerrilla tactics and international diplomacy to win independence for Algeria at enormous human cost.',
  },
  {
    name: 'Iranian Revolution',
    dates: '1978–1979',
    yearStart: 1978,
    country: 'Iran',
    flag: '🇮🇷',
    outcome: 'Success',
    causes: ['Political', 'Religious', 'Social'],
    deathToll: '~3,000–60,000',
    leaders: ['Ayatollah Ruhollah Khomeini', 'Mehdi Bazargan', 'Ali Shariati'],
    famousMoment: 'Khomeini\'s return from exile (February 1, 1979) — millions lined the streets of Tehran as the Ayatollah arrived to take control of the revolution.',
    impact: 'Created the first modern theocracy. Transformed Middle Eastern geopolitics, inspired Islamic political movements worldwide, and initiated decades of tension between Iran and the West.',
    summary: 'Mass protests by a broad coalition — Islamists, leftists, liberals — overthrew the Western-backed Shah. Khomeini hijacked the revolution to establish an Islamic Republic that continues today.',
  },
  {
    name: 'Nicaraguan Revolution',
    dates: '1978–1979',
    yearStart: 1978,
    country: 'Nicaragua',
    flag: '🇳🇮',
    outcome: 'Partial',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~30,000–50,000',
    leaders: ['Daniel Ortega', 'Carlos Fonseca', 'Tomás Borge', 'Violeta Chamorro'],
    famousMoment: 'Sandinistas entered Managua (July 19, 1979) — half a million people celebrated the fall of the Somoza dynasty that had ruled for 43 years.',
    impact: 'The Sandinista government\'s literacy campaign and social reforms became a model, while the US-funded Contra war made Nicaragua a Cold War flashpoint (Iran-Contra scandal).',
    summary: 'Sandinista guerrillas overthrew the corrupt Somoza dynasty, then faced a devastating US-backed Contra war. Eventually lost power in democratic elections but returned in 2007.',
  },
  {
    name: 'Velvet Revolution',
    dates: '1989',
    yearStart: 1989,
    country: 'Czechoslovakia',
    flag: '🇨🇿',
    outcome: 'Success',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '0 (peaceful)',
    leaders: ['Václav Havel', 'Alexander Dubček', 'Marta Kubišová'],
    famousMoment: 'Václav Havel — a playwright and dissident imprisoned by the communists — became president within six weeks of the first protests.',
    impact: 'Proved that a communist regime could be toppled peacefully through mass civic action. Havel became a global symbol of the power of moral courage against tyranny.',
    summary: 'Student protests snowballed into a peaceful revolution that ended 41 years of communist rule in Czechoslovakia within days. A dissident playwright became president.',
  },
  {
    name: 'Fall of the Berlin Wall',
    dates: '1989',
    yearStart: 1989,
    country: 'Germany',
    flag: '🇩🇪',
    outcome: 'Success',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '0 (peaceful)',
    leaders: ['Helmut Kohl', 'Mikhail Gorbachev', 'Günter Schabowski'],
    famousMoment: 'November 9, 1989 — a bungled press conference announcement led East Germans to flood the checkpoints. Guards stepped aside. The Wall fell overnight.',
    impact: 'Ended the Cold War division of Europe. Led to German reunification, NATO expansion eastward, and the collapse of the Soviet Union within two years.',
    summary: 'A miscommunicated press statement opened the Berlin Wall, and jubilant crowds tore it apart. The Cold War\'s most powerful symbol crumbled overnight, leading to German reunification.',
  },
  {
    name: 'Romanian Revolution',
    dates: '1989',
    yearStart: 1989,
    country: 'Romania',
    flag: '🇷🇴',
    outcome: 'Partial',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~1,100',
    leaders: ['Ion Iliescu', 'László Tőkés', 'Nicolae Ceaușescu'],
    famousMoment: 'Ceaușescu\'s final speech (December 21, 1989) — the dictator appeared on the balcony to address a rally, and the crowd began to boo. His stunned face was broadcast live worldwide.',
    impact: 'Only violent revolution of the 1989 wave. The summary execution of Ceaușescu and his wife on Christmas Day showed the dangers of resisting change. Romania\'s transition to democracy was slower and rockier than its neighbors.',
    summary: 'The only violent overthrow in the 1989 Eastern European revolutions. Ceaușescu was booed off his own balcony, fled by helicopter, was captured and executed on Christmas Day.',
  },
  {
    name: 'Arab Spring',
    dates: '2010–2012',
    yearStart: 2010,
    country: 'Middle East / North Africa',
    flag: '🌍',
    outcome: 'Partial',
    causes: ['Political', 'Economic', 'Social'],
    deathToll: '~60,000+',
    leaders: ['Mohamed Bouazizi', 'Wael Ghonim', 'Tawakkol Karman'],
    famousMoment: 'Mohamed Bouazizi\'s self-immolation (December 17, 2010) — a Tunisian street vendor\'s desperate act of protest sparked revolutions across an entire region.',
    impact: 'Toppled dictators in Tunisia, Egypt, Libya, and Yemen. But also led to civil wars (Syria, Libya, Yemen), military coups (Egypt), and the rise of ISIS. Tunisia was the only relative success.',
    summary: 'A wave of protests and uprisings swept across the Arab world, toppling long-standing dictators. Results ranged from democratic transition (Tunisia) to civil war (Syria, Libya) to restored authoritarianism (Egypt).',
  },
  {
    name: 'Color Revolutions',
    dates: '2003–2005',
    yearStart: 2003,
    country: 'Post-Soviet States',
    flag: '🌍',
    outcome: 'Partial',
    causes: ['Political', 'Social'],
    deathToll: '~100',
    leaders: ['Mikheil Saakashvili', 'Viktor Yushchenko', 'Kurmanbek Bakiyev'],
    famousMoment: 'Ukraine\'s Orange Revolution (2004) — hundreds of thousands camped in Kyiv\'s freezing Maidan square for weeks until fraudulent election results were overturned.',
    impact: 'Demonstrated that post-Soviet states could challenge authoritarian rule through mass peaceful protest. However, many gains were later reversed, and Russia viewed them as Western-backed threats.',
    summary: 'Series of largely peaceful mass movements in Georgia (Rose, 2003), Ukraine (Orange, 2004), and Kyrgyzstan (Tulip, 2005) challenged fraudulent elections and authoritarian rule with mixed lasting results.',
  },
];

// ─── Constants ──────────────────────────────────────────────────────────────

const OUTCOME_COLORS: Record<Outcome, string> = {
  Success: '#22c55e',
  Partial: '#f59e0b',
  Failed: '#ef4444',
};

const CAUSE_COLORS: Record<Cause, string> = {
  Economic: '#3b82f6',
  Political: '#a855f7',
  Colonial: '#f97316',
  Religious: '#eab308',
  Social: '#ec4899',
};

const ALL_OUTCOMES: Outcome[] = ['Success', 'Partial', 'Failed'];
const ALL_CAUSES: Cause[] = ['Economic', 'Political', 'Colonial', 'Religious', 'Social'];

// ─── Trigger Patterns ───────────────────────────────────────────────────────

const TRIGGER_PATTERNS = [
  {
    pattern: 'Economic Crisis',
    description: 'Bread prices, famine, inequality, or economic collapse preceded the uprising.',
    revolutions: ['French Revolution', 'Russian Revolution', 'Mexican Revolution', 'Arab Spring', 'Revolutions of 1848'],
    icon: '📉',
  },
  {
    pattern: 'Colonial Oppression',
    description: 'People under foreign rule demanded self-determination and national sovereignty.',
    revolutions: ['American Revolution', 'Haitian Revolution', 'Latin American Revolutions', 'Greek War of Independence', 'Algerian War of Independence'],
    icon: '⛓️',
  },
  {
    pattern: 'Regime Decay',
    description: 'Aging authoritarian regimes lost legitimacy, creating power vacuums.',
    revolutions: ['Cuban Revolution', 'Iranian Revolution', 'Velvet Revolution', 'Fall of the Berlin Wall', 'Romanian Revolution'],
    icon: '🏚️',
  },
  {
    pattern: 'Contagion Effect',
    description: 'One revolution inspired another in rapid succession across borders.',
    revolutions: ['Revolutions of 1848', 'Latin American Revolutions', 'Color Revolutions', 'Arab Spring', 'Fall of the Berlin Wall'],
    icon: '🔥',
  },
];

// ─── Lessons ────────────────────────────────────────────────────────────────

const LESSONS = [
  {
    title: 'Revolutions succeed when the army switches sides',
    detail: 'In nearly every successful revolution — American, French, Russian, Cuban — a critical mass of military forces either defected or refused to fire. When the army stays loyal (1848, Paris Commune), revolutions fail.',
  },
  {
    title: 'Coalitions overthrow; factions inherit',
    detail: 'Broad coalitions of liberals, workers, nationalists, and intellectuals start revolutions. But the most organized faction — usually the most radical — ends up in power (Bolsheviks, Khomeini, Castro).',
  },
  {
    title: 'External intervention determines outcomes',
    detail: 'Foreign support (France in the American Revolution, USSR in Cuba) or foreign opposition (US Contra war in Nicaragua, European intervention against the Paris Commune) often decides which revolutions survive.',
  },
  {
    title: 'Peaceful revolutions produce more stable democracies',
    detail: 'The Velvet Revolution, Fall of the Berlin Wall, and Glorious Revolution all transitioned peacefully and produced lasting democratic institutions. Violent revolutions (French, Russian, Chinese) tended toward authoritarian successors.',
  },
  {
    title: 'Revolutions eat their children',
    detail: 'Revolutionary leaders are frequently consumed by their own movements: Robespierre guillotined, Trotsky exiled and assassinated, Danton executed, Ceaușescu shot. The revolution demands ever-greater purity.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function RevolutionsPage() {
  const [outcomeFilter, setOutcomeFilter] = useState<Outcome | 'All'>('All');
  const [causeFilter, setCauseFilter] = useState<Cause | 'All'>('All');

  const filtered = useMemo(() => {
    return REVOLUTIONS.filter((r) => {
      if (outcomeFilter !== 'All' && r.outcome !== outcomeFilter) return false;
      if (causeFilter !== 'All' && !r.causes.includes(causeFilter)) return false;
      return true;
    });
  }, [outcomeFilter, causeFilter]);

  const outcomeCounts = useMemo(() => {
    const counts: Record<Outcome, number> = { Success: 0, Partial: 0, Failed: 0 };
    REVOLUTIONS.forEach((r) => counts[r.outcome]++);
    return counts;
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
      overflowY: 'auto',
    }}>
      {/* Navigation */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          ← Back to Chronicle
        </Link>
      </div>

      {/* Hero */}
      <header style={{
        textAlign: 'center',
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, rgba(168,85,247,0.15) 0%, transparent 100%)',
      }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: 42, fontWeight: 800, margin: 0, lineHeight: 1.2 }}
        >
          When People Overthrew Power
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ fontSize: 22, color: '#a855f7', margin: '8px 0 0', fontWeight: 600 }}
        >
          The Great Revolutions
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ fontSize: 16, color: '#94a3b8', marginTop: 16, fontStyle: 'italic' }}
        >
          Every revolution begins as an impossible idea
        </motion.p>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── Outcome Tracker ───────────────────────────────────────────── */}
        <Section title="Revolution vs. Counterrevolution" icon="⚖️">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {ALL_OUTCOMES.map((o) => (
              <div key={o} style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{
                  fontSize: 42, fontWeight: 800, color: OUTCOME_COLORS[o],
                }}>
                  {outcomeCounts[o]}
                </div>
                <div style={{ fontSize: 14, color: '#94a3b8' }}>{o}</div>
                <div style={{
                  marginTop: 8, height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(outcomeCounts[o] / REVOLUTIONS.length) * 100}%`,
                    height: '100%',
                    background: OUTCOME_COLORS[o],
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Filters ──────────────────────────────────────────────────── */}
        <Section title="Filter Revolutions" icon="🔍">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Outcome</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <FilterBtn label="All" active={outcomeFilter === 'All'} onClick={() => setOutcomeFilter('All')} />
                {ALL_OUTCOMES.map((o) => (
                  <FilterBtn key={o} label={o} active={outcomeFilter === o} color={OUTCOME_COLORS[o]} onClick={() => setOutcomeFilter(o)} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Cause</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <FilterBtn label="All" active={causeFilter === 'All'} onClick={() => setCauseFilter('All')} />
                {ALL_CAUSES.map((c) => (
                  <FilterBtn key={c} label={c} active={causeFilter === c} color={CAUSE_COLORS[c]} onClick={() => setCauseFilter(c)} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 14, color: '#64748b' }}>
            Showing {filtered.length} of {REVOLUTIONS.length} revolutions
          </div>
        </Section>

        {/* ── Revolution Cards ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
          {filtered.map((rev, i) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.5) }}
            >
              <RevolutionCard rev={rev} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              No revolutions match the selected filters.
            </div>
          )}
        </div>

        {/* ── What Triggered It? ───────────────────────────────────────── */}
        <Section title="What Triggered It?" icon="💥" style={{ marginTop: 48 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 20px' }}>
            Common patterns that precede revolutionary upheaval
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {TRIGGER_PATTERNS.map((tp) => (
              <div key={tp.pattern} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 20,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{tp.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{tp.pattern}</div>
                <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 12px', lineHeight: 1.5 }}>{tp.description}</p>
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  {tp.revolutions.map((name, j) => (
                    <span key={name}>{j > 0 ? ' · ' : ''}{name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Lessons ──────────────────────────────────────────────────── */}
        <Section title="Lessons — What Determines Success?" icon="📜" style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LESSONS.map((lesson, i) => (
              <motion.div
                key={lesson.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {i + 1}. {lesson.title}
                </div>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{lesson.detail}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <Section title="Timeline" icon="📅" style={{ marginTop: 48 }}>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{
              position: 'absolute', left: 8, top: 0, bottom: 0, width: 2,
              background: 'rgba(168,85,247,0.3)',
            }} />
            {REVOLUTIONS.map((rev) => (
              <div key={rev.name} style={{ position: 'relative', marginBottom: 16, paddingLeft: 20 }}>
                <div style={{
                  position: 'absolute', left: -20, top: 6, width: 12, height: 12,
                  borderRadius: '50%', background: OUTCOME_COLORS[rev.outcome],
                  border: '2px solid #070e22',
                }} />
                <div style={{ fontSize: 12, color: '#64748b' }}>{rev.dates}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rev.flag} {rev.name}
                  <span style={{
                    marginLeft: 8, fontSize: 11, padding: '2px 6px',
                    borderRadius: 4, background: OUTCOME_COLORS[rev.outcome] + '22',
                    color: OUTCOME_COLORS[rev.outcome],
                  }}>
                    {rev.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Section({ title, icon, children, style }: {
  title: string;
  icon: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section style={{
      marginTop: 32,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: 28,
      ...style,
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </section>
  );
}

function FilterBtn({ label, active, color, onClick }: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: active
          ? `1px solid ${color || '#a855f7'}`
          : '1px solid rgba(255,255,255,0.12)',
        background: active
          ? (color || '#a855f7') + '22'
          : 'transparent',
        color: active ? (color || '#a855f7') : '#94a3b8',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

function RevolutionCard({ rev }: { rev: Revolution }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '20px 24px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22 }}>{rev.flag}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{rev.name}</h3>
            <span style={{
              fontSize: 12, padding: '2px 8px', borderRadius: 6,
              background: OUTCOME_COLORS[rev.outcome] + '22',
              color: OUTCOME_COLORS[rev.outcome],
              fontWeight: 600,
            }}>
              {rev.outcome}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>
            {rev.dates} · {rev.country} · {rev.deathToll} casualties
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {rev.causes.map((c) => (
              <span key={c} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 4,
                background: CAUSE_COLORS[c] + '18',
                color: CAUSE_COLORS[c],
                fontWeight: 600,
              }}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          fontSize: 18, color: '#64748b', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
          flexShrink: 0,
          marginTop: 4,
        }}>
          ▾
        </div>
      </div>

      {/* Summary (always visible) */}
      <div style={{ padding: '0 24px 16px', fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
        {rev.summary}
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '20px 24px',
          }}
        >
          <DetailRow label="Key Leaders" value={rev.leaders.join(', ')} />
          <DetailRow label="Famous Moment" value={rev.famousMoment} />
          <DetailRow label="Lasting Impact" value={rev.impact} />
        </motion.div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#cbd5e1' }}>{value}</div>
    </div>
  );
}
