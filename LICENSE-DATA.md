# Data and content licenses

Chronicle's **code** is released under the [MIT License](./LICENSE).

Data and written content in this repository are licensed separately:

| What | Where | License |
|---|---|---|
| Structured data: events, dates, places, causality links, people, source citations | `seeds/`, `backend/scripts/seed_*.py`, database exports | [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1-0/) |
| Narrative text: event descriptions and perspectives written for Chronicle | same | [Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/) |

Copyright © 2026 Ryan McGuiness and Chronicle contributors. When reusing the data or text,
credit "Chronicle (https://github.com/rmcguiness/chronicle)" and share adaptations under the
same license.

## Third-party content

- **Wikipedia.** Article summaries and sections shown in the app are fetched at runtime from the
  Wikipedia REST API and cached. That text belongs to Wikipedia contributors and is available
  under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); the app links each
  article back to its source page. Some seed records reference Wikipedia article titles.
- **Map tiles and other libraries** keep their own licenses and attribution requirements (see
  `frontend/package.json` and `backend/requirements.txt` dependencies).

By contributing data or text you agree to license it under the terms above.
