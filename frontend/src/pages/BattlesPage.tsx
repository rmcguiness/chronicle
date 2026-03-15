/**
 * BattlesPage — "History's Most Decisive Battles"
 *
 * Route: /battles
 *
 * Features:
 *  - 25 curated battle cards with rich detail
 *  - Filter by era/category
 *  - Sort by chronological, casualties, strategic impact
 *  - "Most Decisive" top-5 ranked list
 *  - Timeline bar showing all 25 battles chronologically
 *  - "Battle of the Day" featured card
 *  - "Find in Chronicle" search links
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ────────────────────────────────────────────────────────────────────

interface Battle {
  slug: string;
  name: string;
  year: number;
  yearDisplay: string;
  location: string;
  countryEmoji: string;
  sideA: string;
  sideB: string;
  outcome: string;
  winner: string;
  casualties: string;
  significance: string;
  decisiveFactor: string;
  category: string;
  impactScore: number;
  chronicleQuery: string;
}

// ── Hardcoded dataset ────────────────────────────────────────────────────────

const BATTLES: Battle[] = [
  {
    slug: 'marathon-490bce',
    name: 'Battle of Marathon',
    year: -490,
    yearDisplay: '490 BCE',
    location: 'Marathon, Greece',
    countryEmoji: '\u{1F1EC}\u{1F1F7}',
    sideA: 'Athens & Plataea',
    sideB: 'Achaemenid Persia',
    outcome: 'Decisive Athenian victory',
    winner: 'Athens',
    casualties: '~6,400 Persian / ~192 Athenian',
    significance: 'Preserved Athenian democracy and proved Greek hoplites could defeat the Persian army. Without this victory, Western civilization as we know it may never have developed.',
    decisiveFactor: "Miltiades' tactical decision to thin the center and strengthen the flanks, creating a double envelopment",
    category: 'Ancient',
    impactScore: 9,
    chronicleQuery: 'Battle of Marathon',
  },
  {
    slug: 'thermopylae-480bce',
    name: 'Battle of Thermopylae',
    year: -480,
    yearDisplay: '480 BCE',
    location: 'Thermopylae, Greece',
    countryEmoji: '\u{1F1EC}\u{1F1F7}',
    sideA: 'Greek city-states (Sparta-led)',
    sideB: 'Achaemenid Persia',
    outcome: 'Persian victory, but strategic Greek delay',
    winner: 'Persia (pyrrhic)',
    casualties: '~20,000 Persian / ~4,000 Greek',
    significance: "King Leonidas and 300 Spartans' last stand became the defining symbol of courage against overwhelming odds. The delay allowed Athens to evacuate and prepare the fleet for Salamis.",
    decisiveFactor: "Ephialtes' betrayal — revealing the mountain path that allowed Persians to outflank the Greek position",
    category: 'Ancient',
    impactScore: 8,
    chronicleQuery: 'Battle of Thermopylae',
  },
  {
    slug: 'gaugamela-331bce',
    name: 'Battle of Gaugamela',
    year: -331,
    yearDisplay: '331 BCE',
    location: 'Gaugamela, Iraq',
    countryEmoji: '\u{1F1EE}\u{1F1F6}',
    sideA: 'Macedon (Alexander the Great)',
    sideB: 'Achaemenid Persia (Darius III)',
    outcome: 'Decisive Macedonian victory',
    winner: 'Macedon',
    casualties: '~40,000–90,000 Persian / ~1,200 Macedonian',
    significance: "Destroyed the Achaemenid Empire and created the Hellenistic world, spreading Greek culture from Egypt to India. One of the most consequential battles in ancient history.",
    decisiveFactor: "Alexander's cavalry charge directly at Darius, causing the Persian king to flee and his army to collapse",
    category: 'Ancient',
    impactScore: 10,
    chronicleQuery: 'Battle of Gaugamela',
  },
  {
    slug: 'cannae-216bce',
    name: 'Battle of Cannae',
    year: -216,
    yearDisplay: '216 BCE',
    location: 'Cannae, Italy',
    countryEmoji: '\u{1F1EE}\u{1F1F9}',
    sideA: 'Carthage (Hannibal Barca)',
    sideB: 'Roman Republic',
    outcome: 'Carthaginian annihilation victory',
    winner: 'Carthage',
    casualties: '~50,000–70,000 Roman / ~6,000 Carthaginian',
    significance: "The most famous tactical victory in military history. Hannibal's double envelopment became the gold standard studied by generals for 2,000+ years, from Scipio to Schwarzkopf.",
    decisiveFactor: "Hannibal's deliberate weak center that drew Romans in, allowing cavalry to close the trap from behind",
    category: 'Ancient',
    impactScore: 9,
    chronicleQuery: 'Battle of Cannae',
  },
  {
    slug: 'actium-31bce',
    name: 'Battle of Actium',
    year: -31,
    yearDisplay: '31 BCE',
    location: 'Actium, Greece',
    countryEmoji: '\u{1F1EC}\u{1F1F7}',
    sideA: 'Octavian (future Augustus)',
    sideB: 'Mark Antony & Cleopatra',
    outcome: 'Decisive Octavian victory',
    winner: 'Octavian',
    casualties: "~5,000 Antony's forces / minimal Octavian losses",
    significance: "Ended the Roman Republic's civil wars and established the Roman Empire under Augustus. Shaped the next 500 years of Western civilization and the Mediterranean world.",
    decisiveFactor: "Cleopatra's fleet fled mid-battle; Antony abandoned his forces to follow her",
    category: 'Naval',
    impactScore: 9,
    chronicleQuery: 'Battle of Actium',
  },
  {
    slug: 'tours-732ce',
    name: 'Battle of Tours',
    year: 732,
    yearDisplay: '732 CE',
    location: 'Tours, France',
    countryEmoji: '\u{1F1EB}\u{1F1F7}',
    sideA: 'Frankish Kingdom (Charles Martel)',
    sideB: 'Umayyad Caliphate',
    outcome: 'Decisive Frankish victory',
    winner: 'Franks',
    casualties: '~10,000+ Umayyad / ~1,500 Frankish',
    significance: "Halted Islamic expansion into Western Europe and established Frankish dominance. Charles Martel's victory laid the groundwork for the Carolingian dynasty and Charlemagne's empire.",
    decisiveFactor: 'Frankish heavy infantry phalanx held firm against repeated cavalry charges on ground of their choosing',
    category: 'Medieval',
    impactScore: 9,
    chronicleQuery: 'Battle of Tours',
  },
  {
    slug: 'hastings-1066',
    name: 'Battle of Hastings',
    year: 1066,
    yearDisplay: '1066 CE',
    location: 'Hastings, England',
    countryEmoji: '\u{1F1EC}\u{1F1E7}',
    sideA: 'Norman-French (William the Conqueror)',
    sideB: 'Anglo-Saxon England (Harold Godwinson)',
    outcome: 'Decisive Norman victory',
    winner: 'Normandy',
    casualties: '~2,000+ each side',
    significance: "The Norman Conquest transformed England's language, law, culture, and aristocracy. It connected England to Continental Europe and reshaped the English-speaking world forever.",
    decisiveFactor: "Harold's death (likely arrow to the eye) collapsed Anglo-Saxon command; feigned Norman retreats broke the shield wall",
    category: 'Medieval',
    impactScore: 10,
    chronicleQuery: 'Battle of Hastings',
  },
  {
    slug: 'ain-jalut-1260',
    name: 'Battle of Ain Jalut',
    year: 1260,
    yearDisplay: '1260 CE',
    location: 'Ain Jalut, Palestine',
    countryEmoji: '\u{1F1F5}\u{1F1F8}',
    sideA: 'Mamluk Sultanate (Qutuz & Baibars)',
    sideB: 'Mongol Empire',
    outcome: 'Decisive Mamluk victory',
    winner: 'Mamluks',
    casualties: '~1,500 each side',
    significance: 'First major defeat of the Mongol army, proving they were not invincible. Saved Egypt, North Africa, and the Islamic heartland from Mongol conquest and preserved Islamic civilization.',
    decisiveFactor: "Baibars' advance force lured the Mongols into a prepared ambush in the Jezreel Valley",
    category: 'Medieval',
    impactScore: 9,
    chronicleQuery: 'Battle of Ain Jalut',
  },
  {
    slug: 'agincourt-1415',
    name: 'Battle of Agincourt',
    year: 1415,
    yearDisplay: '1415 CE',
    location: 'Agincourt, France',
    countryEmoji: '\u{1F1EB}\u{1F1F7}',
    sideA: 'England (Henry V)',
    sideB: 'France',
    outcome: 'Decisive English victory',
    winner: 'England',
    casualties: '~6,000+ French / ~400 English',
    significance: "A outnumbered English force destroyed French chivalry, demonstrating that disciplined archers could annihilate armored knights. Revived English claims in France and inspired Shakespeare's Henry V.",
    decisiveFactor: 'English longbowmen on muddy, narrow terrain devastated heavily-armored French knights who could barely move',
    category: 'Medieval',
    impactScore: 7,
    chronicleQuery: 'Battle of Agincourt',
  },
  {
    slug: 'constantinople-1453',
    name: 'Fall of Constantinople',
    year: 1453,
    yearDisplay: '1453 CE',
    location: 'Constantinople (Istanbul), Turkey',
    countryEmoji: '\u{1F1F9}\u{1F1F7}',
    sideA: 'Ottoman Empire (Mehmed II)',
    sideB: 'Byzantine Empire (Constantine XI)',
    outcome: 'Ottoman victory; city falls',
    winner: 'Ottoman Empire',
    casualties: '~4,000 defenders killed / unknown Ottoman',
    significance: "Ended the 1,100-year Byzantine Empire and the last vestige of Rome. Triggered the Renaissance as Greek scholars fled west, and shifted trade routes, motivating European exploration.",
    decisiveFactor: "Massive Ottoman cannons (especially the 'Basilica') breached the Theodosian Walls that had held for 1,000 years",
    category: 'Siege',
    impactScore: 10,
    chronicleQuery: 'Fall of Constantinople',
  },
  {
    slug: 'lepanto-1571',
    name: 'Battle of Lepanto',
    year: 1571,
    yearDisplay: '1571 CE',
    location: 'Gulf of Patras, Greece',
    countryEmoji: '\u{1F1EC}\u{1F1F7}',
    sideA: 'Holy League (Spain, Venice, Papacy)',
    sideB: 'Ottoman Empire',
    outcome: 'Decisive Holy League victory',
    winner: 'Holy League',
    casualties: '~30,000 Ottoman / ~7,500 Holy League',
    significance: 'The last major galley battle and the first significant Ottoman naval defeat. It shattered the myth of Ottoman naval invincibility and halted their expansion in the western Mediterranean.',
    decisiveFactor: "Holy League's galleasses — large gun platforms — broke the Ottoman formation before the fleets engaged",
    category: 'Naval',
    impactScore: 7,
    chronicleQuery: 'Battle of Lepanto',
  },
  {
    slug: 'spanish-armada-1588',
    name: 'Spanish Armada',
    year: 1588,
    yearDisplay: '1588 CE',
    location: 'English Channel',
    countryEmoji: '\u{1F1EC}\u{1F1E7}',
    sideA: 'England (Drake, Howard)',
    sideB: 'Spanish Empire (Medina Sidonia)',
    outcome: 'English/weather victory; Armada destroyed',
    winner: 'England',
    casualties: '~20,000 Spanish / ~100 English',
    significance: "England's survival ensured Protestant independence, enabled British colonization of the Americas, and shifted naval supremacy from the Mediterranean to the Atlantic.",
    decisiveFactor: 'English fire ships at Gravelines scattered the Armada, then Atlantic storms destroyed the fleeing fleet',
    category: 'Naval',
    impactScore: 8,
    chronicleQuery: 'Spanish Armada',
  },
  {
    slug: 'blenheim-1704',
    name: 'Battle of Blenheim',
    year: 1704,
    yearDisplay: '1704 CE',
    location: 'Blenheim, Bavaria',
    countryEmoji: '\u{1F1E9}\u{1F1EA}',
    sideA: 'Grand Alliance (Marlborough & Eugene)',
    sideB: 'France & Bavaria',
    outcome: 'Decisive Allied victory',
    winner: 'Grand Alliance',
    casualties: '~30,000 Franco-Bavarian / ~12,000 Allied',
    significance: "Broke French military dominance in Europe and saved the Grand Alliance. It was the first major defeat of Louis XIV's armies and prevented French hegemony over the continent.",
    decisiveFactor: "Marlborough's 250-mile secret march from the Netherlands to Bavaria, catching the French completely off guard",
    category: 'Early Modern',
    impactScore: 7,
    chronicleQuery: 'Battle of Blenheim',
  },
  {
    slug: 'plassey-1757',
    name: 'Battle of Plassey',
    year: 1757,
    yearDisplay: '1757 CE',
    location: 'Plassey, Bengal, India',
    countryEmoji: '\u{1F1EE}\u{1F1F3}',
    sideA: 'British East India Company (Clive)',
    sideB: 'Nawab of Bengal (Siraj ud-Daulah)',
    outcome: 'British victory through conspiracy',
    winner: 'British East India Company',
    casualties: "~500 Nawab's forces / ~22 British",
    significance: 'Established British control over Bengal and began 200 years of British rule in India. The wealth extracted from Bengal financed the Industrial Revolution back in Britain.',
    decisiveFactor: "Mir Jafar's conspiracy — the Nawab's own general switched sides, and most of the army never fought",
    category: 'Early Modern',
    impactScore: 9,
    chronicleQuery: 'Battle of Plassey',
  },
  {
    slug: 'yorktown-1781',
    name: 'Battle of Yorktown',
    year: 1781,
    yearDisplay: '1781 CE',
    location: 'Yorktown, Virginia, USA',
    countryEmoji: '\u{1F1FA}\u{1F1F8}',
    sideA: 'American & French forces (Washington, Rochambeau)',
    sideB: 'British Empire (Cornwallis)',
    outcome: 'Decisive American-French victory',
    winner: 'United States & France',
    casualties: '~500 British / ~300 Allied',
    significance: "The last major battle of the American Revolution. Cornwallis' surrender led directly to British peace negotiations and American independence, creating the world's first modern republic.",
    decisiveFactor: "French Admiral de Grasse's fleet blocked British naval rescue, trapping Cornwallis between land and sea forces",
    category: 'Early Modern',
    impactScore: 10,
    chronicleQuery: 'Battle of Yorktown',
  },
  {
    slug: 'waterloo-1815',
    name: 'Battle of Waterloo',
    year: 1815,
    yearDisplay: '1815 CE',
    location: 'Waterloo, Belgium',
    countryEmoji: '\u{1F1E7}\u{1F1EA}',
    sideA: 'Seventh Coalition (Wellington & Blücher)',
    sideB: 'French Empire (Napoleon)',
    outcome: 'Decisive Coalition victory',
    winner: 'Seventh Coalition',
    casualties: '~26,000 French / ~24,000 Coalition',
    significance: "Napoleon's final defeat ended 23 years of near-continuous war in Europe. It ushered in the Concert of Europe and a century of relative peace, reshaping the entire international order.",
    decisiveFactor: "Blücher's Prussian army arrived late in the day, striking Napoleon's right flank when the battle hung in the balance",
    category: 'Early Modern',
    impactScore: 10,
    chronicleQuery: 'Battle of Waterloo',
  },
  {
    slug: 'gettysburg-1863',
    name: 'Battle of Gettysburg',
    year: 1863,
    yearDisplay: '1863 CE',
    location: 'Gettysburg, Pennsylvania, USA',
    countryEmoji: '\u{1F1FA}\u{1F1F8}',
    sideA: 'Union (Meade)',
    sideB: 'Confederacy (Lee)',
    outcome: 'Decisive Union victory',
    winner: 'Union',
    casualties: '~23,000 Union / ~28,000 Confederate',
    significance: "The turning point of the American Civil War. Lee's failed invasion of the North broke Confederate offensive capability and ensured the Union — and the abolition of slavery — would prevail.",
    decisiveFactor: "Pickett's Charge — Lee's desperate frontal assault across open ground into Union artillery was repulsed with devastating losses",
    category: 'Modern',
    impactScore: 9,
    chronicleQuery: 'Battle of Gettysburg',
  },
  {
    slug: 'tsushima-1905',
    name: 'Battle of Tsushima',
    year: 1905,
    yearDisplay: '1905 CE',
    location: 'Tsushima Strait, Korea/Japan',
    countryEmoji: '\u{1F1EF}\u{1F1F5}',
    sideA: 'Imperial Japan (Admiral Togo)',
    sideB: 'Russian Empire (Admiral Rozhestvensky)',
    outcome: 'Annihilation of Russian fleet',
    winner: 'Japan',
    casualties: '~4,380 Russian killed, 21 ships sunk / ~117 Japanese killed',
    significance: 'The first time an Asian power decisively defeated a European great power in modern warfare. It shocked the world, inspired anti-colonial movements, and announced Japan as a major power.',
    decisiveFactor: "Togo's crossing of the T — a textbook naval maneuver that allowed his fleet to concentrate fire on the Russian column",
    category: 'Naval',
    impactScore: 8,
    chronicleQuery: 'Battle of Tsushima',
  },
  {
    slug: 'marne-1914',
    name: 'Battle of the Marne',
    year: 1914,
    yearDisplay: '1914 CE',
    location: 'Marne River, France',
    countryEmoji: '\u{1F1EB}\u{1F1F7}',
    sideA: 'France & Britain',
    sideB: 'German Empire',
    outcome: 'Allied strategic victory',
    winner: 'France & Britain',
    casualties: '~250,000 each side',
    significance: "Stopped Germany's Schlieffen Plan and prevented a quick victory. By saving Paris, it condemned both sides to four years of trench warfare that killed millions and reshaped the modern world.",
    decisiveFactor: 'French General Gallieni rushing reinforcements to the front in Parisian taxicabs, plugging a critical gap in the line',
    category: 'Modern',
    impactScore: 9,
    chronicleQuery: 'Battle of the Marne',
  },
  {
    slug: 'verdun-1916',
    name: 'Battle of Verdun',
    year: 1916,
    yearDisplay: '1916 CE',
    location: 'Verdun, France',
    countryEmoji: '\u{1F1EB}\u{1F1F7}',
    sideA: 'France',
    sideB: 'German Empire',
    outcome: 'French strategic victory (lines held)',
    winner: 'France',
    casualties: '~700,000 total (roughly equal)',
    significance: "The longest single battle of WWI — 303 days of continuous fighting. It became the symbol of French determination ('Ils ne passeront pas') and the horror and futility of industrial warfare.",
    decisiveFactor: "French rotation system ('Noria') cycled fresh troops through constantly, preventing collapse despite apocalyptic conditions",
    category: 'Modern',
    impactScore: 8,
    chronicleQuery: 'Battle of Verdun',
  },
  {
    slug: 'britain-1940',
    name: 'Battle of Britain',
    year: 1940,
    yearDisplay: '1940 CE',
    location: 'United Kingdom airspace',
    countryEmoji: '\u{1F1EC}\u{1F1E7}',
    sideA: 'Royal Air Force (Dowding)',
    sideB: 'Nazi Germany Luftwaffe (Göring)',
    outcome: 'Decisive British victory',
    winner: 'United Kingdom',
    casualties: '~1,700 Luftwaffe aircraft / ~1,000 RAF aircraft',
    significance: "The first major campaign fought entirely in the air. Britain's survival kept the Allied cause alive, provided a base for D-Day, and proved that Hitler could be stopped.",
    decisiveFactor: "Radar (Chain Home system) and Fighter Command's integrated defense network gave the RAF decisive information advantage",
    category: 'Modern',
    impactScore: 10,
    chronicleQuery: 'Battle of Britain',
  },
  {
    slug: 'stalingrad-1942',
    name: 'Battle of Stalingrad',
    year: 1942,
    yearDisplay: '1942–43 CE',
    location: 'Stalingrad (Volgograd), Russia',
    countryEmoji: '\u{1F1F7}\u{1F1FA}',
    sideA: 'Soviet Union (Zhukov, Chuikov)',
    sideB: 'Nazi Germany (Paulus)',
    outcome: 'Decisive Soviet victory',
    winner: 'Soviet Union',
    casualties: '~800,000 Axis / ~1,100,000 Soviet',
    significance: "The bloodiest battle in human history and the turning point of WWII in Europe. Germany's 6th Army was encircled and destroyed, and the Wehrmacht never recovered the strategic initiative.",
    decisiveFactor: "Operation Uranus — Zhukov's massive pincer movement through weak Romanian flanks, encircling 300,000 German troops",
    category: 'Modern',
    impactScore: 10,
    chronicleQuery: 'Battle of Stalingrad',
  },
  {
    slug: 'midway-1942',
    name: 'Battle of Midway',
    year: 1942,
    yearDisplay: '1942 CE',
    location: 'Midway Atoll, Pacific Ocean',
    countryEmoji: '\u{1F1FA}\u{1F1F8}',
    sideA: 'United States Navy',
    sideB: 'Imperial Japanese Navy',
    outcome: 'Decisive American victory',
    winner: 'United States',
    casualties: '4 Japanese carriers sunk / 1 US carrier sunk',
    significance: 'Turned the tide of the Pacific War just six months after Pearl Harbor. Japan lost four irreplaceable fleet carriers and its best-trained pilots, shifting to permanent strategic defense.',
    decisiveFactor: 'US codebreakers cracked Japanese naval codes, allowing Admiral Nimitz to set a perfect ambush',
    category: 'Naval',
    impactScore: 10,
    chronicleQuery: 'Battle of Midway',
  },
  {
    slug: 'normandy-1944',
    name: 'D-Day / Normandy',
    year: 1944,
    yearDisplay: '1944 CE',
    location: 'Normandy, France',
    countryEmoji: '\u{1F1EB}\u{1F1F7}',
    sideA: 'Western Allies (Eisenhower)',
    sideB: 'Nazi Germany',
    outcome: 'Allied victory; beachhead established',
    winner: 'Western Allies',
    casualties: '~10,000 Allied on D-Day / ~4,000–9,000 German',
    significance: 'The largest amphibious invasion in history opened the Western Front that would end WWII in Europe. It liberated France and ensured that Western Europe would not fall under Soviet influence alone.',
    decisiveFactor: "Operation Fortitude's deception made Hitler believe Normandy was a feint, delaying Panzer reserves for the critical first days",
    category: 'Modern',
    impactScore: 10,
    chronicleQuery: 'D-Day Normandy',
  },
  {
    slug: 'dien-bien-phu-1954',
    name: 'Battle of Dien Bien Phu',
    year: 1954,
    yearDisplay: '1954 CE',
    location: 'Dien Bien Phu, Vietnam',
    countryEmoji: '\u{1F1FB}\u{1F1F3}',
    sideA: 'Viet Minh (General Giap)',
    sideB: 'French Union',
    outcome: 'Decisive Viet Minh victory',
    winner: 'Viet Minh',
    casualties: '~2,300 French killed, 10,000 captured / ~4,000–8,000 Viet Minh',
    significance: 'Ended French colonial rule in Indochina and signaled the beginning of the end for European colonialism worldwide. It also set the stage for American involvement in Vietnam.',
    decisiveFactor: "Giap's soldiers hand-carried disassembled artillery up mountains overlooking the French base — thought impossible by French commanders",
    category: 'Modern',
    impactScore: 9,
    chronicleQuery: 'Battle of Dien Bien Phu',
  },
];

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Ancient', 'Medieval', 'Early Modern', 'Modern', 'Naval', 'Siege'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Ancient: '#8b5cf6',
  Medieval: '#f59e0b',
  'Early Modern': '#f97316',
  Modern: '#3b82f6',
  Naval: '#06b6d4',
  Siege: '#ef4444',
};

const SORT_OPTIONS = [
  { value: 'chronological', label: 'Chronological' },
  { value: 'casualties', label: 'Casualties' },
  { value: 'impact', label: 'Strategic Impact' },
] as const;

type SortMode = typeof SORT_OPTIONS[number]['value'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function impactDots(score: number): string {
  return '\u{2B24}'.repeat(score) + '\u{25EF}'.repeat(10 - score);
}

function getBattleOfTheDay(): Battle {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return BATTLES[dayOfYear % BATTLES.length];
}

function parseCasualties(c: string): number {
  // Extract the largest number mentioned for rough sort
  const nums = c.match(/[\d,]+/g);
  if (!nums) return 0;
  return Math.max(...nums.map((n) => parseInt(n.replace(/,/g, ''), 10)));
}

// ── Timeline bar ─────────────────────────────────────────────────────────────

function TimelineBar({
  battles,
  onSelect,
}: {
  battles: Battle[];
  onSelect: (slug: string) => void;
}) {
  const sorted = [...battles].sort((a, b) => a.year - b.year);
  const minYear = sorted[0].year;
  const maxYear = sorted[sorted.length - 1].year;
  const range = maxYear - minYear || 1;

  return (
    <div
      style={{
        position: 'relative',
        height: 60,
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.06)',
        margin: '0 0 24px',
        overflow: 'hidden',
      }}
    >
      {/* Axis line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 16,
          right: 16,
          height: 2,
          background: 'rgba(255,255,255,0.1)',
        }}
      />
      {/* Battle dots */}
      {sorted.map((b) => {
        const pct = ((b.year - minYear) / range) * 100;
        return (
          <div
            key={b.slug}
            onClick={() => onSelect(b.slug)}
            title={`${b.name} (${b.yearDisplay})`}
            style={{
              position: 'absolute',
              left: `calc(16px + ${pct}% * (100% - 32px) / 100%)`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: CATEGORY_COLORS[b.category] || '#6b7280',
              border: '2px solid rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.15s',
              zIndex: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          />
        );
      })}
      {/* Year labels */}
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          left: 16,
          fontSize: 10,
          color: '#64748b',
        }}
      >
        {sorted[0].yearDisplay}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 4,
          right: 16,
          fontSize: 10,
          color: '#64748b',
        }}
      >
        {sorted[sorted.length - 1].yearDisplay}
      </div>
    </div>
  );
}

