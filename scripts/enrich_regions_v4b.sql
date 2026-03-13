-- Regional enrichment v4b: Additional events to reach ~70 total
-- More Latin America colonial/independence, Africa, and SE Asia

BEGIN;

INSERT INTO events (slug, title, article_summary, year_approx, date_earliest, date_latest, is_bce, geo_point, geo_modern, geo_era_label, event_category, importance_score, wikipedia_slug, created_by, review_status, tags)
VALUES

-- Latin America additions
('gran-colombia-dissolution-1830', 'Dissolution of Gran Colombia — Bolívar''s Dream Collapses',
 'Gran Colombia, Bolívar''s vision of a united South American republic, fractured into Venezuela, Ecuador, and New Granada (Colombia) in 1830. Bolívar died later that year, disillusioned, warning that Latin America''s independence leaders had "plowed the sea." The dissolution set the pattern of fragmented nation-states that characterizes the region today.',
 1830, '1830-05-06', '1830-12-17', false,
 ST_SetSRID(ST_MakePoint(-74.07, 4.71), 4326), 'Bogotá, Colombia', 'Post-Independence South America', 'political', 0.6, 'Dissolution_of_Gran_Colombia', 'seed-script:regional-enrichment-v4', 'pending', '{bolivar,fragmentation,independence,gran-colombia}'),

('tenochtitlan-market-tlatelolco-1470', 'Tlatelolco Market — Largest in the Pre-Columbian Americas',
 'The great market of Tlatelolco in the Aztec capital served up to 60,000 people daily, astonishing Spanish conquistadors who compared it favorably to the markets of Constantinople and Rome. The market operated under strict commercial law with judges settling disputes, reflecting the sophisticated economic organization of the Aztec Triple Alliance.',
 1470, '1470-01-01', '1470-12-31', false,
 ST_SetSRID(ST_MakePoint(-99.14, 19.45), 4326), 'Tlatelolco, Mexico City, Mexico', 'Aztec Empire', 'economic', 0.6, 'Tlatelolco_(altepetl)', 'seed-script:regional-enrichment-v4', 'pending', '{aztec,market,trade,economy}'),

('quipu-inca-administration-1450', 'Inca Quipu System — Record-Keeping Without Writing',
 'The Inca Empire administered its vast territory of 10 million people using quipus — knotted string devices encoding numerical and possibly narrative information. This unique record-keeping system enabled tax collection, census data, and historical records across the largest empire in pre-Columbian America, all without a conventional writing system.',
 1450, '1450-01-01', '1450-12-31', false,
 ST_SetSRID(ST_MakePoint(-71.97, -13.52), 4326), 'Cusco, Peru', 'Inca Empire (Tawantinsuyu)', 'cultural', 0.6, 'Quipu', 'seed-script:regional-enrichment-v4', 'pending', '{inca,record-keeping,administration,quipu}'),

('olmec-san-lorenzo-colossal-heads-1400', 'Olmec Colossal Heads at San Lorenzo — Mesoamerica''s First Great Art',
 'The Olmec civilization created at least 17 colossal stone heads, some weighing over 40 tons, at sites like San Lorenzo beginning around 1400 BCE. These monumental basalt portraits, transported from quarries up to 80 km away, represent the earliest major works of art in Mesoamerica and likely depict Olmec rulers.',
 -1400, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(-94.75, 17.75), 4326), 'San Lorenzo Tenochtitlán, Veracruz, Mexico', 'Formative Period Mesoamerica', 'cultural', 0.65, 'Olmec_colossal_heads', 'seed-script:regional-enrichment-v4', 'pending', '{olmec,sculpture,monument,mesoamerica}'),

-- Africa additions
('kanem-empire-900', 'Kanem Empire — Trans-Saharan Power in Central Africa',
 'The Kanem Empire, centered around Lake Chad, rose to prominence from the 9th century as a major node in trans-Saharan trade routes. Under the Sayfawa Dynasty — one of the longest-ruling dynasties in human history (c. 700–1846) — the empire converted to Islam and controlled vital trade between North Africa and the forest zones of West and Central Africa.',
 900, '0900-01-01', '0900-12-31', false,
 ST_SetSRID(ST_MakePoint(14.83, 12.10), 4326), 'Njimi, Chad', 'Medieval Central Africa', 'political', 0.6, 'Kanem_Empire', 'seed-script:regional-enrichment-v4', 'pending', '{kanem,trans-saharan,trade,islam}'),

