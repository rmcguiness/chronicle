/**
 * GreatDepressionPage — comprehensive deep-dive on the Great Depression.
 *
 * Route: /great-depression
 *
 * Sections:
 *  1. Hero — headline, overview
 *  2. The Roaring Twenties — context and buildup
 *  3. Black Thursday / Black Tuesday — the crash
 *  4. Why it became the Great Depression — structural failures
 *  5. The human cost — statistics and stories
 *  6. The Dust Bowl — simultaneous environmental disaster
 *  7. Hoover's failure vs Roosevelt's New Deal
 *  8. Global Depression — not just America
 *  9. Key figures
 * 10. Legacy and lessons
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

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

// ── The Roaring Twenties ───────────────────────────────────────────────────

const ROARING_TWENTIES: InsightEntry[] = [
  {
    label: 'Credit-Fueled Boom',
    detail:
      'The 1920s saw an explosion of consumer credit. Americans bought cars, radios, and appliances on installment plans. By 1929, 60% of cars and 80% of radios were purchased on credit. The economy was built on borrowed money — when confidence cracked, the entire structure collapsed.',
  },
  {
    label: 'Stock Speculation',
    detail:
      'Ordinary Americans poured savings into the stock market, often buying "on margin" — putting down as little as 10% and borrowing the rest. When prices fell, brokers demanded more cash (margin calls), forcing mass selling that drove prices down further in a devastating spiral.',
  },
  {
    label: 'Wealth Inequality',
    detail:
      'By 1929, the top 1% of Americans owned 40% of the nation\'s wealth. The bottom 80% had just 9% of total income. Workers couldn\'t afford to buy the goods they produced, creating a dangerous gap between production capacity and consumer demand.',
  },
  {
    label: 'Overproduction',
    detail:
      'Factories and farms produced far more than consumers could buy. Warehouses filled with unsold goods. Farmers were already in crisis — agricultural prices had been falling since WWI ended the wartime demand boom. The "prosperity" of the 1920s was unevenly distributed and fundamentally fragile.',
  },
  {
    label: 'Weak Banking System',
    detail:
      'The US had thousands of small, unregulated banks with no deposit insurance. When one bank failed, panicked depositors rushed to withdraw from others, creating cascading bank runs. There was no safety net — when your bank failed, your savings simply vanished.',
  },
];

// ── The Crash ──────────────────────────────────────────────────────────────

const CRASH_TIMELINE: TimelineEntry[] = [
  {
    year: 'October 24, 1929',
    title: 'Black Thursday',
    description:
      'Panic selling began on the New York Stock Exchange. Nearly 13 million shares were traded — three times the normal volume. A group of leading bankers pooled money to buy stocks and briefly stabilized prices, but confidence was already shattered. The weekend brought only dread.',
    color: AMBER,
  },
  {
    year: 'October 28, 1929',
    title: 'Black Monday',
    description:
      'The market plunged again with no banker rescue this time. The Dow Jones fell 13% in a single day. Margin calls went out to thousands of investors who had borrowed to buy stocks. Many couldn\'t pay and were wiped out overnight.',
    color: RED,
  },
  {
    year: 'October 29, 1929',
    title: 'Black Tuesday',
    description:
      '16 million shares were traded in a single day — a record that stood for decades. $14 billion in value was wiped out in one session. Ticker machines ran hours behind the actual trading. Some investors didn\'t even know they were ruined until the next day. The crash itself wasn\'t the Depression — it was the trigger that exposed the deeper structural weaknesses in the economy.',
    color: CRIMSON,
  },
  {
    year: '1929–1932',
    title: 'The Long Slide',
    description:
      'The market didn\'t just crash and recover. It kept falling for nearly three years. The Dow Jones, which peaked at 381 in September 1929, bottomed out at 41 in July 1932 — a staggering 89% decline. It would not return to its 1929 peak until 1954, a full 25 years later.',
    color: PURPLE,
  },
];

// ── Why it became the Great Depression ─────────────────────────────────────

const STRUCTURAL_FAILURES: InsightEntry[] = [
  {
    label: 'Bank Runs and Bank Failures',
    detail:
      '9,000 banks failed between 1930 and 1933 — roughly 40% of all American banks. When a bank failed, depositors lost everything. With no FDIC insurance, the life savings of millions of families simply evaporated. Each failure triggered runs on neighboring banks, creating waves of collapse.',
  },
  {
    label: 'Smoot-Hawley Tariff (1930)',
    detail:
      'Congress raised tariffs on over 900 imported products, hoping to protect American industry. Instead, trading partners retaliated with their own tariffs. Global trade collapsed by 65% between 1929 and 1934. What might have been an American recession became a worldwide depression.',
  },
  {
    label: 'Federal Reserve\'s Catastrophic Error',
    detail:
      'Instead of expanding the money supply to stimulate the economy, the Federal Reserve tightened it — the exact wrong response. This is now recognized as one of the worst policy mistakes in economic history. Ben Bernanke, who studied the Fed\'s Depression-era failures for decades, applied the opposite lesson when he became Fed chairman during the 2008 crisis.',
  },
  {
    label: 'Debt Deflation Spiral',
    detail:
      'As prices fell, the real burden of debt increased — you owed the same dollars, but those dollars were now worth more. Businesses and consumers cut spending to pay debts, which caused prices to fall further, which made debts even heavier. This vicious cycle, identified by economist Irving Fisher, turned a downturn into a catastrophe.',
  },
];

// ── The Human Cost ─────────────────────────────────────────────────────────

const HUMAN_COST_STATS: InsightEntry[] = [
  {
    label: 'Unemployment: 3.2% → 24.9%',
    detail:
      'US unemployment rose from 3.2% in 1929 to 24.9% in 1933 — one in four American workers had no job. In some industrial cities like Toledo and Cleveland, unemployment exceeded 50%. These weren\'t just statistics — they were fathers who couldn\'t feed their families, skilled workers reduced to selling apples on street corners.',
  },
  {
    label: 'GDP Fell 30%',
    detail:
      'The US economy shrank by nearly a third in just three years. Industrial production fell by 47%. The economic output of the world\'s largest economy was pushed back by a decade. Nothing like it had ever happened before — and nothing like it has happened since.',
  },
  {
    label: '2 Million Homeless — Hoovervilles',
    detail:
      'An estimated 2 million Americans became homeless. Shantytowns of cardboard, scrap metal, and packing crates sprang up in every major city, mockingly named "Hoovervilles" after President Herbert Hoover, who was widely blamed for the crisis. "Hoover blankets" were newspapers used for warmth. "Hoover flags" were empty pockets turned inside out.',
  },
  {
    label: 'Breadlines and Soup Kitchens',
    detail:
      'Millions of Americans relied on private charity for food. Breadlines stretched for blocks in major cities. Soup kitchens — many run by churches and community organizations — served millions of meals. Al Capone, the gangster, famously opened a soup kitchen in Chicago, feeding 3,000 people daily.',
  },
  {
    label: 'Bank Holiday (March 1933)',
    detail:
      'On his second day in office, President Roosevelt declared a four-day "bank holiday," closing every bank in America to stop the wave of bank runs. When banks reopened, only those certified as sound were allowed to resume operations. It was a dramatic gamble — and it worked. The runs stopped.',
  },
];

// ── The Dust Bowl ──────────────────────────────────────────────────────────

const DUST_BOWL_TIMELINE: TimelineEntry[] = [
  {
    year: '1930–1936',
    title: 'The Great Drought',
    description:
      'A severe drought struck the Great Plains — Texas, Oklahoma, Kansas, Colorado, New Mexico. But drought alone didn\'t cause the catastrophe. Decades of intensive farming had stripped the native prairie grasses that held the topsoil in place. Without roots to anchor it, the soil simply blew away.',
    color: AMBER,
  },
  {
    year: '1934–1935',
    title: 'Black Blizzards',
    description:
      'Massive dust storms — "black blizzards" — darkened skies across the continent. On April 14, 1935, "Black Sunday," a wall of dust 1,000 miles long rolled across the Plains. Dust reached ships 300 miles out in the Atlantic. In Washington, D.C., dust clouds darkened the sky as lawmakers debated soil conservation bills.',
    color: RED,
  },
  {
    year: '1930s',
    title: '3.5 Million Displaced',
    description:
      '3.5 million people abandoned their farms on the Great Plains. 500,000 were left homeless. Over 200,000 migrated to California — the "Okies" — where they faced discrimination and exploitation as migrant laborers. John Steinbeck\'s "The Grapes of Wrath" (1939) immortalized their suffering and became one of the great American novels.',
    color: GOLD,
  },
];

// ── New Deal Programs ──────────────────────────────────────────────────────

const NEW_DEAL_PROGRAMS: TimelineEntry[] = [
  {
    year: 'March 9, 1933',
    title: 'Emergency Banking Act',
    description:
      'Passed just 100 hours after Roosevelt\'s inauguration — before most Americans had even adjusted to the new president. It gave the government power to inspect and certify banks before they could reopen. Combined with FDR\'s first "fireside chat" radio address explaining what was happening, it ended the banking panic almost overnight.',
    color: BLUE,
  },
  {
    year: '1933',
    title: 'FDIC — Federal Deposit Insurance Corporation',
    description:
      'Created bank deposit insurance, guaranteeing individual deposits up to $2,500 (now $250,000). This single reform ended bank runs permanently. When depositors knew their money was safe, they stopped panicking. The FDIC still operates today and has never failed to honor a guarantee.',
    color: GREEN,
  },
  {
    year: '1935',
    title: 'Social Security Act',
    description:
      'Revolutionary legislation creating a federal safety net for the elderly, the unemployed, and dependent children. For the first time, the US government took responsibility for the economic security of its citizens. Social Security remains the largest government program in the world and has lifted tens of millions of seniors out of poverty.',
    color: INDIGO,
  },
  {
    year: '1933–1942',
    title: 'CCC, WPA, PWA — Jobs Programs',
    description:
      'The Civilian Conservation Corps, Works Progress Administration, and Public Works Administration employed 8.5 million Americans building roads, bridges, schools, hospitals, airports, and national parks. The WPA also employed artists, writers, and musicians — creating murals, guidebooks, and performances that documented and enriched American culture.',
    color: TEAL,
  },
  {
    year: '1934',
    title: 'SEC — Securities and Exchange Commission',
    description:
      'Created to regulate the stock market and prevent the kind of speculation and fraud that contributed to the 1929 crash. Required companies to disclose financial information, banned insider trading, and established rules for securities trading. The SEC still regulates Wall Street today.',
    color: PURPLE,
  },
  {
    year: '1933',
    title: 'Glass-Steagall Act',
    description:
      'Separated commercial banking (savings and loans) from investment banking (stock speculation). The logic was simple: banks that held ordinary people\'s deposits should not be gambling with that money in the stock market. Glass-Steagall was repealed in 1999 — and some economists blame that repeal for contributing to the 2008 financial crisis.',
    color: ROSE,
  },
];

// ── Global Depression ──────────────────────────────────────────────────────

const GLOBAL_IMPACT: TimelineEntry[] = [
  {
    year: '1929–1933',
    title: 'Germany: From Depression to Hitler',
    description:
      'Germany, already battered by WWI reparations and hyperinflation, was devastated by the Depression. Unemployment hit 30%. Banks collapsed. The Weimar Republic lost all credibility. In this climate of desperation and humiliation, Adolf Hitler and the Nazi Party surged from a fringe movement to power — Hitler became Chancellor in January 1933. The Depression didn\'t cause Nazism, but it created the conditions that made it possible.',
    color: CRIMSON,
  },
  {
    year: '1929–1936',
    title: 'United Kingdom',
    description:
      'Britain experienced severe unemployment, particularly in industrial regions in the north of England, Scotland, and Wales. The government imposed austerity measures and cuts to unemployment benefits, triggering protests including the famous Jarrow March of 1936. Recovery was slow and uneven.',
    color: BLUE,
  },
  {
    year: '1929–1935',
    title: 'Australia, Canada, and France',
    description:
      'Australia\'s unemployment reached 29%. Canada\'s GDP fell 40% — even worse than America\'s. France entered depression later but suffered longer, not recovering until the late 1930s. The Depression demonstrated for the first time that the global economy was truly interconnected — America\'s crash became the world\'s crisis.',
    color: TEAL,
  },
  {
    year: '1930s',
    title: 'Japan: Militarism as a Solution',
    description:
      'Japan\'s economy was hit hard, particularly its silk export industry. The military faction gained power by arguing that Japan needed to secure resources through territorial expansion. This led directly to Japan\'s invasion of Manchuria (1931), full-scale war with China (1937), and ultimately the path to Pearl Harbor. The Depression didn\'t just reshape economics — it reshaped geopolitics.',
    color: RED,
  },
];

// ── Key Figures ────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Herbert Hoover',
    years: '1874–1964',
    contribution:
      'President during the crash (1929–1933). A brilliant engineer and humanitarian (he\'d organized famine relief in Europe after WWI), Hoover believed in voluntary cooperation and opposed direct government relief. His philosophy — "rugged individualism" — proved catastrophically inadequate for the scale of the crisis. His name became synonymous with failure.',
  },
  {
    name: 'Franklin D. Roosevelt (FDR)',
    years: '1882–1945',
    contribution:
      'Elected president in 1932 in a landslide. "The only thing we have to fear is fear itself." FDR launched the New Deal, fundamentally transforming the relationship between the American government and its citizens. He won four presidential elections and led the country through both the Depression and WWII. The most consequential president since Lincoln.',
  },
  {
    name: 'Eleanor Roosevelt',
    years: '1884–1962',
    contribution:
      'Transformed the role of First Lady from ceremonial to activist. Traveled the country visiting coal mines, sharecropper camps, and breadlines, becoming FDR\'s "eyes and ears." Championed civil rights, women\'s rights, and humanitarian causes. Later chaired the UN committee that drafted the Universal Declaration of Human Rights.',
  },
  {
    name: 'John Maynard Keynes',
    years: '1883–1946',
    contribution:
      'British economist who provided the theoretical framework for government intervention during economic downturns. His "General Theory" (1936) argued that during depressions, governments should spend more, not less — deficit spending to stimulate demand. Keynesian economics became the dominant framework for decades and directly influenced the New Deal.',
  },
  {
    name: 'Milton Friedman',
    years: '1912–2006',
    contribution:
      'Decades later, Friedman and Anna Schwartz\'s "A Monetary History of the United States" (1963) reinterpreted the Depression as primarily a failure of the Federal Reserve — tightening money supply when it should have expanded it. This "monetarist" view influenced Ben Bernanke\'s response to the 2008 crisis: massive monetary expansion.',
  },
  {
    name: 'Dorothea Lange',
    years: '1895–1965',
    contribution:
      'Photographer who documented the human face of the Depression for the Farm Security Administration. Her 1936 photograph "Migrant Mother" — showing Florence Owens Thompson with her children — became the iconic image of the era. Lange\'s work showed Americans in other parts of the country what suffering looked like, building support for relief programs.',
  },
];

// ── Legacy and Lessons ─────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Institutions That Still Operate',
    detail:
      'The FDIC, Social Security, and SEC — all created during the New Deal — still function as core pillars of the American economic system. Every time you see "FDIC insured" on a bank, every Social Security check, every SEC filing — that\'s the Depression\'s legacy, still protecting Americans 90 years later.',
  },
  {
    label: '2008 Financial Crisis Response',
    detail:
      'When the 2008 financial crisis hit, Fed Chairman Ben Bernanke — who had spent his academic career studying the Great Depression — applied the opposite lessons from the 1930s Fed. Instead of tightening money supply, he unleashed massive stimulus (quantitative easing). The result: a severe recession, but not another Depression. History rhymed, but didn\'t repeat.',
  },
  {
    label: 'COVID-19 Response (2020)',
    detail:
      'The largest government stimulus in history — trillions of dollars in direct payments, enhanced unemployment, and business loans — was deployed in response to COVID-19. The speed and scale of the response was only possible because the Depression had permanently changed what governments considered acceptable intervention in economic crises.',
  },
  {
    label: 'Did the New Deal End the Depression?',
    detail:
      'No — World War II spending did. The New Deal reduced unemployment from 25% to 14%, but full recovery only came with the massive government spending of wartime mobilization. However, the New Deal prevented total societal collapse, preserved democratic institutions, and built the regulatory framework that enabled the post-war economic boom.',
  },
  {
    label: 'The Central Lesson',
    detail:
      'The Great Depression taught the world that modern economies can spiral into catastrophe without intervention, that central banks must act as lenders of last resort, and that safety nets like deposit insurance and social security are not luxuries but necessities. Every major economic crisis since has been managed with these lessons in mind.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({
  title,
  icon,
  borderColor,
  children,
}: {
  title: string;
  icon: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 56,
        borderTop: `2px solid ${borderColor}`,
        paddingTop: 32,
      }}
    >
      <h2
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: borderColor,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 28 }}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineCard({
  entry,
  index,
}: {
  entry: TimelineEntry;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      style={{
        position: 'relative',
        paddingLeft: 28,
        marginBottom: 32,
        borderLeft: `3px solid ${entry.color}`,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: -7,
          top: 4,
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: entry.color,
          boxShadow: `0 0 8px ${entry.color}88`,
        }}
      />
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: entry.color,
          marginBottom: 2,
          letterSpacing: 0.5,
        }}
      >
        {entry.year}
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>
        {entry.title}
      </h3>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>
        {entry.description}
      </p>
    </motion.div>
  );
}

function InsightGrid({ items, accentColor }: { items: InsightEntry[]; accentColor: string }) {
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
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${accentColor}33`,
            borderRadius: 10,
            padding: '18px 20px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}88`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}33`;
          }}
        >
          <h4
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: accentColor,
              marginBottom: 8,
            }}
          >
            {item.label}
          </h4>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: '#94a3b8' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  const colors = [RED, BLUE, ROSE, GOLD, INDIGO, TEAL];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((fig, i) => {
        const c = colors[i % colors.length];
        return (
          <motion.div
            key={fig.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c}33`,
              borderRadius: 10,
              padding: '18px 20px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${c}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${c}33`;
            }}
          >
            <h4 style={{ fontSize: 16, fontWeight: 700, color: c, marginBottom: 2 }}>
              {fig.name}
            </h4>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{fig.years}</p>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: '#94a3b8' }}>
              {fig.contribution}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function GreatDepressionPage() {
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
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 28px 80px' }}>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <header
          style={{
            paddingTop: 48,
            paddingBottom: 40,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              fontSize: 13,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 24,
            }}
          >
            ← Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: 38,
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${AMBER}, ${RED})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Great Depression — When the Modern Economy First Collapsed (1929–1939)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: 17, lineHeight: 1.75, color: '#94a3b8', maxWidth: 780 }}
          >
            The Great Depression was the most severe economic catastrophe of the modern era.
            Beginning with the{' '}
            <span style={{ color: RED, fontWeight: 600 }}>stock market crash of October 1929</span>,
            it plunged the United States — and then the world — into a decade of mass unemployment,
            bank failures, and human suffering on a scale never before seen in peacetime. It
            destroyed governments, radicalized populations, and ultimately{' '}
            <span style={{ color: CRIMSON, fontWeight: 600 }}>set the stage for World War II</span>.
            But it also produced{' '}
            <span style={{ color: BLUE, fontWeight: 600 }}>lasting institutions</span> — the FDIC,
            Social Security, the SEC — that still protect Americans today.
          </motion.p>
        </header>

        {/* ── The Roaring Twenties ─────────────────────────────────── */}
        <SectionWrapper title="The Roaring Twenties: Building the House of Cards" icon="🎷" borderColor={GOLD}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The 1920s looked like an era of limitless prosperity — jazz, automobiles, skyscrapers,
            the birth of mass consumer culture. But beneath the glitter, the economy was built on
            five dangerous foundations that would all crack at once.
          </p>
          <InsightGrid items={ROARING_TWENTIES} accentColor={GOLD} />
        </SectionWrapper>

        {/* ── Black Thursday / Black Tuesday ────────────────────────── */}
        <SectionWrapper title="Black Thursday to Black Tuesday: The Crash" icon="📉" borderColor={RED}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The crash of October 1929 unfolded over five terrifying days. It didn't cause the
            Depression on its own — but it shattered the confidence that had held the fragile
            economy together, and exposed every weakness that had been building for years.
          </p>
          {CRASH_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Why it became the Great Depression ────────────────────── */}
        <SectionWrapper title="Why It Became the Great Depression" icon="🏚" borderColor={PURPLE}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            Stock market crashes had happened before. What made this one different was a cascade
            of policy failures and structural weaknesses that turned a financial panic into the
            worst economic disaster in modern history.
          </p>
          <InsightGrid items={STRUCTURAL_FAILURES} accentColor={PURPLE} />
        </SectionWrapper>

        {/* ── The Human Cost ────────────────────────────────────────── */}
        <SectionWrapper title="The Human Cost: Statistics and Stories" icon="🍞" borderColor={ROSE}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            Behind the economic data were millions of real human beings whose lives were shattered.
            The Depression wasn't an abstraction — it was hunger, homelessness, and desperation on
            a scale that America had never experienced.
          </p>
          <InsightGrid items={HUMAN_COST_STATS} accentColor={ROSE} />
        </SectionWrapper>

        {/* ── The Dust Bowl ─────────────────────────────────────────── */}
        <SectionWrapper title="The Dust Bowl (1930–1936): Environmental Catastrophe" icon="🌾" borderColor={AMBER}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            As if the economic collapse weren't enough, the Great Plains experienced the worst
            environmental disaster in American history — simultaneously. The Dust Bowl turned the
            nation's breadbasket into a wasteland and drove hundreds of thousands of Americans
            into desperate migration.
          </p>
          {DUST_BOWL_TIMELINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Hoover vs Roosevelt ───────────────────────────────────── */}
        <SectionWrapper title="Hoover's Failure vs Roosevelt's New Deal" icon="🏛" borderColor={BLUE}>
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>
              Herbert Hoover (1929–1933): The Wrong Philosophy at the Wrong Time
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8' }}>
              Hoover wasn't stupid or heartless — he was a successful engineer and humanitarian who
              had organized famine relief for millions in Europe. But he believed deeply in voluntary
              action and "rugged individualism," opposing direct government relief. As millions
              starved, Hoover insisted that prosperity was "just around the corner." His approach was
              disastrously inadequate for the scale of the crisis. By 1932, his name was a synonym
              for failure.
            </p>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: BLUE, marginBottom: 12 }}>
              FDR and the New Deal (1933–1939): "The Only Thing We Have to Fear Is Fear Itself"
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
              Roosevelt won the 1932 election in a landslide and immediately launched an unprecedented
              program of government action. The "First Hundred Days" produced more major legislation
              than most presidencies produce in four years. The New Deal didn't end the Depression —
              World War II spending did that — but it prevented total collapse and built institutions
              that still protect Americans today.
            </p>
          </div>

          {NEW_DEAL_PROGRAMS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Global Depression ─────────────────────────────────────── */}
        <SectionWrapper title="Global Depression: Not Just America" icon="🌍" borderColor={TEAL}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Great Depression was a global catastrophe. American bank failures and the
            Smoot-Hawley Tariff rippled outward, devastating economies worldwide. In some countries,
            the political consequences were even more devastating than the economic ones.
          </p>
          {GLOBAL_IMPACT.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ───────────────────────────────────────────── */}
        <SectionWrapper title="Key Figures" icon="👤" borderColor={INDIGO}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy and Lessons ────────────────────────────────────── */}
        <SectionWrapper title="Legacy and Lessons" icon="📜" borderColor={GREEN}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#94a3b8', marginBottom: 24 }}>
            The Great Depression didn't just reshape the 1930s — it reshaped how the world
            thinks about economics, government, and crisis response. Its lessons have been applied
            in every major economic downturn since.
          </p>
          <InsightGrid items={LEGACY_INSIGHTS} accentColor={GREEN} />
        </SectionWrapper>

        {/* ── Bottom nav ────────────────────────────────────────────── */}
        <div style={{ marginTop: 64, textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            ← Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
