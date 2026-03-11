#!/usr/bin/env python3
"""
enrich_underrepresented.py

Adds 100+ historical events covering underrepresented regions:
- Ancient Americas (Olmec, Maya, early Aztec)
- Sub-Saharan Africa (Mali Empire, Great Zimbabwe, Axum)
- Early Islamic world (622 CE–1200 CE)
- Southeast Asia (Khmer Empire, Srivijaya)
- Ancient India (Maurya, Gupta empires)

Also adds 30+ causality links between related events and recomputes network_y.
"""

import asyncio
import asyncpg
import uuid
import re
from datetime import date
from slugify import slugify
from collections import defaultdict, deque
from typing import Optional

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# ────────────────────────────────────────────────────────────────────────────
# NEW EVENTS DATA
# Format: (title, description, year, geo_modern, event_category, geo_era_label, importance_score)
# For BCE dates, use negative years (e.g., -1200 for 1200 BCE)
# ────────────────────────────────────────────────────────────────────────────

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT AMERICAS - Olmec, Maya, Early Mesoamerica
    # ═══════════════════════════════════════════════════════════════════════
    
    # Olmec Civilization
    ("San Lorenzo Olmec Peak", 
     "San Lorenzo Tenochtitlán reaches its peak as the first major Olmec center, featuring colossal stone heads and sophisticated drainage systems.",
     -1150, "San Lorenzo, Veracruz, Mexico", "cultural", "Olmec Civilization", 0.7),
    
    ("La Venta Becomes Olmec Capital",
     "Following San Lorenzo's decline, La Venta emerges as the new Olmec political and religious center with massive earthen pyramids.",
     -900, "La Venta, Tabasco, Mexico", "political", "Olmec Civilization", 0.65),
    
    ("Olmec Long Count Calendar Origins",
     "The Olmec develop precursors to the Mesoamerican Long Count calendar system, later adopted by the Maya.",
     -650, "Gulf Coast, Mexico", "cultural", "Olmec Civilization", 0.6),
    
    ("Tres Zapotes Olmec Center",
     "Tres Zapotes becomes the last major Olmec center, producing the earliest known Long Count date inscription.",
     -400, "Tres Zapotes, Veracruz, Mexico", "cultural", "Late Olmec Period", 0.55),
    
    # Maya Early Period
    ("Nakbe — Earliest Maya City",
     "Nakbe in the Petén Basin develops as one of the earliest Maya urban centers with monumental architecture.",
     -800, "Nakbe, Guatemala", "cultural", "Preclassic Maya", 0.6),
    
    ("El Mirador — Maya Megacity",
     "El Mirador grows into the largest Preclassic Maya city, featuring La Danta pyramid, one of the largest ancient structures by volume.",
     -300, "El Mirador, Guatemala", "cultural", "Preclassic Maya", 0.75),
    
    ("Maya Writing System Emerges",
     "The Maya develop hieroglyphic writing, the most sophisticated writing system in pre-Columbian Americas.",
     -400, "Maya Lowlands, Guatemala/Mexico", "cultural", "Preclassic Maya", 0.7),
    
    ("Kaminaljuyú Highland Center",
     "Kaminaljuyú becomes a major Maya highland center, controlling obsidian trade routes.",
     -200, "Guatemala City, Guatemala", "political", "Preclassic Maya", 0.55),
    
    ("Cerros — Early Maya Kingship",
     "Cerros develops as an early Maya political center demonstrating emerging concepts of divine kingship.",
     -50, "Cerros, Belize", "political", "Late Preclassic Maya", 0.5),
    
    ("Tikal Dynasty Founded",
     "Yax Ehb Xook founds the ruling dynasty at Tikal, which becomes one of the most powerful Maya city-states.",
     90, "Tikal, Guatemala", "political", "Early Classic Maya", 0.7),
    
    ("Copán Dynasty Founded",
     "K'inich Yax K'uk' Mo' establishes the dynasty at Copán, beginning a line of 16 kings.",
     426, "Copán, Honduras", "political", "Classic Maya", 0.65),
    
    ("Teotihuacan Conquers Tikal",
     "Fire Is Born, a general from Teotihuacan, defeats Tikal's king, establishing Mexican influence over the Maya region.",
     378, "Tikal, Guatemala", "war", "Classic Maya", 0.7),
    
    ("Palenque Founded",
     "K'uk' Bahlam I establishes the dynasty at Palenque, later home to King Pakal and elaborate tomb architecture.",
     431, "Palenque, Chiapas, Mexico", "political", "Classic Maya", 0.6),
    
    ("Calakmul — Maya Superpower",
     "Calakmul rises to challenge Tikal, creating a bipolar Maya world with shifting alliances.",
     562, "Calakmul, Campeche, Mexico", "political", "Classic Maya", 0.65),
    
    ("Pakal the Great's Reign Begins",
     "K'inich Janaab Pakal I becomes king of Palenque at age 12, ruling for 68 years and transforming the city.",
     615, "Palenque, Chiapas, Mexico", "political", "Classic Maya", 0.75),
    
    # South America
    ("Chavín de Huántar Culture",
     "Chavín de Huántar emerges as a major religious center in the Andes, spreading artistic and religious influence across Peru.",
     -900, "Chavín de Huántar, Peru", "religious", "Early Horizon Peru", 0.65),
    
    ("Nazca Lines Created",
     "The Nazca culture creates massive geoglyphs in the Peruvian desert, depicting animals and geometric patterns visible only from the air.",
     100, "Nazca, Peru", "cultural", "Nazca Culture", 0.7),
    
    ("Moche Civilization Peak",
     "The Moche civilization reaches its height in northern Peru, known for elaborate pottery and the Huaca del Sol pyramid.",
     450, "Trujillo, Peru", "cultural", "Moche Civilization", 0.65),
    
    ("Tiwanaku Empire Expands",
     "Tiwanaku near Lake Titicaca expands into a major Andean empire, influencing culture across Bolivia and Peru.",
     500, "Tiwanaku, Bolivia", "political", "Tiwanaku Empire", 0.7),
    
    # ═══════════════════════════════════════════════════════════════════════
    # SUB-SAHARAN AFRICA - Axum, Mali, Great Zimbabwe, and more
    # ═══════════════════════════════════════════════════════════════════════
    
    # Axum/Aksum
    ("Kingdom of Axum Founded",
     "The Kingdom of Axum emerges in the Ethiopian Highlands as a major trading power connecting Africa, Arabia, and the Mediterranean.",
     100, "Axum, Ethiopia", "political", "Kingdom of Axum", 0.7),
    
    ("Axum Conquers Kush",
     "King Ezana of Axum conquers the Kingdom of Kush (Meroë), ending the last Nubian kingdom.",
     350, "Meroë, Sudan", "war", "Kingdom of Axum", 0.65),
    
    ("Axum Adopts Christianity",
     "King Ezana converts to Christianity, making Axum one of the first Christian states in the world.",
     330, "Axum, Ethiopia", "religious", "Kingdom of Axum", 0.75),
    
    ("Axum Stelae Erected",
     "Massive granite stelae are erected at Axum, the tallest standing stone monuments in the ancient world.",
     300, "Axum, Ethiopia", "cultural", "Kingdom of Axum", 0.6),
    
    ("Axum Controls Yemen",
     "King Kaleb of Axum invades Yemen to protect Christians from persecution, extending Ethiopian power into Arabia.",
     525, "Yemen/Ethiopia", "war", "Kingdom of Axum", 0.6),
    
    # West Africa
    ("Ghana Empire Emerges",
     "The Ghana Empire (Wagadou) emerges as the first major West African kingdom, controlling trans-Saharan gold trade.",
     300, "Koumbi Saleh, Mauritania", "political", "Ghana Empire", 0.7),
    
    ("Ghana Empire at Its Height",
     "The Ghana Empire reaches its peak, with the capital Koumbi Saleh becoming one of the largest cities in the world.",
     1000, "Koumbi Saleh, Mauritania", "political", "Ghana Empire", 0.65),
    
    ("Almoravid Conquest of Ghana",
     "The Almoravid Berbers capture the Ghana capital, accelerating the empire's decline and spreading Islam in West Africa.",
     1076, "Koumbi Saleh, Mauritania", "war", "Ghana Empire", 0.6),
    
    ("Sundiata Keita Founds Mali Empire",
     "Sundiata Keita defeats Sumanguru at the Battle of Kirina and establishes the Mali Empire, beginning a golden age.",
     1235, "Niani, Mali", "political", "Mali Empire", 0.8),
    
    ("Timbuktu Becomes Learning Center",
     "Under Mali rule, Timbuktu emerges as a major center of Islamic scholarship and trade.",
     1300, "Timbuktu, Mali", "cultural", "Mali Empire", 0.7),
    
    ("Mansa Musa's Hajj",
     "Mansa Musa's pilgrimage to Mecca with tons of gold causes inflation in Egypt and puts Mali on European maps.",
     1324, "Cairo to Mecca", "religious", "Mali Empire", 0.85),
    
    ("Sankore University Peak",
     "The University of Sankore in Timbuktu reaches its peak with over 25,000 students studying law, medicine, and theology.",
     1450, "Timbuktu, Mali", "cultural", "Mali Empire", 0.65),
    
    # Great Zimbabwe
    ("Great Zimbabwe Founded",
     "The Kingdom of Zimbabwe begins constructing the Great Zimbabwe stone complex, center of a powerful trading state.",
     1100, "Great Zimbabwe, Zimbabwe", "political", "Kingdom of Zimbabwe", 0.7),
    
    ("Great Zimbabwe at Its Peak",
     "Great Zimbabwe reaches its height as a major gold-trading center with a population of 18,000, the largest stone structures in sub-Saharan Africa.",
     1300, "Great Zimbabwe, Zimbabwe", "cultural", "Kingdom of Zimbabwe", 0.75),
    
    ("Mutapa Empire Founded",
     "The Mutapa Empire emerges as Great Zimbabwe declines, controlling gold trade with Swahili coast ports.",
     1450, "Northern Zimbabwe", "political", "Mutapa Empire", 0.6),
    
    # Swahili Coast
    ("Kilwa Sultanate Founded",
     "Arab traders establish the Kilwa Sultanate, which becomes the dominant Swahili coast trading power.",
     957, "Kilwa, Tanzania", "political", "Swahili Coast", 0.6),
    
    ("Kilwa Controls Gold Trade",
     "Kilwa gains control of Sofala and the gold trade from Great Zimbabwe, becoming the wealthiest Swahili city-state.",
     1200, "Kilwa, Tanzania", "economic", "Swahili Coast", 0.65),
    
    ("Great Mosque of Kilwa Built",
     "The Great Mosque of Kilwa is constructed, the largest mosque in sub-Saharan Africa at the time.",
     1300, "Kilwa, Tanzania", "religious", "Swahili Coast", 0.55),
    
    # ═══════════════════════════════════════════════════════════════════════
    # EARLY ISLAMIC WORLD (622 CE – 1200 CE)
    # ═══════════════════════════════════════════════════════════════════════
    
    ("Hijra — Migration to Medina",
     "Muhammad and his followers migrate from Mecca to Medina, marking Year 1 of the Islamic calendar.",
     622, "Medina, Saudi Arabia", "religious", "Early Islamic Period", 0.9),
    
    ("Battle of Badr",
     "Muslims achieve their first major military victory against the Quraysh of Mecca, a turning point for early Islam.",
     624, "Badr, Saudi Arabia", "war", "Early Islamic Period", 0.7),
    
    ("Conquest of Mecca",
     "Muhammad leads the conquest of Mecca, establishing Islam's holy city and unifying much of Arabia.",
     630, "Mecca, Saudi Arabia", "war", "Early Islamic Period", 0.85),
    
    ("Rashidun Caliphate Established",
     "Abu Bakr becomes the first caliph after Muhammad's death, beginning the Rashidun ('Rightly Guided') Caliphate.",
     632, "Medina, Saudi Arabia", "political", "Rashidun Caliphate", 0.8),
    
    ("Battle of Yarmouk",
     "Arab forces decisively defeat the Byzantine Empire, opening Syria and Palestine to Muslim conquest.",
     636, "Yarmouk River, Jordan/Syria", "war", "Rashidun Caliphate", 0.75),
    
    ("Conquest of Persia",
     "Arab forces defeat the Sasanian Empire at Nahavand, leading to the complete Muslim conquest of Persia.",
     642, "Nahavand, Iran", "war", "Rashidun Caliphate", 0.75),
    
    ("Umayyad Caliphate Founded",
     "Muawiyah I establishes the Umayyad Caliphate with Damascus as capital, shifting from elective to hereditary rule.",
     661, "Damascus, Syria", "political", "Umayyad Caliphate", 0.8),
    
    ("Al-Aqsa Mosque Constructed",
     "The al-Aqsa Mosque is built in Jerusalem, becoming Islam's third holiest site.",
     705, "Jerusalem, Israel/Palestine", "religious", "Umayyad Caliphate", 0.7),
    
    ("Umayyad Conquest of Spain",
     "Tariq ibn Ziyad leads the Muslim conquest of Visigothic Iberia, establishing Al-Andalus.",
     711, "Gibraltar/Spain", "war", "Umayyad Caliphate", 0.8),
    
    ("Abbasid Revolution",
     "The Abbasid dynasty overthrows the Umayyads, moving the caliphate's center east to Iraq.",
     750, "Kufa, Iraq", "political", "Abbasid Caliphate", 0.8),
    
    ("Baghdad Founded",
     "Caliph al-Mansur founds Baghdad as the new Abbasid capital, the 'Round City' becoming a global center of learning.",
     762, "Baghdad, Iraq", "political", "Abbasid Caliphate", 0.85),
    
    ("House of Wisdom Established",
     "The House of Wisdom (Bayt al-Hikma) is established in Baghdad, translating Greek, Persian, and Indian texts.",
     830, "Baghdad, Iraq", "cultural", "Islamic Golden Age", 0.8),
    
    ("Al-Khwarizmi's Algebra",
     "Al-Khwarizmi writes 'The Compendious Book on Calculation by Completion and Balancing,' founding algebra.",
     820, "Baghdad, Iraq", "discovery", "Islamic Golden Age", 0.75),
    
    ("Fatimid Caliphate Founded",
     "The Fatimid dynasty establishes a rival Shia caliphate in North Africa, later conquering Egypt.",
     909, "Tunisia", "political", "Fatimid Caliphate", 0.7),
    
    ("Cairo Founded",
     "The Fatimids found Cairo (al-Qahira) as their new capital after conquering Egypt.",
     969, "Cairo, Egypt", "political", "Fatimid Caliphate", 0.75),
    
    ("Al-Azhar University Founded",
     "The Fatimids establish Al-Azhar as a center of Islamic learning, the oldest degree-granting university.",
     970, "Cairo, Egypt", "cultural", "Fatimid Caliphate", 0.7),
    
    ("Ibn Sina (Avicenna) — Canon of Medicine",
     "Ibn Sina completes the Canon of Medicine, the standard medical text in Europe and the Islamic world for 500 years.",
     1025, "Hamadan, Iran", "discovery", "Islamic Golden Age", 0.8),
    
    ("Seljuk Turks Conquer Baghdad",
     "The Seljuk Turks capture Baghdad, becoming the dominant power in the eastern Islamic world.",
     1055, "Baghdad, Iraq", "war", "Seljuk Empire", 0.7),
    
    ("Battle of Manzikert",
     "Seljuk Turks defeat Byzantine forces, opening Anatolia to Turkish settlement and triggering the Crusades.",
     1071, "Manzikert, Turkey", "war", "Seljuk Empire", 0.75),
    
    ("Omar Khayyam's Calendar Reform",
     "Omar Khayyam completes the Jalali calendar, more accurate than the later Gregorian calendar.",
     1079, "Isfahan, Iran", "discovery", "Seljuk Empire", 0.6),
    
    ("First Crusade Captures Jerusalem",
     "Crusaders capture Jerusalem, massacring Muslim and Jewish inhabitants, beginning 200 years of Crusader states.",
     1099, "Jerusalem, Israel/Palestine", "war", "Crusader Period", 0.8),
    
    ("Saladin Reconquers Jerusalem",
     "Saladin defeats the Crusaders at Hattin and retakes Jerusalem, allowing Christian pilgrims to visit.",
     1187, "Jerusalem, Israel/Palestine", "war", "Ayyubid Dynasty", 0.8),
    
    # ═══════════════════════════════════════════════════════════════════════
    # SOUTHEAST ASIA - Khmer Empire, Srivijaya, and more
    # ═══════════════════════════════════════════════════════════════════════
    
    # Srivijaya
    ("Srivijaya Empire Emerges",
     "The Buddhist Srivijaya empire emerges in Sumatra, controlling the Strait of Malacca trade routes.",
     650, "Palembang, Indonesia", "political", "Srivijaya Empire", 0.7),
    
    ("Srivijaya — Center of Buddhist Learning",
     "Srivijaya becomes a major center of Buddhist scholarship, attracting monks from China and India.",
     700, "Palembang, Indonesia", "religious", "Srivijaya Empire", 0.65),
    
    ("Srivijaya Raids on Java",
     "Srivijaya launches naval raids on Java, asserting control over maritime trade routes.",
     780, "Java Sea", "war", "Srivijaya Empire", 0.55),
    
    ("Chola Raid on Srivijaya",
     "The Chola dynasty of South India raids Srivijaya, disrupting its trade network and beginning its decline.",
     1025, "Palembang, Indonesia", "war", "Srivijaya Empire", 0.6),
    
    # Khmer Empire
    ("Jayavarman II Founds Khmer Empire",
     "Jayavarman II proclaims himself 'universal monarch,' unifying Cambodia and founding the Khmer Empire.",
     802, "Angkor, Cambodia", "political", "Khmer Empire", 0.75),
    
    ("Khmer Capital Moves to Angkor",
     "The Khmer capital is established at Angkor, beginning centuries of monumental temple construction.",
     889, "Angkor, Cambodia", "political", "Khmer Empire", 0.65),
    
    ("Suryavarman I Expands Khmer Empire",
     "Suryavarman I dramatically expands the Khmer Empire, incorporating much of Thailand and Laos.",
     1002, "Angkor, Cambodia", "war", "Khmer Empire", 0.65),
    
    ("Angkor Wat Construction Begins",
     "King Suryavarman II begins construction of Angkor Wat, the largest religious monument ever built.",
     1113, "Angkor, Cambodia", "cultural", "Khmer Empire", 0.85),
    
    ("Cham Sack of Angkor",
     "The Cham kingdom of Vietnam sacks Angkor, leading to Jayavarman VII's rise and massive rebuilding.",
     1177, "Angkor, Cambodia", "war", "Khmer Empire", 0.65),
    
    ("Jayavarman VII — Buddhist King",
     "Jayavarman VII rebuilds the empire and converts Angkor to Mahayana Buddhism, building Angkor Thom and the Bayon.",
     1181, "Angkor, Cambodia", "religious", "Khmer Empire", 0.75),
    
    ("Angkor Thom Completed",
     "The great city of Angkor Thom is completed with the enigmatic face towers of the Bayon at its center.",
     1200, "Angkor, Cambodia", "cultural", "Khmer Empire", 0.7),
    
    # Vietnam
    ("Ngô Dynasty — Vietnamese Independence",
     "Ngô Quyền defeats Chinese forces at the Battle of Bạch Đằng, ending 1,000 years of Chinese rule.",
     938, "Bạch Đằng River, Vietnam", "war", "Early Vietnamese Kingdoms", 0.7),
    
    ("Lý Dynasty Founded",
     "Lý Thái Tổ founds the Lý dynasty, beginning a golden age of Vietnamese culture and Buddhism.",
     1009, "Hanoi, Vietnam", "political", "Lý Dynasty Vietnam", 0.65),
    
    # Burma/Myanmar
    ("Pagan Empire Founded",
     "King Anawrahta unifies Burma and founds the Pagan Empire, introducing Theravada Buddhism.",
     1044, "Bagan, Myanmar", "political", "Pagan Empire", 0.7),
    
    ("Pagan Temple Building Era",
     "Over 10,000 Buddhist temples are constructed at Pagan during the empire's golden age.",
     1100, "Bagan, Myanmar", "religious", "Pagan Empire", 0.65),
    
    # Indonesia
    ("Borobudur Temple Completed",
     "The massive Buddhist temple of Borobudur is completed in Java, the world's largest Buddhist monument.",
     825, "Magelang, Java, Indonesia", "religious", "Sailendra Dynasty", 0.8),
    
    ("Prambanan Hindu Temple Complex",
     "The Prambanan temple complex is completed, the largest Hindu temple in Indonesia.",
     850, "Yogyakarta, Java, Indonesia", "religious", "Mataram Kingdom", 0.7),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT INDIA - Maurya, Gupta, and more
    # ═══════════════════════════════════════════════════════════════════════
    
    # Pre-Maurya
    ("Mahajanapadas — Sixteen Kingdoms",
     "Sixteen great kingdoms (Mahajanapadas) dominate North India, including Magadha, Kosala, and Gandhara.",
     -600, "North India", "political", "Mahajanapada Period", 0.65),
    
    ("Mahavira Founds Jainism",
     "Vardhamana Mahavira attains enlightenment and systematizes Jain philosophy of non-violence and asceticism.",
     -527, "Bihar, India", "religious", "Late Vedic Period", 0.75),
    
    ("Nanda Dynasty",
     "The Nanda dynasty rises to power in Magadha, building a vast army and expanding territorial control.",
     -345, "Pataliputra, India", "political", "Nanda Dynasty", 0.55),
    
    # Maurya Empire
    ("Chandragupta Maurya Founds Empire",
     "Chandragupta Maurya overthrows the Nanda dynasty and founds the Maurya Empire with help from Chanakya.",
     -322, "Pataliputra, India", "political", "Maurya Empire", 0.8),
    
    ("Maurya-Seleucid War",
     "Chandragupta defeats Seleucus Nicator, gaining control of Afghanistan and establishing peace through marriage alliance.",
     -305, "Northwest India", "war", "Maurya Empire", 0.65),
    
    ("Arthashastra Written",
     "Chanakya (Kautilya) composes the Arthashastra, an ancient treatise on statecraft, economics, and military strategy.",
     -300, "Pataliputra, India", "cultural", "Maurya Empire", 0.7),
    
    ("Bindusara Expands Maurya Empire",
     "Emperor Bindusara extends Maurya control over most of the Indian subcontinent except Kalinga.",
     -297, "Pataliputra, India", "political", "Maurya Empire", 0.6),
    
    ("Ashoka's Kalinga War",
     "Ashoka conquers Kalinga in a devastating war, after which he renounces violence and embraces Buddhism.",
     -261, "Kalinga (Odisha), India", "war", "Maurya Empire", 0.8),
    
    ("Ashoka's Rock Edicts",
     "Ashoka erects rock and pillar edicts across India promoting dharma, non-violence, and religious tolerance.",
     -250, "Throughout India", "cultural", "Maurya Empire", 0.75),
    
    ("Third Buddhist Council",
     "Ashoka convenes the Third Buddhist Council at Pataliputra, standardizing Buddhist teachings.",
     -250, "Pataliputra, India", "religious", "Maurya Empire", 0.65),
    
    ("Maurya Empire Decline",
     "After Ashoka's death, the Maurya Empire fragments and is eventually overthrown by the Shunga dynasty.",
     -185, "Pataliputra, India", "political", "Maurya Empire", 0.6),
    
    # Post-Maurya
    ("Indo-Greek Kingdoms",
     "Greek kingdoms in Northwest India flourish, blending Hellenistic and Indian culture, notably under Menander I.",
     -150, "Taxila, Pakistan", "political", "Indo-Greek Period", 0.6),
    
    ("Gandhara Buddhist Art",
     "The Gandhara school of Buddhist art emerges, blending Greek and Buddhist artistic traditions.",
     -100, "Gandhara, Pakistan/Afghanistan", "cultural", "Indo-Greek Period", 0.65),
    
    # Gupta Empire
    ("Chandragupta I Founds Gupta Empire",
     "Chandragupta I establishes the Gupta Empire through marriage alliance with the Lichchhavi clan.",
     320, "Pataliputra, India", "political", "Gupta Empire", 0.75),
    
    ("Samudragupta — 'Indian Napoleon'",
     "Samudragupta expands Gupta territory through 'Digvijaya' conquest, asserting dominance over most of India.",
     350, "Pataliputra, India", "war", "Gupta Empire", 0.7),
    
    ("Chandragupta II — Golden Age",
     "Chandragupta II (Vikramaditya) presides over the Gupta golden age of art, science, and literature.",
     380, "Ujjain, India", "cultural", "Gupta Empire", 0.75),
    
    ("Aryabhata's Astronomical Treatise",
     "Mathematician Aryabhata writes the Aryabhatiya, calculating π to four decimal places and proposing Earth's rotation.",
     499, "Pataliputra, India", "discovery", "Gupta Empire", 0.75),
    
    ("Nalanda University Founded",
     "Nalanda becomes a major Buddhist center of learning, attracting scholars from across Asia.",
     450, "Nalanda, Bihar, India", "cultural", "Gupta Empire", 0.7),
    
    ("Ajanta Cave Paintings",
     "Buddhist monks complete the elaborate cave paintings at Ajanta during the Gupta golden age.",
     480, "Ajanta, Maharashtra, India", "cultural", "Gupta Empire", 0.7),
    
    ("Huna Invasions of India",
     "The Huna (Hephthalite) invasions weaken and fragment the Gupta Empire.",
     480, "North India", "war", "Post-Gupta Period", 0.6),
    
    ("Gupta Empire Falls",
     "The Gupta Empire collapses under pressure from Huna invasions and internal fragmentation.",
     550, "North India", "political", "Post-Gupta Period", 0.65),
    
    # Later Indian History
    ("Harsha's Empire",
     "Emperor Harsha unites much of North India and patronizes Buddhism and literature.",
     606, "Kannauj, India", "political", "Harsha's Empire", 0.65),
    
    ("Xuanzang Visits India",
     "Chinese monk Xuanzang visits India, studying at Nalanda and documenting Indian Buddhism.",
     630, "Nalanda, Bihar, India", "religious", "Harsha's Empire", 0.6),
    
    ("Chola Dynasty Rises",
     "The Chola dynasty rises to power in South India, beginning an era of naval expansion and temple building.",
     850, "Thanjavur, Tamil Nadu, India", "political", "Chola Dynasty", 0.7),
    
    ("Rajaraja Chola I — Great Conqueror",
     "Rajaraja Chola I expands the Chola Empire across South India and Sri Lanka, building the Brihadisvara Temple.",
     985, "Thanjavur, Tamil Nadu, India", "political", "Chola Dynasty", 0.75),
    
    ("Rajendra Chola's Naval Conquests",
     "Rajendra Chola I leads naval expeditions to Southeast Asia, defeating Srivijaya and reaching the Ganges.",
     1025, "Thanjavur, Tamil Nadu, India", "war", "Chola Dynasty", 0.7),
]

