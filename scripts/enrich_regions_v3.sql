-- Regional enrichment: Oceania, Africa, MiddleEast
-- Focus on era gaps identified in analysis

BEGIN;

-- ============================================================
-- OCEANIA (~20 events) — gaps: Classical, Ancient, Early Modern
-- ============================================================

INSERT INTO events (slug, title, article_summary, year_approx, date_earliest, date_latest, is_bce, geo_point, geo_modern, geo_era_label, event_category, importance_score, wikipedia_slug, created_by, review_status, tags)
VALUES

-- Ancient / Prehistoric gaps
('obsidian-trade-new-britain-18000bce', 'Obsidian Trade Networks in New Britain',
 'Archaeological evidence shows obsidian from New Britain was traded across 350km of open ocean to New Ireland as early as 20,000 BCE, making it one of the oldest long-distance maritime trade networks in human history. This demonstrates sophisticated seafaring capabilities in Melanesia long before the Lapita expansion.',
 -18000, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(150.4, -5.5), 4326), 'New Britain, Papua New Guinea', 'Pleistocene Melanesia', 'economic', 0.6, 'Obsidian_use_in_Oceania', 'seed-script:regional-enrichment-v3', 'pending', '{trade,prehistoric,melanesia}'),

('solomon-islands-settlement-30000bce', 'First Settlement of the Solomon Islands',
 'Humans reached the Solomon Islands at least 30,000 years ago, crossing significant water gaps from the Bismarck Archipelago. Kilu Cave on Buka Island provides some of the earliest evidence of deep-sea fishing in the world.',
 -30000, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(155.5, -6.2), 4326), 'Buka Island, Solomon Islands', 'Pleistocene Near Oceania', 'cultural', 0.55, 'History_of_the_Solomon_Islands', 'seed-script:regional-enrichment-v3', 'pending', '{settlement,prehistoric,melanesia}'),

('kuk-swamp-agriculture-7000bce', 'Independent Invention of Agriculture at Kuk Swamp',
 'Kuk Swamp in the Papua New Guinea highlands is one of the few places in the world where agriculture was independently invented, with evidence of wetland cultivation dating to around 7000 BCE. This challenges the narrative that agriculture spread solely from Fertile Crescent origins.',
 -7000, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(144.33, -5.78), 4326), 'Kuk Swamp, Western Highlands, Papua New Guinea', 'Neolithic New Guinea', 'scientific', 0.7, 'Kuk_Swamp', 'seed-script:regional-enrichment-v3', 'pending', '{agriculture,neolithic,independent-invention}'),

-- Classical period (huge gap — only 1 event)
('aboriginal-fish-traps-brewarrina', 'Brewarrina Fish Traps — Ancient Engineering',
 'The Brewarrina fish traps (Baiame''s Ngunnhu) in New South Wales are among the oldest human-made structures on Earth, with estimates ranging from 40,000 to 6,000 years old. They represent sophisticated Aboriginal engineering and were central to inter-clan gatherings and trade.',
 -4000, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(146.87, -30.08), 4326), 'Brewarrina, New South Wales, Australia', 'Ancient Aboriginal Australia', 'technological', 0.55, 'Brewarrina_fish_traps', 'seed-script:regional-enrichment-v3', 'pending', '{engineering,aboriginal,trade}'),

