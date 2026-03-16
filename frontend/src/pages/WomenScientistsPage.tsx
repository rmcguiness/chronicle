/**
 * WomenScientistsPage — deep-dive page on women scientists and pioneers.
 *
 * Covers: Hypatia to CRISPR — the discoveries, the exclusions, the fight
 * for recognition.  Follows the AgeOfSailPage / KoreanWarPage pattern:
 * self-contained vertical scroll with data-driven sections.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── palette ─────────────────────────────────────────────────────────── */
const VIOLET = '#8b5cf6';
const ROSE = '#f43f5e';
const AMBER = '#f59e0b';
const TEAL = '#14b8a6';
const SKY = '#0ea5e9';
const FUCHSIA = '#d946ef';
const EMERALD = '#10b981';
const INDIGO = '#6366f1';
const CORAL = '#fb7185';
const GOLD = '#eab308';
const SLATE = '#94a3b8';
const ASH = '#94a3b8';
const LIME = '#84cc16';
const CYAN = '#06b6d4';
const PINK = '#ec4899';

const SECTION_COLORS = [VIOLET, ROSE, TEAL, SKY, AMBER, FUCHSIA, EMERALD, INDIGO, CORAL, GOLD, LIME, CYAN, PINK];
const FIGURE_COLORS = [VIOLET, ROSE, AMBER, TEAL, SKY, FUCHSIA, EMERALD, INDIGO, CORAL, GOLD, LIME, CYAN, PINK];

/* ─── types ───────────────────────────────────────────────────────────── */
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

interface QuoteEntry {
  text: string;
  attribution: string;
  color: string;
}

/* ─── data: ancient & medieval ────────────────────────────────────────── */
const ANCIENT_MEDIEVAL: FigureEntry[] = [
  {
    name: 'Hypatia of Alexandria',
    years: 'c. 360–415 CE',
    contribution:
      'Mathematician, astronomer, and philosopher who led the Neoplatonic school in Alexandria. She edited Ptolemy\'s Almagest and wrote commentaries on Diophantus\'s Arithmetica. Murdered by a Christian mob in 415 CE — her death is often cited as marking the end of classical antiquity\'s intellectual tradition.',
  },
  {
    name: 'Hildegard von Bingen',
    years: '1098–1179',
    contribution:
      'Benedictine abbess who wrote extensively on medicine, botany, and natural history. Her Physica catalogued hundreds of plants and their medicinal uses. She described the circulatory system centuries before William Harvey and composed over 70 liturgical songs — a true polymath in an era when women were barred from universities.',
  },
  {
    name: 'Trotula of Salerno',
    years: 'c. 11th–12th century',
    contribution:
      'Italian physician associated with the Salerno medical school — the first secular medical institution in Europe. Texts attributed to her on women\'s medicine and cosmetics were standard references for centuries, though male editors later attributed her work to male authors.',
  },
];

/* ─── data: 18th century ──────────────────────────────────────────────── */
const EIGHTEENTH_CENTURY: FigureEntry[] = [
  {
    name: 'Émilie du Châtelet',
    years: '1706–1749',
    contribution:
      'French mathematician and physicist who translated Newton\'s Principia Mathematica into French — still the standard French edition today. She proposed the concept of kinetic energy (vis viva), correctly arguing that energy is proportional to velocity squared, not velocity. Voltaire called her "a great man whose only fault was being a woman."',
  },
  {
    name: 'Caroline Herschel',
    years: '1750–1848',
    contribution:
      'First woman to discover a comet (she found eight). First woman to receive a salary as a scientist (from King George III). First woman awarded the Gold Medal of the Royal Astronomical Society. She catalogued 2,500 nebulae and star clusters — yet was introduced at court as her brother William\'s assistant.',
  },
  {
    name: 'Laura Bassi',
    years: '1711–1778',
    contribution:
      'The first woman to earn a university chair in a scientific field of studies — physics at the University of Bologna, 1732. She became one of the most important Newtonian physicists in Italy, conducting experiments in electricity and fluid mechanics while navigating a system that tried to make her appointment purely ceremonial.',
  },
];

