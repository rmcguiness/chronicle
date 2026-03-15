/**
 * IncaEmpirePage — comprehensive deep-dive on the Inca Empire (~1200–1572).
 *
 * Route: /inca-empire
 *
 * Sections:
 *  1. Hero — headline, key stats (25,000 mi roads, 12M subjects, 168 soldiers)
 *  2. Origins — Manco Cápac, Cuzco, Killke culture
 *  3. Rise of the Empire — Pachacuti, Tawantinsuyu, peak territory
 *  4. Geography & Scale — Ecuador to Chile, altitude extremes, 40+ ethnic groups
 *  5. Engineering Marvels — roads, Machu Picchu, terraces, aqueducts
 *  6. Society & Administration — Sapa Inca, suyus, mit'a, no money
 *  7. Quipu — knotted string record-keeping
 *  8. Religion & Cosmology — Inti, Viracocha, Inti Raymi, mummified ancestors
 *  9. Agriculture — potato, quinoa, maize, freeze-drying (chuño)
 * 10. Spanish Conquest — civil war, Pizarro, Cajamarca, ransom, smallpox
 * 11. Legacy — Quechua, potato, Machu Picchu, Andean culture
 * 12. Connection cards — links to related deep-dives
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const EARTH = '#92400e';
const TERRACOTTA = '#c2410c';
const JADE = '#059669';
const CRIMSON = '#dc2626';
const BLOOD_RED = '#991b1b';
const SUN_GOLD = '#eab308';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const AMBER = '#d97706';
const PURPLE = '#a855f7';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const SKY = '#0ea5e9';
const STONE = '#78716c';
const COPPER = '#b45309';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

// ── Origins ─────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Manco Cápac — The Founding Myth',
    detail:
      'According to Inca tradition, the sun god Inti sent his son Manco Cápac and his sister-wife Mama Ocllo from the depths of Lake Titicaca (or, in another version, from the cave of Tampu T\'oqo at Pacaritambo) with a golden staff. They were told to settle wherever the staff sank into the ground. After wandering the highlands, the staff plunged into the earth at a fertile valley — and there Manco Cápac founded Cuzco, "the navel of the world," around 1200 CE. Whether Manco Cápac was a real historical figure or purely mythological remains debated, but the founding narrative served a crucial purpose: it established the Inca ruling dynasty as children of the Sun, with a divine mandate to rule.',
  },
  {
    label: 'Cuzco — Navel of the World',
    detail:
      'Cuzco (Qosqo in Quechua, meaning "navel" or "center") was the sacred capital of the Inca Empire, sitting at 11,152 feet (3,399 meters) in the Andes. The city was laid out in the shape of a puma — the head formed by the fortress of Sacsayhuamán, the body by the city center, and the tail by the confluence of two rivers. Cuzco was the political, religious, and cultural heart of Tawantinsuyu. The four great roads of the empire radiated outward from the central plaza, Haukaypata, connecting the capital to every corner of the realm. At its peak, Cuzco held perhaps 100,000 people — a remarkable city at such altitude.',
  },
  {
    label: 'Killke Culture — Before the Empire',
    detail:
      'Before the Inca Empire existed, the Killke culture (900–1200 CE) inhabited the Cuzco region. Archaeological evidence shows they built the earliest structures at Sacsayhuamán and other sites later claimed by the Inca. The transition from Killke to Inca was gradual — the early Inca were essentially a small kingdom centered on Cuzco, one of many competing polities in the Andean highlands. For two centuries after the legendary founding, the Inca remained a relatively minor regional power, raiding neighbors and forming alliances. It was not until the 1430s — with the rise of Pachacuti — that the Inca transformed from a local kingdom into the largest empire in the Americas.',
  },
  {
    label: 'The Early Sapa Incas',
    detail:
      'Inca tradition lists a dynasty of rulers before the great expansion: Sinchi Roca, Lloque Yupanqui, Mayta Cápac, and others. Whether these are historical figures or legendary ancestors is uncertain — the Inca had no writing system, and their histories were preserved through oral tradition and quipu records. What is clear is that for roughly 200 years (c. 1200–1438), the Inca were a small but growing kingdom, absorbing neighboring groups through a combination of diplomacy, marriage alliances, and military conquest. They were one among many Andean states — Wari, Tiwanaku, Chimú — until a crisis and a visionary leader changed everything.',
  },
];

// ── Rise of the Empire ──────────────────────────────────────────────────────

const RISE_TIMELINE: TimelineEntry[] = [
  {
    year: '1438',
    title: 'Pachacuti — The Earth Shaker',
    description:
      'When the rival Chanka confederation attacked Cuzco, the reigning Sapa Inca Viracocha fled. His son Cusi Yupanqui rallied the defense and — according to legend — the very stones of the battlefield rose up as warriors to fight alongside him. After the stunning victory, he deposed his father and took the throne name Pachacuti ("He Who Remakes the World"). In a single generation, Pachacuti transformed the Inca from a regional kingdom into a continental empire. He rebuilt Cuzco in imperial style, established the administrative systems that held the empire together, and launched military campaigns that tripled Inca territory.',
    color: GOLD,
  },
  {
    year: '1438–1471',
    title: 'Tawantinsuyu — The Four Regions United',
    description:
      'Pachacuti and his son Túpac Inca Yupanqui created Tawantinsuyu ("The Four Regions Together"): Chinchaysuyu (north), Antisuyu (east), Collasuyu (south), and Cuntisuyu (west) — all radiating from Cuzco at the center. Each suyu was governed by an apu (governor) appointed by the Sapa Inca. Pachacuti conquered the Lake Titicaca basin, the Chimú Empire (the largest rival state), and pushed into modern Ecuador. His genius was not just military but administrative: he developed the mit\'a labor system, standardized Quechua as the imperial language, and built the road network that held this vast territory together.',
    color: JADE,
  },
  {
    year: '1471–1493',
    title: 'Túpac Inca Yupanqui — The Alexander of the Andes',
    description:
      'Pachacuti\'s son continued the expansion with stunning speed. Túpac Inca Yupanqui pushed the empire south into modern Chile and Argentina, north into Ecuador, and east into the Amazon fringes. He conquered the Chimú Empire — the last great rival — and absorbed its sophisticated metalworking and administrative traditions. By the end of his reign, the Inca Empire stretched 2,500 miles along the Andes, from modern Colombia to central Chile. He also reportedly launched a naval expedition into the Pacific on balsa wood rafts — though the historicity of this is debated.',
    color: BLUE,
  },
  {
    year: '1493–1527',
    title: 'Huayna Cápac — Peak and Fracture',
    description:
      'The empire reached its maximum extent under Huayna Cápac, who campaigned in modern Ecuador and Colombia, pushing the northern frontier to its limits. He established a second capital at Quito in Ecuador — a fateful decision that would split the empire. Around 1527, Huayna Cápac died of a mysterious epidemic disease — almost certainly smallpox, which had raced ahead of the Spanish from the Caribbean through trade networks. His death without a clear successor triggered a devastating civil war between his sons Huáscar (based in Cuzco) and Atahualpa (based in Quito).',
    color: CRIMSON,
  },
  {
    year: '1529–1532',
    title: 'Civil War — Huáscar vs. Atahualpa',
    description:
      'The civil war between Huáscar and Atahualpa tore the empire apart. Atahualpa\'s experienced northern armies ultimately defeated Huáscar\'s forces in a series of bloody battles. Huáscar was captured and his supporters massacred. Atahualpa was marching south to Cuzco to claim his throne when he learned that a small group of strange, bearded men on large animals had landed on the coast. He had just won an empire — but the empire was exhausted, its armies depleted, its people divided. The timing could not have been worse.',
    color: BLOOD_RED,
  },
];

// ── Geography & Scale ───────────────────────────────────────────────────────

const GEOGRAPHY_INSIGHTS: InsightEntry[] = [
  {
    label: '2,500 Miles of Empire',
    detail:
      'The Inca Empire stretched 2,500 miles (4,000 km) along the western spine of South America — roughly the distance from New York to Los Angeles. It encompassed modern Peru, Ecuador, Bolivia, and parts of Colombia, Chile, and Argentina. No other pre-Columbian empire came close to this scale. The territory included virtually every climate zone on Earth: coastal deserts, tropical rainforests, high-altitude grasslands (puna), and snow-capped peaks above 20,000 feet. Governing this diversity of terrain and peoples was the Inca\'s greatest achievement — and their administrative solutions remain studied by historians today.',
  },
  {
    label: '12 Million Subjects, 40+ Ethnic Groups',
    detail:
      'At its peak, Tawantinsuyu governed an estimated 12 million people belonging to more than 40 distinct ethnic groups, each with its own language, customs, and traditions. The Inca did not attempt to erase these identities — instead, they layered imperial institutions on top of existing local structures. Conquered leaders (curacas) were kept in power as long as they cooperated. Each ethnic group was required to wear distinctive clothing and hairstyles so they could be identified at a glance. Quechua was imposed as the language of administration, but local languages continued to be spoken.',
  },
  {
    label: 'Altitude Extremes — Sea Level to 14,000+ Feet',
    detail:
      'The Inca governed one of the most extreme vertical environments on Earth. Their territory ranged from Pacific coastal deserts at sea level to Andean peaks above 14,000 feet (4,300 meters), with some settlements above 16,000 feet. This verticality was not a problem to be overcome but a resource to be exploited: different altitude zones produced different crops, and the Inca developed a system of "vertical archipelagos" where communities maintained fields at multiple elevations to access potatoes at high altitude, maize in valleys, coca and peppers in lowlands, and fish on the coast.',
  },
  {
    label: 'The Andes — Nature\'s Fortress',
    detail:
      'The Andes are the longest continental mountain range in the world (4,350 miles) and among the highest. The Inca built their empire in this extreme terrain — not despite the mountains but because of them. The high valleys were defensible, the altitude zones provided agricultural diversity, and the mountain passes created natural chokepoints that could be controlled. The Inca engineered solutions for every challenge: suspension bridges across gorges, staircases carved into cliff faces, terraces cut into near-vertical slopes, and roads that climbed from sea level to over 16,000 feet.',
  },
];

// ── Engineering Marvels ─────────────────────────────────────────────────────

const ENGINEERING_INSIGHTS: InsightEntry[] = [
  {
    label: '25,000 Miles of Roads — More Than Rome',
    detail:
      'The Inca road system (Qhapaq Ñan) was the most extensive in the pre-Columbian Americas and one of the greatest engineering achievements in human history. Over 25,000 miles of roads connected every corner of the empire — from sea-level deserts to passes above 16,000 feet. For comparison, the Roman Empire at its peak had roughly 50,000 miles of roads but covered far less difficult terrain. Inca roads included paved highways up to 24 feet wide in flat areas, stone staircases carved into mountain faces, causeways across swamps, and tunnels through rock. Way stations (tambos) were spaced every 12–18 miles, providing food, shelter, and fresh relay runners (chasquis) who could carry messages across the empire at speeds of 150 miles per day.',
  },
  {
    label: 'Suspension Bridges — Engineering Genius',
    detail:
      'The Inca built hundreds of suspension bridges across the deep gorges of the Andes, using braided grass ropes (ichu) as thick as a human body. The most famous, the Q\'eswachaka bridge over the Apurímac River, spanned over 100 feet above a raging canyon — and was rebuilt every year in a communal ceremony that continues to this day (UNESCO Intangible Cultural Heritage). These bridges were critical infrastructure: their destruction during wartime could halt an entire army. When Manco Inca rebelled against the Spanish in 1536, one of his first acts was to destroy the bridges, nearly trapping the conquistadors.',
  },
  {
    label: 'Machu Picchu — Precision Without Mortar (1450 CE)',
    detail:
      'Machu Picchu, built around 1450 CE as a royal estate for Pachacuti, is the most famous example of Inca stone masonry. The site sits at 7,970 feet on a narrow ridge between two peaks, with 1,500-foot drops on both sides. Its granite blocks were cut with such precision that no mortar was needed — the stones fit so tightly that a knife blade cannot be inserted between them. The site includes over 150 buildings, agricultural terraces, a sophisticated water system with 16 fountains fed by a natural spring, and astronomical observation points aligned with solstices. Abandoned before the Spanish conquest, it remained unknown to outsiders until Hiram Bingham\'s expedition in 1911.',
  },
  {
    label: 'Terrace Agriculture (Andenes)',
    detail:
      'The Inca transformed the steep, seemingly uncultivable Andes into productive farmland through a massive system of agricultural terraces (andenes — the word from which "Andes" may derive). Thousands of terraces were carved into mountainsides across the empire, creating flat growing surfaces with stone retaining walls, gravel drainage layers, and imported soil from fertile valleys. The terraces served multiple purposes: they prevented erosion, created microclimates (lower terraces were warmer), and dramatically expanded arable land. At Moray, the Inca built circular concentric terraces that functioned as an agricultural laboratory — different temperature zones on each level allowed them to experiment with crop varieties.',
  },
  {
    label: 'Water Engineering at Altitude',
    detail:
      'The Inca were master hydraulic engineers. They built aqueducts that carried water for miles across mountains, canals that irrigated terraces at extreme altitudes, and fountains that distributed water with remarkable precision. At Tipón, near Cuzco, a system of channels, terraces, and fountains demonstrates engineering so precise that water still flows through 600-year-old channels today. At Tambomachay, sacred springs were channeled through stone walls in a "bath of the Inca." The Inca understood hydraulic principles — pressure, gradient, flow rates — and applied them at altitudes where European engineers would have struggled.',
  },
];

// ── Society & Administration ────────────────────────────────────────────────

const SOCIETY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sapa Inca — Son of the Sun',
    detail:
      'The Sapa Inca ("Sole Ruler") was the absolute monarch of Tawantinsuyu and considered the living son of Inti, the sun god. He wore garments of the finest vicuña wool — so fine it was reserved exclusively for him — and never wore the same outfit twice. He ate from gold and silver dishes, traveled on a gold-covered litter carried by specially trained bearers, and communicated through noble intermediaries. His primary wife (coya) was his full sister — maintaining the purity of the solar bloodline. Upon death, the Sapa Inca was mummified and his household, lands, and servants continued to serve his preserved body as if he were still alive.',
  },
  {
    label: 'Four Suyus, Four Governors',
    detail:
      'The empire was divided into four suyus (quarters): Chinchaysuyu (northwest, richest), Antisuyu (northeast, jungle frontier), Collasuyu (southeast, including Bolivia and Chile), and Cuntisuyu (southwest, smallest). Each was governed by an apu — a high-ranking noble appointed by the Sapa Inca. Below the apus, a hierarchical bureaucracy administered provinces, districts, and communities. Officials at each level were responsible for groups of 10, 50, 100, 500, 1,000, 5,000, and 10,000 households. This decimal administration system allowed the central government to manage 12 million people with remarkable efficiency — all without writing.',
  },
  {
    label: 'Mit\'a — Work Instead of Taxes',
    detail:
      'The Inca had no money, no markets, and no written currency. Instead, the economy ran on mit\'a — a labor tax. Every household owed a set amount of labor to the state each year: farming state lands, building roads, serving in the military, mining, or weaving textiles. In return, the state guaranteed food, clothing, and chicha (corn beer) from vast storehouses. The system was reciprocal in theory: you worked for the Inca, and the Inca provided for you. In practice, the demands could be crushing — entire communities were relocated (mitmaq) to serve state needs. The Spanish would later co-opt the mit\'a system for their silver mines at Potosí, with devastating consequences.',
  },
  {
    label: 'No Money Economy',
    detail:
      'Unlike the Aztecs (who used cacao beans as currency) or European civilizations, the Inca operated one of history\'s largest economies without money, markets, or trade in the conventional sense. The state controlled production and distribution: farmers worked state lands, herders tended state llama herds, and weavers produced state textiles. Surplus was stored in thousands of qollqas (storehouses) along the road system, available for redistribution during famines, festivals, or military campaigns. Reciprocity and redistribution replaced buying and selling. Some scholars argue this was an early form of command economy; others see it as a sophisticated extension of traditional Andean reciprocity networks.',
  },
];

// ── Quipu ───────────────────────────────────────────────────────────────────

const QUIPU_INSIGHTS: InsightEntry[] = [
  {
    label: 'Knots as Information',
    detail:
      'Quipus (khipu in Quechua, meaning "knot") were recording devices made of cotton or camelid fiber strings with knots tied at intervals. The position, type, and color of knots encoded numerical information using a base-10 system: single knots represented tens, hundreds, or thousands depending on position; long knots and figure-eight knots represented units. Quipus could record census data, tribute obligations, calendar information, and inventories with the same precision as written numbers. Some quipus contain hundreds of pendant strings, each with multiple knots — complex records that only trained specialists could create or interpret.',
  },
  {
    label: 'Quipucamayocs — The Knot Keepers',
    detail:
      'Quipucamayocs ("knot keepers") were specialized officials trained from youth in the creation and interpretation of quipus. They served as the empire\'s accountants, census-takers, and record-keepers. Every province had quipucamayocs who tracked population, harvests, labor obligations, and storehouse contents. Their records were sent to Cuzco, where master quipucamayocs compiled empire-wide data. The position was hereditary and highly respected. When the Spanish arrived, they initially recognized quipus as legitimate records — some were even used as evidence in colonial courts.',
  },
  {
    label: 'Beyond Numbers?',
    detail:
      'The great mystery of quipus is whether they recorded only numerical data or also encoded narrative information — essentially, whether they constituted a writing system. Spanish chroniclers reported that quipucamayocs could "read" histories, poems, and laws from quipus. Modern researchers have identified patterns in knot color, spin direction, and attachment method that go beyond simple counting. In 2017, researcher Manny Medrano and professor Gary Urton identified a quipu that appeared to encode a narrative census matching a Spanish colonial document. Of the roughly 900 surviving quipus, most remain undeciphered — one of the great unsolved puzzles of human communication.',
  },
  {
    label: 'An Empire Without Writing?',
    detail:
      'The Inca are the only known civilization to administer an empire of millions without a conventional writing system. This is extraordinary: every other complex society of comparable scale — China, Rome, the Aztecs, the Maya — developed some form of writing. The Inca achieved the same administrative feats — tax collection, census, law, military logistics — through quipus, oral tradition, and an astonishing institutional memory. Some scholars argue that quipus were a writing system, just not one we recognize yet. Others suggest the Inca demonstrate that writing, while useful, is not the only path to civilization.',
  },
];

// ── Religion & Cosmology ────────────────────────────────────────────────────

const RELIGION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Inti — The Sun God',
    detail:
      'Inti, the sun god, was the supreme deity of the Inca state religion and the divine ancestor of the Sapa Inca. The sun was not just a god but the source of all life — warmth, light, and agricultural fertility depended on Inti\'s daily journey across the sky. The Coricancha ("Golden Enclosure") in Cuzco was Inti\'s greatest temple: its walls were lined with 700 sheets of gold, each weighing about 4.5 pounds, and a massive gold sun disc reflected light throughout the interior. When the Spanish captured Cuzco, the Coricancha\'s gold was among the first treasures melted down — an incalculable loss of Inca artistry.',
  },
  {
    label: 'Viracocha — The Creator',
    detail:
      'Viracocha (or Wiraqocha) was the creator god — the supreme being who made the sun, moon, stars, and all living things. According to myth, Viracocha rose from Lake Titicaca and created humanity from stone, breathed life into them, and taught them civilization. He then walked across the land, performing miracles, before walking across the Pacific Ocean and disappearing to the west — promising to return. This "departing creator who promised to return from the west" narrative has parallels with the Aztec Quetzalcoatl legend, and similarly may have influenced indigenous responses to the arrival of Europeans from the sea.',
  },
  {
    label: 'Inti Raymi — Festival of the Sun',
    detail:
      'Inti Raymi was the most important festival in the Inca calendar — a nine-day celebration of the winter solstice (June in the Southern Hemisphere) honoring Inti. Thousands gathered in Cuzco\'s central plaza for ceremonies led by the Sapa Inca himself. Llamas were sacrificed, chicha beer flowed freely, and elaborate dances and processions celebrated the sun\'s return to strength. The festival was banned by the Spanish in 1572 but was revived in 1944 based on chronicles by Inca Garcilaso de la Vega. Today, Inti Raymi is celebrated every June 24 in Cuzco, drawing thousands of visitors — one of South America\'s largest festivals.',
  },
  {
    label: 'Mummified Ancestors as Advisors',
    detail:
      'The Inca practiced elaborate ancestor worship centered on royal mummies. When a Sapa Inca died, his body was mummified and maintained by his descendants (panaca) as if still alive. The mummies were brought out for festivals, "consulted" on important decisions through intermediary priests, offered food and drink, and even visited each other\'s palaces. Each dead ruler retained ownership of his lands and servants — meaning each new Sapa Inca had to conquer new territory to build his own wealth. This practice drove imperial expansion but also concentrated vast resources in the hands of the dead, creating economic strain.',
  },
  {
    label: 'Huacas — The Sacred Landscape',
    detail:
      'The Inca saw the landscape itself as sacred. Huacas — holy places — included mountains, springs, caves, unusual rock formations, and ancient ruins. Cuzco was the center of the ceque system: 41 imaginary lines radiating outward from the Coricancha temple, along which 328 huacas were arranged. Each huaca had designated caretakers, specific offerings, and a place in the ritual calendar. Mountains (apus) were particularly powerful — many Inca sacrifices, including child sacrifices (capacocha), were performed on high mountain peaks. The frozen, mummified remains of these sacrifices, preserved at extreme altitude, are among the most remarkable archaeological finds in the Americas.',
  },
];

// ── Agriculture ─────────────────────────────────────────────────────────────

interface FoodItem {
  emoji: string;
  name: string;
  quechua: string;
  impact: string;
  color: string;
}

const FOODS_THAT_CHANGED_THE_WORLD: FoodItem[] = [
  { emoji: '\ud83e\udd54', name: 'Potato', quechua: 'papa', impact: 'Fed hundreds of millions; ended European famines', color: EARTH },
  { emoji: '\ud83c\udf3e', name: 'Quinoa', quechua: 'kinwa', impact: '$8B+ global market; "superfood" of the 21st century', color: GOLD },
  { emoji: '\ud83c\udf3d', name: 'Maize', quechua: 'sara', impact: 'Most produced crop on Earth (shared with Mesoamerica)', color: AMBER },
  { emoji: '\u2744\ufe0f', name: 'Chuño (Freeze-dried potato)', quechua: "ch'uñu", impact: 'First freeze-dried food — 1,000 years before NASA', color: SKY },
  { emoji: '\ud83e\udd99', name: 'Llama & Alpaca', quechua: 'llama / allpaqa', impact: 'Only large domesticated animals in the Americas', color: STONE },
  { emoji: '\ud83c\udf3f', name: 'Coca', quechua: 'kuka', impact: 'Sacred plant; altitude medicine; still central to Andean life', color: JADE },
];

const AGRICULTURE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Potato — Hundreds of Varieties',
    detail:
      'The Inca and their Andean predecessors domesticated the potato at least 7,000 years ago. By the time of the empire, Andean farmers cultivated hundreds of potato varieties — modern estimates suggest 3,000+ varieties existed in the Andes, adapted to every altitude and climate. Potatoes were the staple crop that made high-altitude civilization possible: they grow at elevations where maize and wheat cannot survive. When the Spanish brought potatoes to Europe around 1570, the tuber initially met resistance — but eventually transformed European agriculture. By the 18th century, the potato was feeding hundreds of millions and enabling population booms from Ireland to Russia. One Andean crop changed the demographic history of the world.',
  },
  {
    label: 'Chuño — Freeze-Drying Invented at Altitude',
    detail:
      'The Inca invented freeze-drying over 1,000 years before the modern process. Chuño was made by exposing potatoes to the freezing nighttime temperatures of the high Andes (often below -5°C), then trampling them to squeeze out moisture, and repeating the freeze-thaw cycle over several days. The result was a lightweight, shelf-stable food that could last years — sometimes decades — without spoiling. Chuño was stored in vast quantities in state storehouses, providing food security against droughts and famines. It was also critical for military campaigns: armies could carry lightweight chuño rather than heavy fresh food. The technique is still practiced in the Andes today.',
  },
  {
    label: 'Vertical Agriculture — Exploiting Altitude',
    detail:
      'The Inca developed a sophisticated system of vertical agriculture that exploited the Andes\' extreme altitude range. Different crops were grown at different elevations: potatoes and quinoa at high altitudes (above 12,000 feet), maize and beans in mid-altitude valleys, coca, peppers, and tropical fruits in the lowlands. Communities maintained fields at multiple elevations — sometimes days apart — to ensure dietary diversity. The state organized large-scale exchanges between zones: highland communities traded potatoes and llama wool for lowland coca, peppers, and dried fish. This "vertical archipelago" model, described by anthropologist John Murra, was the economic foundation of Andean civilization.',
  },
  {
    label: 'State Storehouses — Food Security at Scale',
    detail:
      'The Inca maintained thousands of qollqas (storehouses) across the empire, filled with chuño, dried meat (charki — the origin of the word "jerky"), maize, quinoa, textiles, weapons, and sandals. Spanish chroniclers described storehouses along the royal roads holding enough supplies to feed an army of 25,000 for several months. The storage system served multiple purposes: disaster relief during droughts or earthquakes, provisions for state labor projects, supplies for military campaigns, and food for festivals. When the Spanish arrived, they were astonished by the scale and organization — and promptly emptied the storehouses to feed their own campaigns.',
  },
];

// ── Spanish Conquest ────────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  {
    year: '1527–1532',
    title: 'Smallpox and Civil War',
    description:
      'Before any Spaniard set foot in the Inca Empire, European diseases had already arrived. Smallpox — spreading south from Spanish settlements in Central America through trade networks — killed Sapa Inca Huayna Cápac around 1527, along with his designated heir. The resulting succession crisis erupted into a devastating civil war between his sons Huáscar (based in Cuzco, the traditionalist candidate) and Atahualpa (based in Quito, commanding the experienced northern armies). By 1532, Atahualpa had won — but at catastrophic cost. The empire was exhausted, its armies depleted, and its population already devastated by epidemic disease that would ultimately kill 50–90% of the indigenous population.',
    color: BLOOD_RED,
  },
  {
    year: '1532',
    title: 'Pizarro Arrives — 168 Men Against an Empire',
    description:
      'Francisco Pizarro landed on the coast of Peru with just 168 soldiers and 27 horses. He was 54 years old, illiterate, the illegitimate son of a minor Spanish nobleman. He had spent years exploring the Pacific coast and knew that a rich empire lay inland. His force was absurdly small — but he had steel armor, crossbows, harquebuses (early muskets), horses (never seen in the Americas), and a crucial advantage: knowledge of how Cortés had conquered the Aztecs just a decade earlier by capturing the ruler. Pizarro intended to do exactly the same thing.',
    color: CRIMSON,
  },
  {
    year: 'Nov 16, 1532',
    title: 'Battle of Cajamarca — One Hour That Changed History',
    description:
      'Atahualpa, fresh from his civil war victory, agreed to meet Pizarro at Cajamarca with an entourage of thousands — mostly unarmed attendants, not soldiers, as a show of power and confidence. Pizarro sprang a trap: hidden Spanish soldiers with guns and horses charged into the packed plaza. The noise, the gunfire, the horses — the Inca had never seen any of it. In approximately one hour, between 2,000 and 8,000 Inca were killed while the Spanish suffered virtually no casualties. Atahualpa himself was pulled from his litter and captured. In a single afternoon, the head of an empire of 12 million was a prisoner of 168 foreigners.',
    color: TERRACOTTA,
  },
  {
    year: '1532–1533',
    title: 'The Ransom Room — Largest Ransom in History',
    description:
      'Atahualpa, understanding that the Spanish wanted gold, offered an extraordinary ransom: he would fill a room 22 feet long, 17 feet wide, and 8 feet high with gold objects — and fill it twice over with silver. This remains the largest ransom in human history, estimated at roughly $1.5 billion in modern value. Over several months, gold and silver poured in from across the empire: temple ornaments, jewelry, statues, decorative panels. The Spanish melted every piece into bars — destroying thousands of irreplaceable Inca artworks. Then Pizarro executed Atahualpa anyway, on July 26, 1533, on fabricated charges of treason. The ransom was paid; the promise was broken.',
    color: GOLD,
  },
  {
    year: '1533–1536',
    title: 'Puppet Rulers and Resistance',
    description:
      'After Atahualpa\'s execution, Pizarro installed a series of puppet Sapa Incas — first Túpac Huallpa, who died within months (likely of smallpox), then Manco Inca, Huáscar\'s brother. Initially cooperative, Manco Inca soon realized the Spanish intended permanent occupation, not just plunder. Humiliated and abused by the conquistadors, he escaped Spanish custody in 1536 and raised an army of over 100,000 warriors.',
    color: JADE,
  },
  {
    year: '1536–1537',
    title: 'Manco Inca\'s Rebellion — Nearly Driving Spain Out',
    description:
      'Manco Inca\'s rebellion of 1536 came agonizingly close to success. His forces besieged Cuzco for months, using captured Spanish weapons and setting fire to the city\'s thatched roofs with heated sling stones. He destroyed bridges to isolate the Spanish and sent an army to attack Lima. At the fortress of Sacsayhuamán, a ferocious battle raged for days. But the Spanish had advantages that ultimately proved decisive: steel weapons, horses on open ground, and crucially, indigenous allies — groups who had chafed under Inca rule and saw the Spanish as liberators. The rebellion failed, and Manco Inca retreated to the remote jungle fortress of Vilcabamba.',
    color: BLUE,
  },
  {
    year: '1572',
    title: 'Túpac Amaru — The Last Inca',
    description:
      'For 36 years after Manco Inca\'s retreat, a rump Inca state survived at Vilcabamba in the remote eastern Andes. In 1572, Spanish Viceroy Francisco de Toledo sent an expedition to destroy it once and for all. Túpac Amaru, the last Sapa Inca, was captured after a chase through the jungle. He was brought to Cuzco and publicly beheaded in the main plaza before a crowd of thousands of weeping indigenous people. His execution marked the end of Inca sovereignty — though his name would be invoked two centuries later by Túpac Amaru II in the great indigenous rebellion of 1780, and again by the American rapper Tupac Shakur, named after the revolutionary.',
    color: PURPLE,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Quechua — A Living Language',
    detail:
      'Quechua, the language the Inca spread across their empire as a lingua franca, is still spoken by 8–10 million people across Peru, Bolivia, Ecuador, Colombia, and Argentina. It is an official language in Peru and Bolivia. Quechua words have entered English and other global languages: "condor," "puma," "llama," "quinoa," "jerky" (from charki), and "quinine." The language is a living thread connecting modern Andean communities to their Inca heritage — though it faces pressure from Spanish and urbanization, and many dialects are endangered.',
  },
  {
    label: 'The Potato Changed the World',
    detail:
      'The potato — domesticated in the Andes thousands of years before the Inca — is arguably the single most important food crop the Americas gave to the world. Introduced to Europe around 1570, it took two centuries to gain acceptance, but then transformed European agriculture. The potato produced more calories per acre than any European grain, grew in poor soils and cold climates, and could be hidden from marauding armies (unlike grain fields). It fueled the population boom that enabled the Industrial Revolution, fed armies from Frederick the Great to Napoleon, and — when it failed in Ireland in the 1840s — caused the most devastating famine in European history.',
  },
  {
    label: 'Machu Picchu — From Lost City to World Wonder',
    detail:
      'Machu Picchu was "rediscovered" by American historian Hiram Bingham in 1911 (local farmers knew it was there all along). It became a UNESCO World Heritage Site in 1983 and was voted one of the New Seven Wonders of the World in 2007. Today it receives over 1 million visitors per year — so many that Peru has had to limit daily entry to prevent damage. The site\'s combination of extraordinary engineering, dramatic setting, and mysterious abandonment has made it the most iconic symbol of Inca civilization and one of the most recognizable archaeological sites on Earth.',
  },
  {
    label: 'Andean Culture Persists',
    detail:
      'Despite five centuries of colonialism, Andean culture remains vibrant in Peru, Bolivia, and Ecuador. Traditional textile weaving using Inca-era techniques continues in highland communities. The Q\'eswachaka bridge is rebuilt annually using the same Inca grass-rope methods. Inti Raymi is celebrated every June in Cuzco. Andean music, cuisine, and spiritual practices — including offerings to Pachamama (Mother Earth) and the apus (mountain spirits) — remain central to daily life. The 2009 Bolivian constitution explicitly recognized Andean cosmological concepts in its legal framework. The Inca Empire fell, but Andean civilization endures.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Pachacuti',
    years: 'r. 1438–1471',
    contribution:
      'The "Earth Shaker" who transformed the Inca from a regional kingdom into a continental empire. Rebuilt Cuzco, created the administrative system, launched the road network, and built Machu Picchu. Often called the Alexander the Great or Napoleon of the Americas.',
  },
  {
    name: 'Túpac Inca Yupanqui',
    years: 'r. 1471–1493',
    contribution:
      'Pachacuti\'s son, who extended the empire to its greatest territorial extent — 2,500 miles from Ecuador to Chile. Conquered the Chimú Empire and may have launched Pacific naval expeditions.',
  },
  {
    name: 'Huayna Cápac',
    years: 'r. 1493–1527',
    contribution:
      'Last undisputed Sapa Inca. Pushed the empire to its northern limits but died of epidemic disease (likely smallpox), triggering the civil war that fatally weakened the empire before Spanish contact.',
  },
  {
    name: 'Atahualpa',
    years: '1502–1533',
    contribution:
      'Won the civil war against his brother Huáscar, only to be captured by Pizarro at Cajamarca. Paid the largest ransom in human history — then was executed anyway. Last ruling Sapa Inca.',
  },
  {
    name: 'Francisco Pizarro',
    years: '1478–1541',
    contribution:
      'Illiterate conquistador who conquered the Inca Empire with 168 men. Captured Atahualpa, took the ransom, executed him, and installed puppet rulers. Assassinated by rivals in Lima in 1541.',
  },
  {
    name: 'Manco Inca',
    years: '1516–1544',
    contribution:
      'Initially a Spanish puppet ruler, he escaped and led the great rebellion of 1536 that nearly drove the Spanish from Peru. Retreated to the jungle fortress of Vilcabamba, where he maintained a rump Inca state.',
  },
  {
    name: 'Túpac Amaru',
    years: '1545–1572',
    contribution:
      'The last Sapa Inca. Captured at Vilcabamba and publicly beheaded in Cuzco in 1572, ending Inca sovereignty. His name became a symbol of indigenous resistance for centuries.',
  },
  {
    name: 'Garcilaso de la Vega',
    years: '1539–1616',
    contribution:
      'Son of a Spanish conquistador and an Inca noblewoman. His "Royal Commentaries of the Incas" (1609) is one of the most important historical sources on the Inca Empire, blending European and Andean perspectives.',
  },
];

// ── Connections ─────────────────────────────────────────────────────────────

interface ConnectionCard {
  title: string;
  path: string;
  description: string;
  color: string;
}

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'The Aztec Empire',
    path: '/aztec-empire',
    description:
      'The other great pre-Columbian empire — built on a lake in Mexico, conquered by Cortés just a decade before Pizarro reached Peru. Compare two civilizations, two conquests.',
    color: TERRACOTTA,
  },
  {
    title: 'The Age of Exploration',
    path: '/age-of-exploration',
    description:
      'How European exploration, disease, and conquest reshaped the Americas — the broader context of the Inca Empire\'s destruction.',
    color: BLUE,
  },
  {
    title: 'Ancient India',
    path: '/ancient-india',
    description:
      'Another civilization of extraordinary engineering and administration across extreme terrain — compare the Inca road system with Mauryan India\'s infrastructure.',
    color: AMBER,
  },
  {
    title: 'The Mongol Empire',
    path: '/mongol-empire',
    description:
      'History\'s largest contiguous land empire — compare the Inca\'s administrative genius with Mongol techniques for governing vast, diverse populations.',
    color: JADE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hero stats
// ─────────────────────────────────────────────────────────────────────────────

interface StatEntry {
  value: string;
  label: string;
  color: string;
}

const HERO_STATS: StatEntry[] = [
  { value: '25,000 mi', label: 'of roads (more than Rome at its peak)', color: JADE },
  { value: '12 million', label: 'subjects across 40+ ethnic groups', color: GOLD },
  { value: '168', label: 'soldiers conquered it (Pizarro at Cajamarca)', color: CRIMSON },
  { value: '$1.5 billion', label: 'modern value of Atahualpa\'s ransom', color: SUN_GOLD },
  { value: '8–10 million', label: 'Quechua speakers today', color: TEAL },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({
  id,
  icon,
  title,
  accentColor,
  intro,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  accentColor: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        padding: '48px 0',
        borderTop: `1px solid ${accentColor}33`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 12,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.7,
            maxWidth: 800,
            marginBottom: 28,
          }}
        >
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: e.color,
              marginRight: 8,
              verticalAlign: 'middle',
            }}
          />
          <p
            style={{
              display: 'inline',
              color: e.color,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </p>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: 8,
              fontSize: '1rem',
            }}
          >
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function StatsBar({ stats }: { stats: StatEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 14,
        marginTop: 28,
        marginBottom: 8,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: `1px solid ${s.color}44`,
            borderRadius: 10,
            padding: '14px 16px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: s.color, fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
            {s.value}
          </p>
          <p style={{ color: SLATE, fontSize: '0.78rem', lineHeight: 1.4 }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function FoodsCallout({ foods }: { foods: FoodItem[] }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 24,
        marginTop: 8,
      }}
    >
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: GOLD,
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        Foods That Changed the World
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {foods.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${f.color}33`,
              borderRadius: 10,
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.8rem', marginBottom: 6 }}>{f.emoji}</p>
            <p style={{ color: f.color, fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>
              {f.name}
            </p>
            <p style={{ color: SLATE, fontSize: '0.75rem', fontStyle: 'italic', marginBottom: 6 }}>
              Quechua: {f.quechua}
            </p>
            <p style={{ color: ASH, fontSize: '0.8rem', lineHeight: 1.4 }}>
              {f.impact}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Conquest in Numbers callout ─────────────────────────────────────────────

interface ConquestStat {
  value: string;
  label: string;
  color: string;
}

const CONQUEST_NUMBERS: ConquestStat[] = [
  { value: '168', label: 'Spanish soldiers at Cajamarca', color: CRIMSON },
  { value: '27', label: 'horses (never before seen in the Americas)', color: TERRACOTTA },
  { value: '2,000–8,000', label: 'Inca killed in ~1 hour', color: BLOOD_RED },
  { value: '0', label: 'Spanish killed at Cajamarca', color: ROSE },
  { value: '22 × 17 × 8 ft', label: 'room filled with gold (the ransom)', color: GOLD },
  { value: '~$1.5B', label: 'modern value of Atahualpa\'s ransom', color: SUN_GOLD },
  { value: '50–90%', label: 'indigenous population killed by disease', color: PURPLE },
];

function ConquestCallout({ stats }: { stats: ConquestStat[] }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${CRIMSON}33`,
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: CRIMSON,
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        Conquest in Numbers
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: `1px solid ${s.color}44`,
              borderRadius: 10,
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: s.color, fontWeight: 700, fontSize: '1.3rem', marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ color: SLATE, fontSize: '0.78rem', lineHeight: 1.4 }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const FIGURE_COLORS = [JADE, GOLD, TERRACOTTA, BLUE, CRIMSON, TEAL, PURPLE, AMBER, COPPER, GREEN];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${FIGURE_COLORS[i % FIGURE_COLORS.length]}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: FIGURE_COLORS[i % FIGURE_COLORS.length],
              marginBottom: 2,
              fontSize: '1.05rem',
            }}
          >
            {f.name}
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: SLATE,
              marginBottom: 8,
            }}
          >
            {f.years}
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ConnectionCards({ connections }: { connections: ConnectionCard[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {connections.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Link
            to={c.path}
            style={{
              display: 'block',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${c.color}33`,
              borderRadius: 10,
              padding: 18,
              textDecoration: 'none',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = `${c.color}33`;
            }}
          >
            <h4
              style={{
                fontWeight: 600,
                color: c.color,
                marginBottom: 8,
                fontSize: '1.05rem',
              }}
            >
              {c.title} →
            </h4>
            <p style={{ color: ASH, lineHeight: 1.6, fontSize: '0.85rem' }}>
              {c.description}
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function IncaEmpirePage() {
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
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${GOLD}, ${JADE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Inca Empire — Roads, Gold, and the Children of the Sun (~1200–1572)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              style={{
                color: ASH,
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 800,
                marginBottom: 16,
              }}
            >
              In 1500 CE, the largest empire in the Americas stretched 2,500 miles
              along the spine of the Andes — from modern Ecuador to central Chile,
              from the Pacific coast to the Amazon fringe. Tawantinsuyu, "The Four
              Regions Together," governed 12 million people across 40+ ethnic groups,
              connected by 25,000 miles of roads — more than Rome at its peak. They
              built cities at 14,000 feet, carved farmland into vertical mountainsides,
              and ran a continent-spanning economy without money, markets, or writing.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              Then 168 men with guns and horses arrived, captured the emperor in one
              hour, took the largest ransom in human history, and destroyed it all.
              This is the story of the Inca — how they built the impossible, and how
              it fell.
            </p>
          </motion.div>
          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Origins ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🏔️"
          title="Origins — Manco Cápac and the Navel of the World (~1200 CE)"
          accentColor={EARTH}
          intro="According to Inca mythology, the sun god Inti sent his children to found a civilization in the Andes. Whether Manco Cápac was a historical figure or a founding myth, the story served its purpose: it established the Inca as divinely chosen rulers — children of the Sun, destined to unite the Andean world under one empire."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Rise of the Empire ─────────────────────────────────────── */}
        <SectionWrapper
          id="rise"
          icon="⚔️"
          title="Rise of the Empire — Pachacuti and Tawantinsuyu (1438–1533)"
          accentColor={GOLD}
          intro="For two centuries, the Inca were a minor kingdom. Then one man — Pachacuti, 'He Who Remakes the World' — transformed them into the largest empire in the Americas in a single generation. His son and grandson expanded it further, until Tawantinsuyu stretched from Colombia to Chile. It was the most rapid imperial expansion in pre-Columbian history."
        >
          <TimelineCard entries={RISE_TIMELINE} />
        </SectionWrapper>

        {/* ── Geography & Scale ──────────────────────────────────────── */}
        <SectionWrapper
          id="geography"
          icon="🌎"
          title="Geography & Scale — An Empire of Extremes"
          accentColor={TEAL}
          intro="The Inca governed the most geographically extreme empire in human history. From sea-level deserts to peaks above 20,000 feet, from tropical rainforests to Antarctic-cold plateaus — all connected by roads that climbed, tunneled, and bridged terrain that would challenge modern engineers."
        >
          <InsightGrid items={GEOGRAPHY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Engineering Marvels ────────────────────────────────────── */}
        <SectionWrapper
          id="engineering"
          icon="🛤️"
          title="Engineering Marvels — Roads, Stone, and Water"
          accentColor={JADE}
          intro="The Inca were among the greatest engineers in the ancient world. Without iron tools, wheeled vehicles, or draft animals, they built 25,000 miles of roads, suspension bridges across bottomless gorges, cities at impossible altitudes, and agricultural terraces that turned vertical mountains into farmland. Their stonework — cut so precisely that no mortar was needed — has survived 600 years of earthquakes that toppled colonial buildings built on top of Inca foundations."
        >
          <InsightGrid items={ENGINEERING_INSIGHTS} />
        </SectionWrapper>

        {/* ── Society & Administration ───────────────────────────────── */}
        <SectionWrapper
          id="society"
          icon="👑"
          title="Society & Administration — An Empire Without Money"
          accentColor={AMBER}
          intro="The Inca ran one of history's largest empires without money, markets, or writing. The Sapa Inca — divine son of the Sun — sat atop a decimal bureaucracy that tracked every household in the realm. Citizens paid taxes in labor, not coin. The state fed, clothed, and housed its subjects in return. It was the most centralized economy in the pre-modern world."
        >
          <InsightGrid items={SOCIETY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Quipu ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="quipu"
          icon="🪢"
          title="Quipu — The Knotted Strings That Ran an Empire"
          accentColor={COPPER}
          intro="The Inca are the only known civilization to administer an empire of millions without a conventional writing system. Instead, they used quipus — intricate arrangements of knotted, colored strings that encoded numbers, census data, and possibly narrative information. Of roughly 900 surviving quipus, most remain undeciphered — one of the great unsolved puzzles of human communication."
        >
          <InsightGrid items={QUIPU_INSIGHTS} />
        </SectionWrapper>

        {/* ── Religion & Cosmology ───────────────────────────────────── */}
        <SectionWrapper
          id="religion"
          icon="☀️"
          title="Religion & Cosmology — Children of the Sun"
          accentColor={SUN_GOLD}
          intro="The Inca state religion centered on Inti, the sun god — divine ancestor of the ruling dynasty. But the Inca cosmos was far richer: a creator god who walked across the ocean, mummified emperors consulted as advisors, sacred mountains that demanded sacrifice, and a landscape alive with spiritual power. The Inca didn't just worship their gods — they lived among them."
        >
          <InsightGrid items={RELIGION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Agriculture ────────────────────────────────────────────── */}
        <SectionWrapper
          id="agriculture"
          icon="🥔"
          title="Agriculture — The Foods That Changed the World"
          accentColor={EARTH}
          intro="The Inca and their Andean predecessors gave the world the potato — a single crop that would eventually feed hundreds of millions and change the demographic history of Europe. They also cultivated quinoa, developed freeze-drying a millennium before NASA, and built an agricultural system that fed 12 million people on terrain where most civilizations couldn't survive."
        >
          <FoodsCallout foods={FOODS_THAT_CHANGED_THE_WORLD} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid items={AGRICULTURE_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── Spanish Conquest ───────────────────────────────────────── */}
        <SectionWrapper
          id="conquest"
          icon="⚓"
          title="The Spanish Conquest — 168 Men, One Hour, One Empire (1532–1572)"
          accentColor={CRIMSON}
          intro="The fall of the Inca Empire is one of the most dramatic and lopsided conquests in human history. A civil war, a surprise ambush, the largest ransom ever paid, a broken promise, and a pandemic that killed millions — all within a few devastating years. The empire that took a century to build was shattered in an afternoon."
        >
          <ConquestCallout stats={CONQUEST_NUMBERS} />
          <TimelineCard entries={CONQUEST_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌄"
          title="Legacy — The Inca World Lives On"
          accentColor={GREEN}
          intro="The Inca Empire fell in 1572, but Andean civilization didn't disappear. Quechua is spoken by millions. The potato feeds the world. Machu Picchu draws a million visitors a year. And in the highlands of Peru and Bolivia, communities still weave textiles, rebuild bridges, and celebrate festivals using techniques and traditions that predate the Spanish conquest by centuries."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Inca Empire"
          accentColor={GOLD}
          intro="From the visionary who built an empire in a generation to the last ruler executed in Cuzco's plaza, these are the people who shaped — and were destroyed by — the collision of the Inca world with Europe."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ────────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Connected Deep-Dives"
          accentColor={INDIGO}
          intro="The Inca story connects to broader themes of empire, engineering, exploration, and the collision of civilizations. Explore these related deep-dives to see the bigger picture."
        >
          <ConnectionCards connections={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 20px',
              fontStyle: 'italic',
            }}
          >
            "These people had no iron to work with, no machines, no draft
            animals — only their hands. And yet they made roads and buildings
            that we, with all our tools, could scarcely match."
            — Pedro Cieza de León, Spanish chronicler (c. 1553)
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
