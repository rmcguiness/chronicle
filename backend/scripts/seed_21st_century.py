"""
seed_21st_century.py — Add ~70 curated 21st-century events (2000–2025)
and ~30 causality links to the Chronicle database.

Follows the same pattern as enrich_causality.py: slug-based dedup,
title-fragment matching for links, ON CONFLICT DO NOTHING for idempotency.
"""

import asyncio
import asyncpg
import uuid
from datetime import date


DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'
CREATED_BY = 'seed-script:21st-century-v1'


# ─── New Events (~70) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # 2000s
    ("US Invades Afghanistan — War on Terror Begins", 2001, "war", "Afghanistan", 34.5553, 69.2075, 0.85, "us-invades-afghanistan-2001"),
    ("Wikipedia Launches — The Free Encyclopedia", 2001, "cultural", "United States", 37.7749, -122.4194, 0.65, "wikipedia-launches-2001"),
    ("Euro Coins and Notes Enter Circulation", 2002, "political", "Belgium", 50.8503, 4.3517, 0.70, "euro-circulation-2002"),
    ("Indian Ocean Tsunami — Deadliest Natural Disaster of the Century", 2004, "disaster", "Indonesia", 3.3162, 95.8544, 0.85, "indian-ocean-tsunami-2004"),
    ("EU Enlargement — 10 New Members Join", 2004, "political", "Belgium", 50.8503, 4.3517, 0.65, "eu-enlargement-2004"),
    ("Hurricane Katrina Devastates New Orleans", 2005, "disaster", "United States", 29.9511, -90.0715, 0.75, "hurricane-katrina-2005"),
    ("YouTube Founded — Video Sharing Revolution", 2005, "cultural", "United States", 37.4030, -122.0326, 0.65, "youtube-founded-2005"),
    ("Twitter Founded — Microblogging Era Begins", 2006, "cultural", "United States", 37.7749, -122.4194, 0.60, "twitter-founded-2006"),
    ("Beijing Olympics — China's Coming-Out Party", 2008, "cultural", "China", 39.9042, 116.4074, 0.60, "beijing-olympics-2008"),
    ("Barack Obama Elected First Black US President", 2008, "political", "United States", 38.9072, -77.0369, 0.80, "obama-elected-2008"),
    ("Lehman Brothers Collapse — Financial Meltdown", 2008, "political", "United States", 40.7580, -73.9855, 0.80, "lehman-brothers-collapse-2008"),
    ("Bitcoin Genesis Block Mined — Cryptocurrency Born", 2009, "discovery", "Global", 0.0, 0.0, 0.70, "bitcoin-genesis-block-2009"),
    ("Iran Green Revolution — Arab Spring Precursor", 2009, "political", "Iran", 35.6892, 51.3890, 0.60, "iran-green-revolution-2009"),

    # 2010s
    ("Haiti Earthquake — Caribbean Catastrophe", 2010, "disaster", "Haiti", 18.5944, -72.3074, 0.70, "haiti-earthquake-2010"),
    ("Arab Spring Begins in Tunisia — Jasmine Revolution", 2010, "political", "Tunisia", 36.8065, 10.1815, 0.80, "arab-spring-tunisia-2010"),
    ("Arab Spring Spreads — Egypt, Libya, Syria", 2011, "political", "Egypt", 30.0444, 31.2357, 0.80, "arab-spring-spreads-2011"),
    ("Osama bin Laden Killed in Abbottabad", 2011, "war", "Pakistan", 34.1688, 73.2215, 0.75, "bin-laden-killed-2011"),
    ("Fukushima Nuclear Disaster", 2011, "disaster", "Japan", 37.4211, 141.0328, 0.75, "fukushima-disaster-2011"),
    ("South Sudan Gains Independence", 2011, "political", "South Sudan", 4.8594, 31.5713, 0.60, "south-sudan-independence-2011"),
    ("Syrian Civil War Escalates", 2012, "war", "Syria", 33.5138, 36.2765, 0.80, "syrian-civil-war-escalates-2012"),
    ("Sandy Hook School Shooting", 2012, "political", "United States", 41.4201, -73.2776, 0.60, "sandy-hook-shooting-2012"),
    ("Edward Snowden NSA Revelations", 2013, "political", "United States", 38.9072, -77.0369, 0.70, "snowden-nsa-revelations-2013"),
    ("Russia Annexes Crimea", 2014, "war", "Ukraine", 44.9521, 34.1024, 0.80, "russia-annexes-crimea-2014"),
    ("ISIS Declares Caliphate in Mosul", 2014, "war", "Iraq", 36.3566, 43.1643, 0.80, "isis-declares-caliphate-2014"),
    ("Ebola Outbreak in West Africa", 2014, "disaster", "Liberia", 6.4281, -9.4295, 0.70, "ebola-outbreak-2014"),
    ("Paris Terrorist Attacks — Bataclan and Beyond", 2015, "war", "France", 48.8566, 2.3522, 0.75, "paris-attacks-2015"),
    ("European Migrant and Refugee Crisis Peak", 2015, "political", "Greece", 37.9838, 23.7275, 0.70, "european-migrant-crisis-2015"),
    ("Iran Nuclear Deal — JCPOA Signed", 2015, "political", "Austria", 48.2082, 16.3738, 0.70, "iran-nuclear-deal-jcpoa-2015"),
    ("Brexit Referendum — UK Votes to Leave EU", 2016, "political", "United Kingdom", 51.5074, -0.1278, 0.80, "brexit-referendum-2016"),
    ("Donald Trump Elected US President", 2016, "political", "United States", 38.9072, -77.0369, 0.80, "trump-elected-2016"),
    ("Aleppo Falls to Syrian Government Forces", 2016, "war", "Syria", 36.2021, 37.1343, 0.65, "aleppo-falls-2016"),
    ("#MeToo Movement Goes Global", 2017, "cultural", "United States", 34.0522, -118.2437, 0.70, "metoo-movement-2017"),
    ("Las Vegas Mass Shooting", 2017, "political", "United States", 36.1699, -115.1398, 0.60, "las-vegas-shooting-2017"),
    ("US-China Trade War Begins", 2018, "political", "United States", 38.9072, -77.0369, 0.70, "us-china-trade-war-2018"),
    ("Jamal Khashoggi Assassination in Istanbul", 2018, "political", "Turkey", 41.0082, 28.9784, 0.65, "khashoggi-assassination-2018"),
    ("Hong Kong Protests — Pro-Democracy Movement", 2019, "political", "China", 22.3193, 114.1694, 0.70, "hong-kong-protests-2019"),
    ("Amazon Rainforest Fires — Environmental Alarm", 2019, "disaster", "Brazil", -3.4653, -62.2159, 0.60, "amazon-fires-2019"),
    ("Notre-Dame Cathedral Fire in Paris", 2019, "cultural", "France", 48.8530, 2.3499, 0.60, "notre-dame-fire-2019"),
    ("COVID-19 First Cases Reported in Wuhan", 2019, "disaster", "China", 30.5928, 114.3055, 0.85, "covid-first-cases-wuhan-2019"),

    # 2020s
    ("George Floyd Killing and BLM Protests", 2020, "political", "United States", 44.9778, -93.2650, 0.75, "george-floyd-blm-2020"),
    ("Beirut Port Explosion", 2020, "disaster", "Lebanon", 33.9016, 35.5198, 0.65, "beirut-explosion-2020"),
    ("Joe Biden Wins US Presidential Election", 2020, "political", "United States", 38.9072, -77.0369, 0.70, "biden-elected-2020"),
    ("Myanmar Military Coup", 2021, "political", "Myanmar", 19.7633, 96.0785, 0.65, "myanmar-coup-2021"),
    ("US Capitol Insurrection — January 6", 2021, "political", "United States", 38.8899, -77.0091, 0.80, "us-capitol-insurrection-2021"),
    ("COVID-19 Vaccines Rollout Worldwide", 2021, "discovery", "Global", 51.5074, -0.1278, 0.80, "covid-vaccines-rollout-2021"),
    ("Suez Canal Blocked by Ever Given", 2021, "political", "Egypt", 30.4586, 32.3498, 0.55, "suez-canal-ever-given-2021"),
    ("Queen Elizabeth II Dies at Balmoral", 2022, "political", "United Kingdom", 57.0394, -3.2286, 0.70, "queen-elizabeth-dies-2022"),
    ("Iran Hijab Protests — Mahsa Amini", 2022, "political", "Iran", 35.6892, 51.3890, 0.65, "iran-hijab-protests-2022"),
    ("ChatGPT Launches — AI Goes Mainstream", 2022, "discovery", "United States", 37.7749, -122.4194, 0.75, "chatgpt-launches-2022"),
    ("Israel-Hamas War Begins — October 7 Attack", 2023, "war", "Israel", 31.3547, 34.3088, 0.85, "israel-hamas-war-2023"),
    ("Wagner Group Mutiny in Russia", 2023, "war", "Russia", 47.2357, 39.7015, 0.60, "wagner-mutiny-2023"),
    ("Turkey-Syria Earthquake — Devastating Quake", 2023, "disaster", "Turkey", 37.5742, 36.9370, 0.70, "turkey-syria-earthquake-2023"),
    ("AI Revolution Accelerates — GPT-4, Gemini, Claude", 2024, "discovery", "United States", 37.7749, -122.4194, 0.70, "ai-revolution-accelerates-2024"),
    ("US Presidential Election — Trump Second Term", 2024, "political", "United States", 38.9072, -77.0369, 0.75, "trump-second-term-2024"),
    ("Gaza Conflict Escalation", 2024, "war", "Palestine", 31.5, 34.47, 0.80, "gaza-conflict-escalation-2024"),
    ("AI Agents Proliferate — Agentic AI Era Begins", 2025, "discovery", "United States", 37.7749, -122.4194, 0.65, "agentic-ai-era-2025"),
    ("Global Economic Uncertainty — Tariffs and Oil Shocks", 2025, "political", "Global", 40.7128, -74.0060, 0.60, "global-economic-uncertainty-2025"),
]


