import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Theme colours ── */
const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const ROYAL_BLUE = '#2563eb';
const EMERALD = '#10b981';
const AMBER = '#d97706';
const VIOLET = '#8b5cf6';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const SLATE = '#94a3b8';
const ASH = '#cbd5e1';
const SILVER = '#a1a1aa';
const SKY = '#38bdf8';
const ORANGE = '#f97316';
const BURGUNDY = '#991b1b';

const FIGURE_COLORS = [CRIMSON, GOLD, ROYAL_BLUE, EMERALD, AMBER, VIOLET, TEAL, ROSE];

/* ── Interfaces ── */
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

interface DualPowerEntry {
  name: string;
  side: 'provisional' | 'soviet';
}

/* ── Key Stats ── */
const KEY_STATS: InsightEntry[] = [
  { label: '3.3 million', detail: 'Russian military dead in WWI — highest of any nation' },
  { label: '8 days', detail: 'February Revolution: 300-year Romanov dynasty ended in 8 days of protests' },
  { label: '7–12 million', detail: 'Civil War dead — mostly civilians from famine and disease' },
  { label: '74 years', detail: 'Soviet Union lasted from 1922 to 1991' },
  { label: '1/3 of humanity', detail: 'At peak, one-third of the world lived under communist governments' },
  { label: '750,000 executed', detail: "Stalin's Great Purge (1936–1938) — millions more imprisoned" },
];

/* ── Russia Before the Revolution ── */
const TSARIST_RUSSIA: InsightEntry[] = [
  { label: 'Absolute autocracy', detail: 'Nicholas II ruled 160 million people with absolute power. No constitution, no parliament, no legal opposition. The Tsar was considered God\'s representative on Earth — questioning him was both treason and blasphemy.' },
  { label: '80% peasants', detail: 'The vast majority of Russians were peasants, many still living in conditions resembling feudalism. Serfdom had only been abolished in 1861, and most peasants remained landless, illiterate, and desperately poor.' },
  { label: 'Rapid industrialization', detail: 'Between the 1890s and 1910s, Russia underwent breakneck industrialization. A new urban working class emerged — crammed into factory dormitories, working 14-hour days, with no labor protections. The conditions that had fueled European revolutions decades earlier were now concentrated in Russian cities.' },
  { label: '1905 Revolution', detail: 'Bloody Sunday (January 1905): soldiers fired on peaceful petitioners marching to the Winter Palace. The massacre triggered general strikes and the first creation of Soviets (workers\' councils). The Tsar survived but was forced to concede the Duma — a parliament with limited powers he would repeatedly dissolve.' },
  { label: 'Political landscape', detail: 'Three main opposition groups: the Socialist Revolutionaries (peasant-focused), the Mensheviks (moderate socialists who wanted gradual change), and the Bolsheviks — Lenin\'s disciplined, radical vanguard party that believed revolution required a small, professional core of revolutionaries to lead the masses.' },
];

/* ── WWI as Catalyst ── */
const WWI_CATALYST: InsightEntry[] = [
  { label: 'Catastrophic losses', detail: 'Russia entered WWI in 1914 with the largest army in Europe — and the worst equipped. Soldiers shared rifles. Artillery shells ran out within weeks. By 1917, 3.3 million were dead, millions more wounded or captured.' },
  { label: 'Food crisis', detail: 'The war devoured resources. Railways prioritized military transport, cutting food supplies to cities. Bread prices soared. By early 1917, Petrograd residents were spending hours in bread lines in sub-zero temperatures — while reading newspaper reports of the Tsarina\'s lavish court.' },
  { label: 'Army disintegration', detail: 'Soldiers were deserting by the thousands. Entire units refused orders. Officers who pushed too hard were shot by their own men. The army that was supposed to protect the autocracy was turning against it.' },
  { label: 'Rasputin', detail: 'Grigori Rasputin — a Siberian mystic who claimed to heal the hemophiliac heir — gained extraordinary influence over Tsarina Alexandra while Nicholas was at the front. His debauchery and political meddling scandalized the public and undermined what remained of the monarchy\'s legitimacy. He was assassinated by nobles in December 1916 — poisoned, shot, and drowned.' },
];

