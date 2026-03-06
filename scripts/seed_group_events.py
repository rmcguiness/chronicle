"""
Seed script for group events.

Marks known group events as is_group=TRUE and heuristically assigns
child events based on date range and category overlap.

Usage: python scripts/seed_group_events.py
Requires: psycopg2 (pip install psycopg2-binary)
"""
from __future__ import annotations

import psycopg2  # type: ignore[import-untyped]

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# The 56 known group events — titles as they appear in the DB (no emoji prefix).
# Each tuple: (title_substring, expected_year_approx_or_None)
GROUP_TITLES: list[tuple[str, int | None]] = [
    ("The Great Wall of China", -221),
    ("Opening of the Silk Road", -130),
    ("Bantu Expansion", -1000),
    ("Minoan Civilization Dominates the Aegean", -1700),
    ("Olmec Civilization", -1200),
    ("Library of Alexandria Founded", -300),
    ("Phoenician Maritime Trade Networks", -1000),
    ("Kingdom of Aksum", 350),
    ("Indus Valley Civilization", -2500),
    ("Maya Classic Period", 700),
    ("Shang Dynasty", -1200),
    ("Abbasid Caliphate Founded", 750),
    ("Abbasid Revolution", 750),
    ("Polynesian Navigation", 1000),
    ("Founding of the Roman Republic", -509),
    ("Roman Republic — Founding Institutions", -509),
    ("Rise of the Egyptian New Kingdom", -1550),
    ("Hittite Empire Established", -1600),
    ("Rise of the Parthian Empire", -247),
    ("Kingdom of Benin", 1440),
    ("Teotihuacan", 400),
    ("Baghdad's House of Wisdom", 800),
    ("Sassanid Empire Founded", 224),
    ("Founding of the Han Dynasty", -206),
    ("Han Dynasty — China's Confucian", -100),
    ("Heian Period Japan", 1000),
    ("Parthian Empire at Its Height", -100),
    ("Delhi Sultanate Founded", 1206),
    ("Song Dynasty China", 960),
    ("Axial Age Civilizations", -500),
    ("Cahokia", 1050),
    ("Tang Dynasty", 618),
    ("Assyrian Empire Conquers Mesopotamia", -900),
    ("Ming Dynasty Founded", 1368),
    ("Ptolemaic Kingdom of Egypt", -305),
    ("Seleucid Empire Controls", -312),
    ("Safavid Dynasty", 1501),
    ("Gupta Empire", 350),
    ("Cyrus the Great Founds the Persian Empire", -550),
    ("Pax Romana", -27),
    ("Mongol Conquests", 1206),
    ("Founding of the Maurya Empire", -322),
    ("Maurya Empire at Its Peak", -268),
    ("Islamic Conquests", 632),
    ("Florentine Renaissance", 1450),
    ("Peak of the Transatlantic Slave Trade", 1780),
    ("Transatlantic Slave Trade at Its Brutal Height", 1700),
    ("Cordoba Caliphate", 950),
    ("Umayyad Caliphate Established", 661),
    ("The Enlightenment", 1750),
    ("Neo-Babylonian Empire Under Nebuchadnezzar", -605),
    ("Ottoman Empire at Its Peak", 1520),
    ("Assyrian Empire at Its Height", -668),
    ("Green Revolution in South Asia", 1965),
    ("Alexander the Great's Conquests", -334),
    ("Arab Spring", 2011),
]


def main() -> None:
    """Mark group events and heuristically assign children."""
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    # Reset any previous group markings
    cur.execute("UPDATE events SET is_group = FALSE")
    cur.execute("UPDATE events SET parent_event_id = NULL")

    marked = 0
    group_ids: list[tuple[str, str, int | None, int | None, str | None]] = []

    for title_sub, _expected_year in GROUP_TITLES:
        cur.execute(
            "SELECT id, title, year_approx, "
            "CAST(date_earliest AS TEXT), CAST(date_latest AS TEXT), event_category "
            "FROM events WHERE title ILIKE %s AND review_status = 'approved' LIMIT 1",
            (f"%{title_sub}%",),
        )
        row = cur.fetchone()
        if row is None:
            print(f"  MISS: {title_sub!r}")
            continue

        eid, etitle, year_approx, de, dl, cat = row
        cur.execute("UPDATE events SET is_group = TRUE WHERE id = %s", (eid,))
        marked += 1

        # Extract year range for child assignment
        earliest_year = _parse_year(de, year_approx)
        latest_year = _parse_year(dl, year_approx)
        if earliest_year is not None and latest_year is not None and earliest_year > latest_year:
            earliest_year, latest_year = latest_year, earliest_year

        group_ids.append((str(eid), etitle, earliest_year, latest_year, cat))
        print(f"  GROUP: {etitle} ({year_approx}) [{earliest_year} – {latest_year}]")

    print(f"\nMarked {marked} / {len(GROUP_TITLES)} group events.")

    # Heuristic child assignment
    assigned = 0
    for gid, gtitle, g_earliest, g_latest, g_cat in group_ids:
        if g_earliest is None or g_latest is None:
            continue
        # Look for non-group, non-assigned events within the date range and same category
        cur.execute(
            "SELECT id, title FROM events "
            "WHERE is_group = FALSE "
            "  AND parent_event_id IS NULL "
            "  AND id != %s "
            "  AND review_status = 'approved' "
            "  AND year_approx >= %s AND year_approx <= %s "
            "  AND event_category = %s",
            (gid, g_earliest, g_latest, g_cat),
        )
        children = cur.fetchall()
        for child_id, child_title in children:
            cur.execute(
                "UPDATE events SET parent_event_id = %s WHERE id = %s",
                (gid, child_id),
            )
            assigned += 1
            print(f"    CHILD: {child_title} → {gtitle}")

    print(f"\nAssigned {assigned} child events total.")

    conn.commit()
    cur.close()
    conn.close()
    print("Done.")


def _parse_year(date_str: str | None, fallback: int | None) -> int | None:
    """Extract an integer year from a date string like '0350-01-01' or '0605-01-01 BC'."""
    if date_str is None:
        return fallback
    date_str = date_str.strip()
    is_bc = date_str.upper().endswith(" BC")
    if is_bc:
        date_str = date_str[:-3].strip()
    try:
        year = int(date_str.split("-")[0])
        return -year if is_bc else year
    except (ValueError, IndexError):
        return fallback


if __name__ == "__main__":
    main()
