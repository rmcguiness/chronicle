import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ───────── Theme ───────── */
const ACCENT = '#6b2737';     // Deep maroon — blood and sacrifice
const BG = '#0a0c10';
const TEXT = '#e8e4de';
const TEXT_DIM = '#9a9486';
const TEXT_MUTED = '#6b6458';
const CARD_BG = 'rgba(107,39,55,0.05)';
const CARD_BORDER = 'rgba(107,39,55,0.18)';
const MAROON = '#6b2737';      // Movement's sacrifice
const GOLD = '#c9a84c';        // Hope and triumph
const TEAL = '#1a8a7d';        // Legal strategy
const NAVY = '#0d3b66';        // Federal government
const FLAME = '#c2452d';       // Resistance and violence
const BRONZE = '#8d6e63';      // Steadfast endurance
const OLIVE = '#6b8e23';       // Grassroots organizing
const PURPLE = '#6a4c93';      // Women's leadership
const SLATE = '#4a6274';       // Opposition / COINTELPRO
const AMBER = '#d4920b';       // Economic strategies

/* ───────── Types ───────── */
type SectionTab =
  | 'overview'
  | 'precursors'
  | 'timeline'
  | 'figures'
  | 'strategies'
  | 'women'
  | 'malcolmx'
  | 'government'
  | 'opposition'
  | 'legislation'
  | 'unfinished'
  | 'legacy';

interface Figure {
  name: string;
  dates: string;
  role: string;
  contribution: string;
  detail: string;
  icon: string;
  color: string;
}

interface TimelineYear {
  year: string;
  events: { title: string; detail: string; color: string }[];
}

/* ───────── Data ───────── */

const OVERVIEW_TEXT = 'The American Civil Rights Movement was a decades-long struggle by Black Americans and their allies to dismantle the legal and social architecture of white supremacy that had defined life in the United States since its founding. While the movement\'s most dramatic years spanned 1954 to 1968, its roots stretched back to slavery, Reconstruction, and the broken promises that followed. Through boycotts, sit-ins, marches, legal challenges, voter registration drives, and sheer moral courage in the face of beatings, bombings, and murder, the movement forced the most powerful nation on earth to confront the gap between its stated ideals and its brutal reality. It produced some of the most extraordinary leaders in American history, transformed the nation\'s laws and conscience, and created a template for liberation movements around the world.';

const CONTEXT = {
  jimCrow: 'After the Civil War (1861–65) and Reconstruction (1865–77), Southern states systematically dismantled the rights of Black citizens through "Jim Crow" laws — a web of statutes mandating racial segregation in every aspect of public life: schools, hospitals, buses, trains, restaurants, water fountains, restrooms, parks, cemeteries, and courtrooms. The Supreme Court\'s 1896 Plessy v. Ferguson decision blessed this system as "separate but equal," though the separation was absolute and the equality was a fiction. Black schools received a fraction of white school funding. Black neighborhoods were denied city services. Black workers were confined to the lowest-paying jobs.',
  violence: 'Jim Crow was enforced not just by law but by terror. Between 1877 and 1950, more than 4,400 Black Americans were lynched — hanged, shot, burned alive, or tortured to death — often as public spectacles attended by white families. Lynchings required no crime; looking at a white woman, asking for fair wages, or simply being "uppity" could be a death sentence. Local law enforcement participated in or ignored this violence. The message was clear: any Black person who challenged the racial order risked their life.',
  system: 'The system was comprehensive and self-reinforcing. Poll taxes, literacy tests, grandfather clauses, and outright intimidation kept Black citizens from voting. Without the vote, they couldn\'t change the laws. Without legal power, they couldn\'t challenge segregation. Without access to equal education and economic opportunity, they couldn\'t build the resources to fight back. Breaking this cycle would require courage, organization, and strategy on a scale rarely seen in American history.',
};

const PRECURSORS = {
  reconstruction: 'During Reconstruction (1865–1877), the 13th, 14th, and 15th Amendments abolished slavery, guaranteed equal protection, and granted Black men the right to vote. For a brief, extraordinary moment, Black Americans served in Congress, held state offices, built schools, and began to build lives as free citizens. Then it was destroyed. The Compromise of 1877, which resolved the disputed presidential election, effectively handed the South back to white supremacists. Federal troops withdrew. "Redeemer" governments rolled back every gain. The promise of Reconstruction became the cruelest betrayal in American history.',
  migration: 'The Great Migration (1910–1940s, and a second wave through the 1970s) saw approximately 6 million Black Americans leave the Jim Crow South for cities in the North, Midwest, and West — Chicago, Detroit, New York, Los Angeles, Philadelphia. They fled racial terror and economic exploitation for factory jobs and (somewhat) less oppressive conditions. This massive demographic shift created large, concentrated Black communities with their own churches, newspapers, businesses, and political organizations — the institutional infrastructure that would power the Civil Rights Movement.',
  wwii: 'World War II was a turning point. Over one million Black Americans served in the military, fighting fascism abroad while enduring segregation at home. The hypocrisy was unbearable and radicalizing. The "Double V" campaign — victory against fascism abroad, victory against racism at home — crystallized the contradiction. Black veterans returned home expecting the freedom they\'d fought for, only to face the same Jim Crow system. Many became leaders in the emerging civil rights movement. Executive Order 9981 (1948) desegregated the military, proving that integration could work — and that change required pressure.',
  harlem: 'The Harlem Renaissance (1920s–30s) — a flowering of Black art, literature, music, and intellectual life centered in New York — created a new Black cultural identity that challenged white supremacist narratives. Writers like Langston Hughes, Zora Neale Hurston, and James Weldon Johnson; musicians like Duke Ellington and Louis Armstrong; thinkers like W.E.B. Du Bois and Alain Locke — they articulated a vision of Black excellence, dignity, and creative genius that undermined the intellectual foundations of racism. The Renaissance created the cultural confidence that would fuel the movement.',
};

