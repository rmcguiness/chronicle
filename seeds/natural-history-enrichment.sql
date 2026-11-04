-- Natural History Enrichment: 13 new events + ~15 causality links

-- ============================================================
-- EVENTS
-- ============================================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, region, wikipedia_slug, article_summary, created_by, review_status)
VALUES
('plague-of-cyprian-249', 'Plague of Cyprian — 5000 Deaths Per Day in Rome', '0249-01-01', '0262-12-31', 249, false, 'natural', ARRAY['plague','pandemic','roman-empire'], 0.7, 'Italy / North Africa', 'Roman Empire', ST_SetSRID(ST_MakePoint(12.4964, 41.9028), 4326), 'europe', 'Plague_of_Cyprian', 'A pandemic that struck the Roman Empire from 249–262 CE. At its peak, 5,000 people died per day in Rome. It contributed to the Crisis of the Third Century.', 'enrichment-bot', 'approved'),
('great-plague-marseille-1720', 'Great Plague of Marseille — Last Major Western European Plague', '1720-05-01', '1722-12-31', 1720, false, 'natural', ARRAY['plague','bubonic-plague','france'], 0.55, 'France', 'Kingdom of France', ST_SetSRID(ST_MakePoint(5.3698, 43.2965), 4326), 'europe', 'Great_Plague_of_Marseille', 'The last major outbreak of bubonic plague in Western Europe, killing approximately 100,000 people in Marseille and Provence.', 'enrichment-bot', 'approved'),
('asian-flu-1957', '1957 Asian Flu Pandemic', '1957-02-01', '1958-12-31', 1957, false, 'natural', ARRAY['pandemic','influenza','global'], 0.6, 'Global', 'Cold War Era', ST_SetSRID(ST_MakePoint(113.2644, 23.1291), 4326), 'asia', 'Asian_flu', 'An influenza pandemic caused by H2N2, originating in China. It killed 1–2 million worldwide.', 'enrichment-bot', 'approved'),
('sars-outbreak-2003', 'SARS Outbreak — First Coronavirus Epidemic', '2003-02-01', '2003-07-31', 2003, false, 'natural', ARRAY['pandemic','coronavirus','global'], 0.6, 'China / Global', 'Modern Era', ST_SetSRID(ST_MakePoint(113.2644, 23.1291), 4326), 'asia', 'Severe_acute_respiratory_syndrome', 'The first coronavirus epidemic, infecting 8,098 across 29 countries. It prompted global disease surveillance systems.', 'enrichment-bot', 'approved'),
('bengal-famine-1943', 'Bengal Famine of 1943 — 2 to 3 Million Dead', '1943-01-01', '1944-06-30', 1943, false, 'natural', ARRAY['famine','india','world-war-ii','british-empire'], 0.7, 'India / Bangladesh', 'British India', ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'asia', 'Bengal_famine_of_1943', 'A devastating famine killing 2–3 million. Caused by wartime disruption and British policies prioritizing military supplies.', 'enrichment-bot', 'approved'),
('great-chinese-famine-1959', 'Great Chinese Famine — Deadliest Famine in History', '1959-01-01', '1961-12-31', 1959, false, 'natural', ARRAY['famine','china','great-leap-forward','mao'], 0.85, 'China', 'People''s Republic of China', ST_SetSRID(ST_MakePoint(104.1954, 35.8617), 4326), 'asia', 'Great_Chinese_Famine', 'The deadliest famine in history, caused by Mao''s Great Leap Forward. 15–55 million dead.', 'enrichment-bot', 'approved'),
('laki-eruption-1783', 'Laki Eruption in Iceland — Crop Failures Across Europe', '1783-06-08', '1784-02-07', 1783, false, 'natural', ARRAY['volcano','eruption','iceland','climate'], 0.7, 'Iceland', 'Kingdom of Denmark-Norway', ST_SetSRID(ST_MakePoint(-18.2300, 64.0667), 4326), 'europe', 'Laki_(volcano)', 'An 8-month eruption producing toxic haze across Europe. ~6 million died from resulting famine. Possibly contributed to the French Revolution.', 'enrichment-bot', 'approved'),
('mount-st-helens-1980', 'Mount St. Helens Eruption', '1980-05-18', '1980-05-18', 1980, false, 'natural', ARRAY['volcano','eruption','united-states'], 0.55, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-122.1965, 46.1914), 4326), 'north_america', 'Mount_St._Helens', 'The most significant modern US volcanic eruption. Destroyed 600 sq km of forest, killed 57 people.', 'enrichment-bot', 'approved'),
('lisbon-earthquake-1755', '1755 Lisbon Earthquake', '1755-11-01', '1755-11-01', 1755, false, 'natural', ARRAY['earthquake','tsunami','portugal'], 0.8, 'Portugal', 'Kingdom of Portugal', ST_SetSRID(ST_MakePoint(-9.1393, 38.7223), 4326), 'europe', '1755_Lisbon_earthquake', 'A magnitude 8.5–9.0 earthquake, tsunami, and fire that destroyed Lisbon. Killed 30,000–60,000 and challenged Enlightenment optimism, influencing Voltaire''s Candide.', 'enrichment-bot', 'approved'),
('great-kanto-earthquake-1923', '1923 Great Kanto Earthquake — 140,000 Dead', '1923-09-01', '1923-09-03', 1923, false, 'natural', ARRAY['earthquake','fire','japan','tokyo'], 0.75, 'Japan', 'Empire of Japan', ST_SetSRID(ST_MakePoint(139.6917, 35.6895), 4326), 'asia', 'Great_Kant%C5%8D_earthquake', 'A magnitude 7.9 earthquake devastating Tokyo and Yokohama. ~140,000 dead, mostly from firestorms.', 'enrichment-bot', 'approved'),
('year-without-summer-1816', 'Year Without a Summer — Global Crop Failures', '1816-01-01', '1816-12-31', 1816, false, 'natural', ARRAY['climate','volcano','famine','tambora'], 0.7, 'Global', 'Post-Napoleonic Era', ST_SetSRID(ST_MakePoint(-3.4360, 55.3781), 4326), 'europe', 'Year_Without_a_Summer', 'Caused by Tambora, global temps dropped 0.4–0.7°C causing crop failures and famine. Inspired Mary Shelley''s Frankenstein.', 'enrichment-bot', 'approved'),
('great-smog-london-1952', 'Great Smog of London — 12,000 Dead', '1952-12-05', '1952-12-09', 1952, false, 'natural', ARRAY['pollution','environment','london','clean-air'], 0.65, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326), 'europe', 'Great_Smog_of_London', 'Killed ~12,000 people. Led to the Clean Air Act 1956, one of the first major environmental laws.', 'enrichment-bot', 'approved'),
('ozone-hole-discovered-1985', 'Ozone Hole Discovered Over Antarctica', '1985-05-01', '1985-05-31', 1985, false, 'natural', ARRAY['environment','ozone','antarctica','science'], 0.65, 'Antarctica', 'Cold War Era', ST_SetSRID(ST_MakePoint(0.0, -90.0), 4326), 'antarctica', 'Ozone_depletion', 'Discovery of the ozone hole led to the 1987 Montreal Protocol, the most successful international environmental agreement.', 'enrichment-bot', 'approved')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS (each independent, with c.id != e.id guard)
-- ============================================================

