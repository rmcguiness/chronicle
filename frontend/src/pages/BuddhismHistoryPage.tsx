/**
 * BuddhismHistoryPage — deep-dive page covering the history of Buddhism
 * from Siddhartha Gautama to a global religion of 500 million.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── colour palette ─────────────────────────────────────────────── */
const SAFFRON = '#f59e0b';
const GOLD = '#eab308';
const MAROON = '#9f1239';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const JADE = '#059669';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const LOTUS = '#d946ef';
const COPPER = '#c2410c';
const SKY = '#0ea5e9';
const CRIMSON = '#ef4444';

const FIGURE_COLORS = [SAFFRON, TEAL, MAROON, INDIGO, JADE, LOTUS, COPPER, SKY];

/* ── data types ──────────────────────────────────────────────────── */
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

/* ── data ────────────────────────────────────────────────────────── */

const KEY_STATS: InsightEntry[] = [
  { label: '500 million', detail: 'Buddhists worldwide — 7% of the global population' },
  { label: '4th largest', detail: 'Religion in the world by number of adherents' },
  { label: '2,500+ years', detail: 'Continuous tradition since the 5th century BCE' },
  { label: '3 branches', detail: 'Theravada (38%), Mahayana (56%), Vajrayana (6%)' },
  { label: 'Tipitaka', detail: 'Oldest surviving complete religious canon — written ~29 BCE' },
  { label: 'No creator god', detail: 'The Buddha never claimed to be divine — originally a philosophy/psychology' },
];

const ANCIENT_INDIA_CONTEXT: InsightEntry[] = [
  { label: 'Vedic religion', detail: 'Brahmanical rituals dominated Indian spiritual life — complex, expensive ceremonies controlled by the priestly caste (Brahmins).' },
  { label: 'Caste system', detail: 'Rigid social hierarchy: Brahmins (priests), Kshatriyas (warriors), Vaishyas (merchants), Shudras (servants). Birth determined destiny.' },
  { label: 'Upanishads', detail: 'Philosophical texts (800–500 BCE) questioning Vedic ritualism, exploring Atman (self), Brahman (ultimate reality), and moksha (liberation).' },
  { label: 'Spiritual ferment', detail: 'The "Second Urbanisation" brought new cities, trade routes, and wandering ascetics (shramanas) rejecting orthodox Vedic authority.' },
  { label: 'Competing schools', detail: 'Jainism, Ajivika, Charvaka (materialists), and dozens of other movements — the 6th century BCE was India\'s "Axial Age."' },
  { label: 'Rebirth and karma', detail: 'Already widespread ideas — the cycle of samsara (rebirth) and the notion that actions determine future births predated the Buddha.' },
];

const SIDDHARTHA_TIMELINE: TimelineEntry[] = [
  { year: '~563 BCE', title: 'Birth in Lumbini', description: 'Born as Prince Siddhartha Gautama in the Shakya clan in Lumbini (modern Nepal). His father, King Suddhodana, ruled the small republic of Kapilavastu.', color: SAFFRON },
  { year: '~547 BCE', title: 'The Sheltered Prince', description: 'Raised in luxury behind palace walls. His father, warned by seers that Siddhartha would become a great ascetic, shielded him from all suffering and old age.', color: GOLD },
  { year: '~534 BCE', title: 'The Four Sights', description: 'Venturing beyond the palace, Siddhartha encounters an old man, a sick man, a corpse, and a wandering monk — confronting old age, sickness, death, and the possibility of transcendence.', color: MAROON },
  { year: '~534 BCE', title: 'The Great Renunciation', description: 'At age 29, Siddhartha leaves his wife Yasodhara, infant son Rahula, and kingdom to seek the truth about suffering. He cuts his hair and dons the robes of a wandering ascetic.', color: TEAL },
  { year: '~534–528 BCE', title: 'Six Years of Seeking', description: 'Studies under renowned teachers Alara Kalama and Uddaka Ramaputta. Practises extreme asceticism — fasting until near death — before rejecting austerity as another dead end.', color: INDIGO },
];

const ENLIGHTENMENT_INSIGHTS: InsightEntry[] = [
  { label: 'The Middle Way', detail: 'Neither luxury nor extreme austerity leads to liberation. The Buddha discovered a balanced path between self-indulgence and self-mortification.' },
  { label: 'The Bodhi Tree', detail: 'Sitting beneath a pipal tree in Bodh Gaya (modern Bihar, India), Siddhartha vowed not to rise until he attained enlightenment.' },
  { label: 'Mara\'s temptation', detail: 'The demon Mara assaulted him with armies, desire, and doubt. Siddhartha touched the earth (the "earth-witness" gesture), calling it to testify to his merit.' },
  { label: 'Three watches of the night', detail: 'First watch: recalled all past lives. Second watch: understood karma and rebirth. Third watch: realised the Four Noble Truths and the chain of dependent origination.' },
  { label: 'The Awakened One', detail: 'At age 35, Siddhartha became the Buddha ("one who has awakened"). He spent 49 days near the Bodhi Tree contemplating his insight before deciding to teach.' },
  { label: 'First sermon at Sarnath', detail: 'The Deer Park sermon ("Turning the Wheel of Dharma") to five former ascetic companions — the first public teaching of the Four Noble Truths and the Middle Way.' },
];

