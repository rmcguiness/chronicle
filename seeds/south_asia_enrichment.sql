-- South Asian History Enrichment
-- ~45 new events spanning Indus Valley through modern era

-- ANCIENT INDIA
INSERT INTO events (title, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug)
VALUES
('Indus Valley Civilization — Harappa and Mohenjo-daro', -2600, true,
 'One of the world''s earliest urban civilizations, featuring advanced city planning, drainage systems, and standardized weights. Centered around the Indus River in modern Pakistan, with major cities at Harappa and Mohenjo-daro supporting populations of tens of thousands.',
 'civilization', 'south_asia', 0.85, 'Pakistan', 'Indus Valley Civilization',
 ST_SetSRID(ST_MakePoint(68.1375, 27.3244), 4326), 'Indus_Valley_Civilisation'),

('Aryan Migrations — Vedic Culture Begins', -1500, true,
 'Indo-Aryan peoples migrate into the Indian subcontinent, bringing the Sanskrit language and Vedic religious traditions. This migration transforms the cultural landscape of northern India and establishes the foundations of Hindu civilization.',
 'migration', 'south_asia', 0.8, 'India', 'Vedic India',
 ST_SetSRID(ST_MakePoint(76.7794, 30.7333), 4326), 'Indo-Aryan_migrations'),

('Rig Veda Composed', -1200, true,
 'The oldest known Vedic Sanskrit text is composed, containing 1,028 hymns dedicated to various deities. The Rig Veda forms the foundation of Hindu religious thought and is among the oldest religious texts still in continuous use.',
 'cultural', 'south_asia', 0.75, 'India', 'Vedic India',
 ST_SetSRID(ST_MakePoint(76.0, 30.0), 4326), 'Rigveda'),

('Upanishads — Philosophical Revolution', -800, true,
 'The Upanishads are composed, introducing concepts of Brahman (universal soul), Atman (individual soul), karma, and moksha. These texts represent a philosophical revolution moving beyond Vedic ritual toward metaphysical inquiry.',
 'cultural', 'south_asia', 0.75, 'India', 'Late Vedic India',
 ST_SetSRID(ST_MakePoint(81.8463, 25.4358), 4326), 'Upanishads'),