-- Tambora → Year Without a Summer
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Tambora ejected sulfur dioxide into the stratosphere, causing the Year Without a Summer.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'tambora-eruption-year-without-summer-1815' AND e.slug = 'year-without-summer-1816' AND c.id != e.id
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Laki → French Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'Laki eruption caused European crop failures, contributing to food shortages that fueled the French Revolution.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%French Revolution%' AND year_approx BETWEEN 1789 AND 1790 AND id != c.id LIMIT 1) e WHERE c.slug = 'laki-eruption-1783'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Little Ice Age → Black Death
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'Little Ice Age crop failures weakened immune systems, amplifying the Black Death.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'little-ice-age-begins-1350' AND e.slug = 'black-death-arrives-europe' AND c.id != e.id
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- SARS → COVID
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.5, 'SARS prompted disease surveillance and coronavirus research that informed the COVID-19 response.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'sars-outbreak-2003' AND e.slug = 'covid-19-pandemic-2020' AND c.id != e.id
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Plague of Cyprian → Crisis of Third Century
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The Plague of Cyprian weakened Roman military capacity, contributing to the Crisis of the Third Century.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%Crisis%Third%' AND id != c.id LIMIT 1) e WHERE c.slug = 'plague-of-cyprian-249'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Lisbon earthquake → Enlightenment thought
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The Lisbon earthquake challenged Enlightenment optimism, influencing Voltaire and Kant.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%Enlightenment%' AND id != c.id LIMIT 1) e WHERE c.slug = 'lisbon-earthquake-1755'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Chernobyl → Soviet collapse
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'Chernobyl exposed Soviet incompetence, accelerating glasnost and undermining trust in the system.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE (title LIKE '%Soviet Union%' OR title LIKE '%USSR%') AND (title LIKE '%Fall%' OR title LIKE '%Dissolution%' OR title LIKE '%Collapse%') AND id != c.id LIMIT 1) e WHERE c.slug = 'chernobyl-nuclear-disaster-1986'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Bengal Famine 1943 → Indian independence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'The Bengal Famine fueled anti-British sentiment and the Indian independence movement.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%Indian Independence%' AND id != c.id LIMIT 1) e WHERE c.slug = 'bengal-famine-1943'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Great Chinese Famine → Cultural Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The famine discredited the Great Leap Forward, causing Mao to lose influence — reversed via the Cultural Revolution.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%Cultural Revolution%' AND id != c.id LIMIT 1) e WHERE c.slug = 'great-chinese-famine-1959'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Black Death → Renaissance
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The Black Death disrupted feudalism and created conditions contributing to the Renaissance.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%Renaissance%' AND year_approx BETWEEN 1350 AND 1500 AND id != c.id LIMIT 1) e WHERE c.slug = 'black-death-arrives-europe'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Holodomor → Soviet dissolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.5, 'The Holodomor became central to Ukrainian identity and fueled desire for independence.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE (title LIKE '%Soviet%' AND (title LIKE '%Dissolution%' OR title LIKE '%Collapse%' OR title LIKE '%Fall%')) AND id != c.id LIMIT 1) e WHERE c.slug = 'holodomor-ukraine-1932'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Antonine Plague → Fall of Rome
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'The Antonine Plague killed 5 million, weakening frontier defenses and contributing to Rome''s decline.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE (title LIKE '%Fall of Rome%' OR title LIKE '%Fall of the Western%') AND id != c.id LIMIT 1) e WHERE c.slug = 'antonine-plague-roman-empire'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Justinianic Plague → Arab Conquests
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The plague weakened Byzantine military power, enabling rapid Arab conquests of the 7th century.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE (title LIKE '%Arab%Conquest%' OR title LIKE '%Islamic%Conquest%' OR title LIKE '%Muslim%Conquest%') AND id != c.id LIMIT 1) e WHERE c.slug = 'plague-of-justinian-541'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- Spanish Flu → public health institutions
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The 1918 pandemic spurred creation of public health ministries and international health cooperation.', 'enrichment-bot', 'approved'
FROM events c CROSS JOIN LATERAL (SELECT id FROM events WHERE title LIKE '%League of Nations%' AND id != c.id LIMIT 1) e WHERE c.slug = 'spanish-flu-pandemic-1918-1919'
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;