('hausa-city-states-1000', 'Hausa City-States — West Africa''s Urban Centers',
 'The Hausa city-states of Kano, Katsina, Zaria, and others emerged as major centers of trade, craftsmanship, and Islamic learning from around 1000 CE. Their famous dyeing pits, leatherwork (''Morocco leather'' actually originated here), and textile production made them economic powerhouses, and their commercial networks extended from the Mediterranean to the forest belt.',
 1000, '1000-01-01', '1000-12-31', false,
 ST_SetSRID(ST_MakePoint(8.52, 12.0), 4326), 'Kano, Nigeria', 'Medieval West Africa', 'economic', 0.6, 'Hausa_Kingdoms', 'seed-script:regional-enrichment-v4', 'pending', '{hausa,trade,crafts,city-states}'),

('merina-kingdom-madagascar-1787', 'Merina Kingdom Unifies Madagascar Under Andrianampoinimerina',
 'King Andrianampoinimerina (r. 1787–1810) unified the central highlands of Madagascar under the Merina Kingdom, expanding from Ambohimanga to control the rice-rich Imerina region. His successors, particularly Radama I, would extend Merina rule over most of Madagascar, creating a sophisticated state with its own writing system before French colonization.',
 1787, '1787-01-01', '1810-12-31', false,
 ST_SetSRID(ST_MakePoint(47.56, -18.92), 4326), 'Antananarivo, Madagascar', 'Merina Kingdom', 'political', 0.55, 'Andrianampoinimerina', 'seed-script:regional-enrichment-v4', 'pending', '{madagascar,merina,unification,kingdom}'),

('ethiopian-solomonic-restoration-1270', 'Solomonic Dynasty Restored in Ethiopia',
 'Yekuno Amlak overthrew the Zagwe Dynasty in 1270, establishing the Solomonic Dynasty that claimed descent from King Solomon and the Queen of Sheba. This dynasty would rule Ethiopia for over 700 years until 1974, making it one of the longest-ruling royal houses in world history and anchoring Ethiopian national identity in its biblical mythology.',
 1270, '1270-01-01', '1270-12-31', false,
 ST_SetSRID(ST_MakePoint(39.47, 12.6), 4326), 'Amhara Region, Ethiopia', 'Medieval Ethiopia', 'political', 0.6, 'Solomonic_dynasty', 'seed-script:regional-enrichment-v4', 'pending', '{ethiopia,dynasty,solomonic,monarchy}'),

-- SE Asia additions
('gajah-mada-nusantara-oath-1336', 'Gajah Mada''s Palapa Oath — Vow to Unite the Archipelago',
 'Majapahit''s chief minister Gajah Mada swore the Palapa Oath in 1336, vowing to abstain from spiced food until he had brought all of Nusantara (the Indonesian archipelago) under Majapahit control. His military campaigns largely fulfilled this vow, and the Palapa Oath remains a foundational symbol of Indonesian national unity.',
 1336, '1336-01-01', '1336-12-31', false,
 ST_SetSRID(ST_MakePoint(112.75, -7.62), 4326), 'Trowulan, East Java, Indonesia', 'Majapahit Empire', 'political', 0.6, 'Gajah_Mada#Palapa_oath', 'seed-script:regional-enrichment-v4', 'pending', '{majapahit,oath,unification,indonesia}'),

('malacca-islamic-conversion-1414', 'Malacca Sultanate Converts to Islam — SE Asian Islamization',
 'The conversion of Malacca''s ruler Parameswara to Islam around 1414 marked a turning point in Southeast Asian religious history. As Malacca grew into the region''s greatest trading port, Islam spread through merchant networks to Java, Sumatra, Borneo, and the Philippines, fundamentally transforming the cultural landscape of maritime Southeast Asia.',
 1414, '1414-01-01', '1414-12-31', false,
 ST_SetSRID(ST_MakePoint(102.25, 2.2), 4326), 'Malacca, Malaysia', 'Malacca Sultanate', 'religious', 0.65, 'Malacca_Sultanate#Islamisation', 'seed-script:regional-enrichment-v4', 'pending', '{islam,malacca,conversion,trade}'),

