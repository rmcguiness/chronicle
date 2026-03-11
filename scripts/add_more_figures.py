#!/usr/bin/env python3
"""
add_more_figures.py

Adds 60+ additional historical figures to the Chronicle database,
covering underrepresented regions, notable women, scientists, and leaders.

Also creates event_people links connecting figures to relevant events.
"""

import asyncio
import asyncpg
from typing import Optional

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ────────────────────────────────────────────────────────────────────────────
# NEW HISTORICAL FIGURES
# Format: (name, birth_year, death_year, nationalities, roles, gender, description, wikipedia_slug, aliases)
# For BCE dates, use negative years (e.g., -69 for 69 BCE)
# ────────────────────────────────────────────────────────────────────────────

NEW_FIGURES = [
    # ═══════════════════════════════════════════════════════════════════════
    # NOTABLE WOMEN
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Hatshepsut", -1507, -1458, ["Egyptian"], ["Pharaoh", "Ruler"], "female",
     "One of ancient Egypt's most successful pharaohs, ruling for over 20 years during the 18th Dynasty. She expanded trade networks and commissioned extensive building projects including her famous mortuary temple at Deir el-Bahri.",
     "Hatshepsut", []),
    
    ("Nefertiti", -1370, -1330, ["Egyptian"], ["Queen", "Ruler"], "female",
     "Great Royal Wife of Pharaoh Akhenaten, famous for her beauty and power. She may have ruled Egypt briefly after her husband's death. Her painted limestone bust is one of the most recognized works of ancient art.",
     "Nefertiti", []),
    
    ("Wu Zetian", 624, 705, ["Chinese"], ["Empress", "Ruler"], "female",
     "The only woman in Chinese history to assume the title of Empress Regnant, ruling the Tang dynasty. She expanded China's borders, reformed the civil service examination system, and elevated Buddhism.",
     "Wu_Zetian", ["Empress Wu", "Wu Zhao"]),
    
    ("Eleanor of Aquitaine", 1122, 1204, ["French", "English"], ["Queen", "Duchess", "Ruler"], "female",
     "One of the wealthiest and most powerful women in medieval Europe. Queen consort of France, then England, she participated in the Second Crusade and was mother to Richard the Lionheart and King John.",
     "Eleanor_of_Aquitaine", []),
    
    ("Boudicca", 30, 61, ["British", "Celtic"], ["Queen", "Warrior", "Leader"], "female",
     "Queen of the Iceni tribe who led a major uprising against Roman occupation of Britain in 60-61 CE. Her rebellion destroyed several Roman settlements including Londinium before being defeated.",
     "Boudica", ["Boadicea", "Boudica"]),
    
    ("Ada Lovelace", 1815, 1852, ["British"], ["Mathematician", "Writer"], "female",
     "Often regarded as the first computer programmer for her work on Charles Babbage's Analytical Engine. Her notes include what is recognized as the first algorithm intended to be processed by a machine.",
     "Ada_Lovelace", ["Augusta Ada King, Countess of Lovelace"]),
    
    ("Harriet Tubman", 1822, 1913, ["American"], ["Abolitionist", "Activist", "Spy"], "female",
     "American abolitionist who escaped slavery and subsequently made about 13 missions to rescue approximately 70 enslaved people using the Underground Railroad. She later served as a spy for the Union Army during the Civil War.",
     "Harriet_Tubman", ["Araminta Ross"]),
    
    ("Empress Theodora", 500, 548, ["Byzantine"], ["Empress", "Ruler"], "female",
     "Byzantine empress and wife of Emperor Justinian I. She was influential in religious and political affairs, championed women's rights, and helped shape Byzantine law.",
     "Theodora_(wife_of_Justinian_I)", []),
    
    ("Hypatia", 360, 415, ["Greek", "Egyptian"], ["Philosopher", "Mathematician", "Astronomer"], "female",
     "One of the first female mathematicians and head of the Neoplatonic school in Alexandria. She taught philosophy and astronomy until her murder by a Christian mob, becoming a symbol of classical antiquity's end.",
     "Hypatia", ["Hypatia of Alexandria"]),
    
    ("Tomoe Gozen", 1157, 1247, ["Japanese"], ["Samurai", "Warrior"], "female",
     "One of the few female samurai warriors documented in Japanese history. She fought in the Genpei War and was renowned for her skill with sword, bow, and horsemanship.",
     "Tomoe_Gozen", []),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ASIAN LEADERS AND THINKERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Laozi", -601, -531, ["Chinese"], ["Philosopher", "Writer"], "male",
     "Ancient Chinese philosopher traditionally credited as the founder of Taoism and author of the Tao Te Ching. His philosophy emphasizes living in harmony with the Tao (the Way).",
     "Laozi", ["Lao Tzu", "Lao-Tze"]),
    
    ("Sun Tzu", -544, -496, ["Chinese"], ["Military Strategist", "Writer", "General"], "male",
     "Ancient Chinese military strategist and author of The Art of War, one of the most influential works on military strategy ever written. His principles are still studied in military academies and business schools worldwide.",
     "Sun_Tzu", ["Sunzi", "Sun Wu"]),
    
    ("Qin Shi Huang", -259, -210, ["Chinese"], ["Emperor", "Ruler"], "male",
     "First Emperor of a unified China who founded the Qin dynasty. He standardized weights, measures, and writing, built the first Great Wall sections, and was buried with the famous Terracotta Army.",
     "Qin_Shi_Huang", ["Ying Zheng", "First Emperor"]),
    
    ("Kublai Khan", 1215, 1294, ["Mongolian", "Chinese"], ["Emperor", "Ruler", "Conqueror"], "male",
     "Grandson of Genghis Khan who founded the Yuan dynasty and became the first non-Han emperor to conquer all of China. He expanded the Mongol Empire to its greatest extent and received Marco Polo at his court.",
     "Kublai_Khan", []),
    
    ("Zheng He", 1371, 1433, ["Chinese"], ["Admiral", "Explorer", "Diplomat"], "male",
     "Chinese mariner and diplomat who led seven massive naval expeditions throughout Southeast Asia, South Asia, Western Asia, and East Africa. His treasure fleet was the largest in the world at the time.",
     "Zheng_He", ["Cheng Ho"]),
    
    ("Tokugawa Ieyasu", 1543, 1616, ["Japanese"], ["Shogun", "Ruler", "Military Leader"], "male",
     "Founder and first shogun of the Tokugawa shogunate that ruled Japan for over 250 years. His victory at Sekigahara unified Japan and established an era of peace known as the Edo period.",
     "Tokugawa_Ieyasu", []),
    
    ("Akbar the Great", 1542, 1605, ["Indian", "Mughal"], ["Emperor", "Ruler"], "male",
     "Third Mughal emperor who expanded and consolidated the Mughal Empire in India. Known for his religious tolerance, administrative genius, and patronage of arts and culture.",
     "Akbar", ["Akbar I", "Jalaluddin Muhammad Akbar"]),
    
    ("Siddhartha Gautama", -563, -483, ["Indian", "Nepalese"], ["Philosopher", "Religious Leader", "Teacher"], "male",
     "The founder of Buddhism, known as the Buddha ('the awakened one'). Born a prince, he renounced worldly life to seek enlightenment and taught the path to liberation from suffering.",
     "Gautama_Buddha", ["Buddha", "Shakyamuni"]),
    
    ("Chandragupta Maurya", -340, -298, ["Indian"], ["Emperor", "Ruler", "Founder"], "male",
     "Founder of the Maurya Empire, one of the largest and most powerful empires in Indian history. With his advisor Chanakya, he overthrew the Nanda dynasty and repelled Greek invaders.",
     "Chandragupta_Maurya", []),
    
    ("Emperor Meiji", 1852, 1912, ["Japanese"], ["Emperor", "Ruler"], "male",
     "Emperor of Japan who presided over the Meiji Restoration, transforming Japan from an isolated feudal society into a modern industrial power in just a few decades.",
     "Emperor_Meiji", ["Mutsuhito"]),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC WORLD / MIDDLE EAST
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Al-Khwarizmi", 780, 850, ["Persian", "Arab"], ["Mathematician", "Astronomer", "Geographer"], "male",
     "Persian polymath whose work introduced Hindu-Arabic numerals and algebra to the Western world. The words 'algorithm' and 'algebra' derive from his name and book titles.",
     "Muhammad_ibn_Musa_al-Khwarizmi", ["Muhammad ibn Musa al-Khwarizmi"]),
    
    ("Omar Khayyam", 1048, 1131, ["Persian"], ["Mathematician", "Astronomer", "Poet"], "male",
     "Persian polymath known for his contributions to mathematics (solving cubic equations) and astronomy (the Jalali calendar). In the West, he is best remembered for his poetry collection, the Rubaiyat.",
     "Omar_Khayyam", []),
    
    ("Rumi", 1207, 1273, ["Persian", "Turkish"], ["Poet", "Philosopher", "Mystic"], "male",
     "13th-century Persian poet and Sufi mystic whose works on love and spirituality have transcended cultures. His poetry is among the most widely read in the world.",
     "Rumi", ["Jalal ad-Din Muhammad Rumi", "Mevlana"]),
    
    ("Avicenna", 980, 1037, ["Persian"], ["Philosopher", "Physician", "Scientist"], "male",
     "Persian polymath regarded as one of the most significant physicians, astronomers, and writers of the Islamic Golden Age. His Canon of Medicine was a standard medical text in Europe for 500 years.",
     "Avicenna", ["Ibn Sina"]),
    
    ("Averroes", 1126, 1198, ["Andalusian", "Arab"], ["Philosopher", "Physician", "Jurist"], "male",
     "Andalusian Muslim philosopher who wrote extensive commentaries on Aristotle, reviving European interest in the philosopher. His work bridged Islamic and Christian philosophy.",
     "Averroes", ["Ibn Rushd"]),
    
    ("Harun al-Rashid", 763, 809, ["Arab", "Persian"], ["Caliph", "Ruler"], "male",
     "Fifth Abbasid Caliph who presided over the Islamic Golden Age. His court in Baghdad was a center of learning, arts, and culture, immortalized in One Thousand and One Nights.",
     "Harun_al-Rashid", []),
    
    ("Suleiman the Magnificent", 1494, 1566, ["Turkish", "Ottoman"], ["Sultan", "Ruler"], "male",
     "Longest-reigning Sultan of the Ottoman Empire who presided over its Golden Age. Under his rule, the empire reached its greatest extent and flourished in arts, architecture, and law.",
     "Suleiman_the_Magnificent", ["Suleiman I", "Kanuni Sultan Süleyman"]),
    
    ("Cyrus the Great", -600, -530, ["Persian"], ["Emperor", "Ruler", "Conqueror"], "male",
     "Founder of the Achaemenid Persian Empire, the largest empire the world had yet seen. Known for his respect for the customs and religions of conquered peoples, exemplified in the Cyrus Cylinder.",
     "Cyrus_the_Great", []),
    
    # ═══════════════════════════════════════════════════════════════════════
    # AFRICA
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Mansa Musa", 1280, 1337, ["Malian"], ["Emperor", "Ruler"], "male",
     "Ruler of the Mali Empire, possibly the wealthiest person in history. His pilgrimage to Mecca with tons of gold caused inflation in Egypt and put Mali on European maps.",
     "Mansa_Musa", ["Musa I of Mali"]),
    
    ("Shaka Zulu", 1787, 1828, ["Zulu", "South African"], ["King", "Military Leader"], "male",
     "Founder of the Zulu Kingdom who revolutionized warfare in southern Africa with new tactics and weapons. His military innovations united the Zulu people into a powerful nation.",
     "Shaka", ["Shaka kaSenzangakhona"]),
    
    ("Sundiata Keita", 1217, 1255, ["Malian"], ["Emperor", "Founder", "Warrior"], "male",
     "Founder of the Mali Empire and a heroic figure in West African oral tradition. He defeated the Sosso king Sumanguru at the Battle of Kirina and established one of Africa's greatest empires.",
     "Sundiata_Keita", []),
    
    ("Haile Selassie", 1892, 1975, ["Ethiopian"], ["Emperor", "Ruler"], "male",
     "Last Emperor of Ethiopia who modernized the country and became a symbol of African independence. He is revered as the returned Messiah in the Rastafari movement.",
     "Haile_Selassie", ["Ras Tafari Makonnen"]),
    
    ("Queen Nzinga", 1583, 1663, ["Angolan"], ["Queen", "Warrior", "Diplomat"], "female",
     "Queen of the Mbundu kingdoms who resisted Portuguese colonization for over 30 years through diplomacy and military strategy. She remains a symbol of African resistance.",
     "Nzinga_of_Ndongo_and_Matamba", ["Ana de Sousa Nzinga Mbande"]),
    
    ("Ramesses II", -1303, -1213, ["Egyptian"], ["Pharaoh", "Ruler"], "male",
     "Often regarded as ancient Egypt's most powerful pharaoh, ruling for 66 years. He built more monuments than any other pharaoh and led Egypt in the famous Battle of Kadesh against the Hittites.",
     "Ramesses_II", ["Ramses the Great", "Ozymandias"]),
    
    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAS (Pre-Columbian and Colonial Era)
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Montezuma II", 1466, 1520, ["Aztec", "Mexican"], ["Emperor", "Ruler"], "male",
     "Ninth ruler of the Aztec Empire at its height, who received Hernán Cortés in Tenochtitlan. His reign ended with the Spanish conquest, during which he died under disputed circumstances.",
     "Moctezuma_II", ["Moctezuma", "Motecuhzoma Xocoyotzin"]),
    
    ("Pachacuti", 1418, 1472, ["Incan", "Peruvian"], ["Emperor", "Ruler", "Founder"], "male",
     "Ninth Sapa Inca who transformed the Kingdom of Cusco into the Inca Empire, the largest empire in pre-Columbian America. He is credited with building Machu Picchu and reorganizing Inca society.",
     "Pachacuti", ["Pachacutec"]),
    
    ("Tecumseh", 1768, 1813, ["Shawnee", "American"], ["Chief", "Warrior", "Leader"], "male",
     "Shawnee leader who sought to unite Native American tribes against American expansion. He formed a confederacy to resist settlement and fought alongside the British in the War of 1812.",
     "Tecumseh", []),
    
    ("Toussaint Louverture", 1743, 1803, ["Haitian"], ["General", "Revolutionary", "Leader"], "male",
     "Leader of the Haitian Revolution, the only successful slave revolt in history that led to the founding of Haiti. He transformed the enslaved into a revolutionary army that defeated French, Spanish, and British forces.",
     "Toussaint_Louverture", ["François-Dominique Toussaint Louverture"]),
    
    ("Sitting Bull", 1831, 1890, ["Lakota", "American"], ["Chief", "Holy Man", "Leader"], "male",
     "Hunkpapa Lakota leader who united Sioux tribes against U.S. government policies and led resistance at the Battle of Little Bighorn. He became a symbol of Native American resistance.",
     "Sitting_Bull", ["Tatanka Iyotake"]),
    
    ("Simón Bolívar", 1783, 1830, ["Venezuelan"], ["General", "Revolutionary", "President"], "male",
     "Military and political leader who led Venezuela, Colombia, Ecuador, Peru, and Bolivia to independence from Spain. Known as 'El Libertador,' he envisioned a united South America.",
     "Simón_Bolívar", ["El Libertador"]),
    
    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTISTS, THINKERS, AND INVENTORS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Johannes Kepler", 1571, 1630, ["German"], ["Astronomer", "Mathematician"], "male",
     "German astronomer who discovered the laws of planetary motion, fundamentally changing our understanding of the solar system. His work laid the groundwork for Newton's theory of gravity.",
     "Johannes_Kepler", []),
    
    ("Archimedes", -287, -212, ["Greek"], ["Mathematician", "Physicist", "Engineer", "Inventor"], "male",
     "Ancient Greek mathematician and inventor, considered one of the greatest scientists of antiquity. He discovered the principles of buoyancy and the lever, and invented machines of war.",
     "Archimedes", ["Archimedes of Syracuse"]),
    
    ("Euclid", -325, -265, ["Greek"], ["Mathematician"], "male",
     "Ancient Greek mathematician often referred to as the 'Father of Geometry.' His Elements is one of the most influential works in mathematics history, used as a textbook for over 2,000 years.",
     "Euclid", []),
    
    ("Pythagoras", -570, -495, ["Greek"], ["Mathematician", "Philosopher"], "male",
     "Ancient Greek philosopher and mathematician famous for the Pythagorean theorem. He founded a philosophical and religious movement that influenced Plato and Western philosophy.",
     "Pythagoras", []),
    
    ("Hippocrates", -460, -370, ["Greek"], ["Physician"], "male",
     "Ancient Greek physician considered the 'Father of Medicine.' He established medicine as a profession distinct from philosophy and religion, and the Hippocratic Oath bears his name.",
     "Hippocrates", ["Hippocrates of Kos"]),
    
    ("Plato", -428, -348, ["Greek"], ["Philosopher"], "male",
     "Ancient Greek philosopher who founded the Academy in Athens, the first institution of higher learning in the Western world. His dialogues exploring justice, beauty, and equality remain fundamental to philosophy.",
     "Plato", []),
    
    ("Socrates", -470, -399, ["Greek"], ["Philosopher"], "male",
     "Classical Greek philosopher credited as one of the founders of Western philosophy. He developed the Socratic method of questioning and was executed for 'corrupting the youth' of Athens.",
     "Socrates", []),
    
    ("René Descartes", 1596, 1650, ["French"], ["Philosopher", "Mathematician"], "male",
     "French philosopher and mathematician known as the 'Father of Modern Philosophy.' His statement 'I think, therefore I am' became a fundamental element of Western philosophy.",
     "René_Descartes", []),
    
    ("Benjamin Franklin", 1706, 1790, ["American"], ["Scientist", "Inventor", "Diplomat", "Statesman"], "male",
     "American polymath and Founding Father who made major contributions to science (electricity experiments), invented bifocals and the lightning rod, and helped draft the Declaration of Independence.",
     "Benjamin_Franklin", []),
    
    ("James Watt", 1736, 1819, ["Scottish", "British"], ["Inventor", "Engineer"], "male",
     "Scottish inventor whose improvements to the steam engine were fundamental to the Industrial Revolution. The watt, a unit of power, is named after him.",
     "James_Watt", []),
    
    ("Michael Faraday", 1791, 1867, ["British"], ["Scientist", "Chemist", "Physicist"], "male",
     "English scientist who contributed to the study of electromagnetism and electrochemistry. His discoveries of electromagnetic induction and electrolysis laid the groundwork for electric motors and generators.",
     "Michael_Faraday", []),
    
    ("Louis Pasteur", 1822, 1895, ["French"], ["Chemist", "Microbiologist"], "male",
     "French chemist and microbiologist renowned for his discoveries of vaccination, microbial fermentation, and pasteurization. His work saved countless lives and founded the science of microbiology.",
     "Louis_Pasteur", []),
    
    ("Thomas Edison", 1847, 1931, ["American"], ["Inventor", "Businessman"], "male",
     "American inventor who developed the phonograph, motion picture camera, and practical electric light bulb. He held over 1,000 patents and established the first industrial research laboratory.",
     "Thomas_Edison", []),
    
    ("Max Planck", 1858, 1947, ["German"], ["Physicist"], "male",
     "German physicist who originated quantum theory, revolutionizing our understanding of atomic and subatomic processes. He won the Nobel Prize in Physics in 1918.",
     "Max_Planck", []),
    
    ("Niels Bohr", 1885, 1962, ["Danish"], ["Physicist"], "male",
     "Danish physicist who made foundational contributions to understanding atomic structure and quantum theory. He won the Nobel Prize in Physics in 1922 for his model of the atom.",
     "Niels_Bohr", []),
    
    # ═══════════════════════════════════════════════════════════════════════
    # EXPLORERS AND TRAVELERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Leif Erikson", 970, 1020, ["Norse", "Icelandic"], ["Explorer"], "male",
     "Norse explorer believed to be the first European to land in continental North America, nearly 500 years before Columbus. He established a settlement at Vinland, likely in Newfoundland.",
     "Leif_Erikson", []),
    
    ("Vasco da Gama", 1469, 1524, ["Portuguese"], ["Explorer", "Navigator"], "male",
     "Portuguese explorer who was the first European to reach India by sea, linking Europe and Asia by ocean route. His voyages opened up trade routes that transformed global commerce.",
     "Vasco_da_Gama", []),
    
    ("Ferdinand Magellan", 1480, 1521, ["Portuguese"], ["Explorer", "Navigator"], "male",
     "Portuguese explorer who organized the first expedition to circumnavigate the Earth. Though he died in the Philippines, his voyage proved the Earth was round and much larger than believed.",
     "Ferdinand_Magellan", ["Fernão de Magalhães"]),
    
    ("James Cook", 1728, 1779, ["British"], ["Explorer", "Navigator", "Captain"], "male",
     "British explorer and navigator who made detailed maps of previously uncharted areas. He made the first European contact with Australia's eastern coast and the Hawaiian Islands.",
     "James_Cook", []),
    
    # ═══════════════════════════════════════════════════════════════════════
    # RELIGIOUS AND CULTURAL LEADERS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Moses", -1391, -1271, ["Hebrew"], ["Prophet", "Leader"], "male",
     "Prophet and leader in Judaism who led the Israelites out of Egyptian slavery and received the Ten Commandments at Mount Sinai. He is central to Judaism, Christianity, and Islam.",
     "Moses", []),
    
    ("Jesus Christ", -4, 33, ["Jewish"], ["Religious Leader", "Teacher"], "male",
     "Central figure of Christianity, believed by Christians to be the Son of God and the awaited Messiah. His teachings of love, forgiveness, and salvation transformed world history.",
     "Jesus", ["Jesus of Nazareth", "Christ"]),
    
    ("Muhammad", 570, 632, ["Arab"], ["Prophet", "Religious Leader", "Statesman"], "male",
     "Founder of Islam, believed by Muslims to be the final prophet of God. He united the Arabian Peninsula and established a religious, social, and political framework that spread across the world.",
     "Muhammad", ["Prophet Muhammad"]),
    
    ("Saint Augustine", 354, 430, ["Roman", "Berber"], ["Theologian", "Philosopher", "Bishop"], "male",
     "Early Christian theologian and philosopher whose writings influenced the development of Western Christianity and philosophy. His Confessions is considered the first Western autobiography.",
     "Augustine_of_Hippo", ["Augustine of Hippo"]),
    
    ("Dante Alighieri", 1265, 1321, ["Italian"], ["Poet", "Writer", "Philosopher"], "male",
     "Italian poet best known for the Divine Comedy, considered the greatest literary work in Italian and a masterpiece of world literature. He is called the 'Father of the Italian language.'",
     "Dante_Alighieri", []),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL NOTABLE FIGURES
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Attila the Hun", 406, 453, ["Hunnic"], ["Ruler", "Conqueror", "Military Leader"], "male",
     "Ruler of the Hunnic Empire who was one of the most feared enemies of the Western and Eastern Roman Empires. Called the 'Scourge of God,' he invaded the Balkans, Gaul, and Italy.",
     "Attila", ["Attila the Hun"]),
    
    ("William the Conqueror", 1028, 1087, ["Norman", "French", "English"], ["King", "Duke", "Conqueror"], "male",
     "Duke of Normandy who conquered England in 1066 and became its first Norman king. The Norman Conquest transformed English culture, language, and society.",
     "William_the_Conqueror", ["William I of England"]),
    
    ("Hernán Cortés", 1485, 1547, ["Spanish"], ["Conquistador", "Explorer"], "male",
     "Spanish conquistador who led the expedition that caused the fall of the Aztec Empire and brought large portions of Mexico under Spanish rule. His conquest dramatically changed the Americas.",
     "Hernán_Cortés", ["Hernan Cortes"]),
    
    ("Peter the Great", 1672, 1725, ["Russian"], ["Tsar", "Emperor", "Ruler"], "male",
     "Tsar and later Emperor of Russia who modernized and expanded Russia into a major European power. He founded St. Petersburg and reformed Russian government, military, and society.",
     "Peter_the_Great", ["Peter I of Russia"]),
    
    ("Catherine the Great", 1729, 1796, ["Russian", "German"], ["Empress", "Ruler"], "female",
     "Empress of Russia who expanded the empire, modernized its administration, and corresponded with Enlightenment philosophers. Under her rule, Russia became one of the great powers of Europe.",
     "Catherine_the_Great", ["Catherine II of Russia"]),
    
    ("Otto von Bismarck", 1815, 1898, ["German", "Prussian"], ["Chancellor", "Statesman"], "male",
     "Prussian statesman who unified Germany through diplomacy and war, becoming its first Chancellor. He dominated European affairs for decades and created the German welfare state.",
     "Otto_von_Bismarck", []),
]

