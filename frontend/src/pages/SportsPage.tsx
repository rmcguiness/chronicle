/**
 * SportsPage — The Games People Play: Sports Through History.
 *
 * Route: /sports
 *
 * Sections:
 *  1. Hero — title + subtitle
 *  2. Filter tabs (sport type + significance tag)
 *  3. Vertical timeline of 25+ sports milestones
 *  4. Olympics timeline — summer games 1896–2024 with host cities
 *  5. Sports as Politics — 5 moments when sports became history
 *  6. Firsts — first woman, first Black athlete, first broadcast, etc.
 *  7. Greatest Athletes sidebar — 10 most historically significant athletes
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type SignificanceTag = 'Political' | 'Cultural' | 'Technological' | 'Social' | 'Athletic Achievement';

type SportType =
  | 'Olympics'
  | 'Baseball'
  | 'Football/Soccer'
  | 'Basketball'
  | 'Tennis'
  | 'Boxing'
  | 'Golf'
  | 'Cricket'
  | 'Cycling'
  | 'Hockey'
  | 'Track & Field'
  | 'Esports'
  | 'Multi-Sport'
  | 'Jousting'
  | 'Gladiatorial'
  | 'Ball Game'
  | 'Media';

interface Milestone {
  year: string;
  yearSort: number;
  title: string;
  location: string;
  sport: SportType;
  description: string;
  significance: SignificanceTag;
  searchQuery: string;
}

interface OlympicsEntry {
  year: number;
  city: string;
  country: string;
  highlight: string;
}

interface PoliticsMoment {
  title: string;
  year: string;
  description: string;
}

interface FirstEntry {
  label: string;
  year: string;
  detail: string;
}

interface Athlete {
  name: string;
  sport: string;
  era: string;
  achievement: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const SIGNIFICANCE_COLORS: Record<SignificanceTag, string> = {
  Political: '#ef4444',
  Cultural: '#a78bfa',
  Technological: '#3b82f6',
  Social: '#22c55e',
  'Athletic Achievement': '#f59e0b',
};

const ALL_SIGNIFICANCE_TAGS: SignificanceTag[] = [
  'Political',
  'Cultural',
  'Technological',
  'Social',
  'Athletic Achievement',
];

const SPORT_TYPES: SportType[] = [
  'Olympics',
  'Baseball',
  'Football/Soccer',
  'Basketball',
  'Tennis',
  'Boxing',
  'Golf',
  'Cricket',
  'Cycling',
  'Hockey',
  'Track & Field',
  'Esports',
  'Multi-Sport',
  'Jousting',
  'Gladiatorial',
  'Ball Game',
  'Media',
];

const MILESTONES: Milestone[] = [
  {
    year: '~1400 BCE',
    yearSort: -1400,
    title: 'Mesoamerican Ball Game',
    location: 'Mesoamerica',
    sport: 'Ball Game',
    description:
      'The oldest known team sport, played with a rubber ball through stone rings in elaborate stone courts. Far more than recreation — it held deep religious significance, and some matches ended with ritual sacrifice of the losing team.',
    significance: 'Cultural',
    searchQuery: 'Mesoamerican ball game',
  },
  {
    year: '776 BCE',
    yearSort: -776,
    title: 'Ancient Olympic Games Founded',
    location: 'Olympia, Greece',
    sport: 'Olympics',
    description:
      'The first recorded Olympic Games featured a single event — the stadion foot race. Over centuries they expanded to include wrestling, boxing, chariot racing, and the pentathlon, becoming the most important athletic and religious festival in ancient Greece.',
    significance: 'Cultural',
    searchQuery: 'ancient Olympic Games 776 BCE',
  },
  {
    year: '264 BCE – 404 CE',
    yearSort: -264,
    title: 'Roman Gladiatorial Games',
    location: 'Rome, Colosseum',
    sport: 'Gladiatorial',
    description:
      'Gladiatorial combat evolved from funeral rites into massive public spectacles that could last weeks and involve thousands of fighters. The games were instruments of political power — emperors used them to win public favor, project strength, and distract from governance failures.',
    significance: 'Political',
    searchQuery: 'Roman gladiatorial games Colosseum',
  },
  {
    year: '1000s – 1500s',
    yearSort: 1100,
    title: 'Medieval Jousting Tournaments',
    location: 'Europe',
    sport: 'Jousting',
    description:
      'Mounted knights competed in organized tournaments that combined military training with elaborate pageantry and courtly culture. Jousting became the premier spectator sport of medieval Europe, with champions achieving celebrity status across kingdoms.',
    significance: 'Cultural',
    searchQuery: 'medieval jousting tournament knights',
  },
  {
    year: '1457',
    yearSort: 1457,
    title: 'Golf Origins — Banned by a King',
    location: 'Scotland',
    sport: 'Golf',
    description:
      'King James II of Scotland banned golf because soldiers were neglecting their archery practice to play it. The ban (one of three royal golf prohibitions) is the earliest definitive record of the sport, which had already become wildly popular across Scotland.',
    significance: 'Cultural',
    searchQuery: 'golf origins Scotland James II ban',
  },
  {
    year: '1598',
    yearSort: 1598,
    title: 'Cricket First Recorded',
    location: 'England',
    sport: 'Cricket',
    description:
      'The earliest definitive reference to cricket appears in a court case describing boys playing "creckett" in Surrey. Cricket would grow from a children\'s game into the national sport of England and eventually the most popular sport across South Asia, the Caribbean, and Australasia.',
    significance: 'Cultural',
    searchQuery: 'cricket origins England 1598',
  },
  {
    year: '1839',
    yearSort: 1839,
    title: 'Baseball Origins Debated',
    location: 'United States',
    sport: 'Baseball',
    description:
      'Whether Abner Doubleday or Alexander Cartwright deserves credit remains hotly debated, but organized baseball emerged in the northeastern US in the 1830s-40s. It rapidly became "America\'s pastime," deeply intertwined with American identity, race relations, and labor history.',
    significance: 'Cultural',
    searchQuery: 'baseball origins Doubleday Cartwright',
  },
  {
    year: '1896',
    yearSort: 1896,
    title: 'Modern Olympic Games Revived',
    location: 'Athens, Greece',
    sport: 'Olympics',
    description:
      'Pierre de Coubertin\'s dream became reality as 241 athletes from 14 nations competed in the first modern Olympics. Women were excluded entirely, and most athletes were wealthy amateurs — but the games reignited the Olympic ideal and launched the world\'s largest sporting event.',
    significance: 'Athletic Achievement',
    searchQuery: 'modern Olympics 1896 Athens Coubertin',
  },
  {
    year: '1903',
    yearSort: 1903,
    title: 'Tour de France Inaugurated',
    location: 'France',
    sport: 'Cycling',
    description:
      'Created as a publicity stunt by the sports newspaper L\'Auto to boost circulation, the first Tour covered 2,428 km in six stages. It became the world\'s most grueling annual sporting event and transformed cycling into a major European cultural institution.',
    significance: 'Cultural',
    searchQuery: 'Tour de France 1903 origins',
  },
  {
    year: '1930',
    yearSort: 1930,
    title: 'First FIFA World Cup',
    location: 'Montevideo, Uruguay',
    sport: 'Football/Soccer',
    description:
      'Thirteen nations traveled to Uruguay for the inaugural World Cup, with the host nation winning the final before 93,000 fans. The tournament established football as the world\'s truly global sport, eventually growing into the most-watched sporting event on Earth.',
    significance: 'Cultural',
    searchQuery: 'FIFA World Cup 1930 Uruguay',
  },
  {
    year: '1936',
    yearSort: 1936,
    title: 'Jesse Owens Defies Nazi Ideology',
    location: 'Berlin, Germany',
    sport: 'Track & Field',
    description:
      'Jesse Owens, an African American track and field athlete, won four gold medals at Hitler\'s "Aryan supremacy" Olympics. His victories were a powerful repudiation of Nazi racial ideology, though Owens returned home to a segregated America that denied him many basic rights.',
    significance: 'Political',
    searchQuery: 'Jesse Owens 1936 Berlin Olympics',
  },
  {
    year: '1939',
    yearSort: 1939,
    title: 'First Televised Sports Broadcast',
    location: 'United States',
    sport: 'Media',
    description:
      'NBC broadcast a Columbia-Princeton baseball game, the first sporting event ever shown on television in the US. This moment launched the marriage of sports and broadcasting that would reshape both industries and create the multi-billion-dollar sports media complex.',
    significance: 'Technological',
    searchQuery: 'first televised sports broadcast NBC 1939',
  },
  {
    year: '1947',
    yearSort: 1947,
    title: 'Jackie Robinson Breaks MLB Color Barrier',
    location: 'Brooklyn, New York',
    sport: 'Baseball',
    description:
      'Jackie Robinson took the field for the Brooklyn Dodgers, becoming the first Black player in Major League Baseball since the 1880s. His courage in enduring vicious racism while performing brilliantly helped catalyze the broader American civil rights movement.',
    significance: 'Social',
    searchQuery: 'Jackie Robinson color barrier Brooklyn Dodgers',
  },
  {
    year: '1954',
    yearSort: 1954,
    title: 'Roger Bannister Runs First 4-Minute Mile',
    location: 'Oxford, England',
    sport: 'Track & Field',
    description:
      'Roger Bannister broke the 4-minute mile barrier at Oxford\'s Iffley Road track with a time of 3:59.4. The feat shattered a psychological barrier that many had considered humanly impossible, and within months multiple other runners replicated it.',
    significance: 'Athletic Achievement',
    searchQuery: 'Roger Bannister four minute mile 1954',
  },
  {
    year: '1964 – 1981',
    yearSort: 1964,
    title: 'Muhammad Ali — The Greatest',
    location: 'Global',
    sport: 'Boxing',
    description:
      'Muhammad Ali transcended boxing to become one of the most recognized people on Earth. His refusal to serve in Vietnam, his conversion to Islam, and his breathtaking athleticism made him the prototype of the modern political athlete who uses fame as a platform.',
    significance: 'Political',
    searchQuery: 'Muhammad Ali boxing greatest',
  },
  {
    year: '1972',
    yearSort: 1972,
    title: 'Title IX — Equal Athletic Opportunity',
    location: 'United States',
    sport: 'Multi-Sport',
    description:
      'The US passed Title IX, mandating equal athletic opportunity for women in federally funded education programs. Before Title IX, fewer than 300,000 American girls played high school sports; within a generation, that number exceeded 3 million, transforming women\'s athletics worldwide.',
    significance: 'Social',
    searchQuery: 'Title IX 1972 women sports equality',
  },
  {
    year: '1973',
    yearSort: 1973,
    title: 'Battle of the Sexes — King vs Riggs',
    location: 'Houston, Texas',
    sport: 'Tennis',
    description:
      'Billie Jean King defeated Bobby Riggs in straight sets before 30,000 spectators and 90 million TV viewers in the most-watched tennis match in history. The match became a landmark moment for gender equality, proving women\'s athletics deserved respect and investment.',
    significance: 'Social',
    searchQuery: 'Battle of Sexes Billie Jean King Bobby Riggs 1973',
  },
  {
    year: '1980',
    yearSort: 1980,
    title: 'Miracle on Ice',
    location: 'Lake Placid, New York',
    sport: 'Hockey',
    description:
      'A team of US college players defeated the seemingly invincible Soviet hockey team 4–3 at the Winter Olympics. Coming amid the Cold War, the Iranian hostage crisis, and Soviet invasion of Afghanistan, the upset became a defining symbol of American resilience and Cold War rivalry.',
    significance: 'Political',
    searchQuery: 'Miracle on Ice 1980 US hockey USSR',
  },
  {
    year: '1984 – 1998',
    yearSort: 1984,
    title: 'Michael Jordan Era — Global Sports Marketing',
    location: 'Chicago / Global',
    sport: 'Basketball',
    description:
      'Michael Jordan\'s partnership with Nike created Air Jordan — the most successful athlete endorsement in history — and proved that individual athletes could become global brands. Jordan transformed the NBA from a struggling league into a worldwide cultural phenomenon.',
    significance: 'Cultural',
    searchQuery: 'Michael Jordan Nike Air Jordan NBA global',
  },
  {
    year: '1992',
    yearSort: 1992,
    title: 'Dream Team — Basketball Goes Global',
    location: 'Barcelona, Spain',
    sport: 'Basketball',
    description:
      'For the first time, professional NBA players competed in the Olympics, assembling a roster of legends including Jordan, Magic Johnson, and Larry Bird. The Dream Team\'s dominance ignited global interest in basketball and accelerated the NBA\'s international expansion.',
    significance: 'Cultural',
    searchQuery: 'Dream Team 1992 Olympics Barcelona basketball',
  },
  {
    year: '1990s – 2000s',
    yearSort: 1998,
    title: 'Steroids Scandal — Integrity Crisis',
    location: 'Global',
    sport: 'Multi-Sport',
    description:
      'Lance Armstrong\'s doping cover-up, the BALCO scandal exposing sprinters and baseball stars, and widespread PED use across cycling, baseball, and track shattered public trust in elite athletics. The era forced sports to confront the gap between clean-sport ideals and competitive reality.',
    significance: 'Social',
    searchQuery: 'steroids scandal BALCO Lance Armstrong doping',
  },
  {
    year: '2000s –',
    yearSort: 2005,
    title: 'Esports Emergence',
    location: 'Global',
    sport: 'Esports',
    description:
      'Competitive video gaming evolved from basement LAN parties into stadium-filling, billion-dollar spectacles with professional leagues, team franchises, and millions of viewers. Esports challenged traditional definitions of "sport" and "athlete" while building an entirely new entertainment industry.',
    significance: 'Technological',
    searchQuery: 'esports competitive gaming history',
  },
  {
    year: '2010s',
    yearSort: 2014,
    title: 'LeBron James — Athlete as Political Voice',
    location: 'United States',
    sport: 'Basketball',
    description:
      'LeBron James used his platform to speak on police brutality, voter suppression, and educational inequality, founding the I PROMISE School for at-risk youth. He helped revive the tradition of athlete activism that Muhammad Ali pioneered, inspiring a new generation of politically engaged athletes.',
    significance: 'Social',
    searchQuery: 'LeBron James social activism athlete',
  },
  {
    year: '2021',
    yearSort: 2021,
    title: 'Tokyo 2020/21 — Pandemic Olympics',
    location: 'Tokyo, Japan',
    sport: 'Olympics',
    description:
      'The first Olympics postponed in peacetime were held without spectators amid the COVID-19 pandemic. Simone Biles\' decision to withdraw from events citing mental health brought unprecedented attention to athlete wellbeing and challenged the "push through at all costs" culture in elite sport.',
    significance: 'Social',
    searchQuery: 'Tokyo 2020 Olympics pandemic Simone Biles mental health',
  },
  {
    year: '2022',
    yearSort: 2022,
    title: 'Qatar World Cup — Sports & Human Rights',
    location: 'Doha, Qatar',
    sport: 'Football/Soccer',
    description:
      'The first World Cup in the Middle East sparked global debate about sportswashing, migrant worker deaths, and LGBTQ+ rights. Argentina\'s victory in one of the greatest finals ever played coexisted with urgent questions about the ethics of mega-event hosting.',
    significance: 'Political',
    searchQuery: 'Qatar World Cup 2022 human rights controversy',
  },
];

const OLYMPICS_TIMELINE: OlympicsEntry[] = [
  { year: 1896, city: 'Athens', country: 'Greece', highlight: 'First modern games — 241 athletes, 14 nations' },
  { year: 1900, city: 'Paris', country: 'France', highlight: 'Women compete for the first time (tennis, golf)' },
  { year: 1904, city: 'St. Louis', country: 'USA', highlight: 'Marathon scandal — winner rode a car part way' },
  { year: 1908, city: 'London', country: 'UK', highlight: 'Marathon distance standardized at 26.2 miles' },
  { year: 1912, city: 'Stockholm', country: 'Sweden', highlight: 'Jim Thorpe wins pentathlon and decathlon' },
  { year: 1920, city: 'Antwerp', country: 'Belgium', highlight: 'Olympic flag and oath debut post-WWI' },
  { year: 1924, city: 'Paris', country: 'France', highlight: 'First Winter Olympics held (Chamonix)' },
  { year: 1928, city: 'Amsterdam', country: 'Netherlands', highlight: 'Olympic flame introduced' },
  { year: 1932, city: 'Los Angeles', country: 'USA', highlight: 'First Olympic Village built' },
  { year: 1936, city: 'Berlin', country: 'Germany', highlight: 'Jesse Owens wins 4 gold; Nazi propaganda backdrop' },
  { year: 1948, city: 'London', country: 'UK', highlight: 'First post-WWII "Austerity Games"' },
  { year: 1952, city: 'Helsinki', country: 'Finland', highlight: 'Soviet Union competes for first time' },
  { year: 1956, city: 'Melbourne', country: 'Australia', highlight: 'First Southern Hemisphere Olympics' },
  { year: 1960, city: 'Rome', country: 'Italy', highlight: 'First globally televised Olympics' },
  { year: 1964, city: 'Tokyo', country: 'Japan', highlight: 'First Asian host; bullet train debuts' },
  { year: 1968, city: 'Mexico City', country: 'Mexico', highlight: 'Black Power salute by Smith & Carlos' },
  { year: 1972, city: 'Munich', country: 'Germany', highlight: 'Munich massacre — 11 Israeli athletes killed' },
  { year: 1976, city: 'Montreal', country: 'Canada', highlight: 'African nations boycott; Nadia Comaneci scores perfect 10' },
  { year: 1980, city: 'Moscow', country: 'USSR', highlight: 'US-led boycott over Afghanistan invasion' },
  { year: 1984, city: 'Los Angeles', country: 'USA', highlight: 'Soviet bloc counter-boycott; Carl Lewis wins 4 gold' },
  { year: 1988, city: 'Seoul', country: 'South Korea', highlight: 'Ben Johnson doping scandal' },
  { year: 1992, city: 'Barcelona', country: 'Spain', highlight: 'Dream Team; post-Cold War unified participation' },
  { year: 1996, city: 'Atlanta', country: 'USA', highlight: '100th anniversary; Centennial Park bombing' },
  { year: 2000, city: 'Sydney', country: 'Australia', highlight: 'Cathy Freeman lights flame and wins 400m' },
  { year: 2004, city: 'Athens', country: 'Greece', highlight: 'Games return to birthplace; Phelps era begins' },
  { year: 2008, city: 'Beijing', country: 'China', highlight: 'Usain Bolt debuts; Bird\'s Nest spectacle' },
  { year: 2012, city: 'London', country: 'UK', highlight: 'First Olympics with women in every sport' },
  { year: 2016, city: 'Rio de Janeiro', country: 'Brazil', highlight: 'First South American Olympics; refugee team debuts' },
  { year: 2020, city: 'Tokyo', country: 'Japan', highlight: 'Pandemic postponement; empty stadiums' },
  { year: 2024, city: 'Paris', country: 'France', highlight: 'Seine opening ceremony; breakdancing debuts' },
];

const SPORTS_AS_POLITICS: PoliticsMoment[] = [
  {
    title: 'Jesse Owens at the Nazi Olympics (1936)',
    year: '1936',
    description:
      'Hitler intended the Berlin Games to showcase Aryan supremacy. Instead, Jesse Owens — the grandson of enslaved people — won four gold medals, becoming the most successful athlete of the games and exposing the absurdity of racial pseudoscience on the world stage.',
  },
  {
    title: 'Black Power Salute (1968)',
    year: '1968',
    description:
      'Tommie Smith and John Carlos raised gloved fists on the Olympic podium in Mexico City, making the Black Power salute one of the most iconic protest images in history. They were expelled from the games but their gesture galvanized the civil rights movement and proved sports could not be separated from politics.',
  },
  {
    title: 'Ping-Pong Diplomacy (1971)',
    year: '1971',
    description:
      'An American table tennis team\'s visit to China broke 22 years of diplomatic silence between the two superpowers. The sporting exchange paved the way for Nixon\'s historic 1972 visit and the normalization of US-China relations — all triggered by a game of ping-pong.',
  },
  {
    title: 'Springbok Tour Protests (1981)',
    year: '1981',
    description:
      'New Zealand was torn apart when the South African rugby team toured during apartheid. Massive protests and violent clashes divided families and communities, but ultimately helped build international pressure against apartheid and demonstrated that sports complicity with injustice has consequences.',
  },
  {
    title: 'Invictus — Mandela and the 1995 Rugby World Cup',
    year: '1995',
    description:
      'Nelson Mandela wore a Springbok jersey — a symbol of apartheid-era white South Africa — to present the Rugby World Cup trophy to the national team. The gesture transcended decades of racial division and became a defining moment of post-apartheid reconciliation.',
  },
];

const FIRSTS: FirstEntry[] = [
  { label: 'First female Olympic competitors', year: '1900', detail: 'Charlotte Cooper (tennis) became the first women\'s Olympic champion in Paris' },
  { label: 'First Black MLB player (modern era)', year: '1947', detail: 'Jackie Robinson debuted for the Brooklyn Dodgers, breaking 60 years of segregation' },
  { label: 'First televised sporting event', year: '1939', detail: 'NBC broadcast a Columbia-Princeton baseball game to ~400 TV sets' },
  { label: 'First Black heavyweight champion', year: '1908', detail: 'Jack Johnson defeated Tommy Burns, sparking racist backlash and the search for a "Great White Hope"' },
  { label: 'First openly gay Olympic champion', year: '1928', detail: 'Though not public at the time, history recognizes several early LGBTQ+ champions. Greg Louganis (1984, 1988) became the most prominent openly gay Olympic gold medalist' },
  { label: 'First Paralympic Games', year: '1960', detail: '400 athletes from 23 countries competed in Rome, establishing disabled athletes on the world stage' },
  { label: 'First billion-dollar sports broadcast deal', year: '1990', detail: 'CBS paid $1.06 billion for MLB rights, inaugurating the era of mega TV contracts' },
  { label: 'First athlete to earn $1 billion', year: '2022', detail: 'LeBron James became the first active player to reach billionaire status through salary and endorsements' },
];

const GREATEST_ATHLETES: Athlete[] = [
  { name: 'Jesse Owens', sport: 'Track & Field', era: '1930s', achievement: '4 gold medals at 1936 Berlin Olympics; defied Nazi racial ideology' },
  { name: 'Muhammad Ali', sport: 'Boxing', era: '1960s–80s', achievement: '3× heavyweight champion; refused Vietnam draft; global cultural icon' },
  { name: 'Pelé', sport: 'Football/Soccer', era: '1950s–70s', achievement: '3× World Cup winner; scored 1,281 goals; made football a global language' },
  { name: 'Billie Jean King', sport: 'Tennis', era: '1960s–80s', achievement: 'Won Battle of the Sexes; fought for gender pay equity in tennis' },
  { name: 'Michael Jordan', sport: 'Basketball', era: '1980s–2000s', achievement: '6× NBA champion; created the modern athlete-brand template' },
  { name: 'Serena Williams', sport: 'Tennis', era: '1990s–2020s', achievement: '23 Grand Slam singles titles; redefined power and excellence in women\'s tennis' },
  { name: 'Usain Bolt', sport: 'Track & Field', era: '2000s–2010s', achievement: '8× Olympic gold; still holds 100m (9.58s) and 200m (19.19s) world records' },
  { name: 'Simone Biles', sport: 'Gymnastics', era: '2010s–2020s', achievement: 'Most decorated gymnast in history; championed athlete mental health' },
  { name: 'Sachin Tendulkar', sport: 'Cricket', era: '1989–2013', achievement: '100 international centuries; 34,357 career runs; cricket\'s most revered player' },
  { name: 'Jackie Robinson', sport: 'Baseball', era: '1947–1956', achievement: 'Broke MLB color barrier; 6× All-Star; Civil Rights pioneer' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div
      style={{
        padding: '48px 32px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background:
          'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(245,158,11,0.08) 50%, rgba(239,68,68,0.06) 100%)',
        textAlign: 'center',
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
          marginBottom: 32,
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
        }}
      >
        ← Back to Timeline
      </Link>

      <div style={{ fontSize: 48, marginBottom: 16 }}>🏅</div>

      <h1
        style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.2,
          marginBottom: 12,
        }}
      >
        The Games People Play — Sports Through History
      </h1>
      <p
        style={{
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: '#94a3b8',
          fontWeight: 400,
          lineHeight: 1.5,
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        From ancient Olympics to the modern global sports industry
      </p>
    </div>
  );
}

// ── Filters ────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  activeSport: SportType | 'All';
  activeTag: SignificanceTag | 'All';
  onSportSelect: (s: SportType | 'All') => void;
  onTagSelect: (t: SignificanceTag | 'All') => void;
}

function FilterBar({ activeSport, activeTag, onSportSelect, onTagSelect }: FilterBarProps) {
  // Only show sport types that have milestones
  const usedSports = new Set(MILESTONES.map((m) => m.sport));
  const sportTabs: (SportType | 'All')[] = ['All', ...SPORT_TYPES.filter((s) => usedSports.has(s))];
  const tagTabs: (SignificanceTag | 'All')[] = ['All', ...ALL_SIGNIFICANCE_TAGS];

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Sport type filter */}
      <div
        style={{
          padding: '14px 32px 8px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, alignSelf: 'center', marginRight: 4 }}>
          Sport:
        </span>
        {sportTabs.map((s) => {
          const isActive = activeSport === s;
          return (
            <button
              key={s}
              onClick={() => onSportSelect(s)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `1px solid ${isActive ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: isActive ? '#f59e0b22' : 'transparent',
                color: isActive ? '#f59e0b' : '#64748b',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Significance tag filter */}
      <div
        style={{
          padding: '8px 32px 14px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, alignSelf: 'center', marginRight: 4 }}>
          Significance:
        </span>
        {tagTabs.map((t) => {
          const isActive = activeTag === t;
          const color = t === 'All' ? '#94a3b8' : SIGNIFICANCE_COLORS[t];
          return (
            <button
              key={t}
              onClick={() => onTagSelect(t)}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: isActive ? `${color}22` : 'transparent',
                color: isActive ? color : '#64748b',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Milestone cards ────────────────────────────────────────────────────────────

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const color = SIGNIFICANCE_COLORS[milestone.significance];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      style={{ display: 'flex', gap: 20, position: 'relative' }}
    >
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 20 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: `${color}33`,
            border: `2px solid ${color}`,
            flexShrink: 0,
            boxShadow: `0 0 8px ${color}44`,
          }}
        />
        <div style={{ width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', minHeight: 20 }} />
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: `1px solid ${color}33`,
          borderRadius: 12,
          padding: '18px 20px',
          marginBottom: 16,
        }}
      >
        {/* Year + location + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'monospace' }}>
            {milestone.year}
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            📍 {milestone.location}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: `${color}22`,
              color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {milestone.significance}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3 }}>
          {milestone.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginBottom: 12 }}>
          {milestone.description}
        </p>

        {/* Footer: sport tag + search link */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#94a3b8',
              fontWeight: 600,
            }}
          >
            {milestone.sport}
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <Link
              to={`/?q=${encodeURIComponent(milestone.searchQuery)}`}
              style={{
                fontSize: 11,
                color: '#60a5fa',
                textDecoration: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Find in Chronicle →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineSection({ milestones }: { milestones: Milestone[] }) {
  return (
    <SectionWrapper title="Timeline" icon="🏅">
      {milestones.length === 0 ? (
        <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '12px 0' }}>
          No milestones match the selected filters.
        </div>
      ) : (
        milestones.map((m, i) => <MilestoneCard key={m.yearSort} milestone={m} index={i} />)
      )}
    </SectionWrapper>
  );
}

// ── Olympics timeline ──────────────────────────────────────────────────────────

function OlympicsTimeline() {
  return (
    <SectionWrapper title="Summer Olympics — Host Cities (1896–2024)" icon="🏛️">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}
      >
        {OLYMPICS_TIMELINE.map((entry, i) => (
          <motion.div
            key={entry.year}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025, duration: 0.3, ease: 'easeOut' }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>
                {entry.year}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>
                {entry.city}
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {entry.country}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              {entry.highlight}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── Sports as Politics ─────────────────────────────────────────────────────────

function SportsAsPolitics() {
  return (
    <SectionWrapper title="Sports as Politics — When Games Became History" icon="✊">
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
        Sports have never been "just a game." These five moments changed the world beyond the field.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SPORTS_AS_POLITICS.map((moment, i) => (
          <motion.div
            key={moment.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 12,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9' }}>
                {moment.title}
              </h4>
            </div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
              {moment.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── Firsts ──────────────────────────────────────────────────────────────────────

function FirstsSection() {
  return (
    <SectionWrapper title="Firsts — Barrier-Breaking Moments" icon="🥇">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FIRSTS.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 10,
              padding: '14px 18px',
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#22c55e',
                fontFamily: 'monospace',
                flexShrink: 0,
                minWidth: 40,
              }}
            >
              {f.year}
            </span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>
                {f.detail}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── Greatest Athletes ──────────────────────────────────────────────────────────

function GreatestAthletes() {
  return (
    <SectionWrapper title="Greatest Athletes — 10 Who Changed History" icon="🏆">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {GREATEST_ATHLETES.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 12,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                {a.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    color: '#f59e0b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {a.sport}
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{a.era}</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.55, margin: 0 }}>
              {a.achievement}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared layout helpers (matching project patterns)
// ─────────────────────────────────────────────────────────────────────────────

function SectionWrapper({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#475569',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 18,
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
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function SportsPage() {
  const [activeSport, setActiveSport] = useState<SportType | 'All'>('All');
  const [activeTag, setActiveTag] = useState<SignificanceTag | 'All'>('All');

  // Override overflow:hidden from index.html to allow page scroll
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

  const filteredMilestones = MILESTONES.filter((m) => {
    if (activeSport !== 'All' && m.sport !== activeSport) return false;
    if (activeTag !== 'All' && m.significance !== activeTag) return false;
    return true;
  });

  return (
    <PageShell>
      <HeroSection />
      <FilterBar
        activeSport={activeSport}
        activeTag={activeTag}
        onSportSelect={setActiveSport}
        onTagSelect={setActiveTag}
      />
      <TimelineSection milestones={filteredMilestones} />
      <OlympicsTimeline />
      <SportsAsPolitics />
      <FirstsSection />
      <GreatestAthletes />

      {/* Bottom back-link */}
      <div style={{ padding: '24px 32px' }}>
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
          ← Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
