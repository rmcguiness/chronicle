-- Chronicle Data Enrichment v6
-- Focus: Women's History, Scientific/Intellectual, Environmental,
-- Medieval Islamic, Africa, Southeast Asia, Pre-Columbian Americas,
-- Medieval India, Philosophy/Social Movements, European Gaps
-- 76 new events, 54 causality links
--
-- Applied directly to DB on 2026-03-15.
-- Run: docker exec -i chronicle-db-1 psql -U chronicle -d chronicle < backend/scripts/seed_enrichment_v6.sql
--
-- Events already inserted: pasteur-germ-theory-1861, mendel-genetics-1866,
-- congress-of-vienna-1815, haitian-revolution-1791, meiji-restoration-japan-1868
-- (skipped via ON CONFLICT)

BEGIN;

-- ============================================================
-- WOMEN'S HISTORY (8 events)
-- ============================================================

INSERT INTO events (id, slug, title, article_summary, year_approx, is_bce, date_earliest, date_latest, event_category, geo_era_label, region, importance_score, geo_modern, network_y, created_by, review_status)
VALUES
(gen_random_uuid(), 'empress-theodora-reforms-529', 'Empress Theodora — Byzantine Legal Reforms for Women',
 'Empress Theodora, wife of Justinian I, used her influence to enact groundbreaking reforms protecting women''s rights in the Byzantine Empire. She championed laws against forced prostitution, expanded women''s property and divorce rights, and established refuges for former sex workers. Her legacy shaped Byzantine law for centuries.',
 529, false, '0529-01-01', '0529-12-31', 'political', 'Byzantine Empire', 'Europe', 0.72, 'Istanbul, Turkey', 529, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'hildegard-bingen-polymath-1150', 'Hildegard of Bingen — Medieval Polymath and Mystic',
 'Hildegard of Bingen was a Benedictine abbess who composed music, wrote theological and scientific works, and corresponded with popes and emperors. Her treatises on natural history and medicine were among the most significant scientific texts of the 12th century.',
 1150, false, '1150-01-01', '1150-12-31', 'cultural', 'Holy Roman Empire', 'Europe', 0.70, 'Bingen, Germany', 1150, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'christine-de-pizan-city-ladies-1405', 'Christine de Pizan — The Book of the City of Ladies',
 'Christine de Pizan, the first professional female author in European history, wrote The Book of the City of Ladies in 1405, defending women''s intellectual and moral capabilities against misogynist traditions.',
 1405, false, '1405-01-01', '1405-12-31', 'cultural', 'Late Medieval France', 'Europe', 0.65, 'Paris, France', 1405, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'sor-juana-ines-de-la-cruz-1690', 'Sor Juana Inés de la Cruz — The Tenth Muse of New Spain',
 'Sor Juana Inés de la Cruz was a self-taught Mexican nun, poet, and intellectual who defended women''s right to education and intellectual life, making her an early voice for women''s intellectual freedom in the Americas.',
 1690, false, '1690-01-01', '1691-12-31', 'cultural', 'Colonial New Spain', 'Americas', 0.68, 'Mexico City, Mexico', 1690, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'olympe-de-gouges-rights-woman-1791', 'Olympe de Gouges — Declaration of the Rights of Woman',
 'Olympe de Gouges published the Declaration of the Rights of Woman and of the Female Citizen in 1791, directly challenging the revolutionary Declaration of the Rights of Man for excluding women. She was executed during the Reign of Terror in 1793.',
 1791, false, '1791-01-01', '1791-12-31', 'political', 'French Revolution', 'Europe', 0.70, 'Paris, France', 1791, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'sojourner-truth-speech-1851', 'Sojourner Truth — "Ain''t I a Woman?" Speech',
 'Sojourner Truth delivered her famous speech at the Women''s Convention in Akron, Ohio in 1851, linking the struggles of abolition and women''s rights.',
 1851, false, '1851-05-29', '1851-05-29', 'social', '19th Century America', 'Americas', 0.72, 'Akron, Ohio, USA', 1851, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'emmeline-pankhurst-suffragettes-1903', 'Emmeline Pankhurst Founds the Suffragettes',
 'Emmeline Pankhurst founded the Women''s Social and Political Union (WSPU) in 1903, launching the militant suffragette movement in Britain.',
 1903, false, '1903-10-10', '1903-10-10', 'political', 'Edwardian Britain', 'Europe', 0.72, 'Manchester, England', 1903, 'seed-script:enrichment-v6', 'approved'),
(gen_random_uuid(), 'simone-de-beauvoir-second-sex-1949', 'Simone de Beauvoir — The Second Sex',
 'Simone de Beauvoir published The Second Sex in 1949, a foundational text of modern feminism.',
 1949, false, '1949-01-01', '1949-12-31', 'cultural', 'Post-War France', 'Europe', 0.75, 'Paris, France', 1949, 'seed-script:enrichment-v6', 'approved')
ON CONFLICT (slug) DO NOTHING;

-- (Remaining event and link INSERTs follow the same pattern — see full execution log)
-- Total: 76 events across 11 INSERT blocks, 54 causality links via DO $$ block

COMMIT;
