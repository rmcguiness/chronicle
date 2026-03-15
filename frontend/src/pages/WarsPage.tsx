/**
 * WarsPage — "History's Major Wars & Conflicts"
 *
 * Route: /wars
 *
 * Features:
 *  - 25 curated wars with rich detail (combatants, causes, outcomes, casualties)
 *  - Gantt-chart timeline visualization (colored bars by era)
 *  - Casualties ranking chart
 *  - Filter by era / scale / region / outcome type
 *  - Sort by chronological, casualties, duration
 *  - "Deadliest Wars" ranking sidebar
 *  - "Wars that changed everything" — top 5 most consequential
 *  - Conflict map descriptions (text-based)
 *  - "Find in Chronicle" search links
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface War {
  slug: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  yearDisplay: string;
  durationYears: number;
  combatants: string[][];
  cause: string;
  outcome: string;
  winner: string;
  casualtiesEstimate: string;
  casualtiesNumber: number;
  keyBattles: string[];
  turningPoint: string;
  legacy: string;
  era: string;
  scale: string;
  regions: string[];
  outcomeType: string;
  chronicleQuery: string;
}

// ── Hardcoded dataset ────────────────────────────────────────────────────────

const WARS: War[] = [
  {
    slug: 'greco-persian-wars',
    name: 'Greco-Persian Wars',
    yearStart: -499,
    yearEnd: -449,
    yearDisplay: '499–449 BCE',
    durationYears: 50,
    combatants: [['Greek city-states (Athens, Sparta)'], ['Achaemenid Persian Empire']],
    cause: 'Ionian Greek cities revolted against Persian rule, drawing mainland Greece into conflict. Persia sought to punish Athens for supporting the revolt and to conquer all of Greece.',
    outcome: 'Greek victory; Persian expansion into Europe halted permanently.',
    winner: 'Greek city-states',
    casualtiesEstimate: '~300,000+',
    casualtiesNumber: 300000,
    keyBattles: ['Marathon (490 BCE)', 'Thermopylae (480 BCE)', 'Salamis (480 BCE)'],
    turningPoint: "The naval Battle of Salamis, where Themistocles' strategy destroyed the Persian fleet and ended Xerxes' invasion.",
    legacy: "Preserved Greek independence and democracy, enabling the Golden Age of Athens. The battles became foundational myths of Western civilization — Marathon gave us the long-distance race, Thermopylae the legend of the 300 Spartans.",
    era: 'Ancient',
    scale: 'Continental',
    regions: ['Greece', 'Persia', 'Mediterranean'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Greco-Persian Wars',
  },
  {
    slug: 'peloponnesian-war',
    name: 'Peloponnesian War',
    yearStart: -431,
    yearEnd: -404,
    yearDisplay: '431–404 BCE',
    durationYears: 27,
    combatants: [['Athens & Delian League'], ['Sparta & Peloponnesian League']],
    cause: "Rising tension between Athens and Sparta over dominance in Greece. Athens' imperial ambitions through the Delian League threatened Spartan hegemony.",
    outcome: 'Spartan victory; Athens stripped of empire, walls, and fleet.',
    winner: 'Sparta',
    casualtiesEstimate: '~50,000–80,000 military',
    casualtiesNumber: 65000,
    keyBattles: ['Siege of Syracuse (415–413 BCE)', 'Aegospotami (405 BCE)', 'Pylos (425 BCE)'],
    turningPoint: 'The disastrous Sicilian Expedition (415–413 BCE), where Athens lost its fleet and best troops trying to conquer Syracuse.',
    legacy: "Ended the Golden Age of Athens and weakened all Greek city-states, leaving them vulnerable to Macedon. Thucydides' history of the war became the founding text of political realism and international relations.",
    era: 'Ancient',
    scale: 'Regional',
    regions: ['Greece', 'Sicily', 'Mediterranean'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Peloponnesian War',
  },
  {
    slug: 'punic-wars',
    name: 'Punic Wars',
    yearStart: -264,
    yearEnd: -146,
    yearDisplay: '264–146 BCE',
    durationYears: 118,
    combatants: [['Roman Republic'], ['Carthage']],
    cause: "Rome and Carthage clashed over control of Sicily and western Mediterranean trade routes. Neither power could tolerate the other's expansion.",
    outcome: 'Total Roman victory; Carthage destroyed, salted, and absorbed.',
    winner: 'Rome',
    casualtiesEstimate: '~1.5 million+',
    casualtiesNumber: 1500000,
    keyBattles: ['Cannae (216 BCE)', 'Zama (202 BCE)', 'Siege of Carthage (149–146 BCE)'],
    turningPoint: "Scipio Africanus' victory at Zama (202 BCE), defeating Hannibal on African soil and ending the Second Punic War.",
    legacy: "Established Rome as the dominant Mediterranean power. Hannibal's crossing of the Alps remains one of history's greatest military feats. The destruction of Carthage eliminated Rome's only rival and opened the path to empire.",
    era: 'Ancient',
    scale: 'Continental',
    regions: ['Mediterranean', 'North Africa', 'Iberia', 'Italy'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Punic Wars',
  },
  {
    slug: 'gallic-wars',
    name: "Julius Caesar's Gallic Wars",
    yearStart: -58,
    yearEnd: -50,
    yearDisplay: '58–50 BCE',
    durationYears: 8,
    combatants: [['Roman Republic (Caesar)'], ['Gallic tribes', 'Germanic tribes']],
    cause: 'Caesar sought military glory and wealth to advance his political career in Rome. Gallic tribal migrations provided the pretext for intervention.',
    outcome: 'Roman conquest of all Gaul (modern France, Belgium, parts of Germany).',
    winner: 'Rome (Caesar)',
    casualtiesEstimate: '~1 million Gauls killed, 1 million enslaved',
    casualtiesNumber: 1000000,
    keyBattles: ['Alesia (52 BCE)', 'Bibracte (58 BCE)', 'Gergovia (52 BCE)'],
    turningPoint: 'The Siege of Alesia (52 BCE), where Caesar simultaneously besieged Vercingetorix inside and repelled a massive Gallic relief army outside.',
    legacy: 'Brought Gaul permanently into the Roman world, Romanizing Western Europe. Made Caesar fabulously wealthy and popular, setting the stage for his crossing of the Rubicon and the end of the Roman Republic.',
    era: 'Ancient',
    scale: 'Continental',
    regions: ['Gaul', 'Western Europe', 'Germany'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Gallic Wars Caesar',
  },
  {
    slug: 'roman-civil-wars',
    name: 'Roman Civil Wars',
    yearStart: -49,
    yearEnd: -31,
    yearDisplay: '49–31 BCE',
    durationYears: 18,
    combatants: [['Caesar, then Octavian & Mark Antony'], ['Pompey, then Brutus & Cassius'], ['Mark Antony & Cleopatra (later phase)']],
    cause: "The Roman Republic's political system could not contain the ambitions of its most powerful generals. Caesar's crossing of the Rubicon triggered cascading civil wars.",
    outcome: 'Octavian (Augustus) defeated all rivals and established the Roman Empire.',
    winner: 'Octavian (Augustus)',
    casualtiesEstimate: '~200,000–500,000',
    casualtiesNumber: 350000,
    keyBattles: ['Pharsalus (48 BCE)', 'Philippi (42 BCE)', 'Actium (31 BCE)'],
    turningPoint: "The Battle of Actium (31 BCE), where Octavian's fleet under Agrippa destroyed Antony and Cleopatra's combined forces.",
    legacy: "Ended the 500-year Roman Republic and created the Roman Empire under Augustus. Established the template for imperial government that lasted centuries and influenced all subsequent European monarchies.",
    era: 'Ancient',
    scale: 'Continental',
    regions: ['Roman Republic', 'Egypt', 'Mediterranean'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Roman Civil War Caesar',
  },
  {
    slug: 'crusades',
    name: 'Crusades',
    yearStart: 1095,
    yearEnd: 1291,
    yearDisplay: '1095–1291 CE',
    durationYears: 196,
    combatants: [['Christian European kingdoms', 'Crusader states'], ['Muslim dynasties (Seljuks, Ayyubids, Mamluks)']],
    cause: 'Pope Urban II called for Christian warriors to recapture Jerusalem and the Holy Land from Muslim control. Religious fervor, political ambition, and economic opportunity drove participation.',
    outcome: 'Ultimately Muslim victory; Crusader states eliminated by 1291.',
    winner: 'Muslim states',
    casualtiesEstimate: '~1–3 million (all sides)',
    casualtiesNumber: 2000000,
    keyBattles: ['Siege of Jerusalem (1099)', 'Hattin (1187)', 'Siege of Acre (1189–1191)'],
    turningPoint: "Saladin's victory at Hattin (1187) and recapture of Jerusalem shattered Crusader military power in the Levant.",
    legacy: 'Deepened Christian-Muslim tensions that persist today. Introduced Europeans to Arab science, medicine, and trade goods, catalyzing the Renaissance. Created lasting cultural exchange between East and West despite the violence.',
    era: 'Medieval',
    scale: 'Continental',
    regions: ['Middle East', 'Europe', 'North Africa'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Crusades',
  },
  {
    slug: 'mongol-conquests',
    name: 'Mongol Conquests',
    yearStart: 1206,
    yearEnd: 1368,
    yearDisplay: '1206–1368 CE',
    durationYears: 162,
    combatants: [['Mongol Empire (Genghis Khan and successors)'], ['China (Jin, Song)', 'Khwarezmia', 'Russia', 'Persia', 'Eastern Europe']],
    cause: "Genghis Khan unified the Mongol tribes and launched campaigns of conquest. Diplomatic insults from the Khwarezmian Empire triggered the devastating western campaigns.",
    outcome: 'Largest contiguous land empire in history, stretching from Korea to Hungary.',
    winner: 'Mongol Empire',
    casualtiesEstimate: '~40 million',
    casualtiesNumber: 40000000,
    keyBattles: ['Siege of Baghdad (1258)', 'Battle of Mohi (1241)', 'Battle of Ain Jalut (1260)'],
    turningPoint: 'The Battle of Ain Jalut (1260), where the Mamluks halted Mongol expansion into Africa — the first major Mongol defeat.',
    legacy: "Killed approximately 5% of the world's population. Created the Pax Mongolica that reopened the Silk Road, enabling Marco Polo's journey and East-West exchange. Destroyed the Abbasid Caliphate and reshaped the political map of Eurasia.",
    era: 'Medieval',
    scale: 'World',
    regions: ['Central Asia', 'China', 'Middle East', 'Eastern Europe', 'Persia'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Mongol Conquests',
  },
  {
    slug: 'hundred-years-war',
    name: "Hundred Years' War",
    yearStart: 1337,
    yearEnd: 1453,
    yearDisplay: '1337–1453 CE',
    durationYears: 116,
    combatants: [['Kingdom of England'], ['Kingdom of France']],
    cause: 'English kings claimed the French throne through dynastic ties. Control of wealthy Aquitaine and Flanders added economic motivation to the dynastic dispute.',
    outcome: 'French victory; England lost all continental possessions except Calais.',
    winner: 'France',
    casualtiesEstimate: '~2.5–3.5 million (including famine and plague)',
    casualtiesNumber: 3000000,
    keyBattles: ['Crecy (1346)', 'Agincourt (1415)', 'Siege of Orleans (1429)'],
    turningPoint: "Joan of Arc's lifting of the Siege of Orleans (1429), which reversed the war's momentum and revived French morale.",
    legacy: "Created distinct English and French national identities. Ended the age of armored knights as longbows and cannon proved decisive. Joan of Arc became France's greatest national hero and a Catholic saint.",
    era: 'Medieval',
    scale: 'Continental',
    regions: ['France', 'England'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Hundred Years War',
  },
  {
    slug: 'wars-of-the-roses',
    name: 'Wars of the Roses',
    yearStart: 1455,
    yearEnd: 1485,
    yearDisplay: '1455–1485 CE',
    durationYears: 30,
    combatants: [['House of Lancaster (red rose)'], ['House of York (white rose)']],
    cause: "Rival branches of the Plantagenet dynasty competed for the English throne after Henry VI's weak rule. Feudal lords chose sides based on land and power calculations.",
    outcome: 'Henry Tudor (Lancaster) won and founded the Tudor dynasty.',
    winner: 'House of Tudor (Lancaster)',
    casualtiesEstimate: '~50,000–100,000',
    casualtiesNumber: 75000,
    keyBattles: ['Towton (1461)', 'Bosworth Field (1485)', 'Tewkesbury (1471)'],
    turningPoint: 'The Battle of Bosworth Field (1485), where Henry Tudor defeated Richard III — the last English king to die in battle.',
    legacy: 'Ended the Plantagenet dynasty and established the Tudors, leading to Henry VIII and Elizabeth I. Destroyed the old feudal nobility and strengthened the English monarchy. Shakespeare immortalized the conflict in his history plays.',
    era: 'Medieval',
    scale: 'Regional',
    regions: ['England'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Wars of the Roses',
  },
  {
    slug: 'thirty-years-war',
    name: "Thirty Years' War",
    yearStart: 1618,
    yearEnd: 1648,
    yearDisplay: '1618–1648 CE',
    durationYears: 30,
    combatants: [['Catholic League, Habsburg Empire'], ['Protestant states, Sweden, France']],
    cause: 'Religious conflict between Catholics and Protestants in the Holy Roman Empire. The Defenestration of Prague (1618) triggered a war that drew in every major European power.',
    outcome: 'Peace of Westphalia; redrew the map of Europe and established state sovereignty.',
    winner: 'No clear winner; France and Sweden gained territory',
    casualtiesEstimate: '~4–8 million (up to 40% of central European population)',
    casualtiesNumber: 6000000,
    keyBattles: ['Battle of White Mountain (1620)', 'Battle of Breitenfeld (1631)', 'Battle of Rocroi (1643)'],
    turningPoint: "Sweden's entry under Gustavus Adolphus and his victory at Breitenfeld (1631) turned a Catholic rout into a prolonged continental war.",
    legacy: 'The Peace of Westphalia (1648) created the modern concept of state sovereignty and non-interference — the foundation of international law. Devastated Germany so severely that recovery took over a century.',
    era: 'Early Modern',
    scale: 'Continental',
    regions: ['Central Europe', 'Germany', 'France', 'Sweden'],
    outcomeType: 'Stalemate',
    chronicleQuery: 'Thirty Years War',
  },
  {
    slug: 'english-civil-war',
    name: 'English Civil War',
    yearStart: 1642,
    yearEnd: 1651,
    yearDisplay: '1642–1651 CE',
    durationYears: 9,
    combatants: [['Parliamentarians (Roundheads)'], ['Royalists (Cavaliers)']],
    cause: "King Charles I's attempts to rule without Parliament and impose religious conformity provoked armed resistance. Fundamental disagreements over the limits of royal power could not be resolved peacefully.",
    outcome: 'Parliamentary victory; Charles I executed, republic established under Cromwell.',
    winner: 'Parliament / Oliver Cromwell',
    casualtiesEstimate: '~200,000 (England, Scotland, Ireland combined)',
    casualtiesNumber: 200000,
    keyBattles: ['Marston Moor (1644)', 'Naseby (1645)', 'Battle of Worcester (1651)'],
    turningPoint: "The Battle of Naseby (1645), where Cromwell's New Model Army decisively defeated the Royalist main force.",
    legacy: 'Established the principle that monarchs rule by consent, not divine right. The execution of Charles I shocked Europe. Led to constitutional monarchy and influenced the American and French revolutions.',
    era: 'Early Modern',
    scale: 'Regional',
    regions: ['England', 'Scotland', 'Ireland'],
    outcomeType: 'Decisive',
    chronicleQuery: 'English Civil War',
  },
  {
    slug: 'war-of-spanish-succession',
    name: 'War of Spanish Succession',
    yearStart: 1701,
    yearEnd: 1714,
    yearDisplay: '1701–1714 CE',
    durationYears: 13,
    combatants: [['France, Spain (Bourbon)'], ['Grand Alliance (England, Dutch Republic, Austria, HRE)']],
    cause: "Charles II of Spain died without an heir, and both the French Bourbons and Austrian Habsburgs claimed the throne. Europe feared French-Spanish unification would destroy the balance of power.",
    outcome: 'Treaty of Utrecht; Philip V kept Spain but renounced claim to France.',
    winner: 'Compromise (Grand Alliance strategic victory)',
    casualtiesEstimate: '~400,000–700,000',
    casualtiesNumber: 550000,
    keyBattles: ['Blenheim (1704)', 'Ramillies (1706)', 'Malplaquet (1709)'],
    turningPoint: "Marlborough's crushing victory at Blenheim (1704) saved Vienna and shattered the myth of French military invincibility.",
    legacy: "Established the principle of balance of power in European diplomacy. Britain gained Gibraltar, Minorca, and asiento (slave trade rights). Marked France's decline and Britain's rise as a great power.",
    era: 'Early Modern',
    scale: 'Continental',
    regions: ['Europe', 'Spain', 'Netherlands', 'Americas'],
    outcomeType: 'Decisive',
    chronicleQuery: 'War of Spanish Succession',
  },
  {
    slug: 'seven-years-war',
    name: "Seven Years' War",
    yearStart: 1756,
    yearEnd: 1763,
    yearDisplay: '1756–1763 CE',
    durationYears: 7,
    combatants: [['Britain, Prussia, Hanover'], ['France, Austria, Russia, Spain, Sweden']],
    cause: "Colonial rivalry between Britain and France combined with Prussian-Austrian competition for Silesia. Often called the 'first world war' because fighting spanned five continents.",
    outcome: 'British victory globally; France lost Canada and India.',
    winner: 'Britain and Prussia',
    casualtiesEstimate: '~900,000–1.4 million',
    casualtiesNumber: 1150000,
    keyBattles: ['Plains of Abraham (1759)', 'Rossbach (1757)', 'Battle of Plassey (1757)'],
    turningPoint: "The Battle of the Plains of Abraham (1759), where Wolfe's victory at Quebec decided the fate of North America.",
    legacy: "Reshaped the colonial world — Britain became the dominant global power. France's financial ruin from the war contributed directly to the French Revolution. Britain's war debts led to taxes that provoked the American Revolution.",
    era: 'Early Modern',
    scale: 'World',
    regions: ['Europe', 'North America', 'India', 'Caribbean', 'Philippines'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Seven Years War',
  },
  {
    slug: 'american-revolutionary-war',
    name: 'American Revolutionary War',
    yearStart: 1775,
    yearEnd: 1783,
    yearDisplay: '1775–1783 CE',
    durationYears: 8,
    combatants: [['American colonies, France, Spain'], ['Great Britain']],
    cause: 'American colonists resisted British taxation without representation and restrictions on self-governance. Enlightenment ideals of liberty and natural rights provided philosophical justification.',
    outcome: 'American independence recognized by Treaty of Paris (1783).',
    winner: 'United States of America',
    casualtiesEstimate: '~37,000 Americans, ~10,000 British killed',
    casualtiesNumber: 47000,
    keyBattles: ['Saratoga (1777)', 'Yorktown (1781)', 'Bunker Hill (1775)'],
    turningPoint: 'The Battle of Saratoga (1777), which convinced France to enter the war as an American ally, transforming a colonial rebellion into a global conflict.',
    legacy: 'Created the first modern democratic republic and inspired revolutions worldwide — especially the French Revolution. The Constitution and Bill of Rights became models for democratic governance globally.',
    era: 'Early Modern',
    scale: 'Continental',
    regions: ['North America', 'Atlantic'],
    outcomeType: 'Decisive',
    chronicleQuery: 'American Revolution',
  },
  {
    slug: 'napoleonic-wars',
    name: 'Napoleonic Wars',
    yearStart: 1803,
    yearEnd: 1815,
    yearDisplay: '1803–1815 CE',
    durationYears: 12,
    combatants: [['French Empire (Napoleon)'], ['Various coalitions (Britain, Russia, Prussia, Austria, Spain)']],
    cause: "Revolutionary France's expansion under Napoleon threatened the European monarchical order. Britain's refusal to accept French dominance and Napoleon's continental ambitions drove continuous warfare.",
    outcome: 'Napoleon defeated and exiled; Congress of Vienna restored European order.',
    winner: 'Seventh Coalition (Britain, Prussia, Russia, Austria)',
    casualtiesEstimate: '~3.5–6 million',
    casualtiesNumber: 5000000,
    keyBattles: ['Austerlitz (1805)', 'Borodino (1812)', 'Waterloo (1815)'],
    turningPoint: 'Napoleon\'s disastrous invasion of Russia (1812), where the Grande Armee of 600,000 was reduced to fewer than 100,000 by winter, scorched earth, and Russian resistance.',
    legacy: "Spread Napoleonic Code, nationalism, and revolutionary ideals across Europe. The Congress of Vienna created a century of relative peace. Napoleon's legacy shaped modern warfare, civil law, and the concept of meritocracy.",
    era: 'Modern',
    scale: 'World',
    regions: ['Europe', 'Russia', 'Egypt', 'Caribbean'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Napoleonic Wars',
  },
  {
    slug: 'american-civil-war',
    name: 'American Civil War',
    yearStart: 1861,
    yearEnd: 1865,
    yearDisplay: '1861–1865 CE',
    durationYears: 4,
    combatants: [['Union (Northern states)'], ['Confederacy (Southern states)']],
    cause: "Slavery was the central cause — Southern states seceded to protect the institution after Lincoln's election. Fundamental disagreements over states' rights and the nature of the federal union had festered for decades.",
    outcome: 'Union victory; slavery abolished, secession denied.',
    winner: 'United States (Union)',
    casualtiesEstimate: '~620,000–750,000 military dead',
    casualtiesNumber: 700000,
    keyBattles: ['Gettysburg (1863)', 'Antietam (1862)', 'Vicksburg (1863)'],
    turningPoint: "The Battle of Gettysburg (July 1863), Lee's failed invasion of the North, combined with the fall of Vicksburg, which split the Confederacy in two.",
    legacy: 'Ended slavery in the United States and established federal supremacy over states. The 13th, 14th, and 15th Amendments redefined American citizenship. The deadliest conflict in American history, its wounds shaped race relations for generations.',
    era: 'Modern',
    scale: 'Regional',
    regions: ['United States'],
    outcomeType: 'Decisive',
    chronicleQuery: 'American Civil War',
  },
  {
    slug: 'franco-prussian-war',
    name: 'Franco-Prussian War',
    yearStart: 1870,
    yearEnd: 1871,
    yearDisplay: '1870–1871 CE',
    durationYears: 1,
    combatants: [['Prussia & German states'], ['French Empire (Napoleon III)']],
    cause: 'Bismarck manipulated the Ems Dispatch to provoke France into declaring war, providing the catalyst for German unification. French fears of Prussian power and the Spanish succession crisis heightened tensions.',
    outcome: 'Prussian victory; German Empire proclaimed, France lost Alsace-Lorraine.',
    winner: 'Prussia / German Empire',
    casualtiesEstimate: '~180,000–250,000',
    casualtiesNumber: 215000,
    keyBattles: ['Sedan (1870)', 'Siege of Paris (1870–1871)', 'Metz (1870)'],
    turningPoint: 'The Battle of Sedan (1870), where Napoleon III and 100,000 French soldiers were captured, ending the Second French Empire.',
    legacy: "Created a unified German Empire, fundamentally altering Europe's balance of power. French humiliation and the loss of Alsace-Lorraine created a desire for revenge that directly contributed to World War I.",
    era: 'Modern',
    scale: 'Regional',
    regions: ['France', 'Germany'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Franco-Prussian War',
  },
  {
    slug: 'spanish-american-war',
    name: 'Spanish-American War',
    yearStart: 1898,
    yearEnd: 1898,
    yearDisplay: '1898 CE',
    durationYears: 1,
    combatants: [['United States'], ['Spanish Empire']],
    cause: 'American sympathy for Cuban independence and the mysterious explosion of USS Maine in Havana harbor. Yellow journalism by Hearst and Pulitzer inflamed public opinion for war.',
    outcome: 'American victory; Spain ceded Cuba, Puerto Rico, Guam, and the Philippines.',
    winner: 'United States',
    casualtiesEstimate: '~60,000 (mostly disease)',
    casualtiesNumber: 60000,
    keyBattles: ['Manila Bay (1898)', 'San Juan Hill (1898)', 'Santiago de Cuba (1898)'],
    turningPoint: "Dewey's destruction of the Spanish fleet at Manila Bay in a single morning demonstrated American naval power and determined the Philippines' fate.",
    legacy: "Ended the Spanish Empire and established the United States as a global colonial power. Launched Theodore Roosevelt's political career. Raised lasting questions about American imperialism, particularly in the Philippines.",
    era: 'Modern',
    scale: 'Continental',
    regions: ['Caribbean', 'Philippines', 'Pacific'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Spanish-American War',
  },
  {
    slug: 'world-war-i',
    name: 'World War I',
    yearStart: 1914,
    yearEnd: 1918,
    yearDisplay: '1914–1918 CE',
    durationYears: 4,
    combatants: [['Allied Powers (France, Britain, Russia, US)'], ['Central Powers (Germany, Austria-Hungary, Ottoman Empire)']],
    cause: "A web of alliances, militarism, imperialism, and nationalism turned the assassination of Archduke Franz Ferdinand into a continental war. Germany's Schlieffen Plan and the arms race made escalation nearly automatic.",
    outcome: 'Allied victory; Germany, Austria-Hungary, and Ottoman Empire collapsed.',
    winner: 'Allied Powers',
    casualtiesEstimate: '~20 million dead (9.7M military, 10M civilian)',
    casualtiesNumber: 20000000,
    keyBattles: ['Somme (1916)', 'Verdun (1916)', 'Gallipoli (1915–1916)'],
    turningPoint: 'American entry in 1917 tipped the balance, providing fresh troops and resources when both sides were exhausted after three years of trench warfare.',
    legacy: 'Destroyed four empires (German, Austro-Hungarian, Ottoman, Russian). Created the conditions for WWII, the Russian Revolution, and the modern Middle East. Introduced total war, poison gas, tanks, and aerial bombing.',
    era: 'Modern',
    scale: 'World',
    regions: ['Europe', 'Middle East', 'Africa', 'Atlantic', 'Pacific'],
    outcomeType: 'Decisive',
    chronicleQuery: 'World War I',
  },
  {
    slug: 'russian-civil-war',
    name: 'Russian Civil War',
    yearStart: 1917,
    yearEnd: 1922,
    yearDisplay: '1917–1922 CE',
    durationYears: 5,
    combatants: [['Bolsheviks (Red Army)'], ['White Army (monarchists, democrats, nationalists)'], ['Foreign interventionists (UK, France, US, Japan)']],
    cause: 'The Bolshevik Revolution overthrew the Provisional Government, sparking armed resistance from monarchists, democrats, and foreign powers who feared communist expansion.',
    outcome: 'Bolshevik victory; USSR established in 1922.',
    winner: 'Bolsheviks (Red Army)',
    casualtiesEstimate: '~7–12 million (including famine and disease)',
    casualtiesNumber: 9000000,
    keyBattles: ['Battle of Tsaritsyn (1918)', 'Siege of Perekop (1920)', 'Kronstadt Rebellion (1921)'],
    turningPoint: "Trotsky's reorganization of the Red Army and the failure of White forces to coordinate, combined with Allied withdrawal, sealed the Bolshevik victory.",
    legacy: 'Created the Soviet Union, establishing the first communist state and setting the stage for the Cold War. The brutality of the war normalized political violence and one-party rule that characterized the USSR for seven decades.',
    era: 'Modern',
    scale: 'Continental',
    regions: ['Russia', 'Ukraine', 'Central Asia', 'Siberia'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Russian Civil War',
  },
  {
    slug: 'world-war-ii',
    name: 'World War II',
    yearStart: 1939,
    yearEnd: 1945,
    yearDisplay: '1939–1945 CE',
    durationYears: 6,
    combatants: [['Allies (US, UK, USSR, China, France)'], ['Axis Powers (Germany, Japan, Italy)']],
    cause: "Nazi Germany's territorial expansion and Japan's imperial ambitions in Asia. The failure of appeasement at Munich (1938) and Hitler's invasion of Poland triggered the war in Europe.",
    outcome: 'Allied victory; Germany and Japan unconditionally surrendered.',
    winner: 'Allied Powers',
    casualtiesEstimate: '~70–85 million dead (deadliest conflict in history)',
    casualtiesNumber: 75000000,
    keyBattles: ['Stalingrad (1942–1943)', 'D-Day / Normandy (1944)', 'Midway (1942)'],
    turningPoint: 'The Battle of Stalingrad (1942–43), where the destruction of the German 6th Army marked the turning of the tide on the Eastern Front, which decided the war in Europe.',
    legacy: 'Created the modern world order: United Nations, NATO, the Cold War, decolonization. The Holocaust murdered 6 million Jews and millions of others, leading to the creation of Israel and international human rights law. Nuclear weapons changed warfare forever.',
    era: 'Contemporary',
    scale: 'World',
    regions: ['Europe', 'Pacific', 'North Africa', 'Southeast Asia', 'Atlantic'],
    outcomeType: 'Decisive',
    chronicleQuery: 'World War II',
  },
  {
    slug: 'korean-war',
    name: 'Korean War',
    yearStart: 1950,
    yearEnd: 1953,
    yearDisplay: '1950–1953 CE',
    durationYears: 3,
    combatants: [['South Korea, United States, UN forces'], ['North Korea, China, USSR support']],
    cause: 'North Korea invaded South Korea to reunify the peninsula under communism. The Cold War context made it a proxy war between the US-led Western bloc and the Soviet-Chinese communist bloc.',
    outcome: 'Armistice (no peace treaty); Korea remains divided at the 38th parallel.',
    winner: 'Stalemate',
    casualtiesEstimate: '~2.5–3 million (including civilians)',
    casualtiesNumber: 2750000,
    keyBattles: ['Inchon Landing (1950)', 'Chosin Reservoir (1950)', 'Battle of Pusan Perimeter (1950)'],
    turningPoint: "China's massive intervention in November 1950 pushed UN forces back from the Yalu River and transformed a near-victory into a grueling stalemate.",
    legacy: "Established the pattern for Cold War proxy conflicts. The Korean DMZ remains the most heavily fortified border on Earth. South Korea's subsequent economic miracle contrasts sharply with North Korea's isolation.",
    era: 'Contemporary',
    scale: 'Regional',
    regions: ['Korean Peninsula', 'East Asia'],
    outcomeType: 'Stalemate',
    chronicleQuery: 'Korean War',
  },
  {
    slug: 'vietnam-war',
    name: 'Vietnam War',
    yearStart: 1955,
    yearEnd: 1975,
    yearDisplay: '1955–1975 CE',
    durationYears: 20,
    combatants: [['North Vietnam, Viet Cong'], ['South Vietnam, United States']],
    cause: "Cold War containment doctrine drove American involvement in preventing communist unification of Vietnam. Ho Chi Minh's nationalist movement sought independence and reunification under communist rule.",
    outcome: 'North Vietnamese victory; Vietnam reunified under communist rule.',
    winner: 'North Vietnam',
    casualtiesEstimate: '~1.3–3.4 million (including civilians)',
    casualtiesNumber: 2400000,
    keyBattles: ['Tet Offensive (1968)', 'Siege of Khe Sanh (1968)', 'Fall of Saigon (1975)'],
    turningPoint: 'The Tet Offensive (January 1968), which was a military defeat for North Vietnam but a political turning point that shattered American public support for the war.',
    legacy: "Divided American society and shattered confidence in government ('credibility gap'). Demonstrated the limits of conventional military power against guerrilla warfare. Influenced US foreign policy for decades ('Vietnam Syndrome').",
    era: 'Contemporary',
    scale: 'Regional',
    regions: ['Vietnam', 'Southeast Asia', 'Laos', 'Cambodia'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Vietnam War',
  },
  {
    slug: 'gulf-war',
    name: 'Gulf War',
    yearStart: 1990,
    yearEnd: 1991,
    yearDisplay: '1990–1991 CE',
    durationYears: 1,
    combatants: [['US-led coalition (34 nations)'], ['Iraq (Saddam Hussein)']],
    cause: 'Iraq invaded and annexed Kuwait for its oil wealth and to resolve debt disputes. The international community, led by the US, assembled the largest coalition since WWII to reverse the invasion.',
    outcome: 'Coalition victory; Kuwait liberated, Iraq expelled.',
    winner: 'US-led Coalition',
    casualtiesEstimate: '~25,000–50,000 Iraqi military; ~292 coalition dead',
    casualtiesNumber: 35000,
    keyBattles: ['Battle of 73 Easting (1991)', 'Battle of Khafji (1991)', 'Highway of Death (1991)'],
    turningPoint: 'The 100-hour ground offensive that routed the Iraqi army in four days, demonstrating overwhelming technological superiority.',
    legacy: 'Demonstrated the effectiveness of precision-guided weapons and coalition warfare. Established US military dominance in the post-Cold War era. Left Saddam Hussein in power, leading to continued tensions and the 2003 Iraq War.',
    era: 'Contemporary',
    scale: 'Regional',
    regions: ['Middle East', 'Kuwait', 'Iraq'],
    outcomeType: 'Decisive',
    chronicleQuery: 'Gulf War',
  },
  {
    slug: 'war-in-afghanistan',
    name: 'War in Afghanistan',
    yearStart: 2001,
    yearEnd: 2021,
    yearDisplay: '2001–2021 CE',
    durationYears: 20,
    combatants: [['United States, NATO, Afghan government'], ['Taliban, al-Qaeda']],
    cause: 'The 9/11 attacks on the United States prompted the invasion to destroy al-Qaeda and overthrow the Taliban government that harbored them. The mission expanded into nation-building.',
    outcome: 'Taliban returned to power after US withdrawal in August 2021.',
    winner: 'Taliban',
    casualtiesEstimate: '~176,000+ (including 47,000+ civilians)',
    casualtiesNumber: 176000,
    keyBattles: ['Battle of Tora Bora (2001)', 'Operation Anaconda (2002)', 'Battle of Marjah (2010)'],
    turningPoint: 'The killing of Osama bin Laden (2011) achieved the original mission objective but did not end the war, revealing the disconnect between the counterterrorism and nation-building goals.',
    legacy: "America's longest war ended with the Taliban's return to power, raising profound questions about military intervention and nation-building. The chaotic withdrawal from Kabul in August 2021 marked the end of the post-9/11 era.",
    era: 'Contemporary',
    scale: 'Regional',
    regions: ['Afghanistan', 'Pakistan', 'Central Asia'],
    outcomeType: 'Decisive',
    chronicleQuery: 'War in Afghanistan',
  },
];

// ── Constants ────────────────────────────────────────────────────────────────

const SCALE_COLORS: Record<string, string> = {
  Skirmish: '#94a3b8',
  Regional: '#3b82f6',
  Continental: '#f97316',
  World: '#ef4444',
};

const ERA_COLORS: Record<string, string> = {
  Ancient: '#a78bfa',
  Medieval: '#f472b6',
  'Early Modern': '#38bdf8',
  Modern: '#34d399',
  Contemporary: '#fb923c',
};

const ERAS = ['All', 'Ancient', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'];
const SCALES = ['All', 'World', 'Continental', 'Regional'];
const OUTCOME_TYPES = ['All', 'Decisive', 'Stalemate'];

type SortMode = 'chronological' | 'casualties' | 'duration';
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'chronological', label: 'Chronological' },
  { value: 'casualties', label: 'Casualties' },
  { value: 'duration', label: 'Duration' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCasualties(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── "Wars that changed everything" ──────────────────────────────────────────

const GAME_CHANGERS = [
  {
    slug: 'greco-persian-wars',
    title: 'Greco-Persian Wars',
    tagline: 'Saved democracy before it began',
    description: 'Had Persia conquered Greece, Athenian democracy, philosophy, and drama might never have flourished. The Golden Age of Athens — the intellectual foundation of Western civilization — depended on Greek victory.',
  },
  {
    slug: 'mongol-conquests',
    title: 'Mongol Conquests',
    tagline: 'Reshaped the entire world',
    description: 'Killed 5% of humanity and redrew the political map of Eurasia. Yet the Pax Mongolica reopened the Silk Road, connected East and West, and inadvertently carried the Black Death to Europe.',
  },
  {
    slug: 'napoleonic-wars',
    title: 'Napoleonic Wars',
    tagline: 'Spread revolution across Europe',
    description: 'Napoleonic Code, meritocracy, and nationalism reshaped every country his armies touched. The Congress of Vienna that followed created a century of relative peace and the modern diplomatic system.',
  },
  {
    slug: 'world-war-i',
    title: 'World War I',
    tagline: 'Destroyed the old world',
    description: 'Four empires fell, the modern Middle East was drawn on a map, and the conditions for WWII, the Russian Revolution, and decolonization were all created in four years of industrial slaughter.',
  },
  {
    slug: 'world-war-ii',
    title: 'World War II',
    tagline: 'Created the modern world',
    description: 'The deadliest conflict in history produced the United Nations, NATO, nuclear weapons, the Cold War, decolonization, the European Union, and international human rights law.',
  },
];

// ── Gantt timeline ──────────────────────────────────────────────────────────

function GanttTimeline({ wars, onSelect }: { wars: War[]; onSelect: (slug: string) => void }) {
  const sorted = [...wars].sort((a, b) => a.yearStart - b.yearStart);
  const minYear = sorted[0].yearStart;
  const maxYear = Math.max(...sorted.map((w) => w.yearEnd));
  const range = maxYear - minYear;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
        overflowX: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        Timeline of Wars & Conflicts
      </h3>
      <div style={{ position: 'relative', minWidth: 700 }}>
        {sorted.map((w) => {
          const left = ((w.yearStart - minYear) / range) * 100;
          const width = Math.max(((w.yearEnd - w.yearStart) / range) * 100, 0.5);
          const color = ERA_COLORS[w.era] || '#6b7280';

          return (
            <div
              key={w.slug}
              onClick={() => onSelect(w.slug)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
                cursor: 'pointer',
              }}
              title={`${w.name} (${w.yearDisplay})`}
            >
              <div
                style={{
                  width: 140,
                  flexShrink: 0,
                  fontSize: 11,
                  color: '#94a3b8',
                  textAlign: 'right',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {w.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 18 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: `${left}%`,
                    width: `${width}%`,
                    minWidth: 4,
                    height: 14,
                    top: 2,
                    borderRadius: 3,
                    background: `${color}88`,
                    border: `1px solid ${color}`,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = color;
                    e.currentTarget.style.transform = 'scaleY(1.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${color}88`;
                    e.currentTarget.style.transform = 'scaleY(1)';
                  }}
                />
              </div>
            </div>
          );
        })}
        {/* Year axis */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingLeft: 148 }}>
          <span style={{ fontSize: 10, color: '#64748b' }}>{sorted[0].yearDisplay.split('–')[0]}</span>
          <span style={{ fontSize: 10, color: '#64748b' }}>Present</span>
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {Object.entries(ERA_COLORS).map(([era, color]) => (
          <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {era}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Casualties ranking chart ────────────────────────────────────────────────

function CasualtiesChart({ wars }: { wars: War[] }) {
  const sorted = [...wars]
    .filter((w) => w.casualtiesNumber >= 50000)
    .sort((a, b) => b.casualtiesNumber - a.casualtiesNumber);
  const max = sorted[0]?.casualtiesNumber || 1;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        Casualties Comparison
      </h3>
      {sorted.map((w) => {
        const pct = (w.casualtiesNumber / max) * 100;
        const color = SCALE_COLORS[w.scale] || '#6b7280';
        return (
          <div key={w.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div
              style={{
                width: 140,
                flexShrink: 0,
                fontSize: 12,
                color: '#94a3b8',
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {w.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: 20 }}>
              <div
                style={{
                  width: `${pct}%`,
                  minWidth: 2,
                  height: '100%',
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${color}66, ${color})`,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            <div style={{ width: 60, fontSize: 12, fontWeight: 600, color, textAlign: 'right', flexShrink: 0 }}>
              {formatCasualties(w.casualtiesNumber)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Deadliest wars sidebar ──────────────────────────────────────────────────

function DeadliestWarsList({ wars }: { wars: War[] }) {
  const top5 = [...wars]
    .sort((a, b) => b.casualtiesNumber - a.casualtiesNumber)
    .slice(0, 5);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
        Deadliest Wars
      </h3>
      {top5.map((w, i) => (
        <div
          key={w.slug}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `${SCALE_COLORS[w.scale] || '#6b7280'}33`,
              color: SCALE_COLORS[w.scale] || '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{w.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {w.yearDisplay} — {w.casualtiesEstimate}
            </div>
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              background: `${SCALE_COLORS[w.scale] || '#6b7280'}22`,
              color: SCALE_COLORS[w.scale] || '#6b7280',
            }}
          >
            {w.scale}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Wars that changed everything ────────────────────────────────────────────

function GameChangers() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>
        Wars That Changed Everything
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {GAME_CHANGERS.map((gc) => {
          const war = WARS.find((w) => w.slug === gc.slug);
          const color = war ? ERA_COLORS[war.era] || '#6b7280' : '#6b7280';
          return (
            <div
              key={gc.slug}
              style={{
                padding: '14px 16px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, color }}>
                {gc.title}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', marginBottom: 6, fontStyle: 'italic' }}>
                "{gc.tagline}"
              </div>
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
                {gc.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Conflict map descriptions ───────────────────────────────────────────────

function ConflictRegions() {
  const regionCounts: Record<string, number> = {};
  WARS.forEach((w) => {
    w.regions.forEach((r) => {
      regionCounts[r] = (regionCounts[r] || 0) + 1;
    });
  });
  const sorted = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] || 1;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '16px 20px',
        marginBottom: 24,
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>
        Conflicts by Region
      </h3>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
        How many of the 25 major wars touched each region
      </div>
      {sorted.map(([region, count]) => {
        const pct = (count / maxCount) * 100;
        return (
          <div key={region} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 120, flexShrink: 0, fontSize: 12, color: '#94a3b8', textAlign: 'right' }}>
              {region}
            </div>
            <div style={{ flex: 1, height: 16 }}>
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #3b82f666, #3b82f6)',
                }}
              />
            </div>
            <div style={{ width: 30, fontSize: 12, fontWeight: 600, color: '#e2e8f0', textAlign: 'right' }}>
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── War card ────────────────────────────────────────────────────────────────

function WarCard({ war, index }: { war: War; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const scaleColor = SCALE_COLORS[war.scale] || '#6b7280';
  const eraColor = ERA_COLORS[war.era] || '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.6) }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: expanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${expanded ? scaleColor + '88' : 'rgba(255,255,255,0.06)'}`,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = `${scaleColor}55`;
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        {/* Header badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${eraColor}22`,
                color: eraColor,
              }}
            >
              {war.era}
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: `${scaleColor}22`,
                color: scaleColor,
              }}
            >
              {war.scale}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {war.durationYears} year{war.durationYears !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Name & dates */}
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{war.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          {war.yearDisplay}
        </div>

        {/* Combatants & outcome summary */}
        <div
          style={{
            marginTop: 10,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            color: '#cbd5e1',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span>{war.combatants.map((side) => side[0]).join(' vs ')}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{war.outcomeType}</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#ef4444' }}>
            Casualties: <strong>{war.casualtiesEstimate}</strong>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 12 }}>
                {/* Combatants detail */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Combatants
                  </div>
                  {war.combatants.map((side, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 2 }}>
                      <strong>Side {i + 1}:</strong> {side.join(', ')}
                    </div>
                  ))}
                </div>

                {/* Cause */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Cause
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{war.cause}</div>
                </div>

                {/* Outcome */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Outcome
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1' }}>{war.outcome}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                    Winner: <strong style={{ color: '#e2e8f0' }}>{war.winner}</strong>
                  </div>
                </div>

                {/* Key battles */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    Key Battles
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {war.keyBattles.map((battle) => (
                      <span
                        key={battle}
                        style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          background: 'rgba(255,255,255,0.06)',
                          color: '#e2e8f0',
                        }}
                      >
                        {battle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Turning point */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Turning Point
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{war.turningPoint}</div>
                </div>

                {/* Legacy */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    borderLeft: `3px solid ${eraColor}`,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Legacy — What Changed After
                  </div>
                  <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{war.legacy}</div>
                </div>

                {/* Regions */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    Regions
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{war.regions.join(', ')}</div>
                </div>

                {/* Find in Chronicle link */}
                <Link
                  to={`/search?q=${encodeURIComponent(war.chronicleQuery)}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(59,130,246,0.15)',
                    color: '#60a5fa',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.15)'; }}
                >
                  Find in Chronicle
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function WarsPage() {
  const [eraFilter, setEraFilter] = useState<string>('All');
  const [scaleFilter, setScaleFilter] = useState<string>('All');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  const filtered = useMemo(() => {
    let list = [...WARS];

    if (eraFilter !== 'All') {
      list = list.filter((w) => w.era === eraFilter);
    }
    if (scaleFilter !== 'All') {
      list = list.filter((w) => w.scale === scaleFilter);
    }
    if (outcomeFilter !== 'All') {
      list = list.filter((w) => w.outcomeType === outcomeFilter);
    }

    if (sortMode === 'chronological') {
      list.sort((a, b) => a.yearStart - b.yearStart);
    } else if (sortMode === 'casualties') {
      list.sort((a, b) => b.casualtiesNumber - a.casualtiesNumber);
    } else if (sortMode === 'duration') {
      list.sort((a, b) => b.durationYears - a.durationYears);
    }

    return list;
  }, [eraFilter, scaleFilter, outcomeFilter, sortMode]);

  function scrollToWar(slug: string) {
    const el = document.getElementById(`war-${slug}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const totalCasualties = WARS.reduce((sum, w) => sum + w.casualtiesNumber, 0);
  const deadliest = [...WARS].sort((a, b) => b.casualtiesNumber - a.casualtiesNumber)[0];
  const longest = [...WARS].sort((a, b) => b.durationYears - a.durationYears)[0];
  const shortest = [...WARS].sort((a, b) => a.durationYears - b.durationYears)[0];

  // Collect all unique regions for filter
  const allRegions = useMemo(() => {
    const set = new Set<string>();
    WARS.forEach((w) => w.regions.forEach((r) => set.add(r)));
    return ['All', ...Array.from(set).sort()];
  }, []);
  const [regionFilter, setRegionFilter] = useState<string>('All');

  const filteredWithRegion = useMemo(() => {
    if (regionFilter === 'All') return filtered;
    return filtered.filter((w) => w.regions.some((r) => r.toLowerCase().includes(regionFilter.toLowerCase())));
  }, [filtered, regionFilter]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Nav breadcrumb */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>
          Chronicle
        </Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Wars</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          History's Major Wars & Conflicts
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 700 }}
        >
          25 wars that shaped civilization — from the Greco-Persian Wars to Afghanistan. Each one redrew borders, toppled empires, and changed the course of history.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}
        >
          <StatBox value="25" label="Wars & Conflicts" />
          <StatBox value={deadliest.name} label="Deadliest Conflict" />
          <StatBox value={`${longest.name} (${longest.durationYears}yr)`} label="Longest War" />
          <StatBox value={`${shortest.name} (${shortest.durationYears}yr)`} label="Shortest War" />
        </motion.div>
      </header>

      {/* Main content */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Gantt timeline */}
        <GanttTimeline wars={WARS} onSelect={scrollToWar} />

        {/* Casualties chart */}
        <CasualtiesChart wars={WARS} />

        {/* Two-column: deadliest + game changers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
          <DeadliestWarsList wars={WARS} />
          <GameChangers />
        </div>

        {/* Conflict regions */}
        <ConflictRegions />

        {/* Filter + Sort controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Era filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => setEraFilter(era)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      eraFilter === era
                        ? era === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${ERA_COLORS[era] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      eraFilter === era
                        ? era === 'All'
                          ? '#e2e8f0'
                          : ERA_COLORS[era] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {era}
                </button>
              ))}
            </div>

            {/* Scale filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SCALES.map((scale) => (
                <button
                  key={scale}
                  onClick={() => setScaleFilter(scale)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background:
                      scaleFilter === scale
                        ? scale === 'All'
                          ? 'rgba(255,255,255,0.15)'
                          : `${SCALE_COLORS[scale] || '#6b7280'}33`
                        : 'rgba(255,255,255,0.05)',
                    color:
                      scaleFilter === scale
                        ? scale === 'All'
                          ? '#e2e8f0'
                          : SCALE_COLORS[scale] || '#e2e8f0'
                        : '#94a3b8',
                  }}
                >
                  {scale}
                </button>
              ))}
            </div>

            {/* Outcome type filter */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {OUTCOME_TYPES.map((ot) => (
                <button
                  key={ot}
                  onClick={() => setOutcomeFilter(ot)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: outcomeFilter === ot ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    color: outcomeFilter === ot ? '#e2e8f0' : '#94a3b8',
                  }}
                >
                  {ot}
                </button>
              ))}
            </div>

            {/* Region dropdown */}
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#e2e8f0',
                padding: '4px 10px',
                fontSize: 12,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {allRegions.map((r) => (
                <option key={r} value={r} style={{ background: '#1e293b' }}>
                  {r === 'All' ? 'All Regions' : r}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#e2e8f0',
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: '#1e293b' }}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* War cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {filteredWithRegion.map((w, i) => (
            <div key={w.slug} id={`war-${w.slug}`}>
              <WarCard war={w} index={i} />
            </div>
          ))}
        </div>

        {filteredWithRegion.length === 0 && (
          <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>
            No wars match these filters.
          </div>
        )}
      </section>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: value.length > 10 ? 14 : value.length > 6 ? 16 : 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}
