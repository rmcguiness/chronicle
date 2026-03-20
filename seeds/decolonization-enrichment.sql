-- Decolonization & Independence Movements (1940s–1970s) Enrichment
-- Added 2026-03-20
-- ~35 new events + ~20 causality links

-- ============================================================
-- EVENTS
-- ============================================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, region, wikipedia_slug, article_summary, created_by, review_status)
VALUES

-- SOUTH ASIA
('pakistan-founded-1947', 'Pakistan Founded — Partition Creates New Nation', '1947-08-14', '1947-08-14', 1947, false, 'political', ARRAY['independence','partition','pakistan','south-asia','jinnah'], 0.8, 'Pakistan', 'British India', ST_SetSRID(ST_MakePoint(73.0479, 33.6844), 4326), 'south_asia', 'Pakistan_Movement', 'Pakistan was created as a separate Muslim-majority nation during the Partition of British India. Muhammad Ali Jinnah became its first Governor-General. The partition caused one of the largest mass migrations in history, with 10–20 million displaced and up to 2 million killed in sectarian violence.', 'enrichment-bot', 'approved'),

('gandhi-assassinated-1948', 'Assassination of Mahatma Gandhi', '1948-01-30', '1948-01-30', 1948, false, 'political', ARRAY['assassination','gandhi','india','nonviolence'], 0.8, 'India', 'Republic of India', ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326), 'south_asia', 'Assassination_of_Mahatma_Gandhi', 'Mahatma Gandhi was assassinated by Hindu nationalist Nathuram Godse in New Delhi. Gandhi''s philosophy of nonviolent resistance had been central to Indian independence and influenced civil rights movements worldwide.', 'enrichment-bot', 'approved'),

('first-indo-pak-war-1947', 'First Indo-Pakistani War — Kashmir Conflict Begins', '1947-10-22', '1949-01-01', 1947, false, 'military', ARRAY['war','kashmir','india','pakistan','territorial'], 0.7, 'India / Pakistan', 'Post-Partition South Asia', ST_SetSRID(ST_MakePoint(74.7973, 34.0837), 4326), 'south_asia', 'Indo-Pakistani_War_of_1947–1948', 'The first military conflict between India and Pakistan over the princely state of Kashmir. It ended with a UN-brokered ceasefire and the establishment of the Line of Control, which remains disputed to this day.', 'enrichment-bot', 'approved'),

('ceylon-independence-1948', 'Ceylon (Sri Lanka) Independence from Britain', '1948-02-04', '1948-02-04', 1948, false, 'political', ARRAY['independence','sri-lanka','ceylon','decolonization','british-empire'], 0.65, 'Sri Lanka', 'British Ceylon', ST_SetSRID(ST_MakePoint(79.8612, 6.9271), 4326), 'south_asia', 'Dominion_of_Ceylon', 'Ceylon gained independence from Britain as a dominion, becoming fully sovereign Sri Lanka in 1972. It was one of the earliest South Asian nations to decolonize peacefully.', 'enrichment-bot', 'approved'),

-- SOUTHEAST ASIA
('philippines-independence-1946', 'Philippines Independence from the United States', '1946-07-04', '1946-07-04', 1946, false, 'political', ARRAY['independence','philippines','decolonization','united-states'], 0.7, 'Philippines', 'Commonwealth of the Philippines', ST_SetSRID(ST_MakePoint(120.9842, 14.5995), 4326), 'southeast_asia', 'Treaty_of_Manila_(1946)', 'The Philippines became the first Asian colony to gain independence after WWII, fulfilling the 1934 Tydings–McDuffie Act promise of self-governance after a 10-year transition.', 'enrichment-bot', 'approved'),

('burma-independence-1948', 'Burmese Independence from Britain', '1948-01-04', '1948-01-04', 1948, false, 'political', ARRAY['independence','burma','myanmar','decolonization','british-empire'], 0.65, 'Myanmar', 'British Burma', ST_SetSRID(ST_MakePoint(96.1951, 16.8661), 4326), 'southeast_asia', 'Independence_of_Burma', 'Burma gained independence from Britain under Aung San''s negotiated framework, though Aung San himself was assassinated before independence day. Burma chose not to join the Commonwealth.', 'enrichment-bot', 'approved'),

