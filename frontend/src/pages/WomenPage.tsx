/**
 * WomenPage — "The Women Who Shaped History"
 *
 * A dedicated page celebrating 35 women who changed history, spanning
 * ancient to modern eras. Features profile cards, era/field/region filters,
 * a chronological timeline, notable firsts, and connections between figures.
 */

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────── Types ──────────────────────────── */

interface WomanProfile {
  name: string;
  dates: string;
  birthYear: number;
  deathYear: number | null;
  field: string;
  nationality: string;
  region: string;
  era: string;
  what_she_did: string;
  why_it_mattered: string;
  famous_quote: string;
  breaking_barrier: string;
  chronicleQuery: string;
}

/* ──────────────────────────── Data ──────────────────────────── */

const WOMEN: WomanProfile[] = [
  // ── Ancient ──
  {
    name: 'Hatshepsut',
    dates: 'c. 1507–1458 BCE',
    birthYear: -1507,
    deathYear: -1458,
    field: 'Politics',
    nationality: 'Egyptian',
    region: 'Africa / Middle East',
    era: 'Ancient',
    what_she_did: 'Ruled Egypt as pharaoh for over 20 years, one of the longest reigns of any female ruler in the ancient world. She launched ambitious building projects including her mortuary temple at Deir el-Bahri and re-established trade networks. Under her rule, Egypt experienced an era of peace and economic prosperity.',
    why_it_mattered: 'She proved that a woman could rule one of the most powerful civilizations in history, setting a precedent that would echo through millennia.',
    famous_quote: 'I have restored that which was in ruins. I have raised up that which was formerly destroyed.',
    breaking_barrier: 'First woman to assume the full power and regalia of a pharaoh, ruling not as queen consort but as king in her own right.',
    chronicleQuery: 'Hatshepsut',
  },
  {
    name: 'Cleopatra VII',
    dates: '69–30 BCE',
    birthYear: -69,
    deathYear: -30,
    field: 'Politics',
    nationality: 'Egyptian (Ptolemaic)',
    region: 'Africa / Middle East',
    era: 'Ancient',
    what_she_did: 'The last active ruler of the Ptolemaic Kingdom of Egypt, she spoke nine languages and was the first Ptolemaic ruler to learn Egyptian. She formed strategic alliances with Julius Caesar and Mark Antony to protect Egypt\'s sovereignty. Her political acumen kept Egypt independent during the rise of Roman power.',
    why_it_mattered: 'She demonstrated that intellectual brilliance and diplomatic skill were as powerful as military might in geopolitics.',
    famous_quote: 'I will not be triumphed over.',
    breaking_barrier: 'One of the most powerful rulers in the ancient Mediterranean, commanding respect from Rome\'s greatest leaders.',
    chronicleQuery: 'Cleopatra',
  },
  {
    name: 'Hypatia of Alexandria',
    dates: 'c. 350–415 CE',
    birthYear: 350,
    deathYear: 415,
    field: 'Science',
    nationality: 'Roman Egyptian',
    region: 'Africa / Middle East',
    era: 'Ancient',
    what_she_did: 'A philosopher, astronomer, and mathematician who headed the Neoplatonist school in Alexandria. She edited Ptolemy\'s Almagest, improved the design of astrolabes, and was sought as a political adviser. Her lectures drew scholars from across the Mediterranean.',
    why_it_mattered: 'She became the symbol of learning and science against the rising tide of religious intolerance, and her murder marked a turning point in classical intellectual life.',
    famous_quote: 'Reserve your right to think, for even to think wrongly is better than not to think at all.',
    breaking_barrier: 'The first well-documented female mathematician and one of the last great thinkers of ancient Alexandria.',
    chronicleQuery: 'Hypatia',
  },
  {
    name: 'Queen Boudicca',
    dates: 'c. 30–61 CE',
    birthYear: 30,
    deathYear: 61,
    field: 'Military',
    nationality: 'Celtic British',
    region: 'Europe',
    era: 'Ancient',
    what_she_did: 'Led a massive uprising of Celtic tribes against the Roman occupation of Britain, destroying the Roman settlements of Camulodunum, Londinium, and Verulamium. Her army of over 100,000 warriors came close to ending Roman rule in Britain. Though ultimately defeated, she inflicted devastating losses on one of history\'s greatest empires.',
    why_it_mattered: 'She showed that resistance against overwhelming power was possible and inspired centuries of freedom fighters.',
    famous_quote: 'It is not as a woman descended from noble ancestry, but as one of the people that I am avenging lost freedom.',
    breaking_barrier: 'Led the largest military revolt against the Roman Empire in Britain, commanding armies at a time when women were rarely seen on the battlefield.',
    chronicleQuery: 'Boudicca',
  },
  {
    name: 'Wu Zetian',
    dates: '624–705 CE',
    birthYear: 624,
    deathYear: 705,
    field: 'Politics',
    nationality: 'Chinese',
    region: 'Asia',
    era: 'Ancient',
    what_she_did: 'Rose from concubine to become the only woman in Chinese history to assume the title of Empress regnant, founding her own dynasty (Zhou). She expanded the Chinese empire, reformed the civil service examination to be merit-based, and promoted Buddhism and the arts. She ruled for over 40 years.',
    why_it_mattered: 'Her meritocratic reforms democratized access to government and transformed Chinese society for centuries.',
    famous_quote: 'The ideal ruler possesses the ability to recognize and use talent.',
    breaking_barrier: 'The only woman in 4,000 years of Chinese history to rule as emperor in her own name.',
    chronicleQuery: 'Wu Zetian',
  },

  // ── Medieval ──
  {
    name: 'Hildegard of Bingen',
    dates: '1098–1179',
    birthYear: 1098,
    deathYear: 1179,
    field: 'Science',
    nationality: 'German',
    region: 'Europe',
    era: 'Medieval',
    what_she_did: 'A Benedictine abbess who composed over 70 liturgical works, wrote treatises on natural history and medicine, and corresponded with popes, emperors, and kings. She described the circulatory system centuries before William Harvey and catalogued hundreds of plants and their medicinal uses. She was also a visionary mystic whose theological writings were recognized by the church.',
    why_it_mattered: 'She demonstrated that women could be polymaths — combining science, art, music, and theology — in an age that severely limited women\'s intellectual roles.',
    famous_quote: 'The Word is living, being, spirit, all verdant greening, all creativity.',
    breaking_barrier: 'One of the first known female composers and one of the earliest practitioners of natural history in medieval Europe.',
    chronicleQuery: 'Hildegard of Bingen',
  },
  {
    name: 'Eleanor of Aquitaine',
    dates: '1122–1204',
    birthYear: 1122,
    deathYear: 1204,
    field: 'Politics',
    nationality: 'French / English',
    region: 'Europe',
    era: 'Medieval',
    what_she_did: 'Queen of France then Queen of England, she controlled vast territories, participated in the Second Crusade, and mothered two kings (Richard I and John). She served as regent of England while Richard was on crusade and helped establish the courts of love that shaped European culture. She remained politically active into her eighties.',
    why_it_mattered: 'She wielded more political power than almost any woman in medieval Europe, shaping the fate of two kingdoms.',
    famous_quote: 'I dressed my maids as Amazons and rode bare-breasted halfway to Damascus.',
    breaking_barrier: 'One of the wealthiest and most powerful women in medieval Western Europe, she was queen of two separate nations.',
    chronicleQuery: 'Eleanor of Aquitaine',
  },
  {
    name: 'Joan of Arc',
    dates: '1412–1431',
    birthYear: 1412,
    deathYear: 1431,
    field: 'Military',
    nationality: 'French',
    region: 'Europe',
    era: 'Medieval',
    what_she_did: 'An illiterate peasant girl who, at 17, convinced the French crown to let her lead armies against the English during the Hundred Years\' War. She lifted the Siege of Orléans in just nine days and led the Dauphin to his coronation at Reims. She was captured, tried for heresy, and burned at the stake at age 19.',
    why_it_mattered: 'A teenage peasant girl changed the course of a century-long war and became one of history\'s most enduring symbols of courage.',
    famous_quote: 'I am not afraid; I was born to do this.',
    breaking_barrier: 'Led a national army at 17 in an era when women had no military role, and ultimately turned the tide of the Hundred Years\' War.',
    chronicleQuery: 'Joan of Arc',
  },
  {
    name: 'Razia Sultana',
    dates: '1205–1240',
    birthYear: 1205,
    deathYear: 1240,
    field: 'Politics',
    nationality: 'Indian (Delhi Sultanate)',
    region: 'Asia',
    era: 'Medieval',
    what_she_did: 'The first and only female ruler of the Delhi Sultanate, she was appointed by her father Iltutmish who considered her more capable than his sons. She ruled without the veil, administered justice from the throne, and led armies into battle. Though her reign was cut short by nobles who resented female rule, she governed with fairness and skill.',
    why_it_mattered: 'She proved that merit, not gender, determined ability to rule — a radical idea in 13th-century South Asia.',
    famous_quote: 'If my people do not accept me as their ruler, let my life be taken from me.',
    breaking_barrier: 'The only woman to ever rule the Delhi Sultanate, chosen over her brothers for her superior abilities.',
    chronicleQuery: 'Razia Sultana',
  },

  // ── Early Modern ──
  {
    name: 'Queen Elizabeth I',
    dates: '1533–1603',
    birthYear: 1533,
    deathYear: 1603,
    field: 'Politics',
    nationality: 'English',
    region: 'Europe',
    era: 'Early Modern',
    what_she_did: 'Ruled England for 44 years during its golden age, navigating religious conflict between Catholics and Protestants with the Elizabethan Settlement. She defeated the Spanish Armada, sponsored exploration of the New World, and presided over a cultural renaissance that produced Shakespeare. She never married, declaring herself wedded to England.',
    why_it_mattered: 'She transformed England from a minor power to a major European force and proved that a single woman could outmaneuver the most powerful kings in Europe.',
    famous_quote: 'I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king.',
    breaking_barrier: 'Ruled as an unmarried woman for over four decades in an age when women were considered incapable of governance.',
    chronicleQuery: 'Elizabeth I',
  },
  {
    name: 'Catherine the Great',
    dates: '1729–1796',
    birthYear: 1729,
    deathYear: 1796,
    field: 'Politics',
    nationality: 'Russian (born Prussian)',
    region: 'Europe',
    era: 'Early Modern',
    what_she_did: 'Seized power from her husband Peter III and ruled Russia for 34 years, making it one of the great powers of Europe. She modernized Russia along Western European lines, expanded territory to include Crimea and parts of Poland, and championed the arts and education. She corresponded with Voltaire and Diderot and founded the Hermitage Museum.',
    why_it_mattered: 'She transformed Russia into a modern European power and was one of the most effective rulers of the Enlightenment era.',
    famous_quote: 'I shall be an autocrat: that\'s my trade. And the good Lord will forgive me: that\'s his.',
    breaking_barrier: 'A foreign-born woman who seized the Russian throne and became the longest-ruling female leader in Russian history.',
    chronicleQuery: 'Catherine the Great',
  },
  {
    name: 'Sor Juana Inés de la Cruz',
    dates: '1648–1695',
    birthYear: 1648,
    deathYear: 1695,
    field: 'Literature',
    nationality: 'Mexican (New Spain)',
    region: 'Americas',
    era: 'Early Modern',
    what_she_did: 'A self-taught scholar who became the greatest poet of colonial Latin America. She entered a convent to pursue intellectual life, as it was the only path available to women, and amassed one of the largest private libraries in the Americas. She wrote poetry, plays, and philosophical essays defending women\'s right to education.',
    why_it_mattered: 'She became the first published feminist of the Americas, arguing for women\'s intellectual equality 150 years before the suffrage movement.',
    famous_quote: 'One can perfectly well philosophize while cooking supper.',
    breaking_barrier: 'First major feminist voice in the Americas, she defended women\'s right to education in the 17th century.',
    chronicleQuery: 'Sor Juana',
  },
  {
    name: 'Mary Wollstonecraft',
    dates: '1759–1797',
    birthYear: 1759,
    deathYear: 1797,
    field: 'Activism',
    nationality: 'English',
    region: 'Europe',
    era: 'Early Modern',
    what_she_did: 'Wrote "A Vindication of the Rights of Woman" (1792), one of the earliest works of feminist philosophy, arguing that women are not naturally inferior to men but only appear so because of lack of education. She worked as a teacher, governess, and writer, and traveled alone to revolutionary France. Her daughter was Mary Shelley.',
    why_it_mattered: 'She laid the philosophical foundation for the entire women\'s rights movement that would follow.',
    famous_quote: 'I do not wish women to have power over men, but over themselves.',
    breaking_barrier: 'Wrote the foundational text of feminist philosophy, arguing for women\'s equality based on reason.',
    chronicleQuery: 'Mary Wollstonecraft',
  },

  // ── 19th Century ──
  {
    name: 'Harriet Tubman',
    dates: 'c. 1822–1913',
    birthYear: 1822,
    deathYear: 1913,
    field: 'Activism',
    nationality: 'American',
    region: 'Americas',
    era: '19th Century',
    what_she_did: 'Escaped slavery and then made 13 dangerous missions back to the South via the Underground Railroad, personally freeing about 70 enslaved people. During the Civil War, she served as a spy, scout, and nurse for the Union Army, and led the Combahee River Raid that liberated over 700 enslaved people. She later worked for women\'s suffrage.',
    why_it_mattered: 'She risked her life repeatedly to free others and proved that one person\'s courage could break the chains of an entire system.',
    famous_quote: 'I freed a thousand slaves. I could have freed a thousand more if only they knew they were slaves.',
    breaking_barrier: 'First woman to lead an armed assault during the Civil War (Combahee River Raid).',
    chronicleQuery: 'Harriet Tubman',
  },
  {
    name: 'Sojourner Truth',
    dates: 'c. 1797–1883',
    birthYear: 1797,
    deathYear: 1883,
    field: 'Activism',
    nationality: 'American',
    region: 'Americas',
    era: '19th Century',
    what_she_did: 'Born into slavery, she became one of the most powerful orators of the 19th century, speaking out for both abolition and women\'s rights. Her famous "Ain\'t I a Woman?" speech challenged the intersection of racial and gender discrimination. She also successfully sued a white man in court to recover her son — one of the first Black women to win such a case.',
    why_it_mattered: 'She was among the first to articulate the intersectionality of race and gender oppression, a framework still central to social justice.',
    famous_quote: 'Ain\'t I a woman? Look at me! Look at my arm! I have ploughed and planted, and no man could head me.',
    breaking_barrier: 'One of the first Black women to successfully sue a white man in an American court.',
    chronicleQuery: 'Sojourner Truth',
  },
  {
    name: 'Florence Nightingale',
    dates: '1820–1910',
    birthYear: 1820,
    deathYear: 1910,
    field: 'Science',
    nationality: 'English',
    region: 'Europe',
    era: '19th Century',
    what_she_did: 'Revolutionized nursing during the Crimean War by introducing sanitary practices that dramatically reduced death rates. She used statistical analysis to prove that most soldiers died of preventable diseases rather than combat wounds, creating innovative data visualizations (the polar area diagram). She established the first secular nursing school in the world.',
    why_it_mattered: 'She transformed nursing from a disreputable occupation into a respected profession and pioneered evidence-based medicine.',
    famous_quote: 'I attribute my success to this: I never gave or took any excuse.',
    breaking_barrier: 'Founded modern nursing as a profession and was the first woman admitted to the Royal Statistical Society.',
    chronicleQuery: 'Florence Nightingale',
  },
  {
    name: 'Ada Lovelace',
    dates: '1815–1852',
    birthYear: 1815,
    deathYear: 1852,
    field: 'Science',
    nationality: 'English',
    region: 'Europe',
    era: '19th Century',
    what_she_did: 'Worked with Charles Babbage on his Analytical Engine, writing what is widely considered the first computer program — an algorithm for the machine to compute Bernoulli numbers. She foresaw that computers could go beyond mere calculation to create music, art, and more. Her notes on the Engine were more extensive than Babbage\'s own papers.',
    why_it_mattered: 'She envisioned the potential of computing a century before modern computers existed, making her the prophet of the digital age.',
    famous_quote: 'That brain of mine is something more than merely mortal, as time will show.',
    breaking_barrier: 'Recognized as the world\'s first computer programmer, a full century before the digital revolution.',
    chronicleQuery: 'Ada Lovelace',
  },
  {
    name: 'Mary Shelley',
    dates: '1797–1851',
    birthYear: 1797,
    deathYear: 1851,
    field: 'Literature',
    nationality: 'English',
    region: 'Europe',
    era: '19th Century',
    what_she_did: 'At just 18 years old, she wrote "Frankenstein; or, The Modern Prometheus," widely considered the first science fiction novel. The book explored themes of scientific ethics, creation, and the consequences of unchecked ambition that remain relevant today. She continued writing novels, short stories, and travel narratives throughout her life.',
    why_it_mattered: 'She invented an entirely new literary genre — science fiction — and raised ethical questions about science that humanity still grapples with.',
    famous_quote: 'Beware; for I am fearless, and therefore powerful.',
    breaking_barrier: 'Created the science fiction genre at age 18, when women writers were largely dismissed.',
    chronicleQuery: 'Mary Shelley',
  },
  {
    name: 'Elizabeth Cady Stanton',
    dates: '1815–1902',
    birthYear: 1815,
    deathYear: 1902,
    field: 'Activism',
    nationality: 'American',
    region: 'Americas',
    era: '19th Century',
    what_she_did: 'Co-organized the Seneca Falls Convention (1848), the first women\'s rights convention in the US, and drafted the Declaration of Sentiments proclaiming that "all men and women are created equal." She worked alongside Susan B. Anthony for over 50 years, fighting for women\'s suffrage, property rights, and divorce reform.',
    why_it_mattered: 'She helped launch the organized women\'s suffrage movement that would eventually win the vote in 1920.',
    famous_quote: 'The best protection any woman can have is courage.',
    breaking_barrier: 'Co-organized the first women\'s rights convention in American history and authored the foundational feminist declaration.',
    chronicleQuery: 'Elizabeth Cady Stanton',
  },
  {
    name: 'George Eliot (Mary Ann Evans)',
    dates: '1819–1880',
    birthYear: 1819,
    deathYear: 1880,
    field: 'Literature',
    nationality: 'English',
    region: 'Europe',
    era: '19th Century',
    what_she_did: 'Used a male pen name to ensure her works would be taken seriously, and became one of the greatest novelists in the English language. Her masterpiece "Middlemarch" is widely considered one of the greatest novels ever written. She tackled themes of political reform, women\'s lives, and moral complexity with unprecedented psychological depth.',
    why_it_mattered: 'She demonstrated that the "female perspective" in literature could achieve the highest artistry, paving the way for women novelists to be taken seriously.',
    famous_quote: 'It is never too late to be what you might have been.',
    breaking_barrier: 'Achieved recognition as one of the greatest English novelists despite having to hide her gender to be published.',
    chronicleQuery: 'George Eliot',
  },
  {
    name: 'Harriet Beecher Stowe',
    dates: '1811–1896',
    birthYear: 1811,
    deathYear: 1896,
    field: 'Literature',
    nationality: 'American',
    region: 'Americas',
    era: '19th Century',
    what_she_did: 'Wrote "Uncle Tom\'s Cabin" (1852), which became the best-selling novel of the 19th century and energized the anti-slavery movement. The book was so influential that when Abraham Lincoln met Stowe, he reportedly said, "So you\'re the little woman who wrote the book that started this great war." She continued to write and advocate for social causes throughout her life.',
    why_it_mattered: 'Her novel changed public opinion on slavery and helped precipitate the American Civil War — one of the most impactful works of fiction ever written.',
    famous_quote: 'The longest way must have its close — the gloomiest night will wear on to a morning.',
    breaking_barrier: 'Wrote the most politically influential American novel of the 19th century, helping to end slavery.',
    chronicleQuery: 'Harriet Beecher Stowe',
  },

  // ── 20th Century ──
  {
    name: 'Marie Curie',
    dates: '1867–1934',
    birthYear: 1867,
    deathYear: 1934,
    field: 'Science',
    nationality: 'Polish / French',
    region: 'Europe',
    era: '20th Century',
    what_she_did: 'Discovered two elements (polonium and radium) and pioneered research in radioactivity — a term she coined. She was the first woman to win a Nobel Prize, the first person to win two Nobel Prizes, and remains the only person to win Nobel Prizes in two different sciences (Physics and Chemistry). During WWI, she developed mobile X-ray units to help battlefield surgeons.',
    why_it_mattered: 'She shattered the glass ceiling in science so completely that her achievements remain unmatched by most scientists of any gender.',
    famous_quote: 'Nothing in life is to be feared, it is only to be understood.',
    breaking_barrier: 'First woman to win a Nobel Prize (1903) and the only person ever to win Nobel Prizes in two different sciences.',
    chronicleQuery: 'Marie Curie',
  },
  {
    name: 'Virginia Woolf',
    dates: '1882–1941',
    birthYear: 1882,
    deathYear: 1941,
    field: 'Literature',
    nationality: 'English',
    region: 'Europe',
    era: '20th Century',
    what_she_did: 'Revolutionized the novel with her stream-of-consciousness technique in works like "Mrs Dalloway" and "To the Lighthouse." Her essay "A Room of One\'s Own" became a foundational feminist text arguing that women need financial independence and private space to create. She co-founded the Hogarth Press, publishing T.S. Eliot and Sigmund Freud.',
    why_it_mattered: 'She transformed how novels could be written and articulated the material conditions necessary for women\'s creative freedom.',
    famous_quote: 'A woman must have money and a room of her own if she is to write fiction.',
    breaking_barrier: 'Pioneered modernist literature and wrote the definitive argument for women\'s creative independence.',
    chronicleQuery: 'Virginia Woolf',
  },
  {
    name: 'Coco Chanel',
    dates: '1883–1971',
    birthYear: 1883,
    deathYear: 1971,
    field: 'Arts',
    nationality: 'French',
    region: 'Europe',
    era: '20th Century',
    what_she_did: 'Revolutionized women\'s fashion by freeing them from corsets and introducing comfortable, elegant designs. She popularized the "little black dress," Chanel No. 5 perfume, and costume jewelry. Rising from an orphanage to build one of the most iconic luxury brands in history, she fundamentally changed how women dressed and presented themselves.',
    why_it_mattered: 'She liberated women\'s bodies from restrictive clothing and proved that fashion could be both comfortable and powerful.',
    famous_quote: 'A girl should be two things: who and what she wants.',
    breaking_barrier: 'Transformed fashion from an instrument of restriction to one of liberation, building a global empire from nothing.',
    chronicleQuery: 'Coco Chanel',
  },
  {
    name: 'Amelia Earhart',
    dates: '1897–1937',
    birthYear: 1897,
    deathYear: 1937,
    field: 'Science',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Became the first woman to fly solo across the Atlantic Ocean in 1932, and set numerous other aviation records. She was a best-selling author and helped found The Ninety-Nines, an organization for female pilots. She disappeared over the Pacific Ocean in 1937 during an attempt to circumnavigate the globe.',
    why_it_mattered: 'She demonstrated that women could match men in courage, skill, and daring, inspiring generations of women in aviation and beyond.',
    famous_quote: 'The most difficult thing is the decision to act, the rest is merely tenacity.',
    breaking_barrier: 'First woman to fly solo across the Atlantic Ocean.',
    chronicleQuery: 'Amelia Earhart',
  },
  {
    name: 'Frida Kahlo',
    dates: '1907–1954',
    birthYear: 1907,
    deathYear: 1954,
    field: 'Arts',
    nationality: 'Mexican',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Created deeply personal and politically charged art that drew on Mexican folk traditions, surrealism, and her own experience with chronic pain and disability. She produced 143 paintings, 55 of which were unflinching self-portraits. She was also a political activist and one of the first major artists to openly explore female sexuality and identity.',
    why_it_mattered: 'She proved that art about women\'s pain, bodies, and inner lives was just as valid and powerful as any other subject.',
    famous_quote: 'I used to think I was the strangest person in the world. Then I thought there are so many people in the world, there must be someone just like me.',
    breaking_barrier: 'Became one of the most recognized artists in history while centering women\'s bodily experiences and Mexican identity.',
    chronicleQuery: 'Frida Kahlo',
  },
  {
    name: 'Simone de Beauvoir',
    dates: '1908–1986',
    birthYear: 1908,
    deathYear: 1986,
    field: 'Literature',
    nationality: 'French',
    region: 'Europe',
    era: '20th Century',
    what_she_did: 'Wrote "The Second Sex" (1949), the foundational text of modern feminism, arguing that "one is not born, but rather becomes, a woman." She was a leading existentialist philosopher, novelist, and political activist. Her work laid the intellectual groundwork for the second-wave feminist movement of the 1960s and 70s.',
    why_it_mattered: 'She provided the philosophical framework that the modern women\'s movement was built upon.',
    famous_quote: 'One is not born, but rather becomes, a woman.',
    breaking_barrier: 'Wrote the intellectual foundation of modern feminism and proved women could stand as equals in philosophy.',
    chronicleQuery: 'Simone de Beauvoir',
  },
  {
    name: 'Eleanor Roosevelt',
    dates: '1884–1962',
    birthYear: 1884,
    deathYear: 1962,
    field: 'Politics',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Transformed the role of First Lady from ceremonial figurehead to active political advocate. She held press conferences, wrote a daily syndicated newspaper column, and championed civil rights, women\'s rights, and human rights. After FDR\'s death, she chaired the UN committee that drafted the Universal Declaration of Human Rights.',
    why_it_mattered: 'She redefined what women in positions of influence could accomplish and helped establish the framework for international human rights.',
    famous_quote: 'No one can make you feel inferior without your consent.',
    breaking_barrier: 'First delegate to the United Nations and chaired the committee that created the Universal Declaration of Human Rights.',
    chronicleQuery: 'Eleanor Roosevelt',
  },
  {
    name: 'Rosa Parks',
    dates: '1913–2005',
    birthYear: 1913,
    deathYear: 2005,
    field: 'Activism',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Refused to give up her bus seat to a white passenger in Montgomery, Alabama in 1955, sparking the Montgomery Bus Boycott that lasted 381 days. Her act of defiance was not spontaneous — she was a trained activist and NAACP secretary. The boycott led to a Supreme Court ruling that segregated buses were unconstitutional.',
    why_it_mattered: 'Her quiet courage catalyzed the American civil rights movement and showed that one person\'s refusal to accept injustice can change the world.',
    famous_quote: 'I have learned over the years that when one\'s mind is made up, this diminishes fear.',
    breaking_barrier: 'Sparked the civil rights movement\'s most successful boycott, leading to the desegregation of public transportation.',
    chronicleQuery: 'Rosa Parks',
  },
  {
    name: 'Rachel Carson',
    dates: '1907–1964',
    birthYear: 1907,
    deathYear: 1964,
    field: 'Science',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Wrote "Silent Spring" (1962), which documented the devastating environmental effects of pesticides like DDT. Despite fierce opposition from the chemical industry, her work led to the banning of DDT and the creation of the U.S. Environmental Protection Agency. She is widely credited with launching the modern environmental movement.',
    why_it_mattered: 'She single-handedly started the environmental movement, fundamentally changing humanity\'s relationship with the natural world.',
    famous_quote: 'In every outward and visible grace, the Lord God had made this world in the form of beauty.',
    breaking_barrier: 'A marine biologist who took on the entire chemical industry and launched the modern environmental movement.',
    chronicleQuery: 'Rachel Carson',
  },
  {
    name: 'Indira Gandhi',
    dates: '1917–1984',
    birthYear: 1917,
    deathYear: 1984,
    field: 'Politics',
    nationality: 'Indian',
    region: 'Asia',
    era: '20th Century',
    what_she_did: 'Served as Prime Minister of India for nearly 16 years, becoming the world\'s longest-serving female head of government at the time. She led India through the Bangladesh Liberation War, nationalized banks, launched the Green Revolution that made India self-sufficient in food production, and oversaw India\'s first nuclear test.',
    why_it_mattered: 'She demonstrated that a woman could lead the world\'s largest democracy through war and transformation.',
    famous_quote: 'You cannot shake hands with a clenched fist.',
    breaking_barrier: 'First and only female Prime Minister of India, governing the world\'s largest democracy.',
    chronicleQuery: 'Indira Gandhi',
  },
  {
    name: 'Ruth Bader Ginsburg',
    dates: '1933–2020',
    birthYear: 1933,
    deathYear: 2020,
    field: 'Politics',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'As a lawyer, she won five of six landmark cases before the Supreme Court arguing for gender equality. As a Supreme Court Justice for 27 years, she became a champion of women\'s rights, civil liberties, and equal protection. She was only the second woman ever appointed to the Supreme Court.',
    why_it_mattered: 'She systematically dismantled legal gender discrimination case by case, changing American law forever.',
    famous_quote: 'Women belong in all places where decisions are being made.',
    breaking_barrier: 'Won landmark Supreme Court cases establishing that the Equal Protection Clause applies to gender discrimination.',
    chronicleQuery: 'Ruth Bader Ginsburg',
  },
  {
    name: 'Wangari Maathai',
    dates: '1940–2011',
    birthYear: 1940,
    deathYear: 2011,
    field: 'Activism',
    nationality: 'Kenyan',
    region: 'Africa / Middle East',
    era: '20th Century',
    what_she_did: 'Founded the Green Belt Movement, which has planted over 51 million trees across Africa. She was the first African woman to receive the Nobel Peace Prize (2004) for her contribution to sustainable development, democracy, and peace. She endured beatings, imprisonment, and death threats for challenging the Kenyan government\'s deforestation policies.',
    why_it_mattered: 'She showed that environmental conservation and women\'s empowerment are deeply interconnected.',
    famous_quote: 'It\'s the little things citizens do. That\'s what will make the difference. My little thing is planting trees.',
    breaking_barrier: 'First African woman to win the Nobel Peace Prize and first woman in East Africa to earn a doctoral degree.',
    chronicleQuery: 'Wangari Maathai',
  },
  {
    name: 'Toni Morrison',
    dates: '1931–2019',
    birthYear: 1931,
    deathYear: 2019,
    field: 'Literature',
    nationality: 'American',
    region: 'Americas',
    era: '20th Century',
    what_she_did: 'Won the Nobel Prize in Literature (1993), the first African American woman to do so. Her novels — "Beloved," "Song of Solomon," "The Bluest Eye" — explored the Black American experience with poetic language and unflinching honesty. As an editor at Random House, she also championed Black literature and published Angela Davis and Muhammad Ali.',
    why_it_mattered: 'She proved that Black women\'s stories were not marginal but central to the American literary canon.',
    famous_quote: 'If there\'s a book that you want to read, but it hasn\'t been written yet, then you must write it.',
    breaking_barrier: 'First African American woman to win the Nobel Prize in Literature.',
    chronicleQuery: 'Toni Morrison',
  },
  {
    name: 'Malala Yousafzai',
    dates: '1997–',
    birthYear: 1997,
    deathYear: null,
    field: 'Activism',
    nationality: 'Pakistani',
    region: 'Asia',
    era: '20th Century',
    what_she_did: 'Began advocating for girls\' education at age 11 in Pakistan\'s Swat Valley under Taliban occupation. She was shot in the head by a Taliban gunman in 2012 but survived and continued her activism with even greater determination. She became the youngest-ever Nobel Peace Prize laureate at age 17 and founded the Malala Fund to champion girls\' education worldwide.',
    why_it_mattered: 'She showed the world that a single girl\'s voice, armed with nothing but courage, could challenge the most violent extremism.',
    famous_quote: 'One child, one teacher, one book, one pen can change the world.',
    breaking_barrier: 'Youngest-ever Nobel Peace Prize laureate (age 17).',
    chronicleQuery: 'Malala Yousafzai',
  },
];

