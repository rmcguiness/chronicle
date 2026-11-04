-- Regional enrichment v4: Latin America, sub-Saharan Africa, SE Asia, Pacific
-- Focus on underrepresented periods and topics identified in gap analysis
-- ~70 new events + causality links

BEGIN;

-- ============================================================
-- LATIN AMERICA — Pre-Columbian & Colonial gaps (~25 events)
-- ============================================================

INSERT INTO events (slug, title, article_summary, year_approx, date_earliest, date_latest, is_bce, geo_point, geo_modern, geo_era_label, event_category, importance_score, wikipedia_slug, created_by, review_status, tags)
VALUES

-- Pre-Columbian gaps
('toltec-empire-tula-900', 'Rise of the Toltec Empire at Tula',
 'The Toltec civilization established its capital at Tula (Tollan) around 900 CE, becoming the dominant power in central Mexico after Teotihuacan''s fall. The Toltecs were revered by later Aztecs as legendary warriors and master craftsmen, and their influence extended throughout Mesoamerica.',
 900, '0900-01-01', '0950-12-31', false,
 ST_SetSRID(ST_MakePoint(-99.34, 20.06), 4326), 'Tula de Allende, Hidalgo, Mexico', 'Post-Classic Mesoamerica', 'political', 0.65, 'Toltec_Empire', 'seed-script:regional-enrichment-v4', 'pending', '{toltec,mesoamerica,empire}'),

('chichen-itza-peak-1000', 'Chichén Itzá at Its Peak — Maya-Toltec Synthesis',
 'Chichén Itzá reached its zenith around 1000 CE as the dominant city in the northern Yucatán, blending Maya and central Mexican (possibly Toltec) architectural and cultural traditions. The iconic El Castillo pyramid, the Great Ball Court, and the Sacred Cenote drew pilgrims from across Mesoamerica.',
 1000, '1000-01-01', '1000-12-31', false,
 ST_SetSRID(ST_MakePoint(-88.57, 20.68), 4326), 'Chichén Itzá, Yucatán, Mexico', 'Terminal Classic Maya', 'cultural', 0.75, 'Chichen_Itza', 'seed-script:regional-enrichment-v4', 'pending', '{maya,toltec,architecture,pyramid}'),

('tiwanaku-expansion-peak-800', 'Tiwanaku Empire at Its Peak — Andean Civilization',
 'The Tiwanaku state, centered near Lake Titicaca at over 3,800 meters altitude, reached its peak influence around 800 CE controlling trade networks across the Andes. Its monumental architecture, including the Akapana pyramid and Gateway of the Sun, reflected sophisticated astronomical knowledge and political power.',
 800, '0800-01-01', '0800-12-31', false,
 ST_SetSRID(ST_MakePoint(-68.67, -16.55), 4326), 'Tiwanaku, La Paz Department, Bolivia', 'Middle Horizon Andes', 'political', 0.65, 'Tiwanaku', 'seed-script:regional-enrichment-v4', 'pending', '{tiwanaku,andes,architecture,trade}'),

('moche-lord-sipan-250', 'Lord of Sipán — Moche Royal Tomb',
 'The discovery of the Lord of Sipán''s tomb in 1987 revealed the extraordinary wealth and sophistication of Moche culture around 250 CE. The burial contained gold, silver, and copper artifacts of remarkable craftsmanship, establishing the Moche as one of South America''s most advanced pre-Inca civilizations.',
 250, '0250-01-01', '0250-12-31', false,
 ST_SetSRID(ST_MakePoint(-79.6, -6.8), 4326), 'Sipán, Lambayeque, Peru', 'Early Intermediate Period, Peru', 'cultural', 0.6, 'Lord_of_Sipán', 'seed-script:regional-enrichment-v4', 'pending', '{moche,tomb,gold,archaeology}'),

('mayapan-league-1200', 'League of Mayapán — Post-Classic Maya Politics',
 'After Chichén Itzá''s decline, Mayapán became the political center of the Yucatán from roughly 1200 to 1441 CE, governing through a confederacy of Maya lords. Its fall in 1441 fragmented the Yucatán into competing city-states, the political landscape the Spanish encountered.',
 1200, '1200-01-01', '1200-12-31', false,
 ST_SetSRID(ST_MakePoint(-89.46, 20.63), 4326), 'Mayapán, Yucatán, Mexico', 'Post-Classic Maya', 'political', 0.55, 'Mayapan', 'seed-script:regional-enrichment-v4', 'pending', '{maya,confederacy,yucatan}'),

('huayna-capac-inca-peak-1493', 'Huayna Capac — Inca Empire at Maximum Extent',
 'Under Huayna Capac (r. 1493–1527), the Inca Empire reached its greatest territorial extent, stretching from modern Colombia to Chile. His conquest of Ecuador and establishment of a second capital at Quito set the stage for the succession crisis between Atahualpa and Huascar that fatally weakened the empire before Spanish arrival.',
 1493, '1493-01-01', '1527-12-31', false,
 ST_SetSRID(ST_MakePoint(-78.51, -0.18), 4326), 'Quito, Ecuador', 'Inca Empire (Tawantinsuyu)', 'political', 0.7, 'Huayna_Capac', 'seed-script:regional-enrichment-v4', 'pending', '{inca,expansion,quito,succession}'),

('neo-inca-vilcabamba-1537', 'Neo-Inca State at Vilcabamba — Last Inca Resistance',
 'After the Spanish conquest of Cusco, Manco Inca retreated to Vilcabamba in the remote Andes and established a rump Inca state that resisted Spanish rule for 36 years (1537–1572). The execution of the last Inca ruler Túpac Amaru I in 1572 ended formal Inca sovereignty but became a powerful symbol of indigenous resistance.',
 1537, '1537-01-01', '1572-12-31', false,
 ST_SetSRID(ST_MakePoint(-72.97, -13.1), 4326), 'Vilcabamba, Cusco, Peru', 'Early Colonial Peru', 'political', 0.6, 'Neo-Inca_State', 'seed-script:regional-enrichment-v4', 'pending', '{inca,resistance,vilcabamba,colonial}'),

