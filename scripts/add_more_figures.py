#!/usr/bin/env python3
"""
add_more_figures.py

Adds 60+ historical figures to the Chronicle database, focusing on 
underrepresented regions, women, and diverse eras. Also creates 
event_people links to connect figures to relevant existing events.
"""

import asyncio
import asyncpg
import uuid

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ────────────────────────────────────────────────────────────────────────────
# NEW PEOPLE DATA
# Format: (name, birth_year, death_year, nationalities[], roles[], gender, 
#          wikipedia_slug, description)
# For BCE dates, use negative years (e.g., -1500 for 1500 BCE)
# ────────────────────────────────────────────────────────────────────────────

NEW_PEOPLE = [
    # ═══════════════════════════════════════════════════════════════════════
    # WOMEN IN HISTORY
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Hatshepsut", -1507, -1458, ["Egyptian"], ["Pharaoh", "Ruler"], "female",
     "Hatshepsut",
     "One of ancient Egypt's most successful pharaohs, ruling for over 20 years during the 18th Dynasty. She expanded trade networks and commissioned extensive building projects including her mortuary temple at Deir el-Bahri."),
    
    ("Nefertiti", -1370, -1330, ["Egyptian"], ["Queen", "Ruler"], "female",
     "Nefertiti",
     "Powerful queen of Egypt and wife of Pharaoh Akhenaten, playing a prominent role in the religious revolution to monotheistic Atenism. Her iconic painted bust is one of the most copied works of ancient Egypt."),
    
    ("Wu Zetian", 624, 705, ["Chinese"], ["Empress", "Ruler"], "female",
     "Wu_Zetian",
     "The only woman in Chinese history to assume the title of Empress Regnant, ruling the Tang Dynasty for 15 years. She expanded China's borders, reformed the civil service examination, and promoted Buddhism."),
    
    ("Eleanor of Aquitaine", 1122, 1204, ["French", "English"], ["Queen", "Duchess", "Patron"], "female",
     "Eleanor_of_Aquitaine",
     "One of the most powerful women of the Middle Ages, Queen consort of both France and England. She participated in the Second Crusade and was a patron of literature and the arts."),
    
    ("Hildegard of Bingen", 1098, 1179, ["German"], ["Abbess", "Writer", "Composer", "Philosopher"], "female",
     "Hildegard_of_Bingen",
     "Medieval polymath who composed liturgical music, wrote theological and botanical works, and founded monasteries. She is considered the founder of scientific natural history in Germany."),
    
    ("Murasaki Shikibu", 978, 1014, ["Japanese"], ["Writer", "Lady-in-waiting"], "female",
     "Murasaki_Shikibu",
     "Japanese novelist and lady-in-waiting at the Imperial court, author of The Tale of Genji, often called the world's first novel and a masterpiece of Japanese literature."),
    
    ("Catherine the Great", 1729, 1796, ["Russian", "German"], ["Empress", "Ruler"], "female",
     "Catherine_the_Great",
     "Longest-ruling female leader of Russia, who presided over the Russian Enlightenment and expanded the Russian Empire. She was a patron of arts, literature, and education."),
    
    ("Harriet Tubman", 1822, 1913, ["American"], ["Abolitionist", "Activist", "Scout"], "female",
     "Harriet_Tubman",
     "Escaped slave who became a conductor on the Underground Railroad, leading roughly 70 enslaved people to freedom. She later served as a scout and spy for the Union Army during the Civil War."),
    
    ("Ada Lovelace", 1815, 1852, ["British"], ["Mathematician", "Writer"], "female",
     "Ada_Lovelace",
     "English mathematician and writer, often regarded as the first computer programmer for her work on Charles Babbage's Analytical Engine. Her notes include what is recognized as the first algorithm."),
    
    ("Sojourner Truth", 1797, 1883, ["American"], ["Abolitionist", "Activist"], "female",
     "Sojourner_Truth",
     "African American abolitionist and women's rights activist, born into slavery, who became a powerful orator. Her famous 'Ain't I a Woman?' speech became iconic in the fight for equality."),
    
    ("Emmeline Pankhurst", 1858, 1928, ["British"], ["Suffragette", "Activist"], "female",
     "Emmeline_Pankhurst",
     "British political activist and leader of the suffragette movement who helped women win the right to vote. She founded the Women's Social and Political Union, known for militant tactics."),
    
    ("Hypatia", -360, -415, ["Greek", "Egyptian"], ["Philosopher", "Mathematician", "Astronomer"], "female",
     "Hypatia",
     "Neoplatonist philosopher, astronomer, and mathematician in Alexandria, Egypt. She was one of the last great scholars of the ancient Library of Alexandria and was killed by a Christian mob."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ASIA - China, Japan, Mongolia, Southeast Asia
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Laozi", -571, -471, ["Chinese"], ["Philosopher", "Writer"], "male",
     "Laozi",
     "Ancient Chinese philosopher and writer, traditionally regarded as the founder of Taoism and author of the Tao Te Ching. His teachings emphasize living in harmony with the Tao."),
    
    ("Sun Tzu", -544, -496, ["Chinese"], ["Military Strategist", "General", "Writer"], "male",
     "Sun_Tzu",
     "Ancient Chinese military strategist and author of The Art of War, an influential treatise on military strategy that has been applied to business and competitive endeavors worldwide."),
    
    ("Qin Shi Huang", -259, -210, ["Chinese"], ["Emperor", "Ruler"], "male",
     "Qin_Shi_Huang",
     "First Emperor of unified China who ended the Warring States period. He standardized weights, measures, and writing, built the first Great Wall sections, and created the famous Terracotta Army."),
    
    ("Kublai Khan", 1215, 1294, ["Mongolian", "Chinese"], ["Emperor", "Khan", "Ruler"], "male",
     "Kublai_Khan",
     "Fifth Great Khan of the Mongol Empire and founder of the Yuan dynasty in China. He completed the Mongol conquest of China and established one of the largest contiguous empires in history."),
    
    ("Zheng He", 1371, 1433, ["Chinese"], ["Admiral", "Explorer", "Diplomat"], "male",
     "Zheng_He",
     "Chinese mariner and explorer who led seven massive naval expeditions throughout Southeast Asia, South Asia, and East Africa. His treasure fleet was the largest naval force the world had seen."),
    
    ("Tokugawa Ieyasu", 1543, 1616, ["Japanese"], ["Shogun", "Ruler", "Military Leader"], "male",
     "Tokugawa_Ieyasu",
     "Founder and first shogun of the Tokugawa shogunate that ruled Japan for over 250 years. He unified Japan after a century of civil war and established an era of peace known as Pax Tokugawa."),
    
    ("Oda Nobunaga", 1534, 1582, ["Japanese"], ["Daimyo", "Military Leader"], "male",
     "Oda_Nobunaga",
     "Powerful daimyo who initiated the unification of Japan during the late Sengoku period. Known for innovative military tactics and use of firearms, he laid the groundwork for the Tokugawa era."),
    
    ("Toyotomi Hideyoshi", 1537, 1598, ["Japanese"], ["Regent", "Military Leader"], "male",
     "Toyotomi_Hideyoshi",
     "Japanese samurai who rose from peasant origins to become the second 'Great Unifier' of Japan. He completed the unification begun by Oda Nobunaga and attempted invasions of Korea."),
    
    ("Akbar the Great", 1542, 1605, ["Indian", "Mughal"], ["Emperor", "Ruler"], "male",
     "Akbar",
     "Third Mughal emperor who greatly expanded and consolidated the Mughal Empire in India. Known for his religious tolerance, administrative innovations, and patronage of arts and culture."),
    
    ("Siddhartha Gautama", -563, -483, ["Indian", "Nepalese"], ["Religious Leader", "Philosopher", "Teacher"], "male",
     "Gautama_Buddha",
     "Founder of Buddhism who attained enlightenment under the Bodhi tree and taught the path to Nirvana. His teachings spread across Asia and profoundly influenced world philosophy and religion."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC WORLD - Middle East, North Africa, Central Asia
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Muhammad", 570, 632, ["Arabian"], ["Prophet", "Religious Leader", "Political Leader"], "male",
     "Muhammad",
     "Founder of Islam, believed by Muslims to be the last prophet of God. He unified Arabia under a single religion and established the foundations of Islamic civilization."),
    
    ("Avicenna", 980, 1037, ["Persian"], ["Philosopher", "Physician", "Polymath"], "male",
     "Avicenna",
     "Persian polymath regarded as one of the most significant thinkers of the Islamic Golden Age. His Canon of Medicine was a standard medical text in Europe and the Islamic world for centuries."),
    
    ("Al-Khwarizmi", 780, 850, ["Persian"], ["Mathematician", "Astronomer", "Geographer"], "male",
     "Muhammad_ibn_Musa_al-Khwarizmi",
     "Persian mathematician whose works introduced Hindu-Arabic numerals and algebra to the Western world. The word 'algorithm' derives from the Latin form of his name."),
    
    ("Rumi", 1207, 1273, ["Persian"], ["Poet", "Sufi Mystic", "Scholar"], "male",
     "Rumi",
     "Persian poet and Sufi mystic whose poetry transcends cultural and linguistic borders. His works are among the most widely read poetry in the world, exploring themes of love and spirituality."),
    
    ("Omar Khayyam", 1048, 1131, ["Persian"], ["Mathematician", "Astronomer", "Poet"], "male",
     "Omar_Khayyam",
     "Persian polymath known for his contributions to mathematics and astronomy, as well as his collection of poetry, the Rubaiyat. He reformed the Persian calendar to remarkable accuracy."),
    
    ("Ibn Khaldun", 1332, 1406, ["Tunisian", "Arab"], ["Historian", "Philosopher", "Sociologist"], "male",
     "Ibn_Khaldun",
     "Arab historiographer and historian, regarded as a founding father of sociology and economics. His Muqaddimah outlined theories of social cohesion and cycles of civilization."),
    
    ("Harun al-Rashid", 763, 809, ["Arabian", "Iraqi"], ["Caliph", "Ruler"], "male",
     "Harun_al-Rashid",
     "Fifth Abbasid Caliph who presided over the Islamic Golden Age at its zenith. His court in Baghdad became a center of learning, arts, and culture, immortalized in One Thousand and One Nights."),
    
    ("Suleiman the Magnificent", 1494, 1566, ["Turkish", "Ottoman"], ["Sultan", "Ruler"], "male",
     "Suleiman_the_Magnificent",
     "Longest-reigning Sultan of the Ottoman Empire, presiding over its golden age. He expanded the empire's borders, reformed laws, and patronized the arts and architecture."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # AFRICA - Sub-Saharan Africa
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Mansa Musa", 1280, 1337, ["Malian"], ["Emperor", "Ruler"], "male",
     "Mansa_Musa",
     "Ruler of the Mali Empire and possibly the wealthiest person in history. His famous pilgrimage to Mecca distributed so much gold it caused inflation across the Mediterranean."),
    
    ("Sundiata Keita", 1217, 1255, ["Malian"], ["Emperor", "Founder", "Warrior"], "male",
     "Sundiata_Keita",
     "Founder of the Mali Empire and a legendary hero in West African oral tradition. His victory at the Battle of Kirina established Mali as a major power controlling trans-Saharan trade."),
    
    ("Shaka Zulu", 1787, 1828, ["South African", "Zulu"], ["King", "Military Leader"], "male",
     "Shaka",
     "Founder of the Zulu Kingdom, revolutionizing military tactics with innovations like the short stabbing spear and the 'horns of the buffalo' formation. His campaigns reshaped southern African politics."),
    
    ("Askia Muhammad I", 1443, 1538, ["Songhay"], ["Emperor", "Ruler"], "male",
     "Askia_Mohammad_I",
     "Emperor of the Songhai Empire who expanded it to its largest extent, making it the largest empire in African history. He established a system of Islamic schools and reformed administration."),
    
    ("Haile Selassie", 1892, 1975, ["Ethiopian"], ["Emperor", "Ruler"], "male",
     "Haile_Selassie",
     "Last Emperor of Ethiopia who modernized the country and became a symbol of African independence. He is revered as the messiah of the Rastafari movement."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAS - Pre-Columbian and Colonial Era
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Moctezuma II", 1466, 1520, ["Aztec", "Mexican"], ["Emperor", "Ruler"], "male",
     "Moctezuma_II",
     "Ninth ruler of the Aztec Empire at its peak, overseeing expansion and consolidation of power. He encountered Hernán Cortés and died during the Spanish conquest of Mexico."),
    
    ("Pachacuti", 1418, 1471, ["Incan", "Peruvian"], ["Emperor", "Ruler", "Builder"], "male",
     "Pachacuti",
     "Ninth Sapa Inca who transformed the Inca state from a small kingdom into the vast Tawantinsuyu empire. He rebuilt Cusco and is credited with constructing Machu Picchu."),
    
    ("Atahualpa", 1502, 1533, ["Incan", "Peruvian"], ["Emperor", "Ruler"], "male",
     "Atahualpa",
     "Last Sapa Inca of the Inca Empire before Spanish conquest. Captured by Francisco Pizarro despite paying a massive ransom, he was executed, marking the end of Inca independence."),
    
    ("Tecumseh", 1768, 1813, ["Shawnee", "American"], ["Chief", "Military Leader", "Activist"], "male",
     "Tecumseh",
     "Shawnee leader who attempted to unite Native American tribes into a confederacy to resist American expansion. He allied with the British during the War of 1812."),
    
    ("Toussaint Louverture", 1743, 1803, ["Haitian"], ["Revolutionary Leader", "General"], "male",
     "Toussaint_Louverture",
     "Leader of the Haitian Revolution, the only successful slave revolt that led to the establishment of a free state. His military and political genius challenged French, Spanish, and British forces."),
    
    ("Sitting Bull", 1831, 1890, ["Lakota Sioux", "American"], ["Chief", "Holy Man", "Warrior"], "male",
     "Sitting_Bull",
     "Hunkpapa Lakota leader who united Sioux tribes in resistance against US government policies. He led his people to victory at the Battle of Little Bighorn against General Custer."),
    
    ("Geronimo", 1829, 1909, ["Apache", "American"], ["Leader", "Warrior"], "male",
     "Geronimo",
     "Apache leader who led his people in resistance against US and Mexican military campaigns for decades. He became a symbol of Native American resistance."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTISTS, INVENTORS, AND THINKERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Archimedes", -287, -212, ["Greek"], ["Mathematician", "Physicist", "Engineer", "Inventor"], "male",
     "Archimedes",
     "Ancient Greek mathematician and inventor who discovered the principles of buoyancy and the lever. He made fundamental contributions to geometry and designed war machines to defend Syracuse."),
    
    ("Euclid", -325, -270, ["Greek"], ["Mathematician"], "male",
     "Euclid",
     "Ancient Greek mathematician known as the 'Father of Geometry.' His treatise Elements served as the main textbook for teaching mathematics for over 2,000 years."),
    
    ("Ptolemy", 100, 170, ["Greek", "Egyptian"], ["Astronomer", "Mathematician", "Geographer"], "male",
     "Ptolemy",
     "Greco-Egyptian astronomer and mathematician whose geocentric model of the universe dominated Western astronomy for over 1,400 years. His Geography also shaped medieval cartography."),
    
    ("Francis Bacon", 1561, 1626, ["English"], ["Philosopher", "Statesman", "Scientist"], "male",
     "Francis_Bacon",
     "English philosopher and statesman who developed the scientific method of inductive reasoning. He is considered the father of empiricism and influenced the scientific revolution."),
    
    ("René Descartes", 1596, 1650, ["French"], ["Philosopher", "Mathematician", "Scientist"], "male",
     "Ren%C3%A9_Descartes",
     "French philosopher and mathematician who founded modern Western philosophy and analytical geometry. His statement 'I think, therefore I am' became a fundamental element of Western philosophy."),
    
    ("Johannes Kepler", 1571, 1630, ["German"], ["Astronomer", "Mathematician"], "male",
     "Johannes_Kepler",
     "German astronomer who discovered the laws of planetary motion, establishing that planets orbit the Sun in ellipses. His work was fundamental to Newton's theory of gravitation."),
    
    ("Robert Hooke", 1635, 1703, ["English"], ["Scientist", "Architect"], "male",
     "Robert_Hooke",
     "English scientist who coined the term 'cell' in biology after observing cork under a microscope. He made contributions to physics, astronomy, and helped rebuild London after the Great Fire."),
    
    ("Antoine Lavoisier", 1743, 1794, ["French"], ["Chemist", "Biologist"], "male",
     "Antoine_Lavoisier",
     "French chemist known as the 'Father of Modern Chemistry.' He identified oxygen and hydrogen, established the law of conservation of mass, and was guillotined during the French Revolution."),
    
    ("Michael Faraday", 1791, 1867, ["British"], ["Scientist", "Physicist", "Chemist"], "male",
     "Michael_Faraday",
     "English scientist who made fundamental contributions to electromagnetism and electrochemistry. His discoveries of electromagnetic induction form the basis of electric motor technology."),
    
    ("James Clerk Maxwell", 1831, 1879, ["Scottish", "British"], ["Physicist", "Mathematician"], "male",
     "James_Clerk_Maxwell",
     "Scottish physicist who formulated the classical theory of electromagnetic radiation. His equations unified electricity, magnetism, and light as manifestations of the same phenomenon."),
    
    ("Louis Pasteur", 1822, 1895, ["French"], ["Chemist", "Microbiologist"], "male",
     "Louis_Pasteur",
     "French chemist and microbiologist who proved germ theory, invented pasteurization, and developed vaccines for rabies and anthrax. He is considered one of the founders of microbiology."),
    
    ("Gregor Mendel", 1822, 1884, ["Austrian"], ["Scientist", "Friar"], "male",
     "Gregor_Mendel",
     "Austrian friar and scientist who discovered the basic principles of heredity through experiments with pea plants. He is regarded as the 'Father of Genetics.'"),
    
    ("Max Planck", 1858, 1947, ["German"], ["Physicist"], "male",
     "Max_Planck",
     "German physicist who originated quantum theory, fundamentally changing understanding of atomic and subatomic processes. He won the Nobel Prize in Physics in 1918."),
    
    ("Niels Bohr", 1885, 1962, ["Danish"], ["Physicist"], "male",
     "Niels_Bohr",
     "Danish physicist who made foundational contributions to understanding atomic structure and quantum theory. He received the Nobel Prize in Physics in 1922 for his model of the atom."),
    
    ("Werner Heisenberg", 1901, 1976, ["German"], ["Physicist"], "male",
     "Werner_Heisenberg",
     "German physicist and pioneer of quantum mechanics who formulated the uncertainty principle. He won the Nobel Prize in Physics in 1932 for the creation of quantum mechanics."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # PHILOSOPHERS AND WRITERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Socrates", -470, -399, ["Greek"], ["Philosopher"], "male",
     "Socrates",
     "Classical Greek philosopher credited as one of the founders of Western philosophy. Known for his Socratic method of questioning, he was sentenced to death for corrupting Athenian youth."),
    
    ("Plato", -428, -348, ["Greek"], ["Philosopher", "Writer"], "male",
     "Plato",
     "Athenian philosopher who founded the Academy and wrote philosophical dialogues exploring justice, beauty, and equality. His works, featuring Socrates, profoundly influenced Western thought."),
    
    ("Immanuel Kant", 1724, 1804, ["German"], ["Philosopher"], "male",
     "Immanuel_Kant",
     "German philosopher whose Critique of Pure Reason is considered one of the most influential works in philosophy. He attempted to synthesize rationalism and empiricism."),
    
    ("John Locke", 1632, 1704, ["English"], ["Philosopher", "Physician"], "male",
     "John_Locke",
     "English philosopher whose ideas influenced the American and French Revolutions. His theories of mind and knowledge, and his social contract theory, shaped liberal political philosophy."),
    
    ("Voltaire", 1694, 1778, ["French"], ["Writer", "Philosopher"], "male",
     "Voltaire",
     "French Enlightenment writer and philosopher known for his wit and criticism of Christianity. His advocacy of civil liberties influenced the American and French Revolutions."),
    
    ("Jean-Jacques Rousseau", 1712, 1778, ["French", "Swiss"], ["Philosopher", "Writer", "Composer"], "male",
     "Jean-Jacques_Rousseau",
     "Genevan philosopher whose political philosophy influenced the French Revolution and modern political thought. His The Social Contract argued that legitimacy comes from popular sovereignty."),
    
    ("Friedrich Nietzsche", 1844, 1900, ["German"], ["Philosopher", "Writer"], "male",
     "Friedrich_Nietzsche",
     "German philosopher whose work challenged traditional morality and religion. His concepts including the 'will to power' and 'Übermensch' profoundly influenced 20th-century philosophy."),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ARTISTS AND COMPOSERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Wolfgang Amadeus Mozart", 1756, 1791, ["Austrian"], ["Composer", "Musician"], "male",
     "Wolfgang_Amadeus_Mozart",
     "Prolific and influential composer of the Classical period who created over 600 works. A child prodigy, his operas, symphonies, and concertos remain central to the classical repertoire."),
    
    ("Johann Sebastian Bach", 1685, 1750, ["German"], ["Composer", "Musician"], "male",
     "Johann_Sebastian_Bach",
     "German composer and musician of the Baroque period, known for instrumental compositions and vocal music. His works represent the culmination of the Baroque style."),
    
    ("Rembrandt", 1606, 1669, ["Dutch"], ["Painter", "Printmaker"], "male",
     "Rembrandt",
     "Dutch painter and printmaker considered one of the greatest visual artists in history. His mastery of light and shadow revolutionized portraiture and self-portraiture."),
    
    ("Claude Monet", 1840, 1926, ["French"], ["Painter"], "male",
     "Claude_Monet",
     "French painter and founder of Impressionism, whose innovative technique of capturing light and color transformed Western painting. His Water Lilies series is among the most recognized artworks."),
    
    ("Pablo Picasso", 1881, 1973, ["Spanish"], ["Painter", "Sculptor"], "male",
     "Pablo_Picasso",
     "Spanish painter and sculptor who co-founded Cubism and made extraordinary contributions to Symbolism and Surrealism. His Guernica is one of the most powerful anti-war paintings in history."),
]

