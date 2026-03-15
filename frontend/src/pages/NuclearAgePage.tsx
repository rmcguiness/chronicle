import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ─── colour palette ─── */
const AMBER   = '#f59e0b';
const RED      = '#ef4444';
const ORANGE   = '#f97316';
const BLUE     = '#3b82f6';
const CYAN     = '#06b6d4';
const GREEN    = '#22c55e';
const PURPLE   = '#a855f7';
const PINK     = '#ec4899';
const SLATE    = '#94a3b8';
const YELLOW   = '#eab308';

/* ─── data types ─── */
interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FigureEntry {
  name: string;
  years: string;
  role: string;
  detail: string;
  color: string;
}

interface NearMissEntry {
  year: string;
  title: string;
  description: string;
  severity: 'extreme' | 'high' | 'critical';
  color: string;
}

/* ─── DISCOVERY & FISSION ─── */
const DISCOVERY_ENTRIES: TimelineEntry[] = [
  {
    year: '1905',
    title: 'E = mc² — The Equation That Changed Everything',
    description:
      'Einstein publishes his special relativity paper showing that mass and energy are interchangeable. A tiny amount of matter contains enormous energy: one kilogram of matter, fully converted, releases the energy of 21 megatons of TNT. Nobody yet knows how to unlock it.',
    color: BLUE,
  },
  {
    year: 'Dec 1938',
    title: 'Hahn & Strassmann Split the Uranium Atom',
    description:
      'In a Berlin laboratory, Otto Hahn and Fritz Strassmann bombard uranium with neutrons and find barium in the products — an element far lighter than uranium. They cannot explain the result. They write to their former colleague Lise Meitner, who has fled Nazi Germany for Sweden.',
    color: AMBER,
  },
  {
    year: 'Jan 1939',
    title: 'Meitner Names It "Fission"',
    description:
      'Walking in the snowy Swedish woods with her nephew Otto Frisch, Lise Meitner works out the physics. The uranium nucleus has split roughly in half, and the mass difference has converted to energy via E = mc². She calculates ~200 MeV per fission — millions of times more energy per reaction than any chemical process. She names it "fission" after biological cell division. She will never receive the Nobel Prize; Hahn alone gets it in 1944.',
    color: PURPLE,
  },
  {
    year: 'Jan 1939',
    title: 'Bohr Brings the News to America',
    description:
      'Niels Bohr arrives at a physics conference in Washington, D.C. and shares the fission discovery. The room erupts — physicists rush to their labs to replicate it. Within weeks, labs across the world confirm: uranium fission is real. Einstein and Leo Szilard immediately grasp the military implication: if each fission releases neutrons that split more atoms, you get a chain reaction — an explosion of unprecedented power.',
    color: CYAN,
  },
];

/* ─── THE PHYSICS ─── */
const PHYSICS_ENTRIES: TimelineEntry[] = [
  {
    year: 'Fission',
    title: 'How Nuclear Fission Works',
    description:
      'A neutron strikes a uranium-235 nucleus, which absorbs it and becomes unstable. The nucleus splits into two lighter elements (fission products) plus 2–3 free neutrons and a burst of energy (~200 MeV). Those freed neutrons can strike other U-235 nuclei, causing more fissions. If enough fissile material is present (a "critical mass" — about 52 kg for U-235 or 10 kg for Pu-239), the chain reaction becomes self-sustaining. In a bomb, this happens in microseconds: an exponential cascade releasing energy equivalent to thousands of tons of TNT.',
    color: BLUE,
  },
  {
    year: 'E = mc²',
    title: 'Where the Energy Comes From',
    description:
      'The fission products weigh slightly less than the original uranium atom plus neutron. That missing mass — about 0.1% — converts directly to energy per Einstein\'s equation. It sounds small, but 0.1% of an atomic mass unit multiplied by the speed of light squared (9 × 10¹⁶ m²/s²) is enormous. One kilogram of U-235, fully fissioned, releases energy equivalent to ~18,000 tons of TNT. This is why nuclear weapons are measured in kilotons and megatons.',
    color: AMBER,
  },
  {
    year: 'Critical Mass',
    title: 'The Difference Between a Reactor and a Bomb',
    description:
      'In a reactor, control rods absorb excess neutrons, keeping exactly one neutron per fission causing another fission (criticality factor k = 1). In a bomb, you want k >> 1: every fission causes multiple new fissions in an exponentially growing chain. The engineering challenge is assembling a supercritical mass fast enough that it doesn\'t blow itself apart before most of the material fissions. The "gun-type" design (Little Boy) shoots one subcritical piece into another. The "implosion" design (Fat Man) uses shaped explosive charges to compress a plutonium sphere to supercriticality.',
    color: GREEN,
  },
];

