/**
 * ColdWarPage — comprehensive Cold War timeline (1947–1991).
 *
 * Route: /cold-war
 *
 * Sections:
 *  1. Hero — title, subtitle, key stats
 *  2. Filter bar — by category (Military, Political, Space, Nuclear, Cultural)
 *  3. Timeline — 35+ events with threat-level indicators
 *  4. US vs USSR Scoreboard — proxy wars, space race milestones
 *  5. Nuclear Arsenal Chart — warhead counts over time (SVG)
 *  6. Proxy Conflict Map — text-based world map of proxy wars
 *  7. "What If?" — three nuclear near-misses
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type EventCategory = 'Military' | 'Political' | 'Space' | 'Nuclear' | 'Cultural';

interface ColdWarEvent {
  year: string;
  title: string;
  description: string;
  category: EventCategory;
  threatLevel: number | null; // 0–10 nuclear threat, null if N/A
  side: 'US' | 'USSR' | 'Both' | 'Neither';
}

interface ScoreEntry {
  category: string;
  us: string;
  ussr: string;
}

interface ArsenalDataPoint {
  year: number;
  us: number;
  ussr: number;
}

interface ProxyConflict {
  region: string;
  conflicts: { name: string; years: string; usBacked: string; ussrBacked: string; outcome: string }[];
}

interface NearMiss {
  title: string;
  year: number;
  threatLevel: number;
  summary: string;
  whatIf: string;
  keyFigure: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<EventCategory, string> = {
  Military: '#ef4444',
  Political: '#a855f7',
  Space: '#3b82f6',
  Nuclear: '#f59e0b',
  Cultural: '#22c55e',
};

const CATEGORY_ICONS: Record<EventCategory, string> = {
  Military: '\u2694\uFE0F',
  Political: '\uD83C\uDFDB\uFE0F',
  Space: '\uD83D\uDE80',
  Nuclear: '\u2622\uFE0F',
  Cultural: '\uD83C\uDF0D',
};

const STAGGER = 0.04;

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const EVENTS: ColdWarEvent[] = [
  { year: '1947', title: 'Truman Doctrine', description: 'US pledges to contain communism worldwide, offering military and economic aid to Greece and Turkey. Marks the formal start of Cold War foreign policy.', category: 'Political', threatLevel: 3, side: 'US' },
  { year: '1948', title: 'Marshall Plan', description: '$12 billion in economic aid to rebuild Western Europe. 16 nations participate; Stalin forbids Eastern Bloc from joining. Creates economic iron curtain.', category: 'Political', threatLevel: 2, side: 'US' },
  { year: '1948–49', title: 'Berlin Blockade & Airlift', description: 'Soviet Union blocks all ground access to West Berlin. Allies respond with 277,000 flights over 15 months, delivering 2.3 million tons of supplies. Stalin lifts blockade.', category: 'Military', threatLevel: 5, side: 'Both' },
  { year: '1949', title: 'NATO Founded', description: 'North Atlantic Treaty Organization established with 12 founding members. Article 5: an attack on one is an attack on all. Formalizes Western military alliance.', category: 'Military', threatLevel: 4, side: 'US' },
  { year: '1949', title: 'Soviet Atomic Bomb', description: 'USSR detonates "First Lightning" (Joe-1), ending the US nuclear monopoly. Arms race begins in earnest. US accelerates hydrogen bomb development.', category: 'Nuclear', threatLevel: 6, side: 'USSR' },
  { year: '1950–53', title: 'Korean War', description: 'First hot proxy war of the Cold War. North Korea invades South; UN forces push back; China intervenes. 36,000 US dead, ~2.5 million total casualties. Ends in armistice, not peace treaty.', category: 'Military', threatLevel: 7, side: 'Both' },
  { year: '1953', title: 'Stalin Dies', description: 'Joseph Stalin dies of a cerebral hemorrhage. Khrushchev eventually consolidates power and begins de-Stalinization, denouncing Stalin\'s cult of personality in 1956.', category: 'Political', threatLevel: 3, side: 'USSR' },
  { year: '1956', title: 'Hungarian Revolution', description: 'Hungarians revolt against Soviet-imposed government. Brief success before Soviet tanks crush the uprising. ~2,500 killed, 200,000 flee as refugees. West condemns but does not intervene.', category: 'Political', threatLevel: 5, side: 'USSR' },
  { year: '1957', title: 'Sputnik Launched', description: 'USSR launches first artificial satellite. 184-pound sphere orbits Earth every 96 minutes. America panics — "Sputnik crisis" triggers massive education and defense spending.', category: 'Space', threatLevel: 4, side: 'USSR' },
  { year: '1958', title: 'NASA Founded', description: 'National Aeronautics and Space Administration created as US response to Sputnik. Consolidates military and civilian space programs under one civilian agency.', category: 'Space', threatLevel: 2, side: 'US' },
  { year: '1959', title: 'Cuban Revolution', description: 'Fidel Castro overthrows US-backed Batista regime. Cuba becomes communist ally 90 miles from Florida. Sugar industry nationalized, US assets seized.', category: 'Political', threatLevel: 5, side: 'USSR' },
  { year: '1960', title: 'U-2 Incident', description: 'CIA pilot Gary Powers shot down over Soviet airspace in U-2 spy plane. US initially claims weather research plane; Khrushchev reveals wreckage and living pilot. Paris summit collapses.', category: 'Military', threatLevel: 5, side: 'Both' },
  { year: '1961', title: 'Berlin Wall Built', description: 'East Germany constructs 155 km barrier overnight, Aug 12–13. Divides families, seals Iron Curtain physically. Over 140 people killed attempting to cross before its fall.', category: 'Political', threatLevel: 6, side: 'USSR' },
  { year: '1961', title: 'Bay of Pigs Invasion', description: 'CIA-trained Cuban exiles attempt to overthrow Castro. Invasion fails within 72 hours. 114 killed, 1,189 captured. Humiliation for Kennedy; pushes Cuba closer to USSR.', category: 'Military', threatLevel: 5, side: 'US' },
  { year: '1962', title: 'Cuban Missile Crisis', description: '13 days in October — closest the world came to nuclear war. Soviet nuclear missiles discovered in Cuba. Naval blockade, backchannel negotiations. Kennedy and Khrushchev step back from the brink.', category: 'Nuclear', threatLevel: 10, side: 'Both' },
  { year: '1963', title: 'Moscow–Washington Hotline', description: 'Direct teletype communication link established between the Pentagon and the Kremlin. Born from the missile crisis realization that leaders couldn\'t communicate fast enough.', category: 'Political', threatLevel: null, side: 'Both' },
  { year: '1963', title: 'JFK Assassinated', description: 'President John F. Kennedy shot in Dallas, Texas, November 22. Lyndon Johnson assumes presidency. Cold War continues under new leadership; conspiracy theories proliferate for decades.', category: 'Political', threatLevel: 4, side: 'US' },
  { year: '1964–73', title: 'Vietnam War Escalation', description: 'Gulf of Tonkin Resolution gives Johnson war powers. US troop levels peak at 543,000. 58,220 US dead, ~2 million Vietnamese dead. Largest and most divisive proxy war of the Cold War.', category: 'Military', threatLevel: 6, side: 'Both' },
  { year: '1968', title: 'Prague Spring Crushed', description: 'Czechoslovakia\'s Alexander Dubček introduces "socialism with a human face." Soviet Union invades with 200,000 Warsaw Pact troops. Reforms reversed. Brezhnev Doctrine: Moscow will intervene to protect socialism.', category: 'Political', threatLevel: 5, side: 'USSR' },
  { year: '1969', title: 'Moon Landing', description: 'Apollo 11: Neil Armstrong and Buzz Aldrin walk on the moon, July 20. "One small step for man, one giant leap for mankind." US decisively wins the space race.', category: 'Space', threatLevel: null, side: 'US' },
  { year: '1972', title: 'Nixon Visits China', description: 'President Nixon\'s historic visit to Beijing. Exploits Sino-Soviet split to create triangular diplomacy. "The week that changed the world." Reshapes Cold War geopolitics.', category: 'Political', threatLevel: null, side: 'US' },
  { year: '1972', title: 'SALT I Signed', description: 'First Strategic Arms Limitation Treaty. Freezes number of ICBM and SLBM launchers. ABM Treaty limits anti-ballistic missile systems. First arms control agreement of nuclear age.', category: 'Nuclear', threatLevel: null, side: 'Both' },
  { year: '1975', title: 'Fall of Saigon', description: 'North Vietnamese forces capture Saigon, April 30. Iconic helicopter evacuation from US Embassy rooftop. Vietnam reunified under communist rule. US\'s most significant Cold War defeat.', category: 'Military', threatLevel: 3, side: 'Both' },
  { year: '1975', title: 'Helsinki Accords', description: '35 nations sign agreement recognizing post-WWII European borders. Includes human rights provisions that become tools for Eastern European dissidents. Sovereignty vs. human rights bargain.', category: 'Political', threatLevel: null, side: 'Both' },
  { year: '1979', title: 'Soviet Invasion of Afghanistan', description: 'USSR deploys 100,000 troops to prop up communist government. Mujahideen resistance, backed by CIA. 15,000 Soviet dead over 10 years. USSR\'s Vietnam — contributes to Soviet collapse.', category: 'Military', threatLevel: 7, side: 'USSR' },
  { year: '1980', title: 'Solidarity Movement', description: 'Polish trade union led by Lech Wałęsa grows to 10 million members. First independent labor union in a Soviet-bloc country. Martial law declared 1981. Seeds of Eastern European revolution.', category: 'Cultural', threatLevel: 4, side: 'Neither' },
  { year: '1983', title: 'Reagan "Evil Empire" Speech', description: 'President Reagan labels the Soviet Union "an evil empire" and "the focus of evil in the modern world." Signals end of détente. Announces Strategic Defense Initiative ("Star Wars").', category: 'Political', threatLevel: 7, side: 'US' },
  { year: '1983', title: 'Able Archer 83', description: 'NATO nuclear war exercise nearly triggers Soviet first strike. KGB interprets exercise as cover for real attack. Soviet nuclear forces placed on highest alert. West unaware of how close war came.', category: 'Nuclear', threatLevel: 9, side: 'Both' },
  { year: '1983', title: 'Petrov Incident', description: 'Soviet Lt. Col. Stanislav Petrov\'s early warning system reports 5 incoming US ICBMs. Petrov judges it a false alarm and does not report up the chain. He was right — satellite malfunction. One man arguably saves the world.', category: 'Nuclear', threatLevel: 9, side: 'USSR' },
  { year: '1985', title: 'Gorbachev Takes Power', description: 'Mikhail Gorbachev becomes Soviet General Secretary at age 54. Introduces glasnost (openness) and perestroika (restructuring). Begins the reforms that will inadvertently dissolve the USSR.', category: 'Political', threatLevel: 3, side: 'USSR' },
  { year: '1986', title: 'Chernobyl Disaster', description: 'Reactor No. 4 at Chernobyl Nuclear Power Plant explodes, April 26. Soviet cover-up attempt fails as radiation detected in Sweden. Glasnost tested; Soviet system\'s credibility destroyed.', category: 'Nuclear', threatLevel: 4, side: 'USSR' },
  { year: '1987', title: 'INF Treaty Signed', description: 'Intermediate-Range Nuclear Forces Treaty eliminates all ground-launched missiles with 500–5,500 km range. 2,692 missiles destroyed. Reagan and Gorbachev sign at Washington summit.', category: 'Nuclear', threatLevel: null, side: 'Both' },
  { year: '1989', title: 'Fall of the Berlin Wall', description: 'November 9 — East German government opens border crossings. Thousands pour through. Berliners tear down the Wall with hammers and picks. Symbol of Cold War\'s end. "Ich bin ein Berliner" fulfilled.', category: 'Political', threatLevel: null, side: 'Both' },
  { year: '1989', title: 'Tiananmen Square', description: 'Pro-democracy protests in Beijing crushed by Chinese military, June 4. Hundreds to thousands killed. China chooses economic reform without political liberalization — a different path from the Soviet bloc.', category: 'Political', threatLevel: 3, side: 'Neither' },
  { year: '1990', title: 'German Reunification', description: 'East and West Germany reunified on October 3. Helmholtz Kohl negotiates with Gorbachev. NATO membership for unified Germany. Cold War\'s most visible wound healed.', category: 'Political', threatLevel: null, side: 'Both' },
  { year: '1991', title: 'Soviet Union Dissolved', description: 'December 25 — Gorbachev resigns as Soviet president. Hammer and sickle lowered over the Kremlin for the last time. 15 republics become independent nations. Cold War ends not with a bang, but a bureaucratic whimper.', category: 'Political', threatLevel: null, side: 'Both' },
];

const SCOREBOARD: ScoreEntry[] = [
  { category: 'Proxy Wars Won', us: 'Guatemala (54), Dominican Rep (65), Grenada (83)', ussr: 'China (49), Cuba (59), Vietnam (75), Angola (75)' },
  { category: 'Space — First Milestones', us: 'Moon landing (69), Space Shuttle (81), GPS', ussr: 'First satellite (57), First human (61), First spacewalk (65), First station (71)' },
  { category: 'Nuclear Tests', us: '1,032 tests', ussr: '715 tests' },
  { category: 'Peak Warheads', us: '31,255 (1967)', ussr: '45,000 (1986)' },
  { category: 'Olympic Boycotts', us: 'Boycotted Moscow 1980', ussr: 'Boycotted LA 1984' },
  { category: 'Alliance Members', us: 'NATO: 16 nations by 1991', ussr: 'Warsaw Pact: 8 nations' },
  { category: 'Intelligence Agencies', us: 'CIA (1947), NSA (1952)', ussr: 'KGB (1954), GRU' },
  { category: 'Defections (notable)', us: 'Attracted: ~40 major defectors', ussr: 'Lost: Gordievsky, Penkovsky, many others' },
];

const ARSENAL_DATA: ArsenalDataPoint[] = [
  { year: 1945, us: 2, ussr: 0 },
  { year: 1949, us: 170, ussr: 1 },
  { year: 1953, us: 1169, ussr: 120 },
  { year: 1955, us: 3057, ussr: 200 },
  { year: 1960, us: 18638, ussr: 1605 },
  { year: 1965, us: 31139, ussr: 6129 },
  { year: 1967, us: 31255, ussr: 8339 },
  { year: 1970, us: 26119, ussr: 11643 },
  { year: 1975, us: 27052, ussr: 19443 },
  { year: 1980, us: 24304, ussr: 30062 },
  { year: 1985, us: 23368, ussr: 39197 },
  { year: 1986, us: 23317, ussr: 45000 },
  { year: 1990, us: 21004, ussr: 37000 },
  { year: 1991, us: 19008, ussr: 35000 },
];

const PROXY_CONFLICTS: ProxyConflict[] = [
  {
    region: 'East Asia',
    conflicts: [
      { name: 'Korean War', years: '1950–53', usBacked: 'South Korea', ussrBacked: 'North Korea + China', outcome: 'Stalemate (armistice)' },
      { name: 'Vietnam War', years: '1955–75', usBacked: 'South Vietnam', ussrBacked: 'North Vietnam', outcome: 'Communist victory' },
    ],
  },
  {
    region: 'Latin America',
    conflicts: [
      { name: 'Cuban Revolution', years: '1953–59', usBacked: 'Batista regime', ussrBacked: 'Castro\'s forces', outcome: 'Communist victory' },
      { name: 'Guatemalan Coup', years: '1954', usBacked: 'Castillo Armas', ussrBacked: 'Árbenz gov\'t', outcome: 'US-backed coup succeeds' },
      { name: 'Chilean Coup', years: '1973', usBacked: 'Pinochet', ussrBacked: 'Allende gov\'t', outcome: 'US-backed coup succeeds' },
      { name: 'Nicaraguan Contras', years: '1981–90', usBacked: 'Contras', ussrBacked: 'Sandinistas', outcome: 'Negotiated settlement' },
    ],
  },
  {
    region: 'Africa',
    conflicts: [
      { name: 'Angolan Civil War', years: '1975–2002', usBacked: 'UNITA', ussrBacked: 'MPLA + Cuba', outcome: 'MPLA government survives' },
      { name: 'Ethiopian–Somali War', years: '1977–78', usBacked: 'Somalia (later)', ussrBacked: 'Ethiopia + Cuba', outcome: 'Ethiopian victory' },
      { name: 'Mozambican Civil War', years: '1977–92', usBacked: 'RENAMO', ussrBacked: 'FRELIMO', outcome: 'Peace accord' },
    ],
  },
  {
    region: 'Middle East & Central Asia',
    conflicts: [
      { name: 'Afghan War', years: '1979–89', usBacked: 'Mujahideen', ussrBacked: 'Afghan gov\'t', outcome: 'Soviet withdrawal' },
      { name: 'Arab–Israeli conflicts', years: '1967–73', usBacked: 'Israel', ussrBacked: 'Egypt, Syria', outcome: 'US influence grows' },
    ],
  },
];

const NEAR_MISSES: NearMiss[] = [
  {
    title: 'Cuban Missile Crisis',
    year: 1962,
    threatLevel: 10,
    summary: 'Soviet nuclear missiles discovered 90 miles from Florida. For 13 days, Kennedy and Khrushchev engaged in a nuclear standoff. Soviet submarine B-59 was depth-charged by US destroyers — its captain wanted to launch a nuclear torpedo. Only the dissent of officer Vasili Arkhipov prevented launch. Separately, a U-2 pilot accidentally strayed into Soviet airspace during the crisis.',
    whatIf: 'If Arkhipov had agreed with his captain, a nuclear torpedo would have destroyed a US carrier group. Retaliation would have been immediate. Estimated casualties from a full exchange: 100–200 million dead in the first hour. Nuclear winter could have killed billions more.',
    keyFigure: 'Vasili Arkhipov — the man who saved the world by voting "no" on a submarine.',
  },
  {
    title: 'Able Archer 83',
    year: 1983,
    threatLevel: 9,
    summary: 'NATO conducted a realistic nuclear war exercise simulating a DEFCON 1 escalation to nuclear release. The KGB, already paranoid under Operation RYAN, interpreted the exercise as a possible cover for a real first strike. Soviet nuclear forces were placed on highest alert. NATO was completely unaware.',
    whatIf: 'If the Soviets had launched a preemptive strike believing Able Archer was real, NATO would have been caught in exercise mode — command structures simulating war would have faced the real thing. Reagan was reportedly shocked when briefed afterward on how close it came.',
    keyFigure: 'Oleg Gordievsky — KGB double agent who informed MI6 of Soviet panic, leading Reagan to soften rhetoric.',
  },
  {
    title: '1983 Soviet Nuclear False Alarm',
    year: 1983,
    threatLevel: 9,
    summary: 'On September 26, Soviet early warning satellites reported 5 incoming US Minuteman ICBMs. Lt. Col. Stanislav Petrov, the duty officer at Serpukhov-15, was supposed to report this up the chain — which would have triggered Soviet launch protocol. Instead, he judged it a system malfunction. He was right: sunlight reflecting off clouds had confused the satellites.',
    whatIf: 'If Petrov had followed protocol and reported the incoming missiles as real, Soviet leadership — already on edge from Able Archer preparations and the KAL 007 shootdown weeks earlier — would likely have ordered a retaliatory strike on the United States and NATO. The world owes its survival to one man\'s gut instinct.',
    keyFigure: 'Stanislav Petrov — duty officer who trusted his judgment over his instruments.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PageShell({ children }: { children: React.ReactNode }) {
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
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '32px 32px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Hero ──

function HeroSection() {
  const stats = [
    { label: 'Duration', value: '44 years' },
    { label: 'Proxy Wars', value: '12+' },
    { label: 'Peak Warheads', value: '70,000+' },
    { label: 'Nations Affected', value: '100+' },
  ];

  return (
    <div
      style={{
        padding: '48px 32px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(239,68,68,0.08) 50%, rgba(59,130,246,0.08) 100%)',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#64748b',
          textDecoration: 'none',
          marginBottom: 28,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      >
        \u2190 Back to Timeline
      </Link>

      {/* Side indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 6, backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', letterSpacing: '0.06em' }}>
          USA \uD83C\uDDFA\uD83C\uDDF8
        </span>
        <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>VS</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 6, backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', letterSpacing: '0.06em' }}>
          USSR \u2620\uFE0F
        </span>
      </div>

      <h1
        style={{
          fontSize: 'clamp(24px, 4.5vw, 42px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.15,
          marginBottom: 12,
        }}
      >
        The War That Was Never Fought
      </h1>
      <p
        style={{
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: '#94a3b8',
          fontWeight: 400,
          lineHeight: 1.5,
          marginBottom: 8,
        }}
      >
        The Cold War 1947\u20131991
      </p>
      <p
        style={{
          fontSize: 14,
          color: '#64748b',
          lineHeight: 1.6,
          marginBottom: 28,
          maxWidth: 600,
        }}
      >
        44 years of ideological conflict, proxy wars, and nuclear brinkmanship that shaped the modern world.
      </p>

      {/* Stats row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
              minWidth: 100,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', fontFamily: 'monospace' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Filter Bar ──

function FilterBar({
  selected,
  onSelect,
}: {
  selected: EventCategory | 'All';
  onSelect: (c: EventCategory | 'All') => void;
}) {
  const cats: (EventCategory | 'All')[] = ['All', 'Military', 'Political', 'Space', 'Nuclear', 'Cultural'];

  return (
    <div
      style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(7,14,34,0.95)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {cats.map((c) => {
        const active = selected === c;
        const color = c === 'All' ? '#94a3b8' : CATEGORY_COLORS[c];
        return (
          <button
            key={c}
            onClick={() => onSelect(c)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
              backgroundColor: active ? `${color}22` : 'rgba(255,255,255,0.03)',
              color: active ? color : '#64748b',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {c !== 'All' && <span style={{ fontSize: 13 }}>{CATEGORY_ICONS[c]}</span>}
            {c}
          </button>
        );
      })}
    </div>
  );
}

// ── Threat Level Badge ──

function ThreatBadge({ level }: { level: number | null }) {
  if (level === null) return null;
  const color =
    level >= 9 ? '#ef4444' :
    level >= 7 ? '#f97316' :
    level >= 5 ? '#f59e0b' :
    level >= 3 ? '#eab308' :
    '#22c55e';
  const label =
    level >= 9 ? 'CRITICAL' :
    level >= 7 ? 'HIGH' :
    level >= 5 ? 'ELEVATED' :
    level >= 3 ? 'GUARDED' :
    'LOW';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
      <span style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
        Nuclear Threat:
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 14,
              borderRadius: 2,
              backgroundColor: i < level ? color : 'rgba(255,255,255,0.08)',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, fontFamily: 'monospace' }}>
        {level}/10 {label}
      </span>
    </div>
  );
}

// ── Event Card ──

function EventCard({ event, index }: { event: ColdWarEvent; index: number }) {
  const color = CATEGORY_COLORS[event.category];
  const sideColor = event.side === 'US' ? '#3b82f6' : event.side === 'USSR' ? '#ef4444' : event.side === 'Both' ? '#a855f7' : '#64748b';
  const sideLabel = event.side === 'Both' ? 'US & USSR' : event.side;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * STAGGER, duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '20px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Year column */}
      <div
        style={{
          minWidth: 72,
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 700,
          color: '#64748b',
          fontFamily: 'monospace',
          paddingTop: 2,
          textAlign: 'right',
        }}
      >
        {event.year}
      </div>

      {/* Timeline dot + line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 6 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: `${color}33`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
        <div style={{ width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 4 }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: `${color}22`, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {CATEGORY_ICONS[event.category]} {event.category}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, backgroundColor: `${sideColor}15`, color: sideColor }}>
            {sideLabel}
          </span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 6, lineHeight: 1.3 }}>
          {event.title}
        </h3>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
          {event.description}
        </p>
        <ThreatBadge level={event.threatLevel} />
      </div>
    </motion.div>
  );
}

// ── Scoreboard ──

function ScoreboardSection() {
  return (
    <SectionWrapper title="US vs USSR Scoreboard" icon="\uD83C\uDFC6">
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
          }}
        >
          <thead>
            <tr>
              <th style={{ ...thStyle, textAlign: 'left', width: '20%' }}>Category</th>
              <th style={{ ...thStyle, textAlign: 'left', color: '#60a5fa' }}>\uD83C\uDDFA\uD83C\uDDF8 United States</th>
              <th style={{ ...thStyle, textAlign: 'left', color: '#f87171' }}>\u2620\uFE0F Soviet Union</th>
            </tr>
          </thead>
          <tbody>
            {SCOREBOARD.map((row, i) => (
              <motion.tr
                key={row.category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <td style={{ ...tdStyle, fontWeight: 600, color: '#cbd5e1' }}>{row.category}</td>
                <td style={{ ...tdStyle, color: '#94a3b8' }}>{row.us}</td>
                <td style={{ ...tdStyle, color: '#94a3b8' }}>{row.ussr}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
}

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  fontSize: 13,
  lineHeight: 1.5,
  verticalAlign: 'top',
};

// ── Nuclear Arsenal Chart (SVG) ──

function ArsenalChart() {
  const W = 900;
  const H = 320;
  const PAD = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxWarheads = 50000;
  const yearMin = 1945;
  const yearMax = 1991;
  const yearRange = yearMax - yearMin;

  const x = (year: number) => PAD.left + ((year - yearMin) / yearRange) * chartW;
  const y = (val: number) => PAD.top + chartH - (val / maxWarheads) * chartH;

  const makePath = (key: 'us' | 'ussr') => {
    return ARSENAL_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d.year).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' ');
  };

  const makeArea = (key: 'us' | 'ussr') => {
    const line = ARSENAL_DATA.map((d) => `${x(d.year).toFixed(1)},${y(d[key]).toFixed(1)}`);
    return `M${line.join(' L')} L${x(ARSENAL_DATA[ARSENAL_DATA.length - 1].year).toFixed(1)},${y(0).toFixed(1)} L${x(ARSENAL_DATA[0].year).toFixed(1)},${y(0).toFixed(1)} Z`;
  };

  const gridYears = [1950, 1960, 1970, 1980, 1990];
  const gridWarheads = [10000, 20000, 30000, 40000, 50000];

  return (
    <SectionWrapper title="Nuclear Warhead Stockpiles (1945\u20131991)" icon="\u2622\uFE0F">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {/* Grid lines */}
        {gridYears.map((yr) => (
          <g key={yr}>
            <line x1={x(yr)} y1={PAD.top} x2={x(yr)} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={x(yr)} y={PAD.top + chartH + 20} fill="#475569" fontSize={11} textAnchor="middle" fontFamily="monospace">{yr}</text>
          </g>
        ))}
        {gridWarheads.map((wh) => (
          <g key={wh}>
            <line x1={PAD.left} y1={y(wh)} x2={PAD.left + chartW} y2={y(wh)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(wh) + 4} fill="#475569" fontSize={10} textAnchor="end" fontFamily="monospace">{(wh / 1000).toFixed(0)}k</text>
          </g>
        ))}
        {/* Baseline */}
        <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <text x={PAD.left - 8} y={y(0) + 4} fill="#475569" fontSize={10} textAnchor="end" fontFamily="monospace">0</text>

        {/* Areas */}
        <path d={makeArea('ussr')} fill="rgba(239,68,68,0.08)" />
        <path d={makeArea('us')} fill="rgba(59,130,246,0.08)" />

        {/* Lines */}
        <path d={makePath('ussr')} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinejoin="round" />
        <path d={makePath('us')} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinejoin="round" />

        {/* Data points */}
        {ARSENAL_DATA.map((d) => (
          <g key={`us-${d.year}`}>
            <circle cx={x(d.year)} cy={y(d.us)} r={3} fill="#3b82f6" />
          </g>
        ))}
        {ARSENAL_DATA.map((d) => (
          <g key={`ussr-${d.year}`}>
            <circle cx={x(d.year)} cy={y(d.ussr)} r={3} fill="#ef4444" />
          </g>
        ))}

        {/* Peak annotations */}
        <text x={x(1967) + 6} y={y(31255) - 8} fill="#60a5fa" fontSize={10} fontWeight={700} fontFamily="monospace">US peak: 31,255 (1967)</text>
        <text x={x(1986) - 130} y={y(45000) - 8} fill="#f87171" fontSize={10} fontWeight={700} fontFamily="monospace">USSR peak: 45,000 (1986)</text>

        {/* Legend */}
        <rect x={W - 170} y={PAD.top} width={12} height={12} rx={2} fill="#3b82f6" />
        <text x={W - 152} y={PAD.top + 10} fill="#94a3b8" fontSize={11}>United States</text>
        <rect x={W - 170} y={PAD.top + 20} width={12} height={12} rx={2} fill="#ef4444" />
        <text x={W - 152} y={PAD.top + 30} fill="#94a3b8" fontSize={11}>Soviet Union</text>
      </svg>
    </SectionWrapper>
  );
}