const TIMELINE_YEARS: TimelineYear[] = [
  {
    year: '1954',
    events: [
      { title: 'Brown v. Board of Education (May 17)', detail: 'The Supreme Court, led by Chief Justice Earl Warren, unanimously ruled that racial segregation in public schools was unconstitutional, overturning the "separate but equal" doctrine of Plessy v. Ferguson (1896). Thurgood Marshall and the NAACP Legal Defense Fund argued the case, presenting evidence that segregation itself caused psychological harm to Black children. The decision was a legal earthquake — but implementation would be slow, violent, and fiercely resisted. The Court\'s 1955 follow-up order called for desegregation "with all deliberate speed," which Southern states interpreted as permission to delay indefinitely.', color: TEAL },
    ],
  },
  {
    year: '1955',
    events: [
      { title: 'Murder of Emmett Till (August 28)', detail: 'Emmett Till, a 14-year-old Black boy from Chicago visiting relatives in Money, Mississippi, was kidnapped, brutally beaten, shot, and dumped in the Tallahatchie River for allegedly whistling at a white woman (Carolyn Bryant, who decades later admitted she fabricated her testimony). His mother, Mamie Till-Mobley, insisted on an open casket funeral so the world could see what had been done to her son. Jet magazine published the photographs. The images shocked the nation and the world. Till\'s murderers, Roy Bryant and J.W. Milam, were acquitted by an all-white jury in 67 minutes — one juror said it wouldn\'t have taken that long if they hadn\'t stopped for a soda. They later confessed to a journalist, protected by double jeopardy.', color: FLAME },
      { title: 'Montgomery Bus Boycott (December 1, 1955 – December 20, 1956)', detail: 'Rosa Parks, a 42-year-old seamstress and trained NAACP activist (not simply a tired woman who refused to move, as the myth suggests), was arrested for refusing to give up her bus seat to a white man. The Black community of Montgomery, organized by the Women\'s Political Council (led by Jo Ann Robinson) and a young pastor named Martin Luther King Jr., launched a boycott of the city\'s buses that lasted 381 days. Black residents carpooled, walked miles to work, and endured bombings and arrests. The boycott cost the bus company 65% of its revenue. In November 1956, the Supreme Court ruled bus segregation unconstitutional. King emerged as a national leader. The movement had found its strategy: nonviolent economic pressure.', color: GOLD },
    ],
  },
  {
    year: '1957',
    events: [
      { title: 'Little Rock Nine (September)', detail: 'Nine Black students — Minnijean Brown, Elizabeth Eckford, Ernest Green, Thelma Mothershed, Melba Pattillo, Gloria Ray, Terrence Roberts, Jefferson Thomas, and Carlotta Walls — attempted to integrate Central High School in Little Rock, Arkansas. Governor Orval Faubus deployed the Arkansas National Guard to block them. A white mob of over 1,000 surrounded the school, screaming threats. President Eisenhower, reluctantly, sent the 101st Airborne Division to escort the students inside. For the entire school year, the Nine endured daily harassment, physical attacks, and death threats. Ernest Green became the first Black graduate of Central High. Faubus then closed all Little Rock public schools for a year rather than integrate them.', color: NAVY },
    ],
  },
  {
    year: '1960',
    events: [
      { title: 'Greensboro Sit-Ins (February 1)', detail: 'Four Black college freshmen — Ezell Blair Jr. (Jibreel Khazan), Franklin McCain, Joseph McNeil, and David Richmond — sat down at a whites-only Woolworth\'s lunch counter in Greensboro, North Carolina, and refused to leave when denied service. Within days, the protest grew to hundreds of students. Within weeks, sit-ins spread to more than 50 cities across the South. The tactic was brilliantly simple: sit quietly, dress well, be polite, and let the violence of segregation reveal itself. Television cameras showed well-dressed Black students being beaten, having food poured on them, and being dragged away by police while sitting peacefully. The moral clarity was devastating.', color: OLIVE },
      { title: 'SNCC Founded (April)', detail: 'The Student Nonviolent Coordinating Committee (SNCC, pronounced "snick") was founded at Shaw University in Raleigh, North Carolina, with guidance from veteran organizer Ella Baker. SNCC became the movement\'s shock troops — young, fearless, and willing to go where others wouldn\'t. They organized sit-ins, Freedom Rides, and voter registration drives in the most dangerous parts of the Deep South. SNCC members were beaten, jailed, and killed. Leaders included John Lewis, Diane Nash, Bob Moses, Stokely Carmichael, and Fannie Lou Hamer. Baker insisted on a decentralized, democratic structure — leadership from the bottom up, not top down.', color: OLIVE },
    ],
  },
  {
    year: '1961',
    events: [
      { title: 'Freedom Riders (May–December)', detail: 'Interracial groups of activists boarded Greyhound and Trailways buses to test the Supreme Court\'s ruling that segregation in interstate travel was unconstitutional. In Anniston, Alabama, a mob firebombed one bus and beat the riders who escaped. In Birmingham, riders were brutally attacked while police deliberately stayed away (an arrangement with the KKK). In Montgomery, riders were beaten with baseball bats and iron pipes. Attorney General Robert Kennedy eventually sent federal marshals and pressured the Interstate Commerce Commission to enforce desegregation of all interstate travel facilities. The Freedom Rides showed that federal law meant nothing without federal enforcement — and that the movement could force the federal government\'s hand.', color: FLAME },
    ],
  },
  {
    year: '1962',
    events: [
      { title: 'James Meredith Integrates Ole Miss (September–October)', detail: 'James Meredith, a Black Air Force veteran, won a federal court order to enroll at the University of Mississippi. Governor Ross Barnett personally blocked his entry. When federal marshals escorted Meredith to campus, a white riot erupted: 2 people were killed, 375 injured (including 166 marshals), and President Kennedy deployed 30,000 federal troops to restore order. Meredith attended classes surrounded by armed guards for the entire year. He graduated in August 1963, demonstrating that the federal government could — when forced — overcome state resistance to integration.', color: NAVY },
    ],
  },
  {
    year: '1963',
    events: [
      { title: 'Birmingham Campaign (April–May)', detail: 'Martin Luther King Jr. and the SCLC targeted Birmingham, Alabama — considered the most segregated city in America — for a campaign of boycotts, sit-ins, and marches. Public Safety Commissioner Bull Connor responded with fire hoses powerful enough to rip bark off trees and police dogs that attacked demonstrators, including children. Television broadcast these images worldwide. King was arrested and wrote his famous "Letter from Birmingham Jail," a masterpiece of moral argument defending direct action and answering white moderates who urged patience. The campaign forced Birmingham\'s business leaders to negotiate desegregation and pushed President Kennedy to propose comprehensive civil rights legislation.', color: MAROON },
      { title: 'March on Washington (August 28)', detail: 'Over 250,000 people gathered at the Lincoln Memorial for the March on Washington for Jobs and Freedom — the largest demonstration in American history at that time. The march was organized by A. Philip Randolph and Bayard Rustin (a gay Black man whose indispensable role was downplayed due to homophobia). Martin Luther King Jr. delivered his "I Have a Dream" speech, which became the defining oratory of the movement and one of the greatest speeches in the English language. The march demonstrated the movement\'s massive, interracial support and put enormous pressure on Congress to pass civil rights legislation.', color: GOLD },
      { title: '16th Street Baptist Church Bombing (September 15)', detail: 'Four young girls — Addie Mae Collins (14), Cynthia Wesley (14), Carole Robertson (14), and Carol Denise McNair (11) — were killed when KKK members bombed the 16th Street Baptist Church in Birmingham during Sunday school. Twenty-two others were injured. The church had been a staging area for the Birmingham campaign. The bombing was an act of monstrous retaliation against the movement\'s success. It took decades to bring the murderers to justice: Robert Chambliss was convicted in 1977, Thomas Blanton in 2001, and Bobby Cherry in 2002.', color: FLAME },
      { title: 'Medgar Evers Assassinated (June 12)', detail: 'Medgar Evers, NAACP field secretary in Mississippi and a fearless organizer for voter registration and desegregation, was shot in the back in his driveway by white supremacist Byron De La Beckwith. Two all-white juries failed to convict De La Beckwith in the 1960s. He was finally convicted in 1994, more than 30 years later, after new evidence and testimony emerged. Evers became a martyr of the movement.', color: MAROON },
      { title: 'JFK Assassination (November 22)', detail: 'President Kennedy\'s assassination in Dallas created enormous uncertainty for the civil rights movement. Kennedy had finally proposed comprehensive civil rights legislation in June 1963, but it was stalled in Congress. His successor, Lyndon B. Johnson — a Southerner with a complicated racial history — would prove to be the most consequential presidential ally the movement ever had.', color: NAVY },
    ],
  },
  {
    year: '1964',
    events: [
      { title: 'Civil Rights Act Signed (July 2)', detail: 'President Johnson used every ounce of his legendary legislative skill — plus the moral weight of Kennedy\'s assassination — to push the Civil Rights Act through Congress, breaking a 75-day Senate filibuster by Southern Democrats. The Act banned discrimination based on race, color, religion, sex, or national origin in employment and public accommodations. It was the most significant civil rights legislation since Reconstruction. Title VII created the Equal Employment Opportunity Commission. Title II desegregated restaurants, hotels, theaters, and all public facilities. The legal architecture of Jim Crow was demolished.', color: TEAL },
      { title: 'Freedom Summer (June–August)', detail: 'SNCC and CORE organized Freedom Summer, bringing nearly 1,000 mostly white volunteers to Mississippi to register Black voters, set up Freedom Schools, and build the Mississippi Freedom Democratic Party (MFDP). The goal was strategic: by bringing white college students into the most dangerous part of the South, the movement ensured that violence against civil rights workers would finally receive national attention. It worked — but at a terrible cost.', color: OLIVE },
      { title: 'Murders of Chaney, Goodman, and Schwerner (June 21)', detail: 'James Chaney (Black, from Mississippi), Andrew Goodman (white, from New York), and Michael Schwerner (white, from New York) — three civil rights workers — were arrested by Neshoba County Deputy Sheriff Cecil Price, released from jail at night, and handed over to a KKK mob. They were beaten and shot. Their bodies were found buried in an earthen dam 44 days later. The FBI investigation ("Mississippi Burning") led to federal conspiracy convictions for 7 of 18 defendants. No one was convicted of murder until 2005, when Edgar Ray Killen was found guilty of manslaughter at age 80.', color: FLAME },
    ],
  },
  {
    year: '1965',
    events: [
      { title: 'Bloody Sunday — Selma to Montgomery (March 7)', detail: 'Six hundred marchers set out from Selma, Alabama, toward the state capital in Montgomery to demand voting rights. At the Edmund Pettus Bridge, state troopers and county posse men attacked the marchers with tear gas, billy clubs, and bullwhips. John Lewis, leading the march, had his skull fractured. Amelia Boynton Robinson was beaten unconscious. Television cameras broadcast the violence into American living rooms during prime time. The nation was horrified. Two weeks later, protected by federal troops, 25,000 marchers completed the Selma to Montgomery march. The violence at Selma directly catalyzed the Voting Rights Act.', color: MAROON },
      { title: 'Voting Rights Act Signed (August 6)', detail: 'The Voting Rights Act was the most effective piece of civil rights legislation ever passed. It banned literacy tests, provided for federal registrars in counties with histories of voter suppression, and required states with discriminatory histories to get federal approval before changing voting laws (Section 5 "preclearance"). The results were immediate and dramatic: Black voter registration in Mississippi jumped from 6.7% to 59.8% within a few years. Across the South, Black citizens voted in meaningful numbers for the first time since Reconstruction. The Act transformed Southern politics and, eventually, American politics as a whole.', color: TEAL },
      { title: 'Watts Rebellion (August 11–17)', detail: 'Six days after the Voting Rights Act was signed, the Watts neighborhood of Los Angeles erupted in six days of uprising following a confrontation between a Black motorist and white police officers. Thirty-four people were killed, over 1,000 injured, and $40 million in property destroyed. Watts exposed the limits of the Southern-focused civil rights strategy: Northern and Western Black communities faced not Jim Crow laws but de facto segregation, police brutality, poverty, unemployment, and housing discrimination. Legal equality meant little without economic equality. The movement was entering a new, more complex phase.', color: FLAME },
    ],
  },
  {
    year: '1966',
    events: [
      { title: 'Black Power Movement Emerges (June)', detail: 'During the March Against Fear in Mississippi (started by James Meredith after he was shot), Stokely Carmichael of SNCC electrified the crowd with the chant "Black Power!" The phrase became a lightning rod. For some, it meant Black political and economic self-determination, cultural pride, and community control. For others, it signaled a break with nonviolence and interracial coalition. The movement was evolving: younger activists were frustrated by the pace of change and the expectation that Black people should remain nonviolent while white supremacists killed with impunity. Black Power represented both a philosophical shift and an emotional release.', color: MAROON },
      { title: 'Black Panther Party Founded (October)', detail: 'Huey Newton and Bobby Seale founded the Black Panther Party for Self-Defense in Oakland, California. The Panthers combined revolutionary rhetoric with practical community programs: free breakfast for children, health clinics, education programs, and armed patrols monitoring police in Black neighborhoods (legal under California law at the time). The Panthers became the most visible symbol of the Black Power movement and a primary target of FBI COINTELPRO operations. Their Ten-Point Program demanded employment, housing, education, an end to police brutality, and self-determination for Black communities.', color: SLATE },
    ],
  },
  {
    year: '1967',
    events: [
      { title: 'Major Urban Uprisings (Summer)', detail: 'The "Long Hot Summer" of 1967 saw major uprisings in Detroit (43 killed, 7,200 arrested, 2,000 buildings destroyed) and Newark (26 killed), along with disturbances in over 150 cities. The uprisings were triggered by police brutality but fueled by decades of discrimination in housing, employment, and education. President Johnson appointed the Kerner Commission to investigate. Its 1968 report famously concluded: "Our nation is moving toward two societies, one black, one white — separate and unequal." It called for massive investment in housing, education, and employment. Its recommendations were largely ignored.', color: FLAME },
    ],
  },
  {
    year: '1968',
    events: [
      { title: 'Assassination of Martin Luther King Jr. (April 4)', detail: 'Martin Luther King Jr. was shot and killed by James Earl Ray on the balcony of the Lorraine Motel in Memphis, Tennessee. King had come to Memphis to support a sanitation workers\' strike — part of his evolving focus on economic justice and his planned Poor People\'s Campaign. He was 39 years old. His assassination triggered uprisings in over 100 cities. Entire neighborhoods burned. The nation\'s most eloquent voice for nonviolence and justice was silenced at the moment he was expanding his vision to challenge poverty and the Vietnam War — issues that threatened far more powerful interests than Southern segregation.', color: MAROON },
      { title: 'Fair Housing Act Signed (April 11)', detail: 'One week after King\'s assassination, Congress passed the Fair Housing Act (Title VIII of the Civil Rights Act of 1968), banning discrimination in the sale, rental, and financing of housing. It was the last major legislative achievement of the civil rights era. The Act addressed a critical gap: legal desegregation of public facilities meant little if Black families couldn\'t live where they chose. However, enforcement was weak by design — a compromise necessary to pass the bill — and housing segregation remained deeply entrenched through discriminatory lending, steering, and zoning practices that persist today.', color: TEAL },
    ],
  },
];

