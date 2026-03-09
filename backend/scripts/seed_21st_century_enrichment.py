"""
seed_21st_century_enrichment.py — Add ~60 curated 21st-century events (2000–2025)
and ~25 causality links to the Chronicle database.

Complements seed_21st_century.py with events not already covered.
Follows the same pattern: slug-based dedup, title-fragment matching for links,
ON CONFLICT DO NOTHING for idempotency.
"""

import asyncio
import asyncpg
import uuid
from datetime import date


DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'
CREATED_BY = 'seed-script:21st-century-enrichment-v1'


# ─── New Events (~60) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # 2000–2005
    # ═══════════════════════════════════════════════════════════════════════
    ("September 11 Attacks on the United States", 2001, "war", "United States", 40.7115, -74.0134, 0.95, "september-11-attacks-2001"),
    ("Dot-com Bubble Bursts — Tech Stock Crash", 2000, "political", "United States", 37.7749, -122.4194, 0.70, "dotcom-bubble-bursts-2000"),
    ("Human Genome Project Completed", 2003, "discovery", "United States", 38.9072, -77.0369, 0.75, "human-genome-project-completed-2003"),
    ("US Invasion of Iraq — Second Gulf War", 2003, "war", "Iraq", 33.3152, 44.3661, 0.85, "us-invasion-iraq-2003"),
    ("Spain Train Bombings — Madrid Attacks", 2004, "war", "Spain", 40.4168, -3.7038, 0.60, "madrid-train-bombings-2004"),
    ("London 7/7 Bombings", 2005, "war", "United Kingdom", 51.5074, -0.1278, 0.60, "london-77-bombings-2005"),
    ("Darfur Genocide Escalates", 2003, "war", "Sudan", 13.4549, 24.0878, 0.70, "darfur-genocide-2003"),
    ("Facebook Founded — Social Networking Era", 2004, "cultural", "United States", 37.4849, -122.1483, 0.70, "facebook-founded-2004"),
    ("Google IPO — Search Giant Goes Public", 2004, "political", "United States", 37.4220, -122.0841, 0.55, "google-ipo-2004"),

    # ═══════════════════════════════════════════════════════════════════════
    # 2005–2010
    # ═══════════════════════════════════════════════════════════════════════
    ("iPhone Launched — Smartphone Revolution", 2007, "discovery", "United States", 37.3318, -122.0312, 0.80, "iphone-launched-2007"),
    ("Global Financial Crisis — Great Recession", 2008, "political", "United States", 40.7128, -74.0060, 0.85, "global-financial-crisis-2008"),
    ("Sichuan Earthquake — China's Deadliest Modern Quake", 2008, "disaster", "China", 31.0, 103.4, 0.60, "sichuan-earthquake-2008"),
    ("Mumbai Terror Attacks — 26/11", 2008, "war", "India", 18.9220, 72.8347, 0.65, "mumbai-terror-attacks-2008"),
    ("H1N1 Swine Flu Pandemic", 2009, "disaster", "Mexico", 19.4326, -99.1332, 0.55, "h1n1-swine-flu-2009"),
    ("Copenhagen Climate Summit — COP15", 2009, "political", "Denmark", 55.6761, 12.5683, 0.50, "copenhagen-climate-summit-2009"),
    ("Deepwater Horizon Oil Spill — Gulf of Mexico", 2010, "disaster", "United States", 28.7367, -88.3658, 0.65, "deepwater-horizon-spill-2010"),

    # ═══════════════════════════════════════════════════════════════════════
    # 2011–2015
    # ═══════════════════════════════════════════════════════════════════════
    ("NATO Intervention in Libya — Fall of Gaddafi", 2011, "war", "Libya", 32.9024, 13.1800, 0.70, "libya-nato-intervention-2011"),
    ("Occupy Wall Street Movement", 2011, "political", "United States", 40.7075, -74.0113, 0.60, "occupy-wall-street-2011"),
    ("Higgs Boson Discovered at CERN", 2012, "discovery", "Switzerland", 46.2338, 6.0564, 0.75, "higgs-boson-discovered-2012"),
    ("CRISPR Gene Editing First Demonstrated", 2013, "discovery", "United States", 37.8719, -122.2585, 0.75, "crispr-gene-editing-2013"),
    ("Euromaidan Revolution in Ukraine", 2014, "political", "Ukraine", 50.4501, 30.5234, 0.65, "euromaidan-revolution-2014"),
    ("Malaysia Airlines MH370 Disappears", 2014, "disaster", "Malaysia", 3.1390, 101.6869, 0.55, "mh370-disappears-2014"),
    ("Paris Climate Agreement — COP21", 2015, "political", "France", 48.8566, 2.3522, 0.75, "paris-climate-agreement-2015"),
    ("Gravitational Waves Detected by LIGO", 2015, "discovery", "United States", 30.5627, -90.7742, 0.70, "gravitational-waves-ligo-2015"),
    ("Syrian Refugee Crisis Peak — Alan Kurdi Photo", 2015, "disaster", "Turkey", 36.8688, 30.6436, 0.60, "syrian-refugee-crisis-peak-2015"),

    # ═══════════════════════════════════════════════════════════════════════
    # 2016–2020
    # ═══════════════════════════════════════════════════════════════════════
    ("AlphaGo Defeats World Go Champion", 2016, "discovery", "South Korea", 37.5665, 126.9780, 0.60, "alphago-defeats-go-champion-2016"),
    ("Rohingya Genocide in Myanmar", 2017, "war", "Myanmar", 20.5937, 92.2683, 0.65, "rohingya-genocide-2017"),
    ("Greta Thunberg Climate Strikes Begin", 2018, "political", "Sweden", 59.3293, 18.0686, 0.55, "greta-thunberg-climate-strikes-2018"),
    ("First Image of a Black Hole — M87*", 2019, "discovery", "United States", 42.3736, -71.1097, 0.60, "first-black-hole-image-2019"),
    ("Australian Bushfire Crisis", 2019, "disaster", "Australia", -33.8688, 151.2093, 0.55, "australian-bushfires-2019"),
    ("COVID-19 Declared Global Pandemic by WHO", 2020, "disaster", "Switzerland", 46.2044, 6.1432, 0.90, "covid-19-pandemic-declared-2020"),
    ("Black Lives Matter Global Protests", 2020, "political", "United States", 38.9072, -77.0369, 0.70, "blm-global-protests-2020"),
    ("Abraham Accords — Israel-UAE-Bahrain Peace", 2020, "political", "United States", 38.9072, -77.0369, 0.60, "abraham-accords-2020"),
    ("Nagorno-Karabakh War — Azerbaijan-Armenia Conflict", 2020, "war", "Azerbaijan", 39.8266, 46.7636, 0.55, "nagorno-karabakh-war-2020"),

    # ═══════════════════════════════════════════════════════════════════════
    # 2021–2023
    # ═══════════════════════════════════════════════════════════════════════
    ("Fall of Kabul — Taliban Retakes Afghanistan", 2021, "war", "Afghanistan", 34.5553, 69.2075, 0.75, "fall-of-kabul-taliban-2021"),
    ("Tigray War in Ethiopia", 2021, "war", "Ethiopia", 13.4967, 39.4753, 0.60, "tigray-war-ethiopia-2021"),
    ("Russia Invades Ukraine — Full-Scale War", 2022, "war", "Ukraine", 50.4501, 30.5234, 0.90, "russia-invades-ukraine-2022"),
    ("James Webb Space Telescope First Images", 2022, "discovery", "United States", 38.9072, -77.0369, 0.70, "james-webb-telescope-images-2022"),
    ("Roe v. Wade Overturned — Dobbs Decision", 2022, "political", "United States", 38.9072, -77.0369, 0.70, "roe-v-wade-overturned-2022"),
    ("Sri Lanka Economic Crisis and Protests", 2022, "political", "Sri Lanka", 6.9271, 79.8612, 0.50, "sri-lanka-crisis-2022"),
    ("Morocco Earthquake", 2023, "disaster", "Morocco", 31.0731, -8.3965, 0.50, "morocco-earthquake-2023"),
    ("Chandrayaan-3 — India Lands on Moon's South Pole", 2023, "discovery", "India", 13.0670, 80.2370, 0.60, "chandrayaan-3-moon-landing-2023"),
    ("OpenAI Leadership Crisis — Altman Fired and Rehired", 2023, "cultural", "United States", 37.7749, -122.4194, 0.50, "openai-leadership-crisis-2023"),

    # ═══════════════════════════════════════════════════════════════════════
    # 2024–2025
    # ═══════════════════════════════════════════════════════════════════════
    ("Francis Scott Key Bridge Collapse in Baltimore", 2024, "disaster", "United States", 39.2183, -76.5298, 0.45, "key-bridge-collapse-2024"),
    ("CrowdStrike Global IT Outage", 2024, "disaster", "United States", 32.8975, -97.0403, 0.50, "crowdstrike-outage-2024"),
    ("Bird Flu H5N1 Spreads to Dairy Cattle", 2024, "disaster", "United States", 38.9072, -77.0369, 0.45, "h5n1-bird-flu-dairy-2024"),
    ("Syrian Civil War Ends — Assad Regime Falls", 2024, "war", "Syria", 33.5138, 36.2765, 0.70, "syrian-assad-falls-2024"),
    ("South Korea Martial Law Crisis", 2024, "political", "South Korea", 37.5665, 126.9780, 0.55, "south-korea-martial-law-2024"),
    ("Trump Tariffs — Global Trade War Escalates", 2025, "political", "United States", 38.9072, -77.0369, 0.65, "trump-tariffs-trade-war-2025"),
    ("DeepSeek R1 — Chinese AI Breakthrough", 2025, "discovery", "China", 39.9042, 116.4074, 0.60, "deepseek-r1-ai-2025"),
    ("LA Wildfires — Palisades and Eaton Fires", 2025, "disaster", "United States", 34.0522, -118.2437, 0.55, "la-wildfires-2025"),
    ("Gaza Ceasefire and Hostage Deal", 2025, "war", "Israel", 31.5, 34.47, 0.60, "gaza-ceasefire-2025"),
    ("Europe Rearmament — Defense Spending Surge", 2025, "political", "Belgium", 50.8503, 4.3517, 0.55, "europe-rearmament-2025"),
]


