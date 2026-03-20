-- Women's History + Science History Enrichment
-- Added 2026-03-20

-- ============================================
-- WOMEN'S HISTORY EVENTS
-- ============================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, article_summary, wikipedia_slug, created_by, review_status)
VALUES
('hypatia-alexandria-murdered', 'Hypatia of Alexandria — Mathematician and Philosopher Murdered', '0415-03-01', '0415-03-31', 415, false, 'social', ARRAY['women''s history','philosophy','mathematics','late antiquity'], 0.7, 'Egypt', 'Roman Egypt', ST_SetSRID(ST_MakePoint(29.9187, 31.2001), 4326), 'Hypatia was a Neoplatonist philosopher, astronomer, and mathematician in Alexandria. She was murdered by a Christian mob in 415 CE, symbolizing the clash between classical learning and rising religious intolerance.', 'Hypatia', 'seed-enrichment', 'approved'),

('eleanor-aquitaine-queen', 'Eleanor of Aquitaine — Queen of France and England', '1137-07-25', '1204-04-01', 1137, false, 'political', ARRAY['women''s history','medieval','royalty','crusades'], 0.7, 'France', 'Kingdom of France', ST_SetSRID(ST_MakePoint(0.1712, 46.5802), 4326), 'Eleanor of Aquitaine was one of the most powerful women in medieval Europe, serving as Queen consort of France (1137–1152) and England (1154–1189). She patronized the arts, participated in the Second Crusade, and wielded significant political influence.', 'Eleanor_of_Aquitaine', 'seed-enrichment', 'approved'),

('isabella-castile-unification', 'Isabella of Castile — Unification of Spain', '1479-01-20', '1479-01-20', 1479, false, 'political', ARRAY['women''s history','spain','unification','reconquista'], 0.8, 'Spain', 'Crown of Castile', ST_SetSRID(ST_MakePoint(-3.7038, 40.4168), 4326), 'Isabella I of Castile, with her husband Ferdinand of Aragon, unified Spain, completed the Reconquista, funded Columbus''s voyage, and established the Spanish Inquisition. One of the most consequential monarchs in European history.', 'Isabella_I_of_Castile', 'seed-enrichment', 'approved'),

('womens-march-versailles-1789', 'Women''s March on Versailles', '1789-10-05', '1789-10-06', 1789, false, 'political', ARRAY['women''s history','french revolution','protest','paris'], 0.7, 'France', 'Kingdom of France', ST_SetSRID(ST_MakePoint(2.1204, 48.8049), 4326), 'Thousands of Parisian market women marched on the Palace of Versailles to demand bread and force King Louis XVI and the royal family to return to Paris. A pivotal moment in the French Revolution demonstrating women''s political agency.', 'Women%27s_March_on_Versailles', 'seed-enrichment', 'approved'),

('stanton-anthony-nwsa-1869', 'Stanton and Anthony Found the National Woman Suffrage Association', '1869-05-15', '1869-05-15', 1869, false, 'social', ARRAY['women''s history','suffrage','civil rights','usa'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), 'Elizabeth Cady Stanton and Susan B. Anthony founded the National Woman Suffrage Association (NWSA) in 1869, advocating for a constitutional amendment granting women the right to vote.', 'National_Woman_Suffrage_Association', 'seed-enrichment', 'approved'),

('triangle-shirtwaist-fire-1911', 'Triangle Shirtwaist Factory Fire', '1911-03-25', '1911-03-25', 1911, false, 'social', ARRAY['women''s history','labor rights','industrial disaster','new york'], 0.8, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-73.9955, 40.7309), 4326), 'The Triangle Shirtwaist Factory fire in New York City killed 146 garment workers, mostly young immigrant women. The tragedy catalyzed labor reform, workplace safety legislation, and the growth of the International Ladies'' Garment Workers'' Union.', 'Triangle_Shirtwaist_Factory_fire', 'seed-enrichment', 'approved'),

