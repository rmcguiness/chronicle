/**
 * SpacePage — "Beyond Earth: The History of Space Exploration"
 *
 * Route: /space
 *
 * Sections:
 *  1. Hero — title + tagline
 *  2. Timeline — 40+ milestones grouped by era
 *  3. US vs USSR Scoreboard — space race firsts tally
 *  4. Record Progression — altitude/distance milestones
 *  5. What's Out There Now — active missions
 *  6. Next Missions — upcoming launches/programs
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SpaceMilestone {
  year: number;
  endYear?: number;
  title: string;
  detail: string;
  country?: 'USA' | 'USSR' | 'International' | 'ESA' | 'Germany';
  era: Era;
}

type Era =
  | 'EARLY_DREAMS'
  | 'V2_WAR'
  | 'SPACE_RACE'
  | 'POST_RACE';

interface ScoreEntry {
  year: number;
  label: string;
  country: 'USA' | 'USSR';
}

interface RecordEntry {
  year: number;
  label: string;
  distance: string;
  distanceKm: number;
}

interface ActiveMission {
  name: string;
  launched: number;
  status: string;
  location: string;
}

interface UpcomingMission {
  name: string;
  target: string;
  est: string;
  agency: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const ERA_LABELS: Record<Era, string> = {
  EARLY_DREAMS: 'Early Dreams (1609–1926)',
  V2_WAR: 'V-2 and the War Era (1942–1945)',
  SPACE_RACE: 'The Space Race (1957–1976)',
  POST_RACE: 'Post-Race Era (1977–Present)',
};

const ERA_COLORS: Record<Era, string> = {
  EARLY_DREAMS: '#a78bfa',
  V2_WAR: '#ef4444',
  SPACE_RACE: '#3b82f6',
  POST_RACE: '#22c55e',
};

const MILESTONES: SpaceMilestone[] = [
  // EARLY DREAMS
  { year: 1609, title: "Galileo's Telescope", detail: 'Galileo turns his telescope skyward, observing the Moon, Jupiter\'s moons, and Saturn\'s rings — proving celestial bodies are physical worlds.', era: 'EARLY_DREAMS' },
  { year: 1687, title: "Newton's Principia", detail: 'Isaac Newton publishes Principia Mathematica, explaining orbital mechanics and gravity — the mathematical foundation of all spaceflight.', era: 'EARLY_DREAMS' },
  { year: 1865, title: 'Jules Verne "From the Earth to the Moon"', detail: 'Verne\'s novel imagines a crewed capsule launched from Florida toward the Moon — eerily predicting Apollo a century later.', era: 'EARLY_DREAMS' },
  { year: 1903, title: "Tsiolkovsky's Rocket Equation", detail: 'Konstantin Tsiolkovsky derives the fundamental equation of rocketry, proving space travel is mathematically possible with multi-stage rockets.', era: 'EARLY_DREAMS' },
  { year: 1926, title: "Goddard's First Liquid-Fuel Rocket", detail: 'Robert Goddard launches the first liquid-fueled rocket in Auburn, Massachusetts. It flies 41 feet in 2.5 seconds — the birth of modern rocketry.', era: 'EARLY_DREAMS' },

  // V-2 AND WAR ERA
  { year: 1942, title: 'V-2 Rocket', detail: 'Nazi Germany\'s A4/V-2 becomes the first object to reach space (crossing the Kármán line). Designed by Wernher von Braun using forced labor — a weapon that became the ancestor of all space launchers.', country: 'Germany', era: 'V2_WAR' },
  { year: 1945, title: 'Operation Paperclip', detail: 'The US secretly recruits over 1,600 German scientists and engineers, including von Braun, laying the foundation for America\'s rocket program.', country: 'USA', era: 'V2_WAR' },

  // SPACE RACE
  { year: 1957, title: 'Sputnik 1', detail: 'The Soviet Union launches the first artificial satellite. Its steady beep, heard by radio operators worldwide, marks the dawn of the Space Age and shocks the West.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1957, title: 'Laika', detail: 'A stray dog from Moscow becomes the first living creature to orbit Earth aboard Sputnik 2. Laika did not survive the flight — sparking both scientific triumph and ethical debate.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1958, title: 'Explorer 1', detail: 'First successful US satellite, carrying instruments that discover the Van Allen radiation belts — the first major scientific discovery of the Space Age.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1958, title: 'NASA Founded', detail: 'President Eisenhower signs the National Aeronautics and Space Act, creating NASA as a civilian agency to lead American space exploration.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1959, title: 'Luna 1', detail: 'First spacecraft to escape Earth\'s gravity, passing within 6,000 km of the Moon. Discovers the solar wind on its journey.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1961, title: 'Yuri Gagarin', detail: 'On April 12, Gagarin becomes the first human in space, completing one orbit of Earth in 108 minutes aboard Vostok 1. "Poyekhali!" — Let\'s go!', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1961, title: 'Alan Shepard', detail: 'First American in space on a 15-minute suborbital flight aboard Freedom 7. The Mercury program proves America can reach space.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1962, title: 'John Glenn', detail: 'First American to orbit Earth, circling three times aboard Friendship 7. Glenn becomes a national hero and later, the oldest person in space (1998, age 77).', country: 'USA', era: 'SPACE_RACE' },
  { year: 1963, title: 'Valentina Tereshkova', detail: 'First woman in space, spending nearly three days in orbit aboard Vostok 6. It would be 19 years before another woman reached space.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1965, title: 'Alexei Leonov — First Spacewalk', detail: 'Leonov floats outside Voskhod 2 for 12 minutes, the first extravehicular activity. His suit inflates dangerously; he must bleed air to re-enter the airlock.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1965, title: 'Gemini Program', detail: 'NASA\'s Gemini missions (1965–66) master spacewalking, orbital rendezvous, and docking — all critical techniques needed for the Moon landing.', endYear: 1966, country: 'USA', era: 'SPACE_RACE' },
  { year: 1966, title: 'Surveyor 1', detail: 'First American spacecraft to achieve a soft landing on the Moon, proving the lunar surface can support a lander — clearing the way for Apollo.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1967, title: 'Apollo 1 Fire', detail: 'Astronauts Grissom, White, and Chaffee killed in a launchpad fire during a test. The tragedy leads to a complete redesign of the Apollo capsule.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1968, title: 'Apollo 8', detail: 'First humans to orbit the Moon. On Christmas Eve, the crew reads Genesis while broadcasting; Bill Anders takes the iconic Earthrise photograph.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1969, title: 'Apollo 11 — Moon Landing', detail: 'On July 20, Neil Armstrong and Buzz Aldrin land on the Moon while Michael Collins orbits above. "That\'s one small step for man, one giant leap for mankind." 600 million watch live.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1970, title: 'Luna 16', detail: 'First robotic mission to land on the Moon, collect samples, and return them to Earth — proving unmanned sample-return is possible.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1970, title: 'Apollo 13', detail: '"Houston, we\'ve had a problem." An oxygen tank explosion aborts the Moon landing. The crew survives through ingenuity — a "successful failure."', country: 'USA', era: 'SPACE_RACE' },
  { year: 1971, title: 'Salyut 1', detail: 'First space station in orbit. Cosmonauts spend 23 days aboard, but tragically die during re-entry when a valve opens, depressurizing the capsule.', country: 'USSR', era: 'SPACE_RACE' },
  { year: 1972, title: 'Pioneer 10', detail: 'First spacecraft to traverse the asteroid belt and fly by Jupiter. Carries a gold plaque with a message for any extraterrestrial finders.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1972, title: 'Apollo 17 — Last Moon Landing', detail: 'Gene Cernan becomes the last human to walk on the Moon. Harrison Schmitt, a geologist, is the only scientist to visit. No one has returned since.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1973, title: 'Skylab', detail: 'First American space station, converted from a Saturn V upper stage. Crews spend up to 84 days in orbit, proving long-duration spaceflight is feasible.', country: 'USA', era: 'SPACE_RACE' },
  { year: 1975, title: 'Apollo-Soyuz', detail: 'American and Soviet spacecraft dock in orbit; astronauts and cosmonauts shake hands through the hatch. A Cold War thaw 250 km above Earth.', country: 'International', era: 'SPACE_RACE' },
  { year: 1976, title: 'Viking 1', detail: 'First successful Mars surface mission. Sends back the first photos from the Martian surface and conducts soil experiments searching for life.', country: 'USA', era: 'SPACE_RACE' },

  // POST-RACE ERA
  { year: 1977, title: 'Voyager 1 & 2', detail: 'Twin probes launch on a grand tour of the outer planets. Voyager 1 is now the most distant human-made object, still sending data from interstellar space.', country: 'USA', era: 'POST_RACE' },
  { year: 1981, title: 'Space Shuttle Columbia', detail: 'First reusable spacecraft launches, promising routine access to space. The Shuttle program will fly 135 missions over 30 years.', country: 'USA', era: 'POST_RACE' },
  { year: 1986, title: 'Challenger Disaster', detail: 'Space Shuttle Challenger breaks apart 73 seconds after launch, killing all 7 crew including teacher Christa McAuliffe. A nation mourns; O-ring failure blamed.', country: 'USA', era: 'POST_RACE' },
  { year: 1986, title: 'Mir Space Station', detail: 'Soviet/Russian station operates for 15 years (1986–2001), setting records for continuous human presence. Proves humans can live in space long-term.', endYear: 2001, country: 'USSR', era: 'POST_RACE' },
  { year: 1990, title: 'Hubble Space Telescope', detail: 'Launched with a flawed mirror, later repaired by shuttle astronauts. Hubble transforms our understanding of the universe — galaxies, nebulae, dark energy, and the age of the cosmos.', country: 'USA', era: 'POST_RACE' },
  { year: 1997, title: 'Mars Pathfinder / Sojourner', detail: 'First Mars rover — the microwave-oven-sized Sojourner explores the Ares Vallis floodplain. Proves mobile robots can do science on another world.', country: 'USA', era: 'POST_RACE' },
  { year: 1998, title: 'ISS Construction Begins', detail: '15 nations collaborate to build the International Space Station (1998–2011). Continuously occupied since November 2000 — humanity\'s permanent outpost in space.', endYear: 2011, country: 'International', era: 'POST_RACE' },
  { year: 2003, title: 'Columbia Disaster', detail: 'Space Shuttle Columbia disintegrates during re-entry, killing all 7 crew. Heat shield foam damage during launch proved fatal. The Shuttle program\'s second tragedy.', country: 'USA', era: 'POST_RACE' },
  { year: 2012, title: 'SpaceX Dragon', detail: 'First commercial spacecraft to dock with the ISS. SpaceX proves private companies can deliver cargo to orbit, beginning a new era of commercial spaceflight.', country: 'USA', era: 'POST_RACE' },
  { year: 2012, title: 'Curiosity Rover', detail: 'The car-sized Mars Science Laboratory lands using a sky crane. Curiosity discovers ancient river beds and organic molecules — Mars was once habitable.', country: 'USA', era: 'POST_RACE' },
  { year: 2015, title: 'New Horizons at Pluto', detail: 'After a 9.5-year journey, New Horizons flies past Pluto, revealing a heart-shaped nitrogen plain, blue skies, and mountain ranges of water ice.', country: 'USA', era: 'POST_RACE' },
  { year: 2015, title: 'SpaceX Falcon 9 Landing', detail: 'First orbital-class rocket booster lands vertically after delivering a payload to orbit. Reusable rockets fundamentally change the economics of spaceflight.', country: 'USA', era: 'POST_RACE' },
  { year: 2021, title: 'Perseverance + Ingenuity', detail: 'Perseverance rover lands in Jezero Crater; Ingenuity helicopter achieves the first powered flight on another planet — the Wright Brothers moment on Mars.', country: 'USA', era: 'POST_RACE' },
  { year: 2021, title: 'James Webb Space Telescope', detail: 'Launched on Christmas Day, JWST unfolds its golden mirror at L2. Sees 13.6 billion years into the past — the deepest infrared images of the universe ever captured.', country: 'International', era: 'POST_RACE' },
  { year: 2022, title: 'Artemis I', detail: 'NASA\'s Orion capsule flies uncrewed around the Moon and back, testing systems for the return of humans to the lunar surface. The Artemis program begins.', country: 'USA', era: 'POST_RACE' },
  { year: 2024, title: 'Commercial Crew Era', detail: 'SpaceX, Boeing, and Blue Origin routinely launch astronauts and tourists. Space access expands beyond government agencies to the private sector.', country: 'USA', era: 'POST_RACE' },
];

const SPACE_RACE_SCORES: ScoreEntry[] = [
  { year: 1957, label: 'First satellite (Sputnik)', country: 'USSR' },
  { year: 1957, label: 'First animal in orbit (Laika)', country: 'USSR' },
  { year: 1958, label: 'First US satellite (Explorer 1)', country: 'USA' },
  { year: 1959, label: 'First to escape Earth gravity (Luna 1)', country: 'USSR' },
  { year: 1961, label: 'First human in space (Gagarin)', country: 'USSR' },
  { year: 1961, label: 'First American in space (Shepard)', country: 'USA' },
  { year: 1962, label: 'First American in orbit (Glenn)', country: 'USA' },
  { year: 1963, label: 'First woman in space (Tereshkova)', country: 'USSR' },
  { year: 1965, label: 'First spacewalk (Leonov)', country: 'USSR' },
  { year: 1965, label: 'First orbital rendezvous (Gemini 6/7)', country: 'USA' },
  { year: 1966, label: 'First soft Moon landing (Luna 9)', country: 'USSR' },
  { year: 1966, label: 'First docking in space (Gemini 8)', country: 'USA' },
  { year: 1968, label: 'First humans to orbit Moon (Apollo 8)', country: 'USA' },
  { year: 1969, label: 'First Moon landing (Apollo 11)', country: 'USA' },
  { year: 1970, label: 'First robotic sample return (Luna 16)', country: 'USSR' },
  { year: 1971, label: 'First space station (Salyut 1)', country: 'USSR' },
  { year: 1972, label: 'First to Jupiter (Pioneer 10)', country: 'USA' },
];

const RECORD_PROGRESSION: RecordEntry[] = [
  { year: 1926, label: "Goddard's rocket", distance: '12.5 m', distanceKm: 0.0000125 },
  { year: 1942, label: 'V-2 rocket', distance: '84 km (edge of space)', distanceKm: 84 },
  { year: 1957, label: 'Sputnik 1 orbit', distance: '215–939 km orbit', distanceKm: 939 },
  { year: 1959, label: 'Luna 1', distance: '384,000 km (Moon distance)', distanceKm: 384000 },
  { year: 1962, label: 'Mariner 2 to Venus', distance: '41.4M km', distanceKm: 41400000 },
  { year: 1969, label: 'Apollo 11 (crewed)', distance: '384,400 km (Moon)', distanceKm: 384400 },
  { year: 1972, label: 'Pioneer 10', distance: '628M km (Jupiter)', distanceKm: 628000000 },
  { year: 1977, label: 'Voyager 1', distance: '24B+ km (interstellar)', distanceKm: 24000000000 },
  { year: 2015, label: 'New Horizons', distance: '7.5B km (Pluto)', distanceKm: 7500000000 },
];

const ACTIVE_MISSIONS: ActiveMission[] = [
  { name: 'Voyager 1', launched: 1977, status: 'Active — interstellar space', location: '24B+ km from Earth' },
  { name: 'Voyager 2', launched: 1977, status: 'Active — interstellar space', location: '20B+ km from Earth' },
  { name: 'International Space Station', launched: 1998, status: 'Continuously occupied', location: 'Low Earth Orbit (408 km)' },
  { name: 'Curiosity Rover', launched: 2011, status: 'Active on Mars', location: 'Gale Crater, Mars' },
  { name: 'OSIRIS-REx (OSIRIS-APEX)', launched: 2016, status: 'En route to Apophis', location: 'Heliocentric orbit' },
  { name: 'Parker Solar Probe', launched: 2018, status: 'Closest approach to Sun', location: 'Solar orbit' },
  { name: 'Perseverance Rover', launched: 2020, status: 'Active on Mars', location: 'Jezero Crater, Mars' },
  { name: 'Ingenuity Helicopter', launched: 2020, status: 'Retired (72 flights)', location: 'Jezero Crater, Mars' },
  { name: 'James Webb Space Telescope', launched: 2021, status: 'Operational', location: 'L2 Lagrange point (1.5M km)' },
  { name: 'DART (impact complete)', launched: 2021, status: 'Impact confirmed — redirected Dimorphos', location: 'Didymos system' },
];

const UPCOMING_MISSIONS: UpcomingMission[] = [
  { name: 'Artemis II', target: 'Crewed lunar flyby', est: '2025', agency: 'NASA' },
  { name: 'Artemis III', target: 'Crewed Moon landing (first since 1972)', est: '2026+', agency: 'NASA / SpaceX' },
  { name: 'Europa Clipper', target: 'Jupiter\'s moon Europa — ocean search', est: 'Arriving ~2030', agency: 'NASA' },
  { name: 'Dragonfly', target: 'Titan rotorcraft lander', est: '2028', agency: 'NASA' },
  { name: 'Mars Sample Return', target: 'Bring Perseverance samples to Earth', est: 'TBD (redesign)', agency: 'NASA / ESA' },
  { name: 'Starship to Mars', target: 'First crewed Mars missions', est: '2030s', agency: 'SpaceX' },
  { name: 'Lunar Gateway', target: 'Cislunar space station', est: '2025–2028', agency: 'NASA / ESA / JAXA / CSA' },
];

const COUNTRY_COLORS = {
  USA: '#3b82f6',
  USSR: '#ef4444',
  International: '#a855f7',
  ESA: '#22c55e',
  Germany: '#6b7280',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div
      style={{
        padding: '60px 32px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(59,130,246,0.08) 50%, rgba(139,92,246,0.06) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Star field effect */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.3,
        background: 'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 40% 70%, white, transparent), radial-gradient(1px 1px at 60% 20%, white, transparent), radial-gradient(1px 1px at 80% 50%, white, transparent), radial-gradient(1px 1px at 10% 80%, white, transparent), radial-gradient(1px 1px at 70% 90%, white, transparent), radial-gradient(1px 1px at 50% 10%, white, transparent), radial-gradient(1px 1px at 30% 60%, white, transparent), radial-gradient(1px 1px at 90% 40%, white, transparent), radial-gradient(1px 1px at 15% 50%, white, transparent)',
      }} />

      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: '#64748b', textDecoration: 'none',
          marginBottom: 32, padding: '6px 12px', borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(255,255,255,0.04)',
          position: 'relative',
        }}
      >
        ← Back to Timeline
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative' }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
          color: '#f1f5f9', lineHeight: 1.2, marginBottom: 12,
        }}>
          Beyond Earth
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)', color: '#94a3b8',
          fontWeight: 400, maxWidth: 600, margin: '0 auto',
        }}>
          The History of Space Exploration
        </p>
      </motion.div>
    </div>
  );
}

