-- Medical History & Public Health Enrichment
-- ~35 new events + ~15 causality links

-- ANCIENT MEDICINE
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, review_status, created_by) VALUES
('edwin-smith-papyrus-surgery', 'Edwin Smith Papyrus — First Surgical Text', '1600-01-01', '1600-12-31', -1600, true, 'The Edwin Smith Papyrus is the oldest known surgical treatise, describing 48 cases of injuries, fractures, wounds, and tumors with rational, clinical treatments. It represents the earliest known shift from magical to empirical medicine.', 'science', 'Middle East', 0.70, 'Egypt', 'New Kingdom Egypt', ST_SetSRID(ST_MakePoint(32.6537, 25.6872), 4326), 'approved', 'enrichment:medical-health'),
('asclepion-temples-greek-medicine', 'Asclepion Temples — Greek Medical Schools', '0350-01-01', '0350-12-31', -350, true, 'The Asclepieia were healing temples sacred to Asclepius, the Greek god of medicine. They functioned as early medical centers where priest-physicians practiced therapeutic techniques including diet, exercise, and dream interpretation.', 'science', 'Europe', 0.60, 'Greece', 'Classical Greece', ST_SetSRID(ST_MakePoint(26.8906, 36.8486), 4326), 'approved', 'enrichment:medical-health'),
('dioscorides-de-materia-medica', 'Dioscorides — De Materia Medica, Foundation of Pharmacology', '0070-01-01', '0070-12-31', 70, false, 'Pedanius Dioscorides, a Greek physician in the Roman army, wrote De Materia Medica, cataloging over 600 plants and their medicinal properties. It remained the primary pharmacological reference for over 1,500 years.', 'science', 'Europe', 0.65, 'Turkey', 'Roman Empire', ST_SetSRID(ST_MakePoint(35.3252, 36.9914), 4326), 'approved', 'enrichment:medical-health'),
('ibn-al-nafis-pulmonary-circulation', 'Ibn al-Nafis Discovers Pulmonary Circulation', '1242-01-01', '1242-12-31', 1242, false, 'Arab physician Ibn al-Nafis described pulmonary circulation — blood flowing from the right ventricle to the lungs and back to the left ventricle — contradicting Galen''s model 400 years before William Harvey.', 'science', 'Middle East', 0.70, 'Egypt', 'Mamluk Sultanate', ST_SetSRID(ST_MakePoint(31.2357, 30.0444), 4326), 'approved', 'enrichment:medical-health')
ON CONFLICT (slug) DO NOTHING;

-- EARLY MODERN MEDICINE
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, review_status, created_by) VALUES
('lind-citrus-prevents-scurvy', 'James Lind Proves Citrus Prevents Scurvy', '1747-05-20', '1747-05-20', 1747, false, 'Scottish physician James Lind conducted one of the first controlled clinical trials, demonstrating that citrus fruits could prevent and cure scurvy. His work eventually led the Royal Navy to issue lime juice rations, saving thousands of sailors.', 'science', 'Europe', 0.70, 'United Kingdom', 'Georgian Britain', ST_SetSRID(ST_MakePoint(-1.3922, 50.8198), 4326), 'approved', 'enrichment:medical-health'),
('john-hunter-experimental-surgery', 'John Hunter — Father of Scientific Surgery', '1770-01-01', '1770-12-31', 1770, false, 'John Hunter transformed surgery from a craft into an experimental science, pioneering tissue grafting, tendon repair, and the scientific study of disease. He is considered the founder of pathological anatomy in England.', 'science', 'Europe', 0.65, 'United Kingdom', 'Georgian Britain', ST_SetSRID(ST_MakePoint(-0.1278, 51.5074), 4326), 'approved', 'enrichment:medical-health'),
('hahnemann-founds-homeopathy', 'Hahnemann Founds Homeopathy', '1796-01-01', '1796-12-31', 1796, false, 'German physician Samuel Hahnemann published his theory of homeopathy, based on the principle of "like cures like" and extreme dilution. Though now considered pseudoscience, it was influential in the history of alternative medicine and prompted improvements in mainstream medical practice.', 'science', 'Europe', 0.50, 'Germany', 'Holy Roman Empire', ST_SetSRID(ST_MakePoint(12.3731, 51.3397), 4326), 'approved', 'enrichment:medical-health')
ON CONFLICT (slug) DO NOTHING;

