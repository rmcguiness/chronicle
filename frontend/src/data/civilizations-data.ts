/**
 * civilizations-data.ts — Static dataset of ~55 major world civilizations/empires.
 *
 * Owns: civilization metadata (name, region, dates, color, description).
 * Does NOT own: rendering, filtering logic, or UI state.
 *
 * Each entry represents a civilization or empire with approximate start/end years
 * (negative = BCE) and a peak year indicating maximum territorial/cultural extent.
 */

/** World regions used for grouping civilizations. */
export type Region = 'europe' | 'middle_east' | 'africa' | 'asia' | 'americas' | 'oceania';

/** Display labels for each region. */
export const REGION_LABELS: Record<Region, string> = {
  europe: 'Europe',
  middle_east: 'Middle East',
  africa: 'Africa',
  asia: 'Asia',
  americas: 'Americas',
  oceania: 'Oceania',
};

/** Region colors for the timeline chart. */
export const REGION_COLORS: Record<Region, string> = {
  europe: '#6366f1',
  middle_east: '#f59e0b',
  africa: '#10b981',
  asia: '#ef4444',
  americas: '#8b5cf6',
  oceania: '#06b6d4',
};

/** A civilization or empire entry. */
export interface Civilization {
  /** Display name */
  name: string;
  /** World region */
  region: Region;
  /** Approximate start year (negative = BCE) */
  startYear: number;
  /** Approximate end year (negative = BCE) */
  endYear: number;
  /** Year of peak territorial/cultural extent */
  peak: number;
  /** CSS color for display */
  color: string;
  /** One-line description */
  description: string;
}

/** Century slider range boundaries. */
export const MIN_CENTURY = -3000;
export const MAX_CENTURY = 2000;
export const CENTURY_STEP = 100;
/** Milliseconds between steps in Play History mode. */
export const PLAY_INTERVAL_MS = 1500;

