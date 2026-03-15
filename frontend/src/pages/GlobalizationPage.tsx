/**
 * GlobalizationPage — comprehensive deep-dive on how the world became
 * one market: waves of integration, key institutions, China's rise,
 * winners and losers, COVID supply-chain shock, cultural homogenization,
 * and the backlash forces reshaping the 21st century.
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
const CARD_BG = 'rgba(42,138,138,0.06)';
const CARD_BORDER = 'rgba(42,138,138,0.22)';
const TEAL = '#2a8a8a';
const GOLD = '#c9a227';
const EMBER = '#c94a2e';
const INDIGO = '#5b5ea6';
const GREEN = '#2d8659';
const OCHRE = '#b87333';
const CRIMSON = '#b33a3a';
const STEEL = '#5a7d9a';
const VIOLET = '#8b5ea6';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'waves'
  | 'institutions'
  | 'china'
  | 'trade'
  | 'winners-losers'
  | 'supply-chains'
  | 'culture'
  | 'backlash'
  | 'migration'
  | 'finance'
  | 'future';

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
  era: string;
  years: string;
  role: string;
  colour: string;
}

/* ─── data ─────────────────────────────────────────────────────────── */
const SECTION_TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: '🌐' },
  { key: 'waves', label: 'Waves', icon: '🌊' },
  { key: 'institutions', label: 'Institutions', icon: '🏛️' },
  { key: 'china', label: 'China Story', icon: '🐉' },
  { key: 'trade', label: 'Trade Agreements', icon: '📜' },
  { key: 'winners-losers', label: 'Winners & Losers', icon: '⚖️' },
  { key: 'supply-chains', label: 'Supply Chains', icon: '🚢' },
  { key: 'culture', label: 'Culture', icon: '🎬' },
  { key: 'backlash', label: 'Backlash', icon: '🔥' },
  { key: 'migration', label: 'Migration', icon: '✈️' },
  { key: 'finance', label: 'Finance', icon: '💹' },
  { key: 'future', label: 'Future', icon: '🔮' },
];

const OVERVIEW_TEXT =
  'Globalization is the accelerating interconnection of economies, cultures, and peoples through trade, capital flows, migration, and the exchange of ideas. It has lifted hundreds of millions from poverty, made consumer goods cheaper worldwide, and woven nations into a web of mutual dependence. It has also hollowed out manufacturing towns, amplified financial contagion, homogenized cultures, and left billions wondering whether the system was built for them — or despite them.';

const WAVE1_TIMELINE: TimelineEvent[] = [
  {
    year: '1869',
    title: 'Suez Canal Opens',
    detail:
      'The Suez Canal cut the sea route from Europe to Asia by 7,000 km, slashing shipping times and costs. It was one of the great enablers of the first wave of globalization — making intercontinental trade practical at scale for the first time.',
    colour: TEAL,
  },
  {
    year: '1870s',
    title: 'Steamships & Telegraph Transform Trade',
    detail:
      'Steamships reduced Atlantic crossing from weeks to days. The telegraph enabled real-time price information across oceans. Together they created a genuinely global market for commodities — grain from Kansas competed with grain from Ukraine for the first time. Transport costs fell 70% between 1840 and 1910.',
    colour: TEAL,
  },
  {
    year: '1870–1914',
    title: 'The Gold Standard Era',
    detail:
      'Most major economies adopted the gold standard, effectively creating a single global monetary system. Fixed exchange rates reduced currency risk, making cross-border investment straightforward. British capital poured into railways in Argentina, mines in South Africa, and plantations in Malaya. By 1914, capital flows as a share of GDP rivalled modern levels.',
    colour: GOLD,
  },
  {
    year: '1880–1914',
    title: 'Mass Migration — 60 Million Europeans',
    detail:
      'An estimated 60 million Europeans emigrated — to the Americas, Australasia, and southern Africa. No passports required for most journeys. The percentage of people living outside their birth country was higher in 1914 than it is today. This era of open borders would never return.',
    colour: INDIGO,
  },
  {
    year: '1870–1914',
    title: 'Trade-to-GDP Ratios Rival Today',
    detail:
      'By 1914, trade as a percentage of GDP in many economies was comparable to the late 20th century. The world was deeply integrated — until it wasn\'t. The catastrophe of 1914–1945 would prove how quickly decades of economic integration can unravel.',
    colour: STEEL,
  },
];

const INTERWAR_TIMELINE: TimelineEvent[] = [
  {
    year: '1914',
    title: 'WWI — Globalization Shattered',
    detail:
      'World War I destroyed the first era of globalization virtually overnight. Trade routes severed, capital controls imposed, the gold standard suspended. Countries that had been each other\'s largest trading partners were now enemies. The lesson that economic interdependence does not prevent war would echo through the century.',
    colour: CRIMSON,
  },
  {
    year: '1930',
    title: 'Smoot-Hawley Tariff — Tariff War Spiral',
    detail:
      'The US imposed the highest tariffs in its history. Trading partners retaliated. Global trade collapsed by 65% between 1929 and 1934 — deepening the Great Depression into a global catastrophe. Smoot-Hawley became the textbook example of how protectionism can spiral out of control.',
    colour: EMBER,
  },
  {
    year: '1930s',
    title: 'Competitive Devaluations & Capital Controls',
    detail:
      'Nations abandoned the gold standard one by one, engaging in competitive currency devaluations — "beggar-thy-neighbour" policies designed to boost exports at everyone else\'s expense. The result was a collapse of international monetary cooperation and a race to the bottom.',
    colour: OCHRE,
  },
  {
    year: '1930s–1940s',
    title: 'Rise of Economic Nationalism',
    detail:
      'The Great Depression fuelled nationalist and autarkic ideologies across the world. Germany pursued economic self-sufficiency. Japan built a "Greater East Asia Co-Prosperity Sphere." The world fragmented into hostile economic blocs — a fragmentation that would culminate in the deadliest war in human history.',
    colour: CRIMSON,
  },
];

