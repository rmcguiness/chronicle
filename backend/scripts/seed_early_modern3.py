#!/usr/bin/env python3
"""
seed_early_modern3.py — Add ~80 curated early modern events (1450-1800)
filling gaps in: Renaissance art, Asian empires, European politics,
colonial expansion, and cultural milestones.

Run:
    python backend/scripts/seed_early_modern3.py
"""
from __future__ import annotations

import asyncio
import hashlib
import json
import uuid
from datetime import date

import asyncpg

DB_URL = "postgresql://chronicle:chronicle@localhost:5433/chronicle"
CREATED_BY = "seed-script:early-modern3-v1"


def sha256_str(data: str) -> str:
    return hashlib.sha256(data.encode()).hexdigest()


# ─── New Events (~80) ─────────────────────────────────────────────────────────
# (title, year_approx, event_category, geo_modern, geo_era_label, lat, lng, importance_score, slug)

NEW_EVENTS = [
    # ═══════════════════════════════════════════════════════════════════════
    # RENAISSANCE ART & CULTURE
    # ═══════════════════════════════════════════════════════════════════════
    ("Leonardo da Vinci Paints The Last Supper", 1498, "cultural",
     "Milan, Italy", "Italian Renaissance",
     45.46, 9.17, 0.80, "leonardo-last-supper-1498"),

    ("Leonardo da Vinci Paints the Mona Lisa", 1503, "cultural",
     "Florence, Italy", "Italian Renaissance",
     43.77, 11.25, 0.85, "leonardo-mona-lisa-1503"),

    ("Michelangelo Paints the Sistine Chapel Ceiling", 1512, "cultural",
     "Vatican City", "Italian Renaissance",
     41.90, 12.45, 0.85, "michelangelo-sistine-chapel-1512"),

    ("Machiavelli Writes The Prince", 1513, "cultural",
     "Florence, Italy", "Italian Renaissance",
     43.77, 11.25, 0.75, "machiavelli-the-prince-1513"),

    ("Raphael Paints The School of Athens", 1511, "cultural",
     "Vatican City", "Italian Renaissance",
     41.90, 12.45, 0.65, "raphael-school-of-athens-1511"),

    ("Dürer's Self-Portrait — Northern Renaissance Master", 1500, "cultural",
     "Nuremberg, Germany", "Northern Renaissance",
     49.45, 11.08, 0.55, "durer-self-portrait-1500"),

    ("Erasmus Publishes In Praise of Folly", 1511, "cultural",
     "Paris, France", "Northern Renaissance",
     48.86, 2.35, 0.60, "erasmus-praise-of-folly-1511"),

    ("Thomas More Publishes Utopia", 1516, "cultural",
     "Leuven, Belgium", "Northern Renaissance",
     50.88, 4.70, 0.60, "thomas-more-utopia-1516"),

    ("Titian Dominates Venetian Painting", 1530, "cultural",
     "Venice, Italy", "Italian Renaissance",
     45.44, 12.34, 0.55, "titian-venetian-painting-1530"),

    # ═══════════════════════════════════════════════════════════════════════
    # EARLY MODERN EUROPEAN POLITICS
    # ═══════════════════════════════════════════════════════════════════════
    ("Italian Wars Begin — France Invades Italy", 1494, "war",
     "Naples, Italy", "Italian Wars",
     40.85, 14.27, 0.60, "italian-wars-begin-1494"),

    ("Battle of Lepanto — Ottoman Naval Expansion Checked", 1571, "war",
     "Gulf of Patras, Greece", "Ottoman Wars",
     38.34, 21.79, 0.70, "battle-lepanto-1571"),

    ("Edict of Nantes Revoked — Huguenot Exodus", 1685, "political",
     "Fontainebleau, France", "Age of Louis XIV",
     48.40, 2.70, 0.60, "edict-nantes-revoked-1685"),

    ("Louis XIV Builds Versailles — Absolute Monarchy", 1682, "political",
     "Versailles, France", "Age of Louis XIV",
     48.80, 2.12, 0.80, "louis-xiv-versailles-1682"),

    ("Great Fire of London Destroys the City", 1666, "political",
     "London, England", "Stuart England",
     51.51, -0.09, 0.60, "great-fire-london-1666"),

    ("Great Plague of London", 1665, "political",
     "London, England", "Stuart England",
     51.51, -0.09, 0.60, "great-plague-london-1665"),

    ("Peter the Great Modernizes Russia", 1700, "political",
     "St. Petersburg, Russia", "Imperial Russia",
     59.93, 30.32, 0.75, "peter-great-modernizes-russia-1700"),

    ("Peter the Great Founds St. Petersburg", 1703, "political",
     "St. Petersburg, Russia", "Imperial Russia",
     59.93, 30.32, 0.65, "peter-great-st-petersburg-1703"),

    ("Treaty of Utrecht Ends War of Spanish Succession", 1713, "political",
     "Utrecht, Netherlands", "Early Modern Europe",
     52.09, 5.12, 0.60, "treaty-utrecht-1713"),

    ("Frederick the Great — Prussia Becomes a Major Power", 1740, "political",
     "Berlin, Germany", "Age of Enlightenment",
     52.52, 13.41, 0.65, "frederick-great-prussia-1740"),

    ("Catherine the Great Expands Russian Empire", 1762, "political",
     "St. Petersburg, Russia", "Imperial Russia",
     59.93, 30.32, 0.65, "catherine-great-russia-1762"),

    ("First Partition of Poland", 1772, "political",
     "Warsaw, Poland", "Partition Era",
     52.23, 21.01, 0.55, "first-partition-poland-1772"),

    ("Siege of Vienna — Ottomans Repelled from Central Europe", 1683, "war",
     "Vienna, Austria", "Ottoman Wars",
     48.21, 16.37, 0.70, "siege-vienna-1683"),

    # ═══════════════════════════════════════════════════════════════════════
    # MUGHAL & SOUTH ASIAN EMPIRES
    # ═══════════════════════════════════════════════════════════════════════
    ("Taj Mahal Construction Begins", 1632, "cultural",
     "Agra, India", "Mughal Empire",
     27.17, 78.04, 0.80, "taj-mahal-construction-1632"),

    ("Aurangzeb — Mughal Empire at Greatest Territorial Extent", 1689, "political",
     "Delhi, India", "Mughal Empire",
     28.61, 77.23, 0.65, "aurangzeb-mughal-extent-1689"),

    ("Shivaji Founds the Maratha Empire", 1674, "political",
     "Raigad, India", "Maratha Empire",
     18.23, 73.44, 0.60, "shivaji-maratha-empire-1674"),

    ("Nader Shah Sacks Delhi — Mughal Decline", 1739, "war",
     "Delhi, India", "Mughal Decline",
     28.61, 77.23, 0.60, "nader-shah-sacks-delhi-1739"),

    ("Sikhism Founded by Guru Nanak", 1500, "religious",
     "Punjab, India/Pakistan", "Sikh History",
     31.63, 74.87, 0.60, "sikhism-guru-nanak-1500"),

    # ═══════════════════════════════════════════════════════════════════════
    # EAST ASIAN EVENTS
    # ═══════════════════════════════════════════════════════════════════════
    ("Tokugawa Ieyasu Establishes Edo Shogunate", 1603, "political",
     "Edo (Tokyo), Japan", "Edo Period Japan",
     35.68, 139.77, 0.70, "tokugawa-edo-shogunate-1603"),

    ("Korean Imjin War — Japan Invades Korea", 1592, "war",
     "Korea", "Joseon Dynasty",
     37.57, 126.98, 0.60, "imjin-war-japan-korea-1592"),

    ("Kangxi Emperor — Qing Dynasty Golden Age", 1661, "political",
     "Beijing, China", "Qing Dynasty China",
     39.91, 116.39, 0.65, "kangxi-emperor-qing-1661"),

    ("Qianlong Emperor — High Qing Prosperity", 1735, "political",
     "Beijing, China", "Qing Dynasty China",
     39.91, 116.39, 0.60, "qianlong-emperor-qing-1735"),

    ("Shimabara Rebellion — Christianity Suppressed in Japan", 1638, "war",
     "Shimabara, Japan", "Edo Period Japan",
     32.79, 130.37, 0.50, "shimabara-rebellion-1638"),

    ("Manchu Queue Order — Qing Cultural Imposition", 1645, "political",
     "Beijing, China", "Qing Dynasty China",
     39.91, 116.39, 0.45, "manchu-queue-order-1645"),

    # ═══════════════════════════════════════════════════════════════════════
    # AFRICAN EVENTS
    # ═══════════════════════════════════════════════════════════════════════
    ("Songhai Empire Falls to Moroccan Invasion", 1591, "war",
     "Gao, Mali", "West African Empires",
     16.27, -0.04, 0.55, "songhai-empire-falls-1591"),

    ("Kingdom of Dahomey Rises — West African Power", 1625, "political",
     "Abomey, Benin", "West African Kingdoms",
     7.18, 1.99, 0.50, "kingdom-dahomey-rises-1625"),

    ("Ashanti Empire Founded — Gold Coast Power", 1701, "political",
     "Kumasi, Ghana", "West African Kingdoms",
     6.69, -1.62, 0.55, "ashanti-empire-founded-1701"),

    ("Ethiopian Emperor Fasilides Builds Gondar", 1636, "cultural",
     "Gondar, Ethiopia", "Ethiopian Empire",
     12.61, 37.47, 0.45, "fasilides-builds-gondar-1636"),

    ("Rozvi Empire — Great Zimbabwe Successor State", 1684, "political",
     "Zimbabwe", "Southern African Kingdoms",
     -20.27, 30.93, 0.45, "rozvi-empire-zimbabwe-1684"),

    # ═══════════════════════════════════════════════════════════════════════
    # COLONIAL AMERICAS
    # ═══════════════════════════════════════════════════════════════════════
    ("Potosí Silver Mine — Fueling Spanish Empire", 1545, "political",
     "Potosí, Bolivia", "Spanish Colonial Period",
     -19.59, -65.75, 0.65, "potosi-silver-mine-1545"),

    ("Boston Founded — Massachusetts Bay Colony", 1630, "political",
     "Boston, Massachusetts, USA", "British Colonial America",
     42.36, -71.06, 0.55, "boston-founded-1630"),

    ("Salem Witch Trials", 1692, "political",
     "Salem, Massachusetts, USA", "Colonial America",
     42.52, -70.90, 0.55, "salem-witch-trials-1692"),

    ("Pueblo Revolt — Indigenous Resistance in New Mexico", 1680, "war",
     "Santa Fe, New Mexico, USA", "Colonial America",
     35.69, -105.94, 0.55, "pueblo-revolt-1680"),

    ("Québec City Founded by Champlain", 1608, "political",
     "Québec City, Canada", "French Colonial America",
     46.81, -71.21, 0.55, "quebec-city-founded-1608"),

    ("Treaty of Tordesillas — Spain and Portugal Divide the New World", 1494, "political",
     "Tordesillas, Spain", "Age of Exploration",
     41.50, -5.00, 0.65, "treaty-tordesillas-division-1494"),

    ("Manila Galleon Trade Route Established", 1565, "political",
     "Manila, Philippines", "Spanish Colonial Period",
     14.60, 120.98, 0.55, "manila-galleon-trade-1565"),

    ("Roanoke Colony — The Lost Colony", 1587, "political",
     "Roanoke Island, North Carolina, USA", "British Colonial America",
     35.87, -75.67, 0.50, "roanoke-lost-colony-1587"),

    ("King Philip's War — Native American Resistance", 1675, "war",
     "New England, USA", "Colonial America",
     42.06, -71.87, 0.50, "king-philips-war-1675"),

    ("French Found New Orleans", 1718, "political",
     "New Orleans, Louisiana, USA", "French Colonial America",
     29.95, -90.07, 0.50, "french-found-new-orleans-1718"),

    # ═══════════════════════════════════════════════════════════════════════
    # OTTOMAN & MIDDLE EASTERN EVENTS
    # ═══════════════════════════════════════════════════════════════════════
    ("Selim I Conquers Egypt — Ottoman Caliphate", 1517, "war",
     "Cairo, Egypt", "Ottoman Empire",
     30.04, 31.24, 0.60, "selim-conquers-egypt-1517"),

    ("Ottoman Siege of Malta — Knights Hospitaller Resist", 1565, "war",
     "Malta", "Ottoman Wars",
     35.90, 14.51, 0.55, "ottoman-siege-malta-1565"),

    ("Treaty of Karlowitz — Ottoman Retreat from Europe", 1699, "political",
     "Sremski Karlovci, Serbia", "Ottoman Decline",
     45.20, 19.93, 0.55, "treaty-karlowitz-1699"),

    ("Wahhabi Movement Founded in Arabia", 1744, "religious",
     "Diriyah, Saudi Arabia", "Arabian Peninsula",
     24.73, 46.57, 0.50, "wahhabi-movement-1744"),

    # ═══════════════════════════════════════════════════════════════════════
    # SCIENCE & TECHNOLOGY
    # ═══════════════════════════════════════════════════════════════════════
    ("Paracelsus Pioneers Chemical Medicine", 1530, "discovery",
     "Basel, Switzerland", "Scientific Revolution",
     47.56, 7.59, 0.50, "paracelsus-chemical-medicine-1530"),

    ("Mercator Creates His World Map Projection", 1569, "discovery",
     "Duisburg, Germany", "Age of Exploration",
     51.43, 6.76, 0.60, "mercator-map-projection-1569"),

    ("Galileo's Trial Before the Inquisition", 1633, "discovery",
     "Rome, Italy", "Scientific Revolution",
     41.90, 12.50, 0.70, "galileo-trial-inquisition-1633"),

    ("Pascal and Fermat Found Probability Theory", 1654, "discovery",
     "Paris, France", "Scientific Revolution",
     48.86, 2.35, 0.55, "pascal-fermat-probability-1654"),

    ("Halley Predicts Return of His Comet", 1705, "discovery",
     "London, England", "Scientific Revolution",
     51.51, -0.13, 0.50, "halley-predicts-comet-1705"),

    ("Fahrenheit Invents the Mercury Thermometer", 1714, "discovery",
     "Amsterdam, Netherlands", "Scientific Revolution",
     52.37, 4.90, 0.45, "fahrenheit-thermometer-1714"),

    ("Euler Publishes Foundational Mathematics", 1748, "discovery",
     "Berlin, Germany", "Age of Enlightenment",
     52.52, 13.41, 0.55, "euler-mathematics-1748"),

    ("Priestley Discovers Oxygen Gas", 1774, "discovery",
     "Wiltshire, England", "Age of Enlightenment",
     51.34, -1.99, 0.55, "priestley-discovers-oxygen-1774"),

    ("Cavendish Determines the Weight of the Earth", 1798, "discovery",
     "London, England", "Age of Enlightenment",
     51.51, -0.13, 0.50, "cavendish-weight-earth-1798"),

    # ═══════════════════════════════════════════════════════════════════════
    # ARTS, PHILOSOPHY & CULTURE (17th-18th c.)
    # ═══════════════════════════════════════════════════════════════════════
    ("Velázquez Paints Las Meninas", 1656, "cultural",
     "Madrid, Spain", "Spanish Golden Age",
     40.42, -3.69, 0.55, "velazquez-las-meninas-1656"),

    ("Milton Publishes Paradise Lost", 1667, "cultural",
     "London, England", "Stuart England",
     51.51, -0.13, 0.55, "milton-paradise-lost-1667"),

    ("Versailles Palace Completed — French Baroque", 1710, "cultural",
     "Versailles, France", "Age of Louis XIV",
     48.80, 2.12, 0.55, "versailles-palace-completed-1710"),

    ("Vivaldi Composes The Four Seasons", 1725, "cultural",
     "Venice, Italy", "Baroque Period",
     45.44, 12.34, 0.50, "vivaldi-four-seasons-1725"),

    ("Handel Composes Messiah", 1741, "cultural",
     "Dublin, Ireland", "Baroque Period",
     53.35, -6.26, 0.50, "handel-messiah-1741"),

    ("Samuel Johnson Publishes English Dictionary", 1755, "cultural",
     "London, England", "Age of Enlightenment",
     51.51, -0.13, 0.50, "samuel-johnson-dictionary-1755"),

    ("Goethe Publishes The Sorrows of Young Werther", 1774, "cultural",
     "Leipzig, Germany", "Sturm und Drang",
     51.34, 12.37, 0.50, "goethe-sorrows-werther-1774"),

    # ═══════════════════════════════════════════════════════════════════════
    # ECONOMIC & SOCIAL MILESTONES
    # ═══════════════════════════════════════════════════════════════════════
    ("Dutch Tulip Mania — First Speculative Bubble", 1637, "political",
     "Amsterdam, Netherlands", "Dutch Golden Age",
     52.37, 4.90, 0.55, "dutch-tulip-mania-1637"),

    ("Bank of England Founded", 1694, "political",
     "London, England", "Financial Revolution",
     51.51, -0.09, 0.60, "bank-of-england-founded-1694"),

    ("South Sea Bubble — Financial Crisis", 1720, "political",
     "London, England", "Financial Revolution",
     51.51, -0.09, 0.55, "south-sea-bubble-1720"),

    ("Enclosure Movement Transforms English Agriculture", 1750, "political",
     "England", "Agricultural Revolution",
     52.0, -1.0, 0.50, "enclosure-movement-1750"),

    ("First British Census of India", 1770, "political",
     "Calcutta, India", "British India",
     22.57, 88.36, 0.40, "first-british-census-india-1770"),

    # ═══════════════════════════════════════════════════════════════════════
    # SOUTHEAST ASIA & PACIFIC
    # ═══════════════════════════════════════════════════════════════════════
    ("Portuguese Capture Malacca — Southeast Asian Trade", 1511, "war",
     "Malacca, Malaysia", "Portuguese Colonial Era",
     2.19, 102.25, 0.55, "portuguese-capture-malacca-1511"),

    ("Spanish Colonize the Philippines", 1565, "political",
     "Cebu, Philippines", "Spanish Colonial Period",
     10.31, 123.89, 0.50, "spanish-colonize-philippines-1565"),

    ("Dutch Capture Batavia — VOC Headquarters", 1619, "political",
     "Jakarta, Indonesia", "Dutch Colonial Era",
     -6.21, 106.85, 0.55, "dutch-capture-batavia-1619"),

    ("Ayutthaya Kingdom Falls to Burma", 1767, "war",
     "Ayutthaya, Thailand", "Southeast Asian Kingdoms",
     14.35, 100.57, 0.50, "ayutthaya-falls-burma-1767"),

    # ═══════════════════════════════════════════════════════════════════════
    # LATE 18th CENTURY
    # ═══════════════════════════════════════════════════════════════════════
    ("First Fleet Arrives in Australia — British Colony", 1788, "political",
     "Sydney, Australia", "British Colonial Era",
     -33.87, 151.21, 0.60, "first-fleet-australia-1788"),

    ("Polish Constitution of May 3 — Europe's First Modern Constitution", 1791, "political",
     "Warsaw, Poland", "Age of Enlightenment",
     52.23, 21.01, 0.55, "polish-constitution-1791"),

    ("Toussaint Louverture Leads Haitian Revolution", 1793, "war",
     "Saint-Domingue, Haiti", "Age of Revolution",
     19.76, -72.33, 0.65, "toussaint-louverture-haiti-1793"),
]


