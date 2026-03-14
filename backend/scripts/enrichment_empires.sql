-- Data Enrichment: Ottoman, Ming, Aztec, Inca civilizations
-- Only adds events that don't already exist (checked by slug)

BEGIN;

-- ============================================================
-- OTTOMAN EMPIRE - Missing events
-- ============================================================

-- 1354: Ottomans enter Europe at Gallipoli
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ottomans-enter-europe-gallipoli-1354', 'Ottomans Enter Europe at Gallipoli', '1354-01-01', '1354-12-31', 1354, ST_SetSRID(ST_MakePoint(26.7, 40.4), 4326), 'Ottoman Anatolia', 'Turkey', 0.8, 'military', ARRAY['ottoman', 'expansion', 'europe', 'gallipoli'], 'enrichment-script', 'approved', 'The Ottomans crossed into Europe by seizing Gallipoli in 1354, establishing their first permanent foothold on the European continent.')
ON CONFLICT (slug) DO NOTHING;

-- 1396: Battle of Nicopolis
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('battle-nicopolis-1396', 'Battle of Nicopolis', '1396-09-25', '1396-09-25', 1396, ST_SetSRID(ST_MakePoint(24.9, 43.7), 4326), 'Ottoman Balkans', 'Bulgaria', 0.7, 'military', ARRAY['ottoman', 'crusade', 'balkans', 'nicopolis'], 'enrichment-script', 'approved', 'A major Ottoman victory over a crusader army, ending effective Bulgarian resistance and consolidating Ottoman control over the Balkans.')
ON CONFLICT (slug) DO NOTHING;

-- 1402: Battle of Ankara
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('battle-ankara-1402', 'Battle of Ankara — Timur Defeats Bayezid I', '1402-07-20', '1402-07-20', 1402, ST_SetSRID(ST_MakePoint(32.9, 39.9), 4326), 'Ottoman Anatolia', 'Turkey', 0.8, 'military', ARRAY['ottoman', 'timur', 'ankara', 'interregnum'], 'enrichment-script', 'approved', 'Timur decisively defeated Ottoman Sultan Bayezid I at the Battle of Ankara, capturing him and triggering the Ottoman Interregnum.')
ON CONFLICT (slug) DO NOTHING;

-- 1514: Battle of Chaldiran (already exists as battle-of-chaldiran or similar? Let me check - slug is different)
-- Already exists as ottoman related but let me check... "battle-chaldiran-ottoman-safavid-1514" doesn't exist but "Battle of Chaldiran — Ottoman-Safavid Rivalry" does
-- Skip - already exists

-- 1516: Ottoman conquest of Syria/Egypt 
-- Already exists as "Selim I Conquers Egypt — Ottoman Caliphate" (1517)
-- Skip

-- 1529: Siege of Vienna - already exists as siege-of-vienna-1529
-- Skip

-- 1571: Battle of Lepanto - already exists
-- Skip

-- 1683: Siege of Vienna - already exists
-- Skip

-- 1699: Treaty of Karlowitz - already exists
-- Skip

-- 1798: Napoleon invades Egypt
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('napoleon-invades-egypt-1798', 'Napoleon Invades Egypt', '1798-07-01', '1798-07-01', 1798, ST_SetSRID(ST_MakePoint(31.2, 30.0), 4326), 'Ottoman Egypt', 'Egypt', 0.8, 'military', ARRAY['napoleon', 'ottoman', 'egypt', 'french'], 'enrichment-script', 'approved', 'Napoleon Bonaparte launched a military expedition to Ottoman Egypt in 1798, disrupting Ottoman control and bringing European scholarship to the region.')
ON CONFLICT (slug) DO NOTHING;

-- 1821: Greek War of Independence
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('greek-war-independence-1821', 'Greek War of Independence Begins', '1821-03-25', '1821-03-25', 1821, ST_SetSRID(ST_MakePoint(22.0, 38.0), 4326), 'Ottoman Greece', 'Greece', 0.8, 'political', ARRAY['ottoman', 'greece', 'independence', 'nationalism'], 'enrichment-script', 'approved', 'The Greek War of Independence began in 1821 as Greeks revolted against Ottoman rule, eventually leading to the creation of an independent Greek state in 1830.')
ON CONFLICT (slug) DO NOTHING;

