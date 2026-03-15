/**
 * SlaveryHistoryPage — comprehensive deep-dive on the history of slavery
 * from the ancient world through the Atlantic slave trade, the abolition
 * movement, and modern slavery today.
 *
 * Self-contained: all styles inline, no external CSS.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour palette ───────────────────────────────────────────────── */
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_FAINT = '#6b6458';
const CARD_BG = 'rgba(90,40,20,0.08)';
const CARD_BORDER = 'rgba(90,40,20,0.22)';
const RUST = '#9b4423';
const GOLD = '#c9a227';
const CRIMSON = '#b33a3a';
const TEAL = '#2a8a8a';
const OCHRE = '#b87333';
const INDIGO = '#5b5ea6';
const IRON = '#7a7a7a';
const EMBER = '#c45a2a';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'ancient'
  | 'atlantic'
  | 'middle-passage'
  | 'american'
  | 'abolition'
  | 'haiti'
  | 'figures'
  | 'aftermath'
  | 'modern';

interface TabDef {
  key: SectionTab;
  label: string;
  icon: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
  colour: string;
}

interface Figure {
  name: string;
  years: string;
  role: string;
  colour: string;
}

/* ─── data ─────────────────────────────────────────────────────────── */
const SECTION_TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: '⛓️' },
  { key: 'ancient', label: 'Ancient World', icon: '🏛️' },
  { key: 'atlantic', label: 'Atlantic Trade', icon: '⚓' },
  { key: 'middle-passage', label: 'Middle Passage', icon: '🚢' },
  { key: 'american', label: 'American Slavery', icon: '🌾' },
  { key: 'abolition', label: 'Abolition', icon: '📜' },
  { key: 'haiti', label: 'Haitian Revolution', icon: '🔥' },
  { key: 'figures', label: 'Key Figures', icon: '✊' },
  { key: 'aftermath', label: 'Aftermath', icon: '⚖️' },
  { key: 'modern', label: 'Modern Slavery', icon: '🌐' },
];

const ATLANTIC_TIMELINE: TimelineEvent[] = [
  {
    year: '1444',
    title: 'First Portuguese Slave Market',
    detail:
      'Portuguese traders established the first European slave market in Lagos, Portugal, selling captured West Africans. This marked the beginning of the European transatlantic slave trade.',
    colour: OCHRE,
  },
  {
    year: '1502',
    title: 'First Enslaved Africans in the Americas',
    detail:
      'Spanish colonists brought the first enslaved Africans to Hispaniola (modern Haiti/Dominican Republic), beginning centuries of forced African labor in the New World.',
    colour: CRIMSON,
  },
  {
    year: '1526',
    title: 'First Slave Revolt in the Americas',
    detail:
      'Enslaved Africans in a Spanish colony in present-day South Carolina revolted and escaped to live among Native Americans — the first recorded slave revolt in what would become the United States.',
    colour: EMBER,
  },
  {
    year: '1619',
    title: '"20 and Odd Negroes" Arrive in Virginia',
    detail:
      'A privateer ship brought approximately 20 enslaved Africans to the English colony of Jamestown. Often cited as the beginning of African slavery in English North America, though the legal framework of chattel slavery developed gradually over subsequent decades.',
    colour: RUST,
  },
  {
    year: '1655–1740',
    title: 'Caribbean Sugar Revolution',
    detail:
      'Sugar plantations in Barbados, Jamaica, and Saint-Domingue created insatiable demand for enslaved labor. The Caribbean became the deadliest destination: life expectancy on sugar plantations was often just 7 years. Enslaved people were literally worked to death and replaced.',
    colour: CRIMSON,
  },
  {
    year: '1672',
    title: 'Royal African Company Founded',
    detail:
      'The English Crown chartered the Royal African Company, granting it a monopoly on the English slave trade. Between 1672 and 1689 it transported approximately 100,000 enslaved Africans. The company branded enslaved people with the letters "DY" (Duke of York, later King James II).',
    colour: IRON,
  },
  {
    year: '1700s',
    title: 'Peak of the Atlantic Slave Trade',
    detail:
      'The 18th century saw the largest volume of the trade: over 6 million Africans were transported. Britain became the dominant slave-trading nation, followed by Portugal and France. Liverpool, Bristol, and Nantes grew wealthy as slave-trading ports.',
    colour: GOLD,
  },
  {
    year: '1781',
    title: 'The Zong Massacre',
    detail:
      'The crew of the British slave ship Zong threw 133 enslaved Africans overboard to claim insurance money. The resulting court case — which treated the murders as a property insurance dispute, not homicide — galvanized British abolitionists.',
    colour: CRIMSON,
  },
  {
    year: '1807',
    title: 'Britain Abolishes the Slave Trade',
    detail:
      'After decades of campaigning by Wilberforce, Clarkson, and Equiano, Parliament passed the Slave Trade Act, banning the Atlantic slave trade in British ships. The Royal Navy was tasked with enforcement, intercepting slave ships off the African coast.',
    colour: TEAL,
  },
  {
    year: '1808',
    title: 'United States Bans Slave Importation',
    detail:
      'The US banned the importation of enslaved people, as allowed by the Constitution after 1808. However, the internal slave trade — selling enslaved people from the Upper South to the Deep South — exploded and continued until 1865.',
    colour: INDIGO,
  },
  {
    year: '1833',
    title: 'British Emancipation Act',
    detail:
      'Britain abolished slavery throughout its empire. Notably, the British government paid £20 million (roughly £2.4 billion today) in compensation — to enslavers, not the enslaved. The debt was not fully paid off until 2015.',
    colour: TEAL,
  },
  {
    year: '1865',
    title: '13th Amendment (United States)',
    detail:
      'The 13th Amendment to the US Constitution abolished slavery and involuntary servitude, except as punishment for a crime. Approximately 4 million people were freed.',
    colour: GOLD,
  },
  {
    year: '1888',
    title: 'Brazil: Last Country in Americas to Abolish',
    detail:
      'The Golden Law (Lei Áurea) freed approximately 700,000 remaining enslaved people in Brazil — the last country in the Western Hemisphere to abolish slavery. Brazil had imported more enslaved Africans (4.8 million) than any other nation.',
    colour: EMBER,
  },
];

