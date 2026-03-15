/**
 * EconomicsPage — historical economics explorer.
 *
 * Route: /economics
 *
 * Sections:
 *  1. Great Market Crashes & Crises (timeline)
 *  2. History's Great Trade Routes
 *  3. Economic Theories Timeline
 *  4. Richest People in History (inflation-adjusted)
 *  5. Economic "Firsts"
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#10b981'; // emerald — economics theme
const ACCENT_DIM = '#10b98122';
const ACCENT_BORDER = '#10b98166';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface Crisis {
  name: string;
  dates: string;
  trigger: string;
  peakImpact: string;
  recoveryTime: string;
  keyLesson: string;
}

const CRISES: Crisis[] = [
  {
    name: 'Tulip Mania',
    dates: '1637',
    trigger: 'Speculative frenzy drove tulip bulb prices to extraordinary levels in the Dutch Republic.',
    peakImpact: 'Bulb prices crashed ~99%; many speculators bankrupted.',
    recoveryTime: 'Dutch economy recovered within a few years; limited broader impact.',
    keyLesson: 'First recorded speculative bubble — asset prices can detach entirely from intrinsic value.',
  },
  {
    name: 'South Sea Bubble',
    dates: '1720',
    trigger: 'South Sea Company stock inflated by government debt conversion scheme and rampant speculation.',
    peakImpact: 'Share price collapsed ~80%; Parliament investigated; directors\' estates confiscated.',
    recoveryTime: '~5 years for British financial markets to stabilize.',
    keyLesson: 'Insider manipulation and government complicity can fuel bubbles; led to the Bubble Act.',
  },
  {
    name: 'Panic of 1837',
    dates: '1837–1843',
    trigger: 'President Jackson\'s Specie Circular required gold/silver for land purchases, tightening credit.',
    peakImpact: 'Unemployment ~25% in some areas; ~40% of banks failed; 6-year depression.',
    recoveryTime: '~6 years.',
    keyLesson: 'Abrupt monetary policy shifts can trigger cascading bank failures.',
  },
  {
    name: 'Long Depression',
    dates: '1873–1896',
    trigger: 'Coinage Act of 1873 demonetized silver; Vienna Stock Exchange crash; railroad overbuilding.',
    peakImpact: 'Over 20 years of deflation; railroad bankruptcies; severe wage cuts.',
    recoveryTime: '~23 years of intermittent recession.',
    keyLesson: 'Deflation can be as destructive as inflation; structural overcapacity prolongs downturns.',
  },
  {
    name: 'Panic of 1907',
    dates: '1907',
    trigger: 'Failed attempt to corner United Copper Company stock triggered bank runs.',
    peakImpact: 'NYSE fell ~50% from peak; trust companies collapsed.',
    recoveryTime: '~1 year; J.P. Morgan organized private bailout.',
    keyLesson: 'Need for a lender of last resort — directly led to the creation of the Federal Reserve (1913).',
  },
  {
    name: 'Wall Street Crash / Great Depression',
    dates: '1929–1939',
    trigger: 'Speculative excess, margin buying, and overproduction preceded Black Tuesday (Oct 29, 1929).',
    peakImpact: 'US unemployment peaked ~25%; GDP fell ~30%; global trade collapsed ~65%.',
    recoveryTime: '~10 years; full recovery only with WWII mobilization.',
    keyLesson: 'Unregulated speculation + contractionary policy turns crashes into depressions. Led to SEC, FDIC, Glass-Steagall.',
  },
  {
    name: 'Oil Crisis',
    dates: '1973',
    trigger: 'OPEC oil embargo against nations supporting Israel in the Yom Kippur War.',
    peakImpact: 'Oil prices quadrupled; stagflation hit Western economies; gas rationing.',
    recoveryTime: '~3 years for immediate shock; stagflation persisted into early 1980s.',
    keyLesson: 'Energy dependence creates geopolitical vulnerability; sparked push for fuel efficiency and alternative energy.',
  },
  {
    name: 'Black Monday',
    dates: 'October 19, 1987',
    trigger: 'Program trading, portfolio insurance, and market psychology triggered global sell-off.',
    peakImpact: 'Dow Jones fell 22.6% in one day — largest single-day percentage drop in history.',
    recoveryTime: '~2 years to recover prior highs.',
    keyLesson: 'Automated trading can amplify panic; led to circuit breakers and trading halts.',
  },
  {
    name: 'Asian Financial Crisis',
    dates: '1997–1998',
    trigger: 'Thai baht collapse after government floated currency; contagion spread across East Asia.',
    peakImpact: 'Indonesian GDP fell ~13%; currencies lost 30–80% of value; IMF bailouts totaled ~$118B.',
    recoveryTime: '~2–4 years depending on country.',
    keyLesson: 'Fixed exchange rate pegs + hot money flows create systemic fragility in emerging markets.',
  },
  {
    name: 'Dot-com Crash',
    dates: '2000–2002',
    trigger: 'Massive speculation in internet companies with no profits; NASDAQ peaked March 2000.',
    peakImpact: 'NASDAQ fell ~78% from peak; $5 trillion in market value destroyed.',
    recoveryTime: 'NASDAQ didn\'t recover 2000 highs until 2015.',
    keyLesson: 'Revenue-less growth and "new paradigm" thinking are warning signs; valuations must eventually connect to fundamentals.',
  },
  {
    name: 'Global Financial Crisis',
    dates: '2007–2009',
    trigger: 'US subprime mortgage defaults triggered collapse of mortgage-backed securities and derivatives.',
    peakImpact: 'US unemployment ~10%; global GDP contracted; Lehman Brothers collapsed; $10T+ in global losses.',
    recoveryTime: '~5–6 years for employment to recover.',
    keyLesson: 'Systemic risk from interconnected financial instruments; "too big to fail" moral hazard. Led to Dodd-Frank.',
  },
  {
    name: 'European Debt Crisis',
    dates: '2010–2015',
    trigger: 'Greece revealed hidden fiscal deficits; contagion hit Portugal, Ireland, Italy, Spain.',
    peakImpact: 'Greek GDP fell ~26%; unemployment ~27%; multiple bailout packages totaling €289B.',
    recoveryTime: '~5+ years; Greece under austerity for a decade.',
    keyLesson: 'Monetary union without fiscal union creates structural vulnerabilities.',
  },
  {
    name: 'COVID-19 Economic Shock',
    dates: '2020',
    trigger: 'Global pandemic forced lockdowns; supply chains disrupted; demand collapsed across sectors.',
    peakImpact: 'US unemployment spiked to ~14.7% (April 2020); global GDP fell ~3.1%.',
    recoveryTime: '~2 years for GDP; labor market scars lasted longer.',
    keyLesson: 'Pandemic preparedness is economic policy; unprecedented fiscal/monetary response prevented deeper depression but fueled inflation.',
  },
];

interface TradeRoute {
  name: string;
  period: string;
  description: string;
  goods: string;
  civilizations: string;
  peakPeriod: string;
  legacy: string;
}

const TRADE_ROUTES: TradeRoute[] = [
  {
    name: 'Silk Road',
    period: '130 BCE – 1453 CE',
    description: 'Network of overland routes connecting China to the Mediterranean through Central Asia.',
    goods: 'Silk, spices, tea, porcelain, gold, silver, precious stones, glassware.',
    civilizations: 'Han/Tang/Yuan China, Parthia, Kushan Empire, Roman Empire, Byzantine Empire, Persian Empire, Mongol Empire.',
    peakPeriod: 'Tang Dynasty (618–907 CE) and Pax Mongolica (1250–1350 CE).',
    legacy: 'Transmitted religions (Buddhism, Islam, Christianity), technologies (paper, gunpowder, compass), and diseases (Black Death) across continents.',
  },
  {
    name: 'Spice Trade',
    period: '800 – 1600 CE',
    description: 'Maritime routes from Southeast Asia\'s Spice Islands through the Indian Ocean to Europe.',
    goods: 'Pepper, cinnamon, cloves, nutmeg, mace, cardamom.',
    civilizations: 'Srivijaya, Majapahit, Chola Dynasty, Arab traders, Venetian Republic, Portuguese Empire.',
    peakPeriod: '1400s–1500s during the Age of Exploration.',
    legacy: 'Motivated European exploration; Portuguese capture of Malacca (1511) reshaped global power; led to colonialism.',
  },
  {
    name: 'Trans-Saharan Trade',
    period: '300 – 1600 CE',
    description: 'Camel caravan routes crossing the Sahara connecting West Africa to North Africa and the Mediterranean.',
    goods: 'Gold, salt, slaves, ivory, textiles, copper, kola nuts.',
    civilizations: 'Ghana Empire, Mali Empire, Songhai Empire, Berber traders, Hausa city-states, Egyptian Mamluks.',
    peakPeriod: 'Mali Empire (1235–1400), especially under Mansa Musa.',
    legacy: 'Spread Islam across West Africa; financed great empires; Timbuktu became a center of learning.',
  },
  {
    name: 'Indian Ocean Trade Network',
    period: '800 – 1500 CE',
    description: 'Monsoon-driven maritime trade linking East Africa, Arabia, India, and Southeast Asia.',
    goods: 'Textiles, spices, ivory, gold, ceramics, timber, enslaved peoples.',
    civilizations: 'Swahili city-states, Abbasid Caliphate, Chola Dynasty, Song/Yuan China, Srivijaya, Gujarat Sultanate.',
    peakPeriod: '1000–1400 CE under Swahili and Arab merchant networks.',
    legacy: 'Created a cosmopolitan trading world; Swahili culture blended Bantu and Arab traditions; spread Islam to coastal East Africa and Southeast Asia.',
  },
  {
    name: 'Triangular Trade / Atlantic Slave Trade',
    period: '1500s – 1800s',
    description: 'Three-legged Atlantic route: Europe → Africa (manufactured goods) → Americas (enslaved people) → Europe (raw materials).',
    goods: 'Enslaved Africans, sugar, tobacco, cotton, rum, textiles, firearms.',
    civilizations: 'Portuguese, Spanish, British, French, Dutch empires; West African kingdoms (Dahomey, Ashanti, Oyo); colonial Americas.',
    peakPeriod: '1700s — peak of the transatlantic slave trade.',
    legacy: 'Estimated 12.5 million Africans forcibly transported; shaped demographics, economies, and racial dynamics of the Americas; abolition movement grew from 1780s.',
  },
  {
    name: 'British East India Company Routes',
    period: '1600 – 1874',
    description: 'Corporate-imperial trade network spanning India, China, and Southeast Asia.',
    goods: 'Tea, opium, cotton, silk, indigo, saltpeter, spices.',
    civilizations: 'Mughal Empire, Qing Dynasty, British Empire, Dutch VOC (rival), various Indian princely states.',
    peakPeriod: '1757–1857 — from Battle of Plassey to Indian Rebellion.',
    legacy: 'Company became de facto ruler of India; opium trade triggered wars with China; model for corporate imperialism; dissolved after 1857 rebellion.',
  },
];

interface EconomicTheory {
  name: string;
  period: string;
  keyIdea: string;
  keyFigure: string;
  keyWork: string;
  historicalImpact: string;
}

const THEORIES: EconomicTheory[] = [
  {
    name: 'Mercantilism',
    period: '1500s–1700s',
    keyIdea: 'National wealth is measured by gold reserves; exports should exceed imports.',
    keyFigure: 'Jean-Baptiste Colbert',
    keyWork: 'Thomas Mun, England\'s Treasure by Forraign Trade (1664)',
    historicalImpact: 'Drove colonialism, trade wars, and Navigation Acts; dominated European economic policy for 200+ years.',
  },
  {
    name: 'Classical Economics',
    period: '1776',
    keyIdea: 'Free markets self-regulate through the "invisible hand"; division of labor drives wealth.',
    keyFigure: 'Adam Smith',
    keyWork: 'The Wealth of Nations (1776)',
    historicalImpact: 'Foundation of modern economics; inspired laissez-faire policy, free trade movements, and industrial capitalism.',
  },
  {
    name: 'Malthusianism',
    period: '1798',
    keyIdea: 'Population grows geometrically while food supply grows arithmetically, leading to inevitable crisis.',
    keyFigure: 'Thomas Robert Malthus',
    keyWork: 'An Essay on the Principle of Population (1798)',
    historicalImpact: 'Influenced Darwin\'s natural selection theory; shaped debates on poverty, welfare, and population control for centuries.',
  },
  {
    name: 'Marxism',
    period: '1867',
    keyIdea: 'Capitalism exploits workers through surplus value extraction; class struggle drives historical change.',
    keyFigure: 'Karl Marx',
    keyWork: 'Das Kapital (1867)',
    historicalImpact: 'Inspired socialist and communist revolutions worldwide; reshaped 20th-century geopolitics; ongoing influence on labor rights and inequality debates.',
  },
  {
    name: 'Keynesian Economics',
    period: '1936',
    keyIdea: 'Government spending can stabilize economies during recessions when private demand is insufficient.',
    keyFigure: 'John Maynard Keynes',
    keyWork: 'The General Theory of Employment, Interest and Money (1936)',
    historicalImpact: 'Shaped New Deal policy and post-WWII economic management; created framework for fiscal stimulus and macroeconomic policy.',
  },
  {
    name: 'Chicago School / Monetarism',
    period: '1950s–1980s',
    keyIdea: 'Money supply is the primary driver of economic activity; inflation is always a monetary phenomenon.',
    keyFigure: 'Milton Friedman',
    keyWork: 'A Monetary History of the United States (1963)',
    historicalImpact: 'Influenced Volcker\'s anti-inflation policy; shaped deregulation, privatization, and free-market reforms globally.',
  },
  {
    name: 'Supply-side / Reaganomics',
    period: '1980s',
    keyIdea: 'Tax cuts for businesses and high earners stimulate investment, growth, and eventually increase tax revenue.',
    keyFigure: 'Arthur Laffer / Ronald Reagan',
    keyWork: 'Laffer Curve (1974 concept); implemented via Economic Recovery Tax Act (1981)',
    historicalImpact: 'Defined Reagan-Thatcher era; shifted Western policy toward lower taxes and reduced regulation; debated effects on inequality.',
  },
  {
    name: 'Behavioral Economics',
    period: '1970s–present',
    keyIdea: 'Humans are not rational actors; cognitive biases systematically distort economic decision-making.',
    keyFigure: 'Daniel Kahneman & Amos Tversky',
    keyWork: 'Prospect Theory (1979); Thinking, Fast and Slow (2011)',
    historicalImpact: 'Revolutionized finance, policy design, and marketing; "nudge" theory shapes modern regulation and public health interventions.',
  },
];

interface RichestPerson {
  rank: number;
  name: string;
  era: string;
  netWorth: string;
  source: string;
}

const RICHEST_PEOPLE: RichestPerson[] = [
  { rank: 1, name: 'Mansa Musa', era: 'Mali Empire, r. 1312–1337', netWorth: '$400–700 billion', source: 'Gold mines and salt trade of the Mali Empire; his Cairo pilgrimage (1324) crashed gold prices across the Mediterranean.' },
  { rank: 2, name: 'Augustus Caesar', era: 'Roman Empire, 63 BCE–14 CE', netWorth: '$4.6 trillion (est.)', source: 'Personal wealth equaled ~25–30% of the Roman Empire\'s entire economic output; owned Egypt as personal property.' },
  { rank: 3, name: 'Emperor Shenzong (Song Dynasty)', era: 'China, r. 1067–1085', netWorth: '$30+ trillion (GDP share)', source: 'Ruled the Song Dynasty at its peak when China produced ~25–30% of world GDP.' },
  { rank: 4, name: 'Akbar I', era: 'Mughal Empire, r. 1556–1605', netWorth: '$21 trillion (GDP share)', source: 'Mughal India commanded ~25% of world GDP; vast land revenue and trade.' },
  { rank: 5, name: 'John D. Rockefeller', era: 'USA, 1839–1937', netWorth: '$340–400 billion', source: 'Standard Oil monopoly controlled ~90% of US oil refining; peak wealth equaled ~2% of US GDP.' },
  { rank: 6, name: 'Andrew Carnegie', era: 'USA, 1835–1919', netWorth: '$310–370 billion', source: 'Carnegie Steel Company; sold to J.P. Morgan for $480M (1901), roughly $17B today.' },
  { rank: 7, name: 'Jakob Fugger', era: 'Holy Roman Empire, 1459–1525', netWorth: '$400 billion (est.)', source: 'Banking, mining (silver, copper, mercury); financed Habsburg emperors; called "Jakob the Rich."' },
  { rank: 8, name: 'William the Conqueror', era: 'England, 1028–1087', netWorth: '$229–280 billion', source: 'Seized all English land after 1066 conquest; Domesday Book documented his total asset base.' },
  { rank: 9, name: 'Genghis Khan', era: 'Mongol Empire, 1162–1227', netWorth: 'Incalculable (largest contiguous empire)', source: 'Controlled the largest contiguous land empire in history; vast plunder, tribute, and trade route control.' },
  { rank: 10, name: 'Henry Ford', era: 'USA, 1863–1947', netWorth: '$200 billion', source: 'Ford Motor Company; revolutionized manufacturing with the assembly line; dominated the auto industry.' },
];

interface EconomicFirst {
  what: string;
  where: string;
  when: string;
  detail: string;
}

const ECONOMIC_FIRSTS: EconomicFirst[] = [
  { what: 'First Coin Currency', where: 'Lydia (modern Turkey)', when: '~600 BCE', detail: 'King Alyattes minted electrum (gold-silver alloy) coins — standardized weight/purity enabled trade across the ancient world.' },
  { what: 'First Paper Money', where: 'China (Tang Dynasty)', when: '~700 CE', detail: 'Merchants used "flying money" (feiqian) certificates to avoid carrying heavy coins; Song Dynasty formalized government-issued notes by 1024.' },
  { what: 'First Joint-Stock Company', where: 'England', when: '1553', detail: 'The Muscovy Company was chartered to explore trade routes to Russia — investors shared both risk and profit.' },
  { what: 'First Stock Exchange', where: 'Amsterdam, Netherlands', when: '1602', detail: 'The Dutch East India Company (VOC) issued shares tradeable on the Amsterdam Beurs — birth of modern capital markets.' },
  { what: 'First Central Bank', where: 'Sweden', when: '1668', detail: 'Sveriges Riksbank was established to stabilize Swedish currency after the collapse of Stockholms Banco; still operates today.' },
  { what: 'First Futures Contract', where: 'Osaka, Japan', when: '1710', detail: 'Dojima Rice Exchange formalized futures trading — samurai paid in rice needed price certainty; created standardized forward contracts.' },
  { what: 'First Modern Insurance', where: 'London, England', when: '1688', detail: 'Lloyd\'s Coffee House became the meeting point for marine underwriters, evolving into Lloyd\'s of London — the global insurance market.' },
  { what: 'First Fiat Currency Hyperinflation', where: 'France', when: '1795', detail: 'Assignats, revolutionary France\'s paper currency backed by seized church lands, lost 99% of value — a cautionary tale for unbacked money.' },
  { what: 'First Credit Card', where: 'USA', when: '1950', detail: 'Diners\' Club card, created by Frank McNamara after forgetting his wallet at a restaurant, enabled cashless restaurant payments.' },
  { what: 'First Cryptocurrency', where: 'Internet (global)', when: '2009', detail: 'Bitcoin, created by pseudonymous Satoshi Nakamoto, introduced decentralized digital currency using blockchain technology.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section tab state
// ─────────────────────────────────────────────────────────────────────────────

type SectionId = 'crashes' | 'routes' | 'theories' | 'richest' | 'firsts';

const SECTIONS: { id: SectionId; label: string; icon: string }[] = [
  { id: 'crashes', label: 'Market Crashes', icon: '📉' },
  { id: 'routes', label: 'Trade Routes', icon: '🚢' },
  { id: 'theories', label: 'Economic Theories', icon: '📚' },
  { id: 'richest', label: 'Richest Ever', icon: '👑' },
  { id: 'firsts', label: 'Economic Firsts', icon: '🏅' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span>{icon}</span>
      {title}
    </h2>
  );
}

function CrashCard({ crisis, index }: { crisis: Crisis; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '16px 20px',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: '#ef444422',
              color: '#ef4444',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}
          >
            {crisis.dates}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{crisis.name}</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 14, display: 'grid', gap: 10 }}
        >
          <DetailRow label="Trigger" value={crisis.trigger} />
          <DetailRow label="Peak Impact" value={crisis.peakImpact} />
          <DetailRow label="Recovery Time" value={crisis.recoveryTime} />
          <DetailRow label="Key Lesson" value={crisis.keyLesson} color={ACCENT} />
        </motion.div>
      )}
    </motion.div>
  );
}

function DetailRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13, lineHeight: 1.6 }}>
      <span style={{ fontWeight: 700, color: '#64748b', minWidth: 110, flexShrink: 0 }}>{label}</span>
      <span style={{ color: color ?? '#cbd5e1' }}>{value}</span>
    </div>
  );
}

function TradeRouteCard({ route, index }: { route: TradeRoute; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '16px 20px',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: '#3b82f622',
              color: '#60a5fa',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}
          >
            {route.period}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{route.name}</span>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          style={{ marginTop: 14, display: 'grid', gap: 10 }}
        >
          <DetailRow label="Route" value={route.description} />
          <DetailRow label="Goods Traded" value={route.goods} />
          <DetailRow label="Civilizations" value={route.civilizations} />
          <DetailRow label="Peak Period" value={route.peakPeriod} />
          <DetailRow label="Legacy" value={route.legacy} color={ACCENT} />
        </motion.div>
      )}
    </motion.div>
  );
}

function TheoryCard({ theory, index }: { theory: EconomicTheory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            backgroundColor: '#a855f722',
            color: '#a855f7',
            fontFamily: 'monospace',
          }}
        >
          {theory.period}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{theory.name}</span>
      </div>
      <div style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic' }}>
        "{theory.keyIdea}"
      </div>
      <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
        <DetailRow label="Key Figure" value={theory.keyFigure} />
        <DetailRow label="Key Work" value={theory.keyWork} />
        <DetailRow label="Impact" value={theory.historicalImpact} color={ACCENT} />
      </div>
    </motion.div>
  );
}

function RichestTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 4px',
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            {['#', 'Name', 'Era', 'Est. Net Worth', 'Source of Wealth'].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RICHEST_PEOPLE.map((p, i) => (
            <motion.tr
              key={p.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              style={{ backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            >
              <td style={{ padding: '10px 12px', color: ACCENT, fontWeight: 800, fontFamily: 'monospace' }}>{p.rank}</td>
              <td style={{ padding: '10px 12px', color: '#f1f5f9', fontWeight: 700 }}>{p.name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{p.era}</td>
              <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>{p.netWorth}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', lineHeight: 1.5 }}>{p.source}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FirstsSection() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {ECONOMIC_FIRSTS.map((f, i) => (
        <motion.div
          key={f.what}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
          style={{
            display: 'flex',
            gap: 16,
            padding: '14px 18px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 80 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>{f.when}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{f.where}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{f.what}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{f.detail}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function EconomicsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('crashes');

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
        {/* Hero */}
        <div
          style={{
            padding: '40px 32px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${ACCENT_DIM} 100%)`,
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
              marginBottom: 24,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            ← Back to Timeline
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: ACCENT_DIM,
                border: `2px solid ${ACCENT_BORDER}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              💰
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: ACCENT_DIM,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Economics Explorer
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(22px, 4vw, 36px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            Economic History
          </h1>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, maxWidth: 640 }}>
            From tulip mania to cryptocurrency — explore the market crashes, trade routes, economic theories,
            and financial firsts that shaped the modern world.
          </p>
        </div>

        {/* Section tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: '12px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflowX: 'auto',
            flexWrap: 'wrap',
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 6,
                border: activeSection === s.id ? `1px solid ${ACCENT_BORDER}` : '1px solid transparent',
                backgroundColor: activeSection === s.id ? ACCENT_DIM : 'transparent',
                color: activeSection === s.id ? ACCENT : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              <span>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Active section content */}
        <div style={{ padding: '28px 32px 48px' }}>
          {activeSection === 'crashes' && (
            <>
              <SectionHeading icon="📉" title="Great Market Crashes & Crises" />
              <div style={{ display: 'grid', gap: 8 }}>
                {CRISES.map((c, i) => (
                  <CrashCard key={c.name} crisis={c} index={i} />
                ))}
              </div>
            </>
          )}

          {activeSection === 'routes' && (
            <>
              <SectionHeading icon="🚢" title="History's Great Trade Routes" />
              <div style={{ display: 'grid', gap: 8 }}>
                {TRADE_ROUTES.map((r, i) => (
                  <TradeRouteCard key={r.name} route={r} index={i} />
                ))}
              </div>
            </>
          )}

          {activeSection === 'theories' && (
            <>
              <SectionHeading icon="📚" title="Economic Theories Timeline" />
              <div style={{ display: 'grid', gap: 12 }}>
                {THEORIES.map((t, i) => (
                  <TheoryCard key={t.name} theory={t} index={i} />
                ))}
              </div>
            </>
          )}

          {activeSection === 'richest' && (
            <>
              <SectionHeading icon="👑" title="Richest People in History (Inflation-Adjusted)" />
              <RichestTable />
            </>
          )}

          {activeSection === 'firsts' && (
            <>
              <SectionHeading icon="🏅" title="Economic Firsts" />
              <FirstsSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
