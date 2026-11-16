# ServeHub handoff (2026-11-16)

> **Update after this handoff:** the user said roll out the redesign, keep Ink Free, and do the cleanup.
> - Committed: graph refresh + `.graphifyignore`; superseded recommendations prototype removed; `servehub-redesign-and-fixes` branch deleted.
> - **Redesign is in the real app, uncommitted:** tokens in `main.css`, slot marks (`components/slots.tsx`), sign-in, shell, volunteer dashboard, admin Impact ("Needs you" with in-place Approve / Send back), and the shared Panel/PageHeader/DateTile/CapacityBar so every other screen follows.
> - **Org name is a setting:** `settings` table, `services/settings.ts`, `org.get` / `org.update`, `useSession().org`, editable in admin Settings. A demo reset keeps it.
> - `app/DESIGN.md` rewritten; Ink Free added to the impeccable ignore list. 52 unit + 2 e2e pass, e2e screenshots regenerated.
> - Not ported from the prototype: the Log hours dialog (the button still goes to My hours) and Undo after Approve (no backend undo).

## 1. Goal

ServeHub is the FBLA Coding & Programming entry: an offline Electron desktop app that runs a nonprofit's volunteer program, for volunteers and coordinators (admins). "Riverside Community Partners" is only the demo seed. The product is meant for **any** nonprofit.

This round of work had four aims:
- Ship the chosen **Spotlight** recommendations layout in the real dashboard.
- Fix every worst-case-data (break-ui) finding.
- Design an **unslopped redesign** of the whole look as a side-by-side prototype, reviewed by the impeccable, unslop and emil-design-eng skills.
- Find and fix anything broken across the app, the sign-up page first.

## 2. Current state

**Git**
- On `main`, two commits ahead of the previous handoff:
  - `b0297f5` Spotlight recommendations, stress-test and a11y fixes, redesign prototype
  - `54ca09a` Update design skills, dev tooling config and knowledge graph
- Nothing is pushed.
- The `servehub-redesign-and-fixes` branch still exists and points at `b0297f5`. It's safe to delete.
- **Uncommitted:** the refreshed `graphify-out/*` files and a new `.graphifyignore`. The user hasn't decided whether to commit them.

**Checks (last run after the final code change)**
- Typecheck is clean.
- Lint shows 0 errors in the changed files. The `lib/hooks.ts`, `session.tsx`, `profile.tsx`, `form.tsx` and `ui/*` errors from before this round were left alone.
- 49 unit tests and 2 e2e tests pass.
- `out/` is a plain production build (no stress-test switch), so `npm start` is demo-safe.

**Whole-app sweep**
- Playwright drove the real Electron app through 32 screens at 960x640: sign-up (empty form, then a real account), all volunteer routes and all admin routes.
- It found 0 crashes, 0 console or main-process errors, 0 overflow and 0 unlabelled inputs.
- **Lighthouse accessibility is 100** on all three redesign screens.

**Maps**
- **graphify:** 995 nodes, 3,471 edges, 53 labelled communities. It covers code plus the project's own docs; skill files and PNGs are excluded through `.graphifyignore`.
- **floorplan:** 18 parts, 116/116 files described, with Recent work highlighting this round's 4 tasks.
- The floorplan server may still be running at http://127.0.0.1:4378. Stop it with `node floorplan/serve.mjs --stop`.
- The redesign dev server was started earlier on port 5174 (`npm --prefix app run dev`). It may still be running.

**Waiting on the user**
- **Roll the redesign into the real app?** They chose "Review it first" and haven't answered yet.
- **Ink Free font:** keep it (used for the handwritten names on the clipboard), or switch those names to the regular font. The impeccable design hook keeps flagging it.
- **Floorplan note:** add the floorplan note to `CLAUDE.local.md`? Offered, not answered.
- **Graph files:** commit the graph refresh and `.graphifyignore`?
- **Old handoff decisions, still unanswered:**
  - the rederive opening question ("Why did you build ServeHub?");
  - the "Needs your answer" items in `docs/design-taste.md`.

## 3. Active files

All paths are under `app/src/` unless they start with another root.