# ────────────────────────────────────────────────────────────────────────────
# CAUSALITY LINKS
# Format: (cause_title_substr, effect_title_substr, link_type, strength, description)
# Valid link_types: direct, indirect, contributing, disputed
# ────────────────────────────────────────────────────────────────────────────

# Map friendly names to valid DB values
LINK_TYPE_MAP = {
    'leads_to': 'indirect',
    'enables': 'contributing',
    'causes': 'direct',
    'context': 'contributing',
    'direct': 'direct',
    'indirect': 'indirect',
    'contributing': 'contributing',
    'disputed': 'disputed',
}

NEW_CAUSALITY_LINKS = [
    # Olmec → Maya connections
    ("San Lorenzo Olmec", "La Venta Becomes", "leads_to", 0.8,
     "Olmec culture shifted from San Lorenzo to La Venta as capital"),
    ("La Venta Becomes", "Olmec Long Count", "enables", 0.6,
     "La Venta period saw development of calendar systems"),
    ("Olmec Long Count", "Maya Writing System", "enables", 0.7,
     "Olmec calendar concepts influenced Maya writing and calendar"),
    ("Nakbe", "El Mirador", "leads_to", 0.7,
     "Early Maya urbanization at Nakbe led to El Mirador development"),
    ("El Mirador", "Tikal Dynasty", "enables", 0.6,
     "Preclassic Maya cities enabled later Classic period"),
    ("Tikal Dynasty", "Copán Dynasty", "enables", 0.5,
     "Tikal's political model influenced other Maya city-states"),
    ("Teotihuacan Conquers", "Calakmul", "enables", 0.6,
     "Mexican intervention reshuffled Maya political order"),
    ("Pakal the Great", "Jayavarman VII", "context", 0.3,
     "Great divine kings in both Maya and Khmer civilizations"),
    
    # South American connections
    ("Chavín de Huántar", "Nazca Lines", "enables", 0.5,
     "Chavín religious influence spread across Peru"),
    ("Nazca Lines", "Moche Civilization", "context", 0.5,
     "Contemporary Peruvian civilizations"),
    ("Moche Civilization", "Tiwanaku Empire", "context", 0.5,
     "Contemporary Andean power centers"),
    
    # African connections
    ("Kingdom of Axum Founded", "Axum Conquers Kush", "leads_to", 0.8,
     "Axumite expansion led to conquest of Kush"),
    ("Axum Conquers Kush", "Axum Adopts Christianity", "context", 0.6,
     "Axum's power enabled religious transformation"),
    ("Ghana Empire Emerges", "Ghana Empire at Its Height", "leads_to", 0.9,
     "Ghana Empire's growth over centuries"),
    ("Almoravid Conquest", "Sundiata Keita", "enables", 0.6,
     "Ghana's fall created power vacuum for Mali"),
    ("Sundiata Keita", "Timbuktu Becomes", "enables", 0.8,
     "Mali Empire enabled Timbuktu's rise"),
    ("Mansa Musa", "Sankore University", "leads_to", 0.7,
     "Mansa Musa's wealth supported scholarly institutions"),
    ("Great Zimbabwe Founded", "Great Zimbabwe at Its Peak", "leads_to", 0.9,
     "Natural development of the trading center"),
    ("Great Zimbabwe at Its Peak", "Mutapa Empire", "leads_to", 0.7,
     "Successor state emerged as Zimbabwe declined"),
    ("Kilwa Sultanate", "Kilwa Controls Gold", "leads_to", 0.8,
     "Kilwa expanded control over gold trade"),
    
    # Islamic world connections
    ("Hijra", "Battle of Badr", "leads_to", 0.9,
     "Migration to Medina enabled Muslim community"),
    ("Battle of Badr", "Conquest of Mecca", "leads_to", 0.8,
     "Military victories led to Mecca's conquest"),
    ("Conquest of Mecca", "Rashidun Caliphate", "leads_to", 0.9,
     "United Arabia enabled caliphate"),
    ("Battle of Yarmouk", "Conquest of Persia", "enables", 0.7,
     "Byzantine defeat freed forces for Persian conquest"),
    ("Rashidun Caliphate", "Umayyad Caliphate Founded", "leads_to", 0.9,
     "Succession from Rashidun to Umayyad"),
    ("Umayyad Caliphate Founded", "Umayyad Conquest of Spain", "leads_to", 0.8,
     "Umayyad expansion reached Iberia"),
    ("Umayyad Caliphate Founded", "Abbasid Revolution", "leads_to", 0.8,
     "Umayyad rule provoked Abbasid uprising"),
    ("Abbasid Revolution", "Baghdad Founded", "leads_to", 0.9,
     "New dynasty founded new capital"),
    ("Baghdad Founded", "House of Wisdom", "enables", 0.9,
     "Baghdad enabled scholarly institutions"),
    ("House of Wisdom", "Al-Khwarizmi's Algebra", "enables", 0.8,
     "House of Wisdom supported scientific work"),
    ("Battle of Manzikert", "First Crusade", "enables", 0.7,
     "Byzantine weakness prompted call for Crusade"),
    ("First Crusade", "Saladin Reconquers", "leads_to", 0.7,
     "Crusader occupation led to Muslim reconquest"),
    
    # Southeast Asian connections
    ("Srivijaya Empire", "Srivijaya — Center", "leads_to", 0.8,
     "Empire's growth made it a Buddhist center"),
    ("Chola Raid on Srivijaya", "Kilwa Controls Gold", "context", 0.4,
     "Indian Ocean trade networks interconnected"),
    ("Jayavarman II Founds", "Khmer Capital Moves", "leads_to", 0.8,
     "Empire's establishment led to Angkor"),
    ("Suryavarman I Expands", "Angkor Wat Construction", "enables", 0.7,
     "Imperial expansion enabled monumental building"),
    ("Cham Sack of Angkor", "Jayavarman VII", "leads_to", 0.9,
     "Defeat led to Jayavarman VII's rise"),
    ("Jayavarman VII", "Angkor Thom Completed", "leads_to", 0.9,
     "King's building program created Angkor Thom"),
    ("Borobudur Temple", "Prambanan Hindu", "context", 0.7,
     "Contemporary Buddhist and Hindu monuments"),
    ("Ngô Dynasty", "Lý Dynasty Founded", "leads_to", 0.7,
     "Independence enabled dynasty formation"),
    ("Pagan Empire Founded", "Pagan Temple Building", "leads_to", 0.8,
     "Imperial patronage enabled temple building"),
    
    # Indian connections
    ("Mahajanapadas", "Mahavira Founds Jainism", "context", 0.6,
     "Political ferment accompanied religious innovation"),
    ("Nanda Dynasty", "Chandragupta Maurya", "leads_to", 0.9,
     "Chandragupta overthrew Nandas"),
    ("Chandragupta Maurya", "Arthashastra Written", "enables", 0.8,
     "Chanakya wrote statecraft treatise for Maurya"),
    ("Chandragupta Maurya", "Bindusara Expands", "leads_to", 0.9,
     "Father to son succession"),
    ("Bindusara Expands", "Ashoka's Kalinga War", "leads_to", 0.8,
     "Ashoka completed father's conquests"),
    ("Ashoka's Kalinga War", "Ashoka's Rock Edicts", "leads_to", 0.9,
     "War remorse led to dharma promotion"),
    ("Ashoka's Rock Edicts", "Third Buddhist Council", "enables", 0.7,
     "Ashoka patronized Buddhism"),
    ("Maurya Empire Decline", "Indo-Greek Kingdoms", "enables", 0.6,
     "Maurya fall allowed Greek kingdoms"),
    ("Indo-Greek Kingdoms", "Gandhara Buddhist Art", "enables", 0.8,
     "Greek presence created fusion art"),
    ("Chandragupta I Founds Gupta", "Samudragupta", "leads_to", 0.9,
     "Father to son succession"),
    ("Samudragupta", "Chandragupta II", "leads_to", 0.9,
     "Father to son succession"),
    ("Chandragupta II", "Aryabhata's Astronomical", "enables", 0.7,
     "Golden age enabled scientific work"),
    ("Chandragupta II", "Nalanda University", "enables", 0.7,
     "Imperial patronage supported learning"),
    ("Nalanda University", "Xuanzang Visits", "leads_to", 0.6,
     "Nalanda's fame attracted Xuanzang"),
    ("Huna Invasions", "Gupta Empire Falls", "leads_to", 0.8,
     "Invasions led to collapse"),
    ("Chola Dynasty Rises", "Rajaraja Chola", "leads_to", 0.8,
     "Dynasty growth led to great king"),
    ("Rajaraja Chola", "Rajendra Chola's Naval", "leads_to", 0.8,
     "Father's work enabled son's conquests"),
    ("Rajendra Chola's Naval", "Chola Raid on Srivijaya", "context", 0.9,
     "Same campaign to Southeast Asia"),
]


