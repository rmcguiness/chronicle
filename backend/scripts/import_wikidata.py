#!/usr/bin/env python3
"""Import notable historical events and their cause/effect links from Wikidata.

Writes ``backend/scripts/data/wikidata_events.json``, which ``seed_wikidata.py`` loads
into the database and ``scripts/export_demo_snapshot.py`` reads for the static demo.

What it pulls (Wikidata Query Service, https://query.wikidata.org/sparql):

* Candidate events: items that are an instance of an event class (war, battle, siege,
  treaty, revolution, earthquake, pandemic, ...) or a direct subclass of one, plus any
  dated item that states a cause or effect, filtered by sitelink count.
* For each candidate: English label and description, point in time / start time with
  its precision, coordinates (the item's own, else its location's, else its country's),
  place labels, the English Wikipedia article, and the sitelink count.
* Links between kept events from these properties:
    P828 has cause, P1542 has effect, P1478 has immediate cause,
    P1536 immediate cause of                     -> "direct"       (causes)
    P1479 has contributing factor, P1537 contributing factor of -> "contributing" (enables)
    P155 follows, P156 followed by, P361 part of -> "indirect"     (context)

Quality rules: an event needs an English label, description and Wikipedia article,
coordinates, and a date at decade precision or better between 5000 BCE and today. A
link is kept only when the cause does not start after the effect (one year of slack).
Events that match an event already in the hand-written seed scripts are not imported:
an exact or near-exact title match within a year becomes an alias (its links are
re-pointed to the existing slug), a looser match is dropped.

Importance comes from the sitelink count (how many Wikipedia language editions have
an article), scaled into the 0.40-0.92 range the hand-written seeds use.

Wikidata content is CC0. Query responses are cached on disk so a re-run with the same
options makes no network requests. Requests are sequential, with a pause between them,
and carry a descriptive User-Agent as the WDQS usage policy asks.

Usage (from the repo root, Python 3.10+, standard library only):
    python3 backend/scripts/import_wikidata.py                # fetch (or reuse cache) and write
    python3 backend/scripts/import_wikidata.py --max-events 4000
    python3 backend/scripts/import_wikidata.py --offline      # cache only, fail on a miss
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from typing import Any, Iterable

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

import duplicate_events  # noqa: E402

ENDPOINT = "https://query.wikidata.org/sparql"
USER_AGENT = "ChronicleImporter/1.0 (https://github.com/rmcguiness/chronicle; open-source history timeline)"
OUT_PATH = SCRIPT_DIR / "data" / "wikidata_events.json"
DEFAULT_CACHE = Path("/tmp/chronicle-wikidata-cache")
PAUSE_SECONDS = 1.5
BATCH = 250
MIN_YEAR = -5000
MAX_YEAR = date.today().year

# Event classes: QID -> Chronicle category. Direct instances and direct subclasses count.
EVENT_CLASSES: dict[str, str] = {
    "Q198": "war", "Q178561": "war", "Q188055": "war", "Q1261499": "war", "Q645883": "war",
    "Q831663": "war", "Q8465": "war", "Q467011": "war", "Q350604": "war", "Q180684": "war",
    "Q124734": "war", "Q51646": "war", "Q3199915": "war", "Q41397": "war",
    "Q131569": "political", "Q625298": "political", "Q10931": "political", "Q45382": "political",
    "Q3882219": "political", "Q1464916": "political", "Q273120": "political", "Q124757": "political",
    "Q49776": "political", "Q2223653": "political",
    "Q7944": "natural", "Q7692360": "natural", "Q12184": "natural", "Q44512": "natural",
    "Q168247": "natural", "Q8070": "natural", "Q3839081": "natural",
    "Q752783": "discovery", "Q2401485": "discovery",
    "Q172754": "cultural", "Q51645": "cultural", "Q114380": "cultural", "Q13418847": "cultural",
}

# Classes whose instances need more sitelinks than the era threshold (many minor items).
CLASS_SITELINK_FLOOR = {"Q752783": 30, "Q273120": 25, "Q2223653": 25, "Q124757": 25, "Q49776": 20}

# Per-era minimum sitelink counts: (year below which the threshold applies, threshold).
ERA_THRESHOLDS = [(-500, 6), (500, 8), (1500, 10), (1800, 14), (1900, 18), (10_000, 24)]

LINK_PROPS = {
    "P828": ("effect<-cause", "direct", 0.8),        # item has cause value
    "P1478": ("effect<-cause", "direct", 0.85),      # item has immediate cause value
    "P1479": ("effect<-cause", "contributing", 0.6),  # item has contributing factor value
    "P1542": ("cause->effect", "direct", 0.8),        # item has effect value
    "P1536": ("cause->effect", "direct", 0.85),       # item is immediate cause of value
    "P1537": ("cause->effect", "contributing", 0.6),  # item is contributing factor of value
    "P155": ("effect<-cause", "indirect", 0.5),       # item follows value
    "P156": ("cause->effect", "indirect", 0.5),       # item is followed by value
    "P361": ("part", "indirect", 0.4),                # item is part of value
}
LINK_LABEL = {
    "P828": "has cause", "P1478": "has immediate cause", "P1479": "has contributing factor",
    "P1542": "has effect", "P1536": "immediate cause of", "P1537": "contributing factor of",
    "P155": "follows", "P156": "followed by", "P361": "part of",
}
# A war with hundreds of battles would turn into a star; keep its best-known parts only.
MAX_PARTS_PER_WHOLE = 6

# An imported event with exactly the same title as a seed event this many years away is
# treated as the same event (dates of long wars and constructions vary by source).
SAME_TITLE_WINDOW = 12

MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"]


# ─────────────────────────────────────────────────────────────────────────────
# SPARQL client
# ─────────────────────────────────────────────────────────────────────────────

class Wdqs:
    def __init__(self, cache_dir: Path, offline: bool) -> None:
        self.cache_dir = cache_dir
        self.offline = offline
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.requests = 0

    def select(self, query: str) -> list[dict[str, str]]:
        key = hashlib.sha256(query.encode()).hexdigest()[:24]
        path = self.cache_dir / f"{key}.json"
        if path.exists():
            return json.loads(path.read_text())
        if self.offline:
            raise SystemExit(f"cache miss in --offline mode: {path}")
        rows = self._fetch(query)
        path.write_text(json.dumps(rows))
        return rows

    def _fetch(self, query: str) -> list[dict[str, str]]:
        body = urllib.parse.urlencode({"query": query}).encode()
        for attempt in range(6):
            time.sleep(PAUSE_SECONDS * (1 + attempt * 2))
            req = urllib.request.Request(
                ENDPOINT, data=body, method="POST",
                headers={"User-Agent": USER_AGENT, "Accept": "application/sparql-results+json",
                         "Content-Type": "application/x-www-form-urlencoded"},
            )
            try:
                with urllib.request.urlopen(req, timeout=90) as res:
                    data = json.loads(res.read())
                self.requests += 1
                return [{k: v["value"] for k, v in b.items()} for b in data["results"]["bindings"]]
            except urllib.error.HTTPError as err:
                retry_after = err.headers.get("Retry-After") if err.headers else None
                print(f"  WDQS HTTP {err.code} (attempt {attempt + 1})", file=sys.stderr)
                if err.code == 429 and retry_after and retry_after.isdigit():
                    time.sleep(min(int(retry_after), 90))
                elif err.code not in (429, 500, 502, 503, 504):
                    raise
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as err:
                print(f"  WDQS error {err!r} (attempt {attempt + 1})", file=sys.stderr)
        raise SystemExit("WDQS kept failing; try again later")


def qid(uri: str) -> str:
    return uri.rsplit("/", 1)[-1]


def chunks(items: list[str], size: int) -> Iterable[list[str]]:
    for i in range(0, len(items), size):
        yield items[i:i + size]


def values(qids: list[str]) -> str:
    return " ".join(f"wd:{q}" for q in qids)


# ─────────────────────────────────────────────────────────────────────────────
# Fetch
# ─────────────────────────────────────────────────────────────────────────────

def fetch_candidates(wd: Wdqs, min_sitelinks: int) -> dict[str, dict[str, Any]]:
    """qid -> {sitelinks, classes} for every event-class instance with enough sitelinks."""
    out: dict[str, dict[str, Any]] = {}
    for cls in EVENT_CLASSES:
        floor = max(min_sitelinks, CLASS_SITELINK_FLOOR.get(cls, 0))
        query = f"""
