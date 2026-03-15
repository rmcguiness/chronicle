/**
 * DigitalRevolutionPage — comprehensive deep-dive on the history of the
 * internet and digital revolution: from Vannevar Bush to ChatGPT, ARPANET
 * to social media, and the dark side of surveillance capitalism.
 *
 * Self-contained: all styles inline, no external CSS.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── colour palette ───────────────────────────────────────────────── */
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_FAINT = '#6b6458';
const CARD_BG = 'rgba(0,168,232,0.08)';
const CARD_BORDER = 'rgba(0,168,232,0.22)';
const CYBER = '#00a8e8';
const NEON = '#39ff14';
const AMBER = '#f5a623';
const CRIMSON = '#e63946';
const VIOLET = '#7b2ff7';
const TEAL = '#20c997';
const STEEL = '#6c8fa0';
const GOLD = '#ffd700';
const MAGENTA = '#e040fb';

/* ─── types ────────────────────────────────────────────────────────── */
type SectionTab =
  | 'overview'
  | 'foundations'
  | 'arpanet'
  | 'web1'
  | 'web2'
  | 'ai-era'
  | 'figures'
  | 'transformations'
  | 'dark-side'
  | 'access';

interface TabDef {
  key: SectionTab;
  label: string;
  icon: string;
}

interface Figure {
  name: string;
  years: string;
  role: string;
  contribution: string;
  colour: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
  colour: string;
}

/* ─── data ─────────────────────────────────────────────────────────── */
const SECTION_TABS: TabDef[] = [
  { key: 'overview', label: 'Overview', icon: '🌐' },
  { key: 'foundations', label: 'Foundations (1945–68)', icon: '🔬' },
  { key: 'arpanet', label: 'ARPANET to Internet', icon: '📡' },
  { key: 'web1', label: 'Web 1.0', icon: '💻' },
  { key: 'web2', label: 'Web 2.0 & Mobile', icon: '📱' },
  { key: 'ai-era', label: 'AI Era', icon: '🤖' },
  { key: 'figures', label: 'Key Figures', icon: '🌟' },
  { key: 'transformations', label: 'Transformations', icon: '🔄' },
  { key: 'dark-side', label: 'The Dark Side', icon: '⚠️' },
  { key: 'access', label: 'Digital Divide', icon: '🌍' },
];

const OVERVIEW_TEXT =
  'The digital revolution is the fastest adoption of transformative technology in human history. The internet went from 0% to over 60% of the world\'s population in just 30 years — faster than electricity, telephones, automobiles, or television. What began as a Cold War military project became the nervous system of modern civilization, reshaping commerce, communication, entertainment, politics, and human relationships in ways no one predicted.';

const FOUNDATIONS_TIMELINE: TimelineEvent[] = [
  {
    year: '1945',
    title: 'Vannevar Bush — "As We May Think"',
    detail:
      'In a landmark Atlantic article, Roosevelt\'s chief science advisor proposed the "memex" — a hypothetical device that could store all human knowledge and allow users to create trails of linked information. It was the conceptual ancestor of hypertext, the web browser, and Wikipedia. Bush wasn\'t a computer scientist — he was imagining the future of thought itself.',
    colour: STEEL,
  },
  {
    year: '1947',
    title: 'The Transistor Invented (Bell Labs)',
    detail:
      'William Shockley, John Bardeen, and Walter Brattain invented the transistor, replacing bulky vacuum tubes with tiny semiconductor switches. This single invention enabled the miniaturization of all electronics — from room-sized computers to the smartphone in your pocket. It is arguably the most important invention of the 20th century.',
    colour: AMBER,
  },
  {
    year: '1958',
    title: 'DARPA Founded After Sputnik',
    detail:
      'When the Soviet Union launched Sputnik in 1957, America panicked. The government created the Defense Advanced Research Projects Agency (DARPA) to ensure the US would never again be caught off guard technologically. DARPA would go on to fund the creation of the internet, GPS, voice recognition, and autonomous vehicles.',
    colour: CRIMSON,
  },
  {
    year: '1965',
    title: 'Moore\'s Law',
    detail:
      'Intel co-founder Gordon Moore predicted that the number of transistors on a microchip would double approximately every two years. This observation — not a law of physics but an economic and engineering trend — held true for over 50 years, driving exponential growth in computing power while costs plummeted. A modern smartphone has more computing power than all of NASA had in 1969.',
    colour: NEON,
  },
];

const ARPANET_TIMELINE: TimelineEvent[] = [
  {
    year: '1969',
    title: 'ARPANET — First Message',
    detail:
      'On October 29, a UCLA student named Charley Kline attempted to send the word "LOGIN" to Stanford Research Institute. The system crashed after just two letters — "LO." The first message ever sent on the internet was, accidentally, "LO" — as in "Lo and behold." The connection was re-established an hour later and the full message went through.',
    colour: CYBER,
  },
  {
    year: '1971',
    title: 'Email Invented — Ray Tomlinson',
    detail:
      'Ray Tomlinson, a BBN Technologies engineer, sent the first network email and chose the @ symbol to separate user names from computer names. He later admitted the first email was something forgettable like "QWERTYUIOP." Email would become the killer app of the early internet — more important than any other feature for decades.',
    colour: AMBER,
  },
  {
    year: '1973',
    title: 'TCP/IP Designed — Cerf & Kahn',
    detail:
      'Vint Cerf and Bob Kahn designed TCP/IP (Transmission Control Protocol/Internet Protocol), the foundational communication protocol that actually defines what "the internet" is. Unlike ARPANET\'s proprietary protocols, TCP/IP was an open standard — any network could join. This decision to make the protocol open is why the internet became universal rather than a walled garden.',
    colour: NEON,
  },
  {
    year: '1983',
    title: 'DNS Created — Names Instead of Numbers',
    detail:
      'The Domain Name System replaced numeric IP addresses with human-readable names. Instead of remembering 172.217.14.206, you could type "google.com." Paul Mockapetris\'s invention was the phonebook of the internet — and it made the web usable by ordinary humans rather than just engineers.',
    colour: TEAL,
  },
  {
    year: '1991',
    title: 'The World Wide Web — Tim Berners-Lee',
    detail:
      'A British physicist at CERN created three technologies that changed everything: HTTP (the protocol), HTML (the language), and URLs (the addressing system). Berners-Lee made the web free and open — he never patented it, never charged for it. "Had the technology been proprietary, and in my total control, it would probably not have taken off," he later said. It is one of the great acts of generosity in human history.',
    colour: CYBER,
  },
];

