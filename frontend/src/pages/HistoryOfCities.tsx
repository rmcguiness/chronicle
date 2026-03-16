/**
 * HistoryOfCities — comprehensive deep-dive on the history of urban life (~9000 BCE–present).
 *
 * Route: /history-of-cities
 *
 * Sections:
 *  1. Hero — headline, overview of 10,000 years of city-building
 *  2. First Cities — Jericho, Çatalhöyük, Uruk, why humans clustered
 *  3. Ancient Megacities — Babylon, Memphis, Rome, Chang'an, Constantinople
 *  4. Medieval Cities — walls, guilds, markets, plague, population collapse
 *  5. The Islamic City — souks, hammams, mosques as civic center
 *  6. Renaissance Urbanism — piazzas, city-states, Florence as laboratory
 *  7. Industrial Revolution — factory towns, slums, Manchester, sanitation
 *  8. The Modern Metropolis — Haussmann's Paris, Central Park, zoning
 *  9. 20th Century Sprawl — automobiles, suburbs, white flight, urban decay
 * 10. Megacities Today — Tokyo, Mumbai, São Paulo, infrastructure, inequality
 * 11. Smart Cities & Future Urbanism — sensors, sustainability, 15-minute city
 * 12. Civic Innovations — sewers, street lighting, transit, parks
 * 13. Timeline — key moments in urban history
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── colour palette ── */
const TERRACOTTA = '#c2410c';
const SAND = '#d4a574';
const GOLD = '#f59e0b';
const OCEAN = '#0ea5e9';
const TEAL = '#14b8a6';
const CRIMSON = '#dc2626';
const AMBER = '#d97706';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const ROSE = '#f43f5e';
const GREEN = '#22c55e';
const INDIGO = '#6366f1';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const COPPER = '#c2410c';
const OLIVE = '#84cc16';
const STONE = '#78716c';

/* ── data interfaces ── */
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

/* ══════════════════════════════════════════════════════════════════════
   SECTION DATA
   ══════════════════════════════════════════════════════════════════════ */

const FIRST_CITIES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Jericho (~9000 BCE)',
    detail:
      'One of the oldest continuously inhabited places on Earth. A freshwater spring in the Jordan Valley drew settlers who built stone walls and a massive tower — not for war, but possibly for ritual or flood control. By 8000 BCE, around 2,000 people lived within its walls.',
  },
  {
    label: 'Çatalhöyük (~7500 BCE)',
    detail:
      'A honeycomb city in modern Turkey with no streets. Residents entered their mudbrick homes through rooftop hatches. Up to 10,000 people lived here, decorating walls with hunting murals and burying their dead beneath the floor. It challenges every assumption about what a "city" must look like.',
  },
  {
    label: 'Uruk (~4000 BCE)',
    detail:
      'The world\'s first true city. By 3000 BCE it held 40,000–80,000 people, invented writing (cuneiform), built the first monumental temples (ziggurats), and had specialized workers — priests, potters, scribes, merchants. This is where civilization became urban.',
  },
  {
    label: 'Why Humans Clustered',
    detail:
      'Agriculture created surplus, surplus required storage and defense, defense required walls, walls created density, density created specialization. Once you had potters, scribes, and priests who didn\'t grow food, you had a city. The feedback loop was irreversible.',
  },
  {
    label: 'Mohenjo-daro (~2500 BCE)',
    detail:
      'The Indus Valley civilization built cities with grid street plans, standardized brick sizes, and the world\'s first urban sewage system — covered drains running beneath every street. They had public baths, granaries, and no evidence of palaces or temples. An egalitarian urbanism lost to history.',
  },
  {
    label: 'Eridu & the Temple Economy',
    detail:
      'Mesopotamian cities grew around temples. The temple wasn\'t just religious — it was warehouse, bank, and redistribution center. Priests managed irrigation, stored grain, and allocated resources. The city was, in its origin, a planned economy run by a temple complex.',
  },
];

