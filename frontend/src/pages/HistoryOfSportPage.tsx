/**
 * HistoryOfSportPage — comprehensive deep-dive on the History of Sport (3000 BCE–Present).
 *
 * Route: /history-of-sport
 *
 * Sections:
 *  1. Hero — headline, overview of sport's role in civilization
 *  2. Ancient Origins — Mesopotamian wrestling, Egyptian acrobatics, Mesoamerican ball game
 *  3. Greek Olympics — 776 BCE origin, events, panhellenic significance
 *  4. Roman Spectacle — gladiators, chariot racing, Circus Maximus
 *  5. Medieval Tournaments — jousting, knightly culture, peasant games
 *  6. English Codification — cricket, football, rugby split
 *  7. Modern Olympics — Coubertin, Athens 1896, amateurism ideal
 *  8. American Sports Culture — baseball, basketball, football
 *  9. Global Spread — FIFA, boxing, international federations
 * 10. Political Dimensions — Berlin 1936, Jesse Owens, 1968 salute, boycotts
 * 11. TV and Commercialization — MNF, Jordan/Nike, media deals
 * 12. Women in Sport — Title IX, pioneers, equality battles
 * 13. Global Mega-Events — World Cup, Super Bowl, Olympics as geopolitics
 * 14. Digital Era — esports, analytics, sports science
 * 15. Key Figures — all-time greats across eras
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const BLUE = '#3b82f6';
const GREEN = '#22c55e';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const ROSE = '#f43f5e';
const PURPLE = '#a855f7';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const SKY = '#38bdf8';
const STEEL = '#64748b';
const OLIVE = '#84cc16';
const ORANGE = '#f97316';
const SPORT_GREEN = '#059669';
const BRONZE = '#cd7f32';

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
    label: '776 BCE',
    detail: 'First recorded Olympic Games at Olympia, Greece — a tradition that would continue unbroken for 1,168 years until Roman Emperor Theodosius banned them in 393 CE.',
  },
  {
    label: '250,000 spectators',
    detail: 'Capacity of the Circus Maximus in Rome — the largest sports venue in human history. Modern stadiums hold a fraction of what Romans built 2,000 years ago.',
  },
  {
    label: '3.5 billion viewers',
    detail: 'Estimated global audience for the FIFA World Cup final — the single most-watched sporting event on Earth, uniting every continent.',
  },
  {
    label: '$5.3 billion',
    detail: 'Value of the Dallas Cowboys (2024) — the most valuable sports franchise on the planet. Sport is no longer just competition; it is a financial empire.',
  },
  {
    label: 'Title IX (1972)',
    detail: 'U.S. federal law mandating gender equity in education programs, including athletics. Women\'s college sports participation increased over 600% in the decades that followed.',
  },
  {
    label: '$1.8 billion',
    detail: 'Global esports revenue projection by 2025 — competitive gaming has grown from basement hobby to professional sport with stadiums, leagues, and millions of fans.',
  },
];

// ── Ancient Origins ─────────────────────────────────────────────────────────

const ANCIENT_TIMELINE: TimelineEntry[] = [
  {
    year: '~3000 BCE',
    title: 'Mesopotamian Wrestling',
    description:
      'The oldest known depictions of organized sport come from ancient Sumer. Bronze figurines and cylinder seals show wrestlers locked in competition — not brawling, but following rules. Wrestling was tied to religious festivals honoring the gods. Kings sponsored matches to demonstrate their city\'s strength. The concept of athletic competition as a public spectacle — with audiences, rituals, and champions — was already fully formed five thousand years ago.',
    color: BRONZE,
  },
  {
    year: '~2000 BCE',
    title: 'Egyptian Acrobatics and Sport',
    description:
      'Tomb paintings at Beni Hasan depict over 400 wrestling holds in sequence — essentially an illustrated instruction manual. Egyptians also practiced archery, swimming, rowing, and a form of field hockey. Pharaohs demonstrated their fitness through ritual athletic displays: running courses, shooting arrows at copper targets. Sport was not entertainment alone — it was proof of a ruler\'s divine fitness to govern. The connection between physical prowess and political legitimacy is as old as civilization itself.',
    color: GOLD,
  },
  {
    year: '~1400 BCE',
    title: 'The Mesoamerican Ball Game',
    description:
      'Across Mesoamerica — from the Olmec through the Maya and Aztec civilizations — the rubber ball game (ullamaliztli or pitz) was played in monumental stone courts for over 3,000 years. Players used their hips, elbows, and knees to keep a heavy rubber ball in play through stone rings mounted high on court walls. The game was simultaneously sport, religious ritual, and political theater. Some matches ended in human sacrifice. The ball game is the oldest continuously played team sport in the Americas, predating European contact by millennia.',
    color: CRIMSON,
  },
  {
    year: '~1500 BCE',
    title: 'Minoan Bull-Leaping',
    description:
      'Frescoes from the palace of Knossos on Crete show young athletes — both male and female — vaulting over charging bulls. This wasn\'t bullfighting; it was gymnastics performed with a living, dangerous animal. Whether it was religious ritual, rite of passage, or entertainment remains debated. What is clear is that the Minoans valued athletic skill, spectacle, and courage — the same qualities that would define Greek athletics centuries later.',
    color: TEAL,
  },
];

// ── Greek Olympics ──────────────────────────────────────────────────────────

const GREEK_TIMELINE: TimelineEntry[] = [
  {
    year: '776 BCE',
    title: 'The First Olympiad',
    description:
      'According to tradition, the first Olympic Games were held at the sanctuary of Zeus in Olympia. The only event was the stadion — a footrace of about 192 meters, one length of the stadium. The first recorded champion was Koroibos, a cook from Elis. The Games were held every four years (an "Olympiad") and became so important that the Greeks used them to measure time itself. Wars were paused for the Olympic truce. For over a millennium, every four years, the Greek world stopped fighting and started competing.',
    color: GOLD,
  },
  {
    year: '708 BCE',
    title: 'The Pentathlon and Combat Events',
    description:
      'The Games expanded from a single footrace to a full athletic program. The pentathlon (stadion, long jump, discus, javelin, wrestling) tested all-around excellence. Boxing was added in 688 BCE, the brutal pankration (a no-holds-barred combat sport where only biting and eye-gouging were forbidden) in 648 BCE. Chariot racing, added in 680 BCE, was the most prestigious event — but the victory went to the owner of the horses, not the driver. Wealthy aristocrats competed by proxy.',
    color: AMBER,
  },
  {
    year: '~500 BCE',
    title: 'Panhellenic Significance',
    description:
      'The Olympics were one of four great Panhellenic games (alongside the Pythian, Nemean, and Isthmian Games), but they were the most prestigious. Athletes competed nude, oiled, and in full public view. Victory brought immortality: statues were erected, poems were composed (Pindar\'s victory odes), and champions returned home as heroes — sometimes literally worshipped as demigods. The olive wreath prize was symbolically priceless. Greek athletics were inseparable from religion, politics, and identity. To compete was to be Greek.',
    color: GREEN,
  },
  {
    year: '393 CE',
    title: 'The End of the Ancient Games',
    description:
      'Roman Emperor Theodosius I, a Christian, banned the Olympic Games as part of his campaign to suppress pagan practices. After 1,168 years and 293 consecutive Olympiads, the greatest sporting tradition in the ancient world ended. The sanctuary at Olympia fell into ruin, buried by earthquakes and flooding. It would not be excavated until the 19th century — and the Games would not be revived for another 1,503 years.',
    color: STEEL,
  },
];

// ── Roman Spectacle ─────────────────────────────────────────────────────────

const ROMAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Gladiatorial Combat',
    detail:
      'Gladiators were professional fighters — slaves, prisoners of war, or volunteers — who trained in specialized schools (ludi) and fought in carefully matched pairs before thousands of screaming spectators. Contrary to Hollywood myth, most fights were not to the death (trained gladiators were expensive). But death was always possible, and that possibility was the point. The crowd decided a defeated gladiator\'s fate with thumbs up or down. Gladiatorial combat was the Roman Empire\'s defining entertainment — sport as life-or-death drama.',
  },
  {
    label: 'The Colosseum (80 CE)',
    detail:
      'The Flavian Amphitheatre held 50,000 spectators and featured a retractable awning (velarium), underground tunnels for fighters and animals, and a floor that could be flooded for naval battles. Its design — tiered seating, numbered entrances, efficient crowd flow — became the template for every modern stadium. The Colosseum is not just an ancient ruin; it is the ancestor of Yankee Stadium, Wembley, and the Camp Nou.',
  },
  {
    label: 'Chariot Racing: The Circus Maximus',
    detail:
      'Chariot racing was the most popular sport in Rome — far more popular than gladiatorial combat. The Circus Maximus held 250,000 spectators (some estimates say 300,000), making it the largest spectator venue ever built. Teams were organized into factions identified by color (Red, White, Blue, Green), and fans were fanatically devoted. The Nika Riots of 532 CE in Constantinople, triggered by chariot racing factions, killed 30,000 people and nearly toppled an emperor. Modern sports hooliganism has ancient roots.',
  },
  {
    label: 'Bread and Circuses',
    detail:
      'The satirist Juvenal coined the phrase "panem et circenses" (bread and circuses) to describe how Roman emperors used free grain and spectacular games to keep the population politically docile. The insight remains powerful: governments have used sport to distract, unify, and control populations for two millennia. From Roman chariot racing to Nazi Olympics to modern World Cup hosting bids, the political instrumentalization of sport is a constant thread in history.',
  },
];

// ── Medieval Tournaments ────────────────────────────────────────────────────

const MEDIEVAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Joust',
    detail:
      'Jousting emerged in the 11th century as both military training and aristocratic entertainment. Two armored knights on horseback charged at each other with lances, attempting to unseat their opponent. By the 14th century, jousts were elaborate theatrical events with painted shields, heraldic displays, and courtly rituals. Knights competed for honor, prizes, and the favor of ladies. Jousting was dangerous — Henry II of France died in a jousting accident in 1559. It was the extreme sport of the medieval world, combining violence, pageantry, and social status.',
  },
  {
    label: 'The Tournament (Mêlée)',
    detail:
      'Before the individual joust, the main event was the mêlée — a mass combat between teams of mounted knights that could range across miles of countryside. It was essentially war with slightly softer rules: ransoms instead of killing (usually), boundaries (sometimes), and referees (barely). Tournaments were how young knights proved themselves, made political alliances, and earned fortunes from ransoms and prizes. William Marshal, the greatest knight in English history, made his career winning over 500 tournaments.',
  },
  {
    label: 'Peasant Games: Football and Beyond',
    detail:
      'While aristocrats jousted, common people played their own rough sports. "Mob football" in medieval England involved entire villages — sometimes hundreds of players — trying to move a ball (or a pig\'s bladder) to a goal that might be miles away. There were virtually no rules. Injuries were common, deaths not unheard of. English kings repeatedly banned football — Edward II in 1314, Edward III in 1349, Richard II in 1389 — because it distracted men from archery practice. The bans never worked. The people wanted to play.',
  },
  {
    label: 'Archery and Real Tennis',
    detail:
      'Archery was both military skill and competitive sport throughout the Middle Ages. English longbowmen, whose skill won battles at Crécy and Agincourt, practiced at village archery butts. Real tennis (jeu de paume) originated in French monasteries in the 12th century and became the sport of kings — Henry VIII was an enthusiastic player. Real tennis is the ancestor of modern lawn tennis, squash, and racquetball. The scoring system (15, 30, 40, game) still used in tennis today comes from this medieval court game.',
  },
];

// ── English Codification ────────────────────────────────────────────────────

const CODIFICATION_TIMELINE: TimelineEntry[] = [
  {
    year: '1744',
    title: 'Cricket Gets Its Laws',
    description:
      'The first written Laws of Cricket were drafted by the London Cricket Club. Cricket had been played in England for centuries, but without standardized rules, every match was a negotiation. The 1744 Laws established the basic framework still recognizable today: two teams, two wickets, overarm bowling (eventually), and the concept of innings. Cricket would become the first globally exported English sport, traveling with the British Empire to India, Australia, the Caribbean, and beyond. Today, cricket is the second most-watched sport on Earth.',
    color: GREEN,
  },
  {
    year: '1823 (legend)',
    title: 'Webb Ellis Picks Up the Ball',
    description:
      'According to myth, William Webb Ellis, a student at Rugby School, picked up the ball during a football match and ran with it — inventing rugby. The story is almost certainly apocryphal, but it captures a real historical truth: in the early 19th century, every English school played its own version of football with different rules. Rugby School\'s version allowed carrying the ball; Eton\'s did not. The question of what "football" actually meant would take decades to resolve — and the answer would split into two different sports.',
    color: ORANGE,
  },
  {
    year: '1863',
    title: 'The Great Football Schism',
    description:
      'On October 26, 1863, representatives from eleven London clubs met at the Freemasons\' Tavern to agree on a single set of football rules. The key debate: should players be allowed to carry the ball and hack (kick) opponents\' shins? When the meeting voted to ban both, the clubs that favored Rugby School\'s rules walked out. Association football (soccer) and rugby football split permanently. This single meeting created the two sports that would, between them, dominate the sporting culture of most of the world.',
    color: SPORT_GREEN,
  },
  {
    year: '1877',
    title: 'The First Wimbledon',
    description:
      'The All England Croquet and Lawn Tennis Club hosted its first tennis championship. Lawn tennis had only been patented three years earlier by Major Walter Clopton Wingfield. The first tournament drew 22 players and about 200 spectators. Today, Wimbledon is the oldest and most prestigious tennis tournament in the world. Its traditions — white clothing, strawberries and cream, grass courts — have barely changed in nearly 150 years. Tennis would become one of the first sports where individual athletes achieved global celebrity.',
    color: PURPLE,
  },
  {
    year: '1886',
    title: 'The International Football Association Board',
    description:
      'England, Scotland, Wales, and Ireland formed the IFAB to maintain universal football rules. This was the first international sports governance body — the template for FIFA, the IOC, and every international sports federation that followed. The British didn\'t just invent modern sports; they invented the bureaucratic infrastructure to govern them. Standardized rules, governing bodies, organized competitions — the entire administrative architecture of modern sport is a British export.',
    color: BLUE,
  },
];

// ── Modern Olympics ─────────────────────────────────────────────────────────

const OLYMPICS_TIMELINE: TimelineEntry[] = [
  {
    year: '1896',
    title: 'Athens: The Modern Olympics Are Born',
    description:
      'Baron Pierre de Coubertin, a French aristocrat inspired by ancient Greek ideals and English public school athletics, persuaded 13 nations to send 241 athletes to Athens for the first modern Olympic Games. The events included athletics, gymnastics, swimming, cycling, fencing, shooting, tennis, weightlifting, and wrestling. There were no women competitors. The marathon — a 40km race invented for the occasion, inspired by the legend of Pheidippides — became the signature event when Greek water carrier Spyridon Louis won to delirious national celebration.',
    color: GOLD,
  },
  {
    year: '1900–1920',
    title: 'Growing Pains',
    description:
      'The early Olympics were chaotic. The 1900 Paris Games were spread across five months as a sideshow to the World\'s Fair — many athletes didn\'t even know they were competing in the Olympics. The 1904 St. Louis Games included bizarre events like "Anthropology Days" where Indigenous peoples were forced to compete. Women first competed in 1900 (tennis and golf). The Games didn\'t find their identity until Antwerp 1920, which introduced the Olympic flag with its five interlocking rings — representing the five continents united by sport.',
    color: AMBER,
  },
  {
    year: '1924',
    title: 'Paris and the Amateurism Ideal',
    description:
      'The 1924 Paris Olympics — immortalized in the film "Chariots of Fire" — embodied Coubertin\'s amateurism ideal: sport as noble pursuit, free from the corruption of money. Athletes who earned any income from their sport were banned. In practice, this meant wealthy amateurs competed while working-class athletes were excluded. Jim Thorpe had his 1912 decathlon gold medals stripped because he\'d been paid $2 a game to play minor league baseball. The amateurism ideal was always class warfare disguised as sporting ethics.',
    color: TEAL,
  },
  {
    year: '1936',
    title: 'Berlin: The Propaganda Games',
    description:
      'Hitler intended the Berlin Olympics to showcase Aryan supremacy. Instead, Jesse Owens — a Black American athlete — won four gold medals in track and field, demolishing the Nazi racial narrative in front of 100,000 spectators. But the broader picture was more complex: the Games were a propaganda triumph for the Nazi regime. The IOC\'s decision to award Berlin the Games (and to reject calls for a boycott) legitimized Hitler\'s government on the world stage. The 1936 Olympics remain the defining example of sport\'s entanglement with authoritarian politics.',
    color: CRIMSON,
  },
];

// ── American Sports Culture ─────────────────────────────────────────────────

const AMERICAN_INSIGHTS: InsightEntry[] = [
  {
    label: 'Baseball: America\'s Pastime',
    detail:
      'Baseball evolved from English rounders and was codified by Alexander Cartwright\'s Knickerbocker Rules in 1845. The first professional league (the National League) formed in 1876. Baseball became the cultural fabric of American life — radio broadcasts, trading cards, hot dogs at the ballpark. It was also a mirror of American racism: Jackie Robinson\'s integration of Major League Baseball in 1947 predated the Civil Rights Act by 17 years. Robinson\'s courage on the diamond made him one of the most important Americans of the 20th century.',
  },
  {
    label: 'Basketball: From Peach Baskets to Global Game',
    detail:
      'James Naismith invented basketball in 1891 at a YMCA in Springfield, Massachusetts, using peach baskets and a soccer ball. He needed an indoor game for restless students during New England winters. Within decades, basketball spread worldwide through YMCA networks. The NBA, founded in 1946, became a global entertainment empire. Basketball is now played in over 200 countries. Naismith\'s simple invention — one man, one afternoon, thirteen rules — became the most successful deliberate creation of a sport in history.',
  },
  {
    label: 'American Football: Controlled Violence',
    detail:
      'American football evolved from rugby in the 1870s, with Walter Camp at Yale establishing the line of scrimmage, downs, and the snap. The sport was so violent that in 1905, 18 players died — President Theodore Roosevelt threatened to ban it unless rules changed. The forward pass was legalized in 1906, opening up the game. The NFL was founded in 1920. By the late 20th century, football had surpassed baseball as America\'s most popular sport, with the Super Bowl becoming an unofficial national holiday.',
  },
  {
    label: 'Boxing: The Sweet Science',
    detail:
      'Prize fighting was America\'s first mass spectator sport. John L. Sullivan, the last bare-knuckle heavyweight champion, was the most famous American of the 1880s. Jack Johnson became the first Black heavyweight champion in 1908, provoking a racist national panic. Joe Louis\'s 1938 defeat of Max Schmeling became a symbol of American democracy vs. Nazi ideology. Muhammad Ali transcended boxing entirely — his refusal to serve in Vietnam, his conversion to Islam, his verbal genius made him the most recognizable person on Earth.',
  },
];

// ── Global Spread ───────────────────────────────────────────────────────────

const GLOBAL_TIMELINE: TimelineEntry[] = [
  {
    year: '1904',
    title: 'FIFA Is Founded',
    description:
      'Seven European nations formed the Fédération Internationale de Football Association in Paris. England initially refused to join (it would join in 1905 and leave multiple times). FIFA would grow from a small European club into the most powerful sports organization on Earth, governing a sport played by 270 million people in every country on the planet. The first World Cup wouldn\'t be held until 1930, but FIFA\'s founding established the principle that international sport needed international governance.',
    color: GREEN,
  },
  {
    year: '1930',
    title: 'The First World Cup: Uruguay',
    description:
      'Only 13 teams competed in the first FIFA World Cup in Montevideo — many European nations refused to make the long sea voyage. Uruguay won the final 4-2 against Argentina before 93,000 spectators at the Estadio Centenario. The tournament was a modest beginning for what would become the biggest sporting event in human history. The host nation declared a national holiday. The World Cup established that an international football tournament could captivate an entire nation — and eventually, the entire world.',
    color: GOLD,
  },
  {
    year: '1940s–1960s',
    title: 'Cricket and the Postcolonial World',
    description:
      'As the British Empire retreated, its former colonies kept cricket — and used it to beat England. The West Indies\' dominance from the 1960s to 1990s, led by players like Sir Garfield Sobers and Sir Vivian Richards, was an expression of Caribbean pride and postcolonial identity. India\'s 1983 World Cup victory transformed cricket from an elite pastime into a national obsession — eventually making India the financial center of world cricket. The colonizer\'s sport became the colonized people\'s tool for self-assertion.',
    color: TEAL,
  },
  {
    year: '1956–1970s',
    title: 'The Global Boxing Golden Age',
    description:
      'Boxing produced the 20th century\'s most compelling narratives. Sugar Ray Robinson is still considered the greatest pound-for-pound fighter in history. Muhammad Ali\'s trilogy with Joe Frazier (1971–1975) transcended sport — the "Thrilla in Manila" is remembered as one of the most brutal and heroic athletic contests ever staged. Boxing was global: from Mexican legends like Julio César Chávez to Filipino icon Manny Pacquiao, the ring was the one arena where a poor kid from anywhere could become the most famous person in the world.',
    color: RED,
  },
];

// ── Political Dimensions ────────────────────────────────────────────────────

const POLITICAL_INSIGHTS: InsightEntry[] = [
  {
    label: 'Jesse Owens, Berlin 1936',
    detail:
      'Jesse Owens won four gold medals at Hitler\'s Olympics — the 100m, 200m, long jump, and 4x100m relay. He was the greatest athlete at the Games designed to prove Aryan superiority. But the full story is more bitter: Owens returned to an America that still enforced Jim Crow segregation. President Roosevelt never invited him to the White House. Owens later said: "Hitler didn\'t snub me — it was our president who snubbed me." Sport could challenge racism on the field while the nation that produced the champion perpetuated it off the field.',
  },
  {
    label: 'The 1968 Black Power Salute',
    detail:
      'At the Mexico City Olympics, American sprinters Tommie Smith (gold) and John Carlos (bronze) raised black-gloved fists during the national anthem. Australian silver medalist Peter Norman wore a civil rights badge in solidarity. All three men paid devastating personal costs: Smith and Carlos were expelled from the Games and received death threats for years. Norman was blacklisted by Australian athletics. The image became one of the most powerful political statements in sporting history — proof that the Olympic podium could be a platform for justice.',
  },
  {
    label: 'Apartheid and Sport Boycotts',
    detail:
      'South Africa\'s apartheid regime was banned from the Olympics from 1964 to 1992. International cricket and rugby boycotts devastated the sports-obsessed white minority. The boycotts were among the most effective anti-apartheid tools: they targeted something white South Africans cared about deeply. When South Africa returned to international sport after apartheid\'s end, the 1995 Rugby World Cup — with Nelson Mandela wearing a Springbok jersey to present the trophy — became a symbol of reconciliation. Sport had been both a weapon against injustice and a tool for healing.',
  },
  {
    label: 'Cold War Olympics',
    detail:
      'The Olympic medal table became a Cold War battlefield. The Soviet Union, competing from 1952, poured state resources into athletic programs to demonstrate communist superiority. The US and USSR boycotted each other\'s Olympics in 1980 (Moscow) and 1984 (Los Angeles). The 1980 "Miracle on Ice" — the US amateur hockey team defeating the Soviet professionals — became the most mythologized moment in American sports history, far exceeding its actual athletic significance. In the Cold War, every medal was an ideological argument.',
  },
];

// ── TV and Commercialization ────────────────────────────────────────────────

const TV_INSIGHTS: InsightEntry[] = [
  {
    label: 'Monday Night Football (1970)',
    detail:
      'ABC\'s "Monday Night Football" transformed American sports television. Producer Roone Arledge brought entertainment values to sports broadcasting: multiple cameras, instant replay, slow motion, and charismatic commentators (Howard Cosell\'s provocative style made him as famous as the athletes). MNF proved that sport could be prime-time television — not just live events but produced entertainment. Every modern sports broadcast, with its graphics, analysis, and narrative framing, descends from what Arledge created.',
  },
  {
    label: 'Michael Jordan and Nike',
    detail:
      'In 1984, Nike signed a 21-year-old rookie named Michael Jordan to a shoe deal worth $2.5 million over five years — an unprecedented investment in an unproven player. Air Jordans became the most successful athlete endorsement in history. Jordan didn\'t just sell shoes; he sold a lifestyle, an aspiration, a global brand. His combination of athletic genius, competitive ruthlessness, and marketing polish created the modern athlete-as-brand. Jordan proved that a single athlete could be worth more to corporate America than an entire team.',
  },
  {
    label: 'The Premier League Revolution',
    detail:
      'In 1992, England\'s top football clubs broke away from the Football League to form the Premier League, gaining control of their own television rights. The result: a £304 million initial TV deal that has since ballooned to over £6.7 billion. The Premier League became the world\'s most-watched domestic sports league, broadcast in 189 countries. It transformed English football clubs from local institutions into global entertainment brands — and proved that television money could reshape the entire economics of sport.',
  },
  {
    label: 'The Super Bowl: America\'s Ad Festival',
    detail:
      'The Super Bowl evolved from a championship game into America\'s largest cultural event. By the 2020s, 30-second advertising spots cost over $7 million. The halftime show became a cultural moment rivaling the game itself. Super Bowl Sunday is the second-largest day for American food consumption after Thanksgiving. The game demonstrated that a single sporting event could become a national ritual — a shared experience in an era of fragmenting media. Sport became the last form of appointment television.',
  },
];

// ── Women in Sport ──────────────────────────────────────────────────────────

const WOMEN_TIMELINE: TimelineEntry[] = [
  {
    year: '1900',
    title: 'Women Enter the Olympics',
    description:
      'Twenty-two women competed at the 1900 Paris Olympics in tennis, sailing, croquet, equestrian, and golf. Pierre de Coubertin opposed women\'s participation, calling it "impractical, uninteresting, unaesthetic, and incorrect." Women wouldn\'t compete in track and field until 1928. Even then, when several runners collapsed after the 800m final, the IOC banned women\'s races longer than 200m for the next 32 years. The history of women in sport is a history of being told they couldn\'t, shouldn\'t, and wouldn\'t — and doing it anyway.',
    color: ROSE,
  },
  {
    year: '1972',
    title: 'Title IX: The Revolution',
    description:
      'Title IX of the Education Amendments Act prohibited sex discrimination in federally funded education programs — including athletics. Before Title IX, fewer than 300,000 American girls played high school sports. By 2019, over 3.4 million did. Women\'s college athletics exploded. The law didn\'t just create opportunities; it created generations of women who grew up believing sport was for them. Title IX is arguably the single most important piece of legislation in the history of women\'s sport, and its effects are still compounding.',
    color: PURPLE,
  },
  {
    year: '1973',
    title: 'Billie Jean King vs. Bobby Riggs',
    description:
      'In the "Battle of the Sexes," 29-year-old Billie Jean King defeated 55-year-old Bobby Riggs in straight sets before 30,000 live spectators and 90 million TV viewers. Riggs had challenged King after beating Margaret Court, claiming no woman could defeat a male player. King\'s victory was more than tennis — it was a cultural watershed. She would go on to found the Women\'s Tennis Association and the Women\'s Sports Foundation, becoming the most important advocate for gender equity in sport history.',
    color: GOLD,
  },
  {
    year: '1999–Present',
    title: 'The Breakthrough Generation',
    description:
      'The 1999 US Women\'s World Cup — Brandi Chastain\'s penalty kick celebration before 90,185 fans at the Rose Bowl — proved women\'s sport could fill stadiums and capture national attention. Serena Williams dominated tennis with a power and athleticism that redefined the women\'s game, winning 23 Grand Slam singles titles. Simone Biles became the most decorated gymnast in history. The WNBA, NWSL, and women\'s professional leagues worldwide grew from afterthoughts to genuine cultural forces — though pay equity remains an ongoing battle.',
    color: SPORT_GREEN,
  },
];

// ── Global Mega-Events ──────────────────────────────────────────────────────

const MEGA_EVENT_INSIGHTS: InsightEntry[] = [
  {
    label: 'The World Cup as Geopolitics',
    detail:
      'Hosting the World Cup is a geopolitical statement. Brazil 2014 cost $15 billion; Qatar 2022 cost over $200 billion (including infrastructure). Nations bid for the tournament to project soft power, modernize infrastructure, and claim a place on the world stage. But the costs are immense and the benefits often illusory: stadiums become white elephants, communities are displaced, and workers face exploitation. Qatar\'s tournament brought scrutiny of migrant worker deaths and LGBTQ+ rights, proving that hosting mega-events invites global scrutiny as much as global attention.',
  },
  {
    label: 'Olympic Host City Syndrome',
    detail:
      'Every modern Olympics has cost more than projected — often dramatically more. Montreal 1976 took 30 years to pay off its debt. Athens 2004 contributed to Greece\'s financial crisis. Sochi 2014 cost $51 billion. Beijing 2008 displaced 1.5 million residents. Yet cities continue to bid, driven by prestige and the promise of urban transformation. Barcelona 1992 and London 2012 are cited as success stories, but they are exceptions. The Olympic Games remain the most expensive recurring event in human history.',
  },
  {
    label: 'The Super Bowl Model',
    detail:
      'The NFL\'s Super Bowl proved that a single game could become a cultural institution worth more than many entire sports leagues. The model — exclusive broadcast rights, corporate sponsorship, entertainment spectacle — has been emulated worldwide. The Champions League final, the Cricket World Cup final, and the Rugby World Cup final all borrow from the Super Bowl playbook. The lesson: in the attention economy, a single event with global reach is worth more than a hundred regular-season games.',
  },
  {
    label: 'Corruption and Reform',
    detail:
      'FIFA\'s 2015 corruption scandal — with senior officials arrested on charges including racketeering, wire fraud, and money laundering — exposed the dark side of global sports governance. The IOC\'s bidding process has faced repeated bribery allegations (Salt Lake City 2002 was a turning point). International sport\'s governing bodies hold enormous power with limited accountability. Reform has been slow, incremental, and often superficial. The tension between sport\'s idealistic self-image and its institutional corruption remains unresolved.',
  },
];

// ── Digital Era ─────────────────────────────────────────────────────────────

const DIGITAL_TIMELINE: TimelineEntry[] = [
  {
    year: '2003',
    title: 'Moneyball: The Analytics Revolution',
    description:
      'Michael Lewis\'s book "Moneyball" revealed how the Oakland Athletics used statistical analysis (sabermetrics) to compete against teams with three times their budget. Billy Beane\'s approach — finding undervalued players by measuring what actually predicted winning rather than relying on scouts\' intuition — upended baseball\'s traditional culture. The "Moneyball" approach spread to every sport: expected goals in football, player efficiency rating in basketball, expected points added in American football. Data didn\'t replace talent, but it revealed that conventional wisdom was often wrong.',
    color: BLUE,
  },
  {
    year: '2010s',
    title: 'Sports Science and the Athlete\'s Body',
    description:
      'GPS tracking, biomechanical analysis, sleep optimization, nutritional science, and injury prevention transformed how athletes train. Cristiano Ronaldo\'s body at 38 performed like a 25-year-old\'s because of obsessive scientific management. Tom Brady played NFL quarterback until age 45. Marathon world records fell repeatedly. The gap between "natural" athleticism and scientifically optimized performance grew so wide that modern athletes are essentially different biological specimens from their predecessors — trained, tracked, and optimized by technology at every level.',
    color: TEAL,
  },
  {
    year: '2010s–Present',
    title: 'Esports: Digital Competition Goes Professional',
    description:
      'Competitive gaming evolved from LAN parties to a global industry with professional leagues, million-dollar prize pools, and arenas built specifically for esports events. The League of Legends World Championship draws over 100 million viewers — more than the Super Bowl. South Korea led the way, with StarCraft becoming a national sport in the early 2000s. Esports challenged the very definition of "sport": no physical exertion, but extraordinary reaction speed, strategic depth, teamwork, and mental endurance. The IOC has considered including esports in the Olympics.',
    color: INDIGO,
  },
  {
    year: '2020s',
    title: 'Streaming, Gambling, and the Attention Economy',
    description:
      'Sports broadcasting fragmented across streaming platforms — Amazon acquired NFL Thursday Night Football, Apple got MLS, Netflix began streaming live events. Simultaneously, legalized sports gambling transformed how millions of fans engaged with sport: not just watching but betting, in real-time, on their phones. The combination of streaming and gambling created a hyper-engaged audience that consumed sport not as passive entertainment but as active financial participation. Whether this deepened fandom or corrupted it remains the defining debate of 21st-century sport.',
    color: ORANGE,
  },
];

// ── Key Figures ─────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Jesse Owens',
    years: '1913–1980',
    contribution:
      'Four gold medals at the 1936 Berlin Olympics — the greatest rebuke to Nazi racial ideology delivered on the world stage. Owens\'s 100m, 200m, long jump, and 4x100m relay victories made him the most famous athlete on Earth, yet he returned to a segregated America that refused him basic dignity.',
  },
  {
    name: 'Muhammad Ali',
    years: '1942–2016',
    contribution:
      'Three-time heavyweight champion, conscientious objector, cultural icon. Ali\'s refusal to serve in Vietnam — "I ain\'t got no quarrel with them Viet Cong" — cost him three years of his prime but made him a global symbol of principled resistance. The greatest boxer and most recognizable human being of the 20th century.',
  },
  {
    name: 'Pelé',
    years: '1940–2022',
    contribution:
      'Three World Cup victories (1958, 1962, 1970) — a record that will likely never be matched. Pelé didn\'t just play football; he embodied joy. His 1970 Brazil team is considered the greatest side ever assembled. He made football the world\'s game and proved that a kid from a Brazilian favela could become the most beloved athlete on the planet.',
  },
  {
    name: 'Billie Jean King',
    years: 'b. 1943',
    contribution:
      'Winner of 39 Grand Slam titles (singles, doubles, mixed). Founded the WTA and Women\'s Sports Foundation. The "Battle of the Sexes" victory over Bobby Riggs in 1973 was a watershed for gender equality. King spent her entire career fighting for equal prize money and opportunities — battles that are still being won today.',
  },
  {
    name: 'Michael Jordan',
    years: 'b. 1963',
    contribution:
      'Six NBA championships, five MVPs, cultural phenomenon. Jordan didn\'t just dominate basketball — he transformed athletes into global brands. Air Jordans generated more revenue than many sports leagues. His competitive intensity set the standard for athletic excellence. Jordan proved that one transcendent athlete could make a sport the center of global popular culture.',
  },
  {
    name: 'Serena Williams',
    years: 'b. 1981',
    contribution:
      '23 Grand Slam singles titles — the most in the Open Era. Williams redefined women\'s tennis with power, athleticism, and fierce competitiveness. She and Venus transformed the sport\'s demographics and proved that greatness could come from Compton as easily as from a country club. Serena is the most dominant female athlete of her generation.',
  },
  {
    name: 'Usain Bolt',
    years: 'b. 1986',
    contribution:
      'The fastest human in recorded history — 9.58 seconds for 100m, 19.19 for 200m, both set in 2009. Eight Olympic gold medals across three Games. Bolt didn\'t just break records; he made sprinting joyful. His celebrations, his personality, his sheer dominance made him the most charismatic track athlete since Jesse Owens.',
  },
  {
    name: 'Lionel Messi',
    years: 'b. 1987',
    contribution:
      'Eight Ballon d\'Or awards and a 2022 World Cup victory that cemented his claim as the greatest footballer of all time. Messi\'s career — from a growth-hormone-deficient child in Rosario to the undisputed best player on Earth — is football\'s ultimate fairy tale. His move to Inter Miami in 2023 sparked the biggest surge in American soccer interest in history.',
  },
];

// ── Timeline of Firsts ──────────────────────────────────────────────────────

const FIRSTS_TIMELINE: TimelineEntry[] = [
  {
    year: '776 BCE',
    title: 'First recorded Olympic champion (Koroibos of Elis)',
    description: 'A cook who won the stadion footrace at the first documented Olympic Games, beginning a tradition that would span over a millennium.',
    color: GOLD,
  },
  {
    year: '1845',
    title: 'First codified baseball rules (Knickerbocker Rules)',
    description: 'Alexander Cartwright\'s 20 rules established the diamond, foul lines, three outs, and force plays — the foundation of modern baseball.',
    color: GREEN,
  },
  {
    year: '1891',
    title: 'Basketball invented (James Naismith)',
    description: 'Thirteen original rules, a soccer ball, and two peach baskets. The most successful deliberate invention of a sport in history.',
    color: ORANGE,
  },
  {
    year: '1903',
    title: 'First Tour de France',
    description: 'Sixty riders set off on a 2,428km race around France. Only 21 finished. The Tour became cycling\'s greatest event and one of sport\'s most grueling tests of human endurance.',
    color: AMBER,
  },
  {
    year: '1930',
    title: 'First FIFA World Cup (Uruguay)',
    description: 'Thirteen teams, one stadium, and a host nation that won the final — the modest beginning of the world\'s biggest sporting event.',
    color: BLUE,
  },
  {
    year: '1947',
    title: 'Jackie Robinson breaks baseball\'s color barrier',
    description: 'Robinson\'s debut with the Brooklyn Dodgers was one of the most courageous acts in American sports history — and a pivotal moment in the civil rights movement.',
    color: CRIMSON,
  },
  {
    year: '1954',
    title: 'First sub-4-minute mile (Roger Bannister)',
    description: '3 minutes, 59.4 seconds at Iffley Road, Oxford. A barrier once thought humanly impossible was broken — and then broken again just 46 days later by John Landy.',
    color: TEAL,
  },
  {
    year: '1967',
    title: 'Kathrine Switzer runs the Boston Marathon',
    description: 'Race official Jock Semple tried to physically remove Switzer mid-race. Her boyfriend threw Semple aside. Switzer finished. Women weren\'t officially allowed to run the Boston Marathon until 1972.',
    color: ROSE,
  },
  {
    year: '2016',
    title: 'Leicester City wins the Premier League (5000-1 odds)',
    description: 'The greatest upset in the history of team sport. A club with a £57 million wage bill beat teams spending £200 million+, proving that sport\'s magic lies in its capacity to defy probability.',
    color: PURPLE,
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

const FIGURE_COLORS = [CRIMSON, GOLD, SPORT_GREEN, PURPLE, BLUE, ROSE, AMBER, TEAL, INDIGO, ORANGE];

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

export default function HistoryOfSportPage() {
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
            &larr; Back to Timeline
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
              background: `linear-gradient(135deg, ${SPORT_GREEN}, ${GOLD})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Faster, Higher, Stronger — The History of Sport (3000 BCE–Present)
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              Five thousand years ago, Sumerian wrestlers grappled before cheering crowds. Greek athletes raced naked at Olympia. Roman gladiators fought for their lives before a quarter-million spectators. Medieval knights shattered lances in tournaments. And today, 3.5 billion people tune in to watch a single football match. Sport is not a sideshow to human civilization — it is one of its defining activities, shaping politics, culture, economics, and identity from the earliest city-states to the streaming age.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              From the dust of ancient Olympia to billion-dollar broadcasting deals, from Jackie Robinson breaking baseball's color barrier to esports filling arenas, the history of sport is a history of human ambition, tribal loyalty, political power, and the eternal drive to test the limits of the body and mind. This is how games became the universal language of civilization.
            </p>
          </motion.div>
        </header>

        {/* Opening callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            backgroundColor: 'rgba(5, 150, 105, 0.08)',
            border: `1px solid ${SPORT_GREEN}44`,
            borderRadius: 12,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <h3 style={{ color: SPORT_GREEN, fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
            Sport's Paradox: Unity and Division
          </h3>
          <p style={{ color: ASH, lineHeight: 1.7, fontSize: '0.95rem' }}>
            Sport brings billions together — and tears them apart. The same Olympics that gave Jesse Owens a platform to defy Nazi racism also legitimized Hitler's regime. The same World Cup that unites nations in shared celebration displaces communities and exploits workers to build stadiums. Sport is humanity's most powerful mirror: it reflects our highest aspirations and our deepest contradictions, often in the same event.
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

        {/* Section 1: Ancient Origins */}
        <SectionWrapper
          id="ancient-origins"
          icon="🏺"
          title="Ancient Origins: Sport Before History (3000–500 BCE)"
          accentColor={BRONZE}
          intro="Long before the Greeks lit the Olympic flame, civilizations across the ancient world organized athletic competitions. Wrestling in Mesopotamia, acrobatics in Egypt, bull-leaping in Crete, and the ball game in Mesoamerica — sport is not a modern invention. It is one of the oldest and most universal forms of human expression, as ancient as writing itself."
        >
          <TimelineCard entries={ANCIENT_TIMELINE} />
        </SectionWrapper>

        {/* Section 2: Greek Olympics */}
        <SectionWrapper
          id="greek-olympics"
          icon="🏛️"
          title="The Greek Olympics (776 BCE–393 CE)"
          accentColor={GOLD}
          intro="For over a millennium, every four years, the Greek world declared a sacred truce and gathered at Olympia to compete, worship, and celebrate. The ancient Olympics weren't just an athletic festival — they were the beating heart of Greek identity, a place where city-states that fought wars the other three years came together through sport. Victory at Olympia brought immortality."
        >
          <TimelineCard entries={GREEK_TIMELINE} />
        </SectionWrapper>

        {/* Section 3: Roman Spectacle */}
        <SectionWrapper
          id="roman-spectacle"
          icon="🗡️"
          title="Roman Spectacle: Blood, Speed, and Power (264 BCE–476 CE)"
          accentColor={CRIMSON}
          intro="Rome transformed sport from athletic competition into mass entertainment on an industrial scale. Gladiatorial combat, chariot racing, and staged animal hunts weren't just games — they were instruments of political control, social bonding, and imperial power. Rome built the infrastructure of spectator sport: the arena, the stadium, the season, the fan culture. We are still living in structures the Romans invented."
        >
          <InsightGrid items={ROMAN_INSIGHTS} />
        </SectionWrapper>

        {/* Section 4: Medieval Tournaments */}
        <SectionWrapper
          id="medieval"
          icon="⚔️"
          title="Medieval Tournaments and Peasant Games (500–1500)"
          accentColor={AMBER}
          intro="After Rome fell, organized sport didn't disappear — it transformed. Aristocrats channeled martial culture into tournaments and jousts. Common people played rough, chaotic games that would eventually evolve into modern football. The medieval period created the class divide in sport that persists today: elite pursuits with formal rules versus popular games that authorities tried (and failed) to suppress."
        >
          <InsightGrid items={MEDIEVAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 5: English Codification */}
        <SectionWrapper
          id="codification"
          icon="📜"
          title="The English Codification (1700s–1880s)"
          accentColor={SPORT_GREEN}
          intro="Modern sport was invented in England. Not the games themselves — people have been kicking balls and hitting things with sticks forever — but the idea of universal rules, governing bodies, organized competitions, and international standardization. Between 1744 and 1886, the English codified cricket, football, rugby, tennis, and the administrative infrastructure that governs global sport to this day."
        >
          <TimelineCard entries={CODIFICATION_TIMELINE} />
        </SectionWrapper>

        {/* Section 6: Modern Olympics */}
        <SectionWrapper
          id="modern-olympics"
          icon="🔥"
          title="The Modern Olympics (1896–1936)"
          accentColor={BLUE}
          intro="A French aristocrat's dream of reviving the ancient Greek Games became the world's greatest sporting event — and its most complex political stage. From 241 athletes in Athens to the propaganda spectacle of Berlin, the early modern Olympics established sport as a vehicle for nationalism, ideology, and the contested ideal of international brotherhood."
        >
          <TimelineCard entries={OLYMPICS_TIMELINE} />
        </SectionWrapper>

        {/* Section 7: American Sports Culture */}
        <SectionWrapper
          id="american-sports"
          icon="⚾"
          title="American Sports Culture (1845–1980s)"
          accentColor={RED}
          intro="America didn't just play sports — it invented new ones, commercialized them, and wove them into the national identity. Baseball became the 'national pastime' and a mirror for racial justice. Basketball spread from a Massachusetts gym to every continent. Football evolved from a near-lethal college game into a billion-dollar industry. And boxing produced the most famous athletes on Earth."
        >
          <InsightGrid items={AMERICAN_INSIGHTS} />
        </SectionWrapper>

        {/* Section 8: Global Spread */}
        <SectionWrapper
          id="global-spread"
          icon="🌍"
          title="The Global Spread (1904–1980s)"
          accentColor={TEAL}
          intro="Sport didn't stay in England or America. Football spread through trade routes, colonial networks, and sheer popularity to become the world's universal language. Cricket became the obsession of the subcontinent and Caribbean. International federations codified global competition. By mid-century, sport was the one arena where every nation on Earth competed on (theoretically) equal terms."
        >
          <TimelineCard entries={GLOBAL_TIMELINE} />
        </SectionWrapper>

        {/* Section 9: Political Dimensions */}
        <SectionWrapper
          id="political"
          icon="✊"
          title="Sport and Politics: The Arena as Battleground"
          accentColor={ROSE}
          intro="Sport has never been 'just a game.' Jesse Owens humiliated Nazi ideology. Tommie Smith and John Carlos risked everything on the Olympic podium. Apartheid boycotts helped bring down a racist regime. Cold War medal counts were ideological warfare. The playing field is always a political stage — and athletes who use that stage pay a price."
        >
          <InsightGrid items={POLITICAL_INSIGHTS} />
        </SectionWrapper>

        {/* Section 10: TV and Commercialization */}
        <SectionWrapper
          id="commercialization"
          icon="📺"
          title="Television and the Money Revolution (1970–2000s)"
          accentColor={ORANGE}
          intro="Television didn't just broadcast sport — it transformed it. Monday Night Football turned games into prime-time entertainment. Michael Jordan and Nike turned athletes into global brands. The Premier League turned football clubs into billion-dollar media properties. Sport became the most valuable content on television, and television money remade sport in its image."
        >
          <InsightGrid items={TV_INSIGHTS} />
        </SectionWrapper>

        {/* Section 11: Women in Sport */}
        <SectionWrapper
          id="women-in-sport"
          icon="🏆"
          title="Women in Sport: Breaking Every Barrier"
          accentColor={PURPLE}
          intro="For most of sport's history, women were excluded, mocked, or told their bodies couldn't handle competition. Title IX, the Battle of the Sexes, and generations of athletes who refused to accept 'no' changed everything. The story of women in sport is one of the great civil rights narratives of the 20th century — and the fight for equal pay, coverage, and respect continues today."
        >
          <TimelineCard entries={WOMEN_TIMELINE} />
        </SectionWrapper>

        {/* Section 12: Global Mega-Events */}
        <SectionWrapper
          id="mega-events"
          icon="🌐"
          title="Global Mega-Events: Sport as Soft Power"
          accentColor={INDIGO}
          intro="The World Cup, the Olympics, and the Super Bowl are no longer just sporting events — they are geopolitical instruments, economic engines, and cultural rituals. Hosting them costs billions, displaces communities, and invites global scrutiny. Yet nations compete fiercely for the privilege. Mega-events reveal sport's ultimate paradox: its power to inspire is inseparable from its power to corrupt."
        >
          <InsightGrid items={MEGA_EVENT_INSIGHTS} />
        </SectionWrapper>

        {/* Section 13: Digital Era */}
        <SectionWrapper
          id="digital-era"
          icon="💻"
          title="The Digital Era: Analytics, Esports, and the Future (2000–Present)"
          accentColor={SKY}
          intro="Data analytics upended how teams are built. Sports science transformed the athlete's body. Esports created entirely new forms of competition. Streaming fragmented how we watch, and gambling changed how we engage. The 21st century hasn't just changed sport — it has expanded the definition of what sport is."
        >
          <TimelineCard entries={DIGITAL_TIMELINE} />
        </SectionWrapper>

        {/* Section 14: Key Figures */}
        <SectionWrapper
          id="key-figures"
          icon="🏅"
          title="The Pantheon: Sport's Greatest Figures"
          accentColor={GOLD}
          intro="Across eras and disciplines, these athletes and advocates didn't just compete — they transformed their sports, challenged injustice, and captured the imagination of the world. Their stories are inseparable from the story of sport itself."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* Section 15: Timeline of Firsts */}
        <SectionWrapper
          id="firsts"
          icon="⏱️"
          title="Timeline of Firsts"
          accentColor={TEAL}
          intro="The milestones that defined sport's evolution — from the first recorded Olympic champion to the greatest underdog story in team sport history."
        >
          <TimelineCard entries={FIRSTS_TIMELINE} />
        </SectionWrapper>

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
              { to: '/history-of-film', label: 'History of Film (Sports on Screen)' },
              { to: '/cold-war', label: 'Cold War (Olympic Rivalry)' },
              { to: '/civil-rights', label: 'Civil Rights Movement' },
              { to: '/ancient-greece', label: 'Ancient Greece' },
              { to: '/roman-empire', label: 'Roman Empire' },
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
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 20px', fontStyle: 'italic' }}>
            "Sport has the power to change the world. It has the power to inspire. It has the power to unite people in a way that little else does."
            — Nelson Mandela, 2000
          </p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>
            &larr; Back to Timeline
          </Link>
        </footer>
      </div>
    </div>
  );
}
