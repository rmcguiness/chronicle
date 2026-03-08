#!/usr/bin/env python3
"""
Seed causality links between ancient civilization events (pre-500 CE).
Creates 50+ historically meaningful connections across Mesopotamia, Egypt,
Indus Valley, China, Greece, Rome, Phoenicia, India, and the Americas.
"""
import asyncio
import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# Maps short labels to UUIDs for readability
EVENTS = {
    # Mesopotamia
    "uruk":                "5e86a779-0488-40be-b748-5c86efd09a1c",
    "wheel":               "7946db22-e75f-481a-b333-1f01e9f42a9f",
    "cuneiform":           "8e4d836d-3caf-4c90-856b-646f6bc4bc9f",
    "sargon_akkad":        "97b4a55c-809a-486e-974c-8803c04e6ead",
    "ur_iii":              "2db2b085-528d-4884-b409-de46bfcb3e93",
    "gilgamesh":           "f70b183b-0013-4f6e-9b91-502083e5ef6a",
    "ur_nammu":            "e418a57a-ee5c-46ec-9149-a1090f580844",
    "hammurabi":           "69f04f3d-f769-40a0-a9d5-a07617fadb8a",
    "assyrian_empire":     "ed83fddc-0440-410f-8930-d892e512f1ef",
    "ashurnasirpal":       "c63b159a-574b-4dfa-8e80-259e4182e206",
    "ashurbanipal":        "29d2ea97-c7e8-4618-85ac-cdf422538f5c",
    "library_ashurbanipal":"92d4bfd9-8ce5-4d98-ab97-353319d6379e",
    "fall_nineveh":        "aeba9552-f4ba-4e25-be0f-9269479c1bac",
    "neo_babylon":         "40174438-9eb0-4d79-9185-2cb5d623a15d",
    "hanging_gardens":     "badc37ab-a434-43e5-a091-c0b0de006dd9",
    "iron_age":            "62369371-2388-4797-b619-b1e292d0dd6d",

    # Egypt
    "narmer":              "242dd754-0ceb-4a74-baad-ef1130de4a89",
    "old_kingdom":         "1fc9ef56-201f-406e-af15-0f8642453263",
    "step_pyramid":        "d51cdb80-9693-4973-bfb1-273a081a89b5",
    "great_pyramid":       "8c64167e-6056-4170-8a0b-fb31bb5924e1",
    "first_intermediate":  "2804d491-c6dd-40a3-8c47-46bbca4b96ff",
    "mentuhotep":          "817e9141-7b9f-4262-b6c4-8e5e91e75386",
    "new_kingdom":         "96f0107a-b057-4591-9435-3212e2dfe27e",
    "ahmose":              "509f31ad-f58d-42d5-90b6-9ca9c0116e7f",
    "hatshepsut":          "cf9d30bb-fb35-4901-915e-c765d4b57825",
    "megiddo":             "a03a663f-a99d-4072-8234-46b7529a8ed6",
    "akhenaten":           "6c9da90c-e8e9-4a1e-bd2c-c7eeb7e5fa22",
    "tutankhamun":         "74664fad-5766-4341-9a1c-89d99aa41c0d",
    "kadesh":              "55c983fa-308c-4aaa-8b48-061388c1a728",
    "abu_simbel":          "d472ab83-2624-47e0-8159-457815faad6e",
    "peace_treaty":        "365e7c84-e884-4a13-8f0b-dbb2099ff679",
    "book_of_dead":        "c3c85c26-3d2a-4ca4-8d26-cddb3f69052f",
    "kushite_pharaohs":    "f739cb18-9d86-41c7-b83b-4ce6176a5959",

    # Indus Valley
    "harappan":            "72c5ae5e-cebd-4a75-9a30-640942f30a27",
    "harappa_grid":        "bbb3e2fc-e776-47c4-bcbd-192b51947d83",
    "indus_script":        "28dc07d6-392a-475b-9555-b88cfc751c62",
    "indus_valley":        "fb2620f7-62bc-4b59-8222-ab9d3a8df321",
    "lothal":              "5afc41ac-d45e-4763-994d-87a282d5b74f",
    "indus_decline":       "8ab3b4fd-9b15-4cc2-83c8-04d61d74dd68",

    # China
    "erlitou":             "78b871c8-4722-4eec-8951-f9ea43b1a41f",
    "shang":               "0be2da2e-4779-46ee-ab3e-76771f07e0c5",
    "oracle_bones":        "b892b619-f2c7-4cce-96df-104b5a2e3b6b",
    "shang_bronze":        "43276b11-c1dc-445b-a3a1-c49bd38c61e3",
    "battle_muye":         "0c5f78f3-26a4-4e4c-9313-4e05635e072e",
    "warring_states":      "0b74cdfc-9d66-4cd8-88e0-18271366eaea",
    "confucius":           "1be4d5ba-1b1e-4e18-894b-229a70643629",
    "laozi":               "184fda93-4c01-41ab-987e-35216413efda",
    "sun_tzu":             "4602837a-81e3-4375-9342-294c7cfc9304",
    "qin_unify":           "cb207850-2a09-4e53-99c9-3e344253b804",
    "great_wall":          "f6fba3d5-ed6f-45ad-865c-0d05d5202e2d",
    "terracotta":          "db60cdaf-e846-40b1-971a-6cbee9a11d39",
    "han_dynasty":         "c2255214-a012-4c3b-b3eb-ea300019d2eb",
    "silk_road":           "610bc6f9-04b8-449f-b904-7dc478fa02cb",
    "zhang_qian":          "e0afaecc-d721-4719-aee6-c7a886a6f14c",
    "wu_confucianism":     "797c8b0f-ae3f-4a8f-ba46-b63d628c6050",
    "han_exams":           "a3c24129-115a-44b1-ad0d-30966c333bae",
    "paper":               "59762bc2-5861-4d92-aa72-99bc9ada6930",
    "fall_han":            "e1599029-baa1-41f7-9bb1-eed88b9d190b",
    "sima_qian":           "a454e2de-b684-4607-9a6e-72382a14dad6",

    # Greece
    "minoan":              "7b77942b-8b49-4c9c-b78f-04c5de2b2e83",
    "knossos":             "a328699c-dccd-4a04-963e-49efc92f518a",
    "thera":               "73702986-ae79-4a26-8dcf-4fa466c8cb15",
    "mycenaean":           "3269be81-70f1-404a-b3e4-21cb97c697d4",
    "trojan_war":          "bbda2c1c-40e3-41e4-b724-465a30c770a8",
    "sea_peoples":         "20433bc3-f953-4648-81ac-afa1642ecc62",
    "bronze_collapse":     "378a7e45-9cbd-4c4c-bd8a-c5373ae33b83",
    "dark_ages_end":       "f284dd5d-39a4-43dc-b1a4-b92a0813fcb6",
    "olympics":            "7fd8d6d2-ecca-499a-9353-9745373a00d4",
    "homer":               "b46f6d8e-0839-4446-8f0b-b7f078804c54",
    "greek_colonization":  "fb1be391-a76a-4fea-bc2e-5ee54857e163",
    "spartan_lycurgus":    "9e7ce801-649a-4053-9fb6-81cb46c5a380",
    "cleisthenes":         "6dc7868e-00e3-4a4f-a98a-71d314560481",
    "marathon":            "ba5634ca-5e9d-42b0-a9ea-379d04de2a5e",
    "thermopylae":         "abf904aa-5703-47f0-8462-30069d447a47",
    "salamis":             "5d30137c-1a23-4a40-b60a-400f73db06eb",
    "delian_league":       "fd1d23a7-9fe6-4c30-a8ca-ad064ba6e0a3",
    "pericles":            "9b3bffbb-faf7-475e-9445-69c1678f4e39",
    "parthenon":           "447dab70-cfcd-4b67-8d88-ba5a25b87cd1",
    "herodotus":           "93eb5f43-c73b-45bb-9f57-9e908baaf649",
    "peloponnesian_war":   "51c5f47a-843a-4075-9d3d-ac07a5deb98a",
    "end_pelop_war":       "158b2c4b-9a50-4e87-b633-992b044fe842",
    "socrates":            "664e5cde-69ce-4ab1-99dc-21a77e3d3a91",
    "plato":               "0e4e64cc-5644-4c19-9034-913cdb857b0d",
    "aristotle":           "26fa05dc-6ea6-434d-8dda-48ba1eb81192",
    "philip_ii":           "f057384c-0dbf-4fc7-bb30-ae17c408015b",

    # Alexander & Hellenistic
    "alexander_begins":    "12f3223e-0ae3-4e66-b2a3-3d7ba36f6330",
    "gaugamela":           "4f241a04-200b-4d2b-8453-c5b3151e700a",
    "alexandria_founded":  "84575bf0-17ea-4d76-80fd-8a4709dfae4c",
    "alexander_india":     "d2774fcd-f403-48e4-9e82-968550feee98",
    "alexander_death":     "923d09db-143c-4176-93e8-3db3c73f96e4",
    "diadochi":            "8d8a2319-3ba5-4fbf-9b1a-4603ad1d91fc",
    "ptolemaic":           "6a2e7c2f-fb3b-48e6-a476-61b2d47be56b",
    "seleucid":            "56ea276b-bb4e-4259-88b8-2c817a6415d9",
    "library_alexandria":  "baa7bcfb-eb5f-494c-8399-4ebf276ece2b",

    # Phoenicia
    "phoenician_cities":   "d86c1412-4abd-4615-9b78-64b5315eae70",
    "phoenician_alphabet": "08250cf5-eda6-46c1-9cec-9e17b1c0b7a1",
    "phoenician_trade":    "427b86b0-6680-41d6-9df6-0fac69358c8a",
    "greeks_adopt_alpha":  "560d34d3-d54f-41a7-9b48-03b872038383",
    "carthage":            "fbebb1f7-7213-4a0a-af1a-e736f5d0c6d2",

    # Persia
    "cyrus":               "ff64f657-a599-4286-bc57-00e55fa21ed2",
    "cyrus_lydia":         "3a8dcb62-a332-4629-912e-7989b7e53432",
    "cyrus_babylon":       "db3aeb12-5681-4830-a937-2c7af82f1f59",
    "cyrus_cylinder":      "6394bf1f-af19-4116-9245-2a76497d8301",
    "darius":              "546d4a4f-07f5-4fac-9091-34c5f188ed71",
    "persepolis":          "b9e78d73-061f-4cb0-a980-e7f7145417cd",
    "royal_road":          "f482e6a1-8e25-4bdb-bbdb-37e8b31a4d59",

    # India
    "rig_veda":            "2f4aa957-8c00-4028-9c18-6cc789210298",
    "upanishads":          "4289d0be-9e90-4914-8261-eef1ee1527be",
    "buddha":              "8e57a42e-1855-4b37-ba11-7c1ba9732612",
    "mahavira":            "d47175d6-62e2-49c2-b3ff-0cfecb348105",
    "chandragupta":        "c6c622c8-35f7-4ed6-b353-8f20f9efba10",
    "maurya":              "7ffe2d06-6e1d-4cdd-b4c6-d28de36f33b1",
    "ashoka":              "d6153d81-8fcf-485c-bb1b-2fe6f637ba7c",
    "ashoka_kalinga":      "9c697db4-de29-44e0-be61-1f312f15ebf5",
    "ashoka_edicts":       "ccd9dad9-faba-481e-b535-f444104e4184",
    "gupta":               "2dc1ccbb-b4ff-4731-9373-3f16c561e0b2",
    "gupta_culture":       "c90d3c20-f1f2-4065-ae06-b1cf2bd6a4a2",

    # Rome
    "rome_founding":       "bd887a47-2c24-48ec-8a4f-39cdce0358b9",
    "roman_republic":      "e4f201f8-b436-467f-bfa2-eedd099a6519",
    "twelve_tables":       "a9531985-d6b8-46aa-ba57-2658d3c79012",
    "appian_way":          "929b4a5a-6704-434f-922c-a433712d06e5",
    "punic_1":             "457c0488-b186-447f-8ef5-d0a41db31f1f",
    "punic_2":             "402275f9-f695-4f3f-b3c7-7b7b9b8f8618",
    "punic_3":             "b0a8931e-4b01-4318-b111-8d3d709fde9a",
    "gracchi":             "8818c7fd-367c-4d0d-8521-dd7a39abf457",
    "marius_reforms":      "35d81e10-2419-4380-8f7f-804b4a2daa9a",
    "first_triumvirate":   "16e277dc-bb99-4075-b993-d80f03604f91",
    "caesar_gaul":         "cbf6779a-6110-4a49-a769-53a77dce6bc6",
    "caesar_rubicon":      "82d66d29-684a-474c-9d86-2c57f2ded562",
    "caesar_assassination":"48a91bb0-4a52-407f-a8ed-bc65c89234cb",
    "second_triumvirate":  "4fe0ca91-0edf-44f2-8ba1-d7af7c74a357",
    "actium":              "0d56414b-bbd3-488e-9feb-e68ef82f4dc0",
    "augustus":             "ac771ac5-c42d-49f9-bf85-bb1ec9ad483f",
    "pax_romana":          "52ea7607-b873-46a6-bad6-67ddbcdc4b88",
    "trajan":              "f2eab2f0-d33a-40c8-9442-1f7448721713",
    "hadrian_wall":        "3873a280-70f0-4db1-906a-2b41ed870f44",
    "antonine_plague":     "adf9347c-3e4d-485f-a269-c22c5a75c36e",
    "crisis_3rd":          "f3539a32-0a64-428a-9e9a-df2c3fc7cb74",
    "diocletian":          "5538ca61-6efc-444f-a03c-f4c1505a0f83",
    "constantine_convert": "08c710fb-24d5-4699-96e0-d7effad9c680",
    "edict_milan":         "8c3bd759-f6a6-4e16-a2a0-30acf7856da5",
    "nicaea":              "a8e70771-b65b-455b-a658-6ed57de0ce7c",
    "constantinople":      "f7048909-8588-463e-8162-4820fe75001f",
    "theodosius":          "fa574879-32cf-4374-bc1b-c4f801e3995e",
    "empire_split":        "aad27458-00b4-4c70-a897-0dccc76e7830",
    "visigoths_sack":      "889bca2a-d880-4e75-ac01-232aa9e440b5",
    "fall_western_rome":   "dff07fbd-5489-4aa4-b233-fa3f3a142750",

    # Africa
    "kush":                "13ef122c-5d3f-4276-ba1c-8a19b447ff03",
    "nok":                 "e4a44d36-f073-434c-9b7b-f3e8bfeb1ad7",
    "bantu_expansion":     "d64ebc48-be43-46ba-b30c-2fe08e73699b",
    "aksum":               "f077e8c4-9118-4fa2-9192-3305bb3f9a4b",
    "aksum_christian":     "58574407-0599-46e9-9973-57dc70d63bd9",
    "aksum_conquers_kush": "b32e03fc-a3e1-4069-81cf-2bbbcf014bec",

    # Steppe
    "horse_domestication": "0c1dae3a-7f94-419c-b4cc-19dcd2509423",
    "scythian":            "1729319c-06f8-4657-b509-3be07bc870bf",
    "xiongnu":             "4ebdd14b-7ad8-4f84-ac5f-9908de7b6847",

    # Americas
    "olmec":               "424ca5b7-665a-41c1-aa20-6d757b6f7d17",
    "olmec_heads":         "dc625d00-881d-4c10-a859-7eba94928cae",
    "maya_classical":      "5479a289-855c-4f0e-8ebc-fd1336a58696",
    "teotihuacan":         "53aec752-8991-4090-9247-6a4552e0dbd7",

    # Cross-civ
    "axial_age":           "842e4615-1fc5-40be-8bd3-e5e56c3a0e0e",
    "coins_lydia":         "74efccee-cfb8-4185-885d-f3dcb3457f91",
    "hittite_empire":      "481a27e2-eba6-4ea2-b5cb-674d2c9714b0",
    "hittite_babylon":     "b02fc9af-d3f8-45e6-b9e4-3d174dbfd883",
    "zoroaster":           "5b952a19-e824-4782-b095-bef40d19bf3d",
    "pythagoras":          "fe30778b-83f3-42ec-980d-8f16441c03e1",
    "silk_mature":         "9d8eb089-fc0e-4db7-8006-2073a613dc0a",
    "buddhism_silk_road":  "17a2018a-d395-4eb6-bc29-012065e865fc",

    # Cleopatra / Ptolemaic
    "cleopatra":           "03761c9a-cc06-4ed7-a278-d09a2cdc4918",
    "cleopatra_death":     "eff7368e-68a3-46d6-92cb-be40dfa63c20",

    # Sassanid
    "sassanid":            "a9d3b9cd-3107-4405-b7d9-da31320eb873",
    "parthian":            "b3f656ae-516b-4017-b662-34087d8fb6a5",
}