const ANCIENT_MEGACITIES_TIMELINE: TimelineEntry[] = [
  {
    year: '~1750 BCE',
    title: 'Babylon under Hammurabi',
    description:
      'Hammurabi\'s law code — 282 laws carved in stone — governed a city of perhaps 200,000. Babylon had paved processional ways, the Ishtar Gate glazed in brilliant blue, and the Hanging Gardens (if they existed). It was the first city to imagine itself as the center of the world.',
    color: GOLD,
  },
  {
    year: '~3000–300 BCE',
    title: 'Memphis & Thebes — Cities of the Nile',
    description:
      'Memphis, capital of the Old Kingdom, sat where the Nile Delta began — a strategic chokepoint controlling all of Upper and Lower Egypt. Thebes (modern Luxor) later eclipsed it, building Karnak, the largest religious complex ever constructed. Both cities were sustained by the annual flood.',
    color: SAND,
  },
  {
    year: '1st century CE',
    title: 'Rome — The First Million-Person City',
    description:
      'At its peak under Trajan, Rome housed over 1 million people. It had 11 aqueducts delivering 1 million cubic meters of water daily, a sewer system (the Cloaca Maxima), 5-story apartment blocks (insulae), public baths for 60,000, and a grain dole feeding 200,000. No city would match its population until London in the 1800s.',
    color: CRIMSON,
  },
  {
    year: '7th–10th century',
    title: 'Chang\'an — Tang Dynasty Capital',
    description:
      'The world\'s largest city for centuries. Chang\'an (modern Xi\'an) held over 1 million people within walls enclosing 84 square kilometers — six times the area of Constantinople. Its grid layout influenced every East Asian capital. The West and East Markets were the Amazon and Alibaba of their age.',
    color: AMBER,
  },
  {
    year: '330–1453 CE',
    title: 'Constantinople — City Between Two Worlds',
    description:
      'Constantine\'s city sat on the most strategic point on Earth — controlling the only sea route between the Mediterranean and Black Sea and the land route between Europe and Asia. The Theodosian Walls held for 1,000 years. The Hagia Sophia was the largest interior space in the world for a millennium.',
    color: PURPLE,
  },
  {
    year: '~1200–1500 CE',
    title: 'Tenochtitlan — City on the Lake',
    description:
      'When Cortés arrived in 1519, Tenochtitlan had 200,000+ people — larger than any city in Spain. Built on an island in Lake Texcoco, connected by causeways, fed by chinampas (floating gardens), with aqueducts, a great market serving 60,000 daily, and temples aligned to astronomical events. The Spanish were awestruck before they destroyed it.',
    color: TEAL,
  },
];

const ANCIENT_FIGURES: FigureEntry[] = [
  {
    name: 'Hammurabi',
    years: 'r. 1792–1750 BCE',
    contribution:
      'Created the first comprehensive legal code. Established that a city\'s ruler was accountable to written, public law — not arbitrary decree.',
  },
  {
    name: 'Augustus',
    years: '63 BCE–14 CE',
    contribution:
      '"I found Rome a city of bricks and left it a city of marble." Built forums, aqueducts, and a fire brigade. Transformed Rome from chaotic republic to imperial showcase.',
  },
  {
    name: 'Empress Wu Zetian',
    years: '624–705 CE',
    contribution:
      'Moved the Tang capital to Luoyang and rebuilt it as a cosmopolitan center. Promoted merit-based civil service exams that shaped Chinese governance for 1,200 years.',
  },
  {
    name: 'Justinian I',
    years: '482–565 CE',
    contribution:
      'Rebuilt Constantinople after the Nika riots. Commissioned the Hagia Sophia — the architectural wonder that defined the city for a millennium.',
  },
];

const MEDIEVAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Walls Defined Everything',
    detail:
      'Medieval cities were walled. Being "within the walls" meant legal protection, market access, and freedom from feudal obligation. The German phrase "Stadtluft macht frei" (city air makes you free) was literal — a serf who lived within city walls for a year and a day became legally free.',
  },
  {
    label: 'Guilds as Government',
    detail:
      'Guilds controlled production, set quality standards, trained apprentices, and often ran the city council. The wool guild in Florence, the Hanseatic merchants in Lübeck, the silversmiths in London — these were simultaneously trade unions, regulatory bodies, and political parties.',
  },
  {
    label: 'The Market Square',
    detail:
      'Every medieval city organized around its market square. This was the economic heart, the place of public announcement, execution, celebration, and protest. The size of a city\'s market square was a direct indicator of its wealth and ambition.',
  },
  {
    label: 'The Black Death (1347–1351)',
    detail:
      'The plague killed 30–60% of Europe\'s population. Cities were hit hardest — density was a death sentence. Florence fell from 120,000 to 50,000. But the aftermath transformed cities: labor shortages gave workers bargaining power, rents dropped, and surviving cities rebuilt with wider streets and better sanitation.',
  },
  {
    label: 'Cathedrals as Urban Identity',
    detail:
      'Gothic cathedrals were civic engineering projects that took generations. Chartres, Notre-Dame, Cologne — they were funded by guilds and cities as much as by the Church. A city\'s cathedral was its skyline, its brand, and its statement of permanence.',
  },
  {
    label: 'Hanseatic League',
    detail:
      'A network of trading cities across northern Europe — Lübeck, Hamburg, Bruges, Bergen, Novgorod — that operated as a proto-EU. They had their own laws, their own navy, and could embargo entire kingdoms. Proof that cities could be more powerful than nations.',
  },
];

