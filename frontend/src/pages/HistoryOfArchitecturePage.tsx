/**
 * HistoryOfArchitecturePage — comprehensive deep-dive on the history of architecture (9600 BCE–Present).
 *
 * Route: /history-of-architecture
 *
 * Sections:
 *  1. Hero — headline, overview of what buildings reveal about civilization
 *  2. Before Architecture — megaliths and monuments (10,000–3000 BCE)
 *  3. Ancient Architecture — Mesopotamia, Egypt, Indus Valley, China, Greece (3000–300 BCE)
 *  4. Roman Architecture — concrete, arch, vault, dome (300 BCE–400 CE)
 *  5. Byzantine Architecture — pendentive, Hagia Sophia (330–1453 CE)
 *  6. Islamic Architecture — arabesque, muqarnas, Taj Mahal (622–1800 CE)
 *  7. Gothic Cathedrals — flying buttresses and light (1000–1500 CE)
 *  8. Renaissance Architecture — Brunelleschi, Palladio (1400–1600)
 *  9. Industrial Revolution & Modern Architecture (1750–1930)
 * 10. 20th Century Architecture (1930–2000)
 * 11. Contemporary Architecture (2000–Present)
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const STONE = '#a8a29e';
const MARBLE = '#e7e5e4';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const SAND = '#d4a574';
const NAVY = '#1e3a5f';
const COPPER = '#b87333';
const TERRACOTTA = '#c2714f';

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

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: 'Göbekli Tepe (9600 BCE)',
    detail:
      'Oldest known religious building — predates writing, agriculture, and pottery by thousands of years.',
  },
  {
    label: 'Parthenon (432 BCE)',
    detail:
      'Standing for 2,457 years — survived as church, mosque, and powder magazine explosion (1687).',
  },
  {
    label: 'Pantheon Dome (128 CE)',
    detail:
      '43.3m diameter, still the world\'s largest unreinforced concrete dome after 1,900 years.',
  },
  {
    label: 'Hagia Sophia (537–1520)',
    detail:
      'Largest building in the world for ~1,000 years, until St. Peter\'s Basilica was completed.',
  },
  {
    label: 'Sagrada Família (1882–est. 2026)',
    detail:
      '144 years in construction; Gaudí\'s masterpiece is the most-visited site in Spain.',
  },
];

// ── Before Architecture: Megaliths ──────────────────────────────────────────

const MEGALITH_INSIGHTS: InsightEntry[] = [
  {
    label: 'Göbekli Tepe (9600 BCE, Turkey)',
    detail:
      'The world\'s oldest known temple complex — and it rewrites human history. Built by hunter-gatherers before agriculture, before pottery, before any known permanent settlement. Massive T-shaped limestone pillars (up to 5.5 meters tall, 10 tons each) carved with animal reliefs: foxes, lions, scorpions, vultures. The site was deliberately buried around 8000 BCE for reasons we don\'t understand. The key revelation: humans didn\'t settle down and then build temples. They built temples and then settled down. The spiritual impulse came first.',
  },
  {
    label: 'Stonehenge (~3000–1500 BCE)',
    detail:
      'How did Neolithic people transport 25-ton sarsen stones 25 miles and 4-ton bluestones 150 miles from Wales — without the wheel? Why did they arrange them to align precisely with the summer solstice sunrise and winter solstice sunset? After centuries of study, Stonehenge remains profoundly mysterious. It was likely a ritual site, possibly an astronomical observatory, certainly a place of communal gathering. What we know: it took over 1,500 years to build, required coordinated labor from hundreds of people, and its construction coincided with massive social changes across Neolithic Britain.',
  },
  {
    label: 'Megalith Builders Across the World',
    detail:
      'Stonehenge wasn\'t alone. Ħaġar Qim in Malta (3600 BCE) is older than the pyramids. The Carnac stones in Brittany, France, include over 3,000 standing stones arranged in rows stretching for miles. Easter Island\'s moai (1250–1500 CE) — nearly 1,000 carved stone figures weighing up to 82 tons — represent the same human impulse to build the monumental. From Newgrange in Ireland to the dolmens of Korea, cultures that never contacted each other independently developed the urge to move massive stones into meaningful arrangements.',
  },
  {
    label: 'The Key Insight',
    detail:
      'Humans built monuments before they built cities. The spiritual before the practical. Architecture\'s origin story isn\'t about shelter — it\'s about meaning. The earliest known permanent structures weren\'t homes or granaries but temples and ritual sites. This suggests that the drive to build — to impose human order on the landscape, to create places where the sacred could be experienced — is one of the deepest impulses in human civilization. Architecture begins not with the roof over your head, but with the desire to reach something beyond it.',
  },
];

// ── Ancient Architecture ────────────────────────────────────────────────────

const ANCIENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Mesopotamia: Ziggurats and the Ishtar Gate',
    detail:
      'The world\'s first cities — Ur, Uruk, Babylon — invented monumental architecture. Ziggurats were stepped pyramids of mud brick, rising 30+ meters as artificial mountains in the flat river plain, connecting earth to heaven. Babylon\'s Ishtar Gate (575 BCE) introduced glazed ceramic tile — brilliant blue walls decorated with golden bulls and dragons, creating an architecture of color unprecedented in the ancient world. The Hanging Gardens, if they existed, represent architecture as pure luxury — terraced gardens irrigated by mechanical systems, a building designed not for gods but for pleasure.',
  },
  {
    label: 'Egypt: The Pyramids at Giza',
    detail:
      'The Great Pyramid of Giza (2560 BCE) remains the largest stone structure ever built: 2.3 million blocks averaging 2.5 tons each, assembled with precision that modern engineers struggle to explain. The base is level to within 2.1 centimeters across 230 meters. Sides are aligned to true north within 3/60th of a degree. Built without iron tools, without the wheel, without pulleys — using copper chisels, wooden sledges, and organized human labor on a staggering scale. For 3,800 years, it was the tallest building on Earth. Egyptian architecture was architecture as immortality: stone monuments designed to last forever, and they nearly have.',
  },
  {
    label: 'Indus Valley: Mohenjo-daro — First Planned City',
    detail:
      'While Egypt was building pyramids, the Indus Valley civilization was building something arguably more revolutionary: planned cities. Mohenjo-daro (2500 BCE) had grid streets, standardized bricks (ratio 1:2:4 — the same as modern bricks), a sophisticated drainage system with covered sewers running beneath every street, and the Great Bath — a waterproofed pool that may be the world\'s earliest public water facility. No palaces, no grand temples — suggesting a society more focused on civic infrastructure than royal display. The city housed 40,000 people with better sanitation than most European cities would have 4,000 years later.',
  },
  {
    label: 'China: Timber Construction Across Millennia',
    detail:
      'While Western architecture evolved through stone, brick, and concrete, China developed an entirely different structural system: post-and-beam timber construction with interlocking brackets (dougong). This system, perfected over 3,000 years, could span large spaces, resist earthquakes through flexibility, and be assembled without nails. The Forbidden City (1420 CE) uses fundamentally the same structural principles as buildings from the Shang dynasty (1600 BCE). Chinese architecture achieved continuity of tradition unmatched anywhere else — the same structural logic spanning three millennia.',
  },
  {
    label: 'Greece: Democracy in Stone',
    detail:
      'The Greeks gave architecture its vocabulary: the three orders — Doric (simple, powerful), Ionic (elegant, with scroll capitals), and Corinthian (ornate, with acanthus leaves) — that would define Western building for 2,500 years. But the real revolution was political: Greek architecture expressed democracy through public spaces — the agora (marketplace), the theater, the stoa (covered walkway). The Parthenon (447–432 BCE) embodies mathematical perfection: no straight lines. Every column leans slightly inward, the floor curves upward at center, the columns swell slightly at the middle (entasis) — all to correct optical illusions and make the building appear perfectly straight. Architecture as applied mathematics.',
  },
];

// ── Roman Architecture ──────────────────────────────────────────────────────

const ROMAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Roman Concrete (Opus Caementicium)',
    detail:
      'Rome\'s secret weapon wasn\'t the legion — it was concrete. Roman concrete, made from volcanic ash (pozzolana), lime, and seawater, was stronger than anything the world would see for 1,800 years. Unlike modern Portland cement, which degrades in saltwater, Roman marine concrete actually gets stronger over time — seawater triggers crystal growth that fills cracks. This single material innovation made possible the arch, the vault, the dome, and the aqueduct. Rome didn\'t just build bigger — it built with a material that made entirely new architectural forms possible.',
  },
  {
    label: 'The Arch: The Shape That Changed Everything',
    detail:
      'Before the arch, builders were limited by the lintel — a horizontal beam spanning two supports. Lintels crack under their own weight beyond about 5 meters. The arch transfers weight along its curve to the supports, allowing spans far larger than any lintel. The Romans didn\'t invent the arch (the Etruscans and Mesopotamians used it earlier), but they perfected it and used it everywhere: bridges, aqueducts, triumphal monuments, the Colosseum. The arch became Rome\'s signature — and the structural basis for everything from Gothic cathedrals to modern bridges.',
  },
  {
    label: 'The Pantheon (118–128 CE)',
    detail:
      'The Pantheon is arguably the most important building in architectural history. Its dome — 43.3 meters in diameter — is still the world\'s largest unreinforced concrete dome after nearly 2,000 years. The oculus, a 9-meter open hole at the dome\'s apex, is the only light source, creating a slowly rotating beam of sunlight that tracks across the interior like a cosmic clock. The dome\'s weight decreases toward the top (heavier aggregate at the base, lighter pumice near the oculus), and coffered panels reduce mass while adding visual depth. Emperor Hadrian\'s architects solved structural problems that wouldn\'t be fully understood mathematically until the 20th century.',
  },
  {
    label: 'The Colosseum (80 CE)',
    detail:
      'Fifty thousand spectators, 80 entrances, a retractable canvas awning (the velarium) operated by a team of sailors, underground chambers with mechanical elevators to lift animals and gladiators into the arena, and a flooding system for mock naval battles. The Colosseum was a masterwork of crowd management and structural engineering: each of its four stories uses a different architectural order (Doric, Ionic, Corinthian, Composite), and the numbered entrance system (spectators held tickets matching specific gates) was so efficient that the entire building could empty in minutes. Modern stadium design still follows its basic principles.',
  },
  {
    label: 'Aqueducts: Engineering That Made Cities Possible',
    detail:
      'Rome\'s aqueduct system carried 1 million cubic meters of water per day over distances of 60+ miles, using gravity alone — no pumps. The Pont du Gard in France (19 BCE) stands 49 meters tall and drops only 2.5 centimeters per kilometer of channel, a gradient so precise it required surveying accuracy of fractions of a degree. Eleven aqueducts fed Rome, supplying public baths, fountains, private houses, and the city\'s famous sewers. Without the aqueduct, Rome could not have supported a million inhabitants. Infrastructure made the empire.',
  },
  {
    label: 'Roman City Planning',
    detail:
      'Every Roman city followed the same template: a grid of streets oriented to cardinal directions, crossed by two main roads (cardo and decumanus), centered on a forum (public square) with a basilica (law court), thermae (public baths), and temples. This standardized urban plan — replicated from Britain to North Africa to Syria — was architecture as imperial power: wherever Rome went, the same civic infrastructure followed. The Roman model of urban planning — public spaces, infrastructure, systematic layout — directly influenced every Western city that came after.',
  },
];

// ── Byzantine Architecture ──────────────────────────────────────────────────

const BYZANTINE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Pendentive: Engineering Revelation',
    detail:
      'How do you place a circular dome on a square base? The pendentive — a curved triangular section of masonry that transitions from the square walls to the circular dome above — solved this problem and revolutionized church design. Before the pendentive, domes could only sit on circular bases (like the Pantheon). After it, architects could crown any rectangular space with a dome. This seemingly simple geometric innovation opened up vast new possibilities for interior space, allowing buildings to combine the grandeur of the dome with the practicality of rectangular floor plans.',
  },
  {
    label: 'Hagia Sophia (537 CE, Istanbul)',
    detail:
      'Emperor Justinian\'s architects Anthemius and Isidorus built the largest enclosed space in the world — and it remained so for nearly 1,000 years (537–1520 CE). The central dome, 31 meters in diameter and 55 meters above the floor, appears to float on a ring of 40 windows that flood the interior with light, dissolving the boundary between structure and sky. The dome partially collapsed in 558 from earthquakes and was rebuilt higher. Originally a Christian cathedral, it became a mosque after the Ottoman conquest of Constantinople in 1453, and is now a mosque again (since 2020). Its influence radiates through both Christian and Islamic architecture.',
  },
  {
    label: 'Mosaic Decoration: Architecture of Light',
    detail:
      'Byzantine builders covered every interior surface with gold-ground mosaics — millions of tiny tesserae (glass tiles) set at slightly varying angles so they caught light differently, creating a shimmering, otherworldly effect. The gold background wasn\'t decorative — it was theological: it represented divine light, transforming the church interior into a vision of heaven. At Ravenna\'s San Vitale (547 CE), the mosaics of Emperor Justinian and Empress Theodora hover on walls of gold, their feet barely touching the ground. The building itself became an argument for the divine nature of imperial power. Architecture as theology.',
  },
];

// ── Islamic Architecture ────────────────────────────────────────────────────

const ISLAMIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Key Elements: Geometry as Devotion',
    detail:
      'Islamic architecture developed a visual language unlike any other tradition: the arabesque (infinitely repeating geometric patterns symbolizing God\'s infinite nature), muqarnas (stalactite-like vaulting built from hundreds of small niches), minarets (towers for the call to prayer), and the courtyard (a meditative transition between the profane world outside and the sacred space within). Because Islamic tradition discouraged figurative imagery in religious contexts, architecture became the primary art — geometry, calligraphy, and light replaced statues and paintings as the means of expressing the divine.',
  },
  {
    label: 'Great Mosque of Cordoba (784 CE)',
    detail:
      'A forest of 856 columns with red-and-white double arches — one of the most hypnotic interior spaces ever created. The columns, repurposed from Roman and Visigothic buildings, support two tiers of arches that create an effect of infinite repetition in every direction. Walking through the mosque, the columns multiply and shift as your perspective changes, creating a meditative disorientation — you lose track of where you are, which was exactly the point. When Cordoba fell to Christian forces in 1236, a cathedral was built inside the mosque. Charles V later said: "You have destroyed something unique to build something commonplace."',
  },
  {
    label: 'Alhambra (Granada, 1238–1358)',
    detail:
      'The Alhambra represents the summit of Islamic palace architecture. Every surface is covered with intricate carved stucco, ceramic tile, and Arabic inscriptions — including poems praising the building itself. Water is used as an architectural element: channels, fountains, and reflecting pools create symmetry, sound, and light effects. The Court of the Lions features muqarnas (stalactite) ceilings so complex they appear to dissolve the ceiling into crystallized air. The Alhambra proves that architecture doesn\'t need mass to achieve grandeur — delicacy, pattern, and the play of light and water can create spaces of transcendent beauty.',
  },
  {
    label: 'Taj Mahal (1653, Agra)',
    detail:
      'The perfection of Mughal architecture — and possibly the most beautiful building on Earth. Emperor Shah Jahan built it as a mausoleum for his wife Mumtaz Mahal, who died in childbirth. The building achieves its effect through absolute symmetry, white marble that changes color with the light (pink at dawn, white at noon, golden at sunset), and the reflecting pool that doubles the image. The minarets lean slightly outward so they would fall away from the tomb in an earthquake. Twenty thousand workers labored for 22 years. The Taj Mahal represents architecture as pure emotion: a building born from grief, expressing love through geometry.',
  },
  {
    label: 'The Dome\'s Journey',
    detail:
      'Follow the dome and you trace the connections between civilizations. Rome builds the Pantheon\'s concrete dome (128 CE). Byzantium places the dome on a square base at Hagia Sophia (537 CE). Islam adopts and refines the dome for mosques across the Middle East and Central Asia. When Brunelleschi solves the dome problem at Florence Cathedral (1436), he\'s studying Roman and possibly Islamic precedents. Michelangelo\'s St. Peter\'s (1590) echoes the Pantheon directly. The dome travels from pagan Rome through Christian Byzantium, through Islamic civilization, and back to Renaissance Rome — a 1,400-year architectural conversation across religions and empires.',
  },
];

// ── Gothic Cathedrals ───────────────────────────────────────────────────────

const GOTHIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Romanesque (1000–1200): The Heavy Ancestor',
    detail:
      'Before Gothic came Romanesque: thick stone walls, small windows, barrel vaults, massive piers — churches that felt like fortresses. They were beautiful in their solidity, but the architecture had a fundamental limitation: thick walls were needed to support the heavy stone roof, which meant windows had to be small, which meant interiors were dark. The weight of stone pushed outward as well as downward, and the only solution was to make the walls even thicker. Romanesque architecture was trapped by physics — until someone figured out how to cheat.',
  },
  {
    label: 'The Gothic Revolution: Three Innovations',
    detail:
      'Gothic architecture is the result of three innovations working together: the pointed arch (which directs weight more vertically than a round arch), the ribbed vault (which concentrates the roof\'s weight along specific lines rather than across the entire wall), and the flying buttress (an external support that absorbs the lateral thrust from the roof). Together, these three elements solved the Romanesque problem: walls no longer needed to be thick because the buttresses handled the outward push. Walls could be thin. Thin walls could be opened up. Opened walls could be filled with glass. Glass could be filled with stories told in light. The Gothic cathedral is, at its core, a structural engineering solution that happened to create one of history\'s most transcendent art forms.',
  },
  {
    label: 'Notre Dame de Paris (1163)',
    detail:
      'Notre Dame established the template for Gothic cathedral architecture: the west front with twin towers and rose window, the nave with pointed arches and ribbed vaults, the flying buttresses that made it all possible. It took nearly 200 years to complete (1163–1345), and its builders invented solutions as they went — the flying buttresses were actually added later when the original walls began to buckle under the vault\'s thrust. The 2019 fire that destroyed the spire and roof shocked the world, but the stone vault held — the medieval builders\' structural engineering saving their creation 850 years later.',
  },
  {
    label: 'Chartres Cathedral (1220): Stories in Glass',
    detail:
      'Chartres preserves 173 original stained glass windows from the 13th century — 2,600 square meters of medieval glass, the largest surviving collection in the world. In an era when most people couldn\'t read, these windows were the primary medium for teaching biblical stories, saints\' lives, and moral lessons. The famous "Chartres blue" — a deep, luminous blue glass whose exact recipe has never been replicated — gives the interior an unearthly quality. The windows were funded by guilds, nobles, and the royal family, each window recording its donors: bakers, furriers, water carriers. Architecture as communal storytelling.',
  },
  {
    label: 'Cologne Cathedral: 632 Years',
    detail:
      'Begun in 1248, not finished until 1880 — the longest construction project in European cathedral history. The original medieval builders completed the choir by 1322 but ran out of money. The massive crane on the unfinished south tower stood for 400 years as a symbol of the abandoned project. In the 19th century, a wave of Romantic nationalism revived the project: the original medieval plans were discovered, and Prussian engineers completed the building using both medieval techniques and modern iron construction. When finished, it was briefly the tallest building in the world (157 meters). It survived 14 bombing raids in World War II.',
  },
  {
    label: 'The Physics of Flying Buttresses',
    detail:
      'A Gothic vault pushes outward as well as downward — this lateral thrust is the fundamental challenge of stone construction. A flying buttress is an arched external support that transfers the vault\'s outward thrust over the side aisles to a heavy pier beyond. The pier\'s weight (often increased with a pinnacle on top) pushes straight down, converting the diagonal force into a vertical one that the ground can absorb. This means the main walls between buttresses carry almost no structural load — they can be replaced entirely with stained glass. The flying buttress turned walls from structure into screen, and that transformation turned darkness into light.',
  },
];

// ── Renaissance Architecture ────────────────────────────────────────────────

const RENAISSANCE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Return to Classical Rome',
    detail:
      'The Renaissance in architecture began when Filippo Brunelleschi traveled to Rome around 1402 and spent years measuring and sketching ancient ruins — the Pantheon, the Colosseum, the baths of Diocletian. He returned to Florence with a radical idea: architecture should return to the principles of classical Rome — columns, domes, symmetry, mathematical proportion — and abandon the Gothic style that had dominated for 300 years. This wasn\'t mere nostalgia. Renaissance architects saw classical buildings as embodying universal mathematical truths: harmony, balance, the relationship between part and whole. Architecture became an intellectual discipline, not just a craft.',
  },
  {
    label: 'Brunelleschi\'s Florence Cathedral Dome (1436)',
    detail:
      'The greatest engineering challenge of the 15th century: how to build a dome 45 meters wide over an existing octagonal drum, without the scaffolding that Roman builders had used (the span was too wide for any wooden structure). Brunelleschi\'s solution was revolutionary: a double-shell dome with herringbone brickwork, where the inner shell supports the outer during construction. He invented new hoisting machines, designed a system where each ring of bricks was self-supporting, and managed 30,000 laborers over 16 years. The dome defined the Florence skyline and proved that modern builders could rival — and surpass — ancient Rome.',
  },
  {
    label: 'Leon Battista Alberti: Architecture as Theory',
    detail:
      'Before Alberti, architecture was learned through apprenticeship — master to student, on the building site. Alberti wrote "De re aedificatoria" (1452), the first comprehensive architectural treatise since the Roman Vitruvius. He argued that architecture was a liberal art, governed by mathematical principles of harmony and proportion derived from nature. The architect was not a craftsman but an intellectual — a designer whose primary tool was the mind, not the trowel. Alberti\'s books transformed architecture from a trade into a profession and established the theoretical foundation for everything that followed.',
  },
  {
    label: 'Michelangelo: St. Peter\'s Basilica Dome',
    detail:
      'Michelangelo was 71 when he took over the design of St. Peter\'s Basilica in Rome (1547). His dome — 42 meters in diameter, rising 136 meters from the ground — was designed as a conscious echo of the Pantheon but reaching upward rather than enclosing inward. He used a double-shell construction (following Brunelleschi) with 16 ribs that channel forces to paired columns below. Michelangelo died in 1564 before the dome was completed (it was finished in 1590 by Giacomo della Porta). The dome of St. Peter\'s became the most influential building form in Western architecture, inspiring the U.S. Capitol, St. Paul\'s Cathedral in London, and hundreds of churches worldwide.',
  },
  {
    label: 'Andrea Palladio: Architecture for Everyone (With Money)',
    detail:
      'Palladio\'s genius was making classical architecture domestic. His villas in the Veneto region — the Villa Rotonda (1567) being the most famous — translated the temple front, symmetrical plan, and mathematical proportions of Roman public buildings into private homes. His "Four Books of Architecture" (1570) became the most influential architectural book ever published, spreading his ideas across Europe and the Americas. Palladio\'s influence is everywhere: the White House, the U.S. Capitol, Monticello, English country houses, and virtually every building with a columned portico. He democratized classical grandeur — or at least made it available to the landed gentry.',
  },
];

// ── Industrial Revolution & Modern Architecture ─────────────────────────────

const INDUSTRIAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1779',
    title: 'Iron Bridge, Coalbrookdale',
    description:
      'The world\'s first major bridge made entirely of cast iron — spanning 30 meters over the River Severn in Shropshire, England. It proved that iron could be a primary structural material, not just decorative hardware. The bridge used techniques borrowed from carpentry (the iron pieces were joined like timber), but it announced a new era: architecture was no longer limited to stone, brick, and wood. The material that would transform cities had arrived.',
    color: COPPER,
  },
  {
    year: '1851',
    title: 'Crystal Palace, London',
    description:
      'Joseph Paxton\'s Crystal Palace — built for the Great Exhibition — was the most revolutionary building of the 19th century. Constructed entirely from prefabricated iron and glass panels, it covered 19 acres and was assembled in just 9 months. When the Exhibition ended, it was disassembled and moved to another site. The Crystal Palace proved that buildings could be mass-produced, assembled from standardized parts, and even portable. It was the death warrant for solid masonry as the only way to build large structures.',
    color: SKY,
  },
  {
    year: '1885',
    title: 'The Skyscraper Is Born — Chicago',
    description:
      'The Home Insurance Building in Chicago (1885, William Le Baron Jenney) is generally considered the first skyscraper: a steel skeleton supporting the walls, rather than walls supporting themselves. This single innovation — the steel frame — removed all height limits. Walls became curtains hung on a frame rather than load-bearing structures. Daniel Burnham, Louis Sullivan, and the Chicago School developed the skyscraper as an architectural type. Chicago, rebuilt after the 1871 fire, became the laboratory where modern architecture was invented.',
    color: STEEL,
  },
  {
    year: '1890–1910',
    title: 'Art Nouveau: Organic Revolution',
    description:
      'A brief but brilliant movement that rejected industrial standardization in favor of organic, flowing forms inspired by nature — whiplash curves, floral motifs, asymmetry. Victor Horta in Brussels, Hector Guimard in Paris (the iconic Métro entrances), and above all Antoni Gaudí in Barcelona, whose Sagrada Família (begun 1882, still unfinished as of 2026) represents the most extreme expression of architecture as organic sculpture. Gaudí used catenary arches (the shape a chain makes hanging under gravity, inverted), hyperbolic paraboloids, and forms derived from trees and bones. No straight lines, no right angles — nature as structural model.',
    color: GREEN,
  },
  {
    year: '1919–1933',
    title: 'Bauhaus: Art Meets Industry',
    description:
      'Walter Gropius founded the Bauhaus school in Weimar, Germany, with a radical mission: merge art, craft, and industrial production. The Bauhaus taught that form follows function, ornament is unnecessary, and good design should be available to everyone through mass production. Clean lines, flat roofs, glass walls, steel and concrete — the Bauhaus aesthetic became the foundation of modern architecture. The school moved to Dessau (Gropius\'s 1925 building is an icon) and then Berlin before the Nazis closed it in 1933. Its teachers — Gropius, Mies van der Rohe, Marcel Breuer — fled to the United States, where they reshaped American architecture.',
    color: INDIGO,
  },
  {
    year: '1890s',
    title: 'Sullivan: "Form Follows Function"',
    description:
      'Louis Sullivan — the "father of the skyscraper" — articulated the first modernist manifesto: the shape of a building should express its purpose. A tall office building should look tall, not pretend to be a Renaissance palace. Sullivan\'s buildings in Chicago (the Carson Pirie Scott store, the Guaranty Building in Buffalo) demonstrated that modern materials and modern purposes demanded modern forms. His most famous student, Frank Lloyd Wright, would take this principle in directions Sullivan never imagined.',
    color: AMBER,
  },
];

// ── 20th Century Architecture ───────────────────────────────────────────────

const TWENTIETH_CENTURY_INSIGHTS: InsightEntry[] = [
  {
    label: 'International Style: The Glass Box',
    detail:
      'Le Corbusier declared "a house is a machine for living in," and the International Style took him at his word. Steel frame, glass curtain wall, flat roof, no ornament, open floor plan — the same building could stand in New York, São Paulo, or Tokyo. Mies van der Rohe\'s "less is more" became the dominant aesthetic. His Seagram Building (1958, New York) — a bronze-and-glass tower set back from the street on a granite plaza — became the template for a million corporate headquarters. The style was elegant, rational, and eventually monotonous: city after city filled with identical glass boxes.',
  },
  {
    label: 'Frank Lloyd Wright: Architecture as Nature',
    detail:
      'Wright rejected both classical revival and the glass box. His "organic architecture" sought to integrate buildings with their natural settings. Fallingwater (1937, Pennsylvania) — a house cantilevered over a waterfall — is the most famous private residence in America, a building that appears to grow from its landscape. The Guggenheim Museum (1959, New York) replaced the conventional gallery with a continuous spiral ramp, making the building itself the primary experience. Wright designed over 1,000 buildings across seven decades, pursuing a vision of architecture as an extension of the natural world rather than an imposition upon it.',
  },
  {
    label: 'Mid-Century Modern (1945–1970)',
    detail:
      'Post-war optimism produced an architecture of openness: clean lines, large windows, flat or low-pitched roofs, open floor plans, and a deliberate connection between interior and exterior spaces. The Case Study Houses program in Los Angeles (1945–1966) commissioned architects like Charles and Ray Eames, Richard Neutra, and Pierre Koenig to design affordable modern homes. The result was some of the most iconic residential architecture of the century — particularly Koenig\'s Case Study House #22 (1960), photographed by Julius Shulman with two women in a glass-walled living room suspended above the glittering Los Angeles basin.',
  },
  {
    label: 'Postmodernism: The Rebellion (1970s–1990s)',
    detail:
      'By the 1970s, architects were exhausted by modernist severity. Postmodernism was a reaction: it reintroduced historical references, color, humor, and ornament that modernism had banned. Philip Johnson\'s AT&T Building (1984, New York) — a glass skyscraper topped with a Chippendale-style broken pediment — was both celebration and satire. Robert Venturi declared "less is a bore" (answering Mies\'s "less is more"). Michael Graves\'s Portland Building (1982) used color and classical motifs on a municipal office tower. Critics called it shallow; defenders called it human. Postmodernism proved that modernism\'s rules were stylistic choices, not natural laws.',
  },
  {
    label: 'High-Tech: Structure as Spectacle',
    detail:
      'The Centre Pompidou (1977, Paris) by Renzo Piano and Richard Rogers turned a building inside out: structure, ductwork, escalators, and pipes are all on the exterior, color-coded (blue for air, green for water, yellow for electrical, red for circulation). The building horrified traditionalists and delighted the public — it became the most-visited cultural site in Europe. Norman Foster\'s Hong Kong and Shanghai Bank (1985) and Lloyd\'s of London (Richard Rogers, 1986) continued the high-tech approach: celebrating engineering, making the building\'s systems visible, treating technology as aesthetically beautiful rather than something to hide behind walls.',
  },
];

// ── Contemporary Architecture ───────────────────────────────────────────────

const CONTEMPORARY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The "Bilbao Effect" — Gehry\'s Guggenheim (1997)',
    detail:
      'Frank Gehry\'s Guggenheim Museum Bilbao proved that a single building could transform a city\'s economy. The titanium-clad, sculptural museum — designed using aerospace software — attracted 1.3 million visitors in its first year and generated an estimated $500 million in economic activity, revitalizing a declining industrial city. The "Bilbao Effect" launched a global competition among cities to commission iconic buildings as economic catalysts. Every swooping, twisting, attention-grabbing museum, opera house, and library built since owes something to Bilbao\'s success.',
  },
  {
    label: 'Zaha Hadid (1950–2016): Breaking Every Rule',
    detail:
      'The first woman to win the Pritzker Prize (2004). Iraqi-British architect Zaha Hadid developed a fluid, parametric design language that made buildings look like they were in motion — curves flowing into each other, no right angles, no obvious front or back. Her MAXXI Museum in Rome (2010), Heydar Aliyev Center in Baku (2012), and Guangzhou Opera House (2010) look like nothing built before. For years her designs were called "unbuildable" — but advances in computer-aided design and fabrication eventually made them possible. Hadid proved that architecture could be as free-form as sculpture.',
  },
  {
    label: 'The Skyscraper Race',
    detail:
      'The 21st century saw skyscrapers explode beyond all previous limits: the Burj Khalifa in Dubai (2010, 828 meters) nearly doubled the previous record, becoming the tallest structure humans have ever built. The Shanghai Tower (2015, 632 meters) twists 120 degrees as it rises. Jeddah Tower, if completed, will exceed 1,000 meters. These buildings are engineering marvels — the Burj Khalifa\'s foundation uses 45,000 cubic meters of concrete, and its structural system (a buttressed core) was invented specifically for the project. But they also raise questions: are super-tall towers efficient, sustainable, or just ego projects for wealthy cities?',
  },
  {
    label: 'Sustainability: Architecture Responds to Climate',
    detail:
      'Buildings account for roughly 40% of global energy consumption and carbon emissions. Green architecture has moved from fringe to mainstream: LEED certification, passive solar design, green roofs, mass timber construction (cross-laminated timber as an alternative to steel and concrete), net-zero energy buildings, and biophilic design (integrating nature into buildings). The Bullitt Center in Seattle (2013) generates more energy than it uses. Singapore\'s Jewel Changi Airport (2019) contains a 40-meter indoor waterfall and a five-story garden. Architecture is being forced to reckon with the environmental consequences of 10,000 years of building.',
  },
  {
    label: 'Digital Fabrication: The Impossible Becomes Possible',
    detail:
      'Computer-aided design and robotic fabrication have made it possible to build forms that were previously impossible — or impossibly expensive — to construct. Parametric design (algorithms generating complex geometries) produces buildings like the Beijing National Aquatics Center (the "Water Cube"), whose structure mimics the geometry of soap bubbles. 3D-printed houses are being built in days. Drone-assembled structures are being tested. Digital fabrication is democratizing complex form — what once required armies of skilled craftsmen can now be generated by software and assembled by robots. Architecture is entering its most radically experimental era since the invention of concrete.',
  },
];

// ── Three Structural Innovations ────────────────────────────────────────────

const INNOVATIONS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Arch (Rome, 300 BCE)',
    detail:
      'The arch transfers weight along its curve, allowing spans far larger than any flat lintel. It enabled aqueducts, bridges, and the Colosseum — and remained the dominant structural form for 2,000 years. Every pointed Gothic arch, every Islamic horseshoe arch, every railway viaduct descends from the Roman semicircular arch. One geometric insight — that a curve can carry more than a straight line — changed what was physically possible to build.',
  },
  {
    label: 'The Dome (Rome → Byzantium → Islam → Renaissance)',
    detail:
      'The dome\'s 1,400-year journey traces the transmission of knowledge between civilizations. From the Pantheon (128 CE) to Hagia Sophia (537) to the great mosques of Istanbul and Isfahan to Brunelleschi\'s Florence (1436) to St. Peter\'s (1590) to the U.S. Capitol (1866) — the dome carries meaning as well as weight. It symbolizes heaven, authority, and the cosmos. Each civilization received the dome from its predecessor, solved new problems, and passed it forward.',
  },
  {
    label: 'The Steel Frame (Chicago, 1885)',
    detail:
      'The steel frame separated structure from enclosure for the first time. Walls no longer held up the building — a skeleton of steel did. This single innovation removed all height limits, made glass curtain walls possible, and created the skyscraper. Within 40 years of the first steel-frame building, the Empire State Building rose 102 stories. The steel frame is to modern architecture what the arch was to Rome: the structural idea that made everything else possible.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Imhotep',
    years: 'c. 2650–2600 BCE',
    contribution:
      'First architect known by name. Designed the Step Pyramid of Djoser at Saqqara — the world\'s first monumental stone building. Later deified by the Egyptians. Imhotep invented stone architecture.',
  },
  {
    name: 'Filippo Brunelleschi',
    years: '1377–1446',
    contribution:
      'Solved the greatest engineering challenge of the Renaissance: building the dome of Florence Cathedral without scaffolding. Also invented linear perspective, which transformed painting and architectural drawing forever.',
  },
  {
    name: 'Andrea Palladio',
    years: '1508–1580',
    contribution:
      'His "Four Books of Architecture" became the most influential architectural text ever published. The Palladian style — symmetry, temple fronts, mathematical proportion — spread across the world, from English country houses to the American White House.',
  },
  {
    name: 'Antoni Gaudí',
    years: '1852–1926',
    contribution:
      'Devised a wholly original architectural language based on natural forms — catenary arches, hyperbolic paraboloids, tree-like columns. His Sagrada Família in Barcelona (begun 1882) is still under construction and defies every convention of building.',
  },
  {
    name: 'Le Corbusier',
    years: '1887–1965',
    contribution:
      'The most influential — and controversial — architect of the 20th century. His "five points of architecture" (pilotis, free plan, free façade, ribbon windows, roof garden) defined modernism. His urban planning ideas, however, devastated many cities.',
  },
  {
    name: 'Frank Lloyd Wright',
    years: '1867–1959',
    contribution:
      'Designed over 1,000 structures across 70 years. Fallingwater and the Guggenheim Museum are American icons. Wright pursued "organic architecture" — buildings that grow from their sites as naturally as trees from the ground.',
  },
  {
    name: 'Zaha Hadid',
    years: '1950–2016',
    contribution:
      'First woman to win the Pritzker Prize (2004). Her fluid, parametric designs — once called "unbuildable" — redefined what architecture could look like. The MAXXI Museum and Heydar Aliyev Center are her most celebrated works.',
  },
  {
    name: 'Mies van der Rohe',
    years: '1886–1969',
    contribution:
      '"Less is more." Mies perfected the glass-and-steel tower (the Seagram Building), the open-plan pavilion (the Barcelona Pavilion), and the idea that architecture achieves greatness through reduction, not accumulation. The most imitated architect in history.',
  },
];

const FIGURE_COLORS = [SAND, COPPER, TEAL, GREEN, INDIGO, AMBER, ROSE, SKY, PURPLE, GOLD];

// ── What Buildings Reveal ───────────────────────────────────────────────────

const REVEAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Power',
    detail:
      'Every civilization builds to display power. The pyramids said: "Our pharaoh commands the labor of a nation." Gothic cathedrals said: "God\'s kingdom is grander than any earthly king\'s." Versailles said: "The state is me." Skyscrapers say: "Capital reaches higher than anything." Architecture is always, in part, a statement about who has power and how they want you to feel in its presence.',
  },
  {
    label: 'Technology',
    detail:
      'Buildings are frozen records of what a civilization could do. Roman concrete, Gothic flying buttresses, Renaissance dome engineering, industrial steel, modern digital fabrication — each leap in structural technology produced a new kind of building, which produced a new kind of space, which produced a new kind of experience. You can read the history of technology in the walls around you.',
  },
  {
    label: 'Values',
    detail:
      'Show me what a civilization builds and I\'ll tell you what it worships. Ancient Egypt built tombs (afterlife). Greece built theaters and agoras (democracy and public life). Rome built infrastructure (empire). Medieval Europe built cathedrals (God). The Renaissance built palaces and libraries (humanism). The 20th century built office towers (commerce). The 21st builds museums and sports stadiums (entertainment and spectacle). Architecture is a civilization\'s autobiography, written in stone.',
  },
  {
    label: 'Continuity',
    detail:
      'Architecture is the longest conversation in human history. The Pantheon\'s dome inspired Hagia Sophia, which inspired the Blue Mosque, which inspired St. Peter\'s. Greek columns reappear on Roman temples, Renaissance churches, and American courthouses. The pointed arch travels from Islamic mosques to Gothic cathedrals. Each generation of builders inherits the solutions of the last, adapts them, and passes them forward. Architecture is proof that human knowledge accumulates — that we build, literally, on what came before.',
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
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
          key={e.year}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
          }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: e.color, marginRight: 8 }} />
          <p style={{ display: 'inline', color: e.color, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginTop: 4, marginBottom: 6 }}>
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
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
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
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

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
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
          <h4 style={{ fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 2, fontSize: '1.05rem' }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
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
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryOfArchitecturePage() {
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* Hero */}
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
              background: `linear-gradient(135deg, ${STONE}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Stones to Skyscrapers — The History of Architecture (9600 BCE–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              Architecture is the most public of the arts and the most permanent record of a civilization. Every building is a frozen argument about what matters: who has power, what is sacred, how people should live. From the megaliths of Göbekli Tepe — built before agriculture, before writing, before civilization itself — to the glass towers of Shanghai and Dubai, the history of architecture is the history of what humans have chosen to make permanent.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is not just a story about buildings. It's a story about physics and faith, materials and meaning, the slow accumulation of structural knowledge passed from Rome to Byzantium to Islam to the Renaissance and beyond. Every arch, every dome, every steel frame solves a problem that someone before couldn't — and creates possibilities that someone after will exploit. Architecture is civilization's autobiography, written in stone, concrete, and glass.
            </p>
          </motion.div>
        </header>

        {/* Göbekli Tepe hook callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(168, 162, 158, 0.08)',
            border: `1px solid ${STONE}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: SAND, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            🏛️ Built Before Civilization
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Göbekli Tepe (9600 BCE) was built before farming, before pottery, before writing — by hunter-gatherers who hadn't yet invented agriculture. Massive carved pillars arranged in circles, depicting animals and abstract symbols. It is the oldest known temple complex on Earth, and it overturns everything we thought we knew about the origins of civilization. Humans didn't settle down and then build monuments. They built monuments and then settled down.
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginBottom: 8 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 12,
          }}>
            {KEY_STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.1rem' }}>
                  {stat.label}
                </span>
                <p style={{ color: ASH, fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 1: Before Architecture — Megaliths */}
        <SectionWrapper
          id="megaliths"
          icon="🪨"
          title="Before Architecture: Megaliths and Monuments (10,000–3000 BCE)"
          accentColor={STONE}
          intro="Before cities, before writing, before agriculture — humans built. The earliest known permanent structures aren't homes or granaries but temples and ritual sites, suggesting that the drive to create sacred space is one of the deepest impulses in human civilization."
        >
          <InsightGrid items={MEGALITH_INSIGHTS} />
        </SectionWrapper>

        {/* Section 2: Ancient Architecture */}
        <SectionWrapper
          id="ancient"
          icon="🏛️"
          title="Ancient Architecture (3000–300 BCE)"
          accentColor={SAND}
          intro="As civilizations emerged across the world, each developed its own architectural tradition — shaped by available materials, climate, social structure, and beliefs. Mesopotamia built with mud brick, Egypt with stone, China with timber, India with standardized bricks, Greece with marble. Different materials, different forms, different meanings — but the same fundamental drive to build something that would outlast the builders."
        >
          <InsightGrid items={ANCIENT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 3: Roman Architecture */}
        <SectionWrapper
          id="roman"
          icon="🏗️"
          title="Roman Architecture (300 BCE–400 CE)"
          accentColor={TERRACOTTA}
          intro="Rome didn't just build bigger — it built with materials and methods that made entirely new architectural forms possible. Roman concrete, the arch, the vault, and the dome transformed what could be constructed. The Pantheon's dome, the Colosseum's crowd management, the aqueducts' precision engineering — these weren't just impressive for their time. Some haven't been surpassed in ours."
        >
          <InsightGrid items={ROMAN_INSIGHTS} />
        </SectionWrapper>

        {/* Section 4: Byzantine Architecture */}
        <SectionWrapper
          id="byzantine"
          icon="✝️"
          title="Byzantine Architecture (330–1453 CE)"
          accentColor={GOLD}
          intro="When Constantine moved the Roman capital to Constantinople, he took Roman engineering east — where it merged with Eastern aesthetics to create something new. The pendentive solved the dome-on-square problem. Gold mosaics transformed interiors into visions of heaven. And Hagia Sophia held the title of world's largest building for a thousand years."
        >
          <InsightGrid items={BYZANTINE_INSIGHTS} />
        </SectionWrapper>

        {/* Section 5: Islamic Architecture */}
        <SectionWrapper
          id="islamic"
          icon="🕌"
          title="Islamic Architecture (622–1800 CE)"
          accentColor={TEAL}
          intro="Islamic architecture developed a visual language unlike any other: geometry as devotion, calligraphy as decoration, water as architectural element. Because figurative imagery was discouraged in religious contexts, architects channeled creative energy into pattern, space, and light — producing some of the most beautiful buildings on Earth."
        >
          <InsightGrid items={ISLAMIC_INSIGHTS} />
        </SectionWrapper>

        {/* Section 6: Gothic Cathedrals */}
        <SectionWrapper
          id="gothic"
          icon="⛪"
          title="Medieval Architecture: Gothic Cathedrals (1000–1500 CE)"
          accentColor={INDIGO}
          intro="Gothic architecture is the result of a physics problem: how do you make stone walls thin enough to fill with glass? The answer — pointed arch + ribbed vault + flying buttress — produced the most structurally audacious buildings of the medieval world, and turned an engineering solution into a theology of light."
        >
          <InsightGrid items={GOTHIC_INSIGHTS} />
        </SectionWrapper>

        {/* Gothic physics callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: `1px solid ${INDIGO}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: INDIGO, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            🔬 How Flying Buttresses Made Stained Glass Possible
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            A stone vault pushes outward. Without support, the walls spread apart and collapse. A flying buttress absorbs that outward thrust and redirects it downward through a heavy pier. This means the walls between buttresses carry almost no load — they can be replaced entirely with glass. The flying buttress didn't just support a building; it transformed walls from structure into screen, and darkness into light. Every soaring stained glass window in every Gothic cathedral exists because of this single structural insight.
          </p>
        </motion.div>

        {/* Section 7: Renaissance Architecture */}
        <SectionWrapper
          id="renaissance"
          icon="🎨"
          title="Renaissance Architecture (1400–1600)"
          accentColor={COPPER}
          intro="The Renaissance in architecture was a return to classical Rome — columns, domes, symmetry, mathematical proportion — and a rejection of 300 years of Gothic style. But it was also something new: architecture as intellectual discipline, the architect as thinker rather than craftsman, and the dome as the supreme test of engineering ambition."
        >
          <InsightGrid items={RENAISSANCE_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: Industrial Revolution & Modern Architecture */}
        <SectionWrapper
          id="industrial"
          icon="🏭"
          title="Industrial Revolution & Modern Architecture (1750–1930)"
          accentColor={STEEL}
          intro="New materials — cast iron, steel, reinforced concrete, glass — shattered the constraints that had governed architecture for millennia. Buildings could now be taller, lighter, assembled from prefabricated parts, and built in months rather than decades. The skyscraper was born, 'form follows function' became a manifesto, and architecture entered the machine age."
        >
          <TimelineCard entries={INDUSTRIAL_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: 20th Century Architecture */}
        <SectionWrapper
          id="twentieth-century"
          icon="🏢"
          title="20th Century Architecture (1930–2000)"
          accentColor={SKY}
          intro="The 20th century was architecture's most turbulent era: the glass box International Style dominated, then provoked rebellion. Frank Lloyd Wright pursued organic architecture, mid-century modernism embraced optimism and openness, postmodernism reintroduced humor and history, and high-tech turned engineering into spectacle. By 2000, architecture had more tools and fewer rules than ever."
        >
          <InsightGrid items={TWENTIETH_CENTURY_INSIGHTS} />
        </SectionWrapper>

        {/* Section 10: Contemporary Architecture */}
        <SectionWrapper
          id="contemporary"
          icon="🌆"
          title="Contemporary Architecture (2000–Present)"
          accentColor={ROSE}
          intro="The 21st century brought the 'starchitect' era, the skyscraper race, the sustainability imperative, and digital fabrication. A single building (Bilbao) proved that architecture could transform a city's economy. Computers enabled forms impossible to build by hand. And climate change forced architecture to confront the environmental consequences of 10,000 years of building."
        >
          <InsightGrid items={CONTEMPORARY_INSIGHTS} />
        </SectionWrapper>

        {/* Three structural innovations callout */}
        <SectionWrapper
          id="innovations"
          icon="🔺"
          title="Three Structural Innovations That Changed Everything"
          accentColor={AMBER}
          intro="The entire history of architecture can be read through three structural innovations, each of which removed a fundamental constraint on what could be built — and each of which traveled across civilizations, carrying knowledge forward."
        >
          <InsightGrid items={INNOVATIONS_INSIGHTS} />
        </SectionWrapper>

        {/* Key Figures */}
        <SectionWrapper
          id="key-figures"
          icon="👤"
          title="The Architects Who Shaped the Built World"
          accentColor={MARBLE}
          intro="From the first architect known by name to the first woman to win architecture's highest prize — the individuals who imagined buildings that had never existed, solved problems that had defeated their predecessors, and changed what the built world looks like."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* What buildings reveal — closing section */}
        <SectionWrapper
          id="what-buildings-reveal"
          icon="🔍"
          title="What Buildings Reveal About Civilization"
          accentColor={GOLD}
          intro="Architecture is the most honest record a civilization leaves behind. You can lie in a speech, a treaty, or a history book. But a building reveals what you actually valued enough to spend years and fortunes making permanent."
        >
          <InsightGrid items={REVEAL_INSIGHTS} />
        </SectionWrapper>

        {/* Connection links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          style={{
            padding: '32px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
            Connected Deep Dives
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/ancient-egypt', label: 'Ancient Egypt' },
              { to: '/ancient-greece', label: 'Ancient Greece' },
              { to: '/byzantine-empire', label: 'Byzantine Empire' },
              { to: '/renaissance', label: 'Renaissance' },
              { to: '/industrial-revolution', label: 'Industrial Revolution' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: SKY,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${SKY}33`,
                  backgroundColor: `${SKY}0a`,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
            — Le Corbusier
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