/* ──────────────────────────── Constants ──────────────────────────── */

const ERAS = ['All', 'Ancient', 'Medieval', 'Early Modern', '19th Century', '20th Century'] as const;
const FIELDS = ['All', 'Politics', 'Science', 'Literature', 'Activism', 'Military', 'Arts'] as const;
const REGIONS = ['All', 'Europe', 'Americas', 'Asia', 'Africa / Middle East'] as const;

const ERA_COLORS: Record<string, string> = {
  'Ancient': '#f59e0b',
  'Medieval': '#ef4444',
  'Early Modern': '#8b5cf6',
  '19th Century': '#3b82f6',
  '20th Century': '#10b981',
};

const FIELD_COLORS: Record<string, string> = {
  'Politics': '#a855f7',
  'Science': '#3b82f6',
  'Literature': '#f97316',
  'Activism': '#ef4444',
  'Military': '#6b7280',
  'Arts': '#ec4899',
};

const NOTABLE_FIRSTS = [
  { year: 'c. 1478 BCE', who: 'Hatshepsut', what: 'First woman to rule as Pharaoh of Egypt' },
  { year: '690 CE', who: 'Wu Zetian', what: 'First (and only) woman to be Emperor of China' },
  { year: '1843', who: 'Ada Lovelace', what: 'First computer programmer in history' },
  { year: '1849', who: 'Elizabeth Blackwell', what: 'First woman to receive a medical degree in the US' },
  { year: '1903', who: 'Marie Curie', what: 'First woman to win a Nobel Prize' },
  { year: '1932', who: 'Amelia Earhart', what: 'First woman to fly solo across the Atlantic' },
  { year: '1955', who: 'Rosa Parks', what: 'Sparked the civil rights movement\'s most successful boycott' },
  { year: '1963', who: 'Valentina Tereshkova', what: 'First woman in space' },
  { year: '1993', who: 'Toni Morrison', what: 'First African American woman to win the Nobel Prize in Literature' },
  { year: '2014', who: 'Malala Yousafzai', what: 'Youngest-ever Nobel Peace Prize laureate' },
];