const ISLAMIC_CITY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Souk (Market)',
    detail:
      'Islamic cities organized commerce in covered souks radiating from the central mosque. Each trade had its district — spice souk, leather souk, gold souk. The souk in Aleppo stretched 13 kilometers. Climate-adapted architecture: vaulted stone ceilings kept temperatures 15°C below the street.',
  },
  {
    label: 'The Hammam (Bathhouse)',
    detail:
      'More than hygiene — the hammam was a social institution. Business deals were struck, marriages arranged, and news exchanged in the steam rooms. Medieval Cairo had over 1,000 hammams. While medieval Europe abandoned Roman bathing culture, the Islamic world refined it into an art.',
  },
  {
    label: 'The Mosque as Civic Center',
    detail:
      'The Friday mosque was not just for prayer. It was courthouse, university, community center, and welfare office. The mosque of Córdoba had a library of 400,000 volumes. Al-Azhar in Cairo (founded 970 CE) is the oldest continuously operating university in the world.',
  },
  {
    label: 'Baghdad — The Round City',
    detail:
      'Founded in 762 CE by Caliph al-Mansur as a perfect circle 2 km in diameter. At its peak under Harun al-Rashid, Baghdad held 1–2 million people, making it the world\'s largest city. The House of Wisdom translated Greek, Persian, and Indian texts, preserving knowledge that would later spark Europe\'s Renaissance.',
  },
  {
    label: 'Córdoba — Europe\'s Brightest City',
    detail:
      '10th-century Córdoba had paved, lit streets (500 years before London), 900 public baths, 70 libraries, and running water in homes. Population: 500,000. While Paris and London were muddy villages of 20,000, Córdoba was the most advanced city in Europe.',
  },
  {
    label: 'Water Engineering',
    detail:
      'Islamic cities were masters of water. Qanats (underground channels) brought mountain water to desert cities. Fountains cooled courtyards. Isfahan, Fez, and Damascus all had sophisticated water distribution systems centuries ahead of their European contemporaries.',
  },
];

const RENAISSANCE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Piazza as Stage',
    detail:
      'Renaissance cities designed public spaces as deliberate performances of civic identity. The Piazza della Signoria in Florence, St. Mark\'s Square in Venice, the Piazza del Campo in Siena — these were outdoor rooms, shaped by architecture to frame political and social life.',
  },
  {
    label: 'Florence — The Laboratory',
    detail:
      'Under the Medici, Florence became a test bed for everything: perspective painting, dome engineering (Brunelleschi), banking, diplomacy, political philosophy (Machiavelli). A city of 60,000 produced more world-changing ideas per capita than anywhere in history.',
  },
  {
    label: 'Venice — The Floating Republic',
    detail:
      'Built on 118 islands, Venice proved that geography was not destiny. It became the richest city in Europe through trade, invented quarantine (40-day isolation for ships — quarantina), and maintained a republic for 1,100 years. The Arsenal employed 16,000 workers and could build a warship in a day.',
  },
  {
    label: 'City-States as Innovation',
    detail:
      'Italian city-states competed fiercely: Florence vs. Siena, Venice vs. Genoa, Milan vs. everyone. This competition drove innovation in art, architecture, finance, and warfare. The modern concepts of diplomacy, banking, double-entry bookkeeping, and public debt were all invented by Italian cities.',
  },
  {
    label: 'Ideal City Plans',
    detail:
      'Renaissance architects (Alberti, Filarete, Leonardo) designed ideal cities on paper — radial plans, geometric perfection, separation of functions. Palmanova, built in 1593, was a star-shaped fortress city that actually got built. These plans influenced colonial city-building from Lima to Manila.',
  },
  {
    label: 'Amsterdam — The Golden Age City',
    detail:
      'Amsterdam\'s concentric canal rings (built 1613–1662) were the world\'s most ambitious urban plan. Each ring served a different class. The city combined religious tolerance, commercial freedom, and engineering mastery into a model that attracted talent from across Europe.',
  },
];

const INDUSTRIAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1760s–1840s',
    title: 'The Factory Town Emerges',
    description:
      'Cotton mills pulled workers from farms to towns. Manchester grew from 25,000 (1772) to 300,000 (1850). Workers lived in back-to-back houses with no ventilation, no sewers, and shared privies. Life expectancy in industrial Manchester: 17 years for laborers (vs. 38 in rural Surrey).',
    color: STONE,
  },
  {
    year: '1842',
    title: 'Edwin Chadwick\'s Report',
    description:
      'Chadwick\'s "Report on the Sanitary Conditions of the Labouring Population" documented in horrifying detail what industrial cities had become: open sewers, cholera epidemics, child mortality above 50%. It launched the sanitary reform movement that would transform urban governance.',
    color: TEAL,
  },
  {
    year: '1854',
    title: 'John Snow and the Broad Street Pump',
    description:
      'Snow\'s cholera map proved the disease spread through contaminated water, not "miasma." He removed the pump handle and the outbreak stopped. This was the birth of epidemiology — and the moment cities began to understand that infrastructure was a matter of life and death.',
    color: OCEAN,
  },
  {
    year: '1863',
    title: 'London Underground Opens',
    description:
      'The Metropolitan Railway — the world\'s first underground transit system. Steam trains in brick tunnels, initially filling stations with smoke. But it proved a radical idea: you could move masses of people beneath the city, decoupling where people lived from where they worked.',
    color: CRIMSON,
  },
  {
    year: '1870s–1890s',
    title: 'The Sanitation Revolution',
    description:
      'Joseph Bazalgette built London\'s sewer system — 1,100 miles of tunnels intercepting waste before it reached the Thames. Hamburg built water filtration. Chicago reversed the flow of its river. These engineering feats saved more lives than any medical advance of the century.',
    color: GREEN,
  },
  {
    year: '1880s–1900s',
    title: 'Electrification Transforms the City',
    description:
      'Electric streetlights eliminated the distinction between day and night. Electric trams and elevators enabled both horizontal and vertical expansion. The skyscraper (Chicago, 1885) was impossible without the electric elevator. The modern city is fundamentally an electrical creation.',
    color: GOLD,
  },
];

