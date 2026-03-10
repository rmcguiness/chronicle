"""Seed ~50 historical figures into the people table and link them to events."""

import uuid
import psycopg2
import psycopg2.extras

DSN = "host=db port=5432 dbname=chronicle user=chronicle password=chronicle"

# ──────────────────────────────────────────────────────────────────────
# People data
# ──────────────────────────────────────────────────────────────────────

PEOPLE = [
    # ── Ancient ──
    dict(name="Cleopatra VII", birth_year=-69, birth_year_circa=True, death_year=-30,
         nationalities=["Egyptian"], roles=["pharaoh", "ruler"], gender="F",
         wikidata_id="Q635", wikipedia_slug="Cleopatra",
         description="Last active ruler of the Ptolemaic Kingdom of Egypt, renowned for her political alliances with Julius Caesar and Mark Antony."),
    dict(name="Julius Caesar", birth_year=-100, death_year=-44,
         nationalities=["Roman"], roles=["general", "dictator", "statesman"], gender="M",
         wikidata_id="Q1048", wikipedia_slug="Julius_Caesar",
         description="Roman general and statesman who played a critical role in transforming the Roman Republic into the Roman Empire."),
    dict(name="Alexander the Great", birth_year=-356, death_year=-323,
         nationalities=["Macedonian", "Greek"], roles=["king", "military commander"], gender="M",
         wikidata_id="Q8409", wikipedia_slug="Alexander_the_Great",
         description="King of Macedon who created one of the largest empires in ancient history, stretching from Greece to northwestern India."),
    dict(name="Aristotle", birth_year=-384, death_year=-322,
         nationalities=["Greek"], roles=["philosopher", "scientist"], gender="M",
         wikidata_id="Q868", wikipedia_slug="Aristotle",
         description="Greek philosopher and polymath whose writings covered physics, biology, logic, ethics, and politics."),
    dict(name="Confucius", birth_year=-551, birth_year_circa=True, death_year=-479,
         nationalities=["Chinese"], roles=["philosopher", "teacher"], gender="M",
         wikidata_id="Q4604", wikipedia_slug="Confucius",
         description="Chinese philosopher whose teachings on ethics, family, and governance became the foundation of Confucianism."),
    dict(name="Ashoka", birth_year=-304, birth_year_circa=True, death_year=-232, death_year_circa=True,
         nationalities=["Indian"], roles=["emperor"], gender="M",
         wikidata_id="Q3882", wikipedia_slug="Ashoka",
         description="Maurya dynasty emperor who embraced Buddhism and spread its principles across the Indian subcontinent."),
    dict(name="Hannibal Barca", birth_year=-247, death_year=-183, death_year_circa=True,
         nationalities=["Carthaginian"], roles=["general", "military commander"], gender="M",
         wikidata_id="Q5823", wikipedia_slug="Hannibal",
         description="Carthaginian general who led a legendary crossing of the Alps to invade Italy during the Second Punic War."),
    dict(name="Augustus", birth_year=-63, death_year=14,
         nationalities=["Roman"], roles=["emperor", "statesman"], gender="M",
         wikidata_id="Q1405", wikipedia_slug="Augustus",
         description="First Roman emperor who transformed the Republic into the Empire and inaugurated the Pax Romana."),

    # ── Medieval ──
    dict(name="Charlemagne", birth_year=742, birth_year_circa=True, death_year=814,
         nationalities=["Frankish"], roles=["emperor", "king"], gender="M",
         wikidata_id="Q3044", wikipedia_slug="Charlemagne",
         description="King of the Franks and first Holy Roman Emperor, who united much of Western Europe during the early Middle Ages."),
    dict(name="Genghis Khan", birth_year=1162, birth_year_circa=True, death_year=1227,
         nationalities=["Mongolian"], roles=["emperor", "military commander"], gender="M",
         wikidata_id="Q720", wikipedia_slug="Genghis_Khan",
         description="Founder of the Mongol Empire, the largest contiguous land empire in history."),
    dict(name="Joan of Arc", birth_year=1412, birth_year_circa=True, death_year=1431,
         nationalities=["French"], roles=["military leader", "saint"], gender="F",
         wikidata_id="Q7226", wikipedia_slug="Joan_of_Arc",
         description="French peasant girl who led the French army to key victories during the Hundred Years' War before being burned at the stake."),
    dict(name="Saladin", birth_year=1137, birth_year_circa=True, death_year=1193,
         nationalities=["Kurdish", "Egyptian"], roles=["sultan", "military commander"], gender="M",
         wikidata_id="Q188835", wikipedia_slug="Saladin",
         description="First sultan of Egypt and Syria who led Muslim military campaigns during the Crusades, recapturing Jerusalem."),
    dict(name="Marco Polo", birth_year=1254, death_year=1324,
         nationalities=["Venetian", "Italian"], roles=["explorer", "merchant"], gender="M",
         wikidata_id="Q6101", wikipedia_slug="Marco_Polo",
         description="Venetian merchant and explorer whose travels to Asia were documented in The Travels of Marco Polo."),
    dict(name="Thomas Aquinas", birth_year=1225, death_year=1274,
         nationalities=["Italian"], roles=["philosopher", "theologian"], gender="M",
         wikidata_id="Q9438", wikipedia_slug="Thomas_Aquinas",
         description="Italian Dominican friar and theologian whose Summa Theologica became a foundational work of Western philosophy."),
    dict(name="Ibn Battuta", birth_year=1304, death_year=1369, death_year_circa=True,
         nationalities=["Moroccan"], roles=["explorer", "scholar"], gender="M",
         wikidata_id="Q7331", wikipedia_slug="Ibn_Battuta",
         description="Moroccan scholar and explorer who traveled over 70,000 miles across Africa, Asia, and Europe over three decades."),

    # ── Early Modern ──
    dict(name="Leonardo da Vinci", birth_year=1452, death_year=1519,
         nationalities=["Italian"], roles=["artist", "inventor", "scientist"], gender="M",
         wikidata_id="Q762", wikipedia_slug="Leonardo_da_Vinci",
         description="Italian Renaissance polymath known for the Mona Lisa and The Last Supper, as well as pioneering studies in anatomy and engineering."),
    dict(name="Michelangelo", birth_year=1475, death_year=1564,
         nationalities=["Italian"], roles=["artist", "sculptor", "architect"], gender="M",
         wikidata_id="Q5592", wikipedia_slug="Michelangelo",
         description="Italian sculptor, painter, and architect of the High Renaissance, best known for the Sistine Chapel ceiling and the statue of David."),
    dict(name="Nicolaus Copernicus", birth_year=1473, death_year=1543,
         nationalities=["Polish"], roles=["astronomer", "mathematician"], gender="M",
         wikidata_id="Q619", wikipedia_slug="Nicolaus_Copernicus",
         description="Polish astronomer who formulated the heliocentric model of the universe, placing the Sun rather than the Earth at its center."),
    dict(name="Galileo Galilei", birth_year=1564, death_year=1642,
         nationalities=["Italian"], roles=["astronomer", "physicist", "mathematician"], gender="M",
         wikidata_id="Q307", wikipedia_slug="Galileo_Galilei",
         description="Italian astronomer and physicist, called the father of modern science, who championed heliocentrism and made key telescopic observations."),
    dict(name="William Shakespeare", birth_year=1564, death_year=1616,
         nationalities=["English"], roles=["playwright", "poet", "actor"], gender="M",
         wikidata_id="Q692", wikipedia_slug="William_Shakespeare",
         description="English playwright and poet widely regarded as the greatest writer in the English language."),
    dict(name="Isaac Newton", birth_year=1643, death_year=1727,
         nationalities=["English"], roles=["physicist", "mathematician"], gender="M",
         wikidata_id="Q935", wikipedia_slug="Isaac_Newton",
         description="English mathematician and physicist who formulated the laws of motion, universal gravitation, and co-developed calculus."),
    dict(name="Christopher Columbus", birth_year=1451, death_year=1506,
         nationalities=["Genoese", "Italian"], roles=["explorer", "navigator"], gender="M",
         wikidata_id="Q7322", wikipedia_slug="Christopher_Columbus",
         description="Genoese navigator whose 1492 transatlantic voyage opened the way for European colonization of the Americas."),
    dict(name="Martin Luther", birth_year=1483, death_year=1546,
         nationalities=["German"], roles=["theologian", "reformer"], gender="M",
         wikidata_id="Q9554", wikipedia_slug="Martin_Luther",
         description="German theologian who initiated the Protestant Reformation by challenging the practices of the Catholic Church."),

    # ── 18th–19th Century ──
    dict(name="Napoleon Bonaparte", birth_year=1769, death_year=1821,
         nationalities=["French", "Corsican"], roles=["emperor", "military commander"], gender="M",
         wikidata_id="Q517", wikipedia_slug="Napoleon",
         description="French military leader and emperor who conquered much of Europe before his final defeat at Waterloo."),
    dict(name="George Washington", birth_year=1732, death_year=1799,
         nationalities=["American"], roles=["president", "general"], gender="M",
         wikidata_id="Q23", wikipedia_slug="George_Washington",
         description="Commander of the Continental Army during the American Revolution and first president of the United States."),
    dict(name="Abraham Lincoln", birth_year=1809, death_year=1865,
         nationalities=["American"], roles=["president", "lawyer"], gender="M",
         wikidata_id="Q91", wikipedia_slug="Abraham_Lincoln",
         description="16th president of the United States who preserved the Union during the Civil War and abolished slavery."),
    dict(name="Charles Darwin", birth_year=1809, death_year=1882,
         nationalities=["English"], roles=["naturalist", "biologist"], gender="M",
         wikidata_id="Q1035", wikipedia_slug="Charles_Darwin",
         description="English naturalist who developed the theory of evolution by natural selection, transforming modern biology."),
    dict(name="Karl Marx", birth_year=1818, death_year=1883,
         nationalities=["German"], roles=["philosopher", "economist", "revolutionary"], gender="M",
         wikidata_id="Q9061", wikipedia_slug="Karl_Marx",
         description="German philosopher and economist whose works, including Das Kapital, laid the theoretical groundwork for communism."),
    dict(name="Queen Victoria", birth_year=1819, death_year=1901,
         nationalities=["British"], roles=["queen", "empress"], gender="F",
         wikidata_id="Q9439", wikipedia_slug="Queen_Victoria",
         description="Queen of the United Kingdom whose 63-year reign oversaw the expansion of the British Empire and the Victorian era."),
    dict(name="Frederick Douglass", birth_year=1817, birth_year_circa=True, death_year=1895,
         nationalities=["American"], roles=["abolitionist", "orator", "writer"], gender="M",
         wikidata_id="Q215562", wikipedia_slug="Frederick_Douglass",
         description="American social reformer, abolitionist, and orator who escaped slavery to become a national leader of the abolitionist movement."),
    dict(name="Florence Nightingale", birth_year=1820, death_year=1910,
         nationalities=["British"], roles=["nurse", "social reformer", "statistician"], gender="F",
         wikidata_id="Q37103", wikipedia_slug="Florence_Nightingale",
         description="British nurse and social reformer who founded modern nursing during the Crimean War."),
    dict(name="Nikola Tesla", birth_year=1856, death_year=1943,
         nationalities=["Serbian", "American"], roles=["inventor", "electrical engineer"], gender="M",
         wikidata_id="Q9036", wikipedia_slug="Nikola_Tesla",
         description="Serbian-American inventor and engineer best known for designing the alternating-current electrical system."),
    dict(name="Marie Curie", birth_year=1867, death_year=1934,
         nationalities=["Polish", "French"], roles=["physicist", "chemist"], gender="F",
         wikidata_id="Q7186", wikipedia_slug="Marie_Curie",
         description="Polish-French physicist and chemist who conducted pioneering research on radioactivity and was the first woman to win a Nobel Prize."),

    # ── 20th Century ──
    dict(name="Albert Einstein", birth_year=1879, death_year=1955,
         nationalities=["German", "Swiss", "American"], roles=["physicist"], gender="M",
         wikidata_id="Q937", wikipedia_slug="Albert_Einstein",
         description="Theoretical physicist who developed the theory of relativity and won the Nobel Prize for his explanation of the photoelectric effect."),
    dict(name="Winston Churchill", birth_year=1874, death_year=1965,
         nationalities=["British"], roles=["prime minister", "statesman", "writer"], gender="M",
         wikidata_id="Q8016", wikipedia_slug="Winston_Churchill",
         description="British prime minister who led the United Kingdom through World War II with resolute wartime leadership."),
    dict(name="Franklin D. Roosevelt", birth_year=1882, death_year=1945,
         nationalities=["American"], roles=["president"], gender="M",
         wikidata_id="Q8007", wikipedia_slug="Franklin_D._Roosevelt",
         description="32nd president of the United States who led the country through the Great Depression and most of World War II."),
    dict(name="Mahatma Gandhi", birth_year=1869, death_year=1948,
         nationalities=["Indian"], roles=["activist", "political leader"], gender="M",
         wikidata_id="Q1001", wikipedia_slug="Mahatma_Gandhi",
         description="Indian independence leader who pioneered nonviolent civil disobedience, inspiring movements for civil rights worldwide."),
    dict(name="Adolf Hitler", birth_year=1889, death_year=1945,
         nationalities=["Austrian", "German"], roles=["dictator", "political leader"], gender="M",
         wikidata_id="Q352", wikipedia_slug="Adolf_Hitler",
         description="Leader of Nazi Germany whose aggressive expansionism and genocide of six million Jews led to World War II and the Holocaust."),
    dict(name="Mao Zedong", birth_year=1893, death_year=1976,
         nationalities=["Chinese"], roles=["chairman", "political leader", "revolutionary"], gender="M",
         wikidata_id="Q5816", wikipedia_slug="Mao_Zedong",
         description="Founding chairman of the People's Republic of China who led the Chinese Communist Revolution."),
    dict(name="Nelson Mandela", birth_year=1918, death_year=2013,
         nationalities=["South African"], roles=["president", "activist"], gender="M",
         wikidata_id="Q8023", wikipedia_slug="Nelson_Mandela",
         description="Anti-apartheid revolutionary and first Black president of South Africa, imprisoned for 27 years before leading the country's transition to democracy."),
    dict(name="Martin Luther King Jr.", birth_year=1929, death_year=1968,
         nationalities=["American"], roles=["civil rights leader", "minister"], gender="M",
         wikidata_id="Q8027", wikipedia_slug="Martin_Luther_King_Jr.",
         description="American civil rights leader who advanced nonviolent activism and delivered the iconic 'I Have a Dream' speech."),
    dict(name="Alan Turing", birth_year=1912, death_year=1954,
         nationalities=["British"], roles=["mathematician", "computer scientist", "cryptanalyst"], gender="M",
         wikidata_id="Q7251", wikipedia_slug="Alan_Turing",
         description="British mathematician who broke the Enigma code during World War II and laid the foundations of computer science."),
    dict(name="Simone de Beauvoir", birth_year=1908, death_year=1986,
         nationalities=["French"], roles=["philosopher", "writer", "feminist"], gender="F",
         wikidata_id="Q7197", wikipedia_slug="Simone_de_Beauvoir",
         description="French existentialist philosopher and feminist author of The Second Sex, a foundational text in feminist philosophy."),

    # ── Additional 20th Century ──
    dict(name="Frida Kahlo", birth_year=1907, death_year=1954,
         nationalities=["Mexican"], roles=["artist", "painter"], gender="F",
         wikidata_id="Q5588", wikipedia_slug="Frida_Kahlo",
         description="Mexican artist known for her vivid self-portraits and works inspired by Mexican folk art."),
    dict(name="Rosa Parks", birth_year=1913, death_year=2005,
         nationalities=["American"], roles=["civil rights activist"], gender="F",
         wikidata_id="Q41921", wikipedia_slug="Rosa_Parks",
         description="American civil rights activist whose refusal to give up her bus seat helped spark the Montgomery Bus Boycott."),

    # ── Additional Early Modern / 18th C ──
    dict(name="Elizabeth I", birth_year=1533, death_year=1603,
         nationalities=["English"], roles=["queen"], gender="F",
         wikidata_id="Q7207", wikipedia_slug="Elizabeth_I",
         description="Queen of England whose reign saw the defeat of the Spanish Armada and a flourishing of English arts and exploration."),
    dict(name="Johann Gutenberg", birth_year=1400, birth_year_circa=True, death_year=1468,
         nationalities=["German"], roles=["inventor", "printer"], gender="M",
         wikidata_id="Q8958", wikipedia_slug="Johannes_Gutenberg",
         description="German inventor of the movable-type printing press, which revolutionized the spread of knowledge in Europe."),
    dict(name="Ludwig van Beethoven", birth_year=1770, death_year=1827,
         nationalities=["German"], roles=["composer", "pianist"], gender="M",
         wikidata_id="Q255", wikipedia_slug="Ludwig_van_Beethoven",
         description="German composer and pianist who bridged the Classical and Romantic periods and continued composing after losing his hearing."),

    # ── Modern ──
    dict(name="Tim Berners-Lee", birth_year=1955,
         nationalities=["British"], roles=["computer scientist", "inventor"], gender="M",
         wikidata_id="Q80", wikipedia_slug="Tim_Berners-Lee",
         description="British computer scientist who invented the World Wide Web in 1989."),
    dict(name="Steve Jobs", birth_year=1955, death_year=2011,
         nationalities=["American"], roles=["entrepreneur", "inventor"], gender="M",
         wikidata_id="Q19837", wikipedia_slug="Steve_Jobs",
         description="Co-founder of Apple Inc. who revolutionized personal computing, music, and mobile phones."),
    dict(name="Malala Yousafzai", birth_year=1997,
         nationalities=["Pakistani"], roles=["activist", "Nobel laureate"], gender="F",
         wikidata_id="Q47aborr6", wikipedia_slug="Malala_Yousafzai",
         description="Pakistani activist for female education and the youngest Nobel Prize laureate."),
]