# (cause_key, effect_key, link_type, description, strength)
LINKS = [
    # ── Mesopotamia internal ──
    ("uruk", "cuneiform", "direct", "Urbanization at Uruk drove the need for record-keeping, leading to cuneiform", 0.9),
    ("uruk", "wheel", "direct", "Uruk's large-scale economy spurred invention of the wheel for transport", 0.7),
    ("cuneiform", "gilgamesh", "direct", "Cuneiform writing enabled the Epic of Gilgamesh to be recorded", 0.9),
    ("cuneiform", "ur_nammu", "direct", "Writing systems enabled codification of laws like the Code of Ur-Nammu", 0.8),
    ("sargon_akkad", "ur_iii", "indirect", "Akkadian imperial model influenced the Third Dynasty of Ur's revival", 0.6),
    ("ur_nammu", "hammurabi", "direct", "Ur-Nammu's legal tradition directly influenced Hammurabi's more famous code", 0.8),
    ("assyrian_empire", "ashurnasirpal", "direct", "Neo-Assyrian expansion led to Ashurnasirpal II building the new capital at Calah", 0.8),
    ("ashurnasirpal", "ashurbanipal", "direct", "Assyrian imperial tradition culminated in Ashurbanipal's reign", 0.7),
    ("ashurbanipal", "library_ashurbanipal", "direct", "Ashurbanipal assembled the world's first systematic library at Nineveh", 0.9),
    ("fall_nineveh", "neo_babylon", "direct", "Fall of Assyria created a power vacuum filled by the Neo-Babylonian Empire", 0.9),
    ("neo_babylon", "hanging_gardens", "direct", "Nebuchadnezzar II built the Hanging Gardens during Neo-Babylonian zenith", 0.8),

    # ── Mesopotamia → Egypt (cross-civ) ──
    ("cuneiform", "narmer", "indirect", "Mesopotamian writing concepts may have influenced early Egyptian hieroglyphics", 0.5),

    # ── Egypt internal ──
    ("narmer", "old_kingdom", "direct", "Narmer's unification of Egypt established the pharaonic state leading to the Old Kingdom", 0.9),
    ("old_kingdom", "step_pyramid", "direct", "Old Kingdom prosperity enabled monumental construction like the Step Pyramid", 0.9),
    ("step_pyramid", "great_pyramid", "direct", "Djoser's Step Pyramid was the architectural precursor to the Great Pyramid", 0.9),
    ("old_kingdom", "first_intermediate", "direct", "Old Kingdom centralization broke down into the First Intermediate Period", 0.7),
    ("first_intermediate", "mentuhotep", "direct", "Mentuhotep II reunified Egypt, ending the First Intermediate Period", 0.9),
    ("ahmose", "new_kingdom", "direct", "Ahmose's expulsion of the Hyksos inaugurated the New Kingdom", 0.9),
    ("new_kingdom", "hatshepsut", "direct", "New Kingdom power enabled Hatshepsut's unprecedented reign as female pharaoh", 0.8),
    ("hatshepsut", "megiddo", "direct", "Hatshepsut's successor Thutmose III launched the Battle of Megiddo", 0.7),
    ("new_kingdom", "akhenaten", "direct", "New Kingdom religious institutions enabled Akhenaten's monotheistic revolution", 0.7),
    ("akhenaten", "tutankhamun", "direct", "Tutankhamun reversed Akhenaten's religious revolution, restoring traditional worship", 0.9),
    ("new_kingdom", "kadesh", "direct", "New Kingdom imperial ambitions led to the Battle of Kadesh against the Hittites", 0.8),
    ("kadesh", "peace_treaty", "direct", "The inconclusive Battle of Kadesh led to the first known peace treaty", 0.9),
    ("kadesh", "abu_simbel", "indirect", "Ramesses II commemorated Kadesh at Abu Simbel to project military glory", 0.7),
    ("kush", "kushite_pharaohs", "direct", "Kingdom of Kush's growing power led to Kushite pharaohs ruling Egypt (25th Dynasty)", 0.9),

    # ── Indus Valley internal ──
    ("harappan", "harappa_grid", "direct", "Mature Harappan period produced the world's first grid-planned cities", 0.9),
    ("harappan", "indus_script", "direct", "Harappan urban complexity produced the Indus script writing system", 0.8),
    ("harappan", "lothal", "direct", "Harappan maritime trade networks built the world's first dock at Lothal", 0.8),
    ("harappan", "indus_decline", "indirect", "Environmental and economic stresses led to the decline of Indus Valley civilization", 0.6),
    ("indus_decline", "rig_veda", "indirect", "Post-Indus migrations and cultural shifts contributed to Vedic culture", 0.5),

    # ── India internal ──
    ("rig_veda", "upanishads", "direct", "Vedic tradition evolved into the philosophical Upanishads", 0.9),
    ("upanishads", "buddha", "direct", "Upanishadic philosophy of seeking liberation influenced Siddhartha Gautama", 0.8),
    ("upanishads", "mahavira", "direct", "Upanishadic ascetic traditions influenced Mahavira's founding of Jainism", 0.7),
    ("chandragupta", "maurya", "direct", "Chandragupta's overthrow of the Nanda Dynasty founded the Maurya Empire", 0.9),
    ("maurya", "ashoka", "direct", "Maurya Empire reached its peak under Emperor Ashoka", 0.9),
    ("ashoka", "ashoka_kalinga", "direct", "Ashoka's devastating Kalinga War led to his conversion to Buddhism", 0.9),
    ("ashoka_kalinga", "ashoka_edicts", "direct", "Ashoka's remorse after Kalinga led to his Rock Edicts spreading Buddhist principles", 0.9),
    ("gupta", "gupta_culture", "direct", "Gupta political stability enabled India's Golden Age of science and art", 0.9),

    # ── China internal ──
    ("erlitou", "shang", "direct", "Erlitou proto-urban culture was a precursor to the Shang Dynasty", 0.7),
    ("shang", "oracle_bones", "direct", "Shang court divination practices produced oracle bone inscriptions", 0.9),
    ("shang", "shang_bronze", "direct", "Shang Dynasty mastered bronze casting for ritual vessels", 0.9),
    ("battle_muye", "warring_states", "indirect", "Zhou Dynasty, established after Muye, fragmented into the Warring States", 0.6),
    ("warring_states", "confucius", "indirect", "Warring States turmoil spurred Confucius' teachings on social harmony", 0.7),
    ("warring_states", "laozi", "indirect", "Warring States chaos inspired Laozi's philosophy of the Dao", 0.7),
    ("warring_states", "sun_tzu", "direct", "Warring States military competition produced Sun Tzu's Art of War", 0.8),
    ("warring_states", "qin_unify", "direct", "Qin emerged victorious from the Warring States to unify China", 0.9),
    ("qin_unify", "great_wall", "direct", "Qin Shi Huang connected northern walls into the Great Wall", 0.9),
    ("qin_unify", "terracotta", "direct", "Qin Shi Huang commissioned the Terracotta Army for his tomb", 0.9),
    ("qin_unify", "han_dynasty", "indirect", "Qin collapse led to the founding of the Han Dynasty", 0.8),
    ("han_dynasty", "zhang_qian", "direct", "Han Emperor Wu sent Zhang Qian west, pioneering the Silk Road", 0.9),
    ("zhang_qian", "silk_road", "direct", "Zhang Qian's mission opened the Silk Road trade route", 0.9),
    ("confucius", "wu_confucianism", "direct", "Confucius' teachings were adopted as Han state ideology by Emperor Wu", 0.9),
    ("wu_confucianism", "han_exams", "direct", "Confucian state ideology led to the civil service examination system", 0.8),
    ("han_dynasty", "paper", "indirect", "Han Dynasty technological innovation produced the invention of paper", 0.7),
    ("han_dynasty", "sima_qian", "direct", "Han court historian Sima Qian wrote the Records of the Grand Historian", 0.8),

    # ── Phoenicia / Alphabet chain ──
    ("cuneiform", "phoenician_alphabet", "indirect", "Phoenician alphabet evolved from proto-Sinaitic scripts influenced by cuneiform and hieroglyphics", 0.6),
    ("phoenician_cities", "phoenician_trade", "direct", "Tyre and Sidon's maritime city-states built Mediterranean-wide trade networks", 0.9),
    ("phoenician_cities", "phoenician_alphabet", "direct", "Phoenician city-states developed the alphabet for commercial record-keeping", 0.8),
    ("phoenician_alphabet", "greeks_adopt_alpha", "direct", "Greeks adopted and adapted the Phoenician alphabet, adding vowels", 0.9),
    ("phoenician_trade", "carthage", "direct", "Phoenician maritime expansion led to the founding of Carthage", 0.9),
    ("greeks_adopt_alpha", "homer", "indirect", "Greek alphabet enabled Homer's epics to be written down", 0.7),

    # ── Bronze Age Collapse ──
    ("mycenaean", "trojan_war", "direct", "Mycenaean military power produced the Trojan War campaigns", 0.8),
    ("sea_peoples", "bronze_collapse", "contributing", "Sea Peoples' invasions contributed to the Bronze Age Collapse", 0.7),
    ("iron_age", "bronze_collapse", "contributing", "Iron Age technology disrupted bronze-dependent trade networks", 0.6),
    ("bronze_collapse", "dark_ages_end", "direct", "Recovery from the Bronze Age Collapse led to the Greek polis system", 0.8),
    ("bronze_collapse", "phoenician_cities", "indirect", "Bronze Age Collapse weakened palace economies, enabling Phoenician city-states to thrive", 0.7),

    # ── Greece classical ──
    ("dark_ages_end", "olympics", "direct", "Emerging polis system produced pan-Hellenic institutions like the Olympic Games", 0.7),
    ("dark_ages_end", "greek_colonization", "direct", "Polis system and population growth drove Greek colonization across the Mediterranean", 0.8),
    ("spartan_lycurgus", "thermopylae", "indirect", "Lycurgus' warrior reforms created the Spartan military that fought at Thermopylae", 0.7),
    ("cleisthenes", "marathon", "indirect", "Athenian democratic institutions united citizens to fight at Marathon", 0.6),
    ("marathon", "thermopylae", "direct", "Persian defeat at Marathon led to Xerxes' larger invasion and Thermopylae", 0.8),
    ("thermopylae", "salamis", "direct", "Greek retreat after Thermopylae set up the decisive naval battle at Salamis", 0.9),
    ("salamis", "delian_league", "direct", "Greek victory at Salamis led to formation of the Delian League under Athens", 0.8),
    ("delian_league", "pericles", "direct", "Delian League treasury funded Pericles' Golden Age of Athens", 0.8),
    ("pericles", "parthenon", "direct", "Pericles directed construction of the Parthenon with League funds", 0.9),
    ("pericles", "herodotus", "indirect", "Periclean Athens attracted intellectuals like Herodotus", 0.6),
    ("pericles", "peloponnesian_war", "contributing", "Athenian imperial overreach under Pericles provoked the Peloponnesian War", 0.7),
    ("peloponnesian_war", "end_pelop_war", "direct", "Peloponnesian War concluded with Sparta's defeat of Athens", 0.9),
    ("end_pelop_war", "socrates", "indirect", "Post-war Athenian instability led to Socrates' trial and execution", 0.6),
    ("socrates", "plato", "direct", "Socrates' philosophy directly inspired his student Plato to found the Academy", 0.9),
    ("plato", "aristotle", "direct", "Plato's Academy educated Aristotle, who founded the Lyceum", 0.9),
    ("aristotle", "alexander_begins", "indirect", "Aristotle tutored Alexander the Great, shaping his worldview", 0.7),
    ("philip_ii", "alexander_begins", "direct", "Philip II's Macedonian military machine enabled Alexander's conquests", 0.9),

    # ── Alexander & Hellenistic ──
    ("alexander_begins", "gaugamela", "direct", "Alexander's campaign culminated in the decisive Battle of Gaugamela", 0.9),
    ("gaugamela", "alexandria_founded", "direct", "Alexander founded Alexandria after conquering Egypt en route to Persia", 0.8),
    ("alexander_begins", "alexander_india", "direct", "Alexander's campaigns extended to India with the Battle of the Hydaspes", 0.8),
    ("alexander_death", "diadochi", "direct", "Alexander's death triggered the Wars of the Diadochi among his generals", 0.9),
    ("diadochi", "ptolemaic", "direct", "Wars of the Diadochi established the Ptolemaic Kingdom in Egypt", 0.9),
    ("diadochi", "seleucid", "direct", "Wars of the Diadochi established the Seleucid Empire in the Near East", 0.9),
    ("ptolemaic", "library_alexandria", "direct", "Ptolemaic dynasty founded the Library of Alexandria", 0.9),
    ("alexander_india", "chandragupta", "indirect", "Alexander's withdrawal from India created opportunity for Chandragupta's rise", 0.7),

    # ── Persia ──
    ("fall_nineveh", "cyrus", "indirect", "Post-Assyrian power vacuum enabled Cyrus to build the Persian Empire", 0.6),
    ("cyrus", "cyrus_lydia", "direct", "Cyrus expanded the Persian Empire by defeating Croesus of Lydia", 0.9),
    ("cyrus", "cyrus_babylon", "direct", "Cyrus conquered Babylon, freeing captive peoples", 0.9),
    ("cyrus_babylon", "cyrus_cylinder", "direct", "After conquering Babylon, Cyrus issued the Cyrus Cylinder declaration", 0.9),
    ("cyrus", "darius", "direct", "Cyrus' empire was reorganized and expanded by Darius I", 0.8),
    ("darius", "persepolis", "direct", "Darius I built Persepolis as the ceremonial capital", 0.9),
    ("darius", "royal_road", "direct", "Darius I built the Royal Road for imperial communication", 0.8),
    ("darius", "marathon", "direct", "Darius I's imperial ambitions led to the Persian invasion defeated at Marathon", 0.8),

    # ── Rome internal ──
    ("rome_founding", "roman_republic", "direct", "Rome's founding traditions led to the establishment of the Roman Republic", 0.8),
    ("roman_republic", "twelve_tables", "direct", "Republican struggles produced Rome's first written law code, the Twelve Tables", 0.8),
    ("carthage", "punic_1", "direct", "Carthaginian expansion in Sicily brought conflict with Rome in the First Punic War", 0.8),
    ("punic_1", "punic_2", "direct", "Carthaginian resentment after the First Punic War led to the Second (Hannibal)", 0.9),
    ("punic_2", "punic_3", "direct", "Roman fear of Carthaginian revival led to the Third Punic War and destruction of Carthage", 0.8),
    ("punic_3", "gracchi", "indirect", "Roman expansion after the Punic Wars created social inequalities spurring the Gracchi reforms", 0.6),
    ("gracchi", "marius_reforms", "direct", "Failure of the Gracchi reforms led to Marius' military professionalization", 0.7),
    ("marius_reforms", "first_triumvirate", "indirect", "Professional armies loyal to commanders enabled the First Triumvirate's power politics", 0.7),
    ("first_triumvirate", "caesar_gaul", "direct", "First Triumvirate gave Caesar his command in Gaul", 0.8),
    ("caesar_gaul", "caesar_rubicon", "direct", "Caesar's Gallic conquests made him powerful enough to cross the Rubicon", 0.9),
    ("caesar_rubicon", "caesar_assassination", "direct", "Caesar's dictatorship after the civil war led to his assassination", 0.9),
    ("caesar_assassination", "second_triumvirate", "direct", "Caesar's assassination led to the Second Triumvirate seeking vengeance", 0.9),
    ("second_triumvirate", "actium", "direct", "Second Triumvirate's internal rivalries led to the Battle of Actium", 0.8),
    ("actium", "cleopatra_death", "direct", "Defeat at Actium led to Cleopatra's death and Egypt becoming a Roman province", 0.9),
    ("actium", "augustus", "direct", "Victory at Actium made Octavian the first Roman Emperor (Augustus)", 0.9),
    ("augustus", "pax_romana", "direct", "Augustus' establishment of the Principate inaugurated the Pax Romana", 0.9),
    ("pax_romana", "trajan", "direct", "Pax Romana stability enabled the empire to reach maximum extent under Trajan", 0.7),
    ("trajan", "hadrian_wall", "direct", "After Trajan's expansion, Hadrian consolidated borders including Hadrian's Wall", 0.7),
    ("antonine_plague", "crisis_3rd", "contributing", "Antonine Plague weakened the empire, contributing to the Crisis of the Third Century", 0.6),
    ("crisis_3rd", "diocletian", "direct", "Crisis of the Third Century was resolved by Diocletian's administrative reforms", 0.9),
    ("diocletian", "constantine_convert", "indirect", "Diocletian's tetrarchy led to civil wars from which Constantine emerged victorious", 0.6),
    ("constantine_convert", "edict_milan", "direct", "Constantine's conversion led to the Edict of Milan legalizing Christianity", 0.9),
    ("edict_milan", "nicaea", "direct", "Legalized Christianity needed doctrinal unity, leading to the Council of Nicaea", 0.8),
    ("constantine_convert", "constantinople", "direct", "Constantine founded Constantinople as the new Christian capital", 0.8),
    ("nicaea", "theodosius", "indirect", "Nicene orthodoxy became state religion under Theodosius", 0.7),
    ("theodosius", "empire_split", "direct", "Theodosius' death permanently divided the Roman Empire into East and West", 0.9),
    ("empire_split", "visigoths_sack", "contributing", "Division weakened the Western Empire, enabling the Visigothic sack of Rome", 0.7),
    ("visigoths_sack", "fall_western_rome", "direct", "Successive barbarian incursions after the Visigothic sack led to the fall of Western Rome", 0.7),

    # ── Cross-civilization links ──
    ("silk_road", "silk_mature", "direct", "Silk Road expanded from Han China to reach full maturity connecting East and West", 0.9),
    ("silk_mature", "buddhism_silk_road", "direct", "Mature Silk Road networks carried Buddhism from India to China", 0.8),
    ("coins_lydia", "greek_colonization", "indirect", "Lydian coinage spread through Greek trade networks during colonization", 0.6),
    ("zoroaster", "cyrus", "indirect", "Zoroastrian religious framework influenced Persian imperial ideology", 0.6),
    ("horse_domestication", "scythian", "direct", "Horse domestication on the steppe enabled Scythian nomadic cavalry empire", 0.8),
    ("horse_domestication", "wheel", "indirect", "Horse domestication combined with the wheel revolutionized transport and warfare", 0.6),
    ("hittite_empire", "kadesh", "direct", "Hittite Empire's expansion brought it into conflict with Egypt at Kadesh", 0.8),
    ("hittite_empire", "hittite_babylon", "direct", "Hittite Empire expanded south, sacking Babylon under Mursili I", 0.8),
    ("hittite_empire", "iron_age", "indirect", "Hittite ironworking knowledge spread after the empire's fall, starting the Iron Age", 0.7),
    ("ptolemaic", "cleopatra", "direct", "Ptolemaic dynasty culminated in Cleopatra VII, the last pharaoh", 0.8),

    # ── Africa ──
    ("kush", "aksum_conquers_kush", "indirect", "Kingdom of Kush's decline allowed Aksum to conquer its remnants at Meroe", 0.6),
    ("aksum", "aksum_christian", "direct", "Aksumite King Ezana's conversion made Aksum the first Christian kingdom in Africa", 0.9),
    ("aksum_christian", "aksum_conquers_kush", "indirect", "Christian Aksum's expansion led to the conquest of Kush", 0.6),
    ("bantu_expansion", "nok", "indirect", "Bantu migration patterns interacted with Nok culture in West Africa", 0.5),

    # ── Americas ──
    ("olmec", "olmec_heads", "direct", "Olmec civilization produced the iconic colossal head sculptures", 0.9),
    ("olmec", "maya_classical", "indirect", "Olmec 'Mother Culture' influenced the later Maya classical civilization", 0.7),

    # ── Axial Age ──
    ("buddha", "axial_age", "contributing", "Buddha was one of the key figures of the Axial Age transformation", 0.7),
    ("confucius", "axial_age", "contributing", "Confucius was one of the key figures of the Axial Age transformation", 0.7),
    ("socrates", "axial_age", "contributing", "Socrates represented Greek philosophical contribution to the Axial Age", 0.6),

    # ── Persia → Sassanid ──
    ("parthian", "sassanid", "direct", "Sassanid Empire arose by overthrowing the Parthian dynasty", 0.9),
]


async def main():
    conn = await asyncpg.connect(DB_URL)

    before = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"Links before: {before}")

    inserted = 0
    skipped = 0
    errors = 0

    for cause_key, effect_key, link_type, description, strength in LINKS:
        cause_id = EVENTS[cause_key]
        effect_id = EVENTS[effect_key]
        try:
            result = await conn.execute(
                """
                INSERT INTO causality_links
                    (cause_event_id, effect_event_id, link_type, description, strength, created_by, review_status)
                VALUES ($1, $2, $3, $4, $5, 'seed_ancient_links', 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
                """,
                cause_id,
                effect_id,
                link_type,
                description,
                strength,
            )
            if result == "INSERT 0 1":
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            errors += 1
            print(f"  ERROR {cause_key} → {effect_key}: {e}")

    after = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"Links after:  {after}")
    print(f"Inserted: {inserted}, Skipped (duplicates): {skipped}, Errors: {errors}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
