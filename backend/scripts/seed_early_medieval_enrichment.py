"""
seed_early_medieval_enrichment.py — Add ~80 curated early medieval events (500–1000 CE)
and ~35 causality links to the Chronicle database.

Follows the same pattern as seed_21st_century.py: slug-based dedup,
title-fragment matching for links, ON CONFLICT DO NOTHING for idempotency.
"""

import asyncio
import asyncpg
import uuid
from datetime import date


DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'
CREATED_BY = 'seed-script:early-medieval-enrichment-v1'


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # BYZANTINE EMPIRE
    # ═══════════════════════════════════════════════════════════════════════
    ("Fall of the Western Roman Empire", 476, "political", "Italy", 41.9028, 12.4964, 0.90, "fall-western-roman-empire-476"),
    ("Clovis I Converts to Christianity", 496, "religious", "France", 49.2583, 2.6417, 0.65, "clovis-converts-christianity-496"),
    ("Justinian I Becomes Byzantine Emperor", 527, "political", "Turkey", 41.0082, 28.9784, 0.75, "justinian-becomes-emperor-527"),
    ("Corpus Juris Civilis — Justinian's Legal Code", 529, "political", "Turkey", 41.0082, 28.9784, 0.80, "corpus-juris-civilis-529"),
    ("Benedict of Nursia Founds Monte Cassino", 529, "religious", "Italy", 41.4907, 13.8132, 0.65, "monte-cassino-founded-529"),
    ("Hagia Sophia Completed in Constantinople", 537, "cultural", "Turkey", 41.0086, 28.9802, 0.80, "hagia-sophia-completed-537"),
    ("Plague of Justinian Devastates Mediterranean", 541, "disaster", "Turkey", 41.0082, 28.9784, 0.85, "plague-of-justinian-541"),
    ("Reconquest of Rome by Belisarius", 536, "war", "Italy", 41.9028, 12.4964, 0.65, "belisarius-reconquers-rome-536"),
    ("Lombard Invasion of Italy", 568, "war", "Italy", 45.4642, 9.1900, 0.60, "lombard-invasion-italy-568"),
    ("Byzantine-Sassanid War of 602–628", 602, "war", "Turkey", 39.9334, 32.8597, 0.65, "byzantine-sassanid-war-602"),
    ("Emperor Heraclius Defeats Sassanid Persia", 628, "war", "Turkey", 41.0082, 28.9784, 0.70, "heraclius-defeats-sassanids-628"),
    ("First Use of Greek Fire by Byzantines", 672, "discovery", "Turkey", 41.0082, 28.9784, 0.60, "greek-fire-first-use-672"),
    ("Second Arab Siege of Constantinople", 717, "war", "Turkey", 41.0082, 28.9784, 0.70, "second-arab-siege-constantinople-717"),
    ("Byzantine Iconoclasm Begins", 726, "religious", "Turkey", 41.0082, 28.9784, 0.65, "byzantine-iconoclasm-begins-726"),
    ("End of Byzantine Iconoclasm — Triumph of Orthodoxy", 843, "religious", "Turkey", 41.0082, 28.9784, 0.55, "end-byzantine-iconoclasm-843"),
    ("Byzantine Reconquest of Crete", 961, "war", "Greece", 35.2401, 24.4709, 0.50, "byzantine-reconquest-crete-961"),

    # ═══════════════════════════════════════════════════════════════════════
    # RISE OF ISLAM
    # ═══════════════════════════════════════════════════════════════════════
    ("Prophet Muhammad's Hijra from Mecca to Medina", 622, "religious", "Saudi Arabia", 24.4672, 39.6112, 0.90, "hijra-mecca-medina-622"),
    ("Battle of Badr — First Major Muslim Victory", 624, "war", "Saudi Arabia", 23.7278, 38.7917, 0.65, "battle-of-badr-624"),
    ("Conquest of Mecca by Muhammad", 630, "war", "Saudi Arabia", 21.4225, 39.8262, 0.75, "conquest-of-mecca-630"),
    ("Death of Prophet Muhammad", 632, "religious", "Saudi Arabia", 24.4672, 39.6112, 0.80, "death-of-muhammad-632"),
    ("Battle of Yarmouk — Arabs Defeat Byzantines", 636, "war", "Jordan", 32.6899, 35.8861, 0.80, "battle-of-yarmouk-636"),
    ("Fall of Jerusalem to the Rashidun Caliphate", 637, "war", "Israel", 31.7683, 35.2137, 0.75, "fall-jerusalem-rashidun-637"),
    ("Muslim Conquest of Persia — Battle of Nahavand", 642, "war", "Iran", 34.1843, 48.3774, 0.75, "muslim-conquest-persia-642"),
    ("Umayyad Caliphate Established — Capital at Damascus", 661, "political", "Syria", 33.5138, 36.2765, 0.80, "umayyad-caliphate-established-661"),
    ("Muslim Conquest of North Africa", 698, "war", "Tunisia", 36.8065, 10.1815, 0.65, "muslim-conquest-north-africa-698"),
    ("Muslim Conquest of Iberian Peninsula", 711, "war", "Spain", 36.1408, -5.3536, 0.75, "muslim-conquest-iberia-711"),
    ("Battle of Tours — Charles Martel Halts Muslim Advance", 732, "war", "France", 46.5802, 0.3404, 0.80, "battle-of-tours-732"),
    ("Abbasid Revolution — Umayyads Overthrown", 750, "political", "Iraq", 33.3152, 44.3661, 0.80, "abbasid-revolution-750"),
    ("Foundation of Baghdad by Abbasids", 762, "political", "Iraq", 33.3152, 44.3661, 0.70, "foundation-of-baghdad-762"),
    ("Al-Khwarizmi Writes Algebra Treatise", 820, "discovery", "Iraq", 33.3152, 44.3661, 0.75, "al-khwarizmi-algebra-820"),
    ("House of Wisdom Flourishes in Baghdad", 830, "cultural", "Iraq", 33.3152, 44.3661, 0.75, "house-of-wisdom-baghdad-830"),
    ("Umayyad Emirate of Córdoba Established", 756, "political", "Spain", 37.8882, -4.7794, 0.60, "umayyad-emirate-cordoba-756"),
    ("Great Mosque of Córdoba Construction Begins", 784, "cultural", "Spain", 37.8789, -4.7794, 0.55, "great-mosque-cordoba-784"),

    # ═══════════════════════════════════════════════════════════════════════
    # TANG DYNASTY CHINA
    # ═══════════════════════════════════════════════════════════════════════
    ("Sui Dynasty Reunifies China", 589, "political", "China", 34.2658, 108.9541, 0.70, "sui-reunifies-china-589"),
    ("Grand Canal of China Completed", 610, "discovery", "China", 34.7472, 113.6249, 0.65, "grand-canal-china-completed-610"),
    ("Li Yuan Founds the Tang Dynasty", 618, "political", "China", 34.2658, 108.9541, 0.80, "tang-dynasty-founded-618"),
    ("Emperor Taizong Expands the Tang Empire", 630, "war", "China", 34.2658, 108.9541, 0.65, "taizong-expands-tang-630"),
    ("Wu Zetian Becomes Empress of China", 690, "political", "China", 34.6312, 112.4540, 0.70, "wu-zetian-empress-690"),
    ("Tang Golden Age of Poetry — Li Bai and Du Fu", 750, "cultural", "China", 34.2658, 108.9541, 0.65, "tang-poetry-golden-age-750"),
    ("An Lushan Rebellion Devastates Tang China", 755, "war", "China", 34.2658, 108.9541, 0.80, "an-lushan-rebellion-755"),
    ("Huang Chao Rebellion — Late Tang Crisis", 880, "war", "China", 34.7472, 113.6249, 0.55, "huang-chao-rebellion-880"),
    ("Fall of the Tang Dynasty", 907, "political", "China", 34.2658, 108.9541, 0.70, "fall-of-tang-dynasty-907"),

    # ═══════════════════════════════════════════════════════════════════════
    # VIKING AGE & NORSE
    # ═══════════════════════════════════════════════════════════════════════
    ("Viking Raid on Lindisfarne — Viking Age Begins", 793, "war", "United Kingdom", 55.6690, -1.7998, 0.80, "lindisfarne-raid-793"),
    ("Viking Siege of Paris", 845, "war", "France", 48.8566, 2.3522, 0.60, "viking-siege-paris-845"),
    ("Vikings Settle Iceland", 874, "political", "Iceland", 64.1466, -21.9426, 0.65, "vikings-settle-iceland-874"),
    ("Alfred the Great Defeats Vikings at Edington", 878, "war", "United Kingdom", 51.2642, -2.1088, 0.65, "alfred-defeats-vikings-edington-878"),
    ("Treaty of Wedmore — Danelaw Established", 878, "political", "United Kingdom", 51.2406, -2.8131, 0.55, "treaty-of-wedmore-danelaw-878"),
    ("Normandy Granted to Viking Leader Rollo", 911, "political", "France", 49.4432, 1.0993, 0.65, "normandy-granted-rollo-911"),
    ("Erik the Red Explores Greenland", 985, "discovery", "Greenland", 61.0, -45.0, 0.60, "erik-red-greenland-985"),
    ("Leif Erikson Reaches North America — Vinland", 1000, "discovery", "Canada", 51.5964, -55.5339, 0.70, "viking-discovery-north-america-1000"),

    # ═══════════════════════════════════════════════════════════════════════
    # CHARLEMAGNE & CAROLINGIANS
    # ═══════════════════════════════════════════════════════════════════════
    ("Charles Martel Unites Frankish Kingdom", 718, "political", "France", 49.2542, 4.0347, 0.60, "charles-martel-unites-franks-718"),
    ("Pepin the Short Founds Carolingian Dynasty", 751, "political", "France", 49.2542, 4.0347, 0.60, "pepin-short-carolingian-dynasty-751"),
    ("Charlemagne Conquers Lombard Kingdom", 774, "war", "Italy", 45.4642, 9.1900, 0.60, "charlemagne-conquers-lombards-774"),
    ("Charlemagne Crowned Holy Roman Emperor", 800, "political", "Italy", 41.9028, 12.4964, 0.85, "charlemagne-coronation-800"),
    ("Carolingian Renaissance — Revival of Learning", 800, "cultural", "France", 49.2127, 2.3523, 0.65, "carolingian-renaissance-800"),
    ("Treaty of Verdun — Division of Carolingian Empire", 843, "political", "France", 49.1613, 5.3825, 0.75, "treaty-of-verdun-843"),
    ("Donation of Pepin — Papal States Created", 756, "political", "Italy", 41.9028, 12.4964, 0.55, "donation-of-pepin-756"),

    # ═══════════════════════════════════════════════════════════════════════
    # SOUTH & SOUTHEAST ASIA
    # ═══════════════════════════════════════════════════════════════════════
    ("Khmer Empire — Angkor Founded by Jayavarman II", 802, "political", "Cambodia", 13.4125, 103.8670, 0.70, "angkor-founded-802"),
    ("Chola Dynasty Naval Expansion in South India", 850, "war", "India", 10.7870, 79.1378, 0.55, "chola-naval-expansion-850"),
    ("Borobudur Temple Completed in Java", 825, "cultural", "Indonesia", -7.6079, 110.2038, 0.60, "borobudur-completed-825"),
    ("Srivijaya Maritime Empire Dominates Southeast Asia", 650, "political", "Indonesia", -2.9909, 104.7566, 0.55, "srivijaya-empire-650"),

    # ═══════════════════════════════════════════════════════════════════════
    # MESOAMERICA & AFRICA
    # ═══════════════════════════════════════════════════════════════════════
    ("Maya Classic Period Collapse", 900, "political", "Guatemala", 17.2215, -89.6237, 0.70, "maya-classic-collapse-900"),
    ("Teotihuacan Decline and Collapse", 550, "political", "Mexico", 19.6925, -98.8431, 0.60, "teotihuacan-collapse-550"),
    ("Kingdom of Ghana — West African Gold Trade", 750, "political", "Mauritania", 17.6013, -11.5303, 0.60, "kingdom-of-ghana-750"),
    ("Kingdom of Aksum Declines", 700, "political", "Ethiopia", 14.1215, 38.7468, 0.50, "aksum-declines-700"),

    # ═══════════════════════════════════════════════════════════════════════
    # JAPAN & KOREA
    # ═══════════════════════════════════════════════════════════════════════
    ("Prince Shōtoku's Reforms in Japan", 604, "political", "Japan", 34.6851, 135.8048, 0.60, "shotoku-reforms-japan-604"),
    ("Taika Reform — Japan Centralizes Government", 645, "political", "Japan", 34.6851, 135.8048, 0.60, "taika-reform-japan-645"),
    ("Nara Period Begins — Japan's First Permanent Capital", 710, "political", "Japan", 34.6851, 135.8048, 0.55, "nara-period-begins-710"),
    ("Heian Period Begins — Kyoto Becomes Japanese Capital", 794, "political", "Japan", 35.0116, 135.7681, 0.60, "heian-period-begins-794"),
    ("Silla Unifies Korean Peninsula", 668, "political", "South Korea", 35.8714, 128.6014, 0.55, "silla-unifies-korea-668"),
    ("Goryeo Dynasty Founded in Korea", 918, "political", "South Korea", 37.9713, 126.5625, 0.50, "goryeo-dynasty-founded-918"),

    # ═══════════════════════════════════════════════════════════════════════
    # TECHNOLOGY, SCIENCE & CULTURE
    # ═══════════════════════════════════════════════════════════════════════
    ("First Woodblock Printing — Diamond Sutra in China", 868, "discovery", "China", 34.2658, 108.9541, 0.70, "diamond-sutra-woodblock-868"),
    ("Compass Use Emerges in Tang China", 850, "discovery", "China", 34.2658, 108.9541, 0.65, "compass-use-china-850"),
    ("Gunpowder Invented in China", 850, "discovery", "China", 34.2658, 108.9541, 0.70, "gunpowder-invented-china-850"),
    ("Paper Manufacturing Spreads to Islamic World", 751, "discovery", "Uzbekistan", 39.6542, 66.9597, 0.60, "paper-spreads-islamic-world-751"),
    ("Gregorian Chant Codified in Europe", 600, "cultural", "Italy", 41.9028, 12.4964, 0.45, "gregorian-chant-codified-600"),

    # ═══════════════════════════════════════════════════════════════════════
    # LATE EARLY MEDIEVAL (900-1000)
    # ═══════════════════════════════════════════════════════════════════════
    ("Otto I Crowned Holy Roman Emperor", 962, "political", "Italy", 41.9028, 12.4964, 0.70, "otto-crowned-emperor-962"),
    ("Battle of Lechfeld — Otto I Defeats Magyars", 955, "war", "Germany", 48.3705, 10.8978, 0.60, "battle-of-lechfeld-955"),
    ("Christianization of Poland under Mieszko I", 966, "religious", "Poland", 52.4064, 16.9252, 0.55, "christianization-poland-966"),
    ("Baptism of Vladimir — Kievan Rus Becomes Christian", 988, "religious", "Ukraine", 50.4501, 30.5234, 0.70, "baptism-of-vladimir-988"),
    ("Hugh Capet Founds Capetian Dynasty in France", 987, "political", "France", 48.8566, 2.3522, 0.60, "hugh-capet-capetian-987"),
    ("Battle of Stiklestad — Christianization of Norway", 1000, "religious", "Norway", 63.7828, 11.5493, 0.45, "christianization-norway-1000"),
]