| File | Why it matters |
|---|---|
| `main/services/recommendations.ts` | `scoreActivity` returns a `factors` breakdown; `recommend()` keeps only matches at or above `MIN_MATCH = 50` |
| `shared/types.ts` | `Factor` type; `Recommendation.factors`; `ORGANIZATION` is still a hard-coded constant |
| `shared/schemas.ts` | `z.config({ jitless: true })` at the top (it must run before any `z.object`) |
| `renderer/src/pages/volunteer/dashboard.tsx` | Spotlight layout (`Featured`, `RunnerUp`), empty state for "nothing fits well" |
| `renderer/src/pages/auth.tsx` | Hero entrance plays once per session (module flag `heroPlayed`) |
| `renderer/src/lib/format.ts` | `fmtCount`, `spotsLabel` ("Last spot", waitlist wording) |
| `renderer/src/components/page.tsx` | `PageHeader` no longer wraps |
| `renderer/src/pages/admin/approvals.tsx`, `volunteers.tsx`, `impact.tsx` | Fixes for 960px and for worst-case and empty data |
| `renderer/prototypes/redesign/` | The redesign prototype (see section 4); open `/prototypes/redesign.html` on the dev server |
| `renderer/prototypes/redesign/current/*.png` | Screenshots of the real app used as the "Current" side |
| `renderer/prototypes/recommendations/` + `recommendations.html` | Superseded prototype; the user hasn't deleted it yet |
| `app/tests/unit/smart.test.ts`, `format.test.ts` | Tests for factors, the 50% threshold, `spotsLabel` and `fmtCount` |
| `app/tests/e2e/flows.spec.ts` | Now checks for "best match for you" |
| `app/.impeccable/critique/2026-11-16T01-49-03Z__src-renderer-prototypes-redesign.md` | Critique snapshot (22/40 before fixes), so `/impeccable polish` can pick it up |
| `.impeccable/config.json`, `app/.impeccable/config.json` | Detector ignore for the Sitka serif (the user confirmed it) |
| `.graphifyignore` | Leaves `.agents/`, `.claude/`, `*.png`, `.playwright-mcp/` and `floorplan/` out of the graph |
| `floorplan/architecture.json`, `floorplan/descriptions/*.json`, `floorplan/recent-work.json` | Floorplan sources (git-ignored); new part `ui.dev` = "Prototypes and stress-test tools" |

## 4. Changes made

**Spotlight in the real app**
- The best match gets a large card with a per-factor breakdown (Skills /50, Availability /30, Interest /20). Runners-up are compact cards.
- Notes for factors that earned 0 points explain why ("Needs skills you haven't listed", "Outside your usual free times", "X isn't one of your interests").
- Reasons are now built from the factors that earned points.
- The user picked **a 50% minimum match**. Weaker matches aren't recommended, and the empty state says so.

**Break-test fixes (all 8 findings, plus a dashboard overflow the test missed)**
- **Approvals at 960px:** cells wrap, and the Waiting tab replaces its Status column with Actions.
- **Volunteers at 960px:** names wrap and emails break.
- **Counts:** `fmtCount` everywhere; the sidebar badge caps at "99+".
- **Small fixes:** MapPin `shrink-0`, skill chips capped at 3 + "+N" (the rest read to screen readers), `PageHeader` no wrap, "Last spot".
- **Impact empty states:** a chart empty state, and skill-gap copy that depends on whether there are upcoming shifts.
- **Dashboard overflow:** the single-column grid was sized by long truncated text; fixed with `grid-cols-1`.

**Redesign prototype (unslop direction, approved)**
- **Direction:** "neighborly, steady, plainspoken", built around the world of a paper sign-up sheet at a community hall.
  - Neutral app surfaces; brand green only for the primary action, the selection and one key figure.
  - **Signature:** capacity drawn as slot marks (`slots.tsx`).
  - Headlines in a system serif (Sitka/Georgia). No new font packages were added.
- **Harness** (`main.tsx`): Current/Unslopped switch, screen tabs, an organization switcher (3 example nonprofits, one deliberately long name) and a "Goal reached" toggle. Keys 1-3 and C; state kept in the URL.
- **Sign-in** (`signin.tsx` + `auth-forms.tsx`):
  - Org-neutral headline "Every shift's sign-up sheet, in one place".
  - The clipboard is one labelled image.
  - Sign in and **Create account** forms are validated with the real `loginSchema`/`signupSchema` + `fieldErrors`, and focus moves to the first error.
  - The page sits in a `main` landmark.
- **Volunteer dashboard** (`volunteer.tsx`):
  - One cell per goal hour (approved green, waiting hatched).
  - Log hours dialog, capped at the shift length with the reason shown.
  - Sign up fills a slot, with Undo in the toast.
  - Match-explainer tooltip, the 50% "nothing else fits" note, and a goal-reached state.