('amelia-earhart-atlantic-1932', 'Amelia Earhart — First Woman Solo Transatlantic Flight', '1932-05-20', '1932-05-21', 1932, false, 'social', ARRAY['women''s history','aviation','record','transatlantic'], 0.7, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-8.2439, 53.7798), 4326), 'Amelia Earhart became the first woman to fly solo across the Atlantic Ocean, landing in Northern Ireland after a 14-hour, 56-minute flight from Newfoundland. She became an icon of courage and women''s capability.', 'Amelia_Earhart', 'seed-enrichment', 'approved'),

('rosa-parks-bus-1955', 'Rosa Parks Refuses to Give Up Her Seat', '1955-12-01', '1955-12-01', 1955, false, 'social', ARRAY['women''s history','civil rights','segregation','montgomery'], 0.85, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-86.3000, 32.3668), 4326), 'Rosa Parks refused to give up her bus seat to a white passenger in Montgomery, Alabama, sparking the Montgomery Bus Boycott and becoming a pivotal moment in the American Civil Rights Movement.', 'Rosa_Parks', 'seed-enrichment', 'approved'),

('betty-friedan-feminine-mystique-1963', 'Betty Friedan — The Feminine Mystique', '1963-02-19', '1963-02-19', 1963, false, 'social', ARRAY['women''s history','feminism','literature','second wave'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), 'Betty Friedan published The Feminine Mystique, challenging the idea that women could find fulfillment only through homemaking and child-rearing. The book is widely credited with sparking second-wave feminism in the United States.', 'The_Feminine_Mystique', 'seed-enrichment', 'approved'),

('now-founded-1966', 'National Organization for Women (NOW) Founded', '1966-06-30', '1966-06-30', 1966, false, 'social', ARRAY['women''s history','feminism','civil rights','organization'], 0.65, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-77.0369, 38.9072), 4326), 'The National Organization for Women (NOW) was founded by Betty Friedan and others to advocate for equal rights for women, including workplace equality, reproductive rights, and the Equal Rights Amendment.', 'National_Organization_for_Women', 'seed-enrichment', 'approved'),

('roe-v-wade-1973', 'Roe v. Wade — Right to Abortion Established', '1973-01-22', '1973-01-22', 1973, false, 'political', ARRAY['women''s history','supreme court','reproductive rights','usa'], 0.85, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-77.0042, 38.8907), 4326), 'The U.S. Supreme Court ruled 7–2 in Roe v. Wade that the Constitution protects a woman''s right to an abortion. The landmark decision shaped American politics for decades until being overturned by Dobbs v. Jackson (2022).', 'Roe_v._Wade', 'seed-enrichment', 'approved'),

('geraldine-ferraro-vp-1984', 'Geraldine Ferraro — First Woman VP Nominee of Major Party', '1984-07-19', '1984-07-19', 1984, false, 'political', ARRAY['women''s history','election','milestone','usa'], 0.65, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-73.9857, 40.7484), 4326), 'Geraldine Ferraro became the first woman nominated for Vice President by a major American political party when Walter Mondale selected her as his running mate on the Democratic ticket.', 'Geraldine_Ferraro', 'seed-enrichment', 'approved'),

('hillary-clinton-nominee-2016', 'Hillary Clinton — First Woman Presidential Nominee of Major Party', '2016-07-26', '2016-07-26', 2016, false, 'political', ARRAY['women''s history','election','milestone','usa'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-75.1652, 39.9526), 4326), 'Hillary Clinton became the first woman nominated for President by a major American political party at the 2016 Democratic National Convention in Philadelphia.', 'Hillary_Clinton_2016_presidential_campaign', 'seed-enrichment', 'approved')

ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SCIENCE HISTORY EVENTS
-- ============================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, article_summary, wikipedia_slug, created_by, review_status)
VALUES
('planck-quantum-theory-1900', 'Max Planck — Quantum Theory', '1900-12-14', '1900-12-14', 1900, false, 'science', ARRAY['physics','quantum mechanics','germany','modern science'], 0.85, 'Germany', 'German Empire', ST_SetSRID(ST_MakePoint(13.3889, 52.5170), 4326), 'Max Planck presented his quantum hypothesis to the German Physical Society, proposing that energy is emitted in discrete packets called quanta. This revolutionary idea laid the foundation for quantum mechanics and modern physics.', 'Planck%27s_law', 'seed-enrichment', 'approved')

ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PEOPLE (add missing ones)
-- ============================================