('jesuit-reductions-paraguay-1609', 'Jesuit Reductions of Paraguay — Utopian Missions',
 'Beginning in 1609, Jesuit missionaries established over 30 mission communities (reducciones) among the Guaraní people in present-day Paraguay, Argentina, and Brazil. These self-governing communities of up to 150,000 people combined Catholic worship with indigenous culture, and defended Guaraní against slave raiders until the Jesuits'' expulsion in 1767.',
 1609, '1609-01-01', '1767-12-31', false,
 ST_SetSRID(ST_MakePoint(-55.7, -27.2), 4326), 'Trinidad, Itapúa, Paraguay', 'Colonial South America', 'religious', 0.6, 'Jesuit_reduction', 'seed-script:regional-enrichment-v4', 'pending', '{jesuit,guarani,missions,colonial}'),

('potosi-mita-labor-1573', 'Potosí Mita System — Forced Indigenous Labor',
 'Viceroy Toledo formalized the mita system in 1573, conscripting tens of thousands of indigenous laborers annually to work the Potosí silver mines under brutal conditions. Over the colonial period, an estimated 8 million indigenous workers died in the mines, while Potosí''s silver financed the Spanish Empire and transformed the global economy.',
 1573, '1573-01-01', '1573-12-31', false,
 ST_SetSRID(ST_MakePoint(-65.75, -19.59), 4326), 'Potosí, Bolivia', 'Colonial Spanish America', 'economic', 0.7, 'Mit%27a', 'seed-script:regional-enrichment-v4', 'pending', '{mining,forced-labor,silver,colonial}'),

('tupac-amaru-i-execution-1572', 'Execution of Túpac Amaru I — End of the Inca Line',
 'The Spanish captured and publicly executed the last Inca emperor Túpac Amaru I in Cusco''s main plaza in 1572, ending the Neo-Inca State at Vilcabamba. His death extinguished the Inca royal line but became a powerful rallying symbol for indigenous resistance movements for centuries to come.',
 1572, '1572-09-24', '1572-09-24', false,
 ST_SetSRID(ST_MakePoint(-71.98, -13.52), 4326), 'Cusco, Peru', 'Early Colonial Peru', 'political', 0.6, 'Túpac_Amaru', 'seed-script:regional-enrichment-v4', 'pending', '{inca,execution,colonial,resistance}'),

('lima-founded-1535', 'Founding of Lima — City of the Kings',
 'Francisco Pizarro founded Lima in 1535 as the capital of the Viceroyalty of Peru, which became the administrative center of Spanish South America. For nearly three centuries Lima was the wealthiest and most powerful city in the Americas, controlling trade, silver revenues, and colonial governance.',
 1535, '1535-01-18', '1535-01-18', false,
 ST_SetSRID(ST_MakePoint(-77.03, -12.05), 4326), 'Lima, Peru', 'Early Colonial Peru', 'political', 0.6, 'Lima#History', 'seed-script:regional-enrichment-v4', 'pending', '{colonial,city-founding,viceroyalty}'),

('bourbon-reforms-1700s', 'Bourbon Reforms — Restructuring Spanish America',
 'The Spanish Bourbon monarchs implemented sweeping administrative, economic, and military reforms across their American colonies from the 1700s onward. These reforms centralized power, increased taxation, and marginalized creole elites, generating resentment that directly fueled the independence movements of the early 19th century.',
 1760, '1760-01-01', '1790-12-31', false,
 ST_SetSRID(ST_MakePoint(-75.69, 4.61), 4326), 'Bogotá, Colombia', 'Late Colonial Spanish America', 'political', 0.6, 'Bourbon_Reforms', 'seed-script:regional-enrichment-v4', 'pending', '{reform,colonial,taxation,creole}'),

('battle-boyaca-1819', 'Battle of Boyacá — Decisive Victory for South American Independence',
 'Simón Bolívar''s victory at the Battle of Boyacá on August 7, 1819, secured Colombian independence and opened the path to liberating Venezuela, Ecuador, and Peru. The battle, fought after Bolívar''s legendary crossing of the Andes, is celebrated as Colombia''s most important national holiday.',
 1819, '1819-08-07', '1819-08-07', false,
 ST_SetSRID(ST_MakePoint(-73.38, 5.47), 4326), 'Boyacá, Colombia', 'South American Wars of Independence', 'war', 0.7, 'Battle_of_Boyacá', 'seed-script:regional-enrichment-v4', 'pending', '{independence,bolivar,colombia,battle}'),

('battle-carabobo-1821', 'Battle of Carabobo — Venezuelan Independence Secured',
 'The Battle of Carabobo on June 24, 1821, was the decisive engagement that secured Venezuelan independence from Spain. Bolívar''s forces routed the royalist army, effectively ending Spanish control over Venezuela and consolidating Gran Colombia as a new republic.',
 1821, '1821-06-24', '1821-06-24', false,
 ST_SetSRID(ST_MakePoint(-68.18, 10.17), 4326), 'Carabobo, Venezuela', 'South American Wars of Independence', 'war', 0.6, 'Battle_of_Carabobo', 'seed-script:regional-enrichment-v4', 'pending', '{independence,bolivar,venezuela,battle}'),

('war-triple-alliance-1864', 'War of the Triple Alliance — South America''s Deadliest Conflict',
 'The War of the Triple Alliance (1864–1870) pitted Paraguay against the combined forces of Brazil, Argentina, and Uruguay. Paraguay lost between 60–90% of its male population and half its total population, making it proportionally the deadliest conflict in modern history and devastating the country for generations.',
 1864, '1864-12-12', '1870-03-01', false,
 ST_SetSRID(ST_MakePoint(-57.63, -25.28), 4326), 'Asunción, Paraguay', 'Nineteenth-Century South America', 'war', 0.65, 'Paraguayan_War', 'seed-script:regional-enrichment-v4', 'pending', '{war,paraguay,brazil,argentina,devastation}'),