/* ─── data: 19th century ──────────────────────────────────────────────── */
const NINETEENTH_CENTURY: FigureEntry[] = [
  {
    name: 'Mary Anning',
    years: '1799–1847',
    contribution:
      'Self-taught fossil hunter from Lyme Regis who discovered the first correctly identified ichthyosaur skeleton at age 12, the first complete plesiosaur, and the first British pterosaur. She could not publish her findings because she was a woman and working-class. Male geologists presented her discoveries as their own. The tongue-twister "she sells seashells by the seashore" was written about her.',
  },
  {
    name: 'Ada Lovelace',
    years: '1815–1852',
    contribution:
      'Wrote what is recognized as the first computer program — an algorithm for Charles Babbage\'s Analytical Engine to compute Bernoulli numbers (1843). She envisioned computers going beyond pure calculation, predicting they could compose music and process symbols. The U.S. Department of Defense named the Ada programming language in her honour.',
  },
  {
    name: 'Florence Nightingale',
    years: '1820–1910',
    contribution:
      'Pioneer of modern nursing AND of statistical graphics. Her polar area diagrams (coxcomb charts) proved that most soldiers in the Crimean War died from preventable infections, not battle wounds. This evidence-driven approach revolutionized hospital sanitation and military medicine. She was the first woman elected to the Royal Statistical Society.',
  },
  {
    name: 'Nettie Stevens',
    years: '1861–1912',
    contribution:
      'Discovered that chromosomes determine sex (XX/XY system) in 1905 by studying mealworm beetles. Her supervisor, Edmund Beecher Wilson, published similar findings simultaneously and received the credit for decades. Stevens died of breast cancer at 50, largely forgotten — her contribution wasn\'t fully acknowledged until the late 20th century.',
  },
  {
    name: 'Lise Meitner',
    years: '1878–1968',
    contribution:
      'Co-discovered nuclear fission with Otto Hahn in 1938 — the physics that made both nuclear power and nuclear weapons possible. Hahn received the 1944 Nobel Prize in Chemistry; Meitner was excluded despite being nominated 48 times. Einstein called her "the German Marie Curie." Element 109 (meitnerium) was named in her honour.',
  },
];

/* ─── data: Marie Curie ───────────────────────────────────────────────── */
const CURIE_INSIGHTS: InsightEntry[] = [
  {
    label: 'First Nobel: Physics, 1903',
    detail:
      'Shared with Pierre Curie and Henri Becquerel for work on radioactivity. The committee initially planned to nominate only Pierre — he insisted Marie be included. She was the first woman to win a Nobel Prize.',
  },
  {
    label: 'Second Nobel: Chemistry, 1911',
    detail:
      'Awarded solely to Marie for discovering polonium and radium and isolating pure radium. She remains the only person to win Nobel Prizes in two different sciences.',
  },
  {
    label: 'Radioactivity: the word itself',
    detail:
      'Curie coined the term "radioactivity." She developed the theory that radiation came from within atoms — not from molecular interactions — overturning the prevailing understanding of matter.',
  },
  {
    label: 'Mobile X-ray units',
    detail:
      'During World War I, Curie designed mobile X-ray units (petites Curies) and drove them to the front lines herself. An estimated one million soldiers were X-rayed using her equipment.',
  },
  {
    label: 'Systemic exclusion',
    detail:
      'The French Academy of Sciences rejected her membership because she was a woman (1911). Newspapers attacked her personal life rather than her science. Her lab notebooks are still so radioactive they must be stored in lead-lined boxes.',
  },
  {
    label: 'Death from science',
    detail:
      'Died in 1934 of aplastic anemia caused by years of radiation exposure. She routinely carried test tubes of radioactive isotopes in her pockets and stored them in her desk drawers, not understanding the danger.',
  },
];

