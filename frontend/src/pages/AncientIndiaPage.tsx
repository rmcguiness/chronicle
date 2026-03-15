import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#d4a030';   // Saffron gold
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(212,160,48,0.05)';
const CARD_BORDER = 'rgba(212,160,48,0.18)';
const SAFFRON = '#d4a030';
const INDUS_BLUE = '#3a7ca5';
const VEDIC_ORANGE = '#c9652a';
const DHARMA_GREEN = '#2e8b57';
const MAURYA_RED = '#9b2226';
const GUPTA_GOLD = '#c9a84c';
const LOTUS_PINK = '#b5508c';
const MATH_TEAL = '#1a8a7d';

/* ───────── Types ───────── */
type SectionTab =
  | 'timeline'
  | 'indus'
  | 'vedic'
  | 'ashoka'
  | 'math'
  | 'hinduism'
  | 'buddhism'
  | 'caste'
  | 'trade'
  | 'figures'
  | 'gupta'
  | 'legacy';

interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
  color: string;
}

interface Figure {
  name: string;
  dates: string;
  role: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

/* ───────── Data ───────── */

const CONTEXT_TEXT = 'Ancient India produced one of the world\'s oldest and most sophisticated civilizations — one that invented the number system we all use today, gave birth to two of the world\'s great religions, built cities with indoor plumbing 4,000 years ago, and developed mathematical concepts that would transform science itself. From the mysterious cities of the Indus Valley to the Golden Age of the Guptas, India\'s ancient history is a story of extraordinary intellectual achievement, spiritual depth, and cultural influence that reaches across the entire world to this day. Over four and a half millennia, the Indian subcontinent was home to planned cities, epic literature, revolutionary mathematics, and empires that stretched from Afghanistan to Bangladesh.';

const TIMELINE_EVENTS: TimelineEvent[] = [
  { date: '3300–1300 BCE', title: 'Indus Valley Civilization', detail: 'One of the world\'s first urban civilizations. Mohenjo-daro and Harappa featured grid-planned cities, indoor plumbing (the first in the world), standardized weights and measures, and a still-undeciphered script. At its peak, the civilization covered more territory than Egypt and Mesopotamia combined, with an estimated population of 5 million.', color: INDUS_BLUE },
  { date: '1500–500 BCE', title: 'Vedic Period', detail: 'The Indo-Aryans migrated into the Indian subcontinent, bringing the Sanskrit language and composing the Vedas — the oldest sacred texts of Hinduism. This period saw the origins of the caste system (varna), the development of early Hindu philosophy and ritual, and the emergence of the concept of dharma (cosmic order and moral duty). The great epics Mahabharata and Ramayana were first composed in this era.', color: VEDIC_ORANGE },
  { date: '600–322 BCE', title: 'Mahajanapadas & Rise of Buddhism/Jainism', detail: 'Sixteen great kingdoms (mahajanapadas) competed for dominance across northern India. This politically fractured but intellectually vibrant era produced two of the world\'s great religions: Buddhism (founded by Siddhartha Gautama, c. 563–483 BCE) and Jainism (systematized by Mahavira, c. 540–468 BCE). Both challenged Vedic orthodoxy and the caste system, emphasizing individual spiritual liberation.', color: DHARMA_GREEN },
  { date: '322–185 BCE', title: 'Maurya Empire', detail: 'Founded by Chandragupta Maurya with the strategic guidance of his advisor Chanakya, the Maurya Empire became the first to unify most of the Indian subcontinent. Under Ashoka the Great (r. 268–232 BCE), it became one of the largest empires in the ancient world, stretching from Afghanistan to Bangladesh. After the devastating Kalinga War, Ashoka converted to Buddhism and became history\'s first ruler to use state power to promote ethics and non-violence.', color: MAURYA_RED },
  { date: '320–550 CE', title: 'Gupta Empire — The Golden Age', detail: 'Under the Gupta dynasty, India entered a period of extraordinary cultural and scientific achievement. Mathematicians invented the concept of zero and the decimal number system. Aryabhata calculated pi to five decimal places and proposed that the Earth rotated on its axis. Kalidasa produced literary masterpieces rivaling Shakespeare. Nalanda University attracted 10,000 students from across Asia. Art, medicine, and astronomy all flourished.', color: GUPTA_GOLD },
];

const INDUS_VALLEY = {
  overview: 'The Indus Valley Civilization (also called the Harappan Civilization) was one of the three earliest urban civilizations in the world, alongside Mesopotamia and Egypt — yet in many ways it was the most advanced. Flourishing between 3300 and 1300 BCE in what is now Pakistan and northwestern India, it encompassed over 1,500 known sites across an area larger than Egypt and Mesopotamia combined.',
  remarkable: [
    { title: 'Grid-Planned Cities', detail: 'Mohenjo-daro and Harappa were laid out in precise grids — streets ran north-south and east-west, intersecting at right angles. Buildings were constructed from standardized, kiln-fired bricks in a uniform ratio of 4:2:1. This level of urban planning wouldn\'t be seen again until the Roman Empire, over 2,000 years later.', icon: '🏗️', color: INDUS_BLUE },
    { title: 'Indoor Plumbing — First in the World', detail: 'Nearly every house in Mohenjo-daro had its own private bathroom and toilet connected to a sophisticated citywide drainage system with covered sewers running beneath the streets. Wastewater was channeled into sedimentation tanks before leaving the city. No other civilization achieved this level of sanitation engineering for thousands of years — Rome\'s famous sewers came 2,000 years later.', icon: '🚿', color: INDUS_BLUE },
    { title: 'Standardized Weights and Measures', detail: 'The Harappans developed a remarkably precise system of weights based on multiples of a standard unit (approximately 0.86 grams). Their measuring rulers, made of ivory, were accurate to within 1.7 millimeters. This standardization across hundreds of cities suggests a sophisticated trade network and possibly centralized economic coordination.', icon: '⚖️', color: INDUS_BLUE },
    { title: 'The Great Bath', detail: 'Mohenjo-daro\'s Great Bath — a waterproofed pool measuring 12m × 7m × 2.4m deep — was likely used for ritual purification. It was lined with bitumen (natural tar) to prevent leaks, demonstrating advanced engineering. Some scholars see it as the earliest evidence of the ritual bathing that remains central to Hindu practice today.', icon: '🏊', color: INDUS_BLUE },
    { title: 'No Evidence of Warfare', detail: 'Remarkably, no weapons of war, defensive fortifications designed for combat, or depictions of battle have been found. Unlike contemporary Mesopotamia and Egypt, which glorified military conquest, the Indus Valley civilization appears to have been remarkably peaceful. No palaces or temples dominating the skyline have been identified either — suggesting a society organized around trade and civic function rather than royal or priestly power.', icon: '☮️', color: INDUS_BLUE },
    { title: 'Undeciphered Script', detail: 'The Harappans developed a writing system with approximately 400 distinct signs, found on small seal stones, pottery, and tablets. Despite over a century of attempts, no one has been able to decipher it — making the Indus Valley script one of the last great undecoded writing systems. Until it is read, the civilization\'s history, religion, and governance remain shrouded in mystery.', icon: '🔤', color: INDUS_BLUE },
  ],
  collapse: 'The Indus Valley Civilization did not fall to invasion — it gradually declined between 1900 and 1300 BCE, likely due to catastrophic climate change. The Saraswati River (Ghaggar-Hakra), along which many Harappan cities were built, dried up as monsoon patterns shifted. Without reliable water, agriculture failed, cities were abandoned, and the population dispersed into smaller rural settlements. Some scholars also point to tectonic activity that may have diverted rivers. The civilization didn\'t vanish so much as dissolve — its people migrated, its cities crumbled, and its script was forgotten. But its influence on subsequent Indian culture — in urban planning, weights, trade practices, and possibly religious rituals — likely persisted.',
};

const ASHOKA = {
  overview: 'Ashoka Maurya (r. 268–232 BCE) is one of the most remarkable rulers in all of human history. He inherited one of the world\'s largest empires, expanded it through brutal military conquest — and then, shattered by the carnage he himself had caused, underwent a complete moral transformation. He renounced violence, embraced Buddhism, and spent the rest of his reign promoting dharma (ethical conduct), religious tolerance, and non-violence. No other ancient ruler underwent such a radical change of heart, and no other used the machinery of empire not to conquer, but to teach.',
  kalinga: {
    title: 'The Kalinga War (c. 261 BCE)',
    detail: 'Ashoka invaded the kingdom of Kalinga (modern Odisha) to bring the last major independent territory on India\'s east coast under Maurya control. The war was devastatingly successful — and devastatingly brutal. According to Ashoka\'s own inscriptions, approximately 100,000 people were killed in battle, 150,000 were deported, and many more died from disease and famine in the aftermath. Ashoka himself witnessed the destruction — the burning villages, the fields of dead, the wailing of bereaved families — and was so horrified that he experienced a profound spiritual crisis. In his own words, carved into rock: "On conquering Kalinga, the Beloved of the Gods felt remorse, for when an independent country is conquered, the slaughter, death, and deportation of the people is extremely grievous."',
  },
  conversion: 'After Kalinga, Ashoka converted to Buddhism and declared that he would henceforth conquer not by the sword but by dharma — moral example. This was unprecedented in the ancient world: a ruler at the height of his military power choosing to renounce violence entirely.',
  rockEdicts: [
    { title: 'Ethical Governance', detail: 'Ashoka erected massive stone pillars and carved edicts into rock faces across his empire — the first known use of state power to propagate ethics rather than glorify conquest. The edicts promoted non-violence, respect for all religions, kindness to animals, care for the sick and elderly, and honest governance. They were written in local languages so ordinary people could read them.', icon: '📜', color: MAURYA_RED },
    { title: 'Religious Tolerance', detail: '"All religions should reside everywhere, for all of them desire self-control and purity of heart." Ashoka did not impose Buddhism on his subjects. Instead, he promoted tolerance and dialogue between all faiths — a principle that would not become common in governance for another two millennia.', icon: '🕊️', color: DHARMA_GREEN },
    { title: 'Animal Welfare', detail: 'Ashoka banned animal sacrifice, established veterinary hospitals (the first in recorded history), and limited hunting. He created a network of rest houses and wells for travelers along India\'s roads. His edicts specifically mention the protection of parrots, pigeons, porcupines, squirrels, deer, and other animals.', icon: '🐾', color: DHARMA_GREEN },
    { title: 'Buddhist Missionaries', detail: 'Ashoka dispatched Buddhist missionaries to Sri Lanka (where his son Mahinda and daughter Sanghamitta established Theravada Buddhism), Central Asia, Egypt, Syria, Macedonia, and possibly Southeast Asia. This was the first organized attempt to spread a religion beyond its homeland — and it succeeded spectacularly. Sri Lanka remains Theravada Buddhist to this day because of Ashoka\'s mission.', icon: '🌍', color: GUPTA_GOLD },
  ],
};

const MATH_CONTRIBUTIONS = [
  { title: 'Zero — The Number That Changed Everything', detail: 'Brahmagupta, in his 628 CE treatise Brahmasphutasiddhanta, was the first mathematician to formally define zero as a number and establish rules for arithmetic with zero (including that any number multiplied by zero equals zero). This was not just a placeholder digit — it was a conceptual revolution. Zero enabled the positional number system, which made advanced mathematics, algebra, and eventually computing possible. The concept traveled from India to the Islamic world, and then to Europe, transforming mathematics everywhere it went.', icon: '0️⃣', color: MATH_TEAL },
  { title: 'The Decimal Number System', detail: 'The base-10 positional number system — the system the entire world uses today — was developed in India. Each digit\'s value depends on its position (ones, tens, hundreds, etc.), and a zero serves as a placeholder. This system was far more efficient than Roman numerals, Egyptian hieratic numerals, or Chinese rod numerals. Arab mathematicians adopted it (calling the digits "Hindu numerals"), and when it reached Europe via Fibonacci\'s Liber Abaci (1202), Europeans called them "Arabic numerals" — but they are Indian in origin.', icon: '🔢', color: MATH_TEAL },
  { title: 'Pi to Five Decimal Places', detail: 'Aryabhata (476–550 CE), working in the Gupta Empire, calculated pi (π) as 3.1416 — accurate to five significant figures. He also correctly proposed that the Earth rotates on its own axis (rather than the heavens revolving around a stationary Earth), that the moon and planets shine by reflected sunlight, and provided explanations for eclipses based on shadows cast by and falling on Earth. These insights preceded Copernicus by a thousand years.', icon: 'π', color: GUPTA_GOLD },
  { title: 'Trigonometry', detail: 'Indian mathematicians developed the sine function (called jya in Sanskrit), which became the basis of modern trigonometry. Aryabhata\'s sine tables, compiled around 499 CE, were remarkably accurate. The word "sine" itself derives from a Latin mistranslation of the Arabic translation of the Sanskrit term — a linguistic chain that traces the knowledge from India to Arabia to Europe.', icon: '📐', color: INDUS_BLUE },
  { title: 'Algebra and Combinatorics', detail: 'Brahmagupta and later Bhaskara II (1114–1185 CE) developed solutions to quadratic equations, worked with negative numbers, and explored concepts in combinatorics and number theory. Bhaskara II\'s Lilavati (written for his daughter) is one of the most elegant mathematical textbooks ever produced, covering arithmetic, algebra, and geometry through engaging word problems.', icon: '🧮', color: VEDIC_ORANGE },
];

const HINDUISM = {
  overview: 'Hinduism is the world\'s oldest major religion still practiced today, with roots stretching back to the Vedic period (1500–500 BCE) and possibly to the Indus Valley Civilization. Unlike Christianity or Islam, Hinduism has no single founder, no single scripture, and no single creed. It is a vast, diverse tradition that encompasses monotheism, polytheism, pantheism, and philosophical atheism — unified not by dogma but by shared cultural practices, texts, and concepts like dharma, karma, and moksha.',
  evolution: 'Hinduism evolved in stages: the early Vedic religion focused on fire sacrifices (yajna) to powerful nature gods like Indra (storm), Agni (fire), and Varuna (cosmic order). The Upanishads (c. 800–200 BCE) shifted focus from external ritual to internal philosophy — introducing the concepts of Brahman (ultimate reality), Atman (the soul), karma (moral causation), samsara (cycle of rebirth), and moksha (liberation). By the classical period, devotional worship (bhakti) of personal gods — especially Vishnu, Shiva, and the goddess Devi — became central.',
  texts: [
    { title: 'The Vedas (c. 1500–1200 BCE)', detail: 'Four collections of hymns, prayers, and ritual instructions — the Rigveda (1,028 hymns to the gods), Samaveda (melodies), Yajurveda (ritual formulas), and Atharvaveda (spells and incantations). These are the oldest religious texts in continuous use anywhere in the world.', icon: '📖', color: VEDIC_ORANGE },
    { title: 'The Upanishads (c. 800–200 BCE)', detail: 'Philosophical dialogues that form the intellectual foundation of Hinduism. They explore the nature of ultimate reality (Brahman), the self (Atman), and the relationship between the two — culminating in the profound assertion "Tat tvam asi" ("You are that") — the individual soul and the cosmic soul are one.', icon: '🧘', color: SAFFRON },
    { title: 'The Mahabharata', detail: 'The longest epic poem ever composed (100,000 verses — seven times the length of the Iliad and Odyssey combined). It tells the story of a dynastic war between the Pandavas and Kauravas, but contains within it the Bhagavad Gita — a dialogue between the warrior Arjuna and the god Krishna about duty, righteousness, and the nature of existence — considered the single most important text in Hinduism.', icon: '⚔️', color: MAURYA_RED },
    { title: 'The Ramayana', detail: 'The story of Prince Rama, his wife Sita, and the demon king Ravana. It explores themes of dharma, loyalty, and the ideal ruler. Rama is venerated as the perfect man (maryada purushottam), and the Ramayana has profoundly shaped Indian culture, art, and ethics for over two millennia. It has been adapted across Southeast Asia — from Thai Ramakien to Javanese Kakawin Ramayana.', icon: '🏹', color: GUPTA_GOLD },
  ],
  deities: [
    { title: 'Brahma — The Creator', detail: 'The god of creation, who brought the universe into existence. Depicted with four heads (representing the four Vedas) and four arms. Despite his cosmic role, Brahma is the least worshipped of the trinity — there are only a handful of Brahma temples in all of India, while Vishnu and Shiva have thousands.', icon: '✨', color: GUPTA_GOLD },
    { title: 'Vishnu — The Preserver', detail: 'The protector and sustainer of the universe, who incarnates on Earth (as avatars) whenever cosmic order is threatened. His ten avatars include Rama and Krishna — both widely worshipped in their own right. Vishnu represents compassion, mercy, and the maintenance of dharma.', icon: '🔵', color: INDUS_BLUE },
    { title: 'Shiva — The Destroyer and Transformer', detail: 'The god of destruction, transformation, and regeneration. Shiva is the cosmic dancer (Nataraja) whose dance creates and destroys the universe in endless cycles. He is also the supreme ascetic — meditating on Mount Kailash — and the devoted husband of Parvati. Shiva embodies paradox: the destroyer who enables renewal.', icon: '🔱', color: LOTUS_PINK },
    { title: 'Krishna', detail: 'An avatar of Vishnu — the playful child god, the divine lover, the wise counselor. In the Bhagavad Gita, Krishna reveals himself as the Supreme Being and teaches Arjuna about duty, devotion, and the nature of the soul. Krishna is perhaps the most beloved deity in Hinduism — worshipped as a child, a lover, a king, and the ultimate reality.', icon: '🪈', color: DHARMA_GREEN },
    { title: 'Ganesha — The Remover of Obstacles', detail: 'The elephant-headed god of beginnings, wisdom, and learning. Ganesha is invoked before any new venture — from starting a business to beginning a journey to writing a book. He is the son of Shiva and Parvati, and his origin story (Shiva beheading his own son, then replacing his head with that of an elephant) is one of Hinduism\'s most famous myths.', icon: '🐘', color: VEDIC_ORANGE },
  ],
};

const BUDDHISM = {
  overview: 'Buddhism began with a single man\'s quest to understand suffering — and became one of the world\'s great religions, with over 500 million followers today. Founded by Siddhartha Gautama in the 5th century BCE in what is now Nepal and northern India, Buddhism offered a radical alternative to Vedic Hinduism: no caste hierarchy, no priestly monopoly on spiritual truth, and a practical path to liberation that anyone could follow.',
  siddhartha: 'Siddhartha Gautama (c. 563–483 BCE) was born a prince of the Shakya clan in Lumbini (modern Nepal). His father, determined to keep him from the suffering of the world, raised him in luxury within palace walls. But at age 29, Siddhartha ventured outside and encountered the "Four Sights" that would change his life: an old man (aging), a sick man (illness), a corpse (death), and a wandering ascetic (the possibility of liberation). Shocked by the reality of human suffering, Siddhartha renounced his princely life — leaving his wife, infant son, and kingdom — to seek the truth about suffering and how to end it. After six years of extreme asceticism (which he rejected as futile), he sat beneath a Bodhi tree in Bodh Gaya and meditated until he achieved enlightenment (bodhi) — becoming the Buddha ("the Awakened One").',
  fourNoble: [
    { title: 'Dukkha — Life Is Suffering', detail: 'All existence involves suffering, dissatisfaction, and impermanence. Even moments of happiness are tinged with the knowledge that they will end. Birth is suffering, aging is suffering, death is suffering. Being separated from what we love is suffering; being stuck with what we hate is suffering; not getting what we want is suffering.', icon: '1️⃣', color: MAURYA_RED },
    { title: 'Samudaya — Suffering Has a Cause', detail: 'The cause of suffering is tanha (craving, desire, attachment). We suffer because we cling to pleasures, to existence, to ideas about ourselves. This craving drives the cycle of rebirth (samsara) — we are born, we desire, we suffer, we die, and we are reborn to desire and suffer again.', icon: '2️⃣', color: VEDIC_ORANGE },
    { title: 'Nirodha — Suffering Can End', detail: 'It is possible to end suffering by eliminating craving. The complete cessation of desire leads to nirvana — a state of liberation, peace, and freedom from the cycle of rebirth. Nirvana is not a place but a state of being — the extinguishing of the fires of greed, hatred, and delusion.', icon: '3️⃣', color: DHARMA_GREEN },
    { title: 'Magga — The Path to the End of Suffering', detail: 'The way to end suffering is the Noble Eightfold Path: Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, and Right Concentration. This is the "Middle Way" between extreme asceticism and indulgence — a practical, ethical, and meditative discipline accessible to anyone.', icon: '4️⃣', color: MATH_TEAL },
  ],
  spread: 'Buddhism spread from India across all of Asia — and its path of transmission is one of the great stories of cultural diffusion. Ashoka\'s missionaries brought Theravada Buddhism to Sri Lanka and Southeast Asia. Merchants carried it along the Silk Road to Central Asia, China, Korea, and Japan. Tantric Buddhism reached Tibet, where it merged with local Bon traditions to create Tibetan Buddhism. By 500 CE, Buddhism had more followers outside India than within it. Ironically, Buddhism gradually declined in its homeland — reabsorbed into Hinduism and devastated by Islamic invasions that destroyed monasteries like Nalanda — but thrived across East and Southeast Asia. Today, approximately 500 million people worldwide identify as Buddhist.',
};

const CASTE_SYSTEM = {
  overview: 'The caste system (varna-jati) is one of the oldest and most consequential social structures in human history. Originating in the Vedic period, it divided society into hereditary groups that determined occupation, marriage, diet, and social interaction — creating a hierarchy that has shaped Indian society for over 3,000 years.',
  origins: 'The Rigveda\'s Purusha Sukta (Hymn of the Cosmic Man) describes the creation of the four varnas from the body of a primordial being: Brahmins (priests) from the mouth, Kshatriyas (warriors) from the arms, Vaishyas (merchants/farmers) from the thighs, and Shudras (servants) from the feet. Whether this hymn was meant as metaphor or prescription is debated, but it provided the foundational text for caste hierarchy.',
  varnas: [
    { title: 'Brahmins — The Priestly Class', detail: 'Responsible for religious rituals, teaching, and preserving sacred knowledge. Brahmins occupied the top of the social hierarchy and were considered ritually pure. They were the custodians of the Vedas and the only ones permitted to perform sacrifices.', icon: '🕉️', color: SAFFRON },
    { title: 'Kshatriyas — The Warrior-Rulers', detail: 'Kings, warriors, and administrators. The Kshatriya varna included the ruling families and military aristocracy. Both the Buddha (Siddhartha Gautama) and Mahavira (founder of Jainism) were born into Kshatriya families — and both challenged the Brahmin monopoly on spiritual authority.', icon: '⚔️', color: MAURYA_RED },
    { title: 'Vaishyas — Merchants and Farmers', detail: 'The commercial and agricultural class. Vaishyas engaged in trade, cattle-herding, and farming. They were economically productive but socially subordinate to Brahmins and Kshatriyas. Many of India\'s great trading communities — the Marwaris, Chettiars, and others — trace their identity to this varna.', icon: '🌾', color: GUPTA_GOLD },
    { title: 'Shudras — The Servant Class', detail: 'Laborers and service workers who served the three higher varnas. Shudras were excluded from Vedic rituals and sacred knowledge. Their role was defined as serving others — a position justified by the doctrine of karma (you were born Shudra because of actions in a previous life).', icon: '🔨', color: INDUS_BLUE },
    { title: 'Dalits — "Untouchables"', detail: 'Below even the Shudras were the "outcastes" or "untouchables" (now called Dalits — "the oppressed"). They performed work considered ritually polluting — handling dead bodies, cleaning sewers, working with leather. They were excluded from temples, wells, and schools, and their mere shadow was considered contaminating. Despite legal abolition of untouchability in 1950, caste discrimination persists in India today — a legacy that continues to shape the lives of over 200 million Dalits.', icon: '✊', color: LOTUS_PINK },
  ],
  impact: 'The caste system was both challenged and reinforced throughout Indian history. Buddhism and Jainism explicitly rejected caste hierarchy — the Buddha declared that a person\'s worth was determined by their actions, not their birth. The Bhakti movement (7th–17th centuries) produced poet-saints from low castes who defied Brahmin authority. Yet caste endured, becoming more rigid over time and intersecting with colonial-era census categories. Today, India\'s constitution outlaws caste discrimination, and affirmative action (reservation) provides quotas for historically disadvantaged castes in education and government — but the social reality of caste remains deeply embedded in Indian society.',
};

const TRADE = {
  overview: 'Ancient India was a nexus of global trade — its goods reached Rome, China, Southeast Asia, and East Africa through overland caravan routes and maritime trade networks that spanned the Indian Ocean. Indian merchants were among the most sophisticated in the ancient world, and Indian goods — especially spices, textiles, and gems — were among the most coveted.',
  connections: [
    { title: 'The Spice Trade', detail: 'India was the world\'s primary source of pepper, cinnamon, cardamom, turmeric, and other spices that were valued across the ancient world. Roman demand for Indian pepper was so intense that Pliny the Elder complained that Rome was hemorrhaging gold to pay for Indian spices — he estimated 50 million sesterces annually flowed to India. Pepper was literally worth its weight in gold in Rome.', icon: '🌶️', color: VEDIC_ORANGE },
    { title: 'Cotton and Textiles', detail: 'India was the first civilization to cultivate cotton and weave it into cloth — a technology that wouldn\'t reach Europe for over a thousand years. Indian textiles (especially muslin from Bengal, so fine it was called "woven air") were exported across the ancient world. Roman women prized Indian cotton, and fragments of Indian cloth have been found in Egyptian tombs.', icon: '🧵', color: GUPTA_GOLD },
    { title: 'The Roman-India Connection', detail: 'Direct maritime trade between Rome and India flourished from the 1st century BCE. Roman ships sailed from Egyptian ports on the Red Sea, using monsoon winds to cross the Arabian Sea to India\'s Malabar Coast. The Periplus of the Erythraean Sea (c. 40–70 CE) — a Roman merchant\'s guide — describes Indian ports, goods, and trade customs in remarkable detail. Hoards of Roman gold coins have been found across southern India, and a Roman trading settlement existed at Arikamedu near modern Puducherry.', icon: '🏛️', color: MAURYA_RED },
    { title: 'Maritime Southeast Asia', detail: 'Indian merchants and cultural influence spread across Southeast Asia from the early centuries CE — a process sometimes called "Indianization." Indian traders brought Hinduism, Buddhism, Sanskrit, and Indian political concepts to modern Cambodia (Angkor Wat — a Hindu temple), Indonesia (Borobudur — a Buddhist monument), Thailand, Myanmar, and Vietnam. This was largely a peaceful cultural transmission through trade, not military conquest.', icon: '⛵', color: INDUS_BLUE },
    { title: 'Steel and Gems', detail: 'India produced the finest steel in the ancient world — wootz steel (also called Damascus steel when re-forged by Arab smiths) was prized for its strength, flexibility, and distinctive watered pattern. Indian diamonds, sapphires, and other gemstones were exported to Rome, Persia, and China. India was the world\'s only source of diamonds until the 18th century.', icon: '💎', color: MATH_TEAL },
  ],
};

const KEY_FIGURES: Figure[] = [
  { name: 'Chandragupta Maurya', dates: 'r. 322–298 BCE', role: 'Founder of the Maurya Empire', contribution: 'United most of the Indian subcontinent for the first time', detail: 'Born into a humble family, Chandragupta overthrew the Nanda dynasty with the guidance of his advisor Chanakya, defeated the garrisons left by Alexander the Great, and built an empire stretching from Bengal to Afghanistan. He later defeated Seleucus Nicator (Alexander\'s successor) and secured the northwestern frontier through a peace treaty that included a marriage alliance. Ancient sources describe an efficient centralized administration with a vast spy network, a standing army of 600,000, and a sophisticated bureaucracy. In his old age, according to Jain tradition, Chandragupta abdicated the throne, became a Jain monk, and fasted to death — a striking end for one of history\'s great conquerors.', icon: '👑', color: MAURYA_RED },
  { name: 'Chanakya (Kautilya)', dates: 'c. 375–283 BCE', role: 'Political strategist, author of the Arthashastra', contribution: 'Wrote history\'s first treatise on statecraft — Machiavelli 2,000 years before Machiavelli', detail: 'Chanakya was a Brahmin scholar at the University of Takshashila who became Chandragupta\'s chief advisor and the architect of the Maurya Empire. His Arthashastra ("The Science of Material Gain") is an extraordinary treatise on statecraft, economics, military strategy, espionage, and governance — covering everything from tax policy to the use of spies, from interrogation techniques to water management. It is ruthlessly pragmatic: "A king who does not act decisively is despised." Written roughly 1,800 years before Machiavelli\'s The Prince, the Arthashastra is far more comprehensive and arguably more sophisticated. Chanakya is often called the "Indian Machiavelli," but chronologically, Machiavelli should be called the "Italian Chanakya."', icon: '🧠', color: SAFFRON },
  { name: 'Ashoka the Great', dates: 'r. 268–232 BCE', role: 'Maurya Emperor — warrior turned pacifist', contribution: 'First ruler to use state power to promote ethics over conquest', detail: 'Ashoka\'s transformation after the Kalinga War — from ruthless conqueror to Buddhist pacifist — is covered in detail in the dedicated section. His Rock Edicts, carved across the subcontinent, are the first direct evidence of a ruler\'s own words in Indian history. He promoted non-violence, religious tolerance, and welfare programs — establishing hospitals, rest houses, and animal sanctuaries. H.G. Wells wrote that "amidst the tens of thousands of names of monarchs... the name of Ashoka shines, and shines almost alone, a star." His Ashoka Chakra (the 24-spoked wheel) appears on India\'s national flag to this day.', icon: '☸️', color: DHARMA_GREEN },
  { name: 'Aryabhata', dates: '476–550 CE', role: 'Mathematician and astronomer', contribution: 'Calculated pi to 5 decimal places; proposed Earth\'s axial rotation', detail: 'Working in the Gupta Empire, Aryabhata produced the Aryabhatiya (499 CE) — one of the most influential mathematical and astronomical works in history. He calculated pi as 3.1416, developed sine tables that formed the basis of trigonometry, proposed that the Earth rotates on its axis (explaining the apparent movement of stars), correctly explained eclipses as shadows rather than demon attacks, and estimated the Earth\'s circumference with remarkable accuracy (within 0.2% of the modern value). He also worked with large numbers and algebraic identities. The Indian space agency\'s first satellite (1975) was named Aryabhata in his honor.', icon: '🔭', color: MATH_TEAL },
  { name: 'Kalidasa', dates: 'c. 4th–5th century CE', role: 'Poet and playwright — the "Shakespeare of India"', contribution: 'Greatest literary figure of classical Sanskrit literature', detail: 'Kalidasa is widely regarded as the greatest poet and dramatist in the Sanskrit language. His play Abhijnanasakuntalam (The Recognition of Shakuntala) — a love story of King Dushyanta and the maiden Shakuntala — so moved the German writer Goethe that he wrote: "If you want the bloom of youth and the fruit of age... I name with one word: Shakuntala." His epic poems Meghaduta (The Cloud Messenger) and Kumarasambhava demonstrate extraordinary mastery of metaphor, emotion, and natural description. Like Shakespeare, almost nothing is known about his actual life — but his works define the golden age of Indian literature and continue to be performed, translated, and studied worldwide.', icon: '✍️', color: GUPTA_GOLD },
];

const GUPTA = {
  overview: 'The Gupta Empire (320–550 CE) presided over India\'s Golden Age — a period of extraordinary achievement in mathematics, astronomy, literature, art, philosophy, and medicine that rivals the European Renaissance in its breadth and impact. Under Gupta patronage, Indian civilization reached heights of creativity and intellectual sophistication that would influence the entire world.',
  achievements: [
    { title: 'Nalanda University', detail: 'Founded in the 5th century CE, Nalanda was the world\'s first residential university — a vast Buddhist monastic complex in modern Bihar that attracted up to 10,000 students and 2,000 teachers from across Asia. It had a nine-story library (Dharmaganja — "Treasury of Truth"), dormitories, meditation halls, and classrooms covering every field of knowledge: Buddhist philosophy, logic, grammar, medicine, astronomy, and mathematics. Chinese pilgrim Xuanzang studied there for five years (631–636 CE) and left detailed descriptions. Nalanda continued to operate for 700 years until destroyed by Turkic invaders in 1193 CE — one of the great cultural catastrophes of the medieval period.', icon: '🎓', color: GUPTA_GOLD },
    { title: 'Art and Architecture', detail: 'Gupta-era artists created some of India\'s most sublime works — including the serene Buddha statues of Sarnath (their gentle smiles and perfect proportions set the standard for Buddhist art across Asia), the carved caves of Ajanta (stunning frescoes depicting the lives of the Buddha), and the rock-cut temples of Udayagiri. The Gupta aesthetic — restrained, elegant, and spiritually resonant — influenced art from Afghanistan to Japan.', icon: '🎨', color: LOTUS_PINK },
    { title: 'Medicine — Ayurveda and Surgery', detail: 'The Gupta period saw the compilation of major Ayurvedic medical texts. Sushruta (possibly pre-Gupta but compiled in this era) described over 300 surgical procedures including cataract surgery, rhinoplasty (nose reconstruction — the earliest known plastic surgery), cesarean section, and the setting of fractures. He classified 1,120 diseases and described 760 medicinal plants. Indian medicine was exported to the Islamic world and influenced medical practice across Asia.', icon: '⚕️', color: DHARMA_GREEN },
    { title: 'Astronomy', detail: 'Beyond Aryabhata\'s groundbreaking work, Gupta-era astronomers calculated the solar year as 365.3586 days (modern value: 365.2564), developed accurate models of planetary motion, and built sophisticated astronomical observatories. Varahamihira\'s Panchasiddhantika synthesized Indian, Greek, and Mesopotamian astronomical knowledge into a comprehensive system.', icon: '🌟', color: INDUS_BLUE },
    { title: 'Literature and Philosophy', detail: 'Beyond Kalidasa, the Gupta period produced Vishakhadatta (political drama Mudrarakshasa), Shudraka (Mrichchhakatika — a realistic social comedy), and major philosophical works by Buddhist and Hindu thinkers. The Panchatantra — a collection of animal fables teaching practical wisdom — was composed in this era and eventually translated into over 50 languages, becoming one of the most widely translated literary works in human history (influencing Aesop\'s Fables in reverse transmission).', icon: '📚', color: VEDIC_ORANGE },
  ],
};

const LEGACY = [
  { title: 'Hinduism and Buddhism — 2.5 Billion Followers', detail: 'The two great religions born in India today have approximately 1.2 billion Hindu and 500 million Buddhist followers — combined, nearly a third of humanity. Hindu concepts like karma, dharma, and yoga have permeated global culture. Buddhist meditation practices are now mainstream worldwide. The spiritual traditions born in ancient India shape the inner lives of billions.', icon: '🙏', color: SAFFRON },
  { title: 'The Number System Used by Everyone', detail: 'Every person on Earth who writes a number uses a system invented in India. The decimal place-value system with zero — developed by Brahmagupta, Aryabhata, and other Indian mathematicians — is the foundation of all modern mathematics, science, engineering, and computing. Without Indian mathematics, there is no algebra, no calculus, no computer science. This is arguably the single most important intellectual contribution of any civilization to human progress.', icon: '🔢', color: MATH_TEAL },
  { title: 'Yoga and Meditation', detail: 'Yoga, originating in ancient Indian spiritual practices described in the Upanishads and systematized by Patanjali (c. 2nd century BCE), is now practiced by over 300 million people worldwide. Vipassana meditation (Buddhist), transcendental meditation (Hindu-derived), and mindfulness practices have transformed global wellness culture. The WHO has recognized June 21 as International Yoga Day.', icon: '🧘', color: DHARMA_GREEN },
  { title: 'Ayurveda — The Science of Life', detail: 'India\'s traditional medical system, developed over millennia, emphasizes prevention, balance, and holistic treatment. While modern evidence-based medicine has largely superseded Ayurveda in clinical practice, Ayurvedic concepts (especially in nutrition, herbal medicine, and stress management) continue to influence alternative and integrative medicine worldwide. Turmeric — an Ayurvedic staple — is now one of the most-studied anti-inflammatory compounds in modern pharmacology.', icon: '🌿', color: GUPTA_GOLD },
  { title: 'Chess — India\'s Gift to Strategy', detail: 'Chess (chaturanga — "four divisions of the military") was invented in India during the Gupta period (c. 6th century CE). The game\'s four original pieces represented the four divisions of the Indian army: infantry (pawns), cavalry (knights), elephants (bishops), and chariots (rooks). From India it spread to Persia (where it became shatranj), then to the Islamic world and Europe, becoming the world\'s most popular strategy game — played by an estimated 600 million people today.', icon: '♟️', color: INDUS_BLUE },
  { title: 'Language and Literature', detail: 'Sanskrit — the classical language of ancient India — is the oldest member of the Indo-European language family with surviving literature. Its grammatical analysis by Panini (c. 4th century BCE) in the Ashtadhyayi is considered the most sophisticated grammar of any language in the pre-modern world — and directly influenced modern linguistic theory (Noam Chomsky acknowledged Panini\'s influence). Indian literary forms — the epic, the fable, the philosophical dialogue — influenced literature from Persia to Southeast Asia.', icon: '📖', color: VEDIC_ORANGE },
];

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'indus', label: 'Indus Valley', icon: '🏗️' },
  { key: 'vedic', label: 'Vedic & Hinduism', icon: '🕉️' },
  { key: 'buddhism', label: 'Buddhism', icon: '☸️' },
  { key: 'ashoka', label: 'Ashoka', icon: '🦁' },
  { key: 'math', label: 'Mathematics', icon: '🔢' },
  { key: 'caste', label: 'Caste System', icon: '📊' },
  { key: 'trade', label: 'Trade', icon: '⛵' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'gupta', label: 'Golden Age', icon: '✨' },
  { key: 'legacy', label: 'Legacy', icon: '🌍' },
];

