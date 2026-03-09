#!/usr/bin/env python3
"""
Chronicle causality links — ~50 key links for 20th century events.

Run:
    python backend/scripts/causality_20th_century.py
"""
from __future__ import annotations

import asyncio
import os

import asyncpg

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://chronicle:chronicle@localhost:5433/chronicle",
)
PG_DSN = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

CREATED_BY = "seed-script:20th-century-causality-v1"


# Format: (cause_title_fragment, effect_title_fragment, link_type, strength, description)
# We match by title ILIKE '%fragment%' to get IDs dynamically.

LINKS = [
    # ── WW1 chain ──
    ("Assassination of Archduke Franz Ferdinand", "Germany Declares War on Russia", "direct", 0.90,
     "The assassination of Franz Ferdinand triggered Austria-Hungary's ultimatum to Serbia and cascading declarations of war."),
    ("Germany Declares War on Russia", "Germany Invades Belgium", "direct", 0.90,
     "Germany's Schlieffen Plan required invading France through Belgium, bringing Britain into the war."),
    ("Gallipoli Campaign", "Easter Rising", "contributing", 0.45,
     "British focus on Gallipoli and wartime discontent in Ireland contributed to the 1916 Easter Rising."),
    ("Easter Rising", "Irish Free State", "direct", 0.80,
     "The British execution of Easter Rising leaders radicalized Irish opinion and led to the War of Independence and the Irish Free State."),
    ("United States Enters World War I", "World War I Armistice", "direct", 0.80,
     "American entry tipped the balance of forces decisively against Germany."),
    ("World War I Armistice", "Treaty of Versailles", "direct", 0.95,
     "The armistice led directly to the Paris Peace Conference and the Treaty of Versailles."),
    ("Spanish Flu Pandemic", "World War I Armistice", "contributing", 0.40,
     "The pandemic weakened armies on all sides and accelerated the push for armistice."),

    # ── Versailles → Interwar ──
    ("Treaty of Versailles", "Weimar Republic Hyperinflation", "direct", 0.80,
     "Versailles reparations crushed the German economy and contributed to hyperinflation."),
    ("Treaty of Versailles", "Beer Hall Putsch", "contributing", 0.60,
     "Resentment over Versailles fueled right-wing extremism and Hitler's early attempts at power."),
    ("Weimar Republic Hyperinflation", "Beer Hall Putsch", "direct", 0.65,
     "Economic crisis provided the backdrop for Hitler's attempted coup in Munich."),
    ("Beer Hall Putsch", "Hitler Appointed Chancellor", "indirect", 0.55,
     "Though the putsch failed, it gave Hitler national attention and a platform for his political career."),
    ("Wall Street Crash", "Great Depression Spreads", "direct", 0.90,
     "The Wall Street crash triggered a global economic contraction."),
    ("Great Depression Spreads", "Hitler Appointed Chancellor", "direct", 0.80,
     "Mass unemployment and economic desperation drove German voters to extremist parties."),
    ("Reichstag Fire", "Hitler Appointed Chancellor", "direct", 0.75,
     "The Reichstag Fire Decree suspended civil liberties and enabled Nazi consolidation of power."),
    ("Hitler Appointed Chancellor", "Nuremberg Laws", "direct", 0.90,
     "Hitler's seizure of power enabled the codification of antisemitic persecution."),
    ("Mussolini's March on Rome", "Hitler Appointed Chancellor", "contributing", 0.50,
     "Mussolini's successful fascist seizure of power inspired and emboldened Hitler."),
    ("Mussolini's March on Rome", "Italy Invades Ethiopia", "direct", 0.75,
     "Fascist ideology drove Italian imperial expansion into Africa."),
    ("Italy Invades Ethiopia", "Munich Agreement", "contributing", 0.45,
     "The League's failure over Ethiopia emboldened Hitler and encouraged appeasement."),

    # ── Manchuria → WWII Pacific ──
    ("Japanese Invasion of Manchuria", "Nanking Massacre", "direct", 0.75,
     "Japanese imperial expansion in China led to the invasion of Nanjing and the massacre."),
    ("Nanking Massacre", "Pearl Harbor", "indirect", 0.45,
     "US opposition to Japanese aggression in China contributed to the oil embargo and eventual attack on Pearl Harbor."),

    # ── WWII chain ──
    ("Munich Agreement", "Germany Invades Poland", "direct", 0.80,
     "The failure of appeasement emboldened Hitler to invade Poland."),
    ("Germany Invades Poland", "Fall of France", "direct", 0.85,
     "Germany's successful blitzkrieg in Poland was followed by the invasion and defeat of France."),
    ("Fall of France", "Dunkirk Evacuation", "direct", 0.90,
     "The rapid German advance trapped Allied forces, necessitating the Dunkirk evacuation."),
    ("Fall of France", "Battle of Britain", "direct", 0.85,
     "After France fell, Hitler turned to Britain, launching the air campaign."),
    ("Battle of Britain", "Operation Barbarossa", "contributing", 0.55,
     "Britain's survival in the air war led Hitler to turn east against the Soviet Union."),
    ("Pearl Harbor", "Battle of Midway", "direct", 0.80,
     "Pearl Harbor brought the US into the Pacific war, leading to the decisive Battle of Midway."),
    ("Battle of Stalingrad", "D-Day", "contributing", 0.55,
     "Soviet victory at Stalingrad weakened Germany and created conditions for the Western Allied invasion."),
    ("D-Day", "Germany Surrenders", "direct", 0.85,
     "The Normandy landings opened a second front that led to Germany's defeat."),
    ("Manhattan Project", "Atomic Bombing of Hiroshima", "direct", 0.95,
     "The Manhattan Project developed the weapons dropped on Hiroshima and Nagasaki."),
    ("Yalta Conference", "Berlin Blockade", "contributing", 0.55,
     "Yalta's division of Europe set the stage for Cold War confrontations over Berlin."),

    # ── Cold War chain ──
    ("Atomic Bombing of Hiroshima", "Soviet Union Tests First Atomic", "direct", 0.80,
     "Hiroshima demonstrated the weapon's power and accelerated the Soviet nuclear program."),
    ("Soviet Union Tests First Atomic", "Hydrogen Bomb", "direct", 0.85,
     "The Soviet bomb ended the US monopoly and escalated to thermonuclear weapons."),
    ("Hydrogen Bomb", "Cuban Missile Crisis", "contributing", 0.60,
     "The nuclear arms race created the context for the most dangerous superpower confrontation."),
    ("NATO Founded", "Warsaw Pact", "direct", 0.85,
     "NATO's creation provoked the Soviet Union to form the Warsaw Pact as a counteralliance."),
    ("Sputnik", "NASA Founded", "direct", 0.90,
     "Sputnik shocked America into creating NASA and intensifying the space race."),
    ("NASA Founded", "Apollo 11", "direct", 0.85,
     "NASA's creation and Kennedy's challenge led to the Apollo 11 moon landing."),
    ("Soviet Union Tests First Atomic", "Cuban Missile Crisis", "indirect", 0.50,
     "Soviet nuclear capability enabled the deployment of missiles in Cuba."),
    ("Cuban Missile Crisis", "Partial Nuclear Test Ban", "direct", 0.75,
     "The near-miss of nuclear war spurred arms control efforts."),
    ("INF Treaty", "Fall of the Berlin Wall", "contributing", 0.45,
     "Arms reduction agreements signaled the easing of Cold War tensions."),

    # ── Decolonization chain ──
    ("Amritsar Massacre", "Gandhi's Salt March", "direct", 0.70,
     "The Amritsar massacre radicalized Indian nationalism and drove the civil disobedience movement."),
    ("Gandhi's Salt March", "Indian Independence", "direct", 0.75,
     "The Salt March galvanized the independence movement and demonstrated the power of nonviolent resistance."),
    ("Indian Independence", "Declaration of the State of Israel", "contributing", 0.40,
     "British withdrawal from India coincided with and influenced the end of the Palestine Mandate."),
    ("Indian Independence", "Year of Africa", "indirect", 0.50,
     "Indian independence inspired African liberation movements."),
    ("Year of Africa", "Bangladesh Liberation", "indirect", 0.35,
     "The wave of decolonization influenced postcolonial national self-determination movements."),

    # ── Civil rights chain ──
    ("Brown v. Board of Education", "Montgomery Bus Boycott", "direct", 0.70,
     "The Supreme Court ruling energized civil rights activism."),
    ("Montgomery Bus Boycott", "Martin Luther King's 'I Have a Dream'", "direct", 0.80,
     "The boycott launched MLK's national leadership."),
    ("Martin Luther King's 'I Have a Dream'", "Civil Rights Act", "direct", 0.85,
     "The March on Washington built momentum for the Civil Rights Act."),
    ("Civil Rights Act", "Assassination of Martin Luther King", "indirect", 0.35,
     "King continued fighting for economic justice after the Civil Rights Act, leading to his presence in Memphis."),

    # ── Vietnam chain ──
    ("Gulf of Tonkin", "US Combat Troops Enter Vietnam", "direct", 0.90,
     "The Tonkin Resolution authorized the escalation to ground combat in Vietnam."),
    ("US Combat Troops Enter Vietnam", "Kent State Massacre", "direct", 0.70,
     "The expansion of the war into Cambodia sparked the protests that led to Kent State."),
    ("Kent State Massacre", "Fall of Saigon", "contributing", 0.40,
     "Domestic opposition, intensified by Kent State, eroded political support for the war."),

    # ── End of Cold War chain ──
    ("Gorbachev Launches Glasnost", "Fall of the Berlin Wall", "direct", 0.85,
     "Gorbachev's reforms and refusal to intervene enabled the fall of the Wall."),
    ("Fall of the Berlin Wall", "German Reunification", "direct", 0.95,
     "The Wall's fall led directly to German unification within a year."),
    ("Gorbachev Launches Glasnost", "Dissolution of the Soviet Union", "direct", 0.85,
     "Glasnost and perestroika unleashed forces that ultimately dissolved the USSR."),
    ("Fall of the Berlin Wall", "Romanian Revolution", "direct", 0.70,
     "The fall of the Wall emboldened democratic movements across Eastern Europe."),
    ("Chernobyl", "Gorbachev Launches Glasnost", "contributing", 0.50,
     "Chernobyl exposed Soviet dysfunction and accelerated Gorbachev's push for openness."),

    # ── 1990s ──
    ("Iraq Invades Kuwait", "Gulf War", "direct", 0.95,
     "The invasion triggered the US-led coalition military response."),
    ("Yugoslav Wars Begin", "Bosnian War", "direct", 0.90,
     "The breakup of Yugoslavia led directly to the Bosnian conflict."),
    ("Bosnian War", "Srebrenica Massacre", "direct", 0.90,
     "The Bosnian War's ethnic cleansing escalated to genocide at Srebrenica."),
    ("Srebrenica Massacre", "NATO Bombing of Yugoslavia", "direct", 0.70,
     "The failure to prevent Srebrenica drove NATO to intervene militarily in Kosovo."),
    ("Oslo Accords", "Good Friday Agreement", "indirect", 0.35,
     "The Oslo peace process inspired confidence that intractable conflicts could be negotiated."),
    ("Dissolution of the Soviet Union", "World Wide Web", "contributing", 0.30,
     "The end of the Cold War shifted resources and attention to technological innovation."),
    ("World Wide Web", "Internet Commercialized", "direct", 0.90,
     "Berners-Lee's invention at CERN became the foundation for the commercial internet."),
]


