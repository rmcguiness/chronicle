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


    # ═══════════════════════════════════════════════════════════════════════
    # EXPANDED EVENTS — Ancient World (additional)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "sargon-akkadian-empire-2334bce",
        "title": "Sargon of Akkad Founds First Empire",
        "year": -2334, "lat": 33.3, "lng": 44.4,
        "geo_modern": "Mesopotamia, Iraq", "geo_era_label": "Akkadian Empire",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Akkadian royal tradition", "culture_code": "iq-akkad", "viewpoint_type": "religious",
             "narrative": "Sargon of Akkad conquered the Sumerian city-states and unified Mesopotamia into the world's first territorial empire, ruling from the Mediterranean to the Persian Gulf and establishing Akkadian as the lingua franca of the ancient Near East. He established a standing army and professional administration.",
             "summary": "World's first empire unifying Mesopotamia under one ruler with professional administration.", "evidence_score": 0.80,
             "sources": [{"title": "The Legend of Sargon (cuneiform text)", "source_type": "primary", "reliability_tier": 1, "year": -2300},
                         {"title": "The Ancient Near East", "author": "William Hallo", "publication": "Harcourt Brace", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1971}]},
            {"label": "Modern archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Sargon's empire is confirmed by cuneiform texts and archaeological evidence as the first multi-ethnic, multi-lingual empire with a professional standing army, royal road network, and centralized administration — a template for all subsequent empires in world history.",
             "summary": "Archaeological evidence confirms the first empire with professional army and centralized administration.", "evidence_score": 0.85,
             "sources": [{"title": "Sargon of Akkad", "author": "Mario Liverani", "publication": "Cornell University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}]},
        ],
    },
    {
        "slug": "battle-marathon-490bce",
        "title": "Battle of Marathon",
        "year": -490, "lat": 38.15, "lng": 23.97,
        "geo_modern": "Marathon, Greece", "geo_era_label": "Classical Greece",
        "category": "war", "importance_score": 0.87, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Athenian democratic tradition", "culture_code": "gr", "viewpoint_type": "nationalist",
             "narrative": "Athens defeated the Persian army at Marathon, proving Greek hoplites could defeat Persian forces. Herodotus described it as the salvation of Greek freedom and democracy from eastern despotism. The victory inspired Greek confidence and the subsequent alliance that defeated Xerxes.",
             "summary": "Athenian victory saved Greek democracy from Persian conquest and inspired subsequent resistance.", "evidence_score": 0.82,
             "sources": [{"title": "Histories", "author": "Herodotus", "source_type": "primary", "reliability_tier": 2, "year": -440},
                         {"title": "Marathon: The Battle that Changed Western Civilization", "author": "Richard Billows", "publication": "Overlook Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}]},
            {"label": "Persian imperial perspective", "culture_code": "ir", "viewpoint_type": "foreign",
             "narrative": "For the Persian Achaemenid Empire, Marathon was a minor setback in a broader campaign to punish Athenian support for the Ionian Revolt. The empire spanned from Egypt to Central Asia; the defeat led Xerxes to mount the larger 480 BCE invasion.",
             "summary": "Minor Persian setback; empire remained dominant power and responded with full invasion under Xerxes.", "evidence_score": 0.75,
             "sources": [{"title": "The Persian Empire", "author": "J.M. Cook", "publication": "Schocken Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}]},
        ],
    },
    {
        "slug": "alexander-gaugamela-331bce",
        "title": "Battle of Gaugamela — Alexander Destroys Persian Empire",
        "year": -331, "lat": 36.5, "lng": 43.1,
        "geo_modern": "Mosul region, Iraq", "geo_era_label": "Macedonian Empire",
        "category": "war", "importance_score": 0.90, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Macedonian triumphalist account", "culture_code": "gr-mac", "viewpoint_type": "nationalist",
             "narrative": "Alexander's oblique cavalry charge shattered the Persian center at Gaugamela, ending Achaemenid power and opening Persia, Babylonia, and Central Asia to Macedonian conquest. It was the greatest tactical achievement of Alexander's career and ended the 200-year Persian Empire.",
             "summary": "Alexander's tactical genius destroyed the Persian Empire and opened the East to Greek culture.", "evidence_score": 0.85,
             "sources": [{"title": "Anabasis Alexandri", "author": "Arrian", "source_type": "primary", "reliability_tier": 2, "year": 130},
                         {"title": "Alexander the Great", "author": "Robin Lane Fox", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1973}]},
            {"label": "Persian and regional perspective", "culture_code": "ir", "viewpoint_type": "foreign",
             "narrative": "Gaugamela ended a 200-year Persian imperial system that maintained relative stability and religious tolerance across a vast multiethnic empire. For Persian subjects, Macedonian conquest brought Greek colonists, changed administrative languages, and disrupted existing elites while introducing Hellenistic culture.",
             "summary": "Destruction of the Persian Empire disrupted stable multiethnic administration for millions of subjects.", "evidence_score": 0.78,
             "sources": [{"title": "The Persian Empire", "author": "Pierre Briant", "publication": "Eisenbrauns", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}]},
        ],
    },
    {
        "slug": "cyrus-great-persia-550bce",
        "title": "Cyrus the Great Founds the Persian Empire",
        "year": -550, "lat": 30.2, "lng": 53.1,
        "geo_modern": "Pasargadae, Iran", "geo_era_label": "Achaemenid Empire",
        "category": "political", "importance_score": 0.88, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Persian royal tradition", "culture_code": "ir", "viewpoint_type": "religious",
             "narrative": "Cyrus conquered the Median, Lydian, and Babylonian empires, creating the largest empire yet seen. The Cyrus Cylinder proclaimed freedom of religion and the return of exiled peoples, including the Jews from Babylonian captivity — often called the first human rights declaration.",
             "summary": "Cyrus built the largest empire to date while demonstrating remarkable religious tolerance and respect for subject peoples.", "evidence_score": 0.88,
             "sources": [{"title": "Cyrus Cylinder (British Museum)", "source_type": "primary", "reliability_tier": 1, "year": -539},
                         {"title": "Cyrus the Great", "author": "M.A. Dandamaev", "publication": "Encyclopaedia Iranica", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}]},
            {"label": "Jewish scriptural tradition", "culture_code": "il", "viewpoint_type": "religious",
             "narrative": "Hebrew scripture calls Cyrus the anointed of God (messiah) for freeing the Jewish exiles from Babylonian captivity and funding rebuilding of the Jerusalem Temple. This represents the only non-Israelite given messianic title in Hebrew scripture.",
             "summary": "Jewish scriptures uniquely revere Cyrus as God's anointed for ending the Babylonian captivity.", "evidence_score": 0.82,
             "sources": [{"title": "Isaiah 45:1 (Hebrew Bible)", "source_type": "primary", "reliability_tier": 2, "year": -540}]},
        ],
    },
    {
        "slug": "han-dynasty-golden-age-100bce",
        "title": "Han Dynasty — China's Confucian Imperial System",
        "year": -100, "lat": 34.27, "lng": 108.95,
        "geo_modern": "Chang'an (Xi'an), China", "geo_era_label": "Han Dynasty China",
        "category": "cultural", "importance_score": 0.87, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Confucian Chinese historical tradition", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Han Dynasty (206 BCE–220 CE) established the Confucian bureaucratic state, meritocratic civil service, paper manufacturing, and the Silk Road trade network. Emperor Wu's campaigns expanded to Central Asia, Korea, and Vietnam. The cultural identity established defines Han Chinese identity to this day.",
             "summary": "Han Dynasty established the Confucian state model and Silk Road that defined Chinese civilization for 2000 years.", "evidence_score": 0.90,
             "sources": [{"title": "Records of the Grand Historian (Shiji)", "author": "Sima Qian", "source_type": "primary", "reliability_tier": 1, "year": -90},
                         {"title": "The Cambridge History of China: The Ch'in and Han Empires", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}]},
            {"label": "Nomadic steppe perspective", "culture_code": "mn", "viewpoint_type": "foreign",
             "narrative": "From the Xiongnu perspective, Han expansion was both trading opportunity and military threat. Han offensives into Central Asia and the Great Wall expansion permanently altered nomadic political geography, forcing the Xiongnu westward in migrations that would eventually reach the Roman frontier as the Huns.",
             "summary": "Han expansion displaced Central Asian nomads, triggering westward migrations that eventually reached the Roman Empire.", "evidence_score": 0.75,
             "sources": [{"title": "China, Central Asia, and the Silk Road", "author": "Xinru Liu", "publication": "Pearson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}]},
        ],
    },
    {
        "slug": "maurya-empire-peak-268bce",
        "title": "Maurya Empire at Its Peak Under Ashoka",
        "year": -268, "lat": 25.6, "lng": 85.1,
        "geo_modern": "Pataliputra (Patna), India", "geo_era_label": "Maurya Empire",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Buddhist tradition", "culture_code": "in", "viewpoint_type": "religious",
             "narrative": "After the horrific Kalinga War, Emperor Ashoka converted to Buddhism and deployed state resources to spread dharma across South Asia, Sri Lanka, and Central Asia via missionaries and stone edicts. He created the first known welfare state with hospitals, veterinary clinics, and infrastructure.",
             "summary": "Ashoka transformed Buddhism from regional sect to world religion through state-sponsored missionary activity.", "evidence_score": 0.88,
             "sources": [{"title": "The Edicts of Asoka", "author": "N.A. Nikam & Richard McKeon", "publication": "University of Chicago Press", "source_type": "primary", "reliability_tier": 1, "year": 1959}]},
            {"label": "Modern comparative government perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Ashoka's Maurya Empire united most of the Indian subcontinent for the first time. His edicts on tolerance, non-violence, and good governance represent extraordinary political philosophy for the 3rd century BCE. His model influenced subsequent South Asian governance for centuries.",
             "summary": "Ashoka's governance philosophy of tolerance and non-violence was advanced for its era and influential for centuries.", "evidence_score": 0.85,
             "sources": [{"title": "Ashoka: The Search for India's Lost Emperor", "author": "Charles Allen", "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}]},
        ],
    },
    {
        "slug": "roman-republic-caesar-crossing-rubicon-49bce",
        "title": "Caesar Crosses the Rubicon — Civil War Begins",
        "year": -49, "lat": 44.22, "lng": 12.35,
        "geo_modern": "Rubicon River, Italy", "geo_era_label": "Late Roman Republic",
        "category": "political", "importance_score": 0.83, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Caesarian tradition", "culture_code": "it", "viewpoint_type": "political",
             "narrative": "When the Senate ordered Caesar to disband his army, he crossed the Rubicon river into Italy with his loyal legions — an act of war that began the civil war. Caesar's speed caught Pompey unprepared; within three years he had conquered his opponents and made himself dictator of Rome.",
             "summary": "Caesar's illegal river crossing began the civil war that ended the Roman Republic and created the Empire.", "evidence_score": 0.88,
             "sources": [{"title": "The Civil War", "author": "Julius Caesar", "source_type": "primary", "reliability_tier": 2, "year": -48},
                         {"title": "Caesar: A Biography", "author": "Christian Meier", "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1982}]},
            {"label": "Republican senatorial tradition", "culture_code": "it", "viewpoint_type": "political",
             "narrative": "Cicero and the Senate saw Caesar's crossing as naked military dictatorship trampling constitutional norms. His subsequent assassination (44 BCE) was a last desperate defense of Republican governance — which ultimately failed as his heir Octavian completed the Republic's transformation into the Empire.",
             "summary": "Republican senators saw Caesar as a tyrant; their assassination attempt failed and precipitated the Empire.", "evidence_score": 0.82,
             "sources": [{"title": "Letters to Atticus", "author": "Cicero", "source_type": "primary", "reliability_tier": 2, "year": -48}]},
        ],
    },
    {
        "slug": "minoan-civilization-crete-1700bce",
        "title": "Minoan Civilization Dominates the Aegean",
        "year": -1700, "lat": 35.3, "lng": 25.1,
        "geo_modern": "Knossos, Crete, Greece", "geo_era_label": "Bronze Age Aegean",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Aegean Bronze Age archaeology", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "The Minoan civilization of Crete dominated Aegean trade at its peak, with the palace at Knossos serving as administrative center and economic hub. Minoan art, fresco painting, and the Linear A writing system represent Europe's first advanced civilization with indoor plumbing and sophisticated architecture.",
             "summary": "Europe's first advanced civilization with complex palace economy, art, and the undeckiphered Linear A script.", "evidence_score": 0.82,
             "sources": [{"title": "The Minoans", "author": "J. Lesley Fitton", "publication": "British Museum Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]},
            {"label": "Gender history interpretation", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Minoan art shows prominent female figures leading scholars to debate the society's gender structure. Some propose goddess-centered religion or matriarchal elements; others caution against over-interpretation. The undeciphered Linear A script prevents definitive conclusions about Minoan social organization.",
             "summary": "Female prominence in Minoan art is intriguing but Linear A remains undeciphered, limiting conclusions about gender roles.", "evidence_score": 0.62,
             "sources": [{"title": "The Lost World of the Aegean", "author": "Maitland Edey", "publication": "Time-Life Books", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 1975}]},
        ],
    },
    {
        "slug": "gupta-empire-india-golden-age-350",
        "title": "Gupta Empire — India's Golden Age of Science and Art",
        "year": 350, "lat": 25.45, "lng": 81.85,
        "geo_modern": "Pataliputra (Patna), India", "geo_era_label": "Gupta Empire",
        "category": "cultural", "importance_score": 0.82, "zoom_min": 3,
        "perspectives": [
            {"label": "Sanskrit scholarly tradition", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Gupta period (320-550 CE) is India's Golden Age: Aryabhata calculated pi and proposed a heliocentric model, Kalidasa wrote Sanskrit masterpieces, the decimal numeral system was codified (transmitted to the world as 'Arabic numerals'), and classical Hindu temple architecture flourished.",
             "summary": "India's Golden Age: mathematics, literature, and astronomy advanced; decimal numerals spread worldwide.", "evidence_score": 0.88,
             "sources": [{"title": "The Guptas", "author": "Tej Ram Sharma", "publication": "D.K. Printworld", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]},
            {"label": "Social history perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Gupta period saw elite cultural achievement coexist with hardening of the caste system. Women's status declined compared to earlier Vedic periods, and Brahmin power formalized social hierarchies. The 'golden age' was golden primarily for the educated upper classes.",
             "summary": "Golden Age for elite culture coexisted with hardening caste inequality and declining women's rights.", "evidence_score": 0.80,
             "sources": [{"title": "A History of India", "author": "Romila Thapar", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}]},
        ],
    },
    {
        "slug": "byzantine-justinian-codex-530",
        "title": "Justinian Codifies Roman Law",
        "year": 530, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey", "geo_era_label": "Byzantine Empire",
        "category": "political", "importance_score": 0.83, "zoom_min": 3,
        "perspectives": [
            {"label": "Byzantine imperial tradition", "culture_code": "tr", "viewpoint_type": "government",
             "narrative": "Emperor Justinian I commissioned the Corpus Juris Civilis (529-534 CE) — a comprehensive compilation and codification of Roman law. It became the foundation of legal systems across continental Europe, Latin America, and former European colonies, influencing Western law to this day.",
             "summary": "Justinian's legal code is the foundation of most European and Latin American legal systems.", "evidence_score": 0.92,
             "sources": [{"title": "Corpus Juris Civilis", "author": "Justinian I", "source_type": "primary", "reliability_tier": 1, "year": 533},
                         {"title": "Justinian's Flea", "author": "William Rosen", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}]},
            {"label": "Provincial and diversity perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The codification privileged Roman legal tradition over local customs across the diverse Byzantine world. Greek was eventually adopted over Latin, and the code's application varied widely. Justinian's military reconquests, funded by taxation, devastated Italy and North Africa despite the legal legacy.",
             "summary": "Legal codification privileged Roman tradition over local custom; simultaneous reconquests devastated Italy with taxation and war.", "evidence_score": 0.80,
             "sources": [{"title": "The Fall of Rome and the End of Civilization", "author": "Bryan Ward-Perkins", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # EXPANDED EVENTS — Medieval (additional)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "battle-of-hastings-1066",
        "title": "Battle of Hastings — Norman Conquest of England",
        "year": 1066, "lat": 50.91, "lng": 0.49,
        "geo_modern": "Hastings, England", "geo_era_label": "Norman Conquest",
        "category": "war", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Norman dynastic account", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "William the Conqueror defeated Harold Godwinson at Hastings, claiming the English throne promised by Edward the Confessor. The Norman Conquest transformed English language, law, architecture, and culture, creating the feudal England that would evolve into a constitutional monarchy over the following centuries.",
             "summary": "Norman conquest transformed England's language, culture, and governance permanently.", "evidence_score": 0.88,
             "sources": [{"title": "Bayeux Tapestry", "source_type": "primary", "reliability_tier": 1, "year": 1077},
                         {"title": "The Norman Conquest", "author": "Marc Morris", "publication": "Hutchinson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}]},
            {"label": "Anglo-Saxon perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "For Anglo-Saxon England, 1066 was a conquest: the native aristocracy was dispossessed, Old English marginalized for three centuries, and a foreign ruling class imposed. Modern English's dual vocabulary (Saxon words for farm animals, Norman French for their cooked meat) reflects the conquest's social hierarchy.",
             "summary": "For Anglo-Saxons, 1066 was colonial dispossession; the language itself reflects the conqueror/conquered divide.", "evidence_score": 0.82,
             "sources": [{"title": "Anglo-Saxon Chronicle", "source_type": "primary", "reliability_tier": 2, "year": 1066}]},
        ],
    },
    {
        "slug": "abbasid-house-of-wisdom-800",
        "title": "Baghdad's House of Wisdom — Islamic Golden Age",
        "year": 800, "lat": 33.33, "lng": 44.44,
        "geo_modern": "Baghdad, Iraq", "geo_era_label": "Abbasid Caliphate",
        "category": "cultural", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Islamic scholarly tradition", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Baghdad's Bayt al-Hikma (House of Wisdom) translated Greek, Persian, and Indian texts into Arabic while advancing mathematics (al-Khwarizmi's algebra), astronomy, medicine, and philosophy. Islamic scholars were the world's foremost scientists for 400 years, transmitting classical knowledge to medieval Europe.",
             "summary": "Baghdad was the world's intellectual capital; Islamic scholars preserved and advanced classical knowledge transmitted to Europe.", "evidence_score": 0.90,
             "sources": [{"title": "The House of Wisdom", "author": "Jim Al-Khalili", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}]},
            {"label": "European medieval perspective", "culture_code": "eu", "viewpoint_type": "academic",
             "narrative": "Medieval European scholars knew almost nothing of Aristotle, Ptolemy, or Galen until Arabic translations arrived through Spain and Sicily from the 10th century. The European Renaissance was substantially built on Islamic scholarly transmission — a debt rarely acknowledged in Western historical narrative.",
             "summary": "European Renaissance was built on Islamic scholarly transmission — the forgotten foundation of Western learning.", "evidence_score": 0.88,
             "sources": [{"title": "The Forgotten Enlightenment", "author": "Scott Montgomery", "publication": "MIT Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2019}]},
        ],
    },
    {
        "slug": "fourth-crusade-sack-constantinople-1204",
        "title": "Fourth Crusade Sacks Constantinople",
        "year": 1204, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey", "geo_era_label": "Byzantine Empire",
        "category": "war", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Latin Catholic tradition", "culture_code": "it", "viewpoint_type": "religious",
             "narrative": "The Fourth Crusade, diverted by Venetian commercial interests and Byzantine intrigue, sacked Constantinople — a Christian city — rather than Jerusalem. The crusaders established the Latin Empire (1204-1261), looting art, manuscripts, and the Shroud of Turin from the greatest Christian city outside Rome.",
             "summary": "Fourth Crusade's sack of Constantinople permanently weakened Byzantium and fractured Eastern-Western Christendom.", "evidence_score": 0.88,
             "sources": [{"title": "The Conquest of Constantinople", "author": "Geoffrey de Villehardouin", "source_type": "primary", "reliability_tier": 2, "year": 1209}]},
            {"label": "Orthodox Byzantine perspective", "culture_code": "gr", "viewpoint_type": "religious",
             "narrative": "For Orthodox Christians, the Latin sack was the definitive rupture between Eastern and Western Christianity — more traumatic than any Muslim conquest. The theft of relics and desecration of Hagia Sophia created a permanent antipathy to Rome that made later reunion attempts impossible.",
             "summary": "The Latin sack deepened the Orthodox-Catholic schism permanently and gave Byzantium a mortal wound.", "evidence_score": 0.85,
             "sources": [{"title": "Nicetas Choniates Chronicle", "author": "Nicetas Choniates", "source_type": "primary", "reliability_tier": 2, "year": 1215}]},
        ],
    },
    {
        "slug": "mongol-conquest-baghdad-1258",
        "title": "Mongols Sack Baghdad — End of Abbasid Caliphate",
        "year": 1258, "lat": 33.33, "lng": 44.44,
        "geo_modern": "Baghdad, Iraq", "geo_era_label": "Ilkhanate",
        "category": "war", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Islamic world perspective", "culture_code": "iq", "viewpoint_type": "religious",
             "narrative": "Hulagu Khan's Mongols sacked Baghdad for 13 days, killing up to 800,000 people, destroying the city's libraries, and drowning the last Abbasid Caliph in the Tigris. Islamic civilization considers this one of its greatest catastrophes — ending the Golden Age and the 500-year Abbasid Caliphate.",
             "summary": "The Mongol destruction of Baghdad ended the Islamic Golden Age and the Abbasid Caliphate in one catastrophic week.", "evidence_score": 0.88,
             "sources": [{"title": "The Mongols and the Islamic World", "author": "Peter Jackson", "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2017}]},
            {"label": "Mongol imperial strategy perspective", "culture_code": "mn", "viewpoint_type": "nationalist",
             "narrative": "The Mongols applied their standard strategy of total destruction to those who refused to submit, using terror to compel regional obedience. Baghdad's Caliph refused tribute and negotiation. From the Mongol perspective, this was rational imperial warfare in the tradition of Genghis Khan's conquest code.",
             "summary": "The Mongols applied their standard terror-to-submission strategy; Baghdad's refusal to negotiate made destruction inevitable.", "evidence_score": 0.80,
             "sources": [{"title": "Genghis Khan and the Making of the Modern World", "author": "Jack Weatherford", "publication": "Crown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}]},
        ],
    },
    {
        "slug": "tang-dynasty-cosmopolitan-618",
        "title": "Tang Dynasty — China's Cosmopolitan Golden Age",
        "year": 618, "lat": 34.27, "lng": 108.95,
        "geo_modern": "Chang'an (Xi'an), China", "geo_era_label": "Tang Dynasty China",
        "category": "cultural", "importance_score": 0.83, "zoom_min": 3,
        "perspectives": [
            {"label": "Confucian Chinese tradition", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Tang Dynasty (618-907) is considered China's golden age of cosmopolitan culture. Chang'an, the world's largest city with a million inhabitants, hosted merchants, monks, and ambassadors from across Eurasia. Chinese poetry (Du Fu, Li Bai), Buddhism, and the examination system reached their classical heights.",
             "summary": "Tang China was a cosmopolitan world center; its culture and institutions shaped all of East Asia.", "evidence_score": 0.88,
             "sources": [{"title": "The Tang Dynasty", "author": "Denis Twitchett", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1979}]},
            {"label": "Central Asian perspective", "culture_code": "kz", "viewpoint_type": "foreign",
             "narrative": "Tang culture was shaped by Central Asian influences — Sogdian merchants, Turkic soldiers, Buddhist pilgrims. Chinese art and music absorbed Persian, Indian, and Central Asian elements. The Tang golden age was a product of multicultural exchange as much as Chinese tradition.",
             "summary": "Tang golden age was built on multicultural synthesis with Central Asian, Turkic, and Buddhist traditions.", "evidence_score": 0.82,
             "sources": [{"title": "Empires of the Silk Road", "author": "Christopher Beckwith", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]},
        ],
    },
    {
        "slug": "ottoman-peak-suleiman-1520",
        "title": "Ottoman Empire at Its Peak — Suleiman the Magnificent",
        "year": 1520, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Constantinople (Istanbul), Turkey", "geo_era_label": "Ottoman Empire",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Ottoman imperial tradition", "culture_code": "tr", "viewpoint_type": "government",
             "narrative": "Suleiman I (r. 1520-1566) expanded the Ottoman Empire from Hungary to the Persian Gulf, besieged Vienna, and controlled the eastern Mediterranean. His legal reforms (Kanun), architectural patronage (Sinan's mosques), and literary court represented the peak of Ottoman civilization.",
             "summary": "Suleiman's empire was the world's most powerful state; his legal and cultural achievements shaped the Ottoman world for centuries.", "evidence_score": 0.90,
             "sources": [{"title": "Suleiman the Magnificent", "author": "Andre Clot", "publication": "Saqi Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1992}]},
            {"label": "European Christian perspective", "culture_code": "eu", "viewpoint_type": "foreign",
             "narrative": "For European Christendom, the Ottoman threat at Vienna was existential. Ottoman expansion shaped Catholic-Protestant rivalry for Christian unity against Islam and defined Renaissance-era geopolitics. The Ottoman-Hapsburg duel for Mediterranean dominance lasted over a century.",
             "summary": "Ottoman power at Vienna's gates shaped European Reformation politics and defined Mediterranean geopolitics.", "evidence_score": 0.85,
             "sources": [{"title": "The Ottoman Empire 1300-1650", "author": "Colin Imber", "publication": "Palgrave", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}]},
        ],
    },
    {
        "slug": "black-death-kills-europe-1347-second",
        "title": "Black Death — One Third of Europe Dies",
        "year": 1348, "lat": 43.3, "lng": 11.3,
        "geo_modern": "Florence / across Europe", "geo_era_label": "Medieval Europe",
        "category": "natural", "importance_score": 0.93, "zoom_min": 1,
        "perspectives": [
            {"label": "Medieval Christian interpretation", "culture_code": "eu", "viewpoint_type": "religious",
             "narrative": "Medieval Europeans understood the Black Death as divine punishment. It killed 30-50% of Europe's population (25 million dead), triggered flagellant movements and Jewish pogroms, and fundamentally destabilized the feudal social order. Boccaccio's Decameron and art like the Danse Macabre expressed the trauma.",
             "summary": "Plague killed 30-50% of Europe, was seen as divine punishment, and triggered social upheaval and anti-Jewish violence.", "evidence_score": 0.90,
             "sources": [{"title": "The Decameron", "author": "Giovanni Boccaccio", "source_type": "primary", "reliability_tier": 2, "year": 1353},
                         {"title": "The Black Death", "author": "Philip Ziegler", "publication": "Collins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1969}]},
            {"label": "Epidemiological and social history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Modern analysis confirms bubonic plague (Yersinia pestis) from Central Asia via Silk Road rats and fleas. The demographic collapse paradoxically improved conditions for surviving peasants: labor scarcity broke serfdom, raised wages, and accelerated the end of feudalism — laying groundwork for the Renaissance.",
             "summary": "The plague's demographic shock paradoxically empowered surviving peasants by creating labor scarcity that broke serfdom.", "evidence_score": 0.92,
             "sources": [{"title": "The Return of the Black Death", "author": "Susan Scott & Christopher Duncan", "publication": "Wiley", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}]},
        ],
    },
    {
        "slug": "hundred-years-war-joan-of-arc-1429",
        "title": "Joan of Arc Turns the Hundred Years War",
        "year": 1429, "lat": 47.9, "lng": 1.9,
        "geo_modern": "Orléans, France", "geo_era_label": "Hundred Years War",
        "category": "war", "importance_score": 0.82, "zoom_min": 2,
        "perspectives": [
            {"label": "French Catholic tradition", "culture_code": "fr", "viewpoint_type": "religious",
             "narrative": "Joan of Arc, claiming divine visions, led French forces to break the siege of Orléans in 1429, turning the Hundred Years War in France's favor. Captured and burned by the English as a heretic (1431), she was rehabilitated and canonized as a saint in 1920, becoming France's national symbol.",
             "summary": "Joan of Arc's divinely-inspired military leadership turned the war and created France's most enduring national symbol.", "evidence_score": 0.85,
             "sources": [{"title": "The Trial of Joan of Arc", "author": "W.P. Barrett", "publication": "Gotham House", "source_type": "primary", "reliability_tier": 2, "year": 1932}]},
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "English commanders saw Joan as a heretic and sorcerer manipulating a weak king. Her execution was legal under ecclesiastical law and was done by an English-allied bishop. British historiography long struggled with the embarrassment of having burned France's saint.",
             "summary": "English saw Joan as heretic; her execution was legally justified at the time but historically embarrassing.", "evidence_score": 0.78,
             "sources": [{"title": "Joan of Arc: A History", "author": "Helen Castor", "publication": "Faber and Faber", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # EXPANDED EVENTS — Age of Exploration & Renaissance (additional)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "renaissance-florence-medici-1450",
        "title": "Florentine Renaissance — Medici Patronage and Rebirth of Classical Art",
        "year": 1450, "lat": 43.77, "lng": 11.25,
        "geo_modern": "Florence, Italy", "geo_era_label": "Republic of Florence",
        "category": "cultural", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Humanist intellectual tradition", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "Under Medici patronage, Florence became the birthplace of the Renaissance — the recovery of classical Greco-Roman learning and art. Brunelleschi's dome, Donatello's sculpture, Botticelli's paintings, and Ficino's Platonic Academy transformed European intellectual and aesthetic culture for centuries.",
             "summary": "The Medici-patronized Florentine Renaissance launched the cultural transformation of European civilization.", "evidence_score": 0.88,
             "sources": [{"title": "The Renaissance", "author": "Paul Johnson", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}]},
            {"label": "Marxist historiography", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Renaissance humanism expressed the cultural aspirations of the rising merchant bourgeoisie. Medici patronage served political legitimation. The 'rebirth' narrative overstates discontinuity with medieval culture — Gothic and scholastic traditions contributed significantly to what we call 'Renaissance.'",
             "summary": "Renaissance was bourgeois merchants buying cultural legitimacy; 'rebirth' exaggerates the break with medieval culture.", "evidence_score": 0.75,
             "sources": [{"title": "Renaissance Studies", "author": "Peter Burke", "publication": "Polity Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}]},
        ],
    },
    {
        "slug": "bartolomeu-dias-cape-1488",
        "title": "Bartolomeu Dias Rounds the Cape of Good Hope",
        "year": 1488, "lat": -34.36, "lng": 18.47,
        "geo_modern": "Cape of Good Hope, South Africa", "geo_era_label": "Portuguese Maritime Empire",
        "category": "discovery", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Portuguese maritime tradition", "culture_code": "pt", "viewpoint_type": "nationalist",
             "narrative": "Bartolomeu Dias rounded Africa's southern tip in 1488, proving a sea route to India was possible. The achievement opened the door for Vasco da Gama's 1498 voyage to India, breaking the Ottoman stranglehold on eastern trade and beginning Portuguese global empire.",
             "summary": "Dias proved the sea route to India, enabling direct Portuguese-Asian trade and ending Ottoman trade monopoly.", "evidence_score": 0.88,
             "sources": [{"title": "Bartolomeu Dias", "author": "C.R. Boxer", "publication": "Hakluyt Society", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1973}]},
            {"label": "Southern African indigenous perspective", "culture_code": "za", "viewpoint_type": "indigenous",
             "narrative": "For the Khoikhoi people of the Cape, Dias's arrival began a centuries-long process of colonial encroachment, smallpox epidemics, and eventual destruction of their traditional pastoral society. The 'Cape of Good Hope' was good hope for Europeans, not for the Africans who already lived there.",
             "summary": "European 'discovery' initiated colonial dispossession of the Khoikhoi people who already inhabited the Cape.", "evidence_score": 0.80,
             "sources": [{"title": "The Khoikhoi and the Founding of White South Africa", "author": "Richard Elphick", "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1977}]},
        ],
    },
    {
        "slug": "pizarro-conquers-inca-1532",
        "title": "Pizarro Conquers the Inca Empire",
        "year": 1532, "lat": -7.18, "lng": -78.5,
        "geo_modern": "Cajamarca, Peru", "geo_era_label": "Spanish Conquest of Peru",
        "category": "war", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Spanish colonial account", "culture_code": "es", "viewpoint_type": "government",
             "narrative": "Francisco Pizarro captured Inca Emperor Atahualpa at Cajamarca with 168 soldiers against thousands of Inca warriors, extracted the largest ransom in history, then executed him. Within a decade, 200 Spaniards had conquered an empire of 12 million people and seized vast silver wealth.",
             "summary": "Pizarro's conquest brought immense silver wealth to Spain and dismantled the Inca Empire within a decade.", "evidence_score": 0.85,
             "sources": [{"title": "Conquest of the Incas", "author": "John Hemming", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1970}]},
            {"label": "Andean indigenous tradition", "culture_code": "pe", "viewpoint_type": "indigenous",
             "narrative": "The Inca conquest brought catastrophic demographic collapse — disease, forced labor in silver mines, and cultural destruction reduced the Andean population by 90% within a century. The Tawantinsuyu was a sophisticated civilization with irrigation, roads, and quipu records — systematically destroyed.",
             "summary": "Spanish conquest destroyed a sophisticated civilization and killed 90% of Andean people within a century.", "evidence_score": 0.88,
             "sources": [{"title": "The Incas: New Perspectives", "author": "Gordon McEwan", "publication": "ABC-CLIO", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}]},
        ],
    },
    {
        "slug": "dutch-east-india-company-voc-1602",
        "title": "Dutch East India Company (VOC) Founded",
        "year": 1602, "lat": 52.37, "lng": 4.89,
        "geo_modern": "Amsterdam, Netherlands", "geo_era_label": "Dutch Republic",
        "category": "political", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Dutch commercial tradition", "culture_code": "nl", "viewpoint_type": "government",
             "narrative": "The VOC was the world's first publicly traded corporation with permanent capital stock, effectively the world's largest corporation for 200 years. It pioneered modern corporate finance, colonialism as private enterprise, and the joint-stock company structure that shapes capitalism today.",
             "summary": "The VOC invented the modern corporation, joint-stock trading, and colonial capitalism as private enterprise.", "evidence_score": 0.90,
             "sources": [{"title": "The Dutch Seaborne Empire", "author": "C.R. Boxer", "publication": "Hutchinson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1965}]},
            {"label": "Indonesian colonial history", "culture_code": "id", "viewpoint_type": "indigenous",
             "narrative": "For Southeast Asian peoples, the VOC meant monopoly trade enforced by military violence, forced delivery of spices below market prices, and colonial governance. The VOC massacred the Banda Islanders to monopolize nutmeg — arguably the world's first corporate-sponsored ethnic cleansing.",
             "summary": "For Southeast Asians, VOC meant monopoly violence and colonial extraction, including the Banda Islands massacre.", "evidence_score": 0.88,
             "sources": [{"title": "Nathaniel's Nutmeg", "author": "Giles Milton", "publication": "Sceptre", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}]},
        ],
    },
    {
        "slug": "english-glorious-revolution-1688-parliament",
        "title": "Glorious Revolution — Parliamentary Sovereignty Established",
        "year": 1688, "lat": 51.5, "lng": -0.12,
        "geo_modern": "London, England", "geo_era_label": "British Isles",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Whig parliamentary tradition", "culture_code": "gb", "viewpoint_type": "political",
             "narrative": "The Glorious Revolution (1688) overthrew Catholic James II without bloodshed, installing Protestant William III and establishing parliamentary sovereignty through the Bill of Rights (1689). John Locke's Second Treatise justified it philosophically; it became the model for liberal constitutional government.",
             "summary": "The Glorious Revolution established constitutional monarchy, parliamentary sovereignty, and the liberal tradition.", "evidence_score": 0.88,
             "sources": [{"title": "Two Treatises of Government", "author": "John Locke", "publication": "Awnsham Churchill", "source_type": "primary", "reliability_tier": 2, "year": 1689}]},
            {"label": "Irish and Scottish perspective", "culture_code": "ie", "viewpoint_type": "nationalist",
             "narrative": "In Ireland, the 'Glorious' Revolution meant Catholic dispossession and the Penal Laws that stripped Catholics of property and civil rights for a century. In Scotland, it led to forced union. The revolution was glorious for English Protestants; for Catholics and Celtic peoples, it was catastrophe.",
             "summary": "The 'Glorious' Revolution brought Catholic dispossession and Penal Laws in Ireland — not glorious for all.", "evidence_score": 0.82,
             "sources": [{"title": "A History of Ireland", "author": "Mike Cronin", "publication": "Palgrave Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2001}]},
        ],
    },
    {
        "slug": "slave-trade-atlantic-peak-1700",
        "title": "Transatlantic Slave Trade at Its Brutal Height",
        "year": 1700, "lat": 5.55, "lng": -0.2,
        "geo_modern": "West Africa / Atlantic Ocean", "geo_era_label": "Colonial Era",
        "category": "cultural", "importance_score": 0.90, "zoom_min": 2,
        "perspectives": [
            {"label": "African diaspora tradition", "culture_code": "global", "viewpoint_type": "civilian",
             "narrative": "The transatlantic slave trade (1500-1900) forcibly transported 12.5 million Africans to the Americas, with 1.8 million dying in the Middle Passage. It devastated West African societies, created the racial capitalism of the plantation system, and built Western wealth on human suffering.",
             "summary": "The slave trade forcibly transported 12.5 million Africans and built Western economic modernity on human suffering.", "evidence_score": 0.92,
             "sources": [{"title": "The Slave Ship: A Human History", "author": "Marcus Rediker", "publication": "Viking", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007},
                         {"title": "Slave Voyages Database", "source_type": "primary", "reliability_tier": 1, "year": 2020}]},
            {"label": "Abolition and economic history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "European slave traders justified the trade through racial theories and economic necessity. Eric Williams argued the trade's profits funded British industrialization. The campaign to abolish it (1787-1833) was the first successful international human rights movement, demonstrating that moral arguments could change economic systems.",
             "summary": "Trade profits funded industrialization; abolition movement demonstrated that moral campaigns can overcome economic interests.", "evidence_score": 0.85,
             "sources": [{"title": "Capitalism and Slavery", "author": "Eric Williams", "publication": "University of North Carolina Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1944}]},
        ],
    },

    # ═══════════════════════════════════════════════════════════════════════
    # EXPANDED EVENTS — Cold War & Decolonization (additional)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "marshall-plan-european-recovery-1948",
        "title": "Marshall Plan — US Rebuilds Western Europe",
        "year": 1948, "lat": 50.85, "lng": 4.35,
        "geo_modern": "Western Europe", "geo_era_label": "Early Cold War",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "American Cold War strategy", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "Secretary of State George Marshall's European Recovery Program (1948-1952) provided $13 billion to rebuild Western Europe's economy. US strategists understood poverty bred communism; Marshall aid was simultaneously humanitarian, economic, and geopolitical — buying Western European loyalty against Soviet expansion.",
             "summary": "Marshall Plan rebuilt Western Europe economically and tied it to the US sphere against Soviet communism.", "evidence_score": 0.90,
             "sources": [{"title": "The Marshall Plan", "author": "Benn Steil", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}]},
            {"label": "Soviet bloc perspective", "culture_code": "ru", "viewpoint_type": "government",
             "narrative": "The USSR rejected Marshall aid and forced Eastern European satellites to decline, seeing it as American economic imperialism. Stalin created Comecon as an alternative. The plan accelerated Europe's division into opposing economic blocs.",
             "summary": "USSR rejected Marshall aid as US economic imperialism; forced Eastern Europe to refuse, deepening Cold War division.", "evidence_score": 0.85,
             "sources": [{"title": "The Cold War: A World History", "author": "Odd Arne Westad", "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2017}]},
        ],
    },
    {
        "slug": "nato-founding-1949",
        "title": "NATO Founded — Western Military Alliance",
        "year": 1949, "lat": 38.9, "lng": -77.0,
        "geo_modern": "Washington D.C., USA", "geo_era_label": "Early Cold War",
        "category": "political", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Western democratic perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "NATO was founded in April 1949 by 12 nations for collective defense against Soviet expansion after the Berlin Blockade and Czech coup. Article 5's mutual defense commitment deterred Soviet military adventurism in Western Europe for 40 years of Cold War.",
             "summary": "NATO's Article 5 mutual defense successfully deterred Soviet military expansion in Western Europe.", "evidence_score": 0.88,
             "sources": [{"title": "The North Atlantic Treaty (original document)", "source_type": "primary", "reliability_tier": 1, "year": 1949}]},
            {"label": "Soviet perspective", "culture_code": "ru", "viewpoint_type": "government",
             "narrative": "From Moscow's perspective, NATO was aggressive encirclement by capitalist powers that had invaded Russia in 1918 and supported Hitler. The alliance justified Warsaw Pact militarization and deepened the Cold War division of Europe into armed camps.",
             "summary": "USSR viewed NATO as aggressive encirclement; it justified Warsaw Pact military buildup and hardened Cold War division.", "evidence_score": 0.82,
             "sources": [{"title": "My Years in the Soviet Foreign Ministry", "author": "Andrei Gromyko", "publication": "Doubleday", "source_type": "primary", "reliability_tier": 2, "year": 1989}]},
        ],
    },
    {
        "slug": "sputnik-space-race-1957",
        "title": "Soviet Sputnik Launches the Space Race",
        "year": 1957, "lat": 45.92, "lng": 63.34,
        "geo_modern": "Baikonur Cosmodrome, Kazakhstan", "geo_era_label": "Cold War Space Race",
        "category": "discovery", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Soviet technological achievement", "culture_code": "ru", "viewpoint_type": "government",
             "narrative": "The USSR launched Sputnik 1 on October 4, 1957 — the world's first artificial satellite — shocking the West. Sputnik proved Soviet ICBMs could reach American cities, transforming Cold War military strategy and beginning the Space Race that would culminate in the Moon landing.",
             "summary": "Sputnik proved Soviet missile capability and launched the Space Race, changing Cold War military calculus permanently.", "evidence_score": 0.92,
             "sources": [{"title": "Sputnik and the Space Race", "author": "Paul Dickson", "publication": "University of Nebraska Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2001}]},
            {"label": "American security perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "Sputnik triggered a national crisis: if Soviets could orbit a satellite, they could deliver nuclear warheads anywhere. Congress passed the National Defense Education Act, NASA was created, and the US space program received emergency funding — ultimately driving the Apollo Moon landing.",
             "summary": "Sputnik caused a US panic that created NASA, reformed education, and drove the Apollo program.", "evidence_score": 0.90,
             "sources": [{"title": "The Right Stuff", "author": "Tom Wolfe", "publication": "Farrar, Straus & Giroux", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 1979}]},
        ],
    },
    {
        "slug": "cuban-revolution-fidel-castro-1959",
        "title": "Cuban Revolution — Castro Takes Power",
        "year": 1959, "lat": 23.13, "lng": -82.38,
        "geo_modern": "Havana, Cuba", "geo_era_label": "Cold War Latin America",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Cuban revolutionary tradition", "culture_code": "cu", "viewpoint_type": "nationalist",
             "narrative": "Fidel Castro and the 26th of July Movement overthrew US-backed dictator Batista in January 1959. The revolution promised to end US economic domination, redistribute land, and provide universal education and healthcare — transforming Cuba from a US client state to a socialist state.",
             "summary": "Revolution ended US-backed dictatorship and promised socialist development free of American economic domination.", "evidence_score": 0.82,
             "sources": [{"title": "History Will Absolve Me", "author": "Fidel Castro", "source_type": "primary", "reliability_tier": 2, "year": 1953}]},
            {"label": "US Cold War perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "For Washington, a communist Cuba 90 miles from Florida was an existential security threat violating the Monroe Doctrine. The Bay of Pigs invasion (1961) and Cuban Missile Crisis (1962) showed how dangerous the Soviet-Cuban connection was to US security.",
             "summary": "US viewed communist Cuba as Soviet beachhead; response brought the world to the nuclear brink in 1962.", "evidence_score": 0.85,
             "sources": [{"title": "Making the Second Cold War", "author": "Fred Halliday", "publication": "Verso", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}]},
        ],
    },
    {
        "slug": "year-of-africa-independence-1960",
        "title": "Year of Africa — 17 Nations Gain Independence",
        "year": 1960, "lat": 6.37, "lng": 2.39,
        "geo_modern": "Sub-Saharan Africa", "geo_era_label": "African Decolonization",
        "category": "political", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "African nationalist tradition", "culture_code": "ng", "viewpoint_type": "nationalist",
             "narrative": "1960 saw 17 African nations gain independence — from Cameroon to Nigeria, Senegal to Madagascar. The wave fulfilled Pan-African visions of Nkrumah, Sékou Touré, and Lumumba: self-determination and freedom from European exploitation after nearly a century of colonialism.",
             "summary": "17 nations gaining independence in one year fulfilled Pan-African dreams of self-determination.", "evidence_score": 0.88,
             "sources": [{"title": "Africa Must Unite", "author": "Kwame Nkrumah", "publication": "International Publishers", "source_type": "primary", "reliability_tier": 2, "year": 1963}]},
            {"label": "Neo-colonial critique", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Fanon and Nkrumah argued formal independence masked neo-colonialism: European corporations retained African resources, Cold War powers replaced colonial administrators with aligned dictators, and political independence without economic independence was incomplete liberation.",
             "summary": "Formal independence masked neo-colonial economic dependence and Cold War manipulation of new governments.", "evidence_score": 0.82,
             "sources": [{"title": "The Wretched of the Earth", "author": "Frantz Fanon", "publication": "Présence Africaine", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}]},
        ],
    },
    {
        "slug": "suez-crisis-1956-nasser",
        "title": "Suez Crisis — End of British Imperial Power",
        "year": 1956, "lat": 30.58, "lng": 32.27,
        "geo_modern": "Suez Canal, Egypt", "geo_era_label": "Cold War Middle East",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Egyptian nationalist perspective", "culture_code": "eg", "viewpoint_type": "nationalist",
             "narrative": "Nasser's nationalization of the Suez Canal was the defining moment of Arab nationalism. When Israel, Britain, and France secretly conspired to invade, US pressure forced their humiliating withdrawal, proving Egypt's sovereignty and making Nasser the Arab world's hero.",
             "summary": "Suez proved Arab nationalism could prevail; US pressure humiliated Britain and France, ending their imperial pretensions.", "evidence_score": 0.88,
             "sources": [{"title": "The Suez Crisis", "author": "Keith Kyle", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1991}]},
            {"label": "British and French imperial perspective", "culture_code": "gb", "viewpoint_type": "government",
             "narrative": "Britain and France saw Nasser as a new Hitler whose appeasement was fatal. US abandonment of allies marked the definitive end of British and French great-power status — the moment when American dominance replaced European imperial power even over formal allies.",
             "summary": "Suez humiliated Britain and France; US refusal to back allies marked the final end of European great-power status.", "evidence_score": 0.88,
             "sources": [{"title": "Suez 1956", "author": "David Carlton", "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988}]},
        ],
    },
    {
        "slug": "six-day-war-1967-israel",
        "title": "Six-Day War — Israel Seizes West Bank, Gaza, Sinai",
        "year": 1967, "lat": 31.77, "lng": 35.22,
        "geo_modern": "Israel / West Bank / Gaza / Sinai", "geo_era_label": "Cold War Middle East",
        "category": "war", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Israeli security perspective", "culture_code": "il", "viewpoint_type": "government",
             "narrative": "Facing existential threats from coordinated Arab armies and Egyptian blockade of Eilat, Israel launched a preemptive strike, destroying Arab air forces in hours. The Six-Day War tripled Israeli territory and demonstrated Israeli military superiority — but created the occupation that still defines the conflict.",
             "summary": "Preemptive Israeli strike won a stunning military victory but created the occupation that still defines the conflict.", "evidence_score": 0.88,
             "sources": [{"title": "Six Days of War", "author": "Michael Oren", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}]},
            {"label": "Palestinian and Arab perspective", "culture_code": "ps", "viewpoint_type": "nationalist",
             "narrative": "For Palestinians, the 1967 Naksa ('setback') began the occupation of the West Bank and Gaza. Displacement of hundreds of thousands and military administration over civilian populations created conditions for decades of resistance, including the PLO and two Intifadas.",
             "summary": "The war began military occupation of Palestinian territories — creating conditions for all subsequent Palestinian resistance.", "evidence_score": 0.85,
             "sources": [{"title": "The Hundred Years War on Palestine", "author": "Rashid Khalidi", "publication": "Metropolitan Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2020}]},
        ],
    },
    {
        "slug": "iranian-revolution-khomeini-1979",
        "title": "Iranian Revolution — Islamic Republic Proclaimed",
        "year": 1979, "lat": 35.69, "lng": 51.39,
        "geo_modern": "Tehran, Iran", "geo_era_label": "Cold War Middle East",
        "category": "political", "importance_score": 0.90, "zoom_min": 2,
        "perspectives": [
            {"label": "Iranian Islamic revolutionary tradition", "culture_code": "ir", "viewpoint_type": "religious",
             "narrative": "The Iranian Revolution overthrew Mohammad Reza Shah's US-backed monarchy and established the Islamic Republic under Ayatollah Khomeini, representing rejection of Western-imposed modernization and decades of political repression including the CIA-backed 1953 coup that deposed Mossadegh.",
             "summary": "The revolution overthrew US-backed authoritarianism and established a theocratic republic rejecting Western domination.", "evidence_score": 0.85,
             "sources": [{"title": "The Islamic Revolution", "author": "Misagh Parsa", "publication": "Johns Hopkins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]},
            {"label": "US foreign policy perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "The Shah's fall was a catastrophic blow to US regional strategy — losing a key ally with massive oil reserves. The 444-day hostage crisis and subsequent Iran-Iraq War showed how the revolution reshaped the entire Middle East security architecture for decades.",
             "summary": "Revolution lost the US a crucial ally, triggered the hostage crisis, and reshaped Middle Eastern geopolitics permanently.", "evidence_score": 0.85,
             "sources": [{"title": "All the Shah's Men", "author": "Stephen Kinzer", "publication": "Wiley", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}]},
        ],
    },
    {
        "slug": "soviet-afghan-war-1979-mujahideen",
        "title": "Soviet Invasion of Afghanistan",
        "year": 1979, "lat": 34.52, "lng": 69.18,
        "geo_modern": "Kabul, Afghanistan", "geo_era_label": "Cold War Central Asia",
        "category": "war", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Soviet strategic perspective", "culture_code": "ru", "viewpoint_type": "government",
             "narrative": "The Soviet Union intervened in December 1979 to stabilize a communist government threatened by mujahideen rebels. The leadership underestimated Afghan resistance and international response. The 10-year war became the Soviet 'Vietnam' — draining resources and morale, contributing to USSR's eventual collapse.",
             "summary": "USSR intervened to stabilize a communist ally but was trapped in a 10-year war that contributed to Soviet collapse.", "evidence_score": 0.85,
             "sources": [{"title": "The Soviet-Afghan War", "author": "The Russian General Staff", "publication": "University Press of Kansas", "source_type": "primary", "reliability_tier": 2, "year": 2002}]},
            {"label": "Afghan resistance / US proxy war perspective", "culture_code": "af", "viewpoint_type": "nationalist",
             "narrative": "CIA-funded mujahideen, backed by Saudi money and Pakistani logistics, defeated Soviet forces. But the infrastructure built — weapons networks, foreign fighters, Islamist organizations — later formed the Taliban and al-Qaeda. The US 'won' the Cold War battle and lost the subsequent peace.",
             "summary": "CIA-funded mujahideen won but the infrastructure built became the Taliban and al-Qaeda — a strategic disaster.", "evidence_score": 0.85,
             "sources": [{"title": "Charlie Wilson's War", "author": "George Crile", "publication": "Grove Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}]},
        ],
    },
    {
        "slug": "tiananmen-square-massacre-1989",
        "title": "Tiananmen Square Massacre",
        "year": 1989, "lat": 39.9, "lng": 116.39,
        "geo_modern": "Beijing, China", "geo_era_label": "Post-Mao China",
        "category": "political", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Chinese student democracy movement", "culture_code": "cn", "viewpoint_type": "civilian",
             "narrative": "Hundreds of thousands occupied Tiananmen Square in April-June 1989, demanding democratic reform and press freedom. On June 4, the PLA cleared the square with tanks. Death toll estimates range from hundreds to thousands. The iconic 'Tank Man' photograph became a global symbol of individual courage against state power.",
             "summary": "Students demanding democracy were killed when the PLA cleared the square; death toll estimates range from hundreds to thousands.", "evidence_score": 0.85,
             "sources": [{"title": "The Tiananmen Papers", "author": "Andrew Nathan et al.", "publication": "PublicAffairs", "source_type": "primary", "reliability_tier": 2, "year": 2001}]},
            {"label": "Chinese Communist Party official position", "culture_code": "cn", "viewpoint_type": "government",
             "narrative": "The Chinese government maintains the crackdown prevented counterrevolutionary chaos and preserved stability necessary for China's subsequent economic development. The CCP frames it as a necessary defense of socialist order; the topic is heavily censored domestically.",
             "summary": "CCP frames crackdown as necessary for stability enabling China's economic rise; topic remains heavily censored.", "evidence_score": 0.65,
             "sources": [{"title": "People's Daily editorial, June 1989", "source_type": "primary", "reliability_tier": 3, "year": 1989}]},
        ],
    },
    {
        "slug": "german-reunification-october-1990",
        "title": "German Reunification",
        "year": 1990, "lat": 52.52, "lng": 13.4,
        "geo_modern": "Berlin, Germany", "geo_era_label": "End of Cold War",
        "category": "political", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "German democratic tradition", "culture_code": "de", "viewpoint_type": "nationalist",
             "narrative": "Germany's peaceful reunification on October 3, 1990 — 45 years after WWII's division — was achieved through Kohl's diplomacy, the 2+4 Treaty, and East Germans' desire for freedom. NATO membership was retained; the Deutschmark's weight made rapid integration attractive.",
             "summary": "Peaceful German reunification through diplomacy and economic integration completed Europe's post-Cold War transition.", "evidence_score": 0.90,
             "sources": [{"title": "Germany Unified and Europe Transformed", "author": "Philip Zelikow & Condoleezza Rice", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}]},
            {"label": "European neighbors' perspective", "culture_code": "eu", "viewpoint_type": "foreign",
             "narrative": "France and Britain had reservations about a dominant reunified Germany. Thatcher opposed reunification; Mitterrand initially hesitated. France's price for acquiescence was German commitment to the Euro — making German reunification a primary driver of European monetary union.",
             "summary": "European neighbors' fears shaped reunification terms; French support was conditional on German commitment to the Euro.", "evidence_score": 0.85,
             "sources": [{"title": "The German Reunification Question", "author": "Elizabeth Pond", "publication": "Brookings Institution", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}]},
        ],
    },
    {
        "slug": "nelson-mandela-release-1990",
        "title": "Nelson Mandela Released — End of Apartheid Begins",
        "year": 1990, "lat": -33.74, "lng": 18.42,
        "geo_modern": "Cape Town, South Africa", "geo_era_label": "End of Apartheid",
        "category": "political", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "ANC and Black South African tradition", "culture_code": "za", "viewpoint_type": "nationalist",
             "narrative": "Nelson Mandela's release on February 11, 1990 after 27 years in prison was a global moment of hope. F.W. de Klerk's decision to unban the ANC and negotiate came under intense international sanctions pressure and internal resistance. Mandela's moral authority made peaceful transition possible.",
             "summary": "Mandela's release and ANC legalization began South Africa's miraculous peaceful transition from apartheid to democracy.", "evidence_score": 0.92,
             "sources": [{"title": "Long Walk to Freedom", "author": "Nelson Mandela", "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 1, "year": 1994}]},
            {"label": "International sanctions perspective", "culture_code": "global", "viewpoint_type": "foreign",
             "narrative": "International economic sanctions, sports boycotts, and global solidarity campaigns created the economic pressure that made apartheid unsustainable. The successful transition showed that sustained international pressure on human rights violators could achieve peaceful change without military intervention.",
             "summary": "International sanctions proved that economic pressure and global solidarity can achieve peaceful political change.", "evidence_score": 0.88,
             "sources": [{"title": "Anatomy of a Miracle", "author": "Patti Waldmeir", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997}]},
        ],
    },
    {
        "slug": "gulf-war-desert-storm-1991",
        "title": "Gulf War — US Coalition Expels Iraq from Kuwait",
        "year": 1991, "lat": 29.37, "lng": 47.98,
        "geo_modern": "Kuwait / Iraq", "geo_era_label": "Post-Cold War",
        "category": "war", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "US-led coalition perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "Operation Desert Storm liberated Kuwait in 100 hours of ground combat after 5 weeks of aerial bombing. The war demonstrated US post-Cold War military supremacy, restored Gulf oil security, and appeared to validate collective security — but left Saddam in power and US forces permanently based in Arabia.",
             "summary": "Desert Storm demonstrated US post-Cold War military supremacy but left seeds of future conflict with forces in Arabia.", "evidence_score": 0.88,
             "sources": [{"title": "It Doesn't Take a Hero", "author": "Norman Schwarzkopf", "publication": "Bantam", "source_type": "primary", "reliability_tier": 2, "year": 1992}]},
            {"label": "Arab world perspective", "culture_code": "iq", "viewpoint_type": "foreign",
             "narrative": "For many Arabs and Islamists, the Gulf War positioned Western military forces permanently in Saudi Arabia — considered by Osama bin Laden a desecration of holy land motivating his subsequent terrorism. The war created the grievance that drove al-Qaeda's September 11 attacks.",
             "summary": "US bases in Arabia resulting from Gulf War became bin Laden's primary grievance, motivating al-Qaeda terrorism.", "evidence_score": 0.82,
             "sources": [{"title": "Imperial Hubris", "author": "Michael Scheuer", "publication": "Potomac Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}]},
        ],
    },
    {
        "slug": "solidarity-poland-1980",
        "title": "Solidarity Movement — Poland's Anti-Communist Revolution",
        "year": 1980, "lat": 54.35, "lng": 18.65,
        "geo_modern": "Gdańsk, Poland", "geo_era_label": "Late Cold War Eastern Europe",
        "category": "political", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Polish democratic tradition", "culture_code": "pl", "viewpoint_type": "civilian",
             "narrative": "Solidarity, born from the Gdańsk shipyard strikes of 1980 under Lech Wałęsa, became the Soviet bloc's first independent trade union with 10 million members. Its nonviolent challenge to communist authority, backed by Pope John Paul II, created the model for peaceful revolution that ended communism in 1989.",
             "summary": "Solidarity's nonviolent model with 10 million members created the template for peaceful anti-communist revolution.", "evidence_score": 0.90,
             "sources": [{"title": "The Polish August", "author": "Neal Ascherson", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1981}]},
            {"label": "Soviet bloc perspective", "culture_code": "ru", "viewpoint_type": "government",
             "narrative": "Moscow saw Solidarity as CIA-backed destabilization threatening the Warsaw Pact's western flank. Martial law in December 1981 suppressed Solidarity for years, but the underlying social forces proved irresistible by 1989.",
             "summary": "Soviet bloc suppressed Solidarity with martial law in 1981 but could not permanently contain the popular demand for change.", "evidence_score": 0.82,
             "sources": [{"title": "The Polish Crisis 1980-1982", "author": "Mark Kramer", "publication": "Cold War International History Project", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}]},
        ],
    },
    {
        "slug": "nixon-opens-china-1972",
        "title": "Nixon Opens Relations with China",
        "year": 1972, "lat": 39.9, "lng": 116.39,
        "geo_modern": "Beijing, China", "geo_era_label": "Cold War",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "US realpolitik perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "Nixon's February 1972 visit to China was the Cold War's most dramatic diplomatic reversal — a virulent anti-communist opening to the world's largest communist state. Kissinger's triangular diplomacy exploited the Sino-Soviet split to pressure the USSR while normalizing China's international status.",
             "summary": "Nixon's China opening exploited Sino-Soviet split to create strategic leverage against the USSR.", "evidence_score": 0.90,
             "sources": [{"title": "White House Years", "author": "Henry Kissinger", "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 2, "year": 1979}]},
            {"label": "Chinese Communist perspective", "culture_code": "cn", "viewpoint_type": "government",
             "narrative": "For Mao and Zhou Enlai, opening to the US created a counterweight to the Soviet military threat on China's northern border — the USSR had clashed with China at Zhenbao Island in 1969. Normalization also opened international recognition denied since 1949.",
             "summary": "China opened to the US to counterbalance Soviet military threat on its border and gain international legitimacy.", "evidence_score": 0.85,
             "sources": [{"title": "On China", "author": "Henry Kissinger", "publication": "Penguin Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}]},
        ],
    },
    {
        "slug": "dna-double-helix-watson-crick-1953",
        "title": "Watson and Crick Discover the DNA Double Helix",
        "year": 1953, "lat": 52.2, "lng": 0.12,
        "geo_modern": "Cambridge, England", "geo_era_label": "Post-WWII Science",
        "category": "discovery", "importance_score": 0.90, "zoom_min": 2,
        "perspectives": [
            {"label": "Molecular biology tradition", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Watson and Crick's 1953 Nature paper announcing the double helix structure of DNA is among the most important scientific papers ever published. It explained how genetic information is encoded and replicated — the foundation of modern genetics, medicine, forensics, and the entire biotechnology industry.",
             "summary": "The double helix discovery is the foundation of modern genetics, medicine, forensics, and all biotechnology.", "evidence_score": 0.95,
             "sources": [{"title": "Molecular Structure of Nucleic Acids", "author": "J.D. Watson & F.H.C. Crick", "publication": "Nature", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1953}]},
            {"label": "Feminist science history", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Rosalind Franklin's X-ray crystallography Photo 51, shown to Watson without her knowledge by Maurice Wilkins, was crucial to identifying the double helix. Franklin received no Nobel Prize (she died in 1958 before it was awarded). Her exclusion from credit exemplifies structural sexism in mid-century science.",
             "summary": "Franklin's key data was used without permission; her exclusion from the Nobel Prize is emblematic of scientific sexism.", "evidence_score": 0.88,
             "sources": [{"title": "Rosalind Franklin: The Dark Lady of DNA", "author": "Brenda Maddox", "publication": "HarperCollins", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}]},
        ],
    },
    {
        "slug": "world-wide-web-berners-lee-1991",
        "title": "World Wide Web Goes Public",
        "year": 1991, "lat": 46.23, "lng": 6.05,
        "geo_modern": "CERN, Geneva, Switzerland", "geo_era_label": "Information Age",
        "category": "discovery", "importance_score": 0.92, "zoom_min": 1,
        "perspectives": [
            {"label": "Computer science tradition", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Tim Berners-Lee's World Wide Web (1989 proposal, 1991 public release) added hypertext markup, URLs, and HTTP to the existing internet, creating universally accessible information sharing. By giving the web to the world without patent, he enabled the information revolution that transformed every aspect of human society.",
             "summary": "Berners-Lee invented the web and gave it freely to the world, enabling the information revolution.", "evidence_score": 0.92,
             "sources": [{"title": "Weaving the Web", "author": "Tim Berners-Lee", "publication": "HarperCollins", "source_type": "primary", "reliability_tier": 1, "year": 1999}]},
            {"label": "Digital capitalism critique", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Web's open architecture was quickly colonized by commercial interests. By the 2010s, platform monopolies (Google, Facebook, Amazon) captured the value Berners-Lee hoped would be distributed. His vision of decentralized information sharing became concentrated surveillance capitalism — the opposite of his intent.",
             "summary": "The Web's open idealism was captured by platform monopolies creating surveillance capitalism opposite to Berners-Lee's vision.", "evidence_score": 0.85,
             "sources": [{"title": "The Age of Surveillance Capitalism", "author": "Shoshana Zuboff", "publication": "PublicAffairs", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2019}]},
        ],
    },
    {
        "slug": "green-revolution-borlaug-1968",
        "title": "Green Revolution — Norman Borlaug Prevents Famine",
        "year": 1968, "lat": 20.59, "lng": 78.96,
        "geo_modern": "India / Mexico / Pakistan", "geo_era_label": "Cold War Development",
        "category": "discovery", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Agricultural science perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Norman Borlaug's high-yield, disease-resistant wheat varieties transformed agriculture in Mexico, India, and Pakistan. Between 1960 and 1990, Asian wheat production tripled, preventing the mass famines Malthusian analysts predicted. Borlaug won the Nobel Peace Prize in 1970, credited with saving a billion lives.",
             "summary": "Borlaug's high-yield varieties tripled Asian food production and prevented mass famines, credited with saving a billion lives.", "evidence_score": 0.88,
             "sources": [{"title": "Nobel Lecture", "author": "Norman Borlaug", "source_type": "primary", "reliability_tier": 1, "year": 1970}]},
            {"label": "Environmental and social justice critique", "culture_code": "in", "viewpoint_type": "civilian",
             "narrative": "Critics argue the Green Revolution benefited large landowners over small farmers, created dependency on expensive chemical inputs and irrigation, depleted aquifers, caused soil salinization, and reduced biodiversity through monoculture promotion. In Punjab, groundwater depletion is now a crisis.",
             "summary": "Green Revolution created food security but generated environmental damage and agrarian inequality still felt today.", "evidence_score": 0.80,
             "sources": [{"title": "The Violence of the Green Revolution", "author": "Vandana Shiva", "publication": "Zed Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1991}]},
        ],
    },
    {
        "slug": "printing-revolution-gutenberg-1455",
        "title": "Gutenberg's Bible — The Printing Revolution",
        "year": 1455, "lat": 49.99, "lng": 8.27,
        "geo_modern": "Mainz, Germany", "geo_era_label": "Late Medieval Germany",
        "category": "discovery", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Early modern intellectual history", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Gutenberg's movable type printing press made books 50 times cheaper, enabling mass literacy. The Gutenberg Bible (1455) was the first mass-produced book; within decades, printed works disseminated the Renaissance, Reformation, and Scientific Revolution. It is arguably the most transformative technology in human intellectual history.",
             "summary": "The printing press enabled mass literacy and disseminated the Renaissance, Reformation, and Scientific Revolution simultaneously.", "evidence_score": 0.92,
             "sources": [{"title": "The Printing Revolution in Early Modern Europe", "author": "Elizabeth Eisenstein", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}]},
            {"label": "Church and establishment perspective", "culture_code": "eu", "viewpoint_type": "religious",
             "narrative": "Church authorities initially welcomed the press for bibles but recognized its subversive potential when heretical ideas spread faster than censorship could suppress them. The Reformation's success was directly tied to print disseminating Luther's ideas instantaneously across Europe.",
             "summary": "The press's subversive power outran censorship — enabling the Reformation to spread faster than the Church could respond.", "evidence_score": 0.88,
             "sources": [{"title": "The Nature of the Book", "author": "Adrian Johns", "publication": "University of Chicago Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}]},
        ],
    },
    {
        "slug": "french-revolution-storming-bastille-1789-expanded",
        "title": "Storming of the Bastille and the French Revolutionary Terror",
        "year": 1793, "lat": 48.85, "lng": 2.37,
        "geo_modern": "Paris, France", "geo_era_label": "French Revolution",
        "category": "political", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Revolutionary liberal tradition", "culture_code": "fr", "viewpoint_type": "nationalist",
             "narrative": "The Reign of Terror (1793-1794) saw the Committee of Public Safety under Robespierre execute 16,594 officially and kill 40,000 total in defense of the Revolution against counter-revolutionary threats — foreign invasion, royalist uprisings, and internal enemies. The Terror was the Revolution's most radical and controversial phase.",
             "summary": "The Terror killed 40,000 in defense of the Revolution against real and perceived counter-revolutionary threats.", "evidence_score": 0.88,
             "sources": [{"title": "Citizens: A Chronicle of the French Revolution", "author": "Simon Schama", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]},
            {"label": "Conservative reaction and Burke's critique", "culture_code": "gb", "viewpoint_type": "political",
             "narrative": "Edmund Burke's Reflections on the Revolution in France (1790) predicted the Terror would follow from the Revolution's abstract rationalism overturning organic social institutions. The Terror vindicated conservative arguments that radical revolution destroys social fabric and produces tyranny worse than what it replaces.",
             "summary": "Burke predicted the Terror; conservatives argued it proved radical revolution produces tyranny worse than the old regime.", "evidence_score": 0.82,
             "sources": [{"title": "Reflections on the Revolution in France", "author": "Edmund Burke", "publication": "J. Dodsley", "source_type": "primary", "reliability_tier": 2, "year": 1790}]},
        ],
    },
    {
        "slug": "american-constitution-1787",
        "title": "US Constitutional Convention — The Federal Republic",
        "year": 1787, "lat": 39.95, "lng": -75.17,
        "geo_modern": "Philadelphia, Pennsylvania, USA", "geo_era_label": "Early United States",
        "category": "political", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Founding Fathers tradition", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "The Philadelphia Convention of 1787 drafted the US Constitution, creating the world's oldest functioning written constitution. Its innovations — separation of powers, federalism, Bill of Rights, judicial review — became models for constitutional government globally and defined American political identity.",
             "summary": "The Constitution created the world's oldest functioning constitutional republic and a global model for democratic governance.", "evidence_score": 0.90,
             "sources": [{"title": "The Federalist Papers", "author": "Hamilton, Madison & Jay", "source_type": "primary", "reliability_tier": 1, "year": 1788}]},
            {"label": "Critical race and democratic theory", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Constitution enshrined slavery through the three-fifths compromise, the slave trade protection, and the fugitive slave clause. Women, enslaved people, and the propertyless were excluded from its rights. The document's 'we the people' excluded the majority of people actually living in America.",
             "summary": "The Constitution's democratic ideals coexisted with slavery protections and exclusions that required centuries to partially correct.", "evidence_score": 0.85,
             "sources": [{"title": "The Slave Power: The Free North and Southern Domination", "author": "Leonard Richards", "publication": "Louisiana State University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}]},
        ],
    },
    {
        "slug": "bolshevik-revolution-october-1917-expanded",
        "title": "October Revolution — Lenin and the Bolsheviks Seize Power",
        "year": 1917, "lat": 59.95, "lng": 30.32,
        "geo_modern": "Petrograd (Saint Petersburg), Russia", "geo_era_label": "Russian Empire",
        "category": "political", "importance_score": 0.93, "zoom_min": 2,
        "perspectives": [
            {"label": "Marxist-Leninist tradition", "culture_code": "ru", "viewpoint_type": "political",
             "narrative": "Lenin's Bolsheviks seized power in October 1917, overthrowing the Provisional Government. For Marxists, it was the world's first successful proletarian revolution — proving Marxist theory correct and establishing the Soviet Union as a workers' state. It inspired communist movements globally for 70 years.",
             "summary": "The first successful Marxist revolution created the Soviet Union and inspired global communist movements for 70 years.", "evidence_score": 0.85,
             "sources": [{"title": "Ten Days That Shook the World", "author": "John Reed", "publication": "Boni & Liveright", "source_type": "primary", "reliability_tier": 2, "year": 1919}]},
            {"label": "Liberal democratic critique", "culture_code": "global", "viewpoint_type": "political",
             "narrative": "Liberal historians argue the Bolshevik coup overthrew a nascent democracy (the Constituent Assembly) and established a totalitarian party dictatorship. Lenin's 'democratic centralism' concentrated power that Stalin later used for mass murder, making the Revolution a path to tyranny rather than liberation.",
             "summary": "Bolsheviks overthrew nascent democracy and established totalitarianism that enabled Stalin's subsequent mass murders.", "evidence_score": 0.82,
             "sources": [{"title": "The Russian Revolution", "author": "Orlando Figes", "publication": "Jonathan Cape", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}]},
        ],
    },
    {
        "slug": "hiroshima-context-manhattan-project",
        "title": "Manhattan Project — Building the Atomic Bomb",
        "year": 1942, "lat": 35.88, "lng": -106.31,
        "geo_modern": "Los Alamos, New Mexico, USA", "geo_era_label": "World War II",
        "category": "discovery", "importance_score": 0.90, "zoom_min": 2,
        "perspectives": [
            {"label": "Manhattan Project scientists", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Manhattan Project (1942-1945) mobilized 130,000 workers and $2 billion to build the first nuclear weapons. Scientists including Oppenheimer, Fermi, and Szilard — many European refugees fleeing fascism — built the bomb to ensure Hitler didn't get it first. Their success and its use changed human history permanently.",
             "summary": "Scientists built the bomb to prevent Hitler from getting it first; its use at Hiroshima changed human history forever.", "evidence_score": 0.92,
             "sources": [{"title": "American Prometheus", "author": "Kai Bird & Martin Sherwin", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}]},
            {"label": "Global nuclear abolition perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Trinity inaugurated the nuclear age. Scientists who built the bomb (the Bulletin of Atomic Scientists, Einstein-Russell Manifesto) immediately began campaigning against proliferation. The Manhattan Project created a technology capable of human extinction — making its political management the defining challenge of the modern era.",
             "summary": "The Manhattan Project created an extinction-level technology; managing its proliferation became humanity's defining challenge.", "evidence_score": 0.88,
             "sources": [{"title": "The Bulletin of the Atomic Scientists founding statement", "source_type": "primary", "reliability_tier": 2, "year": 1945}]},
        ],
    },
    {
        "slug": "cold-war-arms-race-hydrogen-bomb-1952",
        "title": "Hydrogen Bomb — Nuclear Arms Race Escalates",
        "year": 1952, "lat": 11.35, "lng": 162.34,
        "geo_modern": "Eniwetok Atoll, Pacific Ocean", "geo_era_label": "Early Cold War",
        "category": "discovery", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "US nuclear deterrence perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "The US tested the first hydrogen bomb (Ivy Mike, 10.4 megatons — 700 times Hiroshima) in November 1952. The USSR tested one in 1953. The thermonuclear revolution made nuclear deterrence through Mutual Assured Destruction (MAD) the defining strategic doctrine of the Cold War.",
             "summary": "H-bomb tests made nuclear deterrence through Mutual Assured Destruction the defining Cold War strategic doctrine.", "evidence_score": 0.88,
             "sources": [{"title": "Dark Sun: The Making of the Hydrogen Bomb", "author": "Richard Rhodes", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}]},
            {"label": "Anti-nuclear movement perspective", "culture_code": "global", "viewpoint_type": "civilian",
             "narrative": "The hydrogen bomb made nuclear war an extinction-level event. The test at Bikini Atoll contaminated the Lucky Dragon fishing crew (1954), galvanizing the global anti-nuclear movement. Bertrand Russell, Albert Einstein, and Linus Pauling led scientific voices for nuclear abolition.",
             "summary": "H-bomb testing galvanized the global anti-nuclear movement by making extinction-level nuclear war tangible.", "evidence_score": 0.85,
             "sources": [{"title": "The Russell-Einstein Manifesto", "author": "Bertrand Russell & Albert Einstein", "source_type": "primary", "reliability_tier": 1, "year": 1955}]},
        ],
    },
    {
        "slug": "opium-wars-china-british-1839-expanded",
        "title": "Opium Wars — British Force China Open",
        "year": 1842, "lat": 23.13, "lng": 113.27,
        "geo_modern": "Canton (Guangzhou), China", "geo_era_label": "Qing Dynasty China",
        "category": "war", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Chinese nationalist perspective", "culture_code": "cn", "viewpoint_type": "nationalist",
             "narrative": "The Opium Wars (1839-42, 1856-60) represent the beginning of China's 'century of humiliation.' Britain forced China to legalize opium imports (addicting millions), open treaty ports, cede Hong Kong, and pay reparations — all enforced at gunpoint to protect Britain's drug trade profits.",
             "summary": "The Opium Wars began China's century of humiliation by British-forced drug trade legalization and territorial concessions.", "evidence_score": 0.90,
             "sources": [{"title": "The Opium War", "author": "Julia Lovell", "publication": "Picador", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}]},
            {"label": "British commercial and legal perspective", "culture_code": "gb", "viewpoint_type": "government",
             "narrative": "British contemporaries framed the wars as a defense of free trade principles against Chinese restrictions. Gladstone famously condemned the opium trade as immoral. The wars established the unequal treaty system that subsequent great powers (France, USA, Russia, Japan) all exploited.",
             "summary": "Britain fought for free trade principles, though Gladstone condemned the opium trade itself as immoral.", "evidence_score": 0.80,
             "sources": [{"title": "The Arrow War", "author": "Douglas Hurd", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}]},
        ],
    },
    {
        "slug": "spanish-american-war-1898",
        "title": "Spanish-American War — US Becomes Imperial Power",
        "year": 1898, "lat": 23.13, "lng": -82.38,
        "geo_modern": "Cuba / Philippines", "geo_era_label": "American Imperial Era",
        "category": "war", "importance_score": 0.80, "zoom_min": 3,
        "perspectives": [
            {"label": "American expansionist tradition", "culture_code": "us", "viewpoint_type": "nationalist",
             "narrative": "The Spanish-American War (1898) gave the US Cuba, Puerto Rico, Guam, and the Philippines in just four months of fighting. It transformed the US from a continental to a global imperial power, fulfilling Mahan's sea power theory and launching American strategic presence in both Caribbean and Pacific.",
             "summary": "The war transformed the US into a global imperial power with possessions from the Caribbean to the Pacific.", "evidence_score": 0.85,
             "sources": [{"title": "The Influence of Sea Power upon History", "author": "Alfred Mahan", "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1890}]},
            {"label": "Filipino and Cuban independence perspective", "culture_code": "ph", "viewpoint_type": "nationalist",
             "narrative": "The US promised Cuban and Filipino independence but instead imposed colonial rule. The Philippine-American War (1899-1902) killed 200,000-1,000,000 Filipinos resisting US occupation. Cuban sovereignty was compromised by the Platt Amendment giving the US the right to intervene militarily.",
             "summary": "The US replaced Spanish colonialism with its own, killing hundreds of thousands of Filipinos resisting occupation.", "evidence_score": 0.82,
             "sources": [{"title": "In Our Image: America's Empire in the Philippines", "author": "Stanley Karnow", "publication": "Random House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]},
        ],
    },
    {
        "slug": "decolonization-india-partition-1947-expanded",
        "title": "Indian Partition — The Violent Birth of India and Pakistan",
        "year": 1947, "lat": 31.58, "lng": 74.31,
        "geo_modern": "Punjab / Bengal / Delhi", "geo_era_label": "South Asian Independence",
        "category": "political", "importance_score": 0.88, "zoom_min": 2,
        "perspectives": [
            {"label": "Pakistani founding tradition", "culture_code": "pk", "viewpoint_type": "nationalist",
             "narrative": "Muhammad Ali Jinnah and the Muslim League argued that Muslims constituted a separate nation requiring its own state. Partition created Pakistan as a homeland for South Asian Muslims. Despite the violence of partition, Pakistan's foundation represented Muslim self-determination after centuries of Mughal decline and British colonialism.",
             "summary": "Pakistan's creation represented Muslim self-determination; Jinnah saw it as the only guarantee of Muslim political rights.", "evidence_score": 0.82,
             "sources": [{"title": "Jinnah of Pakistan", "author": "Stanley Wolpert", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1984}]},
            {"label": "Indian Congress secular nationalist view", "culture_code": "in", "viewpoint_type": "nationalist",
             "narrative": "Nehru and Gandhi both opposed partition as a betrayal of Hindu-Muslim unity and a product of British 'divide and rule' strategy. Partition's violence — 1-2 million dead, 15 million displaced — vindicated their fears. India's secular constitution was partly a response to partition's communal horror.",
             "summary": "Congress saw partition as betrayal of secular unity; 1-2 million deaths and 15 million displaced validated their fears.", "evidence_score": 0.85,
             "sources": [{"title": "Freedom at Midnight", "author": "Larry Collins & Dominique Lapierre", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 1975}]},
        ],
    },
    {
        "slug": "vietnam-fall-saigon-1975",
        "title": "Fall of Saigon — End of Vietnam War",
        "year": 1975, "lat": 10.82, "lng": 106.63,
        "geo_modern": "Saigon (Ho Chi Minh City), Vietnam", "geo_era_label": "Vietnam War",
        "category": "war", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "Vietnamese communist perspective", "culture_code": "vn", "viewpoint_type": "nationalist",
             "narrative": "Liberation of Saigon on April 30, 1975 completed Vietnam's reunification after 30 years of continuous war against Japan, France, and the United States. Ho Chi Minh's vision of independent, unified Vietnam was achieved at the cost of 1-3 million Vietnamese lives and environmental devastation from Agent Orange.",
             "summary": "Liberation completed Vietnamese national reunification after 30 years of anti-colonial and anti-imperialist warfare.", "evidence_score": 0.88,
             "sources": [{"title": "A Bright Shining Lie", "author": "Neil Sheehan", "publication": "Random House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988}]},
            {"label": "American strategic perspective", "culture_code": "us", "viewpoint_type": "government",
             "narrative": "The fall of Saigon was the US's most humiliating military defeat — helicopters evacuating from the embassy roof as North Vietnamese tanks arrived. It shattered American confidence, triggered the 'Vietnam Syndrome' against military adventurism, and shaped US foreign policy conservatism for decades.",
             "summary": "Fall of Saigon created the 'Vietnam Syndrome' — a generational reluctance to commit military forces overseas that shaped US policy for decades.", "evidence_score": 0.90,
             "sources": [{"title": "The Pentagon Papers", "source_type": "primary", "reliability_tier": 1, "year": 1971}]},
        ],
    },
    {
        "slug": "camp-david-egypt-israel-peace-1978",
        "title": "Camp David Accords — First Arab-Israeli Peace Treaty",
        "year": 1978, "lat": 39.64, "lng": -77.47,
        "geo_modern": "Camp David, Maryland, USA", "geo_era_label": "Cold War Middle East",
        "category": "political", "importance_score": 0.83, "zoom_min": 2,
        "perspectives": [
            {"label": "Egyptian and Israeli peace tradition", "culture_code": "eg", "viewpoint_type": "government",
             "narrative": "Anwar Sadat's dramatic Jerusalem trip in 1977 and Camp David negotiations with Begin and Carter produced the first Arab-Israeli peace treaty (1979). Egypt recovered Sinai; Israel gained a peace border. Sadat and Begin shared the Nobel Peace Prize; Sadat was assassinated by Islamic militants in 1981.",
             "summary": "Camp David produced the first Arab-Israeli peace; Sadat was assassinated by militants who called it a betrayal.", "evidence_score": 0.88,
             "sources": [{"title": "Keeping Faith", "author": "Jimmy Carter", "publication": "Bantam Books", "source_type": "primary", "reliability_tier": 2, "year": 1982}]},
            {"label": "Palestinian and Arab world critique", "culture_code": "ps", "viewpoint_type": "nationalist",
             "narrative": "Arab states expelled Egypt from the Arab League for making a separate peace that abandoned Palestinians. The accords left the Palestinian question unresolved and arguably removed Egypt — the Arab world's most powerful state — from any future pan-Arab pressure on Israel.",
             "summary": "Arab world expelled Egypt for abandoning Palestinians; accords left occupation unresolved and removed Arab world's strongest state from future pressure.", "evidence_score": 0.82,
             "sources": [{"title": "The Arab-Israeli Conflict", "author": "James Gelvin", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}]},
        ],
    },
    {
        "slug": "falklands-war-1982",
        "title": "Falklands War — Britain Retakes the Islands",
        "year": 1982, "lat": -51.7, "lng": -57.85,
        "geo_modern": "Falkland Islands (Islas Malvinas), South Atlantic", "geo_era_label": "Cold War",
        "category": "war", "importance_score": 0.75, "zoom_min": 3,
        "perspectives": [
            {"label": "British perspective", "culture_code": "gb", "viewpoint_type": "nationalist",
             "narrative": "Argentina's invasion of the British Falklands in April 1982 prompted Thatcher to send a naval task force 8,000 miles to retake the islands in 74 days. The war revived British military prestige, saved Thatcher's political career, and affirmed that aggression must not be rewarded.",
             "summary": "Britain retook the Falklands, reviving national confidence and saving Thatcher's political career.", "evidence_score": 0.85,
             "sources": [{"title": "The Falklands War", "author": "Sunday Times Insight Team", "publication": "André Deutsch", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1982}]},
            {"label": "Argentine perspective", "culture_code": "ar", "viewpoint_type": "nationalist",
             "narrative": "For Argentina, the Malvinas are Argentine territory seized by Britain in 1833. The military junta invaded partly to distract from economic crisis and human rights abuses. Defeat discredited the military and precipitated Argentina's return to democracy — the war's unintended domestic consequence.",
             "summary": "Argentina's sovereignty claim is historically legitimate; junta's defeat in the war unexpectedly triggered return to democracy.", "evidence_score": 0.82,
             "sources": [{"title": "Invaders and Defenders", "author": "Martin Middlebrook", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1985}]},
        ],
    },
    {
        "slug": "apartheid-end-south-africa-1994",
        "title": "South Africa's First Democratic Election — End of Apartheid",
        "year": 1994, "lat": -25.74, "lng": 28.19,
        "geo_modern": "Pretoria, South Africa", "geo_era_label": "Post-Apartheid",
        "category": "political", "importance_score": 0.87, "zoom_min": 2,
        "perspectives": [
            {"label": "ANC and Black South African tradition", "culture_code": "za", "viewpoint_type": "nationalist",
             "narrative": "South Africa's first democratic election on April 27, 1994 — 'Freedom Day' — saw Nelson Mandela elected as the first Black president. The peaceful transition through negotiated settlement (Truth and Reconciliation Commission, coalition government) was called a 'miracle' and became a global model for post-conflict reconciliation.",
             "summary": "South Africa's peaceful transition to democracy through negotiation and TRC was a global miracle and model for reconciliation.", "evidence_score": 0.92,
             "sources": [{"title": "Long Walk to Freedom", "author": "Nelson Mandela", "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 1, "year": 1994}]},
            {"label": "Economic justice critique", "culture_code": "za", "viewpoint_type": "civilian",
             "narrative": "Despite political freedom, apartheid's economic inequality remained largely intact. The ANC's GEAR policy (market liberalization) instead of redistribution disappointed many who expected economic transformation. Poverty, unemployment, and land inequality persist 30 years after apartheid's end.",
             "summary": "Political liberation coexisted with economic inequality that persists 30 years later — freedom without economic justice.", "evidence_score": 0.82,
             "sources": [{"title": "After Apartheid: Reinventing South Africa", "author": "Ian Shapiro & Kahreen Tebeau", "publication": "University of Virginia Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}]},
        ],
    },


    # ═══════════════════════════════════════════════════════════════════════
    # BATCH 2 — More Ancient, Medieval, Exploration, Modern
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "phoenician-alphabet-1050bce", "title": "Phoenician Alphabet Spreads Across the Mediterranean", "year": -1050, "lat": 33.89, "lng": 35.5, "geo_modern": "Byblos, Lebanon", "geo_era_label": "Phoenicia", "category": "cultural", "importance_score": 0.88, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "Linguistic history", "culture_code": "lb", "viewpoint_type": "academic", "narrative": "The Phoenician alphabet of 22 consonants, spreading via Mediterranean trade networks from around 1050 BCE, became the ancestor of nearly every alphabet in use today — Greek, Latin, Arabic, Hebrew, and Brahmic scripts all descend from it. It democratized literacy by replacing complex cuneiform and hieroglyphics.", "summary": "The Phoenician alphabet is the ancestor of virtually every alphabet in the world today.", "evidence_score": 0.92, "sources": [{"title": "A History of Writing", "author": "Andrew Robinson", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995}]}, {"label": "Trade and commerce perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The alphabet spread because Phoenician merchants needed a practical, learnable script for commercial records across diverse trading ports from Carthage to Cyprus. Unlike royal scribal systems, it was simple enough for ordinary merchants to learn, making literacy a commercial rather than elite priestly skill.", "summary": "The alphabet spread through commerce, making literacy a practical business tool rather than an elite priestly skill.", "evidence_score": 0.85, "sources": [{"title": "The Alphabet: A Key to the History of Mankind", "author": "David Diringer", "publication": "Philosophical Library", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1948}]}]},
    {"slug": "athenian-democracy-507bce-cleisthenes", "title": "Cleisthenes Establishes Athenian Democracy", "year": -507, "lat": 37.97, "lng": 23.72, "geo_modern": "Athens, Greece", "geo_era_label": "Classical Athens", "category": "political", "importance_score": 0.87, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "Greek democratic tradition", "culture_code": "gr", "viewpoint_type": "political", "narrative": "Cleisthenes reorganized Athenian society into 10 tribes mixing citizens from different regions, created the Council of 500, and established ostracism to prevent tyranny. His reforms in 507 BCE created the world's first democracy — direct participation in governance by (male, free, Athenian) citizens.", "summary": "Cleisthenes created the first democracy with direct citizen participation in governance — a revolutionary political innovation.", "evidence_score": 0.85, "sources": [{"title": "The Constitution of the Athenians", "author": "Aristotle", "source_type": "primary", "reliability_tier": 2, "year": -330}]}, {"label": "Critical democratic theory", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Athenian democracy excluded women, enslaved people (who formed 30% of the population), resident foreigners (metics), and non-Athenians. 'Democratic' participation was limited to perhaps 10-15% of the population. Its exclusions should qualify uncritical celebration of it as a universal model.", "summary": "Athenian democracy excluded 85-90% of the population including women, slaves, and foreigners.", "evidence_score": 0.82, "sources": [{"title": "Democracy and Knowledge", "author": "Josiah Ober", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}]}]},
    {"slug": "peloponnesian-war-end-404bce", "title": "End of the Peloponnesian War — Sparta Defeats Athens", "year": -404, "lat": 37.97, "lng": 23.72, "geo_modern": "Athens, Greece", "geo_era_label": "Classical Greece", "category": "war", "importance_score": 0.82, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "Athenian democratic retrospective", "culture_code": "gr", "viewpoint_type": "academic", "narrative": "Athens's defeat in the Peloponnesian War (431-404 BCE) ended the Athenian Empire and golden age of Periclean democracy. Thucydides' History — the first scientific historical work — analyzed the war's causes in realist power terms: 'The growth of Athenian power and Spartan fear made war inevitable.'", "summary": "Athens's defeat ended the Athenian golden age; Thucydides' analysis established realist international relations theory.", "evidence_score": 0.88, "sources": [{"title": "History of the Peloponnesian War", "author": "Thucydides", "source_type": "primary", "reliability_tier": 1, "year": -400}]}, {"label": "Spartan perspective", "culture_code": "gr-sparta", "viewpoint_type": "nationalist", "narrative": "Sparta's victory preserved Greek balance of power against Athenian imperialism. But the costs were severe: Sparta over-extended itself in empire-building, suffered severe demographic decline from its rigid social system, and was itself defeated by Thebes within 33 years — showing that military supremacy doesn't create lasting power.", "summary": "Spartan victory was pyrrhic — the costs of hegemony led to Sparta's own defeat by Thebes 33 years later.", "evidence_score": 0.82, "sources": [{"title": "A History of Sparta", "author": "W.G. Forrest", "publication": "Duckworth", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1980}]}]},
    {"slug": "roman-empire-fall-410-sack-rome", "title": "Visigoths Sack Rome", "year": 410, "lat": 41.9, "lng": 12.5, "geo_modern": "Rome, Italy", "geo_era_label": "Late Roman Empire", "category": "political", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Roman Christian interpretation", "culture_code": "it", "viewpoint_type": "religious", "narrative": "The Visigoth sack of Rome in 410 CE shocked the entire Mediterranean world — the first time Rome had been taken in 800 years. Augustine of Hippo wrote The City of God in response to pagan claims that Christianity had weakened Rome, arguing that Rome's fall was irrelevant to the eternal City of God.", "summary": "Rome's first sack in 800 years caused a theological crisis; Augustine responded with the City of God.", "evidence_score": 0.88, "sources": [{"title": "The City of God", "author": "Augustine of Hippo", "source_type": "primary", "reliability_tier": 2, "year": 426}]}, {"label": "Late antique historical analysis", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Modern historians debate whether 410 was truly 'the fall' — the Western Empire limped on until 476. The Visigoths, led by Alaric, were themselves romanized Christians seeking settlement within the empire. The sack was more of a political breakdown than a civilizational collapse.", "summary": "The sack was a political breakdown by romanized Christians seeking settlement, not the 'fall' of civilization.", "evidence_score": 0.82, "sources": [{"title": "The Fall of Rome and the End of Civilization", "author": "Bryan Ward-Perkins", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}]}]},
    {"slug": "crusades-first-crusade-jerusalem-1099", "title": "First Crusade Captures Jerusalem", "year": 1099, "lat": 31.78, "lng": 35.23, "geo_modern": "Jerusalem, Israel/Palestine", "geo_era_label": "Crusader States", "category": "war", "importance_score": 0.87, "zoom_min": 2, "perspectives": [{"label": "Latin Christian tradition", "culture_code": "fr", "viewpoint_type": "religious", "narrative": "Pope Urban II launched the First Crusade in 1095, calling for Christians to recapture Jerusalem from Muslim rule. Three years and thousands of miles later, crusaders captured Jerusalem in July 1099, massacring Jewish and Muslim inhabitants. They established the Kingdom of Jerusalem and Crusader States.", "summary": "The First Crusade captured Jerusalem in 1099 through massive massacre, establishing Crusader states that lasted nearly 200 years.", "evidence_score": 0.88, "sources": [{"title": "Gesta Francorum", "source_type": "primary", "reliability_tier": 2, "year": 1100}]}, {"label": "Muslim and Jewish perspective", "culture_code": "ps", "viewpoint_type": "religious", "narrative": "For Jerusalem's Muslims and Jews, the Crusader conquest was a massacre — chroniclers report streets ankle-deep in blood. The Crusades inaugurated centuries of warfare and created deep wounds in Islamic memory. Saladin's recapture of Jerusalem in 1187 allowed return of Muslim worship and relatively moderate treatment.", "summary": "The conquest involved massacre of Jerusalem's Muslim and Jewish inhabitants; the Crusades created lasting wounds in Islamic memory.", "evidence_score": 0.85, "sources": [{"title": "The Crusades: A History", "author": "Jonathan Riley-Smith", "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}]}]},
    {"slug": "saladin-retakes-jerusalem-1187", "title": "Saladin Recaptures Jerusalem from Crusaders", "year": 1187, "lat": 31.78, "lng": 35.23, "geo_modern": "Jerusalem, Israel/Palestine", "geo_era_label": "Crusader States", "category": "war", "importance_score": 0.82, "zoom_min": 2, "perspectives": [{"label": "Islamic tradition", "culture_code": "sa", "viewpoint_type": "religious", "narrative": "Saladin al-Din defeated the Crusaders at the Battle of Hattin (July 1187) and recaptured Jerusalem in October — 88 years after its fall to the Crusaders. Unlike the 1099 massacre, Saladin allowed Christians to leave peacefully and restored Islamic worship, earning him legendary status in both Muslim and Christian worlds.", "summary": "Saladin's chivalrous recapture of Jerusalem — no massacre — earned him legendary status across religious lines.", "evidence_score": 0.88, "sources": [{"title": "The Life of Saladin", "author": "Baha ad-Din Ibn Shaddad", "source_type": "primary", "reliability_tier": 2, "year": 1200}]}, {"label": "Crusader perspective", "culture_code": "fr", "viewpoint_type": "religious", "narrative": "Jerusalem's loss shocked Christendom and triggered the Third Crusade (1189-1192) led by Richard I of England, Frederick Barbarossa, and Philip II of France. Despite impressive campaigns, the Third Crusade failed to retake Jerusalem, though Richard negotiated Christian access to holy sites.", "summary": "Jerusalem's loss triggered the Third Crusade; Richard I negotiated Christian pilgrimage rights but couldn't retake the city.", "evidence_score": 0.85, "sources": [{"title": "The Crusades: Islamic Perspectives", "author": "Carole Hillenbrand", "publication": "Edinburgh University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}]}]},
    {"slug": "plague-justinian-541", "title": "Plague of Justinian — First Bubonic Plague Pandemic", "year": 541, "lat": 30.06, "lng": 31.25, "geo_modern": "Alexandria, Egypt", "geo_era_label": "Byzantine Empire", "category": "natural", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Byzantine historical account", "culture_code": "tr", "viewpoint_type": "academic", "narrative": "The Plague of Justinian (541-549 CE) killed 25-50 million people — potentially half the Eastern Roman Empire's population. Procopius documented its symptoms in medical detail. It undermined Justinian's reconquest ambitions and contributed to weakening the Byzantine and Persian empires before the Arab conquests.", "summary": "The first bubonic pandemic killed tens of millions, undermining Byzantine reconquest ambitions and preparing conditions for Arab conquests.", "evidence_score": 0.82, "sources": [{"title": "History of the Wars", "author": "Procopius", "source_type": "primary", "reliability_tier": 2, "year": 554}]}, {"label": "Epidemiological retrospective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Modern DNA analysis confirms Yersinia pestis from Central Asia as the Justinianic plague's pathogen — the same bacterium as the Black Death 800 years later. This first pandemic established the bacterium in European rodent populations, setting the stage for the 14th-century catastrophe.", "summary": "DNA analysis confirms this was the first bubonic plague pandemic — same pathogen as the Black Death, setting up future outbreaks.", "evidence_score": 0.87, "sources": [{"title": "Yersinia pestis and the Plague of Justinian", "author": "Harbeck et al.", "publication": "Lancet Infectious Diseases", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}]}]},
    {"slug": "charlemagne-crowned-emperor-800", "title": "Charlemagne Crowned Holy Roman Emperor", "year": 800, "lat": 41.9, "lng": 12.45, "geo_modern": "Rome, Italy", "geo_era_label": "Carolingian Empire", "category": "political", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Papal Catholic tradition", "culture_code": "it", "viewpoint_type": "religious", "narrative": "Pope Leo III crowned Charlemagne as 'Emperor of the Romans' on Christmas Day 800, creating the template for medieval Christian monarchy. The coronation unified much of Western Europe for the first time since Rome and established the precedent of papal authority to crown emperors — a tension that would define medieval politics.", "summary": "Charlemagne's coronation unified Western Europe and established papal authority to crown emperors — defining medieval politics.", "evidence_score": 0.88, "sources": [{"title": "Einhard's Life of Charlemagne", "author": "Einhard", "source_type": "primary", "reliability_tier": 2, "year": 830}]}, {"label": "Byzantine perspective", "culture_code": "gr", "viewpoint_type": "foreign", "narrative": "Constantinople viewed Charlemagne's coronation as illegitimate usurpation of the Roman title — there was already a Roman Emperor (in Constantinople). The coronation deepened the East-West divide in Christianity and reflected the papacy's need for a military protector against Lombard and Byzantine threats.", "summary": "Byzantium rejected Charlemagne's Roman title as illegitimate usurpation; it deepened the East-West Christian divide.", "evidence_score": 0.82, "sources": [{"title": "Two Empires: A History", "author": "Robert Folz", "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1969}]}]},
    {"slug": "song-dynasty-china-innovations-960", "title": "Song Dynasty China — Printing, Gunpowder, Compass", "year": 960, "lat": 30.57, "lng": 114.3, "geo_modern": "Kaifeng, China", "geo_era_label": "Song Dynasty China", "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Chinese technological history", "culture_code": "cn", "viewpoint_type": "academic", "narrative": "The Song Dynasty (960-1279) pioneered movable type printing (Bi Sheng, 1040), refined gunpowder weapons, developed the magnetic compass for navigation, and created the world's first paper money economy. These four innovations — all Chinese — would transform world history when transmitted to Europe via the Islamic world.", "summary": "Song China invented printing, gunpowder weapons, the compass, and paper money — four technologies that transformed world history.", "evidence_score": 0.90, "sources": [{"title": "Science and Civilisation in China", "author": "Joseph Needham", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1954}]}, {"label": "Cultural synthesis perspective", "culture_code": "cn", "viewpoint_type": "academic", "narrative": "The Song period also saw Neo-Confucianism (Zhu Xi), landscape painting, and urban commercial culture flourish. China's population reached 100 million — the world's largest economy. Yet Song military weakness allowed the Mongols to conquer it by 1279, demonstrating that technological and cultural superiority doesn't guarantee survival.", "summary": "Song was the world's most advanced civilization in technology and economy but its military weakness invited Mongol conquest.", "evidence_score": 0.85, "sources": [{"title": "The Song Dynasty in Chinese History", "author": "Robert Hymes & Conrad Schirokauer", "publication": "UC Berkeley Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}]}]},
    {"slug": "magna-carta-1215-detail", "title": "Magna Carta — Barons Limit Royal Power", "year": 1215, "lat": 51.44, "lng": -0.56, "geo_modern": "Runnymede, England", "geo_era_label": "Medieval England", "category": "political", "importance_score": 0.87, "zoom_min": 2, "perspectives": [{"label": "English constitutional tradition", "culture_code": "gb", "viewpoint_type": "political", "narrative": "Magna Carta (1215) forced King John to acknowledge that even the king was subject to law. Its principles — habeas corpus, no taxation without representation, due process — became cornerstones of English common law and, via the 1689 Bill of Rights, the foundation of constitutional government globally including the US Constitution.", "summary": "Magna Carta established the principle that the king is subject to law — the foundation of constitutional government worldwide.", "evidence_score": 0.88, "sources": [{"title": "Magna Carta (original document)", "source_type": "primary", "reliability_tier": 1, "year": 1215}]}, {"label": "Social history perspective", "culture_code": "gb", "viewpoint_type": "academic", "narrative": "Magna Carta's original 63 clauses primarily protected the rights of barons and the church, not ordinary people. Its mythologized status as a charter of popular liberties was largely created by 17th-century common lawyers and parliamentary reformers who interpreted it for their own purposes.", "summary": "Magna Carta was primarily a barons' charter; its popular liberties meaning was a later 17th-century interpretation.", "evidence_score": 0.80, "sources": [{"title": "Magna Carta: The Making and Legacy of the Great Charter", "author": "Dan Jones", "publication": "Head of Zeus", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}]}]},
    {"slug": "columbus-second-voyage-caribbean-settlement-1494", "title": "Columbus and the Beginning of the Columbian Exchange", "year": 1494, "lat": 18.74, "lng": -70.17, "geo_modern": "Hispaniola (Dominican Republic/Haiti)", "geo_era_label": "Spanish Americas", "category": "cultural", "importance_score": 0.88, "zoom_min": 2, "perspectives": [{"label": "Spanish imperial tradition", "culture_code": "es", "viewpoint_type": "nationalist", "narrative": "Columbus's establishment of the first permanent European settlement in the Americas on his second voyage began the Columbian Exchange: the transfer of crops (maize, potato, tomato, cacao), animals, diseases, and people between Old and New Worlds. The potato and maize would eventually sustain Europe's population growth.", "summary": "The Columbian Exchange — crops, diseases, and people between Old and New Worlds — transformed global ecology and demographics.", "evidence_score": 0.90, "sources": [{"title": "The Columbian Exchange", "author": "Alfred Crosby", "publication": "Greenwood Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1972}]}, {"label": "Taino indigenous perspective", "culture_code": "do", "viewpoint_type": "indigenous", "narrative": "For the Taino people of Hispaniola, Columbus's arrival began a demographic catastrophe. Disease killed 90% of the island's population within decades; the survivors were enslaved in gold mines. The Taino were effectively extinct within 50 years. Columbus himself enslaved and mutilated indigenous people.", "summary": "For the Taino, Columbus's arrival began extinction — 90% were dead within decades from disease, slavery, and violence.", "evidence_score": 0.88, "sources": [{"title": "Columbian Consequences", "author": "David Thomas", "publication": "Smithsonian", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]}]},
    {"slug": "protestant-reformation-council-trent-1545", "title": "Council of Trent — Catholic Counter-Reformation", "year": 1545, "lat": 46.07, "lng": 11.12, "geo_modern": "Trento, Italy", "geo_era_label": "European Reformation", "category": "cultural", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Catholic institutional tradition", "culture_code": "it", "viewpoint_type": "religious", "narrative": "The Council of Trent (1545-1563) defined Catholic doctrine in response to Protestantism, reformed clerical abuses, established seminaries for priest education, confirmed transubstantiation and the seven sacraments, and launched the Counter-Reformation. It shaped Catholicism until the Second Vatican Council in the 1960s.", "summary": "The Council of Trent defined modern Catholicism and launched the Counter-Reformation that shaped the Church for 400 years.", "evidence_score": 0.88, "sources": [{"title": "Canons and Decrees of the Council of Trent", "source_type": "primary", "reliability_tier": 1, "year": 1563}]}, {"label": "Protestant perspective", "culture_code": "de", "viewpoint_type": "religious", "narrative": "Protestants saw Trent as confirming that Rome had rejected reform and entrenched the unscriptural doctrines Luther had challenged. The Council's clarifications made compromise between Protestant and Catholic impossible, cementing the permanent division of Western Christianity.", "summary": "From Protestant view, Trent confirmed Rome's rejection of reform, cementing permanent division of Western Christianity.", "evidence_score": 0.82, "sources": [{"title": "The Council of Trent", "author": "John O'Malley", "publication": "Belknap Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}]}]},
    {"slug": "english-bill-of-rights-1689", "title": "English Bill of Rights — Parliamentary Sovereignty", "year": 1689, "lat": 51.5, "lng": -0.12, "geo_modern": "London, England", "geo_era_label": "Post-Glorious Revolution England", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Whig constitutional tradition", "culture_code": "gb", "viewpoint_type": "political", "narrative": "The Bill of Rights (1689) established parliamentary sovereignty, free elections, freedom of speech in Parliament, prohibition of cruel and unusual punishment, and the right to petition. It became the model for the US Bill of Rights (1791) and foundational to liberal constitutional theory.", "summary": "The Bill of Rights established parliamentary sovereignty and became the model for constitutional rights globally.", "evidence_score": 0.88, "sources": [{"title": "English Bill of Rights (1689)", "source_type": "primary", "reliability_tier": 1, "year": 1689}]}, {"label": "Colonial and Irish perspective", "culture_code": "ie", "viewpoint_type": "nationalist", "narrative": "Parliamentary sovereignty meant Parliament's supremacy over colonies as well as the Crown — the very Parliament that would pass the Stamp Act and Coercive Acts provoking the American Revolution. And Ireland, under the same Parliament, faced centuries of penal laws despite the rights proclaimed for Englishmen.", "summary": "Parliamentary sovereignty was used to oppress colonies and Ireland — rights for Englishmen didn't extend to those under English rule.", "evidence_score": 0.80, "sources": [{"title": "The Glorious Revolution", "author": "Steve Pincus", "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]}]},
    {"slug": "napoleon-conquers-europe-1806", "title": "Napoleon Reorganizes Europe — The Napoleonic Wars", "year": 1806, "lat": 48.85, "lng": 2.35, "geo_modern": "Paris, France", "geo_era_label": "Napoleonic Empire", "category": "war", "importance_score": 0.88, "zoom_min": 2, "perspectives": [{"label": "French imperial tradition", "culture_code": "fr", "viewpoint_type": "nationalist", "narrative": "Napoleon's victories at Austerlitz (1805), Jena (1806), and Wagram (1809) made France dominant in Europe. The Napoleonic Code imposed rational law reform across Europe; the Continental System challenged British trade supremacy. Napoleon reorganized Germany, abolished the Holy Roman Empire, and spread revolutionary ideals.", "summary": "Napoleon spread revolutionary ideals and rational law reform across Europe while reshaping its political geography.", "evidence_score": 0.88, "sources": [{"title": "Memoirs from Saint Helena", "author": "Napoleon Bonaparte", "source_type": "primary", "reliability_tier": 2, "year": 1821}]}, {"label": "Conquered nations' perspective", "culture_code": "de", "viewpoint_type": "nationalist", "narrative": "Napoleonic occupation of Germany, Spain, and other nations paradoxically created modern nationalism. German nationalism was born in resistance to French domination; Spanish resistance (the guerrilla war) inspired nationalist movements worldwide. Napoleon's imposition of French culture created the very nationalisms that destroyed his empire.", "summary": "Napoleonic occupation created modern nationalism in Germany and Spain — the very force that destroyed his empire.", "evidence_score": 0.85, "sources": [{"title": "Nationalism", "author": "E.J. Hobsbawm", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}]}]},
    {"slug": "congress-vienna-1815", "title": "Congress of Vienna Redraws Europe", "year": 1815, "lat": 48.21, "lng": 16.37, "geo_modern": "Vienna, Austria", "geo_era_label": "Post-Napoleonic Europe", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Conservative European tradition", "culture_code": "at", "viewpoint_type": "government", "narrative": "Metternich's Congress of Vienna (1814-15) restored conservative monarchies, redrew European borders, and created the Concert of Europe — a multilateral framework for managing great power relations that preserved relative peace for nearly 100 years until 1914. It was the first modern international peace settlement.", "summary": "Congress of Vienna created the Concert of Europe — a successful multilateral framework that preserved relative peace for 100 years.", "evidence_score": 0.88, "sources": [{"title": "A World Restored", "author": "Henry Kissinger", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1957}]}, {"label": "Liberal and nationalist critique", "culture_code": "eu", "viewpoint_type": "political", "narrative": "Liberals and nationalists saw Vienna as a reactionary suppression of the revolutionary principles of 1789: it restored ancien régime monarchies, ignored national self-determination, and maintained aristocratic domination. The revolutions of 1830 and 1848 were direct responses to Vienna's conservative settlement.", "summary": "Vienna's conservative settlement ignited the liberal nationalist revolutions of 1830 and 1848 against its reactionary principles.", "evidence_score": 0.82, "sources": [{"title": "The Birth of the Modern World", "author": "C.A. Bayly", "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}]}]},
    {"slug": "unification-germany-1871", "title": "German Unification — Bismarck Creates the German Empire", "year": 1871, "lat": 52.52, "lng": 13.4, "geo_modern": "Versailles, France / Germany", "geo_era_label": "German Empire", "category": "political", "importance_score": 0.87, "zoom_min": 2, "perspectives": [{"label": "German nationalist tradition", "culture_code": "de", "viewpoint_type": "nationalist", "narrative": "Bismarck unified Germany through 'blood and iron' — three quick wars against Denmark, Austria, and France. The German Empire proclaimed in Versailles Hall of Mirrors (1871) created Europe's most powerful state. Bismarck's realpolitik diplomacy then maintained stability for 20 years through complex alliance systems.", "summary": "Bismarck's 'blood and iron' unification created the most powerful European state and fundamentally shifted the balance of power.", "evidence_score": 0.90, "sources": [{"title": "Bismarck: The Man and the Statesman", "author": "A.J.P. Taylor", "publication": "Hamish Hamilton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1955}]}, {"label": "French perspective", "culture_code": "fr", "viewpoint_type": "nationalist", "narrative": "For France, the proclamation of the German Empire in Versailles and the annexation of Alsace-Lorraine were national humiliations that haunted French politics for 43 years until 1914. The 'revanche' (revenge) desire contributed to French eagerness for war in 1914 and to the harsh Versailles terms in 1919.", "summary": "German unification humiliated France and created the 'revanche' obsession that contributed to WWI and harsh Versailles terms.", "evidence_score": 0.85, "sources": [{"title": "The Franco-Prussian War", "author": "Geoffrey Wawro", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}]}]},
    {"slug": "unification-italy-garibaldi-1861", "title": "Italian Unification — Garibaldi and the Risorgimento", "year": 1861, "lat": 41.9, "lng": 12.5, "geo_modern": "Rome / Turin, Italy", "geo_era_label": "Italian Risorgimento", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "Italian nationalist tradition", "culture_code": "it", "viewpoint_type": "nationalist", "narrative": "Garibaldi's 'Expedition of the Thousand' in 1860, combined with Cavour's diplomatic genius and Piedmont's military victories, created the Kingdom of Italy in 1861 — unifying a peninsula divided since ancient Rome. Rome itself was taken in 1870 after French forces withdrew due to the Franco-Prussian War.", "summary": "Garibaldi and Cavour united Italy for the first time since ancient Rome through military daring and diplomatic skill.", "evidence_score": 0.88, "sources": [{"title": "The Making of Italy", "author": "Denis Mack Smith", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1988}]}, {"label": "Southern Italian perspective", "culture_code": "it-south", "viewpoint_type": "civilian", "narrative": "Southern Italians (brigands) resisted northern unification as a conquest by Piedmont in favor of northern elites. The 'Southern Question' — economic underdevelopment relative to the industrializing North — was built into unification and persists today. For many southerners, unification was northern imperialism.", "summary": "For southern Italians, unification was northern conquest; the Southern Question of economic disparity was built into it from the start.", "evidence_score": 0.78, "sources": [{"title": "The Two Italies", "author": "James Moore", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1974}]}]},
    {"slug": "bolshevik-civil-war-1918-1921", "title": "Russian Civil War — Bolsheviks Defeat White Armies", "year": 1919, "lat": 55.75, "lng": 37.62, "geo_modern": "Russia / Ukraine / Siberia", "geo_era_label": "Early Soviet Russia", "category": "war", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Bolshevik revolutionary tradition", "culture_code": "ru", "viewpoint_type": "political", "narrative": "The Red Army's victory in the civil war (1918-1921) over the White Armies (supported by 14 foreign interventions including Britain, France, USA, Japan) confirmed the Soviet government. War Communism — forced grain requisition — caused famine but won the war, allowing NEP recovery afterward.", "summary": "Red Army victory over foreign-backed White Armies confirmed Soviet power despite catastrophic costs of War Communism.", "evidence_score": 0.85, "sources": [{"title": "A People's Tragedy: The Russian Revolution", "author": "Orlando Figes", "publication": "Jonathan Cape", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}]}, {"label": "White Russian and international perspective", "culture_code": "ru-white", "viewpoint_type": "political", "narrative": "White generals like Denikin and Kolchak fought for parliamentary democracy (or constitutional monarchy) against Bolshevik dictatorship. Their failure resulted from divided command, inability to attract popular support, identification with landed interests, and brutal anti-Jewish pogroms that alienated potential allies.", "summary": "White Army defeat resulted from political divisions, brutality toward civilians, and failure to offer compelling alternative to Bolshevism.", "evidence_score": 0.80, "sources": [{"title": "The White Russian Movement", "author": "Evan Mawdsley", "publication": "Longman", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}]}]},
    {"slug": "great-war-western-front-trenches-1915", "title": "The Great War Trench System — Industrial Slaughter", "year": 1915, "lat": 50.82, "lng": 3.0, "geo_modern": "Western Front, Belgium/France", "geo_era_label": "World War I", "category": "war", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Allied soldier perspective", "culture_code": "gb", "viewpoint_type": "civilian", "narrative": "The Western Front trench system (1914-1918) stretched 700 km from the English Channel to Switzerland. Soldiers lived in squalor, mud, and constant artillery bombardment. The front barely moved for years while millions died. Siegfried Sassoon, Wilfred Owen, and Henri Barbusse captured the horror in poetry and prose.", "summary": "The Western Front was 700 km of industrial slaughter that barely moved while millions died in mud and artillery fire.", "evidence_score": 0.90, "sources": [{"title": "All Quiet on the Western Front", "author": "Erich Maria Remarque", "publication": "Ullstein Verlag", "source_type": "primary", "reliability_tier": 3, "year": 1929}]}, {"label": "Military strategy analysis", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The trench stalemate resulted from technological imbalance: defensive firepower (machine guns, artillery, barbed wire) overwhelmed offensive capability until 1918's combined arms innovations (tanks, air power, infiltration tactics). Haig and other commanders were not uniquely stupid — they faced a genuinely novel tactical problem.", "summary": "Trench stalemate resulted from defensive technology overwhelming offensive; generals struggled with a genuinely novel tactical challenge.", "evidence_score": 0.82, "sources": [{"title": "The First World War", "author": "John Keegan", "publication": "Hutchinson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}]}]},
    {"slug": "decolonization-vietnam-dien-bien-phu-1954", "title": "Dien Bien Phu — France Defeated in Vietnam", "year": 1954, "lat": 21.38, "lng": 103.02, "geo_modern": "Dien Bien Phu, Vietnam", "geo_era_label": "French Indochina", "category": "war", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Vietnamese communist tradition", "culture_code": "vn", "viewpoint_type": "nationalist", "narrative": "General Giap's victory at Dien Bien Phu (May 7, 1954) destroyed the French Expeditionary Corps and ended French colonialism in Indochina. It was the first time in the modern era that a colonial independence movement had defeated a European power's professional army in open battle — inspiring anti-colonial movements globally.", "summary": "Dien Bien Phu was the first defeat of a European army by a colonial independence movement, inspiring anti-colonial movements worldwide.", "evidence_score": 0.88, "sources": [{"title": "People's War, People's Army", "author": "Vo Nguyen Giap", "publication": "Foreign Languages Publishing House", "source_type": "primary", "reliability_tier": 2, "year": 1961}]}, {"label": "French imperial retrospective", "culture_code": "fr", "viewpoint_type": "government", "narrative": "Dien Bien Phu ended French Indochina but France immediately transferred military commitment to Algeria (1954-1962). The lesson — that colonial wars were unwinnable — was not learned. The US, observing France's defeat, then made the same mistake by escalating in Vietnam after 1964.", "summary": "France's defeat lesson wasn't learned: it immediately fought Algeria, and the US then repeated France's Vietnam mistake.", "evidence_score": 0.85, "sources": [{"title": "Hell in a Very Small Place", "author": "Bernard Fall", "publication": "Lippincott", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1967}]}]},
    {"slug": "korean-war-armistice-1953", "title": "Korean War Armistice — The Forgotten War", "year": 1953, "lat": 37.95, "lng": 126.89, "geo_modern": "Korean Peninsula", "geo_era_label": "Cold War Korea", "category": "war", "importance_score": 0.82, "zoom_min": 2, "perspectives": [{"label": "US Cold War perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The Korean War (1950-1953) was the first hot war of the Cold War, ending in armistice at roughly the pre-war border. The US-led UN force fought off North Korean and Chinese invasion; 36,000 Americans died. Truman's dismissal of MacArthur for advocating nuclear escalation established civilian control of military in wartime.", "summary": "Korea was the first Cold War hot war; its ambiguous outcome established containment doctrine and civilian military control.", "evidence_score": 0.85, "sources": [{"title": "The Korean War", "author": "David Halberstam", "publication": "Hyperion", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}]}, {"label": "Korean perspective", "culture_code": "kr", "viewpoint_type": "civilian", "narrative": "For Koreans, the war killed 2-3 million people, devastated the peninsula, and created the still-unresolved division between North and South. The armistice (not peace treaty) left Korea technically still at war. The war's Korean casualties — vastly exceeding American — make 'Forgotten War' a particularly charged phrase.", "summary": "Korea killed 2-3 million Koreans and created an unresolved division that technically continues as armed truce.", "evidence_score": 0.88, "sources": [{"title": "The Korean War: History and Reconciliation", "author": "Kim Dong-chun", "publication": "Korea Democracy Foundation", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}]}]},
    {"slug": "space-race-apollo-11-1969-moonlanding", "title": "Apollo 11 — First Humans on the Moon", "year": 1969, "lat": 28.52, "lng": -80.65, "geo_modern": "Kennedy Space Center / Moon", "geo_era_label": "Space Race", "category": "discovery", "importance_score": 0.93, "zoom_min": 1, "perspectives": [{"label": "American technological achievement", "culture_code": "us", "viewpoint_type": "government", "narrative": "Neil Armstrong's first steps on the Moon on July 20, 1969 fulfilled Kennedy's 1961 challenge and won the Space Race. Apollo 11 was the culmination of 400,000 workers and $25.4 billion — arguably the greatest technological achievement in human history, watching by 600 million people on television.", "summary": "Apollo 11 fulfilled Kennedy's challenge, won the Space Race, and was arguably history's greatest technological achievement.", "evidence_score": 0.98, "sources": [{"title": "Apollo 11 Mission Report", "source_type": "primary", "reliability_tier": 1, "year": 1969}]}, {"label": "Global humanitarian perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Critics including civil rights leaders argued the $25.4 billion spent on the Moon program should address poverty, housing, and racial injustice. Gil Scott-Heron's 'Whitey on the Moon' (1970) captured Black America's alienation from a technological triumph in a country where Black people lacked basic rights.", "summary": "Civil rights critics questioned spending $25 billion on the Moon while Black Americans lacked basic rights — 'Whitey on the Moon.'", "evidence_score": 0.85, "sources": [{"title": "Whitey on the Moon", "author": "Gil Scott-Heron", "source_type": "primary", "reliability_tier": 3, "year": 1970}]}]},
    {"slug": "reagan-gorbachev-cold-war-end-1985", "title": "Reagan-Gorbachev — The Cold War Ends", "year": 1985, "lat": 55.75, "lng": 37.62, "geo_modern": "Moscow, Russia / Washington D.C.", "geo_era_label": "Late Cold War", "category": "political", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Reagan conservative tradition", "culture_code": "us", "viewpoint_type": "government", "narrative": "Reagan's military buildup, SDI (Star Wars), and confrontational rhetoric ('Evil Empire') broke Soviet willpower to compete. His 1986 Reykjavik summit with Gorbachev came close to eliminating all nuclear weapons. Reagan conservatives credit his pressure with forcing Soviet reform and ultimately causing Soviet collapse.", "summary": "Reagan's military buildup and confrontational strategy broke Soviet capacity to compete and forced Gorbachev's reform program.", "evidence_score": 0.78, "sources": [{"title": "An American Life", "author": "Ronald Reagan", "publication": "Simon & Schuster", "source_type": "primary", "reliability_tier": 2, "year": 1990}]}, {"label": "Gorbachev and reform perspective", "culture_code": "ru", "viewpoint_type": "government", "narrative": "Gorbachev's glasnost (openness) and perestroika (restructuring) reforms aimed to revitalize Soviet socialism, not end the Cold War or USSR. The Cold War ended because Gorbachev chose not to use force to maintain Soviet bloc domination — a deliberate moral and political choice, not just response to US pressure.", "summary": "The Cold War ended because Gorbachev made a moral choice not to use force — not simply because of US pressure.", "evidence_score": 0.82, "sources": [{"title": "Memoirs", "author": "Mikhail Gorbachev", "publication": "Doubleday", "source_type": "primary", "reliability_tier": 2, "year": 1996}]}]},
    {"slug": "algerian-independence-1962", "title": "Algerian Independence After Eight Years of War", "year": 1962, "lat": 36.74, "lng": 3.06, "geo_modern": "Algiers, Algeria", "geo_era_label": "French Decolonization", "category": "war", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Algerian FLN tradition", "culture_code": "dz", "viewpoint_type": "nationalist", "narrative": "The Algerian War (1954-1962) killed 300,000-1,500,000 Algerians against French forces using torture, napalm, and collective punishment. The FLN's victory in the Évian Accords (1962) was a defining moment of anti-colonial struggle — France had declared Algeria 'not a colony but part of France.'", "summary": "Algeria's victory over France after 8 years of war killed up to 1.5 million and became the definitive anti-colonial struggle.", "evidence_score": 0.85, "sources": [{"title": "The Wretched of the Earth", "author": "Frantz Fanon", "publication": "Présence Africaine", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1961}]}, {"label": "French political and pied-noir perspective", "culture_code": "fr", "viewpoint_type": "government", "narrative": "For France's 1 million European settlers (pieds-noirs) and harkis (pro-French Algerians), Évian was betrayal. 900,000 pieds-noirs fled Algeria; 100,000+ harkis were killed by the FLN afterward. De Gaulle's acceptance of Algerian independence caused the 1961 coup attempt and OAS terrorism in France.", "summary": "Algerian independence caused the pied-noir exodus, harki massacres, and nearly overthrew de Gaulle in a military coup.", "evidence_score": 0.82, "sources": [{"title": "A Savage War of Peace", "author": "Alistair Horne", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1977}]}]},
    {"slug": "portuguese-carnation-revolution-1974", "title": "Carnation Revolution — Portugal Ends Fascism and Colonialism", "year": 1974, "lat": 38.72, "lng": -9.14, "geo_modern": "Lisbon, Portugal", "geo_era_label": "Late Cold War", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "Portuguese democratic military tradition", "culture_code": "pt", "viewpoint_type": "nationalist", "narrative": "The MFA (Armed Forces Movement) overthrew the 48-year Salazar/Caetano dictatorship on April 25, 1974. Soldiers placed carnations in rifle barrels; the population celebrated. The revolution ended Portugal's African colonial wars and restored democracy — and triggered decolonization of Angola, Mozambique, and Cape Verde.", "summary": "The peaceful revolution ended Europe's last fascist dictatorship and triggered decolonization of Portugal's African empire.", "evidence_score": 0.88, "sources": [{"title": "The Revolution of Carnations", "author": "Phil Mailer", "publication": "Solidarity", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 1977}]}, {"label": "African colonial liberation perspective", "culture_code": "ao", "viewpoint_type": "nationalist", "narrative": "Portugal's revolution ended colonial wars but immediately plunged Angola, Mozambique, and Guinea-Bissau into Cold War proxy conflicts. Angola's civil war — funded by Cuba, the US, and South Africa — lasted until 2002, killing 500,000+ and displacing millions.", "summary": "Portugal's revolution ended colonial wars but left former colonies in Cold War proxy conflicts that killed hundreds of thousands.", "evidence_score": 0.82, "sources": [{"title": "The Fate of Africa", "author": "Martin Meredith", "publication": "Public Affairs", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}]}]},
    {"slug": "oil-crisis-opec-1973", "title": "OPEC Oil Embargo — Energy Crisis Reshapes the World", "year": 1973, "lat": 24.68, "lng": 46.72, "geo_modern": "Riyadh, Saudi Arabia", "geo_era_label": "Cold War Middle East", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Arab oil states perspective", "culture_code": "sa", "viewpoint_type": "government", "narrative": "OPEC's oil embargo (October 1973) responded to US support for Israel in the Yom Kippur War, quadrupling oil prices. It demonstrated that Arab states could wield petro-power against the West, transferred unprecedented wealth to oil producers, and launched the era of oil-funded Islamist movements.", "summary": "OPEC's oil weapon quadrupled prices, transferred enormous wealth to Arab states, and funded the Islamist political movements that followed.", "evidence_score": 0.88, "sources": [{"title": "The Oil Weapon", "author": "Daniel Yergin", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1991}]}, {"label": "Western economic perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The oil shock triggered the 1973-74 recession, destroyed the Bretton Woods system, created stagflation (oil-driven inflation + recession), and fundamentally changed Western energy policy — driving conservation, alternative energy research, and North Sea development. The end of cheap energy ended the post-war economic boom.", "summary": "The oil shock ended the post-war economic boom by creating stagflation and forcing a complete rethink of Western energy policy.", "evidence_score": 0.85, "sources": [{"title": "The Prize: The Epic Quest for Oil, Money & Power", "author": "Daniel Yergin", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}]}]},
    {"slug": "womens-suffrage-19th-amendment-1920", "title": "19th Amendment — Women's Suffrage in the United States", "year": 1920, "lat": 38.9, "lng": -77.0, "geo_modern": "Washington D.C., USA", "geo_era_label": "Progressive Era America", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Suffragist feminist tradition", "culture_code": "us", "viewpoint_type": "civilian", "narrative": "The 19th Amendment (1920), ratified after 72 years of activism beginning with Seneca Falls (1848), gave American women the right to vote. Suffragists including Susan B. Anthony, Elizabeth Cady Stanton, and Alice Paul used marches, civil disobedience, and constitutional advocacy to win the vote.", "summary": "The 19th Amendment fulfilled 72 years of feminist activism and gave half of Americans the right to vote.", "evidence_score": 0.88, "sources": [{"title": "The Woman's Hour", "author": "Elaine Weiss", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2018}]}, {"label": "Intersectional critique", "culture_code": "us", "viewpoint_type": "civilian", "narrative": "The 19th Amendment largely benefited white women: Black women in the South faced voting suppression through poll taxes, literacy tests, and violence for another 45 years until the Voting Rights Act. White suffragists had often explicitly excluded Black women and used racist arguments to appeal to Southern states.", "summary": "The 19th Amendment gave white women the vote; Black women faced suppression for 45 more years, and many suffragists were explicitly racist.", "evidence_score": 0.85, "sources": [{"title": "Votes for Women, Votes for Blacks", "author": "Rosalyn Terborg-Penn", "publication": "Indiana University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998}]}]},
    {"slug": "spanish-flu-pandemic-1918-detail", "title": "Spanish Flu — The Deadliest Pandemic in Modern History", "year": 1918, "lat": 40.42, "lng": -3.7, "geo_modern": "Global — Spain / USA / Europe / India", "geo_era_label": "World War I Era", "category": "natural", "importance_score": 0.88, "zoom_min": 1, "perspectives": [{"label": "Public health history", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The 1918-19 influenza pandemic killed 50-100 million people (3-5% of the world's population) — more than WWI itself. It spread globally via wartime troop movements; wartime censorship suppressed early reporting (Spain, being neutral, reported freely, giving it the 'Spanish' name). The second wave was most deadly, killing young adults through cytokine storm.", "summary": "The 1918 pandemic killed 50-100 million — more than WWI — with wartime censorship hiding its early spread.", "evidence_score": 0.90, "sources": [{"title": "The Great Influenza", "author": "John Barry", "publication": "Viking", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}]}, {"label": "Colonial world perspective", "culture_code": "in", "viewpoint_type": "civilian", "narrative": "India lost 12-17 million people to the Spanish flu — the largest national toll. The pandemic struck a colonized population already weakened by wartime grain exports. In British India, colonial governance suppressed local information and prioritized the war effort over public health, maximizing casualties.", "summary": "India lost 12-17 million — the most of any country — worsened by colonial governance that prioritized the war over public health.", "evidence_score": 0.82, "sources": [{"title": "Pale Rider: The Spanish Flu of 1918", "author": "Laura Spinney", "publication": "Jonathan Cape", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2017}]}]},
    {"slug": "civil-rights-movement-montgomery-1955", "title": "Montgomery Bus Boycott — Civil Rights Movement Ignites", "year": 1955, "lat": 32.37, "lng": -86.3, "geo_modern": "Montgomery, Alabama, USA", "geo_era_label": "US Civil Rights Era", "category": "political", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "African American civil rights tradition", "culture_code": "us", "viewpoint_type": "civilian", "narrative": "Rosa Parks' arrest and the subsequent 381-day boycott of Montgomery's buses, organized by the young Martin Luther King Jr., launched the modern civil rights movement. The boycott's success through economic pressure and nonviolent discipline proved that mass direct action could defeat legally enforced segregation.", "summary": "The Montgomery boycott launched the modern civil rights movement and proved nonviolent mass action could defeat segregation.", "evidence_score": 0.90, "sources": [{"title": "Stride Toward Freedom", "author": "Martin Luther King Jr.", "publication": "Harper & Row", "source_type": "primary", "reliability_tier": 1, "year": 1958}]}, {"label": "White Southern resistance perspective", "culture_code": "us-south", "viewpoint_type": "government", "narrative": "White Southern officials and Citizens' Councils used economic intimidation, legal harassment, and violence against boycott participants. They framed racial segregation as regional tradition and states' rights — not racism — revealing how deeply white supremacy was embedded in Southern institutional life.", "summary": "White Southern resistance used legal harassment and violence, revealing racial segregation's deep institutional roots.", "evidence_score": 0.82, "sources": [{"title": "Eyes on the Prize (documentary)", "source_type": "secondary", "reliability_tier": 2, "year": 1987}]}]},
    {"slug": "decolonization-congo-independence-lumumba-1960", "title": "Congo Independence and Lumumba's Assassination", "year": 1960, "lat": -4.32, "lng": 15.32, "geo_modern": "Leopoldville (Kinshasa), Democratic Republic of Congo", "geo_era_label": "African Decolonization", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Pan-African tradition", "culture_code": "cd", "viewpoint_type": "nationalist", "narrative": "Patrice Lumumba's Congo independence speech (June 30, 1960) directly confronted Belgian colonialism: 'We have known ironies, insults, blows that we endured morning, noon, and evening.' Within months, the CIA and Belgium conspired in his assassination. His murder symbolized how Cold War powers crushed African socialist nationalism.", "summary": "Lumumba's murder within months of independence symbolized Cold War destruction of African socialist self-determination.", "evidence_score": 0.85, "sources": [{"title": "The Assassination of Lumumba", "author": "Ludo De Witte", "publication": "Verso", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}]}, {"label": "US Cold War perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The CIA and Eisenhower administration saw Lumumba as a potential Soviet ally who might bring the Congo — the world's largest uranium source — into the Soviet sphere. His assassination served US Cold War interests, but installed Mobutu, whose 32-year kleptocracy devastated the Congo.", "summary": "CIA killed Lumumba to prevent Soviet influence but installed Mobutu's 32-year kleptocracy that devastated the Congo.", "evidence_score": 0.82, "sources": [{"title": "The Congo Cables", "author": "Madeleine Kalb", "publication": "Macmillan", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1982}]}]},
    {"slug": "pope-urban-ii-first-crusade-1095", "title": "Pope Urban II Calls the First Crusade", "year": 1095, "lat": 45.9, "lng": 3.15, "geo_modern": "Clermont-Ferrand, France", "geo_era_label": "Medieval Christendom", "category": "war", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Crusader Catholic tradition", "culture_code": "fr", "viewpoint_type": "religious", "narrative": "Urban II's Clermont speech in November 1095, calling for Christian knights to take up the cross and liberate Jerusalem from Seljuk Turkish rule, triggered an extraordinary popular response: 60,000-100,000 people made the journey. The crowd's 'Deus lo volt!' (God wills it) became the crusading motto.", "summary": "Urban's Clermont speech triggered the First Crusade with an unprecedented popular military response across Europe.", "evidence_score": 0.85, "sources": [{"title": "Urban II's speech at Clermont (multiple accounts)", "source_type": "primary", "reliability_tier": 2, "year": 1095}]}, {"label": "Muslim historical perspective", "culture_code": "sa", "viewpoint_type": "religious", "narrative": "Contemporary Arab chronicles like Ibn al-Athir show that Muslim rulers were initially little alarmed by the Frankish invasion — just another barbarian incursion. Only after the fall of Jerusalem and Crusader consolidation did the Islamic world mobilize a response. The Crusades' long-term legacy in Islamic consciousness was built up over centuries.", "summary": "Contemporary Muslims were initially unalarmed; the deep Islamic consciousness of the Crusades was built up over centuries.", "evidence_score": 0.78, "sources": [{"title": "The Crusades Through Arab Eyes", "author": "Amin Maalouf", "publication": "Al Saqi", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1984}]}]},
    {"slug": "scientific-revolution-newton-laws-1687", "title": "Newton's Principia — Laws of Universal Gravitation", "year": 1687, "lat": 52.2, "lng": 0.12, "geo_modern": "Cambridge, England", "geo_era_label": "Scientific Revolution", "category": "discovery", "importance_score": 0.90, "zoom_min": 2, "perspectives": [{"label": "History of science", "culture_code": "gb", "viewpoint_type": "academic", "narrative": "Newton's Principia Mathematica (1687) unified celestial and terrestrial mechanics under three laws of motion and the law of universal gravitation, explaining everything from planetary orbits to falling apples with mathematics. It established the deterministic, mechanistic universe that dominated scientific thinking until Einstein's relativity.", "summary": "Newton's Principia unified physics under mathematical laws, establishing scientific method as the dominant mode of inquiry.", "evidence_score": 0.95, "sources": [{"title": "Philosophiae Naturalis Principia Mathematica", "author": "Isaac Newton", "publication": "Royal Society", "source_type": "primary", "reliability_tier": 1, "year": 1687}]}, {"label": "Non-European intellectual traditions", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Newton built on Galileo, Kepler, Descartes, and crucially on Islamic astronomers transmitted through the Arabic tradition. The 'Scientific Revolution' framing ignores how heavily Newton's predecessors drew on Islamic, Indian, and Chinese mathematics and astronomy. The European breakthrough was a synthesis of global intellectual traditions.", "summary": "Newton's synthesis built on Islamic, Indian, and Chinese foundations — the 'Scientific Revolution' was a global intellectual inheritance.", "evidence_score": 0.80, "sources": [{"title": "The House of Wisdom", "author": "Jim Al-Khalili", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}]}]},
    {"slug": "cuban-missile-crisis-resolution-1962-detail", "title": "Cuban Missile Crisis — 13 Days to Nuclear War", "year": 1962, "lat": 38.9, "lng": -77.0, "geo_modern": "Washington D.C. / Moscow / Havana", "geo_era_label": "Cold War", "category": "political", "importance_score": 0.93, "zoom_min": 1, "perspectives": [{"label": "US Kennedy administration", "culture_code": "us", "viewpoint_type": "government", "narrative": "For 13 days in October 1962, the world came closest to nuclear war. Kennedy's blockade of Cuba and secret Khrushchev deal (US removes Turkey missiles; Soviets remove Cuba missiles) resolved the crisis. ExComm recordings reveal how close participants felt to nuclear holocaust — a fact that sobered both superpowers.", "summary": "13 days in October 1962 brought the world to the brink of nuclear war; secret diplomacy resolved it through mutual compromise.", "evidence_score": 0.92, "sources": [{"title": "Thirteen Days", "author": "Robert F. Kennedy", "publication": "W.W. Norton", "source_type": "primary", "reliability_tier": 2, "year": 1969}]}, {"label": "Cuban sovereignty perspective", "culture_code": "cu", "viewpoint_type": "nationalist", "narrative": "Fidel Castro was furious that Khrushchev made a deal removing the missiles without consulting Cuba — treating Cuba as a Soviet pawn. Castro reportedly urged Khrushchev to launch nuclear weapons; Khrushchev ignored him. The crisis revealed how great powers use smaller nations as pawns in their rivalries.", "summary": "Khrushchev made the deal without consulting Cuba, infuriating Castro and showing how great powers use smaller states as pawns.", "evidence_score": 0.85, "sources": [{"title": "Back Channel to Cuba", "author": "William LeoGrande & Peter Kornbluh", "publication": "University of North Carolina Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}]}]},



    # ═══════════════════════════════════════════════════════════════════════
    # SUB-SAHARAN AFRICA
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "kingdom-aksum-ethiopia-350", "title": "Kingdom of Aksum — Ethiopian Empire at its Peak", "year": 350, "lat": 14.13, "lng": 38.72, "geo_modern": "Aksum, Ethiopia", "geo_era_label": "Aksumite Empire", "category": "cultural", "importance_score": 0.82, "zoom_min": 2, "perspectives": [{"label": "Ethiopian historical tradition", "culture_code": "et", "viewpoint_type": "nationalist", "narrative": "The Kingdom of Aksum (1st–7th centuries CE) was one of the great civilizations of the ancient world, commanding Red Sea trade between the Roman Empire and India. Under Ezana (c. 330 CE), Aksum became one of the first states to adopt Christianity as a state religion — predating Rome. Its monolithic obelisks and coinage rivaled Rome's.", "summary": "Aksum was a major Red Sea trading empire and among the first Christian states in the world.", "evidence_score": 0.82, "sources": [{"title": "The Kebra Nagast (Glory of Kings)", "source_type": "primary", "reliability_tier": 2, "year": 700}, {"title": "Ancient Ethiopia", "author": "David Phillipson", "publication": "British Museum Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998}]}, {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Archaeological work at Aksum reveals a sophisticated urban center with multi-story stone buildings, an extensive stele field, and evidence of international trade including Roman, Indian, and Arabian goods. Aksum minted its own gold, silver, and bronze coins — one of few sub-Saharan states to do so in antiquity.", "summary": "Archaeology confirms Aksum as a literate, urbanized, coin-minting empire on par with contemporary Mediterranean powers.", "evidence_score": 0.85, "sources": [{"title": "Aksum: An African Civilisation of Late Antiquity", "author": "Stuart Munro-Hay", "publication": "Edinburgh University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}]}]},

    {"slug": "bantu-expansion-migrations-1000bce", "title": "Bantu Expansion — Peopling of Sub-Saharan Africa", "year": -1000, "lat": -5.0, "lng": 15.0, "geo_modern": "Central Africa (Congo Basin)", "geo_era_label": "Iron Age Africa", "category": "cultural", "importance_score": 0.85, "zoom_min": 1, "is_bce": True, "perspectives": [{"label": "African linguistic and archaeological history", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Bantu expansion, beginning around 3000 BCE in West-Central Africa (modern Cameroon/Nigeria border), was one of the greatest demographic migrations in human history. Bantu-speaking farmers carrying iron technology, agriculture (yam, sorghum), and cattle spread across sub-Saharan Africa over 2,000 years, reaching southern Africa by 500 CE.", "summary": "The Bantu migration was one of history's greatest demographic events, spreading iron, agriculture, and 400+ related languages across sub-Saharan Africa.", "evidence_score": 0.88, "sources": [{"title": "A History of Africa", "author": "J.D. Fage", "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995}]}, {"label": "Indigenous peoples' perspective", "culture_code": "za", "viewpoint_type": "indigenous", "narrative": "The Bantu expansion transformed and in many cases displaced earlier hunter-gatherer populations including the San (Bushmen) and Central African pygmy groups. These older populations retreated to marginal environments. Their languages and genetic profiles preserve evidence of humanity's earliest branches.", "summary": "Bantu expansion marginalized earlier San and pygmy populations, preserving only fragments of their ancient cultures and languages.", "evidence_score": 0.80, "sources": [{"title": "The Khoisan Peoples of South Africa", "author": "I. Schapera", "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1930}]}]},

    {"slug": "mali-empire-founding-1235", "title": "Battle of Kirina — Founding of the Mali Empire", "year": 1235, "lat": 11.86, "lng": -8.0, "geo_modern": "Mali, West Africa", "geo_era_label": "Mali Empire", "category": "political", "importance_score": 0.82, "zoom_min": 2, "perspectives": [{"label": "West African griot oral tradition", "culture_code": "ml", "viewpoint_type": "nationalist", "narrative": "Sundiata Keita, the 'Lion King' of Manding, defeated the Sosso king Sumanguru Kante at the Battle of Kirina (1235) to found the Mali Empire. The Epic of Sundiata, preserved by generations of griots (oral historians), recounts how Sundiata overcame childhood paralysis to become the greatest ruler of West Africa, creating an empire stretching from the Atlantic to Timbuktu.", "summary": "Sundiata Keita founded the Mali Empire through military victory, creating West Africa's greatest medieval empire.", "evidence_score": 0.78, "sources": [{"title": "Sundiata: An Epic of Old Mali", "author": "D.T. Niane", "publication": "Longman", "source_type": "primary", "reliability_tier": 3, "year": 1965}]}, {"label": "Academic historical perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Mali Empire (1235-1600) controlled the trans-Saharan gold and salt trade, making it one of the wealthiest states in the medieval world. Ibn Battuta's 14th-century visit documented its prosperous markets, Islamic scholarship, and sophisticated governance. At its peak it controlled 400,000 square miles and a substantial fraction of global gold output.", "summary": "Mali controlled the medieval world's gold trade and Ibn Battuta documented its sophisticated governance and wealth.", "evidence_score": 0.83, "sources": [{"title": "Medieval West Africa", "author": "Nehemia Levtzion", "publication": "Markus Wiener", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}]}]},

    {"slug": "mansa-musa-hajj-1324", "title": "Mansa Musa's Pilgrimage to Mecca — The Golden Hajj", "year": 1324, "lat": 21.42, "lng": 39.82, "geo_modern": "Cairo, Egypt / Mecca, Saudi Arabia", "geo_era_label": "Mali Empire", "category": "cultural", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Islamic world's perspective", "culture_code": "ml", "viewpoint_type": "religious", "narrative": "Mansa Musa I of Mali's 1324 hajj to Mecca with an entourage of 60,000 people and 80+ camels loaded with gold was the largest and most lavish pilgrimage in Islamic history. His generosity in Cairo was so extreme — distributing gold to every person he met — that he single-handedly caused inflation that devastated the Egyptian economy for a decade.", "summary": "Mansa Musa's hajj distributed so much gold it caused decade-long inflation in Cairo, demonstrating Mali's extraordinary wealth.", "evidence_score": 0.85, "sources": [{"title": "Mali in the Medieval Mediterranean World", "author": "Nehemia Levtzion", "publication": "Frank Cass", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1973}]}, {"label": "Global economic history perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Mansa Musa appears on European maps (notably the Catalan Atlas of 1375) seated on a golden throne, gold nugget in hand — evidence that West African wealth was known globally. Scholars estimate his personal wealth at $400 billion in modern terms, making him potentially the wealthiest individual in human history.", "summary": "Mansa Musa's wealth was globally known; estimated at $400B modern equivalent, he may have been the wealthiest person in history.", "evidence_score": 0.75, "sources": [{"title": "Mansa Musa and the Empire of Mali", "author": "P.F. de Moraes Farias", "publication": "Journal of African History", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1974}]}]},

    {"slug": "great-zimbabwe-kingdom-1250", "title": "Great Zimbabwe — African Stone City at its Peak", "year": 1250, "lat": -20.27, "lng": 30.93, "geo_modern": "Zimbabwe (formerly Rhodesia)", "geo_era_label": "Zimbabwe Plateau", "category": "cultural", "importance_score": 0.80, "zoom_min": 2, "perspectives": [{"label": "African civilization perspective", "culture_code": "zw", "viewpoint_type": "nationalist", "narrative": "Great Zimbabwe (11th–15th centuries CE) was the largest stone structure in sub-Saharan Africa, built without mortar by the ancestors of the Shona people. At its peak it housed 18,000 people and controlled gold trade between the interior and Indian Ocean ports. European colonizers refused to accept African builders and invented absurd alternative theories.", "summary": "Great Zimbabwe was a major African stone-built trading city, home to 18,000 people who controlled gold trade to the Indian Ocean.", "evidence_score": 0.88, "sources": [{"title": "Great Zimbabwe Described and Explained", "author": "David Randall-MacIver", "publication": "Clarendon Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1906}]}, {"label": "Colonial distortion and recovery perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "European colonizers (the Rhodesian government) actively suppressed archaeological findings that confirmed African authorship of Great Zimbabwe. Archaeologists who published accurate findings were dismissed. The site became politically charged: the newly independent nation Zimbabwe took its name from it in 1980 as an act of historical reclamation.", "summary": "Colonial regimes suppressed evidence of African builders; Zimbabwe named itself after the site in 1980 as historical reclamation.", "evidence_score": 0.90, "sources": [{"title": "The Zimbabwe Culture", "author": "Gertrude Caton-Thompson", "publication": "Clarendon Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1931}]}]},

    {"slug": "songhai-empire-askia-1493", "title": "Askia Muhammad Seizes Songhai Empire — West Africa's Greatest State", "year": 1493, "lat": 16.27, "lng": -0.04, "geo_modern": "Gao, Mali", "geo_era_label": "Songhai Empire", "category": "political", "importance_score": 0.80, "zoom_min": 2, "perspectives": [{"label": "West African Islamic tradition", "culture_code": "ml", "viewpoint_type": "religious", "narrative": "Askia Muhammad I transformed the Songhai Empire into the largest state in West African history, stretching from the Atlantic to modern Nigeria. A devout Muslim, he made a hajj to Mecca (1496-1497), brought Islamic scholars to Timbuktu, reformed tax and legal systems according to Islamic principles, and fostered the golden age of Timbuktu's intellectual life.", "summary": "Askia Muhammad made Songhai the largest West African state and turned Timbuktu into a global center of Islamic learning.", "evidence_score": 0.83, "sources": [{"title": "Tarikh al-Sudan (History of the Sudan)", "author": "Al-Sa'di", "source_type": "primary", "reliability_tier": 2, "year": 1655}]}, {"label": "Academic historical perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Songhai Empire under Askia Muhammad (1493-1528) operated a sophisticated bureaucratic state with provincial governors, professional army, standardized weights and measures, and a thriving trans-Saharan trade. The University of Sankore in Timbuktu attracted 25,000 students from across the Islamic world.", "summary": "Songhai operated a sophisticated bureaucratic state with a major university attracting 25,000 students at Timbuktu.", "evidence_score": 0.82, "sources": [{"title": "The History of West Africa", "author": "J.F. Ade Ajayi", "publication": "Columbia University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1985}]}]},

    {"slug": "kingdom-benin-bronzes-1440", "title": "Kingdom of Benin — Bronze Masterpieces and Royal Court", "year": 1440, "lat": 6.34, "lng": 5.62, "geo_modern": "Benin City, Nigeria", "geo_era_label": "Kingdom of Benin", "category": "cultural", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Benin royal tradition", "culture_code": "ng", "viewpoint_type": "nationalist", "narrative": "Under Oba Ewuare the Great (r. 1440-1473), the Kingdom of Benin in what is now southern Nigeria reached its artistic and political peak. Benin's bronze and ivory carvings — created by hereditary guilds using lost-wax casting — depicted royal power, history, and cosmology with extraordinary sophistication. European visitors in the 15th century described a magnificent walled city.", "summary": "Benin's bronze casting tradition produced masterpieces of world art while its walled capital impressed European visitors.", "evidence_score": 0.87, "sources": [{"title": "Benin Art", "author": "William Fagg", "publication": "Paul Hamlyn", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1963}]}, {"label": "Colonial looting and restitution perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "In 1897, a British 'punitive expedition' looted over 3,000 Benin Bronzes and burned the palace. The bronzes are now scattered across Western museums. Restitution debates since 2018 have led some institutions to begin returning the artworks — a landmark shift in museum ethics and global cultural property law.", "summary": "Britain looted 3,000 bronzes in 1897; ongoing restitution debates are reshaping global museum ethics and cultural property law.", "evidence_score": 0.92, "sources": [{"title": "The Brutish Museums", "author": "Dan Hicks", "publication": "Pluto Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2020}]}]},

    {"slug": "zulu-empire-shaka-1816", "title": "Shaka Zulu Founds the Zulu Kingdom — The Mfecane", "year": 1816, "lat": -28.5, "lng": 31.35, "geo_modern": "KwaZulu-Natal, South Africa", "geo_era_label": "Zulu Kingdom", "category": "political", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Zulu nationalist tradition", "culture_code": "za", "viewpoint_type": "nationalist", "narrative": "Shaka kaSenzangakhona (r. 1816-1828) transformed a small Zulu chiefdom into a powerful centralized kingdom through military innovation — including the 'bull horn' encirclement tactic and the short stabbing spear (iklwa). His Mfecane ('crushing') sent shock waves of displacement across southern Africa as neighboring peoples fled or were absorbed.", "summary": "Shaka's military innovations created a powerful Zulu kingdom whose Mfecane wars reshaped the entire demography of southern Africa.", "evidence_score": 0.82, "sources": [{"title": "Shaka Zulu", "author": "E.A. Ritter", "publication": "Longman", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 1955}]}, {"label": "Revisionist historical perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Revisionist historians challenge the extent of Shaka's personal role and question exaggerated accounts of the Mfecane's death toll. The disruptions of the period were also caused by the expanding Cape Colony, drought, and slave raids — not solely Shaka's wars. His image was partly constructed by colonizers to justify their own disruptive role in the region.", "summary": "Revisionist historians argue the Mfecane's scale was exaggerated and partly caused by colonial disruptions attributed falsely to Shaka.", "evidence_score": 0.75, "sources": [{"title": "The Mfecane Aftermath", "author": "Carolyn Hamilton", "publication": "Witwatersrand University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}]}]},

    {"slug": "battle-adwa-ethiopia-1896", "title": "Battle of Adwa — Ethiopia Defeats Italy", "year": 1896, "lat": 14.17, "lng": 38.9, "geo_modern": "Adwa, Ethiopia", "geo_era_label": "Ethiopian Empire", "category": "war", "importance_score": 0.85, "zoom_min": 3, "perspectives": [{"label": "Ethiopian and pan-African perspective", "culture_code": "et", "viewpoint_type": "nationalist", "narrative": "Emperor Menelik II's decisive victory over the Italian army at Adwa on March 1, 1896 — killing or capturing 7,000 Italian soldiers — made Ethiopia the only African nation to defeat a European colonial power in battle and maintain independence. Adwa became a symbol of African resistance for pan-African movements worldwide.", "summary": "Ethiopia's victory at Adwa was the only defeat of a European colonial army by an African nation, inspiring pan-African movements globally.", "evidence_score": 0.92, "sources": [{"title": "Adwa: African Victory", "author": "Raymond Jonas", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}]}, {"label": "Italian colonial and European perspective", "culture_code": "it", "viewpoint_type": "nationalist", "narrative": "For Italy, Adwa was a national humiliation that created a burning desire for revenge — finally achieved when Mussolini invaded Ethiopia in 1935. Italy's defeat undermined the racist assumption that African armies could not stand against European technology, though European powers responded by intensifying their colonial ventures elsewhere in Africa.", "summary": "Adwa humiliated Italy, fueling Mussolini's 1935 revenge invasion, while challenging European racial assumptions about African military capability.", "evidence_score": 0.88, "sources": [{"title": "The Battle of Adwa", "author": "Haggai Erlich", "publication": "Lynne Rienner", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1996}]}]},

    {"slug": "mau-mau-uprising-kenya-1952", "title": "Mau Mau Uprising — Kenya's War for Independence", "year": 1952, "lat": -1.29, "lng": 36.82, "geo_modern": "Kenya", "geo_era_label": "British Kenya", "category": "war", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Kenyan nationalist tradition", "culture_code": "ke", "viewpoint_type": "nationalist", "narrative": "The Mau Mau uprising (1952-1960) was a Kikuyu-led armed revolt against British colonial rule and land theft in Kenya. Fighters took forest oaths and waged guerrilla war. British response included concentration camps holding 150,000+ Kenyans, systematic torture, and collective punishment. The uprising accelerated Kenya's independence in 1963.", "summary": "The Mau Mau revolt against British land theft accelerated Kenyan independence, despite Britain's brutal concentration camp response.", "evidence_score": 0.85, "sources": [{"title": "Mau Mau: An African Crucible", "author": "Robert Edgerton", "publication": "Free Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1989}]}, {"label": "British colonial and legal perspective", "culture_code": "gb", "viewpoint_type": "government", "narrative": "Declassified documents released after 2012 court cases confirmed systematic British torture of Mau Mau detainees — castration, sexual violence, and beatings. Britain settled a lawsuit by 5,228 Kenyan victims in 2013 for £20 million, acknowledging abuse for the first time. The 'Pipeline' detention system was overseen by colonial officials at the highest level.", "summary": "Britain settled with 5,228 Mau Mau torture victims in 2013, confirming systematic abuse including castration in colonial detention camps.", "evidence_score": 0.93, "sources": [{"title": "Britain's Gulag", "author": "Caroline Elkins", "publication": "Henry Holt", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}]}]},

    {"slug": "congo-independence-lumumba-1960", "title": "Congo Independence and the Assassination of Patrice Lumumba", "year": 1960, "lat": -4.32, "lng": 15.32, "geo_modern": "Leopoldville (Kinshasa), DRC", "geo_era_label": "Decolonization Africa", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Congolese nationalist perspective", "culture_code": "cd", "viewpoint_type": "nationalist", "narrative": "Patrice Lumumba, Congo's first democratically elected prime minister, gave an electrifying independence speech on June 30, 1960 confronting Belgian King Baudouin directly about colonial atrocities. Within months, Belgium, the US, and UN conspired in his overthrow and assassination (January 17, 1961) — executed by Mobutu's soldiers with Belgian officers present.", "summary": "Lumumba's assassination by Belgium and the CIA within 7 months of independence destroyed Congo's democratic promise.", "evidence_score": 0.88, "sources": [{"title": "The Assassination of Lumumba", "author": "Ludo De Witte", "publication": "Verso", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}]}, {"label": "Cold War geopolitical perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "CIA director Allen Dulles recommended Lumumba's assassination in August 1960, fearing his appeal to the Soviet Union. The Church Committee (1975) confirmed CIA involvement in the assassination plot. Congo's vast mineral wealth — uranium, cobalt, copper — made it a crucial Cold War prize that Western powers would not allow a nationalist leader to control.", "summary": "CIA director ordered Lumumba's assassination to prevent a Soviet-aligned Congo controlling vast mineral resources.", "evidence_score": 0.90, "sources": [{"title": "Church Committee Report on Assassinations", "publication": "US Senate", "source_type": "primary", "reliability_tier": 1, "year": 1975}]}]},

    {"slug": "anc-founding-south-africa-1912", "title": "African National Congress Founded — South Africa's Liberation Movement", "year": 1912, "lat": -26.2, "lng": 28.04, "geo_modern": "Bloemfontein, South Africa", "geo_era_label": "Union of South Africa", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "South African liberation perspective", "culture_code": "za", "viewpoint_type": "nationalist", "narrative": "The South African Native National Congress (renamed ANC in 1923) was founded in 1912 by educated Black South Africans to protest the exclusions of the new Union of South Africa's constitution, which denied Blacks political rights. Over 80 years it evolved from a moderate petitioner to a liberation movement, finally bringing Mandela to power in 1994.", "summary": "The ANC spent 82 years fighting racial exclusion from legal petitions through armed struggle to peaceful elections in 1994.", "evidence_score": 0.88, "sources": [{"title": "The ANC: South Africa's National Liberation Movement", "author": "Sheridan Johns", "publication": "Westview Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995}]}, {"label": "International solidarity perspective", "culture_code": "global", "viewpoint_type": "political", "narrative": "The global anti-apartheid movement — academic boycotts, sports sanctions, arms embargoes, and divestment campaigns — isolated South Africa internationally and economically. The ANC's international support network (Soviet Union, Cuba, Nordic countries, OAU) was crucial. The divestment movement pioneered tactics later used in other human rights campaigns.", "summary": "The global anti-apartheid boycott movement pioneered divestment tactics later used in other human rights campaigns.", "evidence_score": 0.85, "sources": [{"title": "International Opposition to Apartheid", "author": "Enuga Reddy", "publication": "UN Centre Against Apartheid", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}]}]},

    {"slug": "biafran-war-nigeria-1967", "title": "Nigerian Civil War — Biafra and the Birth of Humanitarian Intervention", "year": 1967, "lat": 5.55, "lng": 7.49, "geo_modern": "Eastern Nigeria (Biafra)", "geo_era_label": "Post-Independence Nigeria", "category": "war", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "Biafran secessionist perspective", "culture_code": "ng", "viewpoint_type": "nationalist", "narrative": "The Biafran War (1967-1970) saw Igbo-majority Eastern Nigeria secede after ethnic massacres of Igbos in northern Nigeria. The Nigerian blockade caused starvation of 1-3 million Biafrans — images of skeletal children shocked the world. France and Ivory Coast recognized Biafra; most states backed Nigeria's unity.", "summary": "Biafra's secession attempt and resulting famine of 1-3 million people shocked the world and birthed modern humanitarian intervention.", "evidence_score": 0.83, "sources": [{"title": "There Was a Country", "author": "Chinua Achebe", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}]}, {"label": "Humanitarian and NGO perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Biafran crisis created Médecins Sans Frontières (MSF/Doctors Without Borders) in 1971, when French doctors who had served in Biafra decided the humanitarian imperative must override national sovereignty. The principle of 'droit d'ingérence' (right of intervention) — now standard in international law — was born in Biafra.", "summary": "Biafra's famine directly created Médecins Sans Frontières and established the 'right of intervention' principle in international law.", "evidence_score": 0.85, "sources": [{"title": "The History of MSF", "author": "Rony Brauman", "publication": "MSF", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # ASIAN HISTORY — JAPAN
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "prince-shotoku-constitution-604", "title": "Prince Shotoku's Seventeen-Article Constitution — Japanese Buddhism and State", "year": 604, "lat": 34.69, "lng": 135.5, "geo_modern": "Asuka, Japan", "geo_era_label": "Asuka Period Japan", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "Japanese Buddhist state tradition", "culture_code": "jp", "viewpoint_type": "religious", "narrative": "Prince Shotoku Taishi (574-622 CE), regent of Japan, promulgated a 17-article 'constitution' (moral code) blending Confucian and Buddhist principles into a vision of harmonious Buddhist governance. He established Buddhism as the state religion, sent official embassies to Sui China, and built the Horyu-ji temple — the world's oldest surviving wooden structure.", "summary": "Shotoku established Japanese Buddhism as a state religion, Confucian governance, and diplomatic engagement with China.", "evidence_score": 0.82, "sources": [{"title": "The Nihon Shoki (Chronicles of Japan)", "source_type": "primary", "reliability_tier": 2, "year": 720}]}, {"label": "Japanese political history perspective", "culture_code": "jp", "viewpoint_type": "academic", "narrative": "Shotoku's constitution reflects the Soga clan's project of centralizing Japan along Chinese Tang-dynasty lines — replacing clan power with a bureaucratic state under the emperor. The Taika Reforms (645 CE) completed this centralization. Modern scholars debate how much of the 'constitution' is Shotoku's own work versus later attribution.", "summary": "The constitution was part of a broader project of Chinese-style centralization; scholars debate Shotoku's personal role in its composition.", "evidence_score": 0.75, "sources": [{"title": "Japan Before Buddhism", "author": "J.E. Kidder", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1959}]}]},

    {"slug": "heian-period-tale-genji-1000", "title": "Heian Period Japan — The Tale of Genji and Court Culture", "year": 1000, "lat": 35.01, "lng": 135.77, "geo_modern": "Kyoto (Heian-kyō), Japan", "geo_era_label": "Heian Period Japan", "category": "cultural", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "Japanese literary and cultural tradition", "culture_code": "jp", "viewpoint_type": "academic", "narrative": "Murasaki Shikibu's 'The Tale of Genji' (c. 1008 CE), written by a lady-in-waiting at the Heian court, is generally considered the world's first psychological novel. The Heian period (794-1185) produced an extraordinary aristocratic culture: Japanese kana script (enabling women's literacy), monogatari fiction, renga poetry, and the aesthetic concepts of mono no aware and wabi that define Japanese aesthetic sensibility.", "summary": "Heian-period Japan produced the world's first novel (by a woman) and the aesthetic concepts of mono no aware that define Japanese culture.", "evidence_score": 0.87, "sources": [{"title": "The Tale of Genji", "author": "Murasaki Shikibu", "publication": "Penguin Classics", "source_type": "primary", "reliability_tier": 1, "year": 1008}]}, {"label": "Gender history perspective", "culture_code": "jp", "viewpoint_type": "academic", "narrative": "The prominence of women writers in Heian Japan — Murasaki Shikibu, Sei Shonagon (The Pillow Book) — resulted from a paradox: kana script was considered 'women's writing' while men used the more prestigious Chinese characters. Women's exclusion from official Chinese learning freed them to develop Japanese literary forms that became the foundation of the entire national literary tradition.", "summary": "Women dominated Heian Japanese literature because kana was 'women's script' — their exclusion from Chinese learning paradoxically created Japan's literary tradition.", "evidence_score": 0.82, "sources": [{"title": "The World of the Shining Prince", "author": "Ivan Morris", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1964}]}]},

    {"slug": "mongol-invasions-japan-1274", "title": "Mongol Invasions of Japan — The Divine Wind (Kamikaze)", "year": 1274, "lat": 33.61, "lng": 130.35, "geo_modern": "Hakata Bay, Japan (modern Fukuoka)", "geo_era_label": "Kamakura Period Japan", "category": "war", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "Japanese military and religious tradition", "culture_code": "jp", "viewpoint_type": "religious", "narrative": "Two massive Mongol invasion fleets (1274: 23,000 troops; 1281: 140,000 troops) were both destroyed by typhoons that Japanese called 'kamikaze' (divine winds). Japan's samurai defenders fought desperately but were outmatched by Mongol tactics — until the typhoons intervened. The myth of divine protection became central to Japanese national identity, revived in WWII with suicide pilots.", "summary": "Typhoons destroyed two Mongol invasion fleets, creating the kamikaze myth of divine protection that defined Japanese identity for 700 years.", "evidence_score": 0.87, "sources": [{"title": "In Little Need of Divine Intervention", "author": "Thomas Conlan", "publication": "East Asia Program Cornell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}]}, {"label": "Mongol strategic perspective", "culture_code": "cn", "viewpoint_type": "academic", "narrative": "Kublai Khan's two invasions of Japan were the largest amphibious operations in premodern history. The 1281 invasion force of 140,000-plus was an extraordinary logistical effort. Underwater archaeology at Hakata Bay has found the wreckage of Mongol ships destroyed by the typhoons, confirming the historical record.", "summary": "The 140,000-troop 1281 invasion was history's largest premodern amphibious assault; underwater archaeology confirmed the typhoon destruction.", "evidence_score": 0.85, "sources": [{"title": "Khubilai Khan's Lost Fleet", "author": "James Delgado", "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}]}]},

    {"slug": "battle-sekigahara-tokugawa-1600", "title": "Battle of Sekigahara — Tokugawa Unifies Japan", "year": 1600, "lat": 35.37, "lng": 136.47, "geo_modern": "Sekigahara, Japan (Gifu Prefecture)", "geo_era_label": "Edo Period Japan", "category": "war", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "Japanese samurai tradition", "culture_code": "jp", "viewpoint_type": "nationalist", "narrative": "The Battle of Sekigahara (October 21, 1600) — involving 160,000 samurai — was the decisive battle that ended Japan's century of civil war (Sengoku period). Tokugawa Ieyasu's victory led to the establishment of the Edo shogunate (1603) that unified Japan under 265 years of relative peace, during which samurai culture, Zen aesthetics, and urban merchant culture flourished.", "summary": "Sekigahara unified Japan after a century of civil war, inaugurating 265 years of Tokugawa peace that shaped Japanese culture.", "evidence_score": 0.90, "sources": [{"title": "Sekigahara 1600", "author": "Anthony Bryant", "publication": "Osprey", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1995}]}, {"label": "Social transformation perspective", "culture_code": "jp", "viewpoint_type": "academic", "narrative": "The Tokugawa peace froze Japan's social order into four hereditary classes (samurai, farmers, artisans, merchants) and implemented sakoku (closed country) from 1635, limiting foreign trade to Dutch and Chinese at Nagasaki. This isolation preserved Japanese culture but delayed industrialization — a trade-off debated by Japanese historians ever since.", "summary": "Tokugawa peace froze Japan's social classes and enforced sakoku isolation, preserving culture but delaying industrialization for 250 years.", "evidence_score": 0.85, "sources": [{"title": "Tokugawa Japan: The Social and Economic Antecedents of Modern Japan", "author": "Chie Nakane", "publication": "University of Tokyo Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1990}]}]},

    {"slug": "perry-opens-japan-1853", "title": "Commodore Perry Opens Japan — End of Sakoku", "year": 1853, "lat": 35.44, "lng": 139.65, "geo_modern": "Uraga, Japan (Kanagawa Bay)", "geo_era_label": "Late Edo Period Japan", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "American expansionist perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "Commodore Matthew Perry's 'Black Ships' arriving at Uraga in July 1853 demanded Japan open to American trade. The Convention of Kanagawa (1854) and Harris Treaty (1858) forced open Japanese ports. For the US, this completed the 'opening of the Pacific' — connecting the California gold rush to Asia trade routes.", "summary": "Perry's Black Ships broke Japan's 250-year isolation and opened trade routes connecting America to Asia.", "evidence_score": 0.88, "sources": [{"title": "Narrative of the Expedition to the China Seas and Japan", "author": "Matthew Perry", "publication": "US Senate", "source_type": "primary", "reliability_tier": 2, "year": 1856}]}, {"label": "Japanese national response perspective", "culture_code": "jp", "viewpoint_type": "nationalist", "narrative": "Perry's arrival exposed Japan's military weakness and triggered 15 years of internal crisis culminating in the Meiji Restoration (1868). The slogan 'enrich the country, strengthen the military' (fukoku kyōhei) drove Japan's rapid industrialization. The trauma of forced opening transformed Japan from feudal to industrial power in a single generation — a transformation other colonized nations could only dream of.", "summary": "Perry's humiliation triggered the Meiji transformation that industrialized Japan in one generation, while other nations couldn't escape colonization.", "evidence_score": 0.87, "sources": [{"title": "The Making of Modern Japan", "author": "Marius Jansen", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # ASIAN HISTORY — INDIA
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "indus-valley-civilization-2500bce", "title": "Indus Valley Civilization — Mohenjo-daro and Harappa", "year": -2500, "lat": 27.32, "lng": 68.14, "geo_modern": "Sindh, Pakistan / Rajasthan, India", "geo_era_label": "Indus Valley Civilization", "category": "cultural", "importance_score": 0.87, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "South Asian archaeological perspective", "culture_code": "in", "viewpoint_type": "academic", "narrative": "The Indus Valley Civilization (c. 3300-1300 BCE) was the world's largest Bronze Age civilization by area, encompassing over 1,500 sites. Cities like Mohenjo-daro and Harappa featured orthogonal street grids, advanced sanitation (flush toilets, public baths), standardized weights, and multi-story brick buildings — achieving sophisticated urban planning that would not reappear in South Asia for 3,000 years.", "summary": "The world's largest Bronze Age civilization built cities with flush toilets and street grids not matched in South Asia for 3,000 years.", "evidence_score": 0.88, "sources": [{"title": "The Ancient Indus: Urbanism, Economy, and Society", "author": "Rita Wright", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}]}, {"label": "Undeciphered script and mystery perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Indus script remains undeciphered — one of archaeology's great mysteries. We have no king lists, no religious texts, no war memorials — making the Indus civilization uniquely opaque. Its apparent lack of temples, palaces, and mass weapons suggests a society more egalitarian than contemporary Mesopotamia or Egypt, though this remains debated.", "summary": "The undeciphered Indus script leaves its civilization uniquely opaque; the apparent absence of palaces and war art suggests unusual egalitarianism.", "evidence_score": 0.82, "sources": [{"title": "The Indus Script: Texts, Concordance and Tables", "author": "Iravatham Mahadevan", "publication": "Archaeological Survey of India", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1977}]}]},

    {"slug": "buddha-enlightenment-528bce", "title": "Siddhartha Gautama's Enlightenment — Buddhism Founded", "year": -528, "lat": 24.7, "lng": 84.99, "geo_modern": "Bodh Gaya, Bihar, India", "geo_era_label": "Magadha Kingdom (Indian subcontinent)", "category": "cultural", "importance_score": 0.93, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "Theravada Buddhist tradition", "culture_code": "in", "viewpoint_type": "religious", "narrative": "Siddhartha Gautama, a prince of the Shakya clan in what is now Nepal, attained enlightenment under the Bodhi tree at Bodh Gaya around 528 BCE. He taught the Four Noble Truths (suffering exists; it has a cause; it can end; there is a path to end it) and the Eightfold Path. His teaching (Dharma) spread across Asia to become a religion of 500 million followers.", "summary": "The Buddha's enlightenment and teaching of the Four Noble Truths created a religion followed by 500 million people across Asia.", "evidence_score": 0.78, "sources": [{"title": "Dhammacakkappavattana Sutta (Setting the Wheel of Dhamma in Motion)", "source_type": "primary", "reliability_tier": 2, "year": -528}]}, {"label": "Historical and comparative religion perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Buddhism was revolutionary in its non-theism, its rejection of the Brahminical caste system, and its universal message that liberation is available to all regardless of birth. The Axial Age (800-200 BCE) simultaneously produced Confucius, the Hebrew prophets, Socrates, and Zarathustra — suggesting a global shift in human consciousness toward abstract ethical thinking.", "summary": "Buddhism's rejection of caste and its universal ethics was revolutionary; the Axial Age simultaneously produced Confucius, Hebrew prophets, and Socrates.", "evidence_score": 0.83, "sources": [{"title": "The Great Transformation", "author": "Karen Armstrong", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}]}]},

    {"slug": "babur-founds-mughal-empire-1526", "title": "Babur Defeats the Delhi Sultanate — Mughal Empire Founded", "year": 1526, "lat": 29.93, "lng": 77.71, "geo_modern": "Panipat, India", "geo_era_label": "Mughal Empire India", "category": "war", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Mughal dynastic tradition", "culture_code": "in", "viewpoint_type": "nationalist", "narrative": "Babur, a Timurid prince from Central Asia descended from both Tamerlane and Genghis Khan, defeated the last Delhi Sultan Ibrahim Lodi at the First Battle of Panipat (1526) using field artillery — the first decisive use of gunpowder weapons in South Asian warfare. His dynasty would rule India for 331 years and create the Taj Mahal.", "summary": "Babur's Mughal dynasty, founded with gunpowder artillery at Panipat, ruled India for 331 years and created the Taj Mahal.", "evidence_score": 0.88, "sources": [{"title": "Baburnama", "author": "Babur", "publication": "Penguin Classics", "source_type": "primary", "reliability_tier": 1, "year": 1530}]}, {"label": "Indian historical perspective", "culture_code": "in", "viewpoint_type": "academic", "narrative": "The Mughal period (1526-1857) synthesized Timurid Persian, Central Asian, and Indian Hindu cultures into the Mughal aesthetic — seen in architecture (Taj Mahal, Red Fort), miniature painting, music, and cuisine. Akbar's policy of religious tolerance (sulh-i-kul) and administrative genius created India's most prosperous pre-colonial state, accounting for 25% of global GDP.", "summary": "The Mughal synthesis of Persian and Indian cultures produced Taj Mahal-level art while generating 25% of global GDP under Akbar.", "evidence_score": 0.85, "sources": [{"title": "The Mughal Empire", "author": "John F. Richards", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}]}]},

    {"slug": "akbar-religious-tolerance-din-ilahi-1563", "title": "Akbar the Great — Religious Tolerance and Empire Building", "year": 1563, "lat": 27.18, "lng": 78.02, "geo_modern": "Agra, India", "geo_era_label": "Mughal Empire India", "category": "political", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "Mughal syncretist tradition", "culture_code": "in", "viewpoint_type": "religious", "narrative": "Mughal Emperor Akbar (r. 1556-1605) abolished the jizya tax on non-Muslims, married Hindu Rajput princesses, employed Hindus in the highest government positions, patronized Sanskrit scholarship, and created Din-i-Ilahi — a syncretic personal religion combining Islam, Hinduism, Zoroastrianism, and Christianity. His tolerant governance was the basis of a prosperous multi-religious Indian empire.", "summary": "Akbar abolished Muslim taxes on Hindus, married Rajput women, and created a syncretic religion — establishing tolerant governance of India's diverse population.", "evidence_score": 0.87, "sources": [{"title": "Akbarnama", "author": "Abu'l-Fazl ibn Mubarak", "publication": "Asiatic Society", "source_type": "primary", "reliability_tier": 2, "year": 1590}]}, {"label": "Critical historical perspective", "culture_code": "in", "viewpoint_type": "academic", "narrative": "Akbar's tolerance had limits: military campaigns brutally suppressed Rajput and other resisters. His policies were also pragmatic — tolerating Hinduism helped maintain control of a population that was 80% non-Muslim. Yet his tolerance compares favorably to contemporary European religious wars and established a precedent of plural governance that Indian nationalists would later invoke.", "summary": "Akbar's tolerance was partly pragmatic, yet his pluralist governance contrasted with contemporary European religious wars and shaped Indian nationalist ideology.", "evidence_score": 0.82, "sources": [{"title": "Akbar: The Great Mughal", "author": "Ira Mukhoty", "publication": "Aleph Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2020}]}]},

    {"slug": "battle-plassey-british-india-1757", "title": "Battle of Plassey — Britain Conquers India", "year": 1757, "lat": 23.8, "lng": 88.25, "geo_modern": "Plassey (Palashi), West Bengal, India", "geo_era_label": "British East India Company", "category": "war", "importance_score": 0.87, "zoom_min": 3, "perspectives": [{"label": "British imperial narrative", "culture_code": "gb", "viewpoint_type": "nationalist", "narrative": "Robert Clive's victory at Plassey (June 23, 1757) over Nawab Siraj ud-Daulah of Bengal, secured through bribery of the Nawab's general Mir Jafar, gave the East India Company control of Bengal's vast revenues. It was the foundation of British India — within a century Britain would control the entire subcontinent.", "summary": "Clive's victory at Plassey through bribery gave Britain control of Bengal's revenues and launched the conquest of India.", "evidence_score": 0.88, "sources": [{"title": "Clive of India", "author": "Mark Bence-Jones", "publication": "Constable", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1974}]}, {"label": "Indian nationalist and economic perspective", "culture_code": "in", "viewpoint_type": "nationalist", "narrative": "For India, Plassey was the beginning of systematic economic drain — the 'Great Drain' theory formulated by Dadabhai Naoroji calculated that Britain extracted £1 trillion from India over 173 years. Bengal, India's wealthiest province, was de-industrialized: its famous textile exports replaced by British imports backed by military power. India's share of world GDP fell from 25% to 4%.", "summary": "Plassey began Britain's systematic draining of India's wealth — $45 trillion extracted over 173 years as India's GDP share fell from 25% to 4%.", "evidence_score": 0.83, "sources": [{"title": "Poverty and Un-British Rule in India", "author": "Dadabhai Naoroji", "publication": "Swan Sonnenschein", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1901}]}]},

    {"slug": "gandhi-salt-march-1930", "title": "Gandhi's Salt March — Civil Disobedience Against British Rule", "year": 1930, "lat": 21.18, "lng": 72.83, "geo_modern": "Dandi, Gujarat, India", "geo_era_label": "British India", "category": "political", "importance_score": 0.87, "zoom_min": 3, "perspectives": [{"label": "Indian independence movement perspective", "culture_code": "in", "viewpoint_type": "nationalist", "narrative": "Gandhi's 241-mile march to the sea at Dandi (March 12 - April 5, 1930) to make salt in defiance of British salt tax laws was a masterstroke of nonviolent civil disobedience. The march galvanized mass Indian participation in independence struggle, attracted global media attention, and demonstrated that unarmed civilians could challenge empire.", "summary": "Gandhi's salt march galvanized millions in nonviolent resistance to British rule and demonstrated that civil disobedience could challenge empire.", "evidence_score": 0.92, "sources": [{"title": "The Story of My Experiments with Truth", "author": "Mahatma Gandhi", "publication": "Navajivan", "source_type": "primary", "reliability_tier": 2, "year": 1927}]}, {"label": "British colonial and international perspective", "culture_code": "gb", "viewpoint_type": "government", "narrative": "The Salt March exposed British imperial brutality to global scrutiny — newsreel footage of British police beating nonviolent marchers appalled world opinion, especially in America. Webb Miller's eyewitness reports in US newspapers of the Dharasana salt raid (400 Indians beaten without resistance) crystallized international sympathy for Indian independence.", "summary": "Newsreel footage of British police beating nonresisting marchers at Dharasana crystallized global support for Indian independence.", "evidence_score": 0.88, "sources": [{"title": "Gandhi: An Autobiography", "author": "Louis Fischer", "publication": "Harper & Row", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1950}]}]},

    {"slug": "delhi-sultanate-founding-1206", "title": "Delhi Sultanate Founded — Islamic Governance of North India", "year": 1206, "lat": 28.6, "lng": 77.2, "geo_modern": "Delhi, India", "geo_era_label": "Delhi Sultanate", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "Islamic historical tradition", "culture_code": "in", "viewpoint_type": "religious", "narrative": "Qutb ud-Din Aibak, a former slave general (mamluk) of Muhammad of Ghor, established the Delhi Sultanate in 1206 — the first Muslim sultanate in South Asia. For 320 years five dynasties ruled most of the subcontinent, introducing Persian administrative culture, Islamic architecture (Qutb Minar), and Persian as the court language. It set the stage for Mughal India.", "summary": "The Delhi Sultanate, founded by an ex-slave general, introduced Persian administrative culture and set the stage for Mughal India.", "evidence_score": 0.85, "sources": [{"title": "A Comprehensive History of India, Vol. 5 (Delhi Sultanate)", "author": "Mohammad Habib", "publication": "People's Publishing House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1970}]}, {"label": "Hindu-Muslim synthesis perspective", "culture_code": "in", "viewpoint_type": "academic", "narrative": "The Delhi Sultanate period was not purely one of Muslim rule over Hindus — it was a complex synthesis. Rajput and other Hindu rulers served as sultanate allies and administrators; Sufi saints built Hindu-Muslim syncretism; Persian-influenced Hindustani music and cuisine emerged. These centuries of interaction created the composite culture from which modern India descends.", "summary": "Delhi Sultanate era produced Hindu-Muslim cultural synthesis — Hindustani music, Sufi syncretism, and composite culture that defines modern India.", "evidence_score": 0.80, "sources": [{"title": "The Wonder That Was India", "author": "A.L. Basham", "publication": "Sidgwick & Jackson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1954}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # ISLAMIC GOLDEN AGE
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "al-khwarizmi-algebra-820", "title": "Al-Khwarizmi Invents Algebra — Foundation of Modern Mathematics", "year": 820, "lat": 33.34, "lng": 44.4, "geo_modern": "Baghdad, Iraq", "geo_era_label": "Abbasid Caliphate (Baghdad)", "category": "discovery", "importance_score": 0.90, "zoom_min": 2, "perspectives": [{"label": "Islamic scientific tradition", "culture_code": "iq", "viewpoint_type": "academic", "narrative": "Muhammad ibn Musa al-Khwarizmi, working at the Abbasid House of Wisdom in Baghdad (c. 820 CE), wrote 'Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala' — the founding text of algebra (al-jabr gives us 'algebra'). He also introduced the Hindu-Arabic numeral system (including zero) to the Islamic world, which transmitted it to Europe.", "summary": "Al-Khwarizmi invented algebra and introduced Hindu-Arabic numerals (including zero) to the world — foundations of all modern mathematics.", "evidence_score": 0.92, "sources": [{"title": "Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala", "author": "Al-Khwarizmi", "source_type": "primary", "reliability_tier": 1, "year": 820}]}, {"label": "Global history of science perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Al-Khwarizmi's work synthesized Babylonian, Indian, and Greek mathematical traditions. His name 'al-Khwarizmi' (from Khwarazm, modern Uzbekistan) became 'algorithm' in Latin — every computer algorithm is named after him. The Islamic Golden Age (8th-13th centuries) preserved, translated, and advanced ancient Greek knowledge, transmitting it to medieval Europe.", "summary": "Al-Khwarizmi's name became 'algorithm' — every computer program traces to him. Islamic scholars preserved and advanced ancient Greek knowledge for Europe.", "evidence_score": 0.90, "sources": [{"title": "The House of Wisdom", "author": "Jonathan Lyons", "publication": "Bloomsbury", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}]}]},

    {"slug": "avicenna-canon-medicine-1025", "title": "Avicenna's Canon of Medicine — Medieval Medical Standard", "year": 1025, "lat": 39.65, "lng": 66.97, "geo_modern": "Bukhara, Uzbekistan", "geo_era_label": "Islamic Golden Age", "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "Islamic medical tradition", "culture_code": "ir", "viewpoint_type": "academic", "narrative": "Ibn Sina (Avicenna, 980-1037 CE) wrote the 'Qanun fi al-Tibb' (Canon of Medicine), a million-word medical encyclopedia synthesizing Greek, Indian, and Islamic medical knowledge. It described quarantine, contagion theory, experimental pharmacology, and psychiatric illness. Translated into Latin, it was the standard European medical textbook until the 17th century.", "summary": "Avicenna's Canon was the world's medical textbook for 600 years, describing quarantine, contagion, and experimental medicine.", "evidence_score": 0.90, "sources": [{"title": "Al-Qanun fi al-Tibb (Canon of Medicine)", "author": "Ibn Sina (Avicenna)", "source_type": "primary", "reliability_tier": 1, "year": 1025}]}, {"label": "History of medicine perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Avicenna's Canon remained the dominant European medical text until the 17th century — its influence outlasted Aristotle's dominance in philosophy. He described 760 drugs, systematic clinical trials, and the mental-body connection. His philosophical works (Al-Shifa) influenced Aquinas and medieval European scholasticism profoundly.", "summary": "The Canon dominated European medicine for 600 years while Avicenna's philosophy influenced Aquinas and medieval European thought.", "evidence_score": 0.87, "sources": [{"title": "Avicenna: Scientist and Philosopher", "author": "G.M. Wickens", "publication": "Luzac", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1952}]}]},

    {"slug": "al-andalus-cordoba-caliphate-950", "title": "Cordoba Caliphate — Islamic Spain's Golden Age", "year": 950, "lat": 37.88, "lng": -4.78, "geo_modern": "Córdoba, Spain", "geo_era_label": "Umayyad Caliphate of Cordoba", "category": "cultural", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Islamic Iberian tradition", "culture_code": "es", "viewpoint_type": "academic", "narrative": "The Cordoba Caliphate under Abd al-Rahman III (r. 912-961) made Cordoba Europe's largest and most sophisticated city (500,000+ inhabitants). Its library held 400,000 volumes when Paris had perhaps 500 books. Muslim, Jewish, and Christian scholars worked together (convivencia) translating Greek philosophy into Arabic, laying the groundwork for Europe's 12th-century intellectual renaissance.", "summary": "Cordoba was Europe's largest city with 400,000 library volumes when Paris had 500 books — its scholars translated Greek knowledge for all of Europe.", "evidence_score": 0.85, "sources": [{"title": "The Ornament of the World", "author": "Maria Rosa Menocal", "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]}, {"label": "Convivencia critical perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The 'golden age' of convivencia (coexistence) in al-Andalus was real but imperfect: non-Muslims paid the jizya tax, faced restrictions on building churches, and could not hold arms. Yet Jewish and Christian scholars under Muslim rule enjoyed far more intellectual freedom than Jews in Christian Europe, producing figures like Maimonides and the Toledo translation movement.", "summary": "Convivencia was imperfect — non-Muslims faced real restrictions — but Jewish and Christian scholars thrived far better than Jews in Christian Europe.", "evidence_score": 0.80, "sources": [{"title": "Andalus: Unlocking the Secrets of Moorish Spain", "author": "Jason Webster", "publication": "Doubleday", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]}]},

    {"slug": "ibn-battuta-travels-1325", "title": "Ibn Battuta's Journeys — The Greatest Medieval Traveler", "year": 1325, "lat": 34.02, "lng": -5.0, "geo_modern": "Tangier, Morocco", "geo_era_label": "Islamic World", "category": "cultural", "importance_score": 0.80, "zoom_min": 1, "perspectives": [{"label": "Islamic geographical tradition", "culture_code": "ma", "viewpoint_type": "academic", "narrative": "Ibn Battuta of Tangier (1304-1368/69) traveled 75,000 miles across 40+ countries over 30 years — three times Marco Polo's distance. He visited the Mali Empire, the Golden Horde, Anatolia, India (where he served as Delhi Sultanate judge), the Maldives, China, and Sub-Saharan Africa. His 'Rihla' (Journey) is the most detailed medieval account of world geography.", "summary": "Ibn Battuta traveled 75,000 miles — more than Marco Polo — documenting the medieval Islamic world from Mali to China.", "evidence_score": 0.87, "sources": [{"title": "Rihla (The Travels of Ibn Battuta)", "author": "Ibn Battuta", "publication": "Hakluyt Society", "source_type": "primary", "reliability_tier": 2, "year": 1355}]}, {"label": "Comparative exploration perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Ibn Battuta's travels reveal the extraordinary connectivity of the 14th-century Islamic world: a common legal system (Maliki fiqh), commercial networks, and Arabic as a lingua franca enabled him to find employment as a judge across three continents. His account of the Black Death arriving in Syria (1348) is the first eyewitness description of its spread.", "summary": "Ibn Battuta's ease of travel shows the Islamic world's remarkable connectivity; his account of the Black Death reaching Syria is a priceless primary source.", "evidence_score": 0.85, "sources": [{"title": "Ibn Battuta: A Medieval Muslim Traveler", "author": "Ross Dunn", "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}]}]},

    {"slug": "safavid-persia-founding-1501", "title": "Safavid Dynasty — Shia Islam Becomes Persian State Religion", "year": 1501, "lat": 38.05, "lng": 46.3, "geo_modern": "Tabriz, Iran", "geo_era_label": "Safavid Persia", "category": "political", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "Persian Shia tradition", "culture_code": "ir", "viewpoint_type": "religious", "narrative": "Shah Ismail I's Safavid dynasty (founded 1501) made Twelver Shia Islam Persia's compulsory state religion — transforming a majority-Sunni population within a century through persuasion and coercion. This created the Sunni-Shia geopolitical fault line that still divides Iran from Saudi Arabia, and it preserved distinct Persian cultural identity against Ottoman Sunni dominance.", "summary": "The Safavids made Shia Islam Persia's state religion, creating the Sunni-Shia geopolitical divide that defines Iran-Saudi rivalry today.", "evidence_score": 0.87, "sources": [{"title": "The Safavid Dynasty", "author": "Roger Savory", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1980}]}, {"label": "Regional geopolitics perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Safavid Persia's Shia identity created a permanent geopolitical buffer between the Sunni Ottoman and Sunni Mughal empires. The century-long Ottoman-Safavid wars (1514-1639) exhausted both empires, contributing to the Ottomans' delayed response to European challenges. Isfahan under Shah Abbas I (r. 1588-1629) became one of the most beautiful cities in the world.", "summary": "Safavid Shia identity created the Ottoman-Safavid wars that exhausted both empires; Isfahan under Abbas I became a world masterpiece of urban planning.", "evidence_score": 0.85, "sources": [{"title": "Iran: Empire of the Mind", "author": "Michael Axworthy", "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}]}]},

    {"slug": "averroes-ibn-rushd-philosophy-1190", "title": "Averroes — Islamic Philosophy Rescues Aristotle for Europe", "year": 1190, "lat": 37.88, "lng": -4.78, "geo_modern": "Córdoba, Spain (al-Andalus)", "geo_era_label": "Islamic Golden Age", "category": "cultural", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Islamic philosophical tradition", "culture_code": "es", "viewpoint_type": "academic", "narrative": "Ibn Rushd (Averroes, 1126-1198), the greatest Islamic Aristotelian philosopher, wrote extensive commentaries on Aristotle's works that reconciled reason with revelation. His 'Decisive Treatise' argued that philosophy and Islamic law were compatible. Expelled from Córdoba for heresy, his works were preserved and translated to Latin, transforming European scholasticism.", "summary": "Averroes' Aristotle commentaries, preserved despite Islamic persecution, transformed European scholasticism and gave Aristotle to Aquinas.", "evidence_score": 0.88, "sources": [{"title": "Averroes on Plato's Republic", "author": "Ralph Lerner", "publication": "Cornell University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1974}]}, {"label": "History of ideas perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Averroes' Latin commentaries were so influential in medieval European universities that he was simply called 'The Commentator' — Aristotle being 'The Philosopher.' Thomas Aquinas engaged extensively with Averroes, and Dante placed him in Limbo alongside Aristotle. His doctrine of double truth (philosophical vs. religious truth) influenced European secular thought.", "summary": "Aquinas engaged Averroes extensively; Dante placed him beside Aristotle; his 'double truth' doctrine influenced secular European thought.", "evidence_score": 0.85, "sources": [{"title": "Averroes: His Life, Works and Influence", "author": "Majid Fakhry", "publication": "Oneworld", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2001}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # PRE-COLUMBIAN AMERICAS
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "olmec-civilization-1500bce", "title": "Olmec Civilization — Mother Culture of Mesoamerica", "year": -1200, "lat": 17.9, "lng": -94.9, "geo_modern": "San Lorenzo / La Venta, Veracruz, Mexico", "geo_era_label": "Formative Period Mesoamerica", "category": "cultural", "importance_score": 0.82, "zoom_min": 2, "is_bce": True, "perspectives": [{"label": "Mesoamerican archaeological perspective", "culture_code": "mx", "viewpoint_type": "academic", "narrative": "The Olmec civilization (c. 1500-400 BCE) on Mexico's Gulf Coast is considered the 'mother culture' of Mesoamerica. Their colossal stone heads (up to 3.4 meters tall), carved from basalt transported 150 km, depict rulers with African features — debated but unresolved. They developed proto-writing, the Mesoamerican calendar, ceremonial ball courts, and bloodletting rituals that all later civilizations adopted.", "summary": "The Olmec were Mesoamerica's 'mother culture' — their calendar, ball courts, and bloodletting rituals were adopted by all later civilizations including Maya and Aztec.", "evidence_score": 0.82, "sources": [{"title": "The Olmecs: America's First Civilization", "author": "Richard Diehl", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}]}, {"label": "Archaeological debate perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Olmec colossal heads' African-appearing features have prompted Afrocentric claims of pre-Columbian African contact with the Americas. Mainstream archaeology rejects this — the heads likely represent specific rulers, and their features reflect normal human variation in indigenous populations. The Olmec were purely indigenous American in origin.", "summary": "The colossal heads' 'African features' are a normal variation in indigenous Americans, not evidence of pre-Columbian African contact.", "evidence_score": 0.88, "sources": [{"title": "Ancient Mesoamerica", "author": "Richard Adams", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}]}]},

    {"slug": "teotihuacan-pyramid-peak-400", "title": "Teotihuacan — Americas' Greatest City at Its Peak", "year": 400, "lat": 19.69, "lng": -98.84, "geo_modern": "San Juan Teotihuacan, Mexico", "geo_era_label": "Classic Mesoamerica", "category": "cultural", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Mesoamerican civilization perspective", "culture_code": "mx", "viewpoint_type": "academic", "narrative": "Teotihuacan (c. 100 BCE - 550 CE) was the largest city in the pre-Columbian Americas at its peak (c. 400-500 CE) — a planned city of 125,000-200,000 people with the Avenue of the Dead, the Pyramid of the Sun (third-largest pyramid in the world), and extensive apartment compounds. Its influence extended throughout Mesoamerica to Maya cities and beyond.", "summary": "Teotihuacan was the Americas' largest city at 125,000-200,000 people, with the Pyramid of the Sun and influence across all of Mesoamerica.", "evidence_score": 0.85, "sources": [{"title": "Teotihuacan: City of the Gods", "author": "Kathleen Berrin", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}]}, {"label": "Mystery and collapse perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Teotihuacan was burned and abandoned around 550 CE — one of archaeology's great mysteries. The burners may have been internal revolution: archaeological evidence shows the destruction was deliberate and focused on elite compounds. The city's ethnicity is unknown — not Aztec (who came later), and its script remains undeciphered.", "summary": "Teotihuacan was deliberately burned — possibly in revolution against elites — around 550 CE. Its founders' identity and script remain unknown.", "evidence_score": 0.80, "sources": [{"title": "Teotihuacan and Its Legacy", "author": "George Cowgill", "publication": "Penn Museum", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}]}]},

    {"slug": "aztec-tenochtitlan-founding-1325", "title": "Aztec Founding of Tenochtitlan — The Eagle and the Serpent", "year": 1325, "lat": 19.43, "lng": -99.13, "geo_modern": "Mexico City, Mexico", "geo_era_label": "Aztec (Mexica) Empire", "category": "cultural", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Aztec/Mexica tradition", "culture_code": "mx", "viewpoint_type": "religious", "narrative": "The Mexica people founded Tenochtitlan on an island in Lake Texcoco in 1325 CE, fulfilling their god Huitzilopochtli's prophecy: settle where they saw an eagle devouring a serpent atop a cactus. The image is now Mexico's national symbol. Within 200 years Tenochtitlan grew to a city of 200,000-300,000 — larger than any contemporary European city.", "summary": "Tenochtitlan, founded on a prophecy, grew to 200,000-300,000 people — larger than any contemporary European city.", "evidence_score": 0.82, "sources": [{"title": "The Broken Spears: The Aztec Account of the Conquest of Mexico", "author": "Miguel Leon-Portilla", "publication": "Beacon Press", "source_type": "primary", "reliability_tier": 2, "year": 1962}]}, {"label": "Urban engineering perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Tenochtitlan was an extraordinary feat of engineering — a city built on an artificial island connected to the mainland by three major causeways, with an aqueduct system, extensive chinampas (floating gardens) producing food, and a market at Tlatelolco that amazed the conquistadors. Cortés's men compared it favorably to Venice.", "summary": "Tenochtitlan's causeways, aqueducts, and floating garden farms amazed Cortés's men, who compared it to Venice.", "evidence_score": 0.88, "sources": [{"title": "The Conquest of New Spain", "author": "Bernal Díaz del Castillo", "publication": "Penguin Classics", "source_type": "primary", "reliability_tier": 2, "year": 1568}]}]},

    {"slug": "inca-empire-pachacuti-1438", "title": "Pachacuti Expands the Inca Empire — Tawantinsuyu", "year": 1438, "lat": -13.52, "lng": -71.97, "geo_modern": "Cusco, Peru", "geo_era_label": "Inca Empire (Tawantinsuyu)", "category": "political", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Andean/Inca tradition", "culture_code": "pe", "viewpoint_type": "nationalist", "narrative": "Sapa Inca Pachacuti ('Earth-Shaker', r. 1438-1471) transformed a small Cusco kingdom into the largest empire in the Americas — stretching 4,000 miles from Colombia to Chile. He built Machu Picchu, reorganized the Inca state into the four-part Tawantinsuyu, constructed 40,000 km of roads, and developed the quipu (knotted string) recording system.", "summary": "Pachacuti built the Americas' largest empire, including Machu Picchu and 40,000 km of roads, using knotted-string quipu records.", "evidence_score": 0.85, "sources": [{"title": "The Incas", "author": "Gary Urton", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}]}, {"label": "Indigenous resistance perspective", "culture_code": "pe", "viewpoint_type": "indigenous", "narrative": "The Inca Empire was built through military conquest of dozens of Andean peoples — many of whom were forcibly relocated (mitmaq) to break up rebellious populations. The empire demanded labor (mit'a) rather than taxes. When Pizarro arrived in 1532, he exploited ongoing rebellions and civil war between Atahualpa and Huascar — showing Inca subjects were not universally loyal.", "summary": "Pizarro exploited Inca civil war and conquered peoples' rebellions — the Inca Empire contained the seeds of its own vulnerability.", "evidence_score": 0.83, "sources": [{"title": "The Last Days of the Incas", "author": "Kim MacQuarrie", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}]}]},

    {"slug": "cahokia-mississippian-mound-1050", "title": "Cahokia — North America's Greatest Pre-Columbian City", "year": 1050, "lat": 38.66, "lng": -90.06, "geo_modern": "Cahokia Mounds, Illinois, USA", "geo_era_label": "Mississippian Culture North America", "category": "cultural", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "North American indigenous history perspective", "culture_code": "us", "viewpoint_type": "academic", "narrative": "Cahokia (near modern St. Louis) was North America's largest pre-Columbian city — at its peak (1050-1200 CE) it housed 10,000-20,000 people and Monks Mound exceeded the Pyramid of Giza in base area. It was the center of the Mississippian culture that spread trade networks from the Great Lakes to the Gulf of Mexico.", "summary": "Cahokia was North America's largest city with Monks Mound exceeding Giza's base area — center of vast Mississippian trade networks.", "evidence_score": 0.85, "sources": [{"title": "Cahokia: Ancient America's Great City on the Mississippi", "author": "Timothy Pauketat", "publication": "Viking", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]}, {"label": "Mystery of collapse perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Cahokia was abandoned by 1350 CE — possibly due to climate change (Medieval Warm Period ending), agricultural exhaustion, political collapse, or flooding. Its inhabitants left no written records. When Europeans arrived in the area centuries later, local peoples had no memory of the great city — a stark reminder of how much pre-Columbian history has been lost.", "summary": "Cahokia was abandoned by 1350 with no explanation; local peoples had forgotten it entirely by European contact — a window into lost history.", "evidence_score": 0.82, "sources": [{"title": "Ancient Cahokia and the Mississippians", "author": "Timothy Pauketat", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}]}]},

    {"slug": "trail-of-tears-cherokee-1838", "title": "Trail of Tears — Forced Removal of the Cherokee Nation", "year": 1838, "lat": 35.5, "lng": -83.0, "geo_modern": "Georgia / Tennessee / Oklahoma, USA", "geo_era_label": "Antebellum USA", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Cherokee nation perspective", "culture_code": "us-native", "viewpoint_type": "indigenous", "narrative": "The 1838-1839 forced removal of 16,000 Cherokee people from their ancestral homeland in Georgia to Oklahoma (then Indian Territory) — ordered under Jackson's Indian Removal Act (1830) — killed 4,000 (one in four) from cold, disease, and starvation. The Cherokee had adopted US legal institutions, written language (Sequoyah's syllabary), and a constitution — none of which protected them.", "summary": "The Cherokee, who had adopted US law and Sequoyah's written language, were still forcibly removed with 4,000 killed — one in four.", "evidence_score": 0.90, "sources": [{"title": "Cherokee Editor: The Writings of Elias Boudinot", "author": "Theda Perdue", "publication": "University of Georgia Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1983}]}, {"label": "American legal and political perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The Supreme Court in Worcester v. Georgia (1832) ruled in the Cherokee's favor, but President Jackson reportedly replied 'John Marshall has made his decision; now let him enforce it.' The removal, carried out by General Winfield Scott, was condemned by Daniel Webster and other Whigs as a violation of treaty law — one of America's clearest acts of ethnic cleansing.", "summary": "Jackson defied the Supreme Court's ruling protecting Cherokee rights — one of America's clearest constitutional crises and acts of ethnic cleansing.", "evidence_score": 0.90, "sources": [{"title": "John Ross: Cherokee Chief", "author": "Gary Moulton", "publication": "University of Georgia Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1978}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTIFIC REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "vesalius-human-anatomy-1543", "title": "Vesalius Publishes 'De Humani Corporis Fabrica' — Anatomy Revolution", "year": 1543, "lat": 50.87, "lng": 4.7, "geo_modern": "Leuven, Belgium / Padua, Italy", "geo_era_label": "Scientific Revolution", "category": "discovery", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "History of medicine perspective", "culture_code": "be", "viewpoint_type": "academic", "narrative": "Andreas Vesalius published 'De Humani Corporis Fabrica' in 1543 — the same year as Copernicus's heliocentric book — correcting over 300 errors in Galen's anatomy based on actual dissection. Vesalius had conducted human dissections himself rather than relying on animal anatomy as Galen had done, founding empirical anatomy and challenging 1,400 years of medical authority.", "summary": "Vesalius corrected 300+ Galen anatomy errors through actual human dissection, founding empirical medicine in the same year Copernicus revolutionized astronomy.", "evidence_score": 0.92, "sources": [{"title": "De Humani Corporis Fabrica", "author": "Andreas Vesalius", "publication": "Oporinus", "source_type": "primary", "reliability_tier": 1, "year": 1543}]}, {"label": "Empirical revolution perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Vesalius represents the Scientific Revolution's empirical turn: observation over authority. His anatomical illustrations by Jan van Calcar (Titian's studio) were revolutionary — the first anatomical atlas where images carried the argument. He directly challenged Galenic authority while holding a chair at Padua, risking academic ostracism that he largely received from older physicians.", "summary": "Vesalius epitomizes the Scientific Revolution's empirical turn — his illustrated atlas challenged 1,400 years of Galenic authority through direct observation.", "evidence_score": 0.88, "sources": [{"title": "The Fabric of the Human Body", "author": "Daniel Garrison", "publication": "Karger", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}]}]},

    {"slug": "kepler-planetary-laws-1609", "title": "Kepler's Laws of Planetary Motion", "year": 1609, "lat": 49.6, "lng": 17.25, "geo_modern": "Prague (Bohemia), Czech Republic", "geo_era_label": "Scientific Revolution", "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "perspectives": [{"label": "History of astronomy perspective", "culture_code": "de", "viewpoint_type": "academic", "narrative": "Johannes Kepler, using Tycho Brahe's meticulous naked-eye observations, derived three laws of planetary motion (published 1609-1619): planets move in ellipses with the sun at one focus; a planet sweeps equal areas in equal times; orbital periods are proportional to orbital radii. These laws replaced circular orbits, completing the Copernican revolution mathematically.", "summary": "Kepler's elliptical orbit laws completed the Copernican revolution and provided the mathematical foundation Newton built on.", "evidence_score": 0.95, "sources": [{"title": "Astronomia Nova (New Astronomy)", "author": "Johannes Kepler", "publication": "Vogelin", "source_type": "primary", "reliability_tier": 1, "year": 1609}]}, {"label": "Scientific methodology perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Kepler's achievement illustrates how scientific progress works: he spent 8 years trying to fit Mars's orbit to a circle before accepting the ellipse required by Brahe's data. His willingness to abandon elegant theory when it contradicted observation is a defining moment in the development of scientific empiricism.", "summary": "Kepler's 8-year struggle with Mars's orbit before accepting the ellipse is a landmark in scientific methodology — theory bowing to observation.", "evidence_score": 0.90, "sources": [{"title": "The Sleepwalkers", "author": "Arthur Koestler", "publication": "Hutchinson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1959}]}]},

    {"slug": "harvey-blood-circulation-1628", "title": "William Harvey Discovers Blood Circulation", "year": 1628, "lat": 51.51, "lng": -0.12, "geo_modern": "London, England", "geo_era_label": "Scientific Revolution", "category": "discovery", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "History of medicine perspective", "culture_code": "gb", "viewpoint_type": "academic", "narrative": "William Harvey's 'De Motu Cordis' (1628) demonstrated through experiment that the heart pumps blood in a closed circulatory system — blood travels from the heart through arteries and returns via veins. This disproved Galen's view (1,400+ years old) that blood was produced in the liver and consumed by organs. It was the first major physiological discovery of the Scientific Revolution.", "summary": "Harvey proved blood circulates in a closed loop driven by the heart, overturning 1,400 years of Galenic physiology.", "evidence_score": 0.95, "sources": [{"title": "Exercitatio Anatomica de Motu Cordis et Sanguinis in Animalibus", "author": "William Harvey", "publication": "Fitzer", "source_type": "primary", "reliability_tier": 1, "year": 1628}]}, {"label": "Experimental method perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Harvey's proof used quantitative reasoning: he calculated that the heart pumps more blood per hour than exists in the body — therefore blood must recirculate. This mathematical argument from measurement was revolutionary in medicine and established quantitative physiology as a discipline.", "summary": "Harvey's mathematical proof — calculating the heart pumps more blood per hour than exists in the body — established quantitative physiology.", "evidence_score": 0.92, "sources": [{"title": "William Harvey and the Circulation of the Blood", "author": "Gweneth Whitteridge", "publication": "McDonald", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1971}]}]},

    {"slug": "lavoisier-oxygen-chemistry-1789", "title": "Lavoisier and the Chemical Revolution — Oxygen Discovered", "year": 1789, "lat": 48.85, "lng": 2.35, "geo_modern": "Paris, France", "geo_era_label": "Scientific Revolution / Enlightenment", "category": "discovery", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "History of chemistry perspective", "culture_code": "fr", "viewpoint_type": "academic", "narrative": "Antoine Lavoisier (1743-1794) named oxygen (1778), disproved the phlogiston theory of combustion, demonstrated that water is H₂O, created the first modern chemical nomenclature, and published the first modern chemistry textbook (Traité Élémentaire de Chimie, 1789). He founded modern chemistry — calling it a 'revolution' himself.", "summary": "Lavoisier named oxygen, disproved phlogiston, discovered water's composition, and created modern chemical nomenclature — founding modern chemistry.", "evidence_score": 0.93, "sources": [{"title": "Traité Élémentaire de Chimie", "author": "Antoine Lavoisier", "publication": "Cuchet", "source_type": "primary", "reliability_tier": 1, "year": 1789}]}, {"label": "Revolutionary irony perspective", "culture_code": "fr", "viewpoint_type": "academic", "narrative": "Lavoisier was guillotined on May 8, 1794 by the French Revolution's Terror — a tax farmer who had also served the Ancien Régime. The mathematician Lagrange said 'it took only a moment to cut off that head, but France may not produce another like it in a century.' His execution illustrates the tension between revolutionary politics and scientific progress.", "summary": "Lavoisier was guillotined by the Revolution he celebrated; Lagrange lamented that France might not produce another such mind in a century.", "evidence_score": 0.95, "sources": [{"title": "Lavoisier: Chemist, Biologist, Economist", "author": "Jean-Pierre Poirier", "publication": "University of Pennsylvania Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}]}]},

    {"slug": "jenner-smallpox-vaccination-1796", "title": "Jenner's Smallpox Vaccine — Defeating the Greatest Killer", "year": 1796, "lat": 51.74, "lng": -2.35, "geo_modern": "Berkeley, Gloucestershire, England", "geo_era_label": "Scientific Revolution", "category": "discovery", "importance_score": 0.90, "zoom_min": 3, "perspectives": [{"label": "History of medicine perspective", "culture_code": "gb", "viewpoint_type": "academic", "narrative": "Edward Jenner inoculated 8-year-old James Phipps with cowpox (May 14, 1796) and demonstrated it protected against smallpox — inventing vaccination (from 'vacca', Latin for cow). Smallpox killed 400,000 Europeans annually; globally it killed 300-500 million in the 20th century before eradication in 1980. Vaccination was arguably history's greatest public health intervention.", "summary": "Jenner's cowpox vaccination invented immunization — leading to the 1980 eradication of smallpox, history's greatest public health achievement.", "evidence_score": 0.95, "sources": [{"title": "An Inquiry into the Causes and Effects of the Variolae Vaccinae", "author": "Edward Jenner", "publication": "Sampson Low", "source_type": "primary", "reliability_tier": 1, "year": 1798}]}, {"label": "Global public health perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Smallpox eradication (1980), achieved through a WHO campaign based on Jenner's vaccine, is the only human disease ever deliberately eliminated. The eradication campaign required global cooperation during the Cold War — Soviet and American health officials working together when their governments could not. It saved an estimated 5 million lives per year.", "summary": "Smallpox eradication required Cold War cooperation between Soviet and American scientists — and saves 5 million lives every year.", "evidence_score": 0.95, "sources": [{"title": "Smallpox: The Death of a Disease", "author": "D.A. Henderson", "publication": "Prometheus Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]}]},

    {"slug": "pasteur-germ-theory-1862", "title": "Pasteur Proves Germ Theory — Microbiology Founded", "year": 1862, "lat": 48.85, "lng": 2.35, "geo_modern": "Paris, France", "geo_era_label": "Victorian Science", "category": "discovery", "importance_score": 0.88, "zoom_min": 3, "perspectives": [{"label": "History of medicine perspective", "culture_code": "fr", "viewpoint_type": "academic", "narrative": "Louis Pasteur's swan-neck flask experiment (1859-1861) disproved spontaneous generation and established that microorganisms cause fermentation and disease. His subsequent work on anthrax vaccine (1881), rabies vaccine (1885), and pasteurization transformed medicine. Along with Robert Koch, he founded germ theory — the basis of all modern infectious disease medicine.", "summary": "Pasteur disproved spontaneous generation, established germ theory, and developed vaccines for anthrax and rabies — founding modern microbiology.", "evidence_score": 0.95, "sources": [{"title": "Germ Theory and its Applications to Medicine and Surgery", "author": "Louis Pasteur", "publication": "Comptes rendus de l'Académie des sciences", "source_type": "primary", "reliability_tier": 1, "year": 1878}]}, {"label": "Social medicine perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Pasteur's germ theory triumph came at the cost of the competing 'miasma' theory and earlier work by Semmelweis (who proved hand-washing prevented childbed fever in 1847 but was ignored until after his death). The history of germ theory shows that correct medical ideas can be resisted for decades when they challenge professional identity.", "summary": "Semmelweis proved hand-washing saved lives 14 years before Pasteur but died ignored — showing how medical consensus can resist correct ideas.", "evidence_score": 0.88, "sources": [{"title": "The Germ Theory of Disease", "author": "F.F. Cartwright", "publication": "History of Medicine", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1972}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # COLD WAR SPECIFICS
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "hungarian-revolution-1956", "title": "Hungarian Revolution — Crushed by Soviet Tanks", "year": 1956, "lat": 47.5, "lng": 19.04, "geo_modern": "Budapest, Hungary", "geo_era_label": "Cold War Eastern Europe", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Hungarian nationalist perspective", "culture_code": "hu", "viewpoint_type": "nationalist", "narrative": "The Hungarian Revolution (October 23 - November 10, 1956) began as student protests demanding free elections and Soviet troop withdrawal. Within days a genuine national uprising — including defecting Hungarian soldiers — overthrew the communist government and installed reformer Imre Nagy. Soviet tanks rolled into Budapest on November 4, killing 2,500 Hungarians, forcing 200,000 to flee.", "summary": "Budapest's spontaneous anti-Soviet revolution — crushed by tanks in 13 days — killed 2,500 Hungarians and drove 200,000 into exile.", "evidence_score": 0.90, "sources": [{"title": "Hungary 1956", "author": "Bill Lomax", "publication": "Allison & Busby", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1976}]}, {"label": "Western Cold War perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "Western governments — despite Radio Free Europe's encouragement of Hungarian resistance — did nothing to help. The Suez Crisis unfolded simultaneously, dividing Western attention. Hungary exposed the limits of 'rollback' rhetoric: the US was not prepared to risk nuclear war to liberate Soviet satellites, establishing the de facto division of Europe as permanent.", "summary": "Western inaction during Hungary's crushing exposed 'rollback' as empty rhetoric — the Iron Curtain would stand for another 33 years.", "evidence_score": 0.87, "sources": [{"title": "Cold War: A History", "author": "Martin Walker", "publication": "Henry Holt", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1993}]}]},

    {"slug": "bay-of-pigs-invasion-1961", "title": "Bay of Pigs Invasion — CIA's Cuba Disaster", "year": 1961, "lat": 22.07, "lng": -81.14, "geo_modern": "Bahía de Cochinos, Cuba", "geo_era_label": "Cold War", "category": "war", "importance_score": 0.82, "zoom_min": 3, "perspectives": [{"label": "American Cold War perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The CIA's April 1961 invasion of Cuba — 1,400 Cuban exiles trained and funded by the US — was a catastrophic failure. Planned under Eisenhower and approved by Kennedy, the operation was premised on popular uprising that never came. 1,189 invaders were captured; Kennedy accepted public responsibility. The humiliation directly contributed to the Cuban Missile Crisis 18 months later.", "summary": "The CIA-trained invasion failed catastrophically when the expected popular uprising didn't happen; Kennedy's humiliation led directly to the Missile Crisis.", "evidence_score": 0.92, "sources": [{"title": "The Perfect Failure: Kennedy, Eisenhower, and the CIA at the Bay of Pigs", "author": "Trumbull Higgins", "publication": "Norton", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1987}]}, {"label": "Cuban perspective", "culture_code": "cu", "viewpoint_type": "nationalist", "narrative": "For Cuba, defeating the CIA-backed invasion at Playa Girón (Bay of Pigs) was the ultimate vindication of the revolution — a small nation repelling a superpower's aggression within 72 hours. It is celebrated annually in Cuba. Paradoxically, the failure pushed Kennedy to both seek negotiation and secretly plan additional assassination and sabotage operations against Castro.", "summary": "Cuba's 72-hour victory became the revolution's defining triumph; paradoxically it drove Kennedy to both negotiate and plot further operations.", "evidence_score": 0.88, "sources": [{"title": "Playa Giron / Bay of Pigs: Washington's First Military Defeat in the Americas", "author": "Fidel Castro", "publication": "Pathfinder Press", "source_type": "primary", "reliability_tier": 3, "year": 2001}]}]},

    {"slug": "berlin-wall-construction-1961", "title": "Berlin Wall Built — The Iron Curtain Becomes Concrete", "year": 1961, "lat": 52.52, "lng": 13.38, "geo_modern": "Berlin, Germany", "geo_era_label": "Cold War Berlin", "category": "political", "importance_score": 0.85, "zoom_min": 3, "perspectives": [{"label": "East German/Soviet justification", "culture_code": "de", "viewpoint_type": "government", "narrative": "East Germany called the Berlin Wall the 'Anti-Fascist Protection Rampart,' erected on August 13, 1961 to stop the brain drain of 2.7 million skilled East Germans who had fled to the West since 1949. The GDR framed it as protection against Western saboteurs and economic warfare.", "summary": "East Germany framed the Wall as anti-fascist protection against economic warfare; it was actually built to stop 2.7 million from fleeing.", "evidence_score": 0.85, "sources": [{"title": "The Berlin Wall: A World Divided, 1961-1989", "author": "Frederick Taylor", "publication": "HarperCollins", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2006}]}, {"label": "West German and human rights perspective", "culture_code": "de", "viewpoint_type": "civilian", "narrative": "For 28 years the Wall killed at least 139 people attempting to cross — shot, mined, drowned. JFK's 'Ich bin ein Berliner' speech (1963) made it the Cold War's most potent symbol. Its fall on November 9, 1989 was one of history's most joyful moments — its construction the most chilling. The Wall demonstrated that communist regimes could only survive by imprisoning their populations.", "summary": "The Wall killed 139+ escape attempts over 28 years; its 1989 fall was Cold War's most joyful moment after its construction was its most chilling.", "evidence_score": 0.92, "sources": [{"title": "The Wall: The People's Story", "author": "Christopher Hilton", "publication": "History Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2001}]}]},

    {"slug": "nuclear-test-ban-treaty-1963", "title": "Partial Nuclear Test Ban Treaty — First Arms Control", "year": 1963, "lat": 38.9, "lng": -77.04, "geo_modern": "Washington D.C. / Moscow", "geo_era_label": "Cold War", "category": "political", "importance_score": 0.78, "zoom_min": 2, "perspectives": [{"label": "American diplomatic perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The Partial Nuclear Test Ban Treaty (August 5, 1963) — signed by the US, USSR, and UK after the Cuban Missile Crisis scare — banned atmospheric, underwater, and space nuclear tests. It was the first arms control agreement of the nuclear age, driven by public fear of radioactive fallout contaminating food supplies and causing cancer.", "summary": "The first nuclear arms control agreement banned atmospheric tests after Cuban Missile Crisis public fear of radioactive fallout proved politically powerful.", "evidence_score": 0.90, "sources": [{"title": "Partial Nuclear Test Ban Treaty (text)", "source_type": "primary", "reliability_tier": 1, "year": 1963}]}, {"label": "Disarmament movement perspective", "culture_code": "global", "viewpoint_type": "political", "narrative": "The Test Ban Treaty was a victory for the anti-nuclear movement — SANE, the Campaign for Nuclear Disarmament, and Linus Pauling's petition signed by 11,000 scientists. Pauling won the 1962 Nobel Peace Prize partly for this campaign. The treaty proved public pressure could change nuclear policy, inspiring subsequent arms control efforts.", "summary": "The treaty was a victory for Pauling's 11,000-scientist petition and proved public pressure could shift nuclear policy.", "evidence_score": 0.85, "sources": [{"title": "No More War!", "author": "Linus Pauling", "publication": "Dodd, Mead", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1958}]}]},

    {"slug": "helsinki-accords-1975", "title": "Helsinki Accords — Human Rights Enter Cold War Diplomacy", "year": 1975, "lat": 60.17, "lng": 24.94, "geo_modern": "Helsinki, Finland", "geo_era_label": "Cold War Détente", "category": "political", "importance_score": 0.80, "zoom_min": 2, "perspectives": [{"label": "Détente diplomatic perspective", "culture_code": "us", "viewpoint_type": "government", "narrative": "The Helsinki Final Act (August 1, 1975), signed by 35 nations including all NATO and Warsaw Pact states, ratified Europe's post-WWII borders in exchange for Soviet agreement to include human rights protections (Basket III). Western conservatives criticized it as legitimizing Soviet dominance; it turned out to be a Trojan horse that Soviet dissidents used against their governments.", "summary": "The Helsinki Accords traded recognition of Soviet borders for human rights commitments that dissidents used as legal tools against communist regimes.", "evidence_score": 0.88, "sources": [{"title": "Helsinki, Human Rights and European Security", "author": "Daniel Thomas", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}]}, {"label": "Dissident and civil society perspective", "culture_code": "ru", "viewpoint_type": "political", "narrative": "Helsinki Watch Groups (later Human Rights Watch) formed in the USSR and Eastern Europe to monitor compliance with Helsinki's human rights commitments. Dissidents like Andrei Sakharov and Václav Havel used Helsinki Basket III as a legal framework to challenge communist governments. The Helsinki process, more than any western pressure, nurtured the civil society that peacefully ended communism.", "summary": "Dissidents formed Helsinki Watch groups that became Human Rights Watch — monitoring compliance that peacefully built civil society against communism.", "evidence_score": 0.88, "sources": [{"title": "The Power of the Powerless", "author": "Václav Havel", "publication": "Palach Press", "source_type": "primary", "reliability_tier": 1, "year": 1978}]}]},

    {"slug": "velvet-revolution-czechoslovakia-1989", "title": "Velvet Revolution — Czechoslovakia's Peaceful End to Communism", "year": 1989, "lat": 50.08, "lng": 14.43, "geo_modern": "Prague, Czechoslovakia", "geo_era_label": "Late Cold War", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Czech democratic tradition", "culture_code": "cz", "viewpoint_type": "nationalist", "narrative": "The Velvet Revolution (November 17 - December 29, 1989) overthrew Czechoslovakia's communist government without a single death. Student protests escalated to general strikes; Václav Havel — a playwright and dissident — became president within 6 weeks. The nonviolent transition, called 'Gentle Revolution' in Slovakia, showed peaceful democratic change was possible.", "summary": "Czechoslovakia's communist government fell in 6 weeks without a death — playwright-dissident Havel became president in history's most graceful revolution.", "evidence_score": 0.92, "sources": [{"title": "Summer Meditations", "author": "Václav Havel", "publication": "Knopf", "source_type": "primary", "reliability_tier": 2, "year": 1992}]}, {"label": "Comparative 1989 revolutions perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "1989 was an extraordinary year: Romania, Bulgaria, East Germany, Hungary, and Poland also threw off communism. Only Romania's was violent. The common thread was Gorbachev's announcement that the Brezhnev Doctrine was dead — Soviet tanks would not intervene. Once people knew Moscow wouldn't act, the fear that sustained communist authority dissolved.", "summary": "All 1989 Eastern European revolutions succeeded once Gorbachev announced Soviet tanks wouldn't intervene — fear was the only thing sustaining communist power.", "evidence_score": 0.90, "sources": [{"title": "1989: The Struggle to Create Post-Cold War Europe", "author": "Mary Sarotte", "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]}]},

    {"slug": "iran-iraq-war-1980", "title": "Iran-Iraq War — The Gulf's Longest Modern War", "year": 1980, "lat": 32.0, "lng": 46.5, "geo_modern": "Iran-Iraq border", "geo_era_label": "Cold War Middle East", "category": "war", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Iraqi Baathist perspective", "culture_code": "iq", "viewpoint_type": "government", "narrative": "Saddam Hussein invaded Iran (September 22, 1980) seeking to exploit Iran's post-revolutionary chaos, seize oil-rich Khuzestan, and assert Iraqi hegemony in the Gulf. The US, Gulf states, France, and the USSR all supported Iraq with intelligence, arms, and financing. Iraq used chemical weapons extensively — with Western complicity — killing 50,000+ Iranians.", "summary": "Saddam invaded Iran with US, Gulf, and Soviet support; Western nations knowingly supplied Iraq's chemical weapons that killed 50,000+ Iranians.", "evidence_score": 0.85, "sources": [{"title": "The Iran-Iraq War", "author": "Pierre Razoux", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2015}]}, {"label": "Iranian perspective", "culture_code": "ir", "viewpoint_type": "nationalist", "narrative": "For Iran, the 8-year war (1980-1988) was a 'Imposed War' — Iraqi aggression backed by the entire international community. A million Iranians died; teenage 'basij' volunteers walked through minefields. The war consolidated the Islamic Republic and created the martyrdom culture that defines Iranian political culture today.", "summary": "Iran's million dead and teenage minefield walkers created the martyrdom culture that defines the Islamic Republic's political identity.", "evidence_score": 0.83, "sources": [{"title": "Sacred Defense Encyclopedia", "publication": "Iranian Ministry of Defense", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 2008}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # DECOLONIZATION MOVEMENTS
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "bandung-conference-1955", "title": "Bandung Conference — Birth of the Non-Aligned Movement", "year": 1955, "lat": -6.91, "lng": 107.61, "geo_modern": "Bandung, Indonesia", "geo_era_label": "Decolonization Era", "category": "political", "importance_score": 0.82, "zoom_min": 2, "perspectives": [{"label": "Afro-Asian solidarity perspective", "culture_code": "id", "viewpoint_type": "political", "narrative": "The Bandung Conference (April 18-24, 1955) brought together 29 African and Asian nations representing 1.5 billion people — half of humanity — who rejected Cold War alignment. Led by Nehru (India), Sukarno (Indonesia), Nasser (Egypt), and Zhou Enlai (China), it proclaimed non-alignment, anti-colonialism, and the 'Bandung Spirit' of Afro-Asian solidarity.", "summary": "Bandung gathered half of humanity's nations in 1955 to reject Cold War alignment and proclaim Afro-Asian solidarity — birth of the Global South.", "evidence_score": 0.88, "sources": [{"title": "The Bandung Conference and the Making of the Non-Aligned Movement", "author": "Christopher Lee", "publication": "Zed Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}]}, {"label": "Cold War geopolitical analysis", "culture_code": "us", "viewpoint_type": "government", "narrative": "The US and Soviet Union both tried to court Bandung's participants. Non-alignment was never perfectly neutral — most states leaned toward one bloc's aid while criticizing the other's imperialism. But Bandung created the G77, the Non-Aligned Movement, and a 'Third World' political identity that constrained superpower behavior in international institutions.", "summary": "Non-alignment was imperfect neutrality but created the G77 and Third World political identity that constrained superpower behavior at the UN.", "evidence_score": 0.82, "sources": [{"title": "The Dark Side of Progress", "author": "James Burke", "publication": "Little, Brown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1996}]}]},

    {"slug": "indonesian-independence-1945", "title": "Indonesian Independence — Sukarno Proclaims the Republic", "year": 1945, "lat": -6.21, "lng": 106.85, "geo_modern": "Jakarta (Batavia), Indonesia", "geo_era_label": "Indonesian Revolution", "category": "political", "importance_score": 0.80, "zoom_min": 3, "perspectives": [{"label": "Indonesian nationalist tradition", "culture_code": "id", "viewpoint_type": "nationalist", "narrative": "Sukarno proclaimed Indonesian independence on August 17, 1945 — two days after Japan's surrender — ending 350 years of Dutch colonialism. The Dutch refused to accept this, launching two 'police actions' (1947, 1948) before international pressure (US aid cutoff threat) forced recognition of Indonesian sovereignty in December 1949.", "summary": "Sukarno proclaimed independence on August 17, 1945 but needed 4 more years of war and US pressure to force Dutch recognition.", "evidence_score": 0.88, "sources": [{"title": "Sukarno: An Autobiography", "author": "Cindy Adams", "publication": "Bobbs-Merrill", "source_type": "primary", "reliability_tier": 2, "year": 1965}]}, {"label": "Dutch colonial perspective", "culture_code": "nl", "viewpoint_type": "government", "narrative": "The Dutch 'policing actions' against Indonesia were opposed by international opinion, US economic pressure, and within the Netherlands itself. Dutch officers committed systematic atrocities documented in a 2022 Dutch state report that acknowledged 'extreme violence' including extrajudicial executions, torture, and collective punishment — the largest reckoning with colonial violence in Dutch history.", "summary": "A 2022 Dutch state report acknowledged systematic torture and extrajudicial executions during the 'police actions' — the largest Dutch colonial reckoning.", "evidence_score": 0.88, "sources": [{"title": "Final Report on Dutch Military Actions 1945-1950", "publication": "NIOD/NIMH/KITLV", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2022}]}]},

    {"slug": "zimbabwe-independence-mugabe-1980", "title": "Zimbabwe Independence — End of White Minority Rule in Rhodesia", "year": 1980, "lat": -17.83, "lng": 31.05, "geo_modern": "Harare (Salisbury), Zimbabwe", "geo_era_label": "African Decolonization", "category": "political", "importance_score": 0.78, "zoom_min": 3, "perspectives": [{"label": "African liberation perspective", "culture_code": "zw", "viewpoint_type": "nationalist", "narrative": "Zimbabwe's independence (April 18, 1980) ended 15 years of Rhodesian UDI (Unilateral Declaration of Independence) under Ian Smith's white minority government and the bush war (1965-1979) that killed 20,000+ people. Robert Mugabe's ZANU-PF won democratic elections under British-supervised Lancaster House Agreement. Zimbabwe became the last southern African state to achieve majority rule.", "summary": "Zimbabwe's independence ended 90 years of white minority rule and was the last southern African majority-rule victory — though Mugabe's promise would curdle.", "evidence_score": 0.88, "sources": [{"title": "Mugabe: Power, Plunder, and the Struggle for Zimbabwe", "author": "Martin Meredith", "publication": "Public Affairs", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]}, {"label": "Post-independence tragedy perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Zimbabwe in 1980 had one of Africa's most developed economies, best education systems, and most productive agriculture. By 2008, Mugabe's Gukurahundi massacres (20,000 Ndebele killed in 1983-84), land seizures, and economic mismanagement produced 89.7 sextillion percent inflation — the worst hyperinflation in history after Hungary 1946.", "summary": "Zimbabwe went from Africa's most developed economy in 1980 to 89.7 sextillion percent inflation by 2008 — a warning about post-liberation governance.", "evidence_score": 0.85, "sources": [{"title": "Our Votes, Our Guns", "author": "Martin Meredith", "publication": "Public Affairs", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # CHINESE HISTORY EXPANSION
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "ming-dynasty-founding-1368", "title": "Ming Dynasty Founded — China Expels the Mongols", "year": 1368, "lat": 32.06, "lng": 118.78, "geo_modern": "Nanjing, China", "geo_era_label": "Ming Dynasty China", "category": "political", "importance_score": 0.80, "zoom_min": 2, "perspectives": [{"label": "Chinese dynastic tradition", "culture_code": "cn", "viewpoint_type": "nationalist", "narrative": "Zhu Yuanzhang (Hongwu Emperor), a peasant orphan turned rebel leader, overthrew the Mongol Yuan dynasty and founded the Ming in 1368. The Mings constructed the Great Wall in its current form, moved the capital to Beijing (building the Forbidden City 1406-1420), restored Confucian examination system, and initially pursued naval exploration before embracing isolationism.", "summary": "A peasant founded the Ming dynasty that built the Great Wall, the Forbidden City, and briefly launched the greatest naval expeditions in history.", "evidence_score": 0.88, "sources": [{"title": "The Ming Dynasty", "author": "Edward Dreyer", "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1982}]}, {"label": "Historical counterfactual perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Ming decision to abandon Zheng He's vast treasure fleet voyages after 1433 is one of history's great 'what ifs.' China had the most advanced naval technology in the world — if it had continued, China rather than Portugal/Spain might have dominated global trade. Instead, inward-looking Ming policies left the seas to Europeans.", "summary": "China's abandonment of Zheng He's treasure fleets left the world's oceans to Portugal and Spain — one of history's most consequential strategic retreats.", "evidence_score": 0.82, "sources": [{"title": "1421: The Year China Discovered the World", "author": "Gavin Menzies", "publication": "Morrow", "source_type": "secondary", "reliability_tier": 3, "peer_reviewed": False, "year": 2002}]}]},

    {"slug": "zheng-he-voyages-1405", "title": "Zheng He's Treasure Fleet Voyages — China's Lost Age of Exploration", "year": 1405, "lat": 31.23, "lng": 121.47, "geo_modern": "Nanjing, China", "geo_era_label": "Ming Dynasty China", "category": "discovery", "importance_score": 0.85, "zoom_min": 1, "perspectives": [{"label": "Chinese exploration tradition", "culture_code": "cn", "viewpoint_type": "nationalist", "narrative": "Admiral Zheng He led seven enormous naval expeditions (1405-1433) across Southeast Asia, India, Arabia, and the East African coast. His flagship was 400+ feet long — five times Columbus's Santa María. He commanded fleets of 200+ ships and 27,000 sailors. His voyages established Chinese diplomatic networks and trade relations across the Indian Ocean world.", "summary": "Zheng He commanded fleets of 200 ships and 27,000 men — five times Columbus's scale — establishing Chinese trade networks from India to Africa.", "evidence_score": 0.87, "sources": [{"title": "Treatise on the Barbarian Countries (Yingya Shenglan)", "author": "Ma Huan", "source_type": "primary", "reliability_tier": 2, "year": 1433}]}, {"label": "Comparative exploration perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "Zheng He's voyages were not motivated by conquest or colonization — unlike Portuguese and Spanish exploration — but by diplomacy, trade, and tribute collection. China's subsequent inward turn was driven by Confucian opposition to maritime trade as 'unbecoming,' fiscal concerns, and the threat of Mongol revival in the north that demanded continental military focus.", "summary": "Unlike European colonialism, Zheng He's voyages were diplomatic, not conquering; China's withdrawal was driven by Confucian conservatism and northern defense needs.", "evidence_score": 0.83, "sources": [{"title": "Zheng He: China and the Oceans in the Early Ming Dynasty", "author": "Edward Dreyer", "publication": "Pearson Longman", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}]}]},

    {"slug": "cultural-revolution-china-1966", "title": "China's Cultural Revolution — Mao's Catastrophic Purge", "year": 1966, "lat": 39.91, "lng": 116.39, "geo_modern": "Beijing, China", "geo_era_label": "People's Republic of China", "category": "political", "importance_score": 0.83, "zoom_min": 3, "perspectives": [{"label": "Official Chinese Communist party retrospective", "culture_code": "cn", "viewpoint_type": "government", "narrative": "Mao Zedong launched the Cultural Revolution in May 1966 to reassert his authority after the Great Leap Forward's failures, purge capitalist roaders, and create a new revolutionary culture. Red Guards destroyed temples, books, and cultural artifacts; intellectuals, teachers, and party officials were persecuted. The Party officially declared it a 'grave error' in 1981.", "summary": "Mao launched the Cultural Revolution to reassert control after Great Leap famine failures; the Party officially called it a 'grave error' in 1981.", "evidence_score": 0.85, "sources": [{"title": "Resolution on Certain Questions in the History of our Party Since the Founding of the PRC", "publication": "Communist Party of China", "source_type": "primary", "reliability_tier": 2, "year": 1981}]}, {"label": "Survivor and human rights perspective", "culture_code": "cn", "viewpoint_type": "civilian", "narrative": "Scholars estimate 500,000 to 2 million died violently during the Cultural Revolution, with 1-2 million more dying in prison or labor camps. Countless irreplaceable cultural artifacts were destroyed. 16 million 'sent down' urban youth lost their education. The scale of cultural destruction was analogous to Europe's 30 Years' War — yet remains officially suppressed in China.", "summary": "Up to 2 million died, 16 million lost education, and irreplaceable cultural artifacts were destroyed — a 30 Years' War-scale catastrophe still suppressed in China.", "evidence_score": 0.83, "sources": [{"title": "Mao's Last Revolution", "author": "Roderick MacFarquhar", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2006}]}]},

    {"slug": "taiping-rebellion-china-1850", "title": "Taiping Rebellion — Deadliest Civil War in History", "year": 1850, "lat": 25.06, "lng": 110.3, "geo_modern": "Guangxi Province / Nanjing, China", "geo_era_label": "Qing Dynasty China", "category": "war", "importance_score": 0.83, "zoom_min": 2, "perspectives": [{"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic", "narrative": "The Taiping Heavenly Kingdom (1850-1864), led by Hong Xiuquan (who believed himself Jesus's brother), was a millenarian Christian rebellion that conquered southeastern China including Nanjing. The Qing government, with Western assistance (the 'Ever Victorious Army'), suppressed it at a cost of 20-30 million dead — making it the deadliest civil war in world history.", "summary": "The Taiping Rebellion killed 20-30 million people — the deadliest civil war in history — led by a man who believed himself Jesus's brother.", "evidence_score": 0.83, "sources": [{"title": "God's Chinese Son", "author": "Jonathan Spence", "publication": "Norton", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}]}, {"label": "Western intervention perspective", "culture_code": "gb", "viewpoint_type": "government", "narrative": "British and French intervention on the Qing side to suppress the Taipings was driven by commercial interests — the rebels disrupted Shanghai trade — not ideology. Frederick Ward and later Charles Gordon ('Chinese Gordon') commanded the Ever Victorious Army. The Taiping rebellion mortally weakened the Qing dynasty, setting it on the path to its 1912 collapse.", "summary": "Britain and France supported the Qing against the Taipings to protect Shanghai trade — the rebellion mortally wounded the Qing dynasty that collapsed in 1912.", "evidence_score": 0.82, "sources": [{"title": "The Taiping Rebellion: History and Documents", "author": "Franz Michael", "publication": "University of Washington Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1966}]}]},

    # ═══════════════════════════════════════════════════════════════════════
    # MORE WORLD HISTORY GAPS
    # ═══════════════════════════════════════════════════════════════════════

    {"slug": "communist-manifesto-1848", "title": "The Communist Manifesto — Marx and Engels' Revolutionary Vision", "year": 1848, "lat": 51.51, "lng": -0.12, "geo_modern": "London, England", "geo_era_label": "Victorian Britain", "category": "cultural", "importance_score": 0.88, "zoom_min": 2, "perspectives": [{"label": "Marxist revolutionary tradition", "culture_code": "de", "viewpoint_type": "political", "narrative": "Karl Marx and Friedrich Engels published 'The Communist Manifesto' in February 1848 — days before the European revolutions broke out — as a program for the Communist League. Its opening line ('A spectre is haunting Europe') and closing call ('Workers of the world, unite!') became the most influential political text of the 19th-20th centuries, inspiring revolutions on every continent.", "summary": "Published weeks before Europe's 1848 revolutions, the Manifesto became the most influential political text of the next 150 years.", "evidence_score": 0.95, "sources": [{"title": "Manifest der Kommunistischen Partei", "author": "Karl Marx and Friedrich Engels", "source_type": "primary", "reliability_tier": 1, "year": 1848}]}, {"label": "Liberal and critical perspective", "culture_code": "global", "viewpoint_type": "academic", "narrative": "The Communist Manifesto's diagnosis of capitalism's contradictions and inequalities proved prescient; its proposed solutions led to catastrophic failures in the Soviet Union, China, and elsewhere. Over 100 million died in the name of communist ideology in the 20th century. The text's enduring influence lies in its critique of capitalism, not its prescription for communism.", "summary": "The Manifesto's critique of capitalism proved prescient; its communist prescriptions led to 100 million deaths in the 20th century.", "evidence_score": 0.80, "sources": [{"title": "The Black Book of Communism", "author": "Stéphane Courtois", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1999}]}]},

    {'slug': 'revolutions-of-1848-europe', 'title': 'Revolutions of 1848 — The Springtime of Nations', 'year': 1848, 'lat': 48.21, 'lng': 16.37, 'geo_modern': 'Paris / Vienna / Berlin', 'geo_era_label': 'Post-Napoleonic Europe', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 2, 'perspectives': [{'label': 'Liberal nationalist tradition', 'culture_code': 'eu', 'viewpoint_type': 'political', 'narrative': '1848 saw revolutions erupt simultaneously across France, German states, Austria, Hungary, Italy, and Poland — the first truly pan-European revolutionary wave. Liberals demanded constitutions; nationalists demanded self-determination. Revolutionary regimes lasted months before conservative counterattack. Despite failure, 1848 established mass politics, national self-determination, and constitutional government as permanent demands.', 'summary': "1848's simultaneous revolutions across all Europe established mass politics and national self-determination as permanent demands even after conservative restoration.", 'evidence_score': 0.88, 'sources': [{'title': 'The Revolutions of 1848: A Social History', 'author': 'Priscilla Robertson', 'publication': 'Princeton University Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1952}]}, {'label': 'Conservative retrospective', 'culture_code': 'at', 'viewpoint_type': 'government', 'narrative': "Metternich's system was swept away by 1848 but restored by 1850 as conservatives exploited liberal divisions, peasant conservatism, and nationalism's own contradictions (Czechs vs. Germans vs. Hungarians all claiming the same territory). Yet the Habsburgs granted a constitution, the French Second Republic enshrined universal male suffrage, and serfdom was abolished across Central Europe.", 'summary': 'Conservative restoration after 1848 was real but partial — serfdom was abolished, constitutions granted, and universal male suffrage established in France.', 'evidence_score': 0.83, 'sources': [{'title': 'The Habsburg Monarchy', 'author': 'A.J.P. Taylor', 'publication': 'Hamish Hamilton', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1948}]}]},
    {'slug': 'irish-great-famine-1845', 'title': 'Irish Great Famine — One Million Dead, One Million Emigrated', 'year': 1845, 'lat': 53.33, 'lng': -8.0, 'geo_modern': 'Ireland (Connacht / Munster)', 'geo_era_label': 'British Ireland', 'category': 'natural', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Irish nationalist perspective', 'culture_code': 'ie', 'viewpoint_type': 'nationalist', 'narrative': "The Great Famine (1845-1852), caused by potato blight (Phytophthora infestans), killed 1 million and forced 1 million more to emigrate — reducing Ireland's population by 25%. Irish nationalists blamed British policy: food exports continued from Ireland throughout the famine, and British 'relief' was deliberately inadequate. The famine is seared into Irish historical identity as a defining grievance.", 'summary': "One million Irish died while food was exported from Ireland; British inaction created Ireland's defining historical grievance and the Irish-American diaspora.", 'evidence_score': 0.87, 'sources': [{'title': 'The Great Irish Famine', 'author': 'Cormac Ó Gráda', 'publication': 'Cambridge University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1999}]}, {'label': 'British political and revisionist perspective', 'culture_code': 'gb', 'viewpoint_type': 'government', 'narrative': "The British government's response combined ideological hostility to intervention (laissez-faire economics) with genuine aid efforts that were inadequate to the disaster's scale. Revisionist historians reject the 'genocide' framing — intentional mass killing requires intent — while acknowledging catastrophic policy failure and indifference. The famine created the Irish-American diaspora that shaped US politics for generations.", 'summary': "Britain's laissez-faire ideology caused catastrophic inaction; the resulting Irish-American diaspora shaped US politics for 150 years.", 'evidence_score': 0.82, 'sources': [{'title': 'The Famine in Ireland', 'author': 'Mary Daly', 'publication': 'Dundalk Historical Association', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1986}]}]},
    {'slug': 'emancipation-proclamation-1863', 'title': 'Emancipation Proclamation — Lincoln Frees the Enslaved', 'year': 1863, 'lat': 38.9, 'lng': -77.04, 'geo_modern': 'Washington D.C., USA', 'geo_era_label': 'American Civil War', 'category': 'political', 'importance_score': 0.88, 'zoom_min': 3, 'perspectives': [{'label': 'American freedom narrative', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "Lincoln's Emancipation Proclamation (January 1, 1863) declared enslaved people in rebel states 'forever free,' transforming the Civil War from a war to preserve the Union into a war for human freedom. It allowed 180,000 Black men to join the Union Army and discouraged European recognition of the Confederacy.", 'summary': 'The Proclamation transformed the Civil War into a freedom war, enabled 180,000 Black soldiers to fight, and blocked European recognition of the Confederacy.', 'evidence_score': 0.93, 'sources': [{'title': 'Emancipation Proclamation', 'author': 'Abraham Lincoln', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1863}]}, {'label': 'Black American and abolitionist perspective', 'culture_code': 'us', 'viewpoint_type': 'civilian', 'narrative': "Frederick Douglass called January 1, 1863 a 'day for songs and exultations.' But the Proclamation was limited — it applied only to Confederate states, not border states still in the Union. True legal freedom required the 13th Amendment (December 1865). The broken promises of Reconstruction (1865-1877) meant that legal freedom did not translate into genuine equality for another century.", 'summary': 'The Proclamation was limited and incomplete; broken Reconstruction promises meant Black Americans waited a century for genuine equality.', 'evidence_score': 0.92, 'sources': [{'title': 'Narrative of the Life of Frederick Douglass', 'author': 'Frederick Douglass', 'publication': 'Anti-Slavery Office', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1845}]}]},
    {'slug': 'wright-brothers-first-flight-1903', 'title': 'Wright Brothers First Powered Flight — Age of Aviation Begins', 'year': 1903, 'lat': 36.0, 'lng': -75.67, 'geo_modern': 'Kitty Hawk, North Carolina, USA', 'geo_era_label': 'Progressive Era USA', 'category': 'discovery', 'importance_score': 0.88, 'zoom_min': 3, 'perspectives': [{'label': 'American innovation narrative', 'culture_code': 'us', 'viewpoint_type': 'academic', 'narrative': 'Orville and Wilbur Wright achieved the first sustained powered heavier-than-air flight at Kill Devil Hills, Kitty Hawk, on December 17, 1903 — Orville flew 12 seconds, 120 feet. They were bicycle mechanics who applied engineering intuition and systematic experimentation to solve a problem that had defeated governments and wealthy inventors.', 'summary': 'Two bicycle mechanics beat governments and wealthy investors to powered flight through systematic engineering experimentation.', 'evidence_score': 0.97, 'sources': [{'title': "Orville Wright's Diary, December 17, 1903", 'author': 'Orville Wright', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1903}]}, {'label': 'Global impact perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': 'In 1903, the longest Wright flight covered 852 feet in 59 seconds. By 1969, humans were walking on the Moon. Aviation compressed distances, enabled global trade, made WWI, WWII, and Cold War strategy possible, and created mass tourism. No 66-year period in human history saw comparable transformation of physical mobility.', 'summary': 'From 852 feet in 1903 to the Moon in 1969 — 66 years of aviation compressed the globe and transformed war, trade, and human mobility.', 'evidence_score': 0.95, 'sources': [{'title': 'The Wright Brothers', 'author': 'David McCullough', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 2015}]}]},
    {'slug': 'einstein-special-relativity-1905', 'title': "Einstein's Annus Mirabilis — Special Relativity and E=mc²", 'year': 1905, 'lat': 46.95, 'lng': 7.45, 'geo_modern': 'Bern, Switzerland', 'geo_era_label': 'Pre-WWI Europe', 'category': 'discovery', 'importance_score': 0.9, 'zoom_min': 2, 'perspectives': [{'label': 'Physics history perspective', 'culture_code': 'de', 'viewpoint_type': 'academic', 'narrative': 'In 1905 — working as a patent clerk — Albert Einstein published four papers that transformed physics: special relativity (space and time are relative); E=mc² (mass-energy equivalence); the photoelectric effect (founding quantum theory); and Brownian motion (proving atoms exist). No other year in scientific history saw comparable contribution by a single person.', 'summary': "Einstein's 1905 patent-clerk papers — special relativity, E=mc², quantum theory, and atomic proof — are the greatest single year in scientific history.", 'evidence_score': 0.97, 'sources': [{'title': 'Zur Elektrodynamik bewegter Körper (On the Electrodynamics of Moving Bodies)', 'author': 'Albert Einstein', 'publication': 'Annalen der Physik', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1905}]}, {'label': 'Atomic age consequences perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "E=mc² explained that a small amount of mass contains enormous energy — the principle behind nuclear weapons and nuclear power. Einstein, a pacifist, signed the Einstein-Szilard letter urging Roosevelt to develop the atomic bomb (1939) fearing Nazi Germany would first, and spent his final years warning of nuclear war's existential danger.", 'summary': 'E=mc² led to nuclear weapons Einstein himself helped initiate out of fear of Nazi Germany, spending his final years warning of nuclear extinction.', 'evidence_score': 0.93, 'sources': [{'title': 'Einstein: His Life and Universe', 'author': 'Walter Isaacson', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 2007}]}]},
    {'slug': 'league-of-nations-founding-1920', 'title': 'League of Nations — The First World Parliament', 'year': 1920, 'lat': 46.22, 'lng': 6.14, 'geo_modern': 'Geneva, Switzerland', 'geo_era_label': 'Interwar Period', 'category': 'political', 'importance_score': 0.8, 'zoom_min': 2, 'perspectives': [{'label': 'Wilsonian internationalist tradition', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "Woodrow Wilson's League of Nations (established January 10, 1920) was the first international organization with collective security — nations pledging to defend each other against aggression. Wilson believed it would prevent future wars. The US Senate's rejection (driven by isolationists like Lodge) fatally undermined the League and haunted American policy for decades.", 'summary': "Wilson's League was history's first collective security system, fatally undermined by the US Senate's rejection — haunting American isolationism vs. internationalism ever since.", 'evidence_score': 0.88, 'sources': [{'title': 'The League of Nations: Its Life and Times, 1920-1946', 'author': 'F.P. Walters', 'publication': 'Oxford University Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1952}]}, {'label': 'Critical historical perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The League's failures — inability to stop Japan (Manchuria, 1931), Italy (Ethiopia, 1935), or Germany — stemmed from structural flaws: decisions required unanimity; it had no army; the US, USSR, and Germany were all outside it at various points. Yet the League pioneered international institutions — the ILO, World Court, health organization — whose successors still function today.", 'summary': 'The League failed because of structural flaws and member defections, but pioneered the ILO, World Court, and health institutions that survive today in the UN system.', 'evidence_score': 0.85, 'sources': [{'title': 'International Authority and the League of Nations', 'author': 'Andrew Webster', 'publication': 'Routledge', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2008}]}]},
    {'slug': 'simon-bolivar-south-american-independence-1819', 'title': 'Simón Bolívar and South American Independence', 'year': 1819, 'lat': 7.13, 'lng': -65.97, 'geo_modern': 'Venezuela / Colombia / Ecuador / Peru / Bolivia', 'geo_era_label': 'Latin American Independence', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 2, 'perspectives': [{'label': 'Latin American liberationist tradition', 'culture_code': 've', 'viewpoint_type': 'nationalist', 'narrative': "Simón Bolívar ('El Libertador') defeated Spanish forces at the Battle of Boyacá (1819) — crossing the Andes to liberate New Granada — and at Carabobo (1821) to secure Venezuelan independence. By 1824 he had liberated Venezuela, Colombia, Ecuador, Peru, and Bolivia (named after him) — a military achievement compared to Napoleon's campaigns.", 'summary': 'Bolívar liberated five South American nations through campaigns compared to Napoleon in audacity, crossing the Andes to defeat Spanish armies.', 'evidence_score': 0.88, 'sources': [{'title': 'Carta de Jamaica (Jamaica Letter)', 'author': 'Simón Bolívar', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1815}]}, {'label': 'Post-independence legacy perspective', 'culture_code': 've', 'viewpoint_type': 'academic', 'narrative': "Bolívar's vision of a united Latin America (Gran Colombia) collapsed immediately after liberation as regional elites pursued separate national interests. His dying lament — 'Those who have served the revolution have plowed the sea' — proved prophetic. The nations he created were soon dominated by regional strongmen (caudillos) rather than the republics he had envisioned.", 'summary': "Bolívar's Gran Colombia dream collapsed as regional elites split it; his dying words 'plowed the sea' proved prophetic as caudillos replaced his republic.", 'evidence_score': 0.85, 'sources': [{'title': 'Bolívar: American Liberator', 'author': 'Marie Arana', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 2013}]}]},
    {'slug': 'paris-commune-1871', 'title': "Paris Commune — First Workers' Government", 'year': 1871, 'lat': 48.85, 'lng': 2.35, 'geo_modern': 'Paris, France', 'geo_era_label': 'Third French Republic', 'category': 'political', 'importance_score': 0.8, 'zoom_min': 3, 'perspectives': [{'label': 'Socialist and Marxist tradition', 'culture_code': 'fr', 'viewpoint_type': 'political', 'narrative': "The Paris Commune (March 18 - May 28, 1871) was the world's first self-governing workers' state — established after France's humiliating defeat by Prussia. For 72 days, Communards separated church and state, created free secular schools, abolished night bakery work, and remitted rents. Marx celebrated it as 'the glorious harbinger of a new society.' It was drowned in blood — 10,000+ killed.", 'summary': "The Commune was history's first workers' government — its 72 days pioneered separation of church and state, free schools, and workers' rights before 10,000+ were massacred.", 'evidence_score': 0.87, 'sources': [{'title': 'The Civil War in France', 'author': 'Karl Marx', 'publication': "International Workingmen's Association", 'source_type': 'primary', 'reliability_tier': 2, 'year': 1871}]}, {'label': 'French Republican perspective', 'culture_code': 'fr', 'viewpoint_type': 'government', 'narrative': "The Versailles government of Adolphe Thiers crushed the Commune in 'Bloody Week' (May 21-28, 1871), shooting 10,000-30,000 Communards including many who surrendered. The suppression traumatized the French working class for a generation, creating the class bitterness that would define French politics until WWII. Yet the Third Republic that crushed it also established secular education and press freedom.", 'summary': "Thiers's massacre of 10,000-30,000 Communards traumatized the French working class for a generation; the same Third Republic later established secular education.", 'evidence_score': 0.83, 'sources': [{'title': 'The Fall of Paris', 'author': 'Alistair Horne', 'publication': 'Macmillan', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1965}]}]},
    {'slug': 'spanish-american-war-philippines-1898', 'title': 'Spanish-American War — America Becomes an Imperial Power', 'year': 1898, 'lat': 14.6, 'lng': 121.0, 'geo_modern': 'Cuba / Philippines / Puerto Rico', 'geo_era_label': 'US Imperial Era', 'category': 'war', 'importance_score': 0.8, 'zoom_min': 2, 'perspectives': [{'label': 'American expansionist perspective', 'culture_code': 'us', 'viewpoint_type': 'nationalist', 'narrative': "The 'splendid little war' (Secretary of State John Hay) lasted only 4 months. The US acquired Puerto Rico, Guam, and bought the Philippines for $20 million — becoming an imperial Pacific and Caribbean power. Theodore Roosevelt's charge up San Juan Hill made him a national hero. The war completed Manifest Destiny's logic beyond the continent.", 'summary': 'The 4-month war made America an imperial power with Pacific colonies, completing Manifest Destiny beyond the continent.', 'evidence_score': 0.88, 'sources': [{'title': 'Imperial Democracy', 'author': 'Ernest May', 'publication': 'Harcourt', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1961}]}, {'label': 'Filipino and Cuban perspective', 'culture_code': 'ph', 'viewpoint_type': 'nationalist', 'narrative': "Filipino nationalists had been fighting Spanish colonialism under Emilio Aguinaldo's leadership. When the US, instead of granting independence, purchased the Philippines from Spain, Aguinaldo's forces launched the Philippine-American War (1899-1902) — killing 200,000+ Filipinos from combat, disease, and concentration camps. Cuba gained nominal independence but remained a US protectorate under the Platt Amendment.", 'summary': 'Filipino nationalists who had fought Spain were then colonized by America; the Philippine-American War killed 200,000+ in a forgotten war.', 'evidence_score': 0.87, 'sources': [{'title': 'Benevolent Assimilation: The American Conquest of the Philippines', 'author': 'Stuart Creighton Miller', 'publication': 'Yale University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1982}]}]},
    {'slug': 'ottoman-tanzimat-reforms-1839', 'title': 'Ottoman Tanzimat — Modernizing the Sick Man of Europe', 'year': 1839, 'lat': 41.01, 'lng': 28.98, 'geo_modern': 'Istanbul (Constantinople), Turkey', 'geo_era_label': 'Ottoman Empire', 'category': 'political', 'importance_score': 0.78, 'zoom_min': 3, 'perspectives': [{'label': 'Ottoman reformist perspective', 'culture_code': 'tr', 'viewpoint_type': 'government', 'narrative': "The Tanzimat ('reorganization') reforms (1839-1876) attempted to modernize the Ottoman Empire by abolishing tax farming, creating a secular legal code, extending equality to non-Muslim subjects, establishing Western-style schools and bureaucracy, and adopting a constitution (1876). They represented the most serious attempt to reform Islam's greatest empire for survival in the 19th century.", 'summary': 'Tanzimat reforms attempted to modernize the Ottoman Empire with secular law, equality for non-Muslims, and constitutional government.', 'evidence_score': 0.85, 'sources': [{'title': 'Gülhane Imperial Decree (Hatt-i Şerif)', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1839}]}, {'label': 'Critical historical perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': 'The Tanzimat failed to save the Ottoman Empire, which lost Bulgaria, Romania, Serbia, Montenegro, Cyprus, and most of its European territory by 1913. Critics note the reforms were partly superficial — modern laws unenforced, Western-educated bureaucrats governing traditional populations. The Young Turk revolution (1908) took a nationalist rather than liberal turn, leading to WWI and genocide.', 'summary': "Tanzimat couldn't save an empire that lost most of its territory by 1913; the Young Turk successor chose nationalism over liberalism, leading to genocide.", 'evidence_score': 0.82, 'sources': [{'title': 'The Ottoman Empire and Early Modern Europe', 'author': 'Daniel Goffman', 'publication': 'Cambridge University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2002}]}]},
    {'slug': 'vietnam-war-end-1975-saigon', 'title': "Fall of Saigon — America's Vietnam War Ends", 'year': 1975, 'lat': 10.82, 'lng': 106.63, 'geo_modern': 'Saigon (Ho Chi Minh City), Vietnam', 'geo_era_label': 'Cold War Southeast Asia', 'category': 'war', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Vietnamese communist tradition', 'culture_code': 'vn', 'viewpoint_type': 'nationalist', 'narrative': "The fall of Saigon (April 30, 1975) ended 30 years of war — first against France, then against the US-backed South Vietnamese government. North Vietnamese forces entered Saigon as the last American helicopter lifted off the US Embassy roof. For Vietnam, it was national reunification after a 'American War' that killed 3 million Vietnamese.", 'summary': "The fall of Saigon reunified Vietnam after 30 years of war — the 'American War' killed 3 million Vietnamese and ended America's longest Cold War proxy conflict.", 'evidence_score': 0.92, 'sources': [{'title': 'The Pentagon Papers', 'publication': 'US Department of Defense', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1969}]}, {'label': 'American post-Vietnam reflection', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "The Vietnam War cost 58,000 American lives and $800 billion (2023 dollars). The 'Vietnam Syndrome' — public and political aversion to military interventions — constrained US foreign policy until the Gulf War (1991). The war created lasting divisions in American society, transformed journalism (embedding, credibility gap), and produced the all-volunteer military to end the draft.", 'summary': "Vietnam created the 'Vietnam Syndrome' constraining US military action for 16 years and ended the draft — reshaping American military and political culture.", 'evidence_score': 0.88, 'sources': [{'title': 'A Bright Shining Lie', 'author': 'Neil Sheehan', 'publication': 'Random House', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1988}]}]},
    {'slug': 'mayflower-pilgrims-1620', 'title': 'Mayflower Compact — Pilgrims Establish Self-Government', 'year': 1620, 'lat': 41.96, 'lng': -70.67, 'geo_modern': 'Plymouth, Massachusetts, USA', 'geo_era_label': 'Colonial America', 'category': 'political', 'importance_score': 0.78, 'zoom_min': 3, 'perspectives': [{'label': 'American founding mythology perspective', 'culture_code': 'us', 'viewpoint_type': 'nationalist', 'narrative': 'The 102 Puritan Separatists who crossed on the Mayflower (November 1620) created the Mayflower Compact before landing — a self-governing agreement that became an ancestor of American democratic ideals. The Wampanoag people taught the survivors to grow corn; the 1621 harvest feast became the origin myth of Thanksgiving.', 'summary': 'The Mayflower Compact established self-government in America; Wampanoag hospitality saved the Pilgrims, a debt repaid with dispossession.', 'evidence_score': 0.85, 'sources': [{'title': 'Of Plymouth Plantation', 'author': 'William Bradford', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1651}]}, {'label': 'Indigenous (Wampanoag) perspective', 'culture_code': 'us-native', 'viewpoint_type': 'indigenous', 'narrative': "For the Wampanoag, the Pilgrims' arrival began a catastrophe. Disease had already killed 90% of the coastal Wampanoag before 1620; the survivors taught the English to survive, forged an alliance against enemies. Within 50 years, the English had taken Wampanoag land and fought a devastating war (King Philip's War, 1675-76) that nearly destroyed both sides.", 'summary': "The Wampanoag who saved the Pilgrims from starvation were destroyed within 50 years by disease, land theft, and King Philip's War.", 'evidence_score': 0.85, 'sources': [{'title': 'The Sovereignty and Goodness of God', 'author': 'Mary Rowlandson', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1682}]}]},
    {'slug': 'galileo-inquisition-1633', 'title': 'Galileo Before the Inquisition — Science vs. Church Authority', 'year': 1633, 'lat': 41.9, 'lng': 12.5, 'geo_modern': 'Rome, Italy', 'geo_era_label': 'Scientific Revolution / Counter-Reformation', 'category': 'cultural', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Science and reason tradition', 'culture_code': 'it', 'viewpoint_type': 'academic', 'narrative': "Galileo Galilei was tried by the Roman Inquisition in 1633 for supporting Copernican heliocentrism in his 'Dialogue Concerning the Two Chief World Systems.' Forced to recant on his knees, he was placed under house arrest for the rest of his life. The legend 'And yet it moves' (eppur si muove) captures science's defiance of religious authority.", 'summary': "Galileo's recantation under Inquisition pressure became the defining symbol of conflict between scientific truth and religious authority.", 'evidence_score': 0.9, 'sources': [{'title': 'Dialogue Concerning the Two Chief World Systems', 'author': 'Galileo Galilei', 'publication': 'Giovanni Battista Landini', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1632}]}, {'label': 'Catholic Church and historical nuance', 'culture_code': 'it', 'viewpoint_type': 'religious', 'narrative': "The Galileo case was more complex than simple science vs. religion: the Church had patronized astronomers for centuries, and leading cardinals (including Bellarmine) were willing to accept heliocentrism as a mathematical model. The trigger was Galileo's arrogant literary presentation that seemed to mock Pope Urban VIII. The Church formally apologized for the condemnation in 1992.", 'summary': 'The Galileo case was partly about his arrogance in mocking Urban VIII; the Church formally apologized in 1992 after John Paul II acknowledged the error.', 'evidence_score': 0.82, 'sources': [{'title': 'Galileo: Decisive Innovator', 'author': 'Michael Sharratt', 'publication': 'Cambridge University Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1994}]}]},
    {'slug': 'thirty-years-war-peace-westphalia-1648', 'title': 'Peace of Westphalia — Birth of the Modern State System', 'year': 1648, 'lat': 51.96, 'lng': 7.63, 'geo_modern': 'Münster and Osnabrück, Germany', 'geo_era_label': 'Early Modern Europe', 'category': 'political', 'importance_score': 0.88, 'zoom_min': 2, 'perspectives': [{'label': 'European international law tradition', 'culture_code': 'de', 'viewpoint_type': 'academic', 'narrative': "The Peace of Westphalia (1648) ended the Thirty Years' War — which killed 8 million people and depopulated central Europe. Its treaties established the principle of state sovereignty (cuius regio, eius religio updated to religious tolerance), non-interference in domestic affairs, and formal equality among states — the foundations of international law still in force today.", 'summary': 'Westphalia established state sovereignty and non-interference principles that still form the foundation of international law 375 years later.', 'evidence_score': 0.9, 'sources': [{'title': 'Peace Treaty of Westphalia', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1648}]}, {'label': 'Critical international relations perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The 'Westphalian system' is partly a myth constructed by later legal scholars. Sovereignty was not absolute in 1648 — the Empire and papal authority remained. But the myth became self-fulfilling: by treating Westphalia as the founding moment of the state system, jurists and statesmen built a system around its principles. The Westphalian model is now challenged by humanitarian intervention doctrine.", 'summary': 'The Westphalian system is partly a later legal myth, but one so powerful that statesmen built international law around it — now challenged by humanitarian intervention.', 'evidence_score': 0.83, 'sources': [{'title': 'The Invention of International Order', 'author': 'Ian Clark', 'publication': 'Princeton University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2021}]}]},
    {'slug': 'transatlantic-slave-trade-origins-1526', 'title': 'First Transatlantic Slave Voyage — The Middle Passage Begins', 'year': 1526, 'lat': 10.0, 'lng': -15.0, 'geo_modern': 'West Africa (Guinea coast)', 'geo_era_label': 'Early Atlantic Slave Trade', 'category': 'cultural', 'importance_score': 0.88, 'zoom_min': 1, 'perspectives': [{'label': 'African diaspora perspective', 'culture_code': 'global', 'viewpoint_type': 'indigenous', 'narrative': 'The transatlantic slave trade (1526-1867) forcibly transported 12.5 million Africans to the Americas — of whom 10.7 million survived the Middle Passage. The trade peaked in the 18th century; around 40% of all enslaved Africans went to Brazil, 40% to the Caribbean, and only 4% to North America. It was the largest forced migration in history.', 'summary': "12.5 million Africans were transported in the world's largest forced migration; 1.8 million died on the Middle Passage before even arriving.", 'evidence_score': 0.92, 'sources': [{'title': 'The Slave Trade Database (slavevoyages.org)', 'author': 'David Eltis et al.', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2010}]}, {'label': 'Economic history perspective', 'culture_code': 'gb', 'viewpoint_type': 'academic', 'narrative': "Eric Williams' 'Capitalism and Slavery' (1944) argued that slave trade profits financed Britain's Industrial Revolution. While later historians debate the precise mechanism, the slave trade was indisputably central to Atlantic capitalism — the triangular trade connecting European manufactures, African captives, and American plantation products in a single system of accumulated violence and profit.", 'summary': 'The triangular trade connected European manufactures, African captives, and American plantations in a system of accumulated violence that financed Atlantic capitalism.', 'evidence_score': 0.83, 'sources': [{'title': 'Capitalism and Slavery', 'author': 'Eric Williams', 'publication': 'University of North Carolina Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1944}]}]},
    {'slug': 'age-of-reason-voltaire-enlightenment-1750', 'title': 'The Enlightenment — Voltaire and the Age of Reason', 'year': 1750, 'lat': 46.52, 'lng': 6.64, 'geo_modern': 'Paris, France / Geneva, Switzerland', 'geo_era_label': 'European Enlightenment', 'category': 'cultural', 'importance_score': 0.87, 'zoom_min': 2, 'perspectives': [{'label': 'Enlightenment intellectual tradition', 'culture_code': 'fr', 'viewpoint_type': 'academic', 'narrative': "The European Enlightenment (c. 1685-1789) centered in France, Scotland, and England applied reason and empiricism to human affairs. Voltaire challenged religious intolerance; Locke articulated natural rights; Montesquieu described separation of powers; Rousseau theorized the social contract. The 'Encyclopédie' (1751-1772) compiled human knowledge as a project of liberation from superstition.", 'summary': 'The Enlightenment applied reason to human affairs, producing natural rights, separation of powers, and the Encyclopédie — the intellectual foundation of modern democracy.', 'evidence_score': 0.88, 'sources': [{'title': 'Candide', 'author': 'Voltaire', 'publication': 'Cramer', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1759}]}, {'label': 'Counter-Enlightenment and colonial critique', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Enlightenment universalism ('all men are created equal') coexisted with scientific racism, the slave trade, and colonial conquest. Voltaire held racist views; Jefferson enslaved 600+ people while writing of liberty. The Haitian Revolution exposed this contradiction most dramatically — enslaved Haitians took the Enlightenment's universalism seriously, while its European authors did not.", 'summary': "Enlightenment universalism coexisted with scientific racism and slavery; the Haitian Revolution exposed this contradiction by applying 'all men are created equal' to Black people.", 'evidence_score': 0.87, 'sources': [{'title': 'Black Jacobins', 'author': 'C.L.R. James', 'publication': 'Secker & Warburg', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1938}]}]},
    {'slug': 'american-bill-of-rights-1791', 'title': 'American Bill of Rights — Guaranteeing Individual Liberties', 'year': 1791, 'lat': 38.9, 'lng': -77.01, 'geo_modern': 'Philadelphia, USA', 'geo_era_label': 'Early American Republic', 'category': 'political', 'importance_score': 0.85, 'zoom_min': 3, 'perspectives': [{'label': 'American constitutional tradition', 'culture_code': 'us', 'viewpoint_type': 'political', 'narrative': 'The first ten amendments to the US Constitution (ratified December 15, 1791) guarantee freedom of speech, press, religion, assembly, the right to bear arms, protection from unreasonable searches, right to jury trial, and prohibition of cruel punishment. Anti-Federalists demanded these rights before ratifying the Constitution. Madison drafted them partly to preempt state bills of rights.', 'summary': 'The Bill of Rights was the price of constitutional ratification — Madison drafted it to prevent state-level rights bills and satisfy Anti-Federalist demands.', 'evidence_score': 0.92, 'sources': [{'title': 'United States Bill of Rights', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1791}]}, {'label': 'Evolving rights interpretation perspective', 'culture_code': 'us', 'viewpoint_type': 'academic', 'narrative': "The Bill of Rights applied only to the federal government, not states, until the 14th Amendment (1868) and 20th-century incorporation doctrine. Most rights have been substantially modified by Supreme Court interpretation: 'Congress shall make no law' (1st Amendment) permits significant speech restrictions. The Bill of Rights is a living document constantly renegotiated through case law.", 'summary': 'The Bill of Rights originally applied only to federal government; incorporation through the 14th Amendment was a 20th-century process that continues today.', 'evidence_score': 0.9, 'sources': [{'title': 'The Bill of Rights: Creation and Reconstruction', 'author': 'Akhil Amar', 'publication': 'Yale University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1998}]}]},
    {'slug': 'darwin-voyage-beagle-1831', 'title': "Darwin's Voyage on the Beagle — Evolution's Origin", 'year': 1831, 'lat': -13.16, 'lng': -72.54, 'geo_modern': 'Galapagos Islands / Global voyage', 'geo_era_label': 'Victorian Britain', 'category': 'discovery', 'importance_score': 0.87, 'zoom_min': 1, 'perspectives': [{'label': 'Natural history and evolution perspective', 'culture_code': 'gb', 'viewpoint_type': 'academic', 'narrative': "Charles Darwin's five-year voyage on HMS Beagle (1831-1836) collected specimens across South America, the Galapagos, Australia, and Africa that led him to develop the theory of evolution by natural selection. He delayed publishing for 20 years, aware of the controversy; Alfred Russel Wallace's independent formulation forced Darwin's hand, producing 'On the Origin of Species' (1859).", 'summary': "Darwin delayed publishing evolution theory for 20 years; Wallace's independent discovery forced publication of the most consequential scientific book ever written.", 'evidence_score': 0.93, 'sources': [{'title': 'The Voyage of the Beagle', 'author': 'Charles Darwin', 'publication': 'John Murray', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1839}]}, {'label': 'Social Darwinism misuse perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Darwin's theory was systematically misapplied as 'Social Darwinism' to justify imperialism, racism, eugenics, and laissez-faire capitalism — the 'survival of the fittest' phrase Darwin himself rarely used. Spencer, Galton, and later the Nazis distorted evolution. Darwin himself held views on race typical of his class; modern evolutionary biology has no intrinsic political implications.", 'summary': "Darwin's science was perverted into Social Darwinism justifying racism and imperialism — a misuse Darwin himself did not entirely prevent through his own Victorian-era views.", 'evidence_score': 0.85, 'sources': [{'title': 'The Mismeasure of Man', 'author': 'Stephen Jay Gould', 'publication': 'Norton', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1981}]}]},
    {'slug': 'nuremberg-trials-1945', 'title': 'Nuremberg Trials — Justice After Genocide', 'year': 1945, 'lat': 49.45, 'lng': 11.08, 'geo_modern': 'Nuremberg, Germany', 'geo_era_label': 'Post-WWII', 'category': 'political', 'importance_score': 0.85, 'zoom_min': 3, 'perspectives': [{'label': 'International law tradition', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "The Nuremberg Trials (1945-1946) tried 24 Nazi leaders for crimes against peace, war crimes, and crimes against humanity — new categories in international law. The trials established that 'following orders' is no defense against atrocity, that individuals (not just states) can be held criminally liable in international law, and created the precedent for all subsequent international criminal tribunals.", 'summary': "Nuremberg established that individuals can be held criminally liable for war crimes and that 'following orders' is no defense — founding international criminal law.", 'evidence_score': 0.93, 'sources': [{'title': 'Nuremberg Trial Proceedings (International Military Tribunal Charter)', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1945}]}, {'label': "Victor's justice critique", 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Critics called Nuremberg 'victor's justice': the Soviet judges had participated in the Molotov-Ribbentrop Pact and Katyn massacre; US atomic bombing of civilians was not prosecuted; British carpet bombing was not charged. Chief US Justice Robert Jackson acknowledged the tribunal applied law that did not clearly exist at the time — an act of retroactive lawmaking.", 'summary': "Nuremberg was partly victor's justice — Soviet Katyn massacre, US atomic bombing, and British carpet bombing were excluded; Jackson admitted applying retroactive law.", 'evidence_score': 0.85, 'sources': [{'title': 'Nuremberg: The Last Battle', 'author': 'David Irving', 'publication': 'Focal Point', 'source_type': 'secondary', 'reliability_tier': 3, 'peer_reviewed': False, 'year': 1996}]}]},
    {'slug': 'french-revolution-declaration-rights-1789', 'title': 'Declaration of the Rights of Man — 1789', 'year': 1789, 'lat': 48.85, 'lng': 2.35, 'geo_modern': 'Versailles / Paris, France', 'geo_era_label': 'French Revolution', 'category': 'political', 'importance_score': 0.88, 'zoom_min': 3, 'perspectives': [{'label': 'French republican tradition', 'culture_code': 'fr', 'viewpoint_type': 'political', 'narrative': "The Declaration of the Rights of Man and Citizen (August 26, 1789) proclaimed that 'men are born and remain free and equal in rights' and that sovereignty resides in the nation, not the king. Its 17 articles — freedom of speech, press, property, and equality before the law — became the template for human rights declarations worldwide including the 1948 Universal Declaration.", 'summary': "The Declaration's 17 articles establishing rights and national sovereignty became the template for human rights declarations culminating in the 1948 UDHR.", 'evidence_score': 0.93, 'sources': [{'title': 'Declaration of the Rights of Man and of the Citizen', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1789}]}, {'label': 'Olympe de Gouges feminist critique', 'culture_code': 'fr', 'viewpoint_type': 'feminist', 'narrative': "Olympe de Gouges immediately challenged the Declaration's 'men' language with her 'Declaration of the Rights of Woman and the Female Citizen' (1791), noting that women were excluded from the rights proclaimed universal. De Gouges was guillotined in 1793. The Declaration's universalism remained gendered: French women could not vote until 1944 — 155 years later.", 'summary': "Olympe de Gouges challenged the Declaration's exclusion of women in 1791 and was guillotined; French women waited 155 years for the vote the Declaration proclaimed universal.", 'evidence_score': 0.9, 'sources': [{'title': 'Declaration of the Rights of Woman and the Female Citizen', 'author': 'Olympe de Gouges', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1791}]}]},
    {'slug': 'black-death-pandemic-origins-1347', 'title': "Black Death Arrives from the East — Europe's Greatest Catastrophe", 'year': 1347, 'lat': 44.4, 'lng': 8.93, 'geo_modern': 'Messina / Genoa, Sicily, Italy', 'geo_era_label': 'Medieval Europe', 'category': 'natural', 'importance_score': 0.87, 'zoom_min': 2, 'perspectives': [{'label': 'Medieval European chronicle perspective', 'culture_code': 'eu', 'viewpoint_type': 'religious', 'narrative': "The Black Death arrived at Messina, Sicily in October 1347 on Genoese trading ships from Caffa on the Black Sea (where Mongols had catapulted infected bodies — possibly history's first bioweapon). Within 5 years it killed 30-60% of Europe's population — 25-50 million people. Medieval people understood it as divine punishment; flagellant movements and pogroms against Jews followed.", 'summary': 'The Black Death arrived via Genoese ships from a bioweapon attack, killed 30-60% of Europeans, and triggered flagellant movements and Jewish pogroms.', 'evidence_score': 0.88, 'sources': [{'title': 'Historia de Morbo (On the Disease)', 'author': 'Giovanni da Piazza', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1347}]}, {'label': 'Long-term historical consequences', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The Black Death's long-term consequences were paradoxically transformative: labor shortages gave surviving peasants bargaining power, accelerating the end of serfdom; per capita income rose; the church's authority was undermined by its failure to explain or stop the plague; survivors invested in art (the Italian Renaissance partly followed). The plague reshaped European society more than any event since Rome's fall.", 'summary': 'The Black Death paradoxically transformed Europe: labor scarcity ended serfdom, undermined church authority, and rising incomes fueled the Italian Renaissance.', 'evidence_score': 0.85, 'sources': [{'title': 'The Black Death', 'author': 'Ole Benedictow', 'publication': 'Boydell Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2004}]}]},
    {'slug': 'gutenberg-bible-printed-1455', 'title': 'Gutenberg Prints the Bible — The Media Revolution', 'year': 1455, 'lat': 49.99, 'lng': 8.27, 'geo_modern': 'Mainz, Germany', 'geo_era_label': 'Late Medieval Europe', 'category': 'discovery', 'importance_score': 0.88, 'zoom_min': 2, 'perspectives': [{'label': 'Communication revolution perspective', 'culture_code': 'de', 'viewpoint_type': 'academic', 'narrative': "Johannes Gutenberg's movable-type printing press (c. 1450) and the Gutenberg Bible (c. 1455, ~180 copies) launched a communication revolution. By 1500, over 20 million books had been printed across Europe — more than all manuscripts produced in the previous 1,000 years. Print enabled the Reformation, the Scientific Revolution, and the standardization of European languages.", 'summary': "Gutenberg's press produced more books by 1500 than all prior European manuscripts combined, enabling the Reformation and Scientific Revolution.", 'evidence_score': 0.93, 'sources': [{'title': 'The Gutenberg Bible (Bibliothèque nationale de France, Paris)', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1455}]}, {'label': 'Information control and democratization', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': 'Print did not uniformly democratize information — early printing was controlled by rulers and the Church through licensing and censorship (Index Librorum Prohibitorum). But censorship ultimately failed: cheap print spread heresy, sedition, and scientific ideas faster than authorities could suppress them. The pattern repeats with the internet: each communication revolution outpaces control.', 'summary': "Print censorship ultimately failed against cheap Reformation pamphlets — a pattern repeated with the internet's similar outpacing of information control.", 'evidence_score': 0.85, 'sources': [{'title': 'The Printing Press as an Agent of Change', 'author': 'Elizabeth Eisenstein', 'publication': 'Cambridge University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1979}]}]},
    {'slug': 'polio-vaccine-salk-1955', 'title': 'Salk Polio Vaccine — A Disease Conquered', 'year': 1955, 'lat': 42.33, 'lng': -83.05, 'geo_modern': 'Ann Arbor, Michigan, USA', 'geo_era_label': 'Post-WWII America', 'category': 'discovery', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Public health achievement perspective', 'culture_code': 'us', 'viewpoint_type': 'academic', 'narrative': "Jonas Salk's polio vaccine trial results were announced April 12, 1955 — church bells rang across America. Polio had paralyzed 58,000 Americans in 1952; it paralyzed Franklin Roosevelt. The largest clinical trial in history (1.8 million children) proved the vaccine safe. Albert Sabin's oral vaccine (1961) enabled global vaccination campaigns that have reduced polio by 99.9%.", 'summary': "The Salk vaccine, proved in history's largest clinical trial, rang church bells across America and led to 99.9% reduction in global polio cases.", 'evidence_score': 0.95, 'sources': [{'title': 'Field Trial Report on the Salk Vaccine', 'author': 'Thomas Francis Jr.', 'publication': 'University of Michigan', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1955}]}, {'label': 'Intellectual property and access perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "When asked who owned the polio vaccine patent, Salk replied 'There is no patent. Could you patent the sun?' His deliberate non-patenting made the vaccine cheap and accessible globally. It became a model for public health advocates arguing that life-saving vaccines should not be proprietary — a debate renewed with HIV antiretrovirals and COVID-19 vaccines.", 'summary': "Salk deliberately didn't patent the vaccine ('Could you patent the sun?'), making it a model for public goods arguments renewed with HIV drugs and COVID vaccines.", 'evidence_score': 0.9, 'sources': [{'title': 'Patenting the Sun', 'author': 'Jane Smith', 'publication': 'William Morrow', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 1990}]}]},
    {'slug': 'ww2-pacific-battle-midway-1942', 'title': 'Battle of Midway — Turning Point of the Pacific War', 'year': 1942, 'lat': 28.21, 'lng': -177.37, 'geo_modern': 'Midway Atoll, Central Pacific Ocean', 'geo_era_label': 'World War II Pacific', 'category': 'war', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'American naval history perspective', 'culture_code': 'us', 'viewpoint_type': 'academic', 'narrative': 'The Battle of Midway (June 4-7, 1942) — in which the US sank four Japanese fleet carriers while losing one — was the decisive turning point of the Pacific War. American code-breaking (MAGIC/PURPLE) gave advance knowledge of Japanese plans. Japan never replaced its lost carriers and experienced pilots; the Imperial Navy went permanently on the defensive after Midway.', 'summary': "US code-breaking enabled the Midway ambush that sank four Japanese carriers, permanently ending Japan's offensive capability in the Pacific.", 'evidence_score': 0.92, 'sources': [{'title': 'Miracle at Midway', 'author': 'Gordon Prange', 'publication': 'McGraw-Hill', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1982}]}, {'label': 'Japanese strategic perspective', 'culture_code': 'jp', 'viewpoint_type': 'government', 'narrative': "For Japan, Midway was a catastrophic intelligence and operational failure. Admiral Yamamoto's plan was over-complex; operational security was poor (American codebreakers had broken JN-25); and Japanese pilots committed the fatal error of rearming aircraft when American planes attacked at the critical moment. The loss of four carriers and hundreds of irreplaceable pilots ended Japan's ability to project naval power.", 'summary': "Midway was Japan's operational and intelligence catastrophe — poor security, over-complex planning, and the loss of 250+ irreplaceable veteran pilots decided the Pacific War.", 'evidence_score': 0.88, 'sources': [{'title': 'Shattered Sword: The Untold Story of the Battle of Midway', 'author': 'Jonathan Parshall', 'publication': 'Potomac Books', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2005}]}]},
    {'slug': 'decolonization-year-of-africa-1960-detail', 'title': 'Year of Africa 1960 — 17 Nations Gain Independence', 'year': 1960, 'lat': 6.37, 'lng': 2.42, 'geo_modern': 'Sub-Saharan Africa', 'geo_era_label': 'African Decolonization', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 1, 'perspectives': [{'label': 'African nationalist tradition', 'culture_code': 'ng', 'viewpoint_type': 'nationalist', 'narrative': "1960 was 'Africa Year' — 17 African nations gained independence including Nigeria, Senegal, Ivory Coast, Cameroon, Congo (Leopoldville), and 11 others. Britain and France, exhausted and financially weakened by WWII, could no longer sustain colonial systems challenged by rising nationalism, Cold War anti-colonialism, and UN pressure. Independence was often rushed and inadequately prepared.", 'summary': '17 African nations gained independence in 1960 as exhausted European powers retreated, often in rushed transfers with inadequate preparation.', 'evidence_score': 0.9, 'sources': [{'title': 'The Fate of Africa', 'author': 'Martin Meredith', 'publication': 'Public Affairs', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2005}]}, {'label': 'Neocolonialism critique', 'culture_code': 'global', 'viewpoint_type': 'political', 'narrative': "Kwame Nkrumah's 'Neo-Colonialism: The Last Stage of Imperialism' (1965) argued that formal independence replaced colonial rule with economic control — through currency boards tied to sterling, French military bases, multinational corporations, and World Bank conditionality. Many post-independence leaders were overthrown in CIA-backed coups (Nkrumah himself in 1966, Lumumba 1961).", 'summary': 'Nkrumah warned that formal independence masked continued economic control; he and Lumumba were both overthrown in CIA-backed coups within years of independence.', 'evidence_score': 0.85, 'sources': [{'title': 'Neo-Colonialism: The Last Stage of Imperialism', 'author': 'Kwame Nkrumah', 'publication': 'Thomas Nelson', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 1965}]}]},
    {'slug': 'apartheid-system-south-africa-1948', 'title': 'National Party Wins — Apartheid System Established', 'year': 1948, 'lat': -25.75, 'lng': 28.19, 'geo_modern': 'Pretoria, South Africa', 'geo_era_label': 'South Africa', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Afrikaner nationalist perspective', 'culture_code': 'za', 'viewpoint_type': 'nationalist', 'narrative': "The National Party's 1948 election victory on the apartheid platform institutionalized racial segregation across all aspects of South African life: the Population Registration Act classified all citizens by race; the Group Areas Act segregated residential areas; the Immorality Act banned mixed-race relationships. The system was justified by Calvinist theology of separate development.", 'summary': "Apartheid's 1948 installation through democratic election created systematic race classification, residential segregation, and ban on mixed-race relationships.", 'evidence_score': 0.9, 'sources': [{'title': 'The Rise and Fall of Apartheid', 'author': 'David Welsh', 'publication': 'Jonathan Ball', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2009}]}, {'label': 'International human rights perspective', 'culture_code': 'global', 'viewpoint_type': 'political', 'narrative': "The apartheid system — declared a 'crime against humanity' by the UN in 1973 — created the global anti-apartheid movement that pioneered sports boycotts, economic sanctions, academic embargoes, and divestment campaigns later used in other human rights contexts. South Africa's peaceful transition in 1994 became a global model for negotiated democratic change.", 'summary': 'Apartheid, declared a crime against humanity in 1973, generated the global boycott movement that pioneered sanctions tactics and ultimately produced the 1994 peaceful transition model.', 'evidence_score': 0.87, 'sources': [{'title': 'UN General Assembly Resolution 3068 (XXVIII): Apartheid Convention', 'publication': 'United Nations', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1973}]}]},
    {'slug': 'ww1-ottoman-collapse-sykes-picot-1916', 'title': 'Sykes-Picot Agreement — Carving Up the Middle East', 'year': 1916, 'lat': 33.89, 'lng': 35.5, 'geo_modern': 'Middle East (Lebanon / Syria / Iraq)', 'geo_era_label': 'World War I / Ottoman Collapse', 'category': 'political', 'importance_score': 0.85, 'zoom_min': 2, 'perspectives': [{'label': 'Arab nationalist perspective', 'culture_code': 'sy', 'viewpoint_type': 'nationalist', 'narrative': "The secret Sykes-Picot Agreement (May 1916) between Britain and France divided the Middle East into spheres of influence with borders drawn by diplomats ignoring ethnic, religious, and tribal realities. Combined with the contradictory Husain-McMahon Correspondence (promising Arab independence) and Balfour Declaration, it created the modern Middle East's irresolvable conflicts.", 'summary': "Sykes-Picot's artificial borders, combined with contradictory promises to Arabs and Zionists, created the modern Middle East's irresolvable conflicts.", 'evidence_score': 0.87, 'sources': [{'title': 'A Line in the Sand', 'author': 'James Barr', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2011}]}, {'label': 'Historical revisionist perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The 'Sykes-Picot created the Middle East's problems' narrative is partly an oversimplification. Many modern borders (Jordan, Lebanon, Iraq) emerged from post-WWI settlement negotiations rather than Sykes-Picot itself. But the agreement's legacy — arbitrary borders ignoring local populations — remains symbolically potent, cited by ISIS and regional nationalists alike as evidence of Western betrayal.", 'summary': "Sykes-Picot's actual borders were modified in 1919-1920, but its symbolic betrayal remains potent — cited by ISIS and nationalists as the West's original sin in the region.", 'evidence_score': 0.82, 'sources': [{'title': 'After the Ottomans', 'author': 'Robert Fisk', 'publication': 'Harper Collins', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 2021}]}]},
    {'slug': 'world-war-ii-liberation-paris-1944', 'title': 'Liberation of Paris — The City of Light Returns', 'year': 1944, 'lat': 48.85, 'lng': 2.35, 'geo_modern': 'Paris, France', 'geo_era_label': 'World War II Western Front', 'category': 'war', 'importance_score': 0.8, 'zoom_min': 3, 'perspectives': [{'label': 'French national narrative', 'culture_code': 'fr', 'viewpoint_type': 'nationalist', 'narrative': "Paris was liberated on August 25, 1944 by the French 2nd Armored Division under General Leclerc — Eisenhower allowed French forces to enter first for political symbolism. De Gaulle's triumphant march down the Champs-Élysées and his speech proclaiming liberation 'by herself, by her own people, with the help of the armies of France' carefully minimized Allied contribution to preserve French dignity.", 'summary': "De Gaulle's liberation speech minimized Allied help to restore French dignity — a calculated political performance that defined France's post-war self-understanding.", 'evidence_score': 0.88, 'sources': [{'title': 'Is Paris Burning?', 'author': 'Larry Collins & Dominique Lapierre', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 1965}]}, {'label': 'French Resistance and collaboration history', 'culture_code': 'fr', 'viewpoint_type': 'academic', 'narrative': 'Liberation exposed the painful truth of occupation: while the Resistance was real and heroic, most French people had accommodated Vichy collaboration. The post-liberation purges (épuration) killed 10,000-40,000 collaborators. The myth of a France of 40 million resisters (a phrase attributed to de Gaulle) was politically necessary but historically false.', 'summary': 'Liberation exposed that most French had accommodated Vichy; the myth of universal resistance was politically necessary but historically false.', 'evidence_score': 0.87, 'sources': [{'title': 'Vichy France', 'author': 'Robert Paxton', 'publication': 'Knopf', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1972}]}]},
    {'slug': 'hiroshima-context-decision-1945', 'title': 'Decision to Use the Atomic Bomb — Hiroshima and Historical Debate', 'year': 1945, 'lat': 34.39, 'lng': 132.46, 'geo_modern': 'Hiroshima, Japan', 'geo_era_label': 'World War II Pacific', 'category': 'war', 'importance_score': 0.92, 'zoom_min': 3, 'perspectives': [{'label': 'US strategic decision perspective', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "Truman's decision to use atomic bombs on Hiroshima (August 6) and Nagasaki (August 9, 1945), killing 130,000-226,000 people, aimed to end the Pacific War without the projected 250,000-1,000,000 American casualties from invading Japan. Japan's refusal to surrender despite conventional bombing and the Soviet declaration of war made the bombs a final shock to break Japanese military resolve.", 'summary': 'Truman used the bomb to avoid the projected catastrophic cost of invading Japan, estimating it saved more lives than it took.', 'evidence_score': 0.82, 'sources': [{'title': 'Stimson Diary, August 6, 1945', 'author': 'Henry Stimson', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1945}]}, {'label': 'Japanese survivor and anti-nuclear perspective', 'culture_code': 'jp', 'viewpoint_type': 'civilian', 'narrative': 'Hibakusha (bomb survivors) describe instant incineration, radiation sickness that killed thousands more months later, and lifelong social stigma in Japan. The targeting of civilian urban centers — not military bases — violated international humanitarian law by any modern standard. Japan had been seeking surrender terms through the Soviet Union before the bombs; historians debate whether the bombs were truly necessary to end the war.', 'summary': 'Hibakusha testimony and historical evidence that Japan was already seeking peace raises the question of whether the bombs were truly necessary to end the war.', 'evidence_score': 0.8, 'sources': [{'title': 'Hiroshima', 'author': 'John Hersey', 'publication': 'New Yorker', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 1946}]}]},
    {'slug': 'marshall-plan-us-europe-recovery-1948-detail', 'title': 'Marshall Plan Implementation — Rebuilding Western Europe', 'year': 1948, 'lat': 52.52, 'lng': 13.4, 'geo_modern': 'Western Europe', 'geo_era_label': 'Early Cold War', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 2, 'perspectives': [{'label': 'American foreign policy tradition', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "Secretary of State George Marshall's European Recovery Program (1948-1952) provided $13 billion ($143 billion in 2023 dollars) to rebuild Western European economies devastated by WWII. It prevented communist takeovers in France and Italy, created market for US exports, and established the institutional framework (OEEC, later OECD) for European economic cooperation.", 'summary': "The Marshall Plan's $13 billion ($143B in today's money) rebuilt Western Europe, prevented communist takeovers, and created the institutional framework for European economic integration.", 'evidence_score': 0.92, 'sources': [{'title': 'Marshall Plan (European Recovery Program)', 'author': 'George Marshall', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1948}]}, {'label': 'European and global south perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The Marshall Plan's success raised expectations globally: Korea, Vietnam, African nations all hoped for similar aid after WWII or independence. Instead they received Cold War proxy wars and conditional IMF loans. The contrast between the Marshall Plan (which had no conditions beyond market openness) and structural adjustment programs imposed on developing nations defined much 20th-century resentment.", 'summary': "The Marshall Plan's success created expectations that developing nations never received — Cold War proxy wars instead of reconstruction aid, generating lasting resentment.", 'evidence_score': 0.83, 'sources': [{'title': 'The Marshall Plan: Dawn of the Cold War', 'author': 'Benn Steil', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2018}]}]},
    {'slug': 'hippie-counterculture-1968-global-protests', 'title': 'Global Protests of 1968 — The World Revolts', 'year': 1968, 'lat': 48.85, 'lng': 2.35, 'geo_modern': 'Paris / Chicago / Mexico City / Prague / Tokyo', 'geo_era_label': 'Late Cold War', 'category': 'cultural', 'importance_score': 0.82, 'zoom_min': 1, 'perspectives': [{'label': 'New Left and student movement perspective', 'culture_code': 'global', 'viewpoint_type': 'political', 'narrative': "1968 saw simultaneous revolutionary movements worldwide: Paris May '68 (students and workers nearly overthrow de Gaulle); Chicago Democratic Convention protests; Prague Spring; Mexico City Tlatelolco massacre; Japanese student movement; Brazilian protests against military dictatorship; Columbia University occupation. The year shattered post-WWII consensus and birthed new social movements.", 'summary': "1968's simultaneous global revolts — Paris, Prague, Chicago, Mexico City — shattered the post-WWII consensus and birthed feminism, environmentalism, and identity politics.", 'evidence_score': 0.88, 'sources': [{'title': '1968: The Year That Rocked the World', 'author': 'Mark Kurlansky', 'publication': 'Ballantine Books', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 2004}]}, {'label': 'Conservative reaction perspective', 'culture_code': 'us', 'viewpoint_type': 'political', 'narrative': "The 1968 revolts produced conservative backlash that reshaped politics for decades: Nixon's 'silent majority,' the Southern Strategy, Reagan's 1980 revolution, and Thatcherism were all partly reactions to 1968's cultural upheaval. The revolution failed politically in the short term — de Gaulle survived, Nixon won, and the left splintered — but transformed culture, creating feminism, environmentalism, and identity politics.", 'summary': "1968's revolts failed politically in the short term but created feminism, environmentalism, and identity politics while provoking Nixon/Reagan conservatism.", 'evidence_score': 0.83, 'sources': [{'title': 'The Sixties', 'author': 'Todd Gitlin', 'publication': 'Bantam Books', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1987}]}]},
    {'slug': 'russia-crimean-war-ottoman-1853', 'title': 'Crimean War — Modern Warfare and the Birth of Nursing', 'year': 1853, 'lat': 44.95, 'lng': 34.1, 'geo_modern': 'Crimea (Ukraine / Russia)', 'geo_era_label': 'Mid-Victorian', 'category': 'war', 'importance_score': 0.78, 'zoom_min': 3, 'perspectives': [{'label': 'British and French strategic perspective', 'culture_code': 'gb', 'viewpoint_type': 'government', 'narrative': "The Crimean War (1853-1856) saw Britain, France, and Ottoman Turkey fighting Russia over Ottoman integrity and access to the Black Sea. The first war extensively covered by photography (Roger Fenton) and newspaper correspondents (William Howard Russell), it revealed catastrophic British military management — Florence Nightingale's nursing reforms and the Charge of the Light Brigade became cultural touchstones.", 'summary': 'The first war covered by photography and press, Crimea exposed British military incompetence and birthed modern nursing through Florence Nightingale.', 'evidence_score': 0.87, 'sources': [{'title': 'Notes on Nursing', 'author': 'Florence Nightingale', 'publication': 'Harrison', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1860}]}, {'label': 'Russian and pan-Slavic perspective', 'culture_code': 'ru', 'viewpoint_type': 'nationalist', 'narrative': "Russia's defeat in Crimea exposed the backward state of its military technology and administration — a modernization shock that directly led to Tsar Alexander II's emancipation of serfs (1861) and other Great Reforms. The war's humiliation created the pan-Slavic nationalism and aggressive Balkan policy that contributed to WWI.", 'summary': "Russia's Crimea defeat shocked it into Alexander II's Great Reforms including serf emancipation, but also created the pan-Slavic Balkan policy that helped start WWI.", 'evidence_score': 0.83, 'sources': [{'title': 'The Crimean War', 'author': 'Orlando Figes', 'publication': 'Metropolitan Books', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2010}]}]},
    {'slug': 'universal-declaration-human-rights-1948', 'title': 'Universal Declaration of Human Rights — Global Rights Codified', 'year': 1948, 'lat': 46.22, 'lng': 6.14, 'geo_modern': 'Paris (Chaillot Palace), France', 'geo_era_label': 'Early United Nations', 'category': 'political', 'importance_score': 0.88, 'zoom_min': 1, 'perspectives': [{'label': 'Human rights universalist tradition', 'culture_code': 'global', 'viewpoint_type': 'political', 'narrative': 'The Universal Declaration of Human Rights (December 10, 1948), drafted by a committee including Eleanor Roosevelt, René Cassin, P.C. Chang, and Charles Malik, proclaimed 30 rights universally applicable to all humans regardless of nationality. It was the first global statement of rights not contingent on citizenship — a direct response to the Holocaust.', 'summary': "The UDHR's 30 articles, drafted in response to the Holocaust, proclaimed the first universal rights not contingent on citizenship — the foundation of international human rights law.", 'evidence_score': 0.93, 'sources': [{'title': 'Universal Declaration of Human Rights', 'publication': 'United Nations', 'source_type': 'primary', 'reliability_tier': 1, 'year': 1948}]}, {'label': 'Non-Western and relativist critique', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': 'Non-Western governments (led by Saudi Arabia and apartheid South Africa, which abstained) and later Asian values theorists (Lee Kuan Yew) argued the UDHR reflected Western liberal individualism — not universal values. The 1993 Vienna Declaration affirmed universality despite cultural diversity, but debates about Asian values, Islamic human rights frameworks, and communitarian vs. individual rights continue.', 'summary': "Saudi Arabia and South Africa abstained; the 'Asian values' debate questioned whether Western individualist rights are truly universal — a debate still unresolved.", 'evidence_score': 0.85, 'sources': [{'title': 'The Idea of Human Rights', 'author': 'John Tasioulas', 'publication': 'Oxford University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2010}]}]},
    {'slug': 'cuban-revolution-1959', 'title': 'Cuban Revolution — Castro Overthrows Batista', 'year': 1959, 'lat': 23.13, 'lng': -82.38, 'geo_modern': 'Havana, Cuba', 'geo_era_label': 'Cold War Latin America', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 3, 'perspectives': [{'label': 'Cuban revolutionary tradition', 'culture_code': 'cu', 'viewpoint_type': 'nationalist', 'narrative': "Fidel Castro's guerrilla forces, after two years in the Sierra Maestra mountains, overthrew the US-backed Batista dictatorship on January 1, 1959. The revolution achieved 100% literacy, free healthcare, and ended the mafia-casino economy — but also imprisoned dissidents, banned independent press, and created one-party rule that lasted over 60 years.", 'summary': "Castro's revolution achieved universal literacy and healthcare while creating a one-party state that imprisoned dissidents — a 60-year Cold War flashpoint 90 miles from Florida.", 'evidence_score': 0.87, 'sources': [{'title': 'History Will Absolve Me', 'author': 'Fidel Castro', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1953}]}, {'label': 'American and exile perspective', 'culture_code': 'us', 'viewpoint_type': 'government', 'narrative': "Cuba's proximity — 90 miles from Florida — made Castro's communist state an obsession for US policy: the Bay of Pigs invasion, CIA assassination plots (at least 638 documented), the trade embargo (1960-present), and the Missile Crisis all flowed from the revolutionary relationship. The Cuban-American exile community became one of the most politically influential diaspora communities in US history.", 'summary': "Cuba's proximity drove 60 years of US obsession — 638+ assassination plots, Bay of Pigs, trade embargo — while Cuban-Americans became US history's most influential diaspora.", 'evidence_score': 0.85, 'sources': [{'title': 'Our Man in Havana: The CIA and Cuba', 'author': 'Evan Thomas', 'publication': 'Simon & Schuster', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1995}]}]},
    {'slug': 'rome-republic-founding-509bce-republican-values', 'title': 'Roman Republic — Founding Institutions and Republican Ideals', 'year': -509, 'lat': 41.9, 'lng': 12.5, 'geo_modern': 'Rome, Italy', 'geo_era_label': 'Roman Republic', 'category': 'political', 'importance_score': 0.83, 'zoom_min': 2, 'is_bce': True, 'perspectives': [{'label': 'Roman republican tradition', 'culture_code': 'it', 'viewpoint_type': 'political', 'narrative': "The Roman Republic (509-27 BCE), founded after the expulsion of the last king Tarquinius Superbus, created political institutions — Senate, consuls, tribunes, assemblies — that balanced aristocratic and popular power. Twelve Tables of law (450 BCE) codified citizens' rights. Roman republican ideals of civic virtue (virtus), law, and anti-tyranny directly influenced the American and French constitutions.", 'summary': "Rome's Republican institutions — Senate, consuls, tribunes, written law — directly inspired the American and French constitutions 2,200 years later.", 'evidence_score': 0.85, 'sources': [{'title': 'Histories', 'author': 'Polybius', 'source_type': 'primary', 'reliability_tier': 2, 'year': -150}]}, {'label': 'Class conflict analysis', 'culture_code': 'it', 'viewpoint_type': 'academic', 'narrative': "The Roman Republic was riven by the Conflict of the Orders — centuries of struggle between patricians (aristocrats) and plebeians (commoners) for legal equality and political rights. The plebeian tribunes, plebeian assembly, and eventually access to all magistracies were won through organized political pressure including secessions from Rome. The struggle ended only in 287 BCE — 222 years after the Republic's founding.", 'summary': 'The Republic spent 222 years in the Conflict of Orders as plebeians won equal rights through organized resistance including walkouts from Rome itself.', 'evidence_score': 0.82, 'sources': [{'title': 'The Roman Revolution', 'author': 'Ronald Syme', 'publication': 'Oxford University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 1939}]}]},
    {'slug': 'muhammad-ali-egypt-modernization-1805', 'title': 'Muhammad Ali Modernizes Egypt — The Napoleon of the East', 'year': 1805, 'lat': 30.06, 'lng': 31.25, 'geo_modern': 'Cairo, Egypt', 'geo_era_label': 'Ottoman Egypt', 'category': 'political', 'importance_score': 0.78, 'zoom_min': 3, 'perspectives': [{'label': 'Egyptian nationalist tradition', 'culture_code': 'eg', 'viewpoint_type': 'nationalist', 'narrative': 'Muhammad Ali Pasha (r. 1805-1848), an Albanian Ottoman commander who became effective ruler of Egypt, implemented top-down modernization: Western-trained army, cotton export economy, factories, secular schools, and public health measures. He is considered the founder of modern Egypt. His military campaigns temporarily conquered Arabia, Sudan, and Syria — threatening the Ottoman Empire itself.', 'summary': 'Muhammad Ali built a Western-trained army and cotton economy that temporarily made Egypt more powerful than the Ottoman Empire itself.', 'evidence_score': 0.85, 'sources': [{'title': 'The Arabs: A History', 'author': 'Eugene Rogan', 'publication': 'Basic Books', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2009}]}, {'label': 'Critical modernization perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Muhammad Ali's modernization was built on forced labor (corvée) and coerced cotton cultivation by Egyptian peasants. His forced crop substitution (cotton replacing food crops) created food insecurity among Egyptian peasants. His Western-educated elite successors became increasingly indebted to European banks, leading to the British occupation of 1882 — modernization as the road to colonization.", 'summary': "Muhammad Ali's modernization through forced peasant labor led his successors into European debt that produced the British occupation of 1882 — modernization as the road to colonization.", 'evidence_score': 0.83, 'sources': [{'title': 'Egypt: A Short History', 'author': 'James Jankowski', 'publication': 'Oneworld', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2000}]}]},
    {'slug': 'cold-war-space-race-yuri-gagarin-1961', 'title': 'Yuri Gagarin — First Human in Space', 'year': 1961, 'lat': 51.57, 'lng': 45.86, 'geo_modern': 'Baikonur Cosmodrome, Kazakhstan (Soviet Union)', 'geo_era_label': 'Space Race', 'category': 'discovery', 'importance_score': 0.88, 'zoom_min': 2, 'perspectives': [{'label': 'Soviet Cold War achievement perspective', 'culture_code': 'ru', 'viewpoint_type': 'government', 'narrative': "Yuri Gagarin's 108-minute orbital flight on April 12, 1961 made him the first human in space — a Soviet triumph that mortified the US. Combined with Sputnik (1957), the first dog in space (Laika), and first spacewalk (Leonov, 1965), Soviet space achievements demonstrated that socialist science could outperform capitalist technology. Gagarin became the most famous person in the world.", 'summary': "Gagarin's 108-minute flight humiliated the US, built on Sputnik and Laika, demonstrating Soviet space supremacy that Kennedy's Moon mission was designed to overcome.", 'evidence_score': 0.95, 'sources': [{'title': 'Vostok 1 Mission Report', 'publication': 'Soviet Ministry of Space', 'source_type': 'primary', 'reliability_tier': 2, 'year': 1961}]}, {'label': 'Cold War technology competition perspective', 'culture_code': 'us', 'viewpoint_type': 'academic', 'narrative': "Gagarin's flight directly triggered Kennedy's May 1961 Moon declaration. The Space Race accelerated advances in computing, materials science, telecommunications, and systems management that became the foundation of the digital economy. The race's $150+ billion cost also reflects the extraordinary resources Cold War competition commanded — resources that could have addressed poverty and disease.", 'summary': "Gagarin triggered Kennedy's Moon declaration; the Space Race's $150B cost generated computing and materials breakthroughs — and could have funded decades of global health instead.", 'evidence_score': 0.9, 'sources': [{'title': 'Carrying the Fire', 'author': 'Michael Collins', 'publication': 'Farrar, Straus and Giroux', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': False, 'year': 1974}]}]},
    {'slug': 'china-great-wall-qin-ming-221bce', 'title': 'The Great Wall of China — 1,500 Years of Construction', 'year': -221, 'lat': 40.43, 'lng': 116.57, 'geo_modern': 'Northern China frontier', 'geo_era_label': 'Qin / Ming Dynasty China', 'category': 'cultural', 'importance_score': 0.82, 'zoom_min': 1, 'is_bce': True, 'perspectives': [{'label': 'Chinese dynastic and national tradition', 'culture_code': 'cn', 'viewpoint_type': 'nationalist', 'narrative': "Qin Shi Huang began connecting and extending northern walls in 221 BCE; the Great Wall as it exists today (21,196 km) was largely built by the Ming Dynasty (1368-1644). Hundreds of thousands of conscript laborers built it; many died and were buried within the wall. It represents both the Chinese state's organizational power and the terror of its coercive labor system.", 'summary': "The Great Wall was built by conscripted laborers under pain of death, representing both China's organizational power and coercive state authority over 1,500 years.", 'evidence_score': 0.88, 'sources': [{'title': 'The Great Wall: China Against the World', 'author': 'Julia Lovell', 'publication': 'Grove Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2006}]}, {'label': 'Military effectiveness perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The Great Wall's military effectiveness is debated: Mongols breached it repeatedly and Manchus walked through it when a Chinese general opened the gates in 1644 (inviting the Qing conquest). As military infrastructure it may have been less effective than diplomacy and subsidies. But as a statement of imperial power — the world's largest construction project — it was unmatched.", 'summary': 'As military defense the Wall often failed — Mongols breached it, Manchus were invited through in 1644 — but as a statement of imperial power it remains unmatched.', 'evidence_score': 0.85, 'sources': [{'title': 'The Penguin History of Modern China', 'author': 'Jonathan Fenby', 'publication': 'Allen Lane', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 2008}]}]},
    {'slug': 'rwandan-genocide-detail-1994', 'title': 'Rwandan Genocide — 100 Days of Killing', 'year': 1994, 'lat': -1.94, 'lng': 30.06, 'geo_modern': 'Kigali, Rwanda', 'geo_era_label': 'Post-Cold War Africa', 'category': 'war', 'importance_score': 0.87, 'zoom_min': 3, 'perspectives': [{'label': 'Rwandan genocide scholarship', 'culture_code': 'rw', 'viewpoint_type': 'academic', 'narrative': "In 100 days (April 7 - July 15, 1994), the Hutu Power government and its Interahamwe militias killed 500,000 to 1,000,000 Tutsi and moderate Hutu — using radio broadcasts, roadblocks, machetes, and neighbor-on-neighbor killing. The UN (General Dallaire) had forewarning and troops present but was ordered to stand down. The international community's failure to act is a defining moment in human rights law.", 'summary': 'In 100 days, 500,000-1,000,000 Rwandans were killed with machetes while the UN watched; Dallaire had forewarning but was ordered not to intervene.', 'evidence_score': 0.93, 'sources': [{'title': 'Shake Hands with the Devil', 'author': 'Roméo Dallaire', 'publication': 'Random House Canada', 'source_type': 'primary', 'reliability_tier': 1, 'year': 2003}]}, {'label': 'Colonial legacy and international failure perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Belgian colonial administrators hardened fluid Hutu-Tutsi identity into rigid racial categories, issuing identity cards that became tools of genocide. The Clinton administration avoided using the word 'genocide' to escape legal obligation to intervene. Rwanda transformed the doctrine of Responsibility to Protect (R2P) — adopted by the UN in 2005 — attempting to ensure 'never again' has teeth.", 'summary': "Belgian colonialism created the racial categories genocide required; Clinton's avoidance of 'genocide' shaped the R2P doctrine adopted by the UN in 2005.", 'evidence_score': 0.9, 'sources': [{'title': 'A Sunday at the Pool in Kigali', 'author': 'Gil Courtemanche', 'publication': 'Canongate', 'source_type': 'secondary', 'reliability_tier': 3, 'peer_reviewed': False, 'year': 2000}]}]},
    {'slug': 'india-china-civilization-compare-axial-age-600bce', 'title': 'Axial Age Civilizations — Buddha, Confucius, and the Greek Philosophers', 'year': -500, 'lat': 35.67, 'lng': 103.82, 'geo_modern': 'China / India / Greece / Israel', 'geo_era_label': 'Axial Age (Global)', 'category': 'cultural', 'importance_score': 0.85, 'zoom_min': 1, 'is_bce': True, 'perspectives': [{'label': 'Comparative civilization perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "Karl Jaspers' 'Axial Age' (800-200 BCE) saw simultaneous intellectual revolutions across four civilizations: Confucius and Laozi in China; Buddha and the Upanishads in India; the Hebrew prophets (Isaiah, Jeremiah, Ezekiel) in Israel; and Socrates, Plato, Aristotle in Greece. These thinkers shifted human focus from ritual to ethics, from cosmic to personal morality — a quantum leap in consciousness.", 'summary': 'The Axial Age simultaneously produced Confucius, Buddha, Hebrew prophets, and Greek philosophers — a quantum leap in ethical consciousness across unconnected civilizations.', 'evidence_score': 0.82, 'sources': [{'title': 'The Origin and Goal of History', 'author': 'Karl Jaspers', 'publication': 'Yale University Press', 'source_type': 'secondary', 'reliability_tier': 2, 'peer_reviewed': True, 'year': 1953}]}, {'label': 'Historical materialist perspective', 'culture_code': 'global', 'viewpoint_type': 'academic', 'narrative': "The Axial Age's simultaneous flowering across disconnected civilizations may reflect common material conditions: iron technology replacing bronze (lowering the cost of tools and weapons, enabling wider participation in economy and war); growth of trade networks connecting distant regions; and the challenges of governing larger agrarian empires requiring new ethical frameworks.", 'summary': "The Axial Age's simultaneity may reflect common material causes: iron technology, trade networks, and the challenge of governing large agrarian empires requiring new ethical systems.", 'evidence_score': 0.75, 'sources': [{'title': 'The Axial Age and Its Consequences', 'author': 'Robert Bellah', 'publication': 'Harvard University Press', 'source_type': 'secondary', 'reliability_tier': 1, 'peer_reviewed': True, 'year': 2012}]}]},

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
    {'cause': 'bantu-expansion-migrations-1000bce', 'effect': 'great-zimbabwe-kingdom-1250', 'type': 'indirect', 'strength': 0.6, 'desc': "Bantu-speaking iron-age farmers' southward migration over 2000 years created the Shona cultural base of Great Zimbabwe"},
    {'cause': 'mali-empire-founding-1235', 'effect': 'mansa-musa-hajj-1324', 'type': 'direct', 'strength': 0.9, 'desc': "The Mali Empire's gold wealth funded Mansa Musa's extraordinary pilgrimage and gold distribution"},
    {'cause': 'mansa-musa-hajj-1324', 'effect': 'songhai-empire-askia-1493', 'type': 'indirect', 'strength': 0.5, 'desc': "Mansa Musa's establishment of Timbuktu as an Islamic center of learning created the cultural infrastructure that Songhai later built on"},
    {'cause': 'berlin-conference-africa-partition-1884', 'effect': 'battle-adwa-ethiopia-1896', 'type': 'direct', 'strength': 0.8, 'desc': "Italy's partition-era claim to Ethiopia triggered its invasion that Ethiopia defeated at Adwa"},
    {'cause': 'battle-adwa-ethiopia-1896', 'effect': 'mau-mau-uprising-kenya-1952', 'type': 'indirect', 'strength': 0.4, 'desc': 'Adwa proved African nations could defeat European powers, inspiring anti-colonial resistance including the Mau Mau'},
    {'cause': 'berlin-conference-africa-partition-1884', 'effect': 'biafran-war-nigeria-1967', 'type': 'indirect', 'strength': 0.65, 'desc': "Britain's arbitrary Niger Delta boundaries amalgamated incompatible ethnic groups into 'Nigeria,' creating the ethnic tensions behind Biafra"},
    {'cause': 'decolonization-year-of-africa-1960-detail', 'effect': 'congo-independence-lumumba-1960', 'type': 'direct', 'strength': 0.85, 'desc': "The Year of Africa wave of independence included Congo's rushed June 1960 independence that led to Lumumba's crisis"},
    {'cause': 'cuban-missile-crisis-1962', 'effect': 'nuclear-test-ban-treaty-1963', 'type': 'direct', 'strength': 0.88, 'desc': 'The Cuban Missile Crisis near-catastrophe directly drove both superpowers to sign the Partial Test Ban Treaty within a year'},
    {'cause': 'buddha-enlightenment-528bce', 'effect': 'ashoka-edicts-kalinga-war-261bce', 'type': 'indirect', 'strength': 0.75, 'desc': 'Ashoka converted to Buddhism after Kalinga, and Buddhist ethics of non-violence directly shaped his edicts and imperial policy'},
    {'cause': 'babur-founds-mughal-empire-1526', 'effect': 'akbar-religious-tolerance-din-ilahi-1563', 'type': 'direct', 'strength': 0.85, 'desc': 'Babur founded the Mughal dynasty that Akbar later transformed with religious tolerance policies'},
    {'cause': 'battle-plassey-british-india-1757', 'effect': 'gandhi-salt-march-1930', 'type': 'indirect', 'strength': 0.55, 'desc': 'British colonial control established at Plassey created the economic exploitation — including salt taxes — that Gandhi challenged 173 years later'},
    {'cause': 'gandhi-salt-march-1930', 'effect': 'indian-independence-1947', 'type': 'direct', 'strength': 0.8, 'desc': "Gandhi's nonviolent civil disobedience movement, launched in 1930, built the mass independence movement that achieved independence in 1947"},
    {'cause': 'perry-opens-japan-1853', 'effect': 'meiji-restoration-japan-1868', 'type': 'direct', 'strength': 0.9, 'desc': "Perry's forced opening of Japan humiliated the shogunate and directly triggered the Meiji Restoration that replaced it"},
    {'cause': 'meiji-restoration-japan-1868', 'effect': 'russo-japanese-war-1904-1905', 'type': 'direct', 'strength': 0.85, 'desc': "Meiji Japan's rapid industrialization and military modernization created the power that defeated Russia in 1905"},
    {'cause': 'al-khwarizmi-algebra-820', 'effect': 'avicenna-canon-medicine-1025', 'type': 'contributing', 'strength': 0.5, 'desc': "Al-Khwarizmi's House of Wisdom tradition of systematic rational inquiry in Arabic created the intellectual framework Avicenna applied to medicine"},
    {'cause': 'abbasid-house-of-wisdom-800', 'effect': 'al-khwarizmi-algebra-820', 'type': 'direct', 'strength': 0.9, 'desc': 'Al-Khwarizmi worked directly at the House of Wisdom in Baghdad; Caliph al-Mamun commissioned his mathematical works'},
    {'cause': 'al-andalus-cordoba-caliphate-950', 'effect': 'averroes-ibn-rushd-philosophy-1190', 'type': 'direct', 'strength': 0.8, 'desc': "Cordoba's intellectual tradition directly produced Averroes, who lived and worked in al-Andalus"},
    {'cause': 'mongol-conquest-baghdad-1258', 'effect': 'safavid-persia-founding-1501', 'type': 'indirect', 'strength': 0.4, 'desc': 'Mongol destruction of the Abbasid Caliphate created the political vacuum that Timurid successor states, and then the Safavids, eventually filled'},
    {'cause': 'olmec-civilization-1500bce', 'effect': 'maya-civilization-peak-600-900', 'type': 'indirect', 'strength': 0.65, 'desc': "Olmec calendar, ball courts, and religious iconography were adopted and elaborated by the Maya as the 'mother culture' of Mesoamerica"},
    {'cause': 'aztec-tenochtitlan-founding-1325', 'effect': 'cortez-conquest-aztec-1519-1521', 'type': 'direct', 'strength': 0.85, 'desc': "Tenochtitlan's island location, size, and importance as Aztec capital made it the strategic target and prize of Cortés's conquest"},
    {'cause': 'inca-empire-pachacuti-1438', 'effect': 'pizarro-conquers-inca-1532', 'type': 'direct', 'strength': 0.8, 'desc': "Pachacuti's Inca expansion created the empire Pizarro conquered, including the ongoing civil war that Pizarro exploited"},
    {'cause': 'vesalius-human-anatomy-1543', 'effect': 'harvey-blood-circulation-1628', 'type': 'direct', 'strength': 0.75, 'desc': "Vesalius's empirical anatomical method at Padua directly influenced Harvey, who also trained at Padua under Vesalius's tradition"},
    {'cause': 'harvey-blood-circulation-1628', 'effect': 'pasteur-germ-theory-1862', 'type': 'indirect', 'strength': 0.4, 'desc': "Harvey's empirical approach to physiology established the experimental medical tradition that Pasteur later applied to microbiology"},
    {'cause': 'lavoisier-oxygen-chemistry-1789', 'effect': 'darwin-on-the-origin-of-species-1859', 'type': 'indirect', 'strength': 0.35, 'desc': "Lavoisier's chemistry revolution created the systematic scientific framework that informed 19th-century biology including Darwin's methodology"},
    {'cause': 'jenner-smallpox-vaccination-1796', 'effect': 'pasteur-germ-theory-1862', 'type': 'direct', 'strength': 0.65, 'desc': "Pasteur built directly on Jenner's vaccination work, generalizing the principle of using attenuated pathogens to create immunity"},
    {'cause': 'hungarian-revolution-1956', 'effect': 'prague-spring-1968', 'type': 'indirect', 'strength': 0.55, 'desc': "Hungary's crushed revolution showed the limits of Soviet tolerance for reform, yet Prague's reformers tried again 12 years later"},
    {'cause': 'bay-of-pigs-invasion-1961', 'effect': 'cuban-missile-crisis-1962', 'type': 'direct', 'strength': 0.85, 'desc': 'Bay of Pigs humiliated the US and convinced Khrushchev of American weakness while giving Castro reason to accept Soviet missiles for protection'},
    {'cause': 'berlin-wall-construction-1961', 'effect': 'fall-of-berlin-wall-1989', 'type': 'direct', 'strength': 0.9, 'desc': 'The same Berlin Wall built in 1961 fell in 1989 — its opening was the culmination of 28 years of resistance to its existence'},
    {'cause': 'helsinki-accords-1975', 'effect': 'velvet-revolution-czechoslovakia-1989', 'type': 'contributing', 'strength': 0.65, 'desc': "Helsinki's human rights basket provided Havel and Charter 77 their legal framework to challenge the communist government"},
    {'cause': 'velvet-revolution-czechoslovakia-1989', 'effect': 'dissolution-soviet-union-1991', 'type': 'contributing', 'strength': 0.6, 'desc': "Czechoslovakia's peaceful revolution was part of the 1989 domino of Eastern European collapses that doomed the Soviet Union"},
    {'cause': 'transatlantic-slave-trade-origins-1526', 'effect': 'haitian-revolution-1791-1804', 'type': 'direct', 'strength': 0.9, 'desc': 'Three centuries of transatlantic slavery created the enslaved population of Saint-Domingue who launched the Haitian Revolution'},
    {'cause': 'transatlantic-slave-trade-origins-1526', 'effect': 'american-civil-war-1861-1865', 'type': 'indirect', 'strength': 0.7, 'desc': 'The transatlantic slave trade created the enslaved labor system in the American South that the Civil War ultimately destroyed'},
    {'cause': 'bandung-conference-1955', 'effect': 'decolonization-year-of-africa-1960-detail', 'type': 'contributing', 'strength': 0.6, 'desc': "Bandung's pan-African and Afro-Asian solidarity gave moral and diplomatic support to African independence movements culminating in 1960"},
    {'cause': 'communist-manifesto-1848', 'effect': 'russian-revolution-1917', 'type': 'contributing', 'strength': 0.65, 'desc': "Marx's Manifesto provided the ideological framework Lenin adapted as Marxism-Leninism to guide the 1917 revolution"},
    {'cause': 'revolutions-of-1848-europe', 'effect': 'unification-germany-1871', 'type': 'contributing', 'strength': 0.55, 'desc': "The 1848 German revolution failed to unify Germany through liberalism; Bismarck's 'blood and iron' succeeded where liberal nationalism had failed"},
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
