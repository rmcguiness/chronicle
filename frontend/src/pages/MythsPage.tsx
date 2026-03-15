/**
 * MythsPage — guide to world mythology and its historical context.
 *
 * Route: /myths
 *
 * Covers 10+ mythological traditions with pantheons, creation stories,
 * key myths, and historical roles. Features include culture filtering,
 * cross-cultural comparisons, deity quiz, and Chronicle search links.
 */

import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Culture =
  | 'Greek'
  | 'Norse'
  | 'Egyptian'
  | 'Mesopotamian'
  | 'Hindu'
  | 'Chinese'
  | 'Aztec'
  | 'Celtic'
  | 'Japanese'
  | 'Roman';

type MythType = 'Creation' | 'Hero' | 'Divine' | 'Trickster' | 'Apocalyptic' | 'Nature' | 'Epic';

interface Deity {
  name: string;
  domain: string;
  symbol?: string;
}

interface Myth {
  title: string;
  type: MythType;
  summary: string;
  significance: string;
}

interface MythTradition {
  culture: Culture;
  emoji: string;
  era: string;
  region: string;
  color: string;
  introduction: string;
  pantheon: Deity[];
  creationMyth: string;
  keyMyths: Myth[];
  historicalRole: string;
  slug?: string;
}

interface QuizQuestion {
  question: string;
  answers: { text: string; scores: Partial<Record<Culture, number>> }[];
}

type Tab = 'traditions' | 'compare' | 'quiz';

// ─────────────────────────────────────────────────────────────────────────────
// Color Maps
// ─────────────────────────────────────────────────────────────────────────────

const CULTURE_COLORS: Record<Culture, string> = {
  Greek: '#3b82f6',
  Norse: '#6366f1',
  Egyptian: '#f59e0b',
  Mesopotamian: '#a855f7',
  Hindu: '#ef4444',
  Chinese: '#dc2626',
  Aztec: '#22c55e',
  Celtic: '#10b981',
  Japanese: '#ec4899',
  Roman: '#f97316',
};

const MYTH_TYPE_COLORS: Record<MythType, string> = {
  Creation: '#a855f7',
  Hero: '#3b82f6',
  Divine: '#f59e0b',
  Trickster: '#22c55e',
  Apocalyptic: '#ef4444',
  Nature: '#10b981',
  Epic: '#6366f1',
};

// ─────────────────────────────────────────────────────────────────────────────
// Data — Mythological Traditions
// ─────────────────────────────────────────────────────────────────────────────