/* ─── data: DNA & molecular biology ───────────────────────────────────── */
const FRANKLIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Photo 51',
    detail:
      'Franklin\'s X-ray crystallography image of DNA — "Photo 51" — was the critical evidence revealing the double helix structure. It was shown to James Watson by Maurice Wilkins without Franklin\'s knowledge or consent.',
  },
  {
    label: 'Watson & Crick\'s model',
    detail:
      'Watson and Crick built their famous DNA model using Franklin\'s data. Their 1953 Nature paper gave her only a passing mention. Watson\'s memoir The Double Helix described Franklin dismissively and focused on her appearance.',
  },
  {
    label: 'No Nobel',
    detail:
      'Franklin died of ovarian cancer in 1958 at age 37 — likely caused by X-ray exposure. Watson, Crick, and Wilkins received the 1962 Nobel Prize. The Nobel is not awarded posthumously, but the deeper issue is that her contribution was minimized while she was alive.',
  },
  {
    label: 'Beyond DNA',
    detail:
      'Franklin also made foundational contributions to understanding the structure of RNA viruses, including tobacco mosaic virus and poliovirus. Her coal and graphite research was commercially valuable to the British coal industry.',
  },
];

/* ─── data: computing pioneers ────────────────────────────────────────── */
const COMPUTING_PIONEERS: FigureEntry[] = [
  {
    name: 'Grace Hopper',
    years: '1906–1992',
    contribution:
      'U.S. Navy rear admiral who invented the first compiler (A-0, 1952) and led the team that created COBOL, which by 2000 ran 95% of ATM transactions and 80% of business code. She popularized the term "debugging" after finding an actual moth in the Harvard Mark II. Her maxim: "It\'s easier to ask forgiveness than permission."',
  },
  {
    name: 'Margaret Hamilton',
    years: 'b. 1936',
    contribution:
      'Led the team that wrote the onboard flight software for NASA\'s Apollo program. Her error-detection code prevented an abort during the Apollo 11 moon landing when the computer was overloaded. She coined the term "software engineering" to argue that programming deserved the same rigour as other engineering disciplines.',
  },
  {
    name: 'The ENIAC Programmers',
    years: '1945–1946',
    contribution:
      'Six women — Jean Jennings Bartik, Kay McNulty, Betty Snyder Holberton, Marlyn Wescoff Meltzer, Frances Bilas Spence, and Ruth Lichterman Teitelbaum — programmed the first general-purpose electronic computer. They received no credit at the time; press coverage focused on the male engineers who built the hardware.',
  },
  {
    name: 'Hedy Lamarr',
    years: '1914–2000',
    contribution:
      'Hollywood actress who co-invented frequency-hopping spread spectrum technology (patented 1942). Originally designed to prevent torpedo jamming, her concept became foundational to WiFi, Bluetooth, and CDMA cellular networks. The patent expired before the technology became commercially viable — she never earned a cent from it.',
  },
];

/* ─── data: Hidden Figures & space ────────────────────────────────────── */
const SPACE_PIONEERS: FigureEntry[] = [
  {
    name: 'Katherine Johnson',
    years: '1918–2020',
    contribution:
      'NASA mathematician whose orbital trajectory calculations were critical to the success of the first U.S. crewed spaceflights. John Glenn personally requested that she verify the electronic computer\'s orbital calculations before his 1962 Mercury flight: "If she says they\'re good, then I\'m ready to go." She calculated the trajectory for Apollo 11.',
  },
  {
    name: 'Dorothy Vaughan',
    years: '1910–2008',
    contribution:
      'NASA\'s first Black supervisor, who led the West Area Computing unit. When electronic computers arrived, she taught herself and her staff FORTRAN programming — transitioning her entire team from human computers to programmers before the role was eliminated.',
  },
  {
    name: 'Mary Jackson',
    years: '1921–2005',
    contribution:
      'NASA\'s first Black female engineer. She had to petition the city of Hampton, Virginia for permission to attend the graduate-level classes required for promotion — because they were held at a segregated white school. In 2020, NASA named its headquarters after her.',
  },
];