# ────────────────────────────────────────────────────────────────────────────
# EVENT-PERSON LINKS
# Format: (person_name_substr, event_title_substr, role)
# ────────────────────────────────────────────────────────────────────────────

EVENT_PERSON_LINKS = [
    # Women
    ("Hatshepsut", "Egypt", "Pharaoh"),
    ("Nefertiti", "Egypt", "Queen"),
    ("Wu Zetian", "Tang", "Empress"),
    ("Boudicca", "Roman", "Leader of rebellion"),
    ("Hypatia", "Alexandria", "Scholar"),
    ("Eleanor of Aquitaine", "Crusade", "Participant"),
    ("Catherine the Great", "Russia", "Ruler"),
    
    # Asian figures
    ("Laozi", "Daoism", "Founder"),
    ("Laozi", "Dao De Jing", "Author"),
    ("Sun Tzu", "Art of War", "Author"),
    ("Qin Shi Huang", "Great Wall", "Builder"),
    ("Qin Shi Huang", "Qin", "Founder"),
    ("Qin Shi Huang", "Terracotta", "Commissoner"),
    ("Siddhartha Gautama", "Buddhism", "Founder"),
    ("Siddhartha Gautama", "Enlightenment", "Subject"),
    ("Chandragupta Maurya", "Maurya", "Founder"),
    ("Kublai Khan", "Yuan", "Founder"),
    ("Kublai Khan", "Marco Polo", "Host"),
    ("Zheng He", "Ming", "Admiral"),
    ("Tokugawa Ieyasu", "Edo", "Founder"),
    ("Akbar the Great", "Mughal", "Emperor"),
    ("Emperor Meiji", "Meiji", "Leader"),
    
    # Middle Eastern figures
    ("Cyrus the Great", "Cyrus", "Subject"),
    ("Cyrus the Great", "Persian Empire", "Founder"),
    ("Cyrus the Great", "Babylon", "Conqueror"),
    ("Al-Khwarizmi", "House of Wisdom", "Scholar"),
    ("Al-Khwarizmi", "Algebra", "Founder"),
    ("Omar Khayyam", "Calendar", "Developer"),
    ("Avicenna", "Medicine", "Author"),
    ("Averroes", "Aristotle", "Commentator"),
    ("Harun al-Rashid", "Baghdad", "Ruler"),
    ("Harun al-Rashid", "Abbasid", "Caliph"),
    ("Suleiman the Magnificent", "Ottoman", "Sultan"),
    
    # African figures
    ("Mansa Musa", "Mansa Musa", "Subject"),
    ("Mansa Musa", "Mali", "Ruler"),
    ("Mansa Musa", "Timbuktu", "Patron"),
    ("Sundiata Keita", "Mali Empire", "Founder"),
    ("Sundiata Keita", "Sundiata", "Subject"),
    ("Shaka Zulu", "Zulu", "Founder"),
    ("Ramesses II", "Egypt", "Pharaoh"),
    ("Ramesses II", "Kadesh", "Commander"),
    
    # American figures
    ("Montezuma II", "Aztec", "Emperor"),
    ("Montezuma II", "Tenochtitlan", "Ruler"),
    ("Pachacuti", "Inca", "Emperor"),
    ("Pachacuti", "Machu Picchu", "Builder"),
    ("Tecumseh", "Native American", "Leader"),
    ("Toussaint Louverture", "Haiti", "Leader"),
    ("Sitting Bull", "Little Bighorn", "Leader"),
    ("Simón Bolívar", "Independence", "Leader"),
    
    # Scientists
    ("Archimedes", "Syracuse", "Defender"),
    ("Pythagoras", "Pythagoras", "Subject"),
    ("Euclid", "Alexandria", "Scholar"),
    ("Hippocrates", "Medicine", "Founder"),
    ("Plato", "Academy", "Founder"),
    ("Plato", "Socrates", "Student"),
    ("Socrates", "Socrates", "Subject"),
    ("Socrates", "Athens", "Citizen"),
    ("René Descartes", "Philosophy", "Founder"),
    ("Johannes Kepler", "Planetary", "Discoverer"),
    ("Benjamin Franklin", "Independence", "Founding Father"),
    ("James Watt", "Industrial", "Inventor"),
    ("Michael Faraday", "Electromagnetic", "Discoverer"),
    ("Louis Pasteur", "Pasteurization", "Inventor"),
    ("Thomas Edison", "Electric", "Inventor"),
    ("Max Planck", "Quantum", "Founder"),
    ("Niels Bohr", "Atomic", "Theorist"),
    
    # Explorers
    ("Leif Erikson", "Vinland", "Explorer"),
    ("Leif Erikson", "Americas", "Explorer"),
    ("Vasco da Gama", "India", "Explorer"),
    ("Ferdinand Magellan", "Circumnavigation", "Leader"),
    ("James Cook", "Australia", "Explorer"),
    ("James Cook", "Hawaii", "Explorer"),
    
    # Religious figures
    ("Moses", "Exodus", "Leader"),
    ("Moses", "Commandments", "Receiver"),
    ("Jesus Christ", "Christianity", "Founder"),
    ("Muhammad", "Islam", "Founder"),
    ("Muhammad", "Hijra", "Subject"),
    ("Muhammad", "Mecca", "Conqueror"),
    ("Saint Augustine", "Christianity", "Theologian"),
    ("Dante Alighieri", "Divine Comedy", "Author"),
    ("Rumi", "Sufi", "Poet"),
    
    # Conquerors and rulers
    ("Attila the Hun", "Hun", "Leader"),
    ("Attila the Hun", "Roman", "Enemy"),
    ("William the Conqueror", "Norman", "Leader"),
    ("William the Conqueror", "1066", "Conqueror"),
    ("Hernán Cortés", "Aztec", "Conqueror"),
    ("Hernán Cortés", "Tenochtitlan", "Conqueror"),
    ("Peter the Great", "Russia", "Ruler"),
    ("Peter the Great", "St. Petersburg", "Founder"),
    ("Otto von Bismarck", "German", "Unifier"),
    ("Otto von Bismarck", "Prussia", "Chancellor"),
]