-- 1853: Crimean War - check if exists
-- exists as russia-crimean-war-ottoman-1853, skip

-- 1878: Congress of Berlin
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('congress-berlin-1878', 'Congress of Berlin — Ottoman Losses in Balkans', '1878-06-13', '1878-07-13', 1878, ST_SetSRID(ST_MakePoint(13.4, 52.5), 4326), 'Ottoman Empire', 'Germany', 0.8, 'political', ARRAY['ottoman', 'balkans', 'berlin', 'treaty', 'nationalism'], 'enrichment-script', 'approved', 'The Congress of Berlin redrew the map of southeastern Europe, recognizing independence for Serbia, Montenegro, and Romania, and greatly reducing Ottoman territory in Europe.')
ON CONFLICT (slug) DO NOTHING;

-- 1908: Young Turk Revolution
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('young-turk-revolution-1908', 'Young Turk Revolution', '1908-07-03', '1908-07-24', 1908, ST_SetSRID(ST_MakePoint(29.0, 41.0), 4326), 'Ottoman Empire', 'Turkey', 0.7, 'political', ARRAY['ottoman', 'revolution', 'young-turks', 'constitution'], 'enrichment-script', 'approved', 'The Young Turk Revolution of 1908 restored the Ottoman constitution and parliament, ending Sultan Abdul Hamid II''s autocratic rule and ushering in a new political era.')
ON CONFLICT (slug) DO NOTHING;

-- 1912: First Balkan War
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('first-balkan-war-1912', 'First Balkan War', '1912-10-08', '1913-05-30', 1912, ST_SetSRID(ST_MakePoint(23.7, 41.0), 4326), 'Ottoman Balkans', 'Balkans', 0.7, 'military', ARRAY['ottoman', 'balkans', 'war', 'balkan-league'], 'enrichment-script', 'approved', 'The Balkan League (Serbia, Greece, Bulgaria, Montenegro) defeated the Ottoman Empire, stripping it of nearly all its European territories.')
ON CONFLICT (slug) DO NOTHING;

-- 1915: Armenian Genocide
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('armenian-genocide-1915', 'Armenian Genocide Begins', '1915-04-24', '1915-04-24', 1915, ST_SetSRID(ST_MakePoint(35.0, 39.0), 4326), 'Ottoman Empire', 'Turkey', 0.9, 'political', ARRAY['ottoman', 'armenia', 'genocide', 'wwi'], 'enrichment-script', 'approved', 'The Ottoman government began systematic deportation and mass killing of Armenians in 1915, resulting in the deaths of an estimated 1.5 million people in what is widely recognized as a genocide.')
ON CONFLICT (slug) DO NOTHING;

-- 1918: Ottoman Empire collapses
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ottoman-collapse-wwi-1918', 'Ottoman Empire Collapses — End of WWI', '1918-10-30', '1918-10-30', 1918, ST_SetSRID(ST_MakePoint(29.0, 41.0), 4326), 'Ottoman Empire', 'Turkey', 0.8, 'political', ARRAY['ottoman', 'wwi', 'armistice', 'collapse'], 'enrichment-script', 'approved', 'The Armistice of Mudros ended Ottoman participation in World War I, leading to Allied occupation and the eventual dissolution of the empire.')
ON CONFLICT (slug) DO NOTHING;

-- 1923: Treaty of Lausanne - already exists as ottoman-empire-end-1923
-- Skip

-- ============================================================
-- MING DYNASTY CHINA - Missing events
-- ============================================================

-- 1368: Ming Dynasty Founded - already exists
-- 1380: Abolition of chancellery
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ming-abolition-chancellery-1380', 'Ming Abolition of the Chancellery — Imperial Absolutism', '1380-01-01', '1380-12-31', 1380, ST_SetSRID(ST_MakePoint(118.8, 32.0), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'government', 'absolutism'], 'enrichment-script', 'approved', 'Zhu Yuanzhang abolished the office of chancellor in 1380 after a purge, concentrating all executive power in the emperor and fundamentally reshaping Chinese governance for centuries.')
ON CONFLICT (slug) DO NOTHING;

