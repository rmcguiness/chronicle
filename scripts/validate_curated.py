#!/usr/bin/env python3
"""Check the cited batches in data/curated/ before they reach the timeline.

Every curated event, causal link and per-party perspective must carry at least one
citation whose source has an http(s) URL. Links need a confidence level and a one-line
rationale; chains need a type and must follow links that exist. Narrator-voice text is
scanned for hero/villain and verdict words (see docs/DATA_PIPELINE.md, "Neutral voice").

Usage (from the repo root, standard library only):
    python3 scripts/validate_curated.py                  # structure + citations (CI)
    python3 scripts/validate_curated.py --verify-quotes  # also re-fetch every URL and
                                                         # check each quote appears there

Exit code 1 when any error is found. --verify-quotes needs network access and reports
pages that block automated fetches separately, as warnings.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from curated import CHAIN_TYPES, CONFIDENCE_LEVELS, CURATED_DIR, LINK_TYPES, SOURCE_TYPES, load_batches  # noqa: E402

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
# Narrator-voice words that cast a party as hero or villain or pass a moral verdict.
# A word inside quotation marks is a quoted, attributed use and is allowed.
LOADED_WORDS = [
    "hero", "heroes", "heroic", "villain", "villains", "villainous", "evil", "wicked", "noble",
    "brave", "bravely", "cowardly", "barbaric", "savage", "monstrous", "infamous", "notorious",
    "glorious", "righteous", "treacherous", "fanatic", "fanatical", "atrocious", "reckless",
    "innocent", "martyr", "tyrant", "madman",
]
LOADED_RE = re.compile(r"\b(" + "|".join(LOADED_WORDS) + r")\b", re.IGNORECASE)
# Stock metaphors the house style avoids in narrator voice.
METAPHOR_RE = re.compile(r"\b(powder keg|tinderbox|domino(?:es)? effect|lit the fuse|sleepwalk\w*)\b", re.IGNORECASE)
QUOTED_RE = re.compile(r'"[^"]*"|“[^”]*”')
NARRATOR_FIELDS = ("title", "summary", "description", "rationale", "wanted", "feared", "remembered")
MIN_QUOTE_CHARS = 20


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, where: str, msg: str) -> None:
        self.errors.append(f"{where}: {msg}")

    def warn(self, where: str, msg: str) -> None:
        self.warnings.append(f"{where}: {msg}")


def check_text(rep: Report, where: str, obj: dict[str, Any]) -> None:
    for field in NARRATOR_FIELDS:
        text = obj.get(field)
        if not isinstance(text, str):
            continue
        for m in LOADED_RE.finditer(QUOTED_RE.sub("", text)):
            rep.error(where, f"loaded word {m.group(0)!r} in {field} (attribute it in a citation instead)")
        for m in METAPHOR_RE.finditer(text):
            rep.error(where, f"stock metaphor {m.group(0)!r} in {field}")


def check_citations(rep: Report, where: str, cites: Any, sources: dict[str, Any], used: set[str]) -> None:
    if not isinstance(cites, list) or not cites:
        rep.error(where, "needs at least one citation")
        return
    for i, c in enumerate(cites):
        cw = f"{where} citation {i + 1}"
        sid = c.get("source") if isinstance(c, dict) else None
        if sid not in sources:
            rep.error(cw, f"unknown source {sid!r}")
            continue
        used.add(sid)
        url = str(sources[sid].get("url") or "")
        if not url.startswith(("http://", "https://")):
            rep.error(cw, f"source {sid!r} has no http(s) URL")
        quote = c.get("quote") or ""
        if len(quote) < MIN_QUOTE_CHARS and not c.get("locator"):
            rep.error(cw, "needs a supporting quote (20+ characters) or a page/section locator")


def validate_batch(batch: dict[str, Any], rep: Report, known_slugs: set[str]) -> None:
    name = batch.get("_path", batch.get("batch", "?"))
    sources = batch.get("sources") or {}
    used: set[str] = set()
    for sid, src in sources.items():
        if not SLUG_RE.match(sid):
            rep.error(f"{name} source {sid}", "source ids are lowercase-hyphenated")
        if not src.get("title"):
            rep.error(f"{name} source {sid}", "missing title")
        if src.get("source_type") not in SOURCE_TYPES:
            rep.error(f"{name} source {sid}", f"source_type must be one of {SOURCE_TYPES}")
        if not str(src.get("url") or "").startswith(("http://", "https://")):
            rep.error(f"{name} source {sid}", "missing http(s) url")

    slugs: set[str] = set()
    for ev in batch.get("events", []):
        slug = ev.get("slug", "?")
        where = f"{name} event {slug}"
        if not SLUG_RE.match(slug):
            rep.error(where, "slug must be lowercase-hyphenated")
        if slug in slugs:
            rep.error(where, "duplicate slug in batch")
        slugs.add(slug)
        for key in ("title", "year", "lat", "lng", "category", "summary"):
            if ev.get(key) in (None, ""):
                rep.error(where, f"missing {key}")
        if not isinstance(ev.get("year"), int):
            rep.error(where, "year must be an integer (negative for BCE)")
        if isinstance(ev.get("lat"), (int, float)) and not -90 <= ev["lat"] <= 90:
            rep.error(where, "lat out of range")
        if isinstance(ev.get("lng"), (int, float)) and not -180 <= ev["lng"] <= 180:
            rep.error(where, "lng out of range")
        if len(str(ev.get("summary", ""))) > 220:
            rep.warn(where, "summary is longer than 220 characters (cards clip at 150)")
        check_text(rep, where, ev)
        check_citations(rep, where, ev.get("citations"), sources, used)
        parties: set[str] = set()
        for j, p in enumerate(ev.get("perspectives") or []):
            pw = f"{where} perspective {p.get('party', j + 1)!r}"
            if not p.get("party"):
                rep.error(pw, "missing party")
            if p.get("party") in parties:
                rep.error(pw, "duplicate party")
            parties.add(p.get("party"))
            for key in ("wanted", "feared"):
                if not p.get(key):
                    rep.error(pw, f"missing {key}")
            check_text(rep, pw, p)
            check_citations(rep, pw, p.get("citations"), sources, used)
        if ev.get("perspectives") and len(parties) < 2:
            rep.error(where, "perspectives need at least two parties")

    all_slugs = known_slugs | slugs
    pairs: set[tuple[str, str]] = set()
    years = {ev["slug"]: ev.get("year") for ev in batch.get("events", []) if "slug" in ev}
    for link in batch.get("links", []):
        cause, effect = link.get("cause"), link.get("effect")
        where = f"{name} link {cause} -> {effect}"
        for end in (cause, effect):
            if end not in all_slugs:
                rep.error(where, f"unknown event {end!r}")
        if (cause, effect) in pairs:
            rep.error(where, "duplicate link")
        pairs.add((cause, effect))
        if cause in years and effect in years and years[cause] > years[effect]:
            rep.error(where, "cause is dated after its effect")
        if link.get("type") not in LINK_TYPES:
            rep.error(where, f"type must be one of {LINK_TYPES}")
        if link.get("confidence") not in CONFIDENCE_LEVELS:
            rep.error(where, f"confidence must be one of {CONFIDENCE_LEVELS}")
        if not isinstance(link.get("strength"), (int, float)) or not 0 <= link["strength"] <= 1:
            rep.error(where, "strength must be a number from 0 to 1")
        if not link.get("rationale"):
            rep.error(where, "missing one-line rationale")
        check_text(rep, where, link)
        check_citations(rep, where, link.get("citations"), sources, used)

    for chain in batch.get("chains", []):
        where = f"{name} chain {chain.get('slug')}"
        if not SLUG_RE.match(str(chain.get("slug", ""))):
            rep.error(where, "slug must be lowercase-hyphenated")
        if chain.get("chain_type") not in CHAIN_TYPES:
            rep.error(where, f"chain_type must be one of {CHAIN_TYPES}")
        ids = chain.get("event_ids") or []
        if len(ids) < 3:
            rep.error(where, "a chain needs at least three events")
        for a, b in zip(ids, ids[1:]):
            if (a, b) not in pairs:
                rep.error(where, f"no curated link {a} -> {b} in this batch")
        if chain.get("chain_type") == "popular_internet" and "popular internet" not in str(chain.get("title", "")).lower():
            rep.error(where, "popular internet chains say so in their title")
        check_text(rep, where, chain)

    for r in batch.get("retracted_links", []):
        if not r.get("reason"):
            rep.error(f"{name} retraction {r.get('cause')} -> {r.get('effect')}", "missing reason")
    for sid in set(sources) - used:
        rep.warn(f"{name} source {sid}", "listed but never cited")


def _normalize(text: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    text = text.replace("\u2019", "'").replace("\u2018", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-").replace("\u00a0", " ")
    return re.sub(r"\s+", " ", text).lower()


def verify_quotes(batches: list[dict[str, Any]], rep: Report) -> None:
    """Fetch every cited URL once and check each quote appears on the page."""
    pages: dict[str, str | None] = {}
    for batch in batches:
        sources = batch.get("sources") or {}
        cites: list[tuple[str, dict[str, Any]]] = []
        for ev in batch.get("events", []):
            cites += [(f"event {ev['slug']}", c) for c in ev.get("citations", [])]
            for p in ev.get("perspectives") or []:
                cites += [(f"event {ev['slug']} / {p.get('party')}", c) for c in p.get("citations", [])]
        for link in batch.get("links", []):
            cites += [(f"link {link['cause']} -> {link['effect']}", c) for c in link.get("citations", [])]
        for where, c in cites:
            url = sources.get(c.get("source"), {}).get("url")
            if not url or not c.get("quote"):
                continue
            if url not in pages:
                try:
                    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (chronicle-citation-check)"})
                    with urllib.request.urlopen(req, timeout=30) as res:
                        raw = res.read()
                    if url.lower().endswith(".pdf"):
                        pages[url] = None  # PDFs: check manually (pdftotext), see DATA_PIPELINE.md
                        rep.warn(url, "PDF source: quotes not machine-checked here")
                    else:
                        pages[url] = _normalize(raw.decode("utf-8", errors="ignore"))
                except Exception as exc:  # noqa: BLE001 - report and continue
                    pages[url] = None
                    rep.warn(url, f"could not fetch ({exc.__class__.__name__}); verify by hand")
            page = pages[url]
            if page is not None and _normalize(c["quote"]) not in page:
                rep.error(f"{batch.get('_path')} {where}", f"quote not found at {url}: {c['quote'][:80]!r}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dir", type=Path, default=CURATED_DIR, help="batch directory (default data/curated)")
    parser.add_argument("--verify-quotes", action="store_true", help="re-fetch every cited URL and check quotes")
    args = parser.parse_args()

    # Slugs the batches may link to without defining (events already in the seed scripts).
    known: set[str] = set()
    snapshot = Path(__file__).resolve().parent.parent / "frontend" / "public" / "demo" / "snapshot.json"
    if snapshot.exists():
        known = {e["slug"] for e in json.loads(snapshot.read_text(encoding="utf-8"))["events"]}

    rep = Report()
    batches = load_batches(args.dir)
    for batch in batches:
        validate_batch(batch, rep, known)
    if args.verify_quotes:
        verify_quotes(batches, rep)
    for w in rep.warnings:
        print(f"warning: {w}")
    for e in rep.errors:
        print(f"error: {e}")
    n_links = sum(len(b.get("links", [])) for b in batches)
    n_persp = sum(len(ev.get("perspectives") or []) for b in batches for ev in b.get("events", []))
    print(
        f"{len(batches)} batches, {sum(len(b.get('events', [])) for b in batches)} events, "
        f"{n_links} links, {n_persp} perspectives: {len(rep.errors)} errors, {len(rep.warnings)} warnings"
    )
    return 1 if rep.errors else 0


if __name__ == "__main__":
    sys.exit(main())
