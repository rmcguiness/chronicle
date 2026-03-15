/**
 * ArchitecturePage — Monuments to Ambition: The Greatest Structures Humanity Ever Built.
 *
 * Route: /architecture
 *
 * Sections:
 *  1. Hero — title + subtitle
 *  2. Filter tabs (style/era/continent)
 *  3. Vertical timeline of 30+ iconic structures
 *  4. Tallest Structures Through History — race chart
 *  5. Seven Wonders — ancient + new
 *  6. "Still Standing?" badge per structure
 */

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type StyleBadge = 'Ancient' | 'Gothic' | 'Renaissance' | 'Baroque' | 'Modernist' | 'Contemporary';

type Continent = 'Europe' | 'Africa' | 'Asia' | 'Americas' | 'Oceania';

type Era = 'Ancient (pre-500 CE)' | 'Medieval (500–1400)' | 'Renaissance/Baroque (1400–1750)' | 'Modern (1750–1960)' | 'Contemporary (1960–)';

interface Structure {
  id: number;
  name: string;
  year: string;
  yearSort: number;
  location: string;
  architect: string;
  style: StyleBadge;
  era: Era;
  continent: Continent;
  heightOrSize: string;
  whyItMatters: string;
  constructionFeat: string;
  influence: string;
  stillStanding: boolean;
  searchQuery: string;
  ancientWonder?: boolean;
  newWonder?: boolean;
}