/* ─── MANHATTAN PROJECT ─── */
const MANHATTAN_ENTRIES: TimelineEntry[] = [
  {
    year: 'Aug 1939',
    title: 'The Einstein-Szilard Letter',
    description:
      'Leo Szilard, a Hungarian physicist who had already conceived of the nuclear chain reaction in 1933, drafts a letter to President Roosevelt. He persuades Albert Einstein — the most famous scientist alive — to sign it. The letter warns that Germany might build an atomic bomb using uranium chain reactions, and urges the US to begin its own research. Roosevelt responds by creating the Advisory Committee on Uranium. The nuclear arms race begins with a two-page letter.',
    color: AMBER,
  },
  {
    year: '1942',
    title: 'The Manhattan Project Begins',
    description:
      'Under the Army Corps of Engineers\' "Manhattan Engineer District," the largest secret scientific project in history is born. Budget: $2 billion (1940s dollars, roughly $30 billion today). Workforce: 130,000 people. Three secret cities built from scratch: Oak Ridge, Tennessee (uranium enrichment); Hanford, Washington (plutonium production); Los Alamos, New Mexico (weapon design and assembly). Most workers don\'t know what they\'re building.',
    color: RED,
  },
  {
    year: 'Dec 2, 1942',
    title: 'Chicago Pile-1 — The First Nuclear Reactor',
    description:
      'Enrico Fermi and his team achieve the first controlled, self-sustaining nuclear chain reaction in a squash court under the stands of the University of Chicago\'s Stagg Field. The "reactor" is a pile of uranium and graphite blocks. Fermi monitors neutron levels and slowly withdraws the control rod. At 3:25 PM, the Geiger counters click faster and faster — criticality. The chain reaction sustains for 28 minutes before Fermi orders it shut down. Arthur Compton calls James Conant: "The Italian navigator has just landed in the new world."',
    color: ORANGE,
  },
  {
    year: '1943–1945',
    title: 'Los Alamos — The Secret City on the Mesa',
    description:
      'J. Robert Oppenheimer is chosen to lead the weapons laboratory at Los Alamos, a remote mesa in New Mexico accessible only by a single dirt road. He recruits the greatest concentration of scientific talent ever assembled: Fermi, Bohr, Teller, von Neumann, Feynman, Bethe, Segré, and dozens more. Average age of scientists: 25. Richard Feynman, the youngest group leader at 24, amuses himself by cracking the safes containing nuclear secrets. Security is obsessive — all mail censored, no one can say "Los Alamos" or use real names. Their address is simply "P.O. Box 1663, Santa Fe, New Mexico."',
    color: PURPLE,
  },
  {
    year: 'Jul 16, 1945',
    title: 'Trinity — The First Nuclear Explosion',
    description:
      'At 5:29 AM in the Jornada del Muerto desert, the "Gadget" — an implosion-type plutonium device — detonates atop a 100-foot steel tower. The explosion equals 21,000 tons of TNT (21 kilotons). The fireball vaporises the tower, fuses the desert sand into a green glassy substance later called "trinitite," and creates a mushroom cloud that rises 40,000 feet. The blast is felt 100 miles away. Oppenheimer later recalls: "Now I am become Death, the destroyer of worlds" — from the Bhagavad Gita. Kenneth Bainbridge, the test director, says simply: "Now we are all sons of bitches."',
    color: RED,
  },
  {
    year: 'May 8, 1945',
    title: 'Germany Surrenders — The Original Justification Evaporates',
    description:
      'Germany surrenders unconditionally two months before Trinity. The bomb was built to counter the Nazi nuclear threat — but Germany never came close to building one (their program, led by Heisenberg, was years behind). The original justification for the Manhattan Project is gone. Yet the project continues at full speed, now aimed at Japan. Some scientists, led by Leo Szilard, petition to demonstrate the bomb rather than use it on a city. The petition never reaches Truman.',
    color: SLATE,
  },
];

/* ─── HIROSHIMA & NAGASAKI ─── */
const BOMBING_ENTRIES: TimelineEntry[] = [
  {
    year: 'Aug 6, 1945',
    title: 'Hiroshima — "Little Boy"',
    description:
      'At 8:15 AM local time, the B-29 bomber Enola Gay releases "Little Boy," a gun-type uranium bomb, over Hiroshima. It detonates 1,900 feet above the city with a yield of ~15 kilotons. The temperature at the hypocenter reaches millions of degrees. In a fraction of a second, the blast destroys 5 square miles of the city. Between 70,000 and 80,000 people die instantly — vaporised, crushed, or burned. By the end of 1945, the death toll reaches approximately 140,000 from burns, radiation sickness, and injuries. The city\'s population was 350,000.',
    color: RED,
  },
  {
    year: 'Aug 9, 1945',
    title: 'Nagasaki — "Fat Man"',
    description:
      'Three days later, the B-29 Bockscar drops "Fat Man," an implosion-type plutonium bomb, on Nagasaki. The primary target was Kokura, but cloud cover diverted the plane. Fat Man detonates with a yield of ~21 kilotons — more powerful than Little Boy — but Nagasaki\'s hilly terrain limits the destruction. Approximately 40,000 people die immediately; the total reaches roughly 80,000 by year\'s end. Nagasaki had a population of 263,000.',
    color: RED,
  },
  {
    year: 'Aug 15, 1945',
    title: 'Japan Surrenders',
    description:
      'Emperor Hirohito announces Japan\'s unconditional surrender in a radio broadcast — the first time most Japanese citizens hear his voice. The formal surrender is signed aboard the USS Missouri on September 2, 1945, ending World War II. The war\'s total death toll: approximately 70–85 million people, or about 3% of the world\'s population.',
    color: BLUE,
  },
];