# ────────────────────────────────────────────────────────────────────────────
# EVENT LINKS - Map person names to event title keywords for linking
# ────────────────────────────────────────────────────────────────────────────

EVENT_LINKS = {
    "Hatshepsut": [("hatshepsut", "ruler")],
    "Nefertiti": [("akhenaten", "participant"), ("amarna", "participant")],
    "Wu Zetian": [("tang", "ruler")],
    "Catherine the Great": [("russian enlightenment", "ruler"), ("partition of poland", "participant")],
    "Harriet Tubman": [("underground railroad", "leader"), ("civil war", "participant")],
    "Ada Lovelace": [("babbage", "collaborator")],
    "Emmeline Pankhurst": [("suffrage", "leader"), ("women's rights", "leader")],
    "Hypatia": [("alexandria", "scholar")],
    
    "Laozi": [("taoism", "founder"), ("warring states", "philosopher")],
    "Sun Tzu": [("art of war", "author"), ("warring states", "strategist")],
    "Qin Shi Huang": [("qin", "ruler"), ("terracotta", "commissioner"), ("great wall", "builder")],
    "Kublai Khan": [("yuan", "founder"), ("mongol", "ruler"), ("marco polo", "host")],
    "Zheng He": [("treasure fleet", "admiral"), ("ming voyages", "leader")],
    "Tokugawa Ieyasu": [("tokugawa", "founder"), ("edo", "ruler"), ("sekigahara", "victor")],
    "Oda Nobunaga": [("unification of japan", "initiator")],
    "Akbar the Great": [("mughal", "ruler")],
    "Siddhartha Gautama": [("buddhism", "founder"), ("enlightenment", "founder")],
    
    "Muhammad": [("islam", "founder"), ("medina", "leader"), ("mecca", "prophet")],
    "Avicenna": [("golden age", "scholar"), ("medicine", "author")],
    "Al-Khwarizmi": [("algebra", "founder"), ("golden age", "mathematician")],
    "Rumi": [("sufi", "poet")],
    "Omar Khayyam": [("persian", "poet"), ("calendar", "reformer")],
    "Ibn Khaldun": [("muqaddimah", "author")],
    "Harun al-Rashid": [("abbasid", "caliph"), ("golden age", "ruler")],
    "Suleiman the Magnificent": [("ottoman", "sultan"), ("vienna", "besieger")],
    
    "Mansa Musa": [("mali", "ruler"), ("mecca pilgrimage", "pilgrim")],
    "Sundiata Keita": [("mali empire", "founder")],
    "Shaka Zulu": [("zulu", "founder")],
    "Haile Selassie": [("ethiopia", "emperor"), ("league of nations", "speaker")],
    
    "Moctezuma II": [("aztec", "ruler"), ("cortés", "encounter")],
    "Pachacuti": [("inca", "ruler"), ("machu picchu", "builder")],
    "Atahualpa": [("inca", "ruler"), ("pizarro", "captive")],
    "Tecumseh": [("native american", "leader"), ("war of 1812", "ally")],
    "Toussaint Louverture": [("haitian revolution", "leader")],
    "Sitting Bull": [("little bighorn", "victor"), ("sioux", "leader")],
    
    "Archimedes": [("syracuse", "defender"), ("eureka", "discoverer")],
    "Euclid": [("geometry", "founder"), ("elements", "author")],
    "Ptolemy": [("geocentric", "author"), ("alexandria", "astronomer")],
    "Francis Bacon": [("scientific method", "founder")],
    "René Descartes": [("cartesian", "founder"), ("philosophy", "founder")],
    "Johannes Kepler": [("planetary motion", "discoverer"), ("copernican", "supporter")],
    "Antoine Lavoisier": [("oxygen", "discoverer"), ("chemistry", "founder"), ("french revolution", "victim")],
    "Michael Faraday": [("electromagnetism", "discoverer")],
    "James Clerk Maxwell": [("electromagnetic", "theorist")],
    "Louis Pasteur": [("pasteurization", "inventor"), ("germ theory", "prover")],
    "Gregor Mendel": [("genetics", "founder")],
    "Max Planck": [("quantum", "founder")],
    "Niels Bohr": [("atomic model", "developer"), ("quantum", "contributor")],
    "Werner Heisenberg": [("uncertainty principle", "formulator"), ("quantum", "pioneer")],
    
    "Socrates": [("athenian", "philosopher"), ("trial", "defendant")],
    "Plato": [("academy", "founder"), ("philosophy", "founder")],
    "Immanuel Kant": [("enlightenment", "philosopher")],
    "John Locke": [("social contract", "theorist"), ("enlightenment", "philosopher")],
    "Voltaire": [("enlightenment", "writer"), ("french", "philosopher")],
    "Jean-Jacques Rousseau": [("social contract", "author"), ("enlightenment", "philosopher")],
    "Friedrich Nietzsche": [("philosophy", "iconoclast")],
    
    "Wolfgang Amadeus Mozart": [("classical music", "composer"), ("vienna", "composer")],
    "Johann Sebastian Bach": [("baroque", "composer")],
    "Rembrandt": [("dutch golden age", "painter")],
    "Claude Monet": [("impressionism", "founder")],
    "Pablo Picasso": [("cubism", "founder"), ("guernica", "painter")],
}