const WAVE2_TIMELINE: TimelineEvent[] = [
  {
    year: '1944',
    title: 'Bretton Woods — A New Financial Architecture',
    detail:
      'Forty-four nations met in Bretton Woods, New Hampshire, to design a new international monetary order. The US dollar became the global reserve currency, pegged to gold. The IMF and World Bank were created to manage currency stability and development lending. The architecture was designed to prevent the competitive devaluations and trade wars that had caused the Depression.',
    colour: GOLD,
  },
  {
    year: '1947',
    title: 'GATT — Rules-Based Trade Begins',
    detail:
      'The General Agreement on Tariffs and Trade established the first multilateral framework for reducing trade barriers. Over eight rounds of negotiation spanning 48 years, GATT cut average tariffs from 40% to under 5%. It was the scaffolding on which the modern trading system was built.',
    colour: TEAL,
  },
  {
    year: '1948',
    title: 'Marshall Plan — Rebuilding Europe as a Market',
    detail:
      'The US invested $13 billion ($170 billion in today\'s dollars) to rebuild Western Europe. It was simultaneously humanitarian, strategic (countering Soviet influence), and commercial — rebuilding Europe created consumers for American goods. It remains the most successful development programme in history and a template for using economic integration as a tool of geopolitics.',
    colour: STEEL,
  },
  {
    year: '1957',
    title: 'European Economic Community Founded',
    detail:
      'Six nations — France, Germany, Italy, Belgium, Netherlands, Luxembourg — formed the EEC, creating a common market. The reasoning was explicitly geopolitical: countries that trade together don\'t go to war. The EEC would evolve into the European Union, the world\'s deepest experiment in economic integration.',
    colour: INDIGO,
  },
  {
    year: '1960s–1980s',
    title: 'Multinational Corporations Emerge',
    detail:
      'Companies like IBM, Toyota, Shell, and Unilever became truly multinational — operating factories, research labs, and sales forces across dozens of countries. By the 1980s, intra-firm trade (goods moving between subsidiaries of the same company) accounted for a growing share of total global trade, blurring the line between "domestic" and "foreign" production.',
    colour: OCHRE,
  },
];

const WAVE3_TIMELINE: TimelineEvent[] = [
  {
    year: '1989',
    title: 'Fall of the Berlin Wall',
    detail:
      'The collapse of the Soviet bloc suddenly integrated 400 million people into the global market economy. Former communist countries rushed to privatize state industries, open to foreign investment, and join Western institutions. The global labour force effectively doubled in a single decade.',
    colour: INDIGO,
  },
  {
    year: '1993',
    title: 'NAFTA Signed — Continental Free Trade',
    detail:
      'The North American Free Trade Agreement linked the US, Canada, and Mexico into a free-trade zone. It was fiercely debated — Ross Perot warned of a "giant sucking sound" of jobs moving to Mexico. Trade tripled. Mexico\'s manufacturing sector boomed. But US manufacturing employment fell, and many Rust Belt communities never recovered.',
    colour: TEAL,
  },
  {
    year: '1995',
    title: 'WTO Replaces GATT — Enforceable Trade Rules',
    detail:
      'The World Trade Organization replaced GATT with a permanent institution that could settle trade disputes and enforce rulings. For the first time, international trade had a court. The WTO would oversee the most dramatic expansion of trade in human history — and become a lightning rod for anti-globalization protest.',
    colour: GOLD,
  },
  {
    year: '1990s–2000s',
    title: 'The Internet Goes Global',
    detail:
      'The internet made information flow borderless. Email replaced telex. Websites gave small businesses access to global customers. Services that previously required physical proximity — software development, call centres, accounting — could be performed anywhere with a connection. India\'s IT sector exploded from near-zero to $200 billion.',
    colour: VIOLET,
  },
  {
    year: '2001',
    title: 'China Joins the WTO — The Big Bang',
    detail:
      'China\'s accession to the WTO was the single most consequential event in modern globalization. It gave Chinese manufacturers access to world markets under rules that prevented tariff retaliation. Global supply chains reorganized around China\'s combination of low wages, massive scale, improving infrastructure, and state support. The "China shock" would reshape the global economy within a decade.',
    colour: EMBER,
  },
  {
    year: '2000s',
    title: '"The World Is Flat" — Peak Globalization Optimism',
    detail:
      'Thomas Friedman\'s bestseller captured the era\'s optimism: technology and trade were flattening the world, giving everyone access to opportunity. Companies built supply chains spanning a dozen countries. A smartphone might be designed in California, have chips from Taiwan, screens from Korea, assembled in China, and sold worldwide. This was the high-water mark of globalization enthusiasm.',
    colour: TEAL,
  },
];

const POST2008_TIMELINE: TimelineEvent[] = [
  {
    year: '2008',
    title: 'Global Financial Crisis — Interconnection as Vulnerability',
    detail:
      'The collapse of Lehman Brothers in New York froze credit markets worldwide within 48 hours. A housing crisis in the US became a global recession. The crisis revealed the dark side of financial globalization: risk, like trade, had gone global. Contagion spread through channels that regulators barely understood.',
    colour: CRIMSON,
  },
  {
    year: '2010s',
    title: '"Slowbalization" — Trade Growth Stalls',
    detail:
      'After decades of trade growing faster than GDP, the relationship flattened. Trade-to-GDP ratios plateaued. Foreign direct investment flows declined. The easy gains from globalization had been captured. What remained were the hard political choices about who gained and who lost.',
    colour: OCHRE,
  },
  {
    year: '2020',
    title: 'COVID-19 — Supply Chains Break',
    detail:
      'The pandemic exposed the fragility of global supply chains built for efficiency over resilience. Factories shut down in China; hospitals ran out of PPE in Europe and America. Semiconductor shortages shut car factories 18 months later. The just-in-time model that had driven globalization\'s efficiency became its greatest vulnerability.',
    colour: CRIMSON,
  },
  {
    year: '2022–',
    title: 'Geopolitical Fragmentation',
    detail:
      'Russia\'s invasion of Ukraine, US-China tech competition, and rising nationalism have accelerated the fracturing of the global economy into competing blocs. "Friend-shoring" and "reshoring" have entered the policy lexicon. The question is no longer whether globalization will continue to deepen, but how much it will retreat.',
    colour: EMBER,
  },
];

