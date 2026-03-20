-- Cultural & Intellectual History Enrichment
-- Added 2026-03-20
-- ~45 events covering philosophy, literature, art, music, architecture

-- ============================================
-- ANCIENT PHILOSOPHY & LITERATURE
-- ============================================

INSERT INTO events (slug, title, date_earliest, date_latest, year_approx, is_bce, event_category, tags, importance_score, geo_modern, geo_era_label, geo_point, article_summary, wikipedia_slug, created_by, review_status)
VALUES
('confucian-analects-compiled', 'Confucian Analects Compiled', '-0450-01-01', '-0350-12-31', -400, true, 'cultural', ARRAY['philosophy','confucianism','china','classical'], 0.8, 'China', 'Zhou Dynasty', ST_SetSRID(ST_MakePoint(117.0009, 35.5819), 4326), 'The Analects of Confucius, compiled by his disciples after his death, became the foundational text of Confucianism and shaped East Asian governance, ethics, and education for over two millennia.', 'Analects', 'seed-enrichment', 'approved'),

('zhuangzi-daoist-philosophy', 'Zhuangzi — Daoist Philosophy', '-0370-01-01', '-0300-12-31', -350, true, 'cultural', ARRAY['philosophy','daoism','china','classical'], 0.7, 'China', 'Zhou Dynasty', ST_SetSRID(ST_MakePoint(115.6500, 33.7300), 4326), 'Zhuangzi''s eponymous text is one of the two foundational works of Daoism. Its parables, paradoxes, and humor challenged conventional thinking and explored the nature of reality, freedom, and spontaneity.', 'Zhuangzi_(book)', 'seed-enrichment', 'approved'),

('buddhist-pali-canon-compiled', 'Buddhist Pali Canon Compiled', '-0280-01-01', '-0220-12-31', -250, true, 'cultural', ARRAY['philosophy','buddhism','religion','india'], 0.75, 'India', 'Maurya Empire', ST_SetSRID(ST_MakePoint(85.1376, 25.6117), 4326), 'The Tipitaka (Pali Canon) was compiled at the Third Buddhist Council under Emperor Ashoka, preserving the Buddha''s teachings in the Theravada tradition. It remains the oldest complete Buddhist scripture.', 'P%C4%81li_Canon', 'seed-enrichment', 'approved'),

('ovid-metamorphoses', 'Ovid Publishes Metamorphoses', '0008-01-01', '0008-12-31', 8, false, 'cultural', ARRAY['literature','poetry','roman','mythology','classical'], 0.7, 'Italy', 'Roman Empire', ST_SetSRID(ST_MakePoint(12.4964, 41.9028), 4326), 'Ovid''s Metamorphoses is a narrative poem of 250 myths involving transformation, from the creation of the world to the deification of Julius Caesar. It became one of the most influential works in Western art and literature.', 'Metamorphoses', 'seed-enrichment', 'approved'),

-- ============================================
-- MEDIEVAL CULTURE
-- ============================================

('beowulf-composed', 'Beowulf Composed — Oldest English Epic', '0700-01-01', '1000-12-31', 800, false, 'cultural', ARRAY['literature','epic','anglo-saxon','medieval','england'], 0.7, 'United Kingdom', 'Anglo-Saxon England', ST_SetSRID(ST_MakePoint(-1.1743, 52.3555), 4326), 'Beowulf is the oldest surviving long poem in Old English, telling the story of a Scandinavian hero who battles monsters. It is a cornerstone of English literary heritage.', 'Beowulf', 'seed-enrichment', 'approved'),

('one-thousand-and-one-nights', 'One Thousand and One Nights Compiled', '0800-01-01', '0900-12-31', 850, false, 'cultural', ARRAY['literature','folklore','arabic','medieval','storytelling'], 0.75, 'Iraq', 'Abbasid Caliphate', ST_SetSRID(ST_MakePoint(44.3661, 33.3152), 4326), 'The One Thousand and One Nights (Arabian Nights) is a collection of Middle Eastern folk tales compiled during the Islamic Golden Age. Stories like Aladdin, Ali Baba, and Sinbad became foundational to world literature.', 'One_Thousand_and_One_Nights', 'seed-enrichment', 'approved'),

('notre-dame-cathedral-construction', 'Notre-Dame Cathedral Construction Begins', '1163-01-01', '1163-12-31', 1163, false, 'cultural', ARRAY['architecture','gothic','cathedral','paris','medieval'], 0.7, 'France', 'Kingdom of France', ST_SetSRID(ST_MakePoint(2.3490, 48.8530), 4326), 'Construction of Notre-Dame de Paris began under Bishop Maurice de Sully, becoming one of the finest examples of French Gothic architecture. It took nearly 200 years to complete and has been a symbol of Paris ever since.', 'Notre-Dame_de_Paris', 'seed-enrichment', 'approved'),

