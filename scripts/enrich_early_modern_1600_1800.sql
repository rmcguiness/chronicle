-- enrich_early_modern_1600_1800.sql
-- Fills remaining gaps in 1600-1800 CE period
-- ON CONFLICT (slug) DO NOTHING

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_modern, event_category, geo_era_label, importance_score, geo_point, region, created_by, review_status)
VALUES

-- SCIENTIFIC REVOLUTION gaps
('boyles-law-1662', 'Boyle''s Law — Foundation of Gas Chemistry', '1662-01-01', '1662-12-31', 1662, 'Oxford, England', 'discovery', 'Scientific Revolution', 0.72, ST_SetSRID(ST_MakePoint(-1.257, 51.752), 4326), 'Europe', 'seed-script:early-modern-enrich', 'approved'),

-- COLONIAL ERA & TRADE gaps
('sugar-plantations-caribbean-1650s', 'Sugar Plantations Dominate Caribbean — Plantation Economy', '1650-01-01', '1659-12-31', 1655, 'Caribbean', 'economic', 'Colonial Caribbean', 0.75, ST_SetSRID(ST_MakePoint(-61.5, 15.4), 4326), 'Americas', 'seed-script:early-modern-enrich', 'approved'),

('battle-of-poltava-1709', 'Battle of Poltava — Russia Defeats Sweden', '1709-06-27', '1709-06-27', 1709, 'Poltava, Ukraine', 'military', 'Great Northern War', 0.78, ST_SetSRID(ST_MakePoint(34.551, 49.588), 4326), 'Europe', 'seed-script:early-modern-enrich', 'approved'),

-- WAR OF AUSTRIAN SUCCESSION
('war-austrian-succession-1740', 'War of Austrian Succession — European Power Struggle', '1740-12-16', '1748-10-18', 1740, 'Europe', 'military', 'Age of Enlightenment', 0.74, ST_SetSRID(ST_MakePoint(14.426, 50.088), 4326), 'Europe', 'seed-script:early-modern-enrich', 'approved'),

-- AMERICAN REVOLUTION gaps
('battle-of-yorktown-1781', 'Battle of Yorktown — Decisive American Victory', '1781-09-28', '1781-10-19', 1781, 'Yorktown, Virginia, USA', 'military', 'American Revolution', 0.82, ST_SetSRID(ST_MakePoint(-76.508, 37.239), 4326), 'Americas', 'seed-script:early-modern-enrich', 'approved'),

('us-constitution-ratified-1788', 'US Constitution Ratified — Federal Republic Established', '1788-06-21', '1788-06-21', 1788, 'Philadelphia, Pennsylvania, USA', 'political', 'American Revolution', 0.88, ST_SetSRID(ST_MakePoint(-75.149, 39.949), 4326), 'Americas', 'seed-script:early-modern-enrich', 'approved'),

-- PARTITION OF POLAND (2nd and 3rd — 1st already exists)
('second-partition-of-poland-1793', 'Second Partition of Poland', '1793-01-23', '1793-01-23', 1793, 'Poland', 'political', 'Partition of Poland', 0.70, ST_SetSRID(ST_MakePoint(21.012, 52.230), 4326), 'Europe', 'seed-script:early-modern-enrich', 'approved'),

('third-partition-of-poland-1795', 'Third Partition of Poland — Poland Erased from Map', '1795-10-24', '1795-10-24', 1795, 'Poland', 'political', 'Partition of Poland', 0.75, ST_SetSRID(ST_MakePoint(21.012, 52.230), 4326), 'Europe', 'seed-script:early-modern-enrich', 'approved')

ON CONFLICT (slug) DO NOTHING;

-- CAUSALITY LINKS

-- Enlightenment → American Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.8, 'Enlightenment ideas of natural rights and social contract directly inspired American revolutionary thought', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.title = 'Locke Publishes Two Treatises of Government' AND c.year_approx = 1689
AND e.title = 'American Declaration of Independence' AND e.year_approx = 1776
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Rousseau → French Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.8, 'Rousseau''s Social Contract provided ideological foundation for French Revolution', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.slug LIKE '%rousseau%social-contract%' AND c.year_approx = 1762
AND e.slug LIKE '%bastille%' AND e.year_approx = 1789
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- American Revolution → French Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.85, 'American Revolution demonstrated viability of republican government and inspired French revolutionaries', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.title = 'American Declaration of Independence' AND c.year_approx = 1776
AND e.slug LIKE '%bastille%' AND e.year_approx = 1789
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- French Revolution → Haitian Revolution
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'direct', 0.9, 'French Revolution''s Declaration of Rights of Man created contradictions with colonial slavery, sparking Haitian uprising', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.slug LIKE '%bastille%' AND c.year_approx = 1789
AND e.slug LIKE '%haitian%revolution%' AND e.year_approx = 1791
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Newton → Industrial Revolution (foreshadowing via Watt's steam engine)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'indirect', 0.7, 'Newton''s mechanics provided theoretical foundation for engineering advances leading to Industrial Revolution', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.slug LIKE '%newton%principia%' AND c.year_approx = 1687
AND e.slug LIKE '%watt%steam%' AND e.year_approx = 1769
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Dutch VOC → British East India Company dominance
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'indirect', 0.7, 'Dutch VOC model of joint-stock colonial trading company was emulated and eventually surpassed by British EIC', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.slug LIKE '%dutch%voc%' AND c.year_approx = 1602
AND e.slug LIKE '%plassey%' AND e.year_approx = 1757
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Adam Smith → Economic foundations
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by)
SELECT c.id, e.id, 'contributing', 0.75, 'Encyclopédie systematized knowledge including economic thought, laying groundwork for Smith', 'seed-script:early-modern-enrich'
FROM events c, events e
WHERE c.slug LIKE '%encyclopedie%' AND c.year_approx = 1751
AND e.slug LIKE '%adam-smith%wealth%' AND e.year_approx = 1776
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
