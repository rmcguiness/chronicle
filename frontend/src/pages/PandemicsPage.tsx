/**
 * PandemicsPage — dedicated explorer for historical pandemics and epidemics.
 *
 * Route: /pandemics
 *
 * Sections:
 *  1. Hero — "Plagues That Changed History" + horizontal timeline
 *  2. Death toll comparison (log-scale bar chart)
 *  3. Pandemic cards (filterable by era, pathogen, region)
 *  4. Pandemic response evolution timeline
 *  5. Lessons learned
 *  6. DB-sourced Chronicle events
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Pandemic {
  id: number;
  name: string;
  dateRange: string;
  startYear: number;
  endYear: number;
  isBce: boolean;
  deathTollLow: number;
  deathTollHigh: number;
  deathTollDisplay: string;
  pathogen: 'bacterial' | 'viral' | 'unknown' | 'parasitic';
  regionsAffected: string[];
  worldPopulationPercent: string;
  originLocation: string;
  howEnded: string;
  historicalImpact: string;
  silverLining: string;
  searchQuery: string;
  color: string;
}

interface DbEvent {
  id: string;
  slug: string;
  title: string;
  year_approx: number;
  importance_score: number;
  region: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pandemic data — 15 major historical pandemics
// ─────────────────────────────────────────────────────────────────────────────

const PANDEMICS: Pandemic[] = [
  {
    id: 1,
    name: 'Plague of Athens',
    dateRange: '430–426 BCE',
    startYear: -430,
    endYear: -426,
    isBce: true,
    deathTollLow: 75000,
    deathTollHigh: 100000,
    deathTollDisplay: '~100K',
    pathogen: 'unknown',
    regionsAffected: ['Greece', 'Eastern Mediterranean'],
    worldPopulationPercent: '~0.05%',
    originLocation: 'Ethiopia (via Egypt)',
    howEnded: 'Burned out — ran out of susceptible hosts',
    historicalImpact: 'Devastated Athens during the Peloponnesian War, killing up to 25% of the Athenian population including the great statesman Pericles. It weakened Athens militarily and politically, contributing to Sparta\'s eventual victory.',
    silverLining: 'Thucydides\' detailed account became one of the earliest epidemiological descriptions in history, influencing medical thinking for millennia.',
    searchQuery: 'Plague Athens',
    color: '#94a3b8',
  },
  {
    id: 2,
    name: 'Antonine Plague',
    dateRange: '165–180 CE',
    startYear: 165,
    endYear: 180,
    isBce: false,
    deathTollLow: 5000000,
    deathTollHigh: 5000000,
    deathTollDisplay: '~5M',
    pathogen: 'viral',
    regionsAffected: ['Roman Empire', 'Mediterranean', 'Western Europe'],
    worldPopulationPercent: '~2.5%',
    originLocation: 'Near East (brought by returning soldiers)',
    howEnded: 'Burned out after 15 years of waves',
    historicalImpact: 'Killed Emperor Lucius Verus and weakened Emperor Marcus Aurelius\' military campaigns. Decimated the Roman army and disrupted trade across the empire, marking the beginning of Rome\'s long decline.',
    silverLining: 'Galen\'s observations of the plague patients created foundational medical texts that were studied for 1,500 years, advancing understanding of infectious disease.',
    searchQuery: 'Antonine Plague',
    color: '#f87171',
  },
  {
    id: 3,
    name: 'Plague of Cyprian',
    dateRange: '249–262 CE',
    startYear: 249,
    endYear: 262,
    isBce: false,
    deathTollLow: 1000000,
    deathTollHigh: 5000000,
    deathTollDisplay: '1–5M',
    pathogen: 'unknown',
    regionsAffected: ['Roman Empire', 'North Africa'],
    worldPopulationPercent: '~1–2%',
    originLocation: 'Ethiopia or Egypt',
    howEnded: 'Burned out after 13 years',
    historicalImpact: 'At its height, 5,000 people died per day in Rome. The plague contributed to the Crisis of the Third Century, weakening Roman military capacity and enabling barbarian invasions.',
    silverLining: 'The Christian community\'s willingness to care for the sick during the plague — when pagans often abandoned their ill — helped Christianity grow dramatically in the Roman Empire.',
    searchQuery: 'Plague Cyprian',
    color: '#fb923c',
  },
  {
    id: 4,
    name: 'Justinian Plague',
    dateRange: '541–549 CE',
    startYear: 541,
    endYear: 549,
    isBce: false,
    deathTollLow: 25000000,
    deathTollHigh: 50000000,
    deathTollDisplay: '25–50M',
    pathogen: 'bacterial',
    regionsAffected: ['Byzantine Empire', 'Mediterranean', 'Persia', 'Western Europe'],
    worldPopulationPercent: '~13–26%',
    originLocation: 'Central Africa (via Egypt)',
    howEnded: 'Recurred in waves until ~750 CE, then subsided',
    historicalImpact: 'The first recorded bubonic plague pandemic. It killed up to half the population of the Byzantine Empire, ending Emperor Justinian\'s dream of reuniting the Roman Empire. It reshaped the balance of power in the Mediterranean world.',
    silverLining: 'The massive labor shortage that followed gave surviving peasants and workers significantly more bargaining power, foreshadowing similar dynamics after the Black Death.',
    searchQuery: 'Justinian Plague',
    color: '#a78bfa',
  },
  {
    id: 5,
    name: 'Black Death',
    dateRange: '1347–1351',
    startYear: 1347,
    endYear: 1351,
    isBce: false,
    deathTollLow: 75000000,
    deathTollHigh: 200000000,
    deathTollDisplay: '75–200M',
    pathogen: 'bacterial',
    regionsAffected: ['Europe', 'Asia', 'North Africa', 'Middle East'],
    worldPopulationPercent: '~30–60%',
    originLocation: 'Central Asia (Issyk-Kul region)',
    howEnded: 'Burned through populations; recurred in waves for centuries',
    historicalImpact: 'The deadliest pandemic in human history. It killed one-third to one-half of Europe\'s population in just four years, collapsing feudal economies, depopulating entire regions, and transforming European society irreversibly.',
    silverLining: 'The massive labor shortage ended serfdom, raised wages, and empowered the working class. It accelerated the end of feudalism, contributed to the Renaissance, and drove innovations in labor-saving technology.',
    searchQuery: 'Black Death',
    color: '#1e1e1e',
  },
  {
    id: 6,
    name: 'Cocoliztli Epidemic',
    dateRange: '1545–1548',
    startYear: 1545,
    endYear: 1548,
    isBce: false,
    deathTollLow: 5000000,
    deathTollHigh: 15000000,
    deathTollDisplay: '5–15M',
    pathogen: 'viral',
    regionsAffected: ['Mexico', 'Central America'],
    worldPopulationPercent: '~1–3%',
    originLocation: 'Likely introduced by Spanish colonizers',
    howEnded: 'Burned out after devastating indigenous populations',
    historicalImpact: 'One of the deadliest epidemics in the Americas, likely caused by a viral hemorrhagic fever. It killed up to 80% of the indigenous population of Mexico, completing the demographic collapse that began with the Spanish conquest.',
    silverLining: 'Modern genomic analysis of Cocoliztli victims has advanced our understanding of ancient pathogens, and the tragedy underscored the devastating impact of introducing diseases to immunologically naive populations.',
    searchQuery: 'Cocoliztli epidemic',
    color: '#22d3ee',
  },
  {
    id: 7,
    name: 'Great Plague of London',
    dateRange: '1665–1666',
    startYear: 1665,
    endYear: 1666,
    isBce: false,
    deathTollLow: 100000,
    deathTollHigh: 100000,
    deathTollDisplay: '~100K',
    pathogen: 'bacterial',
    regionsAffected: ['England'],
    worldPopulationPercent: '<0.02%',
    originLocation: 'Continental Europe (Netherlands)',
    howEnded: 'Great Fire of London (1666) destroyed rat habitats; quarantine measures',
    historicalImpact: 'Killed roughly 15% of London\'s population. The city implemented quarantine, marking houses of the infected. The subsequent Great Fire, while devastating, helped end the plague by destroying the densely packed slums where rats thrived.',
    silverLining: 'Isaac Newton, fleeing Cambridge for his family estate during the plague, had his "annus mirabilis" — developing calculus, optics, and the theory of gravity in isolation.',
    searchQuery: 'Great Plague London',
    color: '#64748b',
  },
  {
    id: 8,
    name: 'Great Plague of Marseille',
    dateRange: '1720–1722',
    startYear: 1720,
    endYear: 1722,
    isBce: false,
    deathTollLow: 100000,
    deathTollHigh: 100000,
    deathTollDisplay: '~100K',
    pathogen: 'bacterial',
    regionsAffected: ['France', 'Mediterranean coast'],
    worldPopulationPercent: '<0.02%',
    originLocation: 'Levant (via merchant ship Grand Saint-Antoine)',
    howEnded: 'Strict quarantine and a plague wall (Mur de la Peste)',
    historicalImpact: 'The last major bubonic plague outbreak in Western Europe. It killed roughly half of Marseille\'s population despite quarantine efforts. France built a physical plague wall across Provence to contain the spread.',
    silverLining: 'Demonstrated that quarantine and physical barriers could contain outbreaks, influencing future public health policy. The Mur de la Peste remains a monument to early epidemic control.',
    searchQuery: 'Plague Marseille 1720',
    color: '#818cf8',
  },
  {
    id: 9,
    name: '1820 Cholera Pandemic',
    dateRange: '1817–1824',
    startYear: 1817,
    endYear: 1824,
    isBce: false,
    deathTollLow: 100000,
    deathTollHigh: 500000,
    deathTollDisplay: '100K+',
    pathogen: 'bacterial',
    regionsAffected: ['India', 'Southeast Asia', 'Middle East', 'East Africa'],
    worldPopulationPercent: '<0.05%',
    originLocation: 'Jessore, Bengal (modern Bangladesh)',
    howEnded: 'Unusually cold winter of 1823–24 killed the bacteria in temperate zones',
    historicalImpact: 'The first of seven cholera pandemics that would span 150 years. It spread from India along trade routes to Southeast Asia, the Middle East, and East Africa, killing tens of thousands and demonstrating how global trade could carry disease.',
    silverLining: 'Cholera pandemics eventually led to John Snow\'s pioneering epidemiological work in 1854, founding modern epidemiology and proving the waterborne transmission theory.',
    searchQuery: 'cholera pandemic',
    color: '#2dd4bf',
  },
  {
    id: 10,
    name: 'Third Plague Pandemic',
    dateRange: '1855–1960',
    startYear: 1855,
    endYear: 1960,
    isBce: false,
    deathTollLow: 12000000,
    deathTollHigh: 15000000,
    deathTollDisplay: '~12M',
    pathogen: 'bacterial',
    regionsAffected: ['China', 'India', 'Global ports'],
    worldPopulationPercent: '~1%',
    originLocation: 'Yunnan province, China',
    howEnded: 'Antibiotics, pest control, and public health measures',
    historicalImpact: 'The third and final major bubonic plague pandemic spread from China to every inhabited continent via steamship trade routes. India was hardest hit, with over 10 million deaths. It persisted for over a century in various regions.',
    silverLining: 'Alexandre Yersin identified the plague bacterium (Yersinia pestis) in 1894 during this pandemic, and the rat-flea transmission route was proven — landmark achievements in germ theory and microbiology.',
    searchQuery: 'Third Plague Pandemic',
    color: '#f472b6',
  },
  {
    id: 11,
    name: 'Spanish Flu',
    dateRange: '1918–1920',
    startYear: 1918,
    endYear: 1920,
    isBce: false,
    deathTollLow: 50000000,
    deathTollHigh: 100000000,
    deathTollDisplay: '50–100M',
    pathogen: 'viral',
    regionsAffected: ['Global — every continent including Arctic'],
    worldPopulationPercent: '~3–5%',
    originLocation: 'Disputed — possibly Kansas, USA or a European staging area',
    howEnded: 'Herd immunity after infecting ~500M people (1/3 of world)',
    historicalImpact: 'The deadliest pandemic in modern history, killing more people than World War I which was still being fought. It infected one-third of the global population and struck in three devastating waves, with the second wave being the deadliest.',
    silverLining: 'Led to the creation of national public health ministries worldwide, established the importance of disease surveillance, and drove research into virology that would eventually enable flu vaccines.',
    searchQuery: 'Spanish Flu',
    color: '#ef4444',
  },
  {
    id: 12,
    name: 'Asian Flu',
    dateRange: '1957–1958',
    startYear: 1957,
    endYear: 1958,
    isBce: false,
    deathTollLow: 1000000,
    deathTollHigh: 4000000,
    deathTollDisplay: '1–4M',
    pathogen: 'viral',
    regionsAffected: ['Global'],
    worldPopulationPercent: '~0.04–0.14%',
    originLocation: 'Guizhou province, China',
    howEnded: 'Vaccine developed within months; virus mutated to less lethal form',
    historicalImpact: 'First pandemic where a vaccine was rapidly developed and deployed. The H2N2 virus spread globally within months but the death toll was limited by the speed of the public health response and vaccine production.',
    silverLining: 'Demonstrated that rapid vaccine development could significantly reduce pandemic mortality, establishing the template for modern pandemic response. Maurice Hilleman\'s vaccine work saved millions of lives.',
    searchQuery: 'Asian Flu 1957',
    color: '#fbbf24',
  },
  {
    id: 13,
    name: 'HIV/AIDS',
    dateRange: '1981–present',
    startYear: 1981,
    endYear: 2025,
    isBce: false,
    deathTollLow: 36000000,
    deathTollHigh: 42000000,
    deathTollDisplay: '36M+',
    pathogen: 'viral',
    regionsAffected: ['Global — Sub-Saharan Africa hardest hit'],
    worldPopulationPercent: '~0.5%',
    originLocation: 'Central Africa (crossed from chimpanzees ~1920s)',
    howEnded: 'Still ongoing — managed with antiretroviral therapy (ART)',
    historicalImpact: 'Has killed over 36 million people and roughly 39 million are currently living with HIV. Sub-Saharan Africa has been disproportionately affected, with some countries seeing life expectancy drop by 20 years at the peak of the epidemic.',
    silverLining: 'Transformed how the world funds global health (PEPFAR, Global Fund), advanced understanding of retroviruses, and antiretroviral therapy turned a death sentence into a manageable condition.',
    searchQuery: 'AIDS epidemic',
    color: '#dc2626',
  },
  {
    id: 14,
    name: 'SARS',
    dateRange: '2002–2004',
    startYear: 2002,
    endYear: 2004,
    isBce: false,
    deathTollLow: 774,
    deathTollHigh: 774,
    deathTollDisplay: '774',
    pathogen: 'viral',
    regionsAffected: ['China', 'Hong Kong', 'Southeast Asia', 'Canada'],
    worldPopulationPercent: '<0.001%',
    originLocation: 'Guangdong province, China',
    howEnded: 'Contained through aggressive quarantine and contact tracing',
    historicalImpact: 'Though the death toll was relatively small, SARS demonstrated how a novel coronavirus could spread rapidly via air travel. It exposed gaps in global disease surveillance and prompted major reforms in how the world prepares for pandemics.',
    silverLining: 'Led to the International Health Regulations (2005) reform, creation of pandemic preparedness frameworks, and research into coronavirus biology that proved crucial when COVID-19 emerged 17 years later.',
    searchQuery: 'SARS',
    color: '#a3e635',
  },
  {
    id: 15,
    name: 'COVID-19',
    dateRange: '2019–2023',
    startYear: 2019,
    endYear: 2023,
    isBce: false,
    deathTollLow: 6900000,
    deathTollHigh: 20000000,
    deathTollDisplay: '6.9M–20M',
    pathogen: 'viral',
    regionsAffected: ['Global — every country affected'],
    worldPopulationPercent: '~0.09–0.25%',
    originLocation: 'Wuhan, Hubei province, China',
    howEnded: 'Vaccines (including mRNA) + herd immunity; WHO ended emergency May 2023',
    historicalImpact: 'The defining crisis of the 21st century. Over 6.9 million confirmed deaths (with excess deaths estimated at 15–20 million). It shut down the global economy, accelerated remote work and digital transformation, and exposed deep inequalities in healthcare access worldwide.',
    silverLining: 'mRNA vaccine technology, developed in record time, proved revolutionary and is now being adapted for cancer, malaria, and other diseases. Telemedicine, remote work, and digital infrastructure advanced by a decade in months.',
    searchQuery: 'COVID-19',
    color: '#6366f1',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pandemic response milestones
// ─────────────────────────────────────────────────────────────────────────────

const RESPONSE_MILESTONES = [
  { year: 1347, label: 'Quarantine', description: 'Venice introduces 40-day isolation for ships (quarantina) during the Black Death' },
  { year: 1796, label: 'First Vaccine', description: 'Edward Jenner develops the smallpox vaccine using cowpox' },
  { year: 1854, label: 'Epidemiology', description: 'John Snow maps cholera cases in London, founding modern epidemiology' },
  { year: 1865, label: 'Germ Theory', description: 'Louis Pasteur proves that microorganisms cause disease' },
  { year: 1894, label: 'Plague Identified', description: 'Alexandre Yersin identifies Yersinia pestis, the plague bacterium' },
  { year: 1928, label: 'Antibiotics', description: 'Alexander Fleming discovers penicillin, launching the antibiotic era' },
  { year: 1948, label: 'WHO Founded', description: 'World Health Organization established for global disease surveillance' },
  { year: 1980, label: 'Smallpox Eradicated', description: 'WHO declares smallpox eradicated — the first (and only) human disease eliminated' },
  { year: 2005, label: 'IHR Reform', description: 'International Health Regulations revised after SARS, improving global response' },
  { year: 2021, label: 'mRNA Vaccines', description: 'Pfizer/BioNTech and Moderna mRNA COVID-19 vaccines deployed globally in record time' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Lessons learned
// ─────────────────────────────────────────────────────────────────────────────

const LESSONS = [
  {
    title: 'Quarantine Works — When Enforced Early',
    body: 'From Venice\'s 40-day quarantina in 1347 to Marseille\'s plague wall to COVID lockdowns, isolating the infected has consistently been the most effective first-response tool. The key lesson: acting early saves exponentially more lives than acting late.',
    icon: '🏥',
  },
  {
    title: 'Trade Routes Are Disease Highways',
    body: 'The Silk Road carried the Black Death. Steamships spread the Third Plague Pandemic. Air travel globalized SARS and COVID-19 in weeks. Every advance in human connectivity has also been an advance in pathogen mobility.',
    icon: '🛤',
  },
  {
    title: 'Pandemics Reshape Power Structures',
    body: 'The Black Death ended feudalism. The Plague of Athens cost Greece its golden age. COVID-19 accelerated remote work and exposed healthcare inequality. Pandemics don\'t just kill — they restructure economies, governments, and social contracts.',
    icon: '⚖',
  },
  {
    title: 'Science Accelerates Under Pressure',
    body: 'Germ theory emerged from cholera. Antibiotics from battlefield wounds. mRNA vaccines from a decade of quiet research suddenly funded at scale. Pandemics consistently drive the greatest leaps in medical science.',
    icon: '🔬',
  },
  {
    title: 'Preparation Beats Reaction',
    body: 'Countries that invested in pandemic preparedness after SARS (South Korea, Taiwan, Singapore) had dramatically better COVID-19 outcomes. The pattern repeats across centuries: societies that learn from one pandemic fare better in the next.',
    icon: '📋',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Filter options
// ─────────────────────────────────────────────────────────────────────────────

type EraFilter = 'all' | 'ancient' | 'medieval' | 'early-modern' | 'modern';
type PathogenFilter = 'all' | 'bacterial' | 'viral' | 'unknown';
type RegionFilter = 'all' | 'europe' | 'asia' | 'americas' | 'global';

const ERA_OPTIONS: { value: EraFilter; label: string }[] = [
  { value: 'all', label: 'All Eras' },
  { value: 'ancient', label: 'Ancient (pre-500 CE)' },
  { value: 'medieval', label: 'Medieval (500–1500)' },
  { value: 'early-modern', label: 'Early Modern (1500–1900)' },
  { value: 'modern', label: 'Modern (1900+)' },
];

const PATHOGEN_OPTIONS: { value: PathogenFilter; label: string }[] = [
  { value: 'all', label: 'All Pathogens' },
  { value: 'bacterial', label: 'Bacterial' },
  { value: 'viral', label: 'Viral' },
  { value: 'unknown', label: 'Unknown' },
];

const REGION_OPTIONS: { value: RegionFilter; label: string }[] = [
  { value: 'all', label: 'All Regions' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'americas', label: 'Americas' },
  { value: 'global', label: 'Global' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatDeathToll(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/** Log-scale width for death toll bars (range: 774 to 200M) */
