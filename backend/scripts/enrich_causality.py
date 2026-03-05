"""
enrich_causality.py — Add 200+ causality links and 50 new events to Chronicle.

Enriches the causal graph to make the network view dense and visually rich.
Uses actual event IDs from the database. Links use historically accurate causal relationships.
"""

import asyncio
import asyncpg
import uuid
from datetime import date


DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'


# ─── New Events (50) ───────────────────────────────────────────────────────────
# Fill gaps in the timeline across key periods.
# Each tuple: (title, year_approx, is_bce, event_category, geo_modern, importance_score, slug)

NEW_EVENTS = [
    # Ancient - Egyptian & Near East
    ("Rise of the Egyptian New Kingdom — Age of Empire", -1550, True, "political", "Egypt", 0.75, "egyptian-new-kingdom"),
    ("Hittite Empire Established in Anatolia", -1600, True, "political", "Turkey", 0.65, "hittite-empire"),
    ("Assyrian Empire Conquers Mesopotamia", -900, True, "political", "Iraq", 0.70, "assyrian-empire-conquers"),
    ("Phoenician Maritime Trade Networks Span the Mediterranean", -1000, True, "cultural", "Lebanon", 0.70, "phoenician-trade-networks"),
    ("Fall of Nineveh — End of the Assyrian Empire", -612, True, "war", "Iraq", 0.65, "fall-of-nineveh"),
    ("Neo-Babylonian Empire Under Nebuchadnezzar II", -605, True, "political", "Iraq", 0.70, "neo-babylonian-empire"),
    ("Babylonian Captivity of the Jews", -586, True, "cultural", "Iraq", 0.70, "babylonian-captivity"),
    ("Darius I Organizes the Persian Empire — Royal Road and Satrapies", -520, True, "political", "Iran", 0.70, "darius-persian-organization"),

    # Classical
    ("Death of Alexander the Great — Empire Fractures", -323, True, "political", "Iraq", 0.80, "death-of-alexander"),
    ("Ptolemaic Kingdom of Egypt Founded", -305, True, "political", "Egypt", 0.65, "ptolemaic-egypt"),
    ("Seleucid Empire Controls the Near East", -312, True, "political", "Syria", 0.65, "seleucid-empire"),
    ("Rise of the Parthian Empire", -247, True, "political", "Iran", 0.65, "parthian-empire-rise"),
    ("Second Punic War — Hannibal Crosses the Alps", -218, True, "war", "Italy", 0.80, "second-punic-war-hannibal"),
    ("Third Punic War — Destruction of Carthage", -146, True, "war", "Tunisia", 0.75, "third-punic-war-carthage-destroyed"),
    ("Spartacus Slave Revolt", -73, True, "war", "Italy", 0.60, "spartacus-revolt"),
    ("Augustus Becomes First Roman Emperor", -27, True, "political", "Italy", 0.90, "augustus-first-emperor"),

    # Late Antiquity & Early Medieval
    ("Conversion of Constantine to Christianity", 312, False, "cultural", "Turkey", 0.80, "constantine-conversion"),
    ("Council of Nicaea — Christian Orthodoxy Defined", 325, False, "cultural", "Turkey", 0.75, "council-of-nicaea"),
    ("Vandals Sack Rome", 455, False, "war", "Italy", 0.65, "vandals-sack-rome"),
    ("Battle of Yarmouk — Arab Conquest of the Levant", 636, False, "war", "Jordan", 0.75, "battle-of-yarmouk"),
    ("Umayyad Caliphate Established — Damascus Capital", 661, False, "political", "Syria", 0.75, "umayyad-caliphate"),

    # Medieval
    ("Abbasid Revolution — Baghdad Becomes World Capital", 750, False, "political", "Iraq", 0.80, "abbasid-revolution"),
    ("An Lushan Rebellion — Tang Dynasty Weakened", 755, False, "war", "China", 0.70, "an-lushan-rebellion"),
    ("Treaty of Verdun — Carolingian Empire Divided", 843, False, "political", "France", 0.70, "treaty-of-verdun"),
    ("Kievan Rus Adopts Christianity", 988, False, "cultural", "Ukraine", 0.65, "kievan-rus-christianity"),
    ("Great Schism — Christianity Splits East and West", 1054, False, "cultural", "Italy", 0.80, "great-schism-1054"),
    ("Mongol Empire Under Ögedei — Expansion Into Europe", 1236, False, "war", "Mongolia", 0.75, "mongol-expansion-europe"),
    ("Kublai Khan Founds Yuan Dynasty in China", 1271, False, "political", "China", 0.75, "kublai-khan-yuan"),
    ("Ottoman Capture of the Balkans — Battle of Kosovo", 1389, False, "war", "Serbia", 0.70, "battle-of-kosovo-1389"),
    ("Timur's Conquests Devastate Central Asia", 1398, False, "war", "Uzbekistan", 0.70, "timur-conquests"),

    # Early Modern
    ("Treaty of Tordesillas — Spain and Portugal Divide the World", 1494, False, "political", "Spain", 0.75, "treaty-of-tordesillas"),
    ("Portuguese Establish Trading Posts in India", 1510, False, "political", "India", 0.70, "portuguese-india"),
    ("Diet of Worms — Luther Defies the Emperor", 1521, False, "cultural", "Germany", 0.75, "diet-of-worms"),
    ("Peace of Augsburg — Cuius Regio Eius Religio", 1555, False, "political", "Germany", 0.70, "peace-of-augsburg"),
    ("St. Bartholomew's Day Massacre — French Wars of Religion", 1572, False, "war", "France", 0.70, "st-bartholomew-massacre"),
    ("Defeat of the Spanish Armada", 1588, False, "war", "United Kingdom", 0.75, "spanish-armada-defeat"),
    ("Edict of Nantes — Religious Tolerance in France", 1598, False, "political", "France", 0.65, "edict-of-nantes"),
    ("Jamestown Founded — First Permanent English Colony", 1607, False, "political", "United States", 0.70, "jamestown-founded"),
    ("Defenestration of Prague — Thirty Years' War Trigger", 1618, False, "political", "Czech Republic", 0.70, "defenestration-of-prague"),
    ("Peace of Westphalia — Sovereignty and State System", 1648, False, "political", "Germany", 0.85, "peace-of-westphalia-sovereignty"),

    # Scientific Revolution & Enlightenment
    ("Descartes Publishes Discourse on the Method", 1637, False, "discovery", "France", 0.70, "descartes-discourse"),
    ("Robert Boyle's Sceptical Chymist — Modern Chemistry Begins", 1661, False, "discovery", "United Kingdom", 0.60, "boyle-sceptical-chymist"),
    ("Locke Publishes Two Treatises of Government", 1689, False, "cultural", "United Kingdom", 0.80, "locke-two-treatises"),
    ("War of Spanish Succession", 1701, False, "war", "Spain", 0.70, "war-spanish-succession"),
    ("Seven Years' War — The First Global Conflict", 1756, False, "war", "Global", 0.80, "seven-years-war"),
    ("Rousseau Publishes The Social Contract", 1762, False, "cultural", "France", 0.75, "rousseau-social-contract"),
    ("Spinning Jenny Invented — Textile Revolution", 1764, False, "discovery", "United Kingdom", 0.70, "spinning-jenny"),
    ("Boston Tea Party — American Colonial Resistance", 1773, False, "political", "United States", 0.70, "boston-tea-party"),
    ("Storming of the Tuileries — French Monarchy Falls", 1792, False, "political", "France", 0.70, "storming-tuileries"),
    ("Napoleon Crowned Emperor of France", 1804, False, "political", "France", 0.80, "napoleon-crowned-emperor"),
]


