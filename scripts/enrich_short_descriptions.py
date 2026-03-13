#!/usr/bin/env python3
"""
Enrich short event descriptions (article_summary) with factually accurate,
historically contextualized summaries.

Run: python scripts/enrich_short_descriptions.py
"""

import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection
DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# Enriched descriptions for events with short article_summary (<100 chars)
ENRICHED_DESCRIPTIONS = {
    # Aristotle Opens the Lyceum / Aristotle Founds the Lyceum (two events, same topic)
    "6bf05d36-ea3f-4f08-ac86-2152704e2dca": (
        "In 335 BCE, Aristotle founded the Lyceum in Athens, one of antiquity's most influential "
        "schools of philosophy. Here he developed his systematic approach to logic, natural science, "
        "and ethics, teaching students while walking the grounds—earning his followers the name "
        "'Peripatetics.' The Lyceum rivaled Plato's Academy and shaped Western thought for millennia."
    ),
    "26fa05dc-6ea6-434d-8dda-48ba1eb81192": (
        "In 335 BCE, Aristotle established the Lyceum in Athens after returning from tutoring Alexander "
        "the Great in Macedonia. The school became a center for systematic research in logic, biology, "
        "physics, and political science. Aristotle's methods of empirical observation and logical analysis "
        "developed here laid the foundations for the scientific method."
    ),

    # Paris Peace Conference
    "f34f1503-6970-4ebf-8f67-dbf7cf29020d": (
        "The 1919 Paris Peace Conference, while reshaping post-WWI Europe, largely ignored Arab demands "
        "for independence promised during the war. Despite Emir Faisal's eloquent appeals, the conference "
        "instead carved the Middle East into European mandates under the Sykes-Picot framework. This betrayal "
        "of wartime promises sowed lasting resentment and instability in the region."
    ),

    # Otto I Crowned Holy Roman Emperor
    "22b95e8c-c0e7-472f-8f1d-4531ca7c193a": (
        "On February 2, 962, Pope John XII crowned Otto I of Germany as Holy Roman Emperor, reviving the "
        "imperial title dormant since Charlemagne's successors. This coronation established the Holy Roman "
        "Empire as a major European power and cemented the alliance between German kings and the papacy that "
        "would shape European politics for eight centuries."
    ),

    # Act of Union — Great Britain Formed
    "6d4039e4-5284-4614-beca-f8af1063543a": (
        "The Acts of Union 1707 merged the Kingdom of England and the Kingdom of Scotland into the unified "
        "Kingdom of Great Britain, creating a single parliament at Westminster. This political union combined "
        "economic markets and military resources, laying the foundation for Britain's rise as a global imperial "
        "power throughout the 18th and 19th centuries."
    ),

    # Spartacus Slave Revolt
    "f2d79bb5-9692-4703-8ea2-d0ba4421e279": (
        "From 73-71 BCE, Spartacus led the largest slave uprising in Roman history, commanding an army that "
        "grew to over 100,000 escaped slaves and defeating multiple Roman legions. The revolt exposed Rome's "
        "dependence on slave labor and military vulnerabilities, leading to brutal repression—6,000 crucifixions "
        "lined the Appian Way—and reforms in how Rome handled slave populations."
    ),

    # Sichuan Earthquake
    "8fde40d1-3f95-4445-b3b2-c64012fcdc59": (
        "On May 12, 2008, a magnitude 7.9 earthquake struck Sichuan province, killing nearly 70,000 people and "
        "leaving millions homeless. The disaster exposed failures in building codes, particularly in schools "
        "where thousands of children died. The earthquake prompted both an unprecedented national relief effort "
        "and controversial questions about construction standards and government accountability."
    ),

    # Megalithic Stone Circles in Senegal
    "af89becd-8032-4893-b2fa-2d8a0bc512d1": (
        "Around 3000-1500 BCE, communities across Senegambia constructed vast complexes of megalithic stone circles, "
        "creating one of the world's largest concentrations of such monuments. These circles, built around burial sites, "
        "demonstrate sophisticated social organization and astronomical knowledge in ancient West Africa, challenging "
        "Eurocentric narratives of prehistoric achievement."
    ),

    # Settlement of East Asia by Modern Humans
    "3bf01489-93b4-4e83-8250-0e26629246f8": (
        "Around 50,000 years ago, anatomically modern humans reached East Asia, as evidenced by fossils like the "
        "Tianyuan man found near Beijing. These early settlers adapted to diverse climates from tropical forests to "
        "northern steppes, eventually developing distinct populations. This migration represents a crucial chapter in "
        "humanity's global dispersal out of Africa."
    ),

    # Panini's Sanskrit Grammar
    "4e550a71-5fd6-4f83-b0af-f2ac1ef4d4c9": (
        "Around 500 BCE, the scholar Panini composed the Ashtadhyayi, a remarkably systematic grammar of Sanskrit "
        "containing nearly 4,000 rules. His work anticipated modern formal linguistics by over two millennia, using "
        "algebraic-like notation to describe language structure. The Ashtadhyayi preserved classical Sanskrit and "
        "influenced generations of Indian philosophical and literary tradition."
    ),

    # Mozart Born
    "60872811-1dce-4ea7-8f38-e3efa181c7a9": (
        "Wolfgang Amadeus Mozart was born in Salzburg on January 27, 1756, emerging as perhaps history's greatest "
        "musical prodigy. A child performer touring Europe's courts by age six, he matured into a composer of "
        "unparalleled range—symphonies, concertos, operas, and sacred works. His 35-year life produced over 600 "
        "compositions that defined the Classical era and continue to shape Western music."
    ),

    # La Venta — Olmec Ceremonial Center
    "68a5894a-21ca-4946-8c83-6ed62514a1b5": (
        "Around 900 BCE, La Venta became the dominant Olmec ceremonial center following San Lorenzo's decline. "
        "The site features Mesoamerica's first known pyramid, massive stone heads depicting rulers, and elaborate "
        "jade offerings. La Venta's religious and political innovations—including the Long Count calendar precursors—"
        "influenced all subsequent Mesoamerican civilizations, from the Maya to the Aztecs."
    ),

    # Vandals Sack Rome
    "bce51e06-5178-4b88-847b-67d35546c217": (
        "In June 455, King Gaiseric led the Vandals from North Africa to sack Rome for two weeks, systematically "
        "stripping the city of treasures including items from Jerusalem's Temple. Unlike the Visigoths' 410 sack, "
        "the Vandals' methodical plunder gave English the word 'vandalism.' This attack demonstrated the Western "
        "Empire's terminal weakness, just 21 years before its final collapse."
    ),

    # First Steam Locomotive
    "ebc449e3-231e-45ac-af26-9e691e6a75c3": (
        "On February 21, 1804, Richard Trevithick's steam locomotive at Penydarren Ironworks in Wales became the "
        "first to haul a load on rails, pulling 10 tons of iron and 70 men over 9 miles. This demonstration proved "
        "steam power could replace horses for heavy transport, launching the railway age that would transform global "
        "commerce, urbanization, and industrialization within decades."
    ),

    # Chandragupta Overthrows the Nanda Dynasty
    "c6c622c8-35f7-4ed6-b353-8f20f9efba10": (
        "Around 322 BCE, Chandragupta Maurya overthrew Dhana Nanda, the last ruler of the Nanda dynasty, founding "
        "the Maurya Empire. Guided by his advisor Chanakya, Chandragupta united most of the Indian subcontinent "
        "for the first time, creating an empire that would reach its zenith under his grandson Ashoka. This marked "
        "India's first great imperial unification."
    ),

    # Pascal and Fermat — Probability Theory
    "0dfc39f7-9ec3-4a81-a41d-9dd1472b9fc7": (
        "In 1654, a correspondence between Blaise Pascal and Pierre de Fermat about gambling problems founded "
        "probability theory as a mathematical discipline. Their analysis of the 'problem of points'—how to fairly "
        "divide stakes in an interrupted game—introduced concepts like expected value. This mathematical framework "
        "now underlies statistics, insurance, economics, and quantum mechanics."
    ),
}


