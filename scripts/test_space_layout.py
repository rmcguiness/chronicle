"""Tests for the space view layout precompute (scripts/compute_space_layout.py).

Run from the repo root (standard library only):
    python3 -m unittest discover -s scripts -p "test_*.py"
"""
from __future__ import annotations

import json
import math
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from compute_space_layout import (  # noqa: E402
    DEFAULT_OUT,
    DEFAULT_SNAPSHOT,
    compute_layout,
    dumps,
    ids_hash,
    x_to_year,
    year_to_x,
)


def ev(eid: str, year: int) -> dict:
    return {"id": eid, "year_approx": year}


def link(a: str, b: str, confidence: str | None = None) -> dict:
    out = {"cause_event_id": a, "effect_event_id": b, "strength": 0.5}
    if confidence:
        out["confidence"] = confidence
    return out


def yz_distance(doc: dict, a: str, b: str) -> float:
    ia, ib = int(a[1:]), int(b[1:])
    pa, pb = doc["positions"][3 * ia : 3 * ia + 3], doc["positions"][3 * ib : 3 * ib + 3]
    return math.hypot(pa[1] - pb[1], pa[2] - pb[2])


class TimeScaleTest(unittest.TestCase):
    def test_later_years_sit_further_right(self) -> None:
        years = [-5000, -500, 0, 800, 1500, 1878, 1914, 2001, 2026]
        xs = [year_to_x(y) for y in years]
        self.assertEqual(xs, sorted(xs))
        self.assertEqual(len(set(xs)), len(xs))

    def test_inverse_round_trips(self) -> None:
        for year in (-5000, -44, 0, 1066, 1914.5, 2026):
            self.assertAlmostEqual(x_to_year(year_to_x(year)), year, places=6)

    def test_recent_centuries_get_more_room_than_deep_history(self) -> None:
        recent = year_to_x(2000) - year_to_x(1900)
        ancient = year_to_x(-2900) - year_to_x(-3000)
        self.assertGreater(recent, 10 * ancient)

    def test_one_year_before_wwi_is_still_visible_at_planet_scale(self) -> None:
        # Planets are a few units wide, so a year in the WWI era should be wider than one planet.
        self.assertGreater(year_to_x(1914) - year_to_x(1913), 3.0)


class ComputeLayoutTest(unittest.TestCase):
    def setUp(self) -> None:
        events = [ev(f"e{i}", 1800 + i) for i in range(40)]
        links = [link("e0", "e30", "established"), link("e5", "e6"), link("e5", "e6")]
        self.doc = compute_layout(events, links, iterations=120)

    def test_every_event_gets_one_position_and_x_follows_the_time_scale(self) -> None:
        self.assertEqual(self.doc["count"], 40)
        self.assertEqual(len(self.doc["positions"]), 120)
        for i in range(40):
            self.assertAlmostEqual(self.doc["positions"][3 * i], year_to_x(1800 + i), places=1)

    def test_linked_events_end_up_closer_than_unlinked_ones(self) -> None:
        linked = yz_distance(self.doc, "e0", "e30")
        others = [yz_distance(self.doc, "e0", f"e{i}") for i in range(10, 40) if i != 30]
        self.assertLess(linked, sorted(others)[len(others) // 2])

    def test_duplicate_links_count_once_and_confidence_is_recorded(self) -> None:
        ids = [f"e{i}" for i in range(40)]
        self.assertEqual(self.doc["degree"][ids.index("e5")], 1)
        self.assertEqual(self.doc["confidence"][ids.index("e30")], 3)
        self.assertEqual(self.doc["confidence"][ids.index("e5")], 0)
        self.assertGreater(self.doc["radius"][ids.index("e0")], self.doc["radius"][ids.index("e1")])

    def test_unknown_link_endpoints_are_ignored(self) -> None:
        doc = compute_layout([ev("a", 1900)], [link("a", "missing")], iterations=5)
        self.assertEqual(doc["degree"], [0])

    def test_output_is_deterministic(self) -> None:
        events = [ev(f"e{i}", 1900 + i % 7) for i in range(30)]
        links = [link(f"e{i}", f"e{i + 1}") for i in range(29)]
        self.assertEqual(dumps(compute_layout(events, links, 60)), dumps(compute_layout(events, links, 60)))

    def test_events_in_the_same_year_do_not_overlap(self) -> None:
        events = [ev(f"s{i}", 1914) for i in range(25)]
        doc = compute_layout(events, [], iterations=150)
        p = doc["positions"]
        for i in range(25):
            for j in range(i + 1, 25):
                d = math.dist(p[3 * i : 3 * i + 3], p[3 * j : 3 * j + 3])
                self.assertGreater(d, doc["radius"][i] + doc["radius"][j])


class IdsHashTest(unittest.TestCase):
    def test_known_values(self) -> None:
        # Same vectors as frontend/src/space/spaceData.test.ts.
        self.assertEqual(ids_hash([]), "811c9dc5")
        self.assertEqual(ids_hash(["a", "b"]), "28e4c710")
        self.assertEqual(ids_hash(["treaty-of-berlin-of-1878", "é"]), "92dc40aa")
        self.assertNotEqual(ids_hash(["a", "b"]), ids_hash(["b", "a"]))


class CommittedLayoutTest(unittest.TestCase):
    def test_committed_layout_covers_every_snapshot_event(self) -> None:
        if not DEFAULT_OUT.exists():
            self.skipTest("no committed space-layout.json")
        snapshot = json.loads(DEFAULT_SNAPSHOT.read_text(encoding="utf-8"))
        layout = json.loads(DEFAULT_OUT.read_text(encoding="utf-8"))
        self.assertEqual(layout["ids_hash"], ids_hash([e["id"] for e in snapshot["events"]]))
        self.assertEqual(layout["count"], len(snapshot["events"]))
        self.assertEqual(len(layout["positions"]), 3 * len(snapshot["events"]))


if __name__ == "__main__":
    unittest.main()