const INSTITUTIONS: { name: string; year: string; role: string; colour: string }[] = [
  {
    name: 'International Monetary Fund (IMF)',
    year: '1944',
    role: 'Created at Bretton Woods to maintain currency stability and provide emergency lending to countries in financial crisis. Has been both lifeline and scourge — its "structural adjustment" programmes in the 1980s-90s forced austerity on developing nations, often with devastating social consequences. Lender of last resort to 190 countries.',
    colour: GOLD,
  },
  {
    name: 'World Bank',
    year: '1944',
    role: 'Originally created to finance European reconstruction, pivoted to development lending in the developing world. Has financed infrastructure from dams to schools across 100+ countries. Criticized for funding environmentally destructive projects and imposing Western economic models. Annual lending exceeds $70 billion.',
    colour: GREEN,
  },
  {
    name: 'GATT → World Trade Organization',
    year: '1947 → 1995',
    role: 'GATT reduced tariffs through eight negotiating rounds over 48 years. The WTO replaced it with enforceable dispute resolution — a court for international trade. 164 member nations. Has overseen trade disputes worth trillions. The Doha Round (2001–) has been stalled for two decades, reflecting the difficulty of further liberalization.',
    colour: TEAL,
  },
  {
    name: 'United Nations',
    year: '1945',
    role: 'The broadest international institution — 193 member states. Provides the political coordination framework for global issues from climate change to pandemic response. Its specialized agencies (WHO, UNESCO, UNICEF) operate worldwide. Criticized for Security Council vetoes paralyzing action, but remains the only truly global political forum.',
    colour: INDIGO,
  },
  {
    name: 'G7 / G20',
    year: '1975 / 1999',
    role: 'The G7 (major advanced economies) became the informal steering committee for the global economy. After the 2008 crisis revealed the G7 was too narrow, the G20 (adding China, India, Brazil, etc.) became the premier forum for economic coordination. No formal authority, but enormous convening power. Where the deals get done.',
    colour: STEEL,
  },
];

const CHINA_TIMELINE: TimelineEvent[] = [
  {
    year: '1978',
    title: 'Deng Xiaoping: "Reform and Opening Up"',
    detail:
      'After Mao\'s death and the chaos of the Cultural Revolution, Deng Xiaoping launched market reforms that would transform China from an impoverished, isolated nation into the world\'s factory floor. "It doesn\'t matter whether a cat is black or white, as long as it catches mice." Special Economic Zones opened to foreign investment. The most consequential economic policy decision of the 20th century.',
    colour: EMBER,
  },
  {
    year: '1990',
    title: 'GDP Per Capita: ~$350',
    detail:
      'In 1990, China was one of the poorest countries on Earth. GDP per capita was roughly $350 — comparable to sub-Saharan Africa. Over 750 million people lived in extreme poverty. Most Chinese had never used a telephone. The transformation that followed has no precedent in economic history.',
    colour: OCHRE,
  },
  {
    year: '1990s',
    title: 'The Factory Floor of the World',
    detail:
      'Tens of millions of rural Chinese migrated to coastal cities to work in export factories. The sheer scale of China\'s labour force, combined with state investment in infrastructure and a deliberately undervalued currency, made Chinese manufacturing unbeatable on cost. Walmart alone imports $50 billion/year from China. Entire industries — toys, textiles, electronics assembly — relocated from across Asia to China.',
    colour: TEAL,
  },
  {
    year: '2001',
    title: 'WTO Accession — The World Changes',
    detail:
      'China\'s entry into the WTO gave it access to global markets under most-favoured-nation rules. Western economists expected China would liberalize politically as it grew richer. Instead, China proved that authoritarian capitalism could deliver growth without democracy. Between 2001 and 2010, Chinese exports quintupled. The "China shock" displaced an estimated 3.7 million US manufacturing jobs.',
    colour: GOLD,
  },
  {
    year: '2010',
    title: 'World\'s Second-Largest Economy',
    detail:
      'China overtook Japan as the world\'s second-largest economy — a position Japan had held for 42 years. China was now building the equivalent of a new Chicago every year. High-speed rail networks, gleaming airports, megacities of 20 million — all built in a single generation.',
    colour: INDIGO,
  },
  {
    year: '2013',
    title: 'Belt and Road Initiative — China Goes Global',
    detail:
      'Xi Jinping launched the Belt and Road Initiative — a trillion-dollar infrastructure programme spanning 140+ countries across Asia, Africa, Europe, and Latin America. Ports, railways, power plants, digital networks. It was simultaneously development aid, export market creation, and geopolitical influence-building. The largest infrastructure programme in history.',
    colour: EMBER,
  },
  {
    year: '2023',
    title: 'GDP Per Capita: ~$12,000 — 700 Million Lifted from Poverty',
    detail:
      'In 40 years, China lifted approximately 700 million people out of extreme poverty — the most dramatic poverty reduction in human history. GDP per capita rose from $350 to $12,000. Life expectancy increased from 66 to 78 years. A country of subsistence farmers became a technological superpower. Whatever one thinks of China\'s political system, the economic achievement is staggering.',
    colour: GOLD,
  },
];

const TRADE_AGREEMENTS: { name: string; years: string; detail: string; colour: string }[] = [
  {
    name: 'NAFTA / USMCA',
    years: '1994 → 2020',
    detail:
      'The North American Free Trade Agreement eliminated most tariffs between the US, Canada, and Mexico. Trade tripled to $1.3 trillion/year. Mexico\'s manufacturing sector boomed — it became a major auto producer. But US manufacturing employment fell sharply, and communities dependent on factories that moved south were devastated. Renegotiated as USMCA under Trump with modest changes.',
    colour: TEAL,
  },
  {
    name: 'EU Single Market',
    years: '1993',
    detail:
      'The European Single Market created the world\'s deepest economic integration: free movement of goods, services, capital, and people across 27 countries and 450 million people. A Polish plumber can work in Paris. A German company can sell in Rome without customs. It\'s the most ambitious experiment in economic union since the United States itself — and it has no military to hold it together.',
    colour: INDIGO,
  },
  {
    name: 'TPP / CPTPP',
    years: '2016 → 2018',
    detail:
      'The Trans-Pacific Partnership was designed as a US-led trade bloc to set rules for 40% of the global economy — and to counter China\'s influence. Trump withdrew the US on his first day in office. The remaining 11 nations (including Japan, Australia, Canada, Vietnam) formed the CPTPP without America. The US absence left a vacuum China has been eager to fill.',
    colour: STEEL,
  },
  {
    name: 'RCEP',
    years: '2020',
    detail:
      'The Regional Comprehensive Economic Partnership created the world\'s largest trade bloc by GDP — 15 Asia-Pacific nations including China, Japan, South Korea, and ASEAN. It covers 30% of global GDP and 30% of the world\'s population. Unlike TPP, it includes China and excludes the US. A sign of where economic gravity is shifting.',
    colour: EMBER,
  },
];