const INDUSTRIAL_FIGURES: FigureEntry[] = [
  {
    name: 'Joseph Bazalgette',
    years: '1819–1891',
    contribution:
      'Chief engineer of London\'s sewage system. His interceptor sewers ended cholera epidemics and created the Victoria Embankment. The greatest infrastructure project of the 19th century.',
  },
  {
    name: 'Friedrich Engels',
    years: '1820–1895',
    contribution:
      'His "Condition of the Working Class in England" (1845) documented Manchester\'s slums with brutal precision. The book helped launch both urban reform and revolutionary socialism.',
  },
  {
    name: 'Ebenezer Howard',
    years: '1850–1928',
    contribution:
      'Proposed the "Garden City" — planned communities combining the best of city and country. His ideas directly produced Letchworth and Welwyn, and influenced suburban planning worldwide.',
  },
  {
    name: 'Daniel Burnham',
    years: '1846–1912',
    contribution:
      '"Make no little plans." His 1909 Plan of Chicago was the first comprehensive metropolitan plan — lakefront parks, rail consolidation, boulevard systems. The template for 20th-century city planning.',
  },
];

const MODERN_METROPOLIS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Haussmann\'s Paris (1853–1870)',
    detail:
      'Napoleon III gave Baron Haussmann carte blanche to rebuild Paris. He demolished medieval neighborhoods, cut 85 miles of new boulevards, installed gas lighting, built parks (Bois de Boulogne), and created the sewer/water systems that still function today. He also displaced 350,000 poor residents. Every modern city redesign follows his playbook — and repeats his controversies.',
  },
  {
    label: 'Central Park (1858)',
    detail:
      'Olmsted and Vaux won a design competition with "Greensward" — a manufactured wilderness in the center of Manhattan. It required moving 10 million cartloads of earth, planting 270,000 trees, and demolishing Seneca Village (a Black community). Central Park proved that public green space wasn\'t a luxury but a necessity for urban mental health.',
  },
  {
    label: 'Zoning Laws',
    detail:
      'New York\'s 1916 Zoning Resolution was the first comprehensive zoning law. It separated residential from industrial uses and required setbacks (creating the "wedding cake" skyscraper silhouette). Zoning became the most powerful tool in urban planning — and the most abused, routinely weaponized for racial and economic segregation.',
  },
  {
    label: 'The Skyscraper Race',
    detail:
      'The Home Insurance Building (Chicago, 1885, 10 stories) started it. By 1931, the Empire State Building reached 102 stories. Steel frames, electric elevators, and curtain walls let cities grow vertically. Manhattan\'s skyline became the visual shorthand for modernity itself.',
  },
  {
    label: 'The City Beautiful Movement',
    detail:
      'Inspired by the 1893 Chicago World\'s Fair, City Beautiful advocates believed that grand architecture and planned vistas could elevate civic life. They gave us the National Mall, Union Station, and civic centers across America. Critics called it cosmetic — grand facades hiding persistent poverty.',
  },
  {
    label: 'Public Transit Systems',
    detail:
      'The subway transformed cities: New York (1904), Paris (Métro, 1900), Buenos Aires (1913). Mass transit let workers live miles from their jobs, enabling residential suburbs connected to commercial cores. The modern city is impossible without the daily miracle of moving millions underground.',
  },
];

const SPRAWL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Automobile Reshapes Everything',
    detail:
      'The car didn\'t just change transportation — it remade the American city. Streets were widened, trolley lines ripped out, highways driven through neighborhoods. Robert Moses built 13 bridges, 2 tunnels, and 416 miles of parkway around New York, but also demolished entire communities to do it. The car gave freedom to those who had one and isolation to those who didn\'t.',
  },
  {
    label: 'Suburbia',
    detail:
      'Levittown (1947) proved you could mass-produce suburbs. 17,447 identical houses on former potato fields. FHA loans (deliberately denied to Black families) and the GI Bill fueled white suburban flight. By 1970, more Americans lived in suburbs than in cities or rural areas. The suburb became the dominant American landscape.',
  },
  {
    label: 'White Flight and Urban Decay',
    detail:
      'Between 1950 and 1970, millions of white residents left cities for suburbs, taking their tax base with them. Federal highway policy routed interstates through Black neighborhoods (I-81 through Syracuse, I-10 through Claiborne Avenue in New Orleans). Cities hollowed out. Detroit went from 1.8 million (1950) to 640,000 (2020).',
  },
  {
    label: 'Redlining',
    detail:
      'The Home Owners\' Loan Corporation literally drew red lines around Black neighborhoods on maps, marking them as "hazardous" for lending. Banks refused mortgages, property values collapsed, and investment fled. The effects are measurable today: redlined neighborhoods still have lower home values, worse health outcomes, and fewer trees.',
  },
  {
    label: 'Robert Moses vs. Jane Jacobs',
    detail:
      'The defining urban battle of the 20th century. Moses wanted to run a highway through Greenwich Village. Jacobs organized residents to stop him. Her book "The Death and Life of Great American Cities" (1961) argued that density, mixed use, short blocks, and old buildings were strengths, not problems. She won the intellectual argument. Moses had already built the highways.',
  },
  {
    label: 'Le Corbusier\'s Vision',
    detail:
      'Le Corbusier\'s "Radiant City" — towers in a park, separated functions, car-centric design — became the blueprint for public housing worldwide. Pruitt-Igoe (St. Louis, 1954, demolished 1972) proved the concept catastrophically wrong. High-rise isolation, no street life, no mixed use. The demolition of Pruitt-Igoe is sometimes called the death of modernist urbanism.',
  },
];

