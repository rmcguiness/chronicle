"""Tests for the curated batch loader and validator (standard library only).

    python3 -m unittest discover -s scripts -p "test_*.py"
"""
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from curated import curated_data  # noqa: E402
from validate_curated import Report, validate_batch  # noqa: E402

SOURCES = {
    "s1": {"title": "Source one", "source_type": "secondary", "url": "https://example.org/one"},
    "s2": {"title": "Source two", "source_type": "primary", "url": "https://example.org/two"},
}
CITE = [{"source": "s1", "quote": "a verbatim passage long enough to count"}]


def event(slug: str, year: int, **extra) -> dict:
    return {"slug": slug, "title": slug.title(), "year": year, "lat": 1.0, "lng": 2.0,
            "category": "political", "summary": "One sentence.", "citations": CITE, **extra}


def batch(**overrides) -> dict:
    data = {
        "batch": "test",
        "sources": SOURCES,
        "events": [event("a-1900", 1900), event("b-1901", 1901), event("c-1902", 1902)],
        "links": [
            {"cause": "a-1900", "effect": "b-1901", "type": "direct", "strength": 0.8,
             "confidence": "established", "rationale": "A led to B.", "citations": CITE},
            {"cause": "b-1901", "effect": "c-1902", "type": "indirect", "strength": 0.3,
             "confidence": "speculative", "rationale": "B may have led to C.",
             "citations": [{"source": "s2", "quote": "another verbatim passage here"}]},
        ],
        "chains": [{"slug": "a-to-c", "title": "A to C", "chain_type": "scholarly",
                    "event_ids": ["a-1900", "b-1901", "c-1902"]}],
    }
    data.update(overrides)
    return data


def errors(data: dict) -> list[str]:
    rep = Report()
    validate_batch(data, rep, set())
    return rep.errors


class ValidateTest(unittest.TestCase):
    def test_valid_batch_passes(self) -> None:
        self.assertEqual(errors(batch()), [])

    def test_link_without_citation_fails(self) -> None:
        data = batch()
        data["links"][0]["citations"] = []
        self.assertTrue(any("needs at least one citation" in e for e in errors(data)))

    def test_citation_source_needs_url(self) -> None:
        data = batch(sources={**SOURCES, "s1": {"title": "No URL", "source_type": "secondary"}})
        self.assertTrue(any("no http(s) URL" in e for e in errors(data)))

    def test_perspective_needs_citation_and_two_parties(self) -> None:
        data = batch()
        data["events"][0]["perspectives"] = [
            {"party": "Side A", "wanted": "x", "feared": "y", "citations": []},
        ]
        errs = errors(data)
        self.assertTrue(any("perspective 'Side A'" in e and "citation" in e for e in errs))
        self.assertTrue(any("at least two parties" in e for e in errs))

    def test_perspective_feared_is_optional(self) -> None:
        data = batch()
        data["events"][0]["perspectives"] = [
            {"party": "Side A", "wanted": "x", "citations": [{"source": "s1", "quote": "a supporting quote of some length"}]},
            {"party": "Side B", "wanted": "y", "feared": "z", "citations": [{"source": "s1", "quote": "a supporting quote of some length"}]},
        ]
        self.assertFalse(any("feared" in e or "wanted" in e for e in errors(data)))
        data["events"][0]["perspectives"][0]["feared"] = ""
        self.assertTrue(any("feared is empty" in e for e in errors(data)))
        del data["events"][0]["perspectives"][1]["wanted"]
        self.assertTrue(any("missing wanted" in e for e in errors(data)))

    def test_bad_confidence_and_loaded_words(self) -> None:
        data = batch()
        data["links"][0]["confidence"] = "certain"
        data["links"][0]["rationale"] = "The heroic king defeated the evil invaders."
        errs = errors(data)
        self.assertTrue(any("confidence must be" in e for e in errs))
        self.assertTrue(any("'heroic'" in e for e in errs))
        self.assertTrue(any("'evil'" in e for e in errs))
        data["links"][0]["rationale"] = 'He came to be regarded as a "national hero."'
        self.assertFalse(any("loaded word" in e for e in errors(data)))

    def test_chain_must_follow_links_and_popular_chains_are_labelled(self) -> None:
        data = batch(chains=[{"slug": "x", "title": "A to C", "chain_type": "popular_internet",
                              "event_ids": ["a-1900", "c-1902", "b-1901"]}])
        errs = errors(data)
        self.assertTrue(any("no curated link a-1900 -> c-1902" in e for e in errs))
        self.assertTrue(any("say so in their title" in e for e in errs))

    def test_cause_after_effect_fails(self) -> None:
        data = batch()
        data["links"][0]["cause"], data["links"][0]["effect"] = "b-1901", "a-1900"
        self.assertTrue(any("dated after" in e for e in errors(data)))


class LoaderTest(unittest.TestCase):
    def test_citations_expand_to_source_records(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            Path(tmp, "0001-test.json").write_text(json.dumps(batch()), encoding="utf-8")
            data = curated_data(Path(tmp))
        link = data["links"][0]
        self.assertEqual(link["confidence"], "established")
        self.assertEqual(link["citations"][0]["original_url"], "https://example.org/one")
        self.assertEqual(link["citations"][0]["quote"], CITE[0]["quote"])
        self.assertTrue(data["events"]["a-1900"]["curated"])
        self.assertEqual(data["chains"][0]["slug"], "a-to-c")


if __name__ == "__main__":
    unittest.main()
