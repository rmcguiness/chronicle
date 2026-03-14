/**
 * GLOSSARY_TERMS — static dataset powering the /glossary page.
 *
 * Each entry contains a historical term, its category, definition,
 * optional pronunciation, and related term references.
 *
 * Categories: time, political, warfare, religion, economy, culture
 */

/** Glossary term category. */
export type GlossaryCategory =
  | 'time'
  | 'political'
  | 'warfare'
  | 'religion'
  | 'economy'
  | 'culture';

/** A single glossary entry. */
export interface GlossaryTerm {
  /** Display term (title-cased). */
  term: string;
  /** Optional IPA or informal pronunciation guide. */
  pronunciation?: string;
  /** 2-4 sentence definition. */
  definition: string;
  /** Category tag for filtering. */
  category: GlossaryCategory;
  /** Related term names — must match other entries' `term` field exactly. */
  relatedTerms: string[];
}

/** Human-readable labels for each category. */
export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  time: 'Time & Dating',
  political: 'Political Systems',
  warfare: 'Warfare',
  religion: 'Religion & Philosophy',
  economy: 'Economy & Trade',
  culture: 'Culture & Society',
};

/** Accent colour per category (matches Chronicle palette). */
export const GLOSSARY_CATEGORY_COLORS: Record<GlossaryCategory, string> = {
  time: '#3b82f6',
  political: '#a855f7',
  warfare: '#ef4444',
  religion: '#eab308',
  economy: '#22c55e',
  culture: '#f97316',
};

/** Fun historical facts interspersed between entries. */
export const DID_YOU_KNOW_FACTS: string[] = [
  'The term "Byzantine" was never used by the Byzantines themselves — they called their state the Roman Empire.',
  'The oldest known written law code is the Code of Hammurabi (c. 1754 BCE), inscribed on a seven-foot basalt stele.',
  'The word "democracy" comes from Greek dēmokratía — dêmos (people) + krátos (power).',
  'The Silk Road was not a single road but a vast network of overland and maritime routes spanning over 4,000 miles.',
  'The term "Dark Ages" was coined by the Italian scholar Petrarch in the 1330s and is now considered misleading by historians.',
  'Ancient Rome had a population of over one million people by 1 CE — a number no European city matched until London in the 19th century.',
  'The word "feudalism" was never used during the medieval period itself; it was coined by scholars in the 17th century.',
  'Cleopatra VII lived closer in time to the Moon landing (1969) than to the construction of the Great Pyramid of Giza (c. 2560 BCE).',
];