const TRADITIONS: MythTradition[] = [
  {
    culture: 'Greek',
    emoji: '🏛️',
    era: '~800 BCE – 300 CE',
    region: 'Mediterranean / Southern Europe',
    color: CULTURE_COLORS.Greek,
    introduction:
      'Greek mythology is the foundation of Western literary tradition. Its gods were deeply human — petty, jealous, lustful, courageous — reflecting the Greeks\' belief that the universe was governed by forces as capricious as people themselves.',
    pantheon: [
      { name: 'Zeus', domain: 'King of gods, sky, thunder', symbol: '⚡' },
      { name: 'Hera', domain: 'Marriage, women, childbirth', symbol: '👑' },
      { name: 'Poseidon', domain: 'Sea, earthquakes, horses', symbol: '🔱' },
      { name: 'Demeter', domain: 'Harvest, agriculture, seasons', symbol: '🌾' },
      { name: 'Athena', domain: 'Wisdom, warfare, crafts', symbol: '🦉' },
      { name: 'Apollo', domain: 'Sun, music, prophecy, healing', symbol: '☀️' },
      { name: 'Artemis', domain: 'Hunt, wilderness, moon', symbol: '🏹' },
      { name: 'Ares', domain: 'War, bloodshed, violence', symbol: '⚔️' },
      { name: 'Aphrodite', domain: 'Love, beauty, desire', symbol: '🌹' },
      { name: 'Hephaestus', domain: 'Fire, forge, metalworking', symbol: '🔨' },
      { name: 'Hermes', domain: 'Trade, travel, thieves, messengers', symbol: '🪽' },
      { name: 'Dionysus', domain: 'Wine, festivity, ecstasy, theater', symbol: '🍇' },
    ],
    creationMyth:
      'In the beginning was Chaos — a yawning void. From Chaos emerged Gaia (Earth), who bore Uranus (Sky). Together they produced the twelve Titans, led by Kronos who overthrew his father. Kronos in turn was overthrown by his son Zeus, who established the Olympian gods on Mount Olympus. This succession myth — child overthrowing parent — reflected Greek anxieties about generational power transfer.',
    keyMyths: [
      {
        title: 'Prometheus Steals Fire',
        type: 'Trickster',
        summary:
          'The Titan Prometheus stole fire from the gods and gave it to humanity, enabling civilization. Zeus punished him by chaining him to a rock where an eagle ate his liver daily, only for it to regrow each night.',
        significance: 'Symbolizes the cost of progress and the tension between divine authority and human advancement. The myth influenced Enlightenment thinking about knowledge as liberation.',
      },
      {
        title: 'Pandora\'s Box',
        type: 'Divine',
        summary:
          'Zeus sent Pandora, the first woman, to Earth with a jar (mistranslated as "box") she was told never to open. Curiosity won, and she released all evils into the world — disease, death, suffering. Only Hope remained inside.',
        significance: 'An origin story for human suffering and a cautionary tale about curiosity. Often compared to Eve in Judeo-Christian tradition.',
      },
      {
        title: 'The Odyssey',
        type: 'Epic',
        summary:
          'After the Trojan War, Odysseus spent ten years trying to return home to Ithaca, facing Cyclops, Sirens, Scylla and Charybdis, and the wrath of Poseidon. His wife Penelope waited faithfully, fending off suitors.',
        significance: 'The foundational adventure narrative of Western literature. Established the "hero\'s journey" archetype that still structures modern storytelling.',
      },
      {
        title: 'The Twelve Labors of Hercules',
        type: 'Hero',
        summary:
          'Hercules, driven mad by Hera, killed his own children. As penance, he performed twelve impossible tasks: slaying the Nemean Lion, capturing Cerberus, cleaning the Augean stables, and more.',
        significance: 'The archetypal strongman myth — redemption through suffering. Hercules became the model for the mortal who earns divinity through deeds.',
      },
      {
        title: 'Oedipus Rex',
        type: 'Divine',
        summary:
          'Oedipus unknowingly fulfilled a prophecy by killing his father and marrying his mother. When he discovered the truth, he blinded himself. The oracle at Delphi had warned his parents, but their attempts to prevent fate only ensured it.',
        significance: 'The definitive Greek tragedy about fate vs. free will. Gave Freud the concept of the "Oedipus complex" and remains central to literary theory.',
      },
      {
        title: 'Perseus and Medusa',
        type: 'Hero',
        summary:
          'Perseus was sent to kill Medusa, a Gorgon whose gaze turned people to stone. With gifts from the gods — winged sandals, a reflective shield, a cap of invisibility — he beheaded her and used her head as a weapon.',
        significance: 'A classic quest narrative blending divine patronage with mortal courage. The myth inspired Renaissance art and the concept of the hero equipped by higher powers.',
      },
      {
        title: 'Orpheus in the Underworld',
        type: 'Epic',
        summary:
          'The musician Orpheus descended to Hades to retrieve his dead wife Eurydice. His music charmed even the god of death, who agreed to release her — on one condition: Orpheus must not look back. At the last moment, he turned, and she was lost forever.',
        significance: 'The most powerful myth about love, loss, and the impossibility of reversing death. It has been retold in opera, film, and literature for millennia.',
      },
    ],
    historicalRole:
      'Greek myths explained natural phenomena (seasons via Persephone, earthquakes via Poseidon), justified social hierarchies (kings claimed divine descent), and formed the basis of Athenian theater — tragedy and comedy were both religious festivals honoring Dionysus. The myths unified Greek city-states through shared cultural identity.',
    slug: 'ancient-greece',
  },
  {
    culture: 'Norse',
    emoji: '⚔️',
    era: '~200 – 1100 CE',
    region: 'Scandinavia / Northern Europe',
    color: CULTURE_COLORS.Norse,
    introduction:
      'Norse mythology emerged from the harsh landscapes of Scandinavia, where survival demanded courage and community. Unlike most mythologies, it predicted its own end — even the gods would die at Ragnarök. This fatalism shaped a warrior culture that valued glory over longevity.',
    pantheon: [
      { name: 'Odin', domain: 'Wisdom, war, death, poetry', symbol: '👁️' },
      { name: 'Thor', domain: 'Thunder, storms, strength, protection', symbol: '🔨' },
      { name: 'Freya', domain: 'Love, fertility, war, magic (seiðr)', symbol: '✨' },
      { name: 'Loki', domain: 'Trickery, chaos, shape-shifting', symbol: '🔥' },
      { name: 'Balder', domain: 'Light, purity, beauty', symbol: '☀️' },
      { name: 'Tyr', domain: 'Law, justice, heroic glory', symbol: '⚖️' },
      { name: 'Heimdall', domain: 'Watchman of the gods, guardian of Bifröst', symbol: '🌈' },
    ],
    creationMyth:
      'The universe began as two realms: Niflheim (ice) and Muspelheim (fire). Where they met, the giant Ymir formed from melting ice. The gods Odin, Vili, and Vé killed Ymir and built the world from his body — his flesh became earth, his blood the seas, his skull the sky. The great ash tree Yggdrasil connected nine realms, from Asgard (gods) to Hel (the dead).',
    keyMyths: [
      {
        title: 'Ragnarök — Twilight of the Gods',
        type: 'Apocalyptic',
        summary:
          'The final battle where gods and giants destroy each other. Fenrir the wolf swallows Odin. Thor kills the World Serpent but dies from its venom. The sun goes dark, the earth sinks into the sea. But afterward, a new world rises — green and fertile.',
        significance: 'Unique among mythologies for predicting the death of its own gods. Ragnarök shaped Viking fatalism: if even gods die, mortals should seek glory rather than safety.',
      },
      {
        title: 'Loki\'s Monstrous Children',
        type: 'Trickster',
        summary:
          'Loki fathered three terrible creatures: Fenrir the great wolf, Jörmungandr the World Serpent who encircles the earth, and Hel, ruler of the dead. The gods imprisoned all three, but at Ragnarök they break free to destroy the world.',
        significance: 'Loki represents chaos within order — necessary but dangerous. His children symbolize the threats that civilization can suppress but never eliminate.',
      },
      {
        title: 'Odin\'s Sacrifice for Wisdom',
        type: 'Divine',
        summary:
          'Odin hung himself from Yggdrasil for nine days and nights, pierced by his own spear, to gain knowledge of the runes. He also sacrificed one eye at Mímir\'s well for a single drink of wisdom.',
        significance: 'Wisdom requires sacrifice — a core Norse value. This myth influenced the Viking respect for poets and seers alongside warriors.',
      },
      {
        title: 'The Valkyries and Valhalla',
        type: 'Divine',
        summary:
          'Warrior-maidens called Valkyries rode over battlefields, choosing the bravest slain warriors to join Odin in Valhalla. There the dead heroes feasted and fought daily, training for Ragnarök.',
        significance: 'This afterlife myth directly motivated Viking warrior culture — dying in battle was the highest honor, ensuring an eternity of glory.',
      },
    ],
    historicalRole:
      'Norse myths explained the aurora borealis (Bifröst bridge), thunder (Thor\'s hammer), and the seasons. They underpinned Viking social structure — warriors, poets (skalds), and seers (völvas) all had mythic archetypes. The myths survived Christianization through the Eddas, compiled in 13th-century Iceland.',
    slug: 'vikings-norse-expansion',
  },
  {
    culture: 'Egyptian',
    emoji: '🏺',
    era: '~3100 – 30 BCE',
    region: 'Nile Valley / Northeast Africa',
    color: CULTURE_COLORS.Egyptian,
    introduction:
      'Egyptian mythology endured for over 3,000 years — longer than Christianity has existed. Its gods were deeply tied to the Nile\'s annual flood cycle, and its obsession with the afterlife produced the pyramids, mummification, and the Book of the Dead.',
    pantheon: [
      { name: 'Ra', domain: 'Sun, creation, king of gods', symbol: '☀️' },
      { name: 'Osiris', domain: 'Afterlife, resurrection, agriculture', symbol: '🌿' },
      { name: 'Isis', domain: 'Magic, healing, motherhood', symbol: '🪶' },
      { name: 'Horus', domain: 'Sky, kingship, protection', symbol: '🦅' },
      { name: 'Set', domain: 'Chaos, storms, desert, violence', symbol: '🐍' },
      { name: 'Anubis', domain: 'Embalming, death, the underworld', symbol: '🐺' },
      { name: 'Thoth', domain: 'Writing, knowledge, the moon', symbol: '📜' },
      { name: 'Hathor', domain: 'Love, music, joy, motherhood', symbol: '🐄' },
      { name: 'Bastet', domain: 'Cats, home, fertility, protection', symbol: '🐱' },
    ],
    creationMyth:
      'Before creation, there was only Nu — infinite dark waters. From these waters, the first god Atum (later merged with Ra) willed himself into existence, standing on a primordial mound. He created Shu (air) and Tefnut (moisture) by spitting or sneezing them out. They bore Geb (earth) and Nut (sky), who in turn produced Osiris, Isis, Set, and Nephthys — the gods who shaped human destiny.',
    keyMyths: [
      {
        title: 'The Death and Resurrection of Osiris',
        type: 'Divine',
        summary:
          'Set murdered his brother Osiris, dismembering his body and scattering the pieces across Egypt. Isis gathered the pieces, reassembled him, and conceived Horus. Osiris became ruler of the underworld. Horus later avenged his father by defeating Set.',
        significance: 'The foundational myth of Egyptian religion. Osiris\'s resurrection promised all Egyptians eternal life. The Horus-Set conflict justified pharaonic rule — every pharaoh was the living Horus.',
      },
      {
        title: 'The Eye of Ra',
        type: 'Divine',
        summary:
          'Ra\'s eye, personified as the goddess Sekhmet, was sent to punish humanity for plotting against him. She became so bloodthirsty that Ra had to trick her with beer dyed red to look like blood, stopping her from destroying all humanity.',
        significance: 'Explains the duality of the sun — life-giving but potentially destructive. Also an origin myth for beer, connecting agriculture to divine intervention.',
      },
      {
        title: 'The Weighing of the Heart',
        type: 'Divine',
        summary:
          'After death, the deceased\'s heart was weighed against the feather of Ma\'at (truth/justice) by Anubis. If the heart was lighter, the soul entered paradise. If heavier with sin, the demon Ammit devoured it — the soul ceased to exist.',
        significance: 'This moral judgment system shaped Egyptian ethics for millennia. The concept of posthumous moral accounting influenced later Abrahamic afterlife concepts.',
      },
    ],
    historicalRole:
      'Egyptian myths were inseparable from the state. The pharaoh was literally a god — Horus incarnate. Temples were the gods\' homes, priests their servants. The Nile flood was explained as Isis\'s tears for Osiris. Mummification, pyramids, and the elaborate death rituals that fascinate us today were all practical responses to mythological beliefs about the afterlife.',
    slug: 'ancient-egypt',
  },
  {
    culture: 'Mesopotamian',
    emoji: '🏛️',
    era: '~3500 – 539 BCE',
    region: 'Tigris-Euphrates / Modern Iraq',
    color: CULTURE_COLORS.Mesopotamian,
    introduction:
      'Mesopotamian mythology is the oldest recorded mythology in human history. Written on clay tablets in cuneiform, these stories — including the Epic of Gilgamesh — predate the Bible by over a millennium and directly influenced Jewish, Christian, and Islamic traditions.',
    pantheon: [
      { name: 'Enlil', domain: 'Wind, air, earth, storms', symbol: '🌬️' },
      { name: 'Enki', domain: 'Water, wisdom, creation, magic', symbol: '🌊' },
      { name: 'Inanna/Ishtar', domain: 'Love, war, fertility, power', symbol: '⭐' },
      { name: 'Marduk', domain: 'Chief god of Babylon, justice, storms', symbol: '🐉' },
      { name: 'Tiamat', domain: 'Primordial chaos, salt water, dragon', symbol: '🌊' },
      { name: 'Shamash', domain: 'Sun, justice, truth', symbol: '☀️' },
    ],
    creationMyth:
      'The Enuma Elish describes how fresh water (Apsu) and salt water (Tiamat) mingled to produce the first gods. When the younger gods grew noisy, Apsu plotted to destroy them. Marduk, champion of the younger gods, slew Tiamat and split her body — one half became the sky, the other the earth. Humans were created from the blood of a defeated god to serve as laborers for the divine.',
    keyMyths: [
      {
        title: 'Epic of Gilgamesh',
        type: 'Epic',
        summary:
          'King Gilgamesh of Uruk, two-thirds divine, befriended the wild man Enkidu. Together they slew monsters, but when Enkidu died, Gilgamesh sought immortality. He found Utnapishtim, survivor of a great flood (predating Noah by centuries), who told him eternal life was not for mortals. Gilgamesh returned home, accepting that his legacy — the walls of Uruk — would be his immortality.',
        significance: 'The oldest known literary work (~2100 BCE). Contains the earliest flood narrative, the first buddy story, and the first meditation on mortality. It directly influenced the biblical flood story.',
      },
      {
        title: 'Inanna\'s Descent to the Underworld',
        type: 'Divine',
        summary:
          'The goddess Inanna descended to the underworld to visit her sister Ereshkigal. At each of seven gates, she was stripped of clothing and power. She died, was hung on a hook, and only returned by sending her lover Dumuzi as a substitute.',
        significance: 'One of the earliest death-and-rebirth myths. It influenced later descent narratives (Orpheus, Persephone) and seasonal/agricultural cycles — Dumuzi\'s time in the underworld explained winter.',
      },
    ],
    historicalRole:
      'Mesopotamian myths legitimized kingship — rulers claimed divine mandate from Marduk or Enlil. The Code of Hammurabi was presented as given by the sun god Shamash. These myths also explained unpredictable flooding (unlike the Nile\'s regularity), reflecting the harsher, less predictable environment of the Tigris-Euphrates valley.',
    slug: 'rise-of-civilization-mesopotamia',
  },
  {
    culture: 'Hindu',
    emoji: '🙏',
    era: '~1500 BCE – present',
    region: 'Indian Subcontinent',
    color: CULTURE_COLORS.Hindu,
    introduction:
      'Hindu mythology is the world\'s oldest continuously practiced mythological tradition. Its scope is staggering — the Mahabharata alone is ten times the length of the Iliad and Odyssey combined. Unlike Western mythologies, Hindu myths operate on cosmic time scales of billions of years.',
    pantheon: [
      { name: 'Brahma', domain: 'Creator of the universe', symbol: '🪷' },
      { name: 'Vishnu', domain: 'Preserver, appears as avatars to restore order', symbol: '🔵' },
      { name: 'Shiva', domain: 'Destroyer and transformer, cosmic dance', symbol: '🔱' },
      { name: 'Lakshmi', domain: 'Wealth, fortune, prosperity', symbol: '🪷' },
      { name: 'Saraswati', domain: 'Knowledge, music, arts, learning', symbol: '📚' },
      { name: 'Ganesha', domain: 'Beginnings, wisdom, remover of obstacles', symbol: '🐘' },
      { name: 'Hanuman', domain: 'Devotion, strength, courage', symbol: '🐒' },
    ],
    creationMyth:
      'Multiple creation stories coexist. In one, Vishnu sleeps on the cosmic serpent Shesha in an ocean of milk. From his navel grows a lotus, from which Brahma emerges to create the world. The universe goes through endless cycles (yugas) of creation and destruction, each lasting billions of years — a concept remarkably aligned with modern cosmology\'s view of deep time.',
    keyMyths: [
      {
        title: 'The Mahabharata',
        type: 'Epic',
        summary:
          'The world\'s longest poem (~1.8 million words) tells of a dynastic war between the Pandavas and Kauravas. At its heart is the Bhagavad Gita — a battlefield dialogue where Krishna (Vishnu\'s avatar) teaches prince Arjuna about duty, morality, and the nature of reality.',
        significance: 'The Gita remains one of the world\'s most influential philosophical texts. The Mahabharata explores every aspect of human experience — war, love, duty, betrayal, redemption.',
      },
      {
        title: 'The Ramayana',
        type: 'Epic',
        summary:
          'Prince Rama (another Vishnu avatar), exiled from his kingdom, must rescue his wife Sita from the demon king Ravana with the help of the monkey god Hanuman and his army. Rama\'s eventual return and coronation symbolize the triumph of dharma (duty/righteousness).',
        significance: 'The ideal of Rama as the perfect king (Rama Rajya) has shaped Indian political philosophy for millennia. Diwali celebrates his return.',
      },
      {
        title: 'The Churning of the Ocean of Milk',
        type: 'Creation',
        summary:
          'Gods and demons cooperated to churn the cosmic ocean using Mount Mandara as a churning rod and the serpent Vasuki as a rope. From the ocean emerged treasures including Lakshmi (goddess of wealth), the moon, and amrita — the nectar of immortality.',
        significance: 'A myth about cooperation between opposing forces producing creation — remarkably similar to ideas in dialectical philosophy.',
      },
      {
        title: 'Vishnu\'s Ten Avatars (Dashavatara)',
        type: 'Divine',
        summary:
          'Vishnu incarnates in different forms across cosmic ages: Matsya (fish), Kurma (tortoise), Varaha (boar), Narasimha (man-lion), Vamana (dwarf), Parashurama (warrior), Rama (prince), Krishna (cowherd/king), Buddha (teacher), and Kalki (future destroyer).',
        significance: 'This progression from aquatic to terrestrial to human forms has been compared to evolutionary theory. The inclusion of Buddha shows Hinduism\'s capacity for absorbing other traditions.',
      },
    ],
    historicalRole:
      'Hindu mythology is not "mythology" to over a billion practitioners — it is living religion. The caste system, kingship models, seasonal festivals (Diwali, Holi, Navaratri), and daily rituals all derive from these narratives. The epics continue to be performed, televised, and debated across South and Southeast Asia.',
    slug: 'vedic-period-india',
  },
  {
    culture: 'Chinese',
    emoji: '🐉',
    era: '~2000 BCE – present',
    region: 'East Asia',
    color: CULTURE_COLORS.Chinese,
    introduction:
      'Chinese mythology blends seamlessly with philosophy, history, and folk religion. Unlike Western mythologies with clear divine hierarchies, Chinese myths feature a vast bureaucratic heaven mirroring the imperial court — even the afterlife had paperwork.',
    pantheon: [
      { name: 'Jade Emperor', domain: 'Ruler of Heaven, supreme deity', symbol: '👑' },
      { name: 'Nü Wa', domain: 'Creator of humanity, repairs the sky', symbol: '🪨' },
      { name: 'Pangu', domain: 'Creator who separated heaven and earth', symbol: '🌍' },
      { name: 'Dragon Kings', domain: 'Rulers of the four seas, weather', symbol: '🐉' },
      { name: 'Guanyin', domain: 'Mercy, compassion (from Buddhist bodhisattva)', symbol: '🪷' },
      { name: 'Sun Wukong', domain: 'The Monkey King, trickster, strength', symbol: '🐒' },
    ],
    creationMyth:
      'Pangu was born inside a cosmic egg. He grew for 18,000 years, then cracked the egg open — the light half rose to become heaven, the dark half sank to become earth. Pangu held them apart as he grew taller. When he died, his breath became wind, his voice thunder, his eyes the sun and moon, his body the mountains and rivers. Later, the goddess Nü Wa created humans from yellow clay.',
    keyMyths: [
      {
        title: 'Nü Wa Repairs the Sky',
        type: 'Creation',
        summary:
          'When the fire god Zhurong and water god Gonggong fought, Gonggong smashed his head against Mount Buzhou (a pillar of heaven), tearing a hole in the sky. Floods and fires devastated the world. Nü Wa melted five-colored stones to patch the sky and cut off a giant turtle\'s legs to replace the broken pillar.',
        significance: 'A powerful female creator myth — Nü Wa is one of the most prominent creator goddesses in any mythology. The myth also explains why the sky tilts northwest and rivers flow southeast.',
      },
      {
        title: 'The Four Dragons (Origin of Rivers)',
        type: 'Nature',
        summary:
          'Four dragons — Long, Yellow, Black, and Pearl — begged the Jade Emperor for rain during a terrible drought. When he ignored them, they scooped up seawater and sprayed it as rain. Furious, the Emperor imprisoned them under mountains, where they became China\'s four great rivers: the Yangtze, Yellow, Heilongjiang, and Pearl.',
        significance: 'Explains China\'s geography through divine sacrifice. Dragons in Chinese mythology are benevolent water spirits — the opposite of their fearsome European counterparts.',
      },
      {
        title: 'Journey to the West',
        type: 'Epic',
        summary:
          'The Monkey King Sun Wukong, born from a stone, gained incredible powers but rebelled against Heaven. After 500 years imprisoned under a mountain, he escorted the monk Xuanzang to India to retrieve Buddhist scriptures, fighting demons along the way.',
        significance: 'One of the "Four Great Classical Novels" of Chinese literature. A Taoist-Buddhist synthesis story that remains wildly popular across East Asia.',
      },
    ],
    historicalRole:
      'Chinese mythology underpinned the "Mandate of Heaven" — the idea that rulers governed by divine permission, which could be revoked. Dragon symbolism pervaded imperial culture (the emperor\'s throne was the Dragon Throne). Ancestor worship, Taoist immortals, and Buddhist bodhisattvas all merged into a syncretic folk religion practiced for millennia.',
    slug: 'shang-dynasty-china',
  },
  {
    culture: 'Aztec',
    emoji: '🪶',
    era: '~1300 – 1521 CE',
    region: 'Mesoamerica / Central Mexico',
    color: CULTURE_COLORS.Aztec,
    introduction:
      'Aztec mythology was dominated by cosmic debt — the gods had sacrificed themselves to create the world, and humans owed them blood in return. This theological framework produced one of history\'s most elaborate (and to outsiders, disturbing) sacrificial systems.',
    pantheon: [
      { name: 'Quetzalcoatl', domain: 'Feathered Serpent, wind, learning, priesthood', symbol: '🐍' },
      { name: 'Huitzilopochtli', domain: 'Sun, war, human sacrifice', symbol: '☀️' },
      { name: 'Tlaloc', domain: 'Rain, fertility, water', symbol: '🌧️' },
      { name: 'Coatlicue', domain: 'Earth mother, life and death', symbol: '🌍' },
      { name: 'Tezcatlipoca', domain: 'Night sky, conflict, sorcery', symbol: '🌑' },
      { name: 'Xipe Totec', domain: 'Agriculture, renewal, spring', symbol: '🌱' },
    ],
    creationMyth:
      'The Aztecs believed in Five Suns — five successive worlds, each destroyed by catastrophe. The first four suns ended in jaguars, hurricanes, fire, and flood. The current Fifth Sun was created when the god Nanahuatzin threw himself into a cosmic bonfire at Teotihuacan, becoming the sun. But he wouldn\'t move without blood sacrifice — thus, the gods demanded human hearts to keep the sun in motion.',
    keyMyths: [
      {
        title: 'The Five Suns (Creation Cycle)',
        type: 'Creation',
        summary:
          'Each previous world was ruled by a different god and destroyed by a different element. Humanity was created and destroyed four times before the current age. The Fifth Sun required constant blood sacrifice to prevent the next apocalypse.',
        significance: 'This cyclical destruction myth justified human sacrifice as cosmic necessity — without it, the sun would stop and the world would end. It made sacrifice a civic duty, not cruelty.',
      },
      {
        title: 'Quetzalcoatl\'s Exile',
        type: 'Hero',
        summary:
          'The Feathered Serpent god-king was tricked by Tezcatlipoca into drunkenness and disgrace. He burned himself on a pyre and was reborn as the Morning Star, promising to return from the east. When Cortés arrived from the east in 1519, some accounts suggest Moctezuma may have initially associated him with this prophecy.',
        significance: 'One of the most consequential myths in history — whether or not Moctezuma truly believed Cortés was Quetzalcoatl, the legend became central to the narrative of Spanish conquest.',
      },
    ],
    historicalRole:
      'Aztec mythology was the engine of empire. The need for sacrificial victims drove constant warfare (the "Flower Wars"). Temples were cosmic mountains connecting heaven and earth. The calendar was mythological — each day was governed by a different deity. The destruction of this mythological system by Spanish missionaries was one of the greatest cultural losses in human history.',
    slug: 'aztec-empire',
  },
  {
    culture: 'Celtic',
    emoji: '🍀',
    era: '~500 BCE – 400 CE',
    region: 'British Isles / Western Europe',
    color: CULTURE_COLORS.Celtic,
    introduction:
      'Celtic mythology survives in fragments — the Celts passed their lore orally through Druids, and most written records come from Christian monks who preserved (and altered) the stories. What survives reveals a mythology deeply connected to landscape, seasonality, and the thin boundary between the natural and supernatural worlds.',
    pantheon: [
      { name: 'The Dagda', domain: 'Chief god, abundance, wisdom, magic', symbol: '🏺' },
      { name: 'Brigid', domain: 'Poetry, healing, smithcraft, spring', symbol: '🔥' },
      { name: 'Lugh', domain: 'Light, skill, crafts, harvest', symbol: '☀️' },
      { name: 'The Morrígan', domain: 'War, fate, death, sovereignty', symbol: '🐦‍⬛' },
      { name: 'Manannán mac Lir', domain: 'Sea, otherworld, mist', symbol: '🌊' },
      { name: 'Cernunnos', domain: 'Animals, fertility, nature, wealth', symbol: '🦌' },
    ],
    creationMyth:
      'The Celtic creation myth is largely lost. What survives in Irish tradition tells of successive invasions of Ireland — the Fomorians (chaos beings), the Fir Bolg, and finally the Tuatha Dé Danann (the gods themselves), who arrived in Ireland on clouds of mist. They defeated the Fomorians at the Battle of Mag Tuired, then were themselves displaced underground by the Milesians (humans), becoming the fairy folk (Aos Sí) living in hollow hills.',
    keyMyths: [
      {
        title: 'Cú Chulainn — The Hound of Ulster',
        type: 'Hero',
        summary:
          'The greatest Irish warrior, who gained his name after killing a guard dog and offering to take its place. He single-handedly defended Ulster during the Táin Bó Cúailnge (Cattle Raid of Cooley), fighting in a battle frenzy (ríastrad) that transformed his body. He died young, tied to a standing stone so he could face his enemies on his feet.',
        significance: 'The Irish Achilles — a hero whose greatness and tragedy are inseparable. His story embodies Celtic values of honor, loyalty, and the warrior\'s acceptance of an early death.',
      },
      {
        title: 'Fionn mac Cumhaill and the Salmon of Knowledge',
        type: 'Hero',
        summary:
          'Young Fionn was apprenticed to a druid who spent years catching the Salmon of Knowledge. When Fionn cooked the fish and accidentally burned his thumb on it, he sucked the burn and gained all the world\'s wisdom. He went on to lead the Fianna, Ireland\'s legendary warrior band.',
        significance: 'Wisdom gained by accident rather than quest — a distinctly Celtic theme. Fionn (Finn) became one of the most popular figures in Irish and Scottish folklore.',
      },
    ],
    historicalRole:
      'Celtic myths structured the calendar — Samhain (Halloween), Imbolc, Beltane, and Lughnasadh divided the year. Druids were the keepers of mythology and law, memorizing vast amounts of lore over 20 years of training. Sacred groves and natural features (rivers, wells, hills) were considered gateways to the Otherworld.',
    slug: 'celtic-civilization',
  },
  {
    culture: 'Japanese',
    emoji: '⛩️',
    era: '~300 BCE – present',
    region: 'Japanese Archipelago',
    color: CULTURE_COLORS.Japanese,
    introduction:
      'Japanese mythology, recorded in the Kojiki (712 CE) and Nihon Shoki (720 CE), is the foundation of Shinto — the indigenous religion of Japan. Its central concept is kami: divine spirits dwelling in all things — mountains, rivers, trees, ancestors, and even remarkable people.',
    pantheon: [
      { name: 'Amaterasu', domain: 'Sun goddess, ruler of heaven, ancestor of emperors', symbol: '☀️' },
      { name: 'Susanoo', domain: 'Storms, sea, wild nature', symbol: '🌊' },
      { name: 'Tsukuyomi', domain: 'Moon, night', symbol: '🌙' },
      { name: 'Izanagi', domain: 'Creation, sky father', symbol: '🌅' },
      { name: 'Izanami', domain: 'Creation, death (after dying in childbirth)', symbol: '🌑' },
      { name: 'Inari', domain: 'Rice, foxes, prosperity, industry', symbol: '🦊' },
    ],
    creationMyth:
      'The divine couple Izanagi and Izanami stood on the Floating Bridge of Heaven and stirred the primordial ocean with a jeweled spear. The brine that dripped from the spear formed the first island. They descended and created the Japanese islands, then gave birth to the gods. When Izanami died giving birth to the fire god, Izanagi traveled to the underworld (Yomi) to retrieve her — but found her rotting and fled in horror, sealing the passage between life and death.',
    keyMyths: [
      {
        title: 'Amaterasu and the Cave',
        type: 'Divine',
        summary:
          'When Susanoo\'s violent behavior frightened Amaterasu, she hid in a cave, plunging the world into darkness. The other gods devised a plan — the goddess Ame-no-Uzume performed a bawdy dance that made the gods laugh so loudly that Amaterasu peeked out. They held up a mirror, and enchanted by her own radiance, she emerged — restoring sunlight.',
        significance: 'This myth explains solar eclipses and establishes the sacred mirror (Yata no Kagami) as one of Japan\'s three Imperial Regalia. Amaterasu\'s ancestry connects the Emperor to the sun.',
      },
      {
        title: 'Susanoo Slays the Eight-Headed Serpent',
        type: 'Hero',
        summary:
          'Banished from heaven, Susanoo encountered an old couple weeping because they had to sacrifice their last daughter to the eight-headed serpent Yamata no Orochi. Susanoo got the serpent drunk on sake and slew it, finding the legendary sword Kusanagi in its tail.',
        significance: 'Kusanagi became another of the three Imperial Regalia. The myth establishes the pattern of divine heroes protecting the vulnerable — central to Japanese heroic narratives.',
      },
      {
        title: 'The Concept of Kami',
        type: 'Nature',
        summary:
          'Kami are not gods in the Western sense but sacred spirits or forces dwelling in remarkable things — an ancient tree, a waterfall, a mountain, a skilled artisan, an ancestor. There are said to be eight million kami (yaoyorozu no kami), a number meaning "countless."',
        significance: 'Shinto\'s animistic worldview — that the divine permeates all nature — shaped Japanese aesthetics, architecture, and environmental attitudes. Every shrine marks a place where kami are felt.',
      },
    ],
    historicalRole:
      'Japanese mythology directly legitimized imperial rule — the Emperor was descended from Amaterasu. Shinto shrines mark sacred landscape features. The mythology blended with Buddhism (arriving in the 6th century CE) to create a syncretic tradition where kami and Buddha were seen as different manifestations of the same spiritual reality.',
    slug: 'classical-japan',
  },
  {
    culture: 'Roman',
    emoji: '🏛️',
    era: '~753 BCE – 476 CE',
    region: 'Mediterranean / Southern Europe',
    color: CULTURE_COLORS.Roman,
    introduction:
      'Roman mythology began as native Italic traditions but was profoundly reshaped by contact with Greek culture. The Romans adopted Greek gods wholesale, renaming them, and added their own foundation myths — most importantly, the story of Romulus and Remus that gave Rome its name and its self-image as a civilization founded on fratricide.',
    pantheon: [
      { name: 'Jupiter', domain: 'King of gods, sky, thunder (= Zeus)', symbol: '⚡' },
      { name: 'Mars', domain: 'War, agriculture, father of Romulus (= Ares)', symbol: '⚔️' },
      { name: 'Mercury', domain: 'Trade, messages, travelers (= Hermes)', symbol: '🪽' },
      { name: 'Venus', domain: 'Love, beauty, ancestor of Rome (= Aphrodite)', symbol: '🌹' },
      { name: 'Neptune', domain: 'Sea, earthquakes (= Poseidon)', symbol: '🔱' },
      { name: 'Minerva', domain: 'Wisdom, strategy, crafts (= Athena)', symbol: '🦉' },
      { name: 'Janus', domain: 'Beginnings, endings, doorways, time (uniquely Roman)', symbol: '🚪' },
    ],
    creationMyth:
      'Rome\'s true creation myth was historical: Romulus and Remus, twin sons of Mars and a mortal priestess, were abandoned on the Tiber and suckled by a she-wolf. They founded a city, but quarreled over its location. Romulus killed Remus, named the city Rome, and became its first king. This founding murder was not hidden but celebrated — Rome was born from strength, ambition, and the willingness to sacrifice even family for destiny.',
    keyMyths: [
      {
        title: 'The Aeneid — Rome\'s Foundation Epic',
        type: 'Epic',
        summary:
          'Virgil\'s epic (19 BCE) traces the Trojan hero Aeneas from the fall of Troy to Italy, where his descendants would found Rome. Commissioned by Augustus, it gave Rome a mythical pedigree connecting it to Troy and to Venus (Aeneas\'s divine mother).',
        significance: 'Political mythology at its finest — the Aeneid legitimized Augustus\'s rule and Rome\'s imperial mission. It positioned Rome as the inheritor of Trojan and Greek civilization.',
      },
      {
        title: 'Romulus and Remus',
        type: 'Hero',
        summary:
          'Twin brothers suckled by a she-wolf, who grew up to found Rome. When they disagreed about where to build the city, Romulus killed Remus and became the first king. He then populated Rome by abducting women from the neighboring Sabine tribe.',
        significance: 'Rome\'s willingness to make its foundation myth a story of fratricide and abduction reveals much about Roman self-image: power justified itself, and the state mattered more than individual morality.',
      },
    ],
    historicalRole:
      'Roman mythology served the state. The emperor cult deified rulers after death (and sometimes before). Roman gods mapped onto Greek ones, making cultural absorption easier across the empire. When Christianity replaced polytheism, it inherited Roman organizational structures — the Pope\'s title "Pontifex Maximus" was originally the chief priest of Roman religion.',
    slug: 'roman-republic',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Cross-Cultural Comparisons
// ─────────────────────────────────────────────────────────────────────────────

interface CrossCulturalTheme {
  theme: string;
  description: string;
  examples: { culture: string; myth: string; detail: string }[];
}

const CROSS_CULTURAL_THEMES: CrossCulturalTheme[] = [
  {
    theme: 'The Great Flood',
    description:
      'Over 200 cultures worldwide have flood myths — an extraordinary convergence that may reflect ancestral memories of post-Ice Age sea level rise or catastrophic regional floods.',
    examples: [
      { culture: 'Mesopotamian', myth: 'Utnapishtim (Epic of Gilgamesh)', detail: 'Gods sent a flood to destroy noisy humans. Enki warned Utnapishtim to build a boat. He saved his family and animals. Written ~2100 BCE — predating Noah by at least 500 years.' },
      { culture: 'Hebrew', myth: 'Noah\'s Ark (Genesis)', detail: 'God flooded the earth for human wickedness. Noah, a righteous man, was told to build an ark. Almost certainly derived from the earlier Mesopotamian version.' },
      { culture: 'Hindu', myth: 'Matsya (Fish Avatar of Vishnu)', detail: 'Vishnu appeared as a fish to warn Manu of a coming flood. Manu built a boat, tied it to the fish, and repopulated the earth.' },
      { culture: 'Greek', myth: 'Deucalion and Pyrrha', detail: 'Zeus flooded the world to destroy the Bronze Age humans. Deucalion and Pyrrha survived in a chest and repopulated earth by throwing stones ("bones of the earth") over their shoulders.' },
      { culture: 'Chinese', myth: 'Gun-Yu (Great Flood)', detail: 'Gun stole magic soil from heaven to dam the floods. When he failed, his son Yu spent 13 years taming the waters by digging channels — becoming the founder of the Xia dynasty.' },
      { culture: 'Aztec', myth: 'Fourth Sun Destruction', detail: 'The Fourth Sun ended in a catastrophic flood that lasted 52 years. Only one couple survived by hiding in a hollow log.' },
    ],
  },
  {
    theme: 'Creation from Chaos or Void',
    description:
      'Nearly every mythology begins with nothingness or formless chaos from which order emerges — reflecting humanity\'s universal need to explain existence from non-existence.',
    examples: [
      { culture: 'Greek', myth: 'Chaos', detail: 'The universe began as a yawning void (Chaos), from which Earth, Darkness, and Love spontaneously emerged.' },
      { culture: 'Norse', myth: 'Ginnungagap', detail: 'The "yawning void" between fire (Muspelheim) and ice (Niflheim), where the first being formed from melting ice.' },
      { culture: 'Egyptian', myth: 'Nu', detail: 'Infinite dark primordial waters existed before everything. The first god willed himself into existence from these waters.' },
      { culture: 'Chinese', myth: 'The Cosmic Egg', detail: 'Before creation, the universe was a formless egg of chaos. Pangu grew inside for 18,000 years before breaking it open.' },
      { culture: 'Hindu', myth: 'The Cosmic Ocean', detail: 'Before each cycle of creation, Vishnu sleeps on infinite waters. The universe emerges from his dream.' },
    ],
  },
  {
    theme: 'The Trickster God',
    description:
      'Every mythology has a boundary-crosser — a figure who breaks rules, defies authority, and creates through destruction. Tricksters are agents of change in static systems.',
    examples: [
      { culture: 'Norse', myth: 'Loki', detail: 'Shape-shifter who alternately helps and harms the gods. Fathered monsters, caused Balder\'s death, and will lead the enemies of the gods at Ragnarök.' },
      { culture: 'Greek', myth: 'Hermes / Prometheus', detail: 'Hermes stole Apollo\'s cattle as a newborn. Prometheus stole fire from the gods for humanity — the most consequential trickster act in Western mythology.' },
      { culture: 'Chinese', myth: 'Sun Wukong (Monkey King)', detail: 'Stole the peaches of immortality, defied the Jade Emperor, and required the Buddha himself to imprison him under a mountain.' },
      { culture: 'West African', myth: 'Anansi the Spider', detail: 'Tricked the Sky God into giving him all the world\'s stories. Anansi tales traveled to the Caribbean and Americas through the enslaved African diaspora.' },
      { culture: 'Native American', myth: 'Coyote / Raven', detail: 'Across dozens of traditions, Coyote or Raven steals fire, creates death, and shapes the world through cunning rather than power.' },
    ],
  },
  {
    theme: 'Descent to the Underworld',
    description:
      'Heroes and gods journey to the land of the dead and return changed — a mythic pattern reflecting humanity\'s attempt to confront and transcend mortality.',
    examples: [
      { culture: 'Greek', myth: 'Orpheus', detail: 'Descended to Hades to rescue his wife Eurydice. His music charmed death itself, but he lost her by looking back.' },
      { culture: 'Mesopotamian', myth: 'Inanna', detail: 'The goddess descended through seven gates, was stripped and killed, then resurrected — but had to send her lover as a substitute.' },
      { culture: 'Japanese', myth: 'Izanagi', detail: 'Traveled to Yomi (the underworld) to retrieve his dead wife Izanami, but found her rotting and fled in horror.' },
      { culture: 'Egyptian', myth: 'Journey through the Duat', detail: 'Every dead soul traveled through the underworld, facing tests and monsters, before the final judgment of the heart.' },
      { culture: 'Hindu', myth: 'Savitri and Satyavan', detail: 'Savitri followed Yama (Death) and argued so brilliantly that he restored her husband\'s life — one of the few mortals to outwit Death through intellect.' },
    ],
  },
  {
    theme: 'The World Tree / Cosmic Axis',
    description:
      'Many cultures imagine the universe structured around a central axis — a tree, mountain, or pillar connecting the realms of gods, humans, and the dead.',
    examples: [
      { culture: 'Norse', myth: 'Yggdrasil', detail: 'The great ash tree connecting nine realms. An eagle sits atop, a serpent gnaws its roots, and a squirrel carries insults between them.' },
      { culture: 'Hindu', myth: 'Mount Meru', detail: 'The cosmic mountain at the center of the universe, around which the sun and stars revolve. Home of the gods.' },
      { culture: 'Mesoamerican', myth: 'Ceiba Tree', detail: 'The Maya cosmic tree whose roots reached the underworld (Xibalba), trunk stood in the mortal world, and branches held up the heavens.' },
      { culture: 'Chinese', myth: 'Mount Kunlun', detail: 'The mythical mountain where the Queen Mother of the West tends the peaches of immortality, connecting earth to heaven.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Greek-Roman Comparison
// ─────────────────────────────────────────────────────────────────────────────

const GREEK_ROMAN_PAIRS: { greek: string; roman: string; domain: string }[] = [
  { greek: 'Zeus', roman: 'Jupiter', domain: 'King of gods, sky' },
  { greek: 'Hera', roman: 'Juno', domain: 'Marriage, women' },
  { greek: 'Poseidon', roman: 'Neptune', domain: 'Sea' },
  { greek: 'Ares', roman: 'Mars', domain: 'War' },
  { greek: 'Athena', roman: 'Minerva', domain: 'Wisdom' },
  { greek: 'Aphrodite', roman: 'Venus', domain: 'Love' },
  { greek: 'Hermes', roman: 'Mercury', domain: 'Messengers' },
  { greek: 'Apollo', roman: 'Apollo', domain: 'Sun, music (kept Greek name)' },
  { greek: 'Artemis', roman: 'Diana', domain: 'Hunt, moon' },
  { greek: 'Hephaestus', roman: 'Vulcan', domain: 'Forge, fire' },
  { greek: 'Demeter', roman: 'Ceres', domain: 'Harvest' },
  { greek: 'Dionysus', roman: 'Bacchus', domain: 'Wine' },
  { greek: 'Hades', roman: 'Pluto', domain: 'Underworld' },
  { greek: 'Kronos', roman: 'Saturn', domain: 'Time, Titan king' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Deity Quiz
// ─────────────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'A crisis strikes. What\'s your first instinct?',
    answers: [
      { text: 'Analyze the situation and form a strategy', scores: { Greek: 3, Roman: 2 } },
      { text: 'Fight head-on, no hesitation', scores: { Norse: 3, Aztec: 2 } },
      { text: 'Find a clever workaround nobody else sees', scores: { Chinese: 3, Celtic: 2 } },
      { text: 'Meditate on the deeper meaning of the crisis', scores: { Hindu: 3, Japanese: 2 } },
    ],
  },
  {
    question: 'What matters most to you?',
    answers: [
      { text: 'Knowledge and understanding how things work', scores: { Egyptian: 3, Mesopotamian: 2 } },
      { text: 'Honor, glory, and being remembered', scores: { Norse: 3, Greek: 2 } },
      { text: 'Harmony with the natural world', scores: { Japanese: 3, Celtic: 2 } },
      { text: 'Duty to family and community', scores: { Hindu: 3, Chinese: 2 } },
    ],
  },
  {
    question: 'Your ideal afterlife looks like:',
    answers: [
      { text: 'An eternal feast with heroes', scores: { Norse: 3, Celtic: 2 } },
      { text: 'Peaceful fields where nothing bad can happen', scores: { Greek: 2, Egyptian: 3 } },
      { text: 'Rebirth into a new life based on your deeds', scores: { Hindu: 3, Japanese: 1 } },
      { text: 'Becoming one with the cosmos', scores: { Chinese: 3, Aztec: 2 } },
    ],
  },
  {
    question: 'Pick a natural element that speaks to you:',
    answers: [
      { text: 'Thunder and lightning', scores: { Norse: 3, Greek: 2 } },
      { text: 'A flowing river', scores: { Egyptian: 3, Chinese: 2 } },
      { text: 'A dense, ancient forest', scores: { Celtic: 3, Japanese: 2 } },
      { text: 'Fire — beautiful and dangerous', scores: { Aztec: 3, Hindu: 2 } },
    ],
  },
  {
    question: 'Which kind of story resonates most?',
    answers: [
      { text: 'A hero on an impossible quest', scores: { Greek: 3, Norse: 1 } },
      { text: 'A trickster outwitting the powerful', scores: { Chinese: 3, Norse: 2 } },
      { text: 'A love story that transcends death', scores: { Hindu: 3, Egyptian: 2 } },
      { text: 'A warrior\'s last stand against impossible odds', scores: { Norse: 2, Aztec: 3 } },
    ],
  },
];

interface QuizResult {
  culture: Culture;
  deity: string;
  description: string;
}

const QUIZ_RESULTS: Record<Culture, QuizResult> = {
  Greek: { culture: 'Greek', deity: 'Athena', description: 'You think before you act, value strategy over brute force, and believe wisdom is the highest virtue. Like Athena, you\'re the one people turn to when they need a plan.' },
  Norse: { culture: 'Norse', deity: 'Thor', description: 'You face problems head-on with courage and strength. You protect those you care about fiercely and believe in standing your ground no matter the odds.' },
  Egyptian: { culture: 'Egyptian', deity: 'Thoth', description: 'You\'re drawn to knowledge, writing, and understanding the hidden order beneath the surface. Like Thoth, you\'re the scribe of truths others miss.' },
  Mesopotamian: { culture: 'Mesopotamian', deity: 'Enki', description: 'You combine wisdom with creativity — you solve problems not by force but by invention. Like Enki, you\'re the one who finds a way when others see only walls.' },
  Hindu: { culture: 'Hindu', deity: 'Krishna', description: 'You balance duty with compassion, and you see the cosmic perspective behind everyday struggles. Like Krishna, you guide others through their darkest moments with wisdom and love.' },
  Chinese: { culture: 'Chinese', deity: 'Sun Wukong', description: 'You\'re irrepressible — clever, defiant, and endlessly resourceful. You challenge authority not out of malice but because you see through its pretensions.' },
  Aztec: { culture: 'Aztec', deity: 'Quetzalcoatl', description: 'You understand that creation requires sacrifice, and you\'re willing to give yourself to a cause greater than yourself. You carry the weight of the world and the wind of change.' },
  Celtic: { culture: 'Celtic', deity: 'Brigid', description: 'You\'re creative, healing, and deeply connected to the rhythms of nature. Like Brigid, you bring light to dark places through art, craft, and compassion.' },
  Japanese: { culture: 'Japanese', deity: 'Amaterasu', description: 'Your warmth and radiance draw others out of darkness. You lead not through force but through presence — when you withdraw, the world notices.' },
  Roman: { culture: 'Roman', deity: 'Minerva', description: 'You value order, strategy, and the practical application of wisdom. Like Minerva, you build systems that last and defend what you\'ve built with intelligence.' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-Components
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
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.12)'}`,
        backgroundColor: active ? `${color}22` : 'transparent',
        color: active ? color : '#94a3b8',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        transition: 'all 0.2s',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

function DeityCard({ deity, color }: { deity: Deity; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {deity.symbol && <span style={{ fontSize: 18 }}>{deity.symbol}</span>}
      <div>
        <div style={{ color: color, fontWeight: 600, fontSize: 14 }}>{deity.name}</div>
        <div style={{ color: '#94a3b8', fontSize: 12 }}>{deity.domain}</div>
      </div>
    </div>
  );
}

function MythCard({ myth, index }: { myth: Myth; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const typeColor = MYTH_TYPE_COLORS[myth.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 10,
            backgroundColor: `${typeColor}22`,
            color: typeColor,
            fontWeight: 600,
          }}
        >
          {myth.type}
        </span>
        <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{myth.title}</span>
      </div>
      <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{myth.summary}</p>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                color: '#cbd5e1',
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                fontStyle: 'italic',
              }}
            >
              {myth.significance}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>
        {expanded ? 'Click to collapse' : 'Click to read significance →'}
      </div>
    </motion.div>
  );
}

function TraditionSection({ tradition, index }: { tradition: MythTradition; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        backgroundColor: '#1a1f3a',
        borderRadius: 14,
        padding: 28,
        border: `1px solid ${tradition.color}33`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{tradition.emoji}</span>
        <div>
          <h2 style={{ margin: 0, color: tradition.color, fontSize: 22, fontWeight: 700 }}>
            {tradition.culture} Mythology
          </h2>
          <div style={{ color: '#64748b', fontSize: 13 }}>
            {tradition.era} · {tradition.region}
          </div>
        </div>
      </div>

      {/* Introduction */}
      <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
        {tradition.introduction}
      </p>

      {/* Pantheon */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
          Pantheon
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 8,
          }}
        >
          {tradition.pantheon.map((deity) => (
            <DeityCard key={deity.name} deity={deity} color={tradition.color} />
          ))}
        </div>
      </div>

      {/* Creation Myth */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Creation Myth
        </h3>
        <p
          style={{
            color: '#94a3b8',
            fontSize: 13,
            lineHeight: 1.7,
            margin: 0,
            padding: 14,
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: 8,
            borderLeft: `3px solid ${tradition.color}44`,
          }}
        >
          {tradition.creationMyth}
        </p>
      </div>

      {/* Key Myths */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
          Key Myths
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tradition.keyMyths.map((myth, i) => (
            <MythCard key={myth.title} myth={myth} index={i} />
          ))}
        </div>
      </div>

      {/* Historical Role */}
      <div style={{ marginBottom: tradition.slug ? 16 : 0 }}>
        <h3 style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
          Historical Role
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
          {tradition.historicalRole}
        </p>
      </div>

      {/* Chronicle Link */}
      {tradition.slug && (
        <Link
          to={`/?q=${encodeURIComponent(tradition.culture + ' mythology')}`}
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            borderRadius: 8,
            backgroundColor: `${tradition.color}18`,
            color: tradition.color,
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            border: `1px solid ${tradition.color}33`,
            transition: 'all 0.2s',
          }}
        >
          Find historical events linked to {tradition.culture} myths →
        </Link>
      )}
    </motion.div>
  );
}

function ComparisonSection() {
  const [selectedTheme, setSelectedTheme] = useState(0);
  const theme = CROSS_CULTURAL_THEMES[selectedTheme];

  return (
    <div>
      {/* Theme selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {CROSS_CULTURAL_THEMES.map((t, i) => (
          <FilterPill
            key={t.theme}
            label={t.theme}
            active={i === selectedTheme}
            color="#a855f7"
            onClick={() => setSelectedTheme(i)}
          />
        ))}
      </div>

      {/* Selected theme */}
      <motion.div
        key={theme.theme}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: '#1a1f3a',
          borderRadius: 14,
          padding: 24,
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 32,
        }}
      >
        <h3 style={{ color: '#a855f7', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          {theme.theme}
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          {theme.description}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {theme.examples.map((ex, i) => (
            <motion.div
              key={ex.culture + ex.myth}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              style={{
                padding: 14,
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 10,
                    backgroundColor: 'rgba(168,85,247,0.15)',
                    color: '#a855f7',
                    fontWeight: 600,
                  }}
                >
                  {ex.culture}
                </span>
                <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{ex.myth}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ex.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Greek-Roman Comparison */}
      <div
        style={{
          backgroundColor: '#1a1f3a',
          borderRadius: 14,
          padding: 24,
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <h3 style={{ color: '#f97316', fontSize: 20, fontWeight: 700, marginTop: 0, marginBottom: 8 }}>
          Greek → Roman: Same Gods, Different Names
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          When Rome conquered Greece, they adopted Greek gods wholesale — renaming them but keeping their stories largely intact. This is one of the clearest examples of mythological syncretism in history.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 8,
          }}
        >
          {GREEK_ROMAN_PAIRS.map((pair) => (
            <div
              key={pair.greek}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 13,
              }}
            >
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>{pair.greek}</span>
              <span style={{ color: '#64748b' }}>→</span>
              <span style={{ color: '#f97316', fontWeight: 600 }}>{pair.roman}</span>
              <span style={{ color: '#64748b', fontSize: 11 }}>{pair.domain}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleAnswer = useCallback(
    (answerScores: Partial<Record<Culture, number>>) => {
      const newScores = { ...scores };
      for (const [culture, pts] of Object.entries(answerScores)) {
        newScores[culture] = (newScores[culture] || 0) + (pts || 0);
      }

      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setScores(newScores);
        setCurrentQ(currentQ + 1);
      } else {
        // Find winner
        let best: Culture = 'Greek';
        let bestScore = 0;
        for (const [culture, score] of Object.entries(newScores)) {
          if (score > bestScore) {
            bestScore = score;
            best = culture as Culture;
          }
        }
        setResult(QUIZ_RESULTS[best]);
      }
    },
    [currentQ, scores],
  );

  const resetQuiz = useCallback(() => {
    setCurrentQ(0);
    setScores({});
    setResult(null);
  }, []);

  if (result) {
    const color = CULTURE_COLORS[result.culture];
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: '#1a1f3a',
          borderRadius: 14,
          padding: 32,
          border: `1px solid ${color}44`,
          textAlign: 'center',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {TRADITIONS.find((t) => t.culture === result.culture)?.emoji}
        </div>
        <h3 style={{ color, fontSize: 24, fontWeight: 700, marginTop: 0, marginBottom: 4 }}>
          {result.deity}
        </h3>
        <div style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>
          {result.culture} Mythology
        </div>
        <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          {result.description}
        </p>
        <button
          onClick={resetQuiz}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: `1px solid ${color}44`,
            backgroundColor: `${color}18`,
            color,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Take again
        </button>
      </motion.div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: i <= currentQ ? '#a855f7' : 'rgba(255,255,255,0.08)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
          {q.question}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.answers.map((a, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(a.scores)}
              style={{
                padding: '14px 18px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.03)',
                color: '#f1f5f9',
                cursor: 'pointer',
                fontSize: 14,
                textAlign: 'left',
                transition: 'all 0.2s',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(168,85,247,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
              }}
            >
              {a.text}
            </button>
          ))}
        </div>
      </motion.div>

      <div style={{ color: '#64748b', fontSize: 12, marginTop: 16, textAlign: 'center' }}>
        Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MythsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('traditions');
  const [selectedCultures, setSelectedCultures] = useState<Set<Culture>>(new Set());

  const toggleCulture = useCallback((culture: Culture) => {
    setSelectedCultures((prev) => {
      const next = new Set(prev);
      if (next.has(culture)) {
        next.delete(culture);
      } else {
        next.add(culture);
      }
      return next;
    });
  }, []);

  const filteredTraditions = useMemo(() => {
    if (selectedCultures.size === 0) return TRADITIONS;
    return TRADITIONS.filter((t) => selectedCultures.has(t.culture));
  }, [selectedCultures]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'traditions', label: 'Mythological Traditions' },
    { key: 'compare', label: 'Cross-Cultural Comparison' },
    { key: 'quiz', label: 'Which Deity Are You?' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navigation */}
      <div
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}
        >
          ← Back to Timeline
        </Link>
      </div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '52px 24px 36px',
          maxWidth: 740,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            margin: '0 0 12px',
            background: 'linear-gradient(135deg, #a855f7, #3b82f6, #f59e0b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
          }}
        >
          Stories That Built Civilizations — World Mythology
        </h1>
        <p style={{ color: '#94a3b8', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
          Every culture invented gods to explain the world. Here's what they invented.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          padding: '0 24px 24px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border:
                activeTab === tab.key
                  ? '1px solid rgba(168,85,247,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
              backgroundColor:
                activeTab === tab.key ? 'rgba(168,85,247,0.12)' : 'transparent',
              color: activeTab === tab.key ? '#a855f7' : '#94a3b8',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === tab.key ? 600 : 400,
              transition: 'all 0.2s',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 64px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'traditions' && (
            <motion.div
              key="traditions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Culture Filter */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {TRADITIONS.map((t) => (
                  <FilterPill
                    key={t.culture}
                    label={`${t.emoji} ${t.culture}`}
                    active={selectedCultures.has(t.culture)}
                    color={t.color}
                    onClick={() => toggleCulture(t.culture)}
                  />
                ))}
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: 20,
                  marginBottom: 28,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { label: 'Traditions', value: TRADITIONS.length },
                  {
                    label: 'Deities',
                    value: TRADITIONS.reduce((sum, t) => sum + t.pantheon.length, 0),
                  },
                  {
                    label: 'Myths Covered',
                    value: TRADITIONS.reduce((sum, t) => sum + t.keyMyths.length, 0),
                  },
                  { label: 'Years of History', value: '5,000+' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div style={{ color: '#a855f7', fontSize: 22, fontWeight: 700 }}>
                      {stat.value}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tradition Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {filteredTraditions.map((tradition, i) => (
                  <TraditionSection key={tradition.culture} tradition={tradition} index={i} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ComparisonSection />
            </motion.div>
          )}

          {activeTab === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                  Which Deity Are You?
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>
                  Answer 5 questions to discover which mythological deity matches your personality.
                </p>
              </div>
              <QuizSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
