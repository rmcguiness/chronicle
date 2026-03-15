/**
 * RiseOfNazismPage — comprehensive deep-dive on the rise of Adolf Hitler
 * and National Socialism (1919-1945).
 *
 * Route: /rise-of-nazism
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ASH = '#94a3b8';
const CRIMSON = '#dc2626';
const TEAL = '#14b8a6';
const INDIGO = '#6366f1';
const ROSE = '#f43f5e';
const SLATE = '#64748b';
const BLOOD_RED = '#991b1b';
const IRON_GRAY = '#6b7280';
const WEIMAR_GOLD = '#ca8a04';
const NAZI_BLACK = '#374151';
const ASH_BROWN = '#78716c';
const WARNING_AMBER = '#f59e0b';
const MEMORIAL_WHITE = '#e2e8f0';

interface TimelineEntry { year: string; title: string; description: string; color: string; }
interface InsightEntry { label: string; detail: string; }
interface StatEntry { stat: string; context: string; color: string; }

const KEY_STATS: StatEntry[] = [
  { stat: '2.6% → 37%', context: "Nazi vote share in just 4 years (1928–1932)", color: CRIMSON },
  { stat: '6 million', context: "Jews murdered in the Holocaust (2/3 of European Jews)", color: BLOOD_RED },
  { stat: '99%', context: "Weimar Germany's literacy rate — one of the most educated nations on Earth", color: TEAL },
  { stat: '4.2 trillion:1', context: "Marks to $1 USD at peak hyperinflation (1923)", color: WEIMAR_GOLD },
  { stat: '6 weeks', context: "From Chancellor to dictator — democracy ended legally", color: WARNING_AMBER },
  { stat: '12 years', context: "Hitler's rule (1933–1945) — Europe's deadliest regime in that span", color: IRON_GRAY },
];

const WEIMAR_INSIGHTS: InsightEntry[] = [
  { label: 'The "Stab in the Back" Myth (Dolchstoßlegende)', detail: "Germany's military leaders — Hindenburg and Ludendorff — told the German public that their army had never been defeated on the battlefield. Instead, they claimed, Germany had been \"stabbed in the back\" by civilians, Jews, socialists, and democratic politicians who surrendered while the army was still fighting. This was a lie. By late 1918, the German army was exhausted, its allies had collapsed, and the generals themselves had demanded an armistice. But the myth was politically powerful because German troops had still been on foreign soil when the war ended. Millions of veterans returned home to a defeated nation and couldn't understand why they had lost. The \"stab in the back\" myth gave them an answer — and a set of enemies to blame." },
  { label: 'The Treaty of Versailles (1919)', detail: "The peace terms imposed on Germany were designed to humiliate and weaken. Article 231 — the \"war guilt clause\" — forced Germany to accept sole responsibility for the war. Reparations were set at $33 billion (roughly $500 billion today). Germany lost 13% of its territory and 10% of its population: Alsace-Lorraine to France, the Polish Corridor to Poland, all overseas colonies. The army was capped at 100,000 troops — a police force, not a military. Germany was banned from having an air force, submarines, or tanks. The treaty was harsh enough to create lasting resentment but not harsh enough to prevent Germany from rebuilding. It was, as the economist John Maynard Keynes warned at the time, a \"Carthaginian peace\" that would breed another war." },
  { label: 'The Weimar Republic: Democracy Born in Defeat', detail: "Germany's first democracy was proclaimed in November 1918, two days before the armistice — a timing that forever linked democracy with defeat and surrender in the minds of millions of Germans. The Weimar Republic had one of the most progressive constitutions in the world: universal suffrage, proportional representation, extensive civil liberties. But it was never fully legitimate. The right despised it as the product of the \"November criminals\" who had surrendered. The left saw it as a bourgeois compromise. And Article 48 of the constitution allowed the president to rule by emergency decree — a loophole that would prove fatal." },
  { label: 'Hyperinflation (1923): The Middle Class Destroyed', detail: "In 1921, Germany owed 132 billion gold marks in reparations. When it fell behind on payments, France and Belgium occupied the Ruhr. The German government responded by printing money. In January 1923, a loaf of bread cost 250 marks. By November, it cost 200 billion marks. The exchange rate reached 4.2 trillion marks to $1 USD. Workers were paid twice daily and ran to spend their wages before the money lost value. People burned banknotes for heat because fuel cost more than paper. A lifetime of middle-class savings became worthless overnight. The psychological impact was devastating: an entire generation learned that the rules could change at any moment, that institutions could not be trusted." },
  { label: 'The Golden Twenties (1924–1929): A Brief Reprieve', detail: "After currency stabilization and American loans under the Dawes Plan, Weimar Germany experienced a remarkable cultural flowering. Berlin became the most vibrant city in Europe: Bauhaus architecture, Expressionist cinema, Bertolt Brecht's theater, Marlene Dietrich, the cabaret scene. Scientific achievement flourished — Einstein, Heisenberg, and Planck were all working in Germany. But this prosperity was built on American credit, not German production. When the loans stopped, the golden age ended overnight. And the cultural liberalism of Weimar became ammunition for the right, which denounced it as \"degenerate\" and morally corrupt." },
  { label: 'The Great Depression Hits Germany (1929–1932)', detail: "The Wall Street crash of October 1929 devastated Germany more than any other major economy. American banks recalled their short-term loans. German businesses collapsed. By 1932, 6 million Germans were unemployed — 30% of the workforce. In some industrial cities, the figure exceeded 50%. Young men who had never had a steady job joined paramilitary organizations for purpose and camaraderie. Democratic governments seemed paralyzed. Into this vacuum stepped a man who offered certainty, strength, and someone to blame." },
];

const HITLER_INSIGHTS: InsightEntry[] = [
  { label: 'Origins: The Failed Artist', detail: "Adolf Hitler was born in Braunau am Inn, Austria, on April 20, 1889. His mother, Klara, died of breast cancer when Hitler was 18. He moved to Vienna with dreams of becoming an artist, but was rejected twice by the Vienna Academy of Fine Arts. He spent several years living in homeless shelters and men's hostels, selling postcards of Viennese landmarks. It was in Vienna — a city seething with ethnic tensions — that Hitler absorbed the toxic brew of antisemitism, pan-Germanism, and Social Darwinism that would form the core of his worldview." },
  { label: 'WWI: The War That Made Him', detail: "When war broke out in August 1914, Hitler volunteered for the Bavarian Army. By his own account, it was the happiest day of his life. He served as a dispatch runner on the Western Front, earning the Iron Cross First Class. He was temporarily blinded by a British gas attack in October 1918, recovering in hospital when he learned of Germany's surrender. The war gave Hitler what civilian life never had: purpose, belonging, a sense of mission. And it left him with an unshakeable conviction that Germany had been betrayed from within." },
  { label: 'Munich 1919: Discovering His Gift', detail: "Post-war Munich was a cauldron of political extremism. The army assigned Hitler to intelligence work — monitoring extremist groups. In September 1919, he attended a meeting of the tiny German Workers' Party (DAP). He stood up to argue with a speaker and discovered he could electrify an audience. He joined the party as member number 555 (they started numbering at 500 to seem bigger). Within two years, he had renamed it the National Socialist German Workers' Party (NSDAP) — the Nazis — and made himself its undisputed leader." },
  { label: 'The Beer Hall Putsch (1923)', detail: "On November 8, 1923, inspired by Mussolini's March on Rome, Hitler attempted to seize power in Bavaria. He burst into a Munich beer hall, fired a pistol into the ceiling, and declared a national revolution. The next morning, 2,000 Nazis marched through Munich — and were met by police gunfire. Sixteen Nazis and four police officers were killed. Hitler was arrested, tried for treason, and sentenced to five years (he served nine months in comfortable conditions). What should have been the end of his political career became a propaganda triumph." },
  { label: 'Mein Kampf: Dictated in Prison', detail: "During his imprisonment at Landsberg fortress, Hitler dictated his political autobiography and manifesto to Rudolf Hess. Published in 1925–1926, Mein Kampf (\"My Struggle\") was rambling and badly written — but it laid out everything Hitler intended to do: destroy the Jews, conquer Eastern Europe, abolish democracy, build a racial state. Almost no one took it seriously. It sold poorly at first. By the time it mattered, 10 million copies were in circulation. The most dangerous book of the 20th century was hiding in plain sight." },
];

const IDEOLOGY_INSIGHTS: InsightEntry[] = [
  { label: 'Racial Hierarchy: The "Master Race"', detail: "At the core of Nazi ideology was the concept of racial hierarchy. Hitler divided humanity into a hierarchy of races, with \"Aryans\" at the top and Jews at the bottom. This was pseudo-science dressed as biology — drawing on discredited 19th-century racial theories, Social Darwinism, and centuries of European antisemitism. The Nazis believed that race determined everything: intelligence, creativity, moral worth, civilizational capacity. This was not merely prejudice; it was an entire worldview in which history was a struggle between races." },
  { label: 'Antisemitism: The Jewish Conspiracy', detail: "Nazi antisemitism went far beyond traditional religious prejudice. Hitler portrayed Jews not as a religious group but as a race — an alien, parasitic race that had infiltrated every nation and institution. Jews were simultaneously blamed for capitalism and communism, for Germany's defeat in WWI and for the Treaty of Versailles. This conspiracy theory was unfalsifiable and all-encompassing. Every problem had the same answer: the Jews. Antisemitism was the connective tissue that held all other Nazi ideas together." },
  { label: 'Lebensraum: "Living Space" in the East', detail: "Hitler explicitly stated that Germany needed Lebensraum — living space — for its growing population. This space would be taken from Eastern Europe, particularly the Soviet Union, whose Slavic populations would be enslaved, expelled, or exterminated. This was not metaphorical: it was a plan for colonial conquest on the European continent itself. The Hunger Plan of 1941 envisioned the deliberate starvation of tens of millions of Soviet citizens. Nazi colonialism was not a side effect of the war; it was the war's purpose." },
  { label: 'The Cult of Will and Strength', detail: "Nazism rejected Enlightenment values entirely. Reason, individual rights, democratic deliberation, universal human dignity — all were dismissed as weakness. In their place: the triumph of the will, the cult of the leader (Führerprinzip), the glorification of violence, the subordination of the individual to the racial community (Volksgemeinschaft). Democracy was despised as rule by the mediocre. This was not conservatism — it was a revolutionary ideology that sought to remake human nature itself through war and racial purification." },
  { label: '"Nobody Took It Seriously"', detail: "Mein Kampf sold 9,000 copies in its first year. It was dismissed by reviewers as the rantings of a crank. Foreign diplomats assumed the extreme passages were rhetorical posturing. Even German Jews tended to view Hitler as a passing phenomenon. Sigmund Freud, asked if he was worried about the Nazis in 1930, reportedly said: \"A nation that produced Goethe could not possibly go to the bad.\" He fled Austria in 1938. Four of his sisters died in concentration camps. The most consistent lesson: when someone tells you who they are and what they intend to do, believe them." },
];

const VOTE_DATA = [
  { year: 'May 1924', pct: 6.5, seats: 32, context: 'First election after Beer Hall Putsch — sympathy vote' },
  { year: 'Dec 1924', pct: 3.0, seats: 14, context: 'Economy stabilizing — extremism fades' },
  { year: 'May 1928', pct: 2.6, seats: 12, context: 'Prosperity — Nazis irrelevant fringe party' },
  { year: 'Sep 1930', pct: 18.3, seats: 107, context: 'Depression hits — Nazis surge' },
  { year: 'Jul 1932', pct: 37.3, seats: 230, context: 'Peak — largest party in Reichstag' },
  { year: 'Nov 1932', pct: 33.1, seats: 196, context: 'Slight decline — party finances strained' },
  { year: 'Mar 1933', pct: 43.9, seats: 288, context: 'After Reichstag fire — with state terror' },
];

const RISE_INSIGHTS: InsightEntry[] = [
  { label: 'From Fringe to Mainstream: The Depression Effect', detail: "In May 1928, the Nazi Party received 2.6% of the vote — 12 seats in the Reichstag. Then the Depression struck. In September 1930: 18.3% — 107 seats. In July 1932: 37.3% — 230 seats, the largest party. They never won a majority — but in a fragmented parliamentary system with dozens of parties, 37% was enough to be the dominant force. Economic catastrophe accomplished what ideology alone could not." },
  { label: 'What Hitler Offered', detail: "To the unemployed, he offered jobs. To the humiliated, national pride. To the frightened, order. To the angry, enemies. Hitler was a master of telling different audiences what they wanted to hear. To industrialists: crush the unions. To workers: fight the capitalists. To veterans: tear up Versailles. To Christians: protect the Church. To everyone, he offered certainty in an age of chaos, strength in a time of weakness, and the intoxicating promise that Germany's greatest days lay ahead." },
  { label: 'Street Violence: The SA and the Politics of Intimidation', detail: "The Sturmabteilung (SA, or \"Brownshirts\") was the Nazi paramilitary wing — by 1932, roughly 400,000 members, four times the size of the German army. They waged organized street warfare against political opponents, broke up rival rallies, beat opposition politicians, attacked Jewish businesses, and created a climate of constant intimidation. The Weimar police were overwhelmed, the courts were sympathetic to right-wing violence. The violence wasn't a side effect — it was a strategy. If democracy looked like chaos, people would demand an alternative." },
  { label: 'Conservative Elites: The Fatal Miscalculation', detail: "The men who put Hitler in power were not Nazis. They were conservative nationalists who believed they could use Hitler's popular support while controlling him. Papen famously told a friend: \"Within two months, we will have pushed Hitler so far into a corner that he'll squeak.\" President Hindenburg, who despised Hitler as a \"Bohemian corporal,\" was persuaded to appoint him Chancellor on January 30, 1933, in a cabinet where Nazis held only three of eleven seats. Within months, every one of them had been sidelined, arrested, or forced into submission. It was the most consequential political miscalculation of the 20th century." },
  { label: 'Propaganda Mastery', detail: "The Nazis were pioneers of modern political propaganda. Joseph Goebbels understood mass psychology with terrifying effectiveness. Nazi rallies were theatrical spectacles — searchlights, massed flags, martial music. Leni Riefenstahl's \"Triumph of the Will\" turned the Nuremberg Rally into cinema. Nazi slogans were simple and endlessly repeated: \"Ein Volk, ein Reich, ein Führer.\" The party exploited radio — a new mass medium — to put Hitler's voice in every living room." },
];

const DEMOCRACY_DIES_TIMELINE: TimelineEntry[] = [
  { year: 'January 30, 1933', title: 'Hitler Appointed Chancellor', description: "President Hindenburg, persuaded by conservative elites, appoints Adolf Hitler as Chancellor. Hitler leads a coalition government with only three Nazi ministers out of eleven. The conservatives believe they can control him. Hundreds of thousands of SA members march through Berlin with torches. The Weimar Republic has 35 days left.", color: IRON_GRAY },
  { year: 'February 1, 1933', title: 'Reichstag Dissolved — New Elections Called', description: "Hitler convinces Hindenburg to dissolve the Reichstag and call new elections for March 5. This gives the Nazis five weeks of control of the state apparatus — including the police and radio — during an election campaign. Göring deputizes 50,000 SA and SS men as auxiliary police.", color: CRIMSON },
  { year: 'February 4, 1933', title: 'Emergency Decree Restricts Press Freedom', description: "Hindenburg signs the \"Decree for the Protection of the German People,\" giving the government power to ban political meetings and suppress publications. Opposition newspapers are shut down. The free press dies in the fifth day of Hitler's chancellorship.", color: ROSE },
  { year: 'February 27, 1933', title: 'The Reichstag Fire', description: "The German parliament building burns. A young Dutch communist, Marinus van der Lubbe, is found at the scene. Whether the Nazis started the fire themselves remains debated — but the cause mattered less than the response. Hitler declares it the beginning of a communist revolution and demands emergency powers.", color: BLOOD_RED },
  { year: 'February 28, 1933', title: 'Reichstag Fire Decree — Civil Liberties Suspended', description: "The morning after the fire, Hindenburg signs the \"Decree for the Protection of the People and State.\" It suspends every fundamental right guaranteed by the Weimar Constitution: freedom of speech, press, assembly, privacy of communications, protection against unreasonable search and seizure. It was \"temporary.\" It remained in force until 1945. This single decree was the legal foundation for twelve years of Nazi terror.", color: CRIMSON },
  { year: 'March 5, 1933', title: 'Election Under Terror', description: "Germany votes with SA thugs guarding polling stations, the Communist Party effectively banned, opposition press silenced. Despite all this, the Nazis still receive only 43.9% of the vote. They need the conservative DNVP's 8% to form a majority. Hitler has control of the state but not a democratic mandate — he needs one more step.", color: WARNING_AMBER },
  { year: 'March 23, 1933', title: 'The Enabling Act — Democracy Votes Itself Out of Existence', description: "The Enabling Act gives Hitler the power to enact laws without parliamentary approval, even laws that deviate from the constitution. Communist deputies have been arrested or are in hiding. SA men line the corridors. Only the Social Democrats vote against it — 94 to 441. Their leader, Otto Wels, gives the last free speech in Germany: \"You can take our lives and our freedom, but you cannot take our honor.\" Democracy in Germany is over. It voted to end itself.", color: NAZI_BLACK },
];

const THIRD_REICH_INSIGHTS: InsightEntry[] = [
  { label: 'Gleichschaltung: Total Coordination', detail: "Within months of the Enabling Act, every independent institution in Germany was absorbed into the Nazi state. Trade unions dissolved. Political parties banned — Germany became a one-party state by July 1933. The civil service purged of Jews and opponents. Universities expelled Jewish professors. The press was brought under state control. Even bowling clubs and beekeeping associations were \"coordinated.\" The word Gleichschaltung — literally \"switching to the same current\" — captures the totality." },
  { label: "Propaganda: Goebbels's Information War", detail: "Joseph Goebbels built the most sophisticated information control system the world had ever seen. The Reich Chamber of Culture controlled all artistic and media production. Radio became ubiquitous: the regime subsidized cheap \"People's Receivers\" (Volksempfänger) so every household could hear Hitler's speeches. The Nuremberg Rallies were spectacular propaganda events. Children were indoctrinated through the Hitler Youth (mandatory from 1936). Books were burned. The truth was whatever the state said it was." },
  { label: 'The Nuremberg Laws (1935)', detail: "On September 15, 1935, Hitler announced two laws stripping Jews of their remaining rights. The Reich Citizenship Law declared that only those of \"German or related blood\" could be citizens. The Law for the Protection of German Blood and Honor banned marriages and sexual relations between Jews and non-Jews. Who counted as \"Jewish\" was defined by ancestry, not belief — people who had never practiced Judaism were suddenly classified as Jews. The laws were the legal architecture of exclusion: systematic, bureaucratic, and dressed in the language of law and order." },
  { label: 'Kristallnacht — The Night of Broken Glass (November 9–10, 1938)', detail: "On the night of November 9–10, across Germany and Austria: 7,500 Jewish-owned businesses were destroyed. 267 synagogues were burned. 91 Jews were murdered. 30,000 Jewish men were arrested and sent to concentration camps. Jewish communities were then collectively fined 1 billion Reichsmarks for the damage — the victims were billed for their own persecution. Kristallnacht shattered any remaining illusion that the regime would limit itself to \"legal\" discrimination." },
  { label: 'The Evian Conference (1938): The World Looks Away', detail: "In July 1938, 32 nations gathered at Evian-les-Bains, France, to discuss the growing refugee crisis of Jews fleeing Nazi Germany. One by one, each nation explained why it could not accept more refugees. The United States, Britain, France, Canada, Australia — all refused to increase their quotas. The Dominican Republic was the only country that offered to take a significant number. Nobody wanted the Jews. The world's indifference gave the Nazis a green light." },
  { label: 'The Terror State: Gestapo, SS, and Concentration Camps', detail: "The first concentration camp, Dachau, opened in March 1933 — weeks after Hitler became chancellor — for political prisoners. The Gestapo operated above the law: it could arrest anyone, hold them indefinitely, and no court could review its actions. The SS, under Himmler, grew from Hitler's personal bodyguard into a state within a state. By 1939, tens of thousands of Germans had passed through the camps. Everyone knew they existed. The message was clear: resistance had consequences." },
];

const SUPPORT_INSIGHTS: InsightEntry[] = [
  { label: 'Economic Recovery: The Most Powerful Propaganda', detail: "For many ordinary Germans, the early years of Nazi rule worked. Unemployment dropped from 6 million (30%) in 1933 to under 1 million (under 4%) by 1937. The autobahn was built. Rearmament created millions of jobs. Most of this recovery was built on unsustainable military spending and theft from Jews, but for the average German in 1936, life was tangibly better than in 1932. When your family is eating again, you don't ask too many questions about the regime that made it happen." },
  { label: 'National Pride Restored', detail: "After fifteen years of humiliation, Hitler gave Germans permission to feel proud again. He remilitarized the Rhineland (1936), annexed Austria (1938), and took the Sudetenland (1938) — all without firing a shot. The 1936 Berlin Olympics were a showcase. The message was intoxicating: Germany was great again, respected again, feared again. Pride is a powerful political force, and Hitler weaponized it." },
  { label: 'The Controlled Information Environment', detail: "By 1935, most Germans had no access to independent information. All newspapers, radio stations, films, and books were controlled by the state. Foreign radio was eventually made illegal to listen to. The regime didn't just suppress dissent — it created an alternative reality. When every source of information tells the same story, even intelligent people struggle to maintain a grip on reality." },
  { label: 'Fear: The Cost of Opposition', detail: "Speaking against the regime could mean arrest, torture, concentration camp, or death. The Gestapo relied on a vast network of informers — an estimated 1 in 42 Germans was an informer of some kind. Children in the Hitler Youth were encouraged to report parents who expressed disloyal sentiments. The White Rose resistance group — a handful of Munich students who distributed anti-Nazi leaflets — were caught, tried, and beheaded within days. Most people chose survival." },
  { label: 'Antisemitism: Deep Roots, Not a Nazi Invention', detail: "The Nazis did not invent antisemitism — they exploited centuries of it. Anti-Jewish prejudice was woven into European culture: accusations of deicide, blood libels, pogroms, expulsions. Martin Luther himself wrote viciously antisemitic tracts in the 16th century. The Dreyfus Affair in France (1894) showed antisemitism flourished even in liberal democracies. What the Nazis did was take ancient prejudice, give it pseudo-scientific racial packaging, and elevate it from social bigotry to state policy." },
  { label: 'The Bystander Effect and the "Banality of Evil"', detail: "Hannah Arendt, covering the trial of Adolf Eichmann in 1961, coined the phrase \"the banality of evil.\" Eichmann, who had organized the logistics of the Holocaust, was not a frothing fanatic. He was a bureaucrat — a man who followed orders, filled out forms, and organized train schedules. This is perhaps the most disturbing lesson: genocide was carried out not mainly by sadists but by ordinary people who followed the rules, looked the other way, and prioritized their own comfort and safety over the lives of others." },
];

const HOLOCAUST_TIMELINE: TimelineEntry[] = [
  { year: '1933–1938', title: 'Legal Discrimination', description: "Jews are progressively excluded from German life through hundreds of laws: banned from the civil service, universities, professions. Jewish businesses boycotted, then Aryanized (stolen). Jews stripped of citizenship. Roughly half of Germany's 525,000 Jews emigrate. But as persecution intensifies across Europe, fewer countries will accept them.", color: WARNING_AMBER },
  { year: '1939–1941', title: 'Ghettoization', description: "As Germany conquers Poland and much of Europe, millions of Jews come under Nazi control. Jews are forced into overcrowded ghettos — the Warsaw Ghetto held 400,000 people in 1.3 square miles. Conditions are deliberately lethal: starvation rations, rampant disease, no medical care. Tens of thousands die.", color: CRIMSON },
  { year: '1941', title: 'Mass Shootings — The Holocaust by Bullets', description: "Following the invasion of the Soviet Union in June 1941, mobile killing units (Einsatzgruppen) follow behind the advancing army. At Babi Yar, outside Kyiv, 33,771 Jews were shot in two days (September 29–30, 1941). By the end of 1941, approximately 1 million Jews had been murdered. The shootings proved psychologically damaging even to the perpetrators — the regime needed a more \"efficient\" method.", color: BLOOD_RED },
  { year: 'January 20, 1942', title: 'The Wannsee Conference', description: "In a villa on the shore of Lake Wannsee in suburban Berlin, fifteen senior Nazi bureaucrats met over lunch to coordinate the \"Final Solution to the Jewish Question.\" Chaired by Reinhard Heydrich, the meeting lasted approximately 90 minutes. They discussed logistics: how to identify, transport, and kill every Jew in Europe — 11 million people by their count. The tone was businesslike. The industrialization of murder had been planned over sandwiches.", color: NAZI_BLACK },
  { year: '1942–1945', title: 'The Death Camps', description: "Six extermination camps were built in occupied Poland: Auschwitz-Birkenau, Treblinka, Sobibor, Belzec, Chelmno, and Majdanek. At Auschwitz alone, approximately 1.1 million people were murdered. Six million Jews were killed — two-thirds of all Jews in Europe. In addition, 5–6 million others were murdered: Roma and Sinti, disabled people, Soviet prisoners of war, political prisoners, Jehovah's Witnesses, and LGBTQ people.", color: BLOOD_RED },
];

const WAR_INSIGHTS: InsightEntry[] = [
  { label: 'The War in Brief', detail: "Hitler's war began with the invasion of Poland (September 1, 1939) and ended with Germany's unconditional surrender (May 8, 1945). The war killed approximately 70–85 million people — roughly 3% of the world's population. The full story is told on the WWII page." },
  { label: "Hitler's End", detail: "As Soviet forces fought into Berlin in April 1945, Hitler retreated to his underground bunker. Increasingly delusional, he ordered nonexistent armies into battle. On April 30, 1945, he married Eva Braun, then they both committed suicide. Their bodies were burned per his instructions. He was 56 years old. The \"Thousand-Year Reich\" had lasted 12 years and 3 months." },
  { label: 'The Nuremberg Trials (1945–1946)', detail: "For the first time in history, leaders of a defeated nation were put on trial for crimes against humanity. Twenty-two major Nazi leaders were tried. Twelve were sentenced to death, seven to prison. The trials established crucial precedents: that \"following orders\" is not a defense, that individuals bear responsibility for crimes committed on behalf of a state, and that there exist crimes so heinous that all of humanity has standing to prosecute them." },
];

const LESSONS_INSIGHTS: InsightEntry[] = [
  { label: 'The "It Can\'t Happen Here" Fallacy', detail: "This is the single most important lesson: it happened in one of the most educated, culturally sophisticated nations on Earth. Germany in 1932 had a 99% literacy rate, the best universities in the world, and scientists who dominated the Nobel Prizes. Education does not inoculate against fascism. Culture does not prevent genocide. The belief that \"we're too civilized for that\" is itself a form of the complacency that allows it to happen." },
  { label: 'The Conditions That Enabled It', detail: "No single factor caused the rise of Nazism — it was a convergence: (1) Economic crisis that destroyed livelihoods. (2) National humiliation. (3) A demagogue who offered simple answers and scapegoats. (4) Weak democratic institutions that could be legally subverted. (5) Conservative elites who thought they could use the extremist. (6) A population willing to trade freedom for security. (7) A culture of antisemitism that made scapegoating plausible. None alone was sufficient. Together, they were catastrophic." },
  { label: 'The Warning Signs', detail: "Scholars of fascism have identified consistent warning signs: attacks on press freedom and the creation of an alternative \"truth.\" Demonization of minorities as existential threats. Undermining of courts, elections, and democratic institutions. Cult of personality around a single leader. Glorification of violence and \"strength.\" Nostalgia for a mythic past greatness. Contempt for expertise. Blurring of the line between party and state. Normalization of the previously unacceptable. Each alone is concerning. In combination, they constitute a pattern that history has taught us to recognize." },
  { label: "Germany's Memory Culture: A Model for Accountability", detail: "Modern Germany has made the Holocaust central to its national identity — not to flagellate itself, but to ensure it never happens again. The concept is Vergangenheitsbewältigung — \"coming to terms with the past.\" Holocaust education is mandatory in all German schools. Memorials are everywhere: the Memorial to the Murdered Jews of Europe in Berlin, Stolpersteine (brass plaques at the last freely chosen homes of victims — over 75,000 across Europe). Denying the Holocaust is a criminal offense. It is a model for how nations can confront their worst chapters." },
  { label: "The Contrast: Nations That Haven't Reckoned", detail: "Germany's approach stands in contrast to Japan, which has never fully acknowledged the scope of its WWII atrocities — the Nanjing Massacre, comfort women, biological warfare, slave labor. Japanese textbooks have historically minimized these events. The difference matters: Germany's reckoning has made it a trusted partner in Europe; Japan's evasion has left wounds unhealed across East Asia. How a nation remembers its past shapes its future." },
  { label: 'The Ongoing Relevance', detail: "The rise of Nazism is a case study in how democracies die. Political scientists who study democratic backsliding consistently return to the Weimar precedent. The mechanisms are transferable: economic anxiety exploited by demagogues, institutional guardrails eroded from within, the normalization of extremism, the failure of moderates to unite against authoritarian threats. The specific ideology may change, but the structural dynamics are recognizable. This history does not predict the future, but it illuminates the dangers." },
];

function InsightGrid({ items }: { items: InsightEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: i * 0.06 }} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
          <h4 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 8, fontSize: '1.05rem' }}>{item.label}</h4>
          <p style={{ color: ASH, lineHeight: 1.8, fontSize: '0.92rem' }}>{item.detail}</p>
        </motion.div>
      ))}
    </div>
  );
}

function TimelineCard({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {entries.map((e, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: i * 0.07 }} style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 20, paddingTop: 4, paddingBottom: 4 }}>
          <p style={{ color: e.color, fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{e.year}</p>
          <h4 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1.05rem', marginBottom: 6 }}>{e.title}</h4>
          <p style={{ color: ASH, lineHeight: 1.8, fontSize: '0.92rem' }}>{e.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function VoteChart() {
  const maxPct = 45;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }} style={{ padding: '24px 0 8px' }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 6 }}>Nazi Vote Share in Reichstag Elections</h3>
      <p style={{ color: SLATE, fontSize: '0.85rem', marginBottom: 18 }}>From irrelevant fringe party to largest party in Germany in four years</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VOTE_DATA.map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 3 }}>
              <span style={{ color: ASH, fontSize: '0.8rem', width: 70, flexShrink: 0, textAlign: 'right' }}>{d.year}</span>
              <div style={{ flex: 1, position: 'relative', height: 24 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(d.pct / maxPct) * 100}%`, backgroundColor: d.pct >= 37 ? BLOOD_RED : d.pct >= 18 ? CRIMSON : IRON_GRAY, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
                  <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>{d.pct}%</span>
                </div>
              </div>
              <span style={{ color: SLATE, fontSize: '0.72rem', width: 55, flexShrink: 0 }}>{d.seats} seats</span>
            </div>
            <div style={{ display: 'flex', paddingLeft: 82 }}>
              <span style={{ color: SLATE, fontSize: '0.72rem', fontStyle: 'italic' }}>{d.context}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SectionWrapper({ id, icon, title, accentColor, intro, children }: { id: string; icon: string; title: string; accentColor: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: '48px 0', borderTop: `1px solid ${accentColor}33` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: accentColor, marginBottom: 12 }}>{icon} {title}</h2>
        <p style={{ color: ASH, lineHeight: 1.7, maxWidth: 800, marginBottom: 28 }}>{intro}</p>
        {children}
      </motion.div>
    </section>
  );
}

export default function RiseOfNazismPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    if (root) root.style.overflow = 'auto';
    return () => { html.style.overflow = ''; body.style.overflow = ''; if (root) root.style.overflow = ''; };
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070e22', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ paddingTop: 28 }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>← Back to Timeline</Link>
        </div>

        <header style={{ paddingTop: 40, paddingBottom: 32 }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, background: `linear-gradient(135deg, ${IRON_GRAY}, ${ASH})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            How It Happened — The Rise of Nazism and the Failure of Democracy (1919–1945)
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: ASH, lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 800, marginBottom: 16 }}>
              In the world's most educated nation — 99% literacy, home to Einstein, Planck, Beethoven, and Goethe — democracy collapsed in six weeks. A failed artist became the most destructive dictator in history. Twelve years of his rule left 70 million dead, a continent in ruins, and 6 million Jews murdered in the most systematic genocide ever committed. This is the story of how it happened — not because Germans were uniquely evil, but because the conditions that created it can arise anywhere.
            </p>
            <p style={{ color: SLATE, lineHeight: 1.7, fontSize: '0.95rem', maxWidth: 800 }}>
              This is one of the most important historical lessons humanity has. Not what the Nazis did — but how a modern, civilized society allowed it. The mechanisms of democratic failure, the psychology of complicity, and the warning signs that went unheeded are not relics of the past. They are patterns that recur. Understanding them is not an academic exercise — it is a civic responsibility.
            </p>
          </motion.div>
        </header>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }} style={{ backgroundColor: 'rgba(153, 27, 27, 0.08)', border: `1px solid ${BLOOD_RED}44`, borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <p style={{ color: MEMORIAL_WHITE, fontSize: '1.15rem', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.6, textAlign: 'center' }}>"Those who can make you believe absurdities can make you commit atrocities."</p>
          <p style={{ color: SLATE, fontSize: '0.85rem', textAlign: 'center', marginTop: 8 }}>— Voltaire (1765)</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 8 }}>
          {KEY_STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.35, delay: i * 0.06 }} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}33`, borderRadius: 10, padding: 16, textAlign: 'center' }}>
              <p style={{ color: s.color, fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>{s.stat}</p>
              <p style={{ color: ASH, fontSize: '0.78rem', lineHeight: 1.5 }}>{s.context}</p>
            </motion.div>
          ))}
        </div>

        <SectionWrapper id="weimar" icon="🏚️" title="Germany After WWI — The Perfect Storm" accentColor={WEIMAR_GOLD} intro="To understand how Nazism rose, you must understand what it rose from. Germany after World War I was a nation humiliated by defeat, burdened by impossible reparations, betrayed (as millions believed) by its own leaders, and governed by a democracy that had never earned the trust of its people. When the Great Depression struck in 1929, it was the final blow to a society already fractured by trauma.">
          <InsightGrid items={WEIMAR_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="hitler" icon="👤" title="Adolf Hitler — Who He Was" accentColor={IRON_GRAY} intro="Hitler was not a supervillain or a madman — and understanding him that way makes us less safe, not more. He was a mediocre man with a dangerous talent for public speaking, an absolute conviction in his own destiny, and a capacity for hatred that he elevated into an ideology. Understanding who he was, and how unremarkable his origins were, is essential to understanding how it happened.">
          <InsightGrid items={HITLER_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="ideology" icon="📕" title="Mein Kampf and the Nazi Ideology" accentColor={BLOOD_RED} intro="Nazi ideology was not a coherent philosophy — it was a toxic brew of racial pseudoscience, conspiracy theory, militarism, and resentment, wrapped in the language of national destiny. Its central text, Mein Kampf ('My Struggle'), laid out virtually everything Hitler would later do. Almost no one believed he meant it.">
          <InsightGrid items={IDEOLOGY_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="rise" icon="📈" title="The Nazi Rise to Power (1929–1933)" accentColor={CRIMSON} intro="The Nazis did not seize power in a coup. They rose through democratic elections, exploiting economic despair, political fragmentation, and the fatal miscalculation of conservative elites who believed they could control Hitler. In four years, they went from 2.6% of the vote to the chancellorship.">
          <VoteChart />
          <div style={{ height: 24 }} />
          <InsightGrid items={RISE_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="democracy-dies" icon="⚖️" title="How Democracy Died Legally — Six Weeks from Chancellor to Dictator" accentColor={WARNING_AMBER} intro="This is the section that should disturb you most. Hitler did not overthrow the Weimar Republic in a violent revolution. He dismantled it using its own legal mechanisms — emergency decrees, parliamentary votes, and a constitution that trusted its leaders to act in good faith. Democracy ended not with a bang but with a vote. In six weeks.">
          <TimelineCard entries={DEMOCRACY_DIES_TIMELINE} />
        </SectionWrapper>

        <SectionWrapper id="third-reich" icon="🏛️" title="The Third Reich — How It Worked" accentColor={NAZI_BLACK} intro="Once Hitler had legal dictatorial power, the transformation of Germany was rapid and total. Every institution — schools, courts, media, unions, churches, professional associations — was either absorbed into the Nazi state or destroyed. The process was called Gleichschaltung: 'coordination.' Within two years, there was no independent space left in German society.">
          <InsightGrid items={THIRD_REICH_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="support" icon="🤔" title="Why Did Ordinary Germans Support It?" accentColor={ASH_BROWN} intro="This is the question that haunts the history. Germany was not a nation of monsters. Most Germans were ordinary people — parents, workers, teachers, shopkeepers — who lived through extraordinary circumstances. Understanding why they supported, tolerated, or failed to resist the Nazi regime is not an exercise in assigning guilt. It is an exercise in understanding human nature under pressure — because the same pressures can arise again, anywhere.">
          <InsightGrid items={SUPPORT_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="holocaust-path" icon="🕯️" title="From Persecution to Holocaust" accentColor={BLOOD_RED} intro="The Holocaust did not begin with gas chambers. It began with words — with the dehumanization of a people, the stripping of rights, the segregation from society. The escalation from discrimination to genocide took nine years, proceeding through stages that, at each point, made the next step seem like a logical extension of what had already been accepted.">
          <TimelineCard entries={HOLOCAUST_TIMELINE} />
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }} style={{ backgroundColor: 'rgba(153, 27, 27, 0.08)', border: `1px solid ${BLOOD_RED}33`, borderRadius: 10, padding: 20, marginTop: 24, textAlign: 'center' }}>
            <p style={{ color: MEMORIAL_WHITE, fontSize: '0.95rem', marginBottom: 8 }}>The full story of the Holocaust — the camps, the victims, the resistance, and the world that failed to act — is told on its own dedicated page.</p>
            <Link to="/holocaust" style={{ color: MEMORIAL_WHITE, textDecoration: 'none', fontSize: '1rem', fontWeight: 700, padding: '8px 20px', borderRadius: 8, border: `1px solid ${MEMORIAL_WHITE}44`, display: 'inline-block' }}>The Holocaust →</Link>
          </motion.div>
        </SectionWrapper>

        <SectionWrapper id="war-defeat" icon="💥" title="The War and Defeat" accentColor={INDIGO} intro="Hitler's war of conquest, which he had outlined in Mein Kampf, engulfed the entire world. It ended with Germany in ruins, Europe shattered, and a new international order determined to ensure it could never happen again.">
          <InsightGrid items={WAR_INSIGHTS} />
        </SectionWrapper>

        <SectionWrapper id="lessons" icon="🔔" title="Lessons and Legacy — Why This History Matters Now" accentColor={TEAL} intro="The rise of Nazism is not a story about uniquely German evil. It is a story about what happens when economic crisis meets national humiliation, when demagogues exploit democratic freedoms to destroy democracy, when institutions fail, when elites miscalculate, and when ordinary people decide that looking away is easier than standing up. These conditions are not unique to 1930s Germany. They are universal human vulnerabilities.">
          <InsightGrid items={LESSONS_INSIGHTS} />
        </SectionWrapper>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }} style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginTop: 16 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>Continue the Story</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { to: '/holocaust', label: 'The Holocaust' },
              { to: '/wwii', label: 'World War II' },
              { to: '/great-depression', label: 'The Great Depression' },
              { to: '/decolonization', label: 'Decolonization' },
            ].map((link) => (
              <Link key={link.to} to={link.to} style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(96,165,250,0.25)' }}>{link.label} →</Link>
            ))}
          </div>
        </motion.div>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px 0 48px', marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: SLATE, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 12px', fontStyle: 'italic' }}>
            "First they came for the socialists, and I did not speak out — because I was not a socialist. Then they came for the trade unionists, and I did not speak out — because I was not a trade unionist. Then they came for the Jews, and I did not speak out — because I was not a Jew. Then they came for me — and there was no one left to speak for me."
          </p>
          <p style={{ color: SLATE, fontSize: '0.8rem', marginBottom: 20 }}>— Pastor Martin Niemöller (1946)</p>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.95rem' }}>← Back to Timeline</Link>
        </footer>
      </div>
    </div>
  );
}
