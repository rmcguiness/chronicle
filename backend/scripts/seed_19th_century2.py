#!/usr/bin/env python3
"""
seed_19th_century2.py — Add ~80 curated events filling 1800-1950 gaps.
Focus: Latin America, Africa, Asia, WWI, Interwar, Science & Tech, Culture.

Run:
    python backend/scripts/seed_19th_century2.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import uuid
from datetime import date

import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
CREATED_BY = "seed-script:19th-century2-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, geo_era_label, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # LATIN AMERICA — INDEPENDENCE & REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    ("Simón Bolívar's Admirable Campaign", 1813, "war",
     "Venezuela", "Latin American Independence",
     10.49, -66.88, 0.75, "bolivar-admirable-campaign-1813"),

    ("Battle of Ayacucho — South American Independence Secured", 1824, "war",
     "Ayacucho, Peru", "Latin American Independence",
     -13.16, -74.22, 0.80, "battle-ayacucho-1824"),

    ("Bolívar Liberates Bolivia", 1825, "political",
     "Sucre, Bolivia", "Latin American Independence",
     -19.05, -65.26, 0.70, "bolivar-liberates-bolivia-1825"),

    ("Mexican-American War Begins", 1846, "war",
     "Texas, USA / Mexico", "19th Century Americas",
     29.43, -98.49, 0.70, "mexican-american-war-1846"),

    ("Treaty of Guadalupe Hidalgo — Mexico Cedes Territory", 1848, "political",
     "Mexico City, Mexico", "19th Century Americas",
     19.43, -99.13, 0.75, "treaty-guadalupe-hidalgo-1848"),

    ("Maximilian of Mexico — French Imperial Adventure", 1864, "political",
     "Mexico City, Mexico", "Second Mexican Empire",
     19.43, -99.13, 0.60, "maximilian-mexico-1864"),

    ("Mexican Revolution Begins", 1910, "war",
     "Mexico City, Mexico", "Mexican Revolution",
     19.43, -99.13, 0.80, "mexican-revolution-1910"),

    ("Panama Canal Opens", 1914, "discovery",
     "Panama City, Panama", "20th Century Americas",
     9.10, -79.40, 0.80, "panama-canal-opens-1914"),

    ("Brazilian Independence from Portugal", 1822, "political",
     "Rio de Janeiro, Brazil", "Latin American Independence",
     -22.91, -43.17, 0.70, "brazilian-independence-1822"),

    ("Abolition of Slavery in Brazil", 1888, "political",
     "Rio de Janeiro, Brazil", "19th Century Brazil",
     -22.91, -43.17, 0.70, "abolition-slavery-brazil-1888"),

    # ═══════════════════════════════════════════════════════════════════════
    # AFRICA — KINGDOMS, COLONIALISM & RESISTANCE
    # ═══════════════════════════════════════════════════════════════════════
    ("Shaka Zulu Builds the Zulu Kingdom", 1818, "political",
     "KwaZulu-Natal, South Africa", "Zulu Kingdom",
     -28.53, 30.90, 0.70, "shaka-zulu-kingdom-1818"),

    ("Mfecane — Southern African Upheaval", 1820, "war",
     "Southern Africa", "Mfecane Period",
     -29.12, 26.21, 0.60, "mfecane-southern-africa-1820"),

    ("Berlin Conference — Scramble for Africa", 1884, "political",
     "Berlin, Germany", "Scramble for Africa",
     52.52, 13.41, 0.85, "berlin-conference-africa-partition-1884"),

    ("Battle of Adwa — Ethiopia Defeats Italy", 1896, "war",
     "Adwa, Ethiopia", "Scramble for Africa",
     14.17, 38.90, 0.80, "battle-adwa-ethiopia-1896"),

    ("Second Boer War Begins", 1899, "war",
     "South Africa", "Boer Wars",
     -33.93, 18.42, 0.70, "second-boer-war-1899"),

    ("Mahdist War — Fall of Khartoum", 1885, "war",
     "Khartoum, Sudan", "Colonial Africa",
     15.50, 32.56, 0.60, "mahdist-war-khartoum-1885"),

    # ═══════════════════════════════════════════════════════════════════════
    # ASIA — MODERNIZATION & CONFLICT
    # ═══════════════════════════════════════════════════════════════════════
    ("Meiji Restoration — Japan Modernizes", 1868, "political",
     "Tokyo, Japan", "Meiji Japan",
     35.68, 139.77, 0.90, "meiji-restoration-1868"),

    ("First Sino-Japanese War", 1894, "war",
     "Korea / China", "Late Qing Dynasty",
     37.57, 126.98, 0.70, "first-sino-japanese-war-1894"),

    ("Boxer Rebellion in China", 1900, "war",
     "Beijing, China", "Late Qing Dynasty",
     39.91, 116.39, 0.70, "boxer-rebellion-1900"),

    ("Russo-Japanese War — Japan Defeats Russia", 1905, "war",
     "Tsushima Strait, Japan", "Meiji Japan",
     34.60, 129.45, 0.80, "russo-japanese-war-1905"),

    ("Republic of China Established — End of Imperial China", 1912, "political",
     "Nanjing, China", "Republican China",
     32.06, 118.80, 0.85, "republic-of-china-1912"),

    ("Chinese Civil War Begins — KMT vs Communists", 1927, "war",
     "Shanghai, China", "Republican China",
     31.23, 121.47, 0.80, "chinese-civil-war-begins-1927"),

    ("Indian Rebellion of 1857 — Sepoy Mutiny", 1857, "war",
     "Delhi, India", "British India",
     28.61, 77.23, 0.75, "indian-rebellion-1857"),

    ("Gandhi's Salt March — Indian Civil Disobedience", 1930, "political",
     "Dandi, India", "British India",
     20.92, 72.83, 0.80, "gandhi-salt-march-1930"),

    ("Opium Wars — China Forced Open to Trade", 1839, "war",
     "Guangzhou, China", "Late Qing Dynasty",
     23.13, 113.26, 0.75, "opium-wars-1839"),

    ("Treaty of Nanking — Hong Kong Ceded to Britain", 1842, "political",
     "Nanjing, China", "Late Qing Dynasty",
     32.06, 118.80, 0.70, "treaty-nanking-1842"),

    # ═══════════════════════════════════════════════════════════════════════
    # WORLD WAR I ERA
    # ═══════════════════════════════════════════════════════════════════════
    ("Assassination of Archduke Franz Ferdinand", 1914, "war",
     "Sarajevo, Bosnia", "World War I",
     43.86, 18.41, 0.95, "assassination-franz-ferdinand-1914"),

    ("Battle of the Somme", 1916, "war",
     "Somme, France", "World War I",
     49.93, 2.73, 0.85, "battle-of-the-somme-1916"),

    ("Battle of Verdun", 1916, "war",
     "Verdun, France", "World War I",
     49.16, 5.39, 0.80, "battle-of-verdun-1916"),

    ("Zimmermann Telegram — US Entry into WWI", 1917, "political",
     "Washington, D.C., USA", "World War I",
     38.91, -77.04, 0.75, "zimmermann-telegram-1917"),

    ("Russian Revolution — October Revolution", 1917, "political",
     "Petrograd, Russia", "Russian Revolution",
     59.93, 30.32, 0.95, "russian-october-revolution-1917"),

    ("Treaty of Versailles", 1919, "political",
     "Versailles, France", "Post-WWI",
     48.80, 2.12, 0.90, "treaty-of-versailles-1919"),

    ("League of Nations Founded", 1920, "political",
     "Geneva, Switzerland", "Post-WWI",
     46.20, 6.14, 0.75, "league-of-nations-1920"),

    ("Gallipoli Campaign — Ottoman Defense", 1915, "war",
     "Gallipoli, Turkey", "World War I",
     40.38, 26.39, 0.70, "gallipoli-campaign-1915"),

    ("Armenian Genocide", 1915, "political",
     "Ottoman Empire / Turkey", "World War I",
     39.92, 43.05, 0.85, "armenian-genocide-1915"),

    # ═══════════════════════════════════════════════════════════════════════
    # INTERWAR PERIOD
    # ═══════════════════════════════════════════════════════════════════════
    ("Great Depression — Wall Street Crash", 1929, "political",
     "New York, USA", "Great Depression",
     40.71, -74.01, 0.90, "great-depression-1929"),

    ("Stalin's Forced Collectivization", 1929, "political",
     "Moscow, Soviet Union", "Stalinist USSR",
     55.76, 37.62, 0.80, "stalin-collectivization-1929"),

    ("Holodomor — Ukrainian Famine", 1932, "political",
     "Kyiv, Ukraine", "Stalinist USSR",
     50.45, 30.52, 0.80, "holodomor-ukraine-1932"),

    ("Hitler Becomes Chancellor of Germany", 1933, "political",
     "Berlin, Germany", "Nazi Germany",
     52.52, 13.41, 0.90, "hitler-chancellor-1933"),

    ("Spanish Civil War Begins", 1936, "war",
     "Madrid, Spain", "Spanish Civil War",
     40.42, -3.70, 0.75, "spanish-civil-war-1936"),

    ("Munich Agreement — Appeasement of Hitler", 1938, "political",
     "Munich, Germany", "Pre-WWII",
     48.14, 11.58, 0.80, "munich-agreement-1938"),

    ("Kristallnacht — Night of Broken Glass", 1938, "political",
     "Germany", "Nazi Germany",
     52.52, 13.41, 0.80, "kristallnacht-1938"),

    ("Mussolini's March on Rome — Fascism Takes Power", 1922, "political",
     "Rome, Italy", "Interwar Italy",
     41.90, 12.50, 0.75, "mussolini-march-on-rome-1922"),

    ("Japanese Invasion of Manchuria", 1931, "war",
     "Manchuria, China", "Shōwa Japan",
     41.80, 123.43, 0.75, "japanese-invasion-manchuria-1931"),

    # ═══════════════════════════════════════════════════════════════════════
    # SCIENCE & TECHNOLOGY
    # ═══════════════════════════════════════════════════════════════════════
    ("Darwin Publishes On the Origin of Species", 1859, "discovery",
     "London, England", "Victorian Science",
     51.51, -0.13, 0.95, "darwin-origin-of-species-1859"),

    ("Mendel Publishes Laws of Genetic Inheritance", 1866, "discovery",
     "Brno, Czech Republic", "Victorian Science",
     49.19, 16.61, 0.80, "mendel-genetics-1866"),

    ("Pasteur's Germ Theory of Disease", 1861, "discovery",
     "Paris, France", "Victorian Science",
     48.86, 2.35, 0.85, "pasteur-germ-theory-1861"),

    ("Edison Demonstrates the Incandescent Lightbulb", 1879, "discovery",
     "Menlo Park, New Jersey, USA", "Second Industrial Revolution",
     40.57, -74.37, 0.80, "edison-lightbulb-1879"),

    ("Wright Brothers' First Powered Flight", 1903, "discovery",
     "Kitty Hawk, North Carolina, USA", "Early 20th Century",
     36.02, -75.67, 0.90, "wright-brothers-flight-1903"),

    ("Einstein Publishes Special Relativity", 1905, "discovery",
     "Bern, Switzerland", "Modern Physics",
     46.95, 7.45, 0.95, "einstein-special-relativity-1905"),

    ("Alexander Fleming Discovers Penicillin", 1928, "discovery",
     "London, England", "Modern Medicine",
     51.51, -0.13, 0.85, "fleming-penicillin-1928"),

    ("Hubble Proves Galaxies Exist Beyond the Milky Way", 1924, "discovery",
     "Pasadena, California, USA", "Modern Astronomy",
     34.15, -118.14, 0.80, "hubble-galaxies-1924"),

    ("Marie Curie Discovers Radium", 1898, "discovery",
     "Paris, France", "Modern Physics",
     48.86, 2.35, 0.80, "marie-curie-radium-1898"),

    ("Röntgen Discovers X-Rays", 1895, "discovery",
     "Würzburg, Germany", "Modern Physics",
     49.79, 9.95, 0.75, "rontgen-x-rays-1895"),

    ("Marconi Sends First Transatlantic Radio Signal", 1901, "discovery",
     "Cornwall, England / Newfoundland", "Early 20th Century",
     50.07, -5.64, 0.70, "marconi-transatlantic-radio-1901"),

    ("Nikola Tesla and AC Power Revolution", 1893, "discovery",
     "Chicago, Illinois, USA", "Second Industrial Revolution",
     41.88, -87.63, 0.70, "tesla-ac-power-1893"),

    # ═══════════════════════════════════════════════════════════════════════
    # CULTURE & IDEAS
    # ═══════════════════════════════════════════════════════════════════════
    ("First Impressionist Exhibition — Art Revolution", 1874, "cultural",
     "Paris, France", "Impressionism",
     48.86, 2.35, 0.75, "first-impressionist-exhibition-1874"),

    ("Picasso and Braque Pioneer Cubism", 1907, "cultural",
     "Paris, France", "Modern Art",
     48.86, 2.35, 0.70, "picasso-cubism-1907"),

    ("Freud Publishes The Interpretation of Dreams", 1900, "cultural",
     "Vienna, Austria", "Modern Psychology",
     48.21, 16.37, 0.75, "freud-interpretation-dreams-1900"),

    ("Harlem Renaissance — African American Cultural Flowering", 1920, "cultural",
     "New York, USA", "Harlem Renaissance",
     40.81, -73.95, 0.70, "harlem-renaissance-1920"),

    ("Women's Suffrage in the United Kingdom", 1918, "political",
     "London, England", "Women's Suffrage Movement",
     51.51, -0.13, 0.75, "uk-womens-suffrage-1918"),

    ("19th Amendment — Women's Suffrage in the USA", 1920, "political",
     "Washington, D.C., USA", "Women's Suffrage Movement",
     38.91, -77.04, 0.75, "us-womens-suffrage-1920"),

    ("Abolition of Slavery in the British Empire", 1833, "political",
     "London, England", "Abolition Movement",
     51.51, -0.13, 0.80, "abolition-slavery-british-empire-1833"),

    ("Communist Manifesto Published", 1848, "cultural",
     "London, England", "19th Century Political Thought",
     51.51, -0.13, 0.85, "communist-manifesto-1848"),

    ("First Geneva Convention — Laws of War", 1864, "political",
     "Geneva, Switzerland", "International Law",
     46.20, 6.14, 0.65, "first-geneva-convention-1864"),

    # ═══════════════════════════════════════════════════════════════════════
    # ADDITIONAL 1800-1950 GAP FILLERS
    # ═══════════════════════════════════════════════════════════════════════
    ("Congress of Vienna — Post-Napoleonic Order", 1815, "political",
     "Vienna, Austria", "Post-Napoleonic Europe",
     48.21, 16.37, 0.80, "congress-of-vienna-1815"),

    ("Greek War of Independence", 1821, "war",
     "Peloponnese, Greece", "Greek Independence",
     37.50, 22.37, 0.70, "greek-war-independence-1821"),

    ("Revolutions of 1848 Sweep Europe", 1848, "political",
     "Paris, France", "1848 Revolutions",
     48.86, 2.35, 0.75, "revolutions-of-1848"),

    ("Suez Canal Opens", 1869, "discovery",
     "Suez, Egypt", "19th Century Infrastructure",
     30.00, 32.58, 0.80, "suez-canal-opens-1869"),

    ("Unification of Italy", 1861, "political",
     "Turin, Italy", "Italian Unification",
     45.07, 7.69, 0.80, "unification-of-italy-1861"),

    ("Unification of Germany Under Bismarck", 1871, "political",
     "Versailles, France", "German Unification",
     48.80, 2.12, 0.85, "unification-of-germany-1871"),

    ("Balfour Declaration — Support for Jewish Homeland", 1917, "political",
     "London, England", "World War I",
     51.51, -0.13, 0.70, "balfour-declaration-1917"),

    ("Turkish War of Independence — Atatürk", 1919, "war",
     "Ankara, Turkey", "Post-Ottoman",
     39.93, 32.85, 0.75, "turkish-independence-ataturk-1919"),

    ("Partition of the Ottoman Empire", 1920, "political",
     "Sèvres, France", "Post-WWI Middle East",
     48.82, 2.21, 0.70, "partition-ottoman-empire-1920"),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Latin America chains
    ("Bolívar's Admirable Campaign", "Battle of Ayacucho",
     "contributing", 0.65, "Bolívar's campaigns built momentum for South American liberation."),
    ("Battle of Ayacucho", "Bolívar Liberates Bolivia",
     "direct", 0.80, "Ayacucho secured independence, enabling Bolivia's liberation."),
    ("Mexican-American War", "Treaty of Guadalupe Hidalgo",
     "direct", 0.90, "Mexico's defeat forced cession of vast territories."),
    ("Maximilian of Mexico", "Mexican Revolution",
     "contributing", 0.40, "Foreign intervention fueled Mexican nationalist resentment."),

    # Africa chains
    ("Shaka Zulu Builds the Zulu", "Mfecane — Southern African",
     "direct", 0.80, "Zulu expansion triggered the Mfecane upheaval."),
    ("Berlin Conference — Scramble", "Battle of Adwa",
     "direct", 0.70, "Italian colonialism from the Scramble provoked Ethiopian resistance."),
    ("Berlin Conference — Scramble", "Second Boer War",
     "contributing", 0.55, "Colonial rivalry intensified British-Boer conflicts."),

    # Asia chains
    ("Meiji Restoration", "First Sino-Japanese War",
     "direct", 0.75, "Japan's modernization enabled military expansion."),
    ("First Sino-Japanese War", "Boxer Rebellion",
     "contributing", 0.55, "China's humiliation fueled anti-foreign sentiment."),
    ("Meiji Restoration", "Russo-Japanese War",
     "contributing", 0.70, "Meiji modernization made Japan a military power."),
    ("Russo-Japanese War", "Russian Revolution",
     "contributing", 0.55, "Russia's defeat in 1905 weakened the Tsarist regime."),
    ("Boxer Rebellion", "Republic of China Established",
     "contributing", 0.55, "Qing humiliation accelerated revolutionary sentiment."),
    ("Republic of China Established", "Chinese Civil War Begins",
     "direct", 0.70, "Republican instability led to KMT-Communist conflict."),
    ("Opium Wars", "Treaty of Nanking",
     "direct", 0.90, "British victory forced China to sign the treaty."),
    ("Indian Rebellion of 1857", "Gandhi's Salt March",
     "contributing", 0.45, "The 1857 rebellion was a precursor to Indian independence."),

    # WWI chains
    ("Assassination of Archduke Franz Ferdinand", "Battle of the Somme",
     "contributing", 0.65, "The assassination triggered WWI and its devastating battles."),
    ("Assassination of Archduke Franz Ferdinand", "Gallipoli Campaign",
     "contributing", 0.55, "WWI spread to the Ottoman front at Gallipoli."),
    ("Assassination of Archduke Franz Ferdinand", "Armenian Genocide",
     "contributing", 0.50, "WWI conditions enabled the Armenian Genocide."),
    ("Zimmermann Telegram", "Treaty of Versailles",
     "contributing", 0.55, "US entry into WWI ensured Allied victory and the peace terms."),
    ("Battle of the Somme", "Treaty of Versailles",
     "contributing", 0.50, "The Somme's devastation shaped the punitive peace."),
    ("Treaty of Versailles", "League of Nations",
     "direct", 0.85, "The League was established by the Versailles Treaty."),
    ("Russian October Revolution", "Stalin's Forced Collectivization",
     "direct", 0.75, "Bolshevik power enabled Stalin's policies."),
    ("Gallipoli Campaign", "Turkish War of Independence",
     "contributing", 0.55, "Gallipoli forged Turkish national identity and Atatürk's leadership."),
    ("Treaty of Versailles", "Partition of the Ottoman Empire",
     "contributing", 0.65, "Post-war treaties reshaped the Middle East."),

    # Interwar chains
    ("Great Depression", "Hitler Becomes Chancellor",
     "direct", 0.80, "Economic devastation propelled Nazi electoral success."),
    ("Hitler Becomes Chancellor", "Munich Agreement",
     "direct", 0.80, "Hitler's aggression forced the appeasement crisis."),
    ("Hitler Becomes Chancellor", "Kristallnacht",
     "direct", 0.85, "Nazi ideology led to anti-Jewish violence."),
    ("Munich Agreement", "Spanish Civil War",
     "contributing", 0.40, "European appeasement emboldened fascist movements."),
    ("Treaty of Versailles", "Hitler Becomes Chancellor",
     "contributing", 0.70, "Versailles resentment fueled Nazi rise."),
    ("Treaty of Versailles", "Great Depression",
     "contributing", 0.45, "War reparations destabilized the global economy."),
    ("Stalin's Forced Collectivization", "Holodomor",
     "direct", 0.90, "Collectivization policies caused the Ukrainian famine."),
    ("Mussolini's March on Rome", "Hitler Becomes Chancellor",
     "contributing", 0.50, "Italian fascism inspired the Nazi movement."),
    ("Japanese Invasion of Manchuria", "Chinese Civil War Begins",
     "contributing", 0.45, "Japanese aggression complicated Chinese internal conflicts."),

    # Science chains
    ("Darwin Publishes On the Origin", "Mendel Publishes Laws",
     "contributing", 0.50, "Darwin's evolution theory complemented Mendel's genetics."),
    ("Pasteur's Germ Theory", "Fleming Discovers Penicillin",
     "contributing", 0.55, "Germ theory laid the foundation for antibacterial research."),
    ("Edison Demonstrates the Incandescent", "Tesla and AC Power",
     "contributing", 0.50, "Edison's DC system spurred Tesla's AC alternative."),
    ("Marie Curie Discovers Radium", "Einstein Publishes Special Relativity",
     "contributing", 0.40, "Radioactivity research contributed to modern physics."),
    ("Röntgen Discovers X-Rays", "Marie Curie Discovers Radium",
     "direct", 0.60, "X-ray discovery inspired Curie's radiation research."),
    ("Wright Brothers' First Powered Flight", "Panama Canal Opens",
     "contributing", 0.30, "Early 20th century engineering achievements were interconnected."),

    # Culture chains
    ("First Impressionist Exhibition", "Picasso and Braque Pioneer Cubism",
     "contributing", 0.55, "Impressionism's break with tradition paved the way for Cubism."),
    ("Communist Manifesto Published", "Russian October Revolution",
     "contributing", 0.70, "Marx's ideas formed the ideological basis for the revolution."),
    ("Abolition of Slavery in the British Empire", "Abolition of Slavery in Brazil",
     "contributing", 0.45, "British abolition pressured other nations to follow."),
    ("Congress of Vienna", "Revolutions of 1848",
     "contributing", 0.60, "Vienna's conservative order provoked liberal backlash."),
    ("Revolutions of 1848", "Unification of Italy",
     "contributing", 0.55, "1848 revolutions awakened Italian nationalism."),
    ("Revolutions of 1848", "Unification of Germany",
     "contributing", 0.55, "1848 revolutions spurred German nationalist movement."),
    ("Unification of Germany", "Berlin Conference — Scramble",
     "contributing", 0.55, "Unified Germany sought colonial expansion."),
    ("Women's Suffrage in the United Kingdom", "19th Amendment — Women's Suffrage",
     "contributing", 0.50, "UK suffrage success inspired the American movement."),
    ("Suez Canal Opens", "Berlin Conference — Scramble",
     "contributing", 0.45, "The Suez Canal intensified European interest in Africa."),
]


async def main():
    """Insert 19th-20th century enrichment events and causality links."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events ──
    rows = await conn.fetch("SELECT id, slug, title FROM events")
    slugs_existing = {r["slug"] for r in rows}
    events_by_title: dict[str, str] = {r["title"]: str(r["id"]) for r in rows}
    event_count_before = len(rows)

    link_rows = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, category, geo, geo_era, lat, lng, importance, slug in NEW_EVENTS:
        if slug in slugs_existing:
            print(f"  SKIP (exists): {slug}")
            continue

        event_id = str(uuid.uuid4())
        d_earliest = date(year, 1, 1)
        d_latest = date(year, 12, 31)
        wkt = f"SRID=4326;POINT({lng} {lat})"
        content_hash = sha256_str(json.dumps({"slug": slug, "year": year}, sort_keys=True))

        try:
            await conn.execute("""
                INSERT INTO events (
                    id, slug, title, date_earliest, date_latest, year_approx, is_bce,
                    geo_point, geo_modern, geo_era_label,
                    importance_score, zoom_min, event_category,
                    review_status, created_by, content_hash
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, false,
                    ST_GeomFromEWKT($7), $8, $9,
                    $10, $11, $12,
                    'approved', $13, $14
                )
            """, event_id, slug, title, d_earliest, d_latest, year,
                wkt, geo, geo_era,
                importance, 2, category,
                CREATED_BY, content_hash)
            events_by_title[title] = event_id
            slugs_existing.add(slug)
            events_inserted += 1
        except Exception as e:
            print(f"  ERROR inserting {slug}: {e}")

    print(f"Inserted {events_inserted} new events")

    # ── Helper: find event ID by title substring ──
    def find_event(fragment):
        matches = [(t, eid) for t, eid in events_by_title.items() if fragment in t]
        if not matches:
            return None
        matches.sort(key=lambda x: len(x[0]))
        return matches[0][1]

    # ── Insert causality links ──
    links_inserted = 0
    links_skipped = 0
    links_not_found = 0

    for cause_frag, effect_frag, link_type, strength, description in NEW_LINKS:
        cause_id = find_event(cause_frag)
        effect_id = find_event(effect_frag)

        if not cause_id or not effect_id:
            if not cause_id:
                print(f"  NOT FOUND cause: '{cause_frag}'")
            if not effect_id:
                print(f"  NOT FOUND effect: '{effect_frag}'")
            links_not_found += 1
            continue

        if cause_id == effect_id:
            links_skipped += 1
            continue

        if (cause_id, effect_id) in existing_links:
            links_skipped += 1
            continue

        link_id = str(uuid.uuid4())
        try:
            await conn.execute("""
                INSERT INTO causality_links (id, cause_event_id, effect_event_id, link_type,
                                           strength, description, created_by, review_status)
                VALUES ($1, $2::uuid, $3::uuid, $4, $5, $6, $7, 'approved')
                ON CONFLICT (cause_event_id, effect_event_id) DO NOTHING
            """, link_id, cause_id, effect_id, link_type, strength, description, CREATED_BY)
            existing_links.add((cause_id, effect_id))
            links_inserted += 1
        except Exception as e:
            print(f"  ERROR link '{cause_frag}' -> '{effect_frag}': {e}")
            links_skipped += 1

    print(f"Inserted {links_inserted} new links (skipped {links_skipped}, not found {links_not_found})")

    # ── Verify totals ──
    total_period = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1800 AND 1950")
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n1800-1950 events: {total_period}")
    print(f"Total events: {total_events}, total links: {total_links}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