/* ── February Revolution Timeline ── */
const FEBRUARY_TIMELINE: TimelineEntry[] = [
  { year: 'Feb 23 (Mar 8)', title: 'International Women\'s Day', description: 'Women textile workers in Petrograd walk off the job demanding bread. They march to nearby factories, pulling tens of thousands of workers into the streets. This was not planned by any party — it was spontaneous fury.', color: ROSE },
  { year: 'Feb 24–25', title: 'General strike', description: 'The strike spreads across Petrograd. Over 200,000 workers are now in the streets. Cossacks sent to disperse them refuse to charge. Some wink at the crowds. The mood shifts from protest to revolution.', color: CRIMSON },
  { year: 'Feb 27', title: 'Soldiers mutiny', description: 'The Volynsky Regiment refuses to fire on demonstrators, then turns their guns over to the crowd. Other garrisons follow. Armed workers and soldiers seize the arsenal, the telephone exchange, railway stations. The Petrograd Soviet reconvenes.', color: AMBER },
  { year: 'Mar 2', title: 'Nicholas II abdicates', description: 'Trapped on a train, abandoned by his generals, Nicholas abdicates for himself and his son. "All around me is treachery, cowardice, and deceit," he writes in his diary. The 300-year Romanov dynasty ends with a signature on a railway car.', color: GOLD },
  { year: 'Mar 2–3', title: 'Dual power begins', description: 'Two bodies claim authority simultaneously: the Provisional Government (liberal Duma members, committed to democracy and continuing the war) and the Petrograd Soviet (workers\' and soldiers\' deputies, controlling the factories and garrison). Neither has full power. Both distrust the other.', color: ROYAL_BLUE },
];

/* ── Dual Power ── */
const DUAL_POWER: DualPowerEntry[] = [
  { name: 'Liberal ministers & Duma leaders', side: 'provisional' },
  { name: 'Committed to constitutional democracy', side: 'provisional' },
  { name: 'Continued the war (fatal mistake)', side: 'provisional' },
  { name: 'Recognized by Western allies', side: 'provisional' },
  { name: 'Workers\' and soldiers\' deputies', side: 'soviet' },
  { name: 'Controlled factories, railways, garrison', side: 'soviet' },
  { name: 'Demanded peace and land reform', side: 'soviet' },
  { name: 'Real power on the streets', side: 'soviet' },
];

/* ── April Theses ── */
const APRIL_THESES: InsightEntry[] = [
  { label: 'The sealed train', detail: 'Lenin had been in Swiss exile for years. Germany — hoping he would destabilize Russia and take it out of the war — provided a sealed train to transport him back to Petrograd in April 1917. It was one of the most consequential gambles in military history: it worked beyond Germany\'s wildest expectations.' },
  { label: '"Peace, Land, Bread"', detail: 'Lenin\'s April Theses (April 4, 1917) distilled the revolution into three words everyone understood. Immediate end to the war. Redistribute land to peasants. All power to the Soviets. While other parties debated theory, Lenin spoke to what people actually wanted.' },
  { label: 'From isolation to majority', detail: 'When Lenin arrived, the Bolsheviks were a minority even within the Soviet — most socialists thought his program was madness. But as the Provisional Government failed to deliver peace or bread, support shifted. By September 1917, Bolsheviks held the majority in both the Petrograd and Moscow Soviets.' },
  { label: 'The Kornilov Affair', detail: 'In August, General Kornilov attempted a military coup against the Provisional Government. Kerensky armed the Bolsheviks to help defeat it. The coup failed — but the Bolsheviks kept the weapons. The very government they planned to overthrow had armed them.' },
];

