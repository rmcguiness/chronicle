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
    "postgresql+asyncpg://chronicle:chronicle@localhost:5432/chronicle",
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
        "geo_modern": "Paris, France", "geo_era_label": "