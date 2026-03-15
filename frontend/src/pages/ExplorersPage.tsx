/**
 * ExplorersPage — History's Greatest Explorers and Their Voyages of Discovery.
 *
 * Route: /explorers
 *
 * Sections:
 *  1. Hero — title, intro, fun stats (total distance, time span)
 *  2. Filters — by era, region explored, nationality
 *  3. Sort controls — chronological, region, legacy score
 *  4. "Firsts" callout box — first circumnavigation, first to South Pole, etc.
 *  5. Timeline view — horizontal bars showing voyage periods
 *  6. Explorer cards — 22 famous explorers with voyage details, controversy
 *     notes, quotes, legacy scores, and "Find in Chronicle" links
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Era = 'ancient' | 'medieval' | 'age of discovery' | 'early modern' | 'modern';
type SortMode = 'chronological' | 'region' | 'legacy';

interface Voyage {
  dates: string;
  route: string;
  distanceKm: number;
}

interface Explorer {
  id: number;
  name: string;
  nationality: string;
  flag: string;
  born: string;
  died: string;
  famousFor: string;
  era: Era;
  regionExplored: string;
  voyage: Voyage;
  discovery: string;
  controversy?: string;
  quote?: string;
  legacyScore: number; // 1-5
  searchQuery: string;
  voyageStartYear: number;
  voyageEndYear: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const ERA_COLORS: Record<Era, string> = {
  ancient: '#22c55e',
  medieval: '#eab308',
  'age of discovery': '#3b82f6',
  'early modern': '#a855f7',
  modern: '#f97316',
};

const REGION_COLORS: Record<string, string> = {
  Arctic: '#67e8f9',
  'Central Asia': '#f59e0b',
  'North America': '#ef4444',
  'Africa & Asia': '#22c55e',
  'Indian Ocean': '#06b6d4',
  Atlantic: '#3b82f6',
  Americas: '#f97316',
  'South America': '#84cc16',
  Pacific: '#8b5cf6',
  Canada: '#dc2626',
  Global: '#e2e8f0',
  Antarctic: '#94a3b8',
  'American West': '#d97706',
};

const CARD_STAGGER = 0.04;

// ─────────────────────────────────────────────────────────────────────────────
// Data: 22 Real Historical Explorers
// ─────────────────────────────────────────────────────────────────────────────

const EXPLORERS: Explorer[] = [
  {
    id: 1, name: 'Pytheas', nationality: 'Greek', flag: '\u{1F3DB}\uFE0F',
    born: 'c. 350 BCE', died: 'c. 285 BCE',
    famousFor: 'First to reach the British Isles and the Arctic Circle from the Mediterranean',
    era: 'ancient', regionExplored: 'Arctic',
    voyage: { dates: 'c. 325 BCE', route: 'Massalia \u2192 Britain \u2192 Thule (Iceland?) \u2192 Baltic', distanceKm: 11000 },
    discovery: 'First Greek to describe the midnight sun, tides linked to the moon, and the existence of a frozen sea.',
    quote: 'The barbarians showed us the place where the sun goes to rest.',
    legacyScore: 3, searchQuery: 'Pytheas explorer', voyageStartYear: -325, voyageEndYear: -323,
  },
  {
    id: 2, name: 'Zhang Qian', nationality: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}',
    born: 'c. 200 BCE', died: '114 BCE',
    famousFor: 'Opened the Silk Road connecting China to Central Asia and the West',
    era: 'ancient', regionExplored: 'Central Asia',
    voyage: { dates: '138\u2013126 BCE', route: "Chang'an \u2192 Fergana Valley \u2192 Bactria \u2192 return via Kunlun", distanceKm: 12000 },
    discovery: 'Brought back intelligence on Greco-Bactrian kingdoms, Parthia, and Indian trade routes, catalyzing the Silk Road.',
    legacyScore: 5, searchQuery: 'Zhang Qian Silk Road', voyageStartYear: -138, voyageEndYear: -126,
  },
  {
    id: 3, name: 'Leif Erikson', nationality: 'Norse', flag: '\u{1F1F3}\u{1F1F4}',
    born: 'c. 970 CE', died: 'c. 1020 CE',
    famousFor: 'First European to set foot in North America, ~500 years before Columbus',
    era: 'medieval', regionExplored: 'North America',
    voyage: { dates: 'c. 1000 CE', route: 'Greenland \u2192 Helluland \u2192 Markland \u2192 Vinland (Newfoundland)', distanceKm: 5500 },
    discovery: "Established a settlement at L'Anse aux Meadows, Newfoundland \u2014 confirmed by archaeology in 1960.",
    legacyScore: 4, searchQuery: 'Leif Erikson Vinland', voyageStartYear: 999, voyageEndYear: 1001,
  },
  {
    id: 4, name: 'Ibn Battuta', nationality: 'Moroccan', flag: '\u{1F1F2}\u{1F1E6}',
    born: '1304', died: '1368/1369',
    famousFor: 'Traveled 75,000 miles across the known world \u2014 further than Marco Polo',
    era: 'medieval', regionExplored: 'Africa & Asia',
    voyage: { dates: '1325\u20131354', route: 'Tangier \u2192 Mecca \u2192 Persia \u2192 India \u2192 China \u2192 Mali \u2192 return', distanceKm: 120000 },
    discovery: 'Produced the Rihla, one of the most detailed travel accounts of the medieval world, covering 44 modern countries.',
    quote: 'Traveling \u2014 it leaves you speechless, then turns you into a storyteller.',
    legacyScore: 5, searchQuery: 'Ibn Battuta travels', voyageStartYear: 1325, voyageEndYear: 1354,
  },
  {
    id: 5, name: 'Zheng He', nationality: 'Chinese', flag: '\u{1F1E8}\u{1F1F3}',
    born: '1371', died: '1433/1435',
    famousFor: 'Led 7 massive treasure fleet voyages across the Indian Ocean to East Africa',
    era: 'medieval', regionExplored: 'Indian Ocean',
    voyage: { dates: '1405\u20131433', route: 'Nanjing \u2192 Southeast Asia \u2192 India \u2192 Arabia \u2192 East Africa', distanceKm: 50000 },
    discovery: 'Commanded the largest wooden ships ever built (400+ ft) with fleets of 300+ vessels and 28,000 crew.',
    controversy: 'After his death, the Ming court destroyed records of his voyages and banned ocean-going ships, ending Chinese maritime expansion.',
    legacyScore: 5, searchQuery: 'Zheng He treasure fleet', voyageStartYear: 1405, voyageEndYear: 1433,
  },
  {
    id: 6, name: 'Bartolomeu Dias', nationality: 'Portuguese', flag: '\u{1F1F5}\u{1F1F9}',
    born: 'c. 1450', died: '1500',
    famousFor: 'First European to round the Cape of Good Hope, proving a sea route to Asia existed',
    era: 'age of discovery', regionExplored: 'Atlantic',
    voyage: { dates: '1487\u20131488', route: 'Lisbon \u2192 West African coast \u2192 Cape of Good Hope \u2192 Algoa Bay \u2192 return', distanceKm: 16000 },
    discovery: 'Proved the Atlantic and Indian Oceans were connected, opening the door for Vasco da Gama.',
    legacyScore: 4, searchQuery: 'Bartolomeu Dias Cape of Good Hope', voyageStartYear: 1487, voyageEndYear: 1488,
  },
  {
    id: 7, name: 'Christopher Columbus', nationality: 'Genoese / Spanish crown', flag: '\u{1F1EA}\u{1F1F8}',
    born: '1451', died: '1506',
    famousFor: 'Crossed the Atlantic and initiated sustained European contact with the Americas',
    era: 'age of discovery', regionExplored: 'Americas',
    voyage: { dates: '1492\u20131504 (4 voyages)', route: 'Palos de la Frontera \u2192 Canary Islands \u2192 Bahamas \u2192 Caribbean \u2192 Central America', distanceKm: 24000 },
    discovery: 'Made first sustained European contact with the Caribbean, opening the Age of Exploration and the Columbian Exchange.',
    controversy: 'His arrival led to the decimation of indigenous populations through disease, enslavement, and violence. He enslaved Ta\u00edno people and governed brutally as colonial administrator.',
    legacyScore: 5, searchQuery: 'Christopher Columbus voyages', voyageStartYear: 1492, voyageEndYear: 1504,
  },
  {
    id: 8, name: 'Vasco da Gama', nationality: 'Portuguese', flag: '\u{1F1F5}\u{1F1F9}',
    born: 'c. 1460', died: '1524',
    famousFor: 'First to sail directly from Europe to India, establishing the spice trade sea route',
    era: 'age of discovery', regionExplored: 'Indian Ocean',
    voyage: { dates: '1497\u20131499', route: 'Lisbon \u2192 Cape of Good Hope \u2192 Mozambique \u2192 Calicut, India \u2192 return', distanceKm: 24000 },
    discovery: 'Completed the sea route to India, breaking the Venetian-Arab monopoly on the spice trade.',
    controversy: 'Used violence against local populations and traders; bombarded Calicut and committed atrocities against Muslim merchants.',
    legacyScore: 5, searchQuery: 'Vasco da Gama India', voyageStartYear: 1497, voyageEndYear: 1499,
  },
  {
    id: 9, name: 'Amerigo Vespucci', nationality: 'Italian (Florentine)', flag: '\u{1F1EE}\u{1F1F9}',
    born: '1454', died: '1512',
    famousFor: 'Recognized the Americas as a separate continent, not part of Asia',
    era: 'age of discovery', regionExplored: 'South America',
    voyage: { dates: '1499\u20131502', route: 'Spain/Portugal \u2192 Caribbean \u2192 Brazilian coast \u2192 Patagonia', distanceKm: 18000 },
    discovery: 'His letters convinced European geographers this was a "New World" \u2014 cartographer Waldseem\u00fcller named the continents after him.',
    controversy: 'Some historians debate whether he embellished or fabricated details of his voyages.',
    quote: 'I resolved to give up trading and to set my aim at something more praiseworthy and stable.',
    legacyScore: 4, searchQuery: 'Amerigo Vespucci Americas', voyageStartYear: 1499, voyageEndYear: 1502,
  },
  {
    id: 10, name: 'Ferdinand Magellan', nationality: 'Portuguese / Spanish crown', flag: '\u{1F1EA}\u{1F1F8}',
    born: '1480', died: '1521',
    famousFor: 'Organized the first circumnavigation of the Earth (completed by Juan Sebasti\u00e1n Elcano)',
    era: 'age of discovery', regionExplored: 'Global',
    voyage: { dates: '1519\u20131522', route: 'Seville \u2192 Atlantic \u2192 Strait of Magellan \u2192 Pacific \u2192 Philippines \u2192 (Elcano) \u2192 Spain', distanceKm: 60000 },
    discovery: 'Proved the Earth could be circumnavigated by sea and revealed the immense scale of the Pacific Ocean.',
    controversy: 'Killed in the Battle of Mactan in the Philippines. The expedition had violent encounters with indigenous peoples.',
    legacyScore: 5, searchQuery: 'Ferdinand Magellan circumnavigation', voyageStartYear: 1519, voyageEndYear: 1522,
  },
  {
    id: 11, name: 'Francisco Pizarro', nationality: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}',
    born: 'c. 1478', died: '1541',
    famousFor: 'Conquered the Inca Empire with fewer than 200 men',
    era: 'age of discovery', regionExplored: 'South America',
    voyage: { dates: '1531\u20131533', route: 'Panama \u2192 Ecuador coast \u2192 Tumbes \u2192 Cajamarca \u2192 Cusco', distanceKm: 5000 },
    discovery: "Captured Inca emperor Atahualpa, extracted history's largest ransom (a room filled with gold), and toppled the largest empire in the Americas.",
    controversy: 'Executed Atahualpa despite the ransom being paid. His conquest led to the destruction of Inca civilization, millions of deaths, and the looting of vast cultural heritage.',
    legacyScore: 4, searchQuery: 'Francisco Pizarro Inca', voyageStartYear: 1531, voyageEndYear: 1533,
  },
  {
    id: 12, name: 'Hern\u00e1n Cort\u00e9s', nationality: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}',
    born: '1485', died: '1547',
    famousFor: 'Conquered the Aztec Empire and claimed Mexico for Spain',
    era: 'age of discovery', regionExplored: 'Americas',
    voyage: { dates: '1519\u20131521', route: 'Cuba \u2192 Veracruz \u2192 Tlaxcala \u2192 Tenochtitlan (Mexico City)', distanceKm: 3000 },
    discovery: 'Forged alliances with subjugated peoples to defeat the Aztec Empire and seize Tenochtitlan, one of the largest cities in the world.',
    controversy: 'His conquest caused the collapse of Aztec civilization. Smallpox and warfare killed millions. Systematic destruction of indigenous culture and records.',
    legacyScore: 4, searchQuery: 'Hernan Cortes Aztec', voyageStartYear: 1519, voyageEndYear: 1521,
  },
  {
    id: 13, name: 'Jacques Cartier', nationality: 'French', flag: '\u{1F1EB}\u{1F1F7}',
    born: '1491', died: '1557',
    famousFor: 'Explored the St. Lawrence River and claimed Canada for France',
    era: 'age of discovery', regionExplored: 'Canada',
    voyage: { dates: '1534\u20131542 (3 voyages)', route: 'Saint-Malo \u2192 Newfoundland \u2192 Gulf of St. Lawrence \u2192 Hochelaga (Montr\u00e9al)', distanceKm: 12000 },
    discovery: 'Mapped the St. Lawrence River, established French claims to Canada, and introduced the word "Canada" (from Iroquoian "kanata" meaning village).',
    controversy: 'Kidnapped indigenous Iroquoian chiefs and their sons and brought them to France.',
    legacyScore: 3, searchQuery: 'Jacques Cartier Canada', voyageStartYear: 1534, voyageEndYear: 1542,
  },
  {
    id: 14, name: 'Francis Drake', nationality: 'English', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
    born: 'c. 1540', died: '1596',
    famousFor: 'Second person to circumnavigate the globe; Spanish Armada hero',
    era: 'age of discovery', regionExplored: 'Global',
    voyage: { dates: '1577\u20131580', route: 'Plymouth \u2192 Atlantic \u2192 Strait of Magellan \u2192 Pacific \u2192 Spice Islands \u2192 Cape of Good Hope \u2192 England', distanceKm: 58000 },
    discovery: 'Completed the second circumnavigation, raided Spanish ports and treasure ships, and claimed Nova Albion (California) for England.',
    controversy: 'Was essentially a licensed pirate (privateer). Raided Spanish colonies and slave ports. Involved in the early English slave trade.',
    quote: 'There must be a beginning of any great matter, but the continuing unto the end until it be thoroughly finished yields the true glory.',
    legacyScore: 4, searchQuery: 'Francis Drake circumnavigation', voyageStartYear: 1577, voyageEndYear: 1580,
  },
  {
    id: 15, name: 'Walter Raleigh', nationality: 'English', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
    born: 'c. 1552', died: '1618',
    famousFor: 'Explored Guiana in search of El Dorado and sponsored the Roanoke colony',
    era: 'age of discovery', regionExplored: 'Americas',
    voyage: { dates: '1584\u20131595', route: 'England \u2192 Virginia coast (Roanoke) \u2192 Trinidad \u2192 Orinoco River, Venezuela', distanceKm: 14000 },
    discovery: "Popularized tobacco and potatoes in England. His Roanoke colony became the \"Lost Colony\" \u2014 one of history's great mysteries.",
    controversy: 'His colonization efforts displaced indigenous peoples. Was eventually executed for disobeying orders and attacking a Spanish outpost.',
    quote: 'I have a long journey to take, and must bid the company farewell.',
    legacyScore: 3, searchQuery: 'Walter Raleigh exploration', voyageStartYear: 1584, voyageEndYear: 1595,
  },
  {
    id: 16, name: 'Henry Hudson', nationality: 'English', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
    born: 'c. 1565', died: '1611',
    famousFor: 'Explored the Hudson River and Hudson Bay seeking the Northwest Passage',
    era: 'early modern', regionExplored: 'North America',
    voyage: { dates: '1607\u20131611 (4 voyages)', route: 'England \u2192 Svalbard \u2192 Nova Zembla \u2192 Hudson River (NY) \u2192 Hudson Bay', distanceKm: 18000 },
    discovery: 'Explored the river and bay that bear his name, establishing Dutch claims to what became New Amsterdam (New York).',
    controversy: 'His crew mutinied on his final voyage, setting him adrift in Hudson Bay in a small boat. He was never seen again.',
    legacyScore: 3, searchQuery: 'Henry Hudson exploration', voyageStartYear: 1607, voyageEndYear: 1611,
  },
  {
    id: 17, name: 'Abel Tasman', nationality: 'Dutch', flag: '\u{1F1F3}\u{1F1F1}',
    born: '1603', died: '1659',
    famousFor: 'First European to reach New Zealand, Tasmania, and Fiji',
    era: 'early modern', regionExplored: 'Pacific',
    voyage: { dates: '1642\u20131644', route: 'Batavia (Jakarta) \u2192 Tasmania \u2192 New Zealand \u2192 Tonga \u2192 Fiji \u2192 New Guinea \u2192 return', distanceKm: 25000 },
    discovery: 'Proved Australia was not connected to a hypothetical southern continent. Tasmania is named after him.',
    controversy: 'Violent encounters with M\u0101ori in New Zealand; several of his crew were killed and he retaliated.',
    legacyScore: 3, searchQuery: 'Abel Tasman New Zealand', voyageStartYear: 1642, voyageEndYear: 1644,
  },
  {
    id: 18, name: 'James Cook', nationality: 'British', flag: '\u{1F1EC}\u{1F1E7}',
    born: '1728', died: '1779',
    famousFor: 'Three voyages that mapped the Pacific, Australia, and approached Antarctica',
    era: 'early modern', regionExplored: 'Pacific',
    voyage: { dates: '1768\u20131779 (3 voyages)', route: 'England \u2192 Tahiti \u2192 New Zealand \u2192 Australia \u2192 Antarctic Circle \u2192 Hawaii', distanceKm: 100000 },
    discovery: 'Mapped more of the world than any other explorer. First European to reach eastern Australia and the Hawaiian Islands.',
    controversy: 'Killed in Hawaii during a confrontation with Native Hawaiians. His voyages led to European colonization of the Pacific that devastated indigenous cultures.',
    quote: 'Ambition leads me not only farther than any other man has been before me, but as far as I think it possible for man to go.',
    legacyScore: 5, searchQuery: 'James Cook voyages', voyageStartYear: 1768, voyageEndYear: 1779,
  },
  {
    id: 19, name: 'Alexander von Humboldt', nationality: 'German', flag: '\u{1F1E9}\u{1F1EA}',
    born: '1769', died: '1859',
    famousFor: 'Father of modern geography and ecology; mapped South America scientifically',
    era: 'modern', regionExplored: 'South America',
    voyage: { dates: '1799\u20131804', route: 'Spain \u2192 Venezuela \u2192 Orinoco \u2192 Andes \u2192 Mexico \u2192 Cuba \u2192 Washington D.C.', distanceKm: 10000 },
    discovery: 'Climbed Chimborazo (then thought to be the tallest mountain). Invented isothermal lines, described climate zones, and connected ecology to geography.',
    quote: 'The most dangerous worldview is the worldview of those who have not viewed the world.',
    legacyScore: 5, searchQuery: 'Alexander von Humboldt', voyageStartYear: 1799, voyageEndYear: 1804,
  },
  {
    id: 20, name: 'Meriwether Lewis & William Clark', nationality: 'American', flag: '\u{1F1FA}\u{1F1F8}',
    born: '1770 / 1770', died: '1809 / 1838',
    famousFor: 'Led the Corps of Discovery across the American West to the Pacific',
    era: 'modern', regionExplored: 'American West',
    voyage: { dates: '1804\u20131806', route: 'St. Louis \u2192 Missouri River \u2192 Rocky Mountains \u2192 Columbia River \u2192 Pacific coast \u2192 return', distanceKm: 13000 },
    discovery: 'Mapped the western two-thirds of North America, documented 300+ species unknown to Western science, and established US claims to the Oregon Country.',
    controversy: 'The expedition relied heavily on Sacagawea and indigenous guides. It accelerated westward expansion that displaced Native American nations.',
    quote: 'Ocean in view! O! The joy!',
    legacyScore: 4, searchQuery: 'Lewis and Clark expedition', voyageStartYear: 1804, voyageEndYear: 1806,
  },
  {
    id: 21, name: 'Ernest Shackleton', nationality: 'British (Anglo-Irish)', flag: '\u{1F1EC}\u{1F1E7}',
    born: '1874', died: '1922',
    famousFor: "Led the Endurance expedition \u2014 one of history's greatest survival stories",
    era: 'modern', regionExplored: 'Antarctic',
    voyage: { dates: '1914\u20131916', route: 'London \u2192 Buenos Aires \u2192 South Georgia \u2192 Weddell Sea \u2192 Elephant Island \u2192 South Georgia rescue', distanceKm: 2500 },
    discovery: 'After his ship Endurance was crushed by ice, he led all 27 crew to safety across 800 miles of open Antarctic ocean in a 22-foot lifeboat.',
    quote: 'Difficulties are just things to overcome, after all.',
    legacyScore: 4, searchQuery: 'Ernest Shackleton Endurance', voyageStartYear: 1914, voyageEndYear: 1916,
  },
  {
    id: 22, name: 'Roald Amundsen', nationality: 'Norwegian', flag: '\u{1F1F3}\u{1F1F4}',
    born: '1872', died: '1928',
    famousFor: 'First person to reach the South Pole; first to traverse the Northwest Passage',
    era: 'modern', regionExplored: 'Antarctic',
    voyage: { dates: '1910\u20131912', route: 'Norway \u2192 Madeira \u2192 Bay of Whales, Antarctica \u2192 South Pole \u2192 return', distanceKm: 3000 },
    discovery: 'Reached the South Pole on Dec 14, 1911, beating Robert Scott by 34 days. Used dog sleds and meticulous planning.',
    quote: 'Adventure is just bad planning.',
    legacyScore: 5, searchQuery: 'Roald Amundsen South Pole', voyageStartYear: 1910, voyageEndYear: 1912,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Derived Constants
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_DISTANCE = EXPLORERS.reduce((sum, e) => sum + e.voyage.distanceKm, 0);

const FIRSTS: { label: string; explorer: string; year: string }[] = [
  { label: 'First to reach the Arctic', explorer: 'Pytheas', year: 'c. 325 BCE' },
  { label: 'First to open the Silk Road', explorer: 'Zhang Qian', year: '138 BCE' },
  { label: 'First European in North America', explorer: 'Leif Erikson', year: 'c. 1000 CE' },
  { label: 'First to round Cape of Good Hope', explorer: 'Bartolomeu Dias', year: '1488' },
  { label: 'First sea route to India', explorer: 'Vasco da Gama', year: '1497' },
  { label: 'First circumnavigation', explorer: 'Magellan / Elcano', year: '1519\u20131522' },
  { label: 'First European in New Zealand', explorer: 'Abel Tasman', year: '1642' },
  { label: 'First to reach the South Pole', explorer: 'Roald Amundsen', year: '1911' },
];

const ERA_RANGES: Record<Era, string> = {
  ancient: 'before 500 CE',
  medieval: '500\u20131400',
  'age of discovery': '1400\u20131600',
  'early modern': '1600\u20131800',
  modern: '1800\u2013present',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_MIN = -350;
const TIMELINE_MAX = 1920;

function yearToPercent(year: number): number {
  return ((year - TIMELINE_MIN) / (TIMELINE_MAX - TIMELINE_MIN)) * 100;
}

function formatTimelineYear(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return `${year}`;
}

function renderStars(score: number): string {
  return '\u2605'.repeat(score) + '\u2606'.repeat(5 - score);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
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
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13, fontWeight: 700, color: '#475569',
          textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function EraBadge({ era }: { era: Era }) {
  const color = ERA_COLORS[era];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
      backgroundColor: `${color}22`, color, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {era}
    </span>
  );
}

function RegionBadge({ region }: { region: string }) {
  const color = REGION_COLORS[region] || '#94a3b8';
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
      backgroundColor: `${color}22`, color, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {region}
    </span>
  );
}

function FilterPill({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20,
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
        backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.04)',
        color: active ? color : '#94a3b8',
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Explorer Card
// ─────────────────────────────────────────────────────────────────────────────

function ExplorerCard({ explorer, index }: { explorer: Explorer; index: number }) {
  const eraColor = ERA_COLORS[explorer.era];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * CARD_STAGGER, duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${eraColor}33`,
        borderRadius: 12, padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      {/* Header: name + badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
            {explorer.flag} {explorer.name}
          </h3>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
            {explorer.nationality} &middot; {explorer.born} &ndash; {explorer.died}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <EraBadge era={explorer.era} />
          <RegionBadge region={explorer.regionExplored} />
        </div>
      </div>

      {/* Famous for */}
      <p style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
        {explorer.famousFor}
      </p>

      {/* Key Voyage */}
      <div style={{
        padding: '10px 14px', borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Key Voyage
        </div>
        <div style={{ color: '#94a3b8' }}>
          <span style={{ color: '#64748b' }}>Dates:</span> {explorer.voyage.dates}
        </div>
        <div style={{ color: '#94a3b8' }}>
          <span style={{ color: '#64748b' }}>Route:</span> {explorer.voyage.route}
        </div>
        <div style={{ color: '#94a3b8' }}>
          <span style={{ color: '#64748b' }}>Distance:</span>{' '}
          <span style={{ color: '#60a5fa', fontWeight: 600 }}>{explorer.voyage.distanceKm.toLocaleString()} km</span>
        </div>
      </div>

      {/* Discovery / Achievement */}
      <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{explorer.discovery}</p>

      {/* Controversy (if any) */}
      {explorer.controversy && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          backgroundColor: 'rgba(239,68,68,0.05)', borderLeft: '3px solid rgba(239,68,68,0.3)',
          fontSize: 12, color: '#94a3b8', lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700, color: '#ef4444', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Controversy:
          </span>{' '}
          {explorer.controversy}
        </div>
      )}

      {/* Quote (if any) */}
      {explorer.quote && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          backgroundColor: 'rgba(96,165,250,0.06)', borderLeft: '3px solid #3b82f644',
          fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, fontStyle: 'italic',
        }}>
          &ldquo;{explorer.quote}&rdquo;
        </div>
      )}

      {/* Legacy Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <span style={{ color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Legacy:
        </span>
        <span style={{ color: '#eab308', letterSpacing: 2 }}>{renderStars(explorer.legacyScore)}</span>
      </div>

      {/* Find in Chronicle link */}
      <Link
        to={`/search?q=${encodeURIComponent(explorer.searchQuery)}`}
        style={{
          display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, color: '#60a5fa', textDecoration: 'none',
          padding: '6px 14px', borderRadius: 6,
          border: '1px solid rgba(96,165,250,0.3)', backgroundColor: 'rgba(96,165,250,0.08)',
          transition: 'background 0.15s', marginTop: 'auto',
        }}
      >
        Find in Chronicle &rarr;
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Timeline View
// ─────────────────────────────────────────────────────────────────────────────