# ────────────────────────────────────────────────────────────────────────────
# Network Layout Constants (from compute_network_layout.py)
# ────────────────────────────────────────────────────────────────────────────

REFERENCE_TIME_SPAN = 2300
NODE_SIZE_BASE = 500 / (REFERENCE_TIME_SPAN * 0.01) if REFERENCE_TIME_SPAN * 0.01 > 10 else 50
NODE_SIZE_IMPORTANCE_RANGE = 20
MAX_NODE_HEIGHT = NODE_SIZE_BASE + NODE_SIZE_IMPORTANCE_RANGE
DEPTH_SPACING = 80
ISOLATED_NUDGE = 40
LANE_SPACING = 60


def generate_slug(title: str) -> str:
    """Generate a URL-friendly slug from title."""
    return slugify(title, max_length=100)


def compute_date_fields(year: int):
    """Compute date fields from year (negative for BCE).
    
    PostgreSQL supports BC dates with the 'YYYY-MM-DD BC' format.
    We return date strings that will be cast in the SQL query.
    """
    is_bce = year < 0
    abs_year = abs(year)
    
    if is_bce:
        # PostgreSQL BC date format
        date_earliest = f"{abs_year:04d}-01-01 BC"
        date_latest = f"{abs_year:04d}-12-31 BC"
    else:
        date_earliest = f"{year:04d}-01-01"
        date_latest = f"{year:04d}-12-31"
    
    return {
        'date_earliest': date_earliest,
        'date_latest': date_latest,
        'is_bce': is_bce,
        'year_approx': year  # Keep as negative for BCE for sorting
    }


