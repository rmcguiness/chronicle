/**
 * HolocaustPage — comprehensive deep-dive on the Holocaust and Nazi Germany.
 *
 * Route: /holocaust
 *
 * Sections:
 *  1. Hero — headline, overview of scale
 *  2. Rise of Hitler and the Nazi Party — Weimar collapse, Hitler's path to power
 *  3. Nazi ideology — Aryan supremacy, Lebensraum, propaganda
 *  4. Step-by-step escalation (1933–1941) — systematic stripping of rights
 *  5. The Holocaust machinery — extermination camps, industrial murder
 *  6. Resistance — Warsaw Ghetto, Sobibor, partisans, Righteous Among Nations
 *  7. Key figures — perpetrators, victims/survivors, rescuers
 *  8. Liberation and aftermath — Nuremberg Trials, displaced persons, Israel
 *  9. Why it matters — banality of evil, warning signs of genocide
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

// ── Rise of Hitler ─────────────────────────────────────────────────────────

const RISE_INSIGHTS: InsightEntry[] = [
  {
    label: 'Weimar Humiliation',
    detail:
      'Germany\'s defeat in World War I and the punishing Treaty of Versailles (1919) created deep national resentment. Germany lost 13% of its territory, all overseas colonies, and was forced to accept sole blame for the war. The "stab in the back" myth — that Germany had been betrayed by civilians, Jews, and socialists rather than defeated militarily — poisoned democratic politics from the start.',
  },
  {
    label: 'Hyperinflation (1923)',
    detail:
      'When Germany defaulted on war reparations, France occupied the Ruhr industrial region. The government printed money to pay workers, triggering catastrophic hyperinflation. A loaf of bread that cost 250 marks in January 1923 cost 200 billion marks by November. Life savings became worthless overnight. The trauma of this economic destruction permanently undermined faith in the Weimar Republic.',
  },
  {
    label: 'Beer Hall Putsch (1923)',
    detail:
      'Hitler\'s first attempt to seize power was a failed coup in Munich. He was arrested and sentenced to five years but served only nine months in comfort at Landsberg Prison, where he dictated Mein Kampf. The lenient sentence reflected a judiciary sympathetic to right-wing nationalism — a warning sign of institutional rot.',
  },
  {
    label: 'Mein Kampf (1925)',
    detail:
      'Hitler\'s autobiography and political manifesto laid out his ideology with chilling clarity: the "racial purity" of the Aryan race, the need for Lebensraum (living space) in Eastern Europe, and virulent antisemitism that blamed Jews for all of Germany\'s problems. The book sold modestly at first, but its ideas would become state policy within a decade.',
  },
  {
    label: 'Great Depression Hits Germany',
    detail:
      'The 1929 Wall Street crash devastated Germany, which depended on American loans. By 1932, unemployment reached 30% — over 6 million people. Desperate voters abandoned moderate parties. The Nazi Party surged from 2.6% of the vote in 1928 to 37% in 1932, becoming the largest party in the Reichstag.',
  },
  {
    label: 'Appointed Chancellor (January 30, 1933)',
    detail:
      'Hitler was not elected president — he was appointed chancellor by President Hindenburg, who believed conservative politicians could control him. They were catastrophically wrong. Within two months, the Enabling Act (March 23, 1933) gave Hitler the power to pass laws without parliament, effectively ending German democracy through a legal mechanism.',
  },
  {
    label: 'Why Germans Supported Him',
    detail:
      'Economic desperation, centuries of European antisemitic tradition, wounded national pride, fear of communism, and relentless propaganda all played roles. But so did ordinary conformism, careerism, and the human tendency to look away. Most Germans were not fanatical Nazis — they were people who adapted, who told themselves things would moderate, who prioritized their own survival. This is precisely what makes it so terrifying.',
  },
];

// ── Nazi Ideology ──────────────────────────────────────────────────────────

const IDEOLOGY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Aryan Supremacy',
    detail:
      'Nazi ideology held that a mythical "Aryan" race — tall, blond, blue-eyed northern Europeans — was the master race destined to rule. This was pure pseudoscience with no basis in biology or anthropology. Ironically, neither Hitler, Goebbels, nor Himmler matched this supposed Aryan ideal.',
  },
  {
    label: 'Lebensraum (Living Space)',
    detail:
      'Hitler believed Germany needed vast territory in Eastern Europe to sustain the Aryan race. This meant conquering Poland, Ukraine, and western Russia, and either expelling, enslaving, or exterminating the existing Slavic populations. The Holocaust and the war of extermination in the East were inseparable parts of the same genocidal vision.',
  },
  {
    label: 'Antisemitism as Central Obsession',
    detail:
      'While European antisemitism had deep roots stretching back centuries, the Nazis elevated Jew-hatred to the organizing principle of their entire worldview. Jews were simultaneously blamed for capitalism and communism, for Germany\'s defeat in WWI, for cultural "degeneracy," and for racial "contamination." This paranoid, all-encompassing scapegoating was the ideological foundation for genocide.',
  },
  {
    label: 'Goebbels Propaganda Machine',
    detail:
      'Joseph Goebbels, Minister of Propaganda, controlled all media — newspapers, radio, film, education. The regime produced relentless antisemitic content, including the notorious film "The Eternal Jew" (1940). Propaganda dehumanized Jews by comparing them to vermin and disease, psychologically preparing the population to accept — or ignore — their persecution and murder.',
  },
  {
    label: '"Scientific" Racism',
    detail:
      'Nazi racial ideology was dressed in the language of science. Doctors and anthropologists measured skulls, classified "racial types," and taught racial biology in universities. The Kaiser Wilhelm Institute conducted research that lent academic respectability to pseudoscience. This corruption of science provided intellectual cover for policies that led directly to forced sterilization, human experimentation, and mass murder.',
  },
];

// ── Step-by-Step Escalation ────────────────────────────────────────────────

const ESCALATION_TIMELINE: TimelineEntry[] = [
  {
    year: 'April 1933',
    title: 'Boycott of Jewish Businesses',
    description:
      'SA stormtroopers stood outside Jewish-owned shops, painting Stars of David on windows and intimidating customers. Jews were expelled from the civil service, banned from practicing law and medicine, and dismissed from universities. This was the first test of how far the regime could go — and the world\'s muted response emboldened further action.',
    color: AMBER,
  },
  {
    year: 'September 1935',
    title: 'Nuremberg Laws',
    description:
      'Two laws stripped Jews of German citizenship and banned marriage or sexual relations between Jews and non-Jews. "Jewishness" was defined by ancestry, not religious practice — even converts to Christianity were classified as Jews. These laws transformed antisemitism from street violence into the legal framework of the state.',
    color: RED,
  },
  {
    year: 'November 9–10, 1938',
    title: 'Kristallnacht (Night of Broken Glass)',
    description:
      'In a coordinated pogrom disguised as "spontaneous" outrage, Nazi paramilitaries destroyed over 7,500 Jewish businesses, burned 267 synagogues, and arrested 30,000 Jewish men, sending them to concentration camps. At least 91 Jews were murdered. The Jewish community was then forced to pay a collective fine of one billion Reichsmarks for the damage inflicted upon them. Kristallnacht marked the transition from persecution to open violence.',
    color: CRIMSON,
  },
  {
    year: 'September 1939',
    title: 'War Begins — Ghettos Established',
    description:
      'Germany invaded Poland, beginning World War II. Jews in occupied Poland were forced into overcrowded, walled ghettos — the Warsaw Ghetto held 400,000 people in an area of 1.3 square miles. Starvation, disease, and random killings were constant. The ghettos were holding pens — most of their inhabitants would eventually be deported to extermination camps.',
    color: PURPLE,
  },
  {
    year: 'June 1941',
    title: 'Einsatzgruppen — Mass Shootings Begin',
    description:
      'When Germany invaded the Soviet Union, mobile killing units (Einsatzgruppen) followed the army, systematically shooting Jewish communities. At Babi Yar near Kyiv, 33,771 Jews were shot in just two days (September 29–30, 1941). By the end of the war, the Einsatzgruppen and their local collaborators had murdered approximately 1.5 million Jews by shooting them into mass graves.',
    color: CRIMSON,
  },
  {
    year: 'January 20, 1942',
    title: 'Wannsee Conference — The "Final Solution"',
    description:
      'Fifteen senior Nazi officials met in a villa in the Berlin suburb of Wannsee for a 90-minute meeting chaired by Reinhard Heydrich. The purpose was not to decide on the genocide — mass killing was already underway — but to coordinate the logistics. Bureaucrats discussed railway schedules and camp capacities over cognac and lunch. The meeting\'s minutes, discovered after the war, remain one of history\'s most chilling documents.',
    color: SLATE,
  },
];

// ── The Holocaust Machinery ────────────────────────────────────────────────

const MACHINERY_INSIGHTS: InsightEntry[] = [
  {
    label: 'Six Extermination Camps',
    detail:
      'All six purpose-built extermination camps were located in occupied Poland: Auschwitz-Birkenau, Treblinka, Sobibor, Belzec, Chelmno, and Majdanek. Unlike concentration camps (which used slave labor), these were built specifically to murder people as efficiently as possible. Treblinka alone killed approximately 900,000 people — nearly all within the first year of operation — with a permanent staff of only 20–30 Germans and 100–120 auxiliaries.',
  },
  {
    label: 'Auschwitz-Birkenau',
    detail:
      'The largest and most notorious camp. Upon arrival, SS doctors conducted "selections" on the railway platform — most people were sent directly to gas chambers disguised as showers. Approximately 1.1 million people were killed at Auschwitz, about 90% of them Jews. The camp also served as a slave labor site, where prisoners were worked to death. Its scale was industrial: four gas chamber/crematorium complexes, each capable of killing thousands per day.',
  },
  {
    label: 'The Scale of Murder',
    detail:
      'Approximately 6 million Jews were killed — two-thirds of Europe\'s Jewish population. Among the other victims: up to 500,000 Roma (Sinti and Roma), 250,000 disabled people murdered in the T4 "euthanasia" program, thousands of LGBTQ+ individuals, Jehovah\'s Witnesses, political prisoners, and 3 million Soviet POWs. The total death toll was approximately 11 million.',
  },
  {
    label: 'Industrial Murder',
    detail:
      'What made the Holocaust uniquely horrifying was its bureaucratic, industrial character. Trains ran on schedules. Victims\' belongings were sorted and catalogued. Gold fillings were extracted from corpses. Hair was collected for industrial use. IBM-designed punch card systems helped track prisoners. Every step — from identification to deportation to murder — was organized through the same administrative machinery that ran any modern state. This is Hannah Arendt\'s "banality of evil": genocide carried out not by monsters, but by bureaucrats.',
  },
  {
    label: 'The Role of Collaboration',
    detail:
      'The Holocaust required cooperation far beyond Germany. Vichy France deported 77,000 Jews. Hungary deported over 430,000 Jews to Auschwitz in just eight weeks in 1944. Local police and paramilitaries in Lithuania, Latvia, Ukraine, and elsewhere participated in roundups and killings. Railway workers, civil servants, and ordinary citizens across occupied Europe facilitated the genocide through action or deliberate inaction.',
  },
];

// ── Resistance ─────────────────────────────────────────────────────────────

const RESISTANCE_TIMELINE: TimelineEntry[] = [
  {
    year: 'April–May 1943',
    title: 'Warsaw Ghetto Uprising',
    description:
      'When the Nazis began the final deportation of the Warsaw Ghetto to Treblinka, approximately 700 Jewish fighters armed with a handful of pistols, homemade grenades, and one machine gun rose up against the German army. They held out for 28 days — longer than some entire countries resisted the Nazi invasion. The Germans ultimately burned the ghetto block by block. The uprising became a symbol of Jewish resistance and the refusal to go passively to death.',
    color: GOLD,
  },
  {
    year: 'October 14, 1943',
    title: 'Sobibor Prisoner Revolt',
    description:
      'In one of the most dramatic escapes of the Holocaust, prisoners at the Sobibor extermination camp organized a revolt. They killed 11 SS officers, cut the fence, and approximately 300 prisoners escaped into the surrounding forest. About 50 survived the war. The revolt was so successful that the Nazis completely demolished Sobibor and planted trees over the site to hide evidence of the camp.',
    color: GREEN,
  },
  {
    year: 'October 7, 1944',
    title: 'Auschwitz Sonderkommando Revolt',
    description:
      'Jewish prisoners forced to work in the Auschwitz crematorium — the Sonderkommando — smuggled gunpowder from a nearby munitions factory and blew up Crematorium IV. The revolt was suppressed and 451 Sonderkommando members were killed, but the destroyed crematorium was never rebuilt. Four women who smuggled the gunpowder — Ala Gertner, Róża Robota, Regina Safirsztajn, and Esther Wajcblum — were hanged.',
    color: CRIMSON,
  },
  {
    year: '1941–1944',
    title: 'Jewish Partisans',
    description:
      'Between 20,000 and 30,000 Jewish partisans fought in the forests of Belarus, Ukraine, Lithuania, and Poland. The Bielski partisans, led by the Bielski brothers, built a hidden community in the Belarusian forests that sheltered 1,200 Jews — the largest rescue of Jews by Jews during the war. Partisans sabotaged railways, ambushed German patrols, and provided a sliver of armed resistance.',
    color: TEAL,
  },
];

const RESCUERS: InsightEntry[] = [
  {
    label: 'Righteous Among Nations',
    detail:
      'Yad Vashem, Israel\'s Holocaust memorial, has recognized over 27,000 non-Jews who risked their lives to save Jews during the Holocaust. These "Righteous Among Nations" came from every occupied country. Their actions prove that moral choice existed even under the most extreme circumstances — and that claiming "there was nothing anyone could do" is a lie.',
  },
  {
    label: 'Oskar Schindler (1908–1974)',
    detail:
      'A German industrialist and member of the Nazi Party who saved approximately 1,200 Jews by employing them in his factories and bribing officials. Schindler began as a war profiteer but was transformed by witnessing the liquidation of the Kraków Ghetto. He spent his entire fortune protecting his workers. After the war, he was destitute — the people he saved supported him for the rest of his life.',
  },
  {
    label: 'Raoul Wallenberg (1912–1947?)',
    detail:
      'A Swedish diplomat in Budapest who issued thousands of protective passports and sheltered Jews in buildings designated as Swedish territory. He saved an estimated 100,000 Hungarian Jews in the final months of the war. When Soviet forces took Budapest, Wallenberg was arrested by the NKVD and disappeared into the Soviet prison system. His fate remains one of the Cold War\'s enduring mysteries.',
  },
  {
    label: 'Irena Sendler (1910–2008)',
    detail:
      'A Polish social worker who smuggled approximately 2,500 Jewish children out of the Warsaw Ghetto — in ambulances, coffins, suitcases, and through sewer tunnels. She kept meticulous records of each child\'s identity in jars buried under a tree, hoping to reunite them with their families after the war. Arrested by the Gestapo in 1943, she was tortured but never revealed the children\'s locations. She escaped execution through a bribe.',
  },
  {
    label: 'Nicholas Winton (1909–2015)',
    detail:
      'A British stockbroker who organized the rescue of 669 Czech children, most of them Jewish, in the months before war broke out. He arranged trains, found foster homes in Britain, and dealt with bureaucratic obstacles. A planned ninth transport of 250 children was cancelled when Germany invaded Poland. Winton told no one about his actions for 50 years — until his wife found a scrapbook with the children\'s names.',
  },
];

// ── Key Figures ────────────────────────────────────────────────────────────

const PERPETRATORS: FigureEntry[] = [
  {
    name: 'Adolf Hitler',
    years: '1889–1945',
    contribution:
      'Failed artist, WWI corporal, charismatic demagogue. As Führer, he drove every major decision — from antisemitic legislation to the invasion of the Soviet Union to the Final Solution. Committed suicide in his Berlin bunker as Soviet forces closed in, taking no responsibility for the destruction of Europe and the murder of millions.',
  },
  {
    name: 'Heinrich Himmler',
    years: '1900–1945',
    contribution:
      'Head of the SS and architect of the concentration and extermination camp system. Himmler oversaw the Einsatzgruppen, the death camps, and the vast SS bureaucracy of murder. Captured by the British in May 1945, he killed himself with a cyanide capsule before he could be tried.',
  },
  {
    name: 'Reinhard Heydrich',
    years: '1904–1942',
    contribution:
      'Head of the Reich Main Security Office and chair of the Wannsee Conference that coordinated the Final Solution. Known as "The Butcher of Prague" for his brutal rule of occupied Czechoslovakia. Assassinated by Czech and Slovak resistance fighters in Operation Anthropoid — the highest-ranking Nazi official killed during the war.',
  },
  {
    name: 'Adolf Eichmann',
    years: '1906–1962',
    contribution:
      'SS officer who managed the logistics of mass deportation — the train schedules, the camp capacities, the bureaucratic machinery of genocide. Escaped to Argentina after the war. Captured by Israeli Mossad agents in 1960, tried in Jerusalem, and executed in 1962. Hannah Arendt\'s report on his trial coined the phrase "the banality of evil."',
  },
];

const VICTIMS_SURVIVORS: FigureEntry[] = [
  {
    name: 'Anne Frank',
    years: '1929–1945',
    contribution:
      'A German-Dutch Jewish girl who kept a diary while hiding with her family in an Amsterdam annex for over two years. Betrayed and deported, she died of typhus in Bergen-Belsen at age 15, just weeks before liberation. Her diary, published posthumously, became one of the most widely read books in history — giving a human face to the six million.',
  },
  {
    name: 'Elie Wiesel',
    years: '1928–2016',
    contribution:
      'Deported to Auschwitz and Buchenwald at age 15. His memoir "Night" (1960) became the defining literary work of the Holocaust — a spare, devastating account of losing his faith in God and humanity. He spent his life bearing witness, won the Nobel Peace Prize in 1986, and argued that indifference is the greatest danger: "The opposite of love is not hate, it\'s indifference."',
  },
  {
    name: 'Viktor Frankl',
    years: '1905–1997',
    contribution:
      'Austrian psychiatrist who survived Auschwitz and three other camps. His book "Man\'s Search for Meaning" (1946), written in nine days, argued that even in the most dehumanizing conditions, humans can find purpose. The book has sold over 16 million copies and remains one of the most influential works on human resilience.',
  },
  {
    name: 'Primo Levi',
    years: '1919–1987',
    contribution:
      'Italian Jewish chemist deported to Auschwitz in 1944. His memoir "If This Is a Man" (1947) is considered one of the greatest works of 20th-century literature — a precise, unsentimental account of life in the camp that insists on the humanity of even the most degraded prisoners. He wrote until his death, wrestling with survivor\'s guilt and the impossibility of communicating the experience.',
  },
];

// ── Liberation and Aftermath ───────────────────────────────────────────────

const AFTERMATH_TIMELINE: TimelineEntry[] = [
  {
    year: 'January 27, 1945',
    title: 'Liberation of Auschwitz',
    description:
      'Soviet forces entered Auschwitz to find approximately 7,000 emaciated prisoners — those too sick to be forced on death marches. The Nazis had tried to destroy evidence, blowing up crematoria, but the sheer scale of the camp made concealment impossible. Warehouses still held 7,000 kg of human hair, hundreds of thousands of men\'s suits and women\'s dresses, and 44,000 pairs of shoes. January 27 is now International Holocaust Remembrance Day.',
    color: BLUE,
  },
  {
    year: 'November 1945 – October 1946',
    title: 'Nuremberg Trials',
    description:
      'The first international war crimes tribunal in history tried 22 major Nazi leaders. Twelve were sentenced to death, seven to prison. The trials established crucial legal principles: "following orders" is not a defense, individuals bear responsibility for war crimes and crimes against humanity, and there are acts so terrible that the entire international community has standing to judge them. These principles still underpin international criminal law today.',
    color: INDIGO,
  },
  {
    year: '1945–1951',
    title: 'Displaced Persons Camps',
    description:
      'Hundreds of thousands of Holocaust survivors found themselves in DP camps — many on the sites of former concentration camps. They had no homes to return to: their communities had been destroyed, their property seized, and in some cases (such as the Kielce pogrom of 1946 in Poland), returning Jews were murdered by their former neighbors. Many survivors waited years in limbo before emigrating to Palestine/Israel, the United States, or elsewhere.',
    color: ASH,
  },
  {
    year: '1948',
    title: 'Creation of Israel',
    description:
      'The Holocaust was a major catalyst for the creation of the State of Israel. The horror of the genocide strengthened the Zionist argument that Jews needed a sovereign homeland. Hundreds of thousands of Holocaust survivors made their way to the new state. The relationship between the Holocaust and Israel\'s founding remains one of the most consequential and debated legacies of the 20th century.',
    color: GOLD,
  },
  {
    year: '1960s–Present',
    title: 'Ongoing Reckoning',
    description:
      'Holocaust memory remains an active, contested space. Germany has paid billions in reparations and made Holocaust education mandatory. Holocaust denial is a criminal offense in many European countries. Museums and memorials — Yad Vashem in Jerusalem, the US Holocaust Memorial Museum in Washington, Auschwitz itself — draw millions of visitors. Yet antisemitism persists and even surges. The last survivors are dying. The question of how to keep memory alive when no living witnesses remain is urgent.',
    color: TEAL,
  },
];

// ── Why It Matters ─────────────────────────────────────────────────────────

const WHY_IT_MATTERS: InsightEntry[] = [
  {
    label: 'The Banality of Evil',
    detail:
      'Hannah Arendt\'s phrase, coined during the Eichmann trial, describes how genocide was carried out not by psychopaths but by ordinary bureaucrats who followed procedures, obeyed orders, and refused to think about what they were doing. Eichmann was not a monster — he was a careerist. This is the most disturbing lesson of the Holocaust: the capacity for evil lives in ordinary systems and ordinary people.',
  },
  {
    label: 'How Ordinary People Became Perpetrators',
    detail:
      'Christopher Browning\'s "Ordinary Men" documented how Reserve Police Battalion 101 — middle-aged German men, not ideological Nazis — shot tens of thousands of Jews in Poland. They were given the choice to opt out; very few did. Social pressure, obedience to authority, and gradual desensitization turned normal people into mass murderers. Stanley Milgram\'s obedience experiments at Yale, inspired by the Holocaust, confirmed how easily authority overrides individual conscience.',
  },
  {
    label: 'Gregory Stanton\'s 10 Stages of Genocide',
    detail:
      'Genocide scholar Gregory Stanton identified ten stages: Classification, Symbolization, Discrimination, Dehumanization, Organization, Polarization, Preparation, Persecution, Extermination, and Denial. Every one of these stages was visible in Nazi Germany, often years before the killing began. The Holocaust teaches that genocide does not appear suddenly — it escalates through identifiable steps, and each step is an opportunity for intervention that was missed.',
  },
  {
    label: '"Never Again" — and Its Failures',
    detail:
      'The world said "Never Again" after the Holocaust. Then came Cambodia (1975–1979), Rwanda (1994), Srebrenica (1995), Darfur (2003–present). The promise has been broken repeatedly. Understanding the Holocaust is not merely an exercise in historical memory — it is a study in how societies fail, how warning signs are ignored, and how the machinery of dehumanization operates. The obligation is not just to remember, but to recognize the patterns when they recur.',
  },
  {
    label: 'The Duty of Memory',
    detail:
      'Primo Levi wrote: "It happened, therefore it can happen again." As the last survivors pass away, the Holocaust transitions from living memory to history. Every generation must learn it anew — not as an abstraction or a moral lesson, but as a specific, documented catastrophe that was carried out by real people, in real places, using the tools of a modern state, against their own neighbors. To forget is to leave the door open.',
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

export default function HolocaustPage() {
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
              background: `linear-gradient(135deg, ${ASH}, ${RED})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            The Holocaust — Industrial Murder and the Failure of Civilization
            (1933–1945)
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
              Six million Jews murdered — two-thirds of Europe's Jewish
              population. Eleven million total, including Roma, disabled people,
              LGBTQ+ individuals, political prisoners, and Soviet POWs. Not in a
              frenzy of war, but through bureaucratic planning, railway
              timetables, and industrial killing facilities. The Holocaust was
              not an aberration of civilization — it was carried out using every
              tool of the modern state.
            </p>
            <p
              style={{
                color: SLATE,
                lineHeight: 1.7,
                fontSize: '0.95rem',
                maxWidth: 800,
              }}
            >
              This page attempts to document what happened, how it was possible,
              who resisted, and why it matters. It is presented with the gravity
              and respect that eleven million murdered human beings deserve.
            </p>
          </motion.div>
        </header>

        {/* ── Rise of Hitler ───────────────────────────────────────────── */}
        <SectionWrapper
          id="rise"
          icon="🔥"
          title="Rise of Hitler and the Nazi Party"
          accentColor={AMBER}
          intro="Hitler did not seize power in a vacuum. He rose through the wreckage of a defeated nation, exploiting economic despair, nationalist fury, and centuries of antisemitic tradition. Understanding how a failed artist became the architect of genocide requires understanding the Weimar Republic's fatal vulnerabilities."
        >
          <InsightGrid items={RISE_INSIGHTS} />
        </SectionWrapper>

        {/* ── Nazi Ideology ────────────────────────────────────────────── */}
        <SectionWrapper
          id="ideology"
          icon="☠️"
          title="Nazi Ideology"
          accentColor={CRIMSON}
          intro="Nazism was not a coherent political philosophy — it was a collection of hatreds organized around the myth of racial supremacy. Antisemitism was its beating heart. Every other element — Lebensraum, propaganda, pseudoscience — served the central goal of identifying, dehumanizing, and ultimately eliminating the Jewish people and other groups deemed 'unworthy of life.'"
        >
          <InsightGrid items={IDEOLOGY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Step-by-Step Escalation ──────────────────────────────────── */}
        <SectionWrapper
          id="escalation"
          icon="📜"
          title="Step-by-Step Escalation (1933–1942)"
          accentColor={RED}
          intro="The Holocaust did not begin with gas chambers. It began with words, then laws, then broken windows, then ghettos, then bullets, then industrialized murder. Each step tested the limits of what the world would tolerate — and each time, the answer was: more than you might think. The escalation was deliberate, systematic, and documented at every stage."
        >
          <TimelineCard entries={ESCALATION_TIMELINE} />
        </SectionWrapper>

        {/* ── The Holocaust Machinery ──────────────────────────────────── */}
        <SectionWrapper
          id="machinery"
          icon="⚙️"
          title="The Holocaust Machinery"
          accentColor={SLATE}
          intro="The defining horror of the Holocaust is its industrial character. This was genocide by bureaucracy — organized, efficient, and documented. Trains ran on schedule. Forms were filled out in triplicate. The same administrative competence that built modern infrastructure was turned to the purpose of mass murder."
        >
          <InsightGrid items={MACHINERY_INSIGHTS} />
        </SectionWrapper>

        {/* ── Resistance ───────────────────────────────────────────────── */}
        <SectionWrapper
          id="resistance"
          icon="✊"
          title="Resistance"
          accentColor={GOLD}
          intro="The myth that Jews 'went like sheep to the slaughter' is false and deeply disrespectful. Armed resistance occurred in ghettos, camps, and forests across occupied Europe. But resistance also took countless other forms: hiding children, forging documents, maintaining religious practice, keeping diaries, and simply surviving. And among non-Jews, a precious few risked everything to save their neighbors."
        >
          <h3
            style={{
              color: GREEN,
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Armed Resistance
          </h3>
          <TimelineCard entries={RESISTANCE_TIMELINE} />
          <div style={{ marginTop: 36 }}>
            <h3
              style={{
                color: TEAL,
                fontSize: '1.2rem',
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Rescuers — Righteous Among the Nations
            </h3>
            <InsightGrid items={RESCUERS} />
          </div>
        </SectionWrapper>

        {/* ── Key Figures ──────────────────────────────────────────────── */}
        <SectionWrapper
          id="figures"
          icon="👤"
          title="Key Figures"
          accentColor={INDIGO}
          intro="The Holocaust had architects, executors, victims, survivors, and rescuers. Naming them matters — both to ensure that perpetrators are remembered for what they did, and that victims and survivors are remembered as the individual human beings they were."
        >
          <h3
            style={{
              color: CRIMSON,
              fontSize: '1.15rem',
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            Perpetrators
          </h3>
          <FigureGrid figures={PERPETRATORS} />
          <div style={{ marginTop: 32 }}>
            <h3
              style={{
                color: BLUE,
                fontSize: '1.15rem',
                fontWeight: 600,
                marginBottom: 14,
              }}
            >
              Victims and Survivors
            </h3>
            <FigureGrid figures={VICTIMS_SURVIVORS} />
          </div>
        </SectionWrapper>

        {/* ── Liberation and Aftermath ─────────────────────────────────── */}
        <SectionWrapper
          id="aftermath"
          icon="🕊️"
          title="Liberation and Aftermath"
          accentColor={BLUE}
          intro="Liberation did not mean the end of suffering. Survivors emerged from camps and hiding places into a destroyed world. Their communities were gone, their families murdered, their homes occupied by strangers. The process of justice, displacement, and rebuilding would take decades — and in many ways continues today."
        >
          <TimelineCard entries={AFTERMATH_TIMELINE} />
        </SectionWrapper>

        {/* ── Why It Matters ───────────────────────────────────────────── */}
        <SectionWrapper
          id="lessons"
          icon="🕯️"
          title="Why It Matters"
          accentColor={ROSE}
          intro="The Holocaust is not ancient history. Survivors lived into the 21st century. Its lessons are not abstract — they are specific, documented, and urgently relevant. Understanding how a modern, educated European nation industrialized mass murder is not an academic exercise. It is a survival skill for civilization."
        >
          <InsightGrid items={WHY_IT_MATTERS} />
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
            "It happened, therefore it can happen again: this is the core of
            what we have to say." — Primo Levi
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