function logBarWidth(value: number): number {
  const minLog = Math.log10(700);
  const maxLog = Math.log10(200_000_000);
  const pct = (Math.log10(Math.max(value, 1)) - minLog) / (maxLog - minLog);
  return Math.max(2, Math.min(100, pct * 100));
}

function matchesEra(p: Pandemic, era: EraFilter): boolean {
  if (era === 'all') return true;
  if (era === 'ancient') return p.startYear < 500;
  if (era === 'medieval') return p.startYear >= 500 && p.startYear < 1500;
  if (era === 'early-modern') return p.startYear >= 1500 && p.startYear < 1900;
  return p.startYear >= 1900;
}

function matchesPathogen(p: Pandemic, pathogen: PathogenFilter): boolean {
  if (pathogen === 'all') return true;
  return p.pathogen === pathogen;
}

function matchesRegion(p: Pandemic, region: RegionFilter): boolean {
  if (region === 'all') return true;
  const regions = p.regionsAffected.join(' ').toLowerCase();
  if (region === 'europe') return regions.includes('europe') || regions.includes('roman') || regions.includes('england') || regions.includes('france') || regions.includes('byzantine');
  if (region === 'asia') return regions.includes('asia') || regions.includes('china') || regions.includes('india') || regions.includes('hong kong');
  if (region === 'americas') return regions.includes('america') || regions.includes('mexico') || regions.includes('canada');
  return regions.includes('global') || regions.includes('every');
}

