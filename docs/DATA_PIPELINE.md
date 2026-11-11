# Data pipeline: cited batches

This is how Chronicle adds history with sources, cause-and-effect links that carry a
confidence level, and accounts from each party involved. Each run of the pipeline
produces one **batch**: a JSON file in `data/curated/` covering one era, region or theme.
The batch is reviewed as a pull request like any other change.

The older seed scripts in `backend/scripts/seed_*.py` and the Wikidata import stay as
they are. Curated batches sit on top of them: when a batch defines an event whose slug
already exists, the batch's fields win, and a curated link replaces the seed link
between the same two events.

## 1. Pick the batch

1. Open `data/coverage.md` and take the first row marked `todo` in the highest-priority
   section, or a row a maintainer has assigned. Change it to `in progress` with the branch
   name.
2. Scope: 15 to 25 events and 20 to 35 links. Larger batches are hard to review.
3. List the candidate events. For each, search the existing data first:
   `grep -ri "<keyword>" backend/scripts/ data/curated/` and
   `python3 backend/scripts/duplicate_events.py --check`. Reuse an existing slug when the
   event is already on the timeline, so its old links keep working.

## 2. Research and save sources

Rules:

- Every claim needs a source you have fetched and read. A claim you cannot source is
  dropped, or the link it supports is rated `speculative`.
- Preferred sources, in order: primary documents in reputable editions (Avalon Project at
  Yale, the BYU World War I Document Archive, Fordham's Internet History Sourcebooks,
  national archives); peer-reviewed scholarship and university-press books (journal
  articles, the *1914-1918-online* encyclopedia, Cambridge/Oxford Core); museum and
  reference works (Imperial War Museums, Encyclopaedia Britannica, BBC History).
  Journalism and fact-checkers (Snopes, newspapers) are fine for modern events and for
  documenting what a popular claim says.
- Wikipedia is a finding aid. Follow its references; do not cite it.
- Books: cite with ISBN and check the record on Open Library
  (`https://openlibrary.org/isbn/<isbn>.json`). Only give a page number you have seen.
- Never invent a quote, page number or URL.

Procedure:

1. Fetch each page (`curl -sL`, or a browser when a site blocks scripts) and save the
   text in a scratch folder outside the repo, one file per URL. Note the title, author,
   publisher and publication year.
2. For each event and link, copy one to three short verbatim passages (8 to 60 words)
   that support it. These become the `quote` fields.
3. Cover every party. For a war or crisis that means each government involved and the
   non-state groups that acted (for example Young Bosnia in 1914). For each party find
   what it wanted, what it believed or feared, and, where a source covers it, how it has
   remembered the event. Primary documents written by that party are the best source
   for its own view.
4. Look for disagreement. For contested links, find the historiography (review essays
   such as Mombauer 2015 in *Central European History* summarise a debate in one place).

## 3. Draft with one model, review with another

Two AI models are used as a drafter and a reviewer. Neither is a source.

1. **Draft** (Claude): give it the source files, the event and link skeleton (slugs,
   years, places, which source supports which item) and the prose rules below. It writes
   titles, one-sentence summaries, 2 to 4 sentence descriptions, per-party perspectives,
   link rationales and citations with verbatim quotes, as JSON.
2. **Review** (Codex): give it the draft and the same source files. It lists factual
   errors, claims the quotes do not support, quotes that are not verbatim, one-sided
   framing, missing parties, hero or villain language, and confidence ratings it would
   change, each with the item it applies to.
3. **Reconcile**: a person (or the agent running the batch) applies the fixes, re-checks
   each changed claim against the source text, and writes the review notes into the pull
   request description: what the reviewer flagged, what changed, and what was kept and why.
   Record which model drafted and which reviewed.

### Prose rules (give these to both models)

- Plain, neutral, declarative sentences about participants, motives and outcomes.
- No hero or villain words and no moral verdicts in the narrator's voice. A party's own
  judgement can appear when it is attributed ("Vienna's leaders called it ...") and cited.
- No "It is not X. It is Y." reveals, no aphoristic closers, no sentence fragments for
  rhythm, no clever headers, no straw-man knockdowns, no dressed-up metaphors (powder keg,
  spark, web, dominoes), and no phrasing about data that "hides" or "shows" things.

### Neutral voice

`scripts/validate_curated.py` rejects a list of loaded words (hero, villain, evil,
heroic, notorious, fanatic, innocent and others) and stock metaphors in narrator fields.
The list is a backstop; the review step is what catches one-sided framing.

## 4. Rate each link

| Level | Use when |
| --- | --- |
| `established` | Two or more independent sources support the link and no notable scholarly dispute is known. |
| `debated` | Historians or sources disagree about the link or about how much it mattered. The rationale names the positions and the sources that hold them. |
| `speculative` | One source, or an inference with no source stating the connection. Most steps of popular "butterfly effect" chains end up here. |