def main():
    """Update events with enriched descriptions."""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    print(f"Updating {len(ENRICHED_DESCRIPTIONS)} events with enriched descriptions...\n")
    
    updated = 0
    for event_id, new_summary in ENRICHED_DESCRIPTIONS.items():
        # Get current state
        cur.execute(
            "SELECT title, LENGTH(article_summary) as old_len FROM events WHERE id = %s",
            (event_id,)
        )
        row = cur.fetchone()
        if not row:
            print(f"⚠️  Event {event_id} not found, skipping")
            continue
        
        # Update
        cur.execute(
            "UPDATE events SET article_summary = %s, updated_at = NOW() WHERE id = %s",
            (new_summary, event_id)
        )
        print(f"✓ {row['title']}")
        print(f"  Old length: {row['old_len']} chars → New length: {len(new_summary)} chars")
        updated += 1
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"\n✅ Updated {updated} events")
    
    # Verify no short descriptions remain
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(
        "SELECT COUNT(*) FROM events WHERE article_summary IS NOT NULL AND LENGTH(article_summary) < 100"
    )
    remaining = cur.fetchone()[0]
    cur.close()
    conn.close()
    
    if remaining == 0:
        print("✅ Verification passed: No events with article_summary < 100 chars")
    else:
        print(f"⚠️  {remaining} events still have short descriptions")
    
    return remaining == 0


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