const DEBATE_POINTS: TimelineEntry[] = [
  {
    year: 'For',
    title: 'The Case for the Bombing',
    description:
      'Operation Downfall — the planned invasion of Japan — was estimated to cost 250,000 to 1,000,000 Allied casualties and potentially millions of Japanese military and civilian deaths. Japan\'s military leadership was preparing for a fight to the last person. The Soviet Union\'s declaration of war on Japan (August 8) added pressure but the timing was uncertain. Proponents argue the bombs, however horrific, ended the war quickly and saved more lives than they took.',
    color: BLUE,
  },
  {
    year: 'Against',
    title: 'The Case Against',
    description:
      'Japan was already effectively defeated: its navy destroyed, cities firebombed, blockaded. Several senior US military leaders — including Eisenhower, Leahy, and MacArthur — later said the bomb was militarily unnecessary. Japanese diplomatic cables (intercepted via MAGIC) showed factions seeking surrender. The Soviet entry into the Pacific war may have been sufficient. Critics argue the bombings were partly a demonstration for the USSR — the first shot of the Cold War — and constituted a war crime against a civilian population.',
    color: ORANGE,
  },
  {
    year: 'Hibakusha',
    title: 'The Survivors',
    description:
      'The hibakusha (被爆者, "bomb-affected people") number approximately 650,000. Survivors suffered acute radiation syndrome, keloid scarring, elevated cancer rates (especially leukemia), and genetic anxiety about their children. In Japan, hibakusha faced discrimination in employment and marriage due to fears about radiation and genetic damage. Many stayed silent for decades. Their testimonies — of shadows burned into concrete, of black rain, of skin sliding off bodies — became the most powerful argument against nuclear weapons. Organizations like Nihon Hidankyo (awarded the 2024 Nobel Peace Prize) ensure these stories survive.',
    color: PURPLE,
  },
];

/* ─── ARMS RACE ─── */
const ARMS_RACE_ENTRIES: TimelineEntry[] = [
  {
    year: 'Aug 29, 1949',
    title: 'The Soviet Bomb',
    description:
      'The USSR detonates "Joe-1" (RDS-1) — their first atomic bomb — at the Semipalatinsk test site in Kazakhstan. Western intelligence estimated the Soviets were 5–10 years away. They were aided by espionage: Klaus Fuchs, a German-born British physicist who worked at Los Alamos, had been passing bomb designs to Soviet intelligence since 1944. His arrest in 1950 leads to the unraveling of a spy ring and the execution of Julius and Ethel Rosenberg in 1953.',
    color: RED,
  },
  {
    year: 'Nov 1, 1952',
    title: 'The Hydrogen Bomb — Ivy Mike',
    description:
      'The US detonates the first thermonuclear device at Enewetak Atoll in the Pacific. Yield: 10.4 megatons — roughly 700 times more powerful than Hiroshima. The H-bomb uses a fission bomb as a trigger to ignite nuclear fusion (fusing hydrogen isotopes deuterium and tritium), the same process that powers the sun. The island of Elugelab is completely vaporised, replaced by an underwater crater 1.5 miles wide. Edward Teller, the bomb\'s chief advocate, sends a telegram: "It\'s a boy."',
    color: ORANGE,
  },
  {
    year: 'Aug 12, 1953',
    title: 'Soviet H-Bomb',
    description:
      'The USSR detonates its first thermonuclear device, "Joe-4" (RDS-6s), designed by Andrei Sakharov. Unlike the US device, it is small enough to be dropped from an aircraft. The nuclear arms race accelerates exponentially.',
    color: RED,
  },
  {
    year: 'Oct 30, 1961',
    title: 'Tsar Bomba — The Largest Explosion in Human History',
    description:
      'The Soviet Union detonates the AN602 hydrogen bomb over Novaya Zemlya. Yield: 50 megatons (reduced from the original 100 MT design). The fireball reaches 5 miles in diameter. The mushroom cloud rises 40 miles into the stratosphere. Windows shatter 560 miles away. The flash is visible 600 miles distant. The shockwave circles the Earth three times. It remains the largest man-made explosion ever. Its designer, Andrei Sakharov, will later become the Soviet Union\'s most prominent dissident and peace activist.',
    color: PURPLE,
  },
  {
    year: '1986',
    title: 'Peak Stockpile: 70,000 Warheads',
    description:
      'Global nuclear arsenals reach their all-time peak: approximately 70,000 warheads, held primarily by the US (~23,000) and USSR (~45,000). The combined yield is enough to destroy human civilization many times over. A single Ohio-class submarine carries 24 Trident missiles with up to 192 warheads — more destructive power than all weapons fired in all wars in human history combined.',
    color: RED,
  },
  {
    year: 'Doctrine',
    title: 'Mutually Assured Destruction (MAD)',
    description:
      'The strategic doctrine that prevented nuclear war for 75+ years. Both superpowers maintain second-strike capability: even after absorbing a full nuclear attack, they can launch a devastating counterattack from submarines, mobile launchers, or hardened silos. Since launching first guarantees your own destruction, no rational actor would strike. The result: "the delicate balance of terror." Critics note it depends on rational actors, functioning command systems, and the absence of accidents — assumptions tested to the breaking point multiple times.',
    color: CYAN,
  },
];