# Fix Malala's wikidata_id (typo guard)
for p in PEOPLE:
    if p["name"] == "Malala Yousafzai":
        p["wikidata_id"] = "Q47476"

# ──────────────────────────────────────────────────────────────────────
# Event keyword links: person name → [(keyword_for_event, role)]
# ──────────────────────────────────────────────────────────────────────

EVENT_LINKS = {
    "Cleopatra VII": [("Cleopatra", "leader"), ("Ptolem", "ruler"), ("Egypt%Rome", "ruler")],
    "Julius Caesar": [("Caesar", "leader"), ("Gallic", "commander"), ("Roman Republic", "leader")],
    "Alexander the Great": [("Alexander", "commander"), ("Macedon", "ruler"), ("Persian", "commander")],
    "Aristotle": [("Aristotle", "author"), ("Lyceum", "founder"), ("Greek philosophy", "philosopher")],
    "Confucius": [("Confuci", "founder"), ("Hundred Schools", "philosopher"), ("Spring and Autumn", "philosopher")],
    "Ashoka": [("Ashoka", "ruler"), ("Maurya", "emperor"), ("Kalinga", "commander")],
    "Hannibal Barca": [("Hannibal", "commander"), ("Punic", "commander"), ("Cannae", "commander")],
    "Augustus": [("Augustus", "ruler"), ("Roman Empire", "founder"), ("Pax Romana", "ruler")],
    "Charlemagne": [("Charlemagne", "ruler"), ("Carolingian", "ruler"), ("Holy Roman", "emperor")],
    "Genghis Khan": [("Genghis", "commander"), ("Mongol", "founder"), ("Mongol Empire", "ruler")],
    "Joan of Arc": [("Joan of Arc", "leader"), ("Hundred Years", "military leader"), ("Orléans", "leader")],
    "Saladin": [("Saladin", "commander"), ("Crusade", "commander"), ("Jerusalem%recapture", "commander")],
    "Marco Polo": [("Marco Polo", "explorer"), ("Silk Road", "traveler")],
    "Thomas Aquinas": [("Aquinas", "author"), ("Scholastic", "philosopher")],
    "Ibn Battuta": [("Ibn Battuta", "explorer"), ("Mali", "traveler")],
    "Leonardo da Vinci": [("Renaissance", "artist"), ("Leonardo", "artist"), ("Mona Lisa", "artist")],
    "Michelangelo": [("Michelangelo", "artist"), ("Sistine", "artist"), ("Renaissance", "artist")],
    "Nicolaus Copernicus": [("Copernicus", "author"), ("heliocentric", "scientist"), ("Scientific Revolution", "scientist")],
    "Galileo Galilei": [("Galileo", "scientist"), ("heliocentric", "scientist"), ("telescope", "inventor")],
    "William Shakespeare": [("Shakespeare", "author"), ("Globe Theatre", "author"), ("Elizabethan", "playwright")],
    "Isaac Newton": [("Newton", "scientist"), ("Principia", "author"), ("Scientific Revolution", "scientist")],
    "Christopher Columbus": [("Columbus", "explorer"), ("1492", "explorer"), ("Americas%discover", "explorer")],
    "Martin Luther": [("Luther%theses", "author"), ("Reformation", "leader"), ("Protestant", "founder")],
    "Napoleon Bonaparte": [("Napoleon", "commander"), ("Waterloo", "commander"), ("Napoleonic", "commander")],
    "George Washington": [("Washington", "leader"), ("American Revolution", "commander"), ("Independence%American", "leader")],
    "Abraham Lincoln": [("Lincoln", "leader"), ("Civil War%American", "leader"), ("Emancipation", "author"), ("abolition%slavery%United States", "leader")],
    "Charles Darwin": [("Darwin", "scientist"), ("Origin of Species", "author"), ("evolution", "scientist")],
    "Karl Marx": [("Marx", "author"), ("Communist Manifesto", "author"), ("socialism", "philosopher")],
    "Queen Victoria": [("Victoria", "ruler"), ("British Empire", "ruler"), ("Victorian", "ruler")],
    "Frederick Douglass": [("Douglass", "activist"), ("abolition", "activist"), ("slavery%America", "activist")],
    "Florence Nightingale": [("Nightingale", "nurse"), ("Crimean War", "nurse"), ("nursing", "founder")],
    "Nikola Tesla": [("Tesla", "inventor"), ("alternating current", "inventor"), ("electricity", "inventor")],
    "Marie Curie": [("Curie", "scientist"), ("radioactiv", "scientist"), ("Nobel%Curie", "laureate")],
    "Albert Einstein": [("Einstein", "scientist"), ("relativity", "scientist"), ("Manhattan Project", "scientist")],
    "Winston Churchill": [("Churchill", "leader"), ("World War II%Britain", "leader"), ("Battle of Britain", "leader")],
    "Franklin D. Roosevelt": [("Roosevelt%Franklin", "leader"), ("New Deal", "leader"), ("World War II%United States", "leader")],
    "Mahatma Gandhi": [("Gandhi", "leader"), ("Indian independence", "leader"), ("nonviolent", "leader")],
    "Adolf Hitler": [("Hitler", "leader"), ("Nazi", "leader"), ("World War II", "instigator"), ("Holocaust", "perpetrator")],
    "Mao Zedong": [("Mao", "leader"), ("Chinese Revolution", "leader"), ("People's Republic%China", "founder")],
    "Nelson Mandela": [("Mandela", "leader"), ("apartheid", "activist"), ("South Africa%democracy", "leader")],
    "Martin Luther King Jr.": [("Martin Luther King", "leader"), ("civil rights%movement", "leader"), ("I Have a Dream", "orator")],
    "Alan Turing": [("Turing", "scientist"), ("Enigma", "cryptanalyst"), ("computer%invent", "inventor")],
    "Simone de Beauvoir": [("Beauvoir", "author"), ("feminism", "philosopher"), ("existential", "philosopher")],
    "Frida Kahlo": [("Mexican%art", "artist"), ("Mexican Revolution", "witness")],
    "Rosa Parks": [("civil rights%movement", "activist"), ("Montgomery", "activist"), ("segregation", "activist")],
    "Elizabeth I": [("Elizabeth", "ruler"), ("Spanish Armada", "leader"), ("Elizabethan", "ruler")],
    "Johann Gutenberg": [("Gutenberg", "inventor"), ("printing press", "inventor"), ("movable type", "inventor")],
    "Ludwig van Beethoven": [("Beethoven", "composer"), ("Romantic%music", "composer")],
    "Tim Berners-Lee": [("World Wide Web", "inventor"), ("internet", "inventor"), ("Berners-Lee", "inventor")],
    "Steve Jobs": [("Apple%computer", "founder"), ("iPhone", "inventor"), ("personal computer", "entrepreneur")],
    "Malala Yousafzai": [("Malala", "activist"), ("education%girls", "activist")],
}