const WEB1_TIMELINE: TimelineEvent[] = [
  {
    year: '1993',
    title: 'Mosaic Browser — The Web Gets a Face',
    detail:
      'Marc Andreessen and Eric Bina at the University of Illinois created Mosaic, the first graphical web browser accessible to ordinary people. For the first time, you could see images alongside text on the web. Andreessen would go on to co-found Netscape, sparking the browser wars and the first dot-com boom.',
    colour: CYBER,
  },
  {
    year: '1994',
    title: 'Amazon & Yahoo Founded',
    detail:
      'Jeff Bezos quit his hedge fund job and started Amazon in his garage, initially selling only books. "I knew that if I failed I wouldn\'t regret that, but I knew the one thing I might regret is not trying." Yahoo, created by Jerry Yang and David Filo as a Stanford student project, became the first major web portal and directory.',
    colour: AMBER,
  },
  {
    year: '1995',
    title: 'eBay, Craigslist & JavaScript',
    detail:
      'Pierre Omidyar\'s eBay proved strangers would trust each other in online transactions — the first item sold was a broken laser pointer for $14.83. Craig Newmark started Craigslist as an email list for San Francisco events. And Brendan Eich created JavaScript in just 10 days at Netscape — a language that now runs on virtually every website on earth.',
    colour: NEON,
  },
  {
    year: '1996',
    title: 'Google Algorithm — Stanford Dorm Room',
    detail:
      'Larry Page and Sergey Brin, PhD students at Stanford, developed PageRank — an algorithm that ranked web pages by analyzing the link structure of the entire web, treating links as votes. The insight that the web\'s own structure contained information about quality was revolutionary. They initially called the search engine "BackRub."',
    colour: VIOLET,
  },
  {
    year: '1998',
    title: 'Google Incorporated',
    detail:
      'Page and Brin incorporated Google in a Menlo Park garage with a $100,000 check from Sun co-founder Andy Bechtolsheim. Their mission: "to organize the world\'s information and make it universally accessible and useful." Within a few years, "google" would become a verb.',
    colour: VIOLET,
  },
  {
    year: '1999',
    title: 'Napster — Peer-to-Peer Shakes the World',
    detail:
      'Shawn Fanning, a 19-year-old college dropout, created Napster, which let users share MP3 music files directly with each other. At its peak, 80 million users were swapping songs. The music industry sued it into oblivion, but the genie was out of the bottle: digital distribution would destroy and remake the entire entertainment industry.',
    colour: MAGENTA,
  },
  {
    year: '2000',
    title: 'The Dot-Com Crash',
    detail:
      'The NASDAQ peaked at 5,048 on March 10 and then collapsed. Over the next two years, $5 trillion in market value evaporated. Pets.com, Webvan, eToys, and hundreds of startups vanished. But the crash was a correction, not an ending — the companies that survived (Amazon, eBay, Google) would become the most valuable companies in history.',
    colour: CRIMSON,
  },
];

