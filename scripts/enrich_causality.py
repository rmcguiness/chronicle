#!/usr/bin/env python3
"""
Enrich the Chronicle database with 200+ causality links and 50 new events.
Uses actual UUIDs from the existing event list and inserts new historically
significant events that are missing.
"""
import asyncio
import asyncpg
import uuid
import datetime

DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'

# ─── New Events (50) ─────────────────────────────────────────────────────────
# Format: (slug, title, year_approx, is_bce, event_category, importance_score, geo_modern, tags)
NEW_EVENTS = [
    ("peloponnesian-war-plague-athens", "Plague of Athens During the Peloponnesian War", -430, True, "natural", 0.65, "Athens, Greece", ["plague", "ancient-greece", "peloponnesian-war"]),
    ("philip-ii-macedon-expansion", "Philip II Unites Macedon and Conquers Greece", -338, True, "political", 0.7, "Pella, Greece", ["macedon", "ancient-greece", "conquest"]),
    ("library-of-alexandria-founded", "Library of Alexandria Founded — Ancient Knowledge Hub", -300, True, "cultural", 0.75, "Alexandria, Egypt", ["library", "scholarship", "hellenistic"]),
    ("punic-wars-second", "Second Punic War — Hannibal Crosses the Alps", -218, True, "war", 0.75, "Carthage, Tunisia", ["punic-wars", "hannibal", "rome"]),
    ("destruction-of-carthage", "Third Punic War — Rome Destroys Carthage", -146, True, "war", 0.7, "Carthage, Tunisia", ["punic-wars", "rome", "carthage"]),
    ("spartacus-slave-revolt", "Spartacus Slave Revolt Shakes Roman Republic", -73, True, "war", 0.6, "Capua, Italy", ["slavery", "revolt", "rome"]),
    ("pax-romana-begins", "Pax Romana — Two Centuries of Roman Peace", -27, True, "political", 0.8, "Rome, Italy", ["rome", "peace", "augustan-age"]),
    ("destruction-of-jerusalem-temple", "Roman Destruction of the Second Temple in Jerusalem", 70, False, "war", 0.75, "Jerusalem, Israel", ["rome", "judaism", "temple"]),
    ("constantine-founds-constantinople", "Constantine Founds Constantinople — New Rome", 330, False, "political", 0.8, "Istanbul, Turkey", ["rome", "byzantine", "constantinople"]),
    ("council-of-nicaea", "Council of Nicaea — Christian Doctrine Codified", 325, False, "cultural", 0.7, "Iznik, Turkey", ["christianity", "council", "doctrine"]),
    ("fall-of-han-dynasty", "Fall of the Han Dynasty — China Fragments", 220, False, "political", 0.7, "Luoyang, China", ["han-dynasty", "china", "collapse"]),
    ("parthian-empire-height", "Parthian Empire at Its Height — Rome's Eastern Rival", -100, True, "political", 0.65, "Ctesiphon, Iraq", ["parthia", "persia", "rome"]),
    ("sassanid-empire-founded", "Sassanid Empire Founded — Last Pre-Islamic Persian Empire", 224, False, "political", 0.7, "Ctesiphon, Iraq", ["persia", "sassanid", "empire"]),
    ("battle-of-yarmouk", "Battle of Yarmouk — Arab Conquest of the Levant", 636, False, "war", 0.7, "Yarmouk River, Jordan", ["islamic-conquest", "byzantine", "arab"]),
    ("abbasid-caliphate-founded", "Abbasid Caliphate Founded — Islamic Golden Age Begins", 750, False, "political", 0.8, "Baghdad, Iraq", ["abbasid", "caliphate", "islamic-golden-age"]),
    ("battle-of-manzikert", "Battle of Manzikert — Turks Defeat Byzantines", 1071, False, "war", 0.7, "Manzikert, Turkey", ["seljuk", "byzantine", "crusades-prelude"]),
    ("third-crusade", "Third Crusade — Richard the Lionheart vs. Saladin", 1191, False, "war", 0.65, "Acre, Israel", ["crusades", "richard", "saladin"]),
    ("mongol-sack-of-kiev", "Mongol Sack of Kiev — Europe Trembles", 1240, False, "war", 0.65, "Kyiv, Ukraine", ["mongol", "invasion", "eastern-europe"]),
    ("hundred-years-war-begins", "Hundred Years' War Begins — England vs. France", 1337, False, "war", 0.7, "London, England", ["hundred-years-war", "england", "france"]),
    ("ming-voyages-end", "Ming Dynasty Ends Maritime Voyages — China Turns Inward", 1433, False, "political", 0.65, "Nanjing, China", ["ming", "china", "isolationism"]),
    ("spanish-inquisition", "Spanish Inquisition Established", 1478, False, "political", 0.65, "Seville, Spain", ["inquisition", "spain", "religion"]),
    ("treaty-of-tordesillas", "Treaty of Tordesillas — Spain and Portugal Divide the World", 1494, False, "political", 0.7, "Tordesillas, Spain", ["colonialism", "spain", "portugal"]),
    ("diet-of-worms", "Diet of Worms — Luther Defies Emperor Charles V", 1521, False, "cultural", 0.65, "Worms, Germany", ["reformation", "luther", "protestantism"]),
    ("peace-of-augsburg", "Peace of Augsburg — Cuius Regio Eius Religio", 1555, False, "political", 0.65, "Augsburg, Germany", ["reformation", "peace", "holy-roman-empire"]),
    ("spanish-armada-defeated", "Spanish Armada Defeated — England Rules the Waves", 1588, False, "war", 0.7, "English Channel", ["spain", "england", "naval"]),
    ("english-civil-war", "English Civil War — Parliament vs. Crown", 1642, False, "war", 0.7, "London, England", ["civil-war", "england", "parliament"]),
    ("execution-of-charles-i", "Execution of King Charles I — English Republic", 1649, False, "political", 0.7, "London, England", ["civil-war", "republic", "england"]),
    ("seven-years-war", "Seven Years' War — The First True World War", 1756, False, "war", 0.75, "Europe", ["seven-years-war", "colonial", "global"]),
    ("american-revolution-begins", "American Revolution — Lexington and Concord", 1775, False, "war", 0.8, "Lexington, Massachusetts, USA", ["revolution", "america", "independence"]),
    ("reign-of-terror", "Reign of Terror — French Revolutionary Purges", 1793, False, "political", 0.7, "Paris, France", ["french-revolution", "terror", "robespierre"]),
    ("napoleonic-code", "Napoleonic Code — Modern Legal Framework", 1804, False, "political", 0.7, "Paris, France", ["napoleon", "law", "france"]),
    ("congress-of-berlin", "Congress of Berlin — Great Powers Redraw the Balkans", 1878, False, "political", 0.65, "Berlin, Germany", ["balkans", "diplomacy", "great-powers"]),
    ("boxer-rebellion", "Boxer Rebellion — China vs. Foreign Powers", 1900, False, "war", 0.6, "Beijing, China", ["china", "rebellion", "imperialism"]),
    ("russian-revolution-1905", "Russian Revolution of 1905 — Dress Rehearsal", 1905, False, "political", 0.65, "St. Petersburg, Russia", ["russia", "revolution", "tsar"]),
    ("chinese-revolution-1911", "Chinese Revolution — End of Imperial China", 1911, False, "political", 0.7, "Wuhan, China", ["china", "revolution", "republic"]),
    ("balfour-and-mandate", "British Mandate for Palestine Established", 1920, False, "political", 0.65, "Jerusalem, Palestine", ["palestine", "mandate", "british"]),
    ("great-depression-global", "Great Depression Spreads Globally", 1930, False, "political", 0.75, "New York, USA", ["depression", "economics", "global"]),
    ("long-march-china", "Long March — Mao's Communist Party Survives", 1934, False, "war", 0.65, "Yan'an, China", ["china", "communism", "mao"]),
    ("kristallnacht", "Kristallnacht — Night of Broken Glass", 1938, False, "war", 0.7, "Berlin, Germany", ["holocaust", "nazi", "antisemitism"]),
    ("bretton-woods", "Bretton Woods Conference — Global Financial Order", 1944, False, "political", 0.7, "Bretton Woods, New Hampshire, USA", ["economics", "imf", "world-bank"]),
    ("nato-warsaw-pact", "Warsaw Pact Founded — Iron Curtain Solidifies", 1955, False, "political", 0.65, "Warsaw, Poland", ["cold-war", "soviet", "military"]),
    ("suez-canal-nationalized", "Nasser Nationalizes the Suez Canal", 1956, False, "political", 0.65, "Cairo, Egypt", ["egypt", "suez", "nationalism"]),
    ("sino-soviet-split", "Sino-Soviet Split — Communist World Divides", 1961, False, "political", 0.6, "Beijing, China", ["cold-war", "china", "soviet"]),
    ("detente-era", "Détente — US-Soviet Relations Thaw", 1972, False, "political", 0.6, "Moscow, Russia", ["cold-war", "detente", "diplomacy"]),
    ("iranian-hostage-crisis", "Iranian Hostage Crisis — 444 Days", 1979, False, "political", 0.65, "Tehran, Iran", ["iran", "hostage", "revolution"]),
    ("falklands-war-context", "Argentina's Military Junta and the Dirty War", 1976, False, "political", 0.6, "Buenos Aires, Argentina", ["argentina", "junta", "dirty-war"]),
    ("internet-commercialized", "Internet Commercialized — Dot-Com Boom Begins", 1995, False, "discovery", 0.75, "San Francisco, USA", ["internet", "technology", "dot-com"]),
    ("euro-currency-launched", "Euro Currency Launched — European Monetary Union", 1999, False, "political", 0.65, "Brussels, Belgium", ["eu", "euro", "currency"]),
    ("invasion-of-iraq-2003", "US Invasion of Iraq — Regime Change War", 2003, False, "war", 0.75, "Baghdad, Iraq", ["iraq", "war", "regime-change"]),
    ("arab-spring-syria", "Syrian Civil War Begins — Arab Spring's Deadliest Chapter", 2011, False, "war", 0.7, "Damascus, Syria", ["syria", "civil-war", "arab-spring"]),
]


