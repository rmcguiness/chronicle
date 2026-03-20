-- Modern History Enrichment (1975-2010)
-- Added 2026-03-20
-- ~30 new events filling gaps in Cold War end, digital revolution, War on Terror
-- ~20 causality links

-- Already seeded (confirmed): Iranian Revolution, Soviet invasion of Afghanistan,
-- Solidarity movement, Reagan/Thatcher, AIDS, Falklands War, Gorbachev glasnost/perestroika,
-- Chernobyl, INF Treaty, Fall of Berlin Wall, Velvet Revolution, Romanian Revolution,
-- Tiananmen Square, German reunification, USSR dissolves, Yugoslav Wars, Bosnian War,
-- Rwandan genocide, Mandela/Apartheid ends, Gulf War, Oslo Accords, Dolly the sheep,
-- WWW, Dot-com bubble, Wikipedia, 9/11, Afghanistan invasion, Iraq War, Facebook,
-- YouTube, Twitter, iPhone, Financial crisis, Obama elected, Hurricane Katrina,
-- Human Genome Project, EU enlargement, London bombings

-- MISSING events to add:

-- IBM PC (1981)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('ibm-pc-launched-1981', 'IBM PC Launched — Birth of Personal Computing', '1981-08-12', '1981-08-12', 1981, 'Late Cold War', 'Boca Raton, Florida, USA', 0.78, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-80.0833, 26.3584), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Apple Macintosh (1984)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('apple-macintosh-1984', 'Apple Macintosh — GUI Computing Goes Mainstream', '1984-01-24', '1984-01-24', 1984, 'Late Cold War', 'Cupertino, California, USA', 0.72, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-122.0322, 37.3230), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- DNA Fingerprinting (1984)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('dna-fingerprinting-1984', 'DNA Fingerprinting Developed — Revolution in Forensics', '1984-09-10', '1984-09-10', 1984, 'Late Cold War', 'Leicester, England', 0.70, 'science', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-1.1398, 52.6369), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Linux (1991)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('linux-created-1991', 'Linux Created — Open Source Operating System', '1991-09-17', '1991-09-17', 1991, 'Post-Cold War', 'Helsinki, Finland', 0.75, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(24.9384, 60.1699), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Mosaic Browser (1993)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('mosaic-web-browser-1993', 'Mosaic Web Browser — Making the Internet Visual', '1993-04-22', '1993-04-22', 1993, 'Post-Cold War', 'Champaign, Illinois, USA', 0.72, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-88.2434, 40.1164), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Amazon Founded (1994)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('amazon-founded-1994', 'Amazon Founded — E-Commerce Revolution Begins', '1994-07-05', '1994-07-05', 1994, 'Post-Cold War', 'Bellevue, Washington, USA', 0.75, 'economic', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-122.2015, 47.6101), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- eBay Founded (1995)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('ebay-founded-1995', 'eBay Founded — Online Auction Marketplace', '1995-09-03', '1995-09-03', 1995, 'Post-Cold War', 'San Jose, California, USA', 0.65, 'economic', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-121.8863, 37.3382), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Google Founded (1998)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('google-founded-1998', 'Google Founded — Organizing the World''s Information', '1998-09-04', '1998-09-04', 1998, 'Post-Cold War', 'Menlo Park, California, USA', 0.80, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-122.1817, 37.4530), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Napster (1999)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('napster-launches-1999', 'Napster Launches — Digital Music Disruption', '1999-06-01', '1999-06-01', 1999, 'Post-Cold War', 'Boston, Massachusetts, USA', 0.68, 'technology', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-71.0589, 42.3601), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Boris Yeltsin (1991)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('yeltsin-president-russia-1991', 'Boris Yeltsin Becomes Russia''s First President', '1991-07-10', '1991-07-10', 1991, 'Post-Cold War', 'Moscow, Russia', 0.78, 'political', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(37.6173, 55.7558), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Baltic States Independence (1991)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('baltic-states-independence-1991', 'Baltic States Declare Independence from Soviet Union', '1991-08-20', '1991-09-06', 1991, 'Post-Cold War', 'Tallinn / Riga / Vilnius, Baltic States', 0.75, 'political', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(24.1052, 56.9496), 4326), 'Europe')
ON CONFLICT (slug) DO NOTHING;

-- Abu Ghraib (2004)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('abu-ghraib-scandal-2004', 'Abu Ghraib Prison Abuse Scandal — War on Terror''s Darkest Chapter', '2004-04-28', '2004-04-28', 2004, '21st Century', 'Abu Ghraib, Iraq', 0.72, 'war', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(44.1814, 33.3078), 4326), 'Middle East')
ON CONFLICT (slug) DO NOTHING;

