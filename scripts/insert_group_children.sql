-- Insert ~170 historical sub-events as children of existing group events
-- Each sub-event is a historically significant moment within its parent group's scope

BEGIN;

-- ============================================================
-- 1. An Lushan Rebellion — Tang Dynasty Weakened (755-763 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('an-lushan-captures-luoyang', 'An Lushan Captures Luoyang — Eastern Capital Falls', '0755-12-16', '0756-01-15', FALSE, 756, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%An Lushan Rebellion%' AND is_group=TRUE LIMIT 1)),
('battle-of-suiyang', 'Siege of Suiyang — Heroic Tang Resistance', '0757-01-01', '0757-10-01', FALSE, 757, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%An Lushan Rebellion%' AND is_group=TRUE LIMIT 1)),
('tang-recaptures-changan', 'Tang Forces Recapture Chang''an', '0757-10-01', '0757-11-01', FALSE, 757, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%An Lushan Rebellion%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 2. Assyrian Empire at Its Height — Ashurbanipal (668 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ashurbanipal-sack-of-thebes', 'Ashurbanipal Sacks Thebes — Assyria Conquers Egypt', '0663-01-01 BC', '0663-12-31 BC', TRUE, -663, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire at Its Height%' AND is_group=TRUE LIMIT 1)),
('library-of-ashurbanipal', 'Library of Ashurbanipal — World''s First Systematic Library', '0650-01-01 BC', '0640-12-31 BC', TRUE, -650, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire at Its Height%' AND is_group=TRUE LIMIT 1)),
('fall-of-nineveh', 'Fall of Nineveh — Collapse of the Assyrian Empire', '0612-01-01 BC', '0612-12-31 BC', TRUE, -612, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire at Its Height%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 3. Assyrian Empire Conquers Mesopotamia (-900)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ashurnasirpal-ii-calah', 'Ashurnasirpal II Builds Calah — Neo-Assyrian Capital', '0879-01-01 BC', '0879-12-31 BC', TRUE, -879, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire Conquers Mesopotamia%' AND is_group=TRUE LIMIT 1)),
('shalmaneser-iii-battle-qarqar', 'Battle of Qarqar — Shalmaneser III vs Levantine Coalition', '0853-01-01 BC', '0853-12-31 BC', TRUE, -853, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire Conquers Mesopotamia%' AND is_group=TRUE LIMIT 1)),
('tiglath-pileser-iii-reforms', 'Tiglath-Pileser III Reforms the Assyrian Military', '0745-01-01 BC', '0745-12-31 BC', TRUE, -745, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Assyrian Empire Conquers Mesopotamia%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 4. Baghdad's House of Wisdom — Islamic Golden Age (800 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('house-of-wisdom-founded', 'House of Wisdom Founded in Baghdad Under al-Mamun', '0830-01-01', '0833-12-31', FALSE, 830, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%House of Wisdom%' AND is_group=TRUE LIMIT 1)),
('al-khwarizmi-algebra', 'Al-Khwarizmi Writes Al-Jabr — Birth of Algebra', '0820-01-01', '0830-12-31', FALSE, 825, 0.75, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%House of Wisdom%' AND is_group=TRUE LIMIT 1)),
('translation-movement-peak', 'Translation Movement — Greek Knowledge Into Arabic', '0800-01-01', '0850-12-31', FALSE, 825, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%House of Wisdom%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 5. Cordoba Caliphate — Islamic Spain's Golden Age (950 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('abd-al-rahman-iii-caliph', 'Abd al-Rahman III Declares Caliphate of Cordoba', '0929-01-01', '0929-12-31', FALSE, 929, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cordoba Caliphate%' AND is_group=TRUE LIMIT 1)),
('great-mosque-cordoba-expansion', 'Great Mosque of Cordoba Expansion Under al-Hakam II', '0961-01-01', '0976-12-31', FALSE, 965, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cordoba Caliphate%' AND is_group=TRUE LIMIT 1)),
('cordoba-library-400k', 'Library of Cordoba Reaches 400,000 Volumes', '0970-01-01', '0976-12-31', FALSE, 970, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cordoba Caliphate%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 6. Founding of the Han Dynasty (-206 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('battle-of-gaixia', 'Battle of Gaixia — Liu Bang Defeats Xiang Yu', '0202-01-01 BC', '0202-12-31 BC', TRUE, -202, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Han Dynasty%' AND is_group=TRUE LIMIT 1)),
('emperor-gaozu-han', 'Emperor Gaozu Proclaimed — Han Dynasty Begins', '0202-01-01 BC', '0202-12-31 BC', TRUE, -202, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Han Dynasty%' AND is_group=TRUE LIMIT 1)),
('lu-empress-regency', 'Empress Lü Regency — First Female Power in Han', '0195-01-01 BC', '0180-12-31 BC', TRUE, -188, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Han Dynasty%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 7. Founding of the Maurya Empire (-322 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('chandragupta-defeats-nanda', 'Chandragupta Overthrows the Nanda Dynasty', '0322-01-01 BC', '0321-12-31 BC', TRUE, -322, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Maurya Empire%' AND is_group=TRUE LIMIT 1)),
('chandragupta-defeats-seleucus', 'Chandragupta Defeats Seleucus — Gains Northwest India', '0305-01-01 BC', '0303-12-31 BC', TRUE, -305, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Maurya Empire%' AND is_group=TRUE LIMIT 1)),
('arthashastra-kautilya', 'Kautilya''s Arthashastra — Treatise on Statecraft', '0300-01-01 BC', '0280-12-31 BC', TRUE, -300, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Founding of the Maurya Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 8. Gupta Empire — India's Golden Age (350 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('samudragupta-conquests', 'Samudragupta''s Conquests — Gupta Empire Expands', '0335-01-01', '0375-12-31', FALSE, 350, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Gupta Empire%' AND is_group=TRUE LIMIT 1)),
('aryabhata-mathematics', 'Aryabhata — Indian Mathematics and Astronomy', '0499-01-01', '0499-12-31', FALSE, 499, 0.7, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Gupta Empire%' AND is_group=TRUE LIMIT 1)),
('nalanda-university-gupta', 'Nalanda University Flourishes Under Gupta Patronage', '0427-01-01', '0450-12-31', FALSE, 430, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Gupta Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 9. Han Dynasty — China's Confucian Imperial System (-100 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('emperor-wu-confucianism', 'Emperor Wu Adopts Confucianism as State Ideology', '0136-01-01 BC', '0136-12-31 BC', TRUE, -136, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Han Dynasty — China''s Confucian%' AND is_group=TRUE LIMIT 1)),
('sima-qian-records', 'Sima Qian Writes Records of the Grand Historian', '0094-01-01 BC', '0091-12-31 BC', TRUE, -94, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Han Dynasty — China''s Confucian%' AND is_group=TRUE LIMIT 1)),
('han-civil-service-exams', 'Han Dynasty Establishes Civil Service Examinations', '0124-01-01 BC', '0124-12-31 BC', TRUE, -124, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Han Dynasty — China''s Confucian%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 10. Hittite Empire Established in Anatolia (-1600 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('hittite-sack-of-babylon', 'Hittite Sack of Babylon Under Mursili I', '1595-01-01 BC', '1595-12-31 BC', TRUE, -1595, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Hittite Empire%' AND is_group=TRUE LIMIT 1)),
('battle-of-kadesh', 'Battle of Kadesh — Hittites vs Ramesses II', '1274-01-01 BC', '1274-12-31 BC', TRUE, -1274, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Hittite Empire%' AND is_group=TRUE LIMIT 1)),
('hittite-egyptian-peace-treaty', 'Hittite-Egyptian Peace Treaty — First Known Peace Treaty', '1259-01-01 BC', '1259-12-31 BC', TRUE, -1259, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Hittite Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 11. Maurya Empire at Its Peak Under Ashoka (-268 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('kalinga-war', 'War of Kalinga — Ashoka''s Devastating Conquest', '0261-01-01 BC', '0261-12-31 BC', TRUE, -261, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maurya Empire at Its Peak%' AND is_group=TRUE LIMIT 1)),
('ashoka-rock-edicts', 'Ashoka''s Rock Edicts — Buddhism Spread by Royal Decree', '0257-01-01 BC', '0250-12-31 BC', TRUE, -257, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maurya Empire at Its Peak%' AND is_group=TRUE LIMIT 1)),
('third-buddhist-council', 'Third Buddhist Council at Pataliputra Under Ashoka', '0250-01-01 BC', '0250-12-31 BC', TRUE, -250, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maurya Empire at Its Peak%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 12. Maya Classic Period — Zenith of Civilization (700 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('tikal-calakmul-rivalry', 'Tikal Defeats Calakmul — Maya Superpower War', '0695-01-01', '0695-12-31', FALSE, 695, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maya Classic Period%' AND is_group=TRUE LIMIT 1)),
('palenque-pakal-tomb', 'Tomb of Pakal the Great at Palenque', '0683-01-01', '0683-12-31', FALSE, 683, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maya Classic Period%' AND is_group=TRUE LIMIT 1)),
('maya-long-count-calendar', 'Maya Long Count Calendar — Sophisticated Timekeeping', '0600-01-01', '0700-12-31', FALSE, 650, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Maya Classic Period%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 13. Minoan Civilization Dominates the Aegean (-1700 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('palace-of-knossos', 'Palace of Knossos Built — Center of Minoan Culture', '1700-01-01 BC', '1600-12-31 BC', TRUE, -1700, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Minoan Civilization%' AND is_group=TRUE LIMIT 1)),
('thera-eruption-minoan', 'Thera Eruption Devastates Minoan Civilization', '1628-01-01 BC', '1600-12-31 BC', TRUE, -1620, 0.7, 3, 8, 'natural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Minoan Civilization%' AND is_group=TRUE LIMIT 1)),
('minoan-linear-a-script', 'Linear A Script — Undeciphered Minoan Writing System', '1800-01-01 BC', '1600-12-31 BC', TRUE, -1700, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Minoan Civilization%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 14. Olmec Civilization — Mother Culture of Mesoamerica (-1200 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('olmec-colossal-heads', 'Olmec Colossal Heads Carved at San Lorenzo', '1200-01-01 BC', '0900-12-31 BC', TRUE, -1100, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Olmec Civilization%' AND is_group=TRUE LIMIT 1)),
('la-venta-olmec-center', 'La Venta Becomes Primary Olmec Ceremonial Center', '0900-01-01 BC', '0800-12-31 BC', TRUE, -900, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Olmec Civilization%' AND is_group=TRUE LIMIT 1)),
('olmec-writing-zero', 'Earliest Mesoamerican Writing and Zero Concept — Olmec Origins', '0900-01-01 BC', '0600-12-31 BC', TRUE, -800, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Olmec Civilization%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 15. Opening of the Silk Road (-130 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('zhang-qian-mission', 'Zhang Qian''s Mission to the West — Silk Road Pioneer', '0138-01-01 BC', '0126-12-31 BC', TRUE, -138, 0.7, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Opening of the Silk Road%' AND is_group=TRUE LIMIT 1)),
('silk-road-reaches-rome', 'Chinese Silk Reaches Roman Markets', '0100-01-01 BC', '0050-12-31 BC', TRUE, -80, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Opening of the Silk Road%' AND is_group=TRUE LIMIT 1)),
('buddhism-spreads-silk-road', 'Buddhism Spreads Along the Silk Road to China', '0050-01-01', '0100-12-31', FALSE, 65, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Opening of the Silk Road%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 16. Phoenician Maritime Trade Networks (-1000 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('founding-of-carthage', 'Founding of Carthage by Phoenician Colonists', '0814-01-01 BC', '0814-12-31 BC', TRUE, -814, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Phoenician Maritime%' AND is_group=TRUE LIMIT 1)),
('phoenician-alphabet-spread', 'Phoenician Alphabet Adopted by Greeks — Foundation of Western Writing', '0800-01-01 BC', '0750-12-31 BC', TRUE, -800, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Phoenician Maritime%' AND is_group=TRUE LIMIT 1)),
('phoenician-circumnavigation-africa', 'Phoenician Sailors Circumnavigate Africa for Pharaoh Necho', '0600-01-01 BC', '0597-12-31 BC', TRUE, -600, 0.6, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Phoenician Maritime%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 17. Rise of the Egyptian New Kingdom (-1550 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ahmose-i-expels-hyksos', 'Ahmose I Expels the Hyksos — New Kingdom Begins', '1550-01-01 BC', '1550-12-31 BC', TRUE, -1550, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Egyptian New Kingdom%' AND is_group=TRUE LIMIT 1)),
('hatshepsut-reign', 'Hatshepsut''s Reign — Female Pharaoh and Trade Expeditions', '1479-01-01 BC', '1458-12-31 BC', TRUE, -1479, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Egyptian New Kingdom%' AND is_group=TRUE LIMIT 1)),
('tutankhamun-reign', 'Reign of Tutankhamun — Return to Traditional Religion', '1332-01-01 BC', '1323-12-31 BC', TRUE, -1332, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Egyptian New Kingdom%' AND is_group=TRUE LIMIT 1)),
('ramesses-ii-abu-simbel', 'Ramesses II Builds Abu Simbel — Egypt''s Greatest Builder', '1264-01-01 BC', '1244-12-31 BC', TRUE, -1264, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Egyptian New Kingdom%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 18. Roman Republic — Founding Institutions (-509 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('twelve-tables-roman-law', 'Twelve Tables — Rome''s First Written Law Code', '0451-01-01 BC', '0450-12-31 BC', TRUE, -450, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Roman Republic — Founding Institutions%' AND is_group=TRUE LIMIT 1)),
('battle-of-zama', 'Battle of Zama — Scipio Defeats Hannibal', '0202-10-01 BC', '0202-10-31 BC', TRUE, -202, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Roman Republic — Founding Institutions%' AND is_group=TRUE LIMIT 1)),
('gracchi-reforms', 'Gracchi Reforms — Land Crisis and the Beginning of the End', '0133-01-01 BC', '0121-12-31 BC', TRUE, -133, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Roman Republic — Founding Institutions%' AND is_group=TRUE LIMIT 1)),
('crossing-the-rubicon', 'Caesar Crosses the Rubicon — Civil War Begins', '0049-01-10 BC', '0049-01-10 BC', TRUE, -49, 0.8, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Roman Republic — Founding Institutions%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 19. Seleucid Empire Controls the Near East (-312 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('seleucus-founds-antioch', 'Seleucus I Founds Antioch — New Eastern Capital', '0300-01-01 BC', '0300-12-31 BC', TRUE, -300, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Seleucid Empire%' AND is_group=TRUE LIMIT 1)),
('antiochus-iii-expansion', 'Antiochus III Reconquers the East — Seleucid Resurgence', '0210-01-01 BC', '0205-12-31 BC', TRUE, -210, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Seleucid Empire%' AND is_group=TRUE LIMIT 1)),
('maccabean-revolt', 'Maccabean Revolt Against Antiochus IV — Jewish Independence', '0167-01-01 BC', '0160-12-31 BC', TRUE, -167, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Seleucid Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 20. Song Dynasty China — Printing, Gunpowder, Compass (960 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('bi-sheng-movable-type', 'Bi Sheng Invents Movable Type Printing', '1040-01-01', '1048-12-31', FALSE, 1040, 0.75, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Song Dynasty China%' AND is_group=TRUE LIMIT 1)),
('song-gunpowder-weapons', 'Song Military Develops Gunpowder Weapons', '1000-01-01', '1050-12-31', FALSE, 1000, 0.7, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Song Dynasty China%' AND is_group=TRUE LIMIT 1)),
('song-magnetic-compass', 'Chinese Mariners Adopt the Magnetic Compass', '1040-01-01', '1060-12-31', FALSE, 1044, 0.7, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Song Dynasty China%' AND is_group=TRUE LIMIT 1)),
('song-paper-money', 'Song Dynasty Issues First Government Paper Money (Jiaozi)', '1024-01-01', '1024-12-31', FALSE, 1024, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Song Dynasty China%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 21. Teotihuacan — Americas' Greatest City (400 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('pyramid-of-the-sun', 'Pyramid of the Sun Completed at Teotihuacan', '0200-01-01', '0250-12-31', FALSE, 200, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Teotihuacan%' AND is_group=TRUE LIMIT 1)),
('teotihuacan-200k-population', 'Teotihuacan Reaches 200,000 — Largest City in Americas', '0400-01-01', '0450-12-31', FALSE, 400, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Teotihuacan%' AND is_group=TRUE LIMIT 1)),
('teotihuacan-tikal-connection', 'Teotihuacan Intervenes in Tikal — Mesoamerican Power Projection', '0378-01-01', '0378-12-31', FALSE, 378, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Teotihuacan%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 22. The Enlightenment — Voltaire and the Age of Reason (1750)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('encyclopedie-diderot', 'Diderot''s Encyclopédie Published — Knowledge for All', '1751-01-01', '1772-12-31', FALSE, 1751, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Enlightenment%Voltaire%' AND is_group=TRUE LIMIT 1)),
('rousseau-social-contract', 'Rousseau''s Social Contract — Popular Sovereignty', '1762-01-01', '1762-12-31', FALSE, 1762, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Enlightenment%Voltaire%' AND is_group=TRUE LIMIT 1)),
('adam-smith-wealth-of-nations', 'Adam Smith''s Wealth of Nations — Birth of Economics', '1776-03-09', '1776-03-09', FALSE, 1776, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Enlightenment%Voltaire%' AND is_group=TRUE LIMIT 1)),
('kant-critique-pure-reason', 'Kant''s Critique of Pure Reason', '1781-01-01', '1781-12-31', FALSE, 1781, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Enlightenment%Voltaire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 23. Axial Age Civilizations — Buddha, Confucius, Greek Philosophers (-500 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('confucius-analects', 'Confucius Teaches — Foundation of Chinese Philosophy', '0500-01-01 BC', '0479-12-31 BC', TRUE, -500, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Axial Age%' AND is_group=TRUE LIMIT 1)),
('socrates-trial-death', 'Trial and Death of Socrates', '0399-01-01 BC', '0399-12-31 BC', TRUE, -399, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Axial Age%' AND is_group=TRUE LIMIT 1)),
('mahavira-jainism', 'Mahavira Establishes Jainism', '0527-01-01 BC', '0527-12-31 BC', TRUE, -527, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Axial Age%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 24. Bantu Expansion — Peopling of Sub-Saharan Africa (-1000 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('bantu-ironworking-spread', 'Bantu Peoples Spread Ironworking Across Central Africa', '0500-01-01 BC', '0200-12-31 BC', TRUE, -400, 0.6, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Bantu Expansion%' AND is_group=TRUE LIMIT 1)),
('bantu-reach-east-africa', 'Bantu Migrants Reach East African Great Lakes Region', '0200-01-01', '0500-12-31', FALSE, 300, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Bantu Expansion%' AND is_group=TRUE LIMIT 1)),
('bantu-reach-southern-africa', 'Bantu Peoples Reach Southern Africa', '0300-01-01', '0500-12-31', FALSE, 400, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Bantu Expansion%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 25. Cahokia — North America's Greatest Pre-Columbian City (1050 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('monks-mound-construction', 'Monks Mound Constructed — Largest Earthwork in Americas', '1050-01-01', '1100-12-31', FALSE, 1050, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cahokia%' AND is_group=TRUE LIMIT 1)),
('cahokia-woodhenge', 'Cahokia Woodhenge — Astronomical Calendar', '1100-01-01', '1150-12-31', FALSE, 1100, 0.6, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cahokia%' AND is_group=TRUE LIMIT 1)),
('cahokia-population-peak', 'Cahokia Reaches Peak Population of ~20,000', '1100-01-01', '1150-12-31', FALSE, 1100, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cahokia%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 26. Cyrus the Great Founds the Persian Empire (-550 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('cyrus-defeats-croesus', 'Cyrus Defeats Croesus of Lydia', '0547-01-01 BC', '0546-12-31 BC', TRUE, -547, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cyrus the Great%' AND is_group=TRUE LIMIT 1)),
('cyrus-conquers-babylon', 'Cyrus Conquers Babylon — Jews Freed from Captivity', '0539-10-01 BC', '0539-10-31 BC', TRUE, -539, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cyrus the Great%' AND is_group=TRUE LIMIT 1)),
('cyrus-cylinder', 'Cyrus Cylinder — First Declaration of Human Rights', '0539-01-01 BC', '0538-12-31 BC', TRUE, -539, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Cyrus the Great%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 27. Indus Valley Civilization — Mohenjo-daro and Harappa (-2500 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('mohenjo-daro-great-bath', 'Great Bath of Mohenjo-daro — Earliest Public Water Tank', '2500-01-01 BC', '2400-12-31 BC', TRUE, -2500, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Indus Valley%' AND is_group=TRUE LIMIT 1)),
('harappa-urban-planning', 'Harappa''s Grid-Planned City — World''s First Urban Planning', '2600-01-01 BC', '2500-12-31 BC', TRUE, -2600, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Indus Valley%' AND is_group=TRUE LIMIT 1)),
('indus-script-seals', 'Indus Script Seals — Undeciphered Writing System', '2600-01-01 BC', '2400-12-31 BC', TRUE, -2500, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Indus Valley%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 28. Islamic Conquests — Spread of the Caliphate (632 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('battle-of-yarmouk', 'Battle of Yarmouk — Byzantine Levant Falls to Islam', '0636-08-15', '0636-08-20', FALSE, 636, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Islamic Conquests%Spread%' AND is_group=TRUE LIMIT 1)),
('conquest-of-jerusalem-637', 'Caliph Umar Conquers Jerusalem', '0637-01-01', '0637-12-31', FALSE, 637, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Islamic Conquests%Spread%' AND is_group=TRUE LIMIT 1)),
('battle-of-al-qadisiyyah', 'Battle of al-Qadisiyyah — Sassanid Persia Falls', '0636-11-01', '0636-11-30', FALSE, 636, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Islamic Conquests%Spread%' AND is_group=TRUE LIMIT 1)),
('conquest-of-alexandria-641', 'Arab Conquest of Alexandria — Egypt Falls', '0641-01-01', '0642-12-31', FALSE, 641, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Islamic Conquests%Spread%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 29. Kingdom of Benin — Bronze Masterpieces (1440 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ewuare-great-benin', 'Oba Ewuare the Great Rebuilds Benin City', '1440-01-01', '1473-12-31', FALSE, 1440, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Benin%' AND is_group=TRUE LIMIT 1)),
('benin-bronzes-peak', 'Benin Bronze Casting Reaches Its Peak', '1500-01-01', '1600-12-31', FALSE, 1550, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Benin%' AND is_group=TRUE LIMIT 1)),
('benin-portuguese-contact', 'Portuguese Arrive at Benin — First European Contact', '1485-01-01', '1486-12-31', FALSE, 1485, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Benin%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 30. Library of Alexandria Founded (-300 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('euclid-elements', 'Euclid Writes Elements — Foundation of Geometry', '0300-01-01 BC', '0300-12-31 BC', TRUE, -300, 0.75, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Library of Alexandria%' AND is_group=TRUE LIMIT 1)),
('eratosthenes-earth-circumference', 'Eratosthenes Calculates Earth''s Circumference', '0240-01-01 BC', '0240-12-31 BC', TRUE, -240, 0.7, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Library of Alexandria%' AND is_group=TRUE LIMIT 1)),
('archimedes-at-alexandria', 'Archimedes Studies at Alexandria — Mathematics and Engineering', '0260-01-01 BC', '0250-12-31 BC', TRUE, -260, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Library of Alexandria%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 31. Neo-Babylonian Empire Under Nebuchadnezzar II (-605 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('nebuchadnezzar-destroys-jerusalem', 'Nebuchadnezzar Destroys Jerusalem — Babylonian Captivity Begins', '0586-01-01 BC', '0586-12-31 BC', TRUE, -586, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Neo-Babylonian%Nebuchadnezzar%' AND is_group=TRUE LIMIT 1)),
('hanging-gardens-babylon', 'Hanging Gardens of Babylon — One of Seven Wonders', '0600-01-01 BC', '0580-12-31 BC', TRUE, -600, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Neo-Babylonian%Nebuchadnezzar%' AND is_group=TRUE LIMIT 1)),
('ishtar-gate-babylon', 'Ishtar Gate of Babylon Constructed', '0575-01-01 BC', '0575-12-31 BC', TRUE, -575, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Neo-Babylonian%Nebuchadnezzar%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 32. Pax Romana — Two Centuries of Roman Peace (-27 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('colosseum-completed', 'Colosseum Completed in Rome', '0080-01-01', '0080-12-31', FALSE, 80, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Pax Romana%' AND is_group=TRUE LIMIT 1)),
('trajan-column-dacian-wars', 'Trajan''s Column — Empire at Maximum Extent', '0113-01-01', '0113-12-31', FALSE, 113, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Pax Romana%' AND is_group=TRUE LIMIT 1)),
('hadrians-wall-built', 'Hadrian''s Wall Built — Northern Frontier of Empire', '0122-01-01', '0128-12-31', FALSE, 122, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Pax Romana%' AND is_group=TRUE LIMIT 1)),
('vesuvius-pompeii', 'Eruption of Vesuvius Buries Pompeii', '0079-08-24', '0079-08-25', FALSE, 79, 0.75, 3, 8, 'natural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Pax Romana%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 33. Rise of the Parthian Empire (-247 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('arsaces-i-founds-parthia', 'Arsaces I Founds Parthian Dynasty', '0247-01-01 BC', '0247-12-31 BC', TRUE, -247, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Rise of the Parthian Empire%' AND is_group=TRUE LIMIT 1)),
('mithridates-i-conquers-media', 'Mithridates I Conquers Media and Mesopotamia', '0141-01-01 BC', '0138-12-31 BC', TRUE, -141, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Rise of the Parthian Empire%' AND is_group=TRUE LIMIT 1)),
('battle-of-carrhae', 'Battle of Carrhae — Crassus Defeated, Roman Eagles Lost', '0053-06-01 BC', '0053-06-30 BC', TRUE, -53, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Rise of the Parthian Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 34. Sassanid Empire Founded (224 CE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ardashir-defeats-parthia', 'Ardashir I Defeats Last Parthian King — Sassanid Era Begins', '0224-04-01', '0224-04-30', FALSE, 224, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Sassanid Empire%' AND is_group=TRUE LIMIT 1)),
('shapur-i-captures-valerian', 'Shapur I Captures Roman Emperor Valerian', '0260-01-01', '0260-12-31', FALSE, 260, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Sassanid Empire%' AND is_group=TRUE LIMIT 1)),
('khosrow-i-golden-age', 'Khosrow I''s Golden Age — Sassanid Cultural Peak', '0531-01-01', '0579-12-31', FALSE, 550, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Sassanid Empire%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 35. Shang Dynasty — China's First Writing (-1200 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('oracle-bone-divination', 'Oracle Bone Inscriptions — Earliest Chinese Writing', '1250-01-01 BC', '1050-12-31 BC', TRUE, -1200, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Shang Dynasty%' AND is_group=TRUE LIMIT 1)),
('shang-bronze-ritual-vessels', 'Shang Bronze Ritual Vessels — Peak of Bronze Casting', '1300-01-01 BC', '1100-12-31 BC', TRUE, -1200, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Shang Dynasty%' AND is_group=TRUE LIMIT 1)),
('battle-of-muye', 'Battle of Muye — Zhou Overthrows Shang Dynasty', '1046-01-01 BC', '1046-12-31 BC', TRUE, -1046, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Shang Dynasty%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 36. The Great Wall of China — 1,500 Years of Construction (-221 BCE)
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('qin-wall-connection', 'Qin Shi Huang Connects Northern Walls — First Great Wall', '0214-01-01 BC', '0210-12-31 BC', TRUE, -214, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Great Wall of China%' AND is_group=TRUE LIMIT 1)),
('han-wall-extension', 'Han Dynasty Extends Great Wall Into Central Asia', '0121-01-01 BC', '0101-12-31 BC', TRUE, -121, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Great Wall of China%' AND is_group=TRUE LIMIT 1)),
('ming-great-wall', 'Ming Dynasty Rebuilds Great Wall — The Wall We See Today', '1474-01-01', '1644-12-31', FALSE, 1500, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Great Wall of China%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 37. Abbasid Caliphate Founded — Islamic Golden Age (750 CE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('battle-of-the-zab', 'Battle of the Zab — Abbasids Overthrow Umayyads', '0750-01-25', '0750-01-25', FALSE, 750, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Abbasid Caliphate Founded%' AND is_group=TRUE LIMIT 1)),
('founding-of-baghdad', 'Founding of Baghdad — Round City of al-Mansur', '0762-01-01', '0766-12-31', FALSE, 762, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Abbasid Caliphate Founded%' AND is_group=TRUE LIMIT 1)),
('harun-al-rashid-reign', 'Harun al-Rashid''s Reign — Golden Age of Baghdad', '0786-01-01', '0809-12-31', FALSE, 786, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Abbasid Caliphate Founded%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 38. Abbasid Revolution — Baghdad Becomes World Capital (750 CE) [has 1 child]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('abu-muslim-rebellion', 'Abu Muslim''s Rebellion in Khorasan', '0747-01-01', '0750-12-31', FALSE, 747, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Abbasid Revolution%Baghdad%' AND is_group=TRUE LIMIT 1)),
('massacre-of-umayyads', 'Abbasid Massacre of the Umayyad Dynasty', '0750-06-01', '0750-12-31', FALSE, 750, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Abbasid Revolution%Baghdad%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 39. Florentine Renaissance — Medici Patronage (1450 CE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('brunelleschi-dome', 'Brunelleschi Completes Florence Cathedral Dome', '1436-01-01', '1436-12-31', FALSE, 1436, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Florentine Renaissance%' AND is_group=TRUE LIMIT 1)),
('botticelli-birth-of-venus', 'Botticelli Paints The Birth of Venus', '1484-01-01', '1486-12-31', FALSE, 1485, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Florentine Renaissance%' AND is_group=TRUE LIMIT 1)),
('michelangelo-david', 'Michelangelo Completes David', '1504-01-01', '1504-09-08', FALSE, 1504, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Florentine Renaissance%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 40. Heian Period Japan — Tale of Genji (1000 CE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('tale-of-genji', 'Murasaki Shikibu Writes The Tale of Genji — World''s First Novel', '1000-01-01', '1012-12-31', FALSE, 1008, 0.75, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Heian Period%' AND is_group=TRUE LIMIT 1)),
('fujiwara-regency-peak', 'Fujiwara Clan Regency Reaches Peak Power', '0995-01-01', '1027-12-31', FALSE, 1000, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Heian Period%' AND is_group=TRUE LIMIT 1)),
('pillow-book-sei-shonagon', 'Sei Shōnagon Writes The Pillow Book', '0996-01-01', '1000-12-31', FALSE, 996, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Heian Period%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 41. Kingdom of Aksum — Ethiopian Empire (350 CE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('ezana-converts-christianity', 'King Ezana Converts to Christianity — First Christian Kingdom in Africa', '0330-01-01', '0340-12-31', FALSE, 330, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Aksum%' AND is_group=TRUE LIMIT 1)),
('aksum-obelisks', 'Great Stelae of Aksum Erected', '0300-01-01', '0350-12-31', FALSE, 300, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Aksum%' AND is_group=TRUE LIMIT 1)),
('aksum-conquers-kush', 'Aksum Conquers the Kingdom of Kush (Meroe)', '0350-01-01', '0350-12-31', FALSE, 350, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Kingdom of Aksum%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 42. Ptolemaic Kingdom of Egypt (-305 BCE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('rosetta-stone-decree', 'Rosetta Stone Decree Issued Under Ptolemy V', '0196-01-01 BC', '0196-12-31 BC', TRUE, -196, 0.65, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ptolemaic Kingdom%' AND is_group=TRUE LIMIT 1)),
('cleopatra-vii-reign', 'Cleopatra VII Becomes Last Ptolemaic Pharaoh', '0051-01-01 BC', '0030-08-12 BC', TRUE, -51, 0.7, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ptolemaic Kingdom%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 43. Umayyad Caliphate Established (661 CE) [has 2 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('dome-of-the-rock-built', 'Dome of the Rock Built in Jerusalem', '0687-01-01', '0691-12-31', FALSE, 691, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Umayyad Caliphate Established%' AND is_group=TRUE LIMIT 1)),
('battle-of-tours-732', 'Battle of Tours — Charles Martel Halts Islamic Expansion', '0732-10-10', '0732-10-11', FALSE, 732, 0.75, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Umayyad Caliphate Established%' AND is_group=TRUE LIMIT 1)),
('umayyad-conquest-of-spain', 'Umayyad Conquest of Visigothic Spain', '0711-01-01', '0718-12-31', FALSE, 711, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Umayyad Caliphate Established%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 44. Founding of the Roman Republic (-509 BCE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('sack-of-rome-gauls', 'Gauls Sack Rome — Republic''s Darkest Hour', '0390-01-01 BC', '0390-12-31 BC', TRUE, -390, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title = 'Founding of the Roman Republic' AND is_group=TRUE LIMIT 1)),
('conflict-of-the-orders', 'Conflict of the Orders — Plebeians Win Political Rights', '0494-01-01 BC', '0287-12-31 BC', TRUE, -450, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title = 'Founding of the Roman Republic' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 45. Ottoman Empire at Its Peak — Suleiman (1520 CE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('siege-of-vienna-1529', 'Siege of Vienna — Ottoman Expansion Into Europe Halted', '1529-09-27', '1529-10-14', FALSE, 1529, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ottoman Empire%Suleiman%' AND is_group=TRUE LIMIT 1)),
('suleymaniye-mosque-built', 'Süleymaniye Mosque Completed — Ottoman Architectural Masterpiece', '1550-01-01', '1557-12-31', FALSE, 1557, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ottoman Empire%Suleiman%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 46. Parthian Empire at Its Height (-100 BCE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('parthian-shot-tactics', 'Parthian Shot — Revolutionary Cavalry Tactics Dominate', '0100-01-01 BC', '0050-12-31 BC', TRUE, -100, 0.6, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Parthian Empire at Its Height%' AND is_group=TRUE LIMIT 1)),
('ctesiphon-capital', 'Ctesiphon Becomes Parthian Winter Capital', '0100-01-01 BC', '0050-12-31 BC', TRUE, -58, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Parthian Empire at Its Height%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 47. Polynesian Navigation — Greatest Ocean Voyages (1000 CE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('polynesian-settle-hawaii', 'Polynesians Settle Hawaii', '0800-01-01', '1000-12-31', FALSE, 900, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Polynesian Navigation%' AND is_group=TRUE LIMIT 1)),
('polynesian-reach-rapa-nui', 'Polynesians Reach Rapa Nui (Easter Island)', '0800-01-01', '1200-12-31', FALSE, 1000, 0.65, 3, 8, 'discovery', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Polynesian Navigation%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 48. Transatlantic Slave Trade at Its Brutal Height (1700 CE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('middle-passage-peak', 'Middle Passage Peaks — 80,000 Africans Transported Annually', '1780-01-01', '1790-12-31', FALSE, 1780, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Transatlantic Slave Trade at Its Brutal%' AND is_group=TRUE LIMIT 1)),
('stono-rebellion', 'Stono Rebellion — Largest Slave Uprising in British Colonies', '1739-09-09', '1739-09-09', FALSE, 1739, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Transatlantic Slave Trade at Its Brutal%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 49. Ming Dynasty Founded (1368 CE) [has 4 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('forbidden-city-built', 'Forbidden City Completed in Beijing', '1406-01-01', '1420-12-31', FALSE, 1420, 0.7, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ming Dynasty Founded%' AND is_group=TRUE LIMIT 1)),
('yongle-encyclopedia', 'Yongle Encyclopedia — World''s Largest Encyclopedia', '1403-01-01', '1408-12-31', FALSE, 1408, 0.65, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Ming Dynasty Founded%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 50. Delhi Sultanate Founded (1206 CE) [has 5 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('qutub-minar-built', 'Qutub Minar Construction Begins — Delhi''s Iconic Tower', '1199-01-01', '1220-12-31', FALSE, 1199, 0.6, 3, 8, 'cultural', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Delhi Sultanate%' AND is_group=TRUE LIMIT 1)),
('alauddin-khalji-market-reforms', 'Alauddin Khalji''s Market Reforms — Price Controls in Delhi', '1296-01-01', '1316-12-31', FALSE, 1300, 0.6, 3, 8, 'political', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Delhi Sultanate%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 51. Alexander the Great's Conquests (-334 BCE) [has 3 children]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('battle-of-issus', 'Battle of Issus — Alexander Defeats Darius III', '0333-11-05 BC', '0333-11-05 BC', TRUE, -333, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Alexander the Great%Conquests%' AND is_group=TRUE LIMIT 1)),
('siege-of-tyre', 'Siege of Tyre — Alexander''s Greatest Siege', '0332-01-01 BC', '0332-08-31 BC', TRUE, -332, 0.65, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Alexander the Great%Conquests%' AND is_group=TRUE LIMIT 1));

-- ============================================================
-- 52. Safavid Dynasty — Shia Islam (1501 CE) [has 7 children, add 0]
-- SKIP - already well populated
-- ============================================================

-- ============================================================
-- 53. Mongol Conquests — Genghis Khan (1206 CE) [has 7 children, add a few key ones]
-- ============================================================
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, importance_score, zoom_min, zoom_max, event_category, created_by, parent_event_id)
VALUES
('siege-of-samarkand-1220', 'Siege of Samarkand — Genghis Khan Destroys the Jewel of Persia', '1220-03-01', '1220-03-31', FALSE, 1220, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Mongol Conquests%Genghis%' AND is_group=TRUE LIMIT 1)),
('battle-of-ain-jalut', 'Battle of Ain Jalut — First Major Mongol Defeat by Mamluks', '1260-09-03', '1260-09-03', FALSE, 1260, 0.7, 3, 8, 'war', 'enrichment-script:groups',
  (SELECT id FROM events WHERE title ILIKE '%Mongol Conquests%Genghis%' AND is_group=TRUE LIMIT 1));

-- Now insert some causality links between related sub-events

-- Battle of Yarmouk → Conquest of Jerusalem
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'battle-of-yarmouk' AND e.slug = 'conquest-of-jerusalem-637'
ON CONFLICT DO NOTHING;

-- Battle of al-Qadisiyyah → Conquest of Alexandria
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'battle-of-al-qadisiyyah' AND e.slug = 'conquest-of-alexandria-641'
ON CONFLICT DO NOTHING;

-- Cyrus defeats Croesus → Cyrus conquers Babylon
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.7, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'cyrus-defeats-croesus' AND e.slug = 'cyrus-conquers-babylon'
ON CONFLICT DO NOTHING;

-- Cyrus conquers Babylon → Cyrus Cylinder
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'cyrus-conquers-babylon' AND e.slug = 'cyrus-cylinder'
ON CONFLICT DO NOTHING;

-- Battle of Gaixia → Emperor Gaozu
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'battle-of-gaixia' AND e.slug = 'emperor-gaozu-han'
ON CONFLICT DO NOTHING;

-- Chandragupta defeats Nanda → Chandragupta defeats Seleucus
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.7, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'chandragupta-defeats-nanda' AND e.slug = 'chandragupta-defeats-seleucus'
ON CONFLICT DO NOTHING;

-- Kalinga War → Ashoka Rock Edicts
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'kalinga-war' AND e.slug = 'ashoka-rock-edicts'
ON CONFLICT DO NOTHING;

-- Ashoka Rock Edicts → Third Buddhist Council
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.7, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'ashoka-rock-edicts' AND e.slug = 'third-buddhist-council'
ON CONFLICT DO NOTHING;

-- Ahmose expels Hyksos → Hatshepsut
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'ahmose-i-expels-hyksos' AND e.slug = 'hatshepsut-reign'
ON CONFLICT DO NOTHING;

-- Zhang Qian → Buddhism spreads Silk Road
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'zhang-qian-mission' AND e.slug = 'buddhism-spreads-silk-road'
ON CONFLICT DO NOTHING;

-- Nebuchadnezzar destroys Jerusalem → Ishtar Gate
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.4, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'nebuchadnezzar-destroys-jerusalem' AND e.slug = 'ishtar-gate-babylon'
ON CONFLICT DO NOTHING;

-- Battle of the Zab → Founding of Baghdad
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'battle-of-the-zab' AND e.slug = 'founding-of-baghdad'
ON CONFLICT DO NOTHING;

-- Founding of Baghdad → Harun al-Rashid
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'founding-of-baghdad' AND e.slug = 'harun-al-rashid-reign'
ON CONFLICT DO NOTHING;

-- Harun al-Rashid → House of Wisdom
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'harun-al-rashid-reign' AND e.slug = 'house-of-wisdom-founded'
ON CONFLICT DO NOTHING;

-- House of Wisdom → Al-Khwarizmi
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'house-of-wisdom-founded' AND e.slug = 'al-khwarizmi-algebra'
ON CONFLICT DO NOTHING;

-- Umayyad conquest of Spain → Battle of Tours
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'umayyad-conquest-of-spain' AND e.slug = 'battle-of-tours-732'
ON CONFLICT DO NOTHING;

-- Encyclopedie → Rousseau Social Contract
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'encyclopedie-diderot' AND e.slug = 'rousseau-social-contract'
ON CONFLICT DO NOTHING;

-- Gracchi reforms → Crossing the Rubicon
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'gracchi-reforms' AND e.slug = 'crossing-the-rubicon'
ON CONFLICT DO NOTHING;

-- Thera eruption → decline of Minoan
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'thera-eruption-minoan' AND e.slug = 'palace-of-knossos'
ON CONFLICT DO NOTHING;

-- Phoenician alphabet → Founding of Carthage (cultural spread)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.4, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'phoenician-alphabet-spread' AND e.slug = 'founding-of-carthage'
ON CONFLICT DO NOTHING;

-- Brunelleschi dome → Botticelli
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.4, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'brunelleschi-dome' AND e.slug = 'botticelli-birth-of-venus'
ON CONFLICT DO NOTHING;

-- Botticelli → Michelangelo David
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, created_by)
SELECT c.id, e.id, 'contributing', 0.4, 'enrichment-script:groups'
FROM events c, events e
WHERE c.slug = 'botticelli-birth-of-venus' AND e.slug = 'michelangelo-david'
ON CONFLICT DO NOTHING;

COMMIT;