const WEB2_TIMELINE: TimelineEvent[] = [
  {
    year: '2003',
    title: 'MySpace, Skype & iTunes Store',
    detail:
      'MySpace became the first social network to reach mainstream adoption, letting users customize garish profile pages with HTML. Skype brought free voice calls over the internet. And Apple\'s iTunes Store offered legal music downloads at $0.99 per song, creating the model that would save the music industry from piracy.',
    colour: CYBER,
  },
  {
    year: '2004',
    title: 'Facebook — "TheFacebook" Goes Live',
    detail:
      'Mark Zuckerberg launched "TheFacebook" from his Harvard dorm room on February 4. Initially restricted to Harvard students, it spread to other Ivy League schools, then all colleges, then everyone. Within a decade it would have 2 billion users and reshape elections, relationships, news consumption, and the advertising industry.',
    colour: VIOLET,
  },
  {
    year: '2004',
    title: 'Gmail — 1GB of Free Email',
    detail:
      'Google launched Gmail on April Fools\' Day with 1GB of free storage — 500 times what Hotmail offered. Many thought it was a joke. Gmail\'s conversation threading and powerful search transformed email, and the invitation-only launch created intense demand. It also pioneered targeted advertising based on email content.',
    colour: CRIMSON,
  },
  {
    year: '2005',
    title: 'YouTube & Reddit Launch',
    detail:
      'Three former PayPal employees — Chad Hurley, Steve Chen, and Jawed Karim — launched YouTube. The first video uploaded was "Me at the zoo" (18 seconds, Karim at the San Diego Zoo). Reddit launched the same year, eventually becoming "the front page of the internet." Both platforms democratized content creation.',
    colour: AMBER,
  },
  {
    year: '2006',
    title: 'Twitter — 140 Characters',
    detail:
      'Jack Dorsey sent the first tweet on March 21: "just setting up my twttr." The 140-character limit, borrowed from SMS constraints, created an entirely new form of communication — real-time, public, and global. Twitter would become the platform of choice for breaking news, political discourse, and celebrity meltdowns.',
    colour: CYBER,
  },
  {
    year: '2007',
    title: 'iPhone — The Computer in Your Pocket',
    detail:
      'Steve Jobs unveiled the iPhone on January 9: "An iPod, a phone, and an internet communicator... these are not three separate devices." The audience didn\'t fully grasp it at first. The iPhone put a full web browser, camera, GPS, and app ecosystem in everyone\'s pocket. It was the most consequential product launch since the personal computer.',
    colour: GOLD,
  },
  {
    year: '2008',
    title: 'App Store, Android, Airbnb & Bitcoin',
    detail:
      'Apple launched the App Store (500 apps on day one; 2 million today). Google released Android as an open-source mobile OS. Airbnb let strangers rent their apartments. And on October 31, a person or group using the pseudonym Satoshi Nakamoto published the Bitcoin whitepaper, proposing a decentralized digital currency that needed no trusted third party.',
    colour: NEON,
  },
  {
    year: '2010',
    title: 'Instagram & iPad',
    detail:
      'Kevin Systrom and Mike Krieger launched Instagram — a photo-sharing app with vintage filters. It gained 1 million users in 2 months. Apple\'s iPad created the tablet market. The intersection of smartphones, social media, and always-on connectivity was fundamentally changing how humans spent their waking hours.',
    colour: MAGENTA,
  },
  {
    year: '2011',
    title: 'Snapchat — Disappearing Messages',
    detail:
      'Evan Spiegel, Bobby Murphy, and Reggie Brown launched Snapchat, introducing ephemeral messaging — photos and videos that disappeared after viewing. It was a direct reaction to Facebook\'s permanent record of everything. The idea that not everything needed to be preserved forever resonated especially with younger users.',
    colour: AMBER,
  },
  {
    year: '2016',
    title: 'TikTok (Douyin) Launches',
    detail:
      'ByteDance launched Douyin in China (rebranded as TikTok internationally in 2017). Its algorithm-driven feed of short-form videos proved devastatingly addictive, reaching 1 billion users faster than any platform in history. TikTok\'s recommendation algorithm — which surfaces content from anyone, not just people you follow — represented a fundamental shift in social media.',
    colour: CRIMSON,
  },
];

const AI_ERA_TIMELINE: TimelineEvent[] = [
  {
    year: '2016',
    title: 'AlphaGo Defeats World Champion',
    detail:
      'Google DeepMind\'s AlphaGo defeated Lee Sedol, one of the greatest Go players in history, 4 games to 1. Go has more possible positions than atoms in the observable universe — it was thought to be decades away from being solved by AI. Move 37 in Game 2, a move no human would make, became famous as the moment the world realized AI had crossed a threshold.',
    colour: VIOLET,
  },
  {
    year: '2017',
    title: '"Attention Is All You Need" — The Transformer',
    detail:
      'A team at Google published a paper introducing the Transformer architecture, which replaced sequential processing with an "attention mechanism" that could process entire sequences in parallel. This architecture would become the foundation of GPT, BERT, and every major large language model that followed. It was the architectural breakthrough that made modern AI possible.',
    colour: NEON,
  },
  {
    year: '2022',
    title: 'ChatGPT — AI for the Masses',
    detail:
      'OpenAI released ChatGPT on November 30, and it reached 100 million users in just 2 months — the fastest adoption of any consumer technology in history. For the first time, ordinary people could have a fluent conversation with an AI. It triggered a global reckoning about the future of work, education, creativity, and what it means to be human.',
    colour: CYBER,
  },
  {
    year: '2023',
    title: 'The LLM Race — GPT-4, Gemini, Claude',
    detail:
      'The release of GPT-4 demonstrated multimodal capabilities. Google launched Gemini. Anthropic released Claude. Meta open-sourced LLaMA. The AI race became the most intense technology competition since the space race, with hundreds of billions of dollars in investment. Every major company scrambled to integrate AI into their products.',
    colour: GOLD,
  },
  {
    year: '2024–25',
    title: 'AI Agents & Reasoning Models',
    detail:
      'AI systems evolved from chatbots to autonomous agents capable of writing code, conducting research, and executing multi-step tasks. Reasoning models could think through complex problems step by step. The question shifted from "Can AI do this?" to "What can\'t AI do?" — and the answer kept shrinking.',
    colour: MAGENTA,
  },
];