async def get_existing_people(conn) -> set:
    """Get names of all existing people in the database."""
    rows = await conn.fetch("SELECT name FROM people")
    return {row['name'] for row in rows}


async def insert_person(conn, name, birth_year, death_year, nationalities, roles, gender, description, wikipedia_slug, aliases) -> Optional[str]:
    """Insert a person and return their ID."""
    try:
        person_id = await conn.fetchval("""
            INSERT INTO people (
                name, birth_year, death_year, nationalities, roles, gender, 
                description, wikipedia_slug, aliases
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        """, name, birth_year, death_year, nationalities, roles, gender,
            description, wikipedia_slug, aliases if aliases else None)
        return str(person_id)
    except Exception as e:
        print(f"  Error inserting {name}: {e}")
        return None


async def find_event_by_title_substr(conn, substr: str) -> Optional[str]:
    """Find an event ID by title substring."""
    result = await conn.fetchval(
        "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
        f"%{substr}%"
    )
    return str(result) if result else None


async def find_person_by_name_substr(conn, substr: str) -> Optional[str]:
    """Find a person ID by name substring."""
    result = await conn.fetchval(
        "SELECT id FROM people WHERE name ILIKE $1 LIMIT 1",
        f"%{substr}%"
    )
    return str(result) if result else None