/* ─── NEAR MISSES ─── */
const NEAR_MISS_ENTRIES: NearMissEntry[] = [
  {
    year: 'Oct 1962',
    title: 'Cuban Missile Crisis — 13 Days at the Brink',
    description:
      'US reconnaissance discovers Soviet nuclear missiles being installed in Cuba, 90 miles from Florida. President Kennedy imposes a naval blockade. For 13 days, the US and USSR stand at the threshold of nuclear war. The most dangerous moment: Soviet submarine B-59, depth-charged by the US Navy, prepares to fire a nuclear torpedo. Launch requires agreement of three officers. Two say yes. Vasili Arkhipov — the flotilla commander — says no. One man\'s refusal may have prevented nuclear war. Khrushchev and Kennedy negotiate secretly; the missiles are withdrawn in exchange for a US pledge not to invade Cuba and the quiet removal of US missiles from Turkey.',
    severity: 'extreme',
    color: RED,
  },
  {
    year: 'Sep 26, 1983',
    title: 'Stanislav Petrov — The Man Who Saved the World',
    description:
      'Soviet early-warning satellites report five US Minuteman ICBMs launching toward the Soviet Union. Lt. Colonel Stanislav Petrov, the duty officer at the Serpukhov-15 bunker, must decide: report it up the chain (triggering Soviet counterlaunch) or call it a false alarm. Soviet doctrine and his orders say report. But Petrov reasons: a real US first strike would involve hundreds of missiles, not five. He reports a system malfunction. He is correct — the satellites had mistaken sunlight reflecting off clouds for missile exhaust. Petrov receives no official recognition from the Soviet Union; the incident is classified for years.',
    severity: 'extreme',
    color: AMBER,
  },
  {
    year: 'Nov 1983',
    title: 'Able Archer 83 — NATO Exercise Mistaken for First Strike',
    description:
      'NATO runs Able Archer 83, a command-post exercise simulating a nuclear attack on the Soviet Union. The exercise is unusually realistic: it involves heads of state, practices new launch procedures, and uses a format the Soviets haven\'t seen before. Soviet leadership, already paranoid under Operation RYAN (a KGB intelligence-gathering program about a potential US first strike), interprets the exercise as possible cover for an actual nuclear attack. Soviet nuclear forces are placed on high alert. Only when the exercise ends do tensions subside. Western intelligence only learns years later how close the Soviets came to launching.',
    severity: 'critical',
    color: ORANGE,
  },
  {
    year: '1961',
    title: 'Goldsboro B-52 Crash — A Single Switch Prevented Detonation',
    description:
      'A B-52 carrying two 3.8-megaton hydrogen bombs breaks apart over Goldsboro, North Carolina. One bomb\'s parachute deploys and it lands relatively intact. The other plunges into a muddy field. A later investigation reveals that on the intact bomb, five of six safety mechanisms had failed during the breakup. A single low-voltage switch — the final safeguard — prevented a thermonuclear detonation 250 times more powerful than Hiroshima over the US East Coast. The buried bomb\'s uranium core was never recovered; the site is monitored to this day.',
    severity: 'high',
    color: YELLOW,
  },
  {
    year: '1980',
    title: 'The 46-Cent Chip That Almost Started WWIII',
    description:
      'A faulty computer chip at NORAD — costing 46 cents — causes US early-warning systems to display a massive Soviet nuclear attack: 2,200 incoming missiles. B-52 bomber crews start their engines. Minuteman missile crews receive preliminary launch orders. National Security Adviser Zbigniew Brzezinski is woken and told he has minutes to recommend a response. A second call confirms the attack. He is about to call President Carter when a third call reveals it\'s a false alarm. The entire incident lasts six minutes.',
    severity: 'high',
    color: CYAN,
  },
];

