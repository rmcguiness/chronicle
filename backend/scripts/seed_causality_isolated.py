#!/usr/bin/env python3
"""
Chronicle causality links — connecting 692 isolated events to the graph.

Run:
    python backend/scripts/seed_causality_isolated.py
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

CREATED_BY = "seed_causality_v4"


# Format: (cause_title_fragment, effect_title_fragment, link_type, strength, description)
LINKS = [
    # ══════════════════════════════════════════════════════════════════
    # PREHISTORY & EARLY HUMANS
    # ══════════════════════════════════════════════════════════════════

    ("Homo erectus Emerges", "Homo heidelbergensis", "direct", 0.70,
     "Homo heidelbergensis evolved from Homo erectus populations in Europe and Africa."),
    ("Homo heidelbergensis", "Neanderthals Dominate", "direct", 0.75,
     "Neanderthals evolved from Homo heidelbergensis in Europe."),
    ("Homo erectus Controls Fire", "Earliest Evidence of Hunting with Wooden Spears", "contributing", 0.50,
     "Fire mastery enabled crafting of hardened wooden spears for hunting."),
    ("Anatomically Modern Humans Appear", "Denisovans Identified", "contributing", 0.35,
     "Modern humans and Denisovans coexisted and interbred in Asia."),
    ("Homo Sapiens Migration Out of Africa", "First Seafaring", "direct", 0.70,
     "Out-of-Africa migration drove coastal populations to develop seafaring to reach Crete."),
    ("Homo Sapiens Migration Out of Africa", "Migration to Papua New Guinea", "direct", 0.80,
     "The Out-of-Africa migration led to settlement of Sahul via island-hopping."),
    ("Homo Sapiens Migration Out of Africa", "Early Settlement of Central Asia", "direct", 0.75,
     "Central Asian settlement was part of the broader Out-of-Africa dispersal."),
    ("Homo Sapiens Migration Out of Africa", "Earliest Human Presence in Japan", "indirect", 0.50,
     "Migration waves from mainland Asia eventually reached the Japanese archipelago."),
    ("Behavioral Modernity", "Earliest Known Bow and Arrow", "contributing", 0.55,
     "Symbolic thought and behavioral modernity enabled complex projectile weapon design."),
    ("Behavioral Modernity", "Earliest Known Cave Art", "direct", 0.70,
     "Behavioral modernity and symbolic thought led to cave art traditions."),
    ("Behavioral Modernity", "Aboriginal Dreamtime Oral Traditions", "contributing", 0.60,
     "Symbolic cognition enabled complex oral traditions and cosmological narratives."),
    ("Settlement of Australia by First Peoples", "Aboriginal Dreamtime Oral Traditions", "direct", 0.75,
     "Settlement of Australia established the communities that developed Dreamtime traditions."),
    ("Behavioral Modernity", "Earliest Known Textile Production", "contributing", 0.45,
     "Complex cognition enabled invention of textile production techniques."),
    ("Earliest Known Cave Art", "Earliest Ceramic Figurines", "contributing", 0.40,
     "Artistic traditions in cave painting informed early three-dimensional art forms."),
    ("Migration to Papua New Guinea", "First Settlement of the Solomon Islands", "direct", 0.75,
     "Settlement of Sahul led to island-hopping expansion into the Solomon Islands."),
    ("Behavioral Modernity", "Earliest Evidence of Shamanic Practices", "contributing", 0.55,
     "Symbolic thought enabled ritual and shamanic belief systems."),
    ("Migration to Papua New Guinea", "Obsidian Trade Networks in New Britain", "contributing", 0.50,
     "Settlement of the region created communities that developed obsidian trade."),
    ("Early Settlement of Central Asia", "Mammoth Bone Dwellings", "contributing", 0.40,
     "Settlement of northern Eurasia led to adaptation including mammoth bone architecture."),

    # ══════════════════════════════════════════════════════════════════
    # NEOLITHIC & EARLY AGRICULTURE
    # ══════════════════════════════════════════════════════════════════

    ("Neolithic Revolution", "Earliest Beer Brewing", "contributing", 0.55,
     "Grain cultivation from the Neolithic Revolution enabled fermentation and brewing."),
    ("Neolithic Revolution", "Domestication of Lentils and Flax", "direct", 0.80,
     "The Neolithic agricultural revolution included domestication of lentils and flax."),
    ("Neolithic Revolution", "Ain Ghazal", "direct", 0.75,
     "Neolithic agriculture enabled large settled communities like Ain Ghazal."),
    ("Neolithic Revolution", "Khirokitia", "indirect", 0.50,
     "Agricultural knowledge spread to Cyprus, enabling settlements like Khirokitia."),
    ("Neolithic Revolution", "Pig Domestication in Anatolia", "direct", 0.70,
     "Animal domestication was a key component of the Neolithic Revolution."),
    ("Neolithic Revolution", "Earliest Evidence of Trepanation", "indirect", 0.35,
     "Settled Neolithic communities developed specialized knowledge including surgery."),
    ("Neolithic Revolution", "Earliest Known Woven Textiles", "contributing", 0.50,
     "Flax cultivation from the Neolithic enabled early textile weaving."),
    ("Domestication of Lentils and Flax", "Earliest Known Woven Textiles", "contributing", 0.60,
     "Flax domestication provided raw materials for early textile production."),
    ("Neolithic Revolution", "Earliest Pottery Production in the Near East", "contributing", 0.55,
     "Settled agricultural life increased the need for storage vessels, driving pottery innovation."),
    ("Neolithic Revolution", "Green Sahara Period", "contributing", 0.35,
     "Agricultural knowledge spread to Saharan pastoral cultures during the Green Sahara period."),
    ("Neolithic Revolution", "Independent Invention of Agriculture at Kuk Swamp", "indirect", 0.25,
     "Independent parallel development of agriculture in New Guinea highlands."),
    ("Independent Invention of Agriculture at Kuk Swamp", "New Guinea Highlands — Independent Invention", "direct", 0.90,
     "Same agricultural tradition in the New Guinea highlands."),
    ("Independent Invention of Agriculture at Kuk Swamp", "Taro and Yam Cultivation in New Guinea", "direct", 0.85,
     "Kuk Swamp agriculture centered on taro and yam cultivation."),
    ("Taro and Yam Cultivation in New Guinea", "Banana Cultivation Begins in Papua New Guinea", "contributing", 0.50,
     "Existing horticultural traditions facilitated adoption of banana cultivation."),
    ("Neolithic Revolution", "Earliest Wine Production", "contributing", 0.45,
     "Agricultural settlement and fruit cultivation enabled early wine production."),
    ("Neolithic Revolution", "Earliest Known Map — Çatalhöyük", "contributing", 0.50,
     "Çatalhöyük's Neolithic community produced the earliest known map."),
    ("Ain Ghazal", "Lepenski Vir", "indirect", 0.30,
     "Neolithic settlement patterns spread from the Near East toward southeastern Europe."),
    ("Neolithic Revolution", "Black Sea Flood Event", "indirect", 0.25,
     "Neolithic communities around the Black Sea were affected by the flood event."),
    ("Earliest Pottery Production in the Near East", "Vinča Culture", "contributing", 0.40,
     "Pottery traditions spread from the Near East to southeastern European cultures like Vinča."),
    ("Vinča Culture", "Vinča Symbols — Possible Proto-Writing", "direct", 0.85,
     "The Vinča culture produced symbolic markings that may represent proto-writing."),
    ("Green Sahara Period", "Saharan Pastoral Cultures — Cattle Herding", "direct", 0.80,
     "The Green Sahara period enabled cattle herding and pastoral cultures."),
    ("Neolithic Revolution", "Yangtze River Rice Farming Intensifies", "indirect", 0.40,
     "Independent development of rice farming in East Asia paralleled Near Eastern agriculture."),
    ("Yangtze River Rice Farming Intensifies", "Yangshao Culture", "contributing", 0.50,
     "Rice farming traditions contributed to the development of Yellow River cultures."),
    ("Yangtze River Rice Farming Intensifies", "Longshan Culture", "contributing", 0.55,
     "Intensified agriculture enabled the advanced Longshan Neolithic culture."),
    ("Neolithic Revolution", "Neolithic Revolution Reaches Britain", "direct", 0.80,
     "The Neolithic agricultural package spread westward to Britain."),
    ("Neolithic Revolution Reaches Britain", "Dolmen Construction Across Atlantic Europe", "contributing", 0.50,
     "Neolithic communities in Atlantic Europe built megalithic dolmens."),
    ("Neolithic Revolution", "Invention of the Plow", "direct", 0.75,
     "Agricultural intensification drove invention of the plow."),

    # Megalithic & early complex societies
    ("Dolmen Construction Across Atlantic Europe", "Carnac Megalithic Alignments", "contributing", 0.50,
     "Megalithic building traditions in Atlantic Europe included the Carnac alignments."),
    ("Dolmen Construction Across Atlantic Europe", "Newgrange Passage Tomb", "contributing", 0.55,
     "Atlantic European megalithic traditions produced Newgrange."),
    ("Newgrange Passage Tomb", "Skara Brae", "indirect", 0.35,
     "Neolithic communities in the British Isles built both passage tombs and village settlements."),
    ("Megalithic Temples of Malta", "Carnac Megalithic Alignments", "indirect", 0.30,
     "Mediterranean and Atlantic megalithic traditions shared cultural connections."),
    ("Saharan Pastoral Cultures", "Megalithic Stone Circles Emerge in Senegal", "contributing", 0.40,
     "Saharan pastoral cultures influenced megalithic traditions in West Africa."),
    ("First Copper Smelting — Balkans", "Earliest Gold Artifacts — Varna Necropolis", "contributing", 0.60,
     "Balkan metallurgy traditions produced both copper and gold working at Varna."),
    ("First Copper Smelting — Balkans", "Lost-Wax Casting Technique", "contributing", 0.45,
     "Early metallurgy advances in the Balkans contributed to casting techniques."),
    ("Settlement of Australia by First Peoples", "Budj Bim Eel Aquaculture", "contributing", 0.45,
     "Aboriginal settlement led to sophisticated aquaculture systems like Budj Bim."),
    ("Settlement of Australia by First Peoples", "Brewarrina Fish Traps", "contributing", 0.45,
     "Aboriginal engineering traditions produced ancient fish trap systems."),
    ("Migration to Papua New Guinea", "Jōmon Deep-Sea Fishing", "indirect", 0.30,
     "Pacific maritime adaptation traditions paralleled Japanese Jōmon fishing culture."),

    # ══════════════════════════════════════════════════════════════════
    # BRONZE AGE CIVILIZATIONS
    # ══════════════════════════════════════════════════════════════════

    ("Invention of the Plow", "Temple Economy Develops in Sumerian Cities", "contributing", 0.55,
     "Agricultural intensification enabled surplus-based temple economies in Sumer."),
    ("Temple Economy Develops in Sumerian Cities", "Ur-Nammu Founds the Third Dynasty of Ur", "contributing", 0.50,
     "Sumerian city-state traditions culminated in Ur-Nammu's centralized dynasty."),
    ("Ur-Nammu Founds the Third Dynasty of Ur", "Hammurabi Ascends to Power", "indirect", 0.45,
     "Ur III's legal and administrative traditions influenced Hammurabi's Babylon."),
    ("Cycladic Civilization", "Construction of the Palace at Knossos", "contributing", 0.45,
     "Aegean Bronze Age traditions contributed to Minoan palatial civilization."),
    ("Construction of the Palace at Knossos", "Palace of Knossos Built", "direct", 0.90,
     "The first palace at Knossos was rebuilt into the grander New Palace period structure."),
    ("Palace of Knossos Built", "Linear A Script", "direct", 0.80,
     "Minoan palatial administration at Knossos required the Linear A writing system."),
    ("Minoan Eruption of Thera", "Rise of Mycenaean Greece", "contributing", 0.55,
     "Thera's eruption weakened Minoan civilization, allowing Mycenaean ascendancy."),
    ("Rise of Mycenaean Greece", "Linear B Writing System", "direct", 0.75,
     "Mycenaean administrative needs produced the Linear B script adapted from Minoan Linear A."),
    ("Rise of Mycenaean Greece", "Battle of Megiddo", "indirect", 0.30,
     "Bronze Age great powers including Mycenaean Greece were contemporaries of Egyptian campaigns."),
    ("Hammurabi Ascends to Power", "Amarna Letters", "indirect", 0.35,
     "Babylonian diplomatic traditions established by Hammurabi continued in Amarna-era correspondence."),
    ("Hittite Empire at Its Peak", "Amarna Letters", "contributing", 0.55,
     "The Hittite Empire was a major participant in Amarna diplomatic correspondence."),
    ("Hittite Empire at Its Peak", "Treaty of Kadesh", "direct", 0.80,
     "The Hittite Empire's clash with Egypt at Kadesh produced the first known peace treaty."),
    ("Ramesses II Builds Abu Simbel", "Treaty of Kadesh", "contributing", 0.40,
     "Ramesses II commemorated the Kadesh campaign at Abu Simbel."),
    ("Expulsion of the Hyksos", "Battle of Megiddo", "contributing", 0.50,
     "Egyptian military resurgence after expelling the Hyksos led to Thutmose III's Megiddo campaign."),
    ("Expulsion of the Hyksos", "Egyptian Book of the Dead", "contributing", 0.40,
     "New Kingdom cultural flowering after Hyksos expulsion produced the Book of the Dead."),
    ("Burial of Tutankhamun", "Ramesses II Builds Abu Simbel", "indirect", 0.30,
     "Tutankhamun's restoration of traditional religion preceded Ramesses II's monumental building."),

    # Shang & Zhou
    ("Shang Dynasty Oracle Bone Writing", "Zhou Dynasty and the Mandate of Heaven", "contributing", 0.55,
     "Shang writing traditions were inherited and adapted by the Zhou Dynasty."),
    ("Zhou Dynasty and the Mandate of Heaven", "Spring and Autumn Period Begins", "direct", 0.85,
     "Zhou Dynasty's weakening led to the fragmented Spring and Autumn Period."),

    # Late Bronze Age Collapse chain
    ("Sea Peoples Invasions", "Bronze Age Collapse", "direct", 0.75,
     "Sea Peoples invasions destabilized interconnected Bronze Age Mediterranean civilizations."),
    ("Bronze Age Collapse", "Iron Age Begins", "direct", 0.80,
     "Bronze Age collapse disrupted tin trade, accelerating iron adoption."),
    ("Bronze Age Collapse", "Destruction of Ugarit", "direct", 0.85,
     "The Bronze Age Collapse destroyed Ugarit along with other Late Bronze Age trading cities."),
    ("Sea Peoples Invasions", "Destruction of Ugarit", "direct", 0.75,
     "Sea Peoples attacks directly led to the destruction of Ugarit."),

    # ══════════════════════════════════════════════════════════════════
    # IRON AGE & CLASSICAL PERIOD (-1000 to -300)
    # ══════════════════════════════════════════════════════════════════

    # Israel/Judah
    ("Kingdom of Israel Divided — Judah and Israel", "United Kingdom of Israel Under King David", "direct", 0.50,
     "David's united kingdom was the predecessor state that later split."),
    ("United Kingdom of Israel Under King David", "Construction of Solomon's Temple", "direct", 0.80,
     "David's son Solomon built the Temple in Jerusalem using the united kingdom's resources."),
    ("Construction of Solomon's Temple", "Kingdom of Israel Divided", "contributing", 0.50,
     "Solomon's heavy taxation for Temple construction contributed to the kingdom's division."),
    ("Assyrian Conquest of the Kingdom of Israel", "Sargon II Conquers the Kingdom of Israel", "direct", 0.90,
     "Sargon II completed the Assyrian conquest and exile of the northern kingdom."),

    # Zoroastrianism
    ("Zoroaster Founds Zoroastrianism", "Cyrus the Great Founds", "contributing", 0.45,
     "Zoroastrian values influenced the Achaemenid Persian worldview and governance."),

    # Kush
    ("Rise of the Kingdom of Kush", "Kingdom of Kush Conquers Egypt", "direct", 0.80,
     "Kush's growing power culminated in the conquest of Egypt as the 25th Dynasty."),
    ("Kingdom of Kush Conquers Egypt", "Ashurbanipal Sacks Thebes", "direct", 0.65,
     "Assyria's campaign against Kushite-ruled Egypt led to Ashurbanipal sacking Thebes."),
    ("Ashurbanipal Sacks Thebes", "Late Period Egypt — Saite Dynasty", "direct", 0.70,
     "After Assyrian withdrawal from Egypt, the Saite Dynasty launched Egypt's Late Period revival."),

    # Assyrian chain
    ("Tiglath-Pileser III Reforms", "Sargon II Conquers", "direct", 0.70,
     "Tiglath-Pileser III's military reforms enabled Sargon II's conquests."),
    ("Sargon II Conquers", "Library of Ashurbanipal", "indirect", 0.40,
     "Assyrian imperial power culminated in Ashurbanipal's cultural achievements."),
    ("Library of Ashurbanipal", "Fall of Nineveh", "indirect", 0.30,
     "The library was preserved by the very destruction of Nineveh that buried it."),
    ("Battle of Qarqar", "Tiglath-Pileser III Reforms", "contributing", 0.40,
     "The inconclusive Battle of Qarqar motivated later Assyrian military reforms."),

    # Greek developments
    ("Draco's Law Code in Athens", "Solon's Reforms in Athens", "direct", 0.75,
     "Draco's harsh legal code was reformed and humanized by Solon's later legislation."),
    ("Phoenicians Found Carthage", "Greek Colonization of the Mediterranean", "contributing", 0.45,
     "Phoenician colonization, including Carthage, spurred competing Greek colonial expansion."),
    ("Spartan Reforms of Lycurgus", "Battle of Thermopylae", "contributing", 0.60,
     "Lycurgus's warrior-state reforms created the Spartan military culture that fought at Thermopylae."),
    ("Etruscans Dominate Central Italy", "Founding of the Roman Republic", "direct", 0.70,
     "Rome's expulsion of Etruscan kings led to the founding of the Republic."),

    # Babylonian/Persian chain
    ("Fall of Nineveh", "Neo-Babylonian Empire Under Nebuchadnezzar", "direct", 0.80,
     "Nineveh's fall ended Assyrian dominance and enabled Babylon's rise under Nebuchadnezzar."),
    ("Neo-Babylonian Empire Under Nebuchadnezzar", "Hanging Gardens of Babylon", "direct", 0.85,
     "Nebuchadnezzar built the legendary Hanging Gardens during Babylon's golden age."),
    ("Neo-Babylonian Empire Under Nebuchadnezzar", "Ishtar Gate of Babylon", "direct", 0.85,
     "Nebuchadnezzar constructed the magnificent Ishtar Gate during Babylon's rebuilding."),
    ("Babylonian Captivity", "Cyrus Conquers Babylon", "contributing", 0.55,
     "The Jewish captivity in Babylon ended when Cyrus conquered the city."),
    ("Cyrus the Great Founds the Achaemenid", "Construction of Persepolis", "direct", 0.80,
     "The Achaemenid Empire's wealth funded construction of the ceremonial capital Persepolis."),
    ("Cyrus the Great Founds the Achaemenid", "Persian Qanat System", "contributing", 0.45,
     "Persian imperial administration promoted qanat water engineering across the empire."),
    ("Earliest World Map — Babylonian Imago Mundi", "Eratosthenes Calculates", "indirect", 0.30,
     "Babylonian cartographic traditions influenced later Greek geographical thinking."),

    # Philosophy and religion
    ("Siddhartha Gautama (Buddha) Born", "Mahavira Establishes Jainism", "indirect", 0.30,
     "Buddha and Mahavira were contemporaries in the Indian Axial Age religious ferment."),
    ("Pythagoras Establishes His School", "Euclid Writes Elements", "indirect", 0.50,
     "Pythagorean mathematical traditions influenced Euclid's systematic geometry."),
    ("Solon's Reforms in Athens", "Cleisthenes Establishes Athenian Democracy", "direct", 0.75,
     "Solon's political reforms laid groundwork for Cleisthenes' full democracy."),
    ("Cleisthenes Establishes Athenian Democracy", "Conflict of the Orders", "indirect", 0.35,
     "Athenian democratic ideas influenced Roman plebeian demands for political rights."),
    ("Mahajanapadas — Sixteen Kingdoms", "Siddhartha Gautama (Buddha) Born", "contributing", 0.45,
     "The political fragmentation of the Mahajanapadas provided context for Buddha's teachings."),
    ("Homer Composes the Iliad", "First Olympic Games", "indirect", 0.35,
     "Homeric epic culture and Panhellenic festivals both emerged in the Greek cultural revival."),
    ("Laozi and the Origins of Taoism", "Confucius", "indirect", 0.30,
     "Laozi and Confucius were contemporaries in China's Axial Age philosophical flowering."),
    ("Spring and Autumn Period Begins", "Confucius", "contributing", 0.55,
     "The political chaos of the Spring and Autumn Period motivated Confucius's moral philosophy."),
    ("Panini Composes Sanskrit Grammar", "Panini's Ashtadhyayi", "direct", 0.95,
     "Same event — Panini's Ashtadhyayi is the Sanskrit grammar."),

    # First coins
    ("First Coins Minted in Lydia", "Greek Colonization", "contributing", 0.40,
     "Lydian coinage facilitated Mediterranean trade and Greek colonial commerce."),
    ("Phoenician Sailors Circumnavigate Africa", "Greek Colonization", "indirect", 0.30,
     "Phoenician maritime achievements inspired Greek exploration and colonization."),

    # Carthage / Rome
    ("Phoenicians Found Carthage", "First Punic War", "contributing", 0.55,
     "Carthage's Phoenician-founded maritime empire inevitably clashed with expanding Rome."),
    ("Gauls Sack Rome", "Samnite Wars", "contributing", 0.45,
     "Rome's recovery and military reforms after the Gallic sack drove expansion into Samnite territory."),
    ("Samnite Wars", "Pyrrhic War", "direct", 0.60,
     "Rome's consolidation of central Italy through the Samnite Wars provoked Pyrrhus's intervention."),
    ("Pyrrhic War", "First Punic War", "contributing", 0.55,
     "Rome's victory over Pyrrhus established dominance in southern Italy, leading to conflict with Carthage over Sicily."),

    # Alexander's aftermath and Hellenistic
    ("Alexander the Great Reaches India", "Maurya-Seleucid War", "contributing", 0.50,
     "Alexander's Indian campaign left Hellenistic garrisons that the Mauryas later confronted."),
    ("Death of Alexander", "Seleucus I Founds Antioch", "direct", 0.80,
     "Seleucus carved out his empire after Alexander's death and founded Antioch as its capital."),
    ("Library of Alexandria Founded", "Archimedes Studies at Alexandria", "direct", 0.70,
     "Alexandria's intellectual environment attracted Archimedes to study there."),
    ("Library of Alexandria Founded", "Eratosthenes Calculates Earth's Circumference", "direct", 0.75,
     "Eratosthenes served as head of the Library of Alexandria where he made his calculation."),
    ("Archimedes Studies at Alexandria", "Eratosthenes Calculates", "indirect", 0.35,
     "Both scholars were products of Alexandria's Hellenistic intellectual environment."),
    ("Colossus of Rhodes", "Hellenistic Kingdoms", "contributing", 0.40,
     "The Colossus was built to celebrate Rhodian victory in the Wars of the Diadochi."),
    ("Kautilya's Arthashastra", "Chandragupta Maurya Founds", "contributing", 0.60,
     "Kautilya (Chanakya) was Chandragupta's chief advisor who wrote the Arthashastra."),
    ("Seleucid Empire Controls", "Arsaces I Founds Parthian Dynasty", "direct", 0.65,
     "Arsaces I revolted against weakening Seleucid control to found the Parthian dynasty."),
    ("Arsaces I Founds Parthian Dynasty", "Mithridates I Conquers", "direct", 0.80,
     "Mithridates I expanded the Parthian Empire founded by Arsaces into a major power."),
    ("Mithridates I Conquers", "Parthian Empire at Its Height", "direct", 0.75,
     "Mithridates I's conquests set the stage for the Parthian Empire's peak."),
    ("Seleucid Empire Controls", "Antiochus III Reconquers", "direct", 0.75,
     "Antiochus III attempted to restore Seleucid power in the eastern provinces."),
    ("Antiochus III Reconquers", "Maccabean Revolt Against Antiochus IV", "contributing", 0.50,
     "Seleucid overreach under Antiochus III's successors provoked the Maccabean revolt."),
    ("Seleucid Empire Controls", "Maccabean Revolt", "contributing", 0.55,
     "Seleucid religious persecution under Antiochus IV triggered the Jewish revolt."),

    # Americas early
    ("Norte Chico Civilization", "Nazca Lines", "indirect", 0.30,
     "Early Andean civilizations like Norte Chico established cultural traditions that influenced later Nazca culture."),
    ("Olmec Colossal Heads at San Lorenzo", "Olmec Civilization Emerges at San Lorenzo", "direct", 0.90,
     "The colossal heads are products of the Olmec civilization at San Lorenzo."),
    ("Olmec Civilization Emerges at San Lorenzo", "La Venta Becomes Primary Olmec", "direct", 0.85,
     "After San Lorenzo declined, La Venta became the primary Olmec center."),
    ("Olmec Civilization Emerges at San Lorenzo", "Earliest Mesoamerican Writing and Zero", "contributing", 0.55,
     "Olmec civilization produced the earliest Mesoamerican writing and zero concept."),
    ("Olmec Civilization Emerges at San Lorenzo", "Olmec Civilization at La Venta", "direct", 0.85,
     "La Venta succeeded San Lorenzo as the main Olmec center."),
    ("Chavín de Huántar", "Nazca Lines Created", "indirect", 0.35,
     "Chavín religious traditions influenced later Andean cultures including the Nazca."),
    ("Chavín de Huántar", "Creation of the Nazca Lines", "indirect", 0.35,
     "Andean cultural traditions from Chavín influenced later Nazca geoglyph traditions."),
    ("Monte Albán Founded by Zapotecs", "Earliest Mesoamerican Writing", "contributing", 0.50,
     "Zapotec writing at Monte Albán contributed to Mesoamerican script traditions."),
    ("Lapita People Expand into the Pacific", "Lapita Peoples Expand Across the Pacific", "direct", 0.95,
     "Same Lapita expansion event."),
    ("Lapita People Expand into the Pacific", "First Settlement of Fiji", "direct", 0.80,
     "Lapita peoples were the first settlers of Fiji during their Pacific expansion."),
    ("Torres Strait Islands Maritime Trade", "Settlement of Australia by First Peoples", "contributing", 0.35,
     "Aboriginal settlement enabled later Torres Strait maritime trade networks."),

    # ══════════════════════════════════════════════════════════════════
    # CLASSICAL WORLD — ROME, CHINA, INDIA (-300 to 500 CE)
    # ══════════════════════════════════════════════════════════════════

    # Han China
    ("Silk Road Established", "Chinese Silk Reaches Roman Markets", "direct", 0.75,
     "The Silk Road enabled Chinese silk to reach Roman markets."),
    ("Silk Road Established", "Han Dynasty Extends Great Wall", "contributing", 0.50,
     "Silk Road security required extending the Great Wall into Central Asia."),
    ("Han Dynasty Extends Great Wall", "Han China's War for the Heavenly Horses", "contributing", 0.50,
     "Han westward expansion including wall-building led to the Ferghana campaign."),
    ("Emperor Wu Adopts Confucianism", "Han Dynasty — China's Confucian Imperial", "direct", 0.85,
     "Emperor Wu's adoption of Confucianism made it China's state ideology."),
    ("Empress Lü Regency", "Emperor Wu Adopts Confucianism", "indirect", 0.30,
     "Empress Lü's regency was part of early Han political evolution before Wu's reforms."),
    ("Sima Qian Writes Records", "Ban Zhao — China's First Female Historian", "indirect", 0.45,
     "Sima Qian's historical tradition directly inspired Ban Zhao's continuation of the Han histories."),

    # Parthia vs Rome
    ("Parthian Empire at Its Height", "Battle of Carrhae", "direct", 0.75,
     "Parthian military power at its height destroyed Crassus's legions at Carrhae."),
    ("Parthian Empire at Its Height", "Parthian Shot", "direct", 0.70,
     "The Parthian shot tactic was perfected during the empire's military peak."),
    ("Battle of Carrhae", "Ctesiphon Becomes Parthian", "contributing", 0.40,
     "Parthia's victory over Rome secured its western frontier, enabling Ctesiphon's development."),
    ("Parthian Empire at Its Height", "Ctesiphon Becomes Parthian Winter Capital", "contributing", 0.55,
     "Ctesiphon grew in importance as the Parthian Empire consolidated power in Mesopotamia."),

    # Roman Empire
    ("Augustus Becomes First Roman Emperor", "Colosseum Completed", "indirect", 0.40,
     "The imperial system Augustus created enabled monumental public building like the Colosseum."),
    ("Roman Empire Under Trajan", "Trajan's Column", "direct", 0.90,
     "Trajan's Column commemorated his Dacian Wars during Rome's greatest territorial extent."),
    ("Hadrian's Wall Built", "Hadrian Rebuilds the Pantheon", "contributing", 0.40,
     "Hadrian's building program included both frontier walls and the Pantheon's reconstruction."),
    ("Dead Sea Scrolls Written at Qumran", "Dead Sea Scrolls Hidden in Qumran Caves", "direct", 0.90,
     "The scrolls written at Qumran were hidden in nearby caves during the Jewish revolt."),
    ("Bar Kokhba Revolt", "Dead Sea Scrolls Hidden", "contributing", 0.55,
     "The Bar Kokhba revolt's violence likely prompted hiding of the Dead Sea Scrolls."),
    ("Rosetta Stone Decree", "Ptolemy's Almagest", "indirect", 0.25,
     "Both were products of Ptolemaic/Roman Alexandria's intellectual tradition."),

    # India — Gupta
    ("Samudragupta's Conquests", "Gupta Empire — India's Golden Age", "direct", 0.80,
     "Samudragupta's military expansion created the territorial basis for the Gupta Golden Age."),
    ("Gupta Empire — India's Golden Age", "Nalanda University Flourishes Under Gupta", "direct", 0.80,
     "Gupta imperial patronage enabled Nalanda University's flourishing."),
    ("Gupta Empire — India's Golden Age", "Gupta-Era Development of Decimal Numeral System", "direct", 0.85,
     "The Gupta Golden Age produced the decimal numeral system."),
    ("Aryabhata", "Gupta-Era Development of Decimal Numeral", "contributing", 0.60,
     "Aryabhata's mathematical work was part of the Gupta-era decimal numeral tradition."),
    ("Sri Lanka's Ancient Hydraulic Civilization", "Chera Dynasty Dominates Indian Ocean", "indirect", 0.30,
     "South Asian maritime and engineering traditions connected Sri Lanka and the Chera kingdom."),

    # Aksum
    ("Kingdom of Aksum Founded", "Aksum Stelae Erected", "direct", 0.75,
     "The stelae were monuments of the Aksumite kingdom's power."),
    ("Kingdom of Aksum Founded", "Great Stelae of Aksum Erected", "direct", 0.75,
     "Aksum's great stelae were products of the kingdom's monumental building tradition."),
    ("Kingdom of Aksum Converts to Christianity", "Kingdom of Aksum Adopts Christianity", "direct", 0.95,
     "Same event — Aksum's conversion to Christianity."),
    ("Kingdom of Aksum", "Adulis — Aksumite Red Sea Trade Hub", "direct", 0.75,
     "Adulis was Aksum's primary Red Sea trading port."),
    ("Bantu Expansion Across Sub-Saharan Africa", "Bantu Peoples Spread Ironworking", "direct", 0.85,
     "The Bantu expansion spread ironworking technology across central and eastern Africa."),
    ("Bantu Peoples Spread Ironworking", "Bantu Migrants Reach East African Great Lakes", "direct", 0.80,
     "Bantu migration with ironworking reached the Great Lakes region."),
    ("Bantu Migrants Reach East African Great Lakes", "Bantu Peoples Reach Southern Africa", "direct", 0.75,
     "Bantu migration continued from the Great Lakes to southern Africa."),
    ("Jenne-Jeno", "Ghana Empire Emerges", "contributing", 0.40,
     "West African urbanization at Jenne-Jeno preceded and influenced Ghana Empire formation."),

    # Southeast Asia
    ("Kingdom of Funan", "Funan Kingdom — Earliest Southeast Asian State", "direct", 0.95,
     "Same event — Funan kingdom founding."),
    ("Kingdom of Funan", "Founding of the Champa Kingdom", "contributing", 0.40,
     "Funan's Indianized state model influenced the founding of Champa."),
    ("Founding of the Champa Kingdom", "Kingdom of Champa — Hindu Maritime", "direct", 0.95,
     "Same event — Champa kingdom."),
    ("Founding of the Champa Kingdom", "Rise of the Kingdom of Champa", "direct", 0.95,
     "Same event — Champa's rise."),

    # Late Rome
    ("Plague of Justinian", "Fall of the Western Roman Empire", "indirect", 0.35,
     "The plague weakened Mediterranean populations decades after Rome's fall, preventing reconquest."),
    ("Justinian I Becomes Byzantine Emperor", "Empress Theodora — Byzantine Legal Reforms", "direct", 0.80,
     "Theodora's reforms were enacted during Justinian's reign as his co-ruler."),
    ("Corpus Juris Civilis", "Empress Theodora", "contributing", 0.55,
     "Theodora influenced Justinian's legal reforms including women's property rights."),
    ("Fall of the Western Roman Empire", "Theodoric the Great Founds Ostrogothic Kingdom", "direct", 0.80,
     "Rome's fall enabled Theodoric to establish the Ostrogothic Kingdom in Italy."),
    ("Fall of the Western Roman Empire", "Boethius Writes The Consolation of Philosophy", "contributing", 0.50,
     "The post-Roman world's instability led to Boethius's imprisonment and philosophical writing."),
    ("Theodoric the Great Founds Ostrogothic Kingdom", "Boethius Writes The Consolation", "direct", 0.70,
     "Theodoric imprisoned and executed Boethius, who wrote the Consolation in prison."),
    ("Council of Nicaea", "Council of Chalcedon", "direct", 0.75,
     "Chalcedon continued Nicaea's work of defining Christian orthodox theology."),
    ("Council of Chalcedon", "Kingdom of Aksum Adopts Christianity", "indirect", 0.35,
     "Chalcedon's theological definitions shaped the non-Chalcedonian Christianity Aksum adopted."),

    # Sassanid
    ("Ardashir I Defeats Last Parthian King", "Sassanid Empire Founded", "direct", 0.95,
     "Ardashir's defeat of the Parthians founded the Sassanid dynasty."),
    ("Sassanid Empire Founded", "Shapur I Captures Roman Emperor Valerian", "direct", 0.70,
     "Sassanid military power enabled Shapur I's stunning capture of a Roman emperor."),
    ("Sassanid Empire Founded", "Khosrow I's Golden Age", "contributing", 0.50,
     "Sassanid imperial foundations enabled Khosrow I's cultural golden age centuries later."),
    ("Khosrow I's Golden Age", "Battle of Dara — Belisarius", "contributing", 0.40,
     "Sassanid military power under Khosrow's era clashed with Belisarius's Byzantine forces."),

    # Mesoamerica
    ("Teotihuacan Intervenes in Tikal", "Star War of Tikal — Calakmul", "contributing", 0.45,
     "Teotihuacan's interventions destabilized Maya politics, contributing to Calakmul-Tikal rivalry."),
    ("Maya Classical Period Begins", "Star War of Tikal", "contributing", 0.40,
     "Classic Maya interstate rivalries produced the devastating Star War between Tikal and Calakmul."),
    ("Moche Civilization Flourishes", "Lord of Sipán — Moche Royal Tomb", "direct", 0.85,
     "The Lord of Sipán was a Moche ruler buried during the civilization's flourishing."),

    # Pacific
    ("Lapita People Expand", "Polynesian Settlement of Samoa and Tonga", "direct", 0.80,
     "Lapita peoples settled Samoa and Tonga during their Pacific expansion."),
    ("Polynesian Settlement of Samoa and Tonga", "Polynesians Settle Hawaii", "indirect", 0.55,
     "Polynesian expansion from Samoa/Tonga eventually reached distant Hawaii."),
    ("Polynesian Settlement of Samoa and Tonga", "Polynesian Settlement of Hawai'i", "indirect", 0.55,
     "Same expansion pattern from central to peripheral Polynesia."),
    ("Polynesian Celestial Navigation", "Polynesians Settle Hawaii", "contributing", 0.60,
     "Polynesian navigational mastery enabled the settlement of remote Hawaii."),

    # ══════════════════════════════════════════════════════════════════
    # EARLY MEDIEVAL (500-1000)
    # ══════════════════════════════════════════════════════════════════

    # Monasticism
    ("Benedict of Nursia Founds Monte Cassino", "Rule of Saint Benedict", "direct", 0.90,
     "Benedict wrote his Rule at Monte Cassino, founding Western monasticism."),
    ("Rule of Saint Benedict", "Saint Columba Founds Iona Monastery", "contributing", 0.40,
     "Benedictine and Celtic monastic traditions both spread Christianity across Europe."),
    ("Rule of Saint Benedict", "Book of Kells", "indirect", 0.35,
     "Monastic traditions fostered the illuminated manuscript tradition that produced the Book of Kells."),
    ("Saint Columba Founds Iona Monastery", "Synod of Whitby", "contributing", 0.55,
     "Columba's Celtic Christianity clashed with Roman traditions, resolved at the Synod of Whitby."),
    ("Synod of Whitby", "Bede Completes Ecclesiastical History", "contributing", 0.45,
     "Whitby's resolution influenced Bede's historical perspective on English Christianity."),
    ("Isidore of Seville's Etymologiae", "Bede Completes Ecclesiastical History", "contributing", 0.40,
     "Isidore's encyclopedic approach influenced Bede's scholarly methodology."),

    # Islamic expansion
    ("Constitution of Medina", "Ridda Wars", "contributing", 0.55,
     "The Medina political community Muhammad established needed reconsolidation after his death."),
    ("Ridda Wars", "Siege of Damascus", "direct", 0.75,
     "Abu Bakr's reunification of Arabia after the Ridda Wars launched external conquests."),
    ("Siege of Damascus", "Battle of al-Qadisiyyah", "direct", 0.70,
     "Early Arab victories at Damascus enabled the deeper campaign against Sassanid Iraq."),
    ("Battle of al-Qadisiyyah", "Muslim Conquest of Egypt", "contributing", 0.55,
     "Arab momentum after defeating the Sassanids at Qadisiyyah fueled the Egyptian conquest."),
    ("Battle of al-Qadisiyyah", "Fall of the Sasanian Empire", "direct", 0.85,
     "The defeat at Qadisiyyah was the beginning of the end for the Sasanian Empire."),
    ("Fall of the Sasanian Empire", "Assassination of Ali", "contributing", 0.40,
     "Post-conquest political disputes over ruling the new empire led to Ali's assassination."),
    ("Assassination of Ali", "Battle of Karbala", "direct", 0.85,
     "Ali's assassination and the resulting Umayyad takeover led to Husayn's martyrdom at Karbala."),
    ("Battle of Karbala", "Abu Muslim's Rebellion in Khorasan", "contributing", 0.45,
     "Shia grievances from Karbala fueled the Abbasid revolutionary movement in Khorasan."),
    ("Abu Muslim's Rebellion in Khorasan", "Abbasid Massacre of the Umayyad Dynasty", "direct", 0.80,
     "Abu Muslim's revolt brought the Abbasids to power, who massacred the Umayyads."),
    ("Muslim Conquest of Egypt", "Fatimids Found Cairo", "indirect", 0.40,
     "The Arab conquest of Egypt eventually led to the Fatimid founding of Cairo centuries later."),
    ("Fatimids Found Cairo", "Al-Azhar University Founded", "direct", 0.85,
     "The Fatimids founded Al-Azhar as a center of Ismaili learning in their new capital Cairo."),

    # Byzantine
    ("Avar-Sassanid Siege of Constantinople", "Emperor Heraclius Defeats Sassanid Persia", "direct", 0.75,
     "Constantinople's survival enabled Heraclius's counterattack against the Sassanids."),
    ("Emperor Heraclius Defeats Sassanid Persia", "Fall of the Sasanian Empire", "contributing", 0.60,
     "Heraclius's campaigns fatally weakened Persia, making it vulnerable to Arab conquest."),
    ("Greek Fire Invented", "Second Arab Siege of Constantinople", "contributing", 0.65,
     "Greek fire was crucial in repelling the Arab siege of Constantinople."),
    ("Second Arab Siege of Constantinople", "Byzantine Iconoclasm Begins", "contributing", 0.40,
     "The siege's aftermath and cultural crisis contributed to the iconoclasm controversy."),
    ("Byzantine Iconoclasm Begins", "End of Byzantine Iconoclasm — Triumph of Orthodoxy", "direct", 0.90,
     "Iconoclasm ended with the Triumph of Orthodoxy in 843."),
    ("Byzantine Iconoclasm Begins", "Triumph of Orthodoxy — End of Byzantine Iconoclasm", "direct", 0.90,
     "The iconoclasm controversy ended with the restoration of icon veneration."),
    ("Basil I Founds the Macedonian Dynasty", "Macedonian Dynasty — Byzantine Cultural", "direct", 0.95,
     "Same dynasty — Basil I founded the Macedonian Dynasty."),
    ("Macedonian Dynasty", "Byzantine Reconquest Under Nikephoros", "direct", 0.75,
     "The Macedonian Dynasty's military revival enabled Nikephoros II's reconquests."),
    ("Byzantine Reconquest Under Nikephoros", "Byzantine Reconquest of Crete", "direct", 0.85,
     "Nikephoros II personally led the reconquest of Crete from the Arabs."),
    ("Macedonian Dynasty", "Byzantine Art Renaissance", "direct", 0.70,
     "The Macedonian Dynasty's stability enabled a flowering of Byzantine art."),

    # Japan
    ("Prince Shōtoku's Reforms in Japan", "Taika Reform — Japan Centralizes", "direct", 0.70,
     "Shōtoku's reforms initiated Japanese centralization that the Taika Reform continued."),
    ("Taika Reform", "Nara Period Begins", "direct", 0.75,
     "The Taika centralization reforms led to the establishment of Nara as Japan's first permanent capital."),
    ("Nara Period Begins", "Great Buddha of Todai-ji", "direct", 0.80,
     "The Great Buddha at Todai-ji was commissioned during the Nara period."),
    ("Nara Period Begins", "Heian Period Begins", "direct", 0.80,
     "The Nara period ended when the capital moved to Kyoto, beginning the Heian period."),
    ("Heian Period Begins", "Development of Kana Script", "direct", 0.75,
     "Kana script was developed during the Heian period for Japanese literary expression."),
    ("Heian Period Begins", "Fujiwara Clan Regency Reaches Peak", "direct", 0.70,
     "The Fujiwara clan dominated politics during the Heian period."),
    ("Development of Kana Script", "Sei Shōnagon Writes The Pillow Book", "contributing", 0.60,
     "Kana script enabled Japanese women writers like Sei Shōnagon to write in their native language."),
    ("Silla Unifies Korean Peninsula", "Goryeo Dynasty Founded", "direct", 0.70,
     "Silla's decline led to the founding of the Goryeo Dynasty that reunified Korea."),
    ("Wu Zetian Becomes Empress", "Empress Wu Zetian Establishes Zhou Dynasty", "direct", 0.95,
     "Same ruler — Wu Zetian established her own dynasty."),
    ("Tang Golden Age of Poetry", "Chang'an — World's Largest City", "contributing", 0.50,
     "Tang cultural and poetic golden age centered on the imperial capital Chang'an."),
    ("Silk Road at Its Peak", "Tang Golden Age of Poetry", "contributing", 0.40,
     "Silk Road cosmopolitanism enriched Tang culture and poetry."),
    ("Silk Road at Its Peak", "Chang'an — World's Largest City", "contributing", 0.55,
     "Silk Road trade made Chang'an the cosmopolitan center of the Tang world."),
    ("Silk Road at Its Peak", "Sogdian Ancient Letters", "contributing", 0.50,
     "Sogdian merchants thrived on the Silk Road at its peak."),

    # Tang military crisis
    ("An Lushan Captures Luoyang", "Siege of Suiyang", "direct", 0.85,
     "Suiyang's heroic defense was part of the resistance to An Lushan's rebellion."),
    ("Siege of Suiyang", "Tang Forces Recapture Chang'an", "contributing", 0.60,
     "Suiyang's defense bought time for Tang loyalists to recapture the capital."),
    ("An Lushan Captures Luoyang", "Tang Forces Recapture Chang'an", "direct", 0.75,
     "The An Lushan Rebellion's capture of Luoyang provoked the Tang counteroffensive."),

    # Carolingian
    ("Pepin the Short's Alliance with the Pope", "Donation of Pepin — Papal States", "direct", 0.90,
     "Pepin's alliance with the Pope led to his donation creating the Papal States."),
    ("Donation of Pepin", "Charlemagne's Saxon Wars", "contributing", 0.40,
     "Papal-Frankish alliance motivated Charlemagne's forced Christianization of Saxons."),
    ("Treaty of Verdun", "Great Moravia", "contributing", 0.35,
     "The fragmentation of Charlemagne's empire after Verdun enabled Slavic state formation."),
    ("Great Moravia", "Cyril and Methodius — Apostles to the Slavs", "direct", 0.70,
     "Cyril and Methodius were invited to Great Moravia to create a Slavic liturgy."),
    ("Cyril and Methodius", "Christianization of Poland under Mieszko", "indirect", 0.40,
     "Slavic Christian missions influenced Poland's later conversion."),
    ("Cyril and Methodius", "Vladimir I's Mass Baptism", "indirect", 0.40,
     "The Slavic Christian tradition influenced Kievan Rus's eventual conversion."),
    ("Cyril and Methodius", "Kievan Rus Adopts Christianity", "indirect", 0.40,
     "Same causal chain — Slavic Christianity influenced Rus's conversion."),

    # Vikings & Europe
    ("Norse Settlement of Iceland", "Althing Established in Iceland", "direct", 0.85,
     "Norse settlers in Iceland established the Althing as their governing assembly."),
    ("Norse Settlement of Iceland", "Erik the Red Colonizes Greenland", "direct", 0.80,
     "Icelandic exile Erik the Red explored and colonized Greenland."),
    ("Norse Settlement of Iceland", "Treaty of Saint-Clair-sur-Epte", "indirect", 0.30,
     "Viking expansion included both North Atlantic settlement and incursions into France."),
    ("Treaty of Saint-Clair-sur-Epte", "Battle of Lechfeld", "indirect", 0.25,
     "European kingdoms settling Viking and Magyar threats stabilized the medieval order."),
    ("Battle of Lechfeld — Otto I Ends", "Battle of Lechfeld — Otto I Defeats Magyars", "direct", 0.95,
     "Same battle event."),
    ("Battle of Lechfeld — Otto I Defeats", "Otto I Crowned Holy Roman Emperor", "direct", 0.80,
     "Otto's victory at Lechfeld established his prestige, leading to imperial coronation."),
    ("Magyar Conquest of the Carpathian Basin", "Battle of Lechfeld", "direct", 0.75,
     "Magyar raids into Europe culminated in their decisive defeat at Lechfeld."),
    ("Treaty of Wedmore", "Norse Settlement of Iceland", "indirect", 0.30,
     "Viking political settlements in England paralleled North Atlantic expansion."),
    ("First Bulgarian Empire Founded", "Slavic Migration into the Balkans", "contributing", 0.55,
     "Slavic migration into the Balkans provided the demographic base for the Bulgarian state."),
    ("Slavic Migration into the Balkans", "Cyril and Methodius", "contributing", 0.45,
     "Slavic settlement in the Balkans created the communities Cyril and Methodius evangelized."),
    ("Hugh Capet Founds Capetian Dynasty", "Hugh Capet Founds the Capetian Dynasty — Medieval France", "direct", 0.95,
     "Same event."),
    ("Vladimir I's Mass Baptism", "Kievan Rus Adopts Christianity", "direct", 0.95,
     "Same event — Vladimir's conversion of Kievan Rus."),

    # Technology
    ("Sui Dynasty Begins Grand Canal", "Tang Golden Age", "contributing", 0.50,
     "The Grand Canal connected north and south China, enabling Tang prosperity."),
    ("Sui Dynasty Begins Grand Canal", "Song Dynasty Issues First Government Paper Money", "indirect", 0.35,
     "Grand Canal trade infrastructure enabled the commercial economy that produced paper money."),
    ("Heavy Plow Transforms Northern European Agriculture", "Charlemagne's Saxon Wars", "indirect", 0.25,
     "Agricultural productivity in northern Europe supported Carolingian military campaigns."),
    ("Windmill Invented in Persia", "Heavy Plow Transforms Northern European Agriculture", "indirect", 0.20,
     "Parallel agricultural technology innovations transformed food production."),
    ("Invention of Paper", "First Woodblock Printing — Diamond Sutra", "contributing", 0.60,
     "Paper invention was prerequisite for woodblock printing technology."),
    ("First Woodblock Printing", "Korean Dharani Sutra", "contributing", 0.55,
     "Chinese printing technology spread to Korea, producing the oldest printed document."),
    ("Compass Use Emerges in Tang China", "Chinese Mariners Adopt the Magnetic Compass", "direct", 0.85,
     "Tang-era compass technology was adopted for maritime navigation in the Song period."),
    ("Gunpowder Invented in China", "Song Military Develops Gunpowder Weapons", "direct", 0.85,
     "Song military adapted gunpowder into weapons technology."),
    ("Stirrup Spreads Across Eurasia", "Battle of Tours", "contributing", 0.35,
     "Stirrup technology transformed cavalry warfare in the battles that shaped medieval Europe."),
    ("True Porcelain Invented in Tang China", "Tang Dynasty Porcelain", "direct", 0.90,
     "Tang porcelain production followed from the invention of true porcelain."),

    # Islamic Golden Age
    ("Al-Azhar University Founded", "Library of Cordoba Reaches 400,000", "indirect", 0.30,
     "Islamic centers of learning competed in intellectual achievement."),
    ("Great Mosque of Córdoba Construction Begins", "Great Mosque of Cordoba Expansion Under al-Hakam II", "direct", 0.85,
     "Al-Hakam II expanded the mosque originally begun in 784."),
    ("Great Mosque of Cordoba Expansion", "Library of Cordoba Reaches 400,000", "contributing", 0.50,
     "Cordoba's cultural investment included both mosque expansion and library building."),
    ("Abbasid Massacre of the Umayyad Dynasty", "Abd al-Rahman III Declares Caliphate", "indirect", 0.55,
     "Umayyad survivors fled to Spain where they eventually declared an independent caliphate."),
    ("Great Mosque of Damascus", "Great Mosque of Córdoba Construction", "contributing", 0.40,
     "Umayyad mosque-building traditions in Damascus influenced Cordoba's great mosque."),
    ("Jabir ibn Hayyan — Father of Chemistry", "Jabir ibn Hayyan — Foundations of Experimental Chemistry", "direct", 0.95,
     "Same person and achievement."),
    ("Jabir ibn Hayyan", "Islamic Hospitals — Bimaristans", "indirect", 0.35,
     "Islamic scientific traditions including chemistry contributed to medical center development."),
    ("Hunayn ibn Ishaq — Master Translator", "Al-Farabi — Second Teacher After Aristotle", "contributing", 0.50,
     "Hunayn's translations of Greek texts enabled Al-Farabi's Aristotelian philosophy."),
    ("Al-Farabi", "Al-Biruni — Polymath", "indirect", 0.35,
     "Islamic philosophical traditions from Al-Farabi influenced later polymaths like Al-Biruni."),

    # Africa
    ("Kingdom of Ghana — West African Gold Trade", "Ghana Empire — Gold and Salt Masters", "direct", 0.95,
     "Same Ghana Empire event."),
    ("Ghana Empire Emerges", "Kingdom of Ghana", "direct", 0.90,
     "The emerging Ghana Empire became the dominant gold trade power."),
    ("Austronesian Settlement of Madagascar", "Swahili Coast Adopts Islam", "indirect", 0.30,
     "Indian Ocean maritime connections linked Madagascar and the Swahili Coast."),
    ("Swahili Coast Adopts Islam", "Swahili Coast City-States", "direct", 0.75,
     "Islamic adoption enabled Swahili city-states to integrate into Indian Ocean trade."),
    ("Bantu Peoples Reach Southern Africa", "Mapungubwe — Southern Africa's First State", "contributing", 0.55,
     "Bantu migration to southern Africa established the communities that formed Mapungubwe."),

    # Borobudur
    ("Sailendra Dynasty Builds Borobudur", "Construction of Borobudur", "direct", 0.95,
     "Same event — Sailendra construction of Borobudur."),
    ("Construction of Borobudur", "Borobudur Temple Completed in Java", "direct", 0.95,
     "Borobudur's construction was completed in the 9th century."),

    # Islam & West Africa
    ("Kingdom of Ghana", "Timbuktu as Center of Islamic Learning", "contributing", 0.45,
     "Ghana Empire's gold trade established trans-Saharan connections that brought Islam to Timbuktu."),
    ("Al-Azhar University Founded", "Timbuktu as Center of Islamic Learning", "indirect", 0.35,
     "Islamic scholarly traditions from Al-Azhar influenced West African centers like Timbuktu."),
    ("Timbuktu as Center of Islamic Learning", "University of Sankore at Its Height", "direct", 0.85,
     "Timbuktu's scholarly tradition centered on the University of Sankore."),

    # Da Viet
    ("Silla Unifies Korean Peninsula", "Dai Viet Gains Independence from China", "indirect", 0.25,
     "East Asian states gained independence from Chinese hegemony in parallel movements."),

    # ══════════════════════════════════════════════════════════════════
    # HIGH & LATE MEDIEVAL (1000-1500)
    # ══════════════════════════════════════════════════════════════════

    # Seljuks and Crusades
    ("Seljuk Turks Conquer Baghdad", "Battle of Manzikert", "direct", 0.70,
     "Seljuk expansion after taking Baghdad led to their invasion of Byzantine Anatolia."),
    ("Battle of Ain Jalut", "Mamluk Sultanate", "direct", 0.70,
     "Ain Jalut's victory established Mamluk dominance over Egypt and the Levant."),
    ("Battle of Ain Jalut", "Battle of Ain Jalut — First Major Mongol Defeat", "direct", 0.95,
     "Same battle event."),

    # Song China
    ("Song Dynasty Issues First Government Paper Money", "Chinese Mariners Adopt the Magnetic Compass", "indirect", 0.30,
     "Song dynasty innovations included both monetary and navigational breakthroughs."),
    ("Song Military Develops Gunpowder Weapons", "Mongol Empire", "contributing", 0.40,
     "Mongols adopted Chinese gunpowder weapons technology during their conquests."),
    ("Shen Kuo — Polymath", "Su Song Builds Water-Driven Astronomical Clock", "contributing", 0.45,
     "Song-era polymaths like Shen Kuo created the intellectual environment for Su Song's innovations."),

    # Scholars
    ("Omar Khayyam — Poet, Mathematician", "Omar Khayyam's Calendar Reform", "direct", 0.90,
     "Omar Khayyam's mathematical expertise enabled his highly accurate calendar reform."),
    ("Al-Biruni — Polymath", "Omar Khayyam", "indirect", 0.35,
     "Al-Biruni's scientific traditions influenced later Islamic polymaths including Khayyam."),
    ("Hildegard of Bingen", "Al-Idrisi Creates World Map", "indirect", 0.20,
     "Both were medieval polymaths operating in parallel intellectual traditions."),
    ("Al-Idrisi Creates World Map", "Al-Jazari — Father of Robotics", "indirect", 0.25,
     "Islamic scholarly traditions produced both geographical and engineering innovations."),
    ("Zhu Xi — Neo-Confucianism Transforms", "Zhu Xi — Neo-Confucian Philosopher", "direct", 0.95,
     "Same person and philosophical movement."),

    # Cahokia
    ("Cahokia — North America's Largest Pre-Columbian City", "Cahokia Reaches Peak Population", "direct", 0.90,
     "Cahokia's growth led to its peak population around 1100."),
    ("Cahokia Reaches Peak Population", "Cahokia Woodhenge", "direct", 0.80,
     "Cahokia's monumental construction included the Woodhenge astronomical calendar."),
    ("Cahokia Reaches Peak Population", "Monks Mound Constructed", "direct", 0.85,
     "Monks Mound was the centerpiece of Cahokia at its peak."),

    # Mongol aftermath
    ("Mongol Empire", "Timur's Conquests Devastate Central Asia", "contributing", 0.50,
     "Timur claimed Mongol heritage and rebuilt a Turco-Mongol empire through devastating conquest."),
    ("Timur's Conquests", "Alauddin Khalji's Market Reforms", "indirect", 0.25,
     "Delhi Sultanate reforms anticipated the challenges Timur's invasion would later bring."),
    ("Trần Dynasty Defeats Mongol Invasions", "Dai Viet Gains Independence", "contributing", 0.40,
     "Vietnamese resistance to Mongol invasion reinforced national independence identity."),

    # Southeast Asia
    ("Founding of the Sukhothai Kingdom", "Kingdom of Lan Xang", "contributing", 0.40,
     "Thai state formation at Sukhothai influenced neighboring Lao state formation."),
    ("Founding of the Majapahit Empire", "Gajah Mada's Palapa Oath", "direct", 0.85,
     "Gajah Mada served as chief minister of the Majapahit Empire."),
    ("Gajah Mada's Palapa Oath", "Majapahit Empire at Its Peak", "direct", 0.80,
     "Gajah Mada's conquests brought the Majapahit Empire to its territorial peak."),
    ("Khmer Empire Decline", "Founding of the Sukhothai Kingdom", "contributing", 0.50,
     "Khmer decline created a power vacuum that enabled Thai states like Sukhothai."),

    # Americas
    ("Toltec Empire at Tula", "Chichén Itzá at Its Peak", "contributing", 0.55,
     "Toltec cultural influence reached Chichén Itzá, producing Maya-Toltec synthesis."),
    ("Maya Classic Period Collapse", "League of Mayapán", "contributing", 0.55,
     "Post-Classic Maya political reorganization after the Classic collapse produced the Mayapan league."),
    ("Wari Empire", "Tiwanaku Empire at Its Peak", "indirect", 0.40,
     "Wari and Tiwanaku were contemporary Andean empires with interacting spheres."),
    ("Manco Cápac Founds Inca State", "Sinchi Roca — Second Sapa Inca", "direct", 0.90,
     "Sinchi Roca succeeded his father Manco Cápac as the second Sapa Inca."),
    ("Manco Cápac Founds Inca State", "Inca Quipu System", "contributing", 0.50,
     "The growing Inca state developed the quipu record-keeping system."),
    ("Manco Cápac Founds Inca State", "Inca Road System Completed", "contributing", 0.50,
     "The Inca state's expansion required the comprehensive road network."),
    ("Chimú Kingdom and Chan Chan", "Manco Cápac Founds Inca State", "indirect", 0.30,
     "The Chimú kingdom was a predecessor state that the Inca eventually conquered."),
    ("Polynesian Settlement of Samoa and Tonga", "Tu'i Tonga Maritime Empire", "contributing", 0.55,
     "Polynesian settlement established the Tongan communities that formed the Tu'i Tonga empire."),
    ("Tu'i Tonga Maritime Empire", "Tu'i Tonga Empire Expansion", "direct", 0.90,
     "Same empire's expansion phase."),
    ("Polynesian Celestial Navigation", "Polynesian Settlement of Aotearoa", "contributing", 0.60,
     "Polynesian navigational expertise enabled settlement of remote New Zealand."),
    ("Polynesian Settlement of Aotearoa", "Māori Pā Fortifications", "direct", 0.70,
     "Māori settlers in New Zealand developed sophisticated pā fortification systems."),

    # Easter Island
    ("Polynesian Settlement of Rapa Nui", "Easter Island Moai Construction Peak", "direct", 0.80,
     "Rapa Nui settlers built the iconic Moai statues."),
    ("Easter Island Moai Construction Peak", "Peak of Moai Construction on Rapa Nui", "direct", 0.95,
     "Same peak construction period."),

    # Nan Madol
    ("Nan Madol — Venice of the Pacific", "Construction of Nan Madol", "direct", 0.95,
     "Same site and construction event."),
    ("Micronesian Stick Charts", "Nan Madol", "indirect", 0.30,
     "Micronesian maritime and engineering traditions produced both navigation tools and monumental architecture."),

    # Africa late medieval
    ("Mapungubwe", "Great Enclosure of Zimbabwe", "direct", 0.65,
     "Great Zimbabwe succeeded Mapungubwe as the dominant southern African state."),
    ("Swahili Coast City-States", "Swahili Coast Golden Age", "direct", 0.80,
     "Swahili city-states' growth led to their Indian Ocean trade golden age."),
    ("Swahili Coast Golden Age", "Kilwa Sultanate — Great Mosque", "direct", 0.75,
     "Kilwa's Great Mosque was built during the Swahili Coast's golden age."),
    ("Kingdom of Nri", "Founding of the Kingdom of Buganda", "indirect", 0.25,
     "Parallel African state formation in the sub-Saharan region."),
    ("Bantu Peoples Reach Southern Africa", "Kingdom of Kongo Founded", "contributing", 0.45,
     "Bantu migrations established the populations that formed the Kingdom of Kongo."),
    ("Kingdom of Kongo Founded", "Portuguese Arrive at Benin", "indirect", 0.30,
     "Portuguese exploration connected with both Kongo and Benin kingdoms."),
    ("Oba Ewuare the Great Rebuilds Benin City", "Portuguese Arrive at Benin", "contributing", 0.40,
     "Ewuare's rebuilding made Benin a notable city that attracted Portuguese contact."),

    # Ottoman early
    ("Battle of Adrianople — Ottomans Crush Serbian", "Fall of Constantinople", "contributing", 0.50,
     "Ottoman victories in the Balkans isolated Constantinople, contributing to its eventual fall."),

    # ══════════════════════════════════════════════════════════════════
    # EARLY MODERN (1400-1700)
    # ══════════════════════════════════════════════════════════════════

    # Ming China
    ("Yongle Encyclopedia", "Zheng He's Treasure Voyages End", "contributing", 0.35,
     "Yongle Emperor's ambitious projects included both the encyclopedia and Zheng He's voyages."),
    ("Zheng He's Treasure Voyages End", "Ming Great Wall — China's Iconic Fortification", "indirect", 0.30,
     "Ming dynasty shifted from maritime exploration to defensive wall-building."),
    ("Ming Great Wall", "Ming Dynasty Rebuilds Great Wall", "direct", 0.95,
     "Same event — Ming wall reconstruction."),
    ("Hongzhi Emperor — Model Emperor", "Wang Yangming's Neo-Confucianism", "contributing", 0.40,
     "Hongzhi's stable reign provided context for Wang Yangming's philosophical developments."),
    ("Wang Yangming's Neo-Confucianism", "Wang Yangming Defeats Prince of Ning", "direct", 0.70,
     "Wang Yangming applied his philosophy practically in defeating the Ning rebellion."),

    # Age of Exploration
    ("Treaty of Tordesillas", "Pedro Álvares Cabral Claims Brazil", "direct", 0.75,
     "Tordesillas's division gave Portugal claim to Brazil, which Cabral formalized."),
    ("Spanish Inquisition Established", "Treaty of Tordesillas", "contributing", 0.35,
     "Spanish religious and political consolidation enabled the imperial ambitions behind Tordesillas."),
    ("Columbus Reaches the Americas", "Pedro Álvares Cabral Claims Brazil", "contributing", 0.50,
     "Columbus's discovery spurred Portuguese exploration that led to Cabral's landing in Brazil."),
    ("Kingdom of Kongo Founded", "Kingdom of Kongo Converts to Christianity", "direct", 0.70,
     "Portuguese contact with the Kingdom of Kongo led to its conversion."),
    ("Portuguese Arrive at Benin", "Kingdom of Kongo Converts to Christianity", "contributing", 0.40,
     "Portuguese expansion in West Africa included both Benin contact and Kongo conversion."),

    # Mughal Empire
    ("Second Battle of Panipat", "Fatehpur Sikri — Akbar's Planned Capital", "direct", 0.70,
     "Akbar's victory at Panipat secured his empire, enabling him to build Fatehpur Sikri."),
    ("Fatehpur Sikri — Akbar's Planned Capital", "Fatehpur Sikri — Akbar's Dream Capital", "direct", 0.95,
     "Same site."),
    ("Second Battle of Panipat", "Mughal Miniature Painting Tradition", "contributing", 0.40,
     "Akbar's secure empire patronized the flourishing of miniature painting."),
    ("Fatehpur Sikri", "Jahangir — Mughal Patron", "contributing", 0.45,
     "Akbar's cultural patronage at Fatehpur Sikri was continued by his son Jahangir."),
    ("Jahangir — Mughal Patron", "Shah Jahan's Architectural Golden Age", "direct", 0.65,
     "Jahangir's patronage tradition was amplified by Shah Jahan's monumental building."),
    ("Shah Jahan's Architectural Golden Age", "Shah Jahan Builds the Red Fort", "direct", 0.85,
     "Shah Jahan built the Red Fort during his architectural golden age."),
    ("Shah Jahan's Architectural Golden Age", "Mughal Bengal — The Paradise of Nations", "contributing", 0.40,
     "Mughal prosperity under Shah Jahan extended to Bengal's economic golden age."),
    ("Mughal Road Network and Caravanserais", "Mughal Bengal", "contributing", 0.45,
     "Mughal infrastructure connected Bengal to the imperial economy."),
    ("Deccan Famine Under Mughal Expansion", "Shah Jahan's Architectural Golden Age", "indirect", 0.25,
     "Mughal expansion that caused Deccan famine also funded Shah Jahan's monuments."),

    # Reformation & European culture
    ("Erasmus Publishes In Praise of Folly", "Martin Luther", "contributing", 0.40,
     "Erasmus's humanist criticism of the Church paved intellectual ground for Luther's Reformation."),
    ("Thomas More Publishes Utopia", "Erasmus Publishes In Praise of Folly", "indirect", 0.35,
     "More and Erasmus were close humanist friends and intellectual allies."),
    ("Alberti Publishes De re aedificatoria", "Dürer's Self-Portrait", "indirect", 0.25,
     "Renaissance artistic and architectural theory influenced northern European artists."),
    ("Selim I Conquers Egypt — Ottoman Caliphate", "Süleymaniye Mosque Completed", "contributing", 0.45,
     "Ottoman territorial expansion under Selim I funded Süleyman's monumental mosque building."),
    ("Spanish Inquisition Established", "Spanish Golden Age", "contributing", 0.35,
     "Religious consolidation contributed to Spain's cultural and political golden age."),

    # Safavid Persia
    ("Isfahan — Half the World", "Süleymaniye Mosque Completed", "indirect", 0.25,
     "Safavid and Ottoman architectural traditions competed in monumental building."),

    # Literary works
    ("Shakespeare Writes Hamlet", "Cervantes Publishes Don Quixote", "indirect", 0.25,
     "Shakespeare and Cervantes were exact contemporaries creating foundational Western literature."),
    ("Cervantes Publishes Don Quixote", "Milton Publishes Paradise Lost", "indirect", 0.30,
     "Early modern literary traditions from Cervantes influenced English literary ambition."),
    ("Las Casas Advocates for Indigenous Rights", "Jesuit Reductions of Paraguay", "contributing", 0.40,
     "Las Casas's advocacy for indigenous rights inspired later Jesuit mission models."),

    # Colonial Americas
    ("Moctezuma II Becomes Emperor", "Fall of Tenochtitlan", "contributing", 0.55,
     "Moctezuma II's rule was ended by the Spanish conquest."),
    ("Aztec Great Famine", "Moctezuma II Becomes Emperor", "contributing", 0.35,
     "Post-famine recovery and imperial consolidation preceded Moctezuma II's reign."),
    ("Tlatelolco Market", "Tlatelolco Absorbed — Tenochtitlan Controls the Lake", "direct", 0.70,
     "Tenochtitlan absorbed Tlatelolco's great market and its trade network."),
    ("Founding of Lima", "Francisco de Orellana Navigates the Amazon", "contributing", 0.45,
     "Spanish colonial bases like Lima launched Amazonian exploration expeditions."),
    ("Taki Onqoy Movement", "Mapuche Resistance — Arauco War", "indirect", 0.30,
     "Indigenous resistance movements arose simultaneously across the Spanish Americas."),
    ("Colonial Casta System", "Sor Juana Inés de la Cruz", "contributing", 0.35,
     "The colonial casta system shaped the social world Sor Juana navigated and critiqued."),
    ("Quilombo dos Palmares", "Stono Rebellion", "indirect", 0.30,
     "Enslaved African resistance traditions connected maroon communities and slave revolts."),
    ("Boston Founded", "Salem Witch Trials", "contributing", 0.35,
     "Massachusetts Bay Colony's Puritan culture contributed to the Salem witch hysteria."),
    ("British Capture Jamaica", "Middle Passage Peaks", "contributing", 0.40,
     "British Caribbean colonization intensified the Atlantic slave trade."),
    ("Henry Hudson Explores Hudson Bay", "Boston Founded", "contributing", 0.35,
     "Early colonial exploration established the European presence that led to permanent settlement."),
    ("Spanish Colonize the Philippines", "Matteo Ricci Arrives in China", "contributing", 0.35,
     "Spanish presence in the Philippines facilitated Jesuit missions to East Asia."),

    # Dutch
    ("Dutch Colonization of Indonesia", "Sultanate of Mataram", "contributing", 0.40,
     "VOC expansion in Indonesia pressured and ultimately undermined the Sultanate of Mataram."),
    ("Dutch Colonization of Indonesia", "Sultanates of Ternate and Tidore", "contributing", 0.40,
     "Dutch VOC displaced the Spice Islands sultanates' control of the spice trade."),

    # Shimabara & Japan
    ("Shimabara Rebellion", "Qing Dynasty Conquers Taiwan", "indirect", 0.20,
     "East Asian Christian suppression and regime changes occurred in parallel."),

    # Science
    ("Galileo's Trial Before the Inquisition", "Robert Boyle's Sceptical Chymist", "indirect", 0.30,
     "Galileo's struggles advanced the scientific method that Boyle later championed in chemistry."),
    ("Galileo's Trial Before the Inquisition", "Christiaan Huygens Invents Pendulum Clock", "indirect", 0.35,
     "Galileo's pendulum observations were practically applied by Huygens in his clock."),
    ("Robert Hooke Publishes Micrographia", "Robert Boyle's Sceptical Chymist", "indirect", 0.35,
     "Hooke and Boyle were collaborators at the Royal Society advancing experimental science."),
    ("Christiaan Huygens Invents Pendulum Clock", "Leibniz Develops Calculus", "indirect", 0.30,
     "Huygens mentored Leibniz and influenced his mathematical work."),

    # Exploration & Pacific
    ("Abel Tasman's Voyage", "Abel Tasman Reaches New Zealand", "direct", 0.95,
     "Same voyage — Tasman reached New Zealand and Tasmania."),
    ("Francis Drake Circumnavigates the Globe", "Abel Tasman's Voyage", "indirect", 0.30,
     "Drake's circumnavigation expanded European knowledge that Tasman later built on."),
    ("Rembrandt Paints The Night Watch", "Velázquez Paints Las Meninas", "indirect", 0.25,
     "Golden Age Dutch and Spanish painting traditions produced parallel masterworks."),
    ("Manchu Queue Order", "Qing Dynasty Conquers Taiwan", "contributing", 0.45,
     "Qing consolidation of power included both cultural imposition and territorial conquest."),

    # Africa
    ("Kanem-Bornu Empire Under Idris Alooma", "Dahomey's Female Warrior Regiment", "indirect", 0.25,
     "West African military state traditions produced both Kanem-Bornu and Dahomey's innovations."),
    ("Dahomey's Female Warrior Regiment", "Dahomey's Mino Warriors", "direct", 0.95,
     "Same warrior regiment."),
    ("Kingdom of Kongo Converts to Christianity", "Fall of the Kingdom of Kongo to Portugal", "contributing", 0.50,
     "Portuguese Christian influence opened Kongo to eventual Portuguese colonial domination."),

    # ══════════════════════════════════════════════════════════════════
    # 18TH CENTURY
    # ══════════════════════════════════════════════════════════════════

    # Music & Culture
    ("Bach Composes The Well-Tempered Clavier", "Handel Composes Messiah", "indirect", 0.25,
     "Bach and Handel were contemporaries defining Baroque musical traditions."),
    ("Bach Composes The Well-Tempered Clavier", "Mozart Born", "indirect", 0.35,
     "Bach's innovations in keyboard music influenced later Classical composers including Mozart."),
    ("Vivaldi Composes The Four Seasons", "Bach Composes The Well-Tempered Clavier", "indirect", 0.30,
     "Vivaldi's concerto innovations influenced Bach's compositional style."),
    ("Handel Composes Messiah", "Mozart Born", "indirect", 0.30,
     "Handel's oratorio tradition influenced Classical-era composers."),
    ("Voltaire Publishes Candide", "Diderot Completes the Encyclopédie", "contributing", 0.45,
     "Voltaire and Diderot were leading figures of the French Enlightenment."),
    ("Beccaria Publishes On Crimes and Punishments", "Diderot Completes the Encyclopédie", "indirect", 0.30,
     "Beccaria's legal reforms were part of the broader Enlightenment project the Encyclopédie represented."),
    ("Goethe Publishes The Sorrows of Young Werther", "Romanticism Movement", "contributing", 0.55,
     "Goethe's Werther was a founding text of the Romantic movement."),
    ("Samuel Johnson Publishes English Dictionary", "Diderot Completes the Encyclopédie", "indirect", 0.30,
     "Encyclopedic and lexicographic projects were Enlightenment-era knowledge initiatives."),

    # Science
    ("Linnaeus Publishes Systema Naturae", "Priestley Discovers Oxygen", "indirect", 0.25,
     "Enlightenment systematic approaches to science produced both taxonomy and chemistry."),
    ("Benjamin Franklin's Electricity Experiments", "Priestley Discovers Oxygen", "indirect", 0.30,
     "Franklin and Priestley were Enlightenment scientist-correspondents."),
    ("Fahrenheit Invents the Mercury Thermometer", "Priestley Discovers Oxygen", "indirect", 0.30,
     "Scientific instrument development enabled experimental chemistry breakthroughs."),
    ("Newton Elected President of Royal Society", "Halley Predicts Return of His Comet", "contributing", 0.50,
     "Newton's Royal Society presidency fostered Halley's astronomical work."),
    ("Halley Predicts Return of His Comet", "Bering Expedition Maps Alaska Coast", "indirect", 0.20,
     "Scientific expeditions of the era combined astronomical observation with geographical exploration."),
    ("Cavendish Determines the Weight of the Earth", "Priestley Discovers Oxygen", "indirect", 0.30,
     "Both were Enlightenment-era experimental science breakthroughs."),
    ("Leibniz Develops Calculus", "Newton Elected President of Royal Society", "indirect", 0.35,
     "The Newton-Leibniz calculus priority dispute shaped Royal Society politics."),

    # Political
    ("Act of Union — Great Britain Formed", "Treaty of Utrecht", "contributing", 0.45,
     "Britain's union strengthened its position in negotiations ending the War of Spanish Succession."),
    ("Treaty of Utrecht", "Frederick the Great — Prussia", "contributing", 0.35,
     "Utrecht's European settlement set the stage for Prussia's rise under Frederick."),
    ("Frederick the Great", "Partition of Poland Begins", "direct", 0.65,
     "Frederick initiated the First Partition of Poland with Russia and Austria."),
    ("Partition of Poland Begins", "First Partition of Poland", "direct", 0.95,
     "Same event — the partitioning of Poland."),
    ("French Found New Orleans", "Bering Expedition Maps Alaska", "indirect", 0.20,
     "European colonial expansion in North America paralleled Pacific exploration."),
    ("Stono Rebellion", "Middle Passage Peaks", "indirect", 0.40,
     "Enslaved resistance and the peak of the slave trade were interconnected."),

    # Africa/Oceania 18th century
    ("Merina Kingdom Unifies Madagascar", "Austronesian Settlement of Madagascar", "indirect", 0.35,
     "Austronesian-descended populations unified under the Merina kingdom."),
    ("Ayutthaya Golden Age", "Founding of the Sukhothai Kingdom", "indirect", 0.40,
     "Sukhothai's Thai state traditions were succeeded by Ayutthaya's golden age."),

    # Revolution era
    ("Voltaire Publishes Candide", "French Revolution", "contributing", 0.40,
     "Enlightenment criticism exemplified by Voltaire undermined ancien régime legitimacy."),
    ("Polish Constitution of May 3", "Partition of Poland", "contributing", 0.50,
     "Poland's progressive constitution alarmed neighboring powers, accelerating partition."),
    ("Mutiny on the Bounty", "Abel Tasman's Voyage", "indirect", 0.20,
     "European Pacific voyaging traditions connected Tasman's exploration to later naval missions."),

    # ══════════════════════════════════════════════════════════════════
    # 19TH CENTURY
    # ══════════════════════════════════════════════════════════════════

    # Technology
    ("Stephenson's Rocket", "Erie Canal Opens", "indirect", 0.25,
     "Transportation revolutions in railways and canals transformed 19th-century economies."),
    ("Faraday Discovers Electromagnetic Induction", "Edison Invents the Phonograph", "indirect", 0.40,
     "Faraday's electromagnetic discoveries enabled later electrical invention."),
    ("Erie Canal Opens", "Stephenson's Rocket", "indirect", 0.30,
     "Canal and railway infrastructure transformed industrial-era transportation."),
    ("Alfred Nobel Invents Dynamite", "First Skyscraper Built in Chicago", "indirect", 0.30,
     "Dynamite enabled large-scale construction and excavation for tall buildings."),
    ("Benz Patent-Motorwagen", "Edison Invents the Phonograph", "indirect", 0.25,
     "Late 19th-century inventions transformed transportation and communication."),
    ("Sholes Patents the Typewriter", "Edison Invents the Phonograph", "indirect", 0.25,
     "Communication and recording technology innovations defined the Gilded Age."),
    ("Koch's Postulates", "Aspirin Patented by Bayer", "indirect", 0.30,
     "Germ theory and pharmaceutical development were parallel medical advances."),
    ("Great Exhibition at the Crystal Palace", "First Skyscraper Built in Chicago", "indirect", 0.30,
     "Industrial exhibition culture showcased the iron and steel technology used in skyscrapers."),

    # Political/social
    ("13th Amendment Ratified", "Reconstruction Era Begins", "direct", 0.85,
     "Abolition of slavery through the 13th Amendment was central to Reconstruction."),
    ("Reconstruction Era Begins", "Haymarket Affair", "indirect", 0.30,
     "Post-Civil War industrial transformation created labor tensions leading to Haymarket."),
    ("Florence Nightingale Pioneers Modern Nursing", "International Red Cross Founded", "contributing", 0.50,
     "Nightingale's Crimean War nursing reforms inspired Dunant's Red Cross movement."),
    ("International Red Cross Founded", "First Geneva Convention", "direct", 0.85,
     "Dunant's Red Cross founding led directly to the First Geneva Convention."),
    ("France Abolishes Slavery", "13th Amendment Ratified", "indirect", 0.30,
     "Abolitionist movements across the Atlantic world ended slavery in parallel."),
    ("July Revolution", "Romanticism Movement", "contributing", 0.35,
     "The 1830 revolution in France was entwined with Romantic political ideals."),
    ("Monroe Doctrine", "War of the Triple Alliance", "indirect", 0.25,
     "US hemispheric claims shaped South American geopolitics."),
    ("Panic of 1873", "South African Diamond Rush", "indirect", 0.30,
     "Global economic disruption drove speculative investment in diamond mining."),
    ("British Crown Takes Direct Control of India", "First British Census of India", "contributing", 0.65,
     "British direct rule of India included systematic census-taking for governance."),
    ("Treaty of Amity and Commerce — Japan Opens", "Meiji Restoration", "contributing", 0.60,
     "Forced opening of Japan through unequal treaties catalyzed the Meiji Restoration."),
    ("Ottoman Reform Edict — Hatt-ı Hümayun", "Ottoman Land Code of 1858", "direct", 0.75,
     "The Hatt-ı Hümayun edict's Tanzimat reforms led to the 1858 Land Code."),
    ("First Commercial Oil Well", "Nikola Tesla and AC Power Revolution", "indirect", 0.30,
     "Oil and electricity were the twin energy revolutions of the late 19th century."),
    ("British Opium Trade Floods China", "Eight-Nation Alliance Invades China", "indirect", 0.40,
     "Western commercial exploitation of China culminated in military intervention."),

    # Africa 19th century
    ("Rise of the Zulu Kingdom under Shaka", "Rise of the Zulu Kingdom Under Shaka", "direct", 0.95,
     "Same event."),
    ("Rise of the Zulu Kingdom Under Shaka", "Anglo-Zulu War", "direct", 0.60,
     "The Zulu Kingdom Shaka created was the power Britain fought in the Anglo-Zulu War."),
    ("Anglo-Zulu War", "Battle of Isandlwana — Zulu Victory", "direct", 0.90,
     "Isandlwana was a major battle during the Anglo-Zulu War."),
    ("Ashanti-British Wars Begin", "Yaa Asantewaa War", "direct", 0.75,
     "The Yaa Asantewaa War was the final chapter of Ashanti resistance to British colonization."),
    ("Ethiopian Modernization Under Emperor Menelik", "Battle of Adwa", "contributing", 0.60,
     "Menelik's modernization enabled Ethiopia's stunning victory at Adwa."),
    ("Mahdist War — Fall of Khartoum", "Fashoda Incident", "contributing", 0.45,
     "British campaigns in Sudan after Khartoum's fall led to the Fashoda confrontation with France."),
    ("Zanzibar Clove Plantations", "Swahili Coast Golden Age", "contributing", 0.35,
     "Zanzibar's plantation economy was part of the broader Swahili/Indian Ocean trade world."),
    ("Java War (Diponegoro War)", "Dutch Colonization of Indonesia", "contributing", 0.45,
     "The Java War's defeat consolidated Dutch colonial control of Indonesia."),

    # Oceania 19th century
    ("New Zealand Musket Wars", "Māori Pā Fortifications", "contributing", 0.40,
     "Musket warfare drove evolution of Māori defensive architecture."),
    ("Kamehameha I Unifies the Hawaiian Islands", "Kamehameha Unifies the Hawaiian Kingdom", "direct", 0.95,
     "Same event."),
    ("Samoan Crisis", "Samoan Crisis and Partition", "direct", 0.85,
     "The Samoan Crisis led to the partition of Samoa."),
    ("Samoan Crisis and Partition", "Tripartite Convention — Samoa Partitioned", "direct", 0.90,
     "The Tripartite Convention formalized Samoa's partition."),
    ("Mount Tambora Erupts", "War of 1812", "indirect", 0.20,
     "The Year Without a Summer's global disruption followed closely after the War of 1812."),
    ("First Cholera Pandemic", "Koch's Postulates", "indirect", 0.35,
     "Cholera pandemics motivated the germ theory research Koch later formalized."),

    # Late 19th century politics/culture
    ("Cuban War of Independence", "Spanish-American War", "contributing", 0.60,
     "Cuba's independence war drew US intervention, leading to the Spanish-American War."),
    ("Philippine Revolution Against Spain", "Cuban War of Independence", "indirect", 0.35,
     "Colonial revolts against Spain occurred simultaneously in Cuba and the Philippines."),
    ("First Zionist Congress", "Dreyfus Affair", "contributing", 0.50,
     "The Dreyfus Affair's antisemitism motivated Herzl's Zionist movement."),
    ("Émile Zola Publishes J'Accuse", "First Zionist Congress", "contributing", 0.35,
     "The Dreyfus Affair exposed by Zola intensified Jewish nationalism."),
    ("First Modern Olympic Games", "Berlin Olympics", "indirect", 0.50,
     "The 1896 Olympic revival established the tradition that reached Berlin in 1936."),
    ("HMS Dreadnought Launched", "World War I", "contributing", 0.40,
     "The naval arms race triggered by Dreadnought contributed to World War I tensions."),
    ("Russo-Japanese War", "Japan Annexes Korea", "direct", 0.70,
     "Japan's victory over Russia established dominance that led to Korean annexation."),
    ("Russo-Turkish War — Bulgarian Liberation", "World War I", "indirect", 0.30,
     "Balkan instability from post-Ottoman conflicts contributed to WWI."),
    ("Klondike Gold Rush", "Bering Expedition Maps Alaska", "indirect", 0.25,
     "Alaska exploration established knowledge that attracted gold rush prospectors."),
    ("Amazon Rubber Boom", "French Attempt to Build the Panama Canal", "indirect", 0.30,
     "Latin American resource extraction and infrastructure projects defined the era."),
    ("War of the Pacific", "Chincha Islands War", "contributing", 0.35,
     "South American territorial disputes over guano and nitrates linked these conflicts."),
    ("First Pan-African Conference", "NAACP Founded", "contributing", 0.45,
     "Pan-African activism in London influenced founding of the NAACP in America."),

    # ══════════════════════════════════════════════════════════════════
    # 20TH CENTURY
    # ══════════════════════════════════════════════════════════════════

    # WWI & interwar
    ("Gallipoli Campaign", "World War I", "contributing", 0.40,
     "Gallipoli was a major WWI campaign that forged ANZAC national identity."),
    ("US Prohibition Begins", "Scopes Trial", "indirect", 0.30,
     "Both reflected American cultural tensions between modernism and traditionalism."),
    ("Discovery of Tutankhamun's Tomb", "Rosetta Stone Decree", "indirect", 0.25,
     "Both are landmarks of Egyptology spanning ancient decree to modern archaeological discovery."),
    ("Lindbergh's Solo Transatlantic Flight", "Hindenburg Disaster", "indirect", 0.35,
     "Aviation milestones of the interwar period included both triumph and disaster."),
    ("Dust Bowl", "Great Depression", "contributing", 0.45,
     "The Dust Bowl deepened the Great Depression's agricultural devastation."),

    # WWII & Cold War
    ("Apartheid Formally Established", "Nelson Mandela Released", "direct", 0.85,
     "Mandela's release marked the beginning of apartheid's end."),
    ("Nelson Mandela Released", "End of Apartheid", "direct", 0.80,
     "Mandela's release initiated the transition away from apartheid."),
    ("First Ascent of Mount Everest", "Curiosity Rover Lands on Mars", "indirect", 0.20,
     "Human exploration milestones from Everest to Mars represent expanding frontiers."),
    ("Algerian War of Independence", "Apartheid Formally Established", "indirect", 0.25,
     "African decolonization and racial justice movements were interconnected."),

    # Cold War & civil rights
    ("Woodstock Music Festival", "Assassination of Robert F. Kennedy", "indirect", 0.30,
     "1960s counterculture and political assassination reflected American social upheaval."),
    ("Munich Olympics Massacre", "Pan Am Flight 103 — Lockerbie Bombing", "indirect", 0.30,
     "Terrorist attacks against Western targets escalated from Munich to Lockerbie."),
    ("Three Mile Island Nuclear Accident", "Space Shuttle Challenger Disaster", "indirect", 0.25,
     "American technological disasters eroded public trust in complex systems."),
    ("Aral Sea Desiccation", "Three Mile Island Nuclear Accident", "indirect", 0.20,
     "Environmental disasters highlighted industrial civilization's ecological costs."),

    # Late Cold War
    ("Singapore Independence", "Formation of ASEAN", "direct", 0.65,
     "Singapore's independence directly contributed to ASEAN's founding."),
    ("Nigerian Civil War (Biafra)", "Algerian War of Independence", "indirect", 0.25,
     "African post-colonial conflicts reflected the challenges of nation-building."),
    ("Pacific Islands Forum Founded", "Papua New Guinea Independence", "contributing", 0.40,
     "Pacific decolonization movements led to both PNG independence and regional cooperation."),
    ("Fiji Military Coups of 1987", "Pacific Islands Forum Founded", "indirect", 0.30,
     "Pacific political instability and regional cooperation developed in tension."),
    ("Bougainville Civil War", "Papua New Guinea Independence", "contributing", 0.40,
     "Post-independence tensions in PNG erupted in the Bougainville conflict."),
    ("Hōkūle'a — Revival of Polynesian Voyaging", "Polynesian Celestial Navigation", "contributing", 0.45,
     "Hōkūle'a deliberately revived traditional Polynesian navigation techniques."),

    # 1980s-90s
    ("Black Monday — Stock Market Crash", "Panic of 1873", "indirect", 0.20,
     "Major financial crashes recurred across centuries of market capitalism."),
    ("Los Angeles Riots", "NAACP Founded", "indirect", 0.25,
     "American racial justice struggles from the NAACP era continued to the LA riots."),
    ("Oklahoma City Bombing", "Pan Am Flight 103 — Lockerbie Bombing", "indirect", 0.25,
     "Domestic and international terrorism escalated in the 1990s."),
    ("Dolly the Sheep", "mRNA COVID-19 Vaccines", "indirect", 0.30,
     "Biological engineering from cloning to mRNA vaccines transformed biotechnology."),
    ("Kyoto Protocol", "Paris Climate Agreement", "direct", 0.70,
     "The Kyoto Protocol established the climate treaty framework that Paris later strengthened."),
    ("Kyoto Protocol", "Earth Summit — Rio de Janeiro", "direct", 0.65,
     "The 1992 Rio Earth Summit established the UNFCCC framework that produced Kyoto."),
    ("Earth Summit — Rio de Janeiro", "Kyoto Protocol", "direct", 0.70,
     "Rio's framework convention led to the Kyoto Protocol."),
    ("Hubble Space Telescope Launched", "James Webb Space Telescope First Images", "direct", 0.65,
     "JWST was designed as Hubble's successor for deep-space observation."),
    ("Hubble Space Telescope Launched", "First Image of a Black Hole", "contributing", 0.30,
     "Space telescope technology contributed to the Event Horizon Telescope project."),
    ("World Trade Organization Established", "US-China Tech War", "indirect", 0.35,
     "WTO-enabled globalization created the trade interdependence that later fractured."),
    ("World Trade Organization Established", "Trump Tariffs — Global Trade War", "indirect", 0.40,
     "WTO-era free trade provoked protectionist backlash culminating in tariff wars."),

    # ══════════════════════════════════════════════════════════════════
    # 21ST CENTURY
    # ══════════════════════════════════════════════════════════════════

    # Y2K to social media
    ("Y2K and the Millennium", "MySpace Launches", "indirect", 0.25,
     "Y2K-era internet growth enabled the first social networks."),
    ("MySpace Launches", "Instagram Launches", "indirect", 0.40,
     "MySpace pioneered social networking that Instagram later transformed for mobile."),
    ("MySpace Launches", "Twitter Founded", "indirect", 0.45,
     "Early social media platforms inspired Twitter's microblogging approach."),
    ("Instagram Launches", "TikTok Goes Global", "contributing", 0.40,
     "Instagram's mobile visual platform model influenced TikTok's short-form video."),
    ("Apple Launches the App Store", "Instagram Launches", "contributing", 0.55,
     "The App Store enabled mobile-native apps like Instagram."),
    ("Apple Launches the App Store", "Uber Founded", "contributing", 0.55,
     "The App Store created the platform for gig economy apps like Uber."),
    ("Apple Launches the iPad", "Apple Launches the App Store", "contributing", 0.40,
     "Apple's ecosystem expansion from App Store to iPad deepened mobile computing."),
    ("Bitcoin Whitepaper Published", "Bitcoin Genesis Block Mined", "direct", 0.95,
     "The whitepaper led directly to mining the first Bitcoin block."),
    ("Bitcoin Genesis Block Mined", "Electric Vehicles Reach Global Tipping Point", "indirect", 0.20,
     "Technology disruptions from cryptocurrency to EVs reshaped the 2020s economy."),

    # 2000s geopolitics
    ("Iraq War Begins", "Iran Nuclear Deal", "contributing", 0.35,
     "Iraq War's regional destabilization shaped diplomatic context for the Iran nuclear deal."),
    ("EU Enlargement — 10 New Members", "Brexit Completed", "contributing", 0.40,
     "EU expansion's political tensions contributed to British euroskepticism and Brexit."),
    ("Copenhagen Climate Summit", "Paris Climate Agreement", "contributing", 0.55,
     "Copenhagen's perceived failure motivated the more flexible Paris Agreement approach."),
    ("Iran Green Revolution", "Arab Spring", "contributing", 0.50,
     "Iran's 2009 Green Revolution was a precursor to the broader Arab Spring movements."),

    # AI & tech
    ("GPT-3 Released", "ChatGPT Launches", "direct", 0.85,
     "GPT-3's capabilities directly led to ChatGPT's consumer launch."),
    ("ChatGPT Launches", "GPT-4 Released", "direct", 0.85,
     "ChatGPT's success drove rapid development of GPT-4's multimodal capabilities."),
    ("DALL-E Unveiled", "ChatGPT Launches", "contributing", 0.50,
     "DALL-E demonstrated OpenAI's generative AI capabilities before ChatGPT's launch."),
    ("GPT-4 Released", "US CHIPS Act", "indirect", 0.30,
     "AI compute demands accelerated semiconductor policy like the CHIPS Act."),
    ("US-China Tech War", "US CHIPS Act", "direct", 0.70,
     "The tech war with China motivated the CHIPS Act to rebuild domestic chip manufacturing."),
    ("SpaceX Lands Falcon 9", "SpaceX Falcon Heavy Launch", "direct", 0.80,
     "Falcon 9 reusability success enabled the Falcon Heavy mission."),
    ("SpaceX Falcon Heavy Launch", "SpaceX Crew Dragon", "direct", 0.70,
     "SpaceX's rocket development led from Falcon Heavy to commercial crew missions."),
    ("SpaceX Crew Dragon", "Artemis I", "contributing", 0.40,
     "Commercial spaceflight success renewed broader lunar ambitions."),
    ("Gravitational Waves Detected", "James Webb Space Telescope Reveals Deep Field", "indirect", 0.25,
     "Major observational breakthroughs reshaped our understanding of the universe."),
    ("Chandrayaan-3", "India Lands on the Moon's South Pole", "direct", 0.95,
     "Same event — India's Chandrayaan-3 lunar landing."),
    ("CrowdStrike Global IT Outage", "Remote Work Revolution", "indirect", 0.25,
     "IT infrastructure vulnerability affected the remote work paradigm."),

    # 2010s-2020s events
    ("Egyptian Revolution — Tahrir Square", "Iran Green Revolution", "contributing", 0.40,
     "Iran's Green Revolution protest model influenced the Egyptian Revolution."),
    ("Deepwater Horizon Oil Spill", "Amazon Rainforest Fires", "indirect", 0.25,
     "Environmental disasters highlighted fossil fuel and land use crises."),
    ("Deepwater Horizon Oil Spill", "Paris Climate Agreement", "contributing", 0.30,
     "Major environmental disasters built momentum for climate action."),
    ("South Sudan Gains Independence", "African Union Founded", "contributing", 0.35,
     "The AU mediated South Sudan's path to independence."),
    ("Edward Snowden NSA Revelations", "US-China Tech War", "indirect", 0.30,
     "Snowden's revelations intensified global tech surveillance and sovereignty concerns."),
    ("Sandy Hook School Shooting", "Parkland School Shooting", "indirect", 0.45,
     "Sandy Hook's failure to produce gun reform motivated Parkland students' activism."),
    ("Ebola Outbreak in West Africa", "COVID-19 Global Lockdowns", "indirect", 0.30,
     "Ebola's pandemic response failures informed COVID-19 preparedness debates."),
    ("Malaysia Airlines MH370 Disappears", "Sichuan Earthquake", "indirect", 0.15,
     "Asian disasters of the 2010s prompted regional cooperation on emergency response."),
    ("H1N1 Swine Flu Pandemic", "COVID-19 Global Lockdowns", "contributing", 0.35,
     "H1N1 pandemic response informed COVID-19 public health measures."),
    ("H1N1 Swine Flu Pandemic", "mRNA COVID-19 Vaccines", "contributing", 0.30,
     "H1N1 accelerated mRNA vaccine research that later produced COVID-19 vaccines."),

    # 2020s
    ("COVID-19 Global Lockdowns", "Remote Work Revolution", "direct", 0.90,
     "COVID lockdowns forced the mass adoption of remote work."),
    ("COVID-19 Global Lockdowns", "Global Supply Chain Crisis", "direct", 0.85,
     "Lockdowns disrupted global supply chains causing widespread shortages."),
    ("COVID-19 Global Lockdowns", "mRNA COVID-19 Vaccines", "direct", 0.80,
     "The pandemic's urgency drove unprecedented vaccine development speed."),
    ("George Floyd Killing Sparks", "#MeToo Movement Goes Global", "indirect", 0.30,
     "Both were social justice movements amplified by social media."),
    ("#MeToo Movement Goes Global", "#MeToo Movement Exposes Systemic", "direct", 0.95,
     "Same movement."),
    ("Russia Launches Full-Scale Invasion of Ukraine", "Nagorno-Karabakh War", "indirect", 0.30,
     "Post-Soviet territorial conflicts escalated from Nagorno-Karabakh to Ukraine."),
    ("Beirut Port Explosion", "Sri Lanka Economic Crisis", "indirect", 0.25,
     "Both reflected governance failures in developing nations."),
    ("October 7 Attack and Israel-Hamas War", "Abraham Accords", "indirect", 0.40,
     "The October 7 attack challenged the normalization trajectory of the Abraham Accords."),
    ("Jamal Khashoggi Assassination", "Iran Hijab Protests", "indirect", 0.25,
     "Middle Eastern human rights crises defined the late 2010s-2020s."),
    ("Iran Hijab Protests", "Iran Green Revolution", "contributing", 0.45,
     "Iran's 2009 Green Revolution was a precursor to the 2022 hijab protests."),
    ("Myanmar Military Coup", "Rohingya Genocide in Myanmar", "contributing", 0.50,
     "Myanmar's military that perpetrated the Rohingya genocide later seized power in a coup."),
    ("Extinction Rebellion and Greta Thunberg", "Paris Climate Agreement", "contributing", 0.35,
     "Climate activism pressured governments to implement Paris Agreement commitments."),
    ("Extinction Rebellion and Greta Thunberg", "Australian Bushfire Crisis", "indirect", 0.30,
     "Climate activism intensified as climate disasters like Australian bushfires worsened."),
    ("Australian Bushfire Crisis", "LA Wildfires — Palisades and Eaton", "indirect", 0.25,
     "Climate-driven wildfire crises affected both Australia and California."),
    ("Notre-Dame Cathedral Fire", "Beirut Port Explosion", "indirect", 0.15,
     "Both were shocking destruction events that captured global attention."),
    ("Queen Elizabeth II Dies at Balmoral", "Queen Elizabeth II Dies — End of the Second Elizabethan", "direct", 0.95,
     "Same event."),
    ("James Webb Space Telescope First Images", "James Webb Space Telescope Reveals Deep Field", "direct", 0.95,
     "Same telescope's initial observations."),
    ("Morocco Earthquake", "Turkey-Syria Earthquake", "indirect", 0.20,
     "Major earthquakes in 2023 highlighted seismic vulnerability in the region."),
    ("Wagner Group Mutiny in Russia", "Russia Launches Full-Scale Invasion of Ukraine", "contributing", 0.45,
     "The Wagner mutiny exposed fractures in Russia's wartime command structure."),
    ("South Korea Martial Law Crisis", "Myanmar Military Coup", "indirect", 0.20,
     "Democratic crises in Asia raised concerns about democratic backsliding."),
    ("Francis Scott Key Bridge Collapse", "CrowdStrike Global IT Outage", "indirect", 0.15,
     "Infrastructure failures highlighted systemic vulnerability in 2024."),
    ("Bird Flu H5N1 Spreads to Dairy Cattle", "COVID-19 Global Lockdowns", "indirect", 0.25,
     "Zoonotic pandemic threats persisted after COVID-19."),
    ("Trump Tariffs — Global Trade War", "US-China Tech War", "contributing", 0.55,
     "Trump's tariff policies escalated the US-China tech decoupling."),

    # Tuvalu
    ("Tuvalu Joins the United Nations", "Pacific Islands Forum Founded", "contributing", 0.35,
     "Pacific Island sovereignty and regional cooperation went hand in hand."),

    # Misc connections for remaining isolates
    ("Las Vegas Mass Shooting", "Sandy Hook School Shooting", "indirect", 0.35,
     "Mass shooting crises continued to shape American gun debate."),
    ("Al-Aqsa Mosque Constructed", "Great Mosque of Damascus", "contributing", 0.45,
     "Umayyad-era mosque construction included both Al-Aqsa and Damascus."),
    ("Shore Temple at Mamallapuram", "Chera Dynasty Dominates Indian Ocean", "indirect", 0.30,
     "South Indian maritime and architectural traditions connected Pallava and Chera cultures."),
    ("Qutub Minar Construction Begins", "Alauddin Khalji's Market Reforms", "indirect", 0.35,
     "Delhi Sultanate's architectural and administrative ambitions spanned multiple dynasties."),
    ("Founding of the Kingdom of Buganda", "Kingdom of Buganda Expands", "direct", 0.85,
     "Buganda's founding led to its later expansion."),
    ("Lozi Kingdom of Barotseland", "Kingdom of Kongo Founded", "indirect", 0.25,
     "Central-southern African state formation occurred across multiple regions."),
    ("Gregorian Chant Codified", "Book of Kells", "indirect", 0.30,
     "Medieval European monastic culture produced both musical and visual masterpieces."),
    ("Muisca Confederation", "Manco Cápac Founds Inca State", "indirect", 0.20,
     "Andean and Colombian highland civilizations developed in parallel."),
    ("Visigothic Code", "Tang Code Completed", "indirect", 0.20,
     "Major legal codifications occurred across Eurasia in the 7th century."),
    ("Polynesian Settlement of Hawai'i", "Kamehameha I Unifies", "contributing", 0.45,
     "Polynesian settlement established the Hawaiian communities Kamehameha later unified."),
    ("Maya Long Count Calendar — Sophisticated Timekeeping", "Maya Classic Period Collapse", "indirect", 0.25,
     "Maya calendrical sophistication was part of Classic period culture that collapsed."),
    ("Kaminaljuyú Highland Center", "Teotihuacan Intervenes in Tikal", "indirect", 0.30,
     "Mesoamerican highland-lowland interactions connected Kaminaljuyú and Teotihuacan."),
    ("Cerros — Early Maya Kingship", "Maya Classical Period Begins", "contributing", 0.40,
     "Early Maya kingship at Cerros established traditions that flowered in the Classic period."),
    ("Pax Romana", "Colosseum Completed", "contributing", 0.55,
     "The peace and prosperity of the Pax Romana enabled monumental building like the Colosseum."),
    ("Pax Romana", "Great Plague of London", "indirect", 0.10,
     "Roman infrastructure and trade routes established disease transmission pathways."),
    ("Great Plague of London", "Great Fire of London", "contributing", 0.40,
     "The plague and fire struck London in consecutive years, transforming the city."),
    ("Great Fire of London", "Versailles Palace Completed", "indirect", 0.20,
     "Post-fire London rebuilding and Versailles construction both reshaped capital cities."),
    ("Titian Becomes Venice's Leading Painter", "Titian Dominates Venetian Painting", "direct", 0.95,
     "Same artist's career."),
    ("Paracelsus Pioneers Chemical Medicine", "Robert Boyle's Sceptical Chymist", "indirect", 0.35,
     "Paracelsus's chemical approach to medicine prefigured Boyle's modern chemistry."),
    ("Baekje", "Silla Unifies Korean Peninsula", "contributing", 0.30,
     "Silla conquered Baekje during the unification of the Korean peninsula."),
    ("Anawrahta Founds the Pagan Kingdom", "Founding of the Sukhothai Kingdom", "indirect", 0.30,
     "Southeast Asian Buddhist kingdoms of Pagan and Sukhothai developed in succession."),
    ("Founding of the Malacca Sultanate", "Sultanates of Ternate and Tidore", "contributing", 0.40,
     "Islamic maritime trade networks connected Malacca to the Spice Islands sultanates."),
    ("Lê Lợi Defeats Ming China", "Trần Dynasty Defeats Mongol Invasions", "indirect", 0.40,
     "Vietnamese resistance traditions from Trần-era Mongol defense inspired Lê Lợi's anti-Ming revolt."),
    ("Fall of Constantinople", "Spanish Inquisition Established", "indirect", 0.30,
     "Ottoman expansion into Europe heightened Christian-Muslim tensions that influenced the Inquisition."),
    ("Rajaraja Chola I", "Shore Temple at Mamallapuram", "indirect", 0.35,
     "South Indian temple-building and naval traditions connected Pallava and Chola architecture."),
    ("Da Viet Gains Independence", "Lê Lợi Defeats Ming China", "contributing", 0.45,
     "Vietnamese independence traditions from 938 inspired later resistance against Ming China."),
    ("Otto I Crowned Holy Roman Emperor", "Hugh Capet Founds Capetian Dynasty", "contributing", 0.35,
     "The post-Carolingian European political order produced both the Holy Roman Empire and Capetian France."),
    ("Battle of Stiklestad", "Christianization of Poland", "indirect", 0.30,
     "Northern European Christianization occurred across Scandinavia and Slavic lands."),
    ("Korean Dharani Sutra", "Goryeo Dynasty Founded", "contributing", 0.30,
     "Korean printing and Buddhist traditions thrived under the Goryeo Dynasty."),
    ("Founding of the Malacca Sultanate", "Majapahit Empire at Its Peak", "contributing", 0.35,
     "Majapahit's decline created space for the Malacca Sultanate's rise."),
]


async def main() -> None:
    conn = await asyncpg.connect(PG_DSN)
    try:
        inserted = 0
        skipped = 0
        failed = 0

        for cause_frag, effect_frag, link_type, strength, desc in LINKS:
            # Find cause event
            cause = await conn.fetchrow(
                "SELECT id, title FROM events WHERE title ILIKE $1 LIMIT 1",
                f"%{cause_frag}%",
            )
            if not cause:
                print(f"  SKIP (no cause): {cause_frag!r}")
                failed += 1
                continue

            # Find effect event
            effect = await conn.fetchrow(
                "SELECT id, title FROM events WHERE title ILIKE $1 LIMIT 1",
                f"%{effect_frag}%",
            )
            if not effect:
                print(f"  SKIP (no effect): {effect_frag!r}")
                failed += 1
                continue

            if cause["id"] == effect["id"]:
                print(f"  SKIP (self-link): {cause_frag!r}")
                skipped += 1
                continue

            result = await conn.execute(
                """INSERT INTO causality_links
                   (cause_event_id, effect_event_id, link_type, strength, description, created_by)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING""",
                cause["id"], effect["id"], link_type, strength, desc, CREATED_BY,
            )
            if result == "INSERT 0 1":
                inserted += 1
            else:
                skipped += 1

        print(f"\nDone: {inserted} inserted, {skipped} skipped (dup/self), {failed} failed (not found)")

        # Summary
        row = await conn.fetchrow(
            "WITH linked AS (SELECT cause_event_id as id FROM causality_links UNION SELECT effect_event_id FROM causality_links) "
            "SELECT COUNT(*) as still_isolated FROM events WHERE id NOT IN (SELECT id FROM linked)"
        )
        total = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        print(f"Still isolated: {row['still_isolated']}")
        print(f"Total causality links: {total}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