('encomienda-system-1503', 'Encomienda System Established — Colonial Exploitation',
 'The Spanish Crown formalized the encomienda system in the Americas in 1503, granting colonists authority over indigenous laborers in exchange for Christianization. This system enabled systematic exploitation and abuse of indigenous populations, contributing to catastrophic population decline across the Americas.',
 1503, '1503-01-01', '1503-12-31', false,
 ST_SetSRID(ST_MakePoint(-69.94, 18.47), 4326), 'Santo Domingo, Dominican Republic', 'Early Colonial Caribbean', 'political', 0.65, 'Encomienda', 'seed-script:regional-enrichment-v4', 'pending', '{colonial,labor,exploitation,indigenous}'),

('casta-system-colonial-1600', 'Colonial Casta System — Racial Hierarchy in Spanish America',
 'Spanish colonial authorities developed an elaborate racial classification system (sistema de castas) categorizing people by ancestry and skin color. This social hierarchy placed peninsulares (Spanish-born) at the top and indigenous and African peoples at the bottom, creating entrenched inequalities whose legacies persist in Latin America today.',
 1600, '1600-01-01', '1600-12-31', false,
 ST_SetSRID(ST_MakePoint(-99.13, 19.43), 4326), 'Mexico City, Mexico', 'Colonial New Spain', 'social', 0.55, 'Casta', 'seed-script:regional-enrichment-v4', 'pending', '{race,colonial,hierarchy,social}'),

('taki-onqoy-1560', 'Taki Onqoy Movement — Andean Religious Resistance',
 'The Taki Onqoy (dancing sickness) movement of the 1560s was a millenarian indigenous resistance movement in colonial Peru. Followers believed that pre-Columbian deities (huacas) would rise to defeat the Christian God and expel the Spanish, representing one of the earliest organized spiritual-political resistance movements against colonialism.',
 1560, '1560-01-01', '1570-12-31', false,
 ST_SetSRID(ST_MakePoint(-73.88, -13.63), 4326), 'Ayacucho, Peru', 'Early Colonial Peru', 'religious', 0.55, 'Taki_Onqoy', 'seed-script:regional-enrichment-v4', 'pending', '{resistance,indigenous,religion,millenarian}'),

-- ============================================================
-- SUB-SAHARAN AFRICA — gaps (~20 events)
-- ============================================================

('nri-kingdom-igbo-900', 'Kingdom of Nri — Igbo Sacred Kingship',
 'The Kingdom of Nri, founded around 900 CE in present-day southeastern Nigeria, was unique among West African states for its ritual rather than military authority. The Eze Nri (priest-king) wielded power through religious sanctions and ritual cleansing rather than warfare, creating a distinctive model of non-coercive governance.',
 900, '0900-01-01', '0900-12-31', false,
 ST_SetSRID(ST_MakePoint(6.83, 6.13), 4326), 'Nri, Anambra State, Nigeria', 'Medieval West Africa', 'political', 0.5, 'Kingdom_of_Nri', 'seed-script:regional-enrichment-v4', 'pending', '{igbo,kingship,ritual,governance}'),

('ghana-empire-peak-1000', 'Ghana Empire at Its Peak — Wagadou Gold Trade',
 'The Ghana Empire (Wagadou) reached its peak around 1000 CE, controlling the trans-Saharan gold and salt trade from its capital at Kumbi Saleh. Arab geographers described its ruler as the richest king on earth, commanding an army of 200,000 and presiding over a sophisticated court that attracted traders from across the Islamic world.',
 1000, '1000-01-01', '1000-12-31', false,
 ST_SetSRID(ST_MakePoint(-8.0, 15.77), 4326), 'Kumbi Saleh, Mauritania/Mali', 'Medieval West Africa', 'economic', 0.7, 'Ghana_Empire', 'seed-script:regional-enrichment-v4', 'pending', '{ghana-empire,gold,trans-saharan,trade}'),

('timbuktu-intellectual-center-1400', 'Timbuktu as Center of Islamic Learning',
 'By the 14th–15th centuries, Timbuktu had become one of the world''s great centers of Islamic scholarship, with the University of Sankore attracting scholars from across Africa and the Islamic world. The city housed hundreds of thousands of manuscripts on astronomy, medicine, law, and theology, representing an extraordinary intellectual tradition.',
 1400, '1400-01-01', '1400-12-31', false,
 ST_SetSRID(ST_MakePoint(-3.01, 16.77), 4326), 'Timbuktu, Mali', 'Mali Empire', 'cultural', 0.7, 'Timbuktu#Scholarship', 'seed-script:regional-enrichment-v4', 'pending', '{scholarship,islam,manuscripts,university}'),

('askia-muhammad-reforms-1493', 'Askia Muhammad''s Reforms — Songhai Golden Age',
 'After seizing the Songhai throne in 1493, Askia Muhammad (r. 1493–1528) implemented sweeping reforms including standardized weights and measures, a professional civil service, and expansion of Islamic education. His pilgrimage to Mecca in 1496 further integrated Songhai into the broader Islamic world and ushered in the empire''s golden age.',
 1496, '1496-01-01', '1496-12-31', false,
 ST_SetSRID(ST_MakePoint(-0.35, 14.97), 4326), 'Gao, Mali', 'Songhai Empire', 'political', 0.6, 'Askia_Mohammad_I', 'seed-script:regional-enrichment-v4', 'pending', '{songhai,reform,islam,pilgrimage}'),

('sokoto-caliphate-1804', 'Sokoto Caliphate Founded — Largest State in 19th-Century Africa',
 'Usman dan Fodio''s jihad in 1804 established the Sokoto Caliphate, which at its peak was the largest state in Africa south of the Sahara, encompassing most of modern northern Nigeria and parts of Niger and Cameroon. The caliphate''s administrative system, based on Islamic law, governed approximately 10 million people until British conquest in 1903.',
 1804, '1804-02-21', '1804-12-31', false,
 ST_SetSRID(ST_MakePoint(5.24, 13.06), 4326), 'Sokoto, Nigeria', 'Nineteenth-Century West Africa', 'political', 0.65, 'Sokoto_Caliphate', 'seed-script:regional-enrichment-v4', 'pending', '{caliphate,jihad,islam,nigeria}'),