/* ─── NUCLEAR TESTING ─── */
const TESTING_ENTRIES: TimelineEntry[] = [
  {
    year: '1945–1998',
    title: '2,056 Nuclear Tests',
    description:
      'Between 1945 and 1998, eight nations conducted 2,056 nuclear tests: the US (1,032), USSR (727), France (210), UK (45), China (45), India (6), Pakistan (6), and North Korea (6 through 2017). Tests were conducted underground, underwater, and in the atmosphere. Atmospheric testing released enormous quantities of radioactive fallout — strontium-90, cesium-137, iodine-131 — into the global environment.',
    color: RED,
  },
  {
    year: '1946–1958',
    title: 'The Pacific Islands — Ground Zero for Testing',
    description:
      'The US conducts 67 nuclear tests at Bikini and Enewetak atolls in the Marshall Islands. The inhabitants are relocated with promises they can return — most never do. The 1954 Castle Bravo test (15 megatons, 2.5× the expected yield) contaminates the inhabited Rongelap Atoll with fallout. Japanese fishing vessel Lucky Dragon No. 5 is also irradiated, sparking an international incident. The Marshallese people suffer elevated rates of thyroid cancer, leukemia, and birth defects for generations.',
    color: ORANGE,
  },
  {
    year: '1950s–1960s',
    title: 'Downwinders — America\'s Forgotten Victims',
    description:
      'The Nevada Test Site hosts 928 nuclear tests (100 atmospheric). Communities downwind in Nevada, Utah, and Arizona — many of them Mormon farming families and Western Shoshone indigenous communities — are exposed to significant fallout. Cancer rates soar. The government assures residents the tests are safe. The Radiation Exposure Compensation Act (1990) eventually acknowledges the harm, but many feel the response is inadequate and delayed by decades.',
    color: PURPLE,
  },
];

/* ─── NUCLEAR POWER ─── */
const POWER_ENTRIES: TimelineEntry[] = [
  {
    year: '1953',
    title: '"Atoms for Peace"',
    description:
      'President Eisenhower delivers his "Atoms for Peace" speech at the United Nations, proposing that nuclear energy be harnessed for civilian power generation. The first commercial nuclear power plant opens at Calder Hall, UK, in 1956. The promise: electricity "too cheap to meter." The world currently operates approximately 440 nuclear reactors in 32 countries, generating about 10% of global electricity.',
    color: GREEN,
  },
  {
    year: 'Apr 26, 1986',
    title: 'Chernobyl — The Worst Nuclear Disaster',
    description:
      'Reactor No. 4 at the Chernobyl Nuclear Power Plant in Soviet Ukraine explodes during a safety test. The explosion and subsequent fire release 400 times more radioactive material than the Hiroshima bomb. 350,000 people are permanently evacuated. The "Exclusion Zone" (30 km radius) remains largely uninhabitable. The disaster exposes Soviet secrecy (Sweden detects the fallout before the USSR acknowledges the accident) and accelerates the unraveling of the Soviet system. The long-term death toll is debated: estimates range from 4,000 (WHO) to 93,000 (Greenpeace).',
    color: RED,
  },
  {
    year: 'Mar 11, 2011',
    title: 'Fukushima Daiichi',
    description:
      'A magnitude 9.0 earthquake and resulting tsunami disable the cooling systems at the Fukushima Daiichi Nuclear Power Plant in Japan. Three reactors experience meltdowns. Over 150,000 people are evacuated. The disaster triggers a global reassessment of nuclear safety: Germany decides to phase out all nuclear power by 2022 (completed in 2023). Japan shuts down all 54 of its reactors, though some are gradually restarting.',
    color: ORANGE,
  },
  {
    year: 'Present',
    title: 'Nuclear Power and Climate Change',
    description:
      'Nuclear energy produces virtually no greenhouse gas emissions during operation and provides reliable baseload power. Many climate scientists, including James Hansen, argue it must be part of the solution to climate change. New designs — small modular reactors (SMRs), molten salt reactors, and fusion research — promise safer, more flexible nuclear power. The debate continues between those who see nuclear as essential for decarbonization and those who argue that renewables plus storage can meet all needs.',
    color: GREEN,
  },
];