-- 1402: Yongle Emperor
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('yongle-emperor-usurps-1402', 'Yongle Emperor Usurps Throne', '1402-07-13', '1402-07-13', 1402, ST_SetSRID(ST_MakePoint(118.8, 32.0), 4326), 'Ming China', 'China', 0.8, 'political', ARRAY['ming', 'china', 'yongle', 'civil-war'], 'enrichment-script', 'approved', 'The Prince of Yan seized the throne from his nephew, becoming the Yongle Emperor. He would move the capital to Beijing and sponsor Zheng He''s great voyages.')
ON CONFLICT (slug) DO NOTHING;

-- 1405: Zheng He - already exists (multiple)
-- 1415: Forbidden City
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('forbidden-city-completed-1420', 'Forbidden City Completed in Beijing', '1420-01-01', '1420-12-31', 1420, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.9, 'cultural', ARRAY['ming', 'china', 'beijing', 'forbidden-city', 'architecture'], 'enrichment-script', 'approved', 'The Yongle Emperor completed the Forbidden City in Beijing around 1420, creating the world''s largest palace complex that would serve as the imperial residence for over 500 years.')
ON CONFLICT (slug) DO NOTHING;

-- 1421: Capital moved to Beijing
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ming-capital-beijing-1421', 'Ming Capital Moved to Beijing', '1421-02-02', '1421-02-02', 1421, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'beijing', 'capital'], 'enrichment-script', 'approved', 'The Yongle Emperor officially moved the Ming capital from Nanjing to Beijing in 1421, establishing Beijing as China''s political center for the next six centuries.')
ON CONFLICT (slug) DO NOTHING;

-- 1449: Tumu Crisis
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('tumu-crisis-1449', 'Tumu Crisis — Ming Emperor Captured by Mongols', '1449-09-01', '1449-09-01', 1449, ST_SetSRID(ST_MakePoint(115.7, 40.4), 4326), 'Ming China', 'China', 0.8, 'military', ARRAY['ming', 'china', 'mongols', 'tumu', 'crisis'], 'enrichment-script', 'approved', 'The Zhengtong Emperor was captured by Oirat Mongols at the Battle of Tumu Fortress, a humiliating defeat that ended Ming offensive campaigns against the steppe nomads.')
ON CONFLICT (slug) DO NOTHING;

-- 1472: Birth of Wang Yangming - already exists as wang-yangming-s-neo-confucianism (1509)
-- Skip

-- 1487: Hongzhi Emperor
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('hongzhi-emperor-reforms-1487', 'Hongzhi Emperor — Model Emperor Reforms', '1487-01-01', '1487-12-31', 1487, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.6, 'political', ARRAY['ming', 'china', 'hongzhi', 'reform'], 'enrichment-script', 'approved', 'The Hongzhi Emperor is regarded as one of Ming China''s most virtuous rulers, known for fiscal prudence, reducing court corruption, and being the only monogamous emperor in Chinese history.')
ON CONFLICT (slug) DO NOTHING;

-- 1517: Portuguese arrive at Guangzhou
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('portuguese-guangzhou-1517', 'Portuguese Arrive at Guangzhou — First European Contact with Ming China', '1517-01-01', '1517-12-31', 1517, ST_SetSRID(ST_MakePoint(113.3, 23.1), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'portugal', 'trade', 'european-contact'], 'enrichment-script', 'approved', 'Portuguese traders arrived at Guangzhou in 1517, marking the first direct maritime contact between Europe and Ming China and beginning centuries of Sino-European trade relations.')
ON CONFLICT (slug) DO NOTHING;

