-- Economic & Trade History Enrichment
-- Added 2026-03-20
-- ~20 new events covering ancient trade, medieval banking, early modern finance,
-- industrial revolution, and modern economic milestones
-- ~15 causality links connecting economic events to political/social consequences

-- ============================================================
-- EVENTS
-- ============================================================

-- Roman grain trade
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('roman-grain-trade-egypt', 'Roman Grain Trade — Egypt Feeds the Empire', '0030-01-01 BC', '0030-12-31 BC', -30, true, 'trade', ARRAY['trade', 'agriculture', 'rome', 'egypt'], 0.7, 'Egypt', 'Roman Egypt', ST_SetSRID(ST_MakePoint(31.23, 30.04), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Letter of credit / medieval banking
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('letter-of-credit-medieval-banking', 'Letter of Credit Invented — Medieval Banking Revolution', '1200-01-01', '1250-12-31', 1200, 'trade', ARRAY['banking', 'finance', 'innovation'], 0.6, 'Italy', 'Italian City-States', ST_SetSRID(ST_MakePoint(11.25, 43.77), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Medici Bank
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('medici-bank-founded', 'Medici Bank Founded — Birth of Modern Banking', '1397-01-01', '1397-12-31', 1397, 'trade', ARRAY['banking', 'finance', 'medici', 'florence'], 0.8, 'Italy', 'Republic of Florence', ST_SetSRID(ST_MakePoint(11.25, 43.77), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Portuguese monopolize spice route
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('portuguese-spice-monopoly', 'Portuguese Monopolize the Spice Route — Cape Route to India', '1498-01-01', '1510-12-31', 1498, 'trade', ARRAY['trade', 'colonialism', 'spice', 'portugal'], 0.7, 'Portugal', 'Kingdom of Portugal', ST_SetSRID(ST_MakePoint(-9.14, 38.74), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Spanish silver
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('spanish-silver-americas', 'Spanish Silver from Americas Floods Europe — Price Revolution', '1540-01-01', '1560-12-31', 1545, 'trade', ARRAY['silver', 'inflation', 'colonialism', 'spain'], 0.7, 'Bolivia', 'Viceroyalty of Peru', ST_SetSRID(ST_MakePoint(-65.75, -19.59), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Amsterdam Stock Exchange
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('amsterdam-stock-exchange', 'Amsterdam Stock Exchange Founded — World''s First', '1602-01-01', '1602-12-31', 1602, 'trade', ARRAY['finance', 'stock market', 'dutch republic', 'voc'], 0.8, 'Netherlands', 'Dutch Republic', ST_SetSRID(ST_MakePoint(4.90, 52.37), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Power Loom
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('power-loom-cartwright', 'Power Loom Invented — Textile Revolution Accelerates', '1785-01-01', '1785-12-31', 1785, 'technological', ARRAY['industrial revolution', 'textiles', 'invention'], 0.6, 'United Kingdom', 'Kingdom of Great Britain', ST_SetSRID(ST_MakePoint(-1.55, 53.80), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Robert Owen
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('robert-owen-new-lanark', 'Robert Owen''s New Lanark — Utopian Socialism and Factory Reform', '1800-01-01', '1825-12-31', 1800, 'social', ARRAY['socialism', 'labor', 'factory reform', 'utopian'], 0.6, 'United Kingdom', 'Kingdom of Great Britain', ST_SetSRID(ST_MakePoint(-3.78, 55.67), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Factory Act
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('factory-act-1833', 'Factory Act 1833 — First Child Labor Laws in Britain', '1833-01-01', '1833-12-31', 1833, 'political', ARRAY['labor', 'child labor', 'legislation', 'reform'], 0.7, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-0.12, 51.51), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Standard Oil
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('standard-oil-founded', 'Standard Oil Founded — Rise of Monopoly Capitalism', '1870-01-01', '1870-12-31', 1870, 'trade', ARRAY['monopoly', 'oil', 'rockefeller', 'capitalism'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-81.69, 41.50), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Sherman Antitrust Act
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('sherman-antitrust-act', 'Sherman Antitrust Act — First Anti-Monopoly Law', '1890-07-02', '1890-07-02', 1890, 'political', ARRAY['antitrust', 'regulation', 'monopoly', 'law'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-77.04, 38.90), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Federal Reserve
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('federal-reserve-created', 'Federal Reserve Created — US Central Banking System', '1913-12-23', '1913-12-23', 1913, 'trade', ARRAY['banking', 'central bank', 'monetary policy', 'finance'], 0.8, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-77.04, 38.90), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- GATT
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('gatt-founded', 'GATT Founded — Framework for Global Free Trade', '1947-10-30', '1947-10-30', 1947, 'trade', ARRAY['trade', 'international', 'globalization', 'tariffs'], 0.7, 'Switzerland', 'International', ST_SetSRID(ST_MakePoint(6.14, 46.20), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Nixon ends gold standard
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('nixon-ends-gold-standard', 'Nixon Ends the Gold Standard — Birth of Fiat Currency Era', '1971-08-15', '1971-08-15', 1971, 'trade', ARRAY['monetary policy', 'gold standard', 'fiat currency', 'nixon shock'], 0.8, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-77.04, 38.90), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- Reagan/Thatcher neoliberalism
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('neoliberal-turn-reagan-thatcher', 'Neoliberal Turn — Reagan and Thatcher Reshape Capitalism', '1980-01-01', '1984-12-31', 1980, 'political', ARRAY['neoliberalism', 'deregulation', 'free market', 'privatization'], 0.8, 'United States', 'United States / United Kingdom', ST_SetSRID(ST_MakePoint(-77.04, 38.90), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- EU Single Market
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('eu-single-market', 'EU Single Market Established — Free Movement of Goods and People', '1993-01-01', '1993-01-01', 1993, 'trade', ARRAY['european union', 'free trade', 'integration', 'globalization'], 0.7, 'Belgium', 'European Union', ST_SetSRID(ST_MakePoint(4.35, 50.85), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- WTO
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('wto-founded', 'World Trade Organization Founded — Successor to GATT', '1995-01-01', '1995-01-01', 1995, 'trade', ARRAY['trade', 'international', 'globalization', 'wto'], 0.7, 'Switzerland', 'International', ST_SetSRID(ST_MakePoint(6.14, 46.20), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- COVID economic shock
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, created_by)
VALUES ('covid-economic-shock', 'COVID-19 Economic Shock — Global Recession and Stimulus', '2020-03-01', '2020-12-31', 2020, 'trade', ARRAY['covid', 'recession', 'stimulus', 'supply chain'], 0.8, 'Global', 'Global', ST_SetSRID(ST_MakePoint(0, 0), 4326), 'enrichment-bot')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Silk Road → Black Death (plague spread along trade routes)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'Silk Road trade routes facilitated the spread of bubonic plague to Europe', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'silk-road-established-han-dynasty-130bce' AND e.slug = 'black-death-1347-1351'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Medici Bank → Renaissance patronage
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.8, 'Medici banking wealth funded Renaissance art and scholarship', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'medici-bank-founded' AND e.slug = 'renaissance-florence-medici-1450'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Watt steam engine → Factory system
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'Steam power enabled mechanized factory production', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'watt-steam-engine-1769' AND e.slug = 'arkwright-water-frame-1771'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Factory system → Robert Owen / labor reform
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'Factory conditions drove the labor reform movement', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'arkwright-water-frame-1771' AND e.slug = 'robert-owen-new-lanark'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Robert Owen → Factory Act
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'Owen''s reform movement contributed to child labor legislation', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'robert-owen-new-lanark' AND e.slug = 'factory-act-1833'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Standard Oil → Sherman Antitrust
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'Standard Oil''s monopoly power directly motivated antitrust legislation', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'standard-oil-founded' AND e.slug = 'sherman-antitrust-act'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Spanish Silver → Dutch tulip mania (silver influx fueled speculation)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.5, 'Spanish silver influx increased money supply and fueled speculative bubbles', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'spanish-silver-americas' AND e.slug = 'dutch-tulip-mania-1637'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Amsterdam Stock Exchange → Tulip Mania
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'Amsterdam''s stock exchange and speculation culture enabled tulip mania', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'amsterdam-stock-exchange' AND e.slug = 'dutch-tulip-mania-1637'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Weimar hyperinflation → Hitler's rise (check for existing Hitler rise event)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.8, 'Economic devastation of hyperinflation fueled extremist politics and Nazi rise', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'weimar-republic-hyperinflation-1923' AND e.slug = 'hitler-chancellor-1933'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Wall Street Crash → Great Depression effects
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.7, 'Great Depression contributed to conditions that led to WWII', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'great-depression-wall-street-crash-1929' AND e.slug = 'germany-invades-poland-1939'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Bretton Woods → GATT
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'Bretton Woods system established the framework for post-war trade agreements', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'bretton-woods' AND e.slug = 'gatt-founded'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- GATT → WTO
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'WTO was the direct institutional successor to GATT', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'gatt-founded' AND e.slug = 'wto-founded'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Nixon gold standard → OPEC embargo
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.6, 'End of gold standard destabilized commodity pricing, contributing to oil crisis dynamics', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'nixon-ends-gold-standard' AND e.slug = 'oil-crisis-opec-1973'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- 2008 crisis → Bitcoin
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'Distrust in traditional banking after 2008 crash motivated Bitcoin''s creation', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'lehman-brothers-collapse-2008' AND e.slug = 'bitcoin-genesis-block-2009'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Enclosure → Industrial Revolution labor pool
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.8, 'Enclosure displaced rural farmers, creating the urban labor pool for factories', 'enrichment-bot'
FROM events c, events e
WHERE c.slug = 'enclosure-movement-1750' AND e.slug = 'arkwright-water-frame-1771'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
