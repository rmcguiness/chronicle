/**
 * AncientEgyptPage — curated topic page: Ancient Egypt deep-dive.
 *
 * Route: /ancient-egypt
 *
 * Sections:
 *  1. Hero — "Land of the Pharaohs — Ancient Egypt"
 *  2. Tab navigation — switch between sections
 *  3. Dynastic Eras — 6 major periods with date ranges & key events
 *  4. Notable Pharaohs — 20+ rulers with reign, dynasty & legacy
 *  5. Iconic Monuments — 8+ structures with date, location, purpose
 *  6. Religion & Deities — major gods with roles and symbols
 *  7. Innovations — hieroglyphics, papyrus, calendar, medicine, math, engineering
 *  8. Daily Life — social pyramid, diet, clothing, housing
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SectionTab = 'eras' | 'pharaohs' | 'monuments' | 'religion' | 'innovations' | 'daily-life';

interface DynasticEra {
  name: string;
  period: string;
  dynasties: string;
  capital: string;
  keyEvents: string[];
  summary: string;
  color: string;
  icon: string;
}

interface Pharaoh {
  name: string;
  reign: string;
  dynasty: string;
  era: string;
  legacy: string;
  icon: string;
}

interface Monument {
  name: string;
  date: string;
  location: string;
  purpose: string;
  description: string;
  color: string;
  icon: string;
}

interface Deity {
  name: string;
  role: string;
  symbols: string;
  description: string;
  color: string;
  icon: string;
}

interface Innovation {
  name: string;
  period: string;
  category: string;
  description: string;
  significance: string;
  color: string;
  icon: string;
}

interface SocialStratum {
  rank: number;
  title: string;
  description: string;
  color: string;
  widthPct: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — Dynastic Eras
// ─────────────────────────────────────────────────────────────────────────────

const DYNASTIC_ERAS: DynasticEra[] = [
  {
    name: 'Early Dynastic Period',
    period: 'c. 3150–2686 BCE',
    dynasties: '1st–2nd Dynasty',
    capital: 'Thinis, then Memphis',
    keyEvents: ['Unification of Upper & Lower Egypt by Narmer/Menes', 'Establishment of Memphis as capital', 'Development of hieroglyphic writing', 'First royal tombs at Abydos'],
    summary: 'The dawn of pharaonic civilization. Egypt was unified under a single ruler, the foundations of divine kingship were laid, and the first monumental architecture appeared at Saqqara and Abydos.',
    color: '#c2963a',
    icon: '𓂀',
  },
  {
    name: 'Old Kingdom',
    period: 'c. 2686–2181 BCE',
    dynasties: '3rd–6th Dynasty',
    capital: 'Memphis',
    keyEvents: ['Construction of the Step Pyramid at Saqqara (Djoser)', 'Great Pyramid of Giza built for Khufu', 'Great Sphinx carved at Giza', 'Pyramid Texts — earliest religious corpus', 'Collapse into the First Intermediate Period'],
    summary: 'The "Age of the Pyramids." Centralized royal power reached its zenith, enabling massive construction projects. Imhotep designed the first stone pyramid, and Khufu\'s Great Pyramid became the last surviving Wonder of the Ancient World.',
    color: '#eab308',
    icon: '𓇳',
  },
  {
    name: 'Middle Kingdom',
    period: 'c. 2055–1650 BCE',
    dynasties: '11th–13th Dynasty',
    capital: 'Thebes, then Itjtawy',
    keyEvents: ['Reunification by Mentuhotep II', 'Expansion into Nubia', 'Classical Egyptian literature flourished', 'Fayum irrigation projects', 'Rise of the cult of Osiris'],
    summary: 'Egypt\'s "Classical Age." After the chaos of the First Intermediate Period, strong pharaohs reunited the land. Literature, art, and religious thought reached new heights, and Egypt projected power into Nubia and the Levant.',
    color: '#22c55e',
    icon: '𓋴',
  },
  {
    name: 'New Kingdom',
    period: 'c. 1550–1070 BCE',
    dynasties: '18th–20th Dynasty',
    capital: 'Thebes (Luxor)',
    keyEvents: ['Expulsion of the Hyksos', 'Hatshepsut\'s reign as female pharaoh', 'Akhenaten\'s religious revolution (Atenism)', 'Tutankhamun\'s burial & later discovery', 'Ramesses II\'s campaigns and Abu Simbel', 'Battle of Kadesh against the Hittites', 'Valley of the Kings tombs'],
    summary: 'Egypt\'s imperial golden age. The New Kingdom produced the most famous pharaohs — Hatshepsut, Akhenaten, Tutankhamun, and Ramesses the Great. Egypt became an international superpower, built colossal temples, and established the world\'s first known peace treaty.',
    color: '#f59e0b',
    icon: '☀️',
  },
  {
    name: 'Late Period',
    period: 'c. 664–332 BCE',
    dynasties: '26th–31st Dynasty',
    capital: 'Sais, then Memphis',
    keyEvents: ['Saite Renaissance — revival of Old Kingdom styles', 'Persian conquest by Cambyses II (525 BCE)', 'Brief periods of Egyptian independence', 'Last native pharaoh Nectanebo II', 'Alexander the Great conquers Egypt (332 BCE)'],
    summary: 'A turbulent era of foreign domination and cultural resilience. Despite Persian rule, Egyptian culture experienced periodic revivals. The period ended when Alexander the Great conquered the land, ushering in the Hellenistic age.',
    color: '#ef4444',
    icon: '⚔️',
  },
  {
    name: 'Ptolemaic Period',
    period: '305–30 BCE',
    dynasties: 'Ptolemaic Dynasty',
    capital: 'Alexandria',
    keyEvents: ['Ptolemy I founds the dynasty', 'Library of Alexandria established', 'Rosetta Stone created (196 BCE)', 'Cleopatra VII\'s reign', 'Roman conquest after Battle of Actium (30 BCE)', 'End of pharaonic Egypt'],
    summary: 'Greek-speaking Macedonian rulers adopted Egyptian customs and built Alexandria into the ancient world\'s greatest intellectual center. Cleopatra VII, the last pharaoh, allied with Rome before Egypt became a Roman province.',
    color: '#a855f7',
    icon: '📜',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Pharaohs (20+)
// ─────────────────────────────────────────────────────────────────────────────

const PHARAOHS: Pharaoh[] = [
  { name: 'Narmer (Menes)', reign: 'c. 3150 BCE', dynasty: '1st', era: 'Early Dynastic Period', legacy: 'United Upper and Lower Egypt, founding the first dynasty and establishing Memphis as the capital.', icon: '👑' },
  { name: 'Djoser', reign: 'c. 2670–2650 BCE', dynasty: '3rd', era: 'Old Kingdom', legacy: 'Commissioned the Step Pyramid at Saqqara — the world\'s first monumental stone structure, designed by Imhotep.', icon: '🏛️' },
  { name: 'Sneferu', reign: 'c. 2613–2589 BCE', dynasty: '4th', era: 'Old Kingdom', legacy: 'Built three pyramids including the Red Pyramid, perfecting the true pyramid form and pioneering massive construction techniques.', icon: '📐' },
  { name: 'Khufu (Cheops)', reign: 'c. 2589–2566 BCE', dynasty: '4th', era: 'Old Kingdom', legacy: 'Built the Great Pyramid of Giza — the last surviving Wonder of the Ancient World and history\'s most iconic monument.', icon: '🔺' },
  { name: 'Khafre', reign: 'c. 2558–2532 BCE', dynasty: '4th', era: 'Old Kingdom', legacy: 'Built the second Giza pyramid and likely commissioned the Great Sphinx, establishing an enduring symbol of ancient Egypt.', icon: '🦁' },
  { name: 'Menkaure', reign: 'c. 2532–2503 BCE', dynasty: '4th', era: 'Old Kingdom', legacy: 'Built the smallest of the three Giza pyramids, remembered in later tradition as a just and pious ruler.', icon: '⭐' },
  { name: 'Pepi II', reign: 'c. 2278–2184 BCE', dynasty: '6th', era: 'Old Kingdom', legacy: 'Reigned for an estimated 90+ years — the longest reign in history — but his death triggered the Old Kingdom\'s collapse.', icon: '⏳' },
  { name: 'Mentuhotep II', reign: 'c. 2061–2010 BCE', dynasty: '11th', era: 'Middle Kingdom', legacy: 'Reunified Egypt after the chaos of the First Intermediate Period, founding the Middle Kingdom from Thebes.', icon: '🏔️' },
  { name: 'Senusret III', reign: 'c. 1878–1839 BCE', dynasty: '12th', era: 'Middle Kingdom', legacy: 'Expanded Egypt\'s southern frontier into Nubia with massive fortresses and reformed the bureaucracy to curb noble power.', icon: '🏰' },
  { name: 'Ahmose I', reign: 'c. 1550–1525 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'Expelled the Hyksos invaders and reunited Egypt, founding the glorious 18th Dynasty and launching the New Kingdom.', icon: '⚔️' },
  { name: 'Hatshepsut', reign: 'c. 1479–1458 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'One of the most successful female pharaohs, she expanded trade to Punt and built the stunning mortuary temple at Deir el-Bahari.', icon: '👸' },
  { name: 'Thutmose III', reign: 'c. 1458–1425 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'The "Napoleon of Egypt" who conducted 17 military campaigns, extending the empire to its greatest territorial extent.', icon: '🗡️' },
  { name: 'Amenhotep III', reign: 'c. 1388–1351 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'Presided over Egypt\'s peak of prosperity and artistic achievement, building the Colossi of Memnon and Luxor Temple additions.', icon: '🌟' },
  { name: 'Akhenaten', reign: 'c. 1353–1336 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'Launched history\'s first known monotheistic revolution, replacing the traditional gods with worship of the sun-disk Aten.', icon: '☀️' },
  { name: 'Tutankhamun', reign: 'c. 1334–1325 BCE', dynasty: '18th', era: 'New Kingdom', legacy: 'A minor pharaoh whose intact tomb discovery in 1922 became the most famous archaeological find in history.', icon: '🪙' },
  { name: 'Seti I', reign: 'c. 1294–1279 BCE', dynasty: '19th', era: 'New Kingdom', legacy: 'Restored Egyptian power after the Amarna period and built one of the finest temples at Abydos with exquisite reliefs.', icon: '🏛️' },
  { name: 'Ramesses II (the Great)', reign: 'c. 1279–1213 BCE', dynasty: '19th', era: 'New Kingdom', legacy: 'Egypt\'s most prolific builder and longest-reigning New Kingdom pharaoh, who fought at Kadesh and built Abu Simbel.', icon: '🏗️' },
  { name: 'Ramesses III', reign: 'c. 1186–1155 BCE', dynasty: '20th', era: 'New Kingdom', legacy: 'The last great warrior pharaoh, who defeated the Sea Peoples but faced economic decline and a harem conspiracy.', icon: '🛡️' },
  { name: 'Psamtik I', reign: '664–610 BCE', dynasty: '26th', era: 'Late Period', legacy: 'Reunified Egypt and ended Assyrian domination, launching the Saite Renaissance that revived Old Kingdom cultural traditions.', icon: '🔄' },
  { name: 'Nectanebo II', reign: '360–343 BCE', dynasty: '30th', era: 'Late Period', legacy: 'The last native-born pharaoh of Egypt, whose defeat by Persia ended over 3,000 years of indigenous rule.', icon: '🏚️' },
  { name: 'Ptolemy I Soter', reign: '305–282 BCE', dynasty: 'Ptolemaic', era: 'Ptolemaic Period', legacy: 'Alexander\'s general who founded the Ptolemaic dynasty and the legendary Library of Alexandria.', icon: '📚' },
  { name: 'Cleopatra VII', reign: '51–30 BCE', dynasty: 'Ptolemaic', era: 'Ptolemaic Period', legacy: 'The last pharaoh of Egypt — a brilliant polyglot diplomat whose alliances with Caesar and Antony shaped the Roman world.', icon: '🐍' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Monuments (8+)
// ─────────────────────────────────────────────────────────────────────────────

const MONUMENTS: Monument[] = [
  { name: 'Step Pyramid of Djoser', date: 'c. 2670 BCE', location: 'Saqqara', purpose: 'Royal tomb — first monumental stone building in history', description: 'Designed by the legendary architect Imhotep for Pharaoh Djoser, this six-tiered structure revolutionized construction and became the prototype for all later pyramids.', color: '#c2963a', icon: '🏛️' },
  { name: 'Great Pyramid of Giza', date: 'c. 2560 BCE', location: 'Giza Plateau', purpose: 'Royal tomb of Pharaoh Khufu', description: 'The last surviving Wonder of the Ancient World. Originally 146.5m tall with 2.3 million limestone blocks, it remained the tallest man-made structure for nearly 4,000 years.', color: '#eab308', icon: '🔺' },
  { name: 'Great Sphinx', date: 'c. 2500 BCE', location: 'Giza Plateau', purpose: 'Guardian figure, likely representing Khafre', description: 'Carved from a single limestone outcrop, this 73m-long lion-bodied statue with a human head is the world\'s largest and oldest known monumental sculpture.', color: '#f59e0b', icon: '🦁' },
  { name: 'Karnak Temple Complex', date: 'c. 2055 BCE – 100 CE', location: 'Thebes (Luxor)', purpose: 'Primary worship complex of Amun-Ra', description: 'Built and expanded over 2,000 years by 30+ pharaohs, Karnak is the largest religious complex ever constructed. Its Hypostyle Hall contains 134 massive columns.', color: '#f97316', icon: '🏗️' },
  { name: 'Temple of Hatshepsut', date: 'c. 1470 BCE', location: 'Deir el-Bahari', purpose: 'Mortuary temple of Pharaoh Hatshepsut', description: 'A stunning three-tiered colonnaded temple carved into limestone cliffs. Its elegant design by architect Senenmut remains one of ancient architecture\'s masterpieces.', color: '#ec4899', icon: '🏔️' },
  { name: 'Luxor Temple', date: 'c. 1400 BCE', location: 'Thebes (Luxor)', purpose: 'Rejuvenation of kingship and Opet Festival', description: 'Founded by Amenhotep III and expanded by Ramesses II, this temple was the southern sanctuary for the annual Opet Festival celebrating the divine power of the pharaoh.', color: '#a855f7', icon: '✨' },
  { name: 'Abu Simbel', date: 'c. 1264 BCE', location: 'Nubia (southern Egypt)', purpose: 'Temple of Ramesses II and Nefertari', description: 'Four colossal 20m-tall statues of Ramesses II guard this rock-cut temple. Twice yearly, sunlight illuminates the inner sanctuary\'s statues in a feat of ancient engineering.', color: '#ef4444', icon: '🗿' },
  { name: 'Valley of the Kings', date: 'c. 1539–1075 BCE', location: 'West bank, Thebes', purpose: 'Royal necropolis for New Kingdom pharaohs', description: 'Contains 63 known tombs including Tutankhamun\'s. The hidden valley replaced visible pyramids to deter tomb robbers, though most were plundered in antiquity.', color: '#22c55e', icon: '⛏️' },
  { name: 'Temple of Philae', date: 'c. 380 BCE – 100 CE', location: 'Aswan (Agilkia Island)', purpose: 'Cult temple of the goddess Isis', description: 'One of the last places where Egyptian hieroglyphs were written. The temple was relocated to Agilkia Island by UNESCO in the 1960s to save it from the Aswan Dam flooding.', color: '#3b82f6', icon: '🏝️' },
  { name: 'Lighthouse of Alexandria', date: 'c. 280 BCE', location: 'Alexandria harbor', purpose: 'Navigation lighthouse — one of the Seven Wonders', description: 'Standing over 100m tall, the Pharos of Alexandria was one of the tallest structures in the ancient world and guided sailors for centuries before earthquakes destroyed it.', color: '#06b6d4', icon: '💡' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Deities
// ─────────────────────────────────────────────────────────────────────────────

const DEITIES: Deity[] = [
  { name: 'Ra (Amun-Ra)', role: 'King of the Gods, Sun God', symbols: 'Sun disk, falcon, scarab beetle', description: 'The supreme solar deity who sailed across the sky daily in his barque. At Thebes he merged with Amun to become Amun-Ra, the mightiest god of the New Kingdom.', color: '#eab308', icon: '☀️' },
  { name: 'Osiris', role: 'God of the Afterlife & Resurrection', symbols: 'Crook and flail, green skin, Atef crown', description: 'Murdered and resurrected, Osiris became lord of the underworld and judge of the dead. His myth of death and rebirth was central to Egyptian beliefs about the afterlife.', color: '#22c55e', icon: '𓂀' },
  { name: 'Isis', role: 'Goddess of Magic, Healing & Motherhood', symbols: 'Throne headdress, tyet knot, wings', description: 'The devoted wife of Osiris and mother of Horus, Isis was the most widely worshipped goddess in Egypt. Her cult eventually spread throughout the Roman Empire.', color: '#a855f7', icon: '🪶' },
  { name: 'Horus', role: 'God of Kingship & the Sky', symbols: 'Falcon, Eye of Horus (wedjat)', description: 'Son of Osiris and Isis, Horus avenged his father by defeating Set. Every living pharaoh was considered the incarnation of Horus on earth.', color: '#3b82f6', icon: '🦅' },
  { name: 'Anubis', role: 'God of Mummification & the Dead', symbols: 'Jackal head, embalming tools', description: 'The jackal-headed god who guided souls to the afterlife and oversaw mummification. He weighed the hearts of the dead against the feather of Ma\'at.', color: '#1e293b', icon: '𓆣' },
  { name: 'Thoth', role: 'God of Wisdom, Writing & the Moon', symbols: 'Ibis head, moon disk, writing palette', description: 'Inventor of hieroglyphs and patron of scribes. Thoth kept the cosmic balance, mediated disputes among the gods, and recorded the results of the weighing of the heart.', color: '#06b6d4', icon: '📝' },
  { name: 'Set (Seth)', role: 'God of Chaos, Storms & the Desert', symbols: 'Set animal, was-scepter', description: 'The murderer of Osiris and eternal rival of Horus, Set embodied necessary chaos. Despite his villainous role, he also protected Ra\'s solar barque from the serpent Apophis.', color: '#ef4444', icon: '🌪️' },
  { name: 'Ma\'at', role: 'Goddess of Truth, Justice & Cosmic Order', symbols: 'Ostrich feather, scales', description: 'More concept than personality, Ma\'at represented the fundamental order of the universe. Her feather was weighed against the hearts of the dead in the final judgment.', color: '#f59e0b', icon: '⚖️' },
  { name: 'Hathor', role: 'Goddess of Love, Music & Motherhood', symbols: 'Cow horns with sun disk, sistrum', description: 'Patron of joy, feminine love, and motherhood. Hathor was associated with music, dance, and celebration, and her temple at Dendera is one of the best preserved in Egypt.', color: '#ec4899', icon: '🐄' },
  { name: 'Ptah', role: 'Creator God & Patron of Craftsmen', symbols: 'Djed pillar, was-scepter, mummiform', description: 'The chief god of Memphis who created the world through thought and speech. Patron of architects, sculptors, and all artisans.', color: '#64748b', icon: '🔨' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Innovations
// ─────────────────────────────────────────────────────────────────────────────

const INNOVATIONS: Innovation[] = [
  { name: 'Hieroglyphic Writing', period: 'c. 3200 BCE', category: 'Writing', description: 'One of the world\'s earliest writing systems, combining logographic and alphabetic elements with over 700 distinct signs. Used for monumental inscriptions for over 3,500 years.', significance: 'Enabled record-keeping, literature, and religious texts; the Rosetta Stone allowed its modern decipherment by Champollion in 1822.', color: '#eab308', icon: '𓋴' },
  { name: 'Papyrus', period: 'c. 3000 BCE', category: 'Writing', description: 'Made from the papyrus plant of the Nile Delta, these lightweight writing sheets replaced clay tablets and became the standard medium for documents across the ancient Mediterranean.', significance: 'Predecessor of modern paper; the word "paper" derives from "papyrus." Enabled portable record-keeping and literature.', color: '#22c55e', icon: '📜' },
  { name: 'Solar Calendar', period: 'c. 2700 BCE', category: 'Mathematics', description: 'A 365-day calendar with 12 months of 30 days plus 5 epagomenal days. Based on the heliacal rising of Sirius, which coincided with the Nile flood.', significance: 'The basis of the Julian and Gregorian calendars still in use today. More accurate than any contemporary system.', color: '#3b82f6', icon: '📅' },
  { name: 'Medicine & Surgery', period: 'c. 2600 BCE', category: 'Medicine', description: 'The Edwin Smith Papyrus describes 48 surgical cases with rational diagnoses and treatments. Egyptian physicians performed surgeries, set fractures, and used over 200 medicinal plants.', significance: 'First known rational medical tradition separating diagnosis from magic. Imhotep was later deified as the god of medicine.', color: '#ef4444', icon: '⚕️' },
  { name: 'Mathematics & Geometry', period: 'c. 2000 BCE', category: 'Mathematics', description: 'The Rhind Mathematical Papyrus shows knowledge of fractions, algebra, geometry, and volume calculations. Egyptians could calculate the area of circles and volumes of pyramids.', significance: 'Their approximation of pi (3.16) and practical geometry enabled pyramid construction and land surveying after Nile floods.', color: '#a855f7', icon: '📐' },
  { name: 'Monumental Engineering', period: 'c. 2670 BCE onward', category: 'Engineering', description: 'Techniques for quarrying, transporting, and precisely placing multi-ton stone blocks. Innovations included ramps, levers, copper tools, and sophisticated surveying methods.', significance: 'Built structures that have endured 4,500+ years. The Great Pyramid\'s base is level to within 2.1 cm across 230 meters.', color: '#f97316', icon: '🏗️' },
  { name: 'Mummification', period: 'c. 2600 BCE', category: 'Medicine', description: 'A 70-day preservation process involving organ removal, natron desiccation, resin application, and linen wrapping. Perfected over millennia to preserve the body for the afterlife.', significance: 'Drove advances in anatomy and chemistry. Modern study of mummies has provided invaluable data on ancient disease and genetics.', color: '#c2963a', icon: '🪦' },
  { name: 'Irrigation & Agriculture', period: 'c. 3100 BCE', category: 'Engineering', description: 'Basin irrigation systems, canals, and the shaduf (counterweighted water-lifting device) harnessed the Nile\'s annual flood to create one of the ancient world\'s most productive farmlands.', significance: 'Sustained a civilization of millions for millennia and created the agricultural surplus that funded all other achievements.', color: '#06b6d4', icon: '🌾' },
  { name: 'Glassmaking', period: 'c. 1500 BCE', category: 'Craft', description: 'Egyptians developed some of the earliest glass vessels and faience (glazed ceramic). Techniques included core-forming, casting, and the production of brilliant blue faience beads.', significance: 'Egyptian blue (calcium copper silicate) was the first synthetic pigment in history, used for over 3,000 years.', color: '#60a5fa', icon: '🔮' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Daily Life
// ─────────────────────────────────────────────────────────────────────────────

const SOCIAL_PYRAMID: SocialStratum[] = [
  { rank: 1, title: 'Pharaoh — Living god, absolute ruler', description: 'Owner of all land and people. Intermediary between gods and mortals. Responsible for maintaining Ma\'at (cosmic order).', color: '#eab308', widthPct: 30 },
  { rank: 2, title: 'Vizier & High Priests — Chief administrators', description: 'The vizier managed the government; high priests controlled temple wealth. Together they ran the kingdom\'s day-to-day affairs.', color: '#f59e0b', widthPct: 40 },
  { rank: 3, title: 'Nobles & Officials — Regional governors', description: 'Nomarchs governed the 42 nomes (provinces). Wealthy families controlled agricultural estates and served as military commanders.', color: '#f97316', widthPct: 50 },
  { rank: 4, title: 'Scribes & Soldiers — Literate elite & military', description: 'Scribes (less than 1% of the population could read) were exempt from taxes and labor. Soldiers could earn land grants.', color: '#ef4444', widthPct: 60 },
  { rank: 5, title: 'Artisans & Merchants — Skilled workers', description: 'Craftsmen at Deir el-Medina built royal tombs. Merchants traded goods along the Nile and with foreign lands. Paid in rations, not coin.', color: '#a855f7', widthPct: 75 },
  { rank: 6, title: 'Farmers & Laborers — Backbone of Egypt', description: 'About 80% of the population. Worked the land, paid heavy taxes in grain, and were conscripted for pyramid-building and canal maintenance during the flood season.', color: '#64748b', widthPct: 100 },
];

const DAILY_LIFE_TOPICS = [
  {
    title: 'Diet & Food',
    icon: '🍞',
    color: '#f59e0b',
    details: 'Bread and beer were staples for all classes — workers were paid in loaves and jugs. The wealthy enjoyed roast duck, fish, figs, dates, pomegranates, and honey-sweetened cakes. Beef was a luxury. Wine from the Delta was reserved for elites and religious offerings. Onions, garlic, and lettuce were common vegetables.',
  },
  {
    title: 'Clothing & Appearance',
    icon: '👗',
    color: '#a855f7',
    details: 'Linen from flax was the universal fabric — white for everyday, pleated and fine-woven for the wealthy. Men wore kilts; women wore sheath dresses. Both sexes wore kohl eyeliner (for sun protection and aesthetics), wigs for formal occasions, and elaborate jewelry. Sandals were made from papyrus or leather.',
  },
  {
    title: 'Housing & Architecture',
    icon: '🏠',
    color: '#3b82f6',
    details: 'Most homes were mud-brick with flat roofs (used for sleeping in summer). Workers\' villages like Deir el-Medina had 4-room houses with kitchens in open courtyards. Wealthy estates had gardens, pools, granaries, and private chapels. Furniture included low beds, stools, and storage chests.',
  },
  {
    title: 'Family & Education',
    icon: '👨‍👩‍👧‍👦',
    color: '#22c55e',
    details: 'Families were nuclear, and women had more rights than in most ancient civilizations — they could own property, initiate divorce, and conduct business. Boys of elite families trained as scribes from age 5, spending years copying texts. Most children learned their parents\' trades through apprenticeship.',
  },
  {
    title: 'Entertainment & Leisure',
    icon: '🎲',
    color: '#ec4899',
    details: 'Egyptians loved board games (especially Senet), hunting, fishing, and wrestling. Music with harps, flutes, and sistrums accompanied feasts and religious festivals. Children played with dolls, spinning tops, and balls. Annual festivals honoring the gods featured processions, feasting, and public drunkenness.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#eab308'; // Egyptian gold

function StatBadge({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}>
      <span>{icon}</span>{title}
    </h2>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
        border: active ? `1px solid ${ACCENT}` : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: active ? `${ACCENT}22` : 'rgba(255,255,255,0.04)',
        color: active ? ACCENT : '#94a3b8',
        cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>{label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Dynastic Eras
// ─────────────────────────────────────────────────────────────────────────────

function EraCard({ era, index }: { era: DynasticEra; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${era.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: `${era.color}18`, border: `2px solid ${era.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{era.icon}</span>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{era.name}</h3>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: era.color, fontFamily: 'monospace', fontWeight: 600 }}>{era.period}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{era.dynasties}</span>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, backgroundColor: `${era.color}22`, color: era.color }}>Capital: {era.capital}</span>
      </div>

      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
        {expanded ? era.summary : era.summary.slice(0, 160) + '...'}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Key Events</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {era.keyEvents.map((ev) => (
                  <div key={ev} style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, paddingLeft: 14, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: era.color }}>•</span>{ev}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Pharaohs
// ─────────────────────────────────────────────────────────────────────────────

const ERA_FILTERS = ['All', ...DYNASTIC_ERAS.map((e) => e.name)] as const;
const ERA_COLORS: Record<string, string> = {};
DYNASTIC_ERAS.forEach((e) => { ERA_COLORS[e.name] = e.color; });

function PharaohCard({ pharaoh, index }: { pharaoh: Pharaoh; index: number }) {
  const eraColor = ERA_COLORS[pharaoh.era] || ACCENT;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      style={{ padding: '16px 20px', borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${eraColor}33`, display: 'flex', gap: 14, alignItems: 'flex-start' }}
    >
      <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${eraColor}18`, border: `2px solid ${eraColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{pharaoh.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{pharaoh.name}</h3>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{pharaoh.reign}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, backgroundColor: `${eraColor}22`, color: eraColor, fontWeight: 600 }}>{pharaoh.dynasty} Dynasty</span>
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{pharaoh.legacy}</div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Monuments
// ─────────────────────────────────────────────────────────────────────────────

function MonumentCard({ monument, index }: { monument: Monument; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      onClick={() => setExpanded(!expanded)}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${monument.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 28 }}>{monument.icon}</span>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>{monument.name}</h3>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 12, color: monument.color, fontFamily: 'monospace' }}>{monument.date}</span>
              <span style={{ fontSize: 12, color: '#64748b' }}>{monument.location}</span>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#64748b', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>{'\u25BC'}</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: monument.color, padding: '4px 10px', borderRadius: 4, backgroundColor: `${monument.color}15`, display: 'inline-block', marginBottom: 10 }}>{monument.purpose}</div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginTop: 6 }}>{monument.description}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Deities
// ─────────────────────────────────────────────────────────────────────────────

function DeityCard({ deity, index }: { deity: Deity; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${deity.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${deity.color}18`, border: `2px solid ${deity.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{deity.icon}</span>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{deity.name}</h3>
          <div style={{ fontSize: 12, color: deity.color, fontWeight: 600, marginTop: 2 }}>{deity.role}</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{deity.description}</div>
      <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${deity.color}0d`, borderLeft: `3px solid ${deity.color}44` }}>
        <strong>Symbols:</strong> {deity.symbols}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Innovations
// ─────────────────────────────────────────────────────────────────────────────

function InnovationCard({ innovation, index }: { innovation: Innovation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
      style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${innovation.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${innovation.color}18`, border: `2px solid ${innovation.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{innovation.icon}</span>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{innovation.name}</h3>
          <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
            <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{innovation.period}</span>
            <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 3, backgroundColor: `${innovation.color}22`, color: innovation.color, fontWeight: 600 }}>{innovation.category}</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{innovation.description}</div>
      <div style={{ fontSize: 12, color: innovation.color, lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${innovation.color}0d`, borderLeft: `3px solid ${innovation.color}44` }}>
        <strong>Significance:</strong> {innovation.significance}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'eras', label: 'Dynastic Eras', icon: '𓇳' },
  { key: 'pharaohs', label: 'Pharaohs', icon: '👑' },
  { key: 'monuments', label: 'Monuments', icon: '🔺' },
  { key: 'religion', label: 'Religion', icon: '𓂀' },
  { key: 'innovations', label: 'Innovations', icon: '📐' },
  { key: 'daily-life', label: 'Daily Life', icon: '🏠' },
];

export default function AncientEgyptPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('eras');
  const [pharaohEraFilter, setPharaohEraFilter] = useState<string>('All');

  const filteredPharaohs = useMemo(() => {
    if (pharaohEraFilter === 'All') return PHARAOHS;
    return PHARAOHS.filter((p) => p.era === pharaohEraFilter);
  }, [pharaohEraFilter]);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(234,179,8,0.1) 100%)' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.15)', border: '2px solid rgba(234,179,8,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: '0 0 24px rgba(234,179,8,0.2)' }}>{'𓂀'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(234,179,8,0.15)', color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.15, marginBottom: 14 }}>
            <span style={{ color: ACCENT }}>𓇳</span> Land of the Pharaohs {'\u2014'} Ancient Egypt <span style={{ color: ACCENT }}>𓆣</span>
          </h1>
          <p style={{ fontSize: 16, color: '#94a3b8', lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            Three thousand years of divine kings, colossal monuments, and innovations that shaped civilization {'\u2014'} from the unification of the Nile Valley to the fall of Cleopatra.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="3,000+" label="Years of History" />
            <StatBadge value="22" label="Notable Pharaohs" />
            <StatBadge value="10" label="Iconic Monuments" />
            <StatBadge value="10" label="Major Deities" />
          </div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#070e22' }}>
          {SECTION_TABS.map((tab) => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ── Dynastic Eras ── */}
        {activeTab === 'eras' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="𓇳" title={`Dynastic Eras — ${DYNASTIC_ERAS.length} Periods`} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any era to explore its key events. Over 3,000 years of civilization divided into six major periods.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DYNASTIC_ERAS.map((era, i) => <EraCard key={era.name} era={era} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Pharaohs ── */}
        {activeTab === 'pharaohs' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="👑" title={`Notable Pharaohs — ${filteredPharaohs.length} Rulers`} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 14, marginTop: 0 }}>From Narmer who unified Egypt to Cleopatra who saw its end — the rulers who shaped 3,000 years of history.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {ERA_FILTERS.map((era) => (
                <button
                  key={era}
                  onClick={() => setPharaohEraFilter(era)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    border: pharaohEraFilter === era ? `1px solid ${ERA_COLORS[era] || ACCENT}` : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: pharaohEraFilter === era ? `${ERA_COLORS[era] || ACCENT}22` : 'rgba(255,255,255,0.04)',
                    color: pharaohEraFilter === era ? (ERA_COLORS[era] || ACCENT) : '#94a3b8',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {era}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence mode="popLayout">
                {filteredPharaohs.map((p, i) => <PharaohCard key={p.name} pharaoh={p} index={i} />)}
              </AnimatePresence>
            </div>
            {filteredPharaohs.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: 14 }}>No pharaohs match the current filter.</div>}
          </section>
        )}

        {/* ── Monuments ── */}
        {activeTab === 'monuments' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="🔺" title={`Iconic Monuments — ${MONUMENTS.length} Structures`} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any monument to reveal its full story. From the first stone pyramid to the Lighthouse of Alexandria.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {MONUMENTS.map((m, i) => <MonumentCard key={m.name} monument={m} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Religion & Deities ── */}
        {activeTab === 'religion' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="𓂀" title={`Egyptian Religion — ${DEITIES.length} Major Deities`} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The Egyptian pantheon shaped every aspect of life and death — from the sun's daily journey to the weighing of souls in the afterlife.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {DEITIES.map((d, i) => <DeityCard key={d.name} deity={d} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Innovations ── */}
        {activeTab === 'innovations' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="📐" title={`Egyptian Innovations — ${INNOVATIONS.length} Breakthroughs`} />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>From hieroglyphs to surgery — the innovations that made Egypt the most advanced civilization of the ancient world.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {INNOVATIONS.map((inn, i) => <InnovationCard key={inn.name} innovation={inn} index={i} />)}
            </div>
          </section>
        )}

        {/* ── Daily Life ── */}
        {activeTab === 'daily-life' && (
          <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <SectionHeader icon="🏠" title="Daily Life in Ancient Egypt" />
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Beyond the pyramids and temples — how ordinary Egyptians lived, ate, dressed, and spent their days.</p>

            {/* Social Pyramid */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>𓋴 Social Hierarchy</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                {SOCIAL_PYRAMID.map((s, i) => (
                  <motion.div
                    key={s.rank}
                    initial={{ opacity: 0, scaleX: 0.5 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
                    style={{ width: `${s.widthPct}%`, minWidth: 200, padding: '12px 16px', borderRadius: 8, backgroundColor: `${s.color}15`, border: `1px solid ${s.color}33`, textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{s.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Life Topics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DAILY_LIFE_TOPICS.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${topic.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${topic.color}18`, border: `2px solid ${topic.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{topic.icon}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{topic.title}</h3>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.75 }}>{topic.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)' }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