# ─── Causality Links (~25) ─────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # 9/11 chain
    ("September 11 Attacks", "US Invasion of Iraq", "contributing", 0.70, "9/11 War on Terror mindset enabled the case for invading Iraq."),
    ("September 11 Attacks", "London 7/7", "contributing", 0.50, "Post-9/11 UK involvement in Iraq made London a target."),
    ("September 11 Attacks", "Madrid Train Bombings", "contributing", 0.50, "Spain's Iraq War support motivated the Madrid attacks."),
    ("US Invasion of Iraq", "Darfur Genocide", "indirect", 0.30, "Iraq War diverted international attention from Darfur."),

    # Financial crisis → political chain
    ("Global Financial Crisis", "Occupy Wall Street", "direct", 0.85, "Wall Street bailouts while Main Street suffered sparked Occupy."),
    ("Lehman Brothers", "Global Financial Crisis", "direct", 0.90, "Lehman's collapse triggered the global financial meltdown."),
    ("Dot-com Bubble", "Facebook Founded", "contributing", 0.40, "Post-dot-com recovery created space for new social media startups."),

    # Arab Spring chain
    ("Arab Spring Spreads", "NATO Intervention in Libya", "direct", 0.85, "Arab Spring protests in Libya escalated into NATO intervention."),
    ("Arab Spring Spreads", "Syrian Civil War", "direct", 0.80, "Arab Spring protests in Syria sparked the civil war."),

    # Ukraine chain
    ("Euromaidan Revolution", "Russia Annexes Crimea", "direct", 0.90, "Russia annexed Crimea in response to Euromaidan."),
    ("Russia Annexes Crimea", "Russia Invades Ukraine", "direct", 0.85, "Crimea annexation was a precursor to full-scale invasion."),
    ("Russia Invades Ukraine", "Europe Rearmament", "direct", 0.85, "Russia's invasion triggered European defense spending surge."),

    # COVID chain
    ("COVID-19 First Cases", "COVID-19 Declared Global Pandemic", "direct", 0.95, "Wuhan cases escalated into the declared pandemic."),
    ("COVID-19 Declared Global Pandemic", "COVID-19 Vaccines Rollout", "direct", 0.95, "Pandemic necessitated emergency vaccine development."),
    ("COVID-19 Declared Global Pandemic", "Black Lives Matter Global", "contributing", 0.40, "Lockdown frustrations amplified protest response to police killings."),
    ("Human Genome Project", "CRISPR Gene Editing", "contributing", 0.55, "Genomic knowledge underpinned CRISPR development."),

    # Tech chain
    ("iPhone Launched", "Facebook Founded", "contributing", 0.35, "Mobile internet accelerated social media adoption."),
    ("AlphaGo Defeats", "ChatGPT Launches", "contributing", 0.50, "AlphaGo demonstrated deep learning potential that led to LLMs."),
    ("ChatGPT Launches", "DeepSeek R1", "contributing", 0.65, "ChatGPT's success motivated Chinese AI competitors."),
    ("ChatGPT Launches", "OpenAI Leadership Crisis", "direct", 0.75, "ChatGPT's explosive growth created internal tensions at OpenAI."),

    # Israel-Hamas chain
    ("Israel-Hamas War", "Gaza Conflict Escalation", "direct", 0.95, "October 7 attack led to the Gaza military campaign."),
    ("Gaza Conflict Escalation", "Gaza Ceasefire", "direct", 0.90, "Escalation eventually led to ceasefire negotiations."),

    # Climate chain
    ("Paris Climate Agreement", "Greta Thunberg Climate Strikes", "contributing", 0.50, "Perceived inadequacy of Paris Agreement fueled youth climate activism."),
    ("Fukushima Nuclear Disaster", "Paris Climate Agreement", "contributing", 0.40, "Fukushima shifted energy debates that influenced climate negotiations."),

    # Syria endgame
    ("Syrian Civil War Escalates", "Syrian Civil War Ends", "direct", 0.85, "Years of civil war culminated in the Assad regime's fall."),
]