('samori-ture-resistance-1882', 'Samori Ture''s Empire — West African Resistance to Colonialism',
 'Samori Ture built the Wassoulou Empire in West Africa (1878–1898) and mounted one of the most effective military resistances to French colonial expansion. His innovative tactics included manufacturing firearms locally and using scorched-earth retreats, sustaining resistance for nearly two decades before his capture in 1898.',
 1882, '1882-01-01', '1898-12-31', false,
 ST_SetSRID(ST_MakePoint(-9.18, 10.39), 4326), 'Kankan, Guinea', 'Scramble for Africa', 'war', 0.6, 'Samori_Ture', 'seed-script:regional-enrichment-v4', 'pending', '{resistance,colonialism,warfare,west-africa}'),

('swahili-coast-golden-age-1300', 'Swahili Coast Golden Age — Indian Ocean Trade Network',
 'By the 13th–14th centuries, dozens of Swahili city-states from Mogadishu to Sofala formed a vibrant maritime trading civilization connecting Africa to India, Arabia, and China. Cities like Kilwa, Mombasa, and Zanzibar grew wealthy from gold, ivory, and enslaved people, developing a distinctive Swahili culture blending Bantu and Islamic traditions.',
 1300, '1300-01-01', '1300-12-31', false,
 ST_SetSRID(ST_MakePoint(39.66, -4.04), 4326), 'Mombasa, Kenya', 'Medieval East Africa', 'economic', 0.65, 'Swahili_coast', 'seed-script:regional-enrichment-v4', 'pending', '{trade,indian-ocean,swahili,maritime}'),

('ethiopian-rock-churches-lalibela-1200', 'Rock-Hewn Churches of Lalibela — Ethiopian Marvel',
 'King Lalibela ordered the construction of 11 monolithic churches carved directly from solid rock in the Ethiopian highlands around 1200 CE. These extraordinary structures, including the cruciform Church of St. George, represent one of the most remarkable feats of architecture in the medieval world and remain active places of worship today.',
 1200, '1200-01-01', '1200-12-31', false,
 ST_SetSRID(ST_MakePoint(39.04, 12.03), 4326), 'Lalibela, Amhara, Ethiopia', 'Zagwe Dynasty Ethiopia', 'cultural', 0.7, 'Rock-Hewn_Churches,_Lalibela', 'seed-script:regional-enrichment-v4', 'pending', '{architecture,christian,ethiopia,church}'),

('mutapa-gold-kingdom-1450', 'Mutapa Empire — Successor to Great Zimbabwe',
 'The Mutapa (Monomotapa) Empire emerged around 1450 as the successor state to Great Zimbabwe, controlling the gold-producing regions of the Zimbabwe Plateau and trading with the Swahili coast. Portuguese attempts to control its gold trade from the 16th century led to prolonged conflict and gradual fragmentation of the empire.',
 1450, '1450-01-01', '1450-12-31', false,
 ST_SetSRID(ST_MakePoint(31.0, -16.5), 4326), 'Northern Zimbabwe / Mozambique', 'Late Medieval Southern Africa', 'political', 0.55, 'Kingdom_of_Mutapa', 'seed-script:regional-enrichment-v4', 'pending', '{gold,trade,zimbabwe,portuguese}'),

('dahomey-mino-warriors-formalized-1720', 'Dahomey''s Mino Warriors — The ''Amazons'' of West Africa',
 'The Kingdom of Dahomey formalized its elite female warrior regiment (Mino or ''Amazons'') around 1720, creating one of the few documented all-female military units in history. These warriors, numbering up to 6,000, were central to Dahomey''s military campaigns and fought fiercely against French colonial forces during the Second Franco-Dahomean War (1892–1894).',
 1720, '1720-01-01', '1720-12-31', false,
 ST_SetSRID(ST_MakePoint(2.09, 7.18), 4326), 'Abomey, Benin', 'Kingdom of Dahomey', 'military', 0.6, 'Dahomey_Amazons', 'seed-script:regional-enrichment-v4', 'pending', '{warriors,women,dahomey,military}'),

('mapungubwe-gold-rhino-1075', 'Mapungubwe Kingdom — First Complex State in Southern Africa',
 'Mapungubwe (c. 1075–1220) in the Limpopo Valley was the first complex state society in southern Africa, with a population of 5,000 and sophisticated social hierarchy. The famous gold rhinoceros found in royal burials demonstrates connections to long-distance Indian Ocean trade networks and disproves colonial myths about African societies.',
 1075, '1075-01-01', '1075-12-31', false,
 ST_SetSRID(ST_MakePoint(29.37, -22.2), 4326), 'Mapungubwe, Limpopo, South Africa', 'Iron Age Southern Africa', 'political', 0.6, 'Mapungubwe', 'seed-script:regional-enrichment-v4', 'pending', '{gold,trade,southern-africa,state-formation}'),

('great-enclosure-zimbabwe-1300', 'Great Enclosure of Zimbabwe — Monumental Stone Architecture',
 'The Great Enclosure at Great Zimbabwe, built around 1300 CE without mortar, is the largest ancient stone structure in sub-Saharan Africa south of the Sahara. Its 250-meter outer wall, standing up to 11 meters high, enclosed the royal court and demonstrated architectural sophistication that European colonists long refused to attribute to African builders.',
 1300, '1300-01-01', '1300-12-31', false,
 ST_SetSRID(ST_MakePoint(30.93, -20.27), 4326), 'Masvingo, Zimbabwe', 'Kingdom of Zimbabwe', 'cultural', 0.6, 'Great_Zimbabwe', 'seed-script:regional-enrichment-v4', 'pending', '{architecture,stone,zimbabwe,royal}'),

('zanzibar-clove-empire-1830', 'Zanzibar Clove Plantations — Omani Sultanate',
 'Sultan Seyyid Said moved his capital from Oman to Zanzibar in 1840, transforming the island into the world''s leading clove producer through slave-labor plantations. Zanzibar became the commercial hub of East Africa, controlling up to 75% of the world''s clove supply while also serving as the largest slave-trading center on the East African coast.',
 1840, '1840-01-01', '1840-12-31', false,
 ST_SetSRID(ST_MakePoint(39.19, -6.16), 4326), 'Zanzibar City, Tanzania', 'Omani East Africa', 'economic', 0.55, 'Sultanate_of_Zanzibar', 'seed-script:regional-enrichment-v4', 'pending', '{clove,slavery,trade,zanzibar}'),

