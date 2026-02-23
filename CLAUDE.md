# CLAUDE.md — Football Predictor (FIFA World Cup 2026)

This document provides guidance for AI assistants working on this codebase.

---

## Project Overview

A **FIFA World Cup 2026 prediction/fantasy game** built as a lightweight Single-Page Application (SPA). Players join groups, predict match scores, and compete on a live leaderboard.

**Tech Stack:**
- Frontend: Vanilla JavaScript + HTML5 + CSS3 (no build tools, no framework)
- Backend/Database: [Supabase](https://supabase.com) (PostgreSQL + Auth + Realtime)
- Hosting: Vercel (static site)
- Timezone: GMT+7 (Vietnam time) used throughout

---

## Repository Structure

```
/
├── index.html              # Main SPA (home, schedule, leaderboard pages)
├── admin.html              # Admin panel (match management, player management)
├── test.html               # Manual testing page for Supabase connection
│
├── config.js               # Supabase credentials (public/anonymous key — safe to commit)
├── supabase-db.js          # All database functions (single source of truth for DB ops)
├── bracket-render.js       # Tournament bracket rendering logic
│
├── styles.css              # Main stylesheet (design system + all component styles)
├── bracket.css             # Bracket-specific styles (connector lines, mini-cards)
│
├── seed-matches.sql        # Seeds 72 group stage matches (FIFA WC 2026)
├── knockout-bracket-seed.sql  # Seeds M73–M104 knockout matches + assigns match numbers
├── reset-and-seed.sql      # Test utility: resets data, creates random predictions
├── clear-everything.sql    # Wipes all matches and predictions
├── simulate-results.sql    # Simulates match results for testing
│
└── vercel.json             # Vercel routing config
```

**There are no subdirectories, no build tools, no package.json, and no test runner.** All JavaScript runs directly in the browser.

---

## Architecture

### SPA Navigation

`index.html` is a single file containing multiple `<div>` sections for different "pages":
- `#homepage` — Upcoming matches, leaderboard preview, personal stats
- `#schedule` — Group stage table + knockout bracket
- `#leaderboard` — Full player rankings

Navigation is handled by a `switchPage(pageId)` function that toggles `display` on the divs.

### Database Layer (`supabase-db.js`)

All Supabase queries are centralized in `supabase-db.js`. Functions are exported to `window` so they are accessible globally from HTML scripts:

```js
window.loginUser = loginUser;
window.savePrediction = savePrediction;
// etc.
```

**Never call Supabase directly from `index.html` or `admin.html`** — always add/modify functions in `supabase-db.js`.

### Bracket Rendering (`bracket-render.js`)

Contains the full FIFA 2026 bracket structure (M1–M104 match definitions), rendering logic for both group stage (table-row cards) and knockout stage (visual bracket with SVG connector lines). This module is also exported to `window`.

---

## Database Schema

### Tables

| Table | Key Columns |
|---|---|
| `groups` | `id`, `name`, `code`, `created_by`, `favorite_team_enabled`, `favorite_team_locked`, `points_round16`, `points_quarter`, `points_semi`, `points_final`, `points_champion` |
| `players` | `id`, `group_id`, `name`, `email`, `password` (plaintext — demo only), `is_admin`, `total_points`, `exact_score_count`, `top1_count`, `favorite_team`, `favorite_team_status`, `favorite_points` |
| `matches` | `id`, `match_group`, `home_team`, `away_team`, `match_date`, `status`, `home_score`, `away_score`, `minute`, `home_penalty`, `away_penalty`, `points_calculated`, `match_number` |
| `predictions` | `match_id`, `player_id`, `home_score`, `away_score`, `minute`, `total_points`, `points_rank`, `points_exact_score`, `points_minute` |
| `scoring_rules` | `favorite_team_deadline` and other configurable rules |

### Match Numbering System

| Range | Stage |
|---|---|
| M1–M72 | Group Stage (72 matches, 12 groups A–L) |
| M73–M88 | Round of 32 (16 matches) |
| M89–M96 | Round of 16 (8 matches) |
| M97–M100 | Quarter-finals |
| M101–M102 | Semi-finals |
| M103 | 3rd place match |
| M104 | Final |

### Match Statuses

Matches cycle through these statuses (stored as strings in the `status` column):
- `not-open` — Predictions not yet allowed
- `open` — Predictions accepted
- `in-progress` — Match is live (predictions locked)
- `finished` — Result entered, points calculated

---

## Key Conventions

### Timezone

**Always use GMT+7 (Vietnam time)** for all date/time display and storage. This is applied consistently throughout the codebase. Do not introduce UTC display without explicit conversion.

### CSS Variables

The design system uses CSS custom properties defined at `:root` in `styles.css`. Always prefer variables over hardcoded values:
```css
/* Use this */
color: var(--primary-color);
border-radius: var(--border-radius);

/* Not this */
color: #3498db;
border-radius: 8px;
```

### Global Function Pattern

Functions in JS modules are attached to `window` so they can be called from inline `<script>` blocks in HTML files:
```js
// In supabase-db.js
window.myNewFunction = myNewFunction;
```

### No Build Pipeline

There is no bundler (Webpack, Vite, etc.), no TypeScript, and no linting toolchain. JavaScript is plain ES6+ served directly as static files. Changes take effect immediately when the file is saved and the page is refreshed.

### Comments Language

Code comments are written in **Vietnamese** (e.g., `// Hàm lấy dự đoán của người chơi`). New comments should follow this convention to remain consistent with existing code.

---

## Development Workflow

### Local Development

No build step required. Open files directly in a browser, or use a simple local server:
```bash
npx serve .
# or
python3 -m http.server 8080
```

Access:
- Main app: `http://localhost:8080/` → serves `index.html`
- Admin panel: `http://localhost:8080/admin` → rewrites to `admin.html` (handled by Vercel in production; use `http://localhost:8080/admin.html` locally)
- Test page: `http://localhost:8080/test.html`

### Testing

There is no automated test runner. Testing is done manually via `test.html`, which runs each database function and logs results. After making changes to `supabase-db.js`, verify by:
1. Opening `test.html` in a browser
2. Checking all function outputs in the log panel

### Database Changes

SQL changes go into the appropriate SQL file:
- Schema changes → add to `knockout-bracket-seed.sql` or a new migration file
- Match data → `seed-matches.sql` or `knockout-bracket-seed.sql`
- Testing resets → `reset-and-seed.sql`

All SQL files are run manually against the Supabase project via the Supabase SQL editor (not via a CLI migration tool).

### Deployment

Deployment is automatic on push to the `main` branch via Vercel. The `vercel.json` rewrites handle routing:
- `/` → `index.html`
- `/admin` → `admin.html`

---

## Scoring System

Points are awarded per prediction:
- **Exact score** (`points_exact_score`): Correct home and away score
- **Rank prediction** (`points_rank`): Correct match winner (not exact score)
- **Minute prediction** (`points_minute`): Correct goal minute (within a range)

Leaderboard (`getLeaderboard`) aggregates: `top1_count`, `exact_score_count`, and `total_points` across all predictions in a group.

### Favorite Team Feature

Players can select a favorite team before a deadline (`favorite_team_deadline` in `scoring_rules`). When that team advances through knockout rounds, bonus points are awarded based on the round:
- `points_round16`, `points_quarter`, `points_semi`, `points_final`, `points_champion` (all configurable in the `groups` table)

Settings are read from the `groups` table; the deadline is read from `scoring_rules`.

---

## Security Notes

> **This is a demo/private league app — not a production system.**

- Passwords are stored in **plaintext** in the `players` table. Do not add any real sensitive data.
- The Supabase anonymous key in `config.js` is safe to commit (it is a public read-only key by design).
- Authentication is email/password checked against the database on the client — there is no server-side session management.
- Do not introduce server-side logic or secret keys without restructuring the auth model first.

---

## Common Tasks

### Add a New Database Function

1. Write the function in `supabase-db.js`
2. Export it: `window.myFunction = myFunction;`
3. Call it from `index.html`, `admin.html`, or `bracket-render.js` as needed

### Add a New Page/Section to the SPA

1. Add a `<div id="my-page">` section in `index.html`
2. Add a navigation item that calls `switchPage('my-page')`
3. Add styles in `styles.css`

### Modify the Knockout Bracket

1. The bracket structure is defined in `bracket-render.js` as a static data object
2. Round colors and connector logic are also in `bracket-render.js`
3. Layout styles (column widths, connector SVG) are in `bracket.css`

### Update Match Results (Admin)

Results are entered via `admin.html` → "Match Management" section. The admin calls `enterMatchResult(matchId, homeScore, awayScore, minute)` which sets status to `finished` and triggers point calculation.

---

## Branch Strategy

- `main` / `master` — Production branch, auto-deployed to Vercel
- Feature branches use the convention: `claude/project-discussion-<id>` (for AI-assisted PRs)

All AI assistant work should be done on a dedicated feature branch and submitted as a Pull Request.