/* ─── data: 20th century breakthroughs ────────────────────────────────── */
const TWENTIETH_CENTURY: FigureEntry[] = [
  {
    name: 'Barbara McClintock',
    years: '1902–1992',
    contribution:
      'Discovered transposable elements ("jumping genes") in maize in the 1940s–50s. Her work was dismissed as aberrant for decades — the scientific community couldn\'t accept that genes could move between chromosomes. She finally received the Nobel Prize in Physiology or Medicine in 1983, at age 81. She is the only woman to receive an unshared Nobel in that category.',
  },
  {
    name: 'Chien-Shiung Wu',
    years: '1912–1997',
    contribution:
      'Experimentally disproved the law of conservation of parity — one of the most important physics experiments of the 20th century (1956). Theoretical physicists Tsung-Dao Lee and Chen-Ning Yang received the 1957 Nobel Prize for predicting parity violation; Wu, who actually proved it in the lab, was excluded.',
  },
  {
    name: 'Rachel Carson',
    years: '1907–1964',
    contribution:
      'Marine biologist whose 1962 book Silent Spring documented the devastating environmental effects of pesticides, especially DDT. The chemical industry spent millions attacking her credibility, calling her "hysterical" and a "spinster." Her work led to the creation of the Environmental Protection Agency and the modern environmental movement.',
  },
  {
    name: 'Vera Rubin',
    years: '1928–2016',
    contribution:
      'Provided the first strong observational evidence for dark matter by measuring galaxy rotation curves that defied Newtonian predictions. Despite her work implying that ~85% of the universe\'s matter is invisible, she was never awarded the Nobel Prize. Princeton\'s astronomy PhD program didn\'t accept women when she applied in the 1950s.',
  },
];

/* ─── data: modern era ────────────────────────────────────────────────── */
const MODERN_ERA: FigureEntry[] = [
  {
    name: 'Tu Youyou',
    years: 'b. 1930',
    contribution:
      'Chinese pharmaceutical chemist who discovered artemisinin — the most effective treatment for malaria — by studying traditional Chinese herbal medicine. Awarded the 2015 Nobel Prize in Physiology or Medicine. She has no PhD, no medical degree, and no overseas training — earning her the nickname "the professor of the three nos" in China.',
  },
  {
    name: 'Jennifer Doudna',
    years: 'b. 1964',
    contribution:
      'Co-developed CRISPR-Cas9 gene editing with Emmanuelle Charpentier — arguably the most consequential biological technology since PCR. They shared the 2020 Nobel Prize in Chemistry. CRISPR has already enabled treatments for sickle cell disease and holds potential for eliminating genetic disorders.',
  },
  {
    name: 'Maryam Mirzakhani',
    years: '1977–2017',
    contribution:
      'First woman (and first Iranian) to win the Fields Medal in mathematics (2014) for work on the dynamics and geometry of Riemann surfaces. She died of breast cancer at 40. Iran\'s state media initially published her photo without her hijab — a remarkable break from protocol.',
  },
  {
    name: 'Katalin Karikó',
    years: 'b. 1955',
    contribution:
      'Hungarian biochemist whose decades of work on mRNA technology was repeatedly rejected for funding and dismissed by peers. Her persistence led directly to the Pfizer-BioNTech and Moderna COVID-19 vaccines. She won the 2023 Nobel Prize in Physiology or Medicine — vindication after being demoted and denied tenure for years.',
  },
];

/* ─── data: structural barriers ───────────────────────────────────────── */
const BARRIERS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Matilda Effect',
    detail:
      'Named by historian Margaret Rossiter in 1993, this describes the systematic pattern of women\'s scientific contributions being attributed to male colleagues. Examples: Nettie Stevens/Edmund Wilson (chromosomes), Rosalind Franklin/Watson & Crick (DNA), Chien-Shiung Wu/Lee & Yang (parity), Jocelyn Bell Burnell/Antony Hewish (pulsars).',
  },
  {
    label: 'University exclusions',
    detail:
      'Cambridge didn\'t grant full degrees to women until 1948. Harvard\'s graduate school admitted women starting in 1920 but didn\'t grant them Harvard degrees until 1963 (they received Radcliffe degrees). Princeton\'s graduate programs began accepting women in 1961. Oxford waited until 1920.',
  },
  {
    label: 'The Nobel gap',
    detail:
      'Of 636 Nobel Prize laureates in science categories through 2024, only 26 are women (4.1%). Marie Curie won in 1903; the next woman in physics was Maria Goeppert Mayer — sixty years later, in 1963. No woman has won the Nobel in Physics since Andrea Ghez in 2020.',
  },
  {
    label: 'The "housework tax"',
    detail:
      'Studies consistently show that women in science spend significantly more time on service work (committee duties, mentoring, administrative tasks) than male colleagues of equal rank — reducing time available for research. This disparity persists even after controlling for seniority.',
  },
  {
    label: 'Publication bias',
    detail:
      'Papers with female first authors receive fewer citations on average. Studies submitted under male names are rated as more competent and offered higher starting salaries. Double-blind review processes measurably increase acceptance rates for women\'s submissions.',
  },
  {
    label: 'The leaky pipeline',
    detail:
      'Women earn ~53% of science PhDs in the U.S. but hold only ~33% of tenure-track positions and ~26% of full professorships. The drop-off is steepest in physics, computer science, and engineering — fields where women face the most hostile workplace cultures according to NAS surveys.',
  },
];

