-- Pre-Columbian Americas Enrichment
-- Maya, Aztec, Inca, North America, Caribbean & South America

-- ============================================================
-- EVENTS
-- ============================================================

-- OLMEC / EARLY MESOAMERICA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('olmec-la-venta-900bce', 'Olmec Mother Culture — La Venta Ceremonial City', '0900-01-01 BC', '0900-12-31 BC', true, -900, 'Olmec Civilization', 'Mexico', 0.8, 'cultural', 'seed-script:v2', 'americas', 'La_Venta', ST_SetSRID(ST_MakePoint(-94.04, 18.10), 4326))
ON CONFLICT (slug) DO NOTHING;

-- POVERTY POINT
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('poverty-point-1700bce', 'Poverty Point — Louisiana Trading Center', '1700-01-01 BC', '1700-12-31 BC', true, -1700, 'Archaic Period', 'United States', 0.7, 'cultural', 'seed-script:v2', 'americas', 'Poverty_Point', ST_SetSRID(ST_MakePoint(-91.41, 32.63), 4326))
ON CONFLICT (slug) DO NOTHING;

-- HOPEWELL
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('hopewell-culture-200bce', 'Hopewell Culture — Ohio Valley Burial Mounds', '0200-01-01 BC', '0200-12-31 BC', true, -200, 'Hopewell Tradition', 'United States', 0.65, 'cultural', 'seed-script:v2', 'americas', 'Hopewell_tradition', ST_SetSRID(ST_MakePoint(-83.0, 39.4), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MAYA EARLY CLASSIC
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('maya-tikal-rises-250ce', 'Maya Early Classic — Tikal Rises as Dominant City-State', '0250-01-01', '0250-12-31', false, 250, 'Maya Early Classic', 'Guatemala', 0.8, 'political', 'seed-script:v2', 'americas', 'Tikal', ST_SetSRID(ST_MakePoint(-89.62, 17.22), 4326))
ON CONFLICT (slug) DO NOTHING;

-- TEOTIHUACAN
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('teotihuacan-peak-400ce', 'Teotihuacan — Largest City in the Americas', '0400-01-01', '0400-12-31', false, 400, 'Classic Mesoamerica', 'Mexico', 0.85, 'cultural', 'seed-script:v2', 'americas', 'Teotihuacan', ST_SetSRID(ST_MakePoint(-98.84, 19.69), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MAYA CLASSIC PEAK
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('maya-classic-peak-600ce', 'Maya Classic Period Peak — Palenque, Copán, Quiriguá Flourish', '0600-01-01', '0600-12-31', false, 600, 'Maya Late Classic', 'Guatemala / Honduras / Mexico', 0.8, 'cultural', 'seed-script:v2', 'americas', 'Maya_civilization', ST_SetSRID(ST_MakePoint(-89.62, 17.22), 4326))
ON CONFLICT (slug) DO NOTHING;

-- PAKAL THE GREAT
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('palenque-pakal-great-615ce', 'Palenque Under Pakal the Great — Maya Golden Age', '0615-01-01', '0683-12-31', false, 615, 'Maya Late Classic', 'Mexico', 0.75, 'political', 'seed-script:v2', 'americas', 'K%27inich_Janaab_Pakal', ST_SetSRID(ST_MakePoint(-92.05, 17.48), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CLASSIC MAYA COLLAPSE
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('classic-maya-collapse-900ce', 'Classic Maya Collapse — Southern Lowland Cities Abandoned', '0800-01-01', '0950-12-31', false, 900, 'Terminal Classic', 'Guatemala / Mexico', 0.85, 'political', 'seed-script:v2', 'americas', 'Classic_Maya_collapse', ST_SetSRID(ST_MakePoint(-89.62, 17.22), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CHICHEN ITZA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('chichen-itza-postclassic-900ce', 'Chichen Itza — Postclassic Maya Capital', '0900-01-01', '0900-12-31', false, 900, 'Postclassic Maya', 'Mexico', 0.75, 'political', 'seed-script:v2', 'americas', 'Chichen_Itza', ST_SetSRID(ST_MakePoint(-88.57, 20.68), 4326))
ON CONFLICT (slug) DO NOTHING;

-- TAINO
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('taino-caribbean-peak-1000ce', 'Taíno Civilization — Caribbean Cultural Peak', '1000-01-01', '1000-12-31', false, 1000, 'Pre-Columbian Caribbean', 'Dominican Republic / Puerto Rico', 0.65, 'cultural', 'seed-script:v2', 'americas', 'Ta%C3%ADno', ST_SetSRID(ST_MakePoint(-69.9, 18.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MISSISSIPPIAN
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('mississippian-culture-peak-1000ce', 'Mississippian Culture Peak — Mound-Building Civilization', '1000-01-01', '1400-12-31', false, 1000, 'Mississippian Period', 'United States', 0.7, 'cultural', 'seed-script:v2', 'americas', 'Mississippian_culture', ST_SetSRID(ST_MakePoint(-90.06, 38.66), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CAHOKIA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('cahokia-peak-1050ce', 'Cahokia — Largest Pre-Columbian North American City', '1050-01-01', '1050-12-31', false, 1050, 'Mississippian Period', 'United States', 0.8, 'cultural', 'seed-script:v2', 'americas', 'Cahokia', ST_SetSRID(ST_MakePoint(-90.06, 38.66), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA FOUND CUSCO
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-found-cusco-1200ce', 'Inca Found Cusco — Origin of the Inca State', '1200-01-01', '1200-12-31', false, 1200, 'Early Inca', 'Peru', 0.75, 'political', 'seed-script:v2', 'americas', 'Kingdom_of_Cusco', ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CHIBCHA/MUISCA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('muisca-civilization-1200ce', 'Chibcha/Muisca Civilization — Colombian Highlands', '1200-01-01', '1200-12-31', false, 1200, 'Pre-Columbian South America', 'Colombia', 0.65, 'cultural', 'seed-script:v2', 'americas', 'Muisca', ST_SetSRID(ST_MakePoint(-73.8, 5.0), 4326))
ON CONFLICT (slug) DO NOTHING;

-- ANCESTRAL PUEBLOANS (already seeded — skip via ON CONFLICT)

-- CHICHEN ITZA FALLS TO MAYAPAN
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('chichen-itza-falls-mayapan-1221ce', 'Chichen Itza Falls to Mayapan — Power Shift in Yucatan', '1221-01-01', '1221-12-31', false, 1221, 'Postclassic Maya', 'Mexico', 0.65, 'military', 'seed-script:v2', 'americas', 'Mayapan', ST_SetSRID(ST_MakePoint(-89.46, 20.63), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CAHOKIA COLLAPSES
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('cahokia-collapse-1300ce', 'Cahokia Collapses — Abandonment of North America''s Largest City', '1300-01-01', '1300-12-31', false, 1300, 'Late Mississippian', 'United States', 0.75, 'political', 'seed-script:v2', 'americas', 'Cahokia', ST_SetSRID(ST_MakePoint(-90.06, 38.66), 4326))
ON CONFLICT (slug) DO NOTHING;

-- AZTEC FOUND TENOCHTITLAN
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('aztec-found-tenochtitlan-1325ce', 'Aztec Found Tenochtitlan — Island City in Lake Texcoco', '1325-01-01', '1325-12-31', false, 1325, 'Postclassic Mesoamerica', 'Mexico', 0.8, 'political', 'seed-script:v2', 'americas', 'Tenochtitlan', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- TRIPLE ALLIANCE
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('aztec-triple-alliance-1428ce', 'Triple Alliance Formed — Aztec Empire Begins', '1428-01-01', '1428-12-31', false, 1428, 'Aztec Empire', 'Mexico', 0.75, 'political', 'seed-script:v2', 'americas', 'Aztec_Triple_Alliance', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA EXPANSION UNDER PACHACUTI
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-pachacuti-expansion-1438ce', 'Inca Empire Expands Under Pachacuti — Tawantinsuyu Born', '1438-01-01', '1438-12-31', false, 1438, 'Inca Empire', 'Peru', 0.8, 'political', 'seed-script:v2', 'americas', 'Pachacuti', ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MOCTEZUMA I
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('aztec-moctezuma-i-1440ce', 'Aztec Empire Peak Under Moctezuma I', '1440-01-01', '1469-12-31', false, 1440, 'Aztec Empire', 'Mexico', 0.7, 'political', 'seed-script:v2', 'americas', 'Moctezuma_I', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- HAUDENOSAUNEE CONFEDERACY
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('haudenosaunee-confederacy-1450ce', 'Haudenosaunee (Iroquois) Confederacy Founded', '1450-01-01', '1450-12-31', false, 1450, 'Pre-Columbian North America', 'United States', 0.75, 'political', 'seed-script:v2', 'americas', 'Haudenosaunee', ST_SetSRID(ST_MakePoint(-76.15, 42.95), 4326))
ON CONFLICT (slug) DO NOTHING;

-- FLOWER WARS
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('aztec-flower-wars-1450ce', 'Flower Wars — Aztec Ritual Warfare for Sacrifice', '1450-01-01', '1450-12-31', false, 1450, 'Aztec Empire', 'Mexico', 0.65, 'military', 'seed-script:v2', 'americas', 'Flower_war', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA ROADS
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-road-system-1450ce', 'Inca Road System — 25,000 Miles Spanning the Andes', '1450-01-01', '1450-12-31', false, 1450, 'Inca Empire', 'Peru', 0.75, 'technological', 'seed-script:v2', 'americas', 'Inca_road_system', ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MACHU PICCHU
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('machu-picchu-constructed-1450ce', 'Machu Picchu Constructed — Inca Royal Estate', '1450-01-01', '1450-12-31', false, 1450, 'Inca Empire', 'Peru', 0.8, 'cultural', 'seed-script:v2', 'americas', 'Machu_Picchu', ST_SetSRID(ST_MakePoint(-72.55, -13.16), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MAPUCHE RESIST INCA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('mapuche-resist-inca-1470ce', 'Mapuche Resist Inca Expansion — Southern Frontier', '1470-01-01', '1470-12-31', false, 1470, 'Inca Empire', 'Chile', 0.65, 'military', 'seed-script:v2', 'americas', 'Mapuche', ST_SetSRID(ST_MakePoint(-72.6, -38.7), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA AT PEAK
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-empire-peak-1500ce', 'Inca Empire at Peak — Largest Empire in the Americas', '1500-01-01', '1500-12-31', false, 1500, 'Inca Empire', 'Peru', 0.85, 'political', 'seed-script:v2', 'americas', 'Inca_Empire', ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326))
ON CONFLICT (slug) DO NOTHING;

-- TENOCHTITLAN LARGEST CITY
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('tenochtitlan-largest-city-1500ce', 'Tenochtitlan — Largest City in the Americas with 200,000 People', '1500-01-01', '1500-12-31', false, 1500, 'Aztec Empire', 'Mexico', 0.8, 'cultural', 'seed-script:v2', 'americas', 'Tenochtitlan', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- CORTES ARRIVES
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('cortes-arrives-mexico-1519ce', 'Hernán Cortés Arrives in Mexico — Spanish Contact with Aztec', '1519-01-01', '1519-12-31', false, 1519, 'Spanish Conquest', 'Mexico', 0.8, 'military', 'seed-script:v2', 'americas', 'Spanish_conquest_of_the_Aztec_Empire', ST_SetSRID(ST_MakePoint(-96.13, 19.20), 4326))
ON CONFLICT (slug) DO NOTHING;

-- LA NOCHE TRISTE
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('la-noche-triste-1520ce', 'La Noche Triste — Aztec Drive Out Spanish from Tenochtitlan', '1520-06-30', '1520-07-01', false, 1520, 'Spanish Conquest', 'Mexico', 0.7, 'military', 'seed-script:v2', 'americas', 'La_Noche_Triste', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- SMALLPOX AZTEC
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('smallpox-aztec-1520ce', 'Smallpox Devastates Aztec Population — Up to 40% Mortality', '1520-01-01', '1520-12-31', false, 1520, 'Spanish Conquest', 'Mexico', 0.85, 'social', 'seed-script:v2', 'americas', 'Cocoliztli_epidemics', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- FALL OF TENOCHTITLAN
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('fall-tenochtitlan-1521ce', 'Fall of Tenochtitlan — End of the Aztec Empire', '1521-08-13', '1521-08-13', false, 1521, 'Spanish Conquest', 'Mexico', 0.85, 'military', 'seed-script:v2', 'americas', 'Fall_of_Tenochtitlan', ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326))
ON CONFLICT (slug) DO NOTHING;

-- MAYA RESIST SPANISH
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('maya-resist-spanish-1524ce', 'Maya Resist Spanish Conquest — 170 Years of Resistance (1524-1697)', '1524-01-01', '1697-12-31', false, 1524, 'Spanish Conquest', 'Guatemala / Mexico', 0.7, 'military', 'seed-script:v2', 'americas', 'Spanish_conquest_of_the_Maya', ST_SetSRID(ST_MakePoint(-89.62, 17.22), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA CIVIL WAR
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-civil-war-1529ce', 'Inca Civil War — Huáscar vs Atahualpa', '1529-01-01', '1532-12-31', false, 1529, 'Inca Empire', 'Peru / Ecuador', 0.75, 'military', 'seed-script:v2', 'americas', 'Inca_Civil_War', ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326))
ON CONFLICT (slug) DO NOTHING;

-- PIZARRO CAPTURES ATAHUALPA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('pizarro-captures-atahualpa-1532ce', 'Pizarro Captures Atahualpa — Fall of the Inca Empire Begins', '1532-11-16', '1532-11-16', false, 1532, 'Spanish Conquest', 'Peru', 0.8, 'military', 'seed-script:v2', 'americas', 'Battle_of_Cajamarca', ST_SetSRID(ST_MakePoint(-78.51, -7.16), 4326))
ON CONFLICT (slug) DO NOTHING;

-- INCA RESISTANCE VILCABAMBA
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('inca-resistance-vilcabamba-1536ce', 'Inca Resistance Continues — Neo-Inca State at Vilcabamba (1536-1572)', '1536-01-01', '1572-12-31', false, 1536, 'Spanish Conquest', 'Peru', 0.7, 'military', 'seed-script:v2', 'americas', 'Neo-Inca_State', ST_SetSRID(ST_MakePoint(-72.97, -13.10), 4326))
ON CONFLICT (slug) DO NOTHING;

-- PLAINS HORSE CULTURE
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('plains-horse-culture-1600ce', 'Plains Cultures Develop Horse Culture After Spanish Contact', '1600-01-01', '1600-12-31', false, 1600, 'Colonial Americas', 'United States', 0.65, 'cultural', 'seed-script:v2', 'americas', 'Plains_Indians', ST_SetSRID(ST_MakePoint(-100.0, 40.0), 4326))
ON CONFLICT (slug) DO NOTHING;

-- COLUMBIAN EXCHANGE
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('columbian-exchange-1492ce', 'Columbian Exchange Begins — Disease, Crops, Animals Transform Two Worlds', '1492-01-01', '1492-12-31', false, 1492, 'Age of Exploration', 'Caribbean', 0.85, 'social', 'seed-script:v2', 'americas', 'Columbian_exchange', ST_SetSRID(ST_MakePoint(-69.9, 18.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Helper: use subqueries to find event IDs by slug

-- Olmec → Maya cultural foundation
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Olmec writing, calendrics, and religious practices formed the cultural foundation for Maya civilization', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'olmec-la-venta-900bce' AND e.slug = 'maya-tikal-rises-250ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Teotihuacan → Maya Classic florescence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'Teotihuacan trade and political influence stimulated Maya Classic period growth', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'teotihuacan-peak-400ce' AND e.slug = 'maya-classic-peak-600ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Classic Maya Collapse → Chichen Itza (Postclassic migration)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Collapse of southern lowland cities shifted power to northern Yucatan centers like Chichen Itza', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'classic-maya-collapse-900ce' AND e.slug = 'chichen-itza-postclassic-900ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Flower Wars → weakened allies → Spanish conquest success
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'Flower Wars alienated tributary states, who later allied with Cortés against the Aztec', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'aztec-flower-wars-1450ce' AND e.slug = 'fall-tenochtitlan-1521ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cortés arrives → La Noche Triste
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Spanish incursion into Tenochtitlan provoked Aztec uprising forcing Spanish retreat', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'cortes-arrives-mexico-1519ce' AND e.slug = 'la-noche-triste-1520ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Smallpox → Fall of Tenochtitlan
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Smallpox killed Aztec leadership and devastated defenders, enabling Spanish reconquest', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'smallpox-aztec-1520ce' AND e.slug = 'fall-tenochtitlan-1521ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- La Noche Triste → Fall of Tenochtitlan
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Spanish retreat and regrouping led to siege and ultimate fall of Tenochtitlan', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'la-noche-triste-1520ce' AND e.slug = 'fall-tenochtitlan-1521ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Inca Civil War → Pizarro captures Atahualpa
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Civil war weakened and divided the Inca Empire, enabling Pizarro''s small force to exploit the chaos', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'inca-civil-war-1529ce' AND e.slug = 'pizarro-captures-atahualpa-1532ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Pachacuti expansion → Inca peak
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Pachacuti''s conquests and administrative reforms created the vast Inca Empire', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'inca-pachacuti-expansion-1438ce' AND e.slug = 'inca-empire-peak-1500ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Pizarro → Inca resistance at Vilcabamba
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Spanish conquest sparked Inca resistance movement retreating to Vilcabamba', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'pizarro-captures-atahualpa-1532ce' AND e.slug = 'inca-resistance-vilcabamba-1536ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cahokia peak → Cahokia collapse
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.6, 'Environmental degradation and political stress led to Cahokia''s abandonment', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'cahokia-peak-1050ce' AND e.slug = 'cahokia-collapse-1300ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Columbian Exchange → Smallpox devastation
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Columbian Exchange brought Old World diseases including smallpox to immunologically naive populations', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'columbian-exchange-1492ce' AND e.slug = 'smallpox-aztec-1520ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Triple Alliance → Aztec peak under Moctezuma I
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Triple Alliance provided the political framework for Aztec imperial expansion', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'aztec-triple-alliance-1428ce' AND e.slug = 'aztec-moctezuma-i-1440ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Inca roads → Inca peak
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Road system enabled administrative control and military movement across the vast empire', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'inca-road-system-1450ce' AND e.slug = 'inca-empire-peak-1500ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Mapuche resist Inca → limits of Inca expansion
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'Mapuche resistance defined the southern boundary of the Inca Empire', 'seed-script:v2', 'approved'
FROM events c, events e WHERE c.slug = 'mapuche-resist-inca-1470ce' AND e.slug = 'inca-empire-peak-1500ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
