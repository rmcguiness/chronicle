-- Cold War Specifics Enrichment (1947-1975)
-- Added 2026-03-20
-- ~20 new events filling gaps in Cold War crises, proxy wars, covert operations
-- ~15 causality links

-- Already seeded (confirmed via DB query):
-- Marshall Plan (1948), Berlin Blockade and Airlift (1948), NATO Founded (1949),
-- Soviet Union Tests First Atomic Bomb (1949), Chinese Communist Revolution (1949),
-- Korean War (1950), Hydrogen Bomb (1952), Korean War Armistice (1953),
-- Dien Bien Phu (1954), Warsaw Pact Founded (1955), Hungarian Revolution (1956),
-- Sputnik (1957), Berlin Wall Built (1961), Bay of Pigs (1961),
-- Cuban Missile Crisis (1962), Partial Nuclear Test Ban Treaty (1963),
-- Kennedy Assassination (1963), Gulf of Tonkin (1964), US Combat Troops Enter Vietnam (1965),
-- Tet Offensive (1968), Prague Spring (1968), Kent State (1970),
-- Nixon Opens Relations with China (1972), Détente (1972), Watergate (1972),
-- OPEC Oil Embargo (1973), Pinochet Coup (1973), Nixon Resigns (1974),
-- Fall of Saigon (1975), Helsinki Accords (1975)

-- MISSING events to add:

-- CIA Founded (1947)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('cia-founded-1947', 'CIA Founded — US Intelligence Agency Established', '1947-09-18', '1947-09-18', 1947, 'Early Cold War', 'Washington, D.C., USA', 0.72, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-77.0147, 38.8951), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- West Germany and East Germany Founded (1949)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('two-germanys-founded-1949', 'Two Germanys Founded — Cold War Divides Europe', '1949-05-23', '1949-10-07', 1949, 'Early Cold War', 'Germany', 0.78, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(13.4050, 52.5200), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- McCarthy Hearings (1950)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('mccarthy-red-scare-1950', 'McCarthy Hearings — Red Scare Grips America', '1950-02-09', '1954-12-02', 1950, 'Early Cold War', 'Washington, D.C., USA', 0.75, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-77.0090, 38.8899), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Inchon Landing (1950)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('inchon-landing-1950', 'Battle of Inchon — MacArthur Turns the Korean War', '1950-09-15', '1950-09-19', 1950, 'Early Cold War', 'Incheon, South Korea', 0.72, 'military', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(126.7052, 37.4563), 4326), 'Asia')
ON CONFLICT (slug) DO NOTHING;

-- NSA Founded (1952)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('nsa-founded-1952', 'NSA Founded — US Signals Intelligence Agency', '1952-11-04', '1952-11-04', 1952, 'Early Cold War', 'Fort Meade, Maryland, USA', 0.68, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-76.7714, 39.1087), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- CIA Overthrows Mossadegh in Iran (1953)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('cia-iran-coup-1953', 'CIA Overthrows Mossadegh in Iran — Operation Ajax', '1953-08-15', '1953-08-19', 1953, 'Early Cold War', 'Tehran, Iran', 0.75, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(51.3890, 35.6892), 4326), 'Middle East')
ON CONFLICT (slug) DO NOTHING;

-- Guatemalan Coup (1954)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('guatemala-coup-1954', 'CIA-Backed Guatemalan Coup — Árbenz Overthrown', '1954-06-18', '1954-06-27', 1954, 'Early Cold War', 'Guatemala City, Guatemala', 0.70, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-90.5069, 14.6349), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- KGB Established (1954)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('kgb-established-1954', 'KGB Established — Soviet State Security', '1954-03-13', '1954-03-13', 1954, 'Early Cold War', 'Moscow, Soviet Union', 0.70, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Khrushchev "We Will Bury You" (1956)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('khrushchev-bury-you-1956', 'Khrushchev Declares "We Will Bury You" — Cold War Rhetoric Peaks', '1956-11-18', '1956-11-18', 1956, 'Cold War', 'Moscow, Soviet Union', 0.68, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- U-2 Spy Plane Incident (1960)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('u2-spy-plane-1960', 'U-2 Spy Plane Shot Down Over Soviet Union', '1960-05-01', '1960-05-01', 1960, 'Cold War', 'Sverdlovsk, Soviet Union', 0.75, 'military', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(60.6122, 56.8389), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Eisenhower Military-Industrial Complex Speech (1961)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('eisenhower-mic-speech-1961', 'Eisenhower Warns of the Military-Industrial Complex', '1961-01-17', '1961-01-17', 1961, 'Cold War', 'Washington, D.C., USA', 0.72, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-77.0369, 38.8977), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- My Lai Massacre (1968)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('my-lai-massacre-1968', 'My Lai Massacre — US War Crime in Vietnam', '1968-03-16', '1968-03-16', 1968, 'Cold War', 'Quang Ngai, Vietnam', 0.78, 'military', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(108.8000, 15.1500), 4326), 'Asia')
ON CONFLICT (slug) DO NOTHING;

-- Non-Proliferation Treaty (1968)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('npt-signed-1968', 'Nuclear Non-Proliferation Treaty Signed', '1968-07-01', '1968-07-01', 1968, 'Cold War', 'Washington/Moscow/London', 0.80, 'diplomatic', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-77.0369, 38.8977), 4326), 'Global')
ON CONFLICT (slug) DO NOTHING;

