/**
 * WWIPage — curated topic page: World War I deep-dive.
 *
 * Route: /wwi
 *
 * Sections:
 *  1. Hero — "The Great War — World War I (1914–1918)"
 *  2. Tab navigation — switch between sections
 *  3. Timeline — year-by-year major events (1914–1918)
 *  4. Causes — Militarism, Alliances, Imperialism, Nationalism + assassination
 *  5. Alliances — Triple Entente vs Central Powers
 *  6. Fronts & Battles — Western, Eastern, Ottoman, Italian, war at sea
 *  7. Key Figures — military & political leaders
 *  8. Technology — tanks, gas, aircraft, submarines, machine guns
 *  9. Statistics — casualties by nation, civilian deaths
 * 10. Home Front — women, rationing, propaganda, war bonds
 * 11. Aftermath — Treaty of Versailles, new nations, Spanish flu, seeds of WWII
 * 12. Legacy — how WWI shaped the 20th century
 *
 * All data is static/curated — no backend API needed.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme — muted earthy WWI palette
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#8b7355'; // khaki brown
const BG = '#0c0f0a'; // near-black olive
const TEXT = '#e8e4de'; // warm off-white
const TEXT_DIM = '#9a9486'; // muted tan
const TEXT_MUTED = '#6b6458'; // darker muted
const CARD_BG = 'rgba(139,115,85,0.06)';
const CARD_BORDER = 'rgba(139,115,85,0.2)';
const KHAKI = '#8b7355';
const DARK_GREEN = '#3d4f2f';
const RUST = '#8b4513';
const STEEL = '#5a6e7f';
const MUD = '#6b5b3e';
const OLIVE = '#556b2f';
const BLOOD_RED = '#8b2500';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SectionTab = 'timeline' | 'causes' | 'alliances' | 'battles' | 'figures' | 'technology' | 'statistics' | 'homefront' | 'aftermath' | 'legacy';

interface TimelineYear {
  year: number;
  events: { date: string; title: string; detail: string }[];
  color: string;
}

interface Cause {
  name: string;
  acronym: string;
  description: string;
  examples: string[];
  color: string;
  icon: string;
}

interface Alliance {
  name: string;
  nations: { name: string; reason: string }[];
  color: string;
  icon: string;
}

interface Battle {
  name: string;
  date: string;
  front: string;
  combatants: string;
  casualties: string;
  significance: string;
  color: string;
}

interface KeyFigure {
  name: string;
  role: string;
  nation: string;
  impact: string;
  icon: string;
  color: string;
}

interface Technology {
  name: string;
  firstUsed: string;
  description: string;
  impact: string;
  color: string;
  icon: string;
}

interface CasualtyRow {
  nation: string;
  militaryDead: string;
  militaryWounded: string;
  civilianDead: string;
  side: 'entente' | 'central';
}

interface HomeFrontTopic {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface VersaillesTerm {
  title: string;
  description: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — Timeline
// ─────────────────────────────────────────────────────────────────────────────

const TIMELINE_YEARS: TimelineYear[] = [
  {
    year: 1914,
    color: RUST,
    events: [
      { date: 'Jun 28', title: 'Assassination of Archduke Franz Ferdinand', detail: 'Gavrilo Princip assassinates the Austro-Hungarian heir and his wife Sophie in Sarajevo, triggering the July Crisis.' },
      { date: 'Jul 28', title: 'Austria-Hungary declares war on Serbia', detail: 'After Serbia rejects the ultimatum, Austria-Hungary declares war, setting off the alliance chain reactions.' },
      { date: 'Aug 1–4', title: 'War engulfs Europe', detail: 'Germany declares war on Russia (Aug 1) and France (Aug 3). Germany invades Belgium; Britain declares war on Germany (Aug 4).' },
      { date: 'Aug–Sep', title: 'Battle of the Marne', detail: 'French and British forces halt the German advance 30 miles from Paris, ending the Schlieffen Plan and beginning trench warfare.' },
      { date: 'Aug–Sep', title: 'Battle of Tannenberg', detail: 'Decisive German victory on the Eastern Front; Russia loses 170,000 men. Hindenburg and Ludendorff rise to prominence.' },
      { date: 'Oct–Nov', title: 'Race to the Sea', detail: 'Both sides attempt to outflank each other, extending trenches from the Swiss border to the English Channel.' },
    ],
  },
  {
    year: 1915,
    color: DARK_GREEN,
    events: [
      { date: 'Feb 19', title: 'Gallipoli Campaign begins', detail: 'Allied naval attack on the Dardanelles fails. Ground landings follow in April — the campaign will cost 500,000 casualties on both sides.' },
      { date: 'Apr 22', title: 'Second Battle of Ypres — first poison gas', detail: 'Germany deploys chlorine gas at Ypres, marking the first large-scale use of chemical weapons in warfare.' },
      { date: 'May 7', title: 'Sinking of RMS Lusitania', detail: 'German U-boat sinks the British liner off Ireland, killing 1,198 including 128 Americans. Shifts US public opinion against Germany.' },
      { date: 'May 23', title: 'Italy enters the war', detail: 'Italy joins the Entente after secret Treaty of London promises territorial gains from Austria-Hungary.' },
      { date: 'Sep–Oct', title: 'Loos & Champagne offensives', detail: 'Major Allied offensives on the Western Front gain minimal ground at enormous cost — the futility of frontal assault becomes clear.' },
    ],
  },
  {
    year: 1916,
    color: MUD,
    events: [
      { date: 'Feb 21–Dec', title: 'Battle of Verdun', detail: 'Germany\'s "bleed France white" strategy at Verdun. 10 months, ~700,000 combined casualties. France holds, but both armies are devastated.' },
      { date: 'May 31–Jun 1', title: 'Battle of Jutland', detail: 'Largest naval battle of the war in the North Sea. Tactically inconclusive but Britain maintains strategic naval dominance.' },
      { date: 'Jun 4–Sep 20', title: 'Brusilov Offensive', detail: 'Most successful Allied offensive of the war. Russia breaks through Austro-Hungarian lines, capturing 400,000 prisoners. Austria-Hungary never fully recovers.' },
      { date: 'Jul 1–Nov 18', title: 'Battle of the Somme', detail: 'British suffer 57,470 casualties on the first day alone — the bloodiest day in British military history. Five months yield 7 miles of territory at a cost of over 1 million total casualties.' },
      { date: 'Sep 15', title: 'First use of tanks', detail: 'British deploy Mark I tanks at Flers-Courcelette during the Somme. Mechanically unreliable but a glimpse of future warfare.' },
    ],
  },
  {
    year: 1917,
    color: STEEL,
    events: [
      { date: 'Feb 1', title: 'Unrestricted submarine warfare resumes', detail: 'Germany gambles that U-boats can starve Britain into submission before America can mobilize. It will prove a fatal miscalculation.' },
      { date: 'Mar 8–15', title: 'Russian Revolution begins', detail: 'February Revolution (Old Style calendar) topples Tsar Nicholas II. The Provisional Government continues the war — for now.' },
      { date: 'Apr 6', title: 'United States declares war on Germany', detail: 'Pushed by unrestricted submarine warfare and the Zimmermann Telegram, the US enters the war, tipping the balance of industrial and manpower resources decisively.' },
      { date: 'Jul 31–Nov 10', title: 'Battle of Passchendaele (Third Ypres)', detail: 'British offensive in Flanders mud. Half a million casualties for 5 miles. The name becomes synonymous with the futility and horror of WWI.' },
      { date: 'Nov 7', title: 'Bolshevik Revolution', detail: 'Lenin\'s Bolsheviks seize power in Russia. They will sign an armistice with Germany in December, freeing German troops for the Western Front.' },
      { date: 'Nov 20–Dec 7', title: 'Battle of Cambrai', detail: 'First massed tank attack in history — 476 tanks break through the Hindenburg Line. Demonstrates the potential of combined-arms warfare.' },
    ],
  },
  {
    year: 1918,
    color: OLIVE,
    events: [
      { date: 'Mar 3', title: 'Treaty of Brest-Litovsk', detail: 'Russia formally exits the war, ceding vast territory to Germany. Germany can now concentrate forces on the Western Front.' },
      { date: 'Mar 21–Jul 18', title: 'German Spring Offensives (Kaiserschlacht)', detail: 'Germany\'s last gamble — five massive offensives break through Allied lines. Initial success, but exhaustion and American reinforcements halt the advance.' },
      { date: 'Aug 8', title: 'Battle of Amiens — "Black Day of the German Army"', detail: 'Allied counter-offensive with 600 tanks and air support. Germany begins irreversible retreat. Ludendorff calls it the "black day."' },
      { date: 'Sep–Nov', title: 'Meuse-Argonne Offensive', detail: 'Largest American military operation in history: 1.2 million US troops. Breaks the Hindenburg Line and forces Germany to seek an armistice.' },
      { date: 'Oct 30', title: 'Ottoman Empire signs armistice', detail: 'The Ottoman Empire collapses, signing the Armistice of Mudros. Austria-Hungary follows on November 3.' },
      { date: 'Nov 11', title: 'Armistice — 11th hour of the 11th day of the 11th month', detail: 'At 11:00 AM, the guns fall silent across the Western Front. The Great War is over. 8.5 million soldiers are dead.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Causes (M.A.I.N.)
// ─────────────────────────────────────────────────────────────────────────────

const CAUSES: Cause[] = [
  {
    name: 'Militarism',
    acronym: 'M',
    description: 'The glorification of military power and a massive arms race. European powers competed to build the largest armies and navies, creating a powder keg of preparedness for war.',
    examples: ['Anglo-German naval race (Dreadnought battleships)', 'France doubled army spending 1870–1914', 'Germany\'s army grew from 400,000 to 900,000 (1874–1914)', 'Military leaders gained enormous political influence'],
    color: RUST,
    icon: '\u2694\uFE0F',
  },
  {
    name: 'Alliances',
    acronym: 'A',
    description: 'A tangled web of mutual defense treaties meant that a conflict between two nations could — and did — drag the entire continent into war.',
    examples: ['Triple Alliance: Germany, Austria-Hungary, Italy (1882)', 'Franco-Russian Alliance (1894)', 'Entente Cordiale: France & Britain (1904)', 'A local Balkan crisis became a continental war in 5 weeks'],
    color: KHAKI,
    icon: '\uD83E\uDD1D',
  },
  {
    name: 'Imperialism',
    acronym: 'I',
    description: 'Competition for colonies and global influence created deep rivalries. Germany, a latecomer to empire-building, resented British and French dominance.',
    examples: ['Moroccan Crises (1905, 1911) — Franco-German tensions', 'Scramble for Africa intensified rivalries', 'Germany demanded "a place in the sun"', 'Economic competition for raw materials and markets'],
    color: DARK_GREEN,
    icon: '\uD83C\uDF0D',
  },
  {
    name: 'Nationalism',
    acronym: 'N',
    description: 'Fierce national pride and ethnic tensions, especially in the multi-ethnic empires. Pan-Slavism, Pan-Germanism, and Balkan independence movements created instability.',
    examples: ['Pan-Slavism: Russia as protector of Slavic peoples', 'Pan-Germanism: desire to unite all German speakers', 'Balkan Wars (1912–13) created a volatile region', 'South Slavic nationalism targeted Austria-Hungary'],
    color: BLOOD_RED,
    icon: '\uD83C\uDFF4',
  },
];

const ASSASSINATION = {
  title: 'The Spark: Assassination of Archduke Franz Ferdinand',
  date: 'June 28, 1914 — Sarajevo, Bosnia',
  description: 'Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, and his wife Sophie were assassinated by Gavrilo Princip, a Bosnian Serb nationalist and member of the Black Hand. Austria-Hungary blamed Serbia, issued an ultimatum with deliberately unacceptable terms, and declared war on July 28. Within a week, the alliance system pulled all of Europe into the conflict.',
  chain: [
    'Austria-Hungary declares war on Serbia (Jul 28)',
    'Russia mobilizes to defend Serbia (Jul 30)',
    'Germany declares war on Russia (Aug 1)',
    'Germany declares war on France (Aug 3)',
    'Germany invades Belgium (Aug 4)',
    'Britain declares war on Germany (Aug 4)',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Data — Alliances
// ─────────────────────────────────────────────────────────────────────────────

const ALLIANCES: Alliance[] = [
  {
    name: 'Triple Entente (Allied Powers)',
    icon: '\uD83D\uDFE6',
    color: '#3b6e8f',
    nations: [
      { name: 'France', reason: 'Sought revenge for defeat in the Franco-Prussian War (1871) and recovery of Alsace-Lorraine.' },
      { name: 'Russian Empire', reason: 'Pan-Slavic solidarity with Serbia; rivalry with Austria-Hungary in the Balkans; allied with France since 1894.' },
      { name: 'United Kingdom', reason: 'Concerned by German naval expansion and violation of Belgian neutrality (Treaty of London 1839).' },
      { name: 'Italy (from 1915)', reason: 'Switched sides from the Triple Alliance. Joined the Entente via the secret Treaty of London, promised Austro-Hungarian territory.' },
      { name: 'United States (from 1917)', reason: 'Unrestricted submarine warfare sank US ships; the Zimmermann Telegram proposed a German-Mexican alliance against the US.' },
      { name: 'Japan', reason: 'Anglo-Japanese Alliance (1902); seized German colonies in the Pacific and Shandong, China.' },
      { name: 'Serbia', reason: 'Directly attacked by Austria-Hungary; defended by Russia under Pan-Slavic commitments.' },
      { name: 'Belgium', reason: 'Neutral nation invaded by Germany under the Schlieffen Plan; Britain entered the war partly to defend Belgian neutrality.' },
    ],
  },
  {
    name: 'Central Powers',
    icon: '\u26AB',
    color: '#7a5c3e',
    nations: [
      { name: 'German Empire', reason: 'Supported Austria-Hungary via the Dual Alliance (1879); pursued continental dominance and Weltpolitik (world policy).' },
      { name: 'Austria-Hungary', reason: 'Declared war on Serbia after the assassination of Franz Ferdinand; sought to crush South Slavic nationalism threatening the empire.' },
      { name: 'Ottoman Empire', reason: 'Feared Russian expansion; signed a secret alliance with Germany (Aug 1914); sought to reclaim lost territory.' },
      { name: 'Bulgaria (from 1915)', reason: 'Joined the Central Powers to reclaim territory lost in the Second Balkan War, especially Macedonia from Serbia.' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Battles
// ─────────────────────────────────────────────────────────────────────────────

const FRONT_COLORS: Record<string, string> = {
  'Western Front': DARK_GREEN,
  'Eastern Front': STEEL,
  'Ottoman Front': RUST,
  'Italian Front': MUD,
  'Naval': '#3b6e8f',
  'Colonial': OLIVE,
};

const BATTLES: Battle[] = [
  { name: 'First Battle of the Marne', date: 'Sep 5–12, 1914', front: 'Western Front', combatants: 'France & BEF vs Germany', casualties: '~500,000 total', significance: 'Halted the German advance on Paris and ended the Schlieffen Plan. Began the stalemate of trench warfare that would define the Western Front.', color: DARK_GREEN },
  { name: 'Battle of Tannenberg', date: 'Aug 26–30, 1914', front: 'Eastern Front', combatants: 'Germany vs Russia', casualties: '~170,000 Russian; ~12,000 German', significance: 'Devastating Russian defeat. Two Russian corps destroyed. Made Hindenburg and Ludendorff national heroes. Russia never fully recovered on the Eastern Front.', color: STEEL },
  { name: 'Battle of Gallipoli', date: 'Feb 1915 – Jan 1916', front: 'Ottoman Front', combatants: 'Britain, ANZAC, France vs Ottoman Empire', casualties: '~473,000 total (both sides)', significance: 'Failed Allied attempt to knock out the Ottoman Empire and open a supply route to Russia. Forged Australian and New Zealand national identity. Made Mustafa Kemal (Atatürk) a hero.', color: RUST },
  { name: 'Battle of Verdun', date: 'Feb 21 – Dec 18, 1916', front: 'Western Front', combatants: 'France vs Germany', casualties: '~700,000 total', significance: 'Germany\'s strategy to "bleed France white" at a symbolically important fortress. 10 months of relentless carnage. France held — "Ils ne passeront pas!" (They shall not pass!). Became a symbol of French determination.', color: DARK_GREEN },
  { name: 'Battle of Jutland', date: 'May 31 – Jun 1, 1916', front: 'Naval', combatants: 'Royal Navy vs Imperial German Navy', casualties: '~9,800 total', significance: 'Largest naval battle of the war — 250 ships engaged. Tactically inconclusive, but the German High Seas Fleet never again seriously challenged British naval supremacy. Britain maintained its blockade.', color: '#3b6e8f' },
  { name: 'Battle of the Somme', date: 'Jul 1 – Nov 18, 1916', front: 'Western Front', combatants: 'Britain & France vs Germany', casualties: '~1,100,000 total', significance: 'First day: 57,470 British casualties — the bloodiest day in British military history. Five months gained just 7 miles. First use of tanks (Sep 15). Epitome of industrial-age slaughter.', color: DARK_GREEN },
  { name: 'Brusilov Offensive', date: 'Jun 4 – Sep 20, 1916', front: 'Eastern Front', combatants: 'Russia vs Austria-Hungary & Germany', casualties: '~1,600,000 total', significance: 'Most successful Allied offensive of the entire war. Russia captured 400,000 prisoners. Austria-Hungary never fully recovered. But the cost exhausted Russia, contributing to the 1917 revolutions.', color: STEEL },
  { name: 'Battle of Arras / Vimy Ridge', date: 'Apr 9 – May 16, 1917', front: 'Western Front', combatants: 'Britain & Canada vs Germany', casualties: '~278,000 total', significance: 'Canadian Corps captured Vimy Ridge in a meticulously planned assault — a defining moment in Canadian national identity. Broader Battle of Arras gained ground but stalled.', color: DARK_GREEN },
  { name: 'Battle of Passchendaele (Third Ypres)', date: 'Jul 31 – Nov 10, 1917', front: 'Western Front', combatants: 'Britain & Dominions vs Germany', casualties: '~475,000–585,000 total', significance: 'Fought in apocalyptic mud in Flanders. Men and horses drowned in shell craters. Half a million casualties for 5 miles of devastated ground. The name became synonymous with the futility of WWI.', color: DARK_GREEN },
  { name: 'Battle of Caporetto', date: 'Oct 24 – Nov 19, 1917', front: 'Italian Front', combatants: 'Germany & Austria-Hungary vs Italy', casualties: '~305,000 Italian (incl. 265,000 captured)', significance: 'Catastrophic Italian defeat. The Austro-German forces broke through using innovative infiltration tactics. Italy lost 10,000 sq km of territory. Britain and France sent reinforcements to prevent total collapse.', color: MUD },
  { name: 'Battle of Cambrai', date: 'Nov 20 – Dec 7, 1917', front: 'Western Front', combatants: 'Britain vs Germany', casualties: '~90,000 total', significance: 'First massed tank attack — 476 tanks broke through the Hindenburg Line. Demonstrated combined-arms tactics (tanks, infantry, aircraft, artillery). A preview of the mobile warfare that would dominate WWII.', color: DARK_GREEN },
  { name: 'German Spring Offensives', date: 'Mar 21 – Jul 18, 1918', front: 'Western Front', combatants: 'Germany vs Britain, France & US', casualties: '~1,500,000+ total', significance: 'Germany\'s final gamble before American troops arrived in force. Five offensives broke through Allied lines using stormtrooper tactics. Initial success, but unable to exploit breakthroughs. Exhausted Germany\'s last reserves.', color: DARK_GREEN },
  { name: 'Battle of Amiens', date: 'Aug 8, 1918', front: 'Western Front', combatants: 'Britain, France, Australia, Canada vs Germany', casualties: '~44,000 German (incl. 30,000 captured)', significance: 'Ludendorff called it the "Black Day of the German Army." 600 tanks and air superiority shattered German defenses. The beginning of the Hundred Days Offensive that ended the war.', color: DARK_GREEN },
  { name: 'Battle of Megiddo', date: 'Sep 19–25, 1918', front: 'Ottoman Front', combatants: 'Britain & Arab forces vs Ottoman Empire', casualties: 'Ottoman army effectively destroyed', significance: 'Allenby\'s masterpiece — complete destruction of three Ottoman armies in Palestine. Lawrence of Arabia and Arab irregular forces cut rail lines. Led directly to the Ottoman armistice.', color: RUST },
  { name: 'Meuse-Argonne Offensive', date: 'Sep 26 – Nov 11, 1918', front: 'Western Front', combatants: 'United States & France vs Germany', casualties: '~350,000+ total', significance: 'Largest operation in US military history: 1.2 million American troops. Broke the Hindenburg Line. Contributed decisively to Germany seeking an armistice. The last major battle of the war.', color: DARK_GREEN },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Key Figures
// ─────────────────────────────────────────────────────────────────────────────

const KEY_FIGURES: KeyFigure[] = [
  { name: 'Kaiser Wilhelm II', role: 'Emperor of Germany', nation: 'Germany', impact: 'His aggressive foreign policy (Weltpolitik), naval arms race with Britain, and "blank check" to Austria-Hungary helped trigger the war. Increasingly sidelined by his generals, he abdicated on November 9, 1918 and fled to the Netherlands.', icon: '\uD83D\uDC51', color: RUST },
  { name: 'Archduke Franz Ferdinand', role: 'Heir to the Austro-Hungarian throne', nation: 'Austria-Hungary', impact: 'His assassination in Sarajevo on June 28, 1914 was the immediate trigger of WWI. Ironically, he had advocated for reform and greater autonomy for Slavic peoples within the empire.', icon: '\uD83C\uDFAF', color: BLOOD_RED },
  { name: 'Field Marshal Douglas Haig', role: 'Commander of the British Expeditionary Force', nation: 'United Kingdom', impact: 'Commanded British forces from 1915 to war\'s end. Oversaw the Somme, Passchendaele, and the Hundred Days. Controversial — critics call him "Butcher of the Somme" for costly frontal assaults; defenders note he adapted tactics and won the war.', icon: '\uD83C\uDDEC\uD83C\uDDE7', color: DARK_GREEN },
  { name: 'Marshal Ferdinand Foch', role: 'Supreme Commander of Allied Armies (1918)', nation: 'France', impact: 'Appointed Allied Supreme Commander in April 1918 during the German Spring Offensives. Coordinated the Hundred Days Offensive that broke Germany. "My centre is giving way, my right is retreating. Situation excellent. I am attacking."', icon: '\uD83C\uDDEB\uD83C\uDDF7', color: '#3b6e8f' },
  { name: 'Paul von Hindenburg', role: 'Chief of the German General Staff', nation: 'Germany', impact: 'Hero of Tannenberg. Alongside Ludendorff, effectively ran Germany as a military dictatorship from 1916. Built the Hindenburg Line. Later became president of the Weimar Republic and fatefully appointed Hitler as chancellor in 1933.', icon: '\uD83C\uDDE9\uD83C\uDDEA', color: MUD },
  { name: 'Erich Ludendorff', role: 'First Quartermaster-General of Germany', nation: 'Germany', impact: 'The strategic brain behind Hindenburg. Masterminded the Spring Offensives but overextended Germany\'s resources. Promoted the "stab-in-the-back" myth that the army was undefeated but betrayed by civilians — a myth later exploited by the Nazis.', icon: '\u2699\uFE0F', color: STEEL },
  { name: 'Lord Kitchener', role: 'Secretary of State for War', nation: 'United Kingdom', impact: 'His iconic "Your Country Needs You" poster recruited millions of volunteers. Foresaw a long war when others predicted it would end by Christmas. Died in 1916 when HMS Hampshire struck a mine.', icon: '\uD83D\uDCEF', color: '#3b6e8f' },
  { name: 'T.E. Lawrence (Lawrence of Arabia)', role: 'British liaison to the Arab Revolt', nation: 'United Kingdom / Arab Revolt', impact: 'Helped organize the Arab Revolt against the Ottoman Empire. Led guerrilla raids on Turkish railways and captured Aqaba. His exploits became legendary, though he was haunted by Britain\'s broken promises to the Arabs.', icon: '\uD83C\uDFDC\uFE0F', color: KHAKI },
  { name: 'Mustafa Kemal (Atatürk)', role: 'Ottoman military commander', nation: 'Ottoman Empire / Turkey', impact: 'Brilliantly defended Gallipoli against the Allied invasion. Later led the Turkish War of Independence and founded the Republic of Turkey in 1923. "I don\'t order you to attack. I order you to die."', icon: '\u2B50', color: RUST },
  { name: 'Tsar Nicholas II', role: 'Emperor of Russia', nation: 'Russian Empire', impact: 'Took personal command of the army in 1915, tying the monarchy to military failures. His inability to manage the war effort and domestic crises led to the February Revolution of 1917 and his abdication. Executed with his family by Bolsheviks in 1918.', icon: '\uD83D\uDC51', color: STEEL },
  { name: 'Woodrow Wilson', role: 'President of the United States', nation: 'United States', impact: 'Kept the US neutral until 1917, then framed the war as making the world "safe for democracy." His Fourteen Points shaped the peace negotiations, but the US Senate rejected the Treaty of Versailles and the League of Nations.', icon: '\uD83C\uDDFA\uD83C\uDDF8', color: OLIVE },
  { name: 'Georges Clemenceau', role: 'Prime Minister of France', nation: 'France', impact: '"The Tiger" — took power in 1917 and revitalized French war effort. At Versailles, demanded harsh terms for Germany: "My home policy? I wage war. My foreign policy? I wage war. I always wage war."', icon: '\uD83D\uDC05', color: BLOOD_RED },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Technology
// ─────────────────────────────────────────────────────────────────────────────

const TECHNOLOGIES: Technology[] = [
  { name: 'Machine Guns', firstUsed: 'From the start (1914)', description: 'The Maxim gun and its variants could fire 400–600 rounds per minute. A single gun could hold off hundreds of advancing soldiers. Defensive dominance made frontal attacks suicidal.', impact: 'Made traditional infantry charges obsolete. Created the conditions for trench warfare. Attackers needed 3:1 or higher superiority to have any chance of success.', color: RUST, icon: '\uD83D\uDD2B' },
  { name: 'Poison Gas', firstUsed: 'April 22, 1915 (Ypres)', description: 'Chlorine gas was first used by Germany at Second Ypres. Later escalated to phosgene and mustard gas. Caused blindness, blistering, suffocation, and agonizing death.', impact: 'Created terror but rarely decisive tactically. Gas masks reduced effectiveness. Led to the 1925 Geneva Protocol banning chemical weapons. Total gas casualties: ~1.3 million, ~90,000 dead.', color: '#6b8e23', icon: '\u2623\uFE0F' },
  { name: 'Tanks', firstUsed: 'September 15, 1916 (Somme)', description: 'Developed in secrecy by the British (codenamed "tanks" as a cover). The Mark I weighed 28 tons, had a crew of 8, and moved at 3.7 mph. Early models were mechanically unreliable.', impact: 'Initially dismissed, but massed use at Cambrai (1917) and Amiens (1918) proved transformative. Broke the trench stalemate by crushing barbed wire and crossing trenches. Revolutionized land warfare.', color: OLIVE, icon: '\uD83D\uDFE9' },
  { name: 'Military Aircraft', firstUsed: 'From the start (reconnaissance 1914)', description: 'Began as unarmed reconnaissance platforms. Evolved into fighters (Fokker Eindecker, Sopwith Camel, SPAD), bombers, and ground-attack aircraft. Pilots became the "knights of the air."', impact: 'Artillery spotting transformed accuracy of bombardment. Fighters battled for air supremacy. Strategic bombing of cities began (German Gotha raids on London). Foreshadowed the air power doctrine of WWII.', color: '#3b6e8f', icon: '\u2708\uFE0F' },
  { name: 'Submarines (U-boats)', firstUsed: 'From 1914 (unrestricted from Feb 1917)', description: 'Germany\'s U-boats targeted Allied merchant shipping to starve Britain. At their peak, they sank 860,000 tons of shipping per month (April 1917). The convoy system and depth charges eventually countered them.', impact: 'Nearly won the war for Germany — Britain came within 6 weeks of running out of food. Unrestricted submarine warfare brought the US into the war. Demonstrated that control of the seas required control beneath them.', color: STEEL, icon: '\uD83D\uDEA2' },
  { name: 'Artillery', firstUsed: 'From the start — dominated the war', description: 'Artillery caused ~60% of all casualties in WWI. Evolved from shrapnel to high-explosive shells, creeping barrages, and precision fire directed by aircraft. The "Big Bertha" could hit targets 80 miles away.', impact: 'The true killer of WWI. A week-long barrage preceded most major offensives (1.7 million shells before the Somme). Created the lunar landscape of No Man\'s Land. Shell shock (PTSD) affected hundreds of thousands.', color: MUD, icon: '\uD83D\uDCA5' },
  { name: 'Barbed Wire & Trenches', firstUsed: 'Late 1914 onward', description: 'Not new technology, but used at unprecedented scale. The Western Front\'s trench system stretched 440 miles. Barbed wire belts could be 30+ yards deep. Dugouts went 30+ feet underground.', impact: 'Created the iconic image of WWI. Combined with machine guns, made defense vastly stronger than offense. Soldiers lived in mud, rats, lice, and constant shellfire. Trench foot, disease, and psychological trauma were endemic.', color: DARK_GREEN, icon: '\uD83E\uDEA4' },
  { name: 'Flamethrowers', firstUsed: 'February 1915 (Malancourt)', description: 'Germany pioneered portable flamethrowers (Flammenwerfer) that could project burning fuel 20 meters. Used to clear trenches and fortified positions.', impact: 'Terrifying psychological weapon. Limited tactical impact due to short range and vulnerability of operators, but highly effective at clearing bunkers and causing panic.', color: BLOOD_RED, icon: '\uD83D\uDD25' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Casualties
// ─────────────────────────────────────────────────────────────────────────────

const CASUALTIES: CasualtyRow[] = [
  { nation: 'Russia', militaryDead: '1,700,000', militaryWounded: '4,950,000', civilianDead: '2,000,000', side: 'entente' },
  { nation: 'France', militaryDead: '1,357,800', militaryWounded: '4,266,000', civilianDead: '40,000', side: 'entente' },
  { nation: 'British Empire', militaryDead: '908,371', militaryWounded: '2,090,212', civilianDead: '30,633', side: 'entente' },
  { nation: 'Italy', militaryDead: '650,000', militaryWounded: '947,000', civilianDead: '589,000', side: 'entente' },
  { nation: 'United States', militaryDead: '116,516', militaryWounded: '204,002', civilianDead: '757', side: 'entente' },
  { nation: 'Romania', militaryDead: '335,706', militaryWounded: '120,000', civilianDead: '275,000', side: 'entente' },
  { nation: 'Serbia', militaryDead: '275,000', militaryWounded: '133,148', civilianDead: '450,000', side: 'entente' },
  { nation: 'Germany', militaryDead: '1,773,700', militaryWounded: '4,216,058', civilianDead: '426,000', side: 'central' },
  { nation: 'Austria-Hungary', militaryDead: '1,200,000', militaryWounded: '3,620,000', civilianDead: '467,000', side: 'central' },
  { nation: 'Ottoman Empire', militaryDead: '325,000', militaryWounded: '400,000', civilianDead: '2,150,000', side: 'central' },
  { nation: 'Bulgaria', militaryDead: '87,500', militaryWounded: '152,390', civilianDead: '100,000', side: 'central' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Home Front
// ─────────────────────────────────────────────────────────────────────────────

const HOME_FRONT: HomeFrontTopic[] = [
  { title: 'Women in the Workforce', description: 'With millions of men at the front, women filled roles previously closed to them.', details: 'Women worked in munitions factories ("munitionettes"), drove ambulances, served as nurses near the front lines, operated trams, farmed land, and worked in government offices. In Britain alone, the number of women in employment rose by 1.6 million during the war. This massive contribution was a key factor in women gaining the vote — Britain granted limited women\'s suffrage in 1918, and full suffrage in 1928.', icon: '\uD83D\uDC69\u200D\uD83C\uDFED', color: KHAKI },
  { title: 'Rationing & Food Shortages', description: 'Submarine warfare and military demands created severe food shortages.', details: 'Germany suffered most — the British naval blockade caused the "Turnip Winter" of 1916–17, when hundreds of thousands died of malnutrition. Britain introduced voluntary rationing in 1917 and compulsory rationing (sugar, meat, butter) in 1918. Civilians were encouraged to grow vegetables ("victory gardens"). Germany\'s home front collapse from starvation and exhaustion was a major factor in the armistice.', icon: '\uD83C\uDF3E', color: OLIVE },
  { title: 'Propaganda', description: 'Governments used unprecedented propaganda to maintain public support.', details: 'Recruitment posters (Kitchener\'s "Your Country Needs You," Uncle Sam\'s "I Want YOU"), atrocity stories (some real, many exaggerated), censorship of bad news from the front, and demonization of the enemy. Film, newspapers, and public speeches were all weaponized. Propaganda shaped public perception so thoroughly that the true horror of the trenches was not widely understood until years after the war ended.', icon: '\uD83D\uDCF0', color: RUST },
  { title: 'War Bonds & Economic Mobilization', description: 'Nations financed the war through bonds, taxes, and economic transformation.', details: 'The war cost an estimated $208 billion (1918 dollars). Governments sold "war bonds" and "liberty bonds" to citizens — the US alone raised $21 billion through four Liberty Loan drives. Entire economies were reorganized for war production. The financial strain left Europe deeply indebted, particularly to the United States, reshaping the global economic order.', icon: '\uD83D\uDCB0', color: MUD },
  { title: 'Conscription & Resistance', description: 'Voluntary enlistment gave way to conscription as the war dragged on.', details: 'Britain introduced conscription in January 1916 — a radical step for a nation with no tradition of compulsory military service. Conscientious objectors faced tribunals, imprisonment, or non-combatant roles. In Ireland, resistance to conscription fueled the independence movement. War weariness grew across all nations — French army mutinies in 1917 affected 54 divisions.', icon: '\u270A', color: STEEL },
  { title: 'Shell Shock & Medical Advances', description: 'The war created new medical challenges and pioneered new treatments.', details: 'Shell shock (now recognized as PTSD) affected hundreds of thousands — initially dismissed as cowardice, gradually understood as a psychological wound. Blood transfusion, antiseptic wound treatment, and reconstructive surgery (for facial injuries) advanced rapidly. X-ray units were deployed near the front. The scale of casualties drove the development of modern trauma medicine and rehabilitation.', icon: '\uD83C\uDFE5', color: BLOOD_RED },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data — Treaty of Versailles
// ─────────────────────────────────────────────────────────────────────────────

const VERSAILLES_TERMS: VersaillesTerm[] = [
  { title: 'War Guilt Clause (Article 231)', description: 'Germany was forced to accept sole responsibility for causing the war. This clause was deeply resented by Germans and became a rallying cry for nationalist movements, including the Nazis.', color: BLOOD_RED },
  { title: 'Reparations', description: 'Germany was required to pay 132 billion gold marks (~$33 billion, or ~$500 billion today) in reparations to the Allies. The crushing financial burden contributed to hyperinflation, economic collapse, and political instability in Germany.', color: MUD },
  { title: 'Territorial Losses', description: 'Germany lost 13% of its territory and 10% of its population: Alsace-Lorraine to France, West Prussia and Posen to Poland, Eupen-Malmedy to Belgium, North Schleswig to Denmark, Danzig became a free city, and all overseas colonies were confiscated.', color: DARK_GREEN },
  { title: 'Military Restrictions', description: 'The German army was limited to 100,000 men (no conscription). No air force, no submarines, no tanks. The navy was restricted to 6 battleships. The Rhineland was demilitarized. These terms were systematically violated in the 1930s.', color: STEEL },
  { title: 'League of Nations', description: 'Wilson\'s centerpiece — an international body to prevent future wars through collective security and diplomacy. Germany was initially excluded. The US Senate refused to ratify the treaty, fatally weakening the League from the start.', color: KHAKI },
];

const NEW_NATIONS = [
  'Poland (restored after 123 years of partition)',
  'Czechoslovakia (from Austria-Hungary)',
  'Yugoslavia (Kingdom of Serbs, Croats and Slovenes)',
  'Finland (from Russian Empire)',
  'Estonia, Latvia, Lithuania (from Russian Empire)',
  'Austria & Hungary (separated from Austria-Hungary)',
  'Turkey (from Ottoman Empire — after War of Independence)',
  'Iraq, Syria, Lebanon, Palestine (Ottoman territories → League of Nations mandates)',
];

const LEGACY_ITEMS = [
  { title: 'Seeds of World War II', text: 'The harsh terms of Versailles, the war guilt clause, economic devastation, and humiliation created the conditions for the rise of fascism and Nazism. Hitler explicitly promised to overturn Versailles. WWII began just 21 years later.', color: BLOOD_RED },
  { title: 'Collapse of Empires', text: 'Four great empires fell: German, Austro-Hungarian, Ottoman, and Russian. The political map of Europe and the Middle East was redrawn. Many modern conflicts trace their roots to the borders drawn in 1919–1920.', color: RUST },
  { title: 'The Lost Generation', text: 'An entire generation was decimated. In France, 1 in 5 men between 18 and 30 was killed. The psychological scars shaped art, literature, and philosophy: Wilfred Owen, Siegfried Sassoon, Erich Maria Remarque, Ernest Hemingway.', color: MUD },
  { title: 'Birth of Modern Warfare', text: 'Tanks, aircraft, chemical weapons, submarines, and combined-arms tactics all emerged or matured during WWI. The military doctrines of WWII — blitzkrieg, strategic bombing, carrier warfare — were direct descendants of WWI innovations.', color: OLIVE },
  { title: 'Spanish Flu (1918–1919)', text: 'The pandemic killed 50–100 million people worldwide — far more than the war itself. Troop movements and crowded military camps accelerated its spread. The link between war and pandemic demonstrated the interconnectedness of global crises.', color: STEEL },
  { title: 'Women\'s Rights & Social Change', text: 'Women\'s wartime contributions accelerated the suffrage movement across the West. Social hierarchies were shaken. The myth of inevitable progress was shattered, replaced by disillusionment and modernism.', color: KHAKI },
  { title: 'The Middle East', text: 'The Sykes-Picot Agreement (1916) and the post-war mandates carved up the Ottoman Empire with little regard for ethnic or religious boundaries. The consequences — including the Israeli-Palestinian conflict, Iraq\'s borders, and Kurdish statelessness — persist today.', color: BLOOD_RED },
  { title: 'International Institutions', text: 'The League of Nations, though ultimately unsuccessful, established the principle that international cooperation was necessary to prevent war. Its successor, the United Nations (1945), learned from the League\'s failures.', color: DARK_GREEN },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${ACCENT}15`, border: `1px solid ${ACCENT}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
        border: active ? `1px solid ${ACCENT}` : '1px solid rgba(139,115,85,0.15)',
        backgroundColor: active ? `${ACCENT}22` : 'rgba(139,115,85,0.06)',
        color: active ? ACCENT : TEXT_DIM,
        cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex', alignItems: 'center', gap: 5,
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>{label}
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

function FrontFilter({ fronts, active, onSelect }: { fronts: string[]; active: string; onSelect: (f: string) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
      {fronts.map((f) => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          style={{
            padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            border: active === f ? `1px solid ${FRONT_COLORS[f] || ACCENT}` : '1px solid rgba(139,115,85,0.15)',
            backgroundColor: active === f ? `${(FRONT_COLORS[f] || ACCENT)}22` : 'rgba(139,115,85,0.06)',
            color: active === f ? (FRONT_COLORS[f] || ACCENT) : TEXT_DIM,
            cursor: 'pointer', transition: 'all 0.15s', fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'timeline', label: 'Timeline', icon: '\uD83D\uDCC5' },
  { key: 'causes', label: 'Causes', icon: '\uD83D\uDD25' },
  { key: 'alliances', label: 'Alliances', icon: '\uD83E\uDD1D' },
  { key: 'battles', label: 'Fronts & Battles', icon: '\u2694\uFE0F' },
  { key: 'figures', label: 'Key Figures', icon: '\uD83C\uDFA8' },
  { key: 'technology', label: 'Technology', icon: '\u2699\uFE0F' },
  { key: 'statistics', label: 'Casualties', icon: '\uD83D\uDCCA' },
  { key: 'homefront', label: 'Home Front', icon: '\uD83C\uDFE0' },
  { key: 'aftermath', label: 'Aftermath', icon: '\uD83D\uDDFA\uFE0F' },
  { key: 'legacy', label: 'Legacy', icon: '\uD83C\uDF10' },
];

export default function WWIPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('timeline');
  const [expandedYear, setExpandedYear] = useState<number | null>(1914);
  const [battleFront, setBattleFront] = useState<string>('All');
  const [expandedBattle, setExpandedBattle] = useState<string | null>(null);

  const filteredBattles = battleFront === 'All' ? BATTLES : BATTLES.filter((b) => b.front === battleFront);
  const allFronts = ['All', ...Array.from(new Set(BATTLES.map((b) => b.front)))];

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Hero ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(139,115,85,0.12) 100%)` }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: TEXT_DIM, textDecoration: 'none', marginBottom: 28, padding: '6px 12px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>{'\u2190'} Back to Timeline</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${ACCENT}20`, border: `2px solid ${ACCENT}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${ACCENT}30` }}>{'\u2694\uFE0F'}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${ACCENT}20`, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Topic Page</span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The Great War {'\u2014'} World War I <span style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: TEXT_DIM, fontWeight: 400 }}>(1914{'\u2013'}1918)</span>
          </h1>
          <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            The war that shattered empires, redrew the map of the world, and left 20 million dead {'\u2014'} a cataclysm whose consequences shaped the entire 20th century.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
            <StatBadge value="8.5M" label="Military Dead" />
            <StatBadge value="13M" label="Civilian Dead" />
            <StatBadge value="21M" label="Wounded" />
            <StatBadge value="30+" label="Nations Involved" />
            <StatBadge value="4" label="Empires Collapsed" />
          </div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, backgroundColor: BG }}>
          {SECTION_TABS.map((tab) => (
            <TabButton key={tab.key} label={tab.label} icon={tab.icon} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} />
          ))}
        </div>

        {/* ── Timeline ── */}
        {activeTab === 'timeline' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83D\uDCC5'} title="Year-by-Year Timeline (1914\u20131918)" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Click any year to expand its major events. From the assassination in Sarajevo to the Armistice.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIMELINE_YEARS.map((ty) => (
                <motion.div key={ty.year} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <button
                    onClick={() => setExpandedYear(expandedYear === ty.year ? null : ty.year)}
                    style={{
                      width: '100%', textAlign: 'left', cursor: 'pointer',
                      padding: '16px 20px', borderRadius: expandedYear === ty.year ? '12px 12px 0 0' : 12,
                      backgroundColor: expandedYear === ty.year ? `${ty.color}18` : CARD_BG,
                      border: `1px solid ${expandedYear === ty.year ? `${ty.color}55` : CARD_BORDER}`,
                      borderBottom: expandedYear === ty.year ? 'none' : undefined,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 26, fontWeight: 900, color: ty.color, fontFamily: 'monospace' }}>{ty.year}</span>
                      <span style={{ fontSize: 13, color: TEXT_DIM }}>{ty.events.length} major events</span>
                    </div>
                    <span style={{ fontSize: 18, color: TEXT_DIM, transform: expandedYear === ty.year ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>{'\u25BC'}</span>
                  </button>
                  <AnimatePresence>
                    {expandedYear === ty.year && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden', borderRadius: '0 0 12px 12px', border: `1px solid ${ty.color}55`, borderTop: 'none', backgroundColor: `${ty.color}08` }}
                      >
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                          {ty.events.map((ev, i) => (
                            <motion.div
                              key={ev.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06, duration: 0.3 }}
                              style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}
                            >
                              <div style={{ minWidth: 60, fontSize: 11, fontWeight: 700, color: ty.color, fontFamily: 'monospace', paddingTop: 2 }}>{ev.date}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{ev.title}</div>
                                <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{ev.detail}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Causes ── */}
        {activeTab === 'causes' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83D\uDD25'} title="Causes of the War \u2014 M.A.I.N." />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Four long-term causes created the conditions for war. One spark set it off.</p>

            {/* MAIN acronym */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 24 }}>
              {CAUSES.map((c) => (
                <div key={c.acronym} style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: `${c.color}20`, border: `2px solid ${c.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: c.color, fontFamily: 'monospace' }}>
                  {c.acronym}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16, marginBottom: 28 }}>
              {CAUSES.map((cause, i) => (
                <motion.div
                  key={cause.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${cause.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${cause.color}18`, border: `2px solid ${cause.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cause.icon}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{cause.name}</h3>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{cause.description}</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {cause.examples.map((ex) => (
                      <li key={ex} style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.5 }}>{ex}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* Assassination */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: `${BLOOD_RED}0a`, border: `1px solid ${BLOOD_RED}33` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: `${BLOOD_RED}18`, border: `2px solid ${BLOOD_RED}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{'\uD83C\uDFAF'}</span>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: TEXT, margin: 0 }}>{ASSASSINATION.title}</h3>
                  <div style={{ fontSize: 12, color: BLOOD_RED, fontFamily: 'monospace', marginTop: 2 }}>{ASSASSINATION.date}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 16 }}>{ASSASSINATION.description}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Chain Reaction:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {ASSASSINATION.chain.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM }}
                  >
                    <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: `${BLOOD_RED}22`, border: `1px solid ${BLOOD_RED}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: BLOOD_RED, flexShrink: 0 }}>{i + 1}</span>
                    {step}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── Alliances ── */}
        {activeTab === 'alliances' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83E\uDD1D'} title="The Two Alliances" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The alliance system meant that a conflict between two nations drew the entire continent into war.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {ALLIANCES.map((alliance, ai) => (
                <motion.div
                  key={alliance.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ai * 0.15, duration: 0.4 }}
                  style={{ padding: '24px 28px', borderRadius: 12, backgroundColor: `${alliance.color}0a`, border: `1px solid ${alliance.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 20 }}>{alliance.icon}</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: alliance.color, margin: 0 }}>{alliance.name}</h3>
                    <span style={{ fontSize: 12, color: TEXT_DIM, marginLeft: 'auto' }}>{alliance.nations.length} nations</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {alliance.nations.map((n, ni) => (
                      <motion.div
                        key={n.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ai * 0.15 + ni * 0.05, duration: 0.3 }}
                        style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: `${alliance.color}08`, border: `1px solid ${alliance.color}1a` }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{n.name}</div>
                        <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{n.reason}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Fronts & Battles ── */}
        {activeTab === 'battles' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\u2694\uFE0F'} title={`Major Battles \u2014 ${filteredBattles.length} Engagements`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 14, marginTop: 0 }}>Filter by front. Click any battle for full details.</p>
            <FrontFilter fronts={allFronts} active={battleFront} onSelect={setBattleFront} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence mode="popLayout">
                {filteredBattles.map((battle, i) => (
                  <motion.div
                    key={battle.name}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    onClick={() => setExpandedBattle(expandedBattle === battle.name ? null : battle.name)}
                    style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${battle.color}33`, cursor: 'pointer', transition: 'border-color 0.2s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>{battle.name}</h3>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, backgroundColor: `${battle.color}22`, color: battle.color, fontWeight: 600 }}>{battle.front}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: TEXT_DIM }}>
                          <span style={{ fontFamily: 'monospace' }}>{battle.date}</span>
                          <span>{battle.casualties} casualties</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 14, color: TEXT_MUTED, transform: expandedBattle === battle.name ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>{'\u25BC'}</span>
                    </div>
                    <AnimatePresence>
                      {expandedBattle === battle.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${battle.color}22` }}>
                            <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 6 }}><strong style={{ color: TEXT }}>Combatants:</strong> {battle.combatants}</div>
                            <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{battle.significance}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* ── Key Figures ── */}
        {activeTab === 'figures' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83C\uDFA8'} title={`Key Figures \u2014 ${KEY_FIGURES.length} Leaders`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The military commanders, political leaders, and personalities who shaped the war and its aftermath.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 16 }}>
              {KEY_FIGURES.map((fig, i) => (
                <motion.div
                  key={fig.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${fig.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${fig.color}18`, border: `2px solid ${fig.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{fig.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{fig.name}</h3>
                      <div style={{ fontSize: 12, color: fig.color, fontWeight: 600, marginTop: 2 }}>{fig.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: `${fig.color}15`, color: fig.color, fontWeight: 600, alignSelf: 'flex-start' }}>{fig.nation}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{fig.impact}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Technology ── */}
        {activeTab === 'technology' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\u2699\uFE0F'} title={`Technology of War \u2014 ${TECHNOLOGIES.length} Innovations`} />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>WWI was fought with 20th-century weapons and 19th-century tactics — the mismatch was catastrophic.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
              {TECHNOLOGIES.map((tech, i) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${tech.color}33`, display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${tech.color}18`, border: `2px solid ${tech.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{tech.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{tech.name}</h3>
                      <div style={{ fontSize: 11, color: tech.color, fontFamily: 'monospace', marginTop: 2 }}>First used: {tech.firstUsed}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{tech.description}</div>
                  <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.5, padding: '8px 12px', borderRadius: 6, backgroundColor: `${tech.color}0d`, borderLeft: `3px solid ${tech.color}44` }}>
                    <strong style={{ color: tech.color }}>Impact:</strong> {tech.impact}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Statistics ── */}
        {activeTab === 'statistics' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83D\uDCCA'} title="War Casualties by Nation" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The human cost: approximately 8.5 million military dead, 13 million civilian dead, and 21 million wounded.</p>

            {/* Summary stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: '14px 20px', borderRadius: 10, backgroundColor: `${BLOOD_RED}12`, border: `1px solid ${BLOOD_RED}33`, flex: 1, minWidth: 160, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: BLOOD_RED, fontFamily: 'monospace' }}>~8,500,000</div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>Military Dead</div>
              </div>
              <div style={{ padding: '14px 20px', borderRadius: 10, backgroundColor: `${RUST}12`, border: `1px solid ${RUST}33`, flex: 1, minWidth: 160, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: RUST, fontFamily: 'monospace' }}>~13,000,000</div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>Civilian Dead</div>
              </div>
              <div style={{ padding: '14px 20px', borderRadius: 10, backgroundColor: `${MUD}12`, border: `1px solid ${MUD}33`, flex: 1, minWidth: 160, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: MUD, fontFamily: 'monospace' }}>~21,000,000</div>
                <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>Military Wounded</div>
              </div>
            </div>

            {/* Entente */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3b6e8f', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{'\uD83D\uDFE6'} Allied / Entente Powers</div>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${CARD_BORDER}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 16px', backgroundColor: `${STEEL}15`, fontSize: 11, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <div>Nation</div><div style={{ textAlign: 'right' }}>Military Dead</div><div style={{ textAlign: 'right' }}>Wounded</div><div style={{ textAlign: 'right' }}>Civilian Dead</div>
                </div>
                {CASUALTIES.filter((c) => c.side === 'entente').map((c, i) => (
                  <motion.div
                    key={c.nation}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 13, color: TEXT_DIM, borderTop: `1px solid ${CARD_BORDER}`, backgroundColor: i % 2 === 0 ? 'transparent' : `${STEEL}06` }}
                  >
                    <div style={{ fontWeight: 600, color: TEXT }}>{c.nation}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.militaryDead}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.militaryWounded}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.civilianDead}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Central Powers */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#7a5c3e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{'\u26AB'} Central Powers</div>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${CARD_BORDER}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 16px', backgroundColor: `${MUD}15`, fontSize: 11, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <div>Nation</div><div style={{ textAlign: 'right' }}>Military Dead</div><div style={{ textAlign: 'right' }}>Wounded</div><div style={{ textAlign: 'right' }}>Civilian Dead</div>
                </div>
                {CASUALTIES.filter((c) => c.side === 'central').map((c, i) => (
                  <motion.div
                    key={c.nation}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', padding: '10px 16px', fontSize: 13, color: TEXT_DIM, borderTop: `1px solid ${CARD_BORDER}`, backgroundColor: i % 2 === 0 ? 'transparent' : `${MUD}06` }}
                  >
                    <div style={{ fontWeight: 600, color: TEXT }}>{c.nation}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.militaryDead}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.militaryWounded}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12 }}>{c.civilianDead}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Home Front ── */}
        {activeTab === 'homefront' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83C\uDFE0'} title="The Home Front" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>WWI was the first "total war" — the entire civilian population was mobilized for the war effort.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {HOME_FRONT.map((topic, i) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${topic.color}33` }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: `${topic.color}18`, border: `2px solid ${topic.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{topic.icon}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>{topic.title}</h3>
                      <div style={{ fontSize: 12, color: topic.color, marginTop: 2 }}>{topic.description}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{topic.details}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Aftermath ── */}
        {activeTab === 'aftermath' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83D\uDDFA\uFE0F'} title="Aftermath \u2014 Treaty of Versailles & New World Order" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>Signed June 28, 1919 — exactly 5 years after the assassination that started it all. The peace that sowed the seeds of the next war.</p>

            {/* 5 Key Terms */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>5 Key Terms of the Treaty</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {VERSAILLES_TERMS.map((term, i) => (
                <motion.div
                  key={term.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  style={{ padding: '16px 20px', borderRadius: 10, backgroundColor: `${term.color}0a`, border: `1px solid ${term.color}33`, borderLeft: `4px solid ${term.color}66` }}
                >
                  <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 6 }}>{term.title}</div>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7 }}>{term.description}</div>
                </motion.div>
              ))}
            </div>

            {/* New Nations */}
            <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Redrawing the Map — New Nations & Mandates</div>
            <div style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${CARD_BORDER}`, marginBottom: 28 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {NEW_NATIONS.map((nation, i) => (
                  <motion.div
                    key={nation}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0 }} />
                    {nation}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Legacy ── */}
        {activeTab === 'legacy' && (
          <section style={{ padding: '28px 32px', borderBottom: `1px solid ${CARD_BORDER}` }}>
            <SectionHeader icon={'\uD83C\uDF10'} title="Legacy \u2014 How WWI Shaped the 20th Century" />
            <p style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.6, marginBottom: 18, marginTop: 0 }}>The Great War did not end in 1918. Its consequences rippled through the entire century and continue to shape our world today.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {LEGACY_ITEMS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  style={{ padding: '20px 24px', borderRadius: 12, backgroundColor: CARD_BG, border: `1px solid ${item.color}33` }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0, marginBottom: 8 }}>{item.title}</h3>
                  <div style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.75 }}>{item.text}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <div style={{ padding: '32px', textAlign: 'center', borderTop: `1px solid ${CARD_BORDER}` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', padding: '8px 16px', borderRadius: 6, border: `1px solid ${CARD_BORDER}`, backgroundColor: CARD_BG }}>{'\u2190'} Back to Timeline</Link>
        </div>
      </div>
    </div>
  );
}
