/**
 * MayaCivilizationPage — comprehensive deep-dive on the Maya civilization (~2000 BCE–present).
 *
 * Route: /maya-civilization
 *
 * Sections:
 *  1. Hero — headline, key stats bar
 *  2. Timeline — 2000 BCE to present
 *  3. Origins & Preclassic Period (2000 BCE–250 CE)
 *  4. Classic Period (250–900 CE)
 *  5. Maya Society — kings, nobles, farmers, ball game
 *  6. Architecture — pyramids, temples, observatories without metal tools
 *  7. Writing System — hieroglyphics, 800+ glyphs, codices
 *  8. Mathematics & Calendar — zero, Long Count, Haab, Tzolk'in, 2012 myth
 *  9. Astronomy — Venus cycle, solar eclipses, observatory alignments
 * 10. Religion & Cosmology — Popol Vuh, deities, sacrifice, Xibalba
 * 11. Trade Network — jade, cacao, obsidian, quetzal feathers
 * 12. The Classic Collapse (800–900 CE) — 4 leading theories
 * 13. Postclassic & Chichen Itza (900–1500 CE)
 * 14. Spanish Conquest (1527–1546)
 * 15. Maya Today — 6-7 million living Maya
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const JADE = '#10b981';
const JADE_DARK = '#047857';
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
const OBSIDIAN = '#1e293b';
const CACAO_BROWN = '#92400e';
const QUETZAL_GREEN = '#059669';
const TEMPLE_RED = '#dc2626';
const LIMESTONE = '#a8a29e';

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
  { value: '3,500+', label: 'years of civilization' },
  { value: '6–7M', label: 'Maya alive today' },
  { value: '2,000+', label: 'archaeological sites' },
  { value: '800+', label: 'hieroglyphic signs' },
  { value: '30+', label: 'living languages' },
  { value: '365', label: 'steps on El Castillo' },
];

// ── Main Timeline ──────────────────────────────────────────────────────────

const MAIN_TIMELINE: TimelineEntry[] = [
  { year: 'c. 2000 BCE', title: 'First settled villages', description: 'Early Maya communities form in the Pacific lowlands and highlands of present-day Guatemala and Belize, cultivating maize, beans, and squash.', color: JADE },
  { year: 'c. 1000 BCE', title: 'Rise of the Olmec influence', description: 'The Olmec civilization — often called Mesoamerica\'s "mother culture" — influences early Maya art, religion, and the concept of sacred kingship. Maya begin building their first monumental architecture.', color: JADE_DARK },
  { year: 'c. 600 BCE', title: 'El Mirador flourishes', description: 'El Mirador in the Petén jungle becomes one of the first great Maya cities, with the La Danta pyramid — one of the largest structures ever built in the ancient Americas, 230 feet tall.', color: EMERALD },
  { year: 'c. 100 CE', title: 'First Long Count dates', description: 'The earliest known Long Count calendar inscriptions appear, marking the Maya\'s unique system of tracking time from a mythological starting point of August 11, 3114 BCE.', color: TEAL },
  { year: '250 CE', title: 'Classic Period begins', description: 'The Maya enter their golden age. City-states flourish across the Yucatán, Petén, and Chiapas. Population grows to over 2 million. Monumental construction, writing, and astronomy reach their peak.', color: GOLD },
  { year: '378 CE', title: 'Teotihuacan intervention at Tikal', description: 'The distant superpower of Teotihuacan installs a new dynasty at Tikal, transforming Maya geopolitics. The event shows that Mesoamerica was deeply interconnected.', color: AMBER },
  { year: '615–683 CE', title: 'Reign of K\'inich Janaab Pakal (Palenque)', description: 'Pakal the Great rules Palenque for 68 years, commissioning the Temple of the Inscriptions and the most elaborate royal tomb in Maya history. His jade death mask is one of the most iconic artifacts of the ancient Americas.', color: JADE },
  { year: 'c. 700 CE', title: 'Peak of Classic Maya civilization', description: 'At least 40 major city-states compete for dominance. Tikal and Calakmul wage a Cold War-like rivalry. Population in the Maya lowlands reaches an estimated 5–10 million people.', color: GOLD },
  { year: '800–900 CE', title: 'The Classic Collapse', description: 'The great southern lowland cities are abandoned one by one. Construction ceases, stelae stop being erected, populations plummet by 90% in some areas. One of archaeology\'s greatest mysteries.', color: CRIMSON },
  { year: '987 CE', title: 'Chichen Itza rises', description: 'Chichen Itza becomes the dominant power in the northern Yucatán, blending Maya and Toltec styles. El Castillo — the iconic stepped pyramid with 365 steps — is built during this era.', color: TERRACOTTA },
  { year: '1441 CE', title: 'Fall of Mayapan', description: 'The last great Maya political capital collapses after an internal revolt. The Yucatán fragments into 16 competing statelets — the political landscape the Spanish will encounter.', color: LIMESTONE },
  { year: '1527–1546', title: 'Spanish conquest of the Yucatán', description: 'Unlike the Aztec and Inca empires, the Maya have no single capital to capture. Conquest takes 20 years of brutal fighting. Many Maya communities resist for decades longer.', color: CRIMSON },
  { year: '1562', title: 'Diego de Landa burns the codices', description: 'Bishop Diego de Landa orders the destruction of thousands of Maya manuscripts. Only four codices survive — an incalculable loss of knowledge. Ironically, de Landa later writes the most detailed colonial account of Maya culture.', color: TEMPLE_RED },
  { year: '1697', title: 'Fall of Nojpetén', description: 'The last independent Maya kingdom — the Itza of Nojpetén (modern Flores, Guatemala) — falls to the Spanish, 170 years after the conquest began. Maya resistance was the longest in the Americas.', color: ROSE },
  { year: '2012', title: 'The "end of the world" that wasn\'t', description: 'The Maya Long Count calendar completes its 13th b\'ak\'tun cycle on December 21, 2012. Despite apocalyptic hype, Maya scholars note that the calendar simply resets — like a car odometer rolling over. The ancient Maya would have celebrated, not panicked.', color: PURPLE },
  { year: 'Today', title: '6–7 million Maya people', description: 'The Maya are not a "lost" civilization. Six to seven million Maya people live in Guatemala, Mexico, Belize, Honduras, and El Salvador, speaking 30+ Mayan languages and maintaining cultural traditions stretching back millennia.', color: JADE },
];

// ── Origins & Preclassic ───────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Maize Revolution',
    detail:
      'Everything begins with maize. Around 2000 BCE, early Maya communities in the Pacific lowlands and highland Guatemala mastered the cultivation of corn, beans, and squash — the "Mesoamerican triad." Maize was more than food: it was cosmologically sacred. In the Popol Vuh, the gods created humanity from maize dough after failed attempts with mud and wood. The Maya literally believed they were people of corn.',
  },
  {
    label: 'El Mirador — A Forgotten Metropolis',
    detail:
      'Long before the Classic Period, the Preclassic city of El Mirador in Guatemala\'s Petén jungle was one of the largest cities in the ancient world. Its La Danta pyramid complex, at 230 feet tall, remains one of the most massive structures ever built in the Americas. The city had causeways, plazas, and elaborate stucco friezes — evidence that Maya civilization was sophisticated centuries before Tikal or Palenque existed. El Mirador collapsed around 150 CE, possibly due to environmental degradation, prefiguring the later Classic Collapse.',
  },
  {
    label: 'Kaminaljuyú — Highland Power',
    detail:
      'While lowland cities like El Mirador grabbed headlines, Kaminaljuyú in the Guatemala highlands (now buried under Guatemala City) was a major center of trade, obsidian production, and political power for over a thousand years. Its connections to the distant Mexican superpower Teotihuacan demonstrate that the Maya world was never isolated — it was plugged into continent-spanning trade networks from the very beginning.',
  },
  {
    label: 'The Olmec Connection',
    detail:
      'The Olmec civilization of Mexico\'s Gulf Coast (c. 1500–400 BCE) profoundly influenced early Maya development. Concepts like sacred kingship, the ceremonial ball game, the bar-and-dot number system, and possibly the Long Count calendar itself may have originated in or been transmitted through Olmec culture. The Maya took these ideas and developed them to heights the Olmec never reached, but the debt was real.',
  },
];

// ── Classic Period ─────────────────────────────────────────────────────────

const CLASSIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Tikal — Superpower of the Petén',
    detail:
      'Tikal, in modern Guatemala, was the Rome of the Maya world. At its peak (c. 700 CE), it may have housed 60,000–100,000 people. Its Temple IV rises 212 feet above the jungle floor — visible for miles. Tikal waged centuries of war with its great rival Calakmul, forming alliances, fighting proxy wars, and competing for the loyalties of smaller city-states in a geopolitical struggle that lasted 500 years.',
  },
  {
    label: 'Palenque — Art and Archaeology\'s Jewel',
    detail:
      'Palenque, in modern Chiapas, produced some of the finest Maya art and architecture. Its ruler Pakal the Great (615–683 CE) commissioned the Temple of the Inscriptions, which concealed his jade-masked burial chamber deep within the pyramid. The discovery of Pakal\'s tomb in 1952 was the Maya equivalent of finding Tutankhamun — it proved that Maya pyramids, like Egyptian ones, could serve as royal tombs.',
  },
  {
    label: 'Copán — The Athens of the Maya World',
    detail:
      'Copán in modern Honduras was renowned for its extraordinary sculptural tradition. Its Hieroglyphic Stairway — 63 steps inscribed with over 2,000 glyphs — is the longest Maya text ever discovered. Copán\'s scribes and sculptors were the most skilled in the Maya world, and the city\'s ornate stelae have provided scholars with invaluable historical records.',
  },
  {
    label: 'Calakmul — The Snake Kingdom',
    detail:
      'Calakmul, deep in the Campeche jungle, was Tikal\'s great rival. Ruled by the Kaan ("Snake") dynasty, Calakmul built a network of vassal states to encircle and isolate Tikal. In 562 CE, Calakmul\'s allies dealt Tikal a devastating military defeat, inaugurating a "hiatus" during which Tikal erected no new monuments for over a century. The rivalry between these two superpowers shaped Classic Maya politics the way the US-Soviet rivalry shaped the 20th century.',
  },
  {
    label: 'A World of City-States',
    detail:
      'The Maya never unified into a single empire. Instead, their political landscape resembled Classical Greece or Renaissance Italy: dozens of independent city-states (ajawlel), each ruled by a sacred king (k\'uhul ajaw), competing for territory, trade routes, and prestige. Alliances shifted constantly. This political fragmentation produced extraordinary cultural competition — and ultimately contributed to the civilization\'s vulnerability.',
  },
];

// ── Maya Society ───────────────────────────────────────────────────────────

const SOCIETY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The K\'uhul Ajaw — Divine Kings',
    detail:
      'At the top of Maya society sat the k\'uhul ajaw — the "holy lord." The king was a living bridge between the human world and the supernatural. He performed blood-letting rituals, piercing his tongue or genitals with stingray spines to offer blood to the gods. He led armies, commissioned monuments, and orchestrated the elaborate ceremonies that maintained cosmic order. Succession was patrilineal, but queens (ix kaloomte\') wielded significant power, and several women ruled as regent or in their own right.',
  },
  {
    label: 'Nobles, Scribes & Artists',
    detail:
      'Below the king stood the sajal (provincial lords), the ah k\'uhun (ritual specialists), and the literate elite. Maya scribes were among the most revered members of society — they were often younger sons of the royal family. They signed their work, making them among the earliest named artists in the Americas. The Maya word for scribe, aj tz\'ib, also meant "painter," reflecting the artistic nature of their hieroglyphic writing.',
  },
  {
    label: 'The Ball Game — Sport, Ritual, Politics',
    detail:
      'The Maya ball game (pitz) was played on I-shaped stone courts found in virtually every Maya city. Players used their hips, forearms, and knees to keep a heavy rubber ball in play. The game had deep cosmological significance — it reenacted mythological contests between the Hero Twins and the lords of the underworld (Xibalba). Captive warriors were sometimes forced to play rigged games before being sacrificed, but the game was also a genuine sport, enjoyed by commoners and elites alike.',
  },
  {
    label: 'Farmers & Common People',
    detail:
      'The vast majority of Maya were farmers who grew maize, beans, squash, and cacao using sophisticated techniques including raised fields, terracing, and slash-and-burn (milpa) agriculture. They paid tribute in labor and goods to their local lords. Archaeological evidence suggests that common Maya had rich ritual lives, maintained family shrines, and participated in community ceremonies. They were not passive subjects — population movements and withdrawal of labor were powerful forms of political protest.',
  },
];

// ── Architecture ───────────────────────────────────────────────────────────

const ARCHITECTURE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Stepped Pyramids — Stairways to the Sky',
    detail:
      'Maya pyramids were not tombs (usually) — they were temple platforms, meant to elevate sacred spaces closer to the heavens. Built of limestone rubble and faced with carved stone, they rose in steep, stepped tiers. The tallest, La Danta at El Mirador, reaches 230 feet. Temple IV at Tikal rises 212 feet. They were built entirely without metal tools, draft animals, or the wheel — an achievement that still astonishes engineers.',
  },
  {
    label: 'The Corbel Arch & Maya Engineering',
    detail:
      'The Maya never developed the true arch. Instead, they used the corbel (or "false") arch — stacking stones inward from both sides until they met at the top. This technique limited room sizes but created the distinctive narrow, high-ceilinged rooms found in Maya palaces and temples. Every stone was cut with stone tools and obsidian blades. The precision of Maya stonework, achieved without metal, remains one of the most impressive technical feats of the pre-industrial world.',
  },
  {
    label: 'Observatories & Astronomical Architecture',
    detail:
      'The Caracol at Chichen Itza is a round tower (unusual in Maya architecture) whose windows align with key positions of Venus on the horizon. The Temple of Kukulcan (El Castillo) creates a shadow-serpent illusion during the equinoxes. At Uxmal, the Governor\'s Palace aligns with the southernmost rising of Venus. Maya buildings were not just shelters — they were astronomical instruments built in stone.',
  },
  {
    label: 'Sacbeob — White Roads',
    detail:
      'The Maya built raised, plastered causeways called sacbeob ("white roads") connecting buildings within cities and linking cities to each other. The longest known sacbe runs 62 miles from Cobá to Yaxuná. Built of limestone rubble and covered in white plaster, these roads were visible at night by moonlight and served ceremonial, commercial, and military purposes. They were engineering marvels — some survive 1,200 years later.',
  },
];

// ── Writing System ─────────────────────────────────────────────────────────

const WRITING_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Only Fully Deciphered Pre-Columbian Script',
    detail:
      'Maya hieroglyphics are the most sophisticated writing system developed in the pre-Columbian Americas — and the only one that has been substantially deciphered. The script is logosyllabic: some signs represent whole words (logograms), others represent syllables. With over 800 known signs, it could express any thought that could be spoken. The decipherment, achieved gradually from the 1950s onward, was one of the great intellectual triumphs of the 20th century.',
  },
  {
    label: 'Yuri Knorosov — The Man Who Cracked the Code',
    detail:
      'A Russian linguist named Yuri Knorosov, working from a photograph of de Landa\'s alphabet in a Leningrad library during the Cold War, made the crucial breakthrough: he proved that Maya glyphs were phonetic, not purely symbolic. His 1952 paper was initially dismissed by Western scholars, particularly the influential J. Eric S. Thompson. But Knorosov was right, and his insight unlocked the Maya script. He never visited the Maya region in his lifetime.',
  },
  {
    label: 'The Four Surviving Codices',
    detail:
      'The Maya produced thousands of books (codices) made of bark paper coated with lime plaster and folded like screens. Bishop Diego de Landa burned virtually all of them in 1562. Only four codices survive: the Dresden, Madrid, Paris, and Grolier codices. The Dresden Codex contains astronomical tables of staggering accuracy — Venus cycle calculations correct to within 2 hours over 500 years. What was lost in the flames is incalculable.',
  },
  {
    label: 'Inscriptions Everywhere',
    detail:
      'The Maya inscribed texts on stelae (standing stones), altars, lintels, stairways, ceramics, jade, bone, and shell. These inscriptions record king lists, wars, alliances, astronomical events, and mythological narratives. The Hieroglyphic Stairway at Copán — 63 steps, 2,200+ glyphs — is the longest known Maya text. Reading these inscriptions has transformed our understanding of Maya history from anonymous ruins into a world of named kings, dated battles, and recorded dynastic politics.',
  },
];

// ── Mathematics & Calendar ─────────────────────────────────────────────────

const CALENDAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Invention of Zero',
    detail:
      'The Maya independently invented the concept of zero around the 4th century CE — one of only three civilizations to do so (along with India and Babylon). Maya zero was not just a placeholder; it was a full number used in calculations. Their base-20 (vigesimal) number system used only three symbols: a dot (1), a bar (5), and a shell glyph (0). This elegant system allowed them to perform complex astronomical calculations centuries before Europe adopted zero from the Arabs.',
  },
  {
    label: 'The Long Count Calendar',
    detail:
      'The Long Count was the Maya\'s grand system for tracking deep time. It counted days from a mythological creation date of August 11, 3114 BCE (in our calendar). The system used nested cycles: 1 k\'in (day), 20 k\'in = 1 winal, 18 winal = 1 tun (360 days), 20 tun = 1 k\'atun (7,200 days), 20 k\'atun = 1 b\'ak\'tun (144,000 days). It could express dates millions of years in the past or future. It was the most precise calendar system in the pre-modern world.',
  },
  {
    label: 'Haab\' & Tzolk\'in — Interlocking Cycles',
    detail:
      'The Maya used two interlocking calendars simultaneously. The Haab\' was a 365-day solar calendar (18 months of 20 days + 5 "unlucky" days). The Tzolk\'in was a 260-day sacred calendar used for divination, naming children, and scheduling rituals. Together, these two cycles produced the Calendar Round — a unique date combination that repeated every 52 years (18,980 days). For longer periods, they used the Long Count.',
  },
  {
    label: 'The 2012 "Apocalypse" — What Actually Happened',
    detail:
      'On December 21, 2012, the Maya Long Count completed its 13th b\'ak\'tun (a cycle of 5,125 years). Western pop culture interpreted this as a predicted apocalypse. Maya scholars — and modern Maya people — dismissed the idea entirely. The calendar simply reset, like a car odometer rolling over to zero. Ancient Maya inscriptions reference dates far beyond 2012. The "doomsday" was a Western invention that had nothing to do with actual Maya beliefs. The Maya themselves would have thrown a party.',
  },
];

// ── Astronomy ──────────────────────────────────────────────────────────────

const ASTRONOMY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Venus — The War Star',
    detail:
      'The Maya tracked Venus with obsessive precision. They calculated its synodic cycle at 584 days — the modern measurement is 583.92 days, an error of less than 0.02%. Venus was associated with warfare: Maya kings timed attacks and raids to coincide with the heliacal rising of Venus (its first appearance as the morning star). The Dresden Codex contains Venus tables covering 104 years with extraordinary accuracy.',
  },
  {
    label: 'Predicting Eclipses',
    detail:
      'Maya astronomers developed eclipse prediction tables preserved in the Dresden Codex. These tables could warn of possible solar eclipses within a 33-year window. While they couldn\'t pinpoint exact dates (they used warning periods rather than precise predictions), their system was remarkably sophisticated for a civilization without telescopes. Eclipse events were terrifying — the Maya word for eclipse literally means "the sun was eaten."',
  },
  {
    label: 'Naked-Eye Astronomy',
    detail:
      'Everything the Maya achieved in astronomy was done without telescopes, without metal instruments, and without glass lenses. They observed the sky through crossed sticks, narrow window slits in buildings, and long sighting tubes. They tracked the movements of the sun, moon, Venus, Mars, Jupiter, and Saturn. They calculated the lunar month at 29.53020 days — the modern value is 29.53059 days. Their precision was achieved through centuries of patient observation and meticulous record-keeping.',
  },
  {
    label: 'Architecture as Instrument',
    detail:
      'Maya buildings were oriented to astronomical events. At Chichen Itza, the pyramid of Kukulcan creates a serpent-shaped shadow during the spring and autumn equinoxes. The Caracol observatory has windows aligned with Venus\'s extreme positions. At Dzibilchaltun, sunlight passes through a doorway of the Temple of the Seven Dolls precisely at the equinoxes. Maya cities were cosmic maps — their layouts reflected the sky above.',
  },
];

// ── Religion & Cosmology ───────────────────────────────────────────────────

const RELIGION_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Popol Vuh — Creation Epic',
    detail:
      'The Popol Vuh, preserved by the K\'iche\' Maya of highland Guatemala, is one of the great creation epics of world literature. The gods first create humans from mud (they dissolve), then from wood (soulless, destroyed by flood), and finally from maize dough — which works. Woven into the creation narrative is the story of the Hero Twins, Hunahpu and Xbalanque, who defeat the lords of the underworld through cleverness and ball-playing. It is mythology, philosophy, and entertainment in one.',
  },
  {
    label: '166+ Deities — A Crowded Cosmos',
    detail:
      'The Maya pantheon included at least 166 named deities. The major gods included Itzamna (supreme creator), Chaac (rain god — critical for agriculture), K\'inich Ahau (sun god), Ix Chel (moon goddess, patron of weaving and medicine), and Kukulcan (the feathered serpent, shared with Aztec Quetzalcoatl). Many gods had multiple aspects — young/old, benevolent/malevolent — reflecting the Maya view that the cosmos was fundamentally dualistic.',
  },
  {
    label: 'Human Sacrifice — Real But Overstated',
    detail:
      'Yes, the Maya practiced human sacrifice — captive warriors, slaves, and occasionally children were offered to the gods. Hearts were extracted, heads were taken as trophies, and victims were thrown into cenotes (sacred sinkholes). But the scale was far smaller than Aztec sacrifice. Most Maya ritual involved autosacrifice — kings and nobles drawing their own blood with stingray spines and obsidian blades to feed the gods. Blood was the currency of the cosmos.',
  },
  {
    label: 'Xibalba — The Place of Fright',
    detail:
      'The Maya underworld, Xibalba ("Place of Fright"), was ruled by death gods who tested and tormented the souls of the dead. To reach the afterlife, the dead had to navigate rivers of blood, houses of cold and fire, and defeat the lords of Xibalba in contests — just as the Hero Twins had done in the Popol Vuh. Caves and cenotes were believed to be entrances to Xibalba, making them intensely sacred places for ritual activity.',
  },
];

// ── Trade Network ──────────────────────────────────────────────────────────

const TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Jade — More Precious Than Gold',
    detail:
      'To the Maya, jade was the most precious material in existence — far more valuable than gold. Green jade symbolized life, water, maize, and royalty. It was carved into masks, pendants, figurines, and offerings. The finest jade came from the Motagua Valley in Guatemala, and control of jade sources was a source of enormous political power. Pakal the Great was buried in a jade mosaic death mask that remains one of the most iconic artifacts of the ancient Americas.',
  },
  {
    label: 'Cacao — The Drink of Gods & Currency',
    detail:
      'Cacao beans served as both a luxury beverage and a form of currency. The Maya elite drank chocolate as a frothy, spiced drink — often mixed with chili peppers. Cacao was so valuable that beans were used as money: a rabbit cost about 10 beans, a slave about 100. The word "cacao" itself comes from the Maya language. When Europeans first encountered chocolate, it was a Maya invention already thousands of years old.',
  },
  {
    label: 'Obsidian — The Razor\'s Edge',
    detail:
      'Volcanic obsidian was the Maya\'s most important industrial material — sharper than modern surgical steel when properly knapped. Obsidian came from highland sources in Guatemala and Mexico, and its distribution networks have been mapped by archaeologists to trace trade routes across the Maya world. Obsidian blades were used for surgery, bloodletting rituals, weapon points, and everyday cutting tools. Control of obsidian trade routes was as strategically important as control of oil reserves today.',
  },
  {
    label: 'Quetzal Feathers & Long-Distance Trade',
    detail:
      'The iridescent green tail feathers of the quetzal bird were reserved for royalty — commoners who wore them could be executed. Salt from the Yucatán coast, cotton textiles, stingray spines, shark teeth, marine shells, and honey all moved through extensive trade networks. Maya traders (ppolom) traveled by canoe along the Caribbean coast and by foot along sacbe roads. Columbus encountered a Maya trading canoe in 1502 off the coast of Honduras — his first contact with a Mesoamerican civilization.',
  },
];

// ── Classic Collapse ───────────────────────────────────────────────────────

const COLLAPSE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Theory 1: Drought — When the Rains Failed',
    detail:
      'Climate scientists have found strong evidence of severe, prolonged droughts between 800 and 1000 CE — precisely when the collapse occurred. Lake sediment cores, cave stalagmites, and ocean sediment records all tell the same story: rainfall dropped dramatically for decades at a time. For a civilization dependent on rain-fed agriculture (the Maya had no irrigation systems in most lowland areas), a multi-decade drought would have been catastrophic. This is currently the leading theory.',
  },
  {
    label: 'Theory 2: Warfare — The Death Spiral',
    detail:
      'Archaeological evidence shows a dramatic increase in warfare during the 8th and 9th centuries. Fortifications appear at previously undefended cities. Burned buildings and smashed monuments become common. As resources dwindled (perhaps due to drought), competition between city-states may have intensified into a destructive cycle of raids, sackings, and population displacement that made recovery impossible.',
  },
  {
    label: 'Theory 3: Political Fragmentation',
    detail:
      'The Maya political system — dozens of independent, competing city-states — may have been its own undoing. When environmental stress hit, there was no central authority to coordinate a response. Instead, each city-state looked out for itself, leading to a tragedy of the commons. Sub-elites may have challenged royal authority as conditions worsened, further fragmenting political power precisely when coordination was most needed.',
  },
  {
    label: 'Theory 4: Environmental Degradation',
    detail:
      'By the Late Classic, the Maya lowlands were heavily deforested. Studies suggest that over 90% of the forest had been cleared for agriculture and construction. Deforestation would have increased soil erosion, reduced rainfall (forests generate their own rain through transpiration), and raised local temperatures. The Maya may have inadvertently altered their own climate — a sobering parallel with modern deforestation in the same region.',
  },
  {
    label: 'The Real Answer: All of the Above',
    detail:
      'Most scholars now believe the Classic Collapse was a "perfect storm" — multiple interacting factors that reinforced each other. Drought stressed the agricultural system. Warfare intensified as cities fought over dwindling resources. Political systems fragmented under the pressure. Environmental degradation made recovery harder. No single factor was sufficient, but together they were devastating. Importantly, the collapse was not instantaneous — it played out over 150 years, and not all areas were equally affected.',
  },
];

// ── Postclassic & Chichen Itza ─────────────────────────────────────────────

const POSTCLASSIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Chichen Itza — Where Maya Meets Toltec',
    detail:
      'Chichen Itza rose to prominence after the Classic Collapse, becoming the most powerful city in the northern Yucatán. Its architecture shows strong influence from central Mexico\'s Toltec civilization: the Temple of the Warriors mirrors Tula\'s Atlantean columns, and the chacmool sacrificial figures are Toltec in origin. Whether this represents conquest, trade, or cultural exchange remains debated. El Castillo — with its 365 steps, 91 per side plus the platform — is one of the New Seven Wonders of the World.',
  },
  {
    label: 'Uxmal & the Puuc Style',
    detail:
      'The Puuc hills of the western Yucatán produced some of the finest Maya architecture during the Terminal Classic and Early Postclassic periods. Uxmal\'s Governor\'s Palace is considered one of the most beautiful buildings in the pre-Columbian Americas. The Puuc style is characterized by elaborate stone mosaic facades, intricate geometric patterns, and Chaac (rain god) masks stacked at building corners — architecture of extraordinary refinement.',
  },
  {
    label: 'Mayapan — The Last Capital',
    detail:
      'After Chichen Itza declined around 1200 CE, Mayapan became the political center of the Yucatán, ruling through a confederacy of noble families (the Cocom and Xiu lineages). Mayapan was a walled city of about 12,000 people. Its architecture was deliberately designed to echo Chichen Itza — a political statement of continuity. Internal factional warfare led to its collapse around 1441 CE, fragmenting Maya political authority for the last time before the Spanish arrived.',
  },
  {
    label: 'Maritime Traders of the Coast',
    detail:
      'The Postclassic Maya developed sophisticated maritime trade networks along the Caribbean coast. Cities like Tulum — perched dramatically on cliffs above the sea — served as major trading ports. Large canoes carried goods including cacao, obsidian, jade, cotton, salt, and honey across the Caribbean. When Columbus encountered a Maya trading canoe off Honduras in 1502, he described it as being "as long as a galley" and carrying a diverse cargo of trade goods.',
  },
];

// ── Spanish Conquest ───────────────────────────────────────────────────────

const CONQUEST_TIMELINE: TimelineEntry[] = [
  { year: '1502', title: 'Columbus encounters the Maya', description: 'On his fourth voyage, Columbus meets a Maya trading canoe off the coast of Honduras. He doesn\'t realize he has encountered one of the great civilizations of the Americas. He sails on.', color: AMBER },
  { year: '1511', title: 'First Spanish survivors among the Maya', description: 'Shipwreck survivor Gonzalo Guerrero lives among the Maya for years, marries a Maya noblewoman, fathers mixed-heritage children, and eventually fights against the Spanish — one of history\'s most remarkable cultural defections.', color: TEAL },
  { year: '1527', title: 'First Spanish invasion fails', description: 'Francisco de Montejo attempts to conquer the Yucatán and is driven back by fierce Maya resistance. Unlike the rapid conquests of the Aztec and Inca empires, the Maya — with no single capital to capture — fight a decentralized guerrilla resistance.', color: CRIMSON },
  { year: '1531', title: 'Second invasion fails', description: 'Montejo tries again from the west coast. Again, Maya resistance stops him. Disease, jungle, and determined warriors make the Yucatán a nightmare for Spanish soldiers.', color: CRIMSON },
  { year: '1542', title: 'Founding of Mérida', description: 'Montejo\'s son (also Francisco) finally establishes a permanent Spanish capital at T\'ho, renaming it Mérida. He builds it using stones from dismantled Maya pyramids — a brutal act of cultural erasure written in architecture.', color: AMBER },
  { year: '1546', title: 'Great Maya Revolt', description: 'A massive coordinated uprising nearly succeeds in driving the Spanish out of the Yucatán. The revolt is eventually crushed, but pockets of resistance continue for over a century.', color: ROSE },
  { year: '1562', title: 'De Landa\'s auto-da-fé', description: 'Bishop Diego de Landa orders the burning of thousands of Maya manuscripts, statues, and religious objects in Maní. "We found a large number of books," he writes, "and as they contained nothing in which there were not to be seen superstition and lies of the devil, we burned them all." Only four codices survive.', color: TEMPLE_RED },
  { year: '1697', title: 'Fall of the last Maya kingdom', description: 'The Itza kingdom at Nojpetén (modern Flores, Guatemala) — the last independent Maya state — falls to Spanish forces. The Maya had resisted European conquest for 170 years, longer than any other indigenous American civilization.', color: CRIMSON },
];

// ── Maya Today ─────────────────────────────────────────────────────────────

const TODAY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Not a "Lost" Civilization',
    detail:
      'The single most important fact about the Maya is this: they are still here. Six to seven million Maya people live in Guatemala, Mexico, Belize, Honduras, and El Salvador. They speak 30+ distinct Mayan languages (Yucatec, K\'iche\', Mam, Tzeltal, Tzotzil, and many more). They maintain agricultural practices, ritual traditions, and community structures with deep pre-Columbian roots. Calling the Maya a "lost" or "vanished" civilization erases millions of living people.',
  },
  {
    label: 'Language & Identity',
    detail:
      'Mayan languages are spoken by millions of people daily. K\'iche\' Maya alone has over a million speakers. In Guatemala, where Maya make up roughly 40% of the population, Mayan languages have official status. Maya communities maintain distinct ethnic identities, traditional clothing (huipil), and cultural practices. The resilience of Maya language and identity through 500 years of colonialism is itself a remarkable story of survival.',
  },
  {
    label: 'Guatemala\'s Maya Majority',
    detail:
      'In Guatemala, Maya peoples constitute roughly 40% of the population — the highest proportion in any Central American country. This includes the K\'iche\', Kaqchikel, Mam, Q\'eqchi\', and many other groups. Maya Guatemalans have faced centuries of discrimination and, during the Guatemalan Civil War (1960–1996), systematic genocide. The 1999 UN truth commission documented that the Guatemalan military committed acts of genocide against Maya communities. The struggle for Maya rights continues today.',
  },
  {
    label: 'Archaeological Renaissance',
    detail:
      'New technologies are revolutionizing Maya archaeology. LiDAR surveys (using aerial laser scanning to see through jungle canopy) have revealed that the Maya lowlands were far more densely settled than anyone imagined — recent surveys found over 60,000 previously unknown structures in the Petén alone. The emerging picture is of a landscape as densely populated and heavily modified as pre-industrial Europe. The Maya world was not scattered cities in empty jungle — it was a managed, engineered landscape.',
  },
  {
    label: 'Rigoberta Menchú & Global Recognition',
    detail:
      'K\'iche\' Maya activist Rigoberta Menchú won the Nobel Peace Prize in 1992 for her work documenting the genocide against Maya peoples during Guatemala\'s civil war. Her testimony brought global attention to the ongoing struggles of indigenous Maya communities. Today, Maya rights organizations, language preservation programs, and cultural revitalization efforts are growing across the region — the Maya are not just surviving, they are asserting their place in the modern world.',
  },
];

// ── Sophisticated Achievements ─────────────────────────────────────────────

const ACHIEVEMENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Independent Invention of Zero',
    detail:
      'The Maya invented the concept of zero independently — around the 4th century CE, roughly the same time as India and long before Europe adopted it. Their shell-shaped zero symbol was a true number, not just a placeholder. Combined with their base-20 number system, it enabled astronomical calculations of extraordinary precision. The invention of zero is one of humanity\'s greatest intellectual achievements, and the Maya were one of only three civilizations to accomplish it.',
  },
  {
    label: 'Astronomical Precision Without Instruments',
    detail:
      'Without telescopes, without glass, without metal instruments, the Maya calculated the Venus cycle to within 0.02% accuracy, the lunar month to within 0.001% accuracy, and developed eclipse prediction tables spanning centuries. They did this through patient observation over generations, meticulous record-keeping, and mathematical sophistication. Their astronomical tables in the Dresden Codex remain accurate to this day.',
  },
  {
    label: 'Monumental Architecture Without Metal or Wheels',
    detail:
      'Every Maya pyramid, temple, palace, and causeway was built without metal tools, without the wheel, without draft animals, and without the true arch. La Danta at El Mirador (230 feet), Temple IV at Tikal (212 feet), and the great pyramids of Calakmul were all constructed using stone tools, human labor, and ingenious engineering. Some Maya structures have survived over 2,000 years of tropical weathering — a testament to their builders\' skill.',
  },
  {
    label: 'The Only Deciphered Pre-Columbian Script',
    detail:
      'Of all the writing systems developed in the pre-Columbian Americas, only Maya hieroglyphics have been substantially deciphered. The script could express any thought that could be spoken — a full writing system, not a limited notation. Its decipherment from the 1950s onward has transformed Maya studies from speculation into history, giving us named individuals, dated events, and complex narratives spanning a thousand years.',
  },
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

export default function MayaCivilizationPage() {
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
              background: `linear-gradient(135deg, ${JADE}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Maya Civilization — 3,500 Years of Genius in the Jungle (~2000 BCE–Present)
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
              They independently invented zero. They tracked Venus to within 0.02%
              accuracy — without telescopes. They built pyramids taller than
              anything in their hemisphere — without metal tools or wheels. They
              developed the only fully deciphered writing system in the
              pre-Columbian Americas. And they did it all in the jungle.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              The Maya civilization lasted over 3,500 years — longer than the
              Roman Empire, longer than China's Han dynasty, longer than any
              European state. And unlike those civilizations, the Maya are not
              gone. Six to seven million Maya people live in Central America
              today, speaking 30+ languages, maintaining traditions that stretch
              back millennia. This is the story of the longest-lived civilization
              in the Western Hemisphere — and why it matters now.
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
                    color: JADE,
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
          title="Timeline — From First Villages to the Living Maya"
          accentColor={JADE}
          intro="The Maya civilization spans over 3,500 years — from the first farming villages around 2000 BCE through the great Classic cities, the mysterious collapse, colonial conquest, and into the present day. No other pre-Columbian civilization endured so long."
        >
          <TimelineCard entries={MAIN_TIMELINE} />
        </SectionWrapper>

        {/* ── Origins & Preclassic ─────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🌽"
          title="Origins & Preclassic Period (2000 BCE–250 CE)"
          accentColor={EMERALD}
          intro="The Maya did not spring fully formed into the world. Their civilization grew from small farming villages over two millennia, building increasingly complex societies, monumental architecture, and sophisticated intellectual traditions long before the famous Classic Period began."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Classic Period ────────────────────────────────────────────── */}
        <SectionWrapper
          id="classic"
          icon="🏛️"
          title="Classic Period (250–900 CE) — The Golden Age"
          accentColor={GOLD}
          intro="The Classic Period was the Maya golden age — a 650-year explosion of art, architecture, writing, astronomy, and political complexity. At its peak around 700 CE, the Maya lowlands supported an estimated 5–10 million people in dozens of competing city-states, each ruled by a divine king, each building ever-grander monuments to outshine its rivals."
        >
          <InsightGrid items={CLASSIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Maya Society ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="society"
          icon="👑"
          title="Maya Society — Kings, Scribes & Ball Players"
          accentColor={PURPLE}
          intro="Maya society was rigidly hierarchical: divine kings at the top, slaves at the bottom, and a complex web of nobles, priests, warriors, scribes, merchants, artisans, and farmers in between. Yet it was also dynamic — warfare could topple dynasties, and the ball game blurred the lines between sport, ritual, and politics."
        >
          <InsightGrid items={SOCIETY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Architecture ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="architecture"
          icon="🏗️"
          title="Architecture — Pyramids Without Metal or Wheels"
          accentColor={LIMESTONE}
          intro="The Maya built some of the most impressive structures in the ancient world — and they did it without metal tools, without the wheel, without draft animals, and without the true arch. Every block was quarried, shaped, transported, and placed using stone tools and human muscle alone."
        >
          <InsightGrid items={ARCHITECTURE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Writing System ────────────────────────────────────────────── */}
        <SectionWrapper
          id="writing"
          icon="📝"
          title="Writing System — 800+ Glyphs, One Brilliant Script"
          accentColor={BLUE}
          intro="Maya hieroglyphics are the most sophisticated writing system developed in the pre-Columbian Americas — and the only one that has been substantially deciphered. Its decipherment is one of the great detective stories of modern scholarship."
        >
          <InsightGrid items={WRITING_INSIGHTS} />
        </SectionWrapper>

        {/* ── Mathematics & Calendar ────────────────────────────────────── */}
        <SectionWrapper
          id="calendar"
          icon="🔢"
          title="Mathematics & Calendar — They Invented Zero"
          accentColor={INDIGO}
          intro="The Maya independently invented zero, developed one of the most precise calendar systems in human history, and tracked time across millions of years. Their mathematical and calendrical achievements rank among the greatest intellectual accomplishments of the ancient world."
        >
          <InsightGrid items={CALENDAR_INSIGHTS} />
        </SectionWrapper>

        {/* ── Astronomy ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="astronomy"
          icon="🌟"
          title="Astronomy — Tracking the Cosmos with the Naked Eye"
          accentColor={SKY}
          intro="Maya astronomers achieved extraordinary precision without any of the instruments available to their European, Islamic, or Chinese counterparts. Everything they accomplished was done with patience, mathematics, and centuries of careful observation recorded in bark-paper codices."
        >
          <InsightGrid items={ASTRONOMY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Religion & Cosmology ──────────────────────────────────────── */}
        <SectionWrapper
          id="religion"
          icon="🐍"
          title="Religion & Cosmology — The Popol Vuh & 166+ Deities"
          accentColor={TERRACOTTA}
          intro="Maya religion was not separate from daily life — it was daily life. The cosmos was alive, the gods demanded feeding (with blood), and the boundary between the human world and the supernatural was as thin as a cave entrance or a mirror of obsidian."
        >
          <InsightGrid items={RELIGION_INSIGHTS} />
        </SectionWrapper>

        {/* ── Trade Network ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="trade"
          icon="💎"
          title="Trade Network — Jade, Cacao, Obsidian & Quetzal Feathers"
          accentColor={QUETZAL_GREEN}
          intro="The Maya world was connected by extensive trade networks spanning thousands of miles — from the highlands of Guatemala to the Caribbean coast, from central Mexico to Honduras. Exotic goods were the lifeblood of elite culture and political power."
        >
          <InsightGrid items={TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Classic Collapse ──────────────────────────────────────────── */}
        <SectionWrapper
          id="collapse"
          icon="💀"
          title="The Classic Collapse (800–900 CE) — Why Did the Great Cities Fall?"
          accentColor={CRIMSON}
          intro="Between 800 and 900 CE, the great Maya cities of the southern lowlands were abandoned. Populations crashed by 90% in some areas. Construction stopped, stelae stopped being erected, and the jungle reclaimed the pyramids. Why? Four leading theories — and the truth is probably all of them at once."
        >
          <InsightGrid items={COLLAPSE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Sophisticated Achievements Callout ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            margin: '20px 0 40px',
            backgroundColor: `${JADE}10`,
            border: `1px solid ${JADE}44`,
            borderRadius: 12,
            padding: '28px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: JADE, marginBottom: 16 }}>
            Sophisticated Achievements — What Makes the Maya Extraordinary
          </h3>
          <InsightGrid items={ACHIEVEMENT_INSIGHTS} />
        </motion.div>

        {/* ── Postclassic & Chichen Itza ────────────────────────────────── */}
        <SectionWrapper
          id="postclassic"
          icon="🐉"
          title="Postclassic & Chichen Itza (900–1500 CE)"
          accentColor={AMBER}
          intro="The Classic Collapse was not the end of the Maya — far from it. While the southern lowland cities fell silent, new power centers emerged in the northern Yucatán, blending Maya traditions with influences from central Mexico in a vibrant Postclassic culture."
        >
          <InsightGrid items={POSTCLASSIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Spanish Conquest ──────────────────────────────────────────── */}
        <SectionWrapper
          id="conquest"
          icon="⚔️"
          title="The Spanish Conquest (1527–1546) — 20 Years of Resistance"
          accentColor={CRIMSON}
          intro="The conquest of the Maya was nothing like the rapid fall of the Aztec or Inca empires. With no single capital to capture and no central ruler to seize, the Maya fought a prolonged, decentralized resistance that lasted decades — and in some areas, centuries."
        >
          <TimelineCard entries={CONQUEST_TIMELINE} />
        </SectionWrapper>

        {/* ── Maya Today ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="today"
          icon="🌎"
          title="Maya Today — 6–7 Million Strong"
          accentColor={JADE}
          intro="The Maya are not a 'lost' civilization. They are a living people — millions strong, speaking their own languages, maintaining their own traditions, and fighting for their rights in the modern world. The story of the Maya is not over. It is still being written."
        >
          <InsightGrid items={TODAY_INSIGHTS} />
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
              { to: '/inca-empire', label: 'Inca Empire' },
              { to: '/age-of-exploration', label: 'Age of Exploration' },
              { to: '/ancient-egypt', label: 'Ancient Egypt' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  backgroundColor: JADE + '18',
                  border: `1px solid ${JADE}44`,
                  borderRadius: 8,
                  color: JADE,
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
            "The Maya did not vanish. Their cities fell silent, but the people
            endured. Six million voices still speak in Mayan tongues. The
            civilization that invented zero, tracked Venus, and built pyramids
            in the jungle is not lost — it is alive."
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
