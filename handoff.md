# ServeHub handoff (2026-11-17)

## 1. Goal

ServeHub is the FBLA Coding & Programming 2026-27 entry: an offline Electron desktop app that runs a nonprofit's volunteer program, for volunteers and coordinators (admins). "Riverside Community Partners" is only the demo seed; the product is meant for **any** nonprofit (the org name is an admin setting).

This round of work:
- Cleaned up the Claude setup (CLAUDE.md files, skills, rules) and ran a security scan.
- Wrote a working-method skill, `fable-playbook`, for the next model.
- Reviewed the sign-up page with the 21st `21st-ui-review` skill and fixed two defects.
- Explored four whole-app directions with `21st-ui-explore`. The user picked **D, "The deck"**, and it is now built into the real app.

## 2. Current state

**Git**
- `main` matches `origin/main` at `1e920fe` (the redesign rollout plus a merge of the GitHub "Audit fixes" PR). Everything in this round is **uncommitted**.
- The working tree holds three groups of changes. They can be committed together or separately:
  1. **Claude setup:** root `CLAUDE.md` rewritten, new `app/CLAUDE.md`, new `docs/claude-setup.md`, new `.claude/skills/fable-playbook/`, skills `write-swift` / `animate-expo` / `mobile-native` removed (both `.claude/skills` and `.agents/skills`, plus `skills-lock.json`), empty `.claude/commands/verify_loop.md` deleted.
  2. **Fixes:** Electron trusts only its own `index.html`, not any `file://` page (`app/src/main/index.ts`). Focus moves to the first invalid field after a failed submit (`lib/hooks.ts`). Unused shadcn avatar / badge / card / progress were deleted. A stale test count was removed from `app/README.md`.
  3. **Direction D** (section 4), with `DESIGN.md`, `docs/architecture.md` and the e2e screenshots updated.
- `graphify-out/*` was refreshed after each step (`graphify update .`).

**Checks (after the last code change)**
- Typecheck is clean.
- 52 unit tests and 3 e2e tests pass. The new e2e test covers the sign-up deck end to end.
- Lint has no new errors. The remaining ones were there before: shadcn `ui/*`, `form.tsx`, `ipc.ts`, `session.tsx`, `profile.tsx`, `hooks.ts:34`, `smart.test.ts`, `hours.test.ts`.
- Sign-up, volunteer home, Find activities and Impact were checked in light and dark at 1280×800 and 960×640. There were no console errors and no overflow apart from the bell badge, which overhangs its button by 2px on purpose.
- `out/` is a fresh production build.

**Outside the repo (user-level, not in git)**
- `npx @21st-dev/cli install-skill` installed **8** 21st skills into `~/.claude/skills`, `~/.cursor/skills` and `~/.codex/skills`. The user asked for only `21st-ui-explore` and `21st-ui-review`; the other six load in every project. The user has not been asked about removing them yet.
- The 21st account is on the free tier: 2 code retrievals a day (both used on 2026-11-17, reset 2026-11-18) and no hosted AI generation.
- One memory was loosened: `use-graphify-graph-first` is now a preference ("graph for relationships, grep for exact strings"), not a rule.
- The dev server may still be running on port 5174 (preview `servehub-dev`).

## 3. Active files

All paths are under `app/src/` unless another root is shown.

| File | Why it matters |
|---|---|
| `renderer/src/pages/auth.tsx` | Sign-up with the fan deck, two questions, strength bar, show/hide, "Hold my spot". Sign-in still uses the clipboard. `AuthFrame` takes an optional `hero` and `wide`. |
| `renderer/src/components/fan-deck.tsx` | Fan deck (logic adapted from 21st "Fan Deck Card" by ham7a311). Props: `cards`, `render`, `promote`, `onTop`. |
| `renderer/src/lib/activity-style.ts` | `TYPE_STYLE` (tint and Lucide icon per activity type) and `typeGradient`. |
| `renderer/src/components/activity.tsx` | `TypeBand` (tinted header band with an optional badge). `ActivityCard` now starts with a band. |
| `renderer/src/components/app-shell.tsx` | Top bar: 5 tabs, Notifications and Help icon links, account menu with the other pages. The sidebar is gone. The welcome toast survives landing. |
| `renderer/src/pages/volunteer/dashboard.tsx` | Next-shift `Ticket` (tilt and glare), `HoursRing`, "Dealt for you" cards (score, reason, all three factor scores). |
| `renderer/src/pages/admin/impact.tsx` | `ReviewStack` (arrow keys, stamps, "Just reviewed"), `SkillGaps`, month chart with the all-time total, 3 stat cards. |
| `shared/recommendations.ts` | Moved from `main/services/` so sign-up can score. `FREE_DAY` = 08:00-20:00. `scoreActivity` takes only skills, availability and interests. |
| `main/services/activities.ts` | `previewActivities`: public, up to 8 open upcoming shifts, no sign-up status. |
| `main/services/auth.ts`, `shared/schemas.ts` | `signupSchema` has `interests` and `freeDays` (default `[]`). Sign-up saves them as the starting profile. |
| `shared/api.ts`, `main/ipc.ts` | New `activities.preview`. |
| `app/tests/e2e/boot.spec.ts`, `flows.spec.ts` | Sign-up deck test. Account menu helper `menu()`. Review stack approved with the right arrow. |
| `app/tests/unit/access.test.ts` | Tests for sign-up answers becoming the profile, and the public preview. |
| `app/DESIGN.md` | Updated for D: activity tints, tabs, deck, ticket, ring, review stack. |
| `app/.21st/design.json` | 21st design context, with the D decision and constraints recorded. |
| `CLAUDE.md`, `app/CLAUDE.md`, `docs/claude-setup.md` | Short index, app conventions, and the skill/tool map grouped by department. |
| `.claude/skills/fable-playbook/SKILL.md` | How to plan, split and verify work in this repo. |
| `renderer/prototypes/redesign/` | The older side-by-side prototype, now superseded. Still present (see step 5). |

