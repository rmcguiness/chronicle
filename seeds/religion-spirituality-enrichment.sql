-- Religion & Spirituality History Enrichment
-- Added 2026-03-20

-- ============================================
-- RELIGION & SPIRITUALITY EVENTS
-- ============================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, article_summary, wikipedia_slug, created_by, review_status)
VALUES

-- ANCIENT RELIGIONS
('roman-imperial-cult-established', 'Roman Imperial Cult Established Under Augustus', '0001-01-01', '0001-12-31', -27, true, 'religion', ARRAY['roman empire','religion','imperial cult','ancient rome'], 0.6, 'Italy', 'Roman Empire', ST_SetSRID(ST_MakePoint(12.4964, 41.9028), 4326), 'Augustus established the Imperial Cult, blending political authority with religious veneration. Emperors were worshipped as divine or semi-divine figures, reinforcing the legitimacy of Roman rule across the empire.', 'Imperial_cult_(ancient_Rome)', 'seed-enrichment', 'approved'),

-- CHRISTIANITY
('augustine-city-of-god', 'Augustine of Hippo Writes City of God', '0413-01-01', '0426-12-31', 413, false, 'religion', ARRAY['christianity','philosophy','theology','late antiquity'], 0.7, 'Algeria', 'Roman North Africa', ST_SetSRID(ST_MakePoint(7.7667, 36.8833), 4326), 'Saint Augustine of Hippo wrote "The City of God" in response to the sack of Rome, articulating a Christian philosophy of history that profoundly shaped Western theology and political thought for over a millennium.', 'The_City_of_God', 'seed-enrichment', 'approved'),

('second-great-awakening', 'Second Great Awakening — American Religious Revival', '1790-01-01', '1840-12-31', 1800, false, 'religion', ARRAY['christianity','protestantism','revival','united states'], 0.65, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-84.2700, 37.8393), 4326), 'The Second Great Awakening was a Protestant religious revival movement in the United States from the 1790s to the 1840s. It fueled the growth of Baptist and Methodist denominations, camp meetings, and social reform movements including abolitionism and temperance.', 'Second_Great_Awakening', 'seed-enrichment', 'approved'),

-- ISLAM
('sufism-emerges', 'Sufism Emerges — Mystical Tradition Within Islam', '0750-01-01', '0850-12-31', 800, false, 'religion', ARRAY['islam','sufism','mysticism','middle east'], 0.65, 'Iraq', 'Abbasid Caliphate', ST_SetSRID(ST_MakePoint(44.3661, 33.3152), 4326), 'Sufism emerged as the mystical dimension of Islam, emphasizing inner spiritual experience, love of God, and asceticism. Early Sufis like Rabia al-Adawiyya and al-Junayd established traditions of devotional practice that spread across the Islamic world.', 'Sufism', 'seed-enrichment', 'approved'),

-- HINDUISM & DHARMIC
('bhagavad-gita-composed', 'Bhagavad Gita Composed — Hindu Sacred Text', '0001-01-01', '0001-12-31', -300, true, 'religion', ARRAY['hinduism','sacred text','philosophy','india'], 0.8, 'India', 'Ancient India', ST_SetSRID(ST_MakePoint(76.9726, 29.0588), 4326), 'The Bhagavad Gita, a 700-verse Hindu scripture that is part of the Mahabharata, was composed around 300-200 BCE. It presents a synthesis of Hindu ideas about dharma, theism, and yoga through the dialogue between Prince Arjuna and Lord Krishna.', 'Bhagavad_Gita', 'seed-enrichment', 'approved'),

-- BUDDHISM SPREADS
('buddhism-reaches-japan', 'Buddhism Reaches Japan — Introduction via Korea', '0552-01-01', '0552-12-31', 552, false, 'religion', ARRAY['buddhism','japan','korea','cultural exchange'], 0.7, 'Japan', 'Yamato Japan', ST_SetSRID(ST_MakePoint(135.7681, 34.6851), 4326), 'Buddhism was officially introduced to Japan in 552 CE when the King of Baekje (Korea) sent Buddhist texts and a statue of the Buddha to the Japanese court. This began a transformation of Japanese culture, art, and governance.', 'Buddhism_in_Japan', 'seed-enrichment', 'approved'),