// ── Top 5 most decisive ─────────────────────────────────────────────────────

function MostDecisiveList({ battles }: { battles: Battle[] }) {
  const top5 = [...battles].sort((a, b) => b.impactScore - a.impactScore).slice(0, 5);

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
        Most Decisive Battles
      </h3>
      {top5.map((b, i) => (
        <div
          key={b.slug}
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
              background: `${CATEGORY_COLORS[b.category] || '#6b7280'}33`,
              color: CATEGORY_COLORS[b.category] || '#6b7280',
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
            <div style={{ fontWeight: 600, fontSize: 14 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {b.yearDisplay} — {b.location}
            </div>
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: CATEGORY_COLORS[b.category] || '#6b7280',
            }}
          >
            {b.impactScore}/10
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Battle card ──────────────────────────────────────────────────────────────

function BattleCard({ battle, index }: { battle: Battle; index: number }) {
  const [expanded, setExpanded] = useState(false);

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
          border: `1px solid ${expanded ? (CATEGORY_COLORS[battle.category] || '#6b7280') + '88' : 'rgba(255,255,255,0.06)'}`,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = `${CATEGORY_COLORS[battle.category] || '#6b7280'}55`;
          }
        }}
        onMouseLeave={(e) => {
          if (!expanded) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }
        }}
      >
        {/* Header: category badge + impact score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              background: `${CATEGORY_COLORS[battle.category] || '#6b7280'}22`,
              color: CATEGORY_COLORS[battle.category] || '#6b7280',
            }}
          >
            {battle.category}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1 }}>
            {impactDots(battle.impactScore)}
          </div>
        </div>

        {/* Name & year */}
        <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{battle.name}</div>
        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
          {battle.countryEmoji} {battle.location} — {battle.yearDisplay}
        </div>

        {/* Combatants */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            marginTop: 10,
            padding: '6px 0',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span style={{ color: '#e2e8f0', textAlign: 'right', flex: 1 }}>{battle.sideA}</span>
          <span style={{ color: '#64748b', fontWeight: 700 }}>vs</span>
          <span style={{ color: '#e2e8f0', textAlign: 'left', flex: 1 }}>{battle.sideB}</span>
        </div>

        {/* Outcome */}
        <div
          style={{
            marginTop: 8,
            padding: '6px 10px',
            borderRadius: 6,
            background: 'rgba(255,255,255,0.04)',
            fontSize: 12,
            color: '#cbd5e1',
          }}
        >
          <strong style={{ color: '#22c55e' }}>{battle.winner}</strong> — {battle.outcome}
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
                {/* Casualties */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Casualties
                  </div>
                  <div style={{ fontSize: 13, color: '#ef4444' }}>{battle.casualties}</div>
                </div>

                {/* Strategic significance */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Strategic Significance
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>{battle.significance}</div>
                </div>

                {/* Decisive factor */}
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    borderLeft: `3px solid ${CATEGORY_COLORS[battle.category] || '#6b7280'}`,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>
                    Decisive Factor
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{battle.decisiveFactor}</div>
                </div>

                {/* Find in Chronicle link */}
                <Link
                  to={`/search?q=${encodeURIComponent(battle.chronicleQuery)}`}
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

export default function BattlesPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('chronological');

  const battleOfTheDay = useMemo(() => getBattleOfTheDay(), []);

  const filtered = useMemo(() => {
    let list = [...BATTLES];

    // Category filter
    if (categoryFilter !== 'All') {
      list = list.filter((b) => b.category === categoryFilter);
    }

    // Sort
    if (sortMode === 'chronological') {
      list.sort((a, b) => a.year - b.year);
    } else if (sortMode === 'impact') {
      list.sort((a, b) => b.impactScore - a.impactScore);
    } else if (sortMode === 'casualties') {
      list.sort((a, b) => parseCasualties(b.casualties) - parseCasualties(a.casualties));
    }

    return list;
  }, [categoryFilter, sortMode]);

  function scrollToBattle(slug: string) {
    const el = document.getElementById(`battle-${slug}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

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
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 600 }}>Battles</span>
      </nav>

      {/* Hero */}
      <header style={{ padding: '48px 24px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}
        >
          History's Most Decisive Battles
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ color: '#94a3b8', marginTop: 8, fontSize: 16, maxWidth: 600 }}
        >
          25 battles that changed the course of civilization — from Marathon to Dien Bien Phu.
        </motion.p>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}
        >
          <StatBox value="25" label="Battles" />
          <StatBox value="2,444 yrs" label="Span (490 BCE – 1954 CE)" />
          <StatBox value="6" label="Categories" />
          <StatBox value="5M+" label="Estimated Total Casualties" />
        </motion.div>
      </header>

      {/* Main content */}
      <section style={{ padding: '16px 24px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Battle of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${CATEGORY_COLORS[battleOfTheDay.category] || '#6b7280'}15, rgba(255,255,255,0.03))`,
            border: `1px solid ${CATEGORY_COLORS[battleOfTheDay.category] || '#6b7280'}44`,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
            Battle of the Day
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{battleOfTheDay.name}</div>
              <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                {battleOfTheDay.countryEmoji} {battleOfTheDay.location} — {battleOfTheDay.yearDisplay}
              </div>
              <div style={{ fontSize: 14, color: '#cbd5e1', marginTop: 8, maxWidth: 600, lineHeight: 1.5 }}>
                {battleOfTheDay.significance}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 6,
                  background: `${CATEGORY_COLORS[battleOfTheDay.category] || '#6b7280'}22`,
                  color: CATEGORY_COLORS[battleOfTheDay.category] || '#6b7280',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {battleOfTheDay.category}
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 8, color: CATEGORY_COLORS[battleOfTheDay.category] || '#6b7280' }}>
                {battleOfTheDay.impactScore}/10
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline bar */}
        <TimelineBar battles={BATTLES} onSelect={scrollToBattle} />

        {/* Most Decisive top-5 */}
        <MostDecisiveList battles={BATTLES} />

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
          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background:
                    categoryFilter === cat
                      ? cat === 'All'
                        ? 'rgba(255,255,255,0.15)'
                        : `${CATEGORY_COLORS[cat] || '#6b7280'}33`
                      : 'rgba(255,255,255,0.05)',
                  color:
                    categoryFilter === cat
                      ? cat === 'All'
                        ? '#e2e8f0'
                        : CATEGORY_COLORS[cat] || '#e2e8f0'
                      : '#94a3b8',
                }}
              >
                {cat} {cat !== 'All' ? `(${BATTLES.filter((b) => b.category === cat).length})` : ''}
              </button>
            ))}
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

        {/* Battle cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((b, i) => (
            <div key={b.slug} id={`battle-${b.slug}`}>
              <BattleCard battle={b} index={i} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 64, color: '#64748b' }}>
            No battles match this filter.
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
      <div style={{ fontSize: value.length > 6 ? 16 : 28, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#94a3b8' }}>{label}</div>
    </div>
  );
}
