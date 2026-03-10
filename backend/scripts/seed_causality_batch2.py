#!/usr/bin/env python3
"""
Chronicle causality links — batch 2: ~200 cross-era historical links.

Focuses on under-linked events and cross-era connections across:
- Ancient & Classical world
- Medieval period
- Early Modern era
- 19th century
- 20th-21st century gaps

Run:
    python backend/scripts/seed_causality_batch2.py
"""
from __future__ import annotations

import asyncio
import os

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:causality-batch2-v1"


# Format: (cause_title_fragment, effect_title_fragment, link_type, strength, description)
# Fragments must be contiguous substrings of actual event titles (matched via ILIKE).
LINKS = [
    # ══════════════════════════════════════════════════════════════════
    # ANCIENT & CLASSICAL WORLD
    # ══════════════════════════════════════════════════════════════════

    # Bronze Age → Iron Age transitions
    ("Bronze Age Collapse", "Iron Age Begins", "direct", 0.80,
     "The collapse of Bronze Age palace economies disrupted tin trade, accelerating the adoption of iron."),
    ("Sea Peoples", "Bronze Age Collapse", "direct", 0.75,
     "Sea Peoples' invasions destabilized the interconnected Bronze Age Mediterranean civilizations."),
    ("Thera Eruption", "Mycenaean Collapse", "contributing", 0.45,
     "The Thera eruption weakened Minoan civilization, indirectly destabilizing the Mycenaean world."),
    ("Bronze Age Collapse", "Phoenician Alphabet", "indirect", 0.55,
     "The collapse of palatial cultures allowed simpler Phoenician script to spread over cuneiform and Linear B."),
    ("Phoenician Alphabet", "Polis System Emerges", "contributing", 0.60,
     "Adoption of the Phoenician alphabet enabled Greek literary and civic culture to re-emerge."),
    ("Phoenician Alphabet", "Homer Composes", "contributing", 0.55,
     "The Greek adaptation of the Phoenician alphabet allowed Homer's oral epics to be written down."),

    # Persian Empire chain
    ("Cyrus the Great Founds", "Darius I Reorganizes", "direct", 0.85,
     "Cyrus's conquests created the empire that Darius systematized with satrapies and the Royal Road."),
    ("Darius I Reorganizes", "Persepolis", "direct", 0.80,
     "Darius's administrative reforms funded the construction of Persepolis as ceremonial capital."),
    ("Darius I Reorganizes", "Battle of Marathon", "direct", 0.75,
     "Darius's imperial expansion westward led to the Persian invasion of Greece and Marathon."),
    ("Battle of Marathon", "Battle of Thermopylae", "direct", 0.80,
     "Marathon's Greek victory provoked Xerxes' massive revenge invasion a decade later."),
    ("Battle of Thermopylae", "Battle of Salamis", "direct", 0.90,
     "Thermopylae's sacrifice bought time for the decisive Greek naval victory at Salamis."),
    ("Battle of Salamis", "Delian League", "direct", 0.80,
     "Victory over Persia at Salamis led to the formation of the Delian League under Athenian leadership."),
    ("Delian League", "Golden Age of Athens", "direct", 0.75,
     "Delian League tribute funded Athenian democracy and Pericles' building program."),
    ("Golden Age of Athens", "Parthenon", "direct", 0.85,
     "Pericles directed Delian League funds to construct the Parthenon."),
    ("Golden Age of Athens", "Peloponnesian War", "contributing", 0.60,
     "Athenian imperial ambitions under Pericles provoked Spartan fears and the Peloponnesian War."),

    # Greek philosophy chain
    ("Trial and Death of Socrates", "Plato Founds the Academy", "direct", 0.80,
     "Socrates' execution inspired Plato to establish the Academy and preserve philosophical inquiry."),
    ("Plato Founds the Academy", "Aristotle Founds the Lyceum", "direct", 0.85,
     "Plato's Academy trained Aristotle, who later founded the competing Lyceum."),
    ("Aristotle Founds the Lyceum", "Alexander the Great", "contributing", 0.55,
     "Aristotle tutored young Alexander, influencing his worldview and ambitions for Hellenistic culture."),

    # Alexander aftermath
    ("Death of Alexander", "Hellenistic Kingdoms", "direct", 0.90,
     "Alexander's death without a clear heir led to the Wars of the Diadochi and successor kingdoms."),
    ("Death of Alexander", "Ptolemaic Kingdom", "direct", 0.85,
     "Ptolemy I seized Egypt after Alexander's death, founding the Ptolemaic dynasty."),
    ("Death of Alexander", "Seleucid Empire", "direct", 0.85,
     "Seleucus I carved out the largest successor state from Alexander's eastern conquests."),
    ("Ptolemaic Kingdom", "Library of Alexandria", "direct", 0.85,
     "The Ptolemies founded and funded the Library of Alexandria as a center of Hellenistic learning."),
    ("Alexander Founds Alexandria", "Library of Alexandria", "direct", 0.80,
     "Alexander's founding of Alexandria created the city that housed the greatest ancient library."),

    # Roman Republic → Empire
    ("Gracchi Reforms", "Marius' Military", "contributing", 0.55,
     "The Gracchi's failed reforms exposed structural crises that Marius addressed through military reform."),
    ("Marius' Military", "Spartacus Slave Revolt", "contributing", 0.40,
     "Rome's professional military ultimately crushed the Spartacus revolt and demonstrated legionary power."),
    ("Spartacus Slave Revolt", "First Triumvirate", "contributing", 0.45,
     "Crassus's victory over Spartacus boosted his political standing, leading to the First Triumvirate."),
    ("First Triumvirate", "Gallic Wars", "direct", 0.80,
     "The Triumvirate gave Caesar his Gallic command, launching the wars that made him Rome's most powerful man."),
    ("Gallic Wars", "Caesar Crosses the Rubicon", "direct", 0.90,
     "Caesar's Gallic victories made the Senate fear his power, forcing his fateful river crossing."),
    ("Caesar Crosses the Rubicon", "Assassination of Julius Caesar", "direct", 0.80,
     "Caesar's seizure of power after crossing the Rubicon culminated in his dictatorship and assassination."),
    ("Assassination of Julius Caesar", "Battle of Actium", "direct", 0.70,
     "Caesar's assassination triggered civil wars that culminated in Octavian's victory at Actium."),
    ("Battle of Actium", "Augustus Becomes First", "direct", 0.95,
     "Octavian's victory at Actium made him sole ruler, becoming Augustus, first Roman emperor."),
    ("Augustus Becomes First", "Pax Romana", "direct", 0.90,
     "Augustus's political settlement inaugurated two centuries of relative peace across the empire."),

    # Late Rome → Fall
    ("Antonine Plague", "Crisis of the Third Century", "contributing", 0.50,
     "The Antonine Plague weakened the Roman economy and military, contributing to third-century instability."),
    ("Crisis of the Third Century", "Diocletian's Reforms", "direct", 0.80,
     "The near-collapse of the empire forced Diocletian's radical administrative and military reforms."),
    ("Diocletian's Reforms", "Constantine", "contributing", 0.60,
     "Diocletian's Tetrarchy system ultimately failed, enabling Constantine's rise to sole power."),
    ("Constantine Founds Constantinople", "Permanent Division of the Roman Empire", "direct", 0.75,
     "Constantinople as a second capital facilitated the eventual permanent east-west division."),
    ("Permanent Division of the Roman Empire", "Fall of the Western Roman Empire", "direct", 0.70,
     "The permanent division left the weaker western half vulnerable to barbarian invasions."),
    ("Attila the Hun", "Fall of the Western Roman Empire", "contributing", 0.50,
     "Attila's invasions devastated the western provinces and exposed Rome's military weakness."),
    ("Vandals Sack Rome", "Fall of the Western Roman Empire", "direct", 0.65,
     "The Vandal sack of 455 demonstrated Rome's inability to defend itself, hastening the fall."),
    ("Fall of the Western Roman Empire", "Clovis I Converts", "contributing", 0.60,
     "Rome's fall left a power vacuum that Frankish king Clovis filled, with Christian conversion legitimizing his rule."),

    # Christianity chain
    ("Crucifixion of Jesus", "Paul's Missionary", "direct", 0.85,
     "Jesus's crucifixion and the belief in his resurrection launched the apostolic mission, especially Paul's."),
    ("Paul's Missionary", "Constantine", "indirect", 0.50,
     "Paul's missionary work spread Christianity across the empire, creating the faith Constantine adopted."),
    ("Edict of Milan", "Council of Nicaea", "direct", 0.90,
     "Constantine's legalization of Christianity led him to convene Nicaea to define orthodoxy."),
    ("Council of Nicaea", "Theodosius Makes Christianity", "direct", 0.70,
     "Nicaea's creedal definitions paved the way for Theodosius to make Christianity the state religion."),

    # Buddhism & Silk Road
    ("Ashoka's Rock Edicts", "Mahayana Buddhism", "contributing", 0.55,
     "Ashoka's missionary activity spread Buddhism beyond India, enabling the Mahayana tradition to develop."),
    ("Opening of the Silk Road", "Buddhism Spreads Along the Silk Road", "direct", 0.75,
     "The Silk Road's trade routes served as conduits for Buddhist missionaries reaching China."),
    ("Kushan Empire", "Buddhism Spreads Along the Silk Road", "contributing", 0.60,
     "The Kushan Empire's patronage of Gandhara Buddhism facilitated its spread along trade routes."),

    # Chinese dynasties
    ("Qin Shi Huang Unifies China", "Founding of the Han Dynasty", "direct", 0.85,
     "The Qin's harsh unification provoked revolts that Liu Bang channeled into founding the Han dynasty."),
    ("Han Dynasty", "Invention of Paper", "direct", 0.70,
     "Han dynasty bureaucracy and scholarship spurred Cai Lun's improvement of paper production."),
    ("Fall of the Han Dynasty", "Three Kingdoms", "direct", 0.95,
     "The Han collapse directly led to the Three Kingdoms period of fragmented Chinese power."),

    # ══════════════════════════════════════════════════════════════════
    # MEDIEVAL WORLD (500-1500)
    # ══════════════════════════════════════════════════════════════════

    # Fall of Rome → Medieval
    ("Fall of the Western Roman Empire", "Justinian", "contributing", 0.55,
     "Rome's fall spurred Justinian's ambition to reconquer the lost western provinces."),
    ("Justinian", "Corpus Juris Civilis", "direct", 0.90,
     "Justinian ordered the codification of Roman law into the Corpus Juris Civilis."),
    ("Justinian", "Hagia Sophia", "direct", 0.90,
     "Justinian commissioned Hagia Sophia as the greatest monument of his reign."),
    ("Plague of Justinian", "Lombard Invasion", "contributing", 0.55,
     "The Justinianic plague weakened Byzantine Italy, enabling the Lombard conquest."),

    # Rise of Islam chain
    ("Birth of the Prophet Muhammad", "Hijra", "direct", 0.90,
     "Muhammad's prophetic mission in Mecca led to the pivotal migration to Medina."),
    ("Hijra", "Conquest of Mecca", "direct", 0.85,
     "The Medinan community Muhammad built after the Hijra enabled the reconquest of Mecca."),
    ("Conquest of Mecca", "Death of Prophet Muhammad", "direct", 0.70,
     "The conquest of Mecca unified Arabia under Islam shortly before Muhammad's death."),
    ("Death of Prophet Muhammad", "Islamic Conquests", "direct", 0.90,
     "Muhammad's death triggered the Ridda Wars and then the explosive Islamic conquests."),
    ("Islamic Conquests", "Battle of Yarmouk", "direct", 0.85,
     "The early Islamic conquests included the decisive victory at Yarmouk over Byzantium."),
    ("Islamic Conquests", "Muslim Conquest of Persia", "direct", 0.85,
     "The Rashidun caliphate's conquests destroyed the Sassanid Empire."),
    ("Islamic Conquests", "Umayyad Caliphate", "direct", 0.80,
     "The vast territories conquered during the Rashidun era became the Umayyad Caliphate."),
    ("Umayyad Caliphate", "Muslim Conquest of Iberian", "direct", 0.80,
     "Umayyad expansion carried Islamic conquest across North Africa into the Iberian Peninsula."),
    ("Muslim Conquest of Iberian", "Battle of Tours", "direct", 0.80,
     "The Muslim advance into Gaul after conquering Iberia was halted at Tours by Charles Martel."),
    ("Battle of Tours", "Pepin the Short", "contributing", 0.55,
     "Martel's victory at Tours elevated Carolingian prestige, enabling Pepin to seize the Frankish throne."),
    ("Abbasid Revolution", "Founding of Baghdad", "direct", 0.90,
     "The Abbasids founded Baghdad as their new capital after overthrowing the Umayyads."),
    ("Abbasid Revolution", "Umayyad Emirate", "direct", 0.80,
     "A surviving Umayyad prince fled to Spain and established the independent Emirate of Córdoba."),
    ("Founding of Baghdad", "House of Wisdom", "direct", 0.85,
     "Baghdad's founding as the Abbasid capital led to the House of Wisdom and the Islamic Golden Age."),
    ("House of Wisdom", "Al-Khwarizmi Invents Algebra", "direct", 0.80,
     "The House of Wisdom's scholarly environment nurtured al-Khwarizmi's foundational work in algebra."),

    # Charlemagne chain
    ("Pepin the Short", "Charlemagne Conquers Lombard", "direct", 0.75,
     "Pepin established Carolingian power that Charlemagne expanded by conquering the Lombards."),
    ("Charlemagne Conquers Lombard", "Charlemagne Crowned", "contributing", 0.65,
     "Charlemagne's Italian conquests and alliance with the papacy led to his imperial coronation."),
    ("Charlemagne Crowned", "Carolingian Renaissance", "direct", 0.80,
     "Charlemagne's empire sponsored a revival of learning and literacy across Western Europe."),
    ("Charlemagne Crowned", "Treaty of Verdun", "indirect", 0.65,
     "Charlemagne's empire fragmented among his grandsons at the Treaty of Verdun."),
    ("Treaty of Verdun", "Otto I Crowned", "indirect", 0.50,
     "The eastern Frankish kingdom created at Verdun evolved into the realm Otto I unified."),

    # Vikings chain
    ("Viking Raids Begin", "Vikings Settle Iceland", "direct", 0.70,
     "Viking maritime expansion started with raids and led to permanent settlement of Iceland."),
    ("Vikings Settle Iceland", "Erik the Red Explores", "direct", 0.80,
     "Icelandic Norse expansion led Erik the Red to colonize Greenland."),
    ("Erik the Red Explores", "Leif Erikson", "direct", 0.85,
     "Erik's Greenland settlement was the base from which Leif Erikson reached North America."),
    ("Viking Raids Begin", "Alfred the Great Defeats", "direct", 0.70,
     "Viking invasions of England forced Alfred the Great's military response and the Danelaw settlement."),
    ("Viking Raids Begin", "Normandy Granted to Viking", "direct", 0.75,
     "Viking pressure on France led to granting Normandy to the Viking leader Rollo."),
    ("Normandy Granted to Viking", "Battle of Hastings", "indirect", 0.65,
     "Rollo's Norman settlement eventually produced William the Conqueror, who won at Hastings."),

    # Crusades chain
    ("Battle of Manzikert", "First Crusade", "direct", 0.80,
     "Byzantine defeat at Manzikert and the loss of Anatolia prompted the appeal that launched the First Crusade."),
    ("Great Schism", "Fourth Crusade", "contributing", 0.45,
     "The East-West schism created the hostility that allowed crusaders to sack Constantinople in 1204."),
    ("First Crusade", "Saladin Recaptures Jerusalem", "indirect", 0.60,
     "Crusader kingdoms established after the First Crusade were the target of Saladin's reconquest."),
    ("Saladin Recaptures Jerusalem", "Third Crusade", "direct", 0.90,
     "Saladin's capture of Jerusalem provoked the Third Crusade led by Richard the Lionheart."),
    ("Fourth Crusade", "Fall of Constantinople", "contributing", 0.50,
     "The 1204 sack fatally weakened Byzantium, making its eventual fall to the Ottomans more likely."),

    # Mongol chain
    ("Genghis Khan Unites the Mongol", "Mongol Conquests", "direct", 0.95,
     "Genghis Khan's unification of the Mongol tribes launched the greatest land conquests in history."),
    ("Mongol Conquests", "Mongol Destruction of Baghdad", "direct", 0.85,
     "The Mongol westward advance culminated in the destruction of Baghdad and the Abbasid Caliphate."),
    ("Mongol Conquests", "Pax Mongolica", "direct", 0.80,
     "Mongol conquest created a unified Eurasian empire that enabled unprecedented trade."),
    ("Pax Mongolica", "Black Death", "contributing", 0.55,
     "Pax Mongolica's trade networks also facilitated the spread of plague from Central Asia to Europe."),
    ("Mongol Destruction of Baghdad", "Founding of the Ottoman", "contributing", 0.45,
     "The Mongol destruction of the Abbasid Caliphate created a power vacuum the Ottomans eventually filled."),
    ("Mongol Conquests", "Kublai Khan Founds Yuan", "direct", 0.85,
     "Mongol conquest of China established Kublai Khan's Yuan dynasty."),

    # Black Death aftermath
    ("Black Death", "Peasants' Revolt", "direct", 0.75,
     "The Black Death's labor shortage empowered surviving peasants, leading to the 1381 revolt."),
    ("Black Death", "Florentine Renaissance", "contributing", 0.50,
     "Post-plague labor shortages and wealth concentration helped fuel the Italian Renaissance."),
    ("Black Death", "Hundred Years' War", "contributing", 0.40,
     "The plague disrupted both English and French societies, prolonging and reshaping the Hundred Years' War."),

    # Late medieval → early modern
    ("Hundred Years' War", "Joan of Arc", "direct", 0.85,
     "Joan of Arc emerged during the Hundred Years' War to turn the tide for France."),
    ("Fall of Constantinople", "Florentine Renaissance", "contributing", 0.50,
     "Greek scholars fleeing Constantinople brought classical texts that enriched the Renaissance."),
    ("Fall of Constantinople", "Vasco da Gama Reaches India", "contributing", 0.55,
     "Ottoman control of eastern trade routes motivated Portugal to find a sea route to India."),
    ("Fall of Constantinople", "Columbus Reaches the Americas", "contributing", 0.50,
     "Ottoman dominance of eastern Mediterranean trade spurred the search for western routes."),

    # ══════════════════════════════════════════════════════════════════
    # EARLY MODERN (1500-1800)
    # ══════════════════════════════════════════════════════════════════

    # Printing → Reformation → Wars of Religion
    ("Gutenberg", "Martin Luther Posts", "contributing", 0.70,
     "The printing press enabled rapid dissemination of Luther's ideas across Europe."),
    ("Martin Luther Posts", "Diet of Worms", "direct", 0.90,
     "Luther's theses provoked his summoning before Emperor Charles V at the Diet of Worms."),
    ("Martin Luther Posts", "Calvin Establishes", "contributing", 0.60,
     "Luther's Reformation inspired later reformers including Calvin's movement in Geneva."),
    ("Martin Luther Posts", "English Reformation", "contributing", 0.45,
     "The broader Reformation context influenced Henry VIII's break with Rome, though dynastic motives dominated."),
    ("Martin Luther Posts", "Council of Trent", "direct", 0.80,
     "Luther's challenge forced the Catholic Church to respond with the Counter-Reformation Council of Trent."),
    ("Martin Luther Posts", "Thirty Years' War", "indirect", 0.60,
     "The Reformation's religious divisions set the stage for the devastating Thirty Years' War."),
    ("Thirty Years' War", "Peace of Westphalia", "direct", 0.95,
     "The Thirty Years' War ended with the Peace of Westphalia, establishing modern state sovereignty."),
    ("Peace of Westphalia", "Louis XIV Builds Versailles", "contributing", 0.40,
     "Westphalia's state-sovereignty principles enabled Louis XIV's absolutist state-building."),
    ("St. Bartholomew", "Edict of Nantes", "direct", 0.70,
     "The horrific St. Bartholomew's Day Massacre eventually led to the Edict of Nantes granting Huguenot tolerance."),

    # Scientific Revolution chain
    ("Copernicus", "Kepler", "direct", 0.80,
     "Copernicus's heliocentric model was refined by Kepler into precise laws of planetary motion."),
    ("Copernicus", "Galileo Improves Telescope", "contributing", 0.70,
     "Copernicus's heliocentric theory inspired Galileo's telescopic observations to confirm it."),
    ("Galileo Before the Inquisition", "Newton Publishes Principia", "contributing", 0.45,
     "Galileo's mechanics and persecution spurred later scientists, culminating in Newton's synthesis."),
    ("Kepler", "Newton Publishes Principia", "direct", 0.80,
     "Kepler's laws of planetary motion were explained by Newton's law of universal gravitation."),
    ("William Harvey", "Leeuwenhoek Discovers Microorganisms", "contributing", 0.40,
     "Harvey's empirical approach to anatomy inspired the observational methods that led to microscopy."),
    ("Newton Publishes Principia", "Enlightenment", "contributing", 0.65,
     "Newton's rational laws of nature inspired the Enlightenment's faith in reason and progress."),

    # Colonialism & trade
    ("Columbus Reaches the Americas", "Atlantic Slave Trade", "direct", 0.75,
     "European colonization of the Americas created plantation economies demanding enslaved African labor."),
    ("Columbus Reaches the Americas", "Spanish Conquest of the Aztec", "direct", 0.80,
     "Columbus's voyages opened the way for Cortés's conquest of the Aztec Empire."),
    ("Columbus Reaches the Americas", "Treaty of Tordesillas", "direct", 0.85,
     "Columbus's discovery prompted Spain and Portugal to divide the New World at Tordesillas."),
    ("Spanish Conquest of the Aztec", "Spanish Conquest of the Inca", "direct", 0.70,
     "Spain's success against the Aztecs emboldened and financed Pizarro's conquest of the Inca."),
    ("Spanish Conquest of the Inca", "Potosí Silver", "direct", 0.80,
     "Spanish conquest of the Inca Empire revealed Potosí's vast silver deposits."),
    ("Vasco da Gama Reaches India", "Portuguese Establish Trading", "direct", 0.85,
     "Da Gama's sea route to India enabled Portugal to establish trading posts across the Indian Ocean."),
    ("British East India Company", "Battle of Plassey", "direct", 0.80,
     "The East India Company's growing military power culminated in the decisive victory at Plassey."),

    # Enlightenment → Revolutions
    ("Locke Publishes Two Treatises", "American Declaration of Independence", "contributing", 0.65,
     "Locke's ideas on natural rights and consent of the governed directly influenced the Declaration."),
    ("Montesquieu", "Constitutional Convention", "contributing", 0.60,
     "Montesquieu's separation of powers concept was adopted by the framers of the US Constitution."),
    ("Rousseau Publishes The Social Contract", "French Revolution", "contributing", 0.60,
     "Rousseau's ideas about popular sovereignty influenced French revolutionary ideology."),
    ("Adam Smith Publishes The Wealth of Nations", "Industrial Revolution", "contributing", 0.45,
     "Smith's ideas about free markets and division of labor provided intellectual support for industrialization."),

    # American Revolution chain
    ("Stamp Act", "Boston Tea Party", "direct", 0.70,
     "British taxation without representation, beginning with the Stamp Act, escalated to the Boston Tea Party."),
    ("Boston Tea Party", "Lexington and Concord", "direct", 0.80,
     "The Tea Party and Britain's punitive response pushed the colonies toward armed revolution."),
    ("American Revolution", "French Revolution", "contributing", 0.60,
     "The American Revolution's success inspired French revolutionaries and bankrupted the French crown."),
    ("Seven Years' War", "American Revolution", "contributing", 0.55,
     "Britain's war debts from the Seven Years' War led to the colonial taxation that provoked revolution."),

    # French Revolution chain
    ("French Revolution", "Reign of Terror", "direct", 0.90,
     "Revolutionary radicalization led to the Jacobin Reign of Terror."),
    ("Reign of Terror", "Napoleon Seizes Power", "direct", 0.75,
     "The Terror's chaos and the Directory's weakness enabled Napoleon's coup d'état."),
    ("Napoleon Seizes Power", "Napoleon Crowned Emperor", "direct", 0.90,
     "Napoleon's consolidation of power led to his self-coronation as Emperor."),
    ("Napoleon Crowned Emperor", "Napoleonic Code", "direct", 0.85,
     "Napoleon's imperial power enabled the codification of French civil law."),
    ("Napoleon Crowned Emperor", "Battle of Waterloo", "indirect", 0.60,
     "Napoleon's imperial ambitions led to the coalitions that ultimately defeated him at Waterloo."),
    ("Battle of Waterloo", "Congress of Vienna", "direct", 0.95,
     "Napoleon's final defeat at Waterloo led directly to the Congress of Vienna's European settlement."),
    ("French Revolution", "Haitian Revolution", "direct", 0.75,
     "The French Revolution's principles of liberty and equality inspired the Haitian slave revolution."),
    ("French Revolution", "Latin American Independence", "contributing", 0.55,
     "French revolutionary ideals and Napoleonic disruption of Spain inspired Latin American independence."),
    ("Napoleon Reorganizes Europe", "Latin American Independence", "direct", 0.70,
     "Napoleon's invasion of Spain weakened colonial control, enabling Latin American independence movements."),

    # ══════════════════════════════════════════════════════════════════
    # 19TH CENTURY
    # ══════════════════════════════════════════════════════════════════

    # Industrial Revolution chains
    ("Watt Improves the Steam Engine", "First Steam Locomotive", "direct", 0.80,
     "Watt's improved steam engine technology was adapted for railway locomotion by Trevithick."),
    ("First Steam Locomotive", "First Public Passenger Railway", "direct", 0.85,
     "Trevithick's locomotive led to the Stockton & Darlington, the first public passenger railway."),
    ("Spinning Jenny", "Watt's Steam Engine Patent", "contributing", 0.55,
     "Textile mechanization was a key driver of the broader Industrial Revolution."),
    ("Enclosure Movement", "Industrial Revolution", "contributing", 0.55,
     "Enclosures displaced rural workers, creating the urban labor force for factory industrialization."),
    ("Bessemer Process", "Transcontinental Railroad", "contributing", 0.55,
     "The Bessemer steel process made mass-produced steel rails possible for transcontinental railroads."),
    ("Electric Telegraph", "Transatlantic Telegraph Cable", "direct", 0.85,
     "Morse's telegraph technology was extended across the Atlantic by undersea cable."),

    # Opium Wars → Chinese upheaval
    ("Opium Wars", "Treaty of Nanking", "direct", 0.90,
     "Britain's victory in the First Opium War forced the humiliating Treaty of Nanking on China."),
    ("Opium Wars", "Taiping Rebellion", "contributing", 0.55,
     "The Opium Wars' humiliation destabilized the Qing dynasty, contributing to the Taiping Rebellion."),
    ("Taiping Rebellion", "Chinese Revolution", "contributing", 0.45,
     "The Taiping Rebellion weakened the Qing dynasty and demonstrated revolutionary potential in China."),
    ("Perry Opens Japan", "Meiji Restoration", "direct", 0.80,
     "Perry's forced opening of Japan triggered the domestic crisis that led to the Meiji Restoration."),
    ("Meiji Restoration", "Russo-Japanese War", "direct", 0.70,
     "Meiji modernization built Japan's military power, enabling its victory over Russia."),
    ("Russo-Japanese War", "Russian Revolution of 1905", "direct", 0.75,
     "Russia's humiliating defeat by Japan triggered the 1905 revolution."),

    # Unification movements
    ("Franco-Prussian War", "Unification of Germany", "direct", 0.90,
     "Prussia's victory over France completed German unification under Bismarck."),
    ("Unification of Germany", "Berlin Conference", "contributing", 0.55,
     "A unified Germany's colonial ambitions drove the Berlin Conference partitioning Africa."),
    ("Congress of Vienna", "Revolutions of 1848", "indirect", 0.50,
     "The conservative order imposed at Vienna suppressed liberal and national aspirations that erupted in 1848."),
    ("Revolutions of 1848", "Unification of Italy", "contributing", 0.55,
     "The 1848 revolutions' failure galvanized Italian nationalists toward eventual unification."),
    ("Communist Manifesto", "First International", "direct", 0.75,
     "Marx's manifesto laid the theoretical foundation for the International Workingmen's Association."),
    ("Communist Manifesto", "Paris Commune", "contributing", 0.55,
     "Marx's ideas influenced the Paris Commune, the first workers' government."),

    # American Civil War chain
    ("Cotton Gin", "Atlantic Slave Trade", "contributing", 0.60,
     "The cotton gin massively increased demand for enslaved labor in the American South."),
    ("American Civil War", "Emancipation Proclamation", "direct", 0.90,
     "Lincoln issued the Emancipation Proclamation as a wartime measure during the Civil War."),
    ("Emancipation Proclamation", "13th Amendment", "direct", 0.85,
     "The Emancipation Proclamation paved the way for the permanent abolition via the 13th Amendment."),

    # Science chain
    ("Darwin Publishes On the Origin of Species", "Mendel Publishes Laws", "contributing", 0.45,
     "Darwin's evolution theory created the context for Mendel's genetics, though the connection was not recognized until later."),
    ("Pasteur", "Koch Identifies Tuberculosis", "direct", 0.75,
     "Pasteur's germ theory provided the framework for Koch's identification of specific disease-causing bacteria."),
    ("Maxwell's Equations", "Hertz Proves Electromagnetic", "direct", 0.85,
     "Maxwell's theoretical prediction of electromagnetic waves was experimentally confirmed by Hertz."),
    ("Hertz Proves Electromagnetic", "Marconi", "direct", 0.80,
     "Hertz's demonstration of radio waves enabled Marconi to develop wireless telegraphy."),
    ("Röntgen Discovers X-Rays", "Marie Curie", "contributing", 0.60,
     "Röntgen's discovery of X-rays inspired the Curies' research into radioactivity."),

    # Late 19th century imperialism
    ("Berlin Conference", "Second Boer War", "contributing", 0.50,
     "The scramble for Africa intensified British-Boer tensions over South African territories."),
    ("Battle of Adwa", "Menelik II Modernizes", "direct", 0.70,
     "Menelik II's victory at Adwa preserved Ethiopian independence and funded modernization."),
    ("First Sino-Japanese War", "Boxer Rebellion", "contributing", 0.50,
     "China's defeat by Japan exposed Qing weakness and fueled anti-foreign sentiment behind the Boxer Rebellion."),
    ("Spanish-American War", "Panama Canal", "contributing", 0.50,
     "The Spanish-American War demonstrated the need for a canal connecting Atlantic and Pacific fleets."),

    # ══════════════════════════════════════════════════════════════════
    # 20TH CENTURY GAPS
    # ══════════════════════════════════════════════════════════════════

    # WWI additional links
    ("Assassination of Archduke", "Austria-Hungary", "direct", 0.95,
     "The assassination provided the pretext for Austria-Hungary's ultimatum that triggered WWI."),
    ("Russian Revolution of 1905", "October Revolution", "contributing", 0.60,
     "The 1905 revolution was a dress rehearsal for 1917, establishing revolutionary patterns and organizations."),
    ("October Revolution", "Soviet Union Founded", "direct", 0.90,
     "The Bolshevik Revolution created the state that became the USSR in 1922."),
    ("Treaty of Versailles", "League of Nations", "direct", 0.85,
     "The Treaty of Versailles established the League of Nations as part of the peace settlement."),
    ("World War I Armistice", "Partition of the Ottoman", "direct", 0.85,
     "The Ottoman defeat in WWI led to the empire's partition by Allied powers."),
    ("Partition of the Ottoman", "Turkish Independence", "direct", 0.85,
     "Resistance to the Ottoman partition drove Atatürk's Turkish War of Independence."),
    ("Balfour Declaration", "Declaration of the State of Israel", "contributing", 0.65,
     "Britain's Balfour Declaration supporting a Jewish homeland laid groundwork for Israel's founding."),
    ("Armenian Genocide", "Wannsee Conference", "contributing", 0.35,
     "The Armenian Genocide's impunity may have influenced later genocidal calculations."),

    # Interwar
    ("Great Depression", "New Deal", "direct", 0.85,
     "The Great Depression's devastation prompted FDR's New Deal economic reforms."),
    ("Great Depression", "Japanese Invasion of Manchuria", "contributing", 0.50,
     "The global depression weakened international opposition and fueled Japanese militarist expansion."),
    ("Spanish Civil War", "Germany Invades Poland", "contributing", 0.45,
     "The Spanish Civil War served as a testing ground for German and Italian military tactics used in WWII."),
    ("Long March", "People's Republic", "contributing", 0.65,
     "The Long March forged the CCP leadership that ultimately won the Chinese civil war."),

    # WWII additional
    ("Pearl Harbor", "Atomic Bombing of Hiroshima", "indirect", 0.60,
     "Pearl Harbor's entry of the US into the Pacific war culminated in the atomic bombings."),
    ("Manhattan Project", "Soviet Union Tests First Atomic", "contributing", 0.65,
     "Soviet espionage of the Manhattan Project accelerated the USSR's own nuclear weapons program."),
    ("Germany Surrenders", "Nuremberg Trials", "direct", 0.90,
     "Germany's surrender enabled the Allies to prosecute Nazi war criminals at Nuremberg."),
    ("Germany Surrenders", "Marshall Plan", "direct", 0.75,
     "The devastation of WWII led the US to fund European reconstruction via the Marshall Plan."),
    ("Marshall Plan", "Treaty of Rome", "contributing", 0.55,
     "Marshall Plan cooperation fostered the economic integration that led to the Treaty of Rome."),
    ("Atomic Bombing of Hiroshima", "Hydrogen Bomb", "direct", 0.80,
     "Hiroshima demonstrated nuclear power and launched the superpower arms race."),
    ("Germany Surrenders", "Berlin Blockade", "direct", 0.70,
     "Post-war occupation of divided Germany led to the Soviet blockade of West Berlin."),

    # Cold War gaps
    ("Korean War", "Vietnam", "contributing", 0.45,
     "Cold War containment doctrine applied in Korea shaped US involvement in Vietnam."),
    ("Berlin Wall", "Fall of the Berlin Wall", "direct", 0.60,
     "The Wall's 28-year division of Berlin made its dramatic fall a defining moment of Cold War's end."),
    ("Suez Crisis", "Year of Africa", "contributing", 0.55,
     "The Suez Crisis exposed declining European imperial power, accelerating African decolonization."),
    ("Indian Independence", "Ghana Independence", "contributing", 0.55,
     "India's independence inspired and provided a model for African independence movements."),
    ("Cuban Revolution", "Cuban Missile Crisis", "direct", 0.80,
     "Castro's revolution aligned Cuba with the USSR, setting the stage for the missile crisis."),
    ("Bay of Pigs", "Cuban Missile Crisis", "direct", 0.70,
     "The Bay of Pigs failure prompted the Soviets to place missiles in Cuba to deter further US action."),
    ("Nixon Opens Relations", "Détente", "contributing", 0.60,
     "Nixon's opening to China was a key element of the broader Cold War détente strategy."),
    ("Soviet Invasion of Afghanistan", "Fall of the Berlin Wall", "contributing", 0.50,
     "The costly Afghan war drained Soviet resources and credibility, contributing to the Cold War's end."),
    ("Soviet Invasion of Afghanistan", "September 11 Attacks", "indirect", 0.55,
     "The Afghan mujahideen, armed during the Soviet war, included precursors to al-Qaeda."),
    ("Chernobyl", "Dissolution of the Soviet Union", "contributing", 0.50,
     "Chernobyl exposed Soviet incompetence and accelerated public demands for reform."),

    # Civil rights & social movements
    ("Brown v. Board", "Montgomery Bus Boycott", "direct", 0.70,
     "The Brown ruling's desegregation mandate energized the civil rights movement."),
    ("I Have a Dream", "Civil Rights Act", "direct", 0.80,
     "The March on Washington's moral force built momentum for passage of the Civil Rights Act."),
    ("Watergate Scandal", "Nixon Resigns", "direct", 0.95,
     "The Watergate cover-up's exposure forced Nixon's unprecedented resignation."),
    ("Stonewall Riots", "Roe v. Wade", "contributing", 0.35,
     "Stonewall and the broader social liberation movements of the era influenced progressive legal changes."),

    # Technology & economy
    ("Transistor Invented", "NASA Founded", "contributing", 0.45,
     "Transistor technology was essential for the miniaturized electronics of the space program."),
    ("Transistor Invented", "iPhone", "indirect", 0.55,
     "The transistor's invention enabled the semiconductor revolution underlying smartphones."),
    ("World Wide Web", "Dot-Com Boom", "direct", 0.80,
     "The commercialization of the World Wide Web fueled massive speculation in internet companies."),
    ("World Wide Web", "Google IPO", "direct", 0.75,
     "The Web created the search market that Google dominated."),
    ("World Wide Web", "Facebook Founded", "direct", 0.75,
     "The Web provided the platform for social media including Facebook."),
    ("Lehman Brothers Collapse", "Obama Elected", "contributing", 0.55,
     "The financial crisis of 2008 boosted Obama's election by discrediting Republican economic management."),
    ("iPhone", "Arab Spring", "contributing", 0.50,
     "Smartphones and social media enabled the rapid organization of Arab Spring protests."),
    ("Facebook Founded", "Arab Spring", "contributing", 0.55,
     "Social media platforms like Facebook were instrumental in organizing Arab Spring protests."),
    ("Arab Spring", "Syrian Civil War", "direct", 0.85,
     "The Arab Spring's wave of protests triggered Syria's descent into civil war."),
    ("Syrian Civil War", "Syrian Refugee Crisis", "direct", 0.90,
     "Syria's civil war caused the largest refugee crisis since WWII."),
    ("Syrian Refugee Crisis", "European Migrant", "direct", 0.80,
     "The Syrian refugee exodus was the primary driver of Europe's 2015 migrant crisis."),
    ("European Migrant", "Brexit Referendum", "contributing", 0.50,
     "The migration crisis fueled anti-EU sentiment that contributed to the Brexit vote."),

    # 21st century
    ("September 11 Attacks", "US Invades Afghanistan", "direct", 0.95,
     "The 9/11 attacks led directly to the US invasion of Afghanistan to overthrow the Taliban."),
    ("September 11 Attacks", "Invasion of Iraq", "contributing", 0.65,
     "Post-9/11 security fears and the 'War on Terror' framework enabled the 2003 Iraq invasion."),
    ("Invasion of Iraq", "ISIS Declares Caliphate", "direct", 0.70,
     "The Iraq War's destabilization of Iraq created the conditions for ISIS's rise."),
    ("ISIS Declares Caliphate", "Paris Terrorist Attacks", "direct", 0.80,
     "ISIS directed the November 2015 Paris attacks as part of its international terror campaign."),
    ("US Invades Afghanistan", "Fall of Kabul", "indirect", 0.65,
     "The 20-year Afghan war ended with the Taliban's return to power after US withdrawal."),
    ("COVID-19 First Cases", "COVID-19 Pandemic Declared", "direct", 0.95,
     "The initial COVID-19 cases in Wuhan spread globally, leading to the WHO pandemic declaration."),
    ("COVID-19 Pandemic", "COVID-19 Vaccines Rollout", "direct", 0.90,
     "The pandemic's urgency drove unprecedented vaccine development speed."),
    ("George Floyd", "BLM Global Protests", "direct", 0.90,
     "George Floyd's murder sparked the largest wave of BLM protests globally."),
    ("Russia Invades Ukraine", "Europe Rearmament", "direct", 0.85,
     "Russia's invasion of Ukraine prompted historic European defense spending increases."),
    ("ChatGPT Launches", "AI Revolution Accelerates", "direct", 0.80,
     "ChatGPT's launch catalyzed mainstream awareness and adoption of generative AI."),
    ("ChatGPT Launches", "DeepSeek R1", "contributing", 0.55,
     "ChatGPT's success spurred global AI competition, including China's DeepSeek."),
    ("OPEC", "Iranian Revolution", "contributing", 0.50,
     "The oil crisis demonstrated petroleum's geopolitical power and reshaped Middle Eastern politics."),
    ("Iranian Revolution", "Iran-Iraq War", "direct", 0.75,
     "The Islamic Revolution's upheaval and perceived weakness emboldened Iraq's invasion."),
    ("Iran-Iraq War", "Iraq Invades Kuwait", "contributing", 0.60,
     "Iraq's war debts and Saddam's militarism after the Iran-Iraq War drove the Kuwait invasion."),

    # DNA → biotech chain
    ("DNA Double Helix", "Human Genome Project", "direct", 0.80,
     "Watson and Crick's discovery launched molecular biology, culminating in the Human Genome Project."),
    ("Human Genome Project", "CRISPR Gene Editing", "direct", 0.70,
     "Genomic knowledge from the Human Genome Project enabled CRISPR's gene editing applications."),

    # Apartheid chain
    ("National Party Wins", "Nelson Mandela Release", "direct", 0.80,
     "International pressure and internal resistance to apartheid forced Mandela's release."),
    ("Nelson Mandela Release", "Apartheid", "direct", 0.90,
     "Mandela's release led directly to negotiations that ended apartheid."),
    ("Soweto Uprising", "Nelson Mandela Release", "contributing", 0.55,
     "The Soweto uprising intensified international anti-apartheid pressure."),

    # Space chain
    ("Sputnik", "Yuri Gagarin", "direct", 0.85,
     "The space race launched by Sputnik led to Gagarin's historic first human spaceflight."),

    # Rwandan genocide context
    ("Rwandan Genocide", "Darfur Genocide", "contributing", 0.40,
     "International failure to prevent Rwanda influenced responses (and non-responses) to Darfur."),
    ("Yugoslav Wars", "Srebrenica Massacre", "direct", 0.85,
     "The Yugoslav Wars' ethnic violence escalated to the Srebrenica genocide."),

    # Economic
    ("Global Financial Crisis", "Occupy Wall Street", "direct", 0.75,
     "The 2008 financial crisis's inequality and bailouts provoked the Occupy movement."),

    # Russia-Ukraine chain
    ("Euromaidan Revolution", "Russia Annexes Crimea", "direct", 0.90,
     "Ukraine's pro-European revolution prompted Russia's annexation of Crimea."),
    ("Russia Annexes Crimea", "Russia Invades Ukraine", "direct", 0.75,
     "The 2014 Crimean annexation was the precursor to Russia's full-scale 2022 invasion."),

    # Hong Kong
    ("Hong Kong Handover", "Hong Kong Protests", "indirect", 0.60,
     "The 1997 handover and eroding autonomy fueled Hong Kong's 2019 pro-democracy protests."),
]


