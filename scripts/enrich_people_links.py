#!/usr/bin/env python3
"""
enrich_people_links.py

Bulk-enriches event_people links for historical figures with sparse connections.
Target: every person should have at least 5 event links; prominent figures should have 10+.
Aims to add 300+ new links total.

Matching strategies:
1. Name search in event title/article_summary
2. Year range overlap (person's lifespan ± 20 years)  
3. Region/nationality matching via geo_modern
"""

import asyncio
import asyncpg
from typing import Optional, List, Tuple, Dict, Set
import re

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"

# Role assignment based on person's roles
ROLE_MAPPING = {
    "Emperor": "ruler",
    "Empress": "ruler",
    "King": "ruler",
    "Queen": "ruler",
    "Pharaoh": "ruler",
    "Sultan": "ruler",
    "Caliph": "ruler",
    "Ruler": "ruler",
    "Shogun": "ruler",
    "Philosopher": "philosopher",
    "Writer": "author",
    "Poet": "author",
    "Author": "author",
    "Scientist": "scientist",
    "Mathematician": "mathematician",
    "Astronomer": "astronomer",
    "Physicist": "scientist",
    "Inventor": "inventor",
    "Artist": "artist",
    "Painter": "artist",
    "Composer": "composer",
    "Military Leader": "commander",
    "General": "commander",
    "Admiral": "commander",
    "Warrior": "participant",
    "Samurai": "participant",
    "Conqueror": "conqueror",
    "Explorer": "explorer",
    "Navigator": "explorer",
    "Religious Leader": "religious leader",
    "Prophet": "prophet",
    "Teacher": "teacher",
    "Reformer": "reformer",
    "Activist": "activist",
    "Revolutionary": "participant",
    "Founder": "founder",
}

# Region mapping from nationalities to event geo_modern keywords
REGION_MAPPING = {
    "Egyptian": ["Egypt", "Alexandria"],
    "Greek": ["Greece", "Athens", "Sparta", "Greek"],
    "Roman": ["Rome", "Roman", "Italy"],
    "Persian": ["Persia", "Iran", "Persian"],
    "Chinese": ["China", "Chinese", "Beijing"],
    "Indian": ["India", "Indian", "Delhi"],
    "Japanese": ["Japan", "Japanese", "Tokyo", "Kyoto"],
    "British": ["Britain", "England", "London", "UK"],
    "English": ["England", "London", "Britain"],
    "French": ["France", "French", "Paris"],
    "German": ["Germany", "German", "Berlin", "Prussia"],
    "Russian": ["Russia", "Russian", "Moscow"],
    "American": ["America", "United States", "USA", "American"],
    "Italian": ["Italy", "Italian", "Rome", "Florence", "Venice"],
    "Spanish": ["Spain", "Spanish", "Madrid"],
    "Arab": ["Arab", "Arabia", "Baghdad", "Damascus", "Cairo"],
    "Ottoman": ["Ottoman", "Turkey", "Constantinople", "Istanbul"],
    "Turkish": ["Turkey", "Turkish", "Ottoman"],
    "Byzantine": ["Byzantine", "Constantinople"],
    "Mongolian": ["Mongol", "Mongolia"],
    "Mughal": ["Mughal", "India", "Delhi"],
    "Aztec": ["Aztec", "Mexico", "Tenochtitlan"],
    "Inca": ["Inca", "Peru"],
    "Maya": ["Maya", "Mexico", "Central America"],
    "African": ["Africa"],
    "Ethiopian": ["Ethiopia", "Axum"],
    "Malian": ["Mali", "Timbuktu"],
    "Dutch": ["Netherlands", "Dutch", "Amsterdam"],
    "Portuguese": ["Portugal", "Portuguese", "Lisbon"],
    "Polish": ["Poland", "Polish"],
    "Austrian": ["Austria", "Vienna", "Habsburg"],
    "Celtic": ["Celtic", "Britain", "Gaul"],
    "Carthaginian": ["Carthage", "Tunisia"],
    "Macedonian": ["Macedonia", "Greek"],
    "Assyrian": ["Assyria", "Mesopotamia"],
    "Babylonian": ["Babylon", "Mesopotamia"],
    "Hebrew": ["Israel", "Jerusalem", "Judea"],
    "Jewish": ["Israel", "Jerusalem", "Jewish"],
}


async def get_people_with_links(conn) -> List[Dict]:
    """Get all people with their current link count and metadata."""
    rows = await conn.fetch("""
        SELECT 
            p.id,
            p.name,
            p.aliases,
            p.birth_year,
            p.death_year,
            p.nationalities,
            p.roles,
            COUNT(ep.event_id) as link_count
        FROM people p
        LEFT JOIN event_people ep ON p.id = ep.person_id
        GROUP BY p.id
        ORDER BY link_count ASC
    """)
    return [dict(row) for row in rows]


async def get_existing_links(conn, person_id: str) -> Set[str]:
    """Get event IDs already linked to this person."""
    rows = await conn.fetch(
        "SELECT event_id FROM event_people WHERE person_id = $1",
        person_id
    )
    return {str(row['event_id']) for row in rows}