('zen-buddhism-emerges-china', 'Zen Buddhism Emerges in China (Chan Buddhism)', '0520-01-01', '0650-12-31', 600, false, 'religion', ARRAY['buddhism','zen','chan','china','meditation'], 0.65, 'China', 'Sui/Tang China', ST_SetSRID(ST_MakePoint(112.5558, 34.6202), 4326), 'Chan (Zen) Buddhism emerged in China, traditionally attributed to Bodhidharma''s arrival around 520 CE. Emphasizing meditation and direct insight over scriptural study, it became one of the most influential Buddhist traditions, later spreading to Korea, Japan, and Vietnam.', 'Chan_Buddhism', 'seed-enrichment', 'approved'),

('tibetan-buddhism-established', 'Tibetan Buddhism Established Under Songtsen Gampo', '0641-01-01', '0641-12-31', 641, false, 'religion', ARRAY['buddhism','tibet','songtsen gampo','himalaya'], 0.65, 'China', 'Tibetan Empire', ST_SetSRID(ST_MakePoint(91.1320, 29.6500), 4326), 'King Songtsen Gampo established Buddhism in Tibet after marrying the Nepalese princess Bhrikuti and Chinese princess Wencheng, both Buddhists. He built the Jokhang Temple in Lhasa, laying the foundation for Tibetan Buddhist civilization.', 'Tibetan_Buddhism', 'seed-enrichment', 'approved'),

-- MODERN
('mormon-church-founded', 'Church of Jesus Christ of Latter-day Saints Founded', '1830-04-06', '1830-04-06', 1830, false, 'religion', ARRAY['mormonism','joseph smith','restoration','united states'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-76.4413, 42.8864), 4326), 'Joseph Smith founded the Church of Jesus Christ of Latter-day Saints in Fayette, New York, based on the Book of Mormon which he said was translated from golden plates. The church grew rapidly and eventually established its center in Salt Lake City, Utah.', 'The_Church_of_Jesus_Christ_of_Latter-day_Saints', 'seed-enrichment', 'approved'),

('bahai-faith-founded', 'Bahá''í Faith Founded by the Báb', '1844-05-23', '1844-05-23', 1844, false, 'religion', ARRAY['bahai','persia','iran','new religious movement'], 0.65, 'Iran', 'Qajar Persia', ST_SetSRID(ST_MakePoint(52.5311, 29.5918), 4326), 'The Báb declared his mission in Shiraz, Persia, founding the Bábí movement which evolved into the Bahá''í Faith under Bahá''u''lláh. The religion emphasizes the unity of God, religion, and humanity, and has spread worldwide.', 'Bah%C3%A1%27%C3%AD_Faith', 'seed-enrichment', 'approved'),

('vatican-i-papal-infallibility', 'First Vatican Council — Papal Infallibility Declared', '1869-12-08', '1870-10-20', 1870, false, 'religion', ARRAY['catholicism','pope','papal infallibility','vatican'], 0.65, 'Vatican City', 'Papal States', ST_SetSRID(ST_MakePoint(12.4534, 41.9029), 4326), 'The First Vatican Council, convened by Pope Pius IX, declared the dogma of papal infallibility — that the Pope is preserved from error when defining matters of faith and morals ex cathedra. The council was suspended due to the Franco-Prussian War.', 'First_Vatican_Council', 'seed-enrichment', 'approved'),

('worlds-parliament-religions-1893', 'World''s Parliament of Religions', '1893-09-11', '1893-09-27', 1893, false, 'religion', ARRAY['interfaith','hinduism','buddhism','world religions','chicago'], 0.6, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), 'The World''s Parliament of Religions, held in Chicago as part of the World''s Columbian Exposition, was the first formal gathering of representatives of Eastern and Western spiritual traditions. Swami Vivekananda''s speech introduced Hinduism to America.', 'Parliament_of_the_World%27s_Religions', 'seed-enrichment', 'approved'),

('vatican-ii-reforms', 'Second Vatican Council — Catholic Church Modernizes', '1962-10-11', '1965-12-08', 1962, false, 'religion', ARRAY['catholicism','pope john xxiii','reform','ecumenism'], 0.75, 'Vatican City', 'Vatican City', ST_SetSRID(ST_MakePoint(12.4534, 41.9029), 4326), 'The Second Vatican Council (Vatican II), convened by Pope John XXIII, modernized the Catholic Church. Reforms included Mass in vernacular languages, ecumenical outreach, and declarations on religious freedom and interfaith dialogue.', 'Second_Vatican_Council', 'seed-enrichment', 'approved')

ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CAUSALITY LINKS
-- ============================================

-- Helper: use subqueries to get event IDs by slug or title pattern