/* ── October Revolution Timeline ── */
const OCTOBER_TIMELINE: TimelineEntry[] = [
  { year: 'Oct 10 (Oct 23)', title: 'Bolshevik Central Committee votes for insurrection', description: 'Lenin, disguised in a wig, attends a secret meeting. The vote is 10-2 in favor of armed uprising. Trotsky, as chair of the Petrograd Soviet, begins organizing the Military Revolutionary Committee — the operational arm of the coup.', color: CRIMSON },
  { year: 'Oct 24 (Nov 6)', title: 'Red Guards seize key infrastructure', description: 'Through the night, Bolshevik Red Guards and sympathetic soldiers systematically seize railways, telegraph offices, power stations, bridges, and the state bank. No dramatic battles — small squads simply walk in and take over. The Provisional Government barely resists.', color: AMBER },
  { year: 'Oct 25, 9:40 PM', title: 'Aurora fires blank shot', description: 'The cruiser Aurora, anchored on the Neva River, fires a single blank shot at the Winter Palace — the signal for the final assault. It was more theatrical than military: the palace was defended by a women\'s battalion and military cadets.', color: GOLD },
  { year: 'Oct 25, 2:10 AM', title: 'Winter Palace falls', description: 'Red Guards enter the Winter Palace through unlocked side doors. The Provisional Government ministers are arrested in a back room. Kerensky had already fled in a car borrowed from the American embassy. Almost no bloodshed.', color: ROSE },
  { year: 'Oct 25–26', title: 'Soviet power declared', description: 'The Second All-Russian Congress of Soviets convenes. Mensheviks and SRs walk out in protest — Trotsky tells them to go "into the dustbin of history." Lenin announces three decrees: immediate peace negotiations, land to the peasants, a Soviet government. The world will never be the same.', color: EMERALD },
];

/* ── Key Figures ── */
const KEY_FIGURES: FigureEntry[] = [
  { name: 'Vladimir Lenin', years: '1870–1924', contribution: 'Intellectual leader and ruthless strategist. The "professional revolutionary" who spent decades in exile theorizing, then seized power in a single night. Created the model for 20th-century revolutionary movements. Died in 1924 — his embalmed body still lies in Red Square.' },
  { name: 'Leon Trotsky', years: '1879–1940', contribution: 'Organized the October coup and created the Red Army from nothing, leading it to victory in the Civil War. Brilliant orator and writer. Lost the power struggle to Stalin, was expelled from the USSR, and was assassinated with an ice axe in Mexico City by a Soviet agent in 1940.' },
  { name: 'Joseph Stalin', years: '1878–1953', contribution: 'Quiet party organizer who outmaneuvered every rival through control of bureaucratic appointments. Transformed the USSR into an industrial superpower through forced collectivization and Five-Year Plans — at a cost of millions of lives. His reign of terror defined the 20th century.' },
  { name: 'Alexandra Kollontai', years: '1872–1952', contribution: 'Feminist Bolshevik who became the first female cabinet minister in history (People\'s Commissar for Social Welfare). Championed women\'s liberation, free love, and communal childcare. Later served as the world\'s first female ambassador. One of the few Old Bolsheviks to survive Stalin\'s purges.' },
  { name: 'Rosa Luxemburg', years: '1871–1919', contribution: 'Polish-German communist who supported the Russian Revolution but warned prophetically about Bolshevik authoritarianism: "Freedom only for supporters of the government is no freedom at all." Led the failed Spartacist uprising in Berlin and was murdered by right-wing paramilitaries in January 1919.' },
  { name: 'Alexander Kerensky', years: '1881–1970', contribution: 'Head of the Provisional Government who tried to hold the center — too radical for conservatives, too moderate for revolutionaries. His fatal mistake was continuing the war. Fled Russia during the October Revolution and spent 50 years in exile, dying in New York in 1970.' },
  { name: 'Nicholas II', years: '1868–1918', contribution: 'The last Tsar of Russia. Well-meaning but weak, stubborn, and catastrophically out of touch. Believed in autocracy as a sacred duty. Abdicated in March 1917. Executed with his entire family by the Bolsheviks in July 1918 in a basement in Yekaterinburg.' },
  { name: 'Grigori Rasputin', years: '1869–1916', contribution: 'Siberian mystic who gained influence over the royal family through his apparent ability to ease the hemophilia of the heir. His scandalous behavior and political interference discredited the monarchy. Assassinated by nobles in December 1916 — legend says he survived poison, bullets, and beating before drowning.' },
];

