/**
 * IncaEmpirePage — comprehensive deep-dive on the Inca Empire (~1200–1572).
 *
 * Route: /inca-empire
 *
 * Sections:
 *  1. Hero — headline, key stats (12M subjects, 40,000 km roads, Pizarro's 168 soldiers)
 *  2. Origins — Manco Capac legend, Cusco, early Killke culture (~1200 CE)
 *  3. Rise of the Empire — Pachacuti, Topa Inca, Huayna Capac (1438–1527)
 *  4. Tawantinsuyu: The Four Quarters — empire structure, Sapa Inca, administration
 *  5. Cusco: Navel of the World — Coricancha, golden garden, sacred layout
 *  6. Engineering Marvels — roads, Machu Picchu, terraces, bridges, aqueducts
 *  7. Quipu — knotted-string recording system
 *  8. Religion & Cosmology — Inti, Viracocha, capacocha, ancestor mummies
 *  9. Economy & Agriculture — mit'a, redistribution, potato/quinoa/corn
 * 10. Spanish Conquest — Pizarro, Cajamarca, ransom room, fall (1532–1572)
 * 11. Legacy — Quechua speakers, Machu Picchu tourism, potato/quinoa
 * 12. Key Figures
 * 13. Connection cards — links to related deep-dives
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const SUN_GOLD = '#fbbf24';
const TERRACOTTA = '#c2410c';
const JADE = '#059669';
const STONE = '#78716c';
const CRIMSON = '#dc2626';
const BLOOD_RED = '#991b1b';
const SKY_BLUE = '#38bdf8';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const AMBER = '#d97706';
const PURPLE = '#a855f7';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const EARTH = '#92400e';
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

interface ConnectionCard {
  title: string;
  description: string;
  path: string;
  color: string;
}

// ── Origins ─────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Manco Capac — The First Inca',
    detail:
      'According to Inca mythology, Manco Capac and his sister-wife Mama Ocllo emerged from the waters of Lake Titicaca, sent by the sun god Inti to bring civilization to humanity. Manco Capac carried a golden staff: wherever it sank into the earth on a single thrust, that would be the site of the Inca capital. The staff sank at Cusco — "the navel of the world." Another origin myth tells of four brothers and four sisters emerging from caves at Pacaritambo. Whether Manco Capac was a real person, a composite, or pure mythology, the founding legend served a crucial purpose: it established the Inca ruling dynasty as direct descendants of the sun, giving them divine right to rule.',
  },
  {
    label: 'Killke Culture — Before the Inca (~900–1200 CE)',
    detail:
      'The Cusco Valley wasn\'t empty before the Inca arrived. The Killke people built the earliest structures at Sacsayhuaman — the massive fortress overlooking Cusco — centuries before Inca expansion. The Inca inherited, absorbed, and built upon existing Andean traditions of stonework, agriculture, and social organization. They weren\'t inventing civilization from scratch; they were synthesizing centuries of Andean knowledge. The Wari and Tiwanaku empires (c. 500–1000 CE) had already demonstrated that large-scale states could function in the Andes, providing models the Inca would refine and surpass.',
  },
  {
    label: 'Cusco — A Kingdom Among Kingdoms (~1200–1400)',
    detail:
      'For roughly two centuries, the Kingdom of Cusco was just one of many small competing polities in the Andes. The early Inca rulers — from Manco Capac through the first seven or eight Sapa Incas — controlled only the Cusco Valley and surrounding highlands. They fought constantly with neighboring groups: the Chancas, the Collas, the Lupacas. There was nothing inevitable about Inca dominance. They were a small highland kingdom in a world of small highland kingdoms. Everything changed in 1438.',
  },
  {
    label: 'The Andes — A Vertical World',
    detail:
      'Understanding the Inca requires understanding the Andes. This is the longest continental mountain range on Earth — 7,000 km — with peaks above 6,000 meters, deserts drier than the Sahara on the coast, and Amazon rainforest on the eastern slopes. The Inca empire stretched across all of these environments. Andean peoples had spent millennia developing strategies for this "vertical archipelago": growing different crops at different altitudes, trading between ecological zones, and building infrastructure across some of the most challenging terrain on Earth. The Inca didn\'t just conquer this landscape — they engineered it.',
  },
];

// ── Rise of the Empire ──────────────────────────────────────────────────────

const RISE_TIMELINE: TimelineEntry[] = [
  {
    year: '1438',
    title: 'Pachacuti — The Earth Shaker',
    description:
      'The Chanca confederation attacked Cusco with overwhelming force. The reigning Sapa Inca, Viracocha Inca, fled with his chosen heir. But his younger son, Cusi Yupanqui, refused to run. According to legend, the very stones of the battlefield rose up as warriors to fight alongside him. He defeated the Chancas and took the throne, renaming himself Pachacuti — "he who overturns space and time" or "earth shaker." In one generation, Pachacuti transformed a small Andean kingdom into the largest empire in the Americas. He rebuilt Cusco, codified Inca law, established the administrative system, and launched the conquests that would triple the empire\'s territory.',
    color: GOLD,
  },
  {
    year: '1463–1471',
    title: 'Topa Inca Yupanqui — The Alexander of the Andes',
    description:
      'Pachacuti\'s son Topa Inca was the great military expansionist. He conquered the Chimú Empire — the largest rival state on the coast — and pushed the empire\'s borders north into modern Ecuador and south into Chile and Argentina. Under Topa Inca, the empire reached roughly 4,000 km from north to south — larger than the distance from London to Baghdad. He incorporated hundreds of ethnic groups, established the road system, and organized the administrative provinces. By his death, Tawantinsuyu governed perhaps 10 million people across the most geographically extreme empire in the ancient world.',
    color: TEAL,
  },
  {
    year: '1493–1527',
    title: 'Huayna Capac — Zenith and Crisis',
    description:
      'Huayna Capac brought the empire to its absolute peak: 12 million subjects, 4,000 km north-to-south, larger than Ming China. He conquered northern Ecuador and established a second capital at Quito. But in 1527, a devastating epidemic — likely smallpox, spreading south from the Spanish in Central America years before they reached the Inca — killed Huayna Capac and his chosen heir. The two surviving sons, Huascar (in Cusco) and Atahualpa (in Quito), plunged the empire into civil war. When Pizarro arrived in 1532, the Inca Empire was already tearing itself apart.',
    color: CRIMSON,
  },
  {
    year: '1527–1532',
    title: 'The Civil War — Huascar vs. Atahualpa',
    description:
      'The succession crisis became a full-scale civil war. Huascar, ruling from Cusco, and Atahualpa, commanding the veteran northern armies, fought a devastating conflict across the empire. Hundreds of thousands died. Atahualpa\'s generals — Chalcuchimac and Quisquis — were brilliant military commanders who systematically defeated Huascar\'s forces. By 1532, Atahualpa had won: Huascar was captured, and Atahualpa was marching south to claim Cusco. He stopped at the highland city of Cajamarca to rest — where 168 Spanish soldiers were waiting.',
    color: BLOOD_RED,
  },
];

// ── Tawantinsuyu ────────────────────────────────────────────────────────────

const TAWANTINSUYU_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Four Quarters',
    detail:
      'Tawantinsuyu — "the four parts together" — was the Inca name for their empire. It was divided into four suyus (quarters) radiating from Cusco: Chinchaysuyu (northwest, the largest and most populous), Antisuyu (northeast, into the Amazon foothills — the origin of the word "Andes"), Collasuyu (southeast, the altiplano around Lake Titicaca), and Cuntisuyu (southwest, toward the coast). Each suyu was governed by an apu (lord) who reported to the Sapa Inca. The division wasn\'t just administrative — it was cosmological, reflecting the Inca understanding of how the universe was organized.',
  },
  {
    label: 'The Sapa Inca — Son of the Sun',
    detail:
      'The Sapa Inca ("sole ruler") was considered the living descendant of Inti, the sun god. He was the empire personified. He wore clothing of the finest vicuna wool — worn once, then burned. He ate from gold and silver plates. He traveled on a gold-covered litter carried by specially chosen bearers. His primary wife (the coya) was his full sister — to keep the solar bloodline pure. When the Sapa Inca died, his mummy was preserved and attended by servants as if still alive: fed, clothed, consulted on state matters, and brought out for festivals. The living Sapa Inca inherited the throne but not his predecessor\'s wealth — he had to conquer his own.',
  },
  {
    label: 'Decimal Administration',
    detail:
      'The Inca governed through a remarkably systematic decimal administration. The population was organized into units of 10, 50, 100, 500, 1,000, 5,000, and 10,000 households, each with an appointed administrator (curaca). These administrators were responsible for census-taking, labor organization, tribute collection, and justice. Information flowed up through the hierarchy via quipu records and chasqui (relay runners). The system allowed the Inca to mobilize enormous labor forces with precision — tens of thousands of workers could be directed to build roads, terraces, or fortifications on short notice.',
  },
  {
    label: 'Conquered Peoples — Integration, Not Destruction',
    detail:
      'Unlike the Aztecs, who ruled through fear and tribute extraction, the Inca actively integrated conquered peoples. Local elites were kept in power as curacas, but their sons were sent to Cusco to be educated in Inca language, religion, and administration — and to serve as hostages. Rebellious populations were forcibly relocated (mitma) and replaced with loyal settlers. The Inca language (Quechua) was imposed as the administrative tongue. Conquered peoples kept their local gods but were required to worship Inti as supreme. The system was authoritarian but effective: it produced a more stable empire than the Aztec tributary model.',
  },
];

// ── Cusco ───────────────────────────────────────────────────────────────────

const CUSCO_INSIGHTS: InsightEntry[] = [
  {
    label: 'Coricancha — The Temple of the Sun',
    detail:
      'The Coricancha ("golden enclosure") was the most sacred temple in the Inca Empire. Its walls were lined with 700 sheets of pure gold, each weighing about 2 kg. Inside, a massive golden disc representing Inti was positioned to catch the first rays of dawn. There were chapels dedicated to the Moon, Venus, thunder, lightning, and the rainbow. The temple housed the mummies of past Sapa Incas, attended by priests and priestesses. When the Spanish arrived, they stripped the gold — melting down centuries of sacred art into ingots. Today, the Dominican church of Santo Domingo sits atop the Coricancha\'s Inca foundations, which survived the 1650 earthquake that destroyed the Spanish structure above.',
  },
  {
    label: 'The Golden Garden',
    detail:
      'Adjacent to the Coricancha was the most astonishing creation in the Inca world: a life-sized garden made entirely of gold and silver. Gold stalks of corn grew from golden soil. Gold llamas grazed alongside golden shepherds. Gold butterflies perched on gold flowers. Gold snakes slithered through gold grass. Spanish chroniclers who saw it before it was melted down described it with awe. The garden wasn\'t decorative — it was religious: a sacred recreation of the natural world in the material of the sun god. Every piece was melted into bars by the conquistadors. Not a single artifact survives.',
  },
  {
    label: 'City Layout — A Puma of Stone',
    detail:
      'Pachacuti redesigned Cusco in the shape of a puma — the sacred animal representing the earthly realm in Inca cosmology. Sacsayhuaman fortress formed the head, with its zigzag walls representing the puma\'s teeth. The body was the city itself, with the Coricancha at the tail. Two rivers were channeled through stone conduits to form the puma\'s outline. The city was divided into hanan (upper) and hurin (lower) halves, reflecting the fundamental Inca principle of duality. At 3,400 meters elevation, Cusco was one of the highest capitals in the ancient world — and at its peak housed perhaps 100,000 people.',
  },
  {
    label: 'Sacsayhuaman — The Teeth of the Puma',
    detail:
      'Overlooking Cusco, the fortress of Sacsayhuaman is one of the most impressive stone structures ever built. Its three zigzag walls are constructed from limestone blocks weighing up to 200 tons — the largest stones used in any building in pre-Columbian America. The blocks fit together so precisely that a knife blade cannot be inserted between them, yet no mortar was used. Construction took roughly 60 years and an estimated 20,000–30,000 laborers. The Spanish dismantled much of it for building stone, but the largest blocks — too big to move — remain. The precision of the stonework, achieved without iron tools or the wheel, still baffles engineers today.',
  },
];

// ── Engineering Marvels ─────────────────────────────────────────────────────

interface MarvelEntry {
  icon: string;
  name: string;
  stat: string;
  detail: string;
  color: string;
}

const ENGINEERING_MARVELS: MarvelEntry[] = [
  {
    icon: '\ud83d\udee4\ufe0f',
    name: 'The Road System (Qhapaq Nan)',
    stat: '40,000 km',
    detail:
      'The Inca road network was the most extensive in the pre-Columbian Americas — 40,000 km of roads connecting every corner of the empire. Two main highways ran north-south: one along the coast, one through the highlands, connected by lateral roads. The highland road climbed to over 5,000 meters and crossed deserts, swamps, and sheer cliffs. Roads were paved with stone, drained by culverts, and flanked by walls. Way stations (tambos) appeared every 20–30 km, stocked with food, weapons, and supplies. The entire system was built without the wheel (useless in mountain terrain) or draft animals larger than llamas.',
    color: STONE,
  },
  {
    icon: '\ud83c\udfd4\ufe0f',
    name: 'Machu Picchu — City in the Clouds',
    stat: '2,430m elevation',
    detail:
      'Built around 1450 CE as a royal estate for Pachacuti, Machu Picchu sits on a narrow ridge between two peaks in the eastern Andes. Its 200+ buildings were constructed with earthquake-proof ashlar masonry — stones cut so precisely they need no mortar and can shift during tremors without collapsing. The site includes agricultural terraces, a sophisticated water system fed by a natural spring, temples aligned with solstice sunrises, and the Intihuatana stone — a ritual "hitching post of the sun." Abandoned before the Spanish conquest (possibly due to smallpox), it was never found by the conquistadors and remained known only to local farmers until Hiram Bingham brought it to world attention in 1911.',
    color: JADE,
  },
  {
    icon: '\ud83c\udf3e',
    name: 'Terraced Agriculture (Andenes)',
    stat: '1M+ hectares',
    detail:
      'The Inca turned the steep Andean mountainsides into productive farmland through andenes — stone-walled terraces that created flat planting surfaces, prevented erosion, and created microclimates at different levels. The terraces at Moray, with their concentric circular design, may have functioned as an agricultural laboratory — each level has a slightly different temperature, allowing experimentation with crop varieties. Inca terracing increased agricultural output so dramatically that the empire produced surplus food stored in thousands of qollqas (storehouses) along the road network — enough to feed armies, fund construction projects, and survive years of drought.',
    color: GREEN,
  },
  {
    icon: '\ud83c\udf09',
    name: 'Suspension Bridges',
    stat: 'Up to 45m span',
    detail:
      'The Inca built hundreds of suspension bridges across Andean gorges using braided ichu grass cables as thick as a human body. The most famous, the Q\'eswachaka bridge over the Apurimac River, spanned 45 meters over a 30-meter-deep chasm. These bridges were engineering marvels: the cables were anchored to stone abutments on each side, with a walkway of woven matting suspended between them. Each bridge was rebuilt annually as a communal mit\'a obligation — the entire surrounding community would gather to dismantle the old bridge and weave a new one in three days. The Q\'eswachaka bridge is still rebuilt annually today, using the same Inca techniques.',
    color: COPPER,
  },
  {
    icon: '\ud83d\udca7',
    name: 'Aqueducts & Water Management',
    stat: 'Gravity-fed systems',
    detail:
      'The Inca were master hydraulic engineers. They built aqueducts that carried water across hundreds of kilometers, channeled rivers through stone-lined canals, and created fountains that still function today at sites like Tip\u00f3n and Ollantaytambo. At Tip\u00f3n, near Cusco, a complex of channels, fountains, and cascades demonstrates Inca understanding of hydraulic pressure and flow dynamics. In the coastal desert, they built puquios — underground aqueducts that tapped into the water table using a system of spiral wells. Some of these puquios are still in use after 500+ years, supplying water to modern communities.',
    color: SKY_BLUE,
  },
];

// ── Quipu ───────────────────────────────────────────────────────────────────

const QUIPU_INSIGHTS: InsightEntry[] = [
  {
    label: 'What Is a Quipu?',
    detail:
      'A quipu (also khipu) is a recording device made of cotton or camelid fiber strings. A main cord holds pendant strings, which may have subsidiary strings attached. Information is encoded through knots — their type, position, and spacing — as well as string color, ply direction, and attachment method. Over 900 quipus survive today. The numerical quipus use a base-10 positional system: knots placed at different positions on a string represent units, tens, hundreds, and thousands. A figure-eight knot represents 1, long knots represent 2–9, and a blank space represents zero. The system could record numbers into the tens of thousands with precision.',
  },
  {
    label: 'More Than Numbers?',
    detail:
      'The great mystery of the quipu is whether it recorded language — narrative histories, poetry, laws — in addition to numbers. Spanish chronicles mention "narrative quipus" that encoded stories, genealogies, and legal codes. Quipucamayocs (quipu keepers) could reportedly "read" these quipus aloud, suggesting they encoded linguistic information. Modern researchers have identified patterns suggesting phonetic encoding in some quipus — potentially representing syllables of Quechua. If confirmed, the quipu would be recognized as a fully developed writing system — just one that used strings instead of marks on a surface. The question remains one of the great unsolved problems in archaeology.',
  },
  {
    label: 'Quipucamayocs — The Keepers',
    detail:
      'Quipucamayocs were specialized officials trained from youth in quipu creation and interpretation. They served as the empire\'s record-keepers, accountants, and potentially historians. Every administrative center had quipucamayocs who recorded census data, tribute payments, labor obligations, and storeroom inventories. They could transmit information rapidly via the chasqui relay system — a runner would carry a quipu to the next station, where another runner would take it onward. When the Spanish arrived, they initially used quipucamayocs for colonial record-keeping, but then systematically destroyed quipus as instruments of "pagan" culture. Most of the empire\'s accumulated knowledge was lost.',
  },
];

// ── Religion & Cosmology ────────────────────────────────────────────────────

const RELIGION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Inti — The Sun God',
    detail:
      'Inti, the sun god, was the supreme deity of the Inca state religion and the divine ancestor of the Sapa Inca. The great festival of Inti Raymi — held at the winter solstice (June in the Southern Hemisphere) — was the most important ceremony in the Inca calendar. Thousands gathered in Cusco to watch the Sapa Inca offer chicha (corn beer) to the sun and sacrifice llamas. The ceremony ensured the sun\'s return and the continuation of life. Inti Raymi is still celebrated in Cusco today, drawing tens of thousands of spectators every June 24th. The primacy of sun worship reflected the Sapa Inca\'s claim to divine descent: the emperor literally was the son of the sun.',
  },
  {
    label: 'Viracocha — The Creator',
    detail:
      'Viracocha was the creator god — older and more fundamental than Inti, but less politically useful. According to Inca mythology, Viracocha created the world, the sun, the moon, and humanity at Lake Titicaca, then wandered through the land teaching civilization before walking across the Pacific Ocean and disappearing. Some scholars argue Viracocha was the supreme deity of pre-Inca Andean religion, with Inti elevated to prominence by the Inca ruling class to legitimize their divine-descent ideology. The name "Viracocha" was later applied by indigenous peoples to the Spanish — possibly because a pale-skinned creator god walking from the sea echoed the arrival of the conquistadors.',
  },
  {
    label: 'Capacocha — Sacred Sacrifice',
    detail:
      'The capacocha was the most solemn ritual in the Inca world: the sacrifice of children to the mountain gods (apus) during times of crisis or at the death of a Sapa Inca. Children — typically aged 6–15, selected for physical perfection — were brought from across the empire to Cusco for ceremonies, then taken to high mountain peaks (above 6,000 meters) where they were given chicha to drink and left to die of exposure. Archaeological discoveries of remarkably preserved frozen mummies — including "Juanita," the Ice Maiden found on Mount Ampato in 1995 — have confirmed these accounts. The children were not killed in anger but were considered the most precious offering: giving a community\'s most beautiful child to the gods.',
  },
  {
    label: 'Ancestor Mummies — The Living Dead',
    detail:
      'Death didn\'t end a Sapa Inca\'s role in government. Royal mummies were preserved and maintained by their panaca (royal household), which continued to manage the dead ruler\'s estates, wealth, and political influence. Mummies were brought out for festivals, seated in the main plaza, offered food and drink, and "consulted" on state matters through mediums. They "visited" each other. Some mummies were carried into battle. This system had a crucial economic consequence: since each new Sapa Inca inherited the throne but not his predecessor\'s wealth (which remained with the mummy\'s panaca), every new emperor had to conquer new territories to build his own estate — driving perpetual expansion.',
  },
];

// ── Economy & Agriculture ───────────────────────────────────────────────────

const ECONOMY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Mit\'a — The Labor Tax',
    detail:
      'The Inca had no money, no markets, and no merchant class. Instead, the economy ran on mit\'a — a labor tax requiring every household to contribute a set number of days per year to state projects. Mit\'a workers built roads, terraces, and temples; served in the army; mined gold and silver; wove cloth for state storehouses; and ran the chasqui relay system. In exchange, the state provided food, clothing, chicha, and tools — and guaranteed that no one would go hungry. The system was authoritarian but reciprocal: the state\'s legitimacy depended on fulfilling its obligations to the people. The Spanish would later twist mit\'a into forced labor in silver mines — extracting the form while gutting the reciprocity.',
  },
  {
    label: 'No Money, No Markets — A Redistribution State',
    detail:
      'The Inca economy challenges modern economic assumptions. There was no currency, no price system, no buying and selling. Instead, the state collected agricultural surplus and craft goods, stored them in thousands of qollqas (storehouses) along the road network, and redistributed them as needed — to feed armies, supply construction projects, or provide disaster relief. Local communities practiced ayni (reciprocal exchange) among households: you helped your neighbor harvest, and they helped you build. At the state level, the Sapa Inca distributed gifts to loyal curacas: fine cloth, gold, women, coca leaf. It was the largest economy in the Americas, run entirely without money.',
  },
  {
    label: 'The Potato Revolution',
    detail:
      'The Inca cultivated over 3,000 varieties of potato — growing them at altitudes up to 4,500 meters where no other crop could survive. They invented chu\u00f1o — freeze-dried potato made by exposing potatoes to overnight frost, squeezing out moisture, and sun-drying them — which could be stored for years. Chu\u00f1o was the foundation of Inca food security: storehouses full of freeze-dried potatoes could sustain armies and cities through drought and disaster. When the Spanish brought the potato to Europe, it eventually transformed the continent: the potato provided more calories per acre than grain, fueled population growth, and arguably enabled the Industrial Revolution. Ireland\'s population tripled on potatoes — then crashed in the famine of 1845.',
  },
  {
    label: 'Quinoa, Corn, and the Vertical Economy',
    detail:
      'The Inca managed a "vertical archipelago" of agriculture across altitude zones. Quinoa and potatoes grew at high altitude (3,000–4,500m). Corn (maize) — the prestige crop, used primarily for chicha — grew in middle valleys. Coca leaf grew on the warm eastern slopes. Cotton and chili peppers grew on the coast. Communities often maintained fields at multiple altitudes, sending members to tend them seasonally. The state organized this vertical economy on a massive scale, moving food across ecological zones via the road network. Quinoa, the Inca "mother grain," was so nutritious that NASA has studied it as a crop for long-duration space missions.',
  },
];

// ── Foods That Changed the World ────────────────────────────────────────────

interface FoodItem {
  emoji: string;
  name: string;
  quechua: string;
  impact: string;
  color: string;
}

const FOODS_THAT_CHANGED_THE_WORLD: FoodItem[] = [
  { emoji: '\ud83e\udd54', name: 'Potato', quechua: 'papa', impact: 'Feeds 1.3 billion people — 4th largest crop on Earth', color: EARTH },
  { emoji: '\ud83c\udf3e', name: 'Quinoa', quechua: 'kinwa', impact: 'NASA "perfect food" — complete protein, grows at 4,000m', color: GOLD },
  { emoji: '\ud83c\udf3d', name: 'Corn (Maize)', quechua: 'sara', impact: 'Most produced crop on Earth — 1.1 billion tons/year', color: SUN_GOLD },
  { emoji: '\ud83c\udf45', name: 'Tomato', quechua: 'adopted from Nahuatl tomatl', impact: 'Foundation of Italian, Indian, Middle Eastern cuisine', color: CRIMSON },
];

// ── Conquest ────────────────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  {
    year: '1526–1528',
    title: 'Pizarro\'s First Expeditions',
    description:
      'Francisco Pizarro, an illiterate Spanish soldier from Extremadura, made two preliminary voyages south from Panama. On the second, his pilot Bartolom\u00e9 Ruiz captured an Inca trading raft loaded with gold, silver, and fine textiles — proof of a wealthy civilization to the south. Pizarro returned to Spain and convinced King Charles V to grant him the right to conquer "Peru." He recruited 168 men, acquired 27 horses, and one cannon. He was about to attempt what Cort\u00e9s had done to the Aztecs — but with one-third the soldiers against an empire twice the size.',
    color: BLUE,
  },
  {
    year: 'Nov 15, 1532',
    title: 'The Ambush at Cajamarca',
    description:
      'Pizarro marched his 168 men into the highland city of Cajamarca, where Atahualpa was camped with 40,000–80,000 soldiers. The Spanish hid in buildings around the main plaza and invited Atahualpa to a meeting. When the Inca emperor arrived — carried on a gold litter, surrounded by unarmed attendants — the friar Vicente de Valverde offered him a Bible. Atahualpa examined it, threw it to the ground, and Pizarro gave the signal. Cannons and muskets fired into the packed plaza. Cavalry charged. In two hours, the Spanish killed 2,000–10,000 Inca (accounts vary) without losing a single man. Atahualpa was captured.',
    color: CRIMSON,
  },
  {
    year: '1532–1533',
    title: 'The Ransom Room',
    description:
      'Atahualpa, imprisoned but alive, offered Pizarro a staggering ransom: he would fill a room 22 feet long, 17 feet wide, and 8 feet high with gold, and fill it twice more with silver. For eight months, gold and silver poured into Cajamarca from across the empire — vessels, ornaments, the gold sheets from the Coricancha, statues from temples. The final tally: roughly 13,000 pounds of gold and 26,000 pounds of silver — worth over $100 million today. The Spanish melted everything into bars, destroying thousands of irreplaceable artworks. Then, despite the ransom, they executed Atahualpa on July 26, 1533, on charges of treason and heresy.',
    color: GOLD,
  },
  {
    year: '1533–1537',
    title: 'The Fall of Cusco and Manco Inca\'s Rebellion',
    description:
      'The Spanish marched on Cusco, installing Atahualpa\'s brother Manco Inca as a puppet ruler. But Manco soon realized the Spanish intended permanent domination, not alliance. In 1536, he launched a massive rebellion, besieging Cusco with 100,000+ warriors. The Inca came close to retaking their capital — but Spanish horses, steel weapons, and indigenous allies (groups happy to see the Inca fall) eventually broke the siege. Manco retreated to the remote fortress of Vilcabamba in the jungle-covered eastern Andes, establishing a Neo-Inca state that would resist Spanish rule for 36 years.',
    color: TERRACOTTA,
  },
  {
    year: '1542–1572',
    title: 'The Neo-Inca State and Final Fall',
    description:
      'The Neo-Inca state at Vilcabamba was the last bastion of Inca independence. For four decades, Inca rulers maintained their court, religion, and resistance in the cloud-forest mountains. But the noose tightened. In 1572, the Spanish viceroy Francisco de Toledo sent an expedition into Vilcabamba. The last Sapa Inca, Tupac Amaru, was captured, marched to Cusco, and publicly beheaded in the main plaza before a weeping crowd of thousands. With his death, the Inca Empire — which had lasted less than a century at its full extent — was finally extinguished. Or was it? His name would be taken by a revolutionary in 1780, and again by a Uruguayan guerrilla movement in the 1960s.',
    color: BLOOD_RED,
  },
];

const SMALLPOX_INSIGHT: InsightEntry[] = [
  {
    label: 'The Invisible Conqueror — Disease',
    detail:
      'Before Pizarro ever set foot in the Inca Empire, his most powerful weapon had already arrived. Smallpox, spreading south from the Spanish in Central America and the Caribbean, reached the Andes around 1527 — five years before Pizarro. It killed the Sapa Inca Huayna Capac and his heir, triggering the civil war that shattered the empire. Estimates suggest 60–90% of the indigenous population died from European diseases — smallpox, measles, influenza, typhus — within the first century of contact. By 1600, the population of the Inca realm had collapsed from 12 million to roughly 1 million. This was the single most important factor in the Spanish conquest: not horses, not guns, not steel — but invisible microbes.',
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: '8–10 Million Quechua Speakers Today',
    detail:
      'The Inca language didn\'t die. Quechua — which the Inca imposed as the administrative language across their empire — is today spoken by 8–10 million people across Peru, Bolivia, Ecuador, Colombia, and Argentina. It\'s an official language of Peru and Bolivia. Quechua words have entered English: condor, llama, puma, quinine, jerky (from ch\'arki). The language is a living bridge to the Inca world, carrying place names, agricultural terms, and concepts that predate the Spanish by centuries.',
  },
  {
    label: 'Machu Picchu — Wonder of the World',
    detail:
      'Machu Picchu, the Inca royal estate that the Spanish never found, is now the most visited archaeological site in South America — 1.5 million visitors per year, generating hundreds of millions in tourism revenue. It was voted one of the New Seven Wonders of the World in 2007. The site has become a symbol of Inca achievement and indigenous pride across the Andes. Its earthquake-resistant stonework, integrated water systems, and astronomical alignments continue to inspire architects and engineers. Peru\'s challenge now is preserving the site against the erosion of mass tourism.',
  },
  {
    label: 'Potato and Quinoa — Feeding the Modern World',
    detail:
      'The Inca agricultural legacy may be their greatest gift to humanity. The potato — domesticated in the Andes over 8,000 years ago and cultivated in thousands of varieties by the Inca — is now the world\'s fourth-largest food crop, feeding over a billion people. Quinoa, the Inca "mother grain," has become a global superfood, with production skyrocketing 400% since 2000. The Andes remain the world\'s genetic reservoir for these crops: wild potato relatives with disease-resistant genes are used by scientists breeding new varieties to feed a warming world.',
  },
  {
    label: 'Peru, Bolivia, Ecuador — Inca Heritage Lives',
    detail:
      'Inca heritage is foundational to the national identities of Peru, Bolivia, and Ecuador. The Inti Raymi festival continues in Cusco. Traditional weaving techniques unchanged since Inca times produce textiles sold worldwide. Andean agricultural terraces built by the Inca are still in use. The concept of ayni (reciprocity) remains central to Andean community life. In 1780, Jos\u00e9 Gabriel Condorcanqui took the name Tupac Amaru II and led the largest indigenous rebellion in colonial history. In Bolivia, the wiphala — the rainbow-checkered flag of the Andes — is now an official state symbol. The Inca Empire fell, but Inca civilization endures.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Pachacuti',
    years: 'r. 1438–1471',
    contribution:
      'The "Earth Shaker" who transformed a small kingdom into an empire. Rebuilt Cusco, codified law, established the administrative system, and launched the conquests. Perhaps the most important pre-Columbian ruler in the Americas.',
  },
  {
    name: 'Topa Inca Yupanqui',
    years: 'r. 1471–1493',
    contribution:
      'The great military expansionist who conquered the Chim\u00fa Empire and pushed Inca borders from Ecuador to Chile — creating an empire 4,000 km long.',
  },
  {
    name: 'Huayna Capac',
    years: 'r. 1493–1527',
    contribution:
      'Brought the empire to its absolute peak of 12 million subjects. His death from smallpox (before any Spaniard reached the Inca) triggered the civil war that doomed the empire.',
  },
  {
    name: 'Atahualpa',
    years: 'r. 1532–1533',
    contribution:
      'Won the civil war against his brother Huascar, only to be captured at Cajamarca by 168 Spanish soldiers. Filled a room with gold as ransom — then was executed anyway.',
  },
  {
    name: 'Francisco Pizarro',
    years: '1478–1541',
    contribution:
      'Illiterate Spanish conquistador who conquered the Inca Empire with 168 men, 27 horses, and one cannon. Murdered by rival Spaniards in 1541.',
  },
  {
    name: 'Manco Inca',
    years: 'r. 1533–1544',
    contribution:
      'Installed as a puppet ruler, he escaped and led a massive rebellion that nearly retook Cusco. Founded the Neo-Inca resistance state at Vilcabamba.',
  },
  {
    name: 'Tupac Amaru',
    years: 'r. 1571–1572',
    contribution:
      'The last Sapa Inca. Captured at Vilcabamba and publicly beheaded in Cusco. His name became a symbol of indigenous resistance for centuries.',
  },
];

// ── Connections ─────────────────────────────────────────────────────────────

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'The Aztec Empire',
    description:
      'The other great pre-Columbian empire — built on an island, fed by floating gardens, and conquered by Spanish soldiers who exploited internal divisions. Compare the Inca\'s integration model with Aztec tributary rule.',
    path: '/aztec-empire',
    color: TERRACOTTA,
  },
  {
    title: 'The Age of Exploration',
    description:
      'The European voyages that brought Pizarro to the Andes — driven by gold, spices, and religious zeal. How maritime technology and Renaissance ambition collided with the Americas.',
    path: '/age-of-exploration',
    color: BLUE,
  },
  {
    title: 'Spanish Colonialism',
    description:
      'What happened after conquest: the encomienda system, forced labor in silver mines, cultural destruction, and the creation of colonial societies that still shape Latin America today.',
    path: '/spanish-colonialism',
    color: AMBER,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
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

const FIGURE_COLORS = [JADE, GOLD, TERRACOTTA, BLUE, CRIMSON, TEAL, PURPLE, AMBER, GREEN, INDIGO];

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

// ─────────────────────────────────────────────────────────────────────────────
// Hero stats callout
// ─────────────────────────────────────────────────────────────────────────────

interface StatEntry {
  value: string;
  label: string;
  color: string;
}

const HERO_STATS: StatEntry[] = [
  { value: '12 million', label: 'subjects at empire\'s peak', color: GOLD },
  { value: '40,000 km', label: 'of roads (Rome had ~85,000 km)', color: STONE },
  { value: '4,000 km', label: 'north-to-south — larger than Ming China', color: TEAL },
  { value: '168', label: 'soldiers Pizarro brought to conquer it all', color: CRIMSON },
  { value: '8–10 million', label: 'Quechua speakers today', color: JADE },
];

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

// ─────────────────────────────────────────────────────────────────────────────
// Engineering marvels visual callout
// ─────────────────────────────────────────────────────────────────────────────

function MarvelCards({ marvels }: { marvels: MarvelEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {marvels.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${m.color}33`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: '1.6rem' }}>{m.icon}</span>
            <div>
              <h4 style={{ fontWeight: 700, color: m.color, fontSize: '1.1rem', marginBottom: 2 }}>
                {m.name}
              </h4>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: `${m.color}22`,
                  color: m.color,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '2px 10px',
                  borderRadius: 6,
                }}
              >
                {m.stat}
              </span>
            </div>
          </div>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.93rem' }}>
            {m.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Foods callout
// ─────────────────────────────────────────────────────────────────────────────

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
          color: SUN_GOLD,
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

// ─────────────────────────────────────────────────────────────────────────────
// Connection cards component
// ─────────────────────────────────────────────────────────────────────────────

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
            The Inca Empire — Mountains, Gold, and the Road to Everything (~1200–1572)
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
              In 1500 CE, the largest empire in the Americas stretched 4,000 km
              along the spine of the Andes — from the rainforests of Colombia to
              the deserts of Chile. Twelve million people, connected by 40,000 km
              of roads, governed without writing, money, or markets, fed by
              freeze-dried potatoes and terraced mountainsides. They called it
              Tawantinsuyu — "the four parts together." Within 40 years, 168
              Spanish soldiers would bring it all crashing down.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of the Inca — how a small highland kingdom
              became the largest empire in pre-Columbian history, engineered
              mountains into farmland, built cities in the clouds, recorded
              their world in knotted strings, and fell to a combination of civil
              war, smallpox, and a handful of men with horses and guns.
            </p>
          </motion.div>
          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Origins ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🌅"
          title="Origins — Children of the Sun (~1200 CE)"
          accentColor={GOLD}
          intro="The Inca origin story begins at Lake Titicaca, where the sun god Inti sent his children to bring civilization to humanity. The real origins are more complex: the Cusco Valley was home to the Killke culture long before the Inca, and centuries of Andean civilization — Wari, Tiwanaku, Moche — laid the groundwork for what the Inca would build. For two centuries, the Kingdom of Cusco was just one of many competing highland states. Then came Pachacuti."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Rise of the Empire ───────────────────────────────────────── */}
        <SectionWrapper
          id="rise"
          icon="⚔️"
          title="Rise of the Empire — Three Generations That Changed the Americas (1438–1527)"
          accentColor={TEAL}
          intro="In less than a century — three generations of rulers — the Inca transformed a small Andean kingdom into the largest empire in the Western Hemisphere. Pachacuti built the state. Topa Inca built the empire. Huayna Capac brought it to its peak. Then smallpox killed Huayna Capac before any Spaniard set foot in the Andes, and the empire tore itself apart."
        >
          <TimelineCard entries={RISE_TIMELINE} />
        </SectionWrapper>

        {/* ── Tawantinsuyu ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="tawantinsuyu"
          icon="🗺️"
          title="Tawantinsuyu: The Four Quarters — How to Run an Empire Without Writing"
          accentColor={PURPLE}
          intro="The Inca governed 12 million people across the most extreme geography on Earth — without writing, without money, and without markets. Their solution was a system of decimal administration, forced resettlement, labor taxation, and a road-and-runner communication network that could carry a message 240 km in a single day. It was totalitarian, efficient, and unlike anything else in the ancient world."
        >
          <InsightGrid items={TAWANTINSUYU_INSIGHTS} />
        </SectionWrapper>

        {/* ── Cusco ────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="cusco"
          icon="🏛️"
          title="Cusco: Navel of the World — A City Shaped Like a Puma"
          accentColor={GOLD}
          intro="Cusco — 'the navel of the world' — was the sacred center of the Inca universe. Pachacuti redesigned it in the shape of a puma, with the fortress of Sacsayhuaman as its head and the Coricancha temple as its tail. Its walls were lined with gold. Its garden was made of gold. Its dead emperors sat in its plaza, eating golden food. Then the Spanish melted it all down."
        >
          <InsightGrid items={CUSCO_INSIGHTS} />
        </SectionWrapper>

        {/* ── Engineering Marvels ──────────────────────────────────────── */}
        <SectionWrapper
          id="engineering"
          icon="🔧"
          title="Engineering Marvels — Roads, Cloud Cities, and Woven Bridges"
          accentColor={STONE}
          intro="The Inca were among the greatest engineers in the ancient world. Without iron, without the wheel, without draft animals larger than a llama, they built 40,000 km of roads through the most extreme mountain terrain on Earth, constructed earthquake-proof cities at 2,400 meters, turned sheer mountainsides into productive farmland, and spanned 45-meter gorges with woven grass bridges. Their infrastructure has outlasted the Spanish buildings erected on top of it."
        >
          <MarvelCards marvels={ENGINEERING_MARVELS} />
        </SectionWrapper>

        {/* ── Quipu ────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="quipu"
          icon="🪢"
          title="Quipu — The Knotted Strings That Might Be Writing"
          accentColor={AMBER}
          intro="The Inca had no writing — or did they? The quipu, a device of knotted and colored strings, was used to record numbers with mathematical precision. But growing evidence suggests some quipus may have encoded language itself — histories, laws, and poetry recorded in fiber rather than ink. If confirmed, the quipu would be recognized as the only three-dimensional 'writing' system ever developed. The Spanish destroyed most of them."
        >
          <InsightGrid items={QUIPU_INSIGHTS} />
        </SectionWrapper>

        {/* ── Religion & Cosmology ─────────────────────────────────────── */}
        <SectionWrapper
          id="religion"
          icon="☀️"
          title="Religion & Cosmology — Sun God, Creator God, and the Living Dead"
          accentColor={SUN_GOLD}
          intro="Inca religion was both cosmic and political. The Sapa Inca ruled as the literal son of the sun. Dead emperors continued to govern through their mummies. Children were sacrificed on mountain peaks to appease the gods. And the creator Viracocha — who walked across the Pacific and vanished — would later be confused with the pale-skinned strangers who arrived from the sea."
        >
          <InsightGrid items={RELIGION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Economy & Agriculture ────────────────────────────────────── */}
        <SectionWrapper
          id="economy"
          icon="🥔"
          title="Economy & Agriculture — No Money, No Markets, No Hunger"
          accentColor={GREEN}
          intro="The Inca economy defies modern categories. No money. No markets. No merchants. Instead, a massive state apparatus collected labor (not goods), redistributed surplus from thousands of storehouses, and guaranteed that no one went hungry. They cultivated 3,000 varieties of potato, invented freeze-drying, and managed agriculture across altitude zones from sea level to 4,500 meters. Their crops — potato, quinoa, corn — now feed billions."
        >
          <FoodsCallout foods={FOODS_THAT_CHANGED_THE_WORLD} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid items={ECONOMY_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── Spanish Conquest ─────────────────────────────────────────── */}
        <SectionWrapper
          id="conquest"
          icon="⚓"
          title="The Spanish Conquest — 168 Soldiers, One Room of Gold, and a Virus (1532–1572)"
          accentColor={CRIMSON}
          intro="The fall of the Inca Empire is one of history's most dramatic and devastating episodes. Francisco Pizarro — illiterate, illegitimate, and armed with 168 soldiers — captured an emperor, extracted the largest ransom in history, and toppled a civilization of 12 million. But Pizarro's real allies were smallpox (which had already killed the emperor and triggered civil war before he arrived) and the empire's own internal divisions."
        >
          <TimelineCard entries={CONQUEST_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid items={SMALLPOX_INSIGHT} />
          </div>
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌎"
          title="Legacy — The Inca World Lives On"
          accentColor={JADE}
          intro="The Inca Empire lasted less than a century at its full extent — yet its legacy endures in 10 million Quechua speakers, in terraces still farmed after 500 years, in potatoes and quinoa feeding billions, and in Machu Picchu drawing 1.5 million visitors each year. The empire fell, but the civilization didn't die."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Inca Empire"
          accentColor={GOLD}
          intro="From the earth-shaking conqueror who built an empire in a single generation to the last Sapa Inca beheaded in Cusco's plaza, these are the people who shaped — and were destroyed by — the collision of the Andes and the Atlantic."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connections ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Connected Deep-Dives"
          accentColor={INDIGO}
          intro="The Inca story connects to broader themes of empire, exploration, and the Columbian Exchange. Explore these related deep-dives to see the bigger picture."
        >
          <ConnectionCards connections={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
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
            "We are like straw in the wind. The Inca ordered mountains moved,
            rivers turned, roads built across the sky. And then strangers came,
            and it was as if the world turned upside down."
            — Attributed to an anonymous Inca noble, recorded by Pedro Cieza de León (c. 1550)
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
