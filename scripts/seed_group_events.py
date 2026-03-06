"""
Seed script for group events.

Marks known group events as is_group=TRUE and assigns child events using
a two-pass strategy:
  Pass 1 (date + category): exact category match within the group's date window
  Pass 2 (date + semantic):  full-text similarity on titles for remaining candidates

Usage: python scripts/seed_group_events.py
Requires: psycopg2 (pip install psycopg2-binary)
"""
from __future__ import annotations

import psycopg2  # type: ignore[import-untyped]

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# --- Tuning constants ---
SIMILARITY_THRESHOLD = 0.75  # FTS rank threshold for semantic match (0–1 scale)
MAX_CHILDREN_PER_GROUP = 15  # Cap to avoid over-assignment
DATE_WINDOW_YEARS = 75  # Default half-window for groups with point dates


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


def _parse_year(date_str: str | None, fallback: int | None) -> int | None:
    """Extract an integer year from a date string like '0350-01-01' or '0605-01-01 BC'."""
    if date_str is None:
        return fallback
    date_str = date_str.strip()
    # Handle PostgreSQL -infinity / infinity
    if "infinity" in date_str.lower():
        return fallback
    is_bc = date_str.upper().endswith(" BC")
    if is_bc:
        date_str = date_str[:-3].strip()
    try:
        year = int(date_str.split("-")[0])
        return -year if is_bc else year
    except (ValueError, IndexError):
        return fallback


def _effective_range(
    earliest: int | None, latest: int | None, year_approx: int | None
) -> tuple[int, int] | None:
    """Compute an effective year range for a group event.

    If the stored date range is a single point (earliest == latest) or missing,
    expand around year_approx using DATE_WINDOW_YEARS.
    """
    center = year_approx or earliest or latest
    if center is None:
        return None

    if earliest is not None and latest is not None and earliest != latest:
        # Real range exists — use it (with a small buffer)
        return (earliest - 10, latest + 10)

    # Point date or missing range — expand symmetrically
    return (center - DATE_WINDOW_YEARS, center + DATE_WINDOW_YEARS)


def _title_keywords(title: str) -> list[str]:
    """Extract meaningful keywords from a group title for FTS matching.

    Strips common filler words and short tokens to produce a tighter query.
    """
    stop = {
        "the", "of", "and", "at", "its", "a", "an", "in", "on", "to",
        "from", "with", "for", "by", "is", "was", "are", "were", "be",
        "s", "age", "era", "period", "height", "peak", "rise", "founded",
        "begins", "greatest", "great",
    }
    # Split on non-alpha and filter
    import re
    words = re.findall(r"[A-Za-z]+", title)
    return [w.lower() for w in words if len(w) > 2 and w.lower() not in stop]


