#!/usr/bin/env python3
"""
Seed ~100 curated ancient history events (BCE — 500 CE) into Chronicle.

Idempotent: skips events whose slug already exists.

Run from backend/ directory:
    python scripts/seed_ancient_events.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
from typing import Any

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
CREATED_BY = "seed-script:ancient-history-v1"

# ─────────────────────────────────────────────────────────────────────────────
# EVENT DATA — ~100 ancient history events
# ─────────────────────────────────────────────────────────────────────────────

EVENTS: list[dict[str, Any]] = [

    # ═══════════════════════════════════════════════════════════════════════
    # MESOPOTAMIA / SUMER / NEAR EAST
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "uruk-period-city-civilization",
        "title": "Uruk — World's First Great City",
        "year": -3500, "is_bce": True,
        "lat": 31.3225, "lng": 45.6367,
        "geo_modern": "Warka, Iraq", "geo_era_label": "Sumerian Mesopotamia",
        "category": "cultural", "importance": 0.85, "zoom_min": 3,
        "tags": ["urbanization", "sumer", "mesopotamia"],
        "description": "Uruk grew to become the largest city in the world, with a population of up to 40,000. It pioneered monumental architecture, bureaucratic administration, and proto-writing on clay tablets.",
    },
    {
        "slug": "epic-of-gilgamesh-composed",
        "title": "Epic of Gilgamesh — Oldest Literary Masterpiece",
        "year": -2100, "is_bce": True,
        "lat": 31.3225, "lng": 45.6367,
        "geo_modern": "Mesopotamia, Iraq", "geo_era_label": "Sumerian Mesopotamia",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["literature", "sumer", "mythology"],
        "description": "The Epic of Gilgamesh, composed in Sumerian and later Akkadian, tells of King Gilgamesh's quest for immortality. It is the oldest surviving work of great literature and includes a flood narrative predating the Biblical account.",
    },
    {
        "slug": "ur-nammu-law-code",
        "title": "Code of Ur-Nammu — Oldest Known Law Code",
        "year": -2100, "is_bce": True,
        "lat": 30.9627, "lng": 46.1031,
        "geo_modern": "Tell el-Muqayyar, Iraq", "geo_era_label": "Third Dynasty of Ur",
        "category": "political", "importance": 0.78, "zoom_min": 4,
        "tags": ["law", "sumer", "ur"],
        "description": "King Ur-Nammu of Ur promulgated the oldest surviving legal code, predating Hammurabi by three centuries. It established fines rather than physical punishments for many offenses, representing an early move toward codified justice.",
    },
    {
        "slug": "third-dynasty-of-ur",
        "title": "Third Dynasty of Ur — Sumerian Renaissance",
        "year": -2112, "is_bce": True,
        "lat": 30.9627, "lng": 46.1031,
        "geo_modern": "Ur, Iraq", "geo_era_label": "Third Dynasty of Ur",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["sumer", "ur", "empire"],
        "description": "The Third Dynasty of Ur marked a Sumerian cultural renaissance under kings Ur-Nammu and Shulgi. The empire administered a vast bureaucracy and produced the Great Ziggurat of Ur, one of the best-preserved Mesopotamian temples.",
    },
    {
        "slug": "iron-age-begins-near-east",
        "title": "Iron Age Begins in the Near East",
        "year": -1200, "is_bce": True,
        "lat": 39.9208, "lng": 32.8541,
        "geo_modern": "Anatolia, Turkey", "geo_era_label": "Iron Age Near East",
        "category": "discovery", "importance": 0.80, "zoom_min": 3,
        "tags": ["iron-age", "technology", "metallurgy"],
        "description": "The collapse of Bronze Age trade networks forced adoption of iron smelting, which was more widely available than tin-bronze. Iron tools and weapons gradually spread from Anatolia and the Levant, transforming agriculture and warfare across Eurasia.",
    },
    {
        "slug": "sea-peoples-invasions",
        "title": "Sea Peoples Invade the Eastern Mediterranean",
        "year": -1180, "is_bce": True,
        "lat": 31.5, "lng": 34.5,
        "geo_modern": "Eastern Mediterranean", "geo_era_label": "Bronze Age Collapse",
        "category": "war", "importance": 0.75, "zoom_min": 3,
        "tags": ["sea-peoples", "bronze-age-collapse", "migration"],
        "description": "Waves of mysterious maritime raiders attacked Egypt, the Hittites, and Levantine city-states. Ramesses III repelled them at the Battle of the Delta, but the invasions contributed to the devastating Bronze Age Collapse that ended multiple civilizations.",
    },
    {
        "slug": "zoroaster-founding-zoroastrianism",
        "title": "Zoroaster Founds Zoroastrianism",
        "year": -1000, "is_bce": True,
        "lat": 36.7, "lng": 57.3,
        "geo_modern": "Northeastern Iran", "geo_era_label": "Ancient Persia",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["religion", "zoroastrianism", "persia"],
        "description": "The prophet Zoroaster established one of the world's first monotheistic religions in ancient Persia. His teachings of cosmic dualism between good (Ahura Mazda) and evil (Angra Mainyu) profoundly influenced Judaism, Christianity, and Islam.",
    },
    {
        "slug": "persian-royal-road",
        "title": "Persian Royal Road — Ancient Highway System",
        "year": -500, "is_bce": True,
        "lat": 38.4, "lng": 43.3,
        "geo_modern": "Turkey to Iran", "geo_era_label": "Achaemenid Persia",
        "category": "cultural", "importance": 0.70, "zoom_min": 4,
        "tags": ["persia", "infrastructure", "trade"],
        "description": "The Royal Road stretched 2,700 km from Sardis to Susa, enabling rapid communication across the Persian Empire. Mounted couriers could traverse the entire route in seven days, a feat that amazed the Greek historian Herodotus.",
    },
    {
        "slug": "battle-of-salamis",
        "title": "Battle of Salamis — Greek Naval Victory Over Persia",
        "year": -480, "is_bce": True,
        "lat": 37.9475, "lng": 23.5833,
        "geo_modern": "Salamis Island, Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance": 0.88, "zoom_min": 3,
        "tags": ["persian-wars", "naval-battle", "greece", "persia"],
        "description": "The Athenian-led Greek fleet decisively defeated Xerxes' much larger Persian navy in the narrow strait of Salamis. Themistocles' strategy exploited the confined waters, neutralizing Persian numerical superiority and saving Greek independence.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT EGYPT
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "old-kingdom-egypt-age-of-pyramids",
        "title": "Old Kingdom Egypt — The Age of Pyramids",
        "year": -2686, "is_bce": True,
        "lat": 29.87, "lng": 31.22,
        "geo_modern": "Memphis, Egypt", "geo_era_label": "Old Kingdom Egypt",
        "category": "political", "importance": 0.82, "zoom_min": 3,
        "tags": ["egypt", "old-kingdom", "pyramids"],
        "description": "The Old Kingdom (c. 2686–2181 BCE) saw the height of pharaonic power and pyramid construction. Memphis served as capital while massive royal tombs at Giza, Saqqara, and Dahshur demonstrated the state's organizational capacity.",
    },
    {
        "slug": "step-pyramid-djoser-saqqara",
        "title": "Step Pyramid of Djoser — First Monumental Stone Building",
        "year": -2670, "is_bce": True,
        "lat": 29.8713, "lng": 31.2163,
        "geo_modern": "Saqqara, Egypt", "geo_era_label": "Old Kingdom Egypt",
        "category": "cultural", "importance": 0.80, "zoom_min": 4,
        "tags": ["egypt", "architecture", "pyramid", "imhotep"],
        "description": "Architect Imhotep designed the Step Pyramid for Pharaoh Djoser, the world's first large-scale stone structure. This revolutionary six-tiered monument at Saqqara launched the age of pyramid building and established Imhotep as history's first named architect.",
    },
    {
        "slug": "first-intermediate-period-egypt",
        "title": "First Intermediate Period — Egypt Fragments",
        "year": -2181, "is_bce": True,
        "lat": 26.56, "lng": 31.69,
        "geo_modern": "Egypt", "geo_era_label": "First Intermediate Period",
        "category": "political", "importance": 0.62, "zoom_min": 5,
        "tags": ["egypt", "collapse", "fragmentation"],
        "description": "Following the decline of the Old Kingdom, Egypt splintered into competing regional powers. A prolonged drought and the weakening of central authority led to roughly 125 years of political instability before reunification under Mentuhotep II.",
    },
    {
        "slug": "mentuhotep-ii-reunifies-egypt",
        "title": "Mentuhotep II Reunifies Egypt — Middle Kingdom Begins",
        "year": -2055, "is_bce": True,
        "lat": 25.7275, "lng": 32.6014,
        "geo_modern": "Thebes, Egypt", "geo_era_label": "Middle Kingdom Egypt",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["egypt", "middle-kingdom", "reunification"],
        "description": "Mentuhotep II of Thebes defeated the Heracleopolitan dynasty to reunify Egypt, inaugurating the Middle Kingdom. This era brought a cultural renaissance in literature, art, and monumental building centered on the new capital of Thebes.",
    },
    {
        "slug": "thutmose-iii-battle-of-megiddo",
        "title": "Battle of Megiddo — Thutmose III's Greatest Victory",
        "year": -1457, "is_bce": True,
        "lat": 32.5847, "lng": 35.1847,
        "geo_modern": "Megiddo, Israel", "geo_era_label": "New Kingdom Egypt",
        "category": "war", "importance": 0.75, "zoom_min": 4,
        "tags": ["egypt", "war", "thutmose-iii", "megiddo"],
        "description": "Thutmose III led the Egyptian army through the narrow Aruna Pass to surprise a Canaanite coalition at Megiddo. This first battle recorded in detail established Egypt's empire in the Levant and cemented Thutmose III's reputation as Egypt's greatest warrior pharaoh.",
    },
    {
        "slug": "egyptian-book-of-the-dead",
        "title": "Egyptian Book of the Dead — Guide to the Afterlife",
        "year": -1550, "is_bce": True,
        "lat": 25.7275, "lng": 32.6014,
        "geo_modern": "Thebes, Egypt", "geo_era_label": "New Kingdom Egypt",
        "category": "cultural", "importance": 0.73, "zoom_min": 4,
        "tags": ["egypt", "religion", "afterlife", "literature"],
        "description": "The Book of the Dead was a collection of funerary spells placed in tombs to guide the deceased through the underworld. These illustrated papyrus scrolls described the judgment before Osiris and provided the magical knowledge needed to achieve eternal life.",
    },
    {
        "slug": "cleopatra-caesar-alliance",
        "title": "Cleopatra Allies with Julius Caesar",
        "year": -48, "is_bce": True,
        "lat": 31.2001, "lng": 29.9187,
        "geo_modern": "Alexandria, Egypt", "geo_era_label": "Ptolemaic Egypt",
        "category": "political", "importance": 0.78, "zoom_min": 4,
        "tags": ["egypt", "rome", "cleopatra", "caesar"],
        "description": "Cleopatra VII secured her throne by allying with Julius Caesar during the Alexandrine War. Their political and romantic partnership produced a son, Caesarion, and temporarily restored Egypt's influence in Mediterranean affairs.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # INDUS VALLEY
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "indus-valley-peak-mature-harappan",
        "title": "Mature Harappan Period — Indus Civilization at Its Peak",
        "year": -2600, "is_bce": True,
        "lat": 27.3244, "lng": 68.1378,
        "geo_modern": "Sindh, Pakistan", "geo_era_label": "Indus Valley Civilization",
        "category": "cultural", "importance": 0.80, "zoom_min": 3,
        "tags": ["indus-valley", "harappa", "urbanization"],
        "description": "The Mature Harappan period saw the Indus Valley Civilization reach its zenith, with over 1,000 settlements across modern Pakistan and northwest India. Cities featured standardized brick sizes, advanced drainage systems, and remarkably egalitarian urban planning.",
    },
    {
        "slug": "lothal-dockyard-indus-trade",
        "title": "Lothal Dockyard — Oldest Known Dock in the World",
        "year": -2400, "is_bce": True,
        "lat": 22.5214, "lng": 72.2494,
        "geo_modern": "Gujarat, India", "geo_era_label": "Indus Valley Civilization",
        "category": "cultural", "importance": 0.68, "zoom_min": 5,
        "tags": ["indus-valley", "maritime", "trade"],
        "description": "Lothal housed the world's earliest known dock, connecting the Harappan civilization to maritime trade networks reaching Mesopotamia. Archaeological evidence reveals sophisticated bead-making workshops and a tidal dock engineered to handle the Gulf of Khambhat's extreme tides.",
    },
    {
        "slug": "indus-valley-decline",
        "title": "Decline of the Indus Valley Civilization",
        "year": -1900, "is_bce": True,
        "lat": 27.3244, "lng": 68.1378,
        "geo_modern": "Pakistan/India", "geo_era_label": "Late Harappan",
        "category": "natural", "importance": 0.72, "zoom_min": 4,
        "tags": ["indus-valley", "collapse", "climate"],
        "description": "The Indus Valley Civilization gradually declined as the Ghaggar-Hakra river system dried up due to tectonic shifts and climate change. Cities were abandoned, populations dispersed eastward, and the sophisticated urban culture fragmented into smaller rural settlements.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT CHINA
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "erlitou-xia-dynasty-debate",
        "title": "Erlitou Culture — Possible Xia Dynasty Capital",
        "year": -1900, "is_bce": True,
        "lat": 34.7, "lng": 112.7,
        "geo_modern": "Henan, China", "geo_era_label": "Early Bronze Age China",
        "category": "cultural", "importance": 0.68, "zoom_min": 5,
        "tags": ["china", "xia-dynasty", "bronze-age", "archaeology"],
        "description": "The Erlitou site in Henan province may represent the legendary Xia Dynasty, China's first dynasty according to tradition. Excavations revealed palatial complexes, bronze workshops, and jade artifacts, marking the transition from Neolithic to Bronze Age China.",
    },
    {
        "slug": "warring-states-period-china",
        "title": "Warring States Period — China's Age of Turmoil and Philosophy",
        "year": -475, "is_bce": True,
        "lat": 34.75, "lng": 113.65,
        "geo_modern": "China", "geo_era_label": "Warring States China",
        "category": "war", "importance": 0.80, "zoom_min": 3,
        "tags": ["china", "warring-states", "philosophy"],
        "description": "Seven major states competed for supremacy in a 250-year struggle that reshaped China. Despite the devastation, this period produced extraordinary intellectual ferment — the Hundred Schools of Thought including Confucianism, Daoism, Legalism, and Mohism.",
    },
    {
        "slug": "laozi-daoism-founded",
        "title": "Laozi and the Dao De Jing — Daoism Founded",
        "year": -500, "is_bce": True,
        "lat": 33.87, "lng": 115.77,
        "geo_modern": "Henan, China", "geo_era_label": "Zhou Dynasty China",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["china", "daoism", "philosophy", "religion"],
        "description": "The Dao De Jing, attributed to the sage Laozi, laid the foundation for Daoism with its philosophy of living in harmony with the Dao (the Way). Its teachings on simplicity, spontaneity, and non-action profoundly shaped Chinese culture, religion, and governance.",
    },
    {
        "slug": "sun-tzu-art-of-war",
        "title": "Sun Tzu's Art of War — Classic of Military Strategy",
        "year": -500, "is_bce": True,
        "lat": 32.06, "lng": 118.78,
        "geo_modern": "Wu Kingdom, China", "geo_era_label": "Spring and Autumn China",
        "category": "cultural", "importance": 0.78, "zoom_min": 4,
        "tags": ["china", "military", "strategy", "philosophy"],
        "description": "Sun Tzu composed The Art of War, the most influential military treatise ever written. Its emphasis on deception, intelligence, and winning without fighting has influenced military leaders from Napoleon to modern business strategists worldwide.",
    },
    {
        "slug": "terracotta-army-qin",
        "title": "Terracotta Army — Qin Shi Huang's Buried Warriors",
        "year": -210, "is_bce": True,
        "lat": 34.3848, "lng": 109.2734,
        "geo_modern": "Xi'an, China", "geo_era_label": "Qin Dynasty",
        "category": "cultural", "importance": 0.85, "zoom_min": 3,
        "tags": ["china", "qin-dynasty", "archaeology", "art"],
        "description": "Qin Shi Huang was buried with an army of over 8,000 life-sized terracotta warriors, each with unique facial features. This astonishing necropolis, discovered by farmers in 1974, was designed to protect the emperor in the afterlife and demonstrates Qin Dynasty craftsmanship.",
    },
    {
        "slug": "invention-of-paper-han",
        "title": "Invention of Paper — Cai Lun's Revolutionary Medium",
        "year": 105, "is_bce": False,
        "lat": 34.26, "lng": 108.94,
        "geo_modern": "Luoyang, China", "geo_era_label": "Han Dynasty China",
        "category": "discovery", "importance": 0.88, "zoom_min": 2,
        "tags": ["china", "invention", "paper", "technology"],
        "description": "Court eunuch Cai Lun refined the papermaking process using bark, hemp, and rags, creating a lightweight, inexpensive writing material. Paper gradually replaced bamboo strips and silk, revolutionizing record-keeping and eventually transforming civilizations worldwide.",
    },
    {
        "slug": "ban-zhao-lessons-for-women",
        "title": "Ban Zhao — China's First Female Historian",
        "year": 80, "is_bce": False,
        "lat": 34.26, "lng": 108.94,
        "geo_modern": "Luoyang, China", "geo_era_label": "Han Dynasty China",
        "category": "person", "importance": 0.65, "zoom_min": 5,
        "tags": ["china", "women", "history", "literature"],
        "description": "Ban Zhao completed the Book of Han begun by her father and brother, becoming China's most celebrated female scholar. She also tutored the empress and court women, establishing herself as an influential intellectual in the male-dominated Han court.",
    },
    {
        "slug": "three-kingdoms-period-china",
        "title": "Three Kingdoms Period — China's Most Romanticized Era",
        "year": 220, "is_bce": False,
        "lat": 34.75, "lng": 113.65,
        "geo_modern": "China", "geo_era_label": "Three Kingdoms China",
        "category": "war", "importance": 0.73, "zoom_min": 4,
        "tags": ["china", "three-kingdoms", "war"],
        "description": "After the Han Dynasty collapsed, China split into three rival kingdoms: Wei, Shu, and Wu. This era of dramatic warfare and political intrigue was later immortalized in the Romance of the Three Kingdoms, one of China's Four Great Classical Novels.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT GREECE
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "first-olympic-games",
        "title": "First Olympic Games at Olympia",
        "year": -776, "is_bce": True,
        "lat": 37.6388, "lng": 21.6299,
        "geo_modern": "Olympia, Greece", "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["greece", "olympics", "athletics", "culture"],
        "description": "The first recorded Olympic Games were held at the sanctuary of Zeus in Olympia. Initially consisting of a single footrace, the Games grew into a pan-Hellenic festival that united Greek city-states every four years and served as a marker for the Greek calendar system.",
    },
    {
        "slug": "homer-iliad-odyssey-composed",
        "title": "Homer Composes the Iliad and Odyssey",
        "year": -750, "is_bce": True,
        "lat": 38.37, "lng": 26.14,
        "geo_modern": "Ionia, Turkey", "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance": 0.90, "zoom_min": 2,
        "tags": ["greece", "literature", "homer", "epic-poetry"],
        "description": "Homer's Iliad and Odyssey, composed orally and later written down, became the foundational works of Western literature. These epic poems about the Trojan War and Odysseus' journey home shaped Greek education, religion, and cultural identity for centuries.",
    },
    {
        "slug": "greek-colonization-mediterranean",
        "title": "Greek Colonization Across the Mediterranean",
        "year": -750, "is_bce": True,
        "lat": 37.97, "lng": 23.72,
        "geo_modern": "Mediterranean Basin", "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance": 0.75, "zoom_min": 3,
        "tags": ["greece", "colonization", "trade", "expansion"],
        "description": "Greek city-states founded colonies from the Black Sea to Spain, spreading Hellenic culture across the Mediterranean. Major colonies like Syracuse, Massalia (Marseille), and Byzantium became prosperous cities that rivaled their mother poleis.",
    },
    {
        "slug": "pythagoras-mathematics-philosophy",
        "title": "Pythagoras Establishes His School at Croton",
        "year": -530, "is_bce": True,
        "lat": 39.0811, "lng": 17.1272,
        "geo_modern": "Crotone, Italy", "geo_era_label": "Magna Graecia",
        "category": "discovery", "importance": 0.77, "zoom_min": 4,
        "tags": ["greece", "mathematics", "philosophy", "pythagoras"],
        "description": "Pythagoras founded a philosophical and mathematical school at Croton in southern Italy. His followers discovered the mathematical ratios underlying musical harmony and developed the famous theorem, establishing the principle that the universe could be understood through numbers.",
    },
    {
        "slug": "pericles-golden-age-athens",
        "title": "Pericles and the Golden Age of Athens",
        "year": -461, "is_bce": True,
        "lat": 37.9715, "lng": 23.7257,
        "geo_modern": "Athens, Greece", "geo_era_label": "Classical Greece",
        "category": "political", "importance": 0.85, "zoom_min": 3,
        "tags": ["greece", "athens", "democracy", "pericles"],
        "description": "Under Pericles' leadership, Athens entered its Golden Age of democracy, philosophy, and art. He expanded democratic participation, funded the reconstruction of the Acropolis, and presided over a cultural flowering that produced Aeschylus, Sophocles, and Phidias.",
    },
    {
        "slug": "parthenon-construction-athens",
        "title": "Parthenon Built on the Athenian Acropolis",
        "year": -447, "is_bce": True,
        "lat": 37.9715, "lng": 23.7266,
        "geo_modern": "Athens, Greece", "geo_era_label": "Classical Greece",
        "category": "cultural", "importance": 0.87, "zoom_min": 3,
        "tags": ["greece", "architecture", "parthenon", "athena"],
        "description": "Architects Ictinus and Callicrates built the Parthenon as a temple to Athena Parthenos, funded by the Delian League treasury. Its refined Doric columns incorporate subtle optical corrections, and Phidias' gold-and-ivory statue of Athena was among antiquity's greatest artworks.",
    },
    {
        "slug": "herodotus-histories",
        "title": "Herodotus Writes the Histories — Father of History",
        "year": -440, "is_bce": True,
        "lat": 37.038, "lng": 27.424,
        "geo_modern": "Halicarnassus, Turkey", "geo_era_label": "Classical Greece",
        "category": "cultural", "importance": 0.78, "zoom_min": 4,
        "tags": ["greece", "history", "herodotus", "literature"],
        "description": "Herodotus composed the Histories, a sweeping account of the Greco-Persian Wars set within a broader ethnographic survey of the known world. Cicero later called him the 'Father of History' for his systematic approach to investigating and recording past events.",
    },
    {
        "slug": "aristotle-lyceum-founded",
        "title": "Aristotle Founds the Lyceum in Athens",
        "year": -335, "is_bce": True,
        "lat": 37.975, "lng": 23.74,
        "geo_modern": "Athens, Greece", "geo_era_label": "Classical Greece",
        "category": "cultural", "importance": 0.85, "zoom_min": 3,
        "tags": ["greece", "philosophy", "aristotle", "science"],
        "description": "Aristotle established the Lyceum after returning from tutoring Alexander the Great. His school pioneered systematic empirical research in biology, logic, politics, and ethics, producing works that dominated Western and Islamic intellectual life for nearly two millennia.",
    },
    {
        "slug": "alexander-founds-alexandria",
        "title": "Alexander the Great Founds Alexandria",
        "year": -331, "is_bce": True,
        "lat": 31.2001, "lng": 29.9187,
        "geo_modern": "Alexandria, Egypt", "geo_era_label": "Hellenistic Period",
        "category": "political", "importance": 0.80, "zoom_min": 3,
        "tags": ["alexander", "hellenistic", "egypt", "city-founding"],
        "description": "Alexander founded Alexandria at the western edge of the Nile Delta, envisioning it as a center of Greek culture in Egypt. The city became the intellectual capital of the Hellenistic world, home to the Great Library and the Pharos Lighthouse.",
    },
    {
        "slug": "hellenistic-kingdoms-established",
        "title": "Wars of the Diadochi — Hellenistic Kingdoms Carved Out",
        "year": -310, "is_bce": True,
        "lat": 40.63, "lng": 22.94,
        "geo_modern": "Macedon, Greece", "geo_era_label": "Hellenistic Period",
        "category": "war", "importance": 0.72, "zoom_min": 4,
        "tags": ["hellenistic", "diadochi", "successor-wars"],
        "description": "Alexander's generals fought for decades over his empire, eventually carving it into major successor kingdoms: Ptolemaic Egypt, Seleucid Asia, and Antigonid Macedon. These Hellenistic kingdoms spread Greek culture from the Mediterranean to Central Asia.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # CLASSICAL INDIA
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "vedic-period-rig-veda",
        "title": "Rig Veda Composed — Foundation of Hindu Tradition",
        "year": -1500, "is_bce": True,
        "lat": 30.73, "lng": 76.78,
        "geo_modern": "Punjab, India/Pakistan", "geo_era_label": "Vedic Period",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["india", "vedas", "hinduism", "religion"],
        "description": "The Rig Veda, the oldest of the Hindu sacred texts, was composed orally by Indo-Aryan priests in the Punjab region. Its 1,028 hymns to the gods established the religious and philosophical foundations that would evolve into Hinduism over the following millennia.",
    },
    {
        "slug": "upanishads-composed",
        "title": "Upanishads Composed — Dawn of Indian Philosophy",
        "year": -800, "is_bce": True,
        "lat": 26.85, "lng": 80.91,
        "geo_modern": "Northern India", "geo_era_label": "Late Vedic Period",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["india", "upanishads", "philosophy", "hinduism"],
        "description": "The Upanishads introduced revolutionary philosophical concepts including Brahman (universal soul), Atman (individual soul), karma, and moksha. These texts moved Indian religion from ritual sacrifice toward philosophical inquiry, influencing Buddhism, Jainism, and later global thought.",
    },
    {
        "slug": "panini-sanskrit-grammar",
        "title": "Panini's Ashtadhyayi — World's First Formal Grammar",
        "year": -400, "is_bce": True,
        "lat": 34.17, "lng": 71.7,
        "geo_modern": "Gandhara, Pakistan", "geo_era_label": "Classical India",
        "category": "discovery", "importance": 0.72, "zoom_min": 4,
        "tags": ["india", "linguistics", "sanskrit", "panini"],
        "description": "Panini composed the Ashtadhyayi, a comprehensive grammar of Sanskrit in roughly 4,000 rules. His rigorous, rule-based approach anticipated modern formal linguistics by over two millennia and is considered one of the greatest intellectual achievements of the ancient world.",
    },
    {
        "slug": "gupta-empire-founded",
        "title": "Gupta Empire Founded — India's Classical Golden Age Begins",
        "year": -320, "is_bce": True,
        "lat": 25.61, "lng": 85.14,
        "geo_modern": "Pataliputra, India", "geo_era_label": "Gupta Empire",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["india", "gupta", "empire"],
        "description": "Sri Gupta founded the Gupta dynasty in the Magadha region, beginning what would become India's Classical Golden Age. Under later rulers Chandragupta I and Samudragupta, the empire expanded to dominate most of the Indian subcontinent.",
    },
    {
        "slug": "kalidasa-shakuntala",
        "title": "Kalidasa Writes Shakuntala — Pinnacle of Sanskrit Literature",
        "year": 400, "is_bce": False,
        "lat": 23.25, "lng": 77.41,
        "geo_modern": "Ujjain, India", "geo_era_label": "Gupta Empire",
        "category": "cultural", "importance": 0.70, "zoom_min": 5,
        "tags": ["india", "literature", "kalidasa", "sanskrit"],
        "description": "Kalidasa, writing during the Gupta period, composed Abhijnanasakuntalam (The Recognition of Shakuntala), widely regarded as the masterpiece of Sanskrit drama. Goethe later praised it as one of the greatest works of world literature.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ROME
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "legendary-founding-of-rome",
        "title": "Traditional Founding of Rome by Romulus",
        "year": -753, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Kingdom",
        "category": "political", "importance": 0.82, "zoom_min": 3,
        "tags": ["rome", "founding", "romulus", "mythology"],
        "description": "According to Roman tradition, Romulus founded Rome on the Palatine Hill after killing his twin brother Remus. While archaeological evidence shows settlement from at least the 10th century BCE, the legendary 753 BCE date became central to Roman identity.",
    },
    {
        "slug": "samnite-wars-roman-expansion",
        "title": "Samnite Wars — Rome Conquers Central Italy",
        "year": -343, "is_bce": True,
        "lat": 41.12, "lng": 14.78,
        "geo_modern": "Campania, Italy", "geo_era_label": "Roman Republic",
        "category": "war", "importance": 0.68, "zoom_min": 5,
        "tags": ["rome", "samnites", "war", "expansion"],
        "description": "Three wars against the Samnite confederation (343–290 BCE) established Roman dominance over the Italian peninsula. Rome's military road-building, colony-planting, and alliance system during these wars created the template for future imperial expansion.",
    },
    {
        "slug": "pyrrhic-war-rome-pyrrhus",
        "title": "Pyrrhic War — Rome Defeats King Pyrrhus of Epirus",
        "year": -280, "is_bce": True,
        "lat": 40.35, "lng": 18.17,
        "geo_modern": "Taranto, Italy", "geo_era_label": "Roman Republic",
        "category": "war", "importance": 0.70, "zoom_min": 4,
        "tags": ["rome", "pyrrhus", "war", "hellenistic"],
        "description": "King Pyrrhus of Epirus won battles against Rome at such terrible cost that his name gave rise to the term 'Pyrrhic victory.' Rome's resilience in defeat — refusing peace terms and raising new armies — demonstrated the Republic's formidable staying power.",
    },
    {
        "slug": "marius-military-reforms",
        "title": "Marius' Military Reforms — Professionalization of the Roman Army",
        "year": -107, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance": 0.78, "zoom_min": 4,
        "tags": ["rome", "military", "marius", "reform"],
        "description": "Gaius Marius opened the Roman legions to landless citizens and standardized equipment, creating a professional standing army. While militarily transformative, these reforms tied soldiers' loyalty to their commanders rather than the state, sowing the seeds of the Republic's downfall.",
    },
    {
        "slug": "cicero-catiline-conspiracy",
        "title": "Cicero Exposes the Catiline Conspiracy",
        "year": -63, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "cicero", "conspiracy", "republic"],
        "description": "Consul Cicero uncovered and defeated a plot by the senator Catiline to overthrow the Roman Republic. His four Catilinarian Orations became masterpieces of Latin rhetoric and established Cicero as the Republic's greatest orator and defender.",
    },
    {
        "slug": "virgil-aeneid-composed",
        "title": "Virgil Composes the Aeneid — Rome's National Epic",
        "year": -19, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Empire",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["rome", "literature", "virgil", "aeneid"],
        "description": "Virgil spent the last decade of his life composing the Aeneid, an epic poem tracing Rome's mythical origins to the Trojan hero Aeneas. The work became the Roman national epic, rivaling Homer in prestige and profoundly shaping Western literary tradition.",
    },
    {
        "slug": "crucifixion-of-jesus",
        "title": "Crucifixion of Jesus of Nazareth",
        "year": 30, "is_bce": False,
        "lat": 31.7785, "lng": 35.2346,
        "geo_modern": "Jerusalem, Israel", "geo_era_label": "Roman Judea",
        "category": "cultural", "importance": 0.95, "zoom_min": 1,
        "tags": ["christianity", "jesus", "religion", "rome"],
        "description": "Jesus of Nazareth was crucified under Pontius Pilate in Jerusalem. His followers proclaimed his resurrection, founding a movement that grew from a small Jewish sect into the world's largest religion, fundamentally reshaping Western civilization and global history.",
    },
    {
        "slug": "nero-great-fire-of-rome",
        "title": "Great Fire of Rome Under Nero",
        "year": 64, "is_bce": False,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Empire",
        "category": "natural", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "nero", "fire", "disaster"],
        "description": "A devastating fire destroyed much of Rome over six days. Emperor Nero used the cleared land to build his lavish Domus Aurea palace. He blamed Christians for the fire, initiating the first Roman persecution of the new religion.",
    },
    {
        "slug": "roman-roads-appian-way",
        "title": "Roman Road Network — The Appian Way and Beyond",
        "year": -312, "is_bce": True,
        "lat": 41.8402, "lng": 12.5201,
        "geo_modern": "Rome to Brindisi, Italy", "geo_era_label": "Roman Republic",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["rome", "infrastructure", "roads", "engineering"],
        "description": "The Via Appia, begun in 312 BCE, was the first of Rome's great highways connecting the capital to southern Italy. Eventually 80,000 km of paved roads spanned the empire, enabling rapid troop movements, trade, and communication that bound the Roman world together.",
    },
    {
        "slug": "marcus-aurelius-meditations",
        "title": "Marcus Aurelius Writes the Meditations",
        "year": 170, "is_bce": False,
        "lat": 48.20, "lng": 16.37,
        "geo_modern": "Carnuntum, Austria", "geo_era_label": "Roman Empire",
        "category": "cultural", "importance": 0.75, "zoom_min": 4,
        "tags": ["rome", "philosophy", "stoicism", "marcus-aurelius"],
        "description": "Emperor Marcus Aurelius composed his philosophical journal, the Meditations, while campaigning on the Danube frontier. Written in Greek, these Stoic reflections on duty, mortality, and virtue became one of the most influential works of philosophy ever written.",
    },
    {
        "slug": "crisis-of-third-century-rome",
        "title": "Crisis of the Third Century — Roman Empire Nearly Collapses",
        "year": 235, "is_bce": False,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Roman Empire", "geo_era_label": "Roman Empire",
        "category": "political", "importance": 0.73, "zoom_min": 4,
        "tags": ["rome", "crisis", "civil-war", "decline"],
        "description": "The Roman Empire plunged into 50 years of military anarchy, with over 25 emperors in rapid succession. Plague, economic collapse, and invasions on every frontier nearly destroyed the empire before Diocletian's reforms restored order in 284 CE.",
    },
    {
        "slug": "diocletian-reforms-tetrarchy",
        "title": "Diocletian's Reforms — Tetrarchy and Administrative Revolution",
        "year": 284, "is_bce": False,
        "lat": 43.5074, "lng": 16.4399,
        "geo_modern": "Split, Croatia", "geo_era_label": "Late Roman Empire",
        "category": "political", "importance": 0.75, "zoom_min": 4,
        "tags": ["rome", "diocletian", "reform", "tetrarchy"],
        "description": "Emperor Diocletian ended the Crisis of the Third Century by dividing the empire among four co-rulers (Tetrarchy) and reorganizing its provinces and military. His administrative and economic reforms prolonged the empire's existence but also laid the groundwork for its eventual split.",
    },
    {
        "slug": "theodosius-christianity-state-religion",
        "title": "Theodosius Makes Christianity the State Religion of Rome",
        "year": 380, "is_bce": False,
        "lat": 41.0082, "lng": 28.9784,
        "geo_modern": "Thessalonica, Greece", "geo_era_label": "Late Roman Empire",
        "category": "political", "importance": 0.82, "zoom_min": 3,
        "tags": ["rome", "christianity", "religion", "theodosius"],
        "description": "Emperor Theodosius I issued the Edict of Thessalonica, making Nicene Christianity the official state religion and banning pagan worship. This completed Christianity's transformation from persecuted sect to imperial faith, reshaping European civilization for the next millennium and beyond.",
    },
    {
        "slug": "division-of-roman-empire",
        "title": "Permanent Division of the Roman Empire — East and West",
        "year": 395, "is_bce": False,
        "lat": 41.0082, "lng": 28.9784,
        "geo_modern": "Constantinople/Rome", "geo_era_label": "Late Roman Empire",
        "category": "political", "importance": 0.80, "zoom_min": 3,
        "tags": ["rome", "division", "byzantine", "western-roman"],
        "description": "Upon Theodosius I's death, the Roman Empire was permanently divided between his sons: Arcadius in the East and Honorius in the West. The Western Empire would fall within 80 years, while the Eastern (Byzantine) Empire endured for another millennium.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAS
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "caral-supe-civilization-americas",
        "title": "Caral-Supe — Oldest Civilization in the Americas",
        "year": -3000, "is_bce": True,
        "lat": -10.8922, "lng": -77.5203,
        "geo_modern": "Supe Valley, Peru", "geo_era_label": "Norte Chico",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["americas", "peru", "caral", "urbanization"],
        "description": "Caral, in Peru's Supe Valley, is the oldest urban center in the Americas, contemporary with Egyptian pyramids. Its monumental platform mounds, sunken circular plazas, and complex society developed without ceramics, writing, or evidence of warfare.",
    },
    {
        "slug": "zapotec-writing-monte-alban",
        "title": "Zapotec Writing at Monte Albán — Mesoamerican Script",
        "year": -500, "is_bce": True,
        "lat": 17.044, "lng": -96.768,
        "geo_modern": "Oaxaca, Mexico", "geo_era_label": "Zapotec Civilization",
        "category": "cultural", "importance": 0.68, "zoom_min": 5,
        "tags": ["americas", "zapotec", "writing", "mesoamerica"],
        "description": "The Zapotec civilization developed one of the earliest writing systems in Mesoamerica at their capital Monte Albán. The Danzantes monuments depict conquered rulers with hieroglyphic name glyphs, representing some of the oldest dated inscriptions in the New World.",
    },
    {
        "slug": "maya-classical-period-begins",
        "title": "Maya Classical Period Begins — Rise of City-States",
        "year": 250, "is_bce": False,
        "lat": 17.222, "lng": -89.624,
        "geo_modern": "Guatemala/Mexico", "geo_era_label": "Classical Maya",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["americas", "maya", "city-states", "writing"],
        "description": "The Maya Classical Period saw the flourishing of great city-states like Tikal, Calakmul, and Palenque. The Maya developed sophisticated mathematics, astronomy, a fully phonetic writing system, and the Long Count calendar tracking time over thousands of years.",
    },
    {
        "slug": "nazca-lines-peru",
        "title": "Nazca Lines — Giant Geoglyphs in the Peruvian Desert",
        "year": -100, "is_bce": True,
        "lat": -14.739, "lng": -75.130,
        "geo_modern": "Nazca, Peru", "geo_era_label": "Nazca Culture",
        "category": "cultural", "importance": 0.72, "zoom_min": 4,
        "tags": ["americas", "peru", "nazca", "art", "geoglyphs"],
        "description": "The Nazca people created enormous geoglyphs in the Peruvian desert, depicting animals, plants, and geometric shapes visible only from above. These lines, preserved by the arid climate for over 2,000 years, likely served ritual purposes related to water and fertility.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # PHOENICIA / TRADE / CONNECTIVITY
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "tyre-sidon-phoenician-city-states",
        "title": "Tyre and Sidon — Phoenician Maritime City-States Rise",
        "year": -1200, "is_bce": True,
        "lat": 33.2705, "lng": 35.1956,
        "geo_modern": "Tyre, Lebanon", "geo_era_label": "Phoenician Civilization",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["phoenicia", "trade", "maritime", "lebanon"],
        "description": "After the Bronze Age Collapse, Phoenician city-states Tyre and Sidon emerged as the Mediterranean's dominant traders. They developed the alphabet, produced prized Tyrian purple dye, and established trading posts from Cyprus to the Atlantic coast of Africa.",
    },
    {
        "slug": "silk-road-trade-network-peaks",
        "title": "Silk Road Trade Network Reaches Full Maturity",
        "year": -100, "is_bce": True,
        "lat": 40.08, "lng": 65.38,
        "geo_modern": "Central Asia", "geo_era_label": "Silk Road",
        "category": "cultural", "importance": 0.80, "zoom_min": 2,
        "tags": ["silk-road", "trade", "connectivity", "central-asia"],
        "description": "By the 1st century BCE, the Silk Road connected the Han Chinese and Roman empires through a network of overland routes spanning 6,500 km. Along with silk, spices, and precious metals, the routes transmitted religions, technologies, and diseases between civilizations.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # AFRICA (beyond Egypt)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "kingdom-of-kush-nubia",
        "title": "Kingdom of Kush — Nubian Power Rivals Egypt",
        "year": -1070, "is_bce": True,
        "lat": 18.5494, "lng": 31.8250,
        "geo_modern": "Napata, Sudan", "geo_era_label": "Kingdom of Kush",
        "category": "political", "importance": 0.70, "zoom_min": 4,
        "tags": ["africa", "kush", "nubia", "sudan"],
        "description": "The Kingdom of Kush emerged as a major power in Nubia after Egypt's New Kingdom declined. Kush eventually conquered Egypt itself, with Kushite pharaohs ruling as Egypt's 25th Dynasty before being pushed south by the Assyrians.",
    },
    {
        "slug": "kushite-25th-dynasty-egypt",
        "title": "Kushite Pharaohs Rule Egypt — The 25th Dynasty",
        "year": -747, "is_bce": True,
        "lat": 15.9352, "lng": 32.5418,
        "geo_modern": "Napata, Sudan/Egypt", "geo_era_label": "Kushite Egypt",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["kush", "egypt", "nubia", "pharaohs"],
        "description": "King Piye of Kush conquered Egypt, establishing the 25th Dynasty of Nubian pharaohs. The Kushite rulers revived traditional Egyptian temple building and culture before the Assyrian invasion drove them back to Nubia around 656 BCE.",
    },
    {
        "slug": "nok-culture-west-africa",
        "title": "Nok Culture — West Africa's Earliest Known Civilization",
        "year": -500, "is_bce": True,
        "lat": 9.67, "lng": 8.0,
        "geo_modern": "Nigeria", "geo_era_label": "Nok Culture",
        "category": "cultural", "importance": 0.68, "zoom_min": 5,
        "tags": ["africa", "nok", "nigeria", "ironworking", "terracotta"],
        "description": "The Nok culture of central Nigeria produced remarkable terracotta sculptures and was among the earliest iron-smelting societies in sub-Saharan Africa. Their sophisticated art style influenced later West African artistic traditions including Ife and Benin bronzes.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL EVENTS — FILLING GAPS
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "mycenaean-civilization-peak",
        "title": "Mycenaean Civilization — Bronze Age Greece at Its Height",
        "year": -1400, "is_bce": True,
        "lat": 37.7308, "lng": 22.7563,
        "geo_modern": "Mycenae, Greece", "geo_era_label": "Mycenaean Greece",
        "category": "cultural", "importance": 0.76, "zoom_min": 3,
        "tags": ["greece", "mycenae", "bronze-age", "linear-b"],
        "description": "The Mycenaean civilization dominated Greece with fortified palace centers at Mycenae, Tiryns, and Pylos. They adapted Minoan Linear A into Linear B for administrative records, engaged in long-distance trade, and inspired Homer's tales of the Trojan War.",
    },
    {
        "slug": "greek-dark-ages-end",
        "title": "End of the Greek Dark Ages — Polis System Emerges",
        "year": -800, "is_bce": True,
        "lat": 37.97, "lng": 23.72,
        "geo_modern": "Greece", "geo_era_label": "Archaic Greece",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["greece", "polis", "city-state", "archaic"],
        "description": "After centuries of decline following the Bronze Age Collapse, Greece emerged from its Dark Ages. Population growth, the adoption of the Phoenician alphabet, and renewed trade fostered the development of the polis (city-state), the defining institution of Greek civilization.",
    },
    {
        "slug": "sparta-lycurgus-reforms",
        "title": "Spartan Reforms of Lycurgus — Warrior State Created",
        "year": -700, "is_bce": True,
        "lat": 37.0755, "lng": 22.4303,
        "geo_modern": "Sparta, Greece", "geo_era_label": "Archaic Greece",
        "category": "political", "importance": 0.73, "zoom_min": 4,
        "tags": ["greece", "sparta", "military", "reform"],
        "description": "The legendary lawgiver Lycurgus transformed Sparta into a militaristic society with communal dining, rigorous youth training (agoge), and shared land. This unique social system produced Greece's most feared warriors but also a deeply conservative and insular culture.",
    },
    {
        "slug": "sappho-poetry-lesbos",
        "title": "Sappho of Lesbos — Greatest Lyric Poet of Antiquity",
        "year": -600, "is_bce": True,
        "lat": 39.11, "lng": 26.55,
        "geo_modern": "Lesbos, Greece", "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance": 0.72, "zoom_min": 4,
        "tags": ["greece", "poetry", "sappho", "literature", "women"],
        "description": "Sappho composed lyric poetry of extraordinary emotional intensity on the island of Lesbos. Plato called her the 'Tenth Muse,' and her surviving fragments — especially on love, beauty, and desire — remain among the finest poetry from the ancient world.",
    },
    {
        "slug": "persian-empire-darius-behistun",
        "title": "Behistun Inscription — Darius I's Monumental Proclamation",
        "year": -520, "is_bce": True,
        "lat": 34.3907, "lng": 47.4371,
        "geo_modern": "Kermanshah, Iran", "geo_era_label": "Achaemenid Persia",
        "category": "political", "importance": 0.70, "zoom_min": 4,
        "tags": ["persia", "inscription", "darius", "languages"],
        "description": "Darius I carved a massive trilingual inscription on a cliff at Behistun, recording his rise to power in Old Persian, Elamite, and Babylonian. This inscription later served as the key to deciphering cuneiform, much as the Rosetta Stone unlocked Egyptian hieroglyphs.",
    },
    {
        "slug": "battle-of-plataea-persian-defeat",
        "title": "Battle of Plataea — Final Defeat of Persian Invasion",
        "year": -479, "is_bce": True,
        "lat": 38.2127, "lng": 23.2688,
        "geo_modern": "Plataea, Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance": 0.80, "zoom_min": 3,
        "tags": ["persian-wars", "greece", "persia", "battle"],
        "description": "The Greek coalition army decisively defeated Xerxes' remaining forces at Plataea, ending the second Persian invasion of Greece. Combined with the simultaneous naval victory at Mycale, this battle secured Greek independence and ushered in the Classical Age.",
    },
    {
        "slug": "delian-league-athenian-empire",
        "title": "Delian League Founded — Athens' Path to Empire",
        "year": -478, "is_bce": True,
        "lat": 37.4, "lng": 25.27,
        "geo_modern": "Delos, Greece", "geo_era_label": "Classical Greece",
        "category": "political", "importance": 0.73, "zoom_min": 4,
        "tags": ["greece", "athens", "delian-league", "empire"],
        "description": "Greek city-states formed the Delian League under Athenian leadership to continue fighting Persia. Athens gradually transformed this defensive alliance into an empire, using allied tribute to fund the Parthenon and other monuments of the Golden Age.",
    },
    {
        "slug": "hippocrates-medicine",
        "title": "Hippocrates — Father of Western Medicine",
        "year": -420, "is_bce": True,
        "lat": 36.85, "lng": 27.05,
        "geo_modern": "Kos, Greece", "geo_era_label": "Classical Greece",
        "category": "discovery", "importance": 0.78, "zoom_min": 4,
        "tags": ["greece", "medicine", "hippocrates", "science"],
        "description": "Hippocrates of Kos revolutionized medicine by rejecting supernatural explanations of disease in favor of natural causes and clinical observation. The Hippocratic Corpus established ethical principles still invoked in the Hippocratic Oath taken by physicians today.",
    },
    {
        "slug": "philip-ii-battle-chaeronea",
        "title": "Battle of Chaeronea — Philip II Conquers Greece",
        "year": -338, "is_bce": True,
        "lat": 38.5, "lng": 22.9,
        "geo_modern": "Chaeronea, Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance": 0.75, "zoom_min": 4,
        "tags": ["greece", "macedon", "philip-ii", "battle"],
        "description": "Philip II of Macedon defeated the combined Athenian and Theban forces at Chaeronea, ending the era of independent Greek city-states. His 18-year-old son Alexander commanded the decisive cavalry charge that broke the Sacred Band of Thebes.",
    },
    {
        "slug": "alexander-reaches-india",
        "title": "Alexander the Great Reaches India — Battle of the Hydaspes",
        "year": -326, "is_bce": True,
        "lat": 32.49, "lng": 73.55,
        "geo_modern": "Jhelum, Pakistan", "geo_era_label": "Hellenistic Period",
        "category": "war", "importance": 0.78, "zoom_min": 3,
        "tags": ["alexander", "india", "battle", "hellenistic"],
        "description": "Alexander crossed the Indus and defeated King Porus at the Hydaspes River in the easternmost battle of his campaigns. He was so impressed by Porus' bravery that he reinstated him as a vassal king. Alexander's troops then refused to march further, forcing the return west.",
    },
    {
        "slug": "colossus-of-rhodes",
        "title": "Colossus of Rhodes Erected — Wonder of the Ancient World",
        "year": -280, "is_bce": True,
        "lat": 36.4511, "lng": 28.2278,
        "geo_modern": "Rhodes, Greece", "geo_era_label": "Hellenistic Period",
        "category": "cultural", "importance": 0.70, "zoom_min": 4,
        "tags": ["hellenistic", "rhodes", "seven-wonders", "sculpture"],
        "description": "The Rhodians built a 33-meter bronze statue of the sun god Helios to celebrate their successful resistance against a siege by Demetrius. Standing for only 54 years before an earthquake toppled it, the Colossus became one of the Seven Wonders of the Ancient World.",
    },
    {
        "slug": "first-triumvirate-rome",
        "title": "First Triumvirate — Caesar, Pompey, and Crassus",
        "year": -60, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance": 0.75, "zoom_min": 4,
        "tags": ["rome", "triumvirate", "caesar", "pompey", "crassus"],
        "description": "Julius Caesar, Pompey, and Crassus formed an informal political alliance that dominated Roman politics. This concentration of power in three men's hands undermined republican institutions and set the stage for the civil wars that would destroy the Republic.",
    },
    {
        "slug": "gallic-wars-caesar",
        "title": "Caesar's Gallic Wars — Conquest of Gaul",
        "year": -58, "is_bce": True,
        "lat": 47.32, "lng": 5.04,
        "geo_modern": "Gaul (France)", "geo_era_label": "Roman Republic",
        "category": "war", "importance": 0.80, "zoom_min": 3,
        "tags": ["rome", "caesar", "gaul", "conquest"],
        "description": "Julius Caesar spent eight years conquering Gaul, killing or enslaving over a million people by his own account. The campaign gave Caesar the wealth, veteran army, and political prestige that made him powerful enough to challenge the Roman Senate and cross the Rubicon.",
    },
    {
        "slug": "second-triumvirate-rome",
        "title": "Second Triumvirate — Octavian, Antony, and Lepidus",
        "year": -43, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "triumvirate", "octavian", "antony"],
        "description": "After Caesar's assassination, Octavian, Mark Antony, and Lepidus formed a legally sanctioned triumvirate that proscribed their enemies and divided the Roman world. Their alliance ultimately collapsed, leading to the final civil war between Octavian and Antony.",
    },
    {
        "slug": "roman-conquest-of-britain",
        "title": "Roman Conquest of Britain Under Claudius",
        "year": 43, "is_bce": False,
        "lat": 51.2802, "lng": 1.0789,
        "geo_modern": "England, UK", "geo_era_label": "Roman Empire",
        "category": "war", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "britain", "conquest", "claudius"],
        "description": "Emperor Claudius launched the Roman invasion of Britain, establishing a province that would last nearly 400 years. The conquest brought Roman roads, cities, baths, and Latin to the British Isles, profoundly shaping the island's cultural development.",
    },
    {
        "slug": "boudicca-revolt-roman-britain",
        "title": "Boudicca's Revolt Against Roman Rule",
        "year": 60, "is_bce": False,
        "lat": 52.63, "lng": 1.30,
        "geo_modern": "East Anglia, England", "geo_era_label": "Roman Britain",
        "category": "war", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "britain", "boudicca", "revolt"],
        "description": "Queen Boudicca of the Iceni led a massive uprising against Roman occupation, destroying Colchester, London, and St. Albans. Though ultimately defeated by the Roman governor Suetonius Paulinus, her rebellion killed an estimated 70,000–80,000 and nearly drove the Romans from Britain.",
    },
    {
        "slug": "jewish-diaspora-bar-kokhba",
        "title": "Bar Kokhba Revolt — Jewish Diaspora Deepens",
        "year": 132, "is_bce": False,
        "lat": 31.7785, "lng": 35.2346,
        "geo_modern": "Judea, Israel/Palestine", "geo_era_label": "Roman Empire",
        "category": "war", "importance": 0.73, "zoom_min": 4,
        "tags": ["rome", "judea", "revolt", "diaspora"],
        "description": "Simon bar Kokhba led the last major Jewish revolt against Rome, briefly establishing an independent state. Hadrian crushed the rebellion with devastating force, renaming the province Syria Palaestina and banning Jews from Jerusalem, deepening the Jewish diaspora.",
    },
    {
        "slug": "antonine-plague-roman-empire",
        "title": "Antonine Plague Devastates the Roman Empire",
        "year": 165, "is_bce": False,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Roman Empire", "geo_era_label": "Roman Empire",
        "category": "natural", "importance": 0.72, "zoom_min": 4,
        "tags": ["rome", "plague", "pandemic", "disease"],
        "description": "Returning soldiers brought a devastating epidemic — likely smallpox — from the eastern campaigns, killing an estimated 5–10 million across the empire. The Antonine Plague weakened Rome's military and economy, contributing to the end of the Pax Romana.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # CENTRAL/EAST ASIA & STEPPE
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "scythian-steppe-culture",
        "title": "Scythian Nomadic Empire Dominates the Eurasian Steppe",
        "year": -700, "is_bce": True,
        "lat": 47.0, "lng": 35.0,
        "geo_modern": "Ukraine/Central Asia", "geo_era_label": "Scythian Period",
        "category": "political", "importance": 0.68, "zoom_min": 4,
        "tags": ["scythians", "steppe", "nomads", "gold"],
        "description": "The Scythians created a vast nomadic empire stretching from the Black Sea to Siberia. Renowned horse warriors and goldsmiths, they developed a distinctive animal style art. Herodotus described their customs, and their kurgan burials have yielded spectacular archaeological finds.",
    },
    {
        "slug": "celtic-expansion-europe",
        "title": "Celtic Expansion Across Europe",
        "year": -500, "is_bce": True,
        "lat": 47.5, "lng": 7.6,
        "geo_modern": "Central/Western Europe", "geo_era_label": "La Tène Period",
        "category": "cultural", "importance": 0.70, "zoom_min": 3,
        "tags": ["celts", "europe", "la-tene", "expansion"],
        "description": "Celtic peoples expanded from their Central European homeland across much of western and central Europe, from Iberia to Anatolia. The La Tène culture produced distinctive curvilinear art, advanced ironwork, and hill-fort settlements that defined pre-Roman Europe.",
    },
    {
        "slug": "xiongnu-steppe-empire",
        "title": "Xiongnu Empire — First Great Steppe Confederacy",
        "year": -209, "is_bce": True,
        "lat": 47.0, "lng": 107.0,
        "geo_modern": "Mongolia", "geo_era_label": "Xiongnu Empire",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["xiongnu", "steppe", "mongolia", "china"],
        "description": "Modu Chanyu united the Xiongnu tribes into a powerful steppe confederacy that threatened Han China. The Xiongnu forced the Han to pay tribute and send princesses, prompting the construction of the Great Wall and eventually the opening of the Silk Road as a strategic response.",
    },
    {
        "slug": "kushan-empire-gandhara",
        "title": "Kushan Empire — Crossroads of Civilizations",
        "year": 30, "is_bce": False,
        "lat": 34.52, "lng": 69.17,
        "geo_modern": "Afghanistan/Pakistan/India", "geo_era_label": "Kushan Empire",
        "category": "political", "importance": 0.72, "zoom_min": 4,
        "tags": ["kushan", "gandhara", "silk-road", "buddhism"],
        "description": "The Kushan Empire, founded by Central Asian nomads, created a vast realm connecting India, China, and Rome via the Silk Road. Under Kanishka the Great, Gandharan art fused Greek and Indian styles, producing the first anthropomorphic images of the Buddha.",
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL DIVERSE EVENTS
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "jomon-pottery-japan",
        "title": "Jōmon Pottery — World's Oldest Known Pottery Tradition",
        "year": -4500, "is_bce": True,
        "lat": 38.26, "lng": 140.87,
        "geo_modern": "Japan", "geo_era_label": "Jōmon Period",
        "category": "cultural", "importance": 0.72, "zoom_min": 3,
        "tags": ["japan", "pottery", "jomon", "technology"],
        "description": "The Jōmon people of Japan produced some of the world's oldest known pottery, with cord-marked vessels dating to roughly 10,000 BCE. This hunter-gatherer society developed a surprisingly complex sedentary culture that lasted over 10,000 years.",
    },
    {
        "slug": "catalhoyuk-settlement",
        "title": "Çatalhöyük — One of the World's First Towns",
        "year": -4500, "is_bce": True,
        "lat": 37.6661, "lng": 32.8272,
        "geo_modern": "Konya, Turkey", "geo_era_label": "Neolithic Anatolia",
        "category": "cultural", "importance": 0.75, "zoom_min": 3,
        "tags": ["neolithic", "anatolia", "urbanization", "art"],
        "description": "Çatalhöyük in Anatolia was a densely packed settlement of up to 8,000 people with no streets — residents entered homes through roof hatches. Its elaborate wall paintings, bull skulls, and figurines provide extraordinary evidence of early Neolithic religion and social life.",
    },
    {
        "slug": "domestication-of-the-horse",
        "title": "Domestication of the Horse on the Eurasian Steppe",
        "year": -4000, "is_bce": True,
        "lat": 51.0, "lng": 54.0,
        "geo_modern": "Kazakhstan/Russia", "geo_era_label": "Botai Culture",
        "category": "discovery", "importance": 0.82, "zoom_min": 2,
        "tags": ["horse", "domestication", "steppe", "technology"],
        "description": "Horses were first domesticated on the Pontic-Caspian steppe, possibly at the Botai site in Kazakhstan. Horse domestication revolutionized transportation, warfare, and communication, eventually connecting distant civilizations and transforming the course of human history.",
    },
    {
        "slug": "invention-of-the-wheel",
        "title": "Invention of the Wheel",
        "year": -3500, "is_bce": True,
        "lat": 32.0, "lng": 45.0,
        "geo_modern": "Mesopotamia, Iraq", "geo_era_label": "Mesopotamia",
        "category": "discovery", "importance": 0.90, "zoom_min": 1,
        "tags": ["technology", "invention", "wheel", "mesopotamia"],
        "description": "The wheel was invented in Mesopotamia, initially as a potter's wheel before being adapted for transportation. Combined with the axle, wheeled vehicles transformed trade, agriculture, and warfare, becoming one of humanity's most consequential inventions.",
    },
    {
        "slug": "stonehenge-construction",
        "title": "Stonehenge Constructed — Neolithic Britain's Great Monument",
        "year": -3000, "is_bce": True,
        "lat": 51.1789, "lng": -1.8262,
        "geo_modern": "Wiltshire, England", "geo_era_label": "Neolithic Britain",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["britain", "neolithic", "stonehenge", "astronomy"],
        "description": "Stonehenge was built in stages over 1,500 years, culminating in the massive sarsen stone circle. Its alignment with solstice sunrises suggests astronomical purpose, while bluestones transported 250 km from Wales demonstrate remarkable engineering and organizational capacity.",
    },
    {
        "slug": "first-coins-lydia",
        "title": "First Coins Minted in Lydia — Birth of Money",
        "year": -600, "is_bce": True,
        "lat": 38.47, "lng": 28.04,
        "geo_modern": "Sardis, Turkey", "geo_era_label": "Lydian Kingdom",
        "category": "discovery", "importance": 0.82, "zoom_min": 3,
        "tags": ["lydia", "coins", "money", "trade", "economy"],
        "description": "King Alyattes of Lydia minted the first standardized coins from electrum (gold-silver alloy), revolutionizing commerce. Coinage spread rapidly through the Greek world and beyond, replacing barter and enabling the growth of complex market economies.",
    },
    {
        "slug": "persepolis-constructed",
        "title": "Persepolis — Ceremonial Capital of the Persian Empire",
        "year": -518, "is_bce": True,
        "lat": 29.9352, "lng": 52.8906,
        "geo_modern": "Fars, Iran", "geo_era_label": "Achaemenid Persia",
        "category": "cultural", "importance": 0.78, "zoom_min": 3,
        "tags": ["persia", "persepolis", "architecture", "achaemenid"],
        "description": "Darius I began construction of Persepolis as the ceremonial capital of the Achaemenid Empire. Its magnificent Apadana palace, Gate of All Nations, and relief carvings depicting tribute-bearing peoples from across the empire showcased Persian imperial grandeur.",
    },
    {
        "slug": "dead-sea-scrolls-period",
        "title": "Dead Sea Scrolls Written at Qumran",
        "year": -150, "is_bce": True,
        "lat": 31.7414, "lng": 35.4593,
        "geo_modern": "Qumran, West Bank", "geo_era_label": "Hellenistic Judea",
        "category": "cultural", "importance": 0.78, "zoom_min": 4,
        "tags": ["judea", "religion", "scrolls", "judaism"],
        "description": "A Jewish sect, likely the Essenes, copied and composed the Dead Sea Scrolls at Qumran near the Dead Sea. Discovered in 1947, these manuscripts include the oldest known biblical texts and transformed our understanding of Second Temple Judaism and early Christianity.",
    },
    {
        "slug": "paul-missionary-journeys",
        "title": "Paul's Missionary Journeys — Christianity Spreads to the Gentiles",
        "year": 49, "is_bce": False,
        "lat": 36.99, "lng": 35.33,
        "geo_modern": "Antioch/Mediterranean", "geo_era_label": "Roman Empire",
        "category": "cultural", "importance": 0.82, "zoom_min": 3,
        "tags": ["christianity", "paul", "mission", "religion"],
        "description": "The apostle Paul traveled thousands of miles across the Roman Empire, establishing Christian communities in Asia Minor, Greece, and Rome. His letters (epistles) became foundational texts of Christianity and his decision to accept Gentile converts transformed the faith from a Jewish sect into a universal religion.",
    },
    {
        "slug": "han-invention-of-compass",
        "title": "Chinese Invention of the Magnetic Compass",
        "year": -200, "is_bce": True,
        "lat": 34.26, "lng": 108.94,
        "geo_modern": "China", "geo_era_label": "Han Dynasty China",
        "category": "discovery", "importance": 0.75, "zoom_min": 4,
        "tags": ["china", "invention", "compass", "navigation"],
        "description": "The Chinese discovered that lodestone could indicate direction, initially using it for divination and feng shui. The 'south-pointing spoon' was the earliest magnetic compass, a technology that would eventually revolutionize global navigation and enable the Age of Exploration.",
    },
    {
        "slug": "roman-aqueduct-engineering",
        "title": "Roman Aqueducts — Engineering Marvel of Water Supply",
        "year": -312, "is_bce": True,
        "lat": 41.8902, "lng": 12.4922,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "cultural", "importance": 0.75, "zoom_min": 4,
        "tags": ["rome", "engineering", "aqueducts", "water"],
        "description": "Rome's first aqueduct, the Aqua Appia, began the city's transformation into a hydraulic civilization. Eventually 11 aqueducts delivered 1 million cubic meters of water daily to Rome, supplying public baths, fountains, and flush toilets — a feat unmatched until modern times.",
    },
    {
        "slug": "cleopatra-death-egypt-falls-to-rome",
        "title": "Death of Cleopatra — Egypt Becomes a Roman Province",
        "year": -30, "is_bce": True,
        "lat": 31.2001, "lng": 29.9187,
        "geo_modern": "Alexandria, Egypt", "geo_era_label": "Ptolemaic Egypt",
        "category": "political", "importance": 0.82, "zoom_min": 3,
        "tags": ["egypt", "rome", "cleopatra", "ptolemaic"],
        "description": "Cleopatra VII committed suicide after Octavian's conquest, ending three millennia of Egyptian pharaonic rule and the last Hellenistic kingdom. Egypt became Rome's wealthiest province, its grain supply feeding the imperial capital.",
    },
    {
        "slug": "spread-of-mahayana-buddhism",
        "title": "Rise of Mahayana Buddhism — The Great Vehicle",
        "year": 100, "is_bce": False,
        "lat": 34.52, "lng": 69.17,
        "geo_modern": "Gandhara/India", "geo_era_label": "Kushan Empire",
        "category": "cultural", "importance": 0.75, "zoom_min": 3,
        "tags": ["buddhism", "mahayana", "religion", "india"],
        "description": "Mahayana Buddhism emerged with its emphasis on compassion and the bodhisattva ideal — seeking enlightenment for all beings, not just oneself. This more accessible form of Buddhism eventually spread along the Silk Road to China, Korea, Japan, and Vietnam.",
    },
    {
        "slug": "ptolemy-almagest-astronomy",
        "title": "Ptolemy's Almagest — Geocentric Model of the Universe",
        "year": 150, "is_bce": False,
        "lat": 31.2001, "lng": 29.9187,
        "geo_modern": "Alexandria, Egypt", "geo_era_label": "Roman Egypt",
        "category": "discovery", "importance": 0.78, "zoom_min": 4,
        "tags": ["astronomy", "ptolemy", "science", "alexandria"],
        "description": "Claudius Ptolemy compiled the Almagest, a comprehensive mathematical model of the cosmos that placed Earth at the center. Though ultimately incorrect, his geocentric model was so mathematically sophisticated that it dominated Western and Islamic astronomy for over 1,400 years.",
    },
    {
        "slug": "galen-medicine-roman-empire",
        "title": "Galen of Pergamon — Foundation of Western Medicine",
        "year": 170, "is_bce": False,
        "lat": 39.1217, "lng": 27.1833,
        "geo_modern": "Pergamon, Turkey", "geo_era_label": "Roman Empire",
        "category": "discovery", "importance": 0.73, "zoom_min": 4,
        "tags": ["rome", "medicine", "galen", "science"],
        "description": "Galen's anatomical research and medical writings became the supreme authority in Western and Islamic medicine for over 1,300 years. Serving as physician to gladiators and emperors, his theories on the four humors and detailed anatomical descriptions shaped medical practice until the Renaissance.",
    },
    {
        "slug": "stirrup-invention-asia",
        "title": "Invention of the Stirrup — Revolution in Mounted Warfare",
        "year": 300, "is_bce": False,
        "lat": 41.0, "lng": 122.0,
        "geo_modern": "China/Central Asia", "geo_era_label": "Jin Dynasty China",
        "category": "discovery", "importance": 0.72, "zoom_min": 4,
        "tags": ["technology", "military", "cavalry", "stirrup"],
        "description": "The paired metal stirrup, developed in China or the steppe, revolutionized cavalry warfare by giving riders a stable platform for fighting. This seemingly simple invention enabled heavy cavalry charges and contributed to the rise of mounted warrior aristocracies across Eurasia.",
    },
    {
        "slug": "saint-augustine-city-of-god",
        "title": "Saint Augustine Writes The City of God",
        "year": 426, "is_bce": False,
        "lat": 36.365, "lng": 7.762,
        "geo_modern": "Hippo Regius, Algeria", "geo_era_label": "Late Roman Empire",
        "category": "cultural", "importance": 0.75, "zoom_min": 4,
        "tags": ["christianity", "philosophy", "augustine", "theology"],
        "description": "Augustine of Hippo wrote The City of God after the Visigoths' sack of Rome, arguing that earthly kingdoms were transient compared to God's eternal kingdom. This monumental work shaped Christian theology, just-war theory, and Western political philosophy for centuries.",
    },
]


# ─────────────────────────────────────────────────────────────────────────────
# DATABASE INSERT LOGIC
# ─────────────────────────────────────────────────────────────────────────────

async def main() -> None:
    conn = await asyncpg.connect(PG_DSN)
    print(f"Connected to database. Processing {len(EVENTS)} events...")

    inserted = 0
    skipped = 0

    for event in EVENTS:
        slug = event["slug"]

        # Check for existing slug
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  SKIP (exists): {slug}")
            skipped += 1
            continue

        year = event["year"]
        is_bce = event.get("is_bce", False)
        abs_year = abs(year)

        # Build date literals (PostgreSQL BC notation for BCE dates)
        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        # PostGIS point
        lat = event.get("lat", 0)
        lng = event.get("lng", 0)
        geo_wkt = f"SRID=4326;POINT({lng} {lat})"

        # Content hash for deduplication
        content_hash = hashlib.sha256(
            json.dumps(event, sort_keys=True).encode()
        ).hexdigest()[:16]

        # Tags
        tags = event.get("tags", [])

        # Description goes into date_notes
        description = event.get("description", "")

        insert_sql = f"""
            INSERT INTO events (
                slug, title, date_earliest, date_latest, year_approx, is_bce,
                geo_point, geo_modern, geo_era_label,
                importance_score, zoom_min, event_category,
                tags, date_notes,
                review_status, created_by, content_hash
            ) VALUES (
                $1, $2, {date_e_lit}, {date_l_lit}, $3, $4,
                ST_GeomFromEWKT($5), $6, $7,
                $8, $9, $10,
                $11, $12,
                'approved', $13, $14
            ) RETURNING id
        """

        try:
            event_id = await conn.fetchval(
                insert_sql,
                slug, event["title"], year, is_bce,
                geo_wkt, event.get("geo_modern"), event.get("geo_era_label"),
                event.get("importance", 0.5), event.get("zoom_min", 3), event.get("category"),
                tags, description,
                CREATED_BY, content_hash,
            )
            print(f"  INSERT: {slug} (id={event_id})")
            inserted += 1
        except Exception as e:
            print(f"  ERROR: {slug} — {e}")

    await conn.close()
    print(f"\nDone! Inserted: {inserted}, Skipped: {skipped}, Total in script: {len(EVENTS)}")


if __name__ == "__main__":
    asyncio.run(main())