SELECT DISTINCT ?item ?sl WHERE {{
  {{ ?item wdt:P31 wd:{cls} . }} UNION {{ ?item wdt:P31/wdt:P279 wd:{cls} . }}
  ?item wikibase:sitelinks ?sl . FILTER(?sl >= {floor})
}}"""
        rows = wd.select(query)
        for r in rows:
            entry = out.setdefault(qid(r["item"]), {"sitelinks": int(r["sl"]), "classes": set()})
            entry["classes"].add(cls)
        print(f"  class {cls}: {len(rows)} items", file=sys.stderr)
    for prop in ("P828", "P1542", "P1478", "P1479", "P1536", "P1537"):
        query = f"""
SELECT DISTINCT ?item ?sl WHERE {{
  ?item wdt:{prop} ?x . ?item wdt:P585|wdt:P580 ?d .
  ?item wikibase:sitelinks ?sl . FILTER(?sl >= {min_sitelinks + 2})
  FILTER NOT EXISTS {{ ?item wdt:P31 wd:Q5 }}
}}"""
        rows = wd.select(query)
        for r in rows:
            out.setdefault(qid(r["item"]), {"sitelinks": int(r["sl"]), "classes": set()})
        print(f"  items with {prop}: {len(rows)}", file=sys.stderr)
    return out


def fetch_details(wd: Wdqs, qids: list[str]) -> dict[str, dict[str, Any]]:
    details: dict[str, dict[str, Any]] = defaultdict(dict)
    for batch in chunks(sorted(qids), BATCH):
        vs = values(batch)
        for r in wd.select(f"""
