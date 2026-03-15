/**
 * WomensHistoryPage — comprehensive deep-dive on women's history from the
 * ancient world to the modern era: hidden figures, suffrage, leadership,
 * science, and the ongoing fight for equality.
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
const CARD_BG = 'rgba(102,51,102,0.08)';
const CARD_BORDER = 'rgba(102,51,102,0.22)';
const PURPLE = '#8a4f8a';
const GOLD = '#c9a227';
const CRIMSON = '#b33a3a';
const TEAL = '#2a8a8a';
const OCHRE = '#b87333';
const INDIGO = '#5b5ea6';
const ROSE = '#c4587a';
const EMERALD = '#2d8659';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'ancient'
  | 'medieval'
  | 'science'
  | 'suffrage'
  | 'wwii'
  | 'second-wave'
  | 'leaders'
  | 'reproductive'
  | 'today'
  | 'figures';

interface TabDef {
  key: SectionTab;
  label: string;
  icon: string;
}

interface Figure {
  name: string;
  era: string;
  years: string;
  role: string;
  colour: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
  colour: string;
}

/* ─── data ─────────────────────────────────────────────────────────── */
const SECTION_TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: '🌍' },
  { key: 'ancient', label: 'Ancient World', icon: '🏛️' },
  { key: 'medieval', label: 'Medieval Women', icon: '⚔️' },
  { key: 'science', label: 'Hidden Figures', icon: '🔬' },
  { key: 'suffrage', label: 'Suffrage', icon: '🗳️' },
  { key: 'wwii', label: 'WWII & Labor', icon: '🔧' },
  { key: 'second-wave', label: 'Second Wave', icon: '✊' },
  { key: 'leaders', label: 'Global Leaders', icon: '👑' },
  { key: 'reproductive', label: 'Reproductive Rights', icon: '⚕️' },
  { key: 'today', label: 'Today', icon: '📊' },
  { key: 'figures', label: 'Key Figures', icon: '🌟' },
];

const OVERVIEW_TEXT =
  'Women are half of humanity — yet for most of recorded history they were excluded from the record itself. History was written by men, about men, for men. Women\'s labor sustained every civilization; women\'s intellect drove discoveries credited to others; women\'s activism won rights that were never freely given. This is the story that the textbooks left out.';

const SUFFRAGE_TIMELINE: TimelineEvent[] = [
  {
    year: '1848',
    title: 'Seneca Falls Convention',
    detail:
      'The first women\'s rights convention in the United States. Elizabeth Cady Stanton\'s Declaration of Sentiments deliberately echoed the Declaration of Independence: "We hold these truths to be self-evident: that all men and women are created equal." Only one signer — Charlotte Woodward — lived to see women vote in 1920.',
    colour: GOLD,
  },
  {
    year: '1893',
    title: 'New Zealand — First Nation to Grant Women\'s Suffrage',
    detail:
      'New Zealand became the first self-governing nation to grant all women the right to vote, thanks to Kate Sheppard\'s petition movement — the largest petition in NZ history. Australia followed in 1902 (but excluded Indigenous women until 1962).',
    colour: EMERALD,
  },
  {
    year: '1903',
    title: 'WSPU Founded — UK Suffragettes',
    detail:
      'Emmeline Pankhurst founded the Women\'s Social and Political Union after decades of polite lobbying failed. "Deeds, not words." Suffragettes smashed windows, committed arson, chained themselves to railings, went on hunger strikes, and were brutally force-fed in prison.',
    colour: PURPLE,
  },
  {
    year: '1913',
    title: 'Emily Davison Dies at the Derby',
    detail:
      'Suffragette Emily Wilding Davison stepped in front of the King\'s horse at the Epsom Derby and was killed. Whether she intended martyrdom or was trying to attach a banner remains debated. Her funeral procession through London drew tens of thousands.',
    colour: CRIMSON,
  },
  {
    year: '1918',
    title: 'UK Women Over 30 Get the Vote',
    detail:
      'After women\'s essential war work made opposition untenable, the Representation of the People Act granted the vote to women over 30 who met property qualifications. Full equal suffrage came in 1928.',
    colour: TEAL,
  },
  {
    year: '1920',
    title: '19th Amendment — US Women Vote',
    detail:
      'After 72 years of activism, the 19th Amendment was ratified. But the victory was incomplete: poll taxes, literacy tests, and intimidation continued to disenfranchise Black women for decades. Ida B. Wells had warned that white suffragists were building a movement that excluded women of color.',
    colour: GOLD,
  },
  {
    year: '1944–1971',
    title: 'France, Switzerland, and Late Adopters',
    detail:
      'France didn\'t grant women\'s suffrage until 1944 — despite its revolutionary tradition. Switzerland waited until 1971. One Swiss canton (Appenzell Innerrhoden) had to be forced by the courts to allow women to vote in local elections — in 1991.',
    colour: INDIGO,
  },
  {
    year: '2015',
    title: 'Saudi Arabia — Last to Allow Women to Vote',
    detail:
      'Saudi women voted for the first time in municipal elections in December 2015. Women were simultaneously allowed to stand as candidates. 20 women were elected. The right to drive came in 2018. Activists who fought for these rights were imprisoned.',
    colour: OCHRE,
  },
];