const MEGACITIES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Tokyo (37 million)',
    detail:
      'The world\'s largest metropolitan area runs on the most efficient transit system ever built. Tokyo\'s trains carry 40 million passengers daily with an average delay of 18 seconds. It combines extreme density with extreme safety, low crime, and clean streets. The proof that megacities can work — if you invest in infrastructure.',
  },
  {
    label: 'Mumbai (21 million)',
    detail:
      'Mumbai contains both the most expensive house on Earth (Antilia, $2 billion) and Asia\'s largest slum (Dharavi, 1 million people in 2.4 sq km). Dharavi generates $1 billion annually through recycling, pottery, leather, and textile micro-industries. Mumbai is the starkest illustration of urban inequality — and urban resilience.',
  },
  {
    label: 'São Paulo (22 million)',
    detail:
      'Brazil\'s economic engine produces 12% of the country\'s GDP. The ultra-rich commute by helicopter (the city has more helipads than any city on Earth) while workers spend 3+ hours on buses. A city of gated communities next to favelas, street art culture, and one of the world\'s great food scenes.',
  },
  {
    label: 'Lagos (16 million)',
    detail:
      'Africa\'s largest city doubles in population every 15 years. Most growth is informal — Makoko, a floating community on the Lagos Lagoon, has 300,000 residents and no official services. Lagos runs on hustle: informal economies, generators replacing the grid, motorcycle taxis replacing buses. It may be the future of urbanism for 2 billion people.',
  },
  {
    label: 'Shenzhen — From Village to Megacity',
    detail:
      'In 1980, Shenzhen was a fishing village of 30,000. Today it\'s a tech metropolis of 18 million. This is the fastest urbanization in human history — a city built in a single generation. It manufactures 90% of the world\'s electronics and files more patents than France.',
  },
  {
    label: 'Infrastructure Under Strain',
    detail:
      'Mexico City is sinking 20 inches per year as aquifers are depleted. Jakarta floods regularly and is building an entirely new capital (Nusantara). Chennai ran completely out of water in 2019. Climate change is turning the megacity model from challenge to potential catastrophe.',
  },
];

const SMART_CITIES_INSIGHTS: InsightEntry[] = [
  {
    label: 'The 15-Minute City',
    detail:
      'Carlos Moreno\'s concept: every essential — work, school, healthcare, groceries, leisure — within a 15-minute walk or bike ride. Paris under Mayor Hidalgo is the leading experiment: car lanes converted to bike lanes, schoolyards opened as parks, micro-hubs replacing commutes. The idea is ancient (medieval cities were naturally 15-minute cities) but the implementation is radical.',
  },
  {
    label: 'Sensor Networks',
    detail:
      'Barcelona\'s sensors monitor noise, air quality, parking, waste bins, and irrigation. Songdo (South Korea) was built from scratch as a "smart city" with pneumatic waste disposal and ubiquitous sensing. But the question persists: smart for whom? Surveillance and optimization are not the same as livability.',
  },
  {
    label: 'Climate Adaptation',
    detail:
      'Copenhagen\'s Cloudburst Plan turns streets into temporary canals during floods. Singapore captures and recycles 100% of its wastewater. Medellín\'s "green corridors" lowered urban temperature by 2°C. The cities that survive the 21st century will be the ones that treat climate adaptation as infrastructure, not afterthought.',
  },
  {
    label: 'The Return to Density',
    detail:
      'After decades of sprawl, young professionals are returning to city centers worldwide. Mixed-use zoning is replacing single-family exclusivity (Minneapolis abolished single-family zoning in 2018). The pandemic briefly reversed the trend, but cities rebounded. Density, it turns out, is efficient, social, and creative — the same reasons people clustered in Uruk.',
  },
  {
    label: 'Vertical Forests & Biophilic Design',
    detail:
      'Stefano Boeri\'s Bosco Verticale in Milan — towers covered in 900 trees — started a global trend. Biophilic design integrates nature into urban structures: green roofs, living walls, rain gardens. The goal is to make the city not a replacement for nature but a partner with it.',
  },
  {
    label: 'Who Gets to Live in the Future City?',
    detail:
      'Smart city projects often displace the poor. Sidewalk Labs\' Toronto project collapsed over data privacy concerns. New developments in San Francisco and London price out longtime residents. The oldest urban question — who belongs inside the walls? — is still unanswered.',
  },
];