('ho-chi-minh-declares-independence-1945', 'Ho Chi Minh Declares Vietnamese Independence', '1945-09-02', '1945-09-02', 1945, false, 'political', ARRAY['independence','vietnam','ho-chi-minh','decolonization','french-empire'], 0.75, 'Vietnam', 'French Indochina', ST_SetSRID(ST_MakePoint(105.8342, 21.0278), 4326), 'southeast_asia', 'Proclamation_of_Independence_of_the_Democratic_Republic_of_Vietnam', 'Ho Chi Minh proclaimed Vietnamese independence from France, quoting the American Declaration of Independence. France refused to recognize it, leading to the First Indochina War.', 'enrichment-bot', 'approved'),

('vietnam-partition-1954', 'Vietnam Partitioned at 17th Parallel', '1954-07-21', '1954-07-21', 1954, false, 'political', ARRAY['vietnam','partition','cold-war','geneva-accords'], 0.75, 'Vietnam', 'French Indochina', ST_SetSRID(ST_MakePoint(106.6297, 16.0544), 4326), 'southeast_asia', 'Geneva_Conference_(1954)', 'The Geneva Accords divided Vietnam at the 17th parallel into communist North and US-backed South, with planned reunification elections that never occurred. This set the stage for the Vietnam War.', 'enrichment-bot', 'approved'),

('malaya-independence-1957', 'Malayan Independence — Merdeka', '1957-08-31', '1957-08-31', 1957, false, 'political', ARRAY['independence','malaysia','malaya','decolonization','british-empire'], 0.65, 'Malaysia', 'British Malaya', ST_SetSRID(ST_MakePoint(101.6869, 3.1390), 4326), 'southeast_asia', 'Hari_Merdeka', 'The Federation of Malaya gained independence from Britain under Tunku Abdul Rahman, who proclaimed "Merdeka!" (Freedom). It later became Malaysia in 1963 with the addition of Sabah, Sarawak, and Singapore.', 'enrichment-bot', 'approved'),

-- AFRICA
('kenyan-independence-1963', 'Kenyan Independence — End of Mau Mau Era', '1963-12-12', '1963-12-12', 1963, false, 'political', ARRAY['independence','kenya','decolonization','mau-mau','kenyatta'], 0.7, 'Kenya', 'British Kenya', ST_SetSRID(ST_MakePoint(36.8219, -1.2921), 4326), 'africa', 'Kenya#Independence', 'Kenya gained independence from Britain with Jomo Kenyatta as first Prime Minister. Independence followed the brutal Mau Mau uprising (1952–60) in which tens of thousands of Kenyans were detained in camps.', 'enrichment-bot', 'approved'),

('mandela-imprisoned-1964', 'Nelson Mandela Sentenced to Life Imprisonment', '1964-06-12', '1964-06-12', 1964, false, 'political', ARRAY['apartheid','mandela','south-africa','political-prisoner','rivonia-trial'], 0.8, 'South Africa', 'Republic of South Africa', ST_SetSRID(ST_MakePoint(18.4241, -33.9221), 4326), 'africa', 'Rivonia_Trial', 'Nelson Mandela was sentenced to life imprisonment at the Rivonia Trial for sabotage against the apartheid state. He would spend 27 years in prison, mostly on Robben Island, before his release in 1990 and election as president in 1994.', 'enrichment-bot', 'approved'),