const DID_YOU_KNOW = [
  'Hypatia\'s students included Christians, pagans, and foreigners — she refused to discriminate.',
  'Ada Lovelace predicted that computers could compose music in 1843 — 150 years before AI-generated music.',
  'Marie Curie\'s notebooks are still so radioactive they must be stored in lead-lined boxes.',
  'Harriet Tubman carried a revolver on Underground Railroad missions — both for protection and to discourage anyone from turning back.',
  'Frida Kahlo\'s self-portraits were not vanity — she said "I paint myself because I am so often alone."',
  'Eleanor Roosevelt resigned from the Daughters of the American Revolution when they refused to let Marian Anderson perform.',
  'Mary Shelley was only 18 when she wrote Frankenstein, after a ghost story contest with Lord Byron and Percy Shelley.',
  'Sor Juana Inés de la Cruz once cut her hair short, vowing not to let it grow back until she mastered a subject she was studying.',
];

const CONNECTIONS: { from: string; to: string; relationship: string }[] = [
  { from: 'Mary Wollstonecraft', to: 'Mary Shelley', relationship: 'Mother and daughter — Wollstonecraft died giving birth to Shelley' },
  { from: 'Mary Wollstonecraft', to: 'Elizabeth Cady Stanton', relationship: 'Wollstonecraft\'s writings directly inspired the Seneca Falls Convention' },
  { from: 'Elizabeth Cady Stanton', to: 'Sojourner Truth', relationship: 'Both spoke at women\'s rights conventions, though disagreed on priorities' },
  { from: 'Sojourner Truth', to: 'Harriet Tubman', relationship: 'Both escaped slavery and fought for abolition and women\'s rights' },
  { from: 'Harriet Tubman', to: 'Rosa Parks', relationship: 'Parks cited Tubman as an inspiration for her own activism' },
  { from: 'Simone de Beauvoir', to: 'Ruth Bader Ginsburg', relationship: 'Beauvoir\'s philosophy influenced Ginsburg\'s legal arguments for gender equality' },
  { from: 'Florence Nightingale', to: 'Rachel Carson', relationship: 'Both used data and evidence to fight establishment interests — one in medicine, one in environment' },
  { from: 'Virginia Woolf', to: 'Toni Morrison', relationship: 'Morrison studied Woolf\'s techniques and expanded them to center Black women\'s consciousness' },
];

