/**
 * HinduismHistoryPage — comprehensive deep-dive on the history of Hinduism
 * (3500 BCE–Present).
 *
 * Route: /hinduism-history
 *
 * Sections:
 *  1. Hero — headline, overview, key stats
 *  2. What Is Hinduism? — not one religion but a family of traditions
 *  3. Indus Valley Origins — Harappa/Mohenjo-daro, proto-Shiva, ritual bathing
 *  4. Vedic Period — Aryan migrations, four Vedas, fire sacrifices, Upanishads
 *  5. Core Concepts — Dharma, Karma, Samsara, Moksha, Brahman, Atman
 *  6. The Trinity (Trimurti) — Brahma, Vishnu, Shiva
 *  7. The Epics — Mahabharata, Bhagavad Gita, Ramayana
 *  8. Bhakti Movement — devotional revolution, poet-saints
 *  9. Philosophy Schools — Advaita, Dvaita, Vishishtadvaita
 * 10. Caste System — varna, jati, Dalits, Ambedkar, modern India
 * 11. Islam & Hindu Encounter — Sultanate, Mughals, synthesis, Sikhism
 * 12. Colonial Period & Reform — British rule, Ram Mohan Roy, Vivekananda, Gandhi
 * 13. Hinduism Today — 1.2 billion adherents, diaspora, Hindu nationalism
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const SAFFRON = '#f97316';
const DEEP_SAFFRON = '#ea580c';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const LOTUS_PINK = '#ec4899';
const EARTH_BROWN = '#92400e';
const SKY_BLUE = '#0ea5e9';

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

const KEY_STATS = [
  { value: '1.2B', label: 'Hindus worldwide (15% of humanity)' },
  { value: '4,000+', label: 'Years of continuous tradition' },
  { value: '33M', label: 'Deities in Hindu tradition' },
  { value: '3,500 yr', label: 'Age of Sanskrit language' },
  { value: '200K', label: 'Verses in the Mahabharata' },
  { value: '300M', label: 'Yoga practitioners worldwide' },
];

// ── Indus Valley ────────────────────────────────────────────────────────────

const INDUS_VALLEY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Harappa & Mohenjo-daro (3300–1300 BCE)',
    detail:
      'The Indus Valley Civilization was one of the world\'s first urban cultures, rivaling Egypt and Mesopotamia. Its two greatest cities — Harappa and Mohenjo-daro — housed 40,000–80,000 people each, with grid-planned streets, advanced drainage systems, standardized weights, and multi-story brick buildings. This was a sophisticated civilization that left no deciphered written records — making its religious beliefs a matter of archaeological inference rather than textual certainty.',
  },
  {
    label: 'The Great Bath — Ritual Purification?',
    detail:
      'At Mohenjo-daro, archaeologists discovered a large, carefully waterproofed pool — the "Great Bath" — that many scholars interpret as an early site of ritual bathing. If correct, this would connect the Indus Valley to one of Hinduism\'s most enduring practices: the belief that water purifies both body and soul. From the Ganges to temple tanks across India, ritual bathing remains central to Hindu worship 4,500 years later.',
  },
  {
    label: 'Proto-Shiva Seal',
    detail:
      'One of the most debated Indus artifacts is the "Pashupati Seal" — a figure seated in a yoga-like posture, surrounded by animals, sometimes interpreted as a proto-Shiva or "Lord of Animals." If this interpretation is correct, it suggests that elements of what became Hinduism may predate the Vedic traditions by over a thousand years. Critics argue the interpretation is speculative, but the seal remains one of the most tantalizing hints of pre-Vedic religious continuity.',
  },
  {
    label: 'Possible Early Roots of Hinduism',
    detail:
      'Terra-cotta figurines of female forms (possibly mother goddesses), phallic stones (possibly early lingams associated with Shiva worship), and evidence of fire altars have all been found at Indus Valley sites. While none of these can be conclusively linked to later Hindu practices, the cumulative evidence suggests that Hinduism may draw on religious traditions far older than the Vedas — making it potentially the world\'s oldest continuously practiced religious tradition.',
  },
];

// ── Vedic Period ────────────────────────────────────────────────────────────

const VEDIC_TIMELINE: TimelineEntry[] = [
  {
    year: '1500–1200 BCE',
    title: 'Aryan Migrations into India',
    description:
      'Indo-Aryan peoples migrated into the Indian subcontinent through the northwestern mountain passes, bringing with them the Sanskrit language, horse-drawn chariots, and a religious tradition centered on fire sacrifices and hymns to nature deities. This was not a single invasion but a gradual migration over centuries. They encountered and intermixed with the existing populations, including descendants of the Indus Valley Civilization. The blending of Aryan and indigenous traditions would eventually produce classical Hinduism.',
    color: SAFFRON,
  },
  {
    year: '1500–1200 BCE',
    title: 'The Rigveda — Oldest Religious Text Still in Use',
    description:
      'The Rigveda, composed in archaic Sanskrit, contains 1,028 hymns addressed to deities like Indra (king of gods, god of thunder), Agni (fire), Varuna (cosmic order), and Surya (sun). It was transmitted orally for over a thousand years with astonishing accuracy — memorized syllable by syllable using sophisticated mnemonic techniques. The Rigveda is not just the oldest Hindu text; it is one of the oldest religious texts in any Indo-European language, and it is still recited in Hindu rituals today.',
    color: GOLD,
  },
  {
    year: '1200–900 BCE',
    title: 'The Four Vedas Complete',
    description:
      'Three more Vedas joined the Rigveda: the Samaveda (melodies for chanting), the Yajurveda (ritual formulas for sacrifices), and the Atharvaveda (spells, incantations, and everyday concerns — from healing diseases to winning love). Together, the four Vedas form the Shruti ("that which is heard") — the most authoritative category of Hindu scripture, believed to be eternal truths perceived by ancient sages (rishis) rather than authored by any human or god.',
    color: AMBER,
  },
  {
    year: '1000–500 BCE',
    title: 'Vedic Religion: Fire Sacrifices and Cosmic Order',
    description:
      'The Vedic religion was centered on yajna — elaborate fire sacrifices performed by Brahmin priests to maintain cosmic order (rita). Sacrifices ranged from simple daily offerings of milk and grain to massive royal rituals like the Ashvamedha (horse sacrifice) lasting months and requiring hundreds of priests. The sacrificial fire (Agni) was the conduit between humans and gods. This ritualistic religion would be profoundly transformed by the philosophical revolution of the Upanishads.',
    color: DEEP_SAFFRON,
  },
  {
    year: '800–200 BCE',
    title: 'The Upanishads — Philosophy Replaces Ritual',
    description:
      'The Upanishads represent the most radical intellectual shift in Hindu history. Forest-dwelling sages moved beyond ritual sacrifice to ask ultimate questions: What is the nature of reality? What happens after death? What is the self? Their answers were revolutionary: Brahman is the ultimate, formless reality underlying all existence. Atman (the individual self/soul) is ultimately identical to Brahman. "Tat tvam asi" — "Thou art that" — became the core insight: you are not separate from the divine, you ARE the divine. This insight would shape Hindu philosophy for the next 2,500 years.',
    color: INDIGO,
  },
];

// ── Core Concepts ───────────────────────────────────────────────────────────

const CORE_CONCEPTS: InsightEntry[] = [
  {
    label: 'Dharma — Cosmic Order and Duty',
    detail:
      'Dharma is the most untranslatable word in Hinduism. It means cosmic order, natural law, moral duty, righteous conduct, and the path of right living — all at once. Every being has its own dharma: a king\'s dharma is to rule justly, a teacher\'s is to transmit knowledge, a river\'s is to flow. When individuals and societies follow their dharma, the cosmos is in balance. When dharma breaks down, the world descends into chaos — which is when Vishnu incarnates to restore order.',
  },
  {
    label: 'Karma — Actions Have Consequences',
    detail:
      'Karma literally means "action" — every action, thought, and intention creates a consequence that shapes your future, in this life and in lives to come. Good actions create good karma; harmful actions create suffering. Karma is not fate or punishment — it is a natural law, as impersonal as gravity. You are the author of your own destiny across lifetimes. This concept has entered global consciousness: the English phrase "what goes around comes around" is essentially a simplified version of karma.',
  },
  {
    label: 'Samsara — The Cycle of Rebirth',
    detail:
      'Samsara is the cycle of birth, death, and rebirth that all beings undergo. The soul (atman) does not die when the body dies — it passes into a new body, as Krishna explains in the Bhagavad Gita: "As a person puts on new garments, giving up old ones, the soul similarly accepts new material bodies, giving up the old and useless ones." The form of rebirth is shaped by karma. Samsara is not seen as a gift but as a trap — an endless wheel of suffering from which liberation (moksha) is the escape.',
  },
  {
    label: 'Moksha — Liberation from the Cycle',
    detail:
      'Moksha is the ultimate goal of Hindu life: liberation from the cycle of samsara, the end of rebirth, the realization of one\'s true nature as identical to Brahman. Different schools offer different paths: jnana yoga (knowledge), bhakti yoga (devotion), karma yoga (selfless action), and raja yoga (meditation). But all agree that moksha is the highest human achievement — more important than wealth, pleasure, or even moral duty. It is the recognition that the drop of water was always the ocean.',
  },
  {
    label: 'Brahman — The Ultimate Reality',
    detail:
      'Brahman is the formless, infinite, eternal reality underlying everything that exists. It is not a god in the Western sense — it has no personality, no body, no desires. It is pure being, pure consciousness, pure bliss (sat-chit-ananda). Everything in the universe — every person, animal, star, atom — is a manifestation of Brahman. The various Hindu deities are understood as different faces or aspects of this one ultimate reality. "Brahman is real; the world is appearance; the self is nothing but Brahman" — Adi Shankaracharya.',
  },
  {
    label: 'Atman — The Individual Soul',
    detail:
      'Atman is the true self — not the body, not the mind, not the ego, but the eternal, unchanging consciousness at the core of every being. The Upanishads teach that atman is ultimately identical to Brahman: the individual soul is the universal soul. Ignorance (avidya) creates the illusion of separation; wisdom (vidya) reveals the unity. This is the core metaphysical claim of Hinduism and arguably its most profound contribution to world philosophy: the divine is not somewhere else — it is the very essence of who you are.',
  },
];

// ── The Trinity ─────────────────────────────────────────────────────────────

const TRIMURTI_INSIGHTS: InsightEntry[] = [
  {
    label: 'Brahma — The Creator',
    detail:
      'Brahma is the creator god who brings the universe into being at the beginning of each cosmic cycle. Despite this exalted role, Brahma is the least worshipped of the three — there are only a handful of Brahma temples in all of India (the most famous at Pushkar, Rajasthan). Hindu mythology explains this through various stories: Brahma was cursed by Shiva for lying, or by his consort Saraswati for proceeding with a sacrifice without her. Symbolically, creation is the least important phase — what matters is preservation and transformation.',
  },
  {
    label: 'Vishnu — The Preserver',
    detail:
      'Vishnu preserves and sustains the universe. When cosmic order (dharma) is threatened, Vishnu incarnates on Earth as an avatar to restore balance. Hindu tradition recognizes ten major avatars (Dashavatara): Matsya (fish), Kurma (tortoise), Varaha (boar), Narasimha (man-lion), Vamana (dwarf), Parashurama (warrior-sage), Rama (ideal king), Krishna (divine teacher), Buddha (the enlightened one — Hinduism absorbed Buddhism\'s founder), and Kalki (yet to come, at the end of the current age). Rama and Krishna are by far the most beloved — each the hero of a major epic.',
  },
  {
    label: 'Shiva — The Destroyer and Transformer',
    detail:
      'Shiva is the most complex deity in Hinduism. He is the destroyer — but destruction in Hinduism is not evil; it is necessary for renewal. Shiva is the cosmic dancer (Nataraja), whose dance creates and destroys the universe in endless cycles. He is the supreme yogi, meditating in the Himalayas. He is the householder, devoted to his consort Parvati. He is the fierce Bhairava, garlanded with skulls. He is worshipped as the lingam — an abstract symbol of creative power. Shiva embodies the Hindu understanding that creation and destruction, asceticism and sensuality, terror and grace are all aspects of one reality.',
  },
];

// ── The Epics ───────────────────────────────────────────────────────────────

const EPICS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Mahabharata — 200,000 Verses',
    detail:
      'The Mahabharata is the longest poem ever written — 200,000 verses, ten times the length of the Iliad and Odyssey combined. It tells the story of a catastrophic war between two branches of a royal family, the Pandavas and the Kauravas, fought on the field of Kurukshetra. But the war story is just the frame: embedded within are philosophical discourses, origin myths, love stories, ethical dilemmas, and an entire worldview. The Mahabharata\'s own declaration: "What is found here may be found elsewhere. What is not found here will not be found elsewhere."',
  },
  {
    label: 'The Bhagavad Gita — Song of God',
    detail:
      'The Bhagavad Gita is a 700-verse dialogue within the Mahabharata between Prince Arjuna and his charioteer Krishna (who is actually God incarnate). On the battlefield, Arjuna refuses to fight because his enemies are his own kinsmen. Krishna\'s response is a comprehensive teaching on duty, devotion, knowledge, and the nature of reality. "You have the right to action alone, never to its fruits" — this teaching of selfless action (karma yoga) influenced Gandhi\'s non-violent resistance, Thoreau\'s civil disobedience, and Oppenheimer\'s famous quotation upon witnessing the first atomic bomb: "Now I am become Death, the destroyer of worlds."',
  },
  {
    label: 'The Ramayana — The Ideal of Dharma',
    detail:
      'The Ramayana tells the story of Prince Rama, exiled from his kingdom for 14 years, whose wife Sita is abducted by the demon king Ravana and rescued with the help of the monkey god Hanuman and his army. Rama is the embodiment of dharma — the perfect son, husband, and king. Sita represents devotion, strength, and sacrifice. The Ramayana is not just a story; it is a living cultural force. It is performed annually across India (Ram Lila), retold in countless regional versions across Southeast Asia (in Thailand, Indonesia, Cambodia, Myanmar), and its characters remain moral archetypes for hundreds of millions of people.',
  },
  {
    label: 'Influence Beyond India',
    detail:
      'The Hindu epics spread far beyond India through trade, migration, and cultural exchange. The Ramayana was adapted into Thai (Ramakien), Javanese, Balinese, Cambodian, Burmese, and Lao versions — each culture making the story its own while preserving its core themes. The great temple complex of Angkor Wat in Cambodia was originally a Hindu temple dedicated to Vishnu, with walls covered in Mahabharata and Ramayana scenes. Hindu narrative traditions shaped the cultures of Southeast Asia for over a millennium.',
  },
];

// ── Bhakti Movement ─────────────────────────────────────────────────────────

const BHAKTI_TIMELINE: TimelineEntry[] = [
  {
    year: '600–900 CE',
    title: 'Tamil Bhakti Poets — The Alvars and Nayanars',
    description:
      'The bhakti movement began in South India with the Alvars (Vishnu devotees) and Nayanars (Shiva devotees) — poet-saints who composed passionate devotional hymns in Tamil rather than Sanskrit. Andal, a woman poet of the 8th century, wrote love poetry addressed to Vishnu that is still sung in temples today. These poets rejected the idea that God was accessible only through Vedic ritual and Brahmin priests. Anyone — man or woman, high caste or low — could reach God through pure devotion.',
    color: LOTUS_PINK,
  },
  {
    year: '1100–1400 CE',
    title: 'Bhakti Spreads North — Ramananda, Kabir, Ravidas',
    description:
      'The bhakti movement swept through northern India, producing poet-saints who challenged caste hierarchy and priestly authority. Ramananda (14th century) accepted disciples from all castes. His follower Kabir — a Muslim weaver who became one of India\'s greatest poets — rejected both Hindu and Muslim orthodoxy: "O servant, where dost thou seek Me? I am beside thee. I am neither in temple nor in mosque." Ravidas, a leather-worker from the "untouchable" caste, composed hymns declaring that God makes no distinction between high and low.',
    color: PURPLE,
  },
  {
    year: '1400–1600 CE',
    title: 'Mirabai and the Power of Devotion',
    description:
      'Mirabai (1498–1547), a Rajput princess who abandoned royal life to devote herself to Krishna, became the most beloved of all bhakti poets. Her songs of longing for the divine beloved are still sung across India. She defied her husband\'s family, refused to worship their clan goddess, and reportedly survived attempts to poison her. Mirabai represents the bhakti ideal: love for God so intense that it transcends all social obligations, caste boundaries, and even death.',
    color: ROSE,
  },
  {
    year: '1500–1700 CE',
    title: 'Tukaram, Chaitanya, and Mass Devotion',
    description:
      'Tukaram (1608–1649), a Shudra (lower-caste) grocer from Maharashtra, composed thousands of devotional poems (abhangs) that remain central to Marathi culture. Chaitanya Mahaprabhu (1486–1534) in Bengal promoted ecstatic group singing (kirtan) as the path to Krishna — dancing through the streets of Navadvip, overwhelming caste distinctions in shared spiritual joy. The Hare Krishna movement (ISKCON), founded in 1966, traces its lineage directly to Chaitanya. The bhakti movement democratized Hinduism more profoundly than any reform in its history.',
    color: GOLD,
  },
];

// ── Philosophy Schools ──────────────────────────────────────────────────────

const PHILOSOPHY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Advaita Vedanta — Adi Shankaracharya (788–820 CE)',
    detail:
      'Advaita ("non-dual") Vedanta, systematized by the brilliant young philosopher Shankaracharya, teaches that only Brahman is real. The world of multiplicity — you, me, trees, stars — is maya (illusion/appearance), like a rope mistaken for a snake in dim light. The individual soul (atman) is not "like" Brahman or "part of" Brahman — it IS Brahman, and always has been. Liberation comes through knowledge (jnana): the direct realization that there is no separation, no duality, no "other." Shankara traveled across India debating and defeating rival philosophers, established four monasteries (mathas) that survive today, and died at approximately 32 — having transformed Hindu philosophy forever.',
  },
  {
    label: 'Vishishtadvaita — Ramanuja (1017–1137 CE)',
    detail:
      'Ramanuja\'s "qualified non-dualism" challenged Shankara by arguing that the world is not illusion — it is real, and it is the body of God. Individual souls are real and distinct, but they exist within Brahman as parts exist within a whole. The relationship between soul and God is like that between a cell and the body it belongs to. Ramanuja emphasized bhakti (devotion) over jnana (knowledge) as the path to liberation, and argued that God is not impersonal but a loving being (identified with Vishnu) who graciously saves those who surrender to him. His theology became the foundation of Sri Vaishnavism.',
  },
  {
    label: 'Dvaita — Madhvacharya (1238–1317 CE)',
    detail:
      'Madhvacharya\'s dualism was the most radical departure from Advaita: God (Vishnu) and individual souls are eternally and fundamentally distinct. The soul can never become God or merge into God — the best it can achieve is eternal communion with God in a state of loving devotion. Madhva argued that Shankara\'s non-dualism was logically incoherent and scripturally unsupported. His insistence on the permanent reality of individual souls and a personal God made Dvaita the Hindu philosophy closest to the Abrahamic religions in its theological structure.',
  },
  {
    label: 'Six Orthodox Schools (Shad Darshanas)',
    detail:
      'Beyond the three Vedanta schools, Hindu philosophy encompasses six classical systems: Samkhya (dualistic cosmology: consciousness/matter), Yoga (Patanjali\'s eight-limbed path of meditation), Nyaya (logic and epistemology), Vaisheshika (atomistic metaphysics), Mimamsa (ritual interpretation of the Vedas), and Vedanta (inquiry into ultimate reality). These schools debated each other for centuries with extraordinary rigor — Hindu philosophy was not mystical hand-waving but systematic, logical argumentation as sophisticated as anything in ancient Greece.',
  },
];

// ── Caste System ────────────────────────────────────────────────────────────

const CASTE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Original Varna System',
    detail:
      'The Rigveda\'s "Purusha Sukta" hymn describes four varnas emerging from the cosmic being\'s body: Brahmins (priests/scholars) from the mouth, Kshatriyas (warriors/rulers) from the arms, Vaishyas (merchants/farmers) from the thighs, and Shudras (servants/laborers) from the feet. Originally, varna may have been more about social function than birth — the Bhagavad Gita says varna is determined by qualities and actions (guna and karma), not birth. But over centuries, the system became rigidly hereditary.',
  },
  {
    label: 'From Varna to Jati — Rigid Hereditary Caste',
    detail:
      'The four broad varnas fragmented into thousands of jatis (birth-castes) — endogamous groups defined by occupation, region, and family. Caste determined whom you could marry, eat with, worship alongside, and what work you could do. Elaborate rules of purity and pollution governed interactions between castes. By the medieval period, the system was deeply entrenched: you were born into your caste, you lived within it, you died in it. Social mobility was virtually impossible. Religious texts like the Laws of Manu codified caste hierarchy and the severe punishments for transgressing caste boundaries.',
  },
  {
    label: '"Untouchables" — The Dalits',
    detail:
      'Below the four varnas were the "outcastes" — people considered so polluting that their mere shadow could contaminate a higher-caste person. They were assigned the most degrading work: handling dead bodies, cleaning latrines, working leather. They were denied access to temples, wells, and schools. They could not walk on the same roads as upper castes. The term "untouchable" was itself a weapon of dehumanization. Despite being outside the varna system, they were essential to its functioning — doing the work that kept society running while being treated as less than human.',
  },
  {
    label: 'B.R. Ambedkar — Dalit Liberation',
    detail:
      'Bhimrao Ramji Ambedkar (1891–1956) was born into the Mahar caste (considered "untouchable"), suffered extreme discrimination as a child, and through extraordinary determination became one of the most educated Indians of his generation — earning doctorates from Columbia University and the London School of Economics. As chairman of the committee that drafted India\'s Constitution (1950), he outlawed caste discrimination and established affirmative action for Dalits and other oppressed groups. In 1956, months before his death, Ambedkar converted to Buddhism along with 600,000 followers, declaring that Hinduism\'s caste system was irredeemable. He remains the most important figure in Dalit history.',
  },
  {
    label: 'Caste in Modern India',
    detail:
      'India\'s constitution (Article 17) abolished "untouchability" and made caste discrimination a criminal offense. Affirmative action (reservations) reserves seats in education and government for Scheduled Castes and Tribes. Yet caste persists: inter-caste marriages still face violence, Dalits are disproportionately poor, caste-based atrocities occur regularly, and caste identity shapes voting patterns and political parties. The tension between constitutional equality and social reality remains one of India\'s most defining struggles — and one of the most honest tests of Hinduism\'s own ideals of universal divinity.',
  },
];

// ── Islam and Hindu Encounter ───────────────────────────────────────────────

const ISLAM_ENCOUNTER_TIMELINE: TimelineEntry[] = [
  {
    year: '1206–1526',
    title: 'The Delhi Sultanate',
    description:
      'Muslim armies entered India as early as the 8th century, but the establishment of the Delhi Sultanate in 1206 marked the beginning of sustained Muslim rule over large parts of the subcontinent. Relations were complex: some rulers destroyed Hindu temples and imposed the jizya (tax on non-Muslims); others were patrons of Hindu culture. The encounter forced both traditions to define themselves against each other — and, in many cases, to borrow from each other.',
    color: TEAL,
  },
  {
    year: '1526–1707',
    title: 'The Mughal Empire — Conflict and Synthesis',
    description:
      'The Mughal Empire brought the most complex chapter of Hindu-Muslim relations. Akbar (r. 1556–1605) abolished the jizya, married Hindu princesses, employed Hindu generals, and created a syncretic "Divine Faith" (Din-i-Ilahi) drawing on both traditions. His great-grandson Aurangzeb (r. 1658–1707) reversed course: reimposing the jizya, destroying temples, and alienating Hindu subjects. Between these extremes, a rich Indo-Islamic culture emerged — in architecture (Taj Mahal), music (Hindustani classical), painting, and cuisine — that was neither purely Hindu nor purely Muslim.',
    color: AMBER,
  },
  {
    year: '1469–1539',
    title: 'Sikhism — A Bridge Tradition',
    description:
      'Guru Nanak (1469–1539) founded Sikhism in the Punjab, drawing on both Hindu and Islamic traditions while transcending both. "There is no Hindu, there is no Muslim," he declared after a mystical experience. Sikhism rejected caste, idolatry, and the authority of both Brahmin priests and Muslim clerics, teaching devotion to one formless God. The Sikh tradition — which grew into its own distinct religion with its own scripture (Guru Granth Sahib), practices, and identity — remains a living testament to the creative encounter between Hinduism and Islam.',
    color: SKY_BLUE,
  },
  {
    year: '1500–1700',
    title: 'Bhakti-Sufi Synthesis',
    description:
      'While empires fought, ordinary people found common ground. Hindu bhakti poets and Muslim Sufi mystics discovered striking parallels in their approaches to God: both emphasized personal devotion over ritual, the inner experience over external observance, and love as the path to the divine. Kabir, Guru Nanak, Dadu Dayal, and other poet-saints moved freely between Hindu and Muslim audiences. Shared shrines, festivals, and musical traditions emerged. This grassroots syncretism, often overlooked in political histories, represents one of the most remarkable interfaith encounters in human history.',
    color: PURPLE,
  },
];

// ── Colonial Period and Reform ──────────────────────────────────────────────

const REFORM_TIMELINE: TimelineEntry[] = [
  {
    year: '1757–1857',
    title: 'British Conquest — Hindu Self-Examination',
    description:
      'British colonization forced Hinduism into a crisis of self-examination. Colonial administrators and Christian missionaries criticized caste, idol worship, sati (widow self-immolation), child marriage, and what they called Hindu "superstition." Some Hindus internalized these critiques; others rejected them fiercely. The encounter produced a remarkable generation of reformers who reimagined Hinduism for the modern age — keeping what they saw as its philosophical core while challenging practices they considered corruptions.',
    color: EARTH_BROWN,
  },
  {
    year: '1772–1833',
    title: 'Ram Mohan Roy — The Father of Modern India',
    description:
      'Ram Mohan Roy founded the Brahmo Samaj (1828), a reform movement that rejected idol worship, polytheism, and caste hierarchy in favor of a rational, monotheistic Hinduism rooted in the Upanishads. His most famous campaign was against sati — the practice of widows immolating themselves on their husband\'s funeral pyres. Roy marshaled both Hindu scripture and Enlightenment arguments to convince the British governor-general to ban sati in 1829. He was the first Hindu reformer to engage both Western and Indian intellectual traditions on equal terms.',
    color: BLUE,
  },
  {
    year: '1863–1902',
    title: 'Swami Vivekananda — Hinduism Goes Global',
    description:
      'Vivekananda electrified the 1893 Parliament of World\'s Religions in Chicago with his opening words: "Sisters and brothers of America." He presented Vedanta philosophy as a universal, rational spirituality compatible with modern science. His message: all religions are different paths to the same truth, and Hinduism — far from being a primitive idol worship — contains the most profound philosophy of any tradition. Vivekananda single-handedly transformed Western perceptions of Hinduism and inspired a generation of Indians to take pride in their spiritual heritage.',
    color: SAFFRON,
  },
  {
    year: '1869–1948',
    title: 'Mahatma Gandhi — Hinduism as Non-Violence',
    description:
      'Gandhi transformed Hinduism\'s political and moral meaning. Drawing on the Bhagavad Gita, the Sermon on the Mount, and Tolstoy, he made ahimsa (non-violence) and satyagraha (truth-force) the basis of India\'s independence movement. He insisted that Hinduism\'s core was ethical service to all — including "untouchables," whom he renamed Harijans ("children of God"). His assassination by a Hindu nationalist in 1948 exposed the tension between his inclusive Hinduism and the exclusivist Hindu nationalism that would grow in subsequent decades.',
    color: GREEN,
  },
];

// ── Hinduism Today ──────────────────────────────────────────────────────────

const TODAY_INSIGHTS: InsightEntry[] = [
  {
    label: '1.2 Billion Strong — 15% of Humanity',
    detail:
      'Hinduism is the world\'s third-largest religion with approximately 1.2 billion adherents — about 15% of the global population. The vast majority (94%) live in India, where Hindus constitute about 80% of the population. Nepal is the world\'s only other Hindu-majority country. Significant Hindu diaspora communities exist in the United States, United Kingdom, Canada, Australia, South Africa, Trinidad, Guyana, Fiji, Mauritius, and across Southeast Asia — a legacy of both ancient cultural spread and modern migration.',
  },
  {
    label: 'Hindu Nationalism in Modern India',
    detail:
      'The Bharatiya Janata Party (BJP) and its ideological parent, the Rashtriya Swayamsevak Sangh (RSS), promote Hindutva — the idea that Indian identity is fundamentally Hindu. Under Prime Minister Narendra Modi (in office since 2014), Hindu nationalism has become India\'s dominant political force. Critics argue that Hindutva threatens India\'s secular constitution and marginalizes Muslims and other minorities. Supporters counter that it restores Hindu civilizational pride after centuries of foreign rule. The debate over whether India is a secular republic or a Hindu nation is the defining political question of contemporary India.',
  },
  {
    label: 'Hinduism\'s Global Cultural Influence',
    detail:
      'Hindu concepts have permeated global culture far beyond the explicitly religious. Yoga — rooted in Hindu practice — is practiced by 300 million people worldwide. Meditation techniques derived from Hindu and Buddhist traditions are mainstream in corporate wellness and healthcare. The concept of karma has entered everyday English. Vegetarianism, widely practiced by Hindus, has influenced global dietary movements. Vedanta philosophy shaped thinkers from Schopenhauer to Emerson to Einstein, who kept a copy of the Bhagavad Gita on his desk.',
  },
  {
    label: 'Challenges and Continuity',
    detail:
      'Modern Hinduism faces internal tensions: between its pluralistic philosophical traditions and exclusivist nationalist movements, between ancient caste hierarchies and constitutional equality, between temple-based devotion and diaspora adaptations, between Sanskrit traditionalism and vernacular accessibility. Yet its capacity for internal diversity has always been its greatest strength. A tradition that can accommodate Shankara\'s radical non-dualism and Madhva\'s theistic devotion, village goddess worship and Upanishadic philosophy, fire sacrifices and meditation — all under one umbrella — has proven remarkably resilient across four millennia.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Adi Shankaracharya',
    years: '788–820 CE',
    contribution:
      'Systematized Advaita Vedanta (non-dualism), traveled across India establishing four monasteries, debated and defeated rival philosophers. Died at ~32. Arguably the most influential Hindu philosopher in history.',
  },
  {
    name: 'Ramanuja',
    years: '1017–1137 CE',
    contribution:
      'Developed Vishishtadvaita (qualified non-dualism), emphasized devotion (bhakti) over knowledge alone, opened the path to liberation for all castes through divine grace.',
  },
  {
    name: 'Mirabai',
    years: '1498–1547 CE',
    contribution:
      'Rajput princess turned poet-saint. Her devotional songs to Krishna defied caste, gender, and royal convention. Her poetry is still sung across India 500 years later.',
  },
  {
    name: 'Kabir',
    years: '1398–1448 CE',
    contribution:
      'Muslim-born weaver-poet who rejected both Hindu and Islamic orthodoxy. His verses — sharp, paradoxical, anti-institutional — influenced Sikhism, bhakti movements, and Indian culture at large.',
  },
  {
    name: 'Swami Vivekananda',
    years: '1863–1902',
    contribution:
      'Introduced Vedanta to the West at the 1893 Parliament of World\'s Religions. Founded the Ramakrishna Mission. Inspired Indian national pride and global interest in Hindu philosophy.',
  },
  {
    name: 'B.R. Ambedkar',
    years: '1891–1956',
    contribution:
      'Dalit leader, architect of India\'s Constitution, champion of equality. Abolished untouchability in law, established affirmative action. Converted to Buddhism in 1956 as a rejection of caste.',
  },
  {
    name: 'Mahatma Gandhi',
    years: '1869–1948',
    contribution:
      'Made ahimsa (non-violence) the basis of India\'s independence movement. Reinterpreted Hinduism as ethical service to all. His assassination by a Hindu nationalist exposed Hinduism\'s internal tensions.',
  },
  {
    name: 'Guru Nanak',
    years: '1469–1539',
    contribution:
      'Founded Sikhism, drawing on both Hindu and Islamic traditions. Rejected caste and idolatry. "There is no Hindu, there is no Muslim" — a radical statement of spiritual universalism.',
  },
];

// ── Main Timeline ───────────────────────────────────────────────────────────

const MAIN_TIMELINE: TimelineEntry[] = [
  {
    year: '3300–1300 BCE',
    title: 'Indus Valley Civilization',
    description: 'Harappa and Mohenjo-daro flourish with possible proto-Hindu elements: ritual bathing, Pashupati seal, mother goddess figurines.',
    color: EARTH_BROWN,
  },
  {
    year: '1500–1200 BCE',
    title: 'Vedic Period Begins',
    description: 'Indo-Aryan migrations bring Sanskrit, Vedic religion, and the composition of the Rigveda — the oldest religious text still in continuous use.',
    color: SAFFRON,
  },
  {
    year: '800–200 BCE',
    title: 'The Upanishads',
    description: 'Philosophical revolution: Brahman as ultimate reality, Atman as true self, "Tat tvam asi" — the foundation of Hindu metaphysics.',
    color: INDIGO,
  },
  {
    year: '400 BCE–400 CE',
    title: 'The Epics Composed',
    description: 'Mahabharata (including Bhagavad Gita) and Ramayana take shape — defining Hindu narrative, ethics, and devotional practice for millennia.',
    color: GOLD,
  },
  {
    year: '788–820 CE',
    title: 'Adi Shankaracharya',
    description: 'Systematizes Advaita Vedanta, travels across India, establishes four monasteries. Hindu philosophy reaches its most refined expression.',
    color: PURPLE,
  },
  {
    year: '600–1700 CE',
    title: 'Bhakti Movement',
    description: 'Devotional revolution: poet-saints like Mirabai, Kabir, and Tukaram make divine love accessible to all castes through vernacular song.',
    color: LOTUS_PINK,
  },
  {
    year: '1206–1707',
    title: 'Islamic Encounter',
    description: 'Delhi Sultanate and Mughal Empire: temple destructions and cultural synthesis coexist. Sikhism emerges as a bridge tradition.',
    color: TEAL,
  },
  {
    year: '1757–1947',
    title: 'Colonial Period & Reform',
    description: 'British rule prompts Hindu self-examination. Ram Mohan Roy, Vivekananda, and Gandhi reimagine Hinduism for the modern world.',
    color: BLUE,
  },
  {
    year: '1947–Present',
    title: 'Independent India & Global Hinduism',
    description: '1.2 billion adherents today. Yoga goes global. Hindu nationalism reshapes Indian politics. Caste discrimination persists alongside constitutional equality.',
    color: GREEN,
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

const FIGURE_COLORS = [SAFFRON, INDIGO, LOTUS_PINK, TEAL, GOLD, BLUE, GREEN, PURPLE, CRIMSON, AMBER];

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
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HinduismHistoryPage() {
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
              background: `linear-gradient(135deg, ${SAFFRON}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hinduism — The World's Oldest Living Religion (3500 BCE–Present)
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
              1.2 billion people. 4,000+ years. No single founder. No single
              scripture. No central authority. Hinduism is not one religion but a
              vast family of traditions — philosophical, devotional, ritualistic,
              mystical — that have evolved, absorbed, debated, and reinvented
              themselves across four millennia. It is the world's oldest living
              religion, and it is still very much alive.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              From the fire sacrifices of Vedic priests to the love poetry of
              medieval bhakti saints, from the non-dualism of Shankaracharya to
              Gandhi's non-violent revolution, from the 200,000-verse
              Mahabharata to a yoga class in Brooklyn — Hinduism's story is the
              story of a civilization's continuous search for ultimate truth, in
              all its contradictions, brilliance, and humanity.
            </p>
          </motion.div>

          {/* Key stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}
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
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: SAFFRON }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.78rem', color: SLATE, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </header>

        {/* ── "Not One Religion" Callout ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 8,
            backgroundColor: `${SAFFRON}0a`,
            border: `1px solid ${SAFFRON}22`,
            borderRadius: 12,
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: SAFFRON, marginBottom: 10 }}>
            Not One Religion — A Family of Traditions
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.92rem' }}>
            The word "Hinduism" is itself a modern convenience — coined by
            outsiders to describe the diverse religious practices of people
            living beyond the Indus River. There is no single creed, no single
            prophet, no pope. A Hindu can be a monotheist, a polytheist, a
            pantheist, or even an atheist (the Samkhya school). What holds it
            together is not doctrine but shared cultural inheritance: the
            Vedas, the epics, the concepts of dharma and karma, the practice
            of puja (worship), and a civilizational continuity stretching back
            to the Bronze Age.
          </p>
        </motion.div>

        {/* ── Indus Valley ────────────────────────────────────────────── */}
        <SectionWrapper
          id="indus-valley"
          icon="🏛️"
          title="Indus Valley Civilization — Possible Origins (3300–1300 BCE)"
          accentColor={EARTH_BROWN}
          intro="Long before the Vedas were composed, one of the world's first great civilizations flourished along the Indus River in what is now Pakistan and northwestern India. Whether the Indus Valley Civilization's religious practices were ancestors of Hinduism remains debated — but the circumstantial evidence is tantalizing."
        >
          <InsightGrid items={INDUS_VALLEY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Vedic Period ────────────────────────────────────────────── */}
        <SectionWrapper
          id="vedic-period"
          icon="🔥"
          title="The Vedic Period — Fire, Gods, and Philosophy (1500–200 BCE)"
          accentColor={SAFFRON}
          intro="The Vedic period is where Hinduism's textual tradition begins. Over more than a thousand years, nomadic Indo-Aryan tribes settled across northern India, composed the most ancient religious texts still in continuous use, built a priestly religion around fire sacrifices — and then, in one of history's great intellectual revolutions, questioned everything they had built."
        >
          <TimelineCard entries={VEDIC_TIMELINE} />
        </SectionWrapper>

        {/* ── Core Concepts ──────────────────────────────────────────── */}
        <SectionWrapper
          id="core-concepts"
          icon="🕉️"
          title="Core Concepts — The Architecture of Hindu Thought"
          accentColor={INDIGO}
          intro="Six interconnected ideas form the conceptual backbone of Hinduism. Together, they answer the fundamental questions: Why are we here? What happens when we die? What is the nature of reality? And what is the ultimate purpose of human life? These concepts have shaped the worldview of a billion people — and influenced global philosophy, psychology, and spirituality."
        >
          <InsightGrid items={CORE_CONCEPTS} />
        </SectionWrapper>

        {/* ── The Trinity ────────────────────────────────────────────── */}
        <SectionWrapper
          id="trimurti"
          icon="🔱"
          title="The Trimurti — Creator, Preserver, Destroyer"
          accentColor={GOLD}
          intro="The Trimurti represents the three fundamental cosmic functions: creation (Brahma), preservation (Vishnu), and destruction/transformation (Shiva). They are not three separate gods in competition but three aspects of one reality — the Hindu way of saying that the universe is an endless cycle of beginning, sustaining, and ending, and that all three are equally sacred."
        >
          <InsightGrid items={TRIMURTI_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Epics ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="epics"
          icon="📜"
          title="The Epics — Stories That Built a Civilization (400 BCE–400 CE)"
          accentColor={AMBER}
          intro="If the Vedas are Hinduism's philosophical foundation, the epics are its beating heart. The Mahabharata and Ramayana are not just literature — they are the moral imagination of a civilization, retold in every generation, performed in every village, adapted across all of South and Southeast Asia. More people have been shaped by these stories than by any other narratives in human history."
        >
          <InsightGrid items={EPICS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Bhagavad Gita Callout ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            marginBottom: 8,
            backgroundColor: `${GOLD}0a`,
            border: `1px solid ${GOLD}22`,
            borderRadius: 12,
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: GOLD, marginBottom: 10 }}>
            The Bhagavad Gita's Global Influence
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.92rem', marginBottom: 10 }}>
            The Gita has influenced thinkers far beyond Hinduism. <strong style={{ color: '#f1f5f9' }}>Gandhi</strong> called
            it his "spiritual dictionary" and drew his philosophy of non-violent
            resistance from its teaching on selfless action. <strong style={{ color: '#f1f5f9' }}>Einstein</strong> said:
            "When I read the Bhagavad Gita and reflect about how God created
            this universe, everything else seems so superfluous."
          </p>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.92rem' }}>
            <strong style={{ color: '#f1f5f9' }}>Robert Oppenheimer</strong>, witnessing the first nuclear
            explosion in 1945, quoted Krishna: "Now I am become Death, the
            destroyer of worlds." <strong style={{ color: '#f1f5f9' }}>Thoreau</strong>, <strong style={{ color: '#f1f5f9' }}>Emerson</strong>,
            and <strong style={{ color: '#f1f5f9' }}>T.S. Eliot</strong> all drew on its philosophy.
            A 2,000-year-old battlefield dialogue between a warrior and his
            charioteer became one of the most influential texts in world
            literature.
          </p>
        </motion.div>

        {/* ── Bhakti Movement ────────────────────────────────────────── */}
        <SectionWrapper
          id="bhakti"
          icon="🎵"
          title="The Bhakti Movement — Devotion for Everyone (600–1700 CE)"
          accentColor={LOTUS_PINK}
          intro="The bhakti movement was Hinduism's great democratization. For over a thousand years, poet-saints from every caste, gender, and region challenged the idea that God was accessible only through Brahmin priests and Sanskrit scriptures. They sang to God in their own languages — Tamil, Hindi, Marathi, Bengali, Kannada — and insisted that pure love was the only qualification for divine connection."
        >
          <TimelineCard entries={BHAKTI_TIMELINE} />
        </SectionWrapper>

        {/* ── Philosophy Schools ──────────────────────────────────────── */}
        <SectionWrapper
          id="philosophy"
          icon="🧠"
          title="Hindu Philosophy — Rigorous Intellectual Traditions"
          accentColor={PURPLE}
          intro="Hindu philosophy is not vague mysticism — it is some of the most rigorous and systematic thinking in the ancient world. For over two thousand years, competing schools debated the nature of reality, consciousness, God, and liberation with logical precision that rivaled anything in ancient Greece. The three Vedanta schools represent the core disagreement: Is reality ultimately one, or are God and soul eternally distinct?"
        >
          <InsightGrid items={PHILOSOPHY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Caste System ───────────────────────────────────────────── */}
        <SectionWrapper
          id="caste"
          icon="⚖️"
          title="The Caste System — Hinduism's Most Painful Legacy"
          accentColor={CRIMSON}
          intro="No honest history of Hinduism can avoid the caste system. What may have begun as a flexible social taxonomy became one of history's most rigid and dehumanizing hierarchies — a system that told hundreds of millions of people that their suffering was deserved and their subordination divinely ordained. The struggle against caste is one of the great civil rights stories of the modern world."
        >
          <InsightGrid items={CASTE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Islam and Hindu Encounter ───────────────────────────────── */}
        <SectionWrapper
          id="islam-encounter"
          icon="🕌"
          title="Islam and Hindu Encounter (1200–1700 CE)"
          accentColor={TEAL}
          intro="The arrival of Islam in India produced one of history's most complex cultural encounters — simultaneously destructive and creative. Temples were destroyed; new art forms were born. Forced conversions occurred; mystical traditions merged. Political conquest coexisted with philosophical exchange. The result was not a simple story of conflict but a layered, contradictory, and profoundly creative encounter that reshaped both traditions."
        >
          <TimelineCard entries={ISLAM_ENCOUNTER_TIMELINE} />
        </SectionWrapper>

        {/* ── Colonial Period & Reform ────────────────────────────────── */}
        <SectionWrapper
          id="colonial-reform"
          icon="🌅"
          title="Colonial Period & Hindu Reform (1757–1947)"
          accentColor={BLUE}
          intro="British colonization was devastating for India — but it also forced Hinduism to confront its own practices and reimagine itself for the modern world. A remarkable generation of reformers emerged who neither rejected Hindu tradition wholesale nor accepted colonial critiques uncritically. They created modern Hinduism: philosophically confident, socially reformist, and ready to engage the world."
        >
          <TimelineCard entries={REFORM_TIMELINE} />
        </SectionWrapper>

        {/* ── Hinduism Today ─────────────────────────────────────────── */}
        <SectionWrapper
          id="today"
          icon="🌏"
          title="Hinduism Today — 1.2 Billion and Growing"
          accentColor={GREEN}
          intro="Hinduism in the 21st century is a tradition in tension — between its ancient philosophical pluralism and modern nationalist politics, between caste hierarchy and constitutional equality, between temple tradition and global diaspora adaptation. Yet its capacity for holding contradictions together has always been its defining feature."
        >
          <InsightGrid items={TODAY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures in Hindu History"
          accentColor={GOLD}
          intro="From ancient philosophers to medieval poet-saints to modern reformers, these are the people who shaped Hinduism across its 4,000-year journey — through their writings, their movements, their sacrifices, and their radical reimaginings of what it means to seek the divine."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Grand Timeline ─────────────────────────────────────────── */}
        <SectionWrapper
          id="timeline"
          icon="📅"
          title="4,000 Years at a Glance"
          accentColor={SAFFRON}
          intro="The sweep of Hindu history — from Bronze Age ritual tanks to 21st-century yoga studios — in a single timeline."
        >
          <TimelineCard entries={MAIN_TIMELINE} />
        </SectionWrapper>

        {/* ── Hinduism's Global Influence Callout ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: 8,
            marginBottom: 32,
            backgroundColor: `${SAFFRON}0a`,
            border: `1px solid ${SAFFRON}22`,
            borderRadius: 12,
            padding: '24px 28px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: SAFFRON, marginBottom: 10 }}>
            Hinduism's Global Influence
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.92rem' }}>
            Hindu ideas permeate modern global culture in ways most people
            don't realize. <strong style={{ color: '#f1f5f9' }}>Yoga</strong> — practiced by 300 million people worldwide —
            originates in Hindu spiritual discipline. <strong style={{ color: '#f1f5f9' }}>Meditation</strong> techniques
            from Hindu and Buddhist traditions are now mainstream in healthcare
            and corporate wellness. The word <strong style={{ color: '#f1f5f9' }}>karma</strong> has entered everyday English.
            Vedanta philosophy shaped Western thinkers from Schopenhauer to
            Emerson to Huxley. The <strong style={{ color: '#f1f5f9' }}>decimal number system</strong> and the
            concept of <strong style={{ color: '#f1f5f9' }}>zero</strong> — developed in Hindu-Buddhist India — are the
            foundation of modern mathematics and computing. A tradition often
            stereotyped as exotic mysticism has quietly shaped the intellectual
            and practical infrastructure of the modern world.
          </p>
        </motion.div>

        {/* ── Continue Exploring ──────────────────────────────────────── */}
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
              { to: '/ancient-india', label: 'Ancient India' },
              { to: '/buddhism-history', label: 'History of Buddhism' },
              { to: '/silk-road', label: 'The Silk Road' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  backgroundColor: SAFFRON + '18',
                  border: `1px solid ${SAFFRON}44`,
                  borderRadius: 8,
                  color: SAFFRON,
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
            "Tat tvam asi" — "Thou art that."
            — Chandogya Upanishad, ~800 BCE
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
