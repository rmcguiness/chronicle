import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#6b3fa0';   // Imperial purple — Tyrian purple was reserved for emperors
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(107,63,160,0.05)';
const CARD_BORDER = 'rgba(107,63,160,0.18)';
const IMPERIAL_PURPLE = '#6b3fa0';
const GOLD = '#c9a84c';         // Byzantine gold mosaics and coinage
const CRIMSON = '#9b2226';      // Imperial crimson
const TEAL = '#1a8a7d';         // Eastern Mediterranean
const OLIVE = '#6b8e23';        // Anatolian landscape
const NAVY = '#1a5276';         // Bosporus waters
const BRONZE = '#8d6e63';       // Icons and relics
const FLAME = '#c2452d';        // Greek fire

/* ───────── Types ───────── */
type SectionTab =
  | 'overview'
  | 'timeline'
  | 'constantinople'
  | 'justinian'
  | 'figures'
  | 'theodora'
  | 'greekfire'
  | 'schism'
  | 'art'
  | 'fall'
  | 'legacy';

interface TimelinePeriod {
  era: string;
  dates: string;
  events: string[];
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

const OVERVIEW_TEXT = 'When Rome "fell" in 476 CE, it didn\'t — not really. The Eastern Roman Empire, ruled from Constantinople, survived for another 977 years. We call it the Byzantine Empire today, but its citizens called themselves Romans (Romaioi) until the very end. Greek-speaking, Christian, and astonishingly resilient, Byzantium preserved Roman law, Greek philosophy, and Christian theology while Western Europe descended into fragmentation. It was the longest-lasting empire in European history, and its influence — on religion, law, art, and the Renaissance itself — is still felt today.';

const TIMELINE_PERIODS: TimelinePeriod[] = [
  {
    era: 'Founding & Early Period',
    dates: '330–491 CE',
    events: [
      '330 — Constantine I refounds Byzantium as Constantinople, the "New Rome," making it the eastern capital of the Roman Empire',
      '380 — Theodosius I makes Christianity the official state religion of the entire Roman Empire',
      '395 — Theodosius I dies, permanently splitting the empire between his sons: Arcadius (East) and Honorius (West)',
      '410 — Visigoths sack Rome; Constantinople is untouched, reinforcing the East\'s growing dominance',
      '476 — Last Western Roman emperor Romulus Augustulus deposed; Eastern Empire continues uninterrupted',
      '451 — Council of Chalcedon defines Orthodox Christian doctrine; Constantinople recognized as second in honor after Rome',
    ],
    color: IMPERIAL_PURPLE,
  },
  {
    era: 'The Justinian Era',
    dates: '527–565 CE',
    events: [
      '527 — Justinian I becomes emperor, beginning the most ambitious reign in Byzantine history',
      '532 — Nika riots nearly overthrow Justinian; Empress Theodora convinces him to stay and fight — 30,000 rioters killed',
      '533–534 — Belisarius reconquers North Africa from the Vandals in a lightning campaign',
      '535–554 — Gothic War: Belisarius and Narses reconquer Italy, devastating the peninsula in the process',
      '537 — Hagia Sophia completed in just 5 years — the largest cathedral in the world for nearly 1,000 years',
      '541–549 — Plague of Justinian kills 25–50 million people, the first recorded bubonic plague pandemic',
      '529–534 — Corpus Juris Civilis compiled — the codification of Roman law that remains the basis of civil law worldwide',
    ],
    color: GOLD,
  },
  {
    era: 'Survival & Crisis',
    dates: '565–867 CE',
    events: [
      '602–628 — Devastating war with Sassanid Persia; Heraclius recovers the True Cross from Jerusalem',
      '634–718 — Arab conquests strip away Syria, Palestine, Egypt, and North Africa — half the empire lost',
      '674–678 — First Arab siege of Constantinople; Greek fire deployed to devastating effect, saving the city',
      '717–718 — Second Arab siege of Constantinople fails; Leo III uses Greek fire and harsh winter to destroy Arab fleet',
      '726–843 — Iconoclasm controversy: bitter debate over whether religious images (icons) constitute idolatry',
      '800 — Charlemagne crowned "Emperor of the Romans" in Rome — Byzantines consider this an insult to their legitimacy',
    ],
    color: FLAME,
  },
  {
    era: 'The Macedonian Renaissance',
    dates: '867–1025 CE',
    events: [
      '867 — Basil I founds the Macedonian dynasty, beginning Byzantium\'s cultural and military golden age',
      '941 — Rus\' siege of Constantinople repelled; Greek fire destroys the Rus\' fleet',
      '963–969 — Nikephoros II Phokas reconquers Crete, Cyprus, and Antioch from the Arabs',
      '976–1025 — Basil II "the Bulgar Slayer" rules — the empire reaches its greatest medieval extent',
      '1014 — Basil II defeats the Bulgarian Empire at Kleidion; allegedly blinds 15,000 prisoners, sending them home in groups of 100 led by one-eyed men',
      '988 — Prince Vladimir of Kyiv converts to Orthodox Christianity after being awed by the Hagia Sophia — Russia becomes culturally Byzantine',
    ],
    color: TEAL,
  },
  {
    era: 'Decline & Catastrophe',
    dates: '1025–1261 CE',
    events: [
      '1054 — The Great Schism: Catholic West and Orthodox East formally split, dividing Christianity permanently',
      '1071 — Battle of Manzikert: Seljuk Turks crush the Byzantine army and capture Emperor Romanos IV — Anatolia begins to be lost',
      '1095 — Emperor Alexios I appeals to the West for military help; Pope Urban II launches the First Crusade instead',
      '1182 — Massacre of the Latins: Constantinople\'s populace murders thousands of Western merchants, deepening East-West hatred',
      '1204 — Fourth Crusade sacks Constantinople — fellow Christians loot and destroy the greatest city in Christendom for three days',
      '1204–1261 — Latin Empire occupies Constantinople; Byzantine successor states (Nicaea, Trebizond, Epirus) keep the flame alive',
    ],
    color: CRIMSON,
  },
  {
    era: 'The Final Centuries',
    dates: '1261–1453 CE',
    events: [
      '1261 — Michael VIII Palaiologos recaptures Constantinople and restores the Byzantine Empire — but it is a shadow of its former self',
      '1341–1347 — Byzantine civil war further weakens the empire; Ottomans invited in as allies begin permanent settlement in Europe',
      '1347–1348 — Black Death reaches Constantinople, killing roughly half the population',
      '1389 — Battle of Kosovo: Ottoman victory over the Serbs leaves Byzantium increasingly isolated',
      '1422 — Ottomans besiege Constantinople but fail to breach the Theodosian Walls',
      '1453 — Mehmed II conquers Constantinople with massive cannons and 80,000 troops; Constantine XI dies fighting on the walls; the Byzantine Empire ends after 1,123 years',
    ],
    color: NAVY,
  },
];

const CONSTANTINOPLE = {
  overview: 'Constantinople was the greatest city in the medieval world — and nearly impregnable for over 1,000 years. Founded by Constantine I in 330 CE on the site of ancient Byzantium, it sat on a peninsula at the crossroads of Europe and Asia, controlling the straits between the Mediterranean and Black Sea. At its peak, it held over 500,000 people when London had perhaps 15,000.',
  defenses: [
    { title: 'The Theodosian Walls', detail: 'Built in the 5th century, the Theodosian Walls were the most formidable fortification in the world: a triple line of walls up to 12 meters high, fronted by a 20-meter-wide moat. The outer wall had 96 towers; the inner wall was even taller. No army breached them until 1204 (by treachery) and 1453 (by cannons). For a millennium they were the gold standard of military architecture.', icon: '🏰', color: BRONZE },
    { title: 'The Golden Horn', detail: 'The natural harbor on Constantinople\'s north side was protected by a massive iron chain stretched across its mouth. When raised, no enemy fleet could enter. The chain was breached only twice in 1,100 years — and the second time, in 1453, the Ottomans dragged their ships overland to bypass it.', icon: '⚓', color: NAVY },
    { title: 'Greek Fire', detail: 'Byzantium\'s secret weapon: a napalm-like incendiary that burned on water. Projected from siphons mounted on ships, it terrified enemies. The formula was so closely guarded that it has been lost to history. Greek fire broke the Arab sieges of 674–678 and 717–718, saving the empire — and possibly Western civilization.', icon: '🔥', color: FLAME },
    { title: 'Strategic Location', detail: 'Surrounded by water on three sides (Sea of Marmara, Bosporus, Golden Horn), Constantinople could only be attacked by land from the west — where the Theodosian Walls waited. It controlled the only sea route between the Mediterranean and Black Sea, making it fabulously wealthy from trade tolls and customs.', icon: '🗺️', color: TEAL },
  ],
  population: 'At its peak in the 6th century, Constantinople had roughly 500,000–800,000 inhabitants, making it the largest city in the world. By comparison, Rome had shrunk to around 50,000, Paris had perhaps 20,000, and London fewer than 15,000. The city had forums, aqueducts, hippodromes, public baths, hospitals, and the largest library in the world — it was the continuation of Roman urban civilization while the West had largely lost it.',
};

const JUSTINIAN = {
  overview: 'Justinian I (r. 527–565) was the most ambitious Byzantine emperor — a peasant\'s nephew who rose to rule, dreamed of restoring the full Roman Empire, and very nearly succeeded. His reign saw the greatest territorial extent, the most magnificent architecture, the most lasting legal codification, and the most devastating plague in Byzantine history.',
  reconquest: {
    overview: 'Justinian\'s general Belisarius — one of history\'s greatest commanders — reconquered North Africa from the Vandals in just two years (533–534). He then invaded Italy, beginning the long Gothic War (535–554) that reconquered the peninsula but devastated it in the process. Byzantine forces also recaptured southern Spain. For the first time in 80 years, the Mediterranean was again a "Roman lake."',
    cost: 'The reconquests were enormously expensive in money, manpower, and destruction. Italy was ruined — Rome was besieged and sacked multiple times, its aqueducts cut, and its population reduced to around 30,000. North Africa and Italy would both be lost within a century. In retrospect, Justinian\'s western wars overstretched the empire and left its eastern frontier vulnerable.',
  },
  hagiaSophia: {
    overview: 'The Hagia Sophia (Holy Wisdom) is Justinian\'s greatest legacy — a cathedral so magnificent that when he entered it for the first time, he reportedly exclaimed: "Solomon, I have surpassed thee!" Built in just 5 years and 10 months (532–537), it remained the largest cathedral in the world for nearly 1,000 years.',
    engineering: 'Designed by mathematicians Anthemius of Tralles and Isidore of Miletus (not architects but scientists), the Hagia Sophia features a massive central dome 31 meters in diameter, seemingly floating 55 meters above the floor on a ring of 40 windows. The dome rests on pendentives — a revolutionary engineering solution that allows a circular dome to sit on a square base. The interior is covered in 30 million gold mosaic tiles. When the dome partially collapsed in 558 (from an earthquake), it was rebuilt even higher.',
    significance: 'The Hagia Sophia was the spiritual center of Orthodox Christianity for 916 years (537–1453). After the Ottoman conquest, it became a mosque (1453–1934), then a museum (1934–2020), and is now a mosque again. Its architectural influence is immeasurable — it inspired the Blue Mosque in Istanbul, countless Orthodox churches, and even the US Capitol building\'s dome.',
  },
  code: {
    overview: 'The Corpus Juris Civilis (Body of Civil Law), compiled between 529 and 534, was Justinian\'s most lasting achievement. It gathered, organized, and codified nearly 1,000 years of Roman legal thought into a coherent system.',
    components: [
      'Codex Justinianus — all existing imperial laws, organized by subject and stripped of contradictions',
      'Digest (Pandectae) — excerpts from the writings of great Roman jurists, organized into 50 books',
      'Institutes — a textbook for law students, still readable and remarkably modern in structure',
      'Novellae — new laws issued by Justinian himself, many protecting women\'s property rights and regulating the church',
    ],
    legacy: 'When Western Europe rediscovered the Corpus Juris Civilis in the 11th century, it revolutionized European law. It became the foundation of civil law systems used today in continental Europe, Latin America, much of Asia and Africa — roughly 60% of the world\'s legal systems trace their roots to Justinian\'s Code. Concepts we take for granted — innocent until proven guilty, the right to a fair trial, contract law, property rights — were codified here.',
  },
  plague: {
    overview: 'The Plague of Justinian (541–549, with recurrences until 750) was the first recorded pandemic of bubonic plague and one of the deadliest events in human history. It arrived from Egypt in 541, carried by rats on grain ships.',
    impact: 'At its peak in Constantinople, the plague killed 5,000–10,000 people per day. Bodies piled in streets and were loaded onto ships and dumped at sea. Justinian himself caught the plague but survived. Estimates suggest 25–50 million died across the Mediterranean world — roughly 25–50% of the Eastern Roman Empire\'s population. The plague shattered Justinian\'s reconquest plans, devastated the economy, and left the empire fatally weakened against the Arab invasions that came a century later.',
  },
};

const KEY_FIGURES: Figure[] = [
  { name: 'Constantine I (the Great)', dates: '272–337', role: 'Founder of Constantinople; first Christian emperor', contribution: 'Refounded Byzantium as Constantinople, making it the eastern capital and setting the stage for the Byzantine Empire', detail: 'Constantine won the Battle of the Milvian Bridge (312) after reportedly seeing a cross in the sky. He legalized Christianity (Edict of Milan, 313), convened the Council of Nicaea (325) to settle Christian doctrine, and built Constantinople as a "New Rome" — a Christian city with no pagan temples. Whether his conversion was genuine or political, it transformed world history: Christianity went from persecuted minority to imperial religion within a generation.', icon: '✝️', color: GOLD },
  { name: 'Theodosius I', dates: '347–395', role: 'Last emperor to rule both East and West', contribution: 'Made Christianity the sole state religion and permanently divided the empire between his sons', detail: 'Theodosius banned pagan worship (391), closed temples, and ended the Olympic Games. On his deathbed in 395, he divided the empire between his sons Arcadius (East) and Honorius (West). This division, intended as administrative, became permanent — the West fell within 80 years while the East endured for over a millennium. Theodosius also submitted to Bishop Ambrose\'s authority after the Massacre of Thessalonica, establishing the principle that emperors were subject to church moral authority.', icon: '⚖️', color: IMPERIAL_PURPLE },
  { name: 'Justinian I', dates: '482–565', role: 'Emperor who nearly restored the full Roman Empire', contribution: 'Reconquered the West, built the Hagia Sophia, codified Roman law, survived the worst plague in history', detail: 'Born a peasant\'s nephew in the Balkans, Justinian rose through his uncle Justin\'s patronage to become the most ambitious Byzantine emperor. His general Belisarius reconquered North Africa and Italy. His jurists compiled the Corpus Juris Civilis. His architects built the Hagia Sophia. But the Plague of Justinian (541) and the cost of his wars left the empire exhausted. He is remembered as either the last great Roman emperor or the man who overstretched Byzantium into decline.', icon: '👑', color: GOLD },
  { name: 'Empress Theodora', dates: 'c. 497–548', role: 'Co-ruler with Justinian; saved the empire during the Nika riots', contribution: 'Former actress who became the most powerful woman in Roman history and champion of women\'s rights', detail: 'Born into the lowest class of Byzantine society (her father was a bear-keeper at the Hippodrome), Theodora became an actress — a profession considered barely above prostitution. She met Justinian, who changed the law to marry her. During the Nika riots (532), when Justinian prepared to flee, Theodora declared: "Purple makes a fine shroud" — convincing him to stay and crush the revolt. She passed laws protecting women from forced prostitution, expanded divorce rights for women, and established homes for former prostitutes. She was Justinian\'s equal partner in governing.', icon: '👸', color: IMPERIAL_PURPLE },
  { name: 'Belisarius', dates: 'c. 505–565', role: 'Greatest Byzantine general', contribution: 'Conquered North Africa and Italy with impossibly small armies', detail: 'Belisarius was one of history\'s greatest military commanders. He conquered Vandal North Africa with just 15,000 men, recaptured Rome, and defended it against 150,000 Goths with 5,000 soldiers. His tactical brilliance was legendary — but Justinian, fearful of his popularity, repeatedly recalled and undermined him. Despite his loyalty, Belisarius was accused of conspiracy in his old age. The legend that he was blinded and reduced to begging ("Give a coin to Belisarius") is almost certainly myth, but it captures the tragedy of how empires treat their greatest servants.', icon: '⚔️', color: CRIMSON },
  { name: 'Heraclius', dates: 'c. 575–641', role: 'Emperor who saved and then lost half the empire', contribution: 'Defeated Sassanid Persia in an epic campaign, then lost Syria, Egypt, and Palestine to the Arab conquests', detail: 'Heraclius seized the throne in 610 when the empire was on the verge of collapse — Persians had conquered Syria, Egypt, and Jerusalem, taking the True Cross. In a brilliant campaign (622–628), Heraclius marched deep into Persia and forced a peace, recovering all lost territory. But the long wars had exhausted both empires. Within a decade of his triumph, the newly united Arab Muslims burst out of Arabia and conquered the very provinces Heraclius had just recovered. He died in 641, watching his life\'s work unravel.', icon: '🏇', color: OLIVE },
  { name: 'Basil II "the Bulgar Slayer"', dates: '958–1025', role: 'Greatest warrior-emperor of the Macedonian dynasty', contribution: 'Expanded the empire to its greatest medieval extent through 50 years of constant warfare', detail: 'Basil II came to the throne as a child and spent his first 20 years fighting off powerful aristocratic generals who tried to rule through him. Once he took personal control, he proved the most formidable warrior-emperor since Justinian. His 30-year war against Bulgaria ended with the Battle of Kleidion (1014), where he allegedly blinded 15,000 Bulgarian prisoners and sent them home in groups of 100, each led by a one-eyed man. Bulgarian Tsar Samuel reportedly died of shock at the sight. Basil never married, lived austerely, and left the treasury overflowing — but no heir, beginning the empire\'s decline.', icon: '🗡️', color: CRIMSON },
  { name: 'Anna Komnene', dates: '1083–1153', role: 'Princess, scholar, historian', contribution: 'Wrote the Alexiad, one of the great historical works of the medieval period', detail: 'The daughter of Emperor Alexios I, Anna Komnene was one of the most educated women of the medieval world. She studied philosophy, medicine, mathematics, and history. After failing in a plot to seize the throne from her brother John II, she was exiled to a convent where she wrote the Alexiad — a history of her father\'s reign and the First Crusade. It is one of our primary sources for the Crusades from the Byzantine perspective and one of the first major historical works by a woman.', icon: '📚', color: IMPERIAL_PURPLE },
  { name: 'Alexios I Komnenos', dates: '1048–1118', role: 'Emperor who stabilized a crumbling empire and triggered the Crusades', contribution: 'Restored Byzantine power after Manzikert and inadvertently launched the Crusades by appealing to the West for help', detail: 'Alexios inherited an empire in crisis after Manzikert (1071) had opened Anatolia to the Seljuk Turks. Through diplomacy, strategic marriages, and careful military campaigns, he stabilized the frontiers. His 1095 appeal to Pope Urban II for mercenary soldiers backfired spectacularly — instead of a few thousand troops, he got the First Crusade: 60,000 armed Western Europeans who proved as dangerous to Byzantium as the Turks. His daughter Anna wrote the Alexiad partly to defend his legacy.', icon: '🛡️', color: NAVY },
  { name: 'Mehmed II "the Conqueror"', dates: '1432–1481', role: 'Ottoman sultan who conquered Constantinople', contribution: 'Ended the Byzantine Empire by breaching the "impregnable" walls of Constantinople in 1453', detail: 'Mehmed became sultan at 21 with a single obsession: taking Constantinople. He built the fortress of Rumeli Hisarı to control the Bosporus, commissioned the Hungarian engineer Orban to build the largest cannons ever made (one was 27 feet long and fired 600-pound stone balls), dragged 70 ships overland to bypass the Golden Horn chain, and finally breached the Theodosian Walls on May 29, 1453. He then preserved much of the city, repopulated it, and made it the Ottoman capital — Istanbul — that it remains today.', icon: '🏹', color: FLAME },
  { name: 'Constantine XI Palaiologos', dates: '1405–1453', role: 'Last Byzantine emperor', contribution: 'Died fighting on the walls during the fall of Constantinople — the last Roman emperor', detail: 'Constantine XI became emperor of a dying state — by 1449, the "empire" was little more than Constantinople itself and a few scraps of the Peloponnese. When Mehmed II besieged the city with 80,000 troops, Constantine had only 7,000 defenders. He refused offers of safe passage and reportedly charged into the Ottoman ranks during the final assault on May 29, 1453. His body was never identified. Greek legend holds that he was turned to marble by an angel and sleeps beneath the Golden Gate, waiting to rise and reclaim the city.', icon: '🏛️', color: GOLD },
  { name: 'Empress Irene of Athens', dates: 'c. 752–803', role: 'First woman to rule the Roman Empire in her own right', contribution: 'Ended iconoclasm (temporarily) and was the first woman to hold the title of emperor (basileus)', detail: 'Irene served as regent for her son Constantine VI, then deposed and blinded him to rule alone — the first woman to hold imperial power in her own name. She styled herself basileus (emperor, masculine) rather than basilissa (empress). She convened the Second Council of Nicaea (787), which restored icon veneration and temporarily ended the iconoclasm controversy. The West used her female rule as a pretext to crown Charlemagne "Emperor of the Romans" in 800, arguing that a woman couldn\'t be a real emperor.', icon: '🖼️', color: BRONZE },
];

const THEODORA_SPOTLIGHT = {
  earlyLife: 'Theodora was born around 497 CE into the lowest rung of Byzantine society. Her father, Acacius, was a bear-keeper at the Hippodrome — the great chariot-racing arena that was the center of Constantinople\'s public life. When he died, her mother pushed Theodora and her sisters onto the stage. In Byzantium, "actress" was essentially synonymous with prostitute. The historian Procopius (who hated her) wrote scandalous accounts of her early life in his Secret History — almost certainly exaggerated, but reflecting the reality that she rose from absolute nothing.',
  transformation: 'Theodora traveled to North Africa, possibly as a courtesan, then experienced a religious conversion in Alexandria and returned to Constantinople as a wool-spinner — a respectable but humble trade. There she met Justinian, then heir to the throne. He fell deeply in love with her, but Roman law prohibited senators from marrying actresses. Justinian had his uncle, Emperor Justin I, change the law. They married around 525 and Justinian never took another wife or consort — extraordinary for a Roman emperor.',
  nikaRiots: 'The defining moment of Theodora\'s life came during the Nika riots of January 532. The chariot-racing factions (Blues and Greens) united in revolt against Justinian\'s heavy taxation. The rioters burned much of Constantinople, crowned a rival emperor, and surrounded the palace. Justinian and his advisors prepared to flee by ship. Theodora stood and delivered the speech that saved the empire: "Those who have worn the crown should never survive its loss. Purple makes a fine shroud." Justinian stayed. His general Belisarius trapped the rioters in the Hippodrome and slaughtered 30,000 of them. The revolt was over — and Theodora had proved herself the strongest person in the room.',
  legislation: 'Theodora used her power to champion women\'s rights in ways revolutionary for the era. She passed laws prohibiting forced prostitution and trafficking of young girls. She established the Metanoia (Repentance), a home on the Asian shore of the Bosporus where former prostitutes could live in dignity. She expanded women\'s property and inheritance rights. She gave women more grounds for divorce and greater custody rights over children. She made rape a capital offense. Many of these protections were centuries ahead of their time.',
  legacy: 'Theodora died of cancer in 548, seventeen years before Justinian. He was devastated and never fully recovered. She appears beside him in the famous mosaics of the Basilica of San Vitale in Ravenna — depicted in imperial purple and jewels, with her own court, as an equal ruler. No other Roman empress received such treatment. Theodora proved that in Byzantium, unlike Western Europe, a woman of the lowest birth could rise to the highest power through intelligence, courage, and force of will.',
};

const GREEK_FIRE = {
  overview: 'Greek fire was the Byzantine Empire\'s most devastating and mysterious weapon — a napalm-like incendiary substance that burned on water, could not be extinguished by normal means, and terrified every enemy who faced it. It was Byzantium\'s closest thing to a nuclear deterrent.',
  whatItWas: 'Greek fire (called "sea fire," "Roman fire," or "liquid fire" by the Byzantines) was a combustible compound projected through bronze siphons mounted on the prows of ships. It ignited on contact and burned on water — possibly even burned more fiercely when doused with water. The exact composition is unknown, but historians believe it was based on crude petroleum (naphtha), combined with quicklime, sulfur, and possibly pine resin. The key innovation was the pressurized delivery system — essentially a medieval flamethrower.',
  howUsed: 'Greek fire was primarily a naval weapon. Byzantine warships (dromons) carried siphons that could spray the burning liquid at enemy vessels. It was also used in hand grenades (ceramic pots), in defensive positions on the walls of Constantinople, and even in land battles. The psychological effect was as important as the physical damage — enemies who saw ships burst into unquenchable flames often broke and fled before the substance could even reach them.',
  keyBattles: [
    { battle: 'First Arab Siege of Constantinople (674–678)', detail: 'Greek fire was deployed for the first time (or first effectively) during the Arab siege. The Byzantine navy used it to destroy the Arab fleet, breaking the siege and saving the empire. Without Greek fire, Constantinople would likely have fallen to the Umayyad Caliphate — and the history of Europe would be unrecognizable.', color: FLAME },
    { battle: 'Second Arab Siege (717–718)', detail: 'Emperor Leo III deployed Greek fire along with the harsh winter to destroy the massive Arab fleet (reportedly 1,800 ships). The defeat ended Arab attempts to conquer Constantinople for centuries and marked the beginning of the Umayyad Caliphate\'s decline.', color: CRIMSON },
    { battle: 'Rus\' Attacks (941, 1043)', detail: 'When the Kievan Rus\' launched raids on Constantinople, Greek fire destroyed their fleets. The 941 attack by Igor of Kyiv was devastated by Greek fire — the terrified Rus\' survivors described it as "lightning from heaven."', color: NAVY },
  ],
  lostFormula: 'The formula for Greek fire was one of the most closely guarded state secrets in history. It was known only to the emperor and a small group of technicians from the Kallinikos family (named after its supposed inventor, a Syrian refugee from Heliopolis). The secret was so tightly held that it was eventually lost — probably during the chaos of the Fourth Crusade (1204) or the subsequent Latin occupation. Despite centuries of modern analysis, no one has definitively recreated the exact formula. The loss of Greek fire is one of the great mysteries of military history.',
};

const GREAT_SCHISM = {
  overview: 'The Great Schism of 1054 permanently split Christianity into Roman Catholic (West) and Eastern Orthodox (East). While the formal break came in a single dramatic confrontation, it was the culmination of centuries of growing theological, political, cultural, and linguistic differences between Latin-speaking Rome and Greek-speaking Constantinople.',
  causes: [
    { title: 'The Filioque Controversy', detail: 'The original Nicene Creed stated that the Holy Spirit "proceeds from the Father." The Western church unilaterally added "and the Son" (filioque in Latin) without an ecumenical council\'s approval. To the East, this was both a theological error and an unacceptable breach of church governance — no one bishop (not even the Pope) had the right to change the creed alone.', icon: '📖', color: IMPERIAL_PURPLE },
    { title: 'Papal Supremacy vs. Pentarchy', detail: 'Rome claimed the Pope had supreme authority over all Christians as the successor of St. Peter. Constantinople believed in the "pentarchy" — five equal patriarchates (Rome, Constantinople, Alexandria, Antioch, Jerusalem) governing the church collectively. The East never accepted that one bishop could command the others.', icon: '⛪', color: GOLD },
    { title: 'Language and Culture', detail: 'By the 6th century, the Western church operated in Latin and the Eastern in Greek. Theological concepts that made perfect sense in one language were often untranslatable or misleading in the other. Communication broke down, and each side increasingly saw the other as foreign and heretical.', icon: '🗣️', color: TEAL },
    { title: 'Political Rivalry', detail: 'The coronation of Charlemagne as "Emperor of the Romans" in 800 infuriated Constantinople — there was already a Roman Emperor, and he lived in Constantinople. As the Frankish/Germanic West grew stronger, Rome\'s allegiance shifted from Constantinople to the new Western powers. Religion and politics became inseparable.', icon: '🏰', color: CRIMSON },
  ],
  theBreak: 'On July 16, 1054, Cardinal Humbert of Silva Candida marched into the Hagia Sophia during the Divine Liturgy and placed a papal bull of excommunication on the altar, denouncing Patriarch Michael I Cerularius. Cerularius responded by excommunicating the papal legates. It was a dramatic moment, though many at the time expected reconciliation. It never came. The mutual excommunications were not formally lifted until 1964.',
  consequences: 'The Schism divided the Christian world into two civilizational spheres that persist today. Western Europe followed Rome: Latin liturgy, papal authority, celibate clergy, Gothic cathedrals. Eastern Europe, Russia, and the Middle East followed Constantinople: Greek or Slavonic liturgy, conciliar governance, married parish priests, icon-filled churches with domed architecture. When the Fourth Crusade sacked Constantinople in 1204, the Schism became a wound that could not heal. Orthodox Christians today number approximately 260 million worldwide.',
};

const BYZANTINE_ART = {
  overview: 'Byzantine art is one of the most distinctive and influential artistic traditions in world history. Focused on the spiritual rather than the physical, it rejected Greco-Roman naturalism in favor of a transcendent, iconic style — flat, golden, otherworldly — that conveyed divine truth rather than human beauty. It shaped the art of Orthodox Christianity, medieval Europe, and the Italian Renaissance.',
  mosaics: {
    overview: 'Byzantine mosaics are the tradition\'s crowning achievement — millions of tiny tesserae (tiles of glass, stone, and gold leaf) arranged to create images of Christ, the Virgin Mary, saints, and emperors on the walls and ceilings of churches. The gold backgrounds symbolized divine light; the figures were deliberately stylized to appear heavenly rather than earthly.',
    examples: [
      { name: 'Hagia Sophia, Constantinople', detail: 'The interior was covered in gold mosaics, many added after the end of iconoclasm (843). The Deësis mosaic (Christ flanked by the Virgin and John the Baptist) in the upper gallery is considered one of the masterpieces of Byzantine art — the faces show a startling naturalism that anticipates the Renaissance.', color: GOLD },
      { name: 'San Vitale, Ravenna', detail: 'The 6th-century mosaics of San Vitale are the finest surviving examples of Justinianic art. The panels showing Justinian and Theodora with their courts — in full imperial purple, dripping with jewels — are iconic images of Byzantine power. They were created in Byzantine Italy and have survived virtually intact for 1,500 years.', color: IMPERIAL_PURPLE },
      { name: 'Chora Church (Kariye Camii), Constantinople', detail: 'Decorated in the early 14th century during the Palaiologan Renaissance, the Chora Church\'s mosaics and frescoes represent the final flowering of Byzantine art. The Anastasis (Resurrection) fresco — showing Christ pulling Adam and Eve from their tombs — is considered one of the greatest works of medieval art.', color: TEAL },
    ],
  },
  icons: 'Icons — painted images of Christ, the Virgin, and saints on wooden panels — were central to Byzantine devotion. They were not mere decorations but "windows to heaven," believed to be channels of divine grace. This belief triggered the Iconoclasm controversy (726–843): were icons legitimate aids to worship or idolatrous images forbidden by the Second Commandment? The iconoclasts (image-breakers) destroyed thousands of icons; the iconodules (image-venerators) ultimately won, and the Triumph of Orthodoxy (843) is still celebrated annually in Orthodox churches. The Russian icon tradition (Andrei Rublev\'s Trinity is its masterpiece) descends directly from Byzantine models.',
  preservation: 'Perhaps Byzantium\'s greatest cultural contribution was preserving the texts of ancient Greece and Rome. While Western Europe lost most of its classical literature, Byzantine scholars in Constantinople maintained libraries containing the works of Homer, Plato, Aristotle, Euclid, Ptolemy, Galen, and countless others. When Constantinople fell in 1453, Greek scholars fled west — carrying their manuscripts to Italy, where they fueled the Renaissance. Without Byzantium, we would have lost most of ancient Greek literature.',
};

const FALL_OF_CONSTANTINOPLE = {
  context: 'By 1453, the Byzantine "Empire" was a city-state. Constantinople itself, the Peloponnese, and a few Aegean islands were all that remained of what had once ruled from Spain to Mesopotamia. The Ottoman Empire surrounded it completely. Sultan Mehmed II, just 21 years old, was obsessed with taking the city that had resisted Muslim conquest for 800 years.',
  preparations: [
    { title: 'Mehmed\'s Cannons', detail: 'Mehmed commissioned the Hungarian engineer Orban to build the largest cannons ever constructed. The "Basilica" was 27 feet long, required 60 oxen and 200 men to transport, and fired 600-pound stone balls over a mile. It could fire only 7 times a day and eventually cracked from the strain, but it and dozens of smaller bombards systematically pounded the Theodosian Walls — which had been designed to resist medieval weapons, not gunpowder artillery.', icon: '💣', color: FLAME },
    { title: 'The Ottoman Fleet', detail: 'Mehmed assembled a fleet of over 100 ships to blockade the city from the sea. When the Golden Horn chain blocked access to the harbor, he ordered 70 ships dragged overland on greased logs — a distance of over a mile — to bypass the chain entirely. It was one of the most audacious engineering feats of the medieval period.', icon: '⛵', color: NAVY },
    { title: 'Byzantine Defenses', detail: 'Emperor Constantine XI had roughly 7,000 defenders (including 2,000 foreign volunteers, among them 700 Genoese under Giovanni Giustiniani) to hold 14 miles of walls against 80,000 Ottomans. The Venetians sent a small fleet. The hoped-for Western crusade never materialized — the Schism\'s legacy meant that Catholic Europe largely watched its Christian rival die.', icon: '🛡️', color: GOLD },
  ],
  siege: 'The siege began on April 6, 1453, and lasted 53 days. The massive Ottoman cannons battered the walls daily. Mehmed launched multiple assaults that were repulsed with heavy losses. Mining and counter-mining tunnels honeycombed the ground beneath the walls. The Byzantines used Greek fire (they still had some), boiling oil, and desperate courage. On April 20, four Christian ships fought through the entire Ottoman fleet to reach the harbor — a humiliation that enraged Mehmed.',
  finalAssault: 'At 1:30 AM on May 29, 1453, Mehmed launched the final assault in three waves. First came irregulars and conscripts — expendable troops meant to exhaust the defenders. Then came Anatolian regulars. Finally, the elite Janissaries attacked. When Giovanni Giustiniani, the Genoese commander, was wounded and carried from the walls, panic spread among the defenders. Ottoman soldiers found a small gate (the Kerkoporta) left open and poured through. Constantine XI reportedly threw off his imperial regalia and charged into the Ottoman ranks. His body was never found.',
  aftermath: 'Mehmed allowed three days of looting (standard practice for a city taken by assault). The Hagia Sophia was converted into a mosque. But Mehmed also preserved much of the city, repopulated it with people from across the Ottoman Empire, and made it his capital — Istanbul. The fall sent shockwaves through Christendom. Greek scholars fled west, carrying manuscripts that helped ignite the Italian Renaissance. The age of gunpowder had arrived — no wall, however ancient and mighty, could withstand the new artillery. The medieval world was over.',
};

const LEGACY = [
  { title: 'Orthodox Christianity', detail: 'Byzantium\'s most enduring legacy is the Orthodox Christian world it created. When Byzantine missionaries Cyril and Methodius brought Christianity to the Slavs (9th century), they also brought the Cyrillic alphabet, Byzantine art, and Byzantine political theory. Russia, Greece, Serbia, Bulgaria, Romania, Georgia, and Ukraine are all spiritual descendants of Constantinople. When Mehmed II conquered the city, Russia declared Moscow the "Third Rome" — heir to Byzantium\'s sacred mission. The Russian tsars (from "Caesar") modeled themselves on Byzantine emperors until 1917.', icon: '⛪', color: IMPERIAL_PURPLE },
  { title: 'Roman Law for the Modern World', detail: 'Justinian\'s Corpus Juris Civilis is the foundation of civil law systems used by roughly 60% of the world\'s countries today. When Italian scholars rediscovered the Code in the 11th century, it revolutionized European legal thought. Napoleonic Code, German civil law, and the legal systems of Latin America, East Asia, and much of Africa all descend from Justinian\'s compilation. Every time a modern court applies principles of contract law, property rights, or "innocent until proven guilty," it echoes Byzantine jurists.', icon: '⚖️', color: GOLD },
  { title: 'Preserving Classical Knowledge', detail: 'Byzantium was the custodian of ancient Greek and Roman civilization. While Western Europe lost most classical texts, Byzantine libraries preserved Homer, Plato, Aristotle, Euclid, Archimedes, Ptolemy, and hundreds of other authors. When Greek scholars fled Constantinople in 1453, they brought these manuscripts to Italy — directly fueling the Renaissance. Without Byzantium, the Western intellectual tradition would have enormous gaps. We owe our knowledge of classical philosophy, science, and literature largely to Byzantine copyists.', icon: '📚', color: TEAL },
  { title: 'Art and Architecture', detail: 'Byzantine artistic traditions — mosaics, icons, domed churches — influenced art from Russia to Sicily to Ethiopia. The Hagia Sophia\'s dome-on-pendentives design was copied by Ottoman mosques, Renaissance churches, and eventually secular buildings worldwide. The icon tradition spread throughout the Orthodox world and influenced Western painting through artists like Cimabue and Giotto, who transformed Byzantine conventions into the foundations of Renaissance art.', icon: '🎨', color: BRONZE },
  { title: 'Diplomacy and Statecraft', detail: 'Byzantium perfected the art of diplomacy — using marriage alliances, trade agreements, bribes, intelligence networks, and the carefully calibrated deployment of prestige (imperial ceremonies, gifts of silk and gold) to manage neighbors without warfare. The very word "byzantine" entered the English language to describe complex, subtle political maneuvering. Modern diplomacy owes more to Constantinople than to any other single source.', icon: '🤝', color: NAVY },
  { title: 'The Idea That Rome Never Fell', detail: 'The Byzantine Empire forces us to rethink the "fall of Rome" narrative. Rome didn\'t fall in 476 — it continued in the East for another millennium. The Byzantines were Romans: they called themselves Romans, their emperor was the Roman emperor, and their law was Roman law. The real end of Rome came in 1453, not 476. This challenges the tidy Western narrative of "ancient/medieval/modern" and reminds us that civilizations don\'t always decline on schedule.', icon: '🏛️', color: OLIVE },
];

/* ───────── Sub-components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${IMPERIAL_PURPLE}15`, border: `1px solid ${IMPERIAL_PURPLE}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: GOLD, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? IMPERIAL_PURPLE : CARD_BORDER}`,
        backgroundColor: active ? `${IMPERIAL_PURPLE}22` : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
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

/* ───────── Section tabs config ───────── */

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'What Was Byzantium?', icon: '🏛️' },
  { key: 'timeline', label: 'Timeline', icon: '📅' },
  { key: 'constantinople', label: 'Constantinople', icon: '🏰' },
  { key: 'justinian', label: 'Emperor Justinian', icon: '👑' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'theodora', label: 'Empress Theodora', icon: '👸' },
  { key: 'greekfire', label: 'Greek Fire', icon: '🔥' },
  { key: 'schism', label: 'Great Schism', icon: '⛪' },
  { key: 'art', label: 'Art & Culture', icon: '🎨' },
  { key: 'fall', label: 'Fall of Constantinople', icon: '💥' },
  { key: 'legacy', label: 'Legacy', icon: '🌍' },
];

