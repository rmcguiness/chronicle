#!/usr/bin/env python3
"""
Chronicle seed script — ~80 medieval + early modern events (500–1800 CE).

Run:
    python backend/scripts/seed_medieval_early_modern.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import os
import uuid
from typing import Any

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:medieval-early-modern-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ═══════════════════════════════════════════════════════════════════════
# EVENTS
# ═══════════════════════════════════════════════════════════════════════

EVENTS: list[dict[str, Any]] = [
    # ──────────────────────────────────────────────────────────────────
    # MEDIEVAL PERIOD (500–1500 CE)
    # ──────────────────────────────────────────────────────────────────

    # --- Islamic Golden Age / Caliphates ---
    {
        "slug": "death-of-prophet-muhammad",
        "title": "Death of Prophet Muhammad",
        "year": 632, "lat": 24.47, "lng": 39.61,
        "geo_modern": "Medina, Saudi Arabia",
        "geo_era_label": "Early Islamic Period",
        "category": "political", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "Islamic historical perspective", "culture_code": "sa", "viewpoint_type": "academic",
             "narrative": "The death of Prophet Muhammad in 632 CE triggered the question of succession that would shape Islamic civilization for centuries. The Rashidun Caliphate was established, and within a century Islam had spread from Spain to Central Asia.",
             "summary": "The passing of Islam's founder and the birth of the caliphate system.", "evidence_score": 0.90,
             "sources": [{"title": "Muhammad: His Life Based on the Earliest Sources", "author": "Martin Lings", "publication": "Inner Traditions", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}]},
        ],
    },
    {
        "slug": "umayyad-caliphate-established",
        "title": "Umayyad Caliphate Established — Islamic Empire Expands",
        "year": 661, "lat": 33.51, "lng": 36.29,
        "geo_modern": "Damascus, Syria",
        "geo_era_label": "Umayyad Period",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Umayyad Caliphate (661–750) moved the Islamic capital to Damascus and expanded the empire from Iberia to the Indus. It created the largest empire the world had yet seen, establishing Arabic as the lingua franca of a vast domain.",
             "summary": "The first hereditary Islamic dynasty created the largest empire of its era.", "evidence_score": 0.87,
             "sources": [{"title": "The Great Arab Conquests", "author": "Hugh Kennedy", "publication": "Da Capo Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}]},
        ],
    },
    {
        "slug": "battle-of-tours",
        "title": "Battle of Tours — Frankish Victory Halts Muslim Advance into Europe",
        "year": 732, "lat": 46.79, "lng": 0.70,
        "geo_modern": "Tours, France",
        "geo_era_label": "Carolingian Europe",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "European historical perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Charles Martel's Frankish army defeated an Umayyad force near Tours in 732, marking the furthest extent of Muslim military expansion into Western Europe. Though debated in scale, it became symbolically pivotal in European historiography.",
             "summary": "A battle that shaped the religious boundary of medieval Europe.", "evidence_score": 0.78,
             "sources": [{"title": "The Battle of Poitiers", "author": "William Watson", "publication": "Cambridge Medieval History", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1913}]},
        ],
    },
    {
        "slug": "harun-al-rashid-abbasid-golden-age",
        "title": "Harun al-Rashid's Reign — Abbasid Golden Age Begins",
        "year": 786, "lat": 33.31, "lng": 44.37,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "Abbasid Caliphate",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Islamic cultural perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Harun al-Rashid (r. 786–809) presided over the Abbasid Caliphate at its zenith. Baghdad became the world's largest and most cultured city, a center of trade, learning, and the arts — immortalized in the Thousand and One Nights.",
             "summary": "The height of Abbasid power and cultural brilliance in Baghdad.", "evidence_score": 0.85,
             "sources": [{"title": "When Baghdad Ruled the Muslim World", "author": "Hugh Kennedy", "publication": "Da Capo Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },
    {
        "slug": "house-of-wisdom-baghdad",
        "title": "House of Wisdom Founded in Baghdad",
        "year": 830, "lat": 33.31, "lng": 44.37,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "Abbasid Caliphate",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The House of Wisdom (Bayt al-Hikma), established under Caliph al-Ma'mun around 830, became the world's foremost center of learning. Scholars translated Greek, Persian, and Indian texts into Arabic, preserving and advancing knowledge in mathematics, astronomy, medicine, and philosophy.",
             "summary": "The intellectual powerhouse that preserved and advanced classical knowledge.", "evidence_score": 0.85,
             "sources": [{"title": "The House of Wisdom", "author": "Jim Al-Khalili", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}]},
        ],
    },
    {
        "slug": "al-khwarizmi-algebra",
        "title": "Al-Khwarizmi Publishes the Foundations of Algebra",
        "year": 820, "lat": 33.31, "lng": 44.37,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "Abbasid Caliphate",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "History of mathematics perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Al-Khwarizmi's treatise 'Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala' (c. 820) systematized the solving of linear and quadratic equations. The word 'algebra' derives from al-jabr, and 'algorithm' from his Latinized name — Algoritmi.",
             "summary": "The founding text of algebra, one of mathematics' most important works.", "evidence_score": 0.90,
             "sources": [{"title": "Al-Khwarizmi: The Father of Algebra", "author": "Roshdi Rashed", "publication": "UNESCO", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]},
        ],
    },
    {
        "slug": "avicenna-canon-of-medicine",
        "title": "Avicenna Writes The Canon of Medicine",
        "year": 1025, "lat": 32.65, "lng": 51.68,
        "geo_modern": "Isfahan, Iran",
        "geo_era_label": "Islamic Golden Age",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "History of medicine perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Ibn Sina (Avicenna) completed The Canon of Medicine around 1025. This encyclopedic work synthesized Greco-Roman medicine with Islamic medical advances and remained the standard medical textbook in both Islamic and European universities for over 500 years.",
             "summary": "The most influential medical textbook in history, used for five centuries.", "evidence_score": 0.88,
             "sources": [{"title": "Avicenna: His Life and Works", "author": "Soheil Afnan", "publication": "Allen & Unwin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1958}]},
        ],
    },

    # --- Crusades ---
    {
        "slug": "first-crusade-1095",
        "title": "First Crusade — Pope Urban II's Call to Arms",
        "year": 1095, "lat": 45.78, "lng": 3.08,
        "geo_modern": "Clermont, France",
        "geo_era_label": "Medieval Europe",
        "category": "war", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "European historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Pope Urban II's call at the Council of Clermont in 1095 launched the First Crusade. European knights captured Jerusalem in 1099, establishing Crusader states in the Levant and inaugurating two centuries of religious warfare that reshaped Christian-Muslim relations.",
             "summary": "The launch of the Crusades, transforming European and Middle Eastern history.", "evidence_score": 0.88,
             "sources": [{"title": "The First Crusade: A New History", "author": "Thomas Asbridge", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },
    {
        "slug": "third-crusade-1189",
        "title": "Third Crusade — Richard the Lionheart vs Saladin",
        "year": 1189, "lat": 32.82, "lng": 34.99,
        "geo_modern": "Acre, Israel",
        "geo_era_label": "Crusader Period",
        "category": "war", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Third Crusade (1189–1192) pitted Europe's greatest kings — Richard I of England, Philip II of France — against Saladin. Despite recapturing Acre, Richard failed to retake Jerusalem. The truce allowed Christian pilgrim access to the holy city.",
             "summary": "The legendary clash between Richard the Lionheart and Saladin.", "evidence_score": 0.85,
             "sources": [{"title": "The Crusades: The Authoritative History", "author": "Thomas Asbridge", "publication": "Ecco", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2010}]},
        ],
    },
    {
        "slug": "fourth-crusade-sack-of-constantinople",
        "title": "Fourth Crusade — Sack of Constantinople",
        "year": 1204, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Late Byzantine Empire",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Byzantine historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Fourth Crusade (1202–1204) was diverted from its Egyptian target to Constantinople, which Crusaders sacked in 1204. The destruction of the Christian Byzantine capital by fellow Christians fatally weakened the empire and deepened the East-West Christian schism.",
             "summary": "Crusaders sack the greatest Christian city, fatally weakening Byzantium.", "evidence_score": 0.87,
             "sources": [{"title": "The Fourth Crusade", "author": "Jonathan Phillips", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },

    # --- Byzantine Empire ---
    {
        "slug": "justinian-hagia-sophia",
        "title": "Justinian I Builds Hagia Sophia",
        "year": 537, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Architectural history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Emperor Justinian I commissioned the Hagia Sophia, completed in 537 CE. Its massive dome — an engineering marvel — remained the world's largest cathedral for nearly a thousand years. Justinian also codified Roman law in the Corpus Juris Civilis, the foundation of Western legal tradition.",
             "summary": "The greatest architectural achievement of the Byzantine Empire.", "evidence_score": 0.90,
             "sources": [{"title": "Justinian's Flea", "author": "William Rosen", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}]},
        ],
    },
    {
        "slug": "great-schism-1054",
        "title": "Great Schism — Christianity Splits East and West",
        "year": 1054, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Byzantine Empire",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "In 1054, mutual excommunications between the Patriarch of Constantinople and the Papal legate formalized the split between Roman Catholic and Eastern Orthodox Christianity. Theological, political, and cultural differences had been building for centuries.",
             "summary": "The definitive split between Catholic and Orthodox Christianity.", "evidence_score": 0.87,
             "sources": [{"title": "The Orthodox Church", "author": "Timothy Ware", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1993}]},
        ],
    },
    {
        "slug": "fall-of-constantinople-1453",
        "title": "Fall of Constantinople to the Ottoman Turks",
        "year": 1453, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Late Medieval",
        "category": "war", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Sultan Mehmed II's conquest of Constantinople on May 29, 1453, ended the 1,100-year Byzantine Empire. Greek scholars fled west, catalyzing the Italian Renaissance. The Ottoman Empire gained control of the crucial East-West trade routes, motivating European maritime exploration.",
             "summary": "The end of the Roman/Byzantine Empire and a catalyst for the Renaissance and Age of Exploration.", "evidence_score": 0.92,
             "sources": [{"title": "1453: The Holy War for Constantinople", "author": "Roger Crowley", "publication": "Hyperion", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}]},
        ],
    },

    # --- Tang/Song China ---
    {
        "slug": "tang-dynasty-golden-age",
        "title": "Tang Dynasty — Golden Age of Chinese Civilization",
        "year": 618, "lat": 34.26, "lng": 108.94,
        "geo_modern": "Xi'an, China",
        "geo_era_label": "Tang Dynasty China",
        "category": "political", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Tang Dynasty (618–907) is widely considered the golden age of Chinese civilization. Its cosmopolitan capital Chang'an was the world's largest city, the Silk Road flourished, poetry reached its apex, and Chinese influence spread across East Asia.",
             "summary": "China's cultural and political zenith, a beacon of cosmopolitan civilization.", "evidence_score": 0.90,
             "sources": [{"title": "China's Golden Age: Everyday Life in the Tang Dynasty", "author": "Charles Benn", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}]},
        ],
    },
    {
        "slug": "invention-of-gunpowder-china",
        "title": "Invention of Gunpowder in China",
        "year": 850, "lat": 34.26, "lng": 108.94,
        "geo_modern": "China (exact location uncertain)",
        "geo_era_label": "Tang Dynasty China",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "History of technology perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Chinese alchemists discovered gunpowder around 850 CE while seeking an elixir of immortality. Initially used in fireworks and signal flares, it was weaponized by the Song Dynasty. Gunpowder eventually transformed warfare worldwide after reaching Europe in the 13th century.",
             "summary": "One of the most consequential inventions in history, born from Chinese alchemy.", "evidence_score": 0.85,
             "sources": [{"title": "Science and Civilisation in China, Vol. 5", "author": "Joseph Needham", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}]},
        ],
    },
    {
        "slug": "movable-type-printing-bi-sheng",
        "title": "Bi Sheng Invents Movable Type Printing",
        "year": 1040, "lat": 30.58, "lng": 114.27,
        "geo_modern": "Hubei Province, China",
        "geo_era_label": "Song Dynasty China",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "History of technology perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Bi Sheng invented ceramic movable type printing around 1040, roughly 400 years before Gutenberg. While less impactful in China due to the complexity of Chinese characters, this innovation represented a fundamental advance in information technology.",
             "summary": "The world's first movable type printing, four centuries before Gutenberg.", "evidence_score": 0.83,
             "sources": [{"title": "Science and Civilisation in China, Vol. 5", "author": "Joseph Needham", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}]},
        ],
    },
    {
        "slug": "song-dynasty-paper-money",
        "title": "Song Dynasty Introduces Paper Money",
        "year": 1024, "lat": 30.57, "lng": 104.07,
        "geo_modern": "Chengdu, Sichuan, China",
        "geo_era_label": "Song Dynasty China",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Song Dynasty issued the first government-backed paper money (jiaozi) around 1024 in Sichuan province. This financial innovation facilitated commerce in the world's most economically advanced society, centuries before paper currency appeared in Europe.",
             "summary": "The world's first government-issued paper currency.", "evidence_score": 0.85,
             "sources": [{"title": "The Age of Confucian Rule", "author": "Dieter Kuhn", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}]},
        ],
    },
    {
        "slug": "silk-road-peak-tang-song",
        "title": "Silk Road Reaches Its Peak — Tang/Song Era Trade",
        "year": 750, "lat": 40.0, "lng": 65.0,
        "geo_modern": "Samarkand, Uzbekistan",
        "geo_era_label": "Tang Dynasty",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 1,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "During the Tang and early Song dynasties, the Silk Road reached its peak as a transcontinental trade network connecting China to the Mediterranean. Silk, spices, paper, and gunpowder moved west while gold, horses, and religion moved east.",
             "summary": "The zenith of the ancient trade network linking East and West.", "evidence_score": 0.83,
             "sources": [{"title": "The Silk Roads: A New History of the World", "author": "Peter Frankopan", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}]},
        ],
    },

    # --- Viking Age ---
    {
        "slug": "viking-age-begins-lindisfarne",
        "title": "Viking Age Begins — Raid on Lindisfarne",
        "year": 793, "lat": 55.67, "lng": -1.80,
        "geo_modern": "Lindisfarne, Northumberland, England",
        "geo_era_label": "Viking Age",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Medieval history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The 793 CE raid on the monastery at Lindisfarne shocked Christendom and is conventionally considered the start of the Viking Age. Norse raiders, traders, and settlers would reshape the political map of Europe over the next three centuries.",
             "summary": "The attack that inaugurated the Viking Age.", "evidence_score": 0.88,
             "sources": [{"title": "The Vikings: A History", "author": "Robert Ferguson", "publication": "Viking/Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}]},
        ],
    },
    {
        "slug": "leif-eriksson-reaches-north-america",
        "title": "Leif Eriksson Reaches North America — Vinland",
        "year": 1000, "lat": 51.59, "lng": -55.53,
        "geo_modern": "L'Anse aux Meadows, Newfoundland, Canada",
        "geo_era_label": "Viking Age",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Around 1000 CE, Leif Eriksson led a Norse expedition to North America, establishing a settlement at L'Anse aux Meadows in Newfoundland — nearly 500 years before Columbus. Archaeological evidence confirms this as the earliest known European presence in the Americas.",
             "summary": "The first confirmed European contact with the Americas.", "evidence_score": 0.90,
             "sources": [{"title": "The Viking Discovery of America", "author": "Helge Ingstad & Anne Stine Ingstad", "publication": "Checkmark Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2001}]},
        ],
    },
    {
        "slug": "battle-of-hastings-1066",
        "title": "Battle of Hastings — Norman Conquest of England",
        "year": 1066, "lat": 50.91, "lng": 0.49,
        "geo_modern": "Battle, East Sussex, England",
        "geo_era_label": "Medieval England",
        "category": "war", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "English historical perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "William of Normandy's defeat of Harold II at Hastings on October 14, 1066, transformed England forever. The Norman Conquest replaced the Anglo-Saxon aristocracy, introduced feudalism, reshaped the English language with French, and connected England to continental Europe.",
             "summary": "The conquest that reshaped English language, law, and society.", "evidence_score": 0.92,
             "sources": [{"title": "1066: The Year of the Conquest", "author": "David Howarth", "publication": "Viking Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1977}]},
        ],
    },

    # --- Feudal Europe ---
    {
        "slug": "charlemagne-crowned-holy-roman-emperor",
        "title": "Charlemagne Crowned Holy Roman Emperor",
        "year": 800, "lat": 41.90, "lng": 12.45,
        "geo_modern": "Rome, Italy",
        "geo_era_label": "Carolingian Empire",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "European historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Pope Leo III crowned Charlemagne Emperor of the Romans on Christmas Day 800 CE, reviving the concept of a Western Roman Empire. Charlemagne united much of Western Europe, promoted literacy and learning (the Carolingian Renaissance), and established the political framework of medieval Christendom.",
             "summary": "The coronation that created the framework for medieval European politics.", "evidence_score": 0.90,
             "sources": [{"title": "Charlemagne: Father of a Continent", "author": "Alessandro Barbero", "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },
    {
        "slug": "magna-carta-1215",
        "title": "Magna Carta Signed — Foundation of Constitutional Law",
        "year": 1215, "lat": 51.44, "lng": -0.56,
        "geo_modern": "Runnymede, Surrey, England",
        "geo_era_label": "Medieval England",
        "category": "political", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "Legal history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "King John was forced by rebellious barons to seal Magna Carta at Runnymede in 1215. Though largely a feudal document, its principles — that even the king is subject to law, the right to due process — became foundational to constitutional governance worldwide.",
             "summary": "The charter that established the principle that no one is above the law.", "evidence_score": 0.92,
             "sources": [{"title": "Magna Carta", "author": "David Carpenter", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}]},
        ],
    },
    {
        "slug": "black-death-arrives-europe",
        "title": "Black Death Arrives in Europe — Bubonic Plague Pandemic",
        "year": 1347, "lat": 38.12, "lng": 13.36,
        "geo_modern": "Messina, Sicily, Italy",
        "geo_era_label": "Late Medieval Europe",
        "category": "natural", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Black Death reached Europe via Genoese trading ships at Messina in 1347, killing an estimated 30–60% of Europe's population by 1353. This catastrophe shattered feudal society, created acute labor shortages, empowered surviving peasants, and fundamentally restructured European economics and culture.",
             "summary": "The deadliest pandemic in history, killing up to half of Europe's population.", "evidence_score": 0.92,
             "sources": [{"title": "The Black Death", "author": "John Hatcher", "publication": "Weidenfeld & Nicolson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}]},
        ],
    },
    {
        "slug": "hundred-years-war-begins",
        "title": "Hundred Years' War Begins — England vs France",
        "year": 1337, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Late Medieval Europe",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Hundred Years' War (1337–1453) was a series of conflicts between England and France over succession to the French throne. It transformed warfare (longbow, gunpowder), forged national identities, and ended with France's consolidation as a unified nation-state.",
             "summary": "The protracted conflict that forged English and French national identities.", "evidence_score": 0.87,
             "sources": [{"title": "The Hundred Years War", "author": "Jonathan Sumption", "publication": "University of Pennsylvania Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1990}]},
        ],
    },
    {
        "slug": "joan-of-arc-siege-of-orleans",
        "title": "Joan of Arc Lifts the Siege of Orléans",
        "year": 1429, "lat": 47.90, "lng": 1.90,
        "geo_modern": "Orléans, France",
        "geo_era_label": "Late Medieval France",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "French historical perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "In 1429, the teenage peasant Joan of Arc inspired French forces to break the English siege of Orléans, turning the tide of the Hundred Years' War. Her capture, trial for heresy, and execution at age 19 made her a martyr and enduring symbol of French resistance.",
             "summary": "A peasant girl's military triumph that saved France.", "evidence_score": 0.88,
             "sources": [{"title": "Joan of Arc: A History", "author": "Helen Castor", "publication": "Harper", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}]},
        ],
    },
    {
        "slug": "peasants-revolt-england-1381",
        "title": "Peasants' Revolt in England",
        "year": 1381, "lat": 51.51, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Late Medieval England",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Social history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The 1381 Peasants' Revolt, triggered by post-plague labor shortages and a poll tax, saw English peasants march on London under Wat Tyler. Though suppressed, it demonstrated that feudal serfdom was unsustainable and accelerated its decline in England.",
             "summary": "The uprising that signaled the death of English feudalism.", "evidence_score": 0.85,
             "sources": [{"title": "The Great Revolt of 1381", "author": "Charles Oman", "publication": "Clarendon Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1906}]},
        ],
    },

    # --- Mongol Empire ---
    {
        "slug": "genghis-khan-unites-mongols",
        "title": "Genghis Khan Unites the Mongol Tribes",
        "year": 1206, "lat": 48.0, "lng": 107.0,
        "geo_modern": "Khentii Province, Mongolia",
        "geo_era_label": "Mongol Empire",
        "category": "political", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "mn", "viewpoint_type": "academic",
             "narrative": "In 1206, Temüjin was proclaimed Genghis Khan (Universal Ruler) at a great assembly of Mongol tribes. He created the largest contiguous land empire in history, establishing the Yasa law code, religious tolerance, and a meritocratic military system that conquered from China to Eastern Europe.",
             "summary": "The founding of the largest contiguous land empire in history.", "evidence_score": 0.88,
             "sources": [{"title": "Genghis Khan and the Making of the Modern World", "author": "Jack Weatherford", "publication": "Crown", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },
    {
        "slug": "mongol-destruction-of-baghdad",
        "title": "Mongol Destruction of Baghdad — End of the Abbasid Caliphate",
        "year": 1258, "lat": 33.31, "lng": 44.37,
        "geo_modern": "Baghdad, Iraq",
        "geo_era_label": "Mongol Conquest",
        "category": "war", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "Islamic historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Hulagu Khan's Mongol army sacked Baghdad in 1258, killing the last Abbasid caliph and destroying the House of Wisdom's libraries. Estimates of deaths range from 200,000 to over a million. This catastrophe is often cited as the end of the Islamic Golden Age.",
             "summary": "The destruction that ended the Islamic Golden Age.", "evidence_score": 0.88,
             "sources": [{"title": "The Mongol Conquests", "author": "J.J. Saunders", "publication": "University of Pennsylvania Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1971}]},
        ],
    },
    {
        "slug": "pax-mongolica-trade-flourishes",
        "title": "Pax Mongolica — Transcontinental Trade Flourishes",
        "year": 1260, "lat": 47.92, "lng": 106.92,
        "geo_modern": "Karakorum, Mongolia",
        "geo_era_label": "Mongol Empire",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Pax Mongolica (roughly 1260–1360) enabled unprecedented transcontinental trade across Eurasia under Mongol protection. Merchants like Marco Polo traveled freely, goods and technologies (gunpowder, compass, paper) flowed between East and West, and the Silk Road experienced a revival.",
             "summary": "Mongol peace enabled the greatest era of Eurasian connectivity before the modern age.", "evidence_score": 0.82,
             "sources": [{"title": "The Mongol Empire and Its Legacy", "author": "Reuven Amitai-Preiss & David Morgan", "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}]},
        ],
    },

    # --- African Kingdoms ---
    {
        "slug": "mansa-musa-pilgrimage-1324",
        "title": "Mansa Musa's Pilgrimage to Mecca — Richest Man in History",
        "year": 1324, "lat": 12.65, "lng": -8.0,
        "geo_modern": "Timbuktu / Niani, Mali",
        "geo_era_label": "Mali Empire",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "African historical perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "In 1324, Mansa Musa of the Mali Empire embarked on a hajj to Mecca with an entourage of 60,000 and so much gold that he crashed the Egyptian economy for a decade. Often called the richest person in history, his pilgrimage put West Africa on European and Arab maps.",
             "summary": "The richest person in history displayed Mali's extraordinary wealth to the world.", "evidence_score": 0.85,
             "sources": [{"title": "Mansa Musa and the Empire of Mali", "author": "P. James Oliver", "publication": "CreateSpace", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}]},
        ],
    },
    {
        "slug": "great-zimbabwe-flourishes",
        "title": "Great Zimbabwe — Peak of a Southern African Kingdom",
        "year": 1300, "lat": -20.27, "lng": 30.93,
        "geo_modern": "Masvingo Province, Zimbabwe",
        "geo_era_label": "Medieval Southern Africa",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "African archaeological perspective", "culture_code": "zw", "viewpoint_type": "academic",
             "narrative": "Great Zimbabwe, built between the 11th and 15th centuries, was the capital of a powerful Shona trading kingdom. Its massive stone walls — constructed without mortar — housed up to 18,000 people and controlled gold and ivory trade routes to the Indian Ocean coast.",
             "summary": "The largest medieval stone structures in sub-Saharan Africa.", "evidence_score": 0.83,
             "sources": [{"title": "Great Zimbabwe", "author": "Shadreck Chirikure", "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2020}]},
        ],
    },

    # --- Americas ---
    {
        "slug": "classic-maya-collapse",
        "title": "Classic Maya Civilization Collapse",
        "year": 900, "lat": 17.22, "lng": -89.62,
        "geo_modern": "Tikal, Petén, Guatemala",
        "geo_era_label": "Classic Maya Period",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gt", "viewpoint_type": "academic",
             "narrative": "Around 900 CE, the great Maya cities of the southern lowlands were abandoned in a collapse likely driven by prolonged drought, warfare, deforestation, and political fragmentation. However, Maya civilization persisted in the northern Yucatán at sites like Chichén Itzá.",
             "summary": "The mysterious abandonment of one of the Americas' greatest civilizations.", "evidence_score": 0.82,
             "sources": [{"title": "The Classic Maya Collapse", "author": "T. Patrick Culbert", "publication": "University of New Mexico Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1973}]},
        ],
    },
    {
        "slug": "aztec-founding-tenochtitlan",
        "title": "Aztec Founding of Tenochtitlan",
        "year": 1325, "lat": 19.43, "lng": -99.13,
        "geo_modern": "Mexico City, Mexico",
        "geo_era_label": "Aztec Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Mesoamerican historical perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "According to Aztec tradition, the Mexica people founded Tenochtitlan in 1325 on an island in Lake Texcoco, where they saw an eagle perched on a cactus — an image now on Mexico's flag. By 1500, Tenochtitlan was one of the world's largest cities with over 200,000 inhabitants.",
             "summary": "The founding of what would become one of the world's greatest pre-Columbian cities.", "evidence_score": 0.85,
             "sources": [{"title": "The Aztecs", "author": "Michael Smith", "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}]},
        ],
    },
    {
        "slug": "inca-empire-expansion",
        "title": "Inca Empire Rapid Expansion under Pachacuti",
        "year": 1438, "lat": -13.52, "lng": -71.98,
        "geo_modern": "Cusco, Peru",
        "geo_era_label": "Inca Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Andean historical perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Under Sapa Inca Pachacuti (r. 1438–1471), the Inca Empire expanded from a small Cusco kingdom into Tawantinsuyu — the largest empire in pre-Columbian America, stretching 4,000 km along the Andes. He built Machu Picchu and established the administrative systems that unified diverse peoples.",
             "summary": "The rapid expansion of the Americas' largest pre-Columbian empire.", "evidence_score": 0.84,
             "sources": [{"title": "The Incas", "author": "Terence D'Altroy", "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}]},
        ],
    },

    # --- Additional Medieval ---
    {
        "slug": "university-of-bologna-founded",
        "title": "University of Bologna Founded — Birth of the University",
        "year": 1088, "lat": 44.49, "lng": 11.34,
        "geo_modern": "Bologna, Italy",
        "geo_era_label": "Medieval Europe",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Educational history perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "The University of Bologna, founded in 1088, is the oldest continuously operating university in the world. It pioneered the concept of academic freedom and self-governing scholarly communities, establishing a model that spread across Europe.",
             "summary": "The world's first university, establishing a model still used today.", "evidence_score": 0.87,
             "sources": [{"title": "A History of the University in Europe", "author": "Hilde de Ridder-Symoens", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}]},
        ],
    },
    {
        "slug": "compass-navigation-china",
        "title": "Magnetic Compass Used for Navigation in China",
        "year": 1040, "lat": 30.27, "lng": 120.15,
        "geo_modern": "Hangzhou, China",
        "geo_era_label": "Song Dynasty China",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "History of technology perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Chinese navigators began using the magnetic compass for maritime navigation around the 11th century. This technology spread to the Islamic world and then Europe, enabling the Age of Exploration and transforming global trade and warfare.",
             "summary": "The navigational tool that made global maritime exploration possible.", "evidence_score": 0.83,
             "sources": [{"title": "Science and Civilisation in China, Vol. 4", "author": "Joseph Needham", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1971}]},
        ],
    },
    {
        "slug": "khmer-empire-angkor-wat",
        "title": "Angkor Wat Built — Height of the Khmer Empire",
        "year": 1150, "lat": 13.41, "lng": 103.87,
        "geo_modern": "Siem Reap, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Southeast Asian history perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Angkor Wat, built by Suryavarman II around 1150, is the largest religious monument in the world. The Khmer Empire at its height controlled much of mainland Southeast Asia and supported a city complex of up to one million people — the largest pre-industrial city.",
             "summary": "The world's largest religious monument and greatest Khmer achievement.", "evidence_score": 0.86,
             "sources": [{"title": "Angkor and the Khmer Civilization", "author": "Michael Coe", "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}]},
        ],
    },

    # ──────────────────────────────────────────────────────────────────
    # EARLY MODERN PERIOD (1500–1800 CE)
    # ──────────────────────────────────────────────────────────────────

    {
        "slug": "gutenberg-printing-press",
        "title": "Gutenberg's Printing Press Revolutionizes Europe",
        "year": 1440, "lat": 50.0, "lng": 8.27,
        "geo_modern": "Mainz, Germany",
        "geo_era_label": "Late Medieval / Early Modern Europe",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "History of technology perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Johannes Gutenberg's development of movable type printing with oil-based ink around 1440 was arguably the most important invention of the second millennium. It made books affordable, fueled the Renaissance, enabled the Reformation, and democratized knowledge on an unprecedented scale.",
             "summary": "The invention that democratized knowledge and transformed civilization.", "evidence_score": 0.92,
             "sources": [{"title": "Gutenberg: How One Man Remade the World with Words", "author": "John Man", "publication": "Wiley", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}]},
        ],
    },
    {
        "slug": "ottoman-empire-suleiman-magnificent",
        "title": "Suleiman the Magnificent — Ottoman Empire at Its Zenith",
        "year": 1520, "lat": 41.01, "lng": 28.98,
        "geo_modern": "Istanbul, Turkey",
        "geo_era_label": "Ottoman Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Ottoman historical perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "Suleiman the Magnificent (r. 1520–1566) presided over the Ottoman Empire at its peak, controlling southeastern Europe, the Middle East, and North Africa. His legal reforms, architectural patronage, and military campaigns made the Ottoman Empire a dominant world power.",
             "summary": "The zenith of Ottoman power, rivaling any contemporary European state.", "evidence_score": 0.87,
             "sources": [{"title": "Suleiman the Magnificent", "author": "André Clot", "publication": "Saqi Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2005}]},
        ],
    },
    {
        "slug": "martin-luther-95-theses",
        "title": "Martin Luther Posts the 95 Theses — Protestant Reformation",
        "year": 1517, "lat": 51.87, "lng": 12.64,
        "geo_modern": "Wittenberg, Saxony-Anhalt, Germany",
        "geo_era_label": "Early Modern Europe",
        "category": "cultural", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "Religious history perspective", "culture_code": "de", "viewpoint_type": "academic",
             "narrative": "Martin Luther's posting of his 95 Theses on October 31, 1517, challenged papal authority and the sale of indulgences, sparking the Protestant Reformation. Enabled by the printing press, his ideas spread rapidly, permanently fracturing Western Christianity and reshaping European politics.",
             "summary": "The act that shattered Western Christian unity and remade European civilization.", "evidence_score": 0.92,
             "sources": [{"title": "Martin Luther: Renegade and Prophet", "author": "Lyndal Roper", "publication": "Random House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2017}]},
        ],
    },
    {
        "slug": "magellan-circumnavigation",
        "title": "Magellan's Expedition — First Circumnavigation of the Globe",
        "year": 1519, "lat": 36.53, "lng": -6.29,
        "geo_modern": "Sanlúcar de Barrameda, Spain",
        "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "Maritime history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Ferdinand Magellan departed Spain in 1519 with five ships. Though Magellan was killed in the Philippines in 1521, Juan Sebastián Elcano completed the circumnavigation in 1522 with one surviving ship. The voyage proved the Earth's spherical shape and revealed the true scale of the Pacific.",
             "summary": "The first voyage around the world, proving the globe's true scale.", "evidence_score": 0.90,
             "sources": [{"title": "Over the Edge of the World", "author": "Laurence Bergreen", "publication": "Morrow", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}]},
        ],
    },
    {
        "slug": "copernicus-heliocentric-model",
        "title": "Copernicus Publishes Heliocentric Model",
        "year": 1543, "lat": 53.77, "lng": 20.47,
        "geo_modern": "Frombork, Poland",
        "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "pl", "viewpoint_type": "academic",
             "narrative": "Nicolaus Copernicus published 'De revolutionibus orbium coelestium' in 1543, proposing that the Earth and planets orbit the Sun. This heliocentric model overturned 1,400 years of geocentric astronomy, launching the Scientific Revolution that transformed humanity's understanding of the cosmos.",
             "summary": "The book that displaced Earth from the center of the universe.", "evidence_score": 0.92,
             "sources": [{"title": "The Book Nobody Read", "author": "Owen Gingerich", "publication": "Walker & Company", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}]},
        ],
    },
    {
        "slug": "spanish-armada-defeated",
        "title": "Spanish Armada Defeated by England",
        "year": 1588, "lat": 50.37, "lng": -4.14,
        "geo_modern": "English Channel / Plymouth, England",
        "geo_era_label": "Elizabethan England",
        "category": "war", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Naval history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The defeat of the Spanish Armada in 1588 by English naval forces and storms ended Spain's plan to invade England and depose Elizabeth I. It marked the beginning of England's rise as a naval power and the decline of Spanish dominance in European affairs.",
             "summary": "The naval battle that shifted European power from Spain to England.", "evidence_score": 0.87,
             "sources": [{"title": "The Spanish Armada", "author": "Colin Martin & Geoffrey Parker", "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1999}]},
        ],
    },
    {
        "slug": "east-india-company-founded",
        "title": "British East India Company Founded",
        "year": 1600, "lat": 51.51, "lng": -0.12,
        "geo_modern": "London, England",
        "geo_era_label": "Early Colonial Period",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "Colonial history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The East India Company, chartered in 1600, became the vehicle for British colonization of India and much of Asia. Beginning as a trading company, it eventually controlled a subcontinent, maintained a private army, and laid the foundation for the British Empire.",
             "summary": "The corporation that became an empire, colonizing a quarter of the world.", "evidence_score": 0.88,
             "sources": [{"title": "The Anarchy: The East India Company, Corporate Violence, and the Pillage of an Empire", "author": "William Dalrymple", "publication": "Bloomsbury", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2019}]},
        ],
    },
    {
        "slug": "galileo-telescope-observations",
        "title": "Galileo's Telescopic Observations Confirm Copernicus",
        "year": 1610, "lat": 43.77, "lng": 11.25,
        "geo_modern": "Florence, Italy",
        "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "it", "viewpoint_type": "academic",
             "narrative": "In 1610, Galileo published 'Sidereus Nuncius', describing telescopic observations of Jupiter's moons, lunar craters, and Venus's phases. These observations provided empirical evidence for the Copernican heliocentric model and established observation as the foundation of modern science.",
             "summary": "The observations that proved Copernicus right and founded modern observational science.", "evidence_score": 0.92,
             "sources": [{"title": "Galileo's Daughter", "author": "Dava Sobel", "publication": "Walker", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1999}]},
        ],
    },
    {
        "slug": "mayflower-plymouth-colony",
        "title": "Mayflower Voyage — Plymouth Colony Founded",
        "year": 1620, "lat": 41.96, "lng": -70.66,
        "geo_modern": "Plymouth, Massachusetts, USA",
        "geo_era_label": "Colonial America",
        "category": "political", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "American colonial perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "The Mayflower carried 102 Pilgrims to Plymouth in 1620, where they established a self-governing colony. The Mayflower Compact — a social contract for governance — became a foundational document in American democratic tradition.",
             "summary": "The Pilgrim settlement that planted seeds of American self-governance.", "evidence_score": 0.87,
             "sources": [{"title": "Mayflower: A Story of Courage, Community, and War", "author": "Nathaniel Philbrick", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}]},
        ],
    },
    {
        "slug": "thirty-years-war",
        "title": "Thirty Years' War — Europe's Deadliest Religious Conflict",
        "year": 1618, "lat": 50.09, "lng": 14.42,
        "geo_modern": "Prague, Czech Republic",
        "geo_era_label": "Early Modern Europe",
        "category": "war", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "European historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Thirty Years' War (1618–1648), triggered by the Defenestration of Prague, devastated Central Europe with religious and dynastic warfare. Germany lost up to a third of its population. The Peace of Westphalia (1648) established the modern system of sovereign nation-states.",
             "summary": "The catastrophic war that gave birth to the modern international system.", "evidence_score": 0.88,
             "sources": [{"title": "The Thirty Years' War: Europe's Tragedy", "author": "Peter Wilson", "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2009}]},
        ],
    },
    {
        "slug": "peace-of-westphalia",
        "title": "Peace of Westphalia — Birth of the Nation-State System",
        "year": 1648, "lat": 52.03, "lng": 7.63,
        "geo_modern": "Osnabrück / Münster, Germany",
        "geo_era_label": "Early Modern Europe",
        "category": "political", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "International relations perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The 1648 Peace of Westphalia ended the Thirty Years' War and established the principle of state sovereignty — that each nation controls its own territory and religion without external interference. This Westphalian system remains the foundation of international relations.",
             "summary": "The treaties that created the modern system of sovereign nation-states.", "evidence_score": 0.88,
             "sources": [{"title": "The Peace of Westphalia", "author": "Derek Croxton", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}]},
        ],
    },
    {
        "slug": "english-civil-war",
        "title": "English Civil War — Parliament vs Crown",
        "year": 1642, "lat": 52.52, "lng": -1.47,
        "geo_modern": "Edgehill, Warwickshire, England",
        "geo_era_label": "Early Modern England",
        "category": "war", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "English historical perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The English Civil War (1642–1651) pitted Parliamentarians against Royalists over the limits of royal power. King Charles I was executed in 1649 — a revolutionary act that established the precedent that rulers are accountable to their people.",
             "summary": "The war that established parliamentary supremacy in England.", "evidence_score": 0.88,
             "sources": [{"title": "The English Civil War", "author": "Diane Purkiss", "publication": "HarperCollins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}]},
        ],
    },
    {
        "slug": "newton-principia-mathematica",
        "title": "Newton's Principia Mathematica — Laws of Motion and Gravity",
        "year": 1687, "lat": 52.20, "lng": 0.12,
        "geo_modern": "Cambridge, England",
        "geo_era_label": "Scientific Revolution",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Isaac Newton's 'Philosophiæ Naturalis Principia Mathematica' (1687) laid out the three laws of motion and the law of universal gravitation, unifying terrestrial and celestial mechanics. It is arguably the most important single work in the history of science.",
             "summary": "The work that unified physics and launched the modern scientific age.", "evidence_score": 0.95,
             "sources": [{"title": "Never at Rest: A Biography of Isaac Newton", "author": "Richard Westfall", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1980}]},
        ],
    },
    {
        "slug": "mughal-empire-akbar-golden-age",
        "title": "Akbar the Great — Mughal Empire's Golden Age",
        "year": 1556, "lat": 27.18, "lng": 78.02,
        "geo_modern": "Agra, India",
        "geo_era_label": "Mughal India",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "South Asian historical perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Akbar the Great (r. 1556–1605) expanded the Mughal Empire across most of the Indian subcontinent while promoting religious tolerance, administrative reform, and cultural synthesis. His reign produced remarkable art, architecture, and literature blending Hindu and Islamic traditions.",
             "summary": "The architect of Mughal India's greatest era of tolerance and cultural brilliance.", "evidence_score": 0.87,
             "sources": [{"title": "Akbar and His India", "author": "Irfan Habib", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997}]},
        ],
    },
    {
        "slug": "safavid-persia-shah-abbas",
        "title": "Shah Abbas I — Safavid Persia at Its Height",
        "year": 1588, "lat": 32.65, "lng": 51.68,
        "geo_modern": "Isfahan, Iran",
        "geo_era_label": "Safavid Persia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Persian historical perspective", "culture_code": "ir", "viewpoint_type": "academic",
             "narrative": "Shah Abbas I (r. 1588–1629) transformed the Safavid Empire into a major world power, making Isfahan one of the world's most beautiful cities. He established Shia Islam as the state religion of Iran — a legacy that endures to this day.",
             "summary": "The ruler who made Persia a great power and Isfahan a wonder of the world.", "evidence_score": 0.85,
             "sources": [{"title": "Iran Under the Safavids", "author": "Roger Savory", "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1980}]},
        ],
    },
    {
        "slug": "ming-dynasty-zheng-he-voyages",
        "title": "Zheng He's Treasure Voyages — Ming China's Naval Expeditions",
        "year": 1405, "lat": 32.06, "lng": 118.78,
        "geo_modern": "Nanjing, China",
        "geo_era_label": "Ming Dynasty China",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Chinese maritime history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Between 1405 and 1433, Admiral Zheng He led seven massive naval expeditions with fleets of up to 300 ships and 27,000 men, reaching Southeast Asia, India, Arabia, and East Africa. These voyages showcased Ming China's naval supremacy decades before European exploration began.",
             "summary": "China's extraordinary naval expeditions, decades before Columbus.", "evidence_score": 0.85,
             "sources": [{"title": "When China Ruled the Seas", "author": "Louise Levathes", "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}]},
        ],
    },
    {
        "slug": "act-of-union-great-britain",
        "title": "Act of Union — Great Britain Formed",
        "year": 1707, "lat": 55.95, "lng": -3.19,
        "geo_modern": "Edinburgh / London, United Kingdom",
        "geo_era_label": "Early Modern Britain",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "British political history perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "The Acts of Union in 1707 merged the kingdoms of England and Scotland into the Kingdom of Great Britain, creating a unified parliament in Westminster. This political union enabled the combined resources and talents that would build the British Empire.",
             "summary": "The merger that created Great Britain as a unified state.", "evidence_score": 0.87,
             "sources": [{"title": "The Union of 1707", "author": "Christopher Whatley", "publication": "Edinburgh University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}]},
        ],
    },
    {
        "slug": "american-declaration-of-independence",
        "title": "American Declaration of Independence",
        "year": 1776, "lat": 39.95, "lng": -75.15,
        "geo_modern": "Philadelphia, Pennsylvania, USA",
        "geo_era_label": "American Revolution",
        "category": "political", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "American historical perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "On July 4, 1776, the Continental Congress adopted the Declaration of Independence, drafted primarily by Thomas Jefferson. Its assertion that 'all men are created equal' with 'unalienable rights' to 'life, liberty, and the pursuit of happiness' became a foundational statement of democratic ideals worldwide.",
             "summary": "The founding document of American democracy and a global declaration of human rights.", "evidence_score": 0.95,
             "sources": [{"title": "American Scripture: Making the Declaration of Independence", "author": "Pauline Maier", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}]},
        ],
    },
    {
        "slug": "french-revolution-bastille",
        "title": "French Revolution — Storming of the Bastille",
        "year": 1789, "lat": 48.85, "lng": 2.37,
        "geo_modern": "Paris, France",
        "geo_era_label": "French Revolution",
        "category": "political", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "European historical perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The storming of the Bastille on July 14, 1789, symbolized the overthrow of the Ancien Régime and launched the French Revolution. The Declaration of the Rights of Man, abolition of feudalism, and radical political transformation reshaped not just France but all of modern political thought.",
             "summary": "The revolution that toppled monarchy and birthed modern democratic ideals.", "evidence_score": 0.92,
             "sources": [{"title": "Citizens: A Chronicle of the French Revolution", "author": "Simon Schama", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1989}]},
        ],
    },
    {
        "slug": "napoleon-seizes-power",
        "title": "Napoleon Seizes Power — Coup of 18 Brumaire",
        "year": 1799, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Napoleonic Era",
        "category": "political", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "French historical perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "Napoleon Bonaparte's coup d'état on November 9, 1799, ended the French Revolution and established the Consulate. Napoleon would crown himself Emperor in 1804, reshape European borders, spread revolutionary ideals through conquest, and introduce the Napoleonic Code that still underpins legal systems worldwide.",
             "summary": "The military genius who ended the Revolution and remade Europe.", "evidence_score": 0.90,
             "sources": [{"title": "Napoleon: A Life", "author": "Andrew Roberts", "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2014}]},
        ],
    },
    {
        "slug": "columbian-exchange-begins",
        "title": "Columbus Reaches the Americas — Columbian Exchange Begins",
        "year": 1492, "lat": 24.05, "lng": -74.53,
        "geo_modern": "San Salvador, Bahamas",
        "geo_era_label": "Age of Exploration",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1,
        "perspectives": [
            {"label": "Global historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Christopher Columbus's 1492 voyage initiated the Columbian Exchange — the massive transfer of plants, animals, diseases, and people between the Old and New Worlds. While devastating for indigenous populations through disease and colonization, it created the interconnected global world we inhabit today.",
             "summary": "The voyage that connected two hemispheres and reshaped the entire world.", "evidence_score": 0.92,
             "sources": [{"title": "1493: Uncovering the New World Columbus Created", "author": "Charles Mann", "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}]},
        ],
    },
    {
        "slug": "atlantic-slave-trade-peak",
        "title": "Atlantic Slave Trade — Forced Migration of Millions",
        "year": 1700, "lat": 6.3, "lng": 2.6,
        "geo_modern": "Ouidah, Benin (major embarkation port)",
        "geo_era_label": "Atlantic World",
        "category": "cultural", "importance_score": 0.9, "zoom_min": 1,
        "perspectives": [
            {"label": "Atlantic history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Atlantic slave trade forcibly transported an estimated 12.5 million Africans to the Americas between the 16th and 19th centuries, peaking around 1700–1800. This massive forced migration fueled colonial economies, devastated African societies, and created the African diaspora that shapes the Americas today.",
             "summary": "The largest forced migration in history, reshaping three continents.", "evidence_score": 0.90,
             "sources": [{"title": "The Slave Trade: The Story of the Atlantic Slave Trade", "author": "Hugh Thomas", "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}]},
        ],
    },
    {
        "slug": "qing-dynasty-conquers-china",
        "title": "Qing Dynasty Conquers China — Manchu Rule Established",
        "year": 1644, "lat": 39.91, "lng": 116.39,
        "geo_modern": "Beijing, China",
        "geo_era_label": "Qing Dynasty China",
        "category": "political", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Chinese historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Manchu conquest of Ming China in 1644 established the Qing Dynasty, which would rule until 1912. The Qing expanded China to its largest territorial extent, incorporating Tibet, Xinjiang, and Mongolia, while presiding over both cultural flourishing and eventual decline.",
             "summary": "The last imperial dynasty, which expanded China to its greatest extent.", "evidence_score": 0.87,
             "sources": [{"title": "The Qing Dynasty and Traditional Chinese Culture", "author": "Richard Smith", "publication": "Rowman & Littlefield", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2015}]},
        ],
    },
    {
        "slug": "enlightenment-age-of-reason",
        "title": "The Enlightenment — Age of Reason Transforms European Thought",
        "year": 1751, "lat": 48.86, "lng": 2.35,
        "geo_modern": "Paris, France",
        "geo_era_label": "Age of Enlightenment",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 1,
        "perspectives": [
            {"label": "Intellectual history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Enlightenment, epitomized by Diderot's Encyclopédie (1751–1772), championed reason, science, individual rights, and skepticism of authority. Thinkers like Voltaire, Rousseau, Locke, and Kant provided the intellectual foundation for democratic revolutions and the modern secular world.",
             "summary": "The intellectual revolution that produced modern democracy, science, and human rights.", "evidence_score": 0.88,
             "sources": [{"title": "The Enlightenment: The Pursuit of Happiness, 1680–1790", "author": "Ritchie Robertson", "publication": "Harper", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}]},
        ],
    },
    {
        "slug": "habsburg-empire-charles-v",
        "title": "Charles V — Habsburg Empire at Its Height",
        "year": 1519, "lat": 50.07, "lng": 14.44,
        "geo_modern": "Central Europe / Spain",
        "geo_era_label": "Early Modern Europe",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "European political history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Charles V (r. 1519–1556) ruled the Holy Roman Empire, Spain, the Netherlands, and vast American territories — the most extensive European dominion since Charlemagne. His inability to suppress Protestantism or unify Europe foreshadowed the Wars of Religion.",
             "summary": "The last attempt to create a universal European Christian empire.", "evidence_score": 0.85,
             "sources": [{"title": "Emperor Charles V", "author": "Geoffrey Parker", "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2019}]},
        ],
    },
]

# ═══════════════════════════════════════════════════════════════════════
# CAUSALITY LINKS (slug pairs)
# ═══════════════════════════════════════════════════════════════════════

CAUSALITY_LINKS: list[dict[str, Any]] = [
    # Gutenberg → Reformation → Religious wars → Westphalia
    {"cause": "gutenberg-printing-press", "effect": "martin-luther-95-theses",
     "link_type": "direct", "strength": 0.9, "description": "The printing press enabled rapid dissemination of Luther's ideas across Europe"},
    {"cause": "martin-luther-95-theses", "effect": "thirty-years-war",
     "link_type": "direct", "strength": 0.85, "description": "The Protestant Reformation sparked the religious conflicts that escalated into the Thirty Years' War"},
    {"cause": "thirty-years-war", "effect": "peace-of-westphalia",
     "link_type": "direct", "strength": 0.95, "description": "The Thirty Years' War's devastation led directly to the Peace of Westphalia"},

    # Black Death → labor scarcity → peasant revolts → end of feudalism
    {"cause": "black-death-arrives-europe", "effect": "peasants-revolt-england-1381",
     "link_type": "direct", "strength": 0.85, "description": "Post-plague labor shortages empowered surviving peasants, triggering revolts against feudal obligations"},

    # Mongol Baghdad → Islamic Golden Age ends → Renaissance
    {"cause": "mongol-destruction-of-baghdad", "effect": "fall-of-constantinople-1453",
     "link_type": "indirect", "strength": 0.5, "description": "Mongol destabilization weakened the broader Islamic world, altering regional power dynamics"},
    {"cause": "fall-of-constantinople-1453", "effect": "gutenberg-printing-press",
     "link_type": "contributing", "strength": 0.6, "description": "Greek scholars fleeing Constantinople brought classical knowledge westward, stimulating Renaissance learning and demand for books"},

    # Columbus → Columbian Exchange → Slave Trade → Colonial empires
    {"cause": "columbian-exchange-begins", "effect": "atlantic-slave-trade-peak",
     "link_type": "direct", "strength": 0.85, "description": "European colonization of the Americas created demand for enslaved labor to work plantations"},
    {"cause": "columbian-exchange-begins", "effect": "east-india-company-founded",
     "link_type": "contributing", "strength": 0.7, "description": "Columbus's success inspired further European maritime expansion and colonial ventures"},

    # Scientific Revolution chain: Copernicus → Galileo → Newton
    {"cause": "copernicus-heliocentric-model", "effect": "galileo-telescope-observations",
     "link_type": "direct", "strength": 0.9, "description": "Galileo sought to confirm Copernicus's heliocentric theory through telescopic observation"},
    {"cause": "galileo-telescope-observations", "effect": "newton-principia-mathematica",
     "link_type": "direct", "strength": 0.8, "description": "Galileo's empirical methods and findings provided the foundation Newton built upon"},
    {"cause": "newton-principia-mathematica", "effect": "enlightenment-age-of-reason",
     "link_type": "direct", "strength": 0.85, "description": "Newton's rational mechanics inspired Enlightenment thinkers to apply reason to all domains"},

    # Enlightenment → French/American Revolutions
    {"cause": "enlightenment-age-of-reason", "effect": "american-declaration-of-independence",
     "link_type": "direct", "strength": 0.9, "description": "Enlightenment ideals of natural rights and consent of the governed directly inspired the Declaration"},
    {"cause": "enlightenment-age-of-reason", "effect": "french-revolution-bastille",
     "link_type": "direct", "strength": 0.85, "description": "Enlightenment philosophy provided the intellectual foundation for revolutionary ideals"},
    {"cause": "american-declaration-of-independence", "effect": "french-revolution-bastille",
     "link_type": "contributing", "strength": 0.7, "description": "The American Revolution's success inspired French revolutionaries"},
    {"cause": "french-revolution-bastille", "effect": "napoleon-seizes-power",
     "link_type": "direct", "strength": 0.9, "description": "Revolutionary instability and foreign wars created conditions for Napoleon's rise"},

    # House of Wisdom → Al-Khwarizmi
    {"cause": "house-of-wisdom-baghdad", "effect": "al-khwarizmi-algebra",
     "link_type": "direct", "strength": 0.85, "description": "Al-Khwarizmi worked at the House of Wisdom, which provided the scholarly environment for his breakthroughs"},
    {"cause": "house-of-wisdom-baghdad", "effect": "avicenna-canon-of-medicine",
     "link_type": "contributing", "strength": 0.7, "description": "The translation movement centered at the House of Wisdom preserved the Greek medical texts Avicenna built upon"},

    # Genghis Khan → Pax Mongolica → destruction of Baghdad
    {"cause": "genghis-khan-unites-mongols", "effect": "mongol-destruction-of-baghdad",
     "link_type": "direct", "strength": 0.9, "description": "Genghis Khan's empire-building set in motion the Mongol conquests that destroyed Baghdad under his grandson"},
    {"cause": "genghis-khan-unites-mongols", "effect": "pax-mongolica-trade-flourishes",
     "link_type": "direct", "strength": 0.85, "description": "Mongol unification of Eurasia created the conditions for transcontinental peace and trade"},

    # Battle of Hastings → Magna Carta
    {"cause": "battle-of-hastings-1066", "effect": "magna-carta-1215",
     "link_type": "indirect", "strength": 0.6, "description": "Norman feudal structures created the baronial class that eventually forced Magna Carta on the crown"},

    # Magna Carta → English Civil War → American Revolution
    {"cause": "magna-carta-1215", "effect": "english-civil-war",
     "link_type": "indirect", "strength": 0.65, "description": "Magna Carta's principle that the king is subject to law was invoked by Parliament against Charles I"},
    {"cause": "english-civil-war", "effect": "american-declaration-of-independence",
     "link_type": "indirect", "strength": 0.6, "description": "English revolutionary precedents informed American colonists' claims to self-governance"},

    # First Crusade → Fourth Crusade
    {"cause": "first-crusade-1095", "effect": "fourth-crusade-sack-of-constantinople",
     "link_type": "indirect", "strength": 0.6, "description": "The crusading movement launched in 1095 devolved into the catastrophic Fourth Crusade"},

    # Gunpowder → transformation of warfare
    {"cause": "invention-of-gunpowder-china", "effect": "spanish-armada-defeated",
     "link_type": "indirect", "strength": 0.6, "description": "Chinese gunpowder technology eventually transformed European naval warfare"},

    # Tang Dynasty → Silk Road peak
    {"cause": "tang-dynasty-golden-age", "effect": "silk-road-peak-tang-song",
     "link_type": "direct", "strength": 0.8, "description": "Tang cosmopolitanism and stability enabled the Silk Road to reach its commercial peak"},

    # Charlemagne → University system
    {"cause": "charlemagne-crowned-holy-roman-emperor", "effect": "university-of-bologna-founded",
     "link_type": "indirect", "strength": 0.55, "description": "The Carolingian Renaissance's revival of learning laid groundwork for medieval universities"},
]


async def seed(conn: asyncpg.Connection) -> None:
    # ── Load existing state ──
    rows = await conn.fetch("SELECT id, slug FROM events")
    slug_to_id: dict[str, str] = {r["slug"]: str(r["id"]) for r in rows}
    event_count_before = len(rows)

    link_rows = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    inserted = 0
    skipped = 0

    for event in EVENTS:
        slug = event["slug"]
        if slug in slug_to_id:
            print(f"  [skip] {slug}")
            skipped += 1
            continue

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
            VALUES ('event', $1, 'create', $2, 'ai', 'Medieval + early modern seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")
        inserted += 1

    print(f"\nEvents: {inserted} inserted, {skipped} skipped")

    # ── Causality links ──
    links_inserted = 0
    links_skipped = 0
    links_not_found = 0

    for link in CAUSALITY_LINKS:
        cause_slug = link["cause"]
        effect_slug = link["effect"]
        cause_id = slug_to_id.get(cause_slug)
        effect_id = slug_to_id.get(effect_slug)

        if not cause_id or not effect_id:
            print(f"  [warn] Missing event for link {cause_slug} -> {effect_slug}")
            links_not_found += 1
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
            """, link_id, cause_id, effect_id, link["link_type"], link["strength"],
                link["description"], CREATED_BY)
            existing_links.add((cause_id, effect_id))
            links_inserted += 1
            print(f"  [link] {cause_slug} -> {effect_slug}")
        except Exception as exc:
            print(f"  [warn] Link {cause_slug} -> {effect_slug}: {exc}")

    print(f"\nLinks: {links_inserted} inserted, {links_skipped} skipped, {links_not_found} not found")

    # ── Final totals ──
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nFinal totals: {total_events} events, {total_links} links")
    print(f"Added: {total_events - event_count_before} events, {total_links - link_count_before} links")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