const FOUR_NOBLE_TRUTHS: InsightEntry[] = [
  { label: '1. Dukkha — Suffering exists', detail: 'Life inevitably involves suffering, dissatisfaction, and impermanence. Birth, aging, sickness, death, separation from loved ones, not getting what we want — all are dukkha.' },
  { label: '2. Samudaya — Suffering has a cause', detail: 'The origin of suffering is tanha (craving/thirst) — craving for sensual pleasure, craving for existence, and craving for non-existence. Attachment fuels the cycle.' },
  { label: '3. Nirodha — Suffering can end', detail: 'The complete cessation of craving leads to the end of suffering. This is nirvana — not a place, but the extinguishing of the fires of greed, hatred, and delusion.' },
  { label: '4. Magga — The path to the end of suffering', detail: 'The Noble Eightfold Path provides a practical, systematic way to end suffering — a middle way between indulgence and asceticism.' },
];

const EIGHTFOLD_PATH: InsightEntry[] = [
  { label: 'Right View (samma ditthi)', detail: 'Understanding the Four Noble Truths and the nature of reality — seeing things as they truly are, not as we wish them to be.' },
  { label: 'Right Intention (samma sankappa)', detail: 'Commitment to renunciation, goodwill, and harmlessness. Aligning one\'s will toward liberation rather than craving.' },
  { label: 'Right Speech (samma vaca)', detail: 'Abstaining from lying, divisive speech, harsh language, and idle chatter. Words that heal rather than harm.' },
  { label: 'Right Action (samma kammanta)', detail: 'Ethical conduct: not killing, not stealing, not engaging in sexual misconduct. Actions rooted in compassion.' },
  { label: 'Right Livelihood (samma ajiva)', detail: 'Earning a living without harming others — avoiding trades in weapons, living beings, meat, intoxicants, and poisons.' },
  { label: 'Right Effort (samma vayama)', detail: 'Cultivating wholesome mental states, preventing unwholesome ones from arising, and sustaining mindful awareness.' },
  { label: 'Right Mindfulness (samma sati)', detail: 'Moment-to-moment awareness of body, feelings, mind, and mental phenomena. The foundation of meditation practice.' },
  { label: 'Right Concentration (samma samadhi)', detail: 'Deep meditative absorption (jhana) — training the mind to become unified, focused, and profoundly still.' },
];

const THREE_MARKS: InsightEntry[] = [
  { label: 'Anicca — Impermanence', detail: 'All conditioned phenomena are in constant flux. Nothing — no feeling, no thought, no self, no civilisation — is permanent. Clinging to what changes is the root of suffering.' },
  { label: 'Dukkha — Suffering', detail: 'Because all things are impermanent and we crave permanence, life is pervaded by unsatisfactoriness. Even pleasure is dukkha because it inevitably fades.' },
  { label: 'Anatta — Non-self', detail: 'There is no fixed, unchanging "soul" or self. What we call "I" is a constantly changing process of five aggregates (skandhas): form, sensation, perception, mental formations, consciousness.' },
];

const KARMA_NIRVANA: InsightEntry[] = [
  { label: 'Karma (kamma)', detail: 'Intentional actions — of body, speech, and mind — create consequences that shape future experience. Not punishment, but natural law: wholesome actions lead to wellbeing, unwholesome to suffering.' },
  { label: 'Rebirth (punarbhava)', detail: 'Consciousness continues after death, taking new form based on accumulated karma. Unlike Hindu atman, Buddhism teaches rebirth without a permanent soul — like a flame passing from candle to candle.' },
  { label: 'Samsara', detail: 'The cycle of birth, death, and rebirth across six realms (gods, demi-gods, humans, animals, hungry ghosts, hell). All realms are impermanent — even gods eventually die and are reborn.' },
  { label: 'Nirvana', detail: 'Literally "blowing out" — the extinguishing of greed, hatred, and delusion. Release from the cycle of rebirth. Not annihilation, but liberation beyond conceptual description.' },
];

const SANGHA_INSIGHTS: InsightEntry[] = [
  { label: 'The Triple Gem', detail: 'Every Buddhist takes refuge in the Buddha (teacher), the Dharma (teaching), and the Sangha (community). These three are the foundation of Buddhist practice.' },
  { label: 'First five disciples', detail: 'The Panchavaggiya — the five ascetics who heard the first sermon at Sarnath. They became the first arahants (fully enlightened beings) after the Buddha.' },
  { label: 'Ananda', detail: 'The Buddha\'s cousin and personal attendant for 25 years. His extraordinary memory preserved the oral teachings — he recited all the suttas at the First Council after the Buddha\'s death.' },
  { label: 'Mahapajapati Gotami', detail: 'The Buddha\'s aunt and stepmother — became the first Buddhist nun. The order of nuns (bhikkhuni sangha) was a revolutionary step in a deeply patriarchal society.' },
  { label: 'Sariputta & Moggallana', detail: 'The two chief disciples — Sariputta for wisdom, Moggallana for psychic powers. Their conversion brought hundreds of followers from other traditions.' },
  { label: 'The Vinaya', detail: 'Monastic code of 227 rules for monks and 311 for nuns, governing everything from robes to meals to meditation — creating communities that have survived 2,500 years.' },
];

