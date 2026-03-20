-- South Asian History Enrichment — ~45 events + 15 causality links
-- Helper: for ancient events use year-01-01 to year-12-31 as date range

-- ANCIENT INDIA
INSERT INTO events (slug, title, year_approx, is_bce, date_earliest, date_latest, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug, created_by) VALUES
('indus-valley-civilization', 'Indus Valley Civilization — Harappa and Mohenjo-daro', -2600, true, '2600-01-01 BC', '2600-12-31 BC', 'One of the world''s earliest urban civilizations with advanced city planning, drainage, and standardized weights at Harappa and Mohenjo-daro.', 'civilization', 'south_asia', 0.85, 'Pakistan', 'Indus Valley Civilization', ST_SetSRID(ST_MakePoint(68.1375, 27.3244), 4326), 'Indus_Valley_Civilisation', 'enrichment_script'),
('aryan-migrations-vedic', 'Aryan Migrations — Vedic Culture Begins', -1500, true, '1500-01-01 BC', '1500-12-31 BC', 'Indo-Aryan peoples migrate into India, bringing Sanskrit and Vedic traditions forming the foundations of Hindu civilization.', 'migration', 'south_asia', 0.8, 'India', 'Vedic India', ST_SetSRID(ST_MakePoint(76.7794, 30.7333), 4326), 'Indo-Aryan_migrations'),
('rig-veda-composed', 'Rig Veda Composed', -1200, true, '1200-01-01 BC', '1200-12-31 BC', 'Oldest Vedic Sanskrit text with 1,028 hymns. Foundation of Hindu religious thought and among the oldest texts still in use.', 'cultural', 'south_asia', 0.75, 'India', 'Vedic India', ST_SetSRID(ST_MakePoint(76.0, 30.0), 4326), 'Rigveda'),
('upanishads-composed', 'Upanishads — Philosophical Revolution', -800, true, '0800-01-01 BC', '0800-12-31 BC', 'Introduce Brahman, Atman, karma, and moksha — moving beyond Vedic ritual toward metaphysical inquiry.', 'cultural', 'south_asia', 0.75, 'India', 'Late Vedic India', ST_SetSRID(ST_MakePoint(81.8463, 25.4358), 4326), 'Upanishads'),
('mahavira-jainism', 'Mahavira Founds Jainism', -540, true, '0540-01-01 BC', '0540-12-31 BC', 'Vardhamana Mahavira establishes Jainism emphasizing ahimsa, truth, and asceticism.', 'religion', 'south_asia', 0.7, 'India', 'Ancient India', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Mahavira'),
('buddha-buddhism', 'Siddhartha Gautama — Birth of Buddhism', -480, true, '0480-01-01 BC', '0480-12-31 BC', 'Siddhartha Gautama attains enlightenment, founding Buddhism with the Four Noble Truths and Eightfold Path.', 'religion', 'south_asia', 0.85, 'India', 'Ancient India', ST_SetSRID(ST_MakePoint(83.9778, 27.4833), 4326), 'Gautama_Buddha'),
('persian-gandhara', 'Persian Conquest of Gandhara', -519, true, '0519-01-01 BC', '0519-12-31 BC', 'Darius I conquers Gandhara, incorporating it into the Achaemenid Empire.', 'military', 'south_asia', 0.65, 'Pakistan', 'Achaemenid Gandhara', ST_SetSRID(ST_MakePoint(71.7889, 34.1688), 4326), 'Gandhara'),
('alexander-india', 'Alexander Invades India — Battle of the Hydaspes', -326, true, '0326-01-01 BC', '0326-12-31 BC', 'Alexander defeats King Porus but his troops refuse to advance further, forcing retreat.', 'military', 'south_asia', 0.8, 'Pakistan', 'Hellenistic Period', ST_SetSRID(ST_MakePoint(73.6, 32.9), 4326), 'Battle_of_the_Hydaspes'),
('chandragupta-maurya', 'Chandragupta Maurya Founds the Maurya Empire', -321, true, '0321-01-01 BC', '0321-12-31 BC', 'First empire to unify most of the Indian subcontinent, guided by advisor Chanakya.', 'empire', 'south_asia', 0.85, 'India', 'Maurya Empire', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Chandragupta_Maurya'),
('ashoka-buddhism', 'Ashoka Converts to Buddhism and Spreads It', -250, true, '0250-01-01 BC', '0250-12-31 BC', 'After the Kalinga War, Ashoka spreads dharma through edicts and sends missionaries to Sri Lanka and Southeast Asia.', 'religion', 'south_asia', 0.85, 'India', 'Maurya Empire', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Ashoka'),
('maurya-decline', 'Decline of the Maurya Empire', -185, true, '0185-01-01 BC', '0185-12-31 BC', 'Maurya Empire collapses after Emperor Brihadratha is assassinated. Shunga Dynasty replaces it.', 'political', 'south_asia', 0.65, 'India', 'Post-Maurya India', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Shunga_Empire'),
('sangam-literature', 'Tamil Sangam Literature Flourishes', -300, true, '0300-01-01 BC', '0300-12-31 BC', 'Rich Tamil literature documenting trade, warfare, and daily life in ancient southern India.', 'cultural', 'south_asia', 0.7, 'India', 'Sangam Period Tamil Nadu', ST_SetSRID(ST_MakePoint(78.1198, 9.9252), 4326), 'Sangam_literature'),
('satavahana-dynasty', 'Satavahana Dynasty — Deccan Trade Hub', -60, true, '0060-01-01 BC', '0060-12-31 BC', 'Controls the Deccan as a major Roman-South Asian trade hub, patronizing Buddhism and cave temples.', 'empire', 'south_asia', 0.7, 'India', 'Satavahana Deccan', ST_SetSRID(ST_MakePoint(75.3433, 19.8762), 4326), 'Satavahana_dynasty')
ON CONFLICT (slug) DO NOTHING;

-- CLASSICAL INDIA
INSERT INTO events (slug, title, year_approx, is_bce, date_earliest, date_latest, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug, created_by) VALUES
('kushan-empire', 'Kushan Empire — Silk Road Bridge', 78, false, '0078-01-01', '0078-12-31', 'Under Kanishka I, unifies northern India, Afghanistan, and Central Asia as a Silk Road link with Gandharan Buddhist art.', 'empire', 'south_asia', 0.75, 'Pakistan', 'Kushan Empire', ST_SetSRID(ST_MakePoint(71.7889, 34.1688), 4326), 'Kushan_Empire'),
('gupta-golden-age', 'Gupta Empire — Golden Age of India', 320, false, '0320-01-01', '0320-12-31', 'India''s Golden Age: zero, decimal system, Kalidasa''s literature, and extraordinary art.', 'empire', 'south_asia', 0.85, 'India', 'Gupta Empire', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Gupta_Empire'),
('nalanda-university', 'Nalanda University Founded', 427, false, '0427-01-01', '0427-12-31', 'World''s first residential university with 10,000 students studying philosophy, logic, mathematics, and medicine.', 'cultural', 'south_asia', 0.75, 'India', 'Gupta Empire', ST_SetSRID(ST_MakePoint(85.4427, 25.1357), 4326), 'Nalanda'),
('aryabhata-math', 'Aryabhata — Advances in Mathematics and Astronomy', 499, false, '0499-01-01', '0499-12-31', 'Introduces place-value system, approximates pi, proposes Earth''s rotation. Influences Islamic and European mathematics.', 'science', 'south_asia', 0.75, 'India', 'Gupta Empire', ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Aryabhata'),
('harsha-empire', 'Harsha Empire — Brief Reunification of North India', 606, false, '0606-01-01', '0606-12-31', 'Last reunification of northern India before the Islamic period, documented by Chinese pilgrim Xuanzang.', 'empire', 'south_asia', 0.7, 'India', 'Harsha Empire', ST_SetSRID(ST_MakePoint(76.9688, 29.9647), 4326), 'Harsha'),
('arab-conquest-sindh', 'Arab Conquest of Sindh', 712, false, '0712-01-01', '0712-12-31', 'Muhammad bin Qasim conquers Sindh, establishing the first permanent Muslim presence in South Asia.', 'military', 'south_asia', 0.75, 'Pakistan', 'Umayyad Sindh', ST_SetSRID(ST_MakePoint(68.3578, 25.3960), 4326), 'Muhammad_bin_Qasim'),
('chola-naval-empire', 'Chola Dynasty at Peak — Naval Empire', 1010, false, '1010-01-01', '1010-12-31', 'Rajendra Chola I builds a major naval power with expeditions to Southeast Asia and magnificent temples.', 'empire', 'south_asia', 0.75, 'India', 'Chola Empire', ST_SetSRID(ST_MakePoint(79.1378, 10.7870), 4326), 'Chola_dynasty'),
('prithviraj-chauhan', 'Prithviraj Chauhan — Last Hindu Emperor of Delhi', 1178, false, '1178-01-01', '1178-12-31', 'Last major Hindu ruler of Delhi. Victory at First Battle of Tarain temporarily halts Islamic advance.', 'political', 'south_asia', 0.7, 'India', 'Rajput India', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Prithviraj_III')
ON CONFLICT (slug) DO NOTHING;

-- DELHI SULTANATE & MUGHAL
INSERT INTO events (slug, title, year_approx, is_bce, date_earliest, date_latest, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug, created_by) VALUES
('ghurids-delhi-sultanate', 'Ghurids Defeat Prithviraj — Delhi Sultanate Begins', 1192, false, '1192-01-01', '1192-12-31', 'Muhammad of Ghor defeats Prithviraj at Second Tarain. Qutb ud-Din Aibak establishes the Delhi Sultanate.', 'military', 'south_asia', 0.8, 'India', 'Delhi Sultanate', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Battle_of_Tarain'),
('ibn-battuta-delhi', 'Ibn Battuta Visits Delhi', 1333, false, '1333-01-01', '1333-12-31', 'Moroccan traveler serves as qadi under Muhammad bin Tughluq, documenting 14th-century Indian society.', 'cultural', 'south_asia', 0.65, 'India', 'Delhi Sultanate', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Ibn_Battuta'),
('vijayanagara-empire', 'Vijayanagara Empire Founded', 1336, false, '1336-01-01', '1336-12-31', 'Last great Hindu empire in southern India, patronizing arts and monumental architecture at Hampi.', 'empire', 'south_asia', 0.75, 'India', 'Vijayanagara Empire', ST_SetSRID(ST_MakePoint(76.4601, 15.3350), 4326), 'Vijayanagara_Empire'),
('babur-mughal-empire', 'Babur Invades — Mughal Empire Founded', 1526, false, '1526-04-21', '1526-04-21', 'Babur defeats Ibrahim Lodi at First Battle of Panipat, founding the Mughal Empire.', 'empire', 'south_asia', 0.85, 'India', 'Mughal Empire', ST_SetSRID(ST_MakePoint(76.9688, 29.3889), 4326), 'Babur'),
('akbar-great', 'Akbar the Great — Era of Religious Tolerance', 1556, false, '1556-02-14', '1605-10-27', 'Institutes sulh-i-kul, abolishes jizya, creates administrative reforms defining the Mughal golden age.', 'political', 'south_asia', 0.8, 'India', 'Mughal Empire', ST_SetSRID(ST_MakePoint(78.0322, 27.1767), 4326), 'Akbar'),
('east-india-company', 'East India Company Founded', 1600, false, '1600-12-31', '1600-12-31', 'English EIC chartered to trade spices; transforms into de facto ruler of most of India over two centuries.', 'economic', 'south_asia', 0.8, 'India', 'Early Colonial India', ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'East_India_Company'),
('taj-mahal', 'Taj Mahal Constructed', 1632, false, '1632-01-01', '1653-12-31', 'Shah Jahan commissions the Taj Mahal for Mumtaz Mahal. Most iconic Mughal architecture.', 'cultural', 'south_asia', 0.75, 'India', 'Mughal Empire', ST_SetSRID(ST_MakePoint(78.0421, 27.1751), 4326), 'Taj_Mahal'),
('aurangzeb-mughal', 'Aurangzeb — Mughal Empire at Maximum Extent', 1658, false, '1658-07-31', '1707-03-03', 'Expands Mughal Empire to greatest extent but religious orthodoxy and wars sow seeds of decline.', 'empire', 'south_asia', 0.8, 'India', 'Mughal Empire', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Aurangzeb'),
('maratha-shivaji', 'Maratha Empire Rises Under Shivaji', 1674, false, '1674-06-06', '1674-06-06', 'Shivaji crowned Chhatrapati, establishing Maratha Empire challenging Mughal dominance.', 'empire', 'south_asia', 0.8, 'India', 'Maratha Empire', ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326), 'Shivaji'),
('battle-plassey', 'Battle of Plassey — British Gain Bengal', 1757, false, '1757-06-23', '1757-06-23', 'Clive defeats Siraj ud-Daulah, giving Britain control of Bengal and beginning British dominance.', 'military', 'south_asia', 0.85, 'India', 'Colonial India', ST_SetSRID(ST_MakePoint(88.2636, 23.7957), 4326), 'Battle_of_Plassey')
ON CONFLICT (slug) DO NOTHING;

-- BRITISH INDIA
INSERT INTO events (slug, title, year_approx, is_bce, date_earliest, date_latest, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug, created_by) VALUES
('permanent-settlement', 'Permanent Settlement — British Land Revenue System', 1793, false, '1793-03-22', '1793-03-22', 'Cornwallis fixes land revenue with zamindars, creating exploitative landlord class until independence.', 'economic', 'south_asia', 0.65, 'India', 'British India', ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'Permanent_Settlement'),
('sepoy-mutiny-1857', 'Indian Rebellion of 1857 — Sepoy Mutiny', 1857, false, '1857-05-10', '1858-06-20', 'Widespread uprising against EIC ends Company rule and transfers power to the British Crown.', 'military', 'south_asia', 0.85, 'India', 'British India', ST_SetSRID(ST_MakePoint(77.7064, 28.9845), 4326), 'Indian_Rebellion_of_1857'),
('british-crown-india', 'British Crown Takes Direct Control of India', 1858, false, '1858-08-02', '1858-08-02', 'Government of India Act dissolves EIC. Victoria proclaimed Empress of India, beginning the Raj.', 'political', 'south_asia', 0.8, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'British_Raj'),
('indian-national-congress', 'Indian National Congress Founded', 1885, false, '1885-12-28', '1885-12-28', 'Founded in Bombay, becomes principal organization of Indian independence movement.', 'political', 'south_asia', 0.75, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Indian_National_Congress'),
('gandhi-returns', 'Gandhi Returns from South Africa', 1915, false, '1915-01-09', '1915-01-09', 'Returns after 21 years developing satyagraha. Soon becomes leader of the independence movement.', 'political', 'south_asia', 0.8, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Mahatma_Gandhi'),
('jallianwala-bagh', 'Jallianwala Bagh Massacre', 1919, false, '1919-04-13', '1919-04-13', 'General Dyer opens fire on unarmed civilians at Amritsar, killing hundreds. Galvanizes independence movement.', 'military', 'south_asia', 0.8, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(74.8801, 31.6211), 4326), 'Jallianwala_Bagh_massacre'),
('quit-india', 'Quit India Movement', 1942, false, '1942-08-08', '1942-08-08', 'Gandhi demands immediate British withdrawal during WWII. Demonstrates independence is inevitable.', 'political', 'south_asia', 0.8, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Quit_India_movement'),
('bengal-famine-1943', 'Bengal Famine of 1943', 1943, false, '1943-01-01', '1943-12-31', 'Kills 2-3 million in Bengal from wartime policies, crop disease, and British mismanagement.', 'disaster', 'south_asia', 0.75, 'India', 'British Raj', ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'Bengal_famine_of_1943'),
('india-independence-partition', 'Indian Independence and Partition', 1947, false, '1947-08-15', '1947-08-15', 'Independence partitions British India into India and Pakistan, triggering mass migration and up to two million deaths.', 'political', 'south_asia', 0.85, 'India', 'Post-Colonial South Asia', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Partition_of_India')
ON CONFLICT (slug) DO NOTHING;

-- MODERN
INSERT INTO events (slug, title, year_approx, is_bce, date_earliest, date_latest, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug, created_by) VALUES
('bangladesh-liberation', 'Bangladesh Liberation War', 1971, false, '1971-03-26', '1971-12-16', 'East Pakistan declares independence as Bangladesh. Indian intervention secures it amid widespread atrocities.', 'military', 'south_asia', 0.8, 'Bangladesh', 'Modern South Asia', ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326), 'Bangladesh_Liberation_War'),
('india-economic-liberalization', 'India''s Economic Liberalization', 1991, false, '1991-07-24', '1991-07-24', 'Manmohan Singh dismantles the License Raj, opening India to foreign investment and rapid growth.', 'economic', 'south_asia', 0.8, 'India', 'Modern India', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Economic_liberalisation_in_India'),
('india-pakistan-nuclear', 'India and Pakistan Conduct Nuclear Tests', 1998, false, '1998-05-11', '1998-05-30', 'India conducts Pokhran-II, Pakistan responds weeks later. Both become declared nuclear powers.', 'military', 'south_asia', 0.75, 'India', 'Modern South Asia', ST_SetSRID(ST_MakePoint(71.7525, 27.0953), 4326), 'Pokhran-II')
ON CONFLICT (slug) DO NOTHING;

-- CAUSALITY LINKS
DO $$
DECLARE
  v_cause uuid; v_effect uuid;
BEGIN
  -- 1. Chandragupta → Ashoka
  SELECT id INTO v_cause FROM events WHERE slug='chandragupta-maurya';
  SELECT id INTO v_effect FROM events WHERE slug='ashoka-buddhism';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'Maurya Empire enabled Ashoka''s reign and Buddhist propagation','enrichment_script');
  END IF;
  -- 2. Gupta → Aryabhata
  SELECT id INTO v_cause FROM events WHERE slug='gupta-golden-age';
  SELECT id INTO v_effect FROM events WHERE slug='aryabhata-math';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'enabled',0.85,'Gupta patronage enabled Indian mathematics','enrichment_script');
  END IF;
  -- 3. Gupta → Nalanda
  SELECT id INTO v_cause FROM events WHERE slug='gupta-golden-age';
  SELECT id INTO v_effect FROM events WHERE slug='nalanda-university';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'enabled',0.8,'Gupta intellectual culture led to Nalanda','enrichment_script');
  END IF;
  -- 4. Ghurids → Khalji
  SELECT id INTO v_cause FROM events WHERE slug='ghurids-delhi-sultanate';
  SELECT id INTO v_effect FROM events WHERE title LIKE '%Alauddin Khalji%' LIMIT 1;
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'Ghurid conquest established Delhi Sultanate that Khalji expanded','enrichment_script');
  END IF;
  -- 5. Timur → Babur
  SELECT id INTO v_cause FROM events WHERE title LIKE '%Timur Sacks Delhi%' LIMIT 1;
  SELECT id INTO v_effect FROM events WHERE slug='babur-mughal-empire';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'indirect_cause',0.7,'Timur weakened Delhi Sultanate, enabling Babur''s conquest','enrichment_script');
  END IF;
  -- 6. Aurangzeb → Maratha
  SELECT id INTO v_cause FROM events WHERE slug='aurangzeb-mughal';
  SELECT id INTO v_effect FROM events WHERE slug='maratha-shivaji';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'provoked',0.85,'Aurangzeb''s policies provoked Maratha resistance','enrichment_script');
  END IF;
  -- 7. Aurangzeb → Plassey
  SELECT id INTO v_cause FROM events WHERE slug='aurangzeb-mughal';
  SELECT id INTO v_effect FROM events WHERE slug='battle-plassey';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'indirect_cause',0.75,'Mughal decline after Aurangzeb created vacuum for British','enrichment_script');
  END IF;
  -- 8. EIC → Plassey
  SELECT id INTO v_cause FROM events WHERE slug='east-india-company';
  SELECT id INTO v_effect FROM events WHERE slug='battle-plassey';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'EIC expansion led to Plassey','enrichment_script');
  END IF;
  -- 9. Plassey → Mutiny
  SELECT id INTO v_cause FROM events WHERE slug='battle-plassey';
  SELECT id INTO v_effect FROM events WHERE slug='sepoy-mutiny-1857';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'indirect_cause',0.8,'Century of British control after Plassey led to 1857 uprising','enrichment_script');
  END IF;
  -- 10. Mutiny → Crown
  SELECT id INTO v_cause FROM events WHERE slug='sepoy-mutiny-1857';
  SELECT id INTO v_effect FROM events WHERE slug='british-crown-india';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.95,'1857 rebellion caused dissolution of EIC and Crown rule','enrichment_script');
  END IF;
  -- 11. Jallianwala → Quit India
  SELECT id INTO v_cause FROM events WHERE slug='jallianwala-bagh';
  SELECT id INTO v_effect FROM events WHERE slug='quit-india';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'indirect_cause',0.8,'Amritsar massacre radicalized independence movement','enrichment_script');
  END IF;
  -- 12. Gandhi → Quit India
  SELECT id INTO v_cause FROM events WHERE slug='gandhi-returns';
  SELECT id INTO v_effect FROM events WHERE slug='quit-india';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'Gandhi''s satyagraha drove Quit India movement','enrichment_script');
  END IF;
  -- 13. Quit India → Independence
  SELECT id INTO v_cause FROM events WHERE slug='quit-india';
  SELECT id INTO v_effect FROM events WHERE slug='india-independence-partition';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'Quit India and WWII exhaustion made British rule untenable','enrichment_script');
  END IF;
  -- 14. Independence → Bangladesh
  SELECT id INTO v_cause FROM events WHERE slug='india-independence-partition';
  SELECT id INTO v_effect FROM events WHERE slug='bangladesh-liberation';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'indirect_cause',0.85,'Partition created divided Pakistan whose tensions led to Bangladesh','enrichment_script');
  END IF;
  -- 15. Prithviraj → Ghurids
  SELECT id INTO v_cause FROM events WHERE slug='prithviraj-chauhan';
  SELECT id INTO v_effect FROM events WHERE slug='ghurids-delhi-sultanate';
  IF v_cause IS NOT NULL AND v_effect IS NOT NULL AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id=v_cause AND effect_event_id=v_effect) THEN
    INSERT INTO causality_links (id,cause_event_id,effect_event_id,link_type,strength,description,created_by) VALUES (gen_random_uuid(),v_cause,v_effect,'direct_cause',0.9,'Prithviraj''s defeat at Second Tarain established Delhi Sultanate','enrichment_script');
  END IF;
END $$;
