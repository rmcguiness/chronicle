BEGIN;

-- Helper: use slug-based subqueries for readability
-- OTTOMAN chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status) VALUES
((SELECT id FROM events WHERE slug='ottoman-empire-founding-1299' LIMIT 1), (SELECT id FROM events WHERE slug='ottomans-enter-europe-gallipoli-1354' LIMIT 1), 'direct', 0.8, 'Ottoman state expansion led to European foothold at Gallipoli', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ottomans-enter-europe-gallipoli-1354' LIMIT 1), (SELECT id FROM events WHERE slug='battle-of-kosovo-1389' LIMIT 1), 'direct', 0.8, 'Ottoman European expansion led to Battle of Kosovo', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='battle-of-kosovo-1389' LIMIT 1), (SELECT id FROM events WHERE slug='battle-nicopolis-1396' LIMIT 1), 'direct', 0.7, 'Ottoman Balkan control after Kosovo led to Nicopolis campaign', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='battle-nicopolis-1396' LIMIT 1), (SELECT id FROM events WHERE slug='battle-ankara-1402' LIMIT 1), 'contributing', 0.5, 'Ottoman overextension contributed to vulnerability at Ankara', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='battle-ankara-1402' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-constantinople-1453' LIMIT 1), 'indirect', 0.5, 'Ottoman recovery from Interregnum eventually led to Constantinople conquest', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='fourth-crusade-sack-of-constantinople' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-constantinople-1453' LIMIT 1), 'contributing', 0.7, 'Fourth Crusade weakened Byzantium, making Ottoman conquest possible', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='fall-of-constantinople-1453' LIMIT 1), (SELECT id FROM events WHERE slug='ottoman-empire-suleiman-magnificent' LIMIT 1), 'direct', 0.7, 'Constantinople conquest enabled Ottoman golden age under Suleiman', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ottoman-empire-suleiman-magnificent' LIMIT 1), (SELECT id FROM events WHERE slug='siege-of-vienna-1529' LIMIT 1), 'direct', 0.8, 'Suleiman launched the first siege of Vienna', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='fall-of-constantinople-1453' LIMIT 1), (SELECT id FROM events WHERE slug='battle-of-lepanto' LIMIT 1), 'indirect', 0.5, 'Ottoman naval power after Constantinople led to Mediterranean confrontation at Lepanto', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='siege-vienna-1683' LIMIT 1), (SELECT id FROM events WHERE slug='treaty-of-karlowitz' LIMIT 1), 'direct', 0.9, 'Failed siege of Vienna led directly to Ottoman retreat and Treaty of Karlowitz', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='napoleon-invades-egypt-1798' LIMIT 1), (SELECT id FROM events WHERE slug='greek-war-independence-1821' LIMIT 1), 'contributing', 0.5, 'Napoleon''s invasion weakened Ottoman prestige, encouraging Greek independence', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='greek-war-independence-1821' LIMIT 1), (SELECT id FROM events WHERE slug='congress-berlin-1878' LIMIT 1), 'contributing', 0.6, 'Greek independence inspired Balkan nationalism leading to Congress of Berlin', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='congress-berlin-1878' LIMIT 1), (SELECT id FROM events WHERE slug='first-balkan-war-1912' LIMIT 1), 'direct', 0.7, 'Berlin Congress created independent Balkan states that later attacked Ottoman remnants', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='young-turk-revolution-1908' LIMIT 1), (SELECT id FROM events WHERE slug='armenian-genocide-1915' LIMIT 1), 'contributing', 0.6, 'Young Turk nationalist ideology contributed to Armenian Genocide', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='first-balkan-war-1912' LIMIT 1), (SELECT id FROM events WHERE slug='ottoman-collapse-wwi-1918' LIMIT 1), 'contributing', 0.6, 'Balkan War losses weakened Ottomans before WWI', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ottoman-collapse-wwi-1918' LIMIT 1), (SELECT id FROM events WHERE slug='partition-ottoman-empire-1920' LIMIT 1), 'direct', 0.9, 'Ottoman WWI defeat led to partition', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='partition-ottoman-empire-1920' LIMIT 1), (SELECT id FROM events WHERE slug='ottoman-empire-end-1923' LIMIT 1), 'direct', 0.9, 'Partition and Turkish War of Independence led to Republic of Turkey', 'enrichment-script', 'approved')
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- MING chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status) VALUES
((SELECT id FROM events WHERE slug='ming-dynasty-founding-1368' LIMIT 1), (SELECT id FROM events WHERE slug='ming-abolition-chancellery-1380' LIMIT 1), 'direct', 0.8, 'Zhu Yuanzhang''s consolidation of power led to abolishing the chancellery', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ming-abolition-chancellery-1380' LIMIT 1), (SELECT id FROM events WHERE slug='yongle-emperor-usurps-1402' LIMIT 1), 'contributing', 0.5, 'Imperial absolutism created succession instability leading to Yongle usurpation', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='yongle-emperor-usurps-1402' LIMIT 1), (SELECT id FROM events WHERE slug='zheng-he-s-first-voyage' LIMIT 1), 'direct', 0.9, 'Yongle Emperor sponsored Zheng He''s treasure voyages', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='yongle-emperor-usurps-1402' LIMIT 1), (SELECT id FROM events WHERE slug='forbidden-city-completed-1420' LIMIT 1), 'direct', 0.9, 'Yongle Emperor commissioned the Forbidden City', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='forbidden-city-completed-1420' LIMIT 1), (SELECT id FROM events WHERE slug='ming-capital-beijing-1421' LIMIT 1), 'direct', 0.9, 'Forbidden City completion enabled capital move to Beijing', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='tumu-crisis-1449' LIMIT 1), (SELECT id FROM events WHERE slug='altan-khan-raids-beijing-1550' LIMIT 1), 'indirect', 0.5, 'Tumu Crisis ended offensive strategy, inviting continued Mongol raids', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='portuguese-guangzhou-1517' LIMIT 1), (SELECT id FROM events WHERE slug='ming-maritime-trade-lifted-1567' LIMIT 1), 'contributing', 0.6, 'European arrival pressured Ming to eventually open maritime trade', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='zhang-juzheng-reforms-1572' LIMIT 1), (SELECT id FROM events WHERE slug='donglin-academy-1604' LIMIT 1), 'indirect', 0.5, 'Zhang Juzheng''s posthumous disgrace fueled reform faction at Donglin Academy', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='battle-sarhu-1619' LIMIT 1), (SELECT id FROM events WHERE slug='manchus-proclaim-qing-1636' LIMIT 1), 'direct', 0.8, 'Manchu victory at Sarhu led to Qing dynasty proclamation', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ming-peasant-rebellions-1627' LIMIT 1), (SELECT id FROM events WHERE slug='yellow-river-floods-1642' LIMIT 1), 'contributing', 0.6, 'Rebellion chaos led to deliberate flooding of Yellow River', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='ming-peasant-rebellions-1627' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-ming-dynasty-1644' LIMIT 1), 'direct', 0.9, 'Peasant rebellions directly caused Ming fall', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='manchus-proclaim-qing-1636' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-ming-dynasty-1644' LIMIT 1), 'direct', 0.9, 'Qing dynasty replaced Ming after Beijing fell', 'enrichment-script', 'approved')
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- AZTEC chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status) VALUES
((SELECT id FROM events WHERE slug='mexica-arrive-valley-mexico-1300' LIMIT 1), (SELECT id FROM events WHERE slug='aztec-tenochtitlan-founding-1325' LIMIT 1), 'direct', 0.9, 'Mexica arrival led to founding of Tenochtitlan', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='tepanec-dominance-1370' LIMIT 1), (SELECT id FROM events WHERE slug='aztec-empire-founded-triple-alliance' LIMIT 1), 'direct', 0.8, 'Tepanec oppression led to revolt and Triple Alliance formation', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='aztec-empire-founded-triple-alliance' LIMIT 1), (SELECT id FROM events WHERE slug='moctezuma-i-tlatoani-1440' LIMIT 1), 'direct', 0.7, 'Triple Alliance enabled Moctezuma I''s imperial expansion', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='moctezuma-i-tlatoani-1440' LIMIT 1), (SELECT id FROM events WHERE slug='templo-mayor-dedication-1487' LIMIT 1), 'contributing', 0.6, 'Imperial expansion provided resources for Templo Mayor construction', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='first-spanish-contact-yucatan-1517' LIMIT 1), (SELECT id FROM events WHERE slug='cortes-arrives-in-mexico' LIMIT 1), 'direct', 0.8, 'First Spanish contact led to Cortés expedition', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='cortes-arrives-in-mexico' LIMIT 1), (SELECT id FROM events WHERE slug='la-noche-triste-aztec-victory' LIMIT 1), 'direct', 0.9, 'Cortés''s arrival and actions led to La Noche Triste', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='cortes-arrives-in-mexico' LIMIT 1), (SELECT id FROM events WHERE slug='smallpox-tenochtitlan-1520' LIMIT 1), 'direct', 0.9, 'Spanish arrival brought smallpox to Tenochtitlan', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='smallpox-tenochtitlan-1520' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-tenochtitlan' LIMIT 1), 'direct', 0.8, 'Smallpox devastation enabled Spanish conquest of Tenochtitlan', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='la-noche-triste-aztec-victory' LIMIT 1), (SELECT id FROM events WHERE slug='fall-of-tenochtitlan' LIMIT 1), 'direct', 0.7, 'Spanish regrouped after La Noche Triste to besiege Tenochtitlan', 'enrichment-script', 'approved')
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- INCA chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status) VALUES
((SELECT id FROM events WHERE slug='viracocha-inca-expansion-1400' LIMIT 1), (SELECT id FROM events WHERE slug='inca-empire-pachacuti-1438' LIMIT 1), 'direct', 0.7, 'Viracocha''s initial expansion set stage for Pachacuti''s conquests', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='inca-empire-pachacuti-1438' LIMIT 1), (SELECT id FROM events WHERE slug='machu-picchu-construction-1450' LIMIT 1), 'direct', 0.9, 'Pachacuti commissioned Machu Picchu', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='inca-empire-pachacuti-1438' LIMIT 1), (SELECT id FROM events WHERE slug='inca-conquest-chimu-1463' LIMIT 1), 'direct', 0.8, 'Pachacuti''s expansion led to Chimú conquest', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='inca-conquest-chimu-1463' LIMIT 1), (SELECT id FROM events WHERE slug='tupac-inca-yupanqui-1471' LIMIT 1), 'direct', 0.7, 'Chimú conquest enabled further expansion under Tupac Yupanqui', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='tupac-inca-yupanqui-1471' LIMIT 1), (SELECT id FROM events WHERE slug='huayna-capac-inca-peak-1493' LIMIT 1), 'direct', 0.8, 'Tupac Yupanqui''s conquests led to peak under Huayna Capac', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='huayna-capac-inca-peak-1493' LIMIT 1), (SELECT id FROM events WHERE slug='huayna-capac-dies-1527' LIMIT 1), 'direct', 0.7, 'Huayna Capac''s death triggered succession crisis', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='huayna-capac-dies-1527' LIMIT 1), (SELECT id FROM events WHERE slug='inca-civil-war' LIMIT 1), 'direct', 0.9, 'Death of Huayna Capac caused civil war', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='inca-civil-war' LIMIT 1), (SELECT id FROM events WHERE slug='atahualpa-wins-civil-war-1532' LIMIT 1), 'direct', 0.9, 'Civil war ended with Atahualpa''s victory', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='atahualpa-wins-civil-war-1532' LIMIT 1), (SELECT id FROM events WHERE slug='pizarro-captures-atahualpa' LIMIT 1), 'contributing', 0.7, 'Weakened post-civil-war Inca state enabled Pizarro''s capture of Atahualpa', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='pizarro-captures-atahualpa' LIMIT 1), (SELECT id FROM events WHERE slug='execution-atahualpa-1533' LIMIT 1), 'direct', 0.9, 'Capture led to execution of Atahualpa', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='execution-atahualpa-1533' LIMIT 1), (SELECT id FROM events WHERE slug='manco-inca-rebellion-1536' LIMIT 1), 'direct', 0.8, 'Inca resistance after Atahualpa''s execution led to Manco Inca rebellion', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='manco-inca-rebellion-1536' LIMIT 1), (SELECT id FROM events WHERE slug='neo-inca-vilcabamba-1537' LIMIT 1), 'direct', 0.9, 'Failed rebellion led to Neo-Inca refuge at Vilcabamba', 'enrichment-script', 'approved'),
((SELECT id FROM events WHERE slug='execution-atahualpa-1533' LIMIT 1), (SELECT id FROM events WHERE slug='potosi-silver-mines-1545' LIMIT 1), 'contributing', 0.6, 'Spanish conquest of Inca Empire led to colonial exploitation at Potosí', 'enrichment-script', 'approved')
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

-- CROSS-CIVILIZATION links
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status) VALUES
-- Aztec fall → Inca conquest (Spanish learned from Aztec conquest)
((SELECT id FROM events WHERE slug='fall-of-tenochtitlan' LIMIT 1), (SELECT id FROM events WHERE slug='pizarro-captures-atahualpa' LIMIT 1), 'contributing', 0.7, 'Spanish success against Aztecs emboldened and informed Pizarro''s Inca conquest', 'enrichment-script', 'approved'),
-- Potosí → Ming silver economy
((SELECT id FROM events WHERE slug='potosi-silver-mines-1545' LIMIT 1), (SELECT id FROM events WHERE slug='ming-maritime-trade-lifted-1567' LIMIT 1), 'contributing', 0.6, 'New World silver drove global trade that pressured Ming to open maritime commerce', 'enrichment-script', 'approved')
ON CONFLICT ON CONSTRAINT uq_causality_pair DO NOTHING;

COMMIT;
