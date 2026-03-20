-- Ancient Near East Deep-Dive (3000-500 BCE)
-- Akkadian, Hittite, Assyrian, Neo-Babylonian, Egypt deep coverage

-- ============================================================
-- EVENTS
-- ============================================================

-- Akkadian Empire collapse
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('akkadian-empire-collapses-2154bce', 'Akkadian Empire Collapses — Gutian Invasion', '2154-01-01 BC', '2154-12-31 BC', true, -2154, 'Mesopotamia', 'Iraq', 0.8, 'political', 'seed-script:v2', 'Middle East', 'Gutian_dynasty_of_Sumer', ST_SetSRID(ST_MakePoint(44.4, 32.6), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Old Assyrian trade colonies
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('old-assyrian-trade-colonies-1900bce', 'Old Assyrian Trade Colonies — Kanesh and Long-Distance Commerce', '1900-01-01 BC', '1900-12-31 BC', true, -1900, 'Old Assyrian Period', 'Turkey / Iraq', 0.65, 'economic', 'seed-script:v2', 'Middle East', 'Old_Assyrian_Empire', ST_SetSRID(ST_MakePoint(35.6, 38.9), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Middle Assyrian Empire
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('middle-assyrian-empire-1365bce', 'Middle Assyrian Empire — Ashur-uballit I Establishes Regional Power', '1365-01-01 BC', '1365-12-31 BC', true, -1365, 'Middle Assyrian Period', 'Iraq', 0.7, 'political', 'seed-script:v2', 'Middle East', 'Middle_Assyrian_Empire', ST_SetSRID(ST_MakePoint(43.3, 35.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Neo-Assyrian Empire expansion start
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('neo-assyrian-expansion-934bce', 'Neo-Assyrian Empire Expansion Begins — Ashur-dan II', '934-01-01 BC', '934-12-31 BC', true, -934, 'Neo-Assyrian Empire', 'Iraq', 0.8, 'political', 'seed-script:v2', 'Middle East', 'Neo-Assyrian_Empire', ST_SetSRID(ST_MakePoint(43.3, 35.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Sennacherib sacks Babylon
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('sennacherib-sacks-babylon-689bce', 'Sennacherib Sacks Babylon — Destruction of the Holy City', '689-01-01 BC', '689-12-31 BC', true, -689, 'Neo-Assyrian Empire', 'Iraq', 0.75, 'military', 'seed-script:v2', 'Middle East', 'Sennacherib', ST_SetSRID(ST_MakePoint(44.4, 32.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Sargon II destroys Israel
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('sargon-ii-destroys-israel-721bce', 'Sargon II Destroys the Kingdom of Israel — Deportation of Ten Tribes', '721-01-01 BC', '721-12-31 BC', true, -721, 'Neo-Assyrian Empire', 'Israel / Palestine', 0.8, 'military', 'seed-script:v2', 'Middle East', 'Sargon_II', ST_SetSRID(ST_MakePoint(35.2, 32.3), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Kassite Dynasty
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('kassite-dynasty-babylon-1595bce', 'Kassite Dynasty Rules Babylon — Longest Dynasty of Babylonia', '1595-01-01 BC', '1595-12-31 BC', true, -1595, 'Kassite Babylonia', 'Iraq', 0.7, 'political', 'seed-script:v2', 'Middle East', 'Kassite_dynasty', ST_SetSRID(ST_MakePoint(44.4, 32.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Neo-Babylonian Empire founded
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('neo-babylonian-empire-founded-626bce', 'Neo-Babylonian Empire Founded — Nabopolassar Overthrows Assyria', '626-01-01 BC', '626-12-31 BC', true, -626, 'Neo-Babylonian Empire', 'Iraq', 0.8, 'political', 'seed-script:v2', 'Middle East', 'Neo-Babylonian_Empire', ST_SetSRID(ST_MakePoint(44.4, 32.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Cambyses conquers Egypt
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('cambyses-conquers-egypt-525bce', 'Cambyses II Conquers Egypt — Persian Rule Over the Nile', '525-01-01 BC', '525-12-31 BC', true, -525, 'Achaemenid Empire', 'Egypt', 0.75, 'military', 'seed-script:v2', 'Middle East', 'Cambyses_II', ST_SetSRID(ST_MakePoint(31.2, 30.0), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Iron Age India
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('iron-age-india-1000bce', 'Iron Age India — Painted Grey Ware Culture and Vedic Expansion', '1000-01-01 BC', '1000-12-31 BC', true, -1000, 'Vedic Period', 'India', 0.65, 'cultural', 'seed-script:v2', 'South Asia', 'Iron_Age_India', ST_SetSRID(ST_MakePoint(77.2, 28.6), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Hittite Empire collapses
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('hittite-empire-collapses-1180bce', 'Hittite Empire Collapses — Bronze Age Collapse Destroys Hattusa', '1180-01-01 BC', '1180-12-31 BC', true, -1180, 'Hittite Empire', 'Turkey', 0.8, 'political', 'seed-script:v2', 'Middle East', 'Hittites#Fall', ST_SetSRID(ST_MakePoint(34.6, 40.0), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Akhenaten monotheism (check - already exists at -1353)
-- Already exists: "Akhenaten's Religious Revolution — Monotheism in Egypt" at -1353

-- Tutankhamun (already exists at -1332)

-- New Kingdom Egypt (already exists at -1550)

-- Hyksos invasion (already exists at -1650)

-- Middle Kingdom (already exists at -2055)

-- Battle of Kadesh (already exists at -1274)

-- Hittite sack Babylon (already exists at -1595)

-- Hittite-Egyptian peace (already exists at -1259)

-- Sea Peoples (already exists at -1180)

-- Nubian pharaohs (already exists at -747)

-- Ashurnasirpal II (already exists at -879)

-- Tiglath-Pileser III (already exists at -745)

-- Ashurbanipal library (already exists at -650/-668)

-- Fall of Nineveh (already exists at -612)

-- Hammurabi's Code (already exists at -1754)

-- Nebuchadnezzar II (already exists at -605)

-- Babylonian Captivity (already exists at -586)

-- Cyrus frees Jews (already exists at -539)

-- Cyrus founds Persian Empire (already exists at -550)

-- Lydia first coins (already exists at -600)

-- Marathon/Thermopylae (outside -500 range or check separately)

-- Darius I (already exists at -522/-520)

-- Rig Veda (already exists at -1500)

-- Mahajanapadas (already exists at -600)

-- Vedic Age (already exists at -1500)

-- Additional missing events that add value:

-- Babylonian Captivity at -597 (existing is at -586 destruction of temple)
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('babylonian-captivity-597bce', 'First Deportation of Jews to Babylon — Babylonian Captivity Begins', '597-01-01 BC', '597-12-31 BC', true, -597, 'Neo-Babylonian Empire', 'Iraq / Israel', 0.75, 'political', 'seed-script:v2', 'Middle East', 'Babylonian_captivity', ST_SetSRID(ST_MakePoint(44.4, 32.5), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Median Empire
-- Check shows it exists, skip

-- Persian conquest of Egypt (= Cambyses, added above)

-- Ashurnasirpal II brutal expansion (exists at -879, but check title)
-- Already: "Ashurnasirpal II Builds Calah" at -879

-- Additional enrichment: events that fill real gaps

-- Ur-Nammu law code (already exists at -2100: "Code of Ur-Nammu")

-- First cities in Uruk (already exists at -3500: "Uruk — World's First Great City")

-- Cuneiform (already exists at -3200/-3100)

-- Third Dynasty of Ur (already exists at -2112)

-- Old Kingdom pyramid age (already exists at -2686)

-- First Intermediate Period (already exists at -2181)

-- Hittite Empire founded (already exists at -1650: "Rise of the Hittite Empire")

-- Battle of Marathon and Thermopylae - check if in range
-- Marathon would be -490, Thermopylae -480

INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('battle-marathon-490bce', 'Battle of Marathon — Greeks Defeat Persian Invasion', '490-01-01 BC', '490-12-31 BC', true, -490, 'Greco-Persian Wars', 'Greece', 0.85, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Marathon', ST_SetSRID(ST_MakePoint(23.97, 38.12), 4326))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('battle-thermopylae-480bce', 'Battle of Thermopylae — 300 Spartans Stand Against Persia', '480-01-01 BC', '480-12-31 BC', true, -480, 'Greco-Persian Wars', 'Greece', 0.85, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Thermopylae', ST_SetSRID(ST_MakePoint(22.53, 38.80), 4326))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('battle-salamis-480bce', 'Battle of Salamis — Greek Navy Destroys Persian Fleet', '480-01-01 BC', '480-12-31 BC', true, -480, 'Greco-Persian Wars', 'Greece', 0.85, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Salamis', ST_SetSRID(ST_MakePoint(23.6, 37.96), 4326))
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Helper: insert causality links by matching event titles
-- Sargon of Akkad → world's first empire model
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Sargon created the model of imperial conquest that all subsequent Mesopotamian empires followed', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Sargon of Akkad Founds First Empire'
AND e.title = 'Neo-Assyrian Empire Expansion Begins — Ashur-dan II'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Akkadian collapse → Third Dynasty of Ur
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Gutian invasion ended Akkadian rule, creating the power vacuum that Ur-Nammu filled', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Akkadian Empire Collapses — Gutian Invasion'
AND e.title = 'Third Dynasty of Ur — Sumerian Renaissance'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Ur-Nammu law code → Hammurabi's Code
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Ur-Nammu established the tradition of codified law that Hammurabi perfected', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Code of Ur-Nammu — Oldest Known Law Code'
AND e.title = 'Code of Hammurabi — First Major Law Code'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hammurabi's Code → legal tradition
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Hammurabi''s code established the concept of written, publicly displayed laws that influenced Greek and Roman legal traditions', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Code of Hammurabi — First Major Law Code'
AND e.title = 'Draco''s Law Code in Athens'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hittite sack of Babylon → Kassite Dynasty
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Hittite raid on Babylon created the power vacuum filled by Kassite rulers', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Hittite Sack of Babylon Under Mursili I'
AND e.title = 'Kassite Dynasty Rules Babylon — Longest Dynasty of Babylonia'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Battle of Kadesh → first peace treaty
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Military stalemate at Kadesh led to history''s first known international peace treaty', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Battle of Kadesh — Egypt vs. Hittites'
AND e.title = 'Hittite-Egyptian Peace Treaty — First Known Peace Treaty'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Bronze Age Collapse → Hittite collapse
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'The Bronze Age Collapse destroyed the Hittite Empire along with other Late Bronze Age civilizations', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Bronze Age Collapse — Catastrophic End of Late Bronze Age Civilizations'
AND e.title = 'Hittite Empire Collapses — Bronze Age Collapse Destroys Hattusa'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Bronze Age Collapse → Iron Age begins
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Collapse of Bronze Age trade networks forced adoption of iron technology, beginning the Iron Age', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Bronze Age Collapse — Catastrophic End of Late Bronze Age Civilizations'
AND e.title = 'Iron Age Begins in the Near East'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Bronze Age Collapse → Phoenician rise
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Collapse of Mycenaean and Hittite powers created the maritime vacuum Phoenicians filled', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Bronze Age Collapse — Catastrophic End of Late Bronze Age Civilizations'
AND e.title = 'Phoenician Alphabet Spreads Across the Mediterranean'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Ashurbanipal library → preservation of knowledge
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Ashurbanipal''s systematic library preserved the Epic of Gilgamesh and thousands of Mesopotamian texts for posterity', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Library of Ashurbanipal — The World''s First Systematic Library'
AND e.title LIKE 'Epic of Gilgamesh%'
AND e.year_approx = -2100
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Fall of Nineveh → Neo-Babylonian Empire
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Destruction of the Assyrian capital freed Babylon to become the dominant Mesopotamian power', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Fall of Nineveh — Collapse of the Assyrian Empire'
AND e.title = 'Neo-Babylonian Empire Founded — Nabopolassar Overthrows Assyria'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Neo-Babylonian → Nebuchadnezzar destroys Jerusalem
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Nebuchadnezzar''s Neo-Babylonian Empire conquered Judah and destroyed the Temple', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Neo-Babylonian Empire Under Nebuchadnezzar II — Babylon%'
AND e.title = 'Nebuchadnezzar Destroys Jerusalem — Babylonian Captivity Begins'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Babylonian Captivity → Cyrus frees Jews
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The Babylonian Exile was ended by Cyrus''s conquest of Babylon and his decree freeing captive peoples', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Nebuchadnezzar Destroys Jerusalem — Babylonian Captivity Begins'
AND e.title = 'Cyrus Conquers Babylon — Jews Freed from Captivity'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cyrus founds Persian Empire → Cambyses conquers Egypt
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Cambyses continued his father Cyrus''s imperial expansion by conquering Egypt', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Cyrus the Great Founds the Achaemenid Empire'
AND e.title = 'Cambyses II Conquers Egypt — Persian Rule Over the Nile'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cambyses → Darius reorganizes
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'After Cambyses''s death and civil war, Darius seized power and reorganized the empire with satrapies', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Cambyses II Conquers Egypt — Persian Rule Over the Nile'
AND e.title = 'Darius I Reorganizes the Persian Empire'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Darius I → Persian Wars (Marathon)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Darius I''s punitive expedition against Athens for supporting the Ionian Revolt led to the Battle of Marathon', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Darius I Reorganizes the Persian Empire'
AND e.title = 'Battle of Marathon — Greeks Defeat Persian Invasion'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Marathon → Thermopylae
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Persian defeat at Marathon motivated Xerxes'' massive invasion force, leading to the stand at Thermopylae', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Battle of Marathon — Greeks Defeat Persian Invasion'
AND e.title = 'Battle of Thermopylae — 300 Spartans Stand Against Persia'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Thermopylae → Salamis
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Thermopylae delayed the Persians long enough for the Greek navy to prepare the decisive battle at Salamis', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Battle of Thermopylae — 300 Spartans Stand Against Persia'
AND e.title = 'Battle of Salamis — Greek Navy Destroys Persian Fleet'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hyksos invasion → New Kingdom
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Expulsion of the Hyksos unified Egypt and launched the militaristic New Kingdom era', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Hyksos Invasion of Egypt'
AND e.title = 'New Kingdom Egypt — Egypt''s Imperial Golden Age'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cuneiform → Epic of Gilgamesh
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Cuneiform writing enabled the composition and transmission of the world''s first literary epic', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Invention of Cuneiform Writing in Sumer'
AND e.title = 'Epic of Gilgamesh — Oldest Literary Masterpiece'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Phoenician alphabet → Greek alphabet
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Greeks adapted the Phoenician consonantal alphabet by adding vowels, creating the basis for all Western scripts', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Phoenician Alphabet Spreads Across the Mediterranean'
AND e.title = 'Phoenician Alphabet Adopted by Greeks — Foundation of Western Writing'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Sargon II destroys Israel → Babylonian Captivity
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Assyrian destruction of the northern kingdom prefigured Babylon''s later conquest of Judah', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title = 'Sargon II Destroys the Kingdom of Israel — Deportation of Ten Tribes'
AND e.title = 'Nebuchadnezzar Destroys Jerusalem — Babylonian Captivity Begins'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