SELECT ?item ?label ?desc ?article WHERE {{
  VALUES ?item {{ {vs} }}
  ?item rdfs:label ?label . FILTER(LANG(?label) = "en")
  OPTIONAL {{ ?item schema:description ?desc . FILTER(LANG(?desc) = "en") }}
  OPTIONAL {{ ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> . }}
}}"""):
            d = details[qid(r["item"])]
            d["label"] = r["label"]
            d["desc"] = r.get("desc")
            d["article"] = r.get("article")
        for r in wd.select(f"""
SELECT ?item ?prop ?time ?prec WHERE {{
  hint:Query hint:optimizer "None" .
  VALUES ?item {{ {vs} }}
  VALUES (?p ?psv ?prop) {{ (p:P585 psv:P585 "P585") (p:P580 psv:P580 "P580") (p:P582 psv:P582 "P582") }}
  ?item ?p ?st . ?st ?psv ?tv . ?tv wikibase:timeValue ?time ; wikibase:timePrecision ?prec .
  ?st wikibase:rank ?rank . FILTER(?rank != wikibase:DeprecatedRank)
}}"""):
            d = details[qid(r["item"])]
            key = r["prop"]
            prev = d.get(key)
            cand = (int(r["prec"]), r["time"])
            # Keep the most precise value; ties go to the earliest date.
            if prev is None or cand[0] > prev[0] or (cand[0] == prev[0] and cand[1] < prev[1]):
                d[key] = cand
    return details


def fetch_places(wd: Wdqs, qids: list[str], details: dict[str, dict[str, Any]]) -> None:
    """Coordinates, place labels and P31 classes, for the items that passed the first filter."""
    for batch in chunks(sorted(qids), BATCH):
        vs = values(batch)
        for r in wd.select(f"""
SELECT ?item ?coord ?locCoord ?locLabel ?countryLabel ?countryCoord WHERE {{
  hint:Query hint:optimizer "None" .
  VALUES ?item {{ {vs} }}
  OPTIONAL {{ ?item wdt:P625 ?coord . }}
  OPTIONAL {{ ?item wdt:P276 ?loc . ?loc rdfs:label ?locLabel . FILTER(LANG(?locLabel) = "en")
             OPTIONAL {{ ?loc wdt:P625 ?locCoord . }} }}
  OPTIONAL {{ ?item wdt:P17 ?country . ?country rdfs:label ?countryLabel . FILTER(LANG(?countryLabel) = "en")
             OPTIONAL {{ ?country wdt:P625 ?countryCoord . }} }}
}}"""):
            d = details[qid(r["item"])]
            for k in ("coord", "locCoord", "locLabel", "countryLabel", "countryCoord"):
                if r.get(k) and not d.get(k):
                    d[k] = r[k]
            if r.get("countryLabel"):
                d.setdefault("countries", set()).add(r["countryLabel"])
        for r in wd.select(f"""