const KEY_FIGURES: Figure[] = [
  { name: 'Hatshepsut', era: 'Ancient', years: '1507–1458 BCE', role: 'Female pharaoh who ruled Egypt for 22 years. Built massive monuments, expanded trade. Her successor attempted to erase her from history by destroying her statues and cartouches — but failed.', colour: GOLD },
  { name: 'Cleopatra VII', era: 'Ancient', years: '69–30 BCE', role: 'Last active ruler of Ptolemaic Egypt. Spoke nine languages, commanded fleets, and nearly prevented Roman annexation. Later reduced by history to a "seductress" rather than the formidable political strategist she was.', colour: GOLD },
  { name: 'Hypatia of Alexandria', era: 'Ancient', years: '~360–415 CE', role: 'Mathematician, astronomer, and philosopher. Head of the Neoplatonic school. Murdered by a Christian mob. Her death is often seen as marking the end of classical antiquity\'s intellectual openness.', colour: TEAL },
  { name: 'Wu Zetian', era: 'Ancient/Medieval', years: '624–705 CE', role: 'China\'s only female emperor. Rose from concubine to sole ruler of the Tang dynasty. Expanded the empire, reformed the civil service, patronized Buddhism. Demonized by later male historians.', colour: ROSE },
  { name: 'Hildegard of Bingen', era: 'Medieval', years: '1098–1179', role: 'Benedictine abbess, composer, philosopher, mystic, and natural scientist. Wrote treatises on medicine, botany, and theology. Composed 77 liturgical songs. Named a Doctor of the Church in 2012 — 833 years after her death.', colour: PURPLE },
  { name: 'Eleanor of Aquitaine', era: 'Medieval', years: '1122–1204', role: 'The most powerful woman in medieval Europe. Queen of France, then Queen of England. Mother of Richard the Lionheart. Went on Crusade. Ruled England as regent. Imprisoned by her own husband for 16 years for rebellion.', colour: GOLD },
  { name: 'Joan of Arc', era: 'Medieval', years: '1412–1431', role: 'Illiterate teenage peasant who claimed divine visions, convinced a king, and led French armies to victory at Orléans. Captured, tried for heresy and cross-dressing, burned alive at 19. Canonized as a saint in 1920.', colour: CRIMSON },
  { name: 'Ada Lovelace', era: 'Modern', years: '1815–1852', role: 'Wrote the first computer program in 1843, for Charles Babbage\'s Analytical Engine. Foresaw that computers could manipulate symbols beyond mere number-crunching — a century before anyone else understood this.', colour: INDIGO },
  { name: 'Sojourner Truth', era: 'Modern', years: '~1797–1883', role: 'Born into slavery, escaped, became an abolitionist and women\'s rights activist. Her "Ain\'t I a Woman?" speech (1851) challenged both racism and sexism, insisting that Black women\'s experiences were central to liberation.', colour: OCHRE },
  { name: 'Susan B. Anthony', era: 'Modern', years: '1820–1906', role: 'Co-founded the National Woman Suffrage Association. Illegally voted in 1872 and was arrested. Died 14 years before women won the right to vote. The 19th Amendment is called the Susan B. Anthony Amendment.', colour: PURPLE },
  { name: 'Marie Curie', era: 'Modern', years: '1867–1934', role: 'The only person to win Nobel Prizes in two different sciences (Physics 1903, Chemistry 1911). Discovered polonium and radium. Faced vicious misogyny from the French Academy, which never admitted her as a member.', colour: TEAL },
  { name: 'Emmeline Pankhurst', era: 'Modern', years: '1858–1928', role: 'Led the UK suffragette movement. Endured imprisonment, hunger strikes, and force-feeding. "We are here not because we are law-breakers; we are here in our efforts to become law-makers." Named one of the 100 most important people of the 20th century by Time.', colour: PURPLE },
  { name: 'Ida B. Wells', era: 'Modern', years: '1862–1931', role: 'Investigative journalist who documented lynching in the American South. Suffragist who refused to march at the back of the 1913 Washington parade. Pioneered intersectional feminism decades before the term existed.', colour: CRIMSON },
  { name: 'Rosa Parks', era: 'Modern', years: '1913–2005', role: 'Refused to give up her bus seat in Montgomery, Alabama (1955), sparking the bus boycott that launched the civil rights movement. She was not simply "tired" — she was a trained activist who made a deliberate choice.', colour: GOLD },
  { name: 'Rosalind Franklin', era: 'Modern', years: '1920–1958', role: 'Her X-ray crystallography (Photo 51) revealed the double helix structure of DNA. Watson and Crick used her data without permission. She died of cancer at 37, likely from radiation exposure. The Nobel went to the men.', colour: TEAL },
  { name: 'Simone de Beauvoir', era: 'Modern', years: '1908–1986', role: 'Wrote "The Second Sex" (1949), the foundational text of modern feminism. "One is not born, but rather becomes, a woman." Challenged the idea that women\'s subordination was natural or inevitable.', colour: INDIGO },
  { name: 'Hedy Lamarr', era: 'Modern', years: '1914–2000', role: 'Hollywood actress AND inventor. Co-patented frequency-hopping spread spectrum technology during WWII to prevent torpedo jamming. The principle became the basis for WiFi, Bluetooth, and GPS. She received no credit during her lifetime.', colour: ROSE },
  { name: 'Katherine Johnson', era: 'Modern', years: '1918–2020', role: 'NASA mathematician whose orbital calculations were critical to the first crewed US spaceflights. John Glenn refused to fly until Katherine Johnson personally verified the computer\'s calculations. Awarded Presidential Medal of Freedom in 2015.', colour: EMERALD },
  { name: 'Betty Friedan', era: 'Modern', years: '1921–2006', role: 'Wrote "The Feminine Mystique" (1963), which named "the problem that has no name" — the suffocating unhappiness of educated women confined to domesticity. Co-founded NOW (1966). Helped launch second-wave feminism.', colour: PURPLE },
  { name: 'Shirley Chisholm', era: 'Modern', years: '1924–2005', role: 'First Black woman elected to US Congress (1968). First Black candidate for a major party\'s presidential nomination (1972). "I am not the candidate of Black America, although I am Black and proud. I am the candidate of the people."', colour: GOLD },
  { name: 'Gloria Steinem', era: 'Modern', years: '1934–', role: 'Co-founded Ms. magazine (1972). Became the public face of second-wave feminism. Went undercover as a Playboy Bunny to expose working conditions. Spent decades organizing across race and class lines.', colour: ROSE },
  { name: 'Ruth Bader Ginsburg', era: 'Modern', years: '1933–2020', role: 'As a lawyer, won five landmark Supreme Court cases on gender equality. As a justice (1993–2020), became a cultural icon for her fierce dissents defending women\'s rights, voting rights, and civil liberties.', colour: INDIGO },
  { name: 'Malala Yousafzai', era: 'Modern', years: '1997–', role: 'Shot by the Taliban at age 15 for advocating girls\' education in Pakistan. Survived and became the youngest Nobel Peace Prize laureate (2014). "One child, one teacher, one book, one pen can change the world."', colour: EMERALD },
  { name: 'Wangari Maathai', era: 'Modern', years: '1940–2011', role: 'Kenyan environmentalist, founded the Green Belt Movement. First African woman to win the Nobel Peace Prize (2004). Planted over 51 million trees. Beaten and imprisoned for challenging the government. Proved that women\'s rights and environmental justice are inseparable.', colour: EMERALD },
];

