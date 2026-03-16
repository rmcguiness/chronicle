/**
 * HistoryOfTelevisionPage — comprehensive deep-dive on the History of Television (1884–Present).
 *
 * Route: /history-of-television
 *
 * Sections:
 *  1. Hero — headline, overview of TV's transformative journey
 *  2. Key Stats — landmark numbers and milestones
 *  3. The Invention of Television — mechanical to electronic
 *  4. The Broadcast Era — commercial TV, Big Three dominance
 *  5. Television's Social Impact — debates, moon landing, Vietnam
 *  6. The Sitcom Golden Age — Lucy to Seinfeld
 *  7. The Cable Revolution — HBO, CNN, MTV, fragmentation
 *  8. Reality TV Explosion — Real World to Kardashians
 *  9. Prestige Television Renaissance — Sopranos to Peak TV
 * 10. The Streaming Era — Netflix to Squid Game
 * 11. Television Around the World — British comedy, telenovelas, K-drama, anime
 * 12. The Technology of Television — remote controls to smart TVs
 * 13. The Future of Television — consolidation, short-form, AI, immersive
 * 14. Milestone Timeline — 1884 to 2025
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const TV_BLUE = '#1d4ed8';
const STATIC_GRAY = '#94a3b8';
const BROADCAST_GOLD = '#f59e0b';
const CABLE_GREEN = '#22c55e';
const STREAM_PURPLE = '#a855f7';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const ROSE = '#f43f5e';
const SKY = '#38bdf8';
const SLATE = '#64748b';

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

// ── Key Stats ───────────────────────────────────────────────────────────────

const KEY_STATS: InsightEntry[] = [
  {
    label: 'September 7, 1927',
    detail:
      'Philo Farnsworth, a 21-year-old self-taught inventor from Utah, transmitted the first fully electronic television image — a single horizontal line — in his San Francisco laboratory. The moment marked the birth of the technology that would reshape human civilization.',
  },
  {
    label: '1.6 billion TV households',
    detail:
      'Television reaches virtually every corner of the globe, with an estimated 1.6 billion households worldwide owning at least one television set. No other communication technology in history has achieved such ubiquitous penetration into daily human life.',
  },
  {
    label: 'Nixon-Kennedy, 1960',
    detail:
      'The first televised presidential debate demonstrated TV\'s power to shape democracy. Radio listeners thought Nixon won on substance, but the 70 million TV viewers saw Kennedy\'s youth and composure against Nixon\'s sweating, unshaven face — and chose Kennedy. Television became the kingmaker of American politics.',
  },
  {
    label: 'M*A*S*H finale: 105.9M viewers',
    detail:
      'On February 28, 1983, the final episode of M*A*S*H drew 105.9 million viewers — the most-watched broadcast in American television history. The episode, "Goodbye, Farewell and Amen," held that record for decades and demonstrated TV\'s unique power to create shared national moments.',
  },
  {
    label: '$85B+ on streaming content',
    detail:
      'By 2023, streaming platforms were collectively spending over $85 billion annually on original content — more than the entire GDP of many nations. Netflix alone spent $17 billion, while Disney, Amazon, Apple, and Warner Bros. Discovery poured tens of billions more into the content arms race.',
  },
  {
    label: '4+ hours per day',
    detail:
      'The average American watches more than four hours of television per day — roughly 28 hours per week, or two full months per year. When streaming, social media video, and YouTube are included, screen time climbs even higher, making TV the dominant leisure activity in modern life.',
  },
];

// ── Invention Timeline ──────────────────────────────────────────────────────

const INVENTION_TIMELINE: TimelineEntry[] = [
  {
    year: '1884',
    title: 'Paul Nipkow\'s Spinning Disc',
    description:
      'German engineering student Paul Nipkow patented the "Nipkow disc" — a spinning disc with a spiral pattern of holes that could scan an image line by line and transmit it as electrical signals. Though Nipkow never built a working prototype, his concept established the theoretical foundation for mechanical television. The disc became the basis for every early television experiment over the next four decades, proving that images could be decomposed into sequential signals and reconstructed at a distance. Nipkow\'s insight was deceptively simple: break a picture into lines, send them one at a time, and reassemble them faster than the eye can detect.',
    color: AMBER,
  },
  {
    year: '1925',
    title: 'John Logie Baird Demonstrates Mechanical Television',
    description:
      'Scottish inventor John Logie Baird gave the first public demonstration of a working television system at Selfridge\'s department store in London, transmitting grainy, flickering silhouette images using a modified Nipkow disc. The resolution was abysmal — just 30 lines compared to modern HD\'s 1,080 — but the achievement was revolutionary. Baird had proven that moving images could be captured, transmitted, and displayed in real time. He would go on to demonstrate color television (1928), stereoscopic 3D television (1928), and the first transatlantic television transmission, tirelessly pushing mechanical TV forward even as electronic alternatives began to emerge.',
    color: TEAL,
  },
  {
    year: '1927',
    title: 'Philo Farnsworth\'s Electronic Television',
    description:
      'At just 21 years old, Philo Farnsworth transmitted the first fully electronic television image in his San Francisco lab on September 7, 1927. Unlike Baird\'s mechanical system with its spinning discs and moving parts, Farnsworth\'s "image dissector" used electrons to scan images — no mechanical components needed. The idea had come to him at age 14, reportedly inspired by the parallel rows of a plowed potato field in Idaho. Farnsworth\'s electronic approach would ultimately win the technology war against mechanical television, becoming the foundation for every TV set manufactured for the next 80 years. Tragically, Farnsworth spent years in patent battles with RCA and died in relative obscurity, despite inventing the technology that defined the 20th century.',
    color: TV_BLUE,
  },
  {
    year: '1928',
    title: 'First Transatlantic Television Signal',
    description:
      'John Logie Baird achieved the first transatlantic television transmission, sending a flickering image from London to New York via radio waves. The image quality was crude — barely recognizable — but the symbolic achievement was enormous. Television could cross oceans. Baird also transmitted television signals to a ship at sea, demonstrating that the technology was not confined to wired connections. These experiments captured public imagination worldwide and signaled that television would eventually become a global medium, not merely a local curiosity confined to laboratory demonstrations.',
    color: INDIGO,
  },
  {
    year: '1939',
    title: 'RCA Debuts TV at the World\'s Fair',
    description:
      'David Sarnoff, the visionary head of RCA, chose the 1939 New York World\'s Fair to introduce commercial television to the American public. Using Vladimir Zworykin\'s iconoscope camera tube (which RCA had developed partly by studying Farnsworth\'s patents), RCA broadcast President Franklin Roosevelt\'s opening speech — making him the first sitting president to appear on television. Sarnoff boldly declared that television would become "a new art and a new industry." Though World War II delayed mass adoption by nearly a decade, the World\'s Fair demonstration planted television firmly in the American imagination. The future had arrived, even if most people couldn\'t afford it yet.',
    color: BROADCAST_GOLD,
  },
];

// ── Broadcast Era Timeline ──────────────────────────────────────────────────

const BROADCAST_ERA_TIMELINE: TimelineEntry[] = [
  {
    year: '1941',
    title: 'First Commercial Television Broadcast',
    description:
      'On July 1, 1941, station WNBT (later NBC) in New York aired the first officially licensed commercial television broadcast in the United States. The milestone was marked by a Bulova watch advertisement — a simple image of a clock face superimposed on a test pattern, lasting about 10 seconds — for which Bulova paid between $4 and $9. It was modest in every way, yet it established the advertising-supported business model that would fund American television for the next 80 years. The commercial model meant that television content would be shaped not by artistic vision or government mandate, but by the imperative to deliver audiences to advertisers — a dynamic that still defines broadcast television today.',
    color: BROADCAST_GOLD,
  },
  {
    year: '1947–1948',
    title: 'The Television Boom',
    description:
      'After World War II ended, television ownership exploded with a speed that stunned even its advocates. The number of TV sets in American homes surged from roughly 44,000 in 1947 to over one million by the end of 1948, and by 1950 nearly 10 million households had a set. Returning GIs with new suburban homes and rising disposable income drove demand. Television sets became the centerpiece of the American living room, replacing the radio console as the family\'s primary source of entertainment and information. Neighborhoods would gather around the one family who owned a set, creating impromptu communal viewing experiences that foreshadowed television\'s power as a social bonding force.',
    color: TV_BLUE,
  },
  {
    year: '1951',
    title: 'I Love Lucy Premieres — Reinventing the Sitcom',
    description:
      'When "I Love Lucy" debuted on CBS on October 15, 1951, it didn\'t just become the most popular show on television — it invented the modern sitcom format. Lucille Ball and Desi Arnaz insisted on filming with three cameras before a live studio audience rather than performing live, creating a template that sitcoms would follow for the next 70 years. They pioneered the concept of reruns by owning their own film negatives through their company Desilu Productions — a revolutionary business decision that made them enormously wealthy. Ball became the first woman to run a major television production studio, and the show\'s portrayal of an interracial Cuban-American marriage pushed boundaries in 1950s America.',
    color: CRIMSON,
  },
  {
    year: '1953',
    title: 'NTSC Color Standard Adopted',
    description:
      'The National Television System Committee (NTSC) established the first color broadcasting standard in 1953, enabling compatible color transmissions that could still be received on black-and-white sets. However, color television sets initially cost over $1,000 — equivalent to roughly $11,000 in today\'s dollars — putting them far beyond the reach of most American families. Color adoption was agonizingly slow throughout the 1950s and early 1960s. It wasn\'t until NBC began broadcasting its entire prime-time schedule in color in 1965, and set prices dropped below $500, that color TV finally achieved mass adoption. By the late 1960s, color had become the standard, and black-and-white television was a relic.',
    color: AMBER,
  },
  {
    year: '1960s',
    title: 'Big Three Dominance',
    description:
      'For most Americans in the 1950s and 1960s, television meant exactly three choices: NBC, CBS, and ABC. These three networks commanded over 90% of the total viewing audience, creating a shared national culture in a way that seems almost inconceivable in today\'s fragmented media landscape. When 70 million people watched the same episode of "Bonanza" or "The Beverly Hillbillies," it gave the entire nation a common reference point. The Big Three model concentrated enormous cultural power in the hands of a few network executives, who functioned as de facto national gatekeepers — deciding what Americans would watch, discuss, and care about. This oligopoly would endure until cable television began to fracture the audience in the 1980s.',
    color: INDIGO,
  },
];

// ── Television's Social Impact ──────────────────────────────────────────────

const TV_SOCIAL_IMPACT: InsightEntry[] = [
  {
    label: 'The Ed Sullivan Show (1948–1971)',
    detail:
      'Ed Sullivan\'s Sunday night variety show served as America\'s cultural gatekeeper for over two decades. When Elvis Presley appeared in September 1956, 60 million viewers watched — roughly 82% of the television audience — and CBS famously filmed him only from the waist up to avoid showing his suggestive hip movements. When the Beatles performed on February 9, 1964, 73 million Americans tuned in, and juvenile crime reportedly dropped to zero that night. Sullivan didn\'t just showcase talent; he decided what entered the American mainstream. His show was a weekly referendum on popular culture, introducing acts from across racial and genre lines to the largest audience in history.',
  },
  {
    label: 'Nixon-Kennedy Debate, 1960',
    detail:
      'The first televised presidential debate on September 26, 1960, became the defining case study in television\'s political power. Radio listeners who heard the debate on substance generally believed Richard Nixon had won. But the 70 million television viewers saw a different contest entirely: Kennedy appeared tanned, relaxed, and confident in a well-fitted suit, while Nixon — recovering from a hospital stay, refusing makeup — looked pale, sweaty, and uncomfortable under the hot studio lights. Polls showed that TV viewers overwhelmingly chose Kennedy as the winner. The lesson was permanent: in the television age, image trumps argument, and appearance is substance. Every presidential campaign since has been fought primarily on television.',
  },
  {
    label: 'Moon Landing, July 20, 1969',
    detail:
      'An estimated 600 million people worldwide — roughly one-fifth of Earth\'s entire population — watched live as Neil Armstrong stepped onto the lunar surface. It was television\'s finest hour: the moment when the medium fulfilled its ultimate promise of making the whole world witness to the same event simultaneously. Walter Cronkite, normally the picture of journalistic composure, was visibly moved on air. The moon landing demonstrated that television could unite humanity across every national, linguistic, and cultural boundary in a shared experience of awe. No medium before or since has replicated that moment of genuine global communion.',
  },
  {
    label: 'Vietnam: The "Living Room War"',
    detail:
      'Vietnam became the first war that Americans watched unfold on their television screens every evening during the nightly news. Correspondents filmed combat, casualties, and civilian suffering with an immediacy that no previous war coverage had achieved. The turning point came on February 27, 1968, when CBS anchor Walter Cronkite — the most trusted man in America — concluded a special report by declaring the war was unwinnable. President Lyndon Johnson reportedly said, "If I\'ve lost Cronkite, I\'ve lost Middle America." Within weeks, Johnson announced he would not seek re-election. Television had not just reported the war — it had helped end it, demonstrating the medium\'s power to shift public opinion and alter the course of history.',
  },
  {
    label: 'Watergate Hearings, 1973',
    detail:
      'When the Senate Watergate Committee held televised hearings in the summer of 1973, an astonishing 71% of American households tuned in. The hearings transformed a political scandal into a national drama, with witnesses, revelations, and the slow unraveling of a presidency playing out live on television. Americans watched John Dean testify about a "cancer on the presidency" and heard Alexander Butterfield reveal the existence of Nixon\'s secret taping system. Television served as the ultimate accountability tool — forcing transparency on a White House that had operated in secrecy. The hearings demonstrated that when television turns its cameras on power, the audience becomes a jury of millions.',
  },
];

// ── The Sitcom Golden Age ───────────────────────────────────────────────────

const GOLDEN_AGE_SITCOMS: InsightEntry[] = [
  {
    label: 'I Love Lucy (1951–1957)',
    detail:
      'Lucille Ball didn\'t just star in the most popular show on television — she fundamentally reinvented how television was made and who could make it. As co-founder of Desilu Productions with husband Desi Arnaz, Ball became the first woman to run a major television production studio. The show pioneered the three-camera setup filmed before a live audience, invented the concept of syndicated reruns (by insisting on owning the film negatives), and featured one of the first interracial couples on American television — Ball was white, Arnaz was Cuban. When Lucy\'s real-life pregnancy was written into the show in 1953, more Americans watched the birth episode than Eisenhower\'s inauguration the following day.',
  },
  {
    label: 'All in the Family (1971–1979)',
    detail:
      'Norman Lear\'s sitcom about bigoted blue-collar worker Archie Bunker shattered every taboo in American television. In an era when sitcoms dealt with safe domestic comedy, "All in the Family" tackled racism, the Vietnam War, women\'s liberation, homosexuality, rape, and abortion — often in a single season. Archie Bunker was simultaneously the show\'s villain and its most beloved character, a contradiction that forced audiences to confront their own prejudices. The show was the number-one rated program for five consecutive seasons, proving that American audiences would embrace challenging, provocative content if it was also genuinely funny. Lear went on to create "The Jeffersons," "Maude," and "Good Times," building a television empire on social commentary.',
  },
  {
    label: 'Cheers (1982–1993)',
    detail:
      'When "Cheers" premiered in 1982, it was the lowest-rated show on NBC\'s schedule, finishing 74th out of 77 shows in its first season. Network executives nearly cancelled it, but critical acclaim and slow word-of-mouth saved the series. By its third season, "Cheers" was a top-ten hit, and by its end it was one of the most beloved shows in television history. Set almost entirely in a single Boston bar, "Cheers" proved that character-driven comedy — built on the chemistry between Ted Danson\'s womanizing bartender and Shelley Long\'s (later Kirstie Alley\'s) uptight intellectual — could sustain a decade-long run. Its finale drew 80.4 million viewers, and its spinoff "Frasier" ran for another 11 seasons.',
  },
  {
    label: 'The Cosby Show (1984–1992)',
    detail:
      'Bill Cosby\'s sitcom about an affluent African American family — a doctor married to a lawyer, raising five children in a Brooklyn brownstone — broke racial stereotypes and revived NBC from last place to first in the network ratings. The show demonstrated that a Black family could anchor a mainstream, number-one-rated series by depicting universal family experiences rather than focusing on racial struggle. At its peak, 63 million viewers watched a single episode. The show\'s cultural legacy has been complicated and partially eclipsed by Cosby\'s criminal conviction for sexual assault in 2018, creating one of television\'s most painful separations between art and artist.',
  },
  {
    label: 'Seinfeld (1989–1998)',
    detail:
      'Larry David and Jerry Seinfeld\'s self-described "show about nothing" deconstructed the sitcom from the inside out. Where traditional sitcoms ended with hugs and lessons learned, Seinfeld\'s characters were petty, selfish, and utterly unapologetic. The show turned the mundane details of urban life — waiting for a table at a Chinese restaurant, losing a car in a parking garage, the etiquette of regifting — into comedic masterpieces. Its four main characters were explicitly designed to never learn or grow. The finale, in which they were literally put on trial for their callousness, divided audiences, but the 76 million viewers who watched it confirmed Seinfeld\'s status as a cultural phenomenon. The show\'s influence on comedy writing — observational humor, interconnected storylines, refusal of sentimentality — remains pervasive.',
  },
];

// ── Cable Revolution Timeline ───────────────────────────────────────────────

const CABLE_REVOLUTION_TIMELINE: TimelineEntry[] = [
  {
    year: '1972',
    title: 'HBO Launches',
    description:
      'Home Box Office launched on November 8, 1972, as the first premium cable television network, initially serving just 365 subscribers in Wilkes-Barre, Pennsylvania. Its radical proposition was simple but revolutionary: pay a monthly fee and watch uncut, uncensored movies without commercial interruption. For the first time, television could show content that broadcast networks — beholden to advertisers and FCC regulations — could never air. HBO\'s subscription model freed it from the tyranny of ratings and advertiser sensitivities, eventually enabling it to produce original programming of unprecedented creative ambition. The phrase "It\'s not TV, it\'s HBO" would become more than a slogan — it would become a prophecy about the future of the medium.',
    color: STREAM_PURPLE,
  },
  {
    year: '1980',
    title: 'CNN Launches 24-Hour News',
    description:
      'When Ted Turner launched the Cable News Network on June 1, 1980, media executives called it "Chicken Noodle Network" and gave it little chance of survival. The idea of broadcasting news 24 hours a day, seven days a week seemed absurd — who would watch? But CNN proved that the appetite for immediate information was insatiable. The network came into its own during the Gulf War in 1991, when its round-the-clock live coverage from Baghdad made it the only source of real-time war reporting. CNN didn\'t just change how news was delivered; it changed the tempo of news itself, creating the always-on, breaking-news culture that now dominates media. Every cable news network and news website that followed — Fox News, MSNBC, digital news — owes its existence to Turner\'s "crazy" idea.',
    color: CRIMSON,
  },
  {
    year: '1981',
    title: 'MTV Debuts',
    description:
      'At 12:01 AM on August 1, 1981, MTV launched with the words "Ladies and gentlemen, rock and roll" followed by the Buggles\' "Video Killed the Radio Star." The network transformed music from a purely auditory experience into a visual one, creating an entirely new art form: the music video. MTV didn\'t just play music — it created visual culture. Madonna, Michael Jackson, and Prince became superstars not just because of their music but because of their videos. Michael Jackson\'s "Thriller" (1983) was a 14-minute mini-movie that premiered on MTV and became the most iconic music video ever made. MTV\'s rapid-fire editing style, youth-oriented branding, and visual sensibility influenced advertising, filmmaking, and graphic design for decades.',
    color: ROSE,
  },
  {
    year: '1979/1987',
    title: 'ESPN and Fox Broadcasting Break the Mold',
    description:
      'ESPN launched in 1979 with a then-absurd premise: a television network dedicated entirely to sports, 24 hours a day. Like CNN, it was mocked initially but ultimately proved that niche programming could sustain an entire network. ESPN became the most valuable property in cable television, generating billions in subscriber fees and advertising. Meanwhile, in 1987, Rupert Murdoch\'s Fox Broadcasting became the first successful fourth broadcast network, breaking the Big Three monopoly that had lasted for four decades. Fox achieved this by targeting younger demographics with edgier programming — "The Simpsons," "Married... with Children," "Beverly Hills, 90210" — that the established networks considered too risky. Together, ESPN and Fox demonstrated that both niche focus and insurgent competition could thrive in television\'s expanding universe.',
    color: CABLE_GREEN,
  },
  {
    year: '1990s',
    title: 'Cable Explosion: 500 Channels',
    description:
      'By the mid-1990s, the promise (or threat) of "500 channels" had become a reality. Cable and satellite systems offered viewers an unprecedented array of niche networks: Food Network (1993), HGTV (1994), Comedy Central (1991), the Sci-Fi Channel (1992), Cartoon Network (1992), and dozens more. Each network served a specific interest group, fragmenting the mass audience that the Big Three had once commanded. This was both liberation and loss. Viewers could now find content tailored precisely to their interests, but the shared cultural experience of 70 million people watching the same show simultaneously was fading. The 500-channel universe was a preview of the infinite-choice streaming landscape that would follow — and a harbinger of the cultural fragmentation that defines 21st-century media.',
    color: TV_BLUE,
  },
];

// ── Reality TV ──────────────────────────────────────────────────────────────

const REALITY_TV: InsightEntry[] = [
  {
    label: 'MTV\'s The Real World (1992)',
    detail:
      'When MTV placed seven strangers in a New York loft and filmed what happened, it created the blueprint for modern reality television. "The Real World" introduced nearly every convention of the genre: the confessional interview (participants speaking directly to camera about their feelings), the manufactured drama of incompatible personalities forced into close quarters, the careful casting of diverse archetypes designed to create conflict, and the illusion of unscripted authenticity that was actually shaped by hundreds of hours of editing. The show ran for 33 seasons and proved that compelling television could be made without scripts, professional actors, or large budgets — a revelation that would transform the economics of the entire industry.',
  },
  {
    label: 'Survivor (2000)',
    detail:
      'When the first season of "Survivor" aired in the summer of 2000, 51.7 million Americans watched the finale — making it the second-most-watched television event of that year, behind only the Super Bowl. Created by Mark Burnett, "Survivor" proved that unscripted competition could dominate prime time at a fraction of the cost of scripted drama. A single episode of "Survivor" cost roughly $1 million to produce, compared to $3–5 million for a scripted drama. The economics were irresistible to networks: comparable ratings at one-third the cost. "Survivor" launched the reality competition genre that would spawn "The Amazing Race," "Big Brother," "The Bachelor," and countless imitators, fundamentally reshaping what prime-time television looked like.',
  },
  {
    label: 'American Idol (2002–2016)',
    detail:
      'At its peak, "American Idol" drew over 30 million viewers per week, making it the most-watched non-sports program on American television for eight consecutive seasons. The show democratized stardom — anyone with a voice and a dream could audition — and created genuine musical careers: Kelly Clarkson, Carrie Underwood, Jennifer Hudson, and Adam Lambert all emerged from the competition. Equally important was its pioneering use of interactive voting, with viewers casting hundreds of millions of text-message and phone votes per season. "American Idol" turned passive viewers into active participants, foreshadowing the social media engagement that would later define how audiences interact with all television content.',
  },
  {
    label: 'The Bachelor / Real Housewives / Kardashians',
    detail:
      'The second wave of reality television transcended entertainment to become a lifestyle industry. "The Bachelor" (2002–present) turned romantic courtship into a competitive sport watched by millions. "The Real Housewives" franchise (2006–present) proved that wealthy women arguing at dinner parties could sustain an empire of spinoffs, reunion specials, and merchandise. Most transformative of all, "Keeping Up with the Kardashians" (2007–2021) demonstrated that a reality show could be a launchpad for a multi-billion-dollar business empire — Kim Kardashian parlayed her TV fame into cosmetics, shapewear, and social media influence worth an estimated $1.8 billion. These shows blurred the line between entertainment and advertising, making the participants simultaneously the product and the brand.',
  },
];

// ── Prestige Television ─────────────────────────────────────────────────────

const PRESTIGE_TV: TimelineEntry[] = [
  {
    year: '1999',
    title: 'The Sopranos Premieres on HBO',
    description:
      'When "The Sopranos" debuted on January 10, 1999, it permanently elevated television\'s artistic ambitions. Creator David Chase took the mob genre and turned it inward: Tony Soprano was a New Jersey mafia boss who saw a therapist for panic attacks. The show proved that television could achieve the moral complexity, visual sophistication, and narrative depth of cinema — and in some ways exceed it, using the long-form serial format to develop characters over years rather than hours. James Gandolfini\'s performance as Tony — violent, charismatic, sympathetic, monstrous — set a new standard for television acting. "The Sopranos" didn\'t just change what TV could be; it changed what serious artists were willing to create for the medium.',
    color: CRIMSON,
  },
  {
    year: '2002',
    title: 'The Wire: Television as Novel',
    description:
      'David Simon\'s "The Wire" on HBO adopted a novelistic structure that no television show had attempted before: each of its five seasons examined a different institution in Baltimore — the drug trade, the port unions, city government, public education, and the media — building a cumulative portrait of a city and a nation in decline. The show was never a ratings hit during its original run, but critics and scholars increasingly regard it as the greatest television series ever made. "The Wire" treated its characters — from drug dealers to police detectives to politicians — with equal complexity and compassion, refusing to reduce anyone to a hero or villain. It demonstrated that television\'s extended runtime could be used for social analysis of a depth and breadth that no film or novel could match.',
    color: TV_BLUE,
  },
  {
    year: '2008',
    title: 'Breaking Bad: The Pinnacle of the Golden Age',
    description:
      'Vince Gilligan pitched "Breaking Bad" with a single sentence: "We\'re going to take Mr. Chips and turn him into Scarface." Over five seasons on AMC, the show tracked Walter White\'s transformation from a mild-mannered high school chemistry teacher into a ruthless methamphetamine kingpin with a precision and moral clarity that set the standard for serialized storytelling. Bryan Cranston\'s performance earned him four Emmy Awards, and the show\'s final season drew 10.3 million viewers — extraordinary for a basic cable drama. "Breaking Bad" is widely considered the pinnacle of television\'s "golden age," a show where every scene, every shot, and every line of dialogue served a deliberate narrative purpose. Its success also proved that AMC — previously known primarily for old movies — could compete with HBO in prestige television.',
    color: CABLE_GREEN,
  },
  {
    year: '2011',
    title: 'Game of Thrones: Epic Fantasy with Movie Budgets',
    description:
      'HBO\'s adaptation of George R.R. Martin\'s fantasy novels did something unprecedented: it brought epic fantasy — a genre associated with niche fandoms — into the mainstream of global popular culture. "Game of Thrones" began modestly but grew into a cultural colossus, with production budgets reaching $15 million per episode by its final season. The show\'s willingness to kill major characters (the "Red Wedding" in Season 3 became a global cultural event) and its morally gray storytelling attracted audiences who had never watched fantasy before. The series finale on May 19, 2019, drew 19.3 million viewers. Though its controversial final season divided fans, "Game of Thrones" proved that television could deliver cinematic spectacle on a scale that rivaled — and sometimes exceeded — Hollywood blockbusters.',
    color: BROADCAST_GOLD,
  },
  {
    year: '2013',
    title: 'Peak TV Begins',
    description:
      'FX president John Landgraf coined the term "Peak TV" in 2015, but the phenomenon began around 2013 as the number of scripted original series in the United States began climbing at an unprecedented rate. By 2019, there were over 500 scripted originals airing across broadcast, cable, and streaming platforms — more than double the number from just five years earlier. The result was a paradox: more high-quality television was being produced than at any point in history, but there was also more quality TV than any single person could possibly watch. Audiences fragmented, water-cooler consensus evaporated, and the very concept of a "must-see" show became relative. Peak TV meant that television was simultaneously in its greatest artistic era and its most overwhelming one.',
    color: STREAM_PURPLE,
  },
];

// ── Streaming Era ───────────────────────────────────────────────────────────

const STREAMING_ERA: TimelineEntry[] = [
  {
    year: '2007',
    title: 'Netflix Begins Streaming',
    description:
      'Netflix had operated as a DVD-by-mail rental service since 1997, already disrupting Blockbuster Video\'s brick-and-mortar model. But in January 2007, the company launched its streaming service, initially offering a small library of older films and TV shows that subscribers could watch instantly on their computers. The selection was limited, the video quality was mediocre, and few people noticed. But Reed Hastings had identified the future: on-demand streaming would eventually replace both physical media and scheduled broadcasting. Netflix\'s early streaming service was a Trojan horse — seemingly insignificant, but positioned to transform the entire entertainment industry once broadband internet became ubiquitous.',
    color: CRIMSON,
  },
  {
    year: '2013',
    title: 'House of Cards: The Binge Model Arrives',
    description:
      'On February 1, 2013, Netflix released all 13 episodes of "House of Cards" simultaneously — its first major original series and a direct challenge to the traditional television model. Instead of weekly episodes designed around commercial breaks and seasonal schedules, Netflix offered an entire season at once, trusting viewers to set their own pace. The result was "binge-watching," a term that entered the cultural lexicon almost overnight. Kevin Spacey\'s political thriller was itself well-crafted, but the delivery model was the true revolution. Netflix had used data analytics to determine that its subscribers loved David Fincher, Kevin Spacey, and British political dramas — and then spent $100 million creating a show algorithmically designed to appeal to them. Television would never be scheduled the same way again.',
    color: TV_BLUE,
  },
  {
    year: '2019',
    title: 'The Streaming Wars Erupt',
    description:
      'Within an 18-month span, virtually every major media company launched its own streaming service to compete with Netflix: Disney+ (November 2019), Apple TV+ (November 2019), HBO Max (May 2020), Peacock (July 2020), and Paramount+ (March 2021). Each company pulled its content from Netflix to stock its own platform — Disney removed Marvel and Star Wars, NBC reclaimed "The Office," Warner took "Friends." The streaming landscape fragmented overnight, and consumers who had once paid $10/month for Netflix now faced the prospect of subscribing to five or six services at $10–15 each. The irony was unavoidable: streaming had been sold as liberation from the expensive cable bundle, but the streaming wars were recreating the bundle — just without the convenience of a single bill.',
    color: STREAM_PURPLE,
  },
  {
    year: '2021',
    title: 'Squid Game: Global Content Dominates',
    description:
      'When Netflix released the South Korean survival drama "Squid Game" in September 2021, it became the platform\'s most-watched series ever, accumulating 1.65 billion viewing hours in its first 28 days. The show — a brutal allegory about capitalism in which desperate contestants play deadly children\'s games for prize money — captivated audiences in over 90 countries, most of whom watched it with subtitles or dubbing. "Squid Game" shattered the longstanding assumption that American audiences wouldn\'t watch foreign-language content, proving that compelling storytelling transcends linguistic and cultural barriers. The show drove a surge of interest in Korean culture, boosted Netflix\'s subscriber numbers, and demonstrated that the next global hit could come from anywhere.',
    color: CABLE_GREEN,
  },
  {
    year: '2023–2025',
    title: 'Cord-Cutting Accelerates, Subscription Fatigue Sets In',
    description:
      'By 2023, the number of American households subscribing to streaming services exceeded those paying for traditional cable television for the first time — a tipping point that had been approaching for years. Yet the streaming industry\'s euphoric growth phase was ending. Consumers facing five to seven streaming subscriptions at rising prices began to experience "subscription fatigue," canceling services and rotating between them rather than maintaining all simultaneously. Streaming companies that had spent billions on content to attract subscribers now pivoted to profitability, cutting budgets, canceling shows, and introducing ad-supported tiers. The era of unlimited content spending was giving way to a more sustainable — and for consumers, more expensive — reality that increasingly resembled the cable model streaming had promised to replace.',
    color: AMBER,
  },
];

// ── International Television ────────────────────────────────────────────────

const INTERNATIONAL_TV: InsightEntry[] = [
  {
    label: 'British Comedy',
    detail:
      'The BBC\'s unique funding model — supported by a mandatory license fee rather than advertising — freed British television to take creative risks that commercial networks would never attempt. The result was some of the most influential comedy in television history: Monty Python\'s Flying Circus (1969–1974) deconstructed sketch comedy itself, Fawlty Towers (1975–1979) achieved comic perfection in just 12 episodes, and Ricky Gervais\'s "The Office" (2001–2003) pioneered the mockumentary format that would define 21st-century comedy. British comedies tended to run for shorter seasons — often six episodes — prioritizing quality over quantity. Hollywood recognized the value, remaking "The Office," "Shameless," "House of Cards," and dozens of other British originals for American audiences, often running them for many more seasons than the originals.',
  },
  {
    label: 'Telenovelas',
    detail:
      'Latin American telenovelas — serialized melodramas with defined beginnings, middles, and endings — have been a cultural force for over half a century, reaching an estimated two billion viewers across the Spanish- and Portuguese-speaking world. Unlike American soap operas, which can run for decades, telenovelas typically tell a complete story in 100–200 episodes and then end. They tackle social issues with surprising directness: Brazilian telenovelas have addressed HIV/AIDS, domestic violence, and racial inequality, with measurable real-world effects on public attitudes. Mexico\'s Televisa, Brazil\'s TV Globo, and Colombia\'s RCN have exported telenovelas to every continent, including surprising markets like Russia, China, and the Middle East, making the telenovela arguably the most widely consumed television format in human history.',
  },
  {
    label: 'Korean Wave (Hallyu)',
    detail:
      'South Korean television drama — K-drama — evolved from a regional entertainment into a global cultural phenomenon through a combination of high production values, emotionally resonant storytelling, and strategic digital distribution. Shows like "Winter Sonata" (2002) sparked the initial "Korean Wave" across Asia, but the arrival of streaming platforms accelerated K-drama\'s global reach exponentially. Netflix\'s "Squid Game" (2021) became the most-watched series in the platform\'s history with 1.65 billion viewing hours, proving that Korean content could dominate worldwide. K-dramas have driven Korean cultural soft power to remarkable heights, boosting tourism, language learning, beauty products, and K-pop in a mutually reinforcing cultural ecosystem that governments and corporations alike have sought to emulate.',
  },
  {
    label: 'Anime',
    detail:
      'Japanese animation evolved from a niche subculture into a global mainstream entertainment industry worth over $25 billion. Early exports like "Astro Boy" (1963) and "Speed Racer" (1967) introduced Western audiences to anime\'s distinctive visual style, but it was the generation-defining series of the 1980s through 2000s — "Dragon Ball," "Sailor Moon," "Naruto," "One Piece," and "Attack on Titan" — that built a massive global fanbase. Studio Ghibli\'s films, particularly Hayao Miyazaki\'s works like "Spirited Away" (2001, the first anime to win an Academy Award), demonstrated that anime could achieve artistic heights equal to any form of filmmaking. Streaming platforms like Crunchyroll and Netflix have made anime instantly accessible worldwide, transforming it from a cult import into one of the most consumed entertainment formats on Earth.',
  },
];

// ── The Technology of Television ────────────────────────────────────────────

const TV_TECHNOLOGY: InsightEntry[] = [
  {
    label: 'Remote Control (1950s–)',
    detail:
      'Zenith\'s "Space Command" remote control, introduced in 1956, used ultrasonic sound to change channels from across the room — eliminating the need to physically walk to the television set. This seemingly minor convenience fundamentally transformed viewing behavior. The remote control enabled "channel surfing" — rapidly flipping between channels — which meant that every program now competed not just with other shows at the same time slot, but with the viewer\'s itchy trigger finger. Networks responded by front-loading their most compelling content and eliminating slow openings. The remote control also gave viewers their first taste of on-demand control over their television experience, a small revolution in agency that would eventually lead to DVRs, streaming, and the expectation that content should always be available exactly when and how the viewer wants it.',
  },
  {
    label: 'VCR / DVR',
    detail:
      'Sony\'s Betamax (1975) and JVC\'s VHS (1976) allowed viewers to record television programs and watch them later — a concept called "time-shifting" that the television industry initially viewed as an existential threat. Hollywood sued Sony all the way to the Supreme Court, which ruled in 1984 that home recording was legal. VHS became ubiquitous, creating a massive home video market and giving viewers their first real control over television scheduling. Two decades later, TiVo (1999) and the digital video recorder perfected time-shifting by adding pause, rewind, and most terrifyingly for networks, the ability to skip commercials automatically. The DVR didn\'t just shift when people watched — it undermined the entire advertising model that had funded television since 1941.',
  },
  {
    label: 'Flat Screens',
    detail:
      'The transition from cathode ray tube (CRT) televisions to flat-panel displays transformed both the technology and the culture of television viewing. Plasma screens appeared in the late 1990s, followed by LCD and eventually OLED technology. Screens grew from the 12-to-27-inch range typical of CRT sets to 55, 65, 75, and even 85 inches for home displays. The bulky, furniture-like television set that dominated living rooms for decades was replaced by sleek panels that could be mounted on walls. This physical transformation enabled "home theater" culture — dedicated rooms with large screens, surround sound, and controlled lighting that approximated the cinema experience. Television was no longer a small glowing box in the corner; it was an immersive visual environment.',
  },
  {
    label: 'HD to 4K/8K',
    detail:
      'Television resolution evolved through a series of generational leaps that progressively made the medium more cinematic. Standard definition (480i) — the format most viewers watched for decades — gave way to high definition (720p and 1080p) in the 2000s, representing a fivefold increase in picture detail. 4K Ultra HD (2160p), which became mainstream in the mid-2010s, quadrupled HD resolution again, revealing detail invisible on previous formats. 8K (4320p) pushed resolution to levels that exceed the human eye\'s ability to perceive individual pixels at normal viewing distances. Each resolution jump narrowed the visual gap between television and cinema, making the home viewing experience increasingly competitive with theatrical exhibition.',
  },
  {
    label: 'Smart TVs and Second Screens',
    detail:
      'Internet-connected "smart" televisions, which became the default by the mid-2010s, transformed the television set from a passive display into an interactive computing platform. Built-in apps for Netflix, YouTube, Hulu, and dozens of other services eliminated the need for external streaming devices and made on-demand content as accessible as changing a channel. Simultaneously, the "second screen" phenomenon emerged: viewers began routinely using smartphones and tablets while watching television, checking social media, reading commentary, and participating in live-tweeting events. This dual-screen behavior transformed television from a lean-back medium into a lean-forward one, creating new forms of communal viewing where millions of people watched separately but commented together in real time on platforms like Twitter.',
  },
];

// ── The Future of Television ────────────────────────────────────────────────

const FUTURE_TV: InsightEntry[] = [
  {
    label: 'Streaming Wars Consolidation',
    detail:
      'The unsustainable proliferation of streaming services — each burning billions to attract subscribers — has begun to give way to consolidation and bundling. The merger of Discovery+ and HBO Max into a single platform was an early signal, and industry analysts expect further mergers as smaller services struggle to achieve profitability. Ironically, the emerging landscape of bundled streaming services increasingly resembles the cable package that cord-cutters originally fled. Consumers may end up paying similar prices for a similar aggregation of content, just delivered over the internet rather than coaxial cable. The revolution, it turns out, may have been more about technology delivery than about the fundamental economics of content distribution.',
  },
  {
    label: 'Short-Form Revolution',
    detail:
      'TikTok, YouTube Shorts, and Instagram Reels have created an entirely new category of video content — vertical, mobile-first, algorithmically served, and typically under 60 seconds. Generation Z watches more short-form video content than traditional television, and their attention patterns are measurably different from previous generations. The implications for traditional television are profound: if the next generation of viewers is conditioned to expect entertainment in 30-second bursts, will they have the patience for 60-minute dramas or 22-episode seasons? Some creators are adapting by producing "vertical series" designed for phone screens, while traditional networks experiment with shorter episodes and faster pacing to compete for fragmenting attention spans.',
  },
  {
    label: 'AI-Generated Content',
    detail:
      'Artificial intelligence is beginning to transform every aspect of television production, from scriptwriting assistance and automated editing to AI-generated visual effects and synthetic voice acting. Large language models can generate serviceable dialogue and plot outlines, while image and video generation models can create visual content that would have required expensive production crews. The long-term implications are staggering: personalized content tailored to individual viewer preferences, AI-generated "actors" who never age or demand raises, and the potential for anyone with a prompt to generate broadcast-quality video. The 2023 Hollywood writers\' and actors\' strikes were driven in large part by fears about AI replacement — an early skirmish in a battle that will define the entertainment industry for decades.',
  },
  {
    label: 'Interactive and Immersive Television',
    detail:
      'Netflix\'s "Black Mirror: Bandersnatch" (2018) offered viewers the ability to choose their own narrative path through an interactive film, generating millions of unique viewing experiences from a single production. While interactive storytelling hasn\'t yet become mainstream, it points toward a future where television extends beyond passive viewing. Virtual reality headsets, augmented reality glasses, and Apple\'s Vision Pro spatial computing platform are creating new possibilities for immersive entertainment that surrounds the viewer rather than confining content to a rectangular screen. The question facing the industry is whether "television" — a word that literally means "seeing at a distance" — will even remain a meaningful concept when content can be experienced in 360 degrees, overlaid on physical reality, or generated in real time by artificial intelligence.',
  },
];

// ── Milestone Timeline ──────────────────────────────────────────────────────

const MILESTONE_TIMELINE: TimelineEntry[] = [
  { year: '1884', title: 'Nipkow Disc', description: 'Paul Nipkow patents the spinning disc that establishes the theoretical foundation for scanning and transmitting images electronically.', color: AMBER },
  { year: '1925', title: 'Baird Demo', description: 'John Logie Baird demonstrates the first working mechanical television system at Selfridge\'s department store in London.', color: TEAL },
  { year: '1927', title: 'Farnsworth Electronic TV', description: 'Twenty-one-year-old Philo Farnsworth transmits the first fully electronic television image in his San Francisco laboratory.', color: TV_BLUE },
  { year: '1939', title: 'TV at World\'s Fair', description: 'RCA and David Sarnoff introduce commercial television to the public at the 1939 New York World\'s Fair.', color: BROADCAST_GOLD },
  { year: '1941', title: 'First Commercial Broadcast', description: 'WNBT (NBC) airs the first licensed commercial television broadcast, featuring a Bulova watch advertisement.', color: BROADCAST_GOLD },
  { year: '1948', title: 'TV Boom Begins', description: 'Television sets in American homes surge past one million as postwar prosperity and suburban growth drive mass adoption.', color: TV_BLUE },
  { year: '1951', title: 'I Love Lucy', description: 'Lucille Ball and Desi Arnaz premiere the show that invents the modern sitcom format and the rerun business model.', color: CRIMSON },
  { year: '1953', title: 'Color TV Standard', description: 'The NTSC adopts the first color broadcasting standard, though mass adoption won\'t come for over a decade.', color: AMBER },
  { year: '1960', title: 'Nixon-Kennedy Debate', description: 'The first televised presidential debate demonstrates TV\'s power to shape democratic politics and public perception.', color: INDIGO },
  { year: '1963', title: 'JFK Assassination Coverage', description: 'An estimated 93% of Americans watched television coverage of President Kennedy\'s assassination and funeral — television becomes the national hearth in moments of crisis.', color: SLATE },
  { year: '1969', title: 'Moon Landing', description: 'Six hundred million people worldwide watch Neil Armstrong\'s first steps on the Moon — television\'s greatest moment of global unity.', color: SKY },
  { year: '1972', title: 'HBO Launches', description: 'Home Box Office debuts as the first premium cable network, pioneering the subscription model that will fund prestige television.', color: STREAM_PURPLE },
  { year: '1980', title: 'CNN Launches', description: 'Ted Turner\'s Cable News Network introduces 24-hour news coverage, permanently accelerating the pace of information delivery.', color: CRIMSON },
  { year: '1981', title: 'MTV Debuts', description: 'Music Television launches with "Video Killed the Radio Star," transforming music into a visual medium and youth culture forever.', color: ROSE },
  { year: '1999', title: 'The Sopranos', description: 'HBO\'s mob drama premieres and permanently elevates television\'s artistic ambitions, launching the "golden age of TV."', color: CRIMSON },
  { year: '1999', title: 'TiVo / DVR', description: 'The digital video recorder gives viewers the power to pause, rewind, and skip commercials — threatening television\'s advertising model.', color: TEAL },
  { year: '2005', title: 'YouTube', description: 'YouTube launches, democratizing video distribution and creating the user-generated content revolution that will reshape all media.', color: CABLE_GREEN },
  { year: '2007', title: 'Netflix Streaming', description: 'Netflix adds streaming to its DVD-by-mail service, beginning the slow revolution that will upend the entire television industry.', color: CRIMSON },
  { year: '2011', title: 'Game of Thrones', description: 'HBO\'s fantasy epic debuts, eventually becoming a global cultural phenomenon with movie-scale budgets of $15M per episode.', color: BROADCAST_GOLD },
  { year: '2019', title: 'Streaming Wars', description: 'Disney+, Apple TV+, HBO Max, Peacock, and Paramount+ all launch within 18 months, fragmenting the streaming landscape.', color: STREAM_PURPLE },
  { year: '2021', title: 'Squid Game', description: 'The Korean survival drama becomes Netflix\'s most-watched series ever, proving that global content transcends language barriers.', color: CABLE_GREEN },
  { year: '2025', title: 'AI Content Era Begins', description: 'Artificial intelligence begins transforming content creation, from scriptwriting to visual effects, raising profound questions about the future of human creativity in television.', color: INDIGO },
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
        <p style={{ color: STATIC_GRAY, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
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
          <p style={{ color: STATIC_GRAY, lineHeight: 1.7, fontSize: '0.95rem' }}>
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
          <p style={{ color: STATIC_GRAY, lineHeight: 1.7, fontSize: '0.9rem' }}>
            {item.detail}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function MilestoneTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {entries.map((e, i) => (
        <motion.div
          key={e.year + e.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.35, delay: i * 0.04 }}
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            borderLeft: `2px solid ${e.color}44`,
            paddingLeft: 16,
            paddingBottom: 4,
          }}
        >
          <span style={{
            minWidth: 48,
            fontWeight: 700,
            color: e.color,
            fontSize: '0.9rem',
            paddingTop: 2,
          }}>
            {e.year}
          </span>
          <div>
            <h4 style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: 4 }}>
              {e.title}
            </h4>
            <p style={{ color: STATIC_GRAY, fontSize: '0.85rem', lineHeight: 1.6 }}>
              {e.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryOfTelevisionPage() {
  useEffect(() => {
    document.title = 'History of Television — Chronicle';
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    window.scrollTo(0, 0);
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
              background: `linear-gradient(135deg, ${TV_BLUE}, ${BROADCAST_GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            From Static to Streaming — The History of Television (1884–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: STATIC_GRAY, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              In 1927, a 21-year-old farm boy from Utah transmitted a single flickering line on a glass tube — and set in motion the most transformative communication technology in human history. Television didn't just bring entertainment into the living room; it reshaped politics, redefined culture, created a shared national consciousness, and fundamentally altered how billions of people spend their waking hours. From three channels to three thousand, from rabbit ears to streaming algorithms, the story of television is the story of the modern world.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This deep dive traces television's journey from Paul Nipkow's spinning disc to the AI-generated content era — through the golden age of broadcast, the cable revolution, the rise of prestige drama, and the streaming wars that are still reshaping the medium today. Along the way, television witnessed moon landings, ended wars, launched cultural movements, and became the dominant art form of the 20th and 21st centuries.
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
                <span style={{ color: BROADCAST_GOLD, fontWeight: 700, fontSize: '1.1rem' }}>
                  {stat.label}
                </span>
                <p style={{ color: STATIC_GRAY, fontSize: '0.85rem', marginTop: 4, lineHeight: 1.5 }}>
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 1: Invention of Television */}
        <SectionWrapper
          id="invention"
          icon="🔬"
          title="The Invention of Television (1884–1939)"
          accentColor={AMBER}
          intro="Television was not a single invention but a decades-long race between mechanical and electronic approaches, pursued by rival inventors across three continents. The technology that would become the most ubiquitous device in human civilization was born from spinning discs, electron beams, and the stubborn vision of engineers who believed images could fly through the air."
        >
          <TimelineCard entries={INVENTION_TIMELINE} />
        </SectionWrapper>

        {/* Section 2: The Broadcast Era */}
        <SectionWrapper
          id="broadcast-era"
          icon="📡"
          title="The Broadcast Era (1941–1970s)"
          accentColor={TV_BLUE}
          intro="Commercial television transformed American life with astonishing speed. In less than a decade, TV went from a luxury owned by thousands to a necessity in tens of millions of homes. Three networks controlled what an entire nation watched, creating a shared cultural experience — for better and worse — that has no equivalent in the modern fragmented media landscape."
        >
          <TimelineCard entries={BROADCAST_ERA_TIMELINE} />
        </SectionWrapper>

        {/* Section 3: Television's Social Impact */}
        <SectionWrapper
          id="social-impact"
          icon="🌍"
          title="Television's Social Impact"
          accentColor={INDIGO}
          intro="Television didn't just reflect the world — it changed it. From the living rooms where families gathered around a single glowing screen, TV shaped elections, ended wars, united humanity for moon landings, and held the powerful accountable. No technology before or since has matched television's ability to create shared national and global moments."
        >
          <InsightGrid items={TV_SOCIAL_IMPACT} />
        </SectionWrapper>

        {/* Section 4: The Sitcom Golden Age */}
        <SectionWrapper
          id="sitcom-golden-age"
          icon="😂"
          title="The Sitcom Golden Age"
          accentColor={BROADCAST_GOLD}
          intro="The situation comedy became television's signature art form — a 22-minute format that could make audiences laugh, challenge social norms, and reflect the changing values of American society. From Lucy's pioneering genius to Seinfeld's deconstruction of the genre itself, the sitcom evolved from simple domestic farce into something approaching social commentary."
        >
          <InsightGrid items={GOLDEN_AGE_SITCOMS} />
        </SectionWrapper>

        {/* Section 5: The Cable Revolution */}
        <SectionWrapper
          id="cable-revolution"
          icon="📺"
          title="The Cable Revolution (1972–2000)"
          accentColor={CABLE_GREEN}
          intro="Cable television shattered the Big Three's monopoly and gave viewers something they'd never had: choice. HBO proved you could pay for TV without commercials. CNN proved you could watch news at 3 AM. MTV proved you could build a network around a single format. By the 1990s, 500 channels had fragmented the mass audience — and nothing in television would ever be the same."
        >
          <TimelineCard entries={CABLE_REVOLUTION_TIMELINE} />
        </SectionWrapper>

        {/* Section 6: Reality TV */}
        <SectionWrapper
          id="reality-tv"
          icon="🎥"
          title="Reality TV Explosion"
          accentColor={ROSE}
          intro="Reality television began as a cost-cutting experiment and became a cultural force that blurred the lines between entertainment, advertising, and personal branding. Unscripted shows offered networks comparable ratings at a fraction of scripted costs, while transforming ordinary people — and some extraordinarily savvy ones — into celebrities, moguls, and even presidents."
        >
          <InsightGrid items={REALITY_TV} />
        </SectionWrapper>

        {/* Section 7: Prestige Television */}
        <SectionWrapper
          id="prestige-tv"
          icon="🎭"
          title="The Prestige Television Renaissance (1999–Present)"
          accentColor={CRIMSON}
          intro="Starting with The Sopranos in 1999, television underwent a creative revolution that attracted the best writers, directors, and actors in the entertainment industry. For the first time, serious artists chose television over film — because the long-form serial format offered narrative possibilities that a two-hour movie could never match. The result was a golden age that produced some of the greatest storytelling in any medium."
        >
          <TimelineCard entries={PRESTIGE_TV} />
        </SectionWrapper>

        {/* Section 8: The Streaming Era */}
        <SectionWrapper
          id="streaming-era"
          icon="💻"
          title="The Streaming Era (2007–Present)"
          accentColor={STREAM_PURPLE}
          intro="Netflix's pivot from DVD envelopes to digital streaming triggered the most disruptive transformation in television since the medium's invention. Within a decade, the entire industry restructured around on-demand delivery, binge-watching, and algorithmic recommendation. The streaming era democratized access to content — and then re-created many of the problems it claimed to solve."
        >
          <TimelineCard entries={STREAMING_ERA} />
        </SectionWrapper>

        {/* Section 9: Television Around the World */}
        <SectionWrapper
          id="international-tv"
          icon="🌐"
          title="Television Around the World"
          accentColor={TEAL}
          intro="While American television dominated the global market for decades, every region developed its own distinctive traditions — from British comedy's willingness to embrace failure to Latin America's telenovela melodramas to Japan's anime revolution. The streaming era has finally made this diversity visible to global audiences, proving that great television speaks a universal language."
        >
          <InsightGrid items={INTERNATIONAL_TV} />
        </SectionWrapper>

        {/* Section 10: The Technology of Television */}
        <SectionWrapper
          id="tv-technology"
          icon="🔧"
          title="The Technology of Television"
          accentColor={SKY}
          intro="Every major technological advance in television — from the remote control to the smart TV — has shifted power from broadcasters to viewers, giving audiences more control over what they watch, when they watch, and how they watch. Each innovation seemed minor at the time but fundamentally altered viewing behavior and the economics of the entire industry."
        >
          <InsightGrid items={TV_TECHNOLOGY} />
        </SectionWrapper>

        {/* Section 11: The Future of Television */}
        <SectionWrapper
          id="future-tv"
          icon="🚀"
          title="The Future of Television"
          accentColor={INDIGO}
          intro="Television is transforming faster than at any point since its invention. Streaming consolidation, short-form video, artificial intelligence, and immersive technologies are converging to reshape the medium in ways that may make the word 'television' itself obsolete. The question is no longer what will be on TV — it's what 'TV' will even mean."
        >
          <InsightGrid items={FUTURE_TV} />
        </SectionWrapper>

        {/* Milestone Timeline */}
        <section
          id="milestones"
          style={{
            padding: '48px 0',
            borderTop: `1px solid ${TV_BLUE}33`,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: TV_BLUE, marginBottom: 12 }}>
              📅 Television Milestones (1884–2025)
            </h2>
            <p style={{ color: STATIC_GRAY, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>
              From a German engineering student's spinning disc patent to the dawn of AI-generated content, these are the moments that defined television's 140-year journey from theoretical concept to humanity's most ubiquitous medium.
            </p>
          </motion.div>
          <MilestoneTimeline entries={MILESTONE_TIMELINE} />
        </section>

        {/* Connected Deep Dives */}
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
              { to: '/history-of-film', label: 'History of Film' },
              { to: '/digital-revolution', label: 'Digital Revolution' },
              { to: '/cold-war', label: 'The Cold War' },
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
            "Television is the first truly democratic culture — the first culture available to everybody and entirely governed by what the people want. The most terrifying thing is what the people do want."
            — Clive Barnes
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            ← Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
