/**
 * PsychologyHistoryPage — comprehensive deep-dive on the history of psychology.
 *
 * Route: /psychology-history
 *
 * Sections:
 *  1. Hero — headline, framing
 *  2. Pre-scientific psychology — Plato, Aristotle, Descartes, Locke
 *  3. Birth of scientific psychology — Wundt, structuralism, functionalism, James
 *  4. Freud and psychoanalysis — Freud, Jung, Adler, what Freud got right/wrong
 *  5. Behaviorism — Pavlov, Watson, Skinner, strengths and blind spots
 *  6. The Cognitive Revolution — Miller, Chomsky, information processing, Beck/CBT
 *  7. Humanistic psychology — Maslow, Rogers
 *  8. Famous experiments — Milgram, Stanford Prison, Asch, Harlow
 *  9. Social psychology highlights — Festinger, Cialdini, Kahneman
 * 10. Neuroscience convergence — fMRI, antidepressants, neuroplasticity
 * 11. Key figures gallery
 * 12. Modern psychology — challenges & achievements
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT = '#3b82f6';
const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

interface FigureEntry {
  name: string;
  years: string;
  contribution: string;
}

interface InsightEntry {
  label: string;
  detail: string;
}

// ── Pre-scientific psychology ────────────────────────────────────────────────

const PRE_SCIENTIFIC: TimelineEntry[] = [
  {
    year: 'c. 428 BCE',
    title: 'Plato — Mind-Body Dualism',
    description:
      'Plato argued that the mind (psyche) and body are fundamentally separate substances. He proposed a tripartite soul — rational, spirited, and appetitive — with reason as the highest faculty. His view that knowledge is innate (remembered from a prior existence) shaped Western thinking about the mind for over two thousand years.',
    color: GOLD,
  },
  {
    year: 'c. 384 BCE',
    title: 'Aristotle — Mind as Function of the Body',
    description:
      'Aristotle rejected Plato\'s dualism and proposed something remarkably modern: the mind is not a separate substance but the form or function of the body. His De Anima ("On the Soul") treated psychological questions empirically — he studied memory, perception, dreams, and emotion through observation rather than pure philosophy.',
    color: ACCENT,
  },
  {
    year: '1637',
    title: 'Descartes — "I Think, Therefore I Am"',
    description:
      'Ren\u00e9 Descartes revived mind-body dualism with his famous cogito ergo sum. He proposed that the mind (res cogitans) and body (res extensa) interact through the pineal gland — the "seat of the soul." While the pineal gland theory was wrong, Descartes\' framing of the mind-body problem drove three centuries of debate and research.',
    color: PURPLE,
  },
  {
    year: '1689',
    title: 'John Locke — Tabula Rasa',
    description:
      'Locke\'s Essay Concerning Human Understanding argued that the mind at birth is a "blank slate" (tabula rasa) — all knowledge comes from experience. This was a direct rejection of Plato and Descartes\' innate ideas. Locke\'s empiricism became the philosophical foundation for behaviorism 250 years later and remains central to debates about nature vs. nurture.',
    color: TEAL,
  },
];

// ── Birth of scientific psychology ───────────────────────────────────────────

const SCIENTIFIC_BIRTH: TimelineEntry[] = [
  {
    year: '1879',
    title: 'Wilhelm Wundt Opens the First Psychology Lab',
    description:
      'At the University of Leipzig, Wundt established the first laboratory dedicated to experimental psychology — the moment psychology formally separated from philosophy. He used controlled introspection to study conscious experience, measuring reaction times and sensory perceptions. This is conventionally dated as the birth of psychology as a science.',
    color: ACCENT,
  },
  {
    year: '1879\u20131920s',
    title: 'Structuralism (Wundt & Titchener)',
    description:
      'Structuralism attempted to identify the basic elements of consciousness through trained introspection — like a chemistry of the mind. Edward Titchener, Wundt\'s student, brought the approach to America. The method was ultimately too subjective to be reliable, but it established the principle that mental experience could be studied systematically.',
    color: GOLD,
  },
  {
    year: '1890',
    title: 'William James — Principles of Psychology',
    description:
      'James published the foundational textbook of American psychology. His functionalist approach asked not "what are the structures of consciousness?" but "what is consciousness for?" — how does the mind function to help organisms adapt? His ideas about the stream of consciousness, emotion (James-Lange theory), and habit anticipated modern cognitive and evolutionary psychology.',
    color: GREEN,
  },
  {
    year: '1890s\u20131920s',
    title: 'Functionalism — The Pragmatic American Approach',
    description:
      'Inspired by Darwin and William James, functionalists studied the purposes of mental processes rather than their structure. They asked practical questions: How do people learn? How do emotions aid survival? Functionalism\'s emphasis on applied psychology led to educational psychology, industrial psychology, and psychological testing — the infrastructure of modern psychology.',
    color: TEAL,
  },
];

// ── Freud and psychoanalysis ─────────────────────────────────────────────────

const PSYCHOANALYSIS: TimelineEntry[] = [
  {
    year: '1890s\u20131939',
    title: 'Sigmund Freud — The Unconscious Mind',
    description:
      'Freud proposed that most mental life is unconscious — driven by repressed desires, childhood experiences, and the dynamic conflict between the id (primal drives), ego (rational mediator), and superego (moral conscience). His methods included free association, dream analysis, and the interpretation of slips ("Freudian slips"). He introduced defense mechanisms like repression, projection, and sublimation.',
    color: PURPLE,
  },
  {
    year: '1900s\u20131930s',
    title: 'What Freud Got Right and Wrong',
    description:
      'Right: Unconscious processing is now well-established in cognitive science — much of perception, memory, and decision-making happens below awareness. Defense mechanisms have empirical support. The importance of early childhood experience is confirmed. Wrong: Repression as Freud described it is disputed. The Oedipus complex and psychosexual stages lack evidence. "Penis envy" is widely rejected. Psychoanalysis as therapy is less effective than modern alternatives.',
    color: RED,
  },
  {
    year: '1912\u20131961',
    title: 'Carl Jung — Collective Unconscious & Archetypes',
    description:
      'Jung broke with Freud to develop analytical psychology. He proposed a collective unconscious — a shared reservoir of archetypes (the Hero, the Shadow, the Anima/Animus) that appear across cultures in myths, dreams, and art. He introduced the concepts of introversion/extroversion, which became the basis for the Myers-Briggs Type Indicator and modern personality psychology.',
    color: INDIGO,
  },
  {
    year: '1910s\u20131937',
    title: 'Alfred Adler — Inferiority and Striving',
    description:
      'Adler was the first major defector from Freud\'s circle. He rejected the primacy of sexual drives and proposed that the core human motivation is overcoming feelings of inferiority and striving for significance. He introduced the "inferiority complex," emphasized the role of birth order, and pioneered the idea that social context shapes personality — ideas that anticipated social psychology.',
    color: TEAL,
  },
];

// ── Behaviorism ──────────────────────────────────────────────────────────────

const BEHAVIORISM: TimelineEntry[] = [
  {
    year: '1901',
    title: "Ivan Pavlov — Classical Conditioning",
    description:
      'Pavlov\'s famous experiment was an accident: while studying digestion, he noticed that dogs began salivating not just to food but to the lab assistant\'s footsteps. He systematically demonstrated that neutral stimuli (a bell) paired with unconditioned stimuli (food) could elicit learned responses (salivation). Classical conditioning remains one of the most replicated findings in all of psychology.',
    color: GOLD,
  },
  {
    year: '1920',
    title: 'John B. Watson — "Little Albert"',
    description:
      'Watson declared that psychology should study only observable behavior, not internal mental states. His infamous "Little Albert" experiment conditioned a 9-month-old infant to fear a white rat by pairing it with a loud noise — then showed the fear generalized to rabbits, fur coats, and Santa Claus masks. The experiment was deeply unethical by modern standards and could never be replicated today.',
    color: RED,
  },
  {
    year: '1930s\u20131970s',
    title: 'B.F. Skinner — Operant Conditioning',
    description:
      'Skinner demonstrated that behavior is shaped by its consequences: reinforcement (reward) increases behavior, punishment decreases it. Using the "Skinner box," he mapped reinforcement schedules with mathematical precision. His pigeon experiments showed that random reinforcement creates "superstitious" behavior. Skinner controversially argued that free will is an illusion — all behavior is environmentally determined.',
    color: ACCENT,
  },
  {
    year: '1910s\u20131960s',
    title: 'What Behaviorism Got Right — and Missed',
    description:
      'Right: Learning principles from behaviorism are the foundation of behavior therapy, token economies, animal training, and the behavioral roots of CBT. Systematic desensitization (treating phobias through gradual exposure) works and is still used today. Missed: By refusing to study internal mental states, behaviorism couldn\'t explain language acquisition, problem-solving, memory, or creativity. The mind is not a black box.',
    color: GREEN,
  },
];

// ── Cognitive Revolution ─────────────────────────────────────────────────────

const COGNITIVE_REVOLUTION: TimelineEntry[] = [
  {
    year: '1956',
    title: 'George Miller — "The Magical Number Seven"',
    description:
      'Miller\'s landmark paper demonstrated that working memory can hold about 7 \u00b1 2 "chunks" of information. This was one of the first precise measurements of cognitive capacity and helped launch the cognitive revolution. The concept of "chunking" — grouping information into meaningful units — explained why experts outperform novices: they chunk more efficiently.',
    color: ACCENT,
  },
  {
    year: '1959',
    title: "Noam Chomsky Demolishes Skinner",
    description:
      'Chomsky\'s devastating review of Skinner\'s Verbal Behavior argued that language cannot be explained by reinforcement alone. Children produce sentences they\'ve never heard, learn grammar at a pace impossible through trial-and-error, and all human languages share deep structural features. Chomsky proposed an innate "language acquisition device" — the mind has built-in structure, not a blank slate.',
    color: PURPLE,
  },
  {
    year: '1960s\u20131970s',
    title: 'The Information Processing Model',
    description:
      'Cognitive psychologists proposed that the mind works like a computer: encoding information (sensory input), processing it (attention, memory, reasoning), and producing output (decisions, behavior). While the computer metaphor has limitations, it gave psychology a rigorous vocabulary for studying mental processes and enabled experimental paradigms that are still used today.',
    color: TEAL,
  },
  {
    year: '1960s\u2013present',
    title: 'Aaron Beck — Cognitive Distortions and CBT',
    description:
      'Aaron Beck observed that depressed patients have characteristic thinking errors: all-or-nothing thinking, catastrophizing, personalization, overgeneralization. He developed Cognitive Behavioral Therapy (CBT) to systematically identify and challenge these distortions. CBT is now the most evidence-based psychotherapy in history, with robust support for treating depression, anxiety, PTSD, OCD, and more.',
    color: GREEN,
  },
];

// ── Humanistic psychology ────────────────────────────────────────────────────

const HUMANISTIC: TimelineEntry[] = [
  {
    year: '1943\u20131970',
    title: 'Abraham Maslow — Hierarchy of Needs',
    description:
      'Maslow proposed that human needs form a hierarchy: physiological needs at the base, then safety, belonging, esteem, and self-actualization at the peak. People must satisfy lower needs before pursuing higher ones. While the strict hierarchy has been challenged empirically, Maslow\'s framework remains enormously influential in business, education, and popular psychology. His study of "peak experiences" anticipated positive psychology.',
    color: GOLD,
  },
  {
    year: '1951\u20131987',
    title: 'Carl Rogers — Unconditional Positive Regard',
    description:
      'Rogers developed client-centered therapy, built on three core conditions: unconditional positive regard (accepting the client without judgment), empathy (deeply understanding their experience), and congruence (therapist authenticity). He rejected the Freudian analyst-as-authority model in favor of a collaborative relationship. Research consistently shows that the therapeutic relationship is the strongest predictor of therapy outcomes — Rogers was right.',
    color: GREEN,
  },
  {
    year: '1950s\u20131970s',
    title: 'The "Third Force" in Psychology',
    description:
      'Humanistic psychology emerged as a reaction against both psychoanalysis (too focused on pathology and the unconscious) and behaviorism (too mechanical and reductive). Humanists insisted on studying what makes humans unique: free will, creativity, meaning, personal growth, and the full range of human experience — not just mental illness. It was psychology\'s optimistic corrective.',
    color: PURPLE,
  },
];

// ── Famous experiments ───────────────────────────────────────────────────────

interface ExperimentEntry {
  year: string;
  title: string;
  finding: string;
  caveat: string;
  color: string;
}

const FAMOUS_EXPERIMENTS: ExperimentEntry[] = [
  {
    year: '1951',
    title: 'Asch Conformity Experiments',
    finding:
      'Solomon Asch showed participants a line and asked them to match it to one of three comparison lines — an easy task. But when confederates unanimously gave the wrong answer, 75% of participants conformed at least once. About a third conformed on the majority of trials. People will deny what their eyes clearly see to avoid disagreeing with a group.',
    caveat: 'Effect is weaker in individualistic cultures and when even one dissenter is present — social support breaks conformity.',
    color: ACCENT,
  },
  {
    year: '1963',
    title: 'Milgram Obedience Study',
    finding:
      'Stanley Milgram asked participants to deliver increasingly powerful electric shocks to a "learner" (actually a confederate) whenever they gave a wrong answer. Despite hearing screams of pain, 65% continued to the maximum 450-volt shock when instructed by an authority figure in a lab coat. The study was designed to understand how ordinary people could participate in the Holocaust.',
    caveat: 'Replications have found similar rates. The study proved that obedience to authority is a situational force, not a personality defect — "it could happen to anyone."',
    color: RED,
  },
  {
    year: '1971',
    title: 'Stanford Prison Experiment (Zimbardo)',
    finding:
      'Philip Zimbardo randomly assigned college students to be "guards" or "prisoners" in a simulated prison. Guards became increasingly sadistic; prisoners became passive and distressed. The study was terminated after just 6 days (planned for 14). Zimbardo argued that the situation — not personality — drives behavior.',
    caveat: 'Later investigation revealed serious methodological flaws: Zimbardo coached guards to be cruel, some participants admitted acting, and the study was never properly replicated. It remains famous but is now considered deeply flawed and possibly fabricated in key aspects.',
    color: ROSE,
  },
  {
    year: '1958\u20131960s',
    title: "Harlow's Monkeys — Contact Comfort",
    finding:
      'Harry Harlow separated infant rhesus monkeys from their mothers and offered them two surrogate "mothers": a wire one with a milk bottle, and a cloth-covered one with no food. The infants overwhelmingly clung to the cloth mother — proving that attachment is about comfort and security, not just food. This overturned the behaviorist assumption that attachment is simply conditioned by feeding.',
    caveat: 'The experiments were profoundly cruel to the monkeys and would never be approved today. But they established that emotional bonds are a fundamental biological need — not a learned behavior.',
    color: GOLD,
  },
];

// ── Social psychology highlights ─────────────────────────────────────────────

const SOCIAL_PSYCH: TimelineEntry[] = [
  {
    year: '1957',
    title: "Leon Festinger — Cognitive Dissonance",
    description:
      'Festinger discovered that when people hold contradictory beliefs or when their behavior conflicts with their attitudes, they experience psychological discomfort (dissonance) and are motivated to reduce it — often by changing their beliefs to match their behavior. This explains why people rationalize bad decisions, why hazing increases group loyalty, and why paying someone less to lie makes them believe the lie more.',
    color: PURPLE,
  },
  {
    year: '1984',
    title: "Robert Cialdini — Principles of Influence",
    description:
      'Cialdini identified six universal principles of persuasion: reciprocity (we repay favors), commitment/consistency (we align with past behavior), social proof (we follow the crowd), authority (we obey experts), liking (we say yes to people we like), and scarcity (we want what\'s rare). His research revealed the psychological mechanisms behind marketing, sales, propaganda, and social compliance.',
    color: TEAL,
  },
  {
    year: '1979\u20132011',
    title: "Daniel Kahneman — System 1 and System 2",
    description:
      'Kahneman and Amos Tversky demonstrated that human reasoning is systematically biased. Kahneman\'s dual-process theory proposes two modes: System 1 (fast, automatic, intuitive, error-prone) and System 2 (slow, deliberate, effortful, more accurate). Their work on cognitive biases — anchoring, availability, loss aversion, the framing effect — revolutionized economics (behavioral economics), medicine, law, and public policy.',
    color: ACCENT,
  },
];

// ── Neuroscience convergence ─────────────────────────────────────────────────

const NEUROSCIENCE: TimelineEntry[] = [
  {
    year: '1990s\u2013present',
    title: 'fMRI — Watching the Brain Think',
    description:
      'Functional magnetic resonance imaging allowed researchers to observe brain activity in real time during cognitive tasks. For the first time, psychological theories could be tested against neural evidence. fMRI revealed which brain regions activate during emotions, decision-making, memory retrieval, and even moral judgments — bridging the gap between psychology and neuroscience.',
    color: ACCENT,
  },
  {
    year: '1988',
    title: 'Prozac and the Biological Basis of Mental Illness',
    description:
      'The introduction of fluoxetine (Prozac) as a selective serotonin reuptake inhibitor (SSRI) transformed psychiatry. It demonstrated that mental illness has a biological substrate that can be pharmacologically targeted. While the "chemical imbalance" theory proved overly simplistic, antidepressants helped millions and established that psychology and neuroscience are inseparable.',
    color: GREEN,
  },
  {
    year: '2000s\u2013present',
    title: 'Neuroplasticity — The Brain That Changes Itself',
    description:
      'For decades, neuroscience held that the adult brain is essentially fixed. Research on neuroplasticity overturned this dogma: the brain reorganizes itself throughout life in response to experience, learning, and injury. London taxi drivers grow larger hippocampi. Stroke patients can rewire motor functions. Meditation physically alters brain structure. This discovery has profound implications for therapy, education, and rehabilitation.',
    color: PURPLE,
  },
];

// ── Key figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  { name: 'Wilhelm Wundt', years: '1832\u20131920', contribution: 'Founded the first psychology laboratory (Leipzig, 1879). Father of experimental psychology and structuralism.' },
  { name: 'William James', years: '1842\u20131910', contribution: 'Father of American psychology. Wrote Principles of Psychology (1890). Pioneered functionalism and pragmatism.' },
  { name: 'Sigmund Freud', years: '1856\u20131939', contribution: 'Founded psychoanalysis. Introduced the unconscious, defense mechanisms, dream analysis, and talk therapy.' },
  { name: 'Carl Jung', years: '1875\u20131961', contribution: 'Developed analytical psychology. Proposed the collective unconscious, archetypes, and introversion/extroversion.' },
  { name: 'Ivan Pavlov', years: '1849\u20131936', contribution: 'Discovered classical conditioning. His work on conditioned reflexes became a foundation of learning theory.' },
  { name: 'John B. Watson', years: '1878\u20131958', contribution: 'Founded behaviorism. Argued psychology should study only observable behavior. Conducted the "Little Albert" experiment.' },
  { name: 'B.F. Skinner', years: '1904\u20131990', contribution: 'Developed operant conditioning and reinforcement theory. Most influential behaviorist. Invented the Skinner box.' },
  { name: 'Abraham Maslow', years: '1908\u20131970', contribution: 'Created the hierarchy of needs. Pioneer of humanistic psychology and the study of self-actualization.' },
  { name: 'Carl Rogers', years: '1902\u20131987', contribution: 'Developed client-centered therapy. Championed unconditional positive regard and the therapeutic relationship.' },
  { name: 'Aaron Beck', years: '1921\u20132021', contribution: 'Father of Cognitive Behavioral Therapy (CBT). Identified cognitive distortions as drivers of depression.' },
  { name: 'Stanley Milgram', years: '1933\u20131984', contribution: 'Conducted the obedience experiments showing how ordinary people follow authority to shocking extremes.' },
  { name: 'Daniel Kahneman', years: '1934\u20132024', contribution: 'Nobel laureate. Demonstrated systematic cognitive biases. Created dual-process theory (System 1/System 2).' },
  { name: 'Martin Seligman', years: '1942\u2013present', contribution: 'Founder of positive psychology. Studied learned helplessness, then pivoted to studying human flourishing and resilience.' },
  { name: 'Noam Chomsky', years: '1928\u2013present', contribution: 'Demolished behaviorist theories of language. Proposed innate language structures, triggering the cognitive revolution.' },
  { name: 'Albert Bandura', years: '1925\u20132021', contribution: 'Social learning theory. The Bobo doll experiment proved children learn aggression through observation, not just reinforcement.' },
];

// ── Modern psychology ────────────────────────────────────────────────────────

const MODERN_CHALLENGES: InsightEntry[] = [
  { label: 'Replication Crisis', detail: 'A 2015 study found that only 36% of psychology findings could be replicated. The field is now reforming with pre-registration, open data, and larger sample sizes.' },
  { label: 'Mental Health Crisis', detail: 'Depression and anxiety rates are surging globally, especially among young people. Demand for therapy far outstrips supply. Psychology must scale its solutions.' },
  { label: 'Cultural Bias (WEIRD)', detail: 'Most psychology research uses Western, Educated, Industrialized, Rich, Democratic (WEIRD) samples. Findings may not generalize to 85% of the world\'s population.' },
  { label: 'Social Media & Technology', detail: 'How screens, algorithms, and constant connectivity affect attention, identity, and mental health is psychology\'s most urgent unanswered question.' },
];

const MODERN_ACHIEVEMENTS: InsightEntry[] = [
  { label: 'Evidence-Based Therapy', detail: 'CBT, DBT, EMDR, and exposure therapy have strong evidence. Psychology has moved from untestable theories to measurable outcomes.' },
  { label: 'Positive Psychology', detail: 'Seligman\'s movement shifted focus from "what\'s wrong" to "what makes life worth living" — studying gratitude, flow, meaning, and character strengths.' },
  { label: 'Neuroscience Integration', detail: 'Cognitive neuroscience bridges mind and brain. We now understand the neural basis of memory, emotion, and decision-making at unprecedented resolution.' },
  { label: 'Destigmatization', detail: 'Mental health awareness has increased dramatically. Therapy is more accepted, and public figures openly discuss their struggles — reducing shame and increasing access.' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

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

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: '18px 20px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${entry.color}33`,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 100,
          fontSize: 12,
          fontWeight: 700,
          color: entry.color,
          fontFamily: 'monospace',
          paddingTop: 2,
        }}
      >
        {entry.year}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>{entry.title}</div>
        <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>{entry.description}</div>
      </div>
    </motion.div>
  );
}

function ExperimentCard({ experiment, index }: { experiment: ExperimentEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      style={{
        padding: '20px 22px',
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: `1px solid ${experiment.color}33`,
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: experiment.color, fontFamily: 'monospace' }}>{experiment.year}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{experiment.title}</div>
      </div>
      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 10 }}>{experiment.finding}</div>
      <div
        style={{
          fontSize: 12,
          color: '#64748b',
          lineHeight: 1.6,
          padding: '10px 14px',
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          fontStyle: 'italic',
        }}
      >
        {experiment.caveat}
      </div>
    </motion.div>
  );
}

function FigureGrid({ figures }: { figures: FigureEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {figures.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace', marginBottom: 8 }}>{f.years}</div>
          <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{f.contribution}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ChallengesAndAchievements({ challenges, achievements }: { challenges: InsightEntry[]; achievements: InsightEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 14 }}>Challenges Ahead</h3>
        {challenges.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5', marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{t.detail}</div>
          </motion.div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 14 }}>What Psychology Has Achieved</h3>
        {achievements.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              backgroundColor: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: '#86efac', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>{r.detail}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function PsychologyHistoryPage() {
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
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#070e22',
        color: '#f1f5f9',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: '40px 32px 36px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: `linear-gradient(135deg, rgba(7,14,34,0.98) 0%, ${INDIGO}10 100%)`,
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
            &larr; Back to Timeline
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 'clamp(24px, 4.5vw, 40px)',
              fontWeight: 800,
              color: '#f1f5f9',
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            The History of Psychology &mdash; From Philosophy to Neuroscience
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 14,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 720,
              padding: '16px 20px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Psychology is barely <strong style={{ color: ACCENT }}>145 years old</strong> as a science &mdash; Wundt
            opened the first lab in 1879. In that time it has gone from introspection and Freud&rsquo;s couch to
            brain scanners and evidence-based therapy. Today, <strong style={{ color: GREEN }}>1 in 5 adults</strong>{' '}
            experiences mental illness in a given year, and psychology&rsquo;s insights touch everything from
            courtroom testimony to smartphone design to how we raise children.
          </motion.div>
        </div>

        {/* ── Pre-scientific Psychology ─────────────────────────────────── */}
        <SectionWrapper title="Pre-Scientific Psychology" icon={'\u{1F3DB}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            For over two thousand years, questions about the mind belonged to philosophy. These thinkers framed the
            debates &mdash; nature vs. nurture, mind vs. body, innate ideas vs. experience &mdash; that psychology
            would later try to answer with experiments.
          </p>
          {PRE_SCIENTIFIC.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Birth of Scientific Psychology ────────────────────────────── */}
        <SectionWrapper title="Birth of Scientific Psychology" icon={'\u{1F52C}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            In 1879, psychology became a science. The early schools &mdash; structuralism and functionalism &mdash;
            disagreed about what to study, but agreed that the mind could be investigated with the tools of science.
          </p>
          {SCIENTIFIC_BIRTH.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Freud and Psychoanalysis ──────────────────────────────────── */}
        <SectionWrapper title="Freud & Psychoanalysis" icon={'\u{1F6CB}\u{FE0F}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Freud is the most famous psychologist who ever lived &mdash; and the most controversial. Psychoanalysis
            transformed how we talk about ourselves even if much of the science hasn&rsquo;t held up. Its lasting
            impact is cultural as much as clinical.
          </p>
          {PSYCHOANALYSIS.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Behaviorism ──────────────────────────────────────────────── */}
        <SectionWrapper title="Behaviorism" icon={'\u{1F9BE}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Behaviorists declared that psychology should study only what can be observed &mdash; stimuli and responses,
            not murky internal states. For half a century, they dominated American psychology and produced genuinely
            powerful principles of learning. But by ignoring the mind, they left half of psychology unexplained.
          </p>
          {BEHAVIORISM.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── The Cognitive Revolution ──────────────────────────────────── */}
        <SectionWrapper title="The Cognitive Revolution" icon={'\u{1F9E0}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            In the 1950s, psychologists reclaimed the mind. Computers provided a new metaphor for mental processes,
            Chomsky showed that language can&rsquo;t be learned by reinforcement alone, and cognitive psychologists
            began mapping how we think, remember, and decide.
          </p>
          {COGNITIVE_REVOLUTION.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Humanistic Psychology ─────────────────────────────────────── */}
        <SectionWrapper title="Humanistic Psychology" icon={'\u{1F331}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Against psychoanalysis&rsquo;s pessimism and behaviorism&rsquo;s mechanism, humanistic psychologists
            offered an optimistic vision: humans are inherently driven toward growth, meaning, and self-actualization.
          </p>
          {HUMANISTIC.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Famous Experiments ────────────────────────────────────────── */}
        <SectionWrapper title="Famous Experiments That Changed Psychology" icon={'\u{26A1}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            A handful of experiments revealed uncomfortable truths about human nature &mdash; that we obey authority,
            conform to groups, and need emotional connection more than food. Some of these studies also revealed
            uncomfortable truths about psychology itself.
          </p>
          {FAMOUS_EXPERIMENTS.map((experiment, i) => (
            <ExperimentCard key={experiment.title} experiment={experiment} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Social Psychology ─────────────────────────────────────────── */}
        <SectionWrapper title="Social Psychology Highlights" icon={'\u{1F465}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Social psychologists study how people think about, influence, and relate to each other. Their findings
            explain phenomena from advertising to political polarization to why we tip at restaurants we&rsquo;ll
            never visit again.
          </p>
          {SOCIAL_PSYCH.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Neuroscience Convergence ──────────────────────────────────── */}
        <SectionWrapper title="Neuroscience Convergence" icon={'\u{1FA7B}'}>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
            Since the 1980s, psychology and neuroscience have been converging. Brain imaging, pharmacology, and
            neuroplasticity research have given psychology a biological foundation &mdash; and shown that mind
            and brain are inseparable.
          </p>
          {NEUROSCIENCE.map((entry, i) => (
            <TimelineCard key={entry.title} entry={entry} index={i} />
          ))}
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper title={`Key Figures (${KEY_FIGURES.length})`} icon={'\u{1F9D1}\u{200D}\u{1F52C}'}>
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Modern Psychology ─────────────────────────────────────────── */}
        <SectionWrapper title="Modern Psychology — Challenges & Achievements" icon={'\u{2696}\u{FE0F}'}>
          <ChallengesAndAchievements challenges={MODERN_CHALLENGES} achievements={MODERN_ACHIEVEMENTS} />
        </SectionWrapper>

        {/* ── Bottom nav ───────────────────────────────────────────────── */}
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
            &larr; Back to Timeline
          </Link>
        </div>
      </div>
    </div>
  );
}