/* ── Civil War ── */
const CIVIL_WAR: InsightEntry[] = [
  { label: 'Reds vs. Whites', detail: 'The Russian Civil War (1918–1922) pitted the Bolshevik Red Army against the Whites — a loose coalition of monarchists, liberals, moderate socialists, and nationalist movements. The Whites were united only by opposition to the Bolsheviks, which proved their fatal weakness.' },
  { label: 'Foreign intervention', detail: 'Britain, France, the United States, and Japan all sent troops to support the Whites — a total of over 150,000 foreign soldiers on Russian soil. The intervention failed militarily but succeeded in deepening Bolshevik paranoia about Western hostility — a paranoia that would define Soviet foreign policy for 70 years.' },
  { label: 'Red Terror', detail: 'The Cheka (Bolshevik secret police, founded December 1917) executed thousands of political opponents, real and suspected. Felix Dzerzhinsky, its founder, declared: "We stand for organized terror." Summary executions, hostage-taking, and concentration camps became instruments of state policy.' },
  { label: 'Execution of the Romanovs', detail: 'In July 1918, as White forces advanced on Yekaterinburg, the local Soviet executed Nicholas II, his wife Alexandra, their five children, and four servants in the basement of the Ipatiev House. The bodies were doused in acid and buried in a mineshaft. The remains were not found until 1991.' },
  { label: 'The human cost', detail: '7–12 million people died in the Civil War — the vast majority civilians killed by famine, disease, and pogroms. The war devastated Russia\'s economy, destroyed its infrastructure, and created a siege mentality that justified authoritarianism for decades to come.' },
];

/* ── New Soviet State ── */
const SOVIET_STATE: InsightEntry[] = [
  { label: 'Treaty of Brest-Litovsk (1918)', detail: 'Lenin accepted a humiliating peace with Germany, surrendering Ukraine, Poland, Finland, and the Baltic states — a third of Russia\'s population and half its industry. Other Bolsheviks were horrified, but Lenin insisted: the revolution needed peace to survive.' },
  { label: 'War Communism (1918–1921)', detail: 'To win the Civil War, the Bolsheviks nationalized all industry, banned private trade, and sent armed squads to seize grain from peasants. The result was catastrophic: industrial production collapsed to 20% of pre-war levels. A famine in 1921–1922 killed an estimated 5 million people.' },
  { label: 'New Economic Policy (1921)', detail: 'Facing economic collapse and peasant uprisings, Lenin retreated to a mixed economy. The NEP allowed small-scale private enterprise, brought back market mechanisms, and stabilized the food supply. Lenin called it "using capitalism to build communism" — a strategic retreat, not a surrender.' },
  { label: 'USSR founded (December 1922)', detail: 'The Union of Soviet Socialist Republics was formally established — a federation of Russia, Ukraine, Belarus, and the Transcaucasian republics. On paper, each republic had the right to secede. In practice, power was centralized in Moscow and in the Communist Party.' },
];

/* ── Stalin's Rise ── */
const STALIN_RISE: InsightEntry[] = [
  { label: 'Lenin\'s death (January 1924)', detail: 'Lenin suffered a series of strokes beginning in 1922. In his final testament, he warned against Stalin — "too rude" — and suggested removing him as General Secretary. The testament was suppressed. Lenin died in January 1924, and the struggle for succession began immediately.' },
  { label: 'Outmaneuvering rivals', detail: 'Stalin used his position as General Secretary to place loyalists in key positions throughout the party. He allied with Zinoviev and Kamenev against Trotsky, then turned on them with Bukharin, then destroyed Bukharin too. By 1929, Stalin had unchallenged power.' },
  { label: 'Trotsky expelled and killed', detail: 'Trotsky was expelled from the party (1927), exiled to Central Asia (1928), then deported from the USSR (1929). He spent 11 years in exile, writing devastating critiques of Stalin. In August 1940, a Soviet agent named Ram\u00f3n Mercader drove an ice axe into Trotsky\'s skull in Mexico City.' },
  { label: '"Socialism in one country"', detail: 'The great ideological debate: Trotsky argued for "permanent revolution" — spreading communism worldwide. Stalin countered with "socialism in one country" — building Soviet power first. Stalin\'s position won because it promised security, not endless revolutionary war. It also conveniently justified his absolute control.' },
];