-- 19TH CENTURY MEDICAL REVOLUTION
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, review_status, created_by) VALUES
('laennec-invents-stethoscope', 'Laennec Invents the Stethoscope', '1816-01-01', '1816-12-31', 1816, false, 'French physician René Laennec invented the stethoscope after feeling uncomfortable placing his ear directly on a female patient''s chest. The instrument revolutionized cardiac and pulmonary diagnosis and remains medicine''s most iconic tool.', 'science', 'Europe', 0.70, 'France', 'Restoration France', ST_SetSRID(ST_MakePoint(-2.8250, 48.6493), 4326), 'approved', 'enrichment:medical-health'),
('ether-anesthesia-first-surgery', 'First Use of Ether Anesthesia in Surgery', '1846-10-16', '1846-10-16', 1846, false, 'William Morton publicly demonstrated ether anesthesia at Massachusetts General Hospital, enabling painless surgery for the first time. "Ether Day" is considered one of medicine''s greatest milestones, transforming surgery from brutal torture into a humane procedure.', 'science', 'Americas', 0.85, 'United States', 'Antebellum America', ST_SetSRID(ST_MakePoint(-71.0689, 42.3626), 4326), 'approved', 'enrichment:medical-health'),
('semmelweis-handwashing', 'Semmelweis Proves Handwashing Prevents Deaths', '1847-01-01', '1847-12-31', 1847, false, 'Hungarian physician Ignaz Semmelweis demonstrated that handwashing with chlorinated lime dramatically reduced puerperal fever deaths in maternity wards. Tragically rejected by the medical establishment, he died in an asylum; his work was vindicated by germ theory decades later.', 'science', 'Europe', 0.80, 'Austria', 'Austrian Empire', ST_SetSRID(ST_MakePoint(16.3738, 48.2082), 4326), 'approved', 'enrichment:medical-health'),
('lister-antiseptic-surgery', 'Lister Introduces Antiseptic Surgery', '1867-01-01', '1867-12-31', 1867, false, 'Joseph Lister applied Louis Pasteur''s germ theory to surgery, using carbolic acid to sterilize instruments and wounds. Antiseptic surgery slashed post-operative mortality from ~50% to under 15%, saving millions of lives.', 'science', 'Europe', 0.85, 'United Kingdom', 'Victorian Britain', ST_SetSRID(ST_MakePoint(-4.2518, 55.8642), 4326), 'approved', 'enrichment:medical-health'),
('pasteur-rabies-vaccine', 'Pasteur Develops Rabies Vaccine', '1885-07-06', '1885-07-06', 1885, false, 'Louis Pasteur successfully vaccinated Joseph Meister, a boy bitten by a rabid dog, using an attenuated rabies virus. This was the first vaccine developed in a laboratory and proved that vaccines could be deliberately designed against specific diseases.', 'science', 'Europe', 0.85, 'France', 'Third French Republic', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'approved', 'enrichment:medical-health'),
('diphtheria-antitoxin', 'Diphtheria Antitoxin — First Immunotherapy', '1891-12-25', '1891-12-25', 1891, false, 'Emil von Behring developed the diphtheria antitoxin, the first effective treatment for a major infectious disease using serum therapy. He won the first Nobel Prize in Physiology or Medicine in 1901 for this breakthrough.', 'science', 'Europe', 0.75, 'Germany', 'German Empire', ST_SetSRID(ST_MakePoint(9.9937, 53.5511), 4326), 'approved', 'enrichment:medical-health')
ON CONFLICT (slug) DO NOTHING;

