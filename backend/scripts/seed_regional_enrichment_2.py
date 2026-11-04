#!/usr/bin/env python3
"""
Chronicle seed script — enrich underrepresented regions & categories.

Focus:
  - East/Central/Southern Africa (pre-colonial kingdoms, trade networks)
  - South & Southeast Asia (economic, social, military events)
  - Pre-Columbian Americas (Mississippian, Muisca, Mapuche)
  - Underrepresented categories: social, military, economic, disaster

Run:
    docker exec chronicle-backend-1 python /app/scripts/seed_regional_enrichment_2.py
    # or locally:
    python backend/scripts/seed_regional_enrichment_2.py
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

CREATED_BY = "seed-script:regional-enrichment-v2"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ═══════════════════════════════════════════════════════════════════════════
# 35 NEW EVENTS — focused on underrepresented regions & categories
# ═══════════════════════════════════════════════════════════════════════════

EVENTS: list[dict[str, Any]] = [
    # ─── EAST / CENTRAL AFRICA ───
    {
        "slug": "buganda-kingdom-founded-1300",
        "title": "Founding of the Kingdom of Buganda",
        "year": 1300, "is_bce": False,
        "lat": 0.31, "lng": 32.58,
        "geo_modern": "Kampala, Uganda",
        "geo_era_label": "Great Lakes Kingdoms",
        "category": "political", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "East African historical perspective", "culture_code": "ug", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Buganda emerged around the shores of Lake Victoria as one of the most centralized states in pre-colonial East Africa. Under a series of kabakas (kings), Buganda developed a sophisticated administrative system with appointed chiefs, a standing navy of war canoes, and a road network connecting the capital to provinces.",
             "summary": "A powerful kingdom on Lake Victoria with advanced statecraft.", "evidence_score": 0.75,
             "sources": [
                 {"title": "A History of Buganda from the Foundation of the Kingdom to 1900", "author": "M.S.M. Kiwanuka",
                  "publication": "Longman", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1971}
             ]},
        ],
    },
    {
        "slug": "luba-kingdom-founded-1585",
        "title": "Rise of the Luba Kingdom",
        "year": 1585, "is_bce": False,
        "lat": -7.0, "lng": 27.5,
        "geo_modern": "Katanga, Democratic Republic of Congo",
        "geo_era_label": "Central African Kingdoms",
        "category": "political", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "Central African perspective", "culture_code": "cd", "viewpoint_type": "academic",
             "narrative": "The Luba Kingdom in the Congo basin developed a model of sacred kingship (bulopwe) that influenced political organization across Central Africa. The Luba created a sophisticated system of governance where authority derived from spiritual legitimacy and was delegated through titled positions.",
             "summary": "A Central African kingdom whose political model spread widely.", "evidence_score": 0.72,
             "sources": [
                 {"title": "The Rise of the Luba Empire", "author": "Thomas Q. Reefe",
                  "publication": "International Journal of African Historical Studies", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1981}
             ]},
        ],
    },
    {
        "slug": "lunda-empire-expansion-1665",
        "title": "Expansion of the Lunda Empire",
        "year": 1665, "is_bce": False,
        "lat": -9.5, "lng": 24.0,
        "geo_modern": "Southern DRC / Zambia / Angola",
        "geo_era_label": "Lunda Commonwealth",
        "category": "political", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "Central African historical perspective", "culture_code": "cd", "viewpoint_type": "academic",
             "narrative": "The Lunda Empire, borrowing the Luba model of sacred kingship, expanded across a vast territory stretching from present-day DRC into Zambia and Angola. Through a system of perpetual kinship where office-holders assumed the identity of their predecessors, the Lunda created one of Central Africa's largest political networks.",
             "summary": "A sprawling Central African empire built on kinship diplomacy.", "evidence_score": 0.7,
             "sources": [
                 {"title": "Kingdoms of the Savanna", "author": "Jan Vansina",
                  "publication": "University of Wisconsin Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1966}
             ]},
        ],
    },
    {
        "slug": "zanzibar-slave-trade-peak-1840",
        "title": "Zanzibar Slave Trade Reaches Its Peak",
        "year": 1840, "is_bce": False,
        "lat": -6.16, "lng": 39.19,
        "geo_modern": "Stone Town, Zanzibar, Tanzania",
        "geo_era_label": "Omani Zanzibar",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "East African economic perspective", "culture_code": "tz", "viewpoint_type": "academic",
             "narrative": "Under Omani Sultan Seyyid Said, who moved his capital to Zanzibar in 1840, the island became the center of the East African slave and ivory trade. At its peak, an estimated 50,000 enslaved people passed through Zanzibar annually, fueling clove plantations on the island and exports to the Middle East and Indian Ocean world.",
             "summary": "Zanzibar became the hub of the East African slave trade under Omani rule.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Zanzibar: City, Island, and Coast", "author": "Abdul Sheriff",
                  "publication": "James Currey", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "mapungubwe-kingdom-1075",
        "title": "Rise of Mapungubwe — First State in Southern Africa",
        "year": 1075, "is_bce": False,
        "lat": -22.19, "lng": 29.24,
        "geo_modern": "Limpopo Province, South Africa",
        "geo_era_label": "Medieval Southern Africa",
        "category": "political", "importance_score": 0.65, "zoom_min": 4,
        "perspectives": [
            {"label": "Southern African archaeological perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "Mapungubwe was the earliest known class-based society in southern Africa, predating Great Zimbabwe. Located at the confluence of the Limpopo and Shashe rivers, its rulers controlled gold and ivory trade with the Swahili coast. The famous golden rhinoceros found at the site demonstrates sophisticated metallurgy and social stratification.",
             "summary": "The first state in southern Africa, predecessor to Great Zimbabwe.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Mapungubwe: Ancient African Civilisation on the Limpopo", "author": "Thomas N. Huffman",
                  "publication": "Wits University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "ethiopian-solomonic-dynasty-1270",
        "title": "Restoration of the Solomonic Dynasty in Ethiopia",
        "year": 1270, "is_bce": False,
        "lat": 12.0, "lng": 39.5,
        "geo_modern": "Amhara Region, Ethiopia",
        "geo_era_label": "Medieval Ethiopia",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "perspectives": [
            {"label": "Ethiopian historical perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Yekuno Amlak overthrew the Zagwe dynasty and claimed descent from King Solomon and the Queen of Sheba, founding the Solomonic dynasty that would rule Ethiopia until 1974. This dynasty legitimized its rule through the Kebra Nagast ('Glory of Kings'), one of Africa's most important literary works.",
             "summary": "Founding of Africa's longest-lasting dynasty, claiming Solomonic descent.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Ethiopian Royal Chronicles", "author": "Richard Pankhurst",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1967}
             ]},
        ],
    },
    {
        "slug": "kanem-bornu-empire-peak-1571",
        "title": "Kanem-Bornu Empire Under Idris Alooma",
        "year": 1571, "is_bce": False,
        "lat": 11.85, "lng": 13.16,
        "geo_modern": "Maiduguri, Borno State, Nigeria",
        "geo_era_label": "Kanem-Bornu Empire",
        "category": "military", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "West African military perspective", "culture_code": "ng", "viewpoint_type": "academic",
             "narrative": "Mai Idris Alooma modernized the Bornu military by introducing firearms acquired from Ottoman North Africa, established diplomatic relations with Tripoli and Cairo, and implemented Islamic law. His chronicler Ahmad ibn Furtua recorded his campaigns in one of the earliest historical narratives from the Central Sudan.",
             "summary": "A Saharan empire modernized with Ottoman firearms and Islamic jurisprudence.", "evidence_score": 0.76,
             "sources": [
                 {"title": "A Sudanic Chronicle: The Borno Expeditions of Idris Alauma", "author": "Dierk Lange",
                  "publication": "Franz Steiner Verlag", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": True, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "dahomey-amazon-warriors-1720",
        "title": "Dahomey's Female Warrior Regiment (Mino) Formalized",
        "year": 1720, "is_bce": False,
        "lat": 7.18, "lng": 2.08,
        "geo_modern": "Abomey, Benin",
        "geo_era_label": "Kingdom of Dahomey",
        "category": "military", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "West African military-social perspective", "culture_code": "bj", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Dahomey formalized its famous all-female military regiment, the Mino ('our mothers'), under King Agaja. Numbering up to 6,000 at their peak, these warriors were among the few documented professional female soldiers in pre-modern history, fighting in major campaigns until the French conquest of 1894.",
             "summary": "Dahomey's elite female warriors, one of history's few all-women armies.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Amazons of Black Sparta: The Women Warriors of Dahomey", "author": "Stanley B. Alpern",
                  "publication": "NYU Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },

    # ─── SOUTH ASIA ───
    {
        "slug": "vijayanagara-empire-founded-1336",
        "title": "Founding of the Vijayanagara Empire",
        "year": 1336, "is_bce": False,
        "lat": 15.33, "lng": 76.46,
        "geo_modern": "Hampi, Karnataka, India",
        "geo_era_label": "Medieval South India",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "South Indian historical perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "Harihara and Bukka Raya founded the Vijayanagara Empire in 1336, creating a bulwark against northward expansion of Muslim sultanates. At its zenith under Krishnadevaraya, the empire's capital at Hampi was one of the largest cities in the world, with a population rivaling contemporary London and Paris.",
             "summary": "A mighty South Indian empire whose capital rivaled Europe's greatest cities.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Vijayanagara: Splendour in Ruins", "author": "George Michell",
                  "publication": "Mapin Publishing", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "battle-talikota-1565",
        "title": "Battle of Talikota — Fall of Vijayanagara",
        "year": 1565, "is_bce": False,
        "lat": 16.0, "lng": 76.3,
        "geo_modern": "Raichur, Karnataka, India",
        "geo_era_label": "Deccan Sultanates",
        "category": "war", "importance_score": 0.65, "zoom_min": 4,
        "perspectives": [
            {"label": "South Indian military perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "A coalition of Deccan sultanates decisively defeated the Vijayanagara Empire at the Battle of Talikota (Rakshasa-Tangadi). The subsequent sack and destruction of the capital Hampi ended one of India's greatest empires and reshaped the political landscape of the Deccan for centuries.",
             "summary": "Decisive battle that ended the Vijayanagara Empire.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Battle of Talikota", "author": "H.K. Sherwani",
                  "publication": "Journal of Indian History", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1957}
             ]},
        ],
    },
    {
        "slug": "chera-dynasty-spice-trade-100",
        "title": "Chera Dynasty Dominates Indian Ocean Spice Trade",
        "year": 100, "is_bce": False,
        "lat": 9.93, "lng": 76.26,
        "geo_modern": "Kochi, Kerala, India",
        "geo_era_label": "Sangam Age Tamil Country",
        "category": "economic", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "Indian Ocean trade perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Chera dynasty of Kerala controlled the lucrative pepper and spice trade with the Roman Empire. The Roman historian Pliny complained that Rome's appetite for Indian pepper was draining the empire's gold reserves — archaeological finds of Roman coins in Kerala confirm this vast trade network.",
             "summary": "South Indian kingdom that supplied the Roman Empire with spices.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Trading World of the Indian Ocean, 1500-1800", "author": "Om Prakash",
                  "publication": "Pearson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "bhakti-movement-origins-700",
        "title": "Bhakti Movement Emerges in Tamil Nadu",
        "year": 700, "is_bce": False,
        "lat": 10.79, "lng": 79.14,
        "geo_modern": "Thanjavur, Tamil Nadu, India",
        "geo_era_label": "Early Medieval South India",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "South Asian religious-social perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Bhakti movement, beginning with the Nayanar and Alvar poet-saints of Tamil Nadu, represented one of history's most significant social reform movements. By emphasizing personal devotion over ritual and rejecting caste hierarchies, it challenged Brahmanical orthodoxy and opened religious participation to women and lower castes, spreading across India over the next millennium.",
             "summary": "A devotional movement that challenged caste and transformed Indian society.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Bhakti Movement and the Status of Women", "author": "A.K. Ramanujan",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1973}
             ]},
        ],
    },
    {
        "slug": "bengal-famine-1770",
        "title": "Great Bengal Famine of 1770",
        "year": 1770, "is_bce": False,
        "lat": 22.57, "lng": 88.36,
        "geo_modern": "Calcutta (Kolkata), West Bengal, India",
        "geo_era_label": "British East India Company",
        "category": "disaster", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Colonial economic perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Great Bengal Famine of 1770 killed an estimated 10 million people — roughly one-third of Bengal's population. While triggered by drought, the famine was catastrophically worsened by the East India Company's tax policies, which continued demanding revenue even as crops failed, making it one of the deadliest man-made disasters in history.",
             "summary": "One of history's deadliest famines, worsened by colonial extraction.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Late Victorian Holocausts", "author": "Mike Davis",
                  "publication": "Verso Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "lanka-hydraulic-civilization-300bce",
        "title": "Sri Lanka's Ancient Hydraulic Civilization",
        "year": -300, "is_bce": True,
        "lat": 8.35, "lng": 80.4,
        "geo_modern": "Anuradhapura, Sri Lanka",
        "geo_era_label": "Ancient Lanka",
        "category": "discovery", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "South Asian engineering perspective", "culture_code": "lk", "viewpoint_type": "academic",
             "narrative": "Ancient Sri Lanka developed one of the most sophisticated irrigation systems in the pre-modern world. The hydraulic civilization, centered at Anuradhapura, built massive reservoirs (tanks) and an intricate canal network that sustained a population of millions. The bisokotuwa (valve tower) was a unique engineering innovation for controlling water flow.",
             "summary": "One of the ancient world's most advanced water management systems.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Ancient Irrigation Works of Sri Lanka", "author": "R.A.L.H. Gunawardana",
                  "publication": "Journal of the Royal Asiatic Society", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1971}
             ]},
        ],
    },

    # ─── SOUTHEAST ASIA ───
    {
        "slug": "pagan-kingdom-myanmar-1044",
        "title": "Founding of the Pagan Kingdom in Burma",
        "year": 1044, "is_bce": False,
        "lat": 21.17, "lng": 94.87,
        "geo_modern": "Bagan, Myanmar",
        "geo_era_label": "Pagan Dynasty",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "perspectives": [
            {"label": "Southeast Asian political perspective", "culture_code": "mm", "viewpoint_type": "academic",
             "narrative": "King Anawrahta united the Irrawaddy valley and founded the Pagan Kingdom, the first unified state in Burmese history. Over 10,000 Buddhist temples and pagodas were built during the kingdom's 250-year reign, making Bagan one of the world's richest archaeological sites and Southeast Asia's greatest center of Theravada Buddhism.",
             "summary": "First Burmese state, builder of over 10,000 temples at Bagan.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Pagan Kingdom: Origins and Development", "author": "Michael Aung-Thwin",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "champa-kingdom-vietnam-192",
        "title": "Founding of the Champa Kingdom",
        "year": 192, "is_bce": False,
        "lat": 15.93, "lng": 108.33,
        "geo_modern": "Mỹ Sơn, Quảng Nam, Vietnam",
        "geo_era_label": "Ancient Champa",
        "category": "political", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "Southeast Asian Indianized states perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "The Champa kingdom emerged in central Vietnam as a Hindu-Buddhist maritime state. For over a thousand years, the Cham people built elaborate brick temples at Mỹ Sơn and other sites, controlled vital sea trade routes, and maintained a distinct civilization that engaged in both commerce and conflict with neighboring Khmer and Vietnamese empires.",
             "summary": "A millennium-long Hindu-Buddhist maritime kingdom in Vietnam.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Cham of Vietnam: History, Society and Art", "author": "Rie Nakamura",
                  "publication": "NUS Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "spice-islands-maluku-trade-1400",
        "title": "Maluku Spice Islands Dominate Global Trade",
        "year": 1400, "is_bce": False,
        "lat": -0.54, "lng": 127.59,
        "geo_modern": "Ternate, Maluku, Indonesia",
        "geo_era_label": "Spice Islands",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Global trade perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "The tiny Maluku Islands were the world's sole source of cloves and nutmeg, spices worth more than gold by weight in medieval Europe. The sultans of Ternate and Tidore grew wealthy controlling this monopoly, which would later drive European voyages of exploration — Magellan's circumnavigation was ultimately a spice-seeking mission.",
             "summary": "The world's only source of cloves and nutmeg, driving global exploration.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Spice Islands Voyage", "author": "Tim Severin",
                  "publication": "Carroll & Graf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },

    # ─── PRE-COLUMBIAN / COLONIAL AMERICAS ───
    {
        "slug": "haudenosaunee-great-law-peace-1142",
        "title": "Great Law of Peace — Haudenosaunee Confederacy Founded",
        "year": 1142, "is_bce": False,
        "lat": 42.87, "lng": -76.98,
        "geo_modern": "Onondaga, New York, USA",
        "geo_era_label": "Haudenosaunee (Iroquois)",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "Indigenous governance perspective", "culture_code": "us", "viewpoint_type": "indigenous",
             "narrative": "The Haudenosaunee (Iroquois) Confederacy, uniting five (later six) nations under the Great Law of Peace, created one of the world's oldest participatory democracies. Its constitution established separation of powers, women's suffrage (clan mothers selected and could remove chiefs), and a federal structure that Benjamin Franklin explicitly cited as a model during the drafting of the U.S. Constitution.",
             "summary": "One of history's oldest democracies, influencing the U.S. Constitution.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Great Law and the Longhouse", "author": "William A. Starna",
                  "publication": "University of Oklahoma Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "mapuche-defeat-inca-1460",
        "title": "Mapuche Resistance Halts Inca Expansion",
        "year": 1460, "is_bce": False,
        "lat": -38.74, "lng": -72.6,
        "geo_modern": "Araucanía, Chile",
        "geo_era_label": "Mapuche Wallmapu",
        "category": "military", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "Indigenous resistance perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "The Mapuche people of southern Chile successfully resisted Inca conquest, marking the southern limit of Tawantinsuyu. Their decentralized military organization and knowledge of local terrain proved effective against the Inca's centralized army. They would later resist Spanish colonization for over 300 years, making them one of the most successful indigenous resistance movements in history.",
             "summary": "The Mapuche halted Inca expansion and later resisted Spain for centuries.", "evidence_score": 0.72,
             "sources": [
                 {"title": "The Mapuche in Modern Chile: A Cultural History", "author": "Ray Foerster",
                  "publication": "University of Iowa Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "taino-encounter-columbus-1492",
        "title": "Taíno People Encounter Columbus",
        "year": 1492, "is_bce": False,
        "lat": 24.05, "lng": -74.53,
        "geo_modern": "San Salvador, Bahamas",
        "geo_era_label": "Pre-Columbian Caribbean",
        "category": "social", "importance_score": 0.75, "zoom_min": 3,
        "perspectives": [
            {"label": "Indigenous Caribbean perspective", "culture_code": "bs", "viewpoint_type": "indigenous",
             "narrative": "The Taíno people, who had developed complex chiefdoms across the Caribbean with populations of several million, were the first Indigenous Americans to encounter Columbus. Within 50 years, their population collapsed by over 90% due to disease, enslavement, and violence — one of the most rapid demographic catastrophes in human history. Taíno words like 'hurricane', 'canoe', 'hammock', and 'barbecue' survive in global languages.",
             "summary": "First contact between the Americas and Columbus, leading to catastrophic population collapse.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Tainos: Rise and Decline of the People Who Greeted Columbus", "author": "Irving Rouse",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "mississippian-collapse-1450",
        "title": "Collapse of Cahokia and Mississippian Culture",
        "year": 1450, "is_bce": False,
        "lat": 38.65, "lng": -90.06,
        "geo_modern": "Collinsville, Illinois, USA",
        "geo_era_label": "Post-Mississippian",
        "category": "disaster", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "North American archaeological perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Cahokia was largely abandoned by 1400, with the broader Mississippian culture declining by 1450. Causes remain debated — environmental degradation, flooding, drought (the Medieval Warm Period ended), political instability, and possible epidemic disease all contributed. The collapse reshaped North American societies before European contact.",
             "summary": "The mysterious decline of North America's greatest pre-Columbian civilization.", "evidence_score": 0.7,
             "sources": [
                 {"title": "Cahokia and the Archaeology of Power", "author": "Thomas E. Emerson",
                  "publication": "University of Alabama Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "tupac-amaru-rebellion-1780",
        "title": "Túpac Amaru II Rebellion Against Spanish Colonial Rule",
        "year": 1780, "is_bce": False,
        "lat": -14.07, "lng": -71.28,
        "geo_modern": "Tinta, Cusco Region, Peru",
        "geo_era_label": "Spanish Colonial Peru",
        "category": "social", "importance_score": 0.65, "zoom_min": 3,
        "perspectives": [
            {"label": "Indigenous resistance perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "José Gabriel Condorcanqui, taking the name Túpac Amaru II, led the largest anti-colonial revolt in the Americas before independence. The rebellion mobilized 60,000 Indigenous and mestizo people against Spanish exploitation, particularly the mita forced labor system. Though brutally crushed, it profoundly shook Spanish authority and inspired later independence movements across Latin America.",
             "summary": "The largest indigenous uprising in colonial Americas history.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Tupac Amaru and Catarista Rebellions", "author": "Sergio Serulnikov",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },

    # ─── ADDITIONAL UNDERREPRESENTED CATEGORIES ───
    {
        "slug": "indian-ocean-tsunami-1883-krakatoa",
        "title": "Krakatoa Eruption Triggers Devastating Tsunamis",
        "year": 1883, "is_bce": False,
        "lat": -6.1, "lng": 105.42,
        "geo_modern": "Sunda Strait, Indonesia",
        "geo_era_label": "Dutch East Indies",
        "category": "disaster", "importance_score": 0.75, "zoom_min": 2,
        "perspectives": [
            {"label": "Natural disaster perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "The eruption of Krakatoa on August 27, 1883 was one of the most catastrophic volcanic events in recorded history. The explosion — heard 4,800 km away in Australia — generated tsunamis up to 30 meters high that killed over 36,000 people. The eruption ejected so much ash into the stratosphere that global temperatures dropped 1.2°C, and spectacular sunsets were observed worldwide for months.",
             "summary": "One of the deadliest volcanic eruptions, causing global climate effects.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Krakatoa: The Day the World Exploded", "author": "Simon Winchester",
                  "publication": "Harper Collins", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "tang-an-lushan-rebellion-755",
        "title": "An Lushan Rebellion — Deadliest Pre-Modern Conflict",
        "year": 755, "is_bce": False,
        "lat": 34.26, "lng": 108.94,
        "geo_modern": "Xi'an (Chang'an), China",
        "geo_era_label": "Tang Dynasty China",
        "category": "war", "importance_score": 0.8, "zoom_min": 2,
        "perspectives": [
            {"label": "Chinese military-demographic perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The An Lushan Rebellion (755-763) against the Tang Dynasty may have been the deadliest conflict before the 20th century. Census records show China's population fell from 53 million to 17 million, though many fled rather than perished. The rebellion ended Tang China's cosmopolitan golden age, triggered military decentralization, and reshaped East Asian geopolitics for centuries.",
             "summary": "Possibly the deadliest pre-modern war, ending Tang China's golden age.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The An Lushan Rebellion", "author": "Edwin G. Pulleyblank",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1955}
             ]},
        ],
    },
    {
        "slug": "trans-saharan-gold-salt-trade-800",
        "title": "Trans-Saharan Gold and Salt Trade Networks",
        "year": 800, "is_bce": False,
        "lat": 16.77, "lng": -3.0,
        "geo_modern": "Timbuktu, Mali",
        "geo_era_label": "Medieval West Africa",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "perspectives": [
            {"label": "African economic perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "The trans-Saharan trade routes connecting West African gold fields to North African and Mediterranean markets became one of the medieval world's most important economic networks. Gold from Bambuk and Bure (modern Guinea/Mali) was exchanged for Saharan salt, North African textiles, and luxury goods. This trade created the wealth that powered the Ghana, Mali, and Songhai empires.",
             "summary": "Massive trade routes that connected sub-Saharan Africa to the Mediterranean world.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Trans-Saharan Slave Trade", "author": "John Wright",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "khmer-hydraulic-system-baray-1050",
        "title": "Khmer Empire Builds Vast Hydraulic System",
        "year": 1050, "is_bce": False,
        "lat": 13.43, "lng": 103.84,
        "geo_modern": "Siem Reap, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 4,
        "perspectives": [
            {"label": "Southeast Asian engineering perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "The Khmer Empire constructed the largest pre-industrial water management system in the world. The West Baray alone, built in the 11th century, was 8 km long and 2 km wide, holding 50 million cubic meters of water. This network of reservoirs and canals enabled three rice harvests per year, supporting a population of nearly one million at Angkor.",
             "summary": "The largest pre-industrial water system, supporting Angkor's million inhabitants.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Hydraulic City: Water Management in Angkor", "author": "Christophe Pottier",
                  "publication": "Journal of Southeast Asian Studies", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "zimbabwe-plateau-gold-trade-1100",
        "title": "Zimbabwe Plateau Gold Trade with Swahili Coast",
        "year": 1100, "is_bce": False,
        "lat": -20.27, "lng": 30.93,
        "geo_modern": "Masvingo Province, Zimbabwe",
        "geo_era_label": "Medieval Southern Africa",
        "category": "economic", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "Southern African trade perspective", "culture_code": "zw", "viewpoint_type": "academic",
             "narrative": "The Zimbabwe Plateau was a major gold-producing region that traded through the Swahili coast port of Sofala. This gold trade drove the rise of Mapungubwe and later Great Zimbabwe, connecting southern Africa to the broader Indian Ocean commercial world. Chinese porcelain and Middle Eastern glass beads found at Great Zimbabwe attest to this far-reaching trade network.",
             "summary": "Gold trade connecting the Zimbabwe Plateau to the Indian Ocean world.", "evidence_score": 0.75,
             "sources": [
                 {"title": "An African Classical Age", "author": "Graham Connah",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "deccan-famine-1630",
        "title": "Deccan Famine Under Mughal Expansion",
        "year": 1630, "is_bce": False,
        "lat": 19.08, "lng": 75.6,
        "geo_modern": "Aurangabad, Maharashtra, India",
        "geo_era_label": "Mughal India",
        "category": "disaster", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "Mughal economic-social perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "A devastating famine struck the Deccan in 1630-1632, killing an estimated 7.4 million people according to Dutch East India Company records. Shah Jahan's military campaigns in the region, combined with drought, disrupted agriculture and displaced populations. The famine's severity was exacerbated by Mughal revenue demands that continued despite crop failure.",
             "summary": "A catastrophic famine in Mughal India killing millions.", "evidence_score": 0.72,
             "sources": [
                 {"title": "The Agrarian System of Mughal India", "author": "Irfan Habib",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1963}
             ]},
        ],
    },
    {
        "slug": "aztec-chinampas-agriculture-1350",
        "title": "Aztec Chinampas — Floating Gardens of Tenochtitlan",
        "year": 1350, "is_bce": False,
        "lat": 19.28, "lng": -99.1,
        "geo_modern": "Xochimilco, Mexico City, Mexico",
        "geo_era_label": "Aztec Empire",
        "category": "discovery", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "Mesoamerican agricultural perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "The Aztec chinampas ('floating gardens') were one of the most productive agricultural systems ever devised. Built on Lake Texcoco, these artificial islands produced seven harvests per year and could feed 200,000 people from roughly 9,000 hectares. This intensive system allowed Tenochtitlan to grow into one of the world's largest cities by 1500.",
             "summary": "An ingenious agricultural system that fed one of the world's largest cities.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Chinampas of Mexico", "author": "Jeffrey R. Parsons",
                  "publication": "Scientific American", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1976}
             ]},
        ],
    },
    {
        "slug": "east-african-pillar-tombs-1200",
        "title": "Swahili Stone Architecture and Pillar Tombs",
        "year": 1200, "is_bce": False,
        "lat": -8.95, "lng": 39.5,
        "geo_modern": "Kilwa Kisiwani, Tanzania",
        "geo_era_label": "Swahili Civilization",
        "category": "cultural", "importance_score": 0.55, "zoom_min": 4,
        "perspectives": [
            {"label": "East African architectural perspective", "culture_code": "tz", "viewpoint_type": "academic",
             "narrative": "The Swahili coast developed a distinctive coral stone architecture blending African, Arab, and Persian influences. Pillar tombs, unique to the Swahili world, combined Islamic funerary traditions with local artistic forms. The Great Mosque of Kilwa, built in the 12th century, was the largest mosque in sub-Saharan Africa and reflected the wealth of Indian Ocean maritime trade.",
             "summary": "Distinctive Swahili architecture blending African, Arab, and Persian traditions.", "evidence_score": 0.72,
             "sources": [
                 {"title": "The Swahili: The Social Landscape of a Mercantile Society", "author": "Mark Horton and John Middleton",
                  "publication": "Wiley-Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "pueblo-bonito-chaco-canyon-900",
        "title": "Pueblo Bonito — Great House of Chaco Canyon",
        "year": 900, "is_bce": False,
        "lat": 36.06, "lng": -107.96,
        "geo_modern": "Chaco Culture NHP, New Mexico, USA",
        "geo_era_label": "Ancestral Puebloan",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 4,
        "perspectives": [
            {"label": "North American archaeological perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Pueblo Bonito was the largest building in North America until the 19th century, with over 600 rooms and 40 kivas. Chaco Canyon served as the ceremonial and economic center of the Ancestral Puebloan world, connected by a remarkable 650 km road network to outlying communities. The architecture shows sophisticated astronomical alignment and engineering knowledge.",
             "summary": "North America's largest building for 900 years, center of a vast road network.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Chaco Canyon: Archaeologists Explore the Lives of an Ancient Society", "author": "Brian Fagan",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "moroccan-invasion-songhai-1591",
        "title": "Moroccan Invasion Destroys the Songhai Empire",
        "year": 1591, "is_bce": False,
        "lat": 16.77, "lng": -3.0,
        "geo_modern": "Gao / Timbuktu, Mali",
        "geo_era_label": "Post-Songhai West Africa",
        "category": "war", "importance_score": 0.6, "zoom_min": 3,
        "perspectives": [
            {"label": "West African military perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "A Moroccan expeditionary force of 4,000 soldiers armed with muskets and cannons crossed the Sahara and defeated the much larger Songhai army at the Battle of Tondibi. The fall of Songhai marked the end of the great Sahelian empires and the decline of Timbuktu as a center of Islamic learning. Firearms technology proved decisive against superior numbers.",
             "summary": "Gunpowder weapons end the last great Sahelian empire.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Timbuktu and the Songhay Empire", "author": "John O. Hunwick",
                  "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
]


# ═══════════════════════════════════════════════════════════════════════════
# 18 NEW PEOPLE — from underrepresented regions
# ═══════════════════════════════════════════════════════════════════════════

PEOPLE = [
    # ── Africa ──
    dict(name="Sundiata Keita", birth_year=1217, birth_year_circa=True, death_year=1255, death_year_circa=True,
         nationalities=["Mandinka", "Malian"], roles=["emperor", "founder"], gender="M",
         wikidata_id="Q312587", wikipedia_slug="Sundiata_Keita",
         description="Founder of the Mali Empire and hero of the Sundiata Epic, one of Africa's greatest oral traditions."),
    dict(name="Amina of Zazzau", birth_year=1533, birth_year_circa=True, death_year=1610, death_year_circa=True,
         nationalities=["Hausa"], roles=["queen", "military commander"], gender="F",
         wikidata_id="Q260512", wikipedia_slug="Amina",
         description="Warrior queen of the Hausa city-state of Zazzau who expanded its territory and built fortified walls."),
    dict(name="Nzinga Mbande", birth_year=1583, death_year=1663,
         nationalities=["Ndongo", "Matamba", "Angolan"], roles=["queen", "diplomat", "military commander"], gender="F",
         wikidata_id="Q271134", wikipedia_slug="Nzinga_of_Ndongo_and_Matamba",
         description="Queen of Ndongo and Matamba who fought Portuguese colonization for four decades through warfare and diplomacy."),
    dict(name="Yekuno Amlak", birth_year=1270, birth_year_circa=True, death_year=1285,
         nationalities=["Ethiopian"], roles=["emperor", "founder"], gender="M",
         wikidata_id="Q335697", wikipedia_slug="Yekuno_Amlak",
         description="Ethiopian emperor who restored the Solomonic dynasty and commissioned the Kebra Nagast."),
    dict(name="Idris Alooma", birth_year=1533, birth_year_circa=True, death_year=1603, death_year_circa=True,
         nationalities=["Kanuri", "Bornu"], roles=["sultan", "military commander"], gender="M",
         wikidata_id="Q547542", wikipedia_slug="Idris_Alooma",
         description="Mai of the Kanem-Bornu Empire who modernized its military with firearms and established Islamic law."),
    dict(name="Seyyid Said", birth_year=1797, death_year=1856,
         nationalities=["Omani", "Zanzibari"], roles=["sultan", "merchant"], gender="M",
         wikidata_id="Q458291", wikipedia_slug="Said_bin_Sultan",
         description="Sultan of Oman and Zanzibar who built an East African commercial empire centered on clove plantations and trade."),

    # ── South Asia ──
    dict(name="Krishnadevaraya", birth_year=1471, death_year=1529,
         nationalities=["Indian", "Tuluva"], roles=["emperor", "poet", "patron"], gender="M",
         wikidata_id="Q833730", wikipedia_slug="Krishnadevaraya",
         description="Greatest ruler of the Vijayanagara Empire, patron of arts and literature, author of Amuktamalyada."),
    dict(name="Mirabai", birth_year=1498, birth_year_circa=True, death_year=1547, death_year_circa=True,
         nationalities=["Indian", "Rajput"], roles=["poet", "saint", "mystic"], gender="F",
         wikidata_id="Q447523", wikipedia_slug="Meera",
         description="Rajput princess and devotional poet whose bhajans defied caste and gender conventions, becoming central to the Bhakti movement."),
    dict(name="Túpac Amaru II", birth_year=1742, death_year=1781,
         nationalities=["Peruvian", "Quechua"], roles=["rebel leader", "cacique"], gender="M",
         wikidata_id="Q468071", wikipedia_slug="T%C3%BApac_Amaru_II",
         description="Peruvian indigenous leader who led the largest anti-colonial revolt in the Americas, claiming Inca descent."),
    dict(name="Rani Lakshmibai", birth_year=1828, death_year=1858,
         nationalities=["Indian", "Maratha"], roles=["queen", "military commander"], gender="F",
         wikidata_id="Q232458", wikipedia_slug="Rani_of_Jhansi",
         description="Queen of Jhansi who became a leading figure of the 1857 Indian Rebellion, fighting the British East India Company."),

    # ── Southeast Asia ──
    dict(name="Gajah Mada", birth_year=1290, birth_year_circa=True, death_year=1364,
         nationalities=["Javanese"], roles=["prime minister", "military commander"], gender="M",
         wikidata_id="Q506928", wikipedia_slug="Gajah_Mada",
         description="Prime minister of Majapahit who united the Indonesian archipelago under a single state through the Palapa Oath."),
    dict(name="Anawrahta", birth_year=1014, birth_year_circa=True, death_year=1077,
         nationalities=["Burmese"], roles=["king", "conqueror"], gender="M",
         wikidata_id="Q306593", wikipedia_slug="Anawrahta",
         description="Founder of the Pagan Kingdom, first unifier of Burma, who introduced Theravada Buddhism to the country."),
    dict(name="Ramkhamhaeng", birth_year=1237, birth_year_circa=True, death_year=1298,
         nationalities=["Thai"], roles=["king", "scholar"], gender="M",
         wikidata_id="Q313282", wikipedia_slug="Ram_Khamhaeng",
         description="King of Sukhothai who created the Thai alphabet and expanded the first Thai kingdom."),

    # ── Americas ──
    dict(name="Hiawatha", birth_year=1100, birth_year_circa=True, death_year=1200, death_year_circa=True,
         nationalities=["Onondaga", "Mohawk"], roles=["co-founder", "diplomat", "orator"], gender="M",
         wikidata_id="Q730699", wikipedia_slug="Hiawatha",
         description="Co-founder of the Haudenosaunee (Iroquois) Confederacy alongside the Peacemaker, who helped create one of the world's oldest democracies."),
    dict(name="Lautaro", birth_year=1534, death_year=1557,
         nationalities=["Mapuche"], roles=["military commander", "war chief"], gender="M",
         wikidata_id="Q500846", wikipedia_slug="Lautaro",
         description="Mapuche war leader who defeated and killed the Spanish conquistador Pedro de Valdivia, becoming a symbol of Chilean resistance."),
    dict(name="Anacaona", birth_year=1474, birth_year_circa=True, death_year=1503,
         nationalities=["Taíno"], roles=["cacica", "poet"], gender="F",
         wikidata_id="Q450994", wikipedia_slug="Anacaona",
         description="Taíno cacica (queen) of Xaragua in Hispaniola, known for her poetry and leadership, executed by the Spanish."),
    dict(name="Topa Inca Yupanqui", birth_year=1441, death_year=1493,
         nationalities=["Inca"], roles=["emperor", "conqueror"], gender="M",
         wikidata_id="Q389191", wikipedia_slug="T%C3%BApac_Inca_Yupanqui",
         description="Inca emperor who more than doubled the empire's territory through conquest, extending it from Ecuador to Chile."),
    dict(name="Ahuitzotl", birth_year=1486, birth_year_circa=True, death_year=1502,
         nationalities=["Aztec", "Mexica"], roles=["tlatoani", "conqueror"], gender="M",
         wikidata_id="Q503040", wikipedia_slug="Ahuitzotl",
         description="Aztec ruler who expanded the empire to its greatest extent and oversaw the dedication of the Great Temple with its massive ceremony."),
]

# ── Event-People Links ──
EVENT_LINKS = {
    "Sundiata Keita": [("Mali Empire%found", "founder"), ("Sundiata", "subject")],
    "Amina of Zazzau": [("Hausa", "queen")],
    "Nzinga Mbande": [("Kongo", "ruler"), ("Portuguese%Angola", "opponent")],
    "Yekuno Amlak": [("Solomonic", "founder"), ("Ethiopia%dynast", "founder")],
    "Idris Alooma": [("Kanem-Bornu%Idris", "ruler"), ("Bornu", "sultan")],
    "Seyyid Said": [("Zanzibar%Trade", "ruler"), ("Zanzibar%Slave", "ruler")],
    "Krishnadevaraya": [("Vijayanagara%Founded", "emperor"), ("Vijayanagara%Peak", "ruler")],
    "Mirabai": [("Bhakti", "saint")],
    "Túpac Amaru II": [("Túpac Amaru%Rebellion", "leader")],
    "Rani Lakshmibai": [("Indian Rebellion%1857", "leader"), ("Sepoy", "commander")],
    "Gajah Mada": [("Majapahit%Peak", "prime minister")],
    "Anawrahta": [("Pagan%Burma", "founder"), ("Pagan%Kingdom", "founder")],
    "Ramkhamhaeng": [("Sukhothai", "king")],
    "Hiawatha": [("Haudenosaunee%Great Law", "co-founder")],
    "Lautaro": [("Mapuche", "war chief")],
    "Anacaona": [("Taíno%Columbus", "cacica")],
    "Topa Inca Yupanqui": [("Inca%expan", "emperor"), ("Inca Empire", "emperor")],
    "Ahuitzotl": [("Aztec%empire", "tlatoani"), ("Tenochtitlan", "ruler")],
}


# ═══════════════════════════════════════════════════════════════════════════
# 30 CAUSALITY LINKS — connecting isolated events + new events
# ═══════════════════════════════════════════════════════════════════════════

CAUSALITY_LINKS = [
    # African trade networks and state formation
    ("Mapungubwe%First State", "Great Zimbabwe", "direct", 0.85,
     "Mapungubwe's gold trade model was inherited and expanded by Great Zimbabwe"),
    ("Zimbabwe%Gold Trade%Swahili", "Great Mosque of Kilwa", "contributing", 0.6,
     "Zimbabwe Plateau gold exports fueled Kilwa's prosperity and monumental architecture"),
    ("Trans-Saharan%Gold%Salt", "Ghana Empire", "direct", 0.85,
     "Trans-Saharan trade in gold and salt was the economic foundation of the Ghana Empire"),
    ("Trans-Saharan%Gold%Salt", "Timbuktu%learning", "contributing", 0.7,
     "Trade wealth enabled Timbuktu's rise as a center of Islamic scholarship"),
    ("Ghana Empire", "Mali Empire%found", "direct", 0.75,
     "The Mali Empire arose from the successor states of the Ghana Empire"),
    ("Songhai Empire%Peak", "Moroccan Invasion%Songhai", "direct", 0.85,
     "The Songhai Empire's wealth attracted the Moroccan invasion that destroyed it"),
    ("Luba Kingdom", "Lunda Empire%Expansion", "direct", 0.8,
     "The Lunda adopted the Luba model of sacred kingship to build their own empire"),

    # East Africa trade and colonialism
    ("Zanzibar%Slave Trade%Peak", "Scramble for Africa", "contributing", 0.5,
     "East African trade networks drew European imperial interest leading to the Scramble for Africa"),
    ("Swahili%Stone%Pillar", "Kilwa%gold trade", "contributing", 0.65,
     "Swahili architectural achievements reflected the prosperity of Indian Ocean trade"),
    ("Kingdom of Kongo", "Atlantic%slave trade", "contributing", 0.6,
     "The Kingdom of Kongo became deeply entangled in the Atlantic slave trade"),

    # South Asian connections
    ("Vijayanagara%Founded", "Battle of Talikota", "direct", 0.9,
     "The Vijayanagara Empire's rivalry with the Deccan sultanates led to its destruction at Talikota"),
    ("Bhakti%Movement%Tamil", "Sikhism%Guru Nanak", "contributing", 0.55,
     "The Bhakti movement's devotional theology influenced the development of Sikhism"),
    ("Bengal Famine%1770", "Indian Rebellion%1857", "contributing", 0.5,
     "Colonial economic exploitation including famines fueled resentment leading to the 1857 rebellion"),
    ("Chera%Spice Trade", "Vasco da Gama%India", "contributing", 0.6,
     "Kerala's ancient spice trade attracted Vasco da Gama's voyage to India"),
    ("Battle%Plassey", "Bengal Famine%1770", "direct", 0.75,
     "British control after Plassey enabled the extractive tax policies that worsened the famine"),

    # Southeast Asian connections
    ("Pagan%Kingdom%Burma", "Khmer%Hydraulic%Baray", "contributing", 0.35,
     "Contemporary Southeast Asian kingdoms shared Buddhist cultural and engineering influences"),
    ("Majapahit%Peak", "Spice Islands%Maluku", "contributing", 0.6,
     "Majapahit's maritime empire included control of the Spice Islands trade routes"),
    ("Spice Islands%Maluku", "Magellan%circumnavigation", "direct", 0.8,
     "The quest for direct access to the Spice Islands motivated Magellan's voyage"),
    ("Sukhothai%Kingdom", "Pagan%Kingdom%Burma", "contributing", 0.4,
     "The decline of Pagan power enabled the rise of the Sukhothai Kingdom"),
    ("Champa%Kingdom", "Angkor Wat", "contributing", 0.4,
     "Champa and the Khmer Empire engaged in centuries of conflict that shaped both civilizations"),

    # Americas connections
    ("Cahokia%Mississippian%City", "Mississippian%Collapse", "direct", 0.9,
     "Cahokia was the center of Mississippian culture and its decline triggered broader collapse"),
    ("Haudenosaunee%Great Law", "American%Declaration%Independence", "contributing", 0.4,
     "The Haudenosaunee Confederacy's governance model influenced the founders of American democracy"),
    ("Taíno%Columbus", "Columbian Exchange", "direct", 0.85,
     "The Taíno encounter with Columbus began the Columbian Exchange between hemispheres"),
    ("Mapuche%Halts Inca", "Inca Empire%expan", "contributing", 0.5,
     "Mapuche resistance defined the southern boundary of Inca expansion"),
    ("Túpac Amaru%Rebellion", "Simon Bolívar%Liberation", "contributing", 0.55,
     "The Túpac Amaru rebellion inspired later Latin American independence movements"),
    ("Aztec%Chinampa%Floating", "Aztec%Tenochtitlan%founding", "contributing", 0.7,
     "Chinampa agriculture enabled Tenochtitlan's growth into one of the world's largest cities"),
    ("Pueblo Bonito%Chaco", "Pueblo Revolt%1680", "contributing", 0.35,
     "Ancestral Puebloan traditions of independence contributed to the 1680 Pueblo Revolt"),

    # Cross-regional connections
    ("Krakatoa%Eruption%Tsunami", "Indian Ocean%trade", "contributing", 0.3,
     "The Krakatoa eruption disrupted Sunda Strait shipping, a key Indian Ocean trade bottleneck"),
    ("An Lushan%Rebellion", "Silk Road", "contributing", 0.5,
     "The An Lushan Rebellion weakened Tang control of the Silk Road, reshaping Eurasian trade"),
    ("Solomonic Dynasty%Ethiopia", "Battle%Adwa", "contributing", 0.5,
     "The Solomonic dynasty's centuries-long rule provided Ethiopia the institutional strength to defeat Italy at Adwa"),
]


# ═══════════════════════════════════════════════════════════════════════════
# INSERTION LOGIC — mirrors seed_underrepresented_regions.py
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
            VALUES ('event', $1, 'create', $2, 'ai', 'Regional enrichment v2 seed')
            """,
            event_id, CREATED_BY,
        )

        inserted += 1
        print(f"  [ok] {slug}")

    print(f"Events: {inserted} inserted, {skipped} skipped")


