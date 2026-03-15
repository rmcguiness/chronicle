/**
 * DiscoveriesPage — curated explorer of the greatest scientific discoveries.
 *
 * Route: /discoveries
 *
 * Sections:
 *  1. Hero — "The Discoveries That Made Us" with timeline visualization
 *  2. Impact ranking — top 10 by impact score
 *  3. Field breakdown — bar chart of breakthroughs per field
 *  4. All discoveries — filterable card grid
 *  5. Chain of Discovery — how discoveries build on each other
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type DiscoveryField = 'Physics' | 'Biology' | 'Chemistry' | 'Math' | 'Technology' | 'Earth Science' | 'Medicine' | 'Astronomy' | 'Engineering' | 'Information';

interface Discovery {
  id: string;
  name: string;
  year: number;
  yearDisplay: string;
  discoverers: string;
  field: DiscoveryField;
  impactScore: number;
  before: string;
  after: string;
  quote?: string;
  quoteAttribution?: string;
  changedEverything: string;
  builtOn: string[];
  enabled: string[];
  searchQuery: string;
  era: 'ancient' | 'classical' | 'medieval' | 'early-modern' | 'modern' | 'contemporary';
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — 30 Greatest Scientific Discoveries
// ─────────────────────────────────────────────────────────────────────────────

const DISCOVERIES: Discovery[] = [
  {
    id: 'fire',
    name: 'Control of Fire',
    year: -1000000,
    yearDisplay: '~1M BCE',
    discoverers: 'Homo erectus',
    field: 'Technology',
    impactScore: 10,
    before: 'Humans ate raw food, had no warmth beyond body heat, and were vulnerable to predators at night.',
    after: 'Cooking made food safer and more nutritious, warmth enabled migration to cold climates, and fire became the first tool of civilization.',
    quote: undefined,
    changedEverything: 'Fire was the first technology — it reshaped human biology, diet, and social structure. Every subsequent civilization was built around the hearth.',
    builtOn: [],
    enabled: ['Metallurgy', 'Cooking', 'Ceramics'],
    searchQuery: 'control of fire',
    era: 'ancient',
  },
  {
    id: 'wheel',
    name: 'The Wheel',
    year: -3500,
    yearDisplay: '~3500 BCE',
    discoverers: 'Mesopotamian civilizations',
    field: 'Engineering',
    impactScore: 9,
    before: 'All land transport was carried by humans or pack animals. Pottery was shaped by hand.',
    after: 'Wheeled vehicles revolutionized trade, warfare, and agriculture. The potter\'s wheel enabled mass production of ceramics.',
    changedEverything: 'The wheel didn\'t just move things — it introduced rotary motion, the fundamental mechanical principle behind gears, turbines, and engines.',
    builtOn: ['Control of Fire'],
    enabled: ['Chariots', 'Pulleys', 'Gears', 'Turbines'],
    searchQuery: 'invention of the wheel',
    era: 'ancient',
  },
  {
    id: 'writing',
    name: 'Writing',
    year: -3200,
    yearDisplay: '~3200 BCE',
    discoverers: 'Sumerians (cuneiform)',
    field: 'Information',
    impactScore: 10,
    before: 'All knowledge was stored in human memory and passed orally. Complex administration was impossible.',
    after: 'Ideas could outlive their creators. Laws, literature, science, and history became permanent. Bureaucracy enabled empires.',
    quote: 'Of all the things which man has made, the most wonderful, the most interesting and the most important are books.',
    quoteAttribution: 'Addison (paraphrased)',
    changedEverything: 'Writing broke the barrier of mortality for ideas. Without it, no science, law, or literature would accumulate across generations.',
    builtOn: [],
    enabled: ['Mathematics', 'Law codes', 'Literature', 'Historical records'],
    searchQuery: 'invention of writing cuneiform',
    era: 'ancient',
  },
  {
    id: 'iron-smelting',
    name: 'Iron Smelting',
    year: -1200,
    yearDisplay: '~1200 BCE',
    discoverers: 'Hittites / multiple origins',
    field: 'Technology',
    impactScore: 8,
    before: 'Tools and weapons were made of bronze — expensive, soft, and limited to elites.',
    after: 'Iron democratized strong tools. Plows could break harder soil, armies could equip more soldiers, and agriculture expanded.',
    changedEverything: 'Iron ended the Bronze Age monopoly on metal. Cheaper and harder than bronze, it put powerful tools in the hands of ordinary people.',
    builtOn: ['Control of Fire'],
    enabled: ['Steel production', 'Industrial agriculture', 'Modern construction'],
    searchQuery: 'iron age smelting',
    era: 'ancient',
  },
  {
    id: 'mathematics',
    name: 'Formal Mathematics',
    year: -300,
    yearDisplay: '~300 BCE',
    discoverers: 'Euclid, Pythagoras, Archimedes',
    field: 'Math',
    impactScore: 10,
    before: 'Mathematical knowledge was scattered, empirical, and unsystematic.',
    after: 'Euclid\'s Elements created axiomatic reasoning — proving truths from first principles. Mathematics became the language of science.',
    quote: 'There is no royal road to geometry.',
    quoteAttribution: 'Euclid',
    changedEverything: 'Formal proof transformed mathematics from practical counting into an exact science. Every branch of physics, engineering, and computer science rests on this foundation.',
    builtOn: ['Writing'],
    enabled: ['Physics', 'Engineering', 'Computer science'],
    searchQuery: 'euclid elements mathematics',
    era: 'classical',
  },
  {
    id: 'zero',
    name: 'Zero & Positional Notation',
    year: 500,
    yearDisplay: '~500 CE',
    discoverers: 'Brahmagupta, Aryabhata (India)',
    field: 'Math',
    impactScore: 9,
    before: 'Roman numerals made arithmetic painful. There was no concept of "nothing" as a number, crippling algebra.',
    after: 'Positional notation made calculation tractable. Zero enabled algebra, calculus, and eventually computer binary.',
    quote: 'When zero is added to a number or subtracted from a number, the number remains unchanged.',
    quoteAttribution: 'Brahmagupta',
    changedEverything: 'Zero was not just a placeholder — it was the conceptual leap that "nothing" is something. This unlocked negative numbers, algebra, and the entire edifice of modern mathematics.',
    builtOn: ['Formal Mathematics', 'Writing'],
    enabled: ['Algebra', 'Calculus', 'Binary computing'],
    searchQuery: 'zero positional notation Brahmagupta',
    era: 'medieval',
  },
  {
    id: 'printing-press',
    name: 'Printing Press',
    year: 1440,
    yearDisplay: '1440',
    discoverers: 'Johannes Gutenberg',
    field: 'Technology',
    impactScore: 9,
    before: 'Books were hand-copied, taking months each. Knowledge was locked in monasteries and available only to elites.',
    after: 'Ideas spread at unprecedented speed. Literacy exploded, the Reformation became possible, and the Scientific Revolution had its distribution channel.',
    quote: 'It is a press, certainly, but a press from which shall flow in inexhaustible streams the most abundant and most marvelous liquor that has ever flowed to relieve the thirst of men.',
    quoteAttribution: 'Johannes Gutenberg',
    changedEverything: 'The printing press democratized knowledge. The Scientific Revolution, the Reformation, and the Enlightenment all rode on Gutenberg\'s invention.',
    builtOn: ['Writing', 'Iron Smelting'],
    enabled: ['Scientific Revolution', 'Reformation', 'Mass literacy'],
    searchQuery: 'Gutenberg printing press',
    era: 'early-modern',
  },
  {
    id: 'heliocentrism',
    name: 'Heliocentrism',
    year: 1543,
    yearDisplay: '1543',
    discoverers: 'Nicolaus Copernicus',
    field: 'Astronomy',
    impactScore: 9,
    before: 'Earth was the center of the universe. Celestial mechanics required elaborate epicycles and defied simple explanation.',
    after: 'Earth became just another planet. The door opened to understanding the actual mechanics of the solar system.',
    quote: 'In the center of all rests the Sun. Who would place this lamp of a very beautiful temple in another or better place?',
    quoteAttribution: 'Nicolaus Copernicus',
    changedEverything: 'Copernicus didn\'t just rearrange the planets — he showed humanity that our intuitions about our own importance could be fundamentally wrong.',
    builtOn: ['Formal Mathematics'],
    enabled: ['Kepler\'s Laws', 'Newtonian gravity', 'Modern astronomy'],
    searchQuery: 'Copernicus heliocentrism',
    era: 'early-modern',
  },
  {
    id: 'microscope',
    name: 'Microscopy',
    year: 1665,
    yearDisplay: '1665',
    discoverers: 'Robert Hooke, Antonie van Leeuwenhoek',
    field: 'Biology',
    impactScore: 8,
    before: 'The world below the naked eye was invisible. Disease had no visible cause, and life\'s smallest units were unknown.',
    after: 'Hooke discovered cells. Leeuwenhoek saw bacteria. An entire hidden world was revealed, founding microbiology.',
    quote: 'I then most always saw, with great wonder, that in the said matter there were many very little living animalcules.',
    quoteAttribution: 'Antonie van Leeuwenhoek',
    changedEverything: 'The microscope revealed that life existed at scales humans couldn\'t perceive. Every advance in cell biology, bacteriology, and medicine followed.',
    builtOn: ['Glass-making'],
    enabled: ['Cell theory', 'Germ Theory', 'Histology'],
    searchQuery: 'microscope Hooke Leeuwenhoek',
    era: 'early-modern',
  },
  {
    id: 'gravity',
    name: 'Laws of Gravity & Motion',
    year: 1687,
    yearDisplay: '1687',
    discoverers: 'Isaac Newton',
    field: 'Physics',
    impactScore: 10,
    before: 'Terrestrial and celestial mechanics were separate mysteries. Why things fell and why planets orbited had no unified explanation.',
    after: 'One set of laws explained apples falling and moons orbiting. The universe became predictable and mathematical.',
    quote: 'If I have seen further, it is by standing on the shoulders of giants.',
    quoteAttribution: 'Isaac Newton',
    changedEverything: 'Newton showed the universe obeyed mathematical laws discoverable by human reason. This was the birth of modern physics and the proof that science works.',
    builtOn: ['Heliocentrism', 'Formal Mathematics'],
    enabled: ['Celestial mechanics', 'Engineering', 'Space travel'],
    searchQuery: 'Newton Principia gravity',
    era: 'early-modern',
  },
  {
    id: 'oxygen',
    name: 'Discovery of Oxygen',
    year: 1774,
    yearDisplay: '1774',
    discoverers: 'Joseph Priestley, Antoine Lavoisier',
    field: 'Chemistry',
    impactScore: 8,
    before: 'Chemistry was dominated by the phlogiston theory. Combustion and respiration were poorly understood.',
    after: 'Lavoisier identified oxygen as the element of combustion, founding modern chemistry and dismantling alchemy\'s last framework.',
    quote: 'Nothing is lost, nothing is created, everything is transformed.',
    quoteAttribution: 'Antoine Lavoisier',
    changedEverything: 'The discovery of oxygen killed phlogiston theory and birthed modern chemistry. Lavoisier\'s systematic approach made chemistry a quantitative science.',
    builtOn: ['Formal Mathematics'],
    enabled: ['Modern chemistry', 'Periodic Table', 'Biochemistry'],
    searchQuery: 'oxygen discovery Lavoisier Priestley',
    era: 'early-modern',
  },
  {
    id: 'vaccination',
    name: 'Vaccination',
    year: 1796,
    yearDisplay: '1796',
    discoverers: 'Edward Jenner',
    field: 'Medicine',
    impactScore: 10,
    before: 'Smallpox killed 400,000 Europeans annually. Infectious disease was humanity\'s greatest killer with no systematic prevention.',
    after: 'Jenner proved the immune system could be trained. Smallpox was eventually eradicated — the only human disease ever eliminated.',
    quote: 'I hope that some day the practice of producing cowpox in human beings will spread over the world.',
    quoteAttribution: 'Edward Jenner',
    changedEverything: 'Vaccination proved that devastating diseases could be prevented, not just treated. It saved more lives than any other medical innovation.',
    builtOn: ['Microscopy'],
    enabled: ['Immunology', 'Smallpox eradication', 'Modern vaccines'],
    searchQuery: 'Jenner vaccination smallpox',
    era: 'modern',
  },
  {
    id: 'electromagnetism',
    name: 'Electromagnetism',
    year: 1831,
    yearDisplay: '1820s–1860s',
    discoverers: 'Michael Faraday, James Clerk Maxwell',
    field: 'Physics',
    impactScore: 10,
    before: 'Electricity and magnetism were curiosities. Light had no known physical basis. Communication was limited to the speed of horses.',
    after: 'Maxwell unified electricity, magnetism, and light. This led directly to electric power, radio, and the entire electronic age.',
    quote: 'Nothing is too wonderful to be true, if it be consistent with the laws of nature.',
    quoteAttribution: 'Michael Faraday',
    changedEverything: 'Maxwell\'s equations are the foundation of all modern technology — power grids, radio, TV, computers, phones. They also predicted electromagnetic waves, leading to Einstein.',
    builtOn: ['Laws of Gravity & Motion', 'Formal Mathematics'],
    enabled: ['Electric power', 'Radio', 'Electronics', 'Special Relativity'],
    searchQuery: 'Faraday Maxwell electromagnetism',
    era: 'modern',
  },
  {
    id: 'evolution',
    name: 'Evolution by Natural Selection',
    year: 1859,
    yearDisplay: '1859',
    discoverers: 'Charles Darwin, Alfred Russel Wallace',
    field: 'Biology',
    impactScore: 10,
    before: 'Species were thought to be fixed and independently created. The diversity of life had no natural explanation.',
    after: 'All life shares common ancestry, shaped by natural selection over deep time. Biology gained its unifying principle.',
    quote: 'There is grandeur in this view of life.',
    quoteAttribution: 'Charles Darwin',
    changedEverything: 'Evolution provided the framework for all biology — from genetics to ecology to medicine. It explained life\'s diversity without invoking special creation.',
    builtOn: ['Microscopy', 'Formal Mathematics'],
    enabled: ['Genetics', 'Modern medicine', 'Ecology', 'Paleontology'],
    searchQuery: 'Darwin Origin of Species evolution',
    era: 'modern',
  },
  {
    id: 'germ-theory',
    name: 'Germ Theory of Disease',
    year: 1862,
    yearDisplay: '1860s',
    discoverers: 'Louis Pasteur, Robert Koch',
    field: 'Medicine',
    impactScore: 10,
    before: 'Disease was attributed to miasma (bad air), humoral imbalance, or divine punishment. Surgery was often fatal from infection.',
    after: 'Specific microorganisms cause specific diseases. Antiseptic surgery, pasteurization, and targeted treatment became possible.',
    quote: 'In the fields of observation, chance favors only the prepared mind.',
    quoteAttribution: 'Louis Pasteur',
    changedEverything: 'Germ theory may have saved more lives than any other idea in history. It transformed medicine from guesswork to science and made modern surgery possible.',
    builtOn: ['Microscopy', 'Vaccination'],
    enabled: ['Antiseptic surgery', 'Penicillin', 'Public health', 'Pasteurization'],
    searchQuery: 'Pasteur Koch germ theory disease',
    era: 'modern',
  },
  {
    id: 'periodic-table',
    name: 'Periodic Table',
    year: 1869,
    yearDisplay: '1869',
    discoverers: 'Dmitri Mendeleev',
    field: 'Chemistry',
    impactScore: 9,
    before: 'Elements were catalogued but their relationships were murky. No framework predicted undiscovered elements.',
    after: 'Mendeleev arranged elements by atomic weight, revealing periodic patterns. He predicted three undiscovered elements — all found within 15 years.',
    quote: 'I saw in a dream a table where all the elements fell into place as required.',
    quoteAttribution: 'Dmitri Mendeleev',
    changedEverything: 'The Periodic Table showed that nature has deep structure. It\'s the chemist\'s map — organizing all matter and predicting properties of elements not yet found.',
    builtOn: ['Discovery of Oxygen', 'Formal Mathematics'],
    enabled: ['Atomic theory', 'Nuclear physics', 'Materials science'],
    searchQuery: 'Mendeleev periodic table',
    era: 'modern',
  },
  {
    id: 'radioactivity',
    name: 'Radioactivity',
    year: 1896,
    yearDisplay: '1896',
    discoverers: 'Henri Becquerel, Marie & Pierre Curie',
    field: 'Physics',
    impactScore: 9,
    before: 'Atoms were thought to be indivisible and inert. No known natural process could transmute elements.',
    after: 'Atoms had internal structure and could spontaneously decay. This opened nuclear physics, radiometric dating, and eventually nuclear energy.',
    quote: 'Nothing in life is to be feared, it is only to be understood.',
    quoteAttribution: 'Marie Curie',
    changedEverything: 'Radioactivity shattered the idea of immutable atoms. It led to nuclear physics, gave geologists a clock to date the Earth, and unleashed nuclear energy.',
    builtOn: ['Periodic Table', 'Electromagnetism'],
    enabled: ['Nuclear physics', 'Radiometric dating', 'Nuclear energy', 'Cancer treatment'],
    searchQuery: 'Becquerel Curie radioactivity',
    era: 'modern',
  },
  {
    id: 'relativity',
    name: 'Special & General Relativity',
    year: 1905,
    yearDisplay: '1905 / 1915',
    discoverers: 'Albert Einstein',
    field: 'Physics',
    impactScore: 10,
    before: 'Space and time were absolute. Gravity was an instantaneous force. E and m were unrelated quantities.',
    after: 'Space-time is curved by mass. E=mc² revealed the energy locked in matter. GPS, nuclear energy, and gravitational wave detection all depend on relativity.',
    quote: 'Imagination is more important than knowledge.',
    quoteAttribution: 'Albert Einstein',
    changedEverything: 'Einstein replaced Newton\'s absolute universe with one where space, time, and gravity are woven together. It\'s the framework for cosmology, black holes, and the Big Bang.',
    builtOn: ['Laws of Gravity & Motion', 'Electromagnetism', 'Formal Mathematics'],
    enabled: ['Nuclear energy', 'GPS', 'Cosmology', 'Gravitational wave detection'],
    searchQuery: 'Einstein relativity',
    era: 'modern',
  },
  {
    id: 'quantum-mechanics',
    name: 'Quantum Mechanics',
    year: 1925,
    yearDisplay: '1920s',
    discoverers: 'Planck, Bohr, Heisenberg, Schrödinger, Dirac',
    field: 'Physics',
    impactScore: 10,
    before: 'Physics could not explain atomic spectra, the photoelectric effect, or why atoms are stable.',
    after: 'The subatomic world follows probabilistic rules. This explains chemistry, enables transistors, lasers, and MRI machines.',
    quote: 'Anyone who is not shocked by quantum theory has not understood it.',
    quoteAttribution: 'Niels Bohr',
    changedEverything: 'Quantum mechanics revealed that reality at the smallest scale is fundamentally probabilistic. It underpins all of chemistry and every electronic device.',
    builtOn: ['Special & General Relativity', 'Radioactivity', 'Formal Mathematics'],
    enabled: ['Transistors', 'Lasers', 'MRI', 'Quantum computing'],
    searchQuery: 'quantum mechanics Planck Heisenberg',
    era: 'modern',
  },
  {
    id: 'penicillin',
    name: 'Penicillin',
    year: 1928,
    yearDisplay: '1928',
    discoverers: 'Alexander Fleming',
    field: 'Medicine',
    impactScore: 9,
    before: 'A simple cut could kill. Bacterial infections after surgery or wounds were often fatal. Average life expectancy was ~55.',
    after: 'Antibiotics transformed medicine. Once-fatal infections became curable. Surgery became routine. Estimated 200 million lives saved.',
    quote: 'One sometimes finds what one is not looking for.',
    quoteAttribution: 'Alexander Fleming',
    changedEverything: 'Penicillin proved that microorganisms could fight microorganisms. It launched the antibiotic era, arguably saving more lives than any single drug in history.',
    builtOn: ['Germ Theory of Disease', 'Microscopy'],
    enabled: ['Modern surgery', 'Antibiotic development', 'Organ transplants'],
    searchQuery: 'Fleming penicillin discovery',
    era: 'modern',
  },
  {
    id: 'nuclear-fission',
    name: 'Nuclear Fission',
    year: 1938,
    yearDisplay: '1938',
    discoverers: 'Otto Hahn, Lise Meitner, Fritz Strassmann',
    field: 'Physics',
    impactScore: 9,
    before: 'Energy came from chemical reactions — burning fuel. The energy locked inside atomic nuclei was theoretical.',
    after: 'Splitting atoms released millions of times more energy than chemistry. This powered both the atomic bomb and nuclear reactors.',
    quote: 'I will have nothing to do with a bomb!',
    quoteAttribution: 'Lise Meitner',
    changedEverything: 'Nuclear fission proved E=mc² was not just theoretical. It reshaped geopolitics, created a new energy source, and hung the sword of Damocles over civilization.',
    builtOn: ['Radioactivity', 'Special & General Relativity'],
    enabled: ['Nuclear power', 'Nuclear medicine', 'Cold War deterrence'],
    searchQuery: 'nuclear fission Hahn Meitner',
    era: 'modern',
  },
  {
    id: 'dna',
    name: 'Structure of DNA',
    year: 1953,
    yearDisplay: '1953',
    discoverers: 'Watson, Crick, Franklin, Wilkins',
    field: 'Biology',
    impactScore: 10,
    before: 'How heredity worked at the molecular level was unknown. The physical basis of genes was a mystery.',
    after: 'The double helix revealed how genetic information is stored, copied, and transmitted. It launched molecular biology and biotechnology.',
    quote: 'We have found the secret of life.',
    quoteAttribution: 'Francis Crick',
    changedEverything: 'DNA\'s structure instantly explained heredity — how life copies itself. It\'s the foundation of genetic engineering, forensics, and personalized medicine.',
    builtOn: ['Evolution by Natural Selection', 'Microscopy', 'Quantum Mechanics'],
    enabled: ['Genetic engineering', 'CRISPR', 'Genomics', 'Forensic DNA'],
    searchQuery: 'Watson Crick DNA double helix',
    era: 'contemporary',
  },
  {
    id: 'big-bang',
    name: 'Big Bang Theory',
    year: 1965,
    yearDisplay: '1927–1965',
    discoverers: 'Lemaître, Hubble, Penzias & Wilson',
    field: 'Astronomy',
    impactScore: 9,
    before: 'The universe was thought to be eternal and static. Its origin was a philosophical question, not a scientific one.',
    after: 'The universe began 13.8 billion years ago from an incredibly hot, dense state. We can observe the afterglow of creation.',
    quote: 'The evolution of the world can be compared to a display of fireworks that has just ended.',
    quoteAttribution: 'Georges Lemaître',
    changedEverything: 'The Big Bang gave the universe a history. It connected particle physics to cosmology and showed that science could address the deepest question: how did everything begin?',
    builtOn: ['Special & General Relativity', 'Radioactivity'],
    enabled: ['Dark matter research', 'Cosmic microwave background studies', 'Particle physics'],
    searchQuery: 'Big Bang theory cosmic microwave background',
    era: 'contemporary',
  },
  {
    id: 'plate-tectonics',
    name: 'Plate Tectonics',
    year: 1967,
    yearDisplay: '1960s',
    discoverers: 'Wegener (proposed), Hess, Wilson (confirmed)',
    field: 'Earth Science',
    impactScore: 8,
    before: 'Continents were fixed. Earthquakes, volcanoes, and mountain ranges had no unifying explanation.',
    after: 'Earth\'s crust is broken into moving plates. This one theory explains earthquakes, volcanoes, mountain building, and continental drift.',
    quote: 'Scientists still do not appear to understand sufficiently that all earth sciences must contribute evidence toward unveiling the state of our planet.',
    quoteAttribution: 'Alfred Wegener',
    changedEverything: 'Plate tectonics unified geology the way evolution unified biology. One mechanism — moving plates — explained the entire dynamic surface of Earth.',
    builtOn: ['Radioactivity', 'Formal Mathematics'],
    enabled: ['Earthquake prediction', 'Resource geology', 'Climate science'],
    searchQuery: 'plate tectonics continental drift',
    era: 'contemporary',
  },
  {
    id: 'internet',
    name: 'The Internet & WWW',
    year: 1991,
    yearDisplay: '1969/1991',
    discoverers: 'ARPA / Tim Berners-Lee',
    field: 'Technology',
    impactScore: 10,
    before: 'Information was local. Libraries, phone calls, and postal mail were the fastest ways to share knowledge.',
    after: 'All human knowledge became accessible instantly, worldwide. Communication, commerce, education, and politics were transformed.',
    quote: 'The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.',
    quoteAttribution: 'Tim Berners-Lee',
    changedEverything: 'The Internet did for ideas what roads did for goods — connected everything. Combined with the WWW, it created the most powerful information tool in history.',
    builtOn: ['Electromagnetism', 'Quantum Mechanics', 'Writing'],
    enabled: ['Social media', 'E-commerce', 'Cloud computing', 'AI'],
    searchQuery: 'internet World Wide Web Berners-Lee',
    era: 'contemporary',
  },
  {
    id: 'human-genome',
    name: 'Human Genome Project',
    year: 2003,
    yearDisplay: '1990–2003',
    discoverers: 'Collins, Venter, international consortium',
    field: 'Biology',
    impactScore: 9,
    before: 'The complete set of human genetic instructions was unknown. Finding disease genes required decades of painstaking work.',
    after: '3 billion base pairs mapped. Personalized medicine, ancestry tracing, and rapid disease gene identification became possible.',
    quote: 'We have caught the first glimpse of our own instruction book, previously known only to God.',
    quoteAttribution: 'Francis Collins',
    changedEverything: 'Sequencing the human genome gave medicine a complete parts list for the first time. It made precision medicine possible and accelerated drug discovery.',
    builtOn: ['Structure of DNA', 'The Internet & WWW'],
    enabled: ['Personalized medicine', 'CRISPR applications', '23andMe-style ancestry'],
    searchQuery: 'Human Genome Project',
    era: 'contemporary',
  },
  {
    id: 'higgs-boson',
    name: 'Higgs Boson',
    year: 2012,
    yearDisplay: '2012',
    discoverers: 'CERN (ATLAS & CMS), Peter Higgs, François Englert',
    field: 'Physics',
    impactScore: 7,
    before: 'The Standard Model of particle physics predicted a field that gives mass to particles, but it had never been observed.',
    after: 'The Higgs boson confirmed why particles have mass. It completed the Standard Model — the most successful theory in physics.',
    quote: 'I am very glad that it has happened in my lifetime.',
    quoteAttribution: 'Peter Higgs',
    changedEverything: 'Finding the Higgs completed the Standard Model — our best description of the subatomic world. It validated 50 years of theoretical physics.',
    builtOn: ['Quantum Mechanics', 'Special & General Relativity'],
    enabled: ['Beyond Standard Model physics', 'New particle searches'],
    searchQuery: 'Higgs boson CERN discovery',
    era: 'contemporary',
  },
  {
    id: 'crispr',
    name: 'CRISPR Gene Editing',
    year: 2012,
    yearDisplay: '2012',
    discoverers: 'Jennifer Doudna, Emmanuelle Charpentier',
    field: 'Biology',
    impactScore: 9,
    before: 'Editing genes was slow, expensive, and imprecise. Genetic diseases seemed permanently incurable.',
    after: 'CRISPR makes gene editing fast, cheap, and precise. Sickle cell disease has been cured. Agricultural and medical applications are exploding.',
    quote: 'The power to control our species\' genetic future is awesome and terrifying.',
    quoteAttribution: 'Jennifer Doudna',
    changedEverything: 'CRISPR democratized gene editing the way the printing press democratized knowledge. It put the power to rewrite DNA in the hands of any biology lab.',
    builtOn: ['Structure of DNA', 'Human Genome Project'],
    enabled: ['Gene therapy', 'Disease-resistant crops', 'Sickle cell cure'],
    searchQuery: 'CRISPR gene editing Doudna Charpentier',
    era: 'contemporary',
  },
  {
    id: 'gravitational-waves',
    name: 'Gravitational Waves Detected',
    year: 2015,
    yearDisplay: '2015',
    discoverers: 'LIGO collaboration (Weiss, Barish, Thorne)',
    field: 'Physics',
    impactScore: 7,
    before: 'Einstein predicted gravitational waves in 1916, but they were too faint to detect. We could only "see" the universe with light.',
    after: 'We can now "hear" the universe — detecting ripples in spacetime from colliding black holes. A new era of astronomy opened.',
    quote: 'We did it! We detected gravitational waves. We are really witnessing the opening of a new tool for doing astronomy.',
    quoteAttribution: 'David Reitze (LIGO)',
    changedEverything: 'Gravitational wave detection opened a new sense for astronomy. We can now observe events invisible to telescopes — merging black holes, neutron star collisions.',
    builtOn: ['Special & General Relativity', 'Quantum Mechanics'],
    enabled: ['Multi-messenger astronomy', 'Black hole science', 'Tests of general relativity'],
    searchQuery: 'LIGO gravitational waves detection',
    era: 'contemporary',
  },
  {
    id: 'steam-engine',
    name: 'Steam Engine',
    year: 1769,
    yearDisplay: '1769',
    discoverers: 'James Watt (improved Newcomen\'s design)',
    field: 'Engineering',
    impactScore: 9,
    before: 'Power came from muscles, water wheels, and wind — all limited and location-dependent.',
    after: 'Mechanical power became portable and scalable. Factories, railways, and steamships industrialized the world.',
    quote: 'I can think of nothing else but this machine.',
    quoteAttribution: 'James Watt',
    changedEverything: 'The steam engine converted heat into work, launching the Industrial Revolution. It was the first general-purpose power source, transforming every industry.',
    builtOn: ['Iron Smelting', 'Laws of Gravity & Motion'],
    enabled: ['Railways', 'Factory system', 'Industrial Revolution'],
    searchQuery: 'James Watt steam engine',
    era: 'modern',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FIELD_COLORS: Record<string, string> = {
  Physics: '#60a5fa',
  Biology: '#34d399',
  Chemistry: '#fbbf24',
  Math: '#a78bfa',
  Technology: '#f97316',
  'Earth Science': '#22d3ee',
  Medicine: '#f472b6',
  Astronomy: '#818cf8',
  Engineering: '#fb923c',
  Information: '#2dd4bf',
};

const ERA_LABELS: Record<string, string> = {
  ancient: 'Ancient (before 500 BCE)',
  classical: 'Classical (500 BCE–500 CE)',
  medieval: 'Medieval (500–1400)',
  'early-modern': 'Early Modern (1400–1750)',
  modern: 'Modern (1750–1945)',
  contemporary: 'Contemporary (1945–present)',
};

const SCIENCE_QUOTES = [
  { text: 'The important thing is not to stop questioning. Curiosity has its own reason for existence.', author: 'Albert Einstein' },
  { text: 'Somewhere, something incredible is waiting to be known.', author: 'Carl Sagan' },
  { text: 'Science is not only compatible with spirituality; it is a profound source of spirituality.', author: 'Carl Sagan' },
  { text: 'The good thing about science is that it\'s true whether or not you believe in it.', author: 'Neil deGrasse Tyson' },
  { text: 'Research is what I\'m doing when I don\'t know what I\'m doing.', author: 'Wernher von Braun' },
  { text: 'Every great advance in science has issued from a new audacity of imagination.', author: 'John Dewey' },
];

const CARD_STAGGER = 0.06;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getEraFromYear(year: number): string {
  if (year < -500) return 'ancient';
  if (year < 500) return 'classical';
  if (year < 1400) return 'medieval';
  if (year < 1750) return 'early-modern';
  if (year < 1945) return 'modern';
  return 'contemporary';
}

function sortedByYear(discoveries: Discovery[]): Discovery[] {
  return [...discoveries].sort((a, b) => a.year - b.year);
}

function getFieldCounts(discoveries: Discovery[]): { field: string; count: number }[] {
  const counts: Record<string, number> = {};
  discoveries.forEach((d) => {
    counts[d.field] = (counts[d.field] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([field, count]) => ({ field, count }))
    .sort((a, b) => b.count - a.count);
}

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
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

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

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const sorted = sortedByYear(DISCOVERIES);
  const quoteIdx = Math.floor(Date.now() / 86400000) % SCIENCE_QUOTES.length;
  const dailyQuote = SCIENCE_QUOTES[quoteIdx];

  return (
    <div
      style={{
        padding: '48px 32px 36px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(59,130,246,0.08) 50%, rgba(139,92,246,0.06) 100%)',
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
        ← Back to Timeline
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.15,
          marginBottom: 12,
        }}
      >
        The Discoveries That Made Us
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{
          fontSize: 16,
          color: '#94a3b8',
          lineHeight: 1.6,
          maxWidth: 640,
          marginBottom: 28,
        }}
      >
        From controlling fire to editing genes — {DISCOVERIES.length} breakthroughs that shaped
        civilization, told through impact, context, and the chain of human curiosity.
      </motion.p>

      {/* Mini timeline strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 24,
        }}
      >
        {sorted.map((d, i) => (
          <div
            key={d.id}
            title={`${d.name} (${d.yearDisplay})`}
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: FIELD_COLORS[d.field] ?? '#6b7280',
                border: '2px solid rgba(255,255,255,0.15)',
                cursor: 'default',
              }}
            />
            {i < sorted.length - 1 && (
              <div style={{ width: 20, height: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </motion.div>

      {/* Quote of the day */}
      <div
        style={{
          padding: '14px 20px',
          borderRadius: 10,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontStyle: 'italic',
          fontSize: 14,
          color: '#94a3b8',
          lineHeight: 1.6,
        }}
      >
        "{dailyQuote.text}"
        <span style={{ color: '#64748b', fontStyle: 'normal', marginLeft: 8 }}>— {dailyQuote.author}</span>
      </div>
    </div>
  );
}

