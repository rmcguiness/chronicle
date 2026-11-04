#!/usr/bin/env python3
"""Find duplicate events across Chronicle's seed scripts.

Different seed batches added the same historical event under different slugs
(e.g. three "Black Death" events in 1347). The duplicates were removed from the seed
scripts and their references re-pointed; MERGED_DUPLICATES records each removed slug
and the event it was merged into, so dedupe_events_db.py can clean an existing database.

Usage (from the repo root):
    python backend/scripts/duplicate_events.py          # report near-duplicates
    python backend/scripts/duplicate_events.py --check  # exit 1 if any are found (CI)

Two events count as near-duplicates when their years are within MAX_YEAR_GAP and their
titles share most of their meaningful words. Pairs that look alike but are different
events go in KNOWN_DISTINCT.
"""
from __future__ import annotations

import importlib.util
import re
import sys
import types
from collections import defaultdict
from pathlib import Path
from typing import Any

SEED_DIR = Path(__file__).resolve().parent

# Seed scripts whose EVENTS lists are dicts with slug/title/year.
EVENT_MODULES = [
    "seed_events", "seed_prehistoric", "seed_prehistoric_enrichment", "seed_bronze_classical",
    "seed_early_medieval", "seed_medieval_early_modern", "seed_early_modern_enrichment",
    "seed_19th_century", "seed_19c_modern", "seed_20th_century", "seed_regional_enrichment_2",
    "seed_underrepresented_regions", "seed_underrepresented_v2",
]

MAX_YEAR_GAP = 3

