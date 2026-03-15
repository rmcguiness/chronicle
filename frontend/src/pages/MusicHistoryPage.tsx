/**
 * MusicHistoryPage — comprehensive deep-dive on the history of music
 * (60,000 BCE–Present).
 *
 * Route: /music-history
 *
 * Sections:
 *  1. Hero — headline, intro
 *  2. Key Stats — grid cards
 *  3. The Origins of Music (50,000+ BCE)
 *  4. Ancient Music (3000 BCE–500 CE)
 *  5. Medieval Music (500–1400 CE)
 *  6. Renaissance Music (1400–1600)
 *  7. Baroque (1600–1750)
 *  8. Classical and Romantic (1750–1900)
 *  9. The 20th Century Revolution
 * 10. The Digital Revolution
 * 11. World Music and Non-Western Traditions
 * 12. Continue the Story — related deep-dive links
 * 13. Footer — closing quote, back link
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── colour palette ───────────────────────────────────────────────── */
const ASH = '#94a3b8';
const SLATE = '#64748b';
const STONE = '#78716c';
const CRIMSON = '#dc2626';
const GOLD = '#f59e0b';
const AMBER = '#d97706';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const FOREST = '#15803d';
const SKY = '#38bdf8';
const VINYL = '#1e1b4b';
const JAZZ_BLUE = '#2563eb';
const BONE = '#d6d3d1';
const BAROQUE = '#ca8a04';
const BLUES = '#1d4ed8';
const ELECTRIC = '#06b6d4';
const VINYL_GROOVE = '#7c3aed';
const NOTATION = '#e11d48';

const FIGURE_COLORS = [SKY, AMBER, CRIMSON, FOREST, GOLD, TEAL, INDIGO, ROSE, PURPLE, BONE, BAROQUE, BLUES];

/* ── data types ───────────────────────────────────────────────────── */
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

/* ── key stats ────────────────────────────────────────────────────── */
const KEY_STATS: { label: string; value: string; context: string; color: string }[] = [
  {
    label: 'Oldest Instrument',
    value: '~60,000 yrs',
    context: 'Divje Babe flute — Neanderthal bear bone with drilled holes, found in Slovenia',
    color: BONE,
  },
  {
    label: 'Universality',
    value: 'Every Culture',
    context: 'No human culture has ever been found without music — the only universal behavior besides language and art',
    color: GOLD,
  },
  {
    label: 'Beatles Albums Sold',
    value: '600M+',
    context: 'Most covered artist of all time — transformed songwriting, production, and the cultural impact of music',
    color: INDIGO,
  },
  {
    label: 'Spotify Daily Uploads',
    value: '100,000+',
    context: 'More music released per day than in the entire 20th century combined; most of it unheard',
    color: FOREST,
  },
  {
    label: 'Music Industry Revenue',
    value: '$26 Billion',
    context: '2023 global revenue — mostly streaming; a fraction of what it was at peak CD sales',
    color: ELECTRIC,
  },
];

/* ── origins data ─────────────────────────────────────────────────── */
const ORIGINS_TIMELINE: TimelineEntry[] = [
  {
    year: '~60,000 BCE',
    title: 'Divje Babe Flute — Oldest Known Musical Instrument',
    description:
      'A Neanderthal bear femur with carefully drilled holes, found in a Slovenian cave. Whether it was made by Neanderthals or early Homo sapiens remains debated, but it proves music-making is older than our species\u2019 sole dominance.',
    color: BONE,
  },
  {
    year: '~40,000 BCE',
    title: 'Hohle Fels Vulture Bone Flute',
    description:
      'Found in a German cave, this vulture bone flute with five finger holes is the oldest undisputed musical instrument made by Homo sapiens. Crafted during the Upper Paleolithic, when humans also made the first figurative art.',
    color: STONE,
  },
  {
    year: '~2600 BCE',
    title: 'First Written Music — Sumerian Clay Tablets',
    description:
      'Ancient Mesopotamia produced the first known musical notation on clay tablets. Harps and lyres accompanied Sumerian ceremonies. The "Hurrian Hymn No. 6" (~1400 BCE) is the oldest substantially complete notated composition.',
    color: AMBER,
  },
];

const ORIGINS_INSIGHTS: InsightEntry[] = [
  {
    label: 'Why Music? The Four Theories',
    detail:
      'Social bonding (group cohesion around the campfire), sexual selection (Darwin\'s idea — musical talent as mate signal), spiritual/ritual (connecting to the divine), and emotional regulation (processing feelings). The honest answer: probably all of the above, working together.',
  },
  {
    label: 'Music Is Universal',
    detail:
      'Every human culture ever studied has music. No exceptions. It is one of the only truly universal human behaviors alongside language and visual art. Even isolated communities with no outside contact develop complex musical traditions independently.',
  },
  {
    label: 'Music Before Instruments',
    detail:
      'Singing, clapping, and body percussion almost certainly predate any instrument by tens of thousands of years. The human voice is the original instrument — and rhythm may have emerged from the simple act of walking together.',
  },
];