('lozi-kingdom-barotseland-1600', 'Lozi Kingdom of Barotseland — Zambezi Floodplain State',
 'The Lozi Kingdom, established around 1600 in the Zambezi floodplain of present-day western Zambia, developed a unique annual migration (Kuomboka) between dry and flood-season capitals. The kingdom''s sophisticated floodplain management and cattle economy sustained a complex state that maintained semi-autonomy even under British colonial rule.',
 1600, '1600-01-01', '1600-12-31', false,
 ST_SetSRID(ST_MakePoint(23.35, -15.37), 4326), 'Barotseland, Western Province, Zambia', 'Early Modern Southern Africa', 'political', 0.5, 'Barotseland', 'seed-script:regional-enrichment-v4', 'pending', '{lozi,floodplain,kingdom,zambia}'),

('ife-bronze-casting-1200', 'Ife Bronze Heads — Pinnacle of African Art',
 'The Yoruba city of Ife produced extraordinary naturalistic bronze and terracotta portrait heads from the 12th–15th centuries, representing one of the highest achievements in world sculpture. These artworks, cast using the lost-wax technique, challenged European assumptions about African artistic capability and influenced the later Benin Bronzes tradition.',
 1200, '1200-01-01', '1200-12-31', false,
 ST_SetSRID(ST_MakePoint(4.56, 7.48), 4326), 'Ile-Ife, Osun State, Nigeria', 'Medieval Yorubaland', 'cultural', 0.65, 'Ife_head', 'seed-script:regional-enrichment-v4', 'pending', '{art,bronze,yoruba,sculpture}'),

('buganda-expansion-1600', 'Kingdom of Buganda Expands — Great Lakes Power',
 'The Kingdom of Buganda, in present-day central Uganda, expanded dramatically from the 16th century onward through military conquest and political centralization around the Kabaka (king). By the 19th century, Buganda was the most powerful state in the Great Lakes region, with a sophisticated bureaucracy, navy on Lake Victoria, and extensive trade networks.',
 1600, '1600-01-01', '1600-12-31', false,
 ST_SetSRID(ST_MakePoint(32.58, 0.31), 4326), 'Kampala, Uganda', 'Great Lakes Kingdoms', 'political', 0.55, 'Buganda', 'seed-script:regional-enrichment-v4', 'pending', '{buganda,great-lakes,kingdom,expansion}'),

('madagascar-settlement-austronesian-500', 'Austronesian Settlement of Madagascar',
 'Around 500 CE, Austronesian seafarers from Borneo crossed the Indian Ocean — a journey of over 6,000 kilometers — to settle Madagascar. This extraordinary migration, one of the most remarkable maritime feats in human history, is evidenced by the Malagasy language''s close relationship to Borneo languages and the island''s distinctive blend of Southeast Asian and African cultural traditions.',
 500, '0500-01-01', '0500-12-31', false,
 ST_SetSRID(ST_MakePoint(47.52, -18.91), 4326), 'Central Madagascar', 'Early Settlement of Madagascar', 'cultural', 0.7, 'Madagascar#History', 'seed-script:regional-enrichment-v4', 'pending', '{austronesian,migration,maritime,settlement}'),

-- ============================================================
-- SOUTH / SOUTHEAST ASIA — gaps (~15 events)
-- ============================================================

('khmer-decline-post-jayavarman-1300', 'Khmer Empire Decline — Post-Jayavarman VII Crisis',
 'After the death of Jayavarman VII around 1218, the Khmer Empire entered a prolonged decline marked by the conversion from Mahayana Buddhism to Theravada, rebellion, and external pressure from Ayutthaya and Champa. The elaborate hydraulic system that sustained Angkor''s million-strong population deteriorated, contributing to the capital''s eventual abandonment.',
 1300, '1300-01-01', '1300-12-31', false,
 ST_SetSRID(ST_MakePoint(103.87, 13.41), 4326), 'Angkor, Siem Reap, Cambodia', 'Late Khmer Empire', 'political', 0.6, 'Khmer_Empire#Decline', 'seed-script:regional-enrichment-v4', 'pending', '{khmer,decline,angkor,theravada}'),

('lan-xang-kingdom-1353', 'Kingdom of Lan Xang Founded — Land of a Million Elephants',
 'Fa Ngum founded the Kingdom of Lan Xang in 1353, unifying the Lao meuang (principalities) into a powerful state that at its peak controlled much of modern Laos and northeastern Thailand. The kingdom introduced Theravada Buddhism and the Pali script, establishing the cultural foundations of modern Laos.',
 1353, '1353-01-01', '1353-12-31', false,
 ST_SetSRID(ST_MakePoint(102.63, 17.97), 4326), 'Luang Prabang, Laos', 'Medieval Southeast Asia', 'political', 0.55, 'Lan_Xang', 'seed-script:regional-enrichment-v4', 'pending', '{laos,kingdom,buddhism,unification}'),

('toungoo-dynasty-burma-1531', 'Toungoo Empire — Largest Empire in Southeast Asian History',
 'The Toungoo Dynasty under King Tabinshwehti and his successor Bayinnaung created the largest empire in Southeast Asian history by the 1550s, conquering Burma, Chiang Mai, Lan Na, Lan Xang, and Manipur. Bayinnaung''s military campaigns united much of mainland Southeast Asia but overextended the empire, leading to its collapse by 1599.',
 1531, '1531-01-01', '1599-12-31', false,
 ST_SetSRID(ST_MakePoint(96.2, 17.33), 4326), 'Pegu (Bago), Myanmar', 'Early Modern Southeast Asia', 'war', 0.6, 'Toungoo_dynasty', 'seed-script:regional-enrichment-v4', 'pending', '{burma,empire,conquest,southeast-asia}'),