-- 20TH CENTURY MEDICAL BREAKTHROUGHS
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, article_summary, event_category, region, importance_score, geo_modern, geo_era_label, geo_point, review_status, created_by) VALUES
('landsteiner-blood-types', 'Blood Typing Discovered — Landsteiner', '1901-01-01', '1901-12-31', 1901, false, 'Austrian physician Karl Landsteiner discovered the ABO blood group system, explaining why some blood transfusions succeeded while others killed patients. His work made safe blood transfusions possible and earned the 1930 Nobel Prize.', 'science', 'Europe', 0.80, 'Austria', 'Austro-Hungarian Empire', ST_SetSRID(ST_MakePoint(16.3738, 48.2082), 4326), 'approved', 'enrichment:medical-health'),
('ehrlich-chemotherapy-salvarsan', 'Ehrlich Develops First Chemotherapy — Salvarsan', '1909-01-01', '1909-12-31', 1909, false, 'Paul Ehrlich developed Salvarsan (arsphenamine), the first effective chemotherapeutic agent, to treat syphilis. His concept of a "magic bullet" — a drug that selectively kills pathogens — founded the field of chemotherapy.', 'science', 'Europe', 0.75, 'Germany', 'German Empire', ST_SetSRID(ST_MakePoint(8.6821, 50.1109), 4326), 'approved', 'enrichment:medical-health'),
('insulin-discovery-diabetes', 'Insulin Discovered — Transforming Diabetes Treatment', '1921-07-27', '1921-07-27', 1921, false, 'Frederick Banting and Charles Best isolated insulin at the University of Toronto, transforming Type 1 diabetes from a death sentence into a manageable condition. The first patient, Leonard Thompson, was treated in January 1922.', 'science', 'Americas', 0.90, 'Canada', 'Interwar Canada', ST_SetSRID(ST_MakePoint(-79.3832, 43.6532), 4326), 'approved', 'enrichment:medical-health'),
('sulfonamide-antibiotics', 'Sulfonamide Antibiotics — First Antibacterial Drugs', '1935-01-01', '1935-12-31', 1935, false, 'Gerhard Domagk discovered that Prontosil, a red dye, could cure streptococcal infections in mice and humans. Sulfonamides became the first class of antibacterial drugs widely available, saving countless lives before penicillin was mass-produced.', 'science', 'Europe', 0.75, 'Germany', 'Nazi Germany', ST_SetSRID(ST_MakePoint(6.7735, 51.2277), 4326), 'approved', 'enrichment:medical-health'),
('first-blood-bank', 'First Blood Bank Established', '1937-03-15', '1937-03-15', 1937, false, 'Bernard Fantus established the first hospital blood bank at Cook County Hospital in Chicago, coining the term "blood bank." This innovation made stored blood available for emergencies and transformed surgical and trauma care.', 'science', 'Americas', 0.65, 'United States', 'Interwar America', ST_SetSRID(ST_MakePoint(-87.6298, 41.8781), 4326), 'approved', 'enrichment:medical-health'),
('streptomycin-first-tb-treatment', 'Streptomycin — First Effective Tuberculosis Treatment', '1943-10-19', '1943-10-19', 1943, false, 'Albert Schatz and Selman Waksman discovered streptomycin, the first antibiotic effective against tuberculosis. The subsequent randomized clinical trial (1948) became a landmark in evidence-based medicine methodology.', 'science', 'Americas', 0.80, 'United States', 'WWII America', ST_SetSRID(ST_MakePoint(-74.4474, 40.4774), 4326), 'approved', 'enrichment:medical-health'),
('first-kidney-transplant', 'First Successful Kidney Transplant', '1954-12-23', '1954-12-23', 1954, false, 'Joseph Murray performed the first successful human organ transplant at Peter Bent Brigham Hospital in Boston, transplanting a kidney between identical twins. This opened the era of transplant surgery and Murray won the Nobel Prize in 1990.', 'science', 'Americas', 0.80, 'United States', 'Cold War America', ST_SetSRID(ST_MakePoint(-71.1054, 42.3370), 4326), 'approved', 'enrichment:medical-health'),
('oral-contraceptive-pill', 'Oral Contraceptive Pill Approved — Social Revolution', '1960-05-09', '1960-05-09', 1960, false, 'The FDA approved Enovid as the first oral contraceptive pill, giving women unprecedented control over reproduction. "The Pill" triggered a social revolution, enabling women''s workforce participation, family planning, and the sexual revolution of the 1960s.', 'science', 'Americas', 0.90, 'United States', 'Cold War America', ST_SetSRID(ST_MakePoint(-71.0589, 42.3601), 4326), 'approved', 'enrichment:medical-health'),
('barnard-first-heart-transplant', 'First Human Heart Transplant — Christiaan Barnard', '1967-12-03', '1967-12-03', 1967, false, 'South African surgeon Christiaan Barnard performed the first human-to-human heart transplant at Groote Schuur Hospital in Cape Town. The patient, Louis Washkansky, survived 18 days. The operation made global headlines and opened the frontier of cardiac transplant surgery.', 'science', 'Africa', 0.85, 'South Africa', 'Apartheid South Africa', ST_SetSRID(ST_MakePoint(18.4601, -33.9412), 4326), 'approved', 'enrichment:medical-health'),
('first-ivf-baby', 'First IVF Baby Born — Louise Brown', '1978-07-25', '1978-07-25', 1978, false, 'Louise Brown, the world''s first baby conceived through in vitro fertilization, was born in Oldham, England. Pioneered by Patrick Steptoe and Robert Edwards, IVF has since enabled over 8 million births worldwide.', 'science', 'Europe', 0.80, 'United Kingdom', 'Modern Britain', ST_SetSRID(ST_MakePoint(-2.1183, 53.5409), 4326), 'approved', 'enrichment:medical-health'),
('smallpox-eradicated', 'Smallpox Eradicated Globally — WHO Declares Victory', '1980-05-08', '1980-05-08', 1980, false, 'The World Health Organization officially declared smallpox eradicated, the first (and still only) human disease to be eliminated through vaccination. Smallpox had killed an estimated 300 million people in the 20th century alone.', 'science', 'Europe', 0.90, 'Switzerland', 'Modern World', ST_SetSRID(ST_MakePoint(6.1432, 46.2044), 4326), 'approved', 'enrichment:medical-health'),
('haart-hiv-therapy', 'HAART Therapy — HIV Becomes Manageable', '1996-01-01', '1996-12-31', 1996, false, 'Highly Active Antiretroviral Therapy (HAART) transformed HIV/AIDS from a death sentence into a manageable chronic condition. Combination drug therapy dramatically reduced viral loads and AIDS-related deaths, one of the greatest therapeutic breakthroughs of the 20th century.', 'science', 'Americas', 0.85, 'United States', 'Modern America', ST_SetSRID(ST_MakePoint(-77.0369, 38.9072), 4326), 'approved', 'enrichment:medical-health'),
('hpv-vaccine-approved', 'HPV Vaccine Approved — Cancer Prevention Through Vaccination', '2006-06-08', '2006-06-08', 2006, false, 'The FDA approved Gardasil, the first vaccine to prevent cancer by targeting human papillomavirus (HPV). Developed by Ian Frazer and others, it prevents cervical cancer and other HPV-related cancers, representing a milestone in preventive oncology.', 'science', 'Americas', 0.80, 'United States', 'Modern America', ST_SetSRID(ST_MakePoint(-77.0369, 38.9072), 4326), 'approved', 'enrichment:medical-health')
ON CONFLICT (slug) DO NOTHING;