async def main():
    print("Connecting to database...")
    conn = await asyncpg.connect(DB_URL)
    
    try:
        # Get existing people to avoid duplicates
        existing = await conn.fetch("SELECT name FROM people")
        existing_names = {row['name'].lower() for row in existing}
        print(f"Found {len(existing_names)} existing people in database")
        
        # Filter out people already in DB
        to_insert = [p for p in NEW_PEOPLE if p[0].lower() not in existing_names]
        print(f"Will insert {len(to_insert)} new people (skipping {len(NEW_PEOPLE) - len(to_insert)} duplicates)")
        
        if not to_insert:
            print("No new people to insert!")
            return
        
        # Insert new people
        inserted_count = 0
        person_ids = {}  # Map name to UUID for event linking
        
        for person in to_insert:
            name, birth_year, death_year, nationalities, roles, gender, wiki_slug, description = person
            
            person_id = uuid.uuid4()
            person_ids[name] = person_id
            
            await conn.execute("""
                INSERT INTO people (id, name, birth_year, death_year, nationalities, roles, gender, wikipedia_slug, description)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            """, person_id, name, birth_year, death_year, nationalities, roles, gender, wiki_slug, description)
            
            inserted_count += 1
            if inserted_count % 10 == 0:
                print(f"  Inserted {inserted_count} people...")
        
        print(f"✓ Inserted {inserted_count} new people")
        
        # Now link people to events
        print("\nLinking people to events...")
        links_created = 0
        
        for name, keywords in EVENT_LINKS.items():
            if name not in person_ids:
                # Person might already exist, try to get their ID
                row = await conn.fetchrow("SELECT id FROM people WHERE name = $1", name)
                if row:
                    person_ids[name] = row['id']
                else:
                    continue
            
            person_id = person_ids[name]
            
            for keyword, role in keywords:
                # Find events matching the keyword
                events = await conn.fetch("""
                    SELECT id, title FROM events 
                    WHERE title ILIKE $1
                    LIMIT 3
                """, f"%{keyword}%")
                
                for event in events:
                    # Check if link already exists
                    existing_link = await conn.fetchrow("""
                        SELECT 1 FROM event_people 
                        WHERE event_id = $1 AND person_id = $2 AND role = $3
                    """, event['id'], person_id, role)
                    
                    if not existing_link:
                        try:
                            await conn.execute("""
                                INSERT INTO event_people (event_id, person_id, role)
                                VALUES ($1, $2, $3)
                            """, event['id'], person_id, role)
                            links_created += 1
                        except Exception as e:
                            # Skip duplicates silently
                            pass
        
        print(f"✓ Created {links_created} event-people links")
        
        # Final count
        total = await conn.fetchval("SELECT COUNT(*) FROM people")
        print(f"\n✓ Total people in database: {total}")
        
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