const KEY_FIGURES: Figure[] = [
  {
    name: 'Deng Xiaoping',
    era: 'China\'s Opening',
    years: '1904–1997',
    role: 'Architect of China\'s "reform and opening up." Pragmatist who chose economic growth over ideological purity. His decisions lifted 700 million from poverty and made China the world\'s factory. The most consequential economic reformer of the 20th century.',
    colour: EMBER,
  },
  {
    name: 'John Maynard Keynes',
    era: 'Bretton Woods',
    years: '1883–1946',
    role: 'British economist who shaped the Bretton Woods institutions. Argued for international economic cooperation and managed currencies. His ideas underpinned the post-war economic order that made Wave 2 globalization possible.',
    colour: GOLD,
  },
  {
    name: 'Margaret Thatcher & Ronald Reagan',
    era: 'Neoliberal Turn',
    years: '1980s',
    role: 'Champions of free markets, deregulation, and free trade. Their ideology — privatize, liberalize, globalize — became the Washington Consensus that shaped globalization from the 1980s onward. Created the conditions for Wave 3 but also the inequalities that fuelled the backlash.',
    colour: STEEL,
  },
  {
    name: 'Thomas Friedman',
    era: 'Peak Optimism',
    years: '1953–',
    role: 'New York Times columnist whose "The World Is Flat" (2005) became the bible of globalization optimism. Argued that technology and trade were levelling the playing field. Criticized for ignoring the losers of globalization.',
    colour: TEAL,
  },
  {
    name: 'Joseph Stiglitz',
    era: 'The Critique',
    years: '1943–',
    role: 'Nobel laureate and former World Bank chief economist who became globalization\'s most prominent critic from within. "Globalization and Its Discontents" (2002) argued the IMF and World Bank served rich-country interests at poor countries\' expense.',
    colour: VIOLET,
  },
  {
    name: 'Xi Jinping',
    era: 'China\'s Assertive Turn',
    years: '1953–',
    role: 'Under Xi, China shifted from "hide your strength, bide your time" to assertive global power. Belt and Road Initiative, "Made in China 2025," tech self-sufficiency. Proved that globalization does not require liberalization.',
    colour: EMBER,
  },
];

