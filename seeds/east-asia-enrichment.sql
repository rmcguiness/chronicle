-- East Asian History Enrichment — China, Japan, Korea
-- Fills gaps in dynasty transitions, cultural milestones, and Korean history

-- ============================================================
-- EVENTS
-- ============================================================

-- Northern Wei — Buddhism spreads in China
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('northern-wei-buddhism-386', 'Northern Wei Dynasty — Buddhism Transforms North China', '0386-01-01', '0534-12-31', false, 386, 'Northern Wei', 'Datong, China', 0.7, 'religious', 'seed-script:v2', 'east_asia', 'Northern_Wei', ST_SetSRID(ST_MakePoint(113.30, 40.08), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Western Jin reunifies China
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('western-jin-reunification-280', 'Western Jin Reunifies China — Brief Unity After Three Kingdoms', '0280-01-01', '0316-12-31', false, 280, 'Western Jin', 'Luoyang, China', 0.7, 'political', 'seed-script:v2', 'east_asia', 'Jin_dynasty_(266%E2%80%93420)', ST_SetSRID(ST_MakePoint(112.45, 34.62), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Yamato period — Imperial unification of Japan
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('yamato-period-250', 'Yamato Period — Imperial Unification of Japan', '0250-01-01', '0710-12-31', false, 250, 'Yamato Japan', 'Nara, Japan', 0.8, 'political', 'seed-script:v2', 'east_asia', 'Yamato_period', ST_SetSRID(ST_MakePoint(135.80, 34.69), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Genpei War — Rise of the samurai class
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('genpei-war-1180', 'Genpei War — Rise of the Samurai Class', '1180-01-01', '1185-12-31', false, 1180, 'Late Heian Japan', 'Japan', 0.75, 'military', 'seed-script:v2', 'east_asia', 'Genpei_War', ST_SetSRID(ST_MakePoint(135.19, 34.65), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Muromachi Shogunate — Ashikaga
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('muromachi-shogunate-1336', 'Muromachi Shogunate — Ashikaga Rule in Japan', '1336-01-01', '1573-12-31', false, 1336, 'Muromachi Japan', 'Kyoto, Japan', 0.7, 'political', 'seed-script:v2', 'east_asia', 'Muromachi_period', ST_SetSRID(ST_MakePoint(135.77, 35.01), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Joseon Dynasty founded
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('joseon-dynasty-1392', 'Joseon Dynasty Founded — Korea''s Longest Dynasty', '1392-01-01', '1897-12-31', false, 1392, 'Joseon Korea', 'Seoul, South Korea', 0.8, 'political', 'seed-script:v2', 'east_asia', 'Joseon', ST_SetSRID(ST_MakePoint(126.98, 37.57), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Hangul alphabet invented by King Sejong
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('hangul-invented-1443', 'Hangul Alphabet Invented by King Sejong', '1443-01-01', '1446-12-31', false, 1443, 'Joseon Korea', 'Seoul, South Korea', 0.75, 'cultural', 'seed-script:v2', 'east_asia', 'Hangul', ST_SetSRID(ST_MakePoint(126.98, 37.57), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Mongol invasions of Korea
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('mongol-invasions-korea-1231', 'Mongol Invasions of Korea — Goryeo Submits', '1231-01-01', '1259-12-31', false, 1231, 'Goryeo Korea', 'Korea', 0.7, 'military', 'seed-script:v2', 'east_asia', 'Mongol_invasions_of_Korea', ST_SetSRID(ST_MakePoint(126.98, 37.57), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Admiral Yi Sun-sin defeats Japanese navy
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('admiral-yi-sun-sin-1592', 'Admiral Yi Sun-sin Defeats Japanese Navy — Turtle Ships', '1592-01-01', '1598-12-31', false, 1592, 'Joseon Korea', 'Tongyeong, South Korea', 0.75, 'military', 'seed-script:v2', 'east_asia', 'Yi_Sun-sin', ST_SetSRID(ST_MakePoint(128.43, 34.85), 4326))
ON CONFLICT (slug) DO NOTHING;

-- South Korea economic miracle
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('south-korea-economic-miracle-1960', 'South Korea Economic Miracle — Miracle on the Han River', '1960-01-01', '1990-12-31', false, 1962, 'Republic of Korea', 'Seoul, South Korea', 0.7, 'economic', 'seed-script:v2', 'east_asia', 'Miracle_on_the_Han_River', ST_SetSRID(ST_MakePoint(126.98, 37.57), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Kangxi Emperor consolidation (check if already exists — it does, skip if conflict)
-- Already seeded as 'Kangxi Emperor — Qing Dynasty Golden Age'

-- Qianlong Emperor (already seeded)

-- China's population boom 1800
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('china-population-400m-1800', 'China''s Population Reaches 400 Million — Demographic Giant', '1800-01-01', '1800-12-31', false, 1800, 'Qing Dynasty', 'China', 0.65, 'social', 'seed-script:v2', 'east_asia', 'Demographics_of_China', ST_SetSRID(ST_MakePoint(116.40, 39.90), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Sino-Japanese War 1894 (check — already seeded as 'First Sino-Japanese War')

-- Japan colonization of Korea 1910 (already seeded as 'Japan Annexes Korea')

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Three Kingdoms → Western Jin reunification
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'The chaos of the Three Kingdoms period ended with Jin reunification under Sima Yan', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'three-kingdoms-period-220' AND e.slug = 'western-jin-reunification-280'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Genpei War → Kamakura Shogunate
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Minamoto victory in the Genpei War led directly to establishment of the Kamakura Shogunate', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'genpei-war-1180' AND e.slug = 'kamakura-shogunate-1185'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Mongol invasions of Korea → Tripitaka Koreana
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Goryeo carved the Tripitaka Koreana as spiritual defense against Mongol invasion', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'mongol-invasions-korea-1231' AND e.slug LIKE '%tripitaka-koreana%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Joseon Dynasty → Hangul invention
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Joseon stability and King Sejong''s patronage enabled creation of the Hangul alphabet', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'joseon-dynasty-1392' AND e.slug = 'hangul-invented-1443'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Yamato → Nara Period
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Yamato period centralization laid the foundation for the Nara permanent capital', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'yamato-period-250' AND e.title LIKE '%Nara Period%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Heian → Genpei War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Decline of Heian court authority and rise of warrior clans led to the Genpei War', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Heian Period Begins%' AND e.slug = 'genpei-war-1180'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Muromachi → Onin/Sengoku
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Ashikaga shogunate weakness led to the Ōnin War and Sengoku period', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'muromachi-shogunate-1336' AND e.title LIKE '%Sengoku%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Nobunaga → Sekigahara
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.75, 'Nobunaga''s unification campaigns set the stage for Tokugawa''s victory at Sekigahara', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Oda Nobunaga Begins Unification of Japan%' AND e.title LIKE '%Battle of Sekigahara%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Hideyoshi invades Korea → Admiral Yi
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Hideyoshi''s invasion of Korea provoked Admiral Yi Sun-sin''s legendary naval defense', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Hideyoshi Invades Korea%' AND e.slug = 'admiral-yi-sun-sin-1592'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Opium Wars → Taiping Rebellion
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.75, 'Qing humiliation in the Opium Wars destabilized the dynasty and contributed to the Taiping Rebellion', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%First Opium War — Beginning%' AND e.title LIKE '%Taiping Rebellion — Deadliest%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Taiping Rebellion → Republic of China
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The Taiping Rebellion fatally weakened the Qing dynasty, setting the stage for its eventual fall', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Taiping Rebellion — Deadliest%' AND e.title LIKE '%Republic of China Established%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Meiji Restoration → Sino-Japanese War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Meiji modernization built Japan''s military power, leading to victory over Qing China', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Meiji Restoration — Japan Modernizes%' AND e.title LIKE '%First Sino-Japanese War — Japan Defeats%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Sino-Japanese War → Russo-Japanese War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Japan''s victory over China emboldened its imperial ambitions, leading to confrontation with Russia', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%First Sino-Japanese War — Japan Defeats%' AND e.title LIKE '%Russo-Japanese War — First Asian%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Russo-Japanese War → Japan annexes Korea
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Victory over Russia gave Japan free hand to annex Korea in 1910', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Russo-Japanese War — First Asian%' AND e.title LIKE '%Japan Annexes Korea%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Japan annexes Korea → Korean War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Japanese colonial division of Korea set conditions for post-WWII partition and the Korean War', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Japan Annexes Korea%' AND e.title LIKE '%Korean War Armistice%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Korean War → South Korea economic miracle
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Post-Korean War US aid and Cold War strategic importance fueled South Korea''s economic transformation', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Korean War Armistice%' AND e.slug = 'south-korea-economic-miracle-1960'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Northern Wei → Buddhism in Tang
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Northern Wei patronage of Buddhism (Yungang/Longmen grottoes) established Buddhism as a major Chinese religion', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'northern-wei-buddhism-386' AND e.title LIKE '%Tang Dynasty — Golden Age%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Bi Sheng movable type → Song economic revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.65, 'Movable type printing accelerated knowledge dissemination during the Song economic boom', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Bi Sheng Invents Movable Type%' AND e.title LIKE '%Song Dynasty%Printing%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Ming ends voyages → European dominance of seas
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'China''s withdrawal from maritime exploration left the seas open for European colonial expansion', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE '%Ming Dynasty Ends Maritime Voyages%' AND e.title LIKE '%Portuguese Reach%Japan%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);