/* ─── data: master timeline ───────────────────────────────────────────── */
const MASTER_TIMELINE: TimelineEntry[] = [
  { year: 'c. 360 CE', title: 'Hypatia born in Alexandria', description: 'Becomes head of the Neoplatonic school — the ancient world\'s most prominent female mathematician.', color: VIOLET },
  { year: '415 CE', title: 'Hypatia murdered', description: 'Killed by a Christian mob, ending Alexandria\'s tradition of pagan intellectual leadership.', color: ROSE },
  { year: '1098', title: 'Hildegard von Bingen born', description: 'Will write pioneering works on medicine, natural history, and music composition.', color: TEAL },
  { year: '1706', title: 'Émilie du Châtelet born', description: 'Future translator of Newton and originator of the vis viva concept (kinetic energy).', color: SKY },
  { year: '1732', title: 'Laura Bassi earns a physics chair', description: 'First woman to hold a university chair in a scientific field, University of Bologna.', color: AMBER },
  { year: '1786', title: 'Caroline Herschel discovers her first comet', description: 'Will go on to discover eight comets and catalogue 2,500 nebulae.', color: FUCHSIA },
  { year: '1811', title: 'Mary Anning discovers first ichthyosaur', description: 'A 12-year-old working-class girl from Lyme Regis changes the history of paleontology.', color: EMERALD },
  { year: '1843', title: 'Ada Lovelace publishes first algorithm', description: 'Her notes on Babbage\'s Analytical Engine contain what is recognized as the first computer program.', color: INDIGO },
  { year: '1854', title: 'Florence Nightingale arrives in Crimea', description: 'Will pioneer evidence-based medicine using statistical graphics to prove infection kills more soldiers than combat.', color: CORAL },
  { year: '1895', title: 'Marie Curie begins radiation research', description: 'Will coin "radioactivity," discover polonium and radium, and win two Nobel Prizes.', color: GOLD },
  { year: '1903', title: 'Curie wins Nobel Prize in Physics', description: 'First woman to win a Nobel. Pierre insisted she be included after the committee tried to exclude her.', color: VIOLET },
  { year: '1905', title: 'Nettie Stevens discovers sex chromosomes', description: 'Proves that X and Y chromosomes determine biological sex. Her supervisor takes the credit.', color: ROSE },
  { year: '1911', title: 'Curie wins Nobel Prize in Chemistry', description: 'Only person to win Nobels in two different sciences — for discovering polonium and radium.', color: TEAL },
  { year: '1935', title: 'Irène Joliot-Curie wins Nobel in Chemistry', description: 'Marie\'s daughter, for discovering artificial radioactivity. Science ran in the Curie family.', color: SKY },
  { year: '1938', title: 'Lise Meitner co-discovers nuclear fission', description: 'Her colleague Otto Hahn wins the Nobel; Meitner is excluded despite 48 nominations.', color: AMBER },
  { year: '1942', title: 'Hedy Lamarr patents frequency hopping', description: 'Her spread spectrum technology will become foundational to WiFi, Bluetooth, and cellular networks.', color: FUCHSIA },
  { year: '1945', title: 'ENIAC programmed by six women', description: 'The first general-purpose electronic computer is programmed entirely by women — who receive no credit.', color: EMERALD },
  { year: '1951', title: 'Rosalind Franklin takes Photo 51', description: 'The X-ray image that reveals DNA\'s double helix structure. Shown to Watson without her knowledge.', color: INDIGO },
  { year: '1952', title: 'Grace Hopper invents the first compiler', description: 'The A-0 system translates mathematical notation into machine code — a revolutionary concept.', color: CORAL },
  { year: '1953', title: 'Watson & Crick publish DNA structure', description: 'Built using Franklin\'s data. She receives only a footnote acknowledgment.', color: GOLD },
  { year: '1956', title: 'Chien-Shiung Wu disproves parity conservation', description: 'One of the most important physics experiments of the century. Lee and Yang get the Nobel; Wu doesn\'t.', color: VIOLET },
  { year: '1962', title: 'Rachel Carson publishes Silent Spring', description: 'Documents the environmental devastation of pesticides. Launches the modern environmental movement despite industry attacks on her character.', color: ROSE },
  { year: '1962', title: 'Katherine Johnson calculates Glenn\'s orbit', description: '"If she says they\'re good, then I\'m ready to go." — John Glenn, refusing to fly until Johnson verified the computer\'s math.', color: TEAL },
  { year: '1969', title: 'Margaret Hamilton\'s code saves Apollo 11', description: 'Her error-detection system prevents an abort during the moon landing when the computer overloads.', color: SKY },
  { year: '1970s', title: 'Vera Rubin discovers evidence of dark matter', description: 'Galaxy rotation curves defy Newtonian physics — 85% of the universe\'s matter is invisible.', color: AMBER },
  { year: '1983', title: 'Barbara McClintock wins Nobel at 81', description: 'Vindicated after decades of dismissal — her "jumping genes" discovery is finally recognized.', color: FUCHSIA },
  { year: '2012', title: 'Doudna & Charpentier publish CRISPR-Cas9', description: 'The gene-editing tool that may eliminate genetic diseases. Nobel Prize follows in 2020.', color: EMERALD },
  { year: '2014', title: 'Maryam Mirzakhani wins Fields Medal', description: 'First woman and first Iranian to receive mathematics\' highest honour.', color: INDIGO },
  { year: '2015', title: 'Tu Youyou wins Nobel for artemisinin', description: 'Malaria cure derived from traditional Chinese medicine — by a scientist with "three nos" (no PhD, no MD, no foreign training).', color: CORAL },
  { year: '2020', title: 'Doudna & Charpentier win Nobel in Chemistry', description: 'First all-female Nobel Prize in science — for CRISPR-Cas9 gene editing.', color: GOLD },
  { year: '2023', title: 'Katalin Karikó wins Nobel for mRNA research', description: 'Decades of rejected grants and demotions led to the COVID-19 vaccines — and vindication.', color: VIOLET },
];