// ── Impact Ranking ───────────────────────────────────────────────────────────

function ImpactRanking() {
  const top10 = [...DISCOVERIES].sort((a, b) => b.impactScore - a.impactScore || a.year - b.year).slice(0, 10);

  return (
    <SectionWrapper title="Top 10 by Impact" icon="🏆">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {top10.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '10px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: i < 3 ? '#fbbf24' : '#475569',
                minWidth: 28,
                textAlign: 'center',
                fontFamily: 'monospace',
              }}
            >
              {i + 1}
            </span>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: FIELD_COLORS[d.field],
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{d.name}</span>
              <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{d.yearDisplay}</span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: FIELD_COLORS[d.field],
                padding: '3px 8px',
                borderRadius: 4,
                backgroundColor: `${FIELD_COLORS[d.field]}18`,
              }}
            >
              {d.field}
            </span>
            <div
              style={{
                width: 80,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.impactScore * 10}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                style={{
                  height: '100%',
                  backgroundColor: FIELD_COLORS[d.field],
                  borderRadius: 3,
                }}
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', minWidth: 24, textAlign: 'right' }}>
              {d.impactScore}
            </span>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── Field Breakdown ──────────────────────────────────────────────────────────

function FieldBreakdown() {
  const fieldCounts = getFieldCounts(DISCOVERIES);
  const maxCount = Math.max(...fieldCounts.map((f) => f.count));

  return (
    <SectionWrapper title="Breakthroughs by Field" icon="📊">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {fieldCounts.map((f, i) => (
          <motion.div
            key={f.field}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: FIELD_COLORS[f.field] ?? '#94a3b8',
                minWidth: 100,
                textAlign: 'right',
              }}
            >
              {f.field}
            </span>
            <div
              style={{
                flex: 1,
                height: 22,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(f.count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.04 + 0.1 }}
                style={{
                  height: '100%',
                  backgroundColor: `${FIELD_COLORS[f.field] ?? '#6b7280'}44`,
                  border: `1px solid ${FIELD_COLORS[f.field] ?? '#6b7280'}66`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 8,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 700, color: FIELD_COLORS[f.field] ?? '#94a3b8' }}>
                  {f.count}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ── Filters ──────────────────────────────────────────────────────────────────

interface FiltersProps {
  selectedField: string;
  setSelectedField: (f: string) => void;
  selectedEra: string;
  setSelectedEra: (e: string) => void;
  minImpact: number;
  setMinImpact: (n: number) => void;
}

function Filters({ selectedField, setSelectedField, selectedEra, setSelectedEra, minImpact, setMinImpact }: FiltersProps) {
  const fields = ['All', ...Object.keys(FIELD_COLORS)];
  const eras = ['All', ...Object.keys(ERA_LABELS)];

  const pillStyle = (active: boolean, color?: string): React.CSSProperties => ({
    padding: '5px 12px',
    borderRadius: 6,
    border: active
      ? `1px solid ${color ?? 'rgba(96,165,250,0.5)'}`
      : '1px solid rgba(255,255,255,0.08)',
    backgroundColor: active
      ? `${color ?? '#3b82f6'}18`
      : 'rgba(255,255,255,0.03)',
    color: active ? (color ?? '#60a5fa') : '#64748b',
    fontSize: 12,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <SectionWrapper title="Filter Discoveries" icon="🔍">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Field filter */}
        <div>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Field
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {fields.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                style={pillStyle(selectedField === f, f !== 'All' ? FIELD_COLORS[f] : undefined)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Era filter */}
        <div>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Era
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {eras.map((e) => (
              <button
                key={e}
                onClick={() => setSelectedEra(e)}
                style={pillStyle(selectedEra === e)}
              >
                {e === 'All' ? 'All Eras' : ERA_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        {/* Impact filter */}
        <div>
          <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Minimum Impact Score: {minImpact}+
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={minImpact}
            onChange={(e) => setMinImpact(Number(e.target.value))}
            style={{ width: 200, accentColor: '#3b82f6' }}
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

// ── Discovery Card ───────────────────────────────────────────────────────────

function DiscoveryCard({ discovery, index }: { discovery: Discovery; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const color = FIELD_COLORS[discovery.field] ?? '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * CARD_STAGGER, duration: 0.35, ease: 'easeOut' }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}33`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 150ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}66`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}33`; }}
    >
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, margin: 0 }}>
              {discovery.name}
            </h3>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
              {discovery.discoverers} · {discovery.yearDisplay}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 4,
                backgroundColor: `${color}22`,
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              {discovery.field}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Impact</span>
              <span style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'monospace' }}>
                {discovery.impactScore}/10
              </span>
            </div>
          </div>
        </div>

        {/* Impact bar */}
        <div style={{ height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${discovery.impactScore * 10}%` }}
            transition={{ duration: 0.6, delay: index * CARD_STAGGER + 0.2 }}
            style={{ height: '100%', backgroundColor: color, borderRadius: 2 }}
          />
        </div>
      </div>

      {/* Changed everything */}
      <div style={{ padding: '14px 20px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.65 }}>
        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Changed everything because: </span>
        {discovery.changedEverything}
      </div>

      {/* Before / After */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ padding: '12px 20px', backgroundColor: 'rgba(239,68,68,0.05)', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Before
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{discovery.before}</div>
        </div>
        <div style={{ padding: '12px 20px', backgroundColor: 'rgba(34,197,94,0.05)', borderTop: '1px solid rgba(34,197,94,0.15)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            After
          </div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{discovery.after}</div>
        </div>
      </div>

      {/* Expandable details */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '10px 20px',
          backgroundColor: 'transparent',
          border: 'none',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          color: '#64748b',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: "'Inter', sans-serif",
          transition: 'color 150ms',
        }}
      >
        {expanded ? '▾ Less' : '▸ More — quote, connections, search'}
      </button>

      {expanded && (
        <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quote */}
          {discovery.quote && (
            <div
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${color}66`,
                fontStyle: 'italic',
                fontSize: 13,
                color: '#94a3b8',
                lineHeight: 1.5,
              }}
            >
              "{discovery.quote}"
              {discovery.quoteAttribution && (
                <span style={{ color: '#64748b', fontStyle: 'normal', marginLeft: 6 }}>
                  — {discovery.quoteAttribution}
                </span>
              )}
            </div>
          )}

          {/* Built on */}
          {discovery.builtOn.length > 0 && (
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Built on:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                {discovery.builtOn.map((b) => (
                  <span
                    key={b}
                    style={{
                      fontSize: 11,
                      padding: '3px 8px',
                      borderRadius: 4,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#94a3b8',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Enabled */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Enabled:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
              {discovery.enabled.map((e) => (
                <span
                  key={e}
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 4,
                    backgroundColor: `${color}12`,
                    border: `1px solid ${color}33`,
                    color,
                  }}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Find in Chronicle */}
          <Link
            to={`/?q=${encodeURIComponent(discovery.searchQuery)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(96,165,250,0.3)',
              backgroundColor: 'rgba(96,165,250,0.08)',
              transition: 'background 150ms',
            }}
          >
            🔎 Find in Chronicle
          </Link>
        </div>
      )}
    </motion.div>
  );
}

// ── Chain of Discovery ───────────────────────────────────────────────────────

function ChainOfDiscovery() {
  // Show a few key chains
  const chains: { label: string; color: string; steps: string[] }[] = [
    {
      label: 'Fire to Factories',
      color: '#f97316',
      steps: ['Control of Fire', 'Iron Smelting', 'Steam Engine', 'Industrial Revolution'],
    },
    {
      label: 'Microbes to Medicine',
      color: '#f472b6',
      steps: ['Microscopy', 'Vaccination', 'Germ Theory of Disease', 'Penicillin'],
    },
    {
      label: 'Math to the Cosmos',
      color: '#a78bfa',
      steps: ['Formal Mathematics', 'Heliocentrism', 'Laws of Gravity & Motion', 'Special & General Relativity', 'Big Bang Theory'],
    },
    {
      label: 'Code of Life',
      color: '#34d399',
      steps: ['Evolution by Natural Selection', 'Structure of DNA', 'Human Genome Project', 'CRISPR Gene Editing'],
    },
    {
      label: 'Invisible Forces',
      color: '#60a5fa',
      steps: ['Electromagnetism', 'Radioactivity', 'Quantum Mechanics', 'The Internet & WWW'],
    },
  ];

  return (
    <SectionWrapper title="The Chain of Discovery" icon="🔗">
      <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
        No discovery stands alone. Each breakthrough builds on what came before, creating chains of
        knowledge that stretch across centuries.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {chains.map((chain, ci) => (
          <motion.div
            key={chain.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ci * 0.08, duration: 0.35 }}
            style={{
              padding: '14px 18px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${chain.color}33`,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: chain.color, marginBottom: 10 }}>
              {chain.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
              {chain.steps.map((step, si) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: 6,
                      backgroundColor: `${chain.color}12`,
                      border: `1px solid ${chain.color}33`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step}
                  </span>
                  {si < chain.steps.length - 1 && (
                    <span style={{ fontSize: 14, color: chain.color, margin: '0 6px', fontWeight: 700 }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function DiscoveriesPage() {
  const [selectedField, setSelectedField] = useState('All');
  const [selectedEra, setSelectedEra] = useState('All');
  const [minImpact, setMinImpact] = useState(1);

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

  const filtered = useMemo(() => {
    return sortedByYear(DISCOVERIES).filter((d) => {
      if (selectedField !== 'All' && d.field !== selectedField) return false;
      if (selectedEra !== 'All' && d.era !== selectedEra) return false;
      if (d.impactScore < minImpact) return false;
      return true;
    });
  }, [selectedField, selectedEra, minImpact]);

  return (
    <PageShell>
      <HeroSection />
      <ImpactRanking />
      <FieldBreakdown />
      <ChainOfDiscovery />

      <Filters
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        selectedEra={selectedEra}
        setSelectedEra={setSelectedEra}
        minImpact={minImpact}
        setMinImpact={setMinImpact}
      />

      <SectionWrapper title={`All Discoveries (${filtered.length})`} icon="🔬">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((d, i) => (
            <DiscoveryCard key={d.id} discovery={d} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            No discoveries match your filters. Try adjusting the field, era, or impact score.
          </div>
        )}
      </SectionWrapper>

      {/* Bottom nav */}
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