-- 1519: Wang Yangming defeats Prince of Ning
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('wang-yangming-ning-rebellion-1519', 'Wang Yangming Defeats Prince of Ning Rebellion', '1519-01-01', '1519-12-31', 1519, ST_SetSRID(ST_MakePoint(115.9, 28.7), 4326), 'Ming China', 'China', 0.6, 'military', ARRAY['ming', 'china', 'wang-yangming', 'rebellion'], 'enrichment-script', 'approved', 'The philosopher-general Wang Yangming swiftly suppressed the Prince of Ning''s rebellion in 43 days, demonstrating his philosophy of unity of knowledge and action.')
ON CONFLICT (slug) DO NOTHING;

-- 1550: Altan Khan raids Beijing
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('altan-khan-raids-beijing-1550', 'Altan Khan Raids Beijing — Mongol Pressure Continues', '1550-01-01', '1550-12-31', 1550, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.7, 'military', ARRAY['ming', 'china', 'mongols', 'altan-khan', 'beijing'], 'enrichment-script', 'approved', 'Mongol leader Altan Khan raided the outskirts of Beijing in 1550, exposing the vulnerability of the Ming capital and intensifying Great Wall construction efforts.')
ON CONFLICT (slug) DO NOTHING;

-- 1567: Maritime trade restrictions lifted
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ming-maritime-trade-lifted-1567', 'Ming Maritime Trade Restrictions Lifted — Silver Economy Begins', '1567-01-01', '1567-12-31', 1567, ST_SetSRID(ST_MakePoint(118.1, 24.5), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'trade', 'silver', 'maritime'], 'enrichment-script', 'approved', 'The Longqing Emperor partially lifted the Ming sea ban in 1567, legalizing private maritime trade and integrating China into the global silver economy.')
ON CONFLICT (slug) DO NOTHING;

-- 1572: Zhang Juzheng
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('zhang-juzheng-reforms-1572', 'Zhang Juzheng Regency — Fiscal Reforms', '1572-01-01', '1572-12-31', 1572, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'zhang-juzheng', 'reform', 'taxation'], 'enrichment-script', 'approved', 'Grand Secretary Zhang Juzheng instituted sweeping fiscal reforms including the Single Whip tax reform, briefly revitalizing Ming governance before his posthumous disgrace.')
ON CONFLICT (slug) DO NOTHING;

-- 1582: Matteo Ricci
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('matteo-ricci-china-1582', 'Matteo Ricci Arrives in China — Jesuit Mission Begins', '1582-01-01', '1582-12-31', 1582, ST_SetSRID(ST_MakePoint(113.3, 23.1), 4326), 'Ming China', 'China', 0.7, 'cultural', ARRAY['ming', 'china', 'jesuit', 'ricci', 'christianity', 'science'], 'enrichment-script', 'approved', 'Italian Jesuit Matteo Ricci arrived in China in 1582, eventually gaining access to the imperial court and facilitating unprecedented scientific and cultural exchange between Europe and China.')
ON CONFLICT (slug) DO NOTHING;

-- 1601: Donglin Academy
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('donglin-academy-1604', 'Donglin Academy Movement — Political Reform Faction', '1604-01-01', '1604-12-31', 1604, ST_SetSRID(ST_MakePoint(120.3, 31.5), 4326), 'Ming China', 'China', 0.6, 'political', ARRAY['ming', 'china', 'donglin', 'reform', 'faction'], 'enrichment-script', 'approved', 'The Donglin Academy was refounded in 1604 as a center of Confucian political reform, becoming a powerful faction that opposed eunuch domination of the late Ming court.')
ON CONFLICT (slug) DO NOTHING;

-- 1619: Battle of Sarhu
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('battle-sarhu-1619', 'Battle of Sarhu — Ming Defeated by Manchu', '1619-04-14', '1619-04-18', 1619, ST_SetSRID(ST_MakePoint(124.0, 41.8), 4326), 'Ming China', 'China', 0.8, 'military', ARRAY['ming', 'china', 'manchu', 'sarhu', 'qing'], 'enrichment-script', 'approved', 'The Manchu decisively defeated four Ming armies at the Battle of Sarhu, marking the turning point in the Manchu-Ming conflict and the beginning of Ming military decline in Manchuria.')
ON CONFLICT (slug) DO NOTHING;