async def seed_links(conn: asyncpg.Connection) -> None:
    print(f"Starting 20th century causality links — {len(LINKS)} links")
    inserted = 0
    skipped = 0
    failed = 0

    for cause_frag, effect_frag, link_type, strength, description in LINKS:
        # Find cause event
        cause_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{cause_frag}%",
        )
        if not cause_id:
            print(f"  [MISS] cause not found: '{cause_frag}'")
            failed += 1
            continue

        # Find effect event
        effect_id = await conn.fetchval(
            "SELECT id FROM events WHERE title ILIKE $1 LIMIT 1",
            f"%{effect_frag}%",
        )
        if not effect_id:
            print(f"  [MISS] effect not found: '{effect_frag}'")
            failed += 1
            continue

        if cause_id == effect_id:
            print(f"  [SKIP] same event: '{cause_frag}' → '{effect_frag}'")
            skipped += 1
            continue

        # Check for existing link
        existing = await conn.fetchval(
            "SELECT id FROM causality_links WHERE cause_event_id=$1 AND effect_event_id=$2",
            cause_id, effect_id,
        )
        if existing:
            print(f"  [skip] link exists: '{cause_frag}' → '{effect_frag}'")
            skipped += 1
            continue

        await conn.execute(
            """
            INSERT INTO causality_links (cause_event_id, effect_event_id, link_type, strength, description, created_by, review_status)
            VALUES ($1, $2, $3, $4, $5, $6, 'approved')
            """,
            cause_id, effect_id, link_type, strength, description, CREATED_BY,
        )
        inserted += 1
        print(f"  [ok] '{cause_frag}' → '{effect_frag}'")

    total = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\n✅ 20th century causality complete — {inserted} inserted, {skipped} skipped, {failed} not found")
    print(f"   Total causality links in DB: {total}")


async def main() -> None:
    print(f"Connecting to: {PG_DSN}")
    conn = await asyncpg.connect(PG_DSN)
    try:
        await seed_links(conn)
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
