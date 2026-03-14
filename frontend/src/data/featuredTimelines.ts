/**
 * Featured (pre-built) timelines for the /timelines gallery page.
 *
 * Each timeline contains hardcoded events that reference real historical events.
 * These are static data — no backend or localStorage needed.
 */
import type { TimelineEvent } from '../store/timelineBuilder';
import type { EventCategory } from '../types';

/** A featured timeline definition. */
export interface FeaturedTimeline {
  id: string;
  name: string;
  description: string;
  events: TimelineEvent[];
}

/** Helper to create a timeline event inline. */
function ev(
  id: string,
  title: string,
  year: number,
  category: EventCategory,
  region?: string,
): TimelineEvent {
  return {
    id,
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
    title,
    year_approx: year,
    category,
    geo_modern: region,
    importance_score: 0.85,
  };
}

export const FEATURED_TIMELINES: FeaturedTimeline[] = [
  {
    id: 'featured-rome',
    name: 'The Rise and Fall of Rome',
    description: 'From the founding of the Republic through imperial expansion to the fall of the Western Empire.',
    events: [
      ev('r1', 'Founding of the Roman Republic', -509, 'political', 'Rome, Italy'),
      ev('r2', 'Twelve Tables of Roman Law', -449, 'political', 'Rome, Italy'),
      ev('r3', 'Sack of Rome by the Gauls', -390, 'war', 'Rome, Italy'),
      ev('r4', 'Punic Wars Begin', -264, 'war', 'Mediterranean'),
      ev('r5', 'Destruction of Carthage', -146, 'war', 'Carthage, Tunisia'),
      ev('r6', 'Assassination of Julius Caesar', -44, 'political', 'Rome, Italy'),
      ev('r7', 'Augustus Becomes First Emperor', -27, 'political', 'Rome, Italy'),
      ev('r8', 'Eruption of Vesuvius', 79, 'natural', 'Pompeii, Italy'),
      ev('r9', 'Pax Romana Peak', 117, 'political', 'Roman Empire'),
      ev('r10', 'Edict of Milan', 313, 'cultural', 'Milan, Italy'),
      ev('r11', 'Division of the Roman Empire', 285, 'political', 'Roman Empire'),
      ev('r12', 'Visigoths Sack Rome', 410, 'war', 'Rome, Italy'),
      ev('r13', 'Fall of the Western Roman Empire', 476, 'political', 'Ravenna, Italy'),
    ],
  },
  {
    id: 'featured-exploration',
    name: 'The Age of Exploration',
    description: 'European maritime expeditions that connected continents and reshaped the world.',
    events: [
      ev('e1', 'Henry the Navigator Sponsors Expeditions', 1418, 'discovery', 'Sagres, Portugal'),
      ev('e2', 'Fall of Constantinople', 1453, 'war', 'Istanbul, Turkey'),
      ev('e3', 'Columbus Reaches the Americas', 1492, 'discovery', 'Caribbean'),
      ev('e4', 'Treaty of Tordesillas', 1494, 'political', 'Tordesillas, Spain'),
      ev('e5', 'Vasco da Gama Reaches India', 1498, 'discovery', 'Calicut, India'),
      ev('e6', 'Cabral Claims Brazil', 1500, 'discovery', 'Brazil'),
      ev('e7', 'Cortes Conquers the Aztec Empire', 1521, 'war', 'Tenochtitlan, Mexico'),
      ev('e8', 'Magellan Circumnavigation Completed', 1522, 'discovery', 'Global'),
      ev('e9', 'Pizarro Conquers the Inca Empire', 1533, 'war', 'Cusco, Peru'),
      ev('e10', 'Founding of Potosi Silver Mines', 1545, 'cultural', 'Potosi, Bolivia'),
      ev('e11', 'Spanish Armada Defeated', 1588, 'war', 'English Channel'),
      ev('e12', 'Dutch East India Company Founded', 1602, 'cultural', 'Amsterdam, Netherlands'),
    ],
  },
  {
    id: 'featured-ww2',
    name: 'World War II: A Global View',
    description: 'The deadliest conflict in human history, from Hitlers rise to the atomic age.',
    events: [
      ev('w1', 'Hitler Becomes Chancellor', 1933, 'political', 'Berlin, Germany'),
      ev('w2', 'Spanish Civil War Begins', 1936, 'war', 'Spain'),
      ev('w3', 'Invasion of Poland', 1939, 'war', 'Poland'),
      ev('w4', 'Fall of France', 1940, 'war', 'Paris, France'),
      ev('w5', 'Battle of Britain', 1940, 'war', 'United Kingdom'),
      ev('w6', 'Operation Barbarossa', 1941, 'war', 'Soviet Union'),
      ev('w7', 'Attack on Pearl Harbor', 1941, 'war', 'Hawaii, USA'),
      ev('w8', 'Battle of Midway', 1942, 'war', 'Pacific Ocean'),
      ev('w9', 'Battle of Stalingrad', 1942, 'war', 'Stalingrad, Russia'),
      ev('w10', 'Allied Invasion of Sicily', 1943, 'war', 'Sicily, Italy'),
      ev('w11', 'D-Day Normandy Landings', 1944, 'war', 'Normandy, France'),
      ev('w12', 'Liberation of Paris', 1944, 'war', 'Paris, France'),
      ev('w13', 'Battle of the Bulge', 1944, 'war', 'Ardennes, Belgium'),
      ev('w14', 'Yalta Conference', 1945, 'political', 'Yalta, Crimea'),
      ev('w15', 'Fall of Berlin', 1945, 'war', 'Berlin, Germany'),
      ev('w16', 'Atomic Bombing of Hiroshima', 1945, 'war', 'Hiroshima, Japan'),
      ev('w17', 'Atomic Bombing of Nagasaki', 1945, 'war', 'Nagasaki, Japan'),
      ev('w18', 'Japan Surrenders', 1945, 'political', 'Tokyo Bay, Japan'),
      ev('w19', 'Nuremberg Trials Begin', 1945, 'political', 'Nuremberg, Germany'),
    ],
  },
  {
    id: 'featured-science',
    name: 'The Scientific Revolution',
    description: 'Breakthroughs in science and mathematics that transformed our understanding of the universe.',
    events: [
      ev('s1', 'Copernicus Publishes De Revolutionibus', 1543, 'discovery', 'Frauenburg, Poland'),
      ev('s2', 'Vesalius Publishes On the Fabric of the Human Body', 1543, 'discovery', 'Basel, Switzerland'),
      ev('s3', 'Tycho Brahes Astronomical Observations', 1572, 'discovery', 'Hven, Denmark'),
      ev('s4', 'Galileo Observes Jupiter\'s Moons', 1610, 'discovery', 'Padua, Italy'),
      ev('s5', 'Kepler\'s Laws of Planetary Motion', 1619, 'discovery', 'Linz, Austria'),
      ev('s6', 'William Harvey Describes Blood Circulation', 1628, 'discovery', 'London, England'),
      ev('s7', 'Descartes Publishes Discourse on Method', 1637, 'cultural', 'Leiden, Netherlands'),
      ev('s8', 'Founding of the Royal Society', 1660, 'cultural', 'London, England'),
      ev('s9', 'Robert Hooke\'s Micrographia', 1665, 'discovery', 'London, England'),
      ev('s10', 'Newton\'s Principia Mathematica', 1687, 'discovery', 'Cambridge, England'),
      ev('s11', 'Leibniz Develops Calculus', 1684, 'discovery', 'Hanover, Germany'),
      ev('s12', 'Linnaeus Publishes Systema Naturae', 1735, 'discovery', 'Uppsala, Sweden'),
      ev('s13', 'Franklin\'s Electricity Experiments', 1752, 'discovery', 'Philadelphia, USA'),
    ],
  },
  {
    id: 'featured-cold-war',
    name: 'The Cold War',
    description: 'Superpower rivalry between the US and Soviet Union that defined the second half of the 20th century.',
    events: [
      ev('c1', 'Iron Curtain Speech', 1946, 'political', 'Fulton, Missouri, USA'),
      ev('c2', 'Truman Doctrine Announced', 1947, 'political', 'Washington, DC, USA'),
      ev('c3', 'Berlin Blockade and Airlift', 1948, 'political', 'Berlin, Germany'),
      ev('c4', 'NATO Founded', 1949, 'political', 'Washington, DC, USA'),
      ev('c5', 'Soviet Union Tests Atomic Bomb', 1949, 'war', 'Semipalatinsk, Kazakhstan'),
      ev('c6', 'Korean War Begins', 1950, 'war', 'Korean Peninsula'),
      ev('c7', 'Hungarian Revolution', 1956, 'political', 'Budapest, Hungary'),
      ev('c8', 'Sputnik Launched', 1957, 'discovery', 'Baikonur, Kazakhstan'),
      ev('c9', 'Bay of Pigs Invasion', 1961, 'war', 'Cuba'),
      ev('c10', 'Cuban Missile Crisis', 1962, 'political', 'Cuba / Washington'),
      ev('c11', 'Moon Landing', 1969, 'discovery', 'Sea of Tranquility, Moon'),
      ev('c12', 'Vietnam War Ends', 1975, 'war', 'Saigon, Vietnam'),
      ev('c13', 'Soviet Invasion of Afghanistan', 1979, 'war', 'Kabul, Afghanistan'),
      ev('c14', 'Solidarity Movement in Poland', 1980, 'political', 'Gdansk, Poland'),
      ev('c15', 'Chernobyl Disaster', 1986, 'natural', 'Chernobyl, Ukraine'),
      ev('c16', 'Fall of the Berlin Wall', 1989, 'political', 'Berlin, Germany'),
      ev('c17', 'Dissolution of the Soviet Union', 1991, 'political', 'Moscow, Russia'),
    ],
  },
  {
    id: 'featured-revolutions',
    name: 'Revolutions That Changed the World',
    description: 'Popular uprisings and political revolutions that reshaped nations and ideologies.',
    events: [
      ev('v1', 'American Revolution Begins', 1775, 'war', 'Lexington, Massachusetts, USA'),
      ev('v2', 'Declaration of Independence', 1776, 'political', 'Philadelphia, USA'),
      ev('v3', 'Storming of the Bastille', 1789, 'political', 'Paris, France'),
      ev('v4', 'Haitian Revolution', 1791, 'war', 'Saint-Domingue, Haiti'),
      ev('v5', 'Latin American Wars of Independence Begin', 1810, 'war', 'South America'),
      ev('v6', 'Greek War of Independence', 1821, 'war', 'Greece'),
      ev('v7', 'Revolutions of 1848', 1848, 'political', 'Europe'),
      ev('v8', 'Meiji Restoration', 1868, 'political', 'Tokyo, Japan'),
      ev('v9', 'Paris Commune', 1871, 'political', 'Paris, France'),
      ev('v10', 'Russian Revolution of 1905', 1905, 'political', 'St. Petersburg, Russia'),
      ev('v11', 'Mexican Revolution', 1910, 'war', 'Mexico'),
      ev('v12', 'Russian Revolution', 1917, 'political', 'Petrograd, Russia'),
    ],
  },
];