('fatehpur-sikri-mughal-1571', 'Fatehpur Sikri — Akbar''s Dream Capital',
 'Emperor Akbar built the stunning red sandstone city of Fatehpur Sikri between 1571 and 1585 as his new capital, blending Hindu, Islamic, and Christian architectural elements reflecting his eclectic religious philosophy. The city was abandoned after only 14 years, possibly due to water shortage, but remains one of the finest examples of Mughal urban planning.',
 1571, '1571-01-01', '1585-12-31', false,
 ST_SetSRID(ST_MakePoint(77.66, 27.09), 4326), 'Fatehpur Sikri, Uttar Pradesh, India', 'Mughal Empire', 'cultural', 0.6, 'Fatehpur_Sikri', 'seed-script:regional-enrichment-v4', 'pending', '{mughal,architecture,akbar,capital}'),

('shah-jahan-mughal-arts-1632', 'Shah Jahan''s Architectural Golden Age — Mughal High Culture',
 'Beyond the Taj Mahal, Shah Jahan''s reign (1628–1658) marked the pinnacle of Mughal artistic achievement with the construction of the Red Fort, Jama Masjid, and the Peacock Throne. His patronage of miniature painting, calligraphy, and garden design created a refined court culture that influenced art across the Islamic world.',
 1632, '1632-01-01', '1658-12-31', false,
 ST_SetSRID(ST_MakePoint(77.24, 28.66), 4326), 'Delhi, India', 'Mughal Empire', 'cultural', 0.6, 'Shah_Jahan#Architecture', 'seed-script:regional-enrichment-v4', 'pending', '{mughal,architecture,art,shah-jahan}'),

('sikh-empire-ranjit-singh-1799', 'Sikh Empire Under Ranjit Singh — Lion of the Punjab',
 'Maharaja Ranjit Singh unified the Sikh misls (confederacies) into a powerful empire in 1799, ruling the Punjab and Kashmir with a modernized army trained by European officers. His empire was notable for religious tolerance and efficient governance, making it the last major independent power in India before British annexation after his death.',
 1799, '1799-07-07', '1839-06-27', false,
 ST_SetSRID(ST_MakePoint(74.87, 31.63), 4326), 'Lahore, Pakistan', 'Sikh Empire', 'political', 0.65, 'Sikh_Empire', 'seed-script:regional-enrichment-v4', 'pending', '{sikh,empire,punjab,ranjit-singh}'),

('ayutthaya-golden-age-1600', 'Ayutthaya Golden Age — Cosmopolitan Trading Kingdom',
 'By the early 17th century, Ayutthaya was one of the world''s largest and most cosmopolitan cities, with a population exceeding one million and thriving communities of Japanese, Chinese, Portuguese, Persian, and Indian merchants. The kingdom''s strategic position on Southeast Asian trade routes made it a center of diplomatic and commercial exchange.',
 1600, '1600-01-01', '1600-12-31', false,
 ST_SetSRID(ST_MakePoint(100.57, 14.35), 4326), 'Ayutthaya, Thailand', 'Ayutthaya Kingdom', 'economic', 0.6, 'Ayutthaya_Kingdom#Golden_Age', 'seed-script:regional-enrichment-v4', 'pending', '{ayutthaya,trade,cosmopolitan,siam}'),

('tran-dynasty-mongol-defeat-1288', 'Trần Dynasty Defeats Mongol Invasions of Đại Việt',
 'The Vietnamese Trần Dynasty repelled three Mongol invasions (1258, 1285, 1288), with General Trần Hưng Đạo achieving a decisive naval victory at the Battle of Bạch Đằng in 1288 using iron-tipped wooden stakes. These victories preserved Vietnamese independence and became foundational legends of national resistance.',
 1288, '1288-04-09', '1288-04-09', false,
 ST_SetSRID(ST_MakePoint(106.7, 20.87), 4326), 'Bạch Đằng River, Quảng Ninh, Vietnam', 'Trần Dynasty Vietnam', 'war', 0.65, 'Battle_of_Bạch_Đằng_(1288)', 'seed-script:regional-enrichment-v4', 'pending', '{vietnam,mongol,resistance,naval}'),

('konbaung-dynasty-1752', 'Konbaung Dynasty — Last Burmese Kingdom',
 'The Konbaung Dynasty (1752–1885) was the last ruling dynasty of Burma, reunifying the country after the fall of the Toungoo and conquering Ayutthaya in 1767. Under kings like Alaungpaya and Hsinbyushin, the dynasty expanded Burmese power to its greatest extent before succumbing to three Anglo-Burmese Wars and British annexation.',
 1752, '1752-02-29', '1885-11-29', false,
 ST_SetSRID(ST_MakePoint(96.08, 21.96), 4326), 'Shwebo, Sagaing, Myanmar', 'Konbaung Dynasty Burma', 'political', 0.55, 'Konbaung_dynasty', 'seed-script:regional-enrichment-v4', 'pending', '{burma,dynasty,conquest,ayutthaya}'),

('ternate-tidore-spice-sultanates-1500', 'Sultanates of Ternate and Tidore — Spice Islands Powers',
 'The rival sultanates of Ternate and Tidore in the Maluku Islands controlled the world''s only source of cloves and nutmeg, making them pivotal players in global trade. Their competition drew Portuguese, Spanish, and Dutch colonial powers into the region, triggering centuries of conflict over the lucrative spice trade.',
 1500, '1500-01-01', '1500-12-31', false,
 ST_SetSRID(ST_MakePoint(127.38, 0.79), 4326), 'Ternate, Maluku, Indonesia', 'Early Colonial Spice Islands', 'economic', 0.6, 'Sultanate_of_Ternate', 'seed-script:regional-enrichment-v4', 'pending', '{spice-trade,sultanate,colonial,maluku}'),

('mataram-sultanate-java-1587', 'Sultanate of Mataram — Last Great Javanese Empire',
 'The Sultanate of Mataram unified most of Java under Sultan Agung (r. 1613–1645), creating the last major independent Javanese state. Agung''s campaigns against the Dutch VOC at Batavia in 1628–1629 failed, beginning a gradual Dutch encroachment that would eventually extinguish Javanese sovereignty.',
 1587, '1587-01-01', '1587-12-31', false,
 ST_SetSRID(ST_MakePoint(110.36, -7.80), 4326), 'Kota Gede, Yogyakarta, Indonesia', 'Early Modern Java', 'political', 0.55, 'Sultanate_of_Mataram', 'seed-script:regional-enrichment-v4', 'pending', '{java,sultanate,dutch,independence}'),