SELECT ?item ?cls WHERE {{ VALUES ?item {{ {vs} }} ?item wdt:P31 ?cls . }}"""):
            details[qid(r["item"])].setdefault("p31", set()).add(qid(r["cls"]))



CAUSAL_PROPS = ("P828", "P1478", "P1479", "P1542", "P1536", "P1537", "P155", "P156")
# Events reached through a cause/effect/sequence link need fewer sitelinks than the
# era threshold, since the link itself is the reason to include them.
EXPANSION_MIN_SITELINKS = 4


def fetch_incoming(wd: Wdqs, qids: list[str]) -> list[tuple[str, str, str]]:
    """(other item, prop, our item) triples where another item names one of ours."""
    props = " ".join(f"wdt:{p}" for p in CAUSAL_PROPS)
    out = []
    for batch in chunks(sorted(qids), BATCH):
        for r in wd.select(f"""
SELECT ?x ?p ?item WHERE {{
  hint:Query hint:optimizer "None" .
  VALUES ?item {{ {values(batch)} }}
  VALUES ?p {{ {props} }}
  ?x ?p ?item .
}}"""):
            out.append((qid(r["x"]), qid(r["p"]), qid(r["item"])))
    return out


def fetch_sitelinks(wd: Wdqs, qids: list[str]) -> dict[str, int]:
    out: dict[str, int] = {}
    for batch in chunks(sorted(qids), BATCH):
        for r in wd.select(f"""
SELECT ?item ?sl WHERE {{ VALUES ?item {{ {values(batch)} }} ?item wikibase:sitelinks ?sl . }}"""):
            out[qid(r["item"])] = int(r["sl"])
    return out


def fetch_links(wd: Wdqs, qids: list[str]) -> list[tuple[str, str, str]]:
    props = " ".join(f"wdt:{p}" for p in LINK_PROPS)
    out = []
    for batch in chunks(sorted(qids), BATCH):
        for r in wd.select(f"""
