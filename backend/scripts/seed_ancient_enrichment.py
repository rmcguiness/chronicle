#!/usr/bin/env python3
"""
seed_ancient_enrichment.py — Add ~80 curated events from the Ancient period (-3000 to -500 BCE)
covering Mesopotamia, Egypt, Eastern Mediterranean, Israel/Levant, Greece, India, China, Americas.

Run:
    python backend/scripts/seed_ancient_enrichment.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import uuid
from datetime import date

import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
CREATED_BY = "seed-script:ancient-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, geo_era_label, lat, lng, importance_score, slug)
# For BCE events: year_approx is negative (e.g., -1754 for 1754 BCE)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # MESOPOTAMIA & PERSIA
    # ═══════════════════════════════════════════════════════════════════════
    ("Code of Hammurabi — First Major Law Code", -1754, "political",
     "Babylon, Iraq", "Old Babylonian Empire",
     32.54, 44.42, 0.95, "code-of-hammurabi-1754bce"),

    ("Rise of the Akkadian Empire Under Sargon", -2334, "political",
     "Akkad, Iraq", "Akkadian Empire",
     33.10, 44.10, 0.85, "sargon-akkadian-empire-2334bce"),

    ("Ur-Nammu Founds the Third Dynasty of Ur", -2112, "political",
     "Ur, Iraq", "Neo-Sumerian Period",
     30.96, 46.10, 0.70, "ur-nammu-third-dynasty-ur-2112bce"),

    ("Invention of Cuneiform Writing in Sumer", -3100, "discovery",
     "Uruk, Iraq", "Sumerian Civilization",
     31.32, 45.64, 0.95, "cuneiform-writing-sumer-3100bce"),

    ("Epic of Gilgamesh Composed", -2100, "cultural",
     "Uruk, Iraq", "Sumerian Civilization",
     31.32, 45.64, 0.80, "epic-of-gilgamesh-2100bce"),

    ("Assyrian Empire Reaches Peak Under Ashurbanipal", -668, "political",
     "Nineveh, Iraq", "Neo-Assyrian Empire",
     36.36, 43.15, 0.80, "ashurbanipal-assyrian-peak-668bce"),

    ("Fall of Nineveh — Assyrian Empire Collapses", -612, "war",
     "Nineveh, Iraq", "Neo-Assyrian Empire",
     36.36, 43.15, 0.75, "fall-of-nineveh-612bce"),

    ("Nebuchadnezzar II Builds Babylon's Hanging Gardens", -600, "cultural",
     "Babylon, Iraq", "Neo-Babylonian Empire",
     32.54, 44.42, 0.75, "nebuchadnezzar-hanging-gardens-600bce"),

    ("Cyrus the Great Founds the Achaemenid Empire", -550, "political",
     "Pasargadae, Iran", "Achaemenid Empire",
     30.19, 53.17, 0.95, "cyrus-achaemenid-empire-550bce"),

    ("Cyrus Conquers Babylon — Cyrus Cylinder", -539, "political",
     "Babylon, Iraq", "Achaemenid Empire",
     32.54, 44.42, 0.85, "cyrus-conquers-babylon-539bce"),

    ("Darius I Reorganizes the Persian Empire", -522, "political",
     "Persepolis, Iran", "Achaemenid Empire",
     29.93, 52.89, 0.80, "darius-reorganizes-persia-522bce"),

    ("Construction of Persepolis Begins", -515, "cultural",
     "Persepolis, Iran", "Achaemenid Empire",
     29.93, 52.89, 0.70, "persepolis-construction-515bce"),

    ("Battle of Marathon — Greeks Defeat Persia", -490, "war",
     "Marathon, Greece", "Greco-Persian Wars",
     38.15, 23.97, 0.90, "battle-of-marathon-490bce"),

    ("Xerxes Invades Greece — Second Persian Invasion", -480, "war",
     "Thermopylae, Greece", "Greco-Persian Wars",
     38.80, 22.56, 0.85, "xerxes-invades-greece-480bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # EGYPT — NEW KINGDOM & LATE PERIOD
    # ═══════════════════════════════════════════════════════════════════════
    ("Unification of Upper and Lower Egypt Under Narmer", -3100, "political",
     "Memphis, Egypt", "Early Dynastic Egypt",
     29.84, 31.25, 0.90, "narmer-unification-egypt-3100bce"),

    ("Great Pyramid of Giza Constructed", -2560, "cultural",
     "Giza, Egypt", "Old Kingdom Egypt",
     29.98, 31.13, 1.0, "great-pyramid-giza-2560bce"),

    ("Middle Kingdom Egypt — Reunification Under Mentuhotep II", -2055, "political",
     "Thebes, Egypt", "Middle Kingdom Egypt",
     25.70, 32.64, 0.65, "middle-kingdom-egypt-2055bce"),

    ("Hyksos Invasion of Egypt", -1650, "war",
     "Avaris, Egypt", "Second Intermediate Period",
     30.79, 31.82, 0.60, "hyksos-invasion-egypt-1650bce"),

    ("Hatshepsut Becomes Pharaoh — Female Ruler of Egypt", -1479, "political",
     "Thebes, Egypt", "New Kingdom Egypt",
     25.74, 32.60, 0.80, "hatshepsut-pharaoh-1479bce"),

    ("Thutmose III — Napoleon of Egypt — Battle of Megiddo", -1457, "war",
     "Megiddo, Israel", "New Kingdom Egypt",
     32.58, 35.18, 0.75, "thutmose-iii-megiddo-1457bce"),

    ("Akhenaten's Religious Revolution — Worship of Aten", -1350, "religious",
     "Amarna, Egypt", "New Kingdom Egypt",
     27.65, 30.90, 0.80, "akhenaten-aten-revolution-1350bce"),

    ("Ramesses II and the Battle of Kadesh", -1274, "war",
     "Kadesh, Syria", "New Kingdom Egypt",
     34.56, 36.52, 0.80, "ramesses-ii-kadesh-1274bce"),

    ("Treaty of Kadesh — First Known Peace Treaty", -1259, "political",
     "Kadesh, Syria", "New Kingdom Egypt",
     34.56, 36.52, 0.75, "treaty-of-kadesh-1259bce"),

    ("Sea Peoples Crisis — Bronze Age Collapse", -1200, "war",
     "Eastern Mediterranean", "Bronze Age Collapse",
     34.00, 33.00, 0.90, "sea-peoples-bronze-age-collapse-1200bce"),

    ("Late Period Egypt — Saite Dynasty Revival", -664, "political",
     "Sais, Egypt", "Late Period Egypt",
     30.97, 30.77, 0.55, "saite-dynasty-revival-664bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # EASTERN MEDITERRANEAN — MINOANS, MYCENAEANS, PHOENICIANS
    # ═══════════════════════════════════════════════════════════════════════
    ("Minoan Civilization Peak — Palace of Knossos", -1700, "cultural",
     "Knossos, Crete, Greece", "Minoan Civilization",
     35.30, 25.16, 0.80, "minoan-knossos-peak-1700bce"),

    ("Thera Eruption — Catastrophic Volcanic Event", -1600, "political",
     "Santorini, Greece", "Minoan Civilization",
     36.40, 25.43, 0.75, "thera-eruption-1600bce"),

    ("Mycenaean Civilization Peak — Lion Gate Built", -1250, "cultural",
     "Mycenae, Greece", "Mycenaean Greece",
     37.73, 22.76, 0.70, "mycenaean-lion-gate-1250bce"),

    ("Mycenaean Collapse — End of Bronze Age Greece", -1200, "political",
     "Mycenae, Greece", "Bronze Age Collapse",
     37.73, 22.76, 0.75, "mycenaean-collapse-1200bce"),

    ("Phoenician Alphabet Developed", -1050, "discovery",
     "Byblos, Lebanon", "Phoenician Civilization",
     34.12, 35.65, 0.90, "phoenician-alphabet-1050bce"),

    ("Founding of Carthage by Phoenicians", -814, "political",
     "Tunis, Tunisia", "Phoenician Civilization",
     36.85, 10.32, 0.75, "phoenicians-found-carthage-814bce"),

    ("Phoenician Circumnavigation of Africa", -600, "discovery",
     "Eastern Mediterranean", "Phoenician Civilization",
     33.89, 35.50, 0.55, "phoenician-circumnavigation-africa-600bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # ISRAEL & LEVANT
    # ═══════════════════════════════════════════════════════════════════════
    ("Solomon's Temple Built in Jerusalem", -957, "religious",
     "Jerusalem, Israel", "Kingdom of Israel",
     31.78, 35.24, 0.85, "solomons-temple-957bce"),

    ("Kingdom of Israel Divided — Judah and Israel", -930, "political",
     "Jerusalem, Israel", "Kingdom of Israel",
     31.78, 35.24, 0.70, "kingdom-divided-930bce"),

    ("Assyrian Conquest of the Kingdom of Israel", -722, "war",
     "Samaria, Israel", "Neo-Assyrian Empire",
     32.27, 35.19, 0.75, "assyrian-conquest-israel-722bce"),

    ("Babylonian Exile — Destruction of Solomon's Temple", -586, "war",
     "Jerusalem, Israel", "Neo-Babylonian Empire",
     31.78, 35.24, 0.85, "babylonian-exile-586bce"),

    ("Edict of Cyrus — Jews Return from Exile", -538, "political",
     "Jerusalem, Israel", "Achaemenid Empire",
     31.78, 35.24, 0.70, "edict-of-cyrus-538bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # GREECE
    # ═══════════════════════════════════════════════════════════════════════
    ("First Olympic Games Held at Olympia", -776, "cultural",
     "Olympia, Greece", "Archaic Greece",
     37.64, 21.63, 0.80, "first-olympic-games-776bce"),

    ("Homer Composes the Iliad and Odyssey", -750, "cultural",
     "Ionia, Turkey", "Archaic Greece",
     38.42, 27.14, 0.90, "homer-iliad-odyssey-750bce"),

    ("Founding of Greek Colonies Across Mediterranean", -750, "political",
     "Mediterranean Basin", "Archaic Greece",
     37.50, 15.09, 0.70, "greek-colonization-750bce"),

    ("Draco's Law Code in Athens", -621, "political",
     "Athens, Greece", "Archaic Greece",
     37.97, 23.73, 0.65, "dracos-law-code-621bce"),

    ("Solon's Reforms in Athens", -594, "political",
     "Athens, Greece", "Archaic Greece",
     37.97, 23.73, 0.75, "solons-reforms-594bce"),

    ("Cleisthenes Establishes Athenian Democracy", -508, "political",
     "Athens, Greece", "Archaic Greece",
     37.97, 23.73, 0.85, "cleisthenes-democracy-508bce"),

    ("Battle of Thermopylae — 300 Spartans", -480, "war",
     "Thermopylae, Greece", "Greco-Persian Wars",
     38.80, 22.56, 0.85, "battle-thermopylae-480bce"),

    ("Battle of Salamis — Greek Naval Victory", -480, "war",
     "Salamis, Greece", "Greco-Persian Wars",
     37.96, 23.49, 0.80, "battle-salamis-480bce"),

    ("Athens Golden Age Under Pericles", -450, "political",
     "Athens, Greece", "Classical Greece",
     37.97, 23.73, 0.90, "athens-golden-age-pericles-450bce"),

    ("Construction of the Parthenon", -447, "cultural",
     "Athens, Greece", "Classical Greece",
     37.97, 23.73, 0.85, "parthenon-construction-447bce"),

    ("Peloponnesian War Begins — Athens vs Sparta", -431, "war",
     "Greece", "Classical Greece",
     37.97, 23.73, 0.85, "peloponnesian-war-begins-431bce"),

    ("Socrates Executed in Athens", -399, "cultural",
     "Athens, Greece", "Classical Greece",
     37.97, 23.73, 0.80, "socrates-executed-399bce"),

    ("Plato Founds the Academy in Athens", -387, "cultural",
     "Athens, Greece", "Classical Greece",
     37.97, 23.73, 0.80, "plato-founds-academy-387bce"),

    ("Aristotle Opens the Lyceum", -335, "cultural",
     "Athens, Greece", "Classical Greece",
     37.97, 23.73, 0.75, "aristotle-lyceum-335bce"),

    ("Alexander the Great Conquers the Persian Empire", -334, "war",
     "Granicus, Turkey", "Hellenistic Period",
     40.34, 27.54, 0.95, "alexander-conquers-persia-334bce"),

    ("Alexander Founds Alexandria in Egypt", -331, "political",
     "Alexandria, Egypt", "Hellenistic Period",
     31.20, 29.92, 0.80, "alexander-founds-alexandria-331bce"),

    ("Death of Alexander the Great — Empire Fragments", -323, "political",
     "Babylon, Iraq", "Hellenistic Period",
     32.54, 44.42, 0.85, "death-of-alexander-323bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # INDIA — VEDIC AGE & EARLY KINGDOMS
    # ═══════════════════════════════════════════════════════════════════════
    ("Indus Valley Civilization Peak — Mohenjo-daro", -2500, "cultural",
     "Mohenjo-daro, Pakistan", "Indus Valley Civilization",
     27.33, 68.14, 0.90, "indus-valley-mohenjo-daro-2500bce"),

    ("Decline of the Indus Valley Civilization", -1900, "political",
     "Harappa, Pakistan", "Indus Valley Civilization",
     30.63, 72.87, 0.70, "indus-valley-decline-1900bce"),

    ("Vedic Period Begins — Rigveda Composed", -1500, "religious",
     "Punjab, India/Pakistan", "Vedic Age",
     30.90, 75.85, 0.80, "vedic-period-rigveda-1500bce"),

    ("Upanishads Composed — Foundations of Hindu Philosophy", -800, "religious",
     "Ganges Plain, India", "Late Vedic Period",
     26.85, 80.91, 0.75, "upanishads-composed-800bce"),

    ("Mahavira Born — Founder of Jainism", -599, "religious",
     "Vaishali, India", "Mahajanapadas Period",
     25.98, 85.13, 0.70, "mahavira-born-599bce"),

    ("Siddhartha Gautama (Buddha) Born", -563, "religious",
     "Lumbini, Nepal", "Mahajanapadas Period",
     27.47, 83.28, 0.90, "buddha-born-563bce"),

    ("Mahajanapadas — Sixteen Kingdoms of India", -600, "political",
     "Ganges Plain, India", "Mahajanapadas Period",
     25.32, 83.01, 0.65, "mahajanapadas-sixteen-kingdoms-600bce"),

    ("Panini Composes Sanskrit Grammar — Ashtadhyayi", -500, "cultural",
     "Gandhara, Pakistan", "Mahajanapadas Period",
     34.20, 71.78, 0.65, "panini-sanskrit-grammar-500bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # CHINA — SHANG, ZHOU, SPRING AND AUTUMN
    # ═══════════════════════════════════════════════════════════════════════
    ("Shang Dynasty — First Chinese Dynasty with Written Records", -1600, "political",
     "Anyang, China", "Shang Dynasty",
     36.10, 114.35, 0.80, "shang-dynasty-1600bce"),

    ("Oracle Bone Script — Earliest Chinese Writing", -1200, "discovery",
     "Anyang, China", "Shang Dynasty",
     36.10, 114.35, 0.80, "oracle-bone-script-1200bce"),

    ("Zhou Dynasty Overthrows Shang — Mandate of Heaven", -1046, "political",
     "Xi'an, China", "Zhou Dynasty",
     34.26, 108.94, 0.80, "zhou-dynasty-mandate-of-heaven-1046bce"),

    ("Spring and Autumn Period Begins", -771, "political",
     "Luoyang, China", "Eastern Zhou Dynasty",
     34.62, 112.45, 0.70, "spring-autumn-period-771bce"),

    ("Confucius Born — Founder of Confucianism", -551, "religious",
     "Qufu, China", "Spring and Autumn Period",
     35.60, 116.99, 0.90, "confucius-born-551bce"),

    ("Laozi and the Origins of Daoism", -550, "religious",
     "Luoyang, China", "Eastern Zhou Dynasty",
     34.62, 112.45, 0.75, "laozi-daoism-550bce"),

    ("Sun Tzu Writes The Art of War", -500, "cultural",
     "Eastern China", "Spring and Autumn Period",
     32.06, 118.76, 0.80, "sun-tzu-art-of-war-500bce"),

    ("Warring States Period Begins", -475, "war",
     "China", "Warring States Period",
     34.26, 108.94, 0.75, "warring-states-begin-475bce"),

    ("Hundred Schools of Thought Flourish", -475, "cultural",
     "China", "Warring States Period",
     34.26, 108.94, 0.70, "hundred-schools-thought-475bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAS — OLMEC & EARLY CIVILIZATIONS
    # ═══════════════════════════════════════════════════════════════════════
    ("Olmec Civilization Peak — La Venta", -1200, "cultural",
     "Tabasco, Mexico", "Olmec Civilization",
     18.10, -94.05, 0.80, "olmec-civilization-peak-1200bce"),

    ("Olmec Colossal Heads Carved at San Lorenzo", -1400, "cultural",
     "Veracruz, Mexico", "Olmec Civilization",
     17.75, -95.33, 0.70, "olmec-colossal-heads-1400bce"),

    ("Chavin Culture Emerges in Peru", -900, "cultural",
     "Chavin de Huantar, Peru", "Chavin Civilization",
     -9.59, -77.18, 0.70, "chavin-culture-peru-900bce"),

    ("Monte Alban Founded by Zapotecs", -500, "political",
     "Oaxaca, Mexico", "Zapotec Civilization",
     17.04, -96.77, 0.65, "monte-alban-founded-500bce"),

    ("Norte Chico Civilization — Americas' Oldest City", -3000, "cultural",
     "Caral, Peru", "Norte Chico Civilization",
     -10.89, -77.52, 0.75, "norte-chico-caral-3000bce"),

    # ═══════════════════════════════════════════════════════════════════════
    # OTHER ANCIENT CIVILIZATIONS
    # ═══════════════════════════════════════════════════════════════════════
    ("Kingdom of Kush Conquers Egypt — Nubian Pharaohs", -750, "political",
     "Napata, Sudan", "Kingdom of Kush",
     18.53, 31.83, 0.65, "kush-conquers-egypt-750bce"),

    ("Meroe Becomes Capital of Kush", -590, "political",
     "Meroe, Sudan", "Kingdom of Kush",
     16.94, 33.75, 0.55, "meroe-capital-kush-590bce"),

    ("Etruscans Dominate Central Italy", -750, "political",
     "Tuscany, Italy", "Etruscan Civilization",
     43.07, 11.78, 0.60, "etruscan-civilization-750bce"),

    ("Founding of Rome — Traditional Date", -753, "political",
     "Rome, Italy", "Roman Kingdom",
     41.90, 12.50, 0.85, "founding-of-rome-753bce"),

    ("Lydians Invent Coinage — First Coins", -600, "discovery",
     "Sardis, Turkey", "Kingdom of Lydia",
     38.49, 28.04, 0.75, "lydian-coinage-invention-600bce"),

    ("Zoroaster Founds Zoroastrianism", -1000, "religious",
     "Eastern Iran", "Ancient Iran",
     35.70, 51.42, 0.70, "zoroaster-zoroastrianism-1000bce"),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Mesopotamian chains
    ("Invention of Cuneiform Writing", "Epic of Gilgamesh",
     "contributing", 0.70, "Cuneiform enabled the recording of literature."),
    ("Rise of the Akkadian Empire", "Ur-Nammu Founds the Third Dynasty",
     "contributing", 0.50, "Akkadian collapse enabled Ur's resurgence."),
    ("Code of Hammurabi", "Draco's Law Code",
     "contributing", 0.40, "Early Mesopotamian law codes influenced later legal traditions."),
    ("Ashurbanipal Assyrian Peak", "Fall of Nineveh",
     "direct", 0.75, "Overextension under Ashurbanipal weakened the empire."),
    ("Fall of Nineveh", "Nebuchadnezzar II Builds Babylon",
     "direct", 0.70, "Babylon rose from Assyria's ashes."),
    ("Nebuchadnezzar II Builds Babylon", "Babylonian Exile",
     "direct", 0.80, "Nebuchadnezzar destroyed Jerusalem and exiled the Jews."),
    ("Cyrus the Great Founds the Achaemenid", "Cyrus Conquers Babylon",
     "direct", 0.90, "Persian expansion led to Babylon's conquest."),
    ("Cyrus Conquers Babylon", "Edict of Cyrus — Jews Return",
     "direct", 0.90, "Cyrus freed the Jews after conquering Babylon."),
    ("Darius I Reorganizes the Persian", "Construction of Persepolis",
     "direct", 0.85, "Darius built Persepolis as the empire's ceremonial capital."),
    ("Darius I Reorganizes the Persian", "Battle of Marathon",
     "contributing", 0.65, "Darius's expansionism brought Persia into conflict with Greece."),
    ("Battle of Marathon", "Xerxes Invades Greece",
     "direct", 0.85, "Marathon's humiliation motivated Xerxes' massive invasion."),

    # Egyptian chains
    ("Great Pyramid of Giza", "Middle Kingdom Egypt",
     "contributing", 0.40, "Old Kingdom achievements set the cultural template."),
    ("Hyksos Invasion of Egypt", "Hatshepsut Becomes Pharaoh",
     "contributing", 0.45, "Expelling the Hyksos preceded the New Kingdom's rise."),
    ("Hatshepsut Becomes Pharaoh", "Thutmose III — Napoleon of Egypt",
     "direct", 0.75, "Thutmose III succeeded Hatshepsut and expanded the empire."),
    ("Akhenaten's Religious Revolution", "Ramesses II and the Battle of Kadesh",
     "contributing", 0.45, "Post-Akhenaten restoration strengthened Egypt for Ramesses' campaigns."),
    ("Ramesses II and the Battle of Kadesh", "Treaty of Kadesh",
     "direct", 0.90, "The battle's stalemate led to the first peace treaty."),
    ("Sea Peoples Crisis", "Mycenaean Collapse",
     "contributing", 0.70, "The Sea Peoples devastated eastern Mediterranean civilizations."),

    # Eastern Mediterranean chains
    ("Minoan Civilization Peak", "Thera Eruption",
     "contributing", 0.60, "Thera's eruption devastated Minoan civilization."),
    ("Thera Eruption", "Mycenaean Civilization Peak",
     "contributing", 0.50, "Minoan decline allowed Mycenaean dominance."),
    ("Mycenaean Collapse", "Phoenician Alphabet",
     "contributing", 0.50, "Post-collapse recovery spurred Phoenician innovation."),
    ("Phoenician Alphabet", "Homer Composes the Iliad",
     "contributing", 0.65, "Greek adoption of the Phoenician alphabet enabled literary composition."),
    ("Founding of Carthage", "Phoenician Circumnavigation",
     "contributing", 0.45, "Carthage extended Phoenician maritime reach."),

    # Israelite chains
    ("Solomon's Temple Built", "Kingdom of Israel Divided",
     "direct", 0.70, "Solomon's death triggered the kingdom's division."),
    ("Kingdom of Israel Divided", "Assyrian Conquest of the Kingdom of Israel",
     "direct", 0.65, "The weakened northern kingdom fell to Assyria."),
    ("Assyrian Conquest of the Kingdom of Israel", "Babylonian Exile",
     "contributing", 0.55, "Assyrian precedent foreshadowed Babylon's conquest of Judah."),
    ("Babylonian Exile", "Edict of Cyrus",
     "direct", 0.85, "Cyrus ended the Babylonian Exile."),

    # Greek chains
    ("First Olympic Games", "Greek Colonization Across",
     "contributing", 0.40, "Shared Greek identity fostered colonial expansion."),
    ("Solon's Reforms", "Cleisthenes Establishes Athenian Democracy",
     "direct", 0.75, "Solon's reforms laid groundwork for Cleisthenes' democracy."),
    ("Cleisthenes Establishes Athenian Democracy", "Athens Golden Age Under Pericles",
     "direct", 0.80, "Democracy enabled Athens' cultural flourishing."),
    ("Athens Golden Age Under Pericles", "Construction of the Parthenon",
     "direct", 0.90, "Pericles commissioned the Parthenon."),
    ("Athens Golden Age Under Pericles", "Peloponnesian War Begins",
     "contributing", 0.65, "Athenian power provoked Spartan-led opposition."),
    ("Peloponnesian War Begins", "Socrates Executed",
     "contributing", 0.55, "Athens' defeat created the climate of Socrates' trial."),
    ("Socrates Executed", "Plato Founds the Academy",
     "direct", 0.85, "Socrates' death inspired Plato's philosophical mission."),
    ("Plato Founds the Academy", "Aristotle Opens the Lyceum",
     "direct", 0.80, "Aristotle studied at Plato's Academy before founding his own."),
    ("Aristotle Opens the Lyceum", "Alexander the Great Conquers",
     "contributing", 0.60, "Aristotle tutored Alexander."),
    ("Alexander the Great Conquers", "Alexander Founds Alexandria",
     "direct", 0.85, "Alexander founded Alexandria during his conquests."),
    ("Alexander the Great Conquers", "Death of Alexander",
     "direct", 0.90, "Alexander's conquests ended with his sudden death."),
    ("Xerxes Invades Greece", "Battle of Thermopylae",
     "direct", 0.90, "Thermopylae was fought during Xerxes' invasion."),
    ("Battle of Thermopylae", "Battle of Salamis",
     "direct", 0.85, "Thermopylae's sacrifice bought time for the naval victory at Salamis."),

    # Indian chains
    ("Indus Valley Civilization Peak", "Decline of the Indus Valley",
     "direct", 0.70, "Environmental and social stresses caused Indus Valley decline."),
    ("Decline of the Indus Valley", "Vedic Period Begins",
     "contributing", 0.55, "Post-Indus migrations set the stage for Vedic culture."),
    ("Vedic Period Begins", "Upanishads Composed",
     "direct", 0.75, "Vedic religion evolved into Upanishadic philosophy."),
    ("Upanishads Composed", "Mahavira Born",
     "contributing", 0.55, "Upanishadic questioning inspired heterodox movements."),
    ("Upanishads Composed", "Siddhartha Gautama (Buddha) Born",
     "contributing", 0.55, "Buddhist thought emerged from the Vedic philosophical milieu."),

    # Chinese chains
    ("Shang Dynasty", "Oracle Bone Script",
     "direct", 0.80, "Oracle bones were a Shang dynasty practice."),
    ("Shang Dynasty", "Zhou Dynasty Overthrows Shang",
     "direct", 0.85, "The Zhou overthrew the Shang."),
    ("Zhou Dynasty Overthrows Shang", "Spring and Autumn Period",
     "direct", 0.80, "Zhou weakening led to the Spring and Autumn fragmentation."),
    ("Spring and Autumn Period", "Confucius Born",
     "contributing", 0.65, "Political disorder inspired Confucius' philosophy."),
    ("Spring and Autumn Period", "Warring States Period",
     "direct", 0.85, "Spring and Autumn conflicts escalated into the Warring States."),
    ("Confucius Born", "Hundred Schools of Thought",
     "contributing", 0.70, "Confucius was the foremost of the Hundred Schools."),
    ("Sun Tzu Writes The Art of War", "Warring States Period",
     "contributing", 0.50, "Military theory reflected the escalating conflicts."),

    # Americas chains
    ("Olmec Colossal Heads", "Olmec Civilization Peak",
     "contributing", 0.65, "San Lorenzo preceded La Venta as the Olmec center."),
    ("Olmec Civilization Peak", "Monte Alban Founded",
     "contributing", 0.50, "Olmec influence shaped later Mesoamerican cultures."),

    # Cross-regional chains
    ("Lydians Invent Coinage", "Darius I Reorganizes the Persian",
     "contributing", 0.55, "Lydian coinage was adopted and spread by the Persian Empire."),
    ("Founding of Rome", "Etruscan Civilization",
     "contributing", 0.50, "Rome emerged under Etruscan cultural influence."),
]


async def main():
    """Insert ancient enrichment events and causality links."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events ──
    rows = await conn.fetch("SELECT id, slug, title FROM events")
    slugs_existing = {r["slug"] for r in rows}
    events_by_title: dict[str, str] = {r["title"]: str(r["id"]) for r in rows}
    event_count_before = len(rows)

    link_rows = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, category, geo, geo_era, lat, lng, importance, slug in NEW_EVENTS:
        if slug in slugs_existing:
            print(f"  SKIP (exists): {slug}")
            continue

        event_id = str(uuid.uuid4())
        is_bce = year < 0
        abs_year = abs(year)
        if abs_year > 4712:
            abs_year = 4712  # Postgres BC date limit

        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        wkt = f"SRID=4326;POINT({lng} {lat})"
        content_hash = sha256_str(json.dumps({"slug": slug, "year": year}, sort_keys=True))

        try:
            await conn.execute(f"""
                INSERT INTO events (
                    id, slug, title, date_earliest, date_latest, year_approx, is_bce,
                    geo_point, geo_modern, geo_era_label,
                    importance_score, zoom_min, event_category,
                    review_status, created_by, content_hash
                ) VALUES (
                    $1, $2, $3, {date_e_lit}, {date_l_lit}, $4, $5,
                    ST_GeomFromEWKT($6), $7, $8,
                    $9, $10, $11,
                    'approved', $12, $13
                )
            """, event_id, slug, title, year, is_bce,
                wkt, geo, geo_era,
                importance, 2, category,
                CREATED_BY, content_hash)
            events_by_title[title] = event_id
            slugs_existing.add(slug)
            events_inserted += 1
        except Exception as e:
            print(f"  ERROR inserting {slug}: {e}")

    print(f"Inserted {events_inserted} new events")

    # ── Helper: find event ID by title substring ──
    def find_event(fragment):
        matches = [(t, eid) for t, eid in events_by_title.items() if fragment in t]
        if not matches:
            return None
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
                VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, $7, 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
            """, link_id, cause_id, effect_id, link_type, strength, description, CREATED_BY)
            existing_links.add((cause_id, effect_id))
            links_inserted += 1
        except Exception as e:
            print(f"  ERROR link '{cause_frag}' -> '{effect_frag}': {e}")
            links_skipped += 1

    print(f"Inserted {links_inserted} new links (skipped {links_skipped}, not found {links_not_found})")

    # ── Verify totals ──
    total_ancient = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN -3100 AND -300")
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nAncient events (-3100 to -300): {total_ancient}")
    print(f"Total events: {total_events}, total links: {total_links}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