async def insert_events(conn) -> dict:
    """Insert new events and return mapping of title substrings to UUIDs."""
    event_map = {}
    inserted = 0
    skipped = 0
    
    for (title, description, year, geo_modern, event_category, geo_era_label, importance_score) in NEW_EVENTS:
        slug = generate_slug(title)
        
        # Check if event already exists
        existing = await conn.fetchval(
            "SELECT id FROM events WHERE slug = $1 OR title = $2",
            slug, title
        )
        
        if existing:
            event_map[title] = existing
            skipped += 1
            continue
        
        date_fields = compute_date_fields(year)
        
        # Use text cast for dates to handle BC dates properly
        event_id = await conn.fetchval(f"""
            INSERT INTO events (
                slug, title, article_summary,
                date_earliest, date_latest, is_bce, year_approx,
                geo_modern, event_category, geo_era_label,
                importance_score, created_by, review_status
            ) VALUES (
                $1, $2, $3,
                '{date_fields['date_earliest']}'::date, 
                '{date_fields['date_latest']}'::date, 
                $4, $5,
                $6, $7, $8,
                $9, 'enrich_underrepresented.py', 'approved'
            ) RETURNING id
        """,
            slug, title, description,
            date_fields['is_bce'], date_fields['year_approx'],
            geo_modern, event_category, geo_era_label,
            importance_score
        )
        
        event_map[title] = event_id
        inserted += 1
    
    print(f"Events: {inserted} inserted, {skipped} already existed")
    return event_map


