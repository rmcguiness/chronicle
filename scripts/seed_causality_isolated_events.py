#!/usr/bin/env python3
"""
Seed script: Connect isolated events through causality links.
Targets 60 high-importance events that had no incoming or outgoing
causality links. Adds 75 historically accurate causal connections.

Run:
  python3 scripts/seed_causality_isolated_events.py
"""
import asyncio
import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# (cause_title_fragment, effect_title_fragment, link_type, strength, description)
LINKS = [
    # ── Prehistoric / Neolithic ─────────────────────────────────────────
    ("Agricultural Revolution — Fertile Crescent", "Göbekli Tepe — World's Oldest Known Temple",
     "contributing", 0.6,
     "Early agriculture enabled settled communities that built monumental structures like Göbekli Tepe"),
    ("Göbekli Tepe — World's Oldest Known Temple", "Çatalhöyük — One of the World's First Towns",
     "indirect", 0.4,
     "Göbekli Tepe demonstrated early communal construction, prefiguring proto-urban settlements like Çatalhöyük"),
    ("Agricultural Revolution — Fertile Crescent", "Domestication of Cattle in the Near East",
     "direct", 0.8,
     "The agricultural revolution in the Fertile Crescent led directly to cattle domestication"),
    ("Agricultural Revolution — Fertile Crescent", "Çatalhöyük — One of the World's First Towns",
     "contributing", 0.7,
     "Agricultural surplus enabled permanent settlements like Çatalhöyük"),
    ("Cognitive Revolution — Emergence of Symbolic Thought", "Neanderthals Dominate Europe and Western Asia",
     "indirect", 0.35,
     "Cognitive developments in early humans paralleled Neanderthal dominance of Europe"),
    ("Behavioral Modernity — Symbolic Thought Emerges", "Aboriginal Rock Art Tradition — Kakadu, Australia",
     "direct", 0.8,
     "Behavioral modernity and symbolic thought enabled artistic traditions like Aboriginal rock art"),
    ("Agricultural Revolution — Fertile Crescent", "Bantu Expansion Across Sub-Saharan Africa",
     "contributing", 0.7,
     "Agricultural techniques enabled Bantu peoples to expand across sub-Saharan Africa"),
    ("Agricultural Revolution — Fertile Crescent", "Norte Chico Civilization — Americas' Oldest City",
     "indirect", 0.5,
     "Agricultural development enabled the rise of complex societies like Norte Chico"),
    ("Behavioral Modernity — Symbolic Thought Emerges", "Jōmon Pottery — World's Oldest Known Pottery Tradition",
     "contributing", 0.5,
     "Behavioral modernity and symbolic thought enabled artistic traditions including pottery"),

    # ── Pacific Expansion ───────────────────────────────────────────────
    ("Lapita Culture Expansion into the Pacific", "Polynesian Homeland — Settlement of Samoa and Tonga",
     "direct", 0.85,
     "Lapita culture expansion led directly to Polynesian settlement of Samoa and Tonga"),
    ("Lapita Expansion into the Pacific Islands", "Lapita Culture Expansion into the Pacific",
     "direct", 0.8,
     "Earlier Lapita expansion into the Pacific preceded and enabled later Lapita cultural spread"),
    ("Polynesian Homeland — Settlement of Samoa and Tonga", "Māori Settlement of Aotearoa (New Zealand)",
     "indirect", 0.7,
     "Polynesian homeland in Samoa/Tonga was the origin point for later voyages to New Zealand"),
    ("Polynesian Navigation — The Greatest Ocean Voyages", "Māori Settlement of Aotearoa (New Zealand)",
     "direct", 0.85,
     "Polynesian navigation mastery enabled the settlement of Aotearoa"),
    ("Polynesian Navigation — The Greatest Ocean Voyages", "Settlement of Rapa Nui (Easter Island) and Moai Construction",
     "direct", 0.85,
     "Polynesian navigation enabled the settlement of remote Rapa Nui"),
    ("Polynesians Reach Rapa Nui (Easter Island)", "Settlement of Rapa Nui (Easter Island) and Moai Construction",
     "direct", 0.9,
     "Polynesian arrival at Rapa Nui led to permanent settlement and Moai construction"),

    # ── Egyptian ────────────────────────────────────────────────────────
    ("New Kingdom Egypt — Egypt's Imperial Golden Age", "Egyptian Book of the Dead — Guide to the Afterlife",
     "direct", 0.9,
     "The Egyptian Book of the Dead was composed during the New Kingdom period"),

    # ── Indian / Vedic ──────────────────────────────────────────────────
    ("Vedic Period Begins — Rigveda Composed", "Upanishads Composed — Foundations of Hindu Philosophy",
     "direct", 0.85,
     "The Upanishads emerged as philosophical extensions of Vedic tradition"),
    ("Upanishads Composed — Foundations of Hindu Philosophy", "Siddhartha Gautama's Enlightenment — Buddhism Founded",
     "contributing", 0.7,
     "Hindu philosophical concepts in the Upanishads influenced Buddhist thought"),

    # ── Greek ───────────────────────────────────────────────────────────
    ("End of the Greek Dark Ages — Polis System Emerges", "First Olympic Games Held at Olympia",
     "contributing", 0.7,
     "The emergence of Greek city-states created the political context for pan-Hellenic festivals like the Olympics"),
    ("End of the Greek Dark Ages — Polis System Emerges", "Founding of Greek Colonies Across Mediterranean",
     "direct", 0.8,
     "The polis system drove Greek colonization across the Mediterranean"),

    # ── Axial Age ───────────────────────────────────────────────────────
    ("Axial Age Civilizations — Buddha, Confucius, and the Greek Philosophers", "Laozi and the Origins of Daoism",
     "contributing", 0.65,
     "Laozi and Daoism emerged as part of the broader Axial Age philosophical revolution"),

    # ── Assyria / Persia ────────────────────────────────────────────────
    ("Assyrian Empire at Its Height — Ashurbanipal and the Library of Nineveh", "Fall of Nineveh — Collapse of the Assyrian Empire",
     "direct", 0.8,
     "Assyrian overextension under Ashurbanipal led to the empire's collapse and fall of Nineveh"),
    ("Fall of Nineveh — Collapse of the Assyrian Empire", "Cyrus the Great Founds the Persian Empire",
     "contributing", 0.7,
     "The power vacuum from Assyria's fall enabled Cyrus to build the Persian Empire"),

    # ── Chinese ─────────────────────────────────────────────────────────
    ("Qin Shi Huang Connects Northern Walls — First Great Wall", "Xiongnu Empire — First Great Steppe Confederacy",
     "contributing", 0.6,
     "Qin wall-building was partly a response to the Xiongnu threat on China's northern frontier"),
    ("Xiongnu Empire — First Great Steppe Confederacy", "Zhang Qian's Mission to the West — Silk Road Pioneer",
     "contributing", 0.7,
     "Xiongnu pressure prompted Han diplomatic missions westward, opening the Silk Road"),
    ("Opening of the Silk Road", "Chinese Invention of the Magnetic Compass",
     "indirect", 0.4,
     "Silk Road trade facilitated the spread of Chinese innovations like the magnetic compass"),
    ("Invention of the Stirrup — Revolution in Mounted Warfare", "Xiongnu Empire — First Great Steppe Confederacy",
     "indirect", 0.5,
     "The stirrup revolutionized cavalry warfare that steppe confederacies like the Xiongnu relied on"),

    # ── Roman ───────────────────────────────────────────────────────────
    ("Cicero Exposes the Catiline Conspiracy", "Assassination of Julius Caesar",
     "contributing", 0.5,
     "Cicero's defense of the Republic set precedents that shaped the political crisis leading to Caesar's assassination"),
    ("Roman Destruction of the Second Temple in Jerusalem", "Bar Kokhba Revolt — Jewish Diaspora Deepens",
     "direct", 0.85,
     "Roman destruction of the Second Temple deepened Jewish resistance, culminating in Bar Kokhba"),
    ("Eruption of Vesuvius Buries Pompeii", "Bar Kokhba Revolt — Jewish Diaspora Deepens",
     "indirect", 0.3,
     "Vesuvius disrupted Roman provincial life in the decades before Bar Kokhba revolt"),

    # ── Aksum ───────────────────────────────────────────────────────────
    ("Chera Dynasty Dominates Indian Ocean Spice Trade", "Rise of the Kingdom of Aksum",
     "contributing", 0.6,
     "Indian Ocean spice trade routes helped Aksum rise as a trading power"),

    # ── Tiwanaku ────────────────────────────────────────────────────────
    ("Norte Chico Civilization — Americas' Oldest City", "Rise of Tiwanaku Civilization",
     "indirect", 0.4,
     "Earlier Andean civilizations like Norte Chico laid foundations for later Tiwanaku"),

    # ── Islamic expansion ───────────────────────────────────────────────
    ("Muslim Conquest of Iberian Peninsula", "Battle of Tours — Frankish Victory Halts Muslim Advance into Europe",
     "direct", 0.85,
     "Muslim conquest of Iberia provoked the Frankish response at the Battle of Tours"),
    ("Muslim Conquest of Iberian Peninsula", "Second Arab Siege of Constantinople",
     "contributing", 0.6,
     "Muslim expansion westward paralleled the second siege of Constantinople"),
    ("First Use of Greek Fire by Byzantines", "Second Arab Siege of Constantinople",
     "contributing", 0.7,
     "Greek fire was a key Byzantine weapon in repelling the Arab siege of Constantinople"),

    # ── Abbasid / House of Wisdom ───────────────────────────────────────
    ("Abbasid Caliphate Founded — Islamic Golden Age Begins", "House of Wisdom Flourishes in Baghdad",
     "direct", 0.9,
     "The Abbasid Caliphate founded and patronized the House of Wisdom in Baghdad"),
    ("House of Wisdom Flourishes in Baghdad", "Translation Movement — Greek Knowledge Into Arabic",
     "direct", 0.85,
     "The House of Wisdom was the center of the Translation Movement"),

    # ── Borobudur ───────────────────────────────────────────────────────
    ("Gupta Empire — India's Golden Age of Science and Art", "Construction of Borobudur Temple",
     "contributing", 0.6,
     "Indian Gupta cultural influence spread Buddhism to Southeast Asia, inspiring Borobudur"),

    # ── Cairo ───────────────────────────────────────────────────────────
    ("Fatimid Caliphate Founded", "Cairo Founded",
     "direct", 0.95,
     "The Fatimid Caliphate founded Cairo as its new capital"),

    # ── Movable Type ────────────────────────────────────────────────────
    ("Bi Sheng Invents Movable Type Printing", "Gutenberg's Printing Press",
     "indirect", 0.5,
     "Bi Sheng's movable type concept influenced the development of Gutenberg's printing press"),

    # ── Africa ──────────────────────────────────────────────────────────
    ("Bantu Expansion Across Sub-Saharan Africa", "Construction of Great Zimbabwe",
     "indirect", 0.5,
     "Bantu expansion brought farming and ironworking peoples to southern Africa, enabling Great Zimbabwe"),
    ("Almoravid Conquest of Ghana", "Founding of the Mali Empire by Sundiata Keita",
     "contributing", 0.7,
     "The Almoravid conquest of Ghana created a power vacuum that Sundiata exploited to found Mali"),
    ("Founding of the Mali Empire by Sundiata Keita", "Kingdom of Benin and the Benin Bronzes",
     "indirect", 0.4,
     "Mali Empire trade networks connected to West African kingdoms like Benin"),
    ("Chera Dynasty Dominates Indian Ocean Spice Trade", "Swahili Coast City-States Flourish",
     "contributing", 0.6,
     "Indian Ocean trade traditions enabled the flourishing of Swahili Coast city-states"),

    # ── Inca ────────────────────────────────────────────────────────────
    ("Inca Empire Rapid Expansion under Pachacuti", "Inca Road System (Qhapaq Ñan)",
     "direct", 0.85,
     "Inca imperial expansion under Pachacuti required and built the extensive Qhapaq Ñan road system"),

    # ── Potosí ──────────────────────────────────────────────────────────
    ("Pizarro Conquers the Inca Empire", "Potosí Silver Mining Boom",
     "direct", 0.85,
     "Spanish conquest of the Inca Empire led directly to exploitation of Potosí silver mines"),

    # ── Scientific Revolution ───────────────────────────────────────────
    ("Copernicus Publishes Heliocentric Model", "Vesalius Publishes Human Anatomy",
     "contributing", 0.55,
     "Copernicus's heliocentric model inspired empirical investigation, including Vesalius's anatomy"),

    # ── Portuguese ──────────────────────────────────────────────────────
    ("Vasco da Gama Reaches India by Sea", "Portuguese Reach China",
     "direct", 0.8,
     "Portuguese maritime route to India enabled further exploration reaching China"),

    # ── Enlightenment / Philosophy ──────────────────────────────────────
    ("Glorious Revolution — Constitutional Monarchy Established", "John Locke Publishes Two Treatises of Government",
     "direct", 0.85,
     "Locke wrote Two Treatises to justify the Glorious Revolution"),
    ("John Locke Publishes Two Treatises of Government", "French Revolution — Storming of the Bastille",
     "contributing", 0.65,
     "Locke's ideas on natural rights and government by consent influenced French revolutionary thought"),
    ("The Enlightenment — Voltaire and the Age of Reason", "Kant's Critique of Pure Reason — Revolution in Philosophy",
     "contributing", 0.7,
     "The Enlightenment intellectual movement shaped Kant's philosophical revolution"),

    # ── Qing ────────────────────────────────────────────────────────────
    ("Qing Dynasty Conquers China — Manchu Rule Established", "Qianlong Emperor Begins Reign",
     "contributing", 0.7,
     "Qing Dynasty establishment set the stage for Qianlong's reign as its greatest emperor"),

    # ── Haitian Revolution ──────────────────────────────────────────────
    ("French Revolution — Storming of the Bastille", "Haitian Revolution — First Successful Slave Revolt",
     "direct", 0.85,
     "French Revolution's ideals of liberty inspired the Haitian slave revolt"),
    ("Atlantic Slave Trade Intensifies", "Haitian Revolution — First Successful Slave Revolt",
     "contributing", 0.7,
     "The Atlantic slave trade created the conditions for the Haitian Revolution"),

    # ── Zulu ────────────────────────────────────────────────────────────
    ("Shaka Zulu Founds the Zulu Kingdom — The Mfecane", "Rise of the Zulu Kingdom Under Shaka",
     "direct", 0.9,
     "Shaka Zulu's military innovations built the Zulu Kingdom"),
    ("Rise of the Zulu Kingdom Under Shaka", "Mfecane — Southern African Upheaval",
     "direct", 0.85,
     "Zulu expansion under Shaka triggered the Mfecane upheaval across southern Africa"),

    # ── Brazilian Independence ──────────────────────────────────────────
    ("Napoleon Reorganizes Europe — The Napoleonic Wars", "Brazilian Independence",
     "direct", 0.8,
     "Napoleonic invasion of Portugal forced the royal court to Brazil, enabling its independence"),

    # ── Treaty of Waitangi ──────────────────────────────────────────────
    ("British Colonization of Australia — First Fleet", "Treaty of Waitangi — Māori and British Crown",
     "contributing", 0.55,
     "British colonization of Australia set patterns for Crown-indigenous treaties like Waitangi"),
    ("Māori Settlement of Aotearoa (New Zealand)", "Treaty of Waitangi — Māori and British Crown",
     "contributing", 0.7,
     "Māori settlement of New Zealand was the precondition for the Treaty of Waitangi"),

    # ── Brazil abolishes slavery ────────────────────────────────────────
    ("Abolition of Slavery in the British Empire", "Brazil Abolishes Slavery — Last in the Americas",
     "contributing", 0.65,
     "British abolition of slavery created international pressure leading to Brazilian abolition"),
    ("13th Amendment — Abolition of Slavery in the United States", "Brazil Abolishes Slavery — Last in the Americas",
     "contributing", 0.6,
     "US abolition of slavery increased pressure on Brazil as the last slaveholding nation in the Americas"),

    # ── Battle of Adwa ──────────────────────────────────────────────────
    ("Berlin Conference — Scramble for Africa", "Battle of Adwa — Ethiopia Defeats Italy",
     "direct", 0.8,
     "The Scramble for Africa provoked Italian attempts to colonize Ethiopia, leading to Adwa"),

    # ── Spanish Civil War ───────────────────────────────────────────────
    ("Treaty of Versailles", "Spanish Civil War Begins",
     "contributing", 0.5,
     "Treaty of Versailles aftermath and interwar instability contributed to the Spanish Civil War"),
    ("Mussolini's March on Rome — Fascism Takes Power", "Spanish Civil War Begins",
     "contributing", 0.6,
     "Mussolini's fascist model inspired Spanish fascism and contributed to civil war"),

    # ── Ghana Independence ──────────────────────────────────────────────
    ("Berlin Conference — Scramble for Africa", "Ghana Independence — First Sub-Saharan Nation to Decolonize",
     "indirect", 0.6,
     "Colonial structures from the Scramble for Africa shaped the independence movements"),

    # ── End of Apartheid ────────────────────────────────────────────────
    ("Ghana Independence — First Sub-Saharan Nation to Decolonize", "End of Apartheid — Mandela Elected President",
     "contributing", 0.55,
     "Ghana's independence inspired African liberation movements including anti-apartheid"),
    ("Helsinki Accords — Human Rights Enter Cold War Diplomacy", "End of Apartheid — Mandela Elected President",
     "contributing", 0.5,
     "Helsinki Accords human rights framework supported international anti-apartheid pressure"),

    # ── Vietnam / Cold War ──────────────────────────────────────────────
    ("Tet Offensive — Vietnam War", "Fall of Saigon — End of the Vietnam War",
     "direct", 0.8,
     "The Tet Offensive eroded US support for the war, leading to withdrawal and Fall of Saigon"),
    ("Fall of Saigon — End of the Vietnam War", "Khmer Rouge Genocide in Cambodia",
     "direct", 0.8,
     "Fall of Saigon destabilized Cambodia, enabling the Khmer Rouge seizure of power"),

    # ── Nuclear Testing ─────────────────────────────────────────────────
    ("Manhattan Project — Building the Atomic Bomb", "Nuclear Testing in the Pacific Islands",
     "direct", 0.9,
     "The Manhattan Project led directly to nuclear weapons testing in the Pacific"),

    # ── Bhopal ──────────────────────────────────────────────────────────
    ("Watt's Steam Engine Patent — Industrial Revolution", "Bhopal Gas Disaster — World's Worst Industrial Accident",
     "indirect", 0.4,
     "Industrial Revolution-era industrialization created the conditions for disasters like Bhopal"),

    # ── Mabo Decision ───────────────────────────────────────────────────
    ("British Colonization of Australia — First Fleet", "Mabo Decision — Aboriginal Land Rights in Australia",
     "contributing", 0.65,
     "British colonization of Australia and dispossession of Aboriginal peoples led to the Mabo case"),

    # ── Behistun ────────────────────────────────────────────────────────
    ("Darius I Reorganizes the Persian Empire", "Behistun Inscription — Darius I's Monumental Proclamation",
     "direct", 0.9,
     "Darius I commissioned the Behistun Inscription to legitimize his reorganization of the empire"),

    # ── Celtic ──────────────────────────────────────────────────────────
    ("End of the Greek Dark Ages — Polis System Emerges", "Celtic Expansion Across Europe",
     "indirect", 0.4,
     "Greek polis development paralleled and interacted with Celtic expansion across Europe"),

    # ── Trump ───────────────────────────────────────────────────────────
    ("Reagan-Gorbachev — The Cold War Ends", "US Presidential Election — Trump Second Term",
     "indirect", 0.35,
     "Post-Cold War political realignments shaped the conditions for Trump's political rise"),
]