/* ─── ARMS CONTROL ─── */
const ARMS_CONTROL_ENTRIES: TimelineEntry[] = [
  {
    year: '1963',
    title: 'Partial Test Ban Treaty (PTBT)',
    description:
      'After the Cuban Missile Crisis shocks both superpowers, the US, USSR, and UK sign the PTBT banning nuclear tests in the atmosphere, outer space, and underwater. Underground testing continues. The treaty is a direct result of public alarm over radioactive fallout in food supplies, particularly strontium-90 in milk.',
    color: GREEN,
  },
  {
    year: '1968',
    title: 'Non-Proliferation Treaty (NPT)',
    description:
      'The cornerstone of nuclear arms control. The five declared nuclear states (US, USSR, UK, France, China) agree not to help other states acquire nuclear weapons; non-nuclear states agree not to develop them, in exchange for access to civilian nuclear technology and a commitment by nuclear states to pursue disarmament. 191 parties. Four states never joined: India, Pakistan, Israel (which has never officially confirmed its arsenal), and North Korea (which withdrew in 2003).',
    color: BLUE,
  },
  {
    year: '1972–1991',
    title: 'SALT & START Treaties',
    description:
      'SALT I (1972) and SALT II (1979) limit the number of strategic nuclear delivery vehicles. START I (1991), signed as the Soviet Union collapses, mandates deep cuts: both sides reduce to 6,000 warheads on 1,600 delivery vehicles. START I verification is unprecedented: on-site inspections, data exchanges, satellite monitoring. New START (2010) further reduces deployed strategic warheads to 1,550 each. Russia suspended its participation in 2023.',
    color: CYAN,
  },
  {
    year: '1987',
    title: 'INF Treaty',
    description:
      'Reagan and Gorbachev sign the Intermediate-Range Nuclear Forces Treaty, eliminating all ground-launched missiles with ranges of 500–5,500 km. It is the first treaty to eliminate an entire class of nuclear weapons — 2,692 missiles destroyed. The US withdraws from the treaty in 2019, citing Russian violations.',
    color: PURPLE,
  },
];

/* ─── CURRENT NUCLEAR WORLD ─── */
const CURRENT_ENTRIES: TimelineEntry[] = [
  {
    year: '2024',
    title: 'Nine Nuclear-Armed States',
    description:
      'Russia (~5,580 warheads), United States (~5,044), China (~500, rapidly expanding), France (~290), United Kingdom (~225), Pakistan (~170), India (~172), Israel (~90, undeclared), North Korea (~50). Total: approximately 12,500 warheads, of which ~3,900 are deployed with operational forces. Despite dramatic reductions from Cold War peaks, the existing arsenals could still end civilization.',
    color: RED,
  },
  {
    year: 'Ongoing',
    title: 'Pakistan-India: The Most Dangerous Nuclear Rivalry',
    description:
      'Two nuclear-armed neighbours with a history of four wars, ongoing territorial disputes (Kashmir), active border skirmishes, and short missile flight times (5–10 minutes). Both arsenals are growing. Neither has signed the NPT. A regional nuclear war between them — even using a fraction of their arsenals — would, according to climate models, cause a "nuclear winter" reducing global temperatures and crop yields, potentially causing famine affecting 2 billion people worldwide.',
    color: ORANGE,
  },
  {
    year: 'Ongoing',
    title: 'North Korea — The Hermit Nuclear State',
    description:
      'North Korea conducted its first nuclear test in 2006 and has since tested six devices, including a claimed thermonuclear weapon in 2017. It has developed ICBMs theoretically capable of reaching the continental United States. Diplomatic efforts (the Six-Party Talks, the 2018 Singapore summit) have failed to achieve denuclearization. The regime views nuclear weapons as its ultimate guarantee of survival.',
    color: PURPLE,
  },
  {
    year: 'Ongoing',
    title: 'The Iran Question',
    description:
      'Iran enriches uranium to near-weapons-grade levels (60% U-235; 90% is weapons-grade). The 2015 Joint Comprehensive Plan of Action (JCPOA) limited Iran\'s enrichment in exchange for sanctions relief, but the US withdrew in 2018. Iran\'s "breakout time" — the time needed to produce enough fissile material for one weapon — has shrunk from over a year to weeks. Whether Iran will cross the threshold remains one of the most consequential unknowns in global security.',
    color: AMBER,
  },
];