const KEY_FIGURES: Figure[] = [
  { name: 'Martin Luther King Jr.', dates: '1929–1968', role: 'Moral leader of the movement', contribution: 'Philosophy of nonviolent resistance, oratorical genius', detail: 'A Baptist minister who became the most visible leader of the movement at 26 during the Montgomery Bus Boycott. King synthesized Gandhian nonviolence, Christian social gospel, and American democratic ideals into a moral framework that proved irresistible. His "Letter from Birmingham Jail" and "I Have a Dream" speech are among the most important documents in American history. He won the Nobel Peace Prize in 1964 at age 35. By 1967–68, he was expanding his vision to challenge poverty and the Vietnam War — issues that crossed racial lines and threatened the economic establishment. Assassinated in Memphis at 39.', icon: '✊', color: GOLD },
  { name: 'Rosa Parks', dates: '1913–2005', role: 'Catalyst of the Montgomery Bus Boycott', contribution: 'Strategic act of defiance that launched the movement\'s most visible phase', detail: 'Parks was not simply a "tired seamstress." She was a trained NAACP activist, secretary of the Montgomery chapter, who had attended the Highlander Folk School (a training center for civil rights organizers). Her refusal to give up her bus seat was a deliberate act of resistance, chosen because her character and composure made her an ideal plaintiff. Parks endured death threats and economic retaliation, lost her job, and eventually moved to Detroit. She remained active in civil rights for the rest of her life.', icon: '🚌', color: BRONZE },
  { name: 'John Lewis', dates: '1940–2020', role: 'SNCC chairman, "conscience of Congress"', contribution: 'Fearless direct action, lifelong commitment to justice', detail: 'The son of Alabama sharecroppers who became SNCC chairman at 23. Lewis was beaten on the Freedom Rides, arrested over 40 times, had his skull fractured on Bloody Sunday in Selma. He was the youngest speaker at the March on Washington. He served in the U.S. House of Representatives for 33 years (1987–2020), where he was known as the "conscience of Congress." He urged every generation to get into "good trouble, necessary trouble."', icon: '🌉', color: MAROON },
  { name: 'Thurgood Marshall', dates: '1908–1993', role: 'NAACP chief counsel, Supreme Court Justice', contribution: 'Legal architect who dismantled segregation through the courts', detail: 'Marshall argued 32 cases before the Supreme Court and won 29, including Brown v. Board of Education. As NAACP Legal Defense Fund director, he devised the long-term legal strategy that chipped away at "separate but equal" over two decades, building precedent case by case until the final blow in Brown. Appointed by LBJ as the first Black Supreme Court Justice in 1967, he served until 1991. His legal strategy proved that the Constitution, properly interpreted, was a weapon against racial oppression.', icon: '⚖️', color: TEAL },
  { name: 'Medgar Evers', dates: '1925–1963', role: 'NAACP field secretary, Mississippi', contribution: 'Fearless organizing in the most dangerous state', detail: 'A World War II veteran who returned to Mississippi determined to fight for the rights he\'d fought for overseas. As NAACP field secretary, Evers investigated the Emmett Till murder, organized boycotts, and led voter registration drives in the most dangerous state in America for Black activism. He lived under constant death threats. Assassinated in his driveway in June 1963 by Byron De La Beckwith — who wasn\'t convicted until 1994. Evers\' courage in Mississippi inspired the movement and his murder galvanized national support.', icon: '🎖️', color: MAROON },
  { name: 'Fannie Lou Hamer', dates: '1917–1977', role: 'SNCC organizer, MFDP leader', contribution: 'Voice of the grassroots, Mississippi voter registration', detail: 'A Mississippi sharecropper who was fired from her plantation job for trying to register to vote, then beaten savagely in a Winona, Mississippi, jail. Hamer became one of the movement\'s most powerful voices. Her testimony at the 1964 Democratic National Convention — describing the brutality she endured — was so powerful that President Johnson called a press conference to preempt it. She co-founded the Mississippi Freedom Democratic Party, which challenged the all-white Mississippi delegation. "I\'m sick and tired of being sick and tired" became her iconic declaration.', icon: '🗳️', color: PURPLE },
  { name: 'Malcolm X', dates: '1925–1965', role: 'Nation of Islam leader, then independent', contribution: 'Articulated Black anger, self-defense, and self-determination', detail: 'Born Malcolm Little, he converted to the Nation of Islam in prison and became its most electrifying spokesman, preaching Black pride, self-reliance, and self-defense in contrast to King\'s nonviolence and integration. After his 1964 break with the Nation of Islam and pilgrimage to Mecca, Malcolm\'s views evolved toward a more inclusive but still radical vision of human rights. He was assassinated in February 1965. His "Autobiography of Malcolm X" (with Alex Haley) remains one of the most influential American autobiographies. Malcolm and King are often portrayed as opposites, but they were complementary forces — Malcolm\'s militancy made King\'s moderation look more acceptable to white America.', icon: '🔥', color: FLAME },
  { name: 'Bayard Rustin', dates: '1912–1987', role: 'Strategist, organizer, pacifist', contribution: 'Organized the March on Washington, brought Gandhian nonviolence to the movement', detail: 'The brilliant strategist behind the March on Washington — organizing 250,000 people in just two months with meticulous logistical precision. Rustin introduced Martin Luther King Jr. to Gandhian nonviolence and was the intellectual architect of the movement\'s nonviolent direct action strategy. An openly gay Black man, Rustin was repeatedly sidelined by movement leaders who feared his sexuality would be used to discredit the cause. Despite this, he was indispensable — a pacifist, socialist, and organizational genius who worked behind the scenes to make the movement\'s greatest moments possible.', icon: '📋', color: OLIVE },
  { name: 'Diane Nash', dates: '1938–', role: 'SNCC co-founder, Freedom Ride strategist', contribution: 'Key strategist and fearless organizer of direct action campaigns', detail: 'A Fisk University student from Chicago who became one of the movement\'s most courageous and strategic leaders. Nash led the Nashville sit-in campaign, insisted on continuing the Freedom Rides when CORE pulled back (saying "if we let violence stop us, the movement is dead"), and was a key strategist for the Birmingham and Selma campaigns. She was pregnant when she was jailed in Mississippi and told the judge she would refuse bail. King called the Birmingham campaign "Diane Nash\'s idea." Her contributions have been systematically underrecognized.', icon: '💡', color: PURPLE },
  { name: 'James Lawson', dates: '1928–2024', role: 'Nonviolence teacher, movement theorist', contribution: 'Trained the Nashville movement in disciplined nonviolent resistance', detail: 'A Methodist minister and conscientious objector who spent a year in federal prison for refusing the Korean War draft, then studied nonviolence in India for three years. King called Lawson "the leading theorist and strategist of nonviolence in the world." Lawson conducted workshops in Nashville that trained an entire generation of movement leaders — John Lewis, Diane Nash, James Bevel, Bernard Lafayette — in the philosophy and discipline of nonviolent direct action. His workshops were the movement\'s boot camp, turning moral conviction into strategic action.', icon: '🕊️', color: OLIVE },
  { name: 'Stokely Carmichael (Kwame Ture)', dates: '1941–1998', role: 'SNCC chairman, Black Power advocate', contribution: 'Popularized "Black Power," shifted the movement\'s direction', detail: 'A Trinidad-born, Howard University-educated organizer who succeeded John Lewis as SNCC chairman in 1966. Carmichael coined the rallying cry "Black Power" during the March Against Fear, signaling a generational shift from integrationist nonviolence to Black self-determination. He organized voter registration in Lowndes County, Alabama, where the Black Panther symbol first appeared. Later renamed Kwame Ture in honor of African leaders Kwame Nkrumah and Ahmed Sékou Touré, he moved to Guinea and advocated pan-Africanism.', icon: '✊', color: MAROON },
  { name: 'Fred Hampton', dates: '1948–1969', role: 'Black Panther Party chairman, Illinois', contribution: 'Coalition-building across racial lines, community programs', detail: 'A charismatic 21-year-old leader who organized a "Rainbow Coalition" uniting the Black Panthers, Young Lords (Puerto Rican), and Young Patriots (white Appalachian) in Chicago — a multiracial alliance against poverty that terrified the FBI. Hampton ran the Panthers\' free breakfast program and health clinics. He was assassinated by Chicago police in a predawn raid on December 4, 1969, while sleeping — an operation coordinated with the FBI\'s COINTELPRO program. He was drugged by an FBI informant before the raid. An investigation found police fired 90 rounds; the Panthers fired one.', icon: '🐾', color: SLATE },
  { name: 'James Baldwin', dates: '1924–1987', role: 'Writer, essayist, moral witness', contribution: 'Articulated the Black experience with unmatched literary brilliance', detail: 'The greatest American essayist of the 20th century, whose works — "The Fire Next Time," "Notes of a Native Son," "Nobody Knows My Name" — articulated the pain, rage, and complexity of Black life in America with searing honesty and literary brilliance. Baldwin was both inside and outside the movement — a participant and a witness, a supporter of King and an honest critic. His 1963 essay "The Fire Next Time" warned America that its racial reckoning could not be postponed forever. A gay Black man who lived much of his life in Paris, Baldwin embodied the intersecting oppressions the movement fought.', icon: '✍️', color: BRONZE },
  { name: 'Coretta Scott King', dates: '1927–2006', role: 'Movement leader, keeper of the legacy', contribution: 'Activist in her own right, built the King legacy and expanded it', detail: 'Far more than "Martin\'s wife" — Coretta Scott King was a trained musician, antiwar activist, and movement leader who organized, fundraised, and spoke across the country. After King\'s assassination, she founded the Martin Luther King Jr. Center for Nonviolent Social Change, led the campaign for the King federal holiday (achieved in 1986), and expanded the movement\'s vision to include LGBTQ+ rights, opposing apartheid, and economic justice. She argued that her husband\'s legacy demanded solidarity with all oppressed people.', icon: '🕯️', color: PURPLE },
  { name: 'Septima Clark', dates: '1898–1987', role: 'Educator, Citizenship Schools founder', contribution: 'Created the literacy and voter education program that powered voter registration', detail: 'Called the "Queen Mother of the Civil Rights Movement" by King. Clark developed the Citizenship Schools, which taught Black adults to read and write — the prerequisite for passing voter registration tests. By 1970, the program had trained over 10,000 teachers and taught reading to nearly 100,000 Black adults across the South. Clark understood that voting rights were meaningless without literacy, and literacy was meaningless without the courage to use it. Her quiet, systematic work was the foundation beneath the movement\'s most dramatic achievements.', icon: '📖', color: PURPLE },
];

