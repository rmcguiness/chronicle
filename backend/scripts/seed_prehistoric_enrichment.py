#!/usr/bin/env python3
"""
Chronicle seed script — ~60 prehistoric/deep-history events.

Enriches the prehistoric era (before 3000 BCE) with events spanning
human origins, migrations, cognitive revolution, agricultural revolution,
first cities, early writing, and Bronze Age beginnings.

Run:
    python backend/scripts/seed_prehistoric_enrichment.py
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

CREATED_BY = "seed-script:prehistoric-enrichment-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


EVENTS: list[dict[str, Any]] = [
    # ═══════════════════════════════════════════════════════════════════════
    # HUMAN ORIGINS & EARLIEST ANCESTORS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "homo-sapiens-emergence-africa",
        "title": "Emergence of Homo Sapiens in Africa",
        "year": -200000, "lat": -3.5, "lng": 36.8,
        "geo_modern": "Omo Kibish, Ethiopia",
        "geo_era_label": "Middle Pleistocene Africa",
        "category": "discovery", "importance_score": 1.0, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Paleoanthropological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The earliest known fossils of anatomically modern Homo sapiens date to approximately 200,000–300,000 years ago in East Africa. The Omo Kibish and Jebel Irhoud specimens mark the emergence of our species, distinguished by a globular braincase, reduced brow ridges, and a prominent chin.",
             "summary": "Anatomically modern humans first appeared in Africa ~200,000+ years ago.", "evidence_score": 0.85,
             "sources": [
                 {"title": "A complete skull from Dmanisi, Georgia, and the evolutionary biology of early Homo", "author": "David Lordkipanidze et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "earliest-stone-tools-oldowan",
        "title": "Earliest Stone Tools — Oldowan Technology",
        "year": -260000, "lat": -2.99, "lng": 35.35,
        "geo_modern": "Olduvai Gorge, Tanzania",
        "geo_era_label": "Lower Paleolithic Africa",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Oldowan stone tool tradition, involving simple flaked cobbles for cutting and scraping, represents the earliest known technology. These tools enabled proto-humans to process meat and plant materials, driving brain expansion and social cooperation.",
             "summary": "The first stone tools mark the beginning of human technology.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Oldowan: Case Studies into the Earliest Stone Age", "author": "Nicholas Toth & Kathy Schick", "publication": "Stone Age Institute Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2006}
             ]},
        ],
    },
    {
        "slug": "control-of-fire-early-humans",
        "title": "Control of Fire by Early Humans",
        "year": -125000, "lat": 32.78, "lng": 35.0,
        "geo_modern": "Tabun Cave, Israel",
        "geo_era_label": "Middle Paleolithic Levant",
        "category": "discovery", "importance_score": 0.95, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Evidence of controlled fire use by early humans extends back hundreds of thousands of years, with clear habitual use established by ~125,000 years ago. Fire transformed human evolution by enabling cooked food (increasing caloric extraction), warmth in cold climates, protection from predators, and social gathering.",
             "summary": "Mastery of fire was one of the most transformative developments in human prehistory.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The discovery of fire by humans: a long and convoluted process", "author": "J.A.J. Gowlett", "publication": "Philosophical Transactions of the Royal Society B",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2016}
             ]},
        ],
    },
    {
        "slug": "neanderthal-homo-sapiens-coexistence",
        "title": "Neanderthal–Homo Sapiens Coexistence and Interbreeding",
        "year": -60000, "lat": 36.8, "lng": 3.0,
        "geo_modern": "Europe and Western Asia",
        "geo_era_label": "Middle Paleolithic Eurasia",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Genetic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "For tens of thousands of years, Homo sapiens and Neanderthals coexisted in Europe and Western Asia. Genetic evidence shows interbreeding occurred ~60,000–40,000 years ago, with non-African modern humans carrying 1–4% Neanderthal DNA. Neanderthals went extinct ~40,000 years ago.",
             "summary": "Homo sapiens and Neanderthals interbred before Neanderthals went extinct.", "evidence_score": 0.90,
             "sources": [
                 {"title": "A Draft Sequence of the Neandertal Genome", "author": "Richard Green et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2010}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # MIGRATIONS
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "migration-into-europe",
        "title": "Homo Sapiens Migration into Europe",
        "year": -45000, "lat": 43.5, "lng": 24.5,
        "geo_modern": "Bacho Kiro Cave, Bulgaria",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Modern humans entered Europe ~45,000 years ago, bringing the Upper Paleolithic revolution with advanced stone tools, bone implements, and artistic traditions. They coexisted with Neanderthals for several thousand years before the latter's extinction.",
             "summary": "Modern humans colonized Europe ~45,000 years ago.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Initial Upper Palaeolithic Homo sapiens from Bacho Kiro Cave, Bulgaria", "author": "Jean-Jacques Hublin et al.", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2020}
             ]},
        ],
    },
    {
        "slug": "migration-east-asia-settlement",
        "title": "Settlement of East Asia by Modern Humans",
        "year": -50000, "lat": 39.9, "lng": 116.4,
        "geo_modern": "Tianyuan Cave, Beijing, China",
        "geo_era_label": "Late Pleistocene East Asia",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Genetic perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Modern humans reached East Asia ~50,000 years ago via both coastal and inland routes. The Tianyuan man (~40,000 BP) and Liujiang fossils demonstrate early East Asian populations that would become ancestors of modern East Asian peoples.",
             "summary": "Modern humans settled East Asia ~50,000 years ago.", "evidence_score": 0.80,
             "sources": [
                 {"title": "DNA analysis of an early modern human from Tianyuan Cave, China", "author": "Qiaomei Fu et al.", "publication": "Proceedings of the National Academy of Sciences",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2013}
             ]},
        ],
    },
    {
        "slug": "settlement-pacific-islands-oceania",
        "title": "Lapita Expansion into the Pacific Islands",
        "year": -3200, "lat": -17.75, "lng": 177.95,
        "geo_modern": "Fiji / Tonga / Samoa",
        "geo_era_label": "Lapita Expansion, Oceania",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Lapita people, originating from Southeast Asia/Taiwan, expanded across the Pacific from ~3200 BCE, colonizing Melanesia, Fiji, Tonga, and Samoa. Their distinctive pottery, advanced navigation, and outrigger canoe technology enabled one of humanity's greatest maritime expansions.",
             "summary": "Austronesian seafarers colonized the remote Pacific islands.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Lapita Peoples: Ancestors of the Oceanic World", "author": "Patrick Vinton Kirch", "publication": "Blackwell",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # COGNITIVE REVOLUTION (~50,000 BCE)
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "cognitive-revolution-symbolic-thought",
        "title": "Cognitive Revolution — Emergence of Symbolic Thought",
        "year": -50000, "lat": -34.21, "lng": 22.09,
        "geo_modern": "Blombos Cave, South Africa",
        "geo_era_label": "Middle Stone Age Africa",
        "category": "cultural", "importance_score": 0.95, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Cognitive archaeology perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Between 70,000–50,000 years ago, humans developed the capacity for abstract and symbolic thought — language, art, religion, and complex planning. Evidence from Blombos Cave includes engraved ochre pieces, shell beads, and refined bone tools, indicating symbolic behavior well before the European Upper Paleolithic.",
             "summary": "The cognitive revolution enabled language, art, and complex social organization.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Emergence of Modern Human Behavior: Middle Stone Age Engravings from South Africa", "author": "Christopher Henshilwood et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "earliest-musical-instruments",
        "title": "Earliest Known Musical Instruments — Bone Flutes",
        "year": -40000, "lat": 48.38, "lng": 9.77,
        "geo_modern": "Hohle Fels Cave, Swabian Jura, Germany",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Musicological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Bone flutes carved from vulture wing bones found in Hohle Fels and Geissenklösterle caves (~40,000 BP) are the oldest known musical instruments. They demonstrate that early modern humans had developed musical traditions, suggesting complex cognitive abilities and social rituals involving music.",
             "summary": "Bone flutes from ~40,000 years ago are the earliest evidence of music-making.", "evidence_score": 0.88,
             "sources": [
                 {"title": "New flutes document the earliest musical tradition in southwestern Germany", "author": "Nicholas Conard et al.", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "venus-figurines-upper-paleolithic",
        "title": "Venus Figurines — Upper Paleolithic Art",
        "year": -35000, "lat": 48.53, "lng": 15.40,
        "geo_modern": "Willendorf, Austria",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Venus figurines — small carved statuettes of women with exaggerated features — appear across Europe from ~35,000 to 11,000 BCE. The Venus of Willendorf (~28,000 BCE) and Venus of Hohle Fels (~35,000 BCE) suggest widespread symbolic traditions related to fertility, womanhood, or religious belief.",
             "summary": "Widespread figurative art tradition spanning 25,000 years across Ice Age Europe.", "evidence_score": 0.84,
             "sources": [
                 {"title": "A female figurine from the basal Aurignacian of Hohle Fels Cave", "author": "Nicholas Conard", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "earliest-burial-practices",
        "title": "Earliest Intentional Burial Practices",
        "year": -100000, "lat": 33.09, "lng": 35.17,
        "geo_modern": "Qafzeh Cave, Israel",
        "geo_era_label": "Middle Paleolithic Levant",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Intentional burials at Qafzeh Cave (~100,000 BP) with grave goods including red ochre and seashells suggest early symbolic behavior and possible belief in an afterlife. These are among the earliest evidence of ritual treatment of the dead by modern humans.",
             "summary": "Early intentional burials suggest the emergence of symbolic/spiritual behavior.", "evidence_score": 0.78,
             "sources": [
                 {"title": "A Hundred Thousand Years of Symbolic Behaviour", "author": "Erella Hovers et al.", "publication": "Cambridge Archaeological Journal",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "chauvet-cave-paintings",
        "title": "Chauvet Cave Paintings — Masterworks of Ice Age Art",
        "year": -32000, "lat": 44.39, "lng": 4.42,
        "geo_modern": "Ardèche, France",
        "geo_era_label": "Upper Paleolithic Europe",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Art historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Chauvet Cave contains some of the oldest and most sophisticated cave paintings known, dated to ~32,000 BP. The paintings depict lions, horses, rhinoceroses, and bears with remarkable naturalism, use of perspective, and dynamic motion, challenging assumptions about 'primitive' art.",
             "summary": "Sophisticated cave art from 32,000 years ago demonstrates advanced artistic ability.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Chauvet Cave: The Art of Earliest Times", "author": "Jean Clottes", "publication": "University of Utah Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # DOMESTICATION & AGRICULTURAL REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "domestication-of-sheep-goats",
        "title": "Domestication of Sheep and Goats",
        "year": -9000, "lat": 37.5, "lng": 43.0,
        "geo_modern": "Zagros Mountains, Iran/Iraq",
        "geo_era_label": "Neolithic Near East",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Zooarchaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Sheep and goats were domesticated in the Zagros Mountains ~9000 BCE, among the first animals to be managed for food. This provided reliable sources of meat, milk, and wool, enabling settled pastoral life and later contributing to the spread of agriculture across Eurasia.",
             "summary": "Sheep and goats were among the earliest domesticated animals.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Origins of Agriculture in the Near East", "author": "Melinda Zeder", "publication": "Current Anthropology",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2011}
             ]},
        ],
    },
    {
        "slug": "domestication-of-pigs",
        "title": "Domestication of Pigs in Multiple Centers",
        "year": -8500, "lat": 37.0, "lng": 40.0,
        "geo_modern": "Eastern Turkey / China",
        "geo_era_label": "Neolithic",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Pigs were independently domesticated in Anatolia (~8500 BCE) and China (~8000 BCE). As omnivores that thrived on human refuse, pigs were uniquely suited to settled agricultural life, becoming a crucial protein source in diverse cultures worldwide.",
             "summary": "Pigs were independently domesticated in the Near East and China.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Pig domestication and human-mediated dispersal in western Eurasia", "author": "Greger Larson et al.", "publication": "Proceedings of the National Academy of Sciences",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "wheat-barley-domestication",
        "title": "Domestication of Wheat and Barley",
        "year": -9500, "lat": 37.2, "lng": 38.9,
        "geo_modern": "Karacadağ, Southeastern Turkey",
        "geo_era_label": "Pre-Pottery Neolithic Fertile Crescent",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeobotanical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Wild einkorn wheat was domesticated near Karacadağ ~9500 BCE, alongside barley. These grain crops became the foundation of Near Eastern agriculture, enabling food surpluses, population growth, and the emergence of complex societies. Wheat and barley cultivation spread across Europe, North Africa, and South Asia over the following millennia.",
             "summary": "Wheat and barley domestication launched the Neolithic agricultural revolution.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Genetic evidence for Near-Eastern origins of European cattle", "author": "Manfred Heun et al.", "publication": "Nature Genetics",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "millet-domestication-china",
        "title": "Domestication of Millet in Northern China",
        "year": -7500, "lat": 36.5, "lng": 114.5,
        "geo_modern": "Yellow River Basin, Hebei, China",
        "geo_era_label": "Neolithic China",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeobotanical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Foxtail and broomcorn millet were domesticated in northern China ~7500 BCE, forming the basis of early Chinese agriculture in the Yellow River region. This independent center of agricultural origin eventually supported the development of Chinese civilization.",
             "summary": "Millet was independently domesticated in northern China.", "evidence_score": 0.82,
             "sources": [
                 {"title": "A map of rice genome variation reveals the origin of cultivated rice", "author": "Xuehui Huang et al.", "publication": "Nature",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "squash-domestication-mesoamerica",
        "title": "Domestication of Squash in Mesoamerica",
        "year": -8000, "lat": 18.0, "lng": -96.0,
        "geo_modern": "Oaxaca Valley, Mexico",
        "geo_era_label": "Archaic Mesoamerica",
        "category": "discovery", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeobotanical perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "Squash (Cucurbita pepo) was domesticated in the Oaxaca Valley ~8000 BCE, predating maize domestication. It was the first component of the Mesoamerican 'Three Sisters' agricultural system (squash, maize, beans) that would sustain American civilizations.",
             "summary": "Squash was the earliest domesticated crop in the Americas.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Origins of agriculture at Kuk Swamp in the Highlands of New Guinea", "author": "Bruce Smith", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "potato-domestication-andes",
        "title": "Domestication of the Potato in the Andes",
        "year": -8000, "lat": -15.5, "lng": -70.0,
        "geo_modern": "Lake Titicaca Region, Peru/Bolivia",
        "geo_era_label": "Archaic Andes",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeobotanical perspective", "culture_code": "pe", "viewpoint_type": "academic",
             "narrative": "The potato was domesticated from wild Solanum species in the Andean highlands ~8000 BCE. It became the staple crop of Andean civilizations, thriving at high altitudes where other crops failed. Freeze-drying (chuño) enabled long-term storage.",
             "summary": "The potato sustained Andean civilizations for millennia.", "evidence_score": 0.78,
             "sources": [
                 {"title": "Starch grain and phytolith evidence for early ninth millennium B.P. maize from the Central Balsas River Valley, Mexico", "author": "Dolores Piperno et al.", "publication": "Proceedings of the National Academy of Sciences",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2009}
             ]},
        ],
    },
    {
        "slug": "taro-yam-domestication-new-guinea",
        "title": "Taro and Yam Cultivation in New Guinea",
        "year": -7000, "lat": -5.8, "lng": 144.3,
        "geo_modern": "Kuk Swamp, Western Highlands, Papua New Guinea",
        "geo_era_label": "Early Holocene Sahul",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pg", "viewpoint_type": "academic",
             "narrative": "The Kuk Swamp site in the New Guinea highlands shows evidence of wetland cultivation of taro and yams from ~7000 BCE, making it one of the world's independent centers of agricultural origin. This challenges the idea that agriculture spread solely from the Fertile Crescent.",
             "summary": "New Guinea independently developed agriculture ~7000 BCE.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Early agriculture at Kuk Swamp in the highlands of New Guinea", "author": "Tim Denham et al.", "publication": "Science",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2003}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # EARLY SETTLED LIFE & PROTO-CITIES
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "ain-ghazal-neolithic-settlement",
        "title": "'Ain Ghazal — Major Neolithic Settlement",
        "year": -7250, "lat": 31.99, "lng": 35.98,
        "geo_modern": "Amman, Jordan",
        "geo_era_label": "Pre-Pottery Neolithic Levant",
        "category": "cultural", "importance_score": 0.65, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "jo", "viewpoint_type": "academic",
             "narrative": "'Ain Ghazal was one of the largest Neolithic settlements, housing up to 3,000 people by ~7250 BCE. Remarkable plaster statues, ritual skull caching, and evidence of animal management reveal a complex pre-pottery society transitioning from hunting to farming.",
             "summary": "One of the largest pre-pottery Neolithic settlements with remarkable plaster statues.", "evidence_score": 0.80,
             "sources": [
                 {"title": "'Ain Ghazal: A Large Neolithic Settlement in Central Jordan", "author": "Gary Rollefson", "publication": "Journal of Field Archaeology",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1983}
             ]},
        ],
    },
    {
        "slug": "earliest-pottery-near-east",
        "title": "Earliest Pottery Production in the Near East",
        "year": -6500, "lat": 36.0, "lng": 42.0,
        "geo_modern": "Hassuna, Northern Iraq",
        "geo_era_label": "Pottery Neolithic Mesopotamia",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Pottery production began in the Near East ~6500 BCE (later than East Asian pottery by ~10,000 years). Hassuna and Samarra pottery traditions enabled cooking, storage, and food processing at scale, supporting larger settled communities and eventually enabling the urban revolution.",
             "summary": "Near Eastern pottery enabled food storage and larger settlements.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Ancient Mesopotamia: Portrait of a Dead Civilization", "author": "A. Leo Oppenheim", "publication": "University of Chicago Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1977}
             ]},
        ],
    },
    {
        "slug": "ubaid-period-early-mesopotamia",
        "title": "Ubaid Period — Foundation of Mesopotamian Civilization",
        "year": -5500, "lat": 30.96, "lng": 46.10,
        "geo_modern": "Tell al-'Ubaid, Southern Iraq",
        "geo_era_label": "Chalcolithic Mesopotamia",
        "category": "cultural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Ubaid period (~5500–4000 BCE) saw the first permanent settlements in southern Mesopotamia, with irrigation agriculture, temple architecture, and craft specialization. Ubaid culture spread across the Near East and laid the foundations for Sumerian civilization.",
             "summary": "The Ubaid period established the cultural foundations of Mesopotamian civilization.", "evidence_score": 0.83,
             "sources": [
                 {"title": "The Ubaid Period: An Overview", "author": "Joan Oates", "publication": "Paléorient",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1960}
             ]},
        ],
    },
    {
        "slug": "eridu-first-city-mesopotamia",
        "title": "Eridu — Traditionally the First City",
        "year": -5400, "lat": 30.82, "lng": 45.99,
        "geo_modern": "Tell Abu Shahrain, Dhi Qar, Iraq",
        "geo_era_label": "Ubaid Period Mesopotamia",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Eridu, founded ~5400 BCE, was considered the oldest city in Sumerian tradition. Its sequence of 18 superimposed temples demonstrates continuous ritual activity spanning 2,500 years. The site shows the evolution from simple shrine to monumental temple, reflecting increasing social complexity.",
             "summary": "The Sumerian 'first city,' with continuous temple construction spanning millennia.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Eridu", "author": "Fuad Safar, Muhammad Ali Mustafa & Seton Lloyd", "publication": "State Organization of Antiquities, Baghdad",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1981}
             ]},
        ],
    },
    {
        "slug": "mohenjo-daro-founding",
        "title": "Mohenjo-daro — Great City of the Indus Valley",
        "year": -2600, "lat": 27.33, "lng": 68.14,
        "geo_modern": "Larkana District, Sindh, Pakistan",
        "geo_era_label": "Mature Harappan Period",
        "category": "political", "importance_score": 0.85, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "pk", "viewpoint_type": "academic",
             "narrative": "Mohenjo-daro, built ~2600 BCE, was one of the largest cities of the ancient world with ~40,000 inhabitants. Its advanced urban planning featured grid streets, sophisticated drainage, public baths, and standardized bricks. The absence of monumental palaces or temples suggests a uniquely egalitarian urban civilization.",
             "summary": "A remarkably planned Bronze Age city with advanced sanitation and possible egalitarian governance.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Mohenjo-daro and the Indus Civilization", "author": "John Marshall", "publication": "Arthur Probsthain",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1931}
             ]},
        ],
    },
    {
        "slug": "memphis-egypt-founding",
        "title": "Founding of Memphis — Capital of Unified Egypt",
        "year": -3100, "lat": 29.85, "lng": 31.25,
        "geo_modern": "Mit Rahina, Giza, Egypt",
        "geo_era_label": "Early Dynastic Egypt",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "Memphis was founded ~3100 BCE as the capital of newly unified Egypt under Narmer/Menes. Strategically placed at the junction of Upper and Lower Egypt, it remained Egypt's administrative center for much of pharaonic history and one of the ancient world's largest cities.",
             "summary": "Capital of unified Egypt for over two millennia.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Memphis Under the Pharaohs", "author": "Jaromir Malek", "publication": "I.B. Tauris",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2003}
             ]},
        ],
    },
    {
        "slug": "troy-founding",
        "title": "Troy — Bronze Age City on the Dardanelles",
        "year": -3000, "lat": 39.96, "lng": 26.24,
        "geo_modern": "Hisarlik, Çanakkale, Turkey",
        "geo_era_label": "Early Bronze Age Anatolia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "Troy (Hisarlik) was a major Bronze Age city controlling the Dardanelles strait from ~3000 BCE. Nine successive cities were built on the site over 3,000 years. Troy VI/VIIa (~1300–1180 BCE) is the likely candidate for Homer's legendary city.",
             "summary": "A strategic Bronze Age city immortalized in Homeric epic.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Troy and the Trojans", "author": "Carl Blegen", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1963}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # WRITING & RECORD-KEEPING
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "proto-writing-vinca-symbols",
        "title": "Vinča Symbols — Possible Proto-Writing",
        "year": -5300, "lat": 44.76, "lng": 20.63,
        "geo_modern": "Vinča-Belo Brdo, Serbia",
        "geo_era_label": "Neolithic Balkans",
        "category": "discovery", "importance_score": 0.6, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "rs", "viewpoint_type": "academic",
             "narrative": "The Vinča symbols (~5300 BCE) found on pottery and figurines in southeastern Europe may represent an early form of proto-writing, predating Sumerian cuneiform by ~2,000 years. Whether these symbols constitute true writing remains debated, but they demonstrate early symbolic communication systems.",
             "summary": "Possibly the world's earliest proto-writing system, predating cuneiform.", "evidence_score": 0.60,
             "sources": [
                 {"title": "The Danube Script and Other Ancient Writing Systems", "author": "Harald Haarmann", "publication": "Cambridge Scholars Publishing",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2008}
             ]},
        ],
    },
    {
        "slug": "egyptian-hieroglyphics-earliest",
        "title": "Earliest Egyptian Hieroglyphics",
        "year": -3200, "lat": 25.75, "lng": 32.63,
        "geo_modern": "Abydos, Egypt",
        "geo_era_label": "Predynastic/Early Dynastic Egypt",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The earliest Egyptian hieroglyphs, found on ivory tags from Tomb U-j at Abydos (~3200 BCE), developed independently of or alongside Sumerian cuneiform. Hieroglyphic writing was used for over 3,500 years, becoming one of history's longest-lived writing systems.",
             "summary": "Egyptian hieroglyphs emerged ~3200 BCE and endured for over three millennia.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Dreaming of Alphabets: The Origins of Writing", "author": "Günter Dreyer", "publication": "International Journal of the History of Writing",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1998}
             ]},
        ],
    },
    {
        "slug": "indus-script-earliest",
        "title": "Indus Valley Script — Undeciphered Writing System",
        "year": -2600, "lat": 27.33, "lng": 68.14,
        "geo_modern": "Harappa / Mohenjo-daro, Pakistan",
        "geo_era_label": "Mature Harappan Period",
        "category": "discovery", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic perspective", "culture_code": "pk", "viewpoint_type": "academic",
             "narrative": "The Indus script, used ~2600–1900 BCE across the Harappan civilization, remains undeciphered. Found on thousands of seal stones, pottery, and tablets, it represents one of the great unsolved puzzles of ancient history. The short text lengths suggest it may be a logo-syllabic system.",
             "summary": "One of the world's oldest undeciphered scripts, used across the Indus civilization.", "evidence_score": 0.75,
             "sources": [
                 {"title": "The Indus Script: Text, Concordance and Tables", "author": "Asko Parpola", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1994}
             ]},
        ],
    },
    # ═══════════════════════════════════════════════════════════════════════
    # BRONZE AGE & EARLY STATES
    # ═══════════════════════════════════════════════════════════════════════
    {
        "slug": "akkadian-empire-sargon",
        "title": "Akkadian Empire — Sargon the Great",
        "year": -2334, "lat": 33.1, "lng": 44.1,
        "geo_modern": "Akkad (near modern Baghdad), Iraq",
        "geo_era_label": "Bronze Age Mesopotamia",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "Sargon of Akkad (~2334–2279 BCE) created the world's first empire, unifying Mesopotamia from the Persian Gulf to the Mediterranean. The Akkadian Empire established templates for imperial governance including standardized weights, a postal system, and a professional standing army.",
             "summary": "The world's first empire, unifying all of Mesopotamia.", "evidence_score": 0.82,
             "sources": [
                 {"title": "Sargon and his World", "author": "Marc Van De Mieroop", "publication": "Journal of the American Oriental Society",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "great-pyramid-giza",
        "title": "Construction of the Great Pyramid of Giza",
        "year": -2560, "lat": 29.98, "lng": 31.13,
        "geo_modern": "Giza, Egypt",
        "geo_era_label": "Old Kingdom Egypt",
        "category": "cultural", "importance_score": 0.95, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The Great Pyramid of Khufu (~2560 BCE) was the tallest structure on Earth for nearly 4,000 years. Built with ~2.3 million limestone blocks averaging 2.5 tons each, it represents the pinnacle of Old Kingdom engineering and organizational capacity, requiring tens of thousands of workers over ~20 years.",
             "summary": "The largest and most iconic of the ancient Egyptian pyramids.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Complete Pyramids", "author": "Mark Lehner", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1997}
             ]},
        ],
    },
    {
        "slug": "stonehenge-construction",
        "title": "Construction of Stonehenge",
        "year": -3000, "lat": 51.18, "lng": -1.83,
        "geo_modern": "Salisbury Plain, Wiltshire, England",
        "geo_era_label": "Neolithic Britain",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gb", "viewpoint_type": "academic",
             "narrative": "Stonehenge was constructed in phases from ~3000 to ~2000 BCE. The massive sarsen stones (~25 tons each) were transported 25 miles and the bluestones (~80 of them, ~4 tons each) were brought 150 miles from Wales. Its precise astronomical alignments suggest calendrical and ceremonial functions.",
             "summary": "Neolithic Britain's most iconic monument, with remarkable astronomical alignments.", "evidence_score": 0.85,
             "sources": [
                 {"title": "Stonehenge: Exploring the Greatest Stone Age Mystery", "author": "Mike Parker Pearson", "publication": "Simon & Schuster",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2012}
             ]},
        ],
    },
    {
        "slug": "minoan-civilization-crete",
        "title": "Rise of Minoan Civilization on Crete",
        "year": -2700, "lat": 35.30, "lng": 25.16,
        "geo_modern": "Knossos, Crete, Greece",
        "geo_era_label": "Early Bronze Age Aegean",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "The Minoan civilization emerged on Crete ~2700 BCE, becoming Europe's first advanced civilization. Known for elaborate palaces (Knossos), vivid frescoes, Linear A script, and maritime trade networks spanning the eastern Mediterranean. Minoan culture heavily influenced later Mycenaean and Greek civilizations.",
             "summary": "Europe's first advanced civilization, known for palatial architecture and maritime power.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Minoans", "author": "J. Lesley Fitton", "publication": "British Museum Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2002}
             ]},
        ],
    },
    {
        "slug": "bronze-age-collapse",
        "title": "Bronze Age Collapse — Late Bronze Age Systems Failure",
        "year": -1177, "lat": 34.73, "lng": 32.68,
        "geo_modern": "Eastern Mediterranean (multiple civilizations)",
        "geo_era_label": "Late Bronze Age",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Around 1177 BCE, the interconnected Bronze Age civilizations of the eastern Mediterranean collapsed in rapid succession. The Hittite Empire, Mycenaean Greece, the Kassite dynasty of Babylon, and Egypt's New Kingdom all declined dramatically. Causes include the Sea Peoples invasions, drought, earthquakes, and systemic fragility of interconnected economies.",
             "summary": "The catastrophic collapse of multiple interconnected Bronze Age civilizations.", "evidence_score": 0.80,
             "sources": [
                 {"title": "1177 B.C.: The Year Civilization Collapsed", "author": "Eric Cline", "publication": "Princeton University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "hammurabi-code-law",
        "title": "Code of Hammurabi — Earliest Complete Legal Code",
        "year": -1754, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Babylon, Iraq",
        "geo_era_label": "Old Babylonian Period",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Legal historical perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Code of Hammurabi (~1754 BCE), inscribed on a basalt stele, contains 282 laws covering property, commerce, family, and criminal matters. While not the earliest known laws (Ur-Nammu's code precedes it), it is the most complete surviving ancient legal code and reveals the social structure of Babylonian society.",
             "summary": "The most complete ancient legal code, foundational to legal history.", "evidence_score": 0.90,
             "sources": [
                 {"title": "The Laws of Hammurabi", "author": "M.E.J. Richardson", "publication": "Sheffield Academic Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "hittite-empire-rise",
        "title": "Rise of the Hittite Empire in Anatolia",
        "year": -1650, "lat": 40.02, "lng": 34.62,
        "geo_modern": "Hattusa (Boğazkale), Turkey",
        "geo_era_label": "Bronze Age Anatolia",
        "category": "political", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "tr", "viewpoint_type": "academic",
             "narrative": "The Hittites established a major Bronze Age empire from their capital Hattusa ~1650 BCE. They were the first to master iron smelting on a significant scale, employed advanced chariot warfare, and created one of the earliest known international peace treaties (with Egypt at Kadesh, 1259 BCE).",
             "summary": "A major Bronze Age power, pioneers of iron technology and diplomatic treaties.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Hittites and Their World", "author": "Billie Jean Collins", "publication": "Society of Biblical Literature",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 2007}
             ]},
        ],
    },
    {
        "slug": "shang-dynasty-china",
        "title": "Shang Dynasty — First Historical Chinese Dynasty",
        "year": -1600, "lat": 36.12, "lng": 114.35,
        "geo_modern": "Anyang, Henan, China",
        "geo_era_label": "Bronze Age China",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "The Shang dynasty (~1600–1046 BCE) is the earliest Chinese dynasty confirmed by archaeology. Its capital at Anyang featured monumental architecture, bronze casting of extraordinary sophistication, oracle bone divination (the earliest Chinese writing), and elaborate royal tombs with human sacrifice.",
             "summary": "The first archaeologically verified Chinese dynasty, known for oracle bones and bronzes.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Cambridge History of Ancient China", "author": "Michael Loewe & Edward Shaughnessy", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1999}
             ]},
        ],
    },
    {
        "slug": "olmec-civilization-rise",
        "title": "Rise of the Olmec Civilization — Mesoamerica's Mother Culture",
        "year": -1500, "lat": 17.87, "lng": -95.05,
        "geo_modern": "San Lorenzo, Veracruz, Mexico",
        "geo_era_label": "Preclassic Mesoamerica",
        "category": "political", "importance_score": 0.8, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "mx", "viewpoint_type": "academic",
             "narrative": "The Olmec civilization (~1500–400 BCE), centered in the Gulf Coast lowlands of Mexico, is often called the 'mother culture' of Mesoamerica. They created colossal stone heads, developed early forms of writing and the Mesoamerican calendar, practiced the ballgame, and established trade networks across a vast region.",
             "summary": "Mesoamerica's earliest complex civilization, originating key cultural traditions.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Olmec World: Ritual and Rulership", "author": "Michael Coe et al.", "publication": "Princeton University Art Museum",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "phoenician-alphabet-invention",
        "title": "Phoenician Alphabet — Foundation of Most Modern Scripts",
        "year": -1050, "lat": 34.12, "lng": 35.65,
        "geo_modern": "Byblos, Lebanon",
        "geo_era_label": "Iron Age Levant",
        "category": "discovery", "importance_score": 0.9, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic perspective", "culture_code": "lb", "viewpoint_type": "academic",
             "narrative": "The Phoenician alphabet (~1050 BCE), derived from Proto-Sinaitic script, was the first widely used phonetic alphabet with ~22 consonant letters. Its revolutionary simplicity — replacing hundreds of cuneiform or hieroglyphic signs — democratized literacy. It is the ancestor of Greek, Latin, Arabic, Hebrew, and most modern alphabets.",
             "summary": "The ancestor of virtually all modern alphabets, revolutionizing literacy.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Alphabet: A Key to the History of Mankind", "author": "David Diringer", "publication": "Philosophical Library",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1948}
             ]},
        ],
    },
    {
        "slug": "iron-age-begins-near-east",
        "title": "Iron Age Begins — Widespread Iron Smelting",
        "year": -1200, "lat": 39.0, "lng": 36.0,
        "geo_modern": "Anatolia / Near East",
        "geo_era_label": "Early Iron Age",
        "category": "discovery", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Iron smelting technology spread across the Near East ~1200 BCE, coinciding with the Bronze Age Collapse. Iron was more abundant than tin-bronze and once properly carburized (into steel), produced superior tools and weapons. This democratized access to metal technology, transforming agriculture, warfare, and social structures.",
             "summary": "The transition to iron transformed technology, warfare, and society.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Coming of the Age of Iron", "author": "Theodore Wertime & James Muhly", "publication": "Yale University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1980}
             ]},
        ],
    },
    {
        "slug": "vedas-composition-india",
        "title": "Composition of the Rigveda — Oldest Indian Scripture",
        "year": -1500, "lat": 30.0, "lng": 71.0,
        "geo_modern": "Punjab Region, Pakistan/India",
        "geo_era_label": "Vedic Period India",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Indological perspective", "culture_code": "in", "viewpoint_type": "academic",
             "narrative": "The Rigveda, composed ~1500–1200 BCE in the Punjab region, is the oldest of the Hindu scriptures and one of the oldest religious texts in any Indo-European language. Its 1,028 hymns to the gods preserve rituals, mythology, and social structure of the early Vedic period, forming the foundation of Hindu philosophy and Indian civilization.",
             "summary": "The oldest Hindu scripture, foundational to Indian civilization.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Rigveda: The Earliest Religious Poetry of India", "author": "Stephanie Jamison & Joel Brereton", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "earliest-chinese-writing-oracle-bones",
        "title": "Earliest Chinese Writing — Oracle Bone Script",
        "year": -1250, "lat": 36.12, "lng": 114.35,
        "geo_modern": "Anyang, Henan, China",
        "geo_era_label": "Late Shang Dynasty",
        "category": "discovery", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Epigraphic perspective", "culture_code": "cn", "viewpoint_type": "academic",
             "narrative": "Oracle bone inscriptions from the late Shang dynasty (~1250 BCE) are the earliest known Chinese writing. Diviners carved questions on turtle shells and ox bones, which were heated until they cracked — the cracks were interpreted as answers from ancestors. Over 150,000 oracle bone fragments have been found, revealing Shang politics, religion, and daily life.",
             "summary": "The earliest Chinese writing, used for royal divination.", "evidence_score": 0.90,
             "sources": [
                 {"title": "Sources of Shang History: The Oracle-Bone Inscriptions of Bronze Age China", "author": "David Keightley", "publication": "University of California Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1978}
             ]},
        ],
    },
    {
        "slug": "epic-of-gilgamesh-composition",
        "title": "Epic of Gilgamesh — Oldest Known Literature",
        "year": -2100, "lat": 31.32, "lng": 45.64,
        "geo_modern": "Uruk (Warka), Iraq",
        "geo_era_label": "Third Dynasty of Ur",
        "category": "cultural", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Literary perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Epic of Gilgamesh, first composed in Sumerian ~2100 BCE and later expanded in Akkadian, is the world's oldest known work of literature. It tells of King Gilgamesh's quest for immortality and includes a flood narrative predating the Biblical account. The epic explores universal themes of friendship, mortality, and the meaning of civilization.",
             "summary": "The world's oldest literary masterpiece, exploring mortality and friendship.", "evidence_score": 0.88,
             "sources": [
                 {"title": "Gilgamesh: A New English Version", "author": "Stephen Mitchell", "publication": "Free Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 2004}
             ]},
        ],
    },
    {
        "slug": "mycenaean-civilization-rise",
        "title": "Rise of Mycenaean Civilization in Greece",
        "year": -1600, "lat": 37.73, "lng": 22.76,
        "geo_modern": "Mycenae, Argolid, Greece",
        "geo_era_label": "Late Bronze Age Greece",
        "category": "political", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Archaeological perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "Mycenaean civilization (~1600–1100 BCE) was the first major civilization on the Greek mainland. Known for massive cyclopean walls, tholos tombs, Linear B script, and the warrior culture later remembered in Homer's Iliad. Mycenaean Greeks controlled a trade network spanning the eastern Mediterranean.",
             "summary": "The first Greek civilization, remembered in Homeric legend.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Mycenaean World", "author": "John Chadwick", "publication": "Cambridge University Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1976}
             ]},
        ],
    },
    {
        "slug": "new-kingdom-egypt-peak",
        "title": "New Kingdom Egypt — Egypt's Imperial Golden Age",
        "year": -1550, "lat": 25.74, "lng": 32.60,
        "geo_modern": "Thebes (Luxor), Egypt",
        "geo_era_label": "New Kingdom Egypt",
        "category": "political", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Egyptological perspective", "culture_code": "eg", "viewpoint_type": "academic",
             "narrative": "The New Kingdom (~1550–1077 BCE) was Egypt's imperial age, when pharaohs like Hatshepsut, Thutmose III, Akhenaten, and Ramesses II expanded Egypt's borders from Nubia to Syria. This era produced the Valley of the Kings, Abu Simbel, and the Amarna religious revolution — Egypt's most iconic monuments and historical episodes.",
             "summary": "Egypt's golden age of empire, monumental construction, and cultural flowering.", "evidence_score": 0.88,
             "sources": [
                 {"title": "The Oxford History of Ancient Egypt", "author": "Ian Shaw", "publication": "Oxford University Press",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "bantu-expansion-begins",
        "title": "Bantu Expansion Begins — Great Migration Across Africa",
        "year": -3000, "lat": 6.0, "lng": 10.0,
        "geo_modern": "Cameroon / Nigeria Border Region",
        "geo_era_label": "Neolithic West Africa",
        "category": "cultural", "importance_score": 0.8, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Linguistic/archaeological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "Beginning ~3000 BCE, Bantu-speaking peoples expanded from their homeland in West/Central Africa across most of sub-Saharan Africa over the next 3,000 years. Carrying iron-working technology, agriculture, and related languages, the Bantu expansion shaped the linguistic and cultural landscape of modern Africa.",
             "summary": "One of the largest and most consequential human migrations in history.", "evidence_score": 0.78,
             "sources": [
                 {"title": "The Bantu Problem and African Archaeology", "author": "Jan Vansina", "publication": "The Journal of African History",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1995}
             ]},
        ],
    },
    {
        "slug": "sumerian-city-states-peak",
        "title": "Sumerian City-States — Peak of Early Urban Civilization",
        "year": -2800, "lat": 31.32, "lng": 45.64,
        "geo_modern": "Uruk / Ur / Lagash, Southern Iraq",
        "geo_era_label": "Early Dynastic Sumer",
        "category": "political", "importance_score": 0.85, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "By ~2800 BCE, Sumerian city-states like Uruk, Ur, Lagash, and Eridu had populations of 40,000–80,000. They featured monumental ziggurats, sophisticated irrigation, schools, courts, and the world's first bureaucracy using cuneiform records. Competition between city-states drove military innovation and diplomacy.",
             "summary": "The world's first urban civilization, with sophisticated governance and culture.", "evidence_score": 0.85,
             "sources": [
                 {"title": "The Sumerians: Their History, Culture, and Character", "author": "Samuel Noah Kramer", "publication": "University of Chicago Press",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1963}
             ]},
        ],
    },
    {
        "slug": "earliest-known-map-babylonian",
        "title": "Earliest Known World Map — Babylonian Imago Mundi",
        "year": -600, "lat": 32.54, "lng": 44.42,
        "geo_modern": "Sippar, Iraq",
        "geo_era_label": "Neo-Babylonian Period",
        "category": "discovery", "importance_score": 0.6, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "iq", "viewpoint_type": "academic",
             "narrative": "The Babylonian Map of the World (~600 BCE) is the earliest known attempt to map the entire world. It shows Babylon at the center, surrounded by a circular ocean with triangular regions beyond. This reflects Babylonian cosmology and early geographical knowledge.",
             "summary": "The earliest surviving world map, reflecting Babylonian cosmological views.", "evidence_score": 0.80,
             "sources": [
                 {"title": "The Babylonian Map of the World", "author": "Wayne Horowitz", "publication": "Iraq",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 1988}
             ]},
        ],
    },
    {
        "slug": "younger-dryas-climate-event",
        "title": "Younger Dryas — Sudden Return to Ice Age Conditions",
        "year": -10800, "lat": 72.0, "lng": -38.0,
        "geo_modern": "Greenland / Northern Hemisphere (global event)",
        "geo_era_label": "Late Pleistocene",
        "category": "natural", "importance_score": 0.75, "zoom_min": 1, "is_bce": True,
        "perspectives": [
            {"label": "Climatological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Younger Dryas (~10,800–9,700 BCE) was an abrupt return to near-glacial conditions lasting ~1,100 years, interrupting post-Ice Age warming. Temperatures dropped 2–6°C in decades. This cold snap may have pressured Near Eastern populations toward agriculture as wild food sources declined, contributing to the origins of farming.",
             "summary": "A sudden cold snap that may have catalyzed the agricultural revolution.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Younger Dryas cold event — was it synchronous around the North Atlantic", "author": "W. Broecker", "publication": "Nuclear Instruments and Methods in Physics Research",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "sahara-desertification",
        "title": "Desertification of the Sahara",
        "year": -3500, "lat": 23.0, "lng": 13.0,
        "geo_modern": "Sahara Desert, North Africa",
        "geo_era_label": "Late Holocene North Africa",
        "category": "natural", "importance_score": 0.75, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Climatological perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "From ~5500 BCE the 'Green Sahara' began drying, accelerating ~3500 BCE into full desert. This forced pastoral and agricultural populations into the Nile Valley, possibly catalyzing the rise of Egyptian civilization. The same climate shift affected populations across North and West Africa, triggering migrations and cultural changes.",
             "summary": "The drying of the Sahara displaced populations and may have spurred Egyptian civilization.", "evidence_score": 0.80,
             "sources": [
                 {"title": "Abrupt onset and termination of the African Humid Period", "author": "Peter deMenocal et al.", "publication": "Quaternary Science Reviews",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2000}
             ]},
        ],
    },
    {
        "slug": "thera-eruption-minoan",
        "title": "Thera (Santorini) Volcanic Eruption",
        "year": -1628, "lat": 36.40, "lng": 25.40,
        "geo_modern": "Santorini, Greece",
        "geo_era_label": "Late Bronze Age Aegean",
        "category": "natural", "importance_score": 0.75, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Volcanological perspective", "culture_code": "gr", "viewpoint_type": "academic",
             "narrative": "The Thera eruption (~1628 BCE) was one of the largest volcanic events in recorded history, destroying the Minoan settlement of Akrotiri and generating tsunamis that devastated Crete. The eruption may have contributed to the decline of Minoan civilization and possibly inspired the Atlantis legend.",
             "summary": "A catastrophic eruption that may have hastened the end of Minoan civilization.", "evidence_score": 0.80,
             "sources": [
                 {"title": "A test of time and A test of time revisited", "author": "Sturt Manning", "publication": "Oxbow Books",
                  "source_type": "secondary", "reliability_tier": 1, "peer_reviewed": True, "year": 2014}
             ]},
        ],
    },
    {
        "slug": "battle-kadesh-egypt-hittites",
        "title": "Battle of Kadesh — Egypt vs. Hittites",
        "year": -1274, "lat": 34.56, "lng": 36.52,
        "geo_modern": "Tell Nebi Mend, Homs, Syria",
        "geo_era_label": "Late Bronze Age Levant",
        "category": "war", "importance_score": 0.7, "zoom_min": 3, "is_bce": True,
        "perspectives": [
            {"label": "Military historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Battle of Kadesh (1274 BCE) between Ramesses II and the Hittite king Muwatalli II was the largest chariot battle in history (~5,000–6,000 chariots). The resulting stalemate led to the world's first known international peace treaty (1259 BCE), establishing borders and mutual defense obligations.",
             "summary": "The largest chariot battle in history, leading to the first known peace treaty.", "evidence_score": 0.82,
             "sources": [
                 {"title": "The Battle of Kadesh", "author": "Antonio Santosuosso", "publication": "University of Western Ontario",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": True, "year": 1996}
             ]},
        ],
    },
    {
        "slug": "sea-peoples-invasions",
        "title": "Sea Peoples Invasions of the Eastern Mediterranean",
        "year": -1200, "lat": 31.5, "lng": 34.5,
        "geo_modern": "Eastern Mediterranean Coast",
        "geo_era_label": "Late Bronze Age",
        "category": "war", "importance_score": 0.7, "zoom_min": 2, "is_bce": True,
        "perspectives": [
            {"label": "Historical perspective", "culture_code": "global", "viewpoint_type": "academic",
             "narrative": "The Sea Peoples — a confederation of naval raiders of uncertain origin — attacked Egypt, the Hittite Empire, and Levantine cities ~1200–1150 BCE. Ramesses III's inscriptions at Medinet Habu record battles against these invaders. Their attacks contributed to the Bronze Age Collapse, though their exact identity and origins remain debated.",
             "summary": "Mysterious naval raiders whose attacks contributed to the Bronze Age Collapse.", "evidence_score": 0.70,
             "sources": [
                 {"title": "The Sea Peoples: Warriors of the Ancient Mediterranean", "author": "N.K. Sandars", "publication": "Thames & Hudson",
                  "source_type": "secondary", "reliability_tier": 2, "peer_reviewed": False, "year": 1985}
             ]},
        ],
    },
]

# ═══════════════════════════════════════════════════════════════════════════
# CAUSALITY LINKS (prehistoric chain)
# ═══════════════════════════════════════════════════════════════════════════
CAUSALITY_LINKS: list[dict[str, Any]] = [
    # Human origins chain
    {"cause": "homo-sapiens-emergence-africa", "effect": "control-of-fire-early-humans", "type": "contributing", "strength": 0.6, "desc": "Early Homo sapiens inherited and refined fire use from earlier hominins"},
    {"cause": "homo-sapiens-emergence-africa", "effect": "homo-sapiens-migration-out-of-africa", "type": "direct", "strength": 0.9, "desc": "Homo sapiens emerged in Africa before migrating out"},
    {"cause": "control-of-fire-early-humans", "effect": "cognitive-revolution-symbolic-thought", "type": "contributing", "strength": 0.6, "desc": "Fire enabled cooking (brain growth) and social gathering (language development)"},
    {"cause": "homo-sapiens-migration-out-of-africa", "effect": "aboriginal-australia-arrival", "type": "direct", "strength": 0.9, "desc": "Out of Africa migration eventually led to settlement of Australia"},
    {"cause": "homo-sapiens-migration-out-of-africa", "effect": "migration-into-europe", "type": "direct", "strength": 0.9, "desc": "Out of Africa migration led to colonization of Europe"},
    {"cause": "homo-sapiens-migration-out-of-africa", "effect": "migration-east-asia-settlement", "type": "direct", "strength": 0.9, "desc": "Out of Africa migration led to settlement of East Asia"},
    {"cause": "homo-sapiens-migration-out-of-africa", "effect": "first-human-settlement-americas-beringia", "type": "direct", "strength": 0.8, "desc": "Out of Africa migration eventually led to the Americas via Beringia"},
    {"cause": "migration-into-europe", "effect": "neanderthal-homo-sapiens-coexistence", "type": "direct", "strength": 0.9, "desc": "Arrival in Europe brought contact with resident Neanderthals"},

    # Cognitive revolution chain
    {"cause": "cognitive-revolution-symbolic-thought", "effect": "earliest-burial-practices", "type": "direct", "strength": 0.8, "desc": "Symbolic thought enabled ritual burial and concepts of afterlife"},
    {"cause": "cognitive-revolution-symbolic-thought", "effect": "chauvet-cave-paintings", "type": "direct", "strength": 0.8, "desc": "Symbolic thought enabled sophisticated artistic expression"},
    {"cause": "cognitive-revolution-symbolic-thought", "effect": "venus-figurines-upper-paleolithic", "type": "direct", "strength": 0.8, "desc": "Symbolic thought enabled figurative art traditions"},
    {"cause": "cognitive-revolution-symbolic-thought", "effect": "earliest-musical-instruments", "type": "direct", "strength": 0.7, "desc": "Symbolic/creative thought led to musical instrument creation"},
    {"cause": "cognitive-revolution-symbolic-thought", "effect": "cave-paintings-lascaux", "type": "direct", "strength": 0.8, "desc": "Symbolic thought enabled the artistic mastery seen at Lascaux"},

    # Climate → agriculture chain
    {"cause": "last-glacial-maximum", "effect": "younger-dryas-climate-event", "type": "contributing", "strength": 0.6, "desc": "Post-glacial warming was interrupted by the Younger Dryas cold snap"},
    {"cause": "younger-dryas-climate-event", "effect": "agricultural-revolution-fertile-crescent", "type": "contributing", "strength": 0.7, "desc": "Climate stress during Younger Dryas may have pressured populations toward farming"},
    {"cause": "younger-dryas-climate-event", "effect": "natufian-culture-earliest-sedentary-settlements", "type": "contributing", "strength": 0.6, "desc": "Climate change shaped Natufian subsistence strategies"},

    # Agricultural revolution → domestication chain
    {"cause": "agricultural-revolution-fertile-crescent", "effect": "wheat-barley-domestication", "type": "direct", "strength": 0.9, "desc": "The Fertile Crescent agricultural revolution centered on wheat and barley domestication"},
    {"cause": "agricultural-revolution-fertile-crescent", "effect": "domestication-of-sheep-goats", "type": "direct", "strength": 0.8, "desc": "Agricultural settlement enabled animal domestication"},
    {"cause": "agricultural-revolution-fertile-crescent", "effect": "domestication-of-pigs", "type": "contributing", "strength": 0.7, "desc": "Settled agricultural life facilitated pig domestication"},
    {"cause": "rice-domestication-yangtze-river", "effect": "millet-domestication-china", "type": "indirect", "strength": 0.5, "desc": "Chinese agricultural traditions spread between rice and millet regions"},

    # Agriculture → cities chain
    {"cause": "wheat-barley-domestication", "effect": "ain-ghazal-neolithic-settlement", "type": "direct", "strength": 0.8, "desc": "Grain agriculture enabled large settled populations"},
    {"cause": "wheat-barley-domestication", "effect": "jericho-earliest-walled-city", "type": "contributing", "strength": 0.7, "desc": "Agricultural surplus supported the earliest walled cities"},
    {"cause": "agricultural-revolution-fertile-crescent", "effect": "earliest-irrigation-mesopotamia", "type": "direct", "strength": 0.9, "desc": "Agriculture drove development of irrigation technology"},
    {"cause": "earliest-irrigation-mesopotamia", "effect": "ubaid-period-early-mesopotamia", "type": "direct", "strength": 0.8, "desc": "Irrigation enabled settlement of arid southern Mesopotamia"},
    {"cause": "ubaid-period-early-mesopotamia", "effect": "eridu-first-city-mesopotamia", "type": "direct", "strength": 0.9, "desc": "Ubaid settlements evolved into the first cities"},
    {"cause": "ubaid-period-early-mesopotamia", "effect": "uruk-period-city-civilization", "type": "direct", "strength": 0.9, "desc": "Ubaid period directly preceded and enabled the Uruk urban explosion"},

    # Cities → writing → states chain
    {"cause": "uruk-period-city-civilization", "effect": "sumerians-writing-uruk-3200bce", "type": "direct", "strength": 0.9, "desc": "Urban administration in Uruk necessitated the invention of writing"},
    {"cause": "sumerians-writing-uruk-3200bce", "effect": "sumerian-city-states-peak", "type": "direct", "strength": 0.8, "desc": "Writing enabled more complex governance of city-states"},
    {"cause": "sumerian-city-states-peak", "effect": "akkadian-empire-sargon", "type": "direct", "strength": 0.9, "desc": "Sargon unified the competing Sumerian city-states into an empire"},
    {"cause": "sumerian-city-states-peak", "effect": "epic-of-gilgamesh-composition", "type": "direct", "strength": 0.7, "desc": "Sumerian literary tradition produced the Gilgamesh epic"},
    {"cause": "akkadian-empire-sargon", "effect": "hammurabi-code-law", "type": "indirect", "strength": 0.6, "desc": "The Akkadian imperial tradition influenced later Babylonian governance"},

    # Egypt chain
    {"cause": "sahara-desertification", "effect": "narmer-unifies-egypt-3100bce", "type": "contributing", "strength": 0.7, "desc": "Saharan desertification drove populations to the Nile, catalyzing Egyptian state formation"},
    {"cause": "narmer-unifies-egypt-3100bce", "effect": "memphis-egypt-founding", "type": "direct", "strength": 0.9, "desc": "Memphis was founded as capital of the newly unified Egyptian state"},
    {"cause": "narmer-unifies-egypt-3100bce", "effect": "egyptian-hieroglyphics-earliest", "type": "contributing", "strength": 0.7, "desc": "State formation accelerated the development of hieroglyphic writing"},
    {"cause": "memphis-egypt-founding", "effect": "great-pyramid-giza", "type": "direct", "strength": 0.8, "desc": "Old Kingdom state power enabled monumental pyramid construction"},
    {"cause": "great-pyramid-giza", "effect": "new-kingdom-egypt-peak", "type": "indirect", "strength": 0.5, "desc": "Old Kingdom traditions shaped New Kingdom imperial ambitions"},

    # Bronze Age chain
    {"cause": "bronze-age-begins-near-east", "effect": "minoan-civilization-crete", "type": "contributing", "strength": 0.7, "desc": "Bronze technology enabled Minoan civilization's rise"},
    {"cause": "bronze-age-begins-near-east", "effect": "mycenaean-civilization-rise", "type": "contributing", "strength": 0.7, "desc": "Bronze technology underpinned Mycenaean military and trade power"},
    {"cause": "bronze-age-begins-near-east", "effect": "hittite-empire-rise", "type": "contributing", "strength": 0.7, "desc": "Bronze (and later iron) technology supported Hittite imperial power"},
    {"cause": "minoan-civilization-crete", "effect": "mycenaean-civilization-rise", "type": "direct", "strength": 0.7, "desc": "Minoan culture heavily influenced the development of Mycenaean civilization"},
    {"cause": "thera-eruption-minoan", "effect": "bronze-age-collapse", "type": "contributing", "strength": 0.5, "desc": "Thera eruption weakened Minoan civilization, contributing to broader instability"},
    {"cause": "hittite-empire-rise", "effect": "battle-kadesh-egypt-hittites", "type": "direct", "strength": 0.8, "desc": "Hittite expansion brought conflict with Egyptian imperialism"},
    {"cause": "new-kingdom-egypt-peak", "effect": "battle-kadesh-egypt-hittites", "type": "direct", "strength": 0.8, "desc": "Egyptian imperial expansion brought conflict with the Hittites"},
    {"cause": "sea-peoples-invasions", "effect": "bronze-age-collapse", "type": "direct", "strength": 0.8, "desc": "Sea Peoples attacks were a major factor in the Bronze Age Collapse"},
    {"cause": "bronze-age-collapse", "effect": "iron-age-begins-near-east", "type": "direct", "strength": 0.8, "desc": "Bronze Age Collapse disrupted tin trade, accelerating the shift to iron"},
    {"cause": "iron-age-begins-near-east", "effect": "phoenician-alphabet-invention", "type": "contributing", "strength": 0.5, "desc": "Iron Age recovery enabled Phoenician city-state revival and cultural innovation"},

    # Independent civilizations
    {"cause": "maize-domestication-mesoamerica", "effect": "olmec-civilization-rise", "type": "direct", "strength": 0.8, "desc": "Maize agriculture sustained Olmec population centers"},
    {"cause": "squash-domestication-mesoamerica", "effect": "maize-domestication-mesoamerica", "type": "contributing", "strength": 0.5, "desc": "Earlier squash cultivation was part of the Mesoamerican agricultural tradition"},
    {"cause": "indus-valley-civilization-founding", "effect": "mohenjo-daro-founding", "type": "direct", "strength": 0.9, "desc": "Mohenjo-daro was a major city of the Indus Valley civilization"},
    {"cause": "indus-valley-civilization-founding", "effect": "indus-script-earliest", "type": "direct", "strength": 0.8, "desc": "The Indus script developed within the Harappan civilization"},
    {"cause": "shang-dynasty-china", "effect": "earliest-chinese-writing-oracle-bones", "type": "direct", "strength": 0.9, "desc": "Oracle bone script developed in the Shang royal court for divination"},
    {"cause": "bantu-expansion-begins", "effect": "iron-age-begins-near-east", "type": "indirect", "strength": 0.4, "desc": "Bantu expansion carried iron-working technology across Africa"},
]


async def seed(conn: asyncpg.Connection) -> None:
    print(f"Starting prehistoric enrichment seed — {len(EVENTS)} events")

    slug_to_id: dict[str, str] = {}

    # Pre-load existing slugs
    rows = await conn.fetch("SELECT slug, id FROM events")
    for r in rows:
        slug_to_id[r["slug"]] = str(r["id"])

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
            slug_to_id[slug] = str(existing)
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
            VALUES ('event', $1, 'create', $2, 'ai', 'Prehistoric enrichment seed')
            """,
            event_id, CREATED_BY,
        )

        print(f"  [ok] {slug}")

    # Insert causality links
    print(f"\nInserting {len(CAUSALITY_LINKS)} causality links...")
    links_inserted = 0
    links_skipped = 0

    for link in CAUSALITY_LINKS:
        cause_id = slug_to_id.get(link["cause"])
        effect_id = slug_to_id.get(link["effect"])

        if not cause_id or not effect_id:
            if not cause_id:
                print(f"  [not found] cause: {link['cause']}")
            if not effect_id:
                print(f"  [not found] effect: {link['effect']}")
            links_skipped += 1
            continue

        try:
            await conn.execute(
                """
                INSERT INTO causality_links (cause_event_id, effect_event_id, link_type,
                                           strength, description, created_by, review_status)
                VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
                """,
                cause_id, effect_id, link["type"], link["strength"], link["desc"], CREATED_BY,
            )
            links_inserted += 1
        except Exception as e:
            print(f"  [error] {link['cause']} -> {link['effect']}: {e}")
            links_skipped += 1

    total = await conn.fetchval("SELECT COUNT(*) FROM events WHERE review_status='approved'")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n✅ Prehistoric enrichment complete — {links_inserted} links inserted, {links_skipped} skipped")
    print(f"   Total approved events: {total}, total causality links: {total_links}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