const PATHOGEN_COLORS: Record<string, string> = {
  bacterial: '#f59e0b',
  viral: '#ef4444',
  unknown: '#94a3b8',
  parasitic: '#22c55e',
};

const PATHOGEN_LABELS: Record<string, string> = {
  bacterial: 'Bacterial',
  viral: 'Viral',
  unknown: 'Unknown',
  parasitic: 'Parasitic',
};

// ─────────────────────────────────────────────────────────────────────────────
// API fetch
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL) ||
  'http://localhost:8000';

async function fetchPandemicEvents(): Promise<DbEvent[]> {
  const { data } = await axios.get(`${BASE_URL}/api/pandemics/events`);
  return data.events ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function PandemicsPage() {
  const [eraFilter, setEraFilter] = useState<EraFilter>('all');
  const [pathogenFilter, setPathogenFilter] = useState<PathogenFilter>('all');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: dbEvents = [] } = useQuery<DbEvent[]>({
    queryKey: ['pandemicEvents'],
    queryFn: fetchPandemicEvents,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(
    () => PANDEMICS.filter(p =>
      matchesEra(p, eraFilter) &&
      matchesPathogen(p, pathogenFilter) &&
      matchesRegion(p, regionFilter)
    ),
    [eraFilter, pathogenFilter, regionFilter],
  );

  // Sort by death toll high for the bar chart
  const sortedByDeathToll = useMemo(
    () => [...PANDEMICS].sort((a, b) => b.deathTollHigh - a.deathTollHigh),
    [],
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #070e22 0%, #0f1117 40%, #0d0d14 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      overflowX: 'hidden',
    }}>
      {/* ── Back nav ────────────────────────────────── */}
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 50 }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 13, fontWeight: 500,
          textDecoration: 'none',
          fontFamily: "'Inter', sans-serif",
          transition: 'all 150ms ease',
        }}>
          ← Back to Timeline
        </Link>
      </div>

      {/* ── Hero ────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          padding: '100px 24px 40px',
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h1 style={{
          fontSize: 48, fontWeight: 800, letterSpacing: -1,
          background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #22d3ee 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 12,
        }}>
          Plagues That Changed History
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.6 }}>
          From the Plague of Athens to COVID-19 — 2,500 years of pandemics that reshaped civilizations, toppled empires, and drove humanity&apos;s greatest medical breakthroughs.
        </p>

        {/* ── Horizontal timeline visualization ────── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 120,
          marginBottom: 20,
          overflow: 'hidden',
        }}>
          {/* Timeline axis */}
          <div style={{
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            height: 2,
            background: 'rgba(255,255,255,0.1)',
          }} />

          {/* Pandemic markers */}
          {PANDEMICS.map((p) => {
            // Map years to positions: -430 to 2023 → 2% to 98%
            const minYear = -500;
            const maxYear = 2050;
            const pct = ((p.startYear - minYear) / (maxYear - minYear)) * 96 + 2;
            const size = Math.max(8, Math.min(40, logBarWidth(p.deathTollHigh) * 0.4));

            return (
              <div
                key={p.id}
                title={`${p.name} (${p.dateRange}) — ${p.deathTollDisplay} deaths`}
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  top: 60 - size / 2,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: p.id === 5
                    ? 'linear-gradient(135deg, #ef4444, #991b1b)'
                    : `${p.color || '#3b82f6'}cc`,
                  border: expandedId === p.id ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transform: 'translateX(-50%)',
                  transition: 'all 200ms ease',
                  zIndex: expandedId === p.id ? 10 : 1,
                }}
              />
            );
          })}

          {/* Year labels */}
          {['-400 BCE', '1 CE', '500', '1000', '1500', '2000'].map((label, i) => (
            <span key={label} style={{
              position: 'absolute',
              top: 75,
              left: `${(i / 5) * 96 + 2}%`,
              transform: 'translateX(-50%)',
              fontSize: 10,
              color: '#475569',
              whiteSpace: 'nowrap',
            }}>
              {label}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: '#475569' }}>
          Bubble size = relative death toll. Click any bubble for details.
        </p>
      </motion.section>

      {/* ── Death Toll Comparison (log scale bar chart) ──── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          maxWidth: 1000,
          margin: '0 auto 60px',
          padding: '0 24px',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Death Toll Comparison
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
          Logarithmic scale — ranges from 774 (SARS) to 200 million (Black Death)
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sortedByDeathToll.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.03, duration: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{
                width: 170,
                fontSize: 13,
                color: '#94a3b8',
                textAlign: 'right',
                flexShrink: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {p.name}
              </span>
              <div style={{
                flex: 1,
                height: 24,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${logBarWidth(p.deathTollHigh)}%` }}
                  transition={{ delay: 0.5 + i * 0.04, duration: 0.8, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${PATHOGEN_COLORS[p.pathogen]}88, ${PATHOGEN_COLORS[p.pathogen]}cc)`,
                  }}
                />
                <span style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#e2e8f0',
                }}>
                  {p.deathTollDisplay}
                </span>
              </div>
              <span style={{
                width: 70,
                fontSize: 11,
                color: PATHOGEN_COLORS[p.pathogen],
                fontWeight: 500,
                flexShrink: 0,
              }}>
                {PATHOGEN_LABELS[p.pathogen]}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Filters ─────────────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 32px',
        padding: '0 24px',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {[
          { options: ERA_OPTIONS, value: eraFilter, setter: setEraFilter },
          { options: PATHOGEN_OPTIONS, value: pathogenFilter, setter: setPathogenFilter },
          { options: REGION_OPTIONS, value: regionFilter, setter: setRegionFilter },
        ].map(({ options, value, setter }, gi) => (
          <select
            key={gi}
            value={value}
            onChange={e => setter(e.target.value as never)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(15,17,23,0.9)',
              color: '#e2e8f0',
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}

        {(eraFilter !== 'all' || pathogenFilter !== 'all' || regionFilter !== 'all') && (
          <button
            onClick={() => { setEraFilter('all'); setPathogenFilter('all'); setRegionFilter('all'); }}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Clear filters
          </button>
        )}

        <span style={{ fontSize: 13, color: '#64748b', alignSelf: 'center', marginLeft: 8 }}>
          {filtered.length} of {PANDEMICS.length} pandemics
        </span>
      </section>

      {/* ── Pandemic Cards ──────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 60px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360, 1fr))',
        gap: 20,
      }}>
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            style={{
              background: 'rgba(15,17,23,0.6)',
              border: expandedId === p.id
                ? '1px solid rgba(99,102,241,0.5)'
                : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: 24,
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
            onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#f1f5f9' }}>
                  {p.name}
                </h3>
                <span style={{ fontSize: 14, color: '#94a3b8' }}>{p.dateRange}</span>
              </div>
              <span style={{
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: `${PATHOGEN_COLORS[p.pathogen]}20`,
                color: PATHOGEN_COLORS[p.pathogen],
                border: `1px solid ${PATHOGEN_COLORS[p.pathogen]}40`,
              }}>
                {PATHOGEN_LABELS[p.pathogen]}
              </span>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Deaths</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f87171' }}>{p.deathTollDisplay}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>World Pop.</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>{p.worldPopulationPercent}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Origin</div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{p.originLocation}</div>
              </div>
            </div>

            {/* Regions */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {p.regionsAffected.map(r => (
                <span key={r} style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {r}
                </span>
              ))}
            </div>

            {/* Expanded content */}
            {expandedId === p.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 4 }}>
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                      Historical Impact
                    </h4>
                    <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{p.historicalImpact}</p>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                      How It Ended
                    </h4>
                    <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6 }}>{p.howEnded}</p>
                  </div>

                  <div style={{
                    marginBottom: 16,
                    padding: 14,
                    borderRadius: 8,
                    background: 'rgba(34,211,238,0.06)',
                    border: '1px solid rgba(34,211,238,0.15)',
                  }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', marginBottom: 6 }}>
                      Silver Lining
                    </h4>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{p.silverLining}</p>
                  </div>

                  <Link
                    to={`/?q=${encodeURIComponent(p.searchQuery)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      color: '#818cf8',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 150ms ease',
                    }}
                  >
                    Find Chronicle Events →
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </section>

      {/* ── Pandemic Response Evolution Timeline ───── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          maxWidth: 900,
          margin: '0 auto 60px',
          padding: '0 24px',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Timeline of Pandemic Response Evolution
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
          How humanity learned to fight back — from medieval quarantines to mRNA vaccines
        </p>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 12,
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, #6366f1, #22d3ee)',
          }} />

          {RESPONSE_MILESTONES.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
              style={{
                position: 'relative',
                marginBottom: 28,
                paddingLeft: 24,
              }}
            >
              {/* Dot on the line */}
              <div style={{
                position: 'absolute',
                left: -25,
                top: 4,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#6366f1',
                border: '2px solid #0f1117',
              }} />

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#6366f1' }}>{m.year}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9' }}>{m.label}</span>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{m.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Lessons Learned ─────────────────────────── */}
      <section style={{
        maxWidth: 1200,
        margin: '0 auto 60px',
        padding: '0 24px',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
          5 Lessons From 2,500 Years of Pandemics
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}>
          {LESSONS.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'rgba(15,17,23,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{l.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>{l.title}</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{l.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Chronicle Events from DB ────────────────── */}
      {dbEvents.length > 0 && (
        <section style={{
          maxWidth: 1200,
          margin: '0 auto 60px',
          padding: '0 24px',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Related Chronicle Events
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
            {dbEvents.length} pandemic-related events found in the Chronicle database
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}>
            {dbEvents.map(ev => (
              <Link
                key={ev.id}
                to={`/event/${ev.slug}`}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 14, color: '#e2e8f0', fontWeight: 500 }}>{ev.title}</span>
                  <span style={{ fontSize: 12, color: '#64748b', flexShrink: 0, marginLeft: 12 }}>
                    {ev.year_approx < 0 ? `${Math.abs(ev.year_approx)} BCE` : ev.year_approx}
                  </span>
                </div>
                {ev.region && (
                  <span style={{ fontSize: 11, color: '#475569', marginTop: 4, display: 'block' }}>{ev.region}</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Footer ──────────────────────────────────── */}
      <footer style={{
        textAlign: 'center',
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: '#475569',
        fontSize: 12,
      }}>
        <p>Data sourced from WHO, CDC, peer-reviewed epidemiological literature. Death toll estimates vary by source.</p>
        <p style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: '#6366f1', textDecoration: 'none' }}>← Back to Chronicle Timeline</Link>
        </p>
      </footer>
    </div>
  );
}