const ASHOKA_TIMELINE: TimelineEntry[] = [
  { year: '304 BCE', title: 'Birth of Ashoka', description: 'Born grandson of Chandragupta Maurya, founder of the Maurya Empire — India\'s first great empire spanning nearly the entire subcontinent.', color: GOLD },
  { year: '268 BCE', title: 'Ashoka becomes Emperor', description: 'Seized the throne after a brutal succession war. Ruled the largest empire in Indian history — 5 million km², 50–60 million people.', color: SAFFRON },
  { year: '261 BCE', title: 'The Kalinga War', description: 'Conquered Kalinga (modern Odisha) in a devastating war: 100,000 killed, 150,000 deported. The carnage horrified Ashoka and triggered a profound moral crisis.', color: CRIMSON },
  { year: '~260 BCE', title: 'Conversion to Buddhism', description: 'Overcome with remorse, Ashoka embraced Buddhism. He declared: "The sound of the war drum has become the call of dharma." The most powerful man in India chose non-violence.', color: TEAL },
  { year: '~250 BCE', title: 'Edicts across the empire', description: 'Inscribed dharma edicts on pillars and rocks across India — promoting non-violence, religious tolerance, animal welfare, and healthcare. The first "human rights" proclamations.', color: INDIGO },
  { year: '~250 BCE', title: 'Missions to the world', description: 'Sent Buddhist missionaries to Sri Lanka (his son Mahinda), Central Asia, Egypt, Syria, Macedonia, and Cyrene. Transformed Buddhism from an Indian sect into a world religion.', color: JADE },
];

const GREAT_SPLIT: InsightEntry[] = [
  { label: 'The root cause', detail: 'After the Buddha\'s death (c. 483 BCE), disagreements over monastic rules and doctrine led to the first schisms. By the 3rd century BCE, ~18 schools existed.' },
  { label: 'Theravada — Way of the Elders', detail: 'The "conservative" school preserving the original Pali canon. Goal: individual liberation (arahantship). Dominant in Sri Lanka, Myanmar, Thailand, Laos, Cambodia. 38% of Buddhists.' },
  { label: 'Mahayana — The Greater Vehicle', detail: 'Emerged ~1st century BCE. Emphasises the bodhisattva ideal — postponing one\'s own nirvana to help all beings. New sutras (Heart Sutra, Lotus Sutra). Dominant in China, Japan, Korea, Vietnam. 56% of Buddhists.' },
  { label: 'Bodhisattva vs Arahant', detail: 'Theravada\'s ideal: the arahant who achieves personal liberation. Mahayana\'s ideal: the bodhisattva who vows to liberate all sentient beings before entering nirvana — compassion as the highest virtue.' },
  { label: 'Vajrayana — The Diamond Vehicle', detail: 'Emerged from Mahayana (~7th century CE). Esoteric practices: mantras, mandalas, tantric rituals. Claims to offer the fastest path to enlightenment. Dominant in Tibet, Mongolia, Bhutan. 6% of Buddhists.' },
  { label: 'What unites them', detail: 'All three branches accept the Four Noble Truths, the Eightfold Path, karma, rebirth, and the goal of liberation from suffering. The differences are of emphasis and method, not core doctrine.' },
];

const SILK_ROAD_TIMELINE: TimelineEntry[] = [
  { year: '~1st c. BCE', title: 'Buddhism reaches Central Asia', description: 'Gandharan merchants and monks carry Buddhism along trade routes into modern Afghanistan, Uzbekistan, and the Tarim Basin. Bamiyan becomes a major Buddhist centre.', color: SAFFRON },
  { year: '~1st c. CE', title: 'Arrives in China', description: 'The Han Dynasty emperor Ming Di reportedly dreamed of a golden figure — sent envoys west who returned with Buddhist scriptures and monks. Buddhism enters the Middle Kingdom.', color: TEAL },
  { year: '~2nd–4th c.', title: 'Translation movement', description: 'Kumarajiva (344–413 CE) and other scholar-monks translate vast numbers of Sanskrit texts into Chinese — one of history\'s greatest translation efforts, shaping East Asian civilisation.', color: INDIGO },
  { year: '372 CE', title: 'Reaches Korea', description: 'A Chinese monk brings Buddhist texts and images to the Goguryeo kingdom. Buddhism becomes the state religion of all Three Kingdoms of Korea within decades.', color: JADE },
  { year: '552 CE', title: 'Arrives in Japan', description: 'The Korean kingdom of Baekje sends a Buddha image and sutras to the Japanese court. After initial resistance, Buddhism is embraced and transforms Japanese culture profoundly.', color: GOLD },
  { year: '~7th c.', title: 'Southeast Asian expansion', description: 'Indian merchants and monks bring Theravada and Mahayana Buddhism to the maritime kingdoms of Southeast Asia — Srivijaya, Khmer, and Pagan (Myanmar) become major Buddhist centres.', color: LOTUS },
];