/* ── ancient music data ───────────────────────────────────────────── */
const ANCIENT_TIMELINE: TimelineEntry[] = [
  {
    year: '~3000 BCE',
    title: 'Egyptian Music — A Professional Class Emerges',
    description:
      'Egyptian civilization elevated musicians to a professional class. Harps, flutes, and percussion instruments accompanied religious ceremonies and royal courts. Tomb paintings show elaborate musical ensembles, proving music was central to both sacred and secular life.',
    color: GOLD,
  },
  {
    year: '~5th Century BCE',
    title: 'Pythagoras Discovers Musical Intervals Are Math',
    description:
      'Pythagoras demonstrated that musical intervals correspond to mathematical ratios — an octave is 2:1, a fifth is 3:2. This discovery united music and mathematics forever and remains the foundation of Western music theory 2,500 years later.',
    color: INDIGO,
  },
  {
    year: '~5th–4th Century BCE',
    title: 'Greek Modes — Ancestors of Modern Scales',
    description:
      'The Greeks developed modal scales — Dorian, Lydian, Phrygian, Mixolydian — each with a distinct emotional character. These modes are the direct ancestors of modern major and minor scales and are still used in jazz and folk music today.',
    color: SKY,
  },
  {
    year: '~3rd Century BCE–5th Century CE',
    title: 'Roman Music — Entertainment and Military Power',
    description:
      'Rome used music for entertainment (gladiatorial games, theater) and military signaling. The tuba (straight trumpet) and cornu (curved horn) directed legions in battle. The hydraulis — a water-powered organ — was the most complex instrument of antiquity.',
    color: CRIMSON,
  },
];

const ANCIENT_FIGURES: FigureEntry[] = [
  {
    name: 'Pythagoras',
    years: '~570–495 BCE',
    contribution:
      'Demonstrated that musical harmony is governed by mathematical ratios. His discovery that a vibrating string divided in half produces an octave is arguably the single most important insight in music theory.',
  },
  {
    name: 'Chinese Pentatonic Tradition',
    years: '~3000 BCE onward',
    contribution:
      'China independently developed the 5-note pentatonic scale — the same scale used in folk music across Africa, Scotland, Japan, and the Americas. Its universality suggests something deep about human auditory perception.',
  },
  {
    name: 'Indian Classical Tradition',
    years: '~2000 BCE onward',
    contribution:
      'Indian music developed ragas (melodic frameworks), the drone (continuous tonal center), and complex rhythm cycles called talas. Formalized by the Natya Shastra (~2nd century BCE), it is one of the oldest continuous musical traditions on Earth.',
  },
];

/* ── medieval music data ──────────────────────────────────────────── */
const MEDIEVAL_TIMELINE: TimelineEntry[] = [
  {
    year: '~6th–9th Century',
    title: 'Gregorian Chant — The Church Standardizes Music',
    description:
      'The Catholic Church standardized liturgical music into Gregorian chant — monophonic (one melody, no harmony), meditative, and designed to focus worship. For centuries, this was essentially the only formally notated music in Europe.',
    color: PURPLE,
  },
  {
    year: '~900 CE',
    title: 'Polyphony Emerges — Multiple Voices at Once',
    description:
      'For the first time, composers began layering multiple independent voices at different pitches. The Notre Dame school in Paris (Léonin and Pérotin, 12th century) perfected this technique, creating the foundation for all Western harmony.',
    color: VINYL_GROOVE,
  },
  {
    year: '~1000 CE',
    title: 'Guido d\'Arezzo Invents Staff Notation',
    description:
      'Italian monk Guido d\'Arezzo revolutionized music by creating the staff notation system and the solfège syllables: do, re, mi, fa, sol, la. This system — the direct ancestor of modern sheet music — made it possible to learn a song without ever hearing it.',
    color: NOTATION,
  },
];

const MEDIEVAL_FIGURES: FigureEntry[] = [
  {
    name: 'Hildegard of Bingen',
    years: '1098–1179',
    contribution:
      'German abbess, mystic, and the first known composer by name to write about musical composition theory. Her luminous chants, over 70 compositions, are still performed and recorded today — 900 years after her death.',
  },
  {
    name: 'Guido d\'Arezzo',
    years: '~991–1033',
    contribution:
      'Invented the musical staff and solfège system (do, re, mi). Before Guido, music could only be learned by ear from a teacher. After Guido, anyone literate could learn a new piece from notation alone — a revolution comparable to Gutenberg\'s.',
  },
  {
    name: 'Troubadours',
    years: '11th–13th Century',
    contribution:
      'Poet-musicians of southern France who created secular love songs in vernacular languages (not Latin). They invented the concept of the singer-songwriter and made music about human emotion rather than only religious devotion.',
  },
];

