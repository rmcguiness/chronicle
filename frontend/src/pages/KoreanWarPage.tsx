/**
 * KoreanWarPage — comprehensive deep-dive on the Korean War (1950–1953).
 *
 * Route: /korean-war
 *
 * Sections:
 *  1. Hero — headline, overview of scale (5 million dead, peninsula still divided)
 *  2. Background — Japanese occupation, 38th parallel division, two Koreas emerge
 *  3. The War Begins — June 25 1950, UN Security Council, US-led coalition
 *  4. The Roller Coaster War — Busan Perimeter, Inchon, push north, China enters
 *  5. The MacArthur Controversy — escalation debate, Truman fires MacArthur
 *  6. Key Battles — 10+ major engagements
 *  7. The Chosin Reservoir — dedicated section on Frozen Chosin
 *  8. Armistice — July 27 1953, DMZ, casualty figures
 *  9. Why It's "Forgotten" — sandwiched between WWII and Vietnam
 * 10. Legacy — North vs South Korea today, US troops, nuclear threat
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const OLIVE = '#6b7a2e';
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
const ICE_BLUE = '#7dd3fc';
const MILITARY_GREEN = '#4d7c0f';
const BLOOD_RED = '#991b1b';

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

// ── Background: Korea Before the War ────────────────────────────────────────

const BACKGROUND_INSIGHTS: InsightEntry[] = [
  {
    label: 'Japanese Occupation (1910–1945)',
    detail:
      'Japan annexed Korea in 1910 and ruled it as a colony for 35 years. The occupation was brutal: Korean language and culture were suppressed, Koreans were forced to adopt Japanese names, hundreds of thousands were conscripted as forced laborers in Japanese factories and mines, and an estimated 200,000 women — mostly Korean — were forced into sexual slavery as "comfort women" for the Japanese military. Korean resistance movements were crushed. The scars of this occupation shape Korean identity and Korean-Japanese relations to this day.',
  },
  {
    label: 'The 38th Parallel: A Line Drawn in 30 Minutes',
    detail:
      'When Japan surrendered in August 1945, two young US Army officers — Dean Rusk and Charles Bonesteel — were given 30 minutes to propose a dividing line for the Soviet and American occupation zones in Korea. Using a National Geographic map, they chose the 38th parallel — a line with no cultural, geographic, or historical significance. The Soviets, who had entered the war against Japan in its final days, accepted. What was meant to be a temporary administrative boundary became one of the most dangerous borders in human history.',
  },
  {
    label: 'North: Kim Il-sung and the Communist State',
    detail:
      'In the Soviet-occupied north, Kim Il-sung — a 33-year-old former anti-Japanese guerrilla who had spent the war years in the USSR — was installed as leader. With Soviet guidance, he built a totalitarian communist state: land was redistributed, industries nationalized, political opposition eliminated. Kim developed a cult of personality that would become the most extreme in modern history. By 1948, the Democratic People\'s Republic of Korea (DPRK) was proclaimed, claiming sovereignty over the entire peninsula.',
  },
  {
    label: 'South: Syngman Rhee and the Authoritarian Republic',
    detail:
      'In the American-occupied south, the US backed Syngman Rhee — a 73-year-old Korean exile who had spent decades lobbying in Washington. Rhee was fiercely anti-communist but hardly democratic: he suppressed leftist movements, jailed political opponents, and oversaw massacres of suspected communists. The Jeju uprising of 1948–49, in which South Korean forces killed an estimated 30,000 civilians, demonstrated that the South Korean government could be just as brutal as its northern counterpart. Both Korean states conducted political violence; both claimed to represent all Koreans.',
  },
];

// ── The War Begins ──────────────────────────────────────────────────────────

const WAR_BEGINS_TIMELINE: TimelineEntry[] = [
  {
    year: 'June 25, 1950',
    title: 'North Korea Invades',
    description:
      'At 4:00 AM on a rainy Sunday morning, 75,000 North Korean soldiers, equipped with Soviet T-34 tanks and heavy artillery, poured across the 38th parallel in a massive surprise attack. The South Korean army — poorly trained, lightly armed, and with no tanks or effective anti-tank weapons — was overwhelmed. Seoul fell within three days. Stalin had approved the invasion after Kim Il-sung convinced him the war would be won in weeks, before the US could respond. He was wrong.',
    color: CRIMSON,
  },
  {
    year: 'June 27, 1950',
    title: 'UN Security Council Authorizes Intervention',
    description:
      'The UN Security Council voted to authorize military action against North Korea — a resolution that passed only because the Soviet Union was boycotting the Council over its refusal to seat Communist China. Had the Soviet delegate been present, he would have vetoed the resolution. It was one of the most consequential diplomatic blunders of the Cold War. The Soviet absence gave the US-led intervention the legitimacy of a UN mandate, making the Korean War the first military action under the United Nations flag.',
    color: BLUE,
  },
  {
    year: 'July 1950',
    title: 'Task Force Smith and American Unpreparedness',
    description:
      'The first American troops thrown into Korea — Task Force Smith, 540 soldiers from the 24th Infantry Division stationed in Japan — were shockingly unprepared. Armed with World War II-era weapons, lacking anti-tank rounds, and expecting the North Koreans to retreat at the sight of American soldiers, they were routed at the Battle of Osan on July 5. The T-34 tanks rolled right through their positions. It was a brutal wake-up call: the post-WWII American military had been gutted by budget cuts and complacency.',
    color: OLIVE,
  },
  {
    year: 'July–September 1950',
    title: 'The 16-Nation UN Coalition',
    description:
      'Sixteen nations ultimately sent combat forces to Korea under the UN flag: the United States, United Kingdom, Australia, Canada, France, Turkey, Thailand, the Philippines, New Zealand, South Africa, Greece, Belgium, Luxembourg, the Netherlands, Colombia, and Ethiopia. Five additional nations sent medical units. It was the first — and to date only — large-scale military action under direct UN command, establishing a precedent for collective security that shaped the post-war international order.',
    color: TEAL,
  },
];

// ── The Roller Coaster War ──────────────────────────────────────────────────

const ROLLER_COASTER_TIMELINE: TimelineEntry[] = [
  {
    year: 'August–September 1950',
    title: 'The Pusan Perimeter — Last Stand',
    description:
      'By August, the combined South Korean and American forces had been pushed into a tiny rectangular perimeter around the port city of Pusan (Busan) in the southeastern corner of the peninsula — roughly 140 miles long and 90 miles wide. It was nearly total defeat. General Walton Walker drew a line and declared "Stand or die." For six desperate weeks, outnumbered defenders held the perimeter against relentless North Korean attacks, sustained by massive American air and naval superiority and a constant stream of reinforcements and supplies flowing through Pusan harbor.',
    color: CRIMSON,
  },
  {
    year: 'September 15, 1950',
    title: 'Inchon Landing — MacArthur\'s Masterstroke',
    description:
      'General Douglas MacArthur — over the objections of nearly every military planner — launched an audacious amphibious assault at Inchon, the port city serving Seoul, 150 miles behind enemy lines. The operation was considered near-suicidal: Inchon had extreme tides (30+ feet), a narrow approach channel, high seawalls, and the North Koreans could easily mine the harbor. But MacArthur\'s gamble paid off spectacularly. The 1st Marine Division and 7th Infantry Division landed against light resistance, recaptured Seoul within two weeks, and cut the North Korean supply lines. The North Korean army in the south disintegrated.',
    color: BLUE,
  },
  {
    year: 'October 1950',
    title: 'The Push North — Crossing the 38th Parallel',
    description:
      'Emboldened by Inchon, the UN forces — with Truman\'s authorization — crossed the 38th parallel into North Korea. The objective shifted from defending South Korea to unifying the entire peninsula under a non-communist government. MacArthur was supremely confident: he told Truman at their Wake Island meeting that the war would be over by Christmas. UN forces captured Pyongyang, the North Korean capital, on October 19. Some units pushed all the way to the Yalu River, the border with China. China had repeatedly warned through diplomatic channels that it would intervene if UN forces approached the Yalu. MacArthur dismissed the warnings.',
    color: GOLD,
  },
  {
    year: 'November 27, 1950',
    title: 'China Enters — 300,000 Troops',
    description:
      'In the frozen mountains of North Korea, the war transformed overnight. Approximately 300,000 Chinese "People\'s Volunteer Army" soldiers — who had secretly infiltrated across the Yalu River — launched a massive surprise attack against the overextended UN forces. Chinese troops moved at night, without vehicles, carrying supplies on their backs, invisible to American air reconnaissance. The shock was total. UN forces, scattered in vulnerable positions across North Korea, were hit from all sides. What followed was the longest retreat in US military history — a fighting withdrawal of over 300 miles in brutal winter conditions.',
    color: RED,
  },
  {
    year: 'January 4, 1951',
    title: 'Seoul Falls Again',
    description:
      'Chinese and North Korean forces recaptured Seoul on January 4, 1951 — the second time the South Korean capital had changed hands. The city was devastated: already shattered by the initial invasion and the Inchon recapture, it now suffered its fourth major battle in seven months. Hundreds of thousands of refugees fled south in freezing temperatures. The UN forces retreated roughly 70 miles below the 38th parallel. Many in Washington feared Korea might be lost entirely.',
    color: BLOOD_RED,
  },
  {
    year: 'Spring 1951',
    title: 'Ridgway\'s Counteroffensive — Stabilization',
    description:
      'General Matthew Ridgway, who replaced Walker (killed in a jeep accident) as Eighth Army commander, transformed the demoralized UN forces. He restored discipline, improved tactics to counter Chinese "human wave" attacks, and launched a methodical counteroffensive — "Operation Killer" followed by "Operation Ripper" — that exploited UN superiority in firepower, armor, and air power. Seoul was recaptured for the final time on March 14. By spring, the front line stabilized roughly along the 38th parallel — almost exactly where the war had started.',
    color: MILITARY_GREEN,
  },
  {
    year: '1951–1953',
    title: 'Two Years of Bloody Stalemate',
    description:
      'From mid-1951 until the armistice in July 1953, the Korean War became a grinding trench war reminiscent of World War I. Both sides dug extensive fortification systems along a front that barely moved. Battles were fought over individual hills — Heartbreak Ridge, Bloody Ridge, Pork Chop Hill — that traded hands repeatedly at enormous cost for negligible territorial gain. Meanwhile, armistice negotiations dragged on at Panmunjom for two years, with the main sticking point being the repatriation of prisoners of war. More than half the war\'s casualties occurred during this "static" phase.',
    color: STEEL,
  },
];

// ── MacArthur Controversy ───────────────────────────────────────────────────

const MACARTHUR_INSIGHTS: InsightEntry[] = [
  {
    label: 'MacArthur\'s Demand for Escalation',
    detail:
      'After China\'s intervention, MacArthur pushed for a dramatically expanded war: bomb Chinese supply bases in Manchuria, blockade the Chinese coast, "unleash" Chiang Kai-shek\'s Nationalist forces on Taiwan to invade mainland China, and — most alarming — use nuclear weapons against Chinese cities. He publicly argued that there was "no substitute for victory" and that limiting the war was appeasement. MacArthur essentially wanted to start World War III with China, and potentially the Soviet Union, over the Korean peninsula.',
  },
  {
    label: 'Truman\'s Case for Limited War',
    detail:
      'President Truman and the Joint Chiefs saw the bigger picture: Korea was a sideshow compared to the defense of Western Europe against the Soviet Union. Escalating the war risked a Soviet entry (the USSR had a mutual defense treaty with China), which could trigger nuclear war. Truman\'s strategy — fight a limited war, contain communism in Korea, and avoid global conflict — was unglamorous but rational. He later wrote: "I fired him because he wouldn\'t respect the authority of the President... I didn\'t fire him because he was a dumb son of a bitch, although he was."',
  },
  {
    label: 'The Firing — April 11, 1951',
    detail:
      'When MacArthur publicly contradicted the President\'s policy by issuing an unauthorized ultimatum to China and writing a letter to Republican House leader Joseph Martin criticizing the administration\'s strategy, Truman had had enough. On April 11, 1951, he relieved MacArthur of all commands. The political firestorm was immense: MacArthur returned to the US to a hero\'s welcome, addressed Congress with his famous "old soldiers never die" speech, and briefly seemed like a presidential contender. Truman\'s approval rating plunged to 22% — the lowest ever recorded for a sitting president.',
  },
  {
    label: 'Legacy: Civilian Control of the Military',
    detail:
      'The MacArthur affair established one of the most important principles in American democracy: the military answers to civilian leadership, period. A general — no matter how famous, brilliant, or popular — does not make foreign policy. When Senate hearings examined MacArthur\'s proposals, General Omar Bradley delivered the decisive judgment: a wider war with China would be "the wrong war, at the wrong place, at the wrong time, and with the wrong enemy." MacArthur faded from public life. Truman\'s reputation, savaged at the time, has been rehabilitated by history.',
  },
];

// ── Key Battles ─────────────────────────────────────────────────────────────

const BATTLES_TIMELINE: TimelineEntry[] = [
  {
    year: 'July 5, 1950',
    title: 'Battle of Osan — The First Shock',
    description:
      'Task Force Smith, the first US ground unit in Korea, was overrun by North Korean armor and infantry. Of 540 men, nearly 180 were killed, wounded, or captured. The battle exposed the dangerous unpreparedness of post-WWII American forces and shattered the illusion that the mere presence of US troops would deter the North Koreans.',
    color: OLIVE,
  },
  {
    year: 'Aug–Sep 1950',
    title: 'Battle of the Pusan Perimeter',
    description:
      'A six-week fight for survival as UN forces held a rectangular pocket around the port of Pusan against continuous North Korean attacks. The battle featured desperate defensive stands along the Naktong River, with American and South Korean units often fighting while surrounded. American air superiority — B-29 bombers and carrier-based aircraft — was the critical advantage that prevented a breakthrough.',
    color: CRIMSON,
  },
  {
    year: 'Sep 15–19, 1950',
    title: 'Battle of Inchon',
    description:
      'MacArthur\'s amphibious masterstroke. 75,000 troops landed at Inchon against 30-foot tides and fortified seawalls. The 1st Marine Division fought through the port city while the 7th Infantry Division swung inland. Within days, the North Korean army\'s supply lines were severed. The landing is studied at military academies worldwide as one of the most audacious amphibious operations since D-Day.',
    color: BLUE,
  },
  {
    year: 'Sep 22–28, 1950',
    title: 'Second Battle of Seoul',
    description:
      'After Inchon, Marines fought block by block to recapture Seoul from entrenched North Korean defenders. The battle was brutal urban combat: barricades, snipers, and fortified buildings had to be cleared systematically. The city suffered massive destruction. MacArthur declared Seoul liberated on September 29, though fighting continued for days. It was one of four times Seoul changed hands during the war.',
    color: INDIGO,
  },
  {
    year: 'Nov 1–2, 1950',
    title: 'Battle of Unsan — The Chinese Announce Themselves',
    description:
      'The US 8th Cavalry Regiment was ambushed and virtually destroyed at Unsan by Chinese forces in their first major engagement of the war. Chinese soldiers attacked with bugles, whistles, and overwhelming numbers in a nighttime assault. Nearly 600 Americans were killed or captured. The battle was a clear warning of massive Chinese involvement, but MacArthur\'s headquarters dismissed it as intervention by scattered "volunteers."',
    color: RED,
  },
  {
    year: 'Nov 27–Dec 13, 1950',
    title: 'Battle of Chosin Reservoir (Frozen Chosin)',
    description:
      'The most legendary battle of the war. 15,000 US and British Marines and soldiers, surrounded by 120,000 Chinese troops in temperatures reaching -35°F, fought a 78-mile fighting withdrawal to the port of Hungnam. Despite catastrophic conditions — frostbite casualties exceeded combat wounds — they brought out their dead, their wounded, and their equipment. The Chosin Reservoir campaign is one of the most remarkable feats of arms in modern military history.',
    color: ICE_BLUE,
  },
  {
    year: 'Apr 22–25, 1951',
    title: 'Battle of the Imjin River',
    description:
      'The British Army\'s most significant engagement of the war. The 1st Battalion, Gloucestershire Regiment ("the Glorious Glosters") — 750 men — held their position against 27,000 Chinese soldiers for three days, buying time for the UN defense of Seoul. Only 169 Glosters escaped; 59 were killed and over 500 captured. The battle became a defining moment of British military history and demonstrated the ferocity of the Chinese spring offensive.',
    color: ROSE,
  },
  {
    year: 'Sep 13–Oct 15, 1951',
    title: 'Battle of Heartbreak Ridge',
    description:
      'A month-long fight for a fortified ridge complex in the mountains of east-central Korea. American and French troops of the 2nd Infantry Division and the French Battalion assaulted entrenched Chinese and North Korean positions in some of the war\'s most grueling combat. The ridge finally fell after repeated attacks supported by massive artillery barrages and flanking maneuvers. Over 3,700 UN casualties for a piece of terrain with no strategic value beyond its name.',
    color: BLOOD_RED,
  },
  {
    year: 'Mar–Jul 1953',
    title: 'Battle of Pork Chop Hill',
    description:
      'A series of brutal fights over a small, tactically insignificant hill that became a symbol of the war\'s futility. Chinese and American forces traded control of Pork Chop Hill multiple times in hand-to-hand fighting while armistice negotiations continued at Panmunjom just miles away. Soldiers died fighting over ground that both sides knew would be abandoned the moment the ceasefire took effect. The battle became the subject of a 1959 film starring Gregory Peck.',
    color: STEEL,
  },
  {
    year: 'Jul 13–20, 1953',
    title: 'Battle of Kumsong — The Final Offensive',
    description:
      'In the war\'s last major battle, Chinese forces launched a massive assault against South Korean positions along the Kumsong River salient, just two weeks before the armistice. An estimated 80,000 Chinese troops overran several South Korean divisions, inflicting over 14,000 casualties. The attack was partly aimed at strengthening China\'s negotiating position and partly at punishing South Korean President Syngman Rhee, who had sabotaged peace talks by unilaterally releasing North Korean POWs.',
    color: AMBER,
  },
];

// ── Chosin Reservoir ────────────────────────────────────────────────────────

const CHOSIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Trap',
    detail:
      'In late November 1950, as UN forces advanced toward the Yalu River, the 1st Marine Division and elements of the US 7th Infantry Division moved along a single narrow mountain road to the Chosin (Changjin) Reservoir in northeastern North Korea. Unbeknownst to them, ten Chinese divisions — approximately 120,000 troops — had infiltrated the mountains around the reservoir. On the night of November 27, in temperatures of -35°F (-37°C), the Chinese attacked simultaneously along the entire 78-mile road from Yudam-ni to the port of Hungnam. The Marines were cut off, surrounded, and outnumbered roughly 8 to 1.',
  },
  {
    label: '"Attacking in a Different Direction"',
    detail:
      'When a reporter asked Major General Oliver P. Smith, commander of the 1st Marine Division, about the retreat, Smith replied: "Retreat, hell! We\'re not retreating. We\'re just attacking in a different direction." It was more than bravado — it was doctrine. The Marines refused to abandon their dead or wounded, destroyed enemy forces in their path, and fought their way south through a gauntlet of Chinese ambushes, blown bridges, and mountain passes. At one critical point, an Air Force C-119 dropped bridge sections by parachute to span a 1,500-foot chasm where the Chinese had destroyed the road.',
  },
  {
    label: 'The Cold Was the Real Enemy',
    detail:
      'The Chosin Reservoir campaign was fought in some of the coldest conditions ever endured by American troops. Temperatures dropped to -35°F at night. Weapons froze and jammed; morphine syrettes had to be thawed in medics\' mouths before injection; blood plasma froze solid; vehicle batteries died; C-rations were rock-hard bricks. Frostbite casualties exceeded combat wounds. Men lost fingers, toes, feet. Many who survived carried the physical consequences for the rest of their lives. The Chinese suffered even worse — their troops had inadequate winter clothing, and an estimated 30,000 Chinese soldiers died from cold alone.',
  },
  {
    label: 'The Hungnam Evacuation',
    detail:
      'The fighting withdrawal ended at the port of Hungnam, where the Navy orchestrated one of the largest military evacuations in history. Over 14 days in December 1950, 105,000 military personnel, 91,000 Korean civilian refugees, 17,500 vehicles, and 350,000 tons of supplies were loaded onto ships and evacuated by sea. The SS Meredith Victory, a cargo ship designed for 12 passengers, carried 14,000 Korean refugees to safety in a single voyage — the largest single-ship evacuation in history. The Marines had fought their way out, but at a cost: 718 killed, 3,508 wounded, and 7,338 frostbite casualties among US forces alone.',
  },
];

// ── Armistice ───────────────────────────────────────────────────────────────

const ARMISTICE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Not a Peace Treaty — Still Technically at War',
    detail:
      'The armistice signed at Panmunjom on July 27, 1953, was a ceasefire agreement, not a peace treaty. It stopped the fighting but did not end the war. South Korean President Syngman Rhee refused to sign, believing the war should continue until Korea was unified. Technically, North and South Korea — and the UN forces — remain in a state of war more than 70 years later. The armistice was signed by the UN Command, the Korean People\'s Army, and the Chinese People\'s Volunteers. The two Koreas have never signed a peace agreement.',
  },
  {
    label: 'The DMZ — Most Dangerous Border on Earth',
    detail:
      'The armistice created the Korean Demilitarized Zone (DMZ): a 2.5-mile-wide buffer zone stretching 160 miles across the peninsula, roughly following the 38th parallel. Despite its name, the DMZ is one of the most heavily militarized borders on Earth, lined with landmines, razor wire, guard towers, artillery positions, and roughly two million soldiers on both sides. The Joint Security Area at Panmunjom — where soldiers of both sides stand face-to-face — is one of the tensest places on the planet. Paradoxically, the DMZ has become an accidental nature preserve, with rare species thriving in the human-free zone.',
  },
  {
    label: 'The Human Cost — 5 Million Dead',
    detail:
      'The Korean War killed approximately 5 million people in three years — more than half of them civilians. American dead: approximately 36,574. South Korean military dead: approximately 137,899, with 373,000 wounded. North Korean military dead: estimated 215,000–350,000. Chinese military dead: estimated 180,000–400,000 (China has never released official figures). Korean civilian dead: estimated 2–3 million, split between North and South. Entire cities were obliterated. North Korea, which was more industrialized than the South before the war, was bombed so thoroughly that American pilots reported having no targets left to hit.',
  },
  {
    label: 'The POW Controversy',
    detail:
      'The armistice negotiations, which lasted two full years (longer than the mobile phase of the war), were deadlocked primarily over the prisoner of war issue. The UN side insisted on "voluntary repatriation" — POWs could choose whether to return home. Communist negotiators demanded all prisoners be returned. Of approximately 170,000 Communist POWs, roughly one-third refused repatriation — a massive propaganda embarrassment for China and North Korea. Syngman Rhee sabotaged the negotiations by unilaterally releasing 27,000 anti-communist North Korean POWs, infuriating the Chinese and nearly derailing the armistice.',
  },
];

// ── Why It's "Forgotten" ────────────────────────────────────────────────────

const FORGOTTEN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sandwiched Between Defining Conflicts',
    detail:
      'The Korean War fell between World War II — the "Greatest Generation\'s" defining triumph — and Vietnam, which tore American society apart. WWII had a clear beginning (Pearl Harbor), a clear enemy (Nazi Germany and Imperial Japan), and a clear ending (unconditional surrender). Vietnam had massive cultural impact through television coverage, protest movements, and a generation\'s disillusionment. Korea had none of these: it began with a distant invasion most Americans couldn\'t locate on a map, ended in an unsatisfying draw, and was fought largely out of sight.',
  },
  {
    label: 'No Clear Victory Narrative',
    detail:
      'Americans love a victory story. Korea offered none. The war ended roughly where it started — at the 38th parallel. There was no surrender ceremony, no liberation of death camps, no ticker-tape parade. The armistice felt like a stalemate, even though preventing the communist takeover of South Korea was arguably one of the most consequential strategic successes of the Cold War. But "we prevented something bad from happening" is a much harder story to tell than "we won."',
  },
  {
    label: 'Limited Media Coverage',
    detail:
      'Korea was the last major American war fought without extensive television coverage. While photographers and print journalists were present, the war never entered American living rooms the way Vietnam would a decade later. There were no iconic protest movements, no defining cultural moments comparable to Woodstock or the Kent State shootings. Hollywood largely ignored the war for years — apart from M*A*S*H (set in Korea but really about Vietnam) and a handful of films, the Korean War produced nothing like the cultural footprint of WWII or Vietnam.',
  },
  {
    label: '"The Forgotten War" — But Not for Korea',
    detail:
      'The war may be "forgotten" in America, but it is seared into Korean memory on both sides of the DMZ. In South Korea, the war is the foundational national experience — the moment the nation nearly died and was saved. In North Korea, the war (which they call the "Fatherland Liberation War") is the central mythology of the state, used to justify military spending, political repression, and hostility toward the United States. For Chinese families, millions know someone who fought or died in Korea. The war is "forgotten" only by the country that fought it at a comfortable distance.',
  },
];

// ── Legacy: North vs South Korea Today ──────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'South Korea — The "Miracle on the Han River"',
    detail:
      'In 1953, South Korea was one of the poorest countries on Earth — poorer than most of sub-Saharan Africa, with a per-capita GDP comparable to Ghana. Today, it is the world\'s 10th-largest economy, with a per-capita GDP of approximately $35,000, a thriving democracy (after decades of military dictatorship that ended in 1987), and a global cultural powerhouse. Samsung, Hyundai, LG, and SK are among the world\'s largest corporations. K-pop (BTS, BLACKPINK), Korean cinema (Parasite won Best Picture at the Oscars), Korean television (Squid Game), and Korean cuisine have made South Korean culture a global phenomenon. The transformation from rubble to global power in 70 years is one of the most remarkable development stories in history.',
  },
  {
    label: 'North Korea — The Hermit Kingdom',
    detail:
      'North Korea is one of the most isolated and repressive states on Earth. The Kim dynasty — Kim Il-sung (1948–1994), Kim Jong-il (1994–2011), Kim Jong-un (2011–present) — is the world\'s only communist hereditary monarchy. The state controls all media, all economic activity, and all aspects of citizens\' lives. An estimated 100,000–200,000 people are held in political prison camps. The economy is a shambles: chronic food shortages have caused periodic famines (the 1990s famine killed an estimated 600,000–2.5 million people). North Korea\'s 25 million citizens live in poverty while the regime spends its resources on nuclear weapons and the world\'s fourth-largest standing army.',
  },
  {
    label: 'The Nuclear Threat',
    detail:
      'North Korea tested its first nuclear weapon in 2006 and has since conducted six nuclear tests, developing weapons estimated at 40–60 warheads. It has also developed intercontinental ballistic missiles (ICBMs) theoretically capable of reaching the continental United States. North Korea\'s nuclear program — pursued at enormous cost while its people starve — is driven by the regime\'s conviction that nuclear weapons are the only guarantee against the fate of Saddam Hussein and Muammar Gaddafi (leaders who gave up their weapons programs and were subsequently overthrown). The North Korean nuclear crisis remains one of the most dangerous security challenges in the world.',
  },
  {
    label: '28,500 American Troops — Still There',
    detail:
      'The United States still maintains approximately 28,500 troops in South Korea — more than 70 years after the armistice. They are stationed at bases across the country, including Camp Humphreys (the largest US overseas military base in the world), and conduct regular joint exercises with South Korean forces. The US-South Korea alliance, forged in the Korean War, is one of America\'s most important security partnerships in Asia. American troops on the Korean peninsula serve as a "tripwire" — any North Korean attack would automatically involve the United States. The continued American presence is a living reminder that the Korean War never ended.',
  },
  {
    label: 'The Starkest Contrast on Earth',
    detail:
      'Satellite photographs of the Korean peninsula at night tell the whole story: South Korea blazes with light — cities, highways, industry. North Korea is almost completely dark, a black void between the glowing landscapes of South Korea and China. The two countries share the same language, the same ethnic heritage, the same 5,000-year history — but 70 years of division has created what may be the starkest contrast between any two adjacent nations on Earth. South Korea\'s life expectancy is 83 years; North Korea\'s is 72. South Korea\'s GDP per capita is roughly 50 times North Korea\'s. Families separated by the war — many now in their 90s — have never been reunited.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'General Douglas MacArthur',
    years: '1880–1964',
    contribution:
      'Supreme Commander of UN forces in Korea. Architect of the brilliant Inchon landing that reversed the war, then overreached by pushing to the Chinese border and demanding escalation after China\'s intervention. Fired by Truman in April 1951 for insubordination — a watershed moment for civilian control of the military. His career embodied both military genius and dangerous hubris.',
  },
  {
    name: 'President Harry S. Truman',
    years: '1884–1972',
    contribution:
      'Made the critical decisions: committing US forces to Korea, authorizing the crossing of the 38th parallel, firing MacArthur, and keeping the war limited to avoid WWIII. Deeply unpopular at the time, Truman\'s Korea decisions are now largely vindicated by history. His insistence on civilian control of the military and restraint in the nuclear age set essential precedents.',
  },
  {
    name: 'Kim Il-sung',
    years: '1912–1994',
    contribution:
      'Founder of North Korea and instigator of the Korean War. A former anti-Japanese guerrilla installed by the Soviets, he convinced Stalin to support the invasion of the South. After the war, he built the world\'s most extreme personality cult and totalitarian state. His Juche ideology of national self-reliance became state religion. He is still officially the "Eternal President" of North Korea decades after his death.',
  },
  {
    name: 'Syngman Rhee',
    years: '1875–1965',
    contribution:
      'First president of South Korea. An aging exile installed with US backing, he was fiercely anti-communist but authoritarian — suppressing opposition, rigging elections, and overseeing massacres of suspected leftists. He nearly sabotaged the armistice by releasing North Korean POWs. He ruled until 1960, when a student revolution forced him into exile in Hawaii.',
  },
  {
    name: 'General Matthew Ridgway',
    years: '1895–1993',
    contribution:
      'The general who saved the Korean War. Taking command of the demoralized Eighth Army after the Chinese intervention, Ridgway restored fighting spirit, developed tactics to counter Chinese mass attacks, and launched the methodical counteroffensives that stabilized the front. He later replaced MacArthur as Supreme Commander. Many historians consider him one of the finest combat commanders in American history.',
  },
  {
    name: 'Mao Zedong',
    years: '1893–1976',
    contribution:
      'Made the fateful decision to intervene in Korea, sending hundreds of thousands of Chinese "volunteers" that transformed the war. His son, Mao Anying, was killed by an American airstrike in Korea. China\'s intervention saved North Korea from destruction and established China as a major military power, but at enormous cost — an estimated 180,000–400,000 Chinese soldiers died.',
  },
  {
    name: 'General Oliver P. Smith',
    years: '1893–1977',
    contribution:
      'Commander of the 1st Marine Division at Chosin Reservoir. His insistence on advancing cautiously — against MacArthur\'s orders to rush north — saved his division when the Chinese attacked. His methodical preparation of supply dumps and airstrips along the route made the fighting withdrawal possible. His famous quote about "attacking in a different direction" became the Chosin motto.',
  },
  {
    name: 'General Walton Walker',
    years: '1889–1950',
    contribution:
      'Commander of the Eighth Army who held the Pusan Perimeter in the war\'s desperate early months. His "stand or die" order rallied the defense. A tough, aggressive World War II veteran (he had served under Patton), Walker was killed in a jeep accident on December 23, 1950, during the retreat from the Chinese offensive. He was replaced by Ridgway.',
  },
  {
    name: 'General Peng Dehuai',
    years: '1898–1974',
    contribution:
      'Commander of the Chinese People\'s Volunteer Army in Korea. A veteran communist general, Peng planned and executed the massive Chinese interventions that drove UN forces out of North Korea. His forces suffered enormous casualties from UN firepower but achieved China\'s strategic objective of preserving North Korea. Peng later fell from power for criticizing Mao\'s Great Leap Forward and died during the Cultural Revolution.',
  },
  {
    name: 'Colonel Lewis "Chesty" Puller',
    years: '1898–1971',
    contribution:
      'The most decorated Marine in US history, commanding the 1st Marine Regiment at Chosin Reservoir. When told his regiment was surrounded by eight Chinese divisions, Puller reportedly said: "Good. Now we can fire in any direction." His legendary toughness and leadership under impossible conditions made him the embodiment of Marine Corps spirit. Five Navy Crosses — no one else has more than two.',
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
    <section
      id={id}
      style={{
        padding: '48px 0',
        borderTop: `1px solid ${accentColor}33`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 12,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.7,
            maxWidth: 800,
            marginBottom: 28,
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

const FIGURE_COLORS = [MILITARY_GREEN, BLUE, CRIMSON, STEEL, GREEN, RED, ICE_BLUE, AMBER, ROSE, GOLD];

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

export default function KoreanWarPage() {
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
              background: `linear-gradient(135deg, ${MILITARY_GREEN}, ${ICE_BLUE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Korean War — The Forgotten War That Shaped Modern Asia (1950–1953)
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
              5 million dead. The peninsula still divided 70+ years later. Yet
              Americans barely know it happened. Sandwiched between the
              triumphant narrative of World War II and the cultural upheaval of
              Vietnam, the Korean War is the conflict that shaped modern East
              Asia — and the one nobody talks about.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              It was the first hot war of the Cold War, the first UN military
              action, the war that nearly went nuclear, and the reason 28,500
              American troops are still stationed on the Korean peninsula today.
              It created the starkest contrast between any two nations on
              Earth: a democratic, $35,000-per-capita South Korea and a
              nuclear-armed hereditary dictatorship in the North. This is the
              story of how one peninsula became two worlds.
            </p>
          </motion.div>
        </header>

        {/* ── Background ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="background"
          icon="🗺️"
          title="Korea Before the War — Occupation, Division, and Two Dictators"
          accentColor={AMBER}
          intro="To understand why two Korean armies faced each other across the 38th parallel in 1950, you must understand the 45 years that preceded the war: a brutal Japanese occupation, an arbitrary Cold War partition, and the emergence of two authoritarian governments — each claiming to represent all Koreans, each prepared to kill to prove it."
        >
          <InsightGrid items={BACKGROUND_INSIGHTS} />
        </SectionWrapper>

        {/* ── The War Begins ───────────────────────────────────────────── */}
        <SectionWrapper
          id="war-begins"
          icon="💥"
          title="The War Begins — June 25, 1950"
          accentColor={CRIMSON}
          intro="The North Korean invasion caught the world by surprise. Within days, the United Nations authorized military action — a vote that succeeded only because the Soviet Union was boycotting the Security Council. What began as a civil war between two Korean states became a proxy war between the world's superpowers, fought on a mountainous peninsula most Americans couldn't find on a map."
        >
          <TimelineCard entries={WAR_BEGINS_TIMELINE} />
        </SectionWrapper>

        {/* ── The Roller Coaster War ───────────────────────────────────── */}
        <SectionWrapper
          id="roller-coaster"
          icon="🎢"
          title="The Roller Coaster War — A Front That Moved 600 Miles"
          accentColor={BLUE}
          intro="No modern war saw such dramatic reversals of fortune. In six months, the front line swung from the southern tip of Korea to the Chinese border and back again — 600 miles of advance and retreat that left millions dead and cities in ruins. Then it froze, and the killing continued for two more years over hilltops and ridgelines that barely moved."
        >
          <TimelineCard entries={ROLLER_COASTER_TIMELINE} />
        </SectionWrapper>

        {/* ── The MacArthur Controversy ─────────────────────────────────── */}
        <SectionWrapper
          id="macarthur"
          icon="⭐"
          title="The MacArthur Controversy — A General vs. the President"
          accentColor={GOLD}
          intro="The clash between General Douglas MacArthur and President Harry Truman was more than a personality conflict — it was a constitutional crisis that tested whether a democracy could fight a limited war. MacArthur wanted total victory, even at the risk of World War III. Truman wanted to avoid nuclear catastrophe. Only one of them could be right."
        >
          <InsightGrid items={MACARTHUR_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Battles ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="battles"
          icon="⚔️"
          title="Key Battles of the Korean War"
          accentColor={MILITARY_GREEN}
          intro="From desperate last stands to audacious amphibious landings to pointless hilltop fights while peace talks dragged on, the Korean War's battles ranged from brilliant to tragic to absurd. These are the engagements that defined the war."
        >
          <TimelineCard entries={BATTLES_TIMELINE} />
        </SectionWrapper>

        {/* ── Chosin Reservoir ──────────────────────────────────────────── */}
        <SectionWrapper
          id="chosin"
          icon="🥶"
          title="The Chosin Reservoir — Frozen Chosin"
          accentColor={ICE_BLUE}
          intro="If the Korean War has one legendary battle, it is Chosin. In late November 1950, 15,000 US and UN troops found themselves surrounded by 120,000 Chinese soldiers in the frozen mountains of North Korea, in temperatures of -35°F. What followed — a 78-mile fighting withdrawal through enemy ambushes and impassable terrain — is one of the most remarkable military feats in modern history."
        >
          <InsightGrid items={CHOSIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Armistice ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="armistice"
          icon="🕊️"
          title="The Armistice — July 27, 1953"
          accentColor={STEEL}
          intro="After two years of trench warfare and two years of negotiations, the guns finally fell silent on July 27, 1953. But the armistice was not a peace treaty — it was a ceasefire that left the peninsula divided, the armies in place, and the war technically unfinished. It remains unfinished today."
        >
          <InsightGrid items={ARMISTICE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Why It's "Forgotten" ─────────────────────────────────────── */}
        <SectionWrapper
          id="forgotten"
          icon="❓"
          title="Why America's 'Forgotten War'?"
          accentColor={PURPLE}
          intro="The Korean War killed more than 36,000 Americans, lasted three years, and fundamentally shaped the Cold War — yet most Americans know almost nothing about it. The Korean War Memorial in Washington, D.C. was not dedicated until 1995, 42 years after the armistice. Why did a war of this scale vanish from national memory?"
        >
          <InsightGrid items={FORGOTTEN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🌏"
          title="Legacy — Two Koreas, One Unfinished War"
          accentColor={GREEN}
          intro="The Korean War's most visible legacy is visible from space: satellite photographs of the peninsula at night show a blazing South Korea and a nearly pitch-black North. Same people, same history, same language — but 70 years of division created two nations so different they might as well be on separate planets."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures of the Korean War"
          accentColor={GOLD}
          intro="The Korean War was shaped by presidents and dictators, brilliant generals and reckless ones, and ordinary soldiers who endured extraordinary conditions. These are the people whose decisions and sacrifices defined the conflict."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
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
            "Freedom is not free."
            — Inscription on the Korean War Veterans Memorial, Washington, D.C.
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