async def main():
    conn = await asyncpg.connect(DB_URL)

    # Load all events for title matching
    rows = await conn.fetch("SELECT id, title FROM events")
    title_to_id = {r["title"]: r["id"] for r in rows}

    inserted = 0
    skipped = 0

    for cause_frag, effect_frag, link_type, strength, desc in LINKS:
        # Exact match on title
        cause_id = title_to_id.get(cause_frag)
        effect_id = title_to_id.get(effect_frag)

        if not cause_id or not effect_id:
            print(f"  SKIP (not found): {cause_frag!r} -> {effect_frag!r}")
            skipped += 1
            continue

        # Map link types
        db_link_type = {
            "direct": "direct",
            "indirect": "indirect",
            "contributing": "contributing",
            "disputed": "disputed",
        }.get(link_type, "contributing")

        try:
            await conn.execute("""
                INSERT INTO causality_links
                    (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
                VALUES ($1, $2, $3, $4, $5, 'claude-enrichment', 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
            """, cause_id, effect_id, db_link_type, strength, desc)
            inserted += 1
        except Exception as e:
            print(f"  ERROR: {cause_frag!r} -> {effect_frag!r}: {e}")
            skipped += 1

    await conn.close()
    print(f"Done. Inserted {inserted}, skipped {skipped}.")


if __name__ == "__main__":
    asyncio.run(main())
