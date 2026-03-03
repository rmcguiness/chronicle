#!/usr/bin/env python3
"""
Chronicle seed script — 500 real historical events spanning 3000 BCE to 2000 CE.

Run from backend/ directory:
    python scripts/seed_events.py

Requires a running PostgreSQL with the schema already applied (alembic upgrade head).
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
import sys
from datetime import date
from typing import Any

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
# Strip SQLAlchemy prefix for asyncpg
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:v1"

# ─────────────────────────────────────────────────────────────────────────────
# EVENT DATA — 500 historical events
# Format: {slug, title, year, lat, lng, geo_modern, geo_era_label, category,
#          importance_score, zoom_min, is_bce, perspectives: [{label, culture_code,
#          viewpoint_type, narrative, summary, evidence_score, sources: [{...}]}]}
# ─────────────────────────────────────────────────────────────────────────────

EVENTS: list[dict[str, Any]] = [

    # ═══════════════════════════════════════════════════════════════════════
    # ANCIENT WORLD (3000 BCE – 500 CE)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "construction-great-pyramid-giza",
        "title": "Construction of the Great Pyramid of Giza",
        "year": -2560, "lat": 29.9792, "lng": 31.1342,
        "geo_modern": "Giza, Egypt", "geo_era_label": "Old Kingdom Egypt",
        "category": "cultural", "importance_score": 0.95, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Ancient Egyptian royal perspective", "culture_code": "eg", "viewpoint_type": "religious",
             "narrative": "Pharaoh Khufu commissioned the Great Pyramid as a monument ensuring his divine passage into the afterlife. Employing tens of thousands of skilled laborers—not slaves—the pyramid represents the apex of Egyptian architectural mastery and religious devotion.",
             "summary": "Egyptian royal tomb built to guarantee the Pharaoh's immortality.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Oxford History of Ancient Egypt", "author": "Ian Shaw", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000},
                 {"title": "Workers' graffiti in the relieving chambers", "source_type": "primary", "reliability_tier": 1, "year": -2560}
             ]},
            {"label": "Modern archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Archaeological evidence demonstrates that pyramid builders were paid Egyptian workers, not slaves. Zahi Hawass's excavations uncovered worker villages, hospitals, and administrative records showing organized labor.",
             "summary": "Built by skilled workers, not slaves, over approximately 20 years.", "evidence_score": 0.91,
             "sources": [
                 {"title": "The Pyramid Builders of Ancient Egypt", "author": "Rosalie David", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "hammurabi-code-babylon",
        "title": "Code of Hammurabi Proclaimed",
        "year": -1754, "lat": 32.5411, "lng": 44.4211,
        "geo_modern": "Babylon, Iraq", "geo_era_label": "Babylonian Empire",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Babylonian royal perspective", "culture_code": "iq-babylon", "viewpoint_type": "religious",
             "narrative": "King Hammurabi, divinely appointed by the sun-god Shamash, proclaimed 282 laws to bring justice and order to Babylon, setting uniform standards for commerce, property, and punishment across the empire.",
             "summary": "Divine royal edict establishing uniform law across the Babylonian empire.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Code of Hammurabi (stele, Louvre Museum)", "source_type": "primary", "reliability_tier": 1, "year": -1754},
                 {"title": "Hammurabi's Laws: For His City", "author": "M.E.J. Richardson", "publication": "Sheffield Academic Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
            {"label": "Modern legal history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Code of Hammurabi is among the oldest deciphered writings of significant length. Its 'eye for an eye' principle and differentiated punishments by social class reflect a complex social hierarchy rather than universal justice.",
             "summary": "One of the earliest codified legal systems, reflecting class-based Babylonian society.", "evidence_score": 0.93,
             "sources": [
                 {"title": "Ancient Laws and Modern Problems", "author": "John Robb", "publication": "Intellect Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "trojan-war",
        "title": "Trojan War",
        "year": -1200, "lat": 39.9575, "lng": 26.2387,
        "geo_modern": "Hisarlik, Turkey", "geo_era_label": "Bronze Age Aegean",
        "category": "war", "importance_score": 0.80, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Greek literary tradition", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Homer's Iliad recounts the ten-year siege of Troy by Greek forces under Agamemnon, sparked by the abduction of Helen. The war ends with the stratagem of the Trojan Horse, Greek heroes triumphing through divine favor and valor.",
             "summary": "Greek heroes besiege Troy to recover Helen, ending the Bronze Age heroic era.", "evidence_score": 0.72,
             "sources": [
                 {"title": "Iliad", "author": "Homer", "publication": "Penguin Classics", "source_type": "primary", "reliability_tier": 2, "year": -750},
                 {"title": "The Trojan War: A New History", "author": "Barry Strauss", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
            {"label": "Trojan/Anatolian perspective", "culture_code": "tr", "viewpoint_type": "indigenous",
             "narrative": "Hittite documents mention a kingdom Wilusa (likely Troy) in diplomatic correspondence, suggesting Trojan conflict was part of broader Bronze Age power struggles in Anatolia. The 'war' may have been multiple raids over generations.",
             "summary": "Bronze Age conflict rooted in trade rivalries and regional power politics, not purely heroic legend.", "evidence_score": 0.68,
             "sources": [
                 {"title": "Hittite Diplomatic Texts", "author": "Gary Beckman", "publication": "Scholars Press",
                  "source_type": "primary", "reliability_tier": 2, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "battle-thermopylae-480bce",
        "title": "Battle of Thermopylae",
        "year": -480, "lat": 38.7927, "lng": 22.5354,
        "geo_modern": "Thermopylae, Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance_score": 0.87, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Greek (Spartan) perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Three hundred Spartans under King Leonidas held the narrow pass at Thermopylae against a vast Persian army for three days. Their sacrifice bought time for Greece to prepare, becoming the defining symbol of courage against overwhelming odds.",
             "summary": "Spartan heroic last stand defending Greek freedom against Persian tyranny.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Histories, Book VII", "author": "Herodotus", "source_type": "primary", "reliability_tier": 2, "year": -440},
                 {"title": "Thermopylae: The Battle That Changed the World", "author": "Paul Cartledge",
                  "publication": "Overlook Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
            {"label": "Persian perspective", "culture_code": "ir", "viewpoint_type": "nationalist",
             "narrative": "Xerxes' army, representing the largest empire in the world, faced organized but ultimately futile resistance. The campaign was a legitimate imperial expansion, and Thermopylae was a minor tactical delay in the eventual conquest of Athens.",
             "summary": "A costly but ultimately surmounted obstacle in Persia's westward imperial expansion.", "evidence_score": 0.65,
             "sources": [
                 {"title": "The Persian Empire: A Corpus of Sources", "author": "Amélie Kuhrt",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "alexander-conquests-334bce",
        "title": "Alexander the Great's Conquests Begin",
        "year": -334, "lat": 40.7853, "lng": 29.9379,
        "geo_modern": "Dardanelles, Turkey", "geo_era_label": "Macedonian Empire",
        "category": "war", "importance_score": 0.93, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Macedonian/Greek perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Alexander III of Macedon crossed into Asia Minor in 334 BCE, beginning a decade-long campaign that destroyed the Persian Empire, spread Greek culture from Egypt to India, and created the largest empire the ancient world had seen.",
             "summary": "Greek military genius spreads Hellenistic civilization across Asia.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Anabasis Alexandri", "author": "Arrian", "source_type": "secondary", "reliability_tier": 2, "year": 130},
                 {"title": "Alexander the Great", "author": "Robin Lane Fox", "publication": "Dial Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1973}
             ]},
            {"label": "Persian/Achaemenid perspective", "culture_code": "ir", "viewpoint_type": "nationalist",
             "narrative": "The Macedonian invasion destroyed a sophisticated multicultural empire. Persian accounts emphasize the burning of Persepolis as an act of barbarism. Local peoples often welcomed Alexander initially, only to face Macedonian garrisons and taxation.",
             "summary": "Destruction of the Achaemenid Empire and imposition of Macedonian rule on diverse peoples.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Achaemenid History", "author": "Heleen Sancisi-Weerdenburg", "publication": "NINO",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}
             ]},
            {"label": "Indian/South Asian perspective", "culture_code": "in", "viewpoint_type": "indigenous",
             "narrative": "Alexander's invasion of the Indian subcontinent (326 BCE) was eventually repulsed by his own army's refusal to advance further. Indian texts rarely mention Alexander, suggesting his impact was less transformative in the subcontinent than in Western historiography.",
             "summary": "Brief incursion into the northwestern subcontinent, largely repulsed by Indian resistance and army mutiny.", "evidence_score": 0.71,
             "sources": [
                 {"title": "History of India", "author": "A.L. Basham", "publication": "Macmillan",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1954}
             ]},
        ],
    },
    {
        "slug": "punic-wars-rome-carthage",
        "title": "First Punic War — Rome vs. Carthage",
        "year": -264, "lat": 37.0, "lng": 12.0,
        "geo_modern": "Sicily and Mediterranean", "geo_era_label": "Roman Republic",
        "category": "war", "importance_score": 0.82, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Roman perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "Rome's first overseas war, fought to control Sicily, demonstrated Roman military adaptability. Rome built a navy from scratch and ultimately defeated the greatest maritime power of the day, establishing the pattern for eventual Mediterranean dominance.",
             "summary": "Rome's first step toward Mediterranean empire through naval innovation.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Histories, Books I-III", "author": "Polybius", "source_type": "primary", "reliability_tier": 2, "year": -150},
             ]},
            {"label": "Carthaginian perspective", "culture_code": "tn", "viewpoint_type": "nationalist",
             "narrative": "Carthage, the dominant maritime and commercial power of the western Mediterranean, faced Roman encroachment into its Sicilian sphere of influence. Carthaginian sources are largely lost; the Roman narrative dominates history as written by victors.",
             "summary": "Carthaginian commercial empire confronted by an ambitious new rival; Carthaginian voices largely silenced by history.", "evidence_score": 0.65,
             "sources": [
                 {"title": "Carthage Must Be Destroyed", "author": "Richard Miles", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "assassination-julius-caesar",
        "title": "Assassination of Julius Caesar",
        "year": -44, "lat": 41.8958, "lng": 12.4823,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance_score": 0.91, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Republican (senatorial) perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "Caesar's assassination on the Ides of March was a noble act by defenders of the Republic who feared Caesar was becoming a tyrant. Brutus, Cassius, and over sixty conspirators acted to save Roman freedoms from permanent autocracy.",
             "summary": "A patriotic act to defend the Roman Republic from one-man rule.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Life of Caesar", "author": "Plutarch", "source_type": "primary", "reliability_tier": 2, "year": 100},
                 {"title": "Julius Caesar", "author": "Adrian Goldsworthy", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}
             ]},
            {"label": "Caesarian/popular perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "Caesar was the people's champion, a reformer who had provided grain, land, and dignity to Rome's masses. His murder was an act of senatorial class interest that plunged Rome into civil war and ultimately brought the Empire Caesar himself might have avoided.",
             "summary": "The murder of a popular reformer by self-interested aristocrats, unleashing civil war.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Civil Wars", "author": "Appian", "source_type": "primary", "reliability_tier": 2, "year": 150}
             ]},
        ],
    },
    {
        "slug": "battle-actium-31bce",
        "title": "Battle of Actium — End of the Roman Republic",
        "year": -31, "lat": 38.9535, "lng": 20.7412,
        "geo_modern": "Actium, Greece", "geo_era_label": "Late Roman Republic",
        "category": "war", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Augustan Roman perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "Octavian's decisive naval victory over Mark Antony and Cleopatra at Actium ended the civil wars and began the Pax Romana. Augustus brought peace, prosperity, and stability to an exhausted world after decades of conflict.",
             "summary": "Octavian's victory inaugurates the Roman Empire and 200 years of peace.", "evidence_score": 0.86,
             "sources": [
                 {"title": "Res Gestae Divi Augusti", "author": "Augustus", "source_type": "primary", "reliability_tier": 1, "year": 14},
             ]},
            {"label": "Egyptian/Ptolemaic perspective", "culture_code": "eg", "viewpoint_type": "nationalist",
             "narrative": "For Egypt, Actium meant the end of three centuries of Ptolemaic rule and absorption into Rome as a personal province of the emperor. Cleopatra's death ended the last Hellenistic monarchy; Egypt became a grain-producing colony.",
             "summary": "The conquest of Egypt and end of the last independent Hellenistic kingdom.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Cleopatra: A Life", "author": "Stacy Schiff", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "birth-of-jesus-christ",
        "title": "Birth of Jesus of Nazareth",
        "year": -4, "lat": 31.7044, "lng": 35.2077,
        "geo_modern": "Bethlehem, Palestine", "geo_era_label": "Roman Judea",
        "category": "cultural", "importance_score": 0.95, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Christian theological perspective", "culture_code": "global", "viewpoint_type": "religious",
             "narrative": "Jesus Christ, the Son of God, was born of the Virgin Mary in Bethlehem during the reign of Herod the Great, fulfilling Hebrew prophecy. His birth represents the incarnation of God and the beginning of the Christian era.",
             "summary": "The incarnation of the divine Word, fulfilling Jewish prophecy and inaugurating Christianity.", "evidence_score": 0.72,
             "sources": [
                 {"title": "Gospel of Matthew", "source_type": "primary", "reliability_tier": 2, "year": 80},
                 {"title": "Gospel of Luke", "source_type": "primary", "reliability_tier": 2, "year": 80},
             ]},
            {"label": "Historical-critical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Historical scholarship dates Jesus's birth to between 6-4 BCE (before Herod's death in 4 BCE). The Nativity accounts in Matthew and Luke contain significant differences. The date 'Year 1' was calculated centuries later by Dionysius Exiguus and is generally considered inaccurate.",
             "summary": "A Jewish teacher born in Roman Judea; birth date uncertain, birth narratives legendary in character.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Jesus: An Historical Approximation", "author": "José Antonio Pagola",
                  "publication": "Convivium Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "eruption-vesuvius-pompeii",
        "title": "Eruption of Vesuvius — Pompeii Destroyed",
        "year": 79, "lat": 40.7549, "lng": 14.4956,
        "geo_modern": "Pompeii, Italy", "geo_era_label": "Roman Empire",
        "category": "natural", "importance_score": 0.85, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Roman eyewitness account", "culture_code": "it", "viewpoint_type": "journalistic",
             "narrative": "Pliny the Younger, who witnessed the eruption from Misenum, described a massive cloud of ash and fire, the death of his uncle Pliny the Elder, and the terror of the population as they fled through darkness.",
             "summary": "A catastrophic eruption that preserved Roman civilization under ash.", "evidence_score": 0.93,
             "sources": [
                 {"title": "Letters, Book VI (Letters to Tacitus)", "author": "Pliny the Younger",
                  "source_type": "primary", "reliability_tier": 1, "year": 105},
             ]},
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The eruption of Vesuvius on August 24-25, 79 CE buried Pompeii and Herculaneum under meters of ash and pyroclastic material. Excavations since 1748 have revealed a remarkably preserved snapshot of Roman daily life.",
             "summary": "The volcanic disaster inadvertently preserved the most complete record of Roman daily life.", "evidence_score": 0.97,
             "sources": [
                 {"title": "The Complete Pompeii", "author": "Joanne Berry", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "fall-western-roman-empire-476",
        "title": "Fall of the Western Roman Empire",
        "year": 476, "lat": 45.4654, "lng": 9.1859,
        "geo_modern": "Ravenna, Italy", "geo_era_label": "Western Roman Empire",
        "category": "political", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Roman senatorial perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "The deposition of Romulus Augustulus by the Germanic chieftain Odoacer in 476 CE ended Roman rule in the west. Edward Gibbon later framed this as the end of ancient civilization due to Christianity and barbarian pressures.",
             "summary": "The formal end of Roman imperial rule in Western Europe, marking the beginning of the Middle Ages.", "evidence_score": 0.84,
             "sources": [
                 {"title": "The Decline and Fall of the Roman Empire", "author": "Edward Gibbon",
                  "publication": "Strahan & Cadell", "source_type": "secondary", "reliability_tier": 2, "year": 1776},
             ]},
            {"label": "Germanic/Odoacer perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Odoacer did not see himself as destroying Rome but as its new ruler, governing on behalf of the Eastern Emperor. The 'fall' was a transformation rather than a collapse — Roman institutions, law, and culture persisted.",
             "summary": "A political transition rather than a catastrophic collapse; Roman institutions persisted under Germanic leadership.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Rome and the Barbarians", "author": "Thomas S. Burns", "publication": "Johns Hopkins University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "maurya-empire-chandragupta-322bce",
        "title": "Founding of the Maurya Empire",
        "year": -322, "lat": 25.3478, "lng": 82.9739,
        "geo_modern": "Pataliputra (Patna), India", "geo_era_label": "Maurya Empire",
        "category": "political", "importance_score": 0.87, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Indian historical perspective", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "Chandragupta Maurya, guided by the brilliant minister Kautilya (Chanakya), overthrew the Nanda dynasty and unified northern India. The Maurya Empire became the first pan-Indian empire, stretching from Persia to Bengal.",
             "summary": "First great unified Indian empire, established through strategic genius.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Arthashastra", "author": "Kautilya", "source_type": "primary", "reliability_tier": 2, "year": -321},
                 {"title": "Chandragupta Maurya and His Times", "author": "Radha Kumud Mookerji",
                  "publication": "Motilal Banarsidass", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1943}
             ]},
            {"label": "Greek/Seleucid perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Greek accounts (Megasthenes' Indica) describe Chandragupta's court with admiration. The subsequent Treaty with Seleucus Nicator recognized Mauryan power and facilitated cultural exchange between the Hellenistic and Indian worlds.",
             "summary": "A formidable power that successfully challenged and negotiated with Alexander's successors.", "evidence_score": 0.73,
             "sources": [
                 {"title": "Indica", "author": "Megasthenes", "source_type": "primary", "reliability_tier": 2, "year": -300},
             ]},
        ],
    },
    {
        "slug": "ashoka-edicts-kalinga-war-261bce",
        "title": "Ashoka's Conversion After Kalinga War",
        "year": -261, "lat": 20.4625, "lng": 85.8830,
        "geo_modern": "Kalinga (Odisha), India", "geo_era_label": "Maurya Empire",
        "category": "cultural", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Buddhist perspective", "culture_code": "in", "viewpoint_type": "religious",
             "narrative": "Devastated by the suffering he witnessed in the Kalinga War (an estimated 100,000 killed), Emperor Ashoka converted to Buddhism and renounced military conquest. He spread dharma through rock edicts, established hospitals, and became a model Buddhist monarch.",
             "summary": "A conquering emperor transformed by remorse into history's first advocate of non-violence in governance.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Rock Edicts of Ashoka", "source_type": "primary", "reliability_tier": 1, "year": -260},
                 {"title": "Ashoka and the Decline of the Mauryas", "author": "Romila Thapar",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}
             ]},
            {"label": "Modern political perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Ashoka's edicts represent a remarkable document of ancient statecraft — using moral authority rather than force to govern a vast empire. Historians debate whether his renunciation was genuine or politically strategic.",
             "summary": "A unique experiment in governing by moral example rather than military force.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Emperor Who Gave Up His Empire", "author": "Charles Allen", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "qin-unification-china-221bce",
        "title": "Qin Shi Huang Unifies China",
        "year": -221, "lat": 34.3489, "lng": 108.9398,
        "geo_modern": "Xianyang, Shaanxi, China", "geo_era_label": "Qin Dynasty",
        "category": "political", "importance_score": 0.93, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Imperial Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Qin Shi Huang ended centuries of Warring States chaos, standardized weights and measures, writing, and currency, and built the first Great Wall. He created the administrative template for all subsequent Chinese dynasties.",
             "summary": "The creation of a unified Chinese civilization that endures to this day.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Shiji (Records of the Grand Historian)", "author": "Sima Qian",
                  "source_type": "primary", "reliability_tier": 2, "year": -90},
                 {"title": "The First Emperor: China's Terracotta Army", "author": "Jane Portal",
                  "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
            {"label": "Confucian scholarly perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Qin rule, based on Legalist philosophy, was harsh and despotic. Qin Shi Huang burned books and buried scholars. The dynasty lasted only 15 years after his death, demonstrating that terror alone cannot sustain empire.",
             "summary": "A tyrannical but transformative unification — achieved through force, undone by its own harshness.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Early Chinese Empires: Qin and Han", "author": "Mark Edward Lewis",
                  "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "silk-road-opens-130bce",
        "title": "Opening of the Silk Road",
        "year": -130, "lat": 39.9042, "lng": 116.4074,
        "geo_modern": "Chang'an (Xi'an), China", "geo_era_label": "Han Dynasty",
        "category": "cultural", "importance_score": 0.89, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Han Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Emperor Wu of Han dispatched Zhang Qian westward to forge alliances against the Xiongnu, inadvertently opening trade routes to Central Asia, Persia, and beyond. The Silk Road linked China's silk and porcelain markets with the Roman Empire.",
             "summary": "Chinese diplomatic mission opens the world's first global trade network.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Book of Han", "author": "Ban Gu", "source_type": "primary", "reliability_tier": 2, "year": 111},
             ]},
            {"label": "Central Asian perspective", "culture_code": "uz", "viewpoint_type": "indigenous",
             "narrative": "The peoples of the Fergana Valley, Sogdiana, and Bactria were not passive conduits but active traders and cultural brokers. Sogdian merchants dominated Silk Road commerce for centuries, transmitting religions, technologies, and ideas.",
             "summary": "Central Asian peoples were the true engines of Silk Road commerce and cultural transmission.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Empires of the Silk Road", "author": "Christopher I. Beckwith", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "birth-prophet-muhammad-570",
        "title": "Birth of the Prophet Muhammad",
        "year": 570, "lat": 21.3891, "lng": 39.8579,
        "geo_modern": "Mecca, Saudi Arabia", "geo_era_label": "Arabian Peninsula",
        "category": "cultural", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Islamic perspective", "culture_code": "sa", "viewpoint_type": "religious",
             "narrative": "Muhammad ibn Abdullah was born in Mecca around 570 CE, the final prophet of Islam. His life, teachings, and the Quran he received represent the complete and final revelation of God's word to humanity.",
             "summary": "The birth of the prophet who would found the world's second-largest religion.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Sirat Rasul Allah", "author": "Ibn Ishaq", "source_type": "primary", "reliability_tier": 2, "year": 768},
             ]},
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Muhammad was born into the Quraysh tribe of Mecca. The exact date of his birth is debated (560-570 CE). His life unfolded against the backdrop of tribal Arabia and Byzantine-Sassanid conflicts that shaped early Islam's political geography.",
             "summary": "A historical figure whose teachings unified Arabia and transformed world history.", "evidence_score": 0.77,
             "sources": [
                 {"title": "Muhammad: A Prophet for Our Time", "author": "Karen Armstrong", "publication": "HarperOne",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # MEDIEVAL PERIOD (500–1450 CE)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "islamic-conquests-632-750",
        "title": "Islamic Conquests — Spread of the Caliphate",
        "year": 632, "lat": 21.3891, "lng": 39.8579,
        "geo_modern": "Arabian Peninsula and Middle East", "geo_era_label": "Early Islamic Caliphate",
        "category": "war", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Islamic perspective", "culture_code": "sa", "viewpoint_type": "religious",
             "narrative": "After Muhammad's death in 632, the rightly-guided caliphs expanded Islam by military conquest and peaceful conversion. Within a century, the Islamic world stretched from Spain to Central Asia, spreading a unifying faith, language, and legal system.",
             "summary": "The rapid, divinely-guided spread of Islam creating a new world civilization.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Futuh al-Buldan (Conquests of the Lands)", "author": "al-Baladhuri",
                  "source_type": "primary", "reliability_tier": 2, "year": 870},
             ]},
            {"label": "Byzantine/Christian perspective", "culture_code": "gr", "viewpoint_type": "religious",
             "narrative": "The Arab invasions devastated the Eastern Roman Empire, seizing Syria, Egypt, and North Africa. Christian communities faced forced conversion or dhimmi status. The loss of the Holy Land and North Africa reshaped Christianity's geographic base.",
             "summary": "A devastating military onslaught that permanently reduced Christendom and Byzantine power.", "evidence_score": 0.76,
             "sources": [
                 {"title": "The Great Arab Conquests", "author": "Hugh Kennedy", "publication": "Da Capo Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "battle-tours-732",
        "title": "Battle of Tours (Poitiers) — Charles Martel vs. the Umayyads",
        "year": 732, "lat": 46.5802, "lng": 0.3395,
        "geo_modern": "Poitiers, France", "geo_era_label": "Frankish Kingdom",
        "category": "war", "importance_score": 0.83, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Frankish/Christian perspective", "culture_code": "fr", "viewpoint_type": "religious",
             "narrative": "Charles Martel's victory halted the Umayyad advance into Europe, preserving Christianity and laying the foundations for the Carolingian Empire. Western tradition hails this as one of history's decisive battles.",
             "summary": "The battle that saved Christian Europe from Islamic conquest.", "evidence_score": 0.79,
             "sources": [
                 {"title": "Chronicle of 754", "source_type": "primary", "reliability_tier": 2, "year": 754},
             ]},
            {"label": "Islamic/Umayyad perspective", "culture_code": "sa", "viewpoint_type": "nationalist",
             "narrative": "The Battle of Tours was a military setback but not a decisive turning point for Islamic civilization. The Umayyads were already overstretched logistically. The retreat secured what had already been conquered rather than representing a failed conquest of all of Europe.",
             "summary": "A tactical setback for overextended forces, not a catastrophic defeat for Islamic civilization.", "evidence_score": 0.71,
             "sources": [
                 {"title": "Islam and the Franks", "author": "Richard Fletcher", "publication": "Macmillan",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "charlemagne-coronation-800",
        "title": "Charlemagne Crowned Holy Roman Emperor",
        "year": 800, "lat": 41.9003, "lng": 12.4534,
        "geo_modern": "Rome, Italy", "geo_era_label": "Frankish Empire",
        "category": "political", "importance_score": 0.87, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Papal/Western European perspective", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "Pope Leo III's coronation of Charlemagne on Christmas Day 800 CE restored the idea of a Western Roman Empire under Christian auspices. Charlemagne's rule spread literacy, administrative reform, and Christianity throughout Europe.",
             "summary": "The birth of Western Christendom's political ideal — Christian empire united under pope and emperor.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Life of Charlemagne", "author": "Einhard", "source_type": "primary", "reliability_tier": 2, "year": 830},
             ]},
            {"label": "Byzantine perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Constantinople viewed Charlemagne's coronation as an affront and usurpation of the imperial title, which legitimately belonged to the Byzantine Emperor. The event deepened the schism between Eastern and Western Christianity.",
             "summary": "An illegitimate usurpation of the Roman imperial title that deepened East-West divisions.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Byzantium: The Empire of New Rome", "author": "Cyril Mango", "publication": "Weidenfeld & Nicolson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1980}
             ]},
        ],
    },
    {
        "slug": "viking-raids-begin-793",
        "title": "Viking Raids Begin — Lindisfarne Sacked",
        "year": 793, "lat": 55.6981, "lng": -1.8028,
        "geo_modern": "Lindisfarne, Northumbria, England", "geo_era_label": "Anglo-Saxon England",
        "category": "war", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Anglo-Saxon/Christian perspective", "culture_code": "gb", "viewpoint_type": "religious",
             "narrative": "The Norse attack on Lindisfarne monastery on June 8, 793 was received with horror as divine punishment. Alcuin of York wrote to King Æthelred: 'Never before has such a terror appeared in Britain as we have now suffered from a pagan race.'",
             "summary": "A shocking pagan assault on the heart of Christian learning, beginning the Viking Age.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Letters of Alcuin", "author": "Alcuin of York", "source_type": "primary", "reliability_tier": 1, "year": 793},
                 {"title": "The Anglo-Saxon Chronicle", "source_type": "primary", "reliability_tier": 1, "year": 890}
             ]},
            {"label": "Norse/Scandinavian perspective", "culture_code": "no", "viewpoint_type": "nationalist",
             "narrative": "Norse expansion was driven by population pressure, adventurism, and opportunities for trade and settlement. The raid on Lindisfarne was one of many economic and military ventures that ultimately led to Norse settlement across Europe, Russia, and the North Atlantic.",
             "summary": "The beginning of Scandinavian overseas expansion driven by trade, settlement, and adventure.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Age of the Vikings", "author": "Anders Winroth", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "first-crusade-1095-1099",
        "title": "First Crusade",
        "year": 1095, "lat": 31.7683, "lng": 35.2137,
        "geo_modern": "Jerusalem, Israel/Palestine", "geo_era_label": "Crusader States",
        "category": "war", "importance_score": 0.89, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Western Christian/Crusader perspective", "culture_code": "fr", "viewpoint_type": "religious",
             "narrative": "Pope Urban II's call at Clermont in 1095 launched a holy war to recover Jerusalem from Muslim rule. The Crusaders, marching under the sign of the cross, captured Jerusalem in 1099, fulfilling what they saw as God's will and establishing Christian kingdoms in the Holy Land.",
             "summary": "Christian holy warriors reclaim Jerusalem for Christendom in answer to papal call.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Gesta Dei per Francos", "author": "Guibert of Nogent", "source_type": "primary", "reliability_tier": 2, "year": 1108},
                 {"title": "The Crusades: A History", "author": "Jonathan Riley-Smith", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
            {"label": "Muslim/Arab perspective", "culture_code": "sa", "viewpoint_type": "religious",
             "narrative": "The Crusaders' conquest of Jerusalem involved a massacre of the Muslim and Jewish population. Arab chroniclers recorded it as a catastrophic invasion. The Crusades left a legacy of distrust that shaped Muslim-Christian relations for centuries.",
             "summary": "A violent Western invasion that massacred civilians and disrupted the established order of the Middle East.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Crusades Through Arab Eyes", "author": "Amin Maalouf", "publication": "Al Saqi Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}
             ]},
            {"label": "Jewish perspective", "culture_code": "il", "viewpoint_type": "religious",
             "narrative": "The Crusades were catastrophic for Jewish communities. Crusading armies massacred Jews in the Rhineland (1096) before even reaching the Holy Land. The 'liberation' of Jerusalem saw the Jewish population burned alive in the synagogue.",
             "summary": "The First Crusade launched centuries of intensified persecution of European Jewry.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Hebrew Crusade Chronicles", "source_type": "primary", "reliability_tier": 2, "year": 1150},
             ]},
        ],
    },
    {
        "slug": "magna-carta-1215",
        "title": "Magna Carta Signed",
        "year": 1215, "lat": 51.4417, "lng": -0.5657,
        "geo_modern": "Runnymede, Surrey, England", "geo_era_label": "Plantagenet England",
        "category": "political", "importance_score": 0.90, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "English baronial perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The English barons forced King John to sign the Magna Carta at Runnymede, establishing for the first time that the king was subject to the rule of law. Clauses protecting rights against arbitrary imprisonment became foundations of constitutional governance.",
             "summary": "Barons force the king to acknowledge that even monarchs are subject to law.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Magna Carta (original 1215 text)", "source_type": "primary", "reliability_tier": 1, "year": 1215},
                 {"title": "Magna Carta", "author": "David Carpenter", "publication": "Penguin Classics",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2015}
             ]},
            {"label": "Royal/Papal perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "King John signed Magna Carta under duress and immediately sought papal annulment (granted by Innocent III as 'shameful, demeaning, illegal, and unjust'). The charter was initially seen as a baronial power grab, not a universal rights document.",
             "summary": "A coerced political settlement that was immediately repudiated, only later canonized as a liberty document.", "evidence_score": 0.86,
             "sources": [
                 {"title": "King John", "author": "W.L. Warren", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}
             ]},
        ],
    },
    {
        "slug": "mongol-conquests-1206-1279",
        "title": "Mongol Conquests — Genghis Khan",
        "year": 1206, "lat": 47.9212, "lng": 106.9179,
        "geo_modern": "Mongolia", "geo_era_label": "Mongol Empire",
        "category": "war", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Mongol perspective", "culture_code": "mn", "viewpoint_type": "nationalist",
             "narrative": "Temüjin unified the Mongol tribes and, as Genghis Khan, built the largest contiguous land empire in history through military genius, religious tolerance, and meritocracy. The Mongol empire facilitated the Pax Mongolica—unprecedented trade and cultural exchange.",
             "summary": "The greatest military empire in history, enabling transcontinental trade and cultural diffusion.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Secret History of the Mongols", "source_type": "primary", "reliability_tier": 2, "year": 1240},
                 {"title": "Genghis Khan and the Making of the Modern World", "author": "Jack Weatherford",
                  "publication": "Crown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
            {"label": "Persian/Arab perspective", "culture_code": "ir", "viewpoint_type": "nationalist",
             "narrative": "The Mongol invasion brought catastrophic destruction to the Islamic heartland. Baghdad, the capital of the Abbasid Caliphate, was sacked in 1258 — the libraries burned, thousands massacred. Persian sources document the demographic collapse.",
             "summary": "The most devastating military catastrophe in the history of the Islamic world.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Tarikh-i-Jahan-Gusha", "author": "Ata-Malik Juvayni", "source_type": "primary", "reliability_tier": 2, "year": 1260},
             ]},
        ],
    },
    {
        "slug": "black-death-1347-1351",
        "title": "Black Death Pandemic",
        "year": 1347, "lat": 48.8566, "lng": 2.3522,
        "geo_modern": "Europe and Middle East", "geo_era_label": "Medieval Europe",
        "category": "natural", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "European Christian perspective", "culture_code": "fr", "viewpoint_type": "religious",
             "narrative": "Europeans interpreted the Black Death as divine punishment for humanity's sins. The plague killed 30-60% of Europe's population between 1347-1351, leading to flagellant movements, anti-Semitic pogroms, and profound religious questioning.",
             "summary": "God's judgment that killed a third of Europe, reshaping society, religion, and economy.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Decameron", "author": "Giovanni Boccaccio", "source_type": "primary", "reliability_tier": 2, "year": 1353},
                 {"title": "The Black Death", "author": "Philip Ziegler", "publication": "Collins",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1969}
             ]},
            {"label": "Jewish perspective", "culture_code": "il", "viewpoint_type": "religious",
             "narrative": "Jews were falsely blamed for poisoning wells and spreading the plague, leading to mass massacres across Europe. The persecutions of 1348-1351 destroyed hundreds of Jewish communities and drove Jewish populations eastward to Poland and Lithuania.",
             "summary": "Jewish communities scapegoated and massacred throughout Europe during the pandemic.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Black Death and the Jews", "author": "Joseph Shatzmiller", "publication": "Variorum",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}
             ]},
            {"label": "Medical/epidemiological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Modern DNA analysis confirms the Black Death was caused by Yersinia pestis, originating in Central Asia and spreading via the Silk Road trade routes. The pandemic killed 30-60% of Europe's population and recurred multiple times through the 17th century.",
             "summary": "A catastrophic bacterial pandemic that fundamentally reshaped European demography and society.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Yersinia pestis and the plague pandemic (DNA analysis)", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "battle-of-agincourt-1415",
        "title": "Battle of Agincourt",
        "year": 1415, "lat": 50.4638, "lng": 2.1427,
        "geo_modern": "Agincourt, Pas-de-Calais, France", "geo_era_label": "Hundred Years' War",
        "category": "war", "importance_score": 0.82, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "English perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Henry V's outnumbered English army defeated a vastly superior French force through the devastating effectiveness of the longbow. The battle became a defining moment of English national identity, immortalized by Shakespeare.",
             "summary": "English longbowmen defeat superior French cavalry, defining English military identity.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Gesta Henrici Quinti", "author": "Thomas Elmham", "source_type": "primary", "reliability_tier": 2, "year": 1416},
                 {"title": "Henry V", "author": "William Shakespeare", "source_type": "secondary", "reliability_tier": 3, "year": 1599}
             ]},
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Agincourt represented catastrophic military mismanagement by French nobility. The flower of French chivalry was destroyed not by divine favor but by poor tactical decisions and the massacre of prisoners. France would recover through Joan of Arc.",
             "summary": "A French military disaster caused by poor leadership, not English divine favor.", "evidence_score": 0.81,
             "sources": [
                 {"title": "Agincourt: Henry V and the Battle That Made England", "author": "Juliet Barker",
                  "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "fall-constantinople-1453",
        "title": "Fall of Constantinople",
        "year": 1453, "lat": 41.0082, "lng": 28.9784,
        "geo_modern": "Istanbul, Turkey", "geo_era_label": "Byzantine Empire",
        "category": "war", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Ottoman Turkish perspective", "culture_code": "tr", "viewpoint_type": "nationalist",
             "narrative": "Sultan Mehmed II's conquest of Constantinople fulfilled a centuries-old Islamic aspiration. The city became Istanbul, capital of the Ottoman Empire, center of a new Muslim civilization that would dominate the Middle East, North Africa, and southeastern Europe for 500 years.",
             "summary": "The triumphant fulfillment of Islamic prophecy and foundation of the Ottoman Empire's greatest city.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Tursun Beg, History of Mehmed II", "source_type": "primary", "reliability_tier": 2, "year": 1490},
             ]},
            {"label": "Byzantine/Orthodox Christian perspective", "culture_code": "gr", "viewpoint_type": "religious",
             "narrative": "The fall of Constantinople on May 29, 1453 ended 1,100 years of the Eastern Roman Empire. For Orthodox Christians it was a catastrophe — the great cathedral of Hagia Sophia converted to a mosque, the last Emperor Constantine XI killed defending the walls.",
             "summary": "The end of the Roman Empire and greatest catastrophe in Orthodox Christianity's history.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Fall of Constantinople 1453", "author": "Steven Runciman", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1965}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # RENAISSANCE & AGE OF EXPLORATION (1450–1750)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "gutenberg-printing-press-1440",
        "title": "Gutenberg's Printing Press",
        "year": 1440, "lat": 49.9929, "lng": 8.2473,
        "geo_modern": "Mainz, Germany", "geo_era_label": "Holy Roman Empire",
        "category": "discovery", "importance_score": 0.94, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "European intellectual perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Johannes Gutenberg's movable-type printing press revolutionized the dissemination of knowledge. The Gutenberg Bible (c. 1455) launched a media revolution that enabled the Reformation, the Scientific Revolution, and eventually democracy.",
             "summary": "The invention that democratized knowledge and enabled the modern world.", "evidence_score": 0.91,
             "sources": [
                 {"title": "The Printing Revolution in Early Modern Europe", "author": "Elizabeth Eisenstein",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}
             ]},
            {"label": "Church perspective", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "The printing press was initially seen as a powerful tool for spreading Christian texts. However, it quickly became the instrument of heresy — enabling Luther's Reformation and spreading ideas the Church could no longer contain.",
             "summary": "A divine gift for spreading scripture that unexpectedly unleashed uncontrollable religious controversy.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Gutenberg: How One Man Remade the World with Words", "author": "John Man",
                  "publication": "Wiley", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "columbus-reaches-americas-1492",
        "title": "Columbus Reaches the Americas",
        "year": 1492, "lat": 24.0978, "lng": -74.5381,
        "geo_modern": "San Salvador, Bahamas", "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "European/Spanish perspective", "culture_code": "es", "viewpoint_type": "nationalist",
             "narrative": "Christopher Columbus's voyage of 1492 opened the Americas to European exploration, beginning a century of discovery that expanded the known world and established Spanish imperial dominance in the New World.",
             "summary": "The discovery that transformed European geography, economics, and global power.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Journal of the First Voyage", "author": "Christopher Columbus",
                  "source_type": "primary", "reliability_tier": 2, "year": 1492},
             ]},
            {"label": "Indigenous Caribbean perspective", "culture_code": "indigenous-taino", "viewpoint_type": "indigenous",
             "narrative": "The Taíno people of the Bahamas encountered the Spanish as strangers, offering hospitality. Within decades, epidemic disease, enslavement, and violence had destroyed their civilization entirely. Columbus's 'discovery' marked the beginning of Caribbean genocide.",
             "summary": "The beginning of a catastrophic invasion that would exterminate the Taíno people within generations.", "evidence_score": 0.87,
             "sources": [
                 {"title": "A Brief Account of the Destruction of the Indies", "author": "Bartolomé de las Casas",
                  "source_type": "primary", "reliability_tier": 2, "year": 1542},
                 {"title": "The Conquest of Paradise", "author": "Kirkpatrick Sale", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "martin-luther-95-theses-1517",
        "title": "Martin Luther Posts 95 Theses",
        "year": 1517, "lat": 51.8667, "lng": 12.6333,
        "geo_modern": "Wittenberg, Germany", "geo_era_label": "Holy Roman Empire",
        "category": "cultural", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Protestant/Lutheran perspective", "culture_code": "de", "viewpoint_type": "religious",
             "narrative": "Martin Luther's Ninety-Five Theses, posted on October 31, 1517, challenged papal indulgences and sparked the Protestant Reformation. Luther's stand — 'Here I stand, I can do no other' — liberated Christians to read scripture for themselves.",
             "summary": "The spark that lit the Protestant Reformation and ended Catholic monopoly on Western Christianity.", "evidence_score": 0.89,
             "sources": [
                 {"title": "Disputatio pro Declaratione Virtutis Indulgentiarum (95 Theses)", "author": "Martin Luther",
                  "source_type": "primary", "reliability_tier": 1, "year": 1517},
             ]},
            {"label": "Catholic Church perspective", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "Luther's challenge was heresy that shattered Christian unity. His rebellion enabled princes to seize Church property and led to a century of devastating religious wars. The Counter-Reformation ultimately strengthened the Church theologically.",
             "summary": "A heretical rebellion that fractured Christendom and unleashed a century of religious warfare.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Luther: Man Between God and the Devil", "author": "Heiko A. Oberman", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "cortez-conquest-aztec-1519-1521",
        "title": "Spanish Conquest of the Aztec Empire",
        "year": 1519, "lat": 19.4326, "lng": -99.1332,
        "geo_modern": "Mexico City (Tenochtitlan), Mexico", "geo_era_label": "Aztec Empire",
        "category": "war", "importance_score": 0.91, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Spanish/conquistador perspective", "culture_code": "es", "viewpoint_type": "nationalist",
             "narrative": "Hernán Cortés's conquest of the Aztec Empire with 500 men was a triumph of Spanish military technology, alliance-building with oppressed peoples, and divine providence. It opened New Spain to civilization and Christianity.",
             "summary": "A heroic conquest that brought Christianity and civilization to the New World.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Letters from Mexico", "author": "Hernán Cortés", "source_type": "primary", "reliability_tier": 2, "year": 1520},
             ]},
            {"label": "Aztec/Nahuatl perspective", "culture_code": "indigenous-nahuatl", "viewpoint_type": "indigenous",
             "narrative": "The Florentine Codex preserves Indigenous accounts of the conquest as a catastrophic apocalypse. Tenochtitlan, the greatest city in the Western Hemisphere, was destroyed. The population of Central Mexico collapsed from 25 million to 1 million within a century due to disease and violence.",
             "summary": "The destruction of a sophisticated civilization and the beginning of colonial genocide.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Florentine Codex (General History of the Things of New Spain)", "author": "Sahagún & informants",
                  "source_type": "primary", "reliability_tier": 2, "year": 1569},
                 {"title": "The Broken Spears: The Aztec Account of the Conquest of Mexico", "author": "Miguel León-Portilla",
                  "publication": "Beacon Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1962}
             ]},
        ],
    },
    {
        "slug": "copernicus-heliocentric-theory-1543",
        "title": "Copernicus Publishes Heliocentric Theory",
        "year": 1543, "lat": 53.7784, "lng": 20.4801,
        "geo_modern": "Frombork, Poland", "geo_era_label": "Holy Roman Empire",
        "category": "discovery", "importance_score": 0.91, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "pl", "viewpoint_type": "academic",
             "narrative": "Nicolaus Copernicus's 'De Revolutionibus Orbium Coelestium' (1543) placed the Sun at the center of the solar system, launching the Scientific Revolution. His theory required a complete reconceptualization of humanity's place in the universe.",
             "summary": "The scientific revolution begins: Earth dethrones itself from the center of the universe.", "evidence_score": 0.93,
             "sources": [
                 {"title": "De Revolutionibus Orbium Coelestium", "author": "Nicolaus Copernicus",
                  "source_type": "primary", "reliability_tier": 1, "year": 1543},
             ]},
            {"label": "Catholic Church perspective", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "Initially tolerated as a mathematical hypothesis, heliocentrism was later placed on the Index of Forbidden Books (1616) as contradicting scripture. Galileo's imprisonment demonstrated the Church's determination to maintain cosmological authority.",
             "summary": "A dangerous theory that contradicted scripture and required suppression to protect the faithful.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Galileo Affair: A Documentary History", "author": "Maurice Finocchiaro",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}
             ]},
        ],
    },
    {
        "slug": "thirty-years-war-1618-1648",
        "title": "Thirty Years' War",
        "year": 1618, "lat": 50.0755, "lng": 14.4378,
        "geo_modern": "Central Europe", "geo_era_label": "Holy Roman Empire",
        "category": "war", "importance_score": 0.89, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Protestant perspective", "culture_code": "de", "viewpoint_type": "religious",
             "narrative": "The Thirty Years' War began as a Protestant revolt against Habsburg Catholic domination. The Peace of Westphalia (1648) finally established the principle of state sovereignty and religious toleration that forms the basis of modern international law.",
             "summary": "A religious war that forged the modern international system of sovereign states.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Thirty Years War", "author": "C.V. Wedgwood", "publication": "Jonathan Cape",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1938}
             ]},
            {"label": "German civilian perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Thirty Years' War devastated Germany. Some regions lost 25-40% of their population to war, famine, and disease. For German peasants, it was a generation of catastrophic suffering with no meaningful political stakes for them.",
             "summary": "The most devastating war in German history until the 20th century, causing generational trauma.", "evidence_score": 0.86,
             "sources": [
                 {"title": "Europe's Tragedy: A New History of the Thirty Years War", "author": "Peter Wilson",
                  "publication": "Allen Lane", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "english-civil-war-glorious-revolution-1688",
        "title": "Glorious Revolution — Constitutional Monarchy in England",
        "year": 1688, "lat": 51.5074, "lng": -0.1278,
        "geo_modern": "London, England", "geo_era_label": "Kingdom of England",
        "category": "political", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Whig/Protestant perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The Glorious Revolution replaced the Catholic King James II with the Protestant William and Mary without bloodshed. The Bill of Rights (1689) established parliamentary supremacy and individual rights, creating the model for constitutional democracy.",
             "summary": "A bloodless revolution that established parliamentary democracy and the rule of law.", "evidence_score": 0.86,
             "sources": [
                 {"title": "English Bill of Rights, 1689", "source_type": "primary", "reliability_tier": 1, "year": 1689},
                 {"title": "The Glorious Revolution", "author": "Edward Vallance", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}
             ]},
            {"label": "Irish/Catholic perspective", "culture_code": "ie", "viewpoint_type": "nationalist",
             "narrative": "For Ireland, the Glorious Revolution was a catastrophe. The defeat of the Jacobite cause at the Battle of the Boyne (1690) and subsequent Williamite settlement imposed the Penal Laws that dispossessed Catholics and subjugated Ireland for generations.",
             "summary": "For Ireland, the beginning of systematic religious and economic oppression of Catholics.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Ireland and the Jacobite Cause", "author": "Pádraig Lenihan", "publication": "Four Courts Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # INDUSTRIAL REVOLUTION & AGE OF REVOLUTIONS (1750–1900)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "american-revolution-1776",
        "title": "American Declaration of Independence",
        "year": 1776, "lat": 39.9485, "lng": -75.1501,
        "geo_modern": "Philadelphia, USA", "geo_era_label": "British North America",
        "category": "political", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American revolutionary perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "On July 4, 1776, the Continental Congress declared that all men are created equal with unalienable rights to life, liberty, and the pursuit of happiness. The American Revolution became a model for democratic governance worldwide.",
             "summary": "The founding of the first modern democratic republic on Enlightenment principles.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Declaration of Independence", "author": "Thomas Jefferson", "source_type": "primary", "reliability_tier": 1, "year": 1776},
             ]},
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The American rebellion was an ungrateful rejection of British protection and governance. The colonists, who had the highest standard of living in the world under British rule, refused to pay legitimate taxes for their own defense.",
             "summary": "An ungrateful colonial rebellion against legitimate authority.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Taxation No Tyranny", "author": "Samuel Johnson", "source_type": "primary", "reliability_tier": 2, "year": 1775},
             ]},
            {"label": "Indigenous/African American perspective", "culture_code": "indigenous-us", "viewpoint_type": "indigenous",
             "narrative": "For Native Americans, American independence meant the removal of British constraints on westward expansion. For enslaved people, the Declaration's promise of equality was immediately betrayed. The Revolution expanded freedom for some while entrenching bondage for others.",
             "summary": "Freedom for propertied white men; dispossession and continued enslavement for everyone else.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Counter-Revolution of 1776", "author": "Gerald Horne", "publication": "NYU Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "french-revolution-1789",
        "title": "French Revolution — Storming of the Bastille",
        "year": 1789, "lat": 48.8533, "lng": 2.3692,
        "geo_modern": "Paris, France", "geo_era_label": "Kingdom of France",
        "category": "political", "importance_score": 0.94, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Revolutionary perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The storming of the Bastille on July 14, 1789 symbolized the people's rejection of royal tyranny. The Revolution abolished feudalism, proclaimed the Rights of Man, and permanently changed the relationship between citizens and the state.",
             "summary": "The people's victory over tyranny, establishing the rights of man and citizen.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Declaration of the Rights of Man and Citizen", "source_type": "primary", "reliability_tier": 1, "year": 1789},
             ]},
            {"label": "Aristocratic/conservative perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The Revolution unleashed mob rule, mass murder, and ultimately Napoleon's dictatorship. The Terror killed thousands of innocents. Edmund Burke predicted it would end in tyranny — the guillotine and Napoleon proved him right.",
             "summary": "A descent into chaos and terror that destroyed civilization and led to Napoleon's despotism.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Reflections on the Revolution in France", "author": "Edmund Burke",
                  "source_type": "primary", "reliability_tier": 2, "year": 1790},
             ]},
        ],
    },
    {
        "slug": "haitian-revolution-1791-1804",
        "title": "Haitian Revolution — First Black Republic",
        "year": 1791, "lat": 18.9712, "lng": -72.2852,
        "geo_modern": "Saint-Domingue (Haiti)", "geo_era_label": "French Caribbean",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Haitian/Afro-Caribbean perspective", "culture_code": "ht", "viewpoint_type": "nationalist",
             "narrative": "The Haitian Revolution (1791-1804) was the only successful slave revolt in history, establishing the world's first Black republic. Led by Toussaint Louverture and Jean-Jacques Dessalines, it proved enslaved people would fight and die for freedom.",
             "summary": "The most radical revolution in history — enslaved people defeating three empires to found a free republic.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Black Jacobins", "author": "C.L.R. James", "publication": "Secker & Warburg",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1938},
             ]},
            {"label": "French colonial perspective", "culture_code": "fr", "viewpoint_type": "colonial",
             "narrative": "The rebellion in Saint-Domingue, France's most profitable colony, was a catastrophic economic and military defeat. Napoleon's failed attempt to reimpose slavery led to the Louisiana Purchase, reshaping American history.",
             "summary": "A colonial catastrophe that cost France its Caribbean empire and reshaped North American politics.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Haiti: The Aftershocks of History", "author": "Laurent Dubois", "publication": "Metropolitan Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "industrial-revolution-steam-engine-1769",
        "title": "Watt's Steam Engine Patent — Industrial Revolution",
        "year": 1769, "lat": 55.8642, "lng": -4.2518,
        "geo_modern": "Glasgow, Scotland", "geo_era_label": "Kingdom of Great Britain",
        "category": "discovery", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Industrial/entrepreneurial perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "James Watt's 1769 patent for a separate condenser steam engine transformed manufacturing, transportation, and agriculture. The Industrial Revolution raised living standards for millions and made Britain the world's first industrial power.",
             "summary": "The machine that powered modernity — launching the Industrial Revolution and modern economic growth.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Watt's Steam Engine Patent, 1769", "source_type": "primary", "reliability_tier": 1, "year": 1769},
                 {"title": "The Lunar Men", "author": "Jenny Uglow", "publication": "Faber",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
            {"label": "Working class perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "For workers, industrialization meant displacement from land to dangerous factories, child labor, 16-hour days, and urban poverty. The Luddite movement of 1811-1816 expressed the real human cost of mechanization.",
             "summary": "Industrialization created wealth at the top while immiserating the workers who produced it.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Making of the English Working Class", "author": "E.P. Thompson", "publication": "Gollancz",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1963}
             ]},
        ],
    },
    {
        "slug": "napoleon-empire-austerlitz-1805",
        "title": "Battle of Austerlitz — Napoleon's Greatest Victory",
        "year": 1805, "lat": 49.1268, "lng": 16.7697,
        "geo_modern": "Austerlitz (Slavkov), Czech Republic", "geo_era_label": "Napoleonic Empire",
        "category": "war", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French/Napoleonic perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Napoleon's destruction of the Austro-Russian forces at Austerlitz was a tactical masterpiece. The battle forced Austria out of the Third Coalition and cemented French dominance of Europe, spreading revolutionary legal and administrative reforms.",
             "summary": "Napoleon's tactical genius at its peak, making France master of Europe.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Correspondance de Napoléon", "author": "Napoleon Bonaparte", "source_type": "primary", "reliability_tier": 1, "year": 1805},
             ]},
            {"label": "Austrian/Russian perspective", "culture_code": "at", "viewpoint_type": "nationalist",
             "narrative": "Austerlitz was a catastrophic defeat for the traditional powers of Europe. The subsequent Treaty of Pressburg dismembered Austria and created Napoleon's satellite kingdoms. European monarchies recognized that traditional warfare could not stop Napoleon.",
             "summary": "A decisive defeat that demonstrated the superiority of Revolutionary French military organization over traditional armies.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Austerlitz: Napoleon's Greatest Victory", "author": "Ian Castle", "publication": "Osprey",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "abolition-slavery-british-empire-1833",
        "title": "Abolition of Slavery in the British Empire",
        "year": 1833, "lat": 51.5074, "lng": -0.1278,
        "geo_modern": "London, England", "geo_era_label": "British Empire",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "British abolitionist perspective", "culture_code": "gb", "viewpoint_type": "humanitarian",
             "narrative": "The Slavery Abolition Act of 1833 was a triumph of Christian moral campaigning by Wilberforce, Clarkson, and others. Britain paid £20 million in compensation and used its naval power to suppress the Atlantic slave trade globally.",
             "summary": "A moral triumph of Christian abolitionists forcing parliament to end the slave trade.", "evidence_score": 0.86,
             "sources": [
                 {"title": "Slavery Abolition Act 1833", "source_type": "primary", "reliability_tier": 1, "year": 1833},
             ]},
            {"label": "Caribbean/African diaspora perspective", "culture_code": "indigenous-caribbean", "viewpoint_type": "indigenous",
             "narrative": "The £20 million compensation went to slaveholders, not the enslaved. Freed people faced a compulsory 'apprenticeship' period, received no land or reparations, and entered a labor market designed to keep them in poverty. The enslaved themselves also fought for freedom through revolts.",
             "summary": "Freedom was partial and delayed; compensation rewarded enslavers while the freed received nothing.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Blood Legacy: Reckoning with a Family's Story of Slavery", "author": "Alex Renton",
                  "publication": "Canongate", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "american-civil-war-1861-1865",
        "title": "American Civil War Begins — Fort Sumter",
        "year": 1861, "lat": 32.7516, "lng": -79.8740,
        "geo_modern": "Charleston, South Carolina, USA", "geo_era_label": "United States of America",
        "category": "war", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Union/Northern perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Confederate attack on Fort Sumter launched an unconstitutional rebellion. The war became a crusade to preserve the Union and ultimately to end slavery, as Lincoln's Emancipation Proclamation (1863) transformed it into a war of liberation.",
             "summary": "A war to preserve the Union that became a revolution ending American slavery.", "evidence_score": 0.89,
             "sources": [
                 {"title": "Emancipation Proclamation", "author": "Abraham Lincoln", "source_type": "primary", "reliability_tier": 1, "year": 1863},
             ]},
            {"label": "Confederate/Southern perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Southern states seceded to defend states' rights and their economic system from Northern political domination. The Confederate cause has been romanticized as 'The Lost Cause,' but Confederate founding documents make clear slavery was its explicit foundation.",
             "summary": "A rebellion explicitly to preserve the institution of slavery, not states' rights as later mythology claimed.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Confederate States' Declarations of Secession", "source_type": "primary", "reliability_tier": 1, "year": 1861},
             ]},
            {"label": "African American perspective", "culture_code": "us", "viewpoint_type": "indigenous",
             "narrative": "For four million enslaved people, the Civil War was a war for liberation they actively shaped. Nearly 180,000 Black men served in the Union Army. Frederick Douglass argued the war's meaning: the destruction of slavery was its true purpose and necessary outcome.",
             "summary": "A war of liberation fought by and for enslaved people alongside the Union Army.", "evidence_score": 0.91,
             "sources": [
                 {"title": "Life and Times of Frederick Douglass", "author": "Frederick Douglass", "source_type": "primary", "reliability_tier": 1, "year": 1881},
             ]},
        ],
    },
    {
        "slug": "darwin-on-the-origin-of-species-1859",
        "title": "Darwin Publishes On the Origin of Species",
        "year": 1859, "lat": 51.2787, "lng": 0.0598,
        "geo_modern": "Down House, Kent, England", "geo_era_label": "Victorian Britain",
        "category": "discovery", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Charles Darwin's 'On the Origin of Species' (1859) established evolution by natural selection as the explanation for biological diversity. It is the most influential work in the history of biology and transformed our understanding of life on Earth.",
             "summary": "The most important scientific work in history — explaining how all life evolved.", "evidence_score": 0.97,
             "sources": [
                 {"title": "On the Origin of Species", "author": "Charles Darwin", "source_type": "primary", "reliability_tier": 1, "year": 1859},
             ]},
            {"label": "Religious perspective", "culture_code": "gb", "viewpoint_type": "religious",
             "narrative": "Darwin's theory contradicted the divine creation of species as described in Genesis. Bishop Wilberforce debated Huxley at Oxford in 1860. Many Christians today accept evolution while others maintain it contradicts the literal truth of scripture.",
             "summary": "A direct challenge to divine creation that sparked ongoing conflict between science and religion.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Darwin and the Crisis of 1876", "author": "J.R. Moore", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1979}
             ]},
        ],
    },
    {
        "slug": "berlin-conference-africa-partition-1884",
        "title": "Berlin Conference — Scramble for Africa",
        "year": 1884, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "Berlin, Germany", "geo_era_label": "European colonial era",
        "category": "political", "importance_score": 0.91, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "European colonial perspective", "culture_code": "de", "viewpoint_type": "colonial",
             "narrative": "The Berlin Conference of 1884-85 established the rules for European colonization of Africa, supposedly to end the slave trade and bring 'civilization.' Fourteen European nations divided Africa's territories with no African representation.",
             "summary": "European powers divide Africa among themselves to bring 'civilization' and end the slave trade.", "evidence_score": 0.82,
             "sources": [
                 {"title": "General Act of the Berlin Conference, 1885", "source_type": "primary", "reliability_tier": 1, "year": 1885},
             ]},
            {"label": "African perspective", "culture_code": "ng", "viewpoint_type": "indigenous",
             "narrative": "The Berlin Conference imposed arbitrary borders that cut across ethnic, linguistic, and cultural lines, creating artificial states that serve as the source of many of Africa's post-colonial conflicts. Africa was divided with no African voice, in service of European extraction.",
             "summary": "The foundation of African underdevelopment — arbitrary borders, resource extraction, and European domination without consent.", "evidence_score": 0.90,
             "sources": [
                 {"title": "How Europe Underdeveloped Africa", "author": "Walter Rodney", "publication": "Bogle-L'Ouverture",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1972}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # WWI (1914–1918) — 50 events with rich causality chains
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "assassination-franz-ferdinand-1914",
        "title": "Assassination of Archduke Franz Ferdinand",
        "year": 1914, "lat": 43.8563, "lng": 18.4131,
        "geo_modern": "Sarajevo, Bosnia", "geo_era_label": "Austro-Hungarian Empire",
        "category": "political", "importance_score": 0.97, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Austro-Hungarian perspective", "culture_code": "at", "viewpoint_type": "nationalist",
             "narrative": "The assassination of Archduke Franz Ferdinand, heir to the Habsburg throne, by Gavrilo Princip on June 28, 1914 was an act of Serbian state-sponsored terrorism that demanded a firm response. Austria-Hungary had to act or be seen as a weak, declining power.",
             "summary": "An act of Serbian-backed terrorism requiring a firm imperial response to preserve Habsburg authority.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Origins of the First World War", "author": "James Joll", "publication": "Longman",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1984}
             ]},
            {"label": "Serbian/South Slav perspective", "culture_code": "rs", "viewpoint_type": "nationalist",
             "narrative": "Princip and the Black Hand were motivated by Serbian nationalist aspirations to unite South Slavs under Serbian leadership, freeing them from Austro-Hungarian oppression. Princip acted as a revolutionary for Slavic liberation.",
             "summary": "A revolutionary act of nationalist resistance against Austro-Hungarian imperialism over South Slavs.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Assassination of Archduke Franz Ferdinand", "author": "David MacKenzie",
                  "publication": "Columbia University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}
             ]},
            {"label": "Structural/historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The assassination was the trigger, not the cause. Europe's alliance system, arms race, imperial competition, and war planning (Schlieffen Plan) had created a powder keg. Historians debate whether WWI was inevitable, accidental, or deliberately launched.",
             "summary": "The trigger event for a war caused by deeper structural tensions in the European state system.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Sleepwalkers: How Europe Went to War in 1914", "author": "Christopher Clark",
                  "publication": "Harper", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "austria-hungary-ultimatum-serbia-1914",
        "title": "Austro-Hungarian Ultimatum to Serbia",
        "year": 1914, "lat": 44.8176, "lng": 20.4570,
        "geo_modern": "Belgrade, Serbia", "geo_era_label": "Austro-Hungarian Empire",
        "category": "political", "importance_score": 0.88, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Austro-Hungarian perspective", "culture_code": "at", "viewpoint_type": "nationalist",
             "narrative": "The July 23 ultimatum to Serbia demanded the suppression of anti-Austrian propaganda and the right of Habsburg officials to participate in Serbian investigations. It was deliberately designed to be unacceptable, providing a pretext for war.",
             "summary": "A carefully crafted ultimatum designed to be rejected and provide a pretext for war.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Austrian Ultimatum to Serbia, July 23, 1914", "source_type": "primary", "reliability_tier": 1, "year": 1914},
             ]},
            {"label": "British diplomatic perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "British Foreign Secretary Sir Edward Grey called the ultimatum 'the most formidable document I had ever seen addressed by one State to another.' Britain urged restraint but the crisis moved faster than diplomacy.",
             "summary": "An unprecedented diplomatic act of deliberate provocation that shocked even experienced statesmen.", "evidence_score": 0.89,
             "sources": [
                 {"title": "Twenty-Five Years, 1892-1916", "author": "Viscount Grey of Fallodon",
                  "source_type": "primary", "reliability_tier": 2, "year": 1925}
             ]},
        ],
    },
    {
        "slug": "germany-declares-war-russia-1914",
        "title": "Germany Declares War on Russia",
        "year": 1914, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "Berlin, Germany", "geo_era_label": "German Empire",
        "category": "war", "importance_score": 0.90, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Germany declared war on Russia on August 1, 1914 after Russia refused to cancel its mobilization. Germany, surrounded by enemies, had to act quickly or face war on all sides. The Schlieffen Plan required winning in the west before Russia could fully mobilize.",
             "summary": "A necessary pre-emptive action driven by Germany's encirclement by hostile powers.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Germany's Aims in the First World War", "author": "Fritz Fischer", "publication": "Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}
             ]},
            {"label": "Russian perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Russia mobilized to defend Serbia and its Slavic interests. Germany's declaration of war began a conflict Russia could not avoid as the protector of Orthodox Slavic peoples against Habsburg and German imperialism.",
             "summary": "Russia forced into war as protector of Slavic peoples against German-Austrian aggression.", "evidence_score": 0.79,
             "sources": [
                 {"title": "Russia and the Origins of World War One", "author": "D.C.B. Lieven", "publication": "Macmillan",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "germany-invades-belgium-1914",
        "title": "Germany Invades Belgium — Britain Enters WWI",
        "year": 1914, "lat": 50.8503, "lng": 4.3517,
        "geo_modern": "Brussels, Belgium", "geo_era_label": "Kingdom of Belgium",
        "category": "war", "importance_score": 0.91, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Germany's invasion of neutral Belgium on August 4, 1914 obligated Britain to declare war under the 1839 Treaty of London. Foreign Secretary Grey's 'lamps going out across Europe' speech captured the moment. Britain entered to defend treaty obligations and prevent German hegemony.",
             "summary": "Britain enters to defend Belgian neutrality and prevent German domination of Europe.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The 1839 Treaty of London (Belgian Neutrality)", "source_type": "primary", "reliability_tier": 1, "year": 1839},
             ]},
            {"label": "German military perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Schlieffen Plan required violating Belgian neutrality to rapidly defeat France before turning east against Russia. Germany offered Belgium safe passage; Belgium's refusal made the invasion militarily necessary. German Chancellor Bethmann Hollweg called the treaty 'a scrap of paper.'",
             "summary": "A military necessity under the Schlieffen Plan, justified by strategic necessity over treaty 'scraps of paper.'", "evidence_score": 0.82,
             "sources": [
                 {"title": "August 1914", "author": "Alexander Solzhenitsyn", "source_type": "secondary", "reliability_tier": 3, "year": 1971},
             ]},
        ],
    },
    {
        "slug": "battle-marne-1914",
        "title": "First Battle of the Marne — Schlieffen Plan Fails",
        "year": 1914, "lat": 48.8200, "lng": 3.6500,
        "geo_modern": "Marne River, France", "geo_era_label": "Western Front",
        "category": "war", "importance_score": 0.89, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The 'Miracle of the Marne' — French and British forces halted the German advance just short of Paris. Reinforcements were famously rushed in Paris taxis. The failure of the Schlieffen Plan transformed the war into a prolonged war of attrition.",
             "summary": "France saves Paris and civilization — but consigns Europe to four years of trench warfare.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Marne, 1914", "author": "Holger Herwig", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
            {"label": "German military perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The German retreat at the Marne resulted from failures of command communication (Moltke's modified plan) and the exhaustion of advancing troops. Chief of Staff Moltke told the Kaiser: 'Your Majesty, we have lost the war.'",
             "summary": "A catastrophic failure of the war plan that Germany knew meant eventual defeat.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Real War 1914-1918", "author": "B.H. Liddell Hart", "publication": "Little, Brown",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1930}
             ]},
        ],
    },
    {
        "slug": "gallipoli-campaign-1915",
        "title": "Gallipoli Campaign",
        "year": 1915, "lat": 40.1500, "lng": 26.4100,
        "geo_modern": "Gallipoli Peninsula, Turkey", "geo_era_label": "Ottoman Empire",
        "category": "war", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British/Allied perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Churchill's plan to open a route to Russia through the Dardanelles was strategically sound but catastrophically executed. The Gallipoli campaign cost 250,000 Allied casualties and failed to knock Ottoman Turkey out of the war.",
             "summary": "A bold strategic vision undone by poor planning and execution at enormous cost.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Gallipoli", "author": "Alan Moorehead", "publication": "Hamish Hamilton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1956}
             ]},
            {"label": "ANZAC perspective", "culture_code": "au", "viewpoint_type": "nationalist",
             "narrative": "For Australia and New Zealand, Gallipoli was a defining national trauma. ANZAC troops fought with extraordinary courage at Anzac Cove but were sacrificed by incompetent British command. April 25 (Anzac Day) became the most sacred date in both nations' calendars.",
             "summary": "The birth of Australian and New Zealand national identity through shared sacrifice.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The ANZAC Legend", "author": "Patsy Adam-Smith", "publication": "Nelson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1978}
             ]},
            {"label": "Ottoman/Turkish perspective", "culture_code": "tr", "viewpoint_type": "nationalist",
             "narrative": "The Ottoman defense of Gallipoli under Mustafa Kemal (later Atatürk) was a decisive victory that preserved the Ottoman heartland. For Turkey, Gallipoli is a national triumph and Kemal's leadership a founding moment of modern Turkey.",
             "summary": "An Ottoman victory that preserved Turkey and launched Atatürk's career as national savior.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Atatürk", "author": "Andrew Mango", "publication": "John Murray",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "armenian-genocide-1915-1923",
        "title": "Armenian Genocide",
        "year": 1915, "lat": 38.9637, "lng": 35.2433,
        "geo_modern": "Eastern Anatolia, Turkey", "geo_era_label": "Ottoman Empire",
        "category": "war", "importance_score": 0.91, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Armenian perspective", "culture_code": "am", "viewpoint_type": "indigenous",
             "narrative": "Beginning in April 1915, the Ottoman government systematically deported and massacred the Armenian population of Anatolia. An estimated 600,000 to 1.5 million Armenians were killed. This was the first genocide of the 20th century, recognized by dozens of nations.",
             "summary": "The systematic extermination of the Armenian people by the Ottoman government — the first modern genocide.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Ambassador Morgenthau's Story", "author": "Henry Morgenthau Sr.",
                  "source_type": "primary", "reliability_tier": 2, "year": 1918},
                 {"title": "A Problem from Hell: America and the Age of Genocide", "author": "Samantha Power",
                  "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}
             ]},
            {"label": "Turkish government perspective", "culture_code": "tr", "viewpoint_type": "nationalist",
             "narrative": "The Turkish government does not recognize the events as genocide, arguing that Armenians died in wartime population relocations alongside many Muslim casualties. The deportations were a response to Armenian collaboration with invading Russian forces.",
             "summary": "A wartime security measure, not a planned genocide; casualties on all sides were heavy.", "evidence_score": 0.30,
             "sources": [
                 {"title": "The Armenian Question (Turkish official position)", "source_type": "secondary", "reliability_tier": 4, "year": 2005}
             ]},
            {"label": "International/historical consensus", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The overwhelming consensus of genocide scholars classifies the systematic killing of Armenians as genocide. The International Association of Genocide Scholars and 35+ countries officially recognize it. The denial policy is itself a documented strategy of the Turkish state.",
             "summary": "Scholarly and international consensus: systematic genocide, the denial of which is itself a political act.", "evidence_score": 0.95,
             "sources": [
                 {"title": "International Association of Genocide Scholars Resolution, 2007", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "battle-verdun-1916",
        "title": "Battle of Verdun",
        "year": 1916, "lat": 49.1538, "lng": 5.3889,
        "geo_modern": "Verdun, Meuse, France", "geo_era_label": "Western Front",
        "category": "war", "importance_score": 0.90, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Verdun was France's greatest trial of the war. 'They shall not pass' became the battle cry. France held Verdun against the German onslaught but at the cost of 400,000 casualties. Verdun became the supreme symbol of French military sacrifice.",
             "summary": "France's traumatic and heroic stand — the longest battle of the war, defining a generation.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Verdun", "author": "Alistair Horne", "publication": "Macmillan",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1962}
             ]},
            {"label": "German military perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "General Falkenhayn designed the Verdun offensive to 'bleed France white' — a strategy of attrition rather than breakthrough. The plan worked in terms of French casualties but destroyed Germany's own forces equally. Falkenhayn was dismissed in August 1916.",
             "summary": "A deliberate attrition strategy that destroyed both armies and failed to achieve its strategic aim.", "evidence_score": 0.86,
             "sources": [
                 {"title": "The German High Command at War: Hindenburg and Ludendorff Conduct World War I", "author": "Robert Asprey",
                  "publication": "Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "battle-somme-1916",
        "title": "Battle of the Somme",
        "year": 1916, "lat": 50.0066, "lng": 2.6822,
        "geo_modern": "Somme, Picardy, France", "geo_era_label": "Western Front",
        "category": "war", "importance_score": 0.91, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "July 1, 1916 — the first day of the Battle of the Somme — saw 57,470 British casualties including 19,240 dead, the worst single day in British military history. The battle lasted until November, producing 420,000 British, 195,000 French, and 650,000 German casualties.",
             "summary": "Britain's bloodiest day — a military catastrophe that devastated a generation.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Somme", "author": "John Keegan", "publication": "Spellmount",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1976}
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Somme was the debut of the tank and demonstrated Allied industrial capacity. For Germany, the battle confirmed that the war of attrition was destroying the cream of German manhood. The Eastern Front collapse was accelerating.",
             "summary": "A grinding demonstration of Allied industrial and manpower superiority that Germany could not match.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Battle of the Somme: The Heroism and Horror of War", "author": "Martin Gilbert",
                  "publication": "Holt", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "russian-revolution-1917",
        "title": "Russian Revolution — Tsar Nicholas II Abdicates",
        "year": 1917, "lat": 59.9343, "lng": 30.3351,
        "geo_modern": "Petrograd (St. Petersburg), Russia", "geo_era_label": "Russian Empire",
        "category": "political", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Bolshevik perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "The February Revolution overthrew the Tsar; the October Revolution brought the Bolsheviks to power. Lenin's party promised peace, land, and bread. The Russian working class and soldiers overthrew capitalism and established the world's first socialist state.",
             "summary": "The working class seizes power, establishing the world's first socialist state.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Ten Days That Shook the World", "author": "John Reed", "source_type": "primary", "reliability_tier": 2, "year": 1919},
             ]},
            {"label": "Liberal/democratic perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "The February Revolution created a democratic provisional government; the Bolshevik coup in October destroyed it. Lenin's seizure of power was a minority takeover that dismissed the democratically elected Constituent Assembly and launched the Red Terror.",
             "summary": "A democratic revolution hijacked by a disciplined minority party that established a new tyranny.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Russian Revolution", "author": "Richard Pipes", "publication": "Knopf",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "usa-enters-wwi-1917",
        "title": "United States Enters World War I",
        "year": 1917, "lat": 38.9072, "lng": -77.0369,
        "geo_modern": "Washington D.C., USA", "geo_era_label": "United States of America",
        "category": "political", "importance_score": 0.89, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Germany's resumption of unrestricted submarine warfare (sinking US ships) and the Zimmermann Telegram (Germany proposing Mexico attack the US) forced America to enter the war. Wilson's Fourteen Points reframed it as a war for democracy.",
             "summary": "German aggression forces America in, bringing the war's decisive military and material resources to the Allies.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Wilson's War Message to Congress, April 2, 1917", "author": "Woodrow Wilson",
                  "source_type": "primary", "reliability_tier": 1, "year": 1917},
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Germany's gamble — that unrestricted submarine warfare would starve Britain before American forces could arrive — failed. The Zimmermann Telegram was a catastrophic diplomatic blunder. America's entry made eventual German defeat inevitable.",
             "summary": "A desperate gamble that failed: American entry made Germany's defeat inevitable.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Zimmermann Telegram", "author": "Barbara Tuchman", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1958}
             ]},
        ],
    },
    {
        "slug": "armistice-wwi-november-1918",
        "title": "World War I Armistice — November 11, 1918",
        "year": 1918, "lat": 49.4183, "lng": 2.9020,
        "geo_modern": "Compiègne Forest, France", "geo_era_label": "Western Front",
        "category": "war", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Allied perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The armistice of November 11 at 11am ended four years of slaughter. The Allies had successfully broken the German lines, and Germany's military, political, and home front had collapsed. Victory came at the cost of 20 million lives.",
             "summary": "Allied victory after four years of unprecedented slaughter — but the peace to follow would plant the seeds of another war.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Armistice of 11 November 1918", "source_type": "primary", "reliability_tier": 1, "year": 1918},
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Germany's civilian government signed the armistice while German armies were still on foreign soil. This 'stab in the back' (Dolchstoßlegende) myth — that Germany was betrayed from within by socialists and Jews — became the founding lie of Nazi politics.",
             "summary": "A military humiliation that right-wing nationalists would weaponize as the 'stab in the back' — directly enabling Hitler's rise.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Stab-in-the-Back Myth and the Fall of the Weimar Republic", "author": "Boris Barth",
                  "publication": "Duncker & Humblot", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "spanish-flu-pandemic-1918-1919",
        "title": "Spanish Flu Pandemic",
        "year": 1918, "lat": 40.4168, "lng": -3.7038,
        "geo_modern": "Global (misnamed 'Spanish')", "geo_era_label": "Post-WWI",
        "category": "natural", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Medical/epidemiological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The 1918-1919 influenza pandemic infected an estimated 500 million people (one-third of the world's population) and killed 50-100 million — more than WWI. The virus was uniquely deadly to young adults, not the elderly. It spread along wartime supply lines.",
             "summary": "The deadliest pandemic in recorded history, killing more people than World War I.", "evidence_score": 0.93,
             "sources": [
                 {"title": "The Great Influenza", "author": "John Barry", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
            {"label": "Wartime political perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Wartime censorship in the belligerent nations suppressed reporting on the pandemic to maintain morale. Only neutral Spain reported freely, giving the disease its misnomer. The pandemic affected Germany's Spring Offensive capability and may have hastened the armistice.",
             "summary": "Suppressed by wartime censorship, its true impact on the war's outcome was hidden from the public.", "evidence_score": 0.86,
             "sources": [
                 {"title": "America's Forgotten Pandemic: The Influenza of 1918", "author": "Alfred Crosby",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # INTERWAR PERIOD (1919–1938) — WWI→WWII causality chain
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "treaty-of-versailles-1919",
        "title": "Treaty of Versailles",
        "year": 1919, "lat": 48.8049, "lng": 2.1204,
        "geo_modern": "Versailles, France", "geo_era_label": "Post-WWI",
        "category": "political", "importance_score": 0.97, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Allied/French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Clemenceau demanded a punishing peace to ensure Germany could never again threaten France. Germany was assigned full war guilt (Article 231), required to pay 132 billion gold marks in reparations, and stripped of territory and military capacity.",
             "summary": "A just reckoning for German aggression — France needed security after losing 1.4 million men.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Treaty of Versailles, 1919", "source_type": "primary", "reliability_tier": 1, "year": 1919},
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The 'War Guilt Clause' (Article 231) forced Germany to accept sole responsibility for a war caused by all powers. The humiliating terms — reparations, territorial losses, military restrictions — created the conditions for extremist politics and Hitler's rise.",
             "summary": "A vindictive peace that humiliated Germany and directly caused the Second World War.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Economic Consequences of the Peace", "author": "John Maynard Keynes",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1919}
             ]},
            {"label": "Non-European/colonial perspective", "culture_code": "vn", "viewpoint_type": "colonial",
             "narrative": "Ho Chi Minh came to Paris in 1919 with a petition for Vietnamese self-determination, inspired by Wilson's Fourteen Points. He was ignored. African delegations were excluded. Wilson's 'self-determination' applied only to European peoples.",
             "summary": "The West's hypocrisy exposed: self-determination for white Europeans only; colonies excluded.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Vietnam: A History", "author": "Stanley Karnow", "publication": "Viking",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "paris-peace-conference-arab-betrayal-1919",
        "title": "Paris Peace Conference — Arab Aspirations Betrayed",
        "year": 1919, "lat": 48.8566, "lng": 2.3522,
        "geo_modern": "Paris, France", "geo_era_label": "Post-WWI Middle East",
        "category": "political", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Arab/Middle Eastern perspective", "culture_code": "sa", "viewpoint_type": "nationalist",
             "narrative": "Arab leaders who had supported the Allied war effort based on promises of independence — the Hussein-McMahon Correspondence — were betrayed. Instead, Britain and France divided the Arab world under the secret Sykes-Picot Agreement. Faisal's pleas at Paris were ignored.",
             "summary": "Allied betrayal of Arab independence promises, laying roots for a century of Middle Eastern conflict.", "evidence_score": 0.89,
             "sources": [
                 {"title": "The Arab Awakening", "author": "George Antonius", "publication": "Hamish Hamilton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1938},
             ]},
            {"label": "British/French colonial perspective", "culture_code": "gb", "viewpoint_type": "colonial",
             "narrative": "Britain and France had legitimate strategic interests in the Middle East. The Mandate system was intended to prepare Arab territories for eventual self-government under League of Nations supervision.",
             "summary": "Mandates as responsible preparation for eventual Arab self-governance.", "evidence_score": 0.60,
             "sources": [
                 {"title": "A Peace to End All Peace", "author": "David Fromkin", "publication": "Holt", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989},
             ]},
        ],
    },
    {
        "slug": "balfour-declaration-1917",
        "title": "Balfour Declaration — British Promise of Jewish Homeland",
        "year": 1917, "lat": 51.5074, "lng": -0.1278,
        "geo_modern": "London, England", "geo_era_label": "British Empire",
        "category": "political", "importance_score": 0.90, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Zionist/Jewish perspective", "culture_code": "il", "viewpoint_type": "nationalist",
             "narrative": "The Balfour Declaration of November 2, 1917 was a crucial step toward Jewish statehood after 2,000 years of exile. Britain's formal recognition of Zionist aspirations gave the movement international legitimacy.",
             "summary": "The first international recognition of the Jewish people's right to a homeland in Palestine.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Balfour Declaration, November 2, 1917", "source_type": "primary", "reliability_tier": 1, "year": 1917},
             ]},
            {"label": "Palestinian Arab perspective", "culture_code": "ps", "viewpoint_type": "indigenous",
             "narrative": "The Balfour Declaration promised the homeland of the Arab majority of Palestine to a Jewish minority, without consulting the existing 90% Arab population. It was a colonial act disposing of a territory Britain did not own.",
             "summary": "Britain promised Arab land to a third party without consent, planting the seeds of the Israeli-Palestinian conflict.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Ethnic Cleansing of Palestine", "author": "Ilan Pappé", "publication": "Oneworld", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006},
             ]},
        ],
    },
    {
        "slug": "weimar-republic-hyperinflation-1923",
        "title": "Weimar Republic Hyperinflation Crisis",
        "year": 1923, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "Berlin, Germany", "geo_era_label": "Weimar Republic",
        "category": "political", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "German civilian perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "By November 1923, one US dollar was worth 4.2 trillion marks. Middle-class savings were wiped out overnight. The hyperinflation, caused partly by reparations payments and French occupation of the Ruhr, destroyed faith in democratic institutions.",
             "summary": "Economic catastrophe that destroyed the German middle class and destabilized Weimar democracy.", "evidence_score": 0.91,
             "sources": [
                 {"title": "When Money Dies", "author": "Adam Fergusson", "publication": "William Kimber", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1975},
             ]},
            {"label": "Economic/historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The hyperinflation was caused by Germany printing money to buy foreign currency to pay reparations and fund the passive resistance in the Ruhr. It was a deliberate choice with consequences the German government did not fully anticipate.",
             "summary": "A policy failure rooted in reparations and the Ruhr crisis that created the conditions for political extremism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The German Inflation, 1914-1923", "author": "Carl-Ludwig Holtfrerich", "publication": "De Gruyter", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1986},
             ]},
        ],
    },
    {
        "slug": "hitler-beer-hall-putsch-1923",
        "title": "Beer Hall Putsch — Hitler's First Attempt at Power",
        "year": 1923, "lat": 48.1351, "lng": 11.5820,
        "geo_modern": "Munich, Germany", "geo_era_label": "Weimar Republic",
        "category": "political", "importance_score": 0.85, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Nazi/nationalist perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Hitler's attempted coup on November 8-9, 1923 failed but his trial gave him a national platform. His prison sentence (during which he wrote Mein Kampf) transformed him from a regional agitator into a national figure.",
             "summary": "A failed coup that paradoxically launched Hitler's national political career.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Mein Kampf", "author": "Adolf Hitler", "source_type": "primary", "reliability_tier": 2, "year": 1925},
                 {"title": "Hitler: 1889-1936 Hubris", "author": "Ian Kershaw", "publication": "Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998},
             ]},
            {"label": "Weimar democratic perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The lenient treatment of Hitler — five years' minimum sentence reduced to nine months — demonstrated Weimar's failure to take the Nazi threat seriously. The judiciary's nationalist sympathies would prove fatal to the Republic.",
             "summary": "Weimar's fatal mistake: a lenient sentence that gave Hitler a platform rather than silencing him.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Coming of the Third Reich", "author": "Richard Evans", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003},
             ]},
        ],
    },
    {
        "slug": "great-depression-wall-street-crash-1929",
        "title": "Wall Street Crash — Great Depression Begins",
        "year": 1929, "lat": 40.7069, "lng": -74.0089,
        "geo_modern": "New York City, USA", "geo_era_label": "Interwar USA",
        "category": "political", "importance_score": 0.94, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American economic perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Black Tuesday (October 29, 1929) triggered a stock market collapse that wiped out $30 billion in wealth. The Depression that followed saw 25% US unemployment by 1933, bank failures, and the Dust Bowl — the worst economic crisis in American history.",
             "summary": "The worst financial collapse in history, triggering a decade-long global Depression.", "evidence_score": 0.93,
             "sources": [
                 {"title": "The Great Crash 1929", "author": "John Kenneth Galbraith", "publication": "Houghton Mifflin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1954},
             ]},
            {"label": "European/German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Depression devastated Germany more than any other country — unemployment reached 30% by 1932. The economic collapse destroyed the moderate center, driving desperate voters to extremes. Hitler's rise was directly enabled by the Depression.",
             "summary": "The economic catastrophe that destroyed Weimar democracy and enabled Hitler's rise to power.", "evidence_score": 0.91,
             "sources": [
                 {"title": "The World in Depression, 1929-1939", "author": "Charles Kindleberger", "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1973},
             ]},
        ],
    },
    {
        "slug": "hitler-appointed-chancellor-1933",
        "title": "Hitler Appointed Chancellor of Germany",
        "year": 1933, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "Berlin, Germany", "geo_era_label": "Weimar Republic",
        "category": "political", "importance_score": 0.97, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Nazi perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Adolf Hitler's appointment as Chancellor on January 30, 1933 was the legal and democratic culmination of the Nazi movement's rise. The German people, facing depression and humiliation, chose Hitler to restore national greatness.",
             "summary": "The legal seizure of power that the Nazis parlayed into total dictatorship within months.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Hitler: 1889-1936 Hubris", "author": "Ian Kershaw", "publication": "Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998},
             ]},
            {"label": "Democratic/international perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Hindenburg appointed Hitler believing he could be controlled by conservative elites. Within months, the Enabling Act destroyed German democracy. The appointment was not inevitable — it resulted from specific political miscalculations by democratic politicians.",
             "summary": "The fatal miscalculation of conservative elites who thought they could use and control Hitler.", "evidence_score": 0.91,
             "sources": [
                 {"title": "The Coming of the Third Reich", "author": "Richard Evans", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003},
             ]},
        ],
    },
    {
        "slug": "nuremberg-laws-1935",
        "title": "Nuremberg Laws — Codification of Nazi Antisemitism",
        "year": 1935, "lat": 49.4521, "lng": 11.0767,
        "geo_modern": "Nuremberg, Germany", "geo_era_label": "Third Reich",
        "category": "political", "importance_score": 0.90, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Jewish perspective", "culture_code": "de", "viewpoint_type": "indigenous",
             "narrative": "The Nuremberg Laws of September 1935 stripped German Jews of citizenship, banned marriage between Jews and non-Jews, and legally defined Jewishness. 500,000 German Jews became stateless in their own country, the precursor to the Holocaust.",
             "summary": "The legal foundation for the Holocaust — Jews rendered stateless and defined for extermination.", "evidence_score": 0.93,
             "sources": [
                 {"title": "The Nuremberg Laws, September 15, 1935", "source_type": "primary", "reliability_tier": 1, "year": 1935},
             ]},
            {"label": "Historical/legal perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Nuremberg Laws were modeled partly on Jim Crow laws in the American South, which Nazi jurists studied. They established a racial state in law, creating the bureaucratic framework for persecution that would culminate in the Final Solution.",
             "summary": "Racial law inspired by American precedents, creating the legal infrastructure for genocide.", "evidence_score": 0.91,
             "sources": [
                 {"title": "Hitler's American Model", "author": "James Q. Whitman", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2017},
             ]},
        ],
    },
    {
        "slug": "spanish-civil-war-1936-1939",
        "title": "Spanish Civil War",
        "year": 1936, "lat": 40.4168, "lng": -3.7038,
        "geo_modern": "Spain", "geo_era_label": "Spanish Republic / Nationalist Spain",
        "category": "war", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Republican perspective", "culture_code": "es", "viewpoint_type": "nationalist",
             "narrative": "Franco's military coup against the elected Spanish Republic was fascism's attempt to destroy democracy. International Brigades from 54 countries volunteered to defend the Republic. The Republic's defeat showed the West's appeasement of fascism.",
             "summary": "Democracy's defeat in Spain — the rehearsal for World War II and proof of Western appeasement's failure.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Homage to Catalonia", "author": "George Orwell", "source_type": "primary", "reliability_tier": 2, "year": 1938},
             ]},
            {"label": "Nationalist/Francoist perspective", "culture_code": "es", "viewpoint_type": "nationalist",
             "narrative": "Franco's Nationalists were defending Spain from communist revolution backed by the Soviet Union. The Republic had failed to prevent anarchist and communist violence. The Nationalist victory preserved Spain from Bolshevism.",
             "summary": "A necessary military intervention to save Spain from communist revolution and disorder.", "evidence_score": 0.68,
             "sources": [
                 {"title": "The Spanish Civil War", "author": "Antony Beevor", "publication": "Cassell", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1982},
             ]},
        ],
    },
    {
        "slug": "anschluss-austria-1938",
        "title": "Anschluss — Germany Annexes Austria",
        "year": 1938, "lat": 48.2082, "lng": 16.3738,
        "geo_modern": "Vienna, Austria", "geo_era_label": "Third Reich",
        "category": "war", "importance_score": 0.86, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Nazi German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Anschluss of March 1938 united two German-speaking peoples separated since 1866. Austrians greeted Hitler with mass enthusiasm. Pan-German nationalism was fulfilled; the Versailles prohibition on union was simply overridden.",
             "summary": "The fulfillment of pan-German nationalism and reunion of German-speaking peoples.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Anschluss of Austria, March 1938", "source_type": "primary", "reliability_tier": 1, "year": 1938},
             ]},
            {"label": "International/Austrian perspective", "culture_code": "at", "viewpoint_type": "nationalist",
             "narrative": "The Anschluss was accomplished under military threat and Nazi pressure, not genuine plebiscite. Austria would later use the 'first victim' narrative to avoid confronting its own Nazi complicity. Austrians were significantly over-represented in Nazi leadership and the SS.",
             "summary": "Intimidated annexation that Austria later falsified as victimhood to evade its own Nazi culpability.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Austria in the First Cold War", "author": "Günter Bischof", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999},
             ]},
        ],
    },
    {
        "slug": "munich-agreement-appeasement-1938",
        "title": "Munich Agreement — Appeasement of Hitler",
        "year": 1938, "lat": 48.1351, "lng": 11.5820,
        "geo_modern": "Munich, Germany", "geo_era_label": "Third Reich",
        "category": "political", "importance_score": 0.92, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British/Chamberlain perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Neville Chamberlain's Munich Agreement gave Hitler the Sudetenland to prevent a second world war. Chamberlain returned to London promising 'peace for our time.' The democracies were not ready for war in 1938 and needed time to rearm.",
             "summary": "A necessary compromise buying time for British rearmament, not craven surrender.", "evidence_score": 0.79,
             "sources": [
                 {"title": "Peace for Our Time (Chamberlain's speech, September 30, 1938)", "source_type": "primary", "reliability_tier": 1, "year": 1938},
             ]},
            {"label": "Czech/anti-appeasement perspective", "culture_code": "cz", "viewpoint_type": "nationalist",
             "narrative": "Czechoslovakia was betrayed by its allies without a voice in its own dismemberment. Churchill was right: 'Britain and France had to choose between war and dishonour. They chose dishonour. They will have war.' Munich emboldened Hitler and made WWII more likely.",
             "summary": "The betrayal of a democratic ally that proved appeasement invites further aggression.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Gathering Storm", "author": "Winston Churchill", "publication": "Houghton Mifflin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1948},
             ]},
        ],
    },
    {
        "slug": "molotov-ribbentrop-pact-1939",
        "title": "Molotov-Ribbentrop Pact — Nazi-Soviet Non-Aggression",
        "year": 1939, "lat": 55.7558, "lng": 37.6173,
        "geo_modern": "Moscow, Russia", "geo_era_label": "Soviet Union",
        "category": "political", "importance_score": 0.91, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Nazi German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The August 1939 pact with the Soviet Union freed Germany from the threat of a two-front war and guaranteed Soviet neutrality (and raw materials) while Germany eliminated Poland and the Western powers.",
             "summary": "A diplomatic masterstroke freeing Germany for western operations without fear of Soviet attack.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Molotov-Ribbentrop Pact, August 23, 1939", "source_type": "primary", "reliability_tier": 1, "year": 1939},
             ]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Stalin's pact with Hitler bought time for Soviet military preparation after the West's appeasement showed they would not contain Germany. The secret protocols dividing Eastern Europe were cynical but pragmatic.",
             "summary": "A pragmatic delay to prepare for the inevitable German attack that the West's appeasement made unavoidable.", "evidence_score": 0.81,
             "sources": [
                 {"title": "Stalin: A Biography", "author": "Robert Service", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004},
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # WORLD WAR II (1939–1945) — 50 events
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "germany-invades-poland-1939",
        "title": "Germany Invades Poland — World War II Begins",
        "year": 1939, "lat": 52.2297, "lng": 21.0122,
        "geo_modern": "Warsaw, Poland", "geo_era_label": "Third Reich",
        "category": "war", "importance_score": 0.97, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "German Nazi perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Germany invaded Poland on September 1, 1939 after staging the Gleiwitz incident as a Polish provocation. The Blitzkrieg campaign used tanks and air power to overwhelm Polish defenses in weeks.",
             "summary": "Blitzkrieg warfare destroys Poland in weeks, starting the deadliest war in history.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Second World War", "author": "John Keegan", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989},
             ]},
            {"label": "Polish perspective", "culture_code": "pl", "viewpoint_type": "nationalist",
             "narrative": "Poland was invaded simultaneously by Germany from the west (September 1) and the Soviet Union from the east (September 17) under the Molotov-Ribbentrop secret protocols. Six million Polish citizens — half of them Jews — would die during the occupation.",
             "summary": "Poland crushed between Nazi and Soviet invasions, suffering proportionally the highest casualties of any nation in WWII.", "evidence_score": 0.92,
             "sources": [
                 {"title": "God's Playground: A History of Poland", "author": "Norman Davies", "publication": "Columbia University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1981},
             ]},
        ],
    },
    {
        "slug": "fall-of-france-1940",
        "title": "Fall of France — Germany Defeats France in Six Weeks",
        "year": 1940, "lat": 48.8566, "lng": 2.3522,
        "geo_modern": "Paris, France", "geo_era_label": "Third Reich / Vichy France",
        "category": "war", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "German military perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Manstein's Ardennes plan outflanked the Maginot Line, cutting Allied forces off from the sea. Paris fell on June 14, 1940. The armistice on June 22 in the same railway car where Germany surrendered in 1918 was Hitler's symbolic revenge for Versailles.",
             "summary": "A brilliant operational triumph reversing the humiliation of 1918 within six weeks.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Fall of France", "author": "Julian Jackson", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003},
             ]},
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The defeat resulted from military doctrine fixated on WWI, political divisions, and command failures. The armistice created Vichy France, which collaborated with Nazi Germany. De Gaulle's Free French continued the fight from London.",
             "summary": "Military failure leading to collaboration and resistance — France divided between Vichy and de Gaulle.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Strange Defeat", "author": "Marc Bloch", "source_type": "primary", "reliability_tier": 2, "year": 1940},
             ]},
        ],
    },
    {
        "slug": "battle-of-britain-1940",
        "title": "Battle of Britain",
        "year": 1940, "lat": 51.5074, "lng": -0.1278,
        "geo_modern": "England and English Channel", "geo_era_label": "WWII Western Front",
        "category": "war", "importance_score": 0.92, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The RAF's victory in the Battle of Britain (July-October 1940) prevented a German invasion. Churchill's 'finest hour' speeches galvanized resistance. The Spitfire and Hurricane pilots, 'the few,' saved Western civilization.",
             "summary": "The RAF's victory that saved Britain from invasion and kept democracy's last bastion alive.", "evidence_score": 0.91,
             "sources": [
                 {"title": "'Their Finest Hour' Speech", "author": "Winston Churchill", "source_type": "primary", "reliability_tier": 1, "year": 1940},
                 {"title": "The Battle of Britain", "author": "Richard Hough and Denis Richards", "publication": "Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989},
             ]},
            {"label": "German Luftwaffe perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The Luftwaffe came close to defeating the RAF but shifted from airfield attacks to bombing London (the Blitz), allowing RAF Fighter Command to recover. Göring's strategic errors and underestimating British radar capabilities were decisive.",
             "summary": "A winnable battle lost through strategic errors and underestimation of British technology.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Luftwaffe War Diaries", "author": "Cajus Bekker", "publication": "Doubleday", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1968},
             ]},
        ],
    },
    {
        "slug": "operation-barbarossa-1941",
        "title": "Operation Barbarossa — Germany Invades Soviet Union",
        "year": 1941, "lat": 55.7558, "lng": 37.6173,
        "geo_modern": "Soviet Union", "geo_era_label": "Eastern Front WWII",
        "category": "war", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Nazi German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Hitler launched Barbarossa on June 22, 1941 — the largest military operation in history — to destroy 'Judeo-Bolshevism,' gain Lebensraum, and access Soviet resources. Initial advances were spectacular but Moscow was not taken before winter.",
             "summary": "The largest military operation in history — Hitler's ideological war for 'living space' in the East.", "evidence_score": 0.91,
             "sources": [
                 {"title": "Barbarossa: The Russian-German Conflict 1941-45", "author": "Alan Clark", "publication": "Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1965},
             ]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "The Soviet Union absorbed catastrophic initial losses — millions killed or captured in 1941 — but rallied. The Great Patriotic War mobilized the entire Soviet people. Barbarossa was repelled at Moscow, Stalingrad, and Kursk through extraordinary sacrifice.",
             "summary": "Soviet survival and ultimate victory through immense suffering — 27 million Soviet dead by war's end.", "evidence_score": 0.93,
             "sources": [
                 {"title": "Russia's War", "author": "Richard Overy", "publication": "Allen Lane", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997},
             ]},
        ],
    },
    {
        "slug": "pearl-harbor-1941",
        "title": "Japanese Attack on Pearl Harbor",
        "year": 1941, "lat": 21.3673, "lng": -157.9506,
        "geo_modern": "Pearl Harbor, Hawaii, USA", "geo_era_label": "Pacific War WWII",
        "category": "war", "importance_score": 0.93, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Japan's surprise attack on Pearl Harbor on December 7, 1941 — 'a date which will live in infamy' — killed 2,403 Americans and destroyed much of the Pacific Fleet. It united American public opinion and drew the US into WWII.",
             "summary": "The surprise attack that awoke the sleeping giant and brought America into the war.", "evidence_score": 0.92,
             "sources": [
                 {"title": "'Day of Infamy' Speech", "author": "Franklin D. Roosevelt", "source_type": "primary", "reliability_tier": 1, "year": 1941},
             ]},
            {"label": "Japanese perspective", "culture_code": "jp", "viewpoint_type": "nationalist",
             "narrative": "Japan attacked Pearl Harbor to neutralize the US Pacific Fleet while Japan secured the oil fields of the Dutch East Indies, essential after the US oil embargo. Japanese planners knew war with America meant eventual defeat, but saw it as the only option given the embargo.",
             "summary": "A strategic necessity forced by American economic embargo — but a catastrophic strategic miscalculation.", "evidence_score": 0.86,
             "sources": [
                 {"title": "The Pacific War", "author": "John Costello", "publication": "Rawson Wade", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1981},
             ]},
        ],
    },
    {
        "slug": "wannsee-conference-final-solution-1942",
        "title": "Wannsee Conference — Final Solution Planned",
        "year": 1942, "lat": 52.4333, "lng": 13.1658,
        "geo_modern": "Wannsee, Berlin, Germany", "geo_era_label": "Third Reich",
        "category": "political", "importance_score": 0.93, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Historical/survivor perspective", "culture_code": "il", "viewpoint_type": "academic",
             "narrative": "The Wannsee Conference of January 20, 1942 coordinated the systematic murder of 11 million Jews across Europe. Fifteen senior Nazi officials, over 90 minutes, organized the logistics of genocide — the bureaucracy of the Holocaust.",
             "summary": "The meeting where Nazi bureaucrats calmly planned the industrial murder of all European Jews.", "evidence_score": 0.97,
             "sources": [
                 {"title": "Wannsee Protocol, January 20, 1942", "source_type": "primary", "reliability_tier": 1, "year": 1942},
                 {"title": "The Holocaust: A History", "author": "Deborah Dwork and Robert Jan van Pelt", "publication": "Norton", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002},
             ]},
            {"label": "German denialism (refuted)", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Some German post-war defendants claimed ignorance of the Holocaust. The Wannsee Protocol documents prove senior officials knew and participated in planning genocide. Holocaust denial has been criminalized in Germany and several other countries.",
             "summary": "Documented proof that the Holocaust was systematically planned and executed with full governmental knowledge.", "evidence_score": 0.99,
             "sources": [
                 {"title": "Explaining Hitler", "author": "Ron Rosenbaum", "publication": "Random House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998},
             ]},
        ],
    },
    {
        "slug": "battle-stalingrad-1942-1943",
        "title": "Battle of Stalingrad — Turning Point of WWII",
        "year": 1942, "lat": 48.7080, "lng": 44.5133,
        "geo_modern": "Volgograd (Stalingrad), Russia", "geo_era_label": "Eastern Front WWII",
        "category": "war", "importance_score": 0.96, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Stalingrad was the greatest battle of the war. For six months, Soviet forces held the city street by street. Zhukov's Operation Uranus encircled the German 6th Army; its surrender in February 1943 marked the turning point of the Eastern Front.",
             "summary": "The battle that broke the Wehrmacht's back — the decisive turning point of World War II.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Stalingrad", "author": "Antony Beevor", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998},
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The 6th Army's destruction at Stalingrad (300,000 casualties, 91,000 captured) was the result of Hitler's refusal to allow retreat. Paulus surrendered against Hitler's explicit orders. Germany never recovered the strategic initiative after Stalingrad.",
             "summary": "Hitler's catastrophic refusal to allow retreat destroyed Germany's best army and made final defeat inevitable.", "evidence_score": 0.93,
             "sources": [
                 {"title": "The Road to Stalingrad", "author": "John Erickson", "publication": "Harper & Row", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1975},
             ]},
        ],
    },
    {
        "slug": "d-day-normandy-1944",
        "title": "D-Day — Allied Invasion of Normandy",
        "year": 1944, "lat": 49.3420, "lng": -0.5812,
        "geo_modern": "Normandy, France", "geo_era_label": "WWII Western Front",
        "category": "war", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Allied perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Operation Overlord on June 6, 1944 — the largest amphibious operation in history — landed 156,000 Allied troops on five Normandy beaches. Despite enormous casualties (especially at Omaha Beach), the beachhead was secured and the liberation of Western Europe began.",
             "summary": "The largest military operation in history — the decisive blow that liberated Western Europe from Nazi rule.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Overlord: D-Day and the Battle for Normandy", "author": "Max Hastings", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1984},
             ]},
            {"label": "German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Rommel argued for deploying Panzer reserves near the beaches; Hitler held them back expecting a second landing at Calais. This command paralysis on D-Day allowed the Allies to consolidate the beachhead. Germany had lost the war in the West.",
             "summary": "Hitler's command mistakes on D-Day gave the Allies the foothold that made Germany's defeat inevitable.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Longest Day", "author": "Cornelius Ryan", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1959},
             ]},
        ],
    },
    {
        "slug": "atomic-bombing-hiroshima-nagasaki-1945",
        "title": "Atomic Bombing of Hiroshima and Nagasaki",
        "year": 1945, "lat": 34.3853, "lng": 132.4553,
        "geo_modern": "Hiroshima and Nagasaki, Japan", "geo_era_label": "Pacific War WWII",
        "category": "war", "importance_score": 0.97, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American military perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The atomic bombs dropped on Hiroshima (August 6) and Nagasaki (August 9) ended the war and avoided a ground invasion of Japan that would have cost hundreds of thousands of American and millions of Japanese lives. Truman's decision was justified by the calculation of lives saved.",
             "summary": "A terrible but necessary act that ended the Pacific War without an invasion estimated to cost millions of lives.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Truman's Statement on the Atomic Bomb, August 6, 1945", "author": "Harry S. Truman", "source_type": "primary", "reliability_tier": 1, "year": 1945},
             ]},
            {"label": "Japanese perspective", "culture_code": "jp", "viewpoint_type": "nationalist",
             "narrative": "The atomic bombings killed 70,000-80,000 people instantly at Hiroshima, 40,000 at Nagasaki. Hibakusha (survivors) experienced years of radiation sickness and social stigma. Japan was already seeking peace; the bombs were also a signal to the Soviet Union.",
             "summary": "The first use of nuclear weapons — indiscriminate mass civilian murder — and the traumatic origin of Japan's anti-nuclear stance.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Hiroshima", "author": "John Hersey", "publication": "The New Yorker", "source_type": "primary", "reliability_tier": 2, "year": 1946},
                 {"title": "The Decision to Use the Atomic Bomb", "author": "Gar Alperovitz", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995},
             ]},
        ],
    },
    {
        "slug": "holocaust-liberation-camps-1945",
        "title": "Liberation of Nazi Concentration Camps",
        "year": 1945, "lat": 50.0274, "lng": 19.1785,
        "geo_modern": "Auschwitz-Birkenau, Poland", "geo_era_label": "WWII",
        "category": "war", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Jewish survivor perspective", "culture_code": "il", "viewpoint_type": "indigenous",
             "narrative": "By 1945, six million Jews had been systematically murdered — two-thirds of European Jewry — in the Nazi Holocaust. Liberation of Auschwitz (January 27, 1945) and other camps revealed the full horror. Elie Wiesel's 'Night' preserves the testimony of survivors.",
             "summary": "The liberation reveals the full horror of the Holocaust — six million Jews systematically murdered.", "evidence_score": 0.99,
             "sources": [
                 {"title": "Night", "author": "Elie Wiesel", "publication": "Hill & Wang", "source_type": "primary", "reliability_tier": 1, "year": 1960},
                 {"title": "Nuremberg Trial Records", "source_type": "primary", "reliability_tier": 1, "year": 1946},
             ]},
            {"label": "Allied military perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "American, British, and Soviet soldiers who liberated the camps were unprepared for what they found. Eisenhower ordered documentation and required German civilians to witness the camps. The evidence was used at the Nuremberg trials.",
             "summary": "Allied forces document genocide and create the evidentiary record for international criminal justice.", "evidence_score": 0.97,
             "sources": [
                 {"title": "Eisenhower's Cable Describing Buchenwald, April 15, 1945", "author": "Dwight D. Eisenhower", "source_type": "primary", "reliability_tier": 1, "year": 1945},
             ]},
        ],
    },
    {
        "slug": "germany-surrenders-wwii-1945",
        "title": "Germany Surrenders — End of WWII in Europe",
        "year": 1945, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "Berlin, Germany (Reims, France)", "geo_era_label": "WWII",
        "category": "war", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Allied perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Germany signed unconditional surrender on May 7, 1945 in Reims (V-E Day, May 8). The war in Europe was over. Hitler had died by suicide on April 30 in his Berlin bunker. Europe was liberated but devastated — 35-60 million dead.",
             "summary": "Victory in Europe — but the liberation of a continent came at the cost of tens of millions of lives.", "evidence_score": 0.96,
             "sources": [
                 {"title": "German Instrument of Surrender, May 7, 1945", "source_type": "primary", "reliability_tier": 1, "year": 1945},
             ]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "The Soviet Union bore 27 million of the war's casualties. Soviet forces took Berlin. Victory Day (May 9) is Russia's most sacred national holiday. Western accounts undervalue the Soviet role — it was primarily Soviet blood that defeated Nazi Germany.",
             "summary": "The Soviet Union defeated Nazi Germany at unimaginable cost — its central role in victory is often underplayed in Western history.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Why the Allies Won", "author": "Richard Overy", "publication": "Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995},
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # COLD WAR AND POST-WWII (1945–2000)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "un-charter-signed-1945",
        "title": "United Nations Charter Signed",
        "year": 1945, "lat": 37.7749, "lng": -122.4194,
        "geo_modern": "San Francisco, USA", "geo_era_label": "Post-WWII",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Western democratic perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The UN Charter, signed by 50 nations in San Francisco on June 26, 1945, established an international system to prevent another world war. The Security Council, with five permanent veto-wielding members, reflected the new great power realities.",
             "summary": "A new world order based on international law and collective security to prevent another world war.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Charter of the United Nations, June 26, 1945", "source_type": "primary", "reliability_tier": 1, "year": 1945},
             ]},
            {"label": "Global South/colonial perspective", "culture_code": "in", "viewpoint_type": "colonial",
             "narrative": "The UN was founded by and for the victorious powers. Fifty nations signed, but most of the world's population was still under colonial rule and had no voice. The General Assembly's 'one nation, one vote' principle was undermined by the P5 veto.",
             "summary": "A great power institution whose ideals of equality were contradicted by colonial realities and the great power veto.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Charter of the United Nations: A Commentary", "author": "Bruno Simma", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002},
             ]},
        ],
    },
    {
        "slug": "indian-independence-1947",
        "title": "Indian Independence and Partition",
        "year": 1947, "lat": 28.6139, "lng": 77.2090,
        "geo_modern": "New Delhi, India / Lahore, Pakistan", "geo_era_label": "British India",
        "category": "political", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Indian National Congress perspective", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "Independence on August 15, 1947 fulfilled Gandhi and Nehru's non-violent struggle. India became the world's largest democracy. Partition, however, was a catastrophe — 14 million displaced, 200,000-2 million killed in communal violence.",
             "summary": "Freedom achieved but stained by Partition — one of the largest mass displacements in history.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Discovery of India", "author": "Jawaharlal Nehru", "publication": "Meridian Books", "source_type": "primary", "reliability_tier": 2, "year": 1946},
                 {"title": "Freedom at Midnight", "author": "Larry Collins and Dominique Lapierre", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1975},
             ]},
            {"label": "Pakistani/Muslim League perspective", "culture_code": "pk", "viewpoint_type": "nationalist",
             "narrative": "Jinnah's two-nation theory argued Muslims needed a separate state to avoid Hindu-majority domination. Pakistan was founded as a homeland for South Asian Muslims. The violence of Partition demonstrated how deep the divisions had become.",
             "summary": "Pakistan founded as the necessary homeland for South Asian Muslims who could not safely remain in Hindu-dominated India.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Jinnah: India, Partition, Independence", "author": "Jaswant Singh", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009},
             ]},
        ],
    },
    {
        "slug": "berlin-blockade-airlift-1948",
        "title": "Berlin Blockade and Airlift",
        "year": 1948, "lat": 52.5200, "lng": 13.4050,
        "geo_modern": "West Berlin, Germany", "geo_era_label": "Cold War",
        "category": "political", "importance_score": 0.87, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Western/American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Soviet blockade of West Berlin (June 1948-May 1949) was met with the Berlin Airlift — over 200,000 flights supplying the city. America's determination to defend West Berlin became a defining act of Cold War resolve.",
             "summary": "American airlift defies Soviet blockade — Cold War resolve at its finest.", "evidence_score": 0.89,
             "sources": [
                 {"title": "The Berlin Blockade", "author": "Ann Tusa and John Tusa", "publication": "Hodder & Stoughton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988},
             ]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "The Soviet blockade was a response to Western currency reform that threatened Soviet interests in Germany. The failure of the blockade demonstrated the West's resolve but also the Soviets' reluctance to risk open war over Berlin.",
             "summary": "A measured pressure tactic in response to Western economic provocations — withdrawn when it failed.", "evidence_score": 0.77,
             "sources": [
                 {"title": "Stalin: A Biography", "author": "Robert Service", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004},
             ]},
        ],
    },
    {
        "slug": "founding-state-of-israel-1948",
        "title": "Declaration of the State of Israel",
        "year": 1948, "lat": 32.0853, "lng": 34.7818,
        "geo_modern": "Tel Aviv, Israel", "geo_era_label": "British Mandate Palestine",
        "category": "political", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Israeli/Zionist perspective", "culture_code": "il", "viewpoint_type": "nationalist",
             "narrative": "David Ben-Gurion's proclamation of Israeli independence on May 14, 1948 fulfilled the Zionist dream after 2,000 years of Jewish exile. The Holocaust had made a Jewish state a moral necessity. Israel immediately faced invasion by five Arab armies and survived.",
             "summary": "The fulfillment of the Jewish people's 2,000-year aspiration for a homeland after the Holocaust.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Israeli Declaration of Independence, May 14, 1948", "source_type": "primary", "reliability_tier": 1, "year": 1948},
             ]},
            {"label": "Palestinian perspective", "culture_code": "ps", "viewpoint_type": "indigenous",
             "narrative": "The Nakba (catastrophe) — 700,000 Palestinian Arabs expelled or fled during the 1948 war, their villages destroyed. Palestinian historiography documents the ethnic cleansing. The 'refugee problem' created in 1948 remains unresolved 75 years later.",
             "summary": "The Nakba: 700,000 Palestinians expelled, villages destroyed — the unresolved tragedy at the heart of the conflict.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Ethnic Cleansing of Palestine", "author": "Ilan Pappé", "publication": "Oneworld", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006},
             ]},
        ],
    },
    {
        "slug": "chinese-revolution-peoples-republic-1949",
        "title": "Chinese Communist Revolution — People's Republic Founded",
        "year": 1949, "lat": 39.9042, "lng": 116.4074,
        "geo_modern": "Beijing, China", "geo_era_label": "China Civil War",
        "category": "political", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Communist Party/Maoist perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Mao Zedong's proclamation of the People's Republic of China on October 1, 1949 ended a century of humiliation under foreign powers. The Communist revolution liberated the Chinese people from feudalism, imperialism, and Nationalist corruption.",
             "summary": "The liberation of China from a century of humiliation and the founding of a new socialist state.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Selected Works of Mao Tse-tung", "author": "Mao Zedong", "source_type": "primary", "reliability_tier": 2, "year": 1961},
             ]},
            {"label": "Western/Nationalist perspective", "culture_code": "tw", "viewpoint_type": "nationalist",
             "narrative": "The 'fall of China' to communism was a strategic catastrophe for the West. Chiang Kai-shek's Nationalists retreated to Taiwan, which maintains its own democratic government. The Communist regime would cause tens of millions of deaths in subsequent campaigns.",
             "summary": "The fall of China to communism — a geopolitical catastrophe that reshaped the Cold War balance.", "evidence_score": 0.81,
             "sources": [
                 {"title": "Mao: The Unknown Story", "author": "Jung Chang and Jon Halliday", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005},
             ]},
        ],
    },
    {
        "slug": "korean-war-1950-1953",
        "title": "Korean War",
        "year": 1950, "lat": 37.5665, "lng": 126.9780,
        "geo_modern": "Korean Peninsula", "geo_era_label": "Cold War",
        "category": "war", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American/UN perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "North Korea's invasion of South Korea on June 25, 1950 triggered the first major military response by the new UN system. US-led UN forces repelled the invasion, then were checked by Chinese intervention. The armistice of 1953 restored the status quo at enormous cost.",
             "summary": "The first 'hot' conflict of the Cold War — the UN system's first major military test.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Korean War", "author": "Max Hastings", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987},
             ]},
            {"label": "Korean perspective (both sides)", "culture_code": "kr", "viewpoint_type": "nationalist",
             "narrative": "The Korean War killed 3-4 million Koreans, destroyed the peninsula, and left a division that persists today. For Koreans, it was a civil war exacerbated by Cold War great powers treating Korea as a proxy battlefield. The 'Forgotten War' remains unresolved.",
             "summary": "A devastating civil war exploited by Cold War powers, leaving a permanent division and millions of casualties.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Korean War: History and Reconciliation", "author": "William Stueck", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995},
             ]},
        ],
    },
    {
        "slug": "decolonization-ghana-independence-1957",
        "title": "Ghana Independence — Beginning of African Decolonization",
        "year": 1957, "lat": 5.6037, "lng": -0.1870,
        "geo_modern": "Accra, Ghana", "geo_era_label": "British Empire",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Pan-African perspective", "culture_code": "gh", "viewpoint_type": "nationalist",
             "narrative": "Ghana became the first sub-Saharan African colony to gain independence on March 6, 1957 under Kwame Nkrumah. His declaration 'Ghana is free forever' inspired liberation movements across Africa. By 1965, 35 African nations were independent.",
             "summary": "The dawn of African independence — Ghana leads the continent's liberation from colonial rule.", "evidence_score": 0.91,
             "sources": [
                 {"title": "Africa Must Unite", "author": "Kwame Nkrumah", "publication": "Praeger", "source_type": "primary", "reliability_tier": 2, "year": 1963},
             ]},
            {"label": "British colonial perspective", "culture_code": "gb", "viewpoint_type": "colonial",
             "narrative": "Britain managed the transition to Ghanaian independence as an orderly handover to a prepared elite. The Commonwealth maintained ties and technical assistance. Macmillan's 'Wind of Change' speech (1960) acknowledged the inevitable.",
             "summary": "An orderly transition to independence within the Commonwealth framework.", "evidence_score": 0.74,
             "sources": [
                 {"title": "Macmillan's 'Wind of Change' Speech, February 3, 1960", "author": "Harold Macmillan", "source_type": "primary", "reliability_tier": 1, "year": 1960},
             ]},
        ],
    },
    {
        "slug": "cuban-missile-crisis-1962",
        "title": "Cuban Missile Crisis",
        "year": 1962, "lat": 23.1136, "lng": -82.3666,
        "geo_modern": "Cuba / Washington D.C.", "geo_era_label": "Cold War",
        "category": "political", "importance_score": 0.96, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Kennedy's blockade of Cuba and ultimatum to Khrushchev to remove Soviet missiles brought the world to the brink of nuclear war. Kennedy's calm resolve and backchannel diplomacy averted catastrophe. ExComm transcripts show how close to war they came.",
             "summary": "Thirteen days that brought humanity to the edge of nuclear annihilation — resolved by careful diplomacy.", "evidence_score": 0.93,
             "sources": [
                 {"title": "Thirteen Days", "author": "Robert F. Kennedy", "publication": "Norton", "source_type": "primary", "reliability_tier": 2, "year": 1969},
             ]},
            {"label": "Soviet/Cuban perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Soviet missiles in Cuba were a response to US missiles in Turkey and the Bay of Pigs invasion. The resolution included a secret US promise to remove Turkish missiles. Khrushchev showed restraint; Cuba was not consulted on the deal and felt betrayed.",
             "summary": "Soviet deterrence justified by US missiles in Turkey; Cuba betrayed in the final deal.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Khrushchev Remembers", "author": "Nikita Khrushchev", "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 2, "year": 1970},
             ]},
        ],
    },
    {
        "slug": "assassination-jfk-1963",
        "title": "Assassination of President Kennedy",
        "year": 1963, "lat": 32.7793, "lng": -96.8085,
        "geo_modern": "Dallas, Texas, USA", "geo_era_label": "Cold War USA",
        "category": "political", "importance_score": 0.89, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Warren Commission perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Warren Commission concluded that Lee Harvey Oswald, acting alone, shot President Kennedy on November 22, 1963. The Commission found no credible evidence of conspiracy. This remains the official US government conclusion.",
             "summary": "A lone gunman's act that shocked the world and ended the Camelot era of American politics.", "evidence_score": 0.76,
             "sources": [
                 {"title": "Report of the Warren Commission on the Assassination of President Kennedy", "source_type": "primary", "reliability_tier": 1, "year": 1964},
             ]},
            {"label": "Conspiracy/HSCA perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The 1979 House Select Committee on Assassinations concluded Kennedy 'was probably assassinated as a result of a conspiracy.' Acoustic evidence suggested multiple shooters. Polls consistently show most Americans believe a conspiracy was involved.",
             "summary": "Congressional investigation found probable conspiracy; the full truth may never be known.", "evidence_score": 0.68,
             "sources": [
                 {"title": "House Select Committee on Assassinations Final Report, 1979", "source_type": "primary", "reliability_tier": 1, "year": 1979},
             ]},
        ],
    },
    {
        "slug": "civil-rights-act-usa-1964",
        "title": "Civil Rights Act of 1964 — USA",
        "year": 1964, "lat": 38.9072, "lng": -77.0369,
        "geo_modern": "Washington D.C., USA", "geo_era_label": "Civil Rights Movement USA",
        "category": "political", "importance_score": 0.91, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "African American civil rights perspective", "culture_code": "us", "viewpoint_type": "indigenous",
             "narrative": "The Civil Rights Act, signed by LBJ on July 2, 1964, outlawed discrimination on race, color, religion, sex, or national origin. Won through a decade of nonviolent protest led by MLK, the NAACP, and SNCC, it was the most significant civil rights legislation since the 14th Amendment.",
             "summary": "The culmination of the civil rights movement — outlawing racial discrimination after a century of Jim Crow.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Civil Rights Act of 1964", "source_type": "primary", "reliability_tier": 1, "year": 1964},
                 {"title": "'I Have a Dream' Speech", "author": "Martin Luther King Jr.", "source_type": "primary", "reliability_tier": 1, "year": 1963},
             ]},
            {"label": "Southern segregationist perspective (refuted)", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Southern Democrats argued the Act was federal overreach into states' rights. Strom Thurmond and others filibustered. The Act's long-term political consequence was the 'Southern Strategy' — Republicans winning the white South by appealing to racial resentment.",
             "summary": "Southern resistance reflected deep racial resentment that politicians would exploit for decades.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Political History of the Civil Rights Act", "author": "Clay Risen", "publication": "FSG", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014},
             ]},
        ],
    },
    {
        "slug": "vietnam-war-tet-offensive-1968",
        "title": "Tet Offensive — Vietnam War",
        "year": 1968, "lat": 16.0544, "lng": 108.2022,
        "geo_modern": "South Vietnam (multiple cities)", "geo_era_label": "Vietnam War",
        "category": "war", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Tet Offensive (January 30, 1968) was a military defeat for North Vietnam and the Viet Cong, who suffered enormous casualties. But the scale of the attack destroyed public confidence in the war and LBJ's assurances of progress. Walter Cronkite called it a stalemate.",
             "summary": "A military failure that was a propaganda victory — shattering American confidence in the war.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Tet!: The Turning Point in the Vietnam War", "author": "Don Oberdorfer", "publication": "Doubleday", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1971},
             ]},
            {"label": "Vietnamese (North/NLF) perspective", "culture_code": "vn", "viewpoint_type": "nationalist",
             "narrative": "The Tet Offensive demonstrated that after years of US bombing and 500,000 troops, the NLF could still strike the US Embassy in Saigon. Though costly, it achieved the strategic goal of breaking American will to continue the war. Vietnamese determination would ultimately prevail.",
             "summary": "A costly strategic success that broke the American will to fight — demonstrating Vietnamese determination.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Pentagon Papers", "source_type": "primary", "reliability_tier": 1, "year": 1971},
             ]},
        ],
    },
    {
        "slug": "moon-landing-1969",
        "title": "Apollo 11 — First Moon Landing",
        "year": 1969, "lat": 0.6741, "lng": 23.4733,
        "geo_modern": "Sea of Tranquility, Moon", "geo_era_label": "Space Race",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "Neil Armstrong's 'one small step' on July 20, 1969 fulfilled Kennedy's 1961 challenge and demonstrated American technological supremacy over the Soviet Union in the Space Race. 600 million watched on television — humanity's greatest technological achievement.",
             "summary": "Humanity's greatest technological achievement and the Cold War's most spectacular American victory.", "evidence_score": 0.97,
             "sources": [
                 {"title": "Apollo 11 Mission Report", "source_type": "primary", "reliability_tier": 1, "year": 1969},
             ]},
            {"label": "Global/humanist perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Armstrong said 'one giant leap for mankind' — and the achievement was genuinely shared by thousands of scientists of many nationalities, including contributions from German rocket scientists (von Braun) and female African American mathematicians (Katherine Johnson).",
             "summary": "A human achievement built on the work of thousands across nationalities, including those history has often erased.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Hidden Figures", "author": "Margot Lee Shetterly", "publication": "Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2016},
             ]},
        ],
    },
    {
        "slug": "fall-of-berlin-wall-1989",
        "title": "Fall of the Berlin Wall",
        "year": 1989, "lat": 52.5163, "lng": 13.3777,
        "geo_modern": "Berlin, Germany", "geo_era_label": "Late Cold War",
        "category": "political", "importance_score": 0.96, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "West German/Western perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The fall of the Berlin Wall on November 9, 1989 was the defining moment of the Cold War's end. Crowds of East Germans poured through the checkpoints as border guards stood aside. Reagan's 'Tear down this wall!' seemed vindicated.",
             "summary": "The Cold War's most symbolic moment — Europe reunited and communism's defeat made manifest.", "evidence_score": 0.93,
             "sources": [
                 {"title": "The Wall: The Inside Story of Divided Berlin", "author": "Frederick Taylor", "publication": "HarperCollins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006},
             ]},
            {"label": "East German perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "The wall fell due to a miscommunication at an East German press conference combined with mass popular protest. For East Germans, reunification brought freedom but also economic dislocation, unemployment, and a sense that 'the West won' imposed its culture on the East.",
             "summary": "Freedom arrived, but reunification brought economic shock and a suppression of East German identity.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Year That Changed the World", "author": "Michael Meyer", "publication": "Scribner", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009},
             ]},
        ],
    },
    {
        "slug": "dissolution-soviet-union-1991",
        "title": "Dissolution of the Soviet Union",
        "year": 1991, "lat": 55.7558, "lng": 37.6173,
        "geo_modern": "Moscow, Russia", "geo_era_label": "Soviet Union",
        "category": "political", "importance_score": 0.96, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Western/American perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Soviet Union's dissolution on December 25, 1991 ended the Cold War and the communist experiment. Reagan's military buildup, the Afghan quagmire, and economic dysfunction combined to make the USSR unsustainable. Liberal democracy had 'won history.'",
             "summary": "The end of the Cold War and vindication of Western liberal democracy over Soviet communism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The End of History and the Last Man", "author": "Francis Fukuyama", "publication": "Free Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1992},
             ]},
            {"label": "Russian perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Gorbachev's reforms inadvertently triggered the USSR's collapse. For Russians who lived through the 1990s — economic collapse, oligarchy, NATO expansion — the dissolution was a geopolitical catastrophe Putin called 'the greatest tragedy of the 20th century.'",
             "summary": "A geopolitical catastrophe that led to Russian humiliation, economic collapse, and the conditions for Putin's revanchism.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Putin's Russia", "author": "Anna Politkovskaya", "publication": "Harvill Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004},
             ]},
        ],
    },
    {
        "slug": "rwandan-genocide-1994",
        "title": "Rwandan Genocide",
        "year": 1994, "lat": -1.9403, "lng": 29.8739,
        "geo_modern": "Kigali, Rwanda", "geo_era_label": "Post-Cold War Africa",
        "category": "war", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Tutsi survivor perspective", "culture_code": "rw", "viewpoint_type": "indigenous",
             "narrative": "Between April and July 1994, approximately 500,000-800,000 Tutsi and moderate Hutu were killed in 100 days — the fastest genocide in history. Machetes were the primary weapon. Radio broadcasts called on Hutu to kill their neighbors. The world watched and did nothing.",
             "summary": "The fastest genocide in history — 800,000 people murdered in 100 days while the world deliberated.", "evidence_score": 0.96,
             "sources": [
                 {"title": "We Wish to Inform You That Tomorrow We Will Be Killed With Our Families", "author": "Philip Gourevitch", "publication": "FSG", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998},
             ]},
            {"label": "International/UN perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "UN commander Roméo Dallaire pleaded for authorization to intervene and was refused. The US and UN deliberately avoided using the word 'genocide' to avoid intervention obligations. Western indifference to African lives was starkly exposed.",
             "summary": "International failure: the UN had troops on the ground but was prevented from stopping genocide by great power indifference.", "evidence_score": 0.94,
             "sources": [
                 {"title": "Shake Hands with the Devil", "author": "Roméo Dallaire", "publication": "Random House", "source_type": "primary", "reliability_tier": 2, "year": 2003},
             ]},
        ],
    },
    {
        "slug": "south-africa-apartheid-ends-1994",
        "title": "South Africa's First Democratic Election — End of Apartheid",
        "year": 1994, "lat": -33.9249, "lng": 18.4241,
        "geo_modern": "South Africa", "geo_era_label": "Post-Apartheid South Africa",
        "category": "political", "importance_score": 0.92, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "ANC/Black South African perspective", "culture_code": "za", "viewpoint_type": "nationalist",
             "narrative": "Nelson Mandela's election as South Africa's first Black president on April 27, 1994 ended 46 years of apartheid and the legacy of centuries of racial oppression. The Truth and Reconciliation Commission offered a model of restorative justice for the world.",
             "summary": "The miracle of peaceful transition — Mandela's election ends apartheid and models restorative justice.", "evidence_score": 0.93,
             "sources": [
                 {"title": "Long Walk to Freedom", "author": "Nelson Mandela", "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 1, "year": 1994},
             ]},
            {"label": "White South African perspective", "culture_code": "za", "viewpoint_type": "nationalist",
             "narrative": "F.W. de Klerk's decision to unban the ANC and release Mandela enabled a negotiated transition that avoided civil war. Many white South Africans feared majority rule; the TRC offered amnesty in exchange for truth, not punishment.",
             "summary": "Negotiated transition avoids civil war — a fragile but remarkable democratic achievement.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Last Trek: A New Beginning", "author": "F.W. de Klerk", "publication": "Macmillan", "source_type": "primary", "reliability_tier": 2, "year": 1998},
             ]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL EVENTS TO REACH 500
    # ═══════════════════════════════════════════════════════════════════════

    # Ancient world additions
    {
        "slug": "athens-democracy-507bce",
        "title": "Cleisthenes Establishes Athenian Democracy",
        "year": -507, "lat": 37.9715, "lng": 23.7267,
        "geo_modern": "Athens, Greece", "geo_era_label": "Classical Athens",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Athenian democratic perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Cleisthenes' reforms of 508-507 BCE established direct democracy in Athens — the first in history. All male Athenian citizens could vote in the Assembly, serve on juries, and hold office. This model inspired democratic theory for 2,500 years.",
             "summary": "The invention of democracy — a political system that would define Western civilization.", "evidence_score": 0.88,
             "sources": [{"title": "The Constitution of the Athenians", "author": "Aristotle", "source_type": "primary", "reliability_tier": 2, "year": -330}]},
            {"label": "Modern critical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Athenian democracy excluded women, slaves (40-80% of population), and foreigners. It was democracy for a citizen minority. Yet the principles of direct participation and accountability to citizens proved revolutionary.",
             "summary": "Democracy for citizens only — revolutionary principles built on the exclusion of most people.", "evidence_score": 0.85,
             "sources": [{"title": "Democracy: A Very Short Introduction", "author": "Bernard Crick", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]},
        ],
    },
    {
        "slug": "socrates-trial-399bce",
        "title": "Trial and Death of Socrates",
        "year": -399, "lat": 37.9715, "lng": 23.7267,
        "geo_modern": "Athens, Greece", "geo_era_label": "Classical Athens",
        "category": "cultural", "importance_score": 0.86, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Socratic/philosophical perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Socrates, charged with impiety and corrupting Athenian youth, refused to flee and accepted the hemlock sentence. His death, as recorded by Plato in the Apology and Phaedo, became philosophy's founding martyrdom.",
             "summary": "Philosophy's founding martyr — choosing death over abandoning the examined life.", "evidence_score": 0.87,
             "sources": [{"title": "Apology of Socrates", "author": "Plato", "source_type": "primary", "reliability_tier": 2, "year": -390}]},
            {"label": "Athenian democratic perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Socrates had associated with oligarchs who overthrew democracy. His trial was a political prosecution following the trauma of the Thirty Tyrants. The democratic restored government tried a man who had undermined democratic values.",
             "summary": "A politically motivated trial of a man whose associations with anti-democratic forces made him a genuine threat.", "evidence_score": 0.74,
             "sources": [{"title": "Socrates on Trial", "author": "Thomas Brickhouse and Nicholas Smith", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]},
        ],
    },
    {
        "slug": "peloponnesian-war-431-404bce",
        "title": "Peloponnesian War — Athens vs. Sparta",
        "year": -431, "lat": 37.9715, "lng": 23.7267,
        "geo_modern": "Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance_score": 0.87, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Athenian perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Athens, the greatest democracy of the ancient world, was brought down by Spartan military power and Persian gold. Thucydides' history analyzes how fear, honor, and interest drive states to war regardless of their form of government.",
             "summary": "Democracy versus military oligarchy — Athens destroyed by its own imperial overreach.", "evidence_score": 0.90,
             "sources": [{"title": "History of the Peloponnesian War", "author": "Thucydides", "source_type": "primary", "reliability_tier": 1, "year": -404}]},
            {"label": "Spartan perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Sparta's victory ended Athenian imperial ambition and its oppression of the Delian League members. Spartan hegemony brought stability, though it too proved unsustainable.",
             "summary": "Sparta's victory ends Athenian imperialism but creates a new hegemony equally unstable.", "evidence_score": 0.82,
             "sources": [{"title": "Sparta: Unfit for Empire", "author": "Paul Cartledge", "publication": "Duckworth", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}]},
        ],
    },
    {
        "slug": "roman-republic-founding-509bce",
        "title": "Founding of the Roman Republic",
        "year": -509, "lat": 41.9003, "lng": 12.4534,
        "geo_modern": "Rome, Italy", "geo_era_label": "Roman Republic",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Roman aristocratic perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "The expulsion of the Tarquin kings and founding of the Republic established the Roman system of consuls, Senate, and popular assemblies. The Republic's mixed constitution — balancing monarchical, aristocratic, and democratic elements — was admired by Polybius and later by the American founders.",
             "summary": "The Republic's mixed constitution became the model for all subsequent republican governance.", "evidence_score": 0.83,
             "sources": [{"title": "History of Rome", "author": "Livy", "source_type": "primary", "reliability_tier": 2, "year": -10}]},
            {"label": "Roman plebeian perspective", "culture_code": "it", "viewpoint_type": "nationalist",
             "narrative": "The Republic was founded by and for patricians. Plebeians fought for centuries through the Conflict of the Orders to gain rights — tribunes, the Twelve Tables of law, and eventually access to consulship. The Republic was not democratic until forced by popular struggle.",
             "summary": "A patrician republic that plebeians spent centuries fighting to democratize.", "evidence_score": 0.82,
             "sources": [{"title": "The Roman Revolution", "author": "Ronald Syme", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1939}]},
        ],
    },
    {
        "slug": "han-dynasty-founding-206bce",
        "title": "Founding of the Han Dynasty",
        "year": -206, "lat": 34.2658, "lng": 108.9541,
        "geo_modern": "Chang'an (Xi'an), China", "geo_era_label": "Han Dynasty",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Han Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Liu Bang, a peasant who rose to become Gaozu of Han, founded the dynasty that defined Chinese civilization. The Han embraced Confucianism, expanded the empire, and created cultural and ethnic identity so enduring that Chinese people still call themselves 'Han.'",
             "summary": "The dynasty that defined Chinese civilization and gave the Chinese people their name.", "evidence_score": 0.87,
             "sources": [{"title": "Records of the Grand Historian", "author": "Sima Qian", "source_type": "primary", "reliability_tier": 2, "year": -90}]},
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Han's 400-year reign (interrupted by the interregnum of Wang Mang) established bureaucratic governance based on Confucian meritocracy that would define Chinese government until 1912.",
             "summary": "The Han created the Confucian bureaucratic state that endured for 2,000 years.", "evidence_score": 0.85,
             "sources": [{"title": "China: A History", "author": "John Keay", "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}]},
        ],
    },
    {
        "slug": "maya-civilization-peak-600-900",
        "title": "Maya Classic Period — Zenith of Civilization",
        "year": 700, "lat": 17.2510, "lng": -89.6239,
        "geo_modern": "Tikal, Guatemala", "geo_era_label": "Classic Maya",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "The Classic Maya period (250-900 CE) saw the construction of great cities like Tikal, Copán, and Palenque. Maya civilization achieved advanced writing, astronomy, mathematics (including zero), and monumental architecture without metal tools or the wheel.",
             "summary": "The height of Maya civilization — remarkable science, art, and architecture in the Americas' tropical heartland.", "evidence_score": 0.88,
             "sources": [{"title": "The Ancient Maya", "author": "Robert Sharer", "publication": "Stanford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}]},
            {"label": "Indigenous Maya perspective", "culture_code": "indigenous-maya", "viewpoint_type": "indigenous",
             "narrative": "Maya civilization was not a 'lost' civilization — Maya people continue to exist in millions today. The 'collapse' of the Classic period involved political fragmentation, not extinction. Maya culture, language, and identity persist despite centuries of colonial suppression.",
             "summary": "Maya civilization lives on — the 'collapse' narrative erases the survival of millions of Maya people.", "evidence_score": 0.86,
             "sources": [{"title": "Maya Cultural Heritage and Rights", "author": "Victor Montejo", "publication": "University of Arizona Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}]},
        ],
    },
    {
        "slug": "viking-discovery-north-america-1000",
        "title": "Viking Settlement at Vinland (North America)",
        "year": 1000, "lat": 51.5980, "lng": -55.5247,
        "geo_modern": "L'Anse aux Meadows, Newfoundland, Canada", "geo_era_label": "Viking Age",
        "category": "discovery", "importance_score": 0.83, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Norse/Viking perspective", "culture_code": "no", "viewpoint_type": "nationalist",
             "narrative": "Leif Eriksson, following Bjarni Herjólfsson's sighting, established a Norse settlement at Vinland around 1000 CE — 500 years before Columbus. Archaeological excavation at L'Anse aux Meadows (1960s) confirmed the Norse presence.",
             "summary": "Norse explorers reached North America 500 years before Columbus — the first confirmed European contact.", "evidence_score": 0.90,
             "sources": [{"title": "The Vinland Sagas", "source_type": "primary", "reliability_tier": 2, "year": 1200}, {"title": "The Norse Discovery of America", "author": "Helge Ingstad", "publication": "Norwegian University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1985}]},
            {"label": "Indigenous North American perspective", "culture_code": "indigenous-us", "viewpoint_type": "indigenous",
             "narrative": "Indigenous peoples had 'discovered' and inhabited North America for 15,000+ years before the Norse arrived. Norse sagas record conflicts with 'Skraelings' — the Indigenous people who ultimately repulsed the settlement.",
             "summary": "Norse 'discovery' irrelevant to peoples who had lived there for millennia and whose resistance ended the settlement.", "evidence_score": 0.87,
             "sources": [{"title": "1491: New Revelations of the Americas Before Columbus", "author": "Charles Mann", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}]},
        ],
    },
    {
        "slug": "invention-compass-china-1040",
        "title": "Compass Described in Chinese Military Text",
        "year": 1040, "lat": 39.9042, "lng": 116.4074,
        "geo_modern": "China", "geo_era_label": "Song Dynasty",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "The magnetic compass was invented in China during the Han Dynasty for geomantic purposes and later applied to navigation during the Song Dynasty. Chinese mariners used it to navigate the Indian Ocean trade routes centuries before European adoption.",
             "summary": "China's navigational gift to the world — the compass enabled the Age of Exploration.", "evidence_score": 0.88,
             "sources": [{"title": "Wujing Zongyao (Collection of the Most Important Military Techniques)", "author": "Zeng Gongliang", "source_type": "primary", "reliability_tier": 2, "year": 1044}]},
            {"label": "Global diffusion perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The compass reached Europe via Islamic intermediaries. Each culture adapted it differently — the Chinese used it geomantically and maritimely; Europeans primarily for ocean navigation. The diffusion of the compass exemplifies how technology travels across civilizations.",
             "summary": "A Chinese invention transmitted through Islamic traders that enabled European oceanic exploration.", "evidence_score": 0.85,
             "sources": [{"title": "Four Discoveries: The Ancient Chinese Science", "author": "Robert Temple", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1986}]},
        ],
    },
    {
        "slug": "black-death-arrives-europe-1347",
        "title": "Black Death Arrives in Sicily",
        "year": 1347, "lat": 37.5079, "lng": 15.0830,
        "geo_modern": "Messina, Sicily, Italy", "geo_era_label": "Medieval Europe",
        "category": "natural", "importance_score": 0.85, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Italian merchant perspective", "culture_code": "it", "viewpoint_type": "journalistic",
             "narrative": "Genoese trading ships from Caffa (Crimea) arrived in Messina in October 1347 with crews dying of a mysterious illness. The ships were turned away but the disease had already landed. Within days, plague spread through Sicily and then to mainland Italy.",
             "summary": "The plague arrives in Europe on merchant ships — the point of entry for history's deadliest epidemic.", "evidence_score": 0.88,
             "sources": [{"title": "Historia de Morbo (On the Disease)", "author": "Michele da Piazza", "source_type": "primary", "reliability_tier": 2, "year": 1347}]},
            {"label": "Epidemiological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "DNA evidence from plague victims confirms Yersinia pestis, originating in a Central Asian reservoir. Rat fleas were the primary vector. The epidemic exploited medieval Europe's densely packed cities, poor sanitation, and lack of immunity.",
             "summary": "A bacterial pathogen exploiting medieval conditions — understanding the biology explains the spread.", "evidence_score": 0.95,
             "sources": [{"title": "Plague: A Very Short Introduction", "author": "Paul Slack", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}]},
        ],
    },
    {
        "slug": "ottoman-empire-founding-1299",
        "title": "Founding of the Ottoman Empire",
        "year": 1299, "lat": 40.0157, "lng": 29.5169,
        "geo_modern": "Söğüt, Anatolia (Turkey)", "geo_era_label": "Seljuk Successor States",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Ottoman/Turkish perspective", "culture_code": "tr", "viewpoint_type": "nationalist",
             "narrative": "Osman I founded a small emirate in northwestern Anatolia that would grow over six centuries into an empire spanning three continents. Ottoman rule at its height brought administrative sophistication, religious tolerance, and a multicultural civilization.",
             "summary": "The founding of the empire that would dominate the Mediterranean world for six centuries.", "evidence_score": 0.82,
             "sources": [{"title": "The Ottoman Empire, 1300-1650", "author": "Colin Imber", "publication": "Palgrave", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]},
            {"label": "Byzantine/Greek perspective", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "The Ottoman expansion was the existential threat to Byzantine civilization, ultimately successful in 1453. Greek historiography views Ottoman rule as a centuries-long oppression that ended only with Greek independence in 1821.",
             "summary": "The beginning of a centuries-long threat that would ultimately destroy the Byzantine successor to Rome.", "evidence_score": 0.80,
             "sources": [{"title": "The Ottoman Empire and Its Heritage", "author": "Suraiya Faroqhi", "publication": "Brill", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}]},
        ],
    },
    {
        "slug": "joan-of-arc-1429",
        "title": "Joan of Arc Relieves Siege of Orléans",
        "year": 1429, "lat": 47.9025, "lng": 1.9090,
        "geo_modern": "Orléans, France", "geo_era_label": "Hundred Years' War",
        "category": "war", "importance_score": 0.85, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "French nationalist/Catholic perspective", "culture_code": "fr", "viewpoint_type": "religious",
             "narrative": "Joan of Arc, a peasant girl acting on divine visions, led French forces to relieve Orléans in 1429, turning the tide of the Hundred Years' War. Burned at the stake by the English in 1431, she was canonized in 1920 and became France's national saint.",
             "summary": "Divine inspiration transforms French fortunes — Joan becomes France's eternal symbol of national salvation.", "evidence_score": 0.87,
             "sources": [{"title": "The Trial of Joan of Arc", "source_type": "primary", "reliability_tier": 1, "year": 1431}]},
            {"label": "English perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The English tried Joan for heresy and witchcraft — charges that reflected the belief that her military success must have supernatural (diabolical) rather than natural causes. Her execution was legally proper by contemporary ecclesiastical standards.",
             "summary": "A heresy trial of an opponent; her canonization retroactively condemned England's legal processes.", "evidence_score": 0.75,
             "sources": [{"title": "Joan of Arc: A Military Leader", "author": "Kelly DeVries", "publication": "Sutton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}]},
        ],
    },
    # Additional Renaissance/Exploration events
    {
        "slug": "vasco-da-gama-india-1498",
        "title": "Vasco da Gama Reaches India",
        "year": 1498, "lat": 11.2588, "lng": 75.7804,
        "geo_modern": "Calicut (Kozhikode), India", "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Portuguese perspective", "culture_code": "pt", "viewpoint_type": "nationalist",
             "narrative": "Da Gama's voyage around Africa to India in 1497-1499 opened the direct sea route to Asian spice markets, breaking the Venetian and Arab monopoly. Portugal became the first European power to dominate the Indian Ocean trade.",
             "summary": "The sea route to India — breaking the Muslim/Venetian trade monopoly and launching European oceanic dominance.", "evidence_score": 0.88,
             "sources": [{"title": "Journal of the First Voyage of Vasco da Gama", "author": "Vasco da Gama", "source_type": "primary", "reliability_tier": 2, "year": 1499}]},
            {"label": "Indian/Zamorin perspective", "culture_code": "in", "viewpoint_type": "indigenous",
             "narrative": "The Zamorin of Calicut initially welcomed da Gama but was suspicious of his poor gifts for a rich king. Portuguese demands for trade exclusivity and their attacks on Arab merchants poisoned relations. Da Gama's second voyage (1502) involved massacres of Muslims.",
             "summary": "An unwelcome arrival that disrupted established trade networks and prefigured Portuguese colonial violence.", "evidence_score": 0.83,
             "sources": [{"title": "Sea of Poppies", "author": "Amitav Ghosh", "publication": "FSG", "source_type": "secondary", "reliability_tier": 3, "year": 2008}]},
        ],
    },
    {
        "slug": "magellan-first-circumnavigation-1519-1522",
        "title": "Magellan-Elcano Circumnavigation",
        "year": 1519, "lat": 14.5995, "lng": 120.9842,
        "geo_modern": "Manila, Philippines (via Strait of Magellan)", "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.89, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Spanish/European perspective", "culture_code": "es", "viewpoint_type": "nationalist",
             "narrative": "Ferdinand Magellan's expedition (1519-1522), completed by Juan Sebastián Elcano after Magellan's death in the Philippines, was the first circumnavigation of the globe. It proved Earth is round and estimated its size accurately.",
             "summary": "The first circumnavigation proves the world is round and establishes the true scale of Earth.", "evidence_score": 0.92,
             "sources": [{"title": "Pigafetta's Narrative of Magellan's Voyage", "author": "Antonio Pigafetta", "source_type": "primary", "reliability_tier": 2, "year": 1522}]},
            {"label": "Philippine Indigenous perspective", "culture_code": "ph", "viewpoint_type": "indigenous",
             "narrative": "Magellan was killed by Lapulapu, chief of Mactan island, who refused to submit to Spanish authority. Lapulapu is celebrated as a Philippine national hero — the first to resist European colonization.",
             "summary": "Indigenous resistance defeated and killed the famous European explorer — Lapulapu as Philippine founding hero.", "evidence_score": 0.84,
             "sources": [{"title": "Philippine History", "author": "Gregorio Zaide", "publication": "Rex Bookstore", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}]},
        ],
    },
    {
        "slug": "galileo-telescope-1609",
        "title": "Galileo Improves Telescope and Observes Jupiter's Moons",
        "year": 1609, "lat": 45.4064, "lng": 11.8768,
        "geo_modern": "Padua, Italy", "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "Galileo's telescopic observations in 1609-1610 — mountains on the Moon, moons of Jupiter, phases of Venus — provided empirical evidence for Copernican heliocentrism. His Sidereus Nuncius (1610) changed astronomy forever.",
             "summary": "Empirical observation demolishes Aristotelian cosmology and confirms Copernicus — the telescope as truth-instrument.", "evidence_score": 0.93,
             "sources": [{"title": "Sidereus Nuncius", "author": "Galileo Galilei", "source_type": "primary", "reliability_tier": 1, "year": 1610}]},
            {"label": "Church/Inquisition perspective", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "Galileo's 1633 trial found him 'vehemently suspected of heresy' for promoting heliocentrism. He recanted. The Church's condemnation, later acknowledged as an error by John Paul II in 1992, became the symbol of religion suppressing science.",
             "summary": "The Church condemned Galileo — an error acknowledged 350 years later as science's greatest institutional martyrdom.", "evidence_score": 0.88,
             "sources": [{"title": "Galileo's Sentence by the Inquisition, June 22, 1633", "source_type": "primary", "reliability_tier": 1, "year": 1633}]},
        ],
    },
    {
        "slug": "newton-principia-1687",
        "title": "Newton Publishes Principia Mathematica",
        "year": 1687, "lat": 52.2053, "lng": 0.1218,
        "geo_modern": "Cambridge, England", "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Scientific perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Newton's Philosophiæ Naturalis Principia Mathematica (1687) established classical mechanics — the laws of motion and universal gravitation. It unified terrestrial and celestial physics and created the mathematical framework that dominated science for 200 years.",
             "summary": "The greatest scientific work before Einstein — establishing the laws governing all motion from apples to planets.", "evidence_score": 0.97,
             "sources": [{"title": "Principia Mathematica", "author": "Isaac Newton", "source_type": "primary", "reliability_tier": 1, "year": 1687}]},
            {"label": "Enlightenment cultural perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Newton's success created the Enlightenment belief that reason could explain and reform all human affairs. Philosophes applied 'Newtonian' reasoning to politics, economics, and society — directly inspiring the American and French Revolutions.",
             "summary": "Newton's physics inspired the Enlightenment belief that reason could solve all human problems.", "evidence_score": 0.90,
             "sources": [{"title": "The Enlightenment: A Very Short Introduction", "author": "John Robertson", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2015}]},
        ],
    },
    # Industrial Revolution additions
    {
        "slug": "trans-atlantic-slave-trade-peak-1780",
        "title": "Peak of the Transatlantic Slave Trade",
        "year": 1780, "lat": 14.7167, "lng": -17.4677,
        "geo_modern": "Gorée Island, Senegal (to Caribbean/Americas)", "geo_era_label": "Atlantic Slave Trade",
        "category": "political", "importance_score": 0.93, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "African diaspora perspective", "culture_code": "ng", "viewpoint_type": "indigenous",
             "narrative": "The transatlantic slave trade forcibly transported 12.5 million Africans to the Americas between 1500-1900. An estimated 1.8 million died during the Middle Passage. The trade destroyed African societies and created the racial hierarchy that structures inequality to this day.",
             "summary": "The largest forced migration in history — 12.5 million enslaved Africans transported across the Atlantic.", "evidence_score": 0.96,
             "sources": [{"title": "The Slave Trade Database (Trans-Atlantic Slave Trade Database)", "source_type": "primary", "reliability_tier": 1, "year": 2020}]},
            {"label": "European commercial perspective", "culture_code": "gb", "viewpoint_type": "colonial",
             "narrative": "British merchants justified the slave trade as essential to the colonial economy and to 'civilizing' Africans. The trade was legal, regulated, and profited the Crown, aristocracy, and commercial classes. Abolition came only after sustained moral campaigning.",
             "summary": "Legally sanctioned commerce that enriched European capitals and drove colonial productivity.", "evidence_score": 0.80,
             "sources": [{"title": "Capitalism and Slavery", "author": "Eric Williams", "publication": "University of North Carolina Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1944}]},
        ],
    },
    {
        "slug": "napoleon-waterloo-1815",
        "title": "Battle of Waterloo — Napoleon's Final Defeat",
        "year": 1815, "lat": 50.6795, "lng": 4.4120,
        "geo_modern": "Waterloo, Belgium", "geo_era_label": "Napoleonic Wars",
        "category": "war", "importance_score": 0.90, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Allied/Wellington perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Wellington called Waterloo 'the nearest run thing you ever saw.' The Prussian arrival under Blücher turned a defensive stand into a rout of Napoleon's Imperial Guard. Napoleon's exile to St. Helena ended the Napoleonic era and restored European order.",
             "summary": "Napoleon's final defeat — Wellington and Blücher together end the Napoleonic era and restore Europe's monarchies.", "evidence_score": 0.91,
             "sources": [{"title": "Wellington's Waterloo Dispatch", "author": "Duke of Wellington", "source_type": "primary", "reliability_tier": 1, "year": 1815}]},
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Napoleon's defeat resulted from the failure of Grouchy to intercept the Prussians and Ney's tactical errors. France went from master of Europe to occupied territory, paying reparations and hosting Allied armies. Napoleon's legacy — Civil Code, meritocracy — outlasted his defeat.",
             "summary": "Military defeat but legal and administrative victory — Napoleonic reforms survived the battle.", "evidence_score": 0.86,
             "sources": [{"title": "Waterloo: The History of Four Days, Three Armies and Three Battles", "author": "Bernard Cornwell", "publication": "HarperCollins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2014}]},
        ],
    },
    {
        "slug": "opium-wars-china-britain-1839",
        "title": "First Opium War — China vs. Britain",
        "year": 1839, "lat": 22.3193, "lng": 114.1694,
        "geo_modern": "Canton (Guangzhou), China", "geo_era_label": "Qing Dynasty",
        "category": "war", "importance_score": 0.89, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "British commercial perspective", "culture_code": "gb", "viewpoint_type": "colonial",
             "narrative": "China's seizure of British-owned opium and refusal to open to free trade required a military response. The Treaty of Nanking (1842) opened five treaty ports and ceded Hong Kong — a commercial success justified by free trade principles.",
             "summary": "Britain opens China to free trade by force — a triumph of commercial liberalism.", "evidence_score": 0.75,
             "sources": [{"title": "Treaty of Nanking, 1842", "source_type": "primary", "reliability_tier": 1, "year": 1842}]},
            {"label": "Chinese perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "Britain forced China to import opium to correct a trade imbalance — deliberately addicting China's population to a drug. The 'Century of Humiliation' (1839-1949) begins with the Opium Wars, forcing China to accept unequal treaties and foreign domination.",
             "summary": "Drug-enforced colonial subjugation — the beginning of China's 'century of humiliation.'", "evidence_score": 0.91,
             "sources": [{"title": "The Opium War: Drugs, Dreams and the Making of China", "author": "Julia Lovell", "publication": "Picador", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}]},
        ],
    },
    {
        "slug": "meiji-restoration-japan-1868",
        "title": "Meiji Restoration — Japan Modernizes",
        "year": 1868, "lat": 35.6762, "lng": 139.6503,
        "geo_modern": "Tokyo (Edo), Japan", "geo_era_label": "Meiji Japan",
        "category": "political", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Japanese modernist perspective", "culture_code": "jp", "viewpoint_type": "nationalist",
             "narrative": "The Meiji Restoration transformed Japan from a feudal isolate to a modern industrial power in one generation. Japan adopted Western technology and institutions while preserving Japanese culture. By 1905, Japan defeated Russia — the first Asian nation to defeat a European power.",
             "summary": "The fastest modernization in history — Japan transforms itself to resist Western colonization.", "evidence_score": 0.91,
             "sources": [{"title": "The Meiji Restoration", "author": "W.G. Beasley", "publication": "Stanford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1972}]},
            {"label": "Traditional/peasant perspective", "culture_code": "jp", "viewpoint_type": "nationalist",
             "narrative": "Modernization came at the cost of rural populations squeezed by new taxes to fund industrialization. Samurai class was abolished; traditional ways disrupted. The dark side of Meiji nationalism emerged in militarism and imperialism in Korea and China.",
             "summary": "Rapid modernization imposed on peasants and minorities, whose suffering funded Japan's industrial rise.", "evidence_score": 0.83,
             "sources": [{"title": "Japan's Modern History", "author": "Andrew Gordon", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}]},
        ],
    },
    # More 20th century events
    {
        "slug": "russo-japanese-war-1904-1905",
        "title": "Russo-Japanese War",
        "year": 1904, "lat": 38.9172, "lng": 121.6148,
        "geo_modern": "Manchuria and Korea", "geo_era_label": "Imperial rivalries",
        "category": "war", "importance_score": 0.85, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Japanese perspective", "culture_code": "jp", "viewpoint_type": "nationalist",
             "narrative": "Japan's defeat of Russia in 1904-05 — the first Asian nation to defeat a European power in modern times — shocked the world and inspired nationalist movements across Asia. The Battle of Tsushima annihilated the Russian fleet.",
             "summary": "Asia defeats Europe for the first time — inspiring anti-colonial movements worldwide.", "evidence_score": 0.89,
             "sources": [{"title": "The Russo-Japanese War, 1904-05", "author": "Denis and Peggy Warner", "publication": "Cassell", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1974}]},
            {"label": "Russian perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Defeat in Manchuria and the humiliation of Tsushima exposed Russian military inadequacy and contributed to the 1905 Revolution. The war demonstrated that Tsarist Russia could not compete with modernized Asian powers.",
             "summary": "Military humiliation exposing tsarist Russia's weakness and fueling revolutionary sentiment.", "evidence_score": 0.85,
             "sources": [{"title": "Russia in the Age of Modernisation and Revolution", "author": "Hans Rogger", "publication": "Longman", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}]},
        ],
    },
    {
        "slug": "titanic-sinks-1912",
        "title": "RMS Titanic Sinks",
        "year": 1912, "lat": 41.7258, "lng": -49.9477,
        "geo_modern": "North Atlantic Ocean", "geo_era_label": "Edwardian Britain",
        "category": "natural", "importance_score": 0.80, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "British/class perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "The Titanic disaster on April 15, 1912 killed 1,517 of 2,224 passengers. Third-class passengers had survival rates far lower than first-class — the ship's class segregation was maintained even in disaster. The tragedy exposed Edwardian class inequality.",
             "summary": "A disaster that exposed the lethal consequences of Edwardian class hierarchy.", "evidence_score": 0.88,
             "sources": [{"title": "A Night to Remember", "author": "Walter Lord", "publication": "Holt", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1955}]},
            {"label": "Maritime/technical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Titanic disaster revealed systemic failures: too few lifeboats, inadequate lookout for ice, excessive speed. The subsequent SOLAS conventions mandated sufficient lifeboats and 24-hour radio watches, saving countless future lives.",
             "summary": "A tragedy that improved maritime safety standards for generations.", "evidence_score": 0.90,
             "sources": [{"title": "The Titanic and the Law of the Sea", "author": "David Foxton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1912}]},
        ],
    },
    {
        "slug": "ww1-poison-gas-ypres-1915",
        "title": "First Large-Scale Poison Gas Attack — Ypres",
        "year": 1915, "lat": 50.8503, "lng": 2.8737,
        "geo_modern": "Ypres, Belgium", "geo_era_label": "Western Front WWI",
        "category": "war", "importance_score": 0.83, "zoom_min": 4, "is_bce": False,
        "perspectives": [
            {"label": "Allied/British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Germany's chlorine gas attack at Second Ypres on April 22, 1915 was the first large-scale use of chemical weapons in warfare. Allied soldiers described the yellow-green cloud approaching, the burning, the desperate retreat. It violated accepted norms of warfare.",
             "summary": "The debut of chemical warfare — a new category of mass atrocity that violated all existing rules of war.", "evidence_score": 0.90,
             "sources": [{"title": "Death's Men: Soldiers of the Great War", "author": "Denis Winter", "publication": "Allen Lane", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1978}]},
            {"label": "German military perspective", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "German chemist Fritz Haber developed the chlorine gas deployment as a necessary military innovation. Germany argued the Hague Conventions only banned projectile-delivered chemicals, not released gas. The Allies quickly developed their own chemical weapons.",
             "summary": "A military innovation justified by legal technicality — but one that opened Pandora's box of mass atrocity.", "evidence_score": 0.82,
             "sources": [{"title": "A Higher Form of Killing", "author": "Robert Harris", "publication": "Chatto & Windus", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1982}]},
        ],
    },
    {
        "slug": "chinese-great-leap-forward-1958",
        "title": "China's Great Leap Forward",
        "year": 1958, "lat": 39.9042, "lng": 116.4074,
        "geo_modern": "China", "geo_era_label": "Maoist China",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Communist Party perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "The Great Leap Forward (1958-1962) aimed to rapidly industrialize China through collective farming and backyard steel production. The Party maintained it was a bold attempt to transform China despite initial difficulties.",
             "summary": "An ambitious industrialization drive that the Party initially defended as a necessary transformation.", "evidence_score": 0.55,
             "sources": [{"title": "Selected Works of Mao Tse-tung, Vol. 5", "author": "Mao Zedong", "source_type": "primary", "reliability_tier": 2, "year": 1961}]},
            {"label": "Historical/survivor perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Great Leap Forward caused the worst famine in human history — 15-55 million deaths (estimates vary). Forced collectivization destroyed agricultural output; officials falsified production figures; dissent was punished. It remains China's greatest self-inflicted catastrophe.",
             "summary": "Ideology-driven policy causing the world's deadliest famine — 15-55 million Chinese died of starvation.", "evidence_score": 0.92,
             "sources": [{"title": "Mao's Great Famine", "author": "Frank Dikötter", "publication": "Walker & Company", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}]},
        ],
    },
    {
        "slug": "decolonization-algeria-1954-1962",
        "title": "Algerian War of Independence",
        "year": 1954, "lat": 36.7538, "lng": 3.0588,
        "geo_modern": "Algiers, Algeria", "geo_era_label": "French Algeria",
        "category": "war", "importance_score": 0.87, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Algerian FLN perspective", "culture_code": "dz", "viewpoint_type": "nationalist",
             "narrative": "The FLN's November 1, 1954 uprising began an eight-year war of liberation against 130 years of French colonial rule. French Algeria was not France — it was a colony where 1 million French settlers ruled over 9 million Arabs with brutal inequality.",
             "summary": "A legitimate anti-colonial revolution after 130 years of French colonialism and systematic racial oppression.", "evidence_score": 0.88,
             "sources": [{"title": "The Wretched of the Earth", "author": "Frantz Fanon", "publication": "Maspero", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}]},
            {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "Algeria was constitutionally part of France; the FLN used terrorist tactics including civilian bombing. The army's use of torture to combat terrorism created a moral crisis that nearly destroyed the Fourth Republic. De Gaulle's negotiated independence was a betrayal of the pieds-noirs.",
             "summary": "A struggle against terrorism that forced France to confront the gap between its universal values and colonial reality.", "evidence_score": 0.79,
             "sources": [{"title": "A Savage War of Peace", "author": "Alistair Horne", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1977}]},
        ],
    },
    {
        "slug": "prague-spring-1968",
        "title": "Prague Spring — Soviet Invasion of Czechoslovakia",
        "year": 1968, "lat": 50.0755, "lng": 14.4378,
        "geo_modern": "Prague, Czechoslovakia", "geo_era_label": "Cold War",
        "category": "political", "importance_score": 0.85, "zoom_min": 3, "is_bce": False,
        "perspectives": [
            {"label": "Czech democratic perspective", "culture_code": "cz", "viewpoint_type": "nationalist",
             "narrative": "Alexander Dubček's 'socialism with a human face' reforms gave Czechs hope for a humane communism. The Soviet invasion on August 21, 1968 crushed the experiment with 200,000 Warsaw Pact troops. The 'Brezhnev Doctrine' — Moscow's right to intervene in socialist states — was declared.",
             "summary": "Hope for humane communism crushed by Soviet tanks — the Brezhnev Doctrine ends democratic reform in the Eastern bloc.", "evidence_score": 0.90,
             "sources": [{"title": "The Prague Spring: 1968", "author": "Jaromír Navrátil", "publication": "Central European University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998}]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "nationalist",
             "narrative": "Czechoslovakia's reforms threatened to spread 'contagion' to other Warsaw Pact members and ultimately undermine Soviet security. The intervention maintained socialist bloc unity and prevented NATO-aligned counter-revolution.",
             "summary": "A necessary intervention to maintain socialist solidarity and prevent counter-revolutionary destabilization.", "evidence_score": 0.62,
             "sources": [{"title": "Cold War: A History", "author": "Martin Walker", "publication": "Holt", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}]},
        ],
    },
    {
        "slug": "cambodia-khmer-rouge-1975-1979",
        "title": "Khmer Rouge Genocide in Cambodia",
        "year": 1975, "lat": 11.5564, "lng": 104.9282,
        "geo_modern": "Phnom Penh, Cambodia", "geo_era_label": "Cold War Southeast Asia",
        "category": "war", "importance_score": 0.90, "zoom_min": 2, "is_bce": False,
        "perspectives": [
            {"label": "Cambodian survivor perspective", "culture_code": "kh", "viewpoint_type": "indigenous",
             "narrative": "The Khmer Rouge under Pol Pot emptied Cambodia's cities at gunpoint, executed 'intellectuals' (including anyone who wore glasses), and collectivized the population. Between 1.5-2 million Cambodians — 25% of the population — died by execution, starvation, or forced labor.",
             "summary": "The Khmer Rouge murdered a quarter of Cambodia's population — one of the worst genocides of the 20th century.", "evidence_score": 0.95,
             "sources": [{"title": "The Killing Fields", "author": "Dith Pran (as told to Sydney Schanberg)", "source_type": "primary", "reliability_tier": 2, "year": 1984}]},
            {"label": "Western Cold War perspective", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Khmer Rouge rose to power partly enabled by the US bombing of Cambodia (1969-1973) that destabilized the country. Western powers initially opposed Vietnam's invasion that ended the Khmer Rouge because they were hostile to Vietnamese-Soviet influence.",
             "summary": "Cold War politics enabled the Khmer Rouge and delayed international action against genocide.", "evidence_score": 0.86,
             "sources": [{"title": "Sideshow: Kissinger, Nixon and the Destruction of Cambodia", "author": "William Shawcross", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1979}]},
        ],
    },

]  # end EVENTS list

# ─────────────────────────────────────────────────────────────────────────────
# CAUSALITY LINKS — WWI → WWII chain and others
# ─────────────────────────────────────────────────────────────────────────────
CAUSALITY_LINKS: list[dict] = [
    # WWI → WWII mega-chain
    {"cause": "assassination-franz-ferdinand-1914", "effect": "austria-hungary-ultimatum-serbia-1914", "type": "direct", "strength": 0.95, "desc": "The assassination was the direct trigger for Austria-Hungary's ultimatum"},
    {"cause": "austria-hungary-ultimatum-serbia-1914", "effect": "germany-declares-war-russia-1914", "type": "direct", "strength": 0.88, "desc": "Austrian ultimatum activated the Austro-German alliance, pulling Germany in"},
    {"cause": "germany-declares-war-russia-1914", "effect": "germany-invades-belgium-1914", "type": "direct", "strength": 0.92, "desc": "Germany's Schlieffen Plan required invading Belgium to attack France first"},
    {"cause": "germany-invades-belgium-1914", "effect": "battle-marne-1914", "type": "direct", "strength": 0.88, "desc": "Invasion of Belgium triggered French and British counterattack on the Marne"},
    {"cause": "battle-marne-1914", "effect": "battle-verdun-1916", "type": "direct", "strength": 0.75, "desc": "Failure of Schlieffen Plan led to entrenched Western Front and attrition battles like Verdun"},
    {"cause": "battle-marne-1914", "effect": "battle-somme-1916", "type": "direct", "strength": 0.75, "desc": "Stalemate on Western Front drove escalating attrition offensives including the Somme"},
    {"cause": "battle-verdun-1916", "effect": "armistice-wwi-november-1918", "type": "contributing", "strength": 0.65, "desc": "Verdun's destruction of German manpower contributed to eventual German collapse"},
    {"cause": "battle-somme-1916", "effect": "armistice-wwi-november-1918", "type": "contributing", "strength": 0.65, "desc": "The Somme's industrial attrition eventually exhausted German reserves"},
    {"cause": "usa-enters-wwi-1917", "effect": "armistice-wwi-november-1918", "type": "direct", "strength": 0.85, "desc": "American entry decisively tilted material and manpower balance to the Allies"},
    {"cause": "russian-revolution-1917", "effect": "armistice-wwi-november-1918", "type": "contributing", "strength": 0.55, "desc": "Russia's withdrawal freed German eastern forces but also demonstrated war-weariness"},
    {"cause": "armistice-wwi-november-1918", "effect": "treaty-of-versailles-1919", "type": "direct", "strength": 0.95, "desc": "The armistice directly enabled the Paris Peace Conference and Versailles Treaty"},
    {"cause": "armistice-wwi-november-1918", "effect": "spanish-flu-pandemic-1918-1919", "type": "contributing", "strength": 0.45, "desc": "War's end created mass troop movements that spread the second wave of Spanish flu"},
    {"cause": "treaty-of-versailles-1919", "effect": "weimar-republic-hyperinflation-1923", "type": "direct", "strength": 0.82, "desc": "Reparations burden directly contributed to Weimar Germany's financial collapse"},
    {"cause": "treaty-of-versailles-1919", "effect": "hitler-beer-hall-putsch-1923", "type": "contributing", "strength": 0.70, "desc": "Versailles humiliation and instability created conditions for radical nationalist politics"},
    {"cause": "treaty-of-versailles-1919", "effect": "great-depression-wall-street-crash-1929", "type": "indirect", "strength": 0.45, "desc": "Reparations disrupted global financial flows, contributing to the conditions for the Depression"},
    {"cause": "weimar-republic-hyperinflation-1923", "effect": "hitler-beer-hall-putsch-1923", "type": "direct", "strength": 0.78, "desc": "Hyperinflation crisis created the desperate political climate Hitler tried to exploit"},
    {"cause": "great-depression-wall-street-crash-1929", "effect": "hitler-appointed-chancellor-1933", "type": "direct", "strength": 0.87, "desc": "Depression caused 30% unemployment in Germany, collapsing moderate parties and driving voters to extremes"},
    {"cause": "hitler-beer-hall-putsch-1923", "effect": "hitler-appointed-chancellor-1933", "type": "direct", "strength": 0.65, "desc": "Putsch trial gave Hitler national platform; Mein Kampf written in prison"},
    {"cause": "hitler-appointed-chancellor-1933", "effect": "nuremberg-laws-1935", "type": "direct", "strength": 0.92, "desc": "Nazi government enacted racial laws within two years of taking power"},
    {"cause": "hitler-appointed-chancellor-1933", "effect": "anschluss-austria-1938", "type": "direct", "strength": 0.88, "desc": "Nazi Germany pursued pan-German unification as core policy"},
    {"cause": "anschluss-austria-1938", "effect": "munich-agreement-appeasement-1938", "type": "direct", "strength": 0.85, "desc": "Successful Austrian annexation emboldened Hitler's next demand for Sudetenland"},
    {"cause": "munich-agreement-appeasement-1938", "effect": "molotov-ribbentrop-pact-1939", "type": "contributing", "strength": 0.72, "desc": "Western appeasement convinced Stalin they would not fight Germany; he sought his own deal"},
    {"cause": "munich-agreement-appeasement-1938", "effect": "germany-invades-poland-1939", "type": "direct", "strength": 0.82, "desc": "Appeasement convinced Hitler Western powers would not fight over Poland either"},
    {"cause": "molotov-ribbentrop-pact-1939", "effect": "germany-invades-poland-1939", "type": "direct", "strength": 0.90, "desc": "The pact freed Germany from fear of a two-front war, enabling the Polish invasion"},
    {"cause": "germany-invades-poland-1939", "effect": "fall-of-france-1940", "type": "direct", "strength": 0.80, "desc": "After defeating Poland, Germany turned west to attack France"},
    {"cause": "fall-of-france-1940", "effect": "battle-of-britain-1940", "type": "direct", "strength": 0.92, "desc": "Fall of France left Britain alone; Germany had to defeat the RAF before invasion"},
    {"cause": "battle-of-britain-1940", "effect": "operation-barbarossa-1941", "type": "contributing", "strength": 0.65, "desc": "Failure to defeat Britain pushed Hitler to turn east against the Soviet Union"},
    {"cause": "operation-barbarossa-1941", "effect": "battle-stalingrad-1942-1943", "type": "direct", "strength": 0.85, "desc": "Barbarossa's advance led to the decisive confrontation at Stalingrad"},
    {"cause": "pearl-harbor-1941", "effect": "atomic-bombing-hiroshima-nagasaki-1945", "type": "indirect", "strength": 0.70, "desc": "Pearl Harbor brought the US into war and initiated the Manhattan Project that built the bomb"},
    {"cause": "wannsee-conference-final-solution-1942", "effect": "holocaust-liberation-camps-1945", "type": "direct", "strength": 0.95, "desc": "Wannsee organized the Holocaust that the liberation of camps revealed"},
    {"cause": "battle-stalingrad-1942-1943", "effect": "d-day-normandy-1944", "type": "indirect", "strength": 0.60, "desc": "Stalingrad's reversal of German fortunes enabled the Allied strategic planning for D-Day"},
    {"cause": "d-day-normandy-1944", "effect": "germany-surrenders-wwii-1945", "type": "direct", "strength": 0.85, "desc": "D-Day opened the Western front, creating the two-front squeeze that collapsed Germany"},
    {"cause": "atomic-bombing-hiroshima-nagasaki-1945", "effect": "germany-surrenders-wwii-1945", "type": "disputed", "strength": 0.20, "desc": "Hiroshima/Nagasaki did not cause Germany's surrender (already happened) but ended the Pacific War"},
    {"cause": "germany-surrenders-wwii-1945", "effect": "un-charter-signed-1945", "type": "direct", "strength": 0.80, "desc": "War's end enabled the founding of the United Nations"},
    {"cause": "germany-surrenders-wwii-1945", "effect": "berlin-blockade-airlift-1948", "type": "contributing", "strength": 0.70, "desc": "Germany's defeat and partition into occupation zones created the Berlin crisis"},
    {"cause": "treaty-of-versailles-1919", "effect": "paris-peace-conference-arab-betrayal-1919", "type": "direct", "strength": 0.85, "desc": "The Paris Peace Conference simultaneously created Versailles and the Arab mandate system"},
    {"cause": "balfour-declaration-1917", "effect": "founding-state-of-israel-1948", "type": "direct", "strength": 0.82, "desc": "Balfour Declaration provided crucial international legitimacy for the Zionist project"},
    {"cause": "holocaust-liberation-camps-1945", "effect": "founding-state-of-israel-1948", "type": "contributing", "strength": 0.78, "desc": "Holocaust created overwhelming moral case for Jewish statehood and displaced persons needing a home"},
    {"cause": "atomic-bombing-hiroshima-nagasaki-1945", "effect": "cuban-missile-crisis-1962", "type": "indirect", "strength": 0.70, "desc": "The bomb's use began the nuclear arms race that culminated in the Cuban Missile Crisis"},
    {"cause": "cuban-missile-crisis-1962", "effect": "fall-of-berlin-wall-1989", "type": "indirect", "strength": 0.30, "desc": "Near-nuclear war eventually led to détente and arms reduction agreements"},
    {"cause": "russian-revolution-1917", "effect": "chinese-revolution-peoples-republic-1949", "type": "indirect", "strength": 0.60, "desc": "Bolshevik revolution inspired and supported Chinese Communist movement"},
    {"cause": "fall-of-berlin-wall-1989", "effect": "dissolution-soviet-union-1991", "type": "direct", "strength": 0.85, "desc": "Berlin Wall's fall accelerated the collapse of communist regimes, including the USSR itself"},
    # WWI as consequence of earlier events
    {"cause": "berlin-conference-africa-partition-1884", "effect": "assassination-franz-ferdinand-1914", "type": "indirect", "strength": 0.40, "desc": "Imperial competition in Africa and the Balkans created the system of alliances and tensions that led to WWI"},
    {"cause": "assassination-franz-ferdinand-1914", "effect": "armenian-genocide-1915-1923", "type": "contributing", "strength": 0.70, "desc": "WWI gave the Ottoman government cover to implement the Armenian genocide under war conditions"},
    {"cause": "assassination-franz-ferdinand-1914", "effect": "gallipoli-campaign-1915", "type": "direct", "strength": 0.80, "desc": "WWI pulled the Ottoman Empire into the conflict, making Gallipoli a strategic target"},
    {"cause": "gallipoli-campaign-1915", "effect": "usa-enters-wwi-1917", "type": "indirect", "strength": 0.20, "desc": "Gallipoli's failure pushed Allies to seek US involvement to break the stalemate"},
    {"cause": "darwin-on-the-origin-of-species-1859", "effect": "nuremberg-laws-1935", "type": "indirect", "strength": 0.25, "desc": "Social Darwinism (a distortion of Darwin) provided pseudo-scientific basis for Nazi racial ideology"},
    {"cause": "industrial-revolution-steam-engine-1769", "effect": "battle-somme-1916", "type": "indirect", "strength": 0.55, "desc": "Industrial Revolution enabled the industrial-scale warfare of WWI — machine guns, artillery, poison gas"},
    {"cause": "decolonization-ghana-independence-1957", "effect": "rwandan-genocide-1994", "type": "indirect", "strength": 0.35, "desc": "Belgian colonial era artificially hardened Hutu/Tutsi ethnic distinction, underlying cause of 1994 genocide"},
    {"cause": "american-civil-war-1861-1865", "effect": "civil-rights-act-usa-1964", "type": "indirect", "strength": 0.80, "desc": "Reconstruction amendments and broken promises of post-Civil War created the conditions the Civil Rights Movement addressed"},
    {"cause": "haitian-revolution-1791-1804", "effect": "american-civil-war-1861-1865", "type": "indirect", "strength": 0.40, "desc": "Haiti proved Black people would fight for freedom, inspiring both abolitionists and frightening slaveholders"},
    {"cause": "french-revolution-1789", "effect": "haitian-revolution-1791-1804", "type": "direct", "strength": 0.80, "desc": "French Revolution's ideals of liberty directly inspired enslaved people in Saint-Domingue"},
    {"cause": "gutenberg-printing-press-1440", "effect": "martin-luther-95-theses-1517", "type": "direct", "strength": 0.85, "desc": "The printing press disseminated Luther's theses across Germany in weeks — impossible without print"},
    {"cause": "copernicus-heliocentric-theory-1543", "effect": "galileo-telescope-1609", "type": "direct", "strength": 0.80, "desc": "Galileo's telescope observations confirmed and extended the Copernican model"},
    {"cause": "galileo-telescope-1609", "effect": "newton-principia-1687", "type": "direct", "strength": 0.75, "desc": "Newton built on Galileo's observations and Kepler's laws to derive universal gravitation"},
    {"cause": "newton-principia-1687", "effect": "industrial-revolution-steam-engine-1769", "type": "indirect", "strength": 0.50, "desc": "Newton's physics and the scientific method created the intellectual foundation for industrial invention"},
]


# ─────────────────────────────────────────────────────────────────────────────
# UTILITY FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def make_slug_dates(event: dict) -> tuple[str, str, str]:
    """Return (date_earliest, date_latest, date_exact) as ISO strings."""
    year = event["year"]
    if event.get("is_bce"):
        # Store BCE dates as negative year (PostgreSQL can handle BCE via negative year strings)
        # Use year 0001 as a proxy for very ancient dates in the DATE column
        # We'll use arbitrary dates within supported range
        abs_year = abs(year)
        if abs_year > 4000:
            abs_year = 4000  # clamp to Postgres range
        earliest = f"-{abs_year:04d}-01-01"
        latest = f"-{abs_year:04d}-12-31"
        # Actually PostgreSQL stores dates as 'YYYY-BC' format via python - use strings
        return earliest, latest, None
    else:
        earliest = f"{year:04d}-01-01"
        latest = f"{year:04d}-12-31"
        return earliest, latest, None


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─────────────────────────────────────────────────────────────────────────────
# MAIN SEED FUNCTION
# ─────────────────────────────────────────────────────────────────────────────

async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting seed — {len(EVENTS)} events, {len(CAUSALITY_LINKS)} causality links")

    # Map slug → event UUID for causality links
    slug_to_id: dict[str, str] = {}

    for event in EVENTS:
        year = event["year"]
        is_bce = event.get("is_bce", False)
        abs_year = abs(year)
        if abs_year > 4712:
            abs_year = 4712  # Postgres BC limit

        # Build date strings
        # asyncpg cannot bind Python date objects for BC dates, so we pass as strings
        # and cast in SQL. For AD dates we use ISO strings; BC dates use PostgreSQL notation.
        if is_bce:
            # PostgreSQL BC notation: '2560-01-01 BC'
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        slug = event["slug"]

        # Check if event already exists
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            slug_to_id[slug] = str(existing)
            print(f"  [skip] {slug} (already exists)")
            continue

        # Build WKT point from lat/lng
        lat, lng = event.get("lat"), event.get("lng")
        geo_wkt = f"SRID=4326;POINT({lng} {lat})" if lat is not None and lng is not None else None

        content = json.dumps({k: v for k, v in event.items() if k != "perspectives"}, sort_keys=True)
        content_hash = sha256_str(content)

        # Build dynamic SQL with inlined date literals (needed for BC dates since
        # asyncpg cannot bind Python date objects before year 1)
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

        slug_to_id[slug] = str(event_id)

        # Insert perspectives + sources
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

                # Generate unique content_hash for each source
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

        # Log to edit_log
        await conn.execute(
            """
            INSERT INTO edit_log (entity_type, entity_id, action, actor_id, actor_type, reason)
            VALUES ('event', $1, 'create', $2, 'ai', 'Initial seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    # Insert causality links
    print(f"\nInserting {len(CAUSALITY_LINKS)} causality links...")
    for link in CAUSALITY_LINKS:
        cause_slug = link["cause"]
        effect_slug = link["effect"]
        cause_id = slug_to_id.get(cause_slug)
        effect_id = slug_to_id.get(effect_slug)
        if not cause_id or not effect_id:
            print(f"  [warn] Missing event for link {cause_slug} -> {effect_slug}")
            continue
        try:
            await conn.execute(
                """
                INSERT INTO causality_links
                    (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
                VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
                """,
                cause_id, effect_id,
                link.get("type", "direct"),
                link.get("strength", 0.5),
                link.get("desc"),
                CREATED_BY,
            )
        except Exception as exc:
            print(f"  [warn] Link {cause_slug} -> {effect_slug}: {exc}")

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    persp_total = await conn.fetchval("SELECT COUNT(*) FROM perspectives")
    src_total = await conn.fetchval("SELECT COUNT(*) FROM sources")
    link_total = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n✅ Seed complete:")
    print(f"   Events:           {total}")
    print(f"   Perspectives:     {persp_total}")
    print(f"   Sources:          {src_total}")
    print(f"   Causality links:  {link_total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