SELECT ?item ?p ?o WHERE {{
  hint:Query hint:optimizer "None" .
  VALUES ?item {{ {values(batch)} }}
  VALUES ?p {{ {props} }}
  ?item ?p ?o . FILTER(isIRI(?o))
}}"""):
            out.append((qid(r["item"]), qid(r["p"]), qid(r["o"])))
    return out


# ─────────────────────────────────────────────────────────────────────────────
# Transform
# ─────────────────────────────────────────────────────────────────────────────

def parse_time(value: str) -> tuple[int, int, int] | None:
    """WDQS xsd:dateTime -> (year, month, day). BCE years are made historical (no year 0)."""
    m = re.match(r"^(-?)(\d+)-(\d\d)-(\d\d)T", value)
    if not m:
        return None
    year = int(m.group(2)) * (-1 if m.group(1) else 1)
    # WDQS writes BCE dates in XSD 1.1 form, where year 0 is 1 BCE and -1 is 2 BCE.
    if year <= 0:
        year -= 1
    return year, int(m.group(3)), int(m.group(4))


def year_label(year: int) -> str:
    return f"{-year} BCE" if year < 0 else f"{year}"


def date_display(start: tuple[int, str] | None, end: tuple[int, str] | None) -> tuple[int, str] | None:
    """Return (year, human-readable date) or None if the date is too vague."""
    if not start:
        return None
    prec, raw = start
    parsed = parse_time(raw)
    if not parsed or prec < 8:
        return None
    year, month, day = parsed
    if prec == 8:
        decade = year - (year % 10) if year > 0 else year
        text = f"c. {decade}s" if year > 0 else f"c. {-year} BCE"
    elif prec >= 11 and year >= 1583:
        text = f"{MONTHS[month - 1]} {day}, {year}"
    elif prec >= 10 and year >= 1583:
        text = f"{MONTHS[month - 1]} {year}"
    else:
        text = year_label(year)
    if end and end[0] >= 9:
        end_parsed = parse_time(end[1])
        if end_parsed and end_parsed[0] > year:
            end_year = end_parsed[0]
            if year < 0 and end_year < 0:
                text = f"{-year}–{-end_year} BCE"
            elif year < 0:
                text = f"{-year} BCE – {end_year} CE"
            elif text == str(year):
                text = f"{year}–{end_year}"
            else:
                text = f"{text} – {end_year}"
    return year, text


def parse_point(wkt: str | None) -> tuple[float, float] | None:
    if not wkt or not wkt.startswith("Point("):
        return None  # skip globe-qualified (non-Earth) coordinates
    lng, lat = wkt[6:-1].split()
    return round(float(lat), 4), round(float(lng), 4)


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:70].strip("-")


def norm_title(title: str) -> str:
    return " ".join(re.findall(r"[a-z0-9]+", unicodedata.normalize("NFKD", title).lower()))


def importance(sitelinks: int) -> float:
    score = 0.40 + 0.52 * math.log(max(sitelinks, 6) / 6) / math.log(250 / 6)
    return round(min(0.92, max(0.40, score)), 3)


def era_threshold(year: int) -> int:
    for limit, threshold in ERA_THRESHOLDS:
        if year < limit:
            return threshold
    return ERA_THRESHOLDS[-1][1]


def category_for(classes: set[str]) -> str:
    cats = [EVENT_CLASSES[c] for c in sorted(classes) if c in EVENT_CLASSES]
    if not cats:
        return "cultural"
    return Counter(cats).most_common(1)[0][0]


def era_label(year: int) -> str:
    if year < -3000:
        return "Neolithic"
    if year < -1200:
        return "Bronze Age"
    if year < -500:
        return "Iron Age"
    if year < 500:
        return "Classical antiquity"
    if year < 1000:
        return "Early Middle Ages"
    if year < 1500:
        return "Late Middle Ages"
    if year < 1800:
        return "Early modern period"
    if year < 1914:
        return "Long 19th century"
    if year < 1945:
        return "World wars era"
    if year < 1991:
        return "Cold War era"
    return "Contemporary era"


def prefilter(cand: dict[str, Any], d: dict[str, Any], classes: set[str]) -> bool:
    """Cheap checks on the first batch of details, before the slower place queries."""
    if not (d.get("label") and d.get("desc") and d.get("article")):
        return False
    dated = date_display(d.get("P585") or d.get("P580"), None)
    if not dated or not (MIN_YEAR <= dated[0] <= MAX_YEAR):
        return False
    if cand.get("expansion"):
        return cand["sitelinks"] >= EXPANSION_MIN_SITELINKS
    floor = max([era_threshold(dated[0])] + [CLASS_SITELINK_FLOOR.get(c, 0) for c in classes])
    return cand["sitelinks"] >= floor


def build_events(candidates: dict[str, dict[str, Any]], details: dict[str, dict[str, Any]],
                 class_hits: dict[str, set[str]]) -> tuple[dict[str, dict[str, Any]], Counter]:
    events: dict[str, dict[str, Any]] = {}
    dropped: Counter = Counter()
    for q, cand in candidates.items():
        d = details.get(q, {})
        label, desc, article = d.get("label"), d.get("desc"), d.get("article")
        if not label or re.fullmatch(r"Q\d+", label):
            dropped["no English label"] += 1
            continue
        if not article:
            dropped["no English Wikipedia article"] += 1
            continue
        if not desc:
            dropped["no English description"] += 1
            continue
        if "Q5" in d.get("p31", set()):
            dropped["is a person"] += 1
            continue
        dated = date_display(d.get("P585") or d.get("P580"), d.get("P582") if "P585" not in d else None)
        if not dated:
            dropped["no usable date"] += 1
            continue
        year, display = dated
        if not (MIN_YEAR <= year <= MAX_YEAR):
            dropped["out of date range"] += 1
            continue
        point = parse_point(d.get("coord")) or parse_point(d.get("locCoord"))
        if not point and len(d.get("countries", ())) == 1:
            point = parse_point(d.get("countryCoord"))  # a country centroid is close enough
        if not point:
            dropped["no coordinates (or only several countries' centroids)"] += 1
            continue
        classes = set(d.get("p31", set())) | class_hits.get(q, set())
        floor = max([era_threshold(year)] + [CLASS_SITELINK_FLOOR.get(c, 0) for c in classes])
        if cand.get("expansion"):
            floor = EXPANSION_MIN_SITELINKS
        if cand["sitelinks"] < floor:
            dropped["below era sitelink threshold"] += 1
            continue
        place = ", ".join(p for p in (d.get("locLabel"), d.get("countryLabel")) if p and not re.fullmatch(r"Q\d+", p))
        events[q] = {
            "qid": q,
            "title": label[0].upper() + label[1:],
            "year": year,
            "date_display": display,
            "lat": point[0],
            "lng": point[1],
            "geo_modern": place or None,
            "geo_era_label": era_label(year),
            "category": category_for(classes),
            "sitelinks": cand["sitelinks"],
            "importance_score": importance(cand["sitelinks"]),
            "summary": desc[0].upper() + desc[1:],
            "wikipedia_slug": urllib.parse.unquote(article.rsplit("/wiki/", 1)[-1]),
        }
    return events, dropped


def match_existing(events: dict[str, dict[str, Any]], existing: dict[str, dict[str, Any]]
                   ) -> tuple[dict[str, str], set[str]]:
    """Return (qid -> existing slug aliases, qids to drop as loose duplicates)."""
    by_key: dict[tuple[str, int], str] = {}
    by_year: dict[int, list[str]] = defaultdict(list)
    for slug, ev in existing.items():
        y = int(ev["year"])
        by_year[y].append(slug)
        for variant in {ev["title"], ev["title"].split(" — ")[0], re.sub(r"\s*\(.*?\)", "", ev["title"])}:
            by_key.setdefault((norm_title(variant), y), slug)
    aliases: dict[str, str] = {}
    drop: set[str] = set()
    for q, ev in events.items():
        t = norm_title(ev["title"])
        hit = next((by_key[(t, y)] for y in range(ev["year"] - SAME_TITLE_WINDOW, ev["year"] + SAME_TITLE_WINDOW + 1)
                    if (t, y) in by_key), None)
        if hit:
            aliases[q] = hit
            continue
        probe = {"title": ev["title"], "year": ev["year"]}
        for y in range(ev["year"] - duplicate_events.MAX_YEAR_GAP, ev["year"] + duplicate_events.MAX_YEAR_GAP + 1):
            if any(duplicate_events.is_near_duplicate(probe, existing[s]) for s in by_year.get(y, [])):
                drop.add(q)
                break
    return aliases, drop


def make_slugs(events: dict[str, dict[str, Any]], taken: set[str]) -> dict[str, str]:
    slugs: dict[str, str] = {}
    for q in sorted(events, key=lambda q: (-events[q]["sitelinks"], q)):
        ev = events[q]
        year = ev["year"]
        suffix = f"{-year}bce" if year < 0 else str(year)
        base = slugify(ev["title"])
        slug = base if base.endswith(suffix) else f"{base}-{suffix}"
        if slug in taken:
            slug = f"{slug}-{q.lower()}"
        taken.add(slug)
        slugs[q] = slug
    return slugs


def build_links(raw: list[tuple[str, str, str]], events: dict[str, dict[str, Any]],
                ids: dict[str, str], aliases: dict[str, str]) -> tuple[list[dict[str, Any]], Counter]:
    """Map raw (item, prop, value) triples to seed-format link dicts between known events."""
    def year_of(q: str) -> int | None:
        return events[q]["year"] if q in events else None

    def title_of(q: str) -> str:
        return events[q]["title"] if q in events else ids.get(q, q)

    links: dict[tuple[str, str], dict[str, Any]] = {}
    dropped: Counter = Counter()
    parts: dict[str, list[str]] = defaultdict(list)
    for item, prop, value in raw:
        if item not in ids or value not in ids or ids[item] == ids[value]:
            continue
        direction, link_type, strength = LINK_PROPS[prop]
        if direction == "part":
            parts[value].append(item)
            continue
        cause, effect = (value, item) if direction == "effect<-cause" else (item, value)
        yc, ye = year_of(cause), year_of(effect)
        if yc is not None and ye is not None and yc > ye + 1:
            dropped["cause dated after effect"] += 1
            continue
        if prop in ("P828", "P1478", "P1479"):
            desc = f"Wikidata lists {title_of(cause)} as a cause of {title_of(effect)} ({LINK_LABEL[prop]})."
        elif prop in ("P1542", "P1536", "P1537"):
            desc = f"Wikidata lists {title_of(effect)} as an effect of {title_of(cause)} ({LINK_LABEL[prop]})."
        else:
            desc = f"{title_of(effect)} followed {title_of(cause)} in sequence (Wikidata {LINK_LABEL[prop]})."
        key = (ids[cause], ids[effect])
        prev = links.get(key)
        if prev is None or strength > prev["strength"]:
            links[key] = {"cause": ids[cause], "effect": ids[effect], "type": link_type,
                          "strength": strength, "desc": desc, "wikidata_property": prop}
    for whole, members in parts.items():
        if whole not in events:
            continue
        members = sorted(set(m for m in members if m in events), key=lambda m: (-events[m]["sitelinks"], m))
        if whole in aliases:
            # Aliased seed events often mark one moment of a broad Wikidata topic (the
            # storming of the Bastille for "French Revolution"), so parts would mislead.
            continue
        for m in members[:MAX_PARTS_PER_WHOLE]:
            a, b = (whole, m) if events[whole]["year"] <= events[m]["year"] else (m, whole)
            key = (ids[a], ids[b])
            if key in links or (ids[b], ids[a]) in links:
                continue
            links[key] = {"cause": ids[a], "effect": ids[b], "type": "indirect", "strength": 0.4,
                          "desc": f"{events[m]['title']} was part of {events[whole]['title']} (Wikidata part of).",
                          "wikidata_property": "P361"}
    return sorted(links.values(), key=lambda l: (l["cause"], l["effect"])), dropped


def cap_events(events: dict[str, dict[str, Any]], max_events: int, linked: set[str]) -> dict[str, dict[str, Any]]:
    """Keep the best-known events with a per-century cap so no era crowds out the rest."""
    if len(events) <= max_events:
        return events
    by_century: dict[int, list[str]] = defaultdict(list)
    for q, ev in events.items():
        by_century[ev["year"] // 100].append(q)
    for qs in by_century.values():
        qs.sort(key=lambda q: (q not in linked, -events[q]["sitelinks"], q))
    per_century = max_events // max(1, len(by_century))
    kept: set[str] = set()
    for qs in by_century.values():
        kept.update(qs[:per_century])
    rest = sorted((q for q in events if q not in kept),
                  key=lambda q: (q not in linked, -events[q]["sitelinks"], q))
    kept.update(rest[: max_events - len(kept)])
    return {q: events[q] for q in events if q in kept}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    ap.add_argument("--max-events", type=int, default=6000)
    ap.add_argument("--min-sitelinks", type=int, default=6)
    ap.add_argument("--cache-dir", type=Path, default=DEFAULT_CACHE)
    ap.add_argument("--offline", action="store_true")
    ap.add_argument("--out", type=Path, default=OUT_PATH)
    args = ap.parse_args()

    wd = Wdqs(args.cache_dir, args.offline)
    print("Fetching candidates…", file=sys.stderr)
    candidates = fetch_candidates(wd, args.min_sitelinks)
    class_hits = {q: c["classes"] for q, c in candidates.items()}
    print(f"{len(candidates)} candidates; fetching details…", file=sys.stderr)
    details = fetch_details(wd, list(candidates))
    survivors = [q for q in candidates if prefilter(candidates[q], details.get(q, {}), class_hits.get(q, set()))]
    print(f"{len(survivors)} have a label, description, article and usable date; fetching places…", file=sys.stderr)
    fetch_places(wd, survivors, details)
    events, dropped = build_events({q: candidates[q] for q in survivors}, details, class_hits)
    dropped["missing label, description, article or date, or too few sitelinks"] += len(candidates) - len(survivors)
    print(f"{len(events)} events pass the quality rules; fetching links…", file=sys.stderr)

    raw_links = fetch_links(wd, list(events))
    raw_links += fetch_incoming(wd, list(events))

    # One hop out: events named as a cause, effect, predecessor or successor of a kept
    # event (in either direction) join the import with a lower sitelink bar.
    hop = sorted({q for item, p, value in raw_links if p in CAUSAL_PROPS
                  for q in (item, value) if q not in events and q not in candidates})
    print(f"{len(hop)} linked items outside the set; checking them…", file=sys.stderr)
    hop_sl = fetch_sitelinks(wd, hop)
    hop_cands = {q: {"sitelinks": n, "classes": set(), "expansion": True}
                 for q, n in hop_sl.items() if n >= EXPANSION_MIN_SITELINKS}
    hop_details = fetch_details(wd, list(hop_cands))
    hop_ok = [q for q in hop_cands if prefilter(hop_cands[q], hop_details.get(q, {}), set())]
    fetch_places(wd, hop_ok, hop_details)
    hop_events, hop_dropped = build_events({q: hop_cands[q] for q in hop_ok}, hop_details, {})
    for q in list(hop_events):
        if re.search(r"\b(century|millennium|era|period|age)\b", hop_events[q]["title"], re.I) and \
                hop_events[q]["summary"].lower().startswith(("period", "era", "historical period")):
            hop_events.pop(q)  # long periods are not events
    print(f"  {len(hop_events)} added from links", file=sys.stderr)
    events.update(hop_events)
    raw_links += fetch_links(wd, list(hop_events))
    dropped["linked item without a usable date, place or article"] += len(hop_cands) - len(hop_events)
    existing = duplicate_events.load_events(exclude=("seed_wikidata",))
    aliases, loose = match_existing(events, existing)
    for q in loose:
        events.pop(q)
    dropped["loose match with an existing seed event"] += len(loose)
    dropped["alias of an existing seed event"] += len(aliases)
    alias_events = {q: events.pop(q) for q in list(aliases)}

    # Same normalized title and year within Wikidata itself: keep the better-known item.
    seen: dict[tuple[str, int], str] = {}
    for q in sorted(events, key=lambda q: (-events[q]["sitelinks"], q)):
        key = (norm_title(events[q]["title"]), events[q]["year"])
        if key in seen:
            aliases[q] = seen[key]
            alias_events[q] = events.pop(q)
            dropped["same title and year as another Wikidata item"] += 1
        else:
            seen[key] = q

    linked = {q for item, _p, value in raw_links for q in (item, value)}
    before_cap = len(events)
    events = cap_events(events, args.max_events, linked)
    dropped["over the size cap"] += before_cap - len(events)

    slugs = make_slugs(events, set(existing))
    ids: dict[str, str] = dict(slugs)
    for q, target in aliases.items():
        ids[q] = slugs.get(target, target)  # target is an existing slug or a kept QID
    all_events = {**events, **alias_events}
    links, link_drops = build_links(raw_links, all_events, ids, aliases)
    # Drop links whose endpoints both fell outside the import (alias-to-alias links).
    imported = set(slugs.values())
    links = [l for l in links if l["cause"] in imported or l["effect"] in imported]

    # Many distinct events share a name (five sieges of Jerusalem); add the year to every
    # title that is not unique across the imported and hand-written events.
    title_count = Counter(norm_title(ev["title"]) for ev in events.values())
    for ev in existing.values():
        title_count[norm_title(ev["title"])] += 1
    for ev in events.values():
        if title_count[norm_title(ev["title"])] > 1 and not re.search(r"\(\d", ev["title"]):
            ev["title"] = f"{ev['title']} ({year_label(ev['year'])})"

    out_events = []
    for q in sorted(events, key=lambda q: (events[q]["year"], slugs[q])):
        ev = dict(events[q])
        ev.pop("sitelinks")
        out_events.append({"slug": slugs[q], "wikidata_id": ev.pop("qid"), **ev})
    payload = {
        "source": "Wikidata (https://www.wikidata.org), via the Wikidata Query Service",
        "license": "CC0 1.0 (Wikidata content). Chronicle's data license applies to the compiled dataset; see LICENSE-DATA.md.",
        "generator": "backend/scripts/import_wikidata.py",
        "options": {"max_events": args.max_events, "min_sitelinks": args.min_sitelinks},
        "aliases": {q: ids[q] for q in sorted(aliases) if ids[q] in existing},
        "events": out_events,
        "links": links,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=0, sort_keys=False) + "\n")

    print(f"\nWrote {args.out.relative_to(Path.cwd()) if args.out.is_relative_to(Path.cwd()) else args.out}",
          file=sys.stderr)
    print(f"  events: {len(out_events)}  links: {len(links)}  aliases to existing seeds: {len(payload['aliases'])}",
          file=sys.stderr)
    print(f"  link types: {dict(Counter(l['type'] for l in links))}", file=sys.stderr)
    for reason, n in sorted({**dropped, **link_drops}.items(), key=lambda kv: -kv[1]):
        print(f"  dropped ({reason}): {n}", file=sys.stderr)
    print(f"  WDQS requests this run: {wd.requests}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
