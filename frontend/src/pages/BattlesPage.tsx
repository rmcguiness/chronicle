/**
 * BattlesPage — "History's Most Decisive Battles"
 *
 * Route: /battles
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Battle {
  name: string; year: number; yearDisplay: string; location: string; region: string; era: string;
  attacker: string; defender: string; attackerForce: number; defenderForce: number;
  outcome: 'attacker' | 'defender'; winner: string; casualties: number | null; casualtiesNote: string;
  tacticalInnovation: string; significance: string; turningPoint: boolean; decisiveRank: number; chronicleQuery: string;
}

const BATTLES: Battle[] = [
  { name: 'Battle of Marathon', year: -490, yearDisplay: '490 BCE', location: 'Marathon, Greece', region: 'Europe', era: 'Ancient', attacker: 'Persian Empire', defender: 'Athens & Plataea', attackerForce: 25000, defenderForce: 10000, outcome: 'defender', winner: 'Greece', casualties: 6800, casualtiesNote: '~6,400 Persians, ~192 Athenians', tacticalInnovation: 'Double envelopment with weakened center and strong flanks \u2014 one of the earliest recorded pincer movements.', significance: 'Preserved Greek independence and democracy at a critical moment. Had Persia won, Athenian democracy \u2014 the foundation of Western political thought \u2014 might never have flourished.', turningPoint: true, decisiveRank: 8, chronicleQuery: 'Battle of Marathon' },
  { name: 'Battle of Thermopylae', year: -480, yearDisplay: '480 BCE', location: 'Thermopylae, Greece', region: 'Europe', era: 'Ancient', attacker: 'Persian Empire', defender: 'Greek city-states (300 Spartans + allies)', attackerForce: 120000, defenderForce: 7000, outcome: 'attacker', winner: 'Persia (tactical), Greece (strategic)', casualties: 22000, casualtiesNote: '~20,000 Persians, ~2,000 Greeks including 300 Spartans', tacticalInnovation: 'Use of narrow terrain to neutralize numerical superiority \u2014 the ultimate force multiplier through chokepoint defense.', significance: 'Though a Persian tactical victory, the Spartans\' sacrifice bought time for the Greek fleet and became the defining symbol of resistance against overwhelming odds.', turningPoint: false, decisiveRank: 15, chronicleQuery: 'Battle of Thermopylae' },
  { name: 'Battle of Gaugamela', year: -331, yearDisplay: '331 BCE', location: 'Near Mosul, modern Iraq', region: 'Middle East', era: 'Ancient', attacker: 'Macedon (Alexander the Great)', defender: 'Persian Empire (Darius III)', attackerForce: 47000, defenderForce: 100000, outcome: 'attacker', winner: 'Macedon', casualties: 53000, casualtiesNote: '~40,000\u201390,000 Persians, ~1,200 Macedonians', tacticalInnovation: 'The oblique order attack \u2014 Alexander led a cavalry wedge at an angle, creating a gap in the Persian line, then personally charged through to reach Darius.', significance: 'Ended the Persian Empire, the largest empire the world had yet seen. Alexander\'s victory opened the East to Greek culture, creating the Hellenistic world.', turningPoint: true, decisiveRank: 4, chronicleQuery: 'Battle of Gaugamela' },
  { name: 'Battle of Cannae', year: -216, yearDisplay: '216 BCE', location: 'Cannae, southern Italy', region: 'Europe', era: 'Ancient', attacker: 'Carthage (Hannibal Barca)', defender: 'Roman Republic', attackerForce: 50000, defenderForce: 86000, outcome: 'attacker', winner: 'Carthage', casualties: 55000, casualtiesNote: '~50,000 Romans killed, ~5,500 Carthaginians', tacticalInnovation: 'The perfect double envelopment \u2014 Hannibal\'s crescent formation drew in the Roman center while cavalry encircled both flanks. Studied by military commanders for 2,000+ years.', significance: 'The single deadliest day in Roman military history. Cannae became the gold standard of tactical victory. Military academies still teach Hannibal\'s tactics today.', turningPoint: false, decisiveRank: 6, chronicleQuery: 'Battle of Cannae' },
  { name: 'Battle of Actium', year: -31, yearDisplay: '31 BCE', location: 'Ionian Sea, Greece', region: 'Europe', era: 'Ancient', attacker: 'Octavian (Augustus)', defender: 'Mark Antony & Cleopatra', attackerForce: 400, defenderForce: 500, outcome: 'attacker', winner: 'Octavian', casualties: null, casualtiesNote: '~5,000+ of Antony\'s forces; many deserted. Ships counted, not troops.', tacticalInnovation: 'Naval blockade and attrition \u2014 Octavian\'s admiral Agrippa used lighter, more maneuverable ships, cutting off supply lines before the battle even began.', significance: 'Ended the Roman Republic and gave birth to the Roman Empire. Octavian became Augustus, ushering in the Pax Romana \u2014 two centuries of relative peace.', turningPoint: true, decisiveRank: 3, chronicleQuery: 'Battle of Actium' },
  { name: 'Battle of Tours', year: 732, yearDisplay: '732 CE', location: 'Near Tours, France', region: 'Europe', era: 'Medieval', attacker: 'Umayyad Caliphate', defender: 'Frankish Kingdom (Charles Martel)', attackerForce: 25000, defenderForce: 20000, outcome: 'defender', winner: 'Franks', casualties: 12000, casualtiesNote: '~10,000+ Umayyad casualties, ~1,000 Frankish', tacticalInnovation: 'Heavy infantry phalanx against cavalry \u2014 Martel\'s Franks formed a dense square that absorbed repeated cavalry charges.', significance: 'Halted the Umayyad advance into Western Europe, preserving Christian Europe and the Frankish kingdom that would evolve into the Carolingian Empire under Charlemagne.', turningPoint: true, decisiveRank: 7, chronicleQuery: 'Battle of Tours' },
  { name: 'Battle of Hastings', year: 1066, yearDisplay: '1066 CE', location: 'Hastings, England', region: 'Europe', era: 'Medieval', attacker: 'Normans (William the Conqueror)', defender: 'Anglo-Saxons (Harold Godwinson)', attackerForce: 8000, defenderForce: 7000, outcome: 'attacker', winner: 'Normans', casualties: 5000, casualtiesNote: '~2,000 Normans, ~3,000+ Anglo-Saxons including Harold', tacticalInnovation: 'Combined arms \u2014 coordinated use of archers, infantry, and cavalry with a feigned retreat that lured the Anglo-Saxon shield wall into breaking formation.', significance: 'The Norman Conquest transformed England forever \u2014 replacing the Anglo-Saxon aristocracy, introducing feudalism, reshaping English law, and blending French with Old English.', turningPoint: true, decisiveRank: 5, chronicleQuery: 'Battle of Hastings' },
  { name: 'Battle of Ain Jalut', year: 1260, yearDisplay: '1260 CE', location: 'Ain Jalut, modern Israel/Palestine', region: 'Middle East', era: 'Medieval', attacker: 'Mongol Empire', defender: 'Mamluk Sultanate', attackerForce: 20000, defenderForce: 20000, outcome: 'defender', winner: 'Mamluks', casualties: null, casualtiesNote: 'Heavy Mongol casualties; commander Kitbuqa killed', tacticalInnovation: 'Baibars used a feigned retreat to lure the Mongols into an ambush \u2014 turning the Mongols\' own favorite tactic against them.', significance: 'The first major defeat of the Mongol army, shattering the myth of Mongol invincibility. It saved Egypt and North Africa from Mongol conquest.', turningPoint: true, decisiveRank: 10, chronicleQuery: 'Battle of Ain Jalut' },
  { name: 'Battle of Agincourt', year: 1415, yearDisplay: '1415 CE', location: 'Agincourt, France', region: 'Europe', era: 'Medieval', attacker: 'England (Henry V)', defender: 'France', attackerForce: 6000, defenderForce: 25000, outcome: 'attacker', winner: 'England', casualties: 7500, casualtiesNote: '~6,000+ French killed including many nobles, ~400 English', tacticalInnovation: 'The English longbow as a battle-winning weapon \u2014 massed volleys devastated French cavalry charges in muddy terrain.', significance: 'Demonstrated that the age of armored cavalry was ending. The longbow\'s dominance foreshadowed the gunpowder revolution. Shakespeare immortalized it.', turningPoint: false, decisiveRank: 16, chronicleQuery: 'Battle of Agincourt' },
  { name: 'Fall of Constantinople', year: 1453, yearDisplay: '1453 CE', location: 'Constantinople (Istanbul), Turkey', region: 'Middle East', era: 'Early Modern', attacker: 'Ottoman Empire (Mehmed II)', defender: 'Byzantine Empire (Constantine XI)', attackerForce: 80000, defenderForce: 7000, outcome: 'attacker', winner: 'Ottoman Empire', casualties: 5000, casualtiesNote: '~4,000 defenders killed, unknown Ottoman losses', tacticalInnovation: 'Massive siege cannons hurling 600-pound stone balls, breaching walls that had stood for 1,000 years. Also dragged ships overland to bypass the Golden Horn chain.', significance: 'Ended the Byzantine Empire after 1,100 years. Greek scholars fleeing to Italy helped spark the Renaissance. Europeans sought new sea routes, leading to the Age of Exploration.', turningPoint: true, decisiveRank: 2, chronicleQuery: 'Fall of Constantinople' },
  { name: 'Battle of Lepanto', year: 1571, yearDisplay: '1571 CE', location: 'Gulf of Patras, Greece', region: 'Europe', era: 'Early Modern', attacker: 'Holy League (Spain, Venice, Papacy)', defender: 'Ottoman Empire', attackerForce: 212, defenderForce: 278, outcome: 'attacker', winner: 'Holy League', casualties: 47000, casualtiesNote: '~30,000 Ottoman dead, ~7,500 Holy League dead. 12,000 Christian galley slaves freed.', tacticalInnovation: 'First major use of galleasses \u2014 large warships with heavy bow cannon that broke up the Ottoman formation before the main fleets engaged.', significance: 'Largest naval battle in Western history since antiquity. Shattered Ottoman naval dominance in the Mediterranean.', turningPoint: false, decisiveRank: 17, chronicleQuery: 'Battle of Lepanto' },
  { name: 'Spanish Armada', year: 1588, yearDisplay: '1588 CE', location: 'English Channel', region: 'Europe', era: 'Early Modern', attacker: 'Spain (Philip II)', defender: 'England (Elizabeth I)', attackerForce: 130, defenderForce: 200, outcome: 'defender', winner: 'England', casualties: 20000, casualtiesNote: '~20,000 Spanish dead (mostly storms/disease), ~100 English dead in combat', tacticalInnovation: 'Faster, more maneuverable ships with longer-range cannons, plus fire ships to scatter the Armada \u2014 pioneering stand-off naval warfare.', significance: 'Shifted naval power from Spain to England, beginning England\'s rise as a maritime superpower and eventual colonial empire.', turningPoint: true, decisiveRank: 9, chronicleQuery: 'Spanish Armada' },
  { name: 'Battle of Breitenfeld', year: 1631, yearDisplay: '1631 CE', location: 'Near Leipzig, Germany', region: 'Europe', era: 'Early Modern', attacker: 'Sweden (Gustavus Adolphus)', defender: 'Holy Roman Empire (Tilly)', attackerForce: 42000, defenderForce: 35000, outcome: 'attacker', winner: 'Sweden', casualties: 12000, casualtiesNote: '~7,600 Imperial killed, ~3,600 Swedish/Saxon killed', tacticalInnovation: 'Mobile combined-arms warfare \u2014 Gustavus integrated musketeers, pikemen, cavalry, and light artillery into flexible units. Revolutionized European warfare.', significance: 'Turned the Thirty Years\' War in favor of the Protestants. His innovations ensured the Peace of Westphalia (1648) would establish the modern nation-state system.', turningPoint: true, decisiveRank: 18, chronicleQuery: 'Battle of Breitenfeld' },
  { name: 'Battle of Blenheim', year: 1704, yearDisplay: '1704 CE', location: 'Blenheim, Bavaria, Germany', region: 'Europe', era: 'Early Modern', attacker: 'Grand Alliance (Marlborough & Eugene)', defender: 'France & Bavaria', attackerForce: 52000, defenderForce: 56000, outcome: 'attacker', winner: 'Grand Alliance', casualties: 32000, casualtiesNote: '~21,000 French/Bavarian, ~12,000 Allied casualties', tacticalInnovation: 'Strategic deception \u2014 Marlborough marched 250 miles from the Netherlands to Bavaria in secret, achieving complete strategic surprise.', significance: 'Halted Louis XIV\'s bid for European hegemony. Established Britain as a major continental military power.', turningPoint: false, decisiveRank: 19, chronicleQuery: 'Battle of Blenheim' },
  { name: 'Battle of Plassey', year: 1757, yearDisplay: '1757 CE', location: 'Plassey, Bengal, India', region: 'Asia', era: 'Early Modern', attacker: 'British East India Company (Robert Clive)', defender: 'Nawab of Bengal (Siraj ud-Daulah)', attackerForce: 3000, defenderForce: 50000, outcome: 'attacker', winner: 'British East India Company', casualties: 600, casualtiesNote: '~500 Bengali casualties, ~22 British dead. Most of the Nawab\'s army never engaged due to treachery.', tacticalInnovation: 'Political subversion over military force \u2014 Clive bribed the Nawab\'s general Mir Jafar to betray his own army.', significance: 'The founding moment of British India. The wealth extracted from Bengal financed Britain\'s Industrial Revolution and built the empire that would rule a quarter of the world.', turningPoint: true, decisiveRank: 11, chronicleQuery: 'Battle of Plassey' },
  { name: 'Battle of Saratoga', year: 1777, yearDisplay: '1777 CE', location: 'Saratoga, New York', region: 'Americas', era: 'Early Modern', attacker: 'British Empire (Burgoyne)', defender: 'Continental Army (Gates & Arnold)', attackerForce: 7200, defenderForce: 15000, outcome: 'defender', winner: 'United States', casualties: 1600, casualtiesNote: '~600 British dead, ~300 American dead. 6,000 British surrendered.', tacticalInnovation: 'Frontier riflemen as skirmishers \u2014 picking off British officers at long range. Benedict Arnold\'s aggressive charges broke the British lines.', significance: 'The turning point of the American Revolution. Convinced France to enter the war as an American ally, providing the money, troops, and naval power that made independence possible.', turningPoint: true, decisiveRank: 12, chronicleQuery: 'Battle of Saratoga' },
  { name: 'Battle of Waterloo', year: 1815, yearDisplay: '1815 CE', location: 'Waterloo, Belgium', region: 'Europe', era: 'Modern', attacker: 'France (Napoleon Bonaparte)', defender: 'Britain & Prussia (Wellington & Blucher)', attackerForce: 72000, defenderForce: 118000, outcome: 'defender', winner: 'Coalition', casualties: 65000, casualtiesNote: '~25,000 French, ~22,000 Allied, ~7,000 Prussian casualties', tacticalInnovation: 'Coalition coordination \u2014 Wellington\'s defensive stand combined with Blucher\'s timely arrival demonstrated that allied cooperation could defeat even a military genius.', significance: 'Ended Napoleon\'s rule and 23 years of near-continuous war in Europe. The Congress of Vienna created a balance-of-power system that kept Europe largely at peace for a century.', turningPoint: true, decisiveRank: 13, chronicleQuery: 'Battle of Waterloo' },
  { name: 'Battle of Gettysburg', year: 1863, yearDisplay: '1863 CE', location: 'Gettysburg, Pennsylvania', region: 'Americas', era: 'Modern', attacker: 'Confederate States (Robert E. Lee)', defender: 'United States (George Meade)', attackerForce: 75000, defenderForce: 85000, outcome: 'defender', winner: 'Union', casualties: 50000, casualtiesNote: '~23,000 Union, ~28,000 Confederate casualties over three days', tacticalInnovation: 'Defensive use of terrain \u2014 the Union\'s fishhook line along Cemetery Ridge showed that well-positioned defenders with rifled muskets could devastate frontal assaults (Pickett\'s Charge).', significance: 'The turning point of the American Civil War. Lee\'s failed invasion destroyed the Confederacy\'s offensive capability, ensuring preservation of the United States and abolition of slavery.', turningPoint: true, decisiveRank: 14, chronicleQuery: 'Battle of Gettysburg' },
  { name: 'Battle of Sedan', year: 1870, yearDisplay: '1870 CE', location: 'Sedan, France', region: 'Europe', era: 'Modern', attacker: 'Prussia (Moltke)', defender: 'France (Napoleon III)', attackerForce: 200000, defenderForce: 120000, outcome: 'attacker', winner: 'Prussia', casualties: 20000, casualtiesNote: '~17,000 French casualties + 104,000 captured including Napoleon III. ~9,000 Prussian.', tacticalInnovation: 'Railroad logistics and mobilization \u2014 Moltke used telegraph and rail to concentrate forces faster than the French could react. Modern staff planning defeated traditional generalship.', significance: 'Led to the fall of the French Empire and the unification of Germany, creating the most powerful state in continental Europe and setting the stage for both World Wars.', turningPoint: true, decisiveRank: 20, chronicleQuery: 'Battle of Sedan 1870' },
  { name: 'Battle of the Marne', year: 1914, yearDisplay: '1914 CE', location: 'Marne River, France', region: 'Europe', era: 'Modern', attacker: 'German Empire', defender: 'France & Britain', attackerForce: 750000, defenderForce: 1000000, outcome: 'defender', winner: 'France & Britain', casualties: 500000, casualtiesNote: '~250,000 on each side in one week', tacticalInnovation: 'Paris taxis ferried 6,000 reserve troops to the front in a single night \u2014 the first motorized troop movement in history. Aerial reconnaissance revealed the gap in the German advance.', significance: 'Halted the German advance on Paris and destroyed the Schlieffen Plan. By forcing trench warfare, the Marne condemned Europe to four years of industrial slaughter.', turningPoint: true, decisiveRank: 21, chronicleQuery: 'Battle of the Marne' },
  { name: 'Battle of the Somme', year: 1916, yearDisplay: '1916 CE', location: 'Somme River, France', region: 'Europe', era: 'Modern', attacker: 'Britain & France', defender: 'German Empire', attackerForce: 750000, defenderForce: 500000, outcome: 'attacker', winner: 'Indecisive (slight Allied territorial gain)', casualties: 1100000, casualtiesNote: '~420,000 British, ~200,000 French, ~465,000 German. 57,000 British casualties on July 1 alone.', tacticalInnovation: 'First use of tanks in combat (September 1916) \u2014 the British Mark I foreshadowed the armored warfare that would dominate WWII.', significance: 'The Somme became the symbol of WWI\'s senseless slaughter, with over 1 million casualties for a few miles of ground. It scarred the "Lost Generation."', turningPoint: false, decisiveRank: 22, chronicleQuery: 'Battle of the Somme' },
  { name: 'Battle of Stalingrad', year: 1942, yearDisplay: '1942\u201343 CE', location: 'Stalingrad (Volgograd), Russia', region: 'Europe', era: 'Contemporary', attacker: 'Nazi Germany (Paulus)', defender: 'Soviet Union (Zhukov & Chuikov)', attackerForce: 400000, defenderForce: 500000, outcome: 'defender', winner: 'Soviet Union', casualties: 2000000, casualtiesNote: '~800,000 Axis casualties (91,000 captured, only 5,000 survived). ~1.1M Soviet casualties. Largest battle in human history.', tacticalInnovation: 'Operation Uranus \u2014 Zhukov\'s double envelopment struck the Romanian flanks, encircling the entire German 6th Army. Urban "hugging" tactics neutralized German air/artillery superiority.', significance: 'The turning point of WWII in Europe. Germany\'s first catastrophic defeat ended the myth of Wehrmacht invincibility. The Soviet victory established the USSR as a superpower.', turningPoint: true, decisiveRank: 1, chronicleQuery: 'Battle of Stalingrad' },
  { name: 'Battle of Midway', year: 1942, yearDisplay: '1942 CE', location: 'Midway Atoll, Pacific Ocean', region: 'Asia-Pacific', era: 'Contemporary', attacker: 'Imperial Japan (Yamamoto)', defender: 'United States (Nimitz & Spruance)', attackerForce: 4, defenderForce: 3, outcome: 'defender', winner: 'United States', casualties: 4000, casualtiesNote: '~3,057 Japanese dead + 4 carriers sunk. ~307 Americans dead + 1 carrier sunk.', tacticalInnovation: 'Intelligence-driven warfare \u2014 US codebreakers cracked JN-25 and set a trap. Five minutes of dive bombing decided the Pacific War.', significance: 'The decisive turning point of the Pacific War. Japan lost four irreplaceable carriers and hundreds of experienced pilots, going permanently on the defensive.', turningPoint: true, decisiveRank: 23, chronicleQuery: 'Battle of Midway' },
  { name: 'Battle of Dien Bien Phu', year: 1954, yearDisplay: '1954 CE', location: 'Dien Bien Phu, Vietnam', region: 'Asia-Pacific', era: 'Contemporary', attacker: 'Viet Minh (Vo Nguyen Giap)', defender: 'France', attackerForce: 50000, defenderForce: 16000, outcome: 'attacker', winner: 'Viet Minh', casualties: 23000, casualtiesNote: '~8,000 Viet Minh killed, ~2,300 French killed + 11,700 captured', tacticalInnovation: 'Hand-carried artillery through jungle mountains to surround the French position \u2014 achieving artillery superiority where the French thought it impossible.', significance: 'Ended French colonial rule in Indochina. Inspired anti-colonial movements worldwide and set the stage for the Vietnam War.', turningPoint: true, decisiveRank: 24, chronicleQuery: 'Battle of Dien Bien Phu' },
  { name: 'Tet Offensive', year: 1968, yearDisplay: '1968 CE', location: 'Across South Vietnam', region: 'Asia-Pacific', era: 'Contemporary', attacker: 'North Vietnam & Viet Cong', defender: 'South Vietnam & United States', attackerForce: 80000, defenderForce: 1000000, outcome: 'defender', winner: 'US/South Vietnam (tactical), North Vietnam (strategic)', casualties: 90000, casualtiesNote: '~45,000 NVA/VC killed, ~6,000 US/ARVN killed, ~14,000 civilians killed', tacticalInnovation: 'Coordinated nationwide surprise offensive during a ceasefire \u2014 simultaneous attacks on over 100 cities, including the US Embassy in Saigon.', significance: 'Though a military defeat for North Vietnam, Tet was a devastating psychological victory. It shattered American public confidence and led President Johnson to decline re-election.', turningPoint: true, decisiveRank: 25, chronicleQuery: 'Tet Offensive' },
];

const ERAS = ['All', 'Ancient', 'Medieval', 'Early Modern', 'Modern', 'Contemporary'] as const;
const REGIONS = ['All', 'Europe', 'Middle East', 'Asia', 'Asia-Pacific', 'Americas'] as const;
const OUTCOMES = ['All', 'Attacker Wins', 'Defender Wins'] as const;
const SCALES = ['All', 'Small (<15k)', 'Medium (15k\u2013100k)', 'Large (100k+)'] as const;
const SORT_OPTIONS = ['Chronological', 'Casualties (High\u2192Low)', 'Most Decisive'] as const;

const ERA_COLORS: Record<string, string> = { Ancient: '#f59e0b', Medieval: '#ef4444', 'Early Modern': '#8b5cf6', Modern: '#3b82f6', Contemporary: '#10b981' };
const REGION_COLORS: Record<string, string> = { Europe: '#3b82f6', 'Middle East': '#f59e0b', Asia: '#ef4444', 'Asia-Pacific': '#06b6d4', Americas: '#22c55e' };

function totalForces(b: Battle): number {
  if (b.attackerForce + b.defenderForce < 1000) return (b.attackerForce + b.defenderForce) * 200;
  return b.attackerForce + b.defenderForce;
}

function scaleCategory(b: Battle): string {
  const total = totalForces(b);
  if (total < 15000) return 'Small (<15k)';
  if (total < 100000) return 'Medium (15k\u2013100k)';
  return 'Large (100k+)';
}

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

function FilterPills({ label, options, selected, onSelect, colorMap }: {
  label: string; options: readonly string[]; selected: string;
  onSelect: (v: string) => void; colorMap?: Record<string, string>;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, minWidth: 60 }}>{label}</span>
      {options.map((opt) => {
        const active = selected === opt;
        const color = opt !== 'All' && colorMap?.[opt] ? colorMap[opt] : '#60a5fa';
        return (
          <button key={opt} onClick={() => onSelect(opt)} style={{
            padding: '4px 12px', borderRadius: 16,
            border: active ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.08)',
            background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
            color: active ? color : '#94a3b8', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'all 150ms ease', fontFamily: "'Inter', sans-serif",
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function BattleCard({ battle, index }: { battle: Battle; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const eraColor = ERA_COLORS[battle.era] || '#94a3b8';
  const regionColor = REGION_COLORS[battle.region] || '#94a3b8';
  const isTop5 = battle.decisiveRank <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: isTop5 ? 'rgba(245, 158, 11, 0.04)' : 'rgba(15, 23, 42, 0.7)',
        border: isTop5 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 200ms ease',
        borderLeft: `3px solid ${battle.outcome === 'attacker' ? '#ef4444' : '#22c55e'}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = isTop5 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(15, 23, 42, 0.9)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isTop5 ? 'rgba(245, 158, 11, 0.04)' : 'rgba(15, 23, 42, 0.7)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 18, fontWeight: 600 }}>{battle.name}</h3>
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>{battle.yearDisplay} \u00b7 {battle.location}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {battle.turningPoint && (
            <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
              background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Turning Point
            </span>
          )}
          <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            background: `${eraColor}22`, color: eraColor, border: `1px solid ${eraColor}33` }}>{battle.era}</span>
          <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            background: `${regionColor}22`, color: regionColor, border: `1px solid ${regionColor}33` }}>{battle.region}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12,
        padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Attacker</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{battle.attacker}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {battle.attackerForce < 500 ? `${battle.attackerForce} ships` : formatNumber(battle.attackerForce) + ' troops'}
          </div>
        </div>
        <div style={{ color: '#475569', fontSize: 20, fontWeight: 300 }}>vs</div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>Defender</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{battle.defender}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            {battle.defenderForce < 500 ? `${battle.defenderForce} ships` : formatNumber(battle.defenderForce) + ' troops'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          background: battle.outcome === 'attacker' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
          color: battle.outcome === 'attacker' ? '#ef4444' : '#22c55e' }}>
          Winner: {battle.winner}
        </span>
        {battle.casualties && (
          <span style={{ fontSize: 12, color: '#94a3b8' }}>~{formatNumber(battle.casualties)} casualties</span>
        )}
      </div>

      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{battle.significance}</p>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ marginTop: 16, marginBottom: 12 }}>
              <span style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Key Tactical Innovation
              </span>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0 0', lineHeight: 1.5 }}>{battle.tacticalInnovation}</p>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
              <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Casualties Detail
              </span>
              <p style={{ color: '#fca5a5', fontSize: 12, margin: '4px 0 0 0', lineHeight: 1.5 }}>{battle.casualtiesNote}</p>
            </div>
            <Link to={`/search?q=${encodeURIComponent(battle.chronicleQuery)}`}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#60a5fa', fontSize: 12,
                textDecoration: 'none', padding: '4px 10px', borderRadius: 6,
                background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
              Find in Chronicle \u2192
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineBar({ battles }: { battles: Battle[] }) {
  const sorted = [...battles].sort((a, b) => a.year - b.year);
  const minYear = sorted[0]?.year ?? -500;
  const maxYear = sorted[sorted.length - 1]?.year ?? 2000;
  const range = maxYear - minYear || 1;

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, padding: '24px 24px 16px', marginBottom: 24 }}>
      <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, margin: '0 0 20px 0' }}>Timeline of Decisive Battles</h2>
      <div style={{ position: 'relative', height: 80, marginLeft: 10, marginRight: 10 }}>
        <div style={{ position: 'absolute', top: 30, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
        {[-500, 0, 500, 1000, 1500, 2000].filter((y) => y >= minYear && y <= maxYear).map((year) => {
          const pct = ((year - minYear) / range) * 100;
          return (
            <span key={year} style={{ position: 'absolute', top: 42, left: `${pct}%`, color: '#64748b', fontSize: 10, transform: 'translateX(-50%)' }}>
              {year < 0 ? `${Math.abs(year)} BCE` : year === 0 ? '1 CE' : `${year}`}
            </span>
          );
        })}
        {sorted.map((b) => {
          const pct = ((b.year - minYear) / range) * 100;
          const c = ERA_COLORS[b.era] || '#94a3b8';
          const size = b.turningPoint ? 12 : 8;
          return (
            <div key={b.name} title={`${b.name} (${b.yearDisplay})`} style={{
              position: 'absolute', left: `${pct}%`, top: 30 - size / 2,
              width: size, height: size, borderRadius: '50%', background: c,
              border: b.turningPoint ? '2px solid #fbbf24' : `1px solid ${c}`,
              transform: 'translateX(-50%)', cursor: 'default', zIndex: b.turningPoint ? 2 : 1,
            }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        {Object.entries(ERA_COLORS).map(([era, color]) => (
          <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 11, color: '#64748b' }}>{era}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid #fbbf24', background: 'transparent' }} />
          <span style={{ fontSize: 11, color: '#64748b' }}>Turning Point</span>
        </div>
      </div>
    </div>
  );
}

function ForceVisualization({ battles }: { battles: Battle[] }) {
  const maxForce = Math.max(...battles.map(totalForces));
  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <h2 style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>Battle Scale Comparison</h2>
      <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 20px 0' }}>Circle size proportional to combined forces engaged</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'center' }}>
        {[...battles].sort((a, b) => totalForces(b) - totalForces(a)).slice(0, 12).map((b) => {
          const total = totalForces(b);
          const size = Math.max(20, Math.sqrt(total / maxForce) * 90);
          const c = ERA_COLORS[b.era] || '#94a3b8';
          return (
            <div key={b.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div title={`${b.name}: ${formatNumber(totalForces(b))} total forces`}
                style={{ width: size, height: size, borderRadius: '50%', background: `${c}33`,
                  border: `2px solid ${c}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: Math.max(8, size / 6), color: '#e2e8f0', fontWeight: 600 }}>{formatNumber(total)}</span>
              </div>
              <span style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', maxWidth: size + 20,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {b.name.replace('Battle of ', '').replace('Battle of the ', '')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MostDecisiveSection() {
  const top5 = BATTLES.filter((b) => b.decisiveRank <= 5).sort((a, b) => a.decisiveRank - b.decisiveRank);
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.06) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
      <h2 style={{ color: '#fbbf24', fontSize: 22, fontWeight: 700, margin: '0 0 4px 0' }}>The 5 Most Decisive Battles in History</h2>
      <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 20px 0' }}>These battles most profoundly changed the course of human civilization</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {top5.map((b, i) => (
          <motion.div key={b.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '14px 16px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fbbf24', minWidth: 40, textAlign: 'center', lineHeight: 1, opacity: 0.8 }}>#{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>{b.name}</span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{b.yearDisplay}</span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{b.significance}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BattlesPage() {
  const [eraFilter, setEraFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [outcomeFilter, setOutcomeFilter] = useState('All');
  const [scaleFilter, setScaleFilter] = useState('All');
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('Chronological');

  const filtered = useMemo(() => {
    let result = BATTLES.filter((b) => {
      if (eraFilter !== 'All' && b.era !== eraFilter) return false;
      if (regionFilter !== 'All' && b.region !== regionFilter) return false;
      if (outcomeFilter === 'Attacker Wins' && b.outcome !== 'attacker') return false;
      if (outcomeFilter === 'Defender Wins' && b.outcome !== 'defender') return false;
      if (scaleFilter !== 'All' && scaleCategory(b) !== scaleFilter) return false;
      return true;
    });
    if (sortBy === 'Casualties (High\u2192Low)') {
      result = [...result].sort((a, b) => (b.casualties ?? 0) - (a.casualties ?? 0));
    } else if (sortBy === 'Most Decisive') {
      result = [...result].sort((a, b) => a.decisiveRank - b.decisiveRank);
    } else {
      result = [...result].sort((a, b) => a.year - b.year);
    }
    return result;
  }, [eraFilter, regionFilter, outcomeFilter, scaleFilter, sortBy]);

  const stats = useMemo(() => {
    const totalCasualties = BATTLES.reduce((sum, b) => sum + (b.casualties ?? 0), 0);
    const turningPoints = BATTLES.filter((b) => b.turningPoint).length;
    const attackerWins = BATTLES.filter((b) => b.outcome === 'attacker').length;
    return { totalCasualties, turningPoints, attackerWins, defenderWins: BATTLES.length - attackerWins };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a0e1a 0%, #0f172a 50%, #0a0e1a 100%)',
      color: '#e2e8f0', fontFamily: "'Inter', sans-serif", overflowY: 'auto' }}>
      <nav style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Chronicle</Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>Decisive Battles</span>
      </nav>

      <header style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 42, fontWeight: 700, margin: 0,
            background: 'linear-gradient(135deg, #ef4444, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          History's Most Decisive Battles
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ color: '#94a3b8', fontSize: 18, marginTop: 12, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
          25 battles that changed the course of civilization \u2014 with strategy breakdowns, casualty data, and tactical analysis
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
          <StatBox value={String(BATTLES.length)} label="Battles" />
          <StatBox value={formatNumber(stats.totalCasualties)} label="Total Casualties" />
          <StatBox value={String(stats.turningPoints)} label="Turning Points" />
          <StatBox value={`${stats.attackerWins}\u2013${stats.defenderWins}`} label="Attacker vs Defender Wins" />
        </motion.div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>
        <MostDecisiveSection />
        <TimelineBar battles={BATTLES} />
        <ForceVisualization battles={BATTLES} />

        <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FilterPills label="Era" options={ERAS} selected={eraFilter} onSelect={setEraFilter} colorMap={ERA_COLORS} />
          <FilterPills label="Region" options={REGIONS} selected={regionFilter} onSelect={setRegionFilter} colorMap={REGION_COLORS} />
          <FilterPills label="Outcome" options={OUTCOMES} selected={outcomeFilter} onSelect={setOutcomeFilter} />
          <FilterPills label="Scale" options={SCALES} selected={scaleFilter} onSelect={setScaleFilter} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>Showing {filtered.length} of {BATTLES.length} battles</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {SORT_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setSortBy(opt)} style={{
                  padding: '4px 12px', borderRadius: 6,
                  border: sortBy === opt ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  background: sortBy === opt ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                  color: sortBy === opt ? '#60a5fa' : '#94a3b8', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}>{opt}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16, marginBottom: 48 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((b, i) => <BattleCard key={b.name} battle={b} index={i} />)}
          </AnimatePresence>
        </div>

        <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#475569', fontSize: 13 }}>History's battles are complex events \u2014 these summaries aim to capture their essence and lasting impact.</p>
          <Link to="/" style={{ color: '#60a5fa', fontSize: 13, textDecoration: 'none' }}>\u2190 Back to Chronicle</Link>
        </footer>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)', minWidth: 120 }}>
      <div style={{ fontSize: value.length > 5 ? 18 : 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}