('Mahavira Founds Jainism', -540, true,
 'Vardhamana Mahavira, the 24th Tirthankara, establishes Jainism as a major religious tradition emphasizing non-violence (ahimsa), truth, and asceticism. Jainism profoundly influences Indian culture and ethics.',
 'religion', 'south_asia', 0.7, 'India', 'Ancient India',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Mahavira'),

('Siddhartha Gautama — Birth of Buddhism', -480, true,
 'Siddhartha Gautama attains enlightenment and becomes the Buddha, founding one of the world''s major religions. His teachings on the Four Noble Truths and the Eightfold Path spread across Asia, transforming civilizations from Sri Lanka to Japan.',
 'religion', 'south_asia', 0.85, 'India', 'Ancient India',
 ST_SetSRID(ST_MakePoint(83.9778, 27.4833), 4326), 'Gautama_Buddha'),

('Persian Conquest of Gandhara', -519, true,
 'The Achaemenid Empire under Darius I conquers Gandhara (modern northwest Pakistan/eastern Afghanistan), incorporating it as a satrapy. This connects South Asia to the broader Persian imperial network and facilitates cultural exchange.',
 'military', 'south_asia', 0.65, 'Pakistan', 'Achaemenid Gandhara',
 ST_SetSRID(ST_MakePoint(71.7889, 34.1688), 4326), 'Gandhara'),

('Alexander Invades India — Battle of the Hydaspes', -326, true,
 'Alexander the Great crosses the Indus and defeats King Porus at the Battle of the Hydaspes. His troops refuse to advance further into India, forcing his retreat. The invasion opens cultural exchange between Hellenistic and Indian civilizations.',
 'military', 'south_asia', 0.8, 'Pakistan', 'Hellenistic Period',
 ST_SetSRID(ST_MakePoint(73.6, 32.9), 4326), 'Battle_of_the_Hydaspes'),

('Chandragupta Maurya Founds the Maurya Empire', -321, true,
 'Chandragupta Maurya overthrows the Nanda Dynasty and establishes the Maurya Empire, the first empire to unify most of the Indian subcontinent. Guided by his advisor Chanakya (Kautilya), he creates an efficient centralized administration.',
 'empire', 'south_asia', 0.85, 'India', 'Maurya Empire',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Chandragupta_Maurya'),

('Ashoka Converts to Buddhism and Spreads It', -250, true,
 'After the devastating Kalinga War, Emperor Ashoka converts to Buddhism and dedicates his reign to spreading dharma through edicts carved on pillars and rocks across his empire. His missionaries carry Buddhism to Sri Lanka, Central Asia, and Southeast Asia.',
 'religion', 'south_asia', 0.85, 'India', 'Maurya Empire',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Ashoka'),

('Decline of the Maurya Empire', -185, true,
 'The Maurya Empire collapses after the assassination of Emperor Brihadratha by his general Pushyamitra Shunga. The Shunga Dynasty replaces it, and the subcontinent fragments into smaller kingdoms.',
 'political', 'south_asia', 0.65, 'India', 'Post-Maurya India',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Shunga_Empire'),

('Tamil Sangam Literature Flourishes', -300, true,
 'The Sangam period produces a rich body of Tamil literature including poetry, grammar, and ethics. The three Sangam academies patronize works that document trade, warfare, and daily life in ancient southern India.',
 'cultural', 'south_asia', 0.7, 'India', 'Sangam Period Tamil Nadu',
 ST_SetSRID(ST_MakePoint(78.1198, 9.9252), 4326), 'Sangam_literature'),

('Satavahana Dynasty — Deccan Trade Hub', -60, true,
 'The Satavahana Dynasty rises to control the Deccan plateau, becoming a major hub for trade between the Roman Empire and South/Southeast Asia. They patronize Buddhism and develop cave temples at Ajanta and Ellora.',
 'empire', 'south_asia', 0.7, 'India', 'Satavahana Deccan',
 ST_SetSRID(ST_MakePoint(75.3433, 19.8762), 4326), 'Satavahana_dynasty')

ON CONFLICT (title) DO NOTHING;

-- CLASSICAL INDIA
INSERT INTO events (title, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug)
VALUES
('Kushan Empire — Silk Road Bridge', 78, false,
 'The Kushan Empire under Kanishka I unifies northern India, Afghanistan, and Central Asia, becoming a critical link on the Silk Road. The Kushans patronize Gandharan Buddhist art, blending Hellenistic and Indian styles.',
 'empire', 'south_asia', 0.75, 'Pakistan', 'Kushan Empire',
 ST_SetSRID(ST_MakePoint(71.7889, 34.1688), 4326), 'Kushan_Empire'),

('Gupta Empire — Golden Age of India', 320, false,
 'The Gupta Empire ushers in India''s Golden Age, marked by extraordinary achievements in mathematics (the concept of zero, decimal system), astronomy, literature (Kalidasa), and art. The empire provides stability across northern India for over two centuries.',
 'empire', 'south_asia', 0.85, 'India', 'Gupta Empire',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Gupta_Empire'),

('Nalanda University Founded', 427, false,
 'Nalanda University is established in Bihar, becoming the world''s first residential university. At its peak it hosts 10,000 students and 2,000 teachers studying Buddhist philosophy, logic, mathematics, and medicine, attracting scholars from across Asia.',
 'cultural', 'south_asia', 0.75, 'India', 'Gupta Empire',
 ST_SetSRID(ST_MakePoint(85.4427, 25.1357), 4326), 'Nalanda'),

('Aryabhata — Advances in Mathematics and Astronomy', 499, false,
 'The mathematician-astronomer Aryabhata publishes the Aryabhatiya, introducing the place-value system, approximating pi, and proposing that the Earth rotates on its axis. His work profoundly influences Islamic and European mathematics.',
 'science', 'south_asia', 0.75, 'India', 'Gupta Empire',
 ST_SetSRID(ST_MakePoint(85.1376, 25.6093), 4326), 'Aryabhata'),

('Harsha Empire — Brief Reunification of North India', 606, false,
 'Emperor Harsha reunifies much of northern India under a single rule for the last time before the Islamic period. A patron of Buddhism and the arts, his reign is documented by the Chinese pilgrim Xuanzang.',
 'empire', 'south_asia', 0.7, 'India', 'Harsha Empire',
 ST_SetSRID(ST_MakePoint(76.9688, 29.9647), 4326), 'Harsha'),

('Arab Conquest of Sindh', 712, false,
 'Muhammad bin Qasim leads an Umayyad army to conquer Sindh, establishing the first permanent Muslim presence in South Asia. This marks the beginning of Islamic influence on the subcontinent.',
 'military', 'south_asia', 0.75, 'Pakistan', 'Umayyad Sindh',
 ST_SetSRID(ST_MakePoint(68.3578, 25.3960), 4326), 'Muhammad_bin_Qasim'),

('Chola Dynasty at Peak — Naval Empire', 1010, false,
 'Under Rajendra Chola I, the Chola Dynasty becomes a major naval power, launching maritime expeditions to Southeast Asia and Sri Lanka. The Cholas build magnificent temples including the Brihadisvara Temple at Thanjavur.',
 'empire', 'south_asia', 0.75, 'India', 'Chola Empire',
 ST_SetSRID(ST_MakePoint(79.1378, 10.7870), 4326), 'Chola_dynasty'),

('Prithviraj Chauhan — Last Hindu Emperor of Delhi', 1178, false,
 'Prithviraj III of the Chahamana dynasty becomes the last major Hindu ruler of Delhi and Ajmer. His initial victory over Muhammad of Ghor at the First Battle of Tarain temporarily halts Islamic advance into northern India.',
 'political', 'south_asia', 0.7, 'India', 'Rajput India',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Prithviraj_III')

ON CONFLICT (title) DO NOTHING;

-- DELHI SULTANATE & MUGHAL
INSERT INTO events (title, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug)
VALUES
('Ghurids Defeat Prithviraj — Delhi Sultanate Begins', 1192, false,
 'Muhammad of Ghor defeats Prithviraj Chauhan at the Second Battle of Tarain, opening northern India to Turkic Muslim rule. His general Qutb ud-Din Aibak establishes the Delhi Sultanate, beginning over 600 years of Muslim rule in India.',
 'military', 'south_asia', 0.8, 'India', 'Delhi Sultanate',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Battle_of_Tarain'),

('Ibn Battuta Visits Delhi', 1333, false,
 'The Moroccan traveler Ibn Battuta arrives in Delhi during the reign of Muhammad bin Tughluq, serving as a qadi (judge) for several years. His detailed account provides invaluable documentation of 14th-century Indian society and politics.',
 'cultural', 'south_asia', 0.65, 'India', 'Delhi Sultanate',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Ibn_Battuta'),

('Vijayanagara Empire Founded', 1336, false,
 'The Vijayanagara Empire is established in southern India as a bulwark against Islamic expansion. For over two centuries it serves as the last great Hindu empire, patronizing arts, literature, and monumental architecture at Hampi.',
 'empire', 'south_asia', 0.75, 'India', 'Vijayanagara Empire',
 ST_SetSRID(ST_MakePoint(76.4601, 15.3350), 4326), 'Vijayanagara_Empire'),

('Babur Invades — Mughal Empire Founded', 1526, false,
 'Babur, a descendant of Timur and Genghis Khan, defeats the Delhi Sultan Ibrahim Lodi at the First Battle of Panipat, founding the Mughal Empire. The Mughals would rule most of the subcontinent for over three centuries.',
 'empire', 'south_asia', 0.85, 'India', 'Mughal Empire',
 ST_SetSRID(ST_MakePoint(76.9688, 29.3889), 4326), 'Babur'),

('Akbar the Great — Era of Religious Tolerance', 1556, false,
 'Emperor Akbar ascends to the Mughal throne and institutes a policy of religious tolerance (sulh-i-kul), abolishes the jizya tax on non-Muslims, and creates the Din-i-Ilahi syncretic faith. His administrative reforms and patronage of arts define the Mughal golden age.',
 'political', 'south_asia', 0.8, 'India', 'Mughal Empire',
 ST_SetSRID(ST_MakePoint(78.0322, 27.1767), 4326), 'Akbar'),

('East India Company Founded', 1600, false,
 'The English East India Company receives its royal charter from Queen Elizabeth I, initially to trade spices. Over two centuries it transforms from a trading company into the de facto ruler of most of India.',
 'economic', 'south_asia', 0.8, 'India', 'Early Colonial India',
 ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'East_India_Company'),

('Taj Mahal Constructed', 1632, false,
 'Mughal Emperor Shah Jahan commissions the Taj Mahal as a mausoleum for his wife Mumtaz Mahal. Completed around 1653, it becomes the most iconic example of Mughal architecture and one of the world''s most recognized monuments.',
 'cultural', 'south_asia', 0.75, 'India', 'Mughal Empire',
 ST_SetSRID(ST_MakePoint(78.0421, 27.1751), 4326), 'Taj_Mahal'),

('Aurangzeb — Mughal Empire at Maximum Extent', 1658, false,
 'Emperor Aurangzeb expands the Mughal Empire to its greatest territorial extent, covering nearly the entire Indian subcontinent. However, his religious orthodoxy, reimposition of the jizya, and prolonged Deccan wars sow the seeds of imperial decline.',
 'empire', 'south_asia', 0.8, 'India', 'Mughal Empire',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Aurangzeb'),

('Maratha Empire Rises Under Shivaji', 1674, false,
 'Shivaji Bhonsle is crowned Chhatrapati, establishing the Maratha Empire as a Hindu power challenging Mughal dominance. The Marathas develop guerrilla warfare tactics and eventually control vast territories across central and western India.',
 'empire', 'south_asia', 0.8, 'India', 'Maratha Empire',
 ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326), 'Shivaji'),

('Battle of Plassey — British Gain Bengal', 1757, false,
 'Robert Clive''s East India Company forces defeat Nawab Siraj ud-Daulah at Plassey through military action and political conspiracy. This decisive victory gives Britain control of Bengal''s vast wealth and marks the beginning of British political dominance in India.',
 'military', 'south_asia', 0.85, 'India', 'Colonial India',
 ST_SetSRID(ST_MakePoint(88.2636, 23.7957), 4326), 'Battle_of_Plassey')

ON CONFLICT (title) DO NOTHING;

-- BRITISH INDIA
INSERT INTO events (title, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug)
VALUES
('Permanent Settlement — British Land Revenue System', 1793, false,
 'Lord Cornwallis introduces the Permanent Settlement in Bengal, fixing land revenue in perpetuity with zamindars as intermediaries. This system transforms Indian land ownership and creates an exploitative landlord class that persists until independence.',
 'economic', 'south_asia', 0.65, 'India', 'British India',
 ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'Permanent_Settlement'),

('Indian Rebellion of 1857 — Sepoy Mutiny', 1857, false,
 'A widespread uprising against the East India Company begins with Indian soldiers (sepoys) at Meerut and spreads across northern India. Though ultimately suppressed, it ends Company rule and transfers power directly to the British Crown.',
 'military', 'south_asia', 0.85, 'India', 'British India',
 ST_SetSRID(ST_MakePoint(77.7064, 28.9845), 4326), 'Indian_Rebellion_of_1857'),

('British Crown Takes Direct Control of India', 1858, false,
 'Following the 1857 rebellion, the British government dissolves the East India Company and assumes direct control through the Government of India Act. Queen Victoria is proclaimed Empress of India, beginning the British Raj.',
 'political', 'south_asia', 0.8, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'British_Raj'),

('Indian National Congress Founded', 1885, false,
 'The Indian National Congress is founded in Bombay by Allan Octavian Hume, becoming the principal political organization of the Indian independence movement. It evolves from a moderate petitioning body into a mass movement under Gandhi''s leadership.',
 'political', 'south_asia', 0.75, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Indian_National_Congress'),

('Gandhi Returns from South Africa', 1915, false,
 'Mohandas K. Gandhi returns to India after 21 years in South Africa, where he developed his philosophy of satyagraha (non-violent resistance). He soon becomes the leader of the Indian independence movement, transforming it into a mass campaign.',
 'political', 'south_asia', 0.8, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Mahatma_Gandhi'),

('Jallianwala Bagh Massacre', 1919, false,
 'British troops under General Dyer open fire on unarmed civilians gathered at Jallianwala Bagh in Amritsar, killing hundreds. The massacre galvanizes Indian public opinion against British rule and radicalizes the independence movement.',
 'military', 'south_asia', 0.8, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(74.8801, 31.6211), 4326), 'Jallianwala_Bagh_massacre'),

('Quit India Movement', 1942, false,
 'Gandhi launches the Quit India Movement demanding immediate British withdrawal during World War II. The British respond with mass arrests, but the movement demonstrates that Indian independence is inevitable.',
 'political', 'south_asia', 0.8, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), 'Quit_India_movement'),

('Bengal Famine', 1943, false,
 'A devastating famine strikes Bengal, killing an estimated 2-3 million people. Caused by a combination of wartime policies, rice crop disease, and British mismanagement under Churchill''s government, it remains one of the worst humanitarian disasters of the 20th century.',
 'disaster', 'south_asia', 0.75, 'India', 'British Raj',
 ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326), 'Bengal_famine_of_1943'),

('Indian Independence and Partition', 1947, false,
 'British India gains independence on August 15, 1947, simultaneously partitioned into India and Pakistan along religious lines. The partition triggers one of history''s largest mass migrations and communal violence killing up to two million people.',
 'political', 'south_asia', 0.85, 'India', 'Post-Colonial South Asia',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Partition_of_India')

ON CONFLICT (title) DO NOTHING;

-- MODERN
INSERT INTO events (title, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, wikipedia_slug)
VALUES
('Bangladesh Liberation War', 1971, false,
 'East Pakistan declares independence as Bangladesh, triggering a brutal war with West Pakistan. Indian military intervention helps secure Bangladeshi independence. The conflict involves widespread atrocities and creates millions of refugees.',
 'military', 'south_asia', 0.8, 'Bangladesh', 'Modern South Asia',
 ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326), 'Bangladesh_Liberation_War'),

('India''s Economic Liberalization', 1991, false,
 'Finance Minister Manmohan Singh introduces sweeping economic reforms, dismantling the License Raj and opening India to foreign investment and trade. These reforms transform India from a closed economy into one of the world''s fastest-growing major economies.',
 'economic', 'south_asia', 0.8, 'India', 'Modern India',
 ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'Economic_liberalisation_in_India'),

('India and Pakistan Conduct Nuclear Tests', 1998, false,
 'India conducts five nuclear tests (Pokhran-II) in May, followed by Pakistan''s six tests weeks later. Both nations become declared nuclear powers, dramatically altering the security dynamics of South Asia and triggering international sanctions.',
 'military', 'south_asia', 0.75, 'India', 'Modern South Asia',
 ST_SetSRID(ST_MakePoint(71.7525, 27.0953), 4326), 'Pokhran-II')

ON CONFLICT (title) DO NOTHING;

-- CAUSALITY LINKS
-- We need to reference event IDs by title

-- 1. Chandragupta Maurya → Ashoka converts to Buddhism
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Chandragupta Maurya Founds the Maurya Empire'),
  (SELECT id FROM events WHERE title = 'Ashoka Converts to Buddhism and Spreads It'),
  'direct_cause', 0.9, 'Maurya Empire created the political unity that enabled Ashoka''s reign and Buddhist propagation', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Chandragupta Maurya Founds the Maurya Empire') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Ashoka Converts to Buddhism and Spreads It')
);

-- 2. Ashoka spreads Buddhism → Buddhism reaches Southeast Asia (link to external if exists, else skip)
-- 3. Gupta Empire → Aryabhata mathematics
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Gupta Empire — Golden Age of India'),
  (SELECT id FROM events WHERE title = 'Aryabhata — Advances in Mathematics and Astronomy'),
  'enabled', 0.85, 'Gupta patronage and stability enabled flourishing of Indian mathematics and astronomy', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Gupta Empire — Golden Age of India') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Aryabhata — Advances in Mathematics and Astronomy')
);

-- 4. Gupta Empire → Nalanda University
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Gupta Empire — Golden Age of India'),
  (SELECT id FROM events WHERE title = 'Nalanda University Founded'),
  'enabled', 0.8, 'Gupta-era patronage and intellectual culture led to establishment of Nalanda', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Gupta Empire — Golden Age of India') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Nalanda University Founded')
);

-- 5. Ghurids defeat Prithviraj → Delhi Sultanate expands under Khalji
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Ghurids Defeat Prithviraj — Delhi Sultanate Begins'),
  (SELECT id FROM events WHERE title = 'Delhi Sultanate Expands Under Alauddin Khalji'),
  'direct_cause', 0.9, 'Ghurid conquest established the Delhi Sultanate that Khalji later expanded', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Ghurids Defeat Prithviraj — Delhi Sultanate Begins') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Delhi Sultanate Expands Under Alauddin Khalji')
);

