/**
 * ArtHistoryPage — comprehensive deep-dive on the History of Western Art.
 *
 * Route: /art-history
 *
 * Sections:
 *  1. Hero — 35,000 BCE to present overview
 *  2. Prehistoric Art — cave paintings, Venus figurines
 *  3. Ancient Art — Egyptian, Greek, Roman
 *  4. Medieval Art — Byzantine, Romanesque, Gothic
 *  5. Renaissance — linear perspective, Leonardo, Michelangelo, Raphael, Northern Renaissance
 *  6. Baroque — Caravaggio, Rembrandt, Vermeer, Rubens, Bernini
 *  7. 18th Century — Rococo to Neoclassicism
 *  8. 19th Century — Romanticism, Realism, Impressionism, Post-Impressionism
 *  9. 20th Century — Expressionism, Cubism, Surrealism, Abstract Expressionism, Pop Art, Minimalism
 * 10. Contemporary — street art, digital, photography
 * 11. Key Figures — 25+ artists
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const OCHRE = '#c2703e';
const GOLD = '#f59e0b';
const LAPIS = '#2563eb';
const CRIMSON = '#dc2626';
const OLIVE = '#6b7a2e';
const TEAL = '#14b8a6';
const PURPLE = '#a855f7';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const AMBER = '#d97706';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const SLATE = '#64748b';
const VERMILLION = '#e74c3c';
const ULTRAMARINE = '#3b82f6';
const SIENNA = '#a0522d';
const EMERALD = '#10b981';

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

// ── Prehistoric Art ─────────────────────────────────────────────────────────

const PREHISTORIC_INSIGHTS: InsightEntry[] = [
  {
    label: 'Chauvet Cave (c. 35,000 BCE)',
    detail:
      'Discovered in 1994 in southern France, Chauvet contains the oldest known figurative cave paintings. Lions, rhinoceroses, mammoths, and horses are rendered with astonishing sophistication — dynamic poses, shading, even a sense of perspective. These were not crude scratches by "primitive" people. The artists understood anatomy, movement, and composition. Some images appear to show motion sequences, like proto-animation. Chauvet demolishes the idea that art evolved gradually from simple to complex; the earliest art we have found is already masterful.',
  },
  {
    label: 'Lascaux Cave (c. 17,000 BCE)',
    detail:
      'Called the "Sistine Chapel of Prehistory," Lascaux in southwestern France contains over 600 paintings and 1,500 engravings of animals — horses, aurochs, deer, ibex — in vivid reds, yellows, and blacks made from mineral pigments. The Hall of the Bulls features animals up to 17 feet long. Scaffolding marks on the walls show the artists built platforms to reach the ceiling. The caves were clearly not casual doodles but carefully planned, communal artistic projects. Why? Theories range from hunting magic to shamanistic ritual to pure storytelling.',
  },
  {
    label: 'Venus Figurines (35,000–11,000 BCE)',
    detail:
      'Across Europe and into Siberia, prehistoric people carved small female figures with exaggerated breasts, hips, and stomachs — the so-called "Venus figurines." The most famous, the Venus of Willendorf (c. 25,000 BCE), is only 4.4 inches tall. Were these fertility symbols? Self-portraits by women? Idealized body types? Religious icons? We don\'t know. But their wide geographic distribution — from France to Siberia — suggests a shared symbolic system across vast distances, long before writing or organized religion.',
  },
  {
    label: 'What Cave Art Tells Us About Early Minds',
    detail:
      'The existence of art 35,000+ years ago tells us something profound: these humans had symbolic thinking, abstract representation, aesthetic sensibility, and the ability to plan complex creative projects. They mixed pigments from minerals, used animal fat as binders, created brushes from moss and hair, and blew pigment through hollow bones to create spray effects. They chose specific cave locations with natural acoustics — suggesting these were multimedia experiences combining visual art with sound. Art was not a luxury that came after survival; it was central to what made us human.',
  },
];

// ── Ancient Art: Egyptian ──────────────────────────────────────────────────

const EGYPTIAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Art as Religious Function',
    detail:
      'Egyptian art was not made to be admired — it was made to function. Tomb paintings and sculptures existed to serve the dead in the afterlife. Every image followed strict rules: figures were shown in composite view (head in profile, eye from the front, torso facing forward, legs in profile) not because Egyptians couldn\'t draw realistically, but because this view showed the maximum amount of the body, ensuring the ka (spirit) could use it in the afterlife. Art was magic, not decoration.',
  },
  {
    label: 'The Bust of Nefertiti (c. 1345 BCE)',
    detail:
      'Created by the sculptor Thutmose, the painted limestone bust of Queen Nefertiti is one of the most famous works of ancient art. Found in 1912 in Thutmose\'s workshop at Amarna, it shows a level of naturalistic beauty extraordinary for Egyptian art — likely because it was created during the Amarna period under Akhenaten, when artistic conventions were briefly loosened. The bust was never meant to be displayed; it was a sculptor\'s model. It now sits in Berlin\'s Neues Museum, and Egypt has demanded its return for over a century.',
  },
  {
    label: 'Hieroglyphs: Where Writing Met Art',
    detail:
      'Egyptian hieroglyphs were simultaneously a writing system and an art form. Each glyph was a miniature picture — an owl, a reed, a seated man — and scribes took immense care in their rendering. In tombs and temples, hieroglyphs were integrated seamlessly with pictorial scenes, creating compositions where text and image were indistinguishable. This fusion of word and image lasted for 3,000 years and was one of the longest-lived artistic traditions in human history.',
  },
  {
    label: 'The Great Sphinx and Monumental Sculpture',
    detail:
      'The Great Sphinx of Giza (c. 2500 BCE) — 240 feet long and 66 feet high, carved from a single limestone ridge — represents the pharaoh Khafre as a human-headed lion guarding his pyramid. Egyptian sculpture operated on the principle that bigger = more powerful. Colossal statues of pharaohs lined temple approaches, establishing divine authority through sheer scale. The tradition of monumental public sculpture as political statement begins here.',
  },
];

// ── Ancient Art: Greek ──────────────────────────────────────────────────────

const GREEK_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Idealized Human Form',
    detail:
      'Greek art pursued "kalos kagathos" — the beautiful and the good — the idea that physical perfection reflected moral virtue. Sculptors like Polykleitos created mathematical systems of ideal proportions (the Canon), where the head was 1/7 of total height, the face divided into perfect thirds. Greek statues were not portraits of real people but visions of what humans should be. This obsession with idealized human beauty would dominate Western art for 2,000 years and still shapes our aesthetic expectations.',
  },
  {
    label: 'From Archaic to Classical: Art Learns to Move',
    detail:
      'Early Greek sculpture (Archaic period, 700–480 BCE) featured stiff, frontal figures with fixed "archaic smiles" — clearly influenced by Egyptian art. Then something revolutionary happened. Over just a few generations, Greek sculptors discovered contrapposto — the natural shift of weight to one leg that makes a figure look alive. The Kritios Boy (c. 480 BCE) is the first known statue to stand naturally. From that moment, Western sculpture was fundamentally different from anything that came before.',
  },
  {
    label: 'Red-Figure Pottery: Narrative on Clay',
    detail:
      'Greek red-figure pottery (developed c. 530 BCE in Athens) reversed the earlier black-figure technique: instead of painting figures in black slip, artists painted the background black and left figures in the natural red color of the clay, adding details with fine brushwork. This allowed far more detail, expression, and anatomical accuracy. These vases depicted mythology, daily life, athletic competitions, and symposia (drinking parties), providing our richest visual record of Greek life.',
  },
  {
    label: 'The Parthenon Frieze: Art as Civic Religion',
    detail:
      'The Parthenon (447–432 BCE), designed by architects Iktinos and Kallikrates with sculptural program by Phidias, represents the pinnacle of Classical Greek art. Its 524-foot frieze depicted the Panathenaic procession — ordinary Athenian citizens alongside gods, an extraordinary claim that democratic Athens deserved divine company. The Elgin Marbles, removed by Lord Elgin in 1801–12, remain in the British Museum despite Greece\'s ongoing demand for their return — one of the art world\'s longest-running controversies.',
  },
];

// ── Ancient Art: Roman ──────────────────────────────────────────────────────

const ROMAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Veristic Portraiture: Warts and All',
    detail:
      'Where Greek art idealized, Roman art documented. Roman portrait busts in the Republican period were ruthlessly realistic — wrinkled, balding, battle-scarred. This "verism" was a statement of Roman values: a man\'s worth was shown by his experience, not his beauty. The tradition of realistic portraiture as a record of individual identity — rather than an ideal type — begins with Rome and runs straight through to photography.',
  },
  {
    label: 'Art as Imperial Propaganda',
    detail:
      'Augustus (r. 27 BCE–14 CE) transformed Roman art into a propaganda machine. His Prima Porta statue shows him as eternally youthful, in the pose of a Greek god, with Cupid at his feet claiming divine descent from Venus. Triumphal arches, columns (Trajan\'s Column tells a 625-foot spiral story of military conquest), and public buildings projected power across an empire of 60 million people. Rome invented art as political branding on a civilizational scale.',
  },
  {
    label: 'Mosaics and Frescoes: Art for Living',
    detail:
      'The eruption of Vesuvius in 79 CE preserved the homes of Pompeii and Herculaneum with their original decoration intact. These houses reveal a Roman world drenched in art: mosaic floors depicting everything from guard dogs to Alexander the Great in battle, wall frescoes creating illusions of gardens and architectural spaces, and ceiling decorations of mythological scenes. Art was not reserved for temples and palaces — even middle-class Romans lived surrounded by images.',
  },
  {
    label: 'Architecture as Art: The Pantheon',
    detail:
      'The Pantheon in Rome (c. 125 CE), rebuilt under Hadrian, remains the world\'s largest unreinforced concrete dome nearly 2,000 years after its construction. Its perfect geometry — the interior height equals the diameter (142 feet) — and the oculus (27-foot open eye in the ceiling) that tracks sunlight across the interior create one of the most sublime architectural experiences ever conceived. Michelangelo said it was designed by angels, not men.',
  },
];

// ── Medieval Art: Byzantine ─────────────────────────────────────────────────

const MEDIEVAL_TIMELINE: TimelineEntry[] = [
  {
    year: '330–1453 CE',
    title: 'Byzantine Art: Sacred Flatness',
    description:
      'Byzantine art — flat, gold-background icons with enormous staring eyes and no attempt at perspective or natural proportion — looks "primitive" to modern eyes. It was anything but. Byzantine artists deliberately rejected naturalism because physical reality was considered inferior to spiritual truth. The gold background represented divine light, not ignorance of spatial depth. The frontal, hieratic figures were designed for direct spiritual communion between viewer and saint. When the icon controversy of the 8th–9th century nearly destroyed all religious images, defenders argued icons were windows to heaven itself. The greatest surviving works — the Hagia Sophia mosaics in Istanbul, the icons of Mount Sinai — are stunning in their spiritual intensity.',
    color: GOLD,
  },
  {
    year: '1000–1200 CE',
    title: 'Romanesque: Stone Bibles',
    description:
      'Romanesque art served an illiterate congregation. Heavy stone churches with thick walls and round arches were covered with carved tympana (semicircular panels above doorways) depicting the Last Judgment — Christ in Majesty surrounded by the saved and the damned — to remind worshippers of what awaited them. The carved capitals of columns told biblical stories, and the architecture itself was symbolic: the cruciform floor plan represented Christ\'s body, the east-facing apse pointed toward Jerusalem. Every element was a teaching tool. Autun Cathedral\'s Last Judgment tympanum by Gislebertus (c. 1130) is a masterpiece of Romanesque terror — writhing demons drag sinners to hell with gleeful energy.',
    color: SIENNA,
  },
  {
    year: '1150–1400 CE',
    title: 'Gothic: Light as Theology',
    description:
      'The Gothic revolution was an engineering breakthrough that transformed art. Pointed arches, ribbed vaults, and flying buttresses transferred structural weight to external supports, allowing walls to become enormous windows. Abbot Suger of Saint-Denis (c. 1140) provided the theology: light was the physical manifestation of God, and stained glass transformed sunlight into divine radiance. Chartres Cathedral\'s 176 stained glass windows — the "poor man\'s Bible" — tell the story of salvation in 10,000 square feet of colored light. Meanwhile, illuminated manuscripts like the Très Riches Heures of the Duke of Berry (c. 1412–16) achieved a jewel-like perfection that still astonishes.',
    color: LAPIS,
  },
];

// ── Renaissance ─────────────────────────────────────────────────────────────

const RENAISSANCE_TIMELINE: TimelineEntry[] = [
  {
    year: 'c. 1420',
    title: 'Linear Perspective: The Revolution',
    description:
      'In 1420, Filippo Brunelleschi demonstrated one-point linear perspective by painting the Baptistery of Florence on a panel and proving — with mirrors — that his image perfectly matched reality. His friend Leon Battista Alberti codified the system in "De Pictura" (1435). For the first time in history, artists could create mathematically accurate illusions of three-dimensional space on a flat surface. This was not a gradual evolution — it was a rupture. Within a generation, every serious Italian painter adopted perspective. The flat sacred world of medieval art was replaced by a measurable, rational space in which human figures occupied real rooms with real depth. Art would never be the same.',
    color: OCHRE,
  },
  {
    year: '1452–1519',
    title: 'Leonardo da Vinci: The Universal Genius',
    description:
      'Leonardo invented sfumato — the technique of applying dozens of translucent layers of paint to create soft, smoky transitions between light and shadow with no visible brushstrokes. The Mona Lisa\'s famous smile exists in this ambiguity: the corners of her mouth dissolve into sfumato, so the smile changes depending on where you focus. Leonardo also introduced psychological depth — his figures think, feel, and react. The Last Supper (1495–98) captures the instant after Christ announces his betrayal: each apostle reacts differently, creating a psychological drama unprecedented in art. His notebooks — 7,000+ pages of anatomy, engineering, botany, and flight — reveal a mind for which art was one expression of total curiosity about the world.',
    color: SIENNA,
  },
  {
    year: '1475–1564',
    title: 'Michelangelo: The Human Form Divine',
    description:
      'Michelangelo believed the human body was the supreme vehicle for expressing spiritual truth. His David (1501–04) — 17 feet of marble carved from a block other sculptors had rejected — captures the moment before battle: muscles tensed, veins visible, gaze focused. It was a political statement (Florence as young David defying Goliath-sized enemies) and an artistic one (the nude male body as the highest subject in art). The Sistine Chapel ceiling (1508–12) — 5,800 square feet painted by one man lying on scaffolding for four years — tells the story of Genesis through 300+ figures of staggering anatomical power. The Creation of Adam, where God\'s finger nearly touches Adam\'s, is perhaps the most reproduced image in Western art.',
    color: CRIMSON,
  },
  {
    year: '1483–1520',
    title: 'Raphael: Perfect Classical Balance',
    description:
      'If Leonardo was enigmatic and Michelangelo was titanic, Raphael was perfect. The School of Athens (1509–11) in the Vatican — which places Plato and Aristotle at the center of a grand architectural space filled with every major philosopher of antiquity — is the supreme expression of Renaissance ideals: classical learning, mathematical harmony, and the dignity of human reason. Raphael used Leonardo\'s face for Plato and Michelangelo\'s for the brooding Heraclitus, weaving his contemporaries into an eternal conversation. He died at 37, and Rome wept.',
    color: ULTRAMARINE,
  },
  {
    year: '1400–1600',
    title: 'Northern Renaissance: A Different Revolution',
    description:
      'While Italy pursued classical ideals, the Northern Renaissance (Flanders, Germany, Netherlands) pursued meticulous realism through different means. Jan van Eyck (c. 1390–1441) perfected oil painting — using thin transparent glazes to build up luminous surfaces that made Italian tempera look flat. The Arnolfini Portrait (1434) contains reflections, textures of silk, fur, and brass, and a convex mirror showing the entire room in reverse. Albrecht Dürer (1471–1528) elevated printmaking to high art, his engravings achieving tonal subtlety that rivaled painting. And Hieronymus Bosch (c. 1450–1516) created nightmarish visions of hell and human folly in The Garden of Earthly Delights — a triptych so bizarre it still defies interpretation 500 years later.',
    color: EMERALD,
  },
];

// ── Baroque ─────────────────────────────────────────────────────────────────

const BAROQUE_TIMELINE: TimelineEntry[] = [
  {
    year: '1571–1610',
    title: 'Caravaggio: The Revolutionary',
    description:
      'Michelangelo Merisi da Caravaggio invented chiaroscuro — extreme contrast between light and dark — and used it to make sacred scenes viscerally real. He painted biblical figures as street people: his Madonna was modeled on a drowned prostitute pulled from the Tiber, his saints had dirty fingernails. The Calling of Saint Matthew (1600) shows a divine beam of light slicing into a seedy tax collector\'s office — the sacred erupting into the mundane. Caravaggio was also a murderer who fled Rome after killing a man in a brawl, spent his last years on the run, and died at 38 on a beach in Tuscany. His influence was seismic: "Caravaggisti" spread his dramatic lighting across Europe, and his DNA runs through Rembrandt, Velázquez, and every film noir.',
    color: CRIMSON,
  },
  {
    year: '1606–1669',
    title: 'Rembrandt: Light from Within',
    description:
      'Rembrandt van Rijn is the supreme painter of human interiority. His self-portraits — roughly 80 over 40 years — chart his journey from cocky young success to bankrupt old man with unflinching honesty. No artist before or since has looked at himself so deeply. The Night Watch (1642) transformed a group portrait commission into a dynamic, theatrical scene of a militia company in motion — shocking clients who expected a static lineup. His late works, painted with thick impasto applied with palette knife and even fingers, achieve a luminous, almost abstract quality that anticipates Impressionism by 200 years. Rembrandt found light not by illuminating surfaces but by making them glow from within.',
    color: GOLD,
  },
  {
    year: '1632–1675',
    title: 'Vermeer: The Quiet Master',
    description:
      'Johannes Vermeer produced only about 34 paintings in his entire career — and almost every one is a masterpiece. His specialty was small domestic scenes of women reading letters, pouring milk, or making lace, bathed in cool north light from a window on the left. Girl with a Pearl Earring (c. 1665) — sometimes called the "Mona Lisa of the North" — captures a girl turning toward the viewer with parted lips and a luminous pearl, in a moment of extraordinary intimacy. Vermeer may have used a camera obscura (a lens that projects images) as an aid — the soft focus and light effects in his work are almost photographic. He died in debt at 43, was virtually forgotten for 200 years, and is now considered one of the greatest painters who ever lived.',
    color: ULTRAMARINE,
  },
  {
    year: '1577–1640',
    title: 'Rubens: Grand Baroque Spectacle',
    description:
      'Peter Paul Rubens was the most successful artist in European history — a diplomat, a knight, fluent in six languages, and the head of the largest painting workshop in Europe. His canvases are enormous, filled with swirling compositions of fleshy mythological and religious figures in ecstatic motion. The Descent from the Cross (1612–14) is a masterpiece of Baroque drama — the dead Christ\'s body slides diagonally across the canvas as mourners strain to support him. Rubens employed dozens of assistants (including the young Anthony van Dyck) and ran his studio like a factory, personally finishing faces and key passages while assistants handled drapery and backgrounds. His "Rubenesque" female nudes — full-bodied, pink-skinned, exuberant — defined European beauty standards for a century.',
    color: ROSE,
  },
  {
    year: '1598–1680',
    title: 'Bernini: Sculpture as Theater',
    description:
      'Gian Lorenzo Bernini transformed marble into flesh, fabric, and flame. The Ecstasy of Saint Teresa (1647–52) in Rome\'s Cornaro Chapel shows the saint pierced by an angel\'s golden arrow, her face a study in spiritual rapture that is frankly, unmistakably orgasmic — and Bernini knew exactly what he was doing. He designed the entire chapel as a theater: marble spectators watch from opera boxes on either side, concealed windows cast real light on the golden rays behind Teresa, and the ensemble blurs the line between sculpture, architecture, and performance. Bernini\'s Apollo and Daphne (1622–25) — where you can see Daphne\'s fingers turning into laurel leaves in mid-transformation — makes stone look like it is moving. He was the most complete Baroque artist: sculptor, architect, painter, playwright, and set designer.',
    color: AMBER,
  },
];

// ── 18th Century ────────────────────────────────────────────────────────────

const EIGHTEENTH_CENTURY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Rococo: Art for Pleasure (1720s–1770s)',
    detail:
      'Rococo was the art of the French aristocracy at play — pastel colors, ornate curves, cherubs, and romantic garden scenes. Jean-Honoré Fragonard\'s The Swing (1767) shows a young woman swinging in a garden while her lover peeks up her skirts from below — it is charming, frivolous, and deliberately shallow. Antoine Watteau\'s fêtes galantes depicted aristocrats in dreamy parkland settings, playing music and flirting in an eternal golden afternoon. Rococo was art as escapism, beauty without moral weight — and it was exactly as decadent as the society it served. The French Revolution would annihilate both.',
  },
  {
    label: 'Neoclassicism: Moral Seriousness Returns (1760s–1820s)',
    detail:
      'Neoclassicism was Rococo\'s antithesis — a return to the clean lines, sober colors, and moral gravity of Greek and Roman art. The discovery of Pompeii and Herculaneum (1748) fired public imagination with the ancient world. Jacques-Louis David became the movement\'s greatest painter: The Death of Marat (1793) — showing the murdered revolutionary in his bathtub — transformed a political assassination into a secular Pietà with the compositional power of Caravaggio. David later became Napoleon\'s official painter, creating iconic propaganda images. Neoclassicism was art enlisted in the service of revolution, republic, and empire.',
  },
  {
    label: 'The Academy System',
    detail:
      'By the 18th century, art was controlled by official Academies — particularly the French Académie des Beaux-Arts. The Academy determined what subjects were worthy (history painting at the top, still life at the bottom), how they should be painted (smooth finish, classical composition), and who could exhibit (through the annual Salon). This hierarchical system produced technically brilliant painters but increasingly stifled innovation. Every major art movement of the 19th century — Romanticism, Realism, Impressionism — defined itself by rebelling against Academy rules.',
  },
];

// ── 19th Century ────────────────────────────────────────────────────────────

const NINETEENTH_CENTURY_TIMELINE: TimelineEntry[] = [
  {
    year: '1800–1850s',
    title: 'Romanticism: The Sublime and the Terrible',
    description:
      'Romanticism rejected Neoclassical rationality in favor of emotion, nature, and individual genius. Caspar David Friedrich painted tiny figures dwarfed by vast misty landscapes — the individual confronting the sublime. J.M.W. Turner dissolved ships and storms into pure light and color, anticipating abstraction by 60 years. Eugène Delacroix\'s Liberty Leading the People (1830) made revolution into mythic spectacle. And Francisco Goya — the most disturbing artist of the era — documented the horrors of the Napoleonic invasion of Spain in The Disasters of War etchings and painted the nightmarish Black Paintings on his own dining room walls, including Saturn Devouring His Son. Romanticism said: art should make you feel, even if what you feel is terror.',
    color: CRIMSON,
  },
  {
    year: '1840s–1870s',
    title: 'Realism: The Radical Choice of Subject',
    description:
      'Gustave Courbet declared: "Show me an angel and I\'ll paint one." Realism rejected idealized subjects entirely. Courbet painted stone breakers, peasant funerals, and working-class life on canvases the size previously reserved for history painting — a deliberate provocation. His A Burial at Ornans (1849–50), showing a village funeral with no heroism or beauty, scandalized the Salon. Jean-François Millet painted The Gleaners (1857) — three peasant women bending to pick up leftover grain — and critics called it socialist propaganda. The revolution was in the subject matter: ordinary life was worthy of monumental art. Photography, invented in 1839, pushed painting further from documentation toward expression.',
    color: SIENNA,
  },
  {
    year: '1860s–1880s',
    title: 'Impressionism: Capturing Light, Scandalizing Paris',
    description:
      'On April 15, 1874, a group of artists rejected by the official Salon opened their own exhibition in a photographer\'s studio on Boulevard des Capucines. Critic Louis Leroy savaged Claude Monet\'s Impression, Sunrise as an unfinished sketch — inadvertently naming the movement. The Impressionists painted outdoors (en plein air), used pure unmixed colors applied in visible brushstrokes, and captured the fleeting effects of light on water, haystacks, and cathedrals. Pierre-Auguste Renoir painted sun-dappled luncheons. Edgar Degas captured ballet dancers in rehearsal from radical angles. Berthe Morisot and Mary Cassatt brought a female gaze to domestic scenes. The art establishment was outraged: these paintings looked "unfinished." Within 20 years, they were the most beloved paintings on Earth.',
    color: ULTRAMARINE,
  },
  {
    year: '1880s–1900s',
    title: 'Post-Impressionism: Four Roads to the Future',
    description:
      'The Post-Impressionists accepted Impressionism\'s liberation from academic rules but pushed in wildly different directions. Vincent van Gogh used thick swirling brushstrokes and intense color to express raw emotion — The Starry Night (1889) is painted with a desperation that is almost physically tangible; he sold one painting in his lifetime and shot himself at 37. Paul Cézanne painted landscapes and still lifes as geometric forms — cylinders, spheres, cones — laying the foundation for Cubism. Paul Gauguin fled bourgeois life for Tahiti, painting flattened, decorative images of an "exotic" paradise (a colonially problematic vision). Georges Seurat invented Pointillism, building images from thousands of tiny color dots, turning painting into optical science. Each of these four artists opened a door that 20th-century art would walk through.',
    color: GOLD,
  },
];

// ── 20th Century ────────────────────────────────────────────────────────────

const TWENTIETH_CENTURY_TIMELINE: TimelineEntry[] = [
  {
    year: '1905–1920s',
    title: 'Expressionism: Inner Anguish on Canvas',
    description:
      'Edvard Munch\'s The Scream (1893) — a figure on a bridge, mouth open in silent horror, the sky bleeding red — inaugurated Expressionism\'s central project: making inner psychological states visible. The German Expressionists (Ernst Ludwig Kirchner, Emil Nolde, Egon Schiele) used jagged lines, distorted forms, and acidic colors to express anxiety, alienation, and the fracturing of European civilization. After World War I, the movement intensified: Otto Dix and George Grosz painted the Weimar Republic\'s moral rot with savage precision. The Nazis would later destroy thousands of Expressionist works as "degenerate art."',
    color: VERMILLION,
  },
  {
    year: '1907–1920s',
    title: 'Cubism: Shattering the Single Viewpoint',
    description:
      'In 1907, Pablo Picasso painted Les Demoiselles d\'Avignon — five prostitutes from a Barcelona brothel rendered in fractured planes with mask-like faces influenced by African sculpture. It was so radical that even Picasso\'s friends were horrified. Working with Georges Braque, Picasso developed Cubism: objects shown from multiple perspectives simultaneously, shattered and reassembled on the canvas. A guitar might show its front, side, and back all at once. Cubism destroyed 500 years of one-point perspective in a single stroke. It was the most influential art movement of the 20th century, affecting sculpture, architecture, design, and even music.',
    color: STEEL,
  },
  {
    year: '1920s–1960s',
    title: 'Surrealism: Dream Logic and the Unconscious',
    description:
      'Influenced by Freud\'s theory of the unconscious, the Surrealists sought to liberate art from rational control. Salvador Dalí painted meticulously realistic scenes of impossible things — melting clocks (The Persistence of Memory, 1931), burning giraffes, elephants on spider legs — creating what he called "hand-painted dream photographs." René Magritte painted a pipe and wrote beneath it "This is not a pipe" (The Treachery of Images, 1929), questioning the relationship between image and reality. Frida Kahlo transformed personal pain — a devastating bus accident, miscarriages, a turbulent marriage to Diego Rivera — into visceral self-portraits that merged Surrealist imagery with Mexican folk art. Surrealism proved that the unconscious mind was art\'s richest territory.',
    color: PURPLE,
  },
  {
    year: '1940s–1960s',
    title: 'Abstract Expressionism: The American Moment',
    description:
      'After World War II, the center of the art world shifted from Paris to New York. Jackson Pollock laid enormous canvases on the floor and dripped, poured, and flung paint from above in intricate webs of color — "action painting" that made the physical act of creation the subject. Mark Rothko painted enormous fields of luminous, hovering color — soft-edged rectangles that were meant to evoke primal human emotions: tragedy, ecstasy, doom. He wanted viewers to weep before his paintings, and some did. Willem de Kooning attacked the canvas with violent brushstrokes. The CIA secretly promoted Abstract Expressionism as proof that American freedom produced superior culture to Soviet Socialist Realism — art as Cold War weapon.',
    color: INDIGO,
  },
  {
    year: '1950s–1970s',
    title: 'Pop Art: Consumer Culture as Art',
    description:
      'Andy Warhol took a Campbell\'s soup can, reproduced it 32 times, and hung it in a gallery. Roy Lichtenstein painted comic book panels at monumental scale, complete with Ben-Day dots. Claes Oldenburg created giant soft sculptures of hamburgers and typewriters. Pop Art\'s question was devastating: in a world saturated with mass-produced images, what makes "art" different from advertising? Warhol\'s silk-screened Marilyns, Elvis Presleys, and electric chairs flattened all subjects — celebrity, death, consumer products — into the same bright, affectless surface. His Factory produced art like a corporation. "In the future, everyone will be world-famous for fifteen minutes." He was right.',
    color: ROSE,
  },
  {
    year: '1960s–1970s',
    title: 'Minimalism and Conceptual Art: Less Is Everything',
    description:
      'Minimalism stripped art to its essentials. Donald Judd\'s wall-mounted boxes, Dan Flavin\'s fluorescent light arrangements, and Carl Andre\'s floor tiles eliminated representation, metaphor, and expression entirely — what you see is what you see. Then Conceptual Art went further: the idea IS the art. Sol LeWitt wrote instructions for wall drawings that anyone could execute. Joseph Kosuth displayed a chair, a photograph of the chair, and the dictionary definition of "chair" — asking which one is the real art. Marcel Duchamp had anticipated all of this in 1917 when he signed a urinal "R. Mutt" and submitted it to an exhibition, but the art world needed 50 years to catch up.',
    color: TEAL,
  },
];

// ── Contemporary Art ────────────────────────────────────────────────────────

const CONTEMPORARY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Street Art: From Vandalism to Museums',
    detail:
      'Banksy — anonymous, British, and worth millions — represents street art\'s paradox. Graffiti began as an illegal act of urban expression in 1970s New York (Jean-Michel Basquiat started as a graffiti artist writing "SAMO" on Manhattan buildings before becoming the most celebrated painter of the 1980s). Banksy\'s satirical stencils — a girl releasing a heart-shaped balloon, soldiers painting a peace sign — appeared on walls worldwide. When his Girl with Balloon sold at Sotheby\'s for $1.4 million in 2018, a hidden shredder in the frame destroyed half the work as the gavel fell. The shredded version immediately became more valuable. The art market consumed even its own critique.',
  },
  {
    label: 'Digital Art and NFTs',
    detail:
      'Digital art — created on computers, displayed on screens, infinitely reproducible — challenged art\'s fundamental scarcity. In March 2021, the digital artist Beeple sold an NFT (non-fungible token) collage for $69.3 million at Christie\'s, making him the third most expensive living artist. NFTs use blockchain technology to create artificial scarcity for digital files. The NFT bubble subsequently collapsed, but the question it raised remains: in a digital world, what gives art value? Is it the object, the certificate, or the cultural conversation? The answer is still being written.',
  },
  {
    label: 'Photography as Fine Art',
    detail:
      'Photography spent 150 years fighting for acceptance as fine art. Now it dominates. Andreas Gursky\'s Rhein II (1999) — a digitally altered photograph of the Rhine River — sold for $4.3 million. Cindy Sherman\'s self-portraits, in which she transforms herself into characters from film noir, fashion, and old master paintings, are among the most influential artworks of the late 20th century. Jeff Wall creates elaborately staged "documentary" photographs. The boundary between photography, painting, and digital manipulation has dissolved entirely — just as the boundary between "high art" and "popular culture" has.',
  },
  {
    label: 'Installation and Performance Art',
    detail:
      'Contemporary art increasingly rejects the traditional object. Yayoi Kusama\'s Infinity Mirror Rooms immerse visitors in endless reflections. Olafur Eliasson installed an artificial sun in the Tate Modern\'s Turbine Hall. Marina Abramović sat silently in MoMA for 736 hours while visitors sat across from her and wept. Ai Weiwei combines massive sculptural installations with political activism against the Chinese government. Art has become experience, environment, and action — the "art object" is sometimes the least important part of the artwork.',
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Phidias',
    years: 'c. 480–430 BCE',
    contribution:
      'Athenian sculptor who oversaw the Parthenon\'s sculptural program and created the Statue of Zeus at Olympia — one of the Seven Wonders. He defined the Classical Greek ideal of human beauty that dominated Western art for two millennia.',
  },
  {
    name: 'Giotto di Bondone',
    years: '1267–1337',
    contribution:
      'The first artist to break from Byzantine flatness, introducing volume, weight, and human emotion into painting. His frescoes in the Scrovegni Chapel (Padua) made figures look like real people in real spaces — the starting gun for the Renaissance.',
  },
  {
    name: 'Jan van Eyck',
    years: 'c. 1390–1441',
    contribution:
      'Flemish master who perfected oil painting technique, achieving luminous surfaces and microscopic detail impossible in tempera. The Arnolfini Portrait and the Ghent Altarpiece established oil painting as the dominant Western medium for 500 years.',
  },
  {
    name: 'Leonardo da Vinci',
    years: '1452–1519',
    contribution:
      'Inventor of sfumato, master of psychological depth, creator of the Mona Lisa and The Last Supper. His 7,000+ pages of notebooks reveal perhaps the most curious mind in human history — artist, scientist, engineer, and anatomist in one.',
  },
  {
    name: 'Michelangelo Buonarroti',
    years: '1475–1564',
    contribution:
      'Sculptor of David, painter of the Sistine Chapel ceiling, architect of St. Peter\'s dome. He believed the sculpture was already inside the marble — his job was to free it. Considered the greatest artist of the Renaissance, possibly of all time.',
  },
  {
    name: 'Raphael Sanzio',
    years: '1483–1520',
    contribution:
      'Painter of The School of Athens and the Sistine Madonna. Raphael achieved perfect classical balance — harmony, grace, and clarity that made him the Academy\'s gold standard for 300 years. Died at 37 at the height of his powers.',
  },
  {
    name: 'Caravaggio',
    years: '1571–1610',
    contribution:
      'Invented dramatic chiaroscuro lighting and painted sacred scenes with shocking realism — street people as saints, a drowned prostitute as the Virgin Mary. A murderer and a fugitive, his revolutionary style transformed European painting overnight.',
  },
  {
    name: 'Rembrandt van Rijn',
    years: '1606–1669',
    contribution:
      'The supreme painter of human interiority. His 80 self-portraits chart a life with brutal honesty. The Night Watch reinvented group portraiture. His late works achieve a luminous depth that makes surfaces glow from within.',
  },
  {
    name: 'Johannes Vermeer',
    years: '1632–1675',
    contribution:
      'Produced only ~34 paintings, nearly all masterpieces. His quiet domestic scenes — Girl with a Pearl Earring, The Milkmaid — capture light with almost photographic precision. Forgotten for 200 years, now among the most beloved painters in history.',
  },
  {
    name: 'Francisco Goya',
    years: '1746–1828',
    contribution:
      'Spanish painter who evolved from elegant court portraits to the unflinching horrors of The Disasters of War and the nightmarish Black Paintings. Saturn Devouring His Son remains one of the most disturbing images ever created. Bridge between Old Masters and modernity.',
  },
  {
    name: 'J.M.W. Turner',
    years: '1775–1851',
    contribution:
      'English painter who dissolved solid forms into pure light and color, anticipating both Impressionism and abstraction by decades. His late seascapes and storms are almost entirely made of light. Ruskin called him the greatest painter of all time.',
  },
  {
    name: 'Gustave Courbet',
    years: '1819–1877',
    contribution:
      'Father of Realism who declared "Show me an angel and I\'ll paint one." Painted peasants, funerals, and workers on monumental canvases previously reserved for heroes and gods. Made the radical argument that ordinary life deserved art.',
  },
  {
    name: 'Claude Monet',
    years: '1840–1926',
    contribution:
      'Founder of Impressionism whose Impression, Sunrise gave the movement its name. His serial paintings of haystacks, Rouen Cathedral, and water lilies — the latter produced over 30 years at Giverny — explored how light transforms the same subject across hours and seasons.',
  },
  {
    name: 'Vincent van Gogh',
    years: '1853–1890',
    contribution:
      'Created roughly 2,100 artworks in a decade of furious production, sold one painting in his lifetime, and shot himself at 37. The Starry Night, painted from a mental asylum, uses thick swirling brushstrokes to make the night sky pulse with emotional intensity. The archetype of the tortured genius.',
  },
  {
    name: 'Paul Cézanne',
    years: '1839–1906',
    contribution:
      'Painted landscapes and still lifes as geometric forms — spheres, cones, cylinders — seeking the "underlying structure" of nature. Picasso and Braque called him "the father of us all." Without Cézanne, there is no Cubism.',
  },
  {
    name: 'Pablo Picasso',
    years: '1881–1973',
    contribution:
      'Co-inventor of Cubism, creator of Les Demoiselles d\'Avignon and Guernica, the most prolific major artist in history (~50,000 works). Reinvented himself constantly across Blue, Rose, Cubist, Neoclassical, and Surrealist periods. Dominated 20th-century art for 70 years.',
  },
  {
    name: 'Marcel Duchamp',
    years: '1887–1968',
    contribution:
      'Submitted a signed urinal to an exhibition in 1917 and changed art forever. His "readymades" — ordinary objects declared art by the artist\'s choice — raised the question: what IS art? Every conceptual artist since works in Duchamp\'s shadow.',
  },
  {
    name: 'Frida Kahlo',
    years: '1907–1954',
    contribution:
      'Transformed personal pain — a devastating bus accident, miscarriages, a turbulent marriage — into visceral self-portraits fusing Surrealism with Mexican folk art. Her unflinching gaze and unapologetic embrace of her identity made her a global feminist icon.',
  },
  {
    name: 'Salvador Dalí',
    years: '1904–1989',
    contribution:
      'Master of "hand-painted dream photographs" — melting clocks, burning giraffes, elephants on spider legs rendered with photographic precision. The Persistence of Memory is the defining image of Surrealism. Equal parts genius and showman.',
  },
  {
    name: 'Jackson Pollock',
    years: '1912–1956',
    contribution:
      'Laid canvases on the floor and dripped, poured, and flung paint in rhythmic webs — "action painting" that made the physical act of creation the subject. His drip paintings made New York the center of the art world and American art globally dominant.',
  },
  {
    name: 'Mark Rothko',
    years: '1903–1970',
    contribution:
      'Painted enormous fields of luminous, floating color — soft-edged rectangles meant to evoke primal emotions. He wanted viewers to weep before his paintings. His Rothko Chapel in Houston is a secular temple to color and silence. Took his own life at 66.',
  },
  {
    name: 'Andy Warhol',
    years: '1928–1987',
    contribution:
      'Turned consumer culture into high art: Campbell\'s soup cans, Brillo boxes, silk-screened Marilyns. His Factory blurred art, commerce, celebrity, and identity. "In the future, everyone will be world-famous for fifteen minutes." Pop Art\'s prophet and the godfather of contemporary art culture.',
  },
  {
    name: 'Jean-Michel Basquiat',
    years: '1960–1988',
    contribution:
      'From Brooklyn graffiti ("SAMO") to the most celebrated painter of the 1980s. His canvases combined text, anatomical drawings, African-American history, and raw energy into explosive compositions. Collaborated with Warhol. Died of a heroin overdose at 27. His work now sells for $100+ million.',
  },
  {
    name: 'Banksy',
    years: 'Active 1990s–present',
    contribution:
      'Anonymous British street artist whose satirical stencils appear on walls worldwide. Girl with Balloon self-destructed at auction. His work questions art-market absurdity while being consumed by it — a paradox he exploits brilliantly.',
  },
  {
    name: 'Yayoi Kusama',
    years: '1929–present',
    contribution:
      'Japanese artist whose Infinity Mirror Rooms — immersive environments of endless reflections — draw millions of visitors worldwide. Working obsessively for 70+ years, she has used polka dots, nets, and pumpkins to explore infinity, self-obliteration, and the cosmos.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Shared components
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

const FIGURE_COLORS = [OCHRE, LAPIS, CRIMSON, GOLD, EMERALD, PURPLE, ULTRAMARINE, ROSE, AMBER, TEAL, SIENNA, INDIGO, VERMILLION, GREEN, STEEL];

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

export default function ArtHistoryPage() {
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
              background: `linear-gradient(135deg, ${OCHRE}, ${LAPIS})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Art History — How Humans Have Expressed Meaning Since the Cave (35,000 BCE–Present)
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
              Before writing, before agriculture, before cities — humans made
              art. They crawled into pitch-dark caves and painted animals by
              firelight. They carved female figures from mammoth ivory. They
              pressed their hands against stone walls and blew pigment around
              them, leaving silhouettes that have lasted 35,000 years. Art is
              not something civilization invented. Art is what made civilization
              possible.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This is the story of how Western art evolved from those cave
              walls to Caravaggio's chiaroscuro, from Monet's scandalous
              brushstrokes to Pollock's dripped webs, from Michelangelo's
              David to Warhol's soup cans. It is a story of revolutions:
              perspective, photography, abstraction — each one redefining what
              art could be. And at every turn, the same question: what does it
              mean to be human?
            </p>
          </motion.div>
        </header>

        {/* ── Prehistoric Art ─────────────────────────────────────────── */}
        <SectionWrapper
          id="prehistoric"
          icon="🎨"
          title="Prehistoric Art — When Humans First Made Meaning (35,000–3,000 BCE)"
          accentColor={OCHRE}
          intro="Long before pyramids or alphabets, Homo sapiens crawled into the deepest chambers of caves — places of absolute darkness — and created art of astonishing sophistication. These were not primitive scratches. They were deliberate, planned, communal artistic projects that tell us something profound about the minds that made them: art is not a luxury of civilization. It is a fundamental human need."
        >
          <InsightGrid items={PREHISTORIC_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ancient Art: Egyptian ────────────────────────────────────── */}
        <SectionWrapper
          id="egyptian"
          icon="🏛️"
          title="Egyptian Art — Art as Magic (3,000–30 BCE)"
          accentColor={GOLD}
          intro="For 3,000 years — longer than any other artistic tradition in history — Egyptian art followed the same fundamental rules. This was not stagnation; it was deliberate. Egyptian art existed to serve the dead, honor the gods, and ensure the cosmic order. Every image was a spell, every statue a container for the spirit. Beauty was not the goal. Function was."
        >
          <InsightGrid items={EGYPTIAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ancient Art: Greek ───────────────────────────────────────── */}
        <SectionWrapper
          id="greek"
          icon="🏺"
          title="Greek Art — The Birth of Western Aesthetics (700–31 BCE)"
          accentColor={ULTRAMARINE}
          intro="The Greeks invented the idea that art should pursue beauty for its own sake — and that the idealized human body was the highest expression of that beauty. 'Kalos kagathos': the beautiful and the good were the same thing. From stiff Archaic figures to the fluid perfection of Classical sculpture, Greek art underwent one of the most dramatic transformations in history — and its ideals still shape how we see the human form."
        >
          <InsightGrid items={GREEK_INSIGHTS} />
        </SectionWrapper>

        {/* ── Ancient Art: Roman ───────────────────────────────────────── */}
        <SectionWrapper
          id="roman"
          icon="🦅"
          title="Roman Art — Documentation, Propaganda, and Living with Beauty (509 BCE–476 CE)"
          accentColor={CRIMSON}
          intro="Rome borrowed Greek art and transformed it into something new: a tool for documenting reality, projecting political power, and decorating everyday life. Where Greeks idealized, Romans recorded. Where Greeks pursued abstract beauty, Romans used art to tell the world who was in charge. And in the houses of Pompeii, preserved under volcanic ash, we discover that even middle-class Romans lived surrounded by art."
        >
          <InsightGrid items={ROMAN_INSIGHTS} />
        </SectionWrapper>

        {/* ── Medieval Art ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="medieval"
          icon="⛪"
          title="Medieval Art — Sacred Images in an Age of Faith (500–1400 CE)"
          accentColor={SIENNA}
          intro="Medieval art was not 'worse' than Greek or Roman art — it had different goals. Where classical art pursued naturalistic beauty, medieval art pursued spiritual truth. Byzantine icons were flat and gold-backed not because artists couldn't draw depth, but because earthly perspective was irrelevant to divine reality. Romanesque churches carved fear of damnation into stone. Gothic cathedrals turned walls into windows and sunlight into theology."
        >
          <TimelineCard entries={MEDIEVAL_TIMELINE} />
        </SectionWrapper>

        {/* ── Renaissance ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="renaissance"
          icon="🌅"
          title="The Renaissance — Art Discovers the World (1400–1600 CE)"
          accentColor={OCHRE}
          intro="The Renaissance was not a gradual improvement — it was a rupture. In the span of a few generations, artists invented linear perspective, discovered anatomy through dissection, mastered oil painting, and produced works of such power that they still define what 'great art' means. Florence, Rome, and Venice became laboratories of genius. Leonardo, Michelangelo, and Raphael became the first celebrity artists. Art changed more in 200 years than it had in the previous 2,000."
        >
          <TimelineCard entries={RENAISSANCE_TIMELINE} />
        </SectionWrapper>

        {/* ── Baroque ──────────────────────────────────────────────────── */}
        <SectionWrapper
          id="baroque"
          icon="🎭"
          title="The Baroque — Drama, Emotion, and the Power of Light (1600–1750 CE)"
          accentColor={AMBER}
          intro="Baroque art was the Counter-Reformation's weapon: make sacred scenes so emotionally overwhelming, so physically real, that viewers would feel faith in their bodies. Caravaggio plunged biblical scenes into darkness pierced by divine light. Rembrandt made paint glow from within. Vermeer captured domestic silence with photographic precision. Bernini turned marble into ecstasy. The Baroque was art as total experience — visual, emotional, and spiritual."
        >
          <TimelineCard entries={BAROQUE_TIMELINE} />
        </SectionWrapper>

        {/* ── 18th Century ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="eighteenth-century"
          icon="👑"
          title="The 18th Century — From Aristocratic Play to Revolutionary Seriousness"
          accentColor={ROSE}
          intro="The 18th century swung between two poles: Rococo's frivolous elegance and Neoclassicism's moral gravity. One celebrated aristocratic pleasure in pastel garden scenes; the other enlisted art in the service of revolution, republic, and empire. Between them, the Academy system controlled what counted as art — a stranglehold that every subsequent movement would fight to break."
        >
          <InsightGrid items={EIGHTEENTH_CENTURY_INSIGHTS} />
        </SectionWrapper>

        {/* ── 19th Century ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="nineteenth-century"
          icon="🌊"
          title="The 19th Century — Revolutions in Perception"
          accentColor={ULTRAMARINE}
          intro="The 19th century transformed art more radically than any century before. Romanticism unleashed emotion and the sublime. Realism made ordinary life a worthy subject. Then, on a spring day in 1874, a group of painters rejected by the official Salon opened their own exhibition — and Impressionism shattered 400 years of painterly convention. By the century's end, Van Gogh, Cézanne, and Gauguin had opened doors that the 20th century would storm through."
        >
          <TimelineCard entries={NINETEENTH_CENTURY_TIMELINE} />
        </SectionWrapper>

        {/* ── 20th Century ─────────────────────────────────────────────── */}
        <SectionWrapper
          id="twentieth-century"
          icon="💥"
          title="The 20th Century — The Great Explosion"
          accentColor={INDIGO}
          intro="The 20th century blew art apart. Cubism shattered perspective. Surrealism dove into the unconscious. Abstract Expressionism abandoned representation entirely. Pop Art made consumer products into high art. Minimalism reduced art to its essentials. Conceptual Art declared that the idea IS the art. More movements, more radical breaks, more fundamental questions about what art even is — in 100 years — than in the previous 35,000."
        >
          <TimelineCard entries={TWENTIETH_CENTURY_TIMELINE} />
        </SectionWrapper>

        {/* ── Contemporary Art ─────────────────────────────────────────── */}
        <SectionWrapper
          id="contemporary"
          icon="🖼️"
          title="Contemporary Art — Everything Is Art, Everyone Is an Artist"
          accentColor={TEAL}
          intro="Contemporary art has dissolved every boundary that once defined it. Street art moves from walls to auction houses. Digital files sell for millions. Photography has won the battle for fine-art status. Installation art makes the viewer part of the work. The question is no longer 'Is this beautiful?' but 'What does this make you think?' — and increasingly, 'What is it worth?'"
        >
          <InsightGrid items={CONTEMPORARY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures — 25 Artists Who Changed How We See"
          accentColor={GOLD}
          intro="From Phidias carving gods in marble to Banksy stenciling satire on walls, these are the artists whose vision redefined what art could be. Geniuses and madmen, revolutionaries and perfectionists, many died poor or young or both — and the world they left behind looks different because of what they made."
        >
          <FigureGrid figures={KEY_FIGURES} />
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
            "Every child is an artist. The problem is how to remain an artist once he grows up."
            — Pablo Picasso
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
