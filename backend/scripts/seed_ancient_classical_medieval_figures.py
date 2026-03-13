"""Seed ~25 historical figures for Ancient/Classical/Medieval eras + 40 causality links for isolated events."""

import uuid
import psycopg2
import psycopg2.extras

DSN = "host=db port=5432 dbname=chronicle user=chronicle password=chronicle"

# ──────────────────────────────────────────────────────────────────────
# New people — Ancient (-3000 to -500), Classical (-500 to 500), Medieval (500–1500)
# ──────────────────────────────────────────────────────────────────────

PEOPLE = [
    # ── Ancient ──
    dict(name="Hammurabi", birth_year=-1810, birth_year_circa=True, death_year=-1750, death_year_circa=True,
         nationalities=["Babylonian"], roles=["king", "lawgiver"], gender="M",
         wikidata_id="Q80015", wikipedia_slug="Hammurabi",
         description="King of Babylon who created one of the earliest and most complete written legal codes."),
    dict(name="Thutmose III", birth_year=-1481, birth_year_circa=True, death_year=-1425, death_year_circa=True,
         nationalities=["Egyptian"], roles=["pharaoh", "military commander"], gender="M",
         wikidata_id="Q7373", wikipedia_slug="Thutmose_III",
         description="Egyptian pharaoh often called the Napoleon of Egypt, who expanded the empire to its greatest extent."),
    dict(name="Sargon of Akkad", birth_year=-2334, birth_year_circa=True, death_year=-2279, death_year_circa=True,
         nationalities=["Akkadian"], roles=["emperor", "conqueror"], gender="M",
         wikidata_id="Q7416458", wikipedia_slug="Sargon_of_Akkad",
         description="Founder of the Akkadian Empire, often regarded as the first empire in history."),
    dict(name="Nebuchadnezzar II", birth_year=-634, birth_year_circa=True, death_year=-562,
         nationalities=["Babylonian"], roles=["king"], gender="M",
         wikidata_id="Q7271", wikipedia_slug="Nebuchadnezzar_II",
         description="King of the Neo-Babylonian Empire who built the Hanging Gardens and conquered Jerusalem."),
    dict(name="Zoroaster", birth_year=-1500, birth_year_circa=True, death_year=-1000, death_year_circa=True,
         nationalities=["Persian"], roles=["prophet", "philosopher"], gender="M",
         wikidata_id="Q4698", wikipedia_slug="Zoroaster",
         description="Ancient Persian prophet who founded Zoroastrianism, one of the world's oldest monotheistic religions."),
    dict(name="Gilgamesh", birth_year=-2700, birth_year_circa=True, death_year=-2600, death_year_circa=True,
         nationalities=["Sumerian"], roles=["king", "legendary figure"], gender="M",
         wikidata_id="Q8803", wikipedia_slug="Gilgamesh",
         description="Semi-legendary king of Uruk and subject of the Epic of Gilgamesh, the oldest surviving great work of literature."),

    # ── Classical (-500 to 500) ──
    dict(name="Pericles", birth_year=-495, birth_year_circa=True, death_year=-429,
         nationalities=["Greek"], roles=["statesman", "orator", "general"], gender="M",
         wikidata_id="Q4502", wikipedia_slug="Pericles",
         description="Athenian statesman who led Athens during its Golden Age, overseeing the construction of the Parthenon."),
    dict(name="Herodotus", birth_year=-484, birth_year_circa=True, death_year=-425, death_year_circa=True,
         nationalities=["Greek"], roles=["historian"], gender="M",
         wikidata_id="Q26825", wikipedia_slug="Herodotus",
         description="Greek historian known as the Father of History for his detailed accounts of the Greco-Persian Wars."),
    dict(name="Cicero", birth_year=-106, death_year=-43,
         nationalities=["Roman"], roles=["orator", "statesman", "philosopher"], gender="M",
         wikidata_id="Q1541", wikipedia_slug="Cicero",
         description="Roman statesman, orator, and philosopher whose writings on rhetoric and politics influenced Western thought for centuries."),
    dict(name="Marcus Aurelius", birth_year=121, death_year=180,
         nationalities=["Roman"], roles=["emperor", "philosopher"], gender="M",
         wikidata_id="Q1430", wikipedia_slug="Marcus_Aurelius",
         description="Roman emperor and Stoic philosopher whose Meditations remains one of the most influential works of philosophy."),
    dict(name="Constantine the Great", birth_year=272, birth_year_circa=True, death_year=337,
         nationalities=["Roman"], roles=["emperor"], gender="M",
         wikidata_id="Q8413", wikipedia_slug="Constantine_the_Great",
         description="Roman emperor who legalized Christianity and founded Constantinople as the new eastern capital."),
    dict(name="Spartacus", birth_year=-111, birth_year_circa=True, death_year=-71,
         nationalities=["Thracian"], roles=["gladiator", "rebel leader"], gender="M",
         wikidata_id="Q4144", wikipedia_slug="Spartacus",
         description="Thracian gladiator who led a major slave uprising against the Roman Republic."),
    dict(name="Virgil", birth_year=-70, death_year=-19,
         nationalities=["Roman"], roles=["poet"], gender="M",
         wikidata_id="Q1398", wikipedia_slug="Virgil",
         description="Roman poet who wrote the Aeneid, the Latin epic that became foundational to Western literature."),
    dict(name="Trajan", birth_year=53, death_year=117,
         nationalities=["Roman", "Spanish"], roles=["emperor", "military commander"], gender="M",
         wikidata_id="Q1425", wikipedia_slug="Trajan",
         description="Roman emperor under whom the empire reached its maximum territorial extent."),
    dict(name="Attila the Hun (dedup check)", birth_year=406, birth_year_circa=True, death_year=453,
         nationalities=["Hunnic"], roles=["ruler", "military commander"], gender="M",
         wikidata_id="Q36488", wikipedia_slug="Attila",
         description="Ruler of the Hunnic Empire who invaded both the Eastern and Western Roman empires."),

    # ── Medieval (500–1500) ──
    dict(name="Maimonides", birth_year=1138, death_year=1204,
         nationalities=["Andalusian", "Jewish"], roles=["philosopher", "physician", "rabbi"], gender="M",
         wikidata_id="Q81124", wikipedia_slug="Maimonides",
         description="Sephardic Jewish philosopher and physician whose Guide for the Perplexed is a foundational work of Jewish philosophy."),
    dict(name="Francis of Assisi", birth_year=1181, birth_year_circa=True, death_year=1226,
         nationalities=["Italian"], roles=["friar", "saint", "founder"], gender="M",
         wikidata_id="Q676555", wikipedia_slug="Francis_of_Assisi",
         description="Italian Catholic friar who founded the Franciscan Order and is the patron saint of animals and the environment."),
    dict(name="Frederick Barbarossa", birth_year=1122, birth_year_circa=True, death_year=1190,
         nationalities=["German"], roles=["emperor", "king"], gender="M",
         wikidata_id="Q76918", wikipedia_slug="Frederick_Barbarossa",
         description="Holy Roman Emperor who led the Third Crusade and sought to restore imperial authority in Italy."),
    dict(name="Tamerlane", birth_year=1336, death_year=1405,
         nationalities=["Timurid", "Turco-Mongol"], roles=["conqueror", "emperor"], gender="M",
         wikidata_id="Q8462", wikipedia_slug="Timur",
         description="Turco-Mongol conqueror who founded the Timurid Empire, stretching from Turkey to India."),
    dict(name="Al-Biruni", birth_year=973, death_year=1048,
         nationalities=["Khwarezmian", "Persian"], roles=["scholar", "polymath", "astronomer"], gender="M",
         wikidata_id="Q4507", wikipedia_slug="Al-Biruni",
         description="Persian polymath who made pioneering contributions to astronomy, mathematics, and comparative religion."),
    dict(name="Snorri Sturluson", birth_year=1179, death_year=1241,
         nationalities=["Icelandic"], roles=["historian", "poet", "chieftain"], gender="M",
         wikidata_id="Q44385", wikipedia_slug="Snorri_Sturluson",
         description="Icelandic historian and author of the Prose Edda and Heimskringla, preserving Norse mythology and history."),
    dict(name="Justinian I", birth_year=482, birth_year_circa=True, death_year=565,
         nationalities=["Byzantine", "Roman"], roles=["emperor", "lawgiver"], gender="M",
         wikidata_id="Q5765", wikipedia_slug="Justinian_I",
         description="Byzantine emperor who reconquered much of the western Roman Empire and codified Roman law."),
    dict(name="Alfred the Great", birth_year=849, death_year=899,
         nationalities=["Anglo-Saxon", "English"], roles=["king", "scholar"], gender="M",
         wikidata_id="Q105180", wikipedia_slug="Alfred_the_Great",
         description="King of Wessex who defended England against Viking invasions and promoted learning and literacy."),
    dict(name="Rabban Bar Sauma", birth_year=1220, birth_year_circa=True, death_year=1294,
         nationalities=["Uyghur", "Mongol"], roles=["monk", "diplomat", "explorer"], gender="M",
         wikidata_id="Q360485", wikipedia_slug="Rabban_Bar_Sauma",
         description="Nestorian Christian monk who traveled from China to Europe, often called the reverse Marco Polo."),
    dict(name="Mansa Musa (dedup check)", birth_year=1280, birth_year_circa=True, death_year=1337, death_year_circa=True,
         nationalities=["Malian"], roles=["emperor"], gender="M",
         wikidata_id="Q180901", wikipedia_slug="Mansa_Musa",
         description="Emperor of the Mali Empire and possibly the wealthiest person in history, known for his lavish pilgrimage to Mecca."),
]