# removed slug -> slug it was merged into
MERGED_DUPLICATES: dict[str, str] = {
    "abolition-slavery-us-13th-amendment-1865": "abolition-slavery-usa-13th-amendment",
    "age-of-reason-voltaire-enlightenment-1750": "enlightenment-age-of-reason",
    "al-khwarizmi-algebra": "al-khwarizmi-algebra-820",
    "algerian-war-independence-1954": "decolonization-algeria-1954-1962",
    "american-civil-war-emancipation": "american-civil-war-1861-1865",
    "american-declaration-of-independence": "american-declaration-independence",
    "american-revolution-1776": "american-declaration-independence",
    "apartheid-end-south-africa-1994": "south-africa-apartheid-ends-1994",
    "athenian-democracy-507bce-cleisthenes": "athenian-democracy-cleisthenes-508bce",
    "athens-democracy-507bce": "athenian-democracy-cleisthenes-508bce",
    "avicenna-canon-of-medicine": "avicenna-canon-medicine-1025",
    "aztec-founding-tenochtitlan": "aztec-tenochtitlan-founding-1325",
    "bantu-expansion": "bantu-expansion-migrations-1000bce",
    "bantu-expansion-africa-1000bce": "bantu-expansion-migrations-1000bce",
    "battle-of-adwa-1896": "battle-adwa-ethiopia-1896",
    "berlin-conference-scramble-africa-1884": "berlin-conference-africa-partition-1884",
    "bessemer-steel-process-1856": "bessemer-process-steel",
    "biafra-war-nigeria-1967": "biafran-war-nigeria-1967",
    "black-death-1347-1351": "black-death-arrives-europe",
    "black-death-arrives-europe-1347": "black-death-arrives-europe",
    "black-death-kills-europe-1347-second": "black-death-arrives-europe",
    "black-death-pandemic-origins-1347": "black-death-arrives-europe",
    "brazilian-abolition-slavery": "brazilian-abolition-1888",
    "bronze-age-collapse-1177bce": "bronze-age-collapse",
    "cahokia-mississippian-city-1050": "cahokia-mississippian-mound-1050",
    "champa-kingdom-rise-192": "champa-kingdom-vietnam-192",
    "charlemagne-crowned-emperor-800": "charlemagne-coronation-800",
    "charlemagne-crowned-holy-roman-emperor": "charlemagne-coronation-800",
    "chavin-de-huantar": "chavin-culture-peru-900bce",
    "classic-maya-collapse": "maya-classic-collapse-900",
    "columbian-exchange-begins": "columbus-reaches-americas-1492",
    "columbus-reaches-americas": "columbus-reaches-americas-1492",
    "congo-independence-crisis-1960": "congo-independence-lumumba-1960",
    "congress-of-vienna-european-order": "congress-vienna-1815",
    "construction-great-pyramid-giza": "great-pyramid-giza",
    "copernicus-heliocentric-model": "copernicus-publishes-de-revolutionibus",
    "copernicus-heliocentric-theory-1543": "copernicus-publishes-de-revolutionibus",
    "council-of-trent-catholic-reform": "protestant-reformation-council-trent-1545",
    "cuban-missile-crisis-resolution-1962-detail": "cuban-missile-crisis-1962",
    "cuban-revolution-1959": "cuban-revolution-fidel-castro-1959",
    "cyrus-great-persia-550bce": "cyrus-great-achaemenid-empire-550bce",
    "darwin-origin-of-species-publication": "darwin-on-the-origin-of-species-1859",
    "darwin-origin-species-evolution": "darwin-on-the-origin-of-species-1859",
    "decolonization-congo-independence-lumumba-1960": "congo-independence-lumumba-1960",
    "decolonization-india-partition-1947-expanded": "indian-independence-1947",
    "decolonization-year-of-africa-1960-detail": "year-of-africa-independence-1960",
    "dutch-east-india-company-voc-1602": "dutch-east-india-company-founded",
    "english-civil-war-begins-1642": "english-civil-war",
    "english-civil-war-glorious-revolution-1688": "glorious-revolution-1688",
    "english-glorious-revolution-1688-parliament": "glorious-revolution-1688",
    "ethiopian-modernization-menelik-1889": "ethiopian-modernization-menelik-ii",
    "ethiopian-victory-adwa": "battle-adwa-ethiopia-1896",
    "fall-of-constantinople-1453": "fall-constantinople-1453",
    "fall-of-saigon-1975": "vietnam-fall-saigon-1975",
    "first-crusade-1095": "first-crusade-1095-1099",
    "founding-carthage-814bce": "phoenicians-found-carthage-814bce",
    "founding-roman-republic-509bce": "roman-republic-founding-509bce",
    "fourth-crusade-sack-of-constantinople": "fourth-crusade-sack-constantinople-1204",
    "french-revolution-1789": "french-revolution-bastille",
    "french-revolution-declaration-rights-1789": "french-revolution-declaration-rights-man",
    "galileo-telescope-1609": "galileo-telescope-observations",
    "genghis-khan-unites-mongols": "mongol-conquests-1206-1279",
    "german-unification-bismarck": "unification-germany-1871",
    "great-enclosure-mapungubwe": "mapungubwe-kingdom-1075",
    "gutenberg-printing-press-1440": "gutenberg-printing-press",
    "haitian-revolution": "haitian-revolution-1791-1804",
    "hammurabi-code-babylon": "hammurabi-code-law",
    "harvey-discovers-blood-circulation": "harvey-blood-circulation-1628",
    "hawaiian-unification-kamehameha-1810": "hawaiian-kingdom-kamehameha",
    "hiroshima-context-decision-1945": "atomic-bombing-hiroshima-nagasaki-1945",
    "hittite-battle-kadesh-1274bce": "battle-kadesh-egypt-hittites",
    "inca-empire-pachacuti-1438": "inca-empire-founding",
    "industrial-revolution-steam-engine-1769": "watt-steam-engine-improved",
    "joan-of-arc-siege-of-orleans": "joan-of-arc-1429",
    "khmer-empire-angkor-wat-1113": "angkor-wat-construction-1113",
    "khmer-empire-founding-802": "khmer-empire-founding",
    "khmer-rouge-genocide": "cambodia-khmer-rouge-1975-1979",
    "kingdom-of-kush-rise": "kingdom-kush-rises-1070bce",
    "lapita-expansion-pacific-1500bce": "lapita-culture-expansion",
    "lapita-people-pacific-expansion-1500bce": "lapita-culture-expansion",
    "latin-american-independence-movements": "bolivar-latin-american-independence-1819",
    "leif-erikson-vinland-1000": "viking-discovery-north-america-1000",
    "leif-eriksson-reaches-north-america": "viking-discovery-north-america-1000",
    "luther-95-theses-reformation": "martin-luther-95-theses-1517",
    "magellan-circumnavigation": "magellan-first-circumnavigation-1519-1522",
    "magna-carta-1215-detail": "magna-carta-1215",
    "majapahit-empire-peak-1350": "majapahit-empire-peak",
    "majapahit-peak-hayam-wuruk-1350": "majapahit-empire-peak",
    "malacca-sultanate-1400": "malacca-sultanate-founding",
    "mansa-musa-pilgrimage": "mansa-musa-hajj-1324",
    "mansa-musa-pilgrimage-1324": "mansa-musa-hajj-1324",
    "marshall-plan-us-europe-recovery-1948-detail": "marshall-plan-european-recovery-1948",
    "martin-luther-95-theses": "martin-luther-95-theses-1517",
    "marx-communist-manifesto": "communist-manifesto-1848",
    "meiji-restoration-japan-modernization": "meiji-restoration-japan-1868",
    "ming-dynasty-zheng-he-voyages": "zheng-he-voyages-1405",
    "minoan-eruption-thera-1628bce": "thera-eruption-minoan",
    "mongol-conquest-baghdad-1258": "mongol-destruction-of-baghdad",
    "mughal-empire-akbar-golden-age": "mughal-empire-peak-akbar",
    "mycenaean-greece-rise-1600bce": "mycenaean-civilization-rise",
    "napoleon-seizes-power": "napoleon-rise-to-power",
    "nelson-mandela-freed-1990": "nelson-mandela-release-1990",
    "newton-principia-mathematica": "newton-principia-1687",
    "norte-chico-civilization": "norte-chico-caral-americas-first-city",
    "nuremberg-war-crimes-trials-1945": "nuremberg-trials-1945",
    "olmec-colossal-heads-san-lorenzo-1200bce": "olmec-civilization-1500bce",
    "opium-wars-china-britain-1839": "opium-wars-china-unequal-treaties",
    "opium-wars-china-british-1839-expanded": "opium-wars-china-unequal-treaties",
    "ottoman-empire-suleiman-magnificent": "ottoman-peak-suleiman-1520",
    "pagan-kingdom-burma-1044": "pagan-kingdom-myanmar-1044",
    "pagan-kingdom-myanmar": "pagan-kingdom-myanmar-1044",
    "paris-climate-agreement-adopted-2015": "paris-climate-agreement-2015",
    "peace-of-westphalia": "thirty-years-war-peace-westphalia-1648",
    "polynesian-settlement-samoa-tonga-1000bce": "polynesian-settlement-samoa-tonga",
    "pope-urban-ii-first-crusade-1095": "first-crusade-1095-1099",
    "printing-press-gutenberg": "gutenberg-printing-press",
    "printing-revolution-gutenberg-1455": "gutenberg-bible-printed-1455",
    "qing-dynasty-conquers-china": "qing-dynasty-founding",
    "revolutions-of-1848-europe": "revolutions-1848-springtime-peoples",
    "rome-republic-founding-509bce-republican-values": "roman-republic-founding-509bce",
    "russo-japanese-war-1904": "russo-japanese-war-1904-1905",
    "rwandan-genocide-detail-1994": "rwandan-genocide-1994",
    "scientific-revolution-newton-laws-1687": "newton-principia-1687",
    "scramble-for-africa-berlin-conference": "berlin-conference-africa-partition-1884",
    "scramble-for-africa-congo-leopold": "congo-free-state-atrocities-1885",
    "settlement-australia-first-peoples": "aboriginal-australia-arrival",
    "shang-dynasty-oracle-bones-1250bce": "earliest-chinese-writing-oracle-bones",
    "silk-road-opens-130bce": "silk-road-established-han-dynasty-130bce",
    "simon-bolivar-liberation": "bolivar-latin-american-independence-1819",
    "simon-bolivar-south-american-independence-1819": "bolivar-latin-american-independence-1819",
    "song-dynasty-reunification-960": "song-dynasty-china-innovations-960",
    "songhai-empire-peak": "songhai-empire-askia-1493",
    "space-race-apollo-11-1969-moonlanding": "moon-landing-1969",
    "spanish-american-war-philippines-1898": "spanish-american-war-1898",
    "spanish-conquest-aztec-empire": "cortez-conquest-aztec-1519-1521",
    "spanish-conquest-inca-empire": "spanish-conquest-inca",
    "spanish-flu-pandemic-1918-detail": "spanish-flu-pandemic-1918-1919",
    "srivijaya-maritime-empire-650": "srivijaya-maritime-empire",
    "stonehenge-phase-1": "stonehenge-construction",
    "sukhothai-kingdom-1238": "sukhothai-kingdom-founding",
    "tang-dynasty-cosmopolitan-618": "tang-dynasty-golden-age",
    "thai-sukhothai-kingdom-1238": "sukhothai-kingdom-founding",
    "thirty-years-war": "thirty-years-war-1618-1648",
    "thirty-years-war-begins": "thirty-years-war-1618-1648",
    "treaty-of-westphalia-1648": "thirty-years-war-peace-westphalia-1648",
    "unification-italy-garibaldi-1861": "italian-unification-risorgimento",
    "vasco-da-gama-india-route": "vasco-da-gama-india-1498",
    "vedic-rigveda-composition-1500bce": "vedas-composition-india",
    "vietnam-war-end-1975-saigon": "vietnam-fall-saigon-1975",
    "viking-age-begins-lindisfarne": "viking-raids-begin-793",
    "year-of-africa-1960": "year-of-africa-independence-1960",
    "zulu-kingdom-shaka": "zulu-empire-shaka-1816",
    "zulu-kingdom-shaka-1818": "zulu-empire-shaka-1816",
    "zulu-war-isandlwana-1879": "anglo-zulu-war-isandlwana-1879",
}