-- 6. Timur sacks Delhi → weakened sultanate → Babur invades
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Timur Sacks Delhi — Devastation of North India'),
  (SELECT id FROM events WHERE title = 'Babur Invades — Mughal Empire Founded'),
  'indirect_cause', 0.7, 'Timur''s devastation permanently weakened the Delhi Sultanate, creating conditions for Babur''s conquest', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Timur Sacks Delhi — Devastation of North India') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Babur Invades — Mughal Empire Founded')
);

-- 7. Aurangzeb → Maratha Empire rises
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Aurangzeb — Mughal Empire at Maximum Extent'),
  (SELECT id FROM events WHERE title = 'Maratha Empire Rises Under Shivaji'),
  'provoked', 0.85, 'Aurangzeb''s religious policies and southern campaigns provoked Maratha resistance under Shivaji', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Aurangzeb — Mughal Empire at Maximum Extent') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Maratha Empire Rises Under Shivaji')
);

-- 8. Aurangzeb decline → Battle of Plassey (British fill vacuum)
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Aurangzeb — Mughal Empire at Maximum Extent'),
  (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal'),
  'indirect_cause', 0.75, 'Mughal decline after Aurangzeb created the power vacuum that enabled British conquest', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Aurangzeb — Mughal Empire at Maximum Extent') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal')
);