function CountryBadge({ country }: { country?: string }) {
  if (!country) return null;
  const color = COUNTRY_COLORS[country as keyof typeof COUNTRY_COLORS] ?? '#6b7280';
  const flags: Record<string, string> = { USA: '🇺🇸', USSR: '☭', International: '🌍', ESA: '🇪🇺', Germany: '🇩🇪' };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
      backgroundColor: `${color}22`, color, display: 'inline-flex',
      alignItems: 'center', gap: 4,
    }}>
      <span style={{ fontSize: 12 }}>{flags[country] ?? ''}</span>
      {country}
    </span>
  );
}

function TimelineSection() {
  const eras = ['EARLY_DREAMS', 'V2_WAR', 'SPACE_RACE', 'POST_RACE'] as Era[];

  return (
    <section style={{ padding: '48px 32px', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{
        fontSize: 24, fontWeight: 700, color: '#f1f5f9',
        marginBottom: 32, textAlign: 'center',
      }}>
        Timeline — From Galileo to the Stars
      </h2>

      {eras.map((era) => {
        const eraEvents = MILESTONES.filter((m) => m.era === era);
        const color = ERA_COLORS[era];
        return (
          <div key={era} style={{ marginBottom: 40 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 20, paddingBottom: 8,
              borderBottom: `2px solid ${color}44`,
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                backgroundColor: color, boxShadow: `0 0 12px ${color}66`,
              }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color, letterSpacing: '0.02em' }}>
                {ERA_LABELS[era]}
              </h3>
            </div>

            <div style={{ position: 'relative', paddingLeft: 28 }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute', left: 5, top: 0, bottom: 0,
                width: 2, backgroundColor: `${color}33`,
              }} />

              {eraEvents.map((m, i) => (
                <motion.div
                  key={`${m.year}-${m.title}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  style={{
                    position: 'relative', marginBottom: 20,
                    padding: '16px 20px', borderRadius: 10,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Dot on timeline */}
                  <div style={{
                    position: 'absolute', left: -24, top: 20,
                    width: 10, height: 10, borderRadius: '50%',
                    backgroundColor: color, border: '2px solid #0a1628',
                  }} />

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    marginBottom: 8, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700, color: `${color}cc`,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {m.endYear ? `${m.year}–${m.endYear}` : m.year}
                    </span>
                    <CountryBadge country={m.country} />
                  </div>

                  <h4 style={{
                    fontSize: 16, fontWeight: 700, color: '#e2e8f0',
                    marginBottom: 6,
                  }}>
                    {m.title}
                  </h4>
                  <p style={{
                    fontSize: 14, color: '#94a3b8', lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {m.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ScoreboardSection() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const years = [...new Set(SPACE_RACE_SCORES.map((s) => s.year))].sort();

  const getScores = (upToYear: number | null) => {
    const entries = upToYear
      ? SPACE_RACE_SCORES.filter((s) => s.year <= upToYear)
      : SPACE_RACE_SCORES;
    const usa = entries.filter((s) => s.country === 'USA').length;
    const ussr = entries.filter((s) => s.country === 'USSR').length;
    return { usa, ussr, entries };
  };

  const { usa, ussr, entries } = getScores(selectedYear);

  return (
    <section style={{
      padding: '48px 32px',
      background: 'linear-gradient(180deg, rgba(7,14,34,0) 0%, rgba(59,130,246,0.04) 50%, rgba(7,14,34,0) 100%)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 700, color: '#f1f5f9',
          marginBottom: 8, textAlign: 'center',
        }}>
          🇺🇸 USA vs USSR ☭ — Space Race Scoreboard
        </h2>
        <p style={{
          fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32,
        }}>
          "Firsts" achieved by each superpower. Click a year to filter.
        </p>

        {/* Year filter */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          justifyContent: 'center', marginBottom: 28,
        }}>
          <button
            onClick={() => setSelectedYear(null)}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12,
              fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: selectedYear === null ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
              color: selectedYear === null ? '#f1f5f9' : '#64748b',
              cursor: 'pointer',
            }}
          >
            All
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              style={{
                padding: '4px 12px', borderRadius: 6, fontSize: 12,
                fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: selectedYear === y ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                color: selectedYear === y ? '#f1f5f9' : '#64748b',
                cursor: 'pointer',
              }}
            >
              {y}
            </button>
          ))}
        </div>

        {/* Score display */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          gap: 40, marginBottom: 32,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: COUNTRY_COLORS.USA }}>{usa}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>🇺🇸 USA</div>
          </div>
          <div style={{
            fontSize: 20, color: '#475569', fontWeight: 300,
          }}>
            vs
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: COUNTRY_COLORS.USSR }}>{ussr}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>☭ USSR</div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{
          height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)',
          display: 'flex', overflow: 'hidden', marginBottom: 32,
        }}>
          <div style={{
            width: `${(usa / (usa + ussr)) * 100}%`,
            backgroundColor: COUNTRY_COLORS.USA,
            transition: 'width 0.3s ease',
          }} />
          <div style={{
            width: `${(ussr / (usa + ussr)) * 100}%`,
            backgroundColor: COUNTRY_COLORS.USSR,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Entries list */}
        <div style={{ display: 'grid', gap: 6 }}>
          {entries.map((s, i) => (
            <motion.div
              key={`${s.year}-${s.label}`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 14px', borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: COUNTRY_COLORS[s.country],
                fontVariantNumeric: 'tabular-nums', minWidth: 36,
              }}>
                {s.year}
              </span>
              <CountryBadge country={s.country} />
              <span style={{ fontSize: 13, color: '#cbd5e1', flex: 1 }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecordProgressionSection() {
  const maxLog = Math.log10(RECORD_PROGRESSION[RECORD_PROGRESSION.length - 1].distanceKm);

  return (
    <section style={{ padding: '48px 32px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 700, color: '#f1f5f9',
          marginBottom: 8, textAlign: 'center',
        }}>
          How Far We've Reached
        </h2>
        <p style={{
          fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32,
        }}>
          Distance record progression (logarithmic scale)
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          {RECORD_PROGRESSION.map((r, i) => {
            const pct = r.distanceKm > 0
              ? (Math.log10(r.distanceKm) / maxLog) * 100
              : 0.5;
            return (
              <motion.div
                key={r.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginBottom: 4,
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: '#3b82f6',
                    minWidth: 36, fontVariantNumeric: 'tabular-nums',
                  }}>
                    {r.year}
                  </span>
                  <span style={{ fontSize: 13, color: '#e2e8f0', flex: 1 }}>
                    {r.label}
                  </span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {r.distance}
                  </span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(pct, 2)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    style={{
                      height: '100%', borderRadius: 3,
                      background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ActiveMissionsSection() {
  return (
    <section style={{
      padding: '48px 32px',
      background: 'linear-gradient(180deg, rgba(7,14,34,0) 0%, rgba(34,197,94,0.04) 50%, rgba(7,14,34,0) 100%)',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 700, color: '#f1f5f9',
          marginBottom: 8, textAlign: 'center',
        }}>
          What's Out There Now
        </h2>
        <p style={{
          fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32,
        }}>
          Active and recently completed missions
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {ACTIVE_MISSIONS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '16px 18px', borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: 8,
              }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>
                  {m.name}
                </h4>
                <span style={{
                  fontSize: 11, color: '#22c55e', fontWeight: 600,
                  padding: '2px 8px', borderRadius: 4,
                  backgroundColor: 'rgba(34,197,94,0.12)',
                  whiteSpace: 'nowrap',
                }}>
                  {m.launched}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                {m.status}
              </p>
              <p style={{ fontSize: 12, color: '#64748b' }}>
                📍 {m.location}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingMissionsSection() {
  return (
    <section style={{ padding: '48px 32px 64px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 24, fontWeight: 700, color: '#f1f5f9',
          marginBottom: 8, textAlign: 'center',
        }}>
          Next Missions
        </h2>
        <p style={{
          fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32,
        }}>
          What's coming next in space exploration
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {UPCOMING_MISSIONS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>
                  {m.name}
                </h4>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
                  {m.target}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: '#a855f7',
                  padding: '3px 8px', borderRadius: 4,
                  backgroundColor: 'rgba(168,85,247,0.12)',
                }}>
                  {m.est}
                </span>
                <span style={{ fontSize: 12, color: '#64748b' }}>
                  {m.agency}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function SpacePage() {
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'auto',
      backgroundColor: '#070e22', color: '#f1f5f9',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <HeroSection />
      <TimelineSection />
      <ScoreboardSection />
      <RecordProgressionSection />
      <ActiveMissionsSection />
      <UpcomingMissionsSection />

      {/* Footer */}
      <div style={{
        padding: '24px 32px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link
          to="/"
          style={{
            fontSize: 13, color: '#64748b', textDecoration: 'none',
            padding: '8px 16px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        >
          ← Back to Timeline
        </Link>
      </div>
    </div>
  );
}