/* ── renaissance data ─────────────────────────────────────────────── */
const RENAISSANCE_TIMELINE: TimelineEntry[] = [
  {
    year: '1501',
    title: 'Petrucci Prints First Music Book',
    description:
      'Ottaviano Petrucci used movable type to print the first book of polyphonic music (Harmonice Musices Odhecaton). Just as Gutenberg democratized the written word, Petrucci democratized written music — compositions could now spread across Europe.',
    color: TEAL,
  },
  {
    year: '~1525–1594',
    title: 'Palestrina — Peak of Renaissance Polyphony',
    description:
      'Giovanni Pierluigi da Palestrina perfected Renaissance counterpoint — multiple independent voices woven together in intricate harmony. His masses are still considered the gold standard of choral writing and remain the basis of music theory education.',
    color: BAROQUE,
  },
  {
    year: '~1530s onward',
    title: 'Madrigals — Music Gets Emotional',
    description:
      'Secular vocal compositions that used "word painting" — the music literally mimics the text (ascending notes for "rising," dissonance for "pain"). The madrigal was the first popular music form to prioritize emotional expression over religious function.',
    color: ROSE,
  },
];

const RENAISSANCE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Instruments Mature',
    detail:
      'The lute, viol, recorder, and harpsichord reached sophisticated forms during the Renaissance. Instrument-making became a respected craft, and families like the Amati (later teachers of Stradivari) began building the violins that would dominate for centuries.',
  },
  {
    label: 'Dance Music — The First Pop Music',
    detail:
      'The pavane, galliard, and other courtly dances were the popular music of the Renaissance. Written for entertainment rather than worship, they established the idea that music could simply be fun — an idea that would eventually produce everything from waltzes to EDM.',
  },
];

/* ── baroque data ─────────────────────────────────────────────────── */
const BAROQUE_TIMELINE: TimelineEntry[] = [
  {
    year: '1607',
    title: 'Monteverdi\'s L\'Orfeo — Opera Is Born',
    description:
      'Claudio Monteverdi\u2019s L\'Orfeo combined drama and music into a new art form: opera. The story of Orpheus descending to the underworld became the template for centuries of operatic storytelling. Drama + music = the most ambitious performance art ever created.',
    color: CRIMSON,
  },
  {
    year: '~1600–1700',
    title: 'Tonality Established — Major and Minor Keys',
    description:
      'The Baroque era replaced the old Greek modes with our current system of major and minor keys. This tonal system — where music "resolves" to a home key — is the harmonic language of virtually all Western music from Bach to Taylor Swift.',
    color: BAROQUE,
  },
  {
    year: '~1700',
    title: 'Cristofori Invents the Piano',
    description:
      'Bartolomeo Cristofori in Florence built the first "pianoforte" — an instrument that could play soft (piano) and loud (forte), unlike the harpsichord. This invention would become the most important instrument in Western music, central to composition, education, and performance.',
    color: STONE,
  },
];

const BAROQUE_FIGURES: FigureEntry[] = [
  {
    name: 'Johann Sebastian Bach',
    years: '1685–1750',
    contribution:
      'The supreme master of counterpoint who systematically explored every possibility of Western harmony. His Well-Tempered Clavier, Brandenburg Concertos, and Mass in B Minor are foundational works. Beethoven called him "the original father of harmony."',
  },
  {
    name: 'Antonio Vivaldi',
    years: '1678–1741',
    contribution:
      'Venetian priest whose "The Four Seasons" (1723) was the first major work of "program music" — instrumental music that tells a specific story. He wrote over 500 concertos and established the three-movement concerto form.',
  },
  {
    name: 'George Frideric Handel',
    years: '1685–1759',
    contribution:
      'German-born, London-based composer whose "Messiah" (1741) — written in just 24 days — remains one of the most performed choral works in history. Its "Hallelujah" chorus is sung at Christmas celebrations worldwide nearly 300 years later.',
  },
];

/* ── classical & romantic data ────────────────────────────────────── */
const CLASSICAL_ROMANTIC_TIMELINE: TimelineEntry[] = [
  {
    year: '~1750–1800',
    title: 'Classical Period — Clarity, Balance, Form',
    description:
      'Haydn and Mozart established the symphony, sonata, and concerto as the dominant forms. Music became about elegance, proportion, and structural beauty — a reaction against Baroque complexity. Haydn alone wrote 104 symphonies.',
    color: SKY,
  },
  {
    year: '~1800–1827',
    title: 'Beethoven Bridges Two Eras',
    description:
      'Ludwig van Beethoven began as a Classical composer and singlehandedly invented the Romantic style. His 9th Symphony — composed while almost completely deaf — expanded what music could express and remains the most famous symphony ever written.',
    color: CRIMSON,
  },
  {
    year: '~1830–1900',
    title: 'The Romantic Era — Emotion Unleashed',
    description:
      'Chopin\u2019s intimate piano poetry, Liszt\u2019s dazzling virtuosity, Brahms\u2019s structural depth, and Wagner\u2019s operatic universes. Music became a vehicle for extreme emotion, nationalist pride, and personal expression on an unprecedented scale.',
    color: ROSE,
  },
  {
    year: '~1850–1900',
    title: 'Music Becomes Democratic',
    description:
      'Public concert halls replaced aristocratic courts and churches as the primary venue for music. The piano entered middle-class homes. Music publishing boomed. For the first time, ordinary people could both hear and play great music.',
    color: GOLD,
  },
];