/* ───────── Helpers ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${ACCENT}15`, border: `1px solid ${ACCENT}33` }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${active ? ACCENT : CARD_BORDER}`, backgroundColor: active ? `${ACCENT}22` : 'transparent', color: active ? ACCENT : TEXT_DIM, fontSize: 13, fontWeight: active ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.15s ease' }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ───────── Main Component ───────── */

export default function AncientIndiaPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <section style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>← Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: `${ACCENT}22`, border: `2px solid ${ACCENT}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🕉️</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>Deep Dive</div>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 900, color: TEXT, margin: 0, lineHeight: 1.1 }}>Ancient India</h1>
            </div>
          </div>
          <p style={{ fontSize: 'clamp(14px, 2.5vw, 17px)', color: TEXT_DIM, lineHeight: 1.6, margin: '0 0 8px', fontWeight: 600 }}>Civilization, Spirituality, and Science at the Dawn of History (3300 BCE – 1200 CE)</p>
          <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.7, margin: '0 0 24px' }}>{CONTEXT_TEXT}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <StatBadge value="4,600 yrs" label="of civilization" />
            <StatBadge value="2.5B" label="followers today" />
            <StatBadge value="Zero" label="invented here" />
            <StatBadge value="1,500+" label="Indus Valley sites" />
            <StatBadge value="10,000" label="students at Nalanda" />
          </div>
        </section>

        {/* ─── Tab Navigation ─── */}
        <div style={{ padding: '12px 32px', borderBottom: `1px solid ${CARD_BORDER}`, position: 'sticky', top: 0, backgroundColor: BG, zIndex: 10 }}>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {SECTION_TABS.map(tab => (
              <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
            ))}
          </div>
        </div>

        {/* ─── Timeline ─── */}
        {activeTab === 'timeline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📅" title="Timeline — Five Major Periods" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>From the first cities of the Indus Valley to the Golden Age of the Guptas — 4,600 years of civilization.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TIMELINE_EVENTS.map((evt, i) => (
                <motion.div key={evt.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${evt.color}44`, backgroundColor: `${evt.color}08`, borderLeft: `4px solid ${evt.color}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: evt.color, fontFamily: 'monospace', marginBottom: 4 }}>{evt.date}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: TEXT, marginBottom: 8 }}>{evt.title}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{evt.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Indus Valley ─── */}
        {activeTab === 'indus' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🏗️" title="Indus Valley Civilization — The First Great Cities" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{INDUS_VALLEY.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: INDUS_BLUE, margin: '24px 0 14px' }}>What Made It Remarkable</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {INDUS_VALLEY.remarkable.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: INDUS_BLUE, margin: '28px 0 14px' }}>Why It Collapsed</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${INDUS_BLUE}33`, backgroundColor: `${INDUS_BLUE}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{INDUS_VALLEY.collapse}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Vedic & Hinduism ─── */}
        {activeTab === 'vedic' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🕉️" title="Hinduism — The World's Oldest Living Religion" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{HINDUISM.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: VEDIC_ORANGE, margin: '24px 0 14px' }}>From Vedic Religion to Classical Hinduism</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${VEDIC_ORANGE}33`, backgroundColor: `${VEDIC_ORANGE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{HINDUISM.evolution}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SAFFRON, margin: '24px 0 14px' }}>Sacred Texts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {HINDUISM.texts.map((text, i) => (
                <motion.div key={text.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${text.color}33`, backgroundColor: `${text.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{text.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: text.color }}>{text.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{text.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SAFFRON, margin: '24px 0 14px' }}>Major Deities</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {HINDUISM.deities.map((deity, i) => (
                <motion.div key={deity.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${deity.color}33`, backgroundColor: `${deity.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{deity.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: deity.color }}>{deity.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{deity.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Buddhism ─── */}
        {activeTab === 'buddhism' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="☸️" title="Buddhism — From One Man's Quest to a World Religion" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{BUDDHISM.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DHARMA_GREEN, margin: '24px 0 14px' }}>The Life of Siddhartha Gautama</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${DHARMA_GREEN}33`, backgroundColor: `${DHARMA_GREEN}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{BUDDHISM.siddhartha}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SAFFRON, margin: '24px 0 14px' }}>The Four Noble Truths</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {BUDDHISM.fourNoble.map((truth, i) => (
                <motion.div key={truth.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${truth.color}33`, backgroundColor: `${truth.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{truth.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: truth.color }}>{truth.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{truth.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: INDUS_BLUE, margin: '24px 0 14px' }}>Spread Across Asia</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${INDUS_BLUE}33`, backgroundColor: `${INDUS_BLUE}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{BUDDHISM.spread}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Ashoka ─── */}
        {activeTab === 'ashoka' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🦁" title="Ashoka the Great — From Warrior to Pacifist" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{ASHOKA.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: MAURYA_RED, margin: '24px 0 14px' }}>{ASHOKA.kalinga.title}</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${MAURYA_RED}33`, backgroundColor: `${MAURYA_RED}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ASHOKA.kalinga.detail}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: DHARMA_GREEN, margin: '24px 0 14px' }}>Conversion to Buddhism</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${DHARMA_GREEN}33`, backgroundColor: `${DHARMA_GREEN}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ASHOKA.conversion}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SAFFRON, margin: '24px 0 14px' }}>The Rock Edicts — Ethics Carved in Stone</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ASHOKA.rockEdicts.map((edict, i) => (
                <motion.div key={edict.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${edict.color}33`, backgroundColor: `${edict.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{edict.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: edict.color }}>{edict.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{edict.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Mathematics ─── */}
        {activeTab === 'math' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🔢" title="Indian Mathematics — The Numbers That Changed the World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>India's mathematical contributions are among the most consequential in human history. The number system you use every day — and the concept of zero that makes it work — were invented here.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MATH_CONTRIBUTIONS.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Caste System ─── */}
        {activeTab === 'caste' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="📊" title="The Caste System — Origins and Impact" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{CASTE_SYSTEM.overview}</p>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: VEDIC_ORANGE, margin: '24px 0 14px' }}>Origins — The Purusha Sukta</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${VEDIC_ORANGE}33`, backgroundColor: `${VEDIC_ORANGE}08`, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CASTE_SYSTEM.origins}</div>
            </motion.div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: SAFFRON, margin: '24px 0 14px' }}>The Four Varnas (and Those Outside)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {CASTE_SYSTEM.varnas.map((varna, i) => (
                <motion.div key={varna.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${varna.color}33`, backgroundColor: `${varna.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{varna.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: varna.color }}>{varna.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{varna.detail}</div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: LOTUS_PINK, margin: '24px 0 14px' }}>Legacy and Ongoing Impact</h3>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${LOTUS_PINK}33`, backgroundColor: `${LOTUS_PINK}08` }}>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{CASTE_SYSTEM.impact}</div>
            </motion.div>
          </section>
        )}

        {/* ─── Trade ─── */}
        {activeTab === 'trade' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="⛵" title="Trade Connections — India at the Center of the Ancient World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{TRADE.overview}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TRADE.connections.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Key Figures ─── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="👤" title="Key Figures of Ancient India" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>The rulers, thinkers, and scientists who shaped Indian civilization — and the world.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {KEY_FIGURES.map((fig, i) => (
                <motion.div key={fig.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ borderRadius: 12, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, overflow: 'hidden' }}>
                  <button onClick={() => setExpandedFigure(expandedFigure === fig.name ? null : fig.name)} style={{ width: '100%', padding: '16px 22px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                    <span style={{ fontSize: 28 }}>{fig.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: fig.color }}>{fig.name}</div>
                      <div style={{ fontSize: 12, color: TEXT_DIM, fontFamily: 'monospace' }}>{fig.dates}</div>
                      <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 2 }}>{fig.role}</div>
                    </div>
                    <span style={{ fontSize: 13, color: TEXT_MUTED, transform: expandedFigure === fig.name ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedFigure === fig.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '0 22px 18px', borderTop: `1px solid ${fig.color}22` }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: fig.color, margin: '14px 0 6px' }}>{fig.contribution}</div>
                          <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{fig.detail}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Gupta Golden Age ─── */}
        {activeTab === 'gupta' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="✨" title="The Gupta Golden Age — India's Renaissance" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>{GUPTA.overview}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {GUPTA.achievements.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Legacy ─── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon="🌍" title="Legacy — India's Enduring Gift to the World" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 20, marginTop: 0 }}>How a subcontinent's spiritual traditions, mathematical genius, and cultural creativity shaped civilization itself.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {LEGACY.map((item, i) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }} style={{ padding: '18px 22px', borderRadius: 12, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Footer ─── */}
        <div style={{ padding: 32, textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>← Back to Timeline</Link>
        </div>

      </div>
    </div>
  );
}