# Look-alike pairs that are genuinely different events.
KNOWN_DISTINCT: set[frozenset[str]] = {
    frozenset(p) for p in [
        ("zimbabwe-plateau-gold-trade-1100", "great-zimbabwe-construction"),
        ("easter-island-moai-construction-1200", "polynesian-settlement-easter-island"),
        ("korean-war-1950-1953", "korean-war-armistice-1953"),
        ("newton-principia-1687", "leibniz-calculus-invention"),
        ("gulf-war-desert-storm-1991", "iraq-invades-kuwait-1990"),
        ("russia-crimean-war-ottoman-1853", "florence-nightingale-modern-nursing-1854"),
        ("east-india-company-founded", "dutch-east-india-company-founded"),
        ("california-gold-rush-1849", "australian-gold-rush-1851"),
        ("cuba-independence-war-1895", "philippine-revolution-1896"),
        ("death-of-prophet-muhammad", "ridda-wars-632"),
        ("easter-island-settlement-800", "settlement-hawaii-800"),
        ("opium-wars-china-unequal-treaties", "first-opium-war-treaty-nanjing"),
        ("usa-enters-wwi-1917", "armistice-wwi-november-1918"),
        ("battle-stalingrad-1942-1943", "ww2-pacific-battle-midway-1942"),
        ("mau-mau-uprising-kenya-1952", "decolonization-algeria-1954-1962"),
    ]
}

