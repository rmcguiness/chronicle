#!/usr/bin/env python3
"""
enrich_regional_links.py

Strengthens the causality link network for events added in the underrepresented
regions enrichment (commit 8f90af8). Adds 60-100 new high-quality cross-civilizational
connections between:
- Americas (Maya, Aztec, Inca, Olmec)
- Africa (Mali, Ghana, Axum, Kilwa, Swahili)
- Islamic World (Umayyad, Abbasid, House of Wisdom)
- Southeast Asia (Khmer, Srivijaya, Majapahit)
- South Asia (Maurya, Gupta, Chola)

No duplicate links — checks existing before inserting.
"""

import asyncio
import asyncpg
import uuid
from typing import Optional, List, Tuple

DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'

# Format: (cause_keyword, effect_keyword, link_type, strength, description)
# link_type: 'direct', 'indirect', 'contributing', 'disputed'
# cause_keyword and effect_keyword are case-insensitive partial title matches

LINKS: List[Tuple[str, str, str, float, str]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # INDIA ↔ ISLAMIC WORLD CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    # Alexander's campaigns opened India to Hellenistic influence
    ("alexander reaches india hydaspes", "gupta empire golden age", "contributing", 0.4,
     "Hellenistic influence from Alexander's campaigns contributed to Indo-Greek artistic traditions that flourished under the Guptas"),
    
    ("chandragupta maurya founds empire", "ashoka kalinga", "direct", 0.9,
     "Maurya dynasty founded by Chandragupta led directly to Ashoka's reign and the Kalinga War"),
    
    ("ashoka rock edicts", "rise of mahayana buddhism", "contributing", 0.6,
     "Ashoka's Buddhist missionary efforts and edicts helped Buddhism spread and evolve into Mahayana traditions"),
    
    # Islamic scholars preserved and transmitted Indian knowledge
    ("gupta empire golden age", "house of wisdom baghdad", "contributing", 0.5,
     "Indian mathematical and astronomical texts (including numerals) were translated at the House of Wisdom"),
    
    ("panini ashtadhyayi grammar", "al-khwarizmi algebra", "contributing", 0.3,
     "Indian mathematical traditions, including the decimal system, influenced Islamic mathematics"),
    
    # Delhi Sultanate connections
    ("mongol sack of baghdad", "delhi sultanate", "contributing", 0.5,
     "Mongol destruction of Baghdad drove scholars and craftsmen to seek refuge in India"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # INDIA ↔ SOUTHEAST ASIA CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("ashoka rock edicts", "srivijaya", "indirect", 0.5,
     "Ashoka's Buddhist missions helped spread Buddhism to Southeast Asia, later center of Srivijaya"),
    
    ("gupta empire golden age", "borobudur temple", "contributing", 0.6,
     "Gupta-era Indian Buddhist art and architecture influenced Borobudur's design"),
    
    ("rise of mahayana buddhism", "srivijaya center of buddhist learning", "indirect", 0.7,
     "Mahayana Buddhism spread from India to become the dominant tradition at Srivijaya"),
    
    ("rise of mahayana buddhism", "borobudur temple", "contributing", 0.7,
     "Mahayana Buddhist cosmology directly shaped Borobudur's architectural program"),
    
    ("chola dynasty naval expansion", "srivijaya", "direct", 0.8,
     "Chola naval raids on Srivijaya disrupted Southeast Asian maritime trade"),
    
    ("chandragupta gupta empire", "jayavarman ii khmer", "contributing", 0.4,
     "Indian political concepts of divine kingship influenced Khmer imperial ideology"),
    
    ("gupta empire golden age", "angkor wat", "contributing", 0.5,
     "Hindu religious art and temple architecture from Gupta India influenced Angkor"),
    
    ("kalidasa shakuntala sanskrit", "srivijaya center of buddhist learning", "contributing", 0.3,
     "Sanskrit literary and religious texts circulated throughout the Srivijaya Buddhist network"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC WORLD ↔ AFRICA CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("umayyad caliphate established", "ghana empire", "contributing", 0.5,
     "Trans-Saharan trade routes expanded under Arab merchants, enriching Ghana"),
    
    ("abbasid revolution baghdad", "ghana empire west african gold", "indirect", 0.6,
     "Abbasid demand for gold drove trans-Saharan trade that enriched Ghana Empire"),
    
    ("house of wisdom baghdad", "mansa musa pilgrimage", "contributing", 0.4,
     "Islamic scholarly tradition inspired Mali rulers like Mansa Musa to patronize learning"),
    
    ("conquest of mecca by muhammad", "axum adopts christianity", "contributing", 0.3,
     "Rise of Islam increased importance of Christian Ethiopia as a regional counterweight"),
    
    ("umayyad conquest of visigothic spain", "ghana empire", "contributing", 0.4,
     "Umayyad expansion created demand for African gold to fund their western campaigns"),
    
    ("ibn battuta journeys greatest medieval", "kilwa sultanate", "contributing", 0.6,
     "Ibn Battuta's travels documented and connected the Islamic world to Swahili coast trade"),
    
    ("mansa musa pilgrimage", "house of wisdom baghdad", "indirect", 0.3,
     "Mansa Musa's visit to Cairo and tales of Mali's wealth connected West Africa to Islamic intellectual centers"),
    
    ("abbasid caliphate founded golden age", "kilwa sultanate founded", "contributing", 0.5,
     "Abbasid-era Islamic trade networks extended to the Swahili coast, enabling Kilwa's rise"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC WORLD ↔ SOUTHEAST ASIA CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("abbasid revolution baghdad", "srivijaya maritime empire", "contributing", 0.4,
     "Abbasid trade networks connected the Indian Ocean, boosting Srivijaya's maritime commerce"),
    
    ("harun al-rashid reign golden age", "srivijaya center of buddhist learning", "indirect", 0.3,
     "Muslim merchants under Abbasid prosperity traded extensively with Buddhist Srivijaya"),
    
    ("mongol sack of baghdad", "majapahit empire", "contributing", 0.3,
     "Disruption of Middle Eastern trade routes increased importance of Southeast Asian spice trade"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # MESOAMERICAN INTERNAL CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    # Olmec → Maya transmission
    ("san lorenzo olmec peak", "la venta becomes olmec capital", "direct", 0.9,
     "Power shifted from San Lorenzo to La Venta as the Olmec civilization continued"),
    
    ("la venta becomes olmec capital", "tres zapotes olmec center", "indirect", 0.7,
     "Olmec culture transitioned from La Venta to the late center at Tres Zapotes"),
    
    ("olmec long count calendar origins", "maya writing system emerges", "contributing", 0.7,
     "Olmec calendrical and proto-writing systems were precursors to Maya script"),
    
    ("olmec long count calendar origins", "zapotec writing monte alban", "contributing", 0.6,
     "Olmec calendrical innovations influenced Zapotec writing development"),
    
    ("tres zapotes olmec center", "nakbe earliest maya city", "contributing", 0.5,
     "Late Olmec culture at Tres Zapotes overlapped with and influenced early Maya development"),
    
    # Maya internal
    ("nakbe earliest maya city", "el mirador maya megacity", "direct", 0.8,
     "Early Maya urbanism at Nakbe evolved into the massive Preclassic center of El Mirador"),
    
    ("el mirador maya megacity", "tikal dynasty founded", "indirect", 0.6,
     "El Mirador's collapse allowed Tikal to rise as the dominant Maya center"),
    
    ("maya writing system emerges", "maya classical period begins", "contributing", 0.7,
     "Hieroglyphic writing enabled the complex political and religious institutions of Classic Maya"),
    
    ("tikal dynasty founded", "copán dynasty founded", "contributing", 0.5,
     "Tikal's political model influenced other Maya dynasties including Copán"),
    
    ("teotihuacan conquers tikal", "calakmul maya superpower", "contributing", 0.6,
     "Teotihuacan's intervention weakened Tikal, allowing Calakmul to rise as a rival power"),
    
    ("palenque founded", "pakal great reign", "direct", 0.9,
     "K'uk' Bahlam I's dynasty at Palenque led to Pakal the Great's transformative reign"),
    
    ("calakmul maya superpower", "tikal defeats calakmul", "direct", 0.9,
     "The Tikal-Calakmul rivalry culminated in Tikal's decisive victory"),
    
    ("tikal defeats calakmul", "maya classic period zenith", "contributing", 0.6,
     "Tikal's victory over Calakmul ushered in the final florescence of Classic Maya civilization"),
    
    ("maya classic period zenith", "classic maya collapse", "indirect", 0.7,
     "The height of Maya civilization preceded the mysterious Classic collapse"),
    
    # Teotihuacan connections
    ("pyramid of the sun teotihuacan", "teotihuacan reaches 200000", "contributing", 0.7,
     "Monumental architecture attracted population and prestige to Teotihuacan"),
    
    ("teotihuacan reaches 200000", "teotihuacan conquers tikal", "contributing", 0.6,
     "Teotihuacan's population and power enabled military projection into Maya region"),
    
    ("teotihuacan decline collapse", "classic maya collapse", "contributing", 0.4,
     "Teotihuacan's collapse disrupted Mesoamerican trade networks, contributing to Maya instability"),
    
    ("teotihuacan decline collapse", "toltec empire", "contributing", 0.5,
     "Power vacuum after Teotihuacan enabled the rise of new powers like the Toltecs"),
    
    # Maya to later cultures
    ("classic maya collapse", "aztec founding tenochtitlan", "contributing", 0.3,
     "Mesoamerican cultural continuity: Maya achievements influenced later Aztec civilization"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # SOUTH AMERICAN CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("domestication potato andes", "norte chico caral", "contributing", 0.5,
     "Andean agricultural development enabled early complex societies like Norte Chico"),
    
    ("norte chico caral", "chavin culture peru", "indirect", 0.5,
     "Norte Chico's pioneering urbanization preceded and possibly influenced Chavín development"),
    
    ("chavin culture peru", "nazca lines geoglyphs", "contributing", 0.4,
     "Chavín religious and artistic traditions influenced later Nazca culture"),
    
    ("chavin culture peru", "moche civilization peak", "contributing", 0.5,
     "Chavín laid groundwork for later complex Andean societies including Moche"),
    
    ("nazca lines geoglyphs", "inca empire expansion pachacuti", "contributing", 0.3,
     "Pre-Inca Andean ceremonial traditions continued in modified form under the Inca"),
    
    ("moche civilization peak", "inca empire expansion pachacuti", "contributing", 0.4,
     "Earlier Andean state-building traditions informed Inca imperial organization"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # AFRICAN INTERNAL CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    # Kush/Nubia/Axum
    ("kingdom of kush nubian power", "kingdom of kush conquers egypt nubian pharaohs", "direct", 0.9,
     "Kushite power grew until the kingdom conquered Egypt as the 25th Dynasty"),
    
    ("kingdom of kush conquers egypt nubian pharaohs", "meroe becomes capital kush", "indirect", 0.7,
     "Assyrian pressure pushed Kush south, making Meroe the new capital"),
    
    ("meroe becomes capital kush", "kingdom of axum founded", "contributing", 0.5,
     "Meroitic trade networks helped establish Axum as a rival power"),
    
    ("kingdom of axum founded", "axum adopts christianity", "direct", 0.8,
     "Axum's growth and Mediterranean connections led to its Christian conversion"),
    
    ("axum adopts christianity", "axum conquers kush meroe", "contributing", 0.6,
     "Christian Axum's expansion led to the conquest and end of Meroitic Kush"),
    
    ("axum conquers kush meroe", "axum controls yemen", "indirect", 0.6,
     "Axum's destruction of Kush freed resources for Red Sea expansion into Yemen"),
    
    ("axum controls yemen", "kingdom of aksum declines", "contributing", 0.4,
     "Overextension into Yemen strained Aksumite resources before its decline"),
    
    # West Africa
    ("nok culture west africa earliest", "ghana empire emerges", "contributing", 0.4,
     "Nok ironworking traditions spread through West Africa, enabling later state formation"),
    
    ("ghana empire emerges", "ghana empire west african gold", "direct", 0.9,
     "Ghana Empire's growth culminated in its control of Saharan gold trade"),
    
    ("ghana empire west african gold", "ghana empire at its height", "direct", 0.9,
     "Ghana's gold trade dominance led to its peak power and wealth"),
    
    ("ghana empire at its height", "mansa musa pilgrimage", "indirect", 0.6,
     "Ghana's legacy of Saharan gold trade passed to Mali under Mansa Musa"),
    
    ("mansa musa pilgrimage", "timbuktu center of learning", "direct", 0.8,
     "Mansa Musa's patronage transformed Timbuktu into a major Islamic scholarly center"),
    
    # East African coast
    ("kilwa sultanate founded", "kilwa controls gold trade", "direct", 0.9,
     "Kilwa's strategic position enabled its dominance of East African gold trade"),
    
    ("kilwa controls gold trade", "great mosque of kilwa built", "contributing", 0.7,
     "Kilwa's wealth from gold trade funded monumental mosque construction"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # KHMER EMPIRE CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("jayavarman ii founds khmer empire", "khmer capital moves angkor", "direct", 0.9,
     "Jayavarman II's unification of Cambodia led to establishment of Angkor as capital"),
    
    ("khmer capital moves angkor", "suryavarman i expands khmer", "direct", 0.8,
     "Angkor's establishment enabled Suryavarman I's imperial expansion"),
    
    ("suryavarman i expands khmer", "angkor wat construction begins", "contributing", 0.8,
     "Suryavarman I's expansion provided resources for Angkor Wat construction"),
    
    ("angkor wat construction begins", "angkor wat built height khmer", "direct", 0.9,
     "Angkor Wat's construction represented the height of Khmer imperial power"),
    
    ("borobudur temple completed java", "srivijaya raids on java", "contributing", 0.4,
     "Java's Buddhist monuments drew Srivijaya's attention and rivalry"),
    
    ("srivijaya raids on java", "chola raid on srivijaya", "contributing", 0.4,
     "Srivijaya's regional aggression and dominance attracted Chola naval intervention"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # COLONIAL/EARLY MODERN CROSS-CONNECTIONS
    # ═══════════════════════════════════════════════════════════════════════
    
    ("portuguese capture malacca southeast asian trade", "dutch capture batavia voc", "indirect", 0.7,
     "Portuguese dominance of Southeast Asian trade preceded Dutch VOC takeover"),
    
    ("spanish conquest aztec empire", "spanish conquest inca empire", "direct", 0.7,
     "Spanish success against the Aztecs emboldened and financed the Peru expedition"),
    
    ("hernán cortés lands in mexico", "spanish conquest aztec empire", "direct", 0.9,
     "Cortés's landing initiated the Spanish conquest of the Aztec Empire"),
    
    ("pizarro conquers inca", "spanish conquest inca empire", "direct", 0.9,
     "Pizarro's campaign led directly to the fall of the Inca Empire"),
    
    ("portuguese capture malacca southeast asian trade", "chola dynasty naval expansion", "indirect", 0.3,
     "Earlier Chola naval dominance set precedent for Indian Ocean power projection"),
    
    # ═══════════════════════════════════════════════════════════════════════
    # CROSS-CIVILIZATIONAL PARALLELS
    # ═══════════════════════════════════════════════════════════════════════
    
    # Silk Road connections
    ("silk road trade network maturity", "srivijaya maritime empire", "contributing", 0.5,
     "Silk Road trade stimulated maritime alternatives through Srivijaya's waters"),
    
    ("silk road trade network maturity", "kilwa sultanate founded", "contributing", 0.4,
     "Indian Ocean trade networks connected to Silk Road routes enriched East African ports"),
    
    # Mongol disruptions
    ("mongol sack of baghdad", "house of wisdom baghdad", "direct", 0.9,
     "Mongol destruction of Baghdad ended the House of Wisdom's golden age"),
    
    # Buddhism spread
    ("buddhism spreads along silk road china", "borobudur temple", "contributing", 0.4,
     "Buddhist transmission networks eventually reached Java via maritime routes"),
    
    # Agricultural foundations
    ("domestication of maize mesoamerica", "olmec colossal heads san lorenzo", "contributing", 0.5,
     "Maize agriculture enabled population density that supported Olmec civilization"),
    
    ("domestication of squash mesoamerica", "domestication of maize mesoamerica", "contributing", 0.6,
     "Early squash cultivation preceded and accompanied maize domestication in Mesoamerica"),
    
    ("sorghum domestication saharan africa", "nok culture west africa earliest", "contributing", 0.4,
     "African agricultural development enabled population growth underlying Nok culture"),
    
    ("mehrgarh earliest indus settlement", "gupta empire golden age", "indirect", 0.3,
     "Deep roots of South Asian civilization from Mehrgarh through to the Gupta golden age"),
    
    # Additional cross-regional links
    ("ibn battuta journeys greatest medieval", "mansa musa pilgrimage", "contributing", 0.5,
     "Ibn Battuta documented the legacy of Mansa Musa's famous pilgrimage in his travels"),
    
    ("ibn battuta journeys greatest medieval", "delhi sultanate", "contributing", 0.4,
     "Ibn Battuta served as a judge in the Delhi Sultanate for several years"),
    
    ("ibn battuta journeys greatest medieval", "kilwa controls gold trade", "contributing", 0.5,
     "Ibn Battuta documented Kilwa's wealth as the greatest city on the East African coast"),
    
    # Persian/Iranian connections
    ("zoroaster founds zoroastrianism", "sassanid empire founded", "contributing", 0.4,
     "Zoroastrian religion survived through the Sassanid Empire as state religion"),
    
    ("sassanid empire founded", "umayyad caliphate established", "indirect", 0.6,
     "Arab conquest of the Sassanid Empire led to Umayyad control of Persian lands"),
    
    ("shah abbas safavid persia height", "mughal empire", "contributing", 0.4,
     "Safavid-Mughal rivalry and cultural exchange shaped both empires"),
    
    # Ming voyages connections
    ("zheng he treasure voyages ming", "portuguese capture malacca southeast asian trade", "contributing", 0.3,
     "Chinese withdrawal from Indian Ocean created vacuum Portuguese later filled"),
    
    ("zheng he treasure voyages ming", "kilwa controls gold trade", "contributing", 0.4,
     "Zheng He's fleet visited Kilwa, briefly connecting Chinese and East African trade"),
    
    ("zheng he treasure voyages end", "portuguese capture malacca southeast asian trade", "contributing", 0.5,
     "End of Chinese voyages left power vacuum in Indian Ocean that Portuguese exploited"),
    
    ("zheng he treasure voyages ming", "srivijaya maritime empire", "contributing", 0.4,
     "Zheng He's voyages passed through former Srivijaya waters"),
    
    # Mongol connections
    ("mongol conquest of china", "mongol sack of baghdad", "contributing", 0.7,
     "Mongol campaigns against China preceded and enabled the western expansion against Baghdad"),
    
    ("mongol sack of baghdad", "ibn battuta journeys greatest medieval", "contributing", 0.3,
     "Pax Mongolica made Ibn Battuta's travels across Eurasia possible"),
    
    # Ethiopian connections
    ("axum adopts christianity", "ethiopian emperor fasilides builds gondar", "indirect", 0.5,
     "Ethiopian Christian tradition from Axum continued through medieval period to Gondar"),
    
    ("kingdom of aksum declines", "ethiopian emperor fasilides builds gondar", "indirect", 0.4,
     "Ethiopian civilization continued despite Aksum's decline, culminating in Gondar"),
    
    # Trade route connections
    ("opening of the silk road", "kushan empire crossroads", "contributing", 0.6,
     "Silk Road trade enriched the Kushan Empire at the crossroads of civilizations"),
    
    ("kushan empire crossroads", "gandhara buddhist art", "direct", 0.8,
     "Kushan patronage enabled the flourishing of Greco-Buddhist Gandhara art"),
    
    ("gandhara buddhist art", "borobudur temple", "contributing", 0.5,
     "Gandhara Buddhist artistic traditions influenced later Southeast Asian Buddhist art"),
    
    # West Africa further connections
    ("ashanti empire founded gold coast", "atlantic slave trade", "contributing", 0.6,
     "Ashanti Empire participated in and was shaped by the Atlantic slave trade"),
    
    ("rozvi empire great zimbabwe successor", "great zimbabwe", "indirect", 0.7,
     "Rozvi Empire continued the legacy of Great Zimbabwe state traditions"),
    
    # Additional Indian connections
    ("ajanta cave paintings", "borobudur temple", "contributing", 0.4,
     "Indian Buddhist cave painting traditions influenced Southeast Asian Buddhist art"),
    
    ("third buddhist council ashoka", "srivijaya center of buddhist learning", "indirect", 0.5,
     "Ashoka's missionary councils sent Buddhism eastward, eventually reaching Srivijaya"),
    
    # Ottoman and post-Mongol connections
    ("ottoman empire suleiman", "portuguese capture malacca southeast asian trade", "contributing", 0.3,
     "Ottoman-Portuguese rivalry extended to Indian Ocean maritime competition"),
    
    # Further Maya links
    ("el mirador maya megacity", "maya writing system emerges", "contributing", 0.6,
     "El Mirador's administrative complexity drove Maya writing development"),
    
    ("tomb of pakal palenque", "maya classic period zenith", "contributing", 0.6,
     "Pakal's elaborate tomb represents the artistic zenith of Classic Maya civilization"),
    
    # Further Andean links
    ("domestication potato andes", "chavin culture peru", "contributing", 0.4,
     "Andean agriculture supported the population that developed Chavín culture"),
    
    # Islam spread further
    ("umayyad conquest of visigothic spain", "battle of tours poitiers charles martel", "direct", 0.8,
     "Umayyad expansion into Iberia led to the confrontation at Tours"),
    
    ("death of prophet muhammad", "umayyad caliphate established", "direct", 0.8,
     "Muhammad's death and the early caliphate led to Umayyad dynasty establishment"),
    
    # Horn of Africa
    ("battle of adwa ethiopia", "ethiopian famine live aid", "indirect", 0.3,
     "Ethiopian independence from Adwa preserved the state that later faced the 1984 famine"),
    
    # Additional Africa connections
    ("nok culture west africa earliest", "sorghum domestication saharan africa", "indirect", 0.3,
     "African agricultural foundations supported Nok population growth"),
    
    ("ghana empire at its height", "ibn battuta journeys greatest medieval", "contributing", 0.3,
     "Ghana's trade legacy was documented in later Islamic travel accounts"),
    
    # Additional Americas connections  
    ("olmec colossal heads san lorenzo", "la venta becomes olmec capital", "indirect", 0.7,
     "San Lorenzo's artistic traditions transferred to La Venta as the new capital"),
    
    ("monte alban founded zapotecs", "teotihuacan reaches 200000", "contributing", 0.4,
     "Monte Albán and Teotihuacan developed as contemporary Mesoamerican urban centers"),
    
    ("moche civilization peak", "nazca lines geoglyphs", "contributing", 0.3,
     "Contemporary Andean cultures shared artistic and religious concepts"),
    
    # Additional Southeast Asia connections
    ("borobudur temple completed java", "angkor wat", "contributing", 0.5,
     "Buddhist Borobudur preceded and influenced later Hindu-Buddhist Angkor monuments"),
    
    ("srivijaya maritime empire", "khmer capital moves angkor", "contributing", 0.3,
     "Srivijaya's maritime dominance shaped regional trade that enriched Angkor"),
    
    # Additional India-Central Asia connections
    ("kushan empire crossroads", "rise of mahayana buddhism", "contributing", 0.6,
     "Kushan royal patronage supported the development of Mahayana Buddhism"),
    
    ("silk road trade network maturity", "gandhara buddhist art", "contributing", 0.5,
     "Silk Road trade brought Greek artistic influences that shaped Gandhara art"),
    
    # Modern connections
    ("atlantic slave trade", "ashanti empire founded gold coast", "indirect", 0.5,
     "European slave trade intensified Ashanti state formation and militarization"),
    
    # Additional Islamic-Africa
    ("harun al-rashid reign golden age", "ghana empire west african gold", "contributing", 0.4,
     "Abbasid prosperity under Harun al-Rashid drove demand for African gold"),
]


async def find_event_by_keyword(conn: asyncpg.Connection, keyword: str) -> Optional[str]:
    """Find event ID by case-insensitive keyword match in title."""
    # Clean up keyword for matching
    keyword_lower = keyword.lower().replace('-', ' ').replace('_', ' ')
    
    # Try exact partial match first
    row = await conn.fetchrow("""
        SELECT id FROM events 
        WHERE LOWER(title) LIKE $1
        ORDER BY importance_score DESC, year_approx ASC
        LIMIT 1
    """, f"%{keyword_lower}%")
    
    if row:
        return str(row['id'])
    
    # If no match, try matching individual significant words
    words = [w for w in keyword_lower.split() if len(w) > 3]
    if len(words) >= 2:
        # Try matching first two significant words
        pattern = f"%{words[0]}%{words[1]}%"
        row = await conn.fetchrow("""
            SELECT id FROM events 
            WHERE LOWER(title) LIKE $1
            ORDER BY importance_score DESC, year_approx ASC
            LIMIT 1
        """, pattern)
        if row:
            return str(row['id'])
    
    return None


async def link_exists(conn: asyncpg.Connection, cause_id: str, effect_id: str) -> bool:
    """Check if a causality link already exists between two events."""
    row = await conn.fetchrow("""
        SELECT 1 FROM causality_links 
        WHERE cause_event_id = $1 AND effect_event_id = $2
    """, cause_id, effect_id)
    return row is not None


async def insert_link(
    conn: asyncpg.Connection,
    cause_id: str, 
    effect_id: str, 
    link_type: str, 
    strength: float, 
    description: str
) -> bool:
    """Insert a causality link, returning True if successful."""
    try:
        await conn.execute("""
            INSERT INTO causality_links (
                id, cause_event_id, effect_event_id, link_type, strength, 
                description, created_by, review_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        """, str(uuid.uuid4()), cause_id, effect_id, link_type, strength,
            description, 'enrich_regional_links.py', 'approved')
        return True
    except Exception as e:
        print(f"  ⚠️  Insert error: {e}")
        return False


async def main():
    print("=" * 70)
    print("ENRICHING CAUSALITY LINKS FOR UNDERREPRESENTED REGIONS")
    print("=" * 70)
    
    conn = await asyncpg.connect(DB_URL)
    
    # Get initial count
    initial_count = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nInitial causality links: {initial_count}")
    
    inserted = 0
    skipped_exists = 0
    skipped_not_found = 0
    
    print(f"\nProcessing {len(LINKS)} potential links...\n")
    
    for cause_kw, effect_kw, link_type, strength, description in LINKS:
        cause_id = await find_event_by_keyword(conn, cause_kw)
        effect_id = await find_event_by_keyword(conn, effect_kw)
        
        if not cause_id:
            print(f"⚠️  Cause not found: '{cause_kw}'")
            skipped_not_found += 1
            continue
        if not effect_id:
            print(f"⚠️  Effect not found: '{effect_kw}'")
            skipped_not_found += 1
            continue
        
        if cause_id == effect_id:
            print(f"⚠️  Self-link skipped: '{cause_kw}'")
            skipped_not_found += 1
            continue
        
        if await link_exists(conn, cause_id, effect_id):
            skipped_exists += 1
            continue
        
        if await insert_link(conn, cause_id, effect_id, link_type, strength, description):
            inserted += 1
            print(f"✓ {cause_kw[:40]:40} → {effect_kw[:35]:35}")
    
    # Get final count
    final_count = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    
    await conn.close()
    
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Links inserted:      {inserted}")
    print(f"Skipped (exists):    {skipped_exists}")
    print(f"Skipped (not found): {skipped_not_found}")
    print(f"\nTotal links: {initial_count} → {final_count} (+{final_count - initial_count})")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
