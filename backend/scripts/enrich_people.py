"""Enrich people with thin/missing descriptions using their metadata and linked events."""

import psycopg2
import psycopg2.extras

DSN = "host=localhost port=5433 dbname=chronicle user=chronicle password=chronicle"


def build_bio(person, event_titles):
    """Construct a 2-3 sentence bio from available metadata."""
    name = person["name"]
    birth = person["birth_year"]
    death = person["death_year"]
    nationalities = person["nationalities"] or []
    roles = person["roles"] or []
    gender = person["gender"]

    # Life span string
    life = ""
    if birth and death:
        b = f"{abs(birth)} {'BCE' if birth < 0 else 'CE'}"
        d = f"{abs(death)} {'BCE' if death < 0 else 'CE'}"
        life = f" ({b}–{d})"
    elif birth:
        b = f"{abs(birth)} {'BCE' if birth < 0 else 'CE'}"
        life = f" (born {b})"
    elif death:
        d = f"{abs(death)} {'BCE' if death < 0 else 'CE'}"
        life = f" (died {d})"

    # Nationality/role prefix
    nat_str = ", ".join(nationalities) if nationalities else ""
    role_str = ", ".join(roles) if roles else ""

    if nat_str and role_str:
        prefix = f"{nat_str} {role_str}"
    elif nat_str:
        prefix = f"{nat_str} historical figure"
    elif role_str:
        prefix = role_str.capitalize()
    else:
        prefix = "Historical figure"

    # Pronoun
    pronoun = "They"
    if gender == "M":
        pronoun = "He"
    elif gender == "F":
        pronoun = "She"

    sentence1 = f"{name}{life} was a {prefix}."

    # Events sentence
    if event_titles:
        if len(event_titles) <= 3:
            events_str = ", ".join(event_titles)
        else:
            events_str = ", ".join(event_titles[:3]) + f", and {len(event_titles) - 3} other events"
        sentence2 = f" {pronoun} was involved in {events_str}."
    else:
        sentence2 = ""

    return (sentence1 + sentence2).strip()


def main():
    conn = psycopg2.connect(DSN)
    conn.autocommit = True
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Find people with thin descriptions
    cur.execute("""
        SELECT id, name, birth_year, death_year, nationalities, roles, gender, description
        FROM people
        WHERE description IS NULL OR length(description) < 100
    """)
    thin_people = cur.fetchall()
    print(f"Found {len(thin_people)} people with thin/missing descriptions")

    updated = 0
    for person in thin_people:
        # Get linked event titles
        cur.execute("""
            SELECT e.title FROM events e
            JOIN event_people ep ON e.id = ep.event_id
            WHERE ep.person_id = %s
            ORDER BY e.date_earliest
        """, (person["id"],))
        event_titles = [r["title"] for r in cur.fetchall()]

        bio = build_bio(person, event_titles)

        if len(bio) > len(person["description"] or ""):
            cur.execute("UPDATE people SET description = %s WHERE id = %s", (bio, person["id"]))
            updated += 1
            print(f"  Updated: {person['name']} ({len(bio)} chars)")

    print(f"\nTotal updated: {updated}")
    cur.close()
    conn.close()


if __name__ == "__main__":
    main()