const CHINA_INSIGHTS: InsightEntry[] = [
  { label: 'Initial resistance', detail: 'Confucian scholars attacked Buddhism as "foreign" and antisocial — monks don\'t marry, don\'t serve the state, don\'t produce children. Buddhism had to adapt to Chinese values.' },
  { label: 'Buddhist-Taoist synthesis', detail: 'Early translators used Taoist terms ("Tao" for "dharma," "wu wei" for "nirvana"). Buddhism absorbed Taoist naturalism; Taoism absorbed Buddhist meditation and monasticism.' },
  { label: 'Chan (Zen) Buddhism', detail: 'Emerged in the 6th–7th century. "Direct pointing at the mind." Minimised scripture study in favour of meditation, koans (paradoxical riddles), and the master-student relationship.' },
  { label: 'Pure Land Buddhism', detail: 'Devotional school teaching that faith in Amitabha Buddha and chanting "Namo Amituofo" leads to rebirth in the Western Paradise. Became the most popular form of Chinese Buddhism.' },
  { label: 'The Great Persecutions (845 CE)', detail: 'Emperor Wuzong destroyed 4,600 monasteries and forced 260,000 monks and nuns to return to lay life. Buddhism survived but never regained its Tang Dynasty peak in China.' },
  { label: 'Lasting Chinese influence', detail: 'Chinese Buddhism produced unique schools (Chan, Pure Land, Tiantai, Huayan) that shaped all of East Asian Buddhism. Chinese translations became the canon for Korea, Japan, and Vietnam.' },
];

const TIBETAN_INSIGHTS: InsightEntry[] = [
  { label: 'First arrival (7th c.)', detail: 'King Songtsen Gampo (r. 604–650) married Buddhist princesses from Nepal and China. He built the Jokhang Temple in Lhasa and commissioned the Tibetan script to translate Buddhist texts.' },
  { label: 'Padmasambhava (8th c.)', detail: 'The legendary Indian tantric master ("Guru Rinpoche") tamed Tibet\'s local demons (Bon spirits), establishing Vajrayana Buddhism. Founded Samye — Tibet\'s first monastery (775 CE).' },
  { label: 'Bon religion fusion', detail: 'Tibet\'s indigenous Bon religion deeply influenced Tibetan Buddhism — prayer flags, sky burials, oracle consultations, and the emphasis on ritual and the supernatural all have Bon roots.' },
  { label: 'The Dalai Lama lineage', detail: 'Established in 1391 with Gendun Drub. Each Dalai Lama is believed to be a reincarnation of Avalokiteshvara, the bodhisattva of compassion. The 14th (Tenzin Gyatso, b. 1935) is the current holder.' },
  { label: 'Tibetan Book of the Dead', detail: 'The Bardo Thodol — a guide for consciousness between death and rebirth. Describes 49 days of visions and choices that determine the next life. Influenced Western psychology (Jung, Leary).' },
  { label: 'Four major schools', detail: 'Nyingma (oldest, founded by Padmasambhava), Kagyu (Milarepa\'s lineage), Sakya, and Gelug (Dalai Lama\'s school, founded by Tsongkhapa in 14th c.). Each emphasises different practices.' },
];

const ART_INSIGHTS: InsightEntry[] = [
  { label: 'No images for 500 years', detail: 'For the first five centuries, the Buddha was never depicted in human form — only through symbols: an empty throne, footprints, the Bodhi Tree, the Dharma wheel, or a parasol.' },
  { label: 'Gandharan art', detail: 'Under Greek-influenced Gandhara (1st–5th c. CE, modern Pakistan/Afghanistan), the first Buddha images appeared — wearing toga-like robes, with Apollo-like features. Greco-Buddhist fusion.' },
  { label: 'Stupas', detail: 'Dome-shaped monuments housing relics of the Buddha or saints. Sanchi (3rd c. BCE), Borobudur (9th c. CE, Java), and Shwedagon Pagoda (Myanmar) are among the greatest Buddhist structures.' },
  { label: 'The Dharma Wheel', detail: 'The eight-spoked wheel (dharmachakra) symbolises the Eightfold Path and the Buddha\'s first sermon at Sarnath. It appears on India\'s national flag to this day.' },
  { label: 'Mudras (hand gestures)', detail: 'Each Buddha statue\'s hand position carries meaning: earth-touching (enlightenment), meditation, teaching, fearlessness, and giving. A visual theology readable across languages.' },
  { label: 'Bamiyan Buddhas', detail: 'Two colossal statues (53m and 35m) carved into Afghan cliffs in the 6th century CE. Stood for 1,500 years until destroyed by the Taliban in March 2001 — a global cultural tragedy.' },
];