const FIGURES: Figure[] = [
  {
    name: 'Toussaint Louverture (1743–1803)',
    years: '1743–1803',
    role: 'Born enslaved in Saint-Domingue (Haiti). Self-educated military genius who led the Haitian Revolution — the only successful slave revolution in history. Defeated French, Spanish, and British armies. Captured by Napoleon through treachery, died in a French prison. His revolution terrified slaveholders across the Americas and inspired enslaved people everywhere.',
    colour: EMBER,
  },
  {
    name: 'Frederick Douglass (1818–1895)',
    years: '1818–1895',
    role: 'Escaped slavery in Maryland at age 20. Became the most powerful orator and writer of the abolitionist movement. His autobiography, "Narrative of the Life of Frederick Douglass" (1845), was a bestseller that proved enslaved people were fully intellectual beings. Advised Abraham Lincoln during the Civil War. "What to the Slave Is the Fourth of July?" remains one of the greatest speeches in American history.',
    colour: GOLD,
  },
  {
    name: 'Harriet Tubman (c. 1822–1913)',
    years: 'c. 1822–1913',
    role: 'Escaped slavery in Maryland, then made approximately 13 missions back into the South via the Underground Railroad, personally leading roughly 70 enslaved people to freedom. Known as "Moses." During the Civil War, became the first woman to lead an armed assault (the Combahee Ferry Raid, freeing over 700 enslaved people). Never lost a single passenger.',
    colour: TEAL,
  },
  {
    name: 'William Wilberforce (1759–1833)',
    years: '1759–1833',
    role: 'British Member of Parliament who led the parliamentary campaign against the slave trade for nearly 20 years. Introduced abolition bills year after year despite repeated defeats. His persistence, combined with grassroots organizing, finally achieved the Slave Trade Act of 1807 and the Slavery Abolition Act of 1833, which he lived just long enough to see passed.',
    colour: INDIGO,
  },
  {
    name: 'Olaudah Equiano (c. 1745–1797)',
    years: 'c. 1745–1797',
    role: 'Kidnapped from present-day Nigeria at age 11, enslaved in the Caribbean and North America, eventually purchased his own freedom. His autobiography, "The Interesting Narrative" (1789), was one of the first accounts of slavery written by an enslaved person. It became a bestseller and was instrumental in building public support for abolition in Britain.',
    colour: OCHRE,
  },
  {
    name: 'Nat Turner (1800–1831)',
    years: '1800–1831',
    role: 'Led the most significant slave rebellion in US history in Southampton County, Virginia (August 1831). Approximately 60 white people were killed. The revolt was suppressed after two days, and Turner was executed. The rebellion terrified the white South, leading to harsher slave codes — but proved that enslaved people would fight for their freedom at any cost.',
    colour: CRIMSON,
  },
  {
    name: 'Sojourner Truth (c. 1797–1883)',
    years: 'c. 1797–1883',
    role: 'Born into slavery in New York as Isabella Baumfree. Escaped with her infant daughter in 1826. Became a powerful abolitionist and women\'s rights activist. Her "Ain\'t I a Woman?" speech (1851) challenged both racial and gender oppression simultaneously, making her a foundational figure in intersectional justice.',
    colour: GOLD,
  },
  {
    name: 'John Brown (1800–1859)',
    years: '1800–1859',
    role: 'White abolitionist who believed armed insurrection was the only way to end slavery. Led the raid on Harpers Ferry arsenal (1859) hoping to spark a slave uprising. Captured, tried, and hanged. His execution made him a martyr in the North and convinced many that the conflict over slavery could only be resolved by war. "I, John Brown, am now quite certain that the crimes of this guilty land will never be purged away but with blood."',
    colour: IRON,
  },
  {
    name: 'William Lloyd Garrison (1805–1879)',
    years: '1805–1879',
    role: 'Founded "The Liberator" newspaper (1831–1865), the most influential abolitionist publication. Demanded immediate, uncompensated emancipation — a radical position at the time. Publicly burned the US Constitution, calling it "a covenant with death and an agreement with Hell" for its compromises with slavery. Co-founded the American Anti-Slavery Society.',
    colour: INDIGO,
  },
  {
    name: 'Abraham Lincoln (1809–1865)',
    years: '1809–1865',
    role: 'The 16th President of the United States. Issued the Emancipation Proclamation (1863), freeing enslaved people in Confederate states as a wartime measure. Pushed the 13th Amendment through Congress to permanently abolish slavery. His views evolved from opposing slavery\'s expansion to advocating full abolition. Assassinated days after the Civil War ended.',
    colour: TEAL,
  },
  {
    name: 'Harriet Beecher Stowe (1811–1896)',
    years: '1811–1896',
    role: 'Author of "Uncle Tom\'s Cabin" (1852), the most commercially successful novel of the 19th century. The book brought the reality of slavery to a mass audience and energized the abolitionist movement. When Lincoln met Stowe, he allegedly said: "So you\'re the little woman who wrote the book that started this great war."',
    colour: OCHRE,
  },
  {
    name: 'Jean-Jacques Dessalines (1758–1806)',
    years: '1758–1806',
    role: 'Born enslaved in Saint-Domingue. Military leader who succeeded Toussaint Louverture and led Haiti to final independence in 1804. Declared Haiti the first free Black republic in the world. His declaration of independence remains one of the most powerful anti-slavery documents ever written.',
    colour: EMBER,
  },
  {
    name: 'Thomas Clarkson (1760–1846)',
    years: '1760–1846',
    role: 'The organizational backbone of the British abolition movement. While Wilberforce spoke in Parliament, Clarkson traveled 35,000 miles across Britain collecting evidence: slave ship diagrams, shackles, testimonies. The famous cross-section diagram of the slave ship Brookes — which showed enslaved people packed like cargo — was Clarkson\'s most powerful weapon.',
    colour: INDIGO,
  },
  {
    name: 'Denmark Vesey (c. 1767–1822)',
    years: 'c. 1767–1822',
    role: 'Formerly enslaved man in Charleston, South Carolina who purchased his freedom. Organized what would have been the largest slave revolt in US history (1822), involving thousands of enslaved people. The plot was betrayed before execution. Vesey and 34 others were hanged. The conspiracy led to further restrictions on free and enslaved Black people throughout the South.',
    colour: CRIMSON,
  },
  {
    name: 'Elizabeth Heyrick (1769–1831)',
    years: '1769–1831',
    role: 'British Quaker activist who wrote "Immediate, Not Gradual Abolition" (1824), pushing the movement beyond gradualism. Organized sugar boycotts — the first consumer boycott in history — arguing that every person who bought slave-produced sugar was complicit in slavery. Her radical stance helped shift the Abolition Society toward demanding immediate emancipation.',
    colour: GOLD,
  },
];