-- 1627: Peasant rebellions
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('ming-peasant-rebellions-1627', 'Peasant Rebellions Begin Across China', '1627-01-01', '1627-12-31', 1627, ST_SetSRID(ST_MakePoint(109.0, 34.3), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'rebellion', 'famine', 'li-zicheng'], 'enrichment-script', 'approved', 'Widespread peasant rebellions erupted across northern China starting in 1627, driven by famine, heavy taxation, and government dysfunction, eventually leading to the Ming dynasty''s fall.')
ON CONFLICT (slug) DO NOTHING;

-- 1636: Manchus proclaim Qing
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('manchus-proclaim-qing-1636', 'Manchus Proclaim Qing Dynasty', '1636-05-15', '1636-05-15', 1636, ST_SetSRID(ST_MakePoint(123.4, 41.8), 4326), 'Manchuria', 'China', 0.8, 'political', ARRAY['ming', 'qing', 'manchu', 'dynasty'], 'enrichment-script', 'approved', 'Hong Taiji renamed the Jurchen state as the Qing Dynasty in 1636, signaling the Manchu intention to replace the Ming as rulers of all China.')
ON CONFLICT (slug) DO NOTHING;

-- 1642: Yellow River floods
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('yellow-river-floods-1642', 'Yellow River Floods — Famine and Millions Dead', '1642-01-01', '1642-12-31', 1642, ST_SetSRID(ST_MakePoint(114.3, 34.8), 4326), 'Ming China', 'China', 0.7, 'political', ARRAY['ming', 'china', 'flood', 'famine', 'kaifeng'], 'enrichment-script', 'approved', 'Ming forces deliberately breached the Yellow River dikes to flood the rebel-held city of Kaifeng in 1642, killing hundreds of thousands of civilians and devastating the region.')
ON CONFLICT (slug) DO NOTHING;

-- 1644: Fall of Ming - check if exists... not specifically
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('fall-of-ming-dynasty-1644', 'Fall of Ming Dynasty — Chongzhen Emperor Suicide, Qing Enters Beijing', '1644-04-25', '1644-06-06', 1644, ST_SetSRID(ST_MakePoint(116.4, 39.9), 4326), 'Ming China', 'China', 0.9, 'political', ARRAY['ming', 'qing', 'china', 'li-zicheng', 'dynasty-fall'], 'enrichment-script', 'approved', 'Rebel leader Li Zicheng captured Beijing in April 1644, and the last Ming emperor hanged himself. Weeks later, Manchu forces entered Beijing and established Qing rule over China.')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AZTEC EMPIRE - Missing events
-- ============================================================

-- 1300: Mexica arrive
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('mexica-arrive-valley-mexico-1300', 'Mexica/Aztec Arrive in Valley of Mexico', '1300-01-01', '1300-12-31', 1300, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.7, 'political', ARRAY['aztec', 'mexica', 'migration', 'mesoamerica'], 'enrichment-script', 'approved', 'The Mexica people arrived in the Valley of Mexico around 1300 after a long migration from the legendary homeland of Aztlán, initially serving as mercenaries for established city-states.')
ON CONFLICT (slug) DO NOTHING;

-- 1325: Tenochtitlan - already exists (multiple)
-- 1370: Tepanec dominance
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('tepanec-dominance-1370', 'Tepanec Dominance — Triple Alliance Precursor', '1370-01-01', '1370-12-31', 1370, ST_SetSRID(ST_MakePoint(-99.2, 19.5), 4326), 'Valley of Mexico', 'Mexico', 0.6, 'political', ARRAY['aztec', 'tepanec', 'azcapotzalco', 'mesoamerica'], 'enrichment-script', 'approved', 'The Tepanec kingdom of Azcapotzalco dominated the Valley of Mexico, with the Mexica serving as their tributary warriors before eventually overthrowing them.')
ON CONFLICT (slug) DO NOTHING;

