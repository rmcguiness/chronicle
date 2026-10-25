/**
 * HistoryOfFilmPage — comprehensive deep-dive on the History of Cinema (1820s–Present).
 *
 * Route: /history-of-film
 *
 * Sections:
 *  1. Hero — headline, overview of cinema's transformative power
 *  2. Pre-Cinema — persistence of vision, Muybridge, Kinetoscope
 *  3. Birth of Cinema — Lumière Brothers, Méliès, nickelodeons
 *  4. Silent Era — Chaplin, Griffith, German Expressionism, Soviet montage
 *  5. Sound and the Golden Age — The Jazz Singer, Hays Code, Citizen Kane
 *  6. Postwar & International Cinema — Neorealism, New Wave, Kurosawa
 *  7. Hollywood Renaissance — Movie Brats, Jaws, Star Wars
 *  8. Blockbuster Era — VHS, CGI, Spielberg, indie cinema, Disney Renaissance
 *  9. Digital Revolution — streaming, MCU, COVID impact
 * 10. Film as History — propaganda, cultural records, race in cinema
 * 11. Language of Cinema — key terms, the 7 basic cuts
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const SILVER = '#c0c0c0';
const BLUE = '#3b82f6';
const STEEL = '#64748b';
const ASH = '#94a3b8';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const GREEN = '#22c55e';
const ROSE = '#f43f5e';
const GOLD = '#f59e0b';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const SKY = '#38bdf8';
const CINEMA_RED = '#b91c1c';

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
    label: 'December 28, 1895',
    detail: 'First paid public film screening — Lumière Brothers, Grand Café, Paris. 130 years ago.',
  },
  {
    label: '900+ careers ended',
    detail: 'The Jazz Singer (1927) ended the silent era almost overnight — hundreds of silent stars never made another film.',
  },
  {
    label: '#1 for 50+ years',
    detail: 'Citizen Kane (1941) voted best film of all time in every major critics\' poll for over five decades.',
  },
  {
    label: '$29 billion',
    detail: 'Marvel Cinematic Universe worldwide box office (2008–2023) — the most successful franchise in film history.',
  },
  {
    label: '~10,000 films/year',
    detail: 'Annual films produced worldwide — from Hollywood blockbusters to Nollywood, Bollywood, and independent cinema.',
  },
  {
    label: '$33.9 billion',
    detail: 'Global box office in 2023, recovered from COVID — proving theatrical cinema is diminished but not dead.',
  },
];

// ── Pre-Cinema: Persistence of Vision ───────────────────────────────────────

const PRE_CINEMA_TIMELINE: TimelineEntry[] = [
  {
    year: '1824',
    title: 'Thaumatrope',
    description:
      'A simple disc with different images on each side — spin it, and the images merge. The thaumatrope demonstrated "persistence of vision," the principle that the human eye retains an image for a fraction of a second after it disappears. This optical illusion is the foundation of all cinema: movies are really just still images shown fast enough that your brain perceives continuous motion.',
    color: AMBER,
  },
  {
    year: '1832–1834',
    title: 'Phenakistoscope & Zoetrope',
    description:
      'Spinning discs and cylinders with sequential images that created the illusion of movement when viewed through slits. These "philosophical toys" were the first devices to display animated sequences — ancestors of every film projector. The zoetrope (1834) was particularly popular, allowing multiple viewers to watch the same animation simultaneously, foreshadowing the communal experience of cinema.',
    color: TEAL,
  },
  {
    year: '1878',
    title: 'Eadweard Muybridge: The Galloping Horse',
    description:
      'Leland Stanford bet that a galloping horse lifts all four legs off the ground simultaneously. Muybridge proved it by setting up 12 cameras triggered by trip wires — creating the first motion picture sequence. The photographs settled the bet, but more importantly, they proved that photography could capture motion invisible to the naked eye. Muybridge had accidentally invented the concept of the motion picture.',
    color: GOLD,
  },
  {
    year: '1891',
    title: 'Edison\'s Kinetoscope',
    description:
      'Thomas Edison\'s Kinetoscope was a peep-show box that displayed 30-second films to individual viewers — one person at a time, peering through an eyepiece. It was commercially successful but fundamentally limited: a private viewing experience, not a communal one. Edison thought movies were a novelty, not an art form. He missed the key innovation: projection.',
    color: INDIGO,
  },
  {
    year: '1895',
    title: 'The Key Invention: Projection',
    description:
      'The crucial leap wasn\'t capturing moving images — it was projecting them onto a screen for an audience. Multiple inventors were racing toward this goal, but the Lumière Brothers got there first with their Cinématographe: a combined camera, projector, and printer in one device. Projection transformed film from a novelty into a mass medium. One film, one audience, one shared emotional experience — cinema was born.',
    color: CRIMSON,
  },
];

// ── Birth of Cinema ─────────────────────────────────────────────────────────

const BIRTH_TIMELINE: TimelineEntry[] = [
  {
    year: '1895',
    title: 'The Lumière Brothers: First Public Screening',
    description:
      'December 28, 1895 — the Grand Café, Boulevard des Capucines, Paris. Auguste and Louis Lumière screened ten short films to a paying audience of 33 people. What they showed was astonishing in its ordinariness: workers leaving a factory, a boat arriving, a baby being fed. Reality itself was the novelty. Audiences had never seen photographic images move. Within weeks, the screenings were selling out. Within months, the Lumières were sending cameramen around the world.',
    color: GOLD,
  },
  {
    year: '1896',
    title: 'L\'Arrivée d\'un train en gare de La Ciotat',
    description:
      'Legend says that audiences screamed and fled when the Lumière Brothers showed a train arriving at a station, believing it would burst through the screen. The story is almost certainly exaggerated — but it captures something real about early cinema\'s power. For audiences who had never seen moving images, a life-sized train heading directly toward them was genuinely disorienting. The legend endures because it speaks to cinema\'s fundamental magic: the ability to make the unreal feel real.',
    color: STEEL,
  },
  {
    year: '1902',
    title: 'Georges Méliès: A Trip to the Moon',
    description:
      'If the Lumière Brothers captured reality, Georges Méliès invented fantasy. A former stage magician, Méliès realized that film could show the impossible. "A Trip to the Moon" — with its iconic image of a bullet-shaped rocket lodged in the Moon\'s eye — was the first science fiction film, the first to use special effects (dissolves, superimposition, stop-motion), and the first to tell a narrative story. Méliès proved cinema wasn\'t just a recording device — it was a storytelling medium.',
    color: PURPLE,
  },
  {
    year: '1903',
    title: 'The Great Train Robbery',
    description:
      'Edwin S. Porter\'s 12-minute film for Edison Studios established the grammar of cinema. It was the first film to use crosscutting between simultaneous scenes, close-ups for dramatic effect, and parallel editing to build tension. The final shot — a bandit firing directly at the camera — was so startling that theaters posted warnings. "The Great Train Robbery" proved that film could tell complex stories using visual editing techniques that were entirely new to human experience.',
    color: CRIMSON,
  },
  {
    year: '1905+',
    title: 'Nickelodeons: Cinema for the Masses',
    description:
      'Storefronts across America were converted into tiny cinemas — seats for 50–200 people, a screen, a projector, and a 5-cent admission price (a "nickel"). By 1910, there were over 10,000 nickelodeons in the United States. They created the first mass movie audience: immigrants who didn\'t speak English, working-class families, children. Silent films transcended language barriers. Cinema became the first truly democratic mass entertainment — and the first billion-dollar entertainment industry.',
    color: GREEN,
  },
];

// ── Silent Era ──────────────────────────────────────────────────────────────

const SILENT_ERA_INSIGHTS: InsightEntry[] = [
  {
    label: 'Charlie Chaplin: The Tramp',
    detail:
      'Chaplin\'s "Little Tramp" — the bowler hat, the cane, the mustache, the waddle — became the most recognized character on Earth. Chaplin proved that comedy was a universal language: his films played identically in New York, Berlin, Tokyo, and Buenos Aires. No translation needed. He combined physical comedy with genuine pathos, creating films that made audiences laugh and cry in the same reel. By 1918, Chaplin was the most famous person in the world.',
  },
  {
    label: 'Buster Keaton & Harold Lloyd',
    detail:
      'Keaton and Lloyd were Chaplin\'s great rivals in physical comedy. Keaton — "The Great Stone Face" — performed death-defying stunts with a deadpan expression that somehow made them funnier. His film "The General" (1926), set during the Civil War, is still considered one of the greatest films ever made. Lloyd specialized in thrill comedy — his famous scene hanging from a clock face high above a city street remains one of cinema\'s most iconic images.',
  },
  {
    label: 'German Expressionism',
    detail:
      'Post-WWI Germany produced films of extraordinary visual darkness. "The Cabinet of Dr. Caligari" (1920) used distorted sets, extreme shadows, and nightmarish angles to externalize psychological states. "Nosferatu" (1922) created the template for vampire cinema — and all horror cinema that followed. When German filmmakers fled to Hollywood after Hitler\'s rise, they brought Expressionist techniques with them, shaping film noir, horror, and the visual language of psychological thriller.',
  },
  {
    label: 'Soviet Montage Theory',
    detail:
      'Sergei Eisenstein theorized that meaning in cinema comes not from individual shots but from the collision between them — "montage." His film "Battleship Potemkin" (1925) demonstrated the theory brilliantly, particularly the "Odessa Steps" massacre sequence: by editing together shots of soldiers, screaming civilians, a baby carriage rolling down steps, and close-ups of terror, Eisenstein created an emotional impact greater than any single image could achieve. Every action sequence in modern cinema descends from this technique.',
  },
  {
    label: 'The Studio System Emerges',
    detail:
      'By the 1920s, Hollywood had consolidated into a handful of major studios — Universal, Paramount, MGM, Fox, Warner Bros. — that controlled every aspect of filmmaking: production, distribution, and exhibition. They owned the studios, the stars (under long-term contracts), and the theaters. This "vertical integration" gave studios monopolistic control over American cinema. It created the star system, the genre system, and the industrial model of filmmaking that would dominate for decades.',
  },
];

const SILENT_FIGURES: FigureEntry[] = [
  {
    name: 'D.W. Griffith',
    years: '1875–1948',
    contribution:
      'Director of "The Birth of a Nation" (1915) — technically revolutionary (cross-cutting, close-ups, tracking shots, epic scale) but content appallingly racist, glorifying the KKK. The first blockbuster and the most controversial film ever made. Sparked a real KKK revival. His follow-up "Intolerance" (1916), four parallel stories across 2,500 years, remains influential. Griffith embodies cinema\'s paradox: technical genius in service of moral catastrophe.',
  },
  {
    name: 'Sergei Eisenstein',
    years: '1898–1948',
    contribution:
      'Soviet filmmaker who developed montage theory — the idea that editing is cinema\'s most powerful tool. "Battleship Potemkin" (1925) and its "Odessa Steps" sequence influenced every action film, every propaganda film, and every filmmaker who understood that the cut is where meaning is made.',
  },
  {
    name: 'Charlie Chaplin',
    years: '1889–1977',
    contribution:
      'The most famous person of the early 20th century. Created "The Tramp" — universal comedy transcending language. Later films like "The Great Dictator" (1940) and "Modern Times" (1936) combined comedy with political commentary. Co-founded United Artists to maintain creative control.',
  },
];

// ── Sound and the Golden Age ────────────────────────────────────────────────

const SOUND_TIMELINE: TimelineEntry[] = [
  {
    year: '1927',
    title: 'The Jazz Singer: Sound Arrives',
    description:
      'On October 6, 1927, Al Jolson looked into the camera and said "Wait a minute, wait a minute. You ain\'t heard nothin\' yet!" — and overnight, the entire film industry changed. "The Jazz Singer" wasn\'t the first film with sound, but it was the first commercial hit. Within two years, silent films were dead. Studios scrambled to install sound equipment. Careers were made and destroyed: some silent stars had voices that didn\'t match their screen personas. An entire art form — silent cinema — was erased in less than three years.',
    color: GOLD,
  },
  {
    year: '1934–1968',
    title: 'The Hays Code: Hollywood Censorship',
    description:
      'The Motion Picture Production Code (the "Hays Code") imposed strict moral censorship on American films for 34 years. No nudity, no profanity, no portrayal of interracial relationships, crime must always be punished, married couples must sleep in separate beds, clergymen could never be villains. The Code didn\'t just restrict content — it shaped how Hollywood told stories. Filmmakers learned to suggest what they couldn\'t show, creating a sophisticated visual language of implication. The Code\'s collapse in the 1960s unleashed the Hollywood Renaissance.',
    color: STEEL,
  },
  {
    year: '1939',
    title: 'The Golden Year: Hollywood\'s Peak',
    description:
      'Film historians call 1939 the greatest year in cinema history. In a single year, Hollywood released "Gone with the Wind," "The Wizard of Oz," "Stagecoach," "Mr. Smith Goes to Washington," "Wuthering Heights," and "Ninotchka." The studio system was at peak efficiency, producing films with technical polish, star power, and narrative sophistication that remain watchable 85 years later. The "Golden Age" wasn\'t nostalgia — it was genuine artistic achievement within an industrial framework.',
    color: GOLD,
  },
  {
    year: '1941',
    title: 'Citizen Kane: The Greatest Film?',
    description:
      'Orson Welles was 25 years old when he directed "Citizen Kane" — a film that reinvented cinematic language. Deep focus photography (everything in the frame is sharp), non-linear narrative structure, overlapping dialogue, expressionistic lighting, and a story told from multiple conflicting perspectives. It was a commercial failure on release (William Randolph Hearst, its inspiration, tried to suppress it), but critics recognized its genius. For over 50 years, it topped every "best film ever made" poll.',
    color: CRIMSON,
  },
  {
    year: '1942',
    title: 'Casablanca: Perfect Storytelling',
    description:
      'Shot quickly on a studio backlot with a script that was being rewritten daily, "Casablanca" somehow became the most perfectly constructed Hollywood film. Romance, politics, sacrifice, wit — every scene serves the story, every line of dialogue has become quotable. It demonstrates what the Golden Age studio system could achieve: a film that is simultaneously a wartime propaganda piece, a love story, a thriller, and a meditation on moral compromise. "Here\'s looking at you, kid."',
    color: AMBER,
  },
];

const GOLDEN_AGE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Genre Gets Codified',
    detail:
      'The Golden Age established the genre system that still structures cinema: westerns (Stagecoach, High Noon), film noir (Double Indemnity, The Maltese Falcon), musicals (Singin\' in the Rain), horror (Frankenstein, Dracula), romantic comedy (It Happened One Night). Studios used genres as production formulas — reliable templates for efficient storytelling. Audiences learned to expect specific pleasures from each genre. Hollywood didn\'t just make movies; it created the grammar of genre that every filmmaker since has either followed or deliberately subverted.',
  },
  {
    label: 'The Star System',
    detail:
      'Studios controlled stars through long-term contracts — seven years, exclusive, with the studio choosing every role. Stars were manufactured products: given new names, new biographies, new personalities. The studio controlled their public image, arranged their dates, and punished disobedience with suspension. But stars sold tickets. Humphrey Bogart, Bette Davis, James Cagney, Katharine Hepburn — their faces on a poster guaranteed an audience. The star system created the celebrity culture we still live in.',
  },
  {
    label: 'Hitchcock\'s Craft',
    detail:
      'Alfred Hitchcock refined suspense into a science. "Rear Window" (1954) confined the entire film to a single apartment. "Vertigo" (1958) created the dolly zoom — a disorienting camera technique still called "the Vertigo effect." "Psycho" (1960) killed its star 30 minutes in, breaking every rule. Hitchcock understood audience psychology better than any filmmaker before or since: he knew that showing the audience the bomb under the table creates more tension than the explosion.',
  },
];

// ── Postwar & International Cinema ──────────────────────────────────────────

const INTERNATIONAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Italian Neorealism',
    detail:
      '"Bicycle Thieves" (1948) was shot on actual streets with non-professional actors, telling the story of a working man whose stolen bicycle threatens his livelihood. No Hollywood glamour, no studio backlots, no stars — just the texture of real life in postwar Italy. Neorealism proved that cinema didn\'t need spectacle to be powerful. It influenced every socially conscious film movement that followed, from the French New Wave to Iranian cinema to the Dardenne Brothers.',
  },
  {
    label: 'French New Wave (Nouvelle Vague)',
    detail:
      'In the late 1950s, young French critics — Godard, Truffaut, Rohmer, Rivette — picked up cameras and broke every rule. Jump cuts (Godard\'s "Breathless," 1960), handheld cameras, shooting on real streets, breaking the fourth wall, nonlinear editing. They were cinephiles first, filmmakers second — and they brought a self-conscious awareness of film history to their work. The New Wave didn\'t just change French cinema; it liberated filmmakers worldwide to experiment with form.',
  },
  {
    label: 'Japanese Cinema Goes Global',
    detail:
      'Akira Kurosawa\'s "Rashomon" (1950) — telling the same story from four contradictory perspectives — introduced Western audiences to Japanese cinema. "Seven Samurai" (1954) became the template for ensemble action films: remade as "The Magnificent Seven," its structure influenced "Star Wars," "The Avengers," and every team-assembles-for-a-mission story since. Kurosawa proved that great cinema transcended cultural boundaries.',
  },
  {
    label: 'Television Competition',
    detail:
      'By the 1950s, television was stealing cinema\'s audience. Hollywood responded with everything TV couldn\'t offer: widescreen (CinemaScope, Cinerama), color, 3D, and epic spectacle. Films like "Ben-Hur" (1959), "Lawrence of Arabia" (1962), and "The Ten Commandments" (1956) were visual experiences impossible on a 12-inch black-and-white screen. The strategy worked temporarily, but the fundamental challenge — competing with entertainment delivered to people\'s living rooms — would return with streaming.',
  },
  {
    label: 'Art House Cinema in America',
    detail:
      'For the first time, American audiences could see foreign films. Small "art house" theaters in New York, San Francisco, and college towns screened Ingmar Bergman ("The Seventh Seal"), Federico Fellini ("8½"), and Michelangelo Antonioni ("L\'Avventura"). These films treated cinema as a serious art form — wrestling with existential questions, experimenting with narrative structure, refusing easy answers. They created the concept of the "film buff" and laid the groundwork for the Hollywood Renaissance.',
  },
];

// ── Hollywood Renaissance ───────────────────────────────────────────────────

const RENAISSANCE_TIMELINE: TimelineEntry[] = [
  {
    year: '1968',
    title: 'The Hays Code Collapses',
    description:
      'After 34 years, the Production Code was replaced by the MPAA rating system (G, PG, R, X). For the first time, American filmmakers could show nudity, violence, drug use, and moral ambiguity without censorship. The floodgates opened. Films could now reflect the real America — Vietnam, assassinations, Watergate, counterculture — rather than the sanitized fantasy the Hays Code demanded.',
    color: ROSE,
  },
  {
    year: '1969',
    title: 'Easy Rider: The Counterculture Arrives',
    description:
      'Peter Fonda and Dennis Hopper spent $400,000 making a film about two drug-dealing bikers crossing America. It grossed $60 million. Hollywood studios — which had been losing money on expensive musicals and biblical epics — suddenly realized they didn\'t understand their audience anymore. "Easy Rider" proved that young audiences wanted films that reflected their world: anti-establishment, morally complex, visually experimental. The studios began handing creative control to young directors.',
    color: GREEN,
  },
  {
    year: '1972',
    title: 'The Godfather: American Crime Epic',
    description:
      'Francis Ford Coppola\'s "The Godfather" redefined the American crime film — and the American film period. It combined operatic storytelling with documentary-style realism, Shakespearean family drama with brutal violence. Marlon Brando\'s Don Corleone became an iconic cultural figure. The film proved that commercial entertainment and artistic ambition were not mutually exclusive — the highest-grossing film of 1972 was also one of the greatest.',
    color: CRIMSON,
  },
  {
    year: '1975',
    title: 'Jaws: The Summer Blockbuster Is Born',
    description:
      'Steven Spielberg\'s shark thriller invented the modern blockbuster. Before "Jaws," films opened gradually in a few cities and expanded based on word of mouth. "Jaws" opened wide — hundreds of theaters simultaneously — supported by a massive TV advertising campaign. It became the first film to earn $100 million at the domestic box office. The "summer blockbuster" model — wide release, mass marketing, event-driven audiences — was born, and it changed Hollywood\'s economics permanently.',
    color: BLUE,
  },
  {
    year: '1977',
    title: 'Star Wars: Everything Changes',
    description:
      'George Lucas\'s space opera didn\'t just break box office records — it rewired Hollywood\'s DNA. "Star Wars" proved that the real money wasn\'t in ticket sales but in merchandising (toys, games, lunch boxes), sequels, and franchise extensions. It created the template for modern franchise filmmaking: a self-contained universe that could generate infinite content. The film itself was a masterpiece of mythic storytelling, but its business model was the real revolution. Every Marvel film, every Disney franchise, every cinematic universe traces back to "Star Wars."',
    color: GOLD,
  },
];

const MOVIE_BRATS: FigureEntry[] = [
  {
    name: 'Francis Ford Coppola',
    years: 'b. 1939',
    contribution:
      '"The Godfather" (1972) and "The Godfather Part II" (1974) — the greatest crime saga in cinema. "Apocalypse Now" (1979) — Vietnam as operatic nightmare. Coppola bet his career on every film and nearly went bankrupt making masterpieces.',
  },
  {
    name: 'Martin Scorsese',
    years: 'b. 1942',
    contribution:
      '"Taxi Driver" (1976), "Raging Bull" (1980), "Goodfellas" (1990) — Scorsese brought a visceral, kinetic energy to American cinema. His films explore violence, masculinity, guilt, and redemption with an intensity matched by no other director. Still making essential films decades later.',
  },
  {
    name: 'Steven Spielberg',
    years: 'b. 1946',
    contribution:
      'Invented the summer blockbuster ("Jaws"), then proved he could make art ("Schindler\'s List," "Saving Private Ryan"). The most commercially successful director in history — his films have grossed over $10 billion worldwide. Spielberg is cinema\'s great populist: serious craft in service of mass entertainment.',
  },
  {
    name: 'George Lucas',
    years: 'b. 1944',
    contribution:
      '"Star Wars" (1977) changed Hollywood economics forever. Lucas also pioneered digital filmmaking, founded Industrial Light & Magic (the most important visual effects company in history), and proved that a filmmaker could build an empire from a single creative vision.',
  },
];

// ── Blockbuster Era ─────────────────────────────────────────────────────────

const BLOCKBUSTER_INSIGHTS: InsightEntry[] = [
  {
    label: 'Home Video Changes Everything',
    detail:
      'VHS (from 1977) gave films a second economic life. By the mid-1980s, home video revenue exceeded theatrical revenue. This changed what got made: films that might fail in theaters could succeed on video. The video store became a film school for a generation — Quentin Tarantino famously worked at a video rental store before becoming a director. Home video also created the concept of the "cult film" — movies that failed theatrically but found passionate audiences on tape.',
  },
  {
    label: 'Jurassic Park: The CGI Revolution',
    detail:
      'When audiences saw living, breathing dinosaurs in "Jurassic Park" (1993), they knew everything had changed. Spielberg and Industrial Light & Magic proved that computer-generated imagery could create photorealistic creatures that were more convincing than any puppet or animatronic. Within a decade, CGI transformed every genre — from the liquid metal of "Terminator 2" to the digital armies of "The Lord of the Rings." Physical effects didn\'t disappear, but the digital revolution made the impossible routine.',
  },
  {
    label: 'Independent Cinema Revival',
    detail:
      'The Sundance Film Festival (founded 1978) and distributors like Miramax created a pipeline for independent films. "sex, lies, and videotape" (1989) proved indie films could be commercially viable. "Pulp Fiction" (1994) became a cultural phenomenon — Tarantino\'s non-linear storytelling, sharp dialogue, and pop-culture references influenced an entire generation. "Clerks" (1994), shot for $27,000, proved anyone could make a film. The indie movement was cinema\'s punk rock: low budget, high attitude, no permission needed.',
  },
  {
    label: 'Disney Renaissance',
    detail:
      'After years of mediocre releases, Disney rediscovered animation with "The Little Mermaid" (1989), "Beauty and the Beast" (1991), "Aladdin" (1992), and "The Lion King" (1994). These films combined Broadway-style musical storytelling with increasingly sophisticated animation, proving that animated films could be critical and commercial blockbusters. "The Lion King" grossed nearly $1 billion worldwide. The Renaissance also paved the way for Pixar\'s "Toy Story" (1995) — the first fully computer-animated feature film.',
  },
  {
    label: 'Titanic: Peak Blockbuster',
    detail:
      '"Titanic" (1997) was the most expensive film ever made ($200 million) and became the biggest worldwide box office hit in history ($1.8 billion). James Cameron\'s combination of epic spectacle, cutting-edge visual effects, and an old-fashioned love story proved that a single film could dominate global culture for months. It won 11 Academy Awards. "Titanic" represented the peak of the blockbuster model — a model that would soon be disrupted by digital technology and franchise thinking.',
  },
];

// ── Digital Revolution ──────────────────────────────────────────────────────

const DIGITAL_TIMELINE: TimelineEntry[] = [
  {
    year: '2000s',
    title: 'Digital Filmmaking Democratized',
    description:
      'Digital cameras and editing software transformed who could make films. A feature could be shot on a consumer camera and edited on a laptop. The gatekeepers — studios that controlled expensive film stock, processing labs, and distribution — lost their monopoly. YouTube (2005) created a platform for anyone to distribute video to a global audience. Filmmaking went from an industrial process requiring millions of dollars to something achievable with a phone and a story.',
    color: TEAL,
  },
  {
    year: '2008–2023',
    title: 'The Superhero Era: Marvel\'s Cinematic Universe',
    description:
      'Iron Man (2008) launched the Marvel Cinematic Universe — an interconnected series of films that functioned like serialized television on a blockbuster budget. Over 15 years, 32 films grossed $29 billion worldwide. The MCU changed Hollywood\'s risk calculus permanently: studios now prioritized "franchises" and "intellectual property" over original stories. The model was enormously profitable but critics argued it reduced cinema to content — interchangeable products designed to maximize brand value rather than artistic expression.',
    color: CRIMSON,
  },
  {
    year: '2007+',
    title: 'Netflix and the Streaming Disruption',
    description:
      'Netflix began streaming in 2007, and by the 2010s had fundamentally disrupted the theatrical model. "House of Cards" (2013) proved streaming could produce prestige content. Netflix eventually produced Oscar-winning films ("Roma," "The Power of the Dog"), blurring the line between cinema and television. The "streaming wars" followed: Disney+, HBO Max, Amazon Prime, Apple TV+. Theater attendance declined as audiences got used to watching new films at home.',
    color: INDIGO,
  },
  {
    year: '2020',
    title: 'COVID-19: The Great Disruption',
    description:
      'When theaters closed worldwide during the pandemic, studios released major films directly to streaming — something previously unthinkable. Warner Bros. put its entire 2021 slate on HBO Max simultaneously with theatrical release. The theatrical window — the months-long exclusivity period before home release — collapsed from 90 days to 45, then sometimes to zero. Many predicted the end of theatrical cinema entirely.',
    color: ROSE,
  },
  {
    year: '2023',
    title: 'Theaters Survive — But Transformed',
    description:
      'Reports of theatrical cinema\'s death were premature. "Top Gun: Maverick" (2022), "Avatar: The Way of Water" (2022), and the "Barbenheimer" phenomenon (2023) — where "Barbie" and "Oppenheimer" opened the same weekend and audiences saw both — proved that theaters could still create cultural events. But the model had changed: only the biggest films justified theatrical releases. Mid-budget dramas, comedies, and indie films increasingly went straight to streaming. Cinema survived, but its definition had permanently expanded.',
    color: GOLD,
  },
];

// ── Film as History ─────────────────────────────────────────────────────────

const FILM_HISTORY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Propaganda Power: Triumph of the Will',
    detail:
      'Leni Riefenstahl\'s "Triumph of the Will" (1935) documented the 1934 Nazi Party rally in Nuremberg with unprecedented cinematic sophistication — soaring cameras, heroic angles, rhythmic editing, Wagner on the soundtrack. It remains the most technically accomplished propaganda film ever made, and the most morally troubling. It demonstrated that cinema\'s power to create emotion could be weaponized — that the same techniques used to make audiences cry at love stories could make them worship dictators.',
  },
  {
    label: 'Birth of a Nation\'s Real-World Damage',
    detail:
      'D.W. Griffith\'s "Birth of a Nation" (1915) didn\'t just portray the KKK as heroes — it sparked a real KKK revival. The film was screened at the White House. Klan membership surged. The film demonstrated that cinema wasn\'t just entertainment; it could reshape public opinion and inspire real-world violence. It remains the clearest example of film\'s power to cause direct social harm — and a warning about the responsibility that comes with the medium\'s emotional reach.',
  },
  {
    label: 'Do the Right Thing (1989)',
    detail:
      'Spike Lee\'s film about racial tension in a Brooklyn neighborhood culminating in violence was — and remains — one of cinema\'s most honest examinations of race in America. Critics at the time worried it would incite violence (it didn\'t). Decades later, after incidents from Rodney King to George Floyd, "Do the Right Thing" keeps proving its relevance. The film asks a question it refuses to answer: when injustice is systemic, what is the "right thing"?',
  },
  {
    label: 'Schindler\'s List: Memory Through Narrative',
    detail:
      'Spielberg\'s "Schindler\'s List" (1993) — shot in black and white, on location in Poland — preserved Holocaust memory through narrative cinema in a way that documentaries and textbooks couldn\'t match. The film made audiences feel the individual human cost of genocide. Spielberg used his profits to establish the Shoah Foundation, which recorded 55,000 survivor testimonies. The film demonstrated that commercial cinema could serve as an act of historical preservation.',
  },
  {
    label: 'Films as Cultural Records',
    detail:
      'Every era\'s films reveal what that era valued, feared, and desired. 1950s science fiction reflected Cold War nuclear anxiety. 1970s paranoia thrillers ("The Parallax View," "All the President\'s Men") mirrored Watergate-era distrust. 1980s action films embodied Reagan-era individualism. Horror films are particularly revealing: what a society finds frightening exposes its deepest anxieties. Cinema is not just entertainment — it\'s an unintentional archive of collective psychology.',
  },
];

// ── Language of Cinema ──────────────────────────────────────────────────────

const CINEMA_LANGUAGE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Mise-en-scène',
    detail:
      'Everything within the frame: set design, lighting, costume, actor positioning, color. A director\'s most fundamental tool. When Wes Anderson precisely arranges symmetrical compositions, or when a noir film casts half an actor\'s face in shadow — that\'s mise-en-scène doing narrative work without dialogue.',
  },
  {
    label: 'Montage',
    detail:
      'The assembly of shots to create meaning through juxtaposition. Eisenstein\'s "intellectual montage" collides unrelated images to generate new ideas. The "training montage" (Rocky running up stairs) compresses time. Montage is cinema\'s unique contribution to storytelling — no other art form can create meaning by cutting between images.',
  },
  {
    label: 'The Dolly Zoom (Vertigo Effect)',
    detail:
      'Simultaneously zooming in while dollying backward (or vice versa), creating a disorienting effect where the subject stays the same size but the background stretches or compresses. Invented for Hitchcock\'s "Vertigo" (1958), it\'s been used by Spielberg ("Jaws"), Scorsese ("Goodfellas"), and Jackson ("Lord of the Rings") to convey psychological shock.',
  },
  {
    label: 'The 180-Degree Rule',
    detail:
      'An imaginary line between two characters in conversation. The camera must stay on one side of this line, or the audience loses spatial orientation — characters appear to switch positions. Breaking this rule deliberately (as Kubrick often did) creates subliminal unease. Most viewers have never heard of the 180-degree rule, but they instinctively feel when it\'s broken.',
  },
  {
    label: 'The 7 Basic Cuts',
    detail:
      'Cut (instant switch between shots), dissolve (one image fades into another), fade (to or from black), wipe (one image pushes another off screen), jump cut (jarring cut within the same scene — Godard\'s signature), match cut (visual similarity links two different scenes — "2001" bone-to-satellite), and cross-cut (alternating between simultaneous actions). These seven tools are cinema\'s punctuation. Every film you\'ve ever seen is built from combinations of these cuts.',
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

const FIGURE_COLORS = [CINEMA_RED, GOLD, CRIMSON, TEAL, INDIGO, ROSE, AMBER, GREEN, PURPLE, SKY];

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

export default function HistoryOfFilmPage() {
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
              background: `linear-gradient(135deg, ${CINEMA_RED}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lights, Camera, Century — The History of Cinema (1895–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              On December 28, 1895, thirty-three people paid one franc each to watch ten short films in a Parisian café. They saw workers leaving a factory, a train arriving at a station, a baby being fed. Within a generation, cinema would become the most powerful storytelling medium in human history — reshaping politics, culture, and the way billions of people understand the world.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              From flickering images in Victorian parlor toys to a $34-billion global industry, the history of film is a story of relentless reinvention: sound replaced silence, color replaced black-and-white, digital replaced celluloid, streaming challenged theaters. Along the way, cinema created heroes and villains, launched political movements, preserved historical memory, and defined the visual imagination of the 20th century. This is how moving pictures changed everything.
            </p>
          </motion.div>
        </header>

        {/* Birth of a Nation callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(185, 28, 28, 0.08)',
            border: `1px solid ${CINEMA_RED}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: CINEMA_RED, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            🎬 Cinema's Paradox: Technical Genius, Moral Catastrophe
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            "The Birth of a Nation" (1915) invented modern filmmaking — cross-cutting, close-ups, tracking shots, epic scale — and used every innovation to glorify the Ku Klux Klan. It was the most technically revolutionary film of its era and the most morally reprehensible. It sparked a real KKK revival. The paradox of cinema's greatest technical achievement being its greatest moral failure haunts film history to this day.
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

        {/* Section 1: Pre-Cinema */}
        <SectionWrapper
          id="pre-cinema"
          icon="🔮"
          title="Pre-Cinema: The Persistence of Vision (1820s–1895)"
          accentColor={AMBER}
          intro="Before cinema, there were optical toys — spinning discs and cylinders that exploited how the human eye retains images. These 'philosophical amusements' weren't just parlor tricks. They were the scientific foundation for the most transformative medium of the 20th century."
        >
          <TimelineCard entries={PRE_CINEMA_TIMELINE} />
        </SectionWrapper>

        {/* Section 2: Birth of Cinema */}
        <SectionWrapper
          id="birth"
          icon="📽️"
          title="The Birth of Cinema (1895–1910)"
          accentColor={GOLD}
          intro="Cinema didn't emerge gradually — it exploded. Within fifteen years of the first public screening, film went from a scientific curiosity to a global entertainment industry with thousands of dedicated venues, pioneering storytellers, and audiences of millions."
        >
          <TimelineCard entries={BIRTH_TIMELINE} />
        </SectionWrapper>

        {/* Section 3: Silent Era */}
        <SectionWrapper
          id="silent-era"
          icon="🎭"
          title="The Silent Era (1910–1927)"
          accentColor={SILVER}
          intro="Without dialogue, silent filmmakers developed a purely visual language — and discovered that images could communicate across every culture on Earth. The silent era produced the first global celebrities, the first film theorists, and the first masterpieces that are still studied and admired a century later."
        >
          <InsightGrid items={SILENT_ERA_INSIGHTS} />
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              Key Figures
            </h3>
            <FigureGrid figures={SILENT_FIGURES} />
          </div>
        </SectionWrapper>

        {/* Section 4: Sound and the Golden Age */}
        <SectionWrapper
          id="golden-age"
          icon="🎙️"
          title="Sound and the Golden Age (1927–1948)"
          accentColor={GOLD}
          intro="Sound didn't just add dialogue to movies — it destroyed an entire art form and built a new one. The transition was brutal, the creative possibilities were limitless, and the result was Hollywood's Golden Age: an era of studio-controlled efficiency that produced some of the greatest films ever made."
        >
          <TimelineCard entries={SOUND_TIMELINE} />
          <div style={{ marginTop: 28 }}>
            <InsightGrid items={GOLDEN_AGE_INSIGHTS} />
          </div>
        </SectionWrapper>

        {/* Section 5: Postwar & International */}
        <SectionWrapper
          id="international"
          icon="🌍"
          title="The Postwar Era and International Cinema (1948–1968)"
          accentColor={TEAL}
          intro="After World War II, the world outside Hollywood discovered its own cinematic voices. Italian streets, French cafés, and Japanese forests became film sets. These movements shattered Hollywood's monopoly on film grammar and proved that cinema could be art — not just entertainment."
        >
          <InsightGrid items={INTERNATIONAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 6: Hollywood Renaissance */}
        <SectionWrapper
          id="renaissance"
          icon="🎬"
          title="The Hollywood Renaissance (1967–1980)"
          accentColor={ROSE}
          intro="When the old studio system collapsed, a generation of film-school-educated directors — the 'Movie Brats' — seized control. For a brief, extraordinary decade, Hollywood made films that were commercially successful, artistically ambitious, and culturally relevant. Then Jaws and Star Wars invented the blockbuster, and everything changed again."
        >
          <TimelineCard entries={RENAISSANCE_TIMELINE} />
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              The Movie Brats
            </h3>
            <FigureGrid figures={MOVIE_BRATS} />
          </div>
        </SectionWrapper>

        {/* Section 7: Blockbuster Era */}
        <SectionWrapper
          id="blockbuster-era"
          icon="🦖"
          title="The Blockbuster Era (1980–2000)"
          accentColor={GREEN}
          intro="Star Wars and Jaws rewired Hollywood's DNA. The sequel, the franchise, and the merchandise deal replaced the standalone film as the industry's core product. But the same era also produced an independent cinema revival that proved there was still room for films made on passion, not budgets."
        >
          <InsightGrid items={BLOCKBUSTER_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: Digital Revolution */}
        <SectionWrapper
          id="digital-revolution"
          icon="💻"
          title="Digital Revolution (2000–Present)"
          accentColor={INDIGO}
          intro="Digital technology democratized filmmaking and then disrupted how films reached audiences. The smartphone put a camera in every pocket. Streaming put a cinema in every living room. The result: more films being made than ever before, reaching more people than ever before — while the theatrical experience fights for survival."
        >
          <TimelineCard entries={DIGITAL_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: Film as History */}
        <SectionWrapper
          id="film-as-history"
          icon="📜"
          title="Film as History"
          accentColor={CRIMSON}
          intro="Cinema doesn't just reflect history — it shapes it. Films have revived hate groups, preserved genocide memories, sparked national conversations about race, and served as unintentional archives of what each era valued and feared. Understanding film is understanding the 20th century's most powerful tool for shaping public consciousness."
        >
          <InsightGrid items={FILM_HISTORY_INSIGHTS} />
        </SectionWrapper>

        {/* Section 10: Language of Cinema */}
        <SectionWrapper
          id="film-language"
          icon="🎞️"
          title="The Language of Cinema"
          accentColor={SKY}
          intro="Cinema developed its own grammar — a visual language as structured as any written language, with rules that filmmakers follow or break for specific effects. Understanding this language doesn't diminish the magic of movies. It reveals how the magic works."
        >
          <InsightGrid items={CINEMA_LANGUAGE_INSIGHTS} />
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
              { to: '/digital-revolution', label: 'Digital Revolution' },
              { to: '/wwii', label: 'World War II (Propaganda)' },
              { to: '/civil-rights', label: 'Civil Rights Movement' },
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
            "Of all the arts, for us cinema is the most important."
            — Vladimir Lenin, 1922
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