async def main():
    """Insert 21st-century enrichment events and causality links."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events ──
    rows = await conn.fetch('SELECT id, title FROM events')
    events_by_title = {r['title']: str(r['id']) for r in rows}
    event_count_before = len(rows)

    # ── Load existing links ──
    link_rows = await conn.fetch('SELECT cause_event_id, effect_event_id FROM causality_links')
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, category, geo, lat, lng, importance, slug in NEW_EVENTS:
        existing = await conn.fetchval("SELECT id FROM events WHERE slug = $1", slug)
        if existing:
            print(f"  SKIP event (exists): {title}")
            continue

        event_id = str(uuid.uuid4())
        d_earliest = date(year, 1, 1)
        d_latest = date(year, 12, 31)
        wkt = f"SRID=4326;POINT({lng} {lat})"

        await conn.execute("""
            INSERT INTO events (id, slug, title, year_approx, is_bce, event_category,
                              geo_modern, geo_point, importance_score,
                              review_status, created_by, version,
                              date_earliest, date_latest, date_confidence)
            VALUES ($1, $2, $3, $4, false, $5,
                    $6, ST_GeomFromEWKT($7), $8,
                    'approved', $9, 1,
                    $10, $11, 0.8)
        """, event_id, slug, title, year, category,
            geo, wkt, importance,
            CREATED_BY, d_earliest, d_latest)

        events_by_title[title] = event_id
        events_inserted += 1

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
            print(f"  SELF-LINK skipped: '{cause_frag}' -> '{effect_frag}'")
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
    total_events = await conn.fetchval('SELECT COUNT(*) FROM events')
    total_links = await conn.fetchval('SELECT COUNT(*) FROM causality_links')
    print(f"\nFinal totals: {total_events} events, {total_links} links")
    print(f"Added: {total_events - event_count_before} events, {total_links - link_count_before} links")

    await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