('budj-bim-aquaculture-system', 'Budj Bim Eel Aquaculture System',
 'The Gunditjmara people of southwestern Victoria developed an elaborate aquaculture system at Budj Bim to farm short-finned eels, involving constructed channels, weirs, and holding ponds. This 6,600-year-old system predates the Egyptian pyramids and was recognized as a UNESCO World Heritage Site in 2019.',
 -4600, '4712-01-01 BC', '4712-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(141.95, -38.07), 4326), 'Budj Bim, Victoria, Australia', 'Ancient Aboriginal Australia', 'technological', 0.65, 'Budj_Bim', 'seed-script:regional-enrichment-v3', 'pending', '{aquaculture,aboriginal,engineering,unesco}'),

('austronesian-expansion-taiwan-3000bce', 'Austronesian Expansion Begins from Taiwan',
 'Around 3000 BCE, Austronesian-speaking peoples began migrating southward from Taiwan through the Philippines, Indonesia, and eventually across the Pacific. This was the beginning of the greatest maritime diaspora in human history, ultimately spanning from Madagascar to Easter Island.',
 -3000, '3000-01-01 BC', '3000-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(121.0, 23.5), 4326), 'Taiwan', 'Neolithic Maritime Southeast Asia', 'cultural', 0.8, 'Austronesian_peoples', 'seed-script:regional-enrichment-v3', 'pending', '{migration,maritime,austronesian}'),

('marquesas-islands-settlement-300ce', 'Settlement of the Marquesas Islands',
 'Polynesian voyagers reached the remote Marquesas Islands around 300 CE, establishing one of the most isolated permanent settlements in the Pacific. The Marquesas later served as a launching point for the settlement of Hawaii, Easter Island, and possibly New Zealand.',
 300, '0300-01-01', '0300-12-31', false,
 ST_SetSRID(ST_MakePoint(-139.5, -9.0), 4326), 'Nuku Hiva, Marquesas Islands, French Polynesia', 'Early Polynesian Expansion', 'cultural', 0.6, 'Marquesas_Islands', 'seed-script:regional-enrichment-v3', 'pending', '{settlement,polynesia,migration}'),

('rapa-nui-moai-peak-1400', 'Peak of Moai Construction on Rapa Nui',
 'Between 1250 and 1500 CE, the people of Rapa Nui (Easter Island) carved and transported nearly 900 monumental stone statues (moai), some weighing over 80 tons. This extraordinary feat of engineering and social organization represents one of the most remarkable cultural achievements of Polynesia.',
 1400, '1400-01-01', '1400-12-31', false,
 ST_SetSRID(ST_MakePoint(-109.35, -27.12), 4326), 'Rapa Nui (Easter Island), Chile', 'Classical Rapa Nui', 'cultural', 0.7, 'Moai', 'seed-script:regional-enrichment-v3', 'pending', '{monument,engineering,polynesia}'),

-- Early Modern gaps
('abel-tasman-australia-1642', 'Abel Tasman''s Voyage — Europeans Encounter Australia and New Zealand',
 'Dutch navigator Abel Tasman became the first known European to reach Tasmania, New Zealand, Tonga, and Fiji during his 1642-1643 expedition. His encounters with Maori at Golden Bay resulted in violence, and the Dutch made no attempt at colonization, leaving the region to European ignorance for another century.',
 1642, '1642-11-24', '1643-06-15', false,
 ST_SetSRID(ST_MakePoint(172.07, -41.05), 4326), 'Golden Bay, New Zealand', 'Early Colonial Contact, Oceania', 'discovery', 0.6, 'Abel_Tasman', 'seed-script:regional-enrichment-v3', 'pending', '{exploration,dutch,first-contact}'),

('maori-musket-wars-1807', 'New Zealand Musket Wars',
 'The introduction of European muskets to Maori iwi (tribes) triggered decades of devastating intertribal warfare from 1807 to 1845. An estimated 20,000-40,000 Maori died, and the wars dramatically reshaped the demographic and political landscape of New Zealand before British colonization.',
 1807, '1807-01-01', '1845-12-31', false,
 ST_SetSRID(ST_MakePoint(174.76, -36.85), 4326), 'Bay of Islands, New Zealand', 'Pre-Treaty New Zealand', 'military', 0.6, 'Musket_Wars', 'seed-script:regional-enrichment-v3', 'pending', '{warfare,maori,colonialism}'),

('bounty-mutiny-pitcairn-1789', 'Mutiny on the Bounty and Settlement of Pitcairn',
 'The famous mutiny aboard HMS Bounty in 1789 led mutineers and their Tahitian companions to settle on remote Pitcairn Island. The settlement''s turbulent early history became one of the most enduring stories of the Pacific, and descendants still inhabit the island today.',
 1789, '1789-04-28', '1790-01-15', false,
 ST_SetSRID(ST_MakePoint(-130.1, -25.07), 4326), 'Pitcairn Islands, South Pacific', 'Early Colonial Pacific', 'cultural', 0.5, 'Mutiny_on_the_Bounty', 'seed-script:regional-enrichment-v3', 'pending', '{mutiny,british,settlement}'),

('french-nuclear-tests-moruroa-1966', 'French Nuclear Testing in the Pacific',
 'France conducted 193 nuclear tests at Moruroa and Fangataufa atolls in French Polynesia between 1966 and 1996, including atmospheric tests until 1974. The testing program caused lasting environmental contamination and health consequences for Pacific Islanders, fueling the Pacific antinuclear movement.',
 1966, '1966-07-02', '1996-01-27', false,
 ST_SetSRID(ST_MakePoint(-138.82, -21.87), 4326), 'Moruroa Atoll, French Polynesia', 'Cold War Pacific', 'military', 0.65, 'Moruroa', 'seed-script:regional-enrichment-v3', 'pending', '{nuclear,colonialism,environment}'),

('fiji-coup-1987', 'Fiji Military Coups of 1987',
 'Two military coups in Fiji in 1987, led by Lieutenant Colonel Sitiveni Rabuka, overthrew the democratically elected government and established an ethno-nationalist republic. The coups highlighted ethnic tensions between indigenous Fijians and Indo-Fijians and set a pattern of political instability in the Pacific Islands.',
 1987, '1987-05-14', '1987-09-25', false,
 ST_SetSRID(ST_MakePoint(178.44, -18.14), 4326), 'Suva, Fiji', 'Post-Independence Fiji', 'political', 0.5, '1987_Fijian_coups_d%27état', 'seed-script:regional-enrichment-v3', 'pending', '{coup,democracy,pacific-politics}'),

('bougainville-civil-war-1988', 'Bougainville Civil War',
 'The Bougainville conflict (1988-1998) began as a dispute over the environmental impact of the Panguna copper mine and escalated into a full secessionist war against Papua New Guinea. An estimated 15,000-20,000 people died, making it one of the deadliest conflicts in Oceania since World War II.',
 1988, '1988-11-01', '1998-04-30', false,
 ST_SetSRID(ST_MakePoint(155.48, -6.23), 4326), 'Bougainville, Papua New Guinea', 'Post-Independence Papua New Guinea', 'military', 0.55, 'Bougainville_Civil_War', 'seed-script:regional-enrichment-v3', 'pending', '{civil-war,mining,secession}'),

('tuvalu-un-membership-2000', 'Tuvalu Joins the United Nations',
 'Tuvalu, the world''s fourth-smallest country and one of the lowest-lying nations on Earth, joined the United Nations in 2000. The tiny Pacific island nation has since become a leading voice on climate change, warning that rising sea levels threaten its very existence.',
 2000, '2000-09-05', '2000-09-05', false,
 ST_SetSRID(ST_MakePoint(179.2, -8.52), 4326), 'Funafuti, Tuvalu', 'Contemporary Pacific', 'political', 0.45, 'Tuvalu', 'seed-script:regional-enrichment-v3', 'pending', '{climate-change,sovereignty,pacific-islands}'),

('polynesian-voyaging-hokule-1976', 'Hōkūleʻa Voyage — Revival of Polynesian Navigation',
 'In 1976, the double-hulled voyaging canoe Hōkūleʻa sailed from Hawaii to Tahiti using only traditional Polynesian navigation techniques, proving that ancient Pacific voyaging was intentional, not accidental. The voyage sparked a Hawaiian cultural renaissance and revived interest in traditional navigation across the Pacific.',
 1976, '1976-05-01', '1976-06-04', false,
 ST_SetSRID(ST_MakePoint(-149.43, -17.68), 4326), 'Tahiti, French Polynesia', 'Modern Pacific', 'cultural', 0.6, 'Hōkūleʻa', 'seed-script:regional-enrichment-v3', 'pending', '{navigation,cultural-revival,polynesia}'),

('gallipoli-anzac-1915', 'Gallipoli Campaign — Birth of ANZAC Identity',
 'The failed Allied invasion of the Gallipoli peninsula in 1915 resulted in devastating casualties for Australian and New Zealand forces. Though a military disaster, the campaign became foundational to national identity in both countries, with ANZAC Day (April 25) becoming their most significant day of remembrance.',
 1915, '1915-04-25', '1916-01-09', false,
 ST_SetSRID(ST_MakePoint(26.28, 40.35), 4326), 'Gallipoli, Turkey', 'World War I', 'military', 0.7, 'Gallipoli_campaign', 'seed-script:regional-enrichment-v3', 'pending', '{ww1,anzac,national-identity}'),

('micronesia-nan-madol-1200', 'Nan Madol — Venice of the Pacific',
 'Nan Madol, built on artificial islets off the coast of Pohnpei in Micronesia between 1200 and 1500 CE, is the only ancient city ever built atop a coral reef. The megalithic complex of 92 islets served as the ceremonial and political center of the Saudeleur dynasty, using basalt columns weighing up to 50 tons.',
 1200, '1200-01-01', '1200-12-31', false,
 ST_SetSRID(ST_MakePoint(158.34, 6.84), 4326), 'Pohnpei, Federated States of Micronesia', 'Saudeleur Dynasty, Micronesia', 'cultural', 0.65, 'Nan_Madol', 'seed-script:regional-enrichment-v3', 'pending', '{architecture,megalithic,micronesia}'),

('torres-strait-islands-trade-network', 'Torres Strait Islands Maritime Trade Network',
 'For thousands of years, the Torres Strait Islanders maintained sophisticated maritime trade networks connecting Aboriginal Australia with Papua New Guinea. Trade goods included shell ornaments, ochre, stone tools, and canoes, facilitating cultural exchange between two distinct cultural traditions.',
 -500, '0500-01-01 BC', '0500-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(142.2, -10.1), 4326), 'Torres Strait Islands, Australia', 'Pre-Contact Torres Strait', 'economic', 0.5, 'Torres_Strait_Islanders', 'seed-script:regional-enrichment-v3', 'pending', '{trade,maritime,indigenous}'),

-- ============================================================
-- AFRICA (~18 events) — gaps: Ancient, Classical
-- ============================================================

('nok-culture-terracotta-500bce', 'Nok Culture — Earliest Sub-Saharan Sculpture',
 'The Nok culture of central Nigeria (c. 1500 BCE–500 CE) produced the earliest known terracotta sculptures in sub-Saharan Africa. Their sophisticated ironworking, possibly developed independently, and distinctive artistic style influenced later West African civilizations including Ife and Benin.',
 -500, '0500-01-01 BC', '0500-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(8.0, 9.5), 4326), 'Jos Plateau, Nigeria', 'Iron Age West Africa', 'cultural', 0.7, 'Nok_culture', 'seed-script:regional-enrichment-v3', 'pending', '{sculpture,ironworking,west-africa}'),

('meroe-iron-smelting-capital', 'Meroë — Iron Smelting Capital of Ancient Africa',
 'The Kingdom of Kush relocated its capital to Meroë around 590 BCE, where it became the largest iron-smelting center in ancient Africa. The massive slag heaps visible today testify to industrial-scale iron production that powered Kushite military and economic power for centuries.',
 -590, '0590-01-01 BC', '0590-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(33.75, 16.94), 4326), 'Meroë, Sudan', 'Kingdom of Kush', 'technological', 0.65, 'Meroë', 'seed-script:regional-enrichment-v3', 'pending', '{ironworking,kush,industry}'),

('adulis-aksumite-port-100ce', 'Adulis — Aksumite Red Sea Trade Hub',
 'The port city of Adulis on the Red Sea coast served as the principal trading gateway of the Aksumite Empire, connecting East Africa with the Roman Empire, India, and Arabia. Greek, Roman, and Indian merchants traded ivory, gold, incense, and exotic animals through this cosmopolitan harbor.',
 100, '0100-01-01', '0100-12-31', false,
 ST_SetSRID(ST_MakePoint(39.66, 15.36), 4326), 'Zula, Eritrea', 'Aksumite Empire', 'economic', 0.6, 'Adulis', 'seed-script:regional-enrichment-v3', 'pending', '{trade,aksumite,red-sea}'),

('jenne-jeno-urban-center-250bce', 'Jenne-Jeno — Oldest Known City in Sub-Saharan Africa',
 'Founded around 250 BCE on the inland Niger Delta, Jenne-Jeno grew into a major urban center of 33 hectares with an estimated population of 20,000 by 800 CE. Remarkably, it developed complex urbanism without centralized political authority, challenging assumptions about the necessity of states for city formation.',
 -250, '0250-01-01 BC', '0250-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(-4.55, 13.91), 4326), 'Djenné, Mali', 'Iron Age West Africa', 'cultural', 0.65, 'Djenné-Djenno', 'seed-script:regional-enrichment-v3', 'pending', '{urbanism,west-africa,archaeology}'),

('bantu-expansion-iron-age-500bce', 'Bantu Expansion Transforms Sub-Saharan Africa',
 'Beginning around 1000 BCE and accelerating by 500 BCE, Bantu-speaking peoples migrated from the Nigeria-Cameroon border region across central, eastern, and southern Africa. They brought iron-smelting technology, agriculture, and new languages, fundamentally reshaping the demographic and linguistic map of the continent.',
 -500, '0500-01-01 BC', '0500-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(12.0, 2.0), 4326), 'Central Africa', 'Iron Age Bantu Expansion', 'cultural', 0.8, 'Bantu_expansion', 'seed-script:regional-enrichment-v3', 'pending', '{migration,ironworking,linguistics}'),

('kingdom-of-aksum-obelisks-300ce', 'Kingdom of Aksum Erects Great Stelae',
 'Around 300 CE, the Kingdom of Aksum in modern Ethiopia erected monumental granite stelae, the tallest reaching 33 meters and weighing 520 tons — the largest monoliths ever attempted in the ancient world. These funerary monuments demonstrated Aksumite engineering prowess and the kingdom''s wealth from Red Sea trade.',
 300, '0300-01-01', '0300-12-31', false,
 ST_SetSRID(ST_MakePoint(38.72, 14.13), 4326), 'Axum, Ethiopia', 'Kingdom of Aksum', 'cultural', 0.65, 'Obelisk_of_Axum', 'seed-script:regional-enrichment-v3', 'pending', '{monument,aksumite,engineering}'),

('aksumite-conversion-christianity-330', 'Kingdom of Aksum Converts to Christianity',
 'King Ezana of Aksum adopted Christianity around 330 CE, making Aksum one of the first states in the world to officially embrace the faith. This conversion, influenced by the Syrian missionary Frumentius, established the Ethiopian Orthodox Church, which remains one of the oldest Christian institutions in the world.',
 330, '0330-01-01', '0330-12-31', false,
 ST_SetSRID(ST_MakePoint(38.72, 14.13), 4326), 'Axum, Ethiopia', 'Kingdom of Aksum', 'religious', 0.7, 'Ezana_of_Axum', 'seed-script:regional-enrichment-v3', 'pending', '{christianity,aksumite,conversion}'),

('great-zimbabwe-peak-1300', 'Great Zimbabwe at Its Peak',
 'Great Zimbabwe, the largest medieval stone structure in sub-Saharan Africa, reached its peak between 1200 and 1450 CE with a population of up to 18,000. Its massive stone walls, built without mortar, enclosed a thriving trade center that controlled gold and ivory trade routes between the interior and the Swahili coast.',
 1300, '1300-01-01', '1300-12-31', false,
 ST_SetSRID(ST_MakePoint(30.93, -20.27), 4326), 'Masvingo, Zimbabwe', 'Medieval Southern Africa', 'political', 0.7, 'Great_Zimbabwe', 'seed-script:regional-enrichment-v3', 'pending', '{architecture,trade,southern-africa}'),

('mansa-musa-hajj-1324', 'Mansa Musa''s Pilgrimage — Richest Man in History',
 'In 1324, Mansa Musa of the Mali Empire undertook a famous hajj to Mecca with an entourage of 60,000 people and an estimated 12 tons of gold. His lavish spending in Cairo caused a decade-long gold price crash, demonstrating the extraordinary wealth of West Africa to the Mediterranean world.',
 1324, '1324-01-01', '1325-12-31', false,
 ST_SetSRID(ST_MakePoint(-8.0, 12.65), 4326), 'Niani, Mali', 'Mali Empire', 'economic', 0.8, 'Mansa_Musa', 'seed-script:regional-enrichment-v3', 'pending', '{wealth,pilgrimage,mali-empire}'),

('ethiopian-solomonic-dynasty-1270', 'Solomonic Dynasty Restoration in Ethiopia',
 'In 1270, Yekuno Amlak overthrew the Zagwe dynasty and established the Solomonic dynasty, claiming descent from King Solomon and the Queen of Sheba. This dynasty would rule Ethiopia for over 700 years until 1974, making it one of the longest-ruling royal houses in world history.',
 1270, '1270-01-01', '1270-12-31', false,
 ST_SetSRID(ST_MakePoint(39.47, 8.98), 4326), 'Shewa, Ethiopia', 'Medieval Ethiopia', 'political', 0.6, 'Solomonic_dynasty', 'seed-script:regional-enrichment-v3', 'pending', '{dynasty,ethiopia,monarchy}'),

('kingdom-kongo-founded-1390', 'Kingdom of Kongo Founded',
 'The Kingdom of Kongo was established around 1390 through the unification of several smaller polities in what is now northern Angola, the Republic of Congo, and the DRC. At its height, the centralized kingdom administered an area of over 129,000 square kilometers with sophisticated governance structures.',
 1390, '1390-01-01', '1390-12-31', false,
 ST_SetSRID(ST_MakePoint(15.04, -6.27), 4326), 'M''banza-Kongo, Angola', 'Pre-Colonial Central Africa', 'political', 0.6, 'Kingdom_of_Kongo', 'seed-script:regional-enrichment-v3', 'pending', '{state-formation,central-africa,governance}'),

('zulu-kingdom-shaka-1816', 'Rise of the Zulu Kingdom under Shaka',
 'Shaka kaSenzangakhona transformed the small Zulu chieftaincy into a powerful military kingdom through revolutionary tactical innovations including the short stabbing spear (iklwa) and the bull-horn formation. The resulting Mfecane upheaval reshaped the political landscape of southern Africa.',
 1816, '1816-01-01', '1828-09-22', false,
 ST_SetSRID(ST_MakePoint(31.42, -28.32), 4326), 'KwaZulu-Natal, South Africa', 'Pre-Colonial Southern Africa', 'military', 0.7, 'Shaka', 'seed-script:regional-enrichment-v3', 'pending', '{military-innovation,zulu,mfecane}'),

('berlin-conference-africa-partition-1884', 'Berlin Conference — Scramble for Africa',
 'The Berlin Conference of 1884-1885 established rules for European colonization of Africa, with no African representatives present. European powers divided the continent into arbitrary borders with no regard for existing ethnic, linguistic, or political boundaries, creating problems that persist to this day.',
 1884, '1884-11-15', '1885-02-26', false,
 ST_SetSRID(ST_MakePoint(13.38, 52.52), 4326), 'Berlin, Germany', 'Scramble for Africa', 'political', 0.85, 'Berlin_Conference', 'seed-script:regional-enrichment-v3', 'pending', '{colonialism,imperialism,partition}'),

('battle-adwa-ethiopia-1896', 'Battle of Adwa — Ethiopia Defeats Italy',
 'On March 1, 1896, Emperor Menelik II''s Ethiopian forces decisively defeated the Italian army at the Battle of Adwa, preserving Ethiopian sovereignty during the Scramble for Africa. This was the most significant African military victory over a European colonial power and inspired anti-colonial movements across the continent.',
 1896, '1896-03-01', '1896-03-01', false,
 ST_SetSRID(ST_MakePoint(38.98, 14.18), 4326), 'Adwa, Tigray, Ethiopia', 'Scramble for Africa', 'military', 0.75, 'Battle_of_Adwa', 'seed-script:regional-enrichment-v3', 'pending', '{anti-colonialism,ethiopia,military-victory}'),

('rwandan-genocide-1994', 'Rwandan Genocide',
 'Over approximately 100 days from April to July 1994, an estimated 800,000 to 1,000,000 Tutsi and moderate Hutu were systematically murdered in Rwanda. The genocide, carried out primarily by Hutu militias while the international community largely stood by, remains one of the most devastating failures of the post-Cold War international order.',
 1994, '1994-04-07', '1994-07-15', false,
 ST_SetSRID(ST_MakePoint(29.87, -1.94), 4326), 'Kigali, Rwanda', 'Post-Cold War Africa', 'political', 0.85, 'Rwandan_genocide', 'seed-script:regional-enrichment-v3', 'pending', '{genocide,humanitarian-crisis,international-failure}'),

('nelson-mandela-released-1990', 'Nelson Mandela Released from Prison',
 'After 27 years of imprisonment, Nelson Mandela was released from Victor Verster Prison on February 11, 1990. His release marked the beginning of the end of apartheid in South Africa and led to the country''s first multiracial democratic elections in 1994, in which Mandela became president.',
 1990, '1990-02-11', '1990-02-11', false,
 ST_SetSRID(ST_MakePoint(18.97, -33.88), 4326), 'Paarl, Western Cape, South Africa', 'End of Apartheid', 'political', 0.85, 'Nelson_Mandela', 'seed-script:regional-enrichment-v3', 'pending', '{apartheid,democracy,human-rights}'),

('african-union-founded-2002', 'African Union Founded',
 'The African Union was established on July 9, 2002, in Durban, South Africa, replacing the Organisation of African Unity. With 55 member states, the AU aims to promote continental integration, peace, and development, representing Africa''s most ambitious pan-African institutional project.',
 2002, '2002-07-09', '2002-07-09', false,
 ST_SetSRID(ST_MakePoint(31.05, -29.86), 4326), 'Durban, South Africa', 'Contemporary Africa', 'political', 0.6, 'African_Union', 'seed-script:regional-enrichment-v3', 'pending', '{pan-africanism,international-organization,integration}'),

('songhai-empire-timbuktu-1468', 'Songhai Empire Captures Timbuktu',
 'Sunni Ali Ber of the Songhai Empire conquered Timbuktu in 1468, absorbing it from the declining Mali Empire. Under Songhai rule, Timbuktu flourished as one of the world''s great centers of Islamic learning, with the University of Sankore attracting scholars from across the Muslim world.',
 1468, '1468-01-01', '1468-12-31', false,
 ST_SetSRID(ST_MakePoint(-3.0, 16.77), 4326), 'Timbuktu, Mali', 'Songhai Empire', 'military', 0.65, 'Songhai_Empire', 'seed-script:regional-enrichment-v3', 'pending', '{conquest,scholarship,west-africa}'),

-- ============================================================
-- MIDDLE EAST (~15 events) — gaps: Early Modern, Modern
-- ============================================================

('safavid-empire-founded-1501', 'Safavid Empire Founded — Shia Iran Established',
 'Shah Ismail I founded the Safavid Empire in 1501 and declared Twelver Shia Islam the official state religion of Iran. This momentous decision created the enduring Sunni-Shia geopolitical divide that continues to shape Middle Eastern politics and established Iran''s distinct Islamic identity.',
 1501, '1501-01-01', '1501-12-31', false,
 ST_SetSRID(ST_MakePoint(46.3, 38.08), 4326), 'Tabriz, Iran', 'Early Safavid Empire', 'political', 0.8, 'Safavid_dynasty', 'seed-script:regional-enrichment-v3', 'pending', '{shia-islam,iran,empire}'),

('battle-chaldiran-1514', 'Battle of Chaldiran — Ottoman-Safavid Rivalry',
 'The Battle of Chaldiran in 1514 saw the Ottoman Empire defeat the Safavid Empire, establishing the Ottoman-Safavid border that would roughly define the modern Turkey-Iran frontier. Ottoman gunpowder technology proved decisive against Safavid cavalry, cementing the Ottoman military advantage.',
 1514, '1514-08-23', '1514-08-23', false,
 ST_SetSRID(ST_MakePoint(44.37, 39.08), 4326), 'Chaldiran, Eastern Turkey', 'Ottoman-Safavid Wars', 'military', 0.65, 'Battle_of_Chaldiran', 'seed-script:regional-enrichment-v3', 'pending', '{ottoman,safavid,gunpowder}'),

('siege-of-baghdad-ottoman-1534', 'Ottoman Capture of Baghdad',
 'Sultan Suleiman the Magnificent captured Baghdad from the Safavids in 1534, bringing Mesopotamia under Ottoman control for nearly four centuries. This conquest gave the Ottomans control of the holy Shia shrines at Karbala and Najaf, adding a religious dimension to the Ottoman-Safavid rivalry.',
 1534, '1534-11-30', '1534-11-30', false,
 ST_SetSRID(ST_MakePoint(44.37, 33.31), 4326), 'Baghdad, Iraq', 'Ottoman Empire', 'military', 0.6, 'Ottoman_Iraq', 'seed-script:regional-enrichment-v3', 'pending', '{ottoman,conquest,mesopotamia}'),

('isfahan-safavid-capital-1598', 'Isfahan — Half the World Under Shah Abbas',
 'Shah Abbas I moved the Safavid capital to Isfahan in 1598 and transformed it into one of the world''s most beautiful and cosmopolitan cities. The famous proverb "Isfahan is half the world" reflected a city of 600,000 with stunning architecture, extensive trade networks, and religious tolerance toward Armenian Christians.',
 1598, '1598-01-01', '1598-12-31', false,
 ST_SetSRID(ST_MakePoint(51.67, 32.65), 4326), 'Isfahan, Iran', 'Safavid Golden Age', 'cultural', 0.65, 'Isfahan', 'seed-script:regional-enrichment-v3', 'pending', '{architecture,safavid,cosmopolitan}'),

('wahhabi-movement-1744', 'Wahhabi Movement — First Saudi-Wahhabi Alliance',
 'In 1744, Islamic scholar Muhammad ibn Abd al-Wahhab formed a pact with Muhammad ibn Saud, establishing the religious-political alliance that would eventually create Saudi Arabia. This puritanical reform movement sought to return Islam to its earliest practices and would profoundly influence global Islam.',
 1744, '1744-01-01', '1744-12-31', false,
 ST_SetSRID(ST_MakePoint(45.58, 24.63), 4326), 'Diriyah, Saudi Arabia', 'First Saudi State', 'religious', 0.7, 'Wahhabism', 'seed-script:regional-enrichment-v3', 'pending', '{wahhabism,saudi,religious-reform}'),

('egyptian-modernization-muhammad-ali-1805', 'Muhammad Ali Modernizes Egypt',
 'Muhammad Ali Pasha, who seized power in Egypt in 1805, launched an ambitious modernization program including industrialization, military reform, and educational institutions. Often called the "founder of modern Egypt," he established a dynasty that ruled until 1952 and transformed Egypt into the most powerful state in the eastern Mediterranean.',
 1805, '1805-01-01', '1848-12-31', false,
 ST_SetSRID(ST_MakePoint(31.24, 30.04), 4326), 'Cairo, Egypt', 'Ottoman Egypt', 'political', 0.7, 'Muhammad_Ali_of_Egypt', 'seed-script:regional-enrichment-v3', 'pending', '{modernization,egypt,industrialization}'),

('young-turk-revolution-1908', 'Young Turk Revolution',
 'The Young Turk Revolution of 1908 forced Sultan Abdul Hamid II to restore the Ottoman constitution and parliament, promising modernization and equality. However, the Committee of Union and Progress that took power increasingly pursued Turkish nationalism, contributing to ethnic tensions that culminated in the Armenian Genocide.',
 1908, '1908-07-03', '1908-07-24', false,
 ST_SetSRID(ST_MakePoint(27.14, 41.01), 4326), 'Thessaloniki, Greece (Ottoman Empire)', 'Late Ottoman Empire', 'political', 0.65, 'Young_Turk_Revolution', 'seed-script:regional-enrichment-v3', 'pending', '{revolution,ottoman,constitutionalism}'),

('armenian-genocide-1915', 'Armenian Genocide',
 'Beginning in April 1915, the Ottoman government systematically deported and massacred approximately 1.5 million ethnic Armenians. This genocide, carried out under the cover of World War I, destroyed the ancient Armenian presence in Anatolia and remains a defining trauma for the Armenian people and a major point of historical contention.',
 1915, '1915-04-24', '1923-12-31', false,
 ST_SetSRID(ST_MakePoint(39.0, 38.5), 4326), 'Eastern Anatolia, Turkey', 'World War I Ottoman Empire', 'political', 0.85, 'Armenian_genocide', 'seed-script:regional-enrichment-v3', 'pending', '{genocide,ottoman,world-war-i}'),

('balfour-declaration-1917', 'Balfour Declaration — British Support for Jewish Homeland',
 'On November 2, 1917, British Foreign Secretary Arthur Balfour declared Britain''s support for "the establishment in Palestine of a national home for the Jewish people." This 67-word letter would have enormous consequences, laying the diplomatic groundwork for the creation of Israel and the ongoing Israeli-Palestinian conflict.',
 1917, '1917-11-02', '1917-11-02', false,
 ST_SetSRID(ST_MakePoint(35.22, 31.77), 4326), 'Jerusalem, Palestine (British Mandate)', 'World War I Middle East', 'political', 0.8, 'Balfour_Declaration', 'seed-script:regional-enrichment-v3', 'pending', '{zionism,british-mandate,palestine}'),

('discovery-oil-saudi-1938', 'Discovery of Oil in Saudi Arabia',
 'The discovery of commercial oil quantities at Dammam Well No. 7 in March 1938 transformed Saudi Arabia from one of the world''s poorest nations into an energy superpower. This discovery fundamentally altered the geopolitics of the Middle East and the global economy, making petroleum the defining resource of the 20th century.',
 1938, '1938-03-03', '1938-03-03', false,
 ST_SetSRID(ST_MakePoint(50.1, 26.43), 4326), 'Dammam, Saudi Arabia', 'Pre-War Saudi Arabia', 'economic', 0.85, 'History_of_the_oil_industry_in_Saudi_Arabia', 'seed-script:regional-enrichment-v3', 'pending', '{oil,energy,geopolitics}'),

('iranian-revolution-1979', 'Iranian Revolution — Fall of the Shah',
 'The Iranian Revolution of 1979 overthrew the US-backed Shah Mohammad Reza Pahlavi and established an Islamic republic under Ayatollah Khomeini. This seismic event transformed Iran, destabilized the Middle East, and inaugurated a new era of political Islam that continues to shape the region.',
 1979, '1979-01-16', '1979-04-01', false,
 ST_SetSRID(ST_MakePoint(51.39, 35.69), 4326), 'Tehran, Iran', 'Late Cold War Middle East', 'political', 0.85, 'Iranian_Revolution', 'seed-script:regional-enrichment-v3', 'pending', '{revolution,political-islam,iran}'),

('camp-david-accords-1978', 'Camp David Accords — Egypt-Israel Peace',
 'The Camp David Accords, brokered by US President Jimmy Carter between Egyptian President Anwar Sadat and Israeli Prime Minister Menachem Begin in 1978, led to the first peace treaty between Israel and an Arab state. The agreement returned the Sinai Peninsula to Egypt but cost Sadat his life — he was assassinated in 1981.',
 1978, '1978-09-17', '1978-09-17', false,
 ST_SetSRID(ST_MakePoint(31.24, 30.04), 4326), 'Cairo, Egypt / Jerusalem, Israel', 'Cold War Middle East', 'political', 0.8, 'Camp_David_Accords', 'seed-script:regional-enrichment-v3', 'pending', '{peace-treaty,diplomacy,arab-israeli-conflict}'),

('iraq-invasion-kuwait-1990', 'Iraq Invades Kuwait — Gulf War Begins',
 'On August 2, 1990, Saddam Hussein''s Iraqi forces invaded and occupied Kuwait, triggering an international crisis. The subsequent US-led coalition in Operation Desert Storm expelled Iraqi forces in early 1991, establishing a new pattern of American military intervention in the Middle East.',
 1990, '1990-08-02', '1991-02-28', false,
 ST_SetSRID(ST_MakePoint(47.98, 29.38), 4326), 'Kuwait City, Kuwait', 'Post-Cold War Middle East', 'military', 0.8, 'Gulf_War', 'seed-script:regional-enrichment-v3', 'pending', '{gulf-war,invasion,oil}'),

('qanat-irrigation-persia-1000bce', 'Persian Qanat System — Ancient Water Engineering',
 'The Persians developed the qanat system of underground water channels around 1000 BCE, enabling agriculture in arid regions without mechanical pumping. This ingenious technology spread across the Middle East, North Africa, and even to Spain and the Americas, and some qanats in Iran remain operational after 3,000 years.',
 -1000, '1000-01-01 BC', '1000-12-31 BC', true,
 ST_SetSRID(ST_MakePoint(58.8, 33.5), 4326), 'Kerman, Iran', 'Ancient Persia', 'technological', 0.65, 'Qanat', 'seed-script:regional-enrichment-v3', 'pending', '{irrigation,engineering,water-management}'),

('dead-sea-scrolls-hidden-68ce', 'Dead Sea Scrolls Hidden in Qumran Caves',
 'Around 68 CE, during the Jewish revolt against Rome, members of a religious community hid nearly 1,000 manuscripts in caves near Qumran by the Dead Sea. Discovered accidentally in 1947, these scrolls include the oldest known copies of Hebrew Bible texts and transformed understanding of Second Temple Judaism and early Christianity.',
 68, '0068-01-01', '0068-12-31', false,
 ST_SetSRID(ST_MakePoint(35.46, 31.74), 4326), 'Qumran, West Bank, Palestine', 'Roman Judea', 'religious', 0.75, 'Dead_Sea_Scrolls', 'seed-script:regional-enrichment-v3', 'pending', '{manuscripts,judaism,archaeology}')

ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- CAUSALITY LINKS
-- ============================================================

-- Austronesian expansion -> Lapita expansion
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Austronesian expansion from Taiwan led to the Lapita cultural complex in the western Pacific', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'austronesian-expansion-taiwan-3000bce' AND e.slug = 'settlement-pacific-islands-oceania'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Lapita expansion -> Marquesas settlement
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Lapita cultural expansion enabled Polynesian settlement of the remote Marquesas', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'settlement-pacific-islands-oceania' AND e.slug = 'marquesas-islands-settlement-300ce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Marquesas -> Hawaii settlement
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Marquesas Islands served as launching point for Polynesian settlement of Hawaii', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'marquesas-islands-settlement-300ce' AND e.slug = 'settlement-hawaii-800'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Bantu expansion -> Nok culture connection
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.5, 'Bantu expansion spread ironworking techniques related to Nok culture traditions across sub-Saharan Africa', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'nok-culture-terracotta-500bce' AND e.slug = 'bantu-expansion-iron-age-500bce'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Berlin Conference -> Battle of Adwa
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Berlin Conference partition of Africa led to Italian colonial ambitions in Ethiopia, resulting in the Battle of Adwa', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'berlin-conference-africa-partition-1884' AND e.slug = 'battle-adwa-ethiopia-1896'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Mandela release -> Year of Africa / decolonization connection
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Mandela''s release led to the founding of the African Union as post-apartheid South Africa joined continental integration', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'nelson-mandela-released-1990' AND e.slug = 'african-union-founded-2002'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Mansa Musa pilgrimage -> Songhai captures Timbuktu (Mali decline)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.5, 'Mali Empire''s wealth attracted rivals; its gradual decline after Mansa Musa enabled Songhai conquest', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'mansa-musa-hajj-1324' AND e.slug = 'songhai-empire-timbuktu-1468'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Great Zimbabwe -> Zimbabwe gold trade
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Great Zimbabwe''s peak as a trade center was built on control of gold trade routes', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'zimbabwe-plateau-gold-trade-1100' AND e.slug = 'great-zimbabwe-peak-1300'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Safavid -> Battle of Chaldiran
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Safavid Empire''s establishment as a Shia power directly provoked Ottoman military response at Chaldiran', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'safavid-empire-founded-1501' AND e.slug = 'battle-chaldiran-1514'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Battle of Chaldiran -> Ottoman capture of Baghdad
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Ottoman victory at Chaldiran opened the path to conquest of Mesopotamia', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'battle-chaldiran-1514' AND e.slug = 'siege-of-baghdad-ottoman-1534'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Wahhabi movement -> Discovery of oil (Saudi Arabia continuity)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.5, 'The Saudi-Wahhabi alliance created the political entity that would control Arabian oil reserves', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'wahhabi-movement-1744' AND e.slug = 'discovery-oil-saudi-1938'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Young Turk Revolution -> Armenian Genocide
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Young Turk nationalism and WWI created the conditions for the Armenian Genocide', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'young-turk-revolution-1908' AND e.slug = 'armenian-genocide-1915'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- WW1 Ottoman collapse -> Balfour Declaration
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Ottoman collapse in WWI enabled British promises regarding Palestine', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'ww1-ottoman-collapse-sykes-picot-1916' AND e.slug = 'balfour-declaration-1917'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Balfour Declaration -> Arab Spring (long chain, indirect)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Discovery of Saudi oil led to OPEC formation and the 1973 oil crisis', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'discovery-oil-saudi-1938' AND e.slug = 'oil-crisis-opec-1973'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Iranian Revolution -> Iraq invasion of Kuwait (destabilization)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'Iranian Revolution and the Iran-Iraq War left Saddam Hussein''s regime debt-ridden, motivating the invasion of Kuwait', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'iranian-revolution-1979' AND e.slug = 'iraq-invasion-kuwait-1990'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- French nuclear tests -> Polynesian voyaging revival (cultural resistance)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.4, 'French nuclear testing in the Pacific galvanized indigenous cultural revival movements including the Hōkūleʻa voyages', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'french-nuclear-tests-moruroa-1966' AND e.slug = 'polynesian-voyaging-hokule-1976'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Cook's Pacific voyage -> First Fleet Australia
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Cook''s charting of the Australian coast directly led to British colonization', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'cook-charts-australia-1770' AND e.slug = 'first-fleet-australia-1788'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Berlin Conference -> Congo independence crisis
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Berlin Conference awarded Congo to King Leopold II; brutal colonial legacy led to the turbulent independence crisis', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'berlin-conference-africa-partition-1884' AND e.slug = 'congo-independence-lumumba-1960'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Rwanda genocide -> African Union (never again motivation)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'The failure to prevent the Rwandan genocide motivated the AU''s stronger mandate for intervention compared to the OAU', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'rwandan-genocide-1994' AND e.slug = 'african-union-founded-2002'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Camp David -> Gulf War (regional dynamics)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.4, 'Camp David Accords neutralized Egypt as a military threat to Israel, shifting regional power dynamics that influenced Iraqi ambitions', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'camp-david-accords-1978' AND e.slug = 'iraq-invasion-kuwait-1990'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

-- Muhammad Ali modernization -> Suez Canal
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Muhammad Ali''s modernization of Egypt laid groundwork for the infrastructure ambitions that led to the Suez Canal', 'seed-script:regional-enrichment-v3', 'approved'
FROM events c, events e
WHERE c.slug = 'egyptian-modernization-muhammad-ali-1805' AND e.slug = 'suez-canal-construction-begins-1859'
ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING;

COMMIT;
