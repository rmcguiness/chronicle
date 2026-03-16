/**
 * HistoryOfMusicPage — comprehensive deep-dive on the History of Music.
 *
 * Route: /history-of-music
 *
 * Sections:
 *  1. Hero — music as the universal language, 40,000+ year journey
 *  2. Ancient Music — bone flutes, drums, lyres, Sumerian hymns
 *  3. Greek & Roman Music Theory — Pythagoras, modes, ethos doctrine
 *  4. Medieval Sacred Music — Gregorian chant, polyphony, Hildegard von Bingen
 *  5. Renaissance — madrigals, lute, Palestrina, secular flowering
 *  6. Baroque — Bach, Handel, Vivaldi, opera, counterpoint
 *  7. Classical Era — Mozart, Haydn, Beethoven bridge, symphony orchestra
 *  8. Romantic — Beethoven, Chopin, Wagner, nationalism, virtuosity
 *  9. 20th Century Explosion — jazz, blues, rock & roll, electronic, hip-hop
 * 10. Digital Age — streaming, sampling, global fusion, AI
 * 11. Key Figures — composers and innovators across all eras
 * 12. Milestone Timeline — chronological landmarks
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const AMBER = '#d97706';
const GOLD = '#f59e0b';
const TERRACOTTA = '#c2410c';
const CRIMSON = '#dc2626';
const INDIGO = '#6366f1';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const EMERALD = '#10b981';
const SKY = '#38bdf8';
const FUCHSIA = '#d946ef';
const ORANGE = '#f97316';
const CORAL = '#fb7185';
const VIOLET = '#8b5cf6';
const LIME = '#84cc16';

// ─────────────────────────────────────────────────────────────────────────────
// Data types
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

// ─────────────────────────────────────────────────────────────────────────────
// Section Data
// ─────────────────────────────────────────────────────────────────────────────

// ── Ancient Music ──────────────────────────────────────────────────────────

const ANCIENT_MUSIC: InsightEntry[] = [
  {
    label: 'The Oldest Instruments (40,000+ BCE)',
    detail:
      'The oldest known musical instruments are bone flutes found in caves in present-day Germany and Slovenia, dating back over 40,000 years. Carved from vulture wing bones and mammoth ivory, these Paleolithic flutes could produce a five-note scale. They predate agriculture, cities, and writing by tens of thousands of years. Humans were making music before they were making bread. Percussion almost certainly came first — hand clapping, foot stamping, striking hollow logs — but these leave no archaeological trace. The bone flutes tell us that by the time Homo sapiens reached Europe, music was already sophisticated enough to require purpose-built instruments.',
  },
  {
    label: 'Drums: The Heartbeat of Civilization',
    detail:
      'Drums appear in virtually every culture on Earth and are likely the oldest class of instrument. The earliest confirmed drum — a clay frame drum from Moravia — dates to around 6000 BCE, but animal-skin stretched over hollow frames almost certainly predates it by millennia. In Mesopotamia, giant frame drums (balag) were central to temple worship. In sub-Saharan Africa, talking drums could reproduce the tonal patterns of spoken language, enabling communication across miles. The drum is not just rhythm — in many cultures it is the voice of the divine, the war signal, and the heartbeat of communal identity.',
  },
  {
    label: 'The Lyre and the Cradle of Civilization',
    detail:
      'The lyre — a stringed instrument with a wooden frame and strings of gut or silk — emerged in Sumer around 3200 BCE and became the defining instrument of the ancient Near East. The Royal Tombs of Ur (c. 2600 BCE) yielded stunningly crafted lyres decorated with gold and lapis lazuli, buried alongside their players in royal death pits. The lyre spread to Egypt, Greece, and Rome, becoming the instrument of poets, priests, and kings. In Greek mythology, Hermes invented the lyre from a tortoise shell and gave it to Apollo, god of music. The word "lyric" — as in lyric poetry — derives from the lyre.',
  },
  {
    label: 'The Hurrian Hymn No. 6 — Oldest Known Song (c. 1400 BCE)',
    detail:
      'The oldest surviving piece of written music is the Hurrian Hymn No. 6, a hymn to the goddess Nikkal, inscribed on a clay tablet found at the ancient city of Ugarit in present-day Syria. Dating to approximately 1400 BCE, it includes both lyrics and musical notation — tuning instructions for a nine-stringed lyre. Scholars have reconstructed the melody, though interpretations vary. The tablet proves that by the Late Bronze Age, musicians had developed a system for writing music down — that music was considered important enough to record, preserve, and transmit across generations.',
  },
  {
    label: 'Egyptian Music: The Soundtrack of Empire',
    detail:
      'Ancient Egypt had a rich musical culture spanning 3,000 years. Musicians held honored positions — some tomb paintings show female musicians performing at banquets, religious ceremonies, and royal processions. Instruments included the sistrum (a sacred rattle associated with the goddess Hathor), harps ranging from small handheld to massive floor-standing instruments, double-reed pipes (the ancestor of the oboe), and a wide variety of percussion. Temple musicians were organized into guilds, and music accompanied everything from harvest festivals to funerary rites. We know what their instruments looked like; we can only guess what they sounded like.',
  },
];

// ── Greek & Roman ──────────────────────────────────────────────────────────

const GREEK_ROMAN: InsightEntry[] = [
  {
    label: 'Pythagoras and the Mathematics of Music (c. 530 BCE)',
    detail:
      'According to legend, Pythagoras was walking past a blacksmith\'s shop when he noticed that hammers of different weights produced harmonious sounds when struck together. He investigated and discovered that musical intervals correspond to simple mathematical ratios: an octave is 2:1, a fifth is 3:2, a fourth is 4:3. This was a revolutionary insight — perhaps the first time anyone demonstrated that nature obeys mathematical laws. The Pythagorean discovery that beauty has a mathematical structure influenced Western philosophy, science, and music theory for over two thousand years. The "music of the spheres" — the idea that planetary orbits produce cosmic harmonies — comes directly from Pythagoras.',
  },
  {
    label: 'The Greek Modes — Emotional Architecture',
    detail:
      'The Greeks developed a sophisticated system of musical modes (harmoniai), each associated with specific emotional and moral qualities. The Dorian mode was considered noble and courageous — suitable for warriors. The Phrygian mode was passionate and ecstatic — associated with the worship of Dionysus. The Lydian mode was soft and sensual — Plato wanted to ban it from his ideal republic. The Mixolydian mode was mournful and contemplative. These modes were not just musical scales — they were believed to shape character. The Greek word "ethos" (character) was applied directly to music. This idea — that different musical structures produce different emotional effects — remains the foundation of Western music theory.',
  },
  {
    label: 'The Doctrine of Ethos — Music as Moral Force',
    detail:
      'Plato and Aristotle both argued that music had the power to shape the human soul. In "The Republic," Plato proposed strict censorship of music in his ideal state: only the Dorian and Phrygian modes should be permitted, because they cultivated courage and temperance. Soft, relaxing modes would weaken citizens. Aristotle was more permissive but equally convinced of music\'s power — he recommended different modes for education, recreation, and emotional catharsis. This doctrine of musical ethos influenced Western attitudes toward music for centuries: the persistent belief that certain kinds of music are morally uplifting or corrupting, from medieval church bans on certain intervals to modern moral panics over jazz, rock, and hip-hop.',
  },
  {
    label: 'Roman Musical Spectacle',
    detail:
      'Rome inherited Greek music theory but transformed music into spectacle. Romans favored loud, brassy instruments — the tuba (a straight bronze trumpet), the cornu (a curved horn), and the hydraulis (the first pipe organ, powered by water pressure). Music accompanied gladiatorial combat, chariot races, triumphal processions, and massive theatrical productions. The hydraulis, invented in Alexandria around 250 BCE, could fill an amphitheater with sound — it was the loudest instrument in the ancient world. Roman emperors competed to stage the most extravagant musical performances. Nero famously fancied himself a musician and allegedly performed while Rome burned (the fiddle had not yet been invented — he probably played the lyre or sang).',
  },
];

// ── Medieval Sacred Music ──────────────────────────────────────────────────

const MEDIEVAL_MUSIC: InsightEntry[] = [
  {
    label: 'Gregorian Chant — The Sound of Medieval Christianity',
    detail:
      'For nearly a thousand years, the dominant form of Western music was Gregorian chant: a single melodic line, sung in Latin, without harmony or accompaniment, by monks in stone monasteries. Named (perhaps falsely) after Pope Gregory I (c. 540–604), chant was not entertainment — it was prayer. The melodies were designed to carry sacred text, with gentle rises and falls that followed the natural rhythm of Latin prose. Chant was monophonic (one voice, one melody) and modal (using ancient scale systems rather than modern major/minor keys). Its austere beauty — reverberating through Romanesque vaults — created an otherworldly atmosphere that still defines our image of the medieval church. Over 3,000 Gregorian melodies survive.',
  },
  {
    label: 'The Invention of Musical Notation — Guido d\'Arezzo (c. 1000)',
    detail:
      'Before the 11th century, music was transmitted entirely by ear — monks memorized hundreds of chants through years of oral tradition. Then an Italian Benedictine monk named Guido d\'Arezzo revolutionized music by developing a system of staff notation: lines and spaces on which notes could be placed to indicate pitch. He also invented solfège — the do-re-mi system (originally ut-re-mi-fa-sol-la, derived from the first syllables of a Latin hymn to St. John the Baptist). For the first time, music could be written down precisely, learned from a page, and transmitted without a living teacher. This was as revolutionary for music as the printing press would later be for text. Without Guido, Western classical music as we know it could not exist.',
  },
  {
    label: 'The Birth of Polyphony — Organum (9th–12th Century)',
    detail:
      'Sometime in the 9th century, monks began experimenting with singing two different notes at the same time — a practice called organum. Initially, the second voice simply moved in parallel a fourth or fifth above the chant melody. But over the next three centuries, this simple technique evolved into something extraordinary: voices began moving independently, creating interweaving melodic lines. At Notre-Dame de Paris in the late 12th century, composers like Léonin and Pérotin created elaborate four-voice polyphonic works of astonishing complexity and beauty. This was the Big Bang of Western harmony — the moment music stopped being a single line and became a three-dimensional structure of simultaneous sounds.',
  },
  {
    label: 'Hildegard von Bingen (1098–1179) — Medieval Genius',
    detail:
      'Hildegard von Bingen was a German Benedictine abbess who was also a composer, mystic, philosopher, naturalist, and medical writer — the most remarkable polymath of the 12th century. She composed over 70 liturgical songs and the first known morality play set to music (Ordo Virtutum). Her compositions are extraordinary: wide-ranging melodies that soar and plunge across an unusually large vocal range, far more expressive and adventurous than standard Gregorian chant. She described her music as coming from divine visions. In 2012, Pope Benedict XVI named her a Doctor of the Church. Her music has experienced a modern revival — recordings of her compositions regularly appear on classical bestseller lists, 900 years after they were written.',
  },
  {
    label: 'Troubadours and the Birth of Secular Song (12th–13th Century)',
    detail:
      'While monks sang chant in monasteries, a parallel tradition of secular music flourished in the courts of southern France. The troubadours — poet-musicians of Occitania — invented the concept of courtly love and set it to music. They sang of unrequited longing, chivalric devotion, and the agony and ecstasy of romantic love — themes that would dominate Western popular music for the next 800 years. Troubadours like Bernart de Ventadorn and the Comtessa de Dia composed in the vernacular (Occitan, not Latin), performed with vielles (bowed strings) and lutes, and traveled from court to court. The troubadour tradition spread to Germany (Minnesänger), Italy, and Spain, establishing the singer-songwriter as a cultural archetype.',
  },
];

// ── Renaissance ────────────────────────────────────────────────────────────

const RENAISSANCE_MUSIC: InsightEntry[] = [
  {
    label: 'The Flowering of Polyphony — Josquin des Prez (c. 1450–1521)',
    detail:
      'The Renaissance brought polyphony to its peak. Josquin des Prez, a Franco-Flemish composer, was called the "master of the notes" by Martin Luther and is often considered the first great genius of Western music. His masses, motets, and chansons weave four to six independent vocal lines into textures of breathtaking beauty and emotional depth. Where medieval polyphony could be mechanical, Josquin made counterpoint expressive — the music served the text, painting individual words with matching melodic gestures. His influence was enormous: music printing (invented 1501) spread his works across Europe, making him the first composer whose fame was amplified by mass reproduction.',
  },
  {
    label: 'Palestrina and the Council of Trent',
    detail:
      'Giovanni Pierluigi da Palestrina (1525–1594) saved polyphony from destruction. The Catholic Counter-Reformation\'s Council of Trent (1545–1563) nearly banned complex polyphonic music from churches, arguing that intricate counterpoint made sacred texts unintelligible. According to legend, Palestrina composed his "Missa Papae Marcelli" to demonstrate that polyphony could be both beautiful and clear. Whether the legend is true or not, Palestrina\'s style — smooth, balanced, consonant, with text clarity paramount — became the gold standard of sacred music. For centuries, music students learned counterpoint by studying "Palestrina style." His influence on the rules of Western harmony is second only to Bach\'s.',
  },
  {
    label: 'The Madrigal — Music as Emotional Drama',
    detail:
      'The Italian madrigal (c. 1520–1620) was the laboratory of musical expression. These secular vocal pieces — usually for four to six unaccompanied voices — set Italian poetry to music with unprecedented attention to text painting: descending lines for sadness, dissonance for pain, rushing scales for excitement, silence for death. Composers like Monteverdi, Gesualdo, and Marenzio pushed harmonic language to extremes — Gesualdo\'s chromatic madrigals sound shockingly modern, with jarring dissonances that wouldn\'t become standard for 300 years. The madrigal tradition directly led to opera: Monteverdi\'s "L\'Orfeo" (1607), often called the first great opera, grew from his experience as a madrigal composer.',
  },
  {
    label: 'The Lute — Instrument of the Renaissance',
    detail:
      'If the lyre defined antiquity and the piano would define the Romantic era, the lute defined the Renaissance. This pear-shaped, plucked string instrument — descended from the Arabic oud (al-ʿūd, "the wood") — was the most popular instrument in Europe from roughly 1400 to 1650. Lute music ranged from simple song accompaniment to virtuosic solo works of extraordinary complexity. The lute was the instrument of the educated class — Henry VIII was an accomplished lutenist and composer. Lute tablature (a system of notation showing finger positions) made it accessible to amateurs, creating the first mass market for printed instrumental music. John Dowland\'s melancholy lute songs remain among the most beautiful works in the English musical tradition.',
  },
];

// ── Baroque ────────────────────────────────────────────────────────────────

const BAROQUE_MUSIC: TimelineEntry[] = [
  {
    year: '1607',
    title: 'The Birth of Opera — Monteverdi\'s "L\'Orfeo"',
    description:
      'Claudio Monteverdi\'s "L\'Orfeo," premiered in Mantua in 1607, is the earliest opera that is still regularly performed. The Florentine Camerata had attempted opera-like works in the 1590s, but Monteverdi transformed the concept from an academic experiment into visceral musical drama. The Orpheus myth — a musician who descends to the underworld to rescue his beloved — was the perfect subject for a new art form designed to show music\'s power over human emotion. Opera would become the most prestigious (and expensive) art form in Western culture for the next 300 years.',
    color: PURPLE,
  },
  {
    year: '1685–1750',
    title: 'Johann Sebastian Bach — The Supreme Architect',
    description:
      'Bach is to Western music what Shakespeare is to English literature: the figure against whom all others are measured. Working as a church musician in provincial German towns, he composed over 1,100 works — cantatas, fugues, concertos, passions, masses — of unsurpassed structural complexity and emotional depth. His "Well-Tempered Clavier" (48 preludes and fugues in all 24 major and minor keys) demonstrated the possibilities of equal temperament tuning and became the bible of keyboard music. His "Art of Fugue" and "Musical Offering" explore counterpoint with the rigor of mathematics and the beauty of poetry. Bach was relatively obscure in his lifetime; his rediscovery in the 19th century changed the course of music history.',
    color: GOLD,
  },
  {
    year: '1685–1759',
    title: 'George Frideric Handel — The Great Dramatist',
    description:
      'Born in the same year as Bach, Handel chose a completely different path: international fame, operatic spectacle, and public entertainment. German by birth, trained in Italy, and settled in London, Handel was the first truly international composer. His Italian operas dominated London\'s theaters; when opera fashion changed, he reinvented himself as the master of English oratorio. "Messiah" (1741) — composed in just 24 days — became the most performed choral work in history. King George II allegedly stood during the "Hallelujah" chorus at its London premiere, establishing a tradition that continues today. Handel was a rock star of his era: famous, wealthy, and buried in Westminster Abbey.',
    color: AMBER,
  },
  {
    year: '1678–1741',
    title: 'Vivaldi and the Italian Concerto',
    description:
      'Antonio Vivaldi, the "Red Priest" of Venice (so named for his red hair), composed over 500 concertos and essentially defined the three-movement concerto form: fast–slow–fast. His "Four Seasons" (c. 1720) — four violin concertos depicting spring, summer, autumn, and winter with vivid musical imagery — is arguably the most famous piece of classical music ever written and one of the earliest examples of program music (music that tells a story). Vivaldi taught at the Ospedale della Pietà, an orphanage for girls, whose orchestra became one of the finest in Europe. He proved that instrumental music alone — without words — could paint pictures and tell stories.',
    color: TERRACOTTA,
  },
  {
    year: 'c. 1600–1750',
    title: 'Counterpoint and the Figured Bass',
    description:
      'The Baroque era perfected two foundational techniques. Counterpoint — the art of combining multiple independent melodic lines — reached its apex in Bach\'s fugues, where three, four, or five voices chase each other through elaborate imitative patterns with mathematical precision and inexhaustible invention. Meanwhile, the figured bass (basso continuo) established the concept of chord progressions: a bass line with numbers indicating the harmonies above it, played by harpsichord and cello. This division between melody and harmonic accompaniment — a tune supported by chords — became the structural basis for virtually all Western music that followed, from Classical symphonies to pop songs.',
    color: INDIGO,
  },
];

// ── Classical Era ──────────────────────────────────────────────────────────

const CLASSICAL_ERA: InsightEntry[] = [
  {
    label: 'The Symphony Orchestra Takes Shape',
    detail:
      'The Classical era (c. 1750–1820) saw the modern orchestra emerge from the Baroque ensemble. The harpsichord continuo disappeared; the string section (violins, violas, cellos, basses) became the foundation, joined by pairs of woodwinds (flutes, oboes, clarinets, bassoons), brass (horns, trumpets), and timpani. This standardized ensemble — roughly 30–50 players — created a palette of timbres, dynamics, and textures far richer than anything before. The symphony itself became the supreme test of a composer\'s skill: four movements (fast–slow–minuet–fast) that could express a complete emotional journey in 30–45 minutes of pure instrumental music, without words, singers, or staging.',
  },
  {
    label: 'Joseph Haydn (1732–1809) — Father of the Symphony and String Quartet',
    detail:
      'Haydn virtually invented the symphony and the string quartet as we know them. Over 30 years as music director to the wealthy Esterházy family in rural Hungary, he composed 104 symphonies and 68 string quartets, constantly experimenting and refining. His genius was structural: he developed sonata form (exposition–development–recapitulation), the technique of thematic development (building an entire movement from a tiny musical idea), and a conversational texture where all four instruments in a quartet are equal partners. Haydn was the kindest, most generous, and most beloved of the great composers — Mozart called him "Papa Haydn" and Beethoven studied with him. He proved that great music could be created in isolation, through sheer craftsmanship and imagination.',
  },
  {
    label: 'Wolfgang Amadeus Mozart (1756–1791) — The Divine Prodigy',
    detail:
      'Mozart is the closest thing music has to a miracle. Composing from age 5, performing for European royalty at 6, writing his first opera at 12, he produced over 600 works in every genre — symphonies, concertos, operas, string quartets, piano sonatas, masses — and virtually every one is a masterpiece. His music combines effortless melodic beauty with profound structural sophistication; his operas ("The Marriage of Figaro," "Don Giovanni," "The Magic Flute") are psychologically complex dramas that remain at the core of the repertoire. He died at 35, impoverished and buried in an unmarked grave. What he might have composed in another 30 years is one of music\'s great unanswerable questions.',
  },
  {
    label: 'The Piano — The Instrument That Changed Everything',
    detail:
      'Bartolomeo Cristofori invented the piano (pianoforte, "soft-loud") around 1700, but it didn\'t become dominant until the Classical era. Unlike the harpsichord, which plucks strings at a fixed volume, the piano strikes strings with felt hammers — allowing the player to control dynamics from whisper to thunder with finger pressure alone. This made the piano the most expressive keyboard instrument ever built and the ideal vehicle for the Classical era\'s emphasis on contrast and nuance. By 1800, the piano had become the essential instrument of Western music — for composing, teaching, performing, and domestic entertainment. It remains so today. Every major composer from Mozart onward was, at minimum, a proficient pianist.',
  },
];

// ── Romantic ───────────────────────────────────────────────────────────────

const ROMANTIC_MUSIC: TimelineEntry[] = [
  {
    year: '1770–1827',
    title: 'Beethoven — The Bridge Between Two Worlds',
    description:
      'Ludwig van Beethoven is the pivot point of Western music history. His early works are Classical; his late works are Romantic; his final string quartets anticipate the 20th century. His Third Symphony ("Eroica," 1804) shattered Classical conventions with its unprecedented length, emotional intensity, and structural daring — it was a declaration of independence for the composer as individual voice, not servant of patrons. His Fifth Symphony\'s opening four notes are the most famous in all music. His Ninth Symphony introduced voices into the symphony for the first time. Most incredibly, he composed his greatest works — including the Ninth — while profoundly deaf, hearing the music only in his mind. He proved that music could express the full range of human experience: triumph, despair, rage, transcendence.',
    color: CRIMSON,
  },
  {
    year: '1810–1849',
    title: 'Chopin — Poet of the Piano',
    description:
      'Frédéric Chopin composed almost exclusively for solo piano — and in doing so, revealed the instrument\'s full expressive potential. His nocturnes, études, waltzes, polonaises, and ballades are at once technically demanding and deeply poetic, combining virtuosity with an intimacy that makes the listener feel they\'re overhearing a private confession. Polish by birth, exiled in Paris, he poured his longing for his occupied homeland into his polonaises and mazurkas, making him a national hero of Poland. He died of tuberculosis at 39. His music set the template for the piano recital — one performer, one instrument, alone on stage — as a form of artistic expression.',
    color: BLUE,
  },
  {
    year: '1813–1883',
    title: 'Wagner — The Total Work of Art',
    description:
      'Richard Wagner transformed opera into something unprecedented: the Gesamtkunstwerk ("total work of art"), fusing music, drama, poetry, and visual spectacle into a unified experience. His four-opera "Ring of the Nibelung" cycle (15+ hours of music) is the most ambitious artwork ever attempted. Wagner invented the leitmotif technique — associating musical themes with specific characters, objects, and ideas — which became the foundation of film scoring. His harmonic innovations, especially the "Tristan chord" (1859), pushed tonality to its breaking point and paved the way for modern music. He was also an unrepentant anti-Semite whose music was later adopted by the Nazi regime, making him the most morally controversial figure in music history.',
    color: PURPLE,
  },
  {
    year: '1840–1893',
    title: 'Tchaikovsky — The Heart on the Sleeve',
    description:
      'Pyotr Ilyich Tchaikovsky wrote music of overwhelming emotional directness — sweeping melodies, lush orchestration, and a willingness to wear his heart on his sleeve that made conservative critics wince and audiences weep. His three ballets ("Swan Lake," "The Nutcracker," "Sleeping Beauty") essentially created the modern ballet repertoire. His Piano Concerto No. 1 and Violin Concerto are among the most performed in history. His "1812 Overture" — complete with cannons and church bells — is the inevitable soundtrack to every American Fourth of July. He died under mysterious circumstances at 53, six days after the premiere of his Sixth Symphony ("Pathétique"), whose despairing final movement ends in silence.',
    color: ROSE,
  },
  {
    year: '19th Century',
    title: 'Musical Nationalism — The Voice of Peoples',
    description:
      'The Romantic era unleashed a wave of musical nationalism as composers across Europe drew on folk music, legends, and national history to forge distinctive national styles. Smetana and Dvořák in Bohemia, Grieg in Norway, Sibelius in Finland, Mussorgsky and Rimsky-Korsakov in Russia, Bartók in Hungary — each mined their country\'s folk traditions for melodies, rhythms, and harmonies that sounded nothing like the Austro-German mainstream. This was music as identity politics: Sibelius\'s "Finlandia" became an anthem of Finnish resistance against Russian rule. Nationalism gave the world some of its most distinctive and beloved orchestral music while demonstrating that the Western classical tradition had room for many voices, not just Viennese ones.',
    color: GREEN,
  },
];

// ── 20th Century ───────────────────────────────────────────────────────────

const TWENTIETH_CENTURY: TimelineEntry[] = [
  {
    year: '1890s–1920s',
    title: 'The Blues — America\'s Root Music',
    description:
      'The blues emerged from the African American experience in the Mississippi Delta: work songs, spirituals, field hollers, and the scars of slavery and sharecropping, distilled into a 12-bar form of devastating emotional power. W.C. Handy published "Memphis Blues" (1912) and "St. Louis Blues" (1914), bringing the form to a mass audience. Robert Johnson — who legend says sold his soul to the devil at a crossroads — recorded only 29 songs before dying at 27, yet those recordings became the DNA of rock, jazz, and R&B. The blues gave popular music its basic harmonic vocabulary (the I-IV-V progression), its emotional vocabulary (suffering transformed into art), and its call-and-response structure. Every genre that followed carries blues DNA.',
    color: INDIGO,
  },
  {
    year: '1920s–1960s',
    title: 'Jazz — America\'s Classical Music',
    description:
      'Jazz — born in New Orleans from the collision of African rhythms, blues, European harmony, and brass band tradition — is the most significant American contribution to world music. Louis Armstrong\'s Hot Five and Hot Seven recordings (1925–28) invented jazz soloing. Duke Ellington composed over 1,000 works that elevated jazz to an orchestral art form. Charlie Parker and Dizzy Gillespie created bebop in the 1940s — virtuosic, harmonically complex, intellectually demanding. Miles Davis reinvented himself (and jazz) every decade: cool jazz, modal jazz, jazz fusion. John Coltrane pushed improvisation to spiritual extremes. Jazz proved that improvisation — music created in the moment — could be as profound as the most carefully composed symphony.',
    color: AMBER,
  },
  {
    year: '1950s–1960s',
    title: 'Rock & Roll — The Revolution',
    description:
      'Rock and roll was a cultural earthquake. In the mid-1950s, Chuck Berry, Little Richard, and Elvis Presley fused blues, country, and gospel into a new sound — loud, rhythmic, sexually charged, and aimed squarely at teenagers. It horrified the establishment and electrified a generation. The Beatles (1960–70) proved rock could be art: "Sgt. Pepper\'s Lonely Hearts Club Band" (1967) transformed the album from a collection of singles into a unified artistic statement. Jimi Hendrix rewrote the rules of the electric guitar. The Rolling Stones channeled raw blues energy. Bob Dylan proved rock lyrics could be literature (Nobel Prize, 2016). By 1970, rock was the dominant cultural force on Earth.',
    color: CRIMSON,
  },
  {
    year: '1970s–1980s',
    title: 'Electronic Music — Machines as Instruments',
    description:
      'The synthesizer, developed by Robert Moog and others in the 1960s, created sounds no acoustic instrument could produce — and changed music forever. Kraftwerk (Germany) pioneered electronic pop with robotic precision and futuristic vision. Giorgio Moroder\'s production of Donna Summer\'s "I Feel Love" (1977) — built entirely on synthesizers and drum machines — invented electronic dance music. Brian Eno created ambient music. The Roland TR-808 drum machine (1980) and TB-303 bass synthesizer (1981) — both commercial failures — were adopted by hip-hop and electronic producers and became two of the most influential instruments in music history. Machines didn\'t replace musicians; they gave musicians new dimensions of sound.',
    color: TEAL,
  },
  {
    year: '1973–Present',
    title: 'Hip-Hop — The Voice of the Streets',
    description:
      'Hip-hop began at a block party in the South Bronx on August 11, 1973, when DJ Kool Herc used two turntables to loop the drum breaks from funk records, creating a continuous rhythm over which MCs could rap. From this street-corner innovation grew the most globally influential music culture since rock and roll. Grandmaster Flash invented turntable scratching. Run-D.M.C. bridged rap and rock. Public Enemy made hip-hop political. N.W.A. made it dangerous. Tupac and Biggie became tragic icons. Jay-Z, Kanye West, and Kendrick Lamar proved rap could be the dominant commercial and artistic force in popular music. Hip-hop is now a $10+ billion industry and the most-streamed genre worldwide.',
    color: ORANGE,
  },
  {
    year: '1970s–2000s',
    title: 'Punk, Metal, and the Fragmentation of Rock',
    description:
      'As mainstream rock grew bloated with stadium excess, punk stripped it back to three chords and raw fury. The Ramones, Sex Pistols, and The Clash (1976–79) proved anyone could start a band — skill was optional, attitude was mandatory. Punk spawned post-punk (Joy Division, Talking Heads), new wave (Blondie, Depeche Mode), and alternative rock (R.E.M., Nirvana). Meanwhile, Black Sabbath and Led Zeppelin spawned heavy metal, which evolved into thrash (Metallica), death metal, black metal, and dozens of subgenres — each louder and more extreme. By 2000, "rock" was not one genre but a constellation of tribes, each with its own sound, fashion, and ideology.',
    color: FUCHSIA,
  },
];

// ── Digital Age ────────────────────────────────────────────────────────────

const DIGITAL_AGE: InsightEntry[] = [
  {
    label: 'The MP3 and Napster — Music Becomes Free (1999–2001)',
    detail:
      'The MP3 compression format (1993) and Napster peer-to-peer file sharing (1999) did to the music industry what the asteroid did to the dinosaurs. Suddenly, any song ever recorded could be downloaded for free, and millions of people did exactly that. Global recorded music revenue collapsed from $23.8 billion in 1999 to $14.3 billion in 2014 — a 40% decline. Napster was shut down by lawsuits, but the genie was out of the bottle. The CD era was over. The music industry spent a decade suing its own customers before figuring out that the solution was not punishment but convenience. That solution arrived in 2008.',
  },
  {
    label: 'Streaming — The New Jukebox',
    detail:
      'Spotify launched in Sweden in 2008 and offered the music industry\'s salvation: unlimited, legal access to virtually all recorded music for a monthly fee (or free with ads). Apple Music, Amazon Music, YouTube Music, and Tidal followed. By 2024, streaming accounted for 67% of global recorded music revenue, which had recovered to over $28 billion — surpassing even the CD-era peak. But the economics are brutal for artists: a stream pays roughly $0.003–$0.005. A song needs over 250,000 streams to earn what a single CD sale once did. The top 1% of artists capture the vast majority of streaming revenue. Streaming saved the industry but may be starving the art.',
  },
  {
    label: 'Sampling, Remix, and Production Culture',
    detail:
      'Digital technology transformed music creation. A laptop with a $200 DAW (digital audio workstation) now contains more recording and production power than Abbey Road Studios had in 1969. Sampling — using fragments of existing recordings in new compositions — became a core creative technique, from hip-hop\'s chopped-up soul breaks to electronic music\'s layered soundscapes. Producers like Dr. Dre, Timbaland, Pharrell, and Max Martin became as important as the artists they worked with. Bedroom producers on SoundCloud and Bandcamp could reach global audiences without a record label. The democratization of music production is the most significant shift in music creation since the invention of notation.',
  },
  {
    label: 'Global Fusion — Music Without Borders',
    detail:
      'The internet erased musical borders. K-pop (BTS, BLACKPINK) became a global phenomenon, blending Korean pop with hip-hop, EDM, and R&B choreography. Reggaeton (Daddy Yankee, Bad Bunny) brought Latin rhythms to the top of global charts. Afrobeats (Burna Boy, Wizkid) carried West African grooves worldwide. Indian film music reached non-Indian audiences. Japanese city pop from the 1980s experienced a viral revival. The "world music" category — always patronizing — became obsolete because all music is now world music. A teenager in Lagos, São Paulo, or Jakarta has the same access to global music as one in New York, and their local sounds influence the global mainstream in real time.',
  },
  {
    label: 'AI and the Future of Music',
    detail:
      'In 2023–2024, AI music generation tools (Suno, Udio, Google\'s MusicLM) demonstrated the ability to create original songs — lyrics, melody, arrangement, vocals — from text prompts. The results range from mediocre to startlingly good. The implications are profound: if a machine can compose a credible pop song in 30 seconds, what is the value of human musical creativity? The music industry is grappling with copyright questions (can AI be trained on copyrighted songs?), authenticity questions (is AI-generated music "real" music?), and existential questions (will there still be professional musicians in 20 years?). Music has survived every technological disruption for 40,000 years. Whether it survives this one in a form we recognize remains an open question.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Pythagoras',
    years: 'c. 570–495 BCE',
    contribution:
      'Discovered the mathematical ratios underlying musical intervals — the octave (2:1), fifth (3:2), fourth (4:3). Established the revolutionary idea that beauty and nature obey mathematical laws.',
  },
  {
    name: 'Guido d\'Arezzo',
    years: 'c. 991–1033',
    contribution:
      'Invented staff notation and the solfège system (do-re-mi). Made it possible to write music down precisely and learn it without a teacher — the foundation of Western musical literacy.',
  },
  {
    name: 'Hildegard von Bingen',
    years: '1098–1179',
    contribution:
      'Benedictine abbess who composed over 70 liturgical works of extraordinary range and expressiveness. The most remarkable polymath of the medieval era; her music is still performed and recorded today.',
  },
  {
    name: 'Johann Sebastian Bach',
    years: '1685–1750',
    contribution:
      'The supreme architect of Western music. Over 1,100 works of unmatched contrapuntal complexity and emotional depth. The Well-Tempered Clavier, the Brandenburg Concertos, the Mass in B minor, the St. Matthew Passion.',
  },
  {
    name: 'Wolfgang Amadeus Mozart',
    years: '1756–1791',
    contribution:
      'Over 600 masterpieces in 35 years. Effortless melodic beauty, structural perfection, and psychologically complex operas. Composing from age 5, dead at 35 — the greatest natural talent in the history of music.',
  },
  {
    name: 'Ludwig van Beethoven',
    years: '1770–1827',
    contribution:
      'The pivot point of Western music history. Shattered Classical conventions, expanded the symphony from entertainment to personal statement, composed his greatest works while deaf. The Ninth Symphony changed what music could mean.',
  },
  {
    name: 'Louis Armstrong',
    years: '1901–1971',
    contribution:
      'Invented jazz soloing. His Hot Five and Hot Seven recordings transformed jazz from ensemble music to soloist-driven art. His trumpet playing and singing influenced virtually every popular music performer who followed.',
  },
  {
    name: 'Robert Johnson',
    years: '1911–1938',
    contribution:
      'Recorded only 29 songs before dying at 27, but those recordings are the Rosetta Stone of the blues. His guitar technique and emotional intensity made him the single most influential figure in the history of popular music.',
  },
  {
    name: 'The Beatles (Lennon, McCartney, Harrison, Starr)',
    years: '1960–1970',
    contribution:
      'Transformed rock from teenage entertainment into art. 12 studio albums in 7 years, each one breaking new ground. "Sgt. Pepper" invented the concept album. Their cultural impact is unmatched by any musical act before or since.',
  },
  {
    name: 'DJ Kool Herc',
    years: '1955–Present',
    contribution:
      'Jamaican-American DJ who invented hip-hop at a block party in the Bronx on August 11, 1973, by looping drum breaks on two turntables. That single innovation launched the most globally influential music culture of the late 20th century.',
  },
];

// ── Milestone Timeline ──────────────────────────────────────────────────────

const MILESTONES: TimelineEntry[] = [
  {
    year: 'c. 40,000 BCE',
    title: 'Oldest bone flutes carved',
    description: 'Paleolithic musicians in Europe craft five-note flutes from vulture wing bones and mammoth ivory — the earliest surviving instruments.',
    color: TERRACOTTA,
  },
  {
    year: 'c. 3200 BCE',
    title: 'The lyre emerges in Sumer',
    description: 'Stringed instruments appear in Mesopotamia; exquisite lyres are later buried in the Royal Tombs of Ur (c. 2600 BCE).',
    color: GOLD,
  },
  {
    year: 'c. 1400 BCE',
    title: 'Hurrian Hymn No. 6 — oldest written song',
    description: 'A clay tablet from Ugarit (Syria) preserves both lyrics and musical notation for a hymn to the goddess Nikkal.',
    color: AMBER,
  },
  {
    year: 'c. 530 BCE',
    title: 'Pythagoras discovers musical ratios',
    description: 'The octave = 2:1, the fifth = 3:2, the fourth = 4:3. Beauty has a mathematical structure.',
    color: INDIGO,
  },
  {
    year: 'c. 600 CE',
    title: 'Gregorian chant codified',
    description: 'Monophonic sacred song becomes the standard music of the Western church for the next thousand years.',
    color: PURPLE,
  },
  {
    year: 'c. 1000',
    title: 'Guido d\'Arezzo invents staff notation',
    description: 'For the first time, music can be precisely written, read, and transmitted without a living teacher.',
    color: TEAL,
  },
  {
    year: 'c. 1170',
    title: 'Polyphony at Notre-Dame de Paris',
    description: 'Léonin and Pérotin create elaborate multi-voice sacred works — the Big Bang of Western harmony.',
    color: BLUE,
  },
  {
    year: '1607',
    title: 'Monteverdi\'s "L\'Orfeo" — first great opera',
    description: 'Music, drama, and spectacle fused into a new art form that would dominate European culture for 300 years.',
    color: PURPLE,
  },
  {
    year: '1722',
    title: 'Bach\'s "Well-Tempered Clavier" Book I',
    description: '24 preludes and fugues in all major and minor keys — the bible of keyboard music and a demonstration of equal temperament.',
    color: GOLD,
  },
  {
    year: '1788',
    title: 'Mozart\'s final three symphonies',
    description: 'Symphonies 39, 40, and 41 ("Jupiter") — all composed in six weeks — represent the pinnacle of Classical era orchestral writing.',
    color: SKY,
  },
  {
    year: '1824',
    title: 'Beethoven\'s Ninth Symphony premiered',
    description: 'A deaf composer conducts the premiere of the most revolutionary symphony ever written. The "Ode to Joy" finale introduces voices into the symphony for the first time.',
    color: CRIMSON,
  },
  {
    year: '1877',
    title: 'Edison invents the phonograph',
    description: 'For the first time in human history, sound can be recorded and replayed. Music is no longer confined to the moment of performance.',
    color: EMERALD,
  },
  {
    year: '1925–1928',
    title: 'Louis Armstrong\'s Hot Five recordings',
    description: 'Jazz transforms from collective improvisation to soloist-driven art. Armstrong invents the modern concept of the virtuoso jazz musician.',
    color: AMBER,
  },
  {
    year: '1955',
    title: 'Chuck Berry\'s "Maybellene" — rock and roll arrives',
    description: 'Blues guitar + country rhythm + teenage lyrics = rock and roll. Popular music will never be the same.',
    color: CORAL,
  },
  {
    year: '1967',
    title: '"Sgt. Pepper\'s Lonely Hearts Club Band"',
    description: 'The Beatles prove rock can be art. The concept album is born. Studio experimentation becomes a creative tool.',
    color: VIOLET,
  },
  {
    year: '1973',
    title: 'DJ Kool Herc invents hip-hop',
    description: 'A block party in the South Bronx. Two turntables. Looped drum breaks. The birth of the most influential music culture since rock and roll.',
    color: ORANGE,
  },
  {
    year: '1977',
    title: '"I Feel Love" — electronic dance music born',
    description: 'Giorgio Moroder and Donna Summer build a hit entirely from synthesizers and drum machines. Brian Eno hears it and declares: "This is the sound of the future."',
    color: FUCHSIA,
  },
  {
    year: '1999',
    title: 'Napster launches — music goes digital',
    description: 'Peer-to-peer file sharing destroys the CD business model. The music industry will spend 15 years figuring out what comes next.',
    color: LIME,
  },
  {
    year: '2008',
    title: 'Spotify launches — streaming era begins',
    description: 'All the world\'s music, on demand, for a monthly fee. The industry is saved — though most artists will barely see the money.',
    color: GREEN,
  },
];

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
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: accentColor,
            marginBottom: 12,
          }}
        >
          {icon} {title}
        </h2>
        <p
          style={{
            color: ASH,
            lineHeight: 1.7,
            maxWidth: 800,
            marginBottom: 28,
          }}
        >
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
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          style={{
            borderLeft: `3px solid ${e.color}`,
            paddingLeft: 18,
            paddingTop: 4,
            paddingBottom: 4,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: e.color,
              marginRight: 8,
              verticalAlign: 'middle',
            }}
          />
          <p
            style={{
              display: 'inline',
              color: e.color,
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {e.year}
          </p>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#f1f5f9',
              marginTop: 4,
              marginBottom: 6,
            }}
          >
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
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
          <h4
            style={{
              fontWeight: 600,
              color: '#f1f5f9',
              marginBottom: 8,
              fontSize: '1rem',
            }}
          >
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

const FIGURE_COLORS = [GOLD, INDIGO, PURPLE, CRIMSON, SKY, AMBER, TEAL, ORANGE, ROSE, GREEN];

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}
    >
      {figures.map((f, i) => (
        <motion.div
          key={i}
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
          <h4
            style={{
              fontWeight: 600,
              color: FIGURE_COLORS[i % FIGURE_COLORS.length],
              marginBottom: 2,
              fontSize: '1.05rem',
            }}
          >
            {f.name}
          </h4>
          <p
            style={{
              fontSize: '0.8rem',
              color: SLATE,
              marginBottom: 8,
            }}
          >
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

export default function HistoryOfMusicPage() {
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
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div style={{ paddingTop: 28 }}>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
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
              background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The History of Music — 40,000 Years of the Universal Language
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p
              style={{
                color: ASH,
                lineHeight: 1.8,
                fontSize: '1.05rem',
                maxWidth: 800,
                marginBottom: 16,
              }}
            >
              Before humans invented writing, agriculture, or the wheel, they
              made music. Bone flutes from 40,000 years ago prove that our
              ancestors were crafting instruments before they were crafting
              civilization. Music is not a luxury that arrived after survival was
              secured — it is woven into the foundation of what it means to be
              human.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              From Sumerian hymns etched in clay to Bach fugues penned by
              candlelight to beats assembled on laptops in bedrooms, the story
              of music is the story of human creativity — pushing against the
              limits of what sound can express. Every generation has declared
              that the next generation's music isn't really music. Every
              generation has been wrong.
            </p>
          </motion.div>
        </header>

        {/* ── Ancient Music ───────────────────────────────────────────── */}
        <SectionWrapper
          id="ancient"
          icon="🦴"
          title="Ancient Music — Before Written History (40,000 BCE – 500 BCE)"
          accentColor={TERRACOTTA}
          intro="Music predates civilization itself. For tens of thousands of years before anyone wrote a note down, humans were singing, drumming, and carving instruments from bone and wood. The oldest surviving instruments are older than agriculture, older than pottery, older than any building on Earth. Music is not something civilization produced — it is something that helped produce civilization."
        >
          <InsightGrid items={ANCIENT_MUSIC} />
        </SectionWrapper>

        {/* ── Greek & Roman ───────────────────────────────────────────── */}
        <SectionWrapper
          id="greek-roman"
          icon="🏛️"
          title="Greek & Roman Music Theory — The Birth of Musical Thinking (500 BCE – 400 CE)"
          accentColor={INDIGO}
          intro="The Greeks didn't just play music — they thought about music. They asked: Why do some combinations of notes sound beautiful and others ugly? What is the relationship between music and mathematics? Can music shape moral character? Their answers — grounded in ratios, modes, and the doctrine of ethos — became the theoretical foundation on which 2,500 years of Western music would be built."
        >
          <InsightGrid items={GREEK_ROMAN} />
        </SectionWrapper>

        {/* ── Medieval Sacred Music ───────────────────────────────────── */}
        <SectionWrapper
          id="medieval"
          icon="⛪"
          title="Medieval Sacred Music — Chant, Polyphony, and the Birth of Notation (500 – 1400)"
          accentColor={PURPLE}
          intro="For a thousand years, the church was the conservatory, the concert hall, and the recording studio. Gregorian chant gave Western music its melodic vocabulary. The invention of staff notation made it possible to write music down. And the discovery of polyphony — multiple independent voices singing simultaneously — was the Big Bang of Western harmony, the moment music became a three-dimensional art."
        >
          <InsightGrid items={MEDIEVAL_MUSIC} />
        </SectionWrapper>

        {/* ── Renaissance ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="renaissance"
          icon="🎭"
          title="Renaissance Music — The Secular Flowering (1400 – 1600)"
          accentColor={TEAL}
          intro="The Renaissance brought music out of the monastery and into the court, the drawing room, and the printing press. Polyphony reached its peak of expressive beauty. The madrigal turned music into emotional drama. The lute became the most popular instrument in Europe. And for the first time, thanks to music printing, a composer's work could be mass-produced and distributed across the continent."
        >
          <InsightGrid items={RENAISSANCE_MUSIC} />
        </SectionWrapper>

        {/* ── Baroque ─────────────────────────────────────────────────── */}
        <SectionWrapper
          id="baroque"
          icon="🎻"
          title="The Baroque Era — Grandeur, Genius, and the Birth of Opera (1600 – 1750)"
          accentColor={GOLD}
          intro="The Baroque era gave us opera, the concerto, the fugue, and three of the greatest composers who ever lived. It was an age of extravagance and complexity — music as architecture, built from interlocking voices and ornamented surfaces. Bach perfected counterpoint. Handel conquered London. Vivaldi made the violin sing. And the figured bass established the chord-progression foundation that all Western music still uses today."
        >
          <TimelineCard entries={BAROQUE_MUSIC} />
        </SectionWrapper>

        {/* ── Classical Era ───────────────────────────────────────────── */}
        <SectionWrapper
          id="classical"
          icon="🎹"
          title="The Classical Era — Clarity, Balance, and the Symphony (1750 – 1820)"
          accentColor={SKY}
          intro="After Baroque complexity came Classical clarity. The ornament was stripped away; the harpsichord gave way to the piano; the modern orchestra took shape. Haydn invented the symphony and string quartet as art forms. Mozart achieved perfection in every genre. And the piano — capable of whisper and thunder — became the most important instrument in Western music. This was the era of form, proportion, and the belief that music's highest purpose was beauty."
        >
          <InsightGrid items={CLASSICAL_ERA} />
        </SectionWrapper>

        {/* ── Romantic ────────────────────────────────────────────────── */}
        <SectionWrapper
          id="romantic"
          icon="🌹"
          title="The Romantic Era — Passion, Nationalism, and the Cult of the Composer (1820 – 1900)"
          accentColor={CRIMSON}
          intro="The Romantics shattered Classical restraint and replaced it with raw emotion, superhuman virtuosity, and the belief that the composer was not a craftsman but a prophet. Beethoven — deaf, defiant, titanic — set the template. Chopin made the piano weep. Wagner fused music and drama into a total art form. Orchestras doubled in size. Concerts became quasi-religious experiences. And composers across Europe drew on folk music to forge national identities through sound."
        >
          <TimelineCard entries={ROMANTIC_MUSIC} />
        </SectionWrapper>

        {/* ── 20th Century ───────────────────────────────────────────── */}
        <SectionWrapper
          id="twentieth-century"
          icon="🎸"
          title="The 20th Century — The Great Explosion (1900 – 2000)"
          accentColor={ORANGE}
          intro="The 20th century produced more musical innovation than the previous 40,000 years combined. The blues emerged from the Mississippi Delta and became the root system of all modern popular music. Jazz proved improvisation could be art. Rock and roll was a cultural earthquake. Electronic instruments created sounds no one had ever heard. Hip-hop turned turntables into instruments and the producer into an auteur. By the century's end, music had splintered into hundreds of genres — and they were all talking to each other."
        >
          <TimelineCard entries={TWENTIETH_CENTURY} />
        </SectionWrapper>

        {/* ── Digital Age ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="digital-age"
          icon="💻"
          title="The Digital Age — Streaming, Sampling, and the Sound of Now (2000 – Present)"
          accentColor={EMERALD}
          intro="The 21st century did to music distribution what the printing press did to books — and then went further. Napster destroyed the CD business model. Spotify rebuilt it. A laptop became a recording studio. Bedroom producers reached global audiences. K-pop, reggaeton, and Afrobeats proved that musical influence now flows in every direction. And AI raises the question no one is ready to answer: what happens when machines can compose?"
        >
          <InsightGrid items={DIGITAL_AGE} />
        </SectionWrapper>

        {/* ── Key Figures ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures — Composers and Innovators Across 2,500 Years"
          accentColor={GOLD}
          intro="Music history is shaped by individuals whose genius, vision, or sheer audacity changed what music could be. From Pythagoras hearing mathematics in a blacksmith's hammers to DJ Kool Herc looping drum breaks at a Bronx block party, these are the people who bent the arc of sound."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Milestone Timeline ──────────────────────────────────────── */}
        <SectionWrapper
          id="milestones"
          icon="📅"
          title="Milestone Timeline — 40,000 Years in Landmarks"
          accentColor={VIOLET}
          intro="A chronological journey through the moments that changed music forever — from the first carved flute to the first AI-generated song."
        >
          <TimelineCard entries={MILESTONES} />
        </SectionWrapper>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 0 48px',
            marginTop: 24,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: SLATE,
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: '0 auto 20px',
              fontStyle: 'italic',
            }}
          >
            "Music is the shorthand of emotion."
            — Leo Tolstoy
          </p>
          <Link
            to="/"
            style={{
              color: '#60a5fa',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