/* ─── KEY FIGURES ─── */
const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'J. Robert Oppenheimer',
    years: '1904–1967',
    role: '"Father of the Atomic Bomb"',
    detail:
      'A theoretical physicist of extraordinary breadth — he published on quantum mechanics, astrophysics (predicted black holes), and nuclear physics. Spoke six languages, read the Bhagavad Gita in Sanskrit. Appointed scientific director of the Manhattan Project at age 38, he managed hundreds of scientists with competing egos and brought the project to completion in under three years. After the war, haunted by what he had created, he opposed the hydrogen bomb, advocated for international nuclear control, and was rewarded with a humiliating public security hearing in 1954 that stripped his clearance — orchestrated by Lewis Strauss and driven partly by Edward Teller\'s testimony. The AEC revoked his clearance 4–1. He spent his remaining years at Princeton\'s Institute for Advanced Study, a broken man who chain-smoked and died of throat cancer at 62. In 2022, the US government formally vacated the 1954 decision, acknowledging it was a "flawed process."',
    color: PURPLE,
  },
  {
    name: 'Lise Meitner',
    years: '1878–1968',
    role: 'The Physicist Who Explained Fission',
    detail:
      'Austrian-Swedish physicist who worked with Otto Hahn for 30 years. As a Jewish woman in 1930s Germany, she faced double discrimination. She fled to Sweden in 1938, just months before Hahn\'s fission discovery. Her calculation of the energy released — and her naming of the process "fission" — was essential to the field. The Nobel Committee awarded the 1944 Chemistry prize to Hahn alone. She was nominated 48 times for the Nobel Prize and never won. Element 109, meitnerium, is named after her.',
    color: AMBER,
  },
  {
    name: 'Enrico Fermi',
    years: '1901–1954',
    role: 'Builder of the First Nuclear Reactor',
    detail:
      'Italian-American physicist who achieved the first controlled chain reaction with Chicago Pile-1. Known as "the Pope" for his near-infallibility in physics, equally gifted in theory and experiment — an exceptionally rare combination. Won the 1938 Nobel Prize and used the trip to Stockholm to emigrate from fascist Italy with his Jewish wife Laura. At Los Alamos, he served as a general consultant solving seemingly impossible problems. Died of stomach cancer at 53, likely from radiation exposure.',
    color: ORANGE,
  },
  {
    name: 'Edward Teller',
    years: '1908–2003',
    role: '"Father of the Hydrogen Bomb"',
    detail:
      'Hungarian-American physicist who relentlessly championed the thermonuclear "Super" bomb from 1942 onward, even as the fission bomb was being built. His advocacy caused friction at Los Alamos; Oppenheimer opposed the H-bomb on moral and strategic grounds. Teller\'s testimony against Oppenheimer in the 1954 security hearing — the only scientist to testify against him — made him a pariah among many physicists. He later championed the Strategic Defense Initiative ("Star Wars") and continued advocating for nuclear testing until his death at 95.',
    color: RED,
  },
  {
    name: 'Andrei Sakharov',
    years: '1921–1989',
    role: 'Soviet H-Bomb Designer Turned Peace Activist',
    detail:
      'Designed the Soviet Union\'s first deployable thermonuclear weapon. Became increasingly alarmed by nuclear testing and the arms race he had helped create. In 1968, he published "Reflections on Progress, Peaceful Coexistence, and Intellectual Freedom," calling for nuclear disarmament and civil liberties. Awarded the 1975 Nobel Peace Prize (the Soviet government barred him from attending). Exiled to Gorky (Nizhny Novgorod) in 1980 for opposing the Soviet invasion of Afghanistan. Released by Gorbachev in 1986. Elected to the Soviet Congress of People\'s Deputies in 1989. Died of a heart attack later that year.',
    color: CYAN,
  },
  {
    name: 'Stanislav Petrov',
    years: '1939–2017',
    role: 'The Man Who Saved the World',
    detail:
      'A Soviet lieutenant colonel who, on September 26, 1983, chose to report a satellite early-warning alert of five incoming US missiles as a false alarm rather than a real attack. His reasoning: a real first strike would involve hundreds of missiles, not five; and the system was new and unreliable. He was correct — the system had been fooled by sunlight on high-altitude clouds. He received no official recognition from the Soviet military (his superiors were embarrassed by the system failure). He lived in modest obscurity until Western journalists found him in the late 1990s.',
    color: AMBER,
  },
  {
    name: 'Richard Feynman',
    years: '1918–1988',
    role: 'The Youngest Group Leader at Los Alamos',
    detail:
      'At 24, Feynman became the youngest group leader in the Theoretical Division at Los Alamos, responsible for computations on nuclear reactions. Famous for cracking safes containing nuclear secrets as a hobby and for his irreverent wit. His wife Arline was dying of tuberculosis in Albuquerque; he visited her regularly and she died in June 1945, weeks before Trinity. He later won the Nobel Prize in Physics (1965) for quantum electrodynamics and became one of the greatest physics communicators of the 20th century.',
    color: BLUE,
  },
];

/* ────────────────────────────────────────────
   SUB-COMPONENTS
   ──────────────────────────────────────────── */

function SectionWrapper({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#64748b',
          marginBottom: 18,
        }}
      >
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
      style={{
        padding: '16px 18px',
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: `${entry.color}10`,
        border: `1px solid ${entry.color}44`,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: entry.color,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {entry.year}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{entry.title}</span>
      </div>
      <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
        {entry.description}
      </p>
    </motion.div>
  );
}

function NearMissCard({ entry, index }: { entry: NearMissEntry; index: number }) {
  const severityLabel = { extreme: '☢️ EXTREME', critical: '⚠️ CRITICAL', high: '🔴 HIGH' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: 'easeOut' }}
      style={{
        padding: '18px 20px',
        marginBottom: 14,
        borderRadius: 8,
        backgroundColor: `${entry.color}12`,
        border: `1px solid ${entry.color}55`,
        borderLeft: `4px solid ${entry.color}`,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, color: entry.color, fontWeight: 700 }}>
          {entry.year}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{entry.title}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: entry.color,
            letterSpacing: '0.06em',
            marginLeft: 'auto',
          }}
        >
          {severityLabel[entry.severity]}
        </span>
      </div>
      <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
        {entry.description}
      </p>
    </motion.div>
  );
}