('rhodesian-udi-1965', 'Rhodesian UDI — White Minority Declares Independence', '1965-11-11', '1965-11-11', 1965, false, 'political', ARRAY['rhodesia','zimbabwe','white-minority','udi','decolonization'], 0.65, 'Zimbabwe', 'Rhodesia', ST_SetSRID(ST_MakePoint(31.0335, -17.8292), 4326), 'africa', 'Rhodesia%27s_Unilateral_Declaration_of_Independence', 'Ian Smith''s white-minority government unilaterally declared independence from Britain to avoid majority rule. International sanctions followed. The Bush War eventually led to majority rule and the creation of Zimbabwe in 1980.', 'enrichment-bot', 'approved'),

('nigerian-independence-1960', 'Nigerian Independence from Britain', '1960-10-01', '1960-10-01', 1960, false, 'political', ARRAY['independence','nigeria','decolonization','africa','british-empire'], 0.7, 'Nigeria', 'British Nigeria', ST_SetSRID(ST_MakePoint(3.3792, 6.5244), 4326), 'africa', 'History_of_Nigeria#Independence', 'Nigeria, Africa''s most populous nation, gained independence from Britain. Ethnic tensions between the Igbo, Yoruba, and Hausa-Fulani peoples would later erupt in the Biafran War (1967–70).', 'enrichment-bot', 'approved'),

('mozambique-angola-independence-1975', 'Mozambique and Angola Independence from Portugal', '1975-06-25', '1975-11-11', 1975, false, 'political', ARRAY['independence','mozambique','angola','portugal','decolonization','lusophone'], 0.7, 'Mozambique / Angola', 'Portuguese Africa', ST_SetSRID(ST_MakePoint(32.5892, -25.9692), 4326), 'africa', 'Angolan_War_of_Independence', 'Portugal''s African colonies gained independence after the 1974 Carnation Revolution ended the Portuguese dictatorship. Mozambique (June 25) and Angola (November 11) both descended into prolonged civil wars fueled by Cold War proxy conflicts.', 'enrichment-bot', 'approved'),

('oau-founded-1963-dup', 'Organisation of African Unity Founded', '1963-05-25', '1963-05-25', 1963, false, 'political', ARRAY['africa','pan-africanism','oau','international-organization'], 0.65, 'Ethiopia', 'Post-Colonial Africa', ST_SetSRID(ST_MakePoint(38.7578, 9.0192), 4326), 'africa', 'Organisation_of_African_Unity', 'Founded by 32 African states to promote unity, sovereignty, and the eradication of colonialism. May 25 is now celebrated as Africa Day. Succeeded by the African Union in 2002.', 'enrichment-bot', 'approved'),

-- MIDDLE EAST
('arab-israeli-war-1948', 'Arab-Israeli War of 1948 — Israeli War of Independence', '1948-05-15', '1949-03-10', 1948, false, 'military', ARRAY['war','israel','arab','palestine','middle-east'], 0.8, 'Israel / Palestine', 'British Mandate Palestine', ST_SetSRID(ST_MakePoint(35.2137, 31.7683), 4326), 'middle_east', '1948_Arab–Israeli_War', 'Following Israel''s declaration of independence, five Arab states invaded. Israel prevailed, expanding beyond UN partition boundaries. ~700,000 Palestinians fled or were expelled in the Nakba (catastrophe), creating a refugee crisis that persists today.', 'enrichment-bot', 'approved'),

('egyptian-revolution-1952', 'Egyptian Revolution — Nasser and the Free Officers', '1952-07-23', '1952-07-23', 1952, false, 'political', ARRAY['revolution','egypt','nasser','pan-arabism','decolonization'], 0.75, 'Egypt', 'Kingdom of Egypt', ST_SetSRID(ST_MakePoint(31.2357, 30.0444), 4326), 'middle_east', 'Egyptian_revolution_of_1952', 'The Free Officers Movement overthrew King Farouk, ending British-backed monarchy. Gamal Abdel Nasser emerged as leader, championing pan-Arabism, non-alignment, and the nationalization of the Suez Canal.', 'enrichment-bot', 'approved'),