('chaucer-canterbury-tales', 'Chaucer Writes The Canterbury Tales', '1387-01-01', '1400-12-31', 1387, false, 'cultural', ARRAY['literature','poetry','medieval','england'], 0.7, 'United Kingdom', 'Kingdom of England', ST_SetSRID(ST_MakePoint(-1.0800, 51.2800), 4326), 'Geoffrey Chaucer''s Canterbury Tales is a collection of stories told by pilgrims traveling to Canterbury. Written in Middle English, it offers a vivid portrait of medieval society and helped establish English as a literary language.', 'The_Canterbury_Tales', 'seed-enrichment', 'approved'),

-- ============================================
-- RENAISSANCE & EARLY MODERN
-- ============================================

('leonardo-vitruvian-man', 'Leonardo da Vinci — Vitruvian Man', '1490-01-01', '1490-12-31', 1490, false, 'cultural', ARRAY['art','renaissance','anatomy','italy','drawing'], 0.7, 'Italy', 'Republic of Venice', ST_SetSRID(ST_MakePoint(11.8768, 45.4064), 4326), 'Leonardo da Vinci''s Vitruvian Man illustrates the ideal human proportions described by the Roman architect Vitruvius. It has become an iconic symbol of the Renaissance union of art and science.', 'Vitruvian_Man', 'seed-enrichment', 'approved'),

-- ============================================
-- ENLIGHTENMENT & ROMANTIC ERA
-- ============================================

('beethoven-ninth-symphony', 'Beethoven''s Ninth Symphony Premiered', '1824-05-07', '1824-05-07', 1824, false, 'cultural', ARRAY['music','classical','romanticism','symphony','germany'], 0.8, 'Austria', 'Austrian Empire', ST_SetSRID(ST_MakePoint(16.3738, 48.2082), 4326), 'Beethoven''s Symphony No. 9 in D minor, featuring the choral finale ''Ode to Joy,'' premiered in Vienna. Composed when Beethoven was nearly deaf, it is one of the most performed symphonies in the world and the basis of the European anthem.', 'Symphony_No._9_(Beethoven)', 'seed-enrichment', 'approved'),

('jane-austen-pride-prejudice', 'Jane Austen Publishes Pride and Prejudice', '1813-01-28', '1813-01-28', 1813, false, 'cultural', ARRAY['literature','novel','england','romanticism','women'], 0.7, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-1.1743, 51.0632), 4326), 'Jane Austen''s Pride and Prejudice is a masterpiece of English literature exploring class, marriage, and morality through sharp wit and social observation. It remains one of the most beloved and widely read novels in English.', 'Pride_and_Prejudice', 'seed-enrichment', 'approved'),

('mary-shelley-frankenstein', 'Mary Shelley Publishes Frankenstein', '1818-01-01', '1818-01-01', 1818, false, 'cultural', ARRAY['literature','science fiction','gothic','novel','england'], 0.75, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-0.1278, 51.5074), 4326), 'Mary Shelley''s Frankenstein; or, The Modern Prometheus is widely considered the first science fiction novel. Written when Shelley was just 18, it explores themes of creation, responsibility, and the limits of science.', 'Frankenstein', 'seed-enrichment', 'approved'),

('goya-black-paintings', 'Goya''s Black Paintings', '1819-01-01', '1823-12-31', 1820, false, 'cultural', ARRAY['art','painting','romanticism','spain','dark art'], 0.65, 'Spain', 'Kingdom of Spain', ST_SetSRID(ST_MakePoint(-3.7038, 40.4168), 4326), 'Francisco Goya painted his Black Paintings directly onto the walls of his house near Madrid. These haunting, dark works — including Saturn Devouring His Son — represent a profound break with artistic tradition and foreshadow modern expressionism.', 'Black_Paintings', 'seed-enrichment', 'approved'),

('victor-hugo-les-miserables', 'Victor Hugo Publishes Les Misérables', '1862-04-03', '1862-06-30', 1862, false, 'cultural', ARRAY['literature','novel','france','social justice','romanticism'], 0.7, 'France', 'Second French Empire', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'Victor Hugo''s Les Misérables is a sweeping novel of social injustice, revolution, and redemption set in early 19th-century France. It remains one of the greatest novels ever written and has been adapted into one of the world''s most popular musicals.', 'Les_Mis%C3%A9rables', 'seed-enrichment', 'approved'),

-- ============================================
-- MODERN
-- ============================================