/* ── Legacy ── */
const LEGACY: InsightEntry[] = [
  { label: 'Soviet superpower', detail: 'The Soviet Union endured for 74 years (1922–1991), becoming the world\'s second superpower. It industrialized at breakneck speed, defeated Nazi Germany, built nuclear weapons, and launched the first human into space — achievements bought at enormous human cost.' },
  { label: 'The Cold War', detail: 'The ideological struggle between capitalism and communism that began in 1917 shaped the entire 20th century. Two world systems, two nuclear arsenals, proxy wars on every continent. The Cold War ended in 1991 — but its echoes define geopolitics to this day.' },
  { label: 'Global revolutionary inspiration', detail: 'October 1917 inspired communist movements worldwide. The Chinese Revolution (1949), Cuban Revolution (1959), Vietnamese Revolution — all followed the Bolshevik model of a disciplined vanguard party seizing state power. At its peak, a third of humanity lived under governments that claimed the Russian Revolution as their founding inspiration.' },
  { label: 'The human cost', detail: 'Stalin\'s purges executed 750,000 people. The Gulag system imprisoned 18 million. Forced collectivization created famines that killed 3–5 million in Ukraine alone (the Holodomor). The full human cost of the Soviet experiment remains debated — estimates range from 6 to 20 million excess deaths under Stalin.' },
  { label: 'The unanswerable question', detail: 'Was Stalinism the inevitable result of Lenin\'s methods — the secret police, one-party rule, suppression of dissent? Or was it a betrayal of the revolution\'s emancipatory promise? Historians still disagree. What\'s clear is that Lenin created the tools Stalin used, even if he didn\'t intend the uses Stalin found for them.' },
  { label: 'Workers\' rights legacy', detail: 'The mere threat of communist revolution pressured Western governments to improve conditions for workers. The welfare state, labor protections, universal healthcare in Europe — all were partly motivated by the fear that without reform, revolution would follow. The Russian Revolution changed capitalism even where communism never took power.' },
  { label: 'Collapse and aftermath', detail: 'The Soviet Union dissolved in December 1991. Russia\'s transition to capitalism was catastrophic: GDP halved, life expectancy dropped, oligarchs seized state assets. The "end of history" optimism proved premature. Today, the legacy of 1917 remains contested — a revolution that promised liberation and delivered both achievements and horrors on a colossal scale.' },
];