const CLASSICAL_ROMANTIC_FIGURES: FigureEntry[] = [
  {
    name: 'Wolfgang Amadeus Mozart',
    years: '1756–1791',
    contribution:
      'Child prodigy who composed from age 5. In just 35 years of life, he produced 41 symphonies, 27 piano concertos, 20+ operas (including The Magic Flute and Don Giovanni), and over 600 works total. His music defines the Classical ideal of beauty.',
  },
  {
    name: 'Ludwig van Beethoven',
    years: '1770–1827',
    contribution:
      'Bridged the Classical and Romantic periods. Went deaf beginning around age 30 but composed his greatest works — including the 9th Symphony and late string quartets — in near-total deafness. Transformed the composer from craftsman to artistic hero.',
  },
  {
    name: 'Richard Wagner',
    years: '1813–1883',
    contribution:
      'Created 6-hour operas as "total art works" (Gesamtkunstwerk), invented leitmotifs (recurring musical themes for characters and ideas), and built his own opera house at Bayreuth. His influence on music, film scoring, and theater is immeasurable.',
  },
  {
    name: 'Frédéric Chopin',
    years: '1810–1849',
    contribution:
      'The poet of the piano — wrote almost exclusively for the instrument and expanded its expressive possibilities beyond anything previously imagined. His nocturnes, études, and ballades remain the pinnacle of Romantic piano literature.',
  },
];

/* ── 20th century revolution data ─────────────────────────────────── */
const TWENTIETH_CENTURY_TIMELINE: TimelineEntry[] = [
  {
    year: '1877',
    title: 'Edison\'s Phonograph — Music Leaves the Room',
    description:
      'Thomas Edison\u2019s phonograph made music separable from live performance for the first time in human history. You no longer had to be present to hear music. This single invention changed everything — music became a commodity, a product, an industry.',
    color: STONE,
  },
  {
    year: '1920s',
    title: 'Radio — Music Enters Every Home',
    description:
      'Radio broadcast music simultaneously into millions of homes — the first mass media for music. It created shared national musical experiences and made stars of performers who had previously been known only in their local scenes.',
    color: AMBER,
  },
  {
    year: '1890s–1920s',
    title: 'Jazz — America\'s First Original Art Form',
    description:
      'Born in New Orleans from the collision of African American blues, ragtime, work songs, and European harmony. Jazz introduced improvisation as a core musical value — the idea that the performer creates in real-time. Louis Armstrong and Duke Ellington proved it was art.',
    color: JAZZ_BLUE,
  },
  {
    year: '~1900s',
    title: 'The Blues — Root of Everything',
    description:
      'From the Mississippi Delta came the blues — raw, emotional, built on a simple 12-bar structure. Every major popular music genre that followed — jazz, rock, R&B, hip-hop — has the blues in its DNA. It is the root of the American musical family tree.',
    color: BLUES,
  },
  {
    year: '1950s',
    title: 'Rock and Roll — The Big Bang',
    description:
      'Chuck Berry, Little Richard, and Fats Domino created rock and roll from blues, gospel, and boogie-woogie. When Elvis Presley brought Black American music to white radio, it triggered a cultural earthquake. Youth culture and popular music fused permanently.',
    color: CRIMSON,
  },
  {
    year: '1963–1970',
    title: 'The Beatles Transform Everything',
    description:
      'The most influential band in history sold 600 million+ albums and changed songwriting, studio production, album art, and the cultural weight of popular music. From "I Want to Hold Your Hand" to "A Day in the Life" in just 4 years — the fastest artistic evolution in music history.',
    color: INDIGO,
  },
  {
    year: '1960s',
    title: 'Bob Dylan — Lyrics as Literature',
    description:
      'Dylan proved song lyrics could be poetry — dense, allusive, politically charged, personally revelatory. He won the Nobel Prize in Literature in 2016, the first songwriter to do so. "Blowin\' in the Wind" and "Like a Rolling Stone" changed what songs could say.',
    color: FOREST,
  },
  {
    year: '1959–1970s',
    title: 'Motown — "The Sound of Young America"',
    description:
      'Berry Gordy created the first Black-owned mainstream record label in Detroit. Motown gave the world Marvin Gaye, Stevie Wonder, Diana Ross, The Temptations, and the Jackson 5. It proved Black artists could dominate pop charts and broke racial barriers in American entertainment.',
    color: GOLD,
  },
  {
    year: '1970s',
    title: 'Funk, Soul, and Disco',
    description:
      'James Brown invented funk — rhythm as the primary musical element. Soul music (Aretha Franklin, Otis Redding) combined gospel passion with secular lyrics. Disco became the first electronic-influenced dance music, linking the dance floor to the DJ booth.',
    color: PURPLE,
  },
  {
    year: '1973',
    title: 'Hip-Hop Is Born — DJ Kool Herc\'s Block Party',
    description:
      'At a back-to-school party in the South Bronx, DJ Kool Herc isolated and looped the "break" sections of funk records. From this technique grew an entire culture: DJing, rapping, breakdancing, and graffiti. Hip-hop is now the most consumed music genre on Earth.',
    color: ROSE,
  },
  {
    year: '1970s–1990s',
    title: 'Electronic Music — Machines Join the Band',
    description:
      'Synthesizers and drum machines created entirely new sounds. Kraftwerk, Brian Eno, and Giorgio Moroder pioneered electronic music, which branched into house (Chicago), techno (Detroit), ambient, and eventually EDM — music made without traditional instruments.',
    color: ELECTRIC,
  },
  {
    year: '1981',
    title: 'MTV — Video Kills the Radio Star',
    description:
      'Music Television made music visual. Artists now needed to look as good as they sounded. Michael Jackson\u2019s "Thriller" video (1983) proved music videos could be cinematic events. MTV transformed marketing, fashion, and the definition of a pop star.',
    color: SKY,
  },
  {
    year: '1991',
    title: 'Nirvana — Grunge Breaks Through',
    description:
      'Nirvana\u2019s "Nevermind" brought underground alternative rock to the mainstream, toppling hair metal and polished pop. Kurt Cobain became the reluctant voice of Generation X. The album proved authenticity could outsell spectacle.',
    color: STONE,
  },
];