const STRATEGIES = {
  nonviolent: {
    title: 'Nonviolent Direct Action',
    detail: 'The movement\'s signature strategy, drawn from Gandhi\'s campaigns in India and developed through James Lawson\'s Nashville workshops. The logic was precise: create a crisis that forces a community to confront an injustice it prefers to ignore. Sit-ins, marches, boycotts, and Freedom Rides were not passive — they were deliberate provocations designed to expose the violence required to maintain segregation. When Bull Connor turned fire hoses and dogs on children in Birmingham, when state troopers beat marchers at Selma, television broadcast the moral bankruptcy of segregation into every American living room. Nonviolence worked because it forced white America to see what had been invisible to them.',
    color: GOLD,
  },
  legal: {
    title: 'Legal Challenges (NAACP Strategy)',
    detail: 'Thurgood Marshall and the NAACP Legal Defense Fund pursued a decades-long legal strategy to dismantle segregation through the courts. Beginning in the 1930s, they filed case after case challenging specific aspects of "separate but equal," building precedent toward the ultimate goal of overturning Plessy v. Ferguson. They targeted graduate schools first (Sweatt v. Painter, McLaurin v. Oklahoma), where the impossibility of true equality was most obvious, before taking on public schools in Brown v. Board of Education. This strategy required extraordinary patience and legal brilliance — and it produced some of the most consequential Supreme Court decisions in American history.',
    color: TEAL,
  },
  voter: {
    title: 'Voter Registration',
    detail: 'SNCC and CORE focused on voter registration in the Deep South, understanding that political power was the key to lasting change. This was the movement\'s most dangerous work. In Mississippi, less than 7% of eligible Black citizens were registered to vote. Registering Black voters required facing down sheriffs, KKK night riders, economic retaliation, and murder. Freedom Summer (1964) brought national attention but also the murders of Chaney, Goodman, and Schwerner. The Selma campaign\'s Bloody Sunday catalyzed the Voting Rights Act (1965), which finally gave the federal government the tools to enforce the 15th Amendment — 95 years after it was ratified.',
    color: OLIVE,
  },
  economic: {
    title: 'Economic Boycotts',
    detail: 'Money talked when morality didn\'t. The Montgomery Bus Boycott demonstrated that Black economic power could bring a city to its knees — the bus company lost 65% of its revenue in 381 days. The Birmingham campaign combined marches with a boycott of downtown stores during the Easter shopping season, hitting white businesses where it hurt. The Nashville sit-in movement pressured downtown merchants through organized buying boycotts. Economic pressure was often what finally brought white power structures to the negotiating table. As King recognized, segregation was an economic system as much as a social one, and attacking it economically was devastatingly effective.',
    color: AMBER,
  },
  synergy: 'These strategies were not competing alternatives but complementary tools. Legal victories (Brown) created the constitutional framework. Direct action (sit-ins, marches) created the political crisis and moral urgency. Voter registration built the political power to sustain change. Economic boycotts applied immediate pressure. The genius of the movement was that different organizations and leaders pursued different strategies simultaneously — the NAACP in the courts, SCLC in the streets, SNCC in the fields, CORE on the highways — creating a multi-front assault on segregation that overwhelmed defenders of the status quo.',
};