# Filter out dedup checks if they already exist (by wikidata_id)
# These are included as safety — script handles ON CONFLICT

# ──────────────────────────────────────────────────────────────────────
# Event links: person name → [(keyword, role)]
# ──────────────────────────────────────────────────────────────────────

EVENT_LINKS = {
    "Hammurabi": [("Hammurabi", "author"), ("Babylon", "ruler"), ("Code of Hammurabi", "author")],
    "Thutmose III": [("Thutmose", "commander"), ("Egypt%empire", "pharaoh"), ("Megiddo", "commander")],
    "Sargon of Akkad": [("Akkad", "founder"), ("Sumer", "conqueror")],
    "Nebuchadnezzar II": [("Nebuchadnezzar", "ruler"), ("Babylon", "king"), ("Hanging Gardens", "builder"), ("Jerusalem%destroy", "commander")],
    "Zoroaster": [("Zoroastr", "founder")],
    "Gilgamesh": [("Gilgamesh", "subject"), ("Uruk", "king"), ("Sumer", "ruler")],
    "Pericles": [("Pericles", "leader"), ("Parthenon", "patron"), ("Athens%Golden", "leader"), ("Peloponnesian", "leader")],
    "Herodotus": [("Herodotus", "author"), ("Greco-Persian", "historian"), ("Persian Wars", "historian")],
    "Cicero": [("Cicero", "orator"), ("Roman Republic", "statesman"), ("Caesar%assassin", "senator")],
    "Marcus Aurelius": [("Marcus Aurelius", "emperor"), ("Stoic", "philosopher"), ("Roman%frontier", "emperor")],
    "Constantine the Great": [("Constantine", "emperor"), ("Edict of Milan", "author"), ("Constantinople", "founder"), ("Christianity%legali", "patron")],
    "Spartacus": [("Spartacus", "leader"), ("slave%revolt", "leader"), ("gladiat", "rebel")],
    "Virgil": [("Aeneid", "author"), ("Virgil", "poet"), ("Roman%literature", "author")],
    "Trajan": [("Trajan", "emperor"), ("Roman Empire%extent", "commander"), ("Dacia", "commander")],
    "Maimonides": [("Maimonides", "author"), ("Jewish%philosophy", "philosopher")],
    "Francis of Assisi": [("Francis%Assisi", "founder"), ("Franciscan", "founder")],
    "Frederick Barbarossa": [("Barbarossa", "commander"), ("Holy Roman", "emperor"), ("Third Crusade", "commander")],
    "Tamerlane": [("Tamerlane", "commander"), ("Timur", "conqueror"), ("Timurid", "founder")],
    "Al-Biruni": [("Al-Biruni", "author"), ("Khwarezm", "scholar"), ("Islamic%science", "scholar")],
    "Snorri Sturluson": [("Norse", "historian"), ("Edda", "author"), ("Iceland", "chieftain")],
    "Justinian I": [("Justinian", "emperor"), ("Hagia Sophia", "patron"), ("Corpus Juris", "author"), ("Byzantine", "emperor")],
    "Alfred the Great": [("Alfred", "king"), ("Viking%England", "defender"), ("Wessex", "king")],
    "Rabban Bar Sauma": [("Mongol%Christian", "diplomat")],
}