- **Admin impact** (`impact.tsx`):
  - A "Needs you" strip with in-place Approve (updates the nav count, the stat and the month bar; Undo available) and Send back (5+ character reason, the real message).
  - Skill gap with Find volunteers; shifts that need people shown as slot marks.
  - Keyboard-focusable chart bars with tooltips; the scale follows the data.
- **Review fixes** (impeccable dual-agent critique, unslop, emil):
  - Help, Certificates and Audit log added to the nav.
  - Green toned down, and the featured Sign up button now sits above the fold.
  - A solid 2px focus ring (the old one was about 2:1).
  - Sidebar text at 4.5:1 or better.
  - The email field no longer locks after picking a demo account.
  - `autocomplete` attributes added.
  - No `height` animation.

**Sign-up "broken" + sweep**
- **Real app:** the hero's 1.2s entrance replayed on every Sign in ↔ Sign up switch and blanked the panel. It now plays once per session.
- **Prototype:** "Create an account" was a dead `href="#"`. The screen is now built and wired.
- **zod:** its eval probe caused a CSP "issue" in DevTools. Fixed with `jitless`.

**Maps**
- graphify incremental update. The 58 stale skill sources were pruned with `force=True`.
- floorplan refresh, the new `ui.dev` part, and recent-work notes.

## 5. Failed attempts

| Tried | What went wrong | What replaced it |
|---|---|---|
| `Remove-Item` / `rm` on `prototypes/recommendations/` | Blocked by the auto-mode classifier as destructive | Left in place; the user was given the `rm` command |
| `z.config({ jitless: true })` in `renderer/src/main.tsx` | Imports run first, so `z.object()` had already probed for eval | Moved to the top of `shared/schemas.ts` |
| Prototype Toaster at bottom-right | It overlaps the comparison bar (harness chrome only) | Left as is; not a product issue |
| Chart bars with `transition: height` | Breaks the Emil rule against animating layout | Instant height + `transition-colors` |
| Fixed 12-hour chart scale | An approval pushed November to 13.5 and overflowed | Scale rounds the max up to a multiple of 4 |
| Clipboard placed with `translate-y` | The sheet's slot marks sat under the comparison bar | Shorter sheet (6 lines, `h-8` rows), tighter panel spacing |
| Sweep check counting `<label>`-wrapped Radix checkboxes as unnamed | False positive (the accessibility tree names them) | Checked with `ariaSnapshot`; no fix needed |
| DevTools MCP on the Electron window | The plugin starts its own Chrome; attaching needs `--browser-url`, a settings change | Playwright `_electron` for the app; the DevTools MCP for the browser-runnable prototype |
| graphify `--update` keeping old skill nodes | An incremental merge never removes files newly excluded by `.graphifyignore` | Re-merged from the backup with `prune_sources` = the 58 stale sources, then `to_json(force=True)` |
| Inline `node -e` with escaped quotes in bash | The shell quoting broke | Wrote scripts to the scratchpad and ran them as files |

## 6. Specific next steps

1. **Ask the user about the redesign.** It needs their go-ahead before anything else in the redesign moves. If they say roll it out:
   - Port the `.unslop` tokens and screens into `renderer/src/` (sign-in + create account, volunteer dashboard, admin impact first, then the other screens in the same language).
   - Make the org name editable in admin Settings (the user chose this). It feeds sign-in, the sidebar, certificates, reports and impact. Replace the `ORGANIZATION` constant with a setting stored in SQLite.
   - Update `app/DESIGN.md` (or run `/impeccable document`), re-run e2e, and regenerate the screenshots.
2. **Decide Ink Free:** keep it (add the impeccable `ignore-value`) or switch the clipboard names to the regular font.
3. **Delete the superseded prototype:**
   ```bash
   rm -r app/src/renderer/prototypes/recommendations app/src/renderer/prototypes/recommendations.html
   ```
4. **Commit or drop the graph refresh** (`graphify-out/*`, `.graphifyignore`).
5. **Optional:** clear the pre-existing lint errors listed in section 2. The demo passwords in `seed.ts` and `auth.tsx` are flagged by the floorplan Health check; they're intentional for the demo.
6. **Continue `/rederive`** for FBLA prep, and fill in `docs/design-taste.md` → "Needs your answer".
7. **After any code edit:** run `graphify update .` (memory rule). After larger changes, ask to "update the floorplan".
