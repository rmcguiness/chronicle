"""
seed_empires.py — Add ~80 events covering four underrepresented empires/civilizations
and 35+ causality links to the Chronicle database.

Covers: Byzantine Empire, Islamic Golden Age, Tang/Song Dynasty China, Mughal Empire.
Uses slug-based dedup (ON CONFLICT DO NOTHING) and parameterized queries.
"""

import asyncio
import asyncpg
import uuid
from datetime import date


DB_URL = "postgresql://chronicle:chronicle@db:5432/chronicle"
CREATED_BY = "seed-script:empires-enrichment-v1"


# ─── Helper: generate date fields from year_approx ────────────────────────────
def _dates(year: int):
    """Return (date_earliest, date_latest, date_circa) for a given year."""
    return date(year, 1, 1), date(year, 12, 31), True


# ─── Events: (title, slug, year_approx, category, geo_modern, geo_era_label,
#              lat, lng, importance, description) ──────────────────────────────

EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════════
    # BYZANTINE EMPIRE (330–1453 CE) — 18 events
    # Gaps: 395–527, 843–1071, 1071–1204, 1204–1453 periods
    # ═══════════════════════════════════════════════════════════════════════════
    (
        "Theodosian Walls Built — Constantinople's Impregnable Defense",
        "theodosian-walls-built-413",
        413, "military", "Istanbul, Turkey", "Constantinople",
        41.0186, 28.9220, 0.65,
        "Emperor Theodosius II ordered the construction of massive triple walls protecting Constantinople's landward side. These fortifications would repel attackers for over a thousand years, making the city nearly impregnable until 1453."
    ),
    (
        "Council of Chalcedon — Defining Christian Orthodoxy",
        "council-chalcedon-451",
        451, "religious", "Kadıköy, Istanbul, Turkey", "Chalcedon",
        40.9828, 29.0297, 0.70,
        "The Fourth Ecumenical Council defined the dual nature of Christ and established the Patriarch of Constantinople as second in honor after Rome. The council's decisions caused lasting schisms with Oriental Orthodox churches."
    ),
    (
        "Nika Riots — Constantinople Nearly Destroyed",
        "nika-riots-532",
        532, "political", "Istanbul, Turkey", "Constantinople",
        41.0060, 28.9769, 0.65,
        "The most violent riots in Byzantine history nearly toppled Justinian I, destroying much of the capital. Empress Theodora's refusal to flee convinced Justinian to stay, and Belisarius brutally suppressed the revolt, killing tens of thousands."
    ),
    (
        "Basil I Founds the Macedonian Dynasty",
        "basil-i-macedonian-dynasty-867",
        867, "political", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.55,
        "Basil I, a peasant who rose to become emperor, founded the Macedonian dynasty that presided over the Byzantine cultural and military renaissance. This dynasty would rule for nearly two centuries, the empire's golden age."
    ),
    (
        "Byzantine Reconquest Under Nikephoros II Phokas",
        "nikephoros-ii-reconquest-963",
        963, "military", "Antakya, Turkey", "Antioch",
        36.2028, 36.1596, 0.60,
        "Emperor Nikephoros II launched aggressive campaigns recapturing Crete, Cyprus, and parts of Syria from Arab forces. His military successes began a period of Byzantine territorial expansion in the eastern Mediterranean."
    ),
    (
        "Basil II Defeats Bulgaria — The Bulgar Slayer",
        "basil-ii-defeats-bulgaria-1014",
        1014, "military", "Blagoevgrad, Bulgaria", "Kleidion",
        41.4553, 23.4260, 0.70,
        "Emperor Basil II won a decisive victory at the Battle of Kleidion, reportedly blinding 15,000 Bulgarian prisoners. He earned the epithet 'Bulgar Slayer' and brought the entire Balkans under Byzantine control."
    ),
    (
        "Byzantine Empire at Greatest Extent Under Basil II",
        "byzantine-peak-basil-ii-1025",
        1025, "political", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.70,
        "At Basil II's death in 1025, the Byzantine Empire reached its medieval peak, stretching from southern Italy to Armenia and from the Danube to Syria. The treasury was full and the military dominant."
    ),
    (
        "Great Schism — Eastern and Western Christianity Split",
        "great-schism-1054",
        1054, "religious", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.85,
        "Cardinal Humbert excommunicated Patriarch Michael Cerularius, formalizing the split between Roman Catholic and Eastern Orthodox Christianity. The schism reflected centuries of theological, political, and cultural divergence between Rome and Constantinople."
    ),
    (
        "Alexios I Komnenos Restores Byzantine Power",
        "alexios-i-komnenos-1081",
        1081, "political", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.60,
        "Alexios I seized the throne and stabilized the empire after the catastrophic defeat at Manzikert. His appeals to Western Europe for military aid against the Seljuk Turks inadvertently triggered the First Crusade."
    ),
    (
        "Byzantine Art Renaissance — Mosaics and Icons Flourish",
        "byzantine-art-renaissance-1100",
        1100, "cultural", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.55,
        "The Komnenian period saw a flowering of Byzantine art, with magnificent mosaics, illuminated manuscripts, and icon painting reaching new heights. Byzantine artistic influence spread across the Orthodox world from Russia to Sicily."
    ),
    (
        "Latin Empire of Constantinople — Crusader State",
        "latin-empire-constantinople-1204",
        1204, "political", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.65,
        "After the Fourth Crusade sacked Constantinople, Western crusaders established the Latin Empire, fragmenting Byzantine territory. Greek successor states at Nicaea, Trebizond, and Epirus carried on Byzantine traditions."
    ),
    (
        "Michael VIII Palaiologos Recaptures Constantinople",
        "michael-viii-recaptures-constantinople-1261",
        1261, "military", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.65,
        "The Nicaean emperor Michael VIII recaptured Constantinople from the Latin crusaders, restoring the Byzantine Empire. However, the restored empire was greatly diminished in territory and resources."
    ),
    (
        "Byzantine Civil War of 1341–1347",
        "byzantine-civil-war-1341",
        1341, "political", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.50,
        "A devastating civil war between John V Palaiologos and John VI Kantakouzenos weakened the empire fatally. Both sides invited Ottoman and Serbian intervention, accelerating the empire's territorial collapse."
    ),
    (
        "Ottoman Siege of Constantinople — The Final Fall",
        "ottoman-siege-constantinople-1453",
        1453, "military", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.60,
        "Sultan Mehmed II deployed massive cannons and 80,000 troops against Constantinople's ancient walls. The 53-day siege ended on May 29 when Ottoman forces breached the walls, killing Emperor Constantine XI and ending the Roman imperial tradition."
    ),
    (
        "Palaiologos Renaissance — Last Flowering of Byzantine Culture",
        "palaiologos-renaissance-1300",
        1300, "cultural", "Istanbul, Turkey", "Constantinople",
        41.0082, 28.9784, 0.55,
        "Despite political decline, the Palaiologos era saw a remarkable cultural revival in art, theology, and scholarship. Byzantine scholars preserved and transmitted Greek classical texts that would fuel the Italian Renaissance."
    ),
    (
        "Battle of Adrianople — Ottomans Crush Serbian Alliance",
        "battle-adrianople-1365",
        1365, "military", "Edirne, Turkey", "Adrianople",
        41.6818, 26.5623, 0.55,
        "The Ottoman capture of Adrianople gave them a European capital and severed Constantinople from its remaining Balkan territories. Edirne became the Ottoman capital, signaling the empire's permanent European presence."
    ),
    (
        "Battle of Varna — Last Crusade Against the Ottomans Fails",
        "battle-varna-1444",
        1444, "military", "Varna, Bulgaria", "Varna",
        43.2141, 27.9147, 0.55,
        "A crusading army led by King Władysław III of Poland was destroyed by Sultan Murad II at Varna. This was the last major Western attempt to save Constantinople, sealing the Byzantine Empire's fate."
    ),
    (
        "Cyrillic Alphabet Created — Byzantine Cultural Export",
        "cyrillic-alphabet-created-893",
        893, "cultural", "Preslav, Bulgaria", "Preslav",
        43.1620, 26.8100, 0.65,
        "Disciples of Saints Cyril and Methodius developed the Cyrillic alphabet at the Preslav Literary School under Bulgarian patronage. Based on Byzantine Greek, it became the writing system for most Slavic Orthodox peoples."
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # ISLAMIC GOLDEN AGE (750–1258 CE) — 18 events
    # Existing: Baghdad/House of Wisdom, al-Khwarizmi, Avicenna, Harun al-Rashid
    # ═══════════════════════════════════════════════════════════════════════════
    (
        "Jabir ibn Hayyan — Father of Chemistry",
        "jabir-ibn-hayyan-chemistry-800",
        800, "scientific", "Kufa, Iraq", "Kufa, Abbasid Caliphate",
        32.0299, 44.4043, 0.65,
        "Jabir ibn Hayyan developed systematic experimental methods in alchemy, introducing distillation, crystallization, and the classification of substances. His works laid the foundation for modern chemistry and influenced European alchemists for centuries."
    ),
    (
        "Al-Kindi — Philosopher of the Arabs",
        "al-kindi-philosopher-830",
        830, "scientific", "Baghdad, Iraq", "Baghdad, Abbasid Caliphate",
        33.3152, 44.3661, 0.55,
        "Al-Kindi pioneered the integration of Greek philosophy with Islamic theology and made contributions to mathematics, optics, and cryptography. He is considered the first major Islamic philosopher."
    ),
    (
        "Al-Razi — Greatest Medieval Physician",
        "al-razi-physician-900",
        900, "scientific", "Tehran, Iran", "Ray, Abbasid Caliphate",
        35.6027, 51.4472, 0.65,
        "Al-Razi (Rhazes) distinguished smallpox from measles for the first time and wrote over 200 medical texts. His comprehensive medical encyclopedia 'al-Hawi' remained a standard reference in European universities for centuries."
    ),
    (
        "Al-Farabi — Second Teacher After Aristotle",
        "al-farabi-philosopher-950",
        950, "scientific", "Baghdad, Iraq", "Baghdad, Abbasid Caliphate",
        33.3152, 44.3661, 0.55,
        "Al-Farabi wrote extensively on political philosophy, logic, and music theory, earning the title 'Second Teacher' after Aristotle. His 'The Virtuous City' outlined an ideal Islamic political philosophy."
    ),
    (
        "Al-Haytham — Father of Modern Optics",
        "al-haytham-optics-1011",
        1011, "scientific", "Cairo, Egypt", "Cairo, Fatimid Caliphate",
        30.0444, 31.2357, 0.75,
        "Ibn al-Haytham's 'Book of Optics' revolutionized understanding of vision and light, proving that light travels in straight lines and enters the eye. His insistence on experimental proof made him a pioneer of the scientific method."
    ),
    (
        "Al-Biruni — Polymath of the Islamic World",
        "al-biruni-polymath-1030",
        1030, "scientific", "Ghazni, Afghanistan", "Ghazni, Ghaznavid Empire",
        33.5531, 68.4268, 0.60,
        "Al-Biruni calculated the Earth's radius to within 1% accuracy and wrote encyclopedic works on Indian culture, astronomy, and mineralogy. He mastered multiple languages and is considered one of the greatest scholars of the medieval world."
    ),
    (
        "Omar Khayyam — Poet, Mathematician, Astronomer",
        "omar-khayyam-works-1075",
        1075, "scientific", "Isfahan, Iran", "Isfahan, Seljuk Empire",
        32.6546, 51.6680, 0.65,
        "Omar Khayyam solved cubic equations geometrically and reformed the Persian calendar to an accuracy surpassing the Gregorian. His Rubaiyat became one of the most translated works of poetry in history."
    ),
    (
        "Al-Idrisi Creates World Map for Roger II of Sicily",
        "al-idrisi-world-map-1154",
        1154, "scientific", "Palermo, Italy", "Palermo, Kingdom of Sicily",
        38.1157, 13.3615, 0.60,
        "Al-Idrisi created the most accurate world map of the medieval period for the Norman King Roger II. His 'Tabula Rogeriana' and accompanying geographical text influenced European cartography for three centuries."
    ),
    (
        "Nizamiyyah Madrasas Founded — First Universities",
        "nizamiyyah-madrasas-1065",
        1065, "cultural", "Baghdad, Iraq", "Baghdad, Seljuk Empire",
        33.3152, 44.3661, 0.65,
        "Nizam al-Mulk established a network of madrasas across the Seljuk Empire, creating a standardized system of higher education. The Nizamiyyah of Baghdad became the most prestigious institution of Islamic learning."
    ),
    (
        "Al-Ghazali — Reconciling Islam and Philosophy",
        "al-ghazali-philosophy-1095",
        1095, "religious", "Tus, Iran", "Tus, Seljuk Empire",
        36.4600, 59.1800, 0.65,
        "Al-Ghazali's 'Incoherence of the Philosophers' challenged Aristotelian rationalism while his 'Revival of Religious Sciences' integrated Sufism into orthodox Islam. He is considered the most influential Islamic theologian after Muhammad."
    ),
    (
        "Ibn Rushd (Averroes) — Commentator on Aristotle",
        "ibn-rushd-averroes-1180",
        1180, "scientific", "Córdoba, Spain", "Córdoba, Almohad Caliphate",
        37.8882, -4.7794, 0.65,
        "Ibn Rushd's commentaries on Aristotle profoundly influenced both Islamic and European medieval philosophy. His defense of reason and philosophy against al-Ghazali's criticism shaped Scholastic thought in Christian Europe."
    ),
    (
        "Persian Poetry Flourishes — Rumi and the Sufi Tradition",
        "rumi-sufi-poetry-1250",
        1250, "cultural", "Konya, Turkey", "Konya, Sultanate of Rum",
        37.8746, 32.4932, 0.70,
        "Jalal ad-Din Rumi composed the Masnavi, one of the greatest works of mystical poetry in any language. His Sufi philosophy of divine love and whirling dervish practices influenced Islamic spirituality across the world."
    ),
    (
        "Islamic Hospitals — Bimaristans as Medical Centers",
        "islamic-hospitals-bimaristans-805",
        805, "scientific", "Baghdad, Iraq", "Baghdad, Abbasid Caliphate",
        33.3152, 44.3661, 0.60,
        "The first true hospitals (bimaristans) were established in Baghdad, offering free care regardless of religion or wealth. They included separate wards, pharmacies, medical libraries, and training facilities for physicians."
    ),
    (
        "Al-Jazari — Father of Robotics and Mechanical Engineering",
        "al-jazari-mechanical-engineering-1206",
        1206, "scientific", "Diyarbakır, Turkey", "Amid, Artuqid Sultanate",
        37.9144, 40.2306, 0.55,
        "Al-Jazari's 'Book of Knowledge of Ingenious Mechanical Devices' described 50 mechanical devices including programmable automata, combination locks, and the crankshaft. His innovations influenced later European engineering."
    ),
    (
        "Firdawsi Completes the Shahnameh — Persian National Epic",
        "firdawsi-shahnameh-1010",
        1010, "cultural", "Tus, Iran", "Tus, Ghaznavid Empire",
        36.4600, 59.1800, 0.65,
        "Firdawsi spent 30 years composing the Shahnameh (Book of Kings), a 50,000-couplet epic of Persian history and mythology. It preserved the Persian language and identity during the period of Arab cultural dominance."
    ),
    (
        "Islamic Paper Mills Transform Knowledge Production",
        "islamic-paper-mills-794",
        794, "economic", "Baghdad, Iraq", "Baghdad, Abbasid Caliphate",
        33.3152, 44.3661, 0.60,
        "The first paper mill in the Islamic world was established in Baghdad, dramatically reducing the cost of books. Paper spread from Samarkand through the caliphate to Spain, enabling the explosion of Islamic scholarship."
    ),
    (
        "Great Mosque of Samarra — Largest Mosque in the World",
        "great-mosque-samarra-851",
        851, "cultural", "Samarra, Iraq", "Samarra, Abbasid Caliphate",
        34.2060, 43.8751, 0.55,
        "Caliph al-Mutawakkil built the Great Mosque of Samarra with its iconic spiral minaret, the largest mosque ever constructed at that time. It exemplified the grandeur of Abbasid architecture at the caliphate's new capital."
    ),
    (
        "Fatimid Cairo Founded — Al-Qahira the Victorious",
        "fatimid-cairo-founded-969",
        969, "political", "Cairo, Egypt", "Al-Qahira, Fatimid Caliphate",
        30.0444, 31.2357, 0.65,
        "The Fatimid general Jawhar founded Cairo as the new capital of the Fatimid Caliphate, establishing it as a center of Shia learning. Al-Azhar mosque and university, founded the following year, became the preeminent institution of Islamic scholarship."
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # TANG/SONG DYNASTY CHINA (618–1279 CE) — 18 events
    # Existing: Tang founding, An Lushan, poetry, movable type, paper money, compass, gunpowder
    # ═══════════════════════════════════════════════════════════════════════════
    (
        "Imperial Examination System Perfected Under Tang",
        "tang-imperial-examination-630",
        630, "political", "Xi'an, China", "Chang'an, Tang Dynasty",
        34.2658, 108.9541, 0.70,
        "The Tang dynasty expanded and formalized the imperial examination system, opening government service to talent rather than birth. This meritocratic system shaped Chinese governance for over a millennium."
    ),
    (
        "Tang Legal Code — Foundation of East Asian Law",
        "tang-legal-code-624",
        624, "political", "Xi'an, China", "Chang'an, Tang Dynasty",
        34.2658, 108.9541, 0.60,
        "The Tang Code became the most influential legal code in East Asian history, adopted and adapted by Japan, Korea, and Vietnam. It established principles of proportional punishment and judicial procedure."
    ),
    (
        "Chang'an — World's Largest City Under the Tang",
        "changan-largest-city-700",
        700, "cultural", "Xi'an, China", "Chang'an, Tang Dynasty",
        34.2658, 108.9541, 0.65,
        "Tang-era Chang'an was the world's largest city with over one million residents, a cosmopolitan capital welcoming traders and scholars from across Eurasia. Its grid-plan layout influenced urban design throughout East Asia."
    ),
    (
        "Wu Zetian — China's Only Female Emperor",
        "wu-zetian-female-emperor-690",
        690, "political", "Luoyang, China", "Luoyang, Zhou/Tang Dynasty",
        34.6197, 112.4540, 0.70,
        "Wu Zetian became the only woman in Chinese history to assume the title of Emperor, ruling the Zhou interregnum. She expanded the examination system, promoted Buddhism, and extended Tang military reach into Central Asia."
    ),
    (
        "Tang Dynasty Porcelain — Chinese Ceramic Arts",
        "tang-porcelain-arts-725",
        725, "cultural", "Jingdezhen, China", "Jingdezhen, Tang Dynasty",
        29.2869, 117.1786, 0.55,
        "Tang artisans perfected techniques for producing tri-color glazed pottery (sancai) that became prized across the Silk Road. Chinese ceramic technology would later produce true porcelain, exported worldwide."
    ),
    (
        "Battle of Talas — Islam Meets China",
        "battle-talas-751",
        751, "military", "Talas, Kazakhstan", "Talas, Abbasid/Tang Border",
        42.5230, 72.2407, 0.70,
        "Arab and Chinese forces clashed at the Talas River in one of history's most consequential battles. The Abbasid victory halted Tang westward expansion and facilitated the transfer of papermaking technology to the Islamic world."
    ),
    (
        "Du Fu and Li Bai — Pinnacle of Chinese Poetry",
        "du-fu-li-bai-poetry-755",
        755, "cultural", "Xi'an, China", "Chang'an, Tang Dynasty",
        34.2658, 108.9541, 0.65,
        "The mid-Tang era produced China's greatest poets: Li Bai's romantic lyricism and Du Fu's social realism set the standard for Chinese literature. Du Fu's poems documenting the An Lushan Rebellion became foundational texts."
    ),
    (
        "Huang Chao Rebellion Devastates Tang China",
        "huang-chao-rebellion-880",
        880, "military", "Guangzhou, China", "Guangzhou, Tang Dynasty",
        23.1291, 113.2644, 0.60,
        "Huang Chao's massive peasant rebellion captured both Chang'an and Luoyang, massacring thousands including foreign merchants in Guangzhou. The rebellion fatally weakened the Tang dynasty and led to its collapse in 907."
    ),
    (
        "Five Dynasties and Ten Kingdoms Period",
        "five-dynasties-ten-kingdoms-907",
        907, "political", "Kaifeng, China", "Kaifeng, Later Liang",
        34.7972, 114.3076, 0.55,
        "After the Tang collapse, China fragmented into multiple competing states in the north and south. This period of disunion lasted 53 years until the Song reunified most of China."
    ),
    (
        "Song Dynasty Reunifies China",
        "song-dynasty-reunification-960",
        960, "political", "Kaifeng, China", "Bianjing, Song Dynasty",
        34.7972, 114.3076, 0.75,
        "General Zhao Kuangyin founded the Song dynasty, gradually reunifying China through diplomacy and conquest. The Song prioritized civil governance over military expansion, ushering in an era of cultural and technological innovation."
    ),
    (
        "Song Dynasty Maritime Trade — The Age of Chinese Commerce",
        "song-maritime-trade-1100",
        1100, "economic", "Quanzhou, China", "Quanzhou, Song Dynasty",
        24.8741, 118.6757, 0.65,
        "The Song developed the world's most advanced maritime trade network, with Quanzhou becoming a global trading hub. Chinese junks sailed to Southeast Asia, India, and East Africa, exporting porcelain, silk, and tea."
    ),
    (
        "Shen Kuo — Polymath and Scientific Pioneer",
        "shen-kuo-polymath-1088",
        1088, "scientific", "Hangzhou, China", "Lin'an, Song Dynasty",
        30.2741, 120.1551, 0.60,
        "Shen Kuo's 'Dream Pool Essays' documented discoveries in astronomy, geology, mathematics, and engineering. He described magnetic declination, movable type printing, and geological processes centuries before European scientists."
    ),
    (
        "Zhu Xi — Neo-Confucian Philosopher",
        "zhu-xi-neo-confucianism-1175",
        1175, "cultural", "Wuyishan, China", "Wuyi, Song Dynasty",
        27.7564, 118.0324, 0.65,
        "Zhu Xi synthesized Confucian philosophy with Buddhist and Daoist concepts, creating Neo-Confucianism. His commentaries on the Four Books became the basis of the civil service examinations for the next 700 years."
    ),
    (
        "Jurchens Conquer Northern China — Jin Dynasty",
        "jurchens-jin-dynasty-1127",
        1127, "military", "Kaifeng, China", "Bianjing, Song Dynasty",
        34.7972, 114.3076, 0.70,
        "The Jurchen Jin dynasty captured the Song capital Kaifeng and the emperor in the Jingkang Incident. The Song court fled south, establishing the Southern Song dynasty with its capital at Hangzhou."
    ),
    (
        "Southern Song Capital Hangzhou — World's Greatest City",
        "hangzhou-southern-song-capital-1138",
        1138, "cultural", "Hangzhou, China", "Lin'an, Southern Song Dynasty",
        30.2741, 120.1551, 0.60,
        "Hangzhou became the world's most populous and prosperous city under the Southern Song, with over one million residents. Marco Polo later described it as 'the finest and most splendid city in the world.'"
    ),
    (
        "Song Dynasty Rice Revolution — Agricultural Transformation",
        "song-rice-revolution-1012",
        1012, "economic", "Suzhou, China", "Suzhou, Song Dynasty",
        31.2990, 120.5853, 0.60,
        "The introduction of fast-ripening Champa rice from Vietnam allowed double-cropping and dramatically increased food production. This agricultural revolution supported a population boom and urbanization unprecedented in world history."
    ),
    (
        "Chinese Gunpowder Weapons in Song Warfare",
        "song-gunpowder-weapons-1132",
        1132, "military", "Kaifeng, China", "Bianjing, Song Dynasty",
        34.7972, 114.3076, 0.60,
        "The Song military deployed the first true guns (fire lances), bombs, and rockets in warfare against the Jurchen Jin. These weapons represented the first systematic military application of gunpowder technology."
    ),
    (
        "Mongol Conquest of Southern Song — End of an Era",
        "mongol-conquest-southern-song-1279",
        1279, "military", "Guangdong, China", "Yamen, Southern Song",
        22.1492, 113.0587, 0.70,
        "The Battle of Yamen ended the Southern Song dynasty when the last emperor drowned during a naval engagement with Mongol forces. Kublai Khan's Yuan dynasty unified all of China under Mongol rule for the first time."
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # MUGHAL EMPIRE (1526–1857 CE) — 18 events
    # Existing: Babur, Humayun, Akbar, Shah Jahan, Taj Mahal, Aurangzeb, Plassey
    # ═══════════════════════════════════════════════════════════════════════════
    (
        "Battle of Panipat — Babur's Gunpowder Victory",
        "battle-panipat-babur-1526",
        1526, "military", "Panipat, India", "Panipat, Delhi Sultanate",
        29.3909, 76.9635, 0.70,
        "Babur's use of field artillery and matchlocks against Ibrahim Lodi's numerically superior army revolutionized Indian warfare. This first Battle of Panipat established Mughal rule and introduced gunpowder warfare to the subcontinent."
    ),
    (
        "Battle of Khanwa — Mughal Supremacy Established",
        "battle-khanwa-1527",
        1527, "military", "Bharatpur, India", "Khanwa, Rajputana",
        27.1767, 77.1765, 0.55,
        "Babur defeated the Rajput confederacy led by Rana Sanga at Khanwa, securing Mughal control over northern India. The victory was even more decisive than Panipat in establishing the Mughal Empire."
    ),
    (
        "Sher Shah Suri — Administrative Genius Between Mughals",
        "sher-shah-suri-reforms-1540",
        1540, "political", "Sasaram, India", "Sasaram, Sur Empire",
        24.9538, 84.0286, 0.55,
        "Sher Shah Suri defeated Humayun and introduced revolutionary administrative reforms including a standardized currency, land revenue system, and the Grand Trunk Road. The Mughals later adopted many of his innovations."
    ),
    (
        "Second Battle of Panipat — Akbar Secures the Empire",
        "second-battle-panipat-1556",
        1556, "military", "Panipat, India", "Panipat, Mughal Empire",
        29.3909, 76.9635, 0.60,
        "The teenage Akbar's regent Bairam Khan defeated the Hindu general Hemu at Panipat, securing Mughal control over North India. This victory launched Akbar's long and transformative reign."
    ),
    (
        "Fatehpur Sikri — Akbar's Planned Capital",
        "fatehpur-sikri-built-1571",
        1571, "cultural", "Fatehpur Sikri, India", "Fatehpur Sikri, Mughal Empire",
        27.0940, 77.6610, 0.60,
        "Akbar built an entirely new capital at Fatehpur Sikri, blending Hindu, Islamic, and Buddhist architectural styles. The city served as the Mughal capital for 14 years before being abandoned, possibly due to water scarcity."
    ),
    (
        "Akbar's Din-i Ilahi — Experiment in Religious Synthesis",
        "akbar-din-i-ilahi-1582",
        1582, "religious", "Fatehpur Sikri, India", "Fatehpur Sikri, Mughal Empire",
        27.0940, 77.6610, 0.55,
        "Akbar attempted to create a syncretic religion drawing from Islam, Hinduism, Christianity, and Zoroastrianism. Though it attracted few followers, it reflected Akbar's unprecedented policy of religious tolerance."
    ),
    (
        "Mughal Miniature Painting Tradition Flourishes",
        "mughal-miniature-painting-1590",
        1590, "cultural", "Agra, India", "Agra, Mughal Empire",
        27.1767, 78.0081, 0.55,
        "Akbar's imperial workshop produced thousands of exquisite miniature paintings blending Persian, Indian, and European techniques. This artistic tradition reached its peak under Jahangir, who was a connoisseur of naturalistic painting."
    ),
    (
        "Jahangir — Mughal Patron of Arts and Nature",
        "jahangir-reign-begins-1605",
        1605, "political", "Agra, India", "Agra, Mughal Empire",
        27.1767, 78.0081, 0.55,
        "Emperor Jahangir expanded Mughal artistic patronage and maintained detailed memoirs of his reign. His interest in natural history produced stunning botanical and zoological paintings and his court attracted artists from across Asia."
    ),
    (
        "Shah Jahan Builds the Red Fort in Delhi",
        "shah-jahan-red-fort-1648",
        1648, "cultural", "Delhi, India", "Shahjahanabad, Mughal Empire",
        28.6562, 77.2410, 0.60,
        "Shah Jahan moved the Mughal capital from Agra to the newly built Shahjahanabad (Old Delhi), centered on the magnificent Red Fort. The fort complex exemplified the peak of Mughal architectural achievement."
    ),
    (
        "Aurangzeb's Deccan Wars — Imperial Overextension",
        "aurangzeb-deccan-wars-1681",
        1681, "military", "Aurangabad, India", "Aurangabad, Mughal Empire",
        19.8762, 75.3433, 0.60,
        "Aurangzeb spent the last 26 years of his reign in costly wars against the Maratha confederacy in the Deccan. These campaigns drained the treasury and overstretched the empire, contributing to its rapid decline after his death."
    ),
    (
        "Mughal Empire Fragments — Regional Powers Rise",
        "mughal-fragmentation-1720",
        1720, "political", "Delhi, India", "Delhi, Mughal Empire",
        28.6139, 77.2090, 0.60,
        "After Aurangzeb's death, the empire rapidly fragmented as provincial governors and local rulers asserted independence. The Nizam of Hyderabad, Nawab of Bengal, and Awadh became effectively independent states."
    ),
    (
        "Nader Shah Loots Delhi — Mughal Humiliation",
        "nader-shah-loots-delhi-1739",
        1739, "military", "Delhi, India", "Delhi, Mughal Empire",
        28.6139, 77.2090, 0.65,
        "The Persian conqueror Nader Shah invaded India and sacked Delhi, carrying away the Peacock Throne and the Koh-i-Noor diamond. The invasion exposed Mughal military weakness and accelerated the empire's political irrelevance."
    ),
    (
        "Third Battle of Panipat — Maratha Catastrophe",
        "third-battle-panipat-1761",
        1761, "military", "Panipat, India", "Panipat",
        29.3909, 76.9635, 0.65,
        "Ahmad Shah Durrani's Afghan forces crushed the Maratha army at Panipat, killing over 40,000 warriors. The defeat ended Maratha ambitions to replace the Mughals and created the power vacuum that the British would fill."
    ),
    (
        "Mughal Emperor Becomes British Pensioner",
        "mughal-emperor-british-pensioner-1803",
        1803, "political", "Delhi, India", "Delhi, Mughal Empire",
        28.6139, 77.2090, 0.55,
        "After the Battle of Delhi, the British East India Company took control of the Mughal capital and the emperor became a British puppet. Shah Alam II retained the title but wielded no real power."
    ),
    (
        "Indian Rebellion of 1857 — End of the Mughal Dynasty",
        "indian-rebellion-mughal-end-1857",
        1857, "military", "Delhi, India", "Delhi, Mughal Empire",
        28.6139, 77.2090, 0.75,
        "The last Mughal emperor Bahadur Shah Zafar was proclaimed leader of the 1857 rebellion against British rule. After its suppression, the British exiled him to Burma and formally dissolved the Mughal dynasty, ending 331 years of rule."
    ),
    (
        "Mughal Road Network and Caravanserais",
        "mughal-road-network-1600",
        1600, "economic", "Agra, India", "Agra, Mughal Empire",
        27.1767, 78.0081, 0.50,
        "The Mughals built an extensive road network with caravanserais (rest houses) every few miles, facilitating trade across the subcontinent. The Grand Trunk Road connecting Kabul to Bengal was the empire's lifeline."
    ),
    (
        "Sikh Resistance to Mughal Persecution",
        "sikh-resistance-mughal-1675",
        1675, "religious", "Anandpur Sahib, India", "Anandpur, Mughal Empire",
        31.2385, 76.5090, 0.55,
        "The execution of Guru Tegh Bahadur by Aurangzeb radicalized the Sikh community. His son Guru Gobind Singh founded the Khalsa in 1699, transforming Sikhism into a martial tradition that would resist Mughal and later Afghan power."
    ),
    (
        "Mughal Bengal — The Paradise of Nations",
        "mughal-bengal-prosperity-1650",
        1650, "economic", "Dhaka, Bangladesh", "Dhaka, Mughal Bengal",
        23.8103, 90.4125, 0.55,
        "Mughal Bengal produced some of the finest muslin cloth in the world and generated nearly half the Mughal Empire's revenue. European traders called it 'the paradise of nations' for its wealth and agricultural abundance."
    ),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

CAUSALITY_LINKS = [
    # Byzantine
    ("Theodosian Walls Built", "Nika Riots", "contributing", 0.4, "The walls protected Constantinople but the internal pressures led to urban revolt"),
    ("Nika Riots", "Hagia Sophia Completed", "direct", 0.8, "Justinian rebuilt the cathedral after rioters destroyed the previous church"),
    ("Corpus Juris Civilis", "Alexios I Komnenos", "indirect", 0.4, "Justinian's legal framework provided institutional continuity for later emperors"),
    ("Battle of Manzikert", "Alexios I Komnenos", "direct", 0.8, "The catastrophic defeat at Manzikert created the crisis that brought Alexios to power"),
    ("Alexios I Komnenos", "First Crusade", "direct", 0.9, "Alexios's appeal for Western military aid triggered Pope Urban II's call for a crusade"),
    ("Fourth Crusade Sacks Constantinople", "Latin Empire of Constantinople", "direct", 0.95, "The sack directly created the Latin Empire on Byzantine ruins"),
    ("Latin Empire of Constantinople", "Michael VIII Recaptures Constantinople", "direct", 0.9, "The Greek successor states fought to recapture the capital from Latin crusaders"),
    ("Byzantine Civil War of 1341", "Ottoman Siege of Constantinople", "contributing", 0.6, "The civil war fatally weakened the empire, inviting Ottoman encroachment"),
    ("Battle of Varna", "Fall of Constantinople", "contributing", 0.7, "The failed crusade at Varna sealed Constantinople's fate by removing Western relief"),
    ("Basil II Defeats Bulgaria", "Byzantine Empire at Greatest Extent", "direct", 0.9, "Basil II's Balkan conquests brought the empire to its medieval territorial peak"),
    ("Palaiologos Renaissance", "Fall of Constantinople", "indirect", 0.5, "Byzantine scholars fleeing Constantinople transmitted Greek learning to the Italian Renaissance"),
    ("Cyrillic Alphabet Created", "Baptism of Vladimir", "contributing", 0.6, "The Cyrillic script enabled Slavic liturgy, facilitating the conversion of Kievan Rus"),

    # Islamic Golden Age
    ("Islamic Paper Mills Transform", "House of Wisdom", "direct", 0.8, "Cheap paper production enabled the massive translation and scholarly output of the House of Wisdom"),
    ("House of Wisdom", "Al-Khwarizmi", "direct", 0.85, "Al-Khwarizmi worked at the House of Wisdom where he developed algebra"),
    ("House of Wisdom", "Al-Kindi", "direct", 0.8, "Al-Kindi was the first great philosopher to work at the House of Wisdom"),
    ("Al-Razi", "Avicenna", "contributing", 0.7, "Al-Razi's medical works influenced Avicenna's comprehensive Canon of Medicine"),
    ("Nizamiyyah Madrasas Founded", "Al-Ghazali", "direct", 0.8, "Al-Ghazali taught at the Nizamiyyah of Baghdad, the most prestigious madrasa"),
    ("Al-Ghazali", "Ibn Rushd", "direct", 0.85, "Ibn Rushd wrote 'Incoherence of the Incoherence' as a direct response to al-Ghazali"),
    ("Fatimid Cairo Founded", "Al-Haytham", "direct", 0.7, "Al-Haytham worked in Fatimid Cairo where he wrote his groundbreaking Book of Optics"),
    ("Firdawsi Completes the Shahnameh", "Rumi and the Sufi Tradition", "indirect", 0.5, "Firdawsi's revival of Persian literary culture laid the groundwork for later Persian poetry"),
    ("Mongols Sack Baghdad", "Rumi and the Sufi Tradition", "contributing", 0.5, "The Mongol destruction of Baghdad scattered scholars westward, enriching Anatolian culture"),
    ("Great Mosque of Samarra", "Fatimid Cairo Founded", "indirect", 0.4, "Abbasid architectural grandeur inspired Fatimid builders in Cairo"),

    # Tang/Song China
    ("Tang Legal Code", "Imperial Examination System Perfected", "direct", 0.7, "The Tang legal framework institutionalized the examination system"),
    ("Imperial Examination System Perfected", "Wu Zetian", "contributing", 0.6, "Wu Zetian expanded the exam system to broaden the pool of loyal officials"),
    ("An Lushan Rebellion", "Du Fu and Li Bai", "contributing", 0.7, "Du Fu's greatest poems were written during and about the An Lushan Rebellion"),
    ("An Lushan Rebellion", "Huang Chao Rebellion", "indirect", 0.5, "The An Lushan Rebellion weakened Tang central authority, enabling later peasant revolts"),
    ("Huang Chao Rebellion", "Five Dynasties and Ten Kingdoms", "direct", 0.85, "Huang Chao's devastation fatally weakened the Tang, leading to its collapse and fragmentation"),
    ("Five Dynasties and Ten Kingdoms", "Song Dynasty Reunifies China", "direct", 0.9, "The Song emerged from the Five Dynasties period to reunify most of China"),
    ("Song Dynasty Rice Revolution", "Song Maritime Trade", "contributing", 0.6, "Agricultural surplus fueled urbanization and the commercial revolution that drove maritime trade"),
    ("Jurchens Conquer Northern China", "Southern Song Capital Hangzhou", "direct", 0.95, "The Jurchen conquest forced the Song court south, making Hangzhou the capital"),
    ("Battle of Talas", "Islamic Paper Mills Transform", "direct", 0.8, "Chinese papermakers captured at Talas transmitted papermaking technology to the Islamic world"),
    ("Song Gunpowder Weapons", "Mongol Conquest of Southern Song", "indirect", 0.4, "The Mongols adopted and improved Song gunpowder weapons to use against them"),

    # Mughal Empire
    ("Battle of Panipat — Babur", "Battle of Khanwa", "direct", 0.9, "Babur's victory at Panipat set up the decisive confrontation with the Rajputs at Khanwa"),
    ("Sher Shah Suri", "Akbar the Great", "contributing", 0.6, "Akbar's administration adopted many of Sher Shah's innovations including the land revenue system"),
    ("Akbar's Din-i Ilahi", "Aurangzeb Reimposses Jizya", "indirect", 0.5, "Aurangzeb's religious conservatism was partly a reaction against Akbar's syncretic experiments"),
    ("Aurangzeb's Deccan Wars", "Mughal Empire Fragments", "direct", 0.85, "Aurangzeb's costly Deccan campaigns drained the treasury and led to post-death fragmentation"),
    ("Mughal Empire Fragments", "Nader Shah Loots Delhi", "direct", 0.8, "The fragmented empire could not resist Nader Shah's invasion"),
    ("Nader Shah Loots Delhi", "Third Battle of Panipat", "contributing", 0.5, "Nader Shah's invasion further weakened Mughal authority, creating a power vacuum"),
    ("Third Battle of Panipat", "Battle of Plassey", "indirect", 0.5, "The Maratha defeat at Panipat removed the main Indian power that could have resisted British expansion"),
    ("Mughal Emperor Becomes British Pensioner", "Indian Rebellion of 1857", "direct", 0.7, "The puppet Mughal emperor became a rallying symbol for the 1857 rebellion"),
    ("Sikh Resistance to Mughal", "Sikh Empire Under Ranjit Singh", "direct", 0.8, "Guru Gobind Singh's militarization of Sikhism led to the later Sikh Empire"),
]


async def main():
    """Insert events and causality links into the Chronicle database."""
    conn = await asyncpg.connect(DB_URL)
    print(f"Connected to database. Inserting {len(EVENTS)} events...")

    inserted_events = 0
    for ev in EVENTS:
        (title, slug, year, category, geo_modern, geo_era_label,
         lat, lng, importance, description) = ev
        date_earliest, date_latest, date_circa = _dates(year)

        result = await conn.execute(
            """
            INSERT INTO events (
                id, slug, title, year_approx, event_category,
                geo_modern, geo_era_label,
                geo_point, importance_score,
                date_earliest, date_latest, date_circa,
                article_summary, created_by, review_status
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7,
                ST_SetSRID(ST_MakePoint($8, $9), 4326), $10,
                $11, $12, $13,
                $14, $15, 'approved'
            )
            ON CONFLICT (slug) DO NOTHING
            """,
            str(uuid.uuid4()), slug, title, year, category,
            geo_modern, geo_era_label,
            lng, lat, importance,
            date_earliest, date_latest, date_circa,
            description, CREATED_BY,
        )
        if "INSERT 0 1" in result:
            inserted_events += 1

    print(f"Inserted {inserted_events} new events (skipped {len(EVENTS) - inserted_events} duplicates).")

    # ─── Causality Links ──────────────────────────────────────────────────
    print(f"Inserting {len(CAUSALITY_LINKS)} causality links...")
    inserted_links = 0

    for cause_frag, effect_frag, link_type, strength, desc in CAUSALITY_LINKS:
        cause_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{cause_frag}%",
        )
        effect_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{effect_frag}%",
        )
        if not cause_id or not effect_id:
            print(f"  SKIP: '{cause_frag}' → '{effect_frag}' (event not found)")
            continue
        if cause_id == effect_id:
            print(f"  SKIP: '{cause_frag}' → '{effect_frag}' (same event)")
            continue

        result = await conn.execute(
            """
            INSERT INTO causality_links (
                id, cause_event_id, effect_event_id,
                link_type, strength, description,
                created_by, review_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'approved')
            ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING
            """,
            str(uuid.uuid4()), cause_id, effect_id,
            link_type, strength, desc, CREATED_BY,
        )
        if "INSERT 0 1" in result:
            inserted_links += 1

    print(f"Inserted {inserted_links} new causality links.")

    # ─── Recompute network_y ──────────────────────────────────────────────
    print("Recomputing network_y for all events...")
    await conn.execute(
        "UPDATE events SET network_y = year_approx * 10 WHERE year_approx IS NOT NULL"
    )
    print("Done recomputing network_y.")

    await conn.close()
    print("Complete!")


if __name__ == "__main__":
    asyncio.run(main())