# ─── Causality Links (~30) ─────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # 9/11 → Afghanistan → Iraq → ISIS → Syria chain
    ("September 11 Attacks", "US Invades Afghanistan", "direct", 0.95, "9/11 directly triggered the US invasion of Afghanistan."),
    ("US Invades Afghanistan", "US Invasion of Iraq", "contributing", 0.65, "War on Terror mindset from Afghanistan enabled the case for invading Iraq."),
    ("US Invasion of Iraq", "ISIS Declares Caliphate", "direct", 0.80, "Iraq War destabilized the country and created conditions for ISIS to rise."),
    ("ISIS Declares Caliphate", "Syrian Civil War Escalates", "contributing", 0.70, "ISIS expansion into Syria intensified the civil war."),
    ("Arab Spring", "Syrian Civil War", "direct", 0.85, "Syrian Civil War grew directly from Arab Spring protests."),
    ("Syrian Civil War Escalates", "European Migrant", "direct", 0.75, "Syrian war was the primary driver of the European refugee crisis."),
    ("Syrian Civil War Escalates", "Aleppo Falls", "direct", 0.90, "Government forces besieged and captured Aleppo as the war intensified."),
    ("ISIS Declares Caliphate", "Paris Terrorist Attacks", "direct", 0.80, "ISIS-inspired and directed the November 2015 Paris attacks."),

    # Financial crisis → Euro crisis → populism → Brexit + Trump
    ("Global Financial Crisis", "Lehman Brothers", "direct", 0.95, "Lehman's collapse was the defining moment of the financial crisis."),
    ("Lehman Brothers", "Euro Coins and Notes", "indirect", 0.35, "Financial crisis exposed structural weaknesses in the Eurozone."),
    ("Global Financial Crisis", "Arab Spring Begins in Tunisia", "contributing", 0.50, "Economic hardship from the financial crisis fueled discontent in the Arab world."),
    ("Global Financial Crisis", "Brexit Referendum", "contributing", 0.55, "Post-crisis austerity fueled anti-establishment sentiment that drove Brexit."),
    ("Global Financial Crisis", "Trump Elected", "contributing", 0.50, "Economic dislocation from the crisis fueled populist movements."),
    ("European Migrant", "Brexit Referendum", "contributing", 0.60, "Migration crisis intensified anti-EU sentiment in the UK."),
    ("European Migrant", "Trump Elected", "contributing", 0.40, "Global migration concerns amplified nationalist rhetoric."),

    # COVID chain
    ("COVID-19 First Cases", "COVID-19 Pandemic", "direct", 0.95, "Initial Wuhan cases escalated into the global pandemic."),
    ("COVID-19 Pandemic", "COVID-19 Vaccines Rollout", "direct", 0.95, "The pandemic necessitated unprecedented vaccine development."),
    ("Human Genome Project", "COVID-19 Vaccines Rollout", "contributing", 0.55, "Genomic science enabled mRNA vaccine technology."),
    ("COVID-19 Pandemic", "Suez Canal Blocked", "contributing", 0.40, "Pandemic-driven supply chain pressures contributed to shipping disruptions."),
    ("COVID-19 Pandemic", "Global Economic Uncertainty", "contributing", 0.60, "Pandemic aftermath drove inflation, supply shocks, and economic instability."),
    ("COVID-19 Pandemic", "George Floyd", "contributing", 0.40, "Lockdown frustrations amplified social unrest following Floyd's murder."),

    # Technology chain
    ("Social Media Revolution", "Arab Spring Begins in Tunisia", "contributing", 0.60, "Social media enabled organization of Arab Spring protests."),
    ("iPhone", "Social Media Revolution", "direct", 0.70, "Smartphones made social media ubiquitous and mobile."),
    ("Wikipedia Launches", "Social Media Revolution", "contributing", 0.35, "Wikipedia pioneered user-generated content that social media scaled."),
    ("YouTube Founded", "Arab Spring", "contributing", 0.40, "YouTube enabled viral spread of protest footage."),
    ("ChatGPT Launches", "AI Revolution Accelerates", "direct", 0.90, "ChatGPT's success triggered massive AI investment and competition."),
    ("AI Revolution Accelerates", "AI Agents Proliferate", "direct", 0.85, "Foundation model advances enabled the agentic AI era."),

    # Geopolitical
    ("Russia Annexes Crimea", "Russia Invades Ukraine", "direct", 0.80, "Crimea annexation was the precursor to the full-scale invasion."),
    ("September 11 Attacks", "Osama bin Laden Killed", "direct", 0.85, "9/11 launched the decade-long hunt that ended in Abbottabad."),
    ("US Invades Afghanistan", "Fall of Kabul", "direct", 0.90, "The 2001 invasion began the 20-year war that ended with the Taliban's return."),
    ("Biden Wins", "US Capitol Insurrection", "direct", 0.85, "Refusal to accept Biden's election led to the January 6 insurrection."),
    ("Trump Elected US President", "US-China Trade War", "direct", 0.80, "Trump initiated the trade war as a signature policy."),
    ("Fukushima Nuclear Disaster", "Paris Climate Agreement", "contributing", 0.40, "Fukushima intensified debate on energy policy and climate action."),
]


async def main():
    """Insert 21st-century events and causality links into Chronicle."""
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
