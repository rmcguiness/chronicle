-- Migration: add collections and collection_events tables
-- Run: docker exec -i chronicle-db-1 psql -U chronicle -d chronicle < backend/migrations/add_collections.sql

CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    theme_color TEXT NOT NULL DEFAULT '#6366f1',
    icon_emoji TEXT NOT NULL DEFAULT '📚',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_events (
    id SERIAL PRIMARY KEY,
    collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    event_slug TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(collection_id, event_slug)
);

CREATE INDEX IF NOT EXISTS idx_collection_events_collection ON collection_events(collection_id);

-- ── Seed 8 curated collections ───────────────────────────────────────────────

INSERT INTO collections (slug, title, description, theme_color, icon_emoji) VALUES
('rise-and-fall-of-empires', 'Rise and Fall of Empires', 'From Rome to the British Empire — trace the arc of history''s greatest powers as they rise, dominate, and ultimately fall.', '#dc2626', '🏛️'),
('scientific-revolutions', 'Scientific Revolutions', 'The discoveries that changed how we understand the universe — from Copernicus shattering geocentrism to the decoding of DNA.', '#2563eb', '🔬'),
('wars-that-shaped-the-world', 'Wars That Shaped the World', 'The conflicts that redrew borders, toppled empires, and defined the modern world order.', '#991b1b', '⚔️'),
('explorers-and-discoverers', 'Explorers & Discoverers', 'Bold voyages into the unknown — from Columbus crossing the Atlantic to Apollo 11 landing on the Moon.', '#059669', '🧭'),
('revolutions-that-changed-society', 'Revolutions That Changed Society', 'When people rose up and the old order crumbled — political, industrial, and digital revolutions that reshaped civilization.', '#7c3aed', '✊'),
('ancient-wonders', 'Ancient Wonders', 'The monumental achievements of the ancient world — structures and networks that still inspire awe thousands of years later.', '#d97706', '🏺'),
('plagues-and-pandemics', 'Plagues & Pandemics', 'The invisible enemies that killed more people than wars — from the Black Death to COVID-19.', '#65a30d', '🦠'),
('renaissance-to-enlightenment', 'Renaissance to Enlightenment', 'The intellectual awakening that gave birth to modern thought — art, science, and philosophy from Da Vinci to Voltaire.', '#0891b2', '💡')
ON CONFLICT (slug) DO NOTHING;

-- Helper: insert collection event by collection slug and event slug
-- We use a DO NOTHING to make this idempotent

-- 1. Rise and Fall of Empires
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'rise-and-fall-of-empires') c,
(VALUES
    ('ottoman-empire-founding-1299', 1),
    ('fall-constantinople-1453', 2),
    ('ottoman-peak-suleiman-1520', 3),
    ('habsburg-empire-charles-v', 4),
    ('mughal-empire-peak-akbar', 5),
    ('british-east-india-company-1600', 6),
    ('qing-dynasty-founding', 7),
    ('napoleon-crowned-emperor', 8),
    ('congress-vienna-1815', 9),
    ('berlin-conference-scramble-africa-1884', 10),
    ('ottoman-empire-end-1923', 11),
    ('dissolution-soviet-union-1991', 12)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 2. Scientific Revolutions
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'scientific-revolutions') c,
(VALUES
    ('copernicus-heliocentric-model', 1),
    ('galileo-telescope-observations', 2),
    ('newton-principia-mathematica', 3),
    ('darwin-origin-of-species-1859', 4),
    ('einstein-special-relativity-1905', 5),
    ('fleming-penicillin-1928', 6),
    ('dna-double-helix-watson-crick-1953', 7),
    ('moon-landing-1969', 8),
    ('human-genome-project-2003', 9),
    ('higgs-boson-discovered-2012', 10),
    ('chatgpt-launches-2022', 11)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 3. Wars That Shaped the World
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'wars-that-shaped-the-world') c,
(VALUES
    ('first-crusade-1095', 1),
    ('mongol-conquests-1206-1279', 2),
    ('hundred-years-war-begins', 3),
    ('thirty-years-war', 4),
    ('american-revolution-begins', 5),
    ('napoleon-waterloo-1815', 6),
    ('american-civil-war-1861-1865', 7),
    ('assassination-franz-ferdinand-1914', 8),
    ('germany-invades-poland-1939', 9),
    ('atomic-bombing-hiroshima-nagasaki-1945', 10),
    ('korean-war-1950-1953', 11),
    ('cuban-missile-crisis-1962', 12),
    ('fall-of-berlin-wall-1989', 13)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 4. Explorers & Discoverers
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'explorers-and-discoverers') c,
(VALUES
    ('zheng-he-voyages-1405', 1),
    ('columbus-reaches-americas-1492', 2),
    ('vasco-da-gama-india-1498', 3),
    ('magellan-circumnavigation', 4),
    ('captain-cook-pacific-1768', 5),
    ('darwin-voyage-beagle-1831', 6),
    ('wright-brothers-flight-1903', 7),
    ('lindbergh-transatlantic-flight-1927', 8),
    ('everest-summit-1953', 9),
    ('moon-landing-1969', 10)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 5. Revolutions That Changed Society
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'revolutions-that-changed-society') c,
(VALUES
    ('american-declaration-independence', 1),
    ('french-revolution-1789', 2),
    ('haitian-revolution', 3),
    ('industrial-revolution-steam-engine-1769', 4),
    ('marx-communist-manifesto', 5),
    ('russian-revolution-1917', 6),
    ('chinese-revolution-peoples-republic-1949', 7),
    ('cuban-revolution-1959', 8),
    ('world-wide-web-berners-lee-1991', 9),
    ('iphone-smartphone-revolution-2007', 10),
    ('chatgpt-launches-2022', 11)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 6. Ancient Wonders
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'ancient-wonders') c,
(VALUES
    ('great-zimbabwe-construction', 1),
    ('angkor-wat-construction-1113', 2),
    ('machu-picchu-construction', 3),
    ('ming-great-wall', 4),
    ('construction-of-great-wall-expanded', 5),
    ('forbidden-city-built', 6),
    ('taj-mahal-construction-1632', 7),
    ('taj-mahal-completed', 8)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 7. Plagues & Pandemics
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'plagues-and-pandemics') c,
(VALUES
    ('black-death-1347-1351', 1),
    ('great-plague-london-1665', 2),
    ('jenner-smallpox-vaccination-1796', 3),
    ('spanish-flu-pandemic-1918-1919', 4),
    ('polio-vaccine-salk-1955', 5),
    ('aids-epidemic-1981', 6),
    ('covid-19-pandemic-2020', 7),
    ('covid-vaccines-rollout-2021', 8)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;

-- 8. Renaissance to Enlightenment
INSERT INTO collection_events (collection_id, event_slug, display_order)
SELECT c.id, e.slug, e.ord FROM
(SELECT id FROM collections WHERE slug = 'renaissance-to-enlightenment') c,
(VALUES
    ('gutenberg-printing-press', 1),
    ('leonardo-last-supper-1498', 2),
    ('michelangelo-sistine-chapel-1512', 3),
    ('martin-luther-95-theses', 4),
    ('copernicus-heliocentric-model', 5),
    ('shakespeare-hamlet-1601', 6),
    ('galileo-telescope-observations', 7),
    ('newton-principia-mathematica', 8),
    ('enlightenment-encyclopedie', 9),
    ('voltaire-candide', 10),
    ('rousseau-social-contract', 11)
) AS e(slug, ord)
ON CONFLICT (collection_id, event_slug) DO NOTHING;
