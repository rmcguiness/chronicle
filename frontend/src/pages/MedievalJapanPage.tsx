/**
 * MedievalJapanPage — comprehensive deep-dive on Medieval Japan (~794–1615).
 *
 * Route: /medieval-japan
 *
 * Sections:
 *  1. Hero — overview of 800 years from Heian court poetry to Tokugawa unification
 *  2. Heian Period (794–1185) — aristocratic culture, Tale of Genji, imperial court
 *  3. Rise of the Samurai — warrior class, bushido, provincial power
 *  4. Genpei War (1180–1185) — Taira vs Minamoto, birth of military rule
 *  5. Kamakura Shogunate (1185–1333) — Yoritomo, warrior governance, Zen Buddhism
 *  6. Mongol Invasions (1274, 1281) — Kublai Khan's fleets, kamikaze
 *  7. Ashikaga Shogunate (1336–1573) — Muromachi culture, Onin War
 *  8. Sengoku Period (1467–1615) — century of civil war
 *  9. The Three Unifiers — Nobunaga, Hideyoshi, Ieyasu
 * 10. Battle of Sekigahara & Tokugawa Shogunate — decisive victory, 250 years of peace
 * 11. Japanese Culture — noh, tea ceremony, haiku, Zen gardens, castles
 * 12. Sword Culture — katana forging, the duel, ronin
 * 13. Ninja — shinobi reality vs legend
 * 14. Master Timeline of key events, battles, cultural milestones
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const CRIMSON = '#dc2626';
const CHERRY = '#be123c';
const GOLD = '#f59e0b';
const INDIGO = '#6366f1';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const TEAL = '#14b8a6';
const PLUM = '#a855f7';
const ROSE = '#f43f5e';
const AMBER = '#d97706';
const SKY = '#0ea5e9';
const GREEN = '#22c55e';
const STEEL = '#64748b';
const COPPER = '#c2410c';
const INK = '#1e293b';

// ─────────────────────────────────────────────────────────────────────────────
// Data types
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

// ─────────────────────────────────────────────────────────────────────────────
// Section data
// ─────────────────────────────────────────────────────────────────────────────

// ── Heian Period ─────────────────────────────────────────────────────────────

const HEIAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Tale of Genji — World\'s First Novel?',
    detail:
      'Written around 1000 CE by Lady Murasaki Shikibu, a lady-in-waiting at the imperial court, The Tale of Genji is a thousand-page psychological novel exploring the romantic entanglements, political intrigues, and emotional landscapes of the Heian aristocracy. With its complex characterization, interior monologue, and thematic depth, scholars widely regard it as the world\'s first novel — written 600 years before Don Quixote and 700 years before the English novel emerged. Murasaki wrote it in Japanese at a time when men of letters composed in Chinese; the "women\'s language" of Japanese kana script, ironically, produced Japan\'s greatest literary work.',
  },
  {
    label: 'Mono no Aware — The Pathos of Things',
    detail:
      'The central aesthetic concept of Heian culture was "mono no aware" — a bittersweet awareness of impermanence, the gentle sadness of things passing. Cherry blossoms were the perfect symbol: exquisitely beautiful precisely because they fall within days. This was not nihilistic despair but an elevated sensitivity to beauty made more poignant by its transience. Mono no aware permeated Heian poetry, prose, and court life, and remains one of the foundational concepts of Japanese aesthetics to this day. Every cherry blossom viewing party in modern Tokyo is a Heian inheritance.',
  },
  {
    label: 'The Fujiwara Regents — Power Behind the Throne',
    detail:
      'For most of the Heian period, actual political power belonged not to the emperor but to the Fujiwara clan, who controlled the court through a brilliantly simple strategy: marry Fujiwara daughters to emperors, then rule as regents for the resulting child-emperors. At its peak under Fujiwara no Michinaga (966–1028), who famously wrote a poem comparing himself to a full moon with nothing lacking, the Fujiwara exercised near-total control over the imperial government. The emperor was a sacred figurehead; the Fujiwara ran everything. This pattern of real power lying behind a ceremonial front would recur throughout Japanese history.',
  },
  {
    label: 'Court Life — Beauty as Power',
    detail:
      'Heian aristocrats lived in a world where aesthetic refinement was the primary measure of worth. A courtier was judged by the elegance of his poetry, the perfection of his calligraphy, the subtlety of his incense blends, and the artful layering of his silk robes (the color combinations visible at the sleeve were scrutinized like fashion today). Women at court communicated through poems sent on carefully chosen paper with appropriate seasonal flowers. Failure of taste was social death. This was a civilization where the color of your sleeve could matter more than the strength of your sword arm.',
  },
  {
    label: 'The Pillow Book — Sei Shōnagon\'s Sharp Eye',
    detail:
      'The other great literary masterpiece of the Heian court was The Pillow Book by Sei Shōnagon, a rival lady-in-waiting to Murasaki. Where Genji was a sweeping novel, The Pillow Book was a collection of witty, opinionated observations, lists ("Hateful Things," "Elegant Things," "Things That Make One\'s Heart Beat Faster"), anecdotes, and cutting social commentary. Shōnagon was brilliant, snobbish, and ruthlessly funny. Between them, Murasaki and Shōnagon — two women writing in the "inferior" Japanese script — produced the two defining works of their civilization.',
  },
];

// ── Rise of the Samurai ──────────────────────────────────────────────────────

const SAMURAI_INSIGHTS: InsightEntry[] = [
  {
    label: 'From Estate Guards to Ruling Class',
    detail:
      'The samurai began as provincial warriors — mounted archers employed by aristocratic landowners to protect their estates and fight their local rivals. As the Heian court declined into ritualized irrelevance, these rough provincial fighters grew in power. They commanded the only organized military forces in Japan. By the late 1100s, the warrior clans had become more powerful than the courtiers who employed them. The Taira and Minamoto — the two great warrior clans — fought their way into the capital and the power vacuum left by the declining Fujiwara. Japan\'s warrior age was about to begin.',
  },
  {
    label: 'Bushido — The Way of the Warrior',
    detail:
      'Bushido ("the way of the warrior") was the samurai code of honor that emphasized loyalty, martial arts mastery, frugality, self-discipline, and — most famously — willingness to die rather than face dishonor. A samurai\'s primary duty was absolute loyalty to his lord, even unto death. Seppuku (ritual suicide by disembowelment) was the ultimate expression of this code — a samurai who failed his lord or was captured could restore his honor through this agonizing death. Important caveat: bushido as a formal, codified system was largely a later construction (Edo period and especially Meiji era). Medieval samurai were often pragmatic, treacherous, and self-interested — the idealized code came after the fighting stopped.',
  },
  {
    label: 'The Mounted Archer — Japan\'s Original Warrior',
    detail:
      'The original samurai fighting style was mounted archery, not swordsmanship. Early samurai were horse archers who rode into battle, identified a worthy opponent, announced their name and lineage (a formal ritual challenge), and engaged in individual combat using the powerful asymmetric Japanese longbow (yumi) from horseback. This aristocratic, individualized style of warfare — more tournament than total war — would be swept away by the mass infantry tactics of the Sengoku period. The katana would replace the bow as the samurai\'s soul weapon only later.',
  },
];

// ── Genpei War ───────────────────────────────────────────────────────────────

const GENPEI_TIMELINE: TimelineEntry[] = [
  {
    year: '1156–1160',
    title: 'Hōgen and Heiji Disturbances — Warriors Enter the Capital',
    description:
      'Two quick succession crises drew the Taira and Minamoto warrior clans into court politics for the first time. The Minamoto lost, and Taira no Kiyomori — a brilliant political operator — became the first warrior to dominate the imperial court. He placed his grandson on the throne, monopolized government positions, and built a vast trade network with Song China from his base at Kobe. Kiyomori essentially replicated the Fujiwara playbook with military backing. The Minamoto survivors were exiled or killed — but he fatefully spared two young boys: Yoritomo and Yoshitsune.',
    color: CRIMSON,
  },
  {
    year: '1180',
    title: 'Minamoto Yoritomo Raises His Banner',
    description:
      'After 20 years of exile in the eastern provinces, Minamoto no Yoritomo called the eastern warrior bands to revolt against the Taira. He was not a gifted field commander — he actually lost his first battle — but he was a supremely talented political organizer. He established a military government at Kamakura (far from the corrupting influence of the Kyoto court), rewarded loyal warriors with land grants, and let his younger half-brother Yoshitsune do the actual fighting. It was the beginning of the end for court-centered government in Japan.',
    color: GOLD,
  },
  {
    year: '1184–1185',
    title: 'Yoshitsune\'s Brilliant Campaigns',
    description:
      'Minamoto no Yoshitsune was one of history\'s great tactical geniuses. At Ichi-no-Tani (1184), he led a cavalry charge down an "impossible" cliff behind the Taira camp. At Yashima, he attacked with so few men that the Taira fled their fortress thinking a massive army was coming. At the final naval Battle of Dan-no-ura (1185), he defeated the Taira fleet decisively — the child Emperor Antoku drowned, clutching his grandmother as she leapt into the sea with the imperial regalia. The Taira were annihilated. Yoshitsune became Japan\'s most beloved tragic hero — brilliant in war, doomed in peace.',
    color: CHERRY,
  },
  {
    year: '1185',
    title: 'Birth of the Shogunate — Military Rule Begins',
    description:
      'After the Genpei War, Yoritomo established the Kamakura shogunate — Japan\'s first military government. He took the title of Seii Tai-Shōgun ("Great General Who Subdues the Barbarians") and created a parallel government that effectively replaced the imperial court as the ruling power. The emperor remained as a ceremonial figurehead in Kyoto; real power sat in Kamakura. This dual-government structure — emperor in name, shogun in fact — would define Japanese politics for the next 700 years. Yoritomo also had his brother Yoshitsune hunted down and killed, because political talent and family loyalty rarely coexist.',
    color: GOLD,
  },
];

// ── Kamakura Shogunate ───────────────────────────────────────────────────────

const KAMAKURA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Warrior Government — A New Kind of Rule',
    detail:
      'The Kamakura shogunate (1185–1333) was revolutionary: for the first time, Japan was ruled by warriors rather than aristocrats. Yoritomo\'s government was lean, practical, and focused on what warriors cared about — land rights, military service obligations, and dispute resolution. The shogunate operated through a network of shugo (military governors) and jitō (estate stewards) placed in every province. The Kyoto court still existed, still performed rituals, still awarded titles — but it was the Kamakura regime that collected taxes, adjudicated disputes, and commanded military loyalty.',
  },
  {
    label: 'Zen Buddhism — The Warrior\'s Faith',
    detail:
      'Zen Buddhism arrived from China during the Kamakura period and found its most devoted followers among the samurai class. The appeal was natural: Zen\'s emphasis on direct experience over textual study, mental discipline, and acceptance of death aligned perfectly with the warrior\'s needs. A samurai who could empty his mind in meditation could act without hesitation in combat. Zen monks became advisors to shoguns, Zen monasteries became centers of Chinese learning, and Zen aesthetics — simplicity, asymmetry, suggestion rather than statement — would eventually reshape Japanese architecture, garden design, pottery, and painting. The entire Japanese aesthetic of wabi-sabi traces back to Kamakura-era Zen.',
  },
  {
    label: 'Hōjō Regents — Power Behind the Shogun',
    detail:
      'In a pattern uniquely Japanese, the Hōjō clan — Yoritomo\'s in-laws — gradually took real power from the shoguns themselves. After Yoritomo\'s sons were assassinated and his direct line ended, the Hōjō became regents to puppet shoguns, who were themselves ruling on behalf of a figurehead emperor. Japan had three nested layers of symbolic authority: the emperor (ceremonial), the shogun (nominal ruler), and the Hōjō regent (actual ruler). This bizarre arrangement worked effectively for over a century, proving that in Japanese political culture, actual power and nominal authority could be completely separated.',
  },
];

// ── Mongol Invasions ─────────────────────────────────────────────────────────

const MONGOL_TIMELINE: TimelineEntry[] = [
  {
    year: '1268–1272',
    title: 'Kublai Khan\'s Demands',
    description:
      'Kublai Khan, ruler of the largest empire in history (stretching from Korea to Hungary), sent a series of letters to Japan demanding submission and tribute. The Hōjō regents — with a confidence that bordered on insanity given the Mongol track record — refused every time. They didn\'t even send replies. They simply beheaded the Mongol envoys. The Kamakura government ordered coastal defenses built along Hakata Bay in Kyushu and prepared for invasion. Japan was about to face the greatest military power the world had ever seen.',
    color: CRIMSON,
  },
  {
    year: '1274',
    title: 'First Invasion — A Terrifying Preview',
    description:
      'In November 1274, a Mongol-Korean fleet of 900 ships carrying 23,000–40,000 troops landed at Hakata Bay, Kyushu. The Japanese defenders were shocked by Mongol tactics: massed infantry formations, coordinated cavalry charges, poison arrows, and thunderclap bombs (early gunpowder weapons) — completely unlike the individual combat the samurai practiced. The Japanese were pushed back from the beaches. But that night, a fierce storm struck the Mongol fleet, destroying perhaps a third of the ships. The Mongols withdrew. The Japanese had been given a reprieve — and a terrifying warning.',
    color: AMBER,
  },
  {
    year: '1281',
    title: 'Second Invasion — The Kamikaze',
    description:
      'Kublai Khan assembled the largest naval invasion force before D-Day: 4,400 ships carrying 140,000 troops in two fleets from Korea and southern China. This time the Japanese were ready. They had built a 20-kilometer stone wall along Hakata Bay and deployed fast coastal raiding boats. For seven weeks, fierce fighting prevented the Mongols from establishing a beachhead. Then, in August, a massive typhoon — the kamikaze, "divine wind" — smashed into the invasion fleet. Perhaps half the Mongol force was destroyed. The survivors retreated. Japan was saved. The legend of divine protection transformed Japanese national identity for centuries — with devastating consequences when it was revived in World War II.',
    color: GOLD,
  },
  {
    year: '1333',
    title: 'Fall of Kamakura — Bankruptcy of Victory',
    description:
      'The Mongol invasions ultimately destroyed the Kamakura shogunate, but not through military defeat. The problem was economic: the massive defensive mobilization cost a fortune, but there were no conquered lands to distribute as rewards (since the Mongols had been repelled, not conquered). Samurai warriors who had fought at enormous personal expense demanded compensation the government couldn\'t provide. Loyalty eroded. When Emperor Go-Daigo attempted to restore imperial rule in 1333, disaffected warriors — led by the turncoat general Ashikaga Takauji — destroyed the Kamakura regime. Victory against the Mongols had bankrupted the shogunate.',
    color: STEEL,
  },
];

// ── Ashikaga Shogunate ───────────────────────────────────────────────────────

const ASHIKAGA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Muromachi Culture — Beauty in Troubled Times',
    detail:
      'The Ashikaga shoguns (1336–1573) were weaker rulers than the Kamakura regime, but they were magnificent cultural patrons. The third shogun, Ashikaga Yoshimitsu, built the Golden Pavilion (Kinkaku-ji) — a three-story gilded temple in Kyoto that remains one of Japan\'s most iconic buildings. Under Ashikaga patronage, noh theater, the tea ceremony, ikebana (flower arrangement), ink wash painting, and Zen garden design all reached their classical forms. The Muromachi period proved that political instability and cultural brilliance can coexist — some of Japan\'s most refined art was created while the country was tearing itself apart.',
  },
  {
    label: 'The Ōnin War (1467–1477) — Kyoto Burns',
    detail:
      'The Ōnin War was a succession dispute within the Ashikaga shogunate that escalated into a decade-long conflict fought largely in Kyoto itself. Rival factions built fortifications across the capital and fought block by block. By the time it ended, Kyoto — the ancient imperial capital and center of Japanese civilization — was a burned-out ruin. The shogunate survived in name but was irrelevant. Provincial warlords (daimyō) realized that central authority had collapsed and began fighting each other for local supremacy. The Ōnin War didn\'t just destroy Kyoto; it opened the door to the Sengoku — Japan\'s century of civil war.',
  },
  {
    label: 'Gekokujō — The Low Overcome the High',
    detail:
      'The defining concept of the late Ashikaga and Sengoku periods was gekokujō — "the low overcome the high." Servants overthrew lords. Peasant soldiers defeated samurai cavalry. Provincial warriors toppled ancient aristocratic families. In Sengoku Japan, birth mattered less than ability and ruthlessness. This was revolutionary in a society built on rigid hierarchy. The most dramatic example: Toyotomi Hideyoshi, born a peasant with no surname, rose to become the supreme ruler of all Japan. Gekokujō made the Sengoku period a terrifying time — and the most socially mobile era in pre-modern Japanese history.',
  },
];

// ── Sengoku Period ───────────────────────────────────────────────────────────

const SENGOKU_INSIGHTS: InsightEntry[] = [
  {
    label: 'A Century of Fire and Ambition',
    detail:
      'The Sengoku period (1467–1615) was Japan\'s age of civil war — roughly 150 years during which the country fractured into dozens of competing domains ruled by daimyō (great lords) who fought constantly for territory, resources, and survival. There was no central authority. Alliances shifted overnight. Betrayal was a military strategy. Castles went from small hilltop forts to massive stone-walled complexes. Armies grew from hundreds of mounted samurai to tens of thousands of foot soldiers (ashigaru) armed with pikes and, after 1543, firearms. It was Japan\'s most violent era — and the crucible that forged the nation.',
  },
  {
    label: 'The Gun Arrives — Tanegashima (1543)',
    detail:
      'In 1543, a Chinese ship carrying Portuguese traders wrecked on the island of Tanegashima. Among their trade goods: two matchlock firearms (arquebuses). Within a decade, Japanese swordsmiths had reverse-engineered and mass-produced them. Within 30 years, Japan had more guns than any country in the world. The gun transformed Sengoku warfare: Oda Nobunaga\'s massed volley fire at the Battle of Nagashino (1575) destroyed the Takeda cavalry charge and proved that disciplined ashigaru with guns could annihilate mounted samurai. The samurai sword culture survived — but the gun won the wars.',
  },
  {
    label: 'Castle Culture — Fortresses of Power',
    detail:
      'The Sengoku period produced Japan\'s great castles: Himeji, Matsumoto, Osaka, Azuchi, Kumamoto. These were not European-style fortresses designed purely for defense — they were statements of political power. The central tower (tenshu) served as the lord\'s residence, command post, treasury, and symbol of dominion visible for miles. Stone walls (ishigaki) with complex curved surfaces that defeated siege ladders, concentric baileys with killing zones, and sophisticated water management systems made these castles nearly impregnable. Oda Nobunaga\'s Azuchi Castle (1579) — the first great castle tower — set the template. Himeji Castle, built by Toyotomi and expanded by Tokugawa vassals, survives today as Japan\'s most beautiful building.',
  },
];

// ── The Three Unifiers ───────────────────────────────────────────────────────

const UNIFIERS: FigureEntry[] = [
  {
    name: 'Oda Nobunaga (1534–1582) — The Destroyer',
    years: 'Ruled 1560–1582',
    contribution:
      'Nobunaga was the first to seriously attempt unification of Japan, and his methods were revolutionary — and terrifying. He pioneered the use of massed musket fire (3,000 arquebusiers in rotating volleys at Nagashino, 1575), built the first great castle (Azuchi), broke the power of the militant Buddhist monasteries by burning Enryaku-ji to the ground and killing every monk, woman, and child on Mount Hiei (1571), and systematically destroyed any rival who wouldn\'t submit. He was brilliant, innovative, utterly ruthless, and probably the most feared man in Japanese history. His motto: "Tenka Fubu" — "All the realm under one sword." He controlled about a third of Japan when his own general, Akechi Mitsuhide, betrayed and killed him at Honnō-ji temple in 1582. He was 48.',
  },
  {
    name: 'Toyotomi Hideyoshi (1537–1598) — The Builder',
    years: 'Ruled 1582–1598',
    contribution:
      'Hideyoshi\'s rise is the most extraordinary in Japanese history. Born a peasant (he had no surname — "Toyotomi" was granted later), he entered Nobunaga\'s service as a sandal-bearer and rose through sheer ability to become Nobunaga\'s top general. After Nobunaga\'s assassination, Hideyoshi defeated the rival claimants, completed the military unification of Japan by 1590, built the colossal Osaka Castle, conducted a nationwide sword hunt to disarm the peasantry (freezing the social classes), and launched two massive (and ultimately failed) invasions of Korea (1592, 1597) with the deranged ambition of conquering China. He was a military genius, a master politician, and increasingly megalomaniacal. He died in 1598, leaving a five-year-old heir — a fatal weakness.',
  },
  {
    name: 'Tokugawa Ieyasu (1543–1616) — The Patient',
    years: 'Ruled 1600–1616',
    contribution:
      'A famous Japanese saying captures the three unifiers: "Nobunaga pounded the rice, Hideyoshi kneaded the dough, and Ieyasu ate the cake." Ieyasu\'s genius was patience. He survived as Nobunaga\'s ally, served as Hideyoshi\'s most powerful vassal, and waited. When Hideyoshi died leaving a child heir, Ieyasu methodically built a coalition and provoked his enemies into the decisive Battle of Sekigahara (1600). His victory gave him control of all Japan. He established the Tokugawa shogunate in 1603, headquartered in Edo (modern Tokyo), and constructed a political system so stable it lasted 265 years. He was not the most brilliant of the three unifiers — but he was the last one standing, and that was enough.',
  },
];

const UNIFIER_TIMELINE: TimelineEntry[] = [
  {
    year: '1560',
    title: 'Battle of Okehazama — Nobunaga\'s Miracle',
    description:
      'Oda Nobunaga, a minor lord from Owari province dismissed by rivals as "the Fool of Owari," defeated the massively superior army of Imagawa Yoshimoto in a surprise rain-storm attack at Okehazama. Outnumbered roughly 10-to-1, Nobunaga\'s small force struck the Imagawa camp during a thunderstorm and killed Yoshimoto. It was the upset that launched Nobunaga\'s career and began the unification of Japan.',
    color: CRIMSON,
  },
  {
    year: '1575',
    title: 'Battle of Nagashino — Guns Change Everything',
    description:
      'Nobunaga deployed 3,000 arquebusiers behind wooden palisades and used rotating volley fire — a tactic Europe wouldn\'t develop for another century — to annihilate the legendary Takeda cavalry. The Takeda charged directly into continuous gunfire. It was a slaughter. Nagashino proved that the age of the mounted samurai was over and that disciplined infantry with firearms was the future of Japanese warfare.',
    color: GOLD,
  },
  {
    year: '1582',
    title: 'Incident at Honnō-ji — Nobunaga\'s End',
    description:
      'While resting at Honnō-ji temple in Kyoto with a tiny escort, Nobunaga was attacked by 13,000 troops under his own general, Akechi Mitsuhide. Surrounded and with no escape, Nobunaga set the temple on fire and committed seppuku. His body was never found. Mitsuhide\'s reign as traitor lasted exactly 13 days before Hideyoshi caught and destroyed him. "Akechi\'s three-day reign" became a Japanese proverb for short-lived success.',
    color: CHERRY,
  },
  {
    year: '1590',
    title: 'Siege of Odawara — Japan Unified',
    description:
      'Hideyoshi besieged the Hōjō clan\'s fortress at Odawara with 200,000 troops — the largest army assembled in Japanese history to that point. Rather than storm the walls, he surrounded the castle, built his own pleasure palace in sight of the defenders, held tea ceremonies, and waited. After three months, the Hōjō surrendered. With their fall, every province in Japan acknowledged Hideyoshi\'s authority. For the first time in over a century, Japan was united under one ruler.',
    color: GOLD,
  },
  {
    year: '1600',
    title: 'Battle of Sekigahara — The Decisive Day',
    description:
      'On October 21, 1600, approximately 160,000 warriors clashed at the narrow valley of Sekigahara in central Japan. On one side: Tokugawa Ieyasu\'s Eastern Army. On the other: a Western coalition loyal to Hideyoshi\'s heir. The battle turned when several Western commanders — bribed or coerced by Ieyasu\'s months of secret diplomacy — switched sides mid-battle. The Western Army collapsed. Sekigahara lasted six hours and decided the fate of Japan for 265 years. It was the largest samurai battle in history.',
    color: CRIMSON,
  },
  {
    year: '1603',
    title: 'Tokugawa Shogunate Established',
    description:
      'Ieyasu received the title of Seii Tai-Shōgun from the emperor, formally establishing the Tokugawa shogunate with its capital at Edo (modern Tokyo). He then abdicated in favor of his son Hidetada just two years later — not to retire, but to prove that the succession was hereditary and the Tokugawa would rule permanently. He continued to exercise power from retirement until his death in 1616. The system he built — including the sankin-kōtai (alternate attendance) system that forced daimyō to spend every other year in Edo — kept Japan at peace for 265 years.',
    color: TEAL,
  },
];

// ── Tokugawa / Sakoku ────────────────────────────────────────────────────────

const TOKUGAWA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sakoku — The Closed Country (1635–1853)',
    detail:
      'The Tokugawa shogunate gradually sealed Japan off from the outside world. Christianity was banned and brutally suppressed (the Shimabara Rebellion of 1637–38 was the last straw). Japanese citizens were forbidden from leaving the country on pain of death. Foreign trade was restricted to a single artificial island — Dejima — in Nagasaki harbor, where only the Dutch (who agreed to trample on Christian images) and Chinese were permitted to trade. For 218 years, Japan existed in near-total isolation from the West. The result was paradoxical: Japan developed a unique, extraordinarily refined culture — but fell technologically behind the industrializing West, a gap that would be brutally exposed when Commodore Perry\'s "Black Ships" arrived in 1853.',
  },
  {
    label: 'Sankin-Kōtai — The Attendance Trap',
    detail:
      'Ieyasu\'s most brilliant political innovation was sankin-kōtai ("alternate attendance"): every daimyō was required to spend every other year in Edo, maintaining an expensive household in the capital, while leaving his family there permanently as hostages when he returned to his domain. This served multiple purposes: it drained the daimyō financially (making rebellion prohibitively expensive), it concentrated elite culture in Edo (which grew to over a million people — the largest city in the world by 1721), and it created a massive road network (the Tōkaidō and other highways) that unified the country. It was soft coercion of genius-level design.',
  },
  {
    label: '265 Years of Peace — The Pax Tokugawa',
    detail:
      'After centuries of civil war, the Tokugawa period (1603–1868) brought an unprecedented era of peace, stability, and cultural flowering. Without wars to fight, samurai became bureaucrats, scholars, and artists. Cities boomed. Literacy rates reached levels comparable to contemporary Europe. Kabuki theater, ukiyo-e woodblock prints, haiku poetry, the pleasure quarters, sumo wrestling, and the sophisticated urban culture of Edo and Osaka all flourished. The merchant class (officially the lowest social rank) grew enormously wealthy. The Tokugawa peace was real — but it came at the cost of rigid social hierarchy, political repression, and the technological stagnation that would leave Japan vulnerable when the Western powers came knocking.',
  },
];

// ── Japanese Culture ─────────────────────────────────────────────────────────

const CULTURE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Noh Theater — The Art of Restraint',
    detail:
      'Noh (from "nō," meaning "talent" or "skill") is the world\'s oldest surviving theatrical form, codified in the 14th century by the genius actor-playwright Zeami Motokiyo under Ashikaga patronage. Noh is the opposite of Western drama: minimal movement, masked performers, a bare stage with a single painted pine tree, a chorus that narrates, and a pace so slow that a single play can take two hours to perform a story that could be told in five minutes. The beauty is in the compression — every gesture carries enormous weight. Zeami\'s treatise on noh, Fūshikaden, contains the concept of "the flower" (hana): the quality that makes a performance transcendent, which cannot be taught, only discovered through a lifetime of practice.',
  },
  {
    label: 'The Way of Tea — Wabi-cha',
    detail:
      'Sen no Rikyū (1522–1591), the greatest tea master in Japanese history, transformed the tea ceremony from an aristocratic display of Chinese luxury into its opposite: wabi-cha, tea served in a tiny, rustic room using rough, asymmetric bowls, with an emphasis on simplicity, humility, and the beauty of imperfection. A tea gathering under Rikyū was a radical act: warriors who commanded armies crawled through a tiny door (the nijiriguchi, designed to force everyone to bow), left their swords outside, and shared tea as equals in a space deliberately stripped of status markers. Rikyū served both Nobunaga and Hideyoshi as tea master — until Hideyoshi ordered his death by seppuku in 1591, possibly because Rikyū\'s radical simplicity was an implicit rebuke of Hideyoshi\'s extravagance.',
  },
  {
    label: 'Haiku — Seventeen Syllables, Infinite Depth',
    detail:
      'Matsuo Bashō (1644–1694) elevated the haiku from a light verse form into profound poetry. His most famous poem — "Furu ike ya / kawazu tobikomu / mizu no oto" (The old pond / a frog jumps in / the sound of water) — seems almost absurdly simple. That\'s the point. In seventeen syllables, Bashō captured a specific moment of sensory experience with such precision that it becomes universal. His travel journal, The Narrow Road to the Deep North, combined haiku with prose to create a literary form (haibun) that influenced Japanese literature for centuries. Bashō was a Zen practitioner, and his haiku are essentially Zen koans in verse: simple on the surface, bottomless underneath.',
  },
  {
    label: 'Zen Gardens — Landscapes of the Mind',
    detail:
      'The karesansui (dry landscape) garden — raked gravel representing water, carefully placed rocks representing mountains or islands — is one of Japan\'s most distinctive contributions to world culture. The most famous, at Ryōan-ji temple in Kyoto (c. 1499), contains just 15 stones arranged on raked white gravel, positioned so that no matter where you sit, you can only see 14 at once. The garden has been interpreted as islands in a sea, a tiger carrying cubs across water, or a visualization of the concept of mu (nothingness). Its designer is unknown. Zen gardens were designed not to be walked through but to be contemplated from a fixed position — they are landscapes of the mind, not the body.',
  },
  {
    label: 'Castle Architecture — Fortresses as Art',
    detail:
      'Japanese castle architecture reached its peak in the late Sengoku and early Tokugawa periods. Himeji Castle — the "White Heron" — with its brilliant white plaster walls, sweeping curved roofs, and complex of 83 buildings, is widely considered the most beautiful castle in the world. The engineering was as impressive as the aesthetics: massive stone foundations with precisely calculated curves (to resist earthquakes and defeat scaling), labyrinthine approach paths designed to trap and confuse attackers, hidden rooms for ambush, and ingenious ventilation systems. Of the thousands of castles built during the Sengoku period, only 12 survive with original tenshu (main towers). Himeji is the finest.',
  },
];

// ── Sword Culture ────────────────────────────────────────────────────────────

const SWORD_INSIGHTS: InsightEntry[] = [
  {
    label: 'Katana Forging — Science and Spirit',
    detail:
      'Japanese swordsmithing is perhaps the most sophisticated metallurgical tradition in the pre-industrial world. The katana is forged from tamahagane — a steel produced in a tatara clay furnace from iron sand over three days. The smith repeatedly folds the steel (up to 16 times, creating up to 65,000 layers), creating the characteristic grain pattern (hada) visible on the blade. The blade is then differentially hardened: the edge is coated with a thin layer of clay and the spine with a thick layer before quenching. The edge cools fast (becoming extremely hard and sharp) while the spine cools slowly (remaining flexible). This creates the curved shape and the beautiful hamon — the wavy temper line along the edge. A master smith might spend months on a single blade. The process was considered sacred, and smiths underwent Shinto purification rituals.',
  },
  {
    label: 'Ronin — The Masterless Samurai',
    detail:
      'A ronin ("wave person" — tossed about like a wave) was a samurai without a master, either because his lord had died, because he had been dismissed, or because he had chosen independence. Ronin occupied an uncomfortable social position: they were warriors by training but outcasts by circumstance, often reduced to teaching swordsmanship, becoming mercenaries, or turning to banditry. The most famous ronin story is the tale of the 47 Ronin (Chūshingura, 1703): after their lord was forced to commit seppuku over a court insult, 47 of his retainers spent two years planning and then executed a revenge attack on the man responsible — knowing they would be condemned to death for it. Their graves at Sengaku-ji temple in Tokyo are still visited today.',
  },
  {
    label: 'Miyamoto Musashi — The Sword Saint',
    detail:
      'Miyamoto Musashi (c. 1584–1645) fought his first duel at age 13 and won, beating an adult swordsman to death with a wooden staff. He went on to fight over 60 duels without a single defeat — a record unmatched in Japanese history. His most famous duel was against Sasaki Kojirō on Ganryū Island (1612): Musashi arrived hours late (a deliberate psychological ploy), fought with a wooden sword carved from an oar on the boat ride over, and killed Kojirō with a single blow. In later life, Musashi retired to a cave and wrote The Book of Five Rings (Go Rin No Sho), a treatise on strategy, combat, and philosophy that is still studied by martial artists and business executives worldwide.',
  },
];

// ── Ninja ────────────────────────────────────────────────────────────────────

const NINJA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Shinobi — The Historical Reality',
    detail:
      'The historical ninja (shinobi no mono, or simply shinobi) were nothing like their pop-culture depiction. They did not wear black pajamas, throw shuriken in combat, or vanish in puffs of smoke. They were espionage specialists — scouts, spies, saboteurs, and occasionally assassins — drawn primarily from the mountainous Iga and Kōga provinces of central Japan, where rugged terrain and distance from central authority bred fiercely independent communities that developed specialized skills in intelligence gathering. Shinobi served every side during the Sengoku period, selling their services to whichever daimyō would pay. Their methods were practical: disguises (monks, merchants, performers), signal fires, coded messages, poison, and arson. They were intelligence operatives, not supernatural warriors.',
  },
  {
    label: 'Iga and Kōga — The Shinobi Heartlands',
    detail:
      'The provinces of Iga and Kōga (in modern Mie and Shiga prefectures) were the two main centers of shinobi activity. Both were mountainous, difficult to access, and governed not by a single daimyō but by leagues of small landholders (jizamurai) who governed themselves through councils. This independence forced them to develop unconventional military skills — when you can\'t field a large army, you specialize in stealth, intelligence, and asymmetric warfare. Oda Nobunaga invaded Iga in 1581 with 44,000 troops and destroyed the independent leagues. Many surviving Iga shinobi entered the service of Tokugawa Ieyasu, who used them as intelligence gatherers and, later, as the core of the Edo castle guard force.',
  },
  {
    label: 'Legend vs. Reality — How Ninja Became Superheroes',
    detail:
      'The modern image of the ninja — black-clad assassins with superhuman abilities — is almost entirely a creation of Edo-period fiction and 20th-century entertainment. During the peaceful Tokugawa era, storytellers romanticized the Sengoku period\'s shadowy operatives into fantastical figures with magical powers: invisibility, walking on water, transforming into animals. Kabuki theater and illustrated novels (kusazōshi) made ninja into popular entertainment. In the 20th century, Japanese and then Hollywood films amplified the mythology further. The real shinobi would be baffled by their modern depiction. They were pragmatic professionals who would have considered flashy black outfits and visible weapons the exact opposite of their craft.',
  },
];

// ── Master Timeline ──────────────────────────────────────────────────────────

const MASTER_TIMELINE: TimelineEntry[] = [
  { year: '794', title: 'Heian Period Begins', description: 'Emperor Kanmu moves the capital to Heian-kyō (Kyoto), beginning 400 years of aristocratic court culture.', color: PLUM },
  { year: 'c. 1000', title: 'The Tale of Genji Written', description: 'Lady Murasaki Shikibu composes what many scholars consider the world\'s first novel.', color: PLUM },
  { year: '1156–1160', title: 'Hōgen & Heiji Disturbances', description: 'Warriors are drawn into court politics. Taira no Kiyomori becomes the first military dictator.', color: CRIMSON },
  { year: '1180–1185', title: 'Genpei War', description: 'Taira vs Minamoto. Yoshitsune\'s brilliant campaigns end at Dan-no-ura. Birth of the shogunate.', color: CHERRY },
  { year: '1185', title: 'Kamakura Shogunate Founded', description: 'Minamoto Yoritomo establishes Japan\'s first military government at Kamakura.', color: GOLD },
  { year: '1191', title: 'Zen Buddhism Arrives', description: 'Eisai brings Rinzai Zen from China. Dōgen follows with Sōtō Zen in 1227. Both transform samurai culture.', color: TEAL },
  { year: '1274', title: 'First Mongol Invasion', description: 'Kublai Khan\'s forces land at Hakata Bay. A typhoon forces retreat.', color: CRIMSON },
  { year: '1281', title: 'Second Mongol Invasion — Kamikaze', description: 'The largest pre-modern naval invasion is destroyed by the "divine wind" typhoon.', color: GOLD },
  { year: '1333', title: 'Kamakura Shogunate Falls', description: 'Bankrupt from Mongol defense costs, the regime collapses. Brief imperial restoration.', color: STEEL },
  { year: '1336', title: 'Ashikaga Shogunate Begins', description: 'Ashikaga Takauji establishes the Muromachi shogunate. A weaker government begins.', color: INDIGO },
  { year: '1397', title: 'Golden Pavilion (Kinkaku-ji) Built', description: 'Ashikaga Yoshimitsu builds the iconic gilded pavilion in Kyoto.', color: GOLD },
  { year: 'c. 1400', title: 'Zeami Codifies Noh Theater', description: 'Under Ashikaga patronage, Zeami perfects noh and writes the foundational treatise Fūshikaden.', color: PLUM },
  { year: '1467–1477', title: 'Ōnin War — Kyoto Burns', description: 'Succession dispute destroys the capital and opens the Sengoku period.', color: CRIMSON },
  { year: '1499', title: 'Ryōan-ji Zen Garden', description: 'The famous dry landscape garden of 15 stones on raked gravel is created in Kyoto.', color: TEAL },
  { year: '1543', title: 'Firearms Arrive at Tanegashima', description: 'Portuguese traders bring guns. Japanese smiths mass-produce them within a decade.', color: AMBER },
  { year: '1560', title: 'Battle of Okehazama', description: 'Nobunaga defeats Imagawa Yoshimoto in a surprise attack, launching his career.', color: CRIMSON },
  { year: '1571', title: 'Nobunaga Burns Mount Hiei', description: 'Nobunaga destroys the powerful Enryaku-ji monastery, killing thousands. A turning point.', color: CHERRY },
  { year: '1575', title: 'Battle of Nagashino', description: 'Massed volley fire annihilates Takeda cavalry. Guns transform Japanese warfare.', color: GOLD },
  { year: '1582', title: 'Incident at Honnō-ji', description: 'Nobunaga is betrayed and killed by Akechi Mitsuhide. Hideyoshi seizes power.', color: CHERRY },
  { year: '1588', title: 'Sword Hunt', description: 'Hideyoshi confiscates weapons from peasants, freezing the samurai/commoner class divide.', color: STEEL },
  { year: '1590', title: 'Siege of Odawara — Japan Unified', description: 'Hideyoshi conquers the last independent domain. Japan is united for the first time in a century.', color: GOLD },
  { year: '1591', title: 'Death of Sen no Rikyū', description: 'The greatest tea master is ordered to commit seppuku by Hideyoshi.', color: PLUM },
  { year: '1592–1598', title: 'Invasions of Korea', description: 'Hideyoshi\'s ambitious but ultimately failed attempt to conquer Korea and China.', color: CRIMSON },
  { year: '1600', title: 'Battle of Sekigahara', description: 'Tokugawa Ieyasu defeats the Western coalition. 160,000 warriors decide Japan\'s fate in six hours.', color: CRIMSON },
  { year: '1603', title: 'Tokugawa Shogunate Established', description: 'Ieyasu becomes shogun. Edo (Tokyo) becomes the new capital. 265 years of peace begin.', color: TEAL },
  { year: '1612', title: 'Musashi vs Kojirō on Ganryū Island', description: 'The most famous duel in Japanese history. Musashi wins with a wooden sword.', color: AMBER },
  { year: '1635', title: 'Sakoku Edict — Japan Closes', description: 'The shogunate seals Japan from foreign contact. Only Dutch and Chinese may trade, at Dejima.', color: STEEL },
  { year: '1694', title: 'Death of Matsuo Bashō', description: 'Japan\'s greatest poet dies. His haiku and travel journals define the art form.', color: PLUM },
  { year: '1703', title: 'Revenge of the 47 Ronin', description: 'The most celebrated loyalty tale in Japanese history. All 47 die by seppuku.', color: CHERRY },
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
    <section id={id} style={{ paddingTop: 48, paddingBottom: 24 }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            marginBottom: 14,
            color: accentColor,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.8,
            fontSize: '1rem',
            marginBottom: 24,
            maxWidth: 820,
          }}
        >
          {intro}
        </p>
      </motion.div>
      {children}
    </section>
  );
}

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h4
            style={{
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 8,
              fontSize: '1.05rem',
            }}
          >
            {item.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.75, fontSize: '0.92rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {entries.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: e.color,
              marginBottom: 4,
              letterSpacing: 0.5,
            }}
          >
            {e.year}
          </span>
          <h4
            style={{
              fontWeight: 600,
              color: '#e2e8f0',
              marginBottom: 6,
              fontSize: '1.05rem',
            }}
          >
            {e.title}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.75, fontSize: '0.92rem' }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

const FIGURE_COLORS = [CRIMSON, GOLD, TEAL, PLUM, SKY, CHERRY];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
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
          <p style={{ color: ASH, lineHeight: 1.75, fontSize: '0.92rem' }}>
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

export default function MedievalJapanPage() {
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
        backgroundColor: '#0a0a12',
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
              background: `linear-gradient(135deg, ${CRIMSON}, ${CHERRY}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Medieval Japan — From Heian Court Poetry to Samurai Civil Wars (794–1615)
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
              Eight hundred years of transformation: from aristocrats composing
              poetry by moonlight to armored warriors fighting for control of a
              fractured nation. Medieval Japan produced the world's first novel,
              the samurai code, Zen Buddhism's austere beauty, and three of
              history's most remarkable military leaders — then sealed itself off
              from the world for 250 years.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              It began with Lady Murasaki writing by candlelight in the imperial
              palace and ended with Tokugawa Ieyasu's armies at Sekigahara. In
              between: the Genpei War birthed the shogunate, Mongol invasion
              fleets were destroyed by divine typhoons, Kyoto burned in civil
              war, Portuguese traders brought guns that changed everything, and
              three men of radically different temperament — the destroyer, the
              builder, and the patient — unified a nation. This is the story of
              medieval Japan.
            </p>
          </motion.div>
        </header>

        {/* ── Heian Period ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="heian"
          icon="🌸"
          title="The Heian Period (794–1185) — An Aristocracy of Beauty"
          accentColor={PLUM}
          intro="The Heian period was Japan's classical golden age — four centuries during which the imperial court in Kyoto created one of the most refined civilizations in human history. Political power, social status, and personal worth were measured not by military strength but by aesthetic sensibility: the elegance of your calligraphy, the perfection of your poetry, the subtlety of your perfume blend. It was a world of exquisite beauty, elaborate ritual, and intense emotional refinement — built on a foundation that would crumble when the warriors arrived."
        >
          <InsightGrid items={HEIAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Rise of the Samurai ───────────────────────────────────────── */}
        <SectionWrapper
          id="samurai-rise"
          icon="🏹"
          title="Rise of the Samurai — Warriors from the Provinces"
          accentColor={CRIMSON}
          intro="While Heian aristocrats perfected the art of poetry, a new class was rising in the provinces. The samurai — originally hired muscle for aristocratic landowners — grew in power as the court declined. Trained in mounted archery and bound by emerging codes of warrior honor, these provincial fighters would overthrow the aristocratic order and rule Japan for the next seven centuries."
        >
          <InsightGrid items={SAMURAI_INSIGHTS} />
        </SectionWrapper>

        {/* ── Genpei War ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="genpei"
          icon="⚔️"
          title="The Genpei War (1180–1185) — Taira vs Minamoto"
          accentColor={CHERRY}
          intro="The Genpei War was Japan's founding conflict — the five-year civil war between the Taira (Heike) and Minamoto (Genji) clans that destroyed aristocratic rule and established the shogunate. It produced Japan's greatest tragic hero (Yoshitsune), its most brilliant political operator (Yoritomo), and the military government structure that would endure for 700 years. The Genpei War is to Japanese culture what the Trojan War is to Greek culture: the origin story retold in a thousand forms."
        >
          <TimelineCard entries={GENPEI_TIMELINE} />
        </SectionWrapper>

        {/* ── Kamakura Shogunate ─────────────────────────────────────────── */}
        <SectionWrapper
          id="kamakura"
          icon="⛩️"
          title="The Kamakura Shogunate (1185–1333) — Warriors Rule"
          accentColor={TEAL}
          intro="The Kamakura shogunate was Japan's first military government — a lean, practical regime of warriors who governed from the eastern town of Kamakura, deliberately distant from the effete Kyoto court. It brought Zen Buddhism from China, created a warrior culture that would define Japan for centuries, and repelled the largest invasion force the world had ever seen. Then it went bankrupt from the effort."
        >
          <InsightGrid items={KAMAKURA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Mongol Invasions ──────────────────────────────────────────── */}
        <SectionWrapper
          id="mongols"
          icon="🌊"
          title="The Mongol Invasions (1274, 1281) — Divine Wind"
          accentColor={GOLD}
          intro="In the late 13th century, Kublai Khan — grandson of Genghis, ruler of the largest contiguous empire in history — turned his attention to Japan. He sent two massive invasion fleets. Both were destroyed. The typhoons that shattered the Mongol armadas became known as kamikaze — 'divine wind' — and created a myth of Japanese invincibility that would echo catastrophically into the 20th century."
        >
          <TimelineCard entries={MONGOL_TIMELINE} />
        </SectionWrapper>

        {/* ── Ashikaga Shogunate ─────────────────────────────────────────── */}
        <SectionWrapper
          id="ashikaga"
          icon="🏯"
          title="The Ashikaga Shogunate (1336–1573) — Splendor and Collapse"
          accentColor={INDIGO}
          intro="The Ashikaga shoguns ruled from Kyoto's Muromachi district — giving the era its alternate name — and presided over a paradox: political authority crumbled while culture flourished brilliantly. The Golden Pavilion, noh theater, the tea ceremony, Zen gardens, and ikebana all reached their classical forms under Ashikaga patronage. Then the Ōnin War burned Kyoto to the ground, central authority evaporated, and Japan plunged into a century of civil war."
        >
          <InsightGrid items={ASHIKAGA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Sengoku Period ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="sengoku"
          icon="🔥"
          title="The Sengoku Period (1467–1615) — A Century of Fire"
          accentColor={AMBER}
          intro="The Sengoku ('Warring States') period was Japan's most violent, transformative, and socially mobile era — roughly 150 years during which the country fractured into dozens of competing domains and ambitious warlords fought to conquer or die. Alliances shifted overnight. Peasants became generals. Castles grew from wooden stockades to stone-walled fortresses. And the arrival of firearms from Europe changed warfare forever."
        >
          <InsightGrid items={SENGOKU_INSIGHTS} />
        </SectionWrapper>

        {/* ── The Three Unifiers ──────────────────────────────────────────── */}
        <SectionWrapper
          id="unifiers"
          icon="👑"
          title="The Three Unifiers — Nobunaga, Hideyoshi, Ieyasu"
          accentColor={CRIMSON}
          intro="Three men — each with a radically different personality and approach — ended a century of civil war and reunified Japan. Oda Nobunaga was the visionary destroyer who broke the old order. Toyotomi Hideyoshi was the peasant-born genius who built a new one. Tokugawa Ieyasu was the patient strategist who made it last. A famous Japanese parable captures their temperaments: 'If the cuckoo won't sing — Nobunaga: kill it. Hideyoshi: make it want to sing. Ieyasu: wait for it to sing.'"
        >
          <FigureGrid figures={UNIFIERS} />
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: GOLD, marginBottom: 14 }}>
              Key Battles and Events
            </h3>
            <TimelineCard entries={UNIFIER_TIMELINE} />
          </div>
        </SectionWrapper>

        {/* ── Tokugawa Shogunate ──────────────────────────────────────────── */}
        <SectionWrapper
          id="tokugawa"
          icon="🏛️"
          title="The Tokugawa Shogunate — 265 Years of Peace"
          accentColor={TEAL}
          intro="Tokugawa Ieyasu's victory at Sekigahara in 1600 ended the age of civil war and began the longest period of peace in Japanese history. The Tokugawa shogunate sealed Japan from foreign contact, froze the social hierarchy, and created a political system of such ingenious design that it maintained stability for over two and a half centuries — during which Japanese culture flowered in extraordinary ways."
        >
          <InsightGrid items={TOKUGAWA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Japanese Culture ────────────────────────────────────────────── */}
        <SectionWrapper
          id="culture"
          icon="🎭"
          title="Japanese Culture — Noh, Tea, Haiku, Zen, and Castles"
          accentColor={PLUM}
          intro="Medieval Japan produced a cultural legacy of extraordinary depth and refinement. From the austere beauty of noh theater to the radical simplicity of the tea ceremony, from Bashō's haiku to the contemplative silence of Zen gardens, Japanese culture developed an aesthetic vocabulary centered on restraint, impermanence, and the beauty of imperfection — values that continue to influence art, architecture, and design worldwide."
        >
          <InsightGrid items={CULTURE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Sword Culture ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="sword-culture"
          icon="⚔️"
          title="Sword Culture — The Katana, the Duel, and the Ronin"
          accentColor={STEEL}
          intro="The katana was not merely a weapon — it was 'the soul of the samurai,' a sacred object that embodied its owner's honor, skill, and identity. Japanese swordsmithing reached levels of metallurgical sophistication unmatched anywhere in the pre-industrial world. Around this extraordinary weapon grew a culture of martial discipline, legendary duels, and the haunting figure of the ronin — the masterless samurai, adrift in a world that had no place for him."
        >
          <InsightGrid items={SWORD_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ninja ───────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="ninja"
          icon="🥷"
          title="Ninja — Shinobi Reality vs. Legend"
          accentColor={INK}
          intro="Forget the black pajamas and throwing stars. The historical ninja — properly called shinobi — were intelligence operatives and unconventional warfare specialists, not supernatural assassins. Their real history is more interesting than the legend: pragmatic professionals from fiercely independent mountain communities who sold their espionage skills to every warlord willing to pay."
        >
          <InsightGrid items={NINJA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Master Timeline ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="timeline"
          icon="📜"
          title="Master Timeline — 800 Years of Medieval Japan"
          accentColor={SKY}
          intro="From the founding of Kyoto to the closing of Japan's borders — every major battle, cultural milestone, political upheaval, and turning point of medieval Japan, in chronological order."
        >
          <TimelineCard entries={MASTER_TIMELINE} />
        </SectionWrapper>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer
          style={{
            paddingTop: 48,
            paddingBottom: 64,
            textAlign: 'center',
            color: SLATE,
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          <p>
            Medieval Japan (794–1615) — From Heian court poetry to Tokugawa
            unification.
          </p>
          <p style={{ marginTop: 8 }}>
            <Link
              to="/"
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              ← Back to Chronicle
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
