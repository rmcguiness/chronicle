"""Tests for the demo snapshot exporter's duplicate merging.

Run from the repo root (standard library only):
    python3 -m unittest discover -s scripts -p "test_*.py"
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from export_demo_snapshot import is_duplicate, merge_duplicates  # noqa: E402


def ev(title: str, year: int, importance: float = 0.5) -> dict:
    return {"title": title, "year": year, "importance_score": importance}


class IsDuplicateTest(unittest.TestCase):
    def test_same_title_a_couple_of_years_apart(self) -> None:
        self.assertTrue(
            is_duplicate(ev("Spanish Conquest of the Aztec Empire", 1519), ev("Spanish Conquest of the Aztec Empire", 1521))
        )

    def test_same_year_with_word_variants(self) -> None:
        self.assertTrue(
            is_duplicate(
                ev("Ghana Independence — Beginning of African Decolonization", 1957),
                ev("Ghana Independence — First Sub-Saharan Nation to Decolonize", 1957),
            )
        )

    def test_same_year_different_wording(self) -> None:
        self.assertTrue(
            is_duplicate(ev("Pizarro Conquers the Inca Empire", 1532), ev("Spanish Conquest of the Inca Empire", 1532))
        )

    def test_same_year_subtitle_variant(self) -> None:
        self.assertTrue(
            is_duplicate(
                ev("Revolutions of 1848 — The Springtime of Nations", 1848),
                ev("Revolutions of 1848 — Springtime of Peoples", 1848),
            )
        )

    def test_generic_words_alone_do_not_match(self) -> None:
        self.assertFalse(
            is_duplicate(ev("Battle of Midway — Turning Point", 1942), ev("Battle of Stalingrad — Turning Point", 1942))
        )

    def test_different_events_in_the_same_year(self) -> None:
        self.assertFalse(
            is_duplicate(
                ev("Vesalius Publishes 'De Humani Corporis Fabrica' — Anatomy Revolution", 1543),
                ev("Copernicus Publishes De Revolutionibus — Heliocentric Model", 1543),
            )
        )
        self.assertFalse(
            is_duplicate(
                ev("French Revolution — Storming of the Bastille", 1789),
                ev("Declaration of the Rights of Man and of the Citizen", 1789),
            )
        )

    def test_far_apart_years_never_match(self) -> None:
        self.assertFalse(is_duplicate(ev("Treaty of Paris", 1763), ev("Treaty of Paris", 1783)))

    def test_near_years_need_more_than_one_key_word(self) -> None:
        self.assertFalse(is_duplicate(ev("Siege of Vienna", 1529), ev("Congress of Vienna", 1531)))


class MergeDuplicatesTest(unittest.TestCase):
    def test_keeps_best_connected_event_and_repoints_links(self) -> None:
        events = {
            "aztec-a": ev("Spanish Conquest of the Aztec Empire", 1519, 0.9),
            "aztec-b": ev("Spanish Conquest of the Aztec Empire", 1521, 0.8),
            "smallpox": ev("Smallpox Epidemic in Mesoamerica", 1520),
            "columbus": ev("Columbus Reaches the Americas", 1492),
        }
        links = [
            {"cause": "columbus", "effect": "aztec-a"},
            {"cause": "aztec-b", "effect": "smallpox"},
            {"cause": "columbus", "effect": "aztec-b"},
        ]
        merged, merged_links = merge_duplicates(events, links)
        # aztec-b has two links to aztec-a's one, so it wins despite lower importance.
        self.assertEqual(set(merged), {"aztec-b", "smallpox", "columbus"})
        pairs = sorted((l["cause"], l["effect"]) for l in merged_links)
        self.assertEqual(pairs, [("aztec-b", "smallpox"), ("columbus", "aztec-b")])


if __name__ == "__main__":
    unittest.main()