/* ─── data: pull quotes ───────────────────────────────────────────────── */
const QUOTES: QuoteEntry[] = [
  {
    text: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    attribution: 'Marie Curie',
    color: GOLD,
  },
  {
    text: 'Science and everyday life cannot and should not be separated.',
    attribution: 'Rosalind Franklin',
    color: INDIGO,
  },
  {
    text: 'The most dangerous phrase in the language is "we\'ve always done it this way."',
    attribution: 'Grace Hopper',
    color: CORAL,
  },
  {
    text: 'If they don\'t give you a seat at the table, bring a folding chair.',
    attribution: 'Shirley Chisholm (applied by generations of women in science)',
    color: FUCHSIA,
  },
  {
    text: 'I was just doing my job.',
    attribution: 'Katherine Johnson, on calculating the trajectory for Apollo 11',
    color: TEAL,
  },
];

/* ─── sub-components ──────────────────────────────────────────────────── */

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
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: '-40px' }}
      style={{ marginBottom: 56 }}
    >
      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          color: accentColor,
          marginBottom: 12,
        }}
      >
        {icon} {title}
      </h2>
      <p style={{ color: ASH, fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 20 }}>
        {intro}
      </p>
      {children}
    </motion.section>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderLeft: `3px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}`,
            borderRadius: 10,
            padding: '16px 18px',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>
            {f.name}
          </h3>
          <p style={{ fontSize: '0.8rem', color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 8, fontWeight: 500 }}>
            {f.years}
          </p>
          <p style={{ fontSize: '0.92rem', color: ASH, lineHeight: 1.65 }}>{f.contribution}</p>
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
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '16px 18px',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>
            {item.label}
          </h3>
          <p style={{ fontSize: '0.92rem', color: ASH, lineHeight: 1.65 }}>{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {entries.map((e, i) => (
        <motion.div
          key={`${e.year}-${e.title}`}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          viewport={{ once: true }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 16,
          }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: e.color }}>{e.year}</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0', margin: '2px 0 4px' }}>
            {e.title}
          </h3>
          <p style={{ fontSize: '0.92rem', color: ASH, lineHeight: 1.6 }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function PullQuote({ quote }: { quote: QuoteEntry }) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      style={{
        borderLeft: `4px solid ${quote.color}`,
        margin: '32px 0',
        padding: '20px 24px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '0 10px 10px 0',
      }}
    >
      <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#e2e8f0', lineHeight: 1.7, marginBottom: 8 }}>
        "{quote.text}"
      </p>
      <cite style={{ fontSize: '0.9rem', color: quote.color, fontStyle: 'normal', fontWeight: 500 }}>
        — {quote.attribution}
      </cite>
    </motion.blockquote>
  );
}

/* ─── main page ───────────────────────────────────────────────────────── */
export default function WomenScientistsPage() {
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
        {/* ── back link ── */}
        <div style={{ paddingTop: 24, marginBottom: 8 }}>
          <Link
            to="/"
            style={{
              color: VIOLET,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── hero ── */}
        <header style={{ marginBottom: 48 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${VIOLET}, ${ROSE}, ${AMBER})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Women Scientists & Pioneers — From Hypatia to CRISPR
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ fontSize: '1.1rem', color: ASH, lineHeight: 1.75, marginBottom: 16 }}
          >
            For most of recorded history, women were barred from universities, denied publication,
            excluded from professional societies, and erased from the credit lines of discoveries
            they made possible. The women on this page didn't just do extraordinary science — they
            did it while fighting systems designed to make their contributions invisible.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.75 }}
          >
            This is their story: from Hypatia teaching mathematics in 4th-century Alexandria to
            Jennifer Doudna editing the human genome, and the structural barriers that persist to
            this day.
          </motion.p>
        </header>

        {/* ── pull quote: Curie ── */}
        <PullQuote quote={QUOTES[0]} />

        {/* ── ancient & medieval ── */}
        <SectionWrapper
          id="ancient"
          icon="🏛️"
          title="Ancient & Medieval — The Earliest Pioneers"
          accentColor={VIOLET}
          intro="Before the word 'scientist' existed, women were already doing science. They worked as physicians, mathematicians, and natural philosophers — usually within religious institutions, the only spaces that granted women access to education."
        >
          <FigureGrid figures={ANCIENT_MEDIEVAL} />
        </SectionWrapper>

        {/* ── 18th century ── */}
        <SectionWrapper
          id="eighteenth"
          icon="🔭"
          title="The 18th Century — Salons, Stars, and Stolen Credit"
          accentColor={SKY}
          intro="The Enlightenment expanded access to knowledge — but not equally. Women who made breakthroughs were often introduced as assistants to their husbands or brothers, regardless of the magnitude of their contributions."
        >
          <FigureGrid figures={EIGHTEENTH_CENTURY} />
        </SectionWrapper>

        {/* ── 19th century ── */}
        <SectionWrapper
          id="nineteenth"
          icon="🔬"
          title="The 19th Century — Fossils, Algorithms, and the Statistics of Death"
          accentColor={AMBER}
          intro="The century that formalized science as a profession also formalized women's exclusion from it. Universities, learned societies, and journals systematically barred women — making every discovery by a woman an act of defiance."
        >
          <FigureGrid figures={NINETEENTH_CENTURY} />
        </SectionWrapper>

        {/* ── pull quote: Hopper ── */}
        <PullQuote quote={QUOTES[2]} />

        {/* ── Marie Curie ── */}
        <SectionWrapper
          id="curie"
          icon="☢️"
          title="Marie Curie — The Most Important Scientist You Almost Didn't Hear About"
          accentColor={GOLD}
          intro="Marie Sklodowska Curie is the only person to win Nobel Prizes in two different sciences. She coined the term 'radioactivity,' discovered two elements, and pioneered mobile X-ray units in World War I. The French Academy of Sciences still wouldn't let her in."
        >
          <InsightGrid items={CURIE_INSIGHTS} />
        </SectionWrapper>

        {/* ── DNA & Franklin ── */}
        <SectionWrapper
          id="franklin"
          icon="🧬"
          title="Rosalind Franklin & the Double Helix — Science's Most Famous Theft"
          accentColor={INDIGO}
          intro="The discovery of DNA's structure is one of the most celebrated moments in the history of science. It is also one of the clearest examples of the Matilda effect — a woman's work taken, used without consent, and credited to men."
        >
          <InsightGrid items={FRANKLIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── pull quote: Franklin ── */}
        <PullQuote quote={QUOTES[1]} />

        {/* ── computing pioneers ── */}
        <SectionWrapper
          id="computing"
          icon="💻"
          title="Computing Pioneers — The Women Who Programmed the Future"
          accentColor={CORAL}
          intro="Programming was originally considered 'women's work' — clerical, unglamorous, not real engineering. Women dominated early computing. When the field became prestigious and lucrative, they were pushed out."
        >
          <FigureGrid figures={COMPUTING_PIONEERS} />
        </SectionWrapper>

        {/* ── Hidden Figures ── */}
        <SectionWrapper
          id="space"
          icon="🚀"
          title="Hidden Figures — The Women Who Sent America to Space"
          accentColor={TEAL}
          intro="At NASA's Langley Research Center, Black women mathematicians computed trajectories by hand in segregated offices. They were called 'computers.' They were essential. And they were invisible until Margot Lee Shetterly's 2016 book brought their story to the world."
        >
          <FigureGrid figures={SPACE_PIONEERS} />
        </SectionWrapper>

        {/* ── pull quote: Katherine Johnson ── */}
        <PullQuote quote={QUOTES[4]} />

        {/* ── 20th century breakthroughs ── */}
        <SectionWrapper
          id="twentieth"
          icon="⚛️"
          title="20th Century — Jumping Genes, Dark Matter, and Silent Spring"
          accentColor={FUCHSIA}
          intro="The 20th century produced an extraordinary concentration of women whose discoveries reshaped entire fields — and an equally extraordinary pattern of delayed recognition, stolen credit, and outright exclusion."
        >
          <FigureGrid figures={TWENTIETH_CENTURY} />
        </SectionWrapper>

        {/* ── modern era ── */}
        <SectionWrapper
          id="modern"
          icon="🧪"
          title="The Modern Era — CRISPR, mRNA, and Unfinished Business"
          accentColor={EMERALD}
          intro="The 21st century has seen landmark Nobel Prizes for women in science — but the structural barriers haven't disappeared. They've evolved. Progress is real but incomplete."
        >
          <FigureGrid figures={MODERN_ERA} />
        </SectionWrapper>

        {/* ── structural barriers ── */}
        <SectionWrapper
          id="barriers"
          icon="🚧"
          title="Structural Barriers — The Systems Behind the Stories"
          accentColor={ROSE}
          intro="Individual stories of exclusion are not isolated incidents. They are symptoms of institutional structures that systematically devalue, erase, and obstruct women's contributions to science. Understanding these structures is essential to dismantling them."
        >
          <InsightGrid items={BARRIERS_INSIGHTS} />
        </SectionWrapper>

        {/* ── pull quote: Chisholm ── */}
        <PullQuote quote={QUOTES[3]} />

        {/* ── master timeline ── */}
        <SectionWrapper
          id="timeline"
          icon="📜"
          title="Master Timeline — Two Millennia of Discovery"
          accentColor={CYAN}
          intro="From 4th-century Alexandria to 21st-century CRISPR labs — every entry on this timeline represents a woman who overcame extraordinary barriers to change what we know about the world."
        >
          <TimelineCard entries={MASTER_TIMELINE} />
        </SectionWrapper>

        {/* ── footer ── */}
        <footer style={{ textAlign: 'center', padding: '48px 0 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            to="/"
            style={{
              color: VIOLET,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
            }}
          >
            ← Back to Timeline
          </Link>
          <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: 12 }}>
            Chronicle — An Immersive Journey Through History
          </p>
        </footer>
      </div>
    </div>
  );
}
