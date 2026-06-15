# WC 2026 Sweepstake

Family sweepstake site for World Cup 2026. Cloned from the Euro 2024 sweepstake repo.

## Stack

- **Eleventy (11ty)** static site generator with Nunjucks templates
- **SCSS** (compiled with `sass` CLI)
- **Netlify** for hosting + serverless functions
- **football-data.org API v4** (`WC` competition endpoint)

## Local dev

```
netlify dev
```

Always use `netlify dev`, not `npm start`. Open `localhost:8888` — this is the only port that proxies the Netlify function and the `/api/football` redirect.

- Eleventy runs on port 8081
- Netlify dev proxy runs on 8888

## Architecture

Hybrid static/live:

- **Build time:** `src/_data/data.js` fetches teams via `@11ty/eleventy-fetch` (1-day cache). Outputs `allocatedTeams` used by the Teams page.
- **Client side:** `src/js/main.js` fetches live data (fixtures, results, standings, scorers) at runtime from `/api/football?type=<type>`.
- **Netlify Function:** `netlify/functions/football.js` proxies football-data.org and transforms the response. The API key never reaches the client.
- **Redirect:** `netlify.toml` maps `/api/football` → `/.netlify/functions/football`.

## Key files

| File | Purpose |
|---|---|
| `src/_data/data.js` | Build-time team fetch; contains `TEAM_ASSIGNMENTS` |
| `netlify/functions/football.js` | Live data proxy + transformation; also contains `TEAM_ASSIGNMENTS` |
| `src/_data/meta.js` | Site title and description |
| `src/_data/navigation.js` | Nav links |
| `src/_data/helpers.js` | Shared Eleventy data helpers |
| `src/js/main.js` | Client-side fetch and HTML rendering for all live pages |
| `src/_includes/base.njk` | Base HTML shell |
| `src/_includes/navPrimary.njk` | Primary navigation |
| `netlify.toml` | Build config, dev proxy, function redirect |

## TEAM_ASSIGNMENTS — important

`TEAM_ASSIGNMENTS` maps team name → family member. It lives in a single shared file: **`team-assignments.js`** at the project root. Both `src/_data/data.js` and `netlify/functions/football.js` require it from there.

Current assignments (Euro 2024 teams — will be replaced with WC 2026 draw):

| Family member | Teams |
|---|---|
| Rob | Ukraine, Hungary |
| Anna | Denmark, Spain |
| Grandad | Poland, England |
| Erin | Slovenia |
| Clare | Slovakia, Italy |
| Ben | Portugal, Austria |
| Evie | Albania, Romania |
| Harry | Croatia |
| Oscar | Netherlands, Serbia |
| Lola | Germany, Belgium |
| Freddie | Georgia, Scotland |
| Jack | Switzerland |
| Steve | France, Turkey |
| Meg | Czechia |

## Images

- `src/images/crests/` — SVG team crests, filename is `team-name.svg` (lowercased, spaces → hyphens)
- `src/images/family/` — SVG avatars for each family member, filename is `firstname.svg` (lowercase)
- Background images: `bg.jpg`, `bg.png`, `bg.webp`
- Logos: `logo-black.svg`, `logo-white.svg`

## SCSS structure

```
src/scss/
  _vars.scss
  main.scss
  _01-globals/
  _02-elements/
  _03-objects/
  _04-components/
  _05-utilities/
```

## Pages

| Route | Template | Data source |
|---|---|---|
| `/` | `src/index.html` | static |
| `/teams/` | `src/pages/teams.html` | `data.js` (build time) |
| `/fixtures/` | `src/pages/fixtures.html` | client-side via `/api/football?type=fixtures` |
| `/results/` | `src/pages/results.html` | client-side via `/api/football?type=results` |
| `/standings/` | `src/pages/standings.html` | client-side via `/api/football?type=standings` |
| `/top-scorers/` | `src/pages/top-scorers.html` | client-side via `/api/football?type=scorers` |

## Environment variables

- `API_KEY` — football-data.org API key
  - Locally: `.env` file at project root
  - Production: Netlify dashboard environment variable

## What still needs doing

1. Replace Euro 2024 team assignments with confirmed WC 2026 draw (48 teams, ~3–4 per family member) — update both `data.js` and `football.js`
2. Add 48 WC 2026 team crest SVGs to `src/images/crests/`
3. Verify `meta.js` title/description is final
4. Confirm `API_KEY` is set in Netlify dashboard for production