const CIVIC_INNOVATIONS_TIMELINE: TimelineEntry[] = [
  {
    year: '~2500 BCE',
    title: 'Sewers — Mohenjo-daro',
    description:
      'The Indus Valley built covered brick sewers beneath every street 4,500 years ago. Rome\'s Cloaca Maxima followed 2,000 years later. London didn\'t get proper sewers until 1865. The most important urban technology is the one you never see.',
    color: TEAL,
  },
  {
    year: '~1000 CE',
    title: 'Street Lighting — Córdoba',
    description:
      'Córdoba had oil-lit streets in the 10th century. London didn\'t mandate street lighting until 1417 (and it was just a candle in a lantern). Gas lighting arrived in 1812 (London), electric in 1879 (Cleveland). Each upgrade extended the usable city by hours.',
    color: GOLD,
  },
  {
    year: '1829',
    title: 'Professional Police — London',
    description:
      'Robert Peel\'s Metropolitan Police Act created the first modern police force. Before this, cities relied on night watchmen, private guards, and mob justice. The "Peelers" were controversial from day one — the tension between public safety and state power has never been resolved.',
    color: BLUE,
  },
  {
    year: '1858',
    title: 'Public Parks — Central Park',
    description:
      'Olmsted argued that parks were "the lungs of the city" — essential for physical and mental health. The idea spread globally: Birkenhead Park (1847, the actual first), Hyde Park, the Bois de Boulogne, Golden Gate Park. Modern research confirms what Olmsted intuited: urban green space measurably reduces stress, heart disease, and depression.',
    color: GREEN,
  },
  {
    year: '1882',
    title: 'Electric Grid — New York',
    description:
      'Edison\'s Pearl Street Station powered 85 customers in Lower Manhattan. Within 20 years, electric grids transformed every city on Earth. Lighting, elevators, trolleys, factories, refrigeration, communication — the electric grid is the single technology that makes modern cities possible.',
    color: AMBER,
  },
  {
    year: '1900–1904',
    title: 'Mass Transit — Paris & New York Metros',
    description:
      'The Métro (1900) and New York Subway (1904) proved that underground rail could move millions daily. Mass transit enabled the commuter city — live in the Bronx, work in Manhattan. Without it, cities max out at the distance a person can walk.',
    color: CRIMSON,
  },
  {
    year: '1908',
    title: 'Chlorinated Water — Jersey City',
    description:
      'Jersey City was the first to permanently chlorinate its water supply. Typhoid rates dropped 90% within a year. Water chlorination has been called the most significant public health advance of the 20th century. It saved more urban lives than antibiotics.',
    color: OCEAN,
  },
  {
    year: '1956',
    title: 'Interstate Highway System — USA',
    description:
      'Eisenhower\'s Federal-Aid Highway Act built 41,000 miles of limited-access highways. It connected American cities but also hollowed them out — enabling suburban flight, destroying urban neighborhoods, and creating car-dependent landscapes. The most transformative and most destructive infrastructure project in American history.',
    color: STONE,
  },
];

const GRAND_TIMELINE: TimelineEntry[] = [
  { year: '~9000 BCE', title: 'Jericho: First Walled Settlement', description: 'Stone walls, a tower, 2,000 inhabitants around a freshwater spring.', color: TERRACOTTA },
  { year: '~7500 BCE', title: 'Çatalhöyük: The Rooftop City', description: 'Up to 10,000 people in a city with no streets — entry through the roof.', color: SAND },
  { year: '~4000 BCE', title: 'Uruk: The First True City', description: 'Writing, temples, specialized labor, 40,000+ residents.', color: GOLD },
  { year: '~2500 BCE', title: 'Mohenjo-daro: Grid Planning & Sewers', description: 'The world\'s first planned urban infrastructure.', color: TEAL },
  { year: '~1750 BCE', title: 'Babylon: Hammurabi\'s Law Code', description: 'The first city governed by written, public law.', color: AMBER },
  { year: '5th c. BCE', title: 'Athens: Democracy in the Agora', description: 'Citizens governing themselves in public space.', color: OCEAN },
  { year: '1st c. CE', title: 'Rome: 1 Million People', description: 'Aqueducts, insulae, the Colosseum, the grain dole.', color: CRIMSON },
  { year: '762 CE', title: 'Baghdad: The Round City', description: 'House of Wisdom, 1–2 million people, global knowledge hub.', color: PURPLE },
  { year: '1347', title: 'Black Death Reaches Europe', description: 'Cities lose 30–60% of their population. Urban life reimagined.', color: ROSE },
  { year: '1453', title: 'Constantinople Falls', description: 'Ottoman conquest ends the Byzantine Empire, reshapes the eastern Mediterranean.', color: INDIGO },
  { year: '1494–1527', title: 'Italian Wars', description: 'City-states clash; Florence, Venice, and Milan define Renaissance urbanism.', color: GREEN },
  { year: '1666', title: 'Great Fire of London', description: 'Destroys 13,200 houses. Rebuilt in brick and stone — with fire codes.', color: COPPER },
  { year: '1853', title: 'Haussmann Begins Remaking Paris', description: 'Boulevards, parks, sewers — the template for modern urban redesign.', color: BLUE },
  { year: '1863', title: 'London Underground Opens', description: 'The world\'s first subway system.', color: CRIMSON },
  { year: '1885', title: 'First Skyscraper (Chicago)', description: 'Steel frame + elevator = the vertical city.', color: STONE },
  { year: '1920s', title: 'Automobile Age Begins', description: 'Cars reshape streets, enable suburbs, kill streetcars.', color: AMBER },
  { year: '1961', title: 'Jane Jacobs\' "Death and Life"', description: 'Challenges top-down planning. Density and mixed use defended.', color: TEAL },
  { year: '2008', title: 'Majority Urban', description: 'For the first time, more humans live in cities than in rural areas.', color: OCEAN },
  { year: '2020s', title: 'Smart City & 15-Minute City', description: 'Sensors, bike lanes, and the return to walkable urbanism.', color: OLIVE },
];

