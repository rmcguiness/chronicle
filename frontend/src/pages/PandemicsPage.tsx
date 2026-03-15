/**
 * PandemicsPage — "History's Great Plagues — How Disease Shaped Civilization"
 *
 * Route: /pandemics
 *
 * Features:
 *  - Hero with stats (total deaths, pandemics count, worst pandemic)
 *  - Horizontal timeline of pandemics by century
 *  - Death Toll Comparison bar chart (log scale)
 *  - Filter by era, severity, pathogen type
 *  - Pandemic cards with details, severity badge, Chronicle event links
 *  - "What We Learned" section
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Pandemic {
  slug: string;
  name: string;
  year_start: number;
  year_end: number | null;
  year_display: string;
  pathogen: string;
  pathogen_type: string;
  deaths_estimate: string;
  deaths_number: number;
  world_population_then: number;
  pct_world_population: number;
  geographic_spread: string[];
  spread_how: string;
  what_stopped_it: string;
  historical_impact: string;
  mortality_rate: string;
  severity: string;
  era: string;
  chronicle_query: string;
  db_event_count: number;
  db_event_slugs: string[];
}

// ── Hardcoded data ───────────────────────────────────────────────────────────

const PANDEMICS: Pandemic[] = [
  {
    slug: 'plague-of-athens',
    name: 'Plague of Athens',
    year_start: -430,
    year_end: -426,
    year_display: '430–426 BCE',
    pathogen: 'Unknown (possibly typhoid fever)',
    pathogen_type: 'unknown',
    deaths_estimate: '~75,000–100,000',
    deaths_number: 100000,
    world_population_then: 150000000,
    pct_world_population: 0.07,
    geographic_spread: ['Athens', 'Greece'],
    spread_how: "Overcrowding during the Peloponnesian War — refugees packed inside Athens' walls created perfect conditions.",
    what_stopped_it: 'Burned itself out after ~4 years as the susceptible population shrank.',
    historical_impact: "Killed Pericles, weakened Athens fatally during the Peloponnesian War. Thucydides' account is the first detailed clinical description of an epidemic.",
    mortality_rate: '~25%',
    severity: 'Significant',
    era: 'Ancient',
    chronicle_query: 'Plague of Athens',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'antonine-plague',
    name: 'Antonine Plague',
    year_start: 165,
    year_end: 180,
    year_display: '165–180 CE',
    pathogen: 'Possibly smallpox or measles',
    pathogen_type: 'viral',
    deaths_estimate: '~5 million',
    deaths_number: 5000000,
    world_population_then: 200000000,
    pct_world_population: 2.5,
    geographic_spread: ['Roman Empire', 'Mediterranean', 'Western Europe'],
    spread_how: 'Brought back by Roman soldiers returning from campaigns in Mesopotamia. Spread along trade routes.',
    what_stopped_it: 'Subsided after ~15 years as immunity built in surviving populations.',
    historical_impact: 'Killed Emperor Lucius Verus and possibly Marcus Aurelius. Weakened the Roman military and contributed to the Crisis of the Third Century.',
    mortality_rate: '~25–33%',
    severity: 'Devastating',
    era: 'Ancient',
    chronicle_query: 'Antonine Plague',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'plague-of-cyprian',
    name: 'Plague of Cyprian',
    year_start: 249,
    year_end: 262,
    year_display: '249–262 CE',
    pathogen: 'Unknown (possibly viral hemorrhagic fever)',
    pathogen_type: 'unknown',
    deaths_estimate: '~5,000/day at peak in Rome',
    deaths_number: 1000000,
    world_population_then: 200000000,
    pct_world_population: 0.5,
    geographic_spread: ['Roman Empire', 'North Africa', 'Mediterranean'],
    spread_how: 'Person-to-person transmission across the Roman Empire\'s interconnected cities and military camps.',
    what_stopped_it: 'Burned out over ~13 years. The empire was left severely depopulated.',
    historical_impact: 'Accelerated the decline of the Roman Empire. Boosted Christianity as pagans fled while Christians cared for the sick.',
    mortality_rate: 'Unknown — extremely high at peak',
    severity: 'Significant',
    era: 'Ancient',
    chronicle_query: 'Plague of Cyprian',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'justinian-plague',
    name: 'Plague of Justinian',
    year_start: 541,
    year_end: 549,
    year_display: '541–549 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogen_type: 'bacterial',
    deaths_estimate: '25–50 million',
    deaths_number: 30000000,
    world_population_then: 200000000,
    pct_world_population: 15.0,
    geographic_spread: ['Byzantine Empire', 'Mediterranean', 'Middle East', 'Europe'],
    spread_how: 'Carried by fleas on rats via grain ships from Egypt. Spread along trade routes.',
    what_stopped_it: 'Recurred in waves until ~750 CE. Initial outbreak subsided as susceptible populations died.',
    historical_impact: "Derailed Emperor Justinian's reconquest of the Western Roman Empire. Weakened Byzantium so severely it could not resist Arab conquests a century later. First recorded bubonic plague pandemic.",
    mortality_rate: '~40–60%',
    severity: 'Devastating',
    era: 'Medieval',
    chronicle_query: 'Plague of Justinian',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'black-death',
    name: 'Black Death',
    year_start: 1347,
    year_end: 1351,
    year_display: '1347–1351',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogen_type: 'bacterial',
    deaths_estimate: '75–200 million',
    deaths_number: 100000000,
    world_population_then: 390000000,
    pct_world_population: 40.0,
    geographic_spread: ['Europe', 'Middle East', 'North Africa', 'Central Asia'],
    spread_how: 'Flea-infested rats on trade ships from Crimea. Spread via fleas, pneumonic droplets, and contaminated goods.',
    what_stopped_it: "Subsided as 30–60% of Europe's population died. Quarantine practices began (Venice's 40-day isolation = 'quarantine').",
    historical_impact: 'Most devastating pandemic in history. Ended feudalism as surviving peasants demanded higher wages. Triggered pogroms against Jews. Inspired apocalyptic art (Dance of Death). Fundamentally restructured European society.',
    mortality_rate: '~30–60%',
    severity: 'Catastrophic',
    era: 'Medieval',
    chronicle_query: 'Black Death',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'smallpox-americas',
    name: 'Smallpox in the Americas',
    year_start: 1520,
    year_end: 1600,
    year_display: '1520s–1600s',
    pathogen: 'Variola major (smallpox virus)',
    pathogen_type: 'viral',
    deaths_estimate: '~56 million (90% of indigenous population)',
    deaths_number: 56000000,
    world_population_then: 500000000,
    pct_world_population: 11.0,
    geographic_spread: ['Mexico', 'Central America', 'South America', 'North America'],
    spread_how: 'Brought by European colonizers. Indigenous peoples had zero immunity to Old World diseases.',
    what_stopped_it: "Vaccination (Jenner, 1796) eventually led to smallpox eradication by 1980 — the only human disease ever eradicated.",
    historical_impact: 'Destroyed the Aztec and Inca empires more effectively than Spanish weapons. Enabled European colonization of two continents.',
    mortality_rate: '~80–90% in unexposed populations',
    severity: 'Catastrophic',
    era: 'Early Modern',
    chronicle_query: 'Smallpox Americas',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'great-plague-of-london',
    name: 'Great Plague of London',
    year_start: 1665,
    year_end: 1666,
    year_display: '1665–1666',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogen_type: 'bacterial',
    deaths_estimate: '~100,000',
    deaths_number: 100000,
    world_population_then: 500000000,
    pct_world_population: 0.02,
    geographic_spread: ['London', 'England'],
    spread_how: "Fleas on rats in London's crowded, unsanitary conditions.",
    what_stopped_it: "The Great Fire of London (1666) destroyed much of the city, including the rats and fleas.",
    historical_impact: "Last major plague in England. Newton fled to his estate and had his 'annus mirabilis' — developing calculus, optics, and gravity.",
    mortality_rate: '~30–40%',
    severity: 'Significant',
    era: 'Early Modern',
    chronicle_query: 'Great Plague London',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'first-cholera-pandemic',
    name: 'First Cholera Pandemic',
    year_start: 1817,
    year_end: 1824,
    year_display: '1817–1824',
    pathogen: 'Vibrio cholerae',
    pathogen_type: 'bacterial',
    deaths_estimate: '~100,000+',
    deaths_number: 100000,
    world_population_then: 1000000000,
    pct_world_population: 0.01,
    geographic_spread: ['India', 'Southeast Asia', 'Middle East', 'East Africa'],
    spread_how: 'Contaminated water and food. Spread along trade routes from the Ganges Delta.',
    what_stopped_it: 'An unusually cold winter in 1823–24 killed the bacteria in water sources.',
    historical_impact: 'First of seven cholera pandemics. Spurred the beginning of international health cooperation.',
    mortality_rate: '~40–60% untreated',
    severity: 'Significant',
    era: 'Modern',
    chronicle_query: 'Cholera Pandemic',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'third-cholera-pandemic',
    name: 'Third Cholera Pandemic',
    year_start: 1852,
    year_end: 1860,
    year_display: '1852–1860',
    pathogen: 'Vibrio cholerae',
    pathogen_type: 'bacterial',
    deaths_estimate: '~1 million+',
    deaths_number: 1000000,
    world_population_then: 1200000000,
    pct_world_population: 0.08,
    geographic_spread: ['Russia', 'Europe', 'Americas', 'Asia', 'Africa'],
    spread_how: 'Contaminated water supplies. Spread globally via shipping routes.',
    what_stopped_it: "John Snow proved cholera spread through water (Broad Street pump, 1854). Led to modern sewage systems.",
    historical_impact: "Deadliest cholera pandemic. John Snow's epidemiological work founded modern public health. Led to construction of modern sewage systems.",
    mortality_rate: '~50% untreated',
    severity: 'Severe',
    era: 'Modern',
    chronicle_query: 'Cholera Pandemic',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'russian-flu',
    name: 'Russian Flu',
    year_start: 1889,
    year_end: 1890,
    year_display: '1889–1890',
    pathogen: 'Likely influenza A (H3N8 or H2N2)',
    pathogen_type: 'viral',
    deaths_estimate: '~1 million',
    deaths_number: 1000000,
    world_population_then: 1500000000,
    pct_world_population: 0.07,
    geographic_spread: ['Russia', 'Europe', 'North America', 'worldwide'],
    spread_how: 'Respiratory droplets. Spread rapidly via railroad networks and steamship routes.',
    what_stopped_it: 'Burned through populations in waves over ~1 year. Built herd immunity.',
    historical_impact: "First pandemic of the industrial age. The telegraph enabled real-time reporting, creating the first 'media pandemic.'",
    mortality_rate: '~0.1–0.2%',
    severity: 'Severe',
    era: 'Modern',
    chronicle_query: 'Russian Flu 1889',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'spanish-flu',
    name: 'Spanish Flu',
    year_start: 1918,
    year_end: 1920,
    year_display: '1918–1920',
    pathogen: 'Influenza A virus (H1N1)',
    pathogen_type: 'viral',
    deaths_estimate: '50–100 million',
    deaths_number: 50000000,
    world_population_then: 1800000000,
    pct_world_population: 3.5,
    geographic_spread: ['Worldwide — every continent including remote Pacific islands and the Arctic'],
    spread_how: 'Respiratory droplets. WWI troop movements spread it globally. Wartime censorship suppressed reporting.',
    what_stopped_it: 'Virus mutated to less lethal form. Only quarantine, masks, and social distancing — identical to COVID-19 measures a century later.',
    historical_impact: 'Killed more people than WWI. Infected ~500 million (1/3 of world population). Led to establishment of public health ministries worldwide.',
    mortality_rate: '~2.5–10%',
    severity: 'Catastrophic',
    era: 'Modern',
    chronicle_query: 'Spanish Flu',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'asian-flu',
    name: 'Asian Flu',
    year_start: 1957,
    year_end: 1958,
    year_display: '1957–1958',
    pathogen: 'Influenza A virus (H2N2)',
    pathogen_type: 'viral',
    deaths_estimate: '1–4 million',
    deaths_number: 2000000,
    world_population_then: 2900000000,
    pct_world_population: 0.07,
    geographic_spread: ['China', 'Southeast Asia', 'worldwide'],
    spread_how: 'Respiratory droplets. Originated in Guizhou, China, spread globally via air travel.',
    what_stopped_it: 'Vaccine developed rapidly. The virus eventually became a seasonal flu strain.',
    historical_impact: "First pandemic to benefit from modern virology. WHO's global surveillance system proved its worth.",
    mortality_rate: '~0.3%',
    severity: 'Severe',
    era: 'Contemporary',
    chronicle_query: 'Asian Flu 1957',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'hong-kong-flu',
    name: 'Hong Kong Flu',
    year_start: 1968,
    year_end: 1969,
    year_display: '1968–1969',
    pathogen: 'Influenza A virus (H3N2)',
    pathogen_type: 'viral',
    deaths_estimate: '1–4 million',
    deaths_number: 1000000,
    world_population_then: 3500000000,
    pct_world_population: 0.04,
    geographic_spread: ['Hong Kong', 'Southeast Asia', 'worldwide'],
    spread_how: 'Respiratory droplets. US troops returning from Vietnam accelerated global spread.',
    what_stopped_it: 'Vaccine development and natural immunity. H3N2 persists as seasonal flu to this day.',
    historical_impact: 'Despite 1–4M deaths, received little attention — overshadowed by Vietnam War and social upheaval of the 1960s.',
    mortality_rate: '~0.1–0.2%',
    severity: 'Severe',
    era: 'Contemporary',
    chronicle_query: 'Hong Kong Flu 1968',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'hiv-aids',
    name: 'HIV/AIDS Pandemic',
    year_start: 1981,
    year_end: null,
    year_display: '1981–present',
    pathogen: 'Human Immunodeficiency Virus (HIV)',
    pathogen_type: 'viral',
    deaths_estimate: '40+ million (and counting)',
    deaths_number: 40000000,
    world_population_then: 4500000000,
    pct_world_population: 0.9,
    geographic_spread: ['Sub-Saharan Africa (hardest hit)', 'worldwide'],
    spread_how: 'Sexual contact, blood transfusion, shared needles. Crossed from chimpanzees to humans in Central Africa.',
    what_stopped_it: 'Still ongoing. Antiretroviral therapy transformed HIV from death sentence to manageable condition. ~39M living with HIV today.',
    historical_impact: 'Devastated sub-Saharan Africa. Transformed public health, LGBT rights, and drug development. Created modern global health infrastructure (PEPFAR, Global Fund).',
    mortality_rate: '~nearly 100% untreated; <1% with treatment',
    severity: 'Devastating',
    era: 'Contemporary',
    chronicle_query: 'HIV AIDS',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'sars',
    name: 'SARS',
    year_start: 2002,
    year_end: 2004,
    year_display: '2002–2004',
    pathogen: 'SARS-CoV-1 (coronavirus)',
    pathogen_type: 'viral',
    deaths_estimate: '774',
    deaths_number: 774,
    world_population_then: 6300000000,
    pct_world_population: 0.00001,
    geographic_spread: ['China', 'Hong Kong', 'Singapore', 'Canada'],
    spread_how: 'Respiratory droplets. A single infected doctor in a Hong Kong hotel seeded outbreaks in multiple countries.',
    what_stopped_it: 'Aggressive quarantine, contact tracing, and travel restrictions contained it before it could adapt.',
    historical_impact: 'Wake-up call for pandemic preparedness. Created the blueprint for coronavirus response — tragically, many lessons were forgotten by 2020.',
    mortality_rate: '~9.6%',
    severity: 'Significant',
    era: 'Contemporary',
    chronicle_query: 'SARS',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'h1n1-swine-flu',
    name: 'H1N1 Swine Flu',
    year_start: 2009,
    year_end: 2010,
    year_display: '2009–2010',
    pathogen: 'Influenza A virus (H1N1)pdm09',
    pathogen_type: 'viral',
    deaths_estimate: '150,000–575,000',
    deaths_number: 300000,
    world_population_then: 6800000000,
    pct_world_population: 0.005,
    geographic_spread: ['Mexico (origin)', 'United States', 'worldwide'],
    spread_how: 'Respiratory droplets. Novel H1N1 strain combining swine, avian, and human flu genes.',
    what_stopped_it: "Vaccine deployed within 6 months. Became a regular seasonal flu strain.",
    historical_impact: "First pandemic of the social media age. Its relative mildness led to 'overreaction' criticism — making the world more complacent when COVID-19 arrived.",
    mortality_rate: '~0.01–0.08%',
    severity: 'Significant',
    era: 'Contemporary',
    chronicle_query: 'H1N1 Swine Flu',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'ebola-west-africa',
    name: 'Ebola Outbreak (West Africa)',
    year_start: 2014,
    year_end: 2016,
    year_display: '2014–2016',
    pathogen: 'Ebola virus (Zaire ebolavirus)',
    pathogen_type: 'viral',
    deaths_estimate: '~11,325',
    deaths_number: 11325,
    world_population_then: 7200000000,
    pct_world_population: 0.0002,
    geographic_spread: ['Guinea', 'Liberia', 'Sierra Leone'],
    spread_how: 'Direct contact with bodily fluids. Traditional burial practices accelerated spread.',
    what_stopped_it: 'International response, behavior change, contact tracing. Vaccine (rVSV-ZEBOV) developed during the outbreak.',
    historical_impact: 'Largest Ebola outbreak in history. Exposed vulnerability of weak healthcare systems. Led to WHO reforms.',
    mortality_rate: '~40% (up to 90% in some outbreaks)',
    severity: 'Significant',
    era: 'Contemporary',
    chronicle_query: 'Ebola',
    db_event_count: 0,
    db_event_slugs: [],
  },
  {
    slug: 'covid-19',
    name: 'COVID-19 Pandemic',
    year_start: 2019,
    year_end: null,
    year_display: '2019–present',
    pathogen: 'SARS-CoV-2 (coronavirus)',
    pathogen_type: 'viral',
    deaths_estimate: '7+ million official (est. 15–25M excess deaths)',
    deaths_number: 7000000,
    world_population_then: 7800000000,
    pct_world_population: 0.09,
    geographic_spread: ['Worldwide — every country affected'],
    spread_how: 'Respiratory droplets and aerosols. Asymptomatic transmission made containment extremely difficult.',
    what_stopped_it: 'mRNA vaccines developed in record time (<1 year). Widespread immunity moved COVID to endemic phase.',
    historical_impact: "Defining event of the 2020s. Largest economic disruption since WWII. Accelerated remote work and mRNA vaccine technology. Exposed and deepened social inequalities.",
    mortality_rate: '~1–3% (varies by age, vaccination, variant)',
    severity: 'Devastating',
    era: 'Contemporary',
    chronicle_query: 'COVID-19',
    db_event_count: 0,
    db_event_slugs: [],
  },
];

// ── Color helpers ────────────────────────────────────────────────────────────

const SEVERITY_COLORS: Record<string, string> = {
  Catastrophic: '#ef4444',
  Devastating: '#f97316',
  Severe: '#eab308',
  Significant: '#3b82f6',
};

const ERA_COLORS: Record<string, string> = {
  Ancient: '#8b5cf6',
  Medieval: '#a855f7',
  'Early Modern': '#f59e0b',
  Modern: '#3b82f6',
  Contemporary: '#22c55e',
};

const PATHOGEN_COLORS: Record<string, string> = {
  bacterial: '#22c55e',
  viral: '#ef4444',
  unknown: '#6b7280',
  parasitic: '#eab308',
};

const PATHOGEN_LABELS: Record<string, string> = {
  bacterial: 'Bacterial',
  viral: 'Viral',
  unknown: 'Unknown',
  parasitic: 'Parasitic',
};

// ── Lessons learned data ─────────────────────────────────────────────────────

const LESSONS = [
  {
    title: 'Quarantine works — but only if imposed early',
    body: "Venice invented quarantine during the Black Death (1348). COVID-19 proved that early, decisive lockdowns (New Zealand, Taiwan) saved lives, while delayed responses (Italy, NYC) cost thousands.",
  },
  {
    title: 'Trade routes are disease highways',
    body: "From the Silk Road spreading the Justinian Plague to 747s spreading COVID-19, every expansion of human connectivity has been accompanied by faster pathogen spread. Globalization's greatest vulnerability is epidemiological.",
  },
  {
    title: 'Pandemics accelerate social change already underway',
    body: "The Black Death didn't create the end of feudalism — but it made it inevitable. COVID-19 didn't invent remote work — but it made it permanent. Pandemics compress decades of change into months.",
  },
  {
    title: 'Scapegoating is the default human response',
    body: "Jews during the Black Death. Asian Americans during COVID-19. Sex workers during HIV/AIDS. In every pandemic, society finds someone to blame — and the most vulnerable always suffer most.",
  },
  {
    title: 'We forget, and the next one is always a surprise',
    body: "The Spanish Flu killed 50–100M people and was almost entirely forgotten within a generation. SARS taught us exactly how to handle a coronavirus — and we ignored every lesson when COVID-19 arrived 16 years later.",
  },
];

// ── Helper components ────────────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const color = SEVERITY_COLORS[severity] || '#6b7280';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {severity}
    </span>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: 14,
        border: active ? `1px solid ${color}88` : '1px solid rgba(255,255,255,0.1)',
        background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
        color: active ? color : 'rgba(255,255,255,0.5)',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 150ms ease',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

// ── Death toll chart (log scale) ─────────────────────────────────────────────

function DeathTollChart({ pandemics }: { pandemics: Pandemic[] }) {
  const sorted = [...pandemics].sort((a, b) => b.deaths_number - a.deaths_number);
  const maxLog = Math.log10(Math.max(...sorted.map((p) => p.deaths_number)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sorted.map((p) => {
        const logVal = Math.log10(Math.max(p.deaths_number, 1));
        const widthPct = (logVal / maxLog) * 100;
        const color = SEVERITY_COLORS[p.severity] || '#3b82f6';
        return (
          <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 160,
                minWidth: 160,
                fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={p.name}
            >
              {p.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: 20 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.max(widthPct, 2)}%`,
                  background: `linear-gradient(90deg, ${color}66, ${color})`,
                  borderRadius: 4,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div
              style={{
                width: 100,
                minWidth: 100,
                fontSize: 11,
                color: 'rgba(255,255,255,0.6)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {p.deaths_number >= 1000000
                ? `${(p.deaths_number / 1000000).toFixed(0)}M`
                : p.deaths_number >= 1000
                  ? `${(p.deaths_number / 1000).toFixed(0)}K`
                  : p.deaths_number.toLocaleString()}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'right', marginTop: 4 }}>
        Logarithmic scale — each unit represents 10x more deaths
      </div>
    </div>
  );
}

// ── Horizontal timeline ──────────────────────────────────────────────────────

function TimelineBar({ pandemics }: { pandemics: Pandemic[] }) {
  const minYear = -500;
  const maxYear = 2030;
  const range = maxYear - minYear;

  const centuries = [];
  for (let y = -500; y <= 2000; y += 500) {
    centuries.push(y);
  }

  return (
    <div style={{ position: 'relative', padding: '30px 0 20px', overflowX: 'auto' }}>
      {/* Axis line */}
      <div
        style={{
          position: 'absolute',
          top: 58,
          left: 0,
          right: 0,
          height: 2,
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      {/* Century markers */}
      {centuries.map((y) => {
        const pct = ((y - minYear) / range) * 100;
        return (
          <div
            key={y}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: 60,
              fontSize: 9,
              color: 'rgba(255,255,255,0.3)',
              transform: 'translateX(-50%)',
            }}
          >
            {y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`}
          </div>
        );
      })}
      {/* Pandemic dots */}
      {pandemics.map((p) => {
        const midYear = p.year_end ? (p.year_start + p.year_end) / 2 : p.year_start;
        const pct = ((midYear - minYear) / range) * 100;
        const color = SEVERITY_COLORS[p.severity] || '#3b82f6';
        const size = p.severity === 'Catastrophic' ? 14 : p.severity === 'Devastating' ? 11 : p.severity === 'Severe' ? 9 : 7;
        return (
          <div
            key={p.slug}
            title={`${p.name} (${p.year_display}) — ${p.deaths_estimate}`}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: 58 - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              border: `2px solid ${color}`,
              boxShadow: `0 0 8px ${color}66`,
              transform: 'translateX(-50%)',
              cursor: 'pointer',
              zIndex: 2,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PandemicsPage() {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [eraFilter, setEraFilter] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [pathogenFilter, setPathogenFilter] = useState<string | null>(null);

  const eras = useMemo(() => [...new Set(PANDEMICS.map((p) => p.era))], []);
  const severities = ['Catastrophic', 'Devastating', 'Severe', 'Significant'];
  const pathogenTypes = useMemo(() => [...new Set(PANDEMICS.map((p) => p.pathogen_type))], []);

  const filtered = useMemo(() => {
    let list = PANDEMICS;
    if (eraFilter) list = list.filter((p) => p.era === eraFilter);
    if (severityFilter) list = list.filter((p) => p.severity === severityFilter);
    if (pathogenFilter) list = list.filter((p) => p.pathogen_type === pathogenFilter);
    return list;
  }, [eraFilter, severityFilter, pathogenFilter]);

  const stats = useMemo(() => {
    const top10 = [...PANDEMICS].sort((a, b) => b.deaths_number - a.deaths_number).slice(0, 10);
    const totalTop10 = top10.reduce((sum, p) => sum + p.deaths_number, 0);
    const worst = PANDEMICS.reduce((a, b) => (a.deaths_number > b.deaths_number ? a : b));
    return { totalTop10, worst, count: PANDEMICS.length };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: "'Inter', sans-serif",
        color: '#e2e8f0',
      }}
    >
      {/* ── Back link ── */}
      <div style={{ padding: '16px 24px' }}>
        <Link
          to="/"
          style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ← Back to Chronicle
        </Link>
      </div>

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '20px 24px 32px', maxWidth: 1200, margin: '0 auto' }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          Disease & Civilization
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
          History's Great Plagues
        </h1>
        <p style={{ fontSize: 16, color: '#94a3b8', marginTop: 8, maxWidth: 700, lineHeight: 1.6 }}>
          How Disease Shaped Civilization — from the Plague of Athens to COVID-19, a comprehensive timeline of 18 pandemics that changed the course of human history.
        </p>

        {/* Stats bar */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginTop: 24,
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Pandemics Tracked', value: stats.count.toString() },
            { label: 'Top 10 Combined Deaths', value: `${(stats.totalTop10 / 1_000_000).toFixed(0)}M+` },
            { label: 'Deadliest', value: stats.worst.name },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                padding: '12px 20px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>Pandemic Timeline</h2>
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>
            Dot size = severity. Hover for details.
          </p>
          <TimelineBar pandemics={PANDEMICS} />
        </motion.div>

        {/* ── Death Toll Chart ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: 32,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Death Toll Comparison</h2>
          <DeathTollChart pandemics={PANDEMICS} />
        </motion.div>

        {/* ── Filters ── */}
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            marginBottom: 24,
            padding: '16px 20px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6, letterSpacing: 0.8 }}>
              Era
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <FilterChip label="All" active={!eraFilter} color="#3b82f6" onClick={() => setEraFilter(null)} />
              {eras.map((e) => (
                <FilterChip
                  key={e}
                  label={e}
                  active={eraFilter === e}
                  color={ERA_COLORS[e] || '#3b82f6'}
                  onClick={() => setEraFilter(eraFilter === e ? null : e)}
                />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6, letterSpacing: 0.8 }}>
              Severity
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <FilterChip label="All" active={!severityFilter} color="#3b82f6" onClick={() => setSeverityFilter(null)} />
              {severities.map((s) => (
                <FilterChip
                  key={s}
                  label={s}
                  active={severityFilter === s}
                  color={SEVERITY_COLORS[s]}
                  onClick={() => setSeverityFilter(severityFilter === s ? null : s)}
                />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6, letterSpacing: 0.8 }}>
              Pathogen Type
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <FilterChip label="All" active={!pathogenFilter} color="#3b82f6" onClick={() => setPathogenFilter(null)} />
              {pathogenTypes.map((pt) => (
                <FilterChip
                  key={pt}
                  label={PATHOGEN_LABELS[pt] || pt}
                  active={pathogenFilter === pt}
                  color={PATHOGEN_COLORS[pt] || '#6b7280'}
                  onClick={() => setPathogenFilter(pathogenFilter === pt ? null : pt)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Pandemic cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((p, i) => {
            const expanded = expandedSlug === p.slug;
            const sevColor = SEVERITY_COLORS[p.severity] || '#3b82f6';
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.6) }}
              >
                <div
                  onClick={() => setExpandedSlug(expanded ? null : p.slug)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 10,
                    background: expanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${expanded ? `${sevColor}44` : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  {/* Card header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                        <SeverityBadge severity={p.severity} />
                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: `${PATHOGEN_COLORS[p.pathogen_type] || '#6b7280'}22`,
                            color: PATHOGEN_COLORS[p.pathogen_type] || '#6b7280',
                            fontWeight: 600,
                          }}
                        >
                          {PATHOGEN_LABELS[p.pathogen_type] || p.pathogen_type}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                        {p.year_display} · {p.pathogen}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: sevColor, fontVariantNumeric: 'tabular-nums' }}>
                        {p.deaths_estimate}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        ~{p.pct_world_population}% of world population
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 10, lineHeight: 1.5 }}>
                    {p.historical_impact}
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            marginTop: 16,
                            paddingTop: 16,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 16,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                              Geographic Spread
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                              {p.geographic_spread.join(', ')}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                              Mortality Rate
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                              {p.mortality_rate}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                              How It Spread
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                              {p.spread_how}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
                              What Stopped It
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                              {p.what_stopped_it}
                            </div>
                          </div>
                        </div>

                        {/* Chronicle link */}
                        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                          <Link
                            to={`/search?q=${encodeURIComponent(p.chronicle_query)}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 14px',
                              borderRadius: 8,
                              background: `${sevColor}18`,
                              border: `1px solid ${sevColor}44`,
                              color: sevColor,
                              fontSize: 12,
                              fontWeight: 600,
                              textDecoration: 'none',
                              transition: 'all 150ms ease',
                            }}
                          >
                            Find related Chronicle events
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: '#94a3b8',
              fontSize: 14,
            }}
          >
            No pandemics match the current filters.
          </div>
        )}

        {/* ── What We Learned ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: 48,
            padding: '28px 24px',
            borderRadius: 12,
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#fca5a5' }}>
            What History Taught Us About Pandemics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LESSONS.map((lesson, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    minWidth: 28,
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{lesson.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginTop: 4 }}>
                    {lesson.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer stat ── */}
        <div
          style={{
            marginTop: 32,
            textAlign: 'center',
            padding: '20px 0',
            color: '#94a3b8',
            fontSize: 13,
          }}
        >
          Top 10 pandemics combined: an estimated{' '}
          <span style={{ fontWeight: 700, color: '#ef4444', fontSize: 15 }}>
            {(stats.totalTop10 / 1_000_000).toFixed(0)} million
          </span>{' '}
          deaths — roughly {((stats.totalTop10 / 7_800_000_000) * 100).toFixed(1)}x today's world population equivalent.
        </div>
      </div>
    </div>
  );
}
