-- enrich_renaissance_gaps.sql
-- Fills remaining gaps in 1400-1600 CE period
-- Uses ON CONFLICT (slug) DO NOTHING since slug is the unique constraint

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_modern, event_category, geo_era_label, importance_score, geo_point, region, created_by, review_status)
VALUES
-- War of the Roses / Tudor
('war-of-roses-ends-tudor-dynasty-1485', 'War of the Roses Ends — Tudor Dynasty Begins', '1485-08-22', '1485-08-22', 1485, 'England, United Kingdom', 'political', 'Late Medieval England', 0.80, ST_SetSRID(ST_MakePoint(-1.396, 52.636), 4326), 'Europe', 'seed-script', 'approved'),

-- Lorenzo de' Medici
('lorenzo-de-medici-florentine-renaissance-1469', 'Lorenzo de'' Medici — The Magnificent and Florentine Golden Age', '1469-01-01', '1492-04-08', 1469, 'Florence, Italy', 'cultural', 'Italian Renaissance', 0.82, ST_SetSRID(ST_MakePoint(11.255, 43.771), 4326), 'Europe', 'seed-script', 'approved'),

-- Amerigo Vespucci
('vespucci-naming-of-america-1507', 'Amerigo Vespucci and the Naming of America', '1507-04-25', '1507-04-25', 1507, 'Saint-Dié-des-Vosges, France', 'exploration', 'Age of Exploration', 0.78, ST_SetSRID(ST_MakePoint(-73.935, 40.730), 4326), 'Americas', 'seed-script', 'approved'),

-- Battle of Mohács
('battle-of-mohacs-1526', 'Battle of Mohács — Ottomans Defeat Hungary', '1526-08-29', '1526-08-29', 1526, 'Mohács, Hungary', 'military', 'Ottoman Expansion', 0.75, ST_SetSRID(ST_MakePoint(18.680, 45.999), 4326), 'Europe', 'seed-script', 'approved'),

-- Ivan the Terrible
('ivan-terrible-russian-tsardom-1547', 'Ivan the Terrible — Russian Tsardom Founded', '1547-01-16', '1547-01-16', 1547, 'Moscow, Russia', 'political', 'Early Modern Russia', 0.80, ST_SetSRID(ST_MakePoint(37.618, 55.751), 4326), 'Europe', 'seed-script', 'approved'),

-- Shakespeare born
('shakespeare-born-1564', 'William Shakespeare Born — Greatest English Writer', '1564-04-26', '1564-04-26', 1564, 'Stratford-upon-Avon, England', 'cultural', 'Elizabethan England', 0.82, ST_SetSRID(ST_MakePoint(-1.707, 52.192), 4326), 'Europe', 'seed-script', 'approved'),

-- Galileo born
('galileo-born-1564', 'Galileo Galilei Born — Father of Modern Science', '1564-02-15', '1564-02-15', 1564, 'Pisa, Italy', 'scientific', 'Scientific Revolution', 0.82, ST_SetSRID(ST_MakePoint(10.401, 43.723), 4326), 'Europe', 'seed-script', 'approved'),

-- Portuguese slave trade begins
('portuguese-slave-trade-begins-1441', 'Portuguese Slave Trade Begins on African Coast', '1441-01-01', '1441-12-31', 1441, 'West Africa', 'economic', 'Age of Exploration', 0.78, ST_SetSRID(ST_MakePoint(-15.180, 20.166), 4326), 'Africa', 'seed-script', 'approved'),

-- Songhai under Sunni Ali
('songhai-empire-sunni-ali-1464', 'Songhai Empire at Peak Under Sunni Ali', '1464-01-01', '1492-12-31', 1464, 'Gao, Mali', 'political', 'West African Empires', 0.75, ST_SetSRID(ST_MakePoint(0.044, 16.272), 4326), 'Africa', 'seed-script', 'approved'),

-- Nobunaga unifies Japan
('nobunaga-unifies-japan-1568', 'Oda Nobunaga Begins Unification of Japan', '1568-01-01', '1582-06-21', 1568, 'Kyoto, Japan', 'political', 'Sengoku Japan', 0.78, ST_SetSRID(ST_MakePoint(135.768, 35.012), 4326), 'East Asia', 'seed-script', 'approved'),

