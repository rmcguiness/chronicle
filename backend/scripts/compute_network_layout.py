"""
compute_network_layout.py — Recompute network_y positions for all events.

Assigns a Y position based on event_category and importance_score to spread
events vertically in the network/canvas view. Events in the same category
cluster together, with importance determining position within the band.
"""

import asyncio
import asyncpg

DB_URL = 'postgresql://chronicle:chronicle@localhost:5433/chronicle'

# Category → base Y band (0.0 to 1.0 range, spread across categories)
CATEGORY_BANDS = {
    'war':        0.10,
    'political':  0.25,
    'religious':  0.40,
    'cultural':   0.55,
    'discovery':  0.70,
    'disaster':   0.85,
    'natural':    0.85,
}
DEFAULT_BAND = 0.50
BAND_WIDTH = 0.12  # jitter within each band


async def main():
    conn = await asyncpg.connect(DB_URL)

    rows = await conn.fetch(
        'SELECT id, event_category, importance_score, year_approx FROM events'
    )
    print(f"Computing network_y for {len(rows)} events...")

    # Track positions per year-band to add small offsets for overlapping events
    updated = 0
    for row in rows:
        cat = row['event_category'] or 'political'
        importance = row['importance_score'] or 0.5

        base_y = CATEGORY_BANDS.get(cat, DEFAULT_BAND)
        # Use importance to offset within band: higher importance → closer to band center
        offset = (importance - 0.5) * BAND_WIDTH
        network_y = base_y + offset

        # Clamp to [0, 1]
        network_y = max(0.0, min(1.0, network_y))

        await conn.execute(
            'UPDATE events SET network_y = $1 WHERE id = $2',
            network_y, row['id']
        )
        updated += 1

    print(f"Updated network_y for {updated} events.")
    await conn.close()


if __name__ == '__main__':
    asyncio.run(main())
