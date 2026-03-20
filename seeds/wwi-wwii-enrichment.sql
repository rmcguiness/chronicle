-- WWI & WWII Deep-Dive Enrichment
-- Added 2026-03-20
-- ~25 new events filling gaps in WWI battles, interwar period, WWII theaters, Holocaust
-- ~15 causality links
--
-- Already seeded (confirmed): Franz Ferdinand assassination, Marne, trench warfare,
-- Gallipoli, Verdun, Somme, Zimmermann Telegram, Russian Revolution(s), US enters WWI,
-- Armistice, Treaty of Versailles, League of Nations, Ottoman collapse, Mussolini,
-- Beer Hall Putsch, Great Depression, Hitler Chancellor, Nuremberg Laws, Spanish Civil War,
-- Anschluss, Kristallnacht, Munich Agreement, Molotov-Ribbentrop, Germany invades Poland,
-- Dunkirk, Battle of Britain, Barbarossa, Pearl Harbor, Wannsee Conference, Stalingrad,
-- Midway, D-Day, Hiroshima/Nagasaki, Germany surrenders, Nuremberg Trials, UN founded,
-- Marshall Plan, Israel declared, NATO founded, Warsaw Ghetto Uprising, Nanking Massacre

-- ============================================================
-- MISSING WWI EVENTS
-- ============================================================

-- July Crisis (1914)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('july-crisis-1914', 'July Crisis — Diplomatic Failure Leads to World War', '1914-07-23', '1914-07-28', 1914, 'World War I', 'Vienna, Austria', 0.85, 'politics', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(16.3738, 48.2082), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Ottoman Empire enters war (1914)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('ottoman-enters-wwi-1914', 'Ottoman Empire Enters WWI — War Expands to Middle East', '1914-10-29', '1914-10-29', 1914, 'World War I', 'Istanbul, Turkey', 0.75, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(28.9784, 41.0082), 4326), 'Middle East')
ON CONFLICT (slug) DO NOTHING;