_STOPWORDS = {
    "the", "of", "a", "an", "and", "in", "on", "to", "by", "for", "at", "from", "with", "as",
    "is", "vs", "s", "its", "into", "over",
}
# Words too common in titles to signal a duplicate on their own.
_GENERIC = {
    "founds", "founded", "founding", "first", "end", "begins", "age", "empire", "kingdom",
    "great", "new", "birth", "peak", "construction", "after", "under", "rise", "history",
}


def _title_words(title: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", title.lower().replace("\u2019s", "").replace("'s", ""))
    return {w for w in words if w not in _STOPWORDS and w not in _GENERIC}


def load_events() -> dict[str, dict[str, Any]]:
    """slug -> event dict across all dict-based seed scripts (first definition wins)."""
    for name in ("asyncpg", "psycopg2", "psycopg2.extras"):
        sys.modules.setdefault(name, types.ModuleType(name))
    events: dict[str, dict[str, Any]] = {}
    for name in EVENT_MODULES:
        path = SEED_DIR / f"{name}.py"
        spec = importlib.util.spec_from_file_location(f"_chronicle_dupcheck_{name}", path)
        assert spec and spec.loader
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        for ev in getattr(module, "EVENTS", []):
            if isinstance(ev, dict) and ev.get("slug"):
                events.setdefault(ev["slug"], ev)
    return events


def is_near_duplicate(a: dict[str, Any], b: dict[str, Any]) -> bool:
    if abs(int(a["year"]) - int(b["year"])) > MAX_YEAR_GAP:
        return False
    wa, wb = _title_words(a["title"]), _title_words(b["title"])
    if not wa or not wb:
        return False
    if wa <= wb or wb <= wa:
        return True
    shared = len(wa & wb)
    return shared >= 2 and shared / min(len(wa), len(wb)) >= 0.5


def find_near_duplicates(events: dict[str, dict[str, Any]]) -> list[tuple[str, str]]:
    by_year: dict[int, list[str]] = defaultdict(list)
    for slug, ev in events.items():
        by_year[int(ev["year"])].append(slug)
    found = []
    for year in sorted(by_year):
        for other_year in range(year, year + MAX_YEAR_GAP + 1):
            for a in by_year[year]:
                for b in by_year.get(other_year, []):
                    if (year == other_year and a >= b) or frozenset((a, b)) in KNOWN_DISTINCT:
                        continue
                    if is_near_duplicate(events[a], events[b]):
                        found.append((a, b))
    return found


def check(events: dict[str, dict[str, Any]]) -> list[str]:
    problems = []
    for dup, keep in MERGED_DUPLICATES.items():
        if dup in events:
            problems.append(f"merged duplicate is back in the seeds: {dup} (merged into {keep})")
        if keep not in events:
            problems.append(f"merge target missing from the seeds: {keep}")
    for a, b in find_near_duplicates(events):
        problems.append(
            f"near-duplicate: {a} ({events[a]['year']}, {events[a]['title']!r}) ~ "
            f"{b} ({events[b]['year']}, {events[b]['title']!r})"
        )
    return problems


def main() -> int:
    events = load_events()
    problems = check(events)
    for p in problems:
        print(p)
    print(f"{len(events)} seed events, {len(problems)} problem(s)", file=sys.stderr)
    return 1 if problems and "--check" in sys.argv else 0


if __name__ == "__main__":
    raise SystemExit(main())