/* ─── helpers ──────────────────────────────────────────────────────── */

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
        border: active ? `1px solid ${TEAL}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(42,138,138,0.18)' : 'transparent',
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
  colour = TEAL,
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
  colour = TEAL,
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
        background: 'rgba(42,138,138,0.04)',
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

export default function GlobalizationPage() {
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
          Globalization{' '}
          <span style={{ color: TEAL }}>—</span>{' '}
          <span style={{ color: TEXT_DIM, fontWeight: 400, fontSize: 'clamp(16px, 3vw, 28px)' }}>
            How the World Became One Market (and What It Cost)
          </span>
        </h1>
        <div
          style={{
            width: 60,
            height: 3,
            background: `linear-gradient(90deg, ${TEAL}, ${GOLD})`,
            borderRadius: 2,
            marginBottom: 16,
          }}
        />
        <p style={{ fontSize: 14, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700 }}>
          From steamships and the gold standard to container ships and the WTO &mdash; five
          waves of integration, the institutions that governed them, the billions they
          lifted, the millions they left behind, and the backlash reshaping the 21st century.
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
              <SectionHeader icon="🌐" title="What Is Globalization?" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>{OVERVIEW_TEXT}</p>
              </NarrativeCard>

              <NarrativeCard title="The Core Dimensions" colour={GOLD}>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Trade:</strong> Goods crossing borders — from spices on the Silk Road to
                  semiconductors on container ships. Global merchandise trade reached $25 trillion
                  in 2022. A single iPhone contains components from 43 countries.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Capital:</strong> Money flowing across borders — foreign investment,
                  portfolio flows, bank lending. Global FDI stocks exceed $45 trillion. A pension
                  fund in Norway owns shares in companies in 70 countries.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Migration:</strong> People moving across borders — 280 million people
                  live outside their country of birth. Remittances ($800 billion/year) exceed
                  all foreign aid combined.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Ideas:</strong> Knowledge, culture, technology, and norms flowing
                  globally — from the scientific revolution to TikTok. English has become the
                  lingua franca of business, science, and the internet.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Globalization is not a monolithic force but an evolving set of consequences — some good, some bad, and some unintended. It is the close cousin of empire."
                attribution="Historian Nayan Chanda"
                colour={TEAL}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                <StatCard
                  label="Global Trade"
                  value="$25T"
                  detail="Annual merchandise trade in 2022. Up from $2 trillion in 1970."
                  colour={TEAL}
                />
                <StatCard
                  label="Forex Market"
                  value="$7.5T/day"
                  detail="Daily foreign exchange trading volume. The largest market in human history."
                  colour={GOLD}
                />
                <StatCard
                  label="People Abroad"
                  value="280M"
                  detail="International migrants worldwide — 3.6% of the global population."
                  colour={INDIGO}
                />
                <StatCard
                  label="Container Ships"
                  value="~900M TEU"
                  detail="Twenty-foot equivalent units shipped annually. The backbone of physical globalization."
                  colour={STEEL}
                />
              </div>
            </div>
          )}

          {/* ═══ WAVES ═══ */}
          {activeTab === 'waves' && (
            <div>
              <SectionHeader icon="🌊" title="Waves of Globalization" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Globalization has not been a smooth, inevitable process. It has come in waves —
                  each driven by new technologies and political choices, each followed by a
                  backlash or collapse. Understanding these waves reveals that globalization is
                  a choice, not a destiny, and that what has been built can be dismantled.
                </p>
              </NarrativeCard>

              <h3 style={{ fontSize: 16, fontWeight: 700, color: TEAL, margin: '24px 0 12px' }}>
                Wave 1: The First Global Economy (1870–1914)
              </h3>
              {WAVE1_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <h3 style={{ fontSize: 16, fontWeight: 700, color: CRIMSON, margin: '24px 0 12px' }}>
                Interwar Deglobalization (1914–1945)
              </h3>
              {INTERWAR_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <h3 style={{ fontSize: 16, fontWeight: 700, color: GOLD, margin: '24px 0 12px' }}>
                Wave 2: Bretton Woods Order (1945–1990)
              </h3>
              {WAVE2_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <h3 style={{ fontSize: 16, fontWeight: 700, color: INDIGO, margin: '24px 0 12px' }}>
                Wave 3: Hyper-Globalization (1990–2008)
              </h3>
              {WAVE3_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <h3 style={{ fontSize: 16, fontWeight: 700, color: EMBER, margin: '24px 0 12px' }}>
                Post-2008: Slowbalization and Fragmentation
              </h3>
              {POST2008_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="The first era of globalization ended not with a whimper but with a bang — the guns of August 1914. The question is whether our era will end the same way."
                attribution="Economic historian Kevin O'Rourke"
                colour={CRIMSON}
              />
            </div>
          )}

          {/* ═══ INSTITUTIONS ═══ */}
          {activeTab === 'institutions' && (
            <div>
              <SectionHeader icon="🏛️" title="Institutions Built to Govern Globalization" />

              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  The post-1945 order was built on a radical idea: that international institutions
                  could prevent the economic nationalism that had caused two world wars. These
                  institutions — imperfect, often criticized — created the rules-based framework
                  that made modern globalization possible. Whether they can survive the current
                  geopolitical fragmentation is an open question.
                </p>
              </NarrativeCard>

              {INSTITUTIONS.map((inst, i) => (
                <NarrativeCard key={i} title={`${inst.name} (${inst.year})`} colour={inst.colour}>
                  <p style={{ margin: 0 }}>{inst.role}</p>
                </NarrativeCard>
              ))}

              <QuoteBlock
                quote="The genius of the Bretton Woods system was not that it was perfect — it was that it existed. For the first time, nations agreed that economic chaos was everyone's problem."
                attribution="Barry Eichengreen, economist"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ CHINA ═══ */}
          {activeTab === 'china' && (
            <div>
              <SectionHeader icon="🐉" title="The China Story — The Most Dramatic Economic Rise in History" />

              <NarrativeCard colour={EMBER}>
                <p style={{ margin: 0 }}>
                  No country has transformed as rapidly or as dramatically as China. In the span
                  of a single lifetime, it went from famine and isolation to the world&apos;s
                  second-largest economy and largest trading nation. China&apos;s rise reshaped
                  globalization itself — and is now reshaping the backlash against it.
                </p>
              </NarrativeCard>

              {CHINA_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                <StatCard
                  label="GDP Per Capita Rise"
                  value="$350 → $12K"
                  detail="In 40 years. A 34x increase. No economy in history has grown this fast at this scale."
                  colour={GOLD}
                />
                <StatCard
                  label="Lifted from Poverty"
                  value="700M"
                  detail="Approximately 700 million people moved out of extreme poverty — the greatest poverty reduction ever recorded."
                  colour={GREEN}
                />
                <StatCard
                  label="Share of World Manufacturing"
                  value="~30%"
                  detail="China produces roughly 30% of global manufacturing output — more than the US, Germany, and Japan combined."
                  colour={EMBER}
                />
                <StatCard
                  label="Belt & Road"
                  value="140+"
                  detail="Countries participating in China's Belt and Road Initiative — spanning every continent."
                  colour={TEAL}
                />
              </div>

              <QuoteBlock
                quote="It doesn't matter whether a cat is black or white, as long as it catches mice."
                attribution="Deng Xiaoping"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ TRADE AGREEMENTS ═══ */}
          {activeTab === 'trade' && (
            <div>
              <SectionHeader icon="📜" title="Trade Agreements — Who Won, Who Lost" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Trade agreements are where the abstract forces of globalization become concrete
                  policy — tariff schedules, rules of origin, labour standards, dispute resolution
                  mechanisms. Each agreement creates winners and losers, and the political question
                  is always whether the gains are shared broadly enough to sustain democratic support.
                </p>
              </NarrativeCard>

              {TRADE_AGREEMENTS.map((ta, i) => (
                <NarrativeCard key={i} title={`${ta.name} (${ta.years})`} colour={ta.colour}>
                  <p style={{ margin: 0 }}>{ta.detail}</p>
                </NarrativeCard>
              ))}

              <QuoteBlock
                quote="Free trade is the diplomacy of the grocery store — it puts a price on peace."
                attribution="Frédéric Bastiat"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ WINNERS & LOSERS ═══ */}
          {activeTab === 'winners-losers' && (
            <div>
              <SectionHeader icon="⚖️" title="Winners and Losers" />

              <NarrativeCard colour={GREEN} title="The Winners">
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Consumers everywhere:</strong> Globalization made goods cheaper. A TV that
                  cost $3,000 in 1990 costs $300 today. Clothing, electronics, food — prices fell
                  as production moved to lower-cost countries. The average consumer gained
                  substantially from globalization, but rarely noticed because lower prices are invisible.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Emerging market middle class:</strong> 1.2 billion people joined the
                  global middle class between 1990 and 2020, primarily in China, India, and
                  Southeast Asia. Globalization created the largest middle class in human history.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Multinational corporations:</strong> Companies that could optimize global
                  supply chains saw profits soar. Apple earns $100+ billion/year selling phones
                  designed in California, manufactured in China, with components from 43 countries.
                  Corporate profit margins reached historic highs.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>The financial sector:</strong> Global capital flows created enormous
                  opportunities for banks, hedge funds, and financial intermediaries. The financial
                  sector&apos;s share of GDP doubled in most advanced economies between 1980 and 2008.
                </p>
              </NarrativeCard>

              <NarrativeCard colour={CRIMSON} title="The Losers">
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Manufacturing workers in developed countries:</strong> The &ldquo;China
                  shock&rdquo; — the sudden exposure of US manufacturing to Chinese competition
                  after 2001 — eliminated an estimated 3.7 million American jobs. Entire communities
                  built around factories were devastated. Similar patterns played out in the UK,
                  France, and across the developed world. Many of these workers never recovered.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Local cultures:</strong> Global brands and global media created pressure
                  toward cultural homogenization. Languages are dying at a rate of one every two
                  weeks. Local cuisines, crafts, and traditions face intense competition from global
                  alternatives.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>The environment:</strong> Global supply chains mean goods travel thousands
                  of miles. Shipping alone accounts for 2.5% of global emissions. The drive to
                  produce goods at the lowest cost often means weak environmental regulation.
                  Deforestation, pollution, and carbon emissions have all been amplified by
                  globalization.
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Labour rights:</strong> The ability to move production to countries with
                  weak labour protections created a &ldquo;race to the bottom.&rdquo; Garment
                  workers in Bangladesh, miners in Congo, electronics assemblers in China —
                  the people making globalization&apos;s products often work in conditions their
                  consumers would find unacceptable.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The problem is not that trade is inherently bad. The problem is that we let the winners write the rules and told the losers they were imagining things."
                attribution="Dani Rodrik, economist"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ SUPPLY CHAINS ═══ */}
          {activeTab === 'supply-chains' && (
            <div>
              <SectionHeader icon="🚢" title="Supply Chain Vulnerabilities Exposed by COVID" />

              <NarrativeCard colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  For decades, companies optimized supply chains for efficiency and cost — not
                  resilience. &ldquo;Just-in-time&rdquo; manufacturing meant minimal inventory,
                  maximum vulnerability. When COVID shut factories and ports worldwide, the
                  fragility of the system became impossible to ignore.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Just-in-Time → Just-in-Case" colour={OCHRE}>
                <p style={{ margin: 0 }}>
                  Toyota&apos;s just-in-time system — producing exactly what&apos;s needed, when
                  it&apos;s needed — became the gold standard of manufacturing efficiency. It worked
                  brilliantly in normal times. But COVID proved there was no &ldquo;normal&rdquo;
                  anymore. Companies are now shifting toward &ldquo;just-in-case&rdquo; — holding
                  more inventory, diversifying suppliers, and accepting higher costs for greater
                  resilience.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Semiconductor Crisis" colour={VIOLET}>
                <p style={{ margin: 0 }}>
                  The global semiconductor shortage of 2021-2023 shut down car factories,
                  delayed consumer electronics, and exposed a critical vulnerability: over 90%
                  of the world&apos;s advanced chips are made in Taiwan (TSMC) and South Korea
                  (Samsung). A single earthquake, a single geopolitical crisis involving Taiwan,
                  could paralyze the global economy. The US CHIPS Act ($52B) and European Chips
                  Act are direct responses — attempts to reshore semiconductor production.
                </p>
              </NarrativeCard>

              <NarrativeCard title="PPE and Single-Source Dependence" colour={EMBER}>
                <p style={{ margin: 0 }}>
                  When COVID hit, hospitals discovered that 70%+ of global PPE production was
                  concentrated in China — a country that was itself in lockdown. Nations scrambled
                  to source masks, gowns, and ventilators. The lesson was stark: concentrating
                  production of critical goods in a single country — even for cost efficiency —
                  is a national security risk.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                <StatCard
                  label="Advanced Chips from Taiwan"
                  value=">90%"
                  detail="TSMC alone produces 90%+ of the world's most advanced semiconductors."
                  colour={VIOLET}
                />
                <StatCard
                  label="Global PPE from China"
                  value="~70%"
                  detail="Pre-COVID, China produced the majority of the world's personal protective equipment."
                  colour={EMBER}
                />
                <StatCard
                  label="US CHIPS Act"
                  value="$52B"
                  detail="Federal investment to reshore semiconductor manufacturing. The largest industrial policy since the space race."
                  colour={STEEL}
                />
              </div>

              <QuoteBlock
                quote="We spent thirty years optimizing supply chains for cost. We forgot to optimize for not collapsing."
                attribution="Supply chain analyst (2021)"
                colour={OCHRE}
              />
            </div>
          )}

          {/* ═══ CULTURE ═══ */}
          {activeTab === 'culture' && (
            <div>
              <SectionHeader icon="🎬" title="Cultural Globalization — Homogenization vs. Exchange" />

              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Globalization is not just about goods and money — it&apos;s about ideas,
                  aesthetics, food, music, and language. Cultural globalization has made the world
                  more connected and more homogeneous simultaneously. The debate over whether this
                  is liberation or cultural imperialism is one of the most contentious in the
                  globalization story.
                </p>
              </NarrativeCard>

              <NarrativeCard title="McDonald's in 100 Countries" colour={EMBER}>
                <p style={{ margin: 0 }}>
                  McDonald&apos;s operates in 100+ countries with 40,000+ restaurants. It is the
                  most visible symbol of American cultural export. But the story is more complex
                  than &ldquo;Americanization.&rdquo; McDonald&apos;s adapts — McSpicy Paneer in
                  India, Teriyaki McBurger in Japan, McArabia in the Middle East. Sociologist George
                  Ritzer coined &ldquo;McDonaldization&rdquo; — the spread of efficiency,
                  calculability, predictability, and control to every sector of society.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Hollywood Dominance — And Its Challengers" colour={INDIGO}>
                <p style={{ margin: '0 0 12px' }}>
                  Hollywood films account for 60-70% of global box office revenue. American TV
                  shows, streaming platforms (Netflix, Disney+), and social media platforms
                  (Instagram, TikTok&apos;s US version) project American culture worldwide. English
                  has become the global lingua franca of business, science, aviation, and the internet.
                </p>
                <p style={{ margin: 0 }}>
                  But the flow is no longer one-way. Bollywood produces more films than Hollywood.
                  Nigerian Nollywood is the world&apos;s second-largest film industry by volume.
                  Korean, Turkish, and Spanish-language content has found global audiences on
                  streaming platforms. Cultural globalization is becoming genuinely multi-directional.
                </p>
              </NarrativeCard>

              <NarrativeCard title="K-Pop — Globalization's Poster Child" colour={VIOLET}>
                <p style={{ margin: 0 }}>
                  K-pop&apos;s global explosion — BTS, BLACKPINK, Stray Kids — is perhaps the
                  purest example of cultural globalization from outside the Anglophone world.
                  South Korean entertainment companies built a global industry from scratch:
                  training systems, global social media strategies, multilingual content. BTS
                  addressed the UN General Assembly. &ldquo;Parasite&rdquo; won the Best Picture
                  Oscar. The Korean Wave (Hallyu) proves that globalization can be a platform for
                  cultural diversity — not just homogenization.
                </p>
              </NarrativeCard>

              <NarrativeCard title="English as Lingua Franca" colour={STEEL}>
                <p style={{ margin: 0 }}>
                  1.5 billion people speak English — but only 400 million as a first language.
                  English is the default language of international business, science, aviation,
                  and the internet. This gives native English speakers enormous advantages and
                  raises questions about linguistic imperialism. Meanwhile, half of the world&apos;s
                  7,000 languages are expected to die by the end of this century — a loss of
                  human heritage that is inseparable from globalization.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Everyone can have a McDonald's, but not everyone can have a Michelin star. Globalization makes the ordinary universal and the extraordinary irrelevant."
                attribution="Cultural critic"
                colour={GOLD}
              />
            </div>
          )}

          {/* ═══ BACKLASH ═══ */}
          {activeTab === 'backlash' && (
            <div>
              <SectionHeader icon="🔥" title="The Backlash — Deglobalization Forces" />

              <NarrativeCard colour={EMBER}>
                <p style={{ margin: 0 }}>
                  For three decades, globalization seemed inevitable — a one-way ratchet toward
                  deeper integration. Then came the backlash. Brexit, Trump, Xi&apos;s
                  nationalism, Modi&apos;s &ldquo;Make in India&rdquo; — across the political
                  spectrum and around the world, leaders are pulling back from the consensus that
                  freer trade and more open borders are always better.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Brexit (2016) — Britain Leaves the EU" colour={INDIGO}>
                <p style={{ margin: 0 }}>
                  52% of British voters chose to leave the European Union — the most significant
                  reversal of economic integration in modern history. The vote was driven by
                  concerns about immigration, sovereignty, and a sense that globalization&apos;s
                  benefits had flowed to London while leaving post-industrial towns behind. The
                  economic costs have been substantial: UK trade with the EU has fallen, investment
                  has stalled, and the financial services sector has lost thousands of jobs to
                  European cities.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Trump Tariffs (2018–) — America First" colour={EMBER}>
                <p style={{ margin: 0 }}>
                  President Trump imposed tariffs on $360 billion of Chinese goods and withdrew
                  from the TPP, signalling a dramatic shift in US trade policy. The tariffs were
                  not reversed under Biden — instead, they were supplemented with technology
                  export controls aimed at containing China&apos;s semiconductor industry. The
                  bipartisan consensus in Washington has shifted from &ldquo;free trade good&rdquo;
                  to &ldquo;strategic competition.&rdquo; The era of US-led trade liberalization
                  appears to be over.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Xi's Nationalism — Self-Sufficiency" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  Under Xi Jinping, China has pivoted from integration to self-sufficiency.
                  &ldquo;Made in China 2025&rdquo; aims to dominate high-tech manufacturing.
                  &ldquo;Dual circulation&rdquo; prioritizes the domestic market. Technology
                  decoupling is accelerating: China is building parallel systems in semiconductors,
                  operating systems, payment networks, and social media. The world&apos;s
                  second-largest economy is deliberately reducing its dependence on the global
                  system it helped build.
                </p>
              </NarrativeCard>

              <NarrativeCard title='Modi&apos;s "Make in India"' colour={OCHRE}>
                <p style={{ margin: 0 }}>
                  India under Modi has pursued an industrial policy designed to make India a
                  manufacturing alternative to China. Tariffs have increased, local content
                  requirements have tightened, and the government has courted companies looking
                  to diversify away from Chinese supply chains. India is positioning itself as
                  a beneficiary of deglobalization — or at least of de-China-ization.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="If you're losing your job to a factory in Shenzhen, someone explaining comparative advantage to you is not helpful."
                attribution="Political observation on globalization's political economy"
                colour={EMBER}
              />
            </div>
          )}

          {/* ═══ MIGRATION ═══ */}
          {activeTab === 'migration' && (
            <div>
              <SectionHeader icon="✈️" title="Migration and Globalization" />

              <NarrativeCard colour={INDIGO}>
                <p style={{ margin: 0 }}>
                  Globalization has been far more successful at moving goods, money, and
                  information across borders than people. While capital flows freely, humans face
                  walls, visas, and detention centres. Yet 280 million people live outside their
                  country of birth — and their remittances power economies worldwide.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <StatCard
                  label="International Migrants"
                  value="280M"
                  detail="People living outside their country of birth — 3.6% of the world's population."
                  colour={INDIGO}
                />
                <StatCard
                  label="Remittances"
                  value="$800B/yr"
                  detail="Money sent home by migrants. Exceeds all foreign aid combined. Lifeline for dozens of economies."
                  colour={GOLD}
                />
                <StatCard
                  label="Refugees"
                  value="~110M"
                  detail="Forcibly displaced people worldwide. The highest number ever recorded."
                  colour={CRIMSON}
                />
              </div>

              <NarrativeCard title="Remittances: The Invisible Engine" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Remittances — money sent home by workers abroad — total $800 billion per year,
                  dwarfing the $200 billion in official development aid. For countries like the
                  Philippines, El Salvador, Nepal, and Tajikistan, remittances are a larger share
                  of GDP than any export. A Filipino nurse in London, a Mexican construction
                  worker in Texas, an Indian software engineer in Dubai — individually small
                  transfers aggregate into one of the largest financial flows on Earth.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Brain Drain vs. Brain Gain" colour={TEAL}>
                <p style={{ margin: 0 }}>
                  The migration of skilled workers from developing to developed countries — doctors,
                  engineers, scientists — is both an individual freedom and a collective loss. Sub-
                  Saharan Africa loses $2 billion annually to brain drain in healthcare alone.
                  But diaspora networks also transfer knowledge, investment, and connections back
                  home. India&apos;s tech sector was built substantially by returnees from Silicon
                  Valley. The line between brain drain and brain circulation is blurrier than
                  critics suggest.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Capital is global; labour is local. This is the fundamental asymmetry of globalization — and the source of most of its political problems."
                attribution="Branko Milanovic, economist"
                colour={INDIGO}
              />
            </div>
          )}

          {/* ═══ FINANCE ═══ */}
          {activeTab === 'finance' && (
            <div>
              <SectionHeader icon="💹" title="Financial Globalization — Interconnection as Vulnerability" />

              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Financial globalization has outpaced trade globalization by orders of magnitude.
                  The global forex market trades $7.5 trillion per day — more than the entire
                  annual GDP of every country except the US and China. This interconnection
                  enables efficient capital allocation but also creates channels for catastrophic
                  contagion.
                </p>
              </NarrativeCard>

              <NarrativeCard title="$7.5 Trillion Per Day — The Forex Market" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  The foreign exchange market is the largest financial market in human history.
                  $7.5 trillion changes hands every single day — 30x the daily volume of all
                  global stock exchanges combined. The market operates 24 hours, across all time
                  zones. It is the circulatory system of global trade, and it is almost entirely
                  unregulated.
                </p>
              </NarrativeCard>

              <NarrativeCard title="2008: Crisis Spreads Globally in 48 Hours" colour={CRIMSON}>
                <p style={{ margin: '0 0 12px' }}>
                  When Lehman Brothers collapsed on September 15, 2008, the crisis spread globally
                  in less than 48 hours. European banks holding US mortgage-backed securities
                  froze. Interbank lending markets seized worldwide. Stock markets crashed from
                  New York to Tokyo to São Paulo. Iceland&apos;s entire banking system collapsed.
                  Ireland, Greece, and Spain faced sovereign debt crises.
                </p>
                <p style={{ margin: 0 }}>
                  The 2008 crisis was the definitive demonstration that financial globalization
                  creates systemic risk. A housing bubble in Nevada could bankrupt a bank in
                  Reykjavik. The system was more interconnected than anyone had understood —
                  including the regulators supposed to oversee it.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Dollar System" colour={STEEL}>
                <p style={{ margin: 0 }}>
                  The US dollar underpins global finance. It accounts for 60% of global reserves,
                  88% of forex trades, and is the invoicing currency for most international trade.
                  This gives the US enormous power — including the ability to impose devastating
                  financial sanctions by cutting countries off from the dollar system. Russia
                  discovered this in 2022. China and others are actively trying to build
                  alternatives, but the dollar&apos;s dominance has proved remarkably durable.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="When the US sneezes, the world catches a cold. When the US has a heart attack, the world goes into cardiac arrest."
                attribution="Financial market observation"
                colour={CRIMSON}
              />
            </div>
          )}

          {/* ═══ FUTURE ═══ */}
          {activeTab === 'future' && (
            <div>
              <SectionHeader icon="🔮" title="The Future of Globalization" />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  Globalization is not ending — it is transforming. Physical trade may plateau or
                  retreat, but digital globalization is accelerating. The question is not whether
                  the world will be connected, but how, by whom, and under whose rules.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Reshoring and Friend-Shoring" colour={STEEL}>
                <p style={{ margin: 0 }}>
                  Companies and governments are rethinking where to make things. &ldquo;Reshoring&rdquo;
                  brings production home. &ldquo;Friend-shoring&rdquo; moves it to geopolitically
                  allied countries. &ldquo;Near-shoring&rdquo; moves it closer to end markets.
                  Mexico is booming as companies seek alternatives to China that are close to
                  the US market. Vietnam, India, and Indonesia are competing for relocated
                  supply chains. The era of concentrating production in a single country for
                  cost alone is ending.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Digital Globalization — Services Without Borders" colour={VIOLET}>
                <p style={{ margin: '0 0 12px' }}>
                  Even as goods trade plateaus, digital trade is exploding. Cross-border data
                  flows have grown 148x since 2005. A software developer in Lagos can work for
                  a company in San Francisco. A designer in Buenos Aires can serve clients in
                  Berlin. Remote work, enabled by COVID, has accelerated this trend.
                </p>
                <p style={{ margin: 0 }}>
                  Digital globalization is harder to tax, harder to regulate, and harder to block
                  than physical trade. It favours skilled workers with internet access and
                  English fluency — potentially widening the digital divide even as it creates
                  new opportunities.
                </p>
              </NarrativeCard>

              <NarrativeCard title="AI and the Next Wave" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Artificial intelligence could reshape globalization as profoundly as the
                  steamship or the internet. AI-powered translation could eliminate language
                  barriers. AI-driven automation could reduce the labour cost advantages that
                  drove offshoring. AI could enable new forms of global collaboration — or new
                  forms of surveillance and control. The countries and companies that lead in
                  AI will shape the next era of globalization. Currently, that race is between
                  the US and China — with Europe, India, and everyone else trying not to be left behind.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Fragmentation Risk" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  The greatest risk is not deglobalization but fragmentation — the splitting of
                  the global economy into competing blocs with separate standards, supply chains,
                  payment systems, and internet ecosystems. A US-led bloc and a China-led bloc,
                  with everyone else forced to choose sides. This would be costly for everyone —
                  the IMF estimates that severe fragmentation could reduce global GDP by up to 7%.
                  The history of the 1930s shows where economic fragmentation can lead.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The question is not whether globalization will survive. The question is whether it will be shaped by cooperation or by conflict — whether we write the rules together or fight over them."
                attribution="Christine Lagarde, ECB President"
                colour={TEAL}
              />

              <NarrativeCard colour={GOLD}>
                <p style={{ margin: 0 }}>
                  Globalization has been the defining economic force of the modern era. It has
                  lifted billions, connected cultures, and woven the world into a web of mutual
                  dependence that makes large-scale war between major economies almost unthinkable.
                  It has also hollowed out communities, amplified inequality, and created
                  vulnerabilities that a pandemic, a war, or a financial crisis can exploit in
                  hours. The next chapter is being written now — in trade negotiations, semiconductor
                  fabs, data centres, and voting booths. The outcome is not predetermined.
                </p>
              </NarrativeCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
