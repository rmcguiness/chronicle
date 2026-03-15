/**
 * MedicineHistoryPage — comprehensive deep-dive on the history of medicine.
 *
 * Route: /medicine-history
 *
 * Sections:
 *  1. Hero — headline, framing
 *  2. Ancient medicine — Egyptian papyri, Hippocrates, Galen, Avicenna
 *  3. Germ theory revolution — Semmelweis, Pasteur, Koch, Lister
 *  4. Surgical revolution — anesthesia, antisepsis, antibiotics, transplants
 *  5. 20th century milestones — insulin, penicillin, polio, DNA, CT/MRI, HIV, CRISPR
 *  6. Major disease conquests — smallpox, polio, childhood diseases, cholera
 *  7. COVID-19 and mRNA vaccines
 *  8. Key figures gallery
 *  9. Modern challenges
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';
const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

const ANCIENT_MEDICINE: TimelineEntry[] = [
  {
    year: 'c. 1550 BCE',
    title: 'Ebers Papyrus',
    description:
      'One of the oldest and most important medical texts ever found. This Egyptian scroll contains over 700 remedies and prescriptions — mixing empirical observation with magical incantations. It describes treatments for asthma, diabetes, and eye diseases that are recognizably medical.',
    color: GOLD,
  },
  {
    year: 'c. 460 BCE',
    title: 'Hippocrates & Rational Medicine',
    description:
      'The "Father of Medicine" rejected supernatural explanations for disease. His revolutionary insight: diseases have natural causes and can be studied systematically. The Hippocratic Corpus established clinical observation, patient history, and ethical practice (the Hippocratic Oath) as foundations of medicine.',
    color: ACCENT,
  },
  {
    year: 'c. 129–216 CE',
    title: 'Galen & Anatomy',
    description:
      'Roman physician whose anatomical writings dominated Western medicine for 1,300 years. Performed dissections on animals (human dissection was forbidden) and made important discoveries about the nervous and circulatory systems — though many conclusions were wrong and went unchallenged for centuries.',
    color: RED,
  },
  {
    year: '1025 CE',
    title: "Avicenna's Canon of Medicine",
    description:
      'Ibn Sina (Avicenna) wrote the most influential medical textbook in history. The Canon synthesized Greek, Roman, and Islamic medical knowledge into a systematic encyclopedia. It was used as a standard medical text in Europe and the Islamic world until the 18th century — over 700 years.',
    color: TEAL,
  },
];

const GERM_THEORY: TimelineEntry[] = [
  {
    year: '1847',
    title: 'Semmelweis — Handwashing Saves Lives',
    description:
      'Ignaz Semmelweis proved that doctors washing hands between autopsies and deliveries reduced maternal death from 18% to under 2%. The medical establishment rejected and mocked him. He was committed to an asylum and died at 47 — beaten by guards. He was vindicated only after his death.',
    color: RED,
  },
  {
    year: '1862–1885',
    title: 'Pasteur — Germ Theory & Vaccines',
    description:
      'Louis Pasteur proved that microorganisms cause fermentation and disease, demolishing the theory of spontaneous generation. He developed pasteurization, created vaccines for chicken cholera, anthrax, and rabies, and established microbiology as a science. His rabies vaccine (1885) made him a global hero.',
    color: ACCENT,
  },
  {
    year: '1876–1882',
    title: "Koch's Postulates",
    description:
      'Robert Koch established the scientific framework for proving that specific microbes cause specific diseases. He identified the bacteria behind anthrax (1876), tuberculosis (1882), and cholera (1883). His postulates remain foundational to infectious disease research.',
    color: GREEN,
  },
  {
    year: '1867',
    title: 'Lister & Antiseptic Surgery',
    description:
      "Joseph Lister applied Pasteur's germ theory to surgery, introducing carbolic acid as an antiseptic. Surgical mortality plummeted. Before Lister, nearly half of surgical patients died from infection. Antiseptic (and later aseptic) technique made modern surgery possible.",
    color: PURPLE,
  },
];

const SURGICAL_REVOLUTION: TimelineEntry[] = [
  {
    year: '1846',
    title: 'Anesthesia',
    description:
      'William Morton publicly demonstrated ether anesthesia at Massachusetts General Hospital. The surgeon declared "Gentlemen, this is no humbug." For the first time, patients could undergo surgery without agonizing pain — transforming surgery from butchery into a precise medical discipline.',
    color: ACCENT,
  },
  {
    year: '1867',
    title: 'Antiseptic Surgery',
    description:
      "Lister's carbolic acid spray and sterile technique slashed post-surgical infection rates. Combined with anesthesia, this opened the door to longer, more complex operations that would have been impossible (or fatal) before.",
    color: TEAL,
  },
  {
    year: '1928',
    title: 'Penicillin — The Antibiotic Revolution',
    description:
      'Alexander Fleming noticed that a mold (Penicillium notatum) killed bacteria in a petri dish. Howard Florey and Ernst Boris Chain later developed it into a usable drug. By D-Day (1944), penicillin was saving thousands of soldiers\' lives. Antibiotics became the most important class of drugs in history.',
    color: GOLD,
  },
  {
    year: '1954–1967',
    title: 'Organ Transplants',
    description:
      'Joseph Murray performed the first successful kidney transplant between identical twins (1954). Christiaan Barnard performed the first human heart transplant in Cape Town (1967). Immunosuppressive drugs later made transplants between non-relatives viable, saving millions of lives.',
    color: GREEN,
  },
];

const TWENTIETH_CENTURY: TimelineEntry[] = [
  {
    year: '1921',
    title: 'Insulin — Conquering Diabetes',
    description:
      'Frederick Banting and Charles Best isolated insulin at the University of Toronto. Before insulin, a diabetes diagnosis was a death sentence. The first patient treated, 14-year-old Leonard Thompson, went from near-death to recovery in days. Banting shared his Nobel Prize money with Best.',
    color: GREEN,
  },
  {
    year: '1953',
    title: 'DNA Structure Discovered',
    description:
      'James Watson and Francis Crick described the double helix structure of DNA — building on crucial X-ray crystallography work by Rosalind Franklin (who received no credit during her lifetime). This discovery launched molecular biology and eventually made gene therapy, genomics, and personalized medicine possible.',
    color: PURPLE,
  },
  {
    year: '1955',
    title: 'Salk Polio Vaccine',
    description:
      'Jonas Salk\'s inactivated polio vaccine was declared "safe, effective, and potent." Church bells rang across America. Salk refused to patent it, saying "Could you patent the sun?" The vaccine, along with Albert Sabin\'s oral vaccine (1961), has brought polio to the brink of eradication.',
    color: ACCENT,
  },
  {
    year: '1971–1977',
    title: 'CT Scans & MRI',
    description:
      'Godfrey Hounsfield developed the CT scanner (1971), and Raymond Damadian, Paul Lauterbur, and Peter Mansfield pioneered MRI (1977). For the first time, doctors could see inside the living body in extraordinary detail without surgery — revolutionizing diagnosis of cancer, stroke, and neurological diseases.',
    color: TEAL,
  },
  {
    year: '1981–1996',
    title: 'HIV/AIDS — From Death Sentence to Chronic Condition',
    description:
      'AIDS was identified in 1981 and killed millions before effective treatment arrived. AZT (1987) was the first antiretroviral, but the real breakthrough was HAART combination therapy (1996), which transformed HIV from a death sentence into a manageable chronic condition. Activist groups like ACT UP forced faster drug approvals.',
    color: RED,
  },
  {
    year: '2012',
    title: 'CRISPR Gene Editing',
    description:
      'Jennifer Doudna and Emmanuelle Charpentier published their breakthrough CRISPR-Cas9 paper, giving scientists a precise, cheap, and fast way to edit DNA. CRISPR has already been used to treat sickle cell disease and holds promise for curing genetic disorders, cancers, and viral infections.',
    color: GOLD,
  },
];

interface DiseaseConquest {
  disease: string;
  milestone: string;
  detail: string;
  color: string;
  status: string;
}

const DISEASE_CONQUESTS: DiseaseConquest[] = [
  {
    disease: 'Smallpox',
    milestone: 'Eradicated 1980',
    detail:
      'The only human disease ever fully eradicated. Killed an estimated 300 million people in the 20th century alone before a global WHO vaccination campaign eliminated it. The last natural case was in Somalia in 1977.',
    color: GREEN,
    status: 'ERADICATED',
  },
  {
    disease: 'Polio',
    milestone: 'Near-eradicated',
    detail:
      'Cases reduced by 99.9% since 1988 through global vaccination. Wild poliovirus remains endemic in only Afghanistan and Pakistan. The disease that once paralyzed 350,000 children a year is on the verge of becoming the second human disease eradicated.',
    color: ACCENT,
    status: '99.9% REDUCED',
  },
  {
    disease: 'Measles',
    milestone: 'Vaccine 1963',
    detail:
      'Before the vaccine, measles killed 2.6 million people per year. Vaccination has prevented an estimated 56 million deaths between 2000 and 2021. But declining vaccination rates have caused deadly outbreaks — measles is the "canary in the coalmine" for vaccine coverage.',
    color: GOLD,
    status: 'PREVENTABLE',
  },
  {
    disease: 'Cholera',
    milestone: 'Understood 1854',
    detail:
      "John Snow traced a London cholera outbreak to a contaminated water pump — founding epidemiology. Cholera is now preventable through clean water and sanitation, but still kills 21,000–143,000 people per year in areas without infrastructure.",
    color: TEAL,
    status: 'ONGOING',
  },
];

interface CovidEntry {
  label: string;
  detail: string;
  color: string;
}

const COVID_TIMELINE: CovidEntry[] = [
  {
    label: 'January 2020 — Virus sequenced',
    detail: 'Chinese scientists shared the SARS-CoV-2 genome within days. Moderna designed its mRNA vaccine in just 2 days using the sequence.',
    color: ACCENT,
  },
  {
    label: 'March 2020 — Global pandemic declared',
    detail: 'WHO declared COVID-19 a pandemic. Lockdowns began worldwide. The race for a vaccine became the most urgent medical challenge in a generation.',
    color: RED,
  },
  {
    label: 'December 2020 — First vaccines authorized',
    detail: 'Pfizer-BioNTech and Moderna mRNA vaccines received emergency authorization — just 11 months after the virus was sequenced. Average vaccine development takes 10–12 years.',
    color: GREEN,
  },
  {
    label: 'How it was possible',
    detail: 'mRNA technology had been in development for decades (Katalin Kariko\'s foundational work since the 1990s). Operation Warp Speed invested $18 billion. Manufacturing began before trials finished (financial risk, not safety risk). Regulatory reviews were parallel, not sequential.',
    color: GOLD,
  },
  {
    label: 'Impact',
    detail: 'COVID-19 vaccines are estimated to have prevented 14.4 million deaths worldwide in their first year alone (Lancet study). mRNA technology is now being developed for flu, RSV, HIV, and cancer vaccines.',
    color: PURPLE,
  },
];

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Hippocrates', years: 'c. 460–370 BCE', contribution: 'Father of Medicine — established clinical observation and medical ethics as foundations of practice' },
  { name: 'Avicenna (Ibn Sina)', years: '980–1037', contribution: 'Wrote the Canon of Medicine, the most influential medical textbook in history, used for 700+ years' },
  { name: 'Andreas Vesalius', years: '1514–1564', contribution: 'Father of modern anatomy — corrected centuries of Galen\'s errors through direct human dissection' },
  { name: 'William Harvey', years: '1578–1657', contribution: 'Discovered the circulation of blood, overturning 1,400 years of Galenic dogma' },
  { name: 'Ignaz Semmelweis', years: '1818–1865', contribution: 'Proved handwashing prevents infection — mocked by peers, vindicated after death' },
  { name: 'Louis Pasteur', years: '1822–1895', contribution: 'Proved germ theory, developed pasteurization and vaccines for anthrax and rabies' },
  { name: 'Robert Koch', years: '1843–1910', contribution: 'Identified bacteria causing TB, cholera, and anthrax; established Koch\'s postulates' },
  { name: 'Joseph Lister', years: '1827–1912', contribution: 'Pioneered antiseptic surgery, slashing post-operative death rates' },
  { name: 'Alexander Fleming', years: '1881–1955', contribution: 'Discovered penicillin — launching the antibiotic era that has saved hundreds of millions of lives' },
  { name: 'Jonas Salk', years: '1914–1995', contribution: 'Developed the polio vaccine and refused to patent it: "Could you patent the sun?"' },
  { name: 'Christiaan Barnard', years: '1922–2001', contribution: 'Performed the first human heart transplant in Cape Town, 1967' },
  { name: 'Jennifer Doudna', years: 'b. 1964', contribution: 'Co-developed CRISPR-Cas9 gene editing — Nobel Prize 2020' },
];

const MODERN_CHALLENGES = [
  { label: 'Antibiotic resistance', detail: 'Bacteria are evolving faster than we can develop new antibiotics. The WHO warns that antimicrobial resistance could cause 10 million deaths per year by 2050 — more than cancer. We are at risk of returning to a pre-antibiotic era.' },
  { label: 'Healthcare inequality', detail: 'Half the world lacks access to essential health services. Life expectancy varies by 30+ years between countries. In the US, healthcare spending is $12,000/person/year; in low-income countries, it\'s under $50.' },
  { label: 'Mental health crisis', detail: 'Depression and anxiety affect over 300 million people worldwide. Mental health receives a fraction of healthcare funding despite accounting for a huge share of disability. Stigma remains a major barrier to treatment.' },
  { label: 'Aging populations', detail: 'By 2050, the number of people over 60 will double to 2.1 billion. Age-related diseases (Alzheimer\'s, cancer, heart disease) are becoming the dominant healthcare challenge. Healthcare systems designed for acute illness struggle with chronic disease.' },
  { label: 'Pandemic preparedness', detail: 'COVID-19 exposed critical gaps in global health infrastructure. Despite lessons learned, the world remains vulnerable to novel pathogens. The next pandemic is a matter of when, not if.' },
];

const MEDICAL_TRIUMPHS = [
  { label: 'Life expectancy doubled', detail: 'Global average life expectancy rose from about 31 years in 1900 to 73 years today — the greatest improvement in human welfare in history, driven primarily by medicine and public health.' },
  { label: 'Child mortality collapsed', detail: 'In 1900, roughly 1 in 3 children died before age 5. Today, it\'s fewer than 1 in 25 — largely thanks to vaccines, antibiotics, and clean water.' },
  { label: 'Infectious disease decline', detail: 'Diseases that once killed millions (smallpox, polio, measles, diphtheria) are either eradicated or controlled through vaccination. Vaccines save 4–5 million lives per year (WHO).' },
  { label: 'Surgical possibility', detail: 'From open-heart surgery to organ transplants to robotic microsurgery — procedures that would have seemed miraculous 100 years ago are now routine.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}33`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 90,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.year}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{entry.title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function DiseaseCard({ conquest, index }: { conquest: DiseaseConquest; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      style={{
        padding: '20px 22px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${conquest.color}44`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{conquest.disease}</div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: conquest.color,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: `${conquest.color}22`,
          }}
        >
          {conquest.status}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontFamily: 'monospace' }}>{conquest.milestone}</div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{conquest.detail}</div>
    </motion.div>
  );
}

function CovidTimeline({ entries }: { entries: CovidEntry[] }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 4,
          bottom: 4,
          width: 2,
          backgroundColor: `${RED}44`,
          borderRadius: 1,
        }}
      />
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18, position: 'relative' }}
        >
          <div
            style={{
              position: 'absolute',
              left: -20,
              top: 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: e.color,
              border: '2px solid #070e22',
              boxShadow: `0 0 8px ${e.color}66`,
            }}
          />
          <div style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.label}</div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{e.detail}</div>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginBottom: 8 }}>{f.years}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.contribution}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ChallengesAndTriumphs({ challenges, triumphs }: { challenges: typeof MODERN_CHALLENGES; triumphs: typeof MEDICAL_TRIUMPHS }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 14 }}>Challenges Ahead</h3>
        {challenges.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>What Medicine Has Achieved</h3>
        {triumphs.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{r.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function MedicineHistoryPage() {
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
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '40px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${TEAL}10 100%)`,
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
            &larr; Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            The History of Medicine &mdash; From Superstition to Science
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 720,
              padding: '16px 20px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            In 1900, average global life expectancy was about <strong style={{ color: RED }}>31 years</strong>. Today it's{' '}
            <strong style={{ color: GREEN }}>73 years</strong>. Medicine has doubled human lifespan in just over a century — the
            single greatest improvement in the human condition in history. Vaccines alone save{' '}
            <strong style={{ color: ACCENT }}>4–5 million lives</strong> every year.
          </motion.div>
        </div>

        {/* ── Ancient Medicine ──────────────────────────────────────────── */}
        <SectionWrapper title="Ancient Medicine" icon={'\u{1F4DC}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            For most of human history, disease was explained by gods, demons, and imbalanced humors. The first steps toward rational medicine took millennia — and their insights were often lost, rediscovered, and lost again.
          </p>
          {ANCIENT_MEDICINE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Germ Theory Revolution ───────────────────────────────────── */}
        <SectionWrapper title="The Germ Theory Revolution" icon={'\u{1F9EB}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The single most important conceptual breakthrough in medical history: diseases are caused by specific microorganisms, not "bad air" or divine punishment. This insight — fiercely resisted by the medical establishment — made modern medicine possible.
          </p>
          {GERM_THEORY.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Surgical Revolution ──────────────────────────────────────── */}
        <SectionWrapper title="The Surgical Revolution" icon={'\u{1FA7A}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Before the mid-1800s, surgery meant screaming patients, no infection control, and death rates above 50%. Three breakthroughs — anesthesia, antisepsis, and antibiotics — transformed surgery into one of medicine's greatest tools.
          </p>
          {SURGICAL_REVOLUTION.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── 20th Century Milestones ──────────────────────────────────── */}
        <SectionWrapper title="20th Century Milestones" icon={'\u{1F52C}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            The 20th century saw more medical progress than all prior centuries combined. From insulin to CRISPR, each breakthrough built on the last — creating an accelerating cascade of discovery.
          </p>
          {TWENTIETH_CENTURY.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Major Disease Conquests ──────────────────────────────────── */}
        <SectionWrapper title="Major Disease Conquests" icon={'\u{1F6E1}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Humanity's war against infectious disease is one of the great stories of civilization. Some diseases have been conquered; others are on the verge; many still kill millions.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
            {DISEASE_CONQUESTS.map((conquest, i) => (
              <DiseaseCard key={conquest.disease} conquest={conquest} index={i} />
            ))}
          </div>
        </SectionWrapper>

        {/* ── COVID-19 & mRNA Vaccines ─────────────────────────────────── */}
        <SectionWrapper title="COVID-19 & the mRNA Revolution" icon={'\u{1F489}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>
            The COVID-19 pandemic was the greatest public health crisis in a century. The response — developing effective vaccines in 11 months vs. the typical 10–12 years — was one of the most extraordinary achievements in the history of medicine.
          </p>
          <CovidTimeline entries={COVID_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper title={`Key Figures (${KEY_FIGURES.length})`} icon={'\u{1F9D1}\u{200D}\u{2695}\u{FE0F}'}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Modern Challenges ────────────────────────────────────────── */}
        <SectionWrapper title="Modern Challenges & Triumphs" icon={'\u{2696}\u{FE0F}'}>
          <ChallengesAndTriumphs challenges={MODERN_CHALLENGES} triumphs={MEDICAL_TRIUMPHS} />
        </SectionWrapper>

        {/* ── Bottom nav ───────────────────────────────────────────────── */}
        <div style={{ padding: '24px 32px' }}>
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
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