('champa-kingdom-decline-1471', 'Fall of Champa — Vietnamese Southern Expansion',
 'The Vietnamese conquest of the Cham capital Vijaya in 1471 marked the effective end of the Kingdom of Champa, a Hindu-Buddhist maritime civilization that had flourished for over a millennium. The fall of Champa enabled Vietnam''s southward expansion (Nam tiến) into the Mekong Delta, reshaping the political geography of mainland Southeast Asia.',
 1471, '1471-03-22', '1471-03-22', false,
 ST_SetSRID(ST_MakePoint(109.0, 13.77), 4326), 'Bình Định, Vietnam', 'Late Champa Kingdom', 'war', 0.55, 'Fall_of_Vijaya', 'seed-script:regional-enrichment-v4', 'pending', '{champa,vietnam,conquest,hindu}'),

-- ============================================================
-- PACIFIC / OCEANIA — gaps (~8 events)
-- ============================================================

('tongan-empire-expansion-1200', 'Tu''i Tonga Empire Expansion — Polynesian Maritime Hegemony',
 'The Tu''i Tonga Empire expanded dramatically from the 12th century, establishing tributary relationships across Samoa, Fiji, Rotuma, Niue, and parts of eastern Melanesia. At its peak, the empire controlled trade and tribute across a vast ocean territory, making it the largest maritime polity in pre-contact Oceania.',
 1200, '1200-01-01', '1200-12-31', false,
 ST_SetSRID(ST_MakePoint(-175.2, -21.21), 4326), 'Tongatapu, Tonga', 'Tu''i Tonga Empire', 'political', 0.6, 'Tuʻi_Tonga_Empire', 'seed-script:regional-enrichment-v4', 'pending', '{tonga,maritime,empire,polynesia}'),

('hawaiian-unification-kamehameha-1795', 'Kamehameha Unifies Hawaii — Kingdom of the Pacific',
 'King Kamehameha I unified the Hawaiian Islands through a series of military campaigns culminating in the Battle of Nu''uanu in 1795. Using Western firearms and cannon acquired from European traders, Kamehameha created a centralized kingdom that became a significant Pacific power and eventually an independent diplomatic entity recognized by major world powers.',
 1795, '1795-05-01', '1810-12-31', false,
 ST_SetSRID(ST_MakePoint(-157.86, 21.31), 4326), 'Honolulu, Hawaii, USA', 'Hawaiian Kingdom', 'political', 0.65, 'Kamehameha_I', 'seed-script:regional-enrichment-v4', 'pending', '{hawaii,unification,kamehameha,kingdom}'),

('maori-pa-fortifications-1500', 'Māori Pā Fortifications — Sophisticated Military Architecture',
 'By the 15th–16th centuries, Māori had developed elaborate pā (fortified settlements) with multiple terraces, palisades, fighting stages, and underground food stores. These sophisticated defensive structures, among the most complex in the pre-gunpowder Pacific, reflected intensifying competition for resources and the development of Māori tribal (iwi) political organization.',
 1500, '1500-01-01', '1500-12-31', false,
 ST_SetSRID(ST_MakePoint(176.25, -37.78), 4326), 'Bay of Plenty, New Zealand', 'Classical Māori Period', 'military', 0.55, 'Pā', 'seed-script:regional-enrichment-v4', 'pending', '{maori,fortification,military,architecture}'),

('nan-madol-pohnpei-1100', 'Nan Madol — Venice of the Pacific',
 'The megalithic city of Nan Madol on Pohnpei was constructed beginning around 1100 CE as the ceremonial and political center of the Saudeleur Dynasty. Built on 92 artificial islands linked by canals, using massive basalt columns weighing up to 50 tons, it is the only ancient city built on a coral reef and represents Micronesia''s most remarkable architectural achievement.',
 1100, '1100-01-01', '1100-12-31', false,
 ST_SetSRID(ST_MakePoint(158.34, 6.84), 4326), 'Pohnpei, Federated States of Micronesia', 'Saudeleur Dynasty Pohnpei', 'cultural', 0.65, 'Nan_Madol', 'seed-script:regional-enrichment-v4', 'pending', '{megalithic,micronesia,architecture,coral}'),

('cook-encounters-hawaii-1778', 'Captain Cook''s Arrival in Hawaii — Fatal First Contact',
 'Captain James Cook became the first European to reach Hawaii in January 1778, initially received as a returning deity by Hawaiians. His return in February 1779 ended in his death at Kealakekua Bay after a confrontation over a stolen boat, one of the most significant first-contact encounters in Pacific history.',
 1778, '1778-01-18', '1779-02-14', false,
 ST_SetSRID(ST_MakePoint(-155.93, 19.48), 4326), 'Kealakekua Bay, Hawaii, USA', 'Pre-Unification Hawaii', 'discovery', 0.6, 'Death_of_Captain_Cook', 'seed-script:regional-enrichment-v4', 'pending', '{cook,hawaii,first-contact,exploration}'),

('treaty-waitangi-1840', 'Treaty of Waitangi — New Zealand''s Founding Document',
 'Signed in 1840 between the British Crown and over 500 Māori chiefs, the Treaty of Waitangi is considered New Zealand''s founding document. However, significant differences between the English and Māori language versions — particularly regarding sovereignty and land rights — created disputes that remain central to New Zealand politics today.',
 1840, '1840-02-06', '1840-09-03', false,
 ST_SetSRID(ST_MakePoint(174.07, -35.26), 4326), 'Waitangi, Bay of Islands, New Zealand', 'Colonial New Zealand', 'political', 0.65, 'Treaty_of_Waitangi', 'seed-script:regional-enrichment-v4', 'pending', '{treaty,maori,british,sovereignty}'),