const GLOBAL_LEADERS: { name: string; nation: string; years: string; role: string; colour: string }[] = [
  { name: 'Hatshepsut', nation: 'Egypt', years: '1479–1458 BCE', role: 'Female pharaoh. Ruled for 22 years during Egypt\'s golden age. Built the magnificent mortuary temple at Deir el-Bahri. Expanded trade networks to Punt. Her successor Thutmose III attempted to erase her from history.', colour: GOLD },
  { name: 'Cleopatra VII', nation: 'Egypt', years: '51–30 BCE', role: 'Last Ptolemaic ruler. Spoke nine languages. Allied with Caesar and Antony. Nearly preserved Egyptian independence from Rome. Her political brilliance was later reduced to romantic narrative.', colour: GOLD },
  { name: 'Wu Zetian', nation: 'China', years: '690–705 CE', role: 'China\'s only female emperor. Expanded the empire, reformed meritocratic exams, patronized Buddhism, built the Grand Canal extension. Ruthless and brilliant — later condemned as "unnatural" by Confucian historians.', colour: ROSE },
  { name: 'Isabella I', nation: 'Spain', years: '1474–1504', role: 'United Spain with Ferdinand. Funded Columbus. Completed the Reconquista. Established the Inquisition. One of the most consequential monarchs in European history — responsible for both extraordinary expansion and extraordinary persecution.', colour: CRIMSON },
  { name: 'Elizabeth I', nation: 'England', years: '1558–1603', role: 'The "Virgin Queen" who turned England into a major power. Defeated the Spanish Armada. Oversaw the English Renaissance (Shakespeare, Marlowe). Navigated religious conflict with pragmatism. Never married — refused to share power.', colour: PURPLE },
  { name: 'Catherine the Great', nation: 'Russia', years: '1762–1796', role: 'German princess who seized the Russian throne from her own husband. Expanded the empire enormously. Corresponded with Voltaire. Modernized administration. Her reputation was attacked with sexual slanders designed to delegitimize female power.', colour: INDIGO },
  { name: 'Golda Meir', nation: 'Israel', years: '1969–1974', role: 'Fourth Prime Minister of Israel. Led the country through the Yom Kippur War (1973). One of the first women to lead a modern nation. "Whether women are better than men I cannot say — but I can say they are certainly no worse."', colour: TEAL },
  { name: 'Indira Gandhi', nation: 'India', years: '1966–77, 1980–84', role: 'First and only female PM of India. Won the 1971 war. Declared Emergency rule (1975–77), suspending democracy. Assassinated by her own bodyguards (1984). Remains deeply controversial — both champion and authoritarian.', colour: OCHRE },
  { name: 'Margaret Thatcher', nation: 'UK', years: '1979–1990', role: 'First female British PM. Transformed UK economics, crushed the miners\' strike, won the Falklands War. Loved and loathed in equal measure. Proved women could wield power at the highest level — while opposing much feminist policy.', colour: TEAL },
  { name: 'Angela Merkel', nation: 'Germany', years: '2005–2021', role: 'Chancellor for 16 years. Navigated the Eurozone crisis, opened Germany to refugees (2015), managed COVID. Often called the leader of the free world. A physicist who became the most powerful woman in modern history.', colour: INDIGO },
  { name: 'Ellen Johnson Sirleaf', nation: 'Liberia', years: '2006–2018', role: 'First elected female head of state in Africa. Led Liberia through post-civil-war recovery. Won the Nobel Peace Prize (2011). Proved that women\'s leadership could rebuild shattered nations.', colour: EMERALD },
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
        border: active ? `1px solid ${PURPLE}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(102,51,102,0.18)' : 'transparent',
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

function NarrativeCard({
  title,
  children,
  colour = PURPLE,
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
  colour = PURPLE,
}: {
  quote: string;
  attribution: string;
  colour?: string;
}) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${colour}`,
        padding: '14px 20px',
        margin: '20px 0',
        background: 'rgba(102,51,102,0.04)',
        borderRadius: '0 6px 6px 0',
      }}
    >
      <div style={{ fontSize: 15, fontStyle: 'italic', color: TEXT, lineHeight: 1.7 }}>
        &ldquo;{quote}&rdquo;
      </div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 6 }}>
        &mdash; {attribution}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        marginBottom: 18,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          minWidth: 64,
          fontWeight: 700,
          fontSize: 14,
          color: event.colour,
          paddingTop: 2,
        }}
      >
        {event.year}
      </div>
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderLeft: `3px solid ${event.colour}`,
          borderRadius: 8,
          padding: '14px 18px',
          flex: 1,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 4 }}>
          {event.title}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM }}>
          {event.detail}
        </div>
      </div>
    </div>
  );
}

