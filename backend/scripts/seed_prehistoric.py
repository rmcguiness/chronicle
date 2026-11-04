#!/usr/bin/env python3
"""
Chronicle seed script — 30 prehistoric events (before ~3000 BCE).

Run:
    python backend/scripts/seed_prehistoric.py
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

CREATED_BY = "seed-script:prehistoric-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # PREHISTORIC / PROTO-HISTORIC (before 3000 BCE)
    # ═══════════════════════════════════════════════════════════════════════

    {
        "slug": "homo-sapiens-migration-out-of-africa",
        "title": "Homo Sapiens Migration Out of Africa",
        "year": -70000, "lat": 12.86, "lng": 43.27,
        "geo_modern": "Bab-el-Mandeb Strait, Djibouti/Yemen",
        "geo_era_label": "Prehistoric Africa",
        "category": "cultural", "importance_score": 0.9, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Paleoanthropological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Genetic and fossil evidence indicates anatomically modern humans migrated out of Africa ~70,000 years ago, crossing the Bab-el-Mandeb strait into the Arabian Peninsula. This dispersal eventually populated every continent except Antarctica.",
             "summary": "The foundational human migration that populated the entire planet.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Journey of Man: A Genetic Odyssey", "author": "Spencer Wells", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "earliest-known-cave-art-el-castillo",
        "title": "Earliest Known Cave Art — El Castillo, Spain",
        "year": -40800, "lat": 43.29, "lng": -3.97,
        "geo_modern": "Puente Viesgo, Cantabria, Spain",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Red disc paintings in El Castillo cave, dated to ~40,800 BP by uranium-thorium dating, represent the oldest known cave art in Europe, possibly created by Neanderthals rather than Homo sapiens.",
             "summary": "The oldest known European cave art, possibly Neanderthal in origin.", "evidence_score": 0.80,
             "sources": [
                 {"title": "U-Series Dating of Paleolithic Art in 11 Caves in Spain", "author": "A.W.G. Pike et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "last-glacial-maximum",
        "title": "Last Glacial Maximum — Peak of the Ice Age",
        "year": -20000, "lat": 65.0, "lng": -20.0,
        "geo_modern": "Northern Hemisphere (global event)",
        "geo_era_label": "Pleistocene",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Climatological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Around 20,000 years ago, ice sheets covered much of North America and northern Europe, sea levels dropped ~120 meters, and vast land bridges connected continents. Human populations were confined to refugia in southern Europe, Africa, and Southeast Asia.",
             "summary": "Peak glaciation that reshaped geography and constrained human habitation.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Ice Age Earth: Late Quaternary Geology and Climate", "author": "Alastair Dawson", "publication": "Routledge",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "cave-paintings-lascaux",
        "title": "Cave Paintings at Lascaux",
        "year": -17000, "lat": 45.05, "lng": 1.17,
        "geo_modern": "Montignac, Dordogne, France",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Lascaux cave complex contains some 600 paintings and 1,500 engravings of animals, humans, and abstract signs, created ~17,000 years ago. These masterworks demonstrate sophisticated artistic technique and likely held ritual significance for Upper Paleolithic peoples.",
             "summary": "One of humanity's greatest early artistic achievements.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Cave of Lascaux: The Final Photographs", "author": "Mario Ruspoli", "publication": "Abrams",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1987}
             ]},
        ],
    },
    {
        "slug": "cave-paintings-altamira",
        "title": "Cave Paintings at Altamira",
        "year": -14000, "lat": 43.38, "lng": -4.12,
        "geo_modern": "Santillana del Mar, Cantabria, Spain",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Altamira's polychrome bison paintings, dating to ~14,000 BCE, stunned the 19th-century world when discovered in 1879. Their sophistication challenged assumptions about 'primitive' prehistoric peoples and established cave art as a major field of study.",
             "summary": "Polychrome cave art that revolutionized understanding of prehistoric human capability.", "evidence_score": 0.87,
             "sources": [
                 {"title": "Cave Art", "author": "Jean Clottes", "publication": "Phaidon",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "first-human-settlement-americas-beringia",
        "title": "First Human Migration to the Americas via Beringia",
        "year": -15000, "lat": 65.5, "lng": -168.0,
        "geo_modern": "Bering Strait, Alaska/Russia",
        "geo_era_label": "Late Pleistocene",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "During the last Ice Age, lowered sea levels exposed a land bridge between Siberia and Alaska. Humans crossed into the Americas ~15,000 years ago (some evidence suggests earlier), eventually reaching the tip of South America within a few thousand years.",
             "summary": "The peopling of the Americas via the Bering land bridge.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The First Americans: In Pursuit of Archaeology's Greatest Mystery", "author": "James Adovasio", "publication": "Random House",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "natufian-culture-earliest-sedentary-settlements",
        "title": "Natufian Culture — Earliest Sedentary Settlements",
        "year": -12500, "lat": 32.68, "lng": 35.57,
        "geo_modern": "Wadi en-Natuf, Palestine/Israel",
        "geo_era_label": "Epipaleolithic Levant",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Natufian culture (12,500–9,500 BCE) in the Levant represents the earliest known transition from nomadic to sedentary life, with permanent stone villages, grain storage, and possibly the earliest dog domestication.",
             "summary": "The world's first settled communities, presaging agriculture.", "evidence_score": 0.84,
             "sources": [
                 {"title": "The Natufian Culture in the Levant", "author": "Ofer Bar-Yosef", "publication": "Evolutionary Anthropology",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "agricultural-revolution-fertile-crescent",
        "title": "Agricultural Revolution — Fertile Crescent",
        "year": -10000, "lat": 36.86, "lng": 40.20,
        "geo_modern": "Upper Mesopotamia, Syria/Turkey",
        "geo_era_label": "Pre-Pottery Neolithic",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The independent domestication of wheat, barley, lentils, sheep, and goats in the Fertile Crescent ~10,000 BCE transformed human society from nomadic hunter-gatherers to settled farmers, enabling population growth, surplus, specialization, and eventually civilization.",
             "summary": "The single most transformative shift in human history — from foraging to farming.", "evidence_score": 0.92,
             "sources": [
                 {"title": "Guns, Germs, and Steel", "author": "Jared Diamond", "publication": "W.W. Norton",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "gobekli-tepe-construction",
        "title": "Göbekli Tepe — World's Oldest Known Temple",
        "year": -9500, "lat": 37.22, "lng": 38.92,
        "geo_modern": "Şanlıurfa Province, Turkey",
        "geo_era_label": "Pre-Pottery Neolithic",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Göbekli Tepe, built by pre-agricultural hunter-gatherers ~9500 BCE, contains massive carved stone pillars arranged in circles. It overturned the assumption that agriculture preceded monumental architecture — suggesting religion may have driven the Neolithic Revolution.",
             "summary": "A monumental temple built before farming, reshaping theories of civilization's origins.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Birth of Religion", "author": "Klaus Schmidt", "publication": "National Geographic",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "rice-domestication-yangtze-river",
        "title": "Rice Domestication in the Yangtze River Valley",
        "year": -9000, "lat": 30.0, "lng": 119.7,
        "geo_modern": "Zhejiang Province, China",
        "geo_era_label": "Neolithic China",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Archaeological evidence from sites like Shangshan and Kuahuqiao shows rice was independently domesticated in the Yangtze River region ~9000 BCE. This became the staple crop for billions of people across East and Southeast Asia.",
             "summary": "Independent agricultural revolution in China that feeds half the world today.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Origins of Rice Agriculture", "author": "Dorian Fuller et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "jericho-earliest-walled-city",
        "title": "Jericho — Earliest Known Walled City",
        "year": -8000, "lat": 31.87, "lng": 35.44,
        "geo_modern": "Jericho, Palestine",
        "geo_era_label": "Pre-Pottery Neolithic",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "By ~8000 BCE, Jericho had a population of several thousand, a massive stone wall with a tower, and organized community life — making it one of the earliest proto-urban settlements in human history.",
             "summary": "One of the world's first walled settlements, evidence of early urban life.", "evidence_score": 0.86,
             "sources": [
                 {"title": "Excavations at Jericho", "author": "Kathleen Kenyon", "publication": "British School of Archaeology in Jerusalem",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1957}
             ]},
        ],
    },
    {
        "slug": "domestication-of-cattle",
        "title": "Domestication of Cattle in the Near East",
        "year": -8000, "lat": 37.0, "lng": 43.0,
        "geo_modern": "Southeastern Turkey / Northern Syria",
        "geo_era_label": "Neolithic Near East",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Zooarchaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Wild aurochs were domesticated into cattle ~8000 BCE in the upper Euphrates region. Cattle provided milk, meat, leather, and draft power, becoming central to Neolithic economies and eventually enabling the plow agriculture that transformed Eurasia.",
             "summary": "Cattle domestication — the animal that powered early civilization.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Origins and Spread of Domestic Animals in Southwest Asia and Europe", "author": "Sue Colledge et al.",
                  "publication": "Left Coast Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "saharan-green-period-rock-art",
        "title": "Green Sahara Period — Rock Art and Pastoralism",
        "year": -7000, "lat": 24.5, "lng": 10.0,
        "geo_modern": "Tassili n'Ajjer, Algeria",
        "geo_era_label": "Neolithic Sahara",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "dz", "viewpoint_type": "academic",
             "narrative": "During the African Humid Period (~9000–3000 BCE), the Sahara was a green savanna with lakes and rivers. Rock art at Tassili n'Ajjer depicts cattle herding, wildlife, and daily life, revealing a rich pastoral civilization before desertification.",
             "summary": "A lush, inhabited Sahara documented through extraordinary rock art.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Rock Art of the Sahara", "author": "Jean-Loïc Le Quellec", "publication": "Flammarion",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "maize-domestication-mesoamerica",
        "title": "Domestication of Maize in Mesoamerica",
        "year": -7000, "lat": 18.0, "lng": -99.5,
        "geo_modern": "Balsas River Valley, Guerrero, Mexico",
        "geo_era_label": "Archaic Mesoamerica",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "Genetic and archaeological evidence shows teosinte was domesticated into maize in the Balsas River region of Mexico ~7000 BCE. Maize became the staple crop of all major American civilizations — Olmec, Maya, Aztec, and Inca.",
             "summary": "The Americas' agricultural revolution — transforming a wild grass into civilization's staple.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Origin of Corn", "author": "Dolores Piperno & Kent Flannery", "publication": "PNAS",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "pottery-invention-east-asia",
        "title": "Earliest Known Pottery — Xianrendong Cave, China",
        "year": -18000, "lat": 28.73, "lng": 117.07,
        "geo_modern": "Jiangxi Province, China",
        "geo_era_label": "Upper Paleolithic East Asia",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Pottery fragments from Xianrendong Cave, dated to ~18,000 BCE, are the oldest known ceramics in the world — predating agriculture by thousands of years and showing that hunter-gatherers invented this fundamental technology.",
             "summary": "The world's oldest pottery, created by Ice Age hunter-gatherers.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Early Pottery at 20,000 Years Ago in Xianrendong Cave, China", "author": "Xiaohong Wu et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "first-copper-smelting-balkans",
        "title": "First Copper Smelting — Balkans",
        "year": -5000, "lat": 44.26, "lng": 22.08,
        "geo_modern": "Belovode, Serbia",
        "geo_era_label": "Chalcolithic Balkans",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Evidence from Belovode and Pločnik in Serbia shows copper smelting from ore as early as ~5000 BCE, predating Near Eastern metallurgy. This Balkan copper age produced tools, weapons, and the remarkable Varna gold treasure.",
             "summary": "The dawn of metallurgy — extracting metal from rock for the first time.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Earliest copper smelting in the Balkans", "author": "Miljana Radivojević et al.", "publication": "Journal of Archaeological Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "neolithic-revolution-britain",
        "title": "Neolithic Revolution Reaches Britain",
        "year": -4000, "lat": 51.18, "lng": -1.83,
        "geo_modern": "Wessex, England",
        "geo_era_label": "Neolithic Britain",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Around 4000 BCE, farming, pottery, and monument-building arrived in Britain, likely brought by migrating communities from continental Europe. This Neolithic transition replaced the Mesolithic hunter-gatherer way of life.",
             "summary": "Agriculture and settled life reach the British Isles.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Beaker People", "author": "Ian Armit et al.", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2018}
             ]},
        ],
    },
    {
        "slug": "earliest-irrigation-mesopotamia",
        "title": "Earliest Irrigation Systems in Mesopotamia",
        "year": -6000, "lat": 32.0, "lng": 45.0,
        "geo_modern": "Southern Iraq",
        "geo_era_label": "Ubaid Period Mesopotamia",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "By ~6000 BCE, farmers in southern Mesopotamia had developed canal irrigation systems to water their fields in the arid floodplains. This technology enabled the agricultural surplus that would support the world's first cities.",
             "summary": "Irrigation engineering that made Mesopotamian civilization possible.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Early Mesopotamia: Society and Economy at the Dawn of History", "author": "J.N. Postgate",
                  "publication": "Routledge", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1992}
             ]},
        ],
    },
    {
        "slug": "megaliths-carnac-brittany",
        "title": "Carnac Megalithic Alignments — Brittany",
        "year": -4500, "lat": 47.59, "lng": -3.07,
        "geo_modern": "Carnac, Brittany, France",
        "geo_era_label": "Neolithic Europe",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "fr", "viewpoint_type": "academic",
             "narrative": "The Carnac stones — over 3,000 standing stones arranged in parallel rows stretching over 3 km — were erected ~4500 BCE by Neolithic communities. Their exact purpose remains debated: astronomical observatory, ritual processional way, or territorial marker.",
             "summary": "One of the world's largest megalithic monument complexes.", "evidence_score": 0.75,
             "sources": [
                 {"title": "Carnac: The Alignments", "author": "Pierre-Roland Giot", "publication": "Editions Ouest-France",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "vinca-culture-old-europe",
        "title": "Vinča Culture — Advanced Neolithic Civilization in Old Europe",
        "year": -5500, "lat": 44.76, "lng": 20.63,
        "geo_modern": "Vinča-Belo Brdo, Serbia",
        "geo_era_label": "Neolithic Balkans",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Vinča culture (5500–4500 BCE) in southeastern Europe featured large settlements, sophisticated pottery, proto-writing symbols, and copper metallurgy — representing one of the most advanced Neolithic civilizations.",
             "summary": "An advanced pre-literate European civilization with proto-writing.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Civilization of the Goddess", "author": "Marija Gimbutas", "publication": "HarperSanFrancisco",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1991}
             ]},
        ],
    },
    {
        "slug": "dog-domestication-earliest",
        "title": "Domestication of the Dog — Humanity's First Animal Companion",
        "year": -15000, "lat": 50.0, "lng": 30.0,
        "geo_modern": "Central Europe or East Asia (debated)",
        "geo_era_label": "Upper Paleolithic",
        "category": "discovery", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Genetic/archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Dogs were the first domesticated animal, diverging from wolves ~15,000–40,000 years ago. The exact timing and location remain debated, but by 15,000 BCE dogs were buried alongside humans, indicating deep bonds between the two species.",
             "summary": "The world's first animal domestication — wolves became dogs.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Genomic and archaeological evidence suggest a dual origin of domestic dogs", "author": "Laurent Frantz et al.",
                  "publication": "Science", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "indus-valley-civilization-founding",
        "title": "Indus Valley Civilization — Earliest Urban Phase",
        "year": -3300, "lat": 27.32, "lng": 68.14,
        "geo_modern": "Mohenjo-daro, Sindh, Pakistan",
        "geo_era_label": "Early Harappan",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pk", "viewpoint_type": "academic",
             "narrative": "The Indus Valley Civilization began its urban phase ~3300 BCE, eventually encompassing cities like Mohenjo-daro and Harappa with advanced urban planning, sewage systems, standardized weights, and an undeciphered script — rivaling contemporary Mesopotamia and Egypt.",
             "summary": "South Asia's first civilization, with remarkable urban sophistication.", "evidence_score": 0.87,
             "sources": [
                 {"title": "The Ancient Indus: Urbanism, Economy, and Society", "author": "Rita Wright", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    {
        "slug": "bronze-age-begins-near-east",
        "title": "Bronze Age Begins — Tin-Copper Alloy Revolution",
        "year": -3300, "lat": 35.0, "lng": 38.0,
        "geo_modern": "Near East (Mesopotamia/Anatolia)",
        "geo_era_label": "Early Bronze Age",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Around 3300 BCE, metalworkers discovered that adding tin to copper created bronze — a harder, more durable alloy. This technological breakthrough enabled superior weapons and tools, long-distance trade networks for tin, and new forms of social hierarchy.",
             "summary": "The alloy that gave an entire age its name and transformed warfare and trade.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Oxford Handbook of the Bronze Age", "author": "Harry Fokkens & Anthony Harding", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "aboriginal-australian-rock-art-kakadu",
        "title": "Aboriginal Rock Art Tradition — Kakadu, Australia",
        "year": -20000, "lat": -12.43, "lng": 132.89,
        "geo_modern": "Kakadu National Park, Northern Territory, Australia",
        "geo_era_label": "Prehistoric Australia",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological/Indigenous perspective", "culture_code": "au", "viewpoint_type": "academic",
             "narrative": "Kakadu contains one of the world's highest concentrations of rock art sites, with paintings spanning at least 20,000 years. Aboriginal Australians maintained the longest continuous artistic and cultural tradition in human history.",
             "summary": "The world's longest continuous artistic tradition.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Journey in Time: The World's Longest Continuing Art Tradition", "author": "George Chaloupka",
                  "publication": "Reed New Holland", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1993}
             ]},
        ],
    },
    {
        "slug": "earliest-known-textile-production",
        "title": "Earliest Known Textile Production — Flax Fibers",
        "year": -30000, "lat": 42.18, "lng": 43.33,
        "geo_modern": "Dzudzuana Cave, Georgia",
        "geo_era_label": "Upper Paleolithic Caucasus",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Flax fibers found in Dzudzuana Cave, Georgia, dated to ~30,000 BCE, are the earliest evidence of textile production. Some were dyed, indicating sophisticated processing. Textiles were essential for clothing, shelter, and carrying goods.",
             "summary": "Evidence that Ice Age humans produced dyed textiles 30,000 years ago.", "evidence_score": 0.75,
             "sources": [
                 {"title": "30,000-Year-Old Wild Flax Fibers", "author": "Eliso Kvavadze et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "yangshao-culture-yellow-river",
        "title": "Yangshao Culture — Painted Pottery of the Yellow River",
        "year": -5000, "lat": 34.5, "lng": 109.0,
        "geo_modern": "Shaanxi / Henan Province, China",
        "geo_era_label": "Neolithic China",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Yangshao culture (5000–3000 BCE) along the Yellow River produced distinctive painted pottery, practiced millet agriculture, and built substantial villages — forming one of the foundations of Chinese civilization.",
             "summary": "A major Neolithic culture ancestral to Chinese civilization.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Formation of Chinese Civilization", "author": "Kwang-chih Chang & Pingfang Xu",
                  "publication": "Yale University Press", "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2005}
             ]},
        ],
    },
    {
        "slug": "norte-chico-caral-americas-first-city",
        "title": "Norte Chico / Caral — Oldest City in the Americas",
        "year": -3000, "lat": -10.89, "lng": -77.52,
        "geo_modern": "Supe Valley, Lima Region, Peru",
        "geo_era_label": "Preceramic Peru",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "Caral, in the Supe Valley of Peru, was a complex urban center by ~3000 BCE — contemporary with early Egyptian and Mesopotamian cities. It featured monumental pyramids, plazas, and residential areas, all without ceramics or writing.",
             "summary": "The Americas' oldest known civilization, contemporary with Sumer and Egypt.", "evidence_score": 0.84,
             "sources": [
                 {"title": "Dating Caral, a Preceramic Site in the Supe Valley", "author": "Ruth Shady Solís et al.",
                  "publication": "Science", "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2001}
             ]},
        ],
    },
    {
        "slug": "megalithic-temples-malta",
        "title": "Megalithic Temples of Malta — Oldest Freestanding Structures",
        "year": -3600, "lat": 35.83, "lng": 14.39,
        "geo_modern": "Ġgantija, Gozo, Malta",
        "geo_era_label": "Neolithic Malta",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "mt", "viewpoint_type": "academic",
             "narrative": "The Ġgantija temples on Gozo, built ~3600 BCE, predate Stonehenge and the Egyptian pyramids. These limestone temples, with elaborate carvings and possible astronomical alignments, demonstrate remarkable Neolithic engineering on a small Mediterranean island.",
             "summary": "The world's oldest freestanding stone structures, predating the pyramids.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Malta: Prehistory and Temples", "author": "David Trump", "publication": "Midsea Books",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting prehistoric seed — {len(EVENTS)} events")

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
            VALUES ('event', $1, 'create', $2, 'ai', 'Prehistoric seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    print(f"\n✅ Prehistoric seed complete — total approved events: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
