/**
 * SilkRoadPage — curated topic page: Silk Road deep-dive.
 *
 * Route: /silk-road
 *
 * Sections:
 *  1. Hero — "The Silk Road — 4,000 Miles of Trade, Ideas, and Disease (130 BCE – 1453 CE)"
 *  2. Tab navigation — switch between sections
 *  3. What Was the Silk Road — network overview, land + maritime routes
 *  4. Origins — Zhang Qian, Han Dynasty, Parthian connection
 *  5. Route Map — visual waypoints (land + maritime)
 *  6. Trade Goods — East→West, West→East, Both directions
 *  7. Key Cities — Samarkand, Kashgar, Merv, Dunhuang
 *  8. Religions — Buddhism, Islam, Nestorian Christianity, Manichaeism
 *  9. Famous Travelers — Zhang Qian, Xuanzang, Marco Polo, Ibn Battuta
 * 10. Disease — Black Death origin, spread via trade routes
 * 11. Pax Mongolica — Mongol Empire safe passage era
 * 12. Decline — Ottoman conquest, sea routes, Age of Exploration
 * 13. Legacy — globalization template, UNESCO, Belt and Road
 *
 * All data is static/curated — no backend API needed.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme — Silk Road palette: desert gold, lapis blue, spice red, jade green
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#c9a84c';    // desert gold
const BG = '#0a0c10';        // near-black
const TEXT = '#e8e4de';       // warm off-white
const TEXT_DIM = '#9a9486';   // muted
const TEXT_MUTED = '#6b6458'; // darker muted
const CARD_BG = 'rgba(201,168,76,0.05)';
const CARD_BORDER = 'rgba(201,168,76,0.18)';
const GOLD = '#c9a84c';
const LAPIS = '#1e3a8a';     // lapis lazuli blue
const SPICE = '#b91c1c';     // spice red
const JADE = '#166534';      // jade green
const SAND = '#b8a070';      // desert sand
const PURPLE = '#7c3aed';    // Tyrian purple
const TEAL = '#0d9488';      // maritime teal
const AMBER = '#d97706';     // amber
const CRIMSON = '#be123c';   // crimson
const INDIGO = '#4338ca';    // indigo

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SectionTab = 'overview' | 'origins' | 'routes' | 'trade' | 'cities' | 'religions' | 'travelers' | 'disease' | 'mongols' | 'decline' | 'legacy';

interface TradeGood {
  name: string;
  detail: string;
  icon: string;
}

interface City {
  name: string;
  region: string;
  peak: string;
  role: string;
  fate: string;
  color: string;
  icon: string;
}

interface Religion {
  name: string;
  origin: string;
  route: string;
  detail: string;
  color: string;
  icon: string;
}

interface Traveler {
  name: string;
  dates: string;
  journey: string;
  documented: string;
  significance: string;
  color: string;
  icon: string;
}

interface RouteWaypoint {
  name: string;
  role: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — Route Waypoints
// ─────────────────────────────────────────────────────────────────────────────

const LAND_ROUTE: RouteWaypoint[] = [
  { name: "Chang'an (Xi'an)", role: 'Eastern terminus — Tang Dynasty capital, cosmopolitan hub of 1M people' },
  { name: 'Dunhuang', role: 'Gateway to the desert — last Chinese outpost, Mogao Caves repository of Buddhist art' },
  { name: 'Kashgar', role: 'Crossroads oasis — where northern and southern Taklamakan routes converge' },
  { name: 'Samarkand', role: 'Central hub — Sogdian merchant capital, papermaking learned from Chinese captives (751)' },
  { name: 'Merv', role: 'Persian gateway — one of the largest cities in the world by 1200 CE' },
  { name: 'Ctesiphon', role: 'Mesopotamian interchange — Parthian/Sasanian capital, bridge between East and West' },
  { name: 'Antioch', role: 'Mediterranean port — Roman gateway to Eastern goods' },
  { name: 'Rome / Constantinople', role: 'Western terminus — insatiable demand for silk, spices, and Eastern luxuries' },
];

const MARITIME_ROUTE: RouteWaypoint[] = [
  { name: 'Guangzhou / Quanzhou', role: 'Chinese ports — massive junks carrying porcelain and silk' },
  { name: 'Malacca Strait', role: 'Chokepoint — where Southeast Asian spices joined the flow' },
  { name: 'Ceylon (Sri Lanka)', role: 'Indian Ocean hub — cinnamon, gems, and a crossroads of shipping lanes' },
  { name: 'Aden / Hormuz', role: 'Arabian gateways — incense, pearls, and transshipment to land routes' },
  { name: 'East African Coast', role: 'Swahili ports (Kilwa, Mombasa) — ivory, gold, and enslaved people traded for textiles' },
  { name: 'Alexandria / Cairo', role: 'Mediterranean gateway — goods funneled to European markets' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Trade Goods
// ─────────────────────────────────────────────────────────────────────────────

const EAST_TO_WEST: TradeGood[] = [
  { name: 'Silk', detail: 'The luxury that named the road. Chinese monopoly on sericulture lasted 3,000 years — smuggling silkworm eggs was punishable by death. Roman senators wore it; the Senate tried to ban it as decadent.', icon: '🧵' },
  { name: 'Porcelain', detail: 'Chinese "white gold" — Europeans spent centuries trying to reverse-engineer it. The word "china" became synonymous with fine ceramics.', icon: '🏺' },
  { name: 'Tea', detail: 'From medicinal herb to global commodity. Tea horses — the Tea-Horse Road branched south through Tibet and Yunnan.', icon: '🍵' },
  { name: 'Spices', detail: 'Cinnamon, pepper, cloves, nutmeg. Worth more than gold by weight in medieval Europe. Controlled by intermediaries who invented fantastical origin stories.', icon: '🌶️' },
  { name: 'Paper', detail: 'Invented in China c. 105 CE, reached the Islamic world after the Battle of Talas (751) when Chinese papermakers were captured. Revolutionized Islamic scholarship.', icon: '📜' },
  { name: 'Gunpowder', detail: 'Chinese alchemists seeking immortality accidentally discovered it. Reached Europe by the 13th century and changed warfare forever.', icon: '💥' },
  { name: 'Compass', detail: 'Chinese invention using lodestone, transmitted to Islamic navigators and then Europe. Enabled the Age of Exploration.', icon: '🧭' },
  { name: 'Jade', detail: 'Sacred stone in Chinese culture. Khotan jade from Central Asia was the most prized, traded for millennia before the Silk Road was formalized.', icon: '💎' },
];

const WEST_TO_EAST: TradeGood[] = [
  { name: 'Gold & Silver', detail: 'Roman gold flowed east to pay for silk — so much that Roman writers complained about trade deficits draining the treasury. The "bullion drain" was an ancient balance-of-payments crisis.', icon: '🪙' },
  { name: 'Glassware', detail: 'Roman and later Islamic glass was prized in China. Glass beads served as currency along parts of the route. Chinese glassmaking never matched Western quality.', icon: '🔮' },
  { name: 'Wool & Linen', detail: 'Western textiles traded eastward. Roman wool was finer than anything available in Central Asia, used for diplomatic gifts and luxury garments.', icon: '🐑' },
  { name: 'Ferghana Horses', detail: '"Blood-sweating" heavenly horses from the Ferghana Valley — Emperor Wu of Han waged war (104–101 BCE) to secure them. Superior war horses transformed Chinese cavalry.', icon: '🐎' },
  { name: 'Grapes & Wine', detail: 'Viticulture traveled from Persia and the Mediterranean to China. Zhang Qian brought grape seeds back from his mission. Wine became a Tang Dynasty luxury.', icon: '🍇' },
  { name: 'Amber', detail: 'Baltic amber reached China via intermediaries — a journey of 5,000+ miles. Found in Chinese tombs alongside jade, prized for its warmth and beauty.', icon: '💛' },
];

const BOTH_DIRECTIONS: TradeGood[] = [
  { name: 'Ideas & Philosophy', detail: 'The Silk Road was above all a highway of ideas. Greek logic influenced Buddhist philosophy; Indian mathematics (zero, decimals) transformed Islamic science; Chinese technology reshaped European industry.', icon: '💡' },
  { name: 'Religions', detail: 'Buddhism, Islam, Christianity, Manichaeism, Zoroastrianism — all spread along the Silk Road. Merchants were missionaries; caravanserais were interfaith meeting points.', icon: '🕌' },
  { name: 'Diseases', detail: 'Plague, smallpox, measles traveled with caravans. The Black Death (1347) was the most devastating — originating in Central Asia and killing 30–60% of Europe\'s population.', icon: '🦠' },
  { name: 'Art Styles', detail: 'Greco-Buddhist art (Gandhara), Chinese-Islamic ceramics, Persian miniature painting influenced by Chinese brush techniques — artistic cross-pollination flourished.', icon: '🎨' },
  { name: 'Technology', detail: 'Irrigation systems, metallurgy, textile techniques, astronomical instruments, medical knowledge — practical technology flowed both ways, adapted and improved at each stop.', icon: '⚙️' },
  { name: 'Music & Dance', detail: 'Central Asian music and dance transformed Tang Dynasty court culture. The pipa (lute) came from Persia. Chinese instruments traveled west. Musical notation systems were shared.', icon: '🎵' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Key Cities
// ─────────────────────────────────────────────────────────────────────────────

const KEY_CITIES: City[] = [
  {
    name: 'Samarkand',
    region: 'Uzbekistan (Sogdiana)',
    peak: '700–1400 CE',
    role: 'The supreme crossroads. Sogdian merchants — the "FedEx of the ancient world" — operated from here across the entire route. After 751, captured Chinese papermakers established the first paper mills outside China. Under Timur (1370s), it became the most magnificent city in Central Asia.',
    fate: 'Declined after maritime routes bypassed land trade. Revived under Russian/Soviet rule. Today a UNESCO World Heritage Site.',
    color: GOLD,
    icon: '🕌',
  },
  {
    name: 'Kashgar',
    region: 'Xinjiang, China (Tarim Basin)',
    peak: '100 BCE – 1500 CE',
    role: 'The great junction where northern and southern routes around the Taklamakan Desert converged. A melting pot of Chinese, Turkic, Persian, and Indian cultures. Its Sunday bazaar was legendary — 100,000+ traders.',
    fate: 'Remained a trading hub into the modern era. Still an important border city between China and Central Asia. Old town partially demolished and rebuilt.',
    color: SPICE,
    icon: '🏪',
  },
  {
    name: 'Merv',
    region: 'Turkmenistan (Khorasan)',
    peak: '800–1200 CE',
    role: 'One of the largest cities in the world by 1150 CE (population ~500,000). A center of Islamic scholarship, with libraries rivaling Baghdad. Key transshipment point between Persian and Central Asian routes.',
    fate: 'Utterly destroyed by the Mongols in 1221 — possibly 1 million killed in the massacre. Never recovered. Now ruins in the Turkmen desert.',
    color: CRIMSON,
    icon: '📚',
  },
  {
    name: 'Dunhuang',
    region: 'Gansu, China',
    peak: '400–1000 CE',
    role: 'The last Chinese outpost before the desert. The Mogao Caves (Caves of the Thousand Buddhas) contain 2,000+ painted sculptures and 45,000+ sq meters of murals — the greatest repository of Buddhist art in the world. A sealed library cave held 50,000+ manuscripts in multiple languages.',
    fate: 'Declined after Song Dynasty shifted focus south. The cave library was sealed ~1000 CE and rediscovered in 1900 by a Taoist monk. Many manuscripts taken by foreign explorers (Stein, Pelliot).',
    color: AMBER,
    icon: '🎨',
  },
  {
    name: "Chang'an (Xi'an)",
    region: 'Shaanxi, China',
    peak: '200 BCE – 900 CE',
    role: 'Eastern terminus and starting point. Capital of 13 dynasties. Under the Tang Dynasty (618–907), it was the largest city in the world (~1 million people) and the most cosmopolitan — home to Zoroastrian temples, Nestorian churches, Islamic mosques, and Buddhist monasteries side by side.',
    fate: "Lost capital status after the Tang Dynasty fell. Renamed Xi'an. The Terracotta Army and city walls remain. Modern population 13 million.",
    color: JADE,
    icon: '🏛️',
  },
  {
    name: 'Constantinople (Istanbul)',
    region: 'Turkey (Byzantine/Ottoman)',
    peak: '330–1453 CE',
    role: 'Western gateway and ultimate destination for many goods. The Byzantine Empire controlled the chokepoint between Asia and Europe. The Hippodrome displayed silks; the Grand Bazaar (after 1453) became the world\'s largest covered market.',
    fate: 'Fell to the Ottomans in 1453, which blocked Silk Road access for European merchants — directly triggering the Age of Exploration.',
    color: LAPIS,
    icon: '⛪',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Religions
// ─────────────────────────────────────────────────────────────────────────────

const RELIGIONS: Religion[] = [
  {
    name: 'Buddhism',
    origin: 'India (5th century BCE)',
    route: 'India → Gandhara → Central Asia → China → Korea → Japan',
    detail: 'The Silk Road\'s most transformative export. Kushan Empire merchants carried Buddhism into Central Asia. The Dunhuang cave paintings document its journey. Xuanzang\'s 17-year pilgrimage (629–645) to bring back Buddhist scriptures became the basis for "Journey to the West." By 700 CE, Buddhism had become China\'s dominant religion alongside Confucianism and Daoism.',
    color: AMBER,
    icon: '☸️',
  },
  {
    name: 'Islam',
    origin: 'Arabia (7th century CE)',
    route: 'Arabia → Persia → Central Asia → Xinjiang → eastern China',
    detail: 'After the Arab conquests (7th–8th centuries), Islam spread rapidly along trade routes. The Battle of Talas (751) — where Arabs defeated Tang China — marked Islam\'s permanent establishment in Central Asia. Muslim merchants (Hui people) settled across China. The Great Mosque of Xi\'an, founded 742 CE, still stands. By 1000 CE, Central Asia was predominantly Muslim.',
    color: JADE,
    icon: '☪️',
  },
  {
    name: 'Nestorian Christianity',
    origin: 'Syria (5th century CE)',
    route: 'Syria → Persia → Central Asia → China (Tang Dynasty)',
    detail: 'Declared heretical by the Council of Ephesus (431), Nestorian Christians fled east along trade routes. They established churches across Persia and Central Asia. The Nestorian Stele (781) in Xi\'an documents a thriving Christian community in Tang China. The Church of the East reached Mongolia — Genghis Khan\'s mother was Nestorian. Largely wiped out by Timur\'s conquests.',
    color: LAPIS,
    icon: '✝️',
  },
  {
    name: 'Manichaeism',
    origin: 'Persia (3rd century CE)',
    route: 'Persia → Central Asia → China (suppressed by 843)',
    detail: 'Founded by the prophet Mani, who consciously designed a "world religion" combining elements of Christianity, Zoroastrianism, and Buddhism. Spread rapidly along trade routes — Augustine of Hippo was a Manichaean before converting to Christianity. Became the state religion of the Uyghur Khaganate (762). Suppressed in China by 843 and eventually died out globally, but influenced dualist heresies in medieval Europe (Cathars, Bogomils).',
    color: PURPLE,
    icon: '☯️',
  },
  {
    name: 'Zoroastrianism',
    origin: 'Persia (1500–500 BCE)',
    route: 'Persia → Central Asia → China (Tang Dynasty communities)',
    detail: 'The ancient Persian religion of fire temples and cosmic dualism. Zoroastrian merchants established communities across the Silk Road. Tang Dynasty Chang\'an had multiple Zoroastrian temples. Concepts of heaven/hell, angels/demons, and a final judgment influenced Judaism, Christianity, and Islam — making it one of the most consequential religions ever spread via trade routes.',
    color: SPICE,
    icon: '🔥',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Famous Travelers
// ─────────────────────────────────────────────────────────────────────────────

const TRAVELERS: Traveler[] = [
  {
    name: 'Zhang Qian',
    dates: '164–113 BCE',
    journey: "Sent by Emperor Wu of Han on a diplomatic mission to the Yuezhi people (139 BCE) to form an alliance against the Xiongnu. Captured and held prisoner for 10 years. Escaped, continued his mission, and returned after 13 years with detailed reports of Central Asian kingdoms, Ferghana horses, and grape cultivation. Made a second journey in 119 BCE.",
    documented: 'First reliable Chinese accounts of Central Asia — the Dayuan (Ferghana), Kangju, and Daxia (Bactria) kingdoms. His reports opened the Han court\'s eyes to the wider world and directly led to the establishment of Silk Road trade routes.',
    significance: 'The "Father of the Silk Road" — his missions didn\'t create trade (which predated him) but formalized the diplomatic and commercial connections that made the Silk Road a sustained, state-supported network.',
    color: JADE,
    icon: '🗺️',
  },
  {
    name: 'Xuanzang',
    dates: '602–664 CE',
    journey: 'Buddhist monk who defied an imperial travel ban to make a 17-year pilgrimage (629–645) to India. Crossed the Taklamakan Desert, the Pamir Mountains, and the Hindu Kush. Studied at Nalanda University — the world\'s first great university. Returned with 657 Buddhist texts on 20 horses.',
    documented: "\"Great Tang Records on the Western Regions\" — detailed accounts of 138 kingdoms across Central and South Asia. His descriptions of Bamiyan's giant Buddhas (destroyed by the Taliban in 2001) proved remarkably accurate. His translations of Sanskrit texts into Chinese shaped East Asian Buddhism.",
    significance: 'His journey inspired "Journey to the West" (1592), one of the Four Great Classical Novels of Chinese literature — the Monkey King (Sun Wukong) is his fictional companion. He demonstrated that the Silk Road was as much about ideas as goods.',
    color: AMBER,
    icon: '📿',
  },
  {
    name: 'Marco Polo',
    dates: '1254–1324 CE',
    journey: 'Venetian merchant who traveled overland to China (1271–1275) with his father and uncle. Claimed to have served Kublai Khan for 17 years. Returned by sea via Southeast Asia and India (1292–1295). Dictated his account while imprisoned in Genoa.',
    documented: '"The Travels of Marco Polo" — descriptions of Kublai Khan\'s court, paper money, coal burning, the Grand Canal, and the sheer scale of Chinese cities. Europeans found his accounts so incredible that the book was nicknamed "Il Milione" (The Million Lies).',
    significance: 'Whether or not he exaggerated (scholars debate this), his book ignited European curiosity about East Asia. Columbus carried a copy on his 1492 voyage. He proved that the Silk Road connected fundamentally different civilizations.',
    color: LAPIS,
    icon: '⚓',
  },
  {
    name: 'Ibn Battuta',
    dates: '1304–1368 CE',
    journey: 'Moroccan scholar who traveled ~75,000 miles over 29 years (1325–1354) — more than any other medieval traveler. Visited North Africa, the Middle East, East Africa, Central Asia, India (served as judge in Delhi for 8 years), Southeast Asia, and China. Traveled via both land and maritime Silk Road routes.',
    documented: '"The Rihla" (The Journey) — eyewitness accounts of the Black Death in Damascus, the Mali Empire under Mansa Musa, Delhi Sultanate politics, and Chinese maritime trade. His accounts of the Maldives, Swahili coast, and Southeast Asia are among the only surviving records.',
    significance: 'Demonstrated the vast Islamic trading network that paralleled and overlapped the Silk Road. His journey covered the maritime routes that would eventually replace the overland Silk Road.',
    color: TEAL,
    icon: '🌍',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Pax Mongolica Timeline
// ─────────────────────────────────────────────────────────────────────────────

const PAX_MONGOLICA_EVENTS = [
  { date: '1206', title: 'Genghis Khan unifies Mongolia', detail: 'Temüjin unites the nomadic Mongol tribes under one banner. His empire will become the largest contiguous land empire in history.' },
  { date: '1219–1221', title: 'Destruction of Khwarezmia', detail: 'Genghis Khan destroys the Khwarezmian Empire after the governor of Otrar killed Mongol trade envoys. Samarkand, Bukhara, and Merv are devastated — but paradoxically, the destruction clears obstacles to future unified trade.' },
  { date: '1235', title: 'Ögedei builds Karakorum', detail: 'The Mongol capital becomes a cosmopolitan trading hub — Franciscan friar William of Rubruck described finding Parisian goldsmiths, Chinese physicians, and Muslim merchants all in one city.' },
  { date: '1241', title: 'Mongols reach Europe', detail: 'Mongol armies defeat Polish and Hungarian forces. Europe is terrified but ultimately spared — the Great Khan dies and armies withdraw. The message is clear: the Mongols connect (and threaten) the entire Eurasian landmass.' },
  { date: '1260s', title: 'Yam postal system perfected', detail: 'The Mongol postal relay system spans the empire — relay stations (örtöö) every 25–30 miles, with fresh horses and riders. A message could cross the empire (6,000 miles) in weeks. Marco Polo marveled at it.' },
  { date: '1271–1295', title: 'Marco Polo traverses the empire', detail: 'The Polo family travels safely from Venice to Beijing and back. Their journey is possible only because a single political authority controls the entire route — the Pax Mongolica at its peak.' },
  { date: '1280s–1330s', title: 'Peak of Silk Road trade', detail: 'Trade volume reaches its all-time high. Merchants travel safely with a Mongol paiza (passport). Goods, technologies, and ideas flow freely: gunpowder, printing, and the compass accelerate their westward journey.' },
  { date: '1340s', title: 'Black Death spreads via trade routes', detail: 'The very connectedness that boosted trade also spreads plague. Yersinia pestis travels from Central Asian rodent populations along Silk Road routes to the Black Sea, then to Europe (1347).' },
  { date: '1368', title: 'Ming Dynasty expels Mongols from China', detail: 'The Yuan (Mongol) Dynasty falls. The Ming initially continue maritime trade (Zheng He voyages, 1405–1433) but eventually turn inward. The Pax Mongolica is over.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Decline Timeline
// ─────────────────────────────────────────────────────────────────────────────

const DECLINE_EVENTS = [
  { date: '1368', title: 'Fall of Yuan Dynasty', detail: 'Ming Dynasty replaces Mongol rule in China. The political fragmentation of Central Asia makes overland trade increasingly dangerous and expensive.' },
  { date: '1405–1433', title: "Zheng He's Maritime Expeditions", detail: "The Ming Dynasty's massive treasure fleets (300+ ships, 27,000 crew) explore Southeast Asia, India, Arabia, and East Africa. They demonstrate the superiority of maritime trade — but China abruptly ends the voyages and destroys the fleet records." },
  { date: '1453', title: 'Fall of Constantinople', detail: 'Ottoman conquest blocks the primary land route to Europe. European merchants face heavy tariffs and restricted access. This single event is the strongest catalyst for finding alternative sea routes.' },
  { date: '1488', title: 'Bartolomeu Dias rounds the Cape of Good Hope', detail: 'Portuguese explorers prove that Africa can be circumnavigated by sea, opening a direct maritime route to Asia that bypasses all Silk Road intermediaries.' },
  { date: '1492', title: "Columbus's Voyage", detail: "Seeking a western sea route to the Silk Road's eastern goods, Columbus accidentally discovers the Americas. He carries a copy of Marco Polo's book." },
  { date: '1498', title: "Vasco da Gama reaches India", detail: 'The first direct sea voyage from Europe to India. Maritime trade begins to dominate, offering lower costs, higher volumes, and no Central Asian middlemen. The overland Silk Road is economically doomed.' },
  { name: '1500s–1600s', title: 'Maritime trade dominance', detail: 'Portuguese, Dutch, and English establish colonial trading empires. The East India Companies formalize what the Silk Road did informally. Central Asian cities that thrived on overland trade decline into provincial backwaters.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Modern Belt and Road
// ─────────────────────────────────────────────────────────────────────────────

const BELT_AND_ROAD = [
  { label: 'Announced', value: '2013 (Xi Jinping, Kazakhstan speech)' },
  { label: 'Investment', value: '$1+ trillion pledged across 150+ countries' },
  { label: 'Infrastructure', value: 'Railways, ports, highways, pipelines, fiber optic cables' },
  { label: 'Land corridors', value: 'China–Central Asia–Europe rail (Yiwu to London in 18 days)' },
  { label: 'Maritime routes', value: 'Chinese-built ports from Gwadar (Pakistan) to Piraeus (Greece)' },
  { label: 'Controversy', value: 'Debt-trap diplomacy concerns, environmental impact, labor practices, strategic military implications' },
  { label: 'Scale comparison', value: 'Ancient Silk Road: ~4,000 miles, centuries to build organically. BRI: 60,000+ miles of planned infrastructure in decades.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────────────────────────────────────

const TABS: { id: SectionTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'origins', label: 'Origins' },
  { id: 'routes', label: 'Routes' },
  { id: 'trade', label: 'Trade Goods' },
  { id: 'cities', label: 'Key Cities' },
  { id: 'religions', label: 'Religions' },
  { id: 'travelers', label: 'Travelers' },
  { id: 'disease', label: 'Disease' },
  { id: 'mongols', label: 'Pax Mongolica' },
  { id: 'decline', label: 'Decline' },
  { id: 'legacy', label: 'Legacy' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>What Was the Silk Road?</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Not One Road, But a Network</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The "Silk Road" is a modern name — coined in 1877 by German geographer Ferdinand von Richthofen
            (<em>die Seidenstraße</em>). No ancient traveler ever called it that. In reality, it was a vast,
            shifting network of overland and maritime routes stretching over 4,000 miles from China to the
            Mediterranean, with branches reaching into India, Southeast Asia, and East Africa.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            No single merchant traveled the entire route. Goods passed through dozens of hands — Chinese
            silk might be traded to Sogdian merchants in Kashgar, then to Persian middlemen in Merv, then
            to Syrian traders in Antioch, before finally reaching a Roman senator's toga. Each intermediary
            added markup, which is why silk cost its weight in gold by the time it reached Rome.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Why "Silk"?</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            Silk was the iconic commodity because it was lightweight (crucial for overland transport),
            enormously valuable, and exclusively Chinese. For over 3,000 years, China guarded the secret
            of sericulture (silk production) — legend says the penalty for smuggling silkworm eggs was
            execution. Silk was so valuable that it served as currency along parts of the route, and Roman
            demand was so insatiable that Pliny the Elder complained it was draining the empire's gold reserves.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            But silk was just the most famous product. The Silk Road carried everything from horses and spices
            to religions and diseases. Its real legacy was not any single good but the unprecedented
            cross-pollination of civilizations that it enabled.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>By the Numbers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            {[
              { num: '~4,000 mi', label: 'Length of the main overland route' },
              { num: '~1,583 years', label: 'Active period (130 BCE – 1453 CE)' },
              { num: '50+', label: 'Major cities along the routes' },
              { num: '4', label: 'Major religions spread' },
              { num: '6+', label: 'Empires that controlled segments' },
              { num: '100s', label: 'Commodities traded' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(201,168,76,0.08)', borderRadius: 8 }}>
                <div style={{ color: GOLD, fontSize: '1.5rem', fontWeight: 700 }}>{stat.num}</div>
                <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function OriginsSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Origins: Zhang Qian Opens the West</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Mission That Started It All (139 BCE)</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            Emperor Wu of the Han Dynasty faced a relentless enemy: the Xiongnu, nomadic warriors who
            raided China's northern frontier. Learning that the Yuezhi people — driven west by the Xiongnu —
            harbored a grudge, Wu sent his courtier <strong style={{ color: TEXT }}>Zhang Qian</strong> on
            a desperate diplomatic mission: cross the unknown western lands and forge a military alliance.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            Zhang Qian set out in 139 BCE with a caravan of 100. He was captured by the Xiongnu almost
            immediately and held prisoner for <strong style={{ color: TEXT }}>10 years</strong>. He married
            a Xiongnu woman, had a son, but never abandoned his mission. He eventually escaped, crossed the
            Pamir Mountains, and reached the Yuezhi in modern Afghanistan — only to find them uninterested
            in war. He explored Bactria and Ferghana before returning to China in 126 BCE with just two
            of his original companions. He had been gone 13 years.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>What Zhang Qian Brought Back</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            His diplomatic mission failed, but his intelligence reports transformed Chinese understanding
            of the world. He described kingdoms the Chinese had never heard of — Ferghana with its
            magnificent horses, Bactria with its Greek-influenced culture, and tantalizingly, rumors of
            a great empire far to the west (Rome, which the Chinese called <em>Daqin</em>).
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            Emperor Wu was so impressed that he sent Zhang Qian on a second mission (119 BCE) with 300 men,
            10,000 cattle, and vast quantities of silk and gold for gifts. This second mission established
            formal diplomatic and trade relations with Central Asian kingdoms. The Silk Road was open.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Parthian Connection to Rome</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The Parthian Empire (250 BCE – 224 CE) controlled the critical middle section of the Silk Road
            — from eastern Iran to Mesopotamia. They served as profitable intermediaries, buying Chinese
            silk cheaply and selling it to Rome at enormous markup. The Parthians had every incentive to
            prevent direct contact between Rome and China.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            In 53 BCE, Parthia defeated Rome at the Battle of Carrhae — and Roman soldiers saw Parthian
            silk banners for the first time. Roman demand for silk exploded. The first recorded contact
            between Rome and China came in 166 CE when Roman merchants (possibly envoys of Marcus Aurelius)
            arrived at the Han court via the maritime route. But the Parthian middlemen ensured that direct
            overland contact remained rare.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function RoutesSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>The Routes: Land and Sea</h2>

      {/* Land Route */}
      <h3 style={{ color: SAND, fontSize: '1.3rem', marginBottom: '1rem' }}>🐫 Overland Silk Road</h3>
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        {LAND_ROUTE.map((wp, i) => (
          <div key={wp.name} style={{ display: 'flex', gap: '1rem', marginBottom: i < LAND_ROUTE.length - 1 ? '0' : '0' }}>
            {/* Vertical connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: GOLD, border: `2px solid ${SAND}`,
                flexShrink: 0, zIndex: 1,
              }} />
              {i < LAND_ROUTE.length - 1 && (
                <div style={{ width: 2, flexGrow: 1, background: `linear-gradient(to bottom, ${GOLD}, ${SAND})`, minHeight: 40 }} />
              )}
            </div>
            <div style={{
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10,
              padding: '1rem 1.25rem', marginBottom: '0.75rem', flex: 1,
            }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: '1rem' }}>{wp.name}</div>
              <div style={{ color: TEXT_DIM, fontSize: '0.9rem', marginTop: '0.25rem', lineHeight: 1.6 }}>{wp.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Maritime Route */}
      <h3 style={{ color: TEAL, fontSize: '1.3rem', marginBottom: '1rem' }}>⛵ Maritime Silk Road</h3>
      <div style={{ position: 'relative' }}>
        {MARITIME_ROUTE.map((wp, i) => (
          <div key={wp.name} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40 }}>
              <div style={{
                width: 16, height: 16, borderRadius: '50%', background: TEAL, border: `2px solid ${LAPIS}`,
                flexShrink: 0, zIndex: 1,
              }} />
              {i < MARITIME_ROUTE.length - 1 && (
                <div style={{ width: 2, flexGrow: 1, background: `linear-gradient(to bottom, ${TEAL}, ${LAPIS})`, minHeight: 40 }} />
              )}
            </div>
            <div style={{
              background: 'rgba(13,148,136,0.05)', border: '1px solid rgba(13,148,136,0.18)', borderRadius: 10,
              padding: '1rem 1.25rem', marginBottom: '0.75rem', flex: 1,
            }}>
              <div style={{ color: TEXT, fontWeight: 600, fontSize: '1rem' }}>{wp.name}</div>
              <div style={{ color: TEXT_DIM, fontSize: '0.9rem', marginTop: '0.25rem', lineHeight: 1.6 }}>{wp.role}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TradeSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const renderGoods = (goods: TradeGood[], title: string, color: string, direction: string) => (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ color, fontSize: '1.3rem', marginBottom: '1rem' }}>{direction} {title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {goods.map((good) => (
          <div
            key={good.name}
            onClick={() => setExpanded(expanded === good.name ? null : good.name)}
            style={{
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10,
              padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = CARD_BORDER.toString())}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{good.icon}</span>
              <span style={{ color: TEXT, fontWeight: 600 }}>{good.name}</span>
            </div>
            <AnimatePresence>
              {expanded === good.name && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.7, marginTop: '0.75rem', overflow: 'hidden' }}
                >
                  {good.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1.5rem' }}>What Was Actually Traded</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '2rem', lineHeight: 1.7 }}>
        Click any item to expand its story. The Silk Road moved far more than silk — it was a conduit for
        every valuable commodity, technology, and idea that civilizations had to offer.
      </p>
      {renderGoods(EAST_TO_WEST, 'East → West', SPICE, '→')}
      {renderGoods(WEST_TO_EAST, 'West → East', LAPIS, '←')}
      {renderGoods(BOTH_DIRECTIONS, 'Both Directions', PURPLE, '↔')}
    </motion.div>
  );
}

function CitiesSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Cities That Rose Because of the Silk Road</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        These cities owed their wealth, cosmopolitanism, and sometimes their destruction to their position on
        the Silk Road. Each was a crossroads where cultures mixed, goods changed hands, and history was made.
      </p>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {KEY_CITIES.map((city) => (
          <div
            key={city.name}
            onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
            style={{
              background: CARD_BG, border: `1px solid ${city.color}33`, borderRadius: 12,
              padding: '1.25rem', cursor: 'pointer', borderLeft: `4px solid ${city.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{city.icon}</span>
                <span style={{ color: TEXT, fontWeight: 700, fontSize: '1.15rem' }}>{city.name}</span>
                <span style={{ color: TEXT_DIM, fontSize: '0.9rem', marginLeft: '0.75rem' }}>{city.region}</span>
              </div>
              <span style={{ color: city.color, fontSize: '0.85rem', fontWeight: 600 }}>Peak: {city.peak}</span>
            </div>

            <AnimatePresence>
              {selectedCity === city.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '1rem' }}>
                    <strong style={{ color: TEXT }}>Role:</strong> {city.role}
                  </p>
                  <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
                    <strong style={{ color: TEXT }}>Fate:</strong> {city.fate}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ReligionsSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Religions Spread via the Silk Road</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The Silk Road was history's greatest conduit for religious transmission. Merchants were often the
        first missionaries — they carried their faiths along with their goods, establishing communities
        and houses of worship at every major stop along the route.
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {RELIGIONS.map((rel) => (
          <div
            key={rel.name}
            style={{
              background: CARD_BG, border: `1px solid ${rel.color}33`, borderRadius: 12,
              padding: '1.5rem', borderLeft: `4px solid ${rel.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{rel.icon}</span>
              <span style={{ color: TEXT, fontWeight: 700, fontSize: '1.15rem' }}>{rel.name}</span>
            </div>
            <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              <strong style={{ color: TEXT }}>Origin:</strong> {rel.origin}
            </div>
            <div style={{ color: TEXT_DIM, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <strong style={{ color: TEXT }}>Route:</strong> {rel.route}
            </div>
            <p style={{ color: TEXT_DIM, lineHeight: 1.7, fontSize: '0.95rem' }}>{rel.detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TravelersSection() {
  const [expandedTraveler, setExpandedTraveler] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Famous Travelers of the Silk Road</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {TRAVELERS.map((t) => (
          <div
            key={t.name}
            onClick={() => setExpandedTraveler(expandedTraveler === t.name ? null : t.name)}
            style={{
              background: CARD_BG, border: `1px solid ${t.color}33`, borderRadius: 12,
              padding: '1.5rem', cursor: 'pointer', borderLeft: `4px solid ${t.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{t.icon}</span>
                <span style={{ color: TEXT, fontWeight: 700, fontSize: '1.15rem' }}>{t.name}</span>
              </div>
              <span style={{ color: t.color, fontSize: '0.85rem', fontWeight: 600 }}>{t.dates}</span>
            </div>

            <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem', fontSize: '0.95rem' }}>{t.journey}</p>

            <AnimatePresence>
              {expandedTraveler === t.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
                    <strong style={{ color: TEXT }}>What They Documented:</strong> {t.documented}
                  </p>
                  <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
                    <strong style={{ color: TEXT }}>Significance:</strong> {t.significance}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DiseaseSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Disease and the Silk Road</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: CARD_BG, border: `1px solid ${CRIMSON}33`, borderRadius: 12, padding: '1.5rem', borderLeft: `4px solid ${CRIMSON}` }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Dark Side of Connectivity</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The same routes that carried silk and spices also carried pathogens. Caravanserais — the rest
            stops where travelers, animals, and goods mingled — were perfect incubators. Fleas on rats
            on camels on ships created an unbroken chain of transmission across continents. The Silk Road
            didn't just connect civilizations; it connected their disease pools.
          </p>
        </div>

        <div style={{ background: 'rgba(185,28,28,0.08)', border: `1px solid ${CRIMSON}33`, borderRadius: 12, padding: '1.5rem', borderLeft: `4px solid ${CRIMSON}` }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Black Death (1347–1353)</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            <em>Yersinia pestis</em> — the bacterium behind the Black Death — originated in the marmot
            populations of Central Asia, likely near Lake Issyk-Kul in modern Kyrgyzstan. DNA evidence
            from a cemetery there dates the outbreak to the late 1330s.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            The plague traveled west along Silk Road trade routes, reaching the Mongol siege of Caffa
            (Crimea) in 1346, where — according to chroniclers — the Mongols catapulted plague-ridden
            corpses over the city walls (one of the earliest alleged acts of biological warfare). Genoese
            ships fleeing Caffa carried the plague to Constantinople, then Sicily (October 1347), then
            across all of Europe within three years.
          </p>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginTop: '0.75rem' }}>
            <strong style={{ color: TEXT }}>The toll:</strong> 75–200 million dead across Eurasia.
            Europe lost 30–60% of its population. The Islamic world lost comparable numbers. China's
            population dropped from ~120 million to ~65 million between 1200 and 1400 (from plague
            combined with Mongol warfare).
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Earlier Pandemics</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The Black Death was the most devastating, but not the first Silk Road pandemic. The
            <strong style={{ color: TEXT }}> Antonine Plague</strong> (165–180 CE) — likely smallpox —
            was carried from Mesopotamia to Rome by returning soldiers, killing 5–10 million. The
            <strong style={{ color: TEXT }}> Plague of Justinian</strong> (541–549 CE) — bubonic plague —
            traveled via maritime trade routes from East Africa to Constantinople, killing an estimated
            25–50 million and weakening the Byzantine Empire at a critical moment.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MongolsSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>The Pax Mongolica (1206–1368)</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The Mongol Empire — at its peak, the largest contiguous land empire in history — created something
        unprecedented: a single political authority controlling virtually the entire Silk Road. For about
        a century, a merchant with a Mongol <em>paiza</em> (passport) could travel safely from Korea to
        Hungary. Trade volume increased tenfold. It was the Silk Road's golden age — and its last.
      </p>

      <div style={{ position: 'relative' }}>
        {PAX_MONGOLICA_EVENTS.map((event, i) => (
          <div key={event.date} style={{ display: 'flex', gap: '1rem', marginBottom: '0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 60 }}>
              <div style={{
                background: GOLD, color: BG, fontSize: '0.7rem', fontWeight: 700,
                padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap',
              }}>
                {event.date}
              </div>
              {i < PAX_MONGOLICA_EVENTS.length - 1 && (
                <div style={{ width: 2, flexGrow: 1, background: `${GOLD}44`, minHeight: 30 }} />
              )}
            </div>
            <div style={{
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10,
              padding: '1rem', marginBottom: '0.75rem', flex: 1,
            }}>
              <div style={{ color: TEXT, fontWeight: 600, marginBottom: '0.25rem' }}>{event.title}</div>
              <div style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.6 }}>{event.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DeclineSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Decline: From Land to Sea</h2>
      <p style={{ color: TEXT_DIM, marginBottom: '1.5rem', lineHeight: 1.7 }}>
        The overland Silk Road didn't die suddenly — it was gradually strangled by political fragmentation,
        rising costs, and the revolutionary discovery that maritime routes were faster, cheaper, and could
        carry vastly more cargo. The fall of Constantinople in 1453 was the symbolic end, but the economic
        logic had been shifting for over a century.
      </p>

      <div style={{ position: 'relative' }}>
        {DECLINE_EVENTS.map((event, i) => (
          <div key={event.date || (event as any).name} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 70 }}>
              <div style={{
                background: SPICE, color: TEXT, fontSize: '0.7rem', fontWeight: 700,
                padding: '4px 8px', borderRadius: 6, whiteSpace: 'nowrap',
              }}>
                {event.date || (event as any).name}
              </div>
              {i < DECLINE_EVENTS.length - 1 && (
                <div style={{ width: 2, flexGrow: 1, background: `${SPICE}44`, minHeight: 30 }} />
              )}
            </div>
            <div style={{
              background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 10,
              padding: '1rem', marginBottom: '0.75rem', flex: 1,
            }}>
              <div style={{ color: TEXT, fontWeight: 600, marginBottom: '0.25rem' }}>{event.title}</div>
              <div style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.6 }}>{event.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LegacySection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h2 style={{ color: GOLD, fontSize: '1.8rem', marginBottom: '1rem' }}>Legacy: The Template for Globalization</h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The First Globalization</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            The Silk Road was the world's first sustained system of long-distance exchange. Before the
            internet, before container ships, before railroads, camel caravans and dhows connected
            civilizations across 4,000 miles of desert, mountain, and ocean. Every modern concept of
            globalization — supply chains, cultural exchange, technology transfer, pandemic spread,
            trade imbalances — has a Silk Road precedent.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>Technology That Built the Modern World</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            Paper, gunpowder, the compass, and printing — China's "Four Great Inventions" — all traveled
            west via the Silk Road and transformed European civilization. Paper enabled bureaucracy and
            literacy. Gunpowder ended the age of castles and knights. The compass enabled oceanic
            navigation. Printing (both woodblock and movable type) democratized knowledge. Without the
            Silk Road, the European Renaissance, Scientific Revolution, and Age of Exploration would have
            been delayed by centuries — if they happened at all.
          </p>
        </div>

        <div style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 12, padding: '1.5rem' }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>UNESCO World Heritage</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7 }}>
            In 2014, UNESCO inscribed the "Silk Roads: the Routes Network of Chang'an–Tianshan Corridor"
            as a World Heritage Site — a joint nomination by China, Kazakhstan, and Kyrgyzstan covering
            33 sites across 5,000 km. It was the first transnational serial nomination of its kind,
            recognizing that the Silk Road's heritage belongs not to any one nation but to humanity.
          </p>
        </div>

        <div style={{ background: 'rgba(30,58,138,0.08)', border: `1px solid ${LAPIS}33`, borderRadius: 12, padding: '1.5rem', borderLeft: `4px solid ${LAPIS}` }}>
          <h3 style={{ color: TEXT, fontSize: '1.2rem', marginBottom: '0.75rem' }}>The Belt and Road Initiative: A 21st-Century Silk Road?</h3>
          <p style={{ color: TEXT_DIM, lineHeight: 1.7, marginBottom: '1rem' }}>
            In 2013, Chinese President Xi Jinping announced the Belt and Road Initiative (BRI) — explicitly
            invoking the Silk Road to frame the largest infrastructure investment program in history.
          </p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {BELT_AND_ROAD.map((item) => (
              <div key={item.label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ color: LAPIS, fontWeight: 700, fontSize: '0.85rem', minWidth: 140 }}>{item.label}:</span>
                <span style={{ color: TEXT_DIM, fontSize: '0.9rem', lineHeight: 1.5 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SilkRoadPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');

  const renderSection = () => {
    switch (activeTab) {
      case 'overview': return <OverviewSection />;
      case 'origins': return <OriginsSection />;
      case 'routes': return <RoutesSection />;
      case 'trade': return <TradeSection />;
      case 'cities': return <CitiesSection />;
      case 'religions': return <ReligionsSection />;
      case 'travelers': return <TravelersSection />;
      case 'disease': return <DiseaseSection />;
      case 'mongols': return <MongolsSection />;
      case 'decline': return <DeclineSection />;
      case 'legacy': return <LegacySection />;
      default: return <OverviewSection />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, color: TEXT, fontFamily: "'Inter', sans-serif" }}>
      {/* Back link */}
      <div style={{ padding: '1rem 2rem' }}>
        <Link to="/" style={{ color: GOLD, textDecoration: 'none', fontSize: '0.9rem' }}>
          ← Back to Chronicle
        </Link>
      </div>

      {/* Hero */}
      <header style={{
        textAlign: 'center', padding: '3rem 2rem 2rem',
        background: `linear-gradient(135deg, ${BG} 0%, rgba(201,168,76,0.08) 50%, rgba(30,58,138,0.06) 100%)`,
        borderBottom: `1px solid ${CARD_BORDER}`,
      }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 800, color: TEXT, lineHeight: 1.2, maxWidth: 900, margin: '0 auto' }}>
          The Silk Road
        </h1>
        <p style={{ color: GOLD, fontSize: 'clamp(1rem, 2vw, 1.3rem)', marginTop: '0.75rem', fontWeight: 500 }}>
          4,000 Miles of Trade, Ideas, and Disease (130 BCE – 1453 CE)
        </p>
        <p style={{ color: TEXT_DIM, fontSize: '0.95rem', marginTop: '1rem', maxWidth: 700, margin: '1rem auto 0', lineHeight: 1.6 }}>
          The ancient network of trade routes that connected East and West for over 1,500 years,
          reshaping civilizations, spreading religions, and transmitting both technologies and diseases
          across the largest landmass on Earth.
        </p>
      </header>

      {/* Tab Navigation */}
      <nav style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '1rem 2rem',
        borderBottom: `1px solid ${CARD_BORDER}`, background: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s',
              background: activeTab === tab.id ? GOLD : 'transparent',
              color: activeTab === tab.id ? BG : TEXT_DIM,
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
        <AnimatePresence mode="wait">
          <div key={activeTab}>
            {renderSection()}
          </div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: `1px solid ${CARD_BORDER}`, color: TEXT_MUTED, fontSize: '0.8rem' }}>
        Chronicle — Silk Road Deep Dive | All data curated from historical sources
      </footer>
    </div>
  );
}