/** Full dataset of civilizations. */
export const CIVILIZATIONS: Civilization[] = [
  // ── EUROPE ──
  { name: 'Minoan Civilization', region: 'europe', startYear: -2700, endYear: -1450, peak: -1600, color: '#5b8dee', description: 'Bronze Age Aegean civilization centered on Crete.' },
  { name: 'Mycenaean Greece', region: 'europe', startYear: -1600, endYear: -1100, peak: -1250, color: '#4a7ec7', description: 'Late Bronze Age Greek civilization; inspired Homeric epics.' },
  { name: 'Greek City-States', region: 'europe', startYear: -800, endYear: -338, peak: -450, color: '#3b82f6', description: 'Athens, Sparta, and rivals; birthplace of democracy and philosophy.' },
  { name: 'Macedonian Empire', region: 'europe', startYear: -359, endYear: -323, peak: -323, color: '#2563eb', description: "Alexander the Great's empire stretching to India." },
  { name: 'Roman Republic', region: 'europe', startYear: -509, endYear: -27, peak: -100, color: '#dc2626', description: 'Republic that conquered the Mediterranean before becoming an empire.' },
  { name: 'Roman Empire', region: 'europe', startYear: -27, endYear: 476, peak: 117, color: '#c0392b', description: 'Dominated the Mediterranean world for 500 years.' },
  { name: 'Byzantine Empire', region: 'europe', startYear: 330, endYear: 1453, peak: 555, color: '#7c3aed', description: 'Eastern Roman Empire; preserved Greco-Roman culture for a millennium.' },
  { name: 'Carolingian Empire', region: 'europe', startYear: 751, endYear: 888, peak: 800, color: '#4338ca', description: "Charlemagne's Frankish empire uniting much of Western Europe." },
  { name: 'Holy Roman Empire', region: 'europe', startYear: 962, endYear: 1806, peak: 1200, color: '#6d28d9', description: 'Decentralized empire in Central Europe; "neither Holy, nor Roman, nor an Empire."' },
  { name: 'Medieval England', region: 'europe', startYear: 1066, endYear: 1485, peak: 1300, color: '#1e40af', description: 'Norman and Plantagenet England; Magna Carta era.' },
  { name: 'Medieval France', region: 'europe', startYear: 987, endYear: 1498, peak: 1300, color: '#1d4ed8', description: 'Capetian France; strongest medieval European kingdom.' },
  { name: 'Renaissance Italy', region: 'europe', startYear: 1300, endYear: 1600, peak: 1500, color: '#059669', description: 'Italian city-states drove the cultural rebirth of Europe.' },
  { name: 'Habsburg Empire', region: 'europe', startYear: 1282, endYear: 1918, peak: 1600, color: '#b91c1c', description: 'Dynastic superpower ruling Austria, Spain, and beyond.' },
  { name: 'British Empire', region: 'europe', startYear: 1583, endYear: 1997, peak: 1920, color: '#be123c', description: 'Largest empire in history; "the sun never sets."' },
  { name: "Napoleon's France", region: 'europe', startYear: 1799, endYear: 1815, peak: 1812, color: '#1e3a8a', description: 'Napoleonic Wars reshaped European borders and law.' },
  { name: 'German Empire', region: 'europe', startYear: 1871, endYear: 1918, peak: 1914, color: '#374151', description: 'Bismarck-forged empire; industrial and military powerhouse.' },
  { name: 'USSR', region: 'europe', startYear: 1922, endYear: 1991, peak: 1960, color: '#dc2626', description: 'Communist superpower spanning 11 time zones.' },
  { name: 'European Union', region: 'europe', startYear: 1993, endYear: 2025, peak: 2020, color: '#2563eb', description: 'Political and economic union of 27 European states.' },

  // ── MIDDLE EAST ──
  { name: 'Sumerian City-States', region: 'middle_east', startYear: -3500, endYear: -2004, peak: -2500, color: '#d97706', description: 'Cradle of civilization; invented writing, the wheel, and irrigation.' },
  { name: 'Akkadian Empire', region: 'middle_east', startYear: -2334, endYear: -2154, peak: -2250, color: '#b45309', description: "Sargon's empire; first multi-ethnic empire in history." },
  { name: 'Babylonian Empire', region: 'middle_east', startYear: -1894, endYear: -539, peak: -580, color: '#92400e', description: 'Hammurabi\'s law code; Nebuchadnezzar\'s hanging gardens.' },
  { name: 'Assyrian Empire', region: 'middle_east', startYear: -2500, endYear: -609, peak: -670, color: '#78350f', description: 'Military superpower of the ancient Near East.' },
  { name: 'Persian / Achaemenid Empire', region: 'middle_east', startYear: -550, endYear: -330, peak: -480, color: '#f59e0b', description: 'Largest empire the world had yet seen; Cyrus to Darius.' },
  { name: 'Seleucid Empire', region: 'middle_east', startYear: -312, endYear: -63, peak: -280, color: '#fbbf24', description: 'Hellenistic successor state ruling the eastern Mediterranean.' },
  { name: 'Parthian Empire', region: 'middle_east', startYear: -247, endYear: 224, peak: 1, color: '#f97316', description: 'Iranian empire rivaling Rome for centuries.' },
  { name: 'Sassanid Empire', region: 'middle_east', startYear: 224, endYear: 651, peak: 600, color: '#ea580c', description: 'Last pre-Islamic Persian empire; cultural golden age.' },
  { name: 'Rashidun Caliphate', region: 'middle_east', startYear: 632, endYear: 661, peak: 655, color: '#16a34a', description: 'First Islamic caliphate; rapid expansion after Muhammad.' },
  { name: 'Umayyad Caliphate', region: 'middle_east', startYear: 661, endYear: 750, peak: 720, color: '#15803d', description: 'Largest Islamic empire; Spain to Central Asia.' },
  { name: 'Abbasid Caliphate', region: 'middle_east', startYear: 750, endYear: 1258, peak: 800, color: '#166534', description: 'Islamic Golden Age; Baghdad as world center of learning.' },
  { name: 'Seljuk Empire', region: 'middle_east', startYear: 1037, endYear: 1194, peak: 1090, color: '#ca8a04', description: 'Turkic empire; triggered the Crusades.' },
  { name: 'Ottoman Empire', region: 'middle_east', startYear: 1299, endYear: 1922, peak: 1580, color: '#dc2626', description: 'Six-century empire bridging Europe, Asia, and Africa.' },
  { name: 'Safavid Persia', region: 'middle_east', startYear: 1501, endYear: 1736, peak: 1600, color: '#ea580c', description: 'Established Shia Islam as state religion of Iran.' },

  // ── AFRICA ──
  { name: 'Ancient Egypt', region: 'africa', startYear: -3100, endYear: -30, peak: -1250, color: '#d4a017', description: 'Pharaohs, pyramids, and 3000 years of Nile civilization.' },
  { name: 'Kingdom of Kush / Nubia', region: 'africa', startYear: -1070, endYear: 350, peak: -700, color: '#a16207', description: 'Rival and conqueror of Egypt; iron-working center.' },
  { name: 'Carthage', region: 'africa', startYear: -814, endYear: -146, peak: -300, color: '#854d0e', description: "Phoenician trading empire; Hannibal's base against Rome." },
  { name: 'Kingdom of Axum', region: 'africa', startYear: -100, endYear: 940, peak: 350, color: '#65a30d', description: 'Ethiopian trading empire; early Christian kingdom.' },
  { name: 'Ghana Empire', region: 'africa', startYear: 300, endYear: 1200, peak: 1050, color: '#16a34a', description: 'West African gold empire; "land of gold."' },
  { name: 'Mali Empire', region: 'africa', startYear: 1235, endYear: 1600, peak: 1350, color: '#15803d', description: 'Mansa Musa; richest person in history.' },
  { name: 'Songhai Empire', region: 'africa', startYear: 1430, endYear: 1591, peak: 1520, color: '#166534', description: 'Largest empire in African history; Timbuktu.' },
  { name: 'Great Zimbabwe', region: 'africa', startYear: 1100, endYear: 1450, peak: 1300, color: '#047857', description: 'Stone city; major trading center of southeast Africa.' },
  { name: 'Benin Kingdom', region: 'africa', startYear: 1180, endYear: 1897, peak: 1550, color: '#0d9488', description: 'Famous bronze art; powerful West African kingdom.' },
  { name: 'Zulu Kingdom', region: 'africa', startYear: 1816, endYear: 1897, peak: 1828, color: '#059669', description: 'Shaka Zulu transformed southern African warfare.' },
  { name: 'Ethiopian Empire', region: 'africa', startYear: 1270, endYear: 1974, peak: 1600, color: '#10b981', description: 'Solomonic dynasty; never colonized.' },

  // ── ASIA ──
  { name: 'Indus Valley Civilization', region: 'asia', startYear: -3300, endYear: -1300, peak: -2500, color: '#e11d48', description: 'Harappa and Mohenjo-daro; advanced urban planning.' },
  { name: 'Vedic India', region: 'asia', startYear: -1500, endYear: -500, peak: -1000, color: '#f43f5e', description: 'Composed the Vedas; foundation of Hindu civilization.' },
  { name: 'Maurya Empire', region: 'asia', startYear: -322, endYear: -185, peak: -260, color: '#e11d48', description: "Ashoka's empire; united most of the Indian subcontinent." },
  { name: 'Gupta Empire', region: 'asia', startYear: 320, endYear: 550, peak: 400, color: '#be123c', description: 'Golden Age of India; advances in math, astronomy, art.' },
  { name: 'Mughal Empire', region: 'asia', startYear: 1526, endYear: 1857, peak: 1700, color: '#9f1239', description: 'Built the Taj Mahal; ruled most of South Asia.' },
  { name: 'Qin Dynasty', region: 'asia', startYear: -221, endYear: -206, peak: -210, color: '#dc2626', description: 'First unified China; Great Wall begun, terracotta army.' },
  { name: 'Han Dynasty', region: 'asia', startYear: -206, endYear: 220, peak: 100, color: '#e67e22', description: 'Defined Chinese identity; Silk Road trade.' },
  { name: 'Tang Dynasty', region: 'asia', startYear: 618, endYear: 907, peak: 750, color: '#ea580c', description: 'Golden age of Chinese poetry, art, and cosmopolitan culture.' },
  { name: 'Song Dynasty', region: 'asia', startYear: 960, endYear: 1279, peak: 1100, color: '#f97316', description: 'Invented gunpowder, compass, movable type; economic revolution.' },
  { name: 'Yuan Dynasty', region: 'asia', startYear: 1271, endYear: 1368, peak: 1300, color: '#b91c1c', description: "Mongol-ruled China under Kublai Khan." },
  { name: 'Ming Dynasty', region: 'asia', startYear: 1368, endYear: 1644, peak: 1450, color: '#dc2626', description: 'Forbidden City, Zheng He voyages, porcelain trade.' },
  { name: 'Qing Dynasty', region: 'asia', startYear: 1644, endYear: 1912, peak: 1790, color: '#991b1b', description: "Last Chinese dynasty; Manchu rule at China's largest extent." },
  { name: 'Yamato Japan', region: 'asia', startYear: 250, endYear: 710, peak: 600, color: '#db2777', description: 'Foundation of the Japanese imperial state.' },
  { name: 'Khmer Empire', region: 'asia', startYear: 802, endYear: 1431, peak: 1200, color: '#be185d', description: 'Built Angkor Wat; dominated Southeast Asia.' },
  { name: 'Mongol Empire', region: 'asia', startYear: 1206, endYear: 1368, peak: 1279, color: '#7f1d1d', description: 'Largest contiguous land empire in history.' },

  // ── AMERICAS ──
  { name: 'Olmec Civilization', region: 'americas', startYear: -1500, endYear: -400, peak: -900, color: '#7c3aed', description: 'Mother culture of Mesoamerica; colossal stone heads.' },
  { name: 'Maya Civilization', region: 'americas', startYear: -2000, endYear: 1500, peak: 800, color: '#8b5cf6', description: 'Advanced writing, astronomy, and mathematics.' },
  { name: 'Teotihuacan', region: 'americas', startYear: -200, endYear: 550, peak: 450, color: '#6d28d9', description: 'Massive city of pyramids; 200k population at peak.' },
  { name: 'Aztec Empire', region: 'americas', startYear: 1428, endYear: 1521, peak: 1500, color: '#5b21b6', description: 'Tenochtitlan; largest Mesoamerican empire.' },
  { name: 'Inca Empire', region: 'americas', startYear: 1438, endYear: 1533, peak: 1500, color: '#4c1d95', description: 'Largest empire in pre-Columbian Americas; Machu Picchu.' },
  { name: 'Mississippian Culture', region: 'americas', startYear: 800, endYear: 1600, peak: 1100, color: '#a78bfa', description: 'Mound-building civilization of eastern North America.' },
  { name: 'Cahokia', region: 'americas', startYear: 600, endYear: 1400, peak: 1100, color: '#c4b5fd', description: 'Largest pre-Columbian city north of Mexico; 20k population.' },

  // ── OCEANIA ──
  { name: 'Lapita / Polynesian Expansion', region: 'oceania', startYear: -1500, endYear: 1200, peak: 400, color: '#06b6d4', description: 'Seafaring people colonized the Pacific from Taiwan to Easter Island.' },
  { name: 'Maori Settlement', region: 'oceania', startYear: 1250, endYear: 1840, peak: 1500, color: '#0891b2', description: 'Polynesian settlers of New Zealand; rich warrior culture.' },
];

/** Simultaneous Giants — fun facts about empires that coexisted. */
export interface SimultaneousFact {
  /** Short title */
  title: string;
  /** Detailed description */
  description: string;
  /** Relevant century for linking to the slider */
  century: number;
}

export const SIMULTANEOUS_FACTS: SimultaneousFact[] = [
  {
    title: 'Roman Empire + Han Dynasty (1–200 CE)',
    description: 'These two empires simultaneously controlled roughly 50% of the world\'s population, connected by the Silk Road yet barely aware of each other.',
    century: 100,
  },
  {
    title: 'Aztec + Inca + Ming Dynasty + Ottoman (1400s)',
    description: 'Four great powers existed simultaneously on four continents — none knew all the others existed.',
    century: 1500,
  },
  {
    title: 'Alexander, Chandragupta & Qin Shi Huang — within 50 years',
    description: 'Alexander conquered Persia (334–323 BCE), Chandragupta founded the Maurya Empire (322 BCE), and Qin Shi Huang unified China (221 BCE) — all within a single lifetime.',
    century: -300,
  },
];