function TimelineView({ explorers }: { explorers: Explorer[] }) {
  const sorted = [...explorers].sort((a, b) => a.voyageStartYear - b.voyageStartYear);
  const ticks = [-300, 0, 500, 1000, 1200, 1400, 1500, 1600, 1700, 1800, 1900];

  return (
    <SectionWrapper title="Voyage Timeline" icon="\u{1F4CA}">
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 800 }}>
          {/* Tick marks */}
          <div style={{ position: 'relative', height: 24, marginBottom: 8 }}>
            {ticks.map((year) => (
              <span
                key={year}
                style={{
                  position: 'absolute', left: `${yearToPercent(year)}%`,
                  transform: 'translateX(-50%)', fontSize: 9, color: '#475569', whiteSpace: 'nowrap',
                }}
              >
                {formatTimelineYear(year)}
              </span>
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sorted.map((e) => {
              const left = yearToPercent(e.voyageStartYear);
              const right = yearToPercent(e.voyageEndYear);
              const width = Math.max(right - left, 0.5);
              const color = ERA_COLORS[e.era];

              return (
                <div key={e.id} style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute', right: `${100 - left + 1}%`,
                    fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', textAlign: 'right', fontWeight: 600,
                  }}>
                    {e.name}
                  </span>
                  <div
                    style={{
                      position: 'absolute', left: `${left}%`, width: `${width}%`,
                      height: 14, borderRadius: 3,
                      backgroundColor: `${color}66`, border: `1px solid ${color}aa`,
                    }}
                    title={`${e.name}: ${e.voyage.dates}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Firsts Callout
// ─────────────────────────────────────────────────────────────────────────────

function FirstsCallout() {
  return (
    <SectionWrapper title="Exploration Firsts" icon="\u{1F3C6}">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {FIRSTS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            style={{
              padding: '14px 18px', borderRadius: 10,
              backgroundColor: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: '#eab308' }}>{f.label}</div>
            <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600 }}>{f.explorer}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>{f.year}</div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ExplorersPage() {
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

  const [eraFilter, setEraFilter] = useState<Era | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [nationalityFilter, setNationalityFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  const allRegions = useMemo(() => [...new Set(EXPLORERS.map((e) => e.regionExplored))].sort(), []);
  const allNationalities = useMemo(() => [...new Set(EXPLORERS.map((e) => e.nationality))].sort(), []);

  const filtered = useMemo(() => {
    let result = EXPLORERS.filter((e) => {
      if (eraFilter && e.era !== eraFilter) return false;
      if (regionFilter && e.regionExplored !== regionFilter) return false;
      if (nationalityFilter && e.nationality !== nationalityFilter) return false;
      return true;
    });

    switch (sortMode) {
      case 'chronological':
        result = [...result].sort((a, b) => a.voyageStartYear - b.voyageStartYear);
        break;
      case 'region':
        result = [...result].sort((a, b) => a.regionExplored.localeCompare(b.regionExplored));
        break;
      case 'legacy':
        result = [...result].sort((a, b) => b.legacyScore - a.legacyScore);
        break;
    }
    return result;
  }, [eraFilter, regionFilter, nationalityFilter, sortMode]);

  const activeFilterCount = [eraFilter, regionFilter, nationalityFilter].filter(Boolean).length;

  return (
    <PageShell>
      {/* Hero */}
      <div style={{
        padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(59,130,246,0.08) 100%)',
      }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b',
          textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)',
        }}>
          &larr; Back to Timeline
        </Link>

        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 16 }}>
          Explorers of History
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#94a3b8', lineHeight: 1.6, maxWidth: 700, margin: 0 }}>
          From ancient Greek mariners to Antarctic heroes &mdash; the voyagers who pushed the boundaries
          of the known world, connected civilizations, and charted the planet.
        </p>

        {/* Quick stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
          {[
            { label: 'Explorers', value: `${EXPLORERS.length}` },
            { label: 'Time Span', value: '2,300 years' },
            { label: 'Total Distance', value: `${Math.round(TOTAL_DISTANCE / 1000)}k km` },
            { label: 'Continents Reached', value: 'All 7' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '10px 18px', borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <SectionWrapper title={`Filters${activeFilterCount ? ` (${activeFilterCount} active)` : ''}`} icon="\u{1F50D}">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Era</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(Object.keys(ERA_COLORS) as Era[]).map((era) => (
                <FilterPill key={era} label={`${era.charAt(0).toUpperCase() + era.slice(1)} (${ERA_RANGES[era]})`}
                  active={eraFilter === era} color={ERA_COLORS[era]}
                  onClick={() => setEraFilter(eraFilter === era ? null : era)} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Region Explored</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allRegions.map((region) => (
                <FilterPill key={region} label={region} active={regionFilter === region}
                  color={REGION_COLORS[region] || '#94a3b8'}
                  onClick={() => setRegionFilter(regionFilter === region ? null : region)} />
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nationality</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {allNationalities.map((nat) => (
                <FilterPill key={nat} label={nat} active={nationalityFilter === nat} color="#a855f7"
                  onClick={() => setNationalityFilter(nationalityFilter === nat ? null : nat)} />
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setEraFilter(null); setRegionFilter(null); setNationalityFilter(null); }}
              style={{
                alignSelf: 'flex-start', fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)',
                color: '#94a3b8', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      </SectionWrapper>

      {/* Sort controls */}
      <SectionWrapper title="Sort By" icon="\u2195\uFE0F">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {([
            { mode: 'chronological' as SortMode, label: 'Chronological' },
            { mode: 'region' as SortMode, label: 'Region Explored' },
            { mode: 'legacy' as SortMode, label: 'Legacy Score' },
          ]).map(({ mode, label }) => (
            <FilterPill key={mode} label={label} active={sortMode === mode} color="#60a5fa"
              onClick={() => setSortMode(mode)} />
          ))}
        </div>
      </SectionWrapper>

      {/* Firsts */}
      <FirstsCallout />

      {/* Timeline */}
      <TimelineView explorers={filtered} />

      {/* Explorer cards */}
      <SectionWrapper title={`Explorers (${filtered.length})`} icon="\u{1F9ED}">
        {filtered.length === 0 ? (
          <div style={{
            padding: '20px 24px', borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#64748b', fontSize: 14, textAlign: 'center',
          }}>
            No explorers match the current filters.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16 }}>
            {filtered.map((e, i) => (
              <ExplorerCard key={e.id} explorer={e} index={i} />
            ))}
          </div>
        )}
      </SectionWrapper>
    </PageShell>
  );
}