-- 9. EIC founded → Battle of Plassey
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'East India Company Founded'),
  (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal'),
  'direct_cause', 0.9, 'The East India Company''s commercial and military expansion led directly to Plassey', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'East India Company Founded') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal')
);

-- 10. Battle of Plassey → Sepoy Mutiny
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal'),
  (SELECT id FROM events WHERE title = 'Indian Rebellion of 1857 — Sepoy Mutiny'),
  'indirect_cause', 0.8, 'A century of expanding British control after Plassey created the conditions for the 1857 uprising', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Battle of Plassey — British Gain Bengal') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Indian Rebellion of 1857 — Sepoy Mutiny')
);

-- 11. Sepoy Mutiny → British Crown takes control
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Indian Rebellion of 1857 — Sepoy Mutiny'),
  (SELECT id FROM events WHERE title = 'British Crown Takes Direct Control of India'),
  'direct_cause', 0.95, 'The 1857 rebellion directly caused dissolution of EIC and transfer to Crown rule', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Indian Rebellion of 1857 — Sepoy Mutiny') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'British Crown Takes Direct Control of India')
);

-- 12. Jallianwala Bagh → Quit India Movement
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Jallianwala Bagh Massacre'),
  (SELECT id FROM events WHERE title = 'Quit India Movement'),
  'indirect_cause', 0.8, 'The Amritsar massacre radicalized the independence movement, contributing to the Quit India demand', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Jallianwala Bagh Massacre') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Quit India Movement')
);