('yom-kippur-war-1973', 'Yom Kippur War — October War', '1973-10-06', '1973-10-25', 1973, false, 'military', ARRAY['war','israel','egypt','syria','middle-east','oil-crisis'], 0.8, 'Israel / Egypt / Syria', 'Cold War Middle East', ST_SetSRID(ST_MakePoint(33.3, 30.5), 4326), 'middle_east', 'Yom_Kippur_War', 'Egypt and Syria launched a surprise attack on Israel on the Jewish holy day. Initial Arab gains were reversed. The war triggered the 1973 OPEC oil embargo, quadrupling oil prices and reshaping global energy politics.', 'enrichment-bot', 'approved'),

-- LATIN AMERICA
('alliance-for-progress-1961', 'Alliance for Progress — JFK''s Latin America Initiative', '1961-08-17', '1961-08-17', 1961, false, 'political', ARRAY['cold-war','latin-america','jfk','development','united-states'], 0.55, 'Uruguay / Latin America', 'Cold War Americas', ST_SetSRID(ST_MakePoint(-56.1645, -34.9011), 4326), 'americas', 'Alliance_for_Progress', 'JFK launched a $20 billion aid program to promote economic development and democratic governance in Latin America, countering Cuban revolutionary influence. Results were mixed, with many recipient countries falling to military coups.', 'enrichment-bot', 'approved'),

('castro-nationalizes-1960', 'Castro Nationalizes US Companies in Cuba', '1960-08-06', '1960-10-24', 1960, false, 'economic', ARRAY['cuba','nationalization','cold-war','castro','united-states'], 0.65, 'Cuba', 'Republic of Cuba', ST_SetSRID(ST_MakePoint(-82.3666, 23.1136), 4326), 'americas', 'Nationalization_in_Cuba', 'Castro''s government nationalized all US-owned businesses, oil refineries, and sugar mills. The US responded with a trade embargo that continues to this day. This pushed Cuba firmly into the Soviet orbit.', 'enrichment-bot', 'approved'),

-- COLD WAR / GLOBAL
('opec-founded-1960', 'OPEC Founded — Oil Producers Unite', '1960-09-14', '1960-09-14', 1960, false, 'economic', ARRAY['opec','oil','energy','middle-east','economics'], 0.7, 'Iraq / Global', 'Cold War Era', ST_SetSRID(ST_MakePoint(44.3661, 33.3152), 4326), 'middle_east', 'OPEC', 'The Organization of Petroleum Exporting Countries was founded in Baghdad by Iran, Iraq, Kuwait, Saudi Arabia, and Venezuela. OPEC would become a major geopolitical force, especially during the 1973 oil crisis.', 'enrichment-bot', 'approved'),