async def find_event_by_title_substr(conn, substr: str) -> Optional[str]:
    """Find an event ID by title substring."""
    result = await conn.fetchval(
        "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
        f"%{substr}%"
    )
    return result


async def insert_causality_links(conn) -> int:
    """Insert causality links between events."""
    inserted = 0
    skipped = 0
    
    for (cause_substr, effect_substr, link_type_raw, strength, description) in NEW_CAUSALITY_LINKS:
        cause_id = await find_event_by_title_substr(conn, cause_substr)
        effect_id = await find_event_by_title_substr(conn, effect_substr)
        
        if not cause_id or not effect_id:
            print(f"  Skip link: '{cause_substr}' -> '{effect_substr}' (event not found)")
            skipped += 1
            continue
        
        # Check if link already exists
        existing = await conn.fetchval(
            "SELECT id FROM causality_links WHERE cause_event_id = $1 AND effect_event_id = $2",
            cause_id, effect_id
        )
        
        if existing:
            skipped += 1
            continue
        
        # Map link_type to valid DB values
        link_type = LINK_TYPE_MAP.get(link_type_raw, 'indirect')
        
        await conn.execute("""
            INSERT INTO causality_links (
                cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status
            ) VALUES ($1, $2, $3, $4, $5, 'enrich_underrepresented.py', 'approved')
        """, cause_id, effect_id, link_type, strength, description)
        
        inserted += 1
    
    print(f"Causality links: {inserted} inserted, {skipped} skipped")
    return inserted