-- Brezhnev Doctrine (1968)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('brezhnev-doctrine-1968', 'Brezhnev Doctrine — Soviet Right to Intervene in Socialist States', '1968-11-13', '1968-11-13', 1968, 'Cold War', 'Moscow, Soviet Union', 0.72, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Ostpolitik (1970)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('ostpolitik-1970', 'Ostpolitik — West Germany Normalizes Relations with the East', '1970-08-12', '1970-08-12', 1970, 'Cold War', 'Moscow/Bonn', 0.72, 'diplomatic', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(7.0982, 50.7374), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- SALT I Agreement (1972)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('salt-i-agreement-1972', 'SALT I Agreement — First Nuclear Arms Limitation Treaty', '1972-05-26', '1972-05-26', 1972, 'Cold War', 'Moscow, Soviet Union', 0.82, 'diplomatic', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Paris Peace Accords (1973)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('paris-peace-accords-1973', 'Paris Peace Accords — US Withdrawal from Vietnam', '1973-01-27', '1973-01-27', 1973, 'Cold War', 'Paris, France', 0.80, 'diplomatic', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Johnson Great Society (1964)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('great-society-1964', 'Johnson''s Great Society — Medicare, Civil Rights, War on Poverty', '1964-05-22', '1964-05-22', 1964, 'Cold War', 'Washington, D.C., USA', 0.75, 'political', 'seed-enrichment:cold-war', 'approved', ST_SetSRID(ST_MakePoint(-77.0369, 38.8977), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- =====================
-- CAUSALITY LINKS
-- =====================

-- Berlin Blockade → NATO Founded
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Soviet blockade of Berlin convinced Western nations to form NATO', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.slug = 'berlin-blockade-and-airlift' AND e.slug = 'nato-founded-western-military-alliance'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- But slug might differ, let me use title matching instead for robustness
-- Let me use a pattern that works with the actual slugs

-- NATO Founded → Arms Race (Soviet bomb)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.70, 'NATO formation accelerated Soviet nuclear weapons program', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'NATO Founded%' AND e.title LIKE 'Soviet Union Tests First%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Sputnik → NASA Founded
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Sputnik shock directly led to creation of NASA', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Soviet Sputnik%' AND e.title LIKE 'NASA Founded%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Sputnik → Apollo 11
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.85, 'Sputnik launched the space race culminating in Apollo 11', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Soviet Sputnik%' AND e.title = 'Apollo 11 — First Moon Landing'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Gulf of Tonkin → US troops in Vietnam
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Gulf of Tonkin Resolution authorized military escalation in Vietnam', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Gulf of Tonkin%' AND e.title LIKE 'US Combat Troops%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- US troops in Vietnam → Tet Offensive
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.75, 'US escalation led to North Vietnamese counter-offensive', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'US Combat Troops%' AND e.title LIKE 'Tet Offensive%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Tet Offensive → Paris Peace Accords
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.80, 'Tet Offensive turned American public opinion against the war, leading to negotiations', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Tet Offensive%' AND e.title LIKE 'Paris Peace Accords%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Paris Peace Accords → Fall of Saigon
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'US withdrawal left South Vietnam vulnerable to North Vietnamese conquest', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Paris Peace Accords%' AND e.title = 'Fall of Saigon — End of the Vietnam War'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- CIA Iran Coup → Iranian Revolution (foreshadow)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.75, 'CIA coup installed Shah whose authoritarian rule fueled 1979 revolution', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.slug = 'cia-iran-coup-1953' AND e.title LIKE '%Iranian Revolution%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Nixon China visit → SALT I
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.70, 'Opening to China gave Nixon leverage for Soviet arms negotiations', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Nixon Opens Relations with China%' AND e.slug = 'salt-i-agreement-1972'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- SALT I → Détente
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.80, 'SALT I was the centerpiece achievement of détente', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.slug = 'salt-i-agreement-1972' AND e.title LIKE 'Détente%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Cuban Missile Crisis → Nuclear Test Ban Treaty
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Near-nuclear war during missile crisis motivated test ban negotiations', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Cuban Missile Crisis — 13 Days%' AND e.title LIKE 'Partial Nuclear Test Ban%'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Test Ban Treaty → NPT
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.80, 'Test ban treaty paved the way for broader non-proliferation agreement', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Partial Nuclear Test Ban%' AND e.slug = 'npt-signed-1968'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Prague Spring → Brezhnev Doctrine
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.90, 'Soviet invasion of Czechoslovakia was justified by the Brezhnev Doctrine', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Prague Spring%' AND e.slug = 'brezhnev-doctrine-1968'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);

-- Berlin Blockade → Two Germanys
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Berlin Blockade cemented the division of Germany into two states', 'seed-enrichment:cold-war', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Berlin Blockade%' AND e.slug = 'two-germanys-founded-1949'
AND NOT EXISTS (SELECT 1 FROM causality_links cl WHERE cl.cause_event_id = c.id AND cl.effect_event_id = e.id);