const WOMEN_LEADERS = {
  overview: 'Women were the backbone of the Civil Rights Movement — yet they were systematically marginalized within it. Men dominated the visible leadership, gave the famous speeches, and negotiated with presidents. Women did the organizing: they ran the meetings, staffed the offices, coordinated the boycotts, registered the voters, taught in the Freedom Schools, and put their bodies on the line alongside men. The movement\'s most famous moments — the Montgomery Bus Boycott, the sit-ins, Freedom Summer, Selma — were organized or initiated by women whose names are far less known than those of the men who received credit.',
  figures: [
    { name: 'Fannie Lou Hamer', detail: 'A Mississippi sharecropper who became the movement\'s most powerful grassroots voice. Beaten savagely for trying to register to vote. Co-founded the Mississippi Freedom Democratic Party. Her DNC testimony was so powerful LBJ tried to suppress it. "I\'m sick and tired of being sick and tired."', color: PURPLE },
    { name: 'Diane Nash', detail: 'A key strategist behind the Nashville sit-ins, Freedom Rides, Birmingham campaign, and Selma. When CORE wanted to abandon the Freedom Rides after the Anniston firebombing, Nash insisted they continue. King called Birmingham "Diane Nash\'s idea." She has never received the recognition she deserves.', color: PURPLE },
    { name: 'Septima Clark', detail: 'Created the Citizenship Schools that taught 100,000 Black adults to read — the prerequisite for voter registration. Andrew Young called her "the mother of the movement." She was fired from her teaching job in South Carolina for NAACP membership and devoted the rest of her life to the cause.', color: PURPLE },
    { name: 'Ella Baker', detail: 'The organizational genius who founded SNCC, mentored a generation of young activists, and insisted on democratic, bottom-up leadership. She had decades of experience as an NAACP organizer and SCLC director. Baker was critical of the movement\'s "leader-centered" culture and championed "group-centered leadership" — empowering communities rather than creating celebrity spokespeople.', color: PURPLE },
    { name: 'Jo Ann Robinson', detail: 'A professor at Alabama State College who organized the Montgomery Bus Boycott before Rosa Parks was even arrested — she had been planning it for months. Robinson and the Women\'s Political Council printed and distributed 50,000 leaflets calling for the boycott overnight, creating the momentum that launched the 381-day action.', color: PURPLE },
    { name: 'Ruby Bridges', detail: 'At six years old, Ruby Bridges became the first Black child to desegregate an all-white elementary school in the South, walking into William Frantz Elementary in New Orleans in 1960 escorted by federal marshals past screaming mobs. She spent the entire year as the only student in her class — every white parent pulled their children out. Her courage at age six shamed a nation.', color: PURPLE },
  ],
};

const MALCOLM_AND_BLACK_POWER = {
  malcolm: 'Malcolm X offered Black America something the mainstream movement didn\'t: permission to be angry. While King preached love and forgiveness, Malcolm articulated the rage that millions of Black Americans felt. He rejected integration as a goal — why beg to sit next to people who despise you? — and advocated Black self-reliance, self-defense, and pride. His critique of white liberalism ("The white liberal is the worst enemy to America") cut deep because it contained uncomfortable truths. After leaving the Nation of Islam in 1964 and traveling to Africa and Mecca, Malcolm\'s views evolved toward a more universal human rights framework, but he was assassinated before this evolution could fully develop.',
  debate: 'The King-Malcolm debate — nonviolence vs. self-defense, integration vs. separation, moral suasion vs. militant demands — was not a weakness of the movement but a source of its strength. Malcolm\'s militancy made King\'s demands seem reasonable to white moderates. King\'s moral authority gave the movement legitimacy that Malcolm\'s rhetoric alone couldn\'t provide. Many ordinary Black Americans drew from both: they admired King\'s courage and Malcolm\'s honesty, practiced nonviolence in demonstrations and kept a gun at home for self-defense. The two men met only once, briefly, in March 1964.',
  blackPower: 'Black Power emerged in 1966 from the frustration of young SNCC organizers who had been beaten, jailed, and seen friends murdered — and saw how little had changed for the average Black American in the Deep South despite legal victories. It represented a shift from asking white America for inclusion to demanding Black self-determination: Black-controlled institutions, Black political power, Black economic development, and Black cultural pride. The Black Panther Party embodied this shift with its community programs, armed patrols, and revolutionary rhetoric — and paid dearly for it through FBI COINTELPRO\'s systematic campaign of infiltration, disruption, and assassination.',
};

