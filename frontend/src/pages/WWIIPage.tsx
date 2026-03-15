/**
 * WWIIPage — "World War II: The Global Conflict (1939–1945)"
 *
 * Route: /wwii
 *
 * Sections:
 *  1. Hero — title + tagline
 *  2. Tab navigation between sections
 *  3. Timeline — year-by-year (1939–1945)
 *  4. Causes — Treaty of Versailles, fascism, appeasement
 *  5. Theaters — European (Western, Eastern, North Africa), Pacific
 *  6. Key Battles — 15+ with dates, combatants, casualties, significance
 *  7. Key Figures — 10 leaders with roles and decisions
 *  8. Holocaust — chronology, scale, liberation
 *  9. Statistics — casualties by nation, military vs civilian
 * 10. Aftermath — Marshall Plan, UN, Iron Curtain, Nuremberg, decolonization
 * 11. Technology — radar, nuclear, jets, penicillin
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Section =
  | 'TIMELINE'
  | 'CAUSES'
  | 'THEATERS'
  | 'BATTLES'
  | 'FIGURES'
  | 'HOLOCAUST'
  | 'STATISTICS'
  | 'AFTERMATH'
  | 'TECHNOLOGY';

interface TimelineEvent {
  year: number;
  month?: string;
  title: string;
  detail: string;
}

interface Battle {
  name: string;
  dates: string;
  theater: string;
  combatants: [string, string];
  casualties: string;
  significance: string;
}

interface Figure {
  name: string;
  nation: string;
  role: string;
  keyDecision: string;
}

interface CasualtyData {
  nation: string;
  military: number;
  civilian: number;
}

interface TechInnovation {
  name: string;
  year: string;
  description: string;
  impact: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Color palette — somber, authoritative
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  bg: '#1a1a2e',
  bgCard: '#16213e',
  bgCardAlt: '#0f3460',
  navy: '#16213e',
  navyLight: '#1a3a5c',
  red: '#8b0000',
  redAccent: '#c23616',
  gold: '#d4a84b',
  text: '#e0e0e0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.12)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<Section, string> = {
  TIMELINE: 'Timeline',
  CAUSES: 'Causes',
  THEATERS: 'Theaters',
  BATTLES: 'Key Battles',
  FIGURES: 'Key Figures',
  HOLOCAUST: 'The Holocaust',
  STATISTICS: 'Casualties',
  AFTERMATH: 'Aftermath',
  TECHNOLOGY: 'Technology',
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  // 1939
  { year: 1939, month: 'Mar', title: 'Germany annexes Czechoslovakia', detail: 'Hitler violates the Munich Agreement, occupying the remainder of Czechoslovakia and demonstrating the failure of appeasement.' },
  { year: 1939, month: 'Aug', title: 'Molotov–Ribbentrop Pact', detail: 'Nazi Germany and the Soviet Union sign a non-aggression pact with secret protocols dividing Eastern Europe into spheres of influence.' },
  { year: 1939, month: 'Sep', title: 'Invasion of Poland', detail: 'Germany invades Poland on September 1. Britain and France declare war on September 3. World War II begins in Europe.' },
  { year: 1939, month: 'Sep', title: 'Soviet invasion of Poland', detail: 'The USSR invades eastern Poland on September 17 under the secret protocol. Poland is partitioned between Germany and the Soviet Union.' },
  // 1940
  { year: 1940, month: 'Apr', title: 'Invasion of Denmark and Norway', detail: 'Germany launches Operation Weserübung, rapidly conquering Denmark and Norway to secure iron ore supply routes and naval bases.' },
  { year: 1940, month: 'May', title: 'Fall of France', detail: 'Germany\'s Blitzkrieg through the Ardennes bypasses the Maginot Line. France falls in six weeks; the Dunkirk evacuation saves 338,000 Allied troops.' },
  { year: 1940, month: 'Jul', title: 'Battle of Britain begins', detail: 'The Luftwaffe launches a sustained bombing campaign against Britain. The RAF\'s defense — aided by radar and Ultra decrypts — prevents a German invasion.' },
  { year: 1940, month: 'Sep', title: 'Tripartite Pact', detail: 'Germany, Italy, and Japan formalize the Axis alliance, pledging mutual assistance and dividing spheres of conquest.' },
  { year: 1940, month: 'Nov', title: 'Hungary, Romania, Slovakia join Axis', detail: 'The Axis expands as Southeastern European states align with Germany under economic and military pressure.' },
  // 1941
  { year: 1941, month: 'Feb', title: 'North Africa — Rommel arrives', detail: 'Erwin Rommel and the Afrika Korps arrive in Libya, beginning a two-year desert campaign against British and Commonwealth forces.' },
  { year: 1941, month: 'Mar', title: 'Lend-Lease Act', detail: 'The US begins supplying Britain, China, and later the USSR with war material — a crucial lifeline before American entry into the war.' },
  { year: 1941, month: 'Jun', title: 'Operation Barbarossa', detail: 'Germany invades the Soviet Union with 3.8 million troops — the largest military operation in history. Initial gains are enormous but Moscow holds.' },
  { year: 1941, month: 'Dec', title: 'Attack on Pearl Harbor', detail: 'Japan launches a surprise attack on the US Pacific Fleet at Pearl Harbor, Hawaii. The US enters the war the next day.' },
  { year: 1941, month: 'Dec', title: 'Germany declares war on the US', detail: 'Hitler declares war on the United States, uniting the full Allied coalition against the Axis powers.' },
  // 1942
  { year: 1942, month: 'Jan', title: 'Wannsee Conference', detail: 'Senior Nazi officials meet to coordinate the "Final Solution" — the systematic extermination of European Jews in death camps.' },
  { year: 1942, month: 'Feb', title: 'Fall of Singapore', detail: 'Japan captures Singapore from the British — Churchill calls it "the worst disaster in British military history." 80,000 troops surrender.' },
  { year: 1942, month: 'Jun', title: 'Battle of Midway', detail: 'The US Navy sinks four Japanese aircraft carriers, turning the tide of the Pacific War. Japan\'s offensive capability is permanently crippled.' },
  { year: 1942, month: 'Aug', title: 'Battle of Stalingrad begins', detail: 'The Wehrmacht pushes into Stalingrad. What follows is the bloodiest battle in human history — a turning point of the entire war.' },
  { year: 1942, month: 'Oct', title: 'Second Battle of El Alamein', detail: 'Montgomery\'s Eighth Army defeats Rommel in Egypt. Churchill: "Before Alamein we never had a victory. After Alamein we never had a defeat."' },
  // 1943
  { year: 1943, month: 'Feb', title: 'German surrender at Stalingrad', detail: 'The encircled German 6th Army surrenders. 800,000 Axis casualties. The myth of Wehrmacht invincibility is shattered.' },
  { year: 1943, month: 'May', title: 'Axis surrender in North Africa', detail: 'The last Axis forces in Tunisia surrender. 250,000 troops captured. The Allies now control the Mediterranean.' },
  { year: 1943, month: 'Jul', title: 'Battle of Kursk', detail: 'The largest tank battle in history. The Soviet victory ends Germany\'s ability to launch major offensives on the Eastern Front.' },
  { year: 1943, month: 'Jul', title: 'Allied invasion of Sicily', detail: 'Operation Husky begins the Allied invasion of Italy. Mussolini is deposed; Italy will switch sides in September.' },
  { year: 1943, month: 'Nov', title: 'Tehran Conference', detail: 'Roosevelt, Churchill, and Stalin meet for the first time, agreeing on the Normandy invasion and the post-war shape of Europe.' },
  // 1944
  { year: 1944, month: 'Jan', title: 'Siege of Leningrad ends', detail: 'After 872 days, the deadliest siege in history ends. An estimated 1.5 million civilians and soldiers died defending the city.' },
  { year: 1944, month: 'Jun', title: 'D-Day — Normandy invasion', detail: 'On June 6, 156,000 Allied troops land on five beaches in Normandy. The largest amphibious invasion in history opens the Western Front.' },
  { year: 1944, month: 'Jun', title: 'Battle of the Philippine Sea', detail: 'The "Great Marianas Turkey Shoot" — the US destroys Japanese naval aviation. Japan loses 3 carriers and nearly 500 aircraft.' },
  { year: 1944, month: 'Jul', title: 'July 20 plot', detail: 'German officers attempt to assassinate Hitler with a briefcase bomb. The plot fails; thousands are executed in retaliation.' },
  { year: 1944, month: 'Aug', title: 'Liberation of Paris', detail: 'Free French forces and US troops liberate Paris after four years of German occupation. De Gaulle leads a triumphal march down the Champs-Élysées.' },
  { year: 1944, month: 'Oct', title: 'Battle of Leyte Gulf', detail: 'The largest naval battle in history. The US secures the Philippines; Japan introduces kamikaze tactics in desperation.' },
  { year: 1944, month: 'Dec', title: 'Battle of the Bulge', detail: 'Germany\'s last major offensive in the West. Despite initial surprise, the Allies recover. German reserves are exhausted.' },
  // 1945
  { year: 1945, month: 'Jan', title: 'Liberation of Auschwitz', detail: 'Soviet troops liberate Auschwitz-Birkenau, finding 7,000 emaciated survivors. The full horror of the Holocaust begins to emerge.' },
  { year: 1945, month: 'Feb', title: 'Yalta Conference', detail: 'Roosevelt, Churchill, and Stalin plan the post-war order: occupation zones for Germany, Soviet entry into the Pacific war, and the United Nations.' },
  { year: 1945, month: 'Feb', title: 'Battle of Iwo Jima', detail: 'Marines fight for 36 days to capture this volcanic island. The iconic flag-raising on Mount Suribachi becomes a symbol of American resolve.' },
  { year: 1945, month: 'Mar', title: 'Firebombing of Tokyo', detail: 'B-29 bombers destroy 16 square miles of Tokyo in a single night, killing an estimated 100,000 civilians — the deadliest air raid in history.' },
  { year: 1945, month: 'Apr', title: 'Battle of Berlin', detail: 'The Soviet Army storms Berlin with 2.5 million troops. Hitler commits suicide on April 30. The Third Reich collapses.' },
  { year: 1945, month: 'May', title: 'V-E Day', detail: 'Germany surrenders unconditionally on May 8. The war in Europe is over after nearly six years and tens of millions of deaths.' },
  { year: 1945, month: 'Jun', title: 'Battle of Okinawa ends', detail: 'After 82 days, the bloodiest Pacific battle ends. 12,000 Americans, 110,000 Japanese soldiers, and 100,000+ Okinawan civilians die.' },
  { year: 1945, month: 'Jul', title: 'Trinity nuclear test', detail: 'The first atomic bomb is detonated in New Mexico. Oppenheimer quotes the Bhagavad Gita: "Now I am become Death, the destroyer of worlds."' },
  { year: 1945, month: 'Aug', title: 'Atomic bombings of Hiroshima and Nagasaki', detail: 'The US drops atomic bombs on Hiroshima (Aug 6, ~80,000 immediate deaths) and Nagasaki (Aug 9, ~40,000). Japan agrees to surrender.' },
  { year: 1945, month: 'Sep', title: 'V-J Day — Japan surrenders', detail: 'Japan formally surrenders aboard USS Missouri on September 2, 1945. World War II ends. The world has been fundamentally changed.' },
];

const BATTLES: Battle[] = [
  { name: 'Battle of Britain', dates: 'Jul–Oct 1940', theater: 'Western Europe', combatants: ['United Kingdom', 'Germany'], casualties: '~44,000 RAF & civilian; ~2,500 Luftwaffe aircrew', significance: 'First major defeat of the Luftwaffe. Prevented German invasion of Britain and preserved the Western Allies\' base of operations.' },
  { name: 'Siege of Leningrad', dates: 'Sep 1941–Jan 1944', theater: 'Eastern Front', combatants: ['Soviet Union', 'Germany / Finland'], casualties: '~1.5 million dead (mostly civilian starvation)', significance: 'The deadliest siege in history. Soviet resistance tied down Army Group North for 872 days.' },
  { name: 'Battle of Moscow', dates: 'Oct 1941–Jan 1942', theater: 'Eastern Front', combatants: ['Soviet Union', 'Germany'], casualties: '~650,000 Soviet; ~300,000 German', significance: 'First major German defeat. Proved the Wehrmacht could be stopped and prevented a rapid Soviet collapse.' },
  { name: 'Battle of Midway', dates: 'Jun 4–7, 1942', theater: 'Pacific', combatants: ['United States', 'Japan'], casualties: '~300 US; ~3,000 Japanese + 4 carriers', significance: 'Turning point of the Pacific War. Destroyed Japan\'s offensive carrier capability six months after Pearl Harbor.' },
  { name: 'Battle of Stalingrad', dates: 'Aug 1942–Feb 1943', theater: 'Eastern Front', combatants: ['Soviet Union', 'Germany / Romania / Italy'], casualties: '~1.2 million Soviet; ~800,000 Axis', significance: 'Bloodiest battle in human history. The German 6th Army\'s destruction marked the strategic turning point of the Eastern Front.' },
  { name: 'Second Battle of El Alamein', dates: 'Oct–Nov 1942', theater: 'North Africa', combatants: ['United Kingdom / Commonwealth', 'Germany / Italy'], casualties: '~13,500 Allied; ~30,000 Axis', significance: 'Decisive British victory that ended the Axis threat to Egypt and the Suez Canal. Beginning of the end in North Africa.' },
  { name: 'Battle of Guadalcanal', dates: 'Aug 1942–Feb 1943', theater: 'Pacific', combatants: ['United States / Australia', 'Japan'], casualties: '~7,100 Allied; ~31,000 Japanese', significance: 'First major Allied offensive in the Pacific. Proved the Allies could take and hold territory from Japan.' },
  { name: 'Battle of Kursk', dates: 'Jul 5–Aug 23, 1943', theater: 'Eastern Front', combatants: ['Soviet Union', 'Germany'], casualties: '~254,000 Soviet; ~200,000 German', significance: 'Largest tank battle in history (~6,000 tanks). Ended Germany\'s ability to launch major offensives in the East.' },
  { name: 'Battle of the Atlantic', dates: '1939–1945', theater: 'Atlantic Ocean', combatants: ['United Kingdom / US / Canada', 'Germany (U-boats)'], casualties: '~36,000 Allied sailors; ~30,000 U-boat crew', significance: 'The longest continuous campaign. Allied victory ensured the supply lines that sustained Britain and enabled D-Day.' },
  { name: 'D-Day (Operation Overlord)', dates: 'Jun 6, 1944', theater: 'Western Europe', combatants: ['USA / UK / Canada / Free French', 'Germany'], casualties: '~10,000 Allied on D-Day; ~9,000 German', significance: 'Largest amphibious invasion in history. Opened the Western Front and began the liberation of France and Western Europe.' },
  { name: 'Battle of the Philippine Sea', dates: 'Jun 19–20, 1944', theater: 'Pacific', combatants: ['United States', 'Japan'], casualties: '~100 US; ~3,000 Japanese + 3 carriers', significance: 'The "Great Marianas Turkey Shoot" destroyed Japanese naval aviation as an effective fighting force.' },
  { name: 'Battle of Leyte Gulf', dates: 'Oct 23–26, 1944', theater: 'Pacific', combatants: ['United States / Australia', 'Japan'], casualties: '~3,000 Allied; ~12,500 Japanese + 4 carriers', significance: 'Largest naval battle in history by tonnage. Secured the Philippines and crippled the Japanese surface fleet.' },
  { name: 'Battle of the Bulge', dates: 'Dec 1944–Jan 1945', theater: 'Western Europe', combatants: ['USA / UK / Belgium', 'Germany'], casualties: '~90,000 US; ~100,000 German', significance: 'Germany\'s last major offensive. Its failure exhausted German reserves and accelerated the collapse of the Western Front.' },
  { name: 'Battle of Iwo Jima', dates: 'Feb 19–Mar 26, 1945', theater: 'Pacific', combatants: ['United States', 'Japan'], casualties: '~6,800 US dead; ~18,000 Japanese dead', significance: 'Secured a crucial airfield for B-29 bomber escorts. The flag-raising on Suribachi became an iconic image of American sacrifice.' },
  { name: 'Battle of Okinawa', dates: 'Apr 1–Jun 22, 1945', theater: 'Pacific', combatants: ['United States / UK', 'Japan'], casualties: '~12,500 US; ~110,000 Japanese; ~100,000+ Okinawan civilians', significance: 'Bloodiest Pacific battle. The staggering casualties influenced the decision to use atomic bombs rather than invade the Japanese mainland.' },
  { name: 'Battle of Berlin', dates: 'Apr 16–May 2, 1945', theater: 'Eastern Front', combatants: ['Soviet Union', 'Germany'], casualties: '~81,000 Soviet; ~92,000 German military + unknown civilians', significance: 'The final major European battle. Soviet capture of Berlin ended the Third Reich and concluded the war in Europe.' },
];

const KEY_FIGURES: Figure[] = [
  { name: 'Winston Churchill', nation: '🇬🇧 United Kingdom', role: 'Prime Minister (1940–1945)', keyDecision: 'Refused to negotiate with Hitler after the Fall of France, rallying Britain to fight on alone. His speeches galvanized a nation: "We shall fight on the beaches."' },
  { name: 'Franklin D. Roosevelt', nation: '🇺🇸 United States', role: 'President (1933–1945)', keyDecision: 'Guided the US from isolationism to full war mobilization. The Lend-Lease program sustained the Allies before Pearl Harbor. Led planning for D-Day and the post-war order before dying in April 1945.' },
  { name: 'Joseph Stalin', nation: '🇷🇺 Soviet Union', role: 'General Secretary / Supreme Commander', keyDecision: 'Despite catastrophic early losses from his own purges of the officer corps, refused to abandon Moscow in 1941. The Soviet mobilization and Eastern Front consumed 80% of German military strength.' },
  { name: 'Adolf Hitler', nation: '🇩🇪 Germany', role: 'Führer and Supreme Commander', keyDecision: 'His decision to invade the Soviet Union (Operation Barbarossa) and declare war on the US created an unwinnable two-front war. Increasingly erratic command decisions accelerated Germany\'s defeat.' },
  { name: 'Dwight D. Eisenhower', nation: '🇺🇸 United States', role: 'Supreme Allied Commander Europe', keyDecision: 'Made the fateful decision to launch D-Day on June 6 despite marginal weather. Managed the competing egos of Allied commanders and coordinated the largest military operation in history.' },
  { name: 'George S. Patton', nation: '🇺🇸 United States', role: 'General, US Third Army', keyDecision: 'Led the rapid breakout from Normandy and the relief of Bastogne during the Battle of the Bulge. His aggressive armored tactics liberated more territory faster than any Allied commander.' },
  { name: 'Erwin Rommel', nation: '🇩🇪 Germany', role: 'Field Marshal, "The Desert Fox"', keyDecision: 'Commanded the Afrika Korps with tactical brilliance but was undermined by supply shortages. Later implicated in the July 20 plot against Hitler; forced to take poison.' },
  { name: 'Isoroku Yamamoto', nation: '🇯🇵 Japan', role: 'Admiral, Combined Fleet', keyDecision: 'Planned the Pearl Harbor attack, warning that Japan could "run wild for six months" but no more. His prediction proved accurate — he was killed when the US intercepted and shot down his plane in 1943.' },
  { name: 'Douglas MacArthur', nation: '🇺🇸 United States', role: 'Supreme Commander, Southwest Pacific', keyDecision: 'Orchestrated the island-hopping campaign that bypassed Japanese strongholds. His "I shall return" promise to the Philippines was fulfilled in 1944. Accepted Japan\'s formal surrender.' },
  { name: 'Georgy Zhukov', nation: '🇷🇺 Soviet Union', role: 'Marshal of the Soviet Union', keyDecision: 'Arguably the war\'s greatest general. Defended Moscow, broke the Siege of Leningrad, led the counteroffensive at Stalingrad, commanded at Kursk, and captured Berlin.' },
];

const CASUALTIES: CasualtyData[] = [
  { nation: 'Soviet Union', military: 8700000, civilian: 19000000 },
  { nation: 'China', military: 3800000, civilian: 16200000 },
  { nation: 'Germany', military: 5300000, civilian: 2000000 },
  { nation: 'Poland', military: 240000, civilian: 5620000 },
  { nation: 'Japan', military: 2120000, civilian: 580000 },
  { nation: 'Yugoslavia', military: 446000, civilian: 581000 },
  { nation: 'France', military: 210000, civilian: 390000 },
  { nation: 'United Kingdom', military: 384000, civilian: 67000 },
  { nation: 'United States', military: 407000, civilian: 12000 },
  { nation: 'Italy', military: 319000, civilian: 153000 },
  { nation: 'Hungary', military: 300000, civilian: 280000 },
  { nation: 'Romania', military: 300000, civilian: 200000 },
];

const TECH_INNOVATIONS: TechInnovation[] = [
  { name: 'Radar', year: '1935–1940', description: 'Radio detection and ranging — the ability to detect aircraft and ships at great distances using reflected radio waves.', impact: 'Decisive in the Battle of Britain, the Atlantic anti-submarine campaign, and nightfighter operations. Arguably the single most important non-nuclear technology of the war.' },
  { name: 'Nuclear Weapons', year: '1942–1945', description: 'The Manhattan Project developed the first atomic bombs through the fission of uranium-235 and plutonium-239.', impact: 'Ended the Pacific War and ushered in the nuclear age. The geopolitical consequences — the arms race, MAD doctrine, and Cold War — shaped the next half-century.' },
  { name: 'Jet Aircraft', year: '1939–1945', description: 'Germany deployed the Me 262 (first operational jet fighter) and the UK flew the Gloster Meteor. Both achieved speeds far beyond propeller aircraft.', impact: 'Too late to change the war\'s outcome, but jet technology revolutionized post-war aviation. Every modern military aircraft descends from WWII jet research.' },
  { name: 'Penicillin (Mass Production)', year: '1943', description: 'Alexander Fleming discovered penicillin in 1928, but mass production was achieved in 1943 through US-UK collaboration using deep-tank fermentation.', impact: 'Reduced deaths from infected wounds by over 90%. Saved an estimated 12–15% of Allied wounded who would have died in WWI. Launched the antibiotic revolution.' },
  { name: 'V-2 Rocket', year: '1944', description: 'The world\'s first long-range ballistic missile, designed by Wernher von Braun. Reached the edge of space during flight.', impact: 'Killed ~9,000 in London and Antwerp, but its real legacy was post-war: V-2 technology became the foundation of both the American and Soviet space programs.' },
  { name: 'Proximity Fuze', year: '1943', description: 'A miniaturized radar inside an artillery shell that detonated when close to a target — no direct hit required.', impact: 'Increased anti-aircraft effectiveness by 10x. Devastatingly effective against Japanese kamikaze attacks and German ground troops in the Bulge.' },
  { name: 'Codebreaking / Early Computers', year: '1939–1945', description: 'Bletchley Park\'s breaking of Enigma (and later Lorenz) using the Bombe and Colossus — among the world\'s first electronic computers.', impact: 'Ultra intelligence shortened the war by an estimated 2 years. Colossus pioneered concepts fundamental to modern computing.' },
  { name: 'Synthetic Rubber & Fuel', year: '1942–1945', description: 'With natural rubber supplies cut off by Japan, the US launched a crash program to produce synthetic rubber. Germany relied on synthetic fuel from coal.', impact: 'Demonstrated that industrial chemistry could substitute for scarce natural resources — a principle that reshaped post-war manufacturing.' },
];

const HOLOCAUST_TIMELINE = [
  { year: '1933', event: 'Hitler becomes Chancellor. First concentration camp opens at Dachau. Boycott of Jewish businesses.' },
  { year: '1935', event: 'Nuremberg Laws strip German Jews of citizenship and basic rights. Intermarriage banned.' },
  { year: '1938', event: 'Kristallnacht — "Night of Broken Glass." Coordinated pogroms destroy synagogues, businesses; 30,000 Jewish men sent to camps.' },
  { year: '1939', event: 'Germany invades Poland. Ghettos established — Warsaw Ghetto (400,000 people in 1.3 sq miles) becomes the largest.' },
  { year: '1941', event: 'Einsatzgruppen (mobile killing squads) follow the invasion of the USSR. Mass shootings at Babi Yar, Rumbula, and hundreds of other sites.' },
  { year: '1942', event: 'Wannsee Conference formalizes the "Final Solution." Death camps operational: Auschwitz-Birkenau, Treblinka, Sobibor, Belzec, Chelmno, Majdanek.' },
  { year: '1943', event: 'Warsaw Ghetto Uprising — Jewish fighters resist for nearly a month. Treblinka and Sobibor prisoner revolts.' },
  { year: '1944', event: 'Hungary\'s Jews deported: 437,000 sent to Auschwitz in 8 weeks. Death marches begin as camps are evacuated ahead of Soviet advance.' },
  { year: '1945', event: 'Camps liberated: Auschwitz (Jan 27), Bergen-Belsen (Apr 15), Dachau (Apr 29). The world confronts the full scale of the genocide.' },
];

const CAUSES = [
  {
    title: 'Treaty of Versailles (1919)',
    detail: 'The harsh peace terms imposed on Germany after WWI — massive reparations, territorial losses, military restrictions, and the "war guilt" clause — created deep resentment that destabilized the Weimar Republic and fueled extremist movements.',
  },
  {
    title: 'Rise of Fascism',
    detail: 'The Great Depression devastated economies worldwide. In Germany, mass unemployment and hyperinflation created fertile ground for Hitler\'s National Socialist party, which promised national renewal, scapegoated minorities, and exploited democratic weaknesses to seize power in 1933.',
  },
  {
    title: 'Appeasement Failures',
    detail: 'Britain and France, desperate to avoid another Great War, conceded to Hitler\'s demands: remilitarization of the Rhineland (1936), Anschluss with Austria (1938), and the Munich Agreement ceding Czechoslovakia\'s Sudetenland. Each concession emboldened further aggression.',
  },
  {
    title: 'Japanese Expansionism',
    detail: 'Japan invaded Manchuria (1931) and China (1937), seeking raw materials and regional dominance. Western embargoes — particularly the US oil embargo of 1941 — pushed Japan toward the decision to attack Pearl Harbor.',
  },
  {
    title: 'Failure of Collective Security',
    detail: 'The League of Nations proved powerless to prevent aggression — from Japan\'s invasion of Manchuria to Italy\'s conquest of Ethiopia. Without enforcement mechanisms, international order collapsed.',
  },
];

const AFTERMATH = [
  {
    title: 'United Nations Founded (1945)',
    detail: 'Established in October 1945 with 51 founding members, the UN replaced the failed League of Nations. The Security Council — with veto power for the US, UK, France, USSR, and China — was designed to maintain peace through collective security.',
  },
  {
    title: 'Nuremberg Trials (1945–1946)',
    detail: 'Twenty-two major Nazi leaders were tried for war crimes, crimes against humanity, and crimes against peace. Twelve were sentenced to death. The trials established the principle that individuals — not just states — bear responsibility for atrocities.',
  },
  {
    title: 'Marshall Plan (1948–1952)',
    detail: 'The US invested $13.3 billion (~$170B today) to rebuild Western European economies. The plan revived industry, expanded trade, and strengthened democratic governments — while also serving as a bulwark against Soviet expansion.',
  },
  {
    title: 'Iron Curtain & Cold War',
    detail: 'The wartime alliance between the Western Allies and the Soviet Union fractured almost immediately. Churchill\'s "Iron Curtain" speech (1946) named the division. By 1949, Europe was split into NATO and the Soviet bloc — a division that would last until 1991.',
  },
  {
    title: 'Decolonization Wave',
    detail: 'The war fatally weakened European colonial empires. India (1947), Indonesia (1949), and dozens of African and Asian nations gained independence over the following decades. The colonial order that had dominated for centuries collapsed within a generation.',
  },
  {
    title: 'Creation of Israel (1948)',
    detail: 'The Holocaust\'s aftermath intensified support for a Jewish homeland. The UN partitioned Palestine in 1947; Israel declared independence in 1948, immediately followed by war with neighboring Arab states — a conflict that continues to shape the region.',
  },
];

const THEATERS = [
  {
    name: 'Western Front',
    region: 'Western Europe',
    description: 'From the Fall of France (1940) through D-Day (1944) to V-E Day. Key campaigns: Battle of Britain, Normandy invasion, liberation of France, Battle of the Bulge, crossing of the Rhine.',
    color: '#3b82f6',
  },
  {
    name: 'Eastern Front',
    region: 'Soviet Union / Eastern Europe',
    description: 'The war\'s largest and deadliest theater. From Operation Barbarossa (1941) through Stalingrad, Kursk, and Bagration to the fall of Berlin. Over 80% of German military casualties occurred here.',
    color: '#ef4444',
  },
  {
    name: 'North Africa',
    region: 'Libya / Egypt / Tunisia / Morocco / Algeria',
    description: 'The desert war (1940–1943) between the Allies and Axis. Key battles: Tobruk, El Alamein, Kasserine Pass, Operation Torch. Victory secured the Mediterranean and provided a springboard for invading Italy.',
    color: '#d4a84b',
  },
  {
    name: 'Pacific Theater',
    region: 'Pacific Ocean / Southeast Asia / Japan',
    description: 'From Pearl Harbor (1941) through island-hopping campaigns to the atomic bombings. Key battles: Midway, Guadalcanal, Iwo Jima, Okinawa. Characterized by vast naval engagements and brutal island warfare.',
    color: '#22c55e',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
  return n.toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section style={{
      padding: '80px 32px 48px', textAlign: 'center',
      background: `linear-gradient(180deg, ${C.red}22 0%, ${C.bg} 100%)`,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <Link to="/" style={{ fontSize: 13, color: C.textDim, textDecoration: 'none' }}>
        ← Back to Chronicle
      </Link>
      <h1 style={{
        fontSize: 48, fontWeight: 800, margin: '24px 0 12px',
        background: `linear-gradient(135deg, ${C.text}, ${C.gold})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '-1px',
      }}>
        World War II
      </h1>
      <p style={{ fontSize: 20, color: C.textMuted, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
        The deadliest conflict in human history. 70–85 million dead.
        <br />Six years that reshaped the world.
      </p>
      <p style={{ fontSize: 14, color: C.textDim, marginTop: 16 }}>
        September 1, 1939 — September 2, 1945
      </p>
    </section>
  );
}

function TabNav({ active, onChange }: { active: Section; onChange: (s: Section) => void }) {
  const sections = Object.keys(SECTION_LABELS) as Section[];
  return (
    <nav style={{
      display: 'flex', flexWrap: 'wrap', gap: 4,
      padding: '16px 32px', justifyContent: 'center',
      position: 'sticky', top: 0, zIndex: 10,
      backgroundColor: C.bg, borderBottom: `1px solid ${C.border}`,
    }}>
      {sections.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          style={{
            padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            backgroundColor: active === s ? C.redAccent : 'rgba(255,255,255,0.06)',
            color: active === s ? '#fff' : C.textMuted,
          }}
        >
          {SECTION_LABELS[s]}
        </button>
      ))}
    </nav>
  );
}

function TimelineSection() {
  const years = [1939, 1940, 1941, 1942, 1943, 1944, 1945];
  const [selectedYear, setSelectedYear] = useState(1939);
  const events = TIMELINE_EVENTS.filter(e => e.year === selectedYear);

  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: C.text }}>Year-by-Year Timeline</h2>

      {/* Year selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            style={{
              padding: '10px 20px', borderRadius: 8, border: `2px solid ${selectedYear === y ? C.redAccent : C.border}`,
              cursor: 'pointer', fontSize: 16, fontWeight: 700, transition: 'all 0.2s',
              backgroundColor: selectedYear === y ? C.redAccent : 'transparent',
              color: selectedYear === y ? '#fff' : C.textMuted,
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Events */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {events.map((e, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, marginBottom: 20,
              padding: 20, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
            }}>
              <div style={{
                minWidth: 48, fontSize: 13, fontWeight: 600, color: C.gold,
                paddingTop: 2,
              }}>
                {e.month ?? ''}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function CausesSection() {
  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>Causes of the War</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
        World War II did not emerge from a single cause but from the convergence of unresolved grievances,
        economic collapse, ideological extremism, and the failure of international institutions.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CAUSES.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: 24, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${C.redAccent}`,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, color: C.gold, marginBottom: 8 }}>{c.title}</h3>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{c.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TheatersSection() {
  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, color: C.text }}>Major Theaters of War</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {THEATERS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              padding: 24, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
              borderTop: `4px solid ${t.color}`,
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.name}</h3>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{t.region}</div>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{t.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BattlesSection() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const theaterColors: Record<string, string> = {
    'Western Europe': '#3b82f6',
    'Eastern Front': '#ef4444',
    'North Africa': '#d4a84b',
    'Pacific': '#22c55e',
    'Atlantic Ocean': '#60a5fa',
  };

  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>Key Battles</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>
        {BATTLES.length} decisive engagements that shaped the course of the war. Click to expand.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {BATTLES.map((b, i) => {
          const isOpen = expanded === i;
          const color = theaterColors[b.theater] ?? C.textMuted;
          return (
            <motion.div
              key={i}
              layout
              onClick={() => setExpanded(isOpen ? null : i)}
              style={{
                padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                backgroundColor: isOpen ? C.bgCardAlt : C.bgCard,
                border: `1px solid ${isOpen ? color : C.border}`,
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{b.name}</span>
                  <span style={{ fontSize: 13, color: C.textDim, marginLeft: 12 }}>{b.dates}</span>
                </div>
                <span style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 12,
                  backgroundColor: color + '22', color, fontWeight: 600,
                }}>
                  {b.theater}
                </span>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Combatants</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{b.combatants[0]} vs {b.combatants[1]}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Casualties</div>
                        <div style={{ fontSize: 13, color: C.textMuted }}>{b.casualties}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 11, color: C.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Strategic Significance</div>
                      <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{b.significance}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FiguresSection() {
  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32, color: C.text }}>Key Figures</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
        {KEY_FIGURES.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: 20, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0 }}>{f.name}</h3>
              <span style={{ fontSize: 12, color: C.textDim }}>{f.nation}</span>
            </div>
            <div style={{ fontSize: 13, color: C.gold, marginBottom: 10 }}>{f.role}</div>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{f.keyDecision}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HolocaustSection() {
  return (
    <section style={{
      padding: '48px 32px', maxWidth: 960, margin: '0 auto',
      borderTop: `2px solid ${C.border}`,
    }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>The Holocaust</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
        The systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime and its collaborators.
        Millions of others — Roma, disabled people, political prisoners, homosexuals, Slavic peoples — were also targeted.
        The total number of victims is estimated at 11–17 million.
      </p>

      {/* Chronology */}
      <div style={{ position: 'relative', paddingLeft: 32, borderLeft: `2px solid ${C.red}55` }}>
        {HOLOCAUST_TIMELINE.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{ marginBottom: 24, position: 'relative' }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -39, top: 4, width: 12, height: 12,
              borderRadius: '50%', backgroundColor: C.red, border: `2px solid ${C.bg}`,
            }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: C.redAccent, marginBottom: 4 }}>{h.year}</div>
            <div style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>{h.event}</div>
          </motion.div>
        ))}
      </div>

      {/* Scale */}
      <div style={{
        marginTop: 32, padding: 24, borderRadius: 10,
        backgroundColor: C.red + '11', border: `1px solid ${C.red}33`,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.redAccent, marginBottom: 12 }}>Scale of the Genocide</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { group: 'Jews', count: '~6 million' },
            { group: 'Soviet POWs', count: '~3 million' },
            { group: 'Ethnic Poles', count: '~1.8 million' },
            { group: 'Roma', count: '~500,000' },
            { group: 'Disabled', count: '~250,000' },
            { group: 'Others', count: '~500,000+' },
          ].map((g, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{g.count}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{g.group}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatisticsSection() {
  const maxTotal = Math.max(...CASUALTIES.map(c => c.military + c.civilian));
  const totalMilitary = CASUALTIES.reduce((s, c) => s + c.military, 0);
  const totalCivilian = CASUALTIES.reduce((s, c) => s + c.civilian, 0);

  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>War Casualties by Nation</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>
        Estimated total: {formatNumber(totalMilitary + totalCivilian)} deaths
        ({formatNumber(totalMilitary)} military, {formatNumber(totalCivilian)} civilian).
        These figures represent selected major belligerents; global totals are estimated at 70–85 million.
      </p>

      {/* Bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CASUALTIES.map((c, i) => {
          const total = c.military + c.civilian;
          const milPct = (c.military / maxTotal) * 100;
          const civPct = (c.civilian / maxTotal) * 100;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{c.nation}</span>
                <span style={{ fontSize: 12, color: C.textDim }}>{formatNumber(total)}</span>
              </div>
              <div style={{ display: 'flex', height: 20, borderRadius: 4, overflow: 'hidden', backgroundColor: C.bgCard }}>
                <div style={{
                  width: `${milPct}%`, backgroundColor: C.navyLight,
                  transition: 'width 0.5s ease',
                }} />
                <div style={{
                  width: `${civPct}%`, backgroundColor: C.redAccent + 'aa',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: C.navyLight }} />
          <span style={{ fontSize: 12, color: C.textMuted }}>Military</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: C.redAccent + 'aa' }} />
          <span style={{ fontSize: 12, color: C.textMuted }}>Civilian</span>
        </div>
      </div>
    </section>
  );
}

function AftermathSection() {
  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>Aftermath</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
        The war&apos;s end did not bring peace so much as a new world order. The consequences reshaped
        borders, institutions, and the global balance of power for the rest of the century.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
        {AFTERMATH.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: 20, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: C.gold, marginBottom: 8, margin: '0 0 8px' }}>{a.title}</h3>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{a.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TechnologySection() {
  return (
    <section style={{ padding: '48px 32px', maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: C.text }}>Technology &amp; Innovation</h2>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32, lineHeight: 1.6 }}>
        War accelerated technological development at an unprecedented pace. Many innovations born from
        wartime necessity went on to transform civilian life.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {TECH_INNOVATIONS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: 20, borderRadius: 10,
              backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
              display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t.name}</div>
              <div style={{ fontSize: 12, color: C.gold, marginTop: 4 }}>{t.year}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 8 }}>{t.description}</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <strong style={{ color: C.gold }}>Impact:</strong> {t.impact}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section renderer
// ─────────────────────────────────────────────────────────────────────────────

function SectionContent({ section }: { section: Section }) {
  switch (section) {
    case 'TIMELINE': return <TimelineSection />;
    case 'CAUSES': return <CausesSection />;
    case 'THEATERS': return <TheatersSection />;
    case 'BATTLES': return <BattlesSection />;
    case 'FIGURES': return <FiguresSection />;
    case 'HOLOCAUST': return <HolocaustSection />;
    case 'STATISTICS': return <StatisticsSection />;
    case 'AFTERMATH': return <AftermathSection />;
    case 'TECHNOLOGY': return <TechnologySection />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function WWIIPage() {
  const [activeSection, setActiveSection] = useState<Section>('TIMELINE');

  return (
    <div style={{
      width: '100vw', minHeight: '100vh', overflow: 'auto',
      backgroundColor: C.bg, color: C.text,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <HeroSection />
      <TabNav active={activeSection} onChange={setActiveSection} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          <SectionContent section={activeSection} />
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div style={{
        padding: '32px', textAlign: 'center',
        borderTop: `1px solid ${C.border}`,
      }}>
        <Link
          to="/"
          style={{
            fontSize: 13, color: C.textDim, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 6,
            border: `1px solid ${C.border}`,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          ← Back to Chronicle
        </Link>
      </div>
    </div>
  );
}