const AMERICAN_EVENTS: TimelineEvent[] = [
  {
    year: '1790',
    title: 'First US Census: 700,000 Enslaved',
    detail:
      'The first US census recorded approximately 700,000 enslaved people, about 18% of the total population. Slavery existed in both North and South, though already concentrating in the South.',
    colour: IRON,
  },
  {
    year: '1793',
    title: 'Cotton Gin Invented',
    detail:
      'Eli Whitney\'s cotton gin made short-staple cotton enormously profitable, reviving a declining slave economy. Cotton production exploded from 3,000 bales (1790) to 4.5 million bales (1860). Slavery, which had been slowly declining, became the economic engine of the South.',
    colour: OCHRE,
  },
  {
    year: '1800–1860',
    title: 'The Internal Slave Trade',
    detail:
      'Over 1 million enslaved people were forcibly relocated from the Upper South (Virginia, Maryland) to the Deep South (Alabama, Mississippi, Louisiana) through the domestic slave trade. Families were systematically torn apart. New Orleans became the largest slave market in the country.',
    colour: CRIMSON,
  },
  {
    year: '1820',
    title: 'Missouri Compromise',
    detail:
      'Congress admitted Missouri as a slave state and Maine as a free state, and drew a line (36°30\') across the Louisiana Territory: slavery permitted below, prohibited above. A temporary political fix that delayed but could not prevent the coming conflict.',
    colour: INDIGO,
  },
  {
    year: '1831',
    title: 'Nat Turner\'s Rebellion',
    detail:
      'Nat Turner led approximately 70 enslaved people in a two-day uprising in Virginia, killing roughly 60 white people. White reprisals killed over 200 Black people, most uninvolved. Southern states passed draconian new slave codes banning literacy, assembly, and unsupervised movement.',
    colour: CRIMSON,
  },
  {
    year: '1850',
    title: 'Fugitive Slave Act',
    detail:
      'Required Northern states to return escaped enslaved people to their enslavers. Outraged the North: ordinary citizens were legally compelled to participate in slavery. Radicalized many moderates and boosted the Underground Railroad.',
    colour: RUST,
  },
  {
    year: '1857',
    title: 'Dred Scott Decision',
    detail:
      'The Supreme Court ruled that Black people "had no rights which the white man was bound to respect" and could never be US citizens. Also declared the Missouri Compromise unconstitutional, opening all territories to slavery. The decision made the Civil War virtually inevitable.',
    colour: CRIMSON,
  },
  {
    year: '1860',
    title: 'Census: 4 Million Enslaved',
    detail:
      'By 1860, the enslaved population had grown to nearly 4 million — from 700,000 in 1790. The economic value of enslaved people exceeded the value of all railroads and factories in the country combined. Slavery was not a dying institution; it was thriving and expanding.',
    colour: IRON,
  },
  {
    year: '1863',
    title: 'Emancipation Proclamation',
    detail:
      'Lincoln\'s executive order freed enslaved people in Confederate states. A limited wartime measure — it did not free enslaved people in border states loyal to the Union. But it transformed the war\'s purpose, and approximately 180,000 Black men served in the Union Army.',
    colour: GOLD,
  },
  {
    year: '1865',
    title: '13th Amendment Ratified',
    detail:
      'The 13th Amendment permanently abolished slavery throughout the United States: "Neither slavery nor involuntary servitude, except as punishment for crime, shall exist within the United States." Four million people were legally free. The question of what freedom would mean in practice was just beginning.',
    colour: TEAL,
  },
];

