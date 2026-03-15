/**
 * PandemicsPage — "History's Deadliest Pandemics & Epidemics"
 *
 * Route: /pandemics
 *
 * Features:
 *  - 18 curated pandemic cards with rich detail
 *  - Timeline visualization (horizontal bars by timespan, colored by impact)
 *  - Death toll comparison bar chart
 *  - Filter by era / impact / region
 *  - Sort by chronological, deaths, impact
 *  - "Pandemic of the Day" featured card
 *  - "What We Learned" key advances section
 *  - Compare two pandemics side-by-side
 *  - "Find in Chronicle" search links
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Pandemic {
  slug: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  yearDisplay: string;
  pathogen: string;
  pathogenType: string;
  deathToll: string;
  deathTollNumber: number;
  geographicSpread: string;
  impactRating: string;
  regions: string[];
  causeOfDeath: string;
  howItSpread: string;
  howItEnded: string;
  historicalImpact: string;
  keyFacts: string[];
  era: string;
  chronicleQuery: string;
}

// ── Hardcoded dataset ────────────────────────────────────────────────────────

const PANDEMICS: Pandemic[] = [
  {
    slug: 'plague-of-athens',
    name: 'Plague of Athens',
    yearStart: -430,
    yearEnd: -426,
    yearDisplay: '430–426 BCE',
    pathogen: 'Unknown (possibly typhoid or viral hemorrhagic fever)',
    pathogenType: 'unknown',
    deathToll: '75,000–100,000',
    deathTollNumber: 100000,
    geographicSpread: 'Local',
    impactRating: 'Significant',
    regions: ['Greece'],
    causeOfDeath: 'Fever, hemorrhaging, organ failure',
    howItSpread: 'Crowded conditions during Peloponnesian War siege',
    howItEnded: 'Burned through susceptible population; war continued',
    historicalImpact: "Killed Pericles and devastated Athenian leadership, weakening Athens in the Peloponnesian War. Thucydides' account became the first clinical description of an epidemic in Western literature.",
    keyFacts: [
      'Killed the great statesman Pericles in 429 BCE',
      'Thucydides survived and wrote the first medical account of plague',
      "Struck during the Peloponnesian War, contributing to Athens' eventual defeat",
    ],
    era: 'Ancient',
    chronicleQuery: 'Plague of Athens',
  },
  {
    slug: 'antonine-plague',
    name: 'Antonine Plague',
    yearStart: 165,
    yearEnd: 180,
    yearDisplay: '165–180 CE',
    pathogen: 'Smallpox (Variola major)',
    pathogenType: 'virus',
    deathToll: '5–10 million',
    deathTollNumber: 5000000,
    geographicSpread: 'Continental',
    impactRating: 'Devastating',
    regions: ['Roman Empire', 'Middle East'],
    causeOfDeath: 'Smallpox — fever, rash, organ failure',
    howItSpread: 'Roman soldiers returning from Mesopotamia spread it across the empire',
    howItEnded: 'Gradually subsided as survivors gained immunity; recurred in waves',
    historicalImpact: "Weakened the Roman military and economy at the height of the empire. Killed Emperor Lucius Verus and possibly Marcus Aurelius. Began Rome's long decline.",
    keyFacts: [
      'Named after the Antonine dynasty of Roman emperors',
      'Galen documented symptoms, giving us one of the earliest descriptions of smallpox',
      'Killed up to 2,000 people per day in Rome at its peak',
    ],
    era: 'Ancient',
    chronicleQuery: 'Antonine Plague',
  },
  {
    slug: 'plague-of-cyprian',
    name: 'Plague of Cyprian',
    yearStart: 249,
    yearEnd: 262,
    yearDisplay: '249–262 CE',
    pathogen: 'Unknown (possibly viral hemorrhagic fever or smallpox)',
    pathogenType: 'unknown',
    deathToll: 'Millions (5,000/day in Rome at peak)',
    deathTollNumber: 1000000,
    geographicSpread: 'Continental',
    impactRating: 'Devastating',
    regions: ['Roman Empire', 'North Africa'],
    causeOfDeath: 'Fever, diarrhea, vomiting, gangrenous extremities',
    howItSpread: 'Person-to-person contact across Roman trade networks',
    howItEnded: 'Subsided after 13 years; contributed to Crisis of the Third Century',
    historicalImpact: 'Accelerated the Crisis of the Third Century in Rome. Fueled the rise of Christianity as pagan temples failed to provide answers while Christians cared for the sick.',
    keyFacts: [
      'Named after St. Cyprian, Bishop of Carthage, who documented it',
      'At peak, killed 5,000 people per day in Rome alone',
      'Contributed to Roman military manpower shortages',
    ],
    era: 'Ancient',
    chronicleQuery: 'Plague of Cyprian',
  },
  {
    slug: 'plague-of-justinian',
    name: 'Plague of Justinian',
    yearStart: 541,
    yearEnd: 549,
    yearDisplay: '541–549 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogenType: 'bacterium',
    deathToll: '25–50 million',
    deathTollNumber: 30000000,
    geographicSpread: 'Continental',
    impactRating: 'Catastrophic',
    regions: ['Byzantine Empire', 'Mediterranean', 'Middle East', 'Europe'],
    causeOfDeath: 'Bubonic plague — swollen lymph nodes (buboes), sepsis, organ failure',
    howItSpread: 'Rats and fleas on grain ships from Egypt; spread along trade routes',
    howItEnded: 'Recurred in waves for 200 years; eventually died out by ~750 CE',
    historicalImpact: "Destroyed Emperor Justinian's dream of reuniting the Roman Empire. Killed up to half the population of the Mediterranean world and reshaped the balance of power between Byzantium, Persia, and the emerging Islamic caliphate.",
    keyFacts: [
      'First recorded bubonic plague pandemic in history',
      'Emperor Justinian himself contracted the plague but survived',
      "Killed an estimated 40% of Constantinople's population",
      'Recurred in waves for over 200 years',
    ],
    era: 'Medieval',
    chronicleQuery: 'Plague of Justinian',
  },
  {
    slug: 'black-death',
    name: 'Black Death',
    yearStart: 1347,
    yearEnd: 1351,
    yearDisplay: '1347–1351 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogenType: 'bacterium',
    deathToll: '50–200 million (30–60% of Europe)',
    deathTollNumber: 75000000,
    geographicSpread: 'Global',
    impactRating: 'Catastrophic',
    regions: ['Europe', 'Asia', 'Middle East', 'North Africa'],
    causeOfDeath: 'Bubonic, pneumonic, and septicemic plague',
    howItSpread: 'Rat fleas (Xenopsylla cheopis); also pneumonic transmission person-to-person',
    howItEnded: 'Quarantine measures, population die-off; plague remained endemic for centuries',
    historicalImpact: "The most devastating pandemic in human history. Ended feudalism by creating labor shortages that empowered peasants. Triggered the Renaissance, transformed European art and religion, and led to the first public health systems (quarantine in Ragusa/Dubrovnik, 1377).",
    keyFacts: [
      'Arrived in Europe via Genoese trading ships from Crimea',
      "Killed 30–60% of Europe's entire population in just 4 years",
      "The word 'quarantine' comes from the 40-day isolation period (quarantina) invented during this pandemic",
      'Led to widespread persecution of Jewish communities as scapegoats',
      'Peasant revolts followed as surviving workers demanded higher wages',
    ],
    era: 'Medieval',
    chronicleQuery: 'Black Death',
  },
  {
    slug: 'sweating-sickness',
    name: 'Sweating Sickness',
    yearStart: 1485,
    yearEnd: 1551,
    yearDisplay: '1485–1551 CE',
    pathogen: 'Unknown (possibly hantavirus)',
    pathogenType: 'unknown',
    deathToll: 'Tens of thousands',
    deathTollNumber: 50000,
    geographicSpread: 'Regional',
    impactRating: 'Significant',
    regions: ['England', 'Northern Europe'],
    causeOfDeath: 'Profuse sweating, high fever, rapid death (sometimes within hours)',
    howItSpread: 'Unknown; appeared suddenly in 5 outbreaks over 66 years',
    howItEnded: 'Disappeared completely after 1551 — never identified',
    historicalImpact: "Terrorized Tudor England and influenced Henry VIII's court politics. Anne Boleyn survived a bout in 1528. The disease struck rich and poor alike, unlike most plagues that hit the poor hardest.",
    keyFacts: [
      'Could kill within hours of first symptoms',
      "First appeared with Henry VII's army at the Battle of Bosworth Field",
      'Uniquely targeted healthy young adults, not the elderly',
      'Vanished completely after 1551 and has never been conclusively identified',
    ],
    era: 'Early Modern',
    chronicleQuery: 'Sweating Sickness',
  },
  {
    slug: 'cocoliztli-epidemic',
    name: 'Cocoliztli Epidemic',
    yearStart: 1545,
    yearEnd: 1548,
    yearDisplay: '1545–1548 CE',
    pathogen: 'Possibly Salmonella enterica (enteric fever) or viral hemorrhagic fever',
    pathogenType: 'unknown',
    deathToll: '5–15 million',
    deathTollNumber: 12000000,
    geographicSpread: 'Regional',
    impactRating: 'Catastrophic',
    regions: ['Mexico', 'Central America'],
    causeOfDeath: 'High fever, severe bleeding from eyes, nose, and mouth',
    howItSpread: 'Likely exacerbated by drought; possibly introduced by Europeans',
    howItEnded: 'Population devastation reduced transmission; recurring outbreaks until 1576',
    historicalImpact: "One of the deadliest epidemics in the Americas. Destroyed the remaining Aztec population after Spanish conquest, reducing Mexico's indigenous population from 25 million to 1 million. Facilitated Spanish colonial consolidation.",
    keyFacts: [
      "Nahuatl word 'cocoliztli' means 'pestilence'",
      "Killed up to 80% of Mexico's native population",
      '2018 DNA analysis suggested Salmonella enterica as the pathogen',
      'Combined with earlier smallpox epidemics, caused one of the greatest demographic collapses in history',
    ],
    era: 'Early Modern',
    chronicleQuery: 'Cocoliztli Epidemic',
  },
  {
    slug: 'great-plague-of-london',
    name: 'Great Plague of London',
    yearStart: 1665,
    yearEnd: 1666,
    yearDisplay: '1665–1666 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogenType: 'bacterium',
    deathToll: "~100,000 (25% of London's population)",
    deathTollNumber: 100000,
    geographicSpread: 'Local',
    impactRating: 'Devastating',
    regions: ['England'],
    causeOfDeath: 'Bubonic plague — buboes, fever, sepsis',
    howItSpread: 'Rat fleas; worsened by overcrowded, unsanitary conditions',
    howItEnded: 'Great Fire of London (1666) may have helped; also quarantine measures',
    historicalImpact: "The last major plague outbreak in England. Led directly to improved sanitation and urban planning. Isaac Newton fled Cambridge to his country home, where he developed calculus and his theory of gravity during the plague years.",
    keyFacts: [
      "Red crosses were painted on doors of infected houses with 'Lord have mercy upon us'",
      "Samuel Pepys' diary provides vivid first-hand accounts",
      "Newton's 'annus mirabilis' of scientific discovery happened while fleeing the plague",
      'The Great Fire of London in 1666 may have helped end the outbreak by destroying rat habitats',
    ],
    era: 'Early Modern',
    chronicleQuery: 'Great Plague of London',
  },
  {
    slug: 'plague-of-marseille',
    name: 'Plague of Marseille',
    yearStart: 1720,
    yearEnd: 1722,
    yearDisplay: '1720–1722 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogenType: 'bacterium',
    deathToll: '~100,000',
    deathTollNumber: 100000,
    geographicSpread: 'Regional',
    impactRating: 'Devastating',
    regions: ['France', 'Mediterranean'],
    causeOfDeath: 'Bubonic plague — buboes, fever, organ failure',
    howItSpread: 'Arrived on the merchant ship Grand Saint Antoine from the Levant',
    howItEnded: 'Strict quarantine (Mur de la Peste — a plague wall built across Provence) and military cordons',
    historicalImpact: 'The last major outbreak of bubonic plague in Western Europe. Led to the construction of a physical plague wall and demonstrated that quarantine and public health measures could contain epidemics.',
    keyFacts: [
      'The ship Grand Saint Antoine brought the plague despite quarantine protocols',
      'France built a physical stone wall (Mur de la Peste) to contain the outbreak',
      'Last major bubonic plague epidemic in Western Europe',
      'Captain of the ship was imprisoned for violating quarantine',
    ],
    era: 'Early Modern',
    chronicleQuery: 'Plague of Marseille',
  },
  {
    slug: 'russian-plague',
    name: 'Russian Plague',
    yearStart: 1770,
    yearEnd: 1772,
    yearDisplay: '1770–1772 CE',
    pathogen: 'Yersinia pestis (bubonic plague)',
    pathogenType: 'bacterium',
    deathToll: '~100,000',
    deathTollNumber: 100000,
    geographicSpread: 'Regional',
    impactRating: 'Devastating',
    regions: ['Russia'],
    causeOfDeath: 'Bubonic plague — buboes, fever, sepsis',
    howItSpread: 'Arrived via soldiers returning from the Russo-Turkish War',
    howItEnded: 'Military cordons, burning of contaminated property, improved sanitation',
    historicalImpact: "Triggered the Moscow Plague Riot of 1771, one of Russia's largest urban uprisings. Citizens attacked quarantine facilities and killed Archbishop Ambrose. Catherine the Great sent troops and implemented sweeping public health reforms.",
    keyFacts: [
      'Caused the Moscow Plague Riot of 1771',
      "Rioters murdered Archbishop Ambrose for removing a 'miracle-working' icon",
      'Catherine the Great imposed strict quarantine and burned infected districts',
      'Led to major urban planning reforms in Moscow',
    ],
    era: 'Early Modern',
    chronicleQuery: 'Russian Plague Moscow',
  },
  {
    slug: 'yellow-fever-philadelphia',
    name: 'Yellow Fever (Philadelphia)',
    yearStart: 1793,
    yearEnd: 1793,
    yearDisplay: '1793',
    pathogen: 'Yellow fever virus (Flavivirus)',
    pathogenType: 'virus',
    deathToll: "~5,000 (10% of Philadelphia's population)",
    deathTollNumber: 5000,
    geographicSpread: 'Local',
    impactRating: 'Significant',
    regions: ['United States'],
    causeOfDeath: 'Liver failure, hemorrhaging, jaundice (yellow skin)',
    howItSpread: 'Aedes aegypti mosquitoes; arrived via refugees from Saint-Domingue revolution',
    howItEnded: 'First frost killed the mosquitoes',
    historicalImpact: 'Congress, President Washington, and most federal officials fled the capital. Free Black community (led by Richard Allen and Absalom Jones) provided critical nursing care. Led to the first major public health infrastructure in the United States.',
    keyFacts: [
      'Philadelphia was the U.S. capital at the time',
      'President Washington, Congress, and most officials fled the city',
      'The Free African Society organized relief when white citizens fled',
      "Dr. Benjamin Rush's controversial 'bleeding and purging' treatment likely killed more patients",
    ],
    era: 'Early Modern',
    chronicleQuery: 'Yellow Fever Philadelphia',
  },
  {
    slug: 'cholera-pandemics',
    name: 'Cholera Pandemics',
    yearStart: 1817,
    yearEnd: 1923,
    yearDisplay: '1817–1923 (7 waves)',
    pathogen: 'Vibrio cholerae (bacterium)',
    pathogenType: 'bacterium',
    deathToll: 'Millions worldwide',
    deathTollNumber: 2000000,
    geographicSpread: 'Global',
    impactRating: 'Catastrophic',
    regions: ['India', 'Asia', 'Europe', 'Americas', 'Africa'],
    causeOfDeath: 'Severe dehydration from watery diarrhea; death within hours if untreated',
    howItSpread: 'Contaminated water supplies; thrived in unsanitary urban conditions',
    howItEnded: "Clean water infrastructure, sanitation reforms, John Snow's epidemiology",
    historicalImpact: "Revolutionized public health. John Snow's 1854 Broad Street pump investigation founded modern epidemiology. Cholera drove the construction of modern water and sewage systems in every major city worldwide.",
    keyFacts: [
      'Seven distinct pandemic waves over 106 years',
      'John Snow traced the 1854 London outbreak to a single water pump, founding epidemiology',
      'Drove the construction of modern sewage systems worldwide',
      'Still causes 1–4 million cases per year in developing nations',
      'Robert Koch identified the bacterium in 1883',
    ],
    era: 'Modern',
    chronicleQuery: 'Cholera Pandemic',
  },
  {
    slug: 'spanish-flu',
    name: 'Spanish Flu',
    yearStart: 1918,
    yearEnd: 1920,
    yearDisplay: '1918–1920',
    pathogen: 'Influenza A virus (H1N1)',
    pathogenType: 'virus',
    deathToll: '50–100 million',
    deathTollNumber: 50000000,
    geographicSpread: 'Global',
    impactRating: 'Catastrophic',
    regions: ['Worldwide'],
    causeOfDeath: 'Cytokine storm — immune system overreaction, pneumonia, secondary bacterial infection',
    howItSpread: 'Airborne respiratory droplets; troop movements in WWI accelerated global spread',
    howItEnded: 'Virus mutated to less lethal form; population gained immunity',
    historicalImpact: "The deadliest pandemic in modern history. Infected one-third of the world's population (500 million). Killed more people than WWI. Disproportionately killed healthy young adults (ages 20–40) due to cytokine storms. Led to the creation of national public health systems worldwide.",
    keyFacts: [
      "Infected ~500 million people — one-third of the world's population",
      'Killed more people than World War I in a fraction of the time',
      'Uniquely lethal to healthy young adults (ages 20–40)',
      "Misnamed 'Spanish' because Spain, as a neutral country, freely reported cases",
      'Wartime censorship in other countries suppressed news of the pandemic',
    ],
    era: 'Modern',
    chronicleQuery: 'Spanish Flu',
  },
  {
    slug: 'asian-flu',
    name: 'Asian Flu',
    yearStart: 1957,
    yearEnd: 1958,
    yearDisplay: '1957–1958',
    pathogen: 'Influenza A virus (H2N2)',
    pathogenType: 'virus',
    deathToll: '1–2 million',
    deathTollNumber: 1500000,
    geographicSpread: 'Global',
    impactRating: 'Devastating',
    regions: ['Worldwide'],
    causeOfDeath: 'Pneumonia, respiratory failure',
    howItSpread: 'Airborne respiratory droplets; rapid global spread via air travel',
    howItEnded: 'Vaccine development (Maurice Hilleman) and natural immunity',
    historicalImpact: 'First pandemic where a vaccine was rapidly developed. Maurice Hilleman at Walter Reed identified the virus and pushed for emergency vaccine production, saving millions. Demonstrated the value of global disease surveillance.',
    keyFacts: [
      'Originated in Guizhou, China in early 1957',
      "Maurice Hilleman's rapid vaccine development saved millions",
      'First pandemic responded to with modern virology tools',
      'The H2N2 virus later evolved into H3N2 (Hong Kong Flu, 1968)',
    ],
    era: 'Contemporary',
    chronicleQuery: 'Asian Flu 1957',
  },
  {
    slug: 'hiv-aids',
    name: 'HIV/AIDS',
    yearStart: 1981,
    yearEnd: 2026,
    yearDisplay: '1981–present',
    pathogen: 'Human Immunodeficiency Virus (HIV)',
    pathogenType: 'retrovirus',
    deathToll: '~40 million dead; 39 million living with HIV',
    deathTollNumber: 40000000,
    geographicSpread: 'Global',
    impactRating: 'Catastrophic',
    regions: ['Worldwide', 'Sub-Saharan Africa (most affected)'],
    causeOfDeath: 'Immune system destruction leading to opportunistic infections and cancers',
    howItSpread: 'Sexual contact, blood transfusion, shared needles, mother-to-child transmission',
    howItEnded: 'Ongoing — antiretroviral therapy (ART) transformed HIV from death sentence to manageable condition',
    historicalImpact: 'Reshaped global public health, sexual health education, and LGBTQ+ rights movements. Drove unprecedented investment in virology research. Sub-Saharan Africa lost a generation. ART development revolutionized antiviral medicine and informed COVID-19 vaccine research.',
    keyFacts: [
      'First recognized in 1981 among gay men in Los Angeles and New York',
      'Originated from simian immunodeficiency virus (SIV) in chimpanzees, crossing to humans around 1920',
      '36+ million deaths since the start of the epidemic',
      'Antiretroviral therapy (1996) transformed HIV from death sentence to chronic condition',
      'Sub-Saharan Africa accounts for ~70% of all people living with HIV',
    ],
    era: 'Contemporary',
    chronicleQuery: 'AIDS Epidemic',
  },
  {
    slug: 'sars',
    name: 'SARS',
    yearStart: 2002,
    yearEnd: 2004,
    yearDisplay: '2002–2004',
    pathogen: 'SARS-CoV (Severe Acute Respiratory Syndrome coronavirus)',
    pathogenType: 'virus',
    deathToll: '~774',
    deathTollNumber: 774,
    geographicSpread: 'Regional',
    impactRating: 'Significant',
    regions: ['China', 'Hong Kong', 'Southeast Asia', 'Canada'],
    causeOfDeath: 'Severe pneumonia, respiratory failure',
    howItSpread: 'Respiratory droplets; superspreader events in hospitals and hotels',
    howItEnded: 'Aggressive quarantine, contact tracing, and public health measures contained it',
    historicalImpact: 'First modern coronavirus pandemic scare. Though contained quickly, it exposed weaknesses in global disease surveillance and hospital infection control. Directly motivated the research infrastructure that enabled rapid COVID-19 response.',
    keyFacts: [
      'Originated in Guangdong, China in November 2002',
      'The Metropole Hotel superspreader event in Hong Kong infected guests who spread it to 4 countries',
      'Dr. Carlo Urbani identified the disease and died from it',
      'SARS research laid the groundwork for COVID-19 vaccine development',
    ],
    era: 'Contemporary',
    chronicleQuery: 'SARS',
  },
  {
    slug: 'h1n1-swine-flu',
    name: 'H1N1 Swine Flu',
    yearStart: 2009,
    yearEnd: 2010,
    yearDisplay: '2009–2010',
    pathogen: 'Influenza A virus (H1N1)pdm09',
    pathogenType: 'virus',
    deathToll: '~284,000',
    deathTollNumber: 284000,
    geographicSpread: 'Global',
    impactRating: 'Significant',
    regions: ['Worldwide'],
    causeOfDeath: 'Pneumonia, respiratory failure',
    howItSpread: 'Airborne respiratory droplets; rapid global spread via air travel',
    howItEnded: 'Vaccine deployment and natural immunity; virus became seasonal',
    historicalImpact: "First pandemic of the 21st century. Tested the global pandemic response system created after SARS. The relatively mild outcome led to accusations of WHO overreaction, which ironically may have slowed the initial COVID-19 response a decade later.",
    keyFacts: [
      'First detected in Mexico in April 2009',
      'Infected an estimated 1.4 billion people worldwide',
      'Disproportionately affected young people (unlike seasonal flu)',
      "Criticism of WHO's 'overreaction' later undermined pandemic preparedness",
    ],
    era: 'Contemporary',
    chronicleQuery: 'H1N1 Swine Flu',
  },
  {
    slug: 'covid-19',
    name: 'COVID-19',
    yearStart: 2019,
    yearEnd: 2023,
    yearDisplay: '2019–2023',
    pathogen: 'SARS-CoV-2 (Severe Acute Respiratory Syndrome coronavirus 2)',
    pathogenType: 'virus',
    deathToll: '7+ million official (20+ million estimated)',
    deathTollNumber: 20000000,
    geographicSpread: 'Global',
    impactRating: 'Catastrophic',
    regions: ['Worldwide'],
    causeOfDeath: 'Pneumonia, ARDS, blood clots, organ failure, cytokine storm',
    howItSpread: 'Airborne respiratory droplets and aerosols; presymptomatic transmission',
    howItEnded: 'Vaccines (mRNA technology breakthrough), natural immunity, virus evolution to less severe variants',
    historicalImpact: 'The defining crisis of the 21st century. Triggered the largest global lockdowns in history, accelerated remote work, disrupted supply chains, and drove political polarization. mRNA vaccine technology, developed in record time, revolutionized medicine.',
    keyFacts: [
      'First cases reported in Wuhan, China in December 2019',
      'WHO declared global pandemic on March 11, 2020',
      'mRNA vaccines developed in under a year — fastest in history',
      'Global lockdowns affected 4+ billion people simultaneously',
      'Official death toll exceeds 7 million; excess death estimates suggest 20+ million',
      'Long COVID affects an estimated 10–30% of survivors',
    ],
    era: 'Contemporary',
    chronicleQuery: 'COVID-19 Pandemic',
  },
];

// ── Constants ────────────────────────────────────────────────────────────────

const IMPACT_COLORS: Record<string, string> = {
  Local: '#3b82f6',
  Significant: '#eab308',
  Devastating: '#f97316',
  Catastrophic: '#ef4444',
};

const ERA_COLORS: Record<string, string> = {
  Ancient: '#a78bfa',
  Medieval: '#f472b6',
  'Early Modern': '#38bdf8',
  Modern: '#34d399',
  Contemporary: '#fb923c',
};

const ERAS = ['All', 'Ancient', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'];
const IMPACTS = ['All', 'Catastrophic', 'Devastating', 'Significant', 'Local'];

type SortMode = 'chronological' | 'deaths' | 'impact';
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'chronological', label: 'Chronological' },
  { value: 'deaths', label: 'Death Toll' },
  { value: 'impact', label: 'Impact Rating' },
];

const IMPACT_ORDER: Record<string, number> = { Local: 1, Significant: 2, Devastating: 3, Catastrophic: 4 };

// ── "What We Learned" data ───────────────────────────────────────────────────

const LESSONS = [
  {
    title: 'Quarantine & Public Health',
    description: 'The Black Death (1347) led to the invention of quarantine in Ragusa/Dubrovnik. The concept of isolating the sick to protect the healthy became the foundation of all modern public health systems.',
    pandemic: 'Black Death',
  },
  {
    title: 'Germ Theory & Epidemiology',
    description: "John Snow's 1854 cholera investigation — tracing an outbreak to a single water pump — founded modern epidemiology. Pasteur and Koch later proved germ theory, replacing centuries of 'miasma' belief.",
    pandemic: 'Cholera Pandemics',
  },
  {
    title: 'Vaccination',
    description: "Edward Jenner's 1796 smallpox vaccine, inspired by the Antonine Plague's devastation, launched the era of vaccination. This single advance has saved more lives than any other medical intervention in history.",
    pandemic: 'Antonine Plague',
  },
  {
    title: 'Global Disease Surveillance',
    description: 'SARS (2003) exposed gaps in international disease reporting. The response led to strengthened WHO frameworks and the surveillance systems that detected COVID-19, H1N1, and other emerging threats.',
    pandemic: 'SARS',
  },
  {
    title: 'mRNA Vaccine Technology',
    description: 'COVID-19 drove the first successful deployment of mRNA vaccines, a technology decades in development. This platform can be rapidly adapted for new pathogens, fundamentally changing pandemic response.',
    pandemic: 'COVID-19',
  },
];

// ── Helper functions ─────────────────────────────────────────────────────────

function getPandemicOfTheDay(): Pandemic {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return PANDEMICS[dayOfYear % PANDEMICS.length];
}

function formatDeathToll(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Timeline visualization ───────────────────────────────────────────────────

function TimelineVisualization({ pandemics, onSelect }: { pandemics: Pandemic[]; onSelect: (slug: string) => void }) {
  const sorted = [...pandemics].sort((a, b) => a.yearStart - b.yearStart);
  const minYear = sorted[0].yearStart;
  const maxYear = Math.max(...sorted.map((p) => p.yearEnd));
  const range = maxYear - minYear;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
        overflowX: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        Timeline of Pandemics
      </h3>
      <div style={{ position: 'relative', minWidth: 700 }}>
        {sorted.map((p) => {
          const left = ((p.yearStart - minYear) / range) * 100;
          const width = Math.max(((p.yearEnd - p.yearStart) / range) * 100, 0.5);
          const color = IMPACT_COLORS[p.impactRating] || '#6b7280';

          return (
            <div
              key={p.slug}
              onClick={() => onSelect(p.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
                cursor: 'pointer',
              }}
              title={`${p.name} (${p.yearDisplay})`}
            >
              <div
                style={{
                  width: 120,
                  flexShrink: 0,
                  fontSize: 11,
                  color: '#94a3b8',
                  textAlign: 'right',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 18 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    minWidth: 4,
                    height: 14,
                    top: 2,
                    borderRadius: 3,
                    background: `${color}88`,
                    border: `1px solid ${color}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = color;
                    e.currentTarget.style.transform = 'scaleY(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${color}88`;
                    e.currentTarget.style.transform = 'scaleY(1)';
                  }}
                />
              </div>
            </div>
          );
        })}
        {/* Year axis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingLeft: 128 }}>
          <span style={{ fontSize: 10, color: '#64748b' }}>{sorted[0].yearDisplay.split('–')[0]}</span>
          <span style={{ fontSize: 10, color: '#64748b' }}>Present</span>
        </div>
      </div>
    </div>
  );
}

// ── Death toll comparison chart ──────────────────────────────────────────────

function DeathTollChart({ pandemics }: { pandemics: Pandemic[] }) {
  const sorted = [...pandemics]
    .filter((p) => p.deathTollNumber >= 10000)
    .sort((a, b) => b.deathTollNumber - a.deathTollNumber);
  const maxDeaths = sorted[0]?.deathTollNumber || 1;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        Death Toll Comparison
      </h3>
      {sorted.map((p) => {
        const pct = (p.deathTollNumber / maxDeaths) * 100;
        const color = IMPACT_COLORS[p.impactRating] || '#6b7280';
        return (
          <div key={p.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 140,
                flexShrink: 0,
                fontSize: 12,
                color: '#94a3b8',
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: 20 }}>
              <div
                style={{
                  width: `${pct}%`,
                  minWidth: 2,
                  height: '100%',
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${color}66, ${color})`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ width: 60, fontSize: 12, fontWeight: 600, color, textAlign: 'right', flexShrink: 0 }}>
              {formatDeathToll(p.deathTollNumber)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── "What We Learned" section ────────────────────────────────────────────────

function WhatWeLearned() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        What Pandemics Taught Us
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {LESSONS.map((lesson) => (
          <div
            key={lesson.title}
            style={{
              padding: '14px 16px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: '#60a5fa' }}>
              {lesson.title}
            </div>
            <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
              {lesson.description}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 8, fontStyle: 'italic' }}>
              Driven by: {lesson.pandemic}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Compare side-by-side ─────────────────────────────────────────────────────

function ComparePanel() {
  const [leftSlug, setLeftSlug] = useState('');
  const [rightSlug, setRightSlug] = useState('');

  const left = PANDEMICS.find((p) => p.slug === leftSlug);
  const right = PANDEMICS.find((p) => p.slug === rightSlug);

  const selectStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '6px 12px',
    fontSize: 13,
    cursor: 'pointer',
    outline: 'none',
    flex: 1,
    minWidth: 140,
  };

  const rows: { label: string; leftVal: string; rightVal: string }[] =
    left && right
      ? [
          { label: 'Date Range', leftVal: left.yearDisplay, rightVal: right.yearDisplay },
          { label: 'Pathogen', leftVal: left.pathogen, rightVal: right.pathogen },
          { label: 'Death Toll', leftVal: left.deathToll, rightVal: right.deathToll },
          { label: 'Spread', leftVal: left.geographicSpread, rightVal: right.geographicSpread },
          { label: 'Impact', leftVal: left.impactRating, rightVal: right.impactRating },
          { label: 'How It Spread', leftVal: left.howItSpread, rightVal: right.howItSpread },
          { label: 'How It Ended', leftVal: left.howItEnded, rightVal: right.howItEnded },
        ]
      : [];

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
        Compare Two Pandemics
      </h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={leftSlug} onChange={(e) => setLeftSlug(e.target.value)} style={selectStyle}>
          <option value="" style={{ background: '#1e293b' }}>Select first pandemic...</option>
          {PANDEMICS.map((p) => (
            <option key={p.slug} value={p.slug} style={{ background: '#1e293b' }}>
              {p.name} ({p.yearDisplay})
            </option>
          ))}
        </select>
        <span style={{ color: '#64748b', fontWeight: 700, alignSelf: 'center' }}>vs</span>
        <select value={rightSlug} onChange={(e) => setRightSlug(e.target.value)} style={selectStyle}>
          <option value="" style={{ background: '#1e293b' }}>Select second pandemic...</option>
          {PANDEMICS.map((p) => (
            <option key={p.slug} value={p.slug} style={{ background: '#1e293b' }}>
              {p.name} ({p.yearDisplay})
            </option>
          ))}
        </select>
      </div>

      {left && right && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)' }}></th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: IMPACT_COLORS[left.impactRating], fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{left.name}</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: IMPACT_COLORS[right.impactRating], fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{right.name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.label}>
                  <td style={{ padding: '8px 12px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', whiteSpace: 'nowrap' }}>{row.label}</td>
                  <td style={{ padding: '8px 12px', color: '#cbd5e1', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>{row.leftVal}</td>
                  <td style={{ padding: '8px 12px', color: '#cbd5e1', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>{row.rightVal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(!left || !right) && (
        <div style={{ textAlign: 'center', color: '#64748b', padding: 16, fontSize: 13 }}>
          Select two pandemics above to compare them side by side.
        </div>
      )}
    </div>
  );
}

// ── Pandemic card ────────────────────────────────────────────────────────────

function PandemicCard({ pandemic, index }: { pandemic: Pandemic; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const impactColor = IMPACT_COLORS[pandemic.impactRating] || '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6) }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: expanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${expanded ? impactColor + '88' : 'rgba(255,255,255,0.06)'}`,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = `${impactColor}55`;
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        {/* Header: era badge + impact rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${ERA_COLORS[pandemic.era] || '#6b7280'}22`,
                color: ERA_COLORS[pandemic.era] || '#6b7280',
              }}
            >
              {pandemic.era}
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${impactColor}22`,
                color: impactColor,
              }}
            >
              {pandemic.impactRating}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {pandemic.geographicSpread}
          </div>
        </div>

        {/* Name & dates */}
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{pandemic.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          {pandemic.yearDisplay} — {pandemic.pathogenType !== 'unknown' ? pandemic.pathogenType : 'unknown pathogen'}
        </div>

        {/* Death toll */}
        <div
          style={{
            marginTop: 10,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            color: '#cbd5e1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Death toll: <strong style={{ color: '#ef4444' }}>{pandemic.deathToll}</strong></span>
          <span style={{ fontSize: 11, color: '#64748b' }}>{pandemic.regions.slice(0, 3).join(', ')}</span>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 12 }}>
                {/* Pathogen */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Pathogen
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{pandemic.pathogen}</div>
                </div>

                {/* Cause of death */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Cause of Death
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{pandemic.causeOfDeath}</div>
                </div>

                {/* How it spread */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    How It Spread
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{pandemic.howItSpread}</div>
                </div>

                {/* How it ended */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    How It Ended
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{pandemic.howItEnded}</div>
                </div>

                {/* Historical impact */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    borderLeft: `3px solid ${impactColor}`,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Historical Impact
                  </div>
                  <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{pandemic.historicalImpact}</div>
                </div>

                {/* Key facts */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    Key Facts
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {pandemic.keyFacts.map((fact, i) => (
                      <li key={i} style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, marginBottom: 2 }}>
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Find in Chronicle link */}
                <Link
                  to={`/search?q=${encodeURIComponent(pandemic.chronicleQuery)}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(59,130,246,0.15)',
                    color: '#60a5fa',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                >
                  Find in Chronicle
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Most Catastrophic list ───────────────────────────────────────────────────

function MostCatastrophicList({ pandemics }: { pandemics: Pandemic[] }) {
  const top5 = [...pandemics]
    .sort((a, b) => b.deathTollNumber - a.deathTollNumber)
    .slice(0, 5);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
        Deadliest Pandemics
      </h3>
      {top5.map((p, i) => (
        <div
          key={p.slug}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${IMPACT_COLORS[p.impactRating] || '#6b7280'}33`,
              color: IMPACT_COLORS[p.impactRating] || '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {p.yearDisplay} — {p.deathToll}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: IMPACT_COLORS[p.impactRating] || '#6b7280',
            }}
          >
            {p.impactRating}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function PandemicsPage() {
  const [eraFilter, setEraFilter] = useState<string>('All');
  const [impactFilter, setImpactFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  const pandemicOfTheDay = useMemo(() => getPandemicOfTheDay(), []);

  const filtered = useMemo(() => {
    let list = [...PANDEMICS];

    if (eraFilter !== 'All') {
      list = list.filter((p) => p.era === eraFilter);
    }
    if (impactFilter !== 'All') {
      list = list.filter((p) => p.impactRating === impactFilter);
    }

    if (sortMode === 'chronological') {
      list.sort((a, b) => a.yearStart - b.yearStart);
    } else if (sortMode === 'deaths') {
      list.sort((a, b) => b.deathTollNumber - a.deathTollNumber);
    } else if (sortMode === 'impact') {
      list.sort((a, b) => (IMPACT_ORDER[b.impactRating] || 0) - (IMPACT_ORDER[a.impactRating] || 0));
    }

    return list;
  }, [eraFilter, impactFilter, sortMode]);

  function scrollToPandemic(slug: string) {
    const el = document.getElementById(`pandemic-${slug}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const totalDeaths = PANDEMICS.reduce((sum, p) => sum + p.deathTollNumber, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Pandemics</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          History's Deadliest Pandemics
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 700 }}
        >
          18 pandemics and epidemics that shaped civilization — from the Plague of Athens to COVID-19. Each one changed medicine, society, and the course of history.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}
        >
          <StatBox value="18" label="Pandemics" />
          <StatBox value="2,449 yrs" label="Span (430 BCE – 2023 CE)" />
          <StatBox value={formatDeathToll(totalDeaths) + '+'} label="Estimated Total Deaths" />
          <StatBox value="5" label="Eras Covered" />
        </motion.div>
      </header>

      {/* Main content */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Pandemic of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${IMPACT_COLORS[pandemicOfTheDay.impactRating] || '#6b7280'}15, rgba(255,255,255,0.03))`,
            border: `1px solid ${IMPACT_COLORS[pandemicOfTheDay.impactRating] || '#6b7280'}44`,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Pandemic of the Day
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{pandemicOfTheDay.name}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                {pandemicOfTheDay.yearDisplay} — {pandemicOfTheDay.pathogen}
              </div>
              <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8, maxWidth: 600, lineHeight: 1.5 }}>
                {pandemicOfTheDay.historicalImpact}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: `${IMPACT_COLORS[pandemicOfTheDay.impactRating] || '#6b7280'}22`,
                  color: IMPACT_COLORS[pandemicOfTheDay.impactRating] || '#6b7280',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {pandemicOfTheDay.impactRating}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8, color: '#ef4444' }}>
                {pandemicOfTheDay.deathToll}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline visualization */}
        <TimelineVisualization pandemics={PANDEMICS} onSelect={scrollToPandemic} />

        {/* Death toll comparison */}
        <DeathTollChart pandemics={PANDEMICS} />

        {/* Most Catastrophic top-5 */}
        <MostCatastrophicList pandemics={PANDEMICS} />

        {/* What We Learned */}
        <WhatWeLearned />

        {/* Compare */}
        <ComparePanel />

        {/* Filter + Sort controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Era filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => setEraFilter(era)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      eraFilter === era
                        ? era === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${ERA_COLORS[era] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      eraFilter === era
                        ? era === 'All'
                          ? '#e2e8f0'
                          : ERA_COLORS[era] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {era}
                </button>
              ))}
            </div>

            {/* Impact filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {IMPACTS.map((impact) => (
                <button
                  key={impact}
                  onClick={() => setImpactFilter(impact)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      impactFilter === impact
                        ? impact === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${IMPACT_COLORS[impact] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      impactFilter === impact
                        ? impact === 'All'
                          ? '#e2e8f0'
                          : IMPACT_COLORS[impact] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {impact}
                </button>
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e2e8f0',
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Pandemic cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((p, i) => (
            <div key={p.slug} id={`pandemic-${p.slug}`}>
              <PandemicCard pandemic={p} index={i} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>
            No pandemics match these filters.
          </div>
        )}
      </section>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: value.length > 6 ? 16 : 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}