def main():
    conn = psycopg2.connect(DSN)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # ── Check existing people ──
    cur.execute("SELECT wikidata_id, id, name FROM people")
    existing = {r["wikidata_id"]: r for r in cur.fetchall()}

    people_inserted = 0
    people_skipped = 0
    person_ids = {}  # name → uuid

    for p in PEOPLE:
        wid = p.get("wikidata_id")
        if wid and wid in existing:
            person_ids[p["name"]] = existing[wid]["id"]
            people_skipped += 1
            continue

        pid = str(uuid.uuid4())
        cur.execute("""
            INSERT INTO people (id, name, aliases, birth_year, birth_year_circa,
                                death_year, death_year_circa, nationalities, roles,
                                gender, wikidata_id, wikipedia_slug, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (wikidata_id) DO NOTHING
            RETURNING id
        """, (
            pid,
            p["name"],
            p.get("aliases"),
            p.get("birth_year"),
            p.get("birth_year_circa", False),
            p.get("death_year"),
            p.get("death_year_circa", False),
            p.get("nationalities"),
            p.get("roles"),
            p.get("gender"),
            p.get("wikidata_id"),
            p.get("wikipedia_slug"),
            p.get("description"),
        ))
        row = cur.fetchone()
        if row:
            person_ids[p["name"]] = row["id"]
            people_inserted += 1
        else:
            people_skipped += 1

    print(f"People: {people_inserted} inserted, {people_skipped} skipped (already existed)")

    # ── Link people to events ──
    links_created = 0
    links_skipped = 0

    for person_name, keywords in EVENT_LINKS.items():
        pid = person_ids.get(person_name)
        if not pid:
            continue

        for keyword, role in keywords:
            # Build ILIKE query — support % in keyword for AND-style matching
            parts = keyword.split("%")
            where_clauses = " AND ".join(f"title ILIKE %s" for _ in parts)
            params = [f"%{part}%" for part in parts]

            cur.execute(
                f"SELECT id FROM events WHERE {where_clauses} LIMIT 1",
                params,
            )
            row = cur.fetchone()
            if not row:
                continue

            event_id = row["id"]
            cur.execute("""
                INSERT INTO event_people (event_id, person_id, role)
                VALUES (%s, %s, %s)
                ON CONFLICT (event_id, person_id, role) DO NOTHING
            """, (str(event_id), str(pid), role))

            if cur.rowcount > 0:
                links_created += 1
            else:
                links_skipped += 1

    print(f"Event links: {links_created} created, {links_skipped} skipped (already existed)")
    print(f"Total: {len(PEOPLE)} people defined, {people_inserted} new, {links_created} new links")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
