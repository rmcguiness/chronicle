/**
 * MediaHistoryPage — curated topic page: History of Media & Communication.
 *
 * Route: /media
 *
 * Sections:
 *  1. Hero — "How Humanity Told Its Story"
 *  2. Filter bar — media type + era filters
 *  3. Timeline milestones — 32 entries from cave paintings to AI content
 *  4. Narrative Control — "Who controlled the narrative?" callouts per era
 *
 * All data is static/curated — no backend API needed.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type MediaType = 'Print' | 'Broadcast' | 'Digital' | 'Social';

type Era =
  | 'Prehistoric'
  | 'Ancient'
  | 'Medieval'
  | 'Early Modern'
  | 'Industrial'
  | 'Modern'
  | 'Digital Age';

interface Milestone {
  name: string;
  year: number;
  isBce: boolean;
  figure: string;
  mediaType: MediaType;
  whatItChanged: string;
  revolutionScore: number; // 1–10 impact
  era: Era;
  slug?: string;
}

interface NarrativeControl {
  era: string;
  period: string;
  controller: string;
  description: string;
  icon: string;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const MEDIA_TYPE_COLORS: Record<MediaType, string> = {
  Print: '#3b82f6',
  Broadcast: '#f97316',
  Digital: '#a855f7',
  Social: '#22c55e',
};

const MEDIA_TYPE_ICONS: Record<MediaType, string> = {
  Print: '\u{1F4F0}',
  Broadcast: '\u{1F4E1}',
  Digital: '\u{1F4BB}',
  Social: '\u{1F4F1}',
};

const ERA_ORDER: Era[] = [
  'Prehistoric',
  'Ancient',
  'Medieval',
  'Early Modern',
  'Industrial',
  'Modern',
  'Digital Age',
];

const MILESTONES: Milestone[] = [
  // PREHISTORIC
  {
    name: 'Cave Paintings',
    year: 40000,
    isBce: true,
    figure: 'Early Homo sapiens',
    mediaType: 'Print',
    whatItChanged:
      'The cave paintings of Chauvet-Pont-d\'Arc in southern France represent humanity\'s first visual storytelling — handprints, animals, and abstract symbols painted with ochre and charcoal. These weren\'t decoration; they were communication across time. Someone 40,000 years ago left a message that we can still read today. Similar art appears in Indonesia, Spain, and South Africa, suggesting an innate human drive to record and transmit experience.',
    revolutionScore: 9,
    era: 'Prehistoric',
  },
  // ANCIENT
  {
    name: 'Cuneiform Writing',
    year: 3400,
    isBce: true,
    figure: 'Sumerian scribes',
    mediaType: 'Print',
    whatItChanged:
      'In the city-states of Sumer (modern Iraq), scribes pressed reed styluses into wet clay tablets to record grain inventories, tax receipts, and legal contracts. Cuneiform — literally "wedge-shaped" — was the world\'s first writing system. It began as pictographs and evolved into abstract symbols representing sounds. Writing enabled bureaucracy, law, literature (the Epic of Gilgamesh), and the accumulation of knowledge across generations. Literacy was power, restricted to a trained elite.',
    revolutionScore: 10,
    era: 'Ancient',
    slug: 'cuneiform-writing',
  },
  {
    name: 'Papyrus',
    year: 3000,
    isBce: true,
    figure: 'Egyptian scribes',
    mediaType: 'Print',
    whatItChanged:
      'Egyptians discovered that strips of the papyrus plant could be woven, pressed, and dried into a lightweight, portable writing surface. Unlike heavy clay tablets, papyrus scrolls could be carried, shipped, and stored in vast quantities. This made Egypt the ancient world\'s information superpower — the word "paper" derives from papyrus. Papyrus enabled letters, administrative records across a vast empire, and the religious texts (Book of the Dead) that defined Egyptian civilization.',
    revolutionScore: 8,
    era: 'Ancient',
  },
  {
    name: 'Library of Alexandria',
    year: 280,
    isBce: true,
    figure: 'Ptolemy I & II',
    mediaType: 'Print',
    whatItChanged:
      'Founded by the Ptolemaic dynasty, the Library of Alexandria was humanity\'s first great knowledge repository — an attempt to collect every scroll in the known world. At its peak it held an estimated 400,000 scrolls covering philosophy, mathematics, astronomy, medicine, and literature. Ships docking at Alexandria were required to surrender any scrolls for copying. Its eventual destruction (debated — fire, neglect, or conquest) became history\'s most symbolic loss of knowledge.',
    revolutionScore: 7,
    era: 'Ancient',
    slug: 'library-of-alexandria',
  },
  {
    name: 'Roman Acta Diurna',
    year: 59,
    isBce: true,
    figure: 'Julius Caesar',
    mediaType: 'Print',
    whatItChanged:
      'In 59 BCE, Julius Caesar ordered that the proceedings of the Roman Senate be published daily on stone or metal tablets posted in public forums — the Acta Diurna, or "Daily Acts." These included political decisions, military victories, trials, births, deaths, and even human interest stories. This was the world\'s first newspaper: regularly published, publicly accessible, and covering current events. It ran for over 500 years until the fall of Rome.',
    revolutionScore: 6,
    era: 'Ancient',
  },
  // MEDIEVAL
  {
    name: 'Gutenberg Printing Press',
    year: 1440,
    isBce: false,
    figure: 'Johannes Gutenberg',
    mediaType: 'Print',
    whatItChanged:
      'Johannes Gutenberg\'s movable-type printing press in Mainz, Germany, was the single most transformative media technology before the internet. His 42-line Bible (c. 1455) demonstrated mass production of text. Before Gutenberg, a book took months to copy by hand; after, hundreds of copies could be produced in weeks. Within 50 years, 20 million volumes had been printed in Europe. The press enabled the Protestant Reformation, the Scientific Revolution, the spread of literacy, and the end of the Catholic Church\'s information monopoly.',
    revolutionScore: 10,
    era: 'Medieval',
    slug: 'gutenberg-printing-press',
  },
  // EARLY MODERN
  {
    name: 'First Newspaper (Relation)',
    year: 1605,
    isBce: false,
    figure: 'Johann Carolus',
    mediaType: 'Print',
    whatItChanged:
      'Johann Carolus published the "Relation aller Fürnemmen und gedenckwürdigen Historien" in Strasbourg — recognized as the world\'s first printed newspaper. It appeared weekly, covering news from across Europe gathered via postal networks. The concept spread rapidly: newspapers appeared in Antwerp (1605), London (1621), Paris (1631), and Boston (1690). For the first time, ordinary people could access current events beyond their immediate community.',
    revolutionScore: 7,
    era: 'Early Modern',
  },
  {
    name: 'First Daily Newspaper',
    year: 1702,
    isBce: false,
    figure: 'Elizabeth Mallet',
    mediaType: 'Print',
    whatItChanged:
      'Elizabeth Mallet published the Daily Courant in London — the first daily newspaper in English. It was a single page, printed on one side, containing foreign news translated from European papers. Mallet explicitly separated news from opinion, promising readers "just the facts." The Daily Courant established the daily news cycle that would dominate media for 300 years, creating the expectation that the public deserved to know what happened yesterday.',
    revolutionScore: 5,
    era: 'Early Modern',
  },
  // INDUSTRIAL
  {
    name: 'Penny Press',
    year: 1833,
    isBce: false,
    figure: 'Benjamin Day',
    mediaType: 'Print',
    whatItChanged:
      'Benjamin Day launched the New York Sun at one penny per copy — a fraction of the six cents charged by established papers. The penny press model shifted newspaper economics from subscriptions (serving elites) to advertising (serving masses). Cheap papers meant mass readership, which meant advertisers paid to reach them. This created modern journalism: sensational headlines, human interest stories, crime reporting, and the reporter as a professional role. The Sun\'s motto: "It Shines for ALL."',
    revolutionScore: 7,
    era: 'Industrial',
  },
  {
    name: 'Photography (Daguerreotype)',
    year: 1839,
    isBce: false,
    figure: 'Louis Daguerre',
    mediaType: 'Print',
    whatItChanged:
      'Louis Daguerre\'s daguerreotype process produced the first practical photographs — permanent images captured by light on a silver-coated copper plate. Photography shattered the monopoly of painting and illustration as visual record-keeping. For the first time, reality could be captured exactly as it appeared. War photography (Crimean War, American Civil War) brought the horror of conflict to civilian audiences. Portrait photography democratized what had been a luxury of the wealthy.',
    revolutionScore: 8,
    era: 'Industrial',
  },
  {
    name: 'Telegraph',
    year: 1844,
    isBce: false,
    figure: 'Samuel Morse',
    mediaType: 'Broadcast',
    whatItChanged:
      'On May 24, 1844, Samuel Morse sent "What hath God wrought" from Washington to Baltimore via electrical telegraph — the first instant long-distance communication in human history. Before the telegraph, news traveled at the speed of a horse or ship. After, it traveled at the speed of electricity. The telegraph created wire services (Associated Press, 1846), enabled stock markets to operate nationally, coordinated railroad schedules, and shrank the world overnight. It was the Victorian internet.',
    revolutionScore: 9,
    era: 'Industrial',
    slug: 'telegraph-invention',
  },
  {
    name: 'Telephone',
    year: 1876,
    isBce: false,
    figure: 'Alexander Graham Bell',
    mediaType: 'Broadcast',
    whatItChanged:
      'Alexander Graham Bell\'s telephone transmitted the human voice over wire for the first time. "Mr. Watson, come here — I want to see you" became one of history\'s most famous sentences. The telephone transformed communication from text (telegraph) to voice, making it personal and immediate. By 1900, 600,000 phones were in use in the US. The telephone enabled real-time business, personal relationships across distance, and eventually the infrastructure that would carry the internet.',
    revolutionScore: 8,
    era: 'Industrial',
  },
  {
    name: 'Phonograph',
    year: 1877,
    isBce: false,
    figure: 'Thomas Edison',
    mediaType: 'Broadcast',
    whatItChanged:
      'Thomas Edison\'s phonograph recorded and played back sound for the first time in human history. "Mary Had a Little Lamb" was the first recorded audio. Before the phonograph, music existed only in live performance — once a note was played, it was gone forever. The phonograph created the recorded music industry, enabled oral history preservation, and fundamentally changed how humans experience art. It led to records, cassettes, CDs, and streaming.',
    revolutionScore: 7,
    era: 'Industrial',
  },
  {
    name: 'Motion Pictures',
    year: 1895,
    isBce: false,
    figure: 'Auguste & Louis Lumière',
    mediaType: 'Broadcast',
    whatItChanged:
      'On December 28, 1895, the Lumière brothers screened ten short films at the Grand Café in Paris — the birth of cinema. Legend has it that audiences screamed and ducked when a train appeared to rush toward them. Motion pictures combined photography, storytelling, and spectacle into the most powerful mass medium the world had ever seen. Hollywood, Bollywood, propaganda films, newsreels, documentaries — cinema shaped the 20th century\'s imagination and ideology.',
    revolutionScore: 9,
    era: 'Industrial',
    slug: 'first-film-screening',
  },
  // MODERN
  {
    name: 'Tabloid Journalism',
    year: 1919,
    isBce: false,
    figure: 'Joseph Patterson',
    mediaType: 'Print',
    whatItChanged:
      'The New York Daily News launched in 1919 as America\'s first tabloid — a half-size newspaper dominated by photographs, bold headlines, crime stories, celebrity gossip, and scandal. Its front-page photograph of Ruth Snyder\'s electrocution (1928) sold millions of copies. Tabloids proved that sensation sold better than substance, pioneering techniques that would later define cable news, clickbait, and social media engagement. Critics called it "the decline of journalism"; publishers called it survival.',
    revolutionScore: 5,
    era: 'Modern',
  },
  {
    name: 'Radio Broadcasting',
    year: 1920,
    isBce: false,
    figure: 'KDKA Pittsburgh',
    mediaType: 'Broadcast',
    whatItChanged:
      'On November 2, 1920, KDKA in Pittsburgh broadcast the Harding-Cox presidential election results — generally considered the first commercial radio broadcast. Radio brought news, music, sports, drama, and advertising directly into people\'s homes. FDR\'s "Fireside Chats" demonstrated radio\'s political power. Orson Welles\' "War of the Worlds" (1938) showed its ability to create mass panic. By 1940, 83% of American households had a radio.',
    revolutionScore: 9,
    era: 'Modern',
  },
  {
    name: 'Television',
    year: 1927,
    isBce: false,
    figure: 'Philo Farnsworth',
    mediaType: 'Broadcast',
    whatItChanged:
      'Philo Farnsworth, a 21-year-old Idaho farm boy, demonstrated the first fully electronic television in 1927. Mass broadcasting began in the late 1930s — BBC (1936), NBC/CBS (1939). Television combined radio\'s immediacy with cinema\'s visual power, delivering it to every living room. JFK\'s assassination, the Moon landing, Vietnam War coverage, the fall of the Berlin Wall — television made the world witness history together in real time. By 1960, 90% of US homes had a TV set.',
    revolutionScore: 10,
    era: 'Modern',
  },
  {
    name: 'Paperback Books',
    year: 1935,
    isBce: false,
    figure: 'Allen Lane (Penguin)',
    mediaType: 'Print',
    whatItChanged:
      'Allen Lane founded Penguin Books in 1935, selling quality paperback editions for sixpence — the price of a pack of cigarettes. Previously, books were expensive hardcovers accessible mainly to the educated middle and upper classes. Penguin\'s cheap, well-designed paperbacks democratized reading on a scale not seen since Gutenberg. Paperbacks turned literature into a mass-market commodity, creating airport bookshops, bestseller lists, and the modern publishing industry.',
    revolutionScore: 6,
    era: 'Modern',
  },
  {
    name: 'First TV News Broadcast',
    year: 1941,
    isBce: false,
    figure: 'CBS',
    mediaType: 'Broadcast',
    whatItChanged:
      'CBS launched the first regularly scheduled television news broadcast on July 1, 1941 — a 15-minute evening program anchored by Richard Hubbell. After Pearl Harbor, TV news became essential. Walter Cronkite\'s CBS Evening News (1962–1981) earned him the title "most trusted man in America." TV news created the anchor-as-authority model, shaped public opinion on civil rights and Vietnam, and established the evening news ritual that defined American media consumption for decades.',
    revolutionScore: 7,
    era: 'Modern',
  },
  {
    name: 'First Electronic Computer (ENIAC)',
    year: 1945,
    isBce: false,
    figure: 'J. Presper Eckert & John Mauchly',
    mediaType: 'Digital',
    whatItChanged:
      'ENIAC (Electronic Numerical Integrator and Computer), built at the University of Pennsylvania, was the first general-purpose electronic computer. Weighing 30 tons and filling an entire room, it could perform 5,000 additions per second. ENIAC was built for military ballistics calculations but demonstrated that electronic machines could process information at unprecedented speed. It launched the computing revolution that would eventually produce the internet, smartphones, and AI — every digital medium traces its ancestry to this machine.',
    revolutionScore: 8,
    era: 'Modern',
  },
  {
    name: 'ARPANET',
    year: 1969,
    isBce: false,
    figure: 'Charley Kline & Bill Duvall',
    mediaType: 'Digital',
    whatItChanged:
      'On October 29, 1969, a UCLA graduate student sent the first message over ARPANET to Stanford Research Institute. He typed "LOGIN" — the system crashed after "LO." So the first internet message was "Lo" — as in "Lo and behold." ARPANET, funded by the US Department of Defense, pioneered packet switching — breaking data into pieces routed independently across networks. This architecture became the foundation of the internet, the most transformative communication infrastructure since language itself.',
    revolutionScore: 10,
    era: 'Modern',
    slug: 'arpanet-first-connection',
  },
  {
    name: 'CNN 24-Hour News',
    year: 1980,
    isBce: false,
    figure: 'Ted Turner',
    mediaType: 'Broadcast',
    whatItChanged:
      'Ted Turner launched CNN (Cable News Network) on June 1, 1980, promising "We won\'t be signing off until the world ends." Skeptics called it the "Chicken Noodle Network." CNN proved them wrong during the 1991 Gulf War, when its live coverage from Baghdad transformed global news consumption. 24-hour news created the always-on news cycle, eliminated the concept of "news hours," and spawned competitors (Fox News, MSNBC) that turned news into ideological entertainment. Breaking news became permanent news.',
    revolutionScore: 7,
    era: 'Modern',
  },
  // DIGITAL AGE
  {
    name: 'World Wide Web',
    year: 1991,
    isBce: false,
    figure: 'Tim Berners-Lee',
    mediaType: 'Digital',
    whatItChanged:
      'Tim Berners-Lee, a physicist at CERN, invented HTML, HTTP, and URLs — the trio of technologies that created the World Wide Web. He made them freely available, refusing to patent the web. His first website (info.cern.ch) went live in 1991. The web transformed the internet from a text-based academic network into a visual, navigable, universal medium. By democratizing publishing, the web destroyed traditional media gatekeepers and created the information ecosystem we live in today.',
    revolutionScore: 10,
    era: 'Digital Age',
    slug: 'world-wide-web',
  },
  {
    name: 'Blogs',
    year: 1997,
    isBce: false,
    figure: 'Jorn Barger & early bloggers',
    mediaType: 'Digital',
    whatItChanged:
      'Jorn Barger coined the term "weblog" in 1997; Peter Merholz shortened it to "blog" in 1999. Platforms like Blogger (1999) and WordPress (2003) made it possible for anyone with internet access to publish globally. Blogs disrupted traditional journalism — political blogs influenced the 2004 US election, tech blogs launched careers and companies. The blogosphere proved that media didn\'t require institutional backing, paving the way for every form of user-generated content that followed.',
    revolutionScore: 6,
    era: 'Digital Age',
  },
  {
    name: 'Wikipedia',
    year: 2001,
    isBce: false,
    figure: 'Jimmy Wales & Larry Sanger',
    mediaType: 'Digital',
    whatItChanged:
      'Wikipedia launched on January 15, 2001, as a radical experiment: an encyclopedia anyone could edit. Experts predicted chaos; instead, collaborative editing produced the largest reference work in human history — over 62 million articles in 300+ languages. Wikipedia democratized knowledge access globally and proved that volunteer communities could create and maintain high-quality information at scale. It became the internet\'s de facto reference source and a model for collaborative knowledge creation.',
    revolutionScore: 7,
    era: 'Digital Age',
  },
  {
    name: 'Facebook',
    year: 2004,
    isBce: false,
    figure: 'Mark Zuckerberg',
    mediaType: 'Social',
    whatItChanged:
      'Mark Zuckerberg launched "TheFacebook" from his Harvard dorm room on February 4, 2004. Within two years it was open to everyone. Facebook didn\'t invent social networking (Friendster, MySpace came first), but it perfected it — the News Feed (2006) algorithmically curated content, creating the attention economy model that now dominates the internet. With 3 billion monthly users, Facebook reshaped elections, enabled movements (Arab Spring), spread misinformation, and made social media the primary news source for billions.',
    revolutionScore: 8,
    era: 'Digital Age',
  },
  {
    name: 'YouTube',
    year: 2005,
    isBce: false,
    figure: 'Chad Hurley, Steve Chen & Jawed Karim',
    mediaType: 'Social',
    whatItChanged:
      'YouTube\'s first video — "Me at the zoo" — was uploaded on April 23, 2005. The platform democratized video in the same way blogs democratized text. Acquired by Google for $1.65 billion in 2006, YouTube became the world\'s second-largest search engine. It created entirely new media categories: vlogs, tutorials, music videos, reaction videos, and the "YouTuber" as a viable career. Over 500 hours of video are uploaded every minute. YouTube proved that anyone could be a broadcaster.',
    revolutionScore: 8,
    era: 'Digital Age',
  },
  {
    name: 'Twitter',
    year: 2006,
    isBce: false,
    figure: 'Jack Dorsey',
    mediaType: 'Social',
    whatItChanged:
      'Jack Dorsey sent the first tweet on March 21, 2006: "just setting up my twttr." Twitter\'s 140-character constraint (later 280) created a new form of communication — real-time, public, and conversational. Twitter became the global town square: breaking news appeared on Twitter before CNN, world leaders communicated policy via tweets, and hashtag movements (#MeToo, #BlackLivesMatter, #ArabSpring) demonstrated social media\'s power to organize collective action at unprecedented speed.',
    revolutionScore: 7,
    era: 'Digital Age',
  },
  {
    name: 'Smartphones (iPhone)',
    year: 2007,
    isBce: false,
    figure: 'Steve Jobs',
    mediaType: 'Digital',
    whatItChanged:
      'When Steve Jobs unveiled the iPhone on January 9, 2007, he said Apple was "reinventing the phone." He was actually reinventing media. The smartphone put a camera, video recorder, publishing platform, news reader, and global communication device in every pocket. By 2024, 6.8 billion people — 85% of the world\'s population — carry a smartphone. Everyone became a publisher, photographer, filmmaker, and broadcaster simultaneously. The smartphone is the most widely distributed media technology in human history.',
    revolutionScore: 10,
    era: 'Digital Age',
  },
  {
    name: 'Netflix Streaming',
    year: 2007,
    isBce: false,
    figure: 'Reed Hastings',
    mediaType: 'Digital',
    whatItChanged:
      'Netflix launched its streaming service in 2007, initially as a supplement to its DVD-by-mail business. By 2013, it was producing original content (House of Cards). Netflix killed appointment television — the idea that you watched what networks decided to air, when they decided to air it. Binge-watching replaced weekly episodes. The streaming wars (Disney+, HBO Max, Amazon Prime) fragmented the media landscape. Netflix\'s algorithm-driven recommendations pioneered the personalized content feeds that now dominate all media.',
    revolutionScore: 7,
    era: 'Digital Age',
  },
  {
    name: 'Fake News Crisis',
    year: 2016,
    isBce: false,
    figure: 'Multiple actors',
    mediaType: 'Social',
    whatItChanged:
      'The 2016 US presidential election exposed how social media could be weaponized for disinformation. Russian troll farms, fabricated news sites, and algorithmic amplification created a crisis of trust in media. Studies showed that false news stories spread six times faster than true ones on social media. "Fake news" entered the global vocabulary. The crisis revealed that the democratization of media — once celebrated — had a dark side: when everyone can publish, no one can agree on what\'s true. Algorithmic filter bubbles reinforced existing beliefs rather than challenging them.',
    revolutionScore: 7,
    era: 'Digital Age',
  },
  {
    name: 'TikTok',
    year: 2016,
    isBce: false,
    figure: 'Zhang Yiming (ByteDance)',
    mediaType: 'Social',
    whatItChanged:
      'TikTok (launched as Douyin in China in 2016, globally in 2018) revolutionized media consumption with short-form vertical video and an AI-driven recommendation algorithm so effective it\'s been called "digital crack." Unlike platforms where you follow people, TikTok\'s For You Page surfaces content from anyone based on engagement patterns. This created a new media meritocracy — a teenager in their bedroom could go viral overnight. TikTok reached 1 billion users faster than any platform in history and forced Instagram (Reels), YouTube (Shorts), and every competitor to copy its format.',
    revolutionScore: 8,
    era: 'Digital Age',
  },
  {
    name: 'AI-Generated Content',
    year: 2022,
    isBce: false,
    figure: 'OpenAI & others',
    mediaType: 'Digital',
    whatItChanged:
      'ChatGPT\'s launch in November 2022 marked the moment AI-generated content entered mainstream consciousness. Large language models can now write articles, generate images (DALL-E, Midjourney), create videos, compose music, and produce code. The implications for media are existential: if machines can create content indistinguishable from human work, what happens to journalism, entertainment, and creative professions? Deepfakes threaten to make visual evidence unreliable. We are entering an era where seeing is no longer believing, and the very concept of "authentic" content is being redefined.',
    revolutionScore: 9,
    era: 'Digital Age',
  },
];

const NARRATIVE_CONTROL: NarrativeControl[] = [
  {
    era: 'Ancient World',
    period: '3400 BCE – 476 CE',
    controller: 'Priests, Scribes & Emperors',
    description:
      'Literacy was restricted to a tiny elite — perhaps 1-2% of the population. Sumerian temple scribes, Egyptian priests, and Roman officials controlled what was written and who could read it. The "narrative" was whatever those in power decided to inscribe on monuments, tablets, and scrolls. Dissenting voices were literally unrecorded.',
    icon: '\u{1F3DB}\uFE0F',
    color: '#d97706',
  },
  {
    era: 'Medieval Period',
    period: '476 – 1440 CE',
    controller: 'The Catholic Church',
    description:
      'In medieval Europe, the Church held a near-total monopoly on literacy, book production, and education. Monasteries were the sole copying centers for manuscripts. The Church decided which texts were preserved and which were suppressed. Latin — not spoken by common people — was the language of knowledge. Information flowed through a single institutional filter for nearly a thousand years.',
    icon: '\u26EA',
    color: '#7c3aed',
  },
  {
    era: 'Print Revolution',
    period: '1440 – 1830',
    controller: 'Printers, Governments & Censors',
    description:
      'Gutenberg broke the Church\'s monopoly, but governments quickly imposed licensing and censorship. In England, the Licensing Act required government approval for all publications. Printers who defied censorship risked imprisonment or death. Yet the genie was out of the bottle — pamphlets, broadsheets, and underground presses fueled the Reformation, the Enlightenment, and democratic revolutions.',
    icon: '\u{1F5A8}\uFE0F',
    color: '#3b82f6',
  },
  {
    era: 'Mass Media Age',
    period: '1830 – 1990',
    controller: 'Media Moguls & Corporations',
    description:
      'The penny press, radio, and television required massive capital investment — printing presses, broadcast towers, studio infrastructure. This created natural monopolies. By mid-20th century, a handful of corporations (Hearst, Murdoch, NBC/CBS/ABC) controlled what most people saw, read, and heard. "Freedom of the press belongs to those who own one," wrote A.J. Liebling. Three TV networks decided the news for 200 million Americans.',
    icon: '\u{1F4FA}',
    color: '#f97316',
  },
  {
    era: 'Internet Era',
    period: '1990 – 2015',
    controller: 'Everyone (briefly)',
    description:
      'The web and social media briefly democratized the narrative. Blogs, YouTube, Twitter, and citizen journalism gave voice to billions. The Arab Spring showed people could organize revolutions via social media. But this utopian period was short-lived — within a decade, algorithmic curation by Silicon Valley platforms began deciding what content billions of people would see.',
    icon: '\u{1F310}',
    color: '#22c55e',
  },
  {
    era: 'Algorithm Age',
    period: '2015 – Present',
    controller: 'Algorithms & AI',
    description:
      'Today, the narrative is controlled by recommendation algorithms at Meta, Google, TikTok, and a handful of other platforms. These algorithms optimize for engagement — not truth, nuance, or public good. The result: filter bubbles, polarization, and a fragmented information landscape where different populations live in different realities. AI-generated content adds a new dimension: soon, much of what we consume will be created by machines trained on human data.',
    icon: '\u{1F916}',
    color: '#a855f7',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatYear(year: number, isBce: boolean): string {
  if (isBce) {
    if (year >= 1000000) return `~${(year / 1000000).toFixed(0)}M BCE`;
    if (year >= 1000) return `${(year / 1000).toFixed(0)},000 BCE`;
    return `${year} BCE`;
  }
  return String(year);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        padding: '10px 16px',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>{value}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        border: active
          ? `1px solid ${color ?? '#60a5fa'}`
          : '1px solid rgba(255,255,255,0.1)',
        backgroundColor: active
          ? `${color ?? '#60a5fa'}22`
          : 'rgba(255,255,255,0.04)',
        color: active ? color ?? '#60a5fa' : '#94a3b8',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
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
  );
}

function RevolutionScoreBadge({ score }: { score: number }) {
  const color =
    score >= 9 ? '#ef4444' : score >= 7 ? '#f97316' : score >= 5 ? '#eab308' : '#22c55e';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 4,
        backgroundColor: `${color}18`,
        color,
        letterSpacing: '0.04em',
      }}
    >
      Revolution Score: {score}/10
    </span>
  );
}

function MilestoneCard({ milestone: m, index }: { milestone: Milestone; index: number }) {
  const color = MEDIA_TYPE_COLORS[m.mediaType];
  const icon = MEDIA_TYPE_ICONS[m.mediaType];
  const yearDisplay = formatYear(m.year, m.isBce);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      style={{
        padding: '20px 24px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${color}33`,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Top row: badge + year */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
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
          {icon} {m.mediaType}
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#64748b',
            fontFamily: 'monospace',
          }}
        >
          {yearDisplay}
        </span>
      </div>

      {/* Name */}
      <h3
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#f1f5f9',
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {m.name}
      </h3>

      {/* Figure */}
      <div style={{ fontSize: 13, color: '#94a3b8' }}>
        <strong style={{ color: '#cbd5e1' }}>{m.figure}</strong>
      </div>

      {/* What it changed */}
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
        {m.whatItChanged}
      </div>

      {/* Revolution Score + Chronicle link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 4,
        }}
      >
        <RevolutionScoreBadge score={m.revolutionScore} />
        {m.slug ? (
          <Link
            to={`/event/${m.slug}`}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: '#60a5fa',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 4,
              border: '1px solid rgba(96,165,250,0.25)',
              backgroundColor: 'rgba(96,165,250,0.08)',
            }}
          >
            Find in Chronicle \u2192
          </Link>
        ) : (
          <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
            Find in Chronicle \u2192
          </span>
        )}
      </div>
    </motion.div>
  );
}

function NarrativeCard({ item, index }: { item: NarrativeControl; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      style={{
        padding: '24px 28px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${item.color}33`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: `${item.color}18`,
            border: `2px solid ${item.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {item.icon}
        </span>
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
            {item.era}
          </h3>
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
            {item.period}
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: item.color,
          padding: '4px 10px',
          borderRadius: 6,
          backgroundColor: `${item.color}15`,
          alignSelf: 'flex-start',
        }}
      >
        {item.controller}
      </div>

      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>
        {item.description}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function MediaHistoryPage() {
  const [selectedType, setSelectedType] = useState<MediaType | 'All'>('All');
  const [selectedEra, setSelectedEra] = useState<Era | 'All'>('All');

  const filteredMilestones = useMemo(() => {
    return MILESTONES.filter((m) => {
      if (selectedType !== 'All' && m.mediaType !== selectedType) return false;
      if (selectedEra !== 'All' && m.era !== selectedEra) return false;
      return true;
    });
  }, [selectedType, selectedEra]);

  const mediaTypes: MediaType[] = ['Print', 'Broadcast', 'Digital', 'Social'];

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
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            padding: '48px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background:
              'linear-gradient(135deg, rgba(7,14,34,0.98) 0%, rgba(168,85,247,0.08) 100%)',
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
            \u2190 Back to Timeline
          </Link>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 18,
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: 'rgba(168,85,247,0.15)',
                border: '2px solid rgba(168,85,247,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
                boxShadow: '0 0 24px rgba(168,85,247,0.2)',
              }}
            >
              {'\u{1F4E1}'}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 6,
                backgroundColor: 'rgba(168,85,247,0.15)',
                color: '#a855f7',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Topic Page
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 42px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.15,
              marginBottom: 14,
            }}
          >
            How Humanity Told Its Story
          </h1>
          <p
            style={{
              fontSize: 16,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 700,
              margin: 0,
            }}
          >
            A History of Media — from cave paintings to TikTok. The technologies, revolutions,
            and power struggles that shaped how information flows, who controls the narrative,
            and what it means to be informed.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginTop: 24,
            }}
          >
            <StatBadge value={`${MILESTONES.length}`} label="Milestones" />
            <StatBadge value="42,000" label="Years Covered" />
            <StatBadge value="4" label="Media Types" />
          </div>
        </motion.div>

        {/* ── Media Type Filters ──────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginRight: 4,
            }}
          >
            Type:
          </span>
          <FilterPill
            label="All"
            active={selectedType === 'All'}
            onClick={() => setSelectedType('All')}
          />
          {mediaTypes.map((type) => (
            <FilterPill
              key={type}
              label={`${MEDIA_TYPE_ICONS[type]} ${type}`}
              active={selectedType === type}
              color={MEDIA_TYPE_COLORS[type]}
              onClick={() => setSelectedType(type)}
            />
          ))}
        </div>

        {/* ── Era Filters ─────────────────────────────────────────────── */}
        <div
          style={{
            padding: '12px 32px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginRight: 4,
            }}
          >
            Era:
          </span>
          <FilterPill
            label="All Eras"
            active={selectedEra === 'All'}
            onClick={() => setSelectedEra('All')}
          />
          {ERA_ORDER.map((era) => (
            <FilterPill
              key={era}
              label={era}
              active={selectedEra === era}
              onClick={() => setSelectedEra(era)}
            />
          ))}
        </div>

        {/* ── Milestones Grid ─────────────────────────────────────────── */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F4C5}'} title={`Timeline \u2014 ${filteredMilestones.length} Milestones`} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredMilestones.map((m, i) => (
                <MilestoneCard key={m.name} milestone={m} index={i} />
              ))}
            </AnimatePresence>
          </div>
          {filteredMilestones.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#475569',
                fontSize: 14,
              }}
            >
              No milestones match the current filters.
            </div>
          )}
        </section>

        {/* ── Who Controlled the Narrative? ────────────────────────────── */}
        <section style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <SectionHeader icon={'\u{1F3AD}'} title="Who Controlled the Narrative?" />
          <p
            style={{
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.6,
              marginBottom: 18,
              marginTop: 0,
            }}
          >
            Throughout history, the ability to control information has been the ultimate form of
            power. Here's who held the microphone in each era — and how it changed hands.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {NARRATIVE_CONTROL.map((item, i) => (
              <NarrativeCard key={item.era} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: 13,
              color: '#64748b',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            \u2190 Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