('diponegoro-java-war-1825', 'Java War (Diponegoro War) — Last Major Javanese Resistance',
 'Prince Diponegoro led a five-year guerrilla war (1825–1830) against Dutch colonial rule in Java, mobilizing both Javanese aristocracy and peasantry in a movement blending anti-colonial sentiment with Islamic revivalism. The war cost 200,000 Javanese and 8,000 European lives, and its suppression consolidated Dutch control over Java for over a century.',
 1825, '1825-07-20', '1830-03-28', false,
 ST_SetSRID(ST_MakePoint(110.36, -7.8), 4326), 'Yogyakarta, Indonesia', 'Dutch Colonial Java', 'war', 0.6, 'Java_War', 'seed-script:regional-enrichment-v4', 'pending', '{resistance,dutch,colonial,java}'),

-- Pacific additions
('lapita-expansion-1500bce', 'Lapita People — Ancestors of the Polynesians',
 'The Lapita culture, identified by their distinctive dentate-stamped pottery, expanded from the Bismarck Archipelago into Remote Oceania beginning around 1500 BCE. These master navigators colonized Fiji, Tonga, and Samoa, establishing the ancestral population from which all Polynesian peoples descend.',
 -1500, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(167.0, -15.0), 4326), 'Vanuatu / Fiji / Tonga', 'Lapita Cultural Complex', 'cultural', 0.7, 'Lapita_culture', 'seed-script:regional-enrichment-v4', 'pending', '{lapita,pottery,navigation,polynesia}'),

('new-guinea-highlands-agriculture-7000', 'New Guinea Highlands — Independent Invention of Agriculture',
 'The highlands of New Guinea were one of the world''s independent centers of plant domestication, with evidence of taro and yam cultivation dating to around 7000 BCE. This demonstrates that agriculture arose independently in Oceania, parallel to developments in the Fertile Crescent, China, and Mesoamerica.',
 -7000, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(144.3, -5.8), 4326), 'Western Highlands, Papua New Guinea', 'Neolithic New Guinea', 'discovery', 0.65, 'Kuk_Swamp', 'seed-script:regional-enrichment-v4', 'pending', '{agriculture,independent-invention,neolithic,taro}'),

('micronesian-stick-charts-navigation', 'Micronesian Stick Charts — Ocean Wave Navigation',
 'Marshall Islanders developed an extraordinary navigation system using stick charts (mattang, meddo, rebbelib) that mapped ocean swell patterns rather than geographic features. This unique technology, developed over centuries, enabled precise inter-island navigation across vast stretches of open Pacific Ocean without instruments or written records.',
 1000, '1000-01-01', '1000-12-31', false,
 ST_SetSRID(ST_MakePoint(171.38, 7.09), 4326), 'Marshall Islands', 'Traditional Micronesia', 'discovery', 0.55, 'Marshall_Islands_stick_chart', 'seed-script:regional-enrichment-v4', 'pending', '{navigation,micronesia,ocean,technology}')

;

-- Additional causality links
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Battle of Carabobo sealed Venezuelan independence, leading to Gran Colombia''s brief unification then dissolution',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'battle-carabobo-1821' AND e.slug = 'gran-colombia-dissolution-1830'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7,
  'Kanem Empire''s trans-Saharan networks contributed to Hausa city-states'' commercial growth',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'kanem-empire-900' AND e.slug = 'hausa-city-states-1000'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Sokoto Caliphate''s jihad incorporated and transformed many Hausa city-states',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'hausa-city-states-1000' AND e.slug = 'sokoto-caliphate-1804'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Malacca''s conversion to Islam drove the Islamization of maritime Southeast Asia, undermining Hindu-Buddhist Majapahit',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'malacca-islamic-conversion-1414' AND e.slug = 'majapahit-decline-islamic-conversion-1500'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Lapita expansion established the ancestral population of Polynesia in Tonga and Samoa',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'lapita-expansion-1500bce' AND e.slug = 'polynesian-settlement-samoa-tonga'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7,
  'Solomonic restoration provided the dynasty that Lalibela''s Zagwe predecessors built the rock churches under',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'ethiopian-rock-churches-lalibela-1200' AND e.slug = 'ethiopian-solomonic-restoration-1270'
ON CONFLICT DO NOTHING;

COMMIT;
