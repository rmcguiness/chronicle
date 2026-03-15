/**
 * TechnologyPage — Humanity's Greatest Inventions & Technological Leaps.
 *
 * Route: /technology
 *
 * Sections:
 *  1. Hero — title + subtitle
 *  2. Filter tabs (category)
 *  3. Cards grid of 55+ technology milestones
 *  4. Impact Ripple — invention chains showing how one invention enabled the next
 *  5. Most Transformative — top-10 ranking by impact score
 *  6. Still Shaping the World — technologies with ongoing impact
 */

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type TechCategory =
  | 'Tools & Materials'
  | 'Writing & Communication'
  | 'Energy & Power'
  | 'Transportation'
  | 'Medicine'
  | 'Computing';

interface Technology {
  name: string;
  year: string;
  yearSort: number;
  inventor: string;
  category: TechCategory;
  description: string;
  impact: number; // 1–10
  madeItPossible: string;
  stillShaping: boolean;
  searchQuery: string;
}

interface InventionChain {
  title: string;
  steps: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<TechCategory, string> = {
  'Tools & Materials': '#f59e0b',
  'Writing & Communication': '#8b5cf6',
  'Energy & Power': '#ef4444',
  Transportation: '#3b82f6',
  Medicine: '#22c55e',
  Computing: '#06b6d4',
};

const CATEGORY_ICONS: Record<TechCategory, string> = {
  'Tools & Materials': '\u{1F528}',
  'Writing & Communication': '\u{1F4DC}',
  'Energy & Power': '\u26A1',
  Transportation: '\u{1F680}',
  Medicine: '\u{1FA7A}',
  Computing: '\u{1F4BB}',
};

const ALL_CATEGORIES: TechCategory[] = [
  'Tools & Materials',
  'Writing & Communication',
  'Energy & Power',
  'Transportation',
  'Medicine',
  'Computing',
];

const TECHNOLOGIES: Technology[] = [
  // ── Tools & Materials ────────────────────────────────────────────────────
  {
    name: 'Stone Tools',
    year: '~3.3M BCE',
    yearSort: -3300000,
    inventor: 'Early hominins (Lomekwi)',
    category: 'Tools & Materials',
    description: 'The earliest known technology — deliberately shaped stone flakes used for cutting, scraping, and processing food. These tools predate Homo sapiens by millions of years.',
    impact: 9,
    madeItPossible: 'Hunting, food processing, later tool refinement',
    stillShaping: false,
    searchQuery: 'stone tools Lomekwi',
  },
  {
    name: 'Control of Fire',
    year: '~1M BCE',
    yearSort: -1000000,
    inventor: 'Homo erectus',
    category: 'Tools & Materials',
    description: 'Mastering fire enabled cooking (which may have driven brain evolution), warmth in cold climates, protection from predators, and the first controlled chemical process.',
    impact: 10,
    madeItPossible: 'Cooking, metalworking, ceramics, settlement in cold regions',
    stillShaping: true,
    searchQuery: 'control of fire early humans',
  },
  {
    name: 'The Wheel',
    year: '~3500 BCE',
    yearSort: -3500,
    inventor: 'Mesopotamia',
    category: 'Tools & Materials',
    description: 'Initially used for pottery, the wheel was adapted for transport around 3200 BCE. It became the foundational mechanism for carts, chariots, watermills, and eventually engines.',
    impact: 10,
    madeItPossible: 'Carts, chariots, pulleys, gears, turbines',
    stillShaping: true,
    searchQuery: 'invention of the wheel Mesopotamia',
  },
  {
    name: 'Bronze Smelting',
    year: '~3300 BCE',
    yearSort: -3300,
    inventor: 'Near East civilizations',
    category: 'Tools & Materials',
    description: 'Alloying copper with tin produced bronze — harder and more durable than stone or copper. It revolutionized weapons, tools, and armor, defining an entire archaeological age.',
    impact: 7,
    madeItPossible: 'Superior weapons, armor, agricultural tools',
    stillShaping: false,
    searchQuery: 'Bronze Age smelting',
  },
  {
    name: 'Iron Smelting',
    year: '~1200 BCE',
    yearSort: -1200,
    inventor: 'Hittites / Anatolia',
    category: 'Tools & Materials',
    description: 'Iron was harder and more abundant than bronze. Its adoption transformed agriculture (iron plows), warfare (iron swords), and construction, ushering in the Iron Age.',
    impact: 8,
    madeItPossible: 'Steel, industrial tools, railways, skyscrapers',
    stillShaping: false,
    searchQuery: 'Iron Age smelting Hittites',
  },
  {
    name: 'Steel Production',
    year: '~400 BCE',
    yearSort: -400,
    inventor: 'India (Wootz steel)',
    category: 'Tools & Materials',
    description: 'Early crucible steel from India (Wootz) was prized across the ancient world. Steel\'s combination of hardness and flexibility made it the ultimate material for blades, construction, and later industrial machinery.',
    impact: 9,
    madeItPossible: 'Bessemer process, skyscrapers, railroads, modern infrastructure',
    stillShaping: true,
    searchQuery: 'Wootz steel India ancient',
  },
  {
    name: 'Concrete',
    year: '~300 BCE',
    yearSort: -300,
    inventor: 'Roman Empire',
    category: 'Tools & Materials',
    description: 'Roman concrete (opus caementicium) enabled monumental structures like the Pantheon and aqueducts. Some Roman marine concrete has proven more durable than modern versions after 2,000 years.',
    impact: 8,
    madeItPossible: 'Aqueducts, harbors, modern architecture, infrastructure',
    stillShaping: true,
    searchQuery: 'Roman concrete',
  },

  // ── Writing & Communication ──────────────────────────────────────────────
  {
    name: 'Writing',
    year: '~3400 BCE',
    yearSort: -3400,
    inventor: 'Sumerians (cuneiform)',
    category: 'Writing & Communication',
    description: 'The invention of writing in Sumer allowed humans to record laws, trade, history, and knowledge across generations. It marks the boundary between prehistory and history.',
    impact: 10,
    madeItPossible: 'Record-keeping, law codes, literature, science',
    stillShaping: true,
    searchQuery: 'cuneiform writing Sumer',
  },
  {
    name: 'The Alphabet',
    year: '~1050 BCE',
    yearSort: -1050,
    inventor: 'Phoenicians',
    category: 'Writing & Communication',
    description: 'The Phoenician alphabet reduced hundreds of symbols to roughly 22 letters, making literacy far more accessible. It became the ancestor of Greek, Latin, Arabic, and Hebrew scripts.',
    impact: 9,
    madeItPossible: 'Widespread literacy, Greek philosophy, written law',
    stillShaping: true,
    searchQuery: 'Phoenician alphabet',
  },
  {
    name: 'Paper',
    year: '105 CE',
    yearSort: 105,
    inventor: 'Cai Lun (China)',
    category: 'Writing & Communication',
    description: 'Cai Lun standardized papermaking from bark, rags, and hemp. Cheaper and lighter than bamboo strips or silk, paper democratized writing and record-keeping across East Asia and eventually the world.',
    impact: 8,
    madeItPossible: 'Books, bureaucracy, printing, newspapers',
    stillShaping: true,
    searchQuery: 'invention of paper Cai Lun China',
  },
  {
    name: 'Printing Press',
    year: '1440',
    yearSort: 1440,
    inventor: 'Johannes Gutenberg',
    category: 'Writing & Communication',
    description: 'Gutenberg\'s movable-type press slashed the cost of book production by orders of magnitude. It fueled the Renaissance, the Reformation, and the Scientific Revolution by making knowledge widely available.',
    impact: 10,
    madeItPossible: 'Mass literacy, Reformation, Scientific Revolution, newspapers',
    stillShaping: true,
    searchQuery: 'Gutenberg printing press',
  },
  {
    name: 'Telegraph',
    year: '1837',
    yearSort: 1837,
    inventor: 'Samuel Morse / William Cooke',
    category: 'Writing & Communication',
    description: 'The electric telegraph allowed near-instant long-distance communication for the first time. It transformed journalism, finance, warfare, and diplomacy, shrinking the world dramatically.',
    impact: 8,
    madeItPossible: 'Telephone, undersea cables, real-time news, stock tickers',
    stillShaping: false,
    searchQuery: 'electric telegraph Morse',
  },
  {
    name: 'Telephone',
    year: '1876',
    yearSort: 1876,
    inventor: 'Alexander Graham Bell',
    category: 'Writing & Communication',
    description: 'The telephone enabled real-time voice conversation over distances, revolutionizing business, personal communication, and emergency services. It laid the groundwork for all voice telecommunications.',
    impact: 8,
    madeItPossible: 'Telephone networks, modems, mobile phones, VoIP',
    stillShaping: true,
    searchQuery: 'telephone Alexander Graham Bell',
  },
  {
    name: 'Radio',
    year: '1895',
    yearSort: 1895,
    inventor: 'Guglielmo Marconi',
    category: 'Writing & Communication',
    description: 'Wireless radio transmission enabled mass broadcasting, transforming entertainment, news dissemination, and military communication. It was the first true mass medium.',
    impact: 8,
    madeItPossible: 'Broadcasting, radar, television, wireless communication',
    stillShaping: true,
    searchQuery: 'radio Marconi wireless',
  },
  {
    name: 'Television',
    year: '1927',
    yearSort: 1927,
    inventor: 'Philo Farnsworth',
    category: 'Writing & Communication',
    description: 'Electronic television brought moving images into homes worldwide. It reshaped politics (televised debates), culture (shared national moments), and advertising forever.',
    impact: 8,
    madeItPossible: 'Mass media, video recording, streaming, visual culture',
    stillShaping: true,
    searchQuery: 'television invention Farnsworth',
  },
  {
    name: 'Internet (ARPANET)',
    year: '1969',
    yearSort: 1969,
    inventor: 'DARPA / Vint Cerf / Bob Kahn',
    category: 'Writing & Communication',
    description: 'ARPANET, the precursor to the Internet, connected computers across universities and military sites. TCP/IP protocols (1983) created the universal network that now connects billions.',
    impact: 10,
    madeItPossible: 'Email, World Wide Web, e-commerce, social media, cloud computing',
    stillShaping: true,
    searchQuery: 'ARPANET internet history',
  },
  {
    name: 'World Wide Web',
    year: '1991',
    yearSort: 1991,
    inventor: 'Tim Berners-Lee',
    category: 'Writing & Communication',
    description: 'Berners-Lee\'s web combined hypertext, URLs, and HTTP to make the Internet accessible to everyone. It triggered the dot-com boom and transformed commerce, media, and daily life.',
    impact: 10,
    madeItPossible: 'E-commerce, social media, streaming, cloud apps, remote work',
    stillShaping: true,
    searchQuery: 'World Wide Web Tim Berners-Lee',
  },
  {
    name: 'Smartphone',
    year: '2007',
    yearSort: 2007,
    inventor: 'Apple (iPhone)',
    category: 'Writing & Communication',
    description: 'The iPhone combined a phone, camera, music player, and internet device with a touch interface. Smartphones put computing power in billions of pockets and spawned the app economy.',
    impact: 9,
    madeItPossible: 'App economy, mobile internet, social media ubiquity, ride-sharing',
    stillShaping: true,
    searchQuery: 'iPhone smartphone revolution 2007',
  },

  // ── Energy & Power ───────────────────────────────────────────────────────
  {
    name: 'Watermill',
    year: '~1st c. BCE',
    yearSort: -80,
    inventor: 'Roman Empire / Hellenistic world',
    category: 'Energy & Power',
    description: 'The watermill harnessed river power to grind grain, replacing human and animal labor. It was one of the first machines to convert natural energy into useful mechanical work.',
    impact: 7,
    madeItPossible: 'Sawmills, textile mills, hydroelectric power',
    stillShaping: false,
    searchQuery: 'watermill Roman ancient',
  },
  {
    name: 'Windmill',
    year: '9th c. CE',
    yearSort: 850,
    inventor: 'Persia (Sistan)',
    category: 'Energy & Power',
    description: 'Persian vertical-axis windmills pumped water and ground grain in arid regions. European horizontal-axis windmills (12th c.) became icons of medieval industry, especially in the Low Countries.',
    impact: 6,
    madeItPossible: 'Land reclamation, Dutch Golden Age, modern wind turbines',
    stillShaping: true,
    searchQuery: 'windmill history Persia',
  },
  {
    name: 'Steam Engine',
    year: '1769',
    yearSort: 1769,
    inventor: 'James Watt',
    category: 'Energy & Power',
    description: 'Watt\'s improved steam engine (separate condenser) made steam power practical for factories and transport. It was the prime mover of the Industrial Revolution.',
    impact: 10,
    madeItPossible: 'Factories, railways, steamships, Industrial Revolution',
    stillShaping: false,
    searchQuery: 'steam engine James Watt',
  },
  {
    name: 'Oil Refinery',
    year: '1856',
    yearSort: 1856,
    inventor: 'Ignacy Łukasiewicz (Poland)',
    category: 'Energy & Power',
    description: 'The first industrial oil refinery produced kerosene for lamps. Petroleum refining later fueled the automobile, aviation, plastics, and modern geopolitics.',
    impact: 8,
    madeItPossible: 'Automobiles, aviation fuel, plastics, petrochemicals',
    stillShaping: true,
    searchQuery: 'oil refinery history petroleum',
  },
  {
    name: 'Electrical Grid',
    year: '1882',
    yearSort: 1882,
    inventor: 'Thomas Edison (Pearl Street Station)',
    category: 'Energy & Power',
    description: 'Edison\'s Pearl Street Station in Manhattan was the first commercial electrical power grid. Electrification transformed industry, homes, and cities — widely considered the most important engineering achievement of the 20th century.',
    impact: 10,
    madeItPossible: 'Electric lighting, appliances, telecommunications, computing',
    stillShaping: true,
    searchQuery: 'Edison Pearl Street electrical grid',
  },
  {
    name: 'Nuclear Power',
    year: '1951',
    yearSort: 1951,
    inventor: 'EBR-I (Idaho, USA)',
    category: 'Energy & Power',
    description: 'The first electricity generated from nuclear fission. Nuclear power offered immense energy density but brought challenges of waste, proliferation, and public safety (Three Mile Island, Chernobyl, Fukushima).',
    impact: 7,
    madeItPossible: 'Carbon-free baseload electricity, nuclear submarines, fusion research',
    stillShaping: true,
    searchQuery: 'nuclear power history EBR-I',
  },
  {
    name: 'Solar Panel',
    year: '1954',
    yearSort: 1954,
    inventor: 'Bell Labs (Chapin, Fuller, Pearson)',
    category: 'Energy & Power',
    description: 'Bell Labs\' silicon photovoltaic cell converted sunlight directly to electricity at ~6% efficiency. Solar power has since become the cheapest source of electricity in many regions.',
    impact: 8,
    madeItPossible: 'Space satellites, renewable energy grid, off-grid power, energy transition',
    stillShaping: true,
    searchQuery: 'solar panel Bell Labs photovoltaic',
  },

  // ── Transportation ───────────────────────────────────────────────────────
  {
    name: 'Sailboat',
    year: '~4000 BCE',
    yearSort: -4000,
    inventor: 'Ancient Mesopotamia / Egypt',
    category: 'Transportation',
    description: 'Sail technology harnessed wind for travel and trade along rivers and coastlines. It enabled long-distance maritime commerce, cultural exchange, and eventually oceanic exploration.',
    impact: 8,
    madeItPossible: 'Maritime trade, Phoenician exploration, Age of Discovery',
    stillShaping: false,
    searchQuery: 'sailboat ancient history',
  },
  {
    name: 'Stirrup',
    year: '~300 CE',
    yearSort: 300,
    inventor: 'Central Asian nomads / China',
    category: 'Transportation',
    description: 'The stirrup gave mounted riders stability for combat, enabling heavy cavalry charges. Some historians argue it reshaped feudal warfare and enabled the Mongol Empire\'s conquests.',
    impact: 6,
    madeItPossible: 'Heavy cavalry, feudal knighthood, mounted archery, Mongol conquests',
    stillShaping: false,
    searchQuery: 'stirrup invention cavalry',
  },
  {
    name: 'Steam Locomotive',
    year: '1804',
    yearSort: 1804,
    inventor: 'Richard Trevithick',
    category: 'Transportation',
    description: 'Trevithick\'s locomotive hauled iron along a tramway in Wales. Railways soon connected cities and continents, driving industrialization, urbanization, and the concept of standardized time zones.',
    impact: 9,
    madeItPossible: 'Transcontinental railroads, time zones, urbanization, global trade',
    stillShaping: true,
    searchQuery: 'steam locomotive Trevithick railway',
  },
  {
    name: 'Automobile',
    year: '1886',
    yearSort: 1886,
    inventor: 'Karl Benz (Patent-Motorwagen)',
    category: 'Transportation',
    description: 'Benz\'s Patent-Motorwagen was the first vehicle designed and built as an automobile. Cars reshaped cities (suburbs, highways), economies (oil, manufacturing), and daily life worldwide.',
    impact: 9,
    madeItPossible: 'Highways, suburbs, oil industry, assembly line manufacturing',
    stillShaping: true,
    searchQuery: 'Karl Benz automobile Patent-Motorwagen',
  },
  {
    name: 'Airplane',
    year: '1903',
    yearSort: 1903,
    inventor: 'Wright Brothers',
    category: 'Transportation',
    description: 'The Wright Flyer achieved the first sustained, controlled, powered heavier-than-air flight at Kitty Hawk. Aviation transformed warfare, commerce, and made the world dramatically smaller.',
    impact: 9,
    madeItPossible: 'Air travel, airmail, aerial warfare, globalization',
    stillShaping: true,
    searchQuery: 'Wright brothers first flight',
  },
  {
    name: 'Jet Engine',
    year: '1939',
    yearSort: 1939,
    inventor: 'Hans von Ohain / Frank Whittle',
    category: 'Transportation',
    description: 'Jet propulsion dramatically increased aircraft speed and altitude. It enabled commercial air travel for the masses, military supersonic flight, and space launch systems.',
    impact: 8,
    madeItPossible: 'Commercial aviation, supersonic flight, jet age globalization',
    stillShaping: true,
    searchQuery: 'jet engine Whittle Ohain',
  },
  {
    name: 'Rocket (V-2)',
    year: '1942',
    yearSort: 1942,
    inventor: 'Wernher von Braun (Peenemünde)',
    category: 'Transportation',
    description: 'The V-2 was the first long-range guided ballistic missile and the first human-made object to reach space. Its technology became the foundation of all modern rocketry and space exploration.',
    impact: 8,
    madeItPossible: 'Space exploration, ICBMs, satellite launches, Moon landing',
    stillShaping: true,
    searchQuery: 'V-2 rocket von Braun',
  },
  {
    name: 'Apollo Moon Landing',
    year: '1969',
    yearSort: 1969.5,
    inventor: 'NASA (Armstrong, Aldrin, Collins)',
    category: 'Transportation',
    description: 'Apollo 11 landed humans on the Moon for the first time. It demonstrated the pinnacle of engineering achievement and inspired generations of scientists and explorers.',
    impact: 9,
    madeItPossible: 'Space stations, Mars missions, satellite economy, miniaturized computing',
    stillShaping: true,
    searchQuery: 'Apollo 11 Moon landing 1969',
  },
  {
    name: 'Electric Car (Mass Market)',
    year: '2010s',
    yearSort: 2012,
    inventor: 'Tesla (Model S)',
    category: 'Transportation',
    description: 'Tesla proved electric vehicles could be desirable and practical, triggering an industry-wide shift. EVs are now central to decarbonizing transportation.',
    impact: 7,
    madeItPossible: 'Battery revolution, autonomous driving, renewable transport, charging infrastructure',
    stillShaping: true,
    searchQuery: 'Tesla electric car revolution',
  },

  // ── Medicine ─────────────────────────────────────────────────────────────
  {
    name: 'Vaccination',
    year: '1796',
    yearSort: 1796,
    inventor: 'Edward Jenner',
    category: 'Medicine',
    description: 'Jenner\'s cowpox inoculation proved that immunity to smallpox could be artificially induced. Vaccination has since saved more lives than any other medical intervention — smallpox was eradicated in 1980.',
    impact: 10,
    madeItPossible: 'Eradication of smallpox, polio vaccines, mRNA vaccines',
    stillShaping: true,
    searchQuery: 'Edward Jenner vaccination smallpox',
  },
  {
    name: 'Germ Theory',
    year: '1860s',
    yearSort: 1862,
    inventor: 'Louis Pasteur / Robert Koch',
    category: 'Medicine',
    description: 'Pasteur and Koch proved that microorganisms cause disease, overturning centuries of miasma theory. Germ theory enabled antiseptic surgery, pasteurization, and modern public health.',
    impact: 10,
    madeItPossible: 'Antiseptics, sterilization, public health, antibiotics',
    stillShaping: true,
    searchQuery: 'germ theory Pasteur Koch',
  },
  {
    name: 'X-ray',
    year: '1895',
    yearSort: 1895.5,
    inventor: 'Wilhelm Röntgen',
    category: 'Medicine',
    description: 'Röntgen discovered that X-rays could image bones inside the living body. Medical imaging revolutionized diagnosis and led to CT scans, radiation therapy, and airport security.',
    impact: 8,
    madeItPossible: 'CT scans, radiation therapy, non-invasive diagnosis',
    stillShaping: true,
    searchQuery: 'X-ray Röntgen discovery',
  },
  {
    name: 'Penicillin',
    year: '1928',
    yearSort: 1928,
    inventor: 'Alexander Fleming',
    category: 'Medicine',
    description: 'Fleming\'s accidental discovery of penicillin launched the antibiotic era. Antibiotics have saved hundreds of millions of lives from bacterial infections that were once routinely fatal.',
    impact: 10,
    madeItPossible: 'Antibiotic medicine, safe surgery, longer lifespans',
    stillShaping: true,
    searchQuery: 'penicillin Alexander Fleming',
  },
  {
    name: 'DNA Double Helix',
    year: '1953',
    yearSort: 1953,
    inventor: 'Watson, Crick, Franklin, Wilkins',
    category: 'Medicine',
    description: 'Discovering the double-helix structure of DNA unlocked the code of life. It launched molecular biology and made possible genetic engineering, forensics, and personalized medicine.',
    impact: 9,
    madeItPossible: 'Genetic engineering, forensic DNA, Human Genome Project, CRISPR',
    stillShaping: true,
    searchQuery: 'DNA double helix Watson Crick',
  },
  {
    name: 'MRI',
    year: '1977',
    yearSort: 1977,
    inventor: 'Raymond Damadian / Paul Lauterbur',
    category: 'Medicine',
    description: 'Magnetic Resonance Imaging uses powerful magnets and radio waves to produce detailed images of soft tissues without radiation. It transformed neurological and cancer diagnosis.',
    impact: 7,
    madeItPossible: 'Functional MRI (brain imaging), early cancer detection, neuroscience research',
    stillShaping: true,
    searchQuery: 'MRI invention medical imaging',
  },
  {
    name: 'CRISPR Gene Editing',
    year: '2012',
    yearSort: 2012,
    inventor: 'Jennifer Doudna / Emmanuelle Charpentier',
    category: 'Medicine',
    description: 'CRISPR-Cas9 allows precise, inexpensive editing of DNA sequences. It promises cures for genetic diseases, drought-resistant crops, and control of disease-carrying insects.',
    impact: 9,
    madeItPossible: 'Gene therapy, disease-resistant crops, sickle cell cure, de-extinction research',
    stillShaping: true,
    searchQuery: 'CRISPR gene editing Doudna Charpentier',
  },

  // ── Computing ────────────────────────────────────────────────────────────
  {
    name: 'Analytical Engine',
    year: '1837',
    yearSort: 1837.5,
    inventor: 'Charles Babbage',
    category: 'Computing',
    description: 'Babbage designed the first general-purpose mechanical computer, with an arithmetic logic unit, memory, and conditional branching. Though never fully built, Ada Lovelace wrote the first algorithm for it.',
    impact: 7,
    madeItPossible: 'Concept of programmable computation, Lovelace\'s first algorithm',
    stillShaping: false,
    searchQuery: 'Analytical Engine Babbage',
  },
  {
    name: 'Turing Machine',
    year: '1936',
    yearSort: 1936,
    inventor: 'Alan Turing',
    category: 'Computing',
    description: 'Turing\'s theoretical machine defined what is computable, establishing the mathematical foundation of computer science. It remains the benchmark for what any computer can do.',
    impact: 9,
    madeItPossible: 'Theory of computation, Enigma codebreaking, all modern computers',
    stillShaping: true,
    searchQuery: 'Turing machine computability',
  },
  {
    name: 'ENIAC',
    year: '1945',
    yearSort: 1945,
    inventor: 'Eckert & Mauchly (UPenn)',
    category: 'Computing',
    description: 'ENIAC was the first general-purpose electronic digital computer. Weighing 30 tons and filling a room, it could perform 5,000 additions per second — revolutionary at the time.',
    impact: 8,
    madeItPossible: 'Stored-program computers, UNIVAC, digital age',
    stillShaping: false,
    searchQuery: 'ENIAC first computer',
  },
  {
    name: 'Transistor',
    year: '1947',
    yearSort: 1947,
    inventor: 'Bardeen, Brattain, Shockley (Bell Labs)',
    category: 'Computing',
    description: 'The transistor replaced vacuum tubes with a tiny, reliable, low-power semiconductor switch. It made miniaturization possible and is the fundamental building block of all modern electronics.',
    impact: 10,
    madeItPossible: 'Integrated circuits, microprocessors, all modern electronics',
    stillShaping: true,
    searchQuery: 'transistor Bell Labs invention',
  },
  {
    name: 'Microprocessor',
    year: '1971',
    yearSort: 1971,
    inventor: 'Intel (Ted Hoff, Federico Faggin)',
    category: 'Computing',
    description: 'The Intel 4004 put an entire CPU on a single chip. Microprocessors enabled personal computers, embedded systems, and the computing revolution that continues to accelerate.',
    impact: 10,
    madeItPossible: 'Personal computers, smartphones, embedded systems, IoT',
    stillShaping: true,
    searchQuery: 'Intel 4004 microprocessor',
  },
  {
    name: 'Personal Computer',
    year: '1977',
    yearSort: 1977.5,
    inventor: 'Apple (Apple II) / Commodore / Tandy',
    category: 'Computing',
    description: 'The Apple II, Commodore PET, and TRS-80 brought computing to homes and small businesses. PCs democratized computing and created the software industry.',
    impact: 9,
    madeItPossible: 'Software industry, spreadsheets, desktop publishing, gaming',
    stillShaping: true,
    searchQuery: 'personal computer Apple II 1977',
  },
  {
    name: 'GPS',
    year: '1983',
    yearSort: 1983,
    inventor: 'U.S. Department of Defense',
    category: 'Computing',
    description: 'The Global Positioning System uses satellite signals to determine location anywhere on Earth. GPS underpins navigation, logistics, precision agriculture, and location-based services.',
    impact: 8,
    madeItPossible: 'Turn-by-turn navigation, ride-sharing, precision agriculture, drone delivery',
    stillShaping: true,
    searchQuery: 'GPS satellite navigation history',
  },
  {
    name: 'Search Engine',
    year: '1998',
    yearSort: 1998,
    inventor: 'Larry Page & Sergey Brin (Google)',
    category: 'Computing',
    description: 'Google\'s PageRank algorithm organized the web\'s information by link relevance. Search engines became the gateway to all human knowledge, reshaping advertising and information access.',
    impact: 9,
    madeItPossible: 'Ad-supported web, SEO, knowledge democratization, AI training data',
    stillShaping: true,
    searchQuery: 'Google search engine PageRank',
  },
  {
    name: 'Large Language Models',
    year: '2022+',
    yearSort: 2022,
    inventor: 'OpenAI, Google, Anthropic, Meta',
    category: 'Computing',
    description: 'Transformer-based LLMs demonstrated human-level language understanding and generation. They are rapidly transforming software development, writing, research, and knowledge work.',
    impact: 9,
    madeItPossible: 'AI assistants, code generation, automated research, multimodal AI',
    stillShaping: true,
    searchQuery: 'large language models AI GPT',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Supplementary data
// ─────────────────────────────────────────────────────────────────────────────

const INVENTION_CHAINS: InventionChain[] = [
  {
    title: 'The Wheel to the Moon',
    steps: ['Wheel', 'Cart', 'Chariot', 'Steam engine', 'Steam locomotive', 'Automobile', 'Airplane', 'Rocket', 'Apollo Moon Landing'],
  },
  {
    title: 'Writing to AI',
    steps: ['Cuneiform writing', 'Alphabet', 'Paper', 'Printing press', 'Telegraph', 'Internet', 'World Wide Web', 'Search engine', 'Large Language Models'],
  },
  {
    title: 'Fire to Fusion',
    steps: ['Control of fire', 'Bronze smelting', 'Iron smelting', 'Steam engine', 'Electrical grid', 'Nuclear power', 'Solar panel'],
  },
  {
    title: 'Microbes to Gene Editing',
    steps: ['Germ theory', 'Vaccination', 'Penicillin', 'DNA double helix', 'CRISPR'],
  },
  {
    title: 'Switches to Superintelligence',
    steps: ['Analytical Engine', 'Turing machine', 'ENIAC', 'Transistor', 'Microprocessor', 'Personal computer', 'Internet', 'Large Language Models'],
  },
];

const TOP_10_MOST_TRANSFORMATIVE = TECHNOLOGIES
  .slice()
  .sort((a, b) => b.impact - a.impact || a.yearSort - b.yearSort)
  .slice(0, 10);

const STILL_SHAPING = TECHNOLOGIES.filter((t) => t.stillShaping);

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        border: active ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.12)',
        backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.04)',
        color: active ? color : '#94a3b8',
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

function SectionHeading({ icon, title }: { icon: string; title: string }) {
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 'clamp(18px, 3vw, 24px)',
        fontWeight: 800,
        color: '#f1f5f9',
        letterSpacing: '-0.01em',
        margin: '0 0 24px',
      }}
    >
      <span style={{ fontSize: 'clamp(22px, 3.5vw, 30px)' }}>{icon}</span>
      {title}
    </h2>
  );
}

function ImpactBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 80,
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score * 10}%`,
            height: '100%',
            borderRadius: 3,
            backgroundColor:
              score >= 9 ? '#f59e0b' : score >= 7 ? '#3b82f6' : '#64748b',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: score >= 9 ? '#f59e0b' : score >= 7 ? '#3b82f6' : '#94a3b8',
        }}
      >
        {score}/10
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function TechnologyPage() {
  const [categoryFilter, setCategoryFilter] = useState<TechCategory | 'All'>('All');

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = 'auto';
    return () => {
      html.style.overflow = '';
    };
  }, []);

  const filtered = useMemo(() => {
    return TECHNOLOGIES.filter((t) => {
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      return true;
    }).sort((a, b) => a.yearSort - b.yearSort);
  }, [categoryFilter]);

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#f1f5f9',
      }}
    >
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <header
        style={{
          textAlign: 'center',
          padding: 'clamp(48px, 10vw, 96px) 24px clamp(32px, 6vw, 56px)',
          background: 'linear-gradient(180deg, rgba(6,182,212,0.10) 0%, transparent 60%)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginBottom: 20,
            fontSize: 13,
            color: '#64748b',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          \u2190 Back to Chronicle
        </Link>
        <div style={{ fontSize: 'clamp(48px, 10vw, 80px)', marginBottom: 12 }}>{'\u2699\uFE0F'}</div>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          Humanity&rsquo;s Greatest Inventions
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: '#94a3b8',
            maxWidth: 640,
            margin: '0 auto',
            lineHeight: 1.5,
          }}
        >
          From stone tools to artificial intelligence &mdash; the technological leaps
          that shaped civilization. {TECHNOLOGIES.length} milestones across {ALL_CATEGORIES.length} categories.
        </p>
      </header>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          padding: '0 24px 40px',
        }}
      >
        <FilterPill
          label="All"
          active={categoryFilter === 'All'}
          color="#f1f5f9"
          onClick={() => setCategoryFilter('All')}
        />
        {ALL_CATEGORIES.map((cat) => (
          <FilterPill
            key={cat}
            label={`${CATEGORY_ICONS[cat]} ${cat}`}
            active={categoryFilter === cat}
            color={CATEGORY_COLORS[cat]}
            onClick={() => setCategoryFilter(cat)}
          />
        ))}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 13,
            color: '#64748b',
            marginTop: 4,
          }}
        >
          Showing {filtered.length} of {TECHNOLOGIES.length} inventions
        </div>
      </nav>

      {/* ── Cards grid ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3, ease: 'easeOut' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      margin: 0,
                      color: '#f1f5f9',
                      lineHeight: 1.2,
                    }}
                  >
                    {tech.name}
                  </h3>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                    {tech.year} &mdash; {tech.inventor}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {tech.stillShaping && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 10,
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Still shaping the world
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 10,
                      backgroundColor: `${CATEGORY_COLORS[tech.category]}22`,
                      color: CATEGORY_COLORS[tech.category],
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {CATEGORY_ICONS[tech.category]} {tech.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                {tech.description}
              </p>

              {/* Impact */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>IMPACT</div>
                <ImpactBar score={tech.impact} />
              </div>

              {/* What it made possible */}
              <div
                style={{
                  fontSize: 12,
                  color: '#94a3b8',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  padding: '8px 12px',
                }}
              >
                <span style={{ fontWeight: 700, color: '#cbd5e1' }}>Made possible: </span>
                {tech.madeItPossible}
              </div>

              {/* Search link */}
              <Link
                to={`/search?q=${encodeURIComponent(tech.searchQuery)}`}
                style={{
                  fontSize: 11,
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: 600,
                  alignSelf: 'flex-start',
                }}
              >
                Find in Chronicle \u2192
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Impact Ripple: Invention Chains ────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 64px',
        }}
      >
        <SectionHeading icon={'\u{1F30A}'} title="Impact Ripple — Invention Chains" />
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: -16, marginBottom: 24 }}>
          How one invention enabled the next, cascading across millennia.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {INVENTION_CHAINS.map((chain, ci) => (
            <motion.div
              key={chain.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ci * 0.08, duration: 0.3 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '16px 20px',
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: 10,
                }}
              >
                {chain.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {chain.steps.map((step, si) => (
                  <span key={si} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#cbd5e1',
                        padding: '4px 10px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(59,130,246,0.12)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {step}
                    </span>
                    {si < chain.steps.length - 1 && (
                      <span style={{ color: '#475569', fontSize: 14 }}>{'\u2192'}</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Most Transformative Top 10 ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 64px',
        }}
      >
        <SectionHeading icon={'\u{1F3C6}'} title="Most Transformative — Top 10" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOP_10_MOST_TRANSFORMATIVE.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor:
                    i === 0
                      ? 'rgba(245,158,11,0.2)'
                      : i === 1
                        ? 'rgba(148,163,184,0.2)'
                        : i === 2
                          ? 'rgba(180,120,60,0.2)'
                          : 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 900,
                  color:
                    i === 0
                      ? '#f59e0b'
                      : i === 1
                        ? '#94a3b8'
                        : i === 2
                          ? '#b4783c'
                          : '#64748b',
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
                  {tech.name}
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b', marginLeft: 8 }}>
                    {tech.year}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  {tech.inventor}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 10,
                  backgroundColor: `${CATEGORY_COLORS[tech.category]}22`,
                  color: CATEGORY_COLORS[tech.category],
                  whiteSpace: 'nowrap',
                }}
              >
                {CATEGORY_ICONS[tech.category]} {tech.category}
              </span>
              <ImpactBar score={tech.impact} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Still Shaping the World ────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 64px',
        }}
      >
        <SectionHeading icon={'\u{1F30D}'} title="Still Shaping the World" />
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: -16, marginBottom: 24 }}>
          {STILL_SHAPING.length} inventions whose impact continues to grow today.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {STILL_SHAPING.sort((a, b) => a.yearSort - b.yearSort).map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02, duration: 0.25 }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 20,
                backgroundColor: `${CATEGORY_COLORS[tech.category]}15`,
                border: `1px solid ${CATEGORY_COLORS[tech.category]}33`,
                color: CATEGORY_COLORS[tech.category],
                whiteSpace: 'nowrap',
              }}
            >
              {CATEGORY_ICONS[tech.category]} {tech.name}
              <span style={{ opacity: 0.6, marginLeft: 4 }}>({tech.year})</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '40px 24px 60px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            transition: 'background 0.15s',
          }}
        >
          \u2190 Back to Chronicle
        </Link>
      </footer>
    </div>
  );
}
