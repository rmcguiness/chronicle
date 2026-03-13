#!/usr/bin/env python3
"""
Chronicle seed script — underrepresented regions v2.

Regions:
  - Southeast Asian kingdoms (500-1600 CE)
  - Central Asia & Silk Road (200 BCE - 1500 CE)
  - Pacific & Oceania (800-1800 CE)
  - 19th-20th century Africa

Run:
    python backend/scripts/seed_underrepresented_v2.py
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

CREATED_BY = "seed-script:underrepresented-v2"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ═══════════════════════════════════════════════════════════════════════════
# ~80 EVENTS
# ═══════════════════════════════════════════════════════════════════════════

EVENTS: list[dict[str, Any]] = [
    # ─── SOUTHEAST ASIA: KHMER EMPIRE ───
    {
        "slug": "khmer-empire-founding-802",
        "title": "Founding of the Khmer Empire by Jayavarman II",
        "year": 802, "is_bce": False,
        "lat": 13.41, "lng": 103.87,
        "geo_modern": "Siem Reap Province, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Cambodian historical perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Jayavarman II unified the warring Khmer polities and declared independence from Javanese suzerainty atop Phnom Kulen in 802 CE. His devaraja (god-king) cult established the sacral kingship that would underpin the Khmer Empire for six centuries.",
             "summary": "Unification of Khmer polities under divine kingship.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Civilization of Angkor", "author": "Charles Higham",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "angkor-wat-construction-1113",
        "title": "Construction of Angkor Wat",
        "year": 1113, "is_bce": False,
        "lat": 13.4125, "lng": 103.8670,
        "geo_modern": "Angkor, Siem Reap, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "cultural", "importance_score": 0.9, "zoom_min": 2,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Suryavarman II commissioned Angkor Wat as a state temple and eventual mausoleum dedicated to Vishnu. The largest religious monument ever built, it covers 162 hectares with elaborate bas-reliefs depicting Hindu epics and historical scenes. Its construction required an estimated 300,000 workers and 6,000 elephants.",
             "summary": "The world's largest religious monument, a masterpiece of Khmer architecture.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Angkor and the Khmer Civilization", "author": "Michael D. Coe",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "jayavarman-vii-reign-1181",
        "title": "Reign of Jayavarman VII — Khmer Empire at Greatest Extent",
        "year": 1181, "is_bce": False,
        "lat": 13.44, "lng": 103.86,
        "geo_modern": "Angkor Thom, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Southeast Asian perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "After defeating the Cham invaders who had sacked Angkor in 1177, Jayavarman VII rebuilt the capital as Angkor Thom and expanded the empire to its greatest extent, stretching from Vietnam to Myanmar. He converted state religion to Mahayana Buddhism and built an extensive network of hospitals, rest houses, and roads.",
             "summary": "The greatest Khmer king expanded the empire and built Angkor Thom.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Jayavarman VII et son royaume", "author": "Claude Jacques",
                  "publication": "Journal Asiatique", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "khmer-hydraulic-system-baray",
        "title": "Khmer Hydraulic Engineering — The Great Baray Reservoirs",
        "year": 900, "is_bce": False,
        "lat": 13.43, "lng": 103.92,
        "geo_modern": "Angkor, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Environmental history perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "The Khmer Empire constructed massive water management infrastructure including the West Baray (8 km × 2.1 km) and East Baray. This hydraulic network supported intensive rice agriculture feeding up to 750,000 people at Angkor, making it the largest pre-industrial city in the world.",
             "summary": "Massive reservoirs that sustained the world's largest pre-industrial city.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Hydraulic City: Water Management at Angkor", "author": "Damian Evans et al.",
                  "publication": "Antiquity", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "angkor-decline-1431",
        "title": "Fall of Angkor to Ayutthaya",
        "year": 1431, "is_bce": False,
        "lat": 13.41, "lng": 103.87,
        "geo_modern": "Angkor, Cambodia",
        "geo_era_label": "Post-Angkor period",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Southeast Asian perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "The Thai kingdom of Ayutthaya sacked Angkor in 1431, ending centuries of Khmer dominance. However, recent research suggests the city's decline was already underway due to failure of its hydraulic infrastructure from prolonged droughts and monsoon variability in the 14th-15th centuries.",
             "summary": "Thai conquest ended Angkor's reign, compounded by hydraulic collapse.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The fall of the Khmer Empire", "author": "Brendan Buckley et al.",
                  "publication": "Proceedings of the National Academy of Sciences", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    # ─── SOUTHEAST ASIA: SRIVIJAYA ───
    {
        "slug": "srivijaya-maritime-empire-650",
        "title": "Rise of the Srivijaya Maritime Empire",
        "year": 650, "is_bce": False,
        "lat": -2.99, "lng": 104.76,
        "geo_modern": "Palembang, South Sumatra, Indonesia",
        "geo_era_label": "Srivijaya Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Maritime Southeast Asian perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Srivijaya emerged as the dominant maritime power in Southeast Asia, controlling the Strait of Malacca and the Sunda Strait — the two critical chokepoints of Indian Ocean-China Sea trade. Based at Palembang, it became the region's richest and most powerful thalassocracy for over 600 years.",
             "summary": "A powerful maritime empire controlling key Southeast Asian trade straits.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Srivijaya: History, Religion and Language of an Early Malay Polity", "author": "George Coedès",
                  "publication": "Malaysian Branch of the Royal Asiatic Society", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1918}
             ]},
        ],
    },
    {
        "slug": "srivijaya-buddhist-center-700",
        "title": "Srivijaya as Major Buddhist Learning Center",
        "year": 700, "is_bce": False,
        "lat": -2.99, "lng": 104.76,
        "geo_modern": "Palembang, Indonesia",
        "geo_era_label": "Srivijaya Empire",
        "category": "religious", "importance_score": 0.65, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Buddhist studies perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "The Chinese monk Yijing (I-Tsing) spent years at Srivijaya in the 670s-690s, reporting that over a thousand Buddhist monks studied there. He recommended Chinese pilgrims stop at Srivijaya to learn Sanskrit grammar before proceeding to India's Nalanda university. Srivijaya became a crucial node in the transmission of Buddhism from India to East Asia.",
             "summary": "A major Buddhist center where Chinese pilgrims studied before traveling to India.", "evidence_score": 0.82,
             "sources": [
                 {"title": "A Record of the Buddhist Religion as Practised in India and the Malay Archipelago", "author": "I-Tsing (tr. J. Takakusu)",
                  "publication": "Clarendon Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1896}
             ]},
        ],
    },
    {
        "slug": "srivijaya-chola-raid-1025",
        "title": "Chola Raid on Srivijaya",
        "year": 1025, "is_bce": False,
        "lat": -2.99, "lng": 104.76,
        "geo_modern": "Palembang, Indonesia",
        "geo_era_label": "Srivijaya Empire",
        "category": "military", "importance_score": 0.65, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Indian Ocean trade perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The South Indian Chola dynasty under Rajendra Chola I launched a devastating naval expedition against Srivijaya in 1025, raiding Palembang and capturing the Srivijayan king. This remarkable long-distance naval campaign marked the peak of Chola maritime power and permanently weakened Srivijaya's monopoly over the Strait of Malacca trade.",
             "summary": "A Chola naval raid that shattered Srivijaya's trade monopoly.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Southeast Asia in the Age of Commerce 1450-1680", "author": "Anthony Reid",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    # ─── SOUTHEAST ASIA: MAJAPAHIT ───
    {
        "slug": "majapahit-empire-founding-1293",
        "title": "Founding of the Majapahit Empire",
        "year": 1293, "is_bce": False,
        "lat": -7.62, "lng": 112.40,
        "geo_modern": "Trowulan, East Java, Indonesia",
        "geo_era_label": "Majapahit Empire",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Indonesian historical perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Raden Wijaya founded Majapahit after cleverly exploiting a Mongol-Yuan invasion force sent to punish the king of Singhasari. He allied with the Mongols to defeat his rivals, then turned on the Mongol forces and drove them out, establishing Java's greatest empire.",
             "summary": "Java's greatest empire, founded by exploiting a Mongol invasion.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Majapahit: New Facts and Old Fakes", "author": "Hermann Kulke",
                  "publication": "Bijdragen tot de Taal-, Land- en Volkenkunde", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "gajah-mada-palapa-oath-1336",
        "title": "Gajah Mada's Palapa Oath — Vow to Unite the Archipelago",
        "year": 1336, "is_bce": False,
        "lat": -7.62, "lng": 112.40,
        "geo_modern": "Trowulan, East Java, Indonesia",
        "geo_era_label": "Majapahit Empire",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Indonesian national perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Gajah Mada, mahapatih (prime minister) of Majapahit, swore the Palapa Oath in 1336, vowing not to taste spices until he had united the entire Nusantara (archipelago) under Majapahit rule. This oath became a foundational symbol of Indonesian national unity, and the name 'Palapa' was adopted for Indonesia's first satellite in 1976.",
             "summary": "A legendary oath to unite the Indonesian archipelago under Majapahit.", "evidence_score": 0.7,
             "sources": [
                 {"title": "Nagarakretagama (Desawarñana)", "author": "Mpu Prapañca (tr. Stuart Robson)",
                  "publication": "KITLV Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "majapahit-peak-hayam-wuruk-1350",
        "title": "Majapahit Empire at Peak Under Hayam Wuruk",
        "year": 1350, "is_bce": False,
        "lat": -7.62, "lng": 112.40,
        "geo_modern": "Trowulan, East Java, Indonesia",
        "geo_era_label": "Majapahit Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Southeast Asian perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Under King Hayam Wuruk (r. 1350-1389) and his prime minister Gajah Mada, the Majapahit Empire reached its zenith, claiming suzerainty over much of maritime Southeast Asia including Sumatra, Borneo, Bali, and parts of the Philippines. The court poet Prapanca documented this golden age in the Nagarakretagama.",
             "summary": "The golden age of Java's greatest empire, spanning the archipelago.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Java in the 14th Century: A Study in Cultural History", "author": "Theodore G. Th. Pigeaud",
                  "publication": "Martinus Nijhoff", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1960}
             ]},
        ],
    },
    {
        "slug": "majapahit-decline-islamic-conversion-1500",
        "title": "Decline of Majapahit and Rise of Islamic Sultanates",
        "year": 1500, "is_bce": False,
        "lat": -7.62, "lng": 112.40,
        "geo_modern": "East Java, Indonesia",
        "geo_era_label": "Late Majapahit",
        "category": "religious", "importance_score": 0.65, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Religious transition perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "By the late 15th century, Majapahit's Hindu-Buddhist empire was crumbling as coastal vassal states converted to Islam and established independent sultanates. The Sultanate of Demak struck the final blow around 1527. This transition marked the Islamization of Java, though Hindu-Buddhist traditions survived in Bali and in Javanese syncretic culture.",
             "summary": "Islamic sultanates replaced the Hindu-Buddhist Majapahit Empire.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Islamization of Java", "author": "M.C. Ricklefs",
                  "publication": "Archipel", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    # ─── SOUTHEAST ASIA: DAI VIET ───
    {
        "slug": "dai-viet-independence-938",
        "title": "Vietnamese Independence from China — Battle of Bạch Đằng",
        "year": 938, "is_bce": False,
        "lat": 20.93, "lng": 106.72,
        "geo_modern": "Bạch Đằng River, Quảng Ninh, Vietnam",
        "geo_era_label": "Dai Viet",
        "category": "military", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Vietnamese perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "Ngô Quyền defeated the Southern Han Chinese fleet at the Battle of Bạch Đằng River in 938 CE by planting iron-tipped stakes in the riverbed, ending over a millennium of Chinese rule. This decisive victory established Vietnamese independence and is celebrated as one of the most important events in Vietnamese history.",
             "summary": "A naval victory that ended 1,000 years of Chinese rule over Vietnam.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Vietnam: A New History", "author": "Christopher Goscha",
                  "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "ly-dynasty-hanoi-founded-1010",
        "title": "Lý Dynasty Founds Thăng Long (Hanoi)",
        "year": 1010, "is_bce": False,
        "lat": 21.03, "lng": 105.85,
        "geo_modern": "Hanoi, Vietnam",
        "geo_era_label": "Dai Viet (Lý dynasty)",
        "category": "political", "importance_score": 0.65, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Vietnamese perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "Emperor Lý Thái Tổ moved the capital to Thăng Long ('Rising Dragon'), founding what is today Hanoi. The Lý dynasty consolidated Vietnamese statehood, established a Confucian bureaucracy, built the Temple of Literature (Vietnam's first university), and developed a distinct national identity separate from China.",
             "summary": "Founding of Hanoi and consolidation of Vietnamese national identity.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Birth of Vietnam", "author": "Keith Weller Taylor",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "dai-viet-defeats-mongols-1288",
        "title": "Dai Viet Defeats Mongol Invasion — Third Battle of Bạch Đằng",
        "year": 1288, "is_bce": False,
        "lat": 20.93, "lng": 106.72,
        "geo_modern": "Bạch Đằng River, Vietnam",
        "geo_era_label": "Dai Viet (Trần dynasty)",
        "category": "military", "importance_score": 0.8, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Vietnamese military perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "General Trần Hưng Đạo repelled the third Mongol-Yuan invasion by recreating Ngô Quyền's 938 CE tactic of planting iron-tipped stakes at Bạch Đằng River. The Yuan fleet was destroyed, ending Kublai Khan's ambitions to conquer Southeast Asia. Vietnam was one of the few nations to successfully resist the Mongol Empire.",
             "summary": "Vietnam repelled three Mongol invasions, a rare feat in world history.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Southeast Asia in the Age of Commerce", "author": "Anthony Reid",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "champa-kingdom-rise-192",
        "title": "Rise of the Kingdom of Champa",
        "year": 192, "is_bce": False,
        "lat": 15.93, "lng": 108.33,
        "geo_modern": "Central Vietnam",
        "geo_era_label": "Champa Kingdom",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Southeast Asian perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "The Indianized kingdom of Champa emerged along central Vietnam's coast, becoming a major maritime trading power and building elaborate Hindu temple complexes at Mỹ Sơn. For over a millennium, Champa engaged in intermittent warfare with both the Khmer Empire to the west and Dai Viet to the north.",
             "summary": "An Indianized maritime kingdom that rivaled the Khmer and Vietnamese.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Champa and the Archaeology of Mỹ Sơn", "author": "Andrew Hardy et al.",
                  "publication": "NUS Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    # ─── SOUTHEAST ASIA: OTHER ───
    {
        "slug": "pagan-kingdom-burma-1044",
        "title": "Anawrahta Founds the Pagan Kingdom of Burma",
        "year": 1044, "is_bce": False,
        "lat": 21.17, "lng": 94.87,
        "geo_modern": "Bagan, Myanmar",
        "geo_era_label": "Pagan Kingdom",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Burmese historical perspective", "culture_code": "mm", "viewpoint_type": "academic",
             "narrative": "King Anawrahta unified Burma and adopted Theravada Buddhism as the state religion after conquering the Mon kingdom of Thaton. He built over 10,000 Buddhist temples at Bagan, creating one of the world's greatest concentrations of religious architecture. Pagan became the first Burmese empire.",
             "summary": "The first Burmese empire, with thousands of Buddhist temples at Bagan.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Making of Modern Burma", "author": "Thant Myint-U",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "sukhothai-kingdom-1238",
        "title": "Founding of the Sukhothai Kingdom",
        "year": 1238, "is_bce": False,
        "lat": 17.01, "lng": 99.70,
        "geo_modern": "Sukhothai, Thailand",
        "geo_era_label": "Sukhothai Kingdom",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Thai historical perspective", "culture_code": "th", "viewpoint_type": "academic",
             "narrative": "The Sukhothai Kingdom is traditionally regarded as the first Thai kingdom, established after local chieftains threw off Khmer suzerainty. Under King Ramkhamhaeng the Great, Sukhothai developed the Thai script, established Theravada Buddhism as the state religion, and created the political foundations of the Thai state.",
             "summary": "The first Thai kingdom, birthplace of the Thai script.", "evidence_score": 0.78,
             "sources": [
                 {"title": "A History of Thailand", "author": "Chris Baker and Pasuk Phongpaichit",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "ayutthaya-kingdom-1351",
        "title": "Founding of the Ayutthaya Kingdom",
        "year": 1351, "is_bce": False,
        "lat": 14.35, "lng": 100.57,
        "geo_modern": "Ayutthaya, Thailand",
        "geo_era_label": "Ayutthaya Kingdom",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Thai perspective", "culture_code": "th", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Ayutthaya became one of the largest and most cosmopolitan cities in the world by the 17th century, with a population exceeding one million. It absorbed Sukhothai, conquered the Khmer, and became a major hub of international trade, attracting merchants from Japan, China, India, Persia, and Europe.",
             "summary": "A Thai kingdom that became one of the world's largest cities.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Ayutthaya: Venice of the East", "author": "Chris Baker",
                  "publication": "Silkworm Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "malacca-sultanate-1400",
        "title": "Founding of the Malacca Sultanate",
        "year": 1400, "is_bce": False,
        "lat": 2.19, "lng": 102.25,
        "geo_modern": "Malacca, Malaysia",
        "geo_era_label": "Malacca Sultanate",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Malay world perspective", "culture_code": "my", "viewpoint_type": "academic",
             "narrative": "Parameswara, a Srivijayan prince, founded the port city of Malacca around 1400. It quickly became the richest entrepôt in Southeast Asia, dominating the strait trade. The sultan's conversion to Islam accelerated Islamization throughout maritime Southeast Asia. Malacca's legal code (Undang-Undang Melaka) became the basis of Malay law.",
             "summary": "A trading port whose conversion to Islam transformed maritime Southeast Asia.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Malay Annals (Sejarah Melayu)", "author": "Tun Sri Lanang (tr. C.C. Brown)",
                  "publication": "Oxford University Press", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": True, "year": 1970}
             ]},
        ],
    },
    # ─── CENTRAL ASIA & SILK ROAD ───
    {
        "slug": "silk-road-established-han-dynasty-130bce",
        "title": "Silk Road Established Under the Han Dynasty",
        "year": -130, "is_bce": True,
        "lat": 40.08, "lng": 94.66,
        "geo_modern": "Dunhuang, Gansu, China",
        "geo_era_label": "Han Dynasty",
        "category": "economic", "importance_score": 0.9, "zoom_min": 2,
        "region": "central_asia",
        "perspectives": [
            {"label": "Eurasian trade history perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Following Zhang Qian's diplomatic missions to Central Asia (138-126 BCE), the Han Dynasty established regular overland trade routes connecting China to the Mediterranean. These 'Silk Roads' facilitated not just commerce in silk, spices, and precious metals, but the transmission of religions, technologies, and diseases across Eurasia for 1,500 years.",
             "summary": "The Han Dynasty opened the world's most consequential trade network.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Silk Roads: A New History of the World", "author": "Peter Frankopan",
                  "publication": "Bloomsbury", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "zhang-qian-mission-central-asia-138bce",
        "title": "Zhang Qian's Mission to Central Asia",
        "year": -138, "is_bce": True,
        "lat": 39.47, "lng": 75.99,
        "geo_modern": "Kashgar, Xinjiang, China",
        "geo_era_label": "Han Dynasty",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Chinese exploration perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Emperor Wu sent Zhang Qian west to forge an alliance against the Xiongnu nomads. Though captured and held for ten years, Zhang eventually reached the Greco-Bactrian kingdoms and returned with detailed knowledge of Central Asian civilizations. His reports opened China's eyes to the wider world and led to the Silk Road trade.",
             "summary": "A diplomatic mission that opened China to Central Asia and the West.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Records of the Grand Historian (Shiji)", "author": "Sima Qian",
                  "publication": "Columbia University Press", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "kushan-empire-peak-150",
        "title": "Kushan Empire at Peak — Gandhara Buddhist Art Flourishes",
        "year": 150, "is_bce": False,
        "lat": 34.17, "lng": 71.83,
        "geo_modern": "Peshawar, Pakistan",
        "geo_era_label": "Kushan Empire",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Central Asian civilizational perspective", "culture_code": "pk", "viewpoint_type": "academic",
             "narrative": "Under Emperor Kanishka I, the Kushan Empire stretched from the Aral Sea to the Ganges. The Kushans patronized Gandhara art, a Greco-Buddhist synthesis that produced the first anthropomorphic depictions of the Buddha. This artistic and religious fusion was transmitted along the Silk Road to China, Korea, and Japan.",
             "summary": "A Central Asian empire that fused Greek and Buddhist art, shaping Asia.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Kushan Empire", "author": "Craig Benjamin",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "kushan-buddhism-spread-east-200",
        "title": "Kushan Patronage Spreads Buddhism Along the Silk Road",
        "year": 200, "is_bce": False,
        "lat": 36.68, "lng": 67.12,
        "geo_modern": "Balkh, Afghanistan",
        "geo_era_label": "Kushan Empire",
        "category": "religious", "importance_score": 0.7, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Buddhist diffusion perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Kushan Empire served as the primary vector for Buddhism's transmission from India to Central and East Asia. Kushan-era monasteries at Bamiyan, Balkh, and along the Silk Road oases became stepping stones for Buddhist missionaries reaching China during the Han dynasty, fundamentally transforming East Asian civilization.",
             "summary": "Kushan patronage was the key vector for Buddhism's spread to East Asia.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Buddhism and the Silk Road", "author": "Erik Zürcher",
                  "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "sogdian-merchants-silk-road-500",
        "title": "Sogdian Merchants Dominate Silk Road Trade",
        "year": 500, "is_bce": False,
        "lat": 39.65, "lng": 66.96,
        "geo_modern": "Samarkand, Uzbekistan",
        "geo_era_label": "Sogdiana",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Central Asian trade perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "The Sogdians of Central Asia became the dominant merchant class of the Silk Road from roughly 300-900 CE. Operating from Samarkand and Bukhara, Sogdian trading colonies stretched from Byzantium to China. They served as cultural intermediaries, spreading Zoroastrianism, Manichaeism, and Buddhism, and their language became the lingua franca of Silk Road commerce.",
             "summary": "The key middlemen of Silk Road trade for over 600 years.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Sogdian Traders: A History", "author": "Étienne de la Vaissière",
                  "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "sogdian-ancient-letters-313",
        "title": "Sogdian Ancient Letters — Window into Silk Road Commerce",
        "year": 313, "is_bce": False,
        "lat": 40.08, "lng": 94.66,
        "geo_modern": "Dunhuang, China",
        "geo_era_label": "Sogdian trade network",
        "category": "cultural", "importance_score": 0.55, "zoom_min": 5,
        "region": "central_asia",
        "perspectives": [
            {"label": "Silk Road studies perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "Discovered near Dunhuang, the Sogdian Ancient Letters (c. 313 CE) provide a rare first-hand account of Silk Road trade. They describe Sogdian merchant networks in China, the fall of Luoyang to the Xiongnu, and the disruption of trade. These letters are among the most important primary sources for understanding Silk Road commerce.",
             "summary": "Rare first-hand letters revealing the Sogdian trading world.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Sogdian Ancient Letters", "author": "Nicholas Sims-Williams",
                  "publication": "Bulletin of the Asia Institute", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "samanid-empire-bukhara-900",
        "title": "Samanid Empire — Persian Renaissance in Central Asia",
        "year": 900, "is_bce": False,
        "lat": 39.77, "lng": 64.42,
        "geo_modern": "Bukhara, Uzbekistan",
        "geo_era_label": "Samanid Empire",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "Central Asian cultural perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "The Samanid dynasty (819-999) presided over a Persian cultural renaissance in Central Asia. Based in Bukhara, they patronized scholars like Ibn Sina (Avicenna) and the poet Rudaki, established Persian as a literary language, and made Bukhara one of the Islamic world's greatest centers of learning.",
             "summary": "A Persian cultural renaissance in Central Asia centered at Bukhara.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Samanids and the Revival of the Civilization of the Iranian Peoples", "author": "Richard Frye",
                  "publication": "Cambridge History of Iran", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1975}
             ]},
        ],
    },
    {
        "slug": "timur-conquests-samarkand-1370",
        "title": "Timur (Tamerlane) Conquers Central Asia — Samarkand as Capital",
        "year": 1370, "is_bce": False,
        "lat": 39.65, "lng": 66.96,
        "geo_modern": "Samarkand, Uzbekistan",
        "geo_era_label": "Timurid Empire",
        "category": "military", "importance_score": 0.8, "zoom_min": 2,
        "region": "central_asia",
        "perspectives": [
            {"label": "Central Asian perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "Timur (Tamerlane) rose from a minor Turco-Mongol chief to conquer an empire stretching from Anatolia to India. He made Samarkand one of the world's great cities, forcibly relocating artisans and architects from conquered lands to embellish it. His conquests were devastating — estimated 17 million deaths — but his capital became a center of art and science.",
             "summary": "A devastating conqueror who made Samarkand the jewel of Central Asia.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Tamerlane: Sword of Islam, Conqueror of the World", "author": "Justin Marozzi",
                  "publication": "Da Capo Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "timurid-renaissance-1400",
        "title": "Timurid Renaissance — Golden Age of Central Asian Culture",
        "year": 1400, "is_bce": False,
        "lat": 39.65, "lng": 66.96,
        "geo_modern": "Samarkand, Uzbekistan",
        "geo_era_label": "Timurid Empire",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "Under Timur's successors, especially Shah Rukh and his wife Gauhar Shad, the Timurid Empire experienced an extraordinary cultural flowering. Herat and Samarkand became centers of Persian miniature painting, calligraphy, architecture, and literature. The Timurid aesthetic profoundly influenced Mughal India, Safavid Persia, and Ottoman art.",
             "summary": "A cultural golden age that shaped Islamic art from India to Turkey.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Timurids in Transition", "author": "Beatrice Forbes Manz",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "ulugh-beg-observatory-1420",
        "title": "Ulugh Beg Builds Samarkand Observatory",
        "year": 1420, "is_bce": False,
        "lat": 39.67, "lng": 66.98,
        "geo_modern": "Samarkand, Uzbekistan",
        "geo_era_label": "Timurid Empire",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "History of science perspective", "culture_code": "uz", "viewpoint_type": "academic",
             "narrative": "Ulugh Beg, Timur's grandson and governor of Samarkand, built the largest astronomical observatory of its time. His star catalog (Zij-i-Sultani, 1437) contained the positions of 1,018 stars with unprecedented accuracy, surpassing Ptolemy's work by over a millennium. His measurement of the sidereal year was accurate to within 58 seconds.",
             "summary": "The era's greatest observatory, producing the most accurate star catalog.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Ulugh Beg's Astronomy", "author": "Kevin Krisciunas",
                  "publication": "Journal for the History of Astronomy", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "greco-bactrian-kingdom-250bce",
        "title": "Greco-Bactrian Kingdom — Hellenism in Central Asia",
        "year": -250, "is_bce": True,
        "lat": 36.76, "lng": 66.90,
        "geo_modern": "Balkh, Afghanistan",
        "geo_era_label": "Greco-Bactrian Kingdom",
        "category": "political", "importance_score": 0.65, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "Hellenistic studies perspective", "culture_code": "af", "viewpoint_type": "academic",
             "narrative": "After Alexander's death, his generals established the Greco-Bactrian Kingdom in modern Afghanistan and Central Asia. This easternmost outpost of Hellenism lasted over a century, producing remarkable coinage and fostering the cultural fusion that would give rise to Gandhara art under the later Kushans.",
             "summary": "The easternmost Hellenistic kingdom, a crucible of East-West cultural fusion.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Greeks in Bactria and India", "author": "W.W. Tarn",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1951}
             ]},
        ],
    },
    {
        "slug": "ferghana-heavenly-horses-104bce",
        "title": "Han China's War for the Heavenly Horses of Ferghana",
        "year": -104, "is_bce": True,
        "lat": 40.53, "lng": 70.94,
        "geo_modern": "Fergana Valley, Uzbekistan",
        "geo_era_label": "Han Dynasty / Ferghana",
        "category": "military", "importance_score": 0.6, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "Silk Road military history", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Emperor Wu of Han sent two military expeditions to Ferghana (Dayuan) to obtain the legendary 'blood-sweating' Ferghana horses, considered superior warhorses against the Xiongnu. The second expedition (102 BCE) succeeded, demonstrating Han power projection far into Central Asia and securing the western Silk Road.",
             "summary": "Han China projected military power deep into Central Asia for superior horses.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Cambridge History of China, Vol. 1", "author": "Denis Twitchett and Michael Loewe",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}
             ]},
        ],
    },
    # ─── PACIFIC & OCEANIA ───
    {
        "slug": "polynesian-settlement-samoa-tonga-1000bce",
        "title": "Polynesian Settlement of Samoa and Tonga",
        "year": -1000, "is_bce": True,
        "lat": -13.83, "lng": -171.76,
        "geo_modern": "Samoa",
        "geo_era_label": "Ancestral Polynesia",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific studies perspective", "culture_code": "ws", "viewpoint_type": "academic",
             "narrative": "Lapita peoples settled Samoa and Tonga around 1000 BCE, establishing the ancestral Polynesian homeland. Over the next 1,500 years, these islands became the staging ground for the greatest maritime expansion in human history, as Polynesian navigators spread across the Pacific using sophisticated wayfinding techniques.",
             "summary": "The ancestral Polynesian homeland, launching pad for Pacific settlement.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Polynesian Navigation and the Discovery of New Zealand", "author": "Jeff Evans",
                  "publication": "Libro International", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "polynesian-navigation-techniques-500",
        "title": "Polynesian Celestial Navigation — Masters of the Pacific",
        "year": 500, "is_bce": False,
        "lat": -17.53, "lng": -149.57,
        "geo_modern": "Tahiti, French Polynesia",
        "geo_era_label": "Polynesian expansion",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific navigation perspective", "culture_code": "pf", "viewpoint_type": "academic",
             "narrative": "Polynesian navigators developed the most sophisticated non-instrument navigation system in history. Using star compasses, ocean swell patterns, cloud formations, bird flight paths, and bioluminescence, they crossed thousands of miles of open ocean in double-hulled canoes. This knowledge was passed orally through specialized navigator lineages.",
             "summary": "The most sophisticated non-instrument navigation system ever developed.", "evidence_score": 0.88,
             "sources": [
                 {"title": "We, the Navigators", "author": "David Lewis",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1972}
             ]},
        ],
    },
    {
        "slug": "settlement-hawaii-800",
        "title": "Polynesian Settlement of Hawaii",
        "year": 800, "is_bce": False,
        "lat": 19.82, "lng": -155.47,
        "geo_modern": "Big Island, Hawaii, USA",
        "geo_era_label": "Polynesian Hawaii",
        "category": "social", "importance_score": 0.65, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Hawaiian perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Polynesian voyagers from the Marquesas Islands, and later Tahiti, sailed over 2,400 miles of open ocean to settle Hawaii. They brought taro, breadfruit, pigs, chickens, and dogs, transforming the islands' ecology. Hawaiian society developed a complex chiefdom system with elaborate religious practices and monumental temple (heiau) construction.",
             "summary": "One of the most remote ocean crossings in human history.", "evidence_score": 0.83,
             "sources": [
                 {"title": "Ancient Hawaii: An Introduction", "author": "Herb Kawainui Kane",
                  "publication": "Kawainui Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "settlement-new-zealand-1250",
        "title": "Polynesian Settlement of Aotearoa (New Zealand)",
        "year": 1250, "is_bce": False,
        "lat": -38.14, "lng": 176.24,
        "geo_modern": "Bay of Plenty, New Zealand",
        "geo_era_label": "Māori settlement",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Māori perspective", "culture_code": "nz", "viewpoint_type": "academic",
             "narrative": "East Polynesian voyagers reached Aotearoa (New Zealand) around 1250 CE, making it the last major landmass settled by humans. Māori oral tradition describes the Great Fleet (Waka Hourua) voyages. Settlers adapted tropical Polynesian culture to temperate conditions, hunting moa and developing fortified villages (pā) unique in Polynesia.",
             "summary": "The last major landmass settled by humans, via remarkable ocean voyages.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Origins of the Māori", "author": "Janet Davidson",
                  "publication": "Auckland University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1984}
             ]},
        ],
    },
    {
        "slug": "easter-island-settlement-800",
        "title": "Polynesian Settlement of Rapa Nui (Easter Island)",
        "year": 800, "is_bce": False,
        "lat": -27.11, "lng": -109.35,
        "geo_modern": "Easter Island, Chile",
        "geo_era_label": "Rapa Nui settlement",
        "category": "social", "importance_score": 0.6, "zoom_min": 4,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific archaeology perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "Polynesian navigators reached Rapa Nui (Easter Island) around 800-1200 CE, settling one of the most isolated inhabited islands on Earth. The settlers developed a unique culture, a still-undeciphered script (rongorongo), and the monumental moai statues that would make the island famous.",
             "summary": "Settlement of one of Earth's most isolated inhabited places.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Statues that Walked", "author": "Terry Hunt and Carl Lipo",
                  "publication": "Free Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "easter-island-moai-construction-1200",
        "title": "Easter Island Moai Construction Peak",
        "year": 1200, "is_bce": False,
        "lat": -27.12, "lng": -109.37,
        "geo_modern": "Rano Raraku, Easter Island, Chile",
        "geo_era_label": "Rapa Nui",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "The Rapa Nui carved and transported nearly 900 moai statues, some weighing over 80 tons, from the Rano Raraku quarry to platforms (ahu) around the island's coast. Recent research suggests the statues were 'walked' to their destinations using a rocking motion, requiring coordinated teams of dozens of workers.",
             "summary": "Nearly 900 monumental statues carved and transported across the island.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Statues that Walked", "author": "Terry Hunt and Carl Lipo",
                  "publication": "Free Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "easter-island-societal-transformation-1600",
        "title": "Rapa Nui Societal Transformation and Moai Toppling",
        "year": 1600, "is_bce": False,
        "lat": -27.11, "lng": -109.35,
        "geo_modern": "Easter Island, Chile",
        "geo_era_label": "Rapa Nui",
        "category": "social", "importance_score": 0.6, "zoom_min": 4,
        "region": "pacific",
        "perspectives": [
            {"label": "Revisionist archaeological perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "By the 1600s, Rapa Nui society underwent a major transformation. The moai-building ancestor worship gave way to the Birdman cult (tangata manu). Recent scholarship challenges the traditional 'ecocide' narrative, suggesting that soil erosion, rat-introduced deforestation, and later European diseases — not internal warfare — drove the changes.",
             "summary": "A debated societal shift from moai-building to the Birdman cult.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Statues that Walked", "author": "Terry Hunt and Carl Lipo",
                  "publication": "Free Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "hawaiian-unification-kamehameha-1810",
        "title": "Kamehameha I Unifies the Hawaiian Islands",
        "year": 1810, "is_bce": False,
        "lat": 20.02, "lng": -155.83,
        "geo_modern": "Kailua-Kona, Hawaii, USA",
        "geo_era_label": "Kingdom of Hawaii",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Hawaiian perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Kamehameha I unified the Hawaiian archipelago through a combination of military conquest, diplomacy, and the strategic use of Western weapons acquired from European traders. His kingdom established a centralized government with a legal code (kapu system) and international trade relations, lasting until the overthrow of the monarchy in 1893.",
             "summary": "Unification of Hawaii into a single kingdom through warfare and diplomacy.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Kamehameha: The Rise of a King", "author": "Richard Borreca",
                  "publication": "Mutual Publishing", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "tonga-tuionga-empire-1200",
        "title": "Tu'i Tonga Maritime Empire",
        "year": 1200, "is_bce": False,
        "lat": -21.21, "lng": -175.15,
        "geo_modern": "Tongatapu, Tonga",
        "geo_era_label": "Tu'i Tonga Empire",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific studies perspective", "culture_code": "to", "viewpoint_type": "academic",
             "narrative": "The Tu'i Tonga maritime chiefdom extended its influence across a vast area of the Pacific including Samoa, Fiji, Niue, and parts of Melanesia. This Polynesian empire maintained regular long-distance voyaging networks and collected tribute from far-flung islands, representing the largest political entity in pre-contact Oceania.",
             "summary": "The largest pre-contact political entity in the Pacific.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Tongan Society", "author": "Edward Winslow Gifford",
                  "publication": "Bishop Museum Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1929}
             ]},
        ],
    },
    {
        "slug": "nan-madol-construction-1100",
        "title": "Construction of Nan Madol — Venice of the Pacific",
        "year": 1100, "is_bce": False,
        "lat": 6.84, "lng": 158.33,
        "geo_modern": "Pohnpei, Federated States of Micronesia",
        "geo_era_label": "Saudeleur Dynasty",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 4,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific archaeology perspective", "culture_code": "fm", "viewpoint_type": "academic",
             "narrative": "Nan Madol is a complex of 92 artificial islets built on a coral reef off Pohnpei, constructed with massive basalt columns each weighing up to 50 tons. Built by the Saudeleur Dynasty as a political and ceremonial center, it is the only ancient city built atop a coral reef and represents one of the Pacific's greatest architectural achievements.",
             "summary": "An ancient city of 92 artificial islands built on a coral reef.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Nan Madol: The City of the Dead", "author": "William Ayres",
                  "publication": "Pacific Studies", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    # ─── 19TH-20TH CENTURY AFRICA ───
    {
        "slug": "zulu-kingdom-shaka-1818",
        "title": "Rise of the Zulu Kingdom Under Shaka",
        "year": 1818, "is_bce": False,
        "lat": -28.53, "lng": 31.30,
        "geo_modern": "KwaZulu-Natal, South Africa",
        "geo_era_label": "Zulu Kingdom",
        "category": "military", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Southern African perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "Shaka kaSenzangakhona transformed the small Zulu chieftaincy into a centralized military state through revolutionary tactics: the iklwa short stabbing spear replaced throwing assegais, the 'horns of the buffalo' encirclement formation, regimental age-based organization (amabutho), and ruthless discipline. His military reforms triggered the Mfecane upheaval across Southern Africa.",
             "summary": "A military revolutionary who transformed southern African warfare and politics.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Zulu Kingdom", "author": "John Laband",
                  "publication": "University of KwaZulu-Natal Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "mfecane-upheaval-1815",
        "title": "The Mfecane — Southern African Upheaval",
        "year": 1815, "is_bce": False,
        "lat": -29.0, "lng": 30.0,
        "geo_modern": "Southern Africa",
        "geo_era_label": "Mfecane period",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Southern African perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "The Mfecane ('the crushing') was a period of widespread chaos and migration in southern Africa during the 1810s-1830s, triggered by state-building competition among Nguni and Sotho peoples. The upheaval displaced millions, created new nations (Lesotho, Swaziland, Ndebele state), and depopulated areas later claimed by Boer settlers.",
             "summary": "A period of mass displacement that remade the political map of southern Africa.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Mfecane Aftermath", "author": "Carolyn Hamilton (ed.)",
                  "publication": "Wits University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "anglo-zulu-war-isandlwana-1879",
        "title": "Anglo-Zulu War — Battle of Isandlwana",
        "year": 1879, "is_bce": False,
        "lat": -28.35, "lng": 30.65,
        "geo_modern": "Isandlwana, KwaZulu-Natal, South Africa",
        "geo_era_label": "Anglo-Zulu War",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Military history perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "At Isandlwana, a 20,000-strong Zulu army overwhelmed a British force of 1,800, inflicting the worst defeat the British Empire suffered at the hands of an indigenous force. The Zulu warriors, armed primarily with assegais and shields, destroyed a modern army equipped with artillery and Martini-Henry rifles in a stunning tactical victory.",
             "summary": "The worst British military defeat by an indigenous force.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Washing of the Spears", "author": "Donald R. Morris",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1965}
             ]},
        ],
    },
    {
        "slug": "berlin-conference-scramble-africa-1884",
        "title": "Berlin Conference — The Scramble for Africa Begins",
        "year": 1884, "is_bce": False,
        "lat": 52.52, "lng": 13.40,
        "geo_modern": "Berlin, Germany",
        "geo_era_label": "Scramble for Africa",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "African historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Berlin Conference of 1884-85, convened by Otto von Bismarck, established the rules by which European powers would divide Africa among themselves. No African representatives were invited. The conference formalized the 'Scramble for Africa,' drawing arbitrary borders that cut through ethnic groups and existing political entities, creating divisions that persist today.",
             "summary": "European powers partitioned Africa without African consent.", "evidence_score": 0.95,
             "sources": [
                 {"title": "The Scramble for Africa", "author": "Thomas Pakenham",
                  "publication": "Random House", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "ashanti-british-wars-1824",
        "title": "Ashanti-British Wars Begin",
        "year": 1824, "is_bce": False,
        "lat": 6.69, "lng": -1.62,
        "geo_modern": "Kumasi, Ghana",
        "geo_era_label": "Ashanti Empire vs British",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "West African perspective", "culture_code": "gh", "viewpoint_type": "academic",
             "narrative": "The Ashanti (Asante) Empire, one of West Africa's most powerful states, fought four major wars against the British between 1824 and 1900. The first war resulted in a British defeat and the death of their governor. The Ashanti's sophisticated military organization and use of firearms made them formidable opponents who resisted colonization for nearly a century.",
             "summary": "A powerful West African empire that fought the British for nearly a century.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Asante and the Dutch 1744-1873", "author": "Larry Yarak",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "yaa-asantewaa-war-1900",
        "title": "Yaa Asantewaa War — Last Ashanti Resistance",
        "year": 1900, "is_bce": False,
        "lat": 6.69, "lng": -1.62,
        "geo_modern": "Kumasi, Ghana",
        "geo_era_label": "British Gold Coast",
        "category": "military", "importance_score": 0.6, "zoom_min": 4,
        "region": "africa",
        "perspectives": [
            {"label": "West African perspective", "culture_code": "gh", "viewpoint_type": "academic",
             "narrative": "When the British governor demanded the Golden Stool (Sika Dwa Kofi) — the sacred symbol of Ashanti unity — Queen Mother Yaa Asantewaa rallied the Ashanti chiefs to war: 'If you, the men of Ashanti, will not go forward, then we will. I shall call upon my fellow women.' The resulting siege of the British fort at Kumasi was the last major Ashanti armed resistance.",
             "summary": "A queen mother led the last armed Ashanti resistance to British colonialism.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Yaa Asantewaa and the Asante-British War of 1900-1", "author": "A. Adu Boahen",
                  "publication": "James Currey", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "battle-of-adwa-1896",
        "title": "Battle of Adwa — Ethiopia Defeats Italian Invasion",
        "year": 1896, "is_bce": False,
        "lat": 14.17, "lng": 38.90,
        "geo_modern": "Adwa, Tigray, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "military", "importance_score": 0.85, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Emperor Menelik II assembled a force of 100,000 Ethiopians and decisively defeated the Italian army at the Battle of Adwa on March 1, 1896. This was the most significant African military victory against a European colonial power, preserving Ethiopian independence during the Scramble for Africa. Adwa became a symbol of African resistance and inspired pan-African movements worldwide.",
             "summary": "The only African defeat of a European colonizer during the Scramble for Africa.", "evidence_score": 0.95,
             "sources": [
                 {"title": "The Battle of Adwa: African Victory in the Age of Empire", "author": "Raymond Jonas",
                  "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "ethiopian-modernization-menelik-1889",
        "title": "Ethiopian Modernization Under Emperor Menelik II",
        "year": 1889, "is_bce": False,
        "lat": 9.02, "lng": 38.75,
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "political", "importance_score": 0.65, "zoom_min": 4,
        "region": "africa",
        "perspectives": [
            {"label": "Ethiopian perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Menelik II founded Addis Ababa as his new capital and embarked on ambitious modernization: introducing railways, telegraph, postal services, and modern education. He consolidated Ethiopian territorial control and built the centralized state that would resist Italian colonialism. His reign marks the transition of Ethiopia into a modern nation-state.",
             "summary": "Modernization and state-building that enabled Ethiopia to resist colonialism.", "evidence_score": 0.82,
             "sources": [
                 {"title": "A History of Ethiopia", "author": "Harold Marcus",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "congo-free-state-atrocities-1885",
        "title": "Congo Free State — Leopold II's Brutal Exploitation",
        "year": 1885, "is_bce": False,
        "lat": -4.32, "lng": 15.31,
        "geo_modern": "Kinshasa, Democratic Republic of Congo",
        "geo_era_label": "Congo Free State",
        "category": "political", "importance_score": 0.8, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "cd", "viewpoint_type": "academic",
             "narrative": "The Berlin Conference granted King Leopold II of Belgium personal ownership of the Congo. His regime of forced labor to extract rubber and ivory killed an estimated 10 million Congolese through murder, starvation, and disease. The exposure of these atrocities by missionaries and journalists like E.D. Morel created one of the first international human rights campaigns.",
             "summary": "One of history's worst colonial atrocities, killing millions in the Congo.", "evidence_score": 0.92,
             "sources": [
                 {"title": "King Leopold's Ghost", "author": "Adam Hochschild",
                  "publication": "Houghton Mifflin", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "herero-nama-genocide-1904",
        "title": "Herero and Nama Genocide in German South West Africa",
        "year": 1904, "is_bce": False,
        "lat": -22.57, "lng": 17.08,
        "geo_modern": "Windhoek, Namibia",
        "geo_era_label": "German South West Africa",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "na", "viewpoint_type": "academic",
             "narrative": "The German colonial forces under General Lothar von Trotha perpetrated genocide against the Herero and Nama peoples of present-day Namibia in 1904-1908. After the Herero uprising, von Trotha issued an extermination order. Survivors were driven into the Omaheke Desert or confined in concentration camps. An estimated 65,000 Herero (80%) and 10,000 Nama (50%) perished.",
             "summary": "The 20th century's first genocide, targeting the Herero and Nama peoples.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Germany's Genocide of the Herero", "author": "Jeremy Sarkin",
                  "publication": "UCT Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "pan-african-congress-1900",
        "title": "First Pan-African Conference in London",
        "year": 1900, "is_bce": False,
        "lat": 51.51, "lng": -0.13,
        "geo_modern": "London, United Kingdom",
        "geo_era_label": "Pan-African Movement",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Organized by Trinidadian barrister Henry Sylvester Williams, the 1900 Pan-African Conference in London brought together delegates from Africa, the Caribbean, and the USA to protest colonial exploitation. W.E.B. Du Bois delivered his famous prediction that 'the problem of the twentieth century is the problem of the colour line.' This launched the organized Pan-African movement.",
             "summary": "The founding conference of the organized Pan-African movement.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Pan-Africanism: A History", "author": "Hakim Adi",
                  "publication": "Bloomsbury Academic", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "ghana-independence-1957",
        "title": "Ghana Independence — First Sub-Saharan African Nation Free",
        "year": 1957, "is_bce": False,
        "lat": 5.56, "lng": -0.19,
        "geo_modern": "Accra, Ghana",
        "geo_era_label": "African independence",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African perspective", "culture_code": "gh", "viewpoint_type": "academic",
             "narrative": "On March 6, 1957, the Gold Coast became independent Ghana under Kwame Nkrumah, the first sub-Saharan African colony to gain independence. Nkrumah declared: 'The independence of Ghana is meaningless unless it is linked up with the total liberation of the African continent.' Ghana became the beacon that inspired African independence movements across the continent.",
             "summary": "The first sub-Saharan African nation to gain independence, inspiring a continent.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Ghana: The Autobiography of Kwame Nkrumah", "author": "Kwame Nkrumah",
                  "publication": "Thomas Nelson & Sons", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1957}
             ]},
        ],
    },
    {
        "slug": "year-of-africa-1960",
        "title": "Year of Africa — 17 Nations Gain Independence",
        "year": 1960, "is_bce": False,
        "lat": 6.52, "lng": 3.38,
        "geo_modern": "Lagos, Nigeria",
        "geo_era_label": "African independence wave",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "African independence perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "1960 became known as the 'Year of Africa' as 17 nations gained independence, including Nigeria, Congo, Senegal, Mali, Cameroon, and Somalia. This wave of decolonization fundamentally transformed the world order, swelling UN membership and creating the Non-Aligned Movement as a Third World bloc in Cold War geopolitics.",
             "summary": "Seventeen African nations gained independence in a single transformative year.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Fate of Africa", "author": "Martin Meredith",
                  "publication": "PublicAffairs", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "oau-founded-1963",
        "title": "Organisation of African Unity Founded",
        "year": 1963, "is_bce": False,
        "lat": 9.02, "lng": 38.75,
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Pan-African institutions",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African institutional perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Organisation of African Unity (OAU) was founded in Addis Ababa in 1963 by 32 independent African states. Its charter committed members to eradicating colonialism, promoting unity, and defending sovereignty. The OAU played a key role in supporting liberation movements in southern Africa, though it struggled with non-interference in internal conflicts.",
             "summary": "The continental organization that coordinated Africa's liberation movements.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The OAU After Twenty Years", "author": "Yassin El-Ayouty",
                  "publication": "Praeger", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "mau-mau-uprising-kenya-1952",
        "title": "Mau Mau Uprising in Kenya",
        "year": 1952, "is_bce": False,
        "lat": -1.29, "lng": 36.82,
        "geo_modern": "Nairobi, Kenya",
        "geo_era_label": "Kenya Colony",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Kenyan perspective", "culture_code": "ke", "viewpoint_type": "academic",
             "narrative": "The Mau Mau uprising was an armed rebellion by primarily Kikuyu fighters against British colonial rule in Kenya. The British response included mass detention camps, torture, and forced villagization affecting over a million people. Though militarily suppressed, the uprising accelerated Kenyan independence (1963) and exposed the brutality of late colonialism.",
             "summary": "An armed uprising that accelerated Kenyan independence despite brutal suppression.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Britain's Gulag: The Brutal End of Empire in Kenya", "author": "Caroline Elkins",
                  "publication": "Henry Holt", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "algerian-war-independence-1954",
        "title": "Algerian War of Independence Begins",
        "year": 1954, "is_bce": False,
        "lat": 36.75, "lng": 3.06,
        "geo_modern": "Algiers, Algeria",
        "geo_era_label": "French Algeria",
        "category": "military", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "North African perspective", "culture_code": "dz", "viewpoint_type": "academic",
             "narrative": "The Algerian War of Independence (1954-1962) was one of the most brutal decolonization conflicts. The FLN insurgency and France's response — including systematic torture, mass displacement of 2 million Algerians, and napalm bombing — ultimately led to Algerian independence and the fall of France's Fourth Republic. It inspired anti-colonial movements worldwide.",
             "summary": "A brutal war that ended 132 years of French colonialism in Algeria.", "evidence_score": 0.9,
             "sources": [
                 {"title": "A Savage War of Peace: Algeria 1954-1962", "author": "Alistair Horne",
                  "publication": "New York Review Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1977}
             ]},
        ],
    },
    {
        "slug": "apartheid-south-africa-1948",
        "title": "Apartheid Formally Established in South Africa",
        "year": 1948, "is_bce": False,
        "lat": -25.75, "lng": 28.19,
        "geo_modern": "Pretoria, South Africa",
        "geo_era_label": "Apartheid South Africa",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "South African perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "The National Party's 1948 election victory led to the formal codification of apartheid ('separateness'), a system of institutionalized racial segregation and white supremacy. The Population Registration Act classified all South Africans by race, while the Group Areas Act enforced residential segregation. Apartheid would endure for 46 years before being dismantled in 1994.",
             "summary": "The formal establishment of institutionalized racial segregation.", "evidence_score": 0.95,
             "sources": [
                 {"title": "The Rise and Fall of Apartheid", "author": "David Welsh",
                  "publication": "University of Virginia Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "nelson-mandela-freed-1990",
        "title": "Nelson Mandela Released — End of Apartheid Begins",
        "year": 1990, "is_bce": False,
        "lat": -33.92, "lng": 18.86,
        "geo_modern": "Paarl, South Africa",
        "geo_era_label": "End of Apartheid",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "South African perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "After 27 years of imprisonment, Nelson Mandela walked free from Victor Verster Prison on February 11, 1990. His release, negotiated by President F.W. de Klerk under domestic and international pressure, began the transition from apartheid to democracy. Mandela's subsequent leadership of peaceful transition to majority rule is one of the 20th century's greatest political achievements.",
             "summary": "Mandela's release after 27 years began South Africa's transition to democracy.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Long Walk to Freedom", "author": "Nelson Mandela",
                  "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "rwandan-genocide-1994",
        "title": "Rwandan Genocide",
        "year": 1994, "is_bce": False,
        "lat": -1.94, "lng": 29.87,
        "geo_modern": "Kigali, Rwanda",
        "geo_era_label": "Post-colonial Africa",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "rw", "viewpoint_type": "academic",
             "narrative": "In approximately 100 days from April to July 1994, Hutu extremists killed an estimated 800,000 Tutsi and moderate Hutu in Rwanda. The genocide, rooted in colonial-era ethnic categorization and political manipulation, unfolded while the international community failed to intervene. It remains one of the defining moral failures of the late 20th century.",
             "summary": "800,000 killed in 100 days while the world failed to act.", "evidence_score": 0.95,
             "sources": [
                 {"title": "We Wish to Inform You That Tomorrow We Will Be Killed with Our Families", "author": "Philip Gourevitch",
                  "publication": "Farrar, Straus and Giroux", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    # ─── ADDITIONAL CENTRAL ASIA ───
    {
        "slug": "battle-of-talas-751",
        "title": "Battle of Talas — Paper-Making Reaches the Islamic World",
        "year": 751, "is_bce": False,
        "lat": 42.52, "lng": 72.23,
        "geo_modern": "Talas, Kazakhstan",
        "geo_era_label": "Tang Dynasty / Abbasid Caliphate",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "central_asia",
        "perspectives": [
            {"label": "Eurasian history perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Battle of Talas in 751 CE saw the Abbasid Caliphate defeat Tang China, halting Chinese westward expansion into Central Asia. Crucially, captured Chinese papermakers transmitted paper-making technology to the Islamic world, revolutionizing scholarship and administration across the Middle East and eventually Europe.",
             "summary": "A battle that transferred paper-making from China to the Islamic world.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Battle of Talas", "author": "Christopher Beckwith",
                  "publication": "Empires of the Silk Road, Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "khwarazmian-empire-1200",
        "title": "Khwarazmian Empire — Last Great Central Asian Power Before Mongols",
        "year": 1200, "is_bce": False,
        "lat": 41.55, "lng": 60.63,
        "geo_modern": "Konye-Urgench, Turkmenistan",
        "geo_era_label": "Khwarazmian Empire",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "Central Asian perspective", "culture_code": "tm", "viewpoint_type": "academic",
             "narrative": "The Khwarazmian Empire at its peak around 1200 CE controlled Iran, Afghanistan, and Central Asia. Its shah's fatal decision to execute Mongol envoys and merchants in 1218 provoked Genghis Khan's devastating western campaign, which destroyed the empire's great cities of Bukhara, Samarkand, and Urgench in 1220-1221.",
             "summary": "Its destruction by the Mongols reshaped Central Asian history.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Empire of the Khwarazmians", "author": "Clifford Edmund Bosworth",
                  "publication": "Cambridge History of Iran", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1968}
             ]},
        ],
    },
    {
        "slug": "timurid-herat-miniature-painting-1450",
        "title": "Timurid Miniature Painting School of Herat",
        "year": 1450, "is_bce": False,
        "lat": 34.35, "lng": 62.20,
        "geo_modern": "Herat, Afghanistan",
        "geo_era_label": "Timurid Empire",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 4,
        "region": "central_asia",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "af", "viewpoint_type": "academic",
             "narrative": "Under the patronage of Sultan Husayn Bayqara and his vizier Mir Ali-Shir Nava'i, the Herat school of miniature painting reached its zenith with master painter Kamal ud-Din Behzad. These exquisite manuscripts combined Persian literary tradition with Central Asian visual culture, influencing Mughal, Safavid, and Ottoman painting for centuries.",
             "summary": "The pinnacle of Islamic miniature painting, influencing three empires.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Behzad: Master of Persian Painting", "author": "Michael Barry",
                  "publication": "Flammarion", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    # ─── ADDITIONAL SE ASIA ───
    {
        "slug": "borobudur-construction-800",
        "title": "Construction of Borobudur — World's Largest Buddhist Monument",
        "year": 800, "is_bce": False,
        "lat": -7.61, "lng": 110.20,
        "geo_modern": "Magelang, Central Java, Indonesia",
        "geo_era_label": "Sailendra Dynasty",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Buddhist art perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "The Sailendra dynasty of Java constructed Borobudur around 800 CE, the world's largest Buddhist monument. This massive mandala-shaped structure features 2,672 relief panels and 504 Buddha statues across nine stacked platforms, representing the Buddhist cosmological journey from desire through form to formlessness.",
             "summary": "The world's largest Buddhist monument, a stone mandala in Java.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Borobudur: Golden Tales of the Buddhas", "author": "John Miksic",
                  "publication": "Periplus", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "le-loi-defeats-ming-1428",
        "title": "Lê Lợi Defeats Ming Chinese — Vietnamese Independence Restored",
        "year": 1428, "is_bce": False,
        "lat": 21.03, "lng": 105.85,
        "geo_modern": "Hanoi, Vietnam",
        "geo_era_label": "Lê dynasty",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast_asia",
        "perspectives": [
            {"label": "Vietnamese perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "After a decade of guerrilla warfare against the Ming Chinese occupation, Lê Lợi defeated the Ming army at the Battle of Tốt Động-Chúc Động in 1426 and restored Vietnamese independence. His advisor Nguyễn Trãi penned the Bình Ngô đại cáo (Great Proclamation), often called Vietnam's declaration of independence.",
             "summary": "A guerrilla war that restored Vietnamese independence from Ming China.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Vietnam: A New History", "author": "Christopher Goscha",
                  "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    # ─── ADDITIONAL PACIFIC ───
    {
        "slug": "lapita-expansion-pacific-1500bce",
        "title": "Lapita Peoples Expand Across the Pacific",
        "year": -1500, "is_bce": True,
        "lat": -17.73, "lng": 168.32,
        "geo_modern": "Vanuatu",
        "geo_era_label": "Lapita cultural complex",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "pacific",
        "perspectives": [
            {"label": "Pacific archaeology perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Starting around 1500 BCE, the Lapita cultural complex spread from the Bismarck Archipelago across Melanesia to Fiji, Tonga, and Samoa. Identified by their distinctive dentate-stamped pottery, the Lapita peoples were skilled sailors and the ancestors of all Polynesian peoples. Their expansion was the first human settlement of Remote Oceania.",
             "summary": "The ancestral Polynesian culture that first settled the remote Pacific.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Lapita Peoples: Ancestors of the Oceanic World", "author": "Patrick Vinton Kirch",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    # ─── ADDITIONAL MODERN AFRICA ───
    {
        "slug": "ethiopian-italian-war-1935",
        "title": "Italian Invasion of Ethiopia — Second Italo-Ethiopian War",
        "year": 1935, "is_bce": False,
        "lat": 9.02, "lng": 38.75,
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Ethiopian perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Mussolini's Italy invaded Ethiopia in 1935 to avenge Adwa and build an African empire, using mustard gas against both soldiers and civilians. Emperor Haile Selassie's appeal to the League of Nations — 'It is us today. It will be you tomorrow.' — went unheeded, discrediting the League and foreshadowing WWII's collective security failure.",
             "summary": "Italian aggression that discredited the League of Nations.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Ethiopian War 1935-1941", "author": "Angelo Del Boca",
                  "publication": "University of Chicago Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1969}
             ]},
        ],
    },
    {
        "slug": "congo-independence-crisis-1960",
        "title": "Congo Independence and Lumumba's Assassination",
        "year": 1960, "is_bce": False,
        "lat": -4.32, "lng": 15.31,
        "geo_modern": "Kinshasa, Democratic Republic of Congo",
        "geo_era_label": "Congo Crisis",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "African Cold War perspective", "culture_code": "cd", "viewpoint_type": "academic",
             "narrative": "Congo's independence on June 30, 1960 was immediately followed by political crisis, military mutiny, and Belgian-backed secession of mineral-rich Katanga. Prime Minister Patrice Lumumba's assassination in January 1961 — with CIA and Belgian involvement — became a defining moment of Cold War-era neocolonialism in Africa and led to decades of Mobutu's dictatorship.",
             "summary": "Independence followed by crisis and a Cold War-driven assassination.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Assassination of Lumumba", "author": "Ludo De Witte",
                  "publication": "Verso", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "biafra-war-nigeria-1967",
        "title": "Nigerian Civil War (Biafra War)",
        "year": 1967, "is_bce": False,
        "lat": 5.48, "lng": 7.03,
        "geo_modern": "Enugu, Nigeria",
        "geo_era_label": "Post-colonial Nigeria",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Nigerian perspective", "culture_code": "ng", "viewpoint_type": "academic",
             "narrative": "The Igbo-dominated Eastern Region declared independence as the Republic of Biafra in 1967, triggering a devastating civil war. The Nigerian government's blockade caused a famine that killed over a million civilians, creating one of the first televised humanitarian crises and inspiring the founding of Médecins Sans Frontières (Doctors Without Borders).",
             "summary": "A civil war whose famine images sparked modern humanitarian activism.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Nigeria-Biafra War", "author": "Toyin Falola and Ogechukwu Ezekwem",
                  "publication": "De Gruyter", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
]


# ═══════════════════════════════════════════════════════════════════════════
# ~32 CAUSALITY LINKS
# ═══════════════════════════════════════════════════════════════════════════

CAUSALITY_LINKS = [
    # Southeast Asia: Khmer
    ("Jayavarman II", "Angkor Wat%Construction", "direct", 0.8,
     "Jayavarman II's founding of the Khmer Empire created the political framework for Angkor Wat's construction"),
    ("Angkor Wat%Construction", "Jayavarman VII%Greatest", "contributing", 0.6,
     "Angkor Wat's monumental precedent inspired Jayavarman VII's even more ambitious building program"),
    ("Khmer%Hydraulic%Baray", "Angkor%Decline%Ayutthaya", "contributing", 0.7,
     "The failure of Angkor's hydraulic infrastructure contributed to the empire's vulnerability"),
    ("Ayutthaya%Kingdom%Found", "Angkor%Decline%Ayutthaya", "direct", 0.85,
     "The rising power of Ayutthaya led to the sack of Angkor in 1431"),

    # Southeast Asia: Maritime empires
    ("Srivijaya%Maritime%Empire", "Srivijaya%Buddhist%Center", "direct", 0.8,
     "Srivijaya's trade wealth funded its role as a major Buddhist learning center"),
    ("Chola%Raid%Srivijaya", "Malacca%Sultanate", "contributing", 0.6,
     "The Chola raid weakened Srivijaya, eventually creating the power vacuum Malacca filled"),
    ("Majapahit%Peak%Hayam", "Majapahit%Decline%Islamic", "direct", 0.75,
     "The death of Hayam Wuruk triggered succession crises that led to Majapahit's decline"),
    ("Malacca%Sultanate", "Majapahit%Decline%Islamic", "contributing", 0.6,
     "Malacca's spread of Islam to coastal vassal states undermined Hindu-Buddhist Majapahit"),

    # Southeast Asia: Dai Viet
    ("Vietnamese Independence%Bạch Đằng", "Lý Dynasty%Thăng Long", "direct", 0.85,
     "The 938 independence victory enabled the founding of the Lý dynasty and Hanoi"),
    ("Dai Viet%Defeats Mongol", "Lê Lợi%Defeats Ming", "contributing", 0.5,
     "The tradition of defeating foreign invaders inspired later Vietnamese resistance movements"),

    # Silk Road connections
    ("Zhang Qian%Mission%Central Asia", "Silk Road%Established%Han", "direct", 0.9,
     "Zhang Qian's mission directly led to the establishment of Silk Road trade"),
    ("Silk Road%Established%Han", "Sogdian%Merchants%Silk Road", "direct", 0.8,
     "The establishment of the Silk Road created the trade network the Sogdians would dominate"),
    ("Greco-Bactrian%Kingdom", "Kushan%Empire%Gandhara", "direct", 0.75,
     "The Greco-Bactrian cultural legacy directly influenced Kushan-era Gandhara art"),
    ("Kushan%Empire%Gandhara", "Kushan%Buddhism%Spread%East", "direct", 0.85,
     "Kushan patronage of Buddhism enabled its transmission along the Silk Road to East Asia"),
    ("Sogdian%Merchants%Silk Road", "Battle of Talas%Paper", "contributing", 0.5,
     "Sogdian commercial networks facilitated the cultural exchanges the Battle of Talas accelerated"),
    ("Khwarazmian%Empire", "Timur%Conquests%Samarkand", "contributing", 0.6,
     "The Mongol destruction of the Khwarazmian Empire created the power vacuum Timur later filled"),
    ("Timur%Conquests%Samarkand", "Timurid%Renaissance", "direct", 0.9,
     "Timur's conquests and forced relocation of artisans to Samarkand created the Timurid Renaissance"),
    ("Timurid%Renaissance", "Ulugh Beg%Observatory", "direct", 0.85,
     "The Timurid Renaissance's intellectual climate enabled Ulugh Beg's astronomical achievements"),
    ("Timurid%Renaissance", "Timurid%Herat%Miniature", "direct", 0.85,
     "The Timurid cultural flowering produced the Herat school of miniature painting"),
    ("Samanid%Empire%Bukhara", "Timur%Conquests%Samarkand", "contributing", 0.5,
     "The Samanid cultural legacy made Central Asian cities attractive targets for Timur's empire-building"),

    # Pacific connections
    ("Lapita%Expansion%Pacific", "Polynesian%Settlement%Samoa", "direct", 0.9,
     "The Lapita expansion directly led to the settlement of ancestral Polynesia in Samoa and Tonga"),
    ("Polynesian%Settlement%Samoa", "Polynesian%Celestial%Navigation", "direct", 0.8,
     "Ancestral Polynesian settlement required and refined the celestial navigation techniques"),
    ("Polynesian%Navigation%Masters", "Settlement%Hawaii", "direct", 0.9,
     "Polynesian navigation mastery enabled the settlement of remote Hawaii"),
    ("Polynesian%Navigation%Masters", "Settlement%Aotearoa", "direct", 0.9,
     "Polynesian navigation enabled the discovery and settlement of New Zealand"),
    ("Easter Island%Settlement%Rapa Nui", "Easter Island%Moai%Construction", "direct", 0.9,
     "Settlement of Rapa Nui led to the development of its unique moai-building culture"),
    ("Easter Island%Moai%Construction", "Rapa Nui%Societal%Transformation", "direct", 0.7,
     "The resource demands of moai construction contributed to societal transformation"),

    # Modern Africa connections
    ("Zulu Kingdom%Shaka", "Mfecane%Upheaval", "direct", 0.85,
     "Shaka's military revolution triggered the Mfecane upheaval across southern Africa"),
    ("Berlin Conference%Scramble", "Congo Free State%Leopold", "direct", 0.9,
     "The Berlin Conference granted Leopold II personal control of the Congo"),
    ("Berlin Conference%Scramble", "Herero%Nama%Genocide", "contributing", 0.7,
     "The Scramble for Africa created the German colony where the Herero-Nama genocide occurred"),
    ("Battle of Adwa%Ethiopia%Defeats", "Ethiopian%Italian%War%1935", "direct", 0.8,
     "Italy's humiliation at Adwa motivated Mussolini's 1935 invasion to avenge the defeat"),
    ("Ghana%Independence%First", "Year of Africa%17 Nations", "direct", 0.85,
     "Ghana's independence inspired the wave of African decolonization in 1960"),
    ("Year of Africa%17 Nations", "OAU%Founded", "direct", 0.8,
     "The wave of African independence created the need and membership for the OAU"),
]


# ═══════════════════════════════════════════════════════════════════════════
# INSERTION LOGIC
# ═══════════════════════════════════════════════════════════════════════════

async def seed_events(conn: asyncpg.Connection) -> None:
    print(f"Seeding {len(EVENTS)} events...")
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
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  [skip] {slug}")
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
            VALUES ('event', $1, 'create', $2, 'ai', 'Underrepresented regions v2 seed')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    print(f"Events: {inserted} inserted, {skipped} skipped")


async def seed_causality(conn: asyncpg.Connection) -> None:
    print(f"\nSeeding {len(CAUSALITY_LINKS)} causality links...")
    created = 0
    skipped = 0
    failed = 0

    for cause_kw, effect_kw, link_type, strength, desc in CAUSALITY_LINKS:
        # Find cause event
        cause_parts = cause_kw.split("%")
        cause_where = " AND ".join(f"title ILIKE ${i+1}" for i in range(len(cause_parts)))
        cause_params = [f"%{p}%" for p in cause_parts]
        cause_row = await conn.fetchrow(
            f"SELECT id FROM events WHERE {cause_where} ORDER BY importance_score DESC LIMIT 1",
            *cause_params
        )

        # Find effect event
        effect_parts = effect_kw.split("%")
        effect_where = " AND ".join(f"title ILIKE ${i+1}" for i in range(len(effect_parts)))
        effect_params = [f"%{p}%" for p in effect_parts]
        effect_row = await conn.fetchrow(
            f"SELECT id FROM events WHERE {effect_where} ORDER BY importance_score DESC LIMIT 1",
            *effect_params
        )

        if not cause_row or not effect_row:
            failed += 1
            cf = "Y" if cause_row else "N"
            ef = "Y" if effect_row else "N"
            print(f"  SKIP: '{cause_kw}' ({cf}) -> '{effect_kw}' ({ef})")
            continue

        if cause_row["id"] == effect_row["id"]:
            skipped += 1
            continue

        result = await conn.execute("""
            INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength,
                                         description, created_by, review_status)
            VALUES ($1, $2, $3, $4, $5, $6, 'approved')
            ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
        """, str(cause_row["id"]), str(effect_row["id"]), link_type, strength, desc, CREATED_BY)

        if "INSERT 0 1" in result:
            created += 1
        else:
            skipped += 1

    print(f"Causality links: {created} created, {skipped} skipped, {failed} failed")


async def update_network_layout(conn: asyncpg.Connection) -> None:
    """Update network_y using category-based bands."""
    print("\nUpdating network_y for new events...")
    BANDS = {
        "war": 0.10, "military": 0.10,
        "political": 0.25,
        "religious": 0.40,
        "cultural": 0.55, "social": 0.55,
        "discovery": 0.70, "economic": 0.70,
        "disaster": 0.85, "natural": 0.85,
    }
    BAND_WIDTH = 0.12

    rows = await conn.fetch(
        "SELECT id, event_category, importance_score FROM events WHERE network_y IS NULL AND created_by = $1",
        CREATED_BY,
    )
    for row in rows:
        cat = row["event_category"] or "cultural"
        base_y = BANDS.get(cat, 0.55)
        imp = row["importance_score"] or 0.5
        network_y = base_y + (imp - 0.5) * BAND_WIDTH
        network_y = max(0.0, min(1.0, network_y))
        await conn.execute("UPDATE events SET network_y = $1 WHERE id = $2", network_y, row["id"])

    print(f"  Updated {len(rows)} events")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed_events(conn)
        await seed_causality(conn)
        await update_network_layout(conn)

        total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
        total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        print(f"\n✅ Underrepresented regions v2 complete!")
        print(f"   Total events: {total_events}")
        print(f"   Total causality links: {total_links}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
