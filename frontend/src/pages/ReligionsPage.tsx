/**
 * ReligionsPage — history of world religions explorer.
 *
 * Route: /religions
 *
 * Features:
 *  - 8 major world religions with founding details, core beliefs, sacred texts
 *  - Interactive horizontal founding timeline (3000 BCE – 700 CE)
 *  - DB-sourced religious events from Chronicle
 *  - Interconnections between traditions
 *  - Sacred sites reference
 */

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Types ────────────────────────────────────────────────────────────────────

interface Religion {
  id: string;
  name: string;
  foundingYear: number;
  foundingDisplay: string;
  founders: string;
  originRegion: string;
  originFlag: string;
  coreBeliefs: string[];
  sacredTexts: string[];
  currentFollowers: string;
  keyMoments: { year: string; event: string }[];
  spreadDescription: string;
  color: string;
  searchQuery: string;
}

interface DbEvent {
  slug: string;
  title: string;
  year: number;
  category: string;
  importance: number;
}

interface DbResponse {
  events: DbEvent[];
  total: number;
}

interface SacredSite {
  name: string;
  religion: string;
  city: string;
  significance: string;
}

interface Interconnection {
  title: string;
  description: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const RELIGIONS: Religion[] = [
  {
    id: 'hinduism',
    name: 'Hinduism',
    foundingYear: -3000,
    foundingDisplay: '~3000 BCE',
    founders: 'No single founder — evolved from Vedic traditions',
    originRegion: 'Indian Subcontinent',
    originFlag: '🇮🇳',
    coreBeliefs: [
      'Dharma — cosmic order and moral duty governing all existence',
      'Karma — actions in this life determine future rebirths',
      'Samsara — the cycle of death and rebirth (reincarnation)',
      'Moksha — liberation from the cycle of rebirth through spiritual realization',
    ],
    sacredTexts: ['Vedas', 'Upanishads', 'Bhagavad Gita', 'Mahabharata', 'Ramayana'],
    currentFollowers: '~1.2 billion',
    keyMoments: [
      { year: '~1500 BCE', event: 'Rig Veda composed — oldest Hindu scripture' },
      { year: '~800 BCE', event: 'Upanishads written — philosophical foundations' },
      { year: '~400 BCE', event: 'Bhagavad Gita composed within the Mahabharata' },
    ],
    spreadDescription: 'Originated in the Indus Valley, spread across South Asia and Southeast Asia (especially Cambodia, Indonesia, Bali). Hindu kingdoms flourished from Afghanistan to Vietnam. Today concentrated in India, Nepal, and diaspora communities worldwide.',
    color: '#f59e0b',
    searchQuery: 'Hinduism Vedas dharma',
  },
  {
    id: 'judaism',
    name: 'Judaism',
    foundingYear: -2000,
    foundingDisplay: '~2000 BCE',
    founders: 'Abraham, Moses',
    originRegion: 'Levant (Middle East)',
    originFlag: '🇮🇱',
    coreBeliefs: [
      'Monotheism — belief in one God (Yahweh) who created and sustains the universe',
      'Covenant — special relationship between God and the Jewish people',
      'Torah — divine law governing ethical, ritual, and social life',
      'Tikkun Olam — responsibility to repair and improve the world',
    ],
    sacredTexts: ['Torah (Five Books of Moses)', 'Tanakh (Hebrew Bible)', 'Talmud', 'Mishnah'],
    currentFollowers: '~15 million',
    keyMoments: [
      { year: '~1250 BCE', event: 'Exodus from Egypt under Moses' },
      { year: '957 BCE', event: "Solomon's Temple built in Jerusalem" },
      { year: '586 BCE', event: 'Babylonian Exile — Temple destroyed' },
    ],
    spreadDescription: 'Originated in ancient Canaan. After Roman destruction of the Second Temple (70 CE), Jewish diaspora spread across the Mediterranean, Europe, and eventually worldwide. Communities established in Babylon, Spain, Eastern Europe, and the Americas.',
    color: '#3b82f6',
    searchQuery: 'Judaism Torah Moses temple',
  },
  {
    id: 'zoroastrianism',
    name: 'Zoroastrianism',
    foundingYear: -1500,
    foundingDisplay: '~1500 BCE',
    founders: 'Zoroaster (Zarathustra)',
    originRegion: 'Ancient Persia (Iran)',
    originFlag: '🇮🇷',
    coreBeliefs: [
      'Cosmic dualism — Ahura Mazda (good) vs Angra Mainyu (evil)',
      'Free will — humans choose between truth (asha) and falsehood (druj)',
      'Final judgment — souls judged after death, universal renovation at end of time',
      'Good thoughts, good words, good deeds — the ethical triad',
    ],
    sacredTexts: ['Avesta', 'Gathas (hymns of Zoroaster)', 'Vendidad'],
    currentFollowers: '~100,000–200,000',
    keyMoments: [
      { year: '~1000 BCE', event: 'Zoroaster composes the Gathas' },
      { year: '550 BCE', event: 'Becomes state religion of the Achaemenid Empire' },
      { year: '651 CE', event: 'Arab conquest of Persia — Zoroastrians become minority' },
    ],
    spreadDescription: 'State religion of three successive Persian empires (Achaemenid, Parthian, Sassanid) spanning from Egypt to Central Asia. Profoundly influenced Judaism, Christianity, and Islam with concepts of heaven/hell, angels/demons, and final judgment. Parsi communities in India preserve the tradition today.',
    color: '#ef4444',
    searchQuery: 'Zoroastrianism Zoroaster Persia',
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    foundingYear: -563,
    foundingDisplay: '563 BCE',
    founders: 'Siddhartha Gautama (the Buddha)',
    originRegion: 'Northern India (modern Nepal)',
    originFlag: '🇳🇵',
    coreBeliefs: [
      'Four Noble Truths — life involves suffering; suffering has a cause; suffering can end; the Eightfold Path leads to its end',
      'The Middle Way — avoiding extremes of indulgence and asceticism',
      'Anatta (no-self) — there is no permanent, unchanging soul',
      'Nirvana — liberation from the cycle of suffering and rebirth',
    ],
    sacredTexts: ['Tripitaka (Pali Canon)', 'Sutras (Mahayana)', 'Tibetan Book of the Dead'],
    currentFollowers: '~500 million',
    keyMoments: [
      { year: '528 BCE', event: "Siddhartha's enlightenment under the Bodhi tree" },
      { year: '257 BCE', event: "Emperor Ashoka's edicts spread Buddhism across India" },
      { year: '~100 CE', event: 'Mahayana Buddhism emerges — the Great Vehicle' },
    ],
    spreadDescription: 'From India, Buddhism spread along the Silk Road to Central Asia and China (1st century CE), then to Korea, Japan, and Vietnam. Theravada Buddhism dominated Southeast Asia (Sri Lanka, Myanmar, Thailand, Cambodia, Laos). Tibetan Buddhism emerged as a distinct tradition. Largely disappeared from India by 13th century.',
    color: '#f97316',
    searchQuery: 'Buddhism Buddha enlightenment',
  },
  {
    id: 'confucianism',
    name: 'Confucianism',
    foundingYear: -551,
    foundingDisplay: '551 BCE',
    founders: 'Confucius (Kong Qiu)',
    originRegion: 'China (State of Lu)',
    originFlag: '🇨🇳',
    coreBeliefs: [
      'Ren (benevolence) — humaneness and compassion as the highest virtue',
      'Li (ritual propriety) — proper conduct, etiquette, and social harmony',
      'Xiao (filial piety) — devotion and respect to parents and ancestors',
      'Junzi (the noble person) — moral self-cultivation as life\'s purpose',
    ],
    sacredTexts: ['Analects (Lunyu)', 'Five Classics', 'Four Books', 'I Ching'],
    currentFollowers: '~6–7 million (strict adherents); cultural influence on ~1.5 billion',
    keyMoments: [
      { year: '500 BCE', event: 'Confucius teaches and compiles the Analects' },
      { year: '136 BCE', event: 'Emperor Wu adopts Confucianism as state ideology' },
      { year: '1175 CE', event: 'Zhu Xi\'s Neo-Confucianism transforms East Asia' },
    ],
    spreadDescription: 'Became the dominant philosophy of Chinese civilization under the Han Dynasty. Spread to Korea (where it shaped the Joseon Dynasty), Japan (influencing samurai ethics), and Vietnam. Confucian civil service examinations shaped governance across East Asia for nearly 2,000 years.',
    color: '#10b981',
    searchQuery: 'Confucianism Confucius analects',
  },
  {
    id: 'taoism',
    name: 'Taoism',
    foundingYear: -604,
    foundingDisplay: '~604 BCE',
    founders: 'Laozi (Lao Tzu)',
    originRegion: 'China',
    originFlag: '🇨🇳',
    coreBeliefs: [
      'The Tao (the Way) — the fundamental, nameless force underlying all reality',
      'Wu wei (non-action) — effortless action in harmony with the natural flow',
      'Yin and Yang — complementary opposites in dynamic balance',
      'Simplicity and naturalness — return to an uncarved, authentic state',
    ],
    sacredTexts: ['Tao Te Ching', 'Zhuangzi', 'Daozang (Taoist Canon)'],
    currentFollowers: '~12 million (formal); cultural influence across East Asia',
    keyMoments: [
      { year: '~600 BCE', event: 'Laozi writes the Tao Te Ching' },
      { year: '~300 BCE', event: 'Zhuangzi expands Taoist philosophy' },
      { year: '142 CE', event: 'Zhang Daoling founds religious Taoism' },
    ],
    spreadDescription: 'Deeply intertwined with Chinese culture, art, medicine, and martial arts. Influenced Chan (Zen) Buddhism in China and Japan. Taoist concepts of balance and harmony shaped traditional Chinese medicine, feng shui, and tai chi. Spread to Korea, Japan, and Vietnam alongside Buddhism and Confucianism.',
    color: '#6366f1',
    searchQuery: 'Taoism Laozi Tao',
  },
  {
    id: 'christianity',
    name: 'Christianity',
    foundingYear: 1,
    foundingDisplay: '~1 CE',
    founders: 'Jesus of Nazareth',
    originRegion: 'Roman Judea (modern Israel/Palestine)',
    originFlag: '🇵🇸',
    coreBeliefs: [
      'Incarnation — God became human in Jesus Christ',
      'Salvation through grace — redemption from sin through faith in Christ',
      'The Trinity — one God in three persons (Father, Son, Holy Spirit)',
      'Love and forgiveness — "Love your neighbor as yourself" as the greatest commandment',
    ],
    sacredTexts: ['Bible (Old and New Testaments)', 'Gospels of Matthew, Mark, Luke, John'],
    currentFollowers: '~2.4 billion (world\'s largest religion)',
    keyMoments: [
      { year: '~30 CE', event: 'Crucifixion and reported resurrection of Jesus' },
      { year: '313 CE', event: 'Edict of Milan — Constantine legalizes Christianity' },
      { year: '1517 CE', event: 'Martin Luther\'s 95 Theses spark the Protestant Reformation' },
    ],
    spreadDescription: 'Spread through the Roman Empire via Paul\'s missionary journeys. Became Rome\'s state religion by 380 CE. Missionaries carried Christianity to Northern Europe, the Americas (via colonization), sub-Saharan Africa, and East Asia. Split into Catholic, Orthodox, and Protestant branches. Today the world\'s most geographically widespread religion.',
    color: '#8b5cf6',
    searchQuery: 'Christianity Jesus Christ church',
  },
  {
    id: 'islam',
    name: 'Islam',
    foundingYear: 610,
    foundingDisplay: '610 CE',
    founders: 'Prophet Muhammad',
    originRegion: 'Arabian Peninsula (Mecca)',
    originFlag: '🇸🇦',
    coreBeliefs: [
      'Tawhid — absolute oneness of God (Allah)',
      'Five Pillars — shahada (faith), salat (prayer), zakat (charity), sawm (fasting), hajj (pilgrimage)',
      'The Quran as the final, unaltered revelation of God',
      'Prophetic tradition — Muhammad as the last in the line of prophets from Abraham to Jesus',
    ],
    sacredTexts: ['Quran', 'Hadith (sayings and actions of Muhammad)', 'Sunnah'],
    currentFollowers: '~1.9 billion (world\'s fastest-growing religion)',
    keyMoments: [
      { year: '622 CE', event: 'Hijra — Muhammad\'s migration from Mecca to Medina' },
      { year: '632 CE', event: 'Death of Muhammad — rapid expansion of the Caliphate' },
      { year: '750 CE', event: 'Abbasid Caliphate — Islamic Golden Age begins' },
    ],
    spreadDescription: 'Expanded rapidly across the Arabian Peninsula, then through military conquest, trade, and missionary activity across North Africa, the Middle East, Persia, Central Asia, South Asia, and Southeast Asia. The Umayyad Caliphate stretched from Spain to India by 750 CE. Spread to sub-Saharan Africa via trade routes. Today the dominant religion from Morocco to Indonesia.',
    color: '#059669',
    searchQuery: 'Islam Muhammad Quran caliphate',
  },
];

const SACRED_SITES: SacredSite[] = [
  { name: 'Varanasi (Kashi)', religion: 'Hinduism', city: 'Varanasi, India', significance: 'Oldest continuously inhabited city; holiest pilgrimage site for Hindus, where bathing in the Ganges washes away sins' },
  { name: 'Western Wall', religion: 'Judaism', city: 'Jerusalem, Israel', significance: 'Last remnant of the Second Temple; holiest site where Jews can pray' },
  { name: 'Church of the Holy Sepulchre', religion: 'Christianity', city: 'Jerusalem, Israel', significance: 'Believed site of Jesus\' crucifixion, burial, and resurrection' },
  { name: 'Masjid al-Haram (Great Mosque)', religion: 'Islam', city: 'Mecca, Saudi Arabia', significance: 'Houses the Kaaba; destination of the Hajj pilgrimage required of all Muslims' },
  { name: 'Bodhi Tree / Mahabodhi Temple', religion: 'Buddhism', city: 'Bodh Gaya, India', significance: 'Where Siddhartha Gautama attained enlightenment under the Bodhi tree' },
  { name: 'Temple of Confucius', religion: 'Confucianism', city: 'Qufu, China', significance: 'Built at Confucius\' birthplace; center of Confucian worship for 2,500 years' },
  { name: 'Fire Temple of Yazd', religion: 'Zoroastrianism', city: 'Yazd, Iran', significance: 'Houses a flame said to have burned continuously since 470 CE' },
  { name: 'White Cloud Temple', religion: 'Taoism', city: 'Beijing, China', significance: 'Headquarters of the Complete Reality School; most important Taoist temple' },
  { name: 'Al-Aqsa Mosque', religion: 'Islam', city: 'Jerusalem, Israel', significance: 'Third holiest site in Islam; where Muhammad is believed to have ascended to heaven' },
  { name: 'St. Peter\'s Basilica', religion: 'Christianity', city: 'Vatican City', significance: 'Largest church in the world; built over the burial site of Saint Peter' },
  { name: 'Golden Temple (Harmandir Sahib)', religion: 'Sikhism', city: 'Amritsar, India', significance: 'Holiest Sikh gurdwara; its kitchen feeds 100,000+ visitors daily for free' },
  { name: 'Shwedagon Pagoda', religion: 'Buddhism', city: 'Yangon, Myanmar', significance: 'Oldest Buddhist pagoda (2,600 years); enshrines strands of the Buddha\'s hair' },
  { name: 'Angkor Wat', religion: 'Hinduism/Buddhism', city: 'Siem Reap, Cambodia', significance: 'World\'s largest religious monument; originally Hindu, later converted to Buddhist' },
  { name: 'Mount Kailash', religion: 'Hinduism/Buddhism/Jainism', city: 'Tibet, China', significance: 'Sacred to four religions; believed to be the abode of Lord Shiva; no one has ever climbed it' },
  { name: 'Dome of the Rock', religion: 'Islam', city: 'Jerusalem, Israel', significance: 'Built on the Temple Mount; where Muhammad ascended and where Abraham offered Isaac' },
];

const INTERCONNECTIONS: Interconnection[] = [
  {
    title: 'The Abrahamic Lineage',
    description: 'Judaism, Christianity, and Islam share Abraham as a patriarch. Christianity emerged from Judaism, accepting the Hebrew Bible as Old Testament. Islam recognizes both Jewish and Christian prophets (Moses, Jesus) while adding Muhammad as the final prophet. All three share monotheism, prophetic tradition, and concepts of divine law.',
  },
  {
    title: 'Zoroastrian Influence on Monotheisms',
    description: 'Zoroastrianism (predating all three Abrahamic faiths) introduced concepts that became central to Judaism, Christianity, and Islam: heaven and hell, angels and demons, a cosmic battle between good and evil, resurrection of the dead, and a final day of judgment. These ideas entered Judaism during the Babylonian Exile and Persian period.',
  },
  {
    title: 'The Dharmic Family',
    description: 'Hinduism, Buddhism, Jainism, and Sikhism all originated in the Indian subcontinent and share concepts of karma, samsara (rebirth), dharma, and the goal of liberation from the cycle of existence. Buddhism and Jainism arose partly as reform movements within the Vedic tradition.',
  },
  {
    title: 'East Asian Synthesis',
    description: 'In China, Japan, Korea, and Vietnam, Confucianism, Taoism, and Buddhism blended together rather than competing. A Chinese proverb captures this: "Three teachings, one purpose." Individuals might practice Confucian ethics, Taoist meditation, and Buddhist devotion simultaneously.',
  },
  {
    title: 'Shared Sacred Concepts',
    description: 'Despite vast differences, world religions share striking parallels: the Golden Rule appears in every major tradition. Prayer or meditation is universal. Sacred texts anchor belief. Pilgrimage to holy sites features in Hinduism, Buddhism, Judaism, Christianity, and Islam. Fasting, charity, and community worship are common practices across traditions.',
  },
];

type Section = 'religions' | 'timeline' | 'events' | 'connections' | 'sites';

// ── Component ────────────────────────────────────────────────────────────────

export default function ReligionsPage() {
  const [activeSection, setActiveSection] = useState<Section>('religions');
  const [expandedReligion, setExpandedReligion] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: dbData, isLoading: dbLoading } = useQuery<DbResponse>({
    queryKey: ['religions-events'],
    queryFn: async () => {
      const res = await fetch(`${API}/api/religions/events`);
      if (!res.ok) throw new Error('Failed to load religion events');
      return res.json();
    },
  });

