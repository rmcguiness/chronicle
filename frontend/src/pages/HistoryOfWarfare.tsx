/**
 * HistoryOfWarfare — comprehensive deep-dive on the evolution of warfare
 * from prehistoric clubs to cyber weapons.
 *
 * Route: /history-of-warfare
 *
 * Sections:
 *  1. Hero — headline, scope of coverage
 *  2. Prehistoric Warfare — clubs, spears, bows, earliest fortifications
 *  3. Ancient Armies — Sumerian phalanx, Egyptian chariots, Persian Immortals, Macedonian phalanx
 *  4. Roman Military Machine — legions, engineering, logistics, sieges
 *  5. Medieval Warfare — knights, castles, siege engines, Mongol cavalry, crossbows
 *  6. Gunpowder Revolution — cannons, muskets, end of castle dominance
 *  7. Napoleonic Era — mass armies, total war, artillery doctrine
 *  8. Industrial Warfare — American Civil War, railways, ironclads, rifled weapons
 *  9. World War I — trenches, machine guns, poison gas, tanks, aircraft
 * 10. World War II — blitzkrieg, aircraft carriers, atomic bomb
 * 11. Cold War — nuclear deterrence, proxy wars, guerrilla warfare
 * 12. Modern Warfare — precision munitions, drones, cyber, counterinsurgency
 * 13. Naval Warfare Evolution — triremes → galleons → dreadnoughts → carriers
 * 14. Key Turning Points — technologies that changed everything
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const BRONZE = '#cd7f32';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const OLIVE = '#6b7a2e';
const MILITARY_GREEN = '#4d7c0f';
const BLOOD_RED = '#991b1b';
const NAVY = '#1e3a5f';
const GUNMETAL = '#6b7280';
const SAND = '#d4a574';

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
// Section Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Prehistoric Warfare ─────────────────────────────────────────────────────

const PREHISTORIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'The First Weapons (~400,000 BCE)',
    detail:
      'The earliest weapons were dual-purpose tools: wooden spears hardened in fire, hand axes of knapped flint, and heavy clubs. The Schöningen spears, found in a German coal mine and dating to ~300,000 BCE, are the oldest known hunting weapons — expertly balanced javelins that prove early humans were already sophisticated toolmakers. These same weapons that felled mammoths could fell rival humans.',
  },
  {
    label: 'The Bow — First Ranged Weapon (~70,000 BCE)',
    detail:
      'The bow and arrow was arguably the most revolutionary weapon before gunpowder. It allowed a single warrior to kill from 100+ meters away — a decisive advantage over anyone limited to thrown spears. Stone arrowheads found in South Africa date to ~70,000 BCE. The bow turned warfare from close-range brawls into something approaching tactics: ambush, suppression, and standoff engagement were suddenly possible.',
  },
  {
    label: 'Earliest Fortifications (~8,000 BCE)',
    detail:
      'The walls of Jericho, dating to ~8,000 BCE, are among the oldest known fortifications — a stone wall 3.6 meters high with a tower 8.5 meters tall. The existence of walls this early proves that organized raiding and warfare were already serious enough threats to justify massive communal construction projects. Where there are walls, there were attackers.',
  },
  {
    label: 'Jebel Sahaba — Earliest Known Battle (~12,000 BCE)',
    detail:
      'A cemetery at Jebel Sahaba in Sudan, dating to ~12,000 BCE, contains 61 skeletons, of which at least 24 died violently — struck by stone projectile points embedded in their bones. Men, women, and children were killed. This is the oldest archaeological evidence of organized group violence — warfare at the dawn of settled civilization, driven by competition for resources in the Nile Valley during a period of climate change.',
  },
];

// ── Ancient Armies ──────────────────────────────────────────────────────────

const ANCIENT_TIMELINE: TimelineEntry[] = [
  {
    year: '~2500 BCE',
    title: 'Sumerian Phalanx — The First Organized Army',
    description:
      'The Stele of the Vultures depicts the army of Lagash in tight formation: soldiers in identical helmets, carrying large shields and long spears, advancing shoulder-to-shoulder. This is the earliest known depiction of organized military formation. The Sumerians invented the concept of a professional standing army, replacing raiding parties with disciplined units that trained, drilled, and fought as one. The phalanx — a wall of shields and spears — would dominate infantry warfare for 2,000 years.',
    color: BRONZE,
  },
  {
    year: '~1700 BCE',
    title: 'The Chariot Revolution',
    description:
      'The horse-drawn war chariot, originating on the Central Asian steppe and perfected by the Hyksos, Hittites, and Egyptians, was the first weapons platform. A chariot carrying an archer and driver could outrun infantry, deliver arrows at speed, and shatter formations with shock charges. At the Battle of Kadesh (1274 BCE), Ramesses II fielded thousands of chariots against the Hittites in the largest chariot battle in history. For nearly a millennium, chariots were the tanks of the ancient world — the decisive arm of every major army.',
    color: GOLD,
  },
  {
    year: '~550 BCE',
    title: 'Persian Immortals — The Elite 10,000',
    description:
      'The Achaemenid Persian Empire maintained a corps of exactly 10,000 elite soldiers called the Immortals — so named because whenever one fell, he was immediately replaced, so the unit always appeared to be at full strength. Armed with spears, bows, and short swords, the Immortals were the backbone of the largest army the ancient world had seen. At its peak, Xerxes could field over 100,000 troops — a logistical feat that wouldn\'t be matched for centuries.',
    color: PURPLE,
  },
  {
    year: '338 BCE',
    title: 'The Macedonian Phalanx — Alexander\'s War Machine',
    description:
      'Philip II of Macedon transformed the Greek phalanx by giving his soldiers the sarissa — a 5.5-meter pike, twice the length of a standard spear. The Macedonian phalanx was a hedgehog of spear points: the first five ranks could project their sarissas beyond the front line simultaneously. Combined with heavy cavalry on the flanks (led by his son Alexander), this created the most devastating combined-arms force the ancient world had ever seen. Alexander used it to conquer from Greece to India, never losing a battle.',
    color: BLUE,
  },
];

// ── Roman Military Machine ──────────────────────────────────────────────────

const ROMAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Legion — A System, Not Just an Army',
    detail:
      'The Roman legion was the most sophisticated military organization before the modern era. Each legion of ~5,000 men was divided into cohorts, centuries, and contubernia (tent groups of 8). Soldiers carried standardized equipment: the pilum (heavy javelin designed to bend on impact, making it useless to throw back), the gladius (short stabbing sword), and the large rectangular scutum (shield). But the legion\'s real advantage was its system: professional soldiers served 20-25 years, trained constantly, followed standardized doctrine, and could adapt formations mid-battle.',
  },
  {
    label: 'Engineering as a Weapon',
    detail:
      'Roman soldiers were as much engineers as warriors. Every night on the march, a Roman army built a fortified camp — ditches, palisades, gates, and internal streets — laid out to an identical plan. This meant every Roman camp was a fortress, and Roman soldiers could construct them in their sleep. Roman siege engineering was equally formidable: at Masada (73 CE), they built a massive earthen ramp up a 400-meter cliff rather than accept a siege. At Alesia (52 BCE), Caesar built 18 kilometers of fortifications facing inward to trap the Gauls, and another 21 kilometers facing outward to repel a relief army — simultaneously besieging and defending.',
  },
  {
    label: 'Logistics Won the Empire',
    detail:
      'Rome built 80,000 kilometers of roads — not for trade (that was secondary) but for military deployment. A Roman army could march 25-30 km per day on paved roads, arriving at frontiers faster than any enemy expected. The Roman supply system included granaries, armories, and supply depots positioned throughout the empire. This logistical infrastructure meant Rome could sustain military campaigns for years, across multiple theaters simultaneously — something no other ancient power could match.',
  },
  {
    label: 'Siege Warfare Perfected',
    detail:
      'The Romans elevated siege warfare to a science. Their arsenal included ballistae (giant crossbows), onagers (catapults), siege towers, battering rams, and mining operations. But their greatest siege weapon was patience and engineering. When conventional assault failed, Romans simply built walls around cities and starved them out — or constructed ramps, tunnels, and diversions that made walls irrelevant. The message was clear: no fortification could resist Rome indefinitely.',
  },
];

// ── Medieval Warfare ────────────────────────────────────────────────────────

const MEDIEVAL_TIMELINE: TimelineEntry[] = [
  {
    year: '500–1000',
    title: 'The Age of the Mounted Knight',
    description:
      'The stirrup, arriving in Europe from Central Asia around the 6th-7th century, transformed cavalry warfare. A mounted knight with stirrups could brace a lance and deliver the full momentum of horse and rider into a single devastating point — the couched lance charge. A fully armored knight on a warhorse was essentially an organic tank: nearly invulnerable to infantry weapons, terrifyingly fast, and psychologically devastating. For 500 years, the armored knight dominated European battlefields, and feudal society organized itself around supporting these expensive warriors.',
    color: STEEL,
  },
  {
    year: '1000–1400',
    title: 'Castles — The Dominant Defensive Technology',
    description:
      'The medieval castle was the most important military structure for 400 years. From simple motte-and-bailey designs to massive concentric fortresses like Krak des Chevaliers and Château Gaillard, castles controlled territory, anchored defensive lines, and could only be taken by prolonged siege. The Crusades accelerated castle design enormously — Europeans encountered Byzantine and Islamic fortification techniques and brought them home. A well-stocked castle with a determined garrison could hold out for months or years against vastly superior forces.',
    color: AMBER,
  },
  {
    year: '1206–1294',
    title: 'The Mongol Way of War — Speed, Deception, Terror',
    description:
      'Genghis Khan and his successors built the largest contiguous land empire in history using an army of mounted archers who fought in ways that Europeans and Chinese alike found incomprehensible. Mongol warriors could fire accurately from horseback at full gallop, carry enough provisions (dried meat, fermented mare\'s milk) to operate independently for weeks, and cover 100+ km per day. Their tactics — feigned retreats, encirclement, psychological warfare (catapulting plague-ridden corpses over walls, massacring cities that resisted) — were centuries ahead of contemporary armies. At the Battle of Mohi (1241), 20,000 Mongols destroyed a Hungarian army of 40,000.',
    color: CRIMSON,
  },
  {
    year: '1346',
    title: 'The Longbow at Crécy — Infantry Kills Knights',
    description:
      'At the Battle of Crécy (1346), 7,000 English longbowmen destroyed repeated charges by France\'s armored knights — the most prestigious warriors in Europe. The English longbow could send arrows 250 meters, penetrate chain mail, and deliver 10-12 arrows per minute. English archers, mostly peasants, slaughtered the flower of French chivalry. Crécy, Poitiers (1356), and Agincourt (1415) proved that massed missile fire could defeat heavily armored cavalry — a lesson that pointed toward the future dominance of projectile weapons over armor.',
    color: GREEN,
  },
  {
    year: '1100–1400',
    title: 'The Crossbow — Point-and-Shoot Lethality',
    description:
      'The crossbow was so deadly that the Second Lateran Council (1139) banned its use against Christians — a ban that was universally ignored. Unlike the longbow, which required years of training and immense physical strength, a crossbow could be learned in days. A crossbow bolt could penetrate plate armor at close range. This was revolutionary: a peasant with a week of training could kill a knight who had trained since childhood. The crossbow democratized killing and began the slow erosion of the armored elite\'s battlefield dominance.',
    color: INDIGO,
  },
];

// ── Gunpowder Revolution ────────────────────────────────────────────────────

const GUNPOWDER_INSIGHTS: InsightEntry[] = [
  {
    label: 'Chinese Origins (~850–1000 CE)',
    detail:
      'Gunpowder was invented in China, likely by alchemists searching for an elixir of immortality. By the 10th century, the Song dynasty was using gunpowder weapons in warfare: fire arrows, bombs, and primitive rockets. The "fire lance" — a bamboo tube packed with gunpowder and projectiles — was the ancestor of all firearms. Chinese armies deployed gunpowder weapons against the Mongols and each other for centuries before the technology spread westward along Silk Road trade routes.',
  },
  {
    label: 'Cannons End the Castle (~1400s)',
    detail:
      'The cannon made medieval castles obsolete in about 50 years. The pivotal demonstration came in 1453, when Ottoman Sultan Mehmed II used massive bombards (including the 8-meter "Basilica" cannon) to batter down the walls of Constantinople — walls that had resisted siege for over 1,000 years. Suddenly, stone walls that had taken decades to build could be reduced to rubble in hours. Fortification design shifted to the trace italienne — low, thick, angled earthen walls designed to absorb cannon fire — changing military architecture permanently.',
  },
  {
    label: 'The Musket — Every Soldier a Killer',
    detail:
      'The matchlock musket (1400s), flintlock (1600s), and their descendants transformed infantry warfare completely. A musketeer could be trained in weeks; a longbowman took years. By the 1600s, massed musket volleys had replaced arrow storms as the dominant ranged infantry tactic. The combination of musket, pike, and drill — epitomized by the Swedish army under Gustavus Adolphus — created the template for modern infantry: disciplined formations delivering coordinated firepower. The individual knight, the mounted archer, the master swordsman — all became obsolete against a line of men with guns.',
  },
  {
    label: 'The Trace Italienne — Fortification Reborn',
    detail:
      'The answer to the cannon wasn\'t to give up on fortification — it was to reinvent it. The trace italienne (Italian trace) used low, thick walls backed by massive earthen ramparts that absorbed cannonballs instead of shattering. Star-shaped bastions provided interlocking fields of fire, eliminating dead zones. Vauban, Louis XIV\'s military engineer, perfected the system: his fortresses along France\'s borders were so formidable that siege warfare became a mathematical science of parallel trenches and geometric approaches. Some Vauban fortifications remained militarily relevant into World War I.',
  },
];

// ── Napoleonic Era ──────────────────────────────────────────────────────────

const NAPOLEONIC_TIMELINE: TimelineEntry[] = [
  {
    year: '1789–1799',
    title: 'The Levée en Masse — Birth of Mass Armies',
    description:
      'The French Revolution introduced a concept that changed warfare forever: the nation in arms. The levée en masse of 1793 declared that every citizen owed military service to the Republic. France raised armies of unprecedented size — over 750,000 men by 1794 — fueled by revolutionary fervor rather than mercenary wages or feudal obligation. This was the birth of modern conscription and the mass army. Combined with the promotion of officers by merit rather than birth, it created a military force with a fundamentally different character than any European army before it.',
    color: BLUE,
  },
  {
    year: '1805',
    title: 'Austerlitz — Napoleon\'s Masterpiece',
    description:
      'At the Battle of Austerlitz (December 2, 1805), Napoleon demonstrated the revolution in warfare he had pioneered. He deliberately weakened his right flank to lure the Russo-Austrian army into attacking it, then smashed through their weakened center with his concentrated reserves. The Grande Armée moved in self-contained corps that could march independently but concentrate rapidly for battle. Napoleon combined artillery preparation, infantry assault, and cavalry exploitation into a seamless battle plan. 73,000 French troops defeated 85,000 allies, inflicting 36,000 casualties while suffering 9,000.',
    color: GOLD,
  },
  {
    year: '1807–1812',
    title: 'Artillery — The God of War',
    description:
      'Napoleon, himself an artillery officer, elevated artillery from a supporting arm to the decisive weapon on the battlefield. At Friedland (1807), massed French artillery devastated the Russian army. Napoleon\'s Grand Battery at Wagram (1809) concentrated over 100 guns to smash the Austrian center. His famous dictum — "God is on the side of the big battalions" — was really about firepower concentration. The Napoleonic wars established artillery as the dominant killer on the battlefield, a position it would hold through both World Wars.',
    color: RED,
  },
  {
    year: '1812',
    title: 'Russia — The Limits of Napoleonic Warfare',
    description:
      'Napoleon invaded Russia with over 600,000 men — the largest army Europe had ever seen. He expected a decisive battle near the border. Instead, the Russians retreated, trading space for time, burning crops and villages as they went. The Battle of Borodino was a Pyrrhic victory; Moscow was empty and ablaze. The retreat through the Russian winter destroyed the Grande Armée: fewer than 100,000 men made it home. Russia demonstrated that Napoleonic warfare — dependent on quick decisive battles and living off the land — could be defeated by strategic depth, scorched earth, and winter.',
    color: CRIMSON,
  },
];

// ── Industrial Warfare ──────────────────────────────────────────────────────

const INDUSTRIAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1861–1865',
    title: 'The American Civil War — First Modern War',
    description:
      'The Civil War was the first conflict to fully demonstrate industrial warfare. Rifled muskets (accurate to 500 meters, vs. 100 for smoothbores) made frontal assaults suicidal — a lesson commanders took years to learn, at staggering cost. The war introduced trench warfare, ironclad warships (Monitor vs. Virginia), observation balloons, repeating rifles, land mines, and the telegraph for real-time command. Railways allowed the rapid movement of armies and supplies across continental distances. 620,000 dead — more Americans than in all other US wars combined until Vietnam.',
    color: BLUE,
  },
  {
    year: '1860s–1870s',
    title: 'Breech-Loading and Repeating Rifles',
    description:
      'The shift from muzzle-loading to breech-loading rifles multiplied infantry firepower by 3-5x. A soldier with a breech-loader could fire 8-10 rounds per minute while lying down, compared to 2-3 rounds standing with a muzzle-loader. Repeating rifles like the Spencer and Henry went further, with 15-round magazines. The Prussian "needle gun" (Dreyse) proved decisive at Königgrätz (1866), where Prussian infantry fired three shots for every Austrian one. These weapons made the defensive dominant — attackers advancing over open ground against rapid rifle fire suffered catastrophic losses.',
    color: STEEL,
  },
  {
    year: '1862',
    title: 'Ironclads — The Death of Wooden Navies',
    description:
      'The Battle of Hampton Roads (March 8-9, 1862) between USS Monitor and CSS Virginia demonstrated that ironclad warships made every wooden navy in the world instantly obsolete. Cannonballs that would have shattered a wooden ship bounced off iron armor. Within a decade, every major navy was building ironclads, and within a generation, these evolved into steel battleships with turret-mounted rifled guns. Naval warfare was transformed from a contest of wooden sailing ships — essentially unchanged since the 1600s — to an arms race of industrial technology.',
    color: NAVY,
  },
  {
    year: '1870–1871',
    title: 'The Franco-Prussian War — Staff Planning Wins',
    description:
      'Prussia\'s crushing defeat of France in 1870-71 demonstrated that modern warfare was won by planning, logistics, and mobilization speed. The Prussian General Staff — under Helmuth von Moltke — used railways and telegraph to mobilize and deploy 380,000 troops faster than France could organize a response. The French army was larger and had superior rifles (the Chassepot outranged the Dreyse), but Prussian staff work, artillery (Krupp steel breech-loading cannons), and organization were overwhelming. This war created the German Empire and the template for industrial-age warfare.',
    color: MILITARY_GREEN,
  },
];

// ── World War I ─────────────────────────────────────────────────────────────

const WWI_TIMELINE: TimelineEntry[] = [
  {
    year: '1914',
    title: 'The Western Front Freezes — Birth of Trench Warfare',
    description:
      'By November 1914, a continuous line of trenches stretched 700 km from the English Channel to Switzerland. The combination of machine guns, barbed wire, and artillery had made offensive warfare essentially impossible: attackers advancing across no-man\'s land were cut down in minutes. The result was a stalemate that consumed millions of lives over four years as generals on both sides repeatedly tried — and failed — to break through using ever-larger artillery barrages and infantry assaults. The Western Front moved less than 16 km in either direction from 1914 to 1918.',
    color: OLIVE,
  },
  {
    year: '1916',
    title: 'Verdun and the Somme — Industrial Slaughter',
    description:
      'The Battles of Verdun (February–December 1916) and the Somme (July–November 1916) epitomized the horror of industrial warfare. At Verdun, the German plan was literally to "bleed France white" through attrition — both sides lost over 300,000 men for zero territorial change. On the first day of the Somme (July 1, 1916), the British suffered 57,470 casualties — the bloodiest day in British military history — advancing into machine gun fire after a week-long artillery barrage that failed to destroy the German defenses. The Somme produced over 1 million total casualties for an advance of 10 km.',
    color: BLOOD_RED,
  },
  {
    year: '1915',
    title: 'Poison Gas — A New Horror',
    description:
      'On April 22, 1915, German troops released 168 tons of chlorine gas at Ypres, creating a 6-km wide cloud that rolled toward French and Algerian positions. Soldiers who had never seen chemical weapons fled in terror, gasping and dying. This was the first large-scale use of chemical weapons in modern warfare. Both sides rapidly escalated: phosgene (10x deadlier than chlorine) and mustard gas (which blistered skin, eyes, and lungs) followed. Gas masks became standard equipment. By war\'s end, chemical weapons had caused over 1 million casualties, including 90,000 deaths.',
    color: GREEN,
  },
  {
    year: '1916–1918',
    title: 'The Tank — Breaking the Deadlock',
    description:
      'The tank was invented specifically to solve the Western Front stalemate: a armored vehicle that could cross no-man\'s land, crush barbed wire, and suppress machine gun positions. The first tanks appeared at the Somme in September 1916 — slow, unreliable, and terrifying. By 1918, tanks had evolved into a war-winning weapon: at Amiens (August 8, 1918, what Ludendorff called "the black day of the German Army"), 534 British tanks spearheaded an assault that broke through German lines and advanced 13 km in a single day. The tank restored mobility to warfare.',
    color: AMBER,
  },
  {
    year: '1914–1918',
    title: 'Aircraft — From Scouts to Bombers',
    description:
      'Aviation went from novelty to essential in four years. In 1914, aircraft were used for reconnaissance. By 1915, pilots were shooting at each other with pistols, then mounted machine guns. By 1918, dedicated fighter aircraft, ground-attack planes, and strategic bombers existed. The Red Baron (80 kills), the concept of air superiority, aerial bombing of cities, and carrier-based aviation concepts all emerged from WWI. Total aircraft production went from a few hundred in 1914 to over 50,000 per year by 1918 — the first true arms race in the sky.',
    color: BLUE,
  },
];

// ── World War II ────────────────────────────────────────────────────────────

const WWII_TIMELINE: TimelineEntry[] = [
  {
    year: '1939–1941',
    title: 'Blitzkrieg — Combined Arms at Lightning Speed',
    description:
      'Germany\'s Blitzkrieg ("lightning war") combined tanks, motorized infantry, dive bombers, and radio communications into a doctrine of rapid encirclement and exploitation. Poland fell in 5 weeks. France — which had the world\'s largest army — fell in 6 weeks. The key wasn\'t technological superiority (French tanks were individually better) but doctrinal innovation: German Panzer divisions concentrated armor at a schwerpunkt (focal point), broke through, and raced deep into the enemy rear before defenders could react. It was the opposite of WWI: speed and shock replaced attrition.',
    color: STEEL,
  },
  {
    year: '1942–1943',
    title: 'Stalingrad — The Turning Point',
    description:
      'The Battle of Stalingrad (August 1942 – February 1943) was the deadliest battle in human history: an estimated 2 million total casualties, including over 800,000 Axis dead. The German 6th Army was encircled by a massive Soviet counteroffensive (Operation Uranus) and destroyed. Stalingrad broke the myth of German invincibility and marked the strategic turning point of the war in Europe. The Soviets absorbed staggering losses — 27 million dead total in WWII — and ground the Wehrmacht down through sheer industrial output, manpower, and increasingly sophisticated operations.',
    color: CRIMSON,
  },
  {
    year: '1941–1945',
    title: 'Aircraft Carriers — The New Capital Ship',
    description:
      'The Pacific War proved that aircraft carriers had replaced battleships as the dominant naval weapon. At Pearl Harbor (1941), Japanese carrier-based aircraft destroyed the US battleship fleet. At Midway (1942), carrier planes sank four Japanese carriers in a single day — the decisive naval battle of the war. By 1945, the US Navy had over 100 carriers of various types. A single carrier air group could project more destructive power than an entire WWI-era fleet. The battleship, queen of the seas for 400 years, was rendered obsolete by aircraft that could strike from 300+ miles away.',
    color: NAVY,
  },
  {
    year: '1944',
    title: 'D-Day — The Largest Amphibious Assault in History',
    description:
      'On June 6, 1944, 156,000 Allied troops landed on five beaches in Normandy — supported by 5,000 ships, 11,000 aircraft, and the most elaborate deception operation in military history (Operation Bodyguard, which convinced the Germans the real landing would be at Calais). The logistics were staggering: within a month, over 850,000 troops and 150,000 vehicles had crossed the Channel. The Allies even built two artificial harbors (Mulberry harbors) and laid an undersea fuel pipeline (PLUTO). D-Day demonstrated that industrial democracies could plan and execute military operations of unprecedented complexity.',
    color: BLUE,
  },
  {
    year: 'August 6 & 9, 1945',
    title: 'The Atomic Bomb — A New Era',
    description:
      'The destruction of Hiroshima (August 6) and Nagasaki (August 9) with single nuclear weapons ended the war with Japan and opened the nuclear age. Little Boy killed approximately 80,000 people instantly; Fat Man killed 40,000. Total deaths from both bombings, including radiation effects, exceeded 200,000. For the first time in history, a single weapon could destroy an entire city. The strategic implications were immediate and permanent: nuclear weapons made total war between great powers potentially suicidal, fundamentally altering the calculus of international conflict.',
    color: ROSE,
  },
];

// ── Cold War ────────────────────────────────────────────────────────────────

const COLD_WAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Nuclear Deterrence — MAD Logic',
    detail:
      'Mutually Assured Destruction (MAD) was the terrifying logic that kept the Cold War cold: both the US and USSR maintained nuclear arsenals so large that a first strike by either side would still leave the other with enough surviving weapons to obliterate the attacker. At its peak, the global nuclear arsenal exceeded 70,000 warheads — enough to destroy human civilization many times over. ICBMs could reach their targets in 30 minutes, giving leaders almost no time to decide. Paradoxically, the most destructive weapons ever created may have prevented the deadliest war in history.',
  },
  {
    label: 'Proxy Wars — Fighting Through Others',
    detail:
      'Because direct conflict between nuclear powers risked annihilation, the Cold War was fought through proxies: Korea (1950-53), Vietnam (1955-75), the Arab-Israeli wars, the Soviet-Afghan War (1979-89), and dozens of smaller conflicts in Africa, Latin America, and Southeast Asia. Superpowers armed, trained, and sometimes directed local forces without engaging each other directly. The human cost was enormous — millions died in proxy wars — but the nuclear threshold was never crossed. These conflicts also seeded insurgencies, arms proliferation, and failed states whose consequences persist today.',
  },
  {
    label: 'Guerrilla Warfare — The Weak Defeat the Strong',
    detail:
      'The Cold War era saw the refinement of guerrilla warfare as a strategy for defeating technologically superior opponents. Mao Zedong, Ho Chi Minh, Che Guevara, and countless resistance leaders demonstrated that irregular forces — operating among civilian populations, avoiding decisive battles, and eroding the enemy\'s political will — could defeat conventional armies. Vietnam was the decisive proof: the most powerful military in history, with total air superiority and overwhelming firepower, was defeated by a guerrilla force that simply refused to quit. The lesson reshaped military thinking permanently.',
  },
  {
    label: 'The Revolution in Military Technology',
    detail:
      'The Cold War drove a technological arms race that transformed every aspect of warfare: jet aircraft, helicopters (which defined Vietnam), nuclear submarines, spy satellites, precision-guided munitions, stealth technology, night vision, and the early internet (ARPANET was a DOD project). Military R&D budgets were enormous — the Manhattan Project, the space race, and countless classified programs pushed technology forward at an unprecedented pace. Many technologies that define modern civilian life — GPS, the internet, jet aviation, satellite communications — originated in Cold War military programs.',
  },
];

// ── Modern Warfare ──────────────────────────────────────────────────────────

const MODERN_TIMELINE: TimelineEntry[] = [
  {
    year: '1991',
    title: 'Desert Storm — Precision Revolution',
    description:
      'The 1991 Gulf War announced a revolution in military affairs. Precision-guided munitions (PGMs) — laser-guided bombs, cruise missiles, GPS-guided weapons — could hit targets with meter-level accuracy, making one modern bomber as effective as hundreds of WWII aircraft. Stealth fighters penetrated Iraqi air defenses undetected. Real-time satellite intelligence gave commanders unprecedented battlefield awareness. The US-led coalition destroyed the world\'s fourth-largest army in 100 hours of ground combat, with fewer than 300 coalition deaths. The technological gap between the US military and the rest of the world became a chasm.',
    color: TEAL,
  },
  {
    year: '2001–present',
    title: 'The Drone Age — Remote-Controlled Warfare',
    description:
      'Armed drones (UAVs) fundamentally changed the calculus of military intervention. The MQ-1 Predator and MQ-9 Reaper allowed the US to conduct persistent surveillance and precision strikes anywhere on Earth without risking pilot lives. Drone warfare enabled targeted killings of individuals — a capability that blurred the line between war and assassination. By the 2020s, cheap commercial drones modified with explosives (as seen in Ukraine, Syria, and Yemen) democratized aerial warfare: $500 drones destroying million-dollar vehicles became the defining image of modern conflict.',
    color: PURPLE,
  },
  {
    year: '2010s–present',
    title: 'Cyber Warfare — The Fifth Domain',
    description:
      'Cyberspace became recognized as a domain of warfare alongside land, sea, air, and space. Stuxnet (discovered 2010) — a computer worm that physically destroyed Iranian nuclear centrifuges — proved that code could be a weapon with physical effects. Nation-states built cyber commands and stockpiled zero-day exploits. Cyberattacks could disable power grids, disrupt financial systems, manipulate elections, and steal military secrets without a single soldier crossing a border. For the first time in history, a teenager with a laptop could theoretically inflict damage previously requiring an army.',
    color: INDIGO,
  },
  {
    year: '2022–present',
    title: 'Ukraine — Return of Large-Scale Conventional War',
    description:
      'Russia\'s 2022 invasion of Ukraine shattered assumptions that large-scale conventional war between modern armies was obsolete. The conflict became a proving ground for 21st-century warfare: cheap FPV drones hunting tanks, Javelin and NLAW missiles destroying armored columns, Starlink providing battlefield communications, commercial satellite imagery enabling precision artillery, and electronic warfare jamming GPS and drone signals. Trench warfare returned to Europe. The war demonstrated that industrial capacity — artillery shell production, drone manufacturing — still matters as much as high-tech wonder weapons.',
    color: GOLD,
  },
];

// ── Naval Warfare Evolution ─────────────────────────────────────────────────

const NAVAL_TIMELINE: TimelineEntry[] = [
  {
    year: '~500 BCE',
    title: 'Triremes — Oar-Powered Warfare',
    description:
      'The trireme — a sleek galley with three banks of oars, 170 rowers, and a bronze ram at the bow — dominated Mediterranean warfare for centuries. At the Battle of Salamis (480 BCE), the Greek fleet of ~370 triremes lured the larger Persian fleet into the narrow strait and destroyed it, saving Greek civilization. Trireme warfare was about ramming: captains drove their bronze-tipped bows into enemy hulls at speed, then backed away as the stricken ship flooded. Naval warfare began as a kind of maritime chariot charge.',
    color: BRONZE,
  },
  {
    year: '1500s–1700s',
    title: 'Galleons — Broadside and Empire',
    description:
      'The galleon — a large, heavily-armed sailing ship — enabled European empires to project power across oceans. The shift from ramming to broadside gunnery (rows of cannons firing through gun ports) transformed naval combat: ships became floating artillery platforms. The Spanish Armada (1588), the Anglo-Dutch Wars, and the battles of the Age of Sail were fought by fleets exchanging devastating broadsides at close range. Naval supremacy became essential to empire: whoever controlled the seas controlled global trade, colonies, and ultimately wealth.',
    color: AMBER,
  },
  {
    year: '1906',
    title: 'HMS Dreadnought — The Battleship Arms Race',
    description:
      'HMS Dreadnought (1906) made every existing battleship obsolete overnight. With an "all-big-gun" armament (ten 12-inch guns vs. the mixed batteries of previous ships), steam turbine propulsion, and heavy armor, Dreadnought was so superior that it reset the naval balance to zero — every navy, including Britain\'s, had to start over. The resulting naval arms race between Britain and Germany was a major factor in the tensions that led to World War I. For three decades, dreadnought-type battleships were considered the ultimate measure of national power.',
    color: STEEL,
  },
  {
    year: '1914–1945',
    title: 'Submarines — The Invisible Threat',
    description:
      'The submarine transformed naval warfare from surface duels to three-dimensional combat. In both World Wars, German U-boats nearly strangled Britain by sinking merchant shipping — in the Battle of the Atlantic (1939-45), U-boats sank 3,500 merchant ships and 175 warships. The submarine negated surface superiority: it didn\'t matter how many battleships you had if your supply convoys were being torpedoed. Nuclear submarines (from 1955) could remain submerged indefinitely and carry ballistic missiles — becoming the most survivable leg of the nuclear triad and ensuring mutual assured destruction.',
    color: GUNMETAL,
  },
  {
    year: '1941–present',
    title: 'Aircraft Carriers — Floating Airfields',
    description:
      'The aircraft carrier became the dominant naval weapon in WWII and has remained so ever since. A single US Nimitz-class carrier displaces 100,000 tons, carries 80+ aircraft, and projects more combat power than most nations\' entire air forces. Carrier battle groups — a carrier plus escorts — can operate anywhere in international waters, providing a mobile airbase that needs no basing rights or diplomatic permissions. The US Navy operates 11 nuclear-powered supercarriers; no other nation has more than two. Carriers are the primary instrument of global power projection in the modern era.',
    color: NAVY,
  },
];

// ── Key Turning Points ──────────────────────────────────────────────────────

const TURNING_POINTS: InsightEntry[] = [
  {
    label: 'The Stirrup (~6th century)',
    detail:
      'A simple metal loop for a rider\'s foot transformed cavalry from mounted skirmishers into shock troops. With stirrups, a rider could brace for impact and deliver the full force of a charging horse through a couched lance — making heavy cavalry the dominant arm for centuries. Some historians argue the stirrup created feudalism itself, as the expense of maintaining armored cavalry required the land-grant system.',
  },
  {
    label: 'Gunpowder (13th century in Europe)',
    detail:
      'Gunpowder rendered 1,000 years of fortification technology obsolete and eventually made armor, castles, and mounted knights irrelevant. It democratized warfare: a musket required weeks of training vs. years for a longbow or sword. It centralized power in states (only states could afford cannons and gunpowder armies), helping end feudalism and create the modern nation-state. No single technology has reshaped warfare more completely.',
  },
  {
    label: 'The Rifled Barrel (19th century)',
    detail:
      'Spiral grooves inside a gun barrel that spin the projectile increased accuracy from ~100 meters (smoothbore) to 500+ meters (rifle). This single innovation made frontal assaults across open ground suicidal and fundamentally shifted the balance from offense to defense. Generals were slow to adapt — the result was the bloodbaths of the Civil War, the Boer War, and World War I, where tactics lagged decades behind weapons technology.',
  },
  {
    label: 'The Machine Gun (1884)',
    detail:
      'Hiram Maxim\'s fully automatic machine gun could fire 600 rounds per minute — replacing 40-80 riflemen with a single weapon crew. The machine gun made defensive positions almost impregnable and rendered massed infantry charges — the basic offensive tactic for millennia — into mass suicide. At the Battle of the Somme, British soldiers walking into machine gun fire suffered 57,000 casualties in a single day. The machine gun forced the development of tanks, aircraft, and combined-arms doctrine to restore offensive capability.',
  },
  {
    label: 'Nuclear Weapons (1945)',
    detail:
      'Nuclear weapons didn\'t just change warfare — they changed the fundamental logic of international relations. For the first time, a war between great powers could result in the extinction of human civilization. This made total war between nuclear states irrational (MAD), channeled conflict into proxy wars and limited engagements, and created the arms control framework that (imperfectly) governs the world today. The nuclear revolution\'s deepest effect may be negative: the great power wars that killed hundreds of millions in 1914-1945 have not recurred.',
  },
  {
    label: 'Precision-Guided Munitions (1991–)',
    detail:
      'Smart weapons — guided by laser, GPS, or infrared — made it possible to hit a specific building, vehicle, or bunker from miles away. This collapsed the ratio of bombs-per-target from hundreds (WWII) to one, multiplying the effective combat power of a single aircraft by 100x. PGMs also changed the politics of warfare: the promise of "surgical strikes" with minimal collateral damage made military intervention politically easier to justify, lowering the threshold for the use of force.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Alexander the Great',
    years: '356–323 BCE',
    contribution:
      'Conquered from Greece to India using combined-arms warfare — heavy infantry phalanx pinning the enemy while companion cavalry delivered the decisive blow. Never lost a battle. His campaigns demonstrated that strategic audacity and tactical genius could defeat numerically superior forces.',
  },
  {
    name: 'Hannibal Barca',
    years: '247–183 BCE',
    contribution:
      'Carthaginian general who crossed the Alps with elephants and defeated Rome repeatedly on its own soil. His double envelopment at Cannae (216 BCE) — where 50,000 Romans were encircled and annihilated — is still studied at military academies as the perfect tactical battle.',
  },
  {
    name: 'Genghis Khan',
    years: '1162–1227',
    contribution:
      'Built the largest contiguous land empire through revolutionary military organization, intelligence gathering, and psychological warfare. His army\'s mobility, discipline, and adaptability were unmatched. The Mongol military system was arguably the most effective in pre-modern history.',
  },
  {
    name: 'Gustavus Adolphus',
    years: '1594–1632',
    contribution:
      'The "Father of Modern Warfare." The Swedish king revolutionized tactics by combining mobile artillery, musket volleys, and cavalry charges into coordinated combined-arms operations. His reforms created the template for European armies for the next two centuries.',
  },
  {
    name: 'Napoleon Bonaparte',
    years: '1769–1821',
    contribution:
      'Revolutionized warfare through the corps system (self-sustaining army divisions), meritocratic officer promotion, decisive battle-seeking strategy, and the integration of mass conscription with professional leadership. Won 53 of 60 battles. His campaigns remain the most studied in military history.',
  },
  {
    name: 'Carl von Clausewitz',
    years: '1780–1831',
    contribution:
      'Prussian theorist whose "On War" remains the foundational text of Western military thought. His concepts — war as "politics by other means," the "fog of war," the "friction" of combat, the "culminating point" of attack — shaped how every subsequent generation understood conflict.',
  },
  {
    name: 'Heinz Guderian',
    years: '1888–1954',
    contribution:
      'Pioneer of armored warfare doctrine. His book "Achtung — Panzer!" laid out the theory of Blitzkrieg: concentrated armor, close air support, radio coordination, and deep penetration. Led the Panzer thrust through the Ardennes in 1940 that defeated France in six weeks.',
  },
  {
    name: 'Vo Nguyen Giap',
    years: '1911–2013',
    contribution:
      'Vietnamese general who defeated both France (Dien Bien Phu, 1954) and the United States through a combination of guerrilla warfare, conventional operations, and extraordinary strategic patience. Demonstrated that a determined, ideologically motivated force could defeat technologically superior opponents.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Reusable layout components
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
    <section id={id} style={{ marginBottom: 48 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.6rem',
            fontWeight: 700,
            marginBottom: 12,
            color: accentColor,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.8,
            fontSize: '0.98rem',
            marginBottom: 20,
            maxWidth: 800,
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

const FIGURE_COLORS = [MILITARY_GREEN, BLUE, CRIMSON, STEEL, GREEN, RED, AMBER, ROSE, GOLD, PURPLE];

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

export default function HistoryOfWarfare() {
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
              background: `linear-gradient(135deg, ${CRIMSON}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The History of Warfare — From Prehistoric Clubs to Cyber Weapons
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
              War is humanity's oldest organized activity. From the first
              sharpened stick to hypersonic missiles and autonomous drones, the
              tools of killing have driven technological innovation, toppled
              empires, redrawn borders, and shaped every civilization that has
              ever existed. This is the story of how humans have fought — and
              how each revolution in weaponry and tactics rewrote the rules of
              power.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              Spanning 12,000 years and every continent, the evolution of
              warfare follows a relentless pattern: a new weapon or doctrine
              creates a temporary advantage, defenders adapt, and the cycle
              begins again. The chariot gave way to the phalanx, the castle to
              the cannon, the trench to the tank, the battleship to the
              aircraft carrier. Each transformation cost millions of lives —
              and each reshaped the world.
            </p>
          </motion.div>
        </header>

        {/* ── Prehistoric Warfare ─────────────────────────────────────── */}
        <SectionWrapper
          id="prehistoric"
          icon="🪨"
          title="Prehistoric Warfare — When Killing Became Organized"
          accentColor={SAND}
          intro="Before states, before writing, before cities — there was war. Archaeological evidence reveals that organized violence is far older than civilization itself. The weapons were crude but effective, and the stakes — food, water, territory, survival — were existential."
        >
          <InsightGrid items={PREHISTORIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ancient Armies ──────────────────────────────────────────── */}
        <SectionWrapper
          id="ancient"
          icon="⚔️"
          title="Ancient Armies — Chariots, Phalanxes, and Empires"
          accentColor={BRONZE}
          intro="The rise of civilization brought the rise of organized armies. From the first Sumerian phalanx to Alexander's world-conquering war machine, the ancient world developed military systems of remarkable sophistication — professional soldiers, combined arms, logistics, and engineering that wouldn't be matched again for over a thousand years."
        >
          <TimelineCard entries={ANCIENT_TIMELINE} />
        </SectionWrapper>

        {/* ── Roman Military Machine ─────────────────────────────────── */}
        <SectionWrapper
          id="roman"
          icon="🏛️"
          title="The Roman Military Machine — How a City Conquered the World"
          accentColor={RED}
          intro="Rome didn't just build an army — it built a system. The Roman military was the most professional, disciplined, and adaptable fighting force the ancient world ever produced. For 500 years, legions conquered and held an empire stretching from Scotland to Mesopotamia, not through superior weapons but through superior organization, engineering, and sheer institutional persistence."
        >
          <InsightGrid items={ROMAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Medieval Warfare ────────────────────────────────────────── */}
        <SectionWrapper
          id="medieval"
          icon="🏰"
          title="Medieval Warfare — Knights, Castles, and the Mongol Storm"
          accentColor={AMBER}
          intro="The medieval period saw warfare dominated by two forces: the armored mounted knight in Europe and the horse archer on the Asian steppe. Castles controlled territory, siege warfare became an art form, and the Mongols demonstrated that mobility and tactical flexibility could defeat any fortification or heavy cavalry charge."
        >
          <TimelineCard entries={MEDIEVAL_TIMELINE} />
        </SectionWrapper>

        {/* ── Gunpowder Revolution ────────────────────────────────────── */}
        <SectionWrapper
          id="gunpowder"
          icon="💥"
          title="The Gunpowder Revolution — The End of the Medieval World"
          accentColor={ROSE}
          intro="Gunpowder — invented in China, weaponized across Eurasia — destroyed the military order that had prevailed for a millennium. Cannons smashed castle walls. Muskets made armor obsolete. A peasant with a gun could kill a knight with a lifetime of training. The gunpowder revolution didn't just change warfare — it ended feudalism and birthed the modern nation-state."
        >
          <InsightGrid items={GUNPOWDER_INSIGHTS} />
        </SectionWrapper>

        {/* ── Napoleonic Era ──────────────────────────────────────────── */}
        <SectionWrapper
          id="napoleonic"
          icon="🎖️"
          title="The Napoleonic Era — Mass Armies and Total War"
          accentColor={BLUE}
          intro="The French Revolution and Napoleon transformed warfare from a limited contest between professional armies into a clash of entire nations. Conscription created armies of unprecedented size. Meritocratic promotion unleashed military talent previously trapped by aristocratic birth. Artillery became the decisive weapon. And the concept of 'total war' — mobilizing an entire society for military purposes — was born."
        >
          <TimelineCard entries={NAPOLEONIC_TIMELINE} />
        </SectionWrapper>

        {/* ── Industrial Warfare ──────────────────────────────────────── */}
        <SectionWrapper
          id="industrial"
          icon="🏭"
          title="Industrial Warfare — Railroads, Rifles, and Ironclads"
          accentColor={STEEL}
          intro="The Industrial Revolution weaponized itself. Railways moved armies at unprecedented speed. Rifled weapons made every battlefield deadlier. Ironclad warships rendered wooden navies obsolete overnight. The American Civil War and the Franco-Prussian War proved that industrial capacity — factories, railroads, telegraph networks — was now as important as courage or tactical brilliance."
        >
          <TimelineCard entries={INDUSTRIAL_TIMELINE} />
        </SectionWrapper>

        {/* ── World War I ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="wwi"
          icon="⛏️"
          title="World War I — The War That Broke the Old World"
          accentColor={OLIVE}
          intro="The 'Great War' was the catastrophic collision between 19th-century tactics and 20th-century weapons. Machine guns, barbed wire, and artillery created a defensive deadlock that generals tried to break with ever-larger doses of men and shells. 20 million dead. Four empires destroyed. And the birth of tanks, aircraft, chemical weapons, and the modern concept of total industrial warfare."
        >
          <TimelineCard entries={WWI_TIMELINE} />
        </SectionWrapper>

        {/* ── World War II ────────────────────────────────────────────── */}
        <SectionWrapper
          id="wwii"
          icon="✈️"
          title="World War II — The Deadliest Conflict in Human History"
          accentColor={CRIMSON}
          intro="70-85 million dead. Every continent affected. The war that produced Blitzkrieg, aircraft carriers, radar, jet engines, rockets, and the atomic bomb — the war that ended with a weapon capable of destroying civilization. WWII was the ultimate expression of industrial total war: entire national economies converted to military production, civilian populations targeted as never before, and technology advancing at wartime speed."
        >
          <TimelineCard entries={WWII_TIMELINE} />
        </SectionWrapper>

        {/* ── Cold War ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="cold-war"
          icon="☢️"
          title="The Cold War — Living Under the Bomb"
          accentColor={INDIGO}
          intro="For 45 years, the world lived under the shadow of nuclear annihilation. The Cold War never turned hot between the superpowers — precisely because the weapons were too terrible to use. Instead, the US and USSR fought through proxies, competed in arms races and space races, and developed the military technologies that define warfare today. The Cold War's central paradox: weapons designed to destroy the world may have saved it."
        >
          <InsightGrid items={COLD_WAR_INSIGHTS} />
        </SectionWrapper>

        {/* ── Modern Warfare ──────────────────────────────────────────── */}
        <SectionWrapper
          id="modern"
          icon="🛰️"
          title="Modern Warfare — Precision, Drones, and Cyber"
          accentColor={TEAL}
          intro="The post-Cold War era brought a revolution in military affairs: precision-guided weapons that could hit a doorway from 20 miles away, drones that removed pilots from cockpits, cyber weapons that could destroy infrastructure without a single bullet, and the return of large-scale conventional war in Europe. Warfare in the 21st century is simultaneously more precise and more unpredictable than ever."
        >
          <TimelineCard entries={MODERN_TIMELINE} />
        </SectionWrapper>

        {/* ── Naval Warfare ───────────────────────────────────────────── */}
        <SectionWrapper
          id="naval"
          icon="⚓"
          title="Naval Warfare — From Triremes to Supercarriers"
          accentColor={NAVY}
          intro="Control of the seas has decided the fate of empires since the Greeks defeated Persia at Salamis. Naval warfare evolved from oar-powered ramming to broadside gunnery to aircraft carrier strike groups — each transition rendering the previous era's warships obsolete. The story of naval warfare is the story of global power itself."
        >
          <TimelineCard entries={NAVAL_TIMELINE} />
        </SectionWrapper>

        {/* ── Key Turning Points ──────────────────────────────────────── */}
        <SectionWrapper
          id="turning-points"
          icon="⚡"
          title="Key Technological Turning Points"
          accentColor={GOLD}
          intro="Across 12,000 years of warfare, a handful of innovations didn't just change battles — they changed the entire structure of military power, political organization, and human society. These are the technologies that rewrote the rules of war."
        >
          <InsightGrid items={TURNING_POINTS} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Military Minds That Shaped History"
          accentColor={PURPLE}
          intro="From conquerors who redrew the map to theorists who changed how we think about war, these are the individuals whose innovations in strategy, tactics, and military organization defined their eras — and whose influence echoes in modern doctrine."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Footer ──────────────────────────────────────────────────── */}
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
            "The supreme art of war is to subdue the enemy without fighting."
            — Sun Tzu, <em>The Art of War</em>, ~5th century BCE
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