INSERT INTO people (name, birth_year, death_year, gender, wikipedia_slug)
VALUES
('Hypatia', 350, 415, 'female', 'Hypatia'),
('Eleanor of Aquitaine', 1122, 1204, 'female', 'Eleanor_of_Aquitaine'),
('Isabella I of Castile', 1451, 1504, 'female', 'Isabella_I_of_Castile'),
('Mary Wollstonecraft', 1759, 1797, 'female', 'Mary_Wollstonecraft'),
('Elizabeth Cady Stanton', 1815, 1902, 'female', 'Elizabeth_Cady_Stanton'),
('Susan B. Anthony', 1820, 1906, 'female', 'Susan_B._Anthony'),
('Florence Nightingale', 1820, 1910, 'female', 'Florence_Nightingale'),
('Sojourner Truth', 1797, 1883, 'female', 'Sojourner_Truth'),
('Amelia Earhart', 1897, 1937, 'female', 'Amelia_Earhart'),
('Rosa Parks', 1913, 2005, 'female', 'Rosa_Parks'),
('Betty Friedan', 1921, 2006, 'female', 'Betty_Friedan'),
('Simone de Beauvoir', 1908, 1986, 'female', 'Simone_de_Beauvoir'),
('Max Planck', 1858, 1947, 'male', 'Max_Planck')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- EVENT-PEOPLE LINKS
-- ============================================

-- Hypatia
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.slug = 'hypatia-alexandria-murdered' AND p.name = 'Hypatia'
ON CONFLICT DO NOTHING;

-- Eleanor of Aquitaine
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.slug = 'eleanor-aquitaine-queen' AND p.name = 'Eleanor of Aquitaine'
ON CONFLICT DO NOTHING;

-- Isabella of Castile
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.slug = 'isabella-castile-unification' AND p.name = 'Isabella I of Castile'
ON CONFLICT DO NOTHING;

-- Stanton & Anthony → NWSA
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'founder'
FROM events e, people p
WHERE e.slug = 'stanton-anthony-nwsa-1869' AND p.name = 'Elizabeth Cady Stanton'
ON CONFLICT DO NOTHING;

INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'founder'
FROM events e, people p
WHERE e.slug = 'stanton-anthony-nwsa-1869' AND p.name = 'Susan B. Anthony'
ON CONFLICT DO NOTHING;

-- Amelia Earhart
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.slug = 'amelia-earhart-atlantic-1932' AND p.name = 'Amelia Earhart'
ON CONFLICT DO NOTHING;

-- Rosa Parks
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.slug = 'rosa-parks-bus-1955' AND p.name = 'Rosa Parks'
ON CONFLICT DO NOTHING;

-- Betty Friedan → Feminine Mystique + NOW
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'author'
FROM events e, people p
WHERE e.slug = 'betty-friedan-feminine-mystique-1963' AND p.name = 'Betty Friedan'
ON CONFLICT DO NOTHING;

INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'founder'
FROM events e, people p
WHERE e.slug = 'now-founded-1966' AND p.name = 'Betty Friedan'
ON CONFLICT DO NOTHING;

-- Marie Curie → existing radium event
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'discoverer'
FROM events e, people p
WHERE e.title = 'Marie Curie Discovers Radium' AND p.name = 'Marie Curie'
ON CONFLICT DO NOTHING;

-- Planck
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'discoverer'
FROM events e, people p
WHERE e.slug = 'planck-quantum-theory-1900' AND p.name = 'Max Planck'
ON CONFLICT DO NOTHING;

-- Darwin → existing Origin of Species
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'author'
FROM events e, people p
WHERE e.title = 'Darwin Publishes On the Origin of Species' AND p.name = 'Charles Darwin'
ON CONFLICT DO NOTHING;

-- Einstein → existing relativity event
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.title LIKE 'Einstein%Annus Mirabilis%' AND p.name = 'Albert Einstein'
ON CONFLICT DO NOTHING;