const DECLINE_INDIA: InsightEntry[] = [
  { label: 'Hindu revival', detail: 'From the 8th century, the Bhakti movement and philosophers like Adi Shankara (788–820 CE) revitalised Hinduism, absorbing Buddhist ideas while marginalising Buddhist institutions.' },
  { label: 'Loss of royal patronage', detail: 'As Hindu dynasties replaced Buddhist-friendly rulers, monasteries lost land grants and royal support. Without a lay community tradition, monks depended on state patronage to survive.' },
  { label: 'Islamic invasions (12th–13th c.)', detail: 'Turkic Muslim armies systematically destroyed Buddhist monasteries across northern India. Monks — the carriers of Buddhist tradition — were killed or fled to Tibet and Southeast Asia.' },
  { label: 'Nalanda University destroyed (1193)', detail: 'The world\'s first residential university — founded 5th century CE, 10,000 students from 40+ countries, 9 million manuscripts. Bakhtiyar Khilji\'s army burned it. The library smoldered for months.' },
  { label: 'Vikramashila falls (1203)', detail: 'The last great Buddhist monastery in India was destroyed. With it, institutional Buddhism in its homeland effectively ended — surviving only in Nepal, Sri Lanka, and the Himalayan regions.' },
  { label: 'The great irony', detail: 'Buddhism largely vanished from India — the land of its birth — for 800 years. It thrived everywhere it spread (China, Japan, Thailand, Tibet) but died where it began.' },
];

const MODERN_BUDDHISM: InsightEntry[] = [
  { label: 'Ambedkar\'s revival in India', detail: 'B.R. Ambedkar (1891–1956), architect of India\'s constitution, converted to Buddhism in 1956 with 500,000 Dalit followers — rejecting the caste system. Today, 8 million Indian Buddhists follow his path.' },
  { label: 'The mindfulness revolution', detail: 'Jon Kabat-Zinn\'s MBSR programme (1979) brought Buddhist meditation into Western medicine. Mindfulness is now prescribed by the NHS, taught in schools, and practiced in corporations worldwide.' },
  { label: 'Thich Nhat Hanh (1926–2022)', detail: 'Vietnamese Zen master who coined "Engaged Buddhism" — applying mindfulness to social justice, peace activism, and environmentalism. His Plum Village community spans four continents.' },
  { label: 'The 14th Dalai Lama', detail: 'Tenzin Gyatso — Nobel Peace Prize winner (1989), global ambassador for compassion, interfaith dialogue, and Tibetan independence. One of the most recognised religious figures alive.' },
  { label: 'Buddhism and science', detail: 'The Dalai Lama\'s dialogue with neuroscientists has produced groundbreaking research on meditation and neuroplasticity. Buddhist psychology increasingly influences cognitive therapy (ACT, DBT).' },
  { label: 'Tensions and contradictions', detail: 'Buddhist-majority Myanmar\'s persecution of Rohingya Muslims and Sri Lanka\'s civil war complicate Buddhism\'s peaceful image — a reminder that no tradition is immune to political violence.' },
];

const SPREAD_MAP: InsightEntry[] = [
  { label: 'India → Sri Lanka (3rd c. BCE)', detail: 'Ashoka\'s son Mahinda brought Theravada Buddhism to King Devanampiya Tissa. Sri Lanka has preserved the oldest complete Pali canon ever since.' },
  { label: 'India → Central Asia (2nd c. BCE)', detail: 'Gandharan Buddhism flourished in modern Afghanistan, Pakistan, and along the Silk Road. The Bamiyan Buddhas marked this once-thriving tradition.' },
  { label: 'Central Asia → China (1st c. CE)', detail: 'Via Silk Road merchants and missionaries. Buddhism became China\'s most influential imported religion, spawning Chan (Zen) and Pure Land traditions.' },
  { label: 'China → Korea (4th c.)', detail: 'Chinese monks brought Buddhism to the Three Kingdoms. Korean Buddhism developed the Seon (Zen) tradition and the world\'s most complete woodblock-printed Buddhist canon (Tripitaka Koreana).' },
  { label: 'Korea → Japan (6th c.)', detail: 'Via the Baekje kingdom. Japanese Buddhism produced unique schools: Zen, Pure Land, Nichiren, and Shingon. Buddhism profoundly shaped Japanese art, architecture, and philosophy.' },
  { label: 'India → Tibet (7th c.)', detail: 'Vajrayana Buddhism merged with indigenous Bon traditions to create the most ritually elaborate form of Buddhism. The Dalai Lama institution governed Tibet for centuries.' },
  { label: 'India → Southeast Asia (varied)', detail: 'Theravada became dominant in Myanmar, Thailand, Cambodia, and Laos. Mahayana influenced Vietnam and Indonesia (Borobudur). Buddhism shaped the political and cultural identity of the entire region.' },
  { label: 'Asia → The West (19th–20th c.)', detail: 'Colonial-era scholars, the World Parliament of Religions (1893), Zen teachers in the 1950s–60s, and the Tibetan diaspora after 1959 brought Buddhism to Europe and America.' },
];

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Siddhartha Gautama (the Buddha)', years: '~563–483 BCE', contribution: 'Founder of Buddhism. Attained enlightenment under the Bodhi Tree and taught the Middle Way, the Four Noble Truths, and the Eightfold Path for 45 years.' },
  { name: 'Emperor Ashoka', years: '304–232 BCE', contribution: 'Mauryan emperor who converted after the Kalinga War and transformed Buddhism from an Indian sect into a world religion through missionary activity and dharma edicts.' },
  { name: 'Nagarjuna', years: '~150–250 CE', contribution: 'Indian philosopher who founded Madhyamaka ("Middle Way") school. His doctrine of shunyata (emptiness) became the philosophical foundation of Mahayana Buddhism.' },
  { name: 'Bodhidharma', years: '~5th–6th c. CE', contribution: 'Semi-legendary Indian monk who brought Chan (Zen) Buddhism to China. "Not relying on words and letters, pointing directly to the human mind."' },
  { name: 'Padmasambhava', years: '~8th c. CE', contribution: 'The "Guru Rinpoche" who established Vajrayana Buddhism in Tibet, taming local spirits and founding Samye monastery. Revered as a second Buddha in Tibet.' },
  { name: 'Kumarajiva', years: '344–413 CE', contribution: 'Kuchean monk who translated crucial Sanskrit texts into Chinese with unprecedented accuracy, shaping the entire trajectory of East Asian Buddhism.' },
  { name: 'Dogen', years: '1200–1253', contribution: 'Japanese Zen master who founded the Soto Zen school. His masterwork Shobogenzo ("Treasury of the True Dharma Eye") is one of the greatest works of Buddhist philosophy.' },
  { name: 'B.R. Ambedkar', years: '1891–1956', contribution: 'Architect of India\'s constitution who led the modern Buddhist revival in India. His mass conversion in 1956 gave Buddhism a renewed presence in its homeland.' },
];

