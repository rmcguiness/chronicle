/**
 * IncaEmpirePage — comprehensive deep-dive on the Inca Empire (~1200–1572).
 *
 * Route: /inca-empire
 *
 * Sections:
 *  1. Hero — headline, key stats bar
 *  2. Origins & The Cusco Kingdom (~1200 CE)
 *  3. Imperial Expansion (1438–1533)
 *  4. Tawantinsuyu at its Peak
 *  5. Engineering Marvels — Machu Picchu, roads, terraces, bridges
 *  6. Government & Administration — mit'a, quipu, no money
 *  7. Religion & Cosmology — Inti, Viracocha, capacocha
 *  8. Agriculture & Food — potato, quinoa, chuño, llamas
 *  9. The Quipu — knotted string "writing system"
 * 10. Spanish Conquest (1532–1572)
 * 11. Legacy — Quechua, potato, Machu Picchu tourism
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const BLUE = '#3b82f6';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const TERRACOTTA = '#c2410c';
const EMERALD = '#10b981';
const SKY = '#38bdf8';
const EARTH_BROWN = '#92400e';
const SUN_ORANGE = '#ea580c';
const MOUNTAIN_BLUE = '#0ea5e9';
const STONE_GRAY = '#78716c';

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

// ── Key Stats ──────────────────────────────────────────────────────────────

const KEY_STATS = [
  { value: '40,000 km', label: 'of roads' },
  { value: '12M+', label: 'subjects at peak' },
  { value: '3,000+', label: 'potato varieties' },
  { value: '168', label: 'Spanish conquistadors' },
  { value: '7,972 ft', label: 'Machu Picchu elevation' },
  { value: '10M', label: 'Quechua speakers today' },
];

// ── Origins ────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Legend of Manco Capac',
    detail:
      'According to Inca mythology, the sun god Inti sent his son Manco Capac and his sister-wife Mama Ocllo to earth on an island in Lake Titicaca, the highest navigable lake in the world at 12,500 feet. Inti gave Manco Capac a golden staff and told him to settle wherever the staff sank into the ground on a single thrust. After wandering the highlands, the staff plunged into the earth at a fertile valley — the site that would become Cusco, the "navel of the world." In reality, the early Incas were one of many small highland kingdoms competing for dominance in the Cusco Valley around 1200 CE, but the origin myth served a powerful political purpose: it made Inca rule literally a gift from the sun.',
  },
  {
    label: 'The Cusco Kingdom (c. 1200–1438)',
    detail:
      'For over two centuries, the Incas were a relatively minor kingdom centered on Cusco, fighting and allying with neighboring polities like the Chankas, Lupacas, and Collas. The early Sapa Incas (emperors) are semi-legendary figures — Sinchi Roca, Lloque Yupanqui, Mayta Capac — whose historical existence is debated. What is clear is that the Incas gradually consolidated control over the Cusco Valley through a combination of military conquest, strategic marriage alliances, and the incorporation of neighboring ethnic groups into a growing political system. They were building the foundation, but the explosion of empire would have to wait for a transformative leader.',
  },
  {
    label: 'A World of Competing Kingdoms',
    detail:
      'Pre-Inca Peru was not empty wilderness — it was home to sophisticated civilizations stretching back thousands of years. The Moche had built massive pyramids and created stunning metalwork. The Nazca had drawn enormous geoglyphs visible only from the air. The Tiwanaku and Wari empires had already demonstrated that large-scale political organization was possible in the Andes. The Chimú Empire, centered on the vast adobe city of Chan Chan, controlled much of the northern coast and had 500,000 subjects. The Incas did not invent Andean civilization — they inherited, absorbed, and dramatically scaled up traditions that were already ancient.',
  },
];

// ── Imperial Expansion ─────────────────────────────────────────────────────

const EXPANSION_TIMELINE: TimelineEntry[] = [
  {
    year: '1438',
    title: 'Pachacuti — The Earth-Shaker',
    description:
      'Everything changed with Pachacuti Inca Yupanqui, whose name means "he who remakes the world." When the powerful Chanka confederation attacked Cusco around 1438, the reigning Sapa Inca Viracocha fled. His son Cusi Yupanqui stayed, rallied the defenders, and — according to legend — called the very stones of the battlefield to rise up as warriors. After crushing the Chankas, he deposed his father, took the throne name Pachacuti, and launched the most rapid imperial expansion in pre-Columbian history. In a single generation, he transformed a small highland kingdom into the largest empire the Americas had ever seen.',
    color: GOLD,
  },
  {
    year: '1438–1471',
    title: 'Building Tawantinsuyu — "The Four Regions Together"',
    description:
      'Pachacuti was not just a conqueror — he was a state-builder of extraordinary vision. He redesigned Cusco in the shape of a puma, built the fortress of Sacsayhuamán with stones weighing up to 200 tons fitted so precisely that a knife blade cannot be inserted between them, established the mit\'a labor tax system, codified laws, and created the administrative framework that made the empire function. He sent his son Tupac Inca northward to conquer Ecuador while he personally subdued the Lake Titicaca region. By his death around 1471, the empire stretched from southern Colombia to central Chile — 2,500 miles along the spine of the Andes.',
    color: AMBER,
  },
  {
    year: '1471–1493',
    title: 'Tupac Inca Yupanqui — Expansion to the Maximum',
    description:
      'Pachacuti\'s son Tupac Inca pushed the empire to its greatest territorial extent. He conquered the powerful Chimú Empire on the northern coast, absorbing their sophisticated metalworking and administrative techniques. He extended Inca control deep into the Amazon basin, south into Chile and northwestern Argentina, and — according to some traditions — may have launched a maritime expedition into the Pacific. Tupac Inca was also a great administrator who refined the road system, expanded the network of state storehouses (qollqa), and systematized the quipu record-keeping that held the empire together.',
    color: TERRACOTTA,
  },
  {
    year: '1493–1527',
    title: 'Huayna Capac — Last of the Great Sapa Incas',
    description:
      'Huayna Capac spent much of his reign consolidating the northern provinces, fighting campaigns in Ecuador and establishing a second capital at Quito. Under his rule, the empire reached its administrative peak — an efficient machine governing 12 million people across the most challenging terrain on earth. But disaster was already approaching: around 1527, a devastating epidemic — almost certainly smallpox, racing ahead of the Spanish from Panama and Colombia — swept through the empire. Huayna Capac himself died of the disease, along with his designated heir. His death without a clear succession triggered a catastrophic civil war between his sons Huascar and Atahualpa — exactly the weakness that would doom the empire.',
    color: CRIMSON,
  },
];

// ── Tawantinsuyu at its Peak ───────────────────────────────────────────────

const PEAK_INSIGHTS: InsightEntry[] = [
  {
    label: '12 Million Subjects, One Empire',
    detail:
      'At its peak around 1520, Tawantinsuyu governed an estimated 12 million people — possibly more — making it one of the largest empires on earth at the time. The empire stretched 2,500 miles along the western coast of South America, from southern Colombia to central Chile, encompassing coastal deserts, Andean peaks over 20,000 feet, tropical rainforests, and high-altitude grasslands. It incorporated dozens of ethnic groups speaking different languages, with Quechua imposed as the administrative lingua franca. The Incas achieved this without writing, without the wheel, without iron tools, and without horses — accomplishments that make their empire one of the most remarkable in human history.',
  },
  {
    label: 'The Four Quarters',
    detail:
      'Tawantinsuyu literally means "the four regions together." The empire was divided into four suyus (quarters) radiating from Cusco: Chinchaysuyu (northwest, toward Ecuador), Antisuyu (northeast, toward the Amazon), Collasuyu (southeast, toward Bolivia and Chile), and Cuntisuyu (southwest, toward the coast). Each suyu was governed by an apu (governor) of royal Inca blood. This four-part division reflected a deep Andean principle of duality and complementarity — upper and lower, left and right — that organized everything from politics to cosmology. Cusco itself was divided into upper (hanan) and lower (hurin) halves, each with distinct ceremonial and political roles.',
  },
  {
    label: 'Cusco — Navel of the World',
    detail:
      'The Inca capital of Cusco, at 11,152 feet above sea level, was the political, religious, and symbolic center of the empire. Pachacuti rebuilt it as a planned city in the shape of a puma, with the fortress of Sacsayhuamán forming the head. The city\'s temples were lavished with gold — the Qorikancha (Temple of the Sun) had walls lined with 700 sheets of pure gold, each weighing about 2 kg. A garden of gold and silver replicas of corn, llamas, and other plants adorned its courtyard. The Spanish were staggered by what they found. Today, many colonial buildings in Cusco sit directly atop perfectly fitted Inca stone walls — the Spanish tore down the superstructure but could not budge the foundations.',
  },
  {
    label: 'Population Control Through Resettlement',
    detail:
      'One of the Incas\' most effective — and ruthless — tools of imperial control was the mitmaq system: the forced resettlement of entire communities. Loyal Quechua-speaking populations were transplanted into newly conquered or rebellious regions, while potentially disloyal groups were relocated deep into the imperial heartland where they were surrounded by loyal subjects. This shattered local identities and resistance networks, spread Quechua, and ensured that no conquered region had a unified population that could revolt. It was social engineering on a massive scale, and it worked — there were remarkably few successful rebellions against Inca rule.',
  },
];

// ── Engineering Marvels ────────────────────────────────────────────────────

const ENGINEERING_INSIGHTS: InsightEntry[] = [
  {
    label: 'Machu Picchu (c. 1450)',
    detail:
      'Built around 1450 as a royal estate for Pachacuti, Machu Picchu sits at 7,972 feet above sea level on a narrow ridge between two peaks in the cloud forest above the Urubamba River. Its roughly 200 structures — temples, residences, terraces, fountains — were built without mortar, using precisely cut stone blocks fitted so tightly that even today a knife blade cannot be inserted between them. The site includes the Intihuatana stone, an astronomical instrument aligned to the sun\'s position during solstices, and a sophisticated water system with 16 interconnected fountains fed by a spring nearly half a mile away. Abandoned during the Spanish conquest, it was never found by the conquistadors and remained unknown to the outside world until Hiram Bingham brought it to international attention in 1911.',
  },
  {
    label: 'Qhapaq Ñan — The Royal Road (40,000 km)',
    detail:
      'The Inca road system — Qhapaq Ñan — was one of the greatest engineering achievements of the ancient world: 40,000 km of roads connecting every corner of the empire, more than the Roman road network. Two main highways ran the length of the empire: one along the coast and one through the highlands, connected by lateral roads crossing the Andes. The roads traversed deserts, spanned gorges with suspension bridges, climbed mountains via stone staircases, and crossed swamps on causeways. Along them, a relay system of chasqui runners could carry messages at speeds of 240 km per day — a message from Quito could reach Cusco (about 2,000 km) in roughly a week. Tambos (rest stations) were spaced every 20–30 km, stocked with food and supplies.',
  },
  {
    label: 'Andenes — Terraced Agriculture',
    detail:
      'The Incas transformed the impossibly steep Andean landscape into productive farmland through andenes — terraced agricultural platforms carved into mountainsides. These terraces created microclimates at different altitudes, allowing the cultivation of diverse crops from tropical fruits to high-altitude potatoes. The engineering was remarkably sophisticated: each terrace had multiple layers — a retaining wall of fitted stone, a layer of gravel for drainage, a layer of sand, and then topsoil — preventing erosion and waterlogging. Some terraces at Moray appear to have functioned as agricultural laboratories, with temperature differences of up to 15°C between the top and bottom levels. Many Inca terraces are still in use today, 500 years later.',
  },
  {
    label: 'Suspension Bridges — Grass Over the Abyss',
    detail:
      'Where the Qhapaq Ñan encountered deep gorges — which was often in the Andes — the Incas built suspension bridges from braided grass fibers (ichu). The most famous, the Q\'eswachaka bridge over the Apurímac River, spanned roughly 100 feet across a dizzying canyon. These bridges used cables of twisted grass as thick as a human body, anchored to stone abutments on each side. They were strong enough to support loaded llama caravans. Remarkably, each bridge was rebuilt annually as a communal labor obligation — entire villages would gather to braid new cables and replace the old ones in a ritual that continues to this day at Q\'eswachaka, the last remaining Inca grass bridge, rebuilt every June by local Quechua communities.',
  },
  {
    label: 'Sacsayhuamán — Stones That Defy Explanation',
    detail:
      'The fortress-temple of Sacsayhuamán, overlooking Cusco, contains some of the largest stones ever used in any building in the ancient world. Individual blocks weigh up to 200 tons — heavier than most stones at the Great Pyramid of Giza. These megalithic stones are fitted together in complex, irregular polygonal patterns with such precision that a razor blade cannot be inserted between them, yet no mortar was used. The Incas had no iron tools, no wheel, no draft animals capable of pulling such weights, and no pulleys. How they quarried, transported, and fitted these stones remains one of archaeology\'s enduring puzzles. Spanish chroniclers reported that 20,000–30,000 laborers worked on the fortress for decades.',
  },
];

// ── Government & Administration ────────────────────────────────────────────

const GOVERNMENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Mit\'a Labor Tax — No Money, Just Work',
    detail:
      'The Inca economy operated without money, markets, or trade in the conventional sense. Instead, the state extracted labor through the mit\'a system: every household owed a certain number of days of work per year to the state. This labor built roads, terraces, temples, and storehouses; staffed the army; mined gold and silver; and wove textiles. In return, the state guaranteed every family access to land, provided food and chicha (corn beer) during work projects, and maintained vast storehouses of food, clothing, and tools to redistribute during famines or disasters. It was a command economy of extraordinary sophistication — exploitative by modern standards, but remarkably effective at feeding 12 million people in some of the world\'s most challenging terrain.',
  },
  {
    label: 'Decimal Administration — The Power of Ten',
    detail:
      'The Inca bureaucracy organized the entire population into a decimal hierarchy: groups of 10 households were overseen by a chunka kamayuq, 50 by a pichqa chunka kuraka, 100 by a pachaka kuraka, 500 by a pichqa pachaka kuraka, 1,000 by a waranqa kuraka, and 10,000 by a hunu kuraka. Above them stood the governors of the four suyus and the Sapa Inca himself. This system allowed efficient census-taking, labor mobilization, and tax collection across the entire empire. Every person was counted, categorized by age and ability, and assigned obligations accordingly. It was one of the most comprehensive systems of population management in the pre-modern world.',
  },
  {
    label: 'No Writing — But Total Record-Keeping',
    detail:
      'The Incas are the only known major civilization to have administered a vast empire without a writing system — at least not one we would recognize. Instead, they used quipus (khipus): collections of knotted strings that recorded numerical and possibly narrative information. Spanish chroniclers reported quipu specialists (quipucamayocs) who could "read" complex histories, genealogies, laws, and census data from these knotted cords. The Spanish systematically destroyed thousands of quipus during the conquest, considering them pagan. Of the roughly 900 surviving quipus, scholars can decode the numerical information, but whether they also encode language — and how — remains one of the great unsolved puzzles of the ancient world.',
  },
  {
    label: 'The Sapa Inca — Son of the Sun',
    detail:
      'The Sapa Inca was an absolute ruler believed to be the living descendant of the sun god Inti. He ate from gold plates, wore clothing that was worn once and then burned, and was carried on a gold litter so his feet never touched the ground. His primary wife (the coya) was typically his own full sister — divine blood could not be diluted. When a Sapa Inca died, his mummy was preserved and continued to "own" all his property and wealth, attended by a court of servants. The new Sapa Inca had to build his own palace and accumulate his own wealth from scratch — a system that incentivized expansion but also created dangerous succession crises, since there was no rule of primogeniture.',
  },
];

// ── Religion & Cosmology ───────────────────────────────────────────────────

const RELIGION_INSIGHTS: InsightEntry[] = [
  {
    label: 'Inti — The Sun God',
    detail:
      'Inti, the sun god, was the supreme deity of the Inca state religion and the divine ancestor of the Sapa Inca. The most important festival, Inti Raymi (Festival of the Sun), was held at the winter solstice (June in the Southern Hemisphere) and involved days of fasting, animal sacrifice, and elaborate rituals at the Qorikancha temple in Cusco, whose walls were covered in sheets of gold to reflect the sun. The Incas aligned many of their most important buildings — including Machu Picchu\'s Intihuatana stone — to solar movements during solstices and equinoxes. Inti Raymi is still celebrated today in Cusco, drawing tens of thousands of spectators every June 24.',
  },
  {
    label: 'Viracocha — The Creator',
    detail:
      'Viracocha was the creator god who, according to Inca mythology, emerged from Lake Titicaca and created the sun, moon, stars, and the first humans from stone. He wandered the earth as a beggar, teaching people civilization, then walked across the Pacific Ocean and disappeared, promising to return. Some scholars argue that Viracocha was primarily a deity of the Inca elite and intellectuals, while Inti was more widely worshipped. The legend of a fair-skinned creator god who would return from across the sea may — or may not — have influenced how some indigenous people initially perceived the arriving Spanish, though this narrative has been heavily debated and may reflect post-conquest rewriting of history.',
  },
  {
    label: 'Capacocha — Human Sacrifice',
    detail:
      'The Incas practiced capacocha: the ritual sacrifice of children, typically at times of crisis or to mark important events like the accession of a new Sapa Inca. Children selected for sacrifice — usually between 6 and 15 years old — were chosen for their physical perfection and often came from elite families, for whom it was considered a great honor. They were brought to Cusco for ceremonies, then taken to high mountain summits (some over 20,000 feet) where they were given chicha to drink, possibly coca leaves to chew, and then killed — by strangulation, a blow to the head, or exposure to the freezing cold. Several remarkably preserved frozen mummies of sacrificed children have been found on Andean peaks, including "Juanita," a teenage girl discovered on Mount Ampato in 1995.',
  },
  {
    label: 'The Living Dead — Mummified Ancestors as Political Actors',
    detail:
      'Inca royal mummies were not entombed and forgotten — they remained active political actors. Each deceased Sapa Inca\'s mummy was maintained by his panaca (royal lineage), who cared for the mummy, "fed" it, brought it to festivals, and consulted it on political matters through priestly intermediaries. Royal mummies attended public ceremonies, "visited" each other, and their panacas continued to control all the wealth the emperor had accumulated in life. This meant that Cusco was governed as much by the dead as by the living. The Spanish were horrified by this practice and systematically hunted down and destroyed the royal mummies, though a few survived or were hidden.',
  },
];

// ── Agriculture & Food ─────────────────────────────────────────────────────

const FOOD_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Potato — 3,000+ Varieties',
    detail:
      'The Incas and their predecessors domesticated the potato from wild species growing in the Andes highlands, developing over 3,000 distinct varieties adapted to different altitudes, soils, and climates — in every color from purple to yellow to red to white, in shapes from round to fingerling to knobby. Today the potato is the world\'s fourth-largest food crop, feeding billions of people on every continent. It transformed European agriculture after the Spanish brought it back in the 16th century: the potato\'s high caloric yield per acre fueled population growth that powered the Industrial Revolution. Ireland\'s dependence on it led to the devastating Great Famine of 1845–1852 when blight struck. A humble Andean tuber changed world history.',
  },
  {
    label: 'Chuño — Ancient Freeze-Drying',
    detail:
      'The Incas invented freeze-drying thousands of years before modern science. To make chuño, potatoes are left outside overnight at high altitude where they freeze solid, then thawed in the morning sun. This cycle is repeated for several days, with the potatoes periodically trampled underfoot to squeeze out moisture. The result is a lightweight, rock-hard product that can be stored for years — even decades — without spoiling. Chuño was the foundation of the Inca state\'s food security system: vast storehouses (qollqa) throughout the empire held millions of kilograms of chuño and other preserved foods, enabling the state to feed armies, support labor projects, and survive droughts and crop failures. The technology is still used in the Andes today.',
  },
  {
    label: 'Quinoa, Corn, and Coca',
    detail:
      'Beyond potatoes, the Incas cultivated an extraordinary range of crops across different ecological zones. Quinoa, a high-protein grain domesticated in the Andes 5,000 years ago, was so important that the Sapa Inca himself ceremonially planted the first seeds each season. Corn (maize), grown at lower altitudes, was primarily used to make chicha, the fermented corn beer central to Inca social and religious life — the state brewed enormous quantities for festivals and labor projects. Coca leaves were chewed to suppress hunger and altitude sickness and played a crucial role in religious ceremonies. The Incas also cultivated tomatoes, avocados, peanuts, sweet potatoes, and dozens of other crops, many of which would eventually transform cuisines worldwide.',
  },
  {
    label: 'Guinea Pigs, Llamas, and Alpacas',
    detail:
      'The Incas\' domestic animals were uniquely Andean. Guinea pigs (cuy) were raised in nearly every household and remain a staple food in the Andes today — roasted whole, they are considered a delicacy. Llamas served as pack animals, carrying loads of up to 30 kg along the empire\'s road system; they also provided meat, hides, and fuel (dried dung). Alpacas were bred primarily for their extraordinarily fine fiber — Inca weavers produced textiles of such quality that the Spanish compared them to silk. Alpaca fiber was so valued that Inca textiles functioned as a form of wealth more precious than gold. The Incas also domesticated ducks and raised dogs, though the Americas lacked the horses, cattle, sheep, goats, and pigs that transformed Old World civilizations.',
  },
];

// ── The Quipu ──────────────────────────────────────────────────────────────

const QUIPU_INSIGHTS: InsightEntry[] = [
  {
    label: 'How Quipus Work',
    detail:
      'A quipu consists of a main cord from which hang pendant strings, which may themselves have subsidiary strings. Information is encoded through the type and direction of knots, the color of the strings (over 50 distinct colors have been identified), the spacing between knots, and the way strings are attached to each other. For numerical data, the Incas used a base-10 positional system: single knots represented tens, hundreds, and thousands, while a specific "long knot" at the bottom of each string represented units. Some quipus are small enough to hold in one hand; others contain over 1,500 strings and are several meters across.',
  },
  {
    label: 'More Than Numbers?',
    detail:
      'Spanish chroniclers consistently reported that quipucamayocs (quipu specialists) could "read" histories, genealogies, legal codes, and even poetry from quipus — not just numerical census data. If true, this would make the quipu a true writing system, just one radically different from anything else in human history. Some modern researchers, including Gary Urton of Harvard, have proposed that the binary choices in quipu construction (spin direction, ply direction, knot direction, attachment method) could encode a form of language with 1,536 possible "signs" per string — more than enough for a writing system. The question remains hotly debated: with only about 900 surviving quipus and no "Rosetta Stone" to decode them, the quipu\'s full capabilities may never be known.',
  },
  {
    label: 'Quipu Destruction',
    detail:
      'The Spanish colonial administration systematically destroyed quipus, viewing them as instruments of pagan record-keeping and potential tools of resistance. In the 1580s, the Third Council of Lima explicitly ordered the destruction of all quipus. Spanish administrators replaced them with European-style paper records, and quipucamayocs were either forced to convert their knowledge to written form or simply lost their role. Of the untold thousands of quipus that once existed — every administrator in every province at every level maintained them — only about 900 survive today, most in museum collections. The destruction of the quipus was a cultural catastrophe comparable to the burning of the Library of Alexandria: an entire civilization\'s records, erased.',
  },
];

// ── Spanish Conquest ───────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  {
    year: '1527–1532',
    title: 'Civil War — The Empire Tears Itself Apart',
    description:
      'When Huayna Capac and his heir died of smallpox around 1527, a devastating civil war erupted between his sons: Huascar, based in Cusco, and Atahualpa, based in Quito. The war lasted five years, killed hundreds of thousands, and left the empire\'s military and political structure shattered. Atahualpa\'s forces won, but the victory was pyrrhic — the empire was exhausted, its armies depleted, its provinces restive, and its population already ravaged by European diseases racing ahead of European people. When Francisco Pizarro arrived on the coast in 1532, he walked into a civilization at its most vulnerable moment.',
    color: CRIMSON,
  },
  {
    year: 'November 16, 1532',
    title: 'The Ambush at Cajamarca — 168 Men vs. an Empire',
    description:
      'Francisco Pizarro, with just 168 soldiers, 62 horses, and a few small cannons, ambushed the Inca emperor Atahualpa in the plaza of Cajamarca. Atahualpa had arrived with an entourage of thousands, unarmed, confident that 168 strangers posed no threat to the ruler of 12 million people. After a brief exchange in which the Spanish friar Vicente de Valverde offered Atahualpa a Bible (which he threw to the ground, never having seen a book), Pizarro gave the signal. Hidden Spanish soldiers opened fire with arquebuses and cannons into the packed, unarmed crowd while cavalry charged from concealed positions. In two hours, an estimated 2,000–10,000 Inca were killed. Not a single Spaniard died. Atahualpa was captured alive.',
    color: TERRACOTTA,
  },
  {
    year: '1532–1533',
    title: 'The Ransom Room — Then Execution Anyway',
    description:
      'Atahualpa, held prisoner, offered to fill a room 22 feet long, 17 feet wide, and 8 feet high with gold, and twice with silver, in exchange for his freedom. Over the next months, gold and silver poured in from across the empire — sacred objects, temple decorations, art — all melted down into ingots. The ransom totaled an estimated 6 tons of gold and 12 tons of silver, worth hundreds of millions in today\'s currency. It was the largest ransom in history. Then Pizarro executed Atahualpa anyway on July 26, 1533, garrotting him after he agreed to be baptized (sparing him death by burning). The killing of a divine emperor — after he had honored his promise — shattered the moral legitimacy of the empire.',
    color: GOLD,
  },
  {
    year: '1533–1535',
    title: 'Smallpox — The Invisible Conqueror',
    description:
      'The real conqueror of the Inca Empire was not Pizarro but Variola major — the smallpox virus. European diseases, against which indigenous Americans had zero immunity, raced through the Americas faster than the Europeans themselves. Smallpox reached the Inca Empire around 1527, years before Pizarro arrived, killing Huayna Capac and triggering the civil war. Estimates suggest 50–90% of the indigenous population died from European diseases — smallpox, measles, typhus, influenza — within the first century of contact. The Incas faced the Spanish not as a healthy empire of 12 million but as a devastated, demoralized population that had already lost half its people to invisible killers they could not understand or fight.',
    color: PURPLE,
  },
  {
    year: '1536–1537',
    title: 'Manco Inca\'s Rebellion — The Empire Strikes Back',
    description:
      'Manco Inca, installed by the Spanish as a puppet emperor, turned against his masters in 1536 and launched a massive rebellion. An army of 100,000–200,000 Inca warriors besieged Cusco for months, nearly overwhelming the few hundred Spanish defenders. At the fortress of Sacsayhuamán, the battle was so desperate that the Inca commander Cahuide threw himself from the walls rather than be captured. The rebellion failed largely because the Incas could not sustain a long siege — their agricultural calendar demanded that soldiers return to plant crops — and because diseases continued to devastate the indigenous population. But Manco Inca escaped to the remote jungle fortress of Vilcabamba, where a rump Inca state would resist for another 36 years.',
    color: SUN_ORANGE,
  },
  {
    year: '1572',
    title: 'Fall of Vilcabamba — The Last Inca',
    description:
      'The Neo-Inca state at Vilcabamba, deep in the cloud forest east of Cusco, survived as the last independent remnant of Tawantinsuyu for four decades. Its last ruler, Tupac Amaru, was captured by a Spanish expedition in 1572 and brought to Cusco, where he was publicly beheaded in the main plaza before a crowd of thousands of weeping indigenous people. The execution of Tupac Amaru marked the definitive end of the Inca Empire — but not of Inca identity. His name would be taken by Tupac Amaru II, who led a massive indigenous rebellion in 1780, and later inspired revolutionaries from Latin America to the hip-hop stage.',
    color: CRIMSON,
  },
];

// ── Legacy ─────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Quechua — 10 Million Speakers',
    detail:
      'The Inca administrative language, Quechua, is the most widely spoken indigenous language in the Americas today, with approximately 10 million speakers across Peru, Bolivia, Ecuador, Colombia, and Argentina. It is an official language of Peru and Bolivia. Quechua words that have entered English include "condor," "llama," "puma," "quinoa," and "jerky" (from ch\'arki, dried meat). Despite centuries of colonial suppression, Quechua has survived as a living language — a testament to the depth of Inca cultural influence and the resilience of Andean communities. Today there is a growing movement to revitalize and preserve Quechua, including university programs, literature, and even Quechua-language films.',
  },
  {
    label: 'The Potato Feeds the World',
    detail:
      'The Inca potato may be the single most important legacy of Tawantinsuyu. Brought to Europe by the Spanish in the late 16th century, the potato eventually became the staple food of northern Europe — its high caloric yield per acre could feed more people than any grain crop. The potato fueled population growth that powered the Industrial Revolution in Britain and northern Europe. Today it is the world\'s fourth-largest food crop after corn, wheat, and rice, grown in over 125 countries. From French fries to vodka to gnocchi, the humble Andean tuber that Inca farmers developed in thousands of varieties now feeds billions. It is arguably the Incas\' greatest gift to humanity.',
  },
  {
    label: 'Machu Picchu — 1.5 Million Visitors Per Year',
    detail:
      'Machu Picchu, unknown to the outside world until 1911, is now one of the most visited archaeological sites on earth, drawing approximately 1.5 million visitors per year. Named a UNESCO World Heritage Site in 1983 and voted one of the New Seven Wonders of the World in 2007, it has become the symbol of Peru and of pre-Columbian America. The site generates hundreds of millions of dollars in tourism revenue. But success has brought threats: erosion from foot traffic, environmental pressure from the nearby town of Aguas Calientes, and debates over carrying capacity have led to visitor limits and ongoing conservation efforts. The site that the conquistadors never found is now being loved to death.',
  },
  {
    label: 'Living Heritage — Inca Traditions Today',
    detail:
      'Inca heritage is not just archaeological — it is alive. Millions of Andean communities maintain traditions rooted in Inca and pre-Inca practices: the rebuilding of the Q\'eswachaka grass bridge every June, the Inti Raymi sun festival celebrated in Cusco, traditional textile weaving techniques unchanged in centuries, and agricultural practices on terraces built by their ancestors. Andean cosmology — the reverence for Pachamama (Mother Earth), the apus (mountain spirits), and the reciprocal relationship between humans and nature — continues to shape indigenous worldviews. In recent decades, indigenous identity movements across the Andes have embraced Inca heritage as a source of pride and political power.',
  },
];

// ── Main Timeline ──────────────────────────────────────────────────────────

const MAIN_TIMELINE: TimelineEntry[] = [
  { year: 'c. 1200', title: 'Manco Capac founds the Kingdom of Cusco', description: 'The legendary first Sapa Inca establishes a small highland kingdom in the Cusco Valley.', color: GOLD },
  { year: '1438', title: 'Pachacuti transforms Cusco into an empire', description: 'After defeating the Chankas, Pachacuti launches the rapid expansion of Tawantinsuyu.', color: AMBER },
  { year: 'c. 1450', title: 'Machu Picchu constructed', description: 'Pachacuti builds his royal estate on a cloud-forest ridge at 7,972 feet.', color: GREEN },
  { year: '1471', title: 'Tupac Inca conquers the Chimú', description: 'The empire reaches its greatest territorial extent under Pachacuti\'s son.', color: TERRACOTTA },
  { year: '1493', title: 'Huayna Capac takes the throne', description: 'The last great Sapa Inca consolidates an empire of 12 million.', color: BLUE },
  { year: 'c. 1527', title: 'Smallpox devastates the empire', description: 'European diseases race ahead of Europeans, killing Huayna Capac and triggering civil war.', color: PURPLE },
  { year: '1532', title: 'Ambush at Cajamarca', description: 'Pizarro captures Atahualpa with 168 men, killing thousands of unarmed Inca.', color: CRIMSON },
  { year: '1533', title: 'Atahualpa executed', description: 'After filling a room with gold, the last independent Sapa Inca is killed.', color: ROSE },
  { year: '1536', title: 'Manco Inca\'s rebellion', description: 'A massive indigenous uprising nearly recaptures Cusco from the Spanish.', color: SUN_ORANGE },
  { year: '1572', title: 'Fall of Vilcabamba', description: 'The last Inca ruler, Tupac Amaru, is captured and executed. Tawantinsuyu ends.', color: STONE_GRAY },
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
            &larr; Back to Timeline
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
              background: `linear-gradient(135deg, ${GOLD}, ${TERRACOTTA})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Inca Empire — Tawantinsuyu, the Largest Empire in Pre-Columbian America (~1200–1572)
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
              They built 40,000 km of roads through the most brutal terrain on
              earth — more than the Roman Empire. They governed 12 million
              people without writing, without the wheel, without money. They
              domesticated the potato in 3,000 varieties and invented
              freeze-drying. Then 168 Spanish soldiers, smallpox, and a civil
              war brought it all down.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              Tawantinsuyu — "the four regions together" — stretched 2,500
              miles along the spine of the Andes, from Colombia to Chile. Its
              engineering rivaled Rome, its administration exceeded most
              European states of the era, and its agricultural innovations
              would eventually feed billions. This is the story of the empire
              the sun god built, and how it fell in a single afternoon at
              Cajamarca.
            </p>
          </motion.div>

          {/* Key stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginTop: 28,
            }}
          >
            {KEY_STATS.map((stat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  textAlign: 'center',
                  minWidth: 100,
                  flex: '1 1 auto',
                }}
              >
                <div
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: GOLD,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: SLATE, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="timeline"
          icon="📜"
          title="Timeline — From Manco Capac to the Fall of Vilcabamba"
          accentColor={GOLD}
          intro="The Inca Empire rose from a small highland kingdom to the largest state in the pre-Columbian Americas in less than a century — then collapsed even faster. Here is the arc of Tawantinsuyu, from mythic origins to Spanish conquest."
        >
          <TimelineCard entries={MAIN_TIMELINE} />
        </SectionWrapper>

        {/* ── Origins ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🏔️"
          title="Origins & The Cusco Kingdom (~1200 CE)"
          accentColor={EARTH_BROWN}
          intro="The Incas did not spring from nowhere. They emerged from a complex world of competing Andean civilizations, claiming divine origin to justify a dominion that began small and grew to encompass a continent."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Imperial Expansion ───────────────────────────────────────── */}
        <SectionWrapper
          id="expansion"
          icon="⚔️"
          title="Imperial Expansion (1438–1533)"
          accentColor={AMBER}
          intro="In less than a century, three extraordinary rulers — Pachacuti, Tupac Inca, and Huayna Capac — transformed a regional kingdom into the largest empire in the Western Hemisphere. Then disease and civil war undid it all."
        >
          <TimelineCard entries={EXPANSION_TIMELINE} />
        </SectionWrapper>

        {/* ── Tawantinsuyu at its Peak ─────────────────────────────────── */}
        <SectionWrapper
          id="peak"
          icon="🌄"
          title="Tawantinsuyu at its Peak"
          accentColor={BLUE}
          intro="At its height around 1520, the Inca Empire was a marvel of organization — 12 million subjects, four provinces, hundreds of ethnic groups, governed from a golden capital at 11,000 feet through a system of roads, storehouses, and knotted strings that held it all together."
        >
          <InsightGrid items={PEAK_INSIGHTS} />
        </SectionWrapper>

        {/* ── Engineering Marvels ──────────────────────────────────────── */}
        <SectionWrapper
          id="engineering"
          icon="🏗️"
          title="Engineering Marvels — Building Without the Wheel"
          accentColor={EMERALD}
          intro="Without iron tools, without the wheel, without draft animals, and without mortar, the Incas built structures that have survived 500 years of earthquakes, a road network longer than Rome's, and agricultural terraces still feeding people today. Their engineering achievements remain among the most remarkable in human history."
        >
          <InsightGrid items={ENGINEERING_INSIGHTS} />
        </SectionWrapper>

        {/* ── Government & Administration ──────────────────────────────── */}
        <SectionWrapper
          id="government"
          icon="📊"
          title="Government & Administration — Running an Empire Without Writing or Money"
          accentColor={INDIGO}
          intro="The Incas administered an empire of 12 million people without a writing system, without currency, and without markets. Instead they built one of the most sophisticated command economies in pre-modern history — a system of labor taxes, decimal bureaucracy, and knotted-string record-keeping that would not look out of place in a modern logistics operation."
        >
          <InsightGrid items={GOVERNMENT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Religion & Cosmology ─────────────────────────────────────── */}
        <SectionWrapper
          id="religion"
          icon="☀️"
          title="Religion & Cosmology — Children of the Sun"
          accentColor={SUN_ORANGE}
          intro="Inca religion was inseparable from Inca politics. The Sapa Inca was the living son of the sun god, and the empire's expansion was a divine mandate. Gold was the 'sweat of the sun,' silver the 'tears of the moon,' and the dead ruled alongside the living."
        >
          <InsightGrid items={RELIGION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Agriculture & Food ───────────────────────────────────────── */}
        <SectionWrapper
          id="food"
          icon="🥔"
          title="Agriculture & Food — Foods That Fed the World"
          accentColor={GREEN}
          intro="The Inca contribution to global food security is staggering. The potato alone — domesticated in 3,000+ varieties by Andean farmers — now feeds billions and is the world's fourth-largest crop. Add quinoa, freeze-drying technology, and terraced farming, and the Incas may have shaped modern agriculture more than any other pre-modern civilization."
        >
          <InsightGrid items={FOOD_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Quipu ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="quipu"
          icon="🪢"
          title="The Quipu — Knotted Strings That May Be Writing"
          accentColor={PURPLE}
          intro="The quipu is one of the most enigmatic artifacts in human history: a system of knotted, colored strings that recorded the data of an empire. We know they encoded numbers. They may have encoded language. The Spanish destroyed thousands of them. What was lost may never be recovered."
        >
          <InsightGrid items={QUIPU_INSIGHTS} />
        </SectionWrapper>

        {/* ── Spanish Conquest ─────────────────────────────────────────── */}
        <SectionWrapper
          id="conquest"
          icon="💀"
          title="The Spanish Conquest (1532–1572)"
          accentColor={CRIMSON}
          intro="How did 168 men conquer an empire of 12 million? The short answer: they didn't — not alone. Smallpox had already killed half the population and triggered a devastating civil war. Pizarro walked into a shattered empire, captured its divine ruler, and exploited the chaos. But the full story is more complex, more tragic, and more consequential than any simple narrative of European superiority."
        >
          <TimelineCard entries={CONQUEST_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌎"
          title="Legacy — The Empire Lives On"
          accentColor={TEAL}
          intro="Tawantinsuyu fell 500 years ago, but its legacy is everywhere: in the 10 million people who still speak Quechua, in the potato that feeds billions, in the terraces still farmed on Andean slopes, and in the 1.5 million tourists who climb to Machu Picchu every year. The Inca Empire is gone; its influence is not."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Related Deep-Dives CTA ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 56,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 14 }}>
            Continue Exploring
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/aztec-empire', label: 'Aztec Empire' },
              { to: '/age-of-exploration', label: 'Age of Exploration' },
              { to: '/ancient-india', label: 'Ancient India' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  backgroundColor: GOLD + '18',
                  border: `1px solid ${GOLD}44`,
                  borderRadius: 8,
                  color: '#f59e0b',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
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
            "These were not savages. These were people who built an empire that
            stretched from Colombia to Chile, who engineered roads through
            impossible terrain, who fed millions in the harshest landscape on
            earth. And they did it all without writing a single word."
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