## 4. Changes made

**Direction D, "The deck"** (every shift is a card you handle)
- **Activity colors:** 8 activity-type tints, all with white text at 4.5:1 or better, used only on card bands and the ticket. The type is always written next to the band.
- **Sign-up:**
  - The left side is a fanned deck of real shifts.
  - Answering "what do you like" and "which days" scores each card with the real recommendation rules. The best fit at 50% or better lifts to the top; below that, a "nothing fits yet" line shows instead.
  - "Hold my spot" (on by default) calls `signups.join` right after the account is created.
  - The answers become the volunteer's interests and availability.
  - The left panel stays fixed while the form scrolls at 960×640.
- **Navigation:** top tabs replace the sidebar (Dashboard, Find activities, My shifts, My hours, Certificates / Impact, Activities, Hour approvals, Volunteers, Reports). The other pages are in the account menu.
- **Volunteer home:** a tilting next-shift ticket, a ring for approved and waiting hours, and three "Dealt for you" cards. A dashed card fills the gap when there are fewer than 3 matches.
- **Impact:** hour logs in a review stack. Approve or the right arrow throws the card right; Send back (with a reason) or the left arrow throws it left. There is no undo, because the backend can't reverse a review.
- **Removed:** the shadcn sidebar, sheet and `use-mobile` hook, and the hour-cells grid with its `cellCounts` helper and tests.

**Review fixes (21st-ui-review)**
- Keyboard focus was dropped to the page after a failed submit. It now lands on the first invalid field, and an e2e test checks it.
- The clipboard on sign-in was cut off at 960×640. It now fits.

**Setup and security**
- The CLAUDE.md files use progressive disclosure: a short root index, with app detail that loads only inside `app/`.
- Security scan: no secrets in the files or git history, and 0 vulnerabilities in shipped dependencies. There are 12 moderate advisories in dev tooling (`minimatch`) whose fix is a breaking upgrade, so they were left.
- The real risk is that every install seeds a demo admin whose password is public. A first-run setup was offered but not built.

## 5. Failed attempts

| Tried | What went wrong | What replaced it |
|---|---|---|
| `npx @21st-dev/cli install-skill --help` | It ignored `--help` and installed all 8 skills for 3 editors | Left installed; the user still needs to choose which to keep |
| Pulling 21st "Card Stack" code into the app | It needs the `motion` library, which this project doesn't have | Its decide and keyboard model was rebuilt with CSS transitions (no drag-to-throw) |
| Hosted 21st generation | Free tier, `aiGenerationEnabled: false` | Previews written by hand, grounded in 21st search results |
| Deck limited to 6 soonest shifts | All 6 needed skills, so a new volunteer's best fit showed "0% match" | Up to 8 shifts, plus a 50% bar before anything is called a fit |
| `export const TYPE_STYLE` in `activity.tsx` | Broke the react-refresh lint rule | Moved to `lib/activity-style.ts` |
| Inline `node -e` / bash heredocs with backticks and `\d` | Shell quoting stripped the escapes | Scripts written to the scratchpad and run as files |
| String replaces after `prettier --write` | Prettier had re-wrapped the imports | Edited by hand after reading the file |
| Built-in browser screenshots of the preview | Timed out repeatedly | Playwright (`chromium` / `_electron`) scripts |
| One blank "home dark 960" screenshot | A timing flake: re-capturing at 300, 900 and 2000 ms showed full content | No change needed |

## 6. Specific next steps

1. **Commit** the three groups in section 2, either as one commit or three. Then push if the user asks.
2. **Try D by hand** with `npm --prefix app run dev`: fan the sign-up deck with the mouse, tilt the ticket, and review hours with the arrow keys. Only Playwright clicks have exercised these.
3. **First-run setup:** offered, not answered. On a fresh database, ask for the org name and the first admin instead of seeding a public demo admin, and keep "Reset demo data" for the demo.
4. **21st skills:** ask whether to remove the 6 unrequested ones from `~/.claude/skills`, `~/.cursor/skills` and `~/.codex/skills`. `21st-ui-build` may be worth keeping.
5. **Delete the old prototype** (`app/src/renderer/prototypes/redesign/` and `redesign.html`). It has been superseded twice.
6. **Setup-era files:** ask whether to delete `install.ps1` (a third-party installer), `test-env/`, `scripts/verify-setup.ps1` and `shadcn-registry.md`, and whether to stop tracking the dated `graphify-out/<date>/` snapshots (9 MB).
7. **Optional:**
   - Sign-up skills question (skills are worth 50 of 100 match points, and new volunteers have none).
   - Drag-to-throw on the review stack (needs `motion`).
   - A backend "undo review" endpoint.
   - A screen-reader pass on the deck and the stack.
8. **Still open from earlier:**
   - the rederive FBLA prep ("Why did you build ServeHub?");
   - the "Needs your answer" items in `docs/design-taste.md`;
   - adding the floorplan note to `CLAUDE.local.md`.
9. **After code edits:** run `graphify update .`. After larger changes, offer to "update the floorplan".