/* ── Sub-components ── */

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
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
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
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18, paddingTop: 4, paddingBottom: 4 }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: e.color, marginRight: 8 }} />
          <p style={{ display: 'inline', color: e.color, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginTop: 4, marginBottom: 6 }}>
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 18 }}
        >
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`, borderRadius: 10, padding: 18 }}
        >
          <h4 style={{ fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 2, fontSize: '1.05rem' }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
            {f.years}
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function DualPowerVisual({ items }: { items: DualPowerEntry[] }) {
  const provisional = items.filter(i => i.side === 'provisional');
  const soviet = items.filter(i => i.side === 'soviet');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'start' }}>
      {/* Provisional Government */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${ROYAL_BLUE}33`, borderRadius: 10, padding: 20 }}
      >
        <h4 style={{ color: ROYAL_BLUE, fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
          Provisional Government
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {provisional.map((item, i) => (
            <span key={i} style={{
              color: item.name.includes('fatal') ? ROSE : ASH,
              fontSize: '0.9rem',
              fontWeight: item.name.includes('fatal') ? 600 : 400,
            }}>
              {item.name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, fontSize: '2rem', color: CRIMSON }}
      >
        &#x21C4;
      </motion.div>

      {/* Petrograd Soviet */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${CRIMSON}33`, borderRadius: 10, padding: 20 }}
      >
        <h4 style={{ color: CRIMSON, fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
          Petrograd Soviet
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {soviet.map((item, i) => (
            <span key={i} style={{ color: ASH, fontSize: '0.9rem' }}>
              {item.name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Component ── */

export default function RussianRevolutionPage() {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </div>

        {/* ── Hero ── */}
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
              background: `linear-gradient(135deg, ${CRIMSON}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Ten Days That Shook the World &mdash; The Russian Revolution (1917)
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              In 1917, the largest country on Earth convulsed twice. First, a spontaneous uprising of
              hungry workers and mutinous soldiers swept away a 300-year dynasty in eight days. Then, eight
              months later, a small band of disciplined revolutionaries seized power in a single night &mdash;
              and remade the world. The Russian Revolution created the Soviet Union, launched the Cold War,
              inspired revolutions on every continent, and defined the ideological battle lines of the
              entire 20th century.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is the story of how an empire fell, how a promise of &ldquo;Peace, Land, Bread&rdquo;
              changed history, and why the consequences of 1917 are still shaping the world today.
            </p>
          </motion.div>
        </header>

        {/* ── "Peace, Land, Bread" Callout ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            backgroundColor: 'rgba(220,38,38,0.08)',
            border: `1px solid ${CRIMSON}44`,
            borderRadius: 12,
            padding: '24px 28px',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          <p style={{ color: CRIMSON, fontWeight: 700, fontSize: '1.6rem', marginBottom: 8, letterSpacing: '0.02em' }}>
            &ldquo;Peace, Land, Bread&rdquo;
          </p>
          <p style={{ color: ASH, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto' }}>
            The revolutionary promise that cut through every debate. While other parties argued theory, Lenin
            spoke to what 160 million people actually wanted: an end to the war, land for the peasants, and
            food on the table. Three words that toppled an empire.
          </p>
        </motion.section>

        {/* ── Key Stats Bar ── */}
        <section style={{ paddingBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {KEY_STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
                style={{
                  backgroundColor: 'rgba(220,38,38,0.06)',
                  border: `1px solid ${CRIMSON}33`,
                  borderRadius: 10,
                  padding: '14px 18px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: CRIMSON, fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>
                  {stat.label}
                </p>
                <p style={{ color: ASH, fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Russia Before the Revolution ── */}
        <SectionWrapper
          id="tsarist-russia"
          icon="&#x1F451;"
          title="Russia Before the Revolution — Tsarist Autocracy"
          accentColor={GOLD}
          intro="To understand why Russia exploded in 1917, you have to understand what it was like before. An absolute monarchy ruling 160 million people across 11 time zones. Eighty percent peasants. A new industrial working class crammed into cities with no rights. And a political system that refused to reform until it was too late."
        >
          <InsightGrid items={TSARIST_RUSSIA} />
        </SectionWrapper>

        {/* ── WWI as Catalyst ── */}
        <SectionWrapper
          id="wwi-catalyst"
          icon="&#x1F4A3;"
          title="World War I — The Catalyst That Broke the Empire"
          accentColor={ORANGE}
          intro="The Great War did not cause the Russian Revolution — the tensions were decades old. But it lit the fuse. Three years of catastrophic military losses, economic collapse, and government incompetence turned simmering resentment into revolutionary rage. By early 1917, Russia was a powder keg, and the war had struck the match."
        >
          <InsightGrid items={WWI_CATALYST} />
        </SectionWrapper>

        {/* ── February Revolution ── */}
        <SectionWrapper
          id="february-revolution"
          icon="&#x2744;&#xFE0F;"
          title="The February Revolution — Eight Days That Ended an Empire"
          accentColor={ROSE}
          intro="The February Revolution (March by the Western calendar) was not planned by any party, any leader, or any committee. It began with women demanding bread and ended with the abdication of the Tsar. In eight days, a 300-year dynasty that had survived Napoleon, the Crimean War, and the 1905 Revolution simply collapsed — because the soldiers refused to shoot."
        >
          <TimelineCard entries={FEBRUARY_TIMELINE} />
        </SectionWrapper>

        {/* ── Dual Power Diagram ── */}
        <SectionWrapper
          id="dual-power"
          icon="&#x2696;&#xFE0F;"
          title="Dual Power — Two Governments, One Country"
          accentColor={ROYAL_BLUE}
          intro="After the Tsar fell, Russia was governed by two rival bodies that claimed authority simultaneously. The Provisional Government had legal legitimacy but no real power. The Petrograd Soviet had the factories and the guns but no legal mandate. This unstable arrangement — 'dual power' — lasted eight months and ended when the Bolsheviks dissolved it by force."
        >
          <DualPowerVisual items={DUAL_POWER} />
        </SectionWrapper>

        {/* ── Lenin Returns ── */}
        <SectionWrapper
          id="april-theses"
          icon="&#x1F683;"
          title="Lenin Returns — The April Theses"
          accentColor={AMBER}
          intro="In April 1917, a bald man in a rumpled suit stepped off a train at Petrograd's Finland Station and changed history. Vladimir Lenin had spent 17 years in exile. Germany had smuggled him back, hoping he'd take Russia out of the war. He did — and much more. His April Theses offered a program so radical that even most Bolsheviks initially rejected it. Within six months, it would be the program of the government."
        >
          <InsightGrid items={APRIL_THESES} />
        </SectionWrapper>

        {/* ── October Revolution ── */}
        <SectionWrapper
          id="october-revolution"
          icon="&#x1F6A9;"
          title="The October Revolution — One Night That Changed the World"
          accentColor={CRIMSON}
          intro="The October Revolution was not a mass uprising like February. It was a carefully planned coup executed over 24 hours by a few thousand armed workers and soldiers. While Petrograd went to the theater and ate dinner, the Bolsheviks systematically seized every nerve center of government power. By morning, the Provisional Government had ceased to exist — and a new kind of state was being born."
        >
          <TimelineCard entries={OCTOBER_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Figures ── */}
        <SectionWrapper
          id="figures"
          icon="&#x1F464;"
          title="Key Figures — Revolutionaries, Rulers, and Victims"
          accentColor={VIOLET}
          intro="The Russian Revolution was shaped by extraordinary individuals — visionary intellectuals, ruthless organizers, brilliant orators, and a Tsar who was none of these things. Their fates tell the story of the revolution itself: of the eight key figures below, three were assassinated, one was executed, and one became one of history's greatest tyrants."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Civil War ── */}
        <SectionWrapper
          id="civil-war"
          icon="&#x2694;&#xFE0F;"
          title="The Civil War (1918–1922) — A Country Tearing Itself Apart"
          accentColor={BURGUNDY}
          intro="Seizing power was the easy part. Keeping it required the bloodiest conflict in Russian history. The Civil War pitted Bolshevik Reds against a fractured White opposition, foreign invaders, nationalist movements, peasant armies, and anarchist guerrillas. It killed millions, devastated the country, and transformed the Bolsheviks from revolutionaries into a militarized authoritarian state."
        >
          <InsightGrid items={CIVIL_WAR} />
        </SectionWrapper>

        {/* ── New Soviet State ── */}
        <SectionWrapper
          id="soviet-state"
          icon="&#x1F3D7;&#xFE0F;"
          title="Building the New Soviet State"
          accentColor={TEAL}
          intro="The Bolsheviks had promised peace, land, and bread. Delivering proved far harder than promising. The first years of Soviet power were marked by desperate improvisation, ideological compromise, and catastrophic famine. Lenin's genius was knowing when to retreat — his New Economic Policy saved the revolution by temporarily abandoning its principles."
        >
          <InsightGrid items={SOVIET_STATE} />
        </SectionWrapper>

        {/* ── Stalin's Rise ── */}
        <SectionWrapper
          id="stalin-rise"
          icon="&#x1F5DC;&#xFE0F;"
          title="Stalin's Rise — From Organizer to Dictator (1924–1929)"
          accentColor={SILVER}
          intro="When Lenin died in 1924, no one expected Joseph Stalin to win the succession struggle. He was the grey bureaucrat, the party organizer — not the theorist, not the orator, not the military hero. But Stalin understood something his rivals didn't: in a one-party state, whoever controls the party appointments controls everything."
        >
          <InsightGrid items={STALIN_RISE} />
        </SectionWrapper>

        {/* ── Legacy ── */}
        <SectionWrapper
          id="legacy"
          icon="&#x1F30D;"
          title="Legacy — How 1917 Shaped the Entire 20th Century"
          accentColor={EMERALD}
          intro="The Russian Revolution was not just a Russian event — it was a world-historical earthquake. It created the Soviet Union, inspired communist movements on every continent, triggered the Cold War, and forced Western capitalism to reform itself. Its consequences — from the Chinese Revolution to the fall of the Berlin Wall — defined the modern world. The debate over its meaning has never ended."
        >
          <InsightGrid items={LEGACY} />
        </SectionWrapper>

        {/* ── Connection Links ── */}
        <section style={{ padding: '32px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              Explore Connected History
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                { to: '/wwi', label: 'World War I' },
                { to: '/cold-war', label: 'The Cold War' },
                { to: '/chinese-dynasties', label: 'Chinese Dynasties' },
                { to: '/nazism', label: 'Rise of Nazism' },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  style={{
                    color: CRIMSON,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    border: `1px solid ${CRIMSON}44`,
                    borderRadius: 8,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = `${CRIMSON}15`)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {link.label} &rarr;
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            &ldquo;There are decades where nothing happens; and there are weeks where decades happen.&rdquo; &mdash; Vladimir Lenin
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