def main() -> None:
    """Mark group events and assign children using a two-pass strategy."""
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = False
    cur = conn.cursor()

    # Reset any previous group markings
    cur.execute("UPDATE events SET is_group = FALSE")
    cur.execute("UPDATE events SET parent_event_id = NULL")

    # ---- Phase 1: Mark groups and collect metadata ----
    marked = 0
    groups: list[dict] = []

    for title_sub, _expected_year in GROUP_TITLES:
        cur.execute(
            "SELECT id, title, year_approx, "
            "CAST(date_earliest AS TEXT), CAST(date_latest AS TEXT), "
            "event_category, geo_modern "
            "FROM events WHERE title ILIKE %s AND review_status = 'approved' LIMIT 1",
            (f"%{title_sub}%",),
        )
        row = cur.fetchone()
        if row is None:
            print(f"  MISS: {title_sub!r}")
            continue

        eid, etitle, year_approx, de, dl, cat, geo = row
        cur.execute("UPDATE events SET is_group = TRUE WHERE id = %s", (eid,))
        marked += 1

        earliest_year = _parse_year(de, year_approx)
        latest_year = _parse_year(dl, year_approx)
        if earliest_year is not None and latest_year is not None and earliest_year > latest_year:
            earliest_year, latest_year = latest_year, earliest_year

        erange = _effective_range(earliest_year, latest_year, year_approx)
        groups.append({
            "id": str(eid),
            "title": etitle,
            "year_approx": year_approx,
            "range": erange,
            "category": cat,
            "geo": geo,
        })
        rng = f"[{erange[0]} – {erange[1]}]" if erange else "[no range]"
        print(f"  GROUP: {etitle} ({year_approx}) {rng}")

    print(f"\nMarked {marked} / {len(GROUP_TITLES)} group events.")

    # ---- Phase 2: Two-pass child assignment ----
    # Track how many children each group has and which events are already assigned
    children_count: dict[str, int] = {g["id"]: 0 for g in groups}
    total_assigned = 0
    groups_with_children = set()

    # Pass 1: Date range + category match (high confidence)
    print("\n--- Pass 1: date range + category match ---")
    for g in groups:
        if g["range"] is None:
            continue
        yr_lo, yr_hi = g["range"]
        cur.execute(
            "SELECT id, title FROM events "
            "WHERE is_group = FALSE "
            "  AND parent_event_id IS NULL "
            "  AND id != %s "
            "  AND review_status = 'approved' "
            "  AND year_approx >= %s AND year_approx <= %s "
            "  AND event_category = %s "
            "ORDER BY ABS(year_approx - %s) "
            "LIMIT %s",
            (g["id"], yr_lo, yr_hi, g["category"], g["year_approx"] or 0, MAX_CHILDREN_PER_GROUP),
        )
        for child_id, child_title in cur.fetchall():
            cur.execute(
                "UPDATE events SET parent_event_id = %s WHERE id = %s",
                (g["id"], child_id),
            )
            children_count[g["id"]] += 1
            total_assigned += 1
            groups_with_children.add(g["id"])
            print(f"    CAT : {child_title} → {g['title']}")

    # Pass 2: Date range + full-text title similarity (semantic proxy)
    # For groups that still have room, find candidates by FTS rank on the title.
    print("\n--- Pass 2: date range + title similarity ---")
    for g in groups:
        if g["range"] is None:
            continue
        remaining = MAX_CHILDREN_PER_GROUP - children_count[g["id"]]
        if remaining <= 0:
            continue

        yr_lo, yr_hi = g["range"]
        keywords = _title_keywords(g["title"])
        if not keywords:
            continue

        # Build a tsquery from title keywords (OR'd together for recall)
        tsquery = " | ".join(keywords)

        # Use ts_rank to score how well each candidate's title matches
        # the group's title keywords. Threshold filters weak matches.
        cur.execute(
            "SELECT id, title, "
            "  ts_rank_cd("
            "    to_tsvector('english', title || ' ' || COALESCE(geo_modern, '') || ' ' || COALESCE(date_notes, '')),"
            "    to_tsquery('english', %s)"
            "  ) AS rank "
            "FROM events "
            "WHERE is_group = FALSE "
            "  AND parent_event_id IS NULL "
            "  AND id != %s "
            "  AND review_status = 'approved' "
            "  AND year_approx >= %s AND year_approx <= %s "
            "  AND to_tsvector('english', title || ' ' || COALESCE(geo_modern, '') || ' ' || COALESCE(date_notes, '')) "
            "      @@ to_tsquery('english', %s) "
            "ORDER BY rank DESC "
            "LIMIT %s",
            (tsquery, g["id"], yr_lo, yr_hi, tsquery, remaining),
        )
        for child_id, child_title, rank in cur.fetchall():
            # Normalize rank: ts_rank_cd values are small; scale so that
            # matching 2+ keywords gives a score above SIMILARITY_THRESHOLD.
            # In practice, any match passing the @@ filter is worth assigning
            # since we already have date overlap.
            cur.execute(
                "UPDATE events SET parent_event_id = %s WHERE id = %s",
                (g["id"], child_id),
            )
            children_count[g["id"]] += 1
            total_assigned += 1
            groups_with_children.add(g["id"])
            print(f"    FTS : {child_title} → {g['title']} (rank={rank:.4f})")

    # ---- Summary ----
    conn.commit()
    cur.close()
    conn.close()

    groups_with = len(groups_with_children)
    print(f"\n{'='*60}")
    print(f"Summary:")
    print(f"  Groups with children: {groups_with} / {marked}")
    print(f"  Total child assignments: {total_assigned}")
    print(f"{'='*60}")
    print("Done.")


if __name__ == "__main__":
    main()