const FEDERAL_GOVERNMENT = {
  eisenhower: {
    title: 'Dwight D. Eisenhower (1953–1961)',
    detail: 'Eisenhower was reluctant and cautious on civil rights. He privately regretted appointing Earl Warren as Chief Justice after Brown v. Board of Education and never publicly endorsed the decision. He sent troops to Little Rock in 1957 only because Governor Faubus\'s defiance challenged federal authority, not out of conviction for desegregation. He signed the Civil Rights Acts of 1957 and 1960 — the first civil rights legislation since Reconstruction — but they were weak bills, deliberately gutted to appease Southern Democrats. Eisenhower\'s greatest civil rights failure was moral: he refused to use the presidency\'s bully pulpit to support integration.',
    color: NAVY,
  },
  jfk: {
    title: 'John F. Kennedy (1961–1963)',
    detail: 'Kennedy evolved under pressure. He entered office cautious on civil rights, unwilling to antagonize the Southern Democrats he needed for his legislative agenda. He appointed segregationist judges to Southern courts. But the Freedom Rides, Birmingham, and the moral clarity of the movement gradually pushed him. After Birmingham\'s children were attacked with fire hoses in May 1963, Kennedy went on national television to declare civil rights "a moral issue... as old as the Scriptures and as clear as the American Constitution." He proposed comprehensive civil rights legislation in June 1963 — five months before his assassination.',
    color: NAVY,
  },
  lbj: {
    title: 'Lyndon B. Johnson (1963–1969)',
    detail: 'Johnson was the most consequential presidential ally the civil rights movement had. A Texan who had voted against civil rights bills as a senator, Johnson as president used his unmatched legislative skill to pass the Civil Rights Act (1964), Voting Rights Act (1965), and Fair Housing Act (1968). He told Congress: "We shall overcome." When asked why he was spending so much political capital on civil rights, knowing it would cost Democrats the South for a generation (which it did), Johnson reportedly said that it was the right thing to do. His Great Society programs — Medicare, Medicaid, Head Start, the War on Poverty — were the most ambitious social legislation since the New Deal.',
    color: NAVY,
  },
  why: 'Presidents mattered because the federal government was the only institution with the power to override Southern state governments. The movement could create moral crises and political pressure, but only the president could deploy federal troops, push legislation through Congress, and direct the Justice Department to enforce the law. Every major civil rights achievement required presidential action — and every president had to be pushed, pressured, or shamed into acting. The movement didn\'t wait for friendly presidents; it forced reluctant ones to choose between supporting justice and being seen as complicit in televised brutality.',
};

const OPPOSITION = {
  whiteCitizens: {
    title: 'White Citizens\' Councils',
    detail: 'Called "the Klan in suits," White Citizens\' Councils organized "respectable" white resistance to integration across the South after Brown v. Board of Education. They used economic pressure — firing Black workers who registered to vote, denying loans to civil rights supporters, boycotting businesses that served Black customers — rather than overt violence. Membership included bankers, lawyers, politicians, and business leaders. They made integration economically devastating for anyone who supported it and provided political cover for massive resistance to desegregation.',
    color: SLATE,
  },
  kkk: {
    title: 'Ku Klux Klan Violence',
    detail: 'The KKK and affiliated white supremacist groups were the movement\'s terrorist wing. They bombed churches (Birmingham, 1963), murdered civil rights workers (Chaney, Goodman, Schwerner; Viola Liuzzo; Vernon Dahmer), castrated and lynched Emmett Till, beat Freedom Riders, burned crosses, and dynamited homes. In Birmingham alone, so many Black homes and churches were bombed that the city was nicknamed "Bombingham." Local law enforcement frequently collaborated with the Klan — as in the Neshoba County murders, where the deputy sheriff delivered victims to the killers. Klan violence was not random; it was systematic terrorism designed to maintain white supremacy through fear.',
    color: FLAME,
  },
  cointelpro: {
    title: 'FBI COINTELPRO',
    detail: 'J. Edgar Hoover\'s FBI conducted a systematic campaign to "neutralize" the civil rights movement. COINTELPRO (Counter Intelligence Program) infiltrated movement organizations, planted informants, spread disinformation, created internal conflicts, and targeted leaders for destruction. The FBI wiretapped Martin Luther King Jr., sent him anonymous letters urging suicide, attempted to discredit him through leaked recordings of his personal life, and surveilled virtually every major civil rights organization. The FBI\'s campaign against the Black Panther Party was even more extreme: infiltration, fake letters to create feuds, and direct participation in the assassination of Fred Hampton. COINTELPRO represented the federal government working against the same citizens it was supposed to protect.',
    color: SLATE,
  },
  massiveResistance: {
    title: 'Massive Resistance',
    detail: 'After Brown v. Board of Education, Southern states adopted a strategy called "Massive Resistance" — using every legal and political tool to prevent desegregation. Virginia closed public schools rather than integrate them. Mississippi created a State Sovereignty Commission to spy on civil rights activists. States passed laws requiring NAACP membership lists to be disclosed (to facilitate retaliation). Interposition resolutions declared Brown unconstitutional. The Southern Manifesto, signed by 101 of 128 Southern congressmen, pledged to reverse the decision "by all lawful means." Massive Resistance delayed meaningful desegregation for over a decade after Brown.',
    color: SLATE,
  },
};

const LEGISLATION = {
  civilRightsAct: {
    title: 'Civil Rights Act of 1964',
    detail: 'The most comprehensive civil rights legislation since Reconstruction. Title I: prohibited unequal application of voter registration requirements. Title II: banned discrimination in public accommodations (hotels, restaurants, theaters, gas stations). Title III: prohibited state and local governments from denying access to public facilities. Title IV: authorized the Attorney General to file desegregation suits. Title VI: prohibited discrimination in federally funded programs. Title VII: banned employment discrimination and created the EEOC. The Act dismantled the legal framework of Jim Crow in public life.',
    color: TEAL,
  },
  votingRightsAct: {
    title: 'Voting Rights Act of 1965',
    detail: 'The most effective civil rights law ever enacted. It banned literacy tests and other devices used to prevent Black voting. Section 5 required states with histories of discrimination to get federal approval ("preclearance") before changing any voting law — preventing new forms of voter suppression before they could take effect. It authorized federal registrars in counties that resisted. Results were immediate: Black voter registration in Mississippi jumped from 6.7% to 59.8%. Across the South, Black voters elected Black officials for the first time since Reconstruction. The Act was renewed and strengthened in 1970, 1975, 1982, and 2006 — but Section 5 was effectively gutted by the Supreme Court\'s Shelby County v. Holder decision in 2013.',
    color: TEAL,
  },
  fairHousingAct: {
    title: 'Fair Housing Act of 1968',
    detail: 'Banned discrimination in the sale, rental, and financing of housing based on race, color, religion, or national origin (later amended to include sex, familial status, and disability). The Act was necessary because housing segregation — enforced through restrictive covenants, redlining, steering by real estate agents, and discriminatory lending — was the foundation of racial inequality in education (school funding tied to property taxes), wealth (homeownership as the primary source of middle-class wealth), and opportunity. However, enforcement was deliberately weak — a compromise necessary to pass the bill — and housing remains the most segregated dimension of American life.',
    color: TEAL,
  },
};

