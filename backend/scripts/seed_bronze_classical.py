#!/usr/bin/env python3
"""
Chronicle seed script — Bronze Age + early classical (-2000 to -500 BCE) enrichment.

Adds ~80 new events to the thinnest per-century coverage in the DB,
skipping any that already exist (checked by both slug AND title).

Run:
    python backend/scripts/seed_bronze_classical.py
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
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:bronze-classical-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # BRONZE AGE — MINOAN & AEGEAN (-2000 to -1200)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "minoan-knossos-palace-construction-2000bce",
        "title": "Construction of the Palace at Knossos — Minoan Crete",
        "year": -2000, "lat": 35.30, "lng": 25.16,
        "geo_modern": "Heraklion, Crete, Greece",
        "geo_era_label": "Minoan Crete",
        "category": "cultural", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "The first palace at Knossos, built around 2000 BCE, marked the emergence of the Minoan civilization as Europe's first advanced society. The palace complex featured innovative plumbing, multi-story architecture, and elaborate frescoes depicting bull-leaping and marine life.",
             "summary": "Europe's first palace complex — birth of Minoan civilization.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Palaces of Minoan Crete", "author": "Gerald Cadogan", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1976}
             ]},
        ],
    },
    {
        "slug": "middle-kingdom-egypt-begins-2055bce",
        "title": "Middle Kingdom Egypt — Reunification Under Mentuhotep II",
        "year": -2055, "lat": 25.73, "lng": 32.60,
        "geo_modern": "Thebes (Luxor), Egypt",
        "geo_era_label": "Middle Kingdom Egypt",
        "category": "political", "importance_score": 0.72, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Mentuhotep II reunified Egypt around 2055 BCE after the chaos of the First Intermediate Period, inaugurating the Middle Kingdom — an era of cultural flourishing, expansion into Nubia, and the classic period of Egyptian literature.",
             "summary": "Egypt reunified after a century of fragmentation — the Middle Kingdom begins.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Oxford History of Ancient Egypt", "author": "Ian Shaw", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "babylon-rises-hammurabi-1792bce",
        "title": "Hammurabi Ascends to Power — Babylon Becomes a Major Empire",
        "year": -1792, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Hillah, Iraq (ancient Babylon)",
        "geo_era_label": "Old Babylonian Period",
        "category": "political", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Hammurabi became king of the small city-state of Babylon in 1792 BCE and through military conquest and diplomacy transformed it into the dominant power of Mesopotamia. His 42-year reign established Babylon as the political and cultural center of the ancient Near East.",
             "summary": "Babylon rises from city-state to empire under Hammurabi.",
             "evidence_score": 0.85,
             "sources": [
                 {"title": "Hammurabi of Babylon", "author": "Marc Van De Mieroop", "publication": "Blackwell",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "hyksos-expulsion-egypt-1550bce",
        "title": "Expulsion of the Hyksos from Egypt — Ahmose I Reunifies Egypt",
        "year": -1550, "lat": 30.79, "lng": 31.00,
        "geo_modern": "Avaris (Tell el-Dab'a), Egypt",
        "geo_era_label": "New Kingdom Egypt",
        "category": "war", "importance_score": 0.73, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Ahmose I completed the expulsion of the Hyksos from their capital at Avaris around 1550 BCE, ending over a century of foreign rule in Lower Egypt. This victory inaugurated the New Kingdom, Egypt's most powerful and expansive era.",
             "summary": "Egypt expels the Hyksos and enters its most powerful era.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Hyksos: A New Investigation", "author": "Manfred Bietak", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "battle-megiddo-first-recorded-battle-1457bce",
        "title": "Battle of Megiddo — First Recorded Military Battle in History",
        "year": -1457, "lat": 32.58, "lng": 35.18,
        "geo_modern": "Megiddo, Israel",
        "geo_era_label": "New Kingdom Egypt",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Thutmose III's victory at Megiddo in 1457 BCE is the earliest battle recorded in sufficient detail for historical analysis. His bold decision to march through the narrow Aruna Pass gave him tactical surprise. The Egyptian account on the walls of Karnak provides the first detailed military narrative in history.",
             "summary": "The first battle in recorded history — Thutmose III's tactical masterpiece.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Battle of Megiddo", "author": "Eric Cline", "publication": "University of Michigan Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "linear-b-writing-mycenaean-1450bce",
        "title": "Linear B Writing System — Mycenaean Greek Administration",
        "year": -1450, "lat": 35.30, "lng": 25.16,
        "geo_modern": "Knossos, Crete, Greece",
        "geo_era_label": "Late Bronze Age Aegean",
        "category": "cultural", "importance_score": 0.77, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Linear B, deciphered by Michael Ventris in 1952, proved to be an early form of Greek used by Mycenaean palace administrators. The tablets from Knossos and Pylos record inventories, offerings to gods, and workforce management — providing a window into Bronze Age bureaucracy. Its decipherment pushed the history of the Greek language back by 700 years.",
             "summary": "The earliest Greek writing — deciphered in 1952, revealing Mycenaean palace administration.",
             "evidence_score": 0.90,
             "sources": [
                 {"title": "The Decipherment of Linear B", "author": "John Chadwick", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1958}
             ]},
        ],
    },
    {
        "slug": "hittite-empire-peak-1400bce",
        "title": "Hittite Empire at Its Peak — Superpower of Anatolia",
        "year": -1400, "lat": 40.02, "lng": 34.61,
        "geo_modern": "Boğazkale (Hattusa), Turkey",
        "geo_era_label": "Late Bronze Age Anatolia",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "By 1400 BCE the Hittite Empire controlled most of Anatolia and northern Syria from their capital at Hattusa. They were the first Indo-European people to build a major empire, pioneered iron smelting technology, and maintained diplomatic correspondence with Egypt, Babylon, and Assyria as equals.",
             "summary": "The Hittite Empire — first Indo-European superpower and iron age pioneers.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Kingdom of the Hittites", "author": "Trevor Bryce", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "bronze-age-collapse-1200bce",
        "title": "Bronze Age Collapse — Catastrophic End of Late Bronze Age Civilizations",
        "year": -1200, "lat": 35.00, "lng": 33.00,
        "geo_modern": "Eastern Mediterranean",
        "geo_era_label": "Late Bronze Age",
        "category": "disaster", "importance_score": 0.90, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Systems collapse perspective", "culture_code": "int", "viewpoint_type": "academic",
             "narrative": "Around 1200 BCE, the interconnected palace economies of the Late Bronze Age collapsed in a cascade of destruction. The Hittite Empire vanished, Mycenaean palaces burned, Ugarit was destroyed, and Egypt barely survived. Eric Cline argues this was a 'systems collapse' driven by earthquakes, drought, invasion, and trade disruption — a perfect storm that ended a globalized Bronze Age world.",
             "summary": "The ancient world's first dark age — interconnected civilizations collapse simultaneously.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "1177 B.C.: The Year Civilization Collapsed", "author": "Eric H. Cline", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "sea-peoples-invasions-1180bce",
        "title": "Sea Peoples Invasions — Mysterious Raiders of the Bronze Age",
        "year": -1180, "lat": 31.52, "lng": 34.45,
        "geo_modern": "Medinet Habu, Egypt / Eastern Mediterranean",
        "geo_era_label": "Late Bronze Age",
        "category": "war", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Between 1200 and 1150 BCE, waves of maritime raiders known as the Sea Peoples attacked coastal civilizations across the eastern Mediterranean. Ramesses III's temple at Medinet Habu records his naval victory over them around 1180 BCE — the only major power to survive their onslaught. Their origins remain one of archaeology's great mysteries.",
             "summary": "Mysterious maritime raiders who helped destroy the Bronze Age world.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "The Sea Peoples: Warriors of the Ancient Mediterranean", "author": "N.K. Sandars",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1978}
             ]},
        ],
    },
    {
        "slug": "amarna-letters-diplomatic-correspondence-1350bce",
        "title": "Amarna Letters — Bronze Age International Diplomacy",
        "year": -1350, "lat": 27.65, "lng": 30.90,
        "geo_modern": "Amarna (Tell el-Amarna), Egypt",
        "geo_era_label": "Late Bronze Age",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Diplomatic history perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The Amarna Letters, discovered in 1887, are a cache of ~380 cuneiform tablets revealing the diplomatic correspondence between Egyptian pharaohs and the great kings of Babylon, Assyria, Mitanni, and the Hittites. Written in Akkadian — the lingua franca of the age — they reveal a sophisticated 'Great Powers Club' governing Late Bronze Age international relations.",
             "summary": "Ancient diplomatic archive revealing Bronze Age geopolitics between great powers.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "The Amarna Letters", "author": "William L. Moran", "publication": "Johns Hopkins University Press",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "tutankhamun-tomb-burial-1323bce",
        "title": "Burial of Tutankhamun — The Boy Pharaoh's Golden Tomb",
        "year": -1323, "lat": 25.74, "lng": 32.60,
        "geo_modern": "Valley of the Kings, Luxor, Egypt",
        "geo_era_label": "New Kingdom Egypt",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Tutankhamun died around 1323 BCE at approximately age 19, buried with the most spectacular funerary goods ever found in an Egyptian tomb. His relatively minor reign became the most famous in Egyptian history when Howard Carter discovered the intact tomb in 1922, sparking worldwide 'Tutmania'.",
             "summary": "The boy pharaoh whose intact tomb became archaeology's greatest discovery.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Complete Tutankhamun", "author": "Nicholas Reeves", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "ugarit-destruction-bronze-collapse-1185bce",
        "title": "Destruction of Ugarit — End of a Great Bronze Age Trading City",
        "year": -1185, "lat": 35.60, "lng": 35.78,
        "geo_modern": "Ras Shamra, Syria",
        "geo_era_label": "Late Bronze Age",
        "category": "disaster", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "sy", "viewpoint_type": "academic",
             "narrative": "The destruction of Ugarit around 1185 BCE epitomizes the Bronze Age Collapse. This wealthy trading city on the Syrian coast was home to the earliest known alphabet (the Ugaritic script) and served as a crucial node in Bronze Age trade networks. Its final letters desperately request military aid that never came.",
             "summary": "A wealthy trading city destroyed during the Bronze Age Collapse — its final letters plea for help.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Ugarit and the Old Testament", "author": "Peter Craigie", "publication": "Eerdmans",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # IRON AGE — PHOENICIANS, ISRAEL, ASSYRIA (-1200 to -700)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "phoenician-alphabet-1050bce",
        "title": "Phoenician Alphabet Developed — Ancestor of All Western Alphabets",
        "year": -1050, "lat": 34.44, "lng": 35.84,
        "geo_modern": "Byblos, Lebanon",
        "geo_era_label": "Iron Age Levant",
        "category": "cultural", "importance_score": 0.92, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic history perspective", "culture_code": "lb", "viewpoint_type": "academic",
             "narrative": "The Phoenician alphabet, fully developed by around 1050 BCE, was the revolutionary innovation of reducing writing to ~22 consonantal signs. This dramatically simplified literacy compared to cuneiform or hieroglyphics. Adopted and modified by the Greeks (who added vowels), it became the ancestor of virtually all Western alphabets including Latin, Cyrillic, and Arabic.",
             "summary": "The alphabet revolution — 22 simple signs that democratized literacy across civilizations.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Alphabet: A Key to the History of Mankind", "author": "David Diringer",
                  "publication": "Hutchinson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1968}
             ]},
        ],
    },
    {
        "slug": "united-kingdom-israel-david-1000bce",
        "title": "United Kingdom of Israel Under King David",
        "year": -1000, "lat": 31.77, "lng": 35.23,
        "geo_modern": "Jerusalem, Israel/Palestine",
        "geo_era_label": "Iron Age Levant",
        "category": "political", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Biblical history perspective", "culture_code": "il", "viewpoint_type": "academic",
             "narrative": "Around 1000 BCE, King David united the tribes of Israel and Judah, establishing Jerusalem as the capital. While the biblical account describes a large kingdom, archaeological evidence (including the Tel Dan stele) confirms David as a historical figure. His dynasty became central to Jewish, Christian, and Islamic traditions.",
             "summary": "David unites Israel and establishes Jerusalem — a pivotal moment for three world religions.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "King David: A Biography", "author": "Steven McKenzie", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "solomons-temple-jerusalem-957bce",
        "title": "Construction of Solomon's Temple in Jerusalem",
        "year": -957, "lat": 31.78, "lng": 35.24,
        "geo_modern": "Temple Mount, Jerusalem",
        "geo_era_label": "Iron Age Levant",
        "category": "cultural", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "il", "viewpoint_type": "academic",
             "narrative": "Solomon's Temple, built around 957 BCE according to biblical chronology, served as the central sanctuary of Israelite worship and the dwelling place of the Ark of the Covenant. Though no archaeological remains of the First Temple have been found, its described plan matches other Iron Age Levantine temples. Its destruction by Babylon in 586 BCE became a defining trauma in Jewish identity.",
             "summary": "The First Temple — spiritual center of ancient Israel and enduring symbol across faiths.",
             "evidence_score": 0.65,
             "sources": [
                 {"title": "The Quest: Revealing the Temple Mount in Jerusalem", "author": "Leen Ritmeyer",
                  "publication": "Carta", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "assyrian-empire-rise-tiglath-pileser-745bce",
        "title": "Neo-Assyrian Empire Rises — Tiglath-Pileser III's Military Reforms",
        "year": -745, "lat": 36.36, "lng": 43.15,
        "geo_modern": "Nineveh (Mosul), Iraq",
        "geo_era_label": "Neo-Assyrian Empire",
        "category": "political", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Tiglath-Pileser III (745-727 BCE) transformed Assyria from a regional power into history's first true empire through revolutionary military and administrative reforms. He created the first professional standing army, implemented mass deportation as policy, and established a provincial system replacing vassal states — innovations copied by every subsequent empire.",
             "summary": "The architect of the first true empire — military and administrative innovations that shaped all future empires.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Ancient Assyria: A Very Short Introduction", "author": "Karen Radner", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "sargon-ii-conquers-israel-722bce",
        "title": "Sargon II Conquers the Kingdom of Israel — Ten Lost Tribes",
        "year": -722, "lat": 32.21, "lng": 35.28,
        "geo_modern": "Samaria (Sebastia), Palestine",
        "geo_era_label": "Neo-Assyrian Empire",
        "category": "war", "importance_score": 0.77, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "In 722 BCE, Sargon II completed the siege of Samaria and deported 27,290 Israelites, ending the northern Kingdom of Israel forever. The deported populations — the 'Ten Lost Tribes' — were scattered across the Assyrian Empire. This event profoundly shaped Jewish theology, prophetic literature, and the enduring distinction between Jews and Samaritans.",
             "summary": "Assyria destroys the northern kingdom — origin of the 'Ten Lost Tribes' tradition.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Archaeology of Israel", "author": "Neil Asher Silberman", "publication": "Sheffield Academic Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "homer-iliad-odyssey-800bce",
        "title": "Homer Composes the Iliad and Odyssey — Foundations of Western Literature",
        "year": -800, "lat": 38.37, "lng": 26.14,
        "geo_modern": "Ionia (Izmir region), Turkey",
        "geo_era_label": "Greek Dark Ages / Archaic Greece",
        "category": "cultural", "importance_score": 0.90, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Literary history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Around 800 BCE, the poems attributed to Homer were crystallized into the forms we know today — the Iliad exploring the wrath of Achilles during the Trojan War, the Odyssey following Odysseus's decade-long journey home. Whether composed by one poet or compiled from oral tradition, they established the foundation of Western literature and remained central to Greek education for a millennium.",
             "summary": "The foundational works of Western literature — war, homecoming, and the human condition.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "Homer and the Oral Tradition", "author": "G.S. Kirk", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1976}
             ]},
        ],
    },
    {
        "slug": "traditional-founding-rome-753bce",
        "title": "Traditional Founding of Rome by Romulus",
        "year": -753, "lat": 41.89, "lng": 12.49,
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Iron Age Italy",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Roman history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "According to Roman tradition, Romulus founded Rome on April 21, 753 BCE, after killing his twin brother Remus in a dispute over the city's location on the Palatine Hill. While the myth is legendary, archaeological evidence confirms habitation of the Palatine from at least the 10th century BCE, and the traditional date served as year zero (AUC) for the Roman calendar.",
             "summary": "The legendary founding of the city that would rule the Mediterranean world.",
             "evidence_score": 0.70,
             "sources": [
                 {"title": "The Beginnings of Rome", "author": "T.J. Cornell", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "first-olympic-games-776bce",
        "title": "First Olympic Games Held at Olympia — Birth of Athletic Competition",
        "year": -776, "lat": 37.64, "lng": 21.63,
        "geo_modern": "Olympia, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Sports history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "The first Olympic Games were traditionally held in 776 BCE at Olympia, with Coroebus of Elis winning the sole event — the stadion foot race. Held every four years for over a millennium (until 393 CE), the Olympics provided a rare pan-Hellenic truce (ekecheiria) during which warfare between Greek city-states was suspended.",
             "summary": "The birth of the Olympic Games — athletics as sacred competition and Greek unity.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Ancient Olympics", "author": "Nigel Spivey", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "phoenicians-found-carthage-814bce",
        "title": "Phoenicians Found Carthage — Future Rival of Rome",
        "year": -814, "lat": 36.85, "lng": 10.32,
        "geo_modern": "Tunis, Tunisia",
        "geo_era_label": "Iron Age Mediterranean",
        "category": "political", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Mediterranean history perspective", "culture_code": "tn", "viewpoint_type": "academic",
             "narrative": "According to tradition, Carthage was founded in 814 BCE by Phoenician colonists from Tyre, led by Queen Dido (Elissa). Archaeological evidence confirms a late 9th-century settlement. Carthage grew into the dominant commercial power of the western Mediterranean, controlling trade routes from Spain to Libya, before its epic confrontation with Rome in the Punic Wars.",
             "summary": "Phoenician colonists found what would become Rome's greatest rival.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Carthage Must Be Destroyed", "author": "Richard Miles", "publication": "Allen Lane",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "greek-colonization-mediterranean-750bce",
        "title": "Greek Colonization of the Mediterranean — Diaspora of City-States",
        "year": -750, "lat": 40.85, "lng": 14.25,
        "geo_modern": "Naples (Neapolis), Italy / Mediterranean",
        "geo_era_label": "Archaic Greece",
        "category": "political", "importance_score": 0.79, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Mediterranean history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "From about 750 to 600 BCE, Greek city-states founded hundreds of colonies across the Mediterranean and Black Sea. Driven by population pressure, trade, and political exile, Greeks established settlements from Marseille to Crimea. This diaspora spread Greek language, culture, and the polis model, laying the groundwork for Hellenistic civilization.",
             "summary": "Greek city-states spread across the Mediterranean — colonization that spread Hellenic civilization.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Greek Colonisation: An Account of Greek Colonies and Other Settlements Overseas", "author": "A.J. Graham",
                  "publication": "Cornell University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ASIAN CIVILIZATIONS — CHINA, INDIA, PERSIA (-1100 to -500)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "zhou-dynasty-mandate-heaven-1046bce",
        "title": "Zhou Dynasty and the Mandate of Heaven — China's Longest Dynasty",
        "year": -1046, "lat": 34.27, "lng": 108.94,
        "geo_modern": "Xi'an, Shaanxi, China",
        "geo_era_label": "Western Zhou Dynasty",
        "category": "political", "importance_score": 0.83, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Zhou overthrew the Shang at the Battle of Muye in 1046 BCE and introduced the concept of the Mandate of Heaven (tianming) — the idea that heaven grants legitimacy to a just ruler and withdraws it from a corrupt one. This became the foundational political philosophy of Chinese imperial governance for over 3,000 years, justifying every subsequent dynastic change.",
             "summary": "China's longest dynasty introduces the Mandate of Heaven — the basis of Chinese political legitimacy.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Cambridge History of Ancient China", "author": "Michael Loewe and Edward Shaughnessy",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "zoroaster-zoroastrianism-founded-1000bce",
        "title": "Zoroaster Founds Zoroastrianism — First Monotheistic Religion",
        "year": -1000, "lat": 36.71, "lng": 61.83,
        "geo_modern": "Balkh, Afghanistan (traditional location)",
        "geo_era_label": "Iron Age Central Asia",
        "category": "cultural", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Zoroaster (Zarathustra) founded what may be the world's first monotheistic or dualistic religion, centered on the cosmic struggle between Ahura Mazda (truth/light) and Angra Mainyu (falsehood/darkness). Dating remains debated (1000-600 BCE), but his teachings profoundly influenced Judaism, Christianity, and Islam through concepts of heaven, hell, final judgment, and free will.",
             "summary": "The first prophet of monotheism — concepts that shaped Judaism, Christianity, and Islam.",
             "evidence_score": 0.68,
             "sources": [
                 {"title": "Zoroastrians: Their Religious Beliefs and Practices", "author": "Mary Boyce",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1979}
             ]},
        ],
    },
    {
        "slug": "upanishads-composed-800bce",
        "title": "Upanishads Composed — Philosophical Foundations of Hinduism",
        "year": -800, "lat": 26.85, "lng": 80.91,
        "geo_modern": "Gangetic Plain, India",
        "geo_era_label": "Late Vedic Period",
        "category": "cultural", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Indian philosophical perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The early Upanishads, composed between approximately 800 and 500 BCE, represent a revolutionary shift from Vedic ritual to philosophical inquiry. They introduced concepts of Brahman (ultimate reality), Atman (the self), karma, and moksha (liberation) that became the foundation of Hindu, Buddhist, and Jain thought. Their dialogue format presages the Socratic method by centuries.",
             "summary": "India's philosophical revolution — the ideas of karma, rebirth, and ultimate reality take shape.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Principal Upanishads", "author": "S. Radhakrishnan", "publication": "George Allen & Unwin",
                  "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1953}
             ]},
        ],
    },
    {
        "slug": "confucius-born-551bce",
        "title": "Confucius Born — Founder of Chinese Ethical Philosophy",
        "year": -551, "lat": 35.60, "lng": 116.99,
        "geo_modern": "Qufu, Shandong, China",
        "geo_era_label": "Spring and Autumn Period",
        "category": "cultural", "importance_score": 0.90, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Chinese philosophical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Kong Qiu (Confucius), born in 551 BCE in the state of Lu, developed an ethical system centered on ren (benevolence), li (ritual propriety), and filial piety that shaped East Asian civilization for over 2,500 years. His teachings, compiled by disciples in the Analerta, emphasized moral self-cultivation, education, and good governance. Confucianism became the official ideology of imperial China and deeply influenced Korea, Japan, and Vietnam.",
             "summary": "The most influential philosopher in East Asian history — ethics, education, and governance.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "Confucius and the Analects", "author": "Annping Chin", "publication": "Penguin Classics",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "laozi-taoism-origins-600bce",
        "title": "Laozi and the Origins of Taoism — The Way That Cannot Be Spoken",
        "year": -600, "lat": 33.87, "lng": 115.57,
        "geo_modern": "Luyi County, Henan, China",
        "geo_era_label": "Spring and Autumn Period",
        "category": "cultural", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Chinese philosophical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Laozi (Lao Tzu), traditionally dated to the 6th century BCE, is credited with the Tao Te Ching — the foundational text of Taoism. Whether Laozi was a historical individual or a composite figure remains debated, but the philosophy of the Tao (the Way), wu wei (non-action), and harmony with nature became a counterpoint to Confucianism and profoundly influenced Chinese art, medicine, and martial arts.",
             "summary": "The mysterious founder of Taoism — wu wei, the Tao, and harmony with nature.",
             "evidence_score": 0.66,
             "sources": [
                 {"title": "The Tao of the Tao Te Ching", "author": "Michael LaFargue", "publication": "SUNY Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "buddha-siddhartha-gautama-born-563bce",
        "title": "Siddhartha Gautama (Buddha) Born — Founder of Buddhism",
        "year": -563, "lat": 27.47, "lng": 83.28,
        "geo_modern": "Lumbini, Nepal",
        "geo_era_label": "Vedic Period India",
        "category": "cultural", "importance_score": 0.92, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "np", "viewpoint_type": "academic",
             "narrative": "Siddhartha Gautama, born around 563 BCE to a royal family in Lumbini (modern Nepal), renounced his privileged life to seek the cause of human suffering. After years of asceticism and meditation, he achieved enlightenment under the Bodhi tree, becoming the Buddha ('awakened one'). His Four Noble Truths and Eightfold Path became the foundation of a religion that spread across Asia to over 500 million followers today.",
             "summary": "The prince who became the Buddha — the Middle Way and the end of suffering.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Life of the Buddha", "author": "Bhikkhu Nanamoli", "publication": "Buddhist Publication Society",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1972}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # PERSIAN EMPIRE & LATE ARCHAIC PERIOD (-550 to -500)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "cyrus-great-achaemenid-empire-550bce",
        "title": "Cyrus the Great Founds the Achaemenid Persian Empire",
        "year": -550, "lat": 30.04, "lng": 52.41,
        "geo_modern": "Pasargadae, Fars, Iran",
        "geo_era_label": "Achaemenid Empire",
        "category": "political", "importance_score": 0.90, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Persian history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Cyrus II ('the Great') united the Medes and Persians around 550 BCE and through rapid conquest created the largest empire the world had yet seen, stretching from the Aegean to Central Asia. His policy of tolerating local customs and religions was unprecedented — he freed the Jews from Babylonian exile and is the only non-Jew called 'messiah' in the Hebrew Bible.",
             "summary": "The founder of the largest ancient empire — revolutionary tolerance and governance.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "Cyrus the Great: Life and Lore", "author": "M. Rahim Shayegan",
                  "publication": "Ilex Foundation / Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "cyrus-cylinder-human-rights-539bce",
        "title": "Cyrus Cylinder — First Declaration of Human Rights",
        "year": -539, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Babylon, Iraq",
        "geo_era_label": "Achaemenid Empire",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Human rights history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "After conquering Babylon in 539 BCE, Cyrus the Great issued the Cyrus Cylinder — a clay document declaring freedom of religion, abolition of slavery, and the right of displaced peoples to return home. While its characterization as a 'human rights charter' is debated (it follows Mesopotamian royal traditions), it represents an unprecedented articulation of tolerance and has been adopted by the United Nations as an ancient precursor to human rights.",
             "summary": "The ancient world's most famous declaration of tolerance — debated but influential.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Cyrus Cylinder", "author": "Irving Finkel", "publication": "I.B. Tauris",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "athenian-democracy-cleisthenes-508bce",
        "title": "Cleisthenes Establishes Athenian Democracy — Birth of Self-Government",
        "year": -508, "lat": 37.97, "lng": 23.72,
        "geo_modern": "Athens, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "political", "importance_score": 0.92, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "In 508/507 BCE, Cleisthenes reformed Athenian government to create the world's first democracy. He reorganized citizens into ten tribes based on geography (not kinship), established the Council of 500 chosen by lot, and gave the Assembly (ekklesia) of all male citizens final authority on law and policy. Though limited to free adult males, this radical experiment in self-government became the foundation of democratic political theory.",
             "summary": "The invention of democracy — government by the people, for the first time in history.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Discovery of Freedom in Ancient Greece", "author": "Kurt Raaflaub",
                  "publication": "University of Chicago Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # SCYTHIANS, OLMEC, CHAVIN (-1200 to -500)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "scythian-culture-peak-eurasian-steppe-700bce",
        "title": "Scythian Culture Peak — Masters of the Eurasian Steppe",
        "year": -700, "lat": 47.50, "lng": 35.00,
        "geo_modern": "Southern Ukraine / Central Asia",
        "geo_era_label": "Iron Age Eurasia",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Nomadic civilization perspective", "culture_code": "ua", "viewpoint_type": "academic",
             "narrative": "The Scythians dominated the Eurasian steppe from around 700 to 300 BCE, creating a sophisticated nomadic culture that terrified settled civilizations from Greece to China. Master horse archers and goldsmiths, they produced stunning animal-style art found in frozen tombs across Siberia and Ukraine. Herodotus devoted an entire book of his Histories to their customs.",
             "summary": "The Eurasian steppe's greatest nomadic culture — feared warriors and extraordinary artists.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Scythians: Nomad Warriors of the Steppe", "author": "Barry Cunliffe",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "olmec-civilization-la-venta-900bce",
        "title": "Olmec Civilization at La Venta — Mesoamerica's Mother Culture",
        "year": -900, "lat": 18.10, "lng": -94.04,
        "geo_modern": "La Venta, Tabasco, Mexico",
        "geo_era_label": "Preclassic Mesoamerica",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Mesoamerican archaeology perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "La Venta became the primary Olmec ceremonial center around 900 BCE after the decline of San Lorenzo, featuring massive earthen pyramids, elaborate jade offerings, and the iconic colossal stone heads. The Olmec established foundational Mesoamerican practices including the Long Count calendar, ritual ball game, and jaguar symbolism that influenced all subsequent civilizations including the Maya and Aztec.",
             "summary": "The mother culture of Mesoamerica — pyramids, calendars, and the ball game begin here.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Olmecs: America's First Civilization", "author": "Richard Diehl",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "chavin-culture-peru-900bce",
        "title": "Chavín de Huántar — Mother Culture of the Andes",
        "year": -900, "lat": -9.59, "lng": -77.18,
        "geo_modern": "Chavín de Huántar, Ancash, Peru",
        "geo_era_label": "Early Horizon Andes",
        "category": "cultural", "importance_score": 0.73, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Andean archaeology perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Chavín de Huántar, flourishing from around 900 to 200 BCE, served as a major religious and ceremonial center high in the Andes. Its underground galleries, intricate stone carvings of fanged deities, and sophisticated water channeling systems influenced cultures across a wide area of Peru. The Chavín horizon represents the first widespread cultural unification in South American history.",
             "summary": "South America's first cultural horizon — religion and art that unified the Andes.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Chavín and the Origins of Andean Civilization", "author": "Richard Burger",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1992}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL EVENTS FOR COVERAGE
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "egyptian-book-of-dead-composition-1550bce",
        "title": "Egyptian Book of the Dead — The Afterlife Guide of the New Kingdom",
        "year": -1550, "lat": 25.73, "lng": 32.60,
        "geo_modern": "Thebes (Luxor), Egypt",
        "geo_era_label": "New Kingdom Egypt",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The Book of the Dead (properly 'Book of Coming Forth by Day') was a collection of spells and illustrations placed in tombs from around 1550 BCE onward. It guided the deceased through the underworld's dangers to the weighing of the heart against the feather of Ma'at. The concept of moral judgment after death influenced later religious traditions across the Mediterranean.",
             "summary": "The ancient Egyptian afterlife manual — moral judgment and the hope of eternal life.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Egyptian Book of the Dead: The Book of Going Forth by Day", "author": "Raymond Faulkner",
                  "publication": "Chronicle Books", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1972}
             ]},
        ],
    },
    {
        "slug": "ramesses-ii-abu-simbel-1264bce",
        "title": "Ramesses II Builds Abu Simbel — Egypt's Greatest Monumental Builder",
        "year": -1264, "lat": 22.34, "lng": 31.63,
        "geo_modern": "Abu Simbel, Aswan, Egypt",
        "geo_era_label": "New Kingdom Egypt",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Ramesses II ordered the construction of Abu Simbel around 1264 BCE — four colossal statues of himself carved into a cliff face on the Nubian border. The temple was precisely aligned so that twice a year, sunlight penetrated the inner sanctum to illuminate the statues of the gods within. The 1960s UNESCO rescue of the temples from the Aswan Dam became a landmark in cultural preservation.",
             "summary": "Egypt's most spectacular temple — engineering, propaganda, and astronomical alignment.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Ramesses II: Egypt's Greatest Pharaoh", "author": "Toby Wilkinson", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "treaty-kadesh-first-peace-treaty-1259bce",
        "title": "Treaty of Kadesh — The World's First Known Peace Treaty",
        "year": -1259, "lat": 34.56, "lng": 36.52,
        "geo_modern": "Kadesh (Tell Nebi Mend), Syria",
        "geo_era_label": "Late Bronze Age",
        "category": "political", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Diplomatic history perspective", "culture_code": "int", "viewpoint_type": "academic",
             "narrative": "The Treaty of Kadesh (c. 1259 BCE), signed between Ramesses II of Egypt and Hattusili III of the Hittite Empire, is the oldest known peace treaty. Surviving in both Egyptian hieroglyphic and Hittite cuneiform versions, it established mutual non-aggression, an extradition clause, and military alliance. A replica hangs in the United Nations as a symbol of diplomacy.",
             "summary": "History's first peace treaty — a diplomatic milestone replicated at the United Nations.",
             "evidence_score": 0.88,
             "sources": [
                 {"title": "Letters of the Great Kings of the Ancient Near East", "author": "Trevor Bryce",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "kingdom-israel-divided-930bce",
        "title": "Kingdom of Israel Divided — Judah and Israel Split",
        "year": -930, "lat": 32.21, "lng": 35.28,
        "geo_modern": "Shechem (Nablus), Palestine",
        "geo_era_label": "Iron Age Levant",
        "category": "political", "importance_score": 0.72, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Biblical history perspective", "culture_code": "il", "viewpoint_type": "academic",
             "narrative": "After Solomon's death around 930 BCE, the united monarchy split into the northern Kingdom of Israel (ten tribes) and the southern Kingdom of Judah (tribes of Judah and Benjamin). The schism, triggered by Rehoboam's refusal to reduce taxation, created two rival states that would never reunite. This division shaped the political and religious history of the region for centuries.",
             "summary": "Solomon's kingdom splits — a division that shaped the trajectory of biblical history.",
             "evidence_score": 0.70,
             "sources": [
                 {"title": "The Bible Unearthed", "author": "Israel Finkelstein and Neil Asher Silberman",
                  "publication": "Free Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "ashurbanipal-library-nineveh-650bce",
        "title": "Library of Ashurbanipal — The World's First Systematic Library",
        "year": -650, "lat": 36.36, "lng": 43.15,
        "geo_modern": "Nineveh (Mosul), Iraq",
        "geo_era_label": "Neo-Assyrian Empire",
        "category": "cultural", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Cultural history perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "King Ashurbanipal (668-627 BCE) assembled the world's first systematically organized library at Nineveh, collecting over 30,000 cuneiform tablets including the Epic of Gilgamesh, astronomical observations, medical texts, and legal documents. Discovered by Austen Henry Layard in the 1850s, the library preserved Mesopotamian civilization's literary heritage that would otherwise have been lost.",
             "summary": "The first great library — Ashurbanipal's collection preserved Mesopotamian civilization's literary legacy.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Library of Ashurbanipal", "author": "British Museum", "publication": "British Museum Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "fall-nineveh-assyrian-empire-612bce",
        "title": "Fall of Nineveh — Collapse of the Assyrian Empire",
        "year": -612, "lat": 36.36, "lng": 43.15,
        "geo_modern": "Nineveh (Mosul), Iraq",
        "geo_era_label": "Neo-Assyrian Empire",
        "category": "war", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "In 612 BCE, a coalition of Babylonians, Medes, and Scythians besieged and destroyed Nineveh, the capital of the Assyrian Empire. The fall of this feared superpower — which had dominated the Near East for three centuries — was so total that within decades, even the location of Nineveh was forgotten. The Hebrew prophet Nahum celebrated its destruction as divine justice.",
             "summary": "The dramatic collapse of the ancient world's most feared empire.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Fall of Nineveh", "author": "David Stronach and Kim Codella",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "first-coins-lydia-600bce",
        "title": "First Coins Minted in Lydia — The Invention of Money",
        "year": -600, "lat": 38.47, "lng": 28.05,
        "geo_modern": "Sardis (Sart), Turkey",
        "geo_era_label": "Iron Age Anatolia",
        "category": "discovery", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "Around 600 BCE, the kingdom of Lydia in western Anatolia produced the first true coins — stamped pieces of electrum (gold-silver alloy) with guaranteed weight and purity. This innovation, attributed to King Alyattes or Croesus, revolutionized trade by replacing barter and weighed metal with standardized, portable currency. The concept spread rapidly through the Greek world and beyond.",
             "summary": "The birth of coinage — Lydia invents standardized money, transforming commerce forever.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Invention of Coinage and the Monetization of Ancient Greece", "author": "David Schaps",
                  "publication": "University of Michigan Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "nebuchadnezzar-destroys-jerusalem-586bce",
        "title": "Nebuchadnezzar Destroys Jerusalem — Babylonian Captivity Begins",
        "year": -586, "lat": 31.77, "lng": 35.23,
        "geo_modern": "Jerusalem, Israel/Palestine",
        "geo_era_label": "Neo-Babylonian Empire",
        "category": "war", "importance_score": 0.83, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Biblical and archaeological perspective", "culture_code": "il", "viewpoint_type": "academic",
             "narrative": "In 586 BCE, Nebuchadnezzar II of Babylon destroyed Jerusalem and Solomon's Temple, deporting the Judean elite to Babylon. This catastrophe — the Babylonian Exile — transformed Judaism from a temple-based cult to a religion of scripture and synagogue. The exiles compiled and edited much of the Hebrew Bible, creating the textual foundation of Judaism, Christianity, and Islam.",
             "summary": "The destruction that transformed Judaism — exile forges a religion of the book.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "By the Rivers of Babylon", "author": "Bette Lux Booth", "publication": "Academic Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "spring-autumn-period-china-771bce",
        "title": "Spring and Autumn Period Begins — China's Age of Fragmentation",
        "year": -771, "lat": 34.75, "lng": 113.65,
        "geo_modern": "Luoyang, Henan, China",
        "geo_era_label": "Eastern Zhou Dynasty",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "When barbarian invasions forced the Zhou court to flee east to Luoyang in 771 BCE, the Spring and Autumn Period began — an era of feudal fragmentation where nominally subordinate states warred among themselves while paying lip service to Zhou authority. This period of chaos ironically produced China's greatest intellectual flowering, as thinkers like Confucius sought philosophical solutions to political disorder.",
             "summary": "Political fragmentation sparks China's greatest intellectual age.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "The Cambridge History of Ancient China", "author": "Michael Loewe and Edward Shaughnessy",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "solon-reforms-athens-594bce",
        "title": "Solon's Reforms in Athens — Seeds of Democracy",
        "year": -594, "lat": 37.97, "lng": 23.72,
        "geo_modern": "Athens, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "political", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Political history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "In 594 BCE, the Athenians appointed Solon as archon to resolve a debt crisis that had left many citizens enslaved to aristocratic creditors. His reforms abolished debt slavery, reorganized social classes by wealth rather than birth, and gave the common assembly judicial powers. While not yet democracy, Solon's reforms planted the seeds that Cleisthenes would harvest a century later.",
             "summary": "The reforms that planted the seeds of Athenian democracy — debt relief and citizen rights.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Solon the Athenian", "author": "Ivan Linforth", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1919}
             ]},
        ],
    },
    {
        "slug": "darius-i-reorganizes-persian-empire-522bce",
        "title": "Darius I Reorganizes the Persian Empire — Satrapies and Royal Road",
        "year": -522, "lat": 29.93, "lng": 52.89,
        "geo_modern": "Persepolis, Iran",
        "geo_era_label": "Achaemenid Empire",
        "category": "political", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Persian history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "After seizing the throne in 522 BCE, Darius I reorganized the Achaemenid Empire into 20 satrapies with standardized taxation, a common currency (the daric), and the Royal Road — a 2,700 km highway from Susa to Sardis with relay stations enabling messages to cross the empire in a week. These administrative innovations made the Persian Empire the most efficiently governed state of the ancient world.",
             "summary": "Administrative genius — the Royal Road, standard currency, and satrapy system.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "The Persian Empire: A Corpus of Sources from the Achaemenid Period", "author": "Amélie Kuhrt",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "pythagoras-school-croton-530bce",
        "title": "Pythagoras Establishes His School at Croton — Mathematics and Philosophy",
        "year": -530, "lat": 39.08, "lng": 17.12,
        "geo_modern": "Crotone, Calabria, Italy",
        "geo_era_label": "Archaic Greece / Magna Graecia",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Around 530 BCE, Pythagoras of Samos established a philosophical and mathematical community at Croton in southern Italy. The Pythagoreans discovered that musical harmonies correspond to mathematical ratios, proved the theorem bearing his name, and advanced the radical idea that the universe is fundamentally mathematical — a concept that remains central to modern physics.",
             "summary": "The philosopher who believed the universe is made of numbers — mathematics meets mysticism.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "Pythagoras: His Life, Teaching, and Influence", "author": "Christoph Riedweg",
                  "publication": "Cornell University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "mahavira-jainism-founded-527bce",
        "title": "Mahavira Establishes Jainism — The Path of Non-Violence",
        "year": -527, "lat": 25.61, "lng": 85.14,
        "geo_modern": "Patna (Vaishali), Bihar, India",
        "geo_era_label": "Late Vedic Period",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Vardhamana Mahavira, a contemporary of the Buddha, achieved spiritual liberation around 527 BCE and established Jainism based on the principles of ahimsa (non-violence), truthfulness, and asceticism. Jain philosophy's emphasis on non-violence deeply influenced Indian culture and later inspired Mahatma Gandhi's movement for Indian independence.",
             "summary": "The establishment of Jainism — radical non-violence that later inspired Gandhi.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "The Jains", "author": "Paul Dundas", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "draco-law-code-athens-621bce",
        "title": "Draco's Law Code in Athens — First Written Laws of Greece",
        "year": -621, "lat": 37.97, "lng": 23.72,
        "geo_modern": "Athens, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "political", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Legal history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "In 621 BCE, Draco codified Athenian law for the first time, replacing aristocratic oral tradition with written statutes visible to all citizens. While infamous for their severity (the death penalty for trivial offenses gave us the word 'draconian'), the mere act of writing laws down was revolutionary — it subjected the powerful to the same publicly known rules as ordinary citizens.",
             "summary": "Athens' first written law code — 'draconian' severity but a milestone in legal transparency.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Laws of Ancient Athens", "author": "Michael Gagarin", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "etruscans-dominate-central-italy-750bce",
        "title": "Etruscan Civilization Flourishes — Pre-Roman Italy",
        "year": -750, "lat": 42.73, "lng": 11.78,
        "geo_modern": "Tarquinia, Lazio, Italy",
        "geo_era_label": "Iron Age Italy",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "The Etruscans created Italy's most sophisticated pre-Roman civilization, flourishing from around 750 BCE. Their cities in Tuscany and Lazio featured advanced engineering, elaborate painted tombs, and extensive Mediterranean trade networks. Etruscan innovations in urban planning, religious practices (especially divination), and political institutions were directly absorbed by early Rome.",
             "summary": "Italy's pre-Roman civilization — the Etruscans shaped Rome before Rome shaped the world.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Etruscans", "author": "Graeme Barker and Tom Rasmussen", "publication": "Blackwell",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "persepolis-construction-begins-515bce",
        "title": "Construction of Persepolis — Ceremonial Capital of the Persian Empire",
        "year": -515, "lat": 29.93, "lng": 52.89,
        "geo_modern": "Persepolis, Fars, Iran",
        "geo_era_label": "Achaemenid Empire",
        "category": "cultural", "importance_score": 0.76, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Persian history perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Darius I began construction of Persepolis around 515 BCE as the ceremonial capital of the Achaemenid Empire. The massive palace complex featured the Apadana audience hall, Gate of All Nations, and relief sculptures depicting representatives of all 23 subject peoples bringing tribute — a visual statement of Persian universalism and multicultural governance. Its destruction by Alexander in 330 BCE marked the end of Achaemenid civilization.",
             "summary": "The Achaemenid Empire's ceremonial capital — a monument to multicultural governance.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Persepolis: The Archaeology of Parsa", "author": "Donald N. Wilber",
                  "publication": "Darwin Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "phoenician-circumnavigation-africa-600bce",
        "title": "Phoenician Sailors Circumnavigate Africa for Pharaoh Necho II",
        "year": -600, "lat": 34.44, "lng": 35.84,
        "geo_modern": "Tyre, Lebanon / via Africa",
        "geo_era_label": "Iron Age Mediterranean",
        "category": "discovery", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Maritime history perspective", "culture_code": "lb", "viewpoint_type": "academic",
             "narrative": "According to Herodotus, Phoenician sailors commissioned by Egyptian pharaoh Necho II circumnavigated Africa around 600 BCE — over 2,000 years before Vasco da Gama. The voyage reportedly took three years, with the crew stopping to plant and harvest grain. Herodotus reported their claim that the sun was on their right (north) when sailing westward — actually evidence of their southern hemisphere passage, though Herodotus himself doubted it.",
             "summary": "A claimed circumnavigation of Africa 2,000 years before the Age of Exploration.",
             "evidence_score": 0.58,
             "sources": [
                 {"title": "The Histories", "author": "Herodotus (trans. Robin Waterfield)", "publication": "Oxford World's Classics",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": -440}
             ]},
        ],
    },
    {
        "slug": "hanging-gardens-babylon-600bce",
        "title": "Hanging Gardens of Babylon — Wonder of the Ancient World",
        "year": -600, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Hillah, Iraq (ancient Babylon)",
        "geo_era_label": "Neo-Babylonian Empire",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Hanging Gardens, traditionally attributed to Nebuchadnezzar II around 600 BCE, were one of the Seven Wonders of the Ancient World — yet they remain the most mysterious, as no definitive archaeological evidence has been found at Babylon. Stephanie Dalley has argued the gardens were actually at Nineveh, built by Sennacherib. Whether at Babylon or Nineveh, they represent the ancient world's most ambitious horticultural engineering.",
             "summary": "The most mysterious of the Seven Wonders — possibly at Babylon, possibly at Nineveh.",
             "evidence_score": 0.55,
             "sources": [
                 {"title": "The Mystery of the Hanging Garden of Babylon", "author": "Stephanie Dalley",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "behistun-inscription-darius-520bce",
        "title": "Behistun Inscription — Darius I's Monumental Proclamation",
        "year": -520, "lat": 34.39, "lng": 47.44,
        "geo_modern": "Behistun, Kermanshah, Iran",
        "geo_era_label": "Achaemenid Empire",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Epigraphy perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Around 520 BCE, Darius I carved a massive trilingual inscription into a cliff face at Behistun, recording his victory over rebellious pretenders in Old Persian, Elamite, and Babylonian cuneiform. Like the Rosetta Stone for Egyptian hieroglyphics, the Behistun Inscription became the key to deciphering cuneiform, unlocking thousands of years of Mesopotamian history when Henry Rawlinson copied it in the 1830s-40s.",
             "summary": "The Rosetta Stone of cuneiform — the key that unlocked Mesopotamian civilization.",
             "evidence_score": 0.86,
             "sources": [
                 {"title": "The Bisitun Inscription of Darius the Great", "author": "Rüdiger Schmitt",
                  "publication": "Corpus Inscriptionum Iranicarum", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "spartan-reforms-lycurgus-700bce",
        "title": "Spartan Reforms of Lycurgus — Creation of the Warrior State",
        "year": -700, "lat": 37.08, "lng": 22.43,
        "geo_modern": "Sparta, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Greek history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Around 700 BCE (the date is contested), the legendary lawgiver Lycurgus is said to have created Sparta's unique social system — the agoge military training from age 7, communal messes, land redistribution, and iron currency to discourage wealth. Whether Lycurgus was historical or mythical, the reforms produced the ancient world's most formidable military machine and a society admired and feared in equal measure.",
             "summary": "The creation of Sparta's warrior society — history's most rigorous military culture.",
             "evidence_score": 0.66,
             "sources": [
                 {"title": "Sparta and Lakonia: A Regional History 1300-362 BC", "author": "Paul Cartledge",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "hittite-sack-babylon-1595bce",
        "title": "Hittite Sack of Babylon Under Mursili I",
        "year": -1595, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Hillah, Iraq (ancient Babylon)",
        "geo_era_label": "Old Babylonian Period",
        "category": "war", "importance_score": 0.72, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "In 1595 BCE, the Hittite king Mursili I launched a daring long-distance raid that sacked Babylon, ending the Amorite dynasty founded by Hammurabi. This audacious campaign — over 1,000 km from Hattusa — demonstrated Hittite military prowess and reshuffled Near Eastern power dynamics, allowing the Kassites to take control of Babylonia for the next four centuries.",
             "summary": "A bold Hittite raid that toppled Babylon's dynasty and reshaped the ancient Near East.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Kingdom of the Hittites", "author": "Trevor Bryce", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "iron-age-begins-near-east-1200bce",
        "title": "Iron Age Begins in the Near East — The New Metal Transforms Warfare",
        "year": -1200, "lat": 39.93, "lng": 32.86,
        "geo_modern": "Anatolia / Eastern Mediterranean",
        "geo_era_label": "Early Iron Age",
        "category": "discovery", "importance_score": 0.78, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "int", "viewpoint_type": "academic",
             "narrative": "The transition from bronze to iron technology accelerated around 1200 BCE, partly driven by the Bronze Age Collapse disrupting tin trade routes essential for bronze production. Iron ore was far more abundant than copper and tin, democratizing access to metal tools and weapons. The Hittites had guarded iron-smelting technology, but its spread after their empire's fall enabled new military and agricultural capabilities across the Near East.",
             "summary": "The metal that changed everything — iron democratizes warfare and agriculture.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Coming of the Age of Iron", "author": "Theodore Wertime and James Muhly",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1980}
             ]},
        ],
    },
    {
        "slug": "kingdom-kush-rises-1070bce",
        "title": "Rise of the Kingdom of Kush — Nubian Power on the Nile",
        "year": -1070, "lat": 18.54, "lng": 31.82,
        "geo_modern": "Napata (Karima), Sudan",
        "geo_era_label": "Iron Age Nubia",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "African history perspective", "culture_code": "sd", "viewpoint_type": "academic",
             "narrative": "As Egypt's New Kingdom declined around 1070 BCE, the Kushite kingdom centered at Napata grew in power along the upper Nile. The Kushites built pyramids, worshipped Amun, and maintained Egyptian cultural traditions even as Egypt itself fractured. By the 8th century BCE, the Kushite pharaohs of the 25th Dynasty would rule Egypt itself, making them one of Africa's most powerful pre-modern states.",
             "summary": "A powerful Nubian kingdom that preserved and eventually ruled Egyptian civilization.",
             "evidence_score": 0.76,
             "sources": [
                 {"title": "The Kingdom of Kush", "author": "Derek Welsby", "publication": "British Museum Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "battle-qarqar-853bce",
        "title": "Battle of Qarqar — First Major Coalition Battle in History",
        "year": -853, "lat": 35.27, "lng": 36.39,
        "geo_modern": "Tell Qarqur, Syria",
        "geo_era_label": "Neo-Assyrian Empire",
        "category": "war", "importance_score": 0.68, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "sy", "viewpoint_type": "academic",
             "narrative": "In 853 BCE, Shalmaneser III of Assyria fought a coalition of twelve kings at Qarqar in Syria — one of the largest battles of the ancient world. The coalition, led by King Hadadezer of Damascus and including King Ahab of Israel (who reportedly contributed 2,000 chariots), halted the Assyrian advance for over a decade. It is the first extra-biblical reference to an Israelite king.",
             "summary": "A massive coalition halts Assyrian expansion — the first great allied military campaign.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "The Campaigns of Shalmaneser III", "author": "A. Kirk Grayson",
                  "publication": "Royal Inscriptions of Mesopotamia Project", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "kushite-pharaohs-25th-dynasty-747bce",
        "title": "Kushite Pharaohs Rule Egypt — The 25th Dynasty",
        "year": -747, "lat": 15.57, "lng": 32.53,
        "geo_modern": "Khartoum, Sudan / Thebes, Egypt",
        "geo_era_label": "Third Intermediate Period",
        "category": "political", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "African history perspective", "culture_code": "sd", "viewpoint_type": "academic",
             "narrative": "From 747 to 656 BCE, Kushite kings from Nubia (modern Sudan) ruled all of Egypt as the 25th Dynasty. Pharaoh Piye conquered Egypt and his successors Shabaka and Taharqa restored temples, revived archaic religious practices, and built extensively at Karnak. The Kushite dynasty represents one of the most remarkable chapters in African history — Nubian rulers governing the civilization that had once dominated them.",
             "summary": "Nubian kings conquer and revitalize Egypt — one of Africa's most remarkable reversals.",
             "evidence_score": 0.80,
             "sources": [
                 {"title": "Ancient Nubia: African Kingdoms on the Nile", "author": "Marjorie Fisher et al.",
                  "publication": "American University in Cairo Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "sappho-lyric-poetry-600bce",
        "title": "Sappho of Lesbos — Greatest Lyric Poet of Antiquity",
        "year": -600, "lat": 39.17, "lng": 26.33,
        "geo_modern": "Mytilene, Lesbos, Greece",
        "geo_era_label": "Archaic Greece",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Literary history perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Sappho, active around 600 BCE on the island of Lesbos, was called 'the tenth Muse' by Plato. Her intensely personal lyric poetry — expressing love, desire, and loss — broke from the heroic tradition of Homer to create an entirely new mode of literary expression. Though only fragments survive (often preserved on Egyptian papyri), her influence on Western poetry is immeasurable.",
             "summary": "The 'tenth Muse' — Sappho invents the personal lyric and transforms Western poetry.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Sappho: A New Translation of the Complete Works", "author": "Diane Rayor",
                  "publication": "Cambridge University Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "neo-babylonian-empire-nebuchadnezzar-605bce",
        "title": "Neo-Babylonian Empire Under Nebuchadnezzar II — Babylon's Golden Age",
        "year": -605, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Hillah, Iraq (ancient Babylon)",
        "geo_era_label": "Neo-Babylonian Empire",
        "category": "political", "importance_score": 0.78, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Near East perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Nebuchadnezzar II (605-562 BCE) transformed Babylon into the greatest city of the ancient world. He built the Ishtar Gate, the Processional Way, and possibly the Hanging Gardens. His empire stretched from Egypt's borders to the Persian Gulf. Yet his destruction of Jerusalem and the Temple in 586 BCE made him a figure of infamy in Jewish and Christian tradition.",
             "summary": "Babylon's greatest king — builder of wonders and destroyer of Jerusalem.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Nebuchadnezzar II, King of Babylon", "author": "Rocío Da Riva",
                  "publication": "De Gruyter", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "ishtar-gate-babylon-constructed-575bce",
        "title": "Ishtar Gate of Babylon — Masterpiece of Ancient Architecture",
        "year": -575, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Hillah, Iraq (ancient Babylon)",
        "geo_era_label": "Neo-Babylonian Empire",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Art history perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Ishtar Gate, constructed around 575 BCE by Nebuchadnezzar II, was the eighth gate to the inner city of Babylon. Decorated with brilliant blue glazed bricks featuring rows of dragons (mushussu) and aurochs, it was one of the most spectacular structures of the ancient world. Excavated by Robert Koldewey in 1902, a reconstruction stands in Berlin's Pergamon Museum.",
             "summary": "Babylon's magnificent blue gate — ancient art that still dazzles in Berlin.",
             "evidence_score": 0.84,
             "sources": [
                 {"title": "Babylon: City of Wonders", "author": "Irving Finkel and Michael Seymour",
                  "publication": "British Museum Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "sun-tzu-art-of-war-500bce",
        "title": "Sun Tzu Writes The Art of War — Classic of Military Strategy",
        "year": -500, "lat": 31.30, "lng": 120.62,
        "geo_modern": "Suzhou, Jiangsu, China",
        "geo_era_label": "Spring and Autumn Period",
        "category": "cultural", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Military philosophy perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Sun Tzu's Art of War, composed around 500 BCE during the Spring and Autumn Period, is the world's oldest and most influential military treatise. Its 13 chapters on strategy, tactics, and intelligence have been studied by military commanders from Napoleon to modern generals, and its principles of indirect approach, deception, and winning without fighting have been applied to business, diplomacy, and competitive strategy worldwide.",
             "summary": "The most influential military text ever written — strategy that transcends warfare.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Art of War (Translated and Annotated)", "author": "Sun Tzu (trans. Samuel Griffith)",
                  "publication": "Oxford University Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1963}
             ]},
        ],
    },
    {
        "slug": "nok-culture-west-africa-500bce",
        "title": "Nok Culture — West Africa's Earliest Known Civilization",
        "year": -500, "lat": 9.67, "lng": 8.00,
        "geo_modern": "Jos Plateau, Nigeria",
        "geo_era_label": "Iron Age West Africa",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "African archaeology perspective", "culture_code": "ng", "viewpoint_type": "academic",
             "narrative": "The Nok culture, flourishing from around 500 BCE to 200 CE on the Jos Plateau of central Nigeria, produced the earliest known figurative sculpture in sub-Saharan Africa — distinctive terracotta heads and figures with elaborate hairstyles and pierced eyes. The Nok people were among the earliest iron smelters in West Africa, possibly developing the technology independently rather than receiving it from the Near East.",
             "summary": "Sub-Saharan Africa's earliest sculptural tradition — terracotta art and early iron smelting.",
             "evidence_score": 0.72,
             "sources": [
                 {"title": "Nok: African Sculpture in Archaeological Context", "author": "Peter Breunig",
                  "publication": "Africa Magna Verlag", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "monte-alban-zapotecs-500bce",
        "title": "Monte Albán Founded by Zapotecs — Oaxaca's First City",
        "year": -500, "lat": 17.04, "lng": -96.77,
        "geo_modern": "Oaxaca, Mexico",
        "geo_era_label": "Preclassic Mesoamerica",
        "category": "cultural", "importance_score": 0.70, "zoom_min": 4, "is_bce": True,
        "perspectives": [
            {"label": "Mesoamerican archaeology perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "Monte Albán, founded around 500 BCE atop an artificially flattened mountain in the Valley of Oaxaca, became one of Mesoamerica's first true cities. The Zapotec capital featured monumental plazas, a writing system (among the earliest in the Americas), astronomical observatories, and the enigmatic Danzantes stone carvings. It thrived as a major center for over a millennium.",
             "summary": "One of Mesoamerica's first cities — Zapotec writing, astronomy, and monumental architecture.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "Monte Albán", "author": "Joyce Marcus and Kent Flannery",
                  "publication": "Academic Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "celtic-expansion-europe-500bce",
        "title": "Celtic Expansion Across Europe — La Tène Culture",
        "year": -500, "lat": 47.00, "lng": 6.98,
        "geo_modern": "La Tène, Switzerland / Central Europe",
        "geo_era_label": "Iron Age Europe",
        "category": "cultural", "importance_score": 0.72, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "European archaeology perspective", "culture_code": "ch", "viewpoint_type": "academic",
             "narrative": "Around 500 BCE, the La Tène culture emerged in central Europe, marking the height of Celtic civilization. Celtic peoples expanded from their central European homeland to dominate territory from Ireland to Turkey, spreading their distinctive art style, ironworking technology, and warrior culture. Greek and Roman writers described them as fierce, eloquent, and fond of feasting — both admiring and fearing their military prowess.",
             "summary": "Celtic civilization at its peak — fierce warriors, brilliant artists, masters of iron.",
             "evidence_score": 0.78,
             "sources": [
                 {"title": "The Ancient Celts", "author": "Barry Cunliffe", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "panini-sanskrit-grammar-500bce",
        "title": "Panini Composes Sanskrit Grammar — The Ashtadhyayi",
        "year": -500, "lat": 34.15, "lng": 71.77,
        "geo_modern": "Gandhara (Peshawar region), Pakistan",
        "geo_era_label": "Late Vedic Period",
        "category": "cultural", "importance_score": 0.74, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic history perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Panini's Ashtadhyayi (c. 500 BCE) is the earliest known formal grammar of any language — a system of 3,959 rules that described Sanskrit with a precision and completeness not matched in Western linguistics until the 20th century. His use of meta-rules, recursion, and formal notation anticipated modern computer science and generative grammar by over two millennia.",
             "summary": "The world's first formal grammar — a linguistic achievement that anticipated computer science.",
             "evidence_score": 0.82,
             "sources": [
                 {"title": "Panini: His Work and Its Traditions", "author": "George Cardona",
                  "publication": "Motilal Banarsidass", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting Bronze Age + early classical enrichment seed — {len(EVENTS)} events")

    # Pre-load all existing titles for duplicate checking
    existing_titles = set()
    rows = await conn.fetch("SELECT title FROM events")
    for row in rows:
        existing_titles.add(row["title"])

    inserted = 0
    skipped = 0

    for event in EVENTS:
        year = event["year"]
        is_bce = event.get("is_bce", False)
        abs_year = abs(year)
        if abs_year > 4712:
            abs_year = 4712

        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        slug = event["slug"]

        # Skip by slug
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  [skip] {slug} (slug exists)")
            skipped += 1
            continue

        # Skip by title
        if event["title"] in existing_titles:
            print(f"  [skip] {slug} (title exists)")
            skipped += 1
            continue

        lat, lng = event.get("lat"), event.get("lng")
        geo_wkt = f"SRID=4326;POINT({lng} {lat})" if lat is not None and lng is not None else None

        content = json.dumps({k: v for k, v in event.items() if k != "perspectives"}, sort_keys=True)
        content_hash = sha256_str(content)

        insert_sql = f"""
            INSERT INTO events (
                slug, title, date_earliest, date_latest, year_approx, is_bce,
                geo_point, geo_modern, geo_era_label,
                importance_score, zoom_min, event_category,
                review_status, created_by, content_hash
            ) VALUES (
                $1, $2, {date_e_lit}, {date_l_lit}, $3, $4,
                ST_GeomFromEWKT($5), $6, $7,
                $8, $9, $10,
                'approved', $11, $12
            ) RETURNING id
            """
        event_id = await conn.fetchval(
            insert_sql,
            slug, event["title"], year, is_bce,
            geo_wkt, event.get("geo_modern"), event.get("geo_era_label"),
            event.get("importance_score", 0.5), event.get("zoom_min", 3), event.get("category"),
            CREATED_BY, content_hash,
        )

        for persp in event.get("perspectives", []):
            persp_id = await conn.fetchval(
                """
                INSERT INTO perspectives (
                    event_id, label, culture_code, viewpoint_type,
                    narrative, summary, evidence_score, created_by
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                """,
                event_id,
                persp["label"],
                persp.get("culture_code"),
                persp.get("viewpoint_type"),
                persp["narrative"],
                persp.get("summary"),
                persp.get("evidence_score"),
                CREATED_BY,
            )

            for src in persp.get("sources", []):
                src_year = src.get("year")
                pub_date_lit = "NULL"
                if src_year:
                    abs_sy = abs(src_year)
                    if abs_sy > 4712:
                        abs_sy = 4712
                    if src_year < 0:
                        pub_date_lit = f"'{abs_sy:04d}-01-01 BC'::date"
                    else:
                        pub_date_lit = f"'{abs_sy:04d}-01-01'::date"

                src_hash = sha256_str(json.dumps(src, sort_keys=True) + str(persp_id))

                src_sql = f"""
                    INSERT INTO sources (
                        perspective_id, title, author, publication, publication_date,
                        source_type, reliability_tier, peer_reviewed, quote, content_hash
                    ) VALUES ($1, $2, $3, $4, {pub_date_lit}, $5, $6, $7, $8, $9)
                    ON CONFLICT (content_hash) DO NOTHING
                    """
                await conn.execute(
                    src_sql,
                    persp_id,
                    src["title"],
                    src.get("author"),
                    src.get("publication"),
                    src["source_type"],
                    src.get("reliability_tier", 2),
                    src.get("peer_reviewed", False),
                    src.get("quote"),
                    src_hash,
                )

        await conn.execute(
            """
            INSERT INTO edit_log (entity_type, entity_id, action, actor_id, actor_type, reason)
            VALUES ('event', $1, 'create', $2, 'ai', 'Bronze Age + early classical enrichment seed')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    era = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN -2000 AND -500")
    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ Enrichment complete — inserted {inserted}, skipped {skipped}")
    print(f"   Bronze Age + early classical events (-2000 to -500): {era}")
    print(f"   Total approved:      {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
