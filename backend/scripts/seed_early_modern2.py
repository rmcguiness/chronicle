#!/usr/bin/env python3
"""
seed_early_modern2.py — Add ~80 curated early modern events (1500-1800)
covering Age of Exploration, Reformation, Scientific Revolution,
Colonialism, Enlightenment, and American/French Revolutions.

Run:
    python backend/scripts/seed_early_modern2.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import uuid
from datetime import date

import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
CREATED_BY = "seed-script:early-modern2-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, geo_era_label, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # AGE OF EXPLORATION
    # ═══════════════════════════════════════════════════════════════════════
    ("John Cabot Reaches North America", 1497, "discovery",
     "Newfoundland, Canada", "Age of Exploration",
     47.56, -52.71, 0.65, "cabot-north-america-1497"),

    ("Vasco da Gama Reaches India by Sea", 1498, "discovery",
     "Calicut, India", "Age of Exploration",
     11.25, 75.77, 0.80, "vasco-da-gama-india-1498"),

    ("Pedro Álvares Cabral Claims Brazil", 1500, "discovery",
     "Porto Seguro, Brazil", "Age of Exploration",
     -16.45, -39.06, 0.65, "cabral-claims-brazil-1500"),

    ("Balboa Sights the Pacific Ocean", 1513, "discovery",
     "Darién, Panama", "Age of Exploration",
     8.41, -77.93, 0.60, "balboa-pacific-ocean-1513"),

    ("Hernán Cortés Lands in Mexico", 1519, "war",
     "Veracruz, Mexico", "Spanish Colonial Period",
     19.18, -96.13, 0.70, "cortes-lands-mexico-1519"),

    ("Jacques Cartier Explores the St. Lawrence", 1534, "discovery",
     "Quebec, Canada", "Age of Exploration",
     46.81, -71.21, 0.55, "cartier-st-lawrence-1534"),

    ("Francisco de Orellana Navigates the Amazon", 1542, "discovery",
     "Amazon Basin, Brazil", "Age of Exploration",
     -3.12, -60.02, 0.50, "orellana-amazon-1542"),

    ("Francis Drake Circumnavigates the Globe", 1580, "discovery",
     "Plymouth, England", "Elizabethan England",
     50.37, -4.14, 0.60, "drake-circumnavigation-1580"),

    ("Henry Hudson Explores Hudson Bay", 1610, "discovery",
     "Hudson Bay, Canada", "Age of Exploration",
     58.0, -85.0, 0.50, "hudson-bay-exploration-1610"),

    ("Abel Tasman Reaches New Zealand and Tasmania", 1642, "discovery",
     "Tasmania, Australia", "Age of Exploration",
     -42.88, 147.33, 0.55, "tasman-new-zealand-1642"),

    ("Bering Expedition Maps Alaska Coast", 1741, "discovery",
     "Alaska, USA", "Russian Exploration",
     57.79, -152.41, 0.45, "bering-expedition-alaska-1741"),

    # ═══════════════════════════════════════════════════════════════════════
    # REFORMATION & RELIGIOUS WARS
    # ═══════════════════════════════════════════════════════════════════════
    ("Zwingli's Reformation in Zurich", 1523, "cultural",
     "Zurich, Switzerland", "Protestant Reformation",
     47.37, 8.54, 0.55, "zwingli-reformation-zurich-1523"),

    ("Calvin Establishes Reformed Church in Geneva", 1541, "cultural",
     "Geneva, Switzerland", "Protestant Reformation",
     46.20, 6.14, 0.65, "calvin-geneva-1541"),

    ("Society of Jesus (Jesuits) Founded", 1540, "cultural",
     "Rome, Italy", "Counter-Reformation",
     41.90, 12.50, 0.60, "jesuits-founded-1540"),

    ("Huguenot Wars Begin in France", 1562, "war",
     "France", "French Wars of Religion",
     47.0, 2.0, 0.60, "huguenot-wars-begin-1562"),

    ("Dutch Revolt Against Spain Begins", 1568, "war",
     "Netherlands", "Dutch Revolt",
     52.37, 4.90, 0.65, "dutch-revolt-begins-1568"),

    ("Union of Utrecht — Dutch Republic Founded", 1579, "political",
     "Utrecht, Netherlands", "Dutch Republic",
     52.09, 5.12, 0.60, "union-of-utrecht-1579"),

    ("Defenestration of Prague — Thirty Years' War Trigger", 1618, "war",
     "Prague, Czech Republic", "Thirty Years' War",
     50.09, 14.40, 0.65, "defenestration-prague-trigger-1618"),

    ("Battle of White Mountain — Bohemian Revolt Crushed", 1620, "war",
     "Prague, Czech Republic", "Thirty Years' War",
     50.08, 14.32, 0.55, "battle-white-mountain-1620"),

    ("Gustavus Adolphus Enters Thirty Years' War", 1630, "war",
     "Pomerania, Germany", "Thirty Years' War",
     54.09, 13.38, 0.60, "gustavus-adolphus-enters-war-1630"),

    # ═══════════════════════════════════════════════════════════════════════
    # SCIENTIFIC REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    ("Tycho Brahe Builds Uraniborg Observatory", 1576, "discovery",
     "Hven, Denmark/Sweden", "Scientific Revolution",
     55.91, 12.70, 0.55, "tycho-brahe-uraniborg-1576"),

    ("Kepler Publishes Laws of Planetary Motion", 1609, "discovery",
     "Prague, Czech Republic", "Scientific Revolution",
     50.09, 14.42, 0.70, "kepler-planetary-motion-1609"),

    ("Galileo Observes Jupiter's Moons", 1610, "discovery",
     "Padua, Italy", "Scientific Revolution",
     45.41, 11.88, 0.75, "galileo-jupiters-moons-1610"),

    ("William Harvey Describes Blood Circulation", 1628, "discovery",
     "London, England", "Scientific Revolution",
     51.51, -0.13, 0.65, "harvey-blood-circulation-1628"),

    ("Robert Boyle Publishes The Sceptical Chymist", 1661, "discovery",
     "Oxford, England", "Scientific Revolution",
     51.75, -1.25, 0.60, "boyle-sceptical-chymist-1661"),

    ("Robert Hooke Publishes Micrographia", 1665, "discovery",
     "London, England", "Scientific Revolution",
     51.51, -0.13, 0.55, "hooke-micrographia-1665"),

    ("Christiaan Huygens Invents Pendulum Clock", 1656, "discovery",
     "The Hague, Netherlands", "Scientific Revolution",
     52.08, 4.30, 0.50, "huygens-pendulum-clock-1656"),

    ("Leibniz Develops Calculus Independently", 1684, "discovery",
     "Hanover, Germany", "Scientific Revolution",
     52.37, 9.74, 0.65, "leibniz-calculus-1684"),

    ("Linnaeus Publishes Systema Naturae", 1735, "discovery",
     "Uppsala, Sweden", "Age of Enlightenment",
     59.86, 17.64, 0.60, "linnaeus-systema-naturae-1735"),

    ("Benjamin Franklin's Electricity Experiments", 1752, "discovery",
     "Philadelphia, USA", "Age of Enlightenment",
     39.95, -75.17, 0.55, "franklin-electricity-1752"),

    ("Lavoisier Discovers Oxygen — Modern Chemistry", 1778, "discovery",
     "Paris, France", "Age of Enlightenment",
     48.86, 2.35, 0.65, "lavoisier-oxygen-chemistry-1778"),

    # ═══════════════════════════════════════════════════════════════════════
    # COLONIALISM & SLAVE TRADE
    # ═══════════════════════════════════════════════════════════════════════
    ("British East India Company Founded", 1600, "political",
     "London, England", "British Colonial Era",
     51.51, -0.08, 0.70, "british-east-india-company-1600"),

    ("Dutch VOC Founded — First Multinational Corporation", 1602, "political",
     "Amsterdam, Netherlands", "Dutch Golden Age",
     52.37, 4.90, 0.70, "dutch-voc-founded-1602"),

    ("Jamestown — First Permanent English Colony in Americas", 1607, "political",
     "Jamestown, Virginia, USA", "British Colonial America",
     37.21, -76.78, 0.65, "jamestown-colony-1607"),

    ("First Enslaved Africans Arrive in Virginia", 1619, "political",
     "Point Comfort, Virginia, USA", "Colonial America",
     37.0, -76.31, 0.70, "first-enslaved-africans-virginia-1619"),

    ("Dutch Colony of New Amsterdam Founded", 1626, "political",
     "Manhattan, New York, USA", "Dutch Colonial Period",
     40.71, -74.01, 0.55, "new-amsterdam-founded-1626"),

    ("British Capture Jamaica", 1655, "war",
     "Jamaica", "British Caribbean",
     18.11, -77.30, 0.45, "british-capture-jamaica-1655"),

    ("Slave Trade Reaches Peak Volume", 1750, "political",
     "West Africa", "Atlantic Slave Trade",
     6.50, -1.50, 0.70, "slave-trade-peak-volume-1750"),

    ("Treaty of Paris — France Cedes Canada to Britain", 1763, "political",
     "Paris, France", "Seven Years' War Aftermath",
     48.86, 2.35, 0.65, "treaty-paris-1763"),

    ("Captain Cook Charts Australia", 1770, "discovery",
     "Botany Bay, Australia", "Age of Exploration",
     -33.99, 151.23, 0.60, "cook-charts-australia-1770"),

    ("Haitian Revolution — Largest Slave Uprising", 1791, "war",
     "Saint-Domingue, Haiti", "Age of Revolution",
     18.97, -72.28, 0.80, "haitian-revolution-1791"),

    # ═══════════════════════════════════════════════════════════════════════
    # ENLIGHTENMENT
    # ═══════════════════════════════════════════════════════════════════════
    ("John Locke Publishes Two Treatises of Government", 1689, "political",
     "London, England", "Age of Enlightenment",
     51.51, -0.13, 0.75, "locke-two-treatises-1689"),

    ("Montesquieu Publishes The Spirit of the Laws", 1748, "political",
     "Paris, France", "Age of Enlightenment",
     48.86, 2.35, 0.65, "montesquieu-spirit-laws-1748"),

    ("Voltaire Publishes Candide", 1759, "cultural",
     "Geneva, Switzerland", "Age of Enlightenment",
     46.20, 6.14, 0.55, "voltaire-candide-1759"),

    ("Rousseau Publishes The Social Contract", 1762, "political",
     "Amsterdam, Netherlands", "Age of Enlightenment",
     52.37, 4.90, 0.65, "rousseau-social-contract-1762"),

    ("Diderot Completes the Encyclopédie", 1772, "cultural",
     "Paris, France", "Age of Enlightenment",
     48.86, 2.35, 0.60, "diderot-encyclopedie-complete-1772"),

    ("Adam Smith Publishes The Wealth of Nations", 1776, "political",
     "London, England", "Age of Enlightenment",
     51.51, -0.13, 0.75, "adam-smith-wealth-nations-1776"),

    ("Immanuel Kant Publishes Critique of Pure Reason", 1781, "cultural",
     "Königsberg, Germany", "Age of Enlightenment",
     54.71, 20.51, 0.65, "kant-critique-pure-reason-1781"),

    ("Mary Wollstonecraft — Vindication of Rights of Woman", 1792, "political",
     "London, England", "Age of Enlightenment",
     51.51, -0.13, 0.60, "wollstonecraft-rights-woman-1792"),

    # ═══════════════════════════════════════════════════════════════════════
    # AMERICAN REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    ("Stamp Act — British Taxation of Colonies", 1765, "political",
     "London, England", "British Colonial America",
     51.51, -0.13, 0.60, "stamp-act-1765"),

    ("Boston Massacre", 1770, "political",
     "Boston, Massachusetts, USA", "American Revolution",
     42.36, -71.06, 0.55, "boston-massacre-1770"),

    ("Boston Tea Party", 1773, "political",
     "Boston, Massachusetts, USA", "American Revolution",
     42.35, -71.05, 0.65, "boston-tea-party-1773"),

    ("Battles of Lexington and Concord — War Begins", 1775, "war",
     "Lexington, Massachusetts, USA", "American Revolution",
     42.45, -71.23, 0.70, "lexington-concord-1775"),

    ("Declaration of Independence", 1776, "political",
     "Philadelphia, Pennsylvania, USA", "American Revolution",
     39.95, -75.15, 0.90, "declaration-independence-1776"),

    ("Battle of Saratoga — Turning Point", 1777, "war",
     "Saratoga, New York, USA", "American Revolution",
     43.00, -73.64, 0.60, "battle-saratoga-1777"),

    ("Treaty of Paris — American Independence Recognized", 1783, "political",
     "Paris, France", "American Revolution",
     48.86, 2.35, 0.70, "treaty-paris-independence-1783"),

    ("Constitutional Convention — US Constitution Drafted", 1787, "political",
     "Philadelphia, Pennsylvania, USA", "Early American Republic",
     39.95, -75.15, 0.80, "constitutional-convention-1787"),

    ("US Bill of Rights Ratified", 1791, "political",
     "Washington, D.C., USA", "Early American Republic",
     38.91, -77.04, 0.70, "us-bill-of-rights-1791"),

    # ═══════════════════════════════════════════════════════════════════════
    # FRENCH REVOLUTION
    # ═══════════════════════════════════════════════════════════════════════
    ("Estates-General Convened — French Revolution Begins", 1789, "political",
     "Versailles, France", "French Revolution",
     48.80, 2.12, 0.75, "estates-general-1789"),

    ("Storming of the Bastille", 1789, "war",
     "Paris, France", "French Revolution",
     48.85, 2.37, 0.85, "storming-bastille-1789"),

    ("Declaration of the Rights of Man and Citizen", 1789, "political",
     "Versailles, France", "French Revolution",
     48.80, 2.12, 0.80, "declaration-rights-man-1789"),

    # ═══════════════════════════════════════════════════════════════════════
    # ASIAN & AFRICAN EVENTS
    # ═══════════════════════════════════════════════════════════════════════
    ("Zheng He's Treasure Voyages End", 1433, "discovery",
     "Nanjing, China", "Ming Dynasty China",
     32.06, 118.80, 0.55, "zheng-he-voyages-end-1433"),

    ("Fall of the Kingdom of Kongo to Portugal", 1665, "war",
     "Mbanza-Kongo, Angola", "Kingdom of Kongo",
     -6.27, 14.25, 0.50, "fall-kingdom-kongo-1665"),

    ("Qing Dynasty Conquers Taiwan", 1683, "war",
     "Taiwan", "Qing Dynasty China",
     25.03, 121.57, 0.45, "qing-conquers-taiwan-1683"),

    ("Battle of Plassey — British Dominance in India", 1757, "war",
     "Plassey, India", "British India",
     23.80, 88.27, 0.70, "battle-plassey-1757"),

    ("Partition of Poland Begins", 1772, "political",
     "Warsaw, Poland", "Partition Era",
     52.23, 21.01, 0.60, "partition-poland-1772"),

    ("Tipu Sultan Resists British Expansion in India", 1782, "war",
     "Mysore, India", "Anglo-Mysore Wars",
     12.30, 76.65, 0.50, "tipu-sultan-mysore-wars-1782"),

    # ═══════════════════════════════════════════════════════════════════════
    # ARTS & CULTURE
    # ═══════════════════════════════════════════════════════════════════════
    ("Shakespeare Writes Hamlet", 1601, "cultural",
     "London, England", "Elizabethan England",
     51.51, -0.08, 0.70, "shakespeare-hamlet-1601"),

    ("Cervantes Publishes Don Quixote", 1605, "cultural",
     "Madrid, Spain", "Spanish Golden Age",
     40.42, -3.70, 0.65, "cervantes-don-quixote-1605"),

    ("Rembrandt Paints The Night Watch", 1642, "cultural",
     "Amsterdam, Netherlands", "Dutch Golden Age",
     52.37, 4.90, 0.55, "rembrandt-night-watch-1642"),

    ("Bach Composes The Well-Tempered Clavier", 1722, "cultural",
     "Köthen, Germany", "Baroque Period",
     51.75, 11.97, 0.55, "bach-well-tempered-clavier-1722"),

    ("Mozart Born — Classical Music Flourishes", 1756, "cultural",
     "Salzburg, Austria", "Classical Period",
     47.80, 13.04, 0.55, "mozart-born-1756"),

    # ═══════════════════════════════════════════════════════════════════════
    # INDUSTRIAL REVOLUTION PRECURSORS
    # ═══════════════════════════════════════════════════════════════════════
    ("Newcomen Atmospheric Steam Engine", 1712, "discovery",
     "Dudley, England", "Early Industrial Revolution",
     52.51, -2.08, 0.60, "newcomen-steam-engine-1712"),

    ("John Kay Invents the Flying Shuttle", 1733, "discovery",
     "Bury, England", "Early Industrial Revolution",
     53.59, -2.30, 0.50, "flying-shuttle-1733"),

    ("James Watt Improves the Steam Engine", 1769, "discovery",
     "Glasgow, Scotland", "Industrial Revolution",
     55.86, -4.25, 0.70, "watt-steam-engine-1769"),

    ("Arkwright's Water Frame — Factory System Begins", 1771, "discovery",
     "Cromford, England", "Industrial Revolution",
     53.11, -1.55, 0.55, "arkwright-water-frame-1771"),

    ("Eli Whitney Invents the Cotton Gin", 1793, "discovery",
     "Georgia, USA", "Early American Republic",
     33.75, -84.39, 0.55, "whitney-cotton-gin-1793"),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Exploration chains
    ("Vasco da Gama Reaches India", "Portuguese Establish Trading",
     "direct", 0.85, "Da Gama's route opened Portuguese trade with India."),
    ("Balboa Sights the Pacific", "Magellan",
     "contributing", 0.55, "Balboa's discovery inspired circumnavigation attempts."),
    ("John Cabot Reaches", "Jacques Cartier Explores",
     "contributing", 0.50, "Cabot's voyage encouraged further North American exploration."),

    # Reformation chains
    ("Martin Luther's 95 Theses", "Zwingli's Reformation",
     "contributing", 0.65, "Luther's challenge inspired parallel reform movements."),
    ("Martin Luther's 95 Theses", "Calvin Establishes",
     "contributing", 0.70, "Luther's theology influenced Calvin's reform movement."),
    ("Calvin Establishes", "Huguenot Wars",
     "contributing", 0.65, "Calvinist growth in France provoked Catholic backlash."),
    ("Council of Trent", "Society of Jesus",
     "contributing", 0.60, "Counter-Reformation energized Jesuit missions worldwide."),
    ("Dutch Revolt Against Spain", "Union of Utrecht",
     "direct", 0.85, "The revolt led to formal union of northern provinces."),
    ("St. Bartholomew", "Edict of Nantes",
     "contributing", 0.60, "The massacre's horror eventually drove religious tolerance."),

    # Scientific Revolution chains
    ("Tycho Brahe Builds Uraniborg", "Kepler Publishes Laws",
     "direct", 0.85, "Brahe's observations were the foundation for Kepler's laws."),
    ("Kepler Publishes Laws", "Newton Principia",
     "contributing", 0.75, "Kepler's laws were key input for Newton's gravitational theory."),
    ("Galileo Observes Jupiter", "Newton Principia",
     "contributing", 0.60, "Galileo's observations supported the heliocentric model Newton built on."),
    ("Robert Boyle Publishes", "Lavoisier Discovers Oxygen",
     "contributing", 0.55, "Boyle's chemistry foundations enabled Lavoisier's breakthroughs."),
    ("Copernicus Publishes", "Tycho Brahe Builds Uraniborg",
     "contributing", 0.65, "Copernicus's model motivated Brahe's systematic observations."),

    # Colonial chains
    ("British East India Company", "Battle of Plassey",
     "direct", 0.80, "The EIC's expansion led to military confrontation at Plassey."),
    ("Battle of Plassey", "Tipu Sultan Resists",
     "contributing", 0.55, "British dominance after Plassey prompted resistance across India."),
    ("Dutch VOC Founded", "New Amsterdam",
     "contributing", 0.55, "Dutch commercial expansion drove North American colonization."),
    ("Jamestown — First Permanent", "First Enslaved Africans",
     "direct", 0.75, "Jamestown's labor needs drove importation of enslaved Africans."),
    ("First Enslaved Africans", "Slave Trade Reaches Peak",
     "contributing", 0.65, "Virginia's example expanded the Atlantic slave trade system."),

    # Enlightenment → Revolution chains
    ("Locke Publishes Two Treatises", "Montesquieu Publishes",
     "contributing", 0.60, "Locke's ideas influenced Montesquieu's theory of government."),
    ("Montesquieu Publishes", "Constitutional Convention",
     "contributing", 0.65, "Montesquieu's separation of powers shaped the US Constitution."),
    ("Rousseau Publishes The Social Contract", "Estates-General",
     "contributing", 0.60, "Rousseau's ideas about popular sovereignty fueled French Revolution."),
    ("Adam Smith Publishes", "Industrial Revolution",
     "contributing", 0.40, "Smith's free-market theory supported industrial capitalism."),

    # American Revolution chain
    ("Stamp Act", "Boston Massacre",
     "contributing", 0.65, "Taxation disputes escalated colonial tensions."),
    ("Boston Massacre", "Boston Tea Party",
     "contributing", 0.60, "Growing colonial anger culminated in direct action."),
    ("Boston Tea Party", "Battles of Lexington",
     "direct", 0.75, "British retaliation for the Tea Party triggered armed conflict."),
    ("Battles of Lexington", "Declaration of Independence",
     "direct", 0.85, "Armed conflict led to formal declaration of independence."),
    ("Battle of Saratoga", "Treaty of Paris — American Independence",
     "contributing", 0.70, "Saratoga convinced France to ally with America, turning the war."),
    ("Treaty of Paris — American Independence", "Constitutional Convention",
     "direct", 0.80, "Independence necessitated a new framework of government."),
    ("Constitutional Convention", "US Bill of Rights",
     "direct", 0.90, "The Bill of Rights was added to secure ratification."),

    # French Revolution chain
    ("Estates-General Convened", "Storming of the Bastille",
     "direct", 0.85, "Political deadlock at the Estates-General triggered popular uprising."),
    ("Storming of the Bastille", "Declaration of the Rights of Man",
     "direct", 0.80, "The fall of the Bastille empowered the National Assembly."),
    ("Declaration of Independence", "Declaration of the Rights of Man",
     "contributing", 0.55, "The American declaration influenced the French declaration."),
    ("Declaration of the Rights of Man", "Haitian Revolution",
     "contributing", 0.65, "Enslaved people in Haiti invoked the rights declared in France."),

    # Industrial chains
    ("Newcomen Atmospheric Steam", "James Watt Improves",
     "direct", 0.85, "Watt improved on Newcomen's original design."),
    ("John Kay Invents the Flying Shuttle", "Spinning Jenny",
     "contributing", 0.65, "The flying shuttle increased weaving speed, creating demand for more yarn."),
    ("James Watt Improves", "Arkwright's Water Frame",
     "contributing", 0.50, "Steam power and mechanization advanced together."),
]


async def main():
    """Insert early modern enrichment events and causality links."""
    conn = await asyncpg.connect(DB_URL)

    # ── Load existing events ──
    rows = await conn.fetch("SELECT id, slug, title FROM events")
    slugs_existing = {r["slug"] for r in rows}
    events_by_title: dict[str, str] = {r["title"]: str(r["id"]) for r in rows}
    event_count_before = len(rows)

    link_rows = await conn.fetch("SELECT cause_event_id, effect_event_id FROM causality_links")
    existing_links = set((str(r[0]), str(r[1])) for r in link_rows)
    link_count_before = len(link_rows)

    print(f"Before: {event_count_before} events, {link_count_before} links")

    # ── Insert new events ──
    events_inserted = 0
    for title, year, category, geo, geo_era, lat, lng, importance, slug in NEW_EVENTS:
        if slug in slugs_existing:
            print(f"  SKIP (exists): {slug}")
            continue

        event_id = str(uuid.uuid4())
        d_earliest = date(year, 1, 1)
        d_latest = date(year, 12, 31)
        wkt = f"SRID=4326;POINT({lng} {lat})"
        content_hash = sha256_str(json.dumps({"slug": slug, "year": year}, sort_keys=True))

        try:
            await conn.execute("""
                INSERT INTO events (
                    id, slug, title, date_earliest, date_latest, year_approx, is_bce,
                    geo_point, geo_modern, geo_era_label,
                    importance_score, zoom_min, event_category,
                    review_status, created_by, content_hash
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, false,
                    ST_GeomFromEWKT($7), $8, $9,
                    $10, $11, $12,
                    'approved', $13, $14
                )
            """, event_id, slug, title, d_earliest, d_latest, year,
                wkt, geo, geo_era,
                importance, 2, category,
                CREATED_BY, content_hash)
            events_by_title[title] = event_id
            slugs_existing.add(slug)
            events_inserted += 1
        except Exception as e:
            print(f"  ERROR inserting {slug}: {e}")

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
    total_em = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1500 AND 1800")
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nEarly modern events (1500-1800): {total_em}")
    print(f"Total events: {total_events}, total links: {total_links}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