async def insert_event_person_link(conn, person_id: str, event_id: str, role: str) -> bool:
    """Insert an event_people link."""
    try:
        await conn.execute("""
            INSERT INTO event_people (event_id, person_id, role)
            VALUES ($1::uuid, $2::uuid, $3)
            ON CONFLICT (event_id, person_id, role) DO NOTHING
        """, event_id, person_id, role)
        return True
    except Exception as e:
        print(f"  Error inserting link: {e}")
        return False


async def main():
    print("=" * 60)
    print("Chronicle Database - Adding Historical Figures")
    print("=" * 60)
    
    conn = await asyncpg.connect(DB_URL)
    
    try:
        # Get existing people
        existing = await get_existing_people(conn)
        print(f"\nExisting figures: {len(existing)}")
        
        # Insert new figures
        print("\n--- Inserting New Figures ---")
        inserted = 0
        skipped = 0
        person_ids = {}  # name -> id mapping
        
        for (name, birth_year, death_year, nationalities, roles, gender, 
             description, wikipedia_slug, aliases) in NEW_FIGURES:
            
            if name in existing:
                print(f"  Skip (exists): {name}")
                # Still get their ID for linking
                pid = await find_person_by_name_substr(conn, name)
                if pid:
                    person_ids[name] = pid
                skipped += 1
                continue
            
            pid = await insert_person(
                conn, name, birth_year, death_year, nationalities, roles,
                gender, description, wikipedia_slug, aliases
            )
            
            if pid:
                person_ids[name] = pid
                inserted += 1
                print(f"  Added: {name} ({birth_year} - {death_year})")
            else:
                skipped += 1
        
        print(f"\nFigures: {inserted} inserted, {skipped} skipped")
        
        # Create event_people links
        print("\n--- Creating Event-Person Links ---")
        links_created = 0
        links_skipped = 0
        
        for (person_substr, event_substr, role) in EVENT_PERSON_LINKS:
            # Find person
            person_id = None
            for name, pid in person_ids.items():
                if person_substr.lower() in name.lower():
                    person_id = pid
                    break
            
            if not person_id:
                person_id = await find_person_by_name_substr(conn, person_substr)
            
            if not person_id:
                links_skipped += 1
                continue
            
            # Find event
            event_id = await find_event_by_title_substr(conn, event_substr)
            if not event_id:
                links_skipped += 1
                continue
            
            # Create link
            if await insert_event_person_link(conn, person_id, event_id, role):
                links_created += 1
            else:
                links_skipped += 1
        
        print(f"Event-Person links: {links_created} created, {links_skipped} skipped")
        
        # Final count
        total_people = await conn.fetchval("SELECT COUNT(*) FROM people")
        total_links = await conn.fetchval("SELECT COUNT(*) FROM event_people")
        
        print(f"\n--- Final Counts ---")
        print(f"Total people in database: {total_people}")
        print(f"Total event-person links: {total_links}")
        
        # Show some samples
        print("\n--- Sample of Added Figures ---")
        samples = await conn.fetch("""
            SELECT name, birth_year, death_year, nationalities, roles
            FROM people 
            ORDER BY birth_year NULLS LAST
            LIMIT 20
        """)
        for row in samples:
            nat = ', '.join(row['nationalities']) if row['nationalities'] else 'Unknown'
            roles = ', '.join(row['roles']) if row['roles'] else 'Unknown'
            print(f"  {row['name']} ({row['birth_year']}-{row['death_year']}): {nat} | {roles}")
        
    finally:
        await conn.close()
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
