#!/usr/bin/env python3
"""
Chronicle seed script — ~100 events from underrepresented world regions.

Regions: Sub-Saharan Africa, South America, Southeast Asia, Oceania.

Run:
    python backend/scripts/seed_underrepresented_regions.py
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

CREATED_BY = "seed-script:underrepresented-regions-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # SUB-SAHARAN AFRICA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "kingdom-of-kush-rise",
        "title": "Rise of the Kingdom of Kush",
        "year": -1070, "is_bce": True,
        "lat": 18.55, "lng": 31.82,
        "geo_modern": "Meroë, Sudan",
        "geo_era_label": "Nubia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "African civilizational perspective", "culture_code": "sd", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Kush emerged as a major Nubian power after the decline of New Kingdom Egypt's control over Upper Nubia. Centered at Napata and later Meroë, Kush developed its own writing system, ironworking industry, and monumental architecture including distinctive steep pyramids.",
             "summary": "A powerful Nubian kingdom that rivaled and at times conquered Egypt.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Kingdom of Kush: Handbook of the Napatan-Meroitic Civilization", "author": "László Török",
                  "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "nok-culture-west-africa",
        "title": "Nok Culture — Earliest Sub-Saharan Sculpture Tradition",
        "year": -500, "is_bce": True,
        "lat": 9.67, "lng": 8.0,
        "geo_modern": "Central Nigeria",
        "geo_era_label": "Iron Age West Africa",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "ng", "viewpoint_type": "academic",
             "narrative": "The Nok culture of central Nigeria produced sophisticated terracotta sculptures between 500 BCE and 200 CE, representing the earliest known figurative art tradition in sub-Saharan Africa. Nok peoples also practiced early iron smelting, bypassing a distinct Bronze Age.",
             "summary": "West Africa's earliest sculpture tradition, with pioneering ironwork.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Nok: African Sculpture in Archaeological Context", "author": "Peter Breunig",
                  "publication": "Africa Magna Verlag", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "aksum-kingdom-rise",
        "title": "Rise of the Kingdom of Aksum",
        "year": 100, "is_bce": False,
        "lat": 14.13, "lng": 38.72,
        "geo_modern": "Aksum, Tigray, Ethiopia",
        "geo_era_label": "Aksumite Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Ethiopian historical perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Aksum rose to become one of the great empires of the ancient world, controlling trade routes between the Roman Empire and India. It developed its own script (Ge'ez), minted coins, and erected massive stone obelisks. The 3rd-century Persian prophet Mani listed Aksum among the four great powers of the world.",
             "summary": "One of the ancient world's great empires, linking Rome and India.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Rise and Fall of the Aksumite Empire", "author": "Stuart Munro-Hay",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "bantu-expansion",
        "title": "Bantu Expansion Across Sub-Saharan Africa",
        "year": -1000, "is_bce": True,
        "lat": 4.0, "lng": 10.0,
        "geo_modern": "Cameroon / Central Africa",
        "geo_era_label": "Iron Age Africa",
        "category": "social", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Linguistic-archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Starting around 1000 BCE from the Cameroon-Nigeria border region, Bantu-speaking peoples spread across central, eastern, and southern Africa over two millennia, carrying iron-smelting technology, agriculture, and related languages that today are spoken by over 300 million people.",
             "summary": "One of the largest and most consequential human migrations in history.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Bantu Expansion", "author": "Koen Bostoen",
                  "publication": "Oxford Research Encyclopedia of African History", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "ghana-empire-rise",
        "title": "Rise of the Ghana Empire (Wagadou)",
        "year": 300, "is_bce": False,
        "lat": 15.77, "lng": -7.99,
        "geo_modern": "Southeastern Mauritania / Western Mali",
        "geo_era_label": "Ghana Empire",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "West African historical perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "The Ghana Empire, known to its people as Wagadou, was the first major Sahelian kingdom, controlling trans-Saharan gold and salt trade routes. At its peak it commanded vast armies and accumulated legendary wealth, becoming known to Arab geographers as 'the land of gold.'",
             "summary": "The first great West African trading empire.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Ancient Ghana and Mali", "author": "Nehemia Levtzion",
                  "publication": "Methuen", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1973}
             ]},
        ],
    },
    {
        "slug": "great-zimbabwe-construction",
        "title": "Construction of Great Zimbabwe",
        "year": 1100, "is_bce": False,
        "lat": -20.27, "lng": 30.93,
        "geo_modern": "Masvingo Province, Zimbabwe",
        "geo_era_label": "Kingdom of Zimbabwe",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "zw", "viewpoint_type": "academic",
             "narrative": "Great Zimbabwe was the capital of a prosperous Shona trading empire. Its massive dry-stone walls, built without mortar, enclosed a city of up to 18,000 people. The site controlled gold and ivory trade with Swahili coast merchants and as far as China and India.",
             "summary": "Sub-Saharan Africa's largest medieval stone structure and trading capital.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Great Zimbabwe: Described and Explained", "author": "Peter Garlake",
                  "publication": "Zimbabwe Publishing House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1982}
             ]},
        ],
    },
    {
        "slug": "mali-empire-founding",
        "title": "Founding of the Mali Empire by Sundiata Keita",
        "year": 1235, "is_bce": False,
        "lat": 12.65, "lng": -8.0,
        "geo_modern": "Niani, Guinea / Mali border",
        "geo_era_label": "Mali Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "West African oral-historical perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "Sundiata Keita defeated the Sosso king Sumanguru at the Battle of Kirina in 1235, founding the Mali Empire. The empire would become one of the largest and wealthiest in world history, controlling trans-Saharan trade and establishing the Manden Charter, one of the world's earliest declarations of human rights.",
             "summary": "The founding of one of medieval Africa's greatest empires.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Sundiata: An Epic of Old Mali", "author": "Djibril Tamsir Niane",
                  "publication": "Longman", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 1965}
             ]},
        ],
    },
    {
        "slug": "mansa-musa-pilgrimage",
        "title": "Mansa Musa's Pilgrimage to Mecca",
        "year": 1324, "is_bce": False,
        "lat": 12.65, "lng": -8.0,
        "geo_modern": "Mali Empire (Niani to Cairo to Mecca)",
        "geo_era_label": "Mali Empire",
        "category": "economic", "importance_score": 0.85, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Economic-historical perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "Mansa Musa's 1324 hajj with an entourage of 60,000 people and tons of gold caused inflation in Cairo's gold market for over a decade. His legendary wealth drew European attention to West Africa and he appears on the 1375 Catalan Atlas. He is often cited as the wealthiest person in history.",
             "summary": "The richest person in history crossed the Sahara, destabilizing gold markets.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Caravans of Gold, Fragments in Time", "author": "Kathleen Bickford Berzock",
                  "publication": "Princeton University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "swahili-coast-city-states",
        "title": "Swahili Coast City-States Flourish",
        "year": 1200, "is_bce": False,
        "lat": -6.16, "lng": 39.19,
        "geo_modern": "Kilwa Kisiwani, Tanzania",
        "geo_era_label": "Swahili Civilization",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Indian Ocean trade perspective", "culture_code": "tz", "viewpoint_type": "academic",
             "narrative": "By 1200 CE, Swahili city-states like Kilwa, Mombasa, and Zanzibar formed a prosperous maritime trading network linking East Africa with Arabia, Persia, India, and China. Kilwa's Great Mosque and palace complex rivaled contemporary European architecture. Chinese porcelain and Indian beads have been found at these sites.",
             "summary": "East African maritime cities that connected Africa to the Indian Ocean world.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Swahili: The Social Landscape of a Mercantile Society", "author": "Mark Horton & John Middleton",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "songhai-empire-peak",
        "title": "Songhai Empire Under Askia Muhammad",
        "year": 1493, "is_bce": False,
        "lat": 16.27, "lng": -0.05,
        "geo_modern": "Gao / Timbuktu, Mali",
        "geo_era_label": "Songhai Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "West African imperial perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "Under Askia Muhammad (r. 1493–1528), the Songhai Empire became the largest empire in African history, stretching across West Africa. He established a professional bureaucracy, standardized weights and measures, and made Timbuktu a world center of Islamic scholarship with the University of Sankore.",
             "summary": "The largest empire in African history and a center of Islamic learning.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Timbuktu and the Songhay Empire", "author": "John O. Hunwick",
                  "publication": "Brill", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "timbuktu-university-sankore",
        "title": "University of Sankore at Its Height",
        "year": 1450, "is_bce": False,
        "lat": 16.77, "lng": -3.01,
        "geo_modern": "Timbuktu, Mali",
        "geo_era_label": "Mali / Songhai Empire",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Intellectual history perspective", "culture_code": "ml", "viewpoint_type": "academic",
             "narrative": "The University of Sankore in Timbuktu housed hundreds of thousands of manuscripts and attracted scholars from across the Islamic world. At its height it had 25,000 students studying theology, law, astronomy, and medicine. The Timbuktu Manuscripts remain one of Africa's greatest intellectual treasures.",
             "summary": "One of the medieval world's great centers of learning.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Meanings of Timbuktu", "author": "Shamil Jeppie & Souleymane Bachir Diagne",
                  "publication": "HSRC Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "kingdom-of-kongo-founding",
        "title": "Founding of the Kingdom of Kongo",
        "year": 1390, "is_bce": False,
        "lat": -6.27, "lng": 14.25,
        "geo_modern": "M'banza-Kongo, Angola / DR Congo",
        "geo_era_label": "Kingdom of Kongo",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Central African historical perspective", "culture_code": "ao", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Kongo was a powerful Central African state with a sophisticated political system, extensive trade networks, and a capital city of 100,000 people. Its encounter with the Portuguese in 1483 initiated one of Africa's most complex diplomatic relationships with Europe.",
             "summary": "A major Central African kingdom that engaged diplomatically with Europe.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Kingdom of Kongo: Civil War and Transition", "author": "John K. Thornton",
                  "publication": "University of Wisconsin Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "zulu-kingdom-shaka",
        "title": "Rise of the Zulu Kingdom Under Shaka",
        "year": 1818, "is_bce": False,
        "lat": -28.53, "lng": 30.9,
        "geo_modern": "KwaZulu-Natal, South Africa",
        "geo_era_label": "Zulu Kingdom",
        "category": "military", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Southern African military perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "Shaka kaSenzangakhona transformed the small Zulu chiefdom into a powerful military kingdom through revolutionary tactics including the iklwa short spear and bull-horn formation. The resulting Mfecane upheaval reshaped southern African politics, displacing populations across the subcontinent.",
             "summary": "Military revolution that transformed southern Africa's political landscape.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Washing of the Spears", "author": "Donald R. Morris",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1965}
             ]},
        ],
    },
    {
        "slug": "scramble-for-africa-berlin-conference",
        "title": "Berlin Conference — Scramble for Africa",
        "year": 1884, "is_bce": False,
        "lat": 52.52, "lng": 13.41,
        "geo_modern": "Berlin, Germany (affecting all of Africa)",
        "geo_era_label": "Colonial Africa",
        "category": "political", "importance_score": 0.9, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Anti-colonial perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Berlin Conference of 1884–85 formalized European colonial claims to African territory, partitioning the continent with no African representation. By 1914, only Ethiopia and Liberia remained independent. The arbitrary borders drawn at Berlin continue to affect African politics and identity today.",
             "summary": "European powers carved up Africa, setting borders that endure today.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Scramble for Africa", "author": "Thomas Pakenham",
                  "publication": "Random House", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "ethiopian-victory-adwa",
        "title": "Battle of Adwa — Ethiopia Defeats Italy",
        "year": 1896, "is_bce": False,
        "lat": 14.18, "lng": 38.90,
        "geo_modern": "Adwa, Tigray, Ethiopia",
        "geo_era_label": "Ethiopian Empire",
        "category": "military", "importance_score": 0.8, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African perspective", "culture_code": "et", "viewpoint_type": "academic",
             "narrative": "Emperor Menelik II's decisive victory over Italy at Adwa in 1896 preserved Ethiopian independence during the Scramble for Africa. The battle became a symbol of African resistance to colonialism and inspired anti-colonial movements worldwide, from the Pan-African movement to the Rastafari faith.",
             "summary": "Africa's most significant military victory against European colonialism.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Battle of Adwa: African Victory in the Age of Empire", "author": "Raymond Jonas",
                  "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "ghana-independence-1957",
        "title": "Ghana Independence — First Sub-Saharan Nation to Decolonize",
        "year": 1957, "is_bce": False,
        "lat": 5.56, "lng": -0.19,
        "geo_modern": "Accra, Ghana",
        "geo_era_label": "Post-Colonial Africa",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African independence perspective", "culture_code": "gh", "viewpoint_type": "academic",
             "narrative": "Under Kwame Nkrumah's leadership, the Gold Coast became independent Ghana on March 6, 1957 — the first sub-Saharan African colony to gain independence. Nkrumah's famous declaration 'the independence of Ghana is meaningless unless it is linked to the total liberation of Africa' catalyzed decolonization across the continent.",
             "summary": "The spark that ignited Africa's wave of independence.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Ghana: The Autobiography of Kwame Nkrumah", "author": "Kwame Nkrumah",
                  "publication": "Thomas Nelson", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 1957}
             ]},
        ],
    },
    {
        "slug": "end-of-apartheid-south-africa",
        "title": "End of Apartheid — Mandela Elected President",
        "year": 1994, "is_bce": False,
        "lat": -25.75, "lng": 28.19,
        "geo_modern": "Pretoria, South Africa",
        "geo_era_label": "Post-Apartheid South Africa",
        "category": "political", "importance_score": 0.9, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "Nelson Mandela's election as South Africa's first Black president in 1994 marked the end of the apartheid system of racial segregation. After 27 years of imprisonment, Mandela led a remarkable transition through the Truth and Reconciliation Commission, becoming a global symbol of forgiveness and justice.",
             "summary": "The peaceful end of apartheid and triumph of the anti-apartheid movement.", "evidence_score": 0.95,
             "sources": [
                 {"title": "Long Walk to Freedom", "author": "Nelson Mandela",
                  "publication": "Little, Brown", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "rwandan-genocide-1994",
        "title": "Rwandan Genocide",
        "year": 1994, "is_bce": False,
        "lat": -1.94, "lng": 29.87,
        "geo_modern": "Kigali, Rwanda",
        "geo_era_label": "Post-Colonial Rwanda",
        "category": "social", "importance_score": 0.85, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Human rights / genocide studies perspective", "culture_code": "rw", "viewpoint_type": "academic",
             "narrative": "In 100 days from April to July 1994, Hutu extremists murdered approximately 800,000 Tutsi and moderate Hutu in Rwanda while the international community largely failed to intervene. The genocide exposed the failures of the UN and post-Cold War international order, and Rwanda's subsequent recovery became a study in post-conflict reconstruction.",
             "summary": "One of the 20th century's worst genocides, exposing international failure.", "evidence_score": 0.92,
             "sources": [
                 {"title": "We Wish to Inform You That Tomorrow We Will Be Killed with Our Families", "author": "Philip Gourevitch",
                  "publication": "Farrar, Straus and Giroux", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "african-union-founded",
        "title": "African Union Founded",
        "year": 2002, "is_bce": False,
        "lat": 9.02, "lng": 38.75,
        "geo_modern": "Addis Ababa, Ethiopia",
        "geo_era_label": "Contemporary Africa",
        "category": "political", "importance_score": 0.6, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Pan-African institutional perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The African Union replaced the Organisation of African Unity in 2002, with a broader mandate including economic integration, conflict resolution, and democratic governance. Headquartered in Addis Ababa, the AU represents 55 member states and pursues the vision of a united, prosperous Africa under Agenda 2063.",
             "summary": "Africa's continental body for political and economic integration.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The African Union: Autocracy, Diplomacy and Peacebuilding in Africa", "author": "Tim Murithi",
                  "publication": "I.B. Tauris", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # SOUTH AMERICA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "tiwanaku-civilization-rise",
        "title": "Rise of Tiwanaku Civilization",
        "year": 200, "is_bce": False,
        "lat": -16.55, "lng": -68.67,
        "geo_modern": "Tiwanaku, La Paz, Bolivia",
        "geo_era_label": "Tiwanaku Empire",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Andean archaeological perspective", "culture_code": "bo", "viewpoint_type": "academic",
             "narrative": "Tiwanaku, near Lake Titicaca at 3,850 meters elevation, was the capital of a pre-Inca civilization that flourished from 200 to 1000 CE. Its monumental architecture, including the Akapana pyramid and Gate of the Sun, and its raised-field agricultural system supported a population of up to 40,000 at the world's highest urban center.",
             "summary": "The world's highest ancient urban center and a predecessor to the Inca.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Tiwanaku: Ancestors of the Inca", "author": "Alan Kolata",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "moche-civilization-peru",
        "title": "Moche Civilization Flourishes in Peru",
        "year": 200, "is_bce": False,
        "lat": -8.11, "lng": -79.07,
        "geo_modern": "Trujillo, La Libertad, Peru",
        "geo_era_label": "Moche Culture",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "The Moche civilization (100–700 CE) on Peru's northern coast built massive adobe pyramids including the Huaca del Sol, the largest pre-Columbian structure in the Americas. They produced extraordinary ceramic portrait vessels and gold metalwork, and practiced sophisticated irrigation agriculture in the desert.",
             "summary": "Master builders and goldsmiths of ancient Peru.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Moche", "author": "Garth Bawden",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "wari-empire-andes",
        "title": "Wari Empire — First Andean Empire",
        "year": 600, "is_bce": False,
        "lat": -13.16, "lng": -74.22,
        "geo_modern": "Ayacucho, Peru",
        "geo_era_label": "Middle Horizon Andes",
        "category": "political", "importance_score": 0.6, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Andean archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "The Wari Empire (600–1000 CE) was the first true empire in the Andes, establishing administrative centers and road networks that prefigured the Inca. From their capital near modern Ayacucho, the Wari integrated diverse populations across Peru through a combination of military force and cultural influence.",
             "summary": "The Andean empire that laid the groundwork for the Inca.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Wari: Lords of the Ancient Andes", "author": "Susan Bergh",
                  "publication": "Cleveland Museum of Art", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "chimu-kingdom-chan-chan",
        "title": "Chimú Kingdom and Chan Chan — Largest Adobe City",
        "year": 1100, "is_bce": False,
        "lat": -8.10, "lng": -79.07,
        "geo_modern": "Chan Chan, Trujillo, Peru",
        "geo_era_label": "Chimú Kingdom",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Chan Chan, capital of the Chimú Kingdom, was the largest adobe city in the world, covering 20 square kilometers with elaborate palaces, reservoirs, and agricultural fields. At its peak around 1400 CE it housed 60,000 people before falling to the Inca Empire in 1470.",
             "summary": "The world's largest pre-Columbian adobe city.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Chan Chan: Andean Desert City", "author": "Michael Moseley & Kent Day",
                  "publication": "University of New Mexico Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1982}
             ]},
        ],
    },
    {
        "slug": "inca-empire-founding",
        "title": "Founding of the Inca Empire (Tawantinsuyu)",
        "year": 1438, "is_bce": False,
        "lat": -13.52, "lng": -71.97,
        "geo_modern": "Cusco, Peru",
        "geo_era_label": "Inca Empire",
        "category": "political", "importance_score": 0.85, "zoom_min": 2,
        "region": "south-america",
        "perspectives": [
            {"label": "Andean historical perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Pachacuti Inca Yupanqui transformed the Kingdom of Cusco into Tawantinsuyu, the largest empire in pre-Columbian America. Stretching 4,000 km along the Andes, it connected 12 million people through a 40,000 km road network, sophisticated quipu record-keeping, and the mit'a labor system — all without a writing system, wheeled transport, or iron tools.",
             "summary": "The largest empire in the pre-Columbian Americas.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Incas", "author": "Terence N. D'Altroy",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "machu-picchu-construction",
        "title": "Construction of Machu Picchu",
        "year": 1450, "is_bce": False,
        "lat": -13.16, "lng": -72.55,
        "geo_modern": "Cusco Region, Peru",
        "geo_era_label": "Inca Empire",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Built around 1450 CE as a royal estate for Inca emperor Pachacuti, Machu Picchu is a masterpiece of Inca engineering perched at 2,430 meters in the Andes. Its precisely fitted dry-stone walls, terraced agriculture, and water management systems demonstrate extraordinary architectural skill in one of the world's most dramatic settings.",
             "summary": "The iconic Inca citadel and masterpiece of Andean engineering.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Machu Picchu: Unveiling the Mystery of the Incas", "author": "Richard Burger & Lucy Salazar",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "spanish-conquest-inca",
        "title": "Spanish Conquest of the Inca Empire",
        "year": 1532, "is_bce": False,
        "lat": -7.16, "lng": -78.51,
        "geo_modern": "Cajamarca, Peru",
        "geo_era_label": "Colonial South America",
        "category": "military", "importance_score": 0.85, "zoom_min": 2,
        "region": "south-america",
        "perspectives": [
            {"label": "Post-colonial perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Francisco Pizarro captured the Inca emperor Atahualpa at Cajamarca in 1532 with just 168 soldiers, exploiting a civil war and alliances with discontented subject peoples. The subsequent conquest, aided by European diseases that killed up to 90% of the indigenous population, ended the largest empire in the Americas.",
             "summary": "The fall of the Americas' largest empire to a handful of conquistadors.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Last Days of the Incas", "author": "Kim MacQuarrie",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "potosi-silver-mining",
        "title": "Potosí Silver Mining Boom",
        "year": 1545, "is_bce": False,
        "lat": -19.59, "lng": -65.75,
        "geo_modern": "Potosí, Bolivia",
        "geo_era_label": "Colonial Bolivia (Alto Perú)",
        "category": "economic", "importance_score": 0.75, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Economic history perspective", "culture_code": "bo", "viewpoint_type": "academic",
             "narrative": "The Cerro Rico silver mine at Potosí became the single largest source of silver in the world, fueling the Spanish Empire and the global economy for two centuries. By 1600, Potosí was one of the world's largest cities with 160,000 people. An estimated 8 million indigenous and African enslaved workers died in the mines.",
             "summary": "The silver mountain that funded an empire at devastating human cost.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Potosí: The Silver City That Changed the World", "author": "Kris Lane",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2019}
             ]},
        ],
    },
    {
        "slug": "quilombo-palmares",
        "title": "Quilombo dos Palmares — Largest Maroon Settlement",
        "year": 1605, "is_bce": False,
        "lat": -9.17, "lng": -36.18,
        "geo_modern": "Alagoas, Brazil",
        "geo_era_label": "Colonial Brazil",
        "category": "social", "importance_score": 0.65, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "African-Brazilian resistance perspective", "culture_code": "br", "viewpoint_type": "academic",
             "narrative": "Palmares was a federation of settlements founded by escaped enslaved Africans in northeastern Brazil, surviving for nearly a century (1605–1694). At its peak it had 20,000 inhabitants under King Zumbi and represented the largest and longest-lasting maroon community in the Americas, becoming a powerful symbol of Black resistance.",
             "summary": "The Americas' largest community of escaped enslaved peoples.", "evidence_score": 0.78,
             "sources": [
                 {"title": "A History of the Brazilian People", "author": "Darcy Ribeiro",
                  "publication": "University Press of Florida", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "haitian-revolution",
        "title": "Haitian Revolution — First Successful Slave Revolt",
        "year": 1791, "is_bce": False,
        "lat": 19.76, "lng": -72.33,
        "geo_modern": "Cap-Haïtien, Haiti",
        "geo_era_label": "Colonial Saint-Domingue",
        "category": "military", "importance_score": 0.85, "zoom_min": 2,
        "region": "south-america",
        "perspectives": [
            {"label": "Revolutionary perspective", "culture_code": "ht", "viewpoint_type": "academic",
             "narrative": "The Haitian Revolution (1791–1804) was the only successful large-scale slave revolt in history, resulting in the creation of the first Black republic. Led by Toussaint Louverture and Jean-Jacques Dessalines, enslaved people defeated French, Spanish, and British armies, fundamentally challenging the institution of slavery worldwide.",
             "summary": "The only successful slave revolution, creating the first Black republic.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Black Jacobins", "author": "C.L.R. James",
                  "publication": "Secker & Warburg", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1938}
             ]},
        ],
    },
    {
        "slug": "simon-bolivar-liberation",
        "title": "Simón Bolívar's Liberation of South America",
        "year": 1819, "is_bce": False,
        "lat": 4.71, "lng": -74.07,
        "geo_modern": "Bogotá, Colombia",
        "geo_era_label": "Gran Colombia",
        "category": "military", "importance_score": 0.85, "zoom_min": 2,
        "region": "south-america",
        "perspectives": [
            {"label": "Latin American independence perspective", "culture_code": "co", "viewpoint_type": "academic",
             "narrative": "Simón Bolívar's daring crossing of the Andes and victory at Boyacá in 1819 established Gran Colombia and catalyzed the liberation of Venezuela, Colombia, Ecuador, Peru, and Bolivia from Spanish rule. His vision of a unified Latin America, though ultimately unrealized, continues to inspire the region's political imagination.",
             "summary": "The Liberator who freed six South American nations from Spanish rule.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Bolívar: American Liberator", "author": "Marie Arana",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "brazilian-independence",
        "title": "Brazilian Independence",
        "year": 1822, "is_bce": False,
        "lat": -23.55, "lng": -46.63,
        "geo_modern": "São Paulo, Brazil",
        "geo_era_label": "Empire of Brazil",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Brazilian political perspective", "culture_code": "br", "viewpoint_type": "academic",
             "narrative": "Prince Pedro declared Brazilian independence from Portugal on September 7, 1822, along the Ipiranga River. Unlike the violent revolutions elsewhere in Latin America, Brazil's independence was relatively peaceful, establishing a constitutional monarchy that lasted until 1889. It was the only American nation to gain independence as a monarchy.",
             "summary": "A uniquely peaceful independence that created the Americas' only monarchy.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Brazil: A Biography", "author": "Lilia Schwarcz & Heloisa Starling",
                  "publication": "Penguin", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "war-of-the-pacific",
        "title": "War of the Pacific",
        "year": 1879, "is_bce": False,
        "lat": -23.65, "lng": -70.40,
        "geo_modern": "Antofagasta, Chile / Bolivia / Peru",
        "geo_era_label": "South America",
        "category": "military", "importance_score": 0.6, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "South American geopolitical perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "The War of the Pacific (1879–1884) between Chile and the allied Bolivia-Peru was fought over control of nitrate-rich Atacama territory. Chile's victory cost Bolivia its coastline — a loss that remains a major diplomatic issue — and established Chile as South America's dominant Pacific power.",
             "summary": "The war that made Bolivia landlocked and reshaped South American geopolitics.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The War of the Pacific", "author": "William F. Sater",
                  "publication": "University of Nebraska Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "brazilian-abolition-slavery",
        "title": "Brazil Abolishes Slavery — Last in the Americas",
        "year": 1888, "is_bce": False,
        "lat": -22.91, "lng": -43.17,
        "geo_modern": "Rio de Janeiro, Brazil",
        "geo_era_label": "Empire of Brazil",
        "category": "social", "importance_score": 0.75, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Abolitionist perspective", "culture_code": "br", "viewpoint_type": "academic",
             "narrative": "Princess Isabel signed the Lei Áurea (Golden Law) on May 13, 1888, making Brazil the last country in the Western Hemisphere to abolish slavery. Over its 350-year history, Brazil had imported more enslaved Africans than any other country — approximately 4.9 million people — leaving a profound legacy in Brazilian culture and society.",
             "summary": "The end of the Western Hemisphere's last and largest slave system.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Abolition of the Brazilian Slave Trade", "author": "Leslie Bethell",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1970}
             ]},
        ],
    },
    {
        "slug": "mapuche-resistance",
        "title": "Mapuche Resistance — Arauco War",
        "year": 1550, "is_bce": False,
        "lat": -38.74, "lng": -72.60,
        "geo_modern": "Araucanía, Chile",
        "geo_era_label": "Colonial Chile",
        "category": "military", "importance_score": 0.6, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Indigenous resistance perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "The Mapuche people of southern Chile successfully resisted both Inca and Spanish conquest for over 300 years in the Arauco War (1550–1883). They were the only major indigenous group in the Americas to maintain independence through the entire colonial period, forcing Spain to recognize a formal border at the Bío-Bío River.",
             "summary": "The longest successful indigenous resistance to European colonialism in the Americas.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Mapuche in Modern Chile: A Cultural History", "author": "Joanna Crow",
                  "publication": "University Press of Florida", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "nazca-lines-creation",
        "title": "Creation of the Nazca Lines",
        "year": -200, "is_bce": True,
        "lat": -14.74, "lng": -75.13,
        "geo_modern": "Nazca, Ica, Peru",
        "geo_era_label": "Nazca Culture",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "The Nazca Lines are a group of massive geoglyphs etched into the Peruvian desert between 200 BCE and 600 CE, depicting animals, plants, and geometric shapes visible only from the air. Their purpose remains debated — astronomical calendar, ritual pathways, or water-related ceremonies — but they demonstrate remarkable surveying precision.",
             "summary": "Mysterious giant desert drawings visible only from above.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Between the Lines: The Mystery of the Giant Ground Drawings of Ancient Nasca", "author": "Anthony Aveni",
                  "publication": "University of Texas Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "muisca-gold-el-dorado",
        "title": "Muisca Confederation and the Legend of El Dorado",
        "year": 600, "is_bce": False,
        "lat": 5.03, "lng": -73.80,
        "geo_modern": "Boyacá / Cundinamarca, Colombia",
        "geo_era_label": "Muisca Confederation",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Colombian archaeological perspective", "culture_code": "co", "viewpoint_type": "academic",
             "narrative": "The Muisca of the Colombian highlands created one of the Americas' most sophisticated pre-Columbian societies, with an advanced economy based on emerald mining, salt trade, and gold working. Their coronation ceremony at Lake Guatavita — where a new ruler was coated in gold dust — gave rise to the legend of El Dorado that drove centuries of European exploration.",
             "summary": "The civilization behind the El Dorado legend.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The El Dorado Effect", "author": "María Teresa Uribe",
                  "publication": "University of the Andes Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # SOUTHEAST ASIA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "srivijaya-maritime-empire",
        "title": "Rise of the Srivijaya Maritime Empire",
        "year": 650, "is_bce": False,
        "lat": -2.99, "lng": 104.76,
        "geo_modern": "Palembang, South Sumatra, Indonesia",
        "geo_era_label": "Srivijaya Empire",
        "category": "economic", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Maritime historical perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Srivijaya was a powerful Buddhist maritime empire based in Sumatra that controlled the Strait of Malacca and dominated Southeast Asian trade from the 7th to 13th centuries. It served as a major center of Buddhist learning, attracting scholars from China and India, and its control of maritime choke points made it fabulously wealthy.",
             "summary": "The Buddhist maritime empire that controlled Southeast Asian trade.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Sriwijaya: History, Society, and Art", "author": "John Miksic",
                  "publication": "KPG Publishing", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "borobudur-construction",
        "title": "Construction of Borobudur Temple",
        "year": 800, "is_bce": False,
        "lat": -7.61, "lng": 110.20,
        "geo_modern": "Magelang, Central Java, Indonesia",
        "geo_era_label": "Sailendra Dynasty",
        "category": "religious", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Borobudur is the world's largest Buddhist temple, built by the Sailendra dynasty around 800 CE in central Java. With 2,672 relief panels and 504 Buddha statues arranged in nine stacked platforms, it represents a three-dimensional mandala — a stone textbook of Buddhist cosmology and the path to enlightenment.",
             "summary": "The world's largest Buddhist temple and a masterpiece of Javanese art.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Borobudur: Golden Tales of the Buddhas", "author": "John Miksic",
                  "publication": "Periplus", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1990}
             ]},
        ],
    },
    {
        "slug": "khmer-empire-founding",
        "title": "Founding of the Khmer Empire",
        "year": 802, "is_bce": False,
        "lat": 13.41, "lng": 103.87,
        "geo_modern": "Siem Reap, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "political", "importance_score": 0.8, "zoom_min": 2,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Southeast Asian civilizational perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "King Jayavarman II founded the Khmer Empire in 802 CE by declaring independence from Java and establishing a divine kingship cult on Mount Kulen. Over the next six centuries, the Khmer would build the largest pre-industrial city in the world at Angkor, with sophisticated hydraulic engineering that supported up to one million inhabitants.",
             "summary": "The founding of the civilization that built Angkor.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Civilization of Angkor", "author": "Charles Higham",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "angkor-wat-construction",
        "title": "Construction of Angkor Wat",
        "year": 1122, "is_bce": False,
        "lat": 13.41, "lng": 103.87,
        "geo_modern": "Siem Reap, Cambodia",
        "geo_era_label": "Khmer Empire",
        "category": "religious", "importance_score": 0.85, "zoom_min": 2,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Architectural perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Angkor Wat, built by King Suryavarman II as a Hindu temple dedicated to Vishnu, is the largest religious monument ever constructed. Covering 162 hectares with its moat, it features extraordinary bas-reliefs depicting Hindu mythology and Khmer history. Later converted to Buddhism, it remains Cambodia's national symbol.",
             "summary": "The world's largest religious monument and symbol of Cambodia.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Angkor and the Khmer Civilization", "author": "Michael D. Coe",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "pagan-kingdom-myanmar",
        "title": "Pagan Kingdom Unifies Burma",
        "year": 1044, "is_bce": False,
        "lat": 21.17, "lng": 94.87,
        "geo_modern": "Bagan, Myanmar",
        "geo_era_label": "Pagan Kingdom",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Myanmar historical perspective", "culture_code": "mm", "viewpoint_type": "academic",
             "narrative": "King Anawrahta founded the Pagan Empire in 1044, unifying Burma for the first time and establishing Theravada Buddhism as the dominant religion. Over the next 200 years, the Pagan dynasty built over 10,000 Buddhist temples and monasteries across the Bagan plain, creating one of the world's most remarkable archaeological landscapes.",
             "summary": "The kingdom that unified Burma and built 10,000 temples at Bagan.", "evidence_score": 0.8,
             "sources": [
                 {"title": "The Pagan Kingdom of Burma", "author": "Michael Aung-Thwin",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1985}
             ]},
        ],
    },
    {
        "slug": "majapahit-empire-peak",
        "title": "Majapahit Empire at Its Peak",
        "year": 1350, "is_bce": False,
        "lat": -7.62, "lng": 112.41,
        "geo_modern": "Trowulan, East Java, Indonesia",
        "geo_era_label": "Majapahit Empire",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Indonesian national perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Under Prime Minister Gajah Mada, the Majapahit Empire became the largest thalassocracy in Southeast Asian history, claiming suzerainty over much of modern Indonesia, Malaysia, and the Philippines. The Nagarakretagama court poem describes a sophisticated Hindu-Buddhist civilization with extensive international trade. Majapahit is considered the golden age of Indonesian civilization.",
             "summary": "The golden age of the Indonesian archipelago and its largest pre-modern empire.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Majapahit: Greatness and Fall", "author": "Stuart Robson",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "malacca-sultanate-founding",
        "title": "Founding of the Malacca Sultanate",
        "year": 1400, "is_bce": False,
        "lat": 2.19, "lng": 102.25,
        "geo_modern": "Malacca City, Malaysia",
        "geo_era_label": "Malacca Sultanate",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Maritime trade perspective", "culture_code": "my", "viewpoint_type": "academic",
             "narrative": "The Malacca Sultanate, founded by the exiled Srivijayan prince Parameswara, became the most important trading port in Southeast Asia by controlling the Strait of Malacca. Its conversion to Islam around 1414 made it the key vector for Islam's spread across the Malay world. The Portuguese called Malacca 'the richest seaport with the greatest number of wholesale merchants.'",
             "summary": "The trading hub that spread Islam across Southeast Asia.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Southeast Asia in the Age of Commerce", "author": "Anthony Reid",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "dai-viet-independence",
        "title": "Dai Viet Gains Independence from China",
        "year": 938, "is_bce": False,
        "lat": 21.03, "lng": 105.85,
        "geo_modern": "Hanoi, Vietnam",
        "geo_era_label": "Dai Viet",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Vietnamese national perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "Ngô Quyền's victory over the Southern Han Chinese fleet at the Battle of Bạch Đằng in 938 CE ended a thousand years of Chinese domination and established an independent Vietnamese state. His tactic of planting iron-tipped stakes in the riverbed to trap enemy ships at low tide became legendary in Vietnamese military history.",
             "summary": "The battle that ended 1,000 years of Chinese rule over Vietnam.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Vietnam: A New History", "author": "Christopher Goscha",
                  "publication": "Basic Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "sukhothai-kingdom-founding",
        "title": "Founding of the Sukhothai Kingdom",
        "year": 1238, "is_bce": False,
        "lat": 17.01, "lng": 99.70,
        "geo_modern": "Sukhothai, Thailand",
        "geo_era_label": "Sukhothai Kingdom",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Thai historical perspective", "culture_code": "th", "viewpoint_type": "academic",
             "narrative": "The Sukhothai Kingdom, considered the first Thai kingdom, was established in 1238 after overthrowing Khmer control. Under King Ramkhamhaeng, Sukhothai developed the Thai script, adopted Theravada Buddhism, and created a paternalistic governing philosophy. Thai people regard this era as a golden age of peace and prosperity.",
             "summary": "The first Thai kingdom and origin of the Thai script.", "evidence_score": 0.8,
             "sources": [
                 {"title": "A History of Thailand", "author": "Chris Baker & Pasuk Phongpaichit",
                  "publication": "Cambridge University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "dutch-east-indies-colonization",
        "title": "Dutch Colonization of Indonesia (VOC Era)",
        "year": 1602, "is_bce": False,
        "lat": -6.15, "lng": 106.85,
        "geo_modern": "Jakarta (Batavia), Indonesia",
        "geo_era_label": "Dutch East Indies",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Post-colonial perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "The Dutch East India Company (VOC), the world's first multinational corporation, established colonial control over the Indonesian archipelago starting in 1602. Over 350 years, the Dutch exploited spice trade monopolies and forced cultivation systems, profoundly reshaping Indonesian society. The colonial experience forged a shared national identity among diverse island peoples.",
             "summary": "350 years of Dutch colonial rule that shaped modern Indonesia.", "evidence_score": 0.85,
             "sources": [
                 {"title": "A History of Modern Indonesia Since c. 1200", "author": "M.C. Ricklefs",
                  "publication": "Stanford University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "philippine-revolution-1896",
        "title": "Philippine Revolution Against Spain",
        "year": 1896, "is_bce": False,
        "lat": 14.60, "lng": 120.98,
        "geo_modern": "Manila, Philippines",
        "geo_era_label": "Colonial Philippines",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Filipino nationalist perspective", "culture_code": "ph", "viewpoint_type": "academic",
             "narrative": "Inspired by José Rizal's writings and led by Andrés Bonifacio's Katipunan secret society, the Philippine Revolution of 1896 was Asia's first anti-colonial nationalist revolution. Though Spain was defeated, the Philippines was then colonized by the United States, beginning another chapter of foreign rule.",
             "summary": "Asia's first anti-colonial revolution.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Philippine Revolution", "author": "Teodoro Agoncillo",
                  "publication": "University of the Philippines Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1960}
             ]},
        ],
    },
    {
        "slug": "indonesian-independence-1945",
        "title": "Indonesian Declaration of Independence",
        "year": 1945, "is_bce": False,
        "lat": -6.20, "lng": 106.85,
        "geo_modern": "Jakarta, Indonesia",
        "geo_era_label": "Republic of Indonesia",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Indonesian national perspective", "culture_code": "id", "viewpoint_type": "academic",
             "narrative": "Sukarno and Hatta proclaimed Indonesian independence on August 17, 1945, two days after Japan's surrender. Four years of armed struggle and diplomacy followed before the Netherlands recognized sovereignty in 1949. The unification of over 17,000 islands and hundreds of ethnic groups into one nation was one of the 20th century's most ambitious nation-building projects.",
             "summary": "The birth of the world's largest archipelagic nation.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Indonesian Destinies", "author": "Theodore Friend",
                  "publication": "Harvard University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "fall-of-saigon-1975",
        "title": "Fall of Saigon — End of the Vietnam War",
        "year": 1975, "is_bce": False,
        "lat": 10.78, "lng": 106.70,
        "geo_modern": "Ho Chi Minh City (Saigon), Vietnam",
        "geo_era_label": "Vietnam",
        "category": "military", "importance_score": 0.85, "zoom_min": 2,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Vietnamese reunification perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "The fall of Saigon on April 30, 1975 marked the end of the Vietnam War and the reunification of Vietnam under communist rule. The war had killed over 3 million Vietnamese and 58,000 Americans, and its legacy reshaped US foreign policy, Southeast Asian geopolitics, and global anti-war movements.",
             "summary": "The end of America's longest war and Vietnam's reunification.", "evidence_score": 0.9,
             "sources": [
                 {"title": "Vietnam: A History", "author": "Stanley Karnow",
                  "publication": "Viking", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "khmer-rouge-genocide",
        "title": "Khmer Rouge Genocide in Cambodia",
        "year": 1975, "is_bce": False,
        "lat": 11.55, "lng": 104.92,
        "geo_modern": "Phnom Penh, Cambodia",
        "geo_era_label": "Democratic Kampuchea",
        "category": "social", "importance_score": 0.8, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Human rights perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Under Pol Pot's Khmer Rouge regime (1975–1979), approximately 1.7–2.5 million Cambodians — a quarter of the population — died from executions, forced labor, and starvation in the pursuit of an agrarian utopia. The regime emptied cities, abolished money, and targeted intellectuals, ethnic minorities, and perceived enemies.",
             "summary": "One of the 20th century's worst genocides, killing a quarter of Cambodia's people.", "evidence_score": 0.92,
             "sources": [
                 {"title": "First They Killed My Father", "author": "Loung Ung",
                  "publication": "HarperCollins", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "asean-formation",
        "title": "Formation of ASEAN",
        "year": 1967, "is_bce": False,
        "lat": 13.76, "lng": 100.50,
        "geo_modern": "Bangkok, Thailand",
        "geo_era_label": "Southeast Asia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Regional integration perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Association of Southeast Asian Nations was founded in Bangkok in 1967 by Indonesia, Malaysia, Philippines, Singapore, and Thailand to promote political stability and economic cooperation during the Cold War. Now with 10 member states and 680 million people, ASEAN has become one of the world's most important regional organizations.",
             "summary": "Southeast Asia's premier regional organization for peace and trade.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The ASEAN Miracle", "author": "Kishore Mahbubani & Jeffery Sng",
                  "publication": "NUS Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "funan-kingdom-mekong",
        "title": "Funan Kingdom — Earliest Southeast Asian State",
        "year": 100, "is_bce": False,
        "lat": 10.45, "lng": 105.63,
        "geo_modern": "Mekong Delta, Vietnam / Cambodia",
        "geo_era_label": "Kingdom of Funan",
        "category": "political", "importance_score": 0.6, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Southeast Asian archaeological perspective", "culture_code": "kh", "viewpoint_type": "academic",
             "narrative": "Funan, centered in the Mekong Delta, was one of the earliest Indianized states in Southeast Asia. Chinese records describe it as a prosperous maritime trading kingdom linking India and China. Its port city of Óc Eo yielded Roman coins, Indian jewelry, and Chinese bronzes, demonstrating its role in transcontinental commerce.",
             "summary": "Southeast Asia's earliest known state and transcontinental trading hub.", "evidence_score": 0.72,
             "sources": [
                 {"title": "Early Kingdoms of the Indonesian Archipelago and the Malay Peninsula", "author": "Paul Michel Munoz",
                  "publication": "Editions Didier Millet", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "champa-kingdom-vietnam",
        "title": "Kingdom of Champa Flourishes",
        "year": 400, "is_bce": False,
        "lat": 15.93, "lng": 108.33,
        "geo_modern": "Mỹ Sơn, Quảng Nam, Vietnam",
        "geo_era_label": "Kingdom of Champa",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Vietnamese archaeological perspective", "culture_code": "vn", "viewpoint_type": "academic",
             "narrative": "The Cham people built a Hindu-influenced maritime kingdom along Vietnam's central coast that lasted over a thousand years (2nd–17th century). Their temple complex at Mỹ Sơn rivals Angkor in artistic sophistication. The Cham were master sailors and traders who connected Vietnam to the broader Indian Ocean world.",
             "summary": "A thousand-year Hindu maritime kingdom along Vietnam's coast.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Champa and the Archaeology of Mỹ Sơn", "author": "Andrew Hardy et al.",
                  "publication": "NUS Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # OCEANIA
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "aboriginal-australia-arrival",
        "title": "First Human Settlement of Australia",
        "year": -65000, "is_bce": True,
        "lat": -12.46, "lng": 130.84,
        "geo_modern": "Madjedbebe, Northern Territory, Australia",
        "geo_era_label": "Prehistoric Sahul",
        "category": "social", "importance_score": 0.85, "zoom_min": 2,
        "region": "oceania",
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "Aboriginal Australians arrived on the continent at least 65,000 years ago, making them one of the oldest continuous civilizations on Earth. They crossed open ocean from Southeast Asia to reach the supercontinent Sahul, demonstrating remarkable maritime capability. Their arrival marks the first human colonization of a continent beyond Africa and Eurasia.",
             "summary": "The oldest continuous civilization, arriving 65,000 years ago by sea.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Human occupation of northern Australia by 65,000 years ago", "author": "Chris Clarkson et al.",
                  "publication": "Nature", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2017}
             ]},
        ],
    },
    {
        "slug": "aboriginal-dreamtime-traditions",
        "title": "Aboriginal Dreamtime — World's Oldest Living Spiritual Tradition",
        "year": -40000, "is_bce": True,
        "lat": -25.34, "lng": 131.04,
        "geo_modern": "Uluru, Northern Territory, Australia",
        "geo_era_label": "Aboriginal Australia",
        "category": "religious", "importance_score": 0.8, "zoom_min": 2,
        "region": "oceania",
        "perspectives": [
            {"label": "Indigenous Australian perspective", "culture_code": "au", "viewpoint_type": "indigenous",
             "narrative": "The Dreamtime (or Dreaming) is the Aboriginal Australian spiritual framework encompassing the creation of the world by ancestral beings, the laws governing society, and humanity's relationship with the land. It represents the world's oldest continuously practiced spiritual tradition, encoding ecological knowledge, navigation routes, and social law in song, art, and ceremony.",
             "summary": "The world's oldest living spiritual and knowledge system.", "evidence_score": 0.8,
             "sources": [
                 {"title": "Songlines: The Power and Promise", "author": "Margo Neale & Lynne Kelly",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "lapita-culture-expansion",
        "title": "Lapita Culture Expansion into the Pacific",
        "year": -1500, "is_bce": True,
        "lat": -17.73, "lng": 168.32,
        "geo_modern": "Vanuatu / Fiji / Tonga",
        "geo_era_label": "Lapita Cultural Complex",
        "category": "social", "importance_score": 0.75, "zoom_min": 2,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Lapita people, ancestors of modern Polynesians and Melanesians, spread across the western Pacific from 1500 BCE, reaching Fiji, Tonga, and Samoa. Identified by their distinctive dentate-stamped pottery, they were master navigators who colonized islands across thousands of kilometers of open ocean using stars, currents, and bird migration patterns.",
             "summary": "The ancestral Polynesian migration that colonized the Pacific.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Lapita Peoples: Ancestors of the Oceanic World", "author": "Patrick Vinton Kirch",
                  "publication": "Blackwell", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "polynesian-settlement-samoa-tonga",
        "title": "Polynesian Homeland — Settlement of Samoa and Tonga",
        "year": -1000, "is_bce": True,
        "lat": -13.83, "lng": -171.76,
        "geo_modern": "Samoa / Tonga",
        "geo_era_label": "Ancestral Polynesia",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Polynesian cultural perspective", "culture_code": "ws", "viewpoint_type": "academic",
             "narrative": "Samoa and Tonga served as the 'Polynesian homeland' where the distinct Polynesian culture, language, and navigation traditions developed over about 1,000 years before the great eastward expansion into the Pacific. The fa'a Samoa ('Samoan way') and Tongan chiefdom systems are among the oldest continuous political traditions in the Pacific.",
             "summary": "The cradle of Polynesian civilization.", "evidence_score": 0.8,
             "sources": [
                 {"title": "On the Road of the Winds: An Archaeological History of the Pacific Islands", "author": "Patrick Vinton Kirch",
                  "publication": "University of California Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "polynesian-settlement-hawaii",
        "title": "Polynesian Settlement of Hawai'i",
        "year": 1000, "is_bce": False,
        "lat": 19.90, "lng": -155.58,
        "geo_modern": "Big Island, Hawai'i, USA",
        "geo_era_label": "Ancient Hawai'i",
        "category": "social", "importance_score": 0.7, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific migration perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "Polynesian voyagers from the Marquesas Islands reached Hawai'i around 1000 CE after sailing over 3,000 km across open ocean using traditional wayfinding. They developed a complex chiefdom society, the ahupua'a land management system, and monumental temple platforms (heiau). Hawai'i became the most isolated populated place on Earth.",
             "summary": "The most remote Polynesian settlement, reached by extraordinary ocean navigation.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Shoal of Time: A History of the Hawaiian Islands", "author": "Gavan Daws",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1968}
             ]},
        ],
    },
    {
        "slug": "polynesian-settlement-new-zealand",
        "title": "Māori Settlement of Aotearoa (New Zealand)",
        "year": 1280, "is_bce": False,
        "lat": -38.14, "lng": 176.25,
        "geo_modern": "New Zealand",
        "geo_era_label": "Aotearoa",
        "category": "social", "importance_score": 0.75, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Māori cultural perspective", "culture_code": "nz", "viewpoint_type": "indigenous",
             "narrative": "Polynesian navigators reached Aotearoa (New Zealand) around 1280 CE, making it one of the last major landmasses settled by humans. The Māori developed a rich culture adapted to temperate conditions, including the haka war dance, intricate tā moko tattoo art, and carved meeting houses (wharenui). Māori oral traditions record the arrival of the great waka (canoe) fleets.",
             "summary": "One of humanity's last great migrations to an uninhabited landmass.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The New Zealand Wars / Nga Pakanga o Aotearoa", "author": "James Belich",
                  "publication": "Auckland University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "polynesian-settlement-easter-island",
        "title": "Settlement of Rapa Nui (Easter Island) and Moai Construction",
        "year": 1200, "is_bce": False,
        "lat": -27.11, "lng": -109.35,
        "geo_modern": "Easter Island (Rapa Nui), Chile",
        "geo_era_label": "Rapa Nui",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific archaeological perspective", "culture_code": "cl", "viewpoint_type": "academic",
             "narrative": "Polynesian settlers reached Rapa Nui (Easter Island), one of the most isolated inhabited places on Earth, around 1200 CE. They carved nearly 900 moai statues — massive stone heads averaging 4 meters tall — representing deified ancestors. The island's ecological collapse and population decline became a cautionary tale about resource depletion.",
             "summary": "The remote island of giant stone statues, a symbol of human ambition and fragility.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Statues That Walked", "author": "Terry Hunt & Carl Lipo",
                  "publication": "Free Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "tu-i-tonga-empire",
        "title": "Tu'i Tonga Maritime Empire",
        "year": 950, "is_bce": False,
        "lat": -21.21, "lng": -175.15,
        "geo_modern": "Tongatapu, Tonga",
        "geo_era_label": "Tu'i Tonga Empire",
        "category": "political", "importance_score": 0.6, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific political perspective", "culture_code": "to", "viewpoint_type": "academic",
             "narrative": "The Tu'i Tonga Empire, centered on the sacred capital of Mu'a, was Polynesia's most powerful political entity from the 10th to 15th centuries. It exerted influence over Samoa, Fiji, Niue, and parts of Melanesia through a network of marriages, tribute, and trade. The massive Ha'amonga 'a Maui trilithon gateway remains evidence of its monumental architecture.",
             "summary": "The Pacific's most powerful pre-European empire.", "evidence_score": 0.72,
             "sources": [
                 {"title": "Tongan Society", "author": "Edward Winslow Gifford",
                  "publication": "Bishop Museum Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1929}
             ]},
        ],
    },
    {
        "slug": "hawaiian-kingdom-kamehameha",
        "title": "Kamehameha Unifies the Hawaiian Kingdom",
        "year": 1810, "is_bce": False,
        "lat": 20.88, "lng": -156.68,
        "geo_modern": "Lahaina, Maui, Hawai'i, USA",
        "geo_era_label": "Kingdom of Hawai'i",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Hawaiian sovereignty perspective", "culture_code": "us", "viewpoint_type": "academic",
             "narrative": "King Kamehameha I unified the Hawaiian Islands into a single kingdom by 1810 through a combination of military conquest (using Western weapons) and diplomacy. His dynasty established a modern constitutional monarchy recognized by the United States, Britain, and France before it was overthrown by American interests in 1893.",
             "summary": "The warrior king who unified Hawai'i into a recognized nation.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Kamehameha: The Rise of a King", "author": "Richard Ziegler",
                  "publication": "Mutual Publishing", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "treaty-of-waitangi",
        "title": "Treaty of Waitangi — Māori and British Crown",
        "year": 1840, "is_bce": False,
        "lat": -35.26, "lng": 174.09,
        "geo_modern": "Waitangi, Bay of Islands, New Zealand",
        "geo_era_label": "Colonial New Zealand",
        "category": "political", "importance_score": 0.75, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Māori rights perspective", "culture_code": "nz", "viewpoint_type": "academic",
             "narrative": "The Treaty of Waitangi, signed in 1840 between the British Crown and over 500 Māori chiefs, is New Zealand's founding document. However, significant differences between the English and Māori texts created disputes about sovereignty and land rights that persist today. The treaty remains central to New Zealand's constitutional framework and ongoing reconciliation efforts.",
             "summary": "New Zealand's contested founding document between Māori and the Crown.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Treaty of Waitangi", "author": "Claudia Orange",
                  "publication": "Allen & Unwin", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "new-zealand-maori-wars",
        "title": "New Zealand Wars (Māori Land Wars)",
        "year": 1860, "is_bce": False,
        "lat": -38.68, "lng": 175.48,
        "geo_modern": "Waikato, New Zealand",
        "geo_era_label": "Colonial New Zealand",
        "category": "military", "importance_score": 0.65, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Māori resistance perspective", "culture_code": "nz", "viewpoint_type": "academic",
             "narrative": "The New Zealand Wars (1845–1872) were fought between Māori and British colonial forces over sovereignty and land. Māori warriors demonstrated remarkable military innovation, building sophisticated pā (fortifications) that frustrated British forces. The wars resulted in massive land confiscations that remain a source of grievance addressed through the Waitangi Tribunal.",
             "summary": "Māori armed resistance to British colonization and land confiscation.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The New Zealand Wars and the Victorian Interpretation of Racial Conflict", "author": "James Belich",
                  "publication": "Auckland University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1986}
             ]},
        ],
    },
    {
        "slug": "australia-colonization-1788",
        "title": "British Colonization of Australia — First Fleet",
        "year": 1788, "is_bce": False,
        "lat": -33.86, "lng": 151.21,
        "geo_modern": "Sydney, New South Wales, Australia",
        "geo_era_label": "Colonial Australia",
        "category": "social", "importance_score": 0.8, "zoom_min": 2,
        "region": "oceania",
        "perspectives": [
            {"label": "Aboriginal perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "The arrival of the British First Fleet in 1788 began the colonization of Australia, devastating Aboriginal peoples who had lived on the continent for 65,000 years. Declared terra nullius (land belonging to no one), Aboriginal lands were seized, populations decimated by disease and violence, and children forcibly removed in the Stolen Generations policies that lasted into the 1970s.",
             "summary": "The colonization that disrupted the world's oldest continuous civilization.", "evidence_score": 0.9,
             "sources": [
                 {"title": "The Fatal Shore", "author": "Robert Hughes",
                  "publication": "Knopf", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "nuclear-testing-pacific",
        "title": "Nuclear Testing in the Pacific Islands",
        "year": 1946, "is_bce": False,
        "lat": 11.58, "lng": 165.38,
        "geo_modern": "Bikini Atoll, Marshall Islands",
        "geo_era_label": "Cold War Pacific",
        "category": "military", "importance_score": 0.7, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific Islander perspective", "culture_code": "mh", "viewpoint_type": "academic",
             "narrative": "The United States, Britain, and France conducted over 300 nuclear tests in the Pacific between 1946 and 1996, devastating islands like Bikini Atoll and Moruroa. The Bikinians were relocated and their homeland rendered uninhabitable. The testing caused widespread health effects and environmental contamination, fueling the Pacific anti-nuclear movement and the concept of 'nuclear colonialism.'",
             "summary": "Cold War nuclear testing that devastated Pacific Island communities.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Blown to Hell: America's Deadly Betrayal of the Marshall Islanders", "author": "Walter Pincus",
                  "publication": "Diversion Books", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2021}
             ]},
        ],
    },
    {
        "slug": "polynesian-voyaging-revival",
        "title": "Hōkūle'a — Revival of Polynesian Voyaging",
        "year": 1976, "is_bce": False,
        "lat": 21.27, "lng": -157.82,
        "geo_modern": "Honolulu, Hawai'i, USA",
        "geo_era_label": "Pacific Cultural Renaissance",
        "category": "cultural", "importance_score": 0.6, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Hawaiian cultural renaissance perspective", "culture_code": "us", "viewpoint_type": "indigenous",
             "narrative": "The 1976 voyage of Hōkūle'a, a traditional Polynesian double-hulled canoe, from Hawai'i to Tahiti using only traditional wayfinding revived Pacific Islander pride and navigation traditions. Navigator Mau Piailug from Micronesia shared ancient star navigation knowledge that had nearly been lost. The voyage sparked a Pacific-wide cultural renaissance.",
             "summary": "The voyage that revived Polynesian navigation and cultural pride.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Hōkūle'a: The Art and Science of Polynesian Navigation", "author": "Will Kyselka",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "papua-new-guinea-independence",
        "title": "Papua New Guinea Independence",
        "year": 1975, "is_bce": False,
        "lat": -6.21, "lng": 155.99,
        "geo_modern": "Bougainville / Port Moresby, Papua New Guinea",
        "geo_era_label": "Independent PNG",
        "category": "political", "importance_score": 0.55, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Melanesian political perspective", "culture_code": "pg", "viewpoint_type": "academic",
             "narrative": "Papua New Guinea gained independence from Australia on September 16, 1975, becoming one of the world's most linguistically diverse nations with over 800 languages. Its unique nation-building challenge — uniting highland and coastal peoples with no common pre-colonial identity — makes it one of the most extraordinary political experiments in the Pacific.",
             "summary": "The most linguistically diverse nation's path to independence.", "evidence_score": 0.78,
             "sources": [
                 {"title": "A Short History of Papua New Guinea", "author": "John Dademo Waiko",
                  "publication": "Oxford University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "aboriginal-land-rights-mabo",
        "title": "Mabo Decision — Aboriginal Land Rights in Australia",
        "year": 1992, "is_bce": False,
        "lat": -10.57, "lng": 142.22,
        "geo_modern": "Murray Island (Mer), Torres Strait, Australia",
        "geo_era_label": "Contemporary Australia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Indigenous rights perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "The 1992 Mabo v Queensland decision by Australia's High Court overturned the doctrine of terra nullius, recognizing that Aboriginal and Torres Strait Islander peoples had owned their lands before British colonization. Eddie Koiki Mabo's decade-long legal fight established native title in Australian law, fundamentally reshaping the relationship between Indigenous peoples and the Australian state.",
             "summary": "The landmark ruling that recognized Aboriginal land ownership in Australia.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Mabo: The Native Title Revolution", "author": "Bryan Keon-Cohen",
                  "publication": "Insidestory", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "fiji-first-indigenous-settlement",
        "title": "First Settlement of Fiji",
        "year": -1300, "is_bce": True,
        "lat": -17.78, "lng": 177.96,
        "geo_modern": "Viti Levu, Fiji",
        "geo_era_label": "Ancient Fiji",
        "category": "social", "importance_score": 0.55, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific settlement perspective", "culture_code": "fj", "viewpoint_type": "academic",
             "narrative": "Fiji was settled by Lapita peoples around 1300 BCE, becoming a cultural crossroads between Melanesia and Polynesia. The Fijian chiefdom system developed a sophisticated social hierarchy, and Fiji's position made it a critical hub for Pacific voyaging. Its unique dual Melanesian-Polynesian heritage shaped a distinctive culture.",
             "summary": "A Pacific crossroads between Melanesian and Polynesian worlds.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Fiji Before the Fijians", "author": "Patrick Nunn",
                  "publication": "University of the South Pacific", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "pacific-islands-forum-founded",
        "title": "Pacific Islands Forum Founded",
        "year": 1971, "is_bce": False,
        "lat": -18.14, "lng": 178.44,
        "geo_modern": "Suva, Fiji / Wellington, New Zealand",
        "geo_era_label": "Contemporary Pacific",
        "category": "political", "importance_score": 0.55, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Pacific regionalism perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Pacific Islands Forum (originally South Pacific Forum) was established in 1971 to enable Pacific Island nations to coordinate on regional issues. Today it leads the Blue Pacific strategy addressing climate change — an existential threat to low-lying island nations — and advocates for the Pacific as the world's largest ocean continent.",
             "summary": "The Pacific's voice on climate change and regional cooperation.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Pacific Islands: Environment and Society", "author": "Moshe Rapaport",
                  "publication": "University of Hawaii Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL EVENTS TO REACH ~100
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "kilwa-sultanate-great-mosque",
        "title": "Kilwa Sultanate — Great Mosque Construction",
        "year": 1000, "is_bce": False,
        "lat": -8.96, "lng": 39.52,
        "geo_modern": "Kilwa Kisiwani, Tanzania",
        "geo_era_label": "Kilwa Sultanate",
        "category": "religious", "importance_score": 0.6, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "East African architectural perspective", "culture_code": "tz", "viewpoint_type": "academic",
             "narrative": "The Great Mosque of Kilwa, first built around 1000 CE and expanded in the 13th century, was the largest mosque in sub-Saharan Africa. Its coral stone construction and domed roof demonstrated sophisticated Islamic architecture adapted to African materials. Ibn Battuta praised Kilwa as one of the most beautiful cities he had ever seen.",
             "summary": "Sub-Saharan Africa's largest medieval mosque.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Kilwa: An Islamic Trading City on the East African Coast", "author": "Neville Chittick",
                  "publication": "British Institute in Eastern Africa", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1974}
             ]},
        ],
    },
    {
        "slug": "benin-kingdom-bronzes",
        "title": "Kingdom of Benin and the Benin Bronzes",
        "year": 1440, "is_bce": False,
        "lat": 6.34, "lng": 5.63,
        "geo_modern": "Benin City, Edo State, Nigeria",
        "geo_era_label": "Kingdom of Benin",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "ng", "viewpoint_type": "academic",
             "narrative": "The Kingdom of Benin produced some of the finest metalwork in world history — cast brass plaques and sculptures depicting royal ceremonies, warriors, and court life. Under Oba Ewuare (r. c. 1440), Benin City was surrounded by walls longer than the Great Wall of China. The Benin Bronzes, looted by the British in 1897, remain at the center of the global repatriation debate.",
             "summary": "Master metalworkers whose looted treasures fueled the repatriation movement.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Benin: Royal Art of Africa", "author": "Armand Duchateau",
                  "publication": "Prestel", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1994}
             ]},
        ],
    },
    {
        "slug": "atlantic-slave-trade-peak",
        "title": "Atlantic Slave Trade at Its Peak",
        "year": 1750, "is_bce": False,
        "lat": 6.42, "lng": 2.62,
        "geo_modern": "Ouidah, Benin (Dahomey)",
        "geo_era_label": "West Africa / Atlantic World",
        "category": "economic", "importance_score": 0.9, "zoom_min": 2,
        "region": "africa",
        "perspectives": [
            {"label": "African diaspora perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The transatlantic slave trade forcibly transported approximately 12.5 million Africans to the Americas between the 16th and 19th centuries. At its peak in the 1780s, over 80,000 people per year were shipped across the Atlantic. The trade devastated African societies, created the African diaspora, and generated the capital that financed Europe's Industrial Revolution.",
             "summary": "The largest forced migration in history, reshaping four continents.", "evidence_score": 0.92,
             "sources": [
                 {"title": "The Slave Trade: The Story of the Atlantic Slave Trade", "author": "Hugh Thomas",
                  "publication": "Simon & Schuster", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "inca-road-system-qhapaq-nan",
        "title": "Inca Road System (Qhapaq Ñan)",
        "year": 1470, "is_bce": False,
        "lat": -13.52, "lng": -71.97,
        "geo_modern": "Cusco to Quito, Peru / Ecuador",
        "geo_era_label": "Inca Empire",
        "category": "economic", "importance_score": 0.7, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Engineering perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "The Qhapaq Ñan was a 40,000 km network of roads that connected the Inca Empire from Colombia to Chile. It included suspension bridges spanning deep gorges, tunnels through mountains, and tambos (rest stations) at regular intervals. The chasqui relay runners could transmit messages 240 km per day — faster than the Spanish colonial postal system that replaced it.",
             "summary": "The largest road system in pre-Columbian America, spanning six countries.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Great Inka Road", "author": "Ramiro Matos & José Barreiro",
                  "publication": "Smithsonian Books", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2015}
             ]},
        ],
    },
    {
        "slug": "singapore-independence-1965",
        "title": "Singapore Independence",
        "year": 1965, "is_bce": False,
        "lat": 1.35, "lng": 103.82,
        "geo_modern": "Singapore",
        "geo_era_label": "Republic of Singapore",
        "category": "political", "importance_score": 0.65, "zoom_min": 3,
        "region": "southeast-asia",
        "perspectives": [
            {"label": "Development model perspective", "culture_code": "sg", "viewpoint_type": "academic",
             "narrative": "Singapore's separation from Malaysia in 1965 was involuntary — its parliament wept at the announcement. Under Lee Kuan Yew, this tiny city-state with no natural resources transformed itself from a third-world port to a first-world financial hub in one generation, becoming a model of state-led development that influenced nations across Asia and Africa.",
             "summary": "The reluctant nation that became Asia's most successful development story.", "evidence_score": 0.85,
             "sources": [
                 {"title": "From Third World to First", "author": "Lee Kuan Yew",
                  "publication": "HarperCollins", "source_type": "primary", "reliability_tier": 2, "peer_reviewed": False, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "great-enclosure-mapungubwe",
        "title": "Mapungubwe — Southern Africa's First State",
        "year": 1075, "is_bce": False,
        "lat": -22.19, "lng": 29.25,
        "geo_modern": "Limpopo Province, South Africa",
        "geo_era_label": "Kingdom of Mapungubwe",
        "category": "political", "importance_score": 0.6, "zoom_min": 3,
        "region": "africa",
        "perspectives": [
            {"label": "Southern African archaeological perspective", "culture_code": "za", "viewpoint_type": "academic",
             "narrative": "Mapungubwe (1075–1220 CE) was the first state-level society in southern Africa, situated at the confluence of the Limpopo and Shashe rivers. Its golden rhinoceros figurine symbolizes the wealth generated from trade with the Swahili coast. Mapungubwe's social hierarchy and trade networks laid the foundations for the later Kingdom of Zimbabwe.",
             "summary": "The precursor to Great Zimbabwe and southern Africa's earliest kingdom.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Mapungubwe: Ancient African Civilisation on the Limpopo", "author": "Thomas Huffman",
                  "publication": "Wits University Press", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "australian-stolen-generations-apology",
        "title": "Australia's Apology to the Stolen Generations",
        "year": 2008, "is_bce": False,
        "lat": -35.31, "lng": 149.12,
        "geo_modern": "Canberra, Australia",
        "geo_era_label": "Contemporary Australia",
        "category": "social", "importance_score": 0.6, "zoom_min": 3,
        "region": "oceania",
        "perspectives": [
            {"label": "Reconciliation perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "On February 13, 2008, Prime Minister Kevin Rudd delivered a formal apology to Australia's Aboriginal and Torres Strait Islander peoples for the Stolen Generations — children forcibly removed from their families between 1910 and 1970. The apology was a landmark in Australian reconciliation, though many argue substantive justice remains unachieved.",
             "summary": "Australia's formal reckoning with forced removal of Indigenous children.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Bringing Them Home: Report of the National Inquiry into the Separation of Aboriginal and Torres Strait Islander Children from Their Families", "author": "Human Rights and Equal Opportunity Commission",
                  "publication": "Australian Government", "source_type": "primary", "reliability_tier": 1, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "chavin-de-huantar",
        "title": "Chavín de Huántar — Mother Culture of the Andes",
        "year": -900, "is_bce": True,
        "lat": -9.59, "lng": -77.18,
        "geo_modern": "Áncash, Peru",
        "geo_era_label": "Chavín Culture",
        "category": "religious", "importance_score": 0.7, "zoom_min": 3,
        "region": "south-america",
        "perspectives": [
            {"label": "Andean archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Chavín de Huántar (900–200 BCE) was a major ceremonial center and pilgrimage site in the Peruvian highlands. Its underground galleries, elaborate stone carvings of supernatural beings, and acoustic architecture suggest it served as an oracle site. Chavín's art style and religious influence spread across Peru, earning it the title 'mother culture of the Andes.'",
             "summary": "The religious center that unified early Andean civilization.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Chavín and the Origins of Andean Civilization", "author": "Richard Burger",
                  "publication": "Thames & Hudson", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting underrepresented regions seed — {len(EVENTS)} events")

    for event in EVENTS:
        year = event["year"]
        is_bce = event.get("is_bce", False)
        abs_year = abs(year)
        if abs_year > 4712:
            abs_year = 4712  # Postgres BC limit

        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        slug = event["slug"]

        # Check if event already exists
        existing = await conn.fetchval("SELECT id FROM events WHERE slug=$1", slug)
        if existing:
            print(f"  [skip] {slug} (already exists)")
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
            VALUES ('event', $1, 'create', $2, 'ai', 'Underrepresented regions seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ Underrepresented regions seed complete — total approved events: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