-- 1428: Triple Alliance - already exists
-- 1440: Moctezuma I
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('moctezuma-i-tlatoani-1440', 'Moctezuma I Becomes Tlatoani — Aztec Empire Expansion', '1440-01-01', '1440-12-31', 1440, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.7, 'political', ARRAY['aztec', 'moctezuma', 'expansion', 'tlatoani'], 'enrichment-script', 'approved', 'Moctezuma I became the fifth tlatoani of Tenochtitlan in 1440, launching major military campaigns and public works that transformed the Aztec state into a true empire.')
ON CONFLICT (slug) DO NOTHING;

-- 1450: Great Famine - already exists as aztec-flower-wars-intensify (1450)
-- Let's add the famine specifically
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('aztec-great-famine-1450', 'Aztec Great Famine — Massive Sacrifices', '1450-01-01', '1454-12-31', 1450, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.7, 'political', ARRAY['aztec', 'famine', 'sacrifice', 'mesoamerica'], 'enrichment-script', 'approved', 'A devastating four-year famine struck the Valley of Mexico around 1450, leading to massive human sacrifices to appease the gods and driving Aztec expansion for tribute.')
ON CONFLICT (slug) DO NOTHING;

-- 1473: Tlatelolco absorbed
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('tlatelolco-absorbed-1473', 'Tlatelolco Absorbed — Tenochtitlan Controls the Lake', '1473-01-01', '1473-12-31', 1473, ST_SetSRID(ST_MakePoint(-99.1, 19.45), 4326), 'Valley of Mexico', 'Mexico', 0.6, 'military', ARRAY['aztec', 'tlatelolco', 'tenochtitlan', 'conquest'], 'enrichment-script', 'approved', 'Tenochtitlan conquered its sister city Tlatelolco in 1473, absorbing its famous marketplace and consolidating control over Lake Texcoco.')
ON CONFLICT (slug) DO NOTHING;

-- 1487: Templo Mayor - check if exists... not specifically
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('templo-mayor-dedication-1487', 'Dedication of Templo Mayor — Mass Sacrifices', '1487-01-01', '1487-12-31', 1487, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.8, 'cultural', ARRAY['aztec', 'templo-mayor', 'sacrifice', 'religion'], 'enrichment-script', 'approved', 'The Aztecs dedicated the expanded Templo Mayor pyramid in 1487 with an unprecedented series of human sacrifices, demonstrating Tenochtitlan''s power and religious authority.')
ON CONFLICT (slug) DO NOTHING;

-- 1502: Moctezuma II
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('moctezuma-ii-emperor-1502', 'Moctezuma II Becomes Emperor', '1502-01-01', '1502-12-31', 1502, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.7, 'political', ARRAY['aztec', 'moctezuma-ii', 'emperor', 'tlatoani'], 'enrichment-script', 'approved', 'Moctezuma II ascended as the ninth tlatoani of the Aztec Empire in 1502, ruling over a vast domain before encountering the Spanish conquistadors.')
ON CONFLICT (slug) DO NOTHING;

-- 1517: First Spanish contact
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('first-spanish-contact-yucatan-1517', 'First Spanish Contact — Hernández de Córdoba Reaches Yucatán', '1517-02-01', '1517-02-01', 1517, ST_SetSRID(ST_MakePoint(-90.4, 20.5), 4326), 'Mesoamerica', 'Mexico', 0.7, 'political', ARRAY['aztec', 'spanish', 'contact', 'yucatan', 'exploration'], 'enrichment-script', 'approved', 'Francisco Hernández de Córdoba''s expedition reached the Yucatán Peninsula in 1517, the first significant European contact with Mesoamerican civilizations.')
ON CONFLICT (slug) DO NOTHING;

-- 1519: Cortés - already exists
-- 1520: La Noche Triste - already exists
-- 1520: Smallpox
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('smallpox-tenochtitlan-1520', 'Smallpox Epidemic Devastates Tenochtitlan', '1520-01-01', '1520-12-31', 1520, ST_SetSRID(ST_MakePoint(-99.1, 19.4), 4326), 'Valley of Mexico', 'Mexico', 0.9, 'political', ARRAY['aztec', 'smallpox', 'epidemic', 'disease', 'columbian-exchange'], 'enrichment-script', 'approved', 'A devastating smallpox epidemic swept through Tenochtitlan in 1520, killing up to 40% of the population including Emperor Cuitláhuac, fatally weakening Aztec resistance to Spanish conquest.')
ON CONFLICT (slug) DO NOTHING;