-- CAUSALITY LINKS
-- Germ theory → antiseptic surgery
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.9, 'Pasteur''s germ theory directly inspired Lister to apply antiseptic techniques to surgery', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'Pasteur''s Germ Theory of Disease' AND e.slug = 'lister-antiseptic-surgery'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Also try alternate Pasteur title
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.9, 'Pasteur''s germ theory directly inspired Lister to apply antiseptic techniques to surgery', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'Pasteur Proves Germ Theory — Microbiology Founded' AND e.slug = 'lister-antiseptic-surgery'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Antiseptic surgery → Koch's discoveries
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.7, 'Lister''s antiseptic methods validated germ theory, encouraging Koch''s systematic identification of disease-causing bacteria', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'lister-antiseptic-surgery' AND e.title = 'Koch Identifies Tuberculosis Bacterium'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Koch → Pasteur rabies vaccine
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.7, 'Koch''s work identifying specific pathogens advanced the germ theory framework that enabled Pasteur''s targeted vaccine development', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'Koch Identifies Tuberculosis Bacterium' AND e.slug = 'pasteur-rabies-vaccine'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Jenner vaccine → smallpox eradication
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.95, 'Jenner''s 1796 smallpox vaccine initiated the 184-year campaign that culminated in the global eradication of smallpox', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'Jenner''s Smallpox Vaccine — Defeating the Greatest Killer' AND e.slug = 'smallpox-eradicated'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Penicillin → streptomycin (antibiotic revolution)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.8, 'Fleming''s penicillin discovery launched systematic antibiotic research, directly inspiring the search for streptomycin and other antibiotics', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'Penicillin Discovered — The Antibiotic Revolution' AND e.slug = 'streptomycin-first-tb-treatment'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Penicillin → sulfonamides (parallel development, contributing)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.5, 'Sulfonamides were developed independently but the broader antibacterial research environment was energized by penicillin''s promise', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'sulfonamide-antibiotics' AND e.title = 'Penicillin Discovered — The Antibiotic Revolution'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Landsteiner blood types → blood bank
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.9, 'Landsteiner''s discovery of blood types made safe blood storage and transfusion possible, enabling the first blood banks', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'landsteiner-blood-types' AND e.slug = 'first-blood-bank'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Blood bank → kidney transplant
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.6, 'Blood banking and transfusion technology was essential infrastructure for complex transplant surgery', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'first-blood-bank' AND e.slug = 'first-kidney-transplant'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Kidney transplant → heart transplant
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.8, 'The success of kidney transplantation proved organ transplant was viable and led directly to attempts at heart transplantation', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'first-kidney-transplant' AND e.slug = 'barnard-first-heart-transplant'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Semmelweis → Lister antiseptic
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.6, 'Semmelweis''s handwashing evidence foreshadowed antiseptic surgery, though Lister was primarily inspired by Pasteur', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'semmelweis-handwashing' AND e.slug = 'lister-antiseptic-surgery'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- AIDS → HAART therapy
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.95, 'The devastating AIDS epidemic drove massive research investment that produced HAART combination therapy', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title = 'AIDS Epidemic Recognized' AND e.slug = 'haart-hiv-therapy'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Oral contraceptive → women's liberation (cross-category)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.7, 'The Pill gave women control over reproduction, enabling greater workforce participation and fueling the women''s liberation movement', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'oral-contraceptive-pill' AND e.title LIKE '%Women''s Liberation%'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Ether anesthesia → modern surgery possible
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct'::text, 0.8, 'Anesthesia made longer, more complex surgical procedures possible, enabling the era of transplant surgery', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.slug = 'ether-anesthesia-first-surgery' AND e.slug = 'first-kidney-transplant'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Hippocrates → empirical medicine tradition
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect'::text, 0.6, 'Hippocratic empirical medicine tradition influenced Avicenna''s systematic medical compendium', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Hippocrates%' AND e.slug = 'avicenna-canon-medicine-1025'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Salk polio vaccine → smallpox eradication campaign
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing'::text, 0.7, 'The success of mass polio vaccination demonstrated that global disease eradication through vaccination was achievable', 'enrichment:medical-health', 'approved'
FROM events c, events e
WHERE c.title LIKE 'Salk Polio Vaccine%' AND e.slug = 'smallpox-eradicated'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;
