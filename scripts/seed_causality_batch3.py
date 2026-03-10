#!/usr/bin/env python3
"""
Causality batch 3 — Connect ~150+ isolated high-importance events.
Focuses on historically accurate relationships between events that
currently have zero causality links in the database.
"""
import asyncio
import asyncpg
import uuid

DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'

# Format: (cause_keyword, effect_keyword, link_type, strength, description)
# link_type: causes=direct, leads_to=indirect, enables=contributing, context=contributing
LINKS = [
    # ── Ancient / Prehistoric ────────────────────────────────────────────
    ("earliest stone tools", "gobekli tepe", "leads_to", 0.3,
     "Tool-making traditions over millennia enabled complex construction"),
    ("gobekli tepe", "agricultural revolution fertile", "enables", 0.6,
     "Ritual gatherings at Göbekli Tepe may have driven early agriculture"),
    ("agricultural revolution fertile", "wheel", "enables", 0.5,
     "Settled farming societies developed wheeled transport"),
    ("wheel", "narmer unification egypt", "enables", 0.4,
     "Transport technology aided state formation"),
    ("narmer unification egypt-3100", "great pyramid", "leads_to", 0.8,
     "Unified Egypt enabled monumental pyramid construction"),
    ("narmer unification egypt-3100", "code of hammurabi", "leads_to", 0.4,
     "Egyptian state-building precedent influenced Mesopotamian law"),
    ("code of hammurabi", "ashurbanipal assyrian", "leads_to", 0.5,
     "Mesopotamian legal traditions continued through Assyrian Empire"),
    ("shang dynasty-1600", "oracle bone script", "causes", 0.9,
     "Shang Dynasty developed oracle bone divination writing"),
    ("vedas composition india", "upanishads", "leads_to", 0.8,
     "Vedic traditions evolved into Upanishadic philosophy"),
    ("vedas composition india", "buddha enlightenment", "enables", 0.6,
     "Vedic religious context shaped Buddhist thought"),
    ("stonehenge construction-3000", "stonehenge phase", "context", 0.9,
     "Phases of Stonehenge construction"),
    ("earliest stone tools", "cave paintings lascaux", "leads_to", 0.3,
     "Tool-making cognitive development led to artistic expression"),
    ("cave paintings altamira", "cave paintings lascaux", "context", 0.7,
     "Contemporary Upper Paleolithic cave art traditions"),
    ("dog domestication", "agricultural revolution fertile", "enables", 0.4,
     "Animal domestication preceded and enabled agricultural revolution"),

    # ── Classical Greece ──────────────────────────────────────────────────
    ("pythagoras mathematics", "hippocrates medicine", "enables", 0.5,
     "Greek rational inquiry tradition enabled medical science"),
    ("pythagoras mathematics", "euclid elements", "leads_to", 0.8,
     "Pythagorean mathematics directly influenced Euclidean geometry"),
    ("hippocrates medicine", "galen medicine", "leads_to", 0.7,
     "Hippocratic tradition continued through Galen's medical works"),
    ("battle of plataea", "athens golden age", "enables", 0.8,
     "Persian defeat at Plataea secured Athens' golden age"),
    ("socrates trial death", "aristotle lyceum", "leads_to", 0.6,
     "Socratic tradition continued through Plato to Aristotle"),
    ("first olympic games", "athenian democracy", "context", 0.4,
     "Pan-Hellenic institutions and democratic culture"),
    ("euclid elements", "ptolemy almagest", "enables", 0.7,
     "Euclidean geometry enabled Ptolemaic astronomy"),
    ("philip-ii-battle-chaeronea", "alexander conquests", "causes", 0.9,
     "Philip II's conquest of Greece enabled Alexander's campaigns"),

    # ── Roman Empire ──────────────────────────────────────────────────────
    ("founding of rome-753", "founding of the roman republic", "leads_to", 0.8,
     "Monarchical Rome evolved into the Republic"),
    ("battle of zama", "destruction of carthage", "leads_to", 0.7,
     "Zama victory set stage for final destruction of Carthage"),
    ("cleopatra caesar alliance", "assassination julius caesar", "enables", 0.4,
     "Caesar's eastern entanglements fed senatorial opposition"),
    ("cleopatra caesar alliance", "battle actium", "leads_to", 0.6,
     "Cleopatra's alliances with Roman leaders culminated at Actium"),
    ("virgil aeneid", "pax romana", "context", 0.7,
     "Virgil's Aeneid celebrated and legitimized Augustan peace"),
    ("eruption vesuvius pompeii", "roman roads appian", "context", 0.4,
     "Roman infrastructure and natural disaster in imperial period"),
    ("roman roads appian", "roman aqueduct", "context", 0.8,
     "Roman engineering achievements in infrastructure"),
    ("marcus aurelius meditations", "fall of the western roman", "context", 0.4,
     "Marcus Aurelius' reign marked the beginning of Rome's decline"),
    ("nero great fire of rome", "destruction of jerusalem temple", "context", 0.5,
     "Neronian persecution and Jewish revolt in same imperial period"),
    ("roman conquest of britain", "boudicca revolt", "causes", 0.9,
     "Roman occupation of Britain provoked Boudicca's revolt"),

    # ── Late Antiquity / Early Medieval ───────────────────────────────────
    ("hagia sophia completed", "justinian", "context", 0.9,
     "Hagia Sophia was Justinian's greatest architectural achievement"),
    ("umayyad caliphate established", "abbasid caliphate founded", "leads_to", 0.8,
     "Abbasid revolution overthrew the Umayyad Caliphate"),
    ("umayyad caliphate established", "battle of tours", "leads_to", 0.7,
     "Umayyad expansion into Europe was checked at Tours"),
    ("harun al-rashid", "house of wisdom baghdad", "causes", 0.9,
     "Harun al-Rashid patronized the House of Wisdom"),
    ("saint augustine city of god", "council of nicaea", "context", 0.5,
     "Early Christian theological development"),
    ("baptism of vladimir", "mongol sack of kiev", "context", 0.4,
     "Christianization of Kievan Rus preceded Mongol devastation"),
    ("dome of the rock", "umayyad caliphate established", "context", 0.7,
     "Dome of the Rock built during Umayyad Caliphate"),
    ("teotihuacan pyramid", "classic maya collapse", "context", 0.4,
     "Major Mesoamerican civilizations rose and fell in parallel"),
    ("teotihuacan pyramid", "cahokia mississippian", "context", 0.3,
     "Mesoamerican urban traditions influenced North American cultures"),

    # ── Medieval Asia ─────────────────────────────────────────────────────
    ("angkor founded-802", "khmer empire angkor wat-1113", "leads_to", 0.9,
     "Khmer Empire founded at Angkor later built Angkor Wat"),
    ("movable type printing bi sheng", "printing revolution gutenberg", "enables", 0.5,
     "Chinese movable type concept preceded Gutenberg's press"),
    ("compass navigation china", "polynesian navigation", "context", 0.3,
     "Different navigation traditions across Pacific and Asia"),
    ("compass navigation china", "magellan circumnavigation", "enables", 0.6,
     "Magnetic compass was essential for oceanic navigation"),
    ("song dynasty paper money", "compass navigation china", "context", 0.7,
     "Song Dynasty technological innovations in parallel"),
    ("heian period tale genji", "tale of genji", "context", 0.9,
     "Tale of Genji was the masterpiece of Heian court culture"),
    ("mansa musa pilgrimage", "ibn battuta travels", "context", 0.6,
     "Mansa Musa's wealth drew travelers like Ibn Battuta to Mali"),
    ("mansa musa pilgrimage", "great zimbabwe", "context", 0.4,
     "Contemporary African kingdoms and trade networks"),
    ("delhi sultanate founding", "mughal empire", "leads_to", 0.5,
     "Delhi Sultanate preceded Mughal conquest of India"),
    ("aztec founding tenochtitlan", "inca empire expansion", "context", 0.4,
     "Contemporary American empire-building"),
    ("aztec founding tenochtitlan", "conquest of the aztec", "leads_to", 0.6,
     "Aztec Empire's wealth attracted Spanish conquest"),
    ("inca empire expansion", "pizarro", "leads_to", 0.7,
     "Inca Empire's wealth attracted Spanish conquest"),
    ("ming dynasty zheng he voyages", "ming voyages end", "causes", 0.9,
     "Zheng He's voyages were terminated by imperial decree"),
    ("viking discovery north america", "leif eriksson reaches north america", "context", 0.9,
     "Viking settlement and exploration of Vinland"),
    ("viking age begins", "viking discovery north america", "leads_to", 0.7,
     "Viking expansion led to North American discovery"),
    ("forbidden city built", "ming dynasty zheng he voyages", "context", 0.7,
     "Ming Dynasty achievements in architecture and exploration"),
    ("great zimbabwe", "mansa musa pilgrimage", "context", 0.4,
     "Medieval African kingdoms and wealth"),

    # ── Early Modern Period ───────────────────────────────────────────────
    ("printing revolution gutenberg", "luther", "enables", 0.8,
     "Gutenberg's press enabled rapid spread of Reformation"),
    ("ottoman empire suleiman", "battle lepanto", "leads_to", 0.6,
     "Ottoman naval expansion under Suleiman checked at Lepanto"),
    ("ottoman empire suleiman", "ottoman tanzimat reforms", "leads_to", 0.4,
     "Ottoman imperial traditions eventually required reform"),
    ("habsburg empire charles v", "ottoman empire suleiman", "context", 0.7,
     "Habsburg-Ottoman rivalry dominated 16th century Europe"),
    ("slave trade atlantic peak", "columbian exchange", "context", 0.7,
     "Atlantic slave trade was part of the Columbian Exchange system"),
    ("slave trade atlantic peak", "abolition slave trade britain", "leads_to", 0.7,
     "Peak of slave trade horrors motivated abolition movement"),
    ("qing dynasty founding", "qing dynasty conquers", "context", 0.9,
     "Qing Dynasty founding and Manchu conquest of China"),
    ("qing dynasty founding", "first opium war treaty nanjing", "leads_to", 0.5,
     "Qing Dynasty's isolationism made it vulnerable to Western powers"),
    ("first opium war treaty nanjing", "second opium war", "causes", 0.8,
     "Unresolved tensions from first Opium War caused the second"),
    ("first opium war treaty nanjing", "taiping rebellion", "enables", 0.6,
     "Opium War humiliation destabilized Qing, enabling Taiping revolt"),
    ("mayflower pilgrims", "mayflower plymouth colony", "context", 0.9,
     "Mayflower voyage and Plymouth Colony founding"),
    ("mayflower pilgrims", "american revolution begins", "leads_to", 0.4,
     "Colonial foundations eventually led to American independence"),
    ("captain cook pacific", "polynesian navigation", "context", 0.5,
     "Cook's voyages encountered Polynesian seafaring cultures"),
    ("magellan circumnavigation", "captain cook pacific", "leads_to", 0.5,
     "Magellan's route opened Pacific to later European exploration"),
    ("scramble for africa congo leopold", "berlin conference scramble africa", "context", 0.8,
     "Leopold's Congo claims were formalized at the Berlin Conference"),
    ("scramble for africa congo leopold", "rwandan genocide", "enables", 0.4,
     "Colonial borders and ethnic policies laid groundwork for genocide"),

    # ── Revolutionary Era ─────────────────────────────────────────────────
    ("french revolution storming bastille", "declaration rights man", "causes", 0.9,
     "French Revolution produced the Declaration of Rights of Man"),
    ("french revolution storming bastille", "haitian revolution", "enables", 0.8,
     "French revolutionary ideals inspired Haitian slave revolt"),
    ("declaration rights man", "napoleonic code", "leads_to", 0.6,
     "Revolutionary rights codified into Napoleonic legal framework"),
    ("magna carta-1215-detail", "english bill of rights", "leads_to", 0.6,
     "Magna Carta's principles evolved into constitutional monarchy"),
    ("constitutional convention-1787", "american bill of rights", "causes", 0.9,
     "Constitution ratification required Bill of Rights amendments"),
    ("constitutional convention-1787", "american constitution", "causes", 0.95,
     "Convention produced the US Constitution"),
    ("congress of vienna-1815", "revolutions of 1848", "enables", 0.6,
     "Vienna settlement's conservatism provoked 1848 revolutions"),
    ("congress of vienna-1815", "german unification", "enables", 0.5,
     "Congress of Vienna's German Confederation preceded unification"),
    ("battle trafalgar-1805", "napoleon", "context", 0.7,
     "Trafalgar ended Napoleon's invasion plans for Britain"),
    ("battle trafalgar-1805", "congress of vienna-1815", "leads_to", 0.5,
     "British naval supremacy shaped post-Napoleonic settlement"),
    ("haitian revolution-1791", "abolition slavery british empire", "enables", 0.5,
     "Haiti's successful slave revolt accelerated British abolition"),
    ("zulu empire shaka", "scramble for africa", "context", 0.5,
     "Zulu Kingdom resisted European colonial expansion"),
    ("zulu empire shaka", "south africa apartheid", "context", 0.3,
     "Zulu displacement shaped South African racial dynamics"),
    ("trail of tears cherokee", "wounded knee massacre", "leads_to", 0.6,
     "Trail of Tears was part of systematic Native American dispossession"),
    ("abolition serfdom russia", "russian revolution 1905", "enables", 0.5,
     "Incomplete emancipation reforms fueled Russian revolutionary sentiment"),
    ("san martin liberation peru", "battle ayacucho", "leads_to", 0.7,
     "San Martín's campaigns led to decisive victory at Ayacucho"),
    ("mexican independence-1821", "san martin liberation peru", "context", 0.5,
     "Wave of Latin American independence movements"),
    ("greek independence-1821", "greek war independence", "context", 0.9,
     "Greek independence war and outcome"),

    # ── Scientific / Industrial Revolution ────────────────────────────────
    ("darwin origin of species publication", "mendeleev periodic table", "context", 0.4,
     "Mid-19th century scientific revolution in biology and chemistry"),
    ("darwin origin of species publication", "freud interpretation dreams", "enables", 0.4,
     "Darwinian thought influenced Freud's evolutionary psychology"),
    ("mendeleev periodic table", "x-ray discovery roentgen", "enables", 0.4,
     "Periodic table's atomic theory foundation enabled X-ray discovery"),
    ("x-ray discovery roentgen", "penicillin discovered", "context", 0.4,
     "Medical discoveries that transformed healthcare"),
    ("penicillin discovered", "aids epidemic", "context", 0.3,
     "Antibiotic revolution contrasted with later epidemic challenges"),
    ("telephone invention bell", "edison lightbulb", "context", 0.6,
     "Late 19th century electrical invention revolution"),
    ("edison lightbulb", "model t ford", "context", 0.5,
     "American industrial innovation from electricity to automobiles"),
    ("telegraph invention morse", "telephone invention bell", "leads_to", 0.8,
     "Telegraph's electrical communication led to voice telephony"),
    ("telegraph invention morse", "marconi transatlantic radio", "leads_to", 0.6,
     "Telegraph wired communication led to wireless radio"),
    ("first photograph daguerre", "first film lumiere", "leads_to", 0.8,
     "Photography directly led to motion pictures"),
    ("bessemer steel process", "eiffel tower construction", "enables", 0.7,
     "Bessemer steel made large iron/steel structures possible"),
    ("bessemer steel process", "model t ford", "enables", 0.5,
     "Cheap steel enabled mass automobile production"),
    ("model t ford", "titanic sinks", "context", 0.3,
     "Industrial confidence and technological hubris of the era"),
    ("hubble galaxies", "einstein", "context", 0.6,
     "Hubble's observations confirmed expanding universe theory"),
    ("ptolemy almagest", "copernicus", "leads_to", 0.6,
     "Ptolemaic astronomy was the framework Copernicus overthrew"),
    ("galileo jupiters moons", "galileo before the inquisition", "causes", 0.9,
     "Galileo's telescopic discoveries led to his church trial"),
    ("x-ray discovery roentgen", "higgs boson discovered", "leads_to", 0.3,
     "Particle physics from X-rays to the Higgs boson"),
    ("aryabhata mathematics", "al-khwarizmi algebra", "enables", 0.5,
     "Indian mathematics influenced Islamic algebraic traditions"),
    ("panini sanskrit grammar", "pythagoras mathematics", "context", 0.4,
     "Ancient traditions of formal systematic thought"),
    ("california gold rush", "australian gold rush", "leads_to", 0.6,
     "California gold rush inspired Australian prospecting"),
    ("womens suffrage new zealand", "womens suffrage", "context", 0.8,
     "New Zealand pioneered women's suffrage movement"),

    # ── WWI Era ──────────────────────────────────────────────────────────
    ("russo-japanese-war-1905", "russian revolution 1905", "causes", 0.8,
     "Military defeat by Japan triggered 1905 Russian Revolution"),
    ("russo-japanese-war-1905", "meiji restoration", "context", 0.6,
     "Meiji modernization enabled Japanese military victory"),
    ("spanish flu pandemic-1918-detail", "armistice wwi", "context", 0.6,
     "Spanish Flu devastated troops and hastened war's end"),
    ("battle of verdun-1916", "battle somme-1916", "context", 0.8,
     "Simultaneous WWI battles of attrition in 1916"),
    ("battle of verdun-1916", "armistice wwi", "leads_to", 0.5,
     "Verdun's devastation drove momentum toward armistice"),
    ("dreyfus affair", "balfour declaration", "enables", 0.5,
     "Dreyfus Affair antisemitism motivated political Zionism leading to Balfour"),
    ("titanic sinks", "spanish flu pandemic-1918-detail", "context", 0.3,
     "Pre-war confidence shattered by disaster and pandemic"),

    # ── WWII / Cold War ──────────────────────────────────────────────────
    ("great depression-1929", "wall street crash", "context", 0.9,
     "Wall Street Crash triggered the Great Depression"),
    ("great depression-1929", "hitler appointed", "enables", 0.7,
     "Great Depression enabled Nazi rise to power"),
    ("hiroshima context decision", "manhattan project", "context", 0.9,
     "Manhattan Project produced the bombs used at Hiroshima"),
    ("hiroshima context decision", "cuban missile crisis", "leads_to", 0.5,
     "Nuclear weapons created the Cold War nuclear standoff"),
    ("cuban missile crisis resolution-1962-detail", "partial nuclear test ban", "causes", 0.7,
     "Cuban Missile Crisis near-catastrophe motivated arms control"),
    ("marshall plan us europe recovery-1948-detail", "nato", "leads_to", 0.6,
     "Marshall Plan's Western integration led to NATO alliance"),
    ("marshall plan us europe recovery-1948-detail", "eu maastricht treaty", "leads_to", 0.5,
     "Marshall Plan European cooperation evolved into EU"),
    ("stalin dies", "hungarian revolution", "enables", 0.6,
     "Stalin's death enabled de-Stalinization and Eastern European unrest"),
    ("stalin dies", "sino-soviet split", "enables", 0.5,
     "Stalin's death opened rifts in communist bloc"),
    ("battle gettysburg", "appomattox surrender civil war ends", "leads_to", 0.8,
     "Gettysburg turning point led to Union victory at Appomattox"),
    ("appomattox surrender civil war ends", "abolition slavery usa", "causes", 0.9,
     "Civil War's end enabled 13th Amendment abolishing slavery"),
    ("space race apollo-11", "sputnik", "context", 0.8,
     "Apollo 11 Moon landing was the culmination of the Space Race"),
    ("space race apollo-11", "voyager missions", "leads_to", 0.6,
     "Apollo program success led to ambitious Voyager missions"),
    ("vietnam war end-1975-saigon", "cambodia khmer rouge", "enables", 0.7,
     "US withdrawal from Vietnam enabled Khmer Rouge takeover"),
    ("indonesian independence", "bandung conference", "enables", 0.6,
     "Indonesian independence enabled hosting of Bandung Conference"),
    ("south africa apartheid ends", "mandela released", "context", 0.8,
     "Mandela's release and end of apartheid"),
    ("rwandan genocide detail", "congo", "enables", 0.5,
     "Rwandan genocide destabilized the Congo region"),
    ("spanish civil war-1936", "hitler appointed", "context", 0.5,
     "Nazi Germany supported Franco in the Spanish Civil War"),
    ("warsaw ghetto uprising", "concentration camps", "context", 0.6,
     "Warsaw Ghetto resistance during the Holocaust"),
    ("pinochet coup chile", "thatcher elected", "context", 0.3,
     "Neoliberal economic experiments in Chile influenced Thatcher"),

    # ── Opium Wars / China ───────────────────────────────────────────────
    ("opium wars-1839", "first opium war treaty nanjing", "context", 0.9,
     "First Opium War ended with Treaty of Nanjing"),
    ("second opium war", "boxer rebellion-1899", "leads_to", 0.6,
     "Humiliation from Opium Wars fueled anti-foreign Boxer Rebellion"),
    ("boxer rebellion-1899", "chinese revolution 1911", "leads_to", 0.6,
     "Boxer failure showed need for systemic change in China"),

    # ── Modern / Post-Cold War ───────────────────────────────────────────
    ("eu maastricht treaty", "euro currency launched", "causes", 0.9,
     "Maastricht Treaty created the framework for the Euro"),
    ("aids epidemic", "human genome", "enables", 0.4,
     "AIDS crisis accelerated genomic and medical research"),
    ("asian financial crisis", "global financial crisis", "context", 0.4,
     "Asian financial crisis foreshadowed 2008 global crisis"),
    ("indian ocean tsunami", "haiti earthquake", "context", 0.4,
     "Major natural disasters that reshaped international relief"),
    ("hurricane katrina", "indian ocean tsunami", "context", 0.4,
     "Major natural disasters of the 2000s"),

    # ── Cross-cutting connections ─────────────────────────────────────────
    ("black death kills europe-1347-second", "florentine renaissance", "enables", 0.6,
     "Black Death depopulation challenged medieval order, enabling Renaissance"),
    ("black death kills europe-1347-second", "printing revolution gutenberg", "enables", 0.4,
     "Labor shortage from plague drove demand for printing technology"),
    ("harlem renaissance", "civil rights act", "enables", 0.4,
     "Harlem Renaissance cultural achievements empowered civil rights"),
    ("locke two treatises", "american declaration independence", "enables", 0.7,
     "Locke's natural rights philosophy directly influenced Declaration"),
    ("locke two treatises", "declaration rights man", "enables", 0.6,
     "Locke's political philosophy influenced French revolutionaries"),
    ("kant critique pure reason", "darwin origin of species", "context", 0.3,
     "Enlightenment rational inquiry tradition preceded Darwinian science"),
    ("adam smith wealth of nations", "great depression-1929", "context", 0.3,
     "Free market capitalism evolved toward crisis"),
    ("adam smith wealth of nations", "california gold rush", "context", 0.3,
     "Capitalist economic framework shaped gold rush economics"),
    ("muhammad ali egypt modernization", "ottoman tanzimat reforms", "context", 0.6,
     "Contemporary modernization efforts in Ottoman/Egyptian world"),
    ("eiffel tower construction", "first film lumiere", "context", 0.5,
     "Late 19th century French cultural and technological achievements"),
    ("opening japan meiji constitution", "russo-japanese-war-1905", "enables", 0.7,
     "Meiji constitutional modernization enabled Japanese military power"),
    ("columbian-exchange-begins", "slave trade atlantic peak", "causes", 0.7,
     "Columbian Exchange plantation system drove peak slave trade"),
    ("battle of kadesh", "bronze age collapse", "context", 0.5,
     "Battle of Kadesh between major Bronze Age powers before collapse"),
    ("siege of samarkand", "mongols sack baghdad", "leads_to", 0.7,
     "Mongol conquest of Central Asia preceded Baghdad's destruction"),
    ("dead sea scrolls", "birth of jesus", "context", 0.5,
     "Dead Sea Scrolls reflect the Jewish religious context of Jesus' era"),
    ("prince shotoku constitution", "heian period tale genji", "leads_to", 0.5,
     "Shotoku's institutional reforms shaped Heian court culture"),
    ("sappho poetry lesbos", "virgil aeneid", "leads_to", 0.4,
     "Greek lyric poetry tradition influenced Roman literary culture"),

    # ── More isolated event connections ───────────────────────────────────
    ("columbian-exchange-begins", "aids epidemic", "context", 0.2,
     "Global interconnection from Columbian Exchange to modern pandemics"),
    ("penicillin discovered", "spanish flu pandemic-1918-detail", "context", 0.4,
     "Spanish Flu motivated medical research leading to antibiotics"),
    ("brazilian abolition-1888", "abolition slavery usa", "context", 0.6,
     "Americas-wide abolition movement from US to Brazil"),
    ("brazilian abolition-1888", "brazilian independence", "context", 0.5,
     "Brazilian independence and eventual abolition"),
    ("unification italy rome", "italian unification", "context", 0.9,
     "Capture of Rome completed Italian unification"),
    ("san francisco earthquake", "titanic sinks", "context", 0.3,
     "Pre-WWI era disasters that shaped safety regulations"),
    ("nafta takes effect", "eu maastricht treaty", "context", 0.4,
     "Contemporary trade bloc formations in 1990s"),
    ("higgs boson discovered", "human genome", "context", 0.3,
     "21st century scientific breakthroughs"),
    ("voyager missions", "space race apollo-11", "context", 0.6,
     "NASA's exploration program from Moon to deep space"),

    # ── Colonial / Independence chains ────────────────────────────────────
    ("battle plassey-1757", "amritsar massacre", "leads_to", 0.5,
     "British colonial control of India from Plassey to Amritsar"),
    ("battle plassey-1757", "indian independence", "leads_to", 0.4,
     "British colonial rule in India eventually led to independence"),
    ("belgian independence", "scramble for africa congo leopold", "enables", 0.5,
     "Independent Belgium under Leopold II seized the Congo"),
    ("scramble for africa congo leopold", "rwandan genocide detail", "enables", 0.4,
     "Belgian colonial ethnic categorization laid groundwork for genocide"),
]


