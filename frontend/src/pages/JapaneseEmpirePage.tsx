/**
 * JapaneseEmpirePage — comprehensive deep-dive on the rise and fall of the
 * Japanese Empire (1603–1952).
 *
 * Route: /japanese-empire
 *
 * Sections:
 *  1. Hero — From Black Ships to Atomic Bombs
 *  2. Tokugawa Shogunate — 250 years of isolation
 *  3. Perry's Black Ships — the shock of 1853
 *  4. Meiji Restoration — overthrowing feudalism
 *  5. The 40-Year Sprint — modernization 1868–1905
 *  6. Sino-Japanese War — defeating China (1894–95)
 *  7. Russo-Japanese War — defeating Russia (1904–05)
 *  8. Annexation of Korea — colonial rule 1910–1945
 *  9. WWI and Interwar — rise of militarism
 * 10. Road to WWII — China, Nanjing, Pearl Harbor
 * 11. Pacific War and Defeat — Midway to atomic bombs
 * 12. Postwar Miracle — Article 9, economic transformation
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const CRIMSON = '#dc2626';
const IMPERIAL_RED = '#b91c1c';
const RISING_SUN = '#ef4444';
const NAVY = '#1e3a5f';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const CHERRY = '#f43f5e';
const PURPLE = '#a855f7';
const BLUE = '#3b82f6';
const SLATE = '#64748b';
const ICE_BLUE = '#7dd3fc';
const OLIVE = '#6b7a2e';

const FIGURE_COLORS = [CRIMSON, GOLD, NAVY, TEAL, CHERRY, INDIGO, GREEN, PURPLE];

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

// ── Tokugawa Shogunate ──────────────────────────────────────────────────────

const TOKUGAWA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sakoku — The Closed Country (1639–1853)',
    detail:
      'For over 200 years, Japan enforced one of history\'s most extreme isolationist policies. Japanese citizens were forbidden from leaving the country on pain of death. Foreign ships were turned away or fired upon. The only exceptions: a tiny Dutch trading post on Dejima, a fan-shaped artificial island in Nagasaki harbor, and limited Chinese and Korean trade. Through the Dutch "window," Japan received trickles of Western knowledge — medicine, astronomy, ballistics — in a field called rangaku ("Dutch learning"). But Japan had no steam engines, no telegraph, no modern navy.',
  },
  {
    label: 'The Four-Class System',
    detail:
      'Tokugawa society was rigidly hierarchical: samurai (warriors) at the top, then farmers, artisans, and merchants at the bottom — ironic because merchants were often the wealthiest class. Below all four were eta (outcasts) and hinin (non-persons), who handled "impure" work like butchering and leather-working. Social mobility was virtually nonexistent. Samurai were forbidden from engaging in trade; merchants were forbidden from carrying swords. This rigid order maintained stability for 250 years — but it couldn\'t survive contact with the industrialized West.',
  },
  {
    label: 'Internal Stability, External Ignorance',
    detail:
      'The Tokugawa peace (Pax Tokugawa) was remarkable: 250 years without major warfare in a country that had been wracked by civil wars for over a century. Population stabilized around 30 million. Literacy rates were extraordinary for the era — estimated at 40–50% for males, higher than most European countries. Woodblock printing, kabuki theater, haiku poetry, and ukiyo-e art flourished. But Japan\'s military technology remained frozen at roughly 1600 levels: matchlock muskets, swords, wooden ships. The world had moved on. Japan had not.',
  },
  {
    label: 'Seeds of Change',
    detail:
      'By the 1840s, cracks were showing. The samurai class was impoverished — their fixed rice stipends hadn\'t kept pace with inflation over two centuries. Wealthy merchants chafed under social restrictions. Regional domains (han), particularly Satsuma and Chōshū in the southwest, were independently modernizing their militaries. News of China\'s humiliation in the Opium Wars (1839–1842) sent shockwaves through Japan\'s educated class. If the mighty Qing Empire could be brought to its knees by British gunboats, what chance did Japan have?',
  },
];

// ── Perry's Black Ships ─────────────────────────────────────────────────────

const PERRY_TIMELINE: TimelineEntry[] = [
  {
    year: 'July 8, 1853',
    title: 'The Black Ships Arrive',
    description:
      'Commodore Matthew C. Perry of the United States Navy steamed into Edo Bay (modern Tokyo Bay) with four warships — two steam-powered paddle frigates belching black smoke, and two sailing sloops. The Japanese had never seen steam-powered vessels. Thousands gathered on shore to watch in stunned disbelief. Perry\'s flagship, the USS Susquehanna, carried 300 crew and could outrun and outgun anything in the Japanese fleet. The technological gap was instantly, devastatingly clear.',
    color: NAVY,
  },
  {
    year: 'July 14, 1853',
    title: 'Perry Delivers His Ultimatum',
    description:
      'Perry refused to deal with minor officials, insisting on delivering President Fillmore\'s letter to the "Emperor" (he meant the Shogun). The letter was polite in language but threatening in substance: open ports for American trade and provide safe harbor for shipwrecked sailors — or face consequences. Perry fired his cannons in a "salute" that demonstrated his firepower. He announced he would return the following year for Japan\'s answer — with a larger fleet.',
    color: STEEL,
  },
  {
    year: 'February 13, 1854',
    title: 'Perry Returns with Nine Ships',
    description:
      'Perry returned as promised, this time with nine warships — nearly a quarter of the entire US Navy. The show of force was overwhelming. The Shogunate, which had spent months in agonized debate, had no military option. Japanese shore batteries were hopelessly outdated. The samurai class, whose identity was built on martial prowess, faced the humiliating reality that their swords and muskets were useless against steam-powered warships with explosive shells.',
    color: NAVY,
  },
  {
    year: 'March 31, 1854',
    title: 'Convention of Kanagawa — Japan Opens',
    description:
      'Japan signed the Convention of Kanagawa, opening two ports (Shimoda and Hakodate) to American ships. It was the first of many "unequal treaties" that Japan would be forced to sign with Western powers. These treaties imposed extraterritoriality (foreigners couldn\'t be tried in Japanese courts) and denied Japan tariff autonomy. The treaties were humiliating — but they also triggered the most consequential question in Japanese history: how do we survive in a world of industrial great powers?',
    color: CRIMSON,
  },
];

// ── Meiji Restoration ───────────────────────────────────────────────────────

const MEIJI_TIMELINE: TimelineEntry[] = [
  {
    year: '1858–1866',
    title: 'Sonnō Jōi — "Revere the Emperor, Expel the Barbarians"',
    description:
      'The unequal treaties triggered a political crisis. Young samurai from powerful southwestern domains — Satsuma, Chōshū, Tosa, and Hizen — rallied around the slogan sonnō jōi. They initially wanted to expel foreigners by force, but after Satsuma and Chōshū were bombarded by Western navies (1863–1864) and decisively beaten, the reformers drew a different conclusion: Japan must master Western technology to preserve its independence. The goal shifted from expelling the West to transforming Japan.',
    color: CHERRY,
  },
  {
    year: 'January 3, 1868',
    title: 'The Meiji Restoration — End of the Shogunate',
    description:
      'Young samurai from Satsuma and Chōshū staged a palace coup, "restoring" the 15-year-old Emperor Meiji to direct rule — ending 265 years of Tokugawa Shogunate. In reality, the teenage emperor was a figurehead; real power lay with the oligarchs behind him. But the symbolism was transformative: the emperor became the unifying symbol of a new Japan. The last Shogun, Tokugawa Yoshinobu, surrendered power relatively peacefully, though fighting continued.',
    color: GOLD,
  },
  {
    year: 'July 4, 1868',
    title: 'Battle of Ueno — Feudalism Dies',
    description:
      'In Tokyo (newly renamed from Edo), loyalist Shōgitai samurai made a last stand at Kan\'ei-ji temple on Ueno Hill. They were crushed in a single day by the imperial army using Armstrong guns and Gatling guns purchased from Western merchants. The battle lasted only hours — a brutal demonstration that traditional samurai warfare was finished. Within a year, the remaining Tokugawa loyalists were defeated in the Boshin War.',
    color: CRIMSON,
  },
  {
    year: '1868–1869',
    title: '"If We Can\'t Beat Them, Become Them"',
    description:
      'The Meiji government\'s central insight was ruthlessly pragmatic: Japan could not resist Western imperialism with traditional methods. It must adopt Western technology, institutions, and military organization — selectively, strategically, and faster than anyone thought possible. The slogan was fukoku kyōhei: "Enrich the country, strengthen the military." It was the most ambitious national transformation project in human history, and it would succeed beyond anyone\'s imagination.',
    color: TEAL,
  },
];

// ── 40-Year Modernization Sprint ────────────────────────────────────────────

const MODERNIZATION_TIMELINE: TimelineEntry[] = [
  {
    year: '1871–1873',
    title: 'Iwakura Mission — Learning from the World',
    description:
      'The Meiji government sent nearly half its leadership — 48 senior officials plus students — on an 18-month tour of the United States and Europe. The Iwakura Mission studied everything: factories, shipyards, parliaments, schools, armies, legal systems, railways, telegraph networks. They took meticulous notes. When they returned, they had a blueprint for transforming Japan. No other nation has ever sent its ruling elite on such a comprehensive study mission.',
    color: BLUE,
  },
  {
    year: '1872–1890',
    title: 'Infrastructure Revolution',
    description:
      'Japan built its first railway (Tokyo–Yokohama) in 1872 with British engineers. By 1890 it had 1,400 miles of track, built by Japanese engineers trained on the job. Telegraph lines connected the nation by the 1870s. Modern shipyards at Yokosuka and Nagasaki produced steam-powered vessels. Government model factories — cotton mills, silk filatures, arsenals, cement plants — were established, then sold to private entrepreneurs (creating the zaibatsu industrial conglomerates: Mitsubishi, Mitsui, Sumitomo).',
    color: STEEL,
  },
  {
    year: '1873',
    title: 'Conscription — The End of the Samurai Monopoly on War',
    description:
      'The Meiji government introduced universal military conscription, modeled on the French and Prussian systems. Every male subject was liable for military service — not just samurai. This was revolutionary: for centuries, only samurai had the right to bear arms. Now farmer\'s sons would carry rifles. The samurai class lost its raison d\'être overnight. Some samurai became military officers or bureaucrats; many fell into poverty.',
    color: OLIVE,
  },
  {
    year: '1876',
    title: 'Sword Abolishment Edict — Samurai Identity Destroyed',
    description:
      'The government banned samurai from carrying swords in public — the visible symbol of their status for centuries. Combined with the abolition of stipends (replaced by lump-sum bonds that quickly lost value), the samurai class was systematically dismantled. Approximately 1.9 million samurai and their families lost their hereditary privileges. It was the end of a warrior aristocracy that had defined Japanese society for 700 years.',
    color: AMBER,
  },
  {
    year: '1877',
    title: 'Satsuma Rebellion — Last Stand of the Samurai',
    description:
      'Saigō Takamori — one of the heroes of the Meiji Restoration itself — led 40,000 disgruntled samurai in the last major rebellion against the new government. Despite the samurai\'s courage and martial skill, they were crushed by the new conscript army armed with modern weapons. Saigō died in the final battle (by ritual suicide or wounds — accounts differ). The rebellion proved the Meiji government\'s point: modern armies of conscripted peasants with rifles defeat samurai with swords. Saigō became a tragic hero, later inspiring "The Last Samurai."',
    color: CRIMSON,
  },
  {
    year: '1889',
    title: 'Meiji Constitution — Asia\'s First Modern Constitution',
    description:
      'Japan promulgated a constitution modeled on the Prussian/German system — deliberately choosing an authoritarian model over liberal British or American alternatives. The emperor was "sacred and inviolable," sovereignty rested with the emperor (not the people), and the military answered directly to the emperor, not the parliament. A bicameral Diet was created with limited suffrage. It was genuinely modern by contemporary standards — but its structural flaws (military independence from civilian control) would prove catastrophic.',
    color: INDIGO,
  },
  {
    year: '1870s–1900s',
    title: 'Education Revolution — 40% to 90% Literacy',
    description:
      'The Meiji government established universal compulsory education in 1872 — one of the earliest systems in Asia. By 1905, over 95% of school-age children attended school. Male literacy surged from roughly 40% to over 90% in a single generation. The curriculum combined Western science and mathematics with Japanese moral education and loyalty to the emperor. Imperial universities were founded to train engineers, doctors, lawyers, and military officers. Japan was building its most important weapon: an educated population.',
    color: GREEN,
  },
];

// ── Sino-Japanese War ───────────────────────────────────────────────────────

const SINO_JAPANESE_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Cause: Korea as Flashpoint',
    detail:
      'Both Japan and Qing China claimed influence over Korea, which was nominally a Chinese tributary state but increasingly a target of Japanese ambitions. When a Korean rebellion (the Donghak Rebellion) prompted both China and Japan to send troops in 1894, Japan refused to withdraw — and launched a preemptive attack on Chinese forces. It was a calculated move: Japan\'s modernized military was ready for a test, and the aging Qing Empire was the target.',
  },
  {
    label: 'The Shock of Japanese Victory',
    detail:
      'Japan crushed China with stunning speed. The Japanese navy destroyed the Chinese Beiyang Fleet at the Battle of the Yalu River. Japanese armies overran Manchuria and the Shandong Peninsula. The war lasted only eight months. China — with ten times Japan\'s population and centuries of cultural prestige — was humiliated. The Treaty of Shimonoseki (1895) gave Japan Taiwan (Formosa), the Pescadores Islands, and a huge indemnity. Japan had arrived as a great power.',
  },
  {
    label: 'The Triple Intervention — "We\'ll Remember This"',
    detail:
      'Russia, France, and Germany — alarmed by Japanese expansion — forced Japan to return the Liaodong Peninsula to China, claiming it would "disturb the peace of the Far East." Japan, unable to resist three European great powers, complied. The humiliation was searing. When Russia then leased the same Liaodong Peninsula from China and built a naval base at Port Arthur, Japanese fury intensified. The seeds of the Russo-Japanese War were planted.',
  },
  {
    label: 'Global Significance',
    detail:
      'The Sino-Japanese War was the first major conflict won by a non-Western nation using modern Western-style military technology and organization. It shattered the assumption that modernization was exclusively a Western achievement. For China, the defeat was catastrophic — triggering the Hundred Days\' Reform, the Boxer Rebellion, and ultimately the fall of the Qing Dynasty in 1912. For Japan, it validated the entire Meiji project.',
  },
];

// ── Russo-Japanese War ──────────────────────────────────────────────────────

const RUSSO_JAPANESE_TIMELINE: TimelineEntry[] = [
  {
    year: 'February 8, 1904',
    title: 'Surprise Attack on Port Arthur',
    description:
      'Japan launched a surprise torpedo attack on the Russian Pacific Fleet at anchor in Port Arthur (Lüshunkou), Manchuria — before formally declaring war. Ten Japanese destroyers attacked at night, damaging several Russian battleships. The pattern of attacking before declaring war would become a recurring Japanese strategy. The attack gave Japan immediate naval superiority in the Yellow Sea, enabling troop landings in Korea and Manchuria.',
    color: NAVY,
  },
  {
    year: 'May 1904–Jan 1905',
    title: 'Siege of Port Arthur',
    description:
      'The Japanese army besieged the heavily fortified Russian naval base at Port Arthur for 154 days. The siege featured trench warfare, machine guns, barbed wire, and massive artillery bombardments that foreshadowed World War I by a decade. Japan suffered 60,000 casualties taking the fortress — a staggering price. General Nogi Maresuke, who lost both sons in the assault, became a symbol of sacrifice. The fall of Port Arthur destroyed Russia\'s Pacific Fleet.',
    color: CRIMSON,
  },
  {
    year: 'March 1905',
    title: 'Battle of Mukden — Largest Land Battle Before WWI',
    description:
      'At Mukden (Shenyang) in Manchuria, 330,000 Japanese soldiers faced 340,000 Russians in a battle that raged for three weeks across a 50-mile front. It was the largest land battle in history up to that point. Japan won a costly tactical victory, pushing the Russians northward. Both sides suffered over 70,000 casualties. The scale of the fighting shocked military observers worldwide and hinted at the industrialized carnage that World War I would bring.',
    color: OLIVE,
  },
  {
    year: 'May 27–28, 1905',
    title: 'Battle of Tsushima — The Most Decisive Naval Battle Since Trafalgar',
    description:
      'Russia\'s Baltic Fleet had sailed 18,000 miles around Africa — a seven-month voyage — to relieve Port Arthur. They arrived too late: Port Arthur had already fallen. In the Tsushima Strait between Japan and Korea, Admiral Tōgō Heihachirō\'s fleet annihilated the Russian fleet in less than 48 hours. Russia lost 21 ships sunk, 7 captured, and over 4,000 killed; Japan lost 3 torpedo boats and 117 men. It was the most lopsided major naval battle in modern history.',
    color: BLUE,
  },
  {
    year: 'September 5, 1905',
    title: 'Treaty of Portsmouth — Japan Joins the Great Powers',
    description:
      'President Theodore Roosevelt mediated the peace treaty at Portsmouth, New Hampshire (winning the Nobel Peace Prize). Russia recognized Japan\'s "paramount interest" in Korea, ceded the southern half of Sakhalin Island, and transferred its lease on Port Arthur and the South Manchuria Railway to Japan. Japan had defeated a European great power — a first in modern history. The news electrified the colonial world: in India, Egypt, Turkey, and China, nationalists took hope. The myth of Western invincibility was shattered.',
    color: GOLD,
  },
];

// ── Korea Annexation ────────────────────────────────────────────────────────

const KOREA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Annexation (1910)',
    detail:
      'After years of increasing control — turning Korea into a protectorate in 1905 and assassinating the Korean resistance leader Itō Hirobumi prompted harsher measures — Japan formally annexed Korea in August 1910. The Korean emperor was forced to sign the annexation treaty. Korea ceased to exist as an independent state for 35 years.',
  },
  {
    label: 'Cultural Suppression',
    detail:
      'Japan pursued a policy of cultural assimilation that intensified over the decades. Korean-language newspapers were shut down. In the 1930s–40s, Koreans were forced to adopt Japanese names (sōshi-kaimei), Korean language was banned in schools, and Korean cultural practices were suppressed. The goal was to erase Korean identity entirely and absorb Koreans as subjects of the Japanese emperor.',
  },
  {
    label: 'Forced Labor and Comfort Women',
    detail:
      'During World War II, hundreds of thousands of Koreans were conscripted as forced laborers in Japanese mines, factories, and construction projects. An estimated 200,000 women — predominantly Korean — were forced into sexual slavery as "comfort women" for the Japanese military. This systematic exploitation remains one of the most contentious issues in East Asian diplomacy. Japan\'s official acknowledgments have been repeatedly qualified or walked back, fueling ongoing Korean anger.',
  },
  {
    label: 'Legacy: 1910–1945 and Beyond',
    detail:
      'Japanese colonial rule lasted 35 years and left deep scars. Korea was modernized under Japanese rule — railways, industry, education expanded — but this development served Japanese interests, not Korean welfare. The occupation is the source of profound historical tension between Korea and Japan that persists to this day. Disputes over comfort women, forced labor, territorial claims (Dokdo/Takeshima), and the content of Japanese history textbooks regularly strain relations between the two nations.',
  },
];

// ── WWI and Interwar ────────────────────────────────────────────────────────

const INTERWAR_TIMELINE: TimelineEntry[] = [
  {
    year: '1914–1918',
    title: 'WWI: Japan Grabs German Territories',
    description:
      'Japan entered World War I on the Allied side — not out of idealism, but to seize German colonial possessions in Asia and the Pacific. Japan captured the German naval base at Qingdao (Tsingtao), China, and occupied German-held islands in the Pacific (the Marshalls, Carolines, and Marianas — islands that would become critical battlegrounds in WWII). Japan also presented China with the notorious "Twenty-One Demands" (1915), seeking sweeping concessions that would have made China a virtual Japanese protectorate.',
    color: OLIVE,
  },
  {
    year: '1919',
    title: 'Paris Peace Conference — Racial Equality Rejected',
    description:
      'At the Paris Peace Conference, Japan proposed inserting a racial equality clause into the League of Nations Covenant — a landmark moment. The proposal was supported by a majority of delegates but was blocked by US President Woodrow Wilson (under pressure from Australia and domestic segregationists) who ruled that the vote required unanimity. The rejection was a turning point: Japanese liberals who had advocated cooperation with the West were undermined. Nationalists argued that the West would never treat Japan as an equal.',
    color: AMBER,
  },
  {
    year: '1922',
    title: 'Washington Naval Treaty — Codified Inferiority',
    description:
      'The Washington Naval Treaty limited Japan\'s capital ship tonnage to 60% of the US and British fleets (the 5:5:3 ratio). Japan\'s navy, which had just won the most decisive naval battle in a century, was being told it was officially a second-class power. Japanese nationalists called it "the Rolls-Royce, Rolls-Royce, Ford ratio." The treaty\'s supporters argued it prevented a ruinous arms race; its opponents saw it as Western racism codified into international law. Japan eventually abrogated the treaty in 1936.',
    color: NAVY,
  },
  {
    year: '1929–1931',
    title: 'Great Depression — Democracy Buckles',
    description:
      'The Great Depression hit Japan\'s export-dependent economy hard. Silk prices collapsed (devastating rural Japan), unemployment soared, and faith in parliamentary democracy eroded. Militarists and ultra-nationalists — who had never fully accepted civilian control — exploited the crisis. A wave of political assassinations targeted moderate politicians and businessmen. Two prime ministers were assassinated in the early 1930s. The military increasingly operated independently of civilian government.',
    color: STEEL,
  },
  {
    year: 'September 18, 1931',
    title: 'Manchuria Incident — The Army Goes Rogue',
    description:
      'Officers of Japan\'s Kwantung Army staged a false flag attack — detonating a small explosive on the Japanese-owned South Manchuria Railway near Mukden — and blamed it on Chinese saboteurs. Using this fabricated pretext, the army invaded and occupied all of Manchuria without authorization from the civilian government in Tokyo. The cabinet was presented with a fait accompli. Manchuria was reorganized as the puppet state of "Manchukuo" under the last Qing emperor, Puyi. When the League of Nations condemned the invasion, Japan simply quit the League (1933).',
    color: CRIMSON,
  },
];

// ── Road to WWII ────────────────────────────────────────────────────────────

const WWII_ROAD_TIMELINE: TimelineEntry[] = [
  {
    year: 'July 7, 1937',
    title: 'Second Sino-Japanese War Begins',
    description:
      'A skirmish at the Marco Polo Bridge near Beijing escalated into a full-scale invasion of China. Japan captured Beijing, Shanghai (after fierce Chinese resistance), and Nanjing in rapid succession. The war would last eight years and claim an estimated 14 million Chinese civilian lives. Japan controlled China\'s coast and major cities, but China\'s vast interior — where Chiang Kai-shek\'s Nationalists and Mao Zedong\'s Communists maintained resistance — proved unconquerable.',
    color: CRIMSON,
  },
  {
    year: 'Dec 1937–Jan 1938',
    title: 'The Nanjing Massacre',
    description:
      'After capturing China\'s capital Nanjing, Japanese soldiers committed one of the worst atrocities of the 20th century. Over six weeks, an estimated 200,000 to 300,000 Chinese civilians and prisoners of war were killed — by bayoneting, shooting, beheading, burning, and burying alive. Tens of thousands of women were raped. The massacre is extensively documented by contemporaneous accounts, including those of Western missionaries and diplomats who remained in the city. Japanese nationalists continue to dispute the scale, making it one of East Asia\'s most contentious historical issues.',
    color: IMPERIAL_RED,
  },
  {
    year: 'September 27, 1940',
    title: 'Tripartite Pact — The Axis Forms',
    description:
      'Japan signed the Tripartite Pact with Nazi Germany and Fascist Italy, forming the Axis alliance. The pact was primarily a warning to the United States: if America entered the war against any one Axis power, it would face all three. For Japan, the alliance provided diplomatic cover for its expansion into Southeast Asia. For Germany, it threatened the US with a two-ocean war. The pact cemented Japan\'s alignment with the forces that would lose the war.',
    color: STEEL,
  },
  {
    year: 'July 1941',
    title: 'US Oil Embargo — The Clock Starts Ticking',
    description:
      'After Japan occupied French Indochina (Vietnam), the United States froze Japanese assets and imposed a total oil embargo. This was an existential threat: Japan imported 80% of its oil from the US. Without oil, Japan\'s navy would be immobilized within 18 months. Japan faced a choice: abandon its conquests and negotiate (unacceptable to the military), or seize the oil-rich Dutch East Indies (modern Indonesia) — which meant war with the United States and Britain. The military chose war.',
    color: AMBER,
  },
  {
    year: 'December 7, 1941',
    title: 'Pearl Harbor — "A Date Which Will Live in Infamy"',
    description:
      'Admiral Yamamoto Isoroku\'s carrier strike force — six aircraft carriers, 353 planes — attacked the US Pacific Fleet at Pearl Harbor, Hawaii, in a surprise Sunday morning assault. Eight battleships were sunk or damaged, 188 aircraft destroyed, and 2,403 Americans killed. Japan achieved tactical surprise but strategic disaster: the attack united a previously divided American public behind the war, and — crucially — missed the US aircraft carriers, which were at sea. Yamamoto himself reportedly said: "I fear all we have done is to awaken a sleeping giant."',
    color: RISING_SUN,
  },
  {
    year: 'Dec 1941–May 1942',
    title: 'The Blitzkrieg — Japan Conquers an Empire',
    description:
      'In the six months after Pearl Harbor, Japan conquered an empire spanning from Burma to Wake Island. The Philippines fell (forcing MacArthur to flee); Singapore — Britain\'s "Gibraltar of the East" with 80,000 defenders — surrendered to a smaller Japanese force in what Churchill called "the worst disaster in British military history"; Hong Kong, Malaya, the Dutch East Indies, Burma, and much of the western Pacific were overrun. Japan controlled Southeast Asia\'s oil, rubber, and tin. The "Greater East Asia Co-Prosperity Sphere" was reality.',
    color: GOLD,
  },
];

// ── Pacific War and Defeat ──────────────────────────────────────────────────

const PACIFIC_WAR_TIMELINE: TimelineEntry[] = [
  {
    year: 'June 4–7, 1942',
    title: 'Battle of Midway — The Turning Point',
    description:
      'Six months after Pearl Harbor, the US Navy sprung a trap at Midway Atoll. American codebreakers had decrypted Japanese plans, enabling Admiral Chester Nimitz to position three carriers against four Japanese carriers. In five devastating minutes on June 4, American dive bombers caught three Japanese carriers with fuel lines exposed and armed planes on deck — all three were set ablaze and sunk. A fourth carrier was sunk later that day. Japan lost four fleet carriers, a cruiser, 292 aircraft, and — critically — hundreds of irreplaceable experienced pilots. Japan never regained the strategic initiative.',
    color: BLUE,
  },
  {
    year: 'Aug 1942–Feb 1943',
    title: 'Guadalcanal — The First Counteroffensive',
    description:
      'The six-month battle for Guadalcanal in the Solomon Islands was the first Allied ground offensive in the Pacific. Marines landed on August 7, 1942, and endured months of brutal fighting in tropical jungle — malaria, tropical diseases, and Japanese nighttime "banzai" attacks. The naval battles around Guadalcanal were equally ferocious: both sides lost roughly 24 warships. Japan\'s inability to resupply or reinforce its garrison marked the shift from Japanese offensive to Allied offensive.',
    color: GREEN,
  },
  {
    year: '1943–1944',
    title: 'Island Hopping — Bloody Math',
    description:
      'The US adopted an "island hopping" strategy: bypass heavily fortified Japanese positions and capture strategically vital islands to use as air and naval bases for the next leap forward. But every island taken was a bloodbath. Japanese soldiers, following the code of bushido, almost never surrendered — they fought to the death or committed suicide. Tarawa (1943): 1,000 Marines killed in 76 hours. Saipan (1944): 3,400 Americans dead; of 31,000 Japanese defenders, 29,000 died. The closer the Allies got to Japan, the fiercer the resistance.',
    color: TEAL,
  },
  {
    year: 'February–March 1945',
    title: 'Iwo Jima — The Iconic Battle',
    description:
      'The battle for Iwo Jima — a volcanic island 750 miles from Tokyo — lasted 36 days and produced some of the war\'s heaviest casualties. Japanese General Kuribayashi Tadamichi had built 11 miles of tunnels and hundreds of concealed fortifications. Of 21,000 Japanese defenders, only 216 survived. American casualties: 6,800 killed and 19,000 wounded. The famous photograph of Marines raising the flag on Mount Suribachi became the most iconic image of the Pacific War.',
    color: OLIVE,
  },
  {
    year: 'April–June 1945',
    title: 'Okinawa — Preview of the Invasion of Japan',
    description:
      'Okinawa was the bloodiest battle of the Pacific War. Japan deployed 1,900 kamikaze attacks, sinking 36 Allied ships and damaging hundreds more. On land, 100,000 Japanese soldiers fought from elaborate cave and tunnel systems. The battle lasted 82 days. American casualties: 12,500 killed. Japanese military dead: 77,000. Most devastating: an estimated 100,000 Okinawan civilians — one-quarter of the population — died, many by suicide after Japanese propaganda convinced them Americans were monsters.',
    color: IMPERIAL_RED,
  },
  {
    year: 'March 9–10, 1945',
    title: 'Firebombing of Tokyo',
    description:
      'General Curtis LeMay sent 334 B-29 bombers over Tokyo at low altitude, dropping incendiary bombs on a city built largely of wood and paper. The resulting firestorm killed approximately 100,000 people in a single night — more immediate deaths than either atomic bomb. Sixteen square miles of the city were incinerated. Over the following months, B-29s firebombed 67 Japanese cities, destroying vast areas and killing hundreds of thousands. Japan\'s industrial capacity was shattered, but the military government refused to surrender.',
    color: RISING_SUN,
  },
  {
    year: 'August 6, 1945',
    title: 'Hiroshima — The Atomic Age Begins',
    description:
      'The B-29 Enola Gay dropped "Little Boy," a uranium bomb, on Hiroshima at 8:15 AM. The explosion — equivalent to 15,000 tons of TNT — instantly killed approximately 80,000 people and destroyed 70% of the city. Tens of thousands more died in the following weeks and months from radiation sickness, burns, and injuries. By the end of 1945, the death toll reached an estimated 90,000 to 166,000. A single bomb had done what hundreds of B-29s could not: force Japan\'s leaders to confront the reality that continued resistance meant annihilation.',
    color: AMBER,
  },
  {
    year: 'August 9, 1945',
    title: 'Nagasaki — And Soviet Invasion',
    description:
      'Three days later, "Fat Man," a plutonium bomb, was dropped on Nagasaki, killing approximately 40,000 people instantly (total deaths by end of 1945: 60,000–80,000). On the same day, the Soviet Union declared war on Japan and invaded Manchuria with 1.5 million troops, destroying Japan\'s Kwantung Army in days. Japan was now being attacked from all directions with weapons of unimaginable power. Even then, hardliners in the military attempted a coup to prevent surrender.',
    color: CRIMSON,
  },
  {
    year: 'August 15, 1945',
    title: 'The Emperor Speaks — Japan Surrenders',
    description:
      'Emperor Hirohito broadcast a recorded radio address — the first time the Japanese people had ever heard their emperor\'s voice — announcing Japan\'s acceptance of the Allied surrender terms. He never used the word "surrender," instead saying Japan must "endure the unendurable." Military officers who attempted to steal the recording and prevent the broadcast were defeated. Across the Japanese empire, millions of soldiers laid down their arms. The formal surrender was signed on September 2, 1945, aboard the USS Missouri in Tokyo Bay.',
    color: STEEL,
  },
];

// ── Postwar Miracle ─────────────────────────────────────────────────────────

const POSTWAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'MacArthur\'s Occupation (1945–1952)',
    detail:
      'General Douglas MacArthur ruled Japan as Supreme Commander of the Allied Powers (SCAP) with near-absolute authority. His occupation government implemented sweeping reforms: a new democratic constitution (written in one week by American staffers), land reform that broke up feudal estates, dissolution of the zaibatsu industrial conglomerates, labor union rights, women\'s suffrage, and a purge of wartime militarists. The occupation was remarkably successful — partly because Japan\'s bureaucratic infrastructure remained intact and cooperated with reforms.',
  },
  {
    label: 'Article 9 — Japan Renounces War',
    detail:
      'The most revolutionary provision of Japan\'s 1947 constitution: "The Japanese people forever renounce war as a sovereign right of the nation and the threat or use of force as means of settling international disputes." Japan would maintain no army, navy, or air force. Written during the occupation, Article 9 has been reinterpreted over the decades — Japan now maintains "Self-Defense Forces" with significant capabilities — but it fundamentally reshaped Japan\'s relationship with military power. No other major nation has a comparable constitutional provision.',
  },
  {
    label: 'Korean War Boost (1950–1953)',
    detail:
      'The Korean War was Japan\'s economic lifeline. The US military procured billions of dollars\' worth of supplies, equipment, and services from Japanese factories — trucks, uniforms, electronics, ship repairs. Japanese industry, which had been struggling to rebuild, suddenly had a massive customer. The "Korean War boom" (tokuju) jumpstarted Japan\'s industrial recovery, provided capital for reinvestment, and re-established Japan\'s manufacturing base. The war that devastated Korea helped rebuild Japan.',
  },
  {
    label: 'The Economic Miracle (1952–1989)',
    detail:
      'From the ruins of 1945, Japan engineered the most remarkable economic transformation of the 20th century. GDP grew at an average of 7% annually for three decades. By 1968, Japan had the world\'s second-largest economy. Toyota pioneered lean manufacturing; Sony defined consumer electronics; Honda dominated motorcycles and then cars. The formula: high savings rates, export-oriented manufacturing, close government-industry cooperation (MITI), investment in education and R&D, and a workforce of extraordinary discipline. From rubble to economic superpower in one generation.',
  },
  {
    label: 'Unresolved History',
    detail:
      'Unlike Germany, Japan has never fully confronted its wartime atrocities. The Nanjing Massacre, comfort women, forced labor, Unit 731 biological warfare experiments, and the treatment of POWs remain sources of bitter dispute. Japanese prime ministers\' visits to the Yasukuni Shrine — which honors war criminals alongside ordinary soldiers — regularly provoke outrage in China and Korea. History textbooks that minimize wartime aggression are periodically approved. This unresolved history continues to poison Japan\'s relationships with its neighbors.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Emperor Meiji',
    years: '1852–1912',
    contribution:
      'Symbol of Japan\'s modernization. Ascended at 15, reigned for 45 years during the most transformative era in Japanese history. Personally encouraged Westernization while maintaining Japanese identity. His reign saw Japan go from feudal isolation to world power.',
  },
  {
    name: 'Saigō Takamori',
    years: '1828–1877',
    contribution:
      'The "Last Samurai." Hero of the Meiji Restoration who later led the doomed Satsuma Rebellion against the modernizing government he helped create. His death symbolized the end of samurai Japan. Posthumously pardoned and celebrated as a tragic patriot.',
  },
  {
    name: 'Admiral Tōgō Heihachirō',
    years: '1848–1934',
    contribution:
      'Commander of the Japanese fleet at Tsushima — the most decisive naval victory in modern history. Trained in Britain, he combined Western naval doctrine with aggressive tactics. Called "the Nelson of the East." His victory inspired anti-colonial movements worldwide.',
  },
  {
    name: 'Admiral Yamamoto Isoroku',
    years: '1884–1943',
    contribution:
      'Architect of the Pearl Harbor attack. Studied at Harvard, served as naval attaché in Washington, and warned against war with the US: "I can run wild for six months... after that I have no expectation of success." He was right. Killed when his plane was shot down in 1943 after US codebreakers decrypted his travel plans.',
  },
  {
    name: 'Emperor Hirohito',
    years: '1901–1989',
    contribution:
      'The most controversial figure in modern Japanese history. Reigned 1926–1989 through militarism, war, defeat, occupation, and economic miracle. His role in wartime decisions remains debated: puppet of the military or active participant? His unprecedented radio broadcast ending the war saved millions of lives.',
  },
  {
    name: 'General Douglas MacArthur',
    years: '1880–1964',
    contribution:
      'Supreme Commander of the Allied occupation of Japan (1945–1951). Reshaped Japan\'s government, economy, and society with sweeping reforms. His occupation is widely considered one of the most successful in history, transforming a militarist enemy into a democratic ally.',
  },
];

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: '40 years',
    detail: 'Meiji modernization: feudal to industrial — fastest transformation in history',
  },
  {
    label: '1905',
    detail: 'First Asian defeat of a European great power in modern era (Russo-Japanese War)',
  },
  {
    label: '14 million',
    detail: 'Chinese civilians killed during Second Sino-Japanese War (1937–1945)',
  },
  {
    label: '3 million',
    detail: 'Japanese dead in the Pacific War — two-thirds from starvation and disease',
  },
  {
    label: '80,000+',
    detail: 'Immediate deaths at Hiroshima; 90,000–166,000 total by end of 1945',
  },
  {
    label: '2nd largest',
    detail: 'Japan\'s economy by 1968 — from 6th largest to 2nd in under 30 years',
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
    <section id={id} style={{ padding: '48px 0', borderTop: `2px solid ${accentColor}33` }}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 8, color: accentColor }}
      >
        {icon} {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ color: ASH, lineHeight: 1.7, marginBottom: 28, fontSize: '1.05rem' }}
      >
        {intro}
      </motion.p>
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
            position: 'relative',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: e.color,
              position: 'absolute',
              left: -6.5,
              top: 6,
            }}
          />
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.82rem',
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
          <h3 style={{ fontSize: '1.08rem', fontWeight: 700, margin: '4px 0 4px' }}>{e.title}</h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.97rem', margin: 0 }}>
            {e.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ entries }: { entries: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {entries.map((e, i) => (
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 6, color: '#e2e8f0' }}>
            {e.label}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.65, fontSize: '0.92rem', margin: 0 }}>
            {e.detail}
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
          <h4
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              marginBottom: 2,
              color: FIGURE_COLORS[i % FIGURE_COLORS.length],
            }}
          >
            {f.name}
          </h4>
          <span style={{ fontSize: '0.82rem', color: SLATE }}>{f.years}</span>
          <p style={{ color: ASH, lineHeight: 1.65, fontSize: '0.92rem', margin: '8px 0 0' }}>
            {f.contribution}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function KeyStatsBar({ stats }: { stats: InsightEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 14,
        marginBottom: 32,
      }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${CRIMSON}33`,
            borderRadius: 10,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: GOLD }}>{s.label}</div>
          <div style={{ fontSize: '0.85rem', color: ASH, marginTop: 4 }}>{s.detail}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function JapaneseEmpirePage() {
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
        {/* ── Back link ────────────────────────────────────────────────── */}
        <div style={{ paddingTop: 24 }}>
          <Link
            to="/"
            style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}
          >
            &larr; Back to Chronicle
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
              marginBottom: 16,
              background: `linear-gradient(135deg, ${CRIMSON}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            From Black Ships to Atomic Bombs — The Rise and Fall of the Japanese Empire (1853–1945)
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: ASH, lineHeight: 1.7, fontSize: '1.1rem', marginBottom: 12 }}
          >
            In 1853, four American warships steamed into Tokyo Bay — and a 250-year-old feudal
            civilization realized it was defenseless. What followed was the most extraordinary
            national transformation in history: in just 40 years, Japan went from samurai swords
            to steel battleships, from isolation to empire. By 1905, Japan had defeated both China
            and Russia. By 1942, it controlled an empire stretching from Manchuria to the Dutch
            East Indies. By 1945, two of its cities had been vaporized by nuclear weapons. By
            1989, it had the world's second-largest economy.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ color: SLATE, lineHeight: 1.7, fontSize: '1rem' }}
          >
            This is the story of a nation that remade itself to survive — and the catastrophic
            choices that followed.
          </motion.p>
        </header>

        {/* ── Key Stats ────────────────────────────────────────────────── */}
        <KeyStatsBar stats={KEY_STATS} />

        {/* ── 1. Tokugawa Shogunate ────────────────────────────────────── */}
        <SectionWrapper
          id="tokugawa"
          icon="🏯"
          title="Feudal Japan and the Tokugawa Shogunate (1603–1853)"
          accentColor={PURPLE}
          intro="For 250 years, Japan sealed itself off from the world. The Tokugawa Shogunate enforced a rigid social order and near-total isolation — creating a remarkably stable, highly literate society frozen in time while the West industrialized."
        >
          <InsightGrid entries={TOKUGAWA_INSIGHTS} />
        </SectionWrapper>

        {/* ── 2. Perry's Black Ships ───────────────────────────────────── */}
        <SectionWrapper
          id="perry"
          icon="🚢"
          title="The Black Ships — Perry's Arrival (1853–1854)"
          accentColor={NAVY}
          intro="On July 8, 1853, Commodore Matthew Perry steamed into Edo Bay with four warships belching black coal smoke. Japan had never seen steam power. The technological gap between feudal Japan and the industrialized West was laid bare in a single afternoon — and nothing would ever be the same."
        >
          <TimelineCard entries={PERRY_TIMELINE} />
        </SectionWrapper>

        {/* ── 3. Meiji Restoration ─────────────────────────────────────── */}
        <SectionWrapper
          id="meiji-restoration"
          icon="⚔️"
          title="The Meiji Restoration (1868)"
          accentColor={GOLD}
          intro="The crisis triggered by Perry's arrival led to the overthrow of the 265-year-old Shogunate. Young samurai reformers seized power, 'restored' the teenage Emperor Meiji, and made the most consequential decision in Japanese history: if we can't beat the West, we must become the West."
        >
          <TimelineCard entries={MEIJI_TIMELINE} />
        </SectionWrapper>

        {/* ── 4. 40-Year Sprint ────────────────────────────────────────── */}
        <SectionWrapper
          id="modernization"
          icon="🏭"
          title="Japan's 40-Year Modernization Sprint (1868–1905)"
          accentColor={TEAL}
          intro="No nation in history has modernized as fast as Meiji Japan. In a single generation, Japan adopted Western military organization, industrial technology, legal systems, and educational methods — while maintaining its cultural identity. The samurai class was abolished, a conscript army created, railways built, and universal education implemented. Literacy surged from 40% to 90%."
        >
          <TimelineCard entries={MODERNIZATION_TIMELINE} />
        </SectionWrapper>

        {/* ── 5. Sino-Japanese War ─────────────────────────────────────── */}
        <SectionWrapper
          id="sino-japanese"
          icon="⚡"
          title="Sino-Japanese War (1894–1895)"
          accentColor={AMBER}
          intro="Japan's modernized military got its first major test — against China, the dominant power in East Asia for millennia. Japan won decisively in eight months, shocking the world. It was the first time a non-Western nation had defeated a major Asian power using modern Western-style warfare. Japan took Taiwan and established dominance over Korea."
        >
          <InsightGrid entries={SINO_JAPANESE_INSIGHTS} />
        </SectionWrapper>

        {/* ── 6. Russo-Japanese War ────────────────────────────────────── */}
        <SectionWrapper
          id="russo-japanese"
          icon="💥"
          title="Russo-Japanese War (1904–1905) — The Shot Heard Round the Colonial World"
          accentColor={BLUE}
          intro="Japan did the unthinkable: it defeated a European great power. The Russo-Japanese War stunned the world and shattered the myth of Western invincibility. From India to Egypt to Turkey, colonized peoples took notice — if Japan could beat Russia, the West was not unbeatable. It was a turning point in world history."
        >
          <TimelineCard entries={RUSSO_JAPANESE_TIMELINE} />
        </SectionWrapper>

        {/* ── 7. Korea ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="korea"
          icon="🔗"
          title="Annexation of Korea (1910–1945)"
          accentColor={CHERRY}
          intro="Japan's imperial ambitions had their most lasting and painful impact on Korea. Thirty-five years of colonial rule — marked by cultural suppression, forced labor, and systematic exploitation — created wounds that remain unhealed more than a century later."
        >
          <InsightGrid entries={KOREA_INSIGHTS} />
          <div style={{ marginTop: 20 }}>
            <Link
              to="/korean-war"
              style={{
                color: '#60a5fa',
                textDecoration: 'none',
                fontSize: '0.92rem',
              }}
            >
              Explore: The Korean War (1950–1953) — the conflict that followed Japanese occupation &rarr;
            </Link>
          </div>
        </SectionWrapper>

        {/* ── 8. WWI and Interwar ──────────────────────────────────────── */}
        <SectionWrapper
          id="interwar"
          icon="🌑"
          title="WWI and the Interwar Period — The Rise of Militarism"
          accentColor={STEEL}
          intro="Japan emerged from WWI as a recognized great power — but felt increasingly disrespected by the Western-dominated international order. Racial equality rejected at Paris, naval inferiority codified at Washington, economic catastrophe from the Depression: each humiliation strengthened the militarists and weakened the democrats. By the 1930s, the army was acting on its own."
        >
          <TimelineCard entries={INTERWAR_TIMELINE} />
        </SectionWrapper>

        {/* ── 9. Road to WWII ──────────────────────────────────────────── */}
        <SectionWrapper
          id="road-to-wwii"
          icon="🔥"
          title="The Road to World War II"
          accentColor={CRIMSON}
          intro="Japan's invasion of China in 1937 began a war that would kill 14 million Chinese civilians. The Nanjing Massacre shocked the world. As Japan expanded into Southeast Asia, the United States cut off oil supplies — forcing Japan to choose between retreat and war. Japan chose Pearl Harbor."
        >
          <TimelineCard entries={WWII_ROAD_TIMELINE} />
        </SectionWrapper>

        {/* ── 10. Pacific War ──────────────────────────────────────────── */}
        <SectionWrapper
          id="pacific-war"
          icon="☢️"
          title="The Pacific War and Defeat (1942–1945)"
          accentColor={RISING_SUN}
          intro="After six months of stunning victories, Japan's tide turned at Midway. What followed was three years of the most brutal combat of the 20th century — island by island, cave by cave. The war ended with the most destructive weapons ever used: atomic bombs on Hiroshima and Nagasaki. Three million Japanese were dead."
        >
          <TimelineCard entries={PACIFIC_WAR_TIMELINE} />
        </SectionWrapper>

        {/* ── 11. Postwar Miracle ──────────────────────────────────────── */}
        <SectionWrapper
          id="postwar"
          icon="🌅"
          title="Postwar Japan and the Economic Miracle"
          accentColor={GREEN}
          intro="From the ashes of total defeat, Japan engineered one of history's most remarkable transformations — again. Under American occupation, Japan democratized, demilitarized, and then industrialized its way to becoming the world's second-largest economy. Toyota, Sony, Honda: the former enemy became the model of economic reinvention."
        >
          <InsightGrid entries={POSTWAR_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={INDIGO}
          intro="The individuals who shaped Japan's transformation — from the emperor who symbolized modernization to the admiral who planned Pearl Harbor to the general who rebuilt Japan from the rubble."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: SLATE, fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.7 }}>
            "I can run wild for six months to a year... after that I have no expectation of success."
            <br />
            — Admiral Yamamoto Isoroku, on the prospect of war with the United States
          </p>

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 20,
              fontSize: '0.92rem',
            }}
          >
            <Link to="/korean-war" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              The Korean War &rarr;
            </Link>
            <Link to="/chinese-dynasties" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              Chinese Dynasties &rarr;
            </Link>
            <Link to="/cold-war" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              The Cold War &rarr;
            </Link>
            <Link to="/wwii" style={{ color: '#60a5fa', textDecoration: 'none' }}>
              World War II &rarr;
            </Link>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link
              to="/"
              style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.92rem' }}
            >
              &larr; Back to Chronicle
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