interface TallestEntry {
  year: number;
  name: string;
  height: number;
  unit: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_COLORS: Record<StyleBadge, string> = {
  Ancient: '#f59e0b',
  Gothic: '#a78bfa',
  Renaissance: '#22c55e',
  Baroque: '#ec4899',
  Modernist: '#3b82f6',
  Contemporary: '#06b6d4',
};

const ALL_STYLES: StyleBadge[] = ['Ancient', 'Gothic', 'Renaissance', 'Baroque', 'Modernist', 'Contemporary'];
const ALL_ERAS: Era[] = [
  'Ancient (pre-500 CE)',
  'Medieval (500–1400)',
  'Renaissance/Baroque (1400–1750)',
  'Modern (1750–1960)',
  'Contemporary (1960–)',
];
const ALL_CONTINENTS: Continent[] = ['Europe', 'Africa', 'Asia', 'Americas', 'Oceania'];

const STRUCTURES: Structure[] = [
  {
    id: 1,
    name: 'Stonehenge',
    year: '~3000 BCE',
    yearSort: -3000,
    location: 'Wiltshire, England \u{1F1EC}\u{1F1E7}',
    architect: 'Neolithic peoples',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Europe',
    heightOrSize: '~4.1 m tall (sarsen stones); 33 m diameter circle',
    whyItMatters: 'The most iconic prehistoric monument in the world, Stonehenge demonstrates that Neolithic peoples possessed sophisticated astronomical and engineering knowledge. Its alignment with solstices reveals a culture deeply attuned to celestial cycles thousands of years before written history.',
    constructionFeat: 'Bluestones weighing up to 4 tonnes were transported ~240 km from Wales — how they moved them remains debated, from sledges to glacial transport theories.',
    influence: 'Inspired millennia of megalithic speculation and became the archetype for ancient sacred sites worldwide.',
    stillStanding: true,
    searchQuery: 'Stonehenge Neolithic monument',
  },
  {
    id: 2,
    name: 'Great Pyramid of Giza',
    year: '~2560 BCE',
    yearSort: -2560,
    location: 'Giza, Egypt \u{1F1EA}\u{1F1EC}',
    architect: 'Hemiunu (for Pharaoh Khufu)',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Africa',
    heightOrSize: '146.6 m (originally); 138.5 m today — tallest structure on Earth for 3,800 years',
    whyItMatters: 'The sole survivor of the Seven Wonders of the Ancient World, the Great Pyramid is the pinnacle of Old Kingdom Egyptian engineering. It represented the pharaoh\'s passage to the afterlife and remains the most massive stone structure ever built.',
    constructionFeat: 'An estimated 2.3 million limestone blocks averaging 2.5 tonnes each, quarried, transported, and placed with sub-centimetre precision — all without iron tools or the wheel.',
    influence: 'Set the template for monumental tomb architecture and continues to inspire awe and engineering study 4,500 years later.',
    stillStanding: true,
    searchQuery: 'Great Pyramid Giza Khufu',
    ancientWonder: true,
  },
  {
    id: 3,
    name: 'Parthenon',
    year: '447–432 BCE',
    yearSort: -447,
    location: 'Athens, Greece \u{1F1EC}\u{1F1F7}',
    architect: 'Ictinus & Callicrates; sculptures by Phidias',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Europe',
    heightOrSize: '13.7 m tall; 69.5 m \u00D7 30.9 m footprint',
    whyItMatters: 'The supreme expression of Classical Greek architecture, the Parthenon embodies the mathematical precision and aesthetic ideals that became Western architecture\'s foundation. Dedicated to Athena, it symbolized Athenian democracy at its peak.',
    constructionFeat: 'Its columns are subtly curved (entasis) to counteract optical illusions, making straight lines appear straight — a level of optical refinement not matched for centuries.',
    influence: 'Every neoclassical building on Earth — from the US Capitol to the British Museum — descends from the Parthenon\'s column-and-pediment vocabulary.',
    stillStanding: true,
    searchQuery: 'Parthenon Athens Acropolis',
  },
  {
    id: 4,
    name: 'Great Wall of China',
    year: '7th c. BCE – 1644 CE',
    yearSort: -700,
    location: 'Northern China \u{1F1E8}\u{1F1F3}',
    architect: 'Multiple dynasties (Qin, Han, Ming)',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Asia',
    heightOrSize: '~21,196 km total (all sections); 6–8 m tall, up to 5 m wide',
    whyItMatters: 'The longest structure ever built, the Great Wall is less a single wall than a vast network of fortifications spanning two millennia of Chinese history. It reflects the enduring tension between settled agricultural civilization and nomadic steppe peoples.',
    constructionFeat: 'Built across deserts, mountains, and plains using rammed earth, brick, and stone, with an estimated workforce of millions — many of whom perished during construction.',
    influence: 'Became the universal symbol of monumental defensive engineering and the ultimate expression of imperial will imposed on landscape.',
    stillStanding: true,
    searchQuery: 'Great Wall China history',
    newWonder: true,
  },
  {
    id: 5,
    name: 'Colosseum',
    year: '72–80 CE',
    yearSort: 80,
    location: 'Rome, Italy \u{1F1EE}\u{1F1F9}',
    architect: 'Vespasian & Titus (Flavian dynasty)',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Europe',
    heightOrSize: '48 m tall; 189 m \u00D7 156 m; seated ~50,000 spectators',
    whyItMatters: 'The largest amphitheatre ever built, the Colosseum was imperial Rome\'s greatest public building — a marvel of crowd management, engineering, and political spectacle. It could be flooded for mock naval battles and had a retractable canvas awning (velarium).',
    constructionFeat: 'Its 80 arched entrances could fill or empty 50,000 spectators in minutes — a crowd-flow system not improved upon until modern stadium design.',
    influence: 'Every modern sports stadium descends from the Colosseum\'s tiered seating, numbered entrances, and elliptical plan.',
    stillStanding: true,
    searchQuery: 'Colosseum Rome Flavian Amphitheatre',
    newWonder: true,
  },
  {
    id: 6,
    name: 'Pantheon',
    year: '125 CE',
    yearSort: 125,
    location: 'Rome, Italy \u{1F1EE}\u{1F1F9}',
    architect: 'Apollodorus of Damascus (probable); commissioned by Hadrian',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Europe',
    heightOrSize: '43.3 m diameter dome = 43.3 m interior height (perfect hemisphere)',
    whyItMatters: 'The Pantheon\'s unreinforced concrete dome remained the largest in the world for over 1,300 years. Its oculus — the 8.7 m open hole at the apex — is the sole source of light, creating a spiritual connection between interior and sky.',
    constructionFeat: 'Roman concrete (opus caementicium) with volcanic pumice aggregate made the dome progressively lighter toward the top — a material insight not rediscovered until the 20th century.',
    influence: 'Directly inspired Brunelleschi\'s Florence dome, St. Peter\'s Basilica, the US Capitol rotunda, and Jefferson\'s UVA library.',
    stillStanding: true,
    searchQuery: 'Pantheon Rome dome Hadrian',
  },
  {
    id: 7,
    name: 'Hagia Sophia',
    year: '532–537 CE',
    yearSort: 537,
    location: 'Istanbul, Turkey \u{1F1F9}\u{1F1F7}',
    architect: 'Anthemius of Tralles & Isidore of Miletus',
    style: 'Ancient',
    era: 'Medieval (500–1400)',
    continent: 'Europe',
    heightOrSize: '55.6 m tall; 31.24 m dome diameter',
    whyItMatters: 'For nearly a thousand years the world\'s largest cathedral, Hagia Sophia fused Roman engineering with Byzantine aesthetics to create an interior of overwhelming spatial grandeur. It served as a church, mosque, museum, and mosque again — mirroring Istanbul\'s layered history.',
    constructionFeat: 'Its "floating" dome rests on pendentives — a revolutionary structural solution that transitions from a square base to a circular dome, solved here for the first time at monumental scale.',
    influence: 'The pendentive dome became the standard for Islamic mosque architecture (Blue Mosque, Süleymaniye) and inspired Renaissance church design.',
    stillStanding: true,
    searchQuery: 'Hagia Sophia Byzantine Constantinople',
  },
  {
    id: 8,
    name: 'Angkor Wat',
    year: '1113–1150 CE',
    yearSort: 1113,
    location: 'Siem Reap, Cambodia \u{1F1F0}\u{1F1ED}',
    architect: 'King Suryavarman II / Khmer architects',
    style: 'Ancient',
    era: 'Medieval (500–1400)',
    continent: 'Asia',
    heightOrSize: '65 m central tower; 162.6 ha complex — largest religious monument on Earth',
    whyItMatters: 'The largest religious structure ever built, Angkor Wat is the masterpiece of Khmer civilization and a symbolic representation of Mount Meru, the cosmic mountain of Hindu cosmology. Its bas-reliefs stretch nearly 600 metres and depict entire mythological epics.',
    constructionFeat: 'An estimated 5–10 million sandstone blocks were quarried, floated via canals, and assembled without mortar — held together by precise shaping and gravity alone.',
    influence: 'Became the symbol of Cambodia (it appears on the national flag) and the supreme example of Hindu-Buddhist temple architecture.',
    stillStanding: true,
    searchQuery: 'Angkor Wat Khmer temple Cambodia',
    newWonder: true,
  },
  {
    id: 9,
    name: 'Notre-Dame de Paris',
    year: '1163–1345',
    yearSort: 1163,
    location: 'Paris, France \u{1F1EB}\u{1F1F7}',
    architect: 'Bishop Maurice de Sully; multiple master builders',
    style: 'Gothic',
    era: 'Medieval (500–1400)',
    continent: 'Europe',
    heightOrSize: '69 m (towers); 128 m long; 12,000 m\u00B2 interior',
    whyItMatters: 'The defining example of French Gothic architecture, Notre-Dame pioneered the flying buttress system that allowed walls to become vast stained-glass windows. The 2019 fire and ongoing restoration have made it a global symbol of cultural heritage preservation.',
    constructionFeat: 'Its flying buttresses — arched external supports — were an engineering innovation that transferred the weight of the vaulted ceiling outward, freeing walls for enormous windows.',
    influence: 'Established the template for High Gothic cathedrals across Europe and inspired Victor Hugo\'s novel, which saved the building from demolition.',
    stillStanding: true,
    searchQuery: 'Notre-Dame Paris Gothic cathedral',
  },
  {
    id: 10,
    name: 'Chartres Cathedral',
    year: '1194–1220',
    yearSort: 1194,
    location: 'Chartres, France \u{1F1EB}\u{1F1F7}',
    architect: 'Unknown master builder',
    style: 'Gothic',
    era: 'Medieval (500–1400)',
    continent: 'Europe',
    heightOrSize: '113 m (south spire); 130 m long',
    whyItMatters: 'Chartres preserves the most complete set of medieval stained glass in the world — 176 windows covering 2,600 m\u00B2, most original from the 13th century. It represents High Gothic architecture at its purest, rebuilt in a single generation after a devastating 1194 fire.',
    constructionFeat: 'The "Chartres blue" glass was created with cobalt oxide — a recipe whose exact formulation has never been fully replicated.',
    influence: 'Its pointed-arch, ribbed-vault, flying-buttress system became the canonical Gothic structural kit, copied from Spain to Scandinavia.',
    stillStanding: true,
    searchQuery: 'Chartres Cathedral Gothic stained glass',
  },
  {
    id: 11,
    name: 'Alhambra',
    year: '1238–1358',
    yearSort: 1238,
    location: 'Granada, Spain \u{1F1EA}\u{1F1F8}',
    architect: 'Nasrid dynasty architects',
    style: 'Ancient',
    era: 'Medieval (500–1400)',
    continent: 'Europe',
    heightOrSize: '142,000 m\u00B2 complex; 740 m long, 220 m wide',
    whyItMatters: 'The Alhambra is the finest surviving example of Islamic palatial architecture in Europe, where water, light, and geometric ornament create spaces of extraordinary sensory richness. It represents the final flowering of Moorish civilization in Iberia.',
    constructionFeat: 'Its muqarnas (honeycomb vaulting) ceilings in the Hall of the Abencerrajes contain over 5,000 individual cells carved from plaster — a three-dimensional geometric tour de force.',
    influence: 'Inspired the 19th-century Moorish Revival movement and demonstrated that architecture could be art of atmosphere — light, water, fragrance — not just mass and structure.',
    stillStanding: true,
    searchQuery: 'Alhambra Granada Nasrid palace',
  },
  {
    id: 12,
    name: 'Cologne Cathedral',
    year: '1248–1880',
    yearSort: 1248,
    location: 'Cologne, Germany \u{1F1E9}\u{1F1EA}',
    architect: 'Master Gerhard; completed by Ernst Friedrich Zwirner',
    style: 'Gothic',
    era: 'Medieval (500–1400)',
    continent: 'Europe',
    heightOrSize: '157 m tall (twin spires) — tallest twin-spired church in the world',
    whyItMatters: 'Taking 632 years to complete, Cologne Cathedral is a testament to Gothic ambition outlasting empires. When finished in 1880 it was briefly the tallest structure on Earth. Miraculously, it survived 14 aerial bombs during WWII while the city around it was flattened.',
    constructionFeat: 'Medieval builders left detailed plans that allowed 19th-century architects to complete the structure in faithful Gothic style, bridging a 300-year construction hiatus.',
    influence: 'Proved that Gothic architecture could be completed at unprecedented scale and helped spark the Gothic Revival movement across Europe.',
    stillStanding: true,
    searchQuery: 'Cologne Cathedral Gothic Germany',
  },
  {
    id: 13,
    name: 'Forbidden City',
    year: '1406–1420',
    yearSort: 1420,
    location: 'Beijing, China \u{1F1E8}\u{1F1F3}',
    architect: 'Kuai Xiang (lead architect)',
    style: 'Renaissance',
    era: 'Renaissance/Baroque (1400–1750)',
    continent: 'Asia',
    heightOrSize: '720,000 m\u00B2 complex; 980 buildings, 8,886 rooms',
    whyItMatters: 'The world\'s largest palatial complex served as the seat of Chinese imperial power for nearly 500 years across two dynasties (Ming and Qing). Its rigid symmetry embodies the Confucian cosmic order — the emperor at the centre of the universe.',
    constructionFeat: 'Over one million workers built it using nanmu wood transported from Sichuan\'s forests 1,800 km away, and bricks fired from a special clay that rang like a bell when struck.',
    influence: 'Set the standard for East Asian palatial architecture and urban planning, with its axial symmetry influencing city layouts from Seoul to Kyoto.',
    stillStanding: true,
    searchQuery: 'Forbidden City Beijing Ming dynasty',
  },
  {
    id: 14,
    name: 'Machu Picchu',
    year: '~1450',
    yearSort: 1450,
    location: 'Cusco Region, Peru \u{1F1F5}\u{1F1EA}',
    architect: 'Inca emperor Pachacuti\'s architects',
    style: 'Ancient',
    era: 'Renaissance/Baroque (1400–1750)',
    continent: 'Americas',
    heightOrSize: '2,430 m above sea level; ~5 km\u00B2 complex on a mountain ridge',
    whyItMatters: 'Built as a royal estate at a dizzying altitude, Machu Picchu is the masterwork of Inca stone construction. Abandoned during the Spanish conquest and unknown to the outside world until 1911, it became the symbol of pre-Columbian American civilization.',
    constructionFeat: 'Its dry-stone walls use ashlar masonry so precise that a knife blade cannot fit between stones — achieved without iron tools, wheels, or written engineering plans.',
    influence: 'Demonstrated that advanced civilisation flourished in the Americas independent of Old World traditions, reshaping global understanding of human achievement.',
    stillStanding: true,
    searchQuery: 'Machu Picchu Inca Peru',
    newWonder: true,
  },
  {
    id: 15,
    name: 'St. Peter\'s Basilica',
    year: '1506–1626',
    yearSort: 1506,
    location: 'Vatican City \u{1F1FB}\u{1F1E6}',
    architect: 'Bramante, Michelangelo, Maderno, Bernini',
    style: 'Renaissance',
    era: 'Renaissance/Baroque (1400–1750)',
    continent: 'Europe',
    heightOrSize: '136.6 m tall (dome apex); 23,000 m\u00B2 interior — largest church in the world',
    whyItMatters: 'The largest and most important church in Christendom, St. Peter\'s took 120 years and multiple architects to complete. Michelangelo\'s dome — visible across Rome — became the defining image of Renaissance ambition and the symbol of papal authority.',
    constructionFeat: 'Michelangelo designed the dome\'s double-shell structure at age 71, using iron chains as tension rings inside the masonry — an engineering innovation that kept the massive dome from spreading.',
    influence: 'Its dome directly inspired the US Capitol, St. Paul\'s Cathedral (London), and virtually every domed government building in the Western world.',
    stillStanding: true,
    searchQuery: 'St Peters Basilica Vatican Michelangelo dome',
  },
  {
    id: 16,
    name: 'Taj Mahal',
    year: '1632–1648',
    yearSort: 1648,
    location: 'Agra, India \u{1F1EE}\u{1F1F3}',
    architect: 'Ustad Ahmad Lahauri (attributed)',
    style: 'Baroque',
    era: 'Renaissance/Baroque (1400–1750)',
    continent: 'Asia',
    heightOrSize: '73 m tall (main dome); 17 ha complex',
    whyItMatters: 'Built by Mughal emperor Shah Jahan as a mausoleum for his beloved wife Mumtaz Mahal, the Taj Mahal is considered the supreme expression of Mughal architecture. Its white Makrana marble changes colour with the light — pink at dawn, white at noon, golden at sunset.',
    constructionFeat: 'Over 20,000 artisans from across Asia worked for 16 years, inlaying 28 types of precious and semi-precious stones (pietra dura) into the marble with sub-millimetre precision.',
    influence: 'Became the universal symbol of architectural beauty and love, and the most visited monument in India — drawing 7–8 million visitors annually.',
    stillStanding: true,
    searchQuery: 'Taj Mahal Agra Shah Jahan Mughal',
    newWonder: true,
  },
  {
    id: 17,
    name: 'Palace of Versailles',
    year: '1661–1710',
    yearSort: 1661,
    location: 'Versailles, France \u{1F1EB}\u{1F1F7}',
    architect: 'Louis Le Vau, Jules Hardouin-Mansart, Andr\u00E9 Le N\u00F4tre (gardens)',
    style: 'Baroque',
    era: 'Renaissance/Baroque (1400–1750)',
    continent: 'Europe',
    heightOrSize: '63,154 m\u00B2 floor area; 800 ha estate; 2,300 rooms; Hall of Mirrors: 73 m long',
    whyItMatters: 'Louis XIV transformed a hunting lodge into the most extravagant palace in European history, using architecture as a tool of absolute power. By moving the court to Versailles, he turned the nobility into decorative courtiers, neutralizing rival power bases.',
    constructionFeat: 'The Hall of Mirrors required 357 hand-blown mirrors — a technology Venice monopolised — prompting Louis to lure Venetian glassmakers to France in an act of industrial espionage.',
    influence: 'Every European palace from Sch\u00F6nbrunn to the Winter Palace copied Versailles, and its gardens defined formal landscape design for centuries.',
    stillStanding: true,
    searchQuery: 'Palace Versailles Louis XIV Baroque',
  },
  {
    id: 18,
    name: 'Crystal Palace',
    year: '1851',
    yearSort: 1851,
    location: 'London, England \u{1F1EC}\u{1F1E7}',
    architect: 'Joseph Paxton',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Europe',
    heightOrSize: '563 m long, 138 m wide; 92,000 m\u00B2 exhibition space',
    whyItMatters: 'The Crystal Palace was the world\'s first large-scale prefabricated structure, built entirely of cast iron and plate glass for the Great Exhibition of 1851. It proved that industrial materials could create architecture of breathtaking beauty and spatial drama.',
    constructionFeat: 'Assembled from standardised, factory-made components in just 9 months, it was the first "flat-pack" building — and could be (and was) disassembled and relocated.',
    influence: 'Launched the modern tradition of glass-and-steel architecture — every airport terminal, convention centre, and glass skyscraper traces its lineage here.',
    stillStanding: false,
    searchQuery: 'Crystal Palace Great Exhibition 1851 Paxton',
  },
  {
    id: 19,
    name: 'Eiffel Tower',
    year: '1887–1889',
    yearSort: 1889,
    location: 'Paris, France \u{1F1EB}\u{1F1F7}',
    architect: 'Gustave Eiffel (engineer Maurice Koechlin)',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Europe',
    heightOrSize: '330 m tall (with antenna); 7,300 tonnes of wrought iron; 18,038 pieces joined by 2.5 million rivets',
    whyItMatters: 'Built as a "temporary" entrance arch for the 1889 World\'s Fair, the Eiffel Tower was despised by Parisian intellectuals but beloved by the public. It became the world\'s tallest structure and the most recognisable symbol of modernity and engineering prowess.',
    constructionFeat: 'Every one of its 18,038 iron pieces was calculated to 0.1 mm precision — 5,329 engineering drawings ensured the 300 m tower deviated only 6 cm from vertical.',
    influence: 'Proved that structural iron could be monumental art, paving the way for steel-frame skyscrapers and making the engineer-as-architect a legitimate figure.',
    stillStanding: true,
    searchQuery: 'Eiffel Tower Paris 1889 World Fair',
  },
  {
    id: 20,
    name: 'Sagrada Fam\u00EDlia',
    year: '1882 – ongoing',
    yearSort: 1882,
    location: 'Barcelona, Spain \u{1F1EA}\u{1F1F8}',
    architect: 'Antoni Gaud\u00ED',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Europe',
    heightOrSize: '172.5 m (tallest tower, when complete); 4,500 m\u00B2 interior',
    whyItMatters: 'Gaud\u00ED\'s magnum opus fuses Gothic structure with organic Art Nouveau forms inspired by nature — columns branch like trees, facades drip like melting candle wax. Still under construction after 140+ years, it is the world\'s longest-running architectural project.',
    constructionFeat: 'Gaud\u00ED designed its complex hyperbolic paraboloid vaults using hanging chain models — a form-finding technique that anticipated modern computational design by a century.',
    influence: 'Proved that architecture could be radically personal and biomorphic, influencing organic modernists from Calatrava to Zaha Hadid.',
    stillStanding: true,
    searchQuery: 'Sagrada Familia Gaudi Barcelona',
  },
  {
    id: 21,
    name: 'Flatiron Building',
    year: '1901–1902',
    yearSort: 1902,
    location: 'New York City, USA \u{1F1FA}\u{1F1F8}',
    architect: 'Daniel Burnham',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Americas',
    heightOrSize: '87 m tall; 22 floors; 6.5 m wide at its narrow point',
    whyItMatters: 'One of New York\'s first skyscrapers, the Flatiron\'s wedge shape at the intersection of Broadway and Fifth Avenue became an instant icon. Critics predicted it would blow over; instead it became one of the most photographed buildings in the world.',
    constructionFeat: 'Its steel skeleton — one of the first full steel frames in a skyscraper — allowed the impossibly thin triangular plan that masonry construction could never achieve.',
    influence: 'Demonstrated that the steel frame freed architects from the tyranny of the right angle and the load-bearing wall, enabling new formal possibilities.',
    stillStanding: true,
    searchQuery: 'Flatiron Building New York Burnham',
  },
  {
    id: 22,
    name: 'Chrysler Building',
    year: '1928–1930',
    yearSort: 1930,
    location: 'New York City, USA \u{1F1FA}\u{1F1F8}',
    architect: 'William Van Alen',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Americas',
    heightOrSize: '319 m tall; 77 floors',
    whyItMatters: 'The finest Art Deco skyscraper ever built, the Chrysler Building was briefly the world\'s tallest structure. Its stainless-steel crown, eagle gargoyles, and lobby murals celebrate the machine age with an exuberance that has never been matched.',
    constructionFeat: 'Its crown was secretly assembled inside the building and hoisted through the roof in 90 minutes to beat a rival architect in the race for "tallest building" — the greatest architectural surprise in history.',
    influence: 'Made Art Deco the defining American architectural style of the interwar period and proved skyscrapers could be works of art, not just commercial boxes.',
    stillStanding: true,
    searchQuery: 'Chrysler Building Art Deco New York',
  },
  {
    id: 23,
    name: 'Empire State Building',
    year: '1930–1931',
    yearSort: 1931,
    location: 'New York City, USA \u{1F1FA}\u{1F1F8}',
    architect: 'Shreve, Lamb & Harmon',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Americas',
    heightOrSize: '443 m (roof); 102 floors; held "tallest building" title for 40 years',
    whyItMatters: 'Built during the Great Depression, the Empire State Building was a defiant bet on American ambition. It held the world\'s tallest building title for 40 years and became the ultimate symbol of New York City — recognisable in silhouette across the globe.',
    constructionFeat: 'Completed in just 410 days using an average of 3,500 workers daily, with a new floor finished every day at peak construction — a speed never replicated for a building of this height.',
    influence: 'Established the supertall skyscraper as a symbol of national prestige, a formula replicated from Kuala Lumpur to Dubai.',
    stillStanding: true,
    searchQuery: 'Empire State Building New York 1931',
  },
  {
    id: 24,
    name: 'Fallingwater',
    year: '1936–1939',
    yearSort: 1939,
    location: 'Mill Run, Pennsylvania, USA \u{1F1FA}\u{1F1F8}',
    architect: 'Frank Lloyd Wright',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Americas',
    heightOrSize: 'Cantilevered over a 9 m waterfall; ~465 m\u00B2 interior',
    whyItMatters: 'Frank Lloyd Wright\'s masterpiece doesn\'t sit beside a waterfall — it hovers over it, with reinforced concrete terraces cantilevered over the cascading stream. It proved that modern architecture could embrace nature rather than dominate it.',
    constructionFeat: 'Its cantilevered concrete balconies extend up to 4.5 m beyond their supports without visible columns — pushing reinforced concrete to its structural limits.',
    influence: 'Became the most famous private residence in the world and made organic architecture — buildings integrated with their natural settings — a mainstream ideal.',
    stillStanding: true,
    searchQuery: 'Fallingwater Frank Lloyd Wright',
  },
  {
    id: 25,
    name: 'Sydney Opera House',
    year: '1959–1973',
    yearSort: 1973,
    location: 'Sydney, Australia \u{1F1E6}\u{1F1FA}',
    architect: 'J\u00F8rn Utzon',
    style: 'Contemporary',
    era: 'Contemporary (1960–)',
    continent: 'Oceania',
    heightOrSize: '65 m tall; 1.8 ha footprint; roof shells cover 1.62 ha',
    whyItMatters: 'Utzon\'s sail-like roof shells, derived from sections of a sphere, made the Sydney Opera House the most recognisable building of the 20th century. It proved that a single building could define a city\'s identity and boost its global profile.',
    constructionFeat: 'The shell geometry was unsolvable until Utzon discovered that every panel could be cut from a single sphere of 75 m radius — a breakthrough that made prefabrication possible.',
    influence: 'Launched the era of "iconic" architecture — cities commissioning spectacular buildings as branding exercises — from Bilbao\'s Guggenheim to Beijing\'s Bird\'s Nest.',
    stillStanding: true,
    searchQuery: 'Sydney Opera House Utzon architecture',
  },
  {
    id: 26,
    name: 'Centre Pompidou',
    year: '1971–1977',
    yearSort: 1977,
    location: 'Paris, France \u{1F1EB}\u{1F1F7}',
    architect: 'Renzo Piano & Richard Rogers',
    style: 'Contemporary',
    era: 'Contemporary (1960–)',
    continent: 'Europe',
    heightOrSize: '42 m tall; 103,305 m\u00B2 total floor area',
    whyItMatters: 'The Pompidou turned architecture inside out — placing all structural systems, ducts, escalators, and pipes on the exterior, colour-coded by function. Outrageous when built, it made the invisible workings of a building into its primary aesthetic statement.',
    constructionFeat: 'Its exposed tubular steel structure and external escalators in transparent tubes were engineering as provocation — the building\'s guts became its face.',
    influence: 'Launched the "high-tech" architectural movement and proved that cultural buildings could be playful, accessible, and anti-monumental.',
    stillStanding: true,
    searchQuery: 'Centre Pompidou Paris Piano Rogers',
  },
  {
    id: 27,
    name: 'Petra (Al-Khazneh)',
    year: '~100 BCE – 200 CE',
    yearSort: -100,
    location: 'Ma\'an, Jordan \u{1F1EF}\u{1F1F4}',
    architect: 'Nabataean architects',
    style: 'Ancient',
    era: 'Ancient (pre-500 CE)',
    continent: 'Asia',
    heightOrSize: '40 m tall; 25 m wide facade — carved directly into sandstone cliff',
    whyItMatters: 'The "Rose City" of Petra was the capital of the Nabataean kingdom — a trading empire that controlled the incense route. Al-Khazneh (The Treasury) was carved directly from the rock face, blending Hellenistic columns with Nabataean tradition.',
    constructionFeat: 'Rather than building upward, Nabataean masons carved downward from the cliff top, sculpting the elaborate facade from the living rock without scaffolding.',
    influence: 'Demonstrated subtractive architecture — carving space from stone rather than adding material — an approach echoed in Ethiopia\'s Lalibela churches.',
    stillStanding: true,
    searchQuery: 'Petra Treasury Nabataean Jordan',
    newWonder: true,
  },
  {
    id: 28,
    name: 'Christ the Redeemer',
    year: '1922–1931',
    yearSort: 1931,
    location: 'Rio de Janeiro, Brazil \u{1F1E7}\u{1F1F7}',
    architect: 'Heitor da Silva Costa; sculpted by Paul Landowski',
    style: 'Modernist',
    era: 'Modern (1750–1960)',
    continent: 'Americas',
    heightOrSize: '30 m statue + 8 m pedestal; 28 m arm span',
    whyItMatters: 'Standing atop Corcovado mountain, Christ the Redeemer is the largest Art Deco statue in the world and the defining image of Rio de Janeiro. It combined French sculptural skill with Brazilian reinforced-concrete engineering at a dramatic natural site.',
    constructionFeat: 'All materials were transported up the 710 m mountain by cog railway. The outer layer of soapstone tiles was hand-cut and applied by workers suspended at extreme heights.',
    influence: 'Became the prototype for monumental religious statues as national symbols, and proved that landscape and sculpture could fuse into architecture.',
    stillStanding: true,
    searchQuery: 'Christ the Redeemer Rio de Janeiro statue',
    newWonder: true,
  },
  {
    id: 29,
    name: 'Burj Khalifa',
    year: '2004–2010',
    yearSort: 2010,
    location: 'Dubai, UAE \u{1F1E6}\u{1F1EA}',
    architect: 'Adrian Smith (SOM — Skidmore, Owings & Merrill)',
    style: 'Contemporary',
    era: 'Contemporary (1960–)',
    continent: 'Asia',
    heightOrSize: '828 m tall; 163 floors; tallest structure ever built by humanity',
    whyItMatters: 'The Burj Khalifa shattered all height records by over 300 metres, turning Dubai from a desert trading port into a global icon of 21st-century ambition. Its Y-shaped plan was inspired by the Hymenocallis flower, a desert lily.',
    constructionFeat: 'Concrete was pumped to record heights (over 600 m) using specially formulated mixes with ice to prevent curing in desert heat; construction required pouring only at night when temperatures dropped.',
    influence: 'Ignited a global supertall race from Jeddah to Shenzhen and proved that structural engineering could push past the 800 m barrier.',
    stillStanding: true,
    searchQuery: 'Burj Khalifa Dubai tallest building',
  },
  {
    id: 30,
    name: 'The Shard',
    year: '2009–2013',
    yearSort: 2013,
    location: 'London, England \u{1F1EC}\u{1F1E7}',
    architect: 'Renzo Piano',
    style: 'Contemporary',
    era: 'Contemporary (1960–)',
    continent: 'Europe',
    heightOrSize: '310 m tall; 72 habitable floors; tallest building in Western Europe',
    whyItMatters: 'Piano\'s crystalline shard of glass transformed the London skyline, sparking fierce debate about whether supertall towers belong in a city defined by its horizontal Georgian and Victorian streetscape. It became a symbol of London\'s 21st-century reinvention.',
    constructionFeat: 'Built top-down — the core was constructed first using climbing formwork, then the steel frame and glass cladding were added around it, allowing the building to be occupied from the bottom while the top was still under construction.',
    influence: 'Reignited European interest in supertall buildings and demonstrated that glass towers could complement — not just overpower — historic cityscapes.',
    stillStanding: true,
    searchQuery: 'The Shard London Renzo Piano',
  },
  {
    id: 31,
    name: 'Chich\u00E9n Itz\u00E1 (El Castillo)',
    year: '~600 CE',
    yearSort: 600,
    location: 'Yucat\u00E1n, Mexico \u{1F1F2}\u{1F1FD}',
    architect: 'Maya architects',
    style: 'Ancient',
    era: 'Medieval (500–1400)',
    continent: 'Americas',
    heightOrSize: '30 m tall; 365 steps (one per day of the year); 55.3 m base',
    whyItMatters: 'El Castillo is a stone calendar — its 365 steps, 52 panels, and the serpent shadow that descends its staircase at each equinox reveal the Maya\'s extraordinary astronomical precision. It is the most visited archaeological site in Mexico.',
    constructionFeat: 'Oriented so precisely that at each equinox, sunlight creates a serpent-shaped shadow descending the north staircase — an alignment requiring sub-degree astronomical accuracy.',
    influence: 'Became the symbol of Maya civilization and demonstrated that pre-Columbian cultures matched or exceeded Old World astronomical knowledge.',
    stillStanding: true,
    searchQuery: 'Chichen Itza El Castillo Maya pyramid',
    newWonder: true,
  },
];

const TALLEST_THROUGH_HISTORY: TallestEntry[] = [
  { year: -2560, name: 'Great Pyramid of Giza', height: 146, unit: 'm' },
  { year: 1311, name: 'Lincoln Cathedral', height: 160, unit: 'm' },
  { year: 1549, name: 'St. Mary\'s Church, Stralsund', height: 151, unit: 'm' },
  { year: 1569, name: 'Beauvais Cathedral', height: 153, unit: 'm' },
  { year: 1573, name: 'St. Martin\'s Church, Landshut', height: 131, unit: 'm' },
  { year: 1647, name: 'Strasbourg Cathedral', height: 142, unit: 'm' },
  { year: 1874, name: 'St. Nikolai, Hamburg', height: 147, unit: 'm' },
  { year: 1876, name: 'Rouen Cathedral', height: 151, unit: 'm' },
  { year: 1880, name: 'Cologne Cathedral', height: 157, unit: 'm' },
  { year: 1884, name: 'Washington Monument', height: 169, unit: 'm' },
  { year: 1889, name: 'Eiffel Tower', height: 300, unit: 'm' },
  { year: 1930, name: 'Chrysler Building', height: 319, unit: 'm' },
  { year: 1931, name: 'Empire State Building', height: 443, unit: 'm' },
  { year: 1971, name: 'World Trade Center', height: 417, unit: 'm' },
  { year: 1973, name: 'Sears Tower (Willis)', height: 442, unit: 'm' },
  { year: 1998, name: 'Petronas Towers', height: 452, unit: 'm' },
  { year: 2004, name: 'Taipei 101', height: 508, unit: 'm' },
  { year: 2010, name: 'Burj Khalifa', height: 828, unit: 'm' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
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

// ── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div
      style={{
        padding: 'clamp(40px, 8vw, 80px) 32px 32px',
        background:
          'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(245,158,11,0.08) 50%, rgba(59,130,246,0.06) 100%)',
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
        \u2190 Back to Timeline
      </Link>

      <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F3DB}\uFE0F'}</div>

      <h1
        style={{
          fontSize: 'clamp(24px, 4vw, 40px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.2,
          marginBottom: 12,
        }}
      >
        Monuments to Ambition \u2014 The Greatest Structures Humanity Ever Built
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
        From Neolithic stone circles to 828-metre supertowers \u2014 5,000 years of building higher, wider, and bolder
      </p>
    </div>
  );
}

// ── Filters ────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  activeStyle: StyleBadge | 'All';
  activeEra: Era | 'All';
  activeContinent: Continent | 'All';
  onStyleSelect: (s: StyleBadge | 'All') => void;
  onEraSelect: (e: Era | 'All') => void;
  onContinentSelect: (c: Continent | 'All') => void;
}

function FilterBar({ activeStyle, activeEra, activeContinent, onStyleSelect, onEraSelect, onContinentSelect }: FilterBarProps) {
  const renderRow = <T extends string>(label: string, items: (T | 'All')[], active: T | 'All', onSelect: (v: T | 'All') => void, colorMap?: Record<string, string>) => (
    <div
      style={{
        padding: '8px 32px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, alignSelf: 'center', marginRight: 4 }}>
        {label}:
      </span>
      {items.map((item) => {
        const isActive = active === item;
        const color = item === 'All' ? '#94a3b8' : (colorMap ? colorMap[item] || '#94a3b8' : '#94a3b8');
        return (
          <button
            key={item}
            onClick={() => onSelect(item)}
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
            {item}
          </button>
        );
      })}
    </div>
  );

  const CONTINENT_COLORS: Record<string, string> = {
    Europe: '#a78bfa',
    Africa: '#f59e0b',
    Asia: '#ef4444',
    Americas: '#22c55e',
    Oceania: '#06b6d4',
  };

  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '6px 0' }}>
      {renderRow<StyleBadge>('Style', ['All', ...ALL_STYLES], activeStyle, onStyleSelect, STYLE_COLORS)}
      {renderRow<Era>('Era', ['All', ...ALL_ERAS], activeEra, onEraSelect)}
      {renderRow<Continent>('Continent', ['All', ...ALL_CONTINENTS], activeContinent, onContinentSelect, CONTINENT_COLORS)}
    </div>
  );
}