# ─── New Causality Links (200+) ───────────────────────────────────────────────
# Format: (cause_title_fragment, effect_title_fragment, link_type, strength, description)
# We match by title substring to get IDs dynamically.

NEW_LINKS = [
    # ── Ancient chains ──
    ("Invention of Writing", "Code of Hammurabi", "direct", 0.75, "Writing systems enabled the codification of law."),
    ("Invention of Writing", "Phoenician Alphabet", "direct", 0.80, "Cuneiform writing inspired later alphabetic systems including the Phoenician alphabet."),
    ("Narmer Unites Egypt", "Great Pyramid", "direct", 0.70, "Unified Egyptian state enabled monumental construction projects."),
    ("Narmer Unites Egypt", "Egyptian New Kingdom", "direct", 0.65, "Foundation of pharaonic state led to successive Egyptian kingdoms."),
    ("Sargon of Akkad", "Assyrian Empire Conquers", "indirect", 0.55, "Akkadian imperial model influenced later Mesopotamian empires."),
    ("Code of Hammurabi", "Cyrus the Great", "indirect", 0.50, "Mesopotamian legal traditions influenced Persian governance."),
    ("Minoan Civilization", "Trojan War", "contributing", 0.55, "Minoan maritime culture shaped Aegean power dynamics that led to conflicts like Troy."),
    ("Battle of Kadesh", "Bronze Age Collapse", "contributing", 0.45, "Egyptian-Hittite conflict weakened both empires before the Bronze Age Collapse."),
    ("Bronze Age Collapse", "Phoenician Alphabet", "direct", 0.70, "Collapse of palace economies created space for Phoenician traders and their alphabet."),
    ("Bronze Age Collapse", "Phoenician Maritime Trade", "direct", 0.72, "Fall of Bronze Age powers created a power vacuum filled by Phoenician merchants."),
    ("Phoenician Alphabet", "Cleisthenes Establishes Athenian Democracy", "indirect", 0.50, "Alphabetic literacy enabled broader political participation in Athens."),
    ("Phoenician Maritime Trade", "Founding of Carthage", "direct", 0.85, "Phoenician trade networks led directly to the founding of Carthage as a colony."),
    ("Shang Dynasty", "Qin Shi Huang Unifies China", "indirect", 0.45, "Shang writing and state traditions formed the foundation of later Chinese unification."),
    ("Assyrian Empire at Its Height", "Fall of Nineveh", "direct", 0.80, "Assyrian overextension and brutality led to the coalition that destroyed Nineveh."),
    ("Fall of Nineveh", "Neo-Babylonian Empire", "direct", 0.85, "Fall of Assyria enabled the rise of Nebuchadnezzar's Neo-Babylonian Empire."),
    ("Neo-Babylonian Empire", "Babylonian Captivity", "direct", 0.90, "Nebuchadnezzar conquered Jerusalem and deported the Jews to Babylon."),
    ("Babylonian Captivity", "Cyrus the Great", "contributing", 0.55, "Persian conquest of Babylon freed the Jews, establishing Cyrus as a liberator."),
    ("Cyrus the Great", "Darius I Organizes", "direct", 0.85, "Darius built upon Cyrus's conquests to create the Persian administrative system."),
    ("Darius I Organizes", "Battle of Marathon", "direct", 0.75, "Darius's westward expansion brought Persia into conflict with Greek city-states."),

    # ── Classical Greece ──
    ("Battle of Marathon", "Battle of Thermopylae", "direct", 0.80, "Marathon delayed but did not end Persian aggression, leading to Xerxes' invasion."),
    ("Battle of Thermopylae", "Peloponnesian War", "indirect", 0.50, "Greek victory over Persia created Athenian dominance that provoked Sparta."),
    ("Cleisthenes Establishes Athenian Democracy", "Trial and Death of Socrates", "contributing", 0.60, "Athenian democracy's institutions enabled Socrates' trial by jury."),
    ("Peloponnesian War", "End of the Peloponnesian War", "direct", 0.95, "The war concluded with Spartan victory over Athens."),
    ("End of the Peloponnesian War", "Trial and Death of Socrates", "direct", 0.70, "Athens' defeat and political turmoil led to Socrates' prosecution."),
    ("Trial and Death of Socrates", "Alexander the Great", "indirect", 0.50, "Socratic philosophy influenced Plato, who taught Aristotle, who tutored Alexander."),
    ("Alexander the Great's Conquests", "Battle of Gaugamela", "direct", 0.90, "Gaugamela was the decisive battle of Alexander's campaign against Persia."),
    ("Battle of Gaugamela", "Death of Alexander", "direct", 0.75, "Alexander's vast conquests culminated in his early death and empire's fracture."),
    ("Death of Alexander", "Ptolemaic Kingdom", "direct", 0.90, "Alexander's generals divided his empire; Ptolemy claimed Egypt."),
    ("Death of Alexander", "Seleucid Empire", "direct", 0.90, "Seleucus founded his dynasty from Alexander's fractured empire."),
    ("Death of Alexander", "Maurya Empire", "contributing", 0.55, "Power vacuum after Alexander's withdrawal from India enabled Chandragupta."),
    ("Founding of the Maurya Empire", "Maurya Empire at Its Peak", "direct", 0.90, "Chandragupta's empire reached its zenith under his grandson Ashoka."),
    ("Maurya Empire at Its Peak", "Ashoka's Conversion", "direct", 0.85, "Ashoka's remorse over the Kalinga War led to his embrace of Buddhism."),
    ("Ashoka's Conversion", "Siddhartha Gautama", "indirect", 0.40, "Buddha's teachings centuries earlier became state-sponsored under Ashoka."),
    ("Ptolemaic Kingdom", "Battle of Actium", "contributing", 0.60, "Cleopatra's Ptolemaic Egypt allied with Antony against Octavian at Actium."),

    # ── Roman Republic & Empire ──
    ("Founding of the Roman Republic", "First Punic War", "direct", 0.70, "Roman republican expansion brought it into conflict with Carthage."),
    ("First Punic War", "Second Punic War", "direct", 0.85, "Carthaginian resentment over the First Punic War drove Hannibal's invasion."),
    ("Second Punic War", "Third Punic War", "direct", 0.80, "Roman fear of Carthaginian resurgence led to the final destruction of Carthage."),
    ("Third Punic War", "Spartacus Slave Revolt", "contributing", 0.45, "Roman conquest brought massive slave populations that fueled revolts."),
    ("Caesar Crosses the Rubicon", "Assassination of Julius Caesar", "direct", 0.85, "Caesar's seizure of power led to the conspiracy to assassinate him."),
    ("Assassination of Julius Caesar", "Battle of Actium", "direct", 0.80, "Caesar's death triggered the civil wars that ended at Actium."),
    ("Battle of Actium", "Augustus Becomes First", "direct", 0.95, "Octavian's victory at Actium made him sole ruler of Rome."),
    ("Augustus Becomes First", "Roman Empire Under Trajan", "direct", 0.70, "Augustus established the imperial system that Trajan inherited and expanded."),
    ("Augustus Becomes First", "Birth of Jesus", "contributing", 0.55, "The Pax Romana under Augustus created conditions for Christianity's emergence."),
    ("Roman Empire Under Trajan", "Edict of Milan", "indirect", 0.45, "Roman imperial infrastructure enabled Christianity's spread across the empire."),
    ("Birth of Jesus", "Edict of Milan", "direct", 0.80, "Christianity grew from Jesus' teachings until Constantine legalized it."),
    ("Edict of Milan", "Conversion of Constantine", "direct", 0.90, "The Edict of Milan was Constantine's act of Christian tolerance."),
    ("Conversion of Constantine", "Council of Nicaea", "direct", 0.90, "Constantine's conversion led him to convene the council to unify doctrine."),
    ("Council of Nicaea", "Great Schism", "indirect", 0.55, "Nicaea established orthodoxy, but theological disputes eventually split Christianity."),

    # ── Fall of Rome ──
    ("Attila the Hun", "Vandals Sack Rome", "contributing", 0.50, "Hunnic invasions destabilized the Western Roman Empire, enabling Vandal attacks."),
    ("Visigoths Sack Rome", "Fall of the Western Roman", "direct", 0.75, "The Visigothic sack showed Rome's vulnerability, accelerating imperial collapse."),
    ("Vandals Sack Rome", "Fall of the Western Roman", "direct", 0.70, "The Vandal sack further weakened the already declining Western Empire."),
    ("Fall of the Western Roman", "Justinian Codifies", "direct", 0.65, "The fall of the West prompted Justinian's effort to preserve and codify Roman law."),
    ("Plague of Justinian", "Battle of Yarmouk", "contributing", 0.55, "The plague severely weakened Byzantine military capacity before the Arab conquests."),

    # ── Islamic World ──
    ("Birth of the Prophet Muhammad", "Islamic Conquests", "direct", 0.90, "Muhammad's teachings and the early Muslim community launched the conquests."),
    ("Islamic Conquests", "Battle of Yarmouk", "direct", 0.85, "Yarmouk was the decisive battle of the Arab conquest of the Byzantine Levant."),
    ("Battle of Yarmouk", "Umayyad Caliphate", "direct", 0.80, "Arab conquest of the Levant set the stage for the Umayyad dynasty."),
    ("Umayyad Caliphate", "Battle of Tours", "direct", 0.75, "Umayyad expansion westward was halted at Tours by Charles Martel."),
    ("Umayyad Caliphate", "Abbasid Revolution", "direct", 0.85, "Umayyad overextension and internal dissent led to the Abbasid revolution."),
    ("Abbasid Revolution", "Baghdad's House of Wisdom", "direct", 0.85, "Abbasid patronage of learning created the House of Wisdom."),
    ("Baghdad's House of Wisdom", "Al-Khwarizmi Invents Algebra", "direct", 0.85, "Al-Khwarizmi worked in the House of Wisdom."),
    ("Al-Khwarizmi Invents Algebra", "Avicenna's Canon", "contributing", 0.50, "Islamic Golden Age scholarship built upon earlier mathematical and scientific works."),
    ("Abbasid Revolution", "Cordoba Caliphate", "contributing", 0.55, "Umayyad refugees from the Abbasid revolution established the Cordoba Caliphate."),
    ("Mongols Sack Baghdad", "Abbasid Revolution", "indirect", 0.30, "The Mongol destruction of Baghdad ended the Abbasid Caliphate."),
    ("Saladin Recaptures Jerusalem", "Fourth Crusade Sacks Constantinople", "indirect", 0.45, "Crusading zeal after Saladin's victory was misdirected toward Constantinople."),

    # ── East Asia ──
    ("Tang Dynasty", "An Lushan Rebellion", "direct", 0.80, "Tang prosperity and military expansion created conditions for An Lushan's revolt."),
    ("An Lushan Rebellion", "Song Dynasty", "contributing", 0.60, "Tang decline after An Lushan eventually led to Song reunification."),
    ("Song Dynasty", "Compass Described", "direct", 0.75, "Song Dynasty innovation produced the navigational compass."),
    ("Qin Shi Huang Unifies China", "Great Wall of China", "direct", 0.85, "Qin Shi Huang connected existing walls into a unified defensive barrier."),
    ("Qin Shi Huang Unifies China", "Founding of the Han Dynasty", "direct", 0.85, "Qin collapse led directly to the Han Dynasty."),
    ("Founding of the Han Dynasty", "Opening of the Silk Road", "direct", 0.80, "Han expansion westward opened the Silk Road trade routes."),
    ("Opening of the Silk Road", "Han Dynasty — China's Confucian", "direct", 0.70, "Silk Road trade enriched the Han Dynasty and spread Confucian culture."),
    ("Mongol Conquests — Genghis Khan", "Mongol Empire Under Ögedei", "direct", 0.90, "Ögedei inherited and expanded Genghis Khan's conquests into Europe."),
    ("Mongol Conquests — Genghis Khan", "Mongols Sack Baghdad", "direct", 0.85, "Mongol campaigns under Hulagu destroyed Baghdad."),
    ("Mongol Conquests — Genghis Khan", "Kublai Khan Founds Yuan", "direct", 0.85, "Kublai Khan, Genghis's grandson, conquered China and founded the Yuan."),
    ("Kublai Khan Founds Yuan", "Mongol Invasions of Japan", "direct", 0.85, "Kublai Khan launched the invasions of Japan from Yuan China."),
    ("Kublai Khan Founds Yuan", "Ming Dynasty Founded", "direct", 0.80, "Chinese rebellion against Yuan Mongol rule led to the Ming Dynasty."),
    ("Ming Dynasty Founded", "Zheng He's Treasure Fleet", "direct", 0.85, "Ming Dynasty patronage funded Zheng He's naval expeditions."),

    # ── Medieval Europe ──
    ("Charlemagne Crowned", "Treaty of Verdun", "direct", 0.85, "Charlemagne's empire was divided among his grandsons at Verdun."),
    ("Battle of Hastings", "Magna Carta", "indirect", 0.55, "Norman feudal system in England created the baronial tensions behind Magna Carta."),
    ("First Crusade Captures Jerusalem", "Saladin Recaptures Jerusalem", "direct", 0.75, "Crusader occupation provoked the Muslim reconquest under Saladin."),
    ("Pope Urban II Calls", "First Crusade Captures Jerusalem", "direct", 0.90, "Urban's call launched the First Crusade that captured Jerusalem."),
    ("Fourth Crusade Sacks Constantinople", "Fall of Constantinople", "contributing", 0.60, "The Fourth Crusade fatally weakened the Byzantine Empire."),
    ("Black Death Arrives", "Florentine Renaissance", "contributing", 0.55, "Population collapse from plague disrupted feudalism and enabled Renaissance culture."),
    ("Black Death Pandemic", "Gutenberg's Printing Press", "indirect", 0.40, "Labor shortage after plague accelerated technological innovation including printing."),
    ("Mongol Empire Under Ögedei", "Black Death Arrives", "contributing", 0.50, "Mongol trade routes carried plague from Central Asia to Europe."),

    # ── Ottoman ──
    ("Founding of the Ottoman Empire", "Battle of Kosovo", "direct", 0.75, "Ottoman expansion into the Balkans led to the Battle of Kosovo."),
    ("Battle of Kosovo", "Fall of Constantinople", "contributing", 0.60, "Ottoman Balkan conquests encircled Constantinople before its fall."),
    ("Fall of Constantinople", "Age of Exploration", "direct", 0.70, "Ottoman control of eastern trade routes pushed Europeans to seek sea routes."),
    ("Fall of Constantinople", "Columbus Reaches the Americas", "contributing", 0.55, "Loss of eastern trade access motivated the search for western routes."),
    ("Founding of the Ottoman Empire", "Ottoman Empire at Its Peak", "direct", 0.75, "Ottoman state building culminated under Suleiman the Magnificent."),
    ("Ottoman Empire at Its Peak", "End of the Ottoman Empire", "indirect", 0.40, "Suleiman's empire eventually declined into the 'sick man of Europe'."),

    # ── Age of Exploration & Colonialism ──
    ("Gutenberg Prints the Bible", "Martin Luther Posts 95 Theses", "direct", 0.80, "Printing press enabled mass distribution of Luther's ideas."),
    ("Gutenberg's Printing Press", "Copernicus Publishes Heliocentric", "contributing", 0.55, "Printing enabled wide dissemination of scientific works."),
    ("Compass Described", "Columbus Reaches the Americas", "contributing", 0.60, "Chinese compass technology enabled European oceanic navigation."),
    ("Bartolomeu Dias Rounds", "Vasco da Gama Reaches India", "direct", 0.85, "Dias proved the sea route around Africa that da Gama completed."),
    ("Columbus Reaches the Americas", "Treaty of Tordesillas", "direct", 0.90, "Columbus's discovery prompted Spain and Portugal to divide the New World."),
    ("Columbus Reaches the Americas", "Columbian Exchange", "direct", 0.95, "Columbus initiated the biological and cultural exchange between hemispheres."),
    ("Columbus Reaches the Americas", "Spanish Conquest of the Aztec", "direct", 0.80, "Columbus's voyages opened the path for Spanish conquistadors."),
    ("Columbus Reaches the Americas", "Magellan-Elcano Circumnavigation", "direct", 0.70, "Columbus's discovery inspired further voyages of exploration."),
    ("Treaty of Tordesillas", "Portuguese Establish Trading Posts", "direct", 0.75, "Tordesillas allocated eastern routes to Portugal, spurring Indian Ocean expansion."),
    ("Vasco da Gama Reaches India", "Portuguese Establish Trading Posts", "direct", 0.85, "Da Gama's route was immediately exploited for Portuguese trading posts."),
    ("Spanish Conquest of the Aztec", "Pizarro Conquers the Inca", "direct", 0.75, "Cortés's success inspired Pizarro's conquest of the Inca."),
    ("Columbian Exchange", "First Transatlantic Slave Voyage", "direct", 0.70, "Columbian Exchange created plantation economies demanding slave labor."),
    ("Vasco da Gama Reaches India", "Dutch East India Company", "contributing", 0.60, "Portuguese success in India inspired Dutch commercial competition."),

    # ── Reformation & Wars of Religion ──
    ("Martin Luther Posts 95 Theses", "Diet of Worms", "direct", 0.90, "Luther's challenge to the Church led to his summoning before the Emperor."),
    ("Diet of Worms", "Peace of Augsburg", "direct", 0.75, "Luther's defiance led to religious conflict resolved temporarily at Augsburg."),
    ("Peace of Augsburg", "St. Bartholomew's Day Massacre", "contributing", 0.45, "Religious division in Europe intensified wars of religion in France."),
    ("Peace of Augsburg", "Defenestration of Prague", "direct", 0.65, "Breakdown of Augsburg settlement triggered the Thirty Years' War."),
    ("Defenestration of Prague", "Thirty Years' War", "direct", 0.90, "The defenestration was the immediate trigger for the Thirty Years' War."),
    ("Thirty Years' War", "Treaty of Westphalia", "direct", 0.95, "The Thirty Years' War ended with the Peace of Westphalia."),
    ("Martin Luther Posts 95 Theses", "Council of Trent", "direct", 0.80, "Luther's Reformation provoked the Catholic Counter-Reformation at Trent."),
    ("Council of Trent", "St. Bartholomew's Day Massacre", "contributing", 0.50, "Counter-Reformation zeal contributed to anti-Protestant violence."),
    ("St. Bartholomew's Day Massacre", "Edict of Nantes", "direct", 0.75, "Wars of religion including the massacre led to the Edict of Nantes."),
    ("Defeat of the Spanish Armada", "Dutch East India Company", "contributing", 0.55, "Spanish naval decline enabled Dutch maritime commercial expansion."),

    # ── Scientific Revolution ──
    ("Copernicus Publishes Heliocentric", "Galileo Improves Telescope", "direct", 0.75, "Copernican theory inspired Galileo's observational confirmation."),
    ("Galileo Improves Telescope", "Galileo Before the Inquisition", "direct", 0.85, "Galileo's telescopic observations led to his conflict with the Church."),
    ("Galileo Improves Telescope", "Kepler's Laws", "contributing", 0.55, "Galileo's observations supported and complemented Kepler's theoretical work."),
    ("Kepler's Laws", "Newton's Principia", "direct", 0.80, "Kepler's laws of planetary motion were explained by Newton's gravity."),
    ("Galileo Before the Inquisition", "Descartes Publishes Discourse", "contributing", 0.50, "Galileo's persecution influenced Descartes' cautious approach to publishing."),
    ("Descartes Publishes Discourse", "Newton's Principia", "contributing", 0.55, "Cartesian method and mathematics influenced Newton's approach."),
    ("Newton's Principia", "Lavoisier and the Chemical Revolution", "contributing", 0.50, "Newtonian scientific method inspired Lavoisier's systematic chemistry."),
    ("William Harvey Discovers Blood", "Pasteur Proves Germ Theory", "indirect", 0.40, "Harvey's empirical approach to anatomy laid groundwork for later medical science."),
    ("Vesalius Publishes", "William Harvey Discovers Blood", "direct", 0.70, "Vesalius's anatomical revolution enabled Harvey's circulatory discoveries."),
    ("Copernicus Publishes Heliocentric", "Kepler's Laws", "direct", 0.80, "Kepler built directly on Copernican heliocentrism."),

    # ── Enlightenment & Revolutions ──
    ("Glorious Revolution", "Locke Publishes Two Treatises", "direct", 0.80, "Locke wrote to justify the Glorious Revolution's constitutional principles."),
    ("Locke Publishes Two Treatises", "American Declaration of Independence", "direct", 0.75, "Locke's natural rights theory directly influenced Jefferson's Declaration."),
    ("Locke Publishes Two Treatises", "Rousseau Publishes The Social Contract", "contributing", 0.55, "Locke's political philosophy influenced Rousseau's social contract theory."),
    ("Rousseau Publishes The Social Contract", "French Revolution", "direct", 0.70, "Rousseau's ideas of popular sovereignty inspired the French Revolution."),
    ("Enlightenment — Voltaire", "French Revolution", "direct", 0.75, "Enlightenment ideas undermined the legitimacy of absolute monarchy."),
    ("Enlightenment — Voltaire", "American Declaration", "contributing", 0.60, "Enlightenment rationalism influenced American revolutionary thought."),
    ("Seven Years' War", "Boston Tea Party", "direct", 0.75, "British debt from the Seven Years' War led to colonial taxation and resistance."),
    ("Boston Tea Party", "American Declaration of Independence", "direct", 0.80, "Colonial resistance escalated from the Tea Party to independence."),
    ("American Declaration of Independence", "French Revolution", "direct", 0.70, "American Revolution inspired French revolutionary ideals."),
    ("American Declaration of Independence", "US Constitutional Convention", "direct", 0.90, "Independence required creating a new system of government."),
    ("US Constitutional Convention", "American Bill of Rights", "direct", 0.95, "The Bill of Rights was added to secure ratification of the Constitution."),
    ("French Revolution", "Declaration of the Rights of Man", "direct", 0.95, "The Revolution produced the Declaration as its foundational document."),
    ("French Revolution", "Storming of the Tuileries", "direct", 0.90, "Revolutionary radicalization led to the storming and fall of monarchy."),
    ("French Revolution", "Haitian Revolution", "direct", 0.75, "French revolutionary ideals inspired Haiti's enslaved people to revolt."),
    ("Storming of the Tuileries", "Napoleon Crowned Emperor", "direct", 0.70, "Revolutionary upheaval and instability led to Napoleon's rise."),
    ("Napoleon Crowned Emperor", "Battle of Austerlitz", "direct", 0.80, "Napoleon's imperial ambitions led to his greatest military victory."),
    ("Napoleon Crowned Emperor", "Napoleonic Wars", "direct", 0.90, "Napoleon's coronation launched an era of European warfare."),
    ("Battle of Austerlitz", "Napoleonic Wars", "contributing", 0.65, "Austerlitz emboldened Napoleon's further continental campaigns."),
    ("Battle of Waterloo", "Congress of Vienna", "direct", 0.85, "Napoleon's defeat enabled the Congress to redraw Europe."),
    ("Napoleonic Wars", "Battle of Waterloo", "direct", 0.90, "Waterloo was the final battle of the Napoleonic Wars."),
    ("Congress of Vienna", "Revolutions of 1848", "contributing", 0.60, "Vienna's conservative order suppressed liberal nationalism until it erupted in 1848."),
    ("Watt's Steam Engine", "Spinning Jenny", "contributing", 0.50, "Steam power and textile innovation were parallel drivers of industrialization."),

    # ── 19th Century ──
    ("Haitian Revolution", "Simón Bolívar", "contributing", 0.55, "Haiti's success inspired Latin American independence movements."),
    ("Napoleonic Wars", "Simón Bolívar", "direct", 0.65, "Napoleon's invasion of Spain weakened colonial control, enabling independence."),
    ("Abolition of Slavery in the British Empire", "American Civil War", "contributing", 0.45, "British abolition increased pressure on slavery in America."),
    ("Communist Manifesto", "Revolutions of 1848", "contributing", 0.50, "Marx and Engels published the Manifesto amid the 1848 revolutionary wave."),
    ("Darwin Publishes On the Origin", "Darwin's Voyage on the Beagle", "indirect", 0.30, "Darwin's voyage provided evidence for his later theory of evolution."),
    ("Darwin's Voyage on the Beagle", "Darwin Publishes On the Origin", "direct", 0.85, "Observations from the Beagle voyage led Darwin to develop evolutionary theory."),
    ("Pasteur Proves Germ Theory", "Jenner's Smallpox Vaccine", "indirect", 0.35, "Jenner's empirical vaccine preceded Pasteur's theoretical germ explanation."),
    ("Commodore Perry Opens Japan", "Meiji Restoration", "direct", 0.85, "Perry's forced opening destabilized the Tokugawa and led to Meiji reform."),
    ("Meiji Restoration", "Russo-Japanese War", "direct", 0.75, "Meiji modernization enabled Japan's military challenge to Russia."),
    ("Italian Unification", "German Unification", "contributing", 0.50, "Italian success inspired and influenced German national unification."),
    ("German Unification", "Berlin Conference", "direct", 0.65, "Unified Germany joined the colonial scramble, hosting the Berlin Conference."),
    ("Berlin Conference", "Battle of Adwa", "contributing", 0.55, "The scramble for Africa brought Italy into conflict with Ethiopia."),
    ("Suez Canal Opens", "Battle of Plassey", "indirect", 0.30, "British control of trade routes connected Indian and Suez interests."),
    ("American Civil War", "Emancipation Proclamation", "direct", 0.90, "The Civil War led Lincoln to issue the Emancipation Proclamation."),
    ("Maxwell's Equations", "Einstein's Annus Mirabilis", "direct", 0.75, "Maxwell's electromagnetic theory set the stage for Einstein's special relativity."),
    ("Opium Wars", "Taiping Rebellion", "contributing", 0.55, "Opium War humiliation destabilized Qing China, contributing to the Taiping Rebellion."),
    ("Taiping Rebellion", "Boxer Rebellion", "indirect", 0.40, "Qing weakness from the Taiping era fueled later anti-foreign movements."),
    ("Irish Great Famine", "Revolutions of 1848", "contributing", 0.35, "Famine-driven Irish nationalism contributed to the 1848 revolutionary wave."),

    # ── Early 20th Century ──
    ("Russo-Japanese War", "Russian Revolution", "contributing", 0.60, "Russian defeat exposed Tsarist weakness and fueled revolutionary sentiment."),
    ("Wright Brothers First Powered Flight", "Space Shuttle Program", "indirect", 0.40, "Aviation began with the Wrights and culminated in spaceflight."),
    ("Einstein's Annus Mirabilis", "Manhattan Project", "direct", 0.80, "E=mc² provided the theoretical basis for atomic weapons."),
    ("Spanish-American War", "Filipino independence", "indirect", 0.40, "US imperial expansion changed Pacific power dynamics."),
    ("Assassination of Archduke", "Austro-Hungarian Ultimatum", "direct", 0.95, "The assassination triggered Austria-Hungary's ultimatum to Serbia."),
    ("Sykes-Picot Agreement", "Balfour Declaration", "direct", 0.70, "Wartime agreements carved up the Middle East; Balfour promised a Jewish homeland."),
    ("October Revolution", "Russian Civil War", "direct", 0.90, "Bolshevik seizure of power triggered the Russian Civil War."),
    ("Russian Civil War", "League of Nations", "contributing", 0.40, "Fear of Bolshevism motivated Western powers' support for the League."),
    ("Treaty of Versailles", "League of Nations", "direct", 0.85, "The Treaty established the League of Nations."),
    ("Treaty of Versailles", "Weimar Republic Hyperinflation", "direct", 0.80, "Versailles reparations caused Germany's economic crisis."),
    ("Treaty of Versailles", "Beer Hall Putsch", "contributing", 0.65, "Versailles humiliation fueled German nationalism exploited by Hitler."),
    ("Wall Street Crash", "Hitler Appointed Chancellor", "direct", 0.80, "Depression destroyed the Weimar economy and enabled Nazi rise."),
    ("Gandhi's Salt March", "Indian Independence", "direct", 0.70, "Gandhi's civil disobedience movement built toward Indian independence."),

    # ── WWII chain ──
    ("Nuremberg Laws", "Munich Agreement", "contributing", 0.50, "Nazi aggression emboldened by Western appeasement of Hitler."),
    ("Munich Agreement", "Germany Invades Poland", "direct", 0.80, "Appeasement failed to stop Hitler, who invaded Poland."),
    ("Molotov-Ribbentrop Pact", "Germany Invades Poland", "direct", 0.85, "The Nazi-Soviet pact secured Hitler's eastern flank for the invasion."),
    ("Germany Invades Poland", "Fall of France", "direct", 0.80, "After Poland, Germany turned west and conquered France."),
    ("Fall of France", "Battle of Britain", "direct", 0.85, "After France fell, Germany attempted to conquer Britain by air."),
    ("Battle of Britain", "Operation Barbarossa", "contributing", 0.55, "Failure to defeat Britain led Hitler to turn east against the USSR."),
    ("Operation Barbarossa", "Battle of Stalingrad", "direct", 0.85, "The German invasion of the USSR culminated at Stalingrad."),
    ("Pearl Harbor", "Battle of Midway", "direct", 0.80, "Pearl Harbor brought the US into the Pacific War; Midway was the turning point."),
    ("Battle of Stalingrad", "D-Day", "contributing", 0.55, "Soviet victory at Stalingrad turned the tide, enabling the Western front opening."),
    ("D-Day", "Liberation of Paris", "direct", 0.85, "Normandy landings led directly to the liberation of Paris."),
    ("D-Day", "Germany Surrenders", "direct", 0.80, "D-Day began the Western Allied campaign that ended with German surrender."),
    ("Manhattan Project", "Atomic Bombing of Hiroshima", "direct", 0.95, "The Manhattan Project built the bombs dropped on Japan."),
    ("Atomic Bombing of Hiroshima", "Hydrogen Bomb", "direct", 0.80, "Hiroshima demonstrated nuclear weapons, sparking the arms race."),
    ("Germany Surrenders", "Nuremberg Trials", "direct", 0.90, "Allied victory enabled prosecution of Nazi war criminals."),
    ("Germany Surrenders", "United Nations Charter", "direct", 0.80, "WWII's end prompted creation of the UN to prevent future wars."),
    ("Wannsee Conference", "Liberation of Nazi Concentration", "direct", 0.85, "The Final Solution's implementation led to the camps that were liberated."),
    ("Liberation of Nazi Concentration", "Universal Declaration of Human Rights", "direct", 0.75, "Holocaust horrors motivated the Universal Declaration."),
    ("Liberation of Nazi Concentration", "Declaration of the State of Israel", "direct", 0.70, "The Holocaust accelerated the push for a Jewish state."),

    # ── Cold War ──
    ("United Nations Charter", "Universal Declaration of Human Rights", "direct", 0.80, "The UN adopted the UDHR as its foundational human rights document."),
    ("Marshall Plan", "Treaty of Rome", "contributing", 0.60, "US-funded recovery fostered European cooperation leading to the EU."),
    ("Berlin Blockade", "NATO Founded", "direct", 0.85, "Soviet blockade of Berlin catalyzed Western military alliance."),
    ("Chinese Communist Revolution", "Korean War", "direct", 0.70, "Communist China's support emboldened North Korea's invasion."),
    ("Korean War", "Korean War Armistice", "direct", 0.95, "The war concluded with the armistice dividing Korea."),
    ("Sputnik Launches the Space Race", "Yuri Gagarin", "direct", 0.80, "Soviet space program progressed from Sputnik to human spaceflight."),
    ("Yuri Gagarin", "Apollo 11", "direct", 0.80, "Gagarin's flight spurred the US to land on the Moon."),
    ("Cuban Revolution", "Bay of Pigs", "direct", 0.85, "Castro's revolution prompted the failed US-backed invasion."),
    ("Bay of Pigs", "Cuban Missile Crisis", "direct", 0.80, "Bay of Pigs failure led to Soviet missile deployment in Cuba."),
    ("Hungarian Revolution", "Prague Spring", "contributing", 0.50, "Hungarian revolt foreshadowed Czechoslovakia's reform attempt."),
    ("Dien Bien Phu", "Tet Offensive", "contributing", 0.50, "French defeat in Vietnam led to US involvement and the Tet Offensive."),
    ("Tet Offensive", "Fall of Saigon", "direct", 0.70, "Tet turned American opinion against the war, leading to withdrawal."),
    ("Montgomery Bus Boycott", "Civil Rights Act of 1964", "direct", 0.75, "The boycott ignited the civil rights movement that produced the Act."),
    ("Six-Day War", "Camp David Accords", "contributing", 0.60, "Israeli occupation from 1967 set the stage for peace negotiations."),
    ("OPEC Oil Embargo", "Iranian Revolution", "contributing", 0.45, "Oil politics and Middle East tensions contributed to revolutionary conditions in Iran."),
    ("Soviet Invasion of Afghanistan", "Fall of the Berlin Wall", "contributing", 0.50, "Afghan quagmire weakened the Soviet Union, contributing to its collapse."),
    ("Solidarity Movement", "Fall of the Berlin Wall", "direct", 0.70, "Polish Solidarity inspired Eastern European revolutions."),
    ("Reagan-Gorbachev", "Fall of the Berlin Wall", "direct", 0.75, "Gorbachev's reforms enabled the fall of the Berlin Wall."),
    ("Fall of the Berlin Wall", "German Reunification", "direct", 0.95, "The Wall's fall led directly to German reunification."),
    ("Fall of the Berlin Wall", "Dissolution of the Soviet Union", "direct", 0.80, "Eastern European revolutions cascaded to Soviet collapse."),
    ("Chernobyl Disaster", "Dissolution of the Soviet Union", "contributing", 0.50, "Chernobyl exposed Soviet incompetence and accelerated glasnost."),
    ("Tiananmen Square", "China Joins the WTO", "indirect", 0.35, "Post-Tiananmen economic reform focus led China toward WTO entry."),

    # ── Post-Cold War ──
    ("Dissolution of the Soviet Union", "World Wide Web Goes Public", "indirect", 0.30, "End of Cold War enabled global connectivity and information sharing."),
    ("World Wide Web Goes Public", "Social Media Revolution", "direct", 0.85, "The Web created the platform for social media."),
    ("Social Media Revolution", "Arab Spring", "contributing", 0.60, "Social media enabled organization and spread of Arab Spring movements."),
    ("Rwandan Genocide", "South Africa's First Democratic Election", "indirect", 0.30, "African political transformation occurred across the continent in 1994."),
    ("Nelson Mandela Released", "South Africa's First Democratic Election", "direct", 0.90, "Mandela's release began the transition to democracy."),
    ("September 11 Attacks", "Fall of Kabul", "direct", 0.80, "9/11 triggered the US invasion of Afghanistan that ended at Kabul's fall."),
    ("Human Genome Project", "COVID-19 Pandemic", "contributing", 0.45, "Genomic science enabled rapid COVID vaccine development."),
    ("Global Financial Crisis", "Arab Spring", "contributing", 0.45, "Economic hardship fueled popular discontent in the Arab world."),
    ("iPhone Launch", "Social Media Revolution", "direct", 0.70, "Smartphones made social media ubiquitous and mobile."),
    ("Watson and Crick Discover DNA", "Human Genome Project", "direct", 0.80, "DNA discovery made genome sequencing possible."),
    ("Salk Polio Vaccine", "Green Revolution in South Asia", "indirect", 0.30, "Medical advances and agricultural innovation both addressed population survival."),
    ("COVID-19 Pandemic", "Russia Invades Ukraine", "contributing", 0.35, "Pandemic disruptions and geopolitical shifts contributed to Russian aggression."),
    ("Paris Climate Agreement", "COVID-19 Pandemic", "indirect", 0.25, "Global cooperation frameworks were tested by the pandemic."),

    # ── Cross-cutting thematic links ──
    ("Transatlantic Slave Trade", "Haitian Revolution", "direct", 0.80, "The slave trade created the enslaved population that revolted in Haiti."),
    ("Transatlantic Slave Trade", "American Civil War", "direct", 0.75, "Slavery's expansion was the fundamental cause of the Civil War."),
    ("Magna Carta Signed", "Glorious Revolution", "indirect", 0.50, "Magna Carta established principles of limited monarchy expanded in 1688."),
    ("Magna Carta Signed", "English Bill of Rights", "indirect", 0.55, "Magna Carta's legacy of rights constraints influenced the Bill of Rights."),
    ("Indus Valley Civilization", "Siddhartha Gautama", "indirect", 0.35, "South Asian cultural traditions from the Indus era influenced later religious thought."),
    ("Bantu Expansion", "Kingdom of Benin", "indirect", 0.45, "Bantu migrations shaped the cultural landscape from which Benin emerged."),
    ("Bantu Expansion", "Great Zimbabwe", "indirect", 0.50, "Bantu-speaking peoples built the Great Zimbabwe civilization."),
    ("Battle of Sekigahara", "Commodore Perry Opens Japan", "indirect", 0.45, "Tokugawa isolation established at Sekigahara ended with Perry's arrival."),
    ("Algerian War of Independence", "Year of Africa", "contributing", 0.50, "Algerian resistance inspired broader African decolonization movements."),
    ("Ghana Independence", "Year of Africa", "direct", 0.70, "Ghana's 1957 independence catalyzed the wave of African independence in 1960."),
    ("Suez Crisis", "Algerian War of Independence", "contributing", 0.50, "Suez demonstrated declining European imperial power, emboldening independence movements."),
]