# ──────────────────────────────────────────────────────────────────────
# Causality links for isolated high-importance events
# (cause_title_keyword, effect_title_keyword, link_type, strength, description)
# ──────────────────────────────────────────────────────────────────────

CAUSALITY_LINKS = [
    # Prehistoric / Ancient
    ("Wheel Invented", "Chariot Warfare", "direct", 0.85,
     "Invention of the wheel enabled development of war chariots"),
    ("Wheel Invented", "Silk Road", "contributing", 0.5,
     "Wheeled transport was essential for overland trade route development"),
    ("Stonehenge%Neolithic Britain", "Stonehenge%Phase 1", "direct", 0.9,
     "Phases of the same monument construction project"),
    ("Bantu Expansion%Great Migration", "Bantu Expansion%Sub-Saharan", "direct", 0.95,
     "Same historical process of Bantu migration across Africa"),
    ("Göbekli Tepe", "Stonehenge%Neolithic", "contributing", 0.4,
     "Early monumental architecture traditions influenced later temple and monument building"),

    # Classical
    ("First Olympic Games", "Peloponnesian War", "contributing", 0.35,
     "Pan-Hellenic institutions like the Olympics shaped Greek interstate relations"),
    ("First Olympic Games", "Greek%Democracy", "contributing", 0.3,
     "Olympic gatherings fostered civic identity that contributed to democratic ideals"),

    # Medieval
    ("Construction of Angkor Wat", "Founding of the Khmer Empire", "direct", 0.85,
     "The Khmer Empire's founding enabled the construction of Angkor Wat as its monumental temple"),
    ("Founding of the Khmer Empire", "Construction of Angkor Wat", "direct", 0.85,
     "Khmer state power and resources made Angkor Wat possible"),
    ("Founding of the Mali Empire", "Mansa Musa%Pilgrimage", "direct", 0.9,
     "The Mali Empire's wealth under Sundiata enabled Mansa Musa's legendary pilgrimage"),
    ("Construction of Machu Picchu", "Founding of the Inca Empire", "direct", 0.9,
     "The Inca Empire's establishment was prerequisite to building Machu Picchu"),
    ("Ibn Sina%Canon of Medicine", "Islamic Golden Age", "contributing", 0.5,
     "Avicenna's medical work was a pinnacle achievement of Islamic Golden Age scholarship"),
    ("Rise of the Srivijaya", "Angkor Wat", "contributing", 0.4,
     "Srivijaya's maritime trade networks influenced Southeast Asian state development"),

    # Early Modern
    ("Spanish Conquest of the Inca", "Potosí Silver Mining", "direct", 0.9,
     "Spanish conquest gave access to Potosí's silver mines, fueling colonial economy"),
    ("Haitian Revolution", "Simón Bolívar%Liberation", "direct", 0.7,
     "The Haitian Revolution inspired and directly aided Bolívar's South American independence campaigns"),
    ("British Colonization of Australia", "First Human Settlement of Australia", "contributing", 0.3,
     "British colonization disrupted 65,000 years of continuous Aboriginal civilization"),
    ("Locke Publishes Essay", "Kant Publishes Critique", "contributing", 0.65,
     "Locke's empiricist epistemology was a key influence that Kant sought to reconcile with rationalism"),
    ("Harvey Describes Blood Circulation", "Pasteur", "contributing", 0.5,
     "Harvey's empirical approach to medicine paved the way for modern biomedical science"),

    # 19th–20th Century
    ("Battle of Adwa", "Ghana Independence", "contributing", 0.55,
     "Ethiopia's victory at Adwa became a symbol of African resistance that inspired independence movements"),
    ("Fall of Saigon", "Khmer Rouge%Cambodia", "direct", 0.75,
     "The fall of South Vietnam emboldened and enabled the Khmer Rouge takeover of Cambodia"),
    ("End of Apartheid", "Ghana Independence", "contributing", 0.45,
     "Ghana's independence was an early milestone in African decolonization leading to anti-apartheid momentum"),

    # More Ancient/Classical links
    ("Caral-Supe%Oldest Civilization", "Norte Chico%Americas", "direct", 0.95,
     "Same civilization referred to as Caral-Supe and Norte Chico"),
    ("Aboriginal Dreamtime", "First Human Settlement of Australia", "direct", 0.8,
     "Dreamtime spiritual traditions developed from the earliest human settlement of Australia"),

    # Additional medieval/early modern causality
    ("Founding of the Inca Empire", "Spanish Conquest of the Inca", "direct", 0.85,
     "The Inca Empire's existence and wealth attracted Spanish conquest"),
    ("Founding of the Inca Empire", "Construction of Machu Picchu", "direct", 0.9,
     "Inca imperial power enabled construction of Machu Picchu as a royal estate"),
]