const BRANCHES_TABLE = [
  { branch: 'Theravada', pct: '38%', region: 'Sri Lanka, Myanmar, Thailand, Cambodia, Laos', focus: 'Individual liberation (arahantship)', scripture: 'Pali Canon (Tipitaka)', practice: 'Vipassana meditation, monastic discipline' },
  { branch: 'Mahayana', pct: '56%', region: 'China, Japan, Korea, Vietnam, Taiwan', focus: 'Universal liberation (bodhisattva ideal)', scripture: 'Chinese/Sanskrit canon + new sutras', practice: 'Zen meditation, Pure Land devotion, chanting' },
  { branch: 'Vajrayana', pct: '6%', region: 'Tibet, Mongolia, Bhutan, Nepal', focus: 'Rapid enlightenment via tantric practice', scripture: 'Tibetan Kangyur/Tengyur + tantras', practice: 'Mantras, mandalas, deity yoga, guru devotion' },
];

/* ── sub-components ──────────────────────────────────────────────── */

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
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 8 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 24 }}>{intro}</p>
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
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18 }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: e.color,
              backgroundColor: `${e.color}18`,
              padding: '2px 10px',
              borderRadius: 6,
              marginBottom: 4,
            }}
          >
            {e.year}
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', margin: '4px 0' }}>
            {e.title}
          </h3>
          <p style={{ color: ASH, lineHeight: 1.6, margin: 0 }}>{e.description}</p>
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

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
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: FIGURE_COLORS[i % FIGURE_COLORS.length], margin: '0 0 2px' }}>
            {f.name}
          </h4>
          <span style={{ fontSize: '0.85rem', color: SLATE }}>{f.years}</span>
          <p style={{ color: ASH, lineHeight: 1.6, margin: '8px 0 0', fontSize: '0.95rem' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function BuddhismHistoryPage() {
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
        <div style={{ paddingTop: 20 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ───────────────────────────────────────────────── */}
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
              background: `linear-gradient(135deg, ${SAFFRON}, ${TEAL})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Buddhism — From the Bodhi Tree to 500 Million Minds (563 BCE–Present)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, fontSize: '1.05rem', marginBottom: 12 }}
          >
            A prince abandons his palace. Sitting under a tree, he discovers the nature of suffering —
            and an entire civilisation listens. Buddhism began as one man's quest for liberation in
            6th-century India and became a global tradition that has shaped the minds of 500 million people
            across 2,500 years.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{ color: SLATE, lineHeight: 1.7, maxWidth: 800 }}
          >
            From the monasteries of Sri Lanka to the Zen gardens of Japan, from the prayer flags of
            Tibet to the mindfulness apps on your phone — this is the story of how a philosophy born
            under a fig tree became the world's fourth-largest religion.
          </motion.p>
        </header>

        {/* ── Key Stats ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
            marginBottom: 32,
            padding: 20,
            backgroundColor: 'rgba(245,158,11,0.06)',
            border: `1px solid ${SAFFRON}33`,
            borderRadius: 12,
          }}
        >
          {KEY_STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: SAFFRON }}>{s.label}</div>
              <div style={{ fontSize: '0.85rem', color: ASH, lineHeight: 1.4 }}>{s.detail}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Ancient India Context ──────────────────────────────── */}
        <SectionWrapper
          id="ancient-india"
          icon="🕉️"
          title="Ancient India Context (600 BCE)"
          accentColor={COPPER}
          intro="Buddhism did not emerge in a vacuum. Sixth-century BCE India was a cauldron of spiritual experimentation — a time when wandering ascetics challenged the Vedic establishment and cities created new questions that old rituals couldn't answer."
        >
          <InsightGrid items={ANCIENT_INDIA_CONTEXT} />
        </SectionWrapper>

        {/* ── Siddhartha Gautama ─────────────────────────────────── */}
        <SectionWrapper
          id="siddhartha"
          icon="👑"
          title="Siddhartha Gautama (563–483 BCE)"
          accentColor={SAFFRON}
          intro="A prince born into luxury who renounced everything to understand why people suffer. His journey from palace to asceticism to the Middle Way is one of history's most consequential personal transformations."
        >
          <TimelineCard entries={SIDDHARTHA_TIMELINE} />
        </SectionWrapper>

        {/* ── Enlightenment ──────────────────────────────────────── */}
        <SectionWrapper
          id="enlightenment"
          icon="🌳"
          title="The Enlightenment"
          accentColor={JADE}
          intro="After six years of seeking and rejecting both luxury and extreme austerity, Siddhartha sat beneath a pipal tree and resolved not to rise until he understood the truth. What happened that night in Bodh Gaya changed the world."
        >
          <InsightGrid items={ENLIGHTENMENT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Core Teachings ─────────────────────────────────────── */}
        <SectionWrapper
          id="four-noble-truths"
          icon="☸️"
          title="The Four Noble Truths"
          accentColor={MAROON}
          intro="The Buddha's central teaching — a diagnosis of the human condition and its cure. Like a physician, he identified the disease (suffering), the cause (craving), the prognosis (it can end), and the treatment (the Eightfold Path)."
        >
          <InsightGrid items={FOUR_NOBLE_TRUTHS} />
        </SectionWrapper>

        <SectionWrapper
          id="eightfold-path"
          icon="🛤️"
          title="The Noble Eightfold Path"
          accentColor={TEAL}
          intro="Not a sequential checklist but an interconnected system of ethical conduct (sila), mental discipline (samadhi), and wisdom (panna). Together, these eight practices form the practical path to the end of suffering."
        >
          <InsightGrid items={EIGHTFOLD_PATH} />
        </SectionWrapper>

        <SectionWrapper
          id="three-marks"
          icon="🔄"
          title="Three Marks of Existence"
          accentColor={INDIGO}
          intro="The Buddha identified three characteristics shared by all conditioned phenomena — three truths that, when deeply understood through meditation, lead to liberation."
        >
          <InsightGrid items={THREE_MARKS} />
        </SectionWrapper>

        <SectionWrapper
          id="karma-nirvana"
          icon="🔥"
          title="Karma, Rebirth & Nirvana"
          accentColor={LOTUS}
          intro="Buddhism inherited the Indian concepts of karma and rebirth but radically reinterpreted them — no eternal soul, no cosmic judge, just the natural consequences of intentional actions across lifetimes."
        >
          <InsightGrid items={KARMA_NIRVANA} />
        </SectionWrapper>

        {/* ── The Sangha ─────────────────────────────────────────── */}
        <SectionWrapper
          id="sangha"
          icon="🧘"
          title="The Sangha — The First Buddhist Communities"
          accentColor={JADE}
          intro="The Buddha didn't just teach — he built an institution. The Sangha (monastic community) became one of the world's oldest continuously operating organisations, preserving and transmitting the dharma across millennia."
        >
          <InsightGrid items={SANGHA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Emperor Ashoka ─────────────────────────────────────── */}
        <SectionWrapper
          id="ashoka"
          icon="🦁"
          title="Emperor Ashoka — The Buddhist Constantine (268–232 BCE)"
          accentColor={GOLD}
          intro="If the Buddha planted the seed of Buddhism, Ashoka was the gardener who spread it across the known world. A blood-soaked conqueror who became history's most famous convert to non-violence — and the man who made Buddhism a world religion."
        >
          <TimelineCard entries={ASHOKA_TIMELINE} />
        </SectionWrapper>

        {/* ── The Great Split ────────────────────────────────────── */}
        <SectionWrapper
          id="great-split"
          icon="🔱"
          title="The Great Split — Three Vehicles"
          accentColor={MAROON}
          intro="Buddhism did not stay monolithic. Debates over doctrine, monastic rules, and the very goal of practice produced the great division into Theravada, Mahayana, and eventually Vajrayana — three distinct paths sharing a common root."
        >
          <InsightGrid items={GREAT_SPLIT} />

          {/* Branches comparison table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 24, overflowX: 'auto' }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              <thead>
                <tr>
                  {['Branch', '%', 'Region', 'Focus', 'Scripture', 'Practice'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderBottom: `2px solid ${SAFFRON}44`,
                        color: SAFFRON,
                        fontWeight: 700,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRANCHES_TABLE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#f1f5f9' }}>{row.branch}</td>
                    <td style={{ padding: '10px 12px', color: SAFFRON, fontWeight: 700 }}>{row.pct}</td>
                    <td style={{ padding: '10px 12px', color: ASH }}>{row.region}</td>
                    <td style={{ padding: '10px 12px', color: ASH }}>{row.focus}</td>
                    <td style={{ padding: '10px 12px', color: ASH }}>{row.scripture}</td>
                    <td style={{ padding: '10px 12px', color: ASH }}>{row.practice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </SectionWrapper>

        {/* ── Silk Road Spread ───────────────────────────────────── */}
        <SectionWrapper
          id="silk-road"
          icon="🐫"
          title="Buddhism Spreads Along the Silk Road"
          accentColor={TEAL}
          intro="Merchants carried silk and spices east and west — but monks travelled the same routes carrying something more durable: ideas. Buddhism's spread along the Silk Road is one of history's greatest examples of cultural transmission."
        >
          <TimelineCard entries={SILK_ROAD_TIMELINE} />
        </SectionWrapper>

        {/* ── Spread Map Callout ─────────────────────────────────── */}
        <SectionWrapper
          id="spread-map"
          icon="🗺️"
          title="The Buddhist World — How It Spread"
          accentColor={SKY}
          intro="From its birthplace in the Gangetic plain, Buddhism followed trade routes, royal missionaries, and wandering monks across an entire continent — and eventually the world."
        >
          <InsightGrid items={SPREAD_MAP} />
        </SectionWrapper>

        {/* ── Buddhism in China ──────────────────────────────────── */}
        <SectionWrapper
          id="china"
          icon="🏯"
          title="Buddhism in China"
          accentColor={CRIMSON}
          intro="When Buddhism arrived in China, it encountered a civilisation with its own ancient philosophies — Confucianism and Taoism. The collision and synthesis produced entirely new forms of Buddhism that would define East Asian spirituality."
        >
          <InsightGrid items={CHINA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Tibetan Buddhism ───────────────────────────────────── */}
        <SectionWrapper
          id="tibet"
          icon="🏔️"
          title="Tibetan Buddhism (7th Century CE)"
          accentColor={LOTUS}
          intro="When Buddhism crossed the Himalayas into Tibet, it merged with the indigenous Bon religion to create the most ritually elaborate and visually spectacular form of Buddhism — complete with tulku reincarnation lineages, tantric practices, and the Dalai Lama."
        >
          <InsightGrid items={TIBETAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Art & Architecture ─────────────────────────────────── */}
        <SectionWrapper
          id="art"
          icon="🎨"
          title="Buddhist Art & Architecture"
          accentColor={GOLD}
          intro="For 500 years, no one dared depict the Buddha in human form. When they finally did, the result was one of the most diverse and beautiful artistic traditions in human history — from Greco-Buddhist Gandhara to the towering Buddhas of Bamiyan."
        >
          <InsightGrid items={ART_INSIGHTS} />
        </SectionWrapper>

        {/* ── Decline in India ───────────────────────────────────── */}
        <SectionWrapper
          id="decline-india"
          icon="📉"
          title="Decline in India (1200 CE)"
          accentColor={CRIMSON}
          intro="The most tragic chapter in Buddhist history: the religion that transformed half of Asia was nearly extinguished in the very land where it was born. How did the world's greatest Buddhist civilisation lose its Buddhism?"
        >
          <InsightGrid items={DECLINE_INDIA} />
        </SectionWrapper>

        {/* ── Buddhism Today ─────────────────────────────────────── */}
        <SectionWrapper
          id="modern"
          icon="🌍"
          title="Buddhism in the Modern World"
          accentColor={TEAL}
          intro="From Ambedkar's mass conversions in India to mindfulness apps in Silicon Valley, Buddhism continues to evolve. It has become the West's most adopted Eastern religion — but also faces uncomfortable contradictions in its Asian heartlands."
        >
          <InsightGrid items={MODERN_BUDDHISM} />
        </SectionWrapper>

        {/* ── Key Figures ────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="📜"
          title="Key Figures"
          accentColor={SAFFRON}
          intro="The individuals who shaped Buddhism's 2,500-year journey — from its founder to the philosophers, emperors, and activists who carried it across civilisations."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Connection Links ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '32px 0',
            borderTop: `1px solid ${SAFFRON}33`,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ color: SLATE, fontWeight: 600, fontSize: '0.9rem', alignSelf: 'center' }}>
            Explore related →
          </span>
          {[
            { to: '/ancient-india', label: 'Ancient India' },
            { to: '/silk-road', label: 'Silk Road' },
            { to: '/islam-history', label: 'Islam History' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: SAFFRON,
                textDecoration: 'none',
                fontSize: '0.9rem',
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${SAFFRON}44`,
                backgroundColor: `${SAFFRON}10`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer style={{ padding: '48px 0 64px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              borderLeft: `3px solid ${SAFFRON}`,
              paddingLeft: 20,
              margin: '0 0 32px',
              fontStyle: 'italic',
              color: ASH,
              lineHeight: 1.7,
            }}
          >
            "You yourself must strive. The Buddhas only point the way."
            <br />
            <span style={{ color: SLATE, fontSize: '0.9rem' }}>— Dhammapada, verse 276</span>
          </motion.blockquote>

          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