  // Timeline calculations: 3000 BCE to 700 CE
  const timelineMin = -3200;
  const timelineMax = 800;
  const timelineRange = timelineMax - timelineMin;

  function yearToPercent(year: number): number {
    return ((year - timelineMin) / timelineRange) * 100;
  }

  function formatYear(year: number): string {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  }

  function scrollToCard(religionId: string) {
    setActiveSection('religions');
    setExpandedReligion(religionId);
    setTimeout(() => {
      cardRefs.current[religionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // Top 10 DB events by importance
  const topEvents = (dbData?.events ?? [])
    .slice()
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  const sectionBtns: { key: Section; label: string }[] = [
    { key: 'religions', label: 'Major Religions' },
    { key: 'timeline', label: 'Founding Timeline' },
    { key: 'events', label: 'Chronicle Events' },
    { key: 'connections', label: 'Interconnections' },
    { key: 'sites', label: 'Sacred Sites' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      {/* Back nav */}
      <Link
        to="/"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 40,
          padding: '8px 14px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500,
          textDecoration: 'none', transition: 'all 150ms ease',
        }}
      >
        ← Chronicle
      </Link>

      {/* ── Hero ── */}
      <header style={{ padding: '80px 24px 40px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, margin: 0, letterSpacing: -0.5 }}
        >
          The Spiritual Timeline of Humanity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ fontSize: 20, color: '#94a3b8', marginTop: 12, fontWeight: 400 }}
        >
          How belief systems shaped civilizations
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ fontSize: 15, color: '#64748b', marginTop: 16, lineHeight: 1.6, maxWidth: 680, margin: '16px auto 0' }}
        >
          From the earliest Vedic hymns to the rapid expansion of Islam — 5,000 years of humanity's search
          for meaning, the faiths that emerged, the civilizations they built, and the ways they shaped
          every aspect of human life.
        </motion.p>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28 }}>
          {[
            { n: RELIGIONS.length, label: 'Major Religions' },
            { n: '5,000+', label: 'Years of History' },
            { n: '~5.5B', label: 'Followers Today' },
            { n: dbData?.total ?? '...', label: 'Chronicle Events' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#8b5cf6' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Section Nav ── */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '0 24px 32px', flexWrap: 'wrap' }}>
        {sectionBtns.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: activeSection === s.key ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
              color: activeSection === s.key ? '#fff' : '#94a3b8',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ── Major Religions ── */}
      {activeSection === 'religions' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: 20 }}>
            {RELIGIONS.map((religion, i) => {
              const expanded = expandedReligion === religion.id;
              return (
                <motion.div
                  key={religion.id}
                  ref={(el) => { cardRefs.current[religion.id] = el; }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${expanded ? religion.color : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 12, padding: 24, cursor: 'pointer',
                    transition: 'border-color 200ms ease',
                  }}
                  onClick={() => setExpandedReligion(expanded ? null : religion.id)}
                >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                        <span style={{ marginRight: 8 }}>{religion.originFlag}</span>
                        {religion.name}
                      </h3>
                      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                        Founded {religion.foundingDisplay} · <span style={{ color: religion.color }}>{religion.originRegion}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#475569' }}>{religion.currentFollowers}</div>
                      <span style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{expanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Founder */}
                  <p style={{ fontSize: 13, color: '#a78bfa', fontStyle: 'italic', margin: '4px 0 12px' }}>
                    {religion.founders}
                  </p>

                  {/* Core beliefs preview */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {religion.sacredTexts.map((text) => (
                      <span
                        key={text}
                        style={{
                          padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                          background: `${religion.color}22`, color: religion.color,
                          border: `1px solid ${religion.color}33`,
                        }}
                      >
                        {text}
                      </span>
                    ))}
                  </div>

                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Core Beliefs */}
                      <div style={{ marginTop: 16, marginBottom: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Core Beliefs</h4>
                        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: 'disc' }}>
                          {religion.coreBeliefs.map((belief, j) => (
                            <li key={j} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 4, lineHeight: 1.5 }}>{belief}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Key Historical Moments */}
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Key Historical Moments</h4>
                        {religion.keyMoments.map((m, j) => (
                          <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 6, fontSize: 13 }}>
                            <span style={{ color: religion.color, fontWeight: 600, flexShrink: 0, minWidth: 80 }}>{m.year}</span>
                            <span style={{ color: '#cbd5e1' }}>{m.event}</span>
                          </div>
                        ))}
                      </div>

                      {/* Spread */}
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${religion.color}`,
                        padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: 16,
                      }}>
                        <h4 style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>How It Spread</h4>
                        <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
                          {religion.spreadDescription}
                        </p>
                      </div>

                      {/* Search link */}
                      <Link
                        to={`/search?q=${encodeURIComponent(religion.searchQuery)}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'inline-block', padding: '8px 16px', borderRadius: 6,
                          background: religion.color, color: '#fff',
                          fontSize: 13, fontWeight: 600, textDecoration: 'none',
                          transition: 'opacity 150ms ease',
                        }}
                      >
                        Find in Chronicle →
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Founding Timeline ── */}
      {activeSection === 'timeline' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>When Religions Were Founded</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            A horizontal timeline showing the founding dates of 8 major world religions from 3000 BCE to 700 CE.
            Click any religion to see its detail card.
          </p>

          {/* Timeline axis */}
          <div style={{ position: 'relative', height: 400, marginBottom: 32 }}>
            {/* Axis line */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)' }} />

            {/* Year markers */}
            {[-3000, -2500, -2000, -1500, -1000, -500, 0, 500].map((y) => (
              <div key={y} style={{ position: 'absolute', left: `${yearToPercent(y)}%`, top: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)', marginTop: -6 }} />
                <div style={{ fontSize: 11, color: '#475569', marginTop: 10, whiteSpace: 'nowrap', transform: 'translateX(-50%)', position: 'absolute', left: '50%' }}>
                  {formatYear(y)}
                </div>
              </div>
            ))}

            {/* Religion markers */}
            {RELIGIONS.map((religion, i) => {
              const left = yearToPercent(religion.foundingYear);
              const isTop = i % 2 === 0;
              return (
                <motion.div
                  key={religion.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    top: isTop ? '10%' : '60%',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                  onClick={() => scrollToCard(religion.id)}
                >
                  {/* Connector line */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    width: 1,
                    background: religion.color,
                    opacity: 0.4,
                    ...(isTop
                      ? { top: '100%', height: `${200 - 60}px` }
                      : { bottom: '100%', height: '40px' }),
                  }} />

                  {/* Dot */}
                  <div style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: religion.color, border: '2px solid #0f172a',
                    margin: '0 auto 6px',
                  }} />

                  {/* Label */}
                  <div style={{
                    background: 'rgba(15,17,23,0.9)',
                    border: `1px solid ${religion.color}44`,
                    borderRadius: 8,
                    padding: '6px 10px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: religion.color }}>{religion.name}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{religion.foundingDisplay}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overlap note */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px', color: '#a78bfa' }}>Overlapping Periods</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
              Notice how Buddhism (563 BCE), Confucianism (551 BCE), and Taoism (~604 BCE) all emerged within roughly 50 years of each other —
              during what philosopher Karl Jaspers called the <strong style={{ color: '#e2e8f0' }}>Axial Age</strong> (800–200 BCE).
              This remarkable period also saw the rise of Greek philosophy, Hebrew prophets, and Jain thinkers.
              Across Eurasia, humanity simultaneously began asking the deepest questions about existence, morality, and the divine.
            </p>
          </div>
        </section>
      )}

      {/* ── Chronicle Events ── */}
      {activeSection === 'events' && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Religious Events in Chronicle</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            {dbLoading
              ? 'Loading events from the database...'
              : `Chronicle has ${dbData?.total ?? 0} religious events — here are the most significant:`}
          </p>

          {dbLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topEvents.map((ev, i) => (
                <motion.div
                  key={ev.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <Link
                    to={`/event/${ev.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12, padding: '16px 20px',
                      textDecoration: 'none', color: 'inherit',
                      transition: 'border-color 200ms ease',
                    }}
                  >
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: '#8b5cf6',
                      minWidth: 80, textAlign: 'right', flexShrink: 0,
                    }}>
                      {formatYear(ev.year)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0' }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        {ev.category} · importance: {(ev.importance * 100).toFixed(0)}%
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#475569' }}>→</span>
                  </Link>
                </motion.div>
              ))}

              {(dbData?.total ?? 0) > 10 && (
                <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 16 }}>
                  ...and {(dbData?.total ?? 0) - 10} more events in Chronicle.{' '}
                  <Link to="/search?q=religion" style={{ color: '#8b5cf6', textDecoration: 'none' }}>
                    Search all →
                  </Link>
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Interconnections ── */}
      {activeSection === 'connections' && (
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>How Religions Influenced Each Other</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            No religion developed in isolation. Trade routes, conquests, and intellectual exchange created deep
            connections between traditions across millennia.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {INTERCONNECTIONS.map((conn, i) => (
              <motion.div
                key={conn.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: 24,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: '#a78bfa' }}>
                  {conn.title}
                </h3>
                <p style={{ fontSize: 14, color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>
                  {conn.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Lineage diagram (text-based) */}
          <div style={{
            marginTop: 32, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: 24,
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: '#e2e8f0' }}>
              The Monotheistic Lineage
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', fontSize: 14 }}>
              <span style={{ padding: '6px 14px', borderRadius: 8, background: '#ef444422', color: '#ef4444', border: '1px solid #ef444433', fontWeight: 600 }}>
                Zoroastrianism (~1500 BCE)
              </span>
              <span style={{ color: '#475569' }}>→</span>
              <span style={{ padding: '6px 14px', borderRadius: 8, background: '#3b82f622', color: '#3b82f6', border: '1px solid #3b82f633', fontWeight: 600 }}>
                Judaism (~2000 BCE)
              </span>
              <span style={{ color: '#475569' }}>→</span>
              <span style={{ padding: '6px 14px', borderRadius: 8, background: '#8b5cf622', color: '#8b5cf6', border: '1px solid #8b5cf633', fontWeight: 600 }}>
                Christianity (~1 CE)
              </span>
              <span style={{ color: '#475569' }}>→</span>
              <span style={{ padding: '6px 14px', borderRadius: 8, background: '#05966922', color: '#059669', border: '1px solid #05966933', fontWeight: 600 }}>
                Islam (610 CE)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Sacred Sites ── */}
      {activeSection === 'sites' && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 64px' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Sacred Sites of the World</h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32 }}>
            15 of humanity's most sacred places — where billions have prayed, meditated, and sought the divine.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {SACRED_SITES.map((site, i) => {
              const religion = RELIGIONS.find((r) => site.religion.includes(r.name));
              const siteColor = religion?.color ?? '#8b5cf6';
              return (
                <motion.div
                  key={site.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12, padding: 20,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#e2e8f0' }}>{site.name}</h3>
                    <span style={{
                      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: `${siteColor}22`, color: siteColor,
                      border: `1px solid ${siteColor}33`,
                      whiteSpace: 'nowrap',
                    }}>
                      {site.religion}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{site.city}</div>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{site.significance}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        Chronicle — Open-source historical events explorer · <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Back to timeline</Link>
      </footer>
    </div>
  );
}
