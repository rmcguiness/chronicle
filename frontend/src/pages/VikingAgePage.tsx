/**
 * VikingAgePage — comprehensive deep-dive on the Viking Age (793–1066 CE).
 *
 * Route: /viking-age
 *
 * Sections:
 *  1. Hero — "Not Just Raiders" headline, myth-busting opener
 *  2. Who Were the Vikings? — debunking myths (horned helmets, barbarism)
 *  3. Origins and Context — population pressure, longships, trade networks
 *  4. The Longship — technology that changed the world
 *  5. The Raids Begin — Lindisfarne, Great Heathen Army, Danelaw
 *  6. Exploration and Settlement — Iceland, Greenland, Vinland, Russia, Constantinople
 *  7. Viking Society — classes, women, the Thing, mythology, runes
 *  8. The Normans — Vikings who became French (Rollo → William the Conqueror)
 *  9. The End of the Viking Age — Stamford Bridge, Christianization
 * 10. Legacy — English words, days of the week, Russia, popular culture
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ASH = '#94a3b8';
const SLATE = '#64748b';
const NORSE_BLUE = '#3b82f6';
const IRON = '#78716c';
const FROST = '#7dd3fc';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const FOREST = '#15803d';
const GOLD = '#f59e0b';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SEA_GREEN = '#059669';
const RUNE_RED = '#b91c1c';
const STORM = '#475569';
const OAK = '#92400e';

const FIGURE_COLORS = [FROST, AMBER, CRIMSON, FOREST, GOLD, TEAL, INDIGO, ROSE, PURPLE, SEA_GREEN, NORSE_BLUE, OAK];

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

const KEY_STATS: { label: string; value: string; context: string; color: string }[] = [
  { label: 'Viking Age', value: '793–1066 CE', context: '273 years of expansion', color: FROST },
  { label: 'Geographic Range', value: 'Newfoundland → Baghdad', context: 'Extraordinary east-west reach', color: AMBER },
  { label: 'Longship', value: 'Ocean + River', context: 'Could cross the Atlantic and navigate shallow rivers', color: SEA_GREEN },
  { label: 'L\'Anse aux Meadows', value: 'Confirmed 1960', context: 'Viking settlement in Newfoundland — 500 years before Columbus', color: GOLD },
  { label: 'Old Norse → English', value: '400+ Words', context: 'sky, knife, window, egg, husband, anger', color: INDIGO },
  { label: 'Norman Conquest', value: '1066 CE', context: 'Transformed English: 60% of modern English has French/Latin roots', color: CRIMSON },
];

// ── Who Were the Vikings? ───────────────────────────────────────────────────

const WHO_INSIGHTS: InsightEntry[] = [
  {
    label: '"Viking" = A Job Description',
    detail:
      'The word "Viking" comes from the Old Norse "víkingr," meaning "pirate raid" or "sea expedition." To "go viking" was an activity, not an identity. The people we call Vikings called themselves Norsemen or Danes or Swedes. Most Norsemen never went on a single raid — they were farmers, fishermen, merchants, and craftsmen who lived in Scandinavia (modern Norway, Sweden, Denmark). The popular image of an entire society of warriors is a myth. "Viking" was something you did, not something you were.',
  },
  {
    label: 'Horned Helmets: Almost Certainly a Myth',
    detail:
      'No Viking-era helmet with horns has ever been found. Actual Viking helmets were conical, made of iron or hardened leather, sometimes with a nose guard — practical battlefield equipment. The horned helmet myth likely originated from 19th-century Romantic artists and opera costumes (especially Wagner\'s Ring Cycle). Earlier Scandinavian Bronze Age helmets (1000+ years before the Viking Age) did have horns, but these were ceremonial. The image stuck because it made Vikings look exotic and barbaric — which suited both Romantic nationalists and Victorian moralists.',
  },
  {
    label: 'Not Barbaric — Surprisingly Sophisticated',
    detail:
      'Vikings had complex legal codes, democratic assemblies (Things) where free men voted on laws and settled disputes, a rich poetic tradition (skalds composed elaborate verse), sophisticated metalwork and woodcarving, advanced navigation techniques, and far-reaching trade networks. Arab travelers who encountered Vikings noted they were obsessively clean by medieval standards — combing their hair, bathing regularly, and changing clothes frequently. The "filthy barbarian" image is a creation of the monks whose monasteries they raided — hardly unbiased observers.',
  },
  {
    label: 'Farmers First, Raiders Second',
    detail:
      'The vast majority of Norse people were farmers and herders who never left Scandinavia. Even those who went overseas were often seeking farmland, not plunder. The settlement of Iceland, the Faroe Islands, and parts of Scotland, Ireland, and Normandy were primarily agricultural colonization projects. Raiding was seasonal — typically summer — and many "Vikings" returned home to farm after the raiding season. The archaeological record shows a society focused on agriculture, animal husbandry, and trade, not perpetual warfare.',
  },
];

// ── Origins and Context ─────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Population Pressure and Limited Land',
    detail:
      'Scandinavia\'s geography — mountainous terrain, short growing seasons, limited agricultural land — created intense pressure on a growing population. Primogeniture (eldest son inherits) left younger sons with few options at home. The sea offered alternatives: trade, raiding, and settlement in new lands. This demographic pressure, combined with technological mastery of shipbuilding and seamanship, created the explosive outward expansion of the Viking Age.',
  },
  {
    label: 'The Ulfberht Sword: Evidence of Pre-Viking Trade',
    detail:
      'The legendary Ulfberht swords — found across Viking-era sites — were made from crucible steel originating in Central Asia or the Middle East. These blades were centuries ahead of European metallurgy, containing almost no slag impurities. Their existence proves that far-reaching trade networks between Scandinavia and the Islamic world existed even before the raids began. The Vikings didn\'t just raid — they were already connected to global commerce.',
  },
  {
    label: 'The Medieval Warm Period',
    detail:
      'A climate optimum from roughly 800–1300 CE brought warmer temperatures to the North Atlantic. This was critical: warmer weather allowed farming in Greenland, made North Atlantic sailing routes more navigable (less sea ice), extended growing seasons in Scandinavia, and created favorable conditions for the overseas expansion. When the climate cooled in the 14th century, the Greenland colonies collapsed — a reminder that the Viking Age was partly enabled by climate.',
  },
  {
    label: 'Weak, Fragmented Targets',
    detail:
      'Viking expansion coincided with political fragmentation across Europe. The Carolingian Empire was fracturing after Charlemagne\'s death. Anglo-Saxon England was divided into competing kingdoms. Ireland had no central authority. These divided, often warring, societies struggled to mount coordinated defense against fast-moving seaborne raiders who could strike anywhere along thousands of miles of coastline and then disappear.',
  },
];

// ── The Longship ────────────────────────────────────────────────────────────

const LONGSHIP_INSIGHTS: InsightEntry[] = [
  {
    label: 'Clinker-Built Hull: Engineering Genius',
    detail:
      'Viking longships used clinker construction — overlapping planks riveted together, creating an incredibly strong yet flexible hull. Unlike Mediterranean ships with rigid frames, longships could flex with ocean swells without cracking. The planks were split (not sawn) from oak along the natural grain, preserving the wood\'s strength. This technique produced a vessel that was simultaneously strong enough for the open Atlantic and light enough to be carried overland between river systems.',
  },
  {
    label: 'Shallow Draft: The Key Advantage',
    detail:
      'A fully loaded longship drew as little as 50cm (20 inches) of water. This meant Vikings could sail up rivers that no other ocean-going vessel could navigate — the Seine to Paris, the Thames to London, the Volga to the Caspian Sea. They could beach directly on shores, land troops instantly, and escape into shallow waters where heavier ships couldn\'t follow. This dual capability — open ocean AND shallow rivers — was the single greatest military advantage of the Viking Age.',
  },
  {
    label: 'Speed and Range',
    detail:
      'Under sail, longships could reach 5–10 knots, often faster than later medieval vessels. With a favorable wind, they could cover 200+ kilometers in a day. Under oar power, they could maintain 3–4 knots — crucial for navigating rivers and approaching targets in calm conditions. The combination of sail and oar gave Vikings strategic flexibility that no contemporary navy could match. A fleet could cross the North Sea in 2–3 days.',
  },
  {
    label: 'Portage: Ships That Walked',
    detail:
      'Vikings regularly carried or rolled their ships overland between river systems using log rollers. In Russia, this allowed them to travel from the Baltic Sea to the Black Sea and Caspian Sea via the Dnieper and Volga river systems — connecting Scandinavia to Constantinople and Baghdad. The portage routes through modern Russia and Ukraine were the foundation of the Varangian trade network and, arguably, of Russian civilization itself.',
  },
];

// ── The Raids Begin ─────────────────────────────────────────────────────────

const RAIDS_TIMELINE: TimelineEntry[] = [
  {
    year: '793 CE',
    title: 'Lindisfarne — The Raid That Shocked Europe',
    description:
      'On June 8, 793, Norse raiders attacked the island monastery of Lindisfarne off the northeast coast of England. The raid shocked Christian Europe: Lindisfarne was one of the holiest sites in Britain, home to the relics of St. Cuthbert. The Anglo-Saxon scholar Alcuin wrote from Charlemagne\'s court: "Never before has such terror appeared in Britain as we have now suffered from a pagan race." The monks were killed or enslaved, the treasury looted, the library destroyed. It was the beginning of the Viking Age.',
    color: CRIMSON,
  },
  {
    year: '795–840s',
    title: 'Ireland and Scotland Under Siege',
    description:
      'After Lindisfarne, Norse raiders turned on Ireland and Scotland — islands with hundreds of wealthy, undefended monasteries. Iona was raided in 795, 802, and 806. By the 830s, Vikings were establishing permanent bases (longphorts) in Ireland, including Dublin (founded ~841), which became one of the most important Viking trading centers in the Atlantic world. Norse settlers intermarried with Irish populations, creating the "Norse-Gaels" — a hybrid culture that dominated the Irish Sea region for two centuries.',
    color: FOREST,
  },
  {
    year: '845 CE',
    title: 'Paris Raided — France Under Fire',
    description:
      'In 845, a fleet of 120 Viking ships carrying an estimated 5,000 warriors sailed up the Seine and besieged Paris. The Frankish king Charles the Bald paid a ransom of 7,000 pounds of silver — the first of many Danegeld payments that European rulers would make to buy off Viking attacks. Paris was raided again in 856, 857, and 861. The repeated raids on France ultimately led King Charles the Simple to grant the Viking leader Rollo the territory that became Normandy in 911 — a decision with world-changing consequences.',
    color: AMBER,
  },
  {
    year: '844–860s',
    title: 'Spain, Mediterranean, and Beyond',
    description:
      'Viking raiders reached the Iberian Peninsula in 844, attacking Lisbon, Seville, and Cádiz. They sailed into the Mediterranean, raiding the coasts of Morocco, southern France, and Italy. Some reached as far as the eastern Mediterranean. The geographic range was extraordinary — the same seafaring culture that attacked monasteries in Ireland was raiding cities in the Islamic world. Muslim sources describe the "Majūs" (fire-worshippers) arriving in their ships.',
    color: GOLD,
  },
  {
    year: '865 CE',
    title: 'The Great Heathen Army — Conquest, Not Raiding',
    description:
      'In 865, a massive Danish Viking army — the "Great Heathen Army" (micel heathen here) — landed in East Anglia. This was something new: not a hit-and-run raid but an organized army of conquest. Led by the sons of the legendary Ragnar Lothbrok (probably a composite figure), the army systematically conquered the Anglo-Saxon kingdoms of Northumbria, East Anglia, and Mercia over the next decade. Only Wessex, under Alfred the Great, survived.',
    color: RUNE_RED,
  },
  {
    year: '870s–920s',
    title: 'Danelaw: Viking England',
    description:
      'By the 870s, Vikings controlled roughly half of England — the region known as the Danelaw, covering northern and eastern England. Danish law, customs, and language dominated. Place names ending in "-by" (farm/settlement), "-thorpe" (village), and "-thwaite" (clearing) still mark the Danelaw region on modern maps. Alfred the Great of Wessex negotiated the Treaty of Wedmore (878) that formalized the division. The reconquest of the Danelaw by Alfred\'s descendants took another 50 years.',
    color: NORSE_BLUE,
  },
];

// ── Exploration and Settlement ──────────────────────────────────────────────

const EXPLORATION_TIMELINE: TimelineEntry[] = [
  {
    year: '~862 CE',
    title: 'Russia: The Varangian Foundation Myth',
    description:
      'According to the Primary Chronicle, Slavic and Finnic tribes invited the Varangian (Viking) leader Rurik to rule over them at Novgorod around 862 CE. The word "Rus" — which gives Russia its name — likely derives from the Old Norse "Rōþs," referring to the Varangian rowers. While the degree of Viking involvement in founding the Russian state is debated, the archaeological evidence is clear: Scandinavian traders and warriors were deeply embedded in the early settlements of Novgorod and Kiev, and the Varangian trade routes connecting the Baltic to Constantinople were among the most important commercial highways of the medieval world.',
    color: INDIGO,
  },
  {
    year: '~874 CE',
    title: 'Iceland: A New Society',
    description:
      'Ingólfur Arnarson is traditionally credited as the first permanent Norse settler in Iceland, arriving around 874 CE. Within 60 years, Iceland was fully settled by an estimated 20,000–30,000 Norse colonists (and their Irish thralls). The settlers established the Althing in 930 — one of the oldest parliaments in the world — and created a unique society with no king, governed by a complex legal code and regional assemblies. Iceland\'s isolation preserved Old Norse language and literature; the sagas written there centuries later are our primary source for Viking history and mythology.',
    color: FROST,
  },
  {
    year: '~985 CE',
    title: 'Greenland: Erik the Red\'s Colony',
    description:
      'Erik the Red, exiled from Iceland for murder, sailed west and discovered Greenland. He deliberately named it "Greenland" to attract settlers — one of history\'s earliest examples of misleading marketing. By 985, he had established two Norse colonies on Greenland\'s southwestern coast with an eventual population of 3,000–5,000. The colonies thrived for over 400 years, trading walrus ivory, furs, and live polar bears to Europe. They collapsed in the 15th century, likely due to climate cooling (the Little Ice Age), declining trade, and possible conflicts with the Inuit.',
    color: SEA_GREEN,
  },
  {
    year: '~1000 CE',
    title: 'Vinland: Leif Eriksson Reaches North America',
    description:
      'Around 1000 CE, Leif Eriksson — son of Erik the Red — sailed from Greenland to North America, which the Norse called Vinland (Wine-land or Meadow-land). The sagas describe landings at three locations: Helluland (likely Baffin Island), Markland (likely Labrador), and Vinland (likely Newfoundland). The archaeological site at L\'Anse aux Meadows in Newfoundland, discovered in 1960 by Helge and Anne Stine Ingstad, confirmed the Norse presence in North America — 500 years before Columbus. The site includes remains of eight Norse-style buildings, a smithy, and artifacts including a bronze cloak pin.',
    color: GOLD,
  },
  {
    year: '~1000 CE',
    title: 'Why Didn\'t the Vikings Stay in North America?',
    description:
      'The Norse attempted several expeditions to Vinland after Leif Eriksson\'s voyage, but never established a permanent colony. The sagas describe violent encounters with Indigenous peoples (whom the Norse called Skraelings), and the Norse — numbering perhaps a few dozen — were vastly outnumbered. Vinland was also 3,000+ miles from the nearest Norse settlements in Greenland, itself remote from Iceland and Scandinavia. The logistics of maintaining a colony so far from home, in hostile territory, with medieval technology, were simply impossible.',
    color: STORM,
  },
  {
    year: '9th–11th Century',
    title: 'Constantinople and the Varangian Guard',
    description:
      'The Norse called Constantinople "Miklagarðr" — the Great City. Viking traders and warriors traveled the river routes through Russia to reach the Byzantine capital, the richest city in the medieval world. By the late 10th century, the Byzantine emperors recruited Scandinavian warriors into the elite Varangian Guard — the emperor\'s personal bodyguard. These Viking mercenaries served at the heart of Byzantium for over 200 years. The most famous Varangian was Harald Hardrada, who fought across the Mediterranean before returning to become King of Norway.',
    color: PURPLE,
  },
  {
    year: '9th–11th Century',
    title: 'Baghdad Trade: Vikings on the Volga',
    description:
      'Vikings traveled the Volga River route to reach the Caspian Sea and trade with the Islamic world. Arab dirhams (silver coins) have been found in enormous quantities across Scandinavia — the largest hoards outside the Islamic world itself. Viking goods traveled as far as Afghanistan. The 10th-century Arab traveler Ibn Fadlan left one of the most detailed accounts of Viking customs, describing both their impressive physiques and their funeral practices (including ship burials). The Viking trade network connected Dublin in the west to Baghdad in the east — an extraordinary commercial web.',
    color: AMBER,
  },
];

// ── Viking Society ──────────────────────────────────────────────────────────

const SOCIETY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Three Classes: Jarls, Karls, Thralls',
    detail:
      'Norse society was divided into three main classes. Jarls were the nobility — wealthy landowners and chieftains who could raise armies and build ships. Karls were free farmers, craftsmen, and merchants — the backbone of society, who owned land, bore arms, and participated in legal assemblies. Thralls were enslaved people, captured in raids or born into slavery. The boundaries between classes were not entirely rigid: a karl could become wealthy enough to rival a jarl, and thralls could sometimes earn or buy their freedom.',
  },
  {
    label: 'Slavery: The Uncomfortable Truth',
    detail:
      'Vikings were major slave traders. Thralls were captured in raids across Europe — Irish, Anglo-Saxon, Slavic, and Baltic peoples were all enslaved. (The English word "slave" may derive from "Slav," reflecting the widespread enslavement of Slavic peoples.) Thralls had virtually no legal rights: they could be beaten, sold, sexually exploited, and even sacrificed at their owner\'s funeral. The Dublin slave market was one of the busiest in Europe. Slavery was central to the Viking economy, not a peripheral activity.',
  },
  {
    label: 'Women: More Rights Than Most',
    detail:
      'Norse women had more rights than women in most contemporary European cultures. They could own property, inherit land, request a divorce, and reclaim their dowry. While men were away on voyages, women managed farms, finances, and households — positions of real authority. The household keys worn at a woman\'s belt were symbols of her power. Some women may have fought as warriors (the "shieldmaiden" tradition), and recent DNA analysis of a famous warrior burial at Birka, Sweden, confirmed the skeleton was female, though this interpretation remains debated.',
  },
  {
    label: 'The Thing: Democracy Before Democracy',
    detail:
      'The Thing (Old Norse: þing) was a democratic assembly where free men gathered to vote on laws, settle disputes, and make collective decisions. Regional Things handled local matters; national assemblies like Iceland\'s Althing (founded 930 CE) handled broader governance. Decisions were made by consensus or majority vote. The Thing could outlaw individuals, arbitrate blood feuds, and establish new laws. This tradition of collective decision-making influenced later parliamentary systems and represents one of the most significant Viking contributions to political history.',
  },
  {
    label: 'Norse Mythology: Odin, Thor, and Ragnarök',
    detail:
      'The Norse believed in a complex pantheon centered on the Aesir gods. Odin, the All-Father, sacrificed his eye for wisdom and hung on the World Tree Yggdrasil for nine days to learn the runes. Thor wielded Mjolnir to protect humanity from giants. Loki, the trickster, would eventually bring about Ragnarök — the apocalyptic final battle where gods and giants would destroy each other, and the world would be reborn. Norse mythology reflects a culture that valued wisdom, courage in the face of inevitable doom, and the idea that even gods are mortal.',
  },
  {
    label: 'Runes: More Than Just Writing',
    detail:
      'The runic alphabet (futhark) was used for carving inscriptions on stone, wood, bone, and metal. But runes were more than a writing system — they were believed to hold magical power. The Elder Futhark (24 characters) was used across Germanic cultures; the Younger Futhark (16 characters) was the Viking Age standard. Thousands of runic inscriptions survive, from the massive Jelling stones in Denmark (which proclaimed Denmark\'s conversion to Christianity) to graffiti scratched by a bored Varangian Guard member in the Hagia Sophia in Constantinople.',
  },
];

// ── The Normans ─────────────────────────────────────────────────────────────

const NORMANS_TIMELINE: TimelineEntry[] = [
  {
    year: '911 CE',
    title: 'Rollo: Viking Who Became a Duke',
    description:
      'After decades of devastating Viking raids on France, King Charles the Simple offered a deal to the Norse chieftain Rollo (Old Norse: Hrólfr): accept Christianity, swear fealty to the French crown, and defend the Seine against other Vikings — and in exchange, receive the territory around Rouen as a fief. Rollo accepted. The Treaty of Saint-Clair-sur-Epte (911) created the Duchy of Normandy — literally "Land of the Northmen." Within two generations, the Normans had adopted the French language, converted to Christianity, and blended Norse and Frankish culture into something entirely new.',
    color: AMBER,
  },
  {
    year: '1066 CE',
    title: 'William the Conqueror: The Norman Invasion of England',
    description:
      'William, Duke of Normandy — Rollo\'s great-great-great-grandson — invaded England and defeated King Harold II at the Battle of Hastings on October 14, 1066. The Norman Conquest transformed England: the Anglo-Saxon aristocracy was replaced by a French-speaking Norman elite, English law was reorganized, castles were built across the country, and the English language absorbed thousands of French and Latin words. The Domesday Book (1086), William\'s comprehensive survey of England, was an administrative achievement without parallel in medieval Europe.',
    color: CRIMSON,
  },
  {
    year: '11th–12th Century',
    title: 'Norman Sicily and Southern Italy',
    description:
      'While some Normans conquered England, others carved out kingdoms in the Mediterranean. Norman adventurers — beginning with the sons of Tancred de Hauteville — conquered southern Italy and Sicily from the Byzantines and Arabs. Roger II of Sicily created a remarkable multicultural kingdom where Norman, Arab, Greek, and Jewish cultures coexisted. The Norman cathedral at Monreale, with its Byzantine mosaics and Arab architectural elements, represents one of the great artistic achievements of the medieval world. The same Viking-descended people produced the conqueror of England and the most cosmopolitan court in Europe.',
    color: GOLD,
  },
];

// ── The End of the Viking Age ───────────────────────────────────────────────

const END_TIMELINE: TimelineEntry[] = [
  {
    year: 'September 25, 1066',
    title: 'Stamford Bridge: The Last Great Viking Invasion',
    description:
      'Harald Hardrada — King of Norway, former Varangian Guard commander, veteran of battles across the Mediterranean — invaded northern England with a fleet of 300 ships and 9,000 warriors, claiming the English throne. King Harold II of England force-marched his army 185 miles in four days and caught the Vikings by surprise at Stamford Bridge. The battle was a catastrophic defeat for the Norse: Hardrada was killed by an arrow to the throat, and the surviving Vikings needed only 24 of their original 300 ships to carry home the survivors. It was the last great Viking invasion of England.',
    color: CRIMSON,
  },
  {
    year: 'October 14, 1066',
    title: 'Hastings: Three Weeks Later, Everything Changes',
    description:
      'Just three weeks after Stamford Bridge, Harold II had to march his exhausted army 250 miles south to face William of Normandy\'s invasion at Hastings. The timing was devastating — Harold\'s army was depleted and exhausted from defeating the Vikings. Harold was killed (traditionally, by an arrow to the eye), and William became king. The irony is extraordinary: the Viking Age ended with one Norse-descended army (the Normans) defeating the Anglo-Saxon king who had just defeated the last true Viking invasion.',
    color: NORSE_BLUE,
  },
  {
    year: '10th–12th Century',
    title: 'Christianization: The Cultural Transformation',
    description:
      'The gradual Christianization of Scandinavia — Denmark (~960s under Harald Bluetooth), Norway (~1000 under Olaf Tryggvason), Sweden (completed ~1100s) — fundamentally transformed Norse culture. Christian kings centralized power, replacing the old tribal system with feudal hierarchies. The Church brought literacy (Latin replaced runes for official documents), new legal frameworks, and integration into the broader European Christian world. Raiding Christian targets became unacceptable. The Norse were absorbed into mainstream European civilization — the Viking Age was over.',
    color: INDIGO,
  },
  {
    year: '11th Century',
    title: 'Better Defenses, Declining Returns',
    description:
      'By the 11th century, the easy targets were gone. European kingdoms had learned from two centuries of Viking raids: coastal fortifications, standing navies, fortified bridges across rivers, and professional armies made raiding far more dangerous and less profitable. The English organized the fyrd system of militia defense. The Franks built fortified bridges that blocked Viking ships from sailing upriver. Trade became more profitable than raiding. The economic incentive that had driven the Viking Age was disappearing.',
    color: STORM,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'English Words from Old Norse: 400+',
    detail:
      'Hundreds of everyday English words come directly from Old Norse — not obscure technical terms, but the most basic vocabulary: "sky," "window" (vindauga — wind-eye), "knife," "egg," "husband" (húsbóndi — householder), "anger," "wrong," "ugly," "die," "take," "get," "give," "call," "want," "they," "them," "their." The fact that pronouns — the most fundamental words in any language — were borrowed from Old Norse shows how deeply the two languages merged in the Danelaw region.',
  },
  {
    label: 'Days of the Week',
    detail:
      'Four English days of the week come from Norse gods: Tuesday (Tyr, god of war and justice), Wednesday (Woden/Odin, the All-Father), Thursday (Thor, god of thunder), Friday (Frigg, goddess of love and marriage). These names survive across the English-speaking world — over a billion people invoke Norse gods every time they check their calendar, without knowing it.',
  },
  {
    label: 'Russia\'s Viking Origins',
    detail:
      'The very name "Russia" likely derives from the Norse Varangians who established the first major Slavic states at Novgorod and Kiev. The Rurikid dynasty founded by the Varangian Rurik ruled Russia from the 9th century until 1598 — over 700 years. The double-headed eagle, adopted as Russia\'s national symbol, came via the Byzantine connection that the Varangians established. Viking influence on Russian state formation, trade networks, and political culture was foundational.',
  },
  {
    label: 'Navigation Without a Compass',
    detail:
      'Vikings navigated vast ocean distances without a magnetic compass (which didn\'t reach Europe until the 12th century). They used a combination of techniques: sun position, star navigation, observation of wave patterns and ocean swells, the behavior of seabirds (following birds toward land), cloud formations over distant islands, and possibly "sunstones" — calcite crystals that could identify the sun\'s position on overcast days by polarizing light. These methods were reliable enough to maintain regular transatlantic routes to Iceland and Greenland.',
  },
  {
    label: 'The 19th-Century Viking Revival',
    detail:
      'Much of what we "know" about Vikings was invented in the 19th century by Romantic nationalists. Scandinavian nations, seeking a heroic national past, reimagined Vikings as noble warriors. German composer Richard Wagner put horned helmets on stage. British Victorians simultaneously romanticized Viking courage and condemned their paganism. This revival created the popular image that persists today — and much of it is wrong. The real Vikings were more interesting than the myth.',
  },
  {
    label: 'Popular Culture: Mostly Wrong',
    detail:
      'Modern depictions of Vikings in film, television, and video games (Vikings TV show, Assassin\'s Creed Valhalla, How to Train Your Dragon) perpetuate myths: horned helmets, filthy savages in fur, constant berserker rage. The real Vikings bathed more than most medieval Europeans, wore colorful dyed clothing, braided their hair elaborately, and spent most of their time farming. They were sophisticated traders who used standardized weights and measures, skilled poets who composed complex verse forms, and pragmatic politicians who built lasting institutions.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Leif Eriksson',
    years: '~970–1020 CE',
    contribution:
      'Son of Erik the Red. First known European to reach North America (~1000 CE), 500 years before Columbus. Established a short-lived settlement at Vinland (likely Newfoundland). Later converted to Christianity and brought the faith to Greenland.',
  },
  {
    name: 'Erik the Red',
    years: '~950–1003 CE',
    contribution:
      'Exiled from Iceland for murder, he explored and colonized Greenland (~985), naming it "Greenland" to attract settlers. Founded the first permanent Norse settlements on Greenland\'s southwest coast.',
  },
  {
    name: 'Harald Hardrada',
    years: '1015–1066 CE',
    contribution:
      'King of Norway, legendary warrior. Served in the Byzantine Varangian Guard, fought across the Mediterranean, amassed a fortune, then returned to claim Norway\'s throne. His defeat and death at Stamford Bridge (1066) marks the conventional end of the Viking Age.',
  },
  {
    name: 'Rollo of Normandy',
    years: '~846–930 CE',
    contribution:
      'Viking chieftain who besieged Paris and was granted Normandy by the French king (911 CE). His descendants adopted French culture and language. His great-great-great-grandson William conquered England in 1066.',
  },
  {
    name: 'Alfred the Great',
    years: '849–899 CE',
    contribution:
      'King of Wessex who was the only Anglo-Saxon king to successfully resist the Great Heathen Army. Negotiated the Danelaw boundary, reformed the English military with fortified towns (burhs), and began the reconquest of Viking-held England.',
  },
  {
    name: 'Cnut the Great',
    years: '~995–1035 CE',
    contribution:
      'Danish king who ruled England, Denmark, and Norway simultaneously — the North Sea Empire. Proved that a Viking king could be a sophisticated Christian ruler. His reign represented the peak of Scandinavian political power.',
  },
  {
    name: 'Freydís Eiríksdóttir',
    years: '~970s–?',
    contribution:
      'Daughter of Erik the Red, sister or half-sister of Leif Eriksson. Led her own expedition to Vinland. The sagas portray her as fierce and controversial — in one account, she terrifies attacking Indigenous warriors while heavily pregnant by baring her chest and beating a sword against it.',
  },
  {
    name: 'Ibn Fadlan',
    years: '~879–960 CE',
    contribution:
      'Arab traveler and diplomat who encountered Vikings (Rus) on the Volga River in 921–922 CE. His account — one of the most detailed outside descriptions of Viking culture — describes their appearance, hygiene, trading practices, and an elaborate ship burial that remains one of our most important primary sources.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: e.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.85rem', color: SLATE, fontWeight: 600 }}>{e.year}</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{e.title}</h4>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ entries }: { entries: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.label}
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>{e.label}</h4>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ entries }: { entries: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.name}
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: FIGURE_COLORS[i % FIGURE_COLORS.length], margin: '0 0 2px' }}>
            {e.name}
          </h4>
          <p style={{ fontSize: '0.82rem', color: SLATE, margin: '0 0 8px' }}>{e.years}</p>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.contribution}</p>
        </motion.div>
      ))}
    </div>
  );
}

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
  intro?: string;
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{icon}</span> {title}
        </h2>
        {intro && (
          <p style={{ fontSize: '0.93rem', color: ASH, lineHeight: 1.7, margin: '0 0 24px', maxWidth: 720 }}>{intro}</p>
        )}
      </motion.div>
      {children}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function VikingAgePage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (root) root.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
          ← Back to Timeline
        </Link>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ margin: '40px 0 48px' }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 20px',
              background: `linear-gradient(135deg, ${FROST}, ${AMBER})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Not Just Raiders — The Viking Age (793–1066 CE)
          </h1>

          <p style={{ fontSize: '1rem', color: ASH, lineHeight: 1.75, margin: '0 0 16px', maxWidth: 760 }}>
            The popular image of Vikings — horned helmets, drunken savages burning villages — is almost entirely wrong.
            The real story is far more interesting: a seafaring civilization that reached four continents, founded nations
            that still exist, permanently shaped the English language, and built ships so advanced that their design principles
            weren't surpassed for centuries.
          </p>
          <p style={{ fontSize: '1rem', color: ASH, lineHeight: 1.75, margin: 0, maxWidth: 760 }}>
            "Viking" wasn't an ethnicity — it was a job description. The vast majority of Norse people were farmers,
            merchants, and craftsmen. But the ones who went "a-viking" changed the world.
          </p>
        </motion.div>

        {/* ── Key Stats ─────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14, marginBottom: 48 }}>
          {KEY_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.color}33`,
                borderRadius: 10,
                padding: '14px 18px',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: SLATE, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: ASH, marginTop: 2 }}>{s.context}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Callout: Horned Helmets ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${IRON}18`,
            borderLeft: `3px solid ${IRON}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 48,
          }}
        >
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            "No Viking-era helmet with horns has ever been found. The image was invented by 19th-century opera designers
            and Romantic painters. Actual Viking helmets were practical iron or leather — because horns on a helmet in
            combat would be idiotic."
          </p>
        </motion.div>

        {/* ── Section 1: Who Were the Vikings? ─────────────────────────────── */}
        <SectionWrapper
          id="who"
          icon="⚔"
          title="Who Were the Vikings?"
          accentColor={FROST}
          intro="Debunking the myths: the real Norsemen were farmers, merchants, poets, and lawmakers — not the savage barbarians of popular imagination."
        >
          <InsightGrid entries={WHO_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 2: Origins and Context ────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🌊"
          title="Origins and Context"
          accentColor={SEA_GREEN}
          intro="Why did the Viking Age happen when it did? A combination of population pressure, technological advantage, climate conditions, and fragmented targets."
        >
          <InsightGrid entries={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 3: The Longship ──────────────────────────────────────── */}
        <SectionWrapper
          id="longship"
          icon="⛵"
          title="The Longship — Technology That Changed the World"
          accentColor={OAK}
          intro="The longship was the defining technology of the Viking Age. No other vessel in the medieval world could cross the open Atlantic AND navigate shallow rivers. It made everything else possible."
        >
          <InsightGrid entries={LONGSHIP_INSIGHTS} />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${OAK}18`,
              borderLeft: `3px solid ${OAK}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
              A fully loaded longship drew just 50cm of water — shallow enough to sail up almost any river in Europe.
              This meant Vikings could strike Paris, London, or Kiev and be gone before any army could respond.
              The longship was the stealth bomber of the medieval world.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 4: The Raids Begin ────────────────────────────────────── */}
        <SectionWrapper
          id="raids"
          icon="🔥"
          title="The Raids Begin (793–865 CE)"
          accentColor={CRIMSON}
          intro="It started with a single raid on an English monastery. Within decades, no coast in Europe was safe."
        >
          <TimelineCard entries={RAIDS_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 5: Exploration and Settlement ─────────────────────────── */}
        <SectionWrapper
          id="exploration"
          icon="🧭"
          title="Exploration and Settlement"
          accentColor={GOLD}
          intro="Vikings didn't just raid — they explored, traded, and settled across four continents. Their geographic reach, from Newfoundland to Baghdad, is one of the most extraordinary stories in human history."
        >
          <TimelineCard entries={EXPLORATION_TIMELINE} />

          {/* Vinland callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${GOLD}18`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>500 years before Columbus:</strong> The archaeological site at L'Anse aux Meadows in Newfoundland,
              discovered in 1960 by Helge and Anne Stine Ingstad, includes remains of eight Norse buildings, a smithy,
              and Scandinavian-style artifacts. It is the only confirmed Norse site in North America — and proof that
              Europeans reached the New World half a millennium before Columbus sailed.
            </p>
          </motion.div>

          {/* Geographic reach callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${AMBER}18`,
              borderLeft: `3px solid ${AMBER}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 16,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
              <strong>Newfoundland to Baghdad:</strong> Viking artifacts have been found from L'Anse aux Meadows in
              Newfoundland to graves along the Volga River in Russia. Arab silver dirhams are among the most common
              archaeological finds in Scandinavia. A single trade network connected Dublin, York, Hedeby, Novgorod,
              Kiev, Constantinople, and Baghdad — spanning 6,000+ miles.
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── Section 6: Viking Society ─────────────────────────────────────── */}
        <SectionWrapper
          id="society"
          icon="⚖"
          title="Viking Society"
          accentColor={TEAL}
          intro="Norse society was stratified but surprisingly progressive in some ways — democratic assemblies, property rights for women, and a rich literary and mythological tradition."
        >
          <InsightGrid entries={SOCIETY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Section 7: The Normans ────────────────────────────────────────── */}
        <SectionWrapper
          id="normans"
          icon="🏰"
          title="The Normans — Vikings Who Became French"
          accentColor={AMBER}
          intro="Perhaps the most remarkable Viking legacy: the Norse raiders who settled in France, adopted French culture, and then conquered England, Sicily, and southern Italy — reshaping European civilization."
        >
          <TimelineCard entries={NORMANS_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 8: The End of the Viking Age ─────────────────────────── */}
        <SectionWrapper
          id="end"
          icon="⚰"
          title="The End of the Viking Age (1066)"
          accentColor={STORM}
          intro="The Viking Age ended in a single year — 1066 — with two battles fought three weeks apart, both involving descendants of Vikings."
        >
          <TimelineCard entries={END_TIMELINE} />
        </SectionWrapper>

        {/* ── Section 9: Legacy ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌍"
          title="Legacy"
          accentColor={INDIGO}
          intro="The Viking Age lasted 273 years. Its effects are still everywhere — in the English language, in the names of nations, in the days of the week."
        >
          <InsightGrid entries={LEGACY_INSIGHTS} />

          {/* Old Norse words callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${INDIGO}18`,
              borderLeft: `3px solid ${INDIGO}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: '0 0 12px' }}>
              <strong>English words from Old Norse you use every day:</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['sky', 'window', 'knife', 'egg', 'husband', 'anger', 'wrong', 'ugly', 'die', 'take', 'get', 'give', 'call', 'want', 'they', 'them', 'their', 'skin', 'skull', 'leg', 'freckle', 'club', 'slaughter', 'birth', 'happy', 'trust', 'law'].map((word) => (
                <span
                  key={word}
                  style={{
                    backgroundColor: `${INDIGO}22`,
                    border: `1px solid ${INDIGO}44`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: '0.85rem',
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </motion.div>
        </SectionWrapper>

        {/* ── Key Figures ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={ROSE}
          intro="Warriors, explorers, diplomats, and chroniclers — the individuals who shaped the Viking Age."
        >
          <FigureGrid entries={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Continue the Story ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 16px' }}>
            Continue the Story
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/byzantine-empire', label: 'The Byzantine Empire' },
              { to: '/british-empire', label: 'The British Empire' },
              { to: '/american-revolution', label: 'The American Revolution' },
              { to: '/korean-war', label: 'The Korean War' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: FROST,
                  textDecoration: 'none',
                  backgroundColor: `${FROST}15`,
                  border: `1px solid ${FROST}33`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: SLATE, fontStyle: 'italic', margin: '0 0 16px' }}>
            "Never before has such terror appeared in Britain as we have now suffered from a pagan race."
            <br />
            — Alcuin of York, on the raid at Lindisfarne, 793 CE
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