-- Muhammad's Death → Sunni-Shia Split (Battle of Karbala)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Muhammad''s death without clear succession led to the dispute that culminated in the Battle of Karbala and permanent Sunni-Shia division', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'death-prophet-muhammad' AND e.title LIKE '%Karbala%Sunni-Shia%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Try alternate slug patterns for Muhammad's death
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Muhammad''s death without clear succession led to the Sunni-Shia split', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%death%prophet muhammad%' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%karbala%' LIMIT 1) e
WHERE NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Buddhism founded → Ashoka spreads Buddhism
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Siddhartha Gautama founding Buddhism was prerequisite for Ashoka''s conversion and subsequent spread of Buddhism', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%siddhartha%enlightenment%buddhism%' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%ashoka%rock edict%' OR LOWER(title) LIKE '%ashoka%buddhis%' ORDER BY year_approx LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Ashoka spreads Buddhism → Buddhism reaches China
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Ashoka''s missionary efforts spread Buddhism beyond India, eventually reaching China via the Silk Road', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%ashoka%rock edict%' OR LOWER(title) LIKE '%ashoka%buddhis%' ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%buddhism%silk road%china%' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Buddhism reaches China → Zen Buddhism emerges
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Buddhism''s arrival in China was the foundation for the development of Chan (Zen) Buddhism', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%buddhism%silk road%china%' LIMIT 1) c,
     (SELECT id FROM events WHERE slug = 'zen-buddhism-emerges-china' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Zen Buddhism in China → Zen in Japan
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Chan Buddhism from China was transmitted to Japan, becoming Zen Buddhism', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE slug = 'zen-buddhism-emerges-china' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%zen buddhism%japan%' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Buddhism reaches Japan (552) → Zen in Japan
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The introduction of Buddhism to Japan in 552 CE prepared the ground for Zen Buddhism''s later flourishing', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE slug = 'buddhism-reaches-japan' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%zen buddhism%japan%' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Protestant Reformation → Peace of Westphalia
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The Protestant Reformation triggered the Wars of Religion that were resolved by the Peace of Westphalia, establishing religious tolerance', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%luther%95 theses%' OR LOWER(title) LIKE '%luther%ninety-five%' ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%peace of westphalia%' ORDER BY year_approx LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Council of Nicaea → Christianity state religion
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'The Council of Nicaea unified Christian doctrine, paving the way for Christianity to become the Roman state religion under Theodosius', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%council of nicaea%' ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%theodosius%state religion%' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Christianity state religion → Great Schism
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'The establishment of Christianity as state religion led to institutional growth and theological disputes that culminated in the Great Schism', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%theodosius%state religion%' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%great schism%east%west%' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Great Schism → First Crusade
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'The Great Schism''s East-West division was a backdrop to the First Crusade, as Byzantium sought Western military aid', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%great schism%east%west%' LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%first crusade%pope urban%' OR LOWER(title) LIKE '%first crusade%call to arms%' ORDER BY year_approx LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hijra → Conquest of Mecca
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The Hijra to Medina allowed Muhammad to build a political and military base, leading to the Conquest of Mecca', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE slug LIKE '%hijra%' OR (LOWER(title) LIKE '%hijra%medina%') ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%conquest of mecca%' ORDER BY year_approx LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Conquest of Mecca → Death of Muhammad / Rashidun Caliphate
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'The Conquest of Mecca unified Arabia under Islam, and Muhammad''s death shortly after led to the establishment of the Rashidun Caliphate', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%conquest of mecca%' ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE LOWER(title) LIKE '%rashidun caliphate%' ORDER BY year_approx LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Abbasid Caliphate → Sufism emerges
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The cosmopolitan culture of the Abbasid Caliphate provided the intellectual environment for Sufism to emerge and flourish', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE LOWER(title) LIKE '%abbasid%golden age%' OR LOWER(title) LIKE '%abbasid caliphate founded%' ORDER BY year_approx LIMIT 1) c,
     (SELECT id FROM events WHERE slug = 'sufism-emerges' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Second Great Awakening → Mormon Church
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The religious ferment of the Second Great Awakening in upstate New York (the "Burned-over District") provided the context for Joseph Smith''s founding of Mormonism', 'seed-enrichment', 'approved'
FROM (SELECT id FROM events WHERE slug = 'second-great-awakening' LIMIT 1) c,
     (SELECT id FROM events WHERE slug = 'mormon-church-founded' LIMIT 1) e
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
