/**
 * Curated list of world-changing inventions and discoveries.
 * Each entry is editorially scored for impact (1–5 stars).
 */

export type InventionCategory =
  | 'Science'
  | 'Technology'
  | 'Medicine'
  | 'Communication'
  | 'Transportation'
  | 'Agriculture';

export type Era = 'Ancient' | 'Medieval' | 'Early Modern' | 'Industrial' | 'Modern' | 'Digital';

export interface Invention {
  name: string;
  inventor: string;
  year: number;
  yearLabel: string;
  origin: string;
  flag: string;
  category: InventionCategory;
  impact: number; // 1–5
  description: string;
  changedEverything: string;
  era: Era;
}

function era(year: number): Era {
  if (year < 500) return 'Ancient';
  if (year < 1500) return 'Medieval';
  if (year < 1760) return 'Early Modern';
  if (year < 1900) return 'Industrial';
  if (year < 2000) return 'Modern';
  return 'Digital';
}

export const INVENTIONS: Invention[] = [
  {
    name: 'Stone Tools',
    inventor: 'Early hominids',
    year: -3300000,
    yearLabel: 'c. 3,300,000 BCE',
    origin: 'East Africa',
    flag: '🌍',
    category: 'Technology',
    impact: 5,
    description:
      'The first deliberately shaped stone tools mark the dawn of technology itself. They enabled early hominids to process food, defend against predators, and reshape their environment.',
    changedEverything: 'Separated humans from every other species — tool-making defined us.',
    era: 'Ancient',
  },
  {
    name: 'Fire',
    inventor: 'Homo erectus',
    year: -1000000,
    yearLabel: 'c. 1,000,000 BCE',
    origin: 'Africa',
    flag: '🌍',
    category: 'Technology',
    impact: 5,
    description:
      'Controlled fire transformed human existence: cooked food unlocked more calories for brain growth, warmth extended habitable range, and light enabled social life after dark.',
    changedEverything: 'Fueled human evolution itself — literally rewired our biology.',
    era: 'Ancient',
  },
  {
    name: 'Agriculture',
    inventor: 'Neolithic peoples',
    year: -10000,
    yearLabel: 'c. 10,000 BCE',
    origin: 'Fertile Crescent',
    flag: '🇮🇶',
    category: 'Agriculture',
    impact: 5,
    description:
      'The deliberate cultivation of crops and domestication of animals ended nomadic life. Surplus food created specialization, hierarchy, cities, and civilization itself.',
    changedEverything: 'Made civilization possible — every city, empire, and nation flows from farming.',
    era: 'Ancient',
  },
  {
    name: 'The Wheel',
    inventor: 'Unknown',
    year: -3500,
    yearLabel: 'c. 3500 BCE',
    origin: 'Mesopotamia',
    flag: '🇮🇶',
    category: 'Technology',
    impact: 5,
    description:
      'First used for pottery, the wheel soon revolutionized transport, warfare, and manufacturing. It remains the most fundamental mechanical device ever invented.',
    changedEverything: 'The foundation of all mechanical movement — still in every vehicle on Earth.',
    era: 'Ancient',
  },
  {
    name: 'Writing / Cuneiform',
    inventor: 'Sumerians',
    year: -3200,
    yearLabel: 'c. 3200 BCE',
    origin: 'Sumer',
    flag: '🇮🇶',
    category: 'Communication',
    impact: 5,
    description:
      'Writing allowed knowledge to outlive its creators. Records, laws, literature, and science all depend on the ability to store information outside the human brain.',
    changedEverything: 'Created history itself — before writing, there was only prehistory.',
    era: 'Ancient',
  },
  {
    name: 'Bronze Metallurgy',
    inventor: 'Unknown',
    year: -3300,
    yearLabel: 'c. 3300 BCE',
    origin: 'Near East',
    flag: '🇮🇶',
    category: 'Technology',
    impact: 4,
    description:
      'Alloying copper with tin produced a metal hard enough for weapons, tools, and armor. Bronze enabled the first great empires and long-distance trade networks.',
    changedEverything: 'Launched the age of metal — transforming warfare, trade, and power structures.',
    era: 'Ancient',
  },
  {
    name: 'Iron Smelting',
    inventor: 'Hittites',
    year: -1200,
    yearLabel: 'c. 1200 BCE',
    origin: 'Anatolia',
    flag: '🇹🇷',
    category: 'Technology',
    impact: 4,
    description:
      'Iron was harder and more abundant than bronze. Its spread democratized metal tools and weapons, collapsing Bronze Age power structures and enabling new civilizations.',
    changedEverything: 'Cheap, strong metal for everyone — ended the aristocratic Bronze Age.',
    era: 'Ancient',
  },
  {
    name: 'The Alphabet',
    inventor: 'Phoenicians',
    year: -1050,
    yearLabel: 'c. 1050 BCE',
    origin: 'Phoenicia',
    flag: '🇱🇧',
    category: 'Communication',
    impact: 5,
    description:
      'By reducing writing to ~22 simple symbols representing sounds, the Phoenician alphabet made literacy accessible beyond scribal elites. It is the ancestor of Greek, Latin, Arabic, and most world scripts.',
    changedEverything: 'Democratized literacy — the DNA of almost every alphabet on Earth.',
    era: 'Ancient',
  },
  {
    name: 'Coinage',
    inventor: 'Lydians',
    year: -600,
    yearLabel: 'c. 600 BCE',
    origin: 'Lydia',
    flag: '🇹🇷',
    category: 'Technology',
    impact: 4,
    description:
      'Standardized metal coins with guaranteed weight replaced barter and commodity exchange, enabling complex economies, taxation, and market-based societies.',
    changedEverything: 'Invented money as we know it — the operating system of every economy since.',
    era: 'Ancient',
  },
  {
    name: 'Aqueducts',
    inventor: 'Roman engineers',
    year: -312,
    yearLabel: 'c. 312 BCE',
    origin: 'Rome',
    flag: '🇮🇹',
    category: 'Technology',
    impact: 3,
    description:
      'Roman aqueducts carried fresh water over vast distances using gravity alone. They enabled cities of a million people and set the standard for civil engineering for two millennia.',
    changedEverything: 'Made megacities possible — clean water is the foundation of urban life.',
    era: 'Ancient',
  },
  {
    name: 'Paper',
    inventor: 'Cai Lun',
    year: 105,
    yearLabel: '105 CE',
    origin: 'China',
    flag: '🇨🇳',
    category: 'Communication',
    impact: 4,
    description:
      'Cheap, lightweight paper replaced silk and bamboo for writing. It spread literacy, bureaucracy, and eventually printing across the world, becoming the substrate of human knowledge.',
    changedEverything: 'Made knowledge portable and cheap — the first information revolution.',
    era: 'Ancient',
  },
  {
    name: 'Gunpowder',
    inventor: 'Chinese alchemists',
    year: 850,
    yearLabel: 'c. 850 CE',
    origin: 'China',
    flag: '🇨🇳',
    category: 'Technology',
    impact: 5,
    description:
      'Originally discovered during alchemical experiments seeking immortality, gunpowder forever transformed warfare. Cannons ended the age of castles; muskets ended the age of knights.',
    changedEverything: 'Redrew the map of power — no castle wall or armored knight could resist it.',
    era: 'Medieval',
  },
  {
    name: 'Compass',
    inventor: 'Chinese navigators',
    year: 1088,
    yearLabel: 'c. 1088 CE',
    origin: 'China',
    flag: '🇨🇳',
    category: 'Transportation',
    impact: 4,
    description:
      'The magnetic compass freed sailors from coastal navigation and star-dependent voyages. It enabled the Age of Exploration, connecting continents and creating the first global economy.',
    changedEverything: 'Made open-ocean navigation possible — the Age of Exploration followed.',
    era: 'Medieval',
  },
  {
    name: 'Printing Press',
    inventor: 'Johannes Gutenberg',
    year: 1440,
    yearLabel: '1440',
    origin: 'Germany',
    flag: '🇩🇪',
    category: 'Communication',
    impact: 5,
    description:
      'Movable-type printing reduced the cost of books by 80% within decades. It fueled the Renaissance, the Reformation, and the Scientific Revolution by putting knowledge in millions of hands.',
    changedEverything: 'Broke the Church\'s monopoly on knowledge — sparked every revolution that followed.',
    era: 'Early Modern',
  },
  {
    name: 'Telescope',
    inventor: 'Hans Lippershey / Galileo',
    year: 1608,
    yearLabel: '1608',
    origin: 'Netherlands / Italy',
    flag: '🇳🇱',
    category: 'Science',
    impact: 4,
    description:
      'The telescope revealed that Earth was not the center of the universe. Galileo\'s observations of Jupiter\'s moons and lunar craters shattered centuries of geocentric dogma.',
    changedEverything: 'Proved the cosmos is bigger than we imagined — the birth of modern astronomy.',
    era: 'Early Modern',
  },
  {
    name: 'Steam Engine',
    inventor: 'James Watt',
    year: 1769,
    yearLabel: '1769',
    origin: 'Britain',
    flag: '🇬🇧',
    category: 'Technology',
    impact: 5,
    description:
      'Watt\'s improved steam engine converted heat into reliable mechanical power. It drove the Industrial Revolution — factories, railways, and steamships reshaped the world.',
    changedEverything: 'Replaced muscle with machine — launched the Industrial Revolution.',
    era: 'Industrial',
  },
  {
    name: 'Vaccination',
    inventor: 'Edward Jenner',
    year: 1796,
    yearLabel: '1796',
    origin: 'Britain',
    flag: '🇬🇧',
    category: 'Medicine',
    impact: 5,
    description:
      'Jenner demonstrated that cowpox exposure could prevent smallpox, creating the concept of vaccination. This single idea has saved more lives than any other medical innovation in history.',
    changedEverything: 'Gave humanity the power to eradicate diseases — billions of lives saved.',
    era: 'Industrial',
  },
  {
    name: 'Photography',
    inventor: 'Nicéphore Niépce',
    year: 1826,
    yearLabel: '1826',
    origin: 'France',
    flag: '🇫🇷',
    category: 'Technology',
    impact: 3,
    description:
      'The first permanent photograph captured light itself as a record. Photography transformed journalism, science, art, and personal memory — and eventually led to cinema and television.',
    changedEverything: 'Froze time — for the first time, we could see the past exactly as it was.',
    era: 'Industrial',
  },
  {
    name: 'Telegraph',
    inventor: 'Samuel Morse',
    year: 1844,
    yearLabel: '1844',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Communication',
    impact: 4,
    description:
      'The electric telegraph was the first technology to transmit information faster than a horse could carry it. It shrank the world, connecting cities and continents in seconds.',
    changedEverything: 'Separated communication from transportation for the first time ever.',
    era: 'Industrial',
  },
  {
    name: 'Anesthesia',
    inventor: 'William Morton',
    year: 1846,
    yearLabel: '1846',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Medicine',
    impact: 4,
    description:
      'The first public demonstration of ether anesthesia transformed surgery from brutal butchery into precise medicine. Operations that once lasted seconds could now take hours.',
    changedEverything: 'Made modern surgery possible — ended thousands of years of surgical agony.',
    era: 'Industrial',
  },
  {
    name: 'Evolution Theory',
    inventor: 'Charles Darwin',
    year: 1859,
    yearLabel: '1859',
    origin: 'Britain',
    flag: '🇬🇧',
    category: 'Science',
    impact: 5,
    description:
      'Darwin\'s theory of evolution by natural selection unified all of biology. It explained the diversity of life without supernatural intervention and remains the central framework of life sciences.',
    changedEverything: 'Explained life itself — the most powerful idea in the history of science.',
    era: 'Industrial',
  },
  {
    name: 'Telephone',
    inventor: 'Alexander Graham Bell',
    year: 1876,
    yearLabel: '1876',
    origin: 'United States / Canada',
    flag: '🇺🇸',
    category: 'Communication',
    impact: 4,
    description:
      'The telephone transmitted the human voice over wires, creating real-time remote conversation. It transformed business, social life, and emergency response within a generation.',
    changedEverything: 'Made distance irrelevant for human conversation — the first real-time network.',
    era: 'Industrial',
  },
  {
    name: 'Light Bulb',
    inventor: 'Thomas Edison',
    year: 1879,
    yearLabel: '1879',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 4,
    description:
      'The practical incandescent light bulb banished darkness from indoor life. It extended productive hours, enabled nightlife, and drove the buildout of electrical grids worldwide.',
    changedEverything: 'Conquered darkness — restructured human life around 24-hour availability.',
    era: 'Industrial',
  },
  {
    name: 'Automobile',
    inventor: 'Karl Benz',
    year: 1885,
    yearLabel: '1885',
    origin: 'Germany',
    flag: '🇩🇪',
    category: 'Transportation',
    impact: 4,
    description:
      'The Benz Patent-Motorwagen was the first true automobile. Cars reshaped cities, created suburbs, built economies, and became the dominant form of personal transport worldwide.',
    changedEverything: 'Gave individuals freedom of movement — reshaping cities, economies, and culture.',
    era: 'Industrial',
  },
  {
    name: 'X-rays',
    inventor: 'Wilhelm Röntgen',
    year: 1895,
    yearLabel: '1895',
    origin: 'Germany',
    flag: '🇩🇪',
    category: 'Science',
    impact: 4,
    description:
      'Röntgen\'s discovery of X-rays allowed doctors to see inside the living body for the first time. It revolutionized medical diagnosis and opened the door to modern physics.',
    changedEverything: 'Gave medicine eyes — seeing inside the body without cutting it open.',
    era: 'Industrial',
  },
  {
    name: 'Radio',
    inventor: 'Guglielmo Marconi',
    year: 1895,
    yearLabel: '1895',
    origin: 'Italy',
    flag: '🇮🇹',
    category: 'Communication',
    impact: 4,
    description:
      'Wireless telegraphy freed communication from physical wires. Radio became the first mass medium, broadcasting news, music, and propaganda to millions simultaneously.',
    changedEverything: 'Created mass media — one voice could reach millions for the first time.',
    era: 'Industrial',
  },
  {
    name: 'Airplane',
    inventor: 'Wright Brothers',
    year: 1903,
    yearLabel: '1903',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Transportation',
    impact: 5,
    description:
      'The Wright Flyer achieved sustained, controlled, heavier-than-air flight. Within 66 years, humans walked on the Moon. Aviation shrank the world and transformed warfare, commerce, and culture.',
    changedEverything: 'Conquered the sky — made the entire planet accessible within hours.',
    era: 'Modern',
  },
  {
    name: 'Penicillin',
    inventor: 'Alexander Fleming',
    year: 1928,
    yearLabel: '1928',
    origin: 'Britain',
    flag: '🇬🇧',
    category: 'Medicine',
    impact: 5,
    description:
      'Fleming\'s accidental discovery of penicillin launched the antibiotic era. Infections that were death sentences became curable, saving hundreds of millions of lives.',
    changedEverything: 'Turned deadly infections into minor inconveniences — the antibiotic revolution.',
    era: 'Modern',
  },
  {
    name: 'Nuclear Fission',
    inventor: 'Hahn, Meitner & Strassmann',
    year: 1938,
    yearLabel: '1938',
    origin: 'Germany',
    flag: '🇩🇪',
    category: 'Science',
    impact: 5,
    description:
      'Splitting the atom released enormous energy, leading to both nuclear weapons and nuclear power. It reshaped geopolitics, created the Cold War, and offered a carbon-free energy source.',
    changedEverything: 'Gave humanity godlike power — both to destroy and to generate limitless energy.',
    era: 'Modern',
  },
  {
    name: 'DNA Structure',
    inventor: 'Watson & Crick',
    year: 1953,
    yearLabel: '1953',
    origin: 'Britain',
    flag: '🇬🇧',
    category: 'Science',
    impact: 5,
    description:
      'The discovery of DNA\'s double helix revealed how genetic information is stored and copied. It launched molecular biology, genetic engineering, forensics, and personalized medicine.',
    changedEverything: 'Decoded the language of life — the blueprint behind every living thing.',
    era: 'Modern',
  },
  {
    name: 'The Internet (ARPANET)',
    inventor: 'DARPA',
    year: 1969,
    yearLabel: '1969',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Communication',
    impact: 5,
    description:
      'ARPANET\'s first packet-switched message connected two computers across California. The network grew into the Internet — the most transformative communication system since writing.',
    changedEverything: 'Connected all human knowledge and every person — the nervous system of civilization.',
    era: 'Modern',
  },
  {
    name: 'Personal Computer',
    inventor: 'Altair / Apple / IBM',
    year: 1975,
    yearLabel: '1975',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 5,
    description:
      'The Altair 8800 and its successors put computing power on every desk. Personal computers democratized information processing, creativity, and eventually access to the entire Internet.',
    changedEverything: 'Put a supercomputer on every desk — empowered billions to create and connect.',
    era: 'Modern',
  },
  {
    name: 'World Wide Web',
    inventor: 'Tim Berners-Lee',
    year: 1991,
    yearLabel: '1991',
    origin: 'Switzerland / Britain',
    flag: '🇬🇧',
    category: 'Communication',
    impact: 5,
    description:
      'Berners-Lee\'s invention of HTML, URLs, and HTTP created a user-friendly layer atop the Internet. The Web made information universally accessible and spawned the digital economy.',
    changedEverything: 'Made the Internet usable for everyone — the platform for modern civilization.',
    era: 'Modern',
  },
  {
    name: 'GPS',
    inventor: 'U.S. Department of Defense',
    year: 1995,
    yearLabel: '1995',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 3,
    description:
      'The Global Positioning System made precise location available anywhere on Earth. It transformed navigation, logistics, agriculture, and enabled location-based services on every smartphone.',
    changedEverything: 'Made "lost" obsolete — precise location became a basic human capability.',
    era: 'Modern',
  },
  {
    name: 'Human Genome Project',
    inventor: 'International consortium',
    year: 2003,
    yearLabel: '2003',
    origin: 'International',
    flag: '🌍',
    category: 'Science',
    impact: 4,
    description:
      'Mapping all 3 billion base pairs of human DNA took 13 years and $2.7 billion. It created the foundation for personalized medicine, gene therapy, and modern genomics.',
    changedEverything: 'Read the complete book of human life — the foundation of 21st-century medicine.',
    era: 'Digital',
  },
  {
    name: 'Smartphone',
    inventor: 'Apple (iPhone)',
    year: 2007,
    yearLabel: '2007',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 5,
    description:
      'The iPhone combined a phone, computer, camera, and Internet access into a pocket-sized device. Smartphones put the entirety of human knowledge in billions of hands worldwide.',
    changedEverything: 'Put a supercomputer in every pocket — reshaped how 5 billion people live.',
    era: 'Digital',
  },
  {
    name: 'CRISPR',
    inventor: 'Doudna & Charpentier',
    year: 2012,
    yearLabel: '2012',
    origin: 'United States / Sweden',
    flag: '🇺🇸',
    category: 'Science',
    impact: 4,
    description:
      'CRISPR-Cas9 gene editing made it cheap and precise to modify DNA in any organism. It promises cures for genetic diseases, new crops, and raises profound ethical questions.',
    changedEverything: 'Gave us the power to rewrite the code of life — editing genes like text.',
    era: 'Digital',
  },
  {
    name: 'ChatGPT / Large Language Models',
    inventor: 'OpenAI / Google / Anthropic',
    year: 2022,
    yearLabel: '2022',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 4,
    description:
      'Large language models demonstrated that machines can generate human-quality text, code, and reasoning. They are transforming knowledge work, education, and the nature of expertise.',
    changedEverything: 'Made AI a creative partner — the beginning of the intelligence revolution.',
    era: 'Digital',
  },
  {
    name: 'Electricity',
    inventor: 'Faraday / Tesla / Edison',
    year: 1882,
    yearLabel: '1882',
    origin: 'Britain / United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 5,
    description:
      'The generation and distribution of electrical power transformed every aspect of modern life. Factories, homes, hospitals, and cities all run on the invisible force harnessed in the 19th century.',
    changedEverything: 'Powers everything — modern civilization literally runs on electricity.',
    era: 'Industrial',
  },
  {
    name: 'Semiconductor / Transistor',
    inventor: 'Bardeen, Brattain & Shockley',
    year: 1947,
    yearLabel: '1947',
    origin: 'United States',
    flag: '🇺🇸',
    category: 'Technology',
    impact: 5,
    description:
      'The transistor replaced vacuum tubes with tiny, reliable, solid-state switches. It is the fundamental building block of all modern electronics — from radios to supercomputers.',
    changedEverything: 'The atom of the digital age — every computer chip is built from transistors.',
    era: 'Modern',
  },
  {
    name: 'Concrete',
    inventor: 'Roman engineers',
    year: -300,
    yearLabel: 'c. 300 BCE',
    origin: 'Rome',
    flag: '🇮🇹',
    category: 'Technology',
    impact: 3,
    description:
      'Roman concrete (opus caementicium) could set underwater and lasted millennia. Modern Portland cement concrete is the most widely used material on Earth after water.',
    changedEverything: 'Built the modern world — the most used construction material in human history.',
    era: 'Ancient',
  },
  {
    name: 'Refrigeration',
    inventor: 'Carl von Linden',
    year: 1876,
    yearLabel: '1876',
    origin: 'Germany',
    flag: '🇩🇪',
    category: 'Technology',
    impact: 3,
    description:
      'Mechanical refrigeration broke the ancient dependence on seasons and locality for food. It enabled global food supply chains, modern medicine, and air conditioning.',
    changedEverything: 'Conquered spoilage — fresh food and medicine available everywhere, year-round.',
    era: 'Industrial',
  },
];

/** Category → color mapping for badges */
export const CATEGORY_COLORS: Record<InventionCategory, string> = {
  Science: '#3b82f6',
  Technology: '#8b5cf6',
  Medicine: '#22c55e',
  Communication: '#f59e0b',
  Transportation: '#f97316',
  Agriculture: '#16a34a',
};

/** Era → color mapping */
export const ERA_COLORS: Record<Era, string> = {
  Ancient: '#8b5cf6',
  Medieval: '#f59e0b',
  'Early Modern': '#f97316',
  Industrial: '#ef4444',
  Modern: '#3b82f6',
  Digital: '#22c55e',
};
