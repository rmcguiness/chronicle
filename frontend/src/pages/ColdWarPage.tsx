/**
 * ColdWarPage — comprehensive deep-dive on the Cold War (1947–1991).
 *
 * Route: /cold-war
 *
 * Sections:
 *  1. Hero — headline, 44-year ideological struggle
 *  2. Origins — Yalta, Iron Curtain, Truman Doctrine, Marshall Plan
 *  3. Berlin Blockade & Airlift (1948–49)
 *  4. Korean War (1950–53) — first hot proxy war
 *  5. McCarthy Era & Red Scare — domestic impact
 *  6. Arms Race — atomic bomb to H-bomb to ICBMs, MAD doctrine
 *  7. Space Race — Sputnik to Apollo 11
 *  8. Cuba — Bay of Pigs, Missile Crisis
 *  9. Vietnam — domino theory to fall of Saigon
 * 10. Détente — Nixon opens China, SALT, Helsinki
 * 11. Soviet Afghanistan — the USSR's Vietnam
 * 12. Intelligence War — CIA vs KGB, Cambridge Five, moles
 * 13. Nuclear Close Calls — Able Archer 83, Stanislav Petrov
 * 14. Reagan's Escalation — SDI, Evil Empire
 * 15. Gorbachev's Reforms — glasnost, perestroika
 * 16. Fall of the Wall & Soviet Dissolution
 * 17. Legacy — NATO expansion, proxy conflicts today
 * 18. Key Figures
 * 19. Arms Race Milestones
 * 20. Proxy Wars Map
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

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
const SOVIET_RED = '#b91c1c';
const NATO_BLUE = '#2563eb';
const OLIVE = '#6b7a2e';
const ORANGE = '#ea580c';
const EMERALD = '#059669';
const CYAN = '#06b6d4';
const SKY = '#0ea5e9';

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

interface ProxyWarEntry {
  region: string;
  conflict: string;
  years: string;
  detail: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Origins ─────────────────────────────────────────────────────────────────

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Yalta Conference (February 1945)',
    detail:
      'In the final months of World War II, Roosevelt, Churchill, and Stalin met at the Crimean resort of Yalta to carve up the postwar world. They agreed to divide Germany into occupation zones, hold free elections in liberated Eastern Europe, and create the United Nations. But the agreements papered over fundamental disagreements. Stalin had no intention of allowing genuinely free elections in Poland or anywhere the Red Army occupied. Roosevelt, gravely ill (he died two months later), believed he could charm Stalin into cooperation. Churchill, more cynical, privately feared the worst. Yalta became shorthand for Western naïveté in the face of Soviet expansionism.',
  },
  {
    label: 'The Iron Curtain Speech (March 1946)',
    detail:
      'At Westminster College in Fulton, Missouri, Winston Churchill — now out of office — delivered the speech that named the new reality: "From Stettin in the Baltic to Trieste in the Adriatic, an Iron Curtain has descended across the Continent." Behind that curtain, Soviet-controlled governments were consolidating power in Poland, Czechoslovakia, Hungary, Romania, Bulgaria, and East Germany. Churchill\'s speech was controversial — many Americans still considered the USSR a wartime ally — but it crystallized the emerging understanding that the Grand Alliance was dead and a new kind of conflict had begun.',
  },
  {
    label: 'The Truman Doctrine (March 1947)',
    detail:
      'When Britain, financially exhausted by WWII, informed Washington it could no longer support Greece and Turkey against communist insurgencies, President Truman went to Congress with a revolutionary proposition: the United States would "support free peoples who are resisting attempted subjugation by armed minorities or by outside pressures." This was the Truman Doctrine — the formal declaration that America would actively contain the spread of communism worldwide. It marked the end of American isolationism and the beginning of a global commitment that would define US foreign policy for the next four decades.',
  },
  {
    label: 'The Marshall Plan (1948–1952)',
    detail:
      'Secretary of State George Marshall proposed the most ambitious foreign aid program in history: $13 billion (roughly $170 billion in today\'s dollars) to rebuild the shattered economies of Western Europe. The plan was strategically brilliant — it rebuilt US trading partners, created goodwill, and made Western Europe prosperous enough to resist communist appeal. Stalin rejected Marshall Plan aid for the Soviet bloc, seeing it correctly as an instrument of American influence. The contrast between recovering Western Europe and stagnating Eastern Europe became one of the Cold War\'s most powerful arguments.',
  },
];

// ── Berlin Blockade & Airlift ───────────────────────────────────────────────

const BERLIN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Crisis (June 1948)',
    detail:
      'When the Western Allies introduced a new currency (the Deutschmark) in their occupation zones — a step toward creating an independent West Germany — Stalin responded by blocking all road, rail, and canal access to West Berlin, deep inside the Soviet zone. Two million West Berliners were cut off from food, fuel, and supplies. Stalin calculated that the West would either abandon Berlin or be forced into a humiliating retreat. Instead, the US and Britain launched an unprecedented airlift.',
  },
  {
    label: 'The Airlift (June 1948 – May 1949)',
    detail:
      'For 462 days, American and British aircraft flew around the clock, delivering everything West Berlin needed to survive — food, coal, medicine, even candy (the famous "Raisin Bombers"). At peak capacity, a plane landed at Tempelhof Airport every 30 seconds. The operation delivered 2.3 million tons of supplies in 278,228 flights. It was a logistical miracle and a propaganda triumph: the Soviets looked like bullies starving civilians, while the Americans looked like heroes saving them. Stalin quietly lifted the blockade in May 1949, having achieved nothing except to accelerate the creation of NATO and West Germany.',
  },
  {
    label: 'The Birth of Two Germanys',
    detail:
      'The blockade crisis accelerated the permanent division of Germany. The Federal Republic of Germany (West Germany) was established in May 1949; the German Democratic Republic (East Germany) followed in October. Berlin itself remained divided — a Western island in a communist sea. The division would last 41 years and produce the Cold War\'s most powerful symbol: the Berlin Wall.',
  },
];

// ── Korean War ──────────────────────────────────────────────────────────────

const KOREA_INSIGHTS: InsightEntry[] = [
  {
    label: 'The First Hot War (1950–1953)',
    detail:
      'Korea was the Cold War\'s first major shooting conflict. When North Korean forces invaded the South in June 1950, the United States intervened under a UN mandate — possible only because the Soviet delegate was boycotting the Security Council. The war drew in China when UN forces pushed too close to the Chinese border, producing a three-year bloodbath that killed approximately 5 million people. It ended in a stalemate at roughly the same border where it began — the 38th parallel.',
  },
  {
    label: 'Setting the Cold War Template',
    detail:
      'Korea established the template for Cold War conflicts: superpower-backed proxy wars fought in the developing world, where the actual countries were secondary to the ideological contest. The US and USSR avoided direct military confrontation — which could trigger nuclear war — but fought through allies, client states, and insurgent movements. Korea also demonstrated the terrible human cost: millions of Koreans died in a war driven primarily by superpower competition, not by Korean choices.',
  },
  {
    label: 'The Lesson of Limited War',
    detail:
      'The Korean War taught both superpowers that total war was no longer an option in the nuclear age. Truman\'s decision to fight a limited war — firing General MacArthur when he pushed for escalation against China — established the principle that Cold War conflicts must be contained to prevent nuclear escalation. This doctrine of restraint, frustrating as it was, probably prevented World War III.',
  },
];

// ── McCarthy Era & Red Scare ────────────────────────────────────────────────

const MCCARTHY_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Fear',
    detail:
      'Between 1947 and 1957, anti-communist hysteria gripped the United States. The fear was not entirely unfounded — Soviet espionage was real, and spies like Klaus Fuchs and the Rosenbergs had transmitted atomic secrets to Moscow. But the response was wildly disproportionate. The House Un-American Activities Committee (HUAC) investigated Hollywood, academia, and government. Loyalty oaths were required for federal employees. Thousands lost their jobs based on innuendo, association, or anonymous accusations. The FBI under J. Edgar Hoover maintained files on millions of Americans.',
  },
  {
    label: 'Senator Joseph McCarthy',
    detail:
      'In February 1950, the obscure junior senator from Wisconsin claimed to hold a list of 205 (later revised to 57, then 81) known communists in the State Department. He never produced evidence for any of them. Yet for four years, McCarthy terrorized Washington, accusing diplomats, generals, and even the US Army of harboring communists. His Senate hearings were televised spectacles of bullying and innuendo. "McCarthyism" became synonymous with reckless accusation and guilt by association — a warning about how fear can corrode democratic institutions.',
  },
  {
    label: 'The Blacklist and Cultural Impact',
    detail:
      'Hollywood\'s blacklist destroyed careers and lives. The "Hollywood Ten" — writers and directors who refused to testify before HUAC — were imprisoned and blacklisted. Hundreds more were denied work based on real or imagined political associations. Writers used pseudonyms; some moved abroad. The chilling effect extended far beyond entertainment: academics self-censored, scientists avoided politically sensitive research, and ordinary Americans feared speaking freely. The Red Scare demonstrated how Cold War paranoia could undermine the very freedoms the West claimed to be defending.',
  },
  {
    label: 'The Fall of McCarthy',
    detail:
      'McCarthy\'s downfall came in 1954 when he attacked the US Army. The Army-McCarthy hearings, televised to millions, exposed his tactics to public scrutiny. Army counsel Joseph Welch\'s famous rebuke — "Have you no sense of decency, sir, at long last?" — became the turning point. The Senate censured McCarthy in December 1954. He died of alcoholism in 1957 at age 48. But McCarthyism\'s legacy endures: it remains the standard reference for political witch hunts and the dangers of unchecked demagogy.',
  },
];

// ── Arms Race ───────────────────────────────────────────────────────────────

const ARMS_RACE_TIMELINE: TimelineEntry[] = [
  {
    year: 'August 1945',
    title: 'Hiroshima and Nagasaki',
    description:
      'The United States drops atomic bombs on Japan — the only wartime use of nuclear weapons. The devastation is beyond comprehension: 70,000–80,000 killed instantly at Hiroshima, another 40,000 at Nagasaki, with tens of thousands more dying from radiation in the following months. The atomic monopoly gives the US enormous geopolitical leverage — but not for long.',
    color: GOLD,
  },
  {
    year: 'August 1949',
    title: 'Soviet Atomic Bomb — "Joe-1"',
    description:
      'The Soviet Union detonates its first atomic bomb (codenamed "Joe-1" by the Americans) at the Semipalatinsk test site in Kazakhstan — years ahead of Western estimates. Soviet physicist Igor Kurchatov led the program, significantly aided by espionage: Klaus Fuchs, a British physicist who had worked at Los Alamos, had been passing atomic secrets to Moscow since 1944. The American nuclear monopoly was over. The arms race had begun.',
    color: SOVIET_RED,
  },
  {
    year: 'November 1952',
    title: 'US Hydrogen Bomb — "Ivy Mike"',
    description:
      'The United States detonates the first thermonuclear (hydrogen) weapon at Enewetak Atoll in the Pacific. The "Ivy Mike" device yields 10.4 megatons — roughly 700 times the Hiroshima bomb. It vaporizes the island of Elugelab, leaving a crater a mile wide and 164 feet deep. The H-bomb works by nuclear fusion (fusing hydrogen isotopes), with no theoretical upper limit on yield. Physicist Edward Teller championed the project; J. Robert Oppenheimer opposed it, arguing it was genocidal by nature.',
    color: NATO_BLUE,
  },
  {
    year: 'August 1953',
    title: 'Soviet Hydrogen Bomb',
    description:
      'The Soviet Union detonates its first thermonuclear device ("Joe-4"), designed by Andrei Sakharov (who later became the USSR\'s most famous dissident). Unlike the room-sized US device, the Soviet weapon was deliverable by aircraft. The thermonuclear arms race was now fully joined. Both nations would build weapons capable of destroying entire metropolitan areas with a single bomb.',
    color: SOVIET_RED,
  },
  {
    year: 'October 1957',
    title: 'Sputnik and the Missile Gap',
    description:
      'The Soviet launch of Sputnik — the first artificial satellite — demonstrated that the USSR had ICBMs capable of reaching the American homeland. The "missile gap" panic swept the US. In reality, the Soviet ICBM capability was extremely limited, but the psychological impact was enormous. The US accelerated its own missile programs: Atlas, Titan, Minuteman. By the early 1960s, both sides had nuclear-tipped ICBMs that could reach each other\'s cities in 30 minutes.',
    color: CRIMSON,
  },
  {
    year: '1960s',
    title: 'MIRV and the Multiplication of Death',
    description:
      'Multiple Independently-targetable Reentry Vehicles (MIRVs) allowed a single missile to carry multiple warheads, each aimed at a different target. A single Minuteman III could carry three warheads; a single Soviet SS-18 could carry ten. MIRVs destabilized the arms race by making a disarming first strike theoretically possible — you could destroy multiple enemy missiles with one of yours. By the 1980s, the combined arsenals exceeded 60,000 nuclear warheads — enough to destroy human civilization many times over.',
    color: PURPLE,
  },
  {
    year: 'October 1961',
    title: 'Tsar Bomba — 50 Megatons',
    description:
      'The Soviet Union detonates the largest nuclear weapon ever built: the "Tsar Bomba" (King of Bombs), yielding 50 megatons — 3,333 times the Hiroshima bomb. The fireball was 5 miles wide. The mushroom cloud rose 42 miles into the atmosphere. Windows were broken 560 miles away. The bomb was designed for 100 megatons but was scaled down for the test. It was militarily impractical — too large to deliver effectively — but served its purpose as a demonstration of raw Soviet power.',
    color: RED,
  },
];

const MAD_INSIGHTS: InsightEntry[] = [
  {
    label: 'Mutually Assured Destruction (MAD)',
    detail:
      'By the 1960s, both superpowers possessed enough nuclear weapons to survive a first strike and still annihilate the attacker in retaliation — a condition called "second-strike capability." This created the doctrine of Mutually Assured Destruction: any nuclear attack would result in the complete destruction of both sides. MAD was a paradox — safety through the guarantee of mutual annihilation. It was terrifying, morally repugnant, and arguably the reason the Cold War never became a hot one. As Winston Churchill put it: "Safety will be the sturdy child of terror, and survival the twin brother of annihilation."',
  },
  {
    label: 'The Nuclear Triad',
    detail:
      'Both superpowers maintained a "triad" of nuclear delivery systems: land-based ICBMs in hardened silos, submarine-launched ballistic missiles (SLBMs) on nuclear-powered submarines, and strategic bombers capable of delivering nuclear gravity bombs or cruise missiles. The triad ensured survivability: even if an enemy first strike destroyed your land-based missiles and bomber bases, nuclear submarines hiding in the ocean depths would still deliver devastating retaliation. The US Navy\'s Ohio-class submarines, each carrying 24 Trident missiles with multiple warheads, could destroy an entire nation from beneath the sea.',
  },
  {
    label: 'Living Under the Bomb',
    detail:
      'The nuclear threat permeated everyday life in ways difficult to imagine today. American schoolchildren practiced "duck and cover" drills. Families built backyard fallout shelters stocked with canned food and water. Civil defense sirens were tested monthly. Maps showed "blast radius" zones for major cities. The Bulletin of the Atomic Scientists\' "Doomsday Clock" became a cultural icon. The psychological burden was immense — an entire generation grew up with the genuine possibility that everything they knew could be vaporized in 30 minutes.',
  },
];

// ── Space Race ──────────────────────────────────────────────────────────────

const SPACE_RACE_TIMELINE: TimelineEntry[] = [
  {
    year: 'October 4, 1957',
    title: 'Sputnik — "The Beep Heard Round the World"',
    description:
      'A 184-pound aluminum sphere transmitting a simple radio beep changed history. Sputnik, the first artificial satellite, was launched by the Soviet Union using a modified R-7 ICBM. Americans could see it crossing the night sky and hear its signal on ham radios. The psychological shock was profound — the communist system, supposedly technologically backward, had beaten the United States into space. Congress panicked, NASA was created, science education was overhauled, and the space race became a central front of the Cold War.',
    color: SOVIET_RED,
  },
  {
    year: 'April 12, 1961',
    title: 'Yuri Gagarin — First Human in Space',
    description:
      'Soviet cosmonaut Yuri Gagarin orbited Earth once aboard Vostok 1, spending 108 minutes in space. He was 27 years old. The flight was a propaganda triumph of the first order — the USSR had put a man in space before the Americans. Gagarin became an international celebrity and a Soviet hero. The flight had been risky: had his reentry capsule failed, the Soviets planned to deny the mission ever happened. President Kennedy, humiliated by another Soviet first, responded by committing the US to landing a man on the Moon by decade\'s end.',
    color: SOVIET_RED,
  },
  {
    year: 'May 25, 1961',
    title: 'Kennedy\'s Moon Challenge',
    description:
      '"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the Moon and returning him safely to the Earth." Kennedy\'s speech to Congress launched the Apollo program — the most expensive peacetime project in American history. The goal was chosen precisely because it was so ambitious that the Soviet head start would not matter. Kennedy privately admitted to NASA chief James Webb that the only justification for the cost was Cold War competition.',
    color: NATO_BLUE,
  },
  {
    year: 'March 18, 1965',
    title: 'Alexei Leonov — First Spacewalk',
    description:
      'Soviet cosmonaut Alexei Leonov became the first human to walk in space, floating outside his Voskhod 2 capsule for 12 minutes. The mission nearly ended in disaster: Leonov\'s spacesuit inflated in the vacuum, making it impossible to re-enter the airlock. He had to bleed air from his suit — risking decompression sickness — to squeeze back inside. The Soviets announced the triumph; the near-catastrophe remained secret for years.',
    color: TEAL,
  },
  {
    year: 'July 20, 1969',
    title: 'Apollo 11 — "One Small Step"',
    description:
      'Neil Armstrong and Buzz Aldrin walked on the Moon while Michael Collins orbited above. An estimated 600 million people watched on television — the largest audience in human history at that point. Armstrong\'s "one small step" line was unscripted. The mission fulfilled Kennedy\'s challenge with five months to spare. It was the Cold War\'s greatest propaganda victory — an achievement so spectacular that the Soviets, who had been leading the space race for a decade, could offer no response. The plaque on the lunar lander read: "We came in peace for all mankind."',
    color: GOLD,
  },
  {
    year: 'July 1975',
    title: 'Apollo–Soyuz: Handshake in Space',
    description:
      'In a gesture of détente, an American Apollo capsule and a Soviet Soyuz spacecraft docked in orbit. American astronaut Thomas Stafford and Soviet cosmonaut Alexei Leonov shook hands through the connecting hatch. It was the first joint US–Soviet space mission and symbolized the thaw in Cold War tensions. The cooperation was genuine but temporary — the space rivalry would resume under Reagan before eventually transforming into the permanent partnership of the International Space Station.',
    color: EMERALD,
  },
];

// ── Cuba ────────────────────────────────────────────────────────────────────

const CUBA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Bay of Pigs (April 1961)',
    detail:
      'Three months into his presidency, Kennedy approved a CIA plan to overthrow Fidel Castro using 1,400 Cuban exiles trained in Guatemala. The invasion at the Bay of Pigs was a catastrophe: the exiles were pinned on the beach, promised air support never materialized, and within 72 hours the entire force was killed or captured. The failure humiliated Kennedy, emboldened Castro, and pushed Cuba closer to the Soviet Union. Castro, now certain the US would try again, secretly invited Soviet nuclear missiles to the island.',
  },
  {
    label: 'The Cuban Missile Crisis (October 14–28, 1962)',
    detail:
      'A U-2 spy plane photographed Soviet medium-range nuclear missiles being installed in Cuba — 90 miles from Florida, capable of hitting Washington in 13 minutes. For 13 days, the world teetered on the edge of nuclear war. Kennedy imposed a naval "quarantine" (blockade) of Cuba. Soviet ships carrying more missiles approached the quarantine line. The Joint Chiefs recommended airstrikes and invasion. Soviet submarine commanders, depth-charged by US destroyers and unable to communicate with Moscow, had nuclear torpedoes and authorization to use them. One submarine commander, Vasili Arkhipov, refused to authorize a nuclear launch — a decision that may have prevented World War III.',
  },
  {
    label: 'The Resolution',
    detail:
      'The crisis was resolved through a combination of backchannel diplomacy, mutual restraint, and sheer luck. Khrushchev agreed to remove the missiles in exchange for a US pledge not to invade Cuba and the secret removal of American Jupiter missiles from Turkey. Kennedy and Khrushchev, both shaken by how close they had come to annihilation, established a direct communication hotline (the "red telephone") between Washington and Moscow. The crisis led directly to the Partial Nuclear Test Ban Treaty of 1963. Kennedy told his brother Bobby: "I now understand what it was like for [Khrushchev]. If anyone is around to write the history of this, they will understand that we were very lucky."',
  },
  {
    label: 'Legacy: The World\'s Closest Call',
    detail:
      'The Cuban Missile Crisis was the closest the Cold War came to nuclear war. Declassified documents later revealed it was even more dangerous than anyone knew at the time: tactical nuclear weapons were already in Cuba and Soviet commanders had pre-delegated authority to use them against a US invasion; Vasili Arkhipov\'s refusal to launch was a near-miraculous act of restraint; and a U-2 pilot accidentally strayed into Soviet airspace during the crisis, nearly triggering a response. The crisis forced both sides to confront the reality that their nuclear arsenals could end civilization — and to begin, however haltingly, the process of arms control.',
  },
];

// ── Vietnam ─────────────────────────────────────────────────────────────────

const VIETNAM_TIMELINE: TimelineEntry[] = [
  {
    year: '1955–1963',
    title: 'Advisors and the Domino Theory',
    description:
      'The US gradually escalated involvement in Vietnam based on the "domino theory" — the belief that if one country fell to communism, its neighbors would follow like dominoes. Eisenhower sent military advisors; Kennedy increased their number to 16,000. The US backed the corrupt South Vietnamese government of Ngo Dinh Diem, whose repression of Buddhists and political opponents made him deeply unpopular. In November 1963, Diem was overthrown and murdered in a coup tacitly approved by the Kennedy administration — three weeks before Kennedy\'s own assassination.',
    color: OLIVE,
  },
  {
    year: 'August 1964',
    title: 'Gulf of Tonkin — The Blank Check',
    description:
      'After reported (and disputed) attacks on US destroyers in the Gulf of Tonkin, Congress passed the Gulf of Tonkin Resolution, giving President Johnson authority to use military force in Southeast Asia without a formal declaration of war. The resolution passed 416–0 in the House and 88–2 in the Senate. It was, effectively, a blank check for escalation. Later evidence showed that the second "attack" almost certainly never happened — the resolution was based on faulty or fabricated intelligence.',
    color: CRIMSON,
  },
  {
    year: '1965–1968',
    title: 'Escalation — "Americanization" of the War',
    description:
      'Johnson sent combat troops in March 1965; by 1968, over 536,000 Americans were in Vietnam. The US dropped more bombs on Vietnam than all sides dropped in all of World War II combined. Operation Rolling Thunder pounded North Vietnam for three years. Yet the Viet Cong and North Vietnamese Army, supplied through the Ho Chi Minh Trail, proved impossible to defeat. The war became a quagmire — each escalation failed to produce victory but made withdrawal politically impossible. The draft brought the war home: 2.7 million Americans served in Vietnam.',
    color: RED,
  },
  {
    year: 'January 1968',
    title: 'The Tet Offensive — Turning Point',
    description:
      'During the Vietnamese New Year (Tet), the North Vietnamese and Viet Cong launched coordinated attacks on over 100 cities and towns across South Vietnam, including a dramatic assault on the US Embassy compound in Saigon. Militarily, Tet was a defeat for the communists — they suffered massive casualties and held no territory. But the political impact was devastating: Americans had been told the war was being won. Tet shattered that illusion. CBS anchor Walter Cronkite declared the war a "stalemate." Johnson\'s approval rating collapsed. He announced he would not seek re-election.',
    color: AMBER,
  },
  {
    year: '1969–1973',
    title: 'Nixon\'s "Vietnamization" and the Pentagon Papers',
    description:
      'Nixon pursued "Vietnamization" — gradually withdrawing US troops while building up South Vietnamese forces — combined with massive bombing campaigns, including the secret bombing of Cambodia. In 1971, the Pentagon Papers — a classified DOD study revealing decades of government lies about the war — were leaked to the New York Times by Daniel Ellsberg. The papers showed that multiple administrations had known the war was unwinnable but continued it for political reasons. Nixon\'s attempts to suppress the Papers led to the Watergate break-in.',
    color: INDIGO,
  },
  {
    year: 'January 1973',
    title: 'Paris Peace Accords',
    description:
      'After prolonged negotiations and the devastating "Christmas Bombing" of Hanoi, the Paris Peace Accords were signed in January 1973. The agreement provided for a ceasefire, withdrawal of US forces, and the return of POWs. Henry Kissinger and Le Duc Tho were awarded the Nobel Peace Prize — Tho refused it, noting that peace had not actually been achieved. He was right: the Accords were essentially a face-saving arrangement for the US withdrawal.',
    color: STEEL,
  },
  {
    year: 'April 30, 1975',
    title: 'Fall of Saigon',
    description:
      'North Vietnamese tanks crashed through the gates of the Presidential Palace in Saigon, ending the Vietnam War. The iconic image of the last helicopter lifting off from the US Embassy rooftop — with desperate Vietnamese trying to climb aboard — became a symbol of American defeat and abandonment. South Vietnam ceased to exist. Vietnam was unified under communist rule. The final US casualty count: 58,220 dead, 153,303 wounded. Vietnamese dead on all sides: an estimated 3 million. The war left deep scars on American society, politics, and military thinking that persist today.',
    color: SOVIET_RED,
  },
];

// ── Détente ──────────────────────────────────────────────────────────────────

const DETENTE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Nixon Opens China (February 1972)',
    detail:
      'In one of the Cold War\'s most dramatic strategic moves, Richard Nixon — the lifelong anti-communist — visited Communist China, meeting with Mao Zedong and Zhou Enlai. The visit exploited the Sino-Soviet split: by establishing relations with China, Nixon created a triangular dynamic that gave the US leverage over both communist powers. The opening was prepared by Henry Kissinger\'s secret trip to Beijing in 1971. "Only Nixon could go to China" became a proverb — sometimes only a hardliner has the credibility to make peace.',
  },
  {
    label: 'SALT I and the ABM Treaty (1972)',
    detail:
      'The Strategic Arms Limitation Talks produced SALT I — the first agreement between the superpowers to limit nuclear arsenals. The treaty froze the number of ICBMs and SLBMs at existing levels. More importantly, the Anti-Ballistic Missile (ABM) Treaty strictly limited missile defense systems, codifying the logic of MAD: if neither side could defend itself against nuclear attack, neither would risk starting one. SALT I didn\'t reduce arsenals — both sides continued modernizing — but it established the principle that nuclear competition could be managed through negotiation.',
  },
  {
    label: 'Helsinki Accords (1975)',
    detail:
      'The Helsinki Final Act, signed by 35 nations, seemed like a Soviet triumph: the West formally recognized the postwar borders of Eastern Europe, implicitly accepting Soviet dominance. But the Accords included human rights provisions — "Basket III" — that became a powerful tool for dissidents. Helsinki Watch groups formed across the Soviet bloc, monitoring compliance and publicizing violations. The Accords gave dissidents like Václav Havel and Andrei Sakharov a framework grounded in agreements their own governments had signed. The seeds of the Soviet bloc\'s collapse were partly planted at Helsinki.',
  },
  {
    label: 'The Limits of Détente',
    detail:
      'Détente never meant the end of Cold War competition — it was a managed rivalry, not a peace. The superpowers continued to compete in the Third World (Angola, Ethiopia, Central America). Both sides continued developing new weapons systems. Conservative critics in the US, led by Senator Henry "Scoop" Jackson and a young Dick Cheney and Donald Rumsfeld, argued that détente was appeasement — that the Soviets were using the breathing space to build military superiority. The Soviet invasion of Afghanistan in 1979 killed détente decisively.',
  },
];

// ── Afghanistan ─────────────────────────────────────────────────────────────

const AFGHANISTAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Soviet Invasion (December 1979)',
    detail:
      'On Christmas Eve 1979, Soviet forces invaded Afghanistan to prop up a failing communist government. The Soviets expected a quick stabilization — like their interventions in Hungary (1956) and Czechoslovakia (1968). Instead, they got a ten-year quagmire. Afghan mujahideen — decentralized guerrilla fighters motivated by Islam and tribal loyalty — proved impossible to defeat in the mountains and valleys. The Soviets committed 100,000+ troops, bombed villages, laid millions of mines, and killed an estimated 1–2 million Afghan civilians. None of it worked.',
  },
  {
    label: 'The CIA and the Mujahideen',
    detail:
      'The US, Saudi Arabia, and Pakistan funneled billions of dollars in weapons and supplies to the mujahideen through Operation Cyclone — one of the largest covert operations in CIA history. The game-changer was the FIM-92 Stinger missile: a shoulder-fired surface-to-air missile that neutralized Soviet helicopter gunships, the backbone of Soviet counterinsurgency tactics. The irony was bitter: some of the fighters the US armed and trained — including networks that became al-Qaeda — would later turn those skills against their former patrons.',
  },
  {
    label: 'The USSR\'s Vietnam',
    detail:
      'Afghanistan became the Soviet Union\'s Vietnam in every sense: a distant, unwinnable war that drained resources, killed young conscripts (15,000+ Soviet dead), demoralized the military, and eroded public support for the regime. Soviet veterans returned to a society that didn\'t understand their sacrifice. The war exposed the rot in the Soviet system — the lies, the incompetence, the gap between propaganda and reality. Gorbachev called it a "bleeding wound" and withdrew Soviet forces in February 1989. Within three years, the Soviet Union itself would cease to exist.',
  },
];

// ── Intelligence War ────────────────────────────────────────────────────────

const INTEL_INSIGHTS: InsightEntry[] = [
  {
    label: 'CIA vs KGB — The Shadow War',
    detail:
      'The Central Intelligence Agency and the Komitet Gosudarstvennoy Bezopasnosti (Committee for State Security) waged a relentless covert war for 44 years. The CIA organized coups (Iran 1953, Guatemala 1954, Chile 1973), ran spy networks inside the Soviet Union, developed satellite surveillance, and conducted psychological operations. The KGB ran agents inside Western governments, stole nuclear and military secrets, conducted assassinations (including the "umbrella murder" of Bulgarian dissident Georgi Markov), and operated a vast system of informants within the Soviet bloc to suppress dissent.',
  },
  {
    label: 'The Cambridge Five',
    detail:
      'The most damaging Soviet spy ring in Western history consisted of five upper-class Englishmen recruited at Cambridge University in the 1930s: Kim Philby, Guy Burgess, Donald Maclean, Anthony Blunt, and John Cairncross. They penetrated the highest levels of British intelligence and diplomacy. Philby rose to become head of the anti-Soviet section of MI6 — the very man responsible for catching Soviet spies was one himself. Burgess and Maclean defected to Moscow in 1951; Philby followed in 1963. Blunt was quietly exposed in 1964 but his treachery was kept secret until 1979. The Cambridge Five compromised countless Western operations and agents, some of whom were executed.',
  },
  {
    label: 'Aldrich Ames and Robert Hanssen',
    detail:
      'Two of the most damaging American traitors were insiders: Aldrich Ames, a CIA counterintelligence officer, and Robert Hanssen, an FBI agent. Ames, motivated by money and resentment, sold the identities of every CIA agent inside the Soviet Union to the KGB between 1985 and 1994 — at least ten were executed. Hanssen spied for the KGB/SVR for 22 years (1979–2001), providing thousands of classified documents. Both men exposed the vulnerability of intelligence agencies to the enemy within — the mole who passes every security check because they are already inside.',
  },
  {
    label: 'Covert Operations and Regime Change',
    detail:
      'Both superpowers used their intelligence agencies to topple governments and install friendly regimes. The CIA orchestrated the overthrow of Iran\'s Mosaddegh (1953), Guatemala\'s Árbenz (1954), Congo\'s Lumumba (1961), and Chile\'s Allende (1973). The KGB supported communist takeovers and suppressed uprisings across the Soviet bloc. These covert operations often had devastating long-term consequences: the 1953 Iran coup, for instance, led directly to the 1979 Iranian Revolution and decades of US-Iranian hostility that continue today.',
  },
];

// ── Nuclear Close Calls ─────────────────────────────────────────────────────

const NUCLEAR_CLOSE_CALLS: InsightEntry[] = [
  {
    label: 'Stanislav Petrov\'s Decision (September 26, 1983)',
    detail:
      'Lieutenant Colonel Stanislav Petrov was the duty officer at the Soviet nuclear early warning center when the system reported five incoming American ICBMs. Soviet protocol required him to report the launch to his superiors, who would almost certainly have ordered a retaliatory nuclear strike. Petrov judged it a false alarm — reasoning that a real US first strike would involve hundreds of missiles, not five — and chose not to report it as an attack. He was right: a satellite had misinterpreted sunlight reflecting off clouds as missile launches. Petrov\'s decision to trust his judgment over the computer may have prevented nuclear war. He received no reward; the incident was hushed up for years.',
  },
  {
    label: 'Able Archer 83 (November 1983)',
    detail:
      'NATO conducted "Able Archer 83," a routine command-post exercise simulating a nuclear war escalation scenario. But 1983 was not a routine year: Reagan\'s "Evil Empire" rhetoric, the deployment of Pershing II missiles in Europe, and the Soviet shoot-down of Korean Air Lines Flight 007 had pushed tensions to their highest point since the Cuban Missile Crisis. Soviet intelligence, primed for an American first strike, interpreted Able Archer as possible cover for a real nuclear attack. Soviet nuclear forces were placed on high alert. KGB stations were ordered to watch for signs of imminent war. The world came closer to accidental nuclear war than anyone realized at the time.',
  },
  {
    label: 'The 1961 Goldsboro Incident',
    detail:
      'A B-52 bomber broke apart over Goldsboro, North Carolina, dropping two Mark 39 hydrogen bombs — each with a yield of 3.8 megatons (250 times Hiroshima). One bomb\'s parachute deployed and it was recovered intact. The other plunged into a muddy field. A declassified report later revealed that on the intact bomb, three of the four safety mechanisms had failed. A single low-voltage switch — the last failsafe — prevented a thermonuclear detonation that would have devastated much of eastern North Carolina and spread fallout over Washington, Baltimore, Philadelphia, and New York.',
  },
  {
    label: 'NORAD False Alarms (1979–1980)',
    detail:
      'On November 9, 1979, NORAD\'s computers showed a massive Soviet nuclear attack underway — 2,200 incoming missiles. Nuclear bombers were scrambled, missile crews prepared to launch. Six minutes later, the alert was confirmed as a false alarm: a training tape simulating a Soviet attack had been accidentally loaded into the live warning system. In June 1980, a failed computer chip caused NORAD screens to flash random numbers of incoming missiles. National Security Advisor Zbigniew Brzezinski was woken at 3 AM and told the US was under nuclear attack. He was about to call President Carter when the all-clear came.',
  },
];

// ── Reagan's Escalation ─────────────────────────────────────────────────────

const REAGAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'The "Evil Empire" (March 1983)',
    detail:
      'Ronald Reagan abandoned the cautious language of détente. In a speech to the National Association of Evangelicals, he called the Soviet Union an "evil empire" and the "focus of evil in the modern world." The phrase horrified the foreign policy establishment but resonated with millions of Americans and, crucially, with dissidents inside the Soviet bloc. Reagan believed — correctly, as it turned out — that the Soviet system was fundamentally weak and that pressure, not accommodation, would bring it down. His confrontational rhetoric, combined with a massive military buildup, defined the final phase of the Cold War.',
  },
  {
    label: 'The Defense Buildup',
    detail:
      'Reagan launched the largest peacetime military buildup in American history, increasing the defense budget by 35% in real terms between 1981 and 1985. New weapons systems included the B-1 bomber, the MX "Peacekeeper" ICBM, the Trident II submarine-launched missile, and the 600-ship Navy. The buildup was designed to force the Soviets into a spending competition they couldn\'t win — their economy, already stagnant, couldn\'t match American military spending without further impoverishing their population. Whether the buildup "caused" the Soviet collapse is debated, but it certainly accelerated it.',
  },
  {
    label: 'SDI — "Star Wars" (March 1983)',
    detail:
      'Reagan proposed the Strategic Defense Initiative (SDI) — a space-based missile defense system that would render nuclear weapons "impotent and obsolete." Scientists were skeptical (the technology was decades away), allies were alarmed (SDI undermined MAD and the ABM Treaty), and Democrats mocked it as "Star Wars." But the Soviets were terrified: if SDI worked, it would neutralize their nuclear deterrent. They couldn\'t afford to match it, and they couldn\'t afford to ignore it. SDI became Reagan\'s most powerful negotiating lever — Gorbachev\'s desperation to stop it drove concessions at Reykjavik and beyond.',
  },
  {
    label: 'Pershing II Missiles in Europe',
    detail:
      'In response to Soviet SS-20 intermediate-range missiles targeting Western Europe, NATO deployed Pershing II missiles in West Germany in November 1983. The Pershings could hit Soviet targets in 6–8 minutes — too fast for Moscow to respond. The deployment triggered the largest peace protests in European history: millions marched in London, Bonn, Amsterdam, and Rome. Soviet leader Yuri Andropov walked out of arms control talks. But Reagan held firm, arguing that only deployment would force the Soviets to negotiate seriously. He was proved right: the INF Treaty of 1987 eliminated the entire class of weapons.',
  },
];

// ── Gorbachev's Reforms ─────────────────────────────────────────────────────

const GORBACHEV_INSIGHTS: InsightEntry[] = [
  {
    label: 'The New Leader (March 1985)',
    detail:
      'When Mikhail Gorbachev became General Secretary at age 54, he was the youngest Soviet leader since Stalin. He inherited a system in deep crisis: the economy was stagnant, the war in Afghanistan was unwinnable, the arms race was unsustainable, and Soviet technology was falling further behind the West. Gorbachev was a true believer in socialism who wanted to reform the system to save it. He did not intend to destroy the Soviet Union — but his reforms, once unleashed, proved impossible to control.',
  },
  {
    label: 'Glasnost (Openness)',
    detail:
      'Glasnost meant transparency — the relaxation of censorship and the opening of public debate. For the first time, Soviet citizens could read honest accounts of Stalinist crimes, discuss the failures of the system, and criticize their government. Banned books were published. Political prisoners were released (including Andrei Sakharov). Newspapers began printing investigative journalism. The effect was explosive: once people were allowed to say what they actually thought, the legitimacy of the entire system came into question. Glasnost was meant to strengthen socialism by making it more honest. Instead, it exposed decades of lies.',
  },
  {
    label: 'Perestroika (Restructuring)',
    detail:
      'Perestroika was Gorbachev\'s program to modernize the Soviet economy by introducing limited market mechanisms — allowing some private enterprise, reducing central planning, and giving factory managers more autonomy. The results were disastrous: half-measures produced the worst of both worlds. The old command economy was disrupted but nothing functional replaced it. Shortages worsened. Lines grew longer. The black market flourished. Gorbachev\'s economic reforms convinced the population that the system was broken without providing a credible alternative.',
  },
  {
    label: 'The Sinatra Doctrine',
    detail:
      'Perhaps Gorbachev\'s most consequential decision was renouncing the Brezhnev Doctrine — the principle that the USSR would use military force to prevent any socialist state from leaving the Soviet bloc (as in Hungary 1956 and Czechoslovakia 1968). Gorbachev\'s spokesman jokingly called the new policy the "Sinatra Doctrine" — each country could do it "My Way." The implications were staggering: without the threat of Soviet tanks, there was nothing holding the Eastern bloc together. Poland, Hungary, Czechoslovakia, East Germany, Bulgaria, and Romania broke free in rapid succession in 1989.',
  },
];

// ── Fall of the Wall & Soviet Dissolution ───────────────────────────────────

const FALL_TIMELINE: TimelineEntry[] = [
  {
    year: 'June 1989',
    title: 'Poland — Solidarity Wins',
    description:
      'Poland held semi-free elections — the first in the Soviet bloc. The Solidarity trade union, led by Lech Wałęsa, won 99 of 100 Senate seats and all contested Sejm seats. A non-communist government took power in a country that had been under Soviet domination for 44 years. Moscow did nothing. The domino theory, which had justified the Vietnam War, now worked in reverse — but against communism.',
    color: GREEN,
  },
  {
    year: 'September 1989',
    title: 'Hungary Opens Its Border',
    description:
      'Hungary dismantled its border fence with Austria, creating the first opening in the Iron Curtain. Thousands of East Germans, ostensibly on vacation in Hungary, flooded through to the West. The East German government was powerless to stop the hemorrhage. The physical Iron Curtain — barbed wire, minefields, guard towers — was coming down.',
    color: TEAL,
  },
  {
    year: 'November 9, 1989',
    title: 'The Berlin Wall Falls',
    description:
      'The most iconic moment of the Cold War\'s end happened almost by accident. An East German spokesman, asked at a press conference when new travel regulations would take effect, fumbled and said "immediately, without delay." Thousands of East Berliners rushed to the Wall. Border guards, overwhelmed and without orders, opened the gates. That night, Berliners from both sides climbed the Wall, danced on it, and began tearing it apart with sledgehammers. Families separated for 28 years embraced in tears. The Cold War\'s most powerful symbol was destroyed in a night of jubilation.',
    color: GOLD,
  },
  {
    year: 'November–December 1989',
    title: 'The Velvet Revolution and Romania',
    description:
      'Czechoslovakia\'s "Velvet Revolution" brought down the communist government through peaceful mass protests; playwright Václav Havel went from prison to the presidency in six weeks. Romania\'s revolution was the only violent one: dictator Nicolae Ceaușescu and his wife Elena were overthrown, tried by a kangaroo court, and executed by firing squad on Christmas Day. Bulgaria\'s communist party quietly reformed itself. The Eastern bloc dissolved in weeks — faster than anyone had predicted.',
    color: PURPLE,
  },
  {
    year: 'October 3, 1990',
    title: 'German Reunification',
    description:
      'Less than a year after the Wall fell, East and West Germany were reunified. The speed was driven by Chancellor Helmut Kohl, who recognized that the window of opportunity might close if Soviet hardliners reasserted control. Gorbachev, remarkably, accepted reunification within NATO — arguably the greatest concession in Cold War history. The economic integration was far harder than expected: East Germany\'s decrepit industries collapsed, unemployment soared, and the psychological divide between "Ossis" and "Wessis" persisted for decades.',
    color: NATO_BLUE,
  },
  {
    year: 'August 19–21, 1991',
    title: 'The Coup That Killed the USSR',
    description:
      'Communist hardliners attempted a coup against Gorbachev, placing him under house arrest at his Crimean dacha. Boris Yeltsin, president of the Russian Federation, climbed atop a tank outside the Russian parliament and rallied resistance. The coup collapsed in three days — the military refused to fire on civilians, KGB units defected, and hundreds of thousands of Muscovites built barricades. The failed coup fatally discredited the Communist Party and accelerated the breakup of the Soviet Union.',
    color: CRIMSON,
  },
  {
    year: 'December 25, 1991',
    title: 'The Soviet Union Dissolves',
    description:
      'On Christmas Day 1991, Mikhail Gorbachev resigned as president of a country that no longer existed. The red Soviet flag with its hammer and sickle was lowered over the Kremlin for the last time, replaced by the Russian tricolor. Fifteen independent republics emerged from the wreckage. The Cold War was over. The ideological contest that had defined the second half of the 20th century, threatened nuclear annihilation, and shaped the lives of billions ended not with a bang but with a bureaucratic dissolution. As Gorbachev handed over the nuclear codes to Yeltsin, 44 years of superpower confrontation simply... stopped.',
    color: SOVIET_RED,
  },
];

// ── Legacy ──────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: 'NATO Expansion — Broken Promises?',
    detail:
      'After the Cold War, NATO expanded eastward — absorbing Poland, Hungary, and the Czech Republic in 1999, then the Baltic states, Romania, Bulgaria, Slovakia, and Slovenia in 2004, and eventually reaching 32 members. Russia has consistently argued that Western leaders promised Gorbachev that NATO would not expand "one inch eastward" — a claim the West disputes. Whatever the truth, NATO expansion became a central Russian grievance, fueling Putin\'s hostility toward the West and contributing to conflicts in Georgia (2008) and Ukraine (2014, 2022). The Cold War\'s institutional architecture survived; its tensions merely transformed.',
  },
  {
    label: 'Proxy Conflicts Still Active',
    detail:
      'Many of the Cold War\'s proxy conflicts never truly ended. The Korean peninsula remains divided and nuclear-armed. Afghanistan, armed and radicalized by Cold War-era interventions, became the incubator for al-Qaeda and the Taliban. US-backed authoritarian regimes in Latin America, the Middle East, and Southeast Asia left legacies of political instability, human rights abuses, and anti-American sentiment. The "War on Terror" was, in many ways, a consequence of Cold War-era decisions — the CIA\'s support for Afghan mujahideen being the most obvious example.',
  },
  {
    label: 'The Nuclear Legacy',
    detail:
      'The Cold War\'s nuclear arsenals have been reduced but not eliminated. The US and Russia still possess approximately 12,000 nuclear warheads between them — more than enough to destroy civilization. Arms control frameworks have eroded: the US withdrew from the ABM Treaty (2002) and the INF Treaty (2019); the New START treaty\'s future is uncertain. New nuclear states (India, Pakistan, North Korea, Israel) have emerged. The risk of nuclear conflict — through accident, miscalculation, or deliberate escalation — remains one of humanity\'s greatest existential threats.',
  },
  {
    label: 'The Triumph of Liberal Democracy?',
    detail:
      'In 1989, political scientist Francis Fukuyama famously declared "The End of History" — arguing that the Cold War\'s conclusion proved that liberal democracy and market capitalism were the final form of human government. For a decade, it seemed plausible. But the 21st century has challenged this thesis: authoritarian capitalism (China), democratic backsliding (Hungary, Turkey, Brazil), the rise of populist nationalism, Russian revanchism, and the persistence of authoritarian regimes worldwide suggest that the ideological contest the Cold War appeared to settle may have merely entered a new phase.',
  },
  {
    label: 'The Human Cost',
    detail:
      'The Cold War killed millions — not through direct superpower conflict, but through proxy wars, covert operations, and the repression of Soviet and US-backed authoritarian regimes. The Korean War: ~5 million dead. Vietnam: ~3 million dead. Afghanistan (Soviet war): ~1–2 million dead. Angola, Mozambique, Ethiopia, Central America, Indonesia — the list of Cold War killing fields stretches across every continent. Add the victims of Stalinist repression, Maoist purges, and US-backed dictatorships, and the total reaches into the tens of millions. The Cold War was "cold" only for those fortunate enough to live in the superpowers\' homelands.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Joseph Stalin',
    years: '1878–1953',
    contribution:
      'Dictator of the Soviet Union from 1924 until his death. His paranoid authoritarianism, aggressive expansionism, and installation of puppet governments across Eastern Europe made the Cold War inevitable. His refusal to allow free elections in occupied countries, the Berlin Blockade, and his approval of the Korean War established the pattern of confrontation. His death in 1953 opened the possibility (partially realized) of reform and reduced tensions.',
  },
  {
    name: 'Harry S. Truman',
    years: '1884–1972',
    contribution:
      'The president who created the architecture of containment: the Truman Doctrine, Marshall Plan, NATO, and the national security state (CIA, NSC, Department of Defense). His decision to fight in Korea, fire MacArthur, and develop the hydrogen bomb shaped the Cold War\'s first decade. Dismissed as a "little man" by contemporaries, he is now regarded as one of the most consequential presidents in American history.',
  },
  {
    name: 'Nikita Khrushchev',
    years: '1894–1971',
    contribution:
      'Succeeded Stalin and denounced his crimes in the "Secret Speech" of 1956, setting off shock waves across the communist world. Crushed the Hungarian Revolution but also pursued "peaceful coexistence." His brinkmanship during the Cuban Missile Crisis brought the world to the edge of nuclear war, but his ultimate restraint may have saved it. Removed from power in 1964 for "hare-brained schemes."',
  },
  {
    name: 'John F. Kennedy',
    years: '1917–1963',
    contribution:
      'Navigated the most dangerous moment in human history — the Cuban Missile Crisis — with a combination of firmness and flexibility that averted nuclear war. Also launched the Apollo program, increased military spending, and escalated US involvement in Vietnam. His assassination in November 1963 has shaped American politics and culture ever since.',
  },
  {
    name: 'Richard Nixon',
    years: '1913–1994',
    contribution:
      'The architect of détente who opened relations with China and negotiated SALT I with the Soviet Union, fundamentally reshaping Cold War diplomacy. Simultaneously escalated the Vietnam War with secret bombings and then withdrew US forces. Resigned in disgrace over Watergate — a scandal rooted in Cold War-era paranoia and abuse of power.',
  },
  {
    name: 'Henry Kissinger',
    years: '1923–2023',
    contribution:
      'Nixon\'s National Security Advisor and Secretary of State, the intellectual architect of détente and the opening to China. A master of realpolitik who valued stability over morality — his policies in Chile, Cambodia, Bangladesh, and East Timor resulted in massive civilian casualties. Nobel Peace Prize laureate (for Vietnam) and war crimes suspect, depending on who you ask. Arguably the most influential and controversial foreign policy figure of the Cold War era.',
  },
  {
    name: 'Ronald Reagan',
    years: '1911–2004',
    contribution:
      'Abandoned détente for confrontation, launching the largest peacetime military buildup in history, proposing SDI, and calling the USSR an "evil empire." His supporters credit him with winning the Cold War through pressure; his critics note that Gorbachev\'s reforms were the decisive factor. At Reykjavik in 1986, Reagan and Gorbachev came tantalizingly close to eliminating all nuclear weapons — an agreement derailed by Reagan\'s refusal to abandon SDI.',
  },
  {
    name: 'Mikhail Gorbachev',
    years: '1931–2022',
    contribution:
      'The last Soviet leader, whose reforms — glasnost, perestroika, the Sinatra Doctrine — unintentionally triggered the collapse of the Soviet empire and the end of the Cold War. Revered in the West as the man who ended the Cold War peacefully; despised by many Russians as the man who destroyed their country. Nobel Peace Prize laureate (1990). History\'s judgment: he tried to save an unreformable system, and his failure liberated hundreds of millions of people.',
  },
  {
    name: 'Fidel Castro',
    years: '1926–2016',
    contribution:
      'Cuba\'s revolutionary leader who brought the Cold War to America\'s doorstep. His revolution (1959), alliance with the Soviet Union, survival of the Bay of Pigs invasion, and role in the Missile Crisis made Cuba the Cold War\'s most dangerous flashpoint. Ruled Cuba for nearly five decades, outlasting ten US presidents and the Soviet Union itself. His survival — 90 miles from Florida — was a permanent irritant to American policymakers.',
  },
  {
    name: 'Ho Chi Minh',
    years: '1890–1969',
    contribution:
      'Vietnamese revolutionary leader who fought French colonialism, then the United States, for three decades. A communist and nationalist whose movement defeated the world\'s greatest military power. He did not live to see the fall of Saigon in 1975, but the city was renamed in his honor. His success in Vietnam shattered American confidence, ended the domino theory, and demonstrated that superpower military might could not defeat a determined guerrilla movement with popular support.',
  },
  {
    name: 'Lech Wałęsa',
    years: 'b. 1943',
    contribution:
      'An electrician at the Gdańsk shipyard who co-founded the Solidarity trade union — the first independent labor union in a communist country. Solidarity\'s struggle, supported by Pope John Paul II and sustained by the Polish people\'s courage, cracked the foundations of Soviet control in Eastern Europe. Wałęsa received the Nobel Peace Prize in 1983 and became Poland\'s first democratically elected president in 1990.',
  },
  {
    name: 'Stanislav Petrov',
    years: '1939–2017',
    contribution:
      'A Soviet lieutenant colonel who may have single-handedly prevented nuclear war. On September 26, 1983, when Soviet early warning systems falsely reported incoming American missiles, Petrov judged it a false alarm and chose not to report it as an attack. He was right. His decision — made alone, under enormous pressure, with millions of lives at stake — is one of the most consequential acts of individual judgment in human history.',
  },
];

// ── Arms Race Milestones ────────────────────────────────────────────────────

const ARMS_MILESTONES: TimelineEntry[] = [
  {
    year: '1945',
    title: 'US: ~6 nuclear weapons',
    description: 'The only nuclear power. Weapons delivered by B-29 bombers.',
    color: NATO_BLUE,
  },
  {
    year: '1949',
    title: 'USSR tests first atomic bomb',
    description: 'The nuclear monopoly ends. Arms race begins.',
    color: SOVIET_RED,
  },
  {
    year: '1952',
    title: 'US: ~1,000 weapons; first H-bomb test',
    description: 'Thermonuclear era begins. Yields measured in megatons.',
    color: NATO_BLUE,
  },
  {
    year: '1955',
    title: 'USSR: ~200 weapons; first H-bomb',
    description: 'Soviet thermonuclear capability achieved.',
    color: SOVIET_RED,
  },
  {
    year: '1960',
    title: 'US: ~18,000 weapons; first SLBMs',
    description: 'Nuclear triad complete. Submarine-launched missiles ensure second-strike.',
    color: NATO_BLUE,
  },
  {
    year: '1961',
    title: 'Tsar Bomba: 50 megatons',
    description: 'Largest nuclear detonation in history. 3,333× Hiroshima.',
    color: SOVIET_RED,
  },
  {
    year: '1966',
    title: 'US: ~31,000 weapons (peak)',
    description: 'Maximum US arsenal. Enough to destroy civilization many times over.',
    color: NATO_BLUE,
  },
  {
    year: '1972',
    title: 'SALT I signed',
    description: 'First arms limitation agreement. ABM Treaty codifies MAD.',
    color: EMERALD,
  },
  {
    year: '1986',
    title: 'USSR: ~40,000 weapons (peak)',
    description: 'Combined arsenals exceed 60,000 warheads. Maximum overkill.',
    color: SOVIET_RED,
  },
  {
    year: '1987',
    title: 'INF Treaty',
    description: 'Eliminates all intermediate-range nuclear missiles. First reduction treaty.',
    color: EMERALD,
  },
  {
    year: '1991',
    title: 'START I signed',
    description: 'Reduces strategic warheads to 6,000 per side. Cold War ends.',
    color: EMERALD,
  },
];

// ── Proxy Wars ──────────────────────────────────────────────────────────────

const PROXY_WARS: ProxyWarEntry[] = [
  {
    region: 'East Asia',
    conflict: 'Korean War',
    years: '1950–1953',
    detail: '~5 million dead. Peninsula divided to this day. US and China fought directly.',
    color: CRIMSON,
  },
  {
    region: 'Southeast Asia',
    conflict: 'Vietnam War',
    years: '1955–1975',
    detail: '~3 million dead. US deployed 2.7 million troops. North Vietnam prevailed.',
    color: RED,
  },
  {
    region: 'Central America',
    conflict: 'Nicaragua, El Salvador, Guatemala',
    years: '1979–1992',
    detail: 'US-backed contras and death squads vs Soviet/Cuban-backed leftist movements. ~300,000 dead.',
    color: ORANGE,
  },
  {
    region: 'Southern Africa',
    conflict: 'Angola & Mozambique Civil Wars',
    years: '1975–2002',
    detail: 'Cuban troops, Soviet weapons, CIA funding, South African intervention. Combined ~1.5 million dead.',
    color: AMBER,
  },
  {
    region: 'Horn of Africa',
    conflict: 'Ethiopia–Somalia (Ogaden War)',
    years: '1977–1978',
    detail: 'Superpowers switched sides mid-conflict. Cuban forces tipped the balance for Ethiopia.',
    color: GOLD,
  },
  {
    region: 'Middle East',
    conflict: 'Arab–Israeli Wars / Lebanon',
    years: '1967–1982',
    detail: 'US armed Israel; USSR armed Egypt, Syria, Iraq. Multiple wars with superpower-supplied weapons.',
    color: TEAL,
  },
  {
    region: 'South Asia',
    conflict: 'Soviet–Afghan War',
    years: '1979–1989',
    detail: '~1–2 million Afghans dead. CIA armed mujahideen. "USSR\'s Vietnam." Led to Taliban/al-Qaeda.',
    color: OLIVE,
  },
  {
    region: 'Caribbean',
    conflict: 'Cuba, Grenada',
    years: '1961–1983',
    detail: 'Bay of Pigs, Missile Crisis, US invasion of Grenada (1983). Cold War on America\'s doorstep.',
    color: INDIGO,
  },
  {
    region: 'South America',
    conflict: 'Chile, Argentina (Operation Condor)',
    years: '1973–1990',
    detail: 'CIA-backed coups, military dictatorships, state terror. Tens of thousands disappeared.',
    color: PURPLE,
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

const FIGURE_COLORS = [SOVIET_RED, NATO_BLUE, CRIMSON, STEEL, GREEN, RED, ICE_BLUE, AMBER, ROSE, GOLD, PURPLE, TEAL];

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

function ProxyWarGrid({ wars }: { wars: ProxyWarEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {wars.map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${w.color}33`,
            borderRadius: 10,
            padding: 18,
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: w.color,
              marginBottom: 4,
            }}
          >
            {w.region} — {w.years}
          </p>
          <h4
            style={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: 6,
              fontSize: '1.05rem',
            }}
          >
            {w.conflict}
          </h4>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {w.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function ColdWarPage() {
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
            &larr; Back to Chronicle
          </Link>
        </div>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ paddingTop: 48, paddingBottom: 32 }}
        >
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 16,
              background: `linear-gradient(135deg, ${NATO_BLUE}, ${SOVIET_RED})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Cold War
          </h1>
          <p style={{ fontSize: '1.2rem', color: ASH, maxWidth: 700 }}>
            1947–1991
          </p>
          <p
            style={{
              fontSize: '1.05rem',
              color: ASH,
              lineHeight: 1.8,
              maxWidth: 800,
              marginTop: 16,
            }}
          >
            For 44 years, two superpowers — the United States and the Soviet Union — waged an
            ideological, military, economic, and technological contest that shaped every corner of
            the globe. They never fought each other directly, but their rivalry killed millions in
            proxy wars, brought the world to the brink of nuclear annihilation, put humans on the
            Moon, and ultimately determined the political order of the 21st century. This is the
            story of the Cold War — from the Iron Curtain to the fall of the Berlin Wall.
          </p>
        </motion.header>

        {/* ── Table of Contents ─────────────────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: 20,
            marginBottom: 32,
          }}
        >
          <h3 style={{ fontWeight: 600, marginBottom: 12, color: '#f1f5f9' }}>Contents</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 6,
            }}
          >
            {[
              ['#origins', 'Origins: Yalta to Truman Doctrine'],
              ['#berlin', 'Berlin Blockade & Airlift'],
              ['#korea', 'Korean War'],
              ['#mccarthy', 'McCarthy Era & Red Scare'],
              ['#arms-race', 'The Arms Race'],
              ['#space-race', 'The Space Race'],
              ['#cuba', 'Cuba: Bay of Pigs to Missile Crisis'],
              ['#vietnam', 'Vietnam'],
              ['#detente', 'Detente'],
              ['#afghanistan', 'Soviet Afghanistan'],
              ['#intel', 'The Intelligence War'],
              ['#nuclear-close-calls', 'Nuclear Close Calls'],
              ['#reagan', "Reagan's Escalation"],
              ['#gorbachev', "Gorbachev's Reforms"],
              ['#fall', 'Fall of the Wall'],
              ['#legacy', 'Cold War Legacy'],
              ['#figures', 'Key Figures'],
              ['#milestones', 'Arms Race Milestones'],
              ['#proxy-wars', 'Proxy Wars Map'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '4px 0',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.nav>

        {/* ── Origins ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="&#9760;"
          title="Origins: From Allies to Adversaries"
          accentColor={STEEL}
          intro="The Cold War did not begin with a single event but emerged from the collapse of the wartime alliance between the United States and the Soviet Union. Two incompatible visions of the postwar world — one based on liberal democracy and open markets, the other on Marxist-Leninist ideology and state control — could not coexist. By 1947, the Grand Alliance was dead, replaced by mutual suspicion, ideological hostility, and the gathering storm of superpower confrontation."
        >
          <InsightGrid items={ORIGINS_INSIGHTS} />
        </SectionWrapper>

        {/* ── Berlin ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="berlin"
          icon="&#9992;"
          title="Berlin Blockade & Airlift (1948–1949)"
          accentColor={NATO_BLUE}
          intro="The first great crisis of the Cold War. When Stalin blockaded West Berlin — a Western island deep inside Soviet-controlled East Germany — the United States and Britain responded not with tanks but with transport planes, flying in everything a city of two million needed to survive."
        >
          <InsightGrid items={BERLIN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Korea ────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="korea"
          icon="&#9876;"
          title="The Korean War (1950–1953)"
          accentColor={CRIMSON}
          intro="The Cold War's first hot war — and the template for every proxy conflict that followed. Five million people died in a war that began with a surprise invasion, drew in the United States and China, and ended in a stalemate that persists to this day."
        >
          <InsightGrid items={KOREA_INSIGHTS} />
          <div style={{ marginTop: 16 }}>
            <Link
              to="/korean-war"
              style={{
                color: '#60a5fa',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              Read the full Korean War deep-dive &rarr;
            </Link>
          </div>
        </SectionWrapper>

        {/* ── McCarthy ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="mccarthy"
          icon="&#128269;"
          title="McCarthy Era & Red Scare"
          accentColor={ROSE}
          intro="The Cold War was not just fought abroad — it consumed American domestic life. The fear of communist infiltration, fueled by genuine espionage cases and amplified by political opportunists, produced one of the darkest chapters in American democracy: blacklists, loyalty oaths, ruined careers, and the rise of Senator Joseph McCarthy."
        >
          <InsightGrid items={MCCARTHY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Arms Race ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="arms-race"
          icon="&#9762;"
          title="The Arms Race"
          accentColor={RED}
          intro="From Hiroshima to arsenals capable of destroying human civilization many times over — the nuclear arms race was the Cold War's most terrifying dimension. Both superpowers built weapons of unimaginable destructive power, knowing that using them would mean the end of everything."
        >
          <TimelineCard entries={ARMS_RACE_TIMELINE} />
          <div style={{ marginTop: 32 }}>
            <h3 style={{ color: AMBER, fontWeight: 600, marginBottom: 16, fontSize: '1.3rem' }}>
              Mutually Assured Destruction
            </h3>
            <InsightGrid items={MAD_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── Space Race ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="space-race"
          icon="&#128640;"
          title="The Space Race"
          accentColor={CYAN}
          intro="The competition to conquer space was the Cold War's most inspiring dimension — a contest of engineering genius, national prestige, and human courage. It produced some of humanity's greatest achievements, driven entirely by superpower rivalry."
        >
          <TimelineCard entries={SPACE_RACE_TIMELINE} />
        </SectionWrapper>

        {/* ── Cuba ─────────────────────────────────────────────────────── */}
        <SectionWrapper
          id="cuba"
          icon="&#127466;"
          title="Cuba: 13 Days That Nearly Ended the World"
          accentColor={ORANGE}
          intro="The Cold War's most dangerous episode. In October 1962, the discovery of Soviet nuclear missiles in Cuba — 90 miles from Florida — brought the world closer to nuclear annihilation than at any time before or since."
        >
          <InsightGrid items={CUBA_INSIGHTS} />
        </SectionWrapper>

        {/* ── Vietnam ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="vietnam"
          icon="&#127811;"
          title="Vietnam: The Quagmire"
          accentColor={OLIVE}
          intro="America's longest and most divisive Cold War conflict. What began as a few hundred military advisors escalated into a full-scale war that consumed 58,220 American lives, an estimated 3 million Vietnamese lives, tore American society apart, and ended in the fall of Saigon — the most traumatic defeat in US history."
        >
          <TimelineCard entries={VIETNAM_TIMELINE} />
        </SectionWrapper>

        {/* ── Détente ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="detente"
          icon="&#129309;"
          title="Detente: The Thaw"
          accentColor={EMERALD}
          intro="In the early 1970s, exhausted by Vietnam and alarmed by the nuclear arms race, the superpowers sought to manage their rivalry through negotiation rather than confrontation. Detente brought arms control agreements, diplomatic breakthroughs, and a brief respite from the most dangerous aspects of the Cold War."
        >
          <InsightGrid items={DETENTE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Afghanistan ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="afghanistan"
          icon="&#9968;"
          title="Soviet Afghanistan: The USSR's Vietnam"
          accentColor={AMBER}
          intro="In December 1979, the Soviet Union invaded Afghanistan — expecting a quick stabilization and getting a ten-year quagmire that drained Soviet resources, demoralized the military, and accelerated the collapse of the Soviet system."
        >
          <InsightGrid items={AFGHANISTAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Intelligence War ─────────────────────────────────────────── */}
        <SectionWrapper
          id="intel"
          icon="&#128373;"
          title="The Intelligence War: CIA vs KGB"
          accentColor={INDIGO}
          intro="Behind the public diplomacy and military posturing, the Cold War's shadow war raged continuously. Intelligence agencies on both sides ran spy networks, conducted covert operations, toppled governments, and tried to penetrate each other's deepest secrets."
        >
          <InsightGrid items={INTEL_INSIGHTS} />
        </SectionWrapper>

        {/* ── Nuclear Close Calls ──────────────────────────────────────── */}
        <SectionWrapper
          id="nuclear-close-calls"
          icon="&#9888;"
          title="Nuclear Close Calls"
          accentColor={GOLD}
          intro="The Cold War nearly became a hot nuclear war on multiple occasions — not through deliberate decision, but through accidents, false alarms, and miscalculation. The margin between survival and annihilation was often terrifyingly thin."
        >
          <InsightGrid items={NUCLEAR_CLOSE_CALLS} />
        </SectionWrapper>

        {/* ── Reagan ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="reagan"
          icon="&#127482;"
          title="Reagan's Escalation: Pressure, Not Accommodation"
          accentColor={SKY}
          intro="Ronald Reagan abandoned detente and confronted the Soviet Union with the largest peacetime military buildup in history, aggressive rhetoric, and the promise of space-based missile defense. His strategy was simple: force the Soviets into a competition they couldn't afford to win."
        >
          <InsightGrid items={REAGAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Gorbachev ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="gorbachev"
          icon="&#9733;"
          title="Gorbachev's Reforms: The Unintended Revolution"
          accentColor={TEAL}
          intro="Mikhail Gorbachev came to power in 1985 intending to reform the Soviet system and save it. His policies of glasnost (openness) and perestroika (restructuring) instead unleashed forces that destroyed the Soviet Union and ended the Cold War."
        >
          <InsightGrid items={GORBACHEV_INSIGHTS} />
        </SectionWrapper>

        {/* ── Fall of the Wall ─────────────────────────────────────────── */}
        <SectionWrapper
          id="fall"
          icon="&#127751;"
          title="The Fall: 1989–1991"
          accentColor={GOLD}
          intro="The end came faster than anyone predicted. In 1989, the Iron Curtain disintegrated in months. By 1991, the Soviet Union itself was gone. The most consequential geopolitical transformation since World War II happened largely peacefully — a near-miracle given the nuclear arsenals involved."
        >
          <TimelineCard entries={FALL_TIMELINE} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="&#127760;"
          title="Cold War Legacy"
          accentColor={PURPLE}
          intro="The Cold War ended over three decades ago, but its consequences continue to shape the world. From NATO expansion to nuclear proliferation to unresolved proxy conflicts, the 21st century remains haunted by decisions made during the 44-year confrontation between Washington and Moscow."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="&#128100;"
          title="Key Figures"
          accentColor={ICE_BLUE}
          intro="The Cold War was shaped by leaders, strategists, spies, and individuals whose decisions — sometimes made in seconds — determined the fate of millions."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Arms Race Milestones ─────────────────────────────────────── */}
        <SectionWrapper
          id="milestones"
          icon="&#128200;"
          title="Arms Race Milestones"
          accentColor={RED}
          intro="The trajectory of nuclear arsenals — from a handful of weapons in 1945 to over 60,000 combined warheads at peak, and the slow process of arms control that followed."
        >
          <TimelineCard entries={ARMS_MILESTONES} />
        </SectionWrapper>

        {/* ── Proxy Wars ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="proxy-wars"
          icon="&#127758;"
          title="Proxy Wars Across the Globe"
          accentColor={ORANGE}
          intro="The Cold War was 'cold' only for those living in the superpowers' homelands. Across Asia, Africa, Latin America, and the Middle East, millions died in wars fueled by superpower rivalry."
        >
          <ProxyWarGrid wars={PROXY_WARS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer
          style={{
            padding: '48px 0 64px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}
        >
          <p style={{ color: STEEL, fontSize: '0.85rem', lineHeight: 1.6 }}>
            The Cold War (1947–1991) — 44 years of superpower confrontation that shaped the modern world.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              marginTop: 16,
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            &larr; Back to Chronicle
          </Link>
        </footer>
      </div>
    </div>
  );
}