/* ──────────────────────────── Helper Components ──────────────────────────── */

function FilterPills({
  label,
  options,
  selected,
  onSelect,
  colorMap,
}: {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  colorMap?: Record<string, string>;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500, minWidth: 50 }}>{label}</span>
      {options.map((opt) => {
        const active = selected === opt;
        const color = opt !== 'All' && colorMap?.[opt] ? colorMap[opt] : '#60a5fa';
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: active ? `1px solid ${color}66` : '1px solid rgba(255,255,255,0.08)',
              background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
              color: active ? color : '#94a3b8',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms ease',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function WomanCard({ woman, index }: { woman: WomanProfile; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const eraColor = ERA_COLORS[woman.era] || '#94a3b8';
  const fieldColor = FIELD_COLORS[woman.field] || '#94a3b8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        borderLeft: `3px solid ${fieldColor}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${fieldColor}44`;
        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.borderLeftColor = fieldColor;
        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 18, fontWeight: 600 }}>{woman.name}</h3>
          <div style={{ color: '#94a3b8', fontSize: 13, marginTop: 2 }}>{woman.dates}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            background: `${eraColor}22`, color: eraColor, border: `1px solid ${eraColor}33`,
          }}>
            {woman.era}
          </span>
          <span style={{
            padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
            background: `${fieldColor}22`, color: fieldColor, border: `1px solid ${fieldColor}33`,
          }}>
            {woman.field}
          </span>
        </div>
      </div>

      {/* Nationality */}
      <div style={{ color: '#64748b', fontSize: 12, marginBottom: 10 }}>{woman.nationality}</div>

      {/* Bio */}
      <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px 0' }}>
        {woman.what_she_did}
      </p>

      {/* Breaking barrier */}
      <div style={{
        background: 'rgba(251, 191, 36, 0.08)',
        border: '1px solid rgba(251, 191, 36, 0.2)',
        borderRadius: 8,
        padding: '8px 12px',
        marginBottom: 12,
      }}>
        <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Breaking Barrier
        </span>
        <p style={{ color: '#fde68a', fontSize: 12, margin: '4px 0 0 0', lineHeight: 1.5 }}>
          {woman.breaking_barrier}
        </p>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {/* Why it mattered */}
            <div style={{ marginBottom: 12 }}>
              <span style={{ color: '#60a5fa', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Why It Mattered
              </span>
              <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0 0', lineHeight: 1.5 }}>
                {woman.why_it_mattered}
              </p>
            </div>

            {/* Quote */}
            <div style={{
              borderLeft: `2px solid ${fieldColor}`,
              paddingLeft: 12,
              marginBottom: 12,
            }}>
              <p style={{ color: '#e2e8f0', fontSize: 13, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                "{woman.famous_quote}"
              </p>
              <span style={{ color: '#64748b', fontSize: 11 }}>— {woman.name}</span>
            </div>

            {/* Link to Chronicle search */}
            <Link
              to={`/search?q=${encodeURIComponent(woman.chronicleQuery)}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#60a5fa',
                fontSize: 12,
                textDecoration: 'none',
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
              }}
            >
              Search in Chronicle →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimelineView({ women }: { women: WomanProfile[] }) {
  const sorted = useMemo(() => [...women].sort((a, b) => a.birthYear - b.birthYear), [women]);
  const minYear = sorted[0]?.birthYear ?? -1500;
  const maxYear = Math.max(...sorted.map((w) => w.deathYear ?? 2026));
  const range = maxYear - minYear;

  return (
    <div style={{ padding: '20px 0', overflowX: 'auto' }}>
      <div style={{ position: 'relative', minHeight: sorted.length * 32 + 40, minWidth: 800 }}>
        {/* Axis */}
        <div style={{
          position: 'absolute', top: 0, left: 160, right: 20, height: 1,
          background: 'rgba(255,255,255,0.1)',
        }} />
        {/* Axis labels */}
        {[-1000, -500, 0, 500, 1000, 1500, 2000].filter((y) => y >= minYear && y <= maxYear).map((year) => {
          const pct = ((year - minYear) / range) * 100;
          return (
            <span key={year} style={{
              position: 'absolute', top: -18, left: `calc(160px + ${pct}% * (100% - 180px) / 100%)`,
              color: '#64748b', fontSize: 10, transform: 'translateX(-50%)',
            }}>
              {year < 0 ? `${Math.abs(year)} BCE` : year === 0 ? '1 CE' : `${year}`}
            </span>
          );
        })}

        {sorted.map((w, i) => {
          const startPct = ((w.birthYear - minYear) / range) * 100;
          const endPct = (((w.deathYear ?? 2026) - minYear) / range) * 100;
          const fieldColor = FIELD_COLORS[w.field] || '#94a3b8';
          return (
            <div key={w.name} style={{ position: 'absolute', top: i * 32 + 30, left: 0, right: 20, height: 26 }}>
              <span style={{
                position: 'absolute', left: 0, width: 150, fontSize: 11, color: '#cbd5e1',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '26px',
              }}>
                {w.name}
              </span>
              <div style={{
                position: 'absolute',
                left: `calc(160px + ${startPct}% * (100% - 180px) / 100%)`,
                width: `calc(${endPct - startPct}% * (100% - 180px) / 100%)`,
                minWidth: 4,
                height: 18,
                top: 4,
                borderRadius: 4,
                background: `linear-gradient(90deg, ${fieldColor}88, ${fieldColor})`,
                opacity: 0.8,
              }}
                title={`${w.name}: ${w.dates}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────── Main Page ──────────────────────────── */

type ViewMode = 'cards' | 'timeline';

export default function WomenPage() {
  const [eraFilter, setEraFilter] = useState('All');
  const [fieldFilter, setFieldFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [showConnections, setShowConnections] = useState(false);

  const filtered = useMemo(() => {
    return WOMEN.filter((w) => {
      if (eraFilter !== 'All' && w.era !== eraFilter) return false;
      if (fieldFilter !== 'All' && w.field !== fieldFilter) return false;
      if (regionFilter !== 'All' && w.region !== regionFilter) return false;
      return true;
    });
  }, [eraFilter, fieldFilter, regionFilter]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0e1a 0%, #0f172a 50%, #0a0e1a 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Nav breadcrumb */}
      <nav style={{
        display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 14 }}>Chronicle</Link>
        <span style={{ color: '#475569' }}>/</span>
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>Women in History</span>
      </nav>

      {/* Hero */}
      <header style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 42, fontWeight: 700, margin: 0,
            background: 'linear-gradient(135deg, #f472b6, #c084fc, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          The Women Who Shaped History
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ color: '#94a3b8', fontSize: 18, marginTop: 12, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}
        >
          These stories belong in every history book
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}
        >
          {WOMEN.length} profiles · From {WOMEN.reduce((m, w) => Math.min(m, w.birthYear), 0) < 0
            ? `${Math.abs(WOMEN.reduce((m, w) => Math.min(m, w.birthYear), 0))} BCE`
            : WOMEN.reduce((m, w) => Math.min(m, w.birthYear), 0)} to present
        </motion.div>
      </header>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px' }}>

        {/* Filters */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <FilterPills label="Era" options={ERAS} selected={eraFilter} onSelect={setEraFilter} colorMap={ERA_COLORS} />
          <FilterPills label="Field" options={FIELDS} selected={fieldFilter} onSelect={setFieldFilter} colorMap={FIELD_COLORS} />
          <FilterPills label="Region" options={REGIONS} selected={regionFilter} onSelect={setRegionFilter} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <span style={{ color: '#64748b', fontSize: 12 }}>
              Showing {filtered.length} of {WOMEN.length} profiles
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['cards', 'timeline'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    border: viewMode === mode ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    background: viewMode === mode ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.04)',
                    color: viewMode === mode ? '#60a5fa' : '#94a3b8',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                    textTransform: 'capitalize',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards or Timeline View */}
        {viewMode === 'cards' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((w, i) => (
                <WomanCard key={w.name} woman={w} index={i} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 48,
          }}>
            <h2 style={{ color: '#e2e8f0', fontSize: 20, fontWeight: 600, margin: '0 0 16px 0' }}>
              Chronological Timeline
            </h2>
            <TimelineView women={filtered} />
          </div>
        )}

        {/* Notable Firsts */}
        <section style={{
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ color: '#f472b6', fontSize: 22, fontWeight: 600, margin: '0 0 20px 0' }}>
            Notable Firsts
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
            {NOTABLE_FIRSTS.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span style={{
                  color: '#fbbf24',
                  fontSize: 12,
                  fontWeight: 600,
                  minWidth: 80,
                  flexShrink: 0,
                }}>
                  {f.year}
                </span>
                <div>
                  <span style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{f.who}</span>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}> — {f.what}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Connections + Did You Know — side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Connections */}
          <section style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 24,
          }}>
            <h2 style={{ color: '#c084fc', fontSize: 20, fontWeight: 600, margin: '0 0 16px 0' }}>
              Connections
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px 0' }}>
              These women influenced each other across centuries.
            </p>
            {CONNECTIONS.map((c, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '8px 0',
                borderBottom: i < CONNECTIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <span style={{ color: '#c084fc', fontSize: 13, fontWeight: 600 }}>{c.from}</span>
                  <span style={{ color: '#475569', fontSize: 12 }}>→</span>
                  <span style={{ color: '#60a5fa', fontSize: 13, fontWeight: 600 }}>{c.to}</span>
                </div>
                <span style={{ color: '#64748b', fontSize: 12, lineHeight: 1.4 }}>{c.relationship}</span>
              </div>
            ))}
          </section>

          {/* Did You Know */}
          <section style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12,
            padding: 24,
          }}>
            <h2 style={{ color: '#fbbf24', fontSize: 20, fontWeight: 600, margin: '0 0 16px 0' }}>
              Did You Know?
            </h2>
            {DID_YOU_KNOW.map((fact, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < DID_YOU_KNOW.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex',
                gap: 10,
              }}>
                <span style={{ color: '#fbbf24', fontSize: 14, flexShrink: 0 }}>*</span>
                <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{fact}</p>
              </div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: '#475569', fontSize: 13 }}>
            This list is far from exhaustive. History is full of remarkable women whose stories deserve to be told.
          </p>
          <Link to="/" style={{ color: '#60a5fa', fontSize: 13, textDecoration: 'none' }}>
            ← Back to Chronicle
          </Link>
        </footer>
      </div>
    </div>
  );
}