-- Global War on Terror (2001)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('war-on-terror-declared-2001', 'Global War on Terror Declared — Defining Conflict of the Era', '2001-09-20', '2001-09-20', 2001, '21st Century', 'Washington D.C., USA', 0.85, 'war', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-77.0369, 38.9072), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- Obama Inaugurated (2009)
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_era_label, geo_modern, importance_score, event_category, created_by, review_status, geo_point, region)
VALUES ('obama-inaugurated-2009', 'Barack Obama Inaugurated — 44th President of the United States', '2009-01-20', '2009-01-20', 2009, '21st Century', 'Washington D.C., USA', 0.80, 'political', 'seed-enrichment:modern', 'approved', ST_SetSRID(ST_MakePoint(-77.0369, 38.9072), 4326), 'Americas')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- CAUSALITY LINKS
-- =============================================

-- Berlin Wall falls → German reunification
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.95, 'The fall of the Berlin Wall directly led to German reunification within a year', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'Fall of the Berlin Wall' AND e.title = 'German Reunification'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- German reunification → EU enlargement
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'German reunification accelerated European integration and eastward expansion', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'German Reunification' AND e.title = 'EU Enlargement — 10 New Members Join'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Gorbachev reforms → Soviet dissolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'Glasnost and perestroika unleashed forces that led to Soviet collapse', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'Gorbachev Launches Glasnost and Perestroika' AND e.title = 'Dissolution of the Soviet Union'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Soviet dissolution → Yeltsin
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.85, 'Soviet collapse made Yeltsin leader of independent Russia', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'Dissolution of the Soviet Union' AND e.title ILIKE '%Yeltsin%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Soviet dissolution → Baltic independence
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'Soviet collapse enabled Baltic states to regain independence', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'Dissolution of the Soviet Union' AND e.title ILIKE '%Baltic%Independence%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Soviet dissolution → Yugoslav Wars
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'End of Cold War superpower balance contributed to Yugoslav dissolution', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title = 'Dissolution of the Soviet Union' AND e.title ILIKE '%Yugoslav Wars%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Rwandan genocide → Darfur/ICC awareness
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'indirect', 0.6, 'Failure to prevent Rwanda shaped international response to Darfur genocide', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Rwandan Genocide%' AND e.title ILIKE '%Darfur%'
AND c.year_approx = 1994
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- 9/11 → War on Terror declared
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.98, 'September 11 attacks directly triggered the Global War on Terror', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%September 11%' AND e.title ILIKE '%War on Terror Declared%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- 9/11 → Afghanistan invasion
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.95, 'September 11 attacks led directly to US invasion of Afghanistan', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%September 11%' AND e.title ILIKE '%Invades Afghanistan%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Afghanistan → Iraq War
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.65, 'War on Terror framework from Afghanistan enabled justification for Iraq invasion', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Invades Afghanistan%' AND e.title ILIKE '%Iraq War Begins%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Iraq War → Abu Ghraib
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'Iraq War occupation directly led to Abu Ghraib prison abuse', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Iraq War Begins%' AND e.title ILIKE '%Abu Ghraib%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- IBM PC → Apple Mac
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.75, 'IBM PC created the personal computer market that Apple Macintosh competed in', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%IBM PC%' AND e.title ILIKE '%Macintosh%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- WWW → Mosaic browser
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'The World Wide Web needed a visual browser — Mosaic made it accessible', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%World Wide Web%Public%' AND e.title ILIKE '%Mosaic%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Mosaic → Dot-com boom
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'Mosaic browser popularized the web, fueling dot-com speculation', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Mosaic%' AND e.title ILIKE '%Dot-com%'
AND e.year_approx = 2000
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Dot-com bubble → Google IPO
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'indirect', 0.5, 'Dot-com crash cleared the field for survivors like Google to dominate', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Dot-com%Burst%' AND e.title ILIKE '%Google IPO%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- iPhone → smartphone/social media dominance
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.85, 'iPhone enabled the App Store and mobile-first social media', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%iPhone Launch%Smartphone%' AND e.title ILIKE '%App Store%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Financial crisis → Obama election
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'The 2008 financial crisis boosted Obama''s electoral chances', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Lehman Brothers%' AND e.title ILIKE '%Obama Elected%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Financial crisis → Arab Spring foreshadowing
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.55, 'Global financial crisis worsened economic conditions that fueled Arab Spring', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Global Financial Crisis%' AND e.title ILIKE '%Arab Spring%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Solidarity → Velvet Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'indirect', 0.7, 'Polish Solidarity inspired peaceful anti-communist movements across Eastern Europe', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Solidarity%Poland%' AND e.title ILIKE '%Velvet Revolution%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Chernobyl → Soviet dissolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'Chernobyl disaster exposed Soviet incompetence and accelerated glasnost demands', 'seed-enrichment:modern'
FROM events c, events e
WHERE c.title ILIKE '%Chernobyl%' AND e.title = 'Dissolution of the Soviet Union'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