# ─── Causality Links (~35) ─────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Fall of Rome → new political orders
    ("Fall of the Western Roman", "Clovis I Converts", "contributing", 0.60, "Roman collapse left a power vacuum that Frankish kingdoms filled."),
    ("Fall of the Western Roman", "Justinian I Becomes", "contributing", 0.65, "Fall of the West motivated Justinian's reconquest ambitions."),
    ("Fall of the Western Roman", "Lombard Invasion", "contributing", 0.55, "Roman collapse enabled Germanic migration into Italy."),

    # Justinian chain
    ("Justinian I Becomes", "Corpus Juris Civilis", "direct", 0.95, "Justinian commissioned the compilation of Roman law."),
    ("Justinian I Becomes", "Hagia Sophia", "direct", 0.90, "Justinian ordered the construction of Hagia Sophia."),
    ("Justinian I Becomes", "Reconquest of Rome by Belisarius", "direct", 0.85, "Justinian sent Belisarius to reconquer Italy."),
    ("Plague of Justinian", "Byzantine-Sassanid War", "contributing", 0.55, "The plague weakened Byzantine military capacity for decades."),
    ("Plague of Justinian", "Lombard Invasion", "contributing", 0.50, "Plague-weakened Byzantine Italy was vulnerable to Lombard conquest."),

    # Islamic expansion chain
    ("Prophet Muhammad's Hijra", "Battle of Badr", "direct", 0.85, "The Hijra established the Muslim community that fought at Badr."),
    ("Battle of Badr", "Conquest of Mecca", "direct", 0.75, "Badr was the first major victory leading to eventual conquest of Mecca."),
    ("Death of Prophet Muhammad", "Battle of Yarmouk", "direct", 0.70, "Muhammad's death launched the Rashidun conquests."),
    ("Battle of Yarmouk", "Fall of Jerusalem to the Rashidun", "direct", 0.85, "Yarmouk victory opened Palestine to Muslim conquest."),
    ("Battle of Yarmouk", "Muslim Conquest of Persia", "contributing", 0.65, "Byzantine defeat freed Arab armies to focus on Persia."),
    ("Umayyad Caliphate", "Muslim Conquest of North Africa", "direct", 0.75, "The Umayyads organized the systematic conquest of North Africa."),
    ("Muslim Conquest of North Africa", "Muslim Conquest of Iberian", "direct", 0.85, "North Africa served as the launching point for the invasion of Iberia."),
    ("Muslim Conquest of Iberian", "Battle of Tours", "direct", 0.90, "Muslim expansion into Gaul led directly to the Battle of Tours."),
    ("Abbasid Revolution", "Foundation of Baghdad", "direct", 0.90, "The Abbasids founded Baghdad as their new capital."),
    ("Foundation of Baghdad", "House of Wisdom", "direct", 0.80, "Baghdad became the intellectual center where the House of Wisdom flourished."),
    ("Foundation of Baghdad", "Al-Khwarizmi Writes Algebra", "contributing", 0.70, "Baghdad's scholarly environment nurtured al-Khwarizmi's work."),
    ("House of Wisdom", "Al-Khwarizmi Writes Algebra", "direct", 0.85, "Al-Khwarizmi worked at the House of Wisdom."),

    # Tang China chain
    ("Sui Dynasty Reunifies", "Grand Canal of China", "direct", 0.85, "The Sui dynasty built the Grand Canal to unify the empire."),
    ("Sui Dynasty Reunifies", "Li Yuan Founds the Tang", "contributing", 0.70, "Tang rose from Sui collapse but built on Sui unification."),
    ("An Lushan Rebellion", "Tang Poetry Golden Age", "contributing", 0.40, "The rebellion's devastation inspired Du Fu's greatest poetry."),
    ("An Lushan Rebellion", "Huang Chao Rebellion", "contributing", 0.50, "An Lushan permanently weakened Tang central authority."),
    ("Huang Chao Rebellion", "Fall of the Tang", "direct", 0.80, "Huang Chao destroyed Tang's remaining power base."),

    # Viking chain
    ("Viking Raid on Lindisfarne", "Viking Siege of Paris", "contributing", 0.55, "Lindisfarne success encouraged escalating Viking raids."),
    ("Alfred the Great Defeats Vikings", "Treaty of Wedmore", "direct", 0.90, "Alfred's victory at Edington led directly to the Treaty of Wedmore."),
    ("Vikings Settle Iceland", "Erik the Red Explores Greenland", "direct", 0.80, "Icelandic settlement was the launching point for Greenland exploration."),
    ("Erik the Red Explores Greenland", "Leif Erikson Reaches North America", "direct", 0.85, "Erik's son Leif sailed from Greenland to reach Vinland."),

    # Carolingian chain
    ("Charles Martel Unites", "Battle of Tours", "direct", 0.80, "Charles Martel led the Frankish forces at Tours."),
    ("Battle of Tours", "Pepin the Short", "contributing", 0.60, "Tours victory cemented Carolingian prestige and path to kingship."),
    ("Pepin the Short", "Charlemagne Conquers Lombard", "contributing", 0.65, "Pepin established the Carolingian power Charlemagne expanded."),
    ("Charlemagne Conquers Lombard", "Charlemagne Crowned", "contributing", 0.70, "Italian conquests positioned Charlemagne for imperial coronation."),
    ("Charlemagne Crowned", "Carolingian Renaissance", "direct", 0.85, "Imperial stability enabled Charlemagne's revival of learning."),
    ("Charlemagne Crowned", "Treaty of Verdun", "direct", 0.80, "Charlemagne's empire was divided among his grandsons at Verdun."),

    # Paper → knowledge chain
    ("Paper Manufacturing Spreads", "House of Wisdom", "contributing", 0.55, "Paper availability facilitated the House of Wisdom's scholarship."),
]


async def main():
    """Insert early medieval enrichment events and causality links."""
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
                    $10, $11, 0.7)
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
