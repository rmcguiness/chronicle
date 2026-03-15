/**
 * ClimateChangeHistoryPage — comprehensive deep-dive on the history of
 * climate change science, the environmental movement, the denial machine,
 * and the race against time from Fourier (1824) to the Paris Agreement.
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
const CARD_BG = 'rgba(34,139,34,0.06)';
const CARD_BORDER = 'rgba(34,139,34,0.22)';
const GREEN = '#2d8659';
const EMBER = '#c94a2e';
const GOLD = '#c9a227';
const TEAL = '#2a8a8a';
const INDIGO = '#5b5ea6';
const OCHRE = '#b87333';
const CRIMSON = '#b33a3a';
const ICE_BLUE = '#5fa8d3';
const SMOKE = '#8a8a8a';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'early-science'
  | 'environment'
  | 'solidifies'
  | 'denial'
  | 'acceleration'
  | 'paris'
  | 'numbers'
  | 'solutions'
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
  { key: 'early-science', label: 'Early Science', icon: '🔬' },
  { key: 'environment', label: 'Environmental Movement', icon: '🌿' },
  { key: 'solidifies', label: 'Science Solidifies', icon: '📊' },
  { key: 'denial', label: 'Denial Machine', icon: '🛢️' },
  { key: 'acceleration', label: '2000s Acceleration', icon: '🔥' },
  { key: 'paris', label: 'Paris & Beyond', icon: '🌐' },
  { key: 'numbers', label: 'The Numbers', icon: '📈' },
  { key: 'solutions', label: 'Solutions', icon: '☀️' },
  { key: 'figures', label: 'Key Figures', icon: '🌟' },
];

const OVERVIEW_TEXT =
  'Climate change is the defining challenge of the 21st century — but the science is not new. Scientists have understood the greenhouse effect for 200 years. The oil industry knew its products were warming the planet since the 1970s. The story of climate change is not just a story of science — it is a story of corporate deception, political failure, individual courage, and the largest collective action problem humanity has ever faced.';

const EARLY_SCIENCE_TIMELINE: TimelineEvent[] = [
  {
    year: '1824',
    title: 'Joseph Fourier — The Greenhouse Effect',
    detail:
      'French mathematician Joseph Fourier calculated that the Earth should be much colder than it actually is, given its distance from the Sun. He proposed that the atmosphere must act as an insulating blanket, trapping heat — the first description of what we now call the greenhouse effect.',
    colour: TEAL,
  },
  {
    year: '1856',
    title: 'Eunice Newton Foote — First CO₂ Experiments',
    detail:
      'American scientist Eunice Newton Foote conducted the first experiments demonstrating that CO₂ traps heat. She filled glass cylinders with different gases, placed them in sunlight, and measured the temperature changes. Her paper was presented at the AAAS — by a man, because women could not present their own work. Her contribution was forgotten for over 150 years, credited instead to John Tyndall.',
    colour: GOLD,
  },
  {
    year: '1859',
    title: 'John Tyndall — Identifying Heat-Trapping Gases',
    detail:
      'Irish physicist John Tyndall conducted more sophisticated experiments identifying which specific gases — water vapour, carbon dioxide, methane — absorb infrared radiation. His work established the physical mechanism of the greenhouse effect and is often (incorrectly) credited as the first such discovery.',
    colour: TEAL,
  },
  {
    year: '1896',
    title: 'Svante Arrhenius — CO₂ Doubling = +5-6°C',
    detail:
      'Swedish chemist Svante Arrhenius performed thousands of hand calculations to estimate that doubling atmospheric CO₂ would raise global temperatures by 5-6°C. His estimate was remarkably close to modern projections. He thought it would take thousands of years and considered warming beneficial. He was right about the physics, wrong about the timeline.',
    colour: INDIGO,
  },
  {
    year: '1938',
    title: 'Guy Callendar — The "Callendar Effect"',
    detail:
      'British engineer Guy Callendar compiled global temperature records and CO₂ measurements, demonstrating a correlation between rising CO₂ and rising temperatures. The scientific establishment dismissed him as an amateur. He was right about everything.',
    colour: OCHRE,
  },
  {
    year: '1958',
    title: 'The Keeling Curve Begins',
    detail:
      'Charles David Keeling began continuous CO₂ measurements at Mauna Loa Observatory, Hawaii. The resulting "Keeling Curve" — showing CO₂ rising steadily year after year — became the most important graph in climate science. When measurements began, CO₂ was at 315 ppm. Today it exceeds 420 ppm, the highest level in at least 3 million years.',
    colour: GREEN,
  },
];

const ENVIRONMENT_TIMELINE: TimelineEvent[] = [
  {
    year: '1962',
    title: 'Rachel Carson — "Silent Spring"',
    detail:
      'Marine biologist Rachel Carson published "Silent Spring," documenting how DDT and other pesticides were devastating wildlife and entering the human food chain. The chemical industry spent millions attacking her — calling her hysterical, a communist, a spinster. She was dying of cancer while they tried to destroy her credibility. She was right. DDT was banned in 1972. "Silent Spring" is widely credited as the birth of the modern environmental movement.',
    colour: GREEN,
  },
  {
    year: '1970',
    title: 'First Earth Day — 20 Million People',
    detail:
      'On April 22, 1970, approximately 20 million Americans (10% of the US population) participated in the first Earth Day — the largest civic event in human history at that time. The movement led directly to the creation of the Environmental Protection Agency (EPA) and the passage of the Clean Air Act, Clean Water Act, and Endangered Species Act — all within three years.',
    colour: GREEN,
  },
  {
    year: '1972',
    title: 'UN Conference on the Human Environment (Stockholm)',
    detail:
      'The first major international conference on environmental issues, held in Stockholm, Sweden. 113 nations participated. It established the UN Environment Programme (UNEP) and placed environmental concerns on the international diplomatic agenda for the first time. The declaration stated that humans have "a solemn responsibility to protect and improve the environment for present and future generations."',
    colour: TEAL,
  },
  {
    year: '1972',
    title: '"Limits to Growth" — The First Warning',
    detail:
      'A team of MIT scientists, commissioned by the Club of Rome, published "The Limits to Growth" — a computer simulation projecting that unchecked economic and population growth would overshoot Earth\'s carrying capacity by the mid-21st century. It was attacked as alarmist. Fifty years later, the model\'s projections have tracked remarkably well with observed data.',
    colour: OCHRE,
  },
  {
    year: '1973',
    title: 'Oil Crisis — Fossil Fuel Dependence Exposed',
    detail:
      'The OPEC oil embargo sent shockwaves through the global economy, with oil prices quadrupling overnight. Long lines at gas stations, rationing, and recession exposed how utterly dependent industrial economies were on fossil fuels. It sparked the first serious investment in solar and wind energy — investments that were largely abandoned when oil prices fell.',
    colour: EMBER,
  },
];

const SOLIDIFIES_TIMELINE: TimelineEvent[] = [
  {
    year: '1979',
    title: 'First World Climate Conference',
    detail:
      'The World Meteorological Organization convened the first World Climate Conference in Geneva. Scientists warned that continued fossil fuel burning would likely lead to significant warming. The conference called for international cooperation. Governments took note — and then did nothing for a decade.',
    colour: TEAL,
  },
  {
    year: '1985',
    title: 'Ozone Hole Discovered — Proof of Concept',
    detail:
      'Scientists discovered a massive hole in the ozone layer over Antarctica, caused by CFC chemicals. The Montreal Protocol (1987) rapidly phased out CFCs — proving that international cooperation on atmospheric threats was possible. Climate activists point to the ozone treaty as evidence that we can act when we choose to. The difference: CFCs were made by a handful of companies. Fossil fuels power the entire global economy.',
    colour: INDIGO,
  },
  {
    year: '1988',
    title: 'James Hansen Testifies: "Global Warming Has Begun"',
    detail:
      'On June 23, 1988 — a day deliberately chosen because Washington DC was sweltering at 98°F — NASA scientist James Hansen testified before the US Senate that global warming was real, it was already happening, and human activities were the cause. He was 99% confident. The testimony made front-page news worldwide and is considered the moment climate change entered mainstream political discourse.',
    colour: EMBER,
  },
  {
    year: '1988',
    title: 'IPCC Founded',
    detail:
      'The Intergovernmental Panel on Climate Change (IPCC) was established by the UN to provide policymakers with regular scientific assessments of climate change. It would become the gold standard for climate science — and a constant target for the denial industry.',
    colour: TEAL,
  },
  {
    year: '1992',
    title: 'Earth Summit — Rio de Janeiro',
    detail:
      'The UN Conference on Environment and Development ("Earth Summit") in Rio de Janeiro brought 172 governments together and produced the United Nations Framework Convention on Climate Change (UNFCCC). For the first time, nations formally acknowledged that climate change was a serious problem requiring international cooperation. George H.W. Bush signed it. It was non-binding.',
    colour: GREEN,
  },
  {
    year: '1997',
    title: 'Kyoto Protocol — First Binding Cuts (Rejected by US)',
    detail:
      'The Kyoto Protocol established the first legally binding emissions reduction targets for industrialized nations. The US Senate voted 95-0 against ratification before the treaty was even finalized — the Byrd-Hagel Resolution. President Clinton signed the protocol but never submitted it for ratification. President Bush withdrew entirely in 2001. Without the world\'s largest emitter, Kyoto\'s impact was limited.',
    colour: GOLD,
  },
  {
    year: '1998',
    title: 'Hottest Year on Record (at the Time)',
    detail:
      '1998 was the hottest year in the modern temperature record, driven by a powerful El Niño. Climate skeptics would spend the next 15 years claiming that "global warming stopped in 1998" — cherry-picking the peak to suggest no trend. Every decade since has been hotter than the previous one. 1998 doesn\'t even rank in the top 10 anymore.',
    colour: EMBER,
  },
];

const DENIAL_EVENTS: TimelineEvent[] = [
  {
    year: '1977',
    title: 'Exxon Knew — Internal Research',
    detail:
      'Exxon\'s own scientists conducted cutting-edge climate research in the late 1970s and accurately predicted global warming. Internal documents, later uncovered by investigative journalists, show that the company understood the severity of the threat. Instead of acting on this knowledge, Exxon spent the next four decades funding climate denial.',
    colour: SMOKE,
  },
  {
    year: '1989',
    title: 'Global Climate Coalition — Organized Denial',
    detail:
      'Major oil, coal, and auto companies formed the Global Climate Coalition to oppose emissions regulations. The group spent millions lobbying against the Kyoto Protocol, running ads questioning climate science, and funding sympathetic think tanks. Its own scientific advisors told them the science was solid — they buried that advice. The coalition disbanded in 2002, but its tactics lived on.',
    colour: SMOKE,
  },
  {
    year: '1998',
    title: 'The "Oregon Petition" — Manufactured Doubt',
    detail:
      'A petition claiming to have 31,000 "scientist" signatures rejecting climate change was mailed with a fake research paper formatted to look like a National Academy of Sciences publication. The NAS issued an unprecedented public denunciation. Signatories included fictitious names and people with no climate expertise. The petition is still cited by denialists today.',
    colour: CRIMSON,
  },
  {
    year: '2000s',
    title: 'Koch Brothers & Heartland Institute',
    detail:
      'Koch Industries and the Heartland Institute became central nodes in the climate denial network, funding hundreds of millions of dollars to think tanks, political campaigns, and media organizations that questioned climate science. The playbook was borrowed directly from the tobacco industry: manufacture doubt, fund "alternative" research, attack individual scientists, and frame regulation as economic catastrophe.',
    colour: SMOKE,
  },
  {
    year: '2015',
    title: 'ExxonMobil Investigation — "They Knew Everything"',
    detail:
      'Investigative reporting by InsideClimate News and the Los Angeles Times revealed the full extent of Exxon\'s internal climate research — and how precisely their 1970s predictions had matched observed warming. Internal Exxon graphs from the 1980s predicted the trajectory of warming with remarkable accuracy. The company knew its products would fundamentally alter the climate and chose profits over the planet. Multiple state attorneys general launched investigations.',
    colour: CRIMSON,
  },
];

const ACCELERATION_TIMELINE: TimelineEvent[] = [
  {
    year: '2006',
    title: '"An Inconvenient Truth" — Climate Goes Mainstream',
    detail:
      'Al Gore\'s documentary on climate change became one of the highest-grossing documentaries ever made, bringing climate science to millions of people who had never engaged with the issue. It was attacked relentlessly by the denial industry, but it fundamentally shifted public awareness. Love him or hate him, Gore made climate change a kitchen-table issue.',
    colour: TEAL,
  },
  {
    year: '2007',
    title: 'IPCC 4th Assessment — Nobel Peace Prize',
    detail:
      'The IPCC\'s Fourth Assessment Report concluded with greater than 90% certainty that human activities were causing climate change. The IPCC and Al Gore shared the Nobel Peace Prize. The report stated: "Warming of the climate system is unequivocal."',
    colour: GOLD,
  },
  {
    year: '2009',
    title: 'Copenhagen — The Near-Miss',
    detail:
      'The Copenhagen Climate Conference was supposed to produce a binding successor to Kyoto. It ended in chaos and recrimination — a last-minute deal brokered by the US, China, India, Brazil, and South Africa set a 2°C target but with no binding commitments. The failure was a turning point: it showed that top-down, legally binding approaches faced enormous political obstacles. The disappointment reshaped climate diplomacy toward the bottom-up model that would eventually produce the Paris Agreement.',
    colour: OCHRE,
  },
  {
    year: '2010s',
    title: 'Extreme Weather Accelerates',
    detail:
      'The 2010s brought a cascade of climate-amplified disasters: Hurricane Sandy (2012), Typhoon Hainan (2013), unprecedented Arctic ice loss, Australian bushfires (2019-2020), and record-breaking heat waves across Europe. Each event was a data point in a clear pattern. The phrase "once in a century" lost its meaning. Insurance losses mounted. Climate change moved from abstract future threat to lived present reality.',
    colour: EMBER,
  },
];

const PARIS_TIMELINE: TimelineEvent[] = [
  {
    year: '2015',
    title: 'Paris Agreement — 196 Nations',
    detail:
      'After the failure of Copenhagen, French diplomats spent years building a new architecture — voluntary national commitments (NDCs) rather than top-down mandates. On December 12, 2015, 196 countries adopted the Paris Agreement, pledging to limit warming to "well below 2°C" with efforts toward 1.5°C. It was the first universal climate agreement. The room erupted. Laurent Fabius banged his gavel and wept.',
    colour: GREEN,
  },
  {
    year: '2017',
    title: 'US Withdraws (Trump) — Then Rejoins (Biden)',
    detail:
      'President Trump announced US withdrawal from the Paris Agreement in June 2017, calling it "unfair" to the US. The withdrawal process took until November 2020 — the day after the presidential election. President Biden rejoined on his first day in office (January 20, 2021). The episode revealed the fragility of climate commitments tied to electoral cycles.',
    colour: CRIMSON,
  },
  {
    year: '2018',
    title: 'Greta Thunberg — School Strike for Climate',
    detail:
      'In August 2018, 15-year-old Greta Thunberg sat alone outside the Swedish Parliament with a hand-painted sign: "Skolstrejk för klimatet" (School Strike for Climate). Within months, millions of students worldwide joined "Fridays for Future." Her speech at the UN ("How dare you") became a defining moment. She was attacked viciously by the political right — proving her effectiveness.',
    colour: GOLD,
  },
  {
    year: '2018',
    title: 'IPCC Special Report — "We Have 12 Years"',
    detail:
      'The IPCC\'s Special Report on 1.5°C warned that the world had roughly 12 years to halve emissions to avoid the worst consequences of climate change. The difference between 1.5°C and 2°C of warming was dramatic: at 2°C, virtually all coral reefs die, hundreds of millions more people face extreme heat, and sea level rise threatens entire island nations. The report made 1.5°C the new benchmark.',
    colour: EMBER,
  },
  {
    year: '2019',
    title: 'Global Climate Strike — 4 Million People',
    detail:
      'On September 20, 2019, an estimated 4 million people in 161 countries participated in the Global Climate Strike — the largest climate protest in history. Led overwhelmingly by young people who would live with the consequences of inaction. "You are failing us. But the young people are starting to understand your betrayal." — Greta Thunberg',
    colour: GREEN,
  },
  {
    year: '2022',
    title: 'Inflation Reduction Act — Largest US Climate Legislation',
    detail:
      'The IRA directed $369 billion toward clean energy, electric vehicles, and emissions reduction — the largest climate legislation in US history. It used tax credits and subsidies rather than carbon pricing. Projections suggest it could cut US emissions by 40% below 2005 levels by 2030. It passed by a single vote in the Senate (Kamala Harris breaking the tie).',
    colour: GREEN,
  },
];

const KEY_FIGURES: Figure[] = [
  {
    name: 'Eunice Newton Foote',
    era: 'Pioneer',
    years: '1819–1888',
    role: 'First person to demonstrate that CO₂ traps heat (1856). Her paper was read by a male colleague because women could not present at scientific meetings. Her contribution was overlooked for over 150 years, with credit going to John Tyndall.',
    colour: GOLD,
  },
  {
    name: 'Svante Arrhenius',
    era: 'Pioneer',
    years: '1859–1927',
    role: 'Swedish chemist who first calculated the warming effect of doubling CO₂ (1896). His estimate of +5-6°C was remarkably close to modern projections. Won the Nobel Prize in Chemistry (1903) for unrelated work.',
    colour: INDIGO,
  },
  {
    name: 'Rachel Carson',
    era: 'Environmentalist',
    years: '1907–1964',
    role: 'Marine biologist whose book "Silent Spring" (1962) launched the modern environmental movement by exposing the devastating effects of pesticides. Faced vicious attacks from the chemical industry while dying of breast cancer. Her work led directly to the creation of the EPA.',
    colour: GREEN,
  },
  {
    name: 'Charles David Keeling',
    era: 'Scientist',
    years: '1928–2005',
    role: 'Created the Keeling Curve — continuous CO₂ measurements at Mauna Loa beginning in 1958. This single dataset, showing CO₂ rising relentlessly year after year, became the most iconic evidence of human impact on the atmosphere.',
    colour: TEAL,
  },
  {
    name: 'James Hansen',
    era: 'Scientist/Activist',
    years: '1941–',
    role: 'NASA scientist whose 1988 Congressional testimony put climate change on the political map. Declared with 99% confidence that global warming had begun. Later became an activist, getting arrested at pipeline protests. Said: "The science is clear. The threat is real. The time to act is now."',
    colour: EMBER,
  },
  {
    name: 'Wangari Maathai',
    era: 'Activist',
    years: '1940–2011',
    role: 'Kenyan environmentalist who founded the Green Belt Movement, planting over 51 million trees across Africa. First African woman to win the Nobel Peace Prize (2004). Connected environmental destruction to poverty, women\'s rights, and democratic governance. Beaten and imprisoned for challenging the government.',
    colour: GREEN,
  },
  {
    name: 'Al Gore',
    era: 'Politician/Advocate',
    years: '1948–',
    role: 'Former US Vice President whose documentary "An Inconvenient Truth" (2006) brought climate change to a mass audience. Shared the Nobel Peace Prize with the IPCC (2007). Criticized for his personal carbon footprint, but credit is due: he made millions care about a graph.',
    colour: TEAL,
  },
  {
    name: 'Greta Thunberg',
    era: 'Activist',
    years: '2003–',
    role: 'Swedish climate activist who began a solo school strike at age 15 that grew into a global movement of millions. Her blunt, uncompromising speeches ("How dare you") shattered political niceties. Diagnosed with Asperger\'s, which she calls her "superpower" — the ability to see through social conventions to the raw truth.',
    colour: GOLD,
  },
  {
    name: 'Michael Mann',
    era: 'Scientist',
    years: '1965–',
    role: 'Climate scientist who created the "hockey stick" graph showing unprecedented modern warming. Became the target of sustained personal attacks from the denial industry, including death threats and frivolous lawsuits. Fought back and won — both in court and in the scientific record.',
    colour: ICE_BLUE,
  },
  {
    name: 'Vandana Shiva',
    era: 'Activist',
    years: '1952–',
    role: 'Indian scholar and environmental activist who championed biodiversity conservation, seed sovereignty, and the rights of small farmers against corporate agriculture. Connected climate justice to food justice and the rights of the Global South.',
    colour: GREEN,
  },
  {
    name: 'Bill McKibben',
    era: 'Writer/Activist',
    years: '1960–',
    role: 'Author of "The End of Nature" (1989), one of the first books on climate change for a general audience. Founded 350.org, one of the largest grassroots climate organizations. The name references 350 ppm — the safe level of CO₂. We passed it in 1988.',
    colour: TEAL,
  },
  {
    name: 'Christiana Figueres',
    era: 'Diplomat',
    years: '1956–',
    role: 'Costa Rican diplomat who served as Executive Secretary of the UNFCCC and is widely credited as the architect of the Paris Agreement. Took over after the failure of Copenhagen and spent six years rebuilding trust. Called "the woman who saved the world from climate catastrophe" by some observers.',
    colour: GREEN,
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
        border: active ? `1px solid ${GREEN}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(34,139,34,0.18)' : 'transparent',
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
  colour = GREEN,
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
  colour = GREEN,
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
        background: 'rgba(34,139,34,0.04)',
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

function StatCard({
  label,
  value,
  detail,
  colour,
}: {
  label: string;
  value: string;
  detail: string;
  colour: string;
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderTop: `3px solid ${colour}`,
        borderRadius: 8,
        padding: '18px 20px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 12, color: TEXT_DIM, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: colour, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: TEXT_DIM }}>
        {detail}
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function ClimateChangeHistoryPage() {
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
            lineHeight: 1.15,
            color: TEXT,
            margin: '0 0 12px',
          }}
        >
          Climate Change{' '}
          <span style={{ color: GREEN }}>—</span>{' '}
          <span style={{ color: TEXT_DIM, fontWeight: 400, fontSize: 'clamp(16px, 3vw, 28px)' }}>
            The Science, the Denial, and the Race Against Time
          </span>
        </h1>
        <div
          style={{
            width: 60,
            height: 3,
            background: `linear-gradient(90deg, ${GREEN}, ${EMBER})`,
            borderRadius: 2,
            marginBottom: 16,
          }}
        />
        <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700 }}>
          From Fourier&apos;s greenhouse effect (1824) to the Paris Agreement — 200 years
          of discovery, denial, and the largest collective action problem in human history.
        </p>
      </header>

      {/* ── tab bar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 28,
          paddingBottom: 16,
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        {SECTION_TABS.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>

      {/* ── tab content ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {/* ═══ OVERVIEW ═══ */}
          {activeTab === 'overview' && (
            <div>
              <SectionHeader icon="🌍" title="The Biggest Story of Our Time" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: 0 }}>{OVERVIEW_TEXT}</p>
              </NarrativeCard>

              <NarrativeCard title="A 200-Year Timeline of Knowing" colour={TEAL}>
                <p style={{ margin: '0 0 12px' }}>
                  1824: Fourier identifies the greenhouse effect. 1856: Eunice Newton Foote
                  proves CO₂ traps heat. 1896: Arrhenius calculates the warming from doubled
                  CO₂. 1938: Callendar shows it&apos;s already happening. 1958: Keeling begins
                  measuring. 1977: Exxon&apos;s own scientists confirm it. 1988: Hansen tells
                  Congress. 2015: Paris Agreement. 2023: hottest year in 125,000 years.
                </p>
                <p style={{ margin: 0 }}>
                  We have known for two centuries. We have had proof for decades. The question
                  was never &ldquo;do we know?&rdquo; — it was &ldquo;will we act?&rdquo;
                </p>
              </NarrativeCard>

              <NarrativeCard title="Why This Story Matters" colour={EMBER}>
                <p style={{ margin: '0 0 12px' }}>
                  Climate change is not an environmental issue. It is an everything issue.
                  It intersects with economics, politics, justice, health, migration, food
                  security, biodiversity, and the fundamental question of what kind of world
                  we leave to the next generation.
                </p>
                <p style={{ margin: 0 }}>
                  The story of climate change is also a story about power: who has it, who
                  profits from inaction, and who pays the price. The countries least
                  responsible for emissions — small island nations, sub-Saharan Africa,
                  South Asia — face the most devastating consequences.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We are the first generation to feel the impact of climate change and the last generation that can do something about it."
                attribution="Barack Obama, 2014"
                colour={GREEN}
              />
              <QuoteBlock
                quote="The science is clear. The threat is real. The time to act is now."
                attribution="James Hansen"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ EARLY SCIENCE ═══ */}
          {activeTab === 'early-science' && (
            <div>
              <SectionHeader icon="🔬" title="Early Science — Discovering the Greenhouse Effect" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  The science of climate change didn&apos;t begin in the 1980s. It began in the
                  1820s. For nearly 200 years, scientists have been piecing together how
                  Earth&apos;s atmosphere traps heat — and what happens when humans add more
                  heat-trapping gases. The early pioneers were ignored, dismissed, or
                  forgotten. One — Eunice Newton Foote — was erased from history entirely
                  because she was a woman.
                </p>
              </NarrativeCard>

              {EARLY_SCIENCE_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="The influence of human activity on the climate system is clear, and recent anthropogenic emissions of greenhouse gases are the highest in history."
                attribution="IPCC Fifth Assessment Report, 2014"
                colour={TEAL}
              />
            </div>
          )}

          {/* ═══ ENVIRONMENTAL MOVEMENT ═══ */}
          {activeTab === 'environment' && (
            <div>
              <SectionHeader icon="🌿" title="The Early Environmental Movement" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: 0 }}>
                  Before climate change dominated the conversation, the environmental movement
                  was born from a simpler observation: we were poisoning our own world. Rachel
                  Carson saw it in dying birds. Earth Day participants saw it in polluted rivers
                  that literally caught fire. The movement&apos;s early wins — the EPA, the Clean Air
                  Act, the ban on DDT — proved that collective action could force change. The
                  question was whether that same energy could be sustained against a far larger,
                  far more powerful adversary: the fossil fuel industry.
                </p>
              </NarrativeCard>

              {ENVIRONMENT_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="In every walk with nature, one receives far more than he seeks."
                attribution="John Muir"
                colour={GREEN}
              />
              <QuoteBlock
                quote="The question is whether any civilization can wage relentless war on life without destroying itself, and without losing the right to be called civilized."
                attribution="Rachel Carson, Silent Spring"
                colour={GREEN}
              />
            </div>
          )}

          {/* ═══ SCIENCE SOLIDIFIES ═══ */}
          {activeTab === 'solidifies' && (
            <div>
              <SectionHeader icon="📊" title="The Science Solidifies (1979–1998)" />

              <NarrativeCard colour={EMBER}>
                <p style={{ margin: 0 }}>
                  By the 1980s, the science was no longer theoretical. Temperature records
                  showed warming. CO₂ levels were rising measurably. The ozone hole proved
                  that human activity could alter the atmosphere on a global scale — and that
                  international agreements could fix it. James Hansen&apos;s 1988 testimony was a
                  watershed: a NASA scientist looking US senators in the eye and saying
                  &ldquo;global warming has begun.&rdquo; The world had the knowledge, the evidence,
                  and the opportunity. What happened next was a masterclass in political failure.
                </p>
              </NarrativeCard>

              {SOLIDIFIES_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="Global warming has reached a level such that we can ascribe with a high degree of confidence a cause and effect relationship between the greenhouse effect and observed warming."
                attribution="James Hansen, US Senate testimony, June 23, 1988"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ DENIAL MACHINE ═══ */}
          {activeTab === 'denial' && (
            <div>
              <SectionHeader icon="🛢️" title="The Denial Machine (1977–Present)" />

              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  The fossil fuel industry didn&apos;t just fail to act on climate change — it
                  actively worked to prevent action. Using tactics pioneered by the tobacco
                  industry, oil and coal companies spent billions manufacturing doubt about
                  settled science, funding think tanks to produce &ldquo;alternative&rdquo; research,
                  attacking individual scientists, and lobbying against every piece of climate
                  legislation.
                </p>
                <p style={{ margin: 0 }}>
                  The result: decades of delay that may prove to be the most consequential
                  corporate deception in human history. Every year of inaction made the
                  problem harder and more expensive to solve.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: SMOKE, margin: '24px 0 12px' }}>
                The Tobacco Playbook
              </h3>
              <NarrativeCard colour={SMOKE}>
                <p style={{ margin: '0 0 12px' }}>
                  In the 1950s, the tobacco industry faced an existential threat: the science
                  linking smoking to cancer was becoming undeniable. Their response was not
                  to accept the science — it was to manufacture doubt. They funded friendly
                  scientists, created industry front groups, and repeated a simple message:
                  &ldquo;the science isn&apos;t settled.&rdquo;
                </p>
                <p style={{ margin: 0 }}>
                  The fossil fuel industry hired the same PR firms, used the same strategies,
                  and in some cases employed the same individual operatives. The goal was
                  never to win the scientific argument — it was to create enough confusion
                  to delay regulation. It worked for decades.
                </p>
              </NarrativeCard>

              {DENIAL_EVENTS.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="Doubt is our product, since it is the best means of competing with the 'body of fact' that exists in the minds of the general public."
                attribution="Brown & Williamson (tobacco) memo, 1969 — later adopted by fossil fuel industry"
                colour={CRIMSON}
              />
              <QuoteBlock
                quote="Victory will be achieved when average citizens 'understand' (recognize) uncertainties in climate science."
                attribution="American Petroleum Institute internal memo, 1998"
                colour={SMOKE}
              />
            </div>
          )}

          {/* ═══ 2000s ACCELERATION ═══ */}
          {activeTab === 'acceleration' && (
            <div>
              <SectionHeader icon="🔥" title="2000s — Acceleration" />

              <NarrativeCard colour={EMBER}>
                <p style={{ margin: 0 }}>
                  The 2000s were a decade of contradictions. Awareness grew enormously — Al
                  Gore&apos;s documentary reached millions, the IPCC won the Nobel Prize, and
                  climate change became a mainstream political issue. But emissions kept rising.
                  Copenhagen collapsed. Extreme weather events multiplied. The gap between what
                  scientists were saying and what politicians were doing widened into a chasm.
                </p>
              </NarrativeCard>

              {ACCELERATION_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="Warming of the climate system is unequivocal."
                attribution="IPCC Fourth Assessment Report, 2007"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ PARIS & BEYOND ═══ */}
          {activeTab === 'paris' && (
            <div>
              <SectionHeader icon="🌐" title="Paris Agreement and Beyond" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: 0 }}>
                  After the wreckage of Copenhagen, climate diplomacy was rebuilt from the
                  ground up. The Paris Agreement (2015) represented a fundamentally different
                  approach: voluntary national commitments rather than top-down mandates.
                  Meanwhile, a new generation of activists — led by a Swedish teenager with
                  a hand-painted sign — demanded that politicians treat the crisis as a crisis.
                </p>
              </NarrativeCard>

              {PARIS_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="You are not mature enough to tell it like it is. Even that burden you leave to us children."
                attribution="Greta Thunberg, UN Climate Action Summit, 2019"
                colour={GOLD}
              />
              <QuoteBlock
                quote="We do not inherit the Earth from our ancestors — we borrow it from our children."
                attribution="Indigenous proverb, widely cited in climate advocacy"
                colour={GREEN}
              />
            </div>
          )}

          {/* ═══ THE NUMBERS ═══ */}
          {activeTab === 'numbers' && (
            <div>
              <SectionHeader icon="📈" title="The Numbers — Where We Stand" />

              <NarrativeCard colour={EMBER}>
                <p style={{ margin: 0 }}>
                  Climate change is measured in parts per million, degrees Celsius, metres of
                  sea level, and trillions of dollars. Every number tells the same story: we
                  are moving in the wrong direction, faster than predicted, and the window for
                  action is closing.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 16,
                  margin: '24px 0',
                }}
              >
                <StatCard
                  label="Atmospheric CO₂"
                  value="420+ ppm"
                  detail="Highest level in at least 3 million years. Pre-industrial: 280 ppm. Safe level: 350 ppm."
                  colour={EMBER}
                />
                <StatCard
                  label="Temperature Rise"
                  value="+1.2°C"
                  detail="Above pre-industrial levels. The Paris target is 1.5°C. We're on track for 2.5–3°C by 2100."
                  colour={CRIMSON}
                />
                <StatCard
                  label="Sea Level Rise"
                  value="~20 cm"
                  detail="Since 1900. Rate is accelerating. 1 metre by 2100 would displace 150+ million people."
                  colour={ICE_BLUE}
                />
                <StatCard
                  label="Arctic Sea Ice"
                  value="-13%"
                  detail="Per decade since satellite records began (1979). Summer Arctic could be ice-free by 2050."
                  colour={ICE_BLUE}
                />
                <StatCard
                  label="Extreme Weather Cost"
                  value="$313B"
                  detail="Global economic losses from weather disasters in 2022 alone. Trend is sharply upward."
                  colour={GOLD}
                />
                <StatCard
                  label="Species at Risk"
                  value="1 Million"
                  detail="Species threatened with extinction, many due to habitat loss accelerated by climate change."
                  colour={GREEN}
                />
              </div>

              <NarrativeCard title="What the Numbers Mean" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>1.5°C vs 2°C:</strong> The difference between 1.5°C and 2°C of warming
                  sounds small but is catastrophic. At 2°C, virtually all coral reefs die (vs. 70-90%
                  at 1.5°C). Sea level rise is 10 cm higher. 420 million more people are exposed to
                  extreme heat. The difference is hundreds of millions of lives.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Tipping points:</strong> Beyond certain thresholds, warming becomes
                  self-reinforcing. Permafrost melts, releasing methane. Ice sheets collapse,
                  reducing reflectivity. Amazon dieback turns a carbon sink into a carbon source.
                  We may be closer to these tipping points than previously thought.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We are in a race against time. But it is a race we can win — if we choose to run."
                attribution="UN Secretary-General António Guterres"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ SOLUTIONS ═══ */}
          {activeTab === 'solutions' && (
            <div>
              <SectionHeader icon="☀️" title="Solutions — What's Actually Working" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: 0 }}>
                  The story of climate change is not only doom. In the last decade, the economics
                  of clean energy have shifted dramatically. Solar and wind are now the cheapest
                  sources of new electricity in most of the world. Electric vehicle adoption is
                  accelerating exponentially. The technologies exist. The question is whether
                  we deploy them fast enough.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                The Solar Revolution
              </h3>
              <NarrativeCard colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  Solar energy costs have fallen by over 90% since 2010 — the fastest cost decline
                  of any energy technology in history. In 2023, the world installed more solar
                  capacity than the entire existing capacity of nuclear power. Solar is now the
                  cheapest source of new electricity in most countries.
                </p>
                <p style={{ margin: 0 }}>
                  The speed of this transition has repeatedly exceeded even optimistic projections.
                  The International Energy Agency has consistently underestimated solar growth —
                  every year for two decades. We are in the early stages of an energy revolution
                  comparable to the shift from coal to oil.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Wind Power
              </h3>
              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Wind energy costs have fallen by about 70% since 2010. Offshore wind is
                  unlocking enormous potential — a single modern offshore turbine can power
                  16,000 homes. Denmark already generates over 50% of its electricity from wind.
                  The UK, a windy island, has gone from near-zero wind power to making it its
                  dominant electricity source in just two decades.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: ICE_BLUE, margin: '24px 0 12px' }}>
                Electric Vehicles
              </h3>
              <NarrativeCard colour={ICE_BLUE}>
                <p style={{ margin: '0 0 12px' }}>
                  EV sales have grown from virtually nothing to over 10 million per year globally.
                  In Norway, EVs now account for over 80% of new car sales. Battery costs have
                  fallen by 90% since 2010. Most major automakers have announced plans to go
                  fully electric.
                </p>
                <p style={{ margin: 0 }}>
                  The transition is not just about cars. Electric buses, trucks, and two-wheelers
                  are transforming transport in China, India, and across the developing world.
                  Transport accounts for about 16% of global emissions — electrification is
                  the path to zeroing it out.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GREEN, margin: '24px 0 12px' }}>
                Reforestation and Nature-Based Solutions
              </h3>
              <NarrativeCard colour={GREEN}>
                <p style={{ margin: '0 0 12px' }}>
                  Forests absorb about 30% of human CO₂ emissions. Protecting existing forests
                  and restoring degraded land is one of the most cost-effective climate solutions.
                  The Bonn Challenge aims to restore 350 million hectares of degraded land by 2030.
                </p>
                <p style={{ margin: 0 }}>
                  Wangari Maathai&apos;s Green Belt Movement showed what was possible: community-led
                  reforestation that simultaneously addresses climate change, poverty, and women&apos;s
                  empowerment. Nature-based solutions won&apos;t solve the problem alone — but they
                  are an essential part of the answer.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: INDIGO, margin: '24px 0 12px' }}>
                Policy That Works
              </h3>
              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Carbon pricing:</strong> Over 70 carbon pricing initiatives are now in
                  effect worldwide, covering about 23% of global emissions. The EU Emissions
                  Trading System is the largest.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Clean energy mandates:</strong> Countries and states with binding renewable
                  energy targets consistently deploy clean energy faster than those without.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>The IRA model:</strong> The US Inflation Reduction Act showed that
                  subsidies and tax credits can drive massive private investment — $370 billion
                  in public money is projected to leverage over $1 trillion in private clean
                  energy investment.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The Stone Age did not end for lack of stone, and the Oil Age will end long before the world runs out of oil."
                attribution="Sheikh Ahmed Zaki Yamani, former Saudi Oil Minister"
                colour={GOLD}
              />
              <QuoteBlock
                quote="We already have all the tools we need to solve the climate crisis. What we lack is the political will. But political will is a renewable resource."
                attribution="Al Gore"
                colour={GREEN}
              />
            </div>
          )}

          {/* ═══ KEY FIGURES ═══ */}
          {activeTab === 'figures' && (
            <div>
              <SectionHeader icon="🌟" title="Key Figures — Scientists, Activists, Diplomats" />

              <NarrativeCard colour={GREEN}>
                <p style={{ margin: 0 }}>
                  The story of climate change has been shaped by scientists who discovered the
                  threat, activists who demanded action, politicians who enabled or obstructed
                  progress, and ordinary people who refused to look away. These individuals
                  span two centuries and every continent.
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
