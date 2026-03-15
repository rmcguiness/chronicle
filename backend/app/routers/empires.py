"""
Empires router — serves hardcoded data about 20 great world empires
plus any related Chronicle events from the database.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Event

router = APIRouter(prefix="/api/empires", tags=["empires"])

# ── Hardcoded empire dataset ─────────────────────────────────────────────────

EMPIRES = [
    {
        "id": "achaemenid-persian",
        "name": "Achaemenid Persian Empire",
        "alt_names": ["First Persian Empire", "Achaemenid Empire"],
        "start_year": -550,
        "end_year": -330,
        "duration_years": 220,
        "peak_km2": 5_500_000,
        "peak_comparison": "larger than the European Union today",
        "capital": "Persepolis",
        "founding_ruler": "Cyrus the Great",
        "famous_ruler": "Darius I",
        "region": "Middle East",
        "continent": "Asia",
        "era": "Ancient",
        "known_for": "Administration, Royal Road postal system, tolerance of diverse cultures",
        "height_description": "At its zenith under Darius I, the Achaemenid Empire stretched from Egypt and Libya in the west to the Indus Valley in the east. It pioneered the concept of a multinational empire governed through satrapies with standardized coinage and law.",
        "legacy": "Concept of universal empire, satrap governance model, Zoroastrian influence on Judaism/Christianity/Islam, the Royal Road communication network.",
        "search_query": "Persian Empire",
    },
    {
        "id": "macedonian-hellenistic",
        "name": "Macedonian Empire",
        "alt_names": ["Empire of Alexander the Great", "Hellenistic Empire"],
        "start_year": -336,
        "end_year": -323,
        "duration_years": 13,
        "peak_km2": 5_200_000,
        "peak_comparison": "spanning three continents from Greece to India",
        "capital": "Babylon (later)",
        "founding_ruler": "Alexander the Great",
        "famous_ruler": "Alexander the Great",
        "region": "Mediterranean / Central Asia",
        "continent": "Multi-continental",
        "era": "Ancient",
        "known_for": "Military conquest, cultural fusion (Hellenism), spread of Greek language and philosophy",
        "height_description": "Alexander conquered the known world in just 13 years, creating an empire from Greece to northwestern India. His campaigns spread Greek culture across Asia, creating a lasting Hellenistic civilization that endured for centuries after his death.",
        "legacy": "Hellenistic culture, the spread of Greek language as lingua franca, founding of Alexandria, fusion of Eastern and Western traditions.",
        "search_query": "Alexander the Great",
    },
    {
        "id": "maurya",
        "name": "Maurya Empire",
        "alt_names": ["Mauryan Empire"],
        "start_year": -322,
        "end_year": -187,
        "duration_years": 135,
        "peak_km2": 5_000_000,
        "peak_comparison": "covering nearly all of the Indian subcontinent",
        "capital": "Pataliputra",
        "founding_ruler": "Chandragupta Maurya",
        "famous_ruler": "Ashoka the Great",
        "region": "South Asia",
        "continent": "Asia",
        "era": "Ancient",
        "known_for": "Ashoka's embrace of Buddhism, rock edicts, centralized administration, espionage network",
        "height_description": "Under Ashoka, the Maurya Empire unified nearly the entire Indian subcontinent for the first time. After the bloody Kalinga War, Ashoka renounced violence and promoted Buddhism, erecting pillars and edicts across his realm.",
        "legacy": "Spread of Buddhism across Asia, Arthashastra political treatise, Indian administrative traditions, Ashoka's lion capital (now India's national emblem).",
        "search_query": "Maurya Empire Ashoka",
    },
    {
        "id": "roman",
        "name": "Roman Empire",
        "alt_names": ["Imperium Romanum"],
        "start_year": -27,
        "end_year": 476,
        "duration_years": 503,
        "peak_km2": 5_000_000,
        "peak_comparison": "encircling the entire Mediterranean Sea",
        "capital": "Rome (later Constantinople)",
        "founding_ruler": "Augustus (as Emperor)",
        "famous_ruler": "Trajan",
        "region": "Mediterranean / Europe",
        "continent": "Multi-continental",
        "era": "Classical",
        "known_for": "Law, engineering (roads, aqueducts), military organization, Latin language, republican ideals",
        "height_description": "At its greatest extent under Trajan in 117 CE, Rome controlled the entire Mediterranean basin, much of Western Europe, and parts of the Middle East. The Pax Romana brought unprecedented stability and prosperity to millions.",
        "legacy": "Roman law (basis of Western legal systems), Latin and Romance languages, Christianity's spread, architectural and engineering principles, republican governance concepts.",
        "search_query": "Roman Empire",
    },
    {
        "id": "han-dynasty",
        "name": "Han Dynasty",
        "alt_names": ["Han Empire"],
        "start_year": -206,
        "end_year": 220,
        "duration_years": 426,
        "peak_km2": 6_000_000,
        "peak_comparison": "roughly the size of modern China plus Central Asian territories",
        "capital": "Chang'an (Xi'an)",
        "founding_ruler": "Emperor Gaozu (Liu Bang)",
        "famous_ruler": "Emperor Wu",
        "region": "East Asia",
        "continent": "Asia",
        "era": "Classical",
        "known_for": "Silk Road trade, paper invention, Confucian civil service, historiography",
        "height_description": "The Han Dynasty established China as a major world power, opening the Silk Road that connected East Asia to the Mediterranean. Under Emperor Wu, the empire expanded deep into Central Asia and established the civil service examination system.",
        "legacy": "The Chinese people still call themselves 'Han' today. Paper invention, Silk Road trade networks, Confucian governance model, Chinese historiographic tradition.",
        "search_query": "Han Dynasty China",
    },
    {
        "id": "gupta",
        "name": "Gupta Empire",
        "alt_names": ["Gupta Dynasty"],
        "start_year": 320,
        "end_year": 550,
        "duration_years": 230,
        "peak_km2": 3_500_000,
        "peak_comparison": "covering most of northern and central India",
        "capital": "Pataliputra",
        "founding_ruler": "Sri Gupta",
        "famous_ruler": "Chandragupta II",
        "region": "South Asia",
        "continent": "Asia",
        "era": "Classical",
        "known_for": "Science (zero, decimal system), literature (Kalidasa), art, Nalanda university",
        "height_description": "The Gupta period is called India's Golden Age. Under Chandragupta II, the empire saw extraordinary advances in mathematics, astronomy, literature, and art while maintaining religious tolerance across Hindu, Buddhist, and Jain communities.",
        "legacy": "Invention of the numeral zero and decimal system, classical Sanskrit literature, Hindu temple architecture, Ayurvedic medicine codification.",
        "search_query": "Gupta Empire India",
    },
    {
        "id": "byzantine",
        "name": "Byzantine Empire",
        "alt_names": ["Eastern Roman Empire"],
        "start_year": 330,
        "end_year": 1453,
        "duration_years": 1123,
        "peak_km2": 3_500_000,
        "peak_comparison": "spanning southeastern Europe, Anatolia, and North Africa",
        "capital": "Constantinople (Istanbul)",
        "founding_ruler": "Constantine I",
        "famous_ruler": "Justinian I",
        "region": "Mediterranean / Eastern Europe",
        "continent": "Multi-continental",
        "era": "Medieval",
        "known_for": "Preservation of Roman and Greek knowledge, Orthodox Christianity, Hagia Sophia, Justinian's Code",
        "height_description": "Under Justinian I, the Byzantine Empire reconquered much of the western Mediterranean and produced the Corpus Juris Civilis — the foundation of modern civil law. Constantinople was the richest and most cultured city in the medieval world.",
        "legacy": "Preservation of Greco-Roman knowledge through the Dark Ages, Orthodox Christianity, Justinian's legal code, Byzantine art and architecture, influence on Slavic cultures.",
        "search_query": "Byzantine Empire",
    },
    {
        "id": "islamic-caliphate",
        "name": "Islamic Caliphate",
        "alt_names": ["Umayyad/Abbasid Caliphate", "Rashidun Caliphate"],
        "start_year": 632,
        "end_year": 1258,
        "duration_years": 626,
        "peak_km2": 11_000_000,
        "peak_comparison": "larger than the Roman Empire at its height, stretching from Spain to Central Asia",
        "capital": "Medina → Damascus → Baghdad",
        "founding_ruler": "Abu Bakr (first Caliph)",
        "famous_ruler": "Harun al-Rashid",
        "region": "Middle East / North Africa",
        "continent": "Multi-continental",
        "era": "Medieval",
        "known_for": "Islamic Golden Age, algebra, optics, medicine, translation movement preserving Greek philosophy",
        "height_description": "The Abbasid Caliphate under Harun al-Rashid presided over the Islamic Golden Age, with Baghdad as the world's leading center of learning. The House of Wisdom translated and advanced Greek, Persian, and Indian scientific knowledge.",
        "legacy": "Algebra and algorithm (from al-Khwarizmi), Arabic numerals transmission, preservation and advancement of classical knowledge, architectural innovations (arches, domes), coffee culture.",
        "search_query": "Islamic Caliphate",
    },
    {
        "id": "tang-dynasty",
        "name": "Tang Dynasty",
        "alt_names": ["Tang Empire"],
        "start_year": 618,
        "end_year": 907,
        "duration_years": 289,
        "peak_km2": 5_400_000,
        "peak_comparison": "larger than the modern European Union",
        "capital": "Chang'an (Xi'an)",
        "founding_ruler": "Emperor Gaozu (Li Yuan)",
        "famous_ruler": "Emperor Taizong",
        "region": "East Asia",
        "continent": "Asia",
        "era": "Medieval",
        "known_for": "Poetry (Li Bai, Du Fu), Silk Road peak, cosmopolitan culture, printing, gunpowder",
        "height_description": "The Tang Dynasty is considered China's golden age of poetry, art, and cosmopolitan culture. Chang'an was the world's largest city with over a million people, hosting merchants and monks from across Eurasia along the Silk Road.",
        "legacy": "Classical Chinese poetry tradition, block printing, gunpowder development, influence on Japanese and Korean culture, cosmopolitan model of governance.",
        "search_query": "Tang Dynasty",
    },
    {
        "id": "mongol",
        "name": "Mongol Empire",
        "alt_names": ["Mongol Khanate", "Great Mongol State"],
        "start_year": 1206,
        "end_year": 1368,
        "duration_years": 162,
        "peak_km2": 24_000_000,
        "peak_comparison": "the largest contiguous land empire in history — larger than Africa",
        "capital": "Karakorum → Khanbaliq (Beijing)",
        "founding_ruler": "Genghis Khan",
        "famous_ruler": "Kublai Khan",
        "region": "Central Asia / Global",
        "continent": "Multi-continental",
        "era": "Medieval",
        "known_for": "Military innovation, Pax Mongolica trade, religious tolerance, postal system (Yam)",
        "height_description": "The Mongol Empire connected East and West like never before, creating the Pax Mongolica that allowed safe trade from China to Europe. At its peak under Kublai Khan, it ruled over 100 million people across a quarter of the world's land.",
        "legacy": "Reopened Silk Road trade, spread of gunpowder and plague to Europe, diplomatic precedents, Yam postal relay system, lasting political impact across Eurasia.",
        "search_query": "Mongol Empire Genghis Khan",
    },
    {
        "id": "mali",
        "name": "Mali Empire",
        "alt_names": ["Manden Kurufaba"],
        "start_year": 1235,
        "end_year": 1600,
        "duration_years": 365,
        "peak_km2": 1_200_000,
        "peak_comparison": "roughly the size of modern South Africa",
        "capital": "Niani",
        "founding_ruler": "Sundiata Keita",
        "famous_ruler": "Mansa Musa",
        "region": "West Africa",
        "continent": "Africa",
        "era": "Medieval",
        "known_for": "Gold trade, Timbuktu scholarship, Mansa Musa's legendary wealth and hajj",
        "height_description": "Mali controlled trans-Saharan gold and salt trade, making it fabulously wealthy. Mansa Musa's 1324 pilgrimage to Mecca — distributing so much gold he crashed Egypt's economy — remains legendary as history's most extravagant display of wealth.",
        "legacy": "Timbuktu as a center of Islamic scholarship, oral tradition (griots), trans-Saharan trade networks, the Manden Charter (early human rights declaration).",
        "search_query": "Mali Empire Mansa Musa",
    },
    {
        "id": "ottoman",
        "name": "Ottoman Empire",
        "alt_names": ["Ottoman State", "Sublime Porte"],
        "start_year": 1299,
        "end_year": 1922,
        "duration_years": 623,
        "peak_km2": 5_200_000,
        "peak_comparison": "controlling southeastern Europe, the Middle East, and North Africa",
        "capital": "Istanbul (Constantinople)",
        "founding_ruler": "Osman I",
        "famous_ruler": "Suleiman the Magnificent",
        "region": "Middle East / Southeast Europe",
        "continent": "Multi-continental",
        "era": "Early Modern",
        "known_for": "Architecture (Sinan), millet system of religious governance, military (Janissaries), control of trade routes",
        "height_description": "Under Suleiman the Magnificent, the Ottoman Empire was Europe's most powerful state, controlling vital trade routes and threatening Vienna. Istanbul was the crossroads of East and West, famed for its mosques, bazaars, and cosmopolitan culture.",
        "legacy": "Modern Turkey and much of the Middle East's borders, architectural masterpieces (Blue Mosque, Topkapi), millet system of religious pluralism, Turkish coffee and bath culture.",
        "search_query": "Ottoman Empire",
    },
    {
        "id": "ming-dynasty",
        "name": "Ming Dynasty",
        "alt_names": ["Great Ming"],
        "start_year": 1368,
        "end_year": 1644,
        "duration_years": 276,
        "peak_km2": 6_500_000,
        "peak_comparison": "roughly the size of modern Australia",
        "capital": "Nanjing → Beijing",
        "founding_ruler": "Hongwu Emperor (Zhu Yuanzhang)",
        "famous_ruler": "Yongle Emperor",
        "region": "East Asia",
        "continent": "Asia",
        "era": "Early Modern",
        "known_for": "Great Wall reconstruction, Forbidden City, Zheng He's treasure fleet voyages, porcelain",
        "height_description": "The Ming Dynasty rebuilt China after Mongol rule, constructing the Forbidden City and the Great Wall as we know it today. Under the Yongle Emperor, Zheng He's massive treasure fleets sailed as far as East Africa decades before European exploration.",
        "legacy": "The Great Wall (current form), Forbidden City, blue-and-white porcelain (still called 'china'), Ming-era urban planning, the novel as a literary form in Chinese culture.",
        "search_query": "Ming Dynasty China",
    },
    {
        "id": "aztec",
        "name": "Aztec Empire",
        "alt_names": ["Triple Alliance", "Mexica Empire"],
        "start_year": 1428,
        "end_year": 1521,
        "duration_years": 93,
        "peak_km2": 200_000,
        "peak_comparison": "about the size of modern Great Britain",
        "capital": "Tenochtitlan (Mexico City)",
        "founding_ruler": "Itzcoatl",
        "famous_ruler": "Montezuma II",
        "region": "Mesoamerica",
        "continent": "Americas",
        "era": "Early Modern",
        "known_for": "Chinampas (floating gardens), monumental architecture, sophisticated calendar, ritual practices",
        "height_description": "Tenochtitlan, built on an island in Lake Texcoco, was one of the world's largest cities with over 200,000 inhabitants — larger than any European city of its time. The Aztec Triple Alliance dominated Mesoamerica through military prowess and tribute networks.",
        "legacy": "Mexico City built on Tenochtitlan's ruins, Nahuatl loanwords (chocolate, tomato, avocado), chinampa agricultural technique, Mesoamerican artistic traditions.",
        "search_query": "Aztec Empire",
    },
    {
        "id": "inca",
        "name": "Inca Empire",
        "alt_names": ["Tawantinsuyu"],
        "start_year": 1438,
        "end_year": 1533,
        "duration_years": 95,
        "peak_km2": 2_000_000,
        "peak_comparison": "stretching the length of South America's Pacific coast",
        "capital": "Cusco",
        "founding_ruler": "Pachacuti",
        "famous_ruler": "Pachacuti",
        "region": "South America",
        "continent": "Americas",
        "era": "Early Modern",
        "known_for": "Road system (40,000 km), quipu record keeping, terrace farming, Machu Picchu, no written language or currency",
        "height_description": "The Inca built the largest empire in pre-Columbian Americas without a writing system, wheeled vehicles, or iron tools. Their 40,000 km road network through the Andes — with suspension bridges and relay runners — rivaled Rome's engineering achievements.",
        "legacy": "Machu Picchu, terrace farming techniques still used today, quipu information systems, Quechua language (still spoken by millions), Andean textile traditions.",
        "search_query": "Inca Empire",
    },
    {
        "id": "mughal",
        "name": "Mughal Empire",
        "alt_names": ["Mogul Empire"],
        "start_year": 1526,
        "end_year": 1857,
        "duration_years": 331,
        "peak_km2": 4_000_000,
        "peak_comparison": "covering nearly all of the Indian subcontinent and Afghanistan",
        "capital": "Agra → Delhi",
        "founding_ruler": "Babur",
        "famous_ruler": "Akbar the Great",
        "region": "South Asia",
        "continent": "Asia",
        "era": "Early Modern",
        "known_for": "Taj Mahal, religious syncretism under Akbar, Mughal miniature painting, Indo-Islamic architecture",
        "height_description": "Under Akbar, the Mughal Empire pioneered religious tolerance and cultural fusion, blending Persian, Central Asian, and Indian traditions. At its economic peak, Mughal India produced about 25% of world GDP — more than all of Europe combined.",
        "legacy": "Taj Mahal, Mughal cuisine (biryani, naan), Urdu language, Indo-Islamic architecture, administrative systems that the British Raj later adopted.",
        "search_query": "Mughal Empire",
    },
    {
        "id": "spanish",
        "name": "Spanish Empire",
        "alt_names": ["Hispanic Monarchy", "Monarquía Hispánica"],
        "start_year": 1492,
        "end_year": 1976,
        "duration_years": 484,
        "peak_km2": 13_700_000,
        "peak_comparison": "the first truly global empire — spanning four continents",
        "capital": "Madrid",
        "founding_ruler": "Ferdinand & Isabella",
        "famous_ruler": "Charles V / Philip II",
        "region": "Global",
        "continent": "Multi-continental",
        "era": "Early Modern",
        "known_for": "Age of Exploration, colonization of the Americas, silver trade, Catholic missions, Columbian Exchange",
        "height_description": "Under Philip II, the Spanish Empire became the first on which 'the sun never set,' controlling vast territories across the Americas, Philippines, and parts of Europe and Africa. Spanish silver from Potosí fueled the first global economy.",
        "legacy": "Spanish language (500M+ speakers), Catholic heritage across Latin America, Columbian Exchange (global transfer of crops, animals, diseases), colonial urban planning (Laws of the Indies).",
        "search_query": "Spanish Empire",
    },
    {
        "id": "british",
        "name": "British Empire",
        "alt_names": ["British Colonial Empire"],
        "start_year": 1583,
        "end_year": 1997,
        "duration_years": 414,
        "peak_km2": 35_500_000,
        "peak_comparison": "the largest empire in history — covering a quarter of the world's land",
        "capital": "London",
        "founding_ruler": "Elizabeth I (colonial era)",
        "famous_ruler": "Queen Victoria",
        "region": "Global",
        "continent": "Multi-continental",
        "era": "Modern",
        "known_for": "Industrial Revolution, global trade networks, English language spread, parliamentary democracy export, naval supremacy",
        "height_description": "At its 1920s peak, the British Empire ruled over 412 million people — a quarter of the world's population — and covered 35.5 million km². The Royal Navy ensured Pax Britannica, while British institutions, language, and law reshaped the modern world.",
        "legacy": "English as a global lingua franca, parliamentary democracy, common law legal systems, the Commonwealth of Nations, global sports (cricket, football, rugby), industrial capitalism.",
        "search_query": "British Empire",
    },
    {
        "id": "qing-dynasty",
        "name": "Qing Dynasty",
        "alt_names": ["Manchu Dynasty", "Great Qing"],
        "start_year": 1644,
        "end_year": 1912,
        "duration_years": 268,
        "peak_km2": 13_100_000,
        "peak_comparison": "larger than modern China, including Tibet, Mongolia, and Manchuria",
        "capital": "Beijing",
        "founding_ruler": "Shunzhi Emperor (Nurhaci founded Manchu state)",
        "famous_ruler": "Kangxi Emperor",
        "region": "East Asia",
        "continent": "Asia",
        "era": "Early Modern",
        "known_for": "Territorial expansion, Kangxi-Qianlong golden age, population boom, literary inquisition, collision with Western powers",
        "height_description": "Under the Kangxi and Qianlong emperors, the Qing doubled China's territory and presided over a 'prosperous age' where the population tripled. It was the world's largest economy for most of the 18th century before its dramatic decline in the 19th.",
        "legacy": "Modern China's territorial boundaries (including Tibet and Xinjiang), Manchu cultural influence, the century of humiliation narrative in Chinese identity, last imperial dynasty's fall sparking republican revolution.",
        "search_query": "Qing Dynasty China",
    },
    {
        "id": "russian",
        "name": "Russian Empire",
        "alt_names": ["Imperial Russia"],
        "start_year": 1721,
        "end_year": 1917,
        "duration_years": 196,
        "peak_km2": 22_800_000,
        "peak_comparison": "the third-largest empire ever — spanning 11 time zones from Poland to Alaska",
        "capital": "St. Petersburg",
        "founding_ruler": "Peter the Great (as Emperor)",
        "famous_ruler": "Catherine the Great",
        "region": "Eurasia",
        "continent": "Multi-continental",
        "era": "Modern",
        "known_for": "Westernization under Peter, literary golden age (Tolstoy, Dostoevsky), Trans-Siberian railway, serfdom",
        "height_description": "The Russian Empire stretched from Warsaw to Vladivostok, spanning 11 time zones and encompassing hundreds of ethnic groups. Under Catherine the Great, Russia became a major European power, while its 19th-century literary and musical output became world-defining.",
        "legacy": "Russian literature and classical music tradition, the geopolitical shape of modern Russia, the 1917 Revolution that birthed the Soviet Union, Trans-Siberian Railway, the Great Game's impact on Central Asia.",
        "search_query": "Russian Empire",
    },
]

SURPRISING_FACTS = [
    {
        "title": "The Mongol Empire delivered mail faster than the US Postal Service",
        "description": "The Mongol Yam postal relay system could deliver messages across 4,000+ miles in days using a network of relay stations spaced 25 miles apart. Riders galloped between stations, switching to fresh horses, achieving speeds that the early US Postal Service couldn't match for centuries.",
    },
    {
        "title": "Mansa Musa crashed Egypt's economy with generosity",
        "description": "When Mali Emperor Mansa Musa passed through Cairo on his 1324 hajj to Mecca, he gave away so much gold that he caused hyperinflation that took over a decade to recover from. He may have been the wealthiest person in all of human history.",
    },
    {
        "title": "The Aztec capital was larger than any city in Europe",
        "description": "When Spanish conquistadors first saw Tenochtitlan in 1519, its population of 200,000–300,000 made it larger than Paris, London, or any European city. It was built on an island with causeways, aqueducts, and floating gardens — the conquistadors compared it to Venice.",
    },
    {
        "title": "The Inca built a 40,000 km road network without the wheel",
        "description": "The Inca road system was longer than the diameter of the Earth, cutting through some of the world's most extreme terrain in the Andes — all without wheeled vehicles, iron tools, or draft animals. Relay runners (chasquis) could deliver messages 240 km per day.",
    },
    {
        "title": "Mughal India produced 25% of world GDP",
        "description": "At its economic peak in the late 17th century, Mughal India's share of global GDP was larger than all of Western Europe combined. The empire's textile industry was the world's largest manufacturing sector, exporting cotton and silk across the globe.",
    },
]


@router.get("")
async def list_empires(db: AsyncSession = Depends(get_db)):
    """Return all 20 empires with Chronicle event counts."""
    # Count matching events for each empire
    empire_event_counts: dict[str, int] = {}
    for empire in EMPIRES:
        search_terms = [empire["name"]] + empire.get("alt_names", [])
        conditions = []
        for term in search_terms:
            conditions.append(Event.title.ilike(f"%{term}%"))
            conditions.append(Event.tags.any(term.lower()))
        try:
            result = await db.execute(
                select(func.count())
                .select_from(Event)
                .where(
                    Event.review_status == "approved",
                    or_(*conditions),
                )
            )
            empire_event_counts[empire["id"]] = result.scalar() or 0
        except Exception:
            empire_event_counts[empire["id"]] = 0

    return {
        "empires": [
            {**e, "chronicle_event_count": empire_event_counts.get(e["id"], 0)}
            for e in EMPIRES
        ],
        "surprising_facts": SURPRISING_FACTS,
        "total": len(EMPIRES),
    }


@router.get("/{empire_id}")
async def get_empire(empire_id: str, db: AsyncSession = Depends(get_db)):
    """Return details for a single empire including related Chronicle events."""
    empire = next((e for e in EMPIRES if e["id"] == empire_id), None)
    if not empire:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Empire not found")

    # Find related events
    search_terms = [empire["name"]] + empire.get("alt_names", [])
    conditions = []
    for term in search_terms:
        conditions.append(Event.title.ilike(f"%{term}%"))
        conditions.append(Event.tags.any(term.lower()))

    related_events = []
    try:
        result = await db.execute(
            select(
                Event.id, Event.slug, Event.title,
                Event.year_approx, Event.event_category,
                Event.importance_score, Event.geo_modern,
            )
            .where(
                Event.review_status == "approved",
                or_(*conditions),
            )
            .order_by(Event.importance_score.desc())
            .limit(20)
        )
        for row in result.all():
            related_events.append({
                "id": str(row.id),
                "slug": row.slug,
                "title": row.title,
                "year_approx": row.year_approx,
                "category": row.event_category,
                "importance_score": float(row.importance_score) if row.importance_score else 0,
                "geo_modern": row.geo_modern,
            })
    except Exception:
        pass

    return {
        **empire,
        "chronicle_event_count": len(related_events),
        "related_events": related_events,
    }