const KEY_FIGURES: Figure[] = [
  {
    name: 'Tim Berners-Lee',
    years: 'b. 1955',
    role: 'Inventor of the World Wide Web',
    contribution:
      'Created HTTP, HTML, and URLs at CERN in 1991. Crucially, made the web free and open — never patented it. Knighted in 2004. Later founded the World Wide Web Consortium (W3C) to maintain open standards.',
    colour: CYBER,
  },
  {
    name: 'Vint Cerf',
    years: 'b. 1943',
    role: 'Co-designer of TCP/IP',
    contribution:
      'With Bob Kahn, designed the protocol that actually defines the internet. Known as one of the "Fathers of the Internet." Later became VP at Google and a tireless advocate for internet openness.',
    colour: NEON,
  },
  {
    name: 'Bob Kahn',
    years: 'b. 1938',
    role: 'Co-designer of TCP/IP',
    contribution:
      'Originally designed ARPANET\'s network architecture, then co-created TCP/IP with Cerf. Received the Presidential Medal of Freedom in 2005 alongside Cerf.',
    colour: NEON,
  },
  {
    name: 'Marc Andreessen',
    years: 'b. 1971',
    role: 'Creator of Mosaic & Netscape',
    contribution:
      'Built the first popular graphical web browser at age 22. Co-founded Netscape, whose IPO launched the dot-com era. Later became one of Silicon Valley\'s most influential venture capitalists at Andreessen Horowitz.',
    colour: AMBER,
  },
  {
    name: 'Bill Gates',
    years: 'b. 1955',
    role: 'Co-founder of Microsoft',
    contribution:
      'Dropped out of Harvard to co-found Microsoft with Paul Allen. Made the PC revolution accessible through Windows and Office. His 1995 memo "The Internet Tidal Wave" pivoted Microsoft toward the web. Later became the world\'s most prominent philanthropist.',
    colour: STEEL,
  },
  {
    name: 'Steve Jobs',
    years: '1955–2011',
    role: 'Co-founder of Apple',
    contribution:
      'The Macintosh, iPod, iPhone, and iPad each redefined their categories. The iPhone in particular put the internet in everyone\'s pocket and created the app economy. His "reality distortion field" and obsession with design made technology feel human.',
    colour: GOLD,
  },
  {
    name: 'Jeff Bezos',
    years: 'b. 1964',
    role: 'Founder of Amazon',
    contribution:
      'Started Amazon as an online bookstore; grew it into the "everything store" and the world\'s largest cloud computing platform (AWS). AWS effectively became the infrastructure layer of the modern internet — a third of the web runs on it.',
    colour: AMBER,
  },
  {
    name: 'Larry Page',
    years: 'b. 1973',
    role: 'Co-founder of Google',
    contribution:
      'With Brin, invented PageRank and founded Google. The company\'s mission to "organize the world\'s information" made it the gateway to human knowledge. Google\'s ad-based business model became the economic engine of the free internet.',
    colour: VIOLET,
  },
  {
    name: 'Sergey Brin',
    years: 'b. 1973',
    role: 'Co-founder of Google',
    contribution:
      'Born in Moscow, emigrated to the US at age 6. Co-developed PageRank with Page. Led Google\'s moonshot projects including self-driving cars and Google Glass. Google\'s parent company Alphabet became one of the most valuable companies in history.',
    colour: VIOLET,
  },
  {
    name: 'Mark Zuckerberg',
    years: 'b. 1984',
    role: 'Founder of Facebook/Meta',
    contribution:
      'Built Facebook from a Harvard dorm project into a platform connecting 3 billion people. Also acquired Instagram and WhatsApp. His pivot to the "metaverse" and renaming to Meta in 2021 bet the company on virtual/augmented reality.',
    colour: CYBER,
  },
  {
    name: 'Jack Dorsey',
    years: 'b. 1976',
    role: 'Co-founder of Twitter',
    contribution:
      'Created Twitter\'s 140-character format, which became the dominant platform for real-time global discourse. Also founded Square (now Block), bringing mobile payments to small businesses.',
    colour: TEAL,
  },
  {
    name: 'Linus Torvalds',
    years: 'b. 1969',
    role: 'Creator of Linux & Git',
    contribution:
      'Created the Linux kernel as a Finnish university student in 1991. Linux now runs most of the world\'s servers, all Android phones, and most of the cloud. Later created Git, the version control system used by virtually all software developers.',
    colour: NEON,
  },
  {
    name: 'Satoshi Nakamoto',
    years: 'Unknown',
    role: 'Creator of Bitcoin',
    contribution:
      'Published the Bitcoin whitepaper in 2008 under a pseudonym and launched the network in 2009. Created the first decentralized digital currency using blockchain technology. Disappeared from public view in 2011. Their identity remains one of the great mysteries of the digital age.',
    colour: GOLD,
  },
  {
    name: 'Shoshana Zuboff',
    years: 'b. 1951',
    role: 'Scholar of Surveillance Capitalism',
    contribution:
      'Harvard professor who coined the term "surveillance capitalism" — the economic system in which human experience is harvested as raw material for prediction and profit. Her 2019 book became the definitive critique of Big Tech\'s business model.',
    colour: CRIMSON,
  },
  {
    name: 'Jimmy Wales',
    years: 'b. 1966',
    role: 'Co-founder of Wikipedia',
    contribution:
      'Co-created Wikipedia in 2001 — a free, collaborative encyclopedia that now has over 60 million articles in 300+ languages. Proved that open collaboration could produce knowledge rivaling traditional encyclopedias.',
    colour: TEAL,
  },
  {
    name: 'Ada Lovelace',
    years: '1815–1852',
    role: 'First Computer Programmer',
    contribution:
      'Wrote the first algorithm intended for a machine (Babbage\'s Analytical Engine) in 1843 — a century before digital computers existed. Recognized that computers could go beyond pure calculation to create music and art. The true prophet of the digital age.',
    colour: MAGENTA,
  },
];

/* ─── helper components ────────────────────────────────────────────── */

function TabButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 6,
        border: active ? `1px solid ${CYBER}` : `1px solid ${CARD_BORDER}`,
        background: active ? 'rgba(0,168,232,0.18)' : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

function SectionHeader({ title, colour = CYBER }: { title: string; colour?: string }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: colour,
        margin: '0 0 18px',
        letterSpacing: '0.02em',
      }}
    >
      {title}
    </h2>
  );
}

function NarrativeCard({
  title,
  children,
  colour = CYBER,
}: {
  title?: string;
  children: React.ReactNode;
  colour?: string;
}) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderLeft: `3px solid ${colour}`,
        borderRadius: 8,
        padding: '18px 22px',
        marginBottom: 16,
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: colour,
            margin: '0 0 8px',
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ fontSize: 14, lineHeight: 1.7, color: TEXT }}>{children}</div>
    </div>
  );
}