('algerian-independence-1962', 'Algerian Independence After Brutal Eight-Year War', '1962-07-05', '1962-07-05', 1962, false, 'political', ARRAY['independence','algeria','france','decolonization','war'], 0.8, 'Algeria', 'French Algeria', ST_SetSRID(ST_MakePoint(3.0588, 36.7538), 4326), 'africa', 'Algerian_War', 'Algeria gained independence after an 8-year war that killed 300,000–1.5 million Algerians. The war caused the fall of France''s Fourth Republic and remains deeply contested in French memory. One million pieds-noirs (European settlers) fled to France.', 'enrichment-bot', 'approved')

ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- WWII → Indian Independence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'WWII bankrupted Britain and made holding colonies untenable, accelerating Indian independence.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'germany-surrenders-wwii-1945' AND e.slug = 'indian-independence-1947'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Indian Independence → Pakistan Founded
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'The partition of British India simultaneously created both India and Pakistan as independent nations.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'indian-independence-1947' AND e.slug = 'pakistan-founded-1947'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Indian Independence → Gandhi Assassinated
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Post-partition tensions and Hindu-Muslim violence contributed to the extremist climate in which Gandhi was assassinated.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'indian-independence-1947' AND e.slug = 'gandhi-assassinated-1948'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Pakistan Founded → First Indo-Pakistani War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The partition left Kashmir''s status unresolved, directly causing the first Indo-Pakistani war.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'pakistan-founded-1947' AND e.slug = 'first-indo-pak-war-1947'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Pakistan Founded → Bangladesh Liberation
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'East Pakistan''s geographic separation and political marginalization by West Pakistan led to the Bangladesh Liberation War.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'pakistan-founded-1947' AND e.slug = 'bangladesh-independence-1971'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Ghana Independence → Year of Africa
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Ghana''s independence under Nkrumah in 1957 inspired and emboldened independence movements across the continent.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE 'ghana-independence%' AND e.slug LIKE 'year-of-africa%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Year of Africa → Nigerian Independence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.75, 'The wave of African independence in 1960 included Nigeria as one of 17 nations achieving sovereignty.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE 'year-of-africa%' AND e.slug = 'nigerian-independence-1960'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Nigerian Independence → Biafran War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Post-independence ethnic tensions between Igbo, Yoruba, and Hausa-Fulani peoples led to the Biafran War.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'nigerian-independence-1960' AND e.slug LIKE '%biafra%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Dien Bien Phu → Vietnam Partition
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'France''s defeat at Dien Bien Phu forced the Geneva Accords, partitioning Vietnam at the 17th parallel.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%dien-bien-phu%' AND e.slug = 'vietnam-partition-1954'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Vietnam Partition → Vietnam War escalation
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The partition of Vietnam and failure to hold reunification elections led directly to US military escalation.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'vietnam-partition-1954' AND e.slug LIKE '%tonkin%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Suez Crisis → End of British/French Power
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.8, 'The Suez humiliation demonstrated that Britain could no longer act as an independent imperial power, accelerating African decolonization.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%suez-crisis%' AND e.slug LIKE 'year-of-africa%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Cuban Revolution → Castro Nationalizes
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Castro''s revolutionary government moved to nationalize all US-owned businesses as part of socialist transformation.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE 'cuban-revolution%' AND e.slug = 'castro-nationalizes-1960'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Castro Nationalizes → Bay of Pigs
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Cuba''s nationalization of US assets intensified hostility and directly motivated the CIA-backed Bay of Pigs invasion.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'castro-nationalizes-1960' AND e.slug LIKE '%bay-of-pigs%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Bay of Pigs → Cuban Missile Crisis
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'The Bay of Pigs failure prompted the USSR to place missiles in Cuba to deter future US invasion attempts.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%bay-of-pigs%' AND e.slug LIKE '%cuban-missile%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Apartheid → Mandela Imprisoned
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Mandela''s armed resistance against the apartheid system led to his arrest and life sentence at the Rivonia Trial.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%apartheid%1948%' AND e.slug = 'mandela-imprisoned-1964'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Egyptian Revolution → Suez Crisis
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Nasser''s revolution and subsequent nationalization of the Suez Canal directly triggered the Suez Crisis.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'egyptian-revolution-1952' AND e.slug LIKE '%suez%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Yom Kippur War → OPEC Oil Embargo
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Arab OPEC members imposed an oil embargo on nations supporting Israel during the Yom Kippur War, causing a global energy crisis.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'yom-kippur-war-1973' AND e.slug LIKE '%opec-oil%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Carnation Revolution → Mozambique/Angola Independence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Portugal''s Carnation Revolution ended the dictatorship and led directly to the independence of its African colonies.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%carnation%' AND e.slug = 'mozambique-angola-independence-1975'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Ho Chi Minh → Dien Bien Phu
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.85, 'Ho Chi Minh''s independence declaration and French refusal to recognize it led to the First Indochina War culminating at Dien Bien Phu.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug = 'ho-chi-minh-declares-independence-1945' AND e.slug LIKE '%dien-bien-phu%'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;

-- Declaration of Israel → Arab-Israeli War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.95, 'Israel''s declaration of independence immediately triggered an invasion by five neighboring Arab states.', 'enrichment-bot', 'approved'
FROM events c, events e WHERE c.slug LIKE '%state-of-israel%' AND e.slug = 'arab-israeli-war-1948'
AND c.id != e.id AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id)
LIMIT 1;