const TWENTIETH_CENTURY_FIGURES: FigureEntry[] = [
  {
    name: 'Louis Armstrong',
    years: '1901–1971',
    contribution:
      'The first great jazz soloist — transformed jazz from ensemble music into a vehicle for individual expression. His trumpet playing and gravelly voice on "What a Wonderful World" made him one of the most recognizable musicians in history.',
  },
  {
    name: 'The Beatles',
    years: '1960–1970',
    contribution:
      '600 million+ albums sold. Evolved from pop craftsmen to avant-garde experimentalists in 7 years. Sgt. Pepper\'s, Abbey Road, and the White Album redefined what a rock album could be. Most covered artists of all time.',
  },
  {
    name: 'Bob Dylan',
    years: 'b. 1941',
    contribution:
      'Brought literary ambition to popular songwriting. "Blowin\' in the Wind," "The Times They Are A-Changin\'," and "Like a Rolling Stone" changed what songs could address. Won the Nobel Prize in Literature in 2016.',
  },
  {
    name: 'James Brown',
    years: '1933–2006',
    contribution:
      'The "Godfather of Soul" invented funk by making rhythm the dominant element over melody and harmony. His innovations — syncopation, the "one" beat, rhythmic vocals — directly shaped hip-hop, disco, and modern pop production.',
  },
  {
    name: 'Stevie Wonder',
    years: 'b. 1950',
    contribution:
      'Blind from infancy, Wonder became a multi-instrumentalist prodigy at Motown. His 1972–1976 run (Talking Book, Innervisions, Songs in the Key of Life) is the greatest sustained creative peak in popular music.',
  },
];

/* ── digital revolution data ──────────────────────────────────────── */
const DIGITAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1999',
    title: 'Napster — The Industry Collapses',
    description:
      'Shawn Fanning\u2019s peer-to-peer file sharing service let anyone download any song for free. Music industry revenue collapsed by 50% over the next decade. The entire economic model of recorded music — built on selling physical objects — was destroyed in a few years.',
    color: CRIMSON,
  },
  {
    year: '2003',
    title: 'iTunes — $0.99 Per Song',
    description:
      'Apple\u2019s iTunes Store offered the first legal, convenient digital music marketplace. Steve Jobs convinced record labels that people would pay for digital music if it was easy enough. The single replaced the album as the primary unit of consumption.',
    color: SLATE,
  },
  {
    year: '2005',
    title: 'YouTube — Anyone Can Post Music',
    description:
      'YouTube transformed music discovery. Artists no longer needed record labels to reach audiences. Justin Bieber was discovered on YouTube. "Gangnam Style" became the first video to reach 1 billion views. Music became inseparable from video.',
    color: ROSE,
  },
  {
    year: '2008',
    title: 'Spotify — Streaming as Subscription',
    description:
      'Spotify\u2019s all-you-can-listen model replaced ownership with access. Artists receive $0.003–0.005 per stream, meaning a song needs ~250,000 streams to earn a minimum wage month. The economics shifted power from artists to platforms.',
    color: FOREST,
  },
];

const DIGITAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Algorithm Problem',
    detail:
      'Streaming algorithms favor songs that are already popular, creating feedback loops that make popular music more homogeneous. Playlists curated by algorithms now drive more listening than human choice. The paradox: infinite choice, narrowing taste.',
  },
  {
    label: 'The Volume Paradox',
    detail:
      'More music is released per day now than in the entire 20th century combined. Over 100,000 tracks are uploaded to Spotify daily. But most are never heard even once. We have more music than ever and less shared musical culture than at any point in modern history.',
  },
  {
    label: 'Artists vs. Platforms',
    detail:
      'In the CD era, artists earned ~$1 per album sold. On streaming, they earn fractions of a cent per play. Live performance and merchandise have become the primary revenue sources. The recorded music industry recovered its revenue — but the money flows differently now.',
  },
];

/* ── world music data ─────────────────────────────────────────────── */
const WORLD_MUSIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Indian Classical Music Goes Global',
    detail:
      'Ravi Shankar introduced ragas to Western audiences in the 1960s, partly through his friendship with George Harrison of the Beatles. The sitar appeared on "Norwegian Wood" (1965), and Shankar performed at Monterey Pop and Woodstock, bridging two musical worlds.',
  },
  {
    label: 'African Roots — The Global Music Tree',
    detail:
      'African rhythmic traditions are foundational to jazz, blues, rock, R&B, hip-hop, and virtually all popular music. The polyrhythmic complexity of West African drumming, the call-and-response structure, and the blues scale all have African origins. The global music tree has African roots.',
  },
  {
    label: 'Latin Music — A Billion-Dollar Force',
    detail:
      'Salsa, bossa nova, reggaeton, and Latin pop became a $1 billion+ industry. Bad Bunny was the most-streamed artist on Spotify in 2020, 2021, and 2022 — singing entirely in Spanish. Latin music proved global audiences don\u2019t need English.',
  },
  {
    label: 'K-Pop — Algorithmic Perfection Meets Emotion',
    detail:
      'Korean pop music, led by BTS and BLACKPINK, became a global phenomenon through rigorous training systems, visual storytelling, and masterful social media engagement. K-pop represents Korean soft power — cultural influence through music rather than military or economic force.',
  },
];

/* ── sub-components ───────────────────────────────────────────────── */
function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.title}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: e.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.85rem', color: SLATE, fontWeight: 600 }}>{e.year}</span>
          </div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{e.title}</h4>
          <p style={{ fontSize: '0.9rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function InsightGrid({ entries }: { entries: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.label}
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
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>{e.label}</h4>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FigureGrid({ entries }: { entries: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.name}
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
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: FIGURE_COLORS[i % FIGURE_COLORS.length], margin: '0 0 2px' }}>
            {e.name}
          </h4>
          <p style={{ fontSize: '0.82rem', color: SLATE, margin: '0 0 8px' }}>{e.years}</p>
          <p style={{ fontSize: '0.88rem', color: ASH, lineHeight: 1.65, margin: 0 }}>{e.contribution}</p>
        </motion.div>
      ))}
    </div>
  );
}

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
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{icon}</span> {title}
        </h2>
        {intro && (
          <p style={{ fontSize: '0.93rem', color: ASH, lineHeight: 1.7, margin: '0 0 24px', maxWidth: 720 }}>{intro}</p>
        )}
      </motion.div>
      {children}
    </section>
  );
}

