/**
 * IndustrialRevolutionPage — deep-dive into the Industrial Revolution (1760–1914).
 *
 * Route: /industrial-revolution
 *
 * Sections:
 *  1. Hero — title, subtitle, key stats
 *  2. Filter bar — category filters (sticky)
 *  3. Timeline — 30+ milestones with category badges
 *  4. Key Themes — child labor, urbanization, life expectancy, labor movement
 *  5. Global Spread — decade-by-decade narrative
 *  6. Environmental Cost — early pollution
 *  7. Before vs After — interactive comparisons
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type EventCategory = 'Technology' | 'Transport' | 'Political' | 'Economic' | 'Social' | 'Cultural';

interface IndustrialEvent {
  year: string;
  title: string;
  description: string;
  category: EventCategory;
  figure?: string;
}

interface ComparisonItem {
  metric: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}

interface SpreadEntry {
  country: string;
  decade: string;
  detail: string;
}

interface ThemeSection {
  title: string;
  icon: string;
  stat: string;
  statLabel: string;
  body: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STAGGER = 0.04;

const CATEGORY_COLORS: Record<EventCategory, string> = {
  Technology: '#3b82f6',
  Transport: '#f59e0b',
  Political: '#a855f7',
  Economic: '#22c55e',
  Social: '#ef4444',
  Cultural: '#ec4899',
};

const CATEGORY_ICONS: Record<EventCategory, string> = {
  Technology: '⚙️',
  Transport: '🚂',
  Political: '🏛️',
  Economic: '💰',
  Social: '✊',
  Cultural: '🎨',
};

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const EVENTS: IndustrialEvent[] = [
  { year: '1764', title: 'Spinning Jenny', description: 'Hargreaves invents a multi-spindle spinning frame — 8 threads at once. Launches the textile revolution and factory system.', category: 'Technology', figure: 'James Hargreaves' },
  { year: '1769', title: 'Watt Steam Engine', description: 'James Watt patents the separate condensing steam engine. Dramatically more efficient than Newcomen\'s, it unlocks mechanized manufacturing, mining, and transport.', category: 'Technology', figure: 'James Watt' },
  { year: '1779', title: 'First Iron Bridge', description: 'The world\'s first major bridge made of cast iron opens at Coalbrookdale, Shropshire — proof that iron can replace wood and stone as a structural material.', category: 'Technology' },
  { year: '1785', title: 'Power Loom', description: 'Edmund Cartwright patents the power loom, mechanizing weaving. Combined with the spinning jenny, it completes the automation of textile production.', category: 'Technology', figure: 'Edmund Cartwright' },
  { year: '1789', title: 'French Revolution', description: 'Political upheaval in France runs alongside economic transformation. The revolutionary ideals of liberty and equality spread, reshaping governance across Europe.', category: 'Political' },
  { year: '1793', title: 'Cotton Gin', description: 'Eli Whitney\'s cotton gin separates seeds from fiber 50× faster than by hand. Seeds the American cotton industry — and tragically intensifies plantation slavery.', category: 'Technology', figure: 'Eli Whitney' },
  { year: '1799', title: 'Combination Acts', description: 'British Parliament bans trade unions and collective bargaining. Workers who organize face prosecution — the acts remain until 1824.', category: 'Political' },
  { year: '1804', title: 'First Railway Locomotive', description: 'Richard Trevithick runs the first full-scale steam locomotive on rails at Penydarren ironworks in Wales. The age of rail begins.', category: 'Transport', figure: 'Richard Trevithick' },
  { year: '1811', title: 'Luddite Movement Begins', description: 'English textile workers smash stocking frames and power looms to protest mechanization and wage cuts. Proto-labor rights movement (1811–1816).', category: 'Social' },
  { year: '1825', title: 'Stockton–Darlington Railway', description: 'The world\'s first public railway to use steam locomotives opens in northeast England. Carries both freight and passengers.', category: 'Transport' },
  { year: '1829', title: 'Stephenson\'s Rocket', description: 'George Stephenson\'s Rocket wins the Rainhill Trials, proving steam locomotives viable for the Liverpool–Manchester Railway — the first intercity line.', category: 'Transport', figure: 'George Stephenson' },
  { year: '1833', title: 'Factory Act', description: 'First effective British Factory Act limits child labor: no children under 9 in textile mills, maximum 8 hours for ages 9–13. The beginning of labor regulation.', category: 'Political' },
  { year: '1837', title: 'Electric Telegraph', description: 'Cooke and Wheatstone patent the electric telegraph in Britain. For the first time, information moves faster than a person or animal can carry it.', category: 'Technology', figure: 'Cooke & Wheatstone' },
  { year: '1839', title: 'First Photograph', description: 'Louis Daguerre announces the daguerreotype process — the first practical photographic method. Visual documentation of the world begins.', category: 'Cultural', figure: 'Louis Daguerre' },
  { year: '1842', title: 'Mines Act', description: 'British Parliament bans women and children under 10 from working underground in coal mines, after a royal commission exposes horrific conditions.', category: 'Political' },
  { year: '1844', title: 'Rochdale Pioneers', description: 'Twenty-eight weavers in Rochdale open the first successful consumer cooperative, establishing principles still used by co-ops worldwide.', category: 'Economic' },
  { year: '1848', title: 'Communist Manifesto', description: 'Marx and Engels publish The Communist Manifesto — a direct response to the misery of industrial working conditions. "Workers of the world, unite!"', category: 'Political', figure: 'Marx & Engels' },
  { year: '1851', title: 'Great Exhibition', description: 'The Crystal Palace in London hosts the Great Exhibition — 6 million visitors tour 100,000+ exhibits showcasing industrial achievement from around the world.', category: 'Cultural' },
  { year: '1856', title: 'Bessemer Steel Process', description: 'Henry Bessemer patents a way to mass-produce steel cheaply. Within decades, steel replaces iron — enabling railways, bridges, skyscrapers, and warships.', category: 'Technology', figure: 'Henry Bessemer' },
  { year: '1859', title: 'First Oil Well', description: 'Edwin Drake drills the first commercial oil well at Titusville, Pennsylvania. The petroleum age begins — the fuel of the Second Industrial Revolution.', category: 'Economic', figure: 'Edwin Drake' },
  { year: '1863', title: 'London Underground Opens', description: 'The Metropolitan Railway opens — the world\'s first underground railway. Carries 38,000 passengers on its first day.', category: 'Transport' },
  { year: '1869', title: 'Suez Canal Opens', description: 'The 193-km canal connects the Mediterranean to the Red Sea, cutting the London-to-Bombay voyage by 7,000 km. Transforms global trade routes.', category: 'Economic' },
  { year: '1869', title: 'Transcontinental Railroad', description: 'The golden spike joins the Central Pacific and Union Pacific at Promontory Summit, Utah. The American continent is connected coast to coast by rail.', category: 'Transport' },
  { year: '1870', title: 'Standard Oil Founded', description: 'John D. Rockefeller incorporates Standard Oil of Ohio. Within a decade it controls 90% of US refining — the first modern monopoly.', category: 'Economic', figure: 'John D. Rockefeller' },
  { year: '1870–1914', title: 'Second Industrial Revolution', description: 'A new wave of industrialization driven by electricity, chemicals, and steel. The internal combustion engine, telephone, and radio transform daily life.', category: 'Technology' },
  { year: '1878', title: 'First Telephone Exchange', description: 'The first commercial telephone exchange opens in New Haven, Connecticut with 21 subscribers. By 1900 there are 600,000 phones in the US.', category: 'Technology' },
  { year: '1879', title: 'Edison\'s Lightbulb', description: 'Thomas Edison demonstrates a practical incandescent lightbulb that lasts 1,200 hours. Artificial lighting begins to transform work, leisure, and daily rhythms.', category: 'Technology', figure: 'Thomas Edison' },
  { year: '1886', title: 'Haymarket Affair', description: 'A labor rally in Chicago turns deadly when a bomb kills police and workers. The incident galvanizes the international labor movement and the fight for the 8-hour day.', category: 'Social' },
  { year: '1889', title: 'Eiffel Tower', description: 'Gustave Eiffel\'s 300m iron lattice tower opens for the Paris Exposition. Built from 18,038 pieces of wrought iron — a monument to industrial engineering.', category: 'Cultural', figure: 'Gustave Eiffel' },
  { year: '1903', title: 'Wright Brothers\' Flight', description: 'Orville and Wilbur Wright achieve powered flight at Kitty Hawk — 12 seconds, 37 meters. The conquest of the air begins.', category: 'Transport', figure: 'Wright Brothers' },
  { year: '1908', title: 'Ford Model T', description: 'Henry Ford introduces the Model T and the moving assembly line. Production time drops from 12 hours to 93 minutes per car. Mass production is born.', category: 'Economic', figure: 'Henry Ford' },
  { year: '1911', title: 'Triangle Shirtwaist Fire', description: '146 garment workers — mostly young immigrant women — die in a New York factory fire. Locked doors and no fire escapes. Catalyzes the American labor movement.', category: 'Social' },
];

const THEMES: ThemeSection[] = [
  {
    title: 'Child Labor',
    icon: '👧',
    stat: '1.75M',
    statLabel: 'children in US factories by 1900',
    body: 'Children as young as 5 worked 12–16 hour days in textile mills, mines, and factories. In Britain, the 1833 Factory Act was the first attempt at regulation, but enforcement was weak. "Breaker boys" picked slate from coal for pennies. Chimney sweeps developed scrotal cancer. Not until the early 1900s did meaningful child labor laws take hold.',
  },
  {
    title: 'Urbanization',
    icon: '🏙️',
    stat: '1M → 6.7M',
    statLabel: 'London population 1800–1900',
    body: 'Industrialization drove the greatest migration in human history — from countryside to city. Manchester grew from 25,000 to 300,000 in 50 years. Workers packed into slums with no sanitation, clean water, or ventilation. Cholera epidemics killed thousands. Yet the city also brought opportunity, culture, and community.',
  },
  {
    title: 'Life Expectancy',
    icon: '💀',
    stat: '28 years',
    statLabel: 'average in Manchester, 1840s',
    body: 'Life expectancy in industrial cities actually FELL during early industrialization. Manchester\'s average was just 28 years in the 1840s — compared to 38 in rural areas. Factory accidents, pollution, overcrowding, and disease took an enormous toll. A child born in a Liverpool slum had a 50% chance of dying before age 5.',
  },
  {
    title: 'The Labor Movement',
    icon: '✊',
    stat: '250,000+',
    statLabel: 'trade union members in UK by 1874',
    body: 'Workers fought back. The Combination Acts (1799) made unions illegal, but workers organized anyway. The Chartists demanded voting rights. The 8-hour movement spread globally. The Haymarket affair (1886) and Triangle fire (1911) became rallying cries. By the early 1900s, unions had won the right to strike, bargain collectively, and elect representatives.',
  },
];

const GLOBAL_SPREAD: SpreadEntry[] = [
  { country: '🇬🇧 Britain', decade: '1760s', detail: 'Origin — textile mills, steam power, canal networks. "Workshop of the world."' },
  { country: '🇧🇪 Belgium', decade: '1790s', detail: 'First on the continent. Rich coal and iron deposits, plus proximity to Britain.' },
  { country: '🇫🇷 France', decade: '1820s', detail: 'Slower start due to revolution and wars. Silk industry in Lyon, railways from 1842.' },
  { country: '🇩🇪 Germany', decade: '1840s', detail: 'Zollverein (customs union) unifies markets. Krupp steel and Rhine-Ruhr industrial belt.' },
  { country: '🇺🇸 United States', decade: '1850s', detail: 'Transcontinental railroad, mass immigration, Rockefeller oil, Carnegie steel. Overtakes Britain by 1900.' },
  { country: '🇯🇵 Japan', decade: '1870s', detail: 'Meiji Restoration drives rapid modernization. Government-built model factories, railways by 1872.' },
  { country: '🇷🇺 Russia', decade: '1890s', detail: 'Late industrialization under Witte. Trans-Siberian Railway (1891–1916). Industrial workers fuel 1905 and 1917 revolutions.' },
];

const ENVIRONMENTAL: { title: string; detail: string }[] = [
  { title: 'Black Snow', detail: 'Coal smoke turned snow black in industrial cities. London\'s Great Smog (precursors from the 1800s) killed thousands.' },
  { title: 'Rivers on Fire', detail: 'The Cuyahoga River in Cleveland was so polluted with industrial waste it caught fire — multiple times, starting in 1868.' },
  { title: 'Deforestation', detail: 'Britain stripped its forests for charcoal before switching to coal. Entire landscapes were transformed within decades.' },
  { title: 'Air Pollution', detail: 'The term "smog" was coined in 1905. Industrial cities had measurably lower sunlight and higher mortality from respiratory disease.' },
];

const COMPARISONS: ComparisonItem[] = [
  { metric: 'London → Edinburgh travel time', before: '4 days', after: '8 hours', beforeLabel: 'By horse (1750)', afterLabel: 'By train (1870)' },
  { metric: 'Cotton cloth price', before: '38 shillings/lb', after: '2 shillings/lb', beforeLabel: 'Hand-spun (1786)', afterLabel: 'Machine-made (1807)' },
  { metric: 'Working hours per week', before: '~80 hours', after: '~56 hours', beforeLabel: 'Factory (1830s)', afterLabel: 'After reform (1900s)' },
  { metric: 'Population in farming', before: '75%', after: '25%', beforeLabel: 'Britain (1760)', afterLabel: 'Britain (1900)' },
  { metric: 'Letters delivered (UK/year)', before: '76 million', after: '2.3 billion', beforeLabel: 'Before penny post (1839)', afterLabel: 'By 1900' },
  { metric: 'Iron production (UK tons/year)', before: '28,000', after: '9 million', beforeLabel: '1760', afterLabel: '1900' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{
      padding: '32px 32px 28px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <h2 style={{
        fontSize: 13,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      padding: '10px 16px',
      borderRadius: 8,
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.08)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
        {value}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginTop: 2,
      }}>
        {label}
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{
      padding: '48px 32px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, transparent 100%)',
    }}>
      <Link to="/" style={{
        fontSize: 13,
        color: '#64748b',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 24,
      }}>
        ← Back to Timeline
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 40 }}>⚙️</span>
        <div>
          <h1 style={{
            fontSize: 'clamp(24px, 4.5vw, 42px)',
            fontWeight: 800,
            color: '#f1f5f9',
            lineHeight: 1.15,
            margin: 0,
          }}>
            The Machine Age
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: '#94a3b8',
            marginTop: 6,
            margin: '6px 0 0',
            lineHeight: 1.4,
          }}>
            How Industry Changed Everything (1760–1914)
          </p>
        </div>
      </div>

      <p style={{
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 1.7,
        maxWidth: 680,
        margin: '0 0 24px',
      }}>
        In 150 years, humanity went from hand looms to assembly lines, horse carts to
        locomotives, candlelight to electric bulbs. The Industrial Revolution didn't just
        change how things were made — it remade society, politics, and the planet itself.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10,
      }}>
        <StatBadge value="1760–1914" label="Span" />
        <StatBadge value="30+" label="Milestones" />
        <StatBadge value="7" label="Nations Transformed" />
        <StatBadge value="6.7M" label="London Population by 1900" />
      </div>
    </section>
  );
}

function FilterBar({ selected, onSelect }: { selected: EventCategory | 'All'; onSelect: (c: EventCategory | 'All') => void }) {
  const categories: (EventCategory | 'All')[] = ['All', 'Technology', 'Transport', 'Political', 'Economic', 'Social', 'Cultural'];

  return (
    <div style={{
      padding: '16px 32px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: 'rgba(7,14,34,0.95)',
      backdropFilter: 'blur(12px)',
    }}>
      {categories.map((c) => {
        const active = selected === c;
        const color = c === 'All' ? '#64748b' : CATEGORY_COLORS[c];
        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
              backgroundColor: active ? `${color}22` : 'transparent',
              color: active ? color : '#94a3b8',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'all 0.15s ease',
            }}
          >
            {c !== 'All' && <span style={{ fontSize: 13 }}>{CATEGORY_ICONS[c]}</span>}
            {c}
          </button>
        );
      })}
    </div>
  );
}

function EventCard({ event, index }: { event: IndustrialEvent; index: number }) {
  const color = CATEGORY_COLORS[event.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * STAGGER, duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Year */}
      <div style={{
        minWidth: 80,
        fontFamily: 'monospace',
        fontSize: 13,
        fontWeight: 700,
        color: '#94a3b8',
        textAlign: 'right',
        paddingTop: 2,
        flexShrink: 0,
      }}>
        {event.year}
      </div>

      {/* Timeline dot + line */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        paddingTop: 6,
      }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}66`,
          flexShrink: 0,
        }} />
        <div style={{
          width: 2,
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.06)',
          marginTop: 4,
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color,
            backgroundColor: `${color}18`,
            padding: '2px 8px',
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {CATEGORY_ICONS[event.category]} {event.category}
          </span>
          {event.figure && (
            <span style={{ fontSize: 12, color: '#64748b' }}>
              {event.figure}
            </span>
          )}
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>
          {event.title}
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
          {event.description}
        </p>
      </div>
    </motion.div>
  );
}

function ThemesSection() {
  return (
    <SectionWrapper title="Key Themes" icon="📊">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {THEMES.map((theme, i) => (
          <motion.div
            key={theme.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>{theme.icon}</span>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  {theme.title}
                </h3>
              </div>
            </div>

            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.15)',
              marginBottom: 12,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>
                {theme.stat}
              </div>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginTop: 2,
              }}>
                {theme.statLabel}
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              {theme.body}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function GlobalSpreadSection() {
  return (
    <SectionWrapper title="Global Spread — Decade by Decade" icon="🌍">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        Industrialization radiated outward from Britain over 130 years. Each nation adapted the model to local resources, politics, and culture.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {GLOBAL_SPREAD.map((entry, i) => (
          <motion.div
            key={entry.country}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
            style={{
              display: 'flex',
              gap: 16,
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              minWidth: 60,
              fontFamily: 'monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#f59e0b',
              textAlign: 'right',
              flexShrink: 0,
              paddingTop: 1,
            }}>
              {entry.decade}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              paddingTop: 4,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#f59e0b',
                flexShrink: 0,
              }} />
              <div style={{
                width: 2,
                flex: 1,
                backgroundColor: 'rgba(245,158,11,0.2)',
                marginTop: 4,
                minHeight: 20,
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>
                {entry.country}
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>
                {entry.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function EnvironmentalSection() {
  return (
    <SectionWrapper title="Environmental Cost" icon="🏭">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        The Industrial Revolution was the beginning of humanity's large-scale environmental impact.
        Before climate change was understood, the damage was already visible — and sometimes flammable.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {ENVIRONMENTAL.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.12)',
            }}
          >
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', margin: '0 0 6px' }}>
              {item.title}
            </h4>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              {item.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

function BeforeAfterSection() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const toggle = (idx: number) => {
    setFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <SectionWrapper title="Before vs. After — The Revolution in Numbers" icon="📈">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
        Click any card to flip between the pre-industrial and industrial world.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 14,
      }}>
        {COMPARISONS.map((item, i) => {
          const isFlipped = flipped[i] ?? false;
          return (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
              onClick={() => toggle(i)}
              style={{
                padding: 20,
                borderRadius: 10,
                backgroundColor: isFlipped ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isFlipped ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                userSelect: 'none',
              }}
            >
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 10,
              }}>
                {item.metric}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isFlipped ? 'after' : 'before'}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: isFlipped ? '#3b82f6' : '#f59e0b',
                    fontFamily: 'monospace',
                  }}>
                    {isFlipped ? item.after : item.before}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: '#94a3b8',
                    marginTop: 4,
                  }}>
                    {isFlipped ? item.afterLabel : item.beforeLabel}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{
                fontSize: 11,
                color: '#475569',
                marginTop: 10,
                fontStyle: 'italic',
              }}>
                {isFlipped ? '← click to see before' : 'click to see after →'}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function IndustrialRevolutionPage() {
  const [filter, setFilter] = useState<EventCategory | 'All'>('All');

  const filteredEvents = useMemo(
    () => filter === 'All' ? EVENTS : EVENTS.filter((e) => e.category === filter),
    [filter],
  );

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
    <PageShell>
      <HeroSection />
      <FilterBar selected={filter} onSelect={setFilter} />

      {/* Timeline */}
      <SectionWrapper title={`Timeline — ${filteredEvents.length} Milestones`} icon="📅">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filteredEvents.map((event, i) => (
              <EventCard key={`${event.year}-${event.title}`} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </SectionWrapper>

      <ThemesSection />
      <GlobalSpreadSection />
      <EnvironmentalSection />
      <BeforeAfterSection />

      {/* Footer nav */}
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <Link to="/" style={{
          fontSize: 13,
          color: '#64748b',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}>
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