function FigureCard({ figure }: { figure: Figure }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderTop: `3px solid ${figure.colour}`,
        borderRadius: 8,
        padding: '16px 18px',
        marginBottom: 14,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, color: figure.colour }}>
        {figure.name}
      </div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>
        {figure.era} &middot; {figure.years}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT }}>
        {figure.role}
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function WomensHistoryPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        color: TEXT,
        fontFamily: "'Inter', sans-serif",
        padding: 'clamp(16px, 4vw, 48px)',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {/* ── back link ─────────────────────────────────────────────── */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: TEXT_DIM,
          textDecoration: 'none',
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        &larr; Back to Chronicle
      </Link>

      {/* ── hero ──────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 42px)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            margin: 0,
            background: `linear-gradient(135deg, ${PURPLE}, ${ROSE})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Women&apos;s History
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            color: TEXT_DIM,
            marginTop: 8,
            fontStyle: 'italic',
          }}
        >
          Half of Humanity, Long Hidden from the Record
        </p>
      </header>

      {/* ── tab bar ───────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
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
      </nav>

      {/* ── tab content ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <SectionHeader icon="🌍" title="Overview — The Invisible Half" />

              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: 0 }}>{OVERVIEW_TEXT}</p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Why Women Disappeared from History
              </h3>
              <NarrativeCard title="The Record Was Never Neutral" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  History was written primarily by literate men in positions of power. Women&apos;s
                  contributions were systematically minimized, credited to men, or simply
                  not recorded. When women did appear in historical texts, they were
                  typically defined by their relationships to men — someone&apos;s wife, mother, or
                  daughter — rather than by their own achievements.
                </p>
                <p style={{ margin: 0 }}>
                  Even when women produced extraordinary work — scientific discoveries,
                  literary masterpieces, political leadership — historians found ways to
                  diminish them. Female rulers were called unnatural. Female scientists had
                  their work attributed to male colleagues. Female activists were dismissed as
                  hysterical. The erasure wasn&apos;t accidental. It was structural.
                </p>
              </NarrativeCard>

              <NarrativeCard title="What Gets Counted" colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  Traditional history focused on wars, conquests, and statecraft — domains
                  from which women were largely excluded by law and custom. The work that
                  women did — raising children, growing food, healing the sick, maintaining
                  communities, producing textiles, managing households — was classified as
                  &ldquo;domestic&rdquo; and therefore unworthy of historical attention.
                </p>
                <p style={{ margin: 0 }}>
                  Yet without this labor, no army would have marched, no city would have
                  functioned, and no civilization would have survived. Women&apos;s history
                  isn&apos;t a subcategory. It&apos;s the missing half of all history.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Well-behaved women seldom make history."
                attribution="Laurel Thatcher Ulrich, historian (1976)"
                colour={PURPLE}
              />
              <QuoteBlock
                quote="I myself have never been able to find out precisely what feminism is: I only know that people call me a feminist whenever I express sentiments that differentiate me from a doormat."
                attribution="Rebecca West (1913)"
                colour={ROSE}
              />
            </div>
          )}

          {/* ═══ ANCIENT WORLD ═══ */}
          {activeTab === 'ancient' && (
            <div>
              <SectionHeader icon="🏛️" title="Ancient World — Women in Power and Daily Life" />

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '0 0 12px' }}>
                Egypt — Exceptional Freedoms
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Ancient Egypt was remarkable for the relative rights it afforded women.</strong> Egyptian
                  women could own property, initiate divorce, conduct business, and testify in court.
                  They could serve as priestesses, physicians, and — in rare cases — pharaohs.
                  This was extraordinary compared to Greece and Rome, where women were legal minors
                  for life.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Hatshepsut (1479&ndash;1458 BCE)</strong> was Egypt&apos;s most successful female pharaoh. She
                  ruled for 22 years during the 18th Dynasty, building the magnificent mortuary
                  temple at Deir el-Bahri and expanding trade networks to the land of Punt. She
                  often depicted herself with a false beard — not out of deception, but because the
                  pharaonic iconography simply had no template for a female ruler.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Cleopatra VII (69&ndash;30 BCE)</strong> was the last active ruler of Ptolemaic Egypt.
                  She spoke nine languages, commanded naval fleets, and nearly prevented Roman
                  annexation through brilliant political alliances. Later history reduced her to a
                  &ldquo;seductress&rdquo; — a classic strategy for diminishing powerful women.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Rome — Influence Within Constraints
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  Roman women had no formal political rights. They could not vote, hold office,
                  or serve in the military. Legally, they were under the authority of their
                  fathers, then their husbands. Yet elite Roman women wielded substantial
                  informal power.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Livia Drusilla (58 BCE&ndash;29 CE)</strong>, wife of Augustus, was arguably the
                  most powerful woman in Rome. She influenced policy, managed vast estates,
                  and was eventually deified. She set the template for imperial women who
                  exercised real power while maintaining the fiction that they didn&apos;t.
                </p>
                <p style={{ margin: 0 }}>
                  Ordinary Roman women ran businesses, owned property (increasingly after
                  2nd century CE legal reforms), and managed estates while husbands were
                  away on military campaigns — which was often.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: ROSE, margin: '24px 0 12px' }}>
                China and India — Complex Legacies
              </h3>
              <NarrativeCard colour={ROSE}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Ancient China</strong> produced remarkable women despite Confucian ideology that
                  subordinated them. Ban Zhao (45&ndash;116 CE) was one of China&apos;s greatest historians,
                  completing her brother&apos;s monumental <em>Book of Han</em>. Wu Zetian (624&ndash;705 CE)
                  rose from concubine to become China&apos;s only female emperor, ruling the Tang
                  dynasty for 15 years with extraordinary effectiveness.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Ancient India</strong> had a complex mix: Vedic-era women participated in
                  intellectual and religious life, and some of the Rigveda&apos;s hymns were composed
                  by women. Gargi Vachaknavi debated philosophy at royal courts around 700 BCE.
                  But later periods saw increasing restrictions, including the practice of
                  sati (widow self-immolation) and purdah (seclusion).
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: INDIGO, margin: '24px 0 12px' }}>
                Greece — The Paradox
              </h3>
              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  Athens — birthplace of democracy — was one of the most restrictive societies
                  for women in the ancient world. Athenian women could not own property, attend
                  the Assembly, or leave the house without a male escort. They were permanent
                  legal minors. The great democracy was a democracy of men.
                </p>
                <p style={{ margin: 0 }}>
                  Sparta was different: Spartan women owned property (eventually about 40%
                  of Spartan land), exercised in public, spoke freely, and managed estates
                  while men were at war. Aristotle blamed Spartan women for Sparta&apos;s decline —
                  an early example of blaming women for any society where they had power.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="I am Hatshepsut, foremost of noble women. I have restored that which was in ruins. I have raised up that which was unfinished."
                attribution="Hatshepsut, inscription at Karnak"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ MEDIEVAL WOMEN ═══ */}
          {activeTab === 'medieval' && (
            <div>
              <SectionHeader icon="⚔️" title="Medieval Women — Power, Piety, and Erasure" />

              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: 0 }}>
                  The medieval period is often imagined as a dark age for women — and in many
                  ways it was. But the reality is more complex. Convents gave some women access
                  to education and authority. Queens and noblewomen managed estates and
                  sometimes kingdoms. Women worked in guilds, farmed, brewed ale, and practiced
                  medicine. The Church simultaneously elevated the Virgin Mary as the ideal
                  woman and burned &ldquo;witches&rdquo; for exercising knowledge.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Eleanor of Aquitaine (1122&ndash;1204)
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  The most powerful woman in medieval Europe. Heiress to the vast Duchy of
                  Aquitaine at 15. Queen of France (married Louis VII), went on the Second
                  Crusade, then had the marriage annulled. Married Henry II of England, becoming
                  Queen of England. Mother of Richard the Lionheart and King John.
                </p>
                <p style={{ margin: 0 }}>
                  Eleanor ruled England as regent while Richard was on Crusade. When she
                  supported her sons&apos; rebellion against Henry II, he imprisoned her for
                  16 years. She outlived him, outlived Richard, helped secure John&apos;s throne,
                  and died at 82 — extraordinary in any era, let alone the 12th century.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: PURPLE, margin: '24px 0 12px' }}>
                Hildegard of Bingen (1098&ndash;1179)
              </h3>
              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: '0 0 12px' }}>
                  Benedictine abbess, composer, philosopher, mystic, medical practitioner,
                  and natural scientist. She composed 77 liturgical songs — more surviving
                  compositions than any medieval composer, male or female. She wrote treatises
                  on medicine and natural history, corresponded with popes and emperors, and
                  went on preaching tours — almost unheard of for a woman.
                </p>
                <p style={{ margin: 0 }}>
                  The Catholic Church named her a Doctor of the Church in 2012 — 833 years
                  after her death. Only four women have received this title.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                Joan of Arc (1412&ndash;1431)
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  An illiterate teenage peasant girl from a village in Lorraine who claimed
                  to hear the voices of saints telling her to drive the English from France.
                  She convinced the Dauphin (future Charles VII) to give her command of troops,
                  then led the French to a pivotal victory at the Siege of Orl&eacute;ans (1429),
                  turning the tide of the Hundred Years&apos; War.
                </p>
                <p style={{ margin: 0 }}>
                  Captured by the Burgundians, sold to the English, tried for heresy and
                  cross-dressing by a rigged ecclesiastical court, and burned alive at
                  19. The trial records survive — and reveal a remarkable, defiant intelligence
                  under interrogation. She was canonized as a saint in 1920, nearly 500 years
                  after her execution.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: OCHRE, margin: '24px 0 12px' }}>
                Women&apos;s Work — The Invisible Economy
              </h3>
              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  Medieval women did far more than the &ldquo;lady in the castle&rdquo; image suggests.
                  They brewed ale (the alewife was a standard occupation), worked in textile
                  guilds, farmed, managed markets, and practiced as healers and midwives.
                  In some cities, women held guild membership and ran businesses.
                </p>
                <p style={{ margin: 0 }}>
                  Much of this was erased from official records. Tax rolls listed husbands.
                  Guild records were rewritten to exclude women as professions formalized.
                  The witch trials of the late medieval and early modern period specifically
                  targeted women healers and midwives — women whose knowledge of herbs and
                  the body threatened both the emerging male medical profession and Church
                  authority.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="I am not afraid. I was born to do this."
                attribution="Joan of Arc"
                colour={CRIMSON}
              />
              <QuoteBlock
                quote="The Word is living, being, spirit, all verdant greening, all creativity. This Word manifests itself in every creature."
                attribution="Hildegard of Bingen"
                colour={PURPLE}
              />
            </div>
          )}

          {/* ═══ SCIENCE — HIDDEN FIGURES ═══ */}
          {activeTab === 'science' && (
            <div>
              <SectionHeader icon="🔬" title="Hidden Figures — Women in Science and Scholarship" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Women have made foundational contributions to every field of science —
                  and have been systematically denied credit, excluded from institutions, and
                  erased from the record. The pattern is strikingly consistent across centuries:
                  a woman does the work, a man gets the prize.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Hypatia of Alexandria (~360&ndash;415 CE)
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Mathematician, astronomer, and head of the Neoplatonic school in Alexandria.
                  She taught students from across the Mediterranean, edited Ptolemy&apos;s
                  astronomical tables, and wrote commentaries on Diophantus and Apollonius.
                  She was murdered by a Christian mob — dragged from her chariot, stripped,
                  and killed with roofing tiles. Her death is often seen as marking the end
                  of classical Alexandria&apos;s intellectual golden age.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: INDIGO, margin: '24px 0 12px' }}>
                Ada Lovelace (1815&ndash;1852)
              </h3>
              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: 0 }}>
                  Daughter of Lord Byron. In 1843, she wrote detailed notes on Charles
                  Babbage&apos;s Analytical Engine that included what is recognized as the first
                  computer program. More remarkably, she foresaw that the machine could
                  manipulate symbols beyond mere number-crunching — anticipating the concept
                  of general-purpose computing a century before it existed. She died at 36.
                  The programming language Ada was named in her honor.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: PURPLE, margin: '24px 0 12px' }}>
                Marie Curie (1867&ndash;1934)
              </h3>
              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: '0 0 12px' }}>
                  Born Maria Sklodowska in Warsaw, she moved to Paris because Polish
                  universities wouldn&apos;t admit women. She discovered polonium and radium,
                  coined the term &ldquo;radioactivity,&rdquo; and became the only person in history
                  to win Nobel Prizes in two different sciences (Physics 1903, Chemistry 1911).
                </p>
                <p style={{ margin: 0 }}>
                  The French Academy of Sciences refused to elect her as a member — because
                  she was a woman. When she was nominated for her first Nobel, the committee
                  initially planned to award it only to her husband Pierre and Henri
                  Becquerel. Pierre insisted Marie be included. After Pierre&apos;s death, she
                  faced vicious press attacks over a brief affair — attacks that would never
                  have been directed at a male scientist.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                Lise Meitner (1878&ndash;1968)
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  Austrian-Swedish physicist who co-discovered nuclear fission in 1938. As a
                  Jewish woman, she was forced to flee Nazi Germany, continuing her work from
                  Sweden. Her longtime collaborator Otto Hahn published the experimental results;
                  Meitner and her nephew Otto Frisch provided the theoretical explanation. The
                  1944 Nobel Prize in Chemistry went to Hahn alone. Element 109 (meitnerium) was
                  later named in her honor — small consolation.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Rosalind Franklin (1920&ndash;1958)
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Her X-ray crystallography image (Photo 51) provided the critical evidence
                  for DNA&apos;s double helix structure. James Watson and Francis Crick used her
                  data — shown to them without her knowledge by her colleague Maurice
                  Wilkins — to build their model. Watson, Crick, and Wilkins received the
                  1962 Nobel Prize. Franklin had died of ovarian cancer in 1958, at age 37,
                  likely from radiation exposure. Watson later described her dismissively in
                  his memoir as &ldquo;Rosy&rdquo; — a name she never used.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: ROSE, margin: '24px 0 12px' }}>
                Hedy Lamarr (1914&ndash;2000)
              </h3>
              <NarrativeCard colour={ROSE}>
                <p style={{ margin: 0 }}>
                  Known as &ldquo;the most beautiful woman in the world,&rdquo; Lamarr was also a
                  brilliant inventor. During WWII, she co-patented a frequency-hopping
                  spread spectrum communication system designed to prevent the jamming of
                  radio-controlled torpedoes. The Navy dismissed the idea. Decades later,
                  the same principle became the foundation of WiFi, Bluetooth, and GPS
                  technology. She received no royalties and no recognition until late in life.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: EMERALD, margin: '24px 0 12px' }}>
                NASA&apos;s Hidden Figures
              </h3>
              <NarrativeCard colour={EMERALD}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Katherine Johnson</strong> calculated orbital trajectories for Mercury and
                  Apollo missions. John Glenn refused to fly until she personally verified the
                  electronic computer&apos;s numbers. <strong>Dorothy Vaughan</strong> taught herself
                  and her team FORTRAN programming when she saw that human computers would be
                  replaced by machines. <strong>Mary Jackson</strong> became NASA&apos;s first Black
                  female engineer, petitioning a court for the right to attend the all-white
                  classes she needed.
                </p>
                <p style={{ margin: 0 }}>
                  All three worked in a segregated facility. Their contributions were unknown
                  to the public for decades, until Margot Lee Shetterly&apos;s 2016 book and the
                  subsequent film brought their stories to light.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="In science, there is only physics. Everything else is stamp collecting."
                attribution="A sentiment often used to dismiss women's contributions in 'softer' sciences — while women who excelled in physics were denied recognition anyway"
                colour={CRIMSON}
              />
              <QuoteBlock
                quote="I was just doing my job."
                attribution="Katherine Johnson, when asked about her extraordinary calculations for NASA"
                colour={EMERALD}
              />
            </div>
          )}

          {/* ═══ SUFFRAGE ═══ */}
          {activeTab === 'suffrage' && (
            <div>
              <SectionHeader icon="🗳️" title="The Suffrage Movements — Votes for Women" />

              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: 0 }}>
                  The right to vote seems so fundamental now that it&apos;s hard to grasp how
                  radical and dangerous the demand was. Women who asked for the vote were
                  ridiculed, imprisoned, force-fed, beaten, and sometimes killed. The
                  struggle took over 70 years in the US and UK — and in some countries,
                  it&apos;s still incomplete.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Timeline of Women&apos;s Suffrage
              </h3>
              {SUFFRAGE_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                The Intersection of Race and Suffrage
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  The women&apos;s suffrage movement had a painful relationship with race. Many
                  white suffragists, including Elizabeth Cady Stanton and Susan B. Anthony,
                  opposed the 15th Amendment (giving Black men the vote) because it didn&apos;t
                  include women. Some used explicitly racist arguments: &ldquo;Why should the
                  degraded Black man vote before educated white women?&rdquo;
                </p>
                <p style={{ margin: 0 }}>
                  Ida B. Wells, Mary Church Terrell, and other Black suffragists fought
                  on two fronts — against racism within the movement and against sexism
                  in society. At the 1913 Washington suffrage parade, Black women were
                  told to march at the back. Ida B. Wells refused and marched with the
                  Illinois delegation. After the 19th Amendment, Black women in the South
                  were still effectively barred from voting for another 45 years.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We hold these truths to be self-evident: that all men and women are created equal."
                attribution="Elizabeth Cady Stanton, Declaration of Sentiments, Seneca Falls (1848)"
                colour={GOLD}
              />
              <QuoteBlock
                quote="Deeds, not words."
                attribution="Emmeline Pankhurst, motto of the WSPU"
                colour={PURPLE}
              />
            </div>
          )}

          {/* ═══ WWII & LABOR ═══ */}
          {activeTab === 'wwii' && (
            <div>
              <SectionHeader icon="🔧" title="WWII and Women's Labor" />

              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  World War II forced the most dramatic shift in women&apos;s labor in modern
                  history. With millions of men overseas, women were suddenly needed in
                  factories, shipyards, and offices. They built the planes, tanks, and
                  ammunition that won the war. And when the men came home, they were pushed
                  right back out.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Rosie the Riveter
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  &ldquo;We Can Do It!&rdquo; — the iconic poster became the symbol of women&apos;s
                  wartime labor. Between 1940 and 1945, approximately <strong>6 million
                  American women</strong> entered the workforce. Women welded ships, operated
                  heavy machinery, drove trucks, and ran production lines. They proved
                  beyond any doubt that women could do &ldquo;men&apos;s work&rdquo; — and often did it
                  better, with fewer injuries and higher quality.
                </p>
                <p style={{ margin: 0 }}>
                  Similar transformations happened in Britain (where women were conscripted
                  into war work), the Soviet Union (where women served as combat pilots,
                  snipers, and tank commanders), and across the combatant nations.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Soviet Women in Combat
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  The Soviet Union was unique in deploying women in direct combat roles.
                  Over 800,000 Soviet women served in the military. The &ldquo;Night Witches&rdquo;
                  (588th Night Bomber Regiment) flew 30,000 bombing sorties in plywood
                  biplanes. Lyudmila Pavlichenko was one of the deadliest snipers in
                  history with 309 confirmed kills. When asked about her count by American
                  journalists, she replied: &ldquo;In my country, we do not ask such questions.&rdquo;
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                The Pushback
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  When the war ended, the transformation was brutally reversed. Women were
                  fired from factory jobs to make room for returning veterans. Government
                  propaganda that had celebrated working women now promoted domesticity.
                  Magazines that had featured Rosie the Riveter switched to articles about
                  being a better wife and mother.
                </p>
                <p style={{ margin: 0 }}>
                  The 1950s &ldquo;feminine mystique&rdquo; — the idea that women&apos;s fulfillment came
                  solely through homemaking — was a direct reaction to the wartime proof
                  that women could do everything. The harder it became to deny women&apos;s
                  capabilities, the more aggressively they were pushed back into the home.
                  This tension would explode in the 1960s.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We Can Do It!"
                attribution="Rosie the Riveter poster, J. Howard Miller (1943)"
                colour={GOLD}
              />
              <QuoteBlock
                quote="I do not know what they mean when they say I should not be at the front. I do not know these rules."
                attribution="Lyudmila Pavlichenko, Soviet sniper"
                colour={TEAL}
              />
            </div>
          )}

          {/* ═══ SECOND-WAVE FEMINISM ═══ */}
          {activeTab === 'second-wave' && (
            <div>
              <SectionHeader icon="✊" title="Second-Wave Feminism (1960s–1980s)" />

              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: 0 }}>
                  The first wave won the vote. The second wave challenged everything else:
                  workplace discrimination, reproductive rights, sexual violence, family law,
                  and the assumption that women&apos;s primary role was domestic. It was louder,
                  angrier, and more radical than what came before — because it had to be.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: INDIGO, margin: '24px 0 12px' }}>
                The Feminine Mystique (1963)
              </h3>
              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: 0 }}>
                  Betty Friedan&apos;s book named &ldquo;the problem that has no name&rdquo; — the deep
                  unhappiness of educated, middle-class women confined to domesticity. It
                  sold 3 million copies and detonated the myth that women were naturally
                  fulfilled by housework and child-rearing. Friedan didn&apos;t create
                  second-wave feminism, but she lit the fuse.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: PURPLE, margin: '24px 0 12px' }}>
                Key Milestones
              </h3>
              <NarrativeCard title="NOW Founded (1966)" colour={PURPLE}>
                <p style={{ margin: 0 }}>
                  The National Organization for Women, co-founded by Friedan, became the
                  largest feminist organization in the US. It lobbied for the Equal Rights
                  Amendment, fought workplace discrimination, and pushed for enforcement
                  of Title VII of the Civil Rights Act, which banned sex discrimination
                  in employment.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Title IX (1972)" colour={EMERALD}>
                <p style={{ margin: 0 }}>
                  &ldquo;No person in the United States shall, on the basis of sex, be excluded
                  from participation in, be denied the benefits of, or be subjected to
                  discrimination under any education program or activity receiving Federal
                  financial assistance.&rdquo; Title IX transformed women&apos;s athletics and
                  educational access. Before Title IX, only 1 in 27 girls played high school
                  sports. Today it&apos;s nearly 1 in 2.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Roe v. Wade (1973)" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  The Supreme Court ruled that the Constitution protected a woman&apos;s right
                  to an abortion. The decision was based on the right to privacy. It became
                  the most divisive Supreme Court ruling since Brown v. Board of Education
                  and was overturned in 2022 (Dobbs v. Jackson Women&apos;s Health Organization),
                  returning abortion regulation to individual states.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Equal Pay Act (1963) & Beyond" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  The Equal Pay Act required equal pay for equal work regardless of sex.
                  Yet over 60 years later, American women still earn approximately 82 cents
                  for every dollar earned by men — and the gap is far worse for women of
                  color (Black women: ~67 cents; Latina women: ~57 cents). The law changed;
                  the reality changed less.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: ROSE, margin: '24px 0 12px' }}>
                Key Voices
              </h3>
              <NarrativeCard colour={ROSE}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Gloria Steinem</strong> co-founded Ms. magazine (1972), went undercover as a
                  Playboy Bunny to expose working conditions, and became the public face of
                  the movement — while insisting it had no single leader.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Bella Abzug</strong>, known as &ldquo;Battling Bella,&rdquo; was a New York
                  congresswoman who fought for the Equal Rights Amendment, Title IX, and
                  LGBTQ rights — decades before these were popular positions.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Shirley Chisholm</strong> — first Black woman elected to Congress (1968),
                  first Black candidate for a major party&apos;s presidential nomination (1972).
                  &ldquo;If they don&apos;t give you a seat at the table, bring a folding chair.&rdquo;
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="A woman without a man is like a fish without a bicycle."
                attribution="Irina Dunn, popularized by Gloria Steinem"
                colour={ROSE}
              />
              <QuoteBlock
                quote="The truth will set you free. But first, it will piss you off."
                attribution="Gloria Steinem"
                colour={PURPLE}
              />
            </div>
          )}

          {/* ═══ GLOBAL LEADERS ═══ */}
          {activeTab === 'leaders' && (
            <div>
              <SectionHeader icon="👑" title="Global Women Leaders — Across Cultures and Centuries" />

              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Women have led nations, empires, and movements across every era and
                  culture — usually against extraordinary resistance. They were told power
                  was unnatural for women; they took it anyway. Some were brilliant reformers,
                  some were ruthless authoritarians, some were both. What unites them is that
                  they proved, again and again, that leadership has no gender.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                {GLOBAL_LEADERS.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      borderTop: `3px solid ${l.colour}`,
                      borderRadius: 8,
                      padding: '16px 18px',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 16, color: l.colour }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}>
                      {l.nation} &middot; {l.years}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT }}>
                      {l.role}
                    </div>
                  </div>
                ))}
              </div>

              <QuoteBlock
                quote="I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king, and of a king of England too."
                attribution="Elizabeth I, speech at Tilbury (1588)"
                colour={PURPLE}
              />
              <QuoteBlock
                quote="Whether women are better than men I cannot say — but I can say they are certainly no worse."
                attribution="Golda Meir"
                colour={TEAL}
              />
            </div>
          )}

          {/* ═══ REPRODUCTIVE RIGHTS ═══ */}
          {activeTab === 'reproductive' && (
            <div>
              <SectionHeader icon="⚕️" title="Reproductive Rights — The Most Personal Political Battle" />

              <NarrativeCard colour={ROSE}>
                <p style={{ margin: 0 }}>
                  Control over reproduction is the foundation of women&apos;s autonomy. Without
                  it, education, careers, economic independence, and political participation
                  are all constrained. The fight for reproductive rights has been one of the
                  most contentious and consequential battles in modern history.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: PURPLE, margin: '24px 0 12px' }}>
                Margaret Sanger and Birth Control
              </h3>
              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: '0 0 12px' }}>
                  In the early 1900s, distributing information about contraception was illegal
                  in the United States under the Comstock Act. Margaret Sanger — a nurse who
                  watched women die from self-induced abortions and too-frequent pregnancies —
                  opened the first birth control clinic in the US (1916), was arrested, and
                  spent decades fighting for legal contraception.
                </p>
                <p style={{ margin: 0 }}>
                  Sanger&apos;s legacy is complicated: she was connected to the eugenics movement,
                  which advocated controlling reproduction among &ldquo;undesirable&rdquo; populations.
                  But her core achievement — the idea that women should be able to decide
                  when and whether to have children — was revolutionary.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                The Pill (1960)
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  The FDA approved the first oral contraceptive pill in 1960. Within five
                  years, 6 million American women were using it. The pill didn&apos;t just prevent
                  pregnancy — it transformed society. Women could plan their education and
                  careers. They married later, had fewer children, and entered the workforce
                  in unprecedented numbers. Economists estimate the pill was responsible for
                  a third of the increase in women&apos;s wages in the 1990s.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                Roe v. Wade and Its Reversal
              </h3>
              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  In 1973, the Supreme Court ruled 7&ndash;2 that the Constitution protected a
                  woman&apos;s right to abortion. For nearly 50 years, Roe v. Wade was the law of
                  the land — though states continually passed restrictions that made access
                  difficult, especially for poor women and women of color.
                </p>
                <p style={{ margin: 0 }}>
                  In June 2022, the Supreme Court&apos;s Dobbs decision overturned Roe, eliminating
                  the federal right to abortion and returning regulation to the states. Within
                  a year, over a dozen states had banned or severely restricted abortion. The
                  decision created a patchwork where reproductive rights depend on zip code —
                  and disproportionately affect women without the resources to travel.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: OCHRE, margin: '24px 0 12px' }}>
                Global Variation
              </h3>
              <NarrativeCard colour={OCHRE}>
                <p style={{ margin: '0 0 12px' }}>
                  Reproductive rights vary enormously worldwide. Some countries have expanded
                  access: Ireland repealed its abortion ban by referendum in 2018. Argentina
                  legalized abortion in 2020. But in many nations, abortion remains illegal
                  or heavily restricted.
                </p>
                <p style={{ margin: 0 }}>
                  The WHO estimates that 45% of all abortions globally are unsafe, and unsafe
                  abortion is the third leading cause of maternal death. Where abortion is
                  legal and accessible, it is one of the safest medical procedures. Where it
                  is banned, women die. The evidence is unambiguous: banning abortion doesn&apos;t
                  stop abortion — it stops safe abortion.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="No woman can call herself free who does not own and control her body."
                attribution="Margaret Sanger"
                colour={PURPLE}
              />
            </div>
          )}

          {/* ═══ TODAY ═══ */}
          {activeTab === 'today' && (
            <div>
              <SectionHeader icon="📊" title="Women's Rights Today — Progress and Gaps" />

              <NarrativeCard colour={EMERALD}>
                <p style={{ margin: 0 }}>
                  The progress has been extraordinary. In 1900, no country on Earth granted
                  women full legal equality. Today, women serve as heads of state, command
                  military forces, run corporations, and lead scientific breakthroughs. But
                  the gaps that remain are stubborn, structural, and sometimes widening.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: EMERALD, margin: '24px 0 12px' }}>
                How Far We&apos;ve Come
              </h3>
              <NarrativeCard colour={EMERALD}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Education:</strong> Globally, girls now enroll in primary school at nearly
                  the same rate as boys. In many developed countries, women outnumber men in
                  university enrollment. The literacy gap has narrowed dramatically.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Workforce:</strong> Women&apos;s labor force participation has risen from about
                  30% globally in 1950 to about 47% today. In many countries, women are the
                  majority of college-educated workers.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Political representation:</strong> Over 30 countries have had female heads
                  of state or government. Rwanda&apos;s parliament is over 60% women — the highest
                  in the world. Global average of women in parliament has risen from 12% in
                  1997 to about 27% today.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                What Remains
              </h3>
              <NarrativeCard title="The Pay Gap" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Globally, women earn roughly 77 cents for every dollar earned by men.
                  At the current rate of change, the World Economic Forum estimates it will
                  take over 130 years to close the global gender pay gap. The gap is caused
                  by a combination of outright discrimination, occupational segregation,
                  motherhood penalties, and the undervaluation of work predominantly done
                  by women.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Violence Against Women" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  One in three women worldwide experiences physical or sexual violence in
                  her lifetime. Domestic violence remains the most common form. The #MeToo
                  movement (2017) revealed the pervasiveness of sexual harassment and assault
                  across industries and cultures. Femicide — the killing of women because
                  they are women — claims tens of thousands of lives annually.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Representation" colour={INDIGO}>
                <p style={{ margin: 0 }}>
                  Women hold only about 10% of head-of-state positions globally. They make
                  up roughly 8% of Fortune 500 CEOs. In STEM fields, women remain
                  underrepresented, particularly in engineering and computer science. The
                  &ldquo;glass ceiling&rdquo; has cracked but not shattered.
                </p>
              </NarrativeCard>
              <NarrativeCard title="Unpaid Labor" colour={OCHRE}>
                <p style={{ margin: 0 }}>
                  Women perform roughly 75% of the world&apos;s unpaid care work — childcare,
                  elder care, cooking, cleaning. This invisible labor subsidizes every
                  economy on Earth but is excluded from GDP calculations. It constrains
                  women&apos;s ability to pursue education, employment, and political
                  participation. Until this work is recognized, valued, and shared
                  equitably, full equality is impossible.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Feminism isn't about making women stronger. Women are already strong. It's about changing the way the world perceives that strength."
                attribution="G.D. Anderson"
                colour={PURPLE}
              />
              <QuoteBlock
                quote="One child, one teacher, one book, one pen can change the world."
                attribution="Malala Yousafzai"
                colour={EMERALD}
              />
            </div>
          )}

          {/* ═══ KEY FIGURES ═══ */}
          {activeTab === 'figures' && (
            <div>
              <SectionHeader icon="🌟" title="Key Figures — Across Cultures and Centuries" />

              <NarrativeCard colour={PURPLE}>
                <p style={{ margin: 0 }}>
                  These 24 women span 3,500 years and every continent. They were pharaohs
                  and peasants, scientists and activists, warriors and writers. What they
                  share is that they changed the world — and the world tried to forget them.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                {KEY_FIGURES.map((f, i) => (
                  <FigureCard key={i} figure={f} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