-- Battle of Jutland (1916)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('battle-of-jutland-1916', 'Battle of Jutland — Largest Naval Battle in History', '1916-05-31', '1916-06-01', 1916, 'World War I', 'North Sea, off Denmark', 0.80, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(6.0, 57.0), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Spring Offensive (1918)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('spring-offensive-1918', 'Spring Offensive — Germany''s Last Gamble on the Western Front', '1918-03-21', '1918-07-18', 1918, 'World War I', 'Picardy, France', 0.80, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(2.8333, 49.8333), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MISSING INTERWAR EVENTS
-- ============================================================

-- Weimar Republic instability (general marker)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('weimar-republic-instability', 'Weimar Republic — Democratic Fragility and Extremism', '1919-08-11', '1933-01-30', 1919, 'Interwar Period', 'Berlin, Germany', 0.75, 'politics', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(13.4050, 52.5200), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- MISSING WWII EVENTS
-- ============================================================

-- Phoney War (1939-1940)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('phoney-war-1939', 'Phoney War — Eight Months of Inaction on the Western Front', '1939-09-03', '1940-05-10', 1939, 'World War II', 'France', 0.65, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Atlantic Charter (1941)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('atlantic-charter-1941', 'Atlantic Charter — Roosevelt and Churchill Define Allied War Aims', '1941-08-14', '1941-08-14', 1941, 'World War II', 'Placentia Bay, Newfoundland', 0.75, 'politics', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(-54.0, 47.8), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Allied invasion of North Africa (1942)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('operation-torch-1942', 'Operation Torch — Allied Invasion of North Africa', '1942-11-08', '1943-05-13', 1942, 'World War II', 'Morocco / Algeria / Tunisia', 0.78, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(-3.0, 34.0), 4326), 'Africa')
ON CONFLICT (slug) DO NOTHING;

-- Holocaust as distinct event
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('the-holocaust-1941-1945', 'The Holocaust — Systematic Murder of Six Million Jews', '1941-06-01', '1945-05-08', 1941, 'World War II', 'Europe (multiple countries)', 0.95, 'atrocity', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(19.5, 51.5), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Auschwitz-Birkenau construction (1941)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('auschwitz-birkenau-1941', 'Auschwitz-Birkenau — Construction of the Largest Death Camp', '1941-10-01', '1942-03-01', 1941, 'World War II', 'Oświęcim, Poland', 0.85, 'atrocity', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(19.2034, 50.0343), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Battle of Guadalcanal (1942)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('guadalcanal-1942', 'Battle of Guadalcanal — First Major Allied Offensive in the Pacific', '1942-08-07', '1943-02-09', 1942, 'World War II', 'Guadalcanal, Solomon Islands', 0.80, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(160.0, -9.4333), 4326), 'Oceania')
ON CONFLICT (slug) DO NOTHING;

-- Battle of Leyte Gulf (1944)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('leyte-gulf-1944', 'Battle of Leyte Gulf — Largest Naval Battle in Modern History', '1944-10-23', '1944-10-26', 1944, 'World War II', 'Leyte Gulf, Philippines', 0.80, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(125.0, 10.5), 4326), 'East Asia')
ON CONFLICT (slug) DO NOTHING;

-- Battle of the Bulge (1944)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('battle-of-the-bulge-1944', 'Battle of the Bulge — Germany''s Last Major Offensive', '1944-12-16', '1945-01-25', 1944, 'World War II', 'Ardennes, Belgium/Luxembourg', 0.82, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(5.9, 50.2), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Battle of Iwo Jima (1945)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('iwo-jima-1945', 'Battle of Iwo Jima — Iconic Pacific Island Assault', '1945-02-19', '1945-03-26', 1945, 'World War II', 'Iwo Jima, Japan', 0.78, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(141.3222, 24.7840), 4326), 'East Asia')
ON CONFLICT (slug) DO NOTHING;

-- Firebombing of Dresden (1945)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('firebombing-of-dresden-1945', 'Firebombing of Dresden — Controversial Allied Bombing', '1945-02-13', '1945-02-15', 1945, 'World War II', 'Dresden, Germany', 0.75, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(13.7373, 51.0504), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Death of Hitler (1945)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('death-of-hitler-1945', 'Death of Adolf Hitler — Suicide in the Führerbunker', '1945-04-30', '1945-04-30', 1945, 'World War II', 'Berlin, Germany', 0.85, 'politics', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(13.3833, 52.5128), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- V-J Day (1945)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('vj-day-1945', 'V-J Day — Japan Surrenders, World War II Ends', '1945-08-15', '1945-09-02', 1945, 'World War II', 'Tokyo Bay, Japan', 0.90, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(139.7700, 35.3200), 4326), 'East Asia')
ON CONFLICT (slug) DO NOTHING;

-- Battle of Coral Sea (1942) — Midway exists but Coral Sea doesn't
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('coral-sea-1942', 'Battle of the Coral Sea — First Carrier-vs-Carrier Naval Battle', '1942-05-04', '1942-05-08', 1942, 'World War II', 'Coral Sea, Pacific', 0.75, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(155.0, -15.0), 4326), 'Oceania')
ON CONFLICT (slug) DO NOTHING;

-- Fall of Singapore (1942) — significant gap
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('fall-of-singapore-1942', 'Fall of Singapore — Worst British Military Defeat', '1942-02-15', '1942-02-15', 1942, 'World War II', 'Singapore', 0.78, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(103.8198, 1.3521), 4326), 'Southeast Asia')
ON CONFLICT (slug) DO NOTHING;

-- Battle of El Alamein (1942)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('el-alamein-1942', 'Battle of El Alamein — Turning Point in North Africa', '1942-10-23', '1942-11-11', 1942, 'World War II', 'El Alamein, Egypt', 0.78, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(28.9500, 30.8300), 4326), 'Middle East')
ON CONFLICT (slug) DO NOTHING;

-- Allied Invasion of Italy / Sicily (1943)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('invasion-of-sicily-1943', 'Allied Invasion of Sicily — Italy Campaign Begins', '1943-07-09', '1943-08-17', 1943, 'World War II', 'Sicily, Italy', 0.75, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(14.2681, 37.5999), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Italy Surrenders (1943)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('italy-surrenders-1943', 'Italy Surrenders — Mussolini Overthrown, Allies Advance', '1943-09-08', '1943-09-08', 1943, 'World War II', 'Rome, Italy', 0.75, 'military', 'seed-enrichment:wwi-wwii', 'approved', ST_SetSRID(ST_MakePoint(12.4964, 41.9028), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS (~15)
-- ============================================================

-- Franz Ferdinand → July Crisis
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Assassination triggered the July Crisis diplomatic failure', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.slug = 'assassination-franz-ferdinand-1914' AND e.slug = 'july-crisis-1914'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- July Crisis → Germany declares war on Russia (proxy for WWI outbreak)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Diplomatic failure in July Crisis led to declarations of war', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.slug = 'july-crisis-1914' AND e.title LIKE 'Germany Declares War on Russia%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Treaty of Versailles → Weimar instability
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Harsh Versailles terms fueled political extremism in Weimar Germany', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Treaty of Versailles%' AND e.slug = 'weimar-republic-instability'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Weimar instability → Hitler becomes Chancellor
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Weimar political fragility enabled Hitler''s rise to power', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.slug = 'weimar-republic-instability' AND e.title LIKE 'Hitler Becomes Chancellor%' LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Great Depression → Hitler becomes Chancellor
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.80, 'Economic devastation of Great Depression boosted Nazi support', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Great Depression — Wall Street%' AND e.title LIKE 'Hitler Becomes Chancellor%' LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Kristallnacht → Holocaust
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Kristallnacht escalated persecution toward systematic genocide', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Kristallnacht%' AND e.slug = 'the-holocaust-1941-1945' LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Wannsee Conference → Holocaust
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Wannsee Conference formalized the Final Solution', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Wannsee Conference%' AND e.slug = 'the-holocaust-1941-1945'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Holocaust → Universal Declaration of Human Rights
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Horror of the Holocaust drove creation of universal human rights framework', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.slug = 'the-holocaust-1941-1945' AND e.title LIKE 'Universal Declaration of Human Rights%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Holocaust → Declaration of State of Israel
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.80, 'Holocaust accelerated international support for Jewish state', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.slug = 'the-holocaust-1941-1945' AND e.title LIKE 'Declaration of the State of Israel%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Stalingrad → D-Day
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.75, 'German defeat at Stalingrad weakened Eastern Front, enabling Western invasion', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Battle of Stalingrad%' AND e.title LIKE 'D-Day%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- D-Day → Germany surrenders
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Normandy invasion opened second front leading to German defeat', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'D-Day%' AND e.title LIKE 'Germany Surrenders%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hiroshima → V-J Day
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Atomic bombings forced Japanese surrender', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Atomic Bombing of Hiroshima%' AND e.slug = 'vj-day-1945'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Poison gas → Chemical weapons (using existing event)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.80, 'WWI chemical warfare horrors led to Geneva Protocol banning chemical weapons', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'First Large-Scale Poison Gas%' AND e.title LIKE 'Treaty of Versailles%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Molotov-Ribbentrop → Germany invades Poland
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Non-aggression pact gave Hitler freedom to invade Poland', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Molotov-Ribbentrop%' AND e.title LIKE 'Germany Invades Poland%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Pearl Harbor → Midway
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.80, 'Pearl Harbor brought US into Pacific war, leading to decisive Midway engagement', 'seed-enrichment:wwi-wwii', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Japanese Attack on Pearl Harbor%' AND e.title LIKE 'Battle of Midway%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