('nietzsche-zarathustra', 'Nietzsche Publishes Thus Spoke Zarathustra', '1883-01-01', '1885-12-31', 1883, false, 'cultural', ARRAY['philosophy','existentialism','germany','nihilism'], 0.75, 'Germany', 'German Empire', ST_SetSRID(ST_MakePoint(12.1015, 51.3397), 4326), 'Friedrich Nietzsche''s Thus Spoke Zarathustra introduced concepts of the Übermensch, eternal recurrence, and the death of God. It profoundly influenced 20th-century philosophy, literature, and psychology.', 'Thus_Spoke_Zarathustra', 'seed-enrichment', 'approved'),

('james-joyce-ulysses', 'James Joyce Publishes Ulysses', '1922-02-02', '1922-02-02', 1922, false, 'cultural', ARRAY['literature','modernism','novel','ireland','stream of consciousness'], 0.75, 'France', 'French Third Republic', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'James Joyce''s Ulysses, published in Paris by Sylvia Beach, chronicles a single day in Dublin through radical narrative techniques including stream of consciousness. It is widely considered the greatest novel of the 20th century.', 'Ulysses_(novel)', 'seed-enrichment', 'approved'),

('ts-eliot-waste-land', 'T.S. Eliot Publishes The Waste Land', '1922-10-01', '1922-12-31', 1922, false, 'cultural', ARRAY['literature','poetry','modernism','england'], 0.7, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-0.1278, 51.5074), 4326), 'T.S. Eliot''s The Waste Land is a landmark modernist poem reflecting post-World War I disillusionment. Its fragmented structure, allusions, and multilingual passages revolutionized English-language poetry.', 'The_Waste_Land', 'seed-enrichment', 'approved'),

('art-deco-movement-peaks', 'Art Deco Movement Peaks', '1925-04-01', '1925-10-31', 1925, false, 'cultural', ARRAY['art','design','architecture','decorative arts','modernism'], 0.6, 'France', 'French Third Republic', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'The Art Deco movement peaked with the 1925 International Exhibition of Modern Decorative and Industrial Arts in Paris. Characterized by geometric forms, bold colors, and luxurious materials, Art Deco shaped architecture, fashion, and design worldwide.', 'Art_Deco', 'seed-enrichment', 'approved'),

('abstract-expressionism-pollock', 'Abstract Expressionism — Jackson Pollock''s Drip Paintings', '1947-01-01', '1950-12-31', 1947, false, 'cultural', ARRAY['art','painting','abstract expressionism','usa','modern art'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-72.1884, 40.9539), 4326), 'Jackson Pollock pioneered drip painting, laying canvases on the floor and pouring paint in rhythmic gestures. Abstract Expressionism, centered in New York, shifted the art world''s capital from Paris to America.', 'Jackson_Pollock', 'seed-enrichment', 'approved'),

('andy-warhol-pop-art', 'Andy Warhol and Pop Art', '1962-07-09', '1962-11-30', 1962, false, 'cultural', ARRAY['art','pop art','usa','consumer culture','modern art'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), 'Andy Warhol''s Campbell''s Soup Cans exhibition launched Pop Art into the mainstream, blurring boundaries between high art and commercial culture. Warhol became the most famous artist of the late 20th century.', 'Andy_Warhol', 'seed-enrichment', 'approved'),

('beatles-sgt-peppers', 'Beatles Release Sgt. Pepper''s Lonely Hearts Club Band', '1967-06-01', '1967-06-01', 1967, false, 'cultural', ARRAY['music','rock','pop','album','cultural revolution','1960s'], 0.75, 'United Kingdom', 'United Kingdom', ST_SetSRID(ST_MakePoint(-2.9916, 53.4084), 4326), 'The Beatles'' Sgt. Pepper''s Lonely Hearts Club Band is widely regarded as the greatest and most influential rock album ever made. It pioneered the concept album format and reflected the counterculture of the 1960s.', 'Sgt._Pepper%27s_Lonely_Hearts_Club_Band', 'seed-enrichment', 'approved'),

('star-wars-blockbuster-cinema', 'Star Wars — Birth of Blockbuster Cinema', '1977-05-25', '1977-05-25', 1977, false, 'cultural', ARRAY['film','cinema','science fiction','blockbuster','usa'], 0.7, 'United States', 'United States', ST_SetSRID(ST_MakePoint(-118.2437, 34.0522), 4326), 'George Lucas''s Star Wars revolutionized filmmaking with groundbreaking special effects, merchandising, and franchise storytelling. It inaugurated the modern blockbuster era and became one of the most influential cultural phenomena of the 20th century.', 'Star_Wars_(film)', 'seed-enrichment', 'approved'),