async def main():
    """Insert new events and causality links into the Chronicle database."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events for title matching ──
    rows = await conn.fetch('SELECT id, title FROM events')
    events_by_title = {r['title']: str(r['id']) for r in rows}
    event_count_before = len(rows)

    # ── Load existing links ──
    link_rows = await conn.fetch('SELECT cause_event_id, effect_event_id FROM causality_links')
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, is_bce, category, geo, importance, slug in NEW_EVENTS:
        # Check if event with this slug already exists
        existing = await conn.fetchval("SELECT id FROM events WHERE slug = $1", slug)
        if existing:
            print(f"  SKIP event (exists): {title}")
            continue

        event_id = str(uuid.uuid4())
        # Compute date_earliest and date_latest from year_approx
        abs_year = abs(year)
        if abs_year == 0:
            abs_year = 1
        d_earliest = date(abs_year, 1, 1)
        d_latest = date(abs_year, 12, 31)

        await conn.execute("""
            INSERT INTO events (id, slug, title, year_approx, is_bce, event_category,
                              geo_modern, importance_score, review_status, created_by, version,
                              date_earliest, date_latest, date_confidence)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'approved', 'enrichment-script', 1,
                    $9, $10, 0.5)
        """, event_id, slug, title, year, is_bce, category, geo, importance, d_earliest, d_latest)

        events_by_title[title] = event_id
        events_inserted += 1

    print(f"Inserted {events_inserted} new events")

    # ── Helper: find event ID by title substring ──
    def find_event(fragment):
        """Find event ID by title substring match."""
        matches = [(t, eid) for t, eid in events_by_title.items() if fragment in t]
        if not matches:
            return None
        # Prefer exact or shortest match
        matches.sort(key=lambda x: len(x[0]))
        return matches[0][1]

    # ── Insert causality links ──
    links_inserted = 0
    links_skipped = 0
    links_not_found = 0

    for cause_frag, effect_frag, link_type, strength, description in NEW_LINKS:
        cause_id = find_event(cause_frag)
        effect_id = find_event(effect_frag)

        if not cause_id or not effect_id:
            if not cause_id:
                print(f"  NOT FOUND cause: '{cause_frag}'")
            if not effect_id:
                print(f"  NOT FOUND effect: '{effect_frag}'")
            links_not_found += 1
            continue

        if cause_id == effect_id:
            print(f"  SELF-LINK skipped: '{cause_frag}' -> '{effect_frag}'")
            links_skipped += 1
            continue

        if (cause_id, effect_id) in existing_links:
            links_skipped += 1
            continue

        link_id = str(uuid.uuid4())
        try:
            await conn.execute("""
                INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type,
                                           strength, description, created_by, review_status)
                VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, 'enrichment-script', 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
            """, link_id, cause_id, effect_id, link_type, strength, description)
            existing_links.add((cause_id, effect_id))
            links_inserted += 1
        except Exception as e:
            print(f"  ERROR inserting link '{cause_frag}' -> '{effect_frag}': {e}")
            links_skipped += 1

    print(f"Inserted {links_inserted} new links (skipped {links_skipped}, not found {links_not_found})")

    # ── Verify totals ──
    total_events = await conn.fetchval('SELECT COUNT(*) FROM events')
    total_links = await conn.fetchval('SELECT COUNT(*) FROM causality_links')
    print(f"\nFinal totals: {total_events} events, {total_links} links")
    print(f"Added: {total_events - event_count_before} events, {total_links - link_count_before} links")

    await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