/** Complete glossary dataset — 85 terms. */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ── TIME & DATING ──────────────────────────────────────────────────────
  {
    term: 'Anno Domini (AD)',
    pronunciation: 'AH-no DOM-ih-nee',
    definition:
      'Latin for "in the year of the Lord." The traditional Western calendar system counting years from the estimated birth of Jesus Christ. Now often replaced by CE (Common Era) in academic writing.',
    category: 'time',
    relatedTerms: ['BCE', 'CE', 'Circa'],
  },
  {
    term: 'BCE',
    definition:
      'Before Common Era — years counted backward from year 1. Equivalent to BC (Before Christ) but uses a religiously neutral label. 500 BCE means 500 years before year 1.',
    category: 'time',
    relatedTerms: ['CE', 'Anno Domini (AD)', 'Circa'],
  },
  {
    term: 'CE',
    definition:
      'Common Era — the modern calendar system starting from year 1. Functionally identical to AD but preferred in secular and academic contexts.',
    category: 'time',
    relatedTerms: ['BCE', 'Anno Domini (AD)'],
  },
  {
    term: 'Century',
    definition:
      'A period of 100 years. Centuries are numbered one ahead of the year: the 15th century covers 1401–1500 CE. This offset frequently confuses readers encountering historical dates for the first time.',
    category: 'time',
    relatedTerms: ['Decade', 'Millennium'],
  },
  {
    term: 'Chronology',
    definition:
      'The arrangement of events in the order they occurred. Establishing accurate chronology is a core task of historical scholarship, relying on primary sources, radiocarbon dating, and cross-referencing multiple records.',
    category: 'time',
    relatedTerms: ['Primary Source', 'Circa'],
  },
  {
    term: 'Circa',
    pronunciation: 'SUR-kuh',
    definition:
      'Latin for "approximately." Written as c. or ca., it is used when exact dates are unknown, e.g. "c. 450 BCE." Common in ancient and medieval history where precise records are scarce.',
    category: 'time',
    relatedTerms: ['BCE', 'CE', 'Chronology'],
  },
  {
    term: 'Decade',
    definition:
      'A period of 10 years. Often used informally to characterize cultural or political eras — "the Roaring Twenties" refers to the 1920s decade.',
    category: 'time',
    relatedTerms: ['Century', 'Millennium'],
  },
  {
    term: 'Epoch',
    definition:
      'A distinct period of history defined by notable events or characteristics. In geology it refers to subdivisions of geological periods; in history it marks turning points like the Industrial Revolution.',
    category: 'time',
    relatedTerms: ['Era', 'Millennium'],
  },
  {
    term: 'Era',
    definition:
      'A long, distinct period of history with a unifying theme. Unlike epochs, eras tend to be broader — the "Classical Era" or "Modern Era" span centuries and encompass multiple civilizations.',
    category: 'time',
    relatedTerms: ['Epoch', 'Century'],
  },
  {
    term: 'Millennium',
    definition:
      'A period of 1,000 years. The concept gained popular attention around the year 2000 CE, but historians use it to frame large-scale patterns like the rise and fall of civilizations.',
    category: 'time',
    relatedTerms: ['Century', 'Decade', 'Era'],
  },

  // ── POLITICAL SYSTEMS ──────────────────────────────────────────────────
  {
    term: 'Absolutism',
    definition:
      'A political system where a single ruler holds unrestricted power, not limited by law or legislature. Best exemplified by Louis XIV of France, who reportedly declared "L\'état, c\'est moi" (I am the state).',
    category: 'political',
    relatedTerms: ['Monarchy', 'Despotism', 'Constitutionalism'],
  },
  {
    term: 'Bureaucracy',
    definition:
      'A system of government administration through specialized departments staffed by non-elected officials. Ancient China\'s civil service examinations created one of history\'s earliest meritocratic bureaucracies.',
    category: 'political',
    relatedTerms: ['Republic', 'Empire', 'Dynasty'],
  },
  {
    term: 'City-state',
    definition:
      'An independent political unit consisting of a city and its surrounding territory. Ancient Greek poleis like Athens and Sparta, and later Italian states like Venice and Florence, are classic examples.',
    category: 'political',
    relatedTerms: ['Democracy', 'Republic', 'Sovereignty'],
  },
  {
    term: 'Constitutionalism',
    definition:
      'The principle that government authority derives from and is limited by a body of fundamental law. The Magna Carta (1215) and the U.S. Constitution (1787) are landmark documents in this tradition.',
    category: 'political',
    relatedTerms: ['Republic', 'Democracy', 'Absolutism'],
  },
  {
    term: 'Democracy',
    pronunciation: 'deh-MOK-ruh-see',
    definition:
      'A system of government where citizens vote to make decisions or elect leaders. Originating in Athens around 508 BCE, it initially excluded women, slaves, and non-citizens from participation.',
    category: 'political',
    relatedTerms: ['Republic', 'Oligarchy', 'City-state'],
  },
  {
    term: 'Despotism',
    definition:
      'Rule by a single authority wielding absolute power, often exercised cruelly. Distinguished from absolutism by the implication of tyrannical or oppressive governance without regard for subjects\' welfare.',
    category: 'political',
    relatedTerms: ['Absolutism', 'Monarchy', 'Theocracy'],
  },
  {
    term: 'Dynasty',
    pronunciation: 'DY-nuh-stee',
    definition:
      'A sequence of rulers from the same family, often spanning centuries. Examples include China\'s Han Dynasty (206 BCE – 220 CE), England\'s Tudor Dynasty, and Egypt\'s Ptolemaic Dynasty.',
    category: 'political',
    relatedTerms: ['Monarchy', 'Empire', 'Succession'],
  },
  {
    term: 'Empire',
    definition:
      'A large political unit ruled by an emperor or single authority, often encompassing diverse peoples and territories. Empires from Rome to the Mongols shaped trade, culture, and borders across continents.',
    category: 'political',
    relatedTerms: ['Imperialism', 'Colonialism', 'Dynasty'],
  },
  {
    term: 'Feudalism',
    pronunciation: 'FYOO-duh-liz-um',
    definition:
      'The dominant medieval European social system in which lords granted land (fiefs) to vassals in exchange for military service and loyalty. It created a rigid hierarchy from kings to serfs.',
    category: 'political',
    relatedTerms: ['Monarchy', 'Serfdom', 'Vassal'],
  },
  {
    term: 'Monarchy',
    pronunciation: 'MON-ar-kee',
    definition:
      'Rule by a single hereditary ruler — king, queen, or emperor. Monarchies range from absolute (unlimited royal power) to constitutional (power constrained by law and parliament).',
    category: 'political',
    relatedTerms: ['Absolutism', 'Dynasty', 'Constitutionalism'],
  },
  {
    term: 'Oligarchy',
    pronunciation: 'OL-ih-gar-kee',
    definition:
      'Rule by a small group of powerful elites, often based on wealth, military power, or family status. Sparta\'s dual kingship and council of elders is a classic ancient example.',
    category: 'political',
    relatedTerms: ['Democracy', 'Republic', 'Aristocracy'],
  },
  {
    term: 'Republic',
    definition:
      'A system of government where power is held by elected representatives of the people rather than a monarch. The Roman Republic (509–27 BCE) is the most influential historical example.',
    category: 'political',
    relatedTerms: ['Democracy', 'Constitutionalism', 'Oligarchy'],
  },
  {
    term: 'Sovereignty',
    pronunciation: 'SOV-rin-tee',
    definition:
      'Supreme authority within a territory. The concept became central to international relations after the Peace of Westphalia (1648), which established the principle of non-interference in sovereign states.',
    category: 'political',
    relatedTerms: ['City-state', 'Empire', 'Treaty'],
  },
  {
    term: 'Succession',
    definition:
      'The process by which power passes from one ruler to the next. Disputed successions have triggered major conflicts, from the English Wars of the Roses to the War of the Spanish Succession.',
    category: 'political',
    relatedTerms: ['Dynasty', 'Monarchy', 'Civil War'],
  },
  {
    term: 'Theocracy',
    pronunciation: 'thee-OK-ruh-see',
    definition:
      'A government ruled by religious authorities or in the name of a deity. Ancient Egypt, the Papal States, and Puritan Massachusetts all exhibit theocratic elements.',
    category: 'political',
    relatedTerms: ['Monarchy', 'Monotheism', 'Despotism'],
  },
  {
    term: 'Vassal',
    pronunciation: 'VAS-ul',
    definition:
      'A person granted land by a lord in exchange for military service and loyalty under the feudal system. Vassals could themselves grant land to sub-vassals, creating chains of obligation.',
    category: 'political',
    relatedTerms: ['Feudalism', 'Serfdom', 'Monarchy'],
  },

  // ── WARFARE ────────────────────────────────────────────────────────────
  {
    term: 'Armistice',
    pronunciation: 'AR-mih-stis',
    definition:
      'A temporary halt to fighting agreed upon by both sides, often preceding formal peace negotiations. The armistice of November 11, 1918 ended World War I combat on the Western Front.',
    category: 'warfare',
    relatedTerms: ['Treaty', 'Siege', 'Civil War'],
  },
  {
    term: 'Blockade',
    definition:
      'The sealing off of a port, city, or region to prevent goods and people from entering or leaving. Naval blockades were decisive in wars from the Napoleonic era through both World Wars.',
    category: 'warfare',
    relatedTerms: ['Siege', 'Armistice', 'Cavalry'],
  },
  {
    term: 'Cavalry',
    pronunciation: 'KAV-ul-ree',
    definition:
      'Soldiers who fight on horseback. From ancient Persia\'s mounted archers to medieval knights, cavalry dominated warfare until machine guns and trenches made mounted charges obsolete in World War I.',
    category: 'warfare',
    relatedTerms: ['Infantry', 'Mercenary', 'Siege'],
  },
  {
    term: 'Civil War',
    definition:
      'An armed conflict between organized groups within the same country or political entity. Notable examples include the American Civil War (1861–65), the English Civil War (1642–51), and the Roman civil wars.',
    category: 'warfare',
    relatedTerms: ['Revolution', 'Armistice', 'Succession'],
  },
  {
    term: 'Conscription',
    definition:
      'Compulsory enrollment of citizens into military service. While ancient civilizations practiced it, modern mass conscription began with the French Revolution\'s levée en masse of 1793.',
    category: 'warfare',
    relatedTerms: ['Infantry', 'Mercenary', 'Revolution'],
  },
  {
    term: 'Crusade',
    definition:
      'A series of medieval Christian military campaigns (1096–1291) aimed at reclaiming the Holy Land from Muslim rule. The term later broadened to describe any religiously motivated military expedition.',
    category: 'warfare',
    relatedTerms: ['Siege', 'Monotheism', 'Schism'],
  },
  {
    term: 'Guerrilla Warfare',
    pronunciation: 'guh-RIL-uh',
    definition:
      'Irregular military tactics using ambushes, sabotage, and hit-and-run attacks by small, mobile forces. The term originated during the Peninsular War (1807–14) from Spanish guerrilleros fighting Napoleon.',
    category: 'warfare',
    relatedTerms: ['Infantry', 'Revolution', 'Mercenary'],
  },
  {
    term: 'Infantry',
    definition:
      'Foot soldiers who fight on the ground, historically the backbone of most armies. From Roman legionaries to modern mechanized infantry, foot soldiers have decided the outcome of most battles.',
    category: 'warfare',
    relatedTerms: ['Cavalry', 'Conscription', 'Siege'],
  },
  {
    term: 'Mercenary',
    pronunciation: 'MUR-suh-nair-ee',
    definition:
      'A soldier who fights for pay rather than loyalty to a cause or nation. Swiss mercenaries, Hessian soldiers, and Italian condottieri played major roles in European warfare for centuries.',
    category: 'warfare',
    relatedTerms: ['Cavalry', 'Infantry', 'Conscription'],
  },
  {
    term: 'Siege',
    definition:
      'A military operation to surround and cut off a fortified city or position to force its surrender. Famous sieges include Constantinople (1453), Masada (73 CE), and Stalingrad (1942–43).',
    category: 'warfare',
    relatedTerms: ['Blockade', 'Armistice', 'Infantry'],
  },
  {
    term: 'Treaty',
    definition:
      'A formal agreement between states or rulers, often ending a war or establishing trade terms. The Treaty of Westphalia (1648), Treaty of Versailles (1919), and Treaty of Tordesillas (1494) reshaped the world.',
    category: 'warfare',
    relatedTerms: ['Armistice', 'Sovereignty', 'Alliance'],
  },

  // ── RELIGION & PHILOSOPHY ──────────────────────────────────────────────
  {
    term: 'Animism',
    pronunciation: 'AN-ih-miz-um',
    definition:
      'The belief that natural objects, phenomena, and the universe itself possess souls or spiritual essence. One of humanity\'s oldest religious frameworks, found in indigenous traditions across every continent.',
    category: 'religion',
    relatedTerms: ['Polytheism', 'Monotheism', 'Shamanism'],
  },
  {
    term: 'Asceticism',
    pronunciation: 'uh-SET-ih-siz-um',
    definition:
      'The practice of severe self-discipline and abstinence from worldly pleasures, often for spiritual purposes. Found across Buddhism, Christianity, Hinduism, and Jainism.',
    category: 'religion',
    relatedTerms: ['Monasticism', 'Stoicism', 'Reformation'],
  },
  {
    term: 'Dogma',
    pronunciation: 'DOG-muh',
    definition:
      'A set of principles laid down by an authority as incontrovertibly true. In religion, dogma represents core beliefs that adherents are expected to accept without question.',
    category: 'religion',
    relatedTerms: ['Schism', 'Reformation', 'Theocracy'],
  },
  {
    term: 'Enlightenment',
    definition:
      'The 17th–18th century European intellectual movement emphasizing reason, science, and individual rights over tradition and authority. Thinkers like Locke, Voltaire, and Kant reshaped philosophy, politics, and science.',
    category: 'religion',
    relatedTerms: ['Renaissance', 'Revolution', 'Democracy'],
  },
  {
    term: 'Heresy',
    pronunciation: 'HAIR-uh-see',
    definition:
      'A belief or opinion that contradicts the official doctrine of an established religion. In medieval Europe, heresy was a criminal offense punishable by excommunication or death.',
    category: 'religion',
    relatedTerms: ['Dogma', 'Schism', 'Reformation'],
  },
  {
    term: 'Monasticism',
    pronunciation: 'muh-NAS-tih-siz-um',
    definition:
      'A religious way of life involving renouncing worldly pursuits to devote oneself to spiritual work. Christian monasteries and Buddhist monasteries preserved learning and culture for centuries.',
    category: 'religion',
    relatedTerms: ['Asceticism', 'Reformation', 'Schism'],
  },
  {
    term: 'Monotheism',
    pronunciation: 'MON-oh-thee-iz-um',
    definition:
      'Belief in a single all-powerful god. The three major monotheistic religions — Judaism, Christianity, and Islam — share roots in the ancient Near East and have shaped world history profoundly.',
    category: 'religion',
    relatedTerms: ['Polytheism', 'Theocracy', 'Schism'],
  },
  {
    term: 'Polytheism',
    pronunciation: 'POL-ee-thee-iz-um',
    definition:
      'Belief in multiple gods, each often governing different aspects of life and nature. Ancient Greek, Roman, Egyptian, Hindu, and Norse religions are prominent polytheistic traditions.',
    category: 'religion',
    relatedTerms: ['Monotheism', 'Animism', 'Mythology'],
  },
  {
    term: 'Reformation',
    definition:
      'The 16th-century religious movement that split Western Christianity into Catholic and Protestant branches. Sparked by Martin Luther\'s 95 Theses (1517), it reshaped European politics, culture, and warfare.',
    category: 'religion',
    relatedTerms: ['Schism', 'Heresy', 'Monasticism'],
  },
  {
    term: 'Schism',
    pronunciation: 'SIZ-um',
    definition:
      'A formal division within a religion or organization. The Great Schism of 1054 split Christianity into Roman Catholic and Eastern Orthodox churches, a divide that persists today.',
    category: 'religion',
    relatedTerms: ['Reformation', 'Heresy', 'Monotheism'],
  },
  {
    term: 'Shamanism',
    pronunciation: 'SHAH-muh-niz-um',
    definition:
      'A practice centered on a shaman — a person believed to interact with the spirit world through altered states of consciousness. Found in Siberian, Native American, and many other indigenous traditions.',
    category: 'religion',
    relatedTerms: ['Animism', 'Polytheism'],
  },
  {
    term: 'Stoicism',
    pronunciation: 'STOH-ih-siz-um',
    definition:
      'Ancient Greek philosophy teaching virtue, reason, and acceptance of fate as the path to a good life. Founded by Zeno of Citium (c. 300 BCE), it influenced Roman leaders like Marcus Aurelius.',
    category: 'religion',
    relatedTerms: ['Enlightenment', 'Asceticism'],
  },

  // ── ECONOMY & TRADE ────────────────────────────────────────────────────
  {
    term: 'Agrarian',
    definition:
      'Relating to farming and land cultivation. Most pre-industrial societies were agrarian, with the majority of the population engaged in agriculture. Agrarian reforms have triggered revolutions throughout history.',
    category: 'economy',
    relatedTerms: ['Serfdom', 'Feudalism', 'Industrialization'],
  },
  {
    term: 'Barter',
    definition:
      'Direct exchange of goods or services without using money. Barter was the primary form of trade before the invention of coinage around 600 BCE in Lydia (modern Turkey).',
    category: 'economy',
    relatedTerms: ['Silk Road', 'Guild', 'Mercantilism'],
  },
  {
    term: 'Colonialism',
    definition:
      'Control and exploitation of foreign territories by a stronger nation, extracting resources and imposing cultural norms. European colonialism from the 15th to 20th centuries reshaped global demographics, borders, and economies.',
    category: 'economy',
    relatedTerms: ['Imperialism', 'Mercantilism', 'Hegemony'],
  },
  {
    term: 'Famine',
    definition:
      'Widespread scarcity of food causing mass hunger and death. Major famines — from the Irish Potato Famine (1845–52) to the Bengal Famine (1943) — have been caused by crop failure, war, and policy failures.',
    category: 'economy',
    relatedTerms: ['Agrarian', 'Migration', 'Inflation'],
  },
  {
    term: 'Guild',
    definition:
      'A medieval organization of craftsmen or merchants who controlled a particular trade in a city. Guilds regulated prices, quality, and training through apprenticeship systems that lasted for centuries.',
    category: 'economy',
    relatedTerms: ['Mercantilism', 'Feudalism', 'Industrialization'],
  },
  {
    term: 'Industrialization',
    definition:
      'The transformation from agrarian economies to those based on machine manufacturing. Beginning in 18th-century Britain, industrialization revolutionized production, urbanization, and labor relations worldwide.',
    category: 'economy',
    relatedTerms: ['Revolution', 'Agrarian', 'Guild'],
  },
  {
    term: 'Inflation',
    definition:
      'A general increase in prices reducing purchasing power over time. The Spanish "Price Revolution" (16th–17th century), caused by New World silver flooding Europe, is a classic historical example.',
    category: 'economy',
    relatedTerms: ['Mercantilism', 'Famine', 'Barter'],
  },
  {
    term: 'Mercantilism',
    pronunciation: 'MUR-kan-tih-liz-um',
    definition:
      'Economic theory that a nation\'s wealth depends on accumulating precious metals and maintaining a favorable trade balance. It drove European colonial expansion from the 16th through 18th centuries.',
    category: 'economy',
    relatedTerms: ['Colonialism', 'Guild', 'Silk Road'],
  },
  {
    term: 'Serfdom',
    definition:
      'A system where peasants (serfs) were bound to the land and owed labor to the lord who owned it. Serfdom was central to medieval European feudalism and persisted in Russia until 1861.',
    category: 'economy',
    relatedTerms: ['Feudalism', 'Vassal', 'Agrarian'],
  },
  {
    term: 'Silk Road',
    definition:
      'An ancient network of trade routes connecting China to the Mediterranean, active from around 130 BCE to the 1450s. It facilitated the exchange of goods, ideas, religions, and diseases across Eurasia.',
    category: 'economy',
    relatedTerms: ['Mercantilism', 'Barter', 'Migration'],
  },
  {
    term: 'Tribute',
    definition:
      'Payment made by one state or ruler to another as a sign of submission or in exchange for protection. Tribute systems were central to empires from Aztec Mesoamerica to Qing China.',
    category: 'economy',
    relatedTerms: ['Empire', 'Vassal', 'Sovereignty'],
  },

  // ── CULTURE & SOCIETY ──────────────────────────────────────────────────
  {
    term: 'Alliance',
    definition:
      'A formal agreement between two or more parties for mutual benefit, especially military cooperation. The shifting alliances of European powers created the conditions for both World Wars.',
    category: 'culture',
    relatedTerms: ['Treaty', 'Hegemony', 'Empire'],
  },
  {
    term: 'Aristocracy',
    pronunciation: 'air-ih-STOK-ruh-see',
    definition:
      'A class of people holding exceptional social rank, usually hereditary. From Greek aristos (best) + kratos (power), aristocracies have shaped politics from ancient Greece to pre-revolutionary France.',
    category: 'culture',
    relatedTerms: ['Oligarchy', 'Monarchy', 'Feudalism'],
  },
  {
    term: 'Assimilation',
    definition:
      'The process by which a minority group adopts the customs, language, and identity of a dominant culture. It can occur voluntarily through cultural contact or be enforced through colonial and imperial policy.',
    category: 'culture',
    relatedTerms: ['Colonialism', 'Diaspora', 'Migration'],
  },
  {
    term: 'Civilization',
    definition:
      'A complex human society with cities, writing, government, and cultural achievements. The earliest civilizations arose independently in Mesopotamia, Egypt, the Indus Valley, and China around 3000 BCE.',
    category: 'culture',
    relatedTerms: ['Empire', 'Migration', 'Renaissance'],
  },
  {
    term: 'Dark Ages',
    definition:
      'An outdated and misleading term for the Early Medieval period (roughly 500–1000 CE). Modern historians reject it because significant cultural, scientific, and political developments occurred during this era, particularly in the Islamic world and Byzantine Empire.',
    category: 'culture',
    relatedTerms: ['Renaissance', 'Civilization', 'Feudalism'],
  },
  {
    term: 'Diaspora',
    pronunciation: 'dy-AS-por-uh',
    definition:
      'The scattering of a people from their homeland to other regions. The Jewish diaspora is the most well-known, but Armenian, African, Irish, and Chinese diasporas have also profoundly shaped world history.',
    category: 'culture',
    relatedTerms: ['Migration', 'Assimilation', 'Colonialism'],
  },
  {
    term: 'Hegemony',
    pronunciation: 'heh-JEM-uh-nee',
    definition:
      'Political, economic, or cultural dominance of one state or group over others. Ancient Athens led the Delian League, Britain dominated the 19th century, and the U.S. held post-WWII hegemony.',
    category: 'culture',
    relatedTerms: ['Imperialism', 'Empire', 'Alliance'],
  },
  {
    term: 'Imperialism',
    definition:
      'The policy of extending a nation\'s power through colonization, military force, or economic dominance. Distinguished from colonialism by its broader scope — imperialism can operate through indirect influence.',
    category: 'culture',
    relatedTerms: ['Colonialism', 'Hegemony', 'Empire'],
  },
  {
    term: 'Migration',
    definition:
      'Large-scale movement of people from one region to another. The Bantu expansion, the Great Migration of African Americans, and the Indo-European migrations all reshaped civilizations over centuries.',
    category: 'culture',
    relatedTerms: ['Diaspora', 'Civilization', 'Silk Road'],
  },
  {
    term: 'Mythology',
    definition:
      'A collection of myths — traditional stories explaining natural phenomena, origins, and cultural values. Greek, Norse, Hindu, and Mesoamerican mythologies reflect their societies\' deepest beliefs and fears.',
    category: 'culture',
    relatedTerms: ['Polytheism', 'Animism', 'Civilization'],
  },
  {
    term: 'Nationalism',
    definition:
      'A political ideology emphasizing loyalty and devotion to one\'s nation, often seeking self-governance. Rising in 19th-century Europe, nationalism unified Germany and Italy but also contributed to both World Wars.',
    category: 'culture',
    relatedTerms: ['Revolution', 'Sovereignty', 'Imperialism'],
  },
  {
    term: 'Oral Tradition',
    definition:
      'The passing of knowledge, stories, and history through spoken word rather than writing. For most of human history, oral tradition was the primary means of preserving cultural memory.',
    category: 'culture',
    relatedTerms: ['Mythology', 'Civilization', 'Primary Source'],
  },
  {
    term: 'Pandemic',
    definition:
      'A disease outbreak that spreads across multiple countries or continents. The Black Death (1347–51), Spanish Flu (1918–19), and COVID-19 (2020) each killed millions and reshaped societies.',
    category: 'culture',
    relatedTerms: ['Migration', 'Famine', 'Silk Road'],
  },
  {
    term: 'Primary Source',
    definition:
      'An original document or artifact from the time period being studied — letters, diaries, photographs, coins, or official records. Primary sources are the raw material of historical research.',
    category: 'culture',
    relatedTerms: ['Chronology', 'Oral Tradition'],
  },
  {
    term: 'Renaissance',
    pronunciation: 'REN-uh-sahns',
    definition:
      'The 14th–17th century European cultural revival of art, learning, and classical knowledge. Beginning in Italian city-states like Florence, it produced masters like Leonardo da Vinci, Michelangelo, and Galileo.',
    category: 'culture',
    relatedTerms: ['Dark Ages', 'Enlightenment', 'Civilization'],
  },
  {
    term: 'Revolution',
    definition:
      'Rapid, fundamental change in political power or social structure. The French Revolution (1789), American Revolution (1776), and Industrial Revolution each transformed their societies and the wider world.',
    category: 'culture',
    relatedTerms: ['Enlightenment', 'Nationalism', 'Democracy'],
  },
  {
    term: 'Slavery',
    definition:
      'The ownership of human beings as property, forced to labor without freedom or compensation. From ancient Mesopotamia to the Atlantic slave trade, slavery has been one of history\'s most pervasive institutions.',
    category: 'culture',
    relatedTerms: ['Colonialism', 'Imperialism', 'Diaspora'],
  },
];