-- Florence Nightingale → existing nursing event
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'subject'
FROM events e, people p
WHERE e.title LIKE 'Florence Nightingale%' AND p.name = 'Florence Nightingale'
ON CONFLICT DO NOTHING;

-- Sojourner Truth → existing speech event
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'speaker'
FROM events e, people p
WHERE e.title LIKE 'Sojourner Truth%' AND p.name = 'Sojourner Truth'
ON CONFLICT DO NOTHING;

-- Simone de Beauvoir → existing Second Sex event
INSERT INTO event_people (event_id, person_id, role)
SELECT e.id, p.id, 'author'
FROM events e, people p
WHERE e.title LIKE 'Simone de Beauvoir%' AND p.name = 'Simone de Beauvoir'
ON CONFLICT DO NOTHING;

-- ============================================
-- CAUSALITY LINKS
-- ============================================

-- Wollstonecraft → Seneca Falls
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Wollstonecraft''s Vindication of the Rights of Woman directly inspired the Seneca Falls Convention organizers', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Mary Wollstonecraft%' AND e.title LIKE 'Seneca Falls Convention%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Seneca Falls → NWSA
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'The Seneca Falls Convention launched the organized women''s suffrage movement that led to the NWSA', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Seneca Falls Convention%' AND e.slug = 'stanton-anthony-nwsa-1869'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- NWSA → US Women's Suffrage (19th Amendment)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Decades of organized suffrage activism led directly to the 19th Amendment', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'stanton-anthony-nwsa-1869' AND e.title LIKE '19th Amendment%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Triangle Shirtwaist → labor reform (link to suffrage as contributing)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'The Triangle fire galvanized support for women''s labor rights and broader suffrage', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'triangle-shirtwaist-fire-1911' AND e.title LIKE '19th Amendment%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Friedan → NOW
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'The Feminine Mystique catalyzed second-wave feminism, leading Friedan to co-found NOW', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'betty-friedan-feminine-mystique-1963' AND e.slug = 'now-founded-1966'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- NOW → Roe v. Wade
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'NOW and the broader feminist movement pushed for reproductive rights that culminated in Roe v. Wade', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'now-founded-1966' AND e.slug = 'roe-v-wade-1973'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Rosa Parks → Civil Rights Act (if exists, otherwise skip)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Rosa Parks'' act of defiance and the Montgomery Bus Boycott energized the Civil Rights Movement', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'rosa-parks-bus-1955' AND e.title LIKE '%Civil Rights Act%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Pasteur germ theory → Fleming penicillin
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Pasteur''s germ theory established the microbiology framework that enabled Fleming''s discovery of penicillin', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Pasteur%Germ Theory%' AND e.title LIKE '%Fleming Discovers Penicillin%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Jenner vaccine → Pasteur germ theory
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Jenner''s empirical vaccination work preceded and inspired later germ theory research', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Jenner%Smallpox%' AND c.year_approx = 1796 AND e.title LIKE 'Pasteur%Germ Theory%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Maxwell → Planck → Einstein chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Maxwell''s electromagnetic theory raised the blackbody radiation problem that Planck solved with quantum theory', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Maxwell%Equations%' AND e.slug = 'planck-quantum-theory-1900'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Planck''s quantum hypothesis directly inspired Einstein''s photoelectric effect paper and special relativity', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'planck-quantum-theory-1900' AND e.title LIKE 'Einstein%Annus Mirabilis%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Mendel → Watson & Crick DNA
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.7, 'Mendel''s laws of inheritance established genetics, ultimately leading to the discovery of DNA''s structure', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Mendel Publishes Laws%' AND e.title LIKE 'Watson and Crick%DNA%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- DNA → CRISPR
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.8, 'Understanding DNA''s structure was prerequisite to developing CRISPR gene editing technology', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Watson and Crick%DNA%' AND e.title LIKE 'CRISPR%'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Curie radium → Röntgen X-rays (reverse: Röntgen → Curie)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Röntgen''s discovery of X-rays inspired the Curies'' research into radioactivity', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Röntgen Discovers X-Rays%' AND e.title = 'Marie Curie Discovers Radium'
LIMIT 1
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