async def search_events_by_name(conn, name: str, aliases: List[str] = None) -> List[Dict]:
    """Search for events mentioning the person's name or aliases."""
    search_terms = [name]
    if aliases:
        search_terms.extend(aliases)
    
    # Also search for parts of the name (e.g., "Napoleon" from "Napoleon Bonaparte")
    name_parts = name.split()
    for part in name_parts:
        if len(part) > 3 and part not in ["the", "von", "van", "ibn", "bin", "der", "Great"]:
            search_terms.append(part)
    
    events = []
    for term in search_terms:
        # Escape special characters for ILIKE
        escaped = term.replace("%", "\\%").replace("_", "\\_")
        rows = await conn.fetch("""
            SELECT id, title, year_approx, geo_modern, importance_score
            FROM events
            WHERE title ILIKE $1 OR article_summary ILIKE $1
            LIMIT 15
        """, f"%{escaped}%")
        for row in rows:
            events.append(dict(row))
    
    # Deduplicate by event ID
    seen = set()
    unique = []
    for e in events:
        eid = str(e['id'])
        if eid not in seen:
            seen.add(eid)
            unique.append(e)
    
    return unique


async def search_events_by_timeframe(conn, birth_year: int, death_year: int, 
                                      limit: int = 30) -> List[Dict]:
    """Search for events within the person's lifetime ± 20 years."""
    if birth_year is None and death_year is None:
        return []
    
    # Calculate year range
    start_year = (birth_year - 20) if birth_year else (death_year - 100)
    end_year = (death_year + 20) if death_year else (birth_year + 100)
    
    rows = await conn.fetch("""
        SELECT id, title, year_approx, geo_modern, importance_score
        FROM events
        WHERE year_approx IS NOT NULL
          AND year_approx >= $1 
          AND year_approx <= $2
        ORDER BY importance_score DESC
        LIMIT $3
    """, start_year, end_year, limit)
    
    return [dict(row) for row in rows]


async def search_events_by_region(conn, nationalities: List[str], 
                                   birth_year: int = None, death_year: int = None,
                                   limit: int = 20) -> List[Dict]:
    """Search for events in regions matching the person's nationality."""
    if not nationalities:
        return []
    
    regions = []
    for nat in nationalities:
        if nat in REGION_MAPPING:
            regions.extend(REGION_MAPPING[nat])
    
    if not regions:
        return []
    
    # Build the query with region filters
    all_events = []
    for region in regions[:5]:  # Limit to first 5 regions
        escaped = region.replace("%", "\\%").replace("_", "\\_")
        
        query = """
            SELECT id, title, year_approx, geo_modern, importance_score
            FROM events
            WHERE (geo_modern ILIKE $1 OR title ILIKE $1)
        """
        params = [f"%{escaped}%"]
        
        # Add year filter if available
        if birth_year and death_year:
            query += " AND year_approx >= $2 AND year_approx <= $3"
            params.extend([birth_year - 20, death_year + 20])
        
        query += " ORDER BY importance_score DESC LIMIT $" + str(len(params) + 1)
        params.append(limit)
        
        rows = await conn.fetch(query, *params)
        all_events.extend([dict(row) for row in rows])
    
    # Deduplicate
    seen = set()
    unique = []
    for e in all_events:
        eid = str(e['id'])
        if eid not in seen:
            seen.add(eid)
            unique.append(e)
    
    return unique


def determine_role(person_roles: List[str], event_title: str) -> str:
    """Determine the appropriate role for the link."""
    if not person_roles:
        return "contemporary"
    
    # Check if event title suggests a specific role
    title_lower = event_title.lower()
    
    if any(word in title_lower for word in ["war", "battle", "siege", "conquest", "invasion"]):
        if any(r in person_roles for r in ["General", "Military Leader", "Warrior", "Conqueror", "Commander"]):
            return "commander"
        if any(r in person_roles for r in ["Emperor", "King", "Ruler", "Sultan", "Shogun"]):
            return "ruler"
        return "participant"
    
    if any(word in title_lower for word in ["discovery", "invention", "theory"]):
        if any(r in person_roles for r in ["Scientist", "Inventor", "Mathematician", "Astronomer"]):
            return "discoverer"
        return "contributor"
    
    if any(word in title_lower for word in ["founded", "founding", "establishment", "creation"]):
        if any(r in person_roles for r in ["Founder", "Emperor", "King", "Ruler"]):
            return "founder"
        return "participant"
    
    if any(word in title_lower for word in ["treaty", "peace", "agreement"]):
        return "signatory"
    
    if any(word in title_lower for word in ["death", "assassination", "execution"]):
        return "subject"
    
    if any(word in title_lower for word in ["birth", "born"]):
        return "subject"
    
    if any(word in title_lower for word in ["reign", "rule", "coronation", "dynasty"]):
        if any(r in person_roles for r in ["Emperor", "King", "Ruler", "Sultan", "Pharaoh", "Shogun", "Queen", "Empress"]):
            return "ruler"
    
    # Default to person's primary role mapping
    for role in person_roles:
        if role in ROLE_MAPPING:
            return ROLE_MAPPING[role]
    
    return "contemporary"


