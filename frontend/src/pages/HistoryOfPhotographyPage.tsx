/**
 * HistoryOfPhotographyPage — comprehensive deep-dive on the History of Photography (1000s–Present).
 *
 * Route: /history-of-photography
 *
 * Sections:
 *  1. Hero — headline, overview of photography's transformative power
 *  2. Camera Obscura — Ibn al-Haytham, Renaissance artists, optical principles
 *  3. First Photographs — Niépce's heliography, Daguerre, Talbot's calotype
 *  4. Wet Plate & Civil War — collodion process, Matthew Brady, documentation
 *  5. Democratization — dry plates, Kodak roll film, amateur photography
 *  6. Color & Art Photography — autochrome, Kodachrome, pictorialism, modernism
 *  7. Photojournalism Golden Age — FSA, LIFE, Dorothea Lange, Robert Capa
 *  8. Decisive Moment — Cartier-Bresson, street photography philosophy
 *  9. Space Photography — Earthrise, Pale Blue Dot, Hubble
 * 10. Polaroid & Instant — Edwin Land, SX-70, cultural impact
 * 11. Digital Revolution — CCD sensors, Photoshop, digicams, DSLR
 * 12. Smartphone Era — iPhone, Instagram, everyone a photographer
 * 13. AI & Crisis of Authenticity — generated images, deepfakes, trust
 * 14. Photography's Impact — memory, war, social justice, science
 * 15. Key Terms — photographic vocabulary
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const SEPIA = '#c8a96e';
const AMBER = '#d97706';
const SILVER = '#c0c0c0';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const BLUE = '#3b82f6';
const WARM = '#fbbf24';
const COPPER = '#b45309';
const DARK_AMBER = '#92400e';

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

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: '1826 — oldest surviving photograph',
    detail: 'Joseph Nicéphore Niépce\'s "View from the Window at Le Gras" required an 8-hour exposure on a pewter plate coated with bitumen of Judea.',
  },
  {
    label: '1.81 trillion photos/year',
    detail: 'An estimated 1.81 trillion photographs were taken worldwide in 2024 — more than all photos taken in the entire 20th century combined.',
  },
  {
    label: '19 minutes',
    detail: 'The average daguerreotype exposure time in 1839. By 1842, chemical improvements had reduced it to under 30 seconds — making portraiture possible.',
  },
  {
    label: '$4.3 million',
    detail: 'Price paid for Andreas Gursky\'s "Rhein II" (1999) — the most expensive photograph ever sold at auction, a digitally altered landscape.',
  },
  {
    label: '12.2 megapixels',
    detail: 'Resolution of the original iPhone camera in 2007. By 2024, smartphone cameras exceeded 200MP — more than most professional DSLRs.',
  },
  {
    label: '~95 million photos/day',
    detail: 'Posted to Instagram alone. Social media transformed photography from a craft practiced by professionals into a universal language of daily communication.',
  },
];

// ── Camera Obscura ──────────────────────────────────────────────────────────

const CAMERA_OBSCURA_TIMELINE: TimelineEntry[] = [
  {
    year: '~1000 CE',
    title: 'Ibn al-Haytham: The Father of Optics',
    description:
      'The Arab polymath Ibn al-Haytham (Alhazen) wrote the "Book of Optics" — the most important work on light and vision until Newton. He described the camera obscura principle: light passing through a small hole into a dark room projects an inverted image of the outside world onto the opposite wall. He didn\'t just observe this — he explained why it worked, demonstrating that light travels in straight lines. A thousand years before the first photograph, al-Haytham had described the optical principle behind every camera ever made.',
    color: GOLD,
  },
  {
    year: '1400s–1600s',
    title: 'Renaissance Artists and the Camera Obscura',
    description:
      'Renaissance painters used the camera obscura as a drawing aid — projecting scenes onto canvas to trace outlines with photographic accuracy. Leonardo da Vinci described the device in his notebooks. Vermeer\'s luminous paintings show optical qualities (soft focus, highlight blooms) that strongly suggest camera obscura use. The controversial "Hockney–Falco thesis" argues that many Old Masters secretly used optical devices for centuries. Whether or not this is true, the camera obscura bridged the worlds of art and optics — the same bridge that photography would cross four centuries later.',
    color: AMBER,
  },
  {
    year: '1600s–1700s',
    title: 'Portable Camera Obscuras',
    description:
      'The camera obscura shrank from a room to a portable box. Artists, travelers, and scientists carried them to sketch landscapes and architecture. A lens replaced the pinhole, producing brighter, sharper images. By the 18th century, the device was common among educated Europeans. The only missing piece was a way to fix the projected image permanently — to make light itself draw. That problem would consume scientists for the next century.',
    color: COPPER,
  },
  {
    year: '1725–1777',
    title: 'Photochemistry: Light Meets Chemistry',
    description:
      'Johann Heinrich Schulze (1725) discovered that silver salts darken when exposed to light — the fundamental photochemical reaction behind all analog photography. Carl Wilhelm Scheele (1777) showed that the violet end of the spectrum caused the fastest darkening. These discoveries proved that light could leave a chemical trace. The challenge was controlling that reaction: making it happen where you wanted, stopping it when you wanted, and making the result permanent.',
    color: TEAL,
  },
];

// ── First Photographs ───────────────────────────────────────────────────────

const FIRST_PHOTOS_TIMELINE: TimelineEntry[] = [
  {
    year: '1826',
    title: 'Niépce: The First Photograph',
    description:
      'Joseph Nicéphore Niépce placed a pewter plate coated with bitumen of Judea inside a camera obscura and pointed it out his workshop window at Le Gras, France. After approximately 8 hours of exposure, sunlight hardened the bitumen where it struck, creating a permanent image. The result — a grainy, barely legible view of rooftops and a courtyard — is the oldest surviving photograph. It\'s crude by any standard. But it proved the fundamental concept: light could draw its own picture, without human hands. The implications would transform civilization.',
    color: SEPIA,
  },
  {
    year: '1839',
    title: 'Daguerreotype: Photography Goes Public',
    description:
      'On January 7, 1839, the French Academy of Sciences announced Louis-Jacques-Mandé Daguerre\'s process to the world. The daguerreotype produced a single, unreproducible image on a silver-plated copper sheet — astonishingly detailed, almost holographic in quality. The French government purchased the patent and declared it "a gift to the world." The announcement triggered a global frenzy. Within months, daguerreotype studios opened in every major city. Portraiture — previously affordable only to the wealthy who could commission paintings — became available to the middle class. For the first time in history, ordinary people could see exactly what they looked like.',
    color: GOLD,
  },
  {
    year: '1839–1841',
    title: 'Calotype: The Negative Revolution',
    description:
      'While Daguerre created unique images, English scientist William Henry Fox Talbot invented the calotype — a process that produced a paper negative from which unlimited positive prints could be made. The images were softer than daguerreotypes, less detailed, almost painterly. But Talbot\'s invention was conceptually revolutionary: the negative/positive system. One exposure could produce infinite copies. This was the fundamental architecture of photography for the next 170 years — and the conceptual ancestor of every "copy" and "share" button on every device today.',
    color: AMBER,
  },
  {
    year: '1851',
    title: 'Wet Plate Collodion: Speed and Clarity',
    description:
      'Frederick Scott Archer\'s wet plate collodion process combined the daguerreotype\'s sharpness with the calotype\'s reproducibility. A glass plate coated with collodion and silver salts produced a negative of extraordinary detail. The catch: the plate had to be prepared, exposed, and developed while still wet — all within about 15 minutes. This meant photographers in the field needed a portable darkroom (often a converted wagon). Despite the difficulty, wet plate collodion dominated photography for 30 years and produced some of the most important images of the 19th century.',
    color: SILVER,
  },
];

// ── Civil War & Documentary ─────────────────────────────────────────────────

const CIVIL_WAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Matthew Brady: Photography Goes to War',
    detail:
      'Brady was America\'s most famous portrait photographer when the Civil War began in 1861. He financed teams of photographers — including Alexander Gardner and Timothy O\'Sullivan — to document the conflict. The result was the first comprehensive photographic record of war. Brady\'s team produced over 10,000 images: camps, officers, artillery, fortifications, and — most shockingly — the dead. Brady spent his fortune on the project and died in poverty, but his images defined how Americans remember the Civil War.',
  },
  {
    label: 'The Dead of Antietam',
    detail:
      'When Brady exhibited photographs of corpses from the Battle of Antietam in his New York gallery in October 1862, The New York Times wrote that he had brought "the terrible reality and earnestness of war" to people\'s doorsteps. For the first time, civilians saw what battlefield death actually looked like — not romanticized paintings, but swollen bodies in muddy fields. Photography stripped war of its glory. It would do so again and again, from the trenches of WWI to the jungles of Vietnam to the streets of Syria.',
  },
  {
    label: 'Timothy O\'Sullivan: The American Landscape',
    detail:
      'After the war, O\'Sullivan joined government survey expeditions to the American West. His photographs — vast desert landscapes, ancient ruins, geological formations — shaped how Americans imagined the frontier. "Harvest of Death" (Gettysburg, 1863) became one of the most reproduced war photographs in history. O\'Sullivan demonstrated that photography could be simultaneously documentary and artistic, a tension that would define the medium for the next 160 years.',
  },
  {
    label: 'Photography and the End of Anonymity',
    detail:
      'Before photography, most people who ever lived left no visual record of their existence. The daguerreotype portrait changed this forever. By the 1860s, the carte de visite (small photographic calling cards) created a mass market for personal portraits. Soldiers carried photos of loved ones into battle. Families displayed portraits on mantelpieces. For the first time in history, ordinary people had a visual identity that could outlive them. Photography democratized immortality.',
  },
];

// ── Democratization: Kodak & Roll Film ──────────────────────────────────────

const KODAK_TIMELINE: TimelineEntry[] = [
  {
    year: '1871',
    title: 'Gelatin Dry Plate: Photography Gets Practical',
    description:
      'Richard Leach Maddox invented the gelatin dry plate — a glass plate coated with light-sensitive gelatin silver bromide that could be prepared in advance, stored, and developed at leisure. No more rushing to expose wet plates before they dried. Exposure times dropped to fractions of a second. For the first time, photography could capture motion — a running horse, a crashing wave, a child\'s fleeting expression. The dry plate transformed photography from a cumbersome scientific procedure into something approaching convenience.',
    color: SILVER,
  },
  {
    year: '1888',
    title: 'Kodak #1: "You Press the Button, We Do the Rest"',
    description:
      'George Eastman\'s Kodak camera was a revolution disguised as a box. It came preloaded with a 100-exposure roll of flexible film. When the roll was finished, the owner mailed the entire camera to Kodak. The company developed the film, printed the photographs, reloaded the camera, and mailed everything back. The photographer never entered a darkroom, never mixed chemicals, never handled a glass plate. Eastman didn\'t just simplify photography — he separated the act of taking a picture from the science of making one. Photography became a consumer product.',
    color: GOLD,
  },
  {
    year: '1900',
    title: 'Brownie Camera: Photography for Everyone',
    description:
      'The Kodak Brownie cost $1 (about $37 today). It was a cardboard box with a simple lens, designed for children. It sold 250,000 units in its first year. The Brownie didn\'t just democratize photography — it democratized memory. Working-class families could now photograph birthdays, holidays, and vacations. The snapshot — informal, unposed, imperfect — became a new art form and a new way of experiencing time. The Brownie established the template that every consumer camera, and eventually every smartphone, would follow: simple, cheap, ubiquitous.',
    color: WARM,
  },
  {
    year: '1925',
    title: 'Leica I: The Birth of 35mm',
    description:
      'Oskar Barnack\'s Leica I was the first commercially successful camera to use 35mm film — originally designed for motion pictures. The Leica was small enough to carry in a pocket, quiet enough to use unobtrusively, and fast enough to capture spontaneous moments. It transformed photography from a deliberate, tripod-mounted activity into something fluid and reactive. The 35mm format would dominate photography for 75 years. Nearly every iconic photograph of the 20th century was shot on 35mm film — largely because the Leica made it the standard.',
    color: TEAL,
  },
];

// ── Color Photography ───────────────────────────────────────────────────────

const COLOR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Autochrome (1907): The First Practical Color',
    detail:
      'Auguste and Louis Lumière (the same brothers who invented cinema) created the autochrome — a glass plate covered with microscopic grains of potato starch dyed red, green, and blue that acted as color filters. The results were dreamy, pointillist, and luminous — more like impressionist paintings than modern photographs. Autochromes were fragile and expensive, but for the first time, photographers could capture the world in color. Some of the most beautiful photographs ever taken are autochromes from WWI-era France — a vanished world preserved in color.',
  },
  {
    label: 'Kodachrome (1935): Color Goes Mainstream',
    detail:
      'Kodachrome film, developed by two professional musicians (Leopold Mannes and Leopold Godowsky Jr.) working with Kodak, produced the richest, most saturated color any photographer had ever seen. Its archival stability was extraordinary — Kodachrome slides from the 1930s still look vivid today. National Geographic photographers used it almost exclusively for decades. Paul Simon wrote a song about it. When Kodak discontinued Kodachrome in 2009, photographers mourned it like a death in the family. No digital sensor has ever quite replicated its warm, luminous palette.',
  },
  {
    label: 'Pictorialism vs. Straight Photography',
    detail:
      'In the early 1900s, photographers debated whether photography was art. Pictorialists — led by Alfred Stieglitz — created soft-focus, hand-manipulated prints that mimicked paintings. Then Stieglitz himself changed course, championing "straight photography": sharp focus, no manipulation, the beauty of unadorned reality. Ansel Adams and the f/64 group pushed this further with landscapes of crystalline sharpness. The debate — is photography art, document, or both? — was never resolved. It just became photography\'s permanent creative tension.',
  },
  {
    label: 'Ansel Adams: Landscape as Cathedral',
    detail:
      'Adams\'s black-and-white photographs of the American West — Yosemite\'s Half Dome, the Snake River winding below the Tetons, moonrise over Hernandez — transformed landscape photography into high art. His "Zone System" gave photographers precise control over tonal range from pure black to pure white. Adams was also a passionate environmentalist; his photographs became powerful arguments for wilderness preservation. He demonstrated that a photograph could simultaneously be a work of art, a scientific document, and a political statement.',
  },
];

// ── Photojournalism Golden Age ──────────────────────────────────────────────

const PHOTOJOURNALISM_TIMELINE: TimelineEntry[] = [
  {
    year: '1935–1944',
    title: 'FSA: Documenting the Great Depression',
    description:
      'The Farm Security Administration hired photographers — Dorothea Lange, Walker Evans, Gordon Parks, Arthur Rothstein — to document rural poverty in Depression-era America. The resulting images are among the most powerful photographs ever made. Lange\'s "Migrant Mother" (1936) — a 32-year-old woman with her children in a California pea-pickers\' camp — became the face of the Depression and one of the most reproduced photographs in history. The FSA proved that photography could generate political empathy: the images helped build public support for New Deal relief programs.',
    color: SEPIA,
  },
  {
    year: '1936–1972',
    title: 'LIFE Magazine: The Picture Essay',
    description:
      'Henry Luce\'s LIFE magazine — "to see life; to see the world" — made the photo essay a dominant form of journalism. At its peak, LIFE reached 13.5 million subscribers. Its photographers — Margaret Bourke-White, W. Eugene Smith, Alfred Eisenstaedt — produced images that defined how Americans understood their world. Eisenstaedt\'s "V-J Day in Times Square" (1945), Bourke-White\'s Buchenwald liberation photographs, Smith\'s "Country Doctor" and "Nurse Midwife" essays — these weren\'t just illustrations. They were the stories themselves.',
    color: CRIMSON,
  },
  {
    year: '1936–1954',
    title: 'Robert Capa: Into the Action',
    description:
      'Capa\'s blurred photographs of the D-Day landing at Omaha Beach — eleven surviving images from a destroyed roll — captured the chaos and terror of combat with an immediacy that no carefully composed photograph could match. "If your pictures aren\'t good enough, you\'re not close enough," Capa said. He was close enough: he was killed by a landmine in Indochina in 1954, the first American photojournalist killed in that conflict. Capa co-founded Magnum Photos (1947) — the world\'s most prestigious photo agency, built on the principle that photographers, not publishers, should own their images.',
    color: ROSE,
  },
  {
    year: '1955',
    title: 'The Family of Man: Photography as Universal Language',
    description:
      'Edward Steichen curated "The Family of Man" at MoMA — 503 photographs from 68 countries, organized by universal themes: birth, love, work, death. Nine million people saw the exhibition worldwide. It was the most visited photography exhibition in history and made the argument that photography could transcend cultural boundaries — that a mother holding a child in Peru and a mother holding a child in Japan shared something that the camera could reveal. Critics later attacked its sentimentality, but its ambition — photography as a universal human language — remains powerful.',
    color: BLUE,
  },
];

const WAR_PHOTOGRAPHY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Nick Ut: "Napalm Girl" (1972)',
    detail:
      'Ut\'s photograph of nine-year-old Phan Thi Kim Phuc running naked down a road after a South Vietnamese napalm attack became the defining image of the Vietnam War\'s horror. The AP initially hesitated to publish it because of the child\'s nudity. When it ran, it galvanized anti-war sentiment worldwide. A single photograph helped shift public opinion against a war. Kim Phuc survived, underwent 17 surgeries, and became a UNESCO ambassador. The photograph demonstrated that images can be more powerful than any policy paper or speech.',
  },
  {
    label: 'Eddie Adams: Saigon Execution (1968)',
    detail:
      'Adams photographed South Vietnamese General Nguyen Ngoc Loan executing a Viet Cong prisoner with a pistol shot to the head, point-blank, in a Saigon street. The image, published worldwide, became an icon of the war\'s brutality. Adams later expressed regret, saying the photograph destroyed Loan\'s life while the full context — Loan had just seen his officer\'s family murdered by the prisoner\'s unit — was lost. The photograph raised questions that photojournalism still grapples with: what does a single frame capture, and what does it leave out?',
  },
  {
    label: 'Kevin Carter: The Vulture and the Child (1993)',
    detail:
      'Carter\'s photograph of a starving Sudanese toddler collapsed on the ground while a vulture waited nearby won the Pulitzer Prize and ignited a firestorm of ethical debate. Critics demanded to know: did Carter help the child? (He reportedly chased the vulture away but did not pick up the child.) The image raised the fundamental ethical question of photojournalism: when do you put down the camera and help? Carter took his own life three months after winning the Pulitzer, at age 33.',
  },
];

// ── Decisive Moment ─────────────────────────────────────────────────────────

const DECISIVE_MOMENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Henri Cartier-Bresson: The Decisive Moment',
    detail:
      'Cartier-Bresson defined the decisive moment as "the simultaneous recognition, in a fraction of a second, of the significance of an event as well as the precise organization of forms which gives that event its proper expression." His photographs — a man leaping over a puddle behind the Gare Saint-Lazare, children playing in rubble in Seville — captured split-second compositions of geometric perfection that seemed impossible to plan. He never cropped his images, proving that the composition was achieved in the camera, in the moment. His philosophy influenced every street photographer who followed.',
  },
  {
    label: 'Robert Frank: The Americans (1958)',
    detail:
      'Swiss-born Frank drove across America with a Leica and 767 rolls of film. The resulting book, "The Americans," with an introduction by Jack Kerouac, showed an America that was lonely, melancholy, racially divided, and hauntingly beautiful. The photographs were grainy, tilted, often out of focus — everything the photographic establishment considered technically wrong. Critics initially hated it. But "The Americans" liberated photography from the tyranny of technical perfection and proved that personal vision mattered more than sharp focus.',
  },
  {
    label: 'Garry Winogrand: The Relentless Eye',
    detail:
      'Winogrand photographed compulsively — he left behind 2,500 undeveloped rolls of film (about 90,000 frames) when he died in 1984. His photographs of American life in the 1960s and 1970s — airports, zoos, political rallies, women on the street — were raw, energetic, and seemingly chaotic, yet precisely composed at the edges of the frame. Winogrand proved that the act of photographing was itself a way of understanding the world: "I photograph to find out what something will look like photographed."',
  },
  {
    label: 'Diane Arbus: The Margins',
    detail:
      'Arbus photographed people on the margins of society — giants, dwarfs, nudists, transgender people, twins, the mentally disabled — with a directness that was simultaneously empathetic and unsettling. Her subjects stare straight into the camera, confronting the viewer. Arbus\'s work challenged photography\'s tendency to aestheticize or sentimentalize its subjects. "A photograph is a secret about a secret," she said. "The more it tells you, the less you know." She proved that the camera could be an instrument of radical honesty.',
  },
];

// ── Space Photography ───────────────────────────────────────────────────────

const SPACE_TIMELINE: TimelineEntry[] = [
  {
    year: '1946',
    title: 'First Photo from Space',
    description:
      'A 35mm camera mounted on a captured German V-2 rocket launched from White Sands, New Mexico, took the first photograph from space — a grainy black-and-white image showing Earth\'s curvature from an altitude of 65 miles. The camera was destroyed on impact; the film survived in a steel cassette. For the first time, humans could see their planet from above. It was the beginning of a perspective shift that would, over the next two decades, fundamentally change how humanity understood its place in the universe.',
    color: INDIGO,
  },
  {
    year: '1968',
    title: 'Earthrise: The Most Influential Photograph',
    description:
      'On Christmas Eve 1968, Apollo 8 astronaut William Anders photographed Earth rising above the lunar horizon — a small, blue-and-white marble floating in the blackness of space. "Earthrise" became the most influential environmental photograph ever taken. Wilderness photographer Galen Rowell called it "the most influential environmental photograph ever taken." It galvanized the environmental movement: the first Earth Day (1970), the EPA, and the modern conservation movement all trace their emotional origins to this single image. Photography had shown humanity its own fragility.',
    color: BLUE,
  },
  {
    year: '1990',
    title: 'Pale Blue Dot: 3.7 Billion Miles Away',
    description:
      'At Carl Sagan\'s request, Voyager 1 turned its camera back toward Earth from 3.7 billion miles away. Earth appears as a tiny speck — less than a pixel — suspended in a beam of scattered sunlight. Sagan\'s reflection became one of the most quoted passages in science writing: "Look again at that dot. That\'s here. That\'s home. That\'s us." The photograph, taken by a spacecraft about to leave the solar system forever, used photography for something unprecedented: making humanity feel simultaneously insignificant and precious.',
    color: SKY,
  },
  {
    year: '1995–Present',
    title: 'Hubble and Webb: Photographing the Universe',
    description:
      'The Hubble Deep Field image (1995) pointed the telescope at an apparently empty patch of sky for 10 consecutive days. The result revealed approximately 3,000 galaxies in a region smaller than a grain of sand held at arm\'s length — each galaxy containing hundreds of billions of stars. The James Webb Space Telescope (2022) pushed deeper still, photographing galaxies that formed just 300 million years after the Big Bang. Space photography has revealed that the universe is vaster, older, and stranger than anyone imagined — and has made that revelation available to anyone with an internet connection.',
    color: PURPLE,
  },
];

// ── Polaroid & Instant Photography ──────────────────────────────────────────

const POLAROID_INSIGHTS: InsightEntry[] = [
  {
    label: 'Edwin Land\'s Vision (1947)',
    detail:
      'When Land\'s three-year-old daughter asked why she couldn\'t see a photograph he\'d just taken, Land spent three years developing the answer. The Polaroid Land Camera Model 95, introduced in 1948, produced a finished sepia-toned print in about 60 seconds. It was the first instant camera — and it reframed what a photograph was for. Photography became immediate, social, shareable on the spot. The instant print was a physical object you could hand someone — a precursor to the social, immediate nature of smartphone photography, 60 years early.',
  },
  {
    label: 'SX-70: Design Masterpiece (1972)',
    detail:
      'The Polaroid SX-70 was a folding SLR instant camera that produced self-developing color prints — no peeling, no timing, no waste. You pressed the button and a white-bordered print emerged, slowly developing before your eyes. Ansel Adams was a consultant. Charles and Ray Eames made the promotional film. Andy Warhol made it his signature tool. The SX-70 blurred the line between consumer product and art object, and its square white-bordered prints became one of the most recognizable visual formats of the 20th century — later imitated by Instagram\'s original layout.',
  },
  {
    label: 'Polaroid\'s Collapse and Rebirth',
    detail:
      'Polaroid filed for bankruptcy twice (2001, 2008) as digital photography destroyed the instant film market. But something unexpected happened: artists, hipsters, and nostalgists kept buying instant film. The Impossible Project (later Polaroid Originals) reverse-engineered the chemical process and kept instant film alive. Fujifilm\'s Instax cameras became wildly popular with young photographers who\'d grown up entirely digital. In an age of infinite digital images, the unique, unreproducible physical print became precious again — analog\'s revenge on digital.',
  },
];

// ── Digital Revolution ──────────────────────────────────────────────────────

const DIGITAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1969–1975',
    title: 'CCD Sensor: Light Becomes Data',
    description:
      'Willard Boyle and George Smith invented the charge-coupled device (CCD) at Bell Labs in 1969 — a chip that converted light into electrical signals. In 1975, Kodak engineer Steven Sasson built the first digital camera: it weighed 8 pounds, took 23 seconds to record a single 0.01-megapixel black-and-white image onto a cassette tape. Kodak\'s management looked at the prototype and buried it, fearing it would cannibalize their film business. They were right — it eventually destroyed the company. The digital revolution in photography started with a device its own creators tried to suppress.',
    color: TEAL,
  },
  {
    year: '1990',
    title: 'Photoshop 1.0: Reality Becomes Editable',
    description:
      'Thomas and John Knoll\'s Photoshop, originally developed to display grayscale images on a Mac, was released by Adobe on February 19, 1990. It transformed photography fundamentally: for the first time, any element of an image could be altered after capture. Remove a person, change the sky, smooth skin, adjust colors — the photograph was no longer a record of what happened but a canvas for what the photographer wanted. Photoshop raised the question that would define photography\'s future: if any image can be altered, can any photograph be trusted?',
    color: INDIGO,
  },
  {
    year: '1999–2003',
    title: 'Consumer Digital: The Film Industry Dies',
    description:
      'The Nikon D1 (1999) was the first professional DSLR that photojournalists could actually use. Canon\'s Digital Rebel (2003) brought DSLR quality below $1,000. Digital photography offered instant review, zero film cost, and unlimited shooting. News organizations switched to digital. Wedding photographers switched. Amateurs switched. By 2003, digital camera sales exceeded film camera sales for the first time. Kodak — the company whose engineer invented the digital camera — filed for bankruptcy in 2012. An entire industry built on silver halide chemistry, over 170 years old, collapsed in less than a decade.',
    color: CRIMSON,
  },
  {
    year: '2004–2010',
    title: 'DSLR Golden Age',
    description:
      'The mid-2000s were a golden age for digital photography. DSLRs became affordable and powerful. Flickr (2004) created the first major photo-sharing community. Camera Raw processing let photographers adjust exposure, color, and tone with unprecedented control. High-ISO sensors made available-light photography routine. HD video capability arrived in DSLRs, merging still and motion photography in a single device. Photography had never been more technically capable or more widely practiced. Then the smartphone arrived and changed everything again.',
    color: GREEN,
  },
];

// ── Smartphone Era ──────────────────────────────────────────────────────────

const SMARTPHONE_INSIGHTS: InsightEntry[] = [
  {
    label: 'iPhone (2007): The Camera You Always Have',
    detail:
      'The original iPhone had a 2-megapixel camera with no flash, no autofocus, and no video capability. It didn\'t matter. The best camera, as photographer Chase Jarvis said, is the one that\'s with you. The smartphone camera was always with you — in your pocket, at every meal, at every concert, at every sunset. Within a few years, computational photography (HDR, portrait mode, night mode) made smartphone images competitive with dedicated cameras. By 2024, smartphone cameras had effectively replaced point-and-shoot cameras, and were challenging DSLRs for all but the most demanding professional work.',
  },
  {
    label: 'Instagram (2010): Photography as Social Language',
    detail:
      'Instagram launched on October 6, 2010, and gained 25,000 users on its first day. Its genius was combining three elements: a camera app, photo filters (which made mediocre photos look stylish), and a social feed. Photography became a form of communication — not "look at this beautiful image" but "look at my life." The platform transformed food, travel, fashion, and architecture: restaurants redesigned interiors to be "Instagrammable," cities built attractions for social media. Photography stopped being about memory and became about identity performance.',
  },
  {
    label: 'Computational Photography: Software Eats the Lens',
    detail:
      'Modern smartphone cameras take multiple exposures simultaneously and use AI to merge them into a single optimized image. Google\'s Night Sight makes darkness visible. Apple\'s Deep Fusion analyzes every pixel. Portrait mode simulates the shallow depth of field of expensive lenses using machine learning. The photograph you see on your phone screen is not what the sensor captured — it\'s what the software decided the image should look like. Photography has become a collaboration between human intent and machine interpretation, and most users don\'t know or care about the difference.',
  },
  {
    label: 'Citizen Journalism: Everyone a Witness',
    detail:
      'The smartphone camera transformed citizens into witnesses. The killing of George Floyd (2020) was documented on a bystander\'s phone — footage that sparked the largest protest movement in American history. The Arab Spring was partly organized through shared smartphone images and video. Police brutality, natural disasters, political events — all now documented in real time by millions of cameras. Professional photojournalism didn\'t die; it was supplemented by an army of civilian photographers who happened to be present at history.',
  },
];

// ── AI & Crisis of Authenticity ─────────────────────────────────────────────

const AI_INSIGHTS: InsightEntry[] = [
  {
    label: 'AI Image Generation: The End of "Seeing Is Believing"',
    detail:
      'DALL-E (2021), Midjourney (2022), and Stable Diffusion (2022) can generate photorealistic images from text descriptions. A photograph of a person who never existed, an event that never happened, a place that doesn\'t exist — all indistinguishable from "real" photographs to the human eye. The 180-year-old assumption that a photograph represents something that actually appeared before a camera is no longer reliable. This is not a minor technical development. It is a fundamental break in the evidentiary chain that connected photography to truth since 1839.',
  },
  {
    label: 'Deepfakes: Weaponized Photography',
    detail:
      'AI can now swap faces in video, generate synthetic voices, and create entirely fabricated footage of real people saying things they never said. Political deepfakes have already appeared in elections worldwide. The technology is becoming cheaper and more accessible faster than detection methods can keep up. Photography\'s power always rested on its indexical relationship to reality — the light that made the image actually bounced off a real object. Deepfakes sever that relationship entirely. The question is no longer "was this photo manipulated?" but "was this photo ever a photograph at all?"',
  },
  {
    label: 'The Authentication Crisis',
    detail:
      'News organizations, courts, and social media platforms are scrambling to develop authentication standards for images. C2PA (Coalition for Content Provenance and Authenticity) embeds cryptographic metadata in images at the point of capture. Adobe\'s Content Credentials initiative attaches an unalterable history to every image. But these solutions are opt-in, and most images on the internet have no provenance data. The crisis is existential: photography became the world\'s default form of evidence because people trusted it. If that trust is permanently broken, the consequences extend far beyond photography into journalism, law, science, and democracy itself.',
  },
  {
    label: 'Art Photography in the AI Age',
    detail:
      'AI has forced photographers to confront what makes human photography valuable. A machine can generate a technically perfect sunset. It cannot walk through a war zone. It cannot build a relationship with a subject over months. It cannot feel the moment that Cartier-Bresson called "decisive." The most compelling argument for human photography in the AI age is the same argument that has always defined documentary photography: a human being was there, saw this, and chose to bear witness. Presence — not pixels — may be photography\'s irreducible value.',
  },
];

// ── Photography's Impact ────────────────────────────────────────────────────

const IMPACT_INSIGHTS: InsightEntry[] = [
  {
    label: 'Memory: The Externalization of Recall',
    detail:
      'Photography externalized human memory. Before cameras, you remembered what your mind chose to retain — selective, fading, unreliable. After cameras, you remembered what you photographed — but studies show that photographing an experience can actually reduce your memory of it (the "photo-taking impairment effect"). The smartphone has accelerated this: we photograph everything and remember less. Photography promised to preserve memory; it may have partly replaced it. The relationship between seeing, photographing, and remembering is more complex than the Kodak slogan suggested.',
  },
  {
    label: 'War: The Camera as Witness',
    detail:
      'Photography has shaped every war since the Crimean War (1853–1856). Roger Fenton\'s carefully composed images of the Crimean War avoided showing casualties. Brady\'s Civil War photographs showed them. Vietnam War photography helped end the conflict. Embedded journalists in Iraq produced images both critical and propagandistic. Drone photography removed the photographer from the battlefield entirely. Each generation\'s war photography reflects its technology and its politics — but the fundamental question remains: does showing the horror of war help end it, or does it just numb us?',
  },
  {
    label: 'Social Justice: Making the Invisible Visible',
    detail:
      'Jacob Riis\'s "How the Other Half Lives" (1890) used flash photography to document New York tenement squalor — images that led to housing reform legislation. Lewis Hine photographed child laborers, leading to child labor laws. Gordon Parks used photography as a "weapon of choice" against racism and poverty. The civil rights movement was propelled by photographs: Emmett Till\'s open casket, fire hoses in Birmingham, the March on Washington. Photography\'s unique power in social justice is visceral: it makes abstract injustice concrete and personal.',
  },
  {
    label: 'Science: Seeing the Invisible',
    detail:
      'Photography extended human vision into realms invisible to the naked eye. X-ray photography (1895) revealed the body\'s interior. Microscopic photography revealed cellular structures. High-speed photography (Harold Edgerton\'s bullet-through-apple) froze microseconds. Satellite photography mapped the planet. Astrophotography revealed galaxies billions of light-years away. Thermal imaging, infrared, ultraviolet — photography in wavelengths beyond human perception. The camera became science\'s most versatile instrument: a tool for making the invisible visible and the incomprehensibly vast or small comprehensible.',
  },
];

// ── Key Terms ───────────────────────────────────────────────────────────────

const KEY_TERMS: InsightEntry[] = [
  {
    label: 'Aperture',
    detail:
      'The adjustable opening in a lens that controls how much light reaches the sensor or film. Measured in f-stops: a lower number (f/1.4) means a wider opening and shallower depth of field (blurred background). A higher number (f/16) means a smaller opening and greater depth of field (everything sharp). Aperture is the photographer\'s primary tool for controlling both exposure and visual emphasis.',
  },
  {
    label: 'Depth of Field',
    detail:
      'The range of distance in a photograph that appears acceptably sharp. A shallow depth of field (portrait mode) isolates the subject against a blurred background. A deep depth of field (landscape photography) keeps everything from foreground to infinity in focus. Depth of field is controlled by aperture, focal length, and distance to subject — the three variables every photographer learns to balance.',
  },
  {
    label: 'Exposure Triangle',
    detail:
      'The relationship between aperture (light volume), shutter speed (light duration), and ISO (sensor sensitivity). These three variables determine every photograph\'s brightness. Change one, and you must compensate with another. Fast shutter speed to freeze action? Open the aperture wider or increase ISO. The exposure triangle is the fundamental grammar of photographic technique — understood instinctively by experienced photographers, painfully learned by beginners.',
  },
  {
    label: 'Bokeh',
    detail:
      'The aesthetic quality of out-of-focus areas in a photograph, especially point light sources rendered as soft circles or shapes. Derived from the Japanese word for "blur." Good bokeh is smooth and creamy; harsh bokeh is distracting. Lens design determines bokeh character. The obsession with bokeh — driven by portrait photographers and enabled by fast lenses — has become so culturally significant that smartphone makers simulate it computationally.',
  },
  {
    label: 'The Rule of Thirds',
    detail:
      'Divide the frame into a 3×3 grid. Place key elements along the lines or at their intersections, not in the center. This creates dynamic, visually engaging compositions that feel natural to the human eye. The rule of thirds is photography\'s most basic compositional guideline — and the first thing experienced photographers learn to break when the subject demands it.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Dorothea Lange',
    years: '1895–1965',
    contribution:
      '"Migrant Mother" (1936) — the most reproduced photograph of the 20th century. Lange\'s FSA work defined documentary photography as a tool for social change. Her Japanese internment camp photographs were so politically damaging that the U.S. Army impounded them for decades.',
  },
  {
    name: 'Henri Cartier-Bresson',
    years: '1908–2004',
    contribution:
      'Co-founder of Magnum Photos. Defined "the decisive moment" as photography\'s essence — the split second when composition, emotion, and meaning align perfectly. His influence on street photography and photojournalism is immeasurable. Never cropped an image.',
  },
  {
    name: 'Ansel Adams',
    years: '1902–1984',
    contribution:
      'Master of landscape photography and inventor of the Zone System for tonal control. His Yosemite and Sierra Nevada photographs are among the most recognized images in American art. Environmental activist whose photographs helped establish national parks and wilderness areas.',
  },
  {
    name: 'Robert Capa',
    years: '1913–1954',
    contribution:
      'The greatest war photographer. Covered five wars, landed with the first wave at Omaha Beach on D-Day. Co-founded Magnum Photos. Killed by a landmine in Indochina at age 40. "If your pictures aren\'t good enough, you\'re not close enough."',
  },
  {
    name: 'Gordon Parks',
    years: '1912–2006',
    contribution:
      'First Black photographer at LIFE magazine. Used photography as a "weapon against poverty, racism, and all manner of social wrongs." Also a novelist, filmmaker ("Shaft"), poet, and composer. Proved that a camera in the right hands could be an instrument of justice.',
  },
  {
    name: 'Sebastião Salgado',
    years: 'b. 1944',
    contribution:
      'Brazilian photographer whose monumental projects — "Workers," "Migrations," "Genesis" — document labor, displacement, and the natural world on an epic scale. His black-and-white images combine the grandeur of landscape photography with the urgency of social documentary.',
  },
];

const FIGURE_COLORS = [SEPIA, GOLD, CRIMSON, TEAL, INDIGO, ROSE, AMBER, GREEN, PURPLE, SKY];

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
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>
          {icon} {title}
        </h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
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
          key={e.year + e.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 18 }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: e.color, marginRight: 8 }} />
          <p style={{ display: 'inline', color: e.color, fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {e.year}
          </p>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginTop: 4, marginBottom: 6 }}>
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
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
          <h4 style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 8, fontSize: '1rem' }}>
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

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
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
          <h4 style={{ fontWeight: 600, color: FIGURE_COLORS[i % FIGURE_COLORS.length], marginBottom: 2, fontSize: '1.05rem' }}>
            {f.name}
          </h4>
          <p style={{ fontSize: '0.8rem', color: SLATE, marginBottom: 8 }}>
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

export default function HistoryOfPhotographyPage() {
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070e22',
      color: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </div>

        {/* Hero section */}
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
              background: `linear-gradient(135deg, ${SEPIA}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Light Writes — The History of Photography (1826–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              In 1826, a French inventor pointed a camera obscura out his workshop window and let sunlight slowly etch an image onto a metal plate. Eight hours later, he had the oldest surviving photograph — a blurry view of rooftops that would change civilization. Within two centuries, photography would document every war, transform every art form, reshape human memory, land on the Moon, and ultimately face an existential crisis when artificial intelligence learned to generate images indistinguishable from reality.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              The word "photography" comes from the Greek words for "light" and "writing." Light writes. From the camera obscura to the smartphone to the AI prompt, this is the story of humanity's 200-year quest to capture light — and what happened when we succeeded beyond all imagining.
            </p>
          </motion.div>
        </header>

        {/* Niépce callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(200, 169, 110, 0.08)',
            border: `1px solid ${SEPIA}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: SEPIA, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            Photography's Paradox: Truth and Manipulation
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Photography was born with a promise: the camera doesn't lie. For nearly two centuries, a photograph was accepted as evidence — in courtrooms, in newspapers, in history books. That covenant is now broken. From darkroom manipulation to Photoshop to AI-generated images, photography's relationship with truth has been contested from the very beginning. Understanding the history of photography is understanding the history of how we decided what to believe.
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ marginBottom: 8 }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 12,
          }}>
            {KEY_STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <span style={{ color: GOLD, fontWeight: 700, fontSize: '1.1rem' }}>
                  {stat.label}
                </span>
                <p style={{ color: ASH, fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 1: Camera Obscura */}
        <SectionWrapper
          id="camera-obscura"
          icon="🔭"
          title="Camera Obscura: Light Before Photography (1000–1826)"
          accentColor={AMBER}
          intro="For a thousand years before the first photograph, people knew that light passing through a small opening could project an image. The camera obscura — 'dark room' in Latin — was a tool for artists, a toy for scientists, and a metaphor for vision itself. All it lacked was a way to make the image permanent."
        >
          <TimelineCard entries={CAMERA_OBSCURA_TIMELINE} />
        </SectionWrapper>

        {/* Section 2: First Photographs */}
        <SectionWrapper
          id="first-photographs"
          icon="🖼️"
          title="The First Photographs (1826–1851)"
          accentColor={SEPIA}
          intro="Three inventors working independently — Niépce, Daguerre, and Talbot — each found a different way to fix light onto a surface. Their competing processes launched photography and established its fundamental tension: the unique original versus the reproducible copy, art versus document, the precious object versus the mass medium."
        >
          <TimelineCard entries={FIRST_PHOTOS_TIMELINE} />
        </SectionWrapper>

        {/* Section 3: Civil War & Documentary */}
        <SectionWrapper
          id="civil-war"
          icon="⚔️"
          title="Photography Goes to War (1860s–1880s)"
          accentColor={SILVER}
          intro="The American Civil War was the first conflict comprehensively documented by photographers. For the first time, civilians could see what war actually looked like — not heroic paintings, but swollen bodies in muddy fields. Photography's power to strip away illusion and confront viewers with unmediated reality was established on these battlefields."
        >
          <InsightGrid items={CIVIL_WAR_INSIGHTS} />
        </SectionWrapper>

        {/* Section 4: Kodak & Democratization */}
        <SectionWrapper
          id="kodak"
          icon="📷"
          title="Democratization: Roll Film and the Kodak Revolution (1871–1925)"
          accentColor={GOLD}
          intro="Photography was born as a craft for specialists: toxic chemicals, fragile glass plates, portable darkrooms. Within 50 years, George Eastman turned it into a consumer product. 'You press the button, we do the rest' wasn't just a slogan — it was a social revolution that put the power to record reality into the hands of millions."
        >
          <TimelineCard entries={KODAK_TIMELINE} />
        </SectionWrapper>

        {/* Section 5: Color & Art Photography */}
        <SectionWrapper
          id="color"
          icon="🎨"
          title="Color, Art, and the Question of Beauty (1907–1960s)"
          accentColor={PURPLE}
          intro="For photography's first 80 years, the world was rendered in shades of gray. The arrival of practical color photography — first in dreamy autochromes, then in Kodachrome's vivid saturation — coincided with a fierce debate about whether photography was art at all. That debate produced some of the most beautiful images in the medium's history."
        >
          <InsightGrid items={COLOR_INSIGHTS} />
        </SectionWrapper>

        {/* Section 6: Photojournalism Golden Age */}
        <SectionWrapper
          id="photojournalism"
          icon="📰"
          title="The Golden Age of Photojournalism (1935–1975)"
          accentColor={CRIMSON}
          intro="From the Great Depression through the Vietnam War, photojournalists produced images that shaped public opinion, influenced policy, and defined how entire generations understood their world. A single photograph could end a career, launch a movement, or help stop a war. This was photography at its most powerful — and its most morally complex."
        >
          <TimelineCard entries={PHOTOJOURNALISM_TIMELINE} />
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              War Photography and Ethics
            </h3>
            <InsightGrid items={WAR_PHOTOGRAPHY_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* Section 7: Decisive Moment */}
        <SectionWrapper
          id="decisive-moment"
          icon="⏱️"
          title="The Decisive Moment and Street Photography (1940s–1980s)"
          accentColor={TEAL}
          intro="Henri Cartier-Bresson's concept of 'the decisive moment' — the split second when form and meaning perfectly align — became photography's most influential artistic philosophy. Street photographers took their cameras into the chaos of everyday life and proved that the ordinary, seen at exactly the right moment, could be extraordinary."
        >
          <InsightGrid items={DECISIVE_MOMENT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: Space Photography */}
        <SectionWrapper
          id="space"
          icon="🌍"
          title="Space Photography: The Overview Effect (1946–Present)"
          accentColor={BLUE}
          intro="When cameras left Earth, they didn't just document space — they changed how humanity saw itself. 'Earthrise,' 'Pale Blue Dot,' the Hubble Deep Field — these images reframed human existence on a cosmic scale. Space photography is perhaps the medium's most profound achievement: using light captured millions of light-years away to expand the boundaries of human understanding."
        >
          <TimelineCard entries={SPACE_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: Polaroid */}
        <SectionWrapper
          id="polaroid"
          icon="🔲"
          title="Polaroid and Instant Photography (1948–Present)"
          accentColor={WARM}
          intro="Edwin Land's instant camera collapsed the gap between taking a photograph and seeing it — decades before digital screens. The Polaroid wasn't just a camera; it was a social technology. Watching an image slowly materialize on a white-bordered print became one of the 20th century's most magical shared experiences. Its unlikely survival into the digital age proves that physicality still matters."
        >
          <InsightGrid items={POLAROID_INSIGHTS} />
        </SectionWrapper>

        {/* Section 10: Digital Revolution */}
        <SectionWrapper
          id="digital"
          icon="💻"
          title="The Digital Revolution (1969–2010)"
          accentColor={INDIGO}
          intro="A Kodak engineer built the first digital camera in 1975. His employer buried the invention, fearing it would destroy their film business. They were right — it did. The digital revolution didn't just change cameras; it changed what a photograph was. When images became data, they became infinitely reproducible, instantly shareable, and endlessly editable. The consequences are still unfolding."
        >
          <TimelineCard entries={DIGITAL_TIMELINE} />
        </SectionWrapper>

        {/* Section 11: Smartphone Era */}
        <SectionWrapper
          id="smartphone"
          icon="📱"
          title="The Smartphone Era: Everyone a Photographer (2007–Present)"
          accentColor={GREEN}
          intro="The iPhone didn't have the best camera. It had the most present camera. When a capable camera became something 5 billion people carried everywhere, photography stopped being a hobby or a profession and became a reflex — as automatic as breathing, as constant as conversation. The smartphone didn't just democratize photography; it dissolved the boundary between seeing and photographing."
        >
          <InsightGrid items={SMARTPHONE_INSIGHTS} />
        </SectionWrapper>

        {/* Section 12: AI & Authenticity */}
        <SectionWrapper
          id="ai"
          icon="🤖"
          title="AI and the Crisis of Authenticity (2021–Present)"
          accentColor={ROSE}
          intro="For 185 years, a photograph meant that light bounced off something real and hit a sensor or film. AI-generated images break that contract entirely. A 'photograph' can now depict a person who never existed, an event that never happened. This isn't a technical footnote — it's an epistemological crisis. If any image can be fabricated, what does it mean to 'see it with your own eyes'?"
        >
          <InsightGrid items={AI_INSIGHTS} />
        </SectionWrapper>

        {/* Section 13: Photography's Impact */}
        <SectionWrapper
          id="impact"
          icon="🌐"
          title="Photography's Impact on Civilization"
          accentColor={GOLD}
          intro="Photography didn't just document history — it shaped it. It transformed memory, redefined war, powered social justice movements, and extended scientific vision from the subatomic to the intergalactic. No other invention in human history has so fundamentally altered how we see, remember, and understand the world."
        >
          <InsightGrid items={IMPACT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 14: Key Figures */}
        <SectionWrapper
          id="figures"
          icon="👁️"
          title="Masters of the Medium"
          accentColor={SEPIA}
          intro="Photography's history is shaped by individuals who saw what others missed — and had the skill, courage, or obsession to capture it. These photographers didn't just take pictures; they expanded the boundaries of what photography could show, mean, and do."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* Section 15: Key Terms */}
        <SectionWrapper
          id="terms"
          icon="🔍"
          title="The Language of Photography"
          accentColor={SKY}
          intro="Photography developed its own technical vocabulary — a language of light, optics, and composition that every photographer learns. Understanding these terms doesn't just improve technique; it reveals how photographers think about light and space."
        >
          <InsightGrid items={KEY_TERMS} />
        </SectionWrapper>

        {/* Connection links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          style={{
            padding: '32px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
            Connected Deep Dives
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/history-of-film', label: 'History of Cinema' },
              { to: '/space-exploration', label: 'Space Exploration' },
              { to: '/digital-revolution', label: 'Digital Revolution' },
              { to: '/civil-war', label: 'American Civil War' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: SKY,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${SKY}33`,
                  backgroundColor: `${SKY}0a`,
                  transition: 'background-color 0.2s',
                }}
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            "The camera is an instrument that teaches people how to see without a camera."
            — Dorothea Lange
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