/* ── main page component ──────────────────────────────────────────── */
export default function MusicHistoryPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (root) root.style.overflow = 'hidden';
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Back link */}
        <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
          &larr; Back to Timeline
        </Link>

        {/* ── Hero ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ margin: '32px 0 40px' }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              lineHeight: 1.15,
              margin: '0 0 16px',
              background: `linear-gradient(135deg, ${GOLD}, ${ROSE}, ${INDIGO})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Universal Language — History of Music (60,000 BCE–Present)
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.7, maxWidth: 760, margin: '0 0 12px' }}>
            Every human culture has music — the only universal behavior besides language. From Neanderthal bone flutes
            to streaming algorithms, this is the story of humanity&apos;s most powerful shared experience: 60,000 years
            of rhythm, melody, and the unstoppable urge to make sound mean something.
          </p>
          <p style={{ fontSize: '0.93rem', color: ASH, lineHeight: 1.7, maxWidth: 760 }}>
            Music predates agriculture, writing, and civilization itself. It has started revolutions, defined generations,
            and connected strangers across every boundary humans have ever drawn. No other art form is so universal,
            so immediate, or so deeply woven into what it means to be human.
          </p>
        </motion.div>

        {/* ── Key Stats ───────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16, marginBottom: 48 }}>
          {KEY_STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
              style={{
                backgroundColor: `${s.color}12`,
                border: `1px solid ${s.color}33`,
                borderRadius: 10,
                padding: 18,
              }}
            >
              <p style={{ fontSize: '0.78rem', color: SLATE, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, margin: '0 0 4px' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, margin: '0 0 6px' }}>{s.value}</p>
              <p style={{ fontSize: '0.82rem', color: ASH, lineHeight: 1.55, margin: 0 }}>{s.context}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Era Timeline Callout ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${VINYL_GROOVE}18`,
            borderLeft: `3px solid ${VINYL_GROOVE}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 48,
          }}
        >
          <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
            &ldquo;Ancient &rarr; Medieval &rarr; Renaissance &rarr; Baroque &rarr; Classical &rarr; Jazz Age &rarr; Rock &rarr; Digital —
            each era didn&apos;t replace the last, it absorbed it. Bach lives in jazz harmony. African rhythms drive
            hip-hop. Gregorian chant echoes in ambient electronic. Music is the only art form that truly accumulates.&rdquo;
          </p>
        </motion.div>

        {/* ── 1. Origins of Music ─────────────────────────────────── */}
        <SectionWrapper
          id="origins"
          icon="🦴"
          title="The Origins of Music (50,000+ BCE)"
          accentColor={BONE}
          intro="Music is older than civilization, older than agriculture, possibly older than Homo sapiens itself. The earliest instruments found are bone flutes — but singing and clapping almost certainly came first, tens of thousands of years before anyone carved a hole in a bone."
        >
          <TimelineCard entries={ORIGINS_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid entries={ORIGINS_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── 2. Ancient Music ────────────────────────────────────── */}
        <SectionWrapper
          id="ancient"
          icon="🏛"
          title="Ancient Music (3000 BCE–500 CE)"
          accentColor={GOLD}
          intro="The ancient world gave music its theoretical foundation. Pythagoras proved harmony is math. The Greeks created the scales we still use. India and China developed parallel traditions of extraordinary sophistication — all independently."
        >
          <TimelineCard entries={ANCIENT_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 14px' }}>Key Traditions &amp; Figures</h3>
            <FigureGrid entries={ANCIENT_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── 3. Medieval Music ───────────────────────────────────── */}
        <SectionWrapper
          id="medieval"
          icon="⛪"
          title="Medieval Music (500–1400 CE)"
          accentColor={PURPLE}
          intro="The medieval period transformed music from oral tradition to written system. The Church dominated — but also preserved and developed music. Polyphony (multiple voices) was invented, notation was standardized, and secular song emerged from the courts of France."
        >
          <TimelineCard entries={MEDIEVAL_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <FigureGrid entries={MEDIEVAL_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── 4. Renaissance Music ────────────────────────────────── */}
        <SectionWrapper
          id="renaissance"
          icon="🎭"
          title="Renaissance Music (1400–1600)"
          accentColor={TEAL}
          intro="The printing press did for music what it did for literature — made it accessible. Polyphony reached its peak, secular music flourished, and instruments matured into the forms we recognize today. Music started being fun."
        >
          <TimelineCard entries={RENAISSANCE_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid entries={RENAISSANCE_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* ── 5. Baroque ──────────────────────────────────────────── */}
        <SectionWrapper
          id="baroque"
          icon="🎻"
          title='Baroque (1600–1750) — The First "Classical" Music'
          accentColor={BAROQUE}
          intro="Opera was invented. The major/minor key system replaced medieval modes. Bach organized all of Western harmony. Vivaldi told stories with instruments alone. And a Florentine harpsichord maker invented the piano — the instrument that would dominate the next 300 years."
        >
          <TimelineCard entries={BAROQUE_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <FigureGrid entries={BAROQUE_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── 6. Classical & Romantic ─────────────────────────────── */}
        <SectionWrapper
          id="classical-romantic"
          icon="🎹"
          title="Classical and Romantic (1750–1900)"
          accentColor={CRIMSON}
          intro="Mozart perfected elegance. Beethoven — deaf from 30 — shattered boundaries. Wagner built 6-hour operas. And music left the courts and churches for public concert halls, pianos in living rooms, and sheet music in every bookshop."
        >
          <TimelineCard entries={CLASSICAL_ROMANTIC_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <FigureGrid entries={CLASSICAL_ROMANTIC_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── Black American Music Callout ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${JAZZ_BLUE}18`,
            borderLeft: `3px solid ${JAZZ_BLUE}`,
            borderRadius: 8,
            padding: '20px 24px',
            margin: '0 0 8px',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: SKY, margin: '0 0 8px' }}>
            Black American Music as the Root of Popular Music
          </h3>
          <p style={{ fontSize: '0.93rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
            The blues begat jazz. Jazz begat swing. Swing begat R&amp;B. R&amp;B begat rock and roll. Rock begat
            everything from punk to metal. Funk begat disco begat house and techno. And hip-hop — born at a Bronx block
            party in 1973 — became the most consumed genre on Earth. Every major genre of popular music in the 20th and
            21st centuries traces back to Black American innovation. This is not an opinion — it is the documented history of sound.
          </p>
        </motion.div>

        {/* ── 7. 20th Century Revolution ──────────────────────────── */}
        <SectionWrapper
          id="twentieth-century"
          icon="🎸"
          title="The 20th Century Revolution"
          accentColor={ROSE}
          intro="Recording, radio, and amplification transformed music from something you attended into something that surrounded you. In 100 years, humanity went from the phonograph to Spotify — and created jazz, blues, rock, hip-hop, and electronic music along the way."
        >
          <TimelineCard entries={TWENTIETH_CENTURY_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 14px' }}>Defining Figures</h3>
            <FigureGrid entries={TWENTIETH_CENTURY_FIGURES} />
          </div>
        </SectionWrapper>

        {/* ── Beatles & Dylan Spotlight ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${INDIGO}18`,
            borderLeft: `3px solid ${INDIGO}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 8,
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: INDIGO, margin: '0 0 8px' }}>
            The 1960s Peak — Beatles and Dylan
          </h3>
          <p style={{ fontSize: '0.93rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
            Between 1963 and 1970, the Beatles and Bob Dylan raised popular music from entertainment to art. The Beatles
            proved a rock band could be as ambitious as any classical composer — Sgt. Pepper&apos;s is the most
            influential album ever made. Dylan proved a pop song could carry the weight of poetry. Together, they
            transformed a teenage diversion into the defining cultural force of the modern world. Nothing in popular
            music since has been untouched by their influence.
          </p>
        </motion.div>

        {/* ── 8. Digital Revolution ────────────────────────────────── */}
        <SectionWrapper
          id="digital-revolution"
          icon="💿"
          title="The Digital Revolution"
          accentColor={ELECTRIC}
          intro="Napster destroyed the old model. iTunes tried to rebuild it. Spotify replaced ownership with access. Today, more music exists than ever before — and less of it is heard. The economics of music have been inverted: the industry recovered, but the money flows to platforms, not artists."
        >
          <TimelineCard entries={DIGITAL_TIMELINE} />
          <div style={{ marginTop: 24 }}>
            <InsightGrid entries={DIGITAL_INSIGHTS} />
          </div>

          {/* Napster inflection callout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: `${CRIMSON}18`,
              borderLeft: `3px solid ${CRIMSON}`,
              borderRadius: 8,
              padding: '20px 24px',
              marginTop: 24,
            }}
          >
            <p style={{ fontSize: '0.93rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
              &ldquo;The Napster moment is the great inflection point: before it, music was a physical product you
              bought. After it, music became a digital service you accessed. The 60,000-year history of music had never
              seen a disruption this fast or this total. In a decade, the entire economic model collapsed and was
              rebuilt from scratch.&rdquo;
            </p>
          </motion.div>
        </SectionWrapper>

        {/* ── 9. World Music ──────────────────────────────────────── */}
        <SectionWrapper
          id="world-music"
          icon="🌍"
          title="World Music and Non-Western Traditions"
          accentColor={AMBER}
          intro="Western music history is only one thread. Indian ragas, African polyrhythms, Latin dance music, and K-pop represent parallel traditions of extraordinary depth — and in the 21st century, they are reshaping the global mainstream."
        >
          <InsightGrid entries={WORLD_MUSIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── 60,000 Years Framing ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundColor: `${GOLD}18`,
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: 8,
            padding: '20px 24px',
            marginBottom: 48,
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: GOLD, margin: '0 0 8px' }}>
            60,000 Years of Music in One Page
          </h3>
          <p style={{ fontSize: '0.93rem', color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
            If the history of music were compressed into a single 24-hour day, written notation wouldn&apos;t appear
            until 11:36 PM. The piano would be invented at 11:58 PM. Recording technology at 11:59:40 PM. Streaming in
            the final second before midnight. For 99.9% of music&apos;s history, the only way to hear music was to be
            in the room when someone played it. We are living in the most radical experiment in musical access ever
            conducted — and we have no idea how it will turn out.
          </p>
        </motion.div>

        {/* ── Continue the Story ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          style={{ padding: '48px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', margin: '0 0 16px' }}>
            Continue the Story
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/ancient-egypt', label: 'Ancient Egypt' },
              { to: '/renaissance', label: 'The Renaissance' },
              { to: '/american-revolution', label: 'The American Revolution' },
              { to: '/digital-revolution', label: 'The Digital Revolution' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: GOLD,
                  textDecoration: 'none',
                  backgroundColor: `${GOLD}15`,
                  border: `1px solid ${GOLD}33`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: '0.88rem',
                }}
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: SLATE, fontStyle: 'italic', margin: '0 0 16px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.65 }}>
            &ldquo;Music expresses that which cannot be said and on which it is impossible to be silent.&rdquo;
            <br />
            <span style={{ color: ASH, fontSize: '0.82rem' }}>— Victor Hugo</span>
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem' }}>
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