function QuoteBlock({
  quote,
  attribution,
  colour = CYBER,
}: {
  quote: string;
  attribution: string;
  colour?: string;
}) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${colour}`,
        padding: '14px 20px',
        margin: '20px 0',
        background: 'rgba(0,168,232,0.04)',
        borderRadius: '0 6px 6px 0',
      }}
    >
      <div style={{ fontSize: 15, fontStyle: 'italic', color: TEXT, lineHeight: 1.7 }}>
        &ldquo;{quote}&rdquo;
      </div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 6 }}>
        &mdash; {attribution}
      </div>
    </div>
  );
}

function TimelineItem({ event }: { event: TimelineEvent }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        marginBottom: 18,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          minWidth: 64,
          fontWeight: 700,
          fontSize: 14,
          color: event.colour,
          paddingTop: 2,
        }}
      >
        {event.year}
      </div>
      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderLeft: `3px solid ${event.colour}`,
          borderRadius: 8,
          padding: '14px 18px',
          flex: 1,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: TEXT, marginBottom: 4 }}>
          {event.title}
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM }}>
          {event.detail}
        </div>
      </div>
    </div>
  );
}

function FigureCard({ figure }: { figure: Figure }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderTop: `3px solid ${figure.colour}`,
        borderRadius: 8,
        padding: '16px 18px',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 15, color: figure.colour }}>
        {figure.name}
      </div>
      <div style={{ fontSize: 12, color: TEXT_FAINT, margin: '2px 0 4px' }}>
        {figure.years}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DIM, marginBottom: 6 }}>
        {figure.role}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: TEXT }}>
        {figure.contribution}
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */
export default function DigitalRevolutionPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        color: TEXT,
        fontFamily: "'Inter', sans-serif",
        padding: 'clamp(16px, 4vw, 48px)',
        maxWidth: 960,
        margin: '0 auto',
      }}
    >
      {/* ── back link ─────────────────────────────────────────────── */}
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: TEXT_DIM,
          textDecoration: 'none',
          fontSize: 13,
          marginBottom: 24,
        }}
      >
        &larr; Back to Chronicle
      </Link>

      {/* ── hero ──────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 'clamp(24px, 5vw, 42px)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            margin: 0,
            background: `linear-gradient(135deg, ${CYBER}, ${NEON})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          The Digital Revolution
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            color: TEXT_DIM,
            marginTop: 10,
            lineHeight: 1.5,
            maxWidth: 720,
          }}
        >
          How Humans Wired the World (1945&ndash;Present) &mdash; the fastest adoption of
          transformative technology in history: internet from 0% to 60% of world population
          in 30&nbsp;years
        </p>
      </header>

      {/* ── tab nav ───────────────────────────────────────────────── */}
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {SECTION_TABS.map((t) => (
          <TabButton
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          />
        ))}
      </nav>

      {/* ── tab content ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div>
              <SectionHeader title="The Fastest Revolution in Human History" />
              <NarrativeCard>{OVERVIEW_TEXT}</NarrativeCard>

              <QuoteBlock
                quote="The internet is becoming the town square for the global village of tomorrow."
                attribution="Bill Gates"
                colour={STEEL}
              />

              <NarrativeCard title="A Timeline in Perspective" colour={AMBER}>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Electricity</strong> took 46 years to reach 25% of the US population.{' '}
                  <strong>Telephones</strong> took 35 years. <strong>Television</strong> took 26 years.{' '}
                  <strong>The internet</strong> took 7 years. <strong>Facebook</strong> reached
                  1 billion users in 8 years. <strong>ChatGPT</strong> reached 100 million users
                  in 2 months.
                </p>
                <p style={{ margin: 0 }}>
                  The acceleration of adoption is itself accelerating. Each wave of digital
                  technology spreads faster than the last, driven by the infrastructure left
                  behind by its predecessors.
                </p>
              </NarrativeCard>

              <NarrativeCard title="From Military Project to Human Necessity" colour={NEON}>
                <p style={{ margin: '0 0 10px' }}>
                  The internet began as a US Department of Defense project to create a
                  communication network that could survive a nuclear attack. Within three
                  decades, it had become so central to daily life that the United Nations
                  declared internet access a basic human right.
                </p>
                <p style={{ margin: 0 }}>
                  Along the way, it created and destroyed industries, toppled governments,
                  connected 5 billion people, generated trillions of dollars in wealth, and
                  raised fundamental questions about privacy, truth, democracy, and what it
                  means to be human in an age of artificial intelligence.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="We are all now connected by the Internet, like neurons in a giant brain."
                attribution="Stephen Hawking"
                colour={VIOLET}
              />
            </div>
          )}

          {/* ── Pre-Internet Foundations ── */}
          {activeTab === 'foundations' && (
            <div>
              <SectionHeader title="Pre-Internet Foundations (1945–1968)" colour={AMBER} />

              <NarrativeCard colour={STEEL}>
                <p style={{ margin: 0 }}>
                  Before there was an internet, there were dreamers and engineers who
                  built the technological and intellectual foundations. The transistor
                  made computation small. Moore's Law made it cheap. DARPA made it a
                  priority. And visionaries like Vannevar Bush imagined a world where all
                  human knowledge was linked and searchable — decades before it became
                  reality.
                </p>
              </NarrativeCard>

              {FOUNDATIONS_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="Consider a future device... in which an individual stores all his books, records, and communications, and which is mechanized so that it may be consulted with exceeding speed and flexibility."
                attribution="Vannevar Bush, 'As We May Think,' 1945"
                colour={STEEL}
              />

              <NarrativeCard title="The Cold War Catalyst" colour={CRIMSON}>
                <p style={{ margin: 0 }}>
                  It is one of history's great ironies that the internet — humanity's
                  greatest tool for connection and openness — was born from Cold War
                  paranoia. The fear that a Soviet nuclear strike could destroy centralized
                  communication systems drove the development of a decentralized network
                  with no single point of failure. The military wanted survivability; what
                  they built was freedom.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ── ARPANET to Internet ── */}
          {activeTab === 'arpanet' && (
            <div>
              <SectionHeader title="ARPANET to Internet (1969–1991)" colour={CYBER} />

              <NarrativeCard colour={TEAL}>
                <p style={{ margin: 0 }}>
                  In 22 years, a four-node military network became the World Wide Web.
                  Along the way, email was invented, the fundamental protocol of the
                  internet was designed, and a British physicist at a Swiss physics lab
                  gave the world its most transformative gift — for free.
                </p>
              </NarrativeCard>

              {ARPANET_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="Had the technology been proprietary, and in my total control, it would probably not have taken off. You can't propose that something be a universal space and at the same time keep control of it."
                attribution="Tim Berners-Lee, on making the web free"
                colour={CYBER}
              />

              <NarrativeCard title="The Power of Open Standards" colour={NEON}>
                <p style={{ margin: 0 }}>
                  The internet succeeded because of a series of decisions to make it
                  open. TCP/IP was an open protocol — anyone could use it. HTML was open —
                  anyone could create a website. HTTP was open — any browser could access
                  any server. These were deliberate choices by people who believed
                  information should be free. Every walled garden on the internet exists
                  in tension with this founding principle.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ── Web 1.0 ── */}
          {activeTab === 'web1' && (
            <div>
              <SectionHeader title="The Web 1.0 Era (1993–2004): The Read-Only Web" colour={VIOLET} />

              <NarrativeCard colour={AMBER}>
                <p style={{ margin: 0 }}>
                  Web 1.0 was the "read-only" web — mostly static pages created by a
                  small number of publishers for a large audience of readers. But even
                  this primitive web launched revolutions: e-commerce, search engines,
                  online communities, peer-to-peer sharing, and the greatest financial
                  bubble since the South Sea Company.
                </p>
              </NarrativeCard>

              {WEB1_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="I knew that if I failed I wouldn't regret that, but I knew the one thing I might regret is not trying."
                attribution="Jeff Bezos, on leaving his hedge fund job to start Amazon"
                colour={AMBER}
              />

              <NarrativeCard title="The Dot-Com Bubble: Irrational Exuberance" colour={CRIMSON}>
                <p style={{ margin: '0 0 10px' }}>
                  By 1999, companies with no revenue, no customers, and no business plan
                  were worth billions on paper. Pets.com spent $11.8 million on a Super
                  Bowl ad and went bankrupt nine months later. Webvan raised $375 million
                  and burned through all of it. The NASDAQ lost 78% of its value.
                </p>
                <p style={{ margin: 0 }}>
                  But the crash was a correction, not an ending. The fiber optic cables
                  laid during the bubble remained. The engineers trained during the boom
                  went on to build Web 2.0. And the survivors — Amazon, Google, eBay —
                  became the most valuable companies on Earth.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ── Web 2.0 & Mobile ── */}
          {activeTab === 'web2' && (
            <div>
              <SectionHeader title="The Web 2.0 Era (2004–2016): Social, Participatory Web" colour={MAGENTA} />

              <NarrativeCard colour={VIOLET}>
                <p style={{ margin: 0 }}>
                  Web 2.0 turned users from readers into creators. Social media, user-generated
                  content, smartphones, and app stores transformed the internet from a library
                  into a living, breathing social organism. For better and worse, the internet
                  became the primary medium through which billions of people experienced reality.
                </p>
              </NarrativeCard>

              {WEB2_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="An iPod, a phone, and an internet communicator... these are not three separate devices. This is one device."
                attribution="Steve Jobs, iPhone keynote, January 9, 2007"
                colour={GOLD}
              />

              <NarrativeCard title="The Smartphone Inflection Point" colour={GOLD}>
                <p style={{ margin: '0 0 10px' }}>
                  The iPhone didn't just create a new product category — it changed the
                  fundamental relationship between humans and technology. For the first
                  time, a powerful computer was always in your pocket, always connected,
                  always on. Average screen time rose from near zero to over 7 hours per day.
                </p>
                <p style={{ margin: 0 }}>
                  The smartphone brought the internet to billions who had never owned a
                  computer. In sub-Saharan Africa, India, and Southeast Asia, the mobile
                  phone was many people's first and only connection to the digital world.
                  Mobile internet access leapfrogged desktop computing entirely.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ── AI Era ── */}
          {activeTab === 'ai-era' && (
            <div>
              <SectionHeader title="The AI Era (2016–Present)" colour={VIOLET} />

              <NarrativeCard colour={NEON}>
                <p style={{ margin: 0 }}>
                  The latest chapter of the digital revolution may be its most
                  consequential. Artificial intelligence — long a science fiction trope —
                  became real, practical, and accessible. In the span of a few years, AI
                  went from beating humans at board games to writing code, creating art,
                  passing bar exams, and conducting scientific research.
                </p>
              </NarrativeCard>

              {AI_ERA_TIMELINE.map((e, i) => (
                <TimelineItem key={i} event={e} />
              ))}

              <QuoteBlock
                quote="AI is probably the most important thing humanity has ever worked on. I think of it as something more profound than electricity or fire."
                attribution="Sundar Pichai, CEO of Google"
                colour={VIOLET}
              />

              <NarrativeCard title="The Open Question" colour={MAGENTA}>
                <p style={{ margin: 0 }}>
                  Unlike previous waves of digital technology, AI raises genuinely
                  existential questions. Will it eliminate more jobs than it creates? Can
                  it be aligned with human values? Who controls it — and who benefits?
                  The previous digital revolutions connected people. This one might
                  replace them. The story of the digital revolution is still being written
                  — and for the first time, the technology itself might be writing it.
                </p>
              </NarrativeCard>
            </div>
          )}

          {/* ── Key Figures ── */}
          {activeTab === 'figures' && (
            <div>
              <SectionHeader title="Key Figures of the Digital Revolution" colour={GOLD} />

              <NarrativeCard colour={STEEL}>
                <p style={{ margin: 0 }}>
                  The digital revolution was built by dreamers, dropouts, scientists, and
                  entrepreneurs — often working from garages, dorm rooms, and government
                  labs. Some became the richest people in history. One remains completely
                  anonymous. All of them changed the world irreversibly.
                </p>
              </NarrativeCard>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                  marginTop: 20,
                }}
              >
                {KEY_FIGURES.map((f, i) => (
                  <FigureCard key={i} figure={f} />
                ))}
              </div>
            </div>
          )}

          {/* ── How the Internet Changed Everything ── */}
          {activeTab === 'transformations' && (
            <div>
              <SectionHeader title="How the Internet Changed Everything" colour={TEAL} />

              <NarrativeCard title="Commerce" colour={AMBER}>
                <p style={{ margin: 0 }}>
                  E-commerce went from $0 to over $5 trillion annually. Amazon, Alibaba,
                  and Shopify enabled anyone to sell anything to anyone, anywhere. The gig
                  economy (Uber, DoorDash, Fiverr) created new forms of work — and new
                  forms of exploitation. Brick-and-mortar retail entered terminal decline:
                  the "retail apocalypse" shuttered thousands of stores.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Communication" colour={CYBER}>
                <p style={{ margin: 0 }}>
                  Email, instant messaging, video calls, and social media collapsed the
                  distance between humans. A farmer in Kenya could WhatsApp a buyer in
                  London. Grandparents could video-call grandchildren across oceans.
                  But communication also became fragmented, performative, and — through
                  social media — optimized for engagement rather than truth.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Information Access" colour={NEON}>
                <p style={{ margin: 0 }}>
                  Wikipedia, Google Scholar, Khan Academy, and open-access journals
                  democratized knowledge that was once locked behind university walls and
                  expensive subscriptions. A child with a smartphone in rural India has
                  access to more information than a Harvard professor had in 1990. But
                  information abundance brought its own crisis: how do you find truth in a
                  sea of content?
                </p>
              </NarrativeCard>

              <NarrativeCard title="Entertainment" colour={MAGENTA}>
                <p style={{ margin: 0 }}>
                  Netflix destroyed Blockbuster. Spotify transformed the music industry.
                  YouTube created a new generation of creators who bypassed traditional
                  gatekeepers. Video games became a $200 billion industry — larger than
                  movies and music combined. Streaming replaced ownership: you no longer
                  bought media, you rented access to it.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Work" colour={STEEL}>
                <p style={{ margin: 0 }}>
                  Remote work, once a rare perk, became mainstream after COVID-19 proved
                  it was possible at scale. Slack, Zoom, and Google Workspace replaced
                  the physical office for millions. The internet also created entirely new
                  professions: social media manager, data scientist, UX designer, influencer,
                  prompt engineer. The nature of work itself is being rewritten.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Relationships & Identity" colour={VIOLET}>
                <p style={{ margin: 0 }}>
                  Dating apps (Tinder, Bumble, Hinge) changed how humans find partners —
                  over a third of US marriages now begin online. Social media reshaped
                  identity: people curate digital versions of themselves, compare their
                  lives to others' highlight reels, and form communities around shared
                  interests rather than geography.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Democracy & Misinformation" colour={CRIMSON}>
                <p style={{ margin: '0 0 10px' }}>
                  The Arab Spring showed the internet's power to organize revolutions.
                  But the same tools enabled foreign election interference, conspiracy
                  theories (QAnon), and the erosion of shared reality. Social media
                  algorithms optimized for engagement discovered that outrage, fear, and
                  division are the most engaging emotions.
                </p>
                <p style={{ margin: 0 }}>
                  The internet gave everyone a voice. It did not give everyone the ability
                  to distinguish truth from fiction — or the incentive to try.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="A lie can travel halfway around the world while the truth is still putting on its shoes."
                attribution="Attributed to Mark Twain (ironically, this quote itself is misattributed)"
                colour={CRIMSON}
              />
            </div>
          )}

          {/* ── The Dark Side ── */}
          {activeTab === 'dark-side' && (
            <div>
              <SectionHeader title="The Dark Side of the Digital Revolution" colour={CRIMSON} />

              <NarrativeCard title="Surveillance Capitalism" colour={CRIMSON}>
                <p style={{ margin: '0 0 10px' }}>
                  Shoshana Zuboff coined the term to describe the economic system in
                  which tech companies harvest human experience — every click, search,
                  location, and conversation — as raw material to predict and influence
                  behavior. Google and Facebook's business model is not selling products to
                  users; it's selling users to advertisers.
                </p>
                <p style={{ margin: 0 }}>
                  "Surveillance capitalism unilaterally claims human experience as free
                  raw material for translation into behavioral data," Zuboff wrote.
                  The result: the most intimate details of billions of lives are
                  collected, analyzed, and monetized by a handful of corporations.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="If you're not paying for the product, you are the product."
                attribution="Common tech industry saying"
                colour={AMBER}
              />

              <NarrativeCard title="Social Media & Mental Health" colour={VIOLET}>
                <p style={{ margin: 0 }}>
                  Rates of teen depression, anxiety, and self-harm have risen sharply
                  since 2012 — correlating with smartphone and social media adoption.
                  Instagram's own internal research (leaked in 2021) found that the
                  platform made body image issues worse for 1 in 3 teen girls. The
                  algorithmic amplification of extreme content, cyberbullying, social
                  comparison, and addictive design patterns have created what Jonathan
                  Haidt calls "the anxious generation."
                </p>
              </NarrativeCard>

              <NarrativeCard title="Misinformation & Conspiracy" colour={MAGENTA}>
                <p style={{ margin: 0 }}>
                  The same platforms that democratized information also democratized
                  disinformation. Anti-vaccine movements, election denial, QAnon, flat
                  earth theories, and AI-generated deepfakes thrive in recommendation
                  algorithms optimized for engagement. An MIT study found that false news
                  spreads six times faster than true news on Twitter. The internet didn't
                  create conspiracy thinking — but it supercharged it.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Cyber Warfare & State Surveillance" colour={STEEL}>
                <p style={{ margin: 0 }}>
                  Edward Snowden's 2013 revelations showed that the NSA was conducting
                  mass surveillance of both foreign and domestic communications. China's
                  Great Firewall censors the internet for 1.4 billion people. Russia's
                  Internet Research Agency interfered in foreign elections through social
                  media manipulation. Cyberattacks on critical infrastructure (hospitals,
                  power grids, pipelines) have become a routine tool of statecraft.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Privacy Erosion" colour={AMBER}>
                <p style={{ margin: 0 }}>
                  The average person is tracked by hundreds of companies across thousands
                  of data points: location, browsing history, purchases, contacts, health
                  data, biometrics. Data brokers buy and sell personal information in a
                  largely unregulated market. GDPR (EU, 2018) was the first major attempt
                  at regulation, but enforcement remains inconsistent. The concept of
                  privacy as the previous generation understood it may already be gone.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Big Tech Monopoly Power" colour={NEON}>
                <p style={{ margin: 0 }}>
                  Five companies — Apple, Microsoft, Google, Amazon, and Meta — have a
                  combined market capitalization exceeding $10 trillion. They control the
                  app stores, the cloud, the search engines, the social networks, and
                  increasingly the AI models. Network effects and data moats make
                  competition nearly impossible. Antitrust regulators worldwide are
                  attempting to rein in this concentration of power, but the companies
                  move faster than the law.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="Surveillance capitalism unilaterally claims human experience as free raw material for translation into behavioral data."
                attribution="Shoshana Zuboff, The Age of Surveillance Capitalism"
                colour={CRIMSON}
              />
            </div>
          )}

          {/* ── Digital Divide ── */}
          {activeTab === 'access' && (
            <div>
              <SectionHeader title="Internet Access as a Human Right" colour={TEAL} />

              <NarrativeCard title="Who Still Lacks Access" colour={CRIMSON}>
                <p style={{ margin: '0 0 10px' }}>
                  Despite the internet reaching over 5 billion people, approximately
                  2.6 billion remain offline — disproportionately in sub-Saharan Africa,
                  South Asia, and rural areas worldwide. The digital divide mirrors and
                  amplifies existing inequalities: those without internet access are
                  increasingly locked out of education, healthcare, finance, employment,
                  and civic participation.
                </p>
                <p style={{ margin: 0 }}>
                  Even among those "connected," the quality of access varies enormously.
                  Slow, expensive, mobile-only access is not the same as the high-speed
                  broadband available in wealthy nations. The gap between digital haves
                  and have-nots is widening, not narrowing.
                </p>
              </NarrativeCard>

              <NarrativeCard title="The Gender Digital Divide" colour={MAGENTA}>
                <p style={{ margin: 0 }}>
                  Women are 20% less likely than men to be online in developing countries,
                  and 50% less likely in the least-developed countries. Cultural barriers,
                  cost, safety concerns (online harassment), and lack of locally relevant
                  content all contribute. Closing the gender digital divide could add
                  $524 billion to global GDP.
                </p>
              </NarrativeCard>

              <NarrativeCard title="Efforts to Connect the World" colour={TEAL}>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Starlink</strong> (SpaceX) is deploying thousands of low-orbit
                  satellites to provide broadband to remote and underserved areas.{' '}
                  <strong>Google Loon</strong> attempted to use high-altitude balloons
                  (shut down in 2021 due to costs).{' '}
                  <strong>Meta's Free Basics</strong> offered limited free internet access
                  in developing countries (criticized as a walled garden that violated
                  net neutrality).
                </p>
                <p style={{ margin: 0 }}>
                  The United Nations declared internet access a basic human right in
                  2016. Estonia became the first country to declare it a legal right in
                  2000. Finland and Costa Rica followed. The question is no longer whether
                  internet access is essential — it's whether the world will ensure it
                  reaches everyone.
                </p>
              </NarrativeCard>

              <QuoteBlock
                quote="The internet is not a luxury; it is a necessity."
                attribution="Barack Obama"
                colour={TEAL}
              />

              <NarrativeCard title="What's at Stake" colour={GOLD}>
                <p style={{ margin: 0 }}>
                  As AI transforms economies, those without internet access risk being
                  left behind permanently. The digital divide is becoming an AI divide —
                  and the consequences for global inequality are profound. The first
                  digital revolution connected the privileged half of humanity. The
                  challenge of the next decade is connecting the rest.
                </p>
              </NarrativeCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