The rationale is one sentence: why the cause contributed to the effect, and for debated
links, what the disagreement is. Link `type` keeps the existing meanings: `direct`,
`contributing`, `indirect`, `disputed` (shown as causes, enables, context, context).

## 5. Write the batch file

`data/curated/NNNN-<batch-name>.json`, numbered in the order batches were added:

```json
{
  "batch": "wwi-origins",
  "title": "The road to the First World War, 1839-1914",
  "drafted_by": "Claude (model and settings)",
  "reviewed_by": "Codex (model and settings)",
  "sources": {
    // publication_date only when the page states one; otherwise record the access date
    "brit-balkan-wars": {
      "title": "Balkan Wars", "author": "Britannica Editors",
      "publication": "Encyclopaedia Britannica", "accessed": "2026-11-11",
      "source_type": "tertiary", "url": "https://www.britannica.com/event/Balkan-Wars"
    }
  },
  "events": [{
    "slug": "balkan-wars-1912", "title": "Balkan Wars", "year": 1912,
    "date_display": "1912-1913", "lat": 41.99, "lng": 21.43, "category": "war",
    "importance_score": 0.85, "geo_modern": "...", "geo_era_label": "...",
    "summary": "One sentence, under 200 characters.",
    "description": "Two to four sentences.",
    "citations": [{"source": "brit-balkan-wars", "quote": "verbatim passage", "locator": null}],
    "perspectives": [{
      "party": "Serbia", "perspective_type": "government",
      "wanted": "...", "feared": "...", "remembered": null,
      "citations": [{"source": "...", "quote": "..."}]
    }]
  }],
  "links": [{
    "cause": "balkan-wars-1912", "effect": "assassination-franz-ferdinand-1914",
    "type": "contributing", "strength": 0.65, "confidence": "established",
    "rationale": "One sentence.",
    "citations": [{"source": "...", "quote": "..."}]
  }],
  "chains": [{
    "slug": "road-to-world-war-i", "title": "...", "chain_type": "scholarly",
    "description": "One or two sentences.", "event_ids": ["...", "..."]
  }],
  "retracted_links": [{"cause": "...", "effect": "...", "reason": "Why the old link is wrong."}]
}
```

- `perspective_type` is one of government, civilian, foreign, academic, nationalist,
  colonial, indigenous, religious, journalistic.
- `chain_type` is `scholarly` for chains built from cited links, or `popular_internet`
  for well-known internet chains (their title says "popular internet chain" and each
  step is rated honestly). Every consecutive pair in `event_ids` must be a link in the
  same batch.
- `retracted_links` removes generated or seed links that the research contradicts or
  cannot support.

## 6. Validate

Run from the repository root:

```bash
python3 scripts/validate_curated.py                  # structure, citations, neutral voice (CI runs this)
python3 scripts/validate_curated.py --verify-quotes  # re-fetches each URL, checks every quote is on the page
python3 scripts/export_demo_snapshot.py              # regenerate the demo snapshot
python3 backend/scripts/duplicate_events.py --check  # duplicate events
python3 -m unittest discover -s scripts -p "test_*.py"
cd frontend && npm run lint && npm test && npm run build
```

`--verify-quotes` warns instead of failing when a site blocks scripted fetches or the
source is a PDF; check those quotes by hand and say so in the pull request.

Curated events are always included in the demo snapshot, and curated chains are listed
first on `/chains`, each with its own share page and card at `/chain/<slug>`.

## 7. Open the pull request

- Branch `data/<batch-name>`, one batch per pull request, opened as a draft.
- Description: the batch scope, counts (events, links, perspectives, citations), the
  confidence tally, the review notes from step 3, any source that could not be verified,
  and a `## Preview` section with the Vercel preview link.
- Update the batch's row in `data/coverage.md` to `in review` with the pull request link;
  a maintainer sets it to `done` when the pull request merges.

## Cost per batch (pilot measurement)

The pilot batch (origins of the First World War plus one popular internet chain: 28 events,
32 links, 28 perspectives, 204 citations from 37 sources) took about 70 minutes of
wall-clock time from an empty source cache to a validated batch, or roughly 2.5 minutes
per event. The parts were:

| Step | Time | Notes |
| --- | --- | --- |
| Source research and caching | about 25 minutes | 44 pages fetched; Britannica and some 1914-1918-online pages block scripted fetches and had to be read by hand |
| Model drafting | 10 to 20 minutes per draft, run in parallel | 6 events took 18 minutes at the highest Claude setting; 8 events and 17 links took 10 minutes at the highest Codex setting |
| Quote check, reconcile, validate | about 15 minutes | `checkquotes`-style substring check, then `validate_curated.py --verify-quotes` |

Both drafting models hit their plan usage limits during the pilot, after one and a half
drafts each. A recurring routine should budget for that by running one batch at a time per
model and keeping a queue, rather than drafting several batches in parallel. See
`data/coverage.md` for the plan this estimate feeds.