// ── Proxy Conflict Map ──

function ProxyMapSection() {
  return (
    <SectionWrapper title="Proxy Conflict Map" icon="\uD83D\uDDFA\uFE0F">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {PROXY_CONFLICTS.map((region) => (
          <motion.div
            key={region.region}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '16px 18px',
            }}
          >
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {region.region}
            </h4>
            {region.conflicts.map((c) => (
              <div key={c.name} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>
                  {c.name} <span style={{ color: '#64748b', fontWeight: 400 }}>({c.years})</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
                  <span style={{ color: '#60a5fa' }}>US-backed:</span> {c.usBacked}<br />
                  <span style={{ color: '#f87171' }}>USSR-backed:</span> {c.ussrBacked}<br />
                  <span style={{ color: '#a3e635' }}>Outcome:</span> {c.outcome}
                </div>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── What If? Near Misses ──

function NearMissesSection() {
  return (
    <SectionWrapper title='"What If?" — Three Times We Nearly Ended the World' icon="\u26A0\uFE0F">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {NEAR_MISSES.map((nm, i) => (
          <motion.div
            key={nm.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{
              backgroundColor: 'rgba(239,68,68,0.04)',
              border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: 12,
              padding: '24px 28px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: '#fca5a5', margin: 0 }}>
                {nm.title}
              </h4>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: 'monospace' }}>{nm.year}</span>
            </div>

            <ThreatBadge level={nm.threatLevel} />

            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 14px 0' }}>
                {nm.summary}
              </p>

              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.12)',
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  What if it had gone wrong?
                </div>
                <p style={{ fontSize: 13, color: '#fecaca', lineHeight: 1.65, margin: 0 }}>
                  {nm.whatIf}
                </p>
              </div>

              <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                <span style={{ fontWeight: 600, color: '#cbd5e1' }}>Key figure:</span> {nm.keyFigure}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function ColdWarPage() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');

  const filteredEvents = useMemo(
    () => selectedCategory === 'All' ? EVENTS : EVENTS.filter((e) => e.category === selectedCategory),
    [selectedCategory],
  );

  // Allow scrolling on this page (root CSS sets overflow:hidden for canvas view)
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
    <PageShell>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Filter bar */}
      <FilterBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {/* 3. Timeline */}
      <SectionWrapper title={`Timeline (${filteredEvents.length} events)`} icon="\uD83D\uDCC5">
        {filteredEvents.map((ev, i) => (
          <EventCard key={`${ev.year}-${ev.title}`} event={ev} index={i} />
        ))}
      </SectionWrapper>

      {/* 4. Scoreboard */}
      <ScoreboardSection />

      {/* 5. Nuclear Arsenal Chart */}
      <ArsenalChart />

      {/* 6. Proxy Conflict Map */}
      <ProxyMapSection />

      {/* 7. What If? Near Misses */}
      <NearMissesSection />

      {/* Bottom nav */}
      <div style={{ padding: '28px 32px', display: 'flex', gap: 12 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#60a5fa',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid rgba(96,165,250,0.3)',
            backgroundColor: 'rgba(96,165,250,0.08)',
          }}
        >
          \u2190 Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
