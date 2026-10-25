# Security policy

## Reporting a vulnerability

Please **do not open a public issue** for security problems. Report them privately through
GitHub's [private vulnerability reporting](https://github.com/rmcguiness/chronicle/security/advisories/new)
(Security tab → "Report a vulnerability").

Include what you found, how to reproduce it, and the impact. This is a personal open-source
project: there is no bug bounty and no guaranteed response time.

## Scope

- The FastAPI backend (`backend/`), especially event submission, moderation (`/api/admin/*`)
  and search.
- The React frontend (`frontend/`).
- CI and repository configuration.

Out of scope: the local `docker-compose.yml` stack (dev credentials, bound to localhost),
disputes about historical content (open a normal issue), and dependency advisories without
demonstrated impact (Dependabot tracks updates).

## Operator notes

- Set `ADMIN_KEY` to a random value of 24+ characters; admin endpoints are disabled without it.
  Any deployment that used the old hard-coded key must rotate it.
- Never reuse the docker-compose dev passwords on a reachable host.
- Rate limits are in memory per worker; put an edge rate limit in front of `/api/events/submit`
  and `/api/search*` in production.