async def seed_links(conn: asyncpg.Connection) -> None:
    print(f"Starting causality batch 2 — {len(LINKS)} links")
    inserted = 0
    skipped = 0
    failed = 0

    for cause_frag, effect_frag, link_type, strength, description in LINKS:
        # Find cause event
        cause_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{cause_frag}%",
        )
        if not cause_id:
            print(f"  [MISS] cause not found: '{cause_frag}'")
            failed += 1
            continue

        # Find effect event
        effect_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{effect_frag}%",
        )
        if not effect_id:
            print(f"  [MISS] effect not found: '{effect_frag}'")
            failed += 1
            continue

        if cause_id == effect_id:
            print(f"  [SKIP] same event: '{cause_frag}' → '{effect_frag}'")
            skipped += 1
            continue

        # Check for existing link
        existing = await conn.fetchval(
            "SELECT id FROM causality_links WHERE cause_event_id=$1 AND effect_event_id=$2",
            cause_id, effect_id,
        )
        if existing:
            print(f"  [skip] link exists: '{cause_frag}' → '{effect_frag}'")
            skipped += 1
            continue

        await conn.execute(
            """
            INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
            VALUES ($1, $2, $3, $4, $5, $6, 'approved')
            """,
            cause_id, effect_id, link_type, strength, description, CREATED_BY,
        )
        inserted += 1
        print(f"  [ok] '{cause_frag}' → '{effect_frag}'")

    total = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n✅ Causality batch 2 complete — {inserted} inserted, {skipped} skipped, {failed} not found")
    print(f"   Total causality links in DB: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed_links(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