/* ══════════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ══════════════════════════════════════════════════════════════════════ */

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
    <section id={id} style={{ marginBottom: 56 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: 12,
            color: accentColor,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.8,
            fontSize: '1rem',
            marginBottom: 20,
            maxWidth: 800,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: e.color,
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </span>
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

const FIGURE_COLORS = [OCEAN, GOLD, CRIMSON, TEAL, BLUE, ROSE, AMBER, GREEN, INDIGO, PURPLE];

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

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

export default function HistoryOfCities() {
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

        {/* ── Hero ── */}
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
              background: `linear-gradient(135deg, ${TERRACOTTA}, ${GOLD}, ${OCEAN})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            History of Cities — 10,000 Years of Building, Destroying, and Reimagining Urban Life
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
              The city is humanity's greatest collective invention. Before writing,
              before the wheel, before bronze — there were cities. Jericho had walls
              9,000 years ago. Uruk had bureaucrats and tax collectors by 3500 BCE.
              Rome crammed a million people into a space smaller than modern Houston.
              Today, 4.4 billion people — 56% of humanity — live in urban areas, and
              by 2050 it will be 68%.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of why humans cluster, how they organize space, what
              happens when density meets ambition (and disease, and inequality), and
              how the city keeps reinventing itself. From mudbrick Uruk to the
              sensor-threaded smart city, the fundamental question has never changed:
              how do strangers live together?
            </p>
          </motion.div>
        </header>

        {/* ── Section 1: First Cities ── */}
        <SectionWrapper
          id="first-cities"
          icon="🏛"
          title="First Cities — Why Humans Clustered (~9000–3000 BCE)"
          accentColor={TERRACOTTA}
          intro="The Neolithic Revolution gave humans agriculture. Agriculture gave them surplus. Surplus required storage, defense, and administration. And suddenly you needed walls, granaries, temples, and scribes — you needed a city. The transition from village to city was not gradual. It was a phase change: once density crossed a threshold, specialization became possible, and specialization was addictive."
        >
          <InsightGrid items={FIRST_CITIES_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 2: Ancient Megacities ── */}
        <SectionWrapper
          id="ancient-megacities"
          icon="🏟"
          title="Ancient Megacities — When Cities Ruled the World"
          accentColor={GOLD}
          intro="The ancient world produced cities of staggering scale and sophistication. Rome's aqueducts delivered a million cubic meters of water daily. Chang'an's grid layout covered 84 square kilometers. Tenochtitlan's floating gardens fed 200,000 people on a lake. These were not primitive settlements — they were engineered environments that solved problems modern cities still struggle with."
        >
          <TimelineCard entries={ANCIENT_MEGACITIES_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: GOLD,
                marginBottom: 14,
              }}
            >
              Builders & Rulers of the Ancient City
            </h3>
            <FigureGrid figures={ANCIENT_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── Section 3: Medieval Cities ── */}
        <SectionWrapper
          id="medieval-cities"
          icon="🏰"
          title="Medieval Cities — Walls, Guilds, and the Black Death"
          accentColor={AMBER}
          intro="After Rome fell, European cities shrank dramatically — Rome itself went from 1 million to 20,000. But cities didn't disappear. They transformed into walled, self-governing communities where guilds controlled production, markets defined space, and the Church provided the only social safety net. Then the plague came and killed half of everyone, and the cities that survived emerged stronger than before."
        >
          <InsightGrid items={MEDIEVAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 4: The Islamic City ── */}
        <SectionWrapper
          id="islamic-city"
          icon="🕌"
          title="The Islamic City — Souks, Scholars, and Civic Genius"
          accentColor={PURPLE}
          intro="While medieval Europe was rebuilding from Rome's collapse, the Islamic world was building the most advanced cities on Earth. Baghdad's House of Wisdom preserved Greek philosophy. Córdoba had paved, lit streets five centuries before London. The Islamic city organized around the mosque, the souk, and the hammam — creating a model of urban life that was simultaneously commercial, intellectual, and communal."
        >
          <InsightGrid items={ISLAMIC_CITY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 5: Renaissance Urbanism ── */}
        <SectionWrapper
          id="renaissance"
          icon="🎨"
          title="Renaissance Urbanism — Piazzas, City-States, and Designed Space"
          accentColor={INDIGO}
          intro="The Renaissance didn't just rediscover classical art — it rediscovered the idea that cities could be deliberately designed. Italian city-states competed through architecture and urban planning as fiercely as through war. Florence, Venice, and Amsterdam proved that a city of 60,000 could outperform kingdoms of millions — if it organized space, capital, and talent the right way."
        >
          <InsightGrid items={RENAISSANCE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 6: Industrial Revolution ── */}
        <SectionWrapper
          id="industrial"
          icon="🏭"
          title="Industrial Revolution — The City as Machine (1760–1900)"
          accentColor={STONE}
          intro="Industrialization pulled millions from farms into cities in a single generation. Manchester, Birmingham, Pittsburgh, Essen — these were the first cities built by and for industry. The results were horrifying: child labor, cholera, life expectancy of 17 in the worst districts. But the response — sanitary reform, public health, municipal engineering — created the infrastructure template that modern cities still use."
        >
          <TimelineCard entries={INDUSTRIAL_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: STONE,
                marginBottom: 14,
              }}
            >
              Reformers & Engineers Who Saved the Industrial City
            </h3>
            <FigureGrid figures={INDUSTRIAL_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── Section 7: The Modern Metropolis ── */}
        <SectionWrapper
          id="modern-metropolis"
          icon="🌆"
          title="The Modern Metropolis — Redesigning the City (1850–1950)"
          accentColor={BLUE}
          intro="The modern city was designed, not grown. Haussmann bulldozed medieval Paris to build boulevards. Olmsted manufactured wilderness in Central Park. Zoning laws separated where you live from where you work. The skyscraper let cities grow vertically. For the first time, the city was treated as a system to be engineered — with all the power and arrogance that implies."
        >
          <InsightGrid items={MODERN_METROPOLIS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 8: 20th Century Sprawl ── */}
        <SectionWrapper
          id="sprawl"
          icon="🚗"
          title="20th Century Sprawl — Cars, Suburbs, and Urban Decay"
          accentColor={ROSE}
          intro="The automobile didn't just change transportation — it inverted the city. For 10,000 years, cities were dense because walking was the only way to get around. The car made sprawl possible, and American policy made it inevitable. Highways, FHA loans, and redlining created the suburban landscape — and hollowed out the urban core. The battle between Jane Jacobs and Robert Moses defined whether cities would be built for people or for cars."
        >
          <InsightGrid items={SPRAWL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 9: Megacities Today ── */}
        <SectionWrapper
          id="megacities"
          icon="🌏"
          title="Megacities Today — 10 Million and Counting"
          accentColor={OCEAN}
          intro="There are now 33 megacities (10 million+ people) on Earth, up from 2 in 1950. By 2030 there will be 43. Tokyo's metro area has more people than Canada. Lagos doubles every 15 years. These cities contain humanity's greatest achievements and its deepest inequalities — often on the same block."
        >
          <InsightGrid items={MEGACITIES_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 10: Smart Cities ── */}
        <SectionWrapper
          id="smart-cities"
          icon="🔮"
          title="Smart Cities & Future Urbanism"
          accentColor={OLIVE}
          intro="The next chapter of the city is being written now. The 15-minute city reimagines how we organize daily life. Sensor networks optimize infrastructure in real time. Climate adaptation is becoming the defining challenge. But the deepest question isn't technological — it's political: who gets to live in the future city, and who decides?"
        >
          <InsightGrid items={SMART_CITIES_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 11: Civic Innovations ── */}
        <SectionWrapper
          id="civic-innovations"
          icon="⚙"
          title="Civic Innovations — The Technologies That Made Cities Livable"
          accentColor={TEAL}
          intro="Cities are technology. Not just buildings and streets, but the invisible systems beneath them — sewers, water pipes, electrical grids, transit tunnels. Each innovation solved a problem that was killing people, and each one is so successful that we've forgotten it exists. The history of the city is the history of infrastructure."
        >
          <TimelineCard entries={CIVIC_INNOVATIONS_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 12: Grand Timeline ── */}
        <SectionWrapper
          id="timeline"
          icon="📜"
          title="10,000 Years of Urban History"
          accentColor={SAND}
          intro="From the first walls of Jericho to the smart sensors of Barcelona — the milestones that shaped how humans live together."
        >
          <TimelineCard entries={GRAND_TIMELINE} />
        </SectionWrapper>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: 48,
            paddingTop: 24,
            paddingBottom: 48,
            textAlign: 'center',
            color: SLATE,
            fontSize: '0.85rem',
          }}
        >
          <p>
            <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              ← Back to Timeline
            </Link>
          </p>
          <p style={{ marginTop: 12, opacity: 0.6 }}>
            Chronicle — An Immersive Journey Through History
          </p>
        </footer>
      </div>
    </div>
  );
}