async def main():
    conn = await asyncpg.connect(DB_URL)

    # ── Insert new events ──────────────────────────────────────────────────
    print("Inserting new events...")
    event_insert = """
        INSERT INTO events (id, slug, title, year_approx, is_bce, event_category, importance_score, geo_modern, tags, date_earliest, date_latest, created_by, review_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'enrich-script:v1', 'approved')
        ON CONFLICT (slug) DO NOTHING
    """
    new_event_ids = {}
    for slug, title, year, is_bce, cat, score, geo, tags in NEW_EVENTS:
        eid = uuid.uuid4()
        new_event_ids[slug] = str(eid)
        # Compute date_earliest/date_latest from year_approx
        # For BCE years stored as negative, actual year is abs(year)
        if is_bce:
            # Use year 1 as proxy for very old dates (PostgreSQL date limits)
            de = datetime.date(1, 1, 1)
            dl = datetime.date(1, 12, 31)
        else:
            de = datetime.date(max(1, year), 1, 1)
            dl = datetime.date(max(1, year), 12, 31)
        await conn.execute(event_insert, eid, slug, title, year, is_bce, cat, score, geo, tags, de, dl)
    print(f"  Attempted {len(NEW_EVENTS)} new events")

    # ── Build lookup from DB ───────────────────────────────────────────────
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
        for title, eid in by_title_lower.items():
            if kl in title:
                return eid
        return None

    # ── Define causality links ─────────────────────────────────────────────
    # Format: (cause_keyword, effect_keyword, link_type, strength, description)
    LINKS = [
        # Ancient foundations
        ("cuneiform", "phoenician alphabet", "leads_to", 0.6, "Sumerian writing systems evolved into alphabetic scripts"),
        ("cuneiform", "hammurabi", "enables", 0.7, "Writing enabled codification of law"),
        ("narmer", "great pyramid", "leads_to", 0.7, "Unified Egypt enabled monumental construction"),
        ("great pyramid", "indus valley", "context", 0.3, "Contemporary Bronze Age civilizations"),
        ("bronze age collapse", "phoenician alphabet", "enables", 0.5, "Collapse of palace economies enabled simpler alphabetic trade"),
        ("trojan war", "bronze age collapse", "context", 0.5, "Trojan War occurred during the collapse period"),
        ("shang dynasty", "qin shi huang", "leads_to", 0.5, "Chinese civilization continuity from Shang to Qin"),
        ("olmec", "aztec", "leads_to", 0.5, "Olmec as mother culture influenced later Mesoamerican civs"),

        # Classical Greece chain
        ("cyrus the great", "marathon", "causes", 0.8, "Persian Empire expansion led to Greek-Persian wars"),
        ("marathon", "thermopylae", "leads_to", 0.9, "First Persian invasion led to second"),
        ("thermopylae", "athenian democracy", "enables", 0.5, "Greek victory preserved democratic Athens"),
        ("athenian democracy", "peloponnesian", "context", 0.6, "Athenian democracy and empire provoked Sparta"),
        ("peloponnesian", "death of socrates", "leads_to", 0.6, "Post-war Athens tried Socrates"),
        ("peloponnesian", "philip ii", "enables", 0.7, "Greek exhaustion enabled Macedonian rise"),
        ("philip ii", "alexander", "causes", 0.9, "Philip unified Greece; Alexander launched conquests"),
        ("alexander", "gaugamela", "causes", 0.9, "Alexander's campaign culminated at Gaugamela"),
        ("gaugamela", "library of alexandria", "enables", 0.7, "Hellenistic world enabled Ptolemaic scholarship"),
        ("gaugamela", "maurya empire", "enables", 0.5, "Alexander's withdrawal from India enabled Chandragupta"),
        ("plague of athens", "peloponnesian", "context", 0.6, "Plague weakened Athens during the war"),

        # Roman chain
        ("founding of the roman republic", "punic", "leads_to", 0.6, "Roman Republic expansion led to Punic Wars"),
        ("first punic war", "second punic war", "causes", 0.9, "First Punic War directly caused the second"),
        ("second punic war", "destruction of carthage", "causes", 0.8, "Roman fear after Hannibal led to Carthage's destruction"),
        ("destruction of carthage", "spartacus", "context", 0.4, "Roman expansion brought massive slavery"),
        ("spartacus", "caesar crosses", "context", 0.4, "Late Republic instability"),
        ("caesar crosses", "assassination of julius caesar", "causes", 0.9, "Caesar's dictatorship led to his assassination"),
        ("assassination of julius caesar", "battle of actium", "causes", 0.9, "Power vacuum after Caesar led to civil wars"),
        ("battle of actium", "pax romana", "causes", 0.9, "Octavian's victory established the Principate"),
        ("pax romana", "trajan", "leads_to", 0.7, "Pax Romana enabled greatest territorial extent"),
        ("trajan", "edict of milan", "leads_to", 0.5, "Roman institutional continuity"),
        ("destruction of jerusalem", "birth of jesus", "context", 0.6, "Christianity spread after Temple destruction"),
        ("birth of jesus", "edict of milan", "leads_to", 0.7, "Christianity grew until legalized by Constantine"),
        ("edict of milan", "council of nicaea", "causes", 0.9, "Legalization led to doctrinal codification"),
        ("council of nicaea", "constantine founds constantinople", "context", 0.7, "Constantine's Christian empire centered on new capital"),
        ("constantine founds constantinople", "fall of the western roman", "context", 0.6, "Eastern capital survived as west fell"),

        # Fall of Rome chain
        ("attila", "visigoths sack rome", "context", 0.5, "Hunnic pressure pushed Germanic tribes into Rome"),
        ("visigoths sack rome", "fall of the western roman", "causes", 0.8, "Sack of Rome 410 presaged the fall"),
        ("fall of the western roman", "justinian", "leads_to", 0.7, "Eastern Empire tried to reconquer under Justinian"),
        ("plague of justinian", "islamic conquests", "enables", 0.6, "Plague weakened Byzantine and Sassanid empires"),
        ("fall of the western roman", "charlemagne", "leads_to", 0.6, "Frankish kingdoms filled the power vacuum"),
        ("fall of the western roman", "viking raids", "context", 0.5, "Decentralized Europe was vulnerable to raids"),

        # Asian empires
        ("fall of han", "tang dynasty", "leads_to", 0.5, "Centuries of fragmentation preceded Tang reunification"),
        ("tang dynasty", "song dynasty", "leads_to", 0.7, "Tang achievements built foundation for Song innovations"),
        ("song dynasty", "compass", "enables", 0.7, "Song Dynasty technological innovation"),
        ("song dynasty", "gutenberg", "context", 0.4, "Chinese printing influenced/preceded European printing"),
        ("qin shi huang", "great wall", "causes", 0.9, "Qin began Great Wall construction"),
        ("qin shi huang", "han dynasty", "leads_to", 0.8, "Qin collapse led to Han founding"),
        ("han dynasty", "silk road", "enables", 0.8, "Han expansion opened the Silk Road"),
        ("silk road", "black death", "enables", 0.5, "Trade routes spread plague"),
        ("parthian empire", "sassanid empire", "leads_to", 0.8, "Sassanids overthrew Parthians"),
        ("sassanid empire", "battle of yarmouk", "context", 0.6, "Sassanid-Byzantine wars weakened both for Arab conquest"),

        # Islamic expansion
        ("prophet muhammad", "islamic conquests", "causes", 0.9, "Muhammad's teachings launched Islamic expansion"),
        ("islamic conquests", "battle of tours", "leads_to", 0.8, "Islamic expansion into Europe checked at Tours"),
        ("islamic conquests", "battle of yarmouk", "causes", 0.9, "Early Islamic conquests included Yarmouk"),
        ("islamic conquests", "abbasid caliphate", "leads_to", 0.7, "Umayyad caliphate preceded Abbasid revolution"),
        ("abbasid caliphate", "house of wisdom", "causes", 0.9, "Abbasid patronage created Baghdad's House of Wisdom"),
        ("house of wisdom", "al-khwarizmi", "enables", 0.9, "House of Wisdom enabled mathematical advances"),
        ("house of wisdom", "avicenna", "enables", 0.8, "Islamic Golden Age scholarship"),
        ("house of wisdom", "averroes", "enables", 0.7, "Islamic preservation of Greek philosophy"),
        ("averroes", "florentine renaissance", "enables", 0.6, "Aristotelian revival transmitted through Islamic scholars"),
        ("al-khwarizmi", "copernicus", "enables", 0.4, "Islamic mathematics influenced European science"),

        # Mongol chain
        ("genghis khan", "mongols sack baghdad", "causes", 0.9, "Mongol conquests destroyed Abbasid Caliphate"),
        ("genghis khan", "mongol sack of kiev", "causes", 0.9, "Mongol western campaign sacked Kiev"),
        ("genghis khan", "mongol invasions of japan", "leads_to", 0.8, "Mongol expansion attempted Japan"),
        ("mongols sack baghdad", "black death", "enables", 0.6, "Mongol destruction and trade disruption spread plague"),
        ("mongol sack of kiev", "black death", "enables", 0.5, "Mongol campaigns may have spread plague westward"),

        # Crusades chain
        ("battle of manzikert", "first crusade", "causes", 0.8, "Seljuk victory prompted Byzantine call for help"),
        ("first crusade", "captures jerusalem", "causes", 0.9, "First Crusade culminated in Jerusalem's capture"),
        ("captures jerusalem", "saladin recaptures", "causes", 0.8, "Crusader states provoked Saladin's reconquest"),
        ("saladin recaptures", "third crusade", "causes", 0.9, "Loss of Jerusalem triggered Third Crusade"),
        ("third crusade", "fourth crusade sacks", "leads_to", 0.6, "Crusading movement continued but went astray"),
        ("fourth crusade sacks", "fall of constantinople", "enables", 0.7, "1204 sack fatally weakened Byzantium"),

        # Black Death → Renaissance chain
        ("black death arrives", "florentine renaissance", "enables", 0.7, "Plague depopulation raised wages and challenged medieval worldview"),
        ("black death pandemic", "hundred years war", "context", 0.5, "Plague interrupted and shaped the Hundred Years' War"),
        ("hundred years war", "joan of arc", "causes", 0.9, "Hundred Years' War context for Joan of Arc"),
        ("joan of arc", "agincourt", "context", 0.5, "Key battles of the Hundred Years' War"),
        ("black death", "printing press", "enables", 0.4, "Labor shortage drove demand for labor-saving technology"),

        # Renaissance → Reformation → Scientific Revolution
        ("florentine renaissance", "gutenberg", "context", 0.5, "Renaissance culture and printing revolution overlapped"),
        ("gutenberg", "luther", "enables", 0.9, "Printing press enabled rapid spread of Reformation ideas"),
        ("gutenberg", "copernicus", "enables", 0.6, "Printing enabled scientific publication"),
        ("luther", "diet of worms", "causes", 0.9, "Luther's theses led to imperial trial"),
        ("diet of worms", "peace of augsburg", "leads_to", 0.7, "Religious conflict resolved temporarily at Augsburg"),
        ("peace of augsburg", "thirty years", "context", 0.7, "Augsburg settlement broke down leading to Thirty Years' War"),
        ("luther", "council of trent", "causes", 0.8, "Reformation provoked Catholic Counter-Reformation"),
        ("luther", "thirty years", "enables", 0.7, "Reformation religious divisions led to Thirty Years' War"),
        ("thirty years", "treaty of westphalia", "causes", 0.95, "Thirty Years' War ended with Westphalia"),
        ("treaty of westphalia", "glorious revolution", "context", 0.4, "Westphalian sovereignty concepts influenced English politics"),

        # Age of Exploration
        ("fall of constantinople", "dias", "enables", 0.7, "Ottoman control of trade routes pushed exploration"),
        ("fall of constantinople", "columbus", "enables", 0.6, "Need for new trade routes to Asia"),
        ("dias", "vasco da gama", "causes", 0.9, "Dias rounding the Cape led to da Gama reaching India"),
        ("columbus", "columbian exchange", "causes", 0.95, "Columbus initiated the Columbian Exchange"),
        ("columbus", "treaty of tordesillas", "causes", 0.8, "Columbus's discovery prompted Spain-Portugal division"),
        ("columbus", "magellan", "enables", 0.7, "Columbus inspired further exploration voyages"),
        ("columbus", "conquest of the aztec", "enables", 0.8, "Columbus opened the Americas to Spanish conquest"),
        ("conquest of the aztec", "pizarro", "leads_to", 0.8, "Aztec conquest inspired and enabled Inca conquest"),
        ("columbian exchange", "transatlantic slave", "enables", 0.7, "New World plantations drove slave trade"),
        ("vasco da gama", "battle of plassey", "leads_to", 0.5, "Portuguese trade route led to European colonization of India"),
        ("treaty of tordesillas", "transatlantic slave", "context", 0.4, "Colonial division enabled exploitation"),
        ("ming voyages end", "columbus", "context", 0.4, "China's withdrawal left maritime exploration to Europeans"),
        ("spanish armada", "dutch east india", "enables", 0.6, "Spanish defeat enabled Dutch maritime rise"),

        # Scientific Revolution chain
        ("copernicus", "galileo", "enables", 0.9, "Heliocentric theory was confirmed by Galileo"),
        ("copernicus", "kepler", "enables", 0.9, "Copernican model refined by Kepler's laws"),
        ("galileo", "galileo before the inquisition", "causes", 0.9, "Galileo's observations led to church trial"),
        ("galileo", "newton", "enables", 0.8, "Galileo's mechanics led to Newton's laws"),
        ("kepler", "newton", "enables", 0.8, "Kepler's laws unified by Newton's gravitation"),
        ("newton", "lavoisier", "enables", 0.5, "Newtonian method influenced chemistry"),
        ("harvey", "pasteur", "enables", 0.5, "Harvey's circulation studies pioneered physiology"),
        ("vesalius", "harvey", "enables", 0.7, "Vesalius's anatomy enabled Harvey's circulation discovery"),
        ("maxwell", "einstein", "enables", 0.8, "Maxwell's equations led to special relativity"),

        # English political chain
        ("magna carta", "english civil war", "enables", 0.5, "Magna Carta precedent for parliamentary rights"),
        ("english civil war", "execution of charles i", "causes", 0.95, "Civil War led to king's execution"),
        ("execution of charles i", "glorious revolution", "leads_to", 0.7, "Republican experiment led to constitutional settlement"),
        ("glorious revolution", "english bill of rights", "causes", 0.95, "Glorious Revolution produced Bill of Rights"),
        ("english bill of rights", "american declaration", "enables", 0.7, "English rights traditions influenced American founders"),
        ("glorious revolution", "enlightenment", "enables", 0.5, "Constitutional monarchy inspired Enlightenment thinkers"),

        # Enlightenment → Revolutions
        ("enlightenment", "american declaration", "enables", 0.8, "Enlightenment ideas of natural rights"),
        ("enlightenment", "french revolution", "enables", 0.8, "Voltaire, Rousseau inspired revolution"),
        ("seven years war", "american revolution", "causes", 0.7, "British debt from Seven Years' War taxed colonies"),
        ("american revolution", "american declaration", "causes", 0.9, "Revolution produced Declaration"),
        ("american declaration", "constitutional convention", "causes", 0.9, "Independence led to constitution-making"),
        ("constitutional convention", "bill of rights", "causes", 0.9, "Constitution ratification required Bill of Rights"),
        ("american declaration", "french revolution", "enables", 0.6, "American success inspired French revolutionaries"),
        ("french revolution", "declaration of the rights of man", "causes", 0.95, "Revolution produced Rights of Man"),
        ("french revolution", "reign of terror", "causes", 0.9, "Revolution radicalized into Terror"),
        ("reign of terror", "napoleon", "enables", 0.7, "Revolutionary chaos enabled Napoleon's rise"),
        ("french revolution", "haitian revolution", "enables", 0.8, "French revolutionary ideals spread to Haiti"),
        ("haitian revolution", "bolívar", "enables", 0.5, "First Black republic inspired Latin American independence"),

        # Napoleonic chain
        ("napoleon", "napoleonic code", "causes", 0.9, "Napoleon codified French law"),
        ("napoleon", "austerlitz", "causes", 0.9, "Napoleon's greatest victory"),
        ("napoleon", "waterloo", "causes", 0.9, "Napoleon's final defeat"),
        ("waterloo", "congress of vienna", "causes", 0.9, "Napoleon's defeat led to European settlement"),
        ("congress of vienna", "revolutions of 1848", "context", 0.6, "Vienna settlement's conservatism provoked 1848"),
        ("napoleonic code", "italian unification", "enables", 0.5, "Napoleonic reforms planted nationalist seeds in Italy"),
        ("revolutions of 1848", "italian unification", "enables", 0.6, "1848 revolutions advanced Italian nationalism"),
        ("revolutions of 1848", "german unification", "enables", 0.6, "1848 revolutions advanced German nationalism"),
        ("revolutions of 1848", "communist manifesto", "context", 0.7, "Marx published during 1848 revolutions"),

        # Industrial Revolution chain
        ("watt's steam engine", "darwin's voyage", "enables", 0.3, "Steam power enabled global scientific voyages"),
        ("watt's steam engine", "suez canal", "enables", 0.5, "Industrial technology enabled canal construction"),
        ("watt's steam engine", "wright brothers", "leads_to", 0.4, "Engine technology led to powered flight"),
        ("darwin", "origin of species", "causes", 0.95, "Beagle voyage led to evolutionary theory"),
        ("pasteur", "jenner", "context", 0.4, "Germ theory validated vaccination approach"),
        ("jenner", "salk polio", "leads_to", 0.5, "Vaccination principle from smallpox to polio"),

        # Late 19th century chains
        ("german unification", "scramble for africa", "enables", 0.5, "United Germany competed for colonies"),
        ("scramble for africa", "battle of adwa", "causes", 0.8, "Italian colonial ambitions led to Ethiopian resistance"),
        ("scramble for africa", "african national congress", "leads_to", 0.6, "Colonial oppression led to liberation movements"),
        ("meiji restoration", "russo-japanese war", "enables", 0.8, "Modernized Japan defeated Russia"),
        ("commodore perry", "meiji restoration", "causes", 0.9, "Perry's opening forced Japan to modernize"),
        ("opium wars", "boxer rebellion", "leads_to", 0.7, "Humiliation from Opium Wars fueled anti-foreign sentiment"),
        ("boxer rebellion", "chinese revolution 1911", "leads_to", 0.6, "Failed rebellion showed need for regime change"),
        ("chinese revolution 1911", "long march", "leads_to", 0.5, "Republic's failures led to Communist movement"),

        # Road to WWI
        ("german unification", "franz ferdinand", "enables", 0.5, "German power shifted European balance"),
        ("congress of berlin", "franz ferdinand", "enables", 0.5, "Balkan tensions from Berlin settlement"),
        ("russo-japanese war", "russian revolution 1905", "causes", 0.7, "Military defeat triggered revolution"),
        ("russian revolution 1905", "russian revolution", "enables", 0.7, "1905 was dress rehearsal for 1917"),
        ("franz ferdinand", "ultimatum to serbia", "causes", 0.95, "Assassination triggered the ultimatum"),
        ("ultimatum to serbia", "germany declares war", "causes", 0.9, "Alliance system activated"),
        ("germany declares war", "germany invades belgium", "causes", 0.9, "Schlieffen Plan implementation"),
        ("germany invades belgium", "first battle of the marne", "causes", 0.9, "Invasion led to first major battle"),
        ("first battle of the marne", "trench", "causes", 0.8, "Marne stalemate led to trench warfare"),
        ("trench", "verdun", "leads_to", 0.8, "Trench warfare's bloodiest expression"),
        ("trench", "somme", "leads_to", 0.8, "Major trench warfare battle"),
        ("trench", "poison gas", "enables", 0.7, "Stalemate drove chemical weapons use"),
        ("gallipoli", "sykes-picot", "context", 0.4, "Ottoman front shaped postwar Middle East plans"),
        ("united states enters", "armistice", "causes", 0.7, "US entry tipped the balance"),

        # WWI aftermath
        ("armistice", "spanish flu", "context", 0.6, "Troop movements spread the pandemic"),
        ("armistice", "treaty of versailles", "causes", 0.95, "Armistice led to peace negotiations"),
        ("treaty of versailles", "league of nations", "causes", 0.9, "Versailles created the League"),
        ("treaty of versailles", "weimar hyperinflation", "causes", 0.8, "Reparations caused economic crisis"),
        ("weimar hyperinflation", "beer hall putsch", "enables", 0.7, "Economic crisis fueled Nazi rise"),
        ("beer hall putsch", "hitler appointed", "leads_to", 0.7, "Early Nazi movement led to power"),
        ("treaty of versailles", "hitler appointed", "enables", 0.6, "Versailles grievances exploited by Hitler"),
        ("russian revolution", "october revolution", "causes", 0.9, "February revolution led to October"),
        ("october revolution", "russian civil war", "causes", 0.9, "Bolshevik seizure provoked civil war"),
        ("sykes-picot", "balfour declaration", "context", 0.7, "Wartime Middle East promises"),
        ("balfour declaration", "british mandate", "causes", 0.8, "Balfour promise formalized in mandate"),
        ("british mandate", "state of israel", "causes", 0.8, "Mandate period led to Israeli independence"),
        ("ottoman empire", "sykes-picot", "enables", 0.6, "Ottoman dissolution enabled partition"),

        # Road to WWII
        ("wall street crash", "great depression global", "causes", 0.95, "US crash spread globally"),
        ("great depression global", "hitler appointed", "enables", 0.8, "Depression enabled Nazi rise"),
        ("hitler appointed", "nuremberg laws", "causes", 0.9, "Nazi power led to antisemitic laws"),
        ("nuremberg laws", "kristallnacht", "causes", 0.8, "Escalating persecution"),
        ("kristallnacht", "wannsee", "leads_to", 0.7, "Escalation toward Final Solution"),
        ("hitler appointed", "spanish civil war", "enables", 0.5, "Nazi Germany supported Franco"),
        ("hitler appointed", "anschluss", "causes", 0.9, "Hitler annexed Austria"),
        ("anschluss", "munich agreement", "causes", 0.8, "Anschluss emboldened further expansion"),
        ("munich agreement", "molotov-ribbentrop", "leads_to", 0.6, "Appeasement failure led to Nazi-Soviet pact"),
        ("molotov-ribbentrop", "germany invades poland", "causes", 0.9, "Pact enabled invasion of Poland"),

        # WWII chain
        ("germany invades poland", "fall of france", "leads_to", 0.8, "Western front campaign"),
        ("germany invades poland", "battle of britain", "leads_to", 0.7, "After Poland, Germany targeted Britain"),
        ("fall of france", "operation barbarossa", "enables", 0.6, "Western victory freed Germany to attack east"),
        ("operation barbarossa", "stalingrad", "causes", 0.8, "Eastern front led to Stalingrad"),
        ("pearl harbor", "midway", "causes", 0.9, "Pacific war escalation"),
        ("pearl harbor", "manhattan project", "enables", 0.6, "Pearl Harbor accelerated atomic bomb program"),
        ("stalingrad", "d-day", "context", 0.5, "Eastern front success enabled western invasion"),
        ("d-day", "liberation of paris", "causes", 0.9, "Normandy invasion liberated France"),
        ("d-day", "germany surrenders", "leads_to", 0.8, "D-Day began liberation of Europe"),
        ("manhattan project", "hiroshima", "causes", 0.95, "Manhattan Project produced the bombs"),
        ("hiroshima", "united nations", "enables", 0.6, "Nuclear horror motivated international cooperation"),
        ("wannsee", "concentration camps", "causes", 0.9, "Final Solution implemented in camps"),
        ("concentration camps", "nuremberg trials", "causes", 0.9, "Holocaust led to war crimes trials"),
        ("germany surrenders", "nuremberg trials", "causes", 0.9, "Victory enabled justice"),
        ("bretton woods", "marshall plan", "enables", 0.7, "Bretton Woods framework enabled Marshall Plan"),

        # Cold War chain
        ("hiroshima", "hydrogen bomb", "leads_to", 0.8, "Nuclear arms race escalation"),
        ("hiroshima", "sputnik", "enables", 0.5, "Nuclear competition drove missile/space technology"),
        ("marshall plan", "nato", "leads_to", 0.7, "Western integration led to military alliance"),
        ("nato", "warsaw pact", "causes", 0.9, "NATO prompted Soviet counter-alliance"),
        ("berlin blockade", "nato", "causes", 0.7, "Berlin crisis accelerated NATO formation"),
        ("berlin blockade", "berlin wall", "leads_to", 0.6, "Berlin tensions culminated in the Wall"),
        ("korean war", "korean war armistice", "causes", 0.95, "War ended in armistice"),
        ("chinese communist revolution", "korean war", "enables", 0.6, "Communist China intervened in Korea"),
        ("chinese communist revolution", "great leap forward", "causes", 0.8, "Mao's policies"),
        ("great leap forward", "cultural revolution", "leads_to", 0.7, "GLF failure led to Cultural Revolution"),
        ("sputnik", "gagarin", "causes", 0.9, "Soviet space program achievements"),
        ("sputnik", "apollo 11", "causes", 0.8, "Space race from Sputnik to Moon"),
        ("cuban revolution", "bay of pigs", "causes", 0.9, "Castro's revolution provoked US invasion attempt"),
        ("bay of pigs", "cuban missile crisis", "causes", 0.8, "Failed invasion led to missile crisis"),
        ("cuban missile crisis", "partial nuclear test ban", "causes", 0.7, "Near-catastrophe motivated arms control"),
        ("suez crisis", "suez canal nationalized", "context", 0.8, "Nasser's nationalization triggered crisis"),
        ("suez crisis", "ghana independence", "enables", 0.5, "British imperial decline accelerated decolonization"),
        ("ghana independence", "year of africa", "leads_to", 0.8, "Ghana inspired wave of independence"),
        ("year of africa", "congo", "context", 0.8, "Congo independence part of 1960 wave"),
        ("hungarian revolution", "prague spring", "context", 0.5, "Eastern European resistance to Soviet control"),
        ("sino-soviet split", "nixon opens", "enables", 0.7, "Sino-Soviet rift enabled US-China rapprochement"),
        ("nixon opens", "détente", "leads_to", 0.7, "China opening part of broader détente"),

        # Vietnam chain
        ("dien bien phu", "tet offensive", "leads_to", 0.6, "French defeat led to US involvement"),
        ("tet offensive", "fall of saigon", "leads_to", 0.7, "Tet turned US opinion, leading to withdrawal"),
        ("fall of saigon", "khmer rouge", "enables", 0.6, "US withdrawal enabled Khmer Rouge"),

        # Decolonization
        ("gandhi", "indian independence", "causes", 0.8, "Gandhi's movement led to independence"),
        ("indian independence", "bandung conference", "enables", 0.6, "Indian independence inspired Non-Aligned Movement"),
        ("algerian war", "algerian independence", "causes", 0.95, "War won independence"),
        ("mau mau", "year of africa", "context", 0.5, "Kenyan resistance part of decolonization wave"),

        # Late Cold War → End
        ("soviet invasion of afghanistan", "reagan-gorbachev", "enables", 0.5, "Afghan quagmire weakened USSR"),
        ("iranian revolution", "iranian hostage crisis", "causes", 0.9, "Revolution led to hostage crisis"),
        ("iranian revolution", "iran-iraq war", "causes", 0.6, "Revolution destabilized region"),
        ("solidarity", "fall of the berlin wall", "enables", 0.7, "Polish resistance inspired Eastern European revolutions"),
        ("chernobyl", "dissolution of the soviet union", "enables", 0.5, "Chernobyl exposed Soviet system failures"),
        ("fall of the berlin wall", "german reunification", "causes", 0.95, "Wall's fall led directly to reunification"),
        ("fall of the berlin wall", "velvet revolution", "enables", 0.7, "Berlin Wall inspired Czechoslovak revolution"),
        ("fall of the berlin wall", "dissolution of the soviet union", "leads_to", 0.8, "Eastern European revolutions precipitated Soviet collapse"),
        ("tiananmen", "dissolution of the soviet union", "context", 0.3, "1989 global upheaval"),
        ("reagan-gorbachev", "fall of the berlin wall", "enables", 0.6, "Glasnost and perestroika enabled change"),

        # Post-Cold War
        ("dissolution of the soviet union", "gulf war", "enables", 0.5, "End of Cold War enabled US-led coalition"),
        ("apartheid", "mandela released", "leads_to", 0.7, "Apartheid resistance led to Mandela's release"),
        ("mandela released", "south africa's first democratic", "causes", 0.9, "Mandela's release led to democracy"),
        ("dissolution of the soviet union", "euro currency", "enables", 0.4, "Post-Cold War European integration"),
        ("world wide web", "internet commercialized", "causes", 0.9, "Web invention led to commercial internet"),
        ("internet commercialized", "social media", "leads_to", 0.8, "Commercial internet enabled social media"),
        ("internet commercialized", "iphone", "enables", 0.6, "Internet ecosystem enabled smartphone revolution"),
        ("rwandan genocide", "congo", "context", 0.5, "Rwandan genocide destabilized Congo region"),

        # 21st century
        ("september 11", "invasion of iraq", "causes", 0.7, "9/11 led to War on Terror including Iraq"),
        ("september 11", "fall of kabul", "leads_to", 0.6, "9/11 led to Afghan war ending in 2021"),
        ("invasion of iraq", "arab spring", "context", 0.4, "Iraq war destabilized Middle East"),
        ("arab spring", "syrian civil war", "causes", 0.9, "Arab Spring protests escalated in Syria"),
        ("global financial crisis", "arab spring", "enables", 0.4, "Economic pressure fueled protests"),
        ("iphone", "arab spring", "enables", 0.4, "Mobile technology enabled protest organization"),
        ("social media", "arab spring", "enables", 0.5, "Social media amplified revolutionary movements"),
        ("paris climate agreement", "covid-19", "context", 0.2, "Global cooperation challenges"),
        ("human genome", "covid-19", "enables", 0.4, "Genomics enabled rapid vaccine development"),

        # Civil Rights chain
        ("emancipation proclamation", "civil rights act", "leads_to", 0.6, "Long arc from emancipation to civil rights"),
        ("montgomery bus boycott", "civil rights act", "causes", 0.7, "Civil rights movement led to legislation"),
        ("civil rights act", "global protests 1968", "context", 0.5, "US civil rights inspired global movements"),
        ("kennedy assassination", "civil rights act", "enables", 0.6, "Kennedy's death helped pass civil rights legislation"),

        # Additional cross-connections
        ("abolition of slavery", "scramble for africa", "context", 0.4, "End of slave trade shifted European exploitation to colonialism"),
        ("camp david", "iranian revolution", "context", 0.4, "Camp David isolated Iran, contributing to revolution"),
        ("opec oil embargo", "iranian revolution", "context", 0.4, "Oil politics shaped Iranian revolution context"),
        ("falklands war", "argentina military junta", "context", 0.6, "Junta's war was last gasp of military rule"),
        ("spanish-american war", "philippine", "leads_to", 0.5, "Spanish-American War made US an imperial power"),
        ("taiping rebellion", "opium wars", "context", 0.5, "Both destabilized Qing China"),
        ("crimean war", "italian unification", "enables", 0.5, "Crimean War shifted European alliances, helping Italy"),
        ("women's suffrage", "civil rights act", "context", 0.4, "Suffrage movement paved way for broader rights"),
        ("helsinki accords", "solidarity", "enables", 0.5, "Helsinki human rights provisions empowered dissidents"),
        ("carnation revolution", "zimbabwe independence", "enables", 0.4, "Portuguese decolonization affected southern Africa"),
    ]

    # ── Insert causality links ──────────────────────────────────────────────
    print("Inserting causality links...")
    link_insert = """
        INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
        VALUES ($1, $2, $3, $4, $5, $6, 'enrich-script:v1', 'approved')
        ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
    """
    # Map our link types to actual DB values
    type_map = {
        'causes': 'direct',
        'leads_to': 'indirect',
        'enables': 'contributing',
        'context': 'contributing',
    }
    inserted = 0
    skipped = 0
    for cause_kw, effect_kw, ltype, strength, desc in LINKS:
        ltype = type_map.get(ltype, ltype)
        cause_id = find(cause_kw)
        effect_id = find(effect_kw)
        if cause_id and effect_id and cause_id != effect_id:
            await conn.execute(link_insert, uuid.uuid4(),
                               __import__('uuid').UUID(cause_id),
                               __import__('uuid').UUID(effect_id),
                               ltype, strength, desc)
            inserted += 1
        else:
            skipped += 1
            if not cause_id:
                print(f"  MISS cause: '{cause_kw}'")
            if not effect_id:
                print(f"  MISS effect: '{effect_kw}'")

    print(f"  Attempted {inserted} links, skipped {skipped}")

    # ── Final counts ──────────────────────────────────────────────────────
    e = await conn.fetchval('SELECT COUNT(*) FROM events')
    l = await conn.fetchval('SELECT COUNT(*) FROM causality_links')
    print(f"\nFinal counts: Events={e}, Links={l}")
    await conn.close()

if __name__ == '__main__':
    asyncio.run(main())
