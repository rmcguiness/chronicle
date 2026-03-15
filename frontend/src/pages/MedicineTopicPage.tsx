/**
 * MedicineTopicPage — curated topic page: History of Medicine.
 *
 * Route: /medicine
 *
 * Sections:
 *  1. Hero — page title, intro, stats
 *  2. Filter bar — category + era filters
 *  3. Milestones timeline — 30+ entries from Imhotep to CRISPR
 *  4. Diseases Conquered — smallpox, polio, etc.
 *  5. Biggest Killers vs Medicine's Response — comparative timeline
 *  6. Still Unsolved — Alzheimer's, cancers, etc.
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MedCategory =
  | 'Surgery'
  | 'Vaccine'
  | 'Pharmacology'
  | 'Anatomy'
  | 'Epidemiology'
  | 'Genetics'
  | 'Diagnostics'
  | 'Public Health';

type Era =
  | 'Ancient'
  | 'Medieval'
  | 'Early Modern'
  | '18th-19th Century'
  | '20th Century'
  | '21st Century';

interface Milestone {
  name: string;
  year: number;
  isBce: boolean;
  discoverer: string;
  category: MedCategory;
  whatItChanged: string;
  livesSaved?: string;
  era: Era;
  slug?: string;
}

interface DiseaseConquered {
  disease: string;
  yearDeclared: number;
  method: string;
  livesSaved: string;
  status: 'Eradicated' | 'Near-eradication' | 'Controlled';
}

interface BiggestKiller {
  disease: string;
  peakDeaths: string;
  medicalResponse: string;
  yearOfResponse: number;
  currentStatus: string;
}

interface Unsolved {
  condition: string;
  affectedPerYear: string;
  currentApproach: string;
  whyHard: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<MedCategory, string> = {
  Surgery: '#ef4444',
  Vaccine: '#22c55e',
  Pharmacology: '#3b82f6',
  Anatomy: '#f97316',
  Epidemiology: '#a855f7',
  Genetics: '#ec4899',
  Diagnostics: '#14b8a6',
  'Public Health': '#eab308',
};

const CATEGORY_ICONS: Record<MedCategory, string> = {
  Surgery: '\u{1FA7A}',
  Vaccine: '\u{1F489}',
  Pharmacology: '\u{1F48A}',
  Anatomy: '\u{1FAC0}',
  Epidemiology: '\u{1F4CA}',
  Genetics: '\u{1F9EC}',
  Diagnostics: '\u{1F52C}',
  'Public Health': '\u{1F3E5}',
};

const ERA_ORDER: Era[] = [
  'Ancient',
  'Medieval',
  'Early Modern',
  '18th-19th Century',
  '20th Century',
  '21st Century',
];

const MILESTONES: Milestone[] = [
  // ANCIENT
  {
    name: 'Imhotep — First Named Physician',
    year: 2650,
    isBce: true,
    discoverer: 'Imhotep',
    category: 'Public Health',
    whatItChanged:
      'Imhotep is the first physician known by name, serving as chief minister and healer to Pharaoh Djoser. He established medicine as a practice distinct from magic and religion, laying groundwork for systematic healing.',
    era: 'Ancient',
    slug: 'imhotep-physician',
  },
  {
    name: 'Ayurvedic Medicine Codified',
    year: 1500,
    isBce: true,
    discoverer: 'Charaka & Sushruta',
    category: 'Pharmacology',
    whatItChanged:
      'The Vedic texts systematized herbal medicine, surgical techniques, and holistic health into a comprehensive medical system. Sushruta\'s Samhita described over 300 surgical procedures including rhinoplasty.',
    era: 'Ancient',
  },
  {
    name: 'Hippocrates — Father of Medicine',
    year: 460,
    isBce: true,
    discoverer: 'Hippocrates of Kos',
    category: 'Public Health',
    whatItChanged:
      'Hippocrates separated medicine from superstition, establishing clinical observation as the basis for diagnosis. The Hippocratic Oath he inspired remains the ethical foundation of medical practice worldwide.',
    era: 'Ancient',
    slug: 'hippocrates',
  },
  {
    name: 'Galen\'s Medical System',
    year: 129,
    isBce: false,
    discoverer: 'Galen of Pergamon',
    category: 'Anatomy',
    whatItChanged:
      'Galen\'s anatomical writings and theory of humors dominated Western medicine for 1,400 years. His systematic approach to anatomy, though often based on animal dissection, was unchallenged until Vesalius.',
    era: 'Ancient',
  },
  // MEDIEVAL
  {
    name: 'Islamic Hospital System',
    year: 805,
    isBce: false,
    discoverer: 'Harun al-Rashid & Islamic scholars',
    category: 'Public Health',
    whatItChanged:
      'The bimaristan system created the world\'s first true hospitals with separate wards, medical records, and pharmacies. These institutions pioneered the concept of healthcare as a public service.',
    era: 'Medieval',
  },
  {
    name: 'Ibn Sina\'s Canon of Medicine',
    year: 1025,
    isBce: false,
    discoverer: 'Ibn Sina (Avicenna)',
    category: 'Pharmacology',
    whatItChanged:
      'The Canon systematized all known medical knowledge into five volumes, serving as the standard medical textbook in Europe and the Islamic world for over 500 years. It introduced clinical trials and experimental medicine.',
    era: 'Medieval',
    slug: 'avicenna-canon-medicine',
  },
  {
    name: 'Quarantine Invented (Black Death)',
    year: 1347,
    isBce: false,
    discoverer: 'Republic of Ragusa & Venice',
    category: 'Epidemiology',
    whatItChanged:
      'The Black Death killed a third of Europe, but Venetian authorities invented the 40-day quarantine (quarantina) for arriving ships. This was history\'s first systematic public health measure against epidemic disease.',
    livesSaved: 'Millions over subsequent centuries',
    era: 'Medieval',
    slug: 'black-death-europe',
  },
  // EARLY MODERN
  {
    name: 'Vesalius — Human Anatomy Revolution',
    year: 1543,
    isBce: false,
    discoverer: 'Andreas Vesalius',
    category: 'Anatomy',
    whatItChanged:
      'De Humani Corporis Fabrica corrected over 200 of Galen\'s anatomical errors through direct human dissection. Vesalius proved that understanding the body required observation, not ancient authority.',
    era: 'Early Modern',
  },
  {
    name: 'William Harvey — Blood Circulation',
    year: 1628,
    isBce: false,
    discoverer: 'William Harvey',
    category: 'Anatomy',
    whatItChanged:
      'Harvey demonstrated that blood circulates through the body in a closed loop, pumped by the heart. This overturned Galen\'s model and established experimental physiology as a science.',
    era: 'Early Modern',
  },
  {
    name: 'Leeuwenhoek Discovers Microorganisms',
    year: 1676,
    isBce: false,
    discoverer: 'Antonie van Leeuwenhoek',
    category: 'Diagnostics',
    whatItChanged:
      'Using handcrafted microscopes with 270x magnification, Leeuwenhoek became the first to observe bacteria, protozoa, and blood cells. His "animalcules" were the first evidence of the microbial world that causes disease.',
    era: 'Early Modern',
  },
  // 18TH-19TH CENTURY
  {
    name: 'Jenner\'s Smallpox Vaccine',
    year: 1796,
    isBce: false,
    discoverer: 'Edward Jenner',
    category: 'Vaccine',
    whatItChanged:
      'Jenner demonstrated that cowpox inoculation prevented smallpox, creating the world\'s first vaccine. This single innovation led to the complete eradication of smallpox in 1980, the greatest medical triumph in history.',
    livesSaved: '~500 million lives (20th century alone)',
    era: '18th-19th Century',
    slug: 'jenner-smallpox-vaccine',
  },
  {
    name: 'John Snow — Birth of Epidemiology',
    year: 1854,
    isBce: false,
    discoverer: 'John Snow',
    category: 'Epidemiology',
    whatItChanged:
      'Snow mapped cholera cases in London\'s Soho, tracing the outbreak to a contaminated water pump on Broad Street. His spatial analysis method founded modern epidemiology and proved disease could be tracked through data.',
    livesSaved: 'Millions through water sanitation reforms',
    era: '18th-19th Century',
  },
  {
    name: 'Florence Nightingale — Nursing & Statistics',
    year: 1854,
    isBce: false,
    discoverer: 'Florence Nightingale',
    category: 'Public Health',
    whatItChanged:
      'Nightingale used statistical analysis to prove that sanitary conditions, not battle wounds, caused most military deaths. Her polar area diagrams revolutionized data visualization and established professional nursing.',
    livesSaved: 'Countless through hospital reform',
    era: '18th-19th Century',
  },
  {
    name: 'Pasteur\'s Germ Theory',
    year: 1861,
    isBce: false,
    discoverer: 'Louis Pasteur',
    category: 'Epidemiology',
    whatItChanged:
      'Pasteur\'s experiments disproved spontaneous generation and proved that microorganisms cause fermentation and disease. Germ theory transformed medicine from guesswork into a science of identifiable, treatable causes.',
    livesSaved: 'Billions (foundational to all modern medicine)',
    era: '18th-19th Century',
    slug: 'pasteur-germ-theory',
  },
  {
    name: 'Lister\'s Antiseptic Surgery',
    year: 1867,
    isBce: false,
    discoverer: 'Joseph Lister',
    category: 'Surgery',
    whatItChanged:
      'Lister applied Pasteur\'s germ theory to surgery, using carbolic acid to sterilize instruments and wounds. Surgical mortality plummeted from ~50% to under 15%, making previously fatal operations survivable.',
    livesSaved: 'Hundreds of millions',
    era: '18th-19th Century',
  },
  {
    name: 'Koch\'s Bacterial Culture Method',
    year: 1876,
    isBce: false,
    discoverer: 'Robert Koch',
    category: 'Diagnostics',
    whatItChanged:
      'Koch\'s postulates established the scientific standard for proving that a specific microbe causes a specific disease. His pure culture technique enabled identification of tuberculosis, cholera, and anthrax bacteria.',
    livesSaved: 'Millions through targeted treatments',
    era: '18th-19th Century',
  },
  {
    name: 'R\u00f6ntgen Discovers X-rays',
    year: 1895,
    isBce: false,
    discoverer: 'Wilhelm R\u00f6ntgen',
    category: 'Diagnostics',
    whatItChanged:
      'R\u00f6ntgen\'s accidental discovery of X-rays gave doctors the ability to see inside the living body for the first time. Within months, X-rays were being used to find fractures and foreign objects, transforming diagnosis.',
    era: '18th-19th Century',
  },
  // 20TH CENTURY
  {
    name: 'Ehrlich\'s "Magic Bullet" — Salvarsan',
    year: 1909,
    isBce: false,
    discoverer: 'Paul Ehrlich',
    category: 'Pharmacology',
    whatItChanged:
      'Ehrlich developed Salvarsan (arsphenamine), the first effective antimicrobial drug, targeting syphilis. His concept of a "magic bullet" — a chemical that kills pathogens without harming the patient — founded chemotherapy.',
    era: '20th Century',
  },
  {
    name: 'Discovery of Insulin',
    year: 1921,
    isBce: false,
    discoverer: 'Frederick Banting & Charles Best',
    category: 'Pharmacology',
    whatItChanged:
      'Before insulin, Type 1 diabetes was a death sentence within months. Banting and Best\'s extraction of insulin from dog pancreases transformed diabetes from a fatal disease into a manageable chronic condition.',
    livesSaved: '~100 million+ since discovery',
    era: '20th Century',
  },
  {
    name: 'Fleming Discovers Penicillin',
    year: 1928,
    isBce: false,
    discoverer: 'Alexander Fleming',
    category: 'Pharmacology',
    whatItChanged:
      'Fleming\'s observation that Penicillium mold killed bacteria launched the antibiotic era. Mass-produced by Florey and Chain in WWII, penicillin has saved an estimated 200 million lives and made modern surgery possible.',
    livesSaved: '~200 million+',
    era: '20th Century',
    slug: 'penicillin-discovery',
  },
  {
    name: 'Discovery of DNA Structure',
    year: 1953,
    isBce: false,
    discoverer: 'Watson, Crick, Franklin & Wilkins',
    category: 'Genetics',
    whatItChanged:
      'The double helix structure of DNA revealed how genetic information is stored, copied, and transmitted. This discovery is the foundation of all modern genetics, genomic medicine, and biotechnology.',
    era: '20th Century',
    slug: 'dna-structure-discovery',
  },
  {
    name: 'Salk Polio Vaccine',
    year: 1955,
    isBce: false,
    discoverer: 'Jonas Salk',
    category: 'Vaccine',
    whatItChanged:
      'Salk\'s inactivated poliovirus vaccine ended the terror of summer polio epidemics that paralyzed thousands of children annually. Polio cases dropped 99.9% worldwide, from 350,000 in 1988 to near zero today.',
    livesSaved: '~1.8 million paralytic cases prevented',
    era: '20th Century',
  },
  {
    name: 'First Heart Transplant',
    year: 1967,
    isBce: false,
    discoverer: 'Christiaan Barnard',
    category: 'Surgery',
    whatItChanged:
      'Barnard performed the first human-to-human heart transplant in Cape Town, South Africa. Though the patient survived only 18 days, the procedure proved organ transplantation was possible, saving millions of lives since.',
    livesSaved: '~100,000+ annually worldwide',
    era: '20th Century',
  },
  {
    name: 'First MRI Scan',
    year: 1977,
    isBce: false,
    discoverer: 'Raymond Damadian & Paul Lauterbur',
    category: 'Diagnostics',
    whatItChanged:
      'MRI gave doctors the ability to image soft tissue — brain, organs, tumors — without radiation or surgery. It revolutionized neurology, oncology, and orthopedics, enabling early detection of countless conditions.',
    era: '20th Century',
  },
  {
    name: 'AZT — First HIV/AIDS Treatment',
    year: 1987,
    isBce: false,
    discoverer: 'Hiroaki Mitsuya & Samuel Broder (NCI)',
    category: 'Pharmacology',
    whatItChanged:
      'AZT (zidovudine) was the first antiretroviral drug approved for HIV/AIDS, extending lives during the worst years of the epidemic. It paved the way for combination therapy (HAART) that turned HIV from a death sentence into a manageable condition.',
    livesSaved: '~21 million on antiretroviral therapy today',
    era: '20th Century',
  },
  {
    name: 'Human Genome Project Completed',
    year: 2003,
    isBce: false,
    discoverer: 'International consortium (Francis Collins, Craig Venter)',
    category: 'Genetics',
    whatItChanged:
      'Sequencing all 3 billion base pairs of human DNA took 13 years and $2.7 billion. It unlocked personalized medicine, pharmacogenomics, and the ability to identify genetic risk factors for thousands of diseases.',
    era: '20th Century',
    slug: 'human-genome-project',
  },
  // 21ST CENTURY
  {
    name: 'CRISPR-Cas9 Gene Editing',
    year: 2012,
    isBce: false,
    discoverer: 'Jennifer Doudna & Emmanuelle Charpentier',
    category: 'Genetics',
    whatItChanged:
      'CRISPR enabled precise, cheap, and fast editing of DNA in any organism. It opened the door to curing genetic diseases like sickle cell anemia, engineering crops, and fundamentally altering the future of medicine.',
    era: '21st Century',
  },
  {
    name: 'mRNA COVID-19 Vaccines',
    year: 2020,
    isBce: false,
    discoverer: 'Katalin Karik\u00f3, Drew Weissman (BioNTech/Pfizer, Moderna)',
    category: 'Vaccine',
    whatItChanged:
      'mRNA vaccines were developed in under a year — a process that previously took a decade. They demonstrated a revolutionary platform that can be rapidly adapted to new pathogens, potentially transforming pandemic response forever.',
    livesSaved: '~20 million lives in first year alone (estimated)',
    era: '21st Century',
  },
  {
    name: 'CAR-T Cell Therapy',
    year: 2017,
    isBce: false,
    discoverer: 'Carl June & others',
    category: 'Genetics',
    whatItChanged:
      'CAR-T reprograms a patient\'s own immune cells to recognize and destroy cancer. FDA approval for leukemia and lymphoma achieved remission rates above 80% in patients who had exhausted all other options.',
    era: '21st Century',
  },
  {
    name: 'Alzheimer\'s Antibody Therapies',
    year: 2023,
    isBce: false,
    discoverer: 'Eisai/Biogen (lecanemab)',
    category: 'Pharmacology',
    whatItChanged:
      'Lecanemab became the first drug to convincingly slow Alzheimer\'s cognitive decline by clearing amyloid plaques. While modest, it proved the amyloid hypothesis and opened the door to combination approaches targeting neurodegeneration.',
    era: '21st Century',
  },
  {
    name: 'AI-Designed Protein Structures (AlphaFold)',
    year: 2021,
    isBce: false,
    discoverer: 'Demis Hassabis & John Jumper (DeepMind)',
    category: 'Pharmacology',
    whatItChanged:
      'AlphaFold predicted the 3D structure of virtually every known protein, a problem that had stumped biology for 50 years. This accelerated drug discovery by revealing drug targets that were previously invisible.',
    era: '21st Century',
  },
];

const DISEASES_CONQUERED: DiseaseConquered[] = [
  {
    disease: 'Smallpox',
    yearDeclared: 1980,
    method: 'Global vaccination campaign (Jenner\'s vaccine)',
    livesSaved: '~500 million (20th century deaths prevented)',
    status: 'Eradicated',
  },
  {
    disease: 'Polio',
    yearDeclared: 2024,
    method: 'Salk & Sabin vaccines, GPEI campaign',
    livesSaved: '~18 million walking, ~1.5 million deaths prevented',
    status: 'Near-eradication',
  },
  {
    disease: 'Rinderpest',
    yearDeclared: 2011,
    method: 'Veterinary vaccination (cattle plague)',
    livesSaved: 'Prevented famines affecting millions',
    status: 'Eradicated',
  },
  {
    disease: 'Guinea Worm',
    yearDeclared: 2025,
    method: 'Water filtration, health education (no vaccine)',
    livesSaved: 'From 3.5 million cases (1986) to <15',
    status: 'Near-eradication',
  },
  {
    disease: 'Measles',
    yearDeclared: 2000,
    method: 'MMR vaccine (eliminated from many countries)',
    livesSaved: '~56 million deaths prevented (2000\u20132021)',
    status: 'Controlled',
  },
];

const BIGGEST_KILLERS: BiggestKiller[] = [
  {
    disease: 'Bubonic Plague',
    peakDeaths: '~75\u2013200 million (14th century)',
    medicalResponse: 'Quarantine, antibiotics (streptomycin)',
    yearOfResponse: 1347,
    currentStatus: 'Treatable with antibiotics; ~650 cases/year globally',
  },
  {
    disease: 'Smallpox',
    peakDeaths: '~300\u2013500 million (20th century alone)',
    medicalResponse: 'Vaccination (Jenner, 1796)',
    yearOfResponse: 1796,
    currentStatus: 'Eradicated in 1980',
  },
  {
    disease: 'Tuberculosis',
    peakDeaths: '~1 billion (over two centuries)',
    medicalResponse: 'BCG vaccine (1921), antibiotics (streptomycin, 1944)',
    yearOfResponse: 1921,
    currentStatus: '~1.3 million deaths/year; drug-resistant strains emerging',
  },
  {
    disease: 'Malaria',
    peakDeaths: '~50% of all humans who ever lived (estimated)',
    medicalResponse: 'Quinine (1820s), artemisinin, RTS,S vaccine (2021)',
    yearOfResponse: 1820,
    currentStatus: '~620,000 deaths/year; first vaccine approved 2021',
  },
  {
    disease: 'HIV/AIDS',
    peakDeaths: '~40 million since 1981',
    medicalResponse: 'AZT (1987), HAART (1996), PrEP',
    yearOfResponse: 1987,
    currentStatus: '~630,000 deaths/year; 39 million living with HIV',
  },
  {
    disease: 'COVID-19',
    peakDeaths: '~7 million confirmed (likely 15\u201325 million)',
    medicalResponse: 'mRNA vaccines, Paxlovid antivirals',
    yearOfResponse: 2020,
    currentStatus: 'Endemic; updated boosters available',
  },
];

const STILL_UNSOLVED: Unsolved[] = [
  {
    condition: 'Alzheimer\'s Disease',
    affectedPerYear: '~55 million worldwide',
    currentApproach: 'Amyloid-clearing antibodies (lecanemab), tau-targeting drugs in trials',
    whyHard: 'The brain\'s complexity, blood-brain barrier, and decades-long disease progression make treatment extremely difficult. We still don\'t fully understand the cause.',
  },
  {
    condition: 'Pancreatic Cancer',
    affectedPerYear: '~496,000 new cases/year',
    currentApproach: 'Surgery, chemotherapy, immunotherapy trials',
    whyHard: 'Usually detected too late (5-year survival ~12%). The pancreas\'s location and the cancer\'s resistance to drugs make it the deadliest common cancer.',
  },
  {
    condition: 'Antibiotic Resistance',
    affectedPerYear: '~1.27 million deaths/year directly attributable',
    currentApproach: 'New antibiotic classes, phage therapy, antimicrobial stewardship',
    whyHard: 'Bacteria evolve resistance faster than we develop new drugs. Few pharmaceutical companies invest in antibiotics due to low profit margins.',
  },
  {
    condition: 'ALS (Lou Gehrig\'s Disease)',
    affectedPerYear: '~30,000 in US at any time',
    currentApproach: 'Gene therapy, antisense oligonucleotides, tofersen (SOD1)',
    whyHard: 'Motor neuron degeneration is poorly understood and involves multiple genetic pathways. No treatment reverses damage once it begins.',
  },
  {
    condition: 'Sepsis',
    affectedPerYear: '~49 million cases, ~11 million deaths/year',
    currentApproach: 'Early detection biomarkers, bundled care protocols',
    whyHard: 'Sepsis is the body\'s own immune response gone haywire. Every patient\'s response is different, making targeted treatment almost impossible.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MedicineTopicPage() {
  const [selectedCategory, setSelectedCategory] = useState<MedCategory | 'All'>('All');
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');

  // Allow scrolling on this page (root is overflow:hidden for canvas)
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

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      if (selectedCategory !== 'All' && m.category !== selectedCategory) return false;
      if (selectedEra !== 'All' && m.era !== selectedEra) return false;
      return true;
    });
  }, [selectedCategory, selectedEra]);

  const categories: MedCategory[] = [
    'Surgery',
    'Vaccine',
    'Pharmacology',
    'Anatomy',
    'Epidemiology',
    'Genetics',
    'Diagnostics',
    'Public Health',
  ];

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
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '48px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background:
              'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(34,197,94,0.08) 100%)',
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
              marginBottom: 28,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            \u2190 Back to Timeline
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'rgba(34,197,94,0.15)',
                border: '2px solid rgba(34,197,94,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
                boxShadow: '0 0 24px rgba(34,197,94,0.2)',
              }}
            >
              \u2695\uFE0F
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(34,197,94,0.15)',
                color: '#22c55e',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Topic Page
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            History of Medicine
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 700,
              margin: 0,
            }}
          >
            From ancient herbalism to CRISPR gene editing — the milestones, breakthroughs, and
            people who conquered disease and transformed human life.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 24,
            }}
          >
            <StatBadge value={`${MILESTONES.length}+`} label="Milestones" />
            <StatBadge value="4,600+" label="Years of History" />
            <StatBadge value="~1B+" label="Lives Saved" />
          </div>
        </motion.div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginRight: 4,
            }}
          >
            Category:
          </span>
          <FilterPill
            label="All"
            active={selectedCategory === 'All'}
            onClick={() => setSelectedCategory('All')}
          />
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              label={`${CATEGORY_ICONS[cat]} ${cat}`}
              active={selectedCategory === cat}
              color={CATEGORY_COLORS[cat]}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>

        <div
          style={{
            padding: '12px 32px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginRight: 4,
            }}
          >
            Era:
          </span>
          <FilterPill
            label="All Eras"
            active={selectedEra === 'All'}
            onClick={() => setSelectedEra('All')}
          />
          {ERA_ORDER.map((era) => (
            <FilterPill
              key={era}
              label={era}
              active={selectedEra === era}
              onClick={() => setSelectedEra(era)}
            />
          ))}
        </div>

        {/* ── Milestones ──────────────────────────────────────────────── */}
        <section style={{ padding: '28px 32px' }}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            \u{1F9EA} Milestones ({filteredMilestones.length})
          </h2>

          {filteredMilestones.length === 0 && (
            <div
              style={{
                padding: '20px 24px',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b',
                fontSize: 14,
              }}
            >
              No milestones match the current filters.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMilestones.map((m, i) => (
              <MilestoneCard key={m.name} milestone={m} index={i} />
            ))}
          </div>
        </section>

        {/* ── Diseases Conquered ──────────────────────────────────────── */}
        <section
          style={{
            padding: '28px 32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            \u{1F3C6} Diseases Conquered
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}
          >
            {DISEASES_CONQUERED.map((d, i) => (
              <motion.div
                key={d.disease}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
                style={{
                  padding: '18px 20px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(34,197,94,0.25)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}
                  >
                    {d.disease}
                  </span>
                  <StatusBadge status={d.status} />
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 6 }}>
                  {d.method}
                </div>
                <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                  {d.livesSaved}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                  Declared: {d.yearDeclared}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Biggest Killers vs Medicine's Response ───────────────────── */}
        <section
          style={{
            padding: '28px 32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            \u{1F480} Biggest Killers vs. Medicine's Response
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
                minWidth: 700,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {['Disease', 'Peak Deaths', 'Medical Response', 'Year', 'Current Status'].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          color: '#64748b',
                          fontWeight: 700,
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {BIGGEST_KILLERS.map((k) => (
                  <tr
                    key={k.disease}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 700,
                        color: '#f1f5f9',
                      }}
                    >
                      {k.disease}
                    </td>
                    <td style={{ padding: '12px', color: '#ef4444' }}>
                      {k.peakDeaths}
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>
                      {k.medicalResponse}
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>
                      {k.yearOfResponse}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1', fontSize: 12 }}>
                      {k.currentStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Still Unsolved ──────────────────────────────────────────── */}
        <section
          style={{
            padding: '28px 32px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            \u{1F6A8} Still Unsolved
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {STILL_UNSOLVED.map((u, i) => (
              <motion.div
                key={u.condition}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                style={{
                  padding: '20px 24px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}
                  >
                    {u.condition}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#ef4444',
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor: 'rgba(239,68,68,0.12)',
                    }}
                  >
                    {u.affectedPerYear} affected
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#94a3b8',
                    lineHeight: 1.65,
                    marginBottom: 8,
                  }}
                >
                  <strong style={{ color: '#cbd5e1' }}>Current approach:</strong>{' '}
                  {u.currentApproach}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#64748b',
                    lineHeight: 1.65,
                    fontStyle: 'italic',
                  }}
                >
                  {u.whyHard}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Footer nav ──────────────────────────────────────────────── */}
        <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            \u2190 Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '10px 18px',
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: '#22c55e' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        border: active
          ? `1px solid ${color ?? '#60a5fa'}`
          : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: active
          ? `${color ?? '#60a5fa'}22`
          : 'rgba(255,255,255,0.04)',
        color: active ? color ?? '#60a5fa' : '#94a3b8',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function MilestoneCard({ milestone: m, index }: { milestone: Milestone; index: number }) {
  const color = CATEGORY_COLORS[m.category];
  const icon = CATEGORY_ICONS[m.category];
  const yearDisplay = m.isBce ? `${m.year} BCE` : String(m.year);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      style={{
        padding: '20px 24px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}33`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top row: badge + year */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: 4,
            backgroundColor: `${color}22`,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}
        >
          {icon} {m.category}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#64748b',
            fontFamily: 'monospace',
          }}
        >
          {yearDisplay}
        </span>
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#f1f5f9',
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {m.name}
      </h3>

      {/* Discoverer */}
      <div style={{ fontSize: 13, color: '#94a3b8' }}>
        <strong style={{ color: '#cbd5e1' }}>{m.discoverer}</strong>
      </div>

      {/* What it changed */}
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
        {m.whatItChanged}
      </div>

      {/* Lives saved + Chronicle link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 4,
        }}
      >
        {m.livesSaved && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#22c55e',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(34,197,94,0.1)',
            }}
          >
            \u{2764}\uFE0F Lives saved: {m.livesSaved}
          </span>
        )}
        {m.slug ? (
          <Link
            to={`/event/${m.slug}`}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 4,
              border: '1px solid rgba(96,165,250,0.25)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            Find in Chronicle \u2192
          </Link>
        ) : (
          <span
            style={{
              fontSize: 12,
              color: '#475569',
              fontStyle: 'italic',
            }}
          >
            Find in Chronicle \u2192
          </span>
        )}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: DiseaseConquered['status'] }) {
  const map = {
    Eradicated: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    'Near-eradication': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    Controlled: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  };
  const { color, bg } = map[status];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 4,
        backgroundColor: bg,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}
    >
      {status}
    </span>
  );
}