function FigureCard({ figure, index }: { figure: FigureEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        padding: '18px 20px',
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: `${figure.color}10`,
        border: `1px solid ${figure.color}44`,
        cursor: 'pointer',
        borderLeft: `4px solid ${figure.color}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{figure.name}</span>
          <span style={{ fontSize: 12, color: '#64748b', marginLeft: 10, fontFamily: 'monospace' }}>
            {figure.years}
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#64748b' }}>{expanded ? '▼' : '▶'}</span>
      </div>
      <div style={{ fontSize: 13, color: figure.color, fontWeight: 600, marginTop: 4 }}>
        {figure.role}
      </div>
      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.75, marginTop: 10, marginBottom: 0 }}
        >
          {figure.detail}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   PAGE COMPONENT
   ──────────────────────────────────────────── */

export default function NuclearAgePage() {
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
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── HERO ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            padding: '40px 32px 32px',
            background: 'linear-gradient(180deg, rgba(239,68,68,0.08) 0%, transparent 100%)',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'inline-block',
              fontSize: 12,
              color: '#94a3b8',
              textDecoration: 'none',
              marginBottom: 16,
              padding: '4px 10px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            ← Back to Timeline
          </Link>
          <h1
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 12,
            }}
          >
            ☢️ The Nuclear Age
          </h1>
          <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, maxWidth: 720 }}>
            When humans gained the power to end civilization.{' '}
            <strong style={{ color: RED }}>From the splitting of the atom</strong> to{' '}
            <strong style={{ color: AMBER }}>70,000 warheads</strong> to the{' '}
            <strong style={{ color: CYAN }}>fragile arms-control regime</strong> that keeps
            the world from destroying itself —{' '}
            <strong style={{ color: '#f1f5f9' }}>1938 to the present</strong>.
          </p>
        </motion.div>

        {/* ── THE PHYSICS ── */}
        <SectionWrapper title="The Physics — How Nuclear Fission Works" icon="⚛️">
          {PHYSICS_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── THE DISCOVERY ── */}
        <SectionWrapper title="The Discovery — Splitting the Atom (1938–1939)" icon="🔬">
          {DISCOVERY_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── MANHATTAN PROJECT ── */}
        <SectionWrapper title="The Manhattan Project (1942–1945)" icon="🏗️">
          {MANHATTAN_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── HIROSHIMA & NAGASAKI ── */}
        <SectionWrapper title="Hiroshima & Nagasaki (August 1945)" icon="💥">
          {BOMBING_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
          <div style={{ marginTop: 20 }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#64748b',
                marginBottom: 14,
              }}
            >
              Was It Necessary? — The Enduring Debate
            </h3>
            {DEBATE_POINTS.map((e, i) => (
              <TimelineCard key={e.title} entry={e} index={i} />
            ))}
          </div>
        </SectionWrapper>

        {/* ── ARMS RACE ── */}
        <SectionWrapper title="The Nuclear Arms Race (1949–1991)" icon="🚀">
          {ARMS_RACE_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── NEAR MISSES ── */}
        <SectionWrapper title="Near-Misses That Almost Ended Civilization" icon="⚠️">
          <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.7, marginBottom: 18 }}>
            The following incidents came terrifyingly close to triggering nuclear war — often prevented
            by a single individual's judgment, a single safety switch, or sheer luck.
          </p>
          {NEAR_MISS_ENTRIES.map((e, i) => (
            <NearMissCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── NUCLEAR TESTING ── */}
        <SectionWrapper title="Nuclear Testing — 2,056 Detonations (1945–1998)" icon="🌋">
          {TESTING_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── NUCLEAR POWER ── */}
        <SectionWrapper title="Nuclear Power — Atoms for Peace and Peril" icon="⚡">
          {POWER_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── ARMS CONTROL ── */}
        <SectionWrapper title="Arms Control — Trying to Put the Genie Back" icon="📜">
          {ARMS_CONTROL_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── CURRENT NUCLEAR WORLD ── */}
        <SectionWrapper title="The Nuclear World Today" icon="🌍">
          {CURRENT_ENTRIES.map((e, i) => (
            <TimelineCard key={e.title} entry={e} index={i} />
          ))}
        </SectionWrapper>

        {/* ── KEY FIGURES ── */}
        <SectionWrapper title="Key Figures of the Nuclear Age" icon="👤">
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>
            Click a card to expand the full profile.
          </p>
          {KEY_FIGURES.map((f, i) => (
            <FigureCard key={f.name} figure={f} index={i} />
          ))}
        </SectionWrapper>

        {/* ── BOTTOM NAV ── */}
        <div style={{ padding: '24px 32px 48px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: '#94a3b8',
              textDecoration: 'none',
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