-- 1521: Fall of Tenochtitlan - already exists

-- ============================================================
-- INCA EMPIRE - Missing events
-- ============================================================

-- 1200: Manco Cápac
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('manco-capac-founds-inca-1200', 'Manco Cápac Founds Inca State at Cusco', '1200-01-01', '1200-12-31', 1200, ST_SetSRID(ST_MakePoint(-71.9, -13.5), 4326), 'Inca Empire', 'Peru', 0.7, 'political', ARRAY['inca', 'cusco', 'founding', 'manco-capac'], 'enrichment-script', 'approved', 'According to Inca tradition, the legendary Manco Cápac founded the Kingdom of Cusco around 1200, establishing the dynasty that would eventually create the largest empire in pre-Columbian America.')
ON CONFLICT (slug) DO NOTHING;

-- 1300: Sinchi Roca
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('sinchi-roca-inca-1300', 'Sinchi Roca — Second Sapa Inca', '1300-01-01', '1300-12-31', 1300, ST_SetSRID(ST_MakePoint(-71.9, -13.5), 4326), 'Inca Empire', 'Peru', 0.6, 'political', ARRAY['inca', 'cusco', 'sinchi-roca', 'dynasty'], 'enrichment-script', 'approved', 'Sinchi Roca, the second Sapa Inca, consolidated the small Inca kingdom around Cusco during the early period of the dynasty''s development.')
ON CONFLICT (slug) DO NOTHING;

-- 1400: Viracocha Inca
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('viracocha-inca-expansion-1400', 'Viracocha Inca — First Major Expansion', '1400-01-01', '1400-12-31', 1400, ST_SetSRID(ST_MakePoint(-71.9, -13.5), 4326), 'Inca Empire', 'Peru', 0.6, 'political', ARRAY['inca', 'viracocha', 'expansion'], 'enrichment-script', 'approved', 'Viracocha Inca began the first significant territorial expansion of the Inca state beyond the Cusco Valley, setting the stage for the dramatic conquests of his successor Pachacuti.')
ON CONFLICT (slug) DO NOTHING;

-- 1438: Pachacuti - already exists (multiple)
-- 1450: Machu Picchu
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('machu-picchu-construction-1450', 'Construction of Machu Picchu', '1450-01-01', '1460-12-31', 1450, ST_SetSRID(ST_MakePoint(-72.5, -13.2), 4326), 'Inca Empire', 'Peru', 0.9, 'cultural', ARRAY['inca', 'machu-picchu', 'architecture', 'wonder'], 'enrichment-script', 'approved', 'Pachacuti ordered the construction of Machu Picchu around 1450 as a royal estate high in the Andes, creating one of the most iconic archaeological sites in the world.')
ON CONFLICT (slug) DO NOTHING;

-- 1463: Conquest of Chimú
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('inca-conquest-chimu-1463', 'Inca Conquest of Chimú', '1463-01-01', '1470-12-31', 1463, ST_SetSRID(ST_MakePoint(-79.1, -8.1), 4326), 'Inca Empire', 'Peru', 0.7, 'military', ARRAY['inca', 'chimu', 'conquest', 'expansion'], 'enrichment-script', 'approved', 'The Inca Empire conquered the Chimú kingdom, the largest pre-Inca state on the Pacific coast, absorbing its sophisticated metalworking and administrative traditions.')
ON CONFLICT (slug) DO NOTHING;

-- 1470: Road system - already exists
-- 1471: Tupac Inca Yupanqui
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('tupac-inca-yupanqui-1471', 'Tupac Inca Yupanqui — Empire Expands to Ecuador, Bolivia, Argentina', '1471-01-01', '1493-12-31', 1471, ST_SetSRID(ST_MakePoint(-71.9, -13.5), 4326), 'Inca Empire', 'Peru', 0.7, 'political', ARRAY['inca', 'tupac-yupanqui', 'expansion', 'conquest'], 'enrichment-script', 'approved', 'Tupac Inca Yupanqui massively expanded the Inca Empire through conquests reaching modern Ecuador, Bolivia, Chile, and Argentina, making Tawantinsuyu the largest empire in the Americas.')
ON CONFLICT (slug) DO NOTHING;

