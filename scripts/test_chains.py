"""Tests for scripts/chains.py (chain discovery for /chain share pages)."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from chains import find_chains  # noqa: E402


def ev(slug, year, imp=0.8, title=None):
    return {"id": slug, "slug": slug, "title": title or slug.title(), "year_approx": year,
            "importance_score": imp}


def link(i, cause, effect, kind="causes", strength=0.9):
    return {"id": f"l{i}", "cause_event_id": cause, "effect_event_id": effect,
            "connection_type": kind, "strength": strength}


class FindChainsTest(unittest.TestCase):
    def setUp(self):
        self.events = [ev("a", 1500), ev("b", 1600), ev("c", 1700), ev("d", 1800), ev("x", 1650)]
        self.links = [link(1, "a", "b"), link(2, "b", "c"), link(3, "c", "d")]

    def test_follows_links_forward_in_time_with_stable_slug(self):
        chains = find_chains(self.events, self.links)
        self.assertTrue(chains)
        top = max(chains, key=lambda c: len(c["event_ids"]))
        self.assertEqual(top["event_ids"], ["a", "b", "c", "d"])
        self.assertEqual(top["slug"], "a-to-d")
        self.assertEqual(find_chains(self.events, self.links), chains)

    def test_ignores_links_that_run_backwards_in_time(self):
        links = [link(1, "d", "c"), link(2, "c", "b")]
        self.assertEqual(find_chains(self.events, links), [])

    def test_skips_chains_made_mostly_of_context_links(self):
        links = [link(i, c, e, "context") for i, (c, e) in enumerate([("a", "b"), ("b", "c"), ("c", "d")])]
        self.assertEqual(find_chains(self.events, links), [])


if __name__ == "__main__":
    unittest.main()