async def compute_network_y(conn):
    """Compute network_y for affected events using BFS from causality graph."""
    print("Computing network_y positions...")
    
    # Load all events with causality connections
    events = await conn.fetch("""
        SELECT e.id, e.year_approx, e.importance_score
        FROM events e
        WHERE e.id IN (
            SELECT DISTINCT cause_event_id FROM causality_links
            UNION
            SELECT DISTINCT effect_event_id FROM causality_links
        )
    """)
    
    # Build adjacency graph
    links = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    
    children = defaultdict(list)
    parents = defaultdict(list)
    for link in links:
        children[str(link['cause_event_id'])].append(str(link['effect_event_id']))
        parents[str(link['effect_event_id'])].append(str(link['cause_event_id']))
    
    event_ids = {str(e['id']) for e in events}
    event_importance = {str(e['id']): e['importance_score'] or 0.5 for e in events}
    
    # Find root nodes (no parents)
    roots = [eid for eid in event_ids if eid not in parents or not parents[eid]]
    
    # BFS to assign depths
    depth = {}
    sign = {}
    queue = deque()
    
    for i, root in enumerate(roots):
        depth[root] = 0
        sign[root] = 1 if i % 2 == 0 else -1
        queue.append(root)
    
    while queue:
        node = queue.popleft()
        for child in children.get(node, []):
            if child not in depth:
                depth[child] = depth[node] + 1
                sign[child] = sign.get(node, 1)
                queue.append(child)
    
    # Assign network_y based on depth and sign
    max_depth_y = [0, 80, 150, 210, 260, 300]
    
    updates = []
    for eid in event_ids:
        if eid in depth:
            d = min(depth[eid], len(max_depth_y) - 1)
            base_y = max_depth_y[d]
            s = sign.get(eid, 1)
            importance = event_importance.get(eid, 0.5)
            # Add small variation based on importance
            y = s * (base_y + (importance - 0.5) * 20)
            updates.append((y, uuid.UUID(eid)))
        else:
            # Isolated nodes get small nudge
            s = 1 if hash(eid) % 2 == 0 else -1
            updates.append((s * ISOLATED_NUDGE, uuid.UUID(eid)))
    
    # Batch update
    await conn.executemany(
        "UPDATE events SET network_y = $1 WHERE id = $2",
        updates
    )
    
    print(f"Updated network_y for {len(updates)} events")