const UNFINISHED_BUSINESS = {
  overview: 'The Civil Rights Movement achieved extraordinary legal and political victories — but it did not, and could not, undo centuries of economic exploitation, institutional racism, and psychological damage in 14 years. What remained was in many ways harder to address than what had been achieved, because it was embedded not in laws that could be changed but in systems, structures, and patterns that proved resistant to legislation.',
  issues: [
    { title: 'Economic Inequality', detail: 'King recognized this before his death — his last campaign was the Poor People\'s Campaign, addressing poverty across racial lines. The median Black family\'s wealth today is approximately one-tenth that of the median white family. This gap traces directly to centuries of slavery, Jim Crow, redlining, and exclusion from the wealth-building opportunities (homeownership, GI Bill benefits, union membership) that created the white middle class.', color: AMBER },
    { title: 'Police Violence', detail: 'The relationship between Black communities and police has been one of antagonism and violence since slave patrols. Despite the Civil Rights Movement\'s achievements, police killings of Black Americans — Amadou Diallo, Sean Bell, Oscar Grant, Trayvon Martin, Michael Brown, Eric Garner, Tamir Rice, Philando Castile, Breonna Taylor, George Floyd, and countless others — continue to demonstrate that Black life is still valued differently by the criminal justice system.', color: FLAME },
    { title: 'Systemic Racism', detail: 'Even without overtly racist laws, racial inequality persists through structures built on centuries of discrimination: residential segregation, school funding tied to property taxes, mass incarceration (the U.S. imprisons Black men at nearly six times the rate of white men), discriminatory lending, hiring bias, health care disparities, and environmental racism. These systems produce racial inequality without requiring anyone to be personally racist — they operate on autopilot.', color: MAROON },
    { title: 'Voter Suppression', detail: 'The Supreme Court\'s 2013 Shelby County v. Holder decision gutted the Voting Rights Act\'s preclearance requirement, freeing states to change voting laws without federal approval. Since then, states have enacted voter ID laws, purged voter rolls, closed polling places in Black neighborhoods, gerrymandered districts, and restricted mail-in voting — all disproportionately affecting Black voters. The fight for voting rights that Selma was supposed to have won is being fought again.', color: SLATE },
  ],
};

const LEGACY_DATA = [
  { title: 'Template for Global Movements', detail: 'The American Civil Rights Movement became a model for liberation movements worldwide: the anti-apartheid movement in South Africa, the Northern Ireland civil rights movement, the Solidarity movement in Poland, democracy movements across Latin America and Asia, and indigenous rights movements globally. Its strategies of nonviolent direct action, legal challenges, and moral suasion have been adapted for dozens of causes in dozens of countries.', icon: '🌍', color: GOLD },
  { title: 'Direct Line to #BlackLivesMatter', detail: 'The Black Lives Matter movement, founded in 2013 by Alicia Garza, Patrisse Cullors, and Opal Tometi after Trayvon Martin\'s killer was acquitted, is a direct descendant of the Civil Rights Movement — addressing the same issues (police violence, systemic racism) that the earlier movement identified but couldn\'t fully resolve. BLM draws on the movement\'s legacy while adapting to the 21st century: decentralized leadership (echoing Ella Baker\'s philosophy), social media organizing, and an intersectional framework addressing race, gender, and sexuality together.', icon: '✊', color: MAROON },
  { title: 'Legal and Constitutional Transformation', detail: 'The movement\'s legal victories — Brown, the Civil Rights Act, the Voting Rights Act, the Fair Housing Act — fundamentally transformed American law and constitutional interpretation. The 14th Amendment\'s equal protection clause, which had been effectively dead since the 1880s, became a powerful tool for expanding rights. The civil rights framework was later extended to women\'s rights, disability rights, LGBTQ+ rights, and other marginalized groups.', icon: '⚖️', color: TEAL },
  { title: 'Cultural Transformation', detail: 'The movement didn\'t just change laws; it changed what Americans considered morally acceptable. Overt racism went from being publicly respectable to publicly shameful (even as covert racism persisted). "I Have a Dream" became part of the national mythology. Martin Luther King Jr. Day is a federal holiday. The movement established, at least in principle, that racial equality is a fundamental American value — creating a moral standard against which the nation\'s continued failures can be measured.', icon: '🕯️', color: BRONZE },
  { title: 'The Ongoing Struggle', detail: 'The Civil Rights Movement\'s greatest legacy may be its unfinished business. Every generation of Black Americans has had to fight for rights that should already have been secure — from Reconstruction to Jim Crow to the Civil Rights era to mass incarceration to police violence to voter suppression. The movement taught that rights are never permanently won; they must be defended, expanded, and reimagined by each generation. As John Lewis said: "Freedom is not a state; it is an act. It is not some enchanted garden perched high on a distant plateau where we can finally sit down and rest. Freedom is the continuous action of all of us together."', icon: '🔥', color: FLAME },
];