/* ───────── Main Component ───────── */

export default function ByzantineEmpirePage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(107,63,160,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>&larr; Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${IMPERIAL_PURPLE}20`, border: `2px solid ${IMPERIAL_PURPLE}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${IMPERIAL_PURPLE}30` }}>🏛️</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${IMPERIAL_PURPLE}20`, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The Byzantine Empire &mdash; Rome Never Fell{' '}
            <span style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 400, color: TEXT_DIM }}>(330&ndash;1453 CE)</span>
          </h1>

          <p style={{ fontSize: 15, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 20, maxWidth: 750 }}>
            While Western Rome fell in 476 CE, the Eastern Roman Empire survived another 977 years. Greek-speaking, Christian, and astonishingly resilient, Byzantium preserved Roman law, Greek philosophy, and Christian theology &mdash; and its fall in 1453 helped ignite the Renaissance.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <StatBadge value="1,123" label="Years" />
            <StatBadge value="88" label="Emperors" />
            <StatBadge value="500K+" label="Peak Pop. (city)" />
            <StatBadge value="1453" label="Year of Fall" />
          </div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 6, position: 'sticky', top: 0, backgroundColor: BG, zIndex: 10 }}>
          {SECTION_TABS.map(t => (
            <TabButton key={t.key} label={t.label} icon={t.icon} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
          ))}
        </div>

        {/* ─── Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} style={{ padding: '28px 32px 64px' }}>

            {/* ════════ OVERVIEW ════════ */}
            {activeTab === 'overview' && (
              <div>
                <SectionHeader icon="🏛️" title="What Was the Byzantine Empire?" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{OVERVIEW_TEXT}</p>
                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Key Insight</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>
                    The term "Byzantine Empire" was invented by historians in the 16th century &mdash; centuries after the empire fell. The Byzantines never called themselves "Byzantine." They were <em>Romans</em> (Romaioi), their state was the <em>Roman Empire</em>, and their emperor was the <em>Roman Emperor</em>. Calling them "Byzantine" was a Western European construct designed to deny them the Roman legacy and claim it exclusively for the Latin West.
                  </p>
                </div>
              </div>
            )}

            {/* ════════ TIMELINE ════════ */}
            {activeTab === 'timeline' && (
              <div>
                <SectionHeader icon="📅" title="1,123 Years in Six Eras" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {TIMELINE_PERIODS.map((period, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 10, border: `1px solid ${period.color}33`, backgroundColor: `${period.color}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: period.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>{period.era}</span>
                        <span style={{ fontSize: 13, color: TEXT_DIM, fontWeight: 500 }}>{period.dates}</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {period.events.map((evt, j) => (
                          <li key={j} style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM }}>{evt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ CONSTANTINOPLE ════════ */}
            {activeTab === 'constantinople' && (
              <div>
                <SectionHeader icon="🏰" title="Constantinople — The Impregnable City" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{CONSTANTINOPLE.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Why It Survived 1,000 Years</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {CONSTANTINOPLE.defenses.map((d, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${d.color}33`, backgroundColor: `${d.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{d.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{d.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{d.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>The Scale of the City</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{CONSTANTINOPLE.population}</p>
                </div>
              </div>
            )}

            {/* ════════ JUSTINIAN ════════ */}
            {activeTab === 'justinian' && (
              <div>
                <SectionHeader icon="👑" title="Emperor Justinian I (527–565 CE)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{JUSTINIAN.overview}</p>

                {/* Reconquest */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Reconquest of the West</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{JUSTINIAN.reconquest.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08`, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: CRIMSON, marginBottom: 4 }}>The Cost</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{JUSTINIAN.reconquest.cost}</p>
                </div>

                {/* Hagia Sophia */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Hagia Sophia</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{JUSTINIAN.hagiaSophia.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, marginBottom: 4 }}>Engineering Marvel</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{JUSTINIAN.hagiaSophia.engineering}</p>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 24 }}>{JUSTINIAN.hagiaSophia.significance}</p>

                {/* Justinian's Code */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Justinian&rsquo;s Code (Corpus Juris Civilis)</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 12 }}>{JUSTINIAN.code.overview}</p>
                <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
                  {JUSTINIAN.code.components.map((c, i) => (
                    <li key={i} style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 6 }}>{c}</li>
                  ))}
                </ul>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${TEAL}33`, backgroundColor: `${TEAL}08`, marginBottom: 24 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 4 }}>Still Shaping the World</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{JUSTINIAN.code.legacy}</p>
                </div>

                {/* Plague */}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Plague of Justinian (541–549)</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 8 }}>{JUSTINIAN.plague.overview}</p>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${CRIMSON}33`, backgroundColor: `${CRIMSON}08` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: CRIMSON, marginBottom: 4 }}>Devastating Impact</div>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{JUSTINIAN.plague.impact}</p>
                </div>
              </div>
            )}

            {/* ════════ KEY FIGURES ════════ */}
            {activeTab === 'figures' && (
              <div>
                <SectionHeader icon="👤" title="Key Figures of the Byzantine Empire" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {KEY_FIGURES.map(fig => {
                    const isOpen = expandedFigure === fig.name;
                    return (
                      <div
                        key={fig.name}
                        style={{ padding: 16, borderRadius: 10, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => setExpandedFigure(isOpen ? null : fig.name)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{fig.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{fig.name} <span style={{ fontSize: 12, fontWeight: 400, color: TEXT_MUTED }}>({fig.dates})</span></div>
                            <div style={{ fontSize: 12, color: fig.color, fontWeight: 600 }}>{fig.role}</div>
                          </div>
                          <span style={{ fontSize: 12, color: TEXT_MUTED, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
                        </div>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${fig.color}22` }}>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: '0 0 6px', fontWeight: 600 }}>{fig.contribution}</p>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{fig.detail}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════ THEODORA ════════ */}
            {activeTab === 'theodora' && (
              <div>
                <SectionHeader icon="👸" title="Empress Theodora — From the Stage to the Throne" />
                {[
                  { title: 'From Bear-Keeper\'s Daughter to Actress', text: THEODORA_SPOTLIGHT.earlyLife, color: BRONZE },
                  { title: 'Transformation and Imperial Marriage', text: THEODORA_SPOTLIGHT.transformation, color: IMPERIAL_PURPLE },
                  { title: '"Purple Makes a Fine Shroud" — The Nika Riots', text: THEODORA_SPOTLIGHT.nikaRiots, color: CRIMSON },
                  { title: 'Champion of Women\'s Rights', text: THEODORA_SPOTLIGHT.legislation, color: TEAL },
                  { title: 'Legacy', text: THEODORA_SPOTLIGHT.legacy, color: GOLD },
                ].map((section, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: section.color, marginBottom: 8 }}>{section.title}</h3>
                    <p style={{ fontSize: 14, lineHeight: 1.8, color: TEXT_DIM, margin: 0 }}>{section.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ════════ GREEK FIRE ════════ */}
            {activeTab === 'greekfire' && (
              <div>
                <SectionHeader icon="🔥" title="Greek Fire — Byzantium's Secret Weapon" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{GREEK_FIRE.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>What Was Greek Fire?</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{GREEK_FIRE.whatItWas}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>How It Was Used</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{GREEK_FIRE.howUsed}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Key Battles</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {GREEK_FIRE.keyBattles.map((b, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${b.color}33`, backgroundColor: `${b.color}08` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{b.battle}</div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{b.detail}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${FLAME}33`, backgroundColor: `${FLAME}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: FLAME, marginBottom: 8 }}>The Lost Formula</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{GREEK_FIRE.lostFormula}</p>
                </div>
              </div>
            )}

            {/* ════════ GREAT SCHISM ════════ */}
            {activeTab === 'schism' && (
              <div>
                <SectionHeader icon="⛪" title="The Great Schism (1054) — When Christianity Split" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{GREAT_SCHISM.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Causes</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {GREAT_SCHISM.causes.map((c, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${c.color}33`, backgroundColor: `${c.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{c.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Break</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{GREAT_SCHISM.theBreak}</p>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${IMPERIAL_PURPLE}33`, backgroundColor: `${IMPERIAL_PURPLE}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: IMPERIAL_PURPLE, marginBottom: 8 }}>Consequences</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{GREAT_SCHISM.consequences}</p>
                </div>
              </div>
            )}

            {/* ════════ ART & CULTURE ════════ */}
            {activeTab === 'art' && (
              <div>
                <SectionHeader icon="🎨" title="Byzantine Art and Culture" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{BYZANTINE_ART.overview}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>The Mosaics</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 14 }}>{BYZANTINE_ART.mosaics.overview}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {BYZANTINE_ART.mosaics.examples.map((ex, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${ex.color}33`, backgroundColor: `${ex.color}08` }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{ex.name}</div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{ex.detail}</p>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Icons and Iconoclasm</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 24 }}>{BYZANTINE_ART.icons}</p>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${TEAL}33`, backgroundColor: `${TEAL}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TEAL, marginBottom: 8 }}>Preserving the Ancient World</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{BYZANTINE_ART.preservation}</p>
                </div>
              </div>
            )}

            {/* ════════ FALL OF CONSTANTINOPLE ════════ */}
            {activeTab === 'fall' && (
              <div>
                <SectionHeader icon="💥" title="The Fall of Constantinople (1453)" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 20 }}>{FALL_OF_CONSTANTINOPLE.context}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 14 }}>Preparations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {FALL_OF_CONSTANTINOPLE.preparations.map((p, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${p.color}33`, backgroundColor: `${p.color}08`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{p.title}</div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{p.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Siege</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{FALL_OF_CONSTANTINOPLE.siege}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Final Assault — May 29, 1453</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 20 }}>{FALL_OF_CONSTANTINOPLE.finalAssault}</p>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${NAVY}33`, backgroundColor: `${NAVY}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Aftermath — The End of the Ancient World</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{FALL_OF_CONSTANTINOPLE.aftermath}</p>
                </div>
              </div>
            )}

            {/* ════════ LEGACY ════════ */}
            {activeTab === 'legacy' && (
              <div>
                <SectionHeader icon="🌍" title="The Legacy of Byzantium" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {LEGACY.map((item, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 10, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{item.title}</div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