async def insert_link(conn, person_id: str, event_id: str, role: str) -> bool:
    """Insert an event_people link, avoiding duplicates."""
    try:
        await conn.execute("""
            INSERT INTO event_people (event_id, person_id, role)
            VALUES ($1::uuid, $2::uuid, $3)
            ON CONFLICT (event_id, person_id, role) DO NOTHING
        """, event_id, person_id, role)
        return True
    except Exception as e:
        return False


async def main():
    print("=" * 70)
    print("Chronicle - Enriching Event-People Links")
    print("=" * 70)
    
    conn = await asyncpg.connect(DB_URL)
    
    try:
        # Get initial stats
        initial_count = await conn.fetchval("SELECT COUNT(*) FROM event_people")
        print(f"\nInitial link count: {initial_count}")
        
        # Get all people with link counts
        people = await get_people_with_links(conn)
        print(f"Total people: {len(people)}")
        
        # Process each person
        total_added = 0
        people_enriched = 0
        
        for person in people:
            pid = str(person['id'])
            name = person['name']
            link_count = person['link_count']
            
            # Determine target links
            # Prominence heuristic: if they have detailed metadata, aim higher
            has_dates = person['birth_year'] is not None and person['death_year'] is not None
            has_roles = person['roles'] and len(person['roles']) > 0
            target_links = 8 if (has_dates and has_roles) else 5
            
            needed = target_links - link_count
            if needed <= 0:
                continue
            
            # Get existing links to avoid duplicates
            existing = await get_existing_links(conn, pid)
            
            # Find candidate events
            candidates = []
            
            # Strategy 1: Name search
            name_matches = await search_events_by_name(
                conn, name, person['aliases']
            )
            candidates.extend(name_matches)
            
            # Strategy 2: Timeframe search
            if person['birth_year'] or person['death_year']:
                time_matches = await search_events_by_timeframe(
                    conn, person['birth_year'], person['death_year']
                )
                candidates.extend(time_matches)
            
            # Strategy 3: Region search
            if person['nationalities']:
                region_matches = await search_events_by_region(
                    conn, person['nationalities'],
                    person['birth_year'], person['death_year']
                )
                candidates.extend(region_matches)
            
            # Deduplicate and filter out existing links
            seen = set()
            unique_candidates = []
            for c in candidates:
                eid = str(c['id'])
                if eid not in seen and eid not in existing:
                    seen.add(eid)
                    unique_candidates.append(c)
            
            # Sort by importance (prefer more significant events)
            unique_candidates.sort(
                key=lambda x: x.get('importance_score', 0) or 0, 
                reverse=True
            )
            
            # Add links up to needed amount
            added_for_person = 0
            for event in unique_candidates[:needed + 3]:  # Try a few extra in case of conflicts
                if added_for_person >= needed:
                    break
                
                role = determine_role(person['roles'], event['title'])
                event_id = str(event['id'])
                
                if await insert_link(conn, pid, event_id, role):
                    added_for_person += 1
                    total_added += 1
            
            if added_for_person > 0:
                people_enriched += 1
                print(f"  {name}: +{added_for_person} links (was {link_count})")
        
        # Final stats
        final_count = await conn.fetchval("SELECT COUNT(*) FROM event_people")
        
        print("\n" + "=" * 70)
        print("Summary")
        print("=" * 70)
        print(f"People enriched: {people_enriched}")
        print(f"New links added: {total_added}")
        print(f"Total links: {initial_count} → {final_count}")
        
        # Show distribution
        print("\n--- Link Distribution ---")
        dist = await conn.fetch("""
            SELECT 
                CASE 
                    WHEN cnt = 0 THEN '0 links'
                    WHEN cnt BETWEEN 1 AND 4 THEN '1-4 links'
                    WHEN cnt BETWEEN 5 AND 9 THEN '5-9 links'
                    WHEN cnt >= 10 THEN '10+ links'
                END as bucket,
                COUNT(*) as people_count
            FROM (
                SELECT p.id, COUNT(ep.event_id) as cnt
                FROM people p
                LEFT JOIN event_people ep ON p.id = ep.person_id
                GROUP BY p.id
            ) t
            GROUP BY bucket
            ORDER BY bucket
        """)
        for row in dist:
            print(f"  {row['bucket']}: {row['people_count']} people")
        
        # Average links per person
        avg = await conn.fetchval("""
            SELECT AVG(cnt)::numeric(5,2)
            FROM (
                SELECT COUNT(*) as cnt 
                FROM event_people 
                GROUP BY person_id
            ) t
        """)
        print(f"\nAverage links per person: {avg}")
        
    finally:
        await conn.close()
    
    print("\n" + "=" * 70)
    print("Done!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