async def main():
    conn = await asyncpg.connect(DB_URL)

    # ── Build lookup from DB ──────────────────────────────────────────
    rows = await conn.fetch("SELECT id, slug, title, year_approx FROM events")
    by_slug = {r['slug']: str(r['id']) for r in rows}
    by_title_lower = {}
    for r in rows:
        by_title_lower[r['title'].lower()] = str(r['id'])

    def find(keyword):
        """Find event UUID by slug or title substring."""
        if keyword in by_slug:
            return by_slug[keyword]
        kl = keyword.lower()
        if kl in by_title_lower:
            return by_title_lower[kl]
        # Try slug substring match
        for slug, eid in by_slug.items():
            if kl.replace(' ', '-') in slug or kl.replace(' ', '') in slug.replace('-', ''):
                return eid
        # Try title substring match
        for title, eid in by_title_lower.items():
            if kl in title:
                return eid
        return None

    # Map link types to DB enum values
    type_map = {
        'causes': 'direct',
        'leads_to': 'indirect',
        'enables': 'contributing',
        'context': 'contributing',
    }

    link_insert = """
        INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
        VALUES ($1, $2, $3, $4, $5, $6, 'enrich-script:batch3', 'approved')
        ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
    """

    print(f"Processing {len(LINKS)} causality links...")
    inserted = 0
    skipped = 0
    missed = 0

    for cause_kw, effect_kw, ltype, strength, desc in LINKS:
        db_type = type_map.get(ltype, ltype)
        cause_id = find(cause_kw)
        effect_id = find(effect_kw)
        if cause_id and effect_id and cause_id != effect_id:
            result = await conn.execute(
                link_insert, uuid.uuid4(),
                __import__('uuid').UUID(cause_id),
                __import__('uuid').UUID(effect_id),
                db_type, strength, desc
            )
            if 'INSERT 0 0' in result:
                skipped += 1
            else:
                inserted += 1
        else:
            missed += 1
            if not cause_id:
                print(f"  MISS cause: '{cause_kw}'")
            if not effect_id:
                print(f"  MISS effect: '{effect_kw}'")
            if cause_id and effect_id and cause_id == effect_id:
                print(f"  SELF-LINK: '{cause_kw}' == '{effect_kw}'")

    print(f"\nResults: {inserted} inserted, {skipped} duplicates, {missed} missed")

    # ── Final counts ──────────────────────────────────────────────────
    e = await conn.fetchval('SELECT COUNT(*) FROM events')
    l = await conn.fetchval('SELECT COUNT(*) FROM causality_links')
    iso = await conn.fetchval("""
        SELECT COUNT(*) FROM events e
        WHERE NOT EXISTS (
            SELECT 1 FROM causality_links cl
            WHERE cl.cause_event_id = e.id OR cl.effect_event_id = e.id
        )
    """)
    print(f"Final counts: Events={e}, Links={l}, Isolated={iso}")
    await conn.close()

if __name__ == '__main__':
    asyncio.run(main())