# ─── Causality Links ─────────────────────────────────────────────────────────
# (cause_title_fragment, effect_title_fragment, link_type, strength, description)

NEW_LINKS = [
    # Renaissance art chains
    ("Leonardo da Vinci Paints The Last Supper", "Leonardo da Vinci Paints the Mona Lisa",
     "contributing", 0.60, "Leonardo's mastery evolved across his major works."),
    ("Michelangelo Completes David", "Michelangelo Paints the Sistine Chapel",
     "direct", 0.75, "Michelangelo's fame from David led to the papal Sistine commission."),
    ("Raphael Paints The School of Athens", "Michelangelo Paints the Sistine Chapel",
     "contributing", 0.40, "Raphael and Michelangelo worked simultaneously in the Vatican."),
    ("Machiavelli Writes The Prince", "Montesquieu Publishes The Spirit",
     "contributing", 0.50, "Machiavelli's political realism influenced later political theory."),

    # European politics chains
    ("Italian Wars Begin", "Machiavelli Writes The Prince",
     "direct", 0.70, "The Italian Wars' devastation inspired Machiavelli's political philosophy."),
    ("Battle of Lepanto", "Ottoman Siege of Malta",
     "contributing", 0.40, "Ottoman naval ambitions connected both Mediterranean battles."),
    ("Louis XIV Builds Versailles", "Edict of Nantes Revoked",
     "direct", 0.75, "Louis XIV's absolutism drove religious persecution of Huguenots."),
    ("Louis XIV Builds Versailles", "War of Spanish Succession",
     "contributing", 0.60, "Louis XIV's expansionism provoked European coalition wars."),
    ("Peter the Great Modernizes Russia", "Peter the Great Founds St. Petersburg",
     "direct", 0.90, "St. Petersburg was the centerpiece of Peter's modernization."),
    ("Peter the Great Founds St. Petersburg", "Catherine the Great Expands",
     "contributing", 0.50, "Peter's reforms laid groundwork for Catherine's expansion."),
    ("Siege of Vienna — Ottomans Repelled", "Treaty of Karlowitz",
     "direct", 0.80, "Ottoman defeat at Vienna led to territorial losses at Karlowitz."),

    # Mughal chains
    ("Akbar the Great", "Taj Mahal Construction",
     "contributing", 0.50, "Akbar's cultural golden age enabled Mughal architectural achievement."),
    ("Taj Mahal Construction", "Aurangzeb — Mughal Empire at Greatest",
     "contributing", 0.40, "Shah Jahan's reign led to Aurangzeb's expansionist rule."),
    ("Aurangzeb — Mughal Empire at Greatest", "Shivaji Founds the Maratha",
     "contributing", 0.65, "Aurangzeb's oppressive policies provoked Maratha resistance."),
    ("Aurangzeb — Mughal Empire at Greatest", "Nader Shah Sacks Delhi",
     "contributing", 0.55, "Mughal decline after Aurangzeb invited Persian invasion."),

    # East Asian chains
    ("Battle of Sekigahara", "Tokugawa Ieyasu Establishes Edo Shogunate",
     "direct", 0.90, "Victory at Sekigahara gave Tokugawa control of Japan."),
    ("Korean Imjin War", "Tokugawa Ieyasu Establishes Edo",
     "contributing", 0.45, "Japan's failed Korean invasion weakened Toyotomi rivals."),
    ("Kangxi Emperor", "Qianlong Emperor",
     "contributing", 0.60, "Kangxi's consolidation enabled the High Qing prosperity."),

    # Colonial chains
    ("Potosí Silver Mine", "Spanish Armada",
     "contributing", 0.55, "American silver funded Spain's military ambitions."),
    ("Manila Galleon Trade", "Potosí Silver Mine",
     "contributing", 0.45, "Silver trade connected American mines to Asian markets."),
    ("Roanoke Colony", "Jamestown",
     "contributing", 0.50, "Roanoke's failure informed later English colonization."),
    ("Québec City Founded", "Treaty of Paris — France Cedes",
     "contributing", 0.50, "French Quebec was the prize contested in the Seven Years' War."),

    # African chains
    ("Songhai Empire Falls", "Kingdom of Dahomey Rises",
     "contributing", 0.45, "Songhai's collapse opened space for new West African powers."),

    # Financial chains
    ("Dutch Tulip Mania", "South Sea Bubble",
     "contributing", 0.45, "Tulip mania was a precursor to later speculative bubbles."),
    ("Bank of England Founded", "South Sea Bubble",
     "contributing", 0.50, "Financial innovation enabled speculative excess."),

    # Science chains
    ("Mercator Creates His World Map", "Captain Cook",
     "contributing", 0.40, "Improved cartography enabled precise global navigation."),
    ("Galileo's Trial Before the Inquisition", "Newton Principia",
     "contributing", 0.45, "Galileo's martyrdom for science inspired Newton's generation."),
    ("Pascal and Fermat Found Probability", "Euler Publishes Foundational",
     "contributing", 0.50, "Pascal and Fermat's work laid foundations for modern mathematics."),

    # Revolution chains
    ("Polish Constitution of May 3", "Second Partition of Poland",
     "contributing", 0.40, "The progressive constitution alarmed neighboring empires."),
    ("Haitian Revolution", "Toussaint Louverture Leads",
     "direct", 0.85, "Toussaint emerged as the revolution's greatest leader."),
    ("First Fleet Arrives in Australia", "Captain Cook Charts Australia",
     "contributing", 0.40, "Cook's charting of Australia led to British colonization."),
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
    total_em = await conn.fetchval("SELECT COUNT(*) FROM events WHERE year_approx BETWEEN 1450 AND 1800")
    total_events = await conn.fetchval("SELECT COUNT(*) FROM events")
    total_links = await conn.fetchval("SELECT COUNT(*) FROM causality_links")
    print(f"\nEarly modern events (1450-1800): {total_em}")
    print(f"Total events: {total_events}, total links: {total_links}")

    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
