-- Classical Greece & Rome Deep-Dive (-500 to 500 CE)
-- Fills gaps in battles, political events, and cultural milestones

-- ============================================================
-- EVENTS (only those not already seeded)
-- ============================================================

-- Roman Republic founded
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('roman-republic-founded-509bce', 'Roman Republic Founded — Overthrow of the Monarchy', '0509-01-01 BC', '0509-12-31 BC', true, -509, 'Roman Republic', 'Italy', 0.9, 'political', 'seed-script:v2', 'Europe', 'Roman_Republic', ST_SetSRID(ST_MakePoint(12.4964, 41.9028), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Battle of Leuctra — Theban hegemony
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('battle-of-leuctra-371bce', 'Battle of Leuctra — Thebes Shatters Spartan Dominance', '0371-01-01 BC', '0371-12-31 BC', true, -371, 'Classical Greece', 'Greece', 0.8, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Leuctra', ST_SetSRID(ST_MakePoint(23.15, 38.37), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Battle of Cannae
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('battle-of-cannae-216bce', 'Battle of Cannae — Hannibal Annihilates Roman Legions', '0216-01-01 BC', '0216-12-31 BC', true, -216, 'Roman Republic', 'Italy', 0.85, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Cannae', ST_SetSRID(ST_MakePoint(16.13, 41.31), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Rome conquers Greece (destruction of Corinth)
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('rome-conquers-greece-146bce', 'Rome Conquers Greece — Destruction of Corinth', '0146-01-01 BC', '0146-12-31 BC', true, -146, 'Roman Republic', 'Greece', 0.85, 'military', 'seed-script:v2', 'Europe', 'Battle_of_Corinth_(146_BC)', ST_SetSRID(ST_MakePoint(22.88, 37.91), 4326))
ON CONFLICT (slug) DO NOTHING;

-- Library of Alexandria burnt by Caesar
INSERT INTO events (slug, title, date_earliest, date_latest, is_bce, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, region, wikipedia_slug, geo_point)
VALUES ('library-of-alexandria-burnt-47bce', 'Library of Alexandria Burnt During Caesar''s Civil War', '0047-01-01 BC', '0047-12-31 BC', true, -47, 'Roman Republic', 'Egypt', 0.75, 'cultural', 'seed-script:v2', 'North Africa', 'Destruction_of_the_Library_of_Alexandria', ST_SetSRID(ST_MakePoint(29.9187, 31.2001), 4326))
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Salamis → Periclean Golden Age
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Greek naval victory at Salamis secured Athens'' dominance and funded the Periclean Golden Age', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'battle-of-salamis-greek-naval-victory-480bce' AND e.slug = 'pericles-golden-age-athens-461bce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Try alternate slug combos for Salamis → Pericles
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Greek naval victory at Salamis secured Athens'' dominance and funded the Periclean Golden Age', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Battle of Salamis%' AND c.year_approx = -480
  AND e.title LIKE 'Pericles%' AND e.year_approx = -461
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Periclean Golden Age → Parthenon
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Pericles directed Athenian treasury surplus to build the Parthenon', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Pericles%Golden Age%' AND c.year_approx = -461
  AND e.title LIKE 'Parthenon%' AND e.year_approx = -447
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Peloponnesian War → weakening of Athens
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Peloponnesian War exhausted Athens, ending its hegemony and opening path for Macedon', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Peloponnesian War%' AND c.year_approx = -431
  AND e.title LIKE 'End of the Peloponnesian War%' AND e.year_approx = -404
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Athens weakened → Philip II rises
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Greek exhaustion after Peloponnesian War enabled Macedonian expansion under Philip II', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'End of the Peloponnesian War%' AND c.year_approx = -404
  AND e.title LIKE 'Philip II%' AND e.year_approx = -338
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Philip II → Alexander's conquests
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Philip II unified Greece and built the army Alexander used to conquer Persia', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Philip II%' AND c.year_approx = -338
  AND e.title LIKE 'Alexander the Great%Conquests%' AND e.year_approx = -334
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Alexander's conquests → Death / Hellenistic world
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Alexander''s sudden death fragmented his empire into Hellenistic successor kingdoms', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Alexander the Great%Conquests%' AND c.year_approx = -334
  AND e.title LIKE 'Death of Alexander%' AND e.year_approx = -323
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Alexander dies → Wars of the Diadochi
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Alexander''s death triggered the Wars of the Diadochi as generals fought for succession', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Death of Alexander%' AND c.year_approx = -323
  AND e.title LIKE 'Wars of the Diadochi%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- First Punic War → Second Punic War (Hannibal)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Carthage''s humiliation in the First Punic War drove Hannibal''s revenge invasion', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'First Punic War%' AND c.year_approx = -264
  AND e.title LIKE 'Second Punic War%' AND e.year_approx = -218
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Second Punic War → Third Punic War (Carthage destroyed)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Rome''s near-destruction by Hannibal fueled permanent hostility leading to Carthage''s annihilation', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Second Punic War%' AND c.year_approx = -218
  AND e.title LIKE 'Third Punic War%' AND e.year_approx = -146
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Gracchi reforms → Caesar crosses Rubicon
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Gracchi reforms exposed deep fractures in the Republic that led to strongman politics and Caesar', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Gracchi%' AND c.year_approx = -133
  AND e.title LIKE 'Caesar Crosses the Rubicon%' AND e.year_approx = -49
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Caesar crosses Rubicon → Caesar assassinated
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Caesar''s seizure of power made his assassination by Senate conspirators inevitable', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Caesar Crosses the Rubicon%' AND c.year_approx = -49
  AND e.title LIKE 'Assassination of Julius Caesar%' AND e.year_approx = -44
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Caesar assassinated → Battle of Actium
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Caesar''s assassination triggered civil wars culminating in Actium', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Assassination of Julius Caesar%' AND c.year_approx = -44
  AND e.title LIKE 'Battle of Actium%' AND e.year_approx = -31
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Battle of Actium → Augustus becomes emperor
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Victory at Actium gave Octavian sole control, becoming Augustus', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Battle of Actium%' AND c.year_approx = -31
  AND e.title LIKE 'Augustus%Emperor%' AND e.year_approx = -27
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Augustus / Pax Romana → spread of Christianity
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Pax Romana provided stable roads and unified empire enabling Christianity''s spread', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Pax Romana%' AND c.year_approx = -27
  AND e.title LIKE 'Paul%Missionary%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Crucifixion → Paul's missions
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The crucifixion and resurrection claims launched the apostolic mission', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Crucifixion of Jesus%' AND c.year_approx = 30
  AND e.title LIKE 'Paul%Missionary%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Paul's missions → Council of Nicaea
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Paul''s Gentile mission grew Christianity to the point of requiring imperial doctrinal unity at Nicaea', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Paul%Missionary%'
  AND e.title LIKE 'Council of Nicaea%' AND e.year_approx = 325
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Edict of Milan → Council of Nicaea
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Constantine''s legalization of Christianity led directly to the Council of Nicaea', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Edict of Milan%' AND c.year_approx = 313
  AND e.title LIKE 'Council of Nicaea%' AND e.year_approx = 325
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Crisis of the Third Century → Diocletian's reforms
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'The near-collapse of the Third Century crisis demanded Diocletian''s radical administrative reforms', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Crisis of the Third Century%' AND c.year_approx = 235
  AND e.title LIKE 'Diocletian%' AND e.year_approx = 284
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Visigoths sack Rome → Fall of Western Roman Empire
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'The sack of Rome in 410 demonstrated the empire''s vulnerability, accelerating its collapse', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Visigoths Sack Rome%' AND c.year_approx = 410
  AND e.title LIKE 'Fall of the Western Roman Empire%' AND e.year_approx = 476
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Leuctra → Philip II (Theban hegemony weakened Sparta, but then Thebes too faded)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Leuctra broke Spartan power but Theban hegemony was brief, leaving a power vacuum Philip exploited', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.slug = 'battle-of-leuctra-371bce'
  AND e.title LIKE 'Philip II%' AND e.year_approx = -338
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Socrates → Plato's Academy
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Socrates'' execution inspired his student Plato to found the Academy and preserve Socratic philosophy', 'seed-script:v2', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Trial and Death of Socrates%' AND c.year_approx = -399
  AND e.title LIKE 'Plato Founds the Academy%' AND e.year_approx = -387
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
