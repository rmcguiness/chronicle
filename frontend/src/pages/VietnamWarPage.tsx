/**
 * VietnamWarPage — comprehensive deep-dive on the Vietnam War.
 *
 * Route: /vietnam-war
 *
 * Sections:
 *  1. Hero — headline, overview of scale and significance
 *  2. Deep Background — French colonialism, Ho Chi Minh, First Indochina War, Geneva Accords
 *  3. US Escalation — Domino Theory, advisors, Gulf of Tonkin, Johnson's troop buildup
 *  4. The War on the Ground — guerrilla warfare, Ho Chi Minh Trail, Agent Orange, Tet Offensive
 *  5. The Home Front — anti-war movement, media, Pentagon Papers
 *  6. Nixon and Vietnamization — secret bombing, Paris Peace Accords
 *  7. Fall of Saigon — the end, casualties
 *  8. Key Figures — leaders on all sides
 *  9. Legacy — Vietnam Syndrome, veterans, lessons learned
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Theme constants
// ─────────────────────────────────────────────────────────────────────────────

const GOLD = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#22c55e';
const PURPLE = '#a855f7';
const TEAL = '#14b8a6';
const BLUE = '#3b82f6';
const ROSE = '#f43f5e';
const INDIGO = '#6366f1';
const AMBER = '#d97706';
const CRIMSON = '#dc2626';
const SLATE = '#64748b';
const ASH = '#94a3b8';
const OLIVE = '#84cc16';
const ORANGE = '#f97316';

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

// ── Deep Background ──────────────────────────────────────────────────────────

const BACKGROUND_TIMELINE: TimelineEntry[] = [
  {
    year: '1887–1954',
    title: 'French Colonialism in Indochina',
    description:
      'France colonized Vietnam, Laos, and Cambodia as "French Indochina," exploiting the region for rubber, rice, and minerals. The French imposed forced labor, heavy taxation, and suppressed Vietnamese culture and language. A colonial elite lived in luxury while the Vietnamese population suffered under a system designed to extract wealth. This colonial humiliation planted the seeds of revolution.',
    color: AMBER,
  },
  {
    year: '1890–1969',
    title: 'Ho Chi Minh: Revolutionary and Nationalist',
    description:
      'Ho Chi Minh spent 30 years abroad — in Paris, Moscow, and China — before returning to Vietnam as a communist revolutionary and fervent Vietnamese nationalist. When he declared Vietnamese independence on September 2, 1945, he deliberately quoted the American Declaration of Independence: "All men are created equal." He sought American support against the French, writing letters to President Truman that were never answered. The US chose to back France instead.',
    color: CRIMSON,
  },
  {
    year: '1946–1954',
    title: 'First Indochina War',
    description:
      'France attempted to reassert colonial control after World War II. Ho Chi Minh\'s Viet Minh fought an eight-year guerrilla war against the French, culminating in the decisive Battle of Dien Bien Phu (May 1954), where Vietnamese forces under General Vo Nguyen Giap besieged and defeated a fortified French garrison. It was one of the greatest military upsets of the 20th century — a colonial army destroyed by the people it had colonized.',
    color: RED,
  },
  {
    year: 'July 1954',
    title: 'Geneva Accords',
    description:
      'The peace agreement temporarily divided Vietnam at the 17th parallel, with Ho Chi Minh\'s government in the North and a Western-backed government in the South. Reunification elections were scheduled for 1956. They were never held — the United States and South Vietnamese leader Ngo Dinh Diem blocked them, knowing that Ho Chi Minh would win an estimated 80% of the vote. This broken promise would become the war\'s original sin.',
    color: BLUE,
  },
];

// ── US Escalation ────────────────────────────────────────────────────────────

const ESCALATION_TIMELINE: TimelineEntry[] = [
  {
    year: '1955',
    title: 'Eisenhower Sends Advisors',
    description:
      'President Eisenhower sent 700 military advisors to train the South Vietnamese army, justifying US involvement with the "Domino Theory" — if one country in Southeast Asia fell to communism, the rest would follow like dominoes. This Cold War logic would drag the United States deeper into Vietnam for the next two decades, long after the theory had been discredited.',
    color: BLUE,
  },
  {
    year: '1961–1963',
    title: 'Kennedy Escalates',
    description:
      'President Kennedy increased the number of US military advisors from 700 to 16,000. They were technically "advisors," but many were engaged in combat operations. Kennedy also approved covert operations against North Vietnam and tacitly supported the 1963 coup against South Vietnamese President Diem, who was assassinated. Kennedy himself was assassinated three weeks later, leaving the war to Lyndon Johnson.',
    color: INDIGO,
  },
  {
    year: 'August 1964',
    title: 'Gulf of Tonkin Incident',
    description:
      'On August 2, North Vietnamese torpedo boats attacked the USS Maddox in the Gulf of Tonkin. A second attack was reported on August 4 — but almost certainly never happened. The crew was jumpy, radar contacts were ambiguous, and the ship\'s captain later expressed doubt. Nevertheless, Johnson used the incidents to push the Gulf of Tonkin Resolution through Congress, giving him virtually unlimited authority to wage war without a formal declaration. Only two senators voted against it.',
    color: CRIMSON,
  },
  {
    year: '1965–1969',
    title: 'Johnson\'s Escalation: 500,000 Troops',
    description:
      'The first US combat troops landed at Da Nang in March 1965. By 1969, over 500,000 American soldiers were in Vietnam. Johnson escalated in increments, always believing that a little more force would break Hanoi\'s will. Each escalation failed to achieve its objectives but made withdrawal politically impossible. The pattern was tragically predictable: escalate, fail, escalate again.',
    color: RED,
  },
];

// ── War on the Ground ────────────────────────────────────────────────────────

const GROUND_WAR_INSIGHTS: InsightEntry[] = [
  {
    label: 'Guerrilla Warfare',
    detail:
      'The Viet Cong — South Vietnamese communist guerrillas — fought an asymmetric war against the world\'s most powerful military. They used tunnels (the Cu Chi tunnels stretched over 250 km), booby traps, ambushes, and melted into the civilian population. American soldiers couldn\'t tell combatants from civilians — a fundamental problem that led to atrocities. The US military was designed to fight conventional wars against Soviet tanks in Europe, not guerrilla insurgencies in tropical jungles.',
  },
  {
    label: 'Ho Chi Minh Trail',
    detail:
      'The lifeline of the North Vietnamese war effort was a network of roads, paths, and waterways running through Laos and Cambodia. Despite relentless American bombing — the US dropped more bombs on the Trail than on all of Europe in World War II — North Vietnam continuously moved troops, weapons, and supplies south. The Trail employed 300,000 workers who rebuilt roads within hours of bombing. It demonstrated that air power alone cannot win a war against a determined enemy.',
  },
  {
    label: 'Search and Destroy',
    detail:
      'General Westmoreland\'s strategy measured success by "body count" — the number of enemy killed. This created a perverse incentive: units inflated body counts, civilian casualties were counted as enemy combatants, and the war became about killing rather than achieving political objectives. Officers who reported high body counts were promoted; those who questioned the strategy were sidelined. The metric became the mission, and the mission became meaningless.',
  },
  {
    label: 'Agent Orange',
    detail:
      'The US sprayed 20 million gallons of herbicides — primarily Agent Orange, which contained the toxic contaminant dioxin — over 4.5 million acres of Vietnamese forest and farmland. The goal was to defoliate jungle cover and destroy crops. The human cost: an estimated 400,000 Vietnamese killed or maimed, 500,000 children born with birth defects, and tens of thousands of American veterans who developed cancer and other illnesses. The contamination persists in Vietnamese soil today.',
  },
  {
    label: 'Napalm and Carpet Bombing',
    detail:
      'The US dropped more than 7 million tons of bombs on Vietnam, Laos, and Cambodia — more than twice the total dropped in all of World War II. Napalm — jellied gasoline that burns at 1,500–2,200°F — became a symbol of the war\'s brutality. The 1972 photograph of nine-year-old Phan Thi Kim Phuc running naked, her skin burning from napalm, became one of the most powerful anti-war images in history.',
  },
];

const TET_OFFENSIVE: TimelineEntry[] = [
  {
    year: 'January 30, 1968',
    title: 'Tet Offensive',
    description:
      'During the Vietnamese New Year ceasefire, the Viet Cong and North Vietnamese Army simultaneously attacked over 100 cities and towns across South Vietnam, including a dramatic assault on the US Embassy compound in Saigon. Militarily, the offensive was a failure — the attackers were beaten back with devastating losses, and the Viet Cong was effectively destroyed as a fighting force. But psychologically, it was a turning point: the American public had been told the war was nearly won. Clearly, it was not.',
    color: CRIMSON,
  },
  {
    year: 'February 27, 1968',
    title: 'Walter Cronkite\'s Editorial',
    description:
      'CBS News anchor Walter Cronkite — "the most trusted man in America" — returned from Vietnam and declared on national television that the war was unwinnable and the US was "mired in stalemate." President Johnson reportedly said, "If I\'ve lost Cronkite, I\'ve lost Middle America." Five weeks later, Johnson announced he would not seek re-election.',
    color: BLUE,
  },
];

// ── The Home Front ───────────────────────────────────────────────────────────

const HOME_FRONT_INSIGHTS: InsightEntry[] = [
  {
    label: 'The Anti-War Movement',
    detail:
      'Opposition to the war grew from teach-ins on college campuses to massive protests of hundreds of thousands. The movement crossed class and racial lines — Martin Luther King Jr. spoke against the war in 1967, calling it a moral catastrophe. Muhammad Ali refused induction, was stripped of his boxing title, and told reporters: "I ain\'t got no quarrel with them Viet Cong. No Viet Cong ever called me n*****." The draft made the war personal for every American family.',
  },
  {
    label: 'Kent State (May 4, 1970)',
    detail:
      'Ohio National Guardsmen opened fire on unarmed student protesters at Kent State University, killing four and wounding nine. The dead included two students who were simply walking to class. The shootings shocked the nation — if the government would kill its own students for protesting, how far would it go? Over 4 million students went on strike at 450 universities. Eleven days later, police killed two more students at Jackson State, a historically Black college in Mississippi — a tragedy that received far less attention.',
  },
  {
    label: 'The First Television War',
    detail:
      'Vietnam was the first war broadcast into American living rooms every night. Unlike later conflicts, there was minimal government control of media access. Reporters and camera crews accompanied combat operations freely. Americans watched villages being burned, wounded soldiers screaming, and body bags being loaded onto helicopters — not as abstract statistics but as moving images on their television screens. The visual reality of war eroded public support in a way that newspaper reporting never had.',
  },
  {
    label: 'The Credibility Gap',
    detail:
      'Military and political leaders repeatedly claimed the war was being won. General Westmoreland declared "the end begins to come into view" in November 1967. Two months later, the Tet Offensive proved the claims were false. The gap between official optimism and on-the-ground reality became known as "the credibility gap" — a term that permanently damaged public trust in government and set the stage for the cynicism that Watergate would cement.',
  },
  {
    label: 'Pentagon Papers (1971)',
    detail:
      'Daniel Ellsberg, a former military analyst, leaked a 7,000-page secret history of the war to The New York Times and The Washington Post. The Pentagon Papers revealed that multiple administrations had systematically lied to Congress and the public about the war\'s progress and prospects. The government knew the war was unwinnable but escalated anyway, fearing the political consequences of admitting failure. The Supreme Court ruled in favor of publication — a landmark press freedom decision.',
  },
];

// ── Nixon and Vietnamization ─────────────────────────────────────────────────

const NIXON_TIMELINE: TimelineEntry[] = [
  {
    year: '1969–1972',
    title: '"Peace with Honor" — Vietnamization',
    description:
      'Nixon\'s strategy was to gradually withdraw US troops while training and equipping the South Vietnamese military to fight on its own — a process called "Vietnamization." It was, in effect, a slow-motion retreat with a face-saving label. US troop levels dropped from 543,000 in 1969 to 69,000 by 1972. But the fighting and dying continued — for Americans and Vietnamese alike.',
    color: INDIGO,
  },
  {
    year: '1969–1973',
    title: 'Secret Bombing of Cambodia and Laos',
    description:
      'Nixon secretly expanded the war into Cambodia and Laos, dropping 2.7 million tons of bombs — more than all bombs dropped in World War II combined. The bombing of Cambodia destabilized the country and helped bring the genocidal Khmer Rouge to power, leading to the Cambodian genocide (1975–1979) that killed nearly 2 million people. The secret bombing was hidden from Congress and the public, violating the constitutional requirement for congressional approval of military action.',
    color: CRIMSON,
  },
  {
    year: 'January 27, 1973',
    title: 'Paris Peace Accords',
    description:
      'After years of negotiations led by Henry Kissinger and North Vietnam\'s Le Duc Tho, a ceasefire agreement was signed. The US agreed to withdraw all remaining troops, and North Vietnam agreed to return American POWs. But the agreement left North Vietnamese forces in the South and did nothing to resolve the fundamental political conflict. Kissinger and Le Duc Tho were awarded the Nobel Peace Prize — Le Duc Tho declined it, recognizing that the war was far from over.',
    color: BLUE,
  },
];

// ── Fall of Saigon ───────────────────────────────────────────────────────────

const FALL_TIMELINE: TimelineEntry[] = [
  {
    year: 'March–April 1975',
    title: 'North Vietnamese Final Offensive',
    description:
      'Without US air support, the South Vietnamese military collapsed with stunning speed. North Vietnamese forces launched a major offensive in March 1975 and encountered far less resistance than expected. City after city fell. The South Vietnamese army, plagued by corruption, poor leadership, and low morale, disintegrated. Soldiers abandoned their weapons and uniforms, joining the civilian flood of refugees heading south.',
    color: RED,
  },
  {
    year: 'April 30, 1975',
    title: 'The Fall of Saigon',
    description:
      'As North Vietnamese tanks rolled into Saigon, the US conducted a desperate helicopter evacuation — Operation Frequent Wind — from the US Embassy roof and other locations. The iconic images of helicopters lifting off while desperate Vietnamese scrambled to board became the defining visual of America\'s defeat. South Vietnamese President Duong Van Minh announced unconditional surrender. The war was over. Vietnam was reunified under communist rule.',
    color: CRIMSON,
  },
];

const CASUALTY_STATS: InsightEntry[] = [
  {
    label: 'American Casualties',
    detail:
      '58,220 Americans killed. Over 300,000 wounded, many with devastating injuries. More than 1,600 still listed as missing in action (MIA). The average age of the American soldier in Vietnam was 19 — compared to 26 in World War II. The war consumed $168 billion (over $1 trillion in today\'s dollars).',
  },
  {
    label: 'Vietnamese Casualties',
    detail:
      'The Vietnamese death toll was staggering: an estimated 2 to 3 million Vietnamese civilians killed, 1.1 million North Vietnamese and Viet Cong fighters killed, and 250,000 South Vietnamese military killed. Millions more were wounded, displaced, or orphaned. The country\'s infrastructure was devastated, its farmland poisoned, and its forests destroyed.',
  },
  {
    label: 'The War\'s Wider Devastation',
    detail:
      'The war spilled across borders. US bombing of Laos made it the most heavily bombed country per capita in history — approximately 270 million cluster bombs were dropped, of which 80 million failed to explode and still kill and maim Laotian civilians today. In Cambodia, US bombing and destabilization contributed to the rise of the Khmer Rouge and one of the worst genocides of the 20th century.',
  },
];

// ── Key Figures ──────────────────────────────────────────────────────────────

const KEY_FIGURES: FigureEntry[] = [
  {
    name: 'Ho Chi Minh',
    years: '1890–1969',
    contribution:
      'Vietnamese revolutionary leader who fought Japanese, French, and American forces for Vietnamese independence. A committed communist and fervent nationalist, he was revered by many Vietnamese as the father of their nation. He died in 1969, six years before reunification — but the movement he built won the war.',
  },
  {
    name: 'Vo Nguyen Giap',
    years: '1911–2013',
    contribution:
      'North Vietnam\'s military commander — a former history teacher who became one of the 20th century\'s greatest generals. He defeated the French at Dien Bien Phu and orchestrated North Vietnam\'s war strategy against the United States. His willingness to absorb enormous casualties in pursuit of long-term victory was both his military genius and a source of controversy.',
  },
  {
    name: 'Lyndon B. Johnson',
    years: '1908–1973',
    contribution:
      'Inherited the Vietnam commitment from Kennedy and escalated it into a full-scale war. Domestically, Johnson passed the most significant civil rights and anti-poverty legislation since the New Deal. Vietnam destroyed his presidency — he chose not to seek re-election in 1968, broken by a war he could neither win nor end.',
  },
  {
    name: 'Richard Nixon',
    years: '1913–1994',
    contribution:
      'Won the presidency in 1968 partly on a promise of "peace with honor." Instead, he expanded the war into Cambodia and Laos, ordered the secret bombing campaign, and took four more years to negotiate a withdrawal. The Watergate scandal, rooted in the same culture of secrecy and lawlessness that characterized the war, forced his resignation in 1974.',
  },
  {
    name: 'Henry Kissinger',
    years: '1923–2023',
    contribution:
      'Nixon\'s National Security Advisor and Secretary of State. He negotiated the Paris Peace Accords (for which he shared the Nobel Peace Prize) while simultaneously overseeing the secret bombing of Cambodia. One of the most powerful and controversial figures in American foreign policy — praised by some as a strategic realist, condemned by others for war crimes.',
  },
  {
    name: 'William Westmoreland',
    years: '1914–2005',
    contribution:
      'Commander of US forces in Vietnam (1964–1968). His strategy of attrition — measuring success by enemy body counts — failed to break North Vietnam\'s will and generated enormous American casualties. He repeatedly requested more troops while publicly claiming the war was being won. The Tet Offensive exposed the gap between his optimism and reality.',
  },
  {
    name: 'John Kerry',
    years: '1943–',
    contribution:
      'Navy officer who earned three Purple Hearts, a Bronze Star, and a Silver Star in Vietnam. Returned home to become a leading anti-war activist. His 1971 testimony before the Senate — "How do you ask a man to be the last man to die for a mistake?" — became an iconic anti-war statement. Later served as US Senator and Secretary of State.',
  },
  {
    name: 'John McCain',
    years: '1936–2018',
    contribution:
      'Navy pilot shot down over Hanoi in 1967. Spent five and a half years as a prisoner of war, enduring torture and solitary confinement. Refused early release (offered because his father was an admiral), insisting that prisoners captured before him be released first. His service and suffering shaped his political career as a US Senator and presidential candidate.',
  },
];

// ── Legacy ───────────────────────────────────────────────────────────────────

const LEGACY_INSIGHTS: InsightEntry[] = [
  {
    label: '"Vietnam Syndrome"',
    detail:
      'The war left the United States deeply reluctant to commit ground forces abroad. For decades, the specter of "another Vietnam" haunted every military intervention debate. This reluctance shaped the US response to conflicts in Central America, the Balkans, and beyond. It took the overwhelming military victory in the 1991 Gulf War — deliberately designed to avoid Vietnam\'s mistakes — before President George H.W. Bush declared, "By God, we\'ve kicked the Vietnam Syndrome once and for all."',
  },
  {
    label: 'Veterans: The Invisible Wounds',
    detail:
      'Vietnam veterans returned not to parades but to hostility or indifference. Many were spat on, called "baby killers," or simply ignored. Post-traumatic stress disorder (PTSD) was not officially recognized until 1980 — years after thousands of veterans had suffered without diagnosis or treatment. Suicide rates among Vietnam veterans were significantly higher than the general population. The Veterans Memorial in Washington — a black granite wall listing 58,220 names — became a place of national mourning and reconciliation.',
  },
  {
    label: 'Agent Orange: Justice Delayed',
    detail:
      'Veterans and Vietnamese civilians exposed to Agent Orange fought for decades for recognition and compensation. A class-action lawsuit by US veterans was settled in 1984 for $180 million — inadequate for the scope of suffering. Vietnamese victims received nothing from the US government. The dioxin contamination persists in Vietnamese soil and waterways, continuing to cause health problems in the third generation after the war.',
  },
  {
    label: 'Vietnam Today',
    detail:
      'Modern Vietnam is a communist country with a capitalist economy — one of Asia\'s fastest-growing economies. The United States and Vietnam normalized diplomatic relations in 1995 and are now significant trading partners. Vietnam has become a popular tourist destination, and the two countries cooperate on regional security. The transformation is remarkable: a country that fought the world\'s greatest military power to a standstill now welcomes American investment and tourists.',
  },
  {
    label: 'The Lessons',
    detail:
      'Vietnam taught hard lessons that the United States has repeatedly failed to learn: military power has limits; a war without clear political objectives cannot be won; public support is essential for sustained conflict; governments that lie about wars lose the trust needed to fight them; local nationalism is stronger than foreign ideology. These lessons were ignored in Iraq and Afghanistan, with eerily similar results — mission creep, credibility gaps, and long withdrawals without victory.',
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

const FIGURE_COLORS = [RED, BLUE, ROSE, GOLD, INDIGO, TEAL];

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

export default function VietnamWarPage() {
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
              background: `linear-gradient(135deg, ${OLIVE}, ${CRIMSON})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Vietnam War — America's Most Divisive Conflict (1955–1975)
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
              A twenty-year quagmire that killed 58,220 Americans and millions of
              Vietnamese. A war rooted in colonialism, fueled by Cold War ideology,
              escalated through lies, and ended in defeat. It tore American society
              apart, destroyed trust in government, and left scars — physical,
              psychological, and chemical — that persist half a century later.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              To understand the Vietnam War, you must start before America was
              involved — with French colonialism, Vietnamese nationalism, and a
              broken promise that made the war inevitable.
            </p>
          </motion.div>
        </header>

        {/* ── Deep Background ──────────────────────────────────────────── */}
        <SectionWrapper
          id="background"
          icon="🏛️"
          title="Deep Background — The Roots of War"
          accentColor={AMBER}
          intro="The Vietnam War did not begin with American troops. It began with French colonialism, a Vietnamese revolutionary who quoted Thomas Jefferson, a colonial army's humiliating defeat, and a peace agreement that the United States helped sabotage. Without this history, the war makes no sense."
        >
          <TimelineCard entries={BACKGROUND_TIMELINE} />
        </SectionWrapper>

        {/* ── US Escalation ────────────────────────────────────────────── */}
        <SectionWrapper
          id="escalation"
          icon="📈"
          title="US Escalation — Why America Got Involved"
          accentColor={BLUE}
          intro="The United States did not rush into Vietnam — it crept in over a decade, each step making the next seem unavoidable. Eisenhower sent advisors. Kennedy sent more. Johnson sent combat troops. Each president feared being the one who 'lost Vietnam to communism.' The logic of escalation trapped them all."
        >
          <TimelineCard entries={ESCALATION_TIMELINE} />
        </SectionWrapper>

        {/* ── War on the Ground ────────────────────────────────────────── */}
        <SectionWrapper
          id="ground-war"
          icon="🪖"
          title="The War on the Ground"
          accentColor={OLIVE}
          intro="The Vietnam War was unlike anything the US military had trained for. No front lines, no clear enemy, no way to measure progress. American soldiers fought in jungles and rice paddies against an enemy who could disappear into the landscape. The technology gap was enormous — and irrelevant."
        >
          <InsightGrid items={GROUND_WAR_INSIGHTS} />
          <div style={{ marginTop: 36 }}>
            <h3
              style={{
                color: CRIMSON,
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              The Turning Point
            </h3>
            <TimelineCard entries={TET_OFFENSIVE} />
          </div>
        </SectionWrapper>

        {/* ── The Home Front ───────────────────────────────────────────── */}
        <SectionWrapper
          id="home-front"
          icon="📺"
          title="The Home Front"
          accentColor={PURPLE}
          intro="Vietnam was the first war that Americans watched on television every night. What they saw — and what the government tried to hide — created a crisis of trust that fundamentally changed the relationship between the American people and their government."
        >
          <InsightGrid items={HOME_FRONT_INSIGHTS} />
        </SectionWrapper>

        {/* ── Nixon and Vietnamization ─────────────────────────────────── */}
        <SectionWrapper
          id="nixon"
          icon="🕊️"
          title="Nixon and Vietnamization"
          accentColor={INDIGO}
          intro="Nixon promised 'peace with honor' but delivered four more years of war, a secret expansion into Cambodia and Laos, and a peace agreement that merely delayed South Vietnam's defeat by two years."
        >
          <TimelineCard entries={NIXON_TIMELINE} />
        </SectionWrapper>

        {/* ── Fall of Saigon ───────────────────────────────────────────── */}
        <SectionWrapper
          id="fall"
          icon="🚁"
          title="The Fall of Saigon"
          accentColor={CRIMSON}
          intro="The end came faster than anyone expected. Without American air support, the South Vietnamese military collapsed in weeks. The final images — helicopters lifting off embassy rooftops, desperate people clinging to landing skids — became the defining visual of American defeat."
        >
          <TimelineCard entries={FALL_TIMELINE} />
          <div style={{ marginTop: 36 }}>
            <h3
              style={{
                color: RED,
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              The Human Cost
            </h3>
            <InsightGrid items={CASUALTY_STATS} />
          </div>
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={GOLD}
          intro="The Vietnam War was shaped by revolutionaries, presidents, generals, and the soldiers who fought and resisted. Their stories reveal the war's complexity — heroism and atrocity, conviction and disillusion, sacrifice and betrayal."
        >
          <FigureGrid figures={KEY_FIGURES} />
        </SectionWrapper>

        {/* ── Legacy ───────────────────────────────────────────────────── */}
        <SectionWrapper
          id="legacy"
          icon="🪞"
          title="Legacy and Long Shadow"
          accentColor={TEAL}
          intro="The Vietnam War ended in 1975, but its consequences are still unfolding. It reshaped American politics, military doctrine, media, and the relationship between citizens and their government. Its lessons have been studied, memorialized — and repeatedly ignored."
        >
          <InsightGrid items={LEGACY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Footer ───────────────────────────────────────────────────── */}
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
            "How do you ask a man to be the last man to die for a mistake?" —
            John Kerry, testimony before the Senate Foreign Relations Committee,
            April 22, 1971
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