async def main():
    print("=" * 60)
    print("Chronicle Database Enrichment - Underrepresented Regions")
    print("=" * 60)
    
    conn = await asyncpg.connect(DB_URL)
    
    try:
        # Get current counts
        before_count = await conn.fetchval("SELECT COUNT(*) FROM events")
        before_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        
        print(f"\nBefore: {before_count} events, {before_links} causality links")
        
        # Insert events
        print("\n--- Inserting Events ---")
        await insert_events(conn)
        
        # Insert causality links
        print("\n--- Inserting Causality Links ---")
        await insert_causality_links(conn)
        
        # Compute network_y
        print("\n--- Computing Network Layout ---")
        await compute_network_y(conn)
        
        # Get final counts
        after_count = await conn.fetchval("SELECT COUNT(*) FROM events")
        after_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        
        print(f"\nAfter: {after_count} events (+{after_count - before_count}), "
              f"{after_links} causality links (+{after_links - before_links})")
        
        # Show breakdown by region
        print("\n--- Events by Region (new additions) ---")
        region_counts = await conn.fetch("""
            SELECT geo_era_label, COUNT(*) as cnt
            FROM events
            WHERE created_by = 'enrich_underrepresented.py'
            GROUP BY geo_era_label
            ORDER BY cnt DESC
            LIMIT 20
        """)
        for row in region_counts:
            print(f"  {row['geo_era_label'] or 'Unknown'}: {row['cnt']}")
        
    finally:
        await conn.close()
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