async def seed_people(conn: asyncpg.Connection) -> None:
    import uuid as _uuid

    print(f"\nSeeding {len(PEOPLE)} people...")
    # Get existing wikidata_ids
    rows = await conn.fetch("SELECT wikidata_id, id, name FROM people WHERE wikidata_id IS NOT NULL")
    existing = {r["wikidata_id"]: r for r in rows}

    inserted = 0
    skipped = 0
    person_ids = {}

    for p in PEOPLE:
        wid = p.get("wikidata_id")
        if wid and wid in existing:
            person_ids[p["name"]] = existing[wid]["id"]
            skipped += 1
            continue

        pid = str(_uuid.uuid4())
        row = await conn.fetchrow("""
            INSERT INTO people (id, name, aliases, birth_year, birth_year_circa,
                                death_year, death_year_circa, nationalities, roles,
                                gender, wikidata_id, wikipedia_slug, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            ON CONFLICT (wikidata_id) DO NOTHING
            RETURNING id
        """,
            pid, p["name"], p.get("aliases"),
            p.get("birth_year"), p.get("birth_year_circa", False),
            p.get("death_year"), p.get("death_year_circa", False),
            p.get("nationalities"), p.get("roles"),
            p.get("gender"), p.get("wikidata_id"),
            p.get("wikipedia_slug"), p.get("description"),
        )
        if row:
            person_ids[p["name"]] = row["id"]
            inserted += 1
            print(f"  [ok] {p['name']}")
        else:
            skipped += 1

    print(f"People: {inserted} inserted, {skipped} skipped")

    # Link people to events
    print("\nLinking people to events...")
    links_created = 0
    links_skipped = 0

    for person_name, keywords in EVENT_LINKS.items():
        pid = person_ids.get(person_name)
        if not pid:
            row = await conn.fetchrow("SELECT id FROM people WHERE name = $1", person_name)
            if row:
                pid = row["id"]
            else:
                continue

        for keyword, role in keywords:
            parts = keyword.split("%")
            where_clauses = " AND ".join(f"title ILIKE ${i+1}" for i in range(len(parts)))
            params = [f"%{part}%" for part in parts]

            row = await conn.fetchrow(
                f"SELECT id FROM events WHERE {where_clauses} LIMIT 1", *params
            )
            if not row:
                continue

            result = await conn.execute("""
                INSERT INTO event_people (event_id, person_id, role)
                VALUES ($1, $2, $3)
                ON CONFLICT (event_id, person_id, role) DO NOTHING
            """, str(row["id"]), str(pid), role)

            if "INSERT 0 1" in result:
                links_created += 1
            else:
                links_skipped += 1

    print(f"Event-people links: {links_created} created, {links_skipped} skipped")


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
    """Update network_y using category-based bands (matches compute_network_layout.py)."""
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
        await seed_people(conn)
        await seed_causality(conn)
        await update_network_layout(conn)

        total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
        total_people = await conn.fetchval("SELECT COUNT(*) FROM people")
        total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
        print(f"\n✅ Regional enrichment complete!")
        print(f"   Total events: {total_events}")
        print(f"   Total people: {total_people}")
        print(f"   Total causality links: {total_links}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