-- 13. Gandhi returns → Quit India Movement
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Gandhi Returns from South Africa'),
  (SELECT id FROM events WHERE title = 'Quit India Movement'),
  'direct_cause', 0.9, 'Gandhi''s leadership and philosophy of satyagraha drove the Quit India movement', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Gandhi Returns from South Africa') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Quit India Movement')
);

-- 14. Quit India → Independence and Partition
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Quit India Movement'),
  (SELECT id FROM events WHERE title = 'Indian Independence and Partition'),
  'direct_cause', 0.9, 'The Quit India movement and WWII exhaustion made continued British rule untenable', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Quit India Movement') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Indian Independence and Partition')
);

-- 15. Independence and Partition → Bangladesh Liberation War
INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT gen_random_uuid(),
  (SELECT id FROM events WHERE title = 'Indian Independence and Partition'),
  (SELECT id FROM events WHERE title = 'Bangladesh Liberation War'),
  'indirect_cause', 0.85, 'Partition created the geographically divided Pakistan whose internal tensions led to Bangladesh''s independence', 'enrichment_script'
WHERE NOT EXISTS (
  SELECT 1 FROM causality_links WHERE
    cause_event_id = (SELECT id FROM events WHERE title = 'Indian Independence and Partition') AND
    effect_event_id = (SELECT id FROM events WHERE title = 'Bangladesh Liberation War')
);