('hawaiian-kingdom-overthrow-1893', 'Overthrow of the Hawaiian Kingdom',
 'In January 1893, American businessmen with the support of U.S. Marines overthrew Queen Liliʻuokalani, ending the independent Hawaiian Kingdom. The Republic of Hawaii was annexed by the United States in 1898, an act that the U.S. Congress formally apologized for in 1993 and that remains deeply controversial among Native Hawaiians.',
 1893, '1893-01-17', '1893-01-17', false,
 ST_SetSRID(ST_MakePoint(-157.86, 21.31), 4326), 'Honolulu, Hawaii, USA', 'Hawaiian Kingdom', 'political', 0.6, 'Overthrow_of_the_Hawaiian_Kingdom', 'seed-script:regional-enrichment-v4', 'pending', '{hawaii,overthrow,annexation,sovereignty}'),

('samoan-crisis-1899', 'Samoan Crisis and Partition — Imperial Rivalry in the Pacific',
 'Rivalry between the United States, Germany, and Britain over Samoa culminated in a naval standoff in Apia harbor in 1889 and eventual partition of the islands in 1899. Germany took Western Samoa and the US took Eastern Samoa (American Samoa), dividing a unified Polynesian culture along colonial lines that persist today.',
 1899, '1899-11-14', '1899-12-02', false,
 ST_SetSRID(ST_MakePoint(-171.76, -13.84), 4326), 'Apia, Samoa', 'Colonial Pacific', 'political', 0.5, 'Samoan_crisis', 'seed-script:regional-enrichment-v4', 'pending', '{samoa,colonialism,partition,imperial}')

;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Latin America chains
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Toltec cultural legacy directly influenced Aztec founding mythology and political organization',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'toltec-empire-tula-900' AND e.slug = 'aztec-tenochtitlan-founding-1325'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Huayna Capac''s division of the empire between Quito and Cusco caused the civil war',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'huayna-capac-inca-peak-1493' AND e.slug = 'inca-civil-war'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'The Neo-Inca state ended with Túpac Amaru I''s execution',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'neo-inca-vilcabamba-1537' AND e.slug = 'tupac-amaru-i-execution-1572'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Potosí silver mining drove the implementation of the mita forced labor system',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'potosi-silver-mining-begins' AND e.slug = 'potosi-mita-labor-1573'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Encomienda system established the colonial labor exploitation framework',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'encomienda-system-1503' AND e.slug = 'potosi-mita-labor-1573'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7,
  'Bourbon Reforms generated creole resentment that fueled independence movements',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'bourbon-reforms-1700s' AND e.slug = 'battle-boyaca-1819'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Boyacá secured Colombian independence, enabling Bolívar to liberate Venezuela at Carabobo',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'battle-boyaca-1819' AND e.slug = 'battle-carabobo-1821'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6,
  'Jesuit reductions created literate indigenous communities aware of colonial injustice',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'jesuit-reductions-paraguay-1609' AND e.slug = 'tupac-amaru-ii-rebellion'
ON CONFLICT DO NOTHING;

-- Africa chains
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Ghana Empire''s gold trade networks laid the foundation for Mali''s rise',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'ghana-empire-peak-1000' AND e.slug = 'mali-empire-founding-1235'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Mapungubwe''s decline led to the rise of Great Zimbabwe as the dominant southern African state',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'mapungubwe-gold-rhino-1075' AND e.slug = 'great-zimbabwe-founded'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Great Zimbabwe''s decline led to the emergence of the Mutapa Empire as successor state',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'great-zimbabwe-peak-1300' AND e.slug = 'mutapa-gold-kingdom-1450'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7,
  'Ife bronze-casting tradition directly influenced Benin Kingdom artistry',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'ife-bronze-casting-1200' AND e.slug IN (SELECT slug FROM events WHERE slug LIKE '%benin-bronzes%' OR slug LIKE '%kingdom-benin%' LIMIT 1)
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Askia Muhammad''s reforms built on Songhai''s earlier capture of Timbuktu',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'songhai-empire-timbuktu-1468' AND e.slug = 'askia-muhammad-reforms-1493'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7,
  'Samori Ture''s resistance was a direct response to French colonial expansion during the Scramble for Africa',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug IN (SELECT slug FROM events WHERE slug LIKE '%berlin-conference%' LIMIT 1) AND e.slug = 'samori-ture-resistance-1882'
ON CONFLICT DO NOTHING;

-- SE Asia chains
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Khmer decline enabled Ayutthaya''s rise and eventual conquest of Angkor',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'khmer-decline-post-jayavarman-1300' AND e.slug = 'fall-of-angkor-to-ayutthaya'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Toungoo Empire''s overextension led to the Konbaung Dynasty''s reunification',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'toungoo-dynasty-burma-1531' AND e.slug = 'konbaung-dynasty-1752'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'Konbaung Dynasty destroyed Ayutthaya in 1767',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'konbaung-dynasty-1752' AND e.slug = 'ayutthaya-falls-burma-1767'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Vietnamese conquest of Champa enabled southward expansion into the Mekong Delta',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'champa-kingdom-decline-1471' AND e.slug IN (SELECT slug FROM events WHERE slug LIKE '%le-loi%' OR slug LIKE '%dai-viet%' OR slug LIKE '%vietnamese-independence%' LIMIT 1)
ON CONFLICT DO NOTHING;

-- Pacific chains
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Cook''s arrival introduced Hawaii to European trade and weapons that enabled Kamehameha''s unification',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'cook-encounters-hawaii-1778' AND e.slug = 'hawaiian-unification-kamehameha-1795'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9,
  'The Hawaiian Kingdom established by Kamehameha was later overthrown by American interests',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'hawaiian-unification-kamehameha-1795' AND e.slug = 'hawaiian-kingdom-overthrow-1893'
ON CONFLICT DO NOTHING;

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8,
  'Treaty of Waitangi established British sovereignty, leading to land conflicts',
  'seed-script:regional-enrichment-v4', 'approved'
FROM events c, events e
WHERE c.slug = 'treaty-waitangi-1840' AND e.slug = 'new-zealand-maori-wars'
ON CONFLICT DO NOTHING;

COMMIT;
