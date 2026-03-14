"""Find and create event_people links by matching person names in event titles/article_summaries."""

import psycopg2
import psycopg2.extras

DSN = "host=localhost port=5433 dbname=chronicle user=chronicle password=chronicle"


def main():
    conn = psycopg2.connect(DSN)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Get all people
    cur.execute("SELECT id, name, aliases FROM people")
    people = cur.fetchall()
    print(f"Loaded {len(people)} people")

    # Get all events with text to search
    cur.execute("""
        SELECT id, title, article_summary FROM events
        WHERE article_summary IS NOT NULL
    """)
    events = cur.fetchall()
    print(f"Loaded {len(events)} events with article_summary")

    # Get existing links
    cur.execute("SELECT event_id, person_id FROM event_people")
    existing = set((str(r["event_id"]), str(r["person_id"])) for r in cur.fetchall())
    print(f"Existing links: {len(existing)}")

    added = 0
    for person in people:
        pid = str(person["id"])
        name = person["name"]
        # Skip very short names to avoid false matches
        if len(name) < 4:
            continue

        # Build search names: full name + aliases
        search_names = [name]
        if person["aliases"]:
            search_names.extend(a for a in person["aliases"] if len(a) >= 4)

        for event in events:
            eid = str(event["id"])
            if (eid, pid) in existing:
                continue

            text = (event["title"] or "") + " " + (event["article_summary"] or "")

            for sname in search_names:
                if sname in text:
                    try:
                        cur.execute("""
                            INSERT INTO event_people (event_id, person_id, role)
                            VALUES (%s, %s, 'mentioned')
                            ON CONFLICT DO NOTHING
                        """, (event["id"], person["id"]))
                        existing.add((eid, pid))
                        added += 1
                        if added <= 50:
                            print(f"  Linked: {name} -> {event['title'][:60]}")
                        elif added == 51:
                            print("  ... (suppressing further output)")
                    except Exception as e:
                        print(f"  Error linking {name} to {event['title'][:40]}: {e}")
                    break  # Only link once per event

    print(f"\nNew links added: {added}")

    # Report totals
    cur.execute("SELECT COUNT(*) as cnt FROM event_people")
    print(f"Total event_people links: {cur.fetchone()['cnt']}")

    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