-- Portuguese reach Japan
('portuguese-reach-japan-1543', 'Portuguese Reach Japan — Firearms Introduced', '1543-01-01', '1543-12-31', 1543, 'Tanegashima, Japan', 'exploration', 'Age of Exploration', 0.75, ST_SetSRID(ST_MakePoint(131.000, 30.733), 4326), 'East Asia', 'seed-script', 'approved'),

-- Manila founded
('manila-founded-spanish-philippines-1571', 'Manila Founded — Spanish Colonize Philippines', '1571-06-24', '1571-06-24', 1571, 'Manila, Philippines', 'political', 'Age of Exploration', 0.72, ST_SetSRID(ST_MakePoint(120.984, 14.599), 4326), 'Southeast Asia', 'seed-script', 'approved'),

-- Italian Wars
('italian-wars-begin-1494', 'Italian Wars Begin — France Invades Italy', '1494-09-02', '1494-09-02', 1494, 'Naples, Italy', 'military', 'Italian Renaissance', 0.70, ST_SetSRID(ST_MakePoint(14.268, 40.852), 4326), 'Europe', 'seed-script', 'approved'),

-- Charles V Habsburg
('charles-v-habsburg-empire-1519', 'Charles V Elected — Habsburg Empire at Its Height', '1519-06-28', '1519-06-28', 1519, 'Aachen, Germany', 'political', 'Early Modern Europe', 0.78, ST_SetSRID(ST_MakePoint(6.084, 50.776), 4326), 'Europe', 'seed-script', 'approved')

ON CONFLICT (slug) DO NOTHING;

-- Recompute network_y for all events in range
UPDATE events SET network_y = (importance_score * 100) WHERE year_approx BETWEEN 1400 AND 1600 AND (network_y IS NULL OR network_y != importance_score * 100);

-- Add causality links for key chains
-- Gutenberg → Reformation chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Printing press enabled rapid spread of Luther''s ideas and vernacular Bible', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Gutenberg%Printing Press%' AND c.year_approx = 1440
AND e.title ILIKE '%Martin Luther%95 Theses%' AND e.year_approx = 1517
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Protestant Reformation led to English break with Rome', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Martin Luther%95 Theses%' AND c.year_approx = 1517
AND e.title ILIKE '%Henry VIII Breaks with Rome%' AND e.year_approx = 1534
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Reformation culture of questioning authority contributed to scientific revolution', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Martin Luther%95 Theses%' AND c.year_approx = 1517
AND e.title ILIKE '%Copernicus%Heliocentric%' AND e.year_approx = 1543
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Columbus → Columbian Exchange → demographic collapse
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Columbus''s voyage initiated the Columbian Exchange of crops, animals, and diseases', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title = 'Columbus Reaches the Americas' AND c.year_approx = 1492
AND e.title ILIKE '%Columbian Exchange%' AND e.year_approx BETWEEN 1494 AND 1500
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Columbian Exchange diseases (smallpox) devastated indigenous populations', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Columbian Exchange%' AND c.year_approx BETWEEN 1494 AND 1500
AND e.title ILIKE '%Smallpox%Tenochtitlan%' AND e.year_approx = 1520
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Fall of Constantinople → Renaissance scholars flee to Italy
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.75, 'Fall of Constantinople drove Greek scholars to Italy, fueling the Renaissance', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title = 'Fall of Constantinople' AND c.year_approx = 1453
AND e.title ILIKE '%Florentine Renaissance%Medici%' AND e.year_approx BETWEEN 1450 AND 1470
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Gutenberg → Copernicus (printing enabled scientific dissemination)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Printing press enabled wide dissemination of scientific works', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Gutenberg%Printing Press%' AND c.year_approx = 1440
AND e.title ILIKE '%Copernicus%Heliocentric%' AND e.year_approx = 1543
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Ottoman conquest → Siege of Vienna
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Ottoman conquest of Hungary at Mohács opened path to Vienna', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Mohács%' AND c.year_approx = 1526
AND e.title ILIKE '%Siege of Vienna%' AND e.year_approx = 1529
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Dias → da Gama
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Dias rounding Cape of Good Hope proved sea route to India was possible', 'seed-script', 'approved'
FROM events c, events e
WHERE c.title ILIKE '%Dias%Cape%Good Hope%' AND c.year_approx = 1488
AND e.title ILIKE '%Vasco da Gama%India%' AND e.year_approx = 1498
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
