/**
 * HistoryOfFashionPage — comprehensive deep-dive on the History of Fashion (3000 BCE–Present).
 *
 * Route: /history-of-fashion
 *
 * Sections:
 *  1. Hero — headline, overview of fashion's cultural power
 *  2. Ancient World — Egyptian linen, Greek chiton, Roman purple
 *  3. Medieval — sumptuary laws, guild tailors, Black Death's impact
 *  4. Renaissance — codpieces, ruffs, Venice as fashion capital
 *  5. Court & Baroque — Versailles, wigs, corsets, panniers
 *  6. Industrial Revolution — mass production, sewing machine, synthetic dyes
 *  7. Victorian Era — crinolines, mourning dress, department stores
 *  8. Early 20th Century — Worth, Poiret, WWI's practical shift
 *  9. 1920s–1940s — Chanel, flapper, Hollywood glamour, WWII rationing
 * 10. Postwar Revolution — Dior's New Look, Balenciaga, youth culture
 * 11. 1960s–1970s — miniskirt, hippie, disco
 * 12. 1980s–1990s — power dressing, Japanese avant-garde, grunge, supermodels
 * 13. 2000s–Present — fast fashion, sustainability, athleisure, social media
 * 14. Global Fashion — African wax prints, saris, kimono, resistance to Westernization
 * 15. Key Designers — landmark figures timeline
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const ASH = '#94a3b8';
const CORAL = '#f97316';
const FUCHSIA = '#d946ef';
const EMERALD = '#10b981';
const ROYAL_PURPLE = '#7c3aed';
const BURGUNDY = '#991b1b';
const CHAMPAGNE = '#f5e6cc';

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
    label: 'Tyrian Purple',
    detail: 'Extracting 1.5 grams of purple dye required crushing 12,000 murex sea snails. Only emperors and senators could wear it — the original flex.',
  },
  {
    label: '$1.7 trillion',
    detail: 'Global fashion industry revenue in 2024 — larger than the GDP of South Korea. The third-largest manufacturing sector worldwide.',
  },
  {
    label: '100 billion garments/year',
    detail: 'Global annual clothing production. The average garment is worn just 7 times before being discarded. 87% ends up in landfills or incinerators.',
  },
  {
    label: 'February 12, 1947',
    detail: "Christian Dior debuts the \"New Look\" — padded hips, cinched waist, full skirt. Women literally rioted. It remains the single most influential fashion show in history.",
  },
  {
    label: '10,000+ years',
    detail: 'Humans have worn clothing since at least 8000 BCE. Fashion — clothing as identity — emerged the moment one person chose linen over hide.',
  },
  {
    label: '92 million tons',
    detail: 'Textile waste generated annually. Fashion is responsible for 10% of global carbon emissions — more than aviation and shipping combined.',
  },
];

// ── Ancient World ───────────────────────────────────────────────────────────

const ANCIENT_TIMELINE: TimelineEntry[] = [
  {
    year: '~3000 BCE',
    title: 'Egyptian Linen: The First Luxury Fabric',
    description:
      'Ancient Egypt pioneered textile sophistication with linen woven from flax. The finest linen — "royal linen" — was so sheer it was nearly transparent, reserved for pharaohs and high priests. Linen was currency, tax payment, and burial shroud. Tutankhamun was wrapped in over 150 meters of it. The Egyptians understood what every fashion house since has known: what you wear signals who you are.',
    color: GOLD,
  },
  {
    year: '~800–300 BCE',
    title: 'Greek Draped Garments: Chiton & Himation',
    description:
      'Greek fashion was geometry made wearable. The chiton — a rectangle of fabric pinned at the shoulders and belted at the waist — could be arranged in dozens of ways without a single stitch. The himation (cloak) draped over it signaled philosophy, citizenship, and taste. Greeks didn\'t cut and sew; they folded and pinned. The body shaped the garment, not the other way around. This principle would vanish for 2,000 years until Madeleine Vionnet rediscovered it in the 1920s.',
    color: TEAL,
  },
  {
    year: '~500 BCE–400 CE',
    title: 'Roman Status Symbols: The Toga & Tyrian Purple',
    description:
      'The toga was not clothing — it was a citizenship document you wore. Only free Roman men could wear one. Its color, border stripes, and fabric encoded rank with military precision: the toga praetexta (purple border) for magistrates, the toga picta (solid purple, gold embroidery) for triumphant generals, plain white for ordinary citizens. Tyrian purple dye, extracted from thousands of murex snails, cost more per ounce than gold. Emperor Nero made it a capital offense for anyone below senatorial rank to wear it. Fashion as law enforcement began here.',
    color: PURPLE,
  },
  {
    year: '~3000 BCE–500 CE',
    title: 'Silk Road: Fashion Goes Global',
    description:
      'Chinese silk reached Rome via the Silk Road, creating the first international luxury fashion trade. Roman senators panicked about wealth flowing east. Indian cotton, Chinese silk, and Middle Eastern dyes moved along trade routes spanning 6,000 miles. Fashion was globalizing millennia before "globalization" was coined. The Silk Road proved that humans will cross continents and risk death for beautiful fabric.',
    color: AMBER,
  },
];

// ── Medieval ────────────────────────────────────────────────────────────────

const MEDIEVAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Sumptuary Laws: Fashion Police (Literally)',
    detail:
      'Medieval governments passed hundreds of laws dictating who could wear what. In 1363, English law prohibited anyone below the rank of knight from wearing silk, velvet, or gold cloth. Fur types were regulated by rank: ermine for royalty, fox for gentry, cat for commoners. These laws were enforced (poorly) but they reveal fashion\'s terrifying power: clothing could destabilize class hierarchies, and rulers knew it.',
  },
  {
    label: 'Guild Tailors: Birth of the Fashion Industry',
    detail:
      'By the 13th century, tailoring guilds in London, Paris, and Florence had transformed clothing from household craft to professional trade. Apprentices trained for 7 years. Master tailors guarded techniques like trade secrets. The guilds standardized construction methods, quality control, and pricing — inventing the fashion industry\'s infrastructure centuries before "fashion" existed as a concept.',
  },
  {
    label: 'The Black Death Changed Everything (1347–1351)',
    detail:
      'The plague killed a third of Europe\'s population — and revolutionized fashion. With labor scarce, surviving peasants demanded higher wages. Newly wealthy commoners dressed above their station, provoking panicked sumptuary laws. Simultaneously, a psychological shift occurred: facing mass death, survivors dressed more elaborately, more colorfully, more defiantly. Fashion became an assertion that you were alive.',
  },
  {
    label: 'The Pointed Shoe (Poulaine)',
    detail:
      'Medieval fashion\'s most absurd status symbol: shoes with pointed toes up to 24 inches long. The longer the toe, the higher the rank. Knights reportedly had to chain their shoe tips to their knees to walk. In 1463, Edward IV limited toe length by rank. The poulaine is proof that fashion\'s willingness to sacrifice function for status is not a modern invention — it\'s a human constant.',
  },
];

// ── Renaissance ─────────────────────────────────────────────────────────────

const RENAISSANCE_TIMELINE: TimelineEntry[] = [
  {
    year: '~1450–1550',
    title: 'The Codpiece: From Modesty to Spectacle',
    description:
      'Originally a triangular flap covering the gap between separate hose legs, the codpiece evolved into an aggressively padded, jewel-encrusted protrusion by the 1540s. Henry VIII\'s armor at the Tower of London features a codpiece that would make a modern designer blush. It was stuffed, decorated, and used as a pocket. The codpiece is a reminder that every era has its own version of conspicuous masculine display — and that future generations will find ours just as absurd.',
    color: BURGUNDY,
  },
  {
    year: '~1560–1620',
    title: 'The Ruff Collar: Engineering Meets Vanity',
    description:
      'Ruffs began as modest gathered collars and escalated into enormous starched wheels of pleated fabric extending up to 12 inches from the neck. They required specialized starch (imported from the Netherlands), heated metal tools for setting pleats, and dedicated servants to maintain them. Queen Elizabeth I\'s ruffs used up to 19 yards of fabric each. Ruffs made eating, turning your head, and basic human movement difficult — which was precisely the point. If you could afford to be that impractical, you were that powerful.',
    color: INDIGO,
  },
  {
    year: '~1400–1600',
    title: 'Italian & Spanish Influence: Venice as Fashion Capital',
    description:
      'Before Paris, there was Venice. Venetian textiles — silk velvet, brocade, damask — were the most coveted fabrics in Europe. Venice controlled the eastern trade routes, giving it monopoly access to dyes, silk, and exotic materials. Spanish fashion countered with rigid formality: the "Spanish body" (a precursor to the corset), dark colors, stiff fabrics, and geometric silhouettes that emphasized dignity over movement. The Italian–Spanish rivalry was fashion\'s first great style war.',
    color: CORAL,
  },
  {
    year: '~1500s',
    title: 'Slashing: Deliberate Destruction as Status',
    description:
      'Renaissance aristocrats cut deliberate slits in their outer garments to reveal expensive fabric underneath. Legend credits Swiss mercenaries who, after the Battle of Grandson (1476), patched their torn uniforms with captured Burgundian silk. Slashing became high fashion across Europe — a garment showing six layers of fabric through strategic cuts proved you could afford to destroy what commoners couldn\'t buy. The ancestor of distressed jeans.',
    color: ROSE,
  },
];

// ── Court & Baroque (17th–18th Century) ─────────────────────────────────────

const COURT_TIMELINE: TimelineEntry[] = [
  {
    year: '1660s–1715',
    title: 'Versailles: Fashion as State Policy',
    description:
      'Louis XIV weaponized fashion. He established Versailles as the global arbiter of taste not by accident but by deliberate policy: France\'s textile industry was a strategic economic asset, and making French fashion mandatory for European courts generated enormous revenue. Louis mandated that courtiers change outfits multiple times daily, bankrupting the nobility and making them dependent on royal favor. Fashion became a tool of political control — dress wrong and lose access to the king.',
    color: GOLD,
  },
  {
    year: '~1660–1800',
    title: 'Wigs: The More Absurd, The More Powerful',
    description:
      'Louis XIV began wearing wigs to conceal his baldness around 1655. Within a decade, every European court followed. Wigs grew steadily more elaborate: powdered white, sculpted into towers, decorated with ships, birdcages, and entire garden scenes. Marie Antoinette\'s hairdresser Léonard created styles three feet tall that required scaffolding. Wig powder alone consumed so much flour that food shortages were partially blamed on aristocratic vanity.',
    color: ASH,
  },
  {
    year: '~1500–1900',
    title: 'The Corset: 400 Years of Reshaping the Body',
    description:
      'From the 16th-century "stays" to the Victorian wasp-waist, the corset was the most enduring (and contested) garment in Western fashion. It flattened, cinched, pushed up, or reshaped the torso according to prevailing ideals. At its most extreme, tight-lacing reduced waists to 16 inches, displaced organs, and caused fainting. Defenders called it supportive and elegant; critics called it a torture device. The corset embodies fashion\'s oldest tension: beauty versus the body\'s natural form.',
    color: FUCHSIA,
  },
  {
    year: '~1740–1780',
    title: 'Panniers: Width as Power',
    description:
      'Panniers — side hoops extending the skirt horizontally — reached absurd widths of up to 6 feet, requiring women to turn sideways through doorways. Marie Antoinette\'s panniers at court ceremonies made her silhouette wider than she was tall. Like the ruff collar before them, panniers made practicality impossible — and that impossibility was the entire point. Architecture adapted to fashion: doorways at Versailles were widened to accommodate them.',
    color: ROYAL_PURPLE,
  },
];

// ── Industrial Revolution ───────────────────────────────────────────────────

const INDUSTRIAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Sewing Machine (1851): Fashion\'s Steam Engine',
    detail:
      'Isaac Singer\'s practical sewing machine didn\'t just speed up production — it democratized fashion. A shirt that took 14 hours to hand-sew took 1 hour by machine. For the first time in history, well-made clothing became affordable to the middle class. The sewing machine was to fashion what the printing press was to literature: it broke the aristocratic monopoly on quality.',
  },
  {
    label: 'Synthetic Dyes: Color for Everyone',
    detail:
      'In 1856, 18-year-old William Henry Perkin accidentally synthesized mauveine (purple) while trying to make quinine. Before synthetic dyes, vibrant colors were expensive and unreliable — bright red required crushed cochineal insects, purple required murex snails. Perkin\'s discovery made every color cheap and consistent. Within a decade, fashion exploded in color. The class hierarchy of color — purple for royalty, brown for peasants — collapsed overnight.',
  },
  {
    label: 'Ready-to-Wear: The End of Bespoke\'s Monopoly',
    detail:
      'The American Civil War created the first mass market for standardized clothing: Union Army uniforms required standardized sizing. After the war, manufacturers realized those size charts could produce civilian clothing too. By the 1880s, department stores sold ready-made garments at a fraction of custom tailoring costs. Fashion went from an artisan luxury to a consumer product — and never looked back.',
  },
  {
    label: 'Cotton & Empire',
    detail:
      'The Industrial Revolution ran on cotton — and cotton ran on slavery. British textile mills processed cotton picked by enslaved people in the American South. The fashion industry\'s foundations are inseparable from colonialism and forced labor. Indian textile workers, whose hand-loomed cotton and muslin were superior to British machine-made fabric, were deliberately deskilled by colonial trade policies that destroyed India\'s textile industry to protect British manufacturing.',
  },
];

// ── Victorian Era ───────────────────────────────────────────────────────────

const VICTORIAN_TIMELINE: TimelineEntry[] = [
  {
    year: '~1850–1870',
    title: 'The Crinoline: Engineering Under the Skirt',
    description:
      'The cage crinoline — a dome-shaped steel wire frame worn under the skirt — replaced layers of heavy petticoats and liberated women\'s legs while creating skirts up to 18 feet in circumference. Crinolines were engineering marvels and genuine hazards: women caught fire near open hearths, got trapped in machinery, and couldn\'t fit through doorways. An estimated 3,000 women died in crinoline-related fire accidents in England alone during the 1860s. Fashion has always been willing to risk death for silhouette.',
    color: ROSE,
  },
  {
    year: '1861–1901',
    title: 'Queen Victoria & Mourning Dress',
    description:
      'After Prince Albert\'s death in 1861, Queen Victoria wore black for the remaining 40 years of her life — and transformed grief into fashion. Elaborate mourning dress codes emerged: full black for the first year, then gradual reintroduction of grey and lavender. Mourning jewelry was made from jet, hair of the deceased, and black enamel. An entire industry grew around death fashion. Victoria proved that a single person\'s clothing choices could reshape an entire culture\'s wardrobe.',
    color: SLATE,
  },
  {
    year: '~1850s–1890s',
    title: 'Department Stores: Fashion as Spectacle',
    description:
      'Le Bon Marché (Paris, 1852), Selfridges (London, 1909), and Marshall Field\'s (Chicago, 1881) transformed shopping from a transaction into an experience. Fixed prices replaced haggling. Window displays became theater. Women could browse unaccompanied for the first time — department stores were among the first public spaces where respectable women could go alone. Fashion retail invented modern consumer culture.',
    color: AMBER,
  },
  {
    year: '~1850s',
    title: 'Charles Frederick Worth: The First Fashion Designer',
    description:
      'Before Worth, dressmakers were anonymous tradespeople who executed clients\' wishes. Worth inverted the relationship: he told clients what to wear. He created seasonal collections, used live models, sewed labels into garments, and cultivated an artistic persona. Worth didn\'t just make dresses — he invented the concept of the fashion designer as creative authority. Every designer who shows a collection on a runway is following Worth\'s script.',
    color: GOLD,
  },
];

// ── Early 20th Century ──────────────────────────────────────────────────────

const EARLY_20TH_INSIGHTS: InsightEntry[] = [
  {
    label: 'Paul Poiret: Liberation from the Corset (1906–1914)',
    detail:
      'Poiret didn\'t just loosen the corset — he abolished it. His high-waisted Empire-line dresses freed the torso entirely. He introduced harem pants, turbans, and bold colors inspired by the Ballets Russes and Orientalist fantasy. Poiret claimed he "freed the bust" but "shackled the legs" (his hobble skirt was so narrow women could barely walk). Still, the death of the corset was fashion\'s most significant liberation until the 1960s.',
  },
  {
    label: 'WWI: When Fashion Got Practical (1914–1918)',
    detail:
      'World War I forced fashion to confront reality. With men at war, women entered factories — and discovered that corsets, floor-length skirts, and elaborate hairstyles were incompatible with operating machinery. Hemlines rose. Fabrics simplified. Trench coats (literally designed for trenches by Burberry) crossed from military to civilian wear. Fashion\'s relationship with practicality, forged in wartime, would never fully reverse.',
  },
  {
    label: 'Haute Couture System',
    detail:
      'Paris formalized fashion\'s hierarchy: the Chambre Syndicale de la Haute Couture (founded 1868, reorganized 1910s) established rules for who could call themselves "haute couture." Minimum staff size, number of original designs per season, hand-finishing requirements — all enforced. This credentialing system created fashion\'s most enduring power structure: Paris decides what is fashion, and everyone else follows.',
  },
  {
    label: 'Fashion Magazines as Kingmakers',
    detail:
      'Vogue (founded 1892) and Harper\'s Bazaar (1867) became the gatekeepers of taste. Their editors — later figures like Diana Vreeland and Anna Wintour — wielded power rivaling the designers themselves. A Vogue cover could make a career; being ignored could end one. Fashion journalism created the infrastructure of hype, influence, and cultural storytelling that would later migrate to Instagram and TikTok.',
  },
];

// ── 1920s–1940s ─────────────────────────────────────────────────────────────

const INTERWAR_TIMELINE: TimelineEntry[] = [
  {
    year: '1920s',
    title: 'Coco Chanel: Fashion\'s Greatest Revolution',
    description:
      'Chanel didn\'t just change fashion — she inverted its logic. Before Chanel, luxury meant decoration, restriction, and ostentation. Chanel made luxury mean simplicity, comfort, and understatement. She took jersey — a cheap fabric used for men\'s underwear — and made it haute couture. She popularized the "little black dress" (previously a mourning color), costume jewelry (previously a mark of poverty), and the suntan (previously a sign of outdoor labor). Chanel proved that true elegance is refusal — the willingness to remove one accessory before leaving the house.',
    color: GOLD,
  },
  {
    year: '1926',
    title: 'The Little Black Dress: Fashion\'s Universal Garment',
    description:
      'When Vogue published Chanel\'s simple black sheath dress in 1926, they called it "Chanel\'s Ford" — a garment as universal and functional as a Model T. Black had been reserved for mourning and servants. Chanel made it the color of sophisticated minimalism. The LBD became the one garment every woman was expected to own — fashion\'s only true universal. Nearly a century later, its status hasn\'t changed.',
    color: SLATE,
  },
  {
    year: '1920s',
    title: 'The Flapper: Fashion as Rebellion',
    description:
      'Dropped waistlines, raised hemlines, bobbed hair, flat chests deliberately concealed by bandeau bras — the flapper silhouette was an explicit rejection of the Edwardian hourglass ideal. Flappers drank, smoked, danced, and dressed in ways that horrified their parents\' generation. The flapper wasn\'t just a fashion trend — she was a political statement: women who had won the vote (1920) were now claiming their bodies too.',
    color: ROSE,
  },
  {
    year: '1930s',
    title: 'Hollywood Glamour: Cinema Becomes Fashion\'s Stage',
    description:
      'The Great Depression couldn\'t afford Paris, but it could afford a movie ticket. Hollywood costume designers — Adrian, Edith Head, Travis Banton — became de facto fashion designers for millions. When Joan Crawford wore padded shoulders in "Letty Lynton" (1932), Macy\'s sold 500,000 copies. When Ginger Rogers danced in bias-cut gowns, women across America demanded the same. Fashion\'s center of gravity shifted from the atelier to the soundstage.',
    color: AMBER,
  },
  {
    year: '1939–1945',
    title: 'WWII: Rationing, Utility, and Making Do',
    description:
      'Wartime rationing transformed fashion by force. Britain\'s Utility Clothing scheme limited fabric, button count, and decorative elements by law. The L-85 regulations in America restricted skirt length, hem width, and trouser cuffs. Women painted seam lines on bare legs to simulate stockings. "Make do and mend" became national policy. Yet fashion adapted: shorter skirts, squared shoulders, practical separates. Wartime scarcity proved that creativity thrives under constraint — and set the stage for the explosive release of Dior\'s New Look.',
    color: GREEN,
  },
];

// ── Postwar Revolution (1947–1960) ──────────────────────────────────────────

const POSTWAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Dior\'s New Look (1947): Fashion\'s Atomic Bomb',
    detail:
      'On February 12, 1947, Christian Dior showed a collection that used 20 yards of fabric per dress in a world still under rationing. The "Bar" jacket — padded hips, wasp waist, full calf-length skirt — was a deliberate, luxurious rejection of wartime austerity. Women in Paris attacked models wearing the New Look, tearing their clothes, outraged at the waste. Others wept with joy. The New Look is the most influential single fashion show ever staged — it reset the entire industry\'s direction overnight.',
  },
  {
    label: 'Cristóbal Balenciaga: The Architect of Fashion',
    detail:
      'Balenciaga was the designers\' designer — the only couturier Chanel acknowledged as a true master. His innovations were structural: the balloon jacket (1953), the sack dress (1957), the baby-doll dress (1958). He sculpted fabric in three dimensions, treating garments as architecture. Dior said "haute couture is like an orchestra whose conductor is Balenciaga. We other couturiers are the musicians." When Balenciaga retired in 1968, he didn\'t announce it — he simply closed his doors.',
  },
  {
    label: '1950s Suburban Ideal vs. Beatnik Counter-Culture',
    detail:
      'The 1950s split fashion into two warring camps. Mainstream America embraced the suburban housewife aesthetic: full skirts, pearl necklaces, matching handbag and shoes, femininity as performance. The Beatnik counter-culture responded with deliberate anti-fashion: black turtlenecks, berets, jeans, bare feet. This was fashion\'s first explicit counter-cultural movement — dressing to reject mainstream values, not to signal wealth. Every subculture since (punk, grunge, goth) follows this template.',
  },
  {
    label: 'Youth Culture Arrives',
    detail:
      'Before the 1950s, teenagers dressed like small adults. James Dean in "Rebel Without a Cause" (1955) — white T-shirt, red jacket, jeans — created the first fashion identity specifically for young people. The emergence of rock \'n\' roll, disposable income, and demographic shifts (the baby boom) created a new consumer category. For the first time, fashion flowed upward from youth to mainstream, not downward from aristocrats.',
  },
];

// ── 1960s–1970s ─────────────────────────────────────────────────────────────

const SIXTIES_TIMELINE: TimelineEntry[] = [
  {
    year: '1964–1966',
    title: 'Mary Quant & the Miniskirt: Six Inches That Changed Everything',
    description:
      'Mary Quant raised hemlines to six inches above the knee — and the establishment lost its mind. The miniskirt was banned in some countries, denounced from pulpits, and celebrated in others as liberation. Quant didn\'t just design the miniskirt — she built the youth fashion ecosystem around it: her Bazaar boutique on King\'s Road, Chelsea, became the prototype for every fast-fashion store. André Courrèges showed a couture version simultaneously in Paris, but Quant\'s version was cheap, accessible, and democratic.',
    color: ROSE,
  },
  {
    year: '1960s',
    title: 'Carnaby Street & Swinging London',
    description:
      'For a brief, intoxicating moment in the mid-1960s, London replaced Paris as the world\'s fashion capital. Carnaby Street became a global symbol of youth culture — mod suits, Chelsea boots, military jackets, and psychedelic prints. Designers like Ossie Clark, Biba\'s Barbara Hulanicki, and Quant dressed a generation that rejected their parents\' tailored conformity. London proved that fashion could come from the street, not just the salon.',
    color: SKY,
  },
  {
    year: '1967–1975',
    title: 'Hippie Fashion: Anti-Fashion as Fashion',
    description:
      'Tie-dye, embroidered jeans, fringe, flowing maxi dresses, bare feet, and ethnic-inspired clothing from India, Morocco, and Guatemala. Hippie fashion was the first movement to explicitly reject Western fashion\'s commercial system — ironic, since it was immediately commercialized. The hippie wardrobe said: I reject materialism, mass production, and Western cultural dominance. That it said this via imported textiles purchased at boutiques was a contradiction hippies rarely acknowledged.',
    color: GREEN,
  },
  {
    year: '1970s',
    title: 'Disco, Polyester & the Death of Subtlety',
    description:
      'Platform shoes, wide-lapel suits, gold lamé, spandex, polyester leisure suits — disco fashion was designed to catch light on a dance floor and be visible from across a nightclub. It was unapologetically synthetic, unapologetically sexual, and unapologetically joyful. Diane von Furstenberg\'s wrap dress (1974) bridged the gap between disco glamour and feminist practicality — a garment that was alluring, comfortable, and didn\'t require help to put on.',
    color: FUCHSIA,
  },
  {
    year: '1976–1979',
    title: 'Punk: Fashion as Weapon',
    description:
      'Vivienne Westwood and Malcolm McLaren\'s SEX shop on King\'s Road sold ripped T-shirts, safety pins, bondage gear, and deliberately offensive graphics. Punk fashion was designed to provoke — to make the wearer look dangerous, unemployable, and contemptuous of respectable society. It was anti-fashion that became the most influential fashion movement of the late 20th century. Every luxury brand that sells "distressed" clothing owes a debt to punks who actually lived in those conditions.',
    color: CRIMSON,
  },
];

// ── 1980s–1990s ─────────────────────────────────────────────────────────────

const EIGHTIES_NINETIES_INSIGHTS: InsightEntry[] = [
  {
    label: 'Power Dressing (1980s): Armor for the Boardroom',
    detail:
      'Shoulder pads, structured blazers, bold colors, gold buttons — 1980s power dressing was women adapting male corporate uniform into female form. Designers like Donna Karan and Giorgio Armani built empires on this silhouette. The power suit said: I belong here. It was fashion as professional credential, designed for women entering corporate America in numbers for the first time.',
  },
  {
    label: 'Japanese Avant-Garde: Rei Kawakubo & Yohji Yamamoto',
    detail:
      'In 1981, Kawakubo (Comme des Garçons) and Yamamoto showed collections in Paris that horrified the establishment: asymmetric, deconstructed, oversized, black, with deliberate holes and raw edges. Critics called it "Hiroshima chic." It was the most radical challenge to Western fashion aesthetics in the 20th century — questioning beauty, symmetry, and the female form itself. Kawakubo asked: why must clothing flatter the body? What if clothing has its own logic?',
  },
  {
    label: 'Streetwear Emerges: From Stüssy to Supreme',
    detail:
      'Shawn Stussy started screen-printing surf T-shirts in 1980. By the late 1980s, skateboarding, hip-hop, and surfing cultures had fused into "streetwear" — a fashion category that would eventually generate more cultural influence than Paris couture. Supreme (1994), BAPE (1993), and later Off-White (2012) proved that a logo on a hoodie could command prices rivaling luxury houses. Streetwear inverted fashion\'s hierarchy: authenticity replaced craftsmanship as the primary value.',
  },
  {
    label: 'Grunge: Fashion Hates Itself (1990s)',
    detail:
      'When Marc Jacobs showed a grunge collection for Perry Ellis in 1992 (flannel shirts, combat boots, silk flower dresses), he was fired. Grunge — Nirvana, Soundgarden, oversized flannel, torn jeans, thrift-store layers — was aggressively anti-fashion. Its defining aesthetic was looking like you didn\'t care, which required, paradoxically, considerable effort. When high fashion tried to co-opt it, grunge fans were disgusted. When it died, fashion moved to its opposite extreme: 1990s minimalism.',
  },
  {
    label: '1990s Minimalism & Supermodels',
    detail:
      'Calvin Klein, Helmut Lang, and Jil Sander stripped fashion to essentials: clean lines, neutral colors, no decoration. Meanwhile, the supermodel era (Naomi, Cindy, Claudia, Christy, Linda) made fashion\'s gatekeepers as famous as the designs. Linda Evangelista\'s quote — "We don\'t wake up for less than $10,000 a day" — defined the era\'s excess. Minimalist clothing, maximalist celebrity: the contradiction was the point.',
  },
  {
    label: 'Hip-Hop Fashion: Culture as Currency',
    detail:
      'Oversized silhouettes, gold chains, Timberland boots, Kangol hats, Fubu, Karl Kani, Sean John — hip-hop created its own fashion system parallel to the mainstream. Run-DMC\'s "My Adidas" (1986) was the first celebrity sneaker deal. Hip-hop fashion was aspirational and confrontational: wearing luxury logos that traditional luxury brands didn\'t want on Black bodies. When Dapper Dan made knock-off Gucci, Louis Vuitton, and Fendi pieces for hip-hop royalty, he was sued — then, decades later, hired.',
  },
];

// ── 2000s–Present ───────────────────────────────────────────────────────────

const MODERN_TIMELINE: TimelineEntry[] = [
  {
    year: '2000s',
    title: 'Fast Fashion: Speed Kills (Quality, Workers, Planet)',
    description:
      'Zara\'s model — design to store in 2 weeks (vs. 6 months for traditional fashion) — revolutionized the industry. H&M, Primark, and later Shein pushed the cycle even faster: new styles daily, prices so low garments became disposable. Fast fashion democratized trend access but at catastrophic cost: the Rana Plaza factory collapse (Bangladesh, 2013) killed 1,134 garment workers, exposing the human price of a $5 T-shirt. Fashion\'s greatest business innovation was also its greatest moral failure.',
    color: CRIMSON,
  },
  {
    year: '2010s',
    title: 'Athleisure: The Erasure of Dress Codes',
    description:
      'Lululemon, Nike, Adidas, and later Outdoor Voices blurred the line between gym clothes and everyday wear. Leggings became pants. Sneakers became formal. Hoodies appeared in boardrooms. Athleisure wasn\'t just a trend — it was the final collapse of Western dress codes that had been weakening since the 1960s. When Mark Zuckerberg wore a grey T-shirt to Congress, it was a power move: I\'m so important I don\'t need to dress up for you.',
    color: TEAL,
  },
  {
    year: '2010s–Present',
    title: 'Social Media: Everyone Is a Fashion Magazine',
    description:
      'Instagram (2010), TikTok (2016), and fashion bloggers dismantled the traditional fashion media hierarchy. A teenager in Lagos with a smartphone and sense of style can now influence global trends faster than a Vogue editor. "Outfit of the day" posts replaced magazine editorials. Micro-trends cycle in weeks, not seasons. Algorithms decide what\'s fashionable. The fashion industry hasn\'t had this little control over its own narrative since before Worth invented the fashion show.',
    color: INDIGO,
  },
  {
    year: '2020s',
    title: 'Sustainability Crisis: Fashion\'s Reckoning',
    description:
      'Fashion produces 92 million tons of textile waste annually. It\'s responsible for 20% of global wastewater and 10% of carbon emissions. Greenwashing is rampant — brands market "sustainable collections" that represent less than 1% of their output. Real change is happening at the margins: resale platforms (ThredUp, Depop, The RealReal), rental services, regenerative agriculture for fibers, and legislation (France banned destruction of unsold clothing in 2020). But the fundamental model — produce more, sell more, discard more — remains intact.',
    color: EMERALD,
  },
  {
    year: '2020s',
    title: 'Gender Fluidity & Digital Fashion',
    description:
      'The binary division of fashion into "menswear" and "womenswear" is dissolving. Harry Styles in a Vogue dress, Billy Porter in a tuxedo gown, and the rise of gender-neutral brands reflect changing attitudes. Meanwhile, digital fashion — garments that exist only as digital files, worn on avatars or AR-filtered onto photos — represents fashion\'s next frontier. NFT fashion, virtual runway shows, and AI-generated designs suggest a future where fashion may not require fabric at all.',
    color: PURPLE,
  },
];

// ── Global Fashion ──────────────────────────────────────────────────────────

const GLOBAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'African Wax Prints: Colonial Imposition Turned Cultural Identity',
    detail:
      'Dutch companies mass-produced Indonesian batik imitations for African markets in the 19th century. African consumers transformed these industrial fabrics into powerful cultural symbols — choosing patterns for weddings, funerals, and political statements. Designers like Duro Olowu, Lisa Folawiyo, and Stella Jean have brought African textiles to global runways. The wax print\'s journey — from colonial commodity to symbol of African identity — is fashion history\'s most complex cultural narrative.',
  },
  {
    label: 'The Indian Sari: 5,000 Years of Uncut Elegance',
    detail:
      'A single unstitched rectangle of fabric (typically 5–9 yards) draped in over 100 regional styles across South Asia. The sari has survived Mughal rule, British colonialism, and Western fashion influence. When Gandhi promoted khadi (handspun cotton) as resistance to British textiles, the sari became a weapon of independence. Today, Indian designers like Sabyasachi Mukherjee and Tarun Tahiliani are reimagining the sari for global luxury markets — proving that 5,000-year-old fashion can be contemporary.',
  },
  {
    label: 'Japanese Kimono: Tradition as Resistance',
    detail:
      'The kimono — "thing to wear" — evolved over centuries into one of the world\'s most sophisticated garment traditions, with rules governing fabric, pattern, color, and formality based on season, age, marital status, and occasion. Western clothing largely replaced the kimono for daily wear after the Meiji Restoration (1868), but the kimono survived as ceremonial dress and cultural anchor. Contemporary designers like Jotaro Saito are making the kimono relevant for younger generations.',
  },
  {
    label: 'Fashion Decolonization',
    detail:
      'For centuries, "fashion" meant "Western fashion." Non-Western dress was categorized as "costume" or "traditional dress" — implicitly less creative, less modern. This hierarchy is now being challenged: African Fashion Weeks (Lagos, Dakar, Johannesburg), Chinese designers reinterpreting hanfu, Indigenous designers reclaiming textile traditions. The question is no longer whether non-Western fashion belongs on global stages — it\'s whether Western fashion\'s claim to universal authority was ever legitimate.',
  },
];

// ── Key Designers ───────────────────────────────────────────────────────────

const KEY_DESIGNERS: FigureEntry[] = [
  {
    name: 'Charles Frederick Worth',
    years: '1825–1895',
    contribution: 'Invented the concept of the fashion designer. Created the first fashion house, first runway shows, first designer labels. Before Worth, dressmakers were servants. After Worth, they were artists.',
  },
  {
    name: 'Coco Chanel',
    years: '1883–1971',
    contribution: 'Replaced aristocratic decoration with democratic simplicity. Jersey fabric, little black dress, Chanel No. 5, costume jewelry. Made poverty chic and comfort elegant. Fashion\'s most influential figure.',
  },
  {
    name: 'Christian Dior',
    years: '1905–1957',
    contribution: 'The New Look (1947) reset fashion\'s direction overnight. Revived Paris as fashion capital after WWII. Built the first global luxury brand licensing empire. Died at 52 — a 10-year career that defined the century.',
  },
  {
    name: 'Yves Saint Laurent',
    years: '1936–2008',
    contribution: 'Le Smoking tuxedo for women (1966), safari jacket, Mondrian dress. Bridged haute couture and ready-to-wear. Made high fashion wearable and political. "Fashion fades, style is eternal."',
  },
  {
    name: 'Rei Kawakubo',
    years: '1942–present',
    contribution: 'Comme des Garçons challenged every assumption about beauty, symmetry, and the body. Showed lumps, bumps, and asymmetry as beauty. Fashion\'s most radical living designer — still showing collections that confuse and inspire.',
  },
  {
    name: 'Alexander McQueen',
    years: '1969–2010',
    contribution: 'Fashion as theater, provocation, and dark beauty. Skull scarves, armadillo shoes, spray-painted dress on a live runway. Combined Savile Row tailoring with raw emotional intensity. "I want people to be afraid of the women I dress."',
  },
  {
    name: 'Virgil Abloh',
    years: '1980–2021',
    contribution: 'Bridged streetwear, high fashion, art, and architecture. First Black American artistic director at Louis Vuitton. Off-White\'s quotation marks and industrial tape became the defining aesthetic of the 2010s. Proved fashion\'s gatekeepers could be bypassed.',
  },
  {
    name: 'Vivienne Westwood',
    years: '1941–2022',
    contribution: 'Brought punk to fashion and fashion to activism. From SEX shop provocateur to climate campaigner. Tartan, corsetry, historical references weaponized as cultural critique. "Buy less, choose well, make it last."',
  },
];

// ── Political Dress ─────────────────────────────────────────────────────────

const POLITICAL_DRESS_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Suffragette Color Code',
    detail:
      'Suffragettes adopted purple (dignity), white (purity), and green (hope) as their official colors in 1908. Wearing these colors was a public political statement at a time when women couldn\'t vote. Fashion as protest uniform — a template later adopted by every social movement from Black Panthers\' berets to pink pussy hats.',
  },
  {
    label: 'Gandhi\'s Khadi Revolution',
    detail:
      'When Gandhi spun his own cotton and urged Indians to boycott British textiles, he turned fashion into anticolonial warfare. Homespun khadi became the uniform of Indian independence. The spinning wheel appeared on India\'s flag. One man choosing what to wear — and what not to buy — helped end an empire.',
  },
  {
    label: 'The Zoot Suit Riots (1943)',
    detail:
      'Mexican-American and Black youth wearing exaggerated zoot suits — wide legs, long jackets, extravagant use of fabric — during wartime rationing were attacked by white servicemen in Los Angeles. The suits were a deliberate rejection of wartime conformity and racial submission. Fashion as defiance provoked literal violence. Clothing had never been more political — or more dangerous.',
  },
  {
    label: 'The Black Dress as Protest',
    detail:
      'From Congresswomen wearing white to honor suffragettes, to Hollywood\'s #MeToo black dress code at the 2018 Golden Globes, to Zelenskyy\'s military green T-shirt, political dress remains potent. Clothing communicates allegiance, resistance, and identity faster than any speech. Fashion is never just fashion — it\'s always a statement about power.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (self-contained, matching other deep-dive pages)
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

const FIGURE_COLORS = [BURGUNDY, GOLD, CRIMSON, TEAL, INDIGO, ROSE, AMBER, GREEN, PURPLE, SKY];

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

export default function HistoryOfFashionPage() {
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
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 20,
              background: `linear-gradient(135deg, ${BURGUNDY}, ${GOLD}, ${FUCHSIA})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Threads of Power — The History of Fashion (3000 BCE–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              Fashion is never just clothing. It is power made visible — who rules, who rebels, who belongs, and who is excluded. From Egyptian pharaohs wrapped in royal linen to teenagers posting outfit-of-the-day videos on TikTok, what humans put on their bodies has always been a declaration: of wealth, of politics, of identity, of defiance.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is the story of 5,000 years of fashion — from Tyrian purple that cost more than gold to fast fashion that costs less than a coffee. Along the way: sumptuary laws that made wearing the wrong color a crime, corsets that reshaped women's organs, a little black dress that democratized elegance, and a $1.7-trillion industry now confronting the environmental catastrophe it created. Fashion is humanity's oldest language. This is how we learned to speak it.
            </p>
          </motion.div>
        </header>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
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

        {/* Section 1: Ancient World */}
        <SectionWrapper
          id="ancient-world"
          icon="🏛️"
          title="The Ancient World: When Clothing Became Identity (3000 BCE–500 CE)"
          accentColor={GOLD}
          intro="Before fashion, there was clothing — functional protection against cold, sun, and thorns. Fashion began the moment humans started using clothing to communicate. In the ancient world, what you wore didn't just suggest your status — it legally defined it. Emperors, priests, and generals encoded power into fabric, color, and drape. The rules were absolute: wear the wrong thing, and you could die."
        >
          <TimelineCard entries={ANCIENT_TIMELINE} />
        </SectionWrapper>

        {/* Section 2: Medieval */}
        <SectionWrapper
          id="medieval"
          icon="⚔️"
          title="Medieval Fashion: Laws, Guilds & the Black Death (500–1400)"
          accentColor={AMBER}
          intro="Medieval fashion was controlled fashion. Governments legislated what each class could wear with obsessive detail — not because they cared about aesthetics, but because clothing threatened the social order. When a wealthy merchant dressed like a nobleman, the entire class system became legible. Fashion was too dangerous to be left to personal choice."
        >
          <InsightGrid items={MEDIEVAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 3: Renaissance */}
        <SectionWrapper
          id="renaissance"
          icon="🎨"
          title="Renaissance Fashion: Spectacle, Excess & the Body as Canvas (1400–1600)"
          accentColor={CORAL}
          intro="The Renaissance made fashion competitive. Italian city-states, Spanish courts, and Tudor England engaged in an arms race of sartorial display. Clothing became architecture — padded, structured, slashed, and layered to transform the human body into a walking monument to wealth. If medieval fashion was about following rules, Renaissance fashion was about breaking them as expensively as possible."
        >
          <TimelineCard entries={RENAISSANCE_TIMELINE} />
        </SectionWrapper>

        {/* Section 4: Court & Baroque */}
        <SectionWrapper
          id="court-baroque"
          icon="👑"
          title="Court & Baroque: Versailles Rules the World (1600–1789)"
          accentColor={ROYAL_PURPLE}
          intro="Louis XIV didn't just wear fashion — he weaponized it. Versailles became the world's first fashion capital not by artistic merit alone, but by deliberate state policy. French textiles were a strategic export. French taste was a diplomatic tool. For 150 years, every European court dressed French, ate French, and spoke French — because Louis made it impossible not to."
        >
          <TimelineCard entries={COURT_TIMELINE} />
        </SectionWrapper>

        {/* Section 5: Industrial Revolution */}
        <SectionWrapper
          id="industrial-revolution"
          icon="🏭"
          title="Industrial Revolution: Fashion for the Masses (1750–1850)"
          accentColor={TEAL}
          intro="The Industrial Revolution didn't just change how clothing was made — it changed who could wear it. The sewing machine, synthetic dyes, and factory production broke the aristocratic monopoly on fashion. For the first time in history, a factory worker could afford clothing that approximated what a gentleman wore. Fashion became a consumer product — and the modern fashion industry was born."
        >
          <InsightGrid items={INDUSTRIAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 6: Victorian Era */}
        <SectionWrapper
          id="victorian"
          icon="🎩"
          title="The Victorian Era: Crinolines, Mourning & the Department Store (1837–1901)"
          accentColor={ROSE}
          intro="Victorian fashion was a world of contradictions: liberation through engineering (the crinoline freed legs from heavy petticoats), restriction through morality (mourning codes dictated years of black), and democratization through commerce (department stores made fashion accessible). The Victorians didn't just wear fashion — they codified it into an elaborate system of social rules that governed every occasion."
        >
          <TimelineCard entries={VICTORIAN_TIMELINE} />
        </SectionWrapper>

        {/* Section 7: Early 20th Century */}
        <SectionWrapper
          id="early-20th"
          icon="✂️"
          title="The Early 20th Century: Liberation & System (1900–1920)"
          accentColor={INDIGO}
          intro="The early 1900s saw fashion's infrastructure formalize (haute couture rules, fashion magazines, seasonal cycles) even as its aesthetics radicalized. Poiret killed the corset. WWI killed impracticality. The fashion system that emerged — Paris at the top, seasonal collections, media gatekeepers — would endure for a century."
        >
          <InsightGrid items={EARLY_20TH_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: 1920s–1940s */}
        <SectionWrapper
          id="interwar"
          icon="💃"
          title="1920s–1940s: Chanel, Hollywood & Wartime (1920–1945)"
          accentColor={GOLD}
          intro="Three forces reshaped fashion in a single generation: Chanel's revolution of simplicity, Hollywood's power to dictate what millions wore, and WWII's brutal lesson that fashion must survive scarcity. The woman who emerged from 1945 wore shorter skirts, simpler clothes, and stronger shoulders than her grandmother could have imagined — and was about to be transformed again."
        >
          <TimelineCard entries={INTERWAR_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: Postwar Revolution */}
        <SectionWrapper
          id="postwar"
          icon="🌹"
          title="The Postwar Revolution: Dior, Youth & Counter-Culture (1947–1960)"
          accentColor={FUCHSIA}
          intro="Dior's New Look in 1947 was the last time a single fashion show changed everything. But the real revolution was demographic: the baby boom created a youth market that would, within a decade, seize fashion from the establishment and never give it back. The 1950s were fashion's last decade of top-down authority."
        >
          <InsightGrid items={POSTWAR_INSIGHTS} />
        </SectionWrapper>

        {/* Section 10: 1960s–1970s */}
        <SectionWrapper
          id="sixties-seventies"
          icon="✌️"
          title="1960s–1970s: Revolution, Counter-Culture & the Street (1960–1979)"
          accentColor={GREEN}
          intro="The 1960s shattered fashion's top-down model. For the first time, the street dictated to the salon. London overtook Paris. Youth overtook age. The miniskirt, hippie fringe, disco glitter, and punk safety pins all emerged from subcultures, not design houses. Fashion's center of gravity shifted permanently — from telling people what to wear, to chasing what people were already wearing."
        >
          <TimelineCard entries={SIXTIES_TIMELINE} />
        </SectionWrapper>

        {/* Section 11: 1980s–1990s */}
        <SectionWrapper
          id="eighties-nineties"
          icon="🔊"
          title="1980s–1990s: Power, Deconstruction & the Rise of Streetwear (1980–1999)"
          accentColor={PURPLE}
          intro="The 1980s and 1990s tore fashion apart and reassembled it. Power dressing armed women for corporate battle. Japanese designers questioned beauty itself. Hip-hop created a parallel fashion universe. Grunge rejected everything. And streetwear — born in surf shops and skate parks — began its long march to dominating luxury fashion. By 2000, the old hierarchies were broken."
        >
          <InsightGrid items={EIGHTIES_NINETIES_INSIGHTS} />
        </SectionWrapper>

        {/* Section 12: 2000s–Present */}
        <SectionWrapper
          id="modern"
          icon="📱"
          title="2000s–Present: Fast Fashion, Sustainability & the Digital Age"
          accentColor={EMERALD}
          intro="The 21st century gave fashion its greatest scale and its greatest crisis. Fast fashion made trends available to everyone instantly and cheaply — at catastrophic environmental and human cost. Social media democratized fashion influence while accelerating consumption to unsustainable speeds. Fashion is now confronting the fundamental question: can an industry built on perpetual novelty survive on a finite planet?"
        >
          <TimelineCard entries={MODERN_TIMELINE} />
        </SectionWrapper>

        {/* Section 13: Global Fashion */}
        <SectionWrapper
          id="global-fashion"
          icon="🌍"
          title="Global Fashion: Beyond the Western Lens"
          accentColor={CORAL}
          intro="For centuries, 'fashion history' meant 'European fashion history.' The rest of the world's textile traditions — many far older and more sophisticated — were dismissed as 'costume.' That hierarchy is collapsing. African, Asian, and Indigenous fashion traditions are demanding (and receiving) recognition not as exotic curiosities but as creative systems equal to any Parisian atelier."
        >
          <InsightGrid items={GLOBAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 14: Political Dress */}
        <SectionWrapper
          id="political-dress"
          icon="✊"
          title="Fashion as Politics: Clothing That Changed History"
          accentColor={CRIMSON}
          intro="Fashion is never apolitical. Every garment is a choice, and every choice communicates. Throughout history, clothing has been used to enforce power, resist oppression, signal solidarity, and provoke confrontation. The most significant fashion moments aren't on runways — they're in streets, courtrooms, and revolutions."
        >
          <InsightGrid items={POLITICAL_DRESS_INSIGHTS} />
        </SectionWrapper>

        {/* Section 15: Key Designers */}
        <SectionWrapper
          id="key-designers"
          icon="🪡"
          title="Key Designers: The Architects of Modern Fashion"
          accentColor={GOLD}
          intro="Fashion is shaped by systems, economics, and culture — but individuals matter. These designers didn't just create beautiful clothing. They changed what fashion could be, who it was for, and what it meant. Each one broke rules that seemed permanent and established new ones that endured."
        >
          <FigureGrid figures={KEY_DESIGNERS} />
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
              { to: '/history-of-film', label: 'History of Film (Hollywood Glamour)' },
              { to: '/age-of-sail', label: 'Age of Sail (Global Trade Routes)' },
              { to: '/korean-war', label: 'Korean War (Military Fashion)' },
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
            "Fashion is the armor to survive the reality of everyday life."
            — Bill Cunningham
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
