#!/usr/bin/env python3
"""
seed_prehistoric2.py — Add ~80 curated prehistoric events (year_approx < -3000)
covering hominin milestones, Ice Age, migrations, Neolithic Revolution,
early settlements, and Copper/Bronze Age transitions.

Uses inlined date literals for BCE dates (asyncpg cannot bind BC date params).

Run:
    python backend/scripts/seed_prehistoric2.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import uuid

import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
CREATED_BY = "seed-script:prehistoric2-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, geo_era_label, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # HOMININ MILESTONES (deep time)
    # ═══════════════════════════════════════════════════════════════════════
    ("Homo habilis — Earliest Stone Tool Use", -2500000, "discovery",
     "Olduvai Gorge, Tanzania", "Early Pleistocene East Africa",
     -2.99, 35.35, 0.95, "homo-habilis-tool-use-2500000"),

    ("Homo erectus Emerges in East Africa", -1900000, "discovery",
     "Turkana, Kenya", "Early Pleistocene East Africa",
     3.95, 36.12, 0.85, "homo-erectus-emerges-1900000"),

    ("Homo erectus Controls Fire", -1000000, "discovery",
     "Wonderwerk Cave, South Africa", "Middle Pleistocene Africa",
     -28.24, 24.43, 0.90, "homo-erectus-fire-1000000"),

    ("Homo erectus Migrates to East Asia", -800000, "discovery",
     "Zhoukoudian, China", "Middle Pleistocene East Asia",
     39.73, 115.92, 0.70, "homo-erectus-east-asia-800000"),

    ("Homo heidelbergensis — Archaic Humans in Europe", -600000, "discovery",
     "Heidelberg, Germany", "Middle Pleistocene Europe",
     49.40, 8.69, 0.65, "homo-heidelbergensis-600000"),

    ("Earliest Evidence of Hunting with Wooden Spears", -400000, "discovery",
     "Schöningen, Germany", "Middle Pleistocene Europe",
     52.13, 10.97, 0.60, "schoningen-spears-400000"),

    ("Anatomically Modern Humans Appear", -300000, "discovery",
     "Jebel Irhoud, Morocco", "Middle Pleistocene North Africa",
     31.85, -8.87, 0.95, "anatomically-modern-humans-300000"),

    ("Neanderthals Dominate Europe and Western Asia", -250000, "discovery",
     "Neander Valley, Germany", "Middle Pleistocene Europe",
     51.23, 6.95, 0.75, "neanderthals-dominate-europe-250000"),

    ("Behavioral Modernity — Symbolic Thought Emerges", -70000, "cultural",
     "Blombos Cave, South Africa", "Late Pleistocene Southern Africa",
     -34.41, 21.22, 0.85, "behavioral-modernity-70000"),

    # ═══════════════════════════════════════════════════════════════════════
    # OUT OF AFRICA MIGRATIONS
    # ═══════════════════════════════════════════════════════════════════════
    ("Coastal Migration Route to Southeast Asia", -70000, "discovery",
     "Arabian Peninsula", "Late Pleistocene Arabia",
     20.0, 50.0, 0.70, "coastal-migration-se-asia-70000"),

    ("Migration to Papua New Guinea and Sahul", -60000, "discovery",
     "Papua New Guinea", "Late Pleistocene Sahul",
     -6.0, 147.0, 0.65, "migration-sahul-60000"),

    ("Early Settlement of Central Asia", -45000, "discovery",
     "Central Asia", "Upper Paleolithic Central Asia",
     42.0, 65.0, 0.55, "settlement-central-asia-45000"),

    ("Earliest Human Presence in Japan", -35000, "discovery",
     "Honshu, Japan", "Upper Paleolithic Japan",
     35.0, 136.0, 0.50, "earliest-humans-japan-35000"),

    ("Crossing Beringia — First Americans", -15000, "discovery",
     "Bering Land Bridge, Alaska", "Late Pleistocene Beringia",
     65.0, -169.0, 0.85, "beringia-crossing-15000"),

    ("Clovis Culture — Americas Settlement", -13000, "discovery",
     "Clovis, New Mexico, USA", "Late Pleistocene North America",
     34.40, -103.20, 0.75, "clovis-culture-americas-13000"),

    ("Monte Verde Settlement — South America Reached", -14500, "discovery",
     "Monte Verde, Chile", "Late Pleistocene South America",
     -41.50, -72.50, 0.70, "monte-verde-settlement-14500"),

    # ═══════════════════════════════════════════════════════════════════════
    # ICE AGE & CLIMATE
    # ═══════════════════════════════════════════════════════════════════════
    ("Toba Supervolcano Eruption — Near-Extinction Event", -74000, "natural",
     "Sumatra, Indonesia", "Late Pleistocene Southeast Asia",
     2.68, 98.83, 0.80, "toba-supervolcano-74000"),

    ("Younger Dryas Cooling — Return to Ice Age Conditions", -12900, "natural",
     "Northern Hemisphere", "Late Pleistocene",
     55.0, -10.0, 0.75, "younger-dryas-cooling-12900"),

    ("End of the Ice Age — Holocene Begins", -11700, "natural",
     "Northern Hemisphere", "Pleistocene-Holocene Transition",
     55.0, 0.0, 0.80, "holocene-begins-11700"),

    ("Sea Level Rise Separates Britain from Europe", -8000, "natural",
     "Doggerland, North Sea", "Early Holocene Europe",
     54.0, 3.0, 0.55, "doggerland-submerged-8000"),

    ("Black Sea Flood Event", -5600, "natural",
     "Black Sea", "Neolithic Black Sea Region",
     43.0, 34.0, 0.50, "black-sea-flood-5600"),

    # ═══════════════════════════════════════════════════════════════════════
    # NEOLITHIC REVOLUTION — AGRICULTURE
    # ═══════════════════════════════════════════════════════════════════════
    ("First Cultivation of Einkorn Wheat", -9500, "discovery",
     "Karacadağ, Turkey", "Neolithic Fertile Crescent",
     37.70, 39.80, 0.85, "einkorn-wheat-cultivation-9500"),

    ("Domestication of Lentils and Flax", -8500, "discovery",
     "Fertile Crescent", "Neolithic Near East",
     35.0, 38.0, 0.55, "lentils-flax-domestication-8500"),

    ("Domestication of Emmer Wheat and Barley", -8000, "discovery",
     "Jordan Valley", "Neolithic Levant",
     32.0, 35.5, 0.75, "emmer-barley-domestication-8000"),

    ("Goat Domestication in the Zagros", -8000, "discovery",
     "Zagros Mountains, Iran", "Neolithic Zagros",
     34.0, 48.0, 0.70, "goat-domestication-zagros-8000"),

    ("Cattle Domestication — Aurochs Tamed", -8000, "discovery",
     "Anatolia, Turkey", "Neolithic Anatolia",
     38.5, 34.0, 0.70, "cattle-domestication-aurochs-8000"),

    ("Pig Domestication in Anatolia and China", -7000, "discovery",
     "Anatolia/China", "Neolithic",
     37.0, 35.0, 0.60, "pig-domestication-7000"),

    ("Sorghum Domestication in Saharan Africa", -7000, "discovery",
     "Sahel, Sudan", "Neolithic Saharan Africa",
     13.0, 30.0, 0.50, "sorghum-domestication-sahara-7000"),

    ("Banana Cultivation Begins in Papua New Guinea", -5000, "discovery",
     "Kuk Swamp, Papua New Guinea", "Neolithic Melanesia",
     -5.83, 144.33, 0.45, "banana-cultivation-png-5000"),

    # ═══════════════════════════════════════════════════════════════════════
    # EARLY SETTLEMENTS & CITIES
    # ═══════════════════════════════════════════════════════════════════════
    ("Göbekli Tepe — World's Oldest Monumental Architecture", -9600, "cultural",
     "Şanlıurfa, Turkey", "Neolithic Anatolia",
     37.22, 38.92, 0.95, "gobekli-tepe-monumental-9600"),

    ("Jericho Becomes a Walled Town", -8500, "cultural",
     "Jericho, Palestine", "Neolithic Levant",
     31.87, 35.44, 0.80, "jericho-walled-town-8500"),

    ("Ain Ghazal — Major Neolithic Town", -7250, "cultural",
     "Amman, Jordan", "Neolithic Levant",
     31.97, 35.88, 0.55, "ain-ghazal-neolithic-7250"),

    ("Çatalhöyük — Largest Neolithic Settlement", -7400, "cultural",
     "Konya, Turkey", "Neolithic Anatolia",
     37.67, 32.83, 0.80, "catalhoyuk-peak-7400"),

    ("Mehrgarh — Earliest Indus Region Settlement", -7000, "cultural",
     "Balochistan, Pakistan", "Neolithic South Asia",
     29.37, 67.62, 0.65, "mehrgarh-settlement-7000"),

    ("Khirokitia — Early Settlement on Cyprus", -7000, "cultural",
     "Larnaca, Cyprus", "Neolithic Cyprus",
     34.80, 33.34, 0.45, "khirokitia-cyprus-7000"),

    ("Lepenski Vir — Mesolithic Settlement on the Danube", -6500, "cultural",
     "Serbia", "Mesolithic Balkans",
     44.56, 22.02, 0.50, "lepenski-vir-danube-6500"),

    ("Skara Brae — Neolithic Village in Orkney", -3180, "cultural",
     "Orkney Islands, Scotland", "Neolithic Britain",
     59.05, -3.34, 0.55, "skara-brae-orkney-3180"),

    # ═══════════════════════════════════════════════════════════════════════
    # MEGALITHIC ARCHITECTURE
    # ═══════════════════════════════════════════════════════════════════════
    ("Newgrange Passage Tomb Constructed", -3200, "cultural",
     "County Meath, Ireland", "Neolithic Ireland",
     53.69, -6.48, 0.65, "newgrange-passage-tomb-3200"),

    ("Stonehenge Construction Begins", -3000, "cultural",
     "Wiltshire, England", "Neolithic Britain",
     51.18, -1.83, 0.80, "stonehenge-construction-3000"),

    ("Dolmen Construction Across Atlantic Europe", -4000, "cultural",
     "Atlantic Europe", "Neolithic Europe",
     48.0, -3.0, 0.50, "dolmen-construction-europe-4000"),

    # ═══════════════════════════════════════════════════════════════════════
    # TECHNOLOGY & INNOVATIONS
    # ═══════════════════════════════════════════════════════════════════════
    ("Earliest Known Woven Textiles", -7000, "discovery",
     "Nahal Hemar, Israel", "Neolithic Levant",
     31.30, 35.30, 0.50, "earliest-woven-textiles-7000"),

    ("Earliest Beer Brewing — Natufian Culture", -11000, "discovery",
     "Raqefet Cave, Israel", "Late Pleistocene Levant",
     32.67, 35.08, 0.55, "earliest-beer-brewing-11000"),

    ("Earliest Wine Production", -6000, "discovery",
     "Georgia", "Neolithic Caucasus",
     41.72, 44.79, 0.50, "earliest-wine-production-6000"),

    ("Earliest Copper Working — Native Copper", -9000, "discovery",
     "Anatolia, Turkey", "Neolithic Anatolia",
     37.50, 30.50, 0.60, "earliest-copper-working-9000"),

    ("Copper Smelting Developed in the Balkans", -5000, "discovery",
     "Belovode, Serbia", "Chalcolithic Balkans",
     44.17, 21.53, 0.75, "copper-smelting-balkans-5000"),

    ("Lost-Wax Casting Technique Invented", -4500, "discovery",
     "Nahal Mishmar, Israel", "Chalcolithic Levant",
     31.43, 35.39, 0.55, "lost-wax-casting-4500"),

    ("Earliest Gold Artifacts — Varna Necropolis", -4600, "cultural",
     "Varna, Bulgaria", "Chalcolithic Balkans",
     43.20, 27.91, 0.60, "varna-gold-artifacts-4600"),

    ("Invention of the Plow — Agricultural Intensification", -4000, "discovery",
     "Mesopotamia", "Chalcolithic Mesopotamia",
     33.0, 44.0, 0.70, "plow-invention-4000"),

    ("Sail Invented for River Navigation", -5000, "discovery",
     "Nile Valley, Egypt", "Predynastic Egypt",
     26.0, 32.7, 0.65, "sail-invention-5000"),

    ("Potter's Wheel Developed", -4500, "discovery",
     "Mesopotamia", "Chalcolithic Mesopotamia",
     32.0, 45.0, 0.55, "potters-wheel-4500"),

    ("Wheel Invented for Transport", -3500, "discovery",
     "Mesopotamia/Pontic Steppe", "Late Chalcolithic",
     50.0, 35.0, 0.85, "wheel-transport-invention-3500"),

    ("Bronze Metallurgy Begins in the Near East", -3300, "discovery",
     "Near East", "Early Bronze Age Near East",
     36.0, 43.0, 0.80, "bronze-metallurgy-begins-3300"),

    ("Proto-Writing — Clay Tokens in Mesopotamia", -3400, "discovery",
     "Uruk, Iraq", "Late Uruk Period Mesopotamia",
     31.32, 45.64, 0.80, "proto-writing-clay-tokens-3400"),

    ("Earliest Writing — Cuneiform in Uruk", -3200, "discovery",
     "Uruk, Iraq", "Late Uruk Period Mesopotamia",
     31.32, 45.64, 0.95, "cuneiform-writing-uruk-3200"),

    # ═══════════════════════════════════════════════════════════════════════
    # EARLY CIVILIZATIONS (just before -3000)
    # ═══════════════════════════════════════════════════════════════════════
    ("Uruk Becomes the World's First Major City", -3800, "political",
     "Uruk, Iraq", "Uruk Period Mesopotamia",
     31.32, 45.64, 0.85, "uruk-first-major-city-3800"),

    ("Temple Economy Develops in Sumerian Cities", -3500, "political",
     "Sumer, Iraq", "Uruk Period Mesopotamia",
     31.40, 45.50, 0.65, "sumerian-temple-economy-3500"),

    ("Predynastic Egypt — Naqada Culture Flourishes", -3800, "cultural",
     "Naqada, Egypt", "Predynastic Egypt",
     25.90, 32.73, 0.65, "naqada-culture-egypt-3800"),

    ("Unification of Upper and Lower Egypt", -3100, "political",
     "Hierakonpolis, Egypt", "Predynastic Egypt",
     25.10, 32.78, 0.90, "unification-egypt-3100"),

    ("Early Indus Valley Settlements — Harappan Phase", -3500, "cultural",
     "Harappa, Pakistan", "Early Indus Valley",
     30.63, 72.87, 0.70, "early-indus-valley-3500"),

    ("Longshan Culture — Advanced Neolithic China", -3000, "cultural",
     "Shandong, China", "Neolithic China",
     36.67, 116.99, 0.55, "longshan-culture-china-3000"),

    ("Norte Chico Civilization Emerges in Peru", -3000, "cultural",
     "Supe Valley, Peru", "Preceramic Andes",
     -10.89, -77.52, 0.65, "norte-chico-peru-3000"),

    ("Cycladic Civilization Begins in the Aegean", -3200, "cultural",
     "Cyclades, Greece", "Early Bronze Age Aegean",
     37.00, 25.15, 0.50, "cycladic-civilization-3200"),

    # ═══════════════════════════════════════════════════════════════════════
    # CULTURAL / RELIGIOUS MILESTONES
    # ═══════════════════════════════════════════════════════════════════════
    ("Earliest Evidence of Shamanic Practices", -30000, "cultural",
     "Trois-Frères Cave, France", "Upper Paleolithic Europe",
     43.02, 1.21, 0.55, "earliest-shamanic-practices-30000"),

    ("Earliest Evidence of Trepanation (Brain Surgery)", -7000, "discovery",
     "Ensisheim, France", "Neolithic Europe",
     47.87, 7.35, 0.50, "earliest-trepanation-7000"),

    ("Earliest Known Map — Çatalhöyük Wall Painting", -6200, "discovery",
     "Konya, Turkey", "Neolithic Anatolia",
     37.67, 32.83, 0.45, "earliest-map-catalhoyuk-6200"),

    ("Obsidian Trade Networks Span the Near East", -7500, "discovery",
     "Cappadocia, Turkey", "Neolithic Anatolia",
     38.64, 34.83, 0.55, "obsidian-trade-networks-7500"),

    ("Jōmon Deep-Sea Fishing Culture Flourishes", -5000, "cultural",
     "Honshu, Japan", "Jōmon Period Japan",
     36.0, 140.0, 0.45, "jomon-deep-sea-fishing-5000"),

    ("Yangtze River Rice Farming Intensifies", -5000, "discovery",
     "Hemudu, China", "Neolithic China",
     30.0, 121.3, 0.60, "yangtze-rice-farming-5000"),

    ("Megalithic Stone Circles Emerge in Senegal", -5000, "cultural",
     "Senegambia", "Neolithic West Africa",
     13.70, -15.50, 0.45, "senegambia-stone-circles-5000"),

    ("Saharan Pastoral Cultures — Cattle Herding", -7000, "cultural",
     "Tassili n'Ajjer, Algeria", "Neolithic Sahara",
     25.50, 8.00, 0.50, "saharan-pastoral-cultures-7000"),

    ("Aboriginal Dreamtime Oral Traditions Established", -40000, "cultural",
     "Australia", "Upper Paleolithic Australia",
     -25.0, 134.0, 0.60, "dreamtime-oral-traditions-40000"),

    ("Mammoth Bone Dwellings — Mezhirich Settlement", -15000, "cultural",
     "Mezhirich, Ukraine", "Upper Paleolithic Eastern Europe",
     49.62, 31.45, 0.50, "mammoth-bone-dwellings-15000"),

    ("Extinction of Woolly Mammoth on Mainland", -10000, "natural",
     "Northern Eurasia", "Late Pleistocene",
     60.0, 60.0, 0.60, "woolly-mammoth-extinction-10000"),

    ("Megafauna Extinction in the Americas", -11000, "natural",
     "North America", "Late Pleistocene Americas",
     40.0, -100.0, 0.65, "megafauna-extinction-americas-11000"),

    ("Earliest Ceramic Figurines — Dolní Věstonice", -29000, "cultural",
     "Moravia, Czech Republic", "Upper Paleolithic Europe",
     48.88, 16.65, 0.55, "dolni-vestonice-figurines-29000"),

    ("Earliest Known Bow and Arrow Technology", -64000, "discovery",
     "Sibudu Cave, South Africa", "Middle Stone Age Africa",
     -29.51, 31.08, 0.60, "bow-arrow-technology-64000"),

    ("First Seafaring — Crossing to Crete", -130000, "discovery",
     "Crete, Greece", "Middle Pleistocene Mediterranean",
     35.24, 24.90, 0.55, "first-seafaring-crete-130000"),

    ("Denisovans Identified — Third Hominin Lineage", -100000, "discovery",
     "Denisova Cave, Russia", "Late Pleistocene Central Asia",
     51.40, 84.68, 0.65, "denisovans-identified-100000"),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Hominin evolution chain
    ("Homo habilis — Earliest Stone Tool", "Homo erectus Emerges",
     "contributing", 0.65, "Tool-using hominins evolved into more advanced Homo erectus."),
    ("Homo erectus Emerges", "Homo erectus Controls Fire",
     "contributing", 0.60, "Homo erectus developed the ability to control fire over time."),
    ("Homo erectus Controls Fire", "Homo erectus Migrates to East Asia",
     "contributing", 0.55, "Fire control enabled survival in colder climates during migrations."),
    ("Anatomically Modern Humans Appear", "Behavioral Modernity",
     "contributing", 0.70, "Anatomical modernity preceded the emergence of symbolic behavior."),
    ("Behavioral Modernity", "Homo Sapiens Migration Out of Africa",
     "contributing", 0.75, "Symbolic thought and planning enabled the Out of Africa expansion."),

    # Migration chains
    ("Homo Sapiens Migration Out of Africa", "Coastal Migration Route",
     "direct", 0.80, "Out of Africa movement included the southern coastal route."),
    ("Coastal Migration Route", "Settlement of Australia",
     "direct", 0.85, "Coastal migrants reached Australia via Southeast Asia."),
    ("Homo Sapiens Migration Out of Africa", "Migration into Europe",
     "direct", 0.80, "Out of Africa led to settlement of Europe."),
    ("Crossing Beringia", "Clovis Culture",
     "direct", 0.85, "Beringia crossing led to widespread settlement patterns including Clovis."),
    ("Crossing Beringia", "Monte Verde Settlement",
     "contributing", 0.70, "Beringia migrants eventually reached South America."),

    # Climate chains
    ("Toba Supervolcano", "Behavioral Modernity",
     "contributing", 0.40, "Toba bottleneck may have accelerated behavioral adaptation."),
    ("Last Glacial Maximum", "Crossing Beringia",
     "contributing", 0.75, "Low sea levels during LGM exposed the Bering land bridge."),
    ("Younger Dryas Cooling", "First Cultivation of Einkorn",
     "contributing", 0.65, "Younger Dryas climate stress pushed communities toward cultivation."),
    ("End of the Ice Age", "Sea Level Rise Separates Britain",
     "direct", 0.85, "Post-glacial warming raised sea levels flooding Doggerland."),
    ("End of the Ice Age", "Extinction of Woolly Mammoth",
     "contributing", 0.70, "Warming climate contributed to megafauna habitat loss."),
    ("Megafauna Extinction in the Americas", "Clovis Culture",
     "contributing", 0.50, "Megafauna extinction forced adaptation of hunting strategies."),

    # Agricultural revolution chain
    ("First Cultivation of Einkorn", "Domestication of Emmer Wheat",
     "direct", 0.80, "Early wheat cultivation led to domestication of related cereals."),
    ("Agricultural Revolution — Fertile Crescent", "Goat Domestication in the Zagros",
     "contributing", 0.70, "Agricultural settlement enabled animal domestication."),
    ("Agricultural Revolution — Fertile Crescent", "Cattle Domestication",
     "contributing", 0.65, "Sedentary farming lifestyles enabled cattle management."),
    ("Jericho Becomes a Walled Town", "Göbekli Tepe — World's Oldest Monumental",
     "contributing", 0.40, "Early settlements and monument-building emerged in parallel."),

    # Settlement chain
    ("Agricultural Revolution — Fertile Crescent", "Jericho Becomes a Walled Town",
     "direct", 0.80, "Agriculture enabled permanent, defensible settlements like Jericho."),
    ("Çatalhöyük — Largest Neolithic", "Obsidian Trade Networks",
     "contributing", 0.65, "Çatalhöyük was a major hub in obsidian trade."),

    # Technology chains
    ("Earliest Copper Working", "Copper Smelting Developed",
     "direct", 0.85, "Native copper working led to development of smelting techniques."),
    ("Copper Smelting Developed", "Bronze Metallurgy Begins",
     "direct", 0.85, "Copper smelting was prerequisite for bronze alloying."),
    ("Earliest Known Pottery", "Potter's Wheel Developed",
     "contributing", 0.55, "Millennia of hand-pottery preceded the potter's wheel."),
    ("Proto-Writing — Clay Tokens", "Earliest Writing — Cuneiform",
     "direct", 0.90, "Proto-writing tokens evolved into cuneiform script."),
    ("Invention of the Plow", "Sumerian Temple Economy",
     "contributing", 0.65, "Plow agriculture increased yields enabling urban economies."),
    ("Sail Invented for River Navigation", "Predynastic Egypt — Naqada",
     "contributing", 0.50, "Sail technology facilitated Nile trade and cultural exchange."),

    # Civilization chains
    ("Uruk Becomes the World's First Major City", "Earliest Writing — Cuneiform",
     "direct", 0.85, "Writing emerged in Uruk to manage the city's complex economy."),
    ("Uruk Becomes the World's First Major City", "Sumerian Temple Economy",
     "direct", 0.80, "Uruk pioneered the temple-based economy of Sumerian cities."),
    ("Predynastic Egypt — Naqada", "Unification of Upper and Lower Egypt",
     "direct", 0.85, "Naqada culture expansion led to political unification."),
]


async def main():
    """Insert prehistoric enrichment events and causality links."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events ──
    rows = await conn.fetch("SELECT id, slug, title FROM events")
    slugs_existing = {r["slug"] for r in rows}
    events_by_title: dict[str, str] = {r["title"]: str(r["id"]) for r in rows}
    slug_to_id: dict[str, str] = {r["slug"]: str(r["id"]) for r in rows}
    event_count_before = len(rows)

    link_rows = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, category, geo, geo_era, lat, lng, importance, slug in NEW_EVENTS:
        if slug in slugs_existing:
            print(f"  SKIP (exists): {slug}")
            continue

        is_bce = year < 0
        abs_year = abs(year)
        # Postgres maximum BC date year is 4713
        if abs_year > 4712:
            abs_year = 4712

        if is_bce:
            date_e_lit = f"'{abs_year:04d}-01-01 BC'::date"
            date_l_lit = f"'{abs_year:04d}-12-31 BC'::date"
        else:
            date_e_lit = f"'{abs_year:04d}-01-01'::date"
            date_l_lit = f"'{abs_year:04d}-12-31'::date"

        event_id = str(uuid.uuid4())
        wkt = f"SRID=4326;POINT({lng} {lat})"
        content_hash = sha256_str(json.dumps({"slug": slug, "year": year}, sort_keys=True))

        insert_sql = f"""
            INSERT INTO events (
                id, slug, title, date_earliest, date_latest, year_approx, is_bce,
                geo_point, geo_modern, geo_era_label,
                importance_score, zoom_min, event_category,
                review_status, created_by, content_hash
            ) VALUES (
                $1, $2, $3, {date_e_lit}, {date_l_lit}, $4, $5,
                ST_GeomFromEWKT($6), $7, $8,
                $9, $10, $11,
                'approved', $12, $13
            )
        """
        try:
            await conn.execute(
                insert_sql,
                event_id, slug, title, year, is_bce,
                wkt, geo, geo_era,
                importance, 2, category,
                CREATED_BY, content_hash,
            )
            events_by_title[title] = event_id
            slug_to_id[slug] = event_id
            slugs_existing.add(slug)
            events_inserted += 1
        except Exception as e:
            print(f"  ERROR inserting {slug}: {e}")

    print(f"Inserted {events_inserted} new events")

    # ── Helper: find event ID by title substring ──
    def find_event(fragment):
        matches = [(t, eid) for t, eid in events_by_title.items() if fragment in t]
        if not matches:
            return None
        matches.sort(key=lambda x: len(x[0]))
        return matches[0][1]

    # ── Insert causality links ──
    links_inserted = 0
    links_skipped = 0
    links_not_found = 0

    for cause_frag, effect_frag, link_type, strength, description in NEW_LINKS:
        cause_id = find_event(cause_frag)
        effect_id = find_event(effect_frag)

        if not cause_id or not effect_id:
            if not cause_id:
                print(f"  NOT FOUND cause: '{cause_frag}'")
            if not effect_id:
                print(f"  NOT FOUND effect: '{effect_frag}'")
            links_not_found += 1
            continue

        if cause_id == effect_id:
            links_skipped += 1
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
            """, link_id, cause_id, effect_id, link_type, strength, description, CREATED_BY)
            existing_links.add((cause_id, effect_id))
            links_inserted += 1
        except Exception as e:
            print(f"  ERROR link '{cause_frag}' -> '{effect_frag}': {e}")
            links_skipped += 1

    print(f"Inserted {links_inserted} new links (skipped {links_skipped}, not found {links_not_found})")

    # ── Verify totals ──
    total_pre = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx < -3000")
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nPrehistoric events (year < -3000): {total_pre}")
    print(f"Total events: {total_events}, total links: {total_links}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