/* ─── helper components ────────────────────────────────────────────── */
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
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 6,
        border: active ? `1px solid ${RUST}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(90,40,20,0.18)' : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 'clamp(18px, 3vw, 24px)',
        fontWeight: 700,
        color: TEXT,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        margin: '0 0 20px',
      }}
    >
      <span>{icon}</span> {title}
    </h2>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 8,
        padding: '10px 16px',
        textAlign: 'center',
        minWidth: 80,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: RUST }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function NarrativeCard({
  title,
  children,
  colour = RUST,
}: {
  title?: string;
  children: React.ReactNode;
  colour?: string;
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderLeft: `3px solid ${colour}`,
        borderRadius: 8,
        padding: '18px 22px',
        marginBottom: 16,
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: colour,
            margin: '0 0 8px',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: TEXT }}>{children}</div>
    </div>
  );
}

function QuoteBlock({
  quote,
  attribution,
  colour = GOLD,
}: {
  quote: string;
  attribution: string;
  colour?: string;
}) {
  return (
    <blockquote
      style={{
        borderLeft: `3px solid ${colour}`,
        margin: '20px 0',
        padding: '12px 20px',
        fontStyle: 'italic',
        color: TEXT_DIM,
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      &ldquo;{quote}&rdquo;
      <div
        style={{
          marginTop: 8,
          fontStyle: 'normal',
          fontSize: 12,
          color: TEXT_FAINT,
        }}
      >
        — {attribution}
      </div>
    </blockquote>
  );
}

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderLeft: `3px solid ${event.colour}`,
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 10,
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: event.colour, whiteSpace: 'nowrap' }}>
          {event.year}
        </span>
        <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{event.title}</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: TEXT_DIM }}>{event.detail}</p>
    </motion.div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function SlaveryHistoryPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: BG,
        color: TEXT,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '48px 32px 36px',
          borderBottom: `1px solid ${CARD_BORDER}`,
          background: `linear-gradient(135deg, ${BG} 0%, rgba(90,40,20,0.10) 100%)`,
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: TEXT_DIM,
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 16,
          }}
        >
          ← Back to Timeline
        </Link>

        <h1
          style={{
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: TEXT,
            margin: '0 0 10px',
            lineHeight: 1.15,
          }}
        >
          Slavery and Abolition
          <span style={{ color: RUST, display: 'block', fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 600, marginTop: 6 }}>
            Humanity&apos;s Darkest Institution and the Fight to End It
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: TEXT_DIM,
            maxWidth: 780,
            lineHeight: 1.6,
            margin: '0 0 20px',
          }}
        >
          From the ancient world to the Atlantic slave trade, from the abolition
          movement to modern forced labor — the full history of slavery, told with
          the gravity and respect it demands.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <StatBadge value="12.5M" label="Africans Transported" />
          <StatBadge value="400" label="Years of Atlantic Trade" />
          <StatBadge value="15+" label="Key Figures" />
          <StatBadge value="1888" label="Last Abolition (Americas)" />
          <StatBadge value="40M" label="Enslaved Today" />
        </div>
      </motion.div>

      {/* ── sticky tab bar ── */}
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

      {/* ── content area ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '28px 32px 64px', maxWidth: 960 }}
        >
          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <SectionHeader icon="⛓️" title="The History of Slavery" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  Slavery is among the oldest and most universal of human institutions — and
                  among the most horrific. It existed in virtually every ancient civilization,
                  on every inhabited continent, across thousands of years. But the Atlantic
                  slave trade (1500–1888) was something unprecedented: a system of
                  industrialized, race-based chattel slavery that forcibly transported 12.5
                  million Africans across the ocean, killing millions more in the process, and
                  generating the wealth on which much of the modern Western world was built.
                </p>
                <p style={{ margin: 0 }}>
                  This page traces slavery from the ancient world through the Atlantic trade,
                  the abolition movement, the Haitian Revolution, and the long aftermath that
                  continues to shape the world today — including the 40 million people still
                  living in conditions of modern slavery.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                What Made the Atlantic Slave Trade Different
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  Ancient slavery was brutal, but it differed from Atlantic chattel slavery in
                  fundamental ways. In most ancient systems, slavery was not based on race.
                  Enslaved people could be of any ethnicity — prisoners of war, debtors,
                  criminals. Many could earn or buy their freedom. Some held skilled positions,
                  owned property, or married free people. A freed slave in Rome could become a
                  citizen; a freed slave&apos;s child was fully Roman.
                </p>
                <p style={{ margin: 0 }}>
                  Atlantic chattel slavery was different. It was explicitly race-based: only
                  Africans and their descendants were enslaved. It was hereditary: the child of
                  an enslaved woman was born enslaved, in perpetuity. Enslaved people were
                  legally property — not persons. They could not marry, own anything, testify in
                  court, or learn to read. They could be bought, sold, beaten, raped, and killed
                  with minimal legal consequence. This system was maintained by an elaborate
                  ideology of racial supremacy that persists in its effects to this day.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                The Scale
              </h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                <StatBadge value="12.5M" label="Transported" />
                <StatBadge value="1.8M" label="Died at Sea" />
                <StatBadge value="4.8M" label="To Brazil" />
                <StatBadge value="4M" label="To Caribbean" />
                <StatBadge value="400K" label="To N. America" />
              </div>
              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: 0 }}>
                  Of the 12.5 million Africans forced onto slave ships, approximately 10.7
                  million survived the crossing. Brazil received the largest share (4.8 million),
                  followed by the Caribbean islands (4 million). North America received a
                  comparatively small number (400,000) — but through natural increase, the
                  enslaved population of the United States grew to 4 million by 1860. The
                  transatlantic slave trade was the largest forced migration in human history.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Those who deny freedom to others deserve it not for themselves."
                attribution="Abraham Lincoln"
              />
            </div>
          )}

          {/* ═══ ANCIENT WORLD ═══ */}
          {activeTab === 'ancient' && (
            <div>
              <SectionHeader icon="🏛️" title="Slavery in the Ancient World" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  Slavery was practiced in virtually every ancient civilization. It was so
                  pervasive that most ancient people — including philosophers — considered it
                  natural and inevitable. Aristotle argued some people were &ldquo;natural
                  slaves.&rdquo; The Hebrew Bible, the Quran, and Greco-Roman law all
                  regulated slavery without condemning it.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Egypt" colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  Ancient Egypt used enslaved labor extensively, though the pyramid
                  builders were likely conscripted laborers rather than enslaved people.
                  Slaves in Egypt were often prisoners of war from Nubia, Libya, and the
                  Levant. Egyptian slavery included domestic service, agricultural labor,
                  and work in mines and quarries.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Greece" colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  Athens at its peak may have had 80,000–100,000 enslaved people in a
                  total population of 250,000–300,000. Enslaved people worked in
                  households, workshops, farms, and the deadly silver mines at Laurium.
                  Athenian democracy — history&apos;s first — was built on enslaved labor
                  that freed citizens for politics and philosophy. The irony was invisible
                  to most Greeks.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Rome" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  Roman slavery reached an extraordinary scale. At its peak, 30–40% of
                  the population of Roman Italy may have been enslaved — perhaps 2–3
                  million people. Enslaved people worked as farm laborers, miners,
                  gladiators, household servants, tutors, doctors, and administrators.
                  Roman slavery was not race-based: enslaved people were of every
                  ethnicity within the empire&apos;s reach.
                </p>
                <p style={{ margin: 0 }}>
                  Crucially, Roman slavery allowed for manumission (freeing). Freed
                  slaves (liberti) became citizens, and their children were full
                  citizens with no legal distinction. Several Roman emperors were
                  descendants of freed slaves. This stands in stark contrast to the
                  permanent, hereditary, race-based system of Atlantic chattel slavery.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Mesopotamia and China" colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  The Code of Hammurabi (c. 1750 BCE) — one of the earliest written
                  legal codes — extensively regulated slavery, including provisions for
                  freeing enslaved people and penalties for helping them escape. In China,
                  slavery existed from the Shang dynasty onward, though it was generally
                  a smaller proportion of the population than in the Mediterranean world.
                  Debt slavery was common in both civilizations.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Medieval Period: From Slavery to Serfdom
              </h3>
              <NarrativeCard colour={IRON}>
                <p style={{ margin: '0 0 12px' }}>
                  In medieval Europe, slavery gradually transformed into serfdom — a system
                  where peasants were bound to land rather than owned as property. Serfs had
                  some legal rights that enslaved people did not: they could not be sold
                  separately from their land, they could marry, and their families could not
                  be separated. But they were still unfree and exploited.
                </p>
                <p style={{ margin: 0 }}>
                  Meanwhile, slavery continued and thrived elsewhere. The Islamic world
                  maintained an extensive slave trade spanning Africa, Central Asia, and
                  Eastern Europe. The trans-Saharan slave trade transported an estimated
                  7–12 million Africans to North Africa and the Middle East over 1,200
                  years. Vikings were active slave traders, raiding coastal communities
                  across Europe and selling captives in Constantinople and the Islamic
                  world. The word &ldquo;slave&rdquo; itself derives from &ldquo;Slav&rdquo;
                  — a reflection of the extensive enslavement of Slavic peoples.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Humanity has been cursed with this plague of slavery from the beginning."
                attribution="Philo of Alexandria, 1st century CE"
                colour={OCHRE}
              />
            </div>
          )}

          {/* ═══ ATLANTIC TRADE ═══ */}
          {activeTab === 'atlantic' && (
            <div>
              <SectionHeader icon="⚓" title="The Atlantic Slave Trade (1500–1888)" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  The Atlantic slave trade was the largest forced migration in human history
                  and one of the defining events of the modern world. Over roughly 400 years,
                  European traders forcibly transported 12.5 million Africans across the
                  Atlantic to labor in the plantations, mines, and households of the Americas.
                  The trade built the economies of the Americas and enriched Europe — at an
                  incalculable human cost.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                The Triangle Trade
              </h3>
              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  The slave trade operated as part of a triangular system. European ships
                  sailed to West Africa carrying manufactured goods — textiles, guns,
                  alcohol, metalwork. These were traded for enslaved Africans, who were
                  transported across the Atlantic (the &ldquo;Middle Passage&rdquo;) to the
                  Americas. There, enslaved people were sold, and the ships were loaded with
                  slave-produced commodities — sugar, cotton, tobacco, coffee, indigo — for
                  the return voyage to Europe.
                </p>
                <p style={{ margin: 0 }}>
                  Every leg of the triangle generated profit. European port cities —
                  Liverpool, Bristol, Nantes, Amsterdam, Lisbon — grew wealthy on the
                  trade. Banks, insurance companies, and manufacturing firms were built on
                  slave-trade capital. The industrial revolution itself was partly financed
                  by the profits of slavery.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Timeline
              </h3>
              {ATLANTIC_TIMELINE.map((evt, i) => (
                <TimelineCard key={evt.year + evt.title} event={evt} index={i} />
              ))}

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Destinations: Where They Were Taken
              </h3>
              <NarrativeCard colour={EMBER}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: EMBER }}>Brazil: 4.8 million</strong> — By far the
                  largest destination. Brazilian sugar and later coffee plantations consumed
                  enslaved lives at a staggering rate. Conditions were so brutal that the
                  enslaved population could not sustain itself naturally; Brazil continuously
                  imported enslaved Africans until 1850 and did not abolish slavery until 1888.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: EMBER }}>Caribbean: 4 million</strong> — Sugar islands
                  like Jamaica, Barbados, Saint-Domingue (Haiti), and Cuba were enormously
                  profitable and enormously deadly. On many islands, the death rate exceeded
                  the birth rate. The white planter class was vastly outnumbered, maintaining
                  control through extreme violence.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong style={{ color: EMBER }}>Spanish America: 1.3 million</strong> — Mexico,
                  Peru, Colombia, and other Spanish colonies used enslaved Africans primarily in
                  mining, sugar production, and domestic service.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: EMBER }}>North America: 400,000</strong> — A relatively
                  small share of the total, but through natural increase the enslaved population
                  of the US grew to 4 million by 1860 — the largest enslaved population in the
                  Western Hemisphere at the time of emancipation.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Economic Impact
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  The slave trade and slave labor were central to the emergence of modern
                  capitalism. Cotton produced by enslaved people in the American South supplied
                  the textile mills of Manchester and Lancashire — the engine of the Industrial
                  Revolution. Sugar from the Caribbean was the most valuable commodity in
                  18th-century global trade. Brazilian coffee, grown by enslaved laborers,
                  became the world&apos;s most popular beverage.
                </p>
                <p style={{ margin: 0 }}>
                  By 1860, the economic value of enslaved people in the United States was
                  estimated at $3.5 billion (roughly $100 billion today) — greater than the
                  value of all American railroads, factories, and manufacturing combined.
                  Slavery was not a pre-modern relic. It was a modern, thriving, expanding
                  economic system destroyed only by war.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ═══ MIDDLE PASSAGE ═══ */}
          {activeTab === 'middle-passage' && (
            <div>
              <SectionHeader icon="🚢" title="The Middle Passage" />
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 14px' }}>
                  The Middle Passage — the voyage from West Africa to the Americas — was
                  the most horrific stage of the slave trade. Enslaved Africans were packed
                  into the holds of ships, chained together in spaces often less than five
                  feet high, for voyages lasting 6 to 12 weeks. The conditions were
                  deliberately dehumanizing and frequently lethal.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Conditions" colour={IRON}>
                <p style={{ margin: '0 0 12px' }}>
                  Enslaved people were packed below decks in rows, sometimes with less than
                  18 inches of vertical space per person. They were typically chained in pairs
                  at the wrists and ankles. The holds were unventilated, dark, and
                  suffocatingly hot. Disease spread rapidly: dysentery, smallpox, measles,
                  and the &ldquo;flux&rdquo; (severe dehydration from diarrhea) were constant
                  killers.
                </p>
                <p style={{ margin: 0 }}>
                  The stench was so overpowering that other ships could reportedly smell a
                  slave ship from miles away. Enslaved people lay in their own waste. Those
                  who died were thrown overboard. Those who refused to eat were force-fed
                  using a device called a speculum oris. Women and children, typically
                  unchained, were routinely sexually assaulted by the crew.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Mortality" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  The average mortality rate on the Middle Passage was 15–20%, though rates
                  on individual voyages could reach 50% or higher. Of the 12.5 million
                  Africans who boarded slave ships, approximately 1.8 million died at sea.
                  Millions more died in the initial capture raids in Africa, in the forced
                  marches to the coast, and in the coastal holding pens (barracoons) while
                  awaiting ships.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Resistance at Sea" colour={EMBER}>
                <p style={{ margin: '0 0 12px' }}>
                  Enslaved people resisted at every stage. Shipboard revolts occurred on an
                  estimated 10% of all slave voyages. The most famous was the Amistad
                  mutiny (1839), in which enslaved Africans seized the ship and eventually
                  won their freedom in a US Supreme Court case argued by John Quincy Adams.
                </p>
                <p style={{ margin: 0 }}>
                  Other forms of resistance included refusing to eat (a form of suicide/protest
                  so common that ships carried force-feeding equipment as standard), jumping
                  overboard, and attacking crew members. Some captives who had been sailors
                  tried to navigate ships back to Africa. Every revolt, even when unsuccessful,
                  increased the cost and risk of the trade.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="I now wished for the last friend, death, to relieve me; but soon, to my grief, two of the white men offered me eatables; and, on my refusing to eat, one of them held me fast by the hands, and laid me across, I think, the windlass, and tied my feet, while the other flogged me severely."
                attribution="Olaudah Equiano, 'The Interesting Narrative' (1789)"
                colour={CRIMSON}
              />

              <NarrativeCard title="The Zong Massacre (1781)" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  The slave ship Zong, running low on water with disease spreading, threw 133
                  living enslaved Africans overboard over several days so the owners could claim
                  insurance for &ldquo;lost cargo.&rdquo; The resulting court case was a dispute
                  over the insurance claim — not a murder trial. No one was ever charged. The
                  case became a rallying point for the abolition movement: if the legal system
                  treated the mass murder of enslaved people as a property dispute, then the
                  legal system itself was an instrument of evil.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ═══ AMERICAN SLAVERY ═══ */}
          {activeTab === 'american' && (
            <div>
              <SectionHeader icon="🌾" title="American Slavery (1619–1865)" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  Slavery in the United States grew from a small number of enslaved Africans
                  in Virginia in 1619 to a massive economic system of 4 million enslaved
                  people by 1860. The American system was distinctive for its scale, its
                  reliance on natural increase rather than importation after 1808, its
                  expansion westward with cotton, and the elaborate legal and ideological
                  structures built to sustain it.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Timeline
              </h3>
              {AMERICAN_EVENTS.map((evt, i) => (
                <TimelineCard key={evt.year + evt.title} event={evt} index={i} />
              ))}

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                The Plantation System
              </h3>
              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  The Southern plantation was both an agricultural enterprise and a system
                  of total control. Large plantations could hold hundreds of enslaved people
                  working in cotton, tobacco, rice, or sugar. The work was backbreaking and
                  enforced by the whip. Enslaved people typically worked from dawn to dusk,
                  six days a week.
                </p>
                <p style={{ margin: 0 }}>
                  The cotton gin (1793) transformed American slavery. By making short-staple
                  cotton profitable, it drove a massive expansion of slavery into Alabama,
                  Mississippi, Louisiana, and Texas. The internal slave trade forcibly relocated
                  over 1 million enslaved people from the Upper South to the Deep South between
                  1800 and 1860, tearing families apart on an industrial scale. New Orleans
                  became the largest slave market in the United States.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                Resistance
              </h3>
              <NarrativeCard colour={EMBER}>
                <p style={{ margin: '0 0 12px' }}>
                  Enslaved people resisted slavery constantly, in ways both dramatic and
                  everyday. Major rebellions included Gabriel&apos;s Conspiracy (1800),
                  the German Coast Uprising (1811), Denmark Vesey&apos;s planned revolt
                  (1822), and Nat Turner&apos;s Rebellion (1831). Day-to-day resistance
                  included work slowdowns, tool breaking, feigning illness, running away,
                  and maintaining African cultural practices despite prohibitions.
                </p>
                <p style={{ margin: 0 }}>
                  The Underground Railroad was a network of safe houses and routes by which
                  an estimated 100,000 enslaved people escaped to freedom in the North and
                  Canada between 1800 and 1865. Harriet Tubman, its most famous
                  &ldquo;conductor,&rdquo; personally led approximately 70 people to freedom
                  in 13 missions, never losing a single passenger.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="What to the American slave is your Fourth of July? I answer: a day that reveals to him, more than all other days of the year, the gross injustice and cruelty to which he is the constant victim."
                attribution="Frederick Douglass, 'What to the Slave Is the Fourth of July?' (1852)"
              />
            </div>
          )}

          {/* ═══ ABOLITION ═══ */}
          {activeTab === 'abolition' && (
            <div>
              <SectionHeader icon="📜" title="The Abolition Movement" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  The abolition of slavery was one of the great moral revolutions in human
                  history. For thousands of years, virtually no one had questioned slavery as
                  an institution. Within roughly a century (1770s–1880s), a movement that
                  began with a handful of Quakers transformed the moral consensus of the
                  Western world and destroyed an economic system worth billions.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Quaker Beginning" colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  The organized abolition movement began with Quakers (the Religious Society
                  of Friends). The 1688 Germantown Petition — written by German-speaking
                  Quakers in Pennsylvania — was the first organized protest against slavery
                  in the English colonies. By the 1770s, Quakers had banned slaveholding
                  among their members. Their moral conviction, organizational networks, and
                  willingness to act as a despised minority provided the seed of a global
                  movement.
                </p>
              </NarrativeCard>

              <NarrativeCard title="British Abolition Movement" colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  The British campaign against the slave trade (1787–1807) was arguably the
                  first modern human rights movement. William Wilberforce led the
                  parliamentary campaign, introducing abolition bills year after year despite
                  repeated defeats. Thomas Clarkson was the organizational genius, traveling
                  35,000 miles across Britain collecting evidence — including the famous
                  diagram of the slave ship Brookes that showed enslaved people packed like
                  cargo.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  Olaudah Equiano&apos;s autobiography (1789) — one of the first
                  slave narratives — brought the reality of slavery to a mass audience.
                  Elizabeth Heyrick organized sugar boycotts, the first consumer boycotts in
                  history. Over 300,000 people signed abolition petitions — in an era when
                  the total British population was about 10 million.
                </p>
                <p style={{ margin: 0 }}>
                  The Slave Trade Act of 1807 banned the Atlantic slave trade in British
                  ships. The Slavery Abolition Act of 1833 freed enslaved people throughout
                  the British Empire — though the government paid £20 million in compensation
                  to enslavers (not the enslaved). That debt was not fully repaid until 2015.
                </p>
              </NarrativeCard>

              <NarrativeCard title="American Abolitionists" colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  American abolitionism took many forms. William Lloyd Garrison founded
                  The Liberator (1831) and demanded immediate, uncompensated emancipation,
                  publicly burning the Constitution for its compromises with slavery.
                  Frederick Douglass — an escaped enslaved person — became the most powerful
                  orator of the movement, proving through his very existence that the
                  arguments for Black inferiority were lies.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  Harriet Beecher Stowe&apos;s Uncle Tom&apos;s Cabin (1852) brought the
                  horror of slavery to a mass audience. Sojourner Truth challenged both
                  racial and gender oppression. John Brown took the radical position that
                  only armed insurrection could end slavery — his raid on Harpers Ferry
                  (1859) failed militarily but succeeded in polarizing the nation. He was
                  hanged, but his prophecy proved accurate: &ldquo;the crimes of this guilty
                  land will never be purged away but with blood.&rdquo;
                </p>
              </NarrativeCard>

              <NarrativeCard title="Emancipation" colour={RUST}>
                <p style={{ margin: '0 0 12px' }}>
                  Lincoln&apos;s Emancipation Proclamation (January 1, 1863) was a limited
                  wartime measure: it freed enslaved people only in Confederate states,
                  not in border states loyal to the Union. But it transformed the war into
                  an explicitly anti-slavery crusade and opened the door for Black military
                  service — approximately 180,000 Black men served in the Union Army.
                </p>
                <p style={{ margin: 0 }}>
                  The 13th Amendment (ratified December 1865) permanently abolished slavery
                  throughout the United States. Brazil&apos;s Golden Law (1888) freed the
                  remaining 700,000 enslaved people there, making it the last country in
                  the Americas to abolish slavery. A 400-year institution had been destroyed
                  — but its legacy was far from over.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="I will be as harsh as truth, and as uncompromising as justice. On this subject, I do not wish to think, or speak, or write, with moderation. I am in earnest — I will not equivocate — I will not excuse — I will not retreat a single inch — AND I WILL BE HEARD."
                attribution="William Lloyd Garrison, The Liberator, first issue (1831)"
              />
            </div>
          )}

          {/* ═══ HAITIAN REVOLUTION ═══ */}
          {activeTab === 'haiti' && (
            <div>
              <SectionHeader icon="🔥" title="The Haitian Revolution (1791–1804)" />
              <NarrativeCard colour={EMBER}>
                <p style={{ margin: '0 0 14px' }}>
                  The Haitian Revolution was the only successful slave revolution in history.
                  It was the largest slave uprising since Spartacus, the first successful
                  anti-colonial revolution in the Americas after the US, and it established
                  Haiti as the first free Black republic in the world. It terrified
                  slaveholders across the hemisphere and inspired enslaved people everywhere.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Saint-Domingue: The Pearl of the Antilles" colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  French Saint-Domingue (western Hispaniola) was the wealthiest colony in the
                  Caribbean — producing 40% of Europe&apos;s sugar and 60% of its coffee. This
                  wealth was built on the labor of approximately 500,000 enslaved Africans,
                  outnumbering the white population 10 to 1. Conditions were among the most
                  brutal anywhere: enslaved people on sugar plantations had an average life
                  expectancy of just 7 years after arrival. The colony consumed enslaved lives
                  so rapidly that it required constant fresh importation from Africa.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Revolution Begins: August 1791" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  On the night of August 22, 1791, enslaved people in the northern province
                  rose in a coordinated revolt. Within weeks, they had burned over 1,000
                  plantations and killed hundreds of enslavers. The revolution had begun. It
                  would take 13 years, defeat three European armies, and cost over 100,000
                  lives before it was over.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Toussaint Louverture" colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  Toussaint Louverture emerged as the revolution&apos;s greatest leader. Born
                  enslaved, he was self-educated and a military genius. He defeated Spanish
                  forces, then British forces (who lost 25,000 soldiers, mostly to yellow
                  fever), then maneuvered between French factions. By 1801, he controlled the
                  entire island and issued a constitution abolishing slavery. Napoleon, seeking
                  to restore slavery and French control, sent 20,000 troops under General
                  Leclerc. Toussaint was captured through treachery and sent to France, where
                  he died in a mountain prison in 1803.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Independence: January 1, 1804" colour={EMBER}>
                <p style={{ margin: '0 0 12px' }}>
                  After Toussaint&apos;s capture, Jean-Jacques Dessalines continued the fight.
                  The remaining French forces, decimated by yellow fever and guerrilla warfare,
                  surrendered in November 1803. On January 1, 1804, Dessalines declared
                  independence, renaming the country Haiti (its original Taíno name). It was
                  the first nation founded by formerly enslaved people, and only the second
                  independent nation in the Americas.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Legacy and Punishment" colour={IRON}>
                <p style={{ margin: '0 0 12px' }}>
                  The world&apos;s slaveholding powers punished Haiti for its audacity. France
                  demanded 150 million francs (later reduced to 90 million) as
                  &ldquo;compensation&rdquo; for the lost &ldquo;property&rdquo; — i.e., the
                  enslaved people themselves. Haiti, under military threat, agreed. This
                  crushing debt was not fully repaid until 1947 and is widely regarded as
                  the root of Haiti&apos;s persistent poverty.
                </p>
                <p style={{ margin: 0 }}>
                  The United States — a slaveholding republic terrified of the example Haiti
                  set — refused to recognize Haiti until 1862. The Haitian Revolution proved
                  that enslaved people could free themselves, that Black people could govern
                  themselves, and that a slave system could be destroyed by force. Every
                  slaveholder in the Americas lived in fear of &ldquo;another Haiti.&rdquo;
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We have dared to be free. Let us dare to be so by ourselves and for ourselves."
                attribution="Jean-Jacques Dessalines, Haitian Declaration of Independence (1804)"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ KEY FIGURES ═══ */}
          {activeTab === 'figures' && (
            <div>
              <SectionHeader icon="✊" title="Key Figures" />
              <NarrativeCard>
                <p style={{ margin: 0 }}>
                  The history of slavery and abolition was shaped by extraordinary individuals
                  — enslaved people who resisted, escaped, and revolted; abolitionists who
                  fought a system that seemed invincible; and leaders whose courage changed
                  the world. These are some of the most important.
                </p>
              </NarrativeCard>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                {FIGURES.map((fig, i) => (
                  <motion.div
                    key={fig.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35 }}
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      borderLeft: `3px solid ${fig.colour}`,
                      borderRadius: 8,
                      padding: '16px 20px',
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 700, color: fig.colour, marginBottom: 6 }}>
                      {fig.name}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: TEXT_DIM }}>
                      {fig.role}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ AFTERMATH ═══ */}
          {activeTab === 'aftermath' && (
            <div>
              <SectionHeader icon="⚖️" title="The Aftermath: Freedom and Its Betrayal" />
              <NarrativeCard>
                <p style={{ margin: '0 0 14px' }}>
                  The abolition of slavery did not mean the arrival of equality. In the
                  United States and across the Americas, formerly enslaved people faced
                  systematic efforts to maintain white supremacy and economic exploitation
                  through new means. The promise of freedom was repeatedly betrayed.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Reconstruction (1865–1877)" colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  The period immediately following the Civil War saw remarkable progress.
                  The 14th Amendment (1868) granted citizenship and equal protection. The
                  15th Amendment (1870) guaranteed Black men the right to vote. Black
                  Americans voted, held office, built schools, and established churches.
                  Sixteen Black men served in the US Congress during Reconstruction.
                </p>
                <p style={{ margin: 0 }}>
                  But Reconstruction was violently overthrown. White supremacist terrorist
                  organizations — the Ku Klux Klan, the White League, the Red Shirts —
                  used murder, arson, and intimidation to prevent Black political
                  participation. The federal government, exhausted by the effort, withdrew
                  its troops in 1877. The promises of Reconstruction were abandoned.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Sharecropping: Slavery by Another Name" colour={RUST}>
                <p style={{ margin: 0 }}>
                  Without land, resources, or education, most formerly enslaved people
                  became sharecroppers — working the same land for the same families that
                  had enslaved them, trapped in cycles of debt that functioned as economic
                  bondage. The 13th Amendment&apos;s exception — &ldquo;except as punishment
                  for crime&rdquo; — was exploited through convict leasing, in which Black
                  men were arrested on trivial charges and leased to plantations, mines, and
                  railroads. Conditions were often worse than slavery, because the lessees
                  had no financial interest in keeping their workers alive.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Jim Crow (1877–1965)" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  The Jim Crow system created a comprehensive regime of racial segregation
                  across the South. Black Americans were excluded from voting through poll
                  taxes, literacy tests, and grandfather clauses. They were confined to
                  separate and inferior schools, hospitals, parks, and public facilities.
                  The system was enforced by law and maintained by terror: between 1877 and
                  1950, over 4,000 Black Americans were lynched.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Economic Legacy" colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  The wealth generated by enslaved labor was never shared with the people
                  who created it. Enslaved people received no compensation for their
                  centuries of forced labor. The 1865 promise of &ldquo;40 acres and a
                  mule&rdquo; for formerly enslaved people was revoked by President Andrew
                  Johnson. White families accumulated intergenerational wealth while Black
                  families were systematically excluded from homeownership, education, and
                  capital through redlining, discriminatory lending, and other means.
                </p>
                <p style={{ margin: 0 }}>
                  The median white family in the United States today holds roughly 10 times
                  the wealth of the median Black family. This gap is not an accident — it is
                  the direct, traceable consequence of slavery and the systems that succeeded
                  it.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 18, fontWeight: 700, color: GOLD, margin: '32px 0 16px' }}>
                The Reparations Debate
              </h3>
              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  The question of reparations — material compensation for slavery and its
                  aftermath — has been debated since abolition. In 2014, Ta-Nehisi Coates&apos;s
                  essay &ldquo;The Case for Reparations&rdquo; reinvigorated the debate. HR 40,
                  a bill to study reparations, has been introduced in every session of Congress
                  since 1989. Several Caribbean nations have also demanded reparations from
                  former colonial powers.
                </p>
                <p style={{ margin: 0 }}>
                  The debate is not only about money. It is about acknowledgment: whether the
                  nations that profited from slavery will honestly reckon with that history and
                  its ongoing consequences, or continue to treat it as a closed chapter.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The past is never dead. It's not even past."
                attribution="William Faulkner"
                colour={RUST}
              />
            </div>
          )}

          {/* ═══ MODERN SLAVERY ═══ */}
          {activeTab === 'modern' && (
            <div>
              <SectionHeader icon="🌐" title="Modern Slavery Today" />
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 14px' }}>
                  Slavery is not history. According to the International Labour Organization
                  (ILO) and Walk Free Foundation (2022), approximately 50 million people are
                  living in conditions of modern slavery today — 28 million in forced labor
                  and 22 million in forced marriage. That figure has increased by 10 million
                  since 2016.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Forced Labor" colour={IRON}>
                <p style={{ margin: '0 0 12px' }}>
                  Modern forced labor takes many forms: domestic servitude (particularly
                  affecting women and girls in the Middle East and Asia), agricultural
                  bondage, factory labor, fishing industry exploitation, and forced work in
                  brick kilns, mines, and construction. Supply chains for products consumed
                  globally — electronics, clothing, chocolate, seafood, palm oil — are
                  frequently tainted by forced labor.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Human Trafficking" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  Human trafficking — the recruitment and transport of people through force,
                  fraud, or coercion for exploitation — is a $150 billion annual criminal
                  industry. Victims are trafficked for forced labor, sexual exploitation,
                  domestic servitude, and organ harvesting. Women and girls make up 71% of
                  trafficking victims globally.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Debt Bondage" colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  The most common form of modern slavery globally is debt bondage — where
                  workers are trapped by debts they can never repay, often inherited across
                  generations. This is particularly prevalent in South Asia (India, Pakistan,
                  Bangladesh, Nepal), where millions of people work in brick kilns, rice
                  mills, and carpet factories under conditions of debt slavery. The
                  practice disproportionately affects marginalized castes and ethnic groups.
                </p>
              </NarrativeCard>

              <NarrativeCard title="State-Imposed Forced Labor" colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  Some governments impose forced labor on their own populations. The most
                  documented cases include the Xinjiang region of China (forced labor of
                  Uyghur and other Turkic Muslim minorities), North Korea (political prison
                  camps and forced labor for the state), Eritrea (indefinite national
                  service), and the use of prison labor in multiple countries including the
                  United States, where the 13th Amendment explicitly permits involuntary
                  servitude as punishment for crime.
                </p>
              </NarrativeCard>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
                <StatBadge value="50M" label="People Enslaved" />
                <StatBadge value="$150B" label="Annual Profits" />
                <StatBadge value="28M" label="Forced Labor" />
                <StatBadge value="22M" label="Forced Marriage" />
              </div>

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  The existence of modern slavery is a reminder that the abolition movement&apos;s
                  work is not finished. Slavery was not a peculiar institution of the past — it
                  is a persistent feature of human societies that requires constant vigilance,
                  legal enforcement, and moral courage to combat. Understanding the history of
                  slavery is essential to recognizing and fighting its modern forms.
                </p>
              </NarrativeCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── footer ── */}
      <div
        style={{
          borderTop: `1px solid ${CARD_BORDER}`,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 13,
            color: TEXT_DIM,
            textDecoration: 'none',
          }}
        >
          ← Back to Timeline
        </Link>
      </div>
    </div>
  );
}