('www-digital-culture', 'World Wide Web Enables Digital Culture', '1991-08-06', '1991-08-06', 1991, false, 'cultural', ARRAY['technology','internet','digital','world wide web','communication'], 0.8, 'Switzerland', 'Switzerland', ST_SetSRID(ST_MakePoint(6.0536, 46.2338), 4326), 'Tim Berners-Lee launched the first website at CERN, making the World Wide Web publicly available. The Web transformed every aspect of culture — publishing, music, art, education, and social interaction — becoming the dominant medium of the digital age.', 'World_Wide_Web', 'seed-enrichment', 'approved'),

('spotify-music-streaming', 'Spotify Launches — Music Streaming Revolution', '2008-10-07', '2008-10-07', 2008, false, 'cultural', ARRAY['music','technology','streaming','digital','sweden'], 0.6, 'Sweden', 'Sweden', ST_SetSRID(ST_MakePoint(18.0686, 59.3293), 4326), 'Spotify launched in Sweden, pioneering legal music streaming and transforming how people discover and consume music. It disrupted the music industry''s business model and made virtually all recorded music instantly accessible.', 'Spotify', 'seed-enrichment', 'approved')

ON CONFLICT (slug) DO NOTHING;


-- ============================================
-- CAUSALITY LINKS
-- ============================================

-- Helper: insert causality links using slugs
-- Greek philosophy chain: Socrates → Plato → Aristotle
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Socrates'' philosophy directly inspired his student Plato', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'socrates-trial-death' AND e.slug = 'plato-academy-founded'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.9, 'Plato''s Academy trained Aristotle, who developed systematic philosophy', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'plato-academy-founded' AND e.slug = 'aristotle-lyceum-founded'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Homer → Virgil → Dante literary chain
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Homer''s epics directly inspired Virgil''s Aeneid', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'homer-iliad-odyssey-composed' AND e.slug = 'virgil-aeneid-composed'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Virgil''s Aeneid guided Dante''s Divine Comedy (Virgil is the guide)', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'virgil-aeneid-composed' AND e.slug = 'dante-divine-comedy-1308'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Dante → Shakespeare (via literary tradition)
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Dante''s vernacular literary revolution influenced the rise of national literatures including Shakespeare', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'dante-divine-comedy-1308' AND e.slug = 'shakespeare-hamlet-1601'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Gutenberg → wider literacy → novel form
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Gutenberg''s printing press enabled mass production of books, leading to the rise of the novel', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'gutenberg-printing-press' AND e.slug = 'cervantes-don-quixote-1605'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Shakespeare → Milton
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.6, 'Shakespeare''s dramatic verse influenced Milton''s epic poetry', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'shakespeare-hamlet-1601' AND e.slug = 'milton-paradise-lost-1667'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Aristotle → Averroes → Aquinas → Renaissance humanism
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Aristotle''s works were transmitted to medieval Europe through Islamic scholarship (Averroes)', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'aristotle-lyceum-founded' AND e.slug = 'averroes-ibn-rushd-philosophy-1190'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.8, 'Averroes'' Aristotelian commentaries shaped Aquinas and scholasticism', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'averroes-ibn-rushd-philosophy-1190' AND e.slug = 'thomas-aquinas-summa-theologica-1265'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Renaissance → Enlightenment
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Renaissance humanism and rationalism laid groundwork for Enlightenment thought', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.title ILIKE 'Florentine Renaissance%' AND e.title ILIKE '%Enlightenment%Voltaire%'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Kant → Nietzsche
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Nietzsche engaged deeply with and reacted against Kantian philosophy', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'kant-critique-pure-reason' AND e.slug = 'nietzsche-zarathustra'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Impressionism → Cubism → Abstract Expressionism → Pop Art
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.7, 'Impressionism''s break from academic painting opened the door to Cubism''s radical abstraction', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'first-impressionist-exhibition-1874' AND e.slug = 'picasso-cubism-1907'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'contributing', 0.6, 'Cubism''s abstraction paved the way for Abstract Expressionism', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'picasso-cubism-1907' AND e.slug = 'abstract-expressionism-pollock'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'direct', 0.7, 'Pop Art emerged as a reaction to Abstract Expressionism''s elitism', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'abstract-expressionism-pollock' AND e.slug = 'andy-warhol-pop-art'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);

-- Frankenstein → science fiction tradition
INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
SELECT c.id, e.id, 'indirect', 0.5, 'Frankenstein pioneered science fiction, leading to the genre that produced Star Wars', 'seed-enrichment', 'approved'
FROM events c, events e
WHERE c.slug = 'mary-shelley-frankenstein' AND e.slug = 'star-wars-blockbuster-cinema'
AND NOT EXISTS (SELECT 1 FROM causality_links WHERE cause_event_id = c.id AND effect_event_id = e.id);
