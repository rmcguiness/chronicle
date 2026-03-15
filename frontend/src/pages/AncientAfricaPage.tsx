/**
 * AncientAfricaPage — comprehensive deep-dive on the great civilizations of
 * sub-Saharan Africa (3500 BCE–1900 CE).
 *
 * Route: /ancient-africa
 *
 * Sections:
 *  1. Hero — "The Forgotten Empires", key stats
 *  2. Why Africa's History Is Underrepresented — colonial myth debunked
 *  3. Nubia / Kingdom of Kush (3500 BCE–350 CE)
 *  4. Axum / Aksum Empire (100–940 CE)
 *  5. Great Zimbabwe (1100–1450 CE)
 *  6. Mali Empire (1235–1600 CE) — Mansa Musa feature
 *  7. Songhai Empire (1430–1591 CE)
 *  8. Swahili Coast Civilization (700–1500 CE)
 *  9. Kingdom of Benin (1180–1897 CE)
 * 10. Zulu Kingdom (1816–1897 CE)
 * 11. African Trade Networks
 * 12. The Slave Trade's Impact
 * 13. Colonial Partition (1884–1885)
 * 14. Key Figures
 * 15. Connection cards
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TERRACOTTA = '#c2410c';
const CRIMSON = '#dc2626';
const JADE = '#059669';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const COPPER = '#b45309';
const SAND = '#d4a574';
const OCHRE = '#c98a2e';
const BRONZE = '#cd7f32';
const RED_EARTH = '#8b3a2a';
const BLUE = '#3b82f6';
const PURPLE = '#a855f7';
const GREEN = '#22c55e';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const BLOOD_RED = '#991b1b';

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

interface StatEntry {
  value: string;
  label: string;
  color: string;
}

// ── Hero Stats ──────────────────────────────────────────────────────────────

const HERO_STATS: StatEntry[] = [
  { value: '$400 billion', label: "Mansa Musa's wealth — richest person in history", color: GOLD },
  { value: '700,000+', label: 'manuscripts in Timbuktu — mostly undigitized', color: AMBER },
  { value: '700 years', label: 'Great Zimbabwe walls standing — no mortar', color: JADE },
  { value: '12.5 million', label: 'enslaved people exported to the Americas', color: CRIMSON },
  { value: '3,000+', label: 'Benin Bronzes — most still in European museums', color: BRONZE },
];

// ── Why Africa's History Is Underrepresented ─────────────────────────────────

const UNDERREPRESENTED_INSIGHTS: InsightEntry[] = [
  {
    label: 'The "No History" Myth',
    detail:
      'In 1830, the philosopher Hegel declared Africa "no historical part of the world." In 1963, the Oxford historian Hugh Trevor-Roper said there was "only the history of Europeans in Africa. The rest is darkness." These weren\'t fringe views — they were mainstream Western academia for over a century. The idea that sub-Saharan Africa had no civilization, no empires, no intellectual achievements was used to justify colonialism and slavery. It was also completely wrong. Africa\'s history was not absent — it was actively suppressed, ignored, and erased by the very people profiting from its exploitation.',
  },
  {
    label: 'Oral Traditions as History',
    detail:
      'Many African societies preserved their history through oral tradition — professional griots and court historians who memorized genealogies, laws, and events spanning centuries. Europeans dismissed oral history as unreliable, but modern archaeology has repeatedly confirmed oral traditions. The Sundiata epic of Mali, passed down for 800 years, has been corroborated by archaeological finds. The oral histories of Great Zimbabwe match the archaeological record. Oral tradition is not the absence of history — it is a different technology for preserving it.',
  },
  {
    label: 'The Evidence Was Always There',
    detail:
      'Arabic-speaking travelers documented African civilizations for over a millennium. Al-Bakri described Ghana in 1067. Ibn Battuta visited Mali in 1352 and Kilwa in 1331. Leo Africanus described Timbuktu\'s libraries in 1526. Portuguese traders documented the Kingdom of Benin, the Swahili Coast, and the Kingdom of Kongo from the 1400s onward. And the archaeological evidence — Great Zimbabwe\'s stone walls, Nubia\'s pyramids, Benin\'s bronzes, Axum\'s obelisks — was always visible. Europeans simply refused to believe Africans built them.',
  },
  {
    label: 'Archaeology Is Rewriting the Narrative',
    detail:
      'Modern archaeology, combined with linguistic analysis, genetic studies, and the re-examination of Arabic and African-language sources, has transformed our understanding of African history. We now know that African kingdoms were trading with Rome, Persia, India, and China. That Timbuktu was a center of scholarship rivaling medieval European universities. That African metallurgy, architecture, and political organization were among the most sophisticated in the pre-modern world. The problem was never a lack of African history — it was a refusal to look.',
  },
];

// ── Nubia / Kingdom of Kush ─────────────────────────────────────────────────

const NUBIA_TIMELINE: TimelineEntry[] = [
  {
    year: '~3500 BCE',
    title: 'Early Nubian Civilization',
    description:
      'The Nubian civilization along the upper Nile (modern Sudan) is one of the oldest in the world — contemporary with, and possibly older than, many Egyptian dynasties. The Kerma culture (2500–1500 BCE) built one of the largest mud-brick structures in the ancient world: the Western Deffufa, a massive ceremonial building that still stands today. Nubia was never a peripheral backwater of Egypt — it was a powerful, independent civilization that traded with, fought against, and sometimes conquered its northern neighbor.',
    color: OCHRE,
  },
  {
    year: '747–656 BCE',
    title: 'The 25th Dynasty — Kushite Pharaohs Rule Egypt',
    description:
      'The Kushite king Piye marched north and conquered all of Egypt, establishing the 25th Dynasty. For nearly a century, Nubian pharaohs — Piye, Shabaka, Shebitku, Taharqa — ruled the entire Nile Valley from the Mediterranean to the confluence of the Blue and White Niles. Taharqa was one of the greatest builders in Egyptian history, constructing monuments at Karnak and across Nubia. The Kushite pharaohs saw themselves as restorers of traditional Egyptian religion and culture. They were eventually driven out by the Assyrians using iron weapons — a technology that would transform Kush itself.',
    color: GOLD,
  },
  {
    year: '~300 BCE–350 CE',
    title: 'Meroë — The Iron-Smelting Capital',
    description:
      'After losing Egypt, Kush shifted its capital to Meroë, which became one of the largest iron-smelting centers in the ancient world. Massive slag heaps surround the city to this day. Meroë was a cosmopolitan trading hub connecting Africa to the Mediterranean, Arabia, and India. The Meroitic people developed their own script — Meroitic — which has been partially deciphered but remains one of the great unsolved puzzles of archaeology. They also built over 200 pyramids — more than Egypt — smaller and steeper, but unmistakably a distinct Nubian tradition.',
    color: TEAL,
  },
  {
    year: '~350 CE',
    title: 'Decline and Legacy',
    description:
      'Kush was eventually conquered by the rising Kingdom of Axum around 350 CE. But its legacy endures: Nubia\'s pyramids still stand in the Sudanese desert, largely unknown to tourists who flock to Egypt. The civilization lasted over 3,000 years — longer than Rome, longer than any European state. Modern Sudan\'s identity draws heavily on Nubian heritage, and the Meroitic script remains a challenge to linguists worldwide. Nubia\'s history is a reminder that Egyptian civilization did not exist in isolation — it was part of a larger Nile Valley world.',
    color: SAND,
  },
];

// ── Axum / Aksum Empire ─────────────────────────────────────────────────────

const AXUM_INSIGHTS: InsightEntry[] = [
  {
    label: 'One of the Four Great Powers',
    detail:
      'The 3rd-century Persian prophet Mani listed the four great powers of the world: Rome, Persia, China, and Axum. This was not flattery — it was accurate. Axum controlled the vital Red Sea trade routes connecting the Roman/Byzantine Mediterranean with India and the East. Its port of Adulis was one of the busiest in the ancient world. Axumite merchants traded ivory, gold, emeralds, and enslaved people for Roman luxury goods, Indian spices, and Chinese silk. The kingdom minted its own gold, silver, and bronze coinage — one of only four African civilizations to do so.',
  },
  {
    label: 'Christianity Before Europe (330 CE)',
    detail:
      'King Ezana of Axum adopted Christianity around 330 CE — making Ethiopia one of the first states in the world to become officially Christian, before the Roman Empire under Theodosius (380 CE) and centuries before most of Europe converted. The Ethiopian Orthodox Tewahedo Church, founded in this era, is one of the oldest Christian churches in existence. It developed its own unique traditions: the Ge\'ez liturgical language, distinctive cross designs, rock-hewn churches carved from solid stone, and the claim to house the Ark of the Covenant.',
  },
  {
    label: 'The Ark of the Covenant',
    detail:
      'Ethiopian tradition holds that the Ark of the Covenant — the chest containing the tablets of the Ten Commandments — rests in the Church of Our Lady Mary of Zion in Axum. According to the Kebra Nagast ("Glory of Kings"), Menelik I, the son of King Solomon and the Queen of Sheba, brought the Ark from Jerusalem to Axum. Only one monk, the Guardian of the Ark, is allowed to see it — he is appointed for life and never leaves the chapel. Whether you believe the claim or not, it has shaped Ethiopian identity for millennia and made Axum one of the holiest sites in Christianity.',
  },
  {
    label: 'The Queen of Sheba',
    detail:
      'The biblical Queen of Sheba — who visited King Solomon bearing gifts of gold, spices, and precious stones — is claimed by Ethiopian tradition as Makeda, Queen of Axum. The Kebra Nagast describes their meeting, their son Menelik I, and the founding of the Solomonic dynasty that ruled Ethiopia until Emperor Haile Selassie was deposed in 1974. This tradition — the Solomonic lineage — was the legitimizing myth of Ethiopian emperors for 700 years. Whether historical or legendary, the Queen of Sheba is one of the most powerful symbols of African civilization\'s connection to the ancient world.',
  },
  {
    label: 'Aksumite Obelisks',
    detail:
      'Axum\'s most striking architectural achievements are its giant stelae — carved granite obelisks up to 33 meters tall and weighing 500 tons, making them among the largest monoliths ever erected. The tallest standing stele (24 meters) is intricately carved to represent a multi-story building with windows, doors, and beams. Italy looted the 24-meter Obelisk of Axum in 1937 during Mussolini\'s occupation of Ethiopia; it was finally returned in 2005 after decades of diplomatic pressure. These stelae were funerary markers for Axumite royalty, demonstrating engineering skill that rivaled the ancient Mediterranean world.',
  },
];

// ── Great Zimbabwe ──────────────────────────────────────────────────────────

const ZIMBABWE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Great Enclosure — Africa\'s Largest Ancient Structure',
    detail:
      'Great Zimbabwe\'s Great Enclosure is the largest ancient structure in sub-Saharan Africa. Its outer wall stretches 244 meters long, stands 11 meters high, and is 5 meters thick at its base — all built without a single drop of mortar. The stones were precisely shaped and fitted using a dry-stack technique that has kept the walls standing for 700 years. Inside, a conical tower rises 9 meters high, its purpose still debated — it may have been a symbolic grain silo, a representation of a Shona granary, or a royal symbol. The sheer scale of construction required a powerful, well-organized state.',
  },
  {
    label: 'Gold, Trade, and the Indian Ocean',
    detail:
      'Great Zimbabwe was the capital of a wealthy trading state that controlled the gold trade between the gold-producing regions of the interior and the Swahili Coast ports on the Indian Ocean. Archaeologists have found Chinese porcelain, Persian Gulf glassware, Indian beads, and coins from Kilwa — evidence of a city connected to global trade networks. At its peak (c. 1300), Great Zimbabwe had 18,000 inhabitants, making it one of the largest cities in the medieval world. The kingdom\'s wealth came from controlling the flow of gold from hundreds of mines in the surrounding highlands to coastal traders.',
  },
  {
    label: 'The Colonial Lie',
    detail:
      'When European colonists encountered Great Zimbabwe in the late 19th century, they refused to believe Africans had built it. Cecil Rhodes\'s British South Africa Company promoted theories that Phoenicians, Arabs, or even King Solomon\'s builders had constructed the city. The colonial government of Rhodesia (named after Rhodes) actively suppressed archaeological evidence of African origins, firing and censoring researchers who published evidence of local Shona construction. This was not ignorance — it was deliberate propaganda to justify colonial rule: if Africans had never built anything, then Europeans were bringing "civilization."',
  },
  {
    label: 'The Truth — and the Name',
    detail:
      'Archaeological evidence overwhelmingly confirms Great Zimbabwe was built by the ancestors of the modern Shona people between 1100 and 1450 CE. Pottery, tools, gold-working techniques, and construction methods all match local traditions. The word "Zimbabwe" comes from the Shona dzimba dza mabwe — "houses of stone." When Rhodesia gained majority rule in 1980, the new nation chose the name Zimbabwe in direct defiance of the colonial myth — reclaiming the architectural achievement that colonialism had stolen from African history.',
  },
];

// ── Mali Empire ─────────────────────────────────────────────────────────────

const MALI_TIMELINE: TimelineEntry[] = [
  {
    year: '1235',
    title: 'Sundiata Keita — The Lion King',
    description:
      'Sundiata Keita, a prince who had been crippled and exiled as a child, returned to defeat the tyrannical Sosso king Sumanguru Kante at the Battle of Kirina. He united the Mandinka people and founded the Mali Empire. The Sundiata epic, preserved for 800 years by griots, is one of the great literary works of the medieval world — a story of exile, disability, perseverance, and triumph that predates many European epics. Sundiata established the Kouroukan Fouga (Charter of Manden), considered one of the earliest declarations of human rights, which prohibited slavery of the Mandinka and protected individual liberties.',
    color: GOLD,
  },
  {
    year: '1312–1337',
    title: 'Mansa Musa — The Richest Person in History',
    description:
      'Mansa Musa ruled an empire that produced roughly half the world\'s gold. His 1324 pilgrimage to Mecca was the most spectacular display of wealth in recorded history: a caravan of 60,000 people, 12,000 enslaved people each carrying 1.8 kg of gold, 80 camels each carrying 136 kg of gold. In Cairo alone, he gave away so much gold that the metal\'s value crashed and did not recover for 10 years — the only time in history a single person destabilized the gold market of an entire region. His estimated wealth in today\'s money: $400 billion, exceeding Jeff Bezos, Elon Musk, and Bill Gates combined.',
    color: AMBER,
  },
  {
    year: '1324–1325',
    title: 'The Hajj That Shook the Mediterranean',
    description:
      'Musa\'s pilgrimage put Mali on the world map — literally. The 1375 Catalan Atlas, the most important European map of the medieval period, depicts Mansa Musa sitting on a golden throne, holding a gold nugget, with the inscription: "This lord is the richest and most noble king in all the land." After the hajj, Musa recruited architects and scholars from Cairo and Arabia to return with him to Mali. He commissioned the Djinguereber Mosque in Timbuktu, designed by the Andalusian architect Abu Es Haq es Saheli, which still stands today.',
    color: OCHRE,
  },
  {
    year: '1300s–1500s',
    title: 'Timbuktu — The Intellectual Capital of Africa',
    description:
      'Under the Mali Empire (and later Songhai), Timbuktu became one of the world\'s great centers of learning. The University of Sankore attracted 25,000 students and scholars from across the Islamic world. Over 400 private libraries held an estimated 700,000 manuscripts on subjects including astronomy, medicine, mathematics, law, history, and theology. These were not primitive documents — they included sophisticated mathematical calculations, medical texts describing surgical procedures, and legal opinions debating the rights of women and minorities. Most remain undigitized and untranslated.',
    color: TEAL,
  },
];

// ── Songhai Empire ──────────────────────────────────────────────────────────

const SONGHAI_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Largest African Empire',
    detail:
      'The Songhai Empire, at its peak under Askia Muhammad I (r. 1493–1528), was the largest empire in African history by territory — stretching from the Atlantic coast to what is now Nigeria and from the Sahara to the tropical forests. It was larger than Western Europe. Songhai\'s capital, Gao, was a thriving cosmopolitan city on the Niger River. The empire controlled the trans-Saharan trade routes that funneled gold, salt, enslaved people, and kola nuts between sub-Saharan Africa and the Mediterranean world.',
  },
  {
    label: 'Askia Muhammad I — The Great Reformer',
    detail:
      'Askia Muhammad I (born Muhammad Ture) seized power from the founder Sunni Ali\'s son and transformed Songhai from a military conquest state into a sophisticated bureaucracy. He standardized weights and measures, established a professional army and navy (patrolling the Niger River), created a system of provincial governors, expanded Islamic education, and corresponded with scholars across the Muslim world. He made his own pilgrimage to Mecca in 1496, returning with scholars and religious texts. His administrative reforms were so effective that Songhai functioned as a bureaucratic state rivaling contemporary Ottoman or Ming administration.',
  },
  {
    label: 'Fall to Moroccan Firearms (1591)',
    detail:
      'In 1591, the Moroccan Sultan Ahmad al-Mansur sent an army of 4,000 soldiers — many of them Spanish and Portuguese renegades — across the Sahara Desert to seize Songhai\'s gold mines. The Moroccan force, armed with European matchlock muskets and cannons, defeated the much larger Songhai army at the Battle of Tondibi. It was one of the first times firearms decided a major battle in sub-Saharan Africa. Timbuktu was sacked, its scholars deported to Morocco, its libraries scattered. The fall of Songhai fragmented West Africa and left the region vulnerable to the accelerating European slave trade.',
  },
];

// ── Swahili Coast ───────────────────────────────────────────────────────────

const SWAHILI_INSIGHTS: InsightEntry[] = [
  {
    label: 'City-States of the Indian Ocean',
    detail:
      'From about 700 CE onward, a chain of wealthy city-states stretched along the East African coast from Somalia to Mozambique: Mogadishu, Mombasa, Malindi, Zanzibar, Kilwa, Sofala, and dozens more. These were not isolated fishing villages — they were sophisticated urban centers with multi-story stone buildings, mosques, palaces, and bustling marketplaces. Their wealth came from trade: they were the western terminus of the Indian Ocean trade network, connecting Africa to Arabia, Persia, India, Southeast Asia, and China.',
  },
  {
    label: 'Kilwa — "The Most Beautiful Town in the World"',
    detail:
      'The Moroccan traveler Ibn Battuta visited Kilwa (in modern Tanzania) in 1331 and described it as "one of the most beautiful and well-constructed towns in the world." At its peak, Kilwa controlled the gold trade from Great Zimbabwe to the Indian Ocean — and with it, enormous wealth. The Great Mosque of Kilwa, built in the 11th century and expanded in the 14th, was the largest mosque in sub-Saharan Africa and featured a domed roof unsupported by pillars. The sultan of Kilwa minted his own copper coins — the first in sub-Saharan Africa.',
  },
  {
    label: 'Swahili Culture — African and Global',
    detail:
      'The Swahili civilization was a unique fusion. The Swahili language is fundamentally Bantu African — its grammar and core vocabulary are African — but it absorbed thousands of Arabic, Persian, and Portuguese loanwords through centuries of trade. Swahili architecture blended African building traditions with Arabian and Indian influences. The people were overwhelmingly African, but intermarriage with Arab and Persian merchants created a cosmopolitan elite. Swahili culture challenges the myth of African isolation: for over a thousand years, East Africa was deeply connected to the wider Indian Ocean world.',
  },
  {
    label: 'What They Traded',
    detail:
      'Swahili merchants exported gold (from Zimbabwe), ivory, animal skins, tortoiseshell, enslaved people, timber (mangrove poles, prized for construction in the treeless Arabian Gulf), and ambergris. They imported cotton textiles (from India), porcelain (from China — archaeologists have found more medieval Chinese pottery in Kilwa than in most European cities), glass beads, metalwork, and luxury goods from across the Indian Ocean. A single dhow arriving from India or China carried goods that had passed through multiple trading cultures, linking East Africa to global commerce centuries before European arrival.',
  },
];

// ── Kingdom of Benin ────────────────────────────────────────────────────────

const BENIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Bronze Masters',
    detail:
      'The bronze and brass sculptures of the Kingdom of Benin (in modern Nigeria) are among the finest metalwork ever produced — anywhere in the world, at any time in history. The Benin artisans used the lost-wax casting technique to create thousands of detailed plaques, heads, and figures that depicted court life, military campaigns, and religious ceremonies. European visitors in the 15th and 16th centuries were stunned by the quality — they compared Benin bronzes favorably to Renaissance European sculpture. The artisans\' guild, the Igun Eronmwon, held hereditary positions within the royal court and produced works exclusively for the Oba (king).',
  },
  {
    label: 'The 1897 Punitive Expedition',
    detail:
      'In February 1897, a British military force attacked and burned Benin City in what the British called a "punitive expedition" — retaliation for the killing of a British diplomatic party (which had been warned not to approach during a sacred ceremony). The British looted approximately 3,000–4,000 bronze plaques, carved ivory tusks, and other artworks from the royal palace. These objects were shipped to London and sold to museums and collectors across Europe. The British Museum alone holds over 900 pieces. The looting of the Benin Bronzes is now the single most prominent case in the global debate over colonial-era cultural theft.',
  },
  {
    label: 'A Sophisticated Kingdom',
    detail:
      'The Kingdom of Benin was far more than its bronzes. When Portuguese explorers arrived in the 1480s, they described a city with wide, straight streets, organized neighborhoods, and a royal palace that covered an area larger than many European towns. The Oba ruled through an elaborate court hierarchy with specialized chiefs overseeing trade, warfare, religion, and craft production. Benin had its own legal system, taxation, and diplomatic relationships with neighboring kingdoms. The Portuguese ambassador to Benin in 1486 reported that the city was comparable in size and organization to any European capital.',
  },
  {
    label: 'The Repatriation Debate',
    detail:
      'The Benin Bronzes have become the focal point of the global repatriation movement. Nigeria has demanded their return for decades. In 2022, Germany returned over 1,000 Benin Bronzes — the first major European repatriation. The Smithsonian Institution followed. But the British Museum has refused to return its collection, citing its founding act of Parliament. The debate raises fundamental questions: Should stolen cultural property be returned? Do Western museums have the right to keep art looted during colonial invasions? How do you restore cultural heritage that has been dispersed across dozens of institutions in a dozen countries? The Benin Bronzes have made these questions impossible to ignore.',
  },
];

// ── Zulu Kingdom ────────────────────────────────────────────────────────────

const ZULU_INSIGHTS: InsightEntry[] = [
  {
    label: 'Shaka Zulu — Military Genius',
    detail:
      'Shaka kaSenzangakhona (r. 1816–1828) transformed the Zulu from a small clan of roughly 1,500 people into the dominant military power of southern Africa. His innovations were revolutionary: he replaced the traditional long throwing spear with the iklwa, a short stabbing spear for close combat; introduced the large cowhide shield for offensive use; developed the "horns of the buffalo" formation (central body pins the enemy while two flanking wings encircle them); and organized his army into age-based regiments (amabutho) that trained and lived together. In just 12 years, Shaka built a kingdom of over 250,000 people.',
  },
  {
    label: 'The Mfecane — A Continent Reshaped',
    detail:
      'Shaka\'s expansion triggered the Mfecane (or Difaqane) — a cascading wave of migration, warfare, and state formation across southern and eastern Africa. As Zulu power expanded, displaced peoples fled, conquered new territories, and displaced others in turn. The effects reached as far as Tanzania and Zambia. New kingdoms emerged from the chaos: the Ndebele, the Swazi, the Sotho, the Gaza. The Mfecane reshaped the political map of half a continent. Debate continues over how much of the Mfecane was caused by Zulu expansion versus drought, European encroachment, and the slave trade.',
  },
  {
    label: 'Isandlwana — The British Defeat (1879)',
    detail:
      'On January 22, 1879, a Zulu army of 20,000 warriors attacked a British camp at Isandlwana in one of the most shocking defeats in British imperial history. Despite being armed only with spears, shields, and some captured firearms, the Zulus overwhelmed and killed over 1,300 British soldiers and their African auxiliaries. It was the worst defeat the British Army suffered against a technologically inferior force in the 19th century. The British Empire — which controlled a quarter of the globe — had been beaten by an African army. The British responded with massive reinforcements and ultimately defeated the Zulu kingdom within months, but Isandlwana remains a symbol of African military resistance.',
  },
];

// ── Trade Networks ──────────────────────────────────────────────────────────

const TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Trans-Saharan Trade — Gold and Salt',
    detail:
      'For over a thousand years, camel caravans carried gold north across the Sahara and salt south. West African gold fueled the economies of the Mediterranean world — two-thirds of the gold in medieval Europe came from West Africa. The exchange was direct: gold from the forests of Akan (modern Ghana) was traded weight-for-weight for Saharan salt, which was as precious as gold in the salt-scarce tropics. These trade routes sustained the empires of Ghana, Mali, and Songhai and connected sub-Saharan Africa to the wider Islamic world.',
  },
  {
    label: 'Indian Ocean Trade — The Swahili Connection',
    detail:
      'East Africa\'s Swahili Coast was integrated into the Indian Ocean trade network — the largest maritime trading system in the pre-modern world. African ivory, gold, and timber flowed east to Arabia, India, and China. Chinese porcelain, Indian textiles, and Persian glassware flowed west to Africa. Monsoon winds made the trade predictable: ships sailed southwest to Africa from November to March, and northeast to India from April to October. This system connected Kilwa to Gujarat to Canton in a web of commerce that predated European exploration by centuries.',
  },
  {
    label: 'Internal Trade Routes',
    detail:
      'Africa\'s internal trade networks are often overlooked. Long before European contact, trade routes crisscrossed the continent: copper from Katanga reached the Atlantic and Indian Ocean coasts; iron from the Great Lakes region was traded thousands of kilometers; kola nuts from the West African forests were carried north to the Sahel; cattle, grain, and salt moved along established routes maintained by professional trading peoples like the Dyula, the Hausa, and the Nyamwezi. These networks sustained complex economies, urban centers, and states across the continent.',
  },
];

// ── Slave Trade ─────────────────────────────────────────────────────────────

const SLAVE_TRADE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Scale of Devastation',
    detail:
      'Between 1500 and 1900, an estimated 12.5 million enslaved Africans were forcibly transported across the Atlantic to the Americas — and an additional 6 million died during capture and the Middle Passage. The trans-Saharan and Indian Ocean slave trades, which predated the Atlantic trade, transported millions more. At the peak of the Atlantic slave trade (1700s), roughly 80,000 Africans were shipped across the Atlantic every year. This was not a passive process: European demand for enslaved labor created economic incentives that distorted African societies, empowered slave-raiding states, and fueled wars of capture across the continent.',
  },
  {
    label: 'How It Destabilized Civilizations',
    detail:
      'The slave trade didn\'t just remove people — it restructured African societies. Kingdoms that had been centers of learning and trade were incentivized to become slave-raiding states. Firearms imported by European traders gave slave-raiding kingdoms military advantages over their neighbors, creating an arms-for-slaves cycle. The Dahomey kingdom, the Asante Empire, and states in the Niger Delta became enmeshed in the trade, waging wars specifically to capture people for sale to European slavers. Meanwhile, the regions being raided — often the most vulnerable — suffered catastrophic population loss and economic collapse.',
  },
  {
    label: 'The Demographic Catastrophe',
    detail:
      'The slave trade removed Africa\'s youngest and healthiest population — primarily people aged 15–35 — for four centuries. Historians estimate that without the slave trade, Africa\'s population would have been 50–100 million larger by 1850. Entire regions were depopulated. The gender imbalance (two-thirds of those enslaved in the Atlantic trade were male) disrupted family structures and agricultural production. The slave trade also diverted African economies from productive activities into predatory ones, and the firearms flooding in created an escalating cycle of violence that weakened the continent precisely when European colonialism was approaching.',
  },
  {
    label: 'The Legacy Continues',
    detail:
      'The economic effects of the slave trade are still measurable. Economists have shown that the regions of Africa most heavily affected by the slave trade are today among the poorest and least trusting — centuries of predation destroyed the social trust that underlies economic development. The wealth extracted from enslaved labor built the economies of Britain, France, Portugal, Spain, the Netherlands, and the Americas. The slave trade created the racial hierarchies that still structure societies in the Americas. It is not ancient history — it is the foundation on which the modern world was built.',
  },
];

// ── Colonial Partition ──────────────────────────────────────────────────────

const COLONIAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Berlin Conference (1884–1885)',
    detail:
      'In November 1884, representatives of 14 European powers gathered in Berlin to divide Africa among themselves. No Africans were invited or consulted. Over three months, European diplomats drew straight lines across the map, cutting through over 1,000 existing cultures, kingdoms, and linguistic groups. The conference established the principle of "effective occupation" — any European power that could demonstrate control over a territory could claim it. By 1914, 90% of Africa was under European control. Only Ethiopia (which defeated an Italian invasion at the Battle of Adwa in 1896) and Liberia remained independent.',
  },
  {
    label: 'What Was Lost',
    detail:
      'European colonialism destroyed centuries of African political, economic, and cultural development. Existing kingdoms were dismantled or reduced to puppet states. African trade networks were redirected to serve European extraction. Colonial borders — drawn with no regard for ethnic, linguistic, or cultural boundaries — divided peoples who had been united and united peoples who had been separate, creating the ethnic tensions that plague many African nations to this day. The colonial system was designed for one purpose: extraction of African wealth for European benefit. Infrastructure — railways, ports, roads — was built to move resources out, not to connect African communities.',
  },
  {
    label: 'The Numbers',
    detail:
      'The human cost of colonialism was staggering. King Leopold II of Belgium\'s personal colony in the Congo killed an estimated 10 million people through forced labor, mutilation, and starvation. The German genocide of the Herero and Nama peoples in Namibia (1904–1908) killed up to 80% of the Herero population. British concentration camps during the Boer War killed 28,000 Afrikaner civilians and 20,000 Black South Africans. France\'s forced labor system in West Africa and the Portuguese exploitation of Mozambique and Angola added millions more to the toll. Colonialism was not a civilizing mission — it was organized extraction backed by extreme violence.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Mansa Musa',
    years: 'r. 1312–1337',
    contribution:
      'Emperor of Mali and the richest person in history. His 1324 hajj with 60,000 people and tons of gold crashed the Mediterranean gold market for a decade. Built Timbuktu into a center of Islamic scholarship.',
  },
  {
    name: 'Sundiata Keita',
    years: 'r. 1235–1255',
    contribution:
      'Founder of the Mali Empire. Overcame exile and disability to defeat the Sosso Kingdom. Established the Kouroukan Fouga charter protecting individual rights.',
  },
  {
    name: 'King Taharqa',
    years: 'r. 690–664 BCE',
    contribution:
      'Greatest of the Kushite pharaohs. Ruled the entire Nile Valley, built monuments across Egypt and Nubia, and is mentioned in the Bible (2 Kings 19:9) as an ally against Assyria.',
  },
  {
    name: 'King Ezana of Axum',
    years: 'r. ~320–360 CE',
    contribution:
      'Converted Axum to Christianity around 330 CE, making it one of the first Christian states in the world. Conquered Meroë and expanded Axumite power across the Red Sea.',
  },
  {
    name: 'Askia Muhammad I',
    years: 'r. 1493–1528',
    contribution:
      'Transformed the Songhai Empire from a military conquest into a sophisticated bureaucratic state. Standardized weights and measures, expanded scholarship, and made Songhai the largest African empire by territory.',
  },
  {
    name: 'Shaka Zulu',
    years: 'r. 1816–1828',
    contribution:
      'Military genius who transformed the Zulu from a minor clan into the dominant power of southern Africa. Revolutionized African warfare with new weapons, formations, and the regimental system.',
  },
  {
    name: 'Queen Nzinga of Ndongo',
    years: '1583–1663',
    contribution:
      'Led 40 years of resistance against Portuguese colonialism in modern-day Angola. Master diplomat and military strategist who allied with the Dutch and built coalitions to fight European encroachment.',
  },
  {
    name: 'Menelik II of Ethiopia',
    years: 'r. 1889–1913',
    contribution:
      'Defeated the Italian invasion at the Battle of Adwa (1896) — the most decisive African victory over a European colonial power. Preserved Ethiopian independence during the Scramble for Africa.',
  },
];

// ── Connections ─────────────────────────────────────────────────────────────

const CONNECTIONS: ConnectionCard[] = [
  {
    title: 'The Slave Trade & Slavery',
    description:
      'How the transatlantic slave trade reshaped Africa, the Americas, and the modern world — 12.5 million people, 400 years, consequences that endure.',
    path: '/slavery',
    color: CRIMSON,
  },
  {
    title: 'The Age of Exploration',
    description:
      'European voyages that brought Portuguese, Dutch, and British traders to African coasts — launching the slave trade and the colonial project.',
    path: '/age-of-exploration',
    color: BLUE,
  },
  {
    title: 'Ancient Egypt',
    description:
      'Nubia\'s neighbor, rival, and sometimes ruler. The Nile Valley civilizations were deeply intertwined for over 3,000 years.',
    path: '/ancient-egypt',
    color: GOLD,
  },
  {
    title: 'Decolonization',
    description:
      'How African nations broke free from colonial rule in the 20th century — and the unfinished work of building post-colonial states.',
    path: '/decolonization',
    color: JADE,
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

const FIGURE_COLORS = [GOLD, JADE, TERRACOTTA, BLUE, TEAL, CRIMSON, PURPLE, AMBER, GREEN, INDIGO];

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
// Mansa Musa feature callout
// ─────────────────────────────────────────────────────────────────────────────

function MansaMusaCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${GOLD}33`,
        borderRadius: 14,
        padding: 28,
        marginTop: 8,
      }}
    >
      <h3
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: GOLD,
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        The Gold Crash of 1324
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 14,
        }}
      >
        {[
          { value: '60,000', label: 'people in the caravan', color: GOLD },
          { value: '100', label: 'camel-loads of gold', color: AMBER },
          { value: '12,000', label: 'enslaved people carrying gold bars', color: OCHRE },
          { value: '10 years', label: 'for gold prices to recover', color: CRIMSON },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${s.color}33`,
              borderRadius: 10,
              padding: '14px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: s.color, fontWeight: 700, fontSize: '1.4rem', marginBottom: 4 }}>
              {s.value}
            </p>
            <p style={{ color: SLATE, fontSize: '0.8rem', lineHeight: 1.4 }}>
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
      <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.93rem', marginTop: 18, textAlign: 'center' }}>
        When Mansa Musa passed through Cairo on his 1324 hajj to Mecca, he gave away so much gold
        that he single-handedly crashed the gold market of the entire Mediterranean region. It took
        a decade to recover — the only time in history one person destabilized an intercontinental economy.
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Architecture callout — Great Zimbabwe & Aksumite obelisks
// ─────────────────────────────────────────────────────────────────────────────

function ArchitectureCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${SAND}33`,
        borderRadius: 14,
        padding: 28,
        marginTop: 8,
      }}
    >
      <h3
        style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: SAND,
          marginBottom: 18,
          textAlign: 'center',
        }}
      >
        African Architectural Achievements
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {[
          {
            name: 'Great Zimbabwe — Walls Without Mortar',
            detail:
              'The Great Enclosure\'s walls stretch 244 meters long and 11 meters high, built entirely without mortar using precision dry-stack masonry. The stones have stood for 700 years — outlasting most European medieval castles.',
            color: JADE,
          },
          {
            name: 'Aksumite Stelae — 500-Ton Monoliths',
            detail:
              'Axum\'s granite obelisks, up to 33 meters tall and 500 tons, are among the largest monoliths ever erected. Intricately carved to resemble multi-story buildings, they rival any ancient Mediterranean monument.',
            color: TEAL,
          },
          {
            name: 'Lalibela — Churches Carved From Rock',
            detail:
              'In the 12th century, King Lalibela of Ethiopia ordered 11 churches carved directly downward out of solid volcanic rock — including the cross-shaped Church of St. George. They are still in use today.',
            color: TERRACOTTA,
          },
          {
            name: 'The Great Mosque of Djenne',
            detail:
              'The largest mud-brick building in the world, first built in the 13th century and rebuilt in 1907 following the original design. Its annual replastering is a community-wide festival involving the entire city.',
            color: OCHRE,
          },
        ].map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${a.color}33`,
              borderRadius: 10,
              padding: 18,
            }}
          >
            <h4 style={{ fontWeight: 600, color: a.color, marginBottom: 8, fontSize: '1rem' }}>
              {a.name}
            </h4>
            <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
              {a.detail}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function AncientAfricaPage() {
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
            The Forgotten Empires — Africa's Great Civilizations (3500 BCE–1900 CE)
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
              For over five millennia, Africa south of the Sahara produced empires
              that rivaled Rome, scholarship that rivaled Baghdad, architecture that
              rivaled anything in the medieval world, and the richest person in
              recorded history. Nubian pharaohs ruled Egypt. Aksumite emperors
              traded with China. Mansa Musa of Mali crashed the gold market of an
              entire continent. Timbuktu held 700,000 manuscripts. Great Zimbabwe's
              mortarless walls still stand after 700 years.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              You probably didn't learn any of this in school. Here's why — and
              here's the history that was hidden from you.
            </p>
          </motion.div>
          <StatsBar stats={HERO_STATS} />
        </header>

        {/* ── Why You Don't Know This ──────────────────────────────────── */}
        <SectionWrapper
          id="underrepresented"
          icon="🔍"
          title="Why You Don't Know This — The Colonial Myth of 'No African History'"
          accentColor={RED_EARTH}
          intro="For centuries, European historians, politicians, and philosophers claimed that sub-Saharan Africa had no history, no civilization, no intellectual achievement. This was not an innocent mistake — it was a deliberate narrative designed to justify slavery and colonialism. The evidence was always there. It was simply ignored."
        >
          <InsightGrid items={UNDERREPRESENTED_INSIGHTS} />
        </SectionWrapper>

        {/* ── Nubia / Kingdom of Kush ──────────────────────────────────── */}
        <SectionWrapper
          id="nubia"
          icon="🏛️"
          title="Nubia / Kingdom of Kush — The Civilization That Conquered Egypt (3500 BCE–350 CE)"
          accentColor={OCHRE}
          intro="Before Rome, before classical Greece, there was Kush. On the upper Nile, in what is now Sudan, a civilization arose that traded with Egypt, fought Egypt, conquered Egypt, and outlasted most Egyptian dynasties. The Kushite pharaohs ruled the entire Nile Valley. Meroë became one of the ancient world's great iron-smelting centers. And Kush developed its own script — one that archaeologists still cannot fully read."
        >
          <TimelineCard entries={NUBIA_TIMELINE} />
        </SectionWrapper>

        {/* ── Axum / Aksum ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="axum"
          icon="⛪"
          title="Axum / Aksum Empire — One of the Four Great Powers (100–940 CE)"
          accentColor={TEAL}
          intro="In the 3rd century, the Persian prophet Mani named the four great powers of the world: Rome, Persia, China, and Axum. This Ethiopian empire controlled Red Sea trade, adopted Christianity before most of Europe, erected 500-ton stone obelisks, and claims to house the Ark of the Covenant. It is the origin of one of the world's oldest continuous Christian traditions."
        >
          <InsightGrid items={AXUM_INSIGHTS} />
        </SectionWrapper>

        {/* ── Architecture Callout ─────────────────────────────────────── */}
        <section style={{ padding: '48px 0', borderTop: `1px solid ${SAND}33` }}>
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
                color: SAND,
                marginBottom: 12,
              }}
            >
              🧱 African Architecture — Building Without Mortar, Carving Into Mountains
            </h2>
            <p
              style={{
                color: ASH,
                lineHeight: 1.7,
                maxWidth: 800,
                marginBottom: 28,
              }}
            >
              From Great Zimbabwe's dry-stack walls to Axum's 500-ton monoliths to
              Lalibela's rock-hewn churches, African builders created some of the
              most impressive structures in the pre-modern world — using techniques
              that European colonists refused to believe were African.
            </p>
          </motion.div>
          <ArchitectureCallout />
        </section>

        {/* ── Great Zimbabwe ───────────────────────────────────────────── */}
        <SectionWrapper
          id="zimbabwe"
          icon="🏰"
          title="Great Zimbabwe — The Stone City They Tried to Erase (1100–1450 CE)"
          accentColor={JADE}
          intro="A massive stone city with walls 11 meters high and 244 meters long — built without a single drop of mortar. The center of a gold-trading empire that connected interior Africa to the Indian Ocean. And when Europeans found it, they refused to believe Africans built it. They were wrong. The nation of Zimbabwe took its name in defiance."
        >
          <InsightGrid items={ZIMBABWE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Mali Empire ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="mali"
          icon="👑"
          title="The Mali Empire — Gold, Scholarship, and the Richest Person in History (1235–1600 CE)"
          accentColor={GOLD}
          intro="The Mali Empire produced the richest individual in recorded history, built one of the medieval world's great centers of learning, and established a charter of human rights centuries before the Enlightenment. When Mansa Musa walked through Cairo, he gave away so much gold that he broke the economy of an entire region."
        >
          <TimelineCard entries={MALI_TIMELINE} />
          <MansaMusaCallout />
        </SectionWrapper>

        {/* ── Timbuktu Scholarship Section ─────────────────────────────── */}
        <section style={{ padding: '48px 0', borderTop: `1px solid ${AMBER}33` }}>
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
                color: AMBER,
                marginBottom: 12,
              }}
            >
              📚 Timbuktu — The Intellectual Capital of Medieval Africa
            </h2>
            <p
              style={{
                color: ASH,
                lineHeight: 1.7,
                maxWidth: 800,
                marginBottom: 28,
              }}
            >
              In the Western imagination, "Timbuktu" means "the middle of nowhere."
              In reality, it was one of the greatest centers of learning in the
              medieval world — a university city with 25,000 students and 700,000
              manuscripts covering astronomy, medicine, law, and theology.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${AMBER}33`,
              borderRadius: 14,
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {[
                {
                  label: 'The University of Sankore',
                  detail:
                    'Founded in the 14th century, Sankore attracted scholars from across the Islamic world. It was organized like a medieval university: students studied under individual scholars, progressed through levels of learning, and received degrees. At its peak, 25,000 students studied in Timbuktu — comparable to the largest European universities of the era. Subjects included the Quran, jurisprudence, astronomy, mathematics, medicine, history, and chemistry.',
                },
                {
                  label: '700,000 Manuscripts',
                  detail:
                    'Timbuktu\'s private libraries held an estimated 700,000 manuscripts — handwritten texts on subjects ranging from Islamic law to astronomical calculations to herbal medicine. Many survive today, preserved by families who hid them during centuries of instability. In 2013, when jihadists occupied Timbuktu, librarians and volunteers smuggled thousands of manuscripts to safety in Bamako. Most remain undigitized and untranslated — a vast archive of African intellectual history still waiting to be fully explored.',
                },
                {
                  label: 'What Was In Them',
                  detail:
                    'These were not simple religious texts. Timbuktu manuscripts include sophisticated astronomical observations and calculations; medical texts describing surgical procedures, pharmacology, and disease treatment; mathematical treatises; legal opinions debating the rights of women, the ethics of slavery, and the obligations of rulers; histories of West African kingdoms; and poetry. They demonstrate a level of intellectual achievement that directly contradicts the colonial myth of African backwardness.',
                },
                {
                  label: 'The Crisis of Preservation',
                  detail:
                    'Centuries of neglect, climate, insects, and conflict have damaged thousands of Timbuktu manuscripts. International organizations have launched digitization efforts, but progress is slow — most of the 700,000+ texts remain unscanned. The manuscripts are written in Arabic and Ajami (African languages written in Arabic script), requiring specialized linguistic expertise to translate. They represent one of the largest unexplored archives of pre-modern intellectual history in the world — and a race against time to preserve them.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
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
          </motion.div>
        </section>

        {/* ── Songhai Empire ───────────────────────────────────────────── */}
        <SectionWrapper
          id="songhai"
          icon="🗺️"
          title="The Songhai Empire — The Largest African Empire (1430–1591 CE)"
          accentColor={INDIGO}
          intro="The Songhai Empire succeeded Mali and exceeded it in territory — becoming the largest empire in African history. Under Askia Muhammad I, it developed a sophisticated bureaucracy, standardized administration, and continued Timbuktu's intellectual traditions. It fell in 1591 to a Moroccan army armed with European firearms — one of the first times guns decided a major battle in sub-Saharan Africa."
        >
          <InsightGrid items={SONGHAI_INSIGHTS} />
        </SectionWrapper>

        {/* ── Swahili Coast ────────────────────────────────────────────── */}
        <SectionWrapper
          id="swahili"
          icon="⛵"
          title="The Swahili Coast — Africa's Indian Ocean Gateway (700–1500 CE)"
          accentColor={BLUE}
          intro="Along the East African coast, a chain of city-states connected Africa to the global Indian Ocean trade network. Kilwa, Mombasa, Zanzibar, and dozens more were cosmopolitan trading centers where African, Arab, Persian, Indian, and Chinese cultures mixed. Ibn Battuta called Kilwa 'one of the most beautiful towns in the world.' Chinese porcelain has been found in greater quantities here than in most medieval European cities."
        >
          <InsightGrid items={SWAHILI_INSIGHTS} />
        </SectionWrapper>

        {/* ── Kingdom of Benin ─────────────────────────────────────────── */}
        <SectionWrapper
          id="benin"
          icon="🎨"
          title="The Kingdom of Benin — Bronze Masters of West Africa (1180–1897 CE)"
          accentColor={BRONZE}
          intro="The Kingdom of Benin in modern Nigeria produced bronze and brass sculptures ranked among the finest metalwork in world history. When Portuguese visitors arrived in the 1480s, they found a city rivaling European capitals. In 1897, the British burned the city and looted 3,000+ artworks that now sit in museums across Europe — the most prominent case in the global repatriation debate."
        >
          <InsightGrid items={BENIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Zulu Kingdom ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="zulu"
          icon="🛡️"
          title="The Zulu Kingdom — Military Revolution in Southern Africa (1816–1897 CE)"
          accentColor={GREEN}
          intro="In just 12 years, Shaka Zulu transformed a minor clan into the dominant military power of southern Africa. His tactical innovations — the short stabbing spear, the 'horns of the buffalo' formation, the regimental system — revolutionized warfare across the continent. At Isandlwana in 1879, his successors inflicted one of the worst defeats the British Empire ever suffered."
        >
          <InsightGrid items={ZULU_INSIGHTS} />
        </SectionWrapper>

        {/* ── Trade Networks ───────────────────────────────────────────── */}
        <SectionWrapper
          id="trade"
          icon="🐫"
          title="African Trade Networks — Connected Long Before Europe Arrived"
          accentColor={COPPER}
          intro="Africa was never isolated. Trans-Saharan camel caravans carried gold north and salt south for over a millennium. Swahili dhows connected East Africa to India and China. Internal trade routes moved copper, iron, kola nuts, and cattle thousands of kilometers. Two-thirds of medieval Europe's gold came from West Africa. These networks sustained empires and connected the continent to the wider world centuries before European exploration."
        >
          <InsightGrid items={TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Slave Trade ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="slave-trade"
          icon="⛓️"
          title="The Slave Trade's Impact — 12.5 Million People, 400 Years of Devastation"
          accentColor={CRIMSON}
          intro="The transatlantic slave trade did not just remove 12.5 million people from Africa — it restructured entire societies, incentivized warfare, devastated demographics, and created the racial hierarchies that still shape the modern world. Understanding African history requires confronting this catastrophe honestly: what was lost, who profited, and why the effects persist."
        >
          <InsightGrid items={SLAVE_TRADE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Colonial Partition ────────────────────────────────────────── */}
        <SectionWrapper
          id="partition"
          icon="✂️"
          title="The Colonial Partition — When Europe Drew Lines Through 1,000 Cultures (1884–1885)"
          accentColor={BLOOD_RED}
          intro="In a Berlin conference room in 1884, European diplomats divided an entire continent among themselves. No Africans were present. The straight lines they drew — cutting through kingdoms, ethnic groups, and trade networks that had existed for centuries — created the borders that define Africa today. By 1914, 90% of Africa was under European control."
        >
          <InsightGrid items={COLONIAL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures — The People Who Built African Civilizations"
          accentColor={GOLD}
          intro="From Kushite pharaohs to Zulu generals, from emperors who crashed gold markets to queens who fought European colonialism for 40 years — these are the people whose stories were erased from mainstream history."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connection Cards ─────────────────────────────────────────── */}
        <SectionWrapper
          id="connections"
          icon="🔗"
          title="Explore Related Deep-Dives"
          accentColor={TEAL}
          intro="Africa's history is deeply connected to the wider world — through trade, slavery, colonialism, and resistance. Explore these related deep-dives to see the full picture."
        >
          <ConnectionCards connections={CONNECTIONS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            padding: '48px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <blockquote
              style={{
                color: GOLD,
                fontSize: '1.15rem',
                fontStyle: 'italic',
                lineHeight: 1.7,
                maxWidth: 650,
                margin: '0 auto 24px',
              }}
            >
              "Until the lion learns to write, every story will glorify the hunter."
            </blockquote>
            <p style={{ color: SLATE, fontSize: '0.85rem', marginBottom: 20 }}>
              — African proverb
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
          </motion.div>
        </footer>
      </div>
    </div>
  );
}