/* ───────── Helper Components ───────── */

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: `${MAROON}15`, border: `1px solid ${MAROON}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: GOLD, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 11, color: TEXT_DIM, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function TabButton({ label, icon, active, onClick }: { label: string; icon: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 8,
        border: `1px solid ${active ? MAROON : CARD_BORDER}`,
        backgroundColor: active ? `${MAROON}22` : 'transparent',
        color: active ? TEXT : TEXT_DIM,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, margin: 0 }}>{title}</h2>
    </div>
  );
}

/* ───────── Section tabs config ───────── */

const SECTION_TABS: { key: SectionTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: '✊' },
  { key: 'precursors', label: 'Precursors', icon: '📜' },
  { key: 'timeline', label: 'Year by Year', icon: '📅' },
  { key: 'figures', label: 'Key Figures', icon: '👤' },
  { key: 'strategies', label: 'Strategies', icon: '🎯' },
  { key: 'women', label: 'Women Leaders', icon: '💜' },
  { key: 'malcolmx', label: 'Malcolm X & Black Power', icon: '🔥' },
  { key: 'government', label: 'Federal Government', icon: '🏛️' },
  { key: 'opposition', label: 'Opposition', icon: '⚠️' },
  { key: 'legislation', label: 'Legislation', icon: '⚖️' },
  { key: 'unfinished', label: 'Unfinished Business', icon: '🔄' },
  { key: 'legacy', label: 'Legacy', icon: '🌍' },
];

/* ───────── Main Component ───────── */

export default function CivilRightsPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('overview');
  const [expandedFigure, setExpandedFigure] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<string | null>(TIMELINE_YEARS[0].year);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: BG, color: TEXT, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ─── Hero ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ padding: '48px 32px 36px', borderBottom: `1px solid ${CARD_BORDER}`, background: `linear-gradient(135deg, ${BG} 0%, rgba(107,39,55,0.10) 100%)` }}>
          <Link to="/" style={{ fontSize: 13, color: TEXT_DIM, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: '4px 0' }}>&larr; Back to Timeline</Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: `${MAROON}20`, border: `2px solid ${MAROON}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0, boxShadow: `0 0 24px ${MAROON}30` }}>✊</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, backgroundColor: `${MAROON}20`, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deep Dive</span>
          </div>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', fontWeight: 800, color: TEXT, lineHeight: 1.15, marginBottom: 14 }}>
            The American Civil Rights Movement &mdash; The Long Fight for Equality{' '}
            <span style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 400, color: TEXT_DIM }}>(1954&ndash;1968)</span>
          </h1>

          <p style={{ fontSize: 15, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 20, maxWidth: 750 }}>
            A decades-long struggle by Black Americans to dismantle the legal and social architecture of white supremacy &mdash; through boycotts, sit-ins, marches, legal challenges, and extraordinary moral courage in the face of beatings, bombings, and murder.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <StatBadge value="1954–68" label="Peak Years" />
            <StatBadge value="3" label="Landmark Laws" />
            <StatBadge value="250K+" label="March on Washington" />
            <StatBadge value="6M+" label="Great Migration" />
          </div>
        </motion.div>

        {/* ─── Tabs ─── */}
        <div style={{ padding: '16px 32px', borderBottom: `1px solid ${CARD_BORDER}`, display: 'flex', flexWrap: 'wrap', gap: 6, position: 'sticky', top: 0, backgroundColor: BG, zIndex: 10 }}>
          {SECTION_TABS.map(t => (
            <TabButton key={t.key} label={t.label} icon={t.icon} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} />
          ))}
        </div>

        {/* ─── Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }} style={{ padding: '28px 32px 64px' }}>

            {/* ════════ OVERVIEW ════════ */}
            {activeTab === 'overview' && (
              <div>
                <SectionHeader icon="✊" title="The Civil Rights Movement — An Overview" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{OVERVIEW_TEXT}</p>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The System They Faced: Jim Crow</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, marginBottom: 16 }}>{CONTEXT.jimCrow}</p>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${FLAME}33`, backgroundColor: `${FLAME}08`, marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: FLAME, marginBottom: 8 }}>Enforced by Terror</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{CONTEXT.violence}</p>
                </div>

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${MAROON}33`, backgroundColor: `${MAROON}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: MAROON, marginBottom: 8 }}>A Self-Reinforcing System</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{CONTEXT.system}</p>
                </div>
              </div>
            )}

            {/* ════════ PRECURSORS ════════ */}
            {activeTab === 'precursors' && (
              <div>
                <SectionHeader icon="📜" title="Precursors — The Roots of the Movement" />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Reconstruction and Betrayal (1865–1877)</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${BRONZE}33`, backgroundColor: `${BRONZE}08`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{PRECURSORS.reconstruction}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Great Migration (1910–1940s)</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${OLIVE}33`, backgroundColor: `${OLIVE}08`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{PRECURSORS.migration}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>WWII Black Veterans</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${NAVY}33`, backgroundColor: `${NAVY}08`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{PRECURSORS.wwii}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The Harlem Renaissance</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{PRECURSORS.harlem}</p>
                </div>
              </div>
            )}

            {/* ════════ YEAR BY YEAR TIMELINE ════════ */}
            {activeTab === 'timeline' && (
              <div>
                <SectionHeader icon="📅" title="Year by Year — The Movement Unfolds (1954–1968)" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {TIMELINE_YEARS.map(yr => {
                    const isOpen = expandedYear === yr.year;
                    return (
                      <div key={yr.year} style={{ borderRadius: 10, border: `1px solid ${MAROON}33`, backgroundColor: `${MAROON}08`, overflow: 'hidden' }}>
                        <div
                          onClick={() => setExpandedYear(isOpen ? null : yr.year)}
                          style={{ padding: '14px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: 'monospace' }}>{yr.year}</span>
                            <span style={{ fontSize: 13, color: TEXT_DIM }}>{yr.events.length} event{yr.events.length > 1 ? 's' : ''}</span>
                          </div>
                          <span style={{ fontSize: 12, color: TEXT_MUTED, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
                        </div>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 20px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                              {yr.events.map((ev, i) => (
                                <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${ev.color}33`, backgroundColor: `${ev.color}08` }}>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{ev.title}</div>
                                  <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{ev.detail}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════ KEY FIGURES ════════ */}
            {activeTab === 'figures' && (
              <div>
                <SectionHeader icon="👤" title="Key Figures of the Movement" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {KEY_FIGURES.map(fig => {
                    const isOpen = expandedFigure === fig.name;
                    return (
                      <div
                        key={fig.name}
                        style={{ padding: 16, borderRadius: 10, border: `1px solid ${fig.color}33`, backgroundColor: `${fig.color}08`, cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => setExpandedFigure(isOpen ? null : fig.name)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{fig.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{fig.name} <span style={{ fontSize: 12, fontWeight: 400, color: TEXT_MUTED }}>({fig.dates})</span></div>
                            <div style={{ fontSize: 12, color: fig.color, fontWeight: 600 }}>{fig.role}</div>
                          </div>
                          <span style={{ fontSize: 12, color: TEXT_MUTED, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>&#9660;</span>
                        </div>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${fig.color}22` }}>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: '0 0 6px', fontWeight: 600 }}>{fig.contribution}</p>
                            <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{fig.detail}</p>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ════════ STRATEGIES ════════ */}
            {activeTab === 'strategies' && (
              <div>
                <SectionHeader icon="🎯" title="Strategies — How the Movement Fought" />

                {[STRATEGIES.nonviolent, STRATEGIES.legal, STRATEGIES.voter, STRATEGIES.economic].map((s, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{s.title}</h3>
                    <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${s.color}33`, backgroundColor: `${s.color}08` }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{s.detail}</p>
                    </div>
                  </div>
                ))}

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>How They Worked Together</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{STRATEGIES.synergy}</p>
                </div>
              </div>
            )}

            {/* ════════ WOMEN LEADERS ════════ */}
            {activeTab === 'women' && (
              <div>
                <SectionHeader icon="💜" title="The Role of Women — Often Overlooked, Always Essential" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{WOMEN_LEADERS.overview}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {WOMEN_LEADERS.figures.map((w, i) => (
                    <div key={i} style={{ padding: 16, borderRadius: 10, border: `1px solid ${w.color}33`, backgroundColor: `${w.color}08` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{w.name}</div>
                      <p style={{ fontSize: 13, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{w.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ MALCOLM X & BLACK POWER ════════ */}
            {activeTab === 'malcolmx' && (
              <div>
                <SectionHeader icon="🔥" title="Malcolm X and Black Power — Different Approach, Same Enemy" />

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Malcolm X</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${FLAME}33`, backgroundColor: `${FLAME}08`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{MALCOLM_AND_BLACK_POWER.malcolm}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>The King-Malcolm Debate</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08`, marginBottom: 24 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{MALCOLM_AND_BLACK_POWER.debate}</p>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>Black Power</h3>
                <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${MAROON}33`, backgroundColor: `${MAROON}08` }}>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{MALCOLM_AND_BLACK_POWER.blackPower}</p>
                </div>
              </div>
            )}

            {/* ════════ FEDERAL GOVERNMENT ════════ */}
            {activeTab === 'government' && (
              <div>
                <SectionHeader icon="🏛️" title="The Federal Government — Why Presidents Matter" />

                {[FEDERAL_GOVERNMENT.eisenhower, FEDERAL_GOVERNMENT.jfk, FEDERAL_GOVERNMENT.lbj].map((pres, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{pres.title}</h3>
                    <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${pres.color}33`, backgroundColor: `${pres.color}08` }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{pres.detail}</p>
                    </div>
                  </div>
                ))}

                <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 8 }}>Why Presidential Action Was Essential</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{FEDERAL_GOVERNMENT.why}</p>
                </div>
              </div>
            )}

            {/* ════════ OPPOSITION ════════ */}
            {activeTab === 'opposition' && (
              <div>
                <SectionHeader icon="⚠️" title="The Opposition — What the Movement Faced" />

                {[OPPOSITION.whiteCitizens, OPPOSITION.kkk, OPPOSITION.cointelpro, OPPOSITION.massiveResistance].map((opp, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{opp.title}</h3>
                    <div style={{ padding: 16, borderRadius: 10, border: `1px solid ${opp.color}33`, backgroundColor: `${opp.color}08` }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{opp.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ════════ LEGISLATION ════════ */}
            {activeTab === 'legislation' && (
              <div>
                <SectionHeader icon="⚖️" title="What Was Achieved — The Three Landmark Laws" />

                {[LEGISLATION.civilRightsAct, LEGISLATION.votingRightsAct, LEGISLATION.fairHousingAct].map((law, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{law.title}</h3>
                    <div style={{ padding: 20, borderRadius: 10, border: `1px solid ${law.color}33`, backgroundColor: `${law.color}08` }}>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{law.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ════════ UNFINISHED BUSINESS ════════ */}
            {activeTab === 'unfinished' && (
              <div>
                <SectionHeader icon="🔄" title="What Wasn't Resolved — The Unfinished Agenda" />
                <p style={{ fontSize: 15, lineHeight: 1.8, color: TEXT_DIM, marginBottom: 24 }}>{UNFINISHED_BUSINESS.overview}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {UNFINISHED_BUSINESS.issues.map((issue, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 10, border: `1px solid ${issue.color}33`, backgroundColor: `${issue.color}08` }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{issue.title}</div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{issue.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ LEGACY ════════ */}
            {activeTab === 'legacy' && (
              <div>
                <SectionHeader icon="🌍" title="The Legacy — A Movement That Changed the World" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {LEGACY_DATA.map((item, i) => (
                    <div key={i} style={{ padding: 20, borderRadius: 10, border: `1px solid ${item.color}33`, backgroundColor: `${item.color}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 20 }}>{item.icon}</span>
                        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{item.title}</div>
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.7, color: TEXT_DIM, margin: 0 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