-- 1493: Huayna Capac - already exists
-- 1527: Huayna Capac dies
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('huayna-capac-dies-1527', 'Huayna Capac Dies of Smallpox — Inca Civil War Begins', '1527-01-01', '1527-12-31', 1527, ST_SetSRID(ST_MakePoint(-78.5, -0.2), 4326), 'Inca Empire', 'Ecuador', 0.8, 'political', ARRAY['inca', 'huayna-capac', 'smallpox', 'civil-war', 'succession'], 'enrichment-script', 'approved', 'Sapa Inca Huayna Capac died of smallpox (which preceded the Spanish arrival), triggering a devastating civil war between his sons Atahualpa and Huáscar that fatally weakened the empire.')
ON CONFLICT (slug) DO NOTHING;

-- 1532: Atahualpa wins civil war
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('atahualpa-wins-civil-war-1532', 'Atahualpa Defeats Huáscar — Wins Inca Civil War', '1532-04-01', '1532-04-01', 1532, ST_SetSRID(ST_MakePoint(-78.5, -0.2), 4326), 'Inca Empire', 'Ecuador', 0.7, 'military', ARRAY['inca', 'atahualpa', 'huascar', 'civil-war'], 'enrichment-script', 'approved', 'Atahualpa defeated and captured his half-brother Huáscar, winning the Inca civil war just as Francisco Pizarro and his conquistadors were approaching the empire.')
ON CONFLICT (slug) DO NOTHING;

-- 1532: Pizarro - already exists
-- 1533: Execution of Atahualpa
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('execution-atahualpa-1533', 'Execution of Atahualpa — Inca Empire Collapses', '1533-07-26', '1533-07-26', 1533, ST_SetSRID(ST_MakePoint(-78.5, -7.2), 4326), 'Inca Empire', 'Peru', 0.9, 'political', ARRAY['inca', 'atahualpa', 'execution', 'spanish-conquest'], 'enrichment-script', 'approved', 'The Spanish executed Atahualpa by garrote in Cajamarca in 1533, despite receiving a massive ransom in gold and silver, effectively ending centralized Inca authority.')
ON CONFLICT (slug) DO NOTHING;

-- 1536: Manco Inca rebellion
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('manco-inca-rebellion-1536', 'Manco Inca Rebellion — Great Siege of Cusco', '1536-05-01', '1537-03-01', 1536, ST_SetSRID(ST_MakePoint(-71.9, -13.5), 4326), 'Inca Empire', 'Peru', 0.7, 'military', ARRAY['inca', 'manco-inca', 'rebellion', 'cusco', 'siege'], 'enrichment-script', 'approved', 'Manco Inca launched a massive rebellion against the Spanish, besieging Cusco for nearly a year with an army of over 100,000 warriors before being forced to retreat.')
ON CONFLICT (slug) DO NOTHING;

-- 1537: Neo-Inca - already exists
-- 1545: Potosí
INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, geo_point, geo_era_label, geo_modern, importance_score, event_category, tags, created_by, review_status, article_summary)
VALUES ('potosi-silver-mines-1545', 'Potosí Silver Mines Discovered — Colonial Economy Begins', '1545-01-01', '1545-12-31', 1545, ST_SetSRID(ST_MakePoint(-65.7, -19.6), 4326), 'Colonial South America', 'Bolivia', 0.9, 'political', ARRAY['inca', 'silver', 'potosi', 'colonial', 'mining', 'spanish-empire'], 'enrichment-script', 'approved', 'The discovery of the Cerro Rico silver deposits at Potosí in 1545 created the richest mine in history, fueling the Spanish Empire and transforming the global economy through massive silver flows.')
ON CONFLICT (slug) DO NOTHING;

-- 1572: Tupac Amaru I - already exists as execution-tupac-amaru-i-1572

COMMIT;