// ── Structure cards ──────────────────────────────────────────────────────────

function StructureCard({ structure, index }: { structure: Structure; index: number }) {
  const color = STYLE_COLORS[structure.style];

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
            {structure.year}
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            {'\u{1F4CD}'} {structure.location}
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
            {structure.style}
          </span>
          {structure.stillStanding ? (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(34,197,94,0.15)', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Still Standing
            </span>
          ) : (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Lost
            </span>
          )}
          {(structure.ancientWonder || structure.newWonder) && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {structure.ancientWonder ? '7 Wonders (Ancient)' : '7 Wonders (New)'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4, lineHeight: 1.3 }}>
          {structure.name}
        </h3>

        {/* Architect */}
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontStyle: 'italic' }}>
          {structure.architect}
        </div>

        {/* Size stat */}
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, padding: '6px 10px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
          {'\u{1F4CF}'} {structure.heightOrSize}
        </div>

        {/* Why it matters */}
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginBottom: 10 }}>
          {structure.whyItMatters}
        </p>

        {/* Construction feat */}
        <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, marginBottom: 10, padding: '8px 12px', backgroundColor: 'rgba(59,130,246,0.06)', borderRadius: 6, borderLeft: '3px solid rgba(59,130,246,0.3)' }}>
          <strong style={{ color: '#60a5fa' }}>Construction feat:</strong> {structure.constructionFeat}
        </div>

        {/* Influence */}
        <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.55, marginBottom: 12, padding: '8px 12px', backgroundColor: 'rgba(167,139,250,0.06)', borderRadius: 6, borderLeft: '3px solid rgba(167,139,250,0.3)' }}>
          <strong style={{ color: '#a78bfa' }}>Influence:</strong> {structure.influence}
        </div>

        {/* Footer: search link */}
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
            {structure.era}
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <Link
              to={`/?q=${encodeURIComponent(structure.searchQuery)}`}
              style={{
                fontSize: 11,
                color: '#60a5fa',
                textDecoration: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Find in Chronicle \u2192
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TimelineSection({ structures }: { structures: Structure[] }) {
  return (
    <SectionWrapper title="Timeline of Iconic Structures" icon="\u{1F3D7}\uFE0F">
      {structures.length === 0 ? (
        <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic', padding: '12px 0' }}>
          No structures match the selected filters.
        </div>
      ) : (
        structures.map((s, i) => <StructureCard key={s.id} structure={s} index={i} />)
      )}
    </SectionWrapper>
  );
}

// ── Tallest Through History race chart ──────────────────────────────────────

function TallestRaceChart() {
  const maxHeight = Math.max(...TALLEST_THROUGH_HISTORY.map((e) => e.height));

  return (
    <SectionWrapper title="Tallest Structures Through History" icon="\u{1F4C8}">
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
        For 3,800 years the Great Pyramid was the tallest structure on Earth. Then churches, monuments, and finally skyscrapers took the title.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {TALLEST_THROUGH_HISTORY.map((entry, i) => {
          const pct = (entry.height / maxHeight) * 100;
          const yearLabel = entry.year < 0 ? `${Math.abs(entry.year)} BCE` : `${entry.year}`;
          return (
            <motion.div
              key={`${entry.year}-${entry.name}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace', minWidth: 70, textAlign: 'right' }}>
                {yearLabel}
              </span>
              <div style={{ flex: 1, position: 'relative', height: 28 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${pct}%`,
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    borderRadius: 6,
                    border: '1px solid rgba(59,130,246,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 10,
                    minWidth: 'fit-content',
                  }}
                >
                  <span style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {entry.name}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', fontFamily: 'monospace', minWidth: 55, textAlign: 'right' }}>
                {entry.height} {entry.unit}
              </span>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

// ── Seven Wonders ──────────────────────────────────────────────────────────

function SevenWondersSection() {
  const ancientWonders = [
    { name: 'Great Pyramid of Giza', location: 'Egypt', status: 'Still standing', statusColor: '#22c55e' },
    { name: 'Hanging Gardens of Babylon', location: 'Iraq (disputed)', status: 'Lost — existence debated', statusColor: '#ef4444' },
    { name: 'Statue of Zeus at Olympia', location: 'Greece', status: 'Destroyed ~5th c. CE', statusColor: '#ef4444' },
    { name: 'Temple of Artemis at Ephesus', location: 'Turkey', status: 'Destroyed 262 CE', statusColor: '#ef4444' },
    { name: 'Mausoleum at Halicarnassus', location: 'Turkey', status: 'Destroyed by earthquakes', statusColor: '#ef4444' },
    { name: 'Colossus of Rhodes', location: 'Greece', status: 'Destroyed 226 BCE earthquake', statusColor: '#ef4444' },
    { name: 'Lighthouse of Alexandria', location: 'Egypt', status: 'Destroyed ~1480 CE', statusColor: '#ef4444' },
  ];

  const newWonders = STRUCTURES.filter((s) => s.newWonder);

  return (
    <SectionWrapper title="Seven Wonders of the World" icon="\u2728">
      {/* Ancient */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Ancient Wonders (compiled ~2nd c. BCE)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {ancientWonders.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{w.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{w.location}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: w.statusColor }}>{w.status}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* New */}
      <div>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          New Seven Wonders (2007 vote)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {newWonders.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(6,182,212,0.2)',
                borderRadius: 10,
                padding: '12px 16px',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{s.location}</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.year}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', marginTop: 4, display: 'inline-block' }}>Still standing</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

export default function ArchitecturePage() {
  const [activeStyle, setActiveStyle] = useState<StyleBadge | 'All'>('All');
  const [activeEra, setActiveEra] = useState<Era | 'All'>('All');
  const [activeContinent, setActiveContinent] = useState<Continent | 'All'>('All');

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

  const filteredStructures = useMemo(() => {
    return STRUCTURES
      .filter((s) => {
        if (activeStyle !== 'All' && s.style !== activeStyle) return false;
        if (activeEra !== 'All' && s.era !== activeEra) return false;
        if (activeContinent !== 'All' && s.continent !== activeContinent) return false;
        return true;
      })
      .sort((a, b) => a.yearSort - b.yearSort);
  }, [activeStyle, activeEra, activeContinent]);

  return (
    <PageShell>
      <HeroSection />
      <FilterBar
        activeStyle={activeStyle}
        activeEra={activeEra}
        activeContinent={activeContinent}
        onStyleSelect={setActiveStyle}
        onEraSelect={setActiveEra}
        onContinentSelect={setActiveContinent}
      />
      <TimelineSection structures={filteredStructures} />
      <TallestRaceChart />
      <SevenWondersSection />

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
          \u2190 Back to Timeline
        </Link>
      </div>
    </PageShell>
  );
}