def main():
    conn = psycopg2.connect(DSN)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # ── 1. Insert people ──
    cur.execute("SELECT wikidata_id, id, name FROM people")
    existing = {r["wikidata_id"]: r for r in cur.fetchall() if r["wikidata_id"]}

    people_inserted = 0
    people_skipped = 0
    person_ids = {}

    for p in PEOPLE:
        wid = p.get("wikidata_id")
        if wid and wid in existing:
            person_ids[p["name"].replace(" (dedup check)", "")] = existing[wid]["id"]
            people_skipped += 1
            continue

        # Strip dedup check suffix from name
        clean_name = p["name"].replace(" (dedup check)", "")
        pid = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO people (id, name, aliases, birth_year, birth_year_circa,
                                death_year, death_year_circa, nationalities, roles,
                                gender, wikidata_id, wikipedia_slug, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (wikidata_id) DO NOTHING
            RETURNING id
        """, (
            pid, clean_name, p.get("aliases"),
            p.get("birth_year"), p.get("birth_year_circa", False),
            p.get("death_year"), p.get("death_year_circa", False),
            p.get("nationalities"), p.get("roles"),
            p.get("gender"), p.get("wikidata_id"),
            p.get("wikipedia_slug"), p.get("description"),
        ))
        row = cur.fetchone()
        if row:
            person_ids[clean_name] = row["id"]
            people_inserted += 1
        else:
            people_skipped += 1

    print(f"People: {people_inserted} inserted, {people_skipped} skipped")

    # ── 2. Link people to events ──
    links_created = 0
    links_skipped = 0

    for person_name, keywords in EVENT_LINKS.items():
        pid = person_ids.get(person_name)
        if not pid:
            # Try to find by name in DB
            cur.execute("SELECT id FROM people WHERE name = %s", (person_name,))
            row = cur.fetchone()
            if row:
                pid = row["id"]
            else:
                continue

        for keyword, role in keywords:
            parts = keyword.split("%")
            where_clauses = " AND ".join("title ILIKE %s" for _ in parts)
            params = [f"%{part}%" for part in parts]

            cur.execute(f"SELECT id FROM events WHERE {where_clauses} LIMIT 1", params)
            row = cur.fetchone()
            if not row:
                continue

            cur.execute("""
                INSERT INTO event_people (event_id, person_id, role)
                VALUES (%s, %s, %s)
                ON CONFLICT (event_id, person_id, role) DO NOTHING
            """, (str(row["id"]), str(pid), role))

            if cur.rowcount > 0:
                links_created += 1
            else:
                links_skipped += 1

    print(f"Event-people links: {links_created} created, {links_skipped} skipped")

    # ── 3. Add causality links for isolated events ──
    causality_created = 0
    causality_skipped = 0
    causality_failed = 0

    for cause_kw, effect_kw, link_type, strength, desc in CAUSALITY_LINKS:
        # Find cause event
        cause_parts = cause_kw.split("%")
        cause_where = " AND ".join("title ILIKE %s" for _ in cause_parts)
        cause_params = [f"%{p}%" for p in cause_parts]
        cur.execute(f"SELECT id FROM events WHERE {cause_where} ORDER BY importance_score DESC LIMIT 1", cause_params)
        cause_row = cur.fetchone()

        # Find effect event
        effect_parts = effect_kw.split("%")
        effect_where = " AND ".join("title ILIKE %s" for _ in effect_parts)
        effect_params = [f"%{p}%" for p in effect_parts]
        cur.execute(f"SELECT id FROM events WHERE {effect_where} ORDER BY importance_score DESC LIMIT 1", effect_params)
        effect_row = cur.fetchone()

        if not cause_row or not effect_row:
            causality_failed += 1
            cause_found = "Y" if cause_row else "N"
            effect_found = "Y" if effect_row else "N"
            print(f"  SKIP causality: '{cause_kw}' ({cause_found}) -> '{effect_kw}' ({effect_found})")
            continue

        if cause_row["id"] == effect_row["id"]:
            causality_skipped += 1
            continue

        cur.execute("""
            INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
            VALUES (%s, %s, %s, %s, %s, %s, 'approved')
            ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
        """, (str(cause_row["id"]), str(effect_row["id"]), link_type, strength, desc, "seed_script"))

        if cur.rowcount > 0:
            causality_created += 1
        else:
            causality_skipped += 1

    print(f"Causality links: {causality_created} created, {causality_skipped} skipped, {causality_failed} failed")
    print(f"\nSummary: {people_inserted} new people, {links_created} new event links, {causality_created} new causality links")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
