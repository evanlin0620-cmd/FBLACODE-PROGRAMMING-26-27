# ServeHub handoff (2026-11-25)

## 1. Goal

ServeHub is the FBLA Coding & Programming 2026-27 entry: an offline Electron desktop app that runs **any** nonprofit's volunteer program, for volunteers and coordinators (admins). "Riverside Community Partners" is now only the **example organization**: loaded on request, always labelled "Example data".

This round of work:
- **Graphite redesign:** a left sidebar, dark by default, a month headline, a smooth Impact line chart, and motion work. Committed and pushed as `380f41d`.
- **Review fixes:** five issues from `/ponytail-review` are fixed, also in `380f41d`:
  - theme key `servehub-theme-v2`;
  - the sidebar refreshes after sign-up or cancel;
  - the navigation guard fails closed;
  - the sidebar uses `signups.mine`;
  - a misplaced doc comment.
- **First-run setup:** a fresh install opens on Welcome, built from entry direction C ("Try it as…", chosen 2026-11-23). **Uncommitted.**
- **Abandoned:** a Hallmark prototype (themes Overprint, Furrow, Console). The user disliked it; it is deleted and the hallmark skill is uninstalled (`~/.claude/skills`, `~/.agents/skills`, `~/.agents/.skill-lock.json`).

## 2. Current state

**Git**
- `main` = `origin/main` = `7fa4540`. That commit is the user's own: it added `"ignoreDeprecations": "6.0"` to `app/tsconfig.node.json`.
- **Uncommitted: the first-run setup and Welcome work** (about 20 files plus refreshed e2e screenshots and `graphify-out`). See section 4.

**Checks (after the last code change)**
- Typecheck: web is clean. **Node fails only because of `"ignoreDeprecations": "6.0"`**, which TS 5.9.3 rejects; with `--ignoreDeprecations 5.0` it is clean. The user has not decided whether to change it to `"5.0"`.
- 61 unit tests pass, including 6 new ones in `tests/unit/setup.test.ts`.
- 4 e2e tests pass. Two are new boot tests:
  - a fresh install: setup, the password-mismatch error, landing on Impact, and a second setup being refused;
  - the example sign-in.
- Lint has no new errors. The old ones remain: `ipc.ts:34` return type, `session.tsx` exports, and the shadcn `ui/*` files.
- Looked at:
  - Welcome, dark and light, at 1280×800 (mid-animation and at rest), and at 960×640.
  - Sign-in with the example, dark, at 1280×800.

**Outside the repo**
- The 21st CLI is **not signed in**. The 21st MCP works: free tier, AI generation off, 2 code retrievals a day.
- `.claude/launch.json` is back to its original two entries (`servehub-dev` and `knowledge-graph`).

## 3. Active files

All paths are under `app/src/` unless another root is shown.

| File | Why it matters |
|---|---|
| `main/services/settings.ts` | Setup functions:<br>• `setupStatus`<br>• `createOrganization` (public, empty install only, creates the first admin)<br>• `loadExample`<br>• `migrateLegacyInstall` (old demo-seeded installs become the example)<br>• `putSetting`<br>`createUser` runs its own `tx`, and `tx` does not nest. |
| `main/index.ts` | No auto-seed on startup any more; calls `migrateLegacyInstall`. |
| `main/db/seed.ts` | Writes the `org_name` = `EXAMPLE_ORGANIZATION` and `example_data` = `1` settings. |
| `main/ipc.ts` | `setup.status`, `setup.create` (signs in), `setup.example`. `demo.reset` is refused unless the example is loaded. |
| `shared/types.ts`, `schemas.ts`, `api.ts` | `EXAMPLE_ORGANIZATION`, `DEFAULT_ORGANIZATION` ("Your organization"), `SetupStatus`, `setupSchema`, the API entries. |
| `renderer/src/lib/session.tsx` | Reads `setup.status` at boot and exposes `needsSetup`, `example` and `refreshSetup`. |
| `renderer/src/App.tsx` | `/welcome` behind `SetupOnly`. `PublicOnly` sends to `/welcome` while setup is needed. |
| `renderer/src/pages/auth.tsx` | `WelcomePage` (the setup form), `ExampleRoles` (the "Try as…" tiles, which load the example on a fresh install), the animated `Clipboard`, and `AuthFrame`'s `aside` slot. The old demo prefill buttons are gone. |
| `renderer/src/assets/main.css` | `animate-write` and `animate-tick` keyframes. |
| `renderer/src/pages/admin/system.tsx` | The Example data reset panel shows only while `example` is true. |
| `app/tests/e2e/app.ts` | `launch({ example = true })` loads the example through the bridge and reloads. Pass `example: false` for an empty install. |
| `app/DESIGN.md`, `app/PRODUCT.md`, `app/.21st/design.json` | The Welcome spec, "The Example Is Labelled Rule", and the direction C decision. |

## 4. Changes made (uncommitted)

**First-run setup**
- **Fresh install:** it starts empty and opens on Welcome.
  - "Create organization" names the nonprofit and creates its first coordinator, who is then signed in.
  - "Try as a volunteer / coordinator" loads the example and signs in with one click.
- **Setup runs once:** both actions are refused after any account exists, so the public demo admin no longer ships on real installs (the security risk from the earlier handoff).
- **Example label:** Riverside appears only with the amber **Example data** tag. A real organization's sign-in shows no tiles.
- **Demo reset:** only for the example, in both the UI and the backend.
- **Legacy installs:** demo-seeded before setup existed, they are marked as the example and keep any name someone chose.

**Welcome and sign-in look (direction C)**
- **Shared left panel:** the paper panel with the brand, the serif headline, and the sign-up-sheet clipboard.
- **Animation:** the sheet writes itself in once per app session (`animate-write`, 560ms linear, 640ms stagger). Each landing name fills its slot mark and ticks "spots left" down. There is no loop, and with reduced motion it shows finished.
- **Example tiles:** with the tiles shown, the explainer line drops. Under 760px tall the sheet hides; the tiles sit at the bottom.
- **Colour:** only theme tokens (`paper`, `paper-ink`, `warning`), so light and dark both work. The clipboard stays paper in both themes because it is an object, not a surface.

**Rename to Turnout and the new mark (2026-11-25, uncommitted)**
- Chosen from a prototype (`app/src/renderer/prototypes/brand.html`, keys 1–3 and T) built with the logo-design and unslop skills. Rejected directions: Alongside (tent), Muster (collar), Show Up (webcam/avatar), Handbill, Rota.
- Mark: four tally bars with the fifth stroke cut out as a 30° channel. `components/brand-mark.tsx` (three-bar cut at 20 px and under) in the sidebar and sign-in panel. Masters and icon generator: `app/build/brand/make.mjs`. New `build/icon.png`, `build/icon.ico` (16–256, small cut for ≤24) and `resources/icon.png`; the window now uses the icon on every platform.
- The visible name is Turnout everywhere (window, title, sidebar, sign-in, emails, outbox, docs). Internal ids stay: `servehub.db`, npm name, `servehub-theme-v2`, `servehub:counts`, `SERVEHUB_DATA_DIR`, demo `@servehub.test` accounts, AppUserModelId. `userData` is pinned to `%APPDATA%/ServeHub` so the productName change doesn't strand data.
- Not done: `build/icon.icns` (macOS) is still the old icon; the wordmark is live Geist text, not outlines.

## 5. Failed attempts

| Tried | What went wrong | What replaced it |
|---|---|---|
| Hallmark prototypes (Overprint, Furrow, Console) | The user disliked them | Deleted, skill uninstalled |
| Built-in browser pane on `file://` | Renders a static snapshot with no CSS or JS | A Python `http.server` launch entry (since removed) |
| A `tx` around `createUser` in `createOrganization` | `tx` uses `BEGIN IMMEDIATE`, which does not nest | Create the user first, then the settings |
| `settings.ts` and `seed.ts` importing each other | A circular import | The seed writes its two settings inline |
| Clipboard counter with class `.left` (preview) | Collided with the panel's class | Renamed |
| The sheet as a `min-h-0 flex-1` child | It overlapped the tiles and blocked clicks (e2e timeout) | The explainer drops beside the tiles; the sheet hides under 760px |
| Reduced-motion fill via `animationend` | The slots showed empty in screenshots | Reduced motion starts the sheet finished |
| Setting the "played once" flag during render | React lint error | Set in `useEffect` |
| `21st` CLI search | Not signed in | The 21st MCP `search` / `get_inspiration` tools |

**Usefulness round (2026-11-25, uncommitted, with the count-up motion work)**
- Decision: no three.js or landing page (offline desktop demo, no rubric credit). Plan: `~/.claude/plans/use-plan-help-me-agile-spindle-of-4ec55c17-dfbf-4420-97b2-0596eb25929d.md`.
- Add to calendar: `shared/calendar.ts` (`toIcs`), `signups.calendarFile`, API `signups.calendar` (save dialog), `CalendarButton` on the ticket, My shifts and activity page.
- Reminders: `signups.remindUpcoming` runs from the `auth.login` handler for volunteers; confirmed shifts in the next 7 days (not 72h: the example's next shift is 6 days out), once each via `signups.reminded_at`.
- Fill-a-shift: `profiles.suggestVolunteers` / `inviteVolunteer` (in profiles.ts to avoid an activities↔profiles import cycle), new `invites` table, API `volunteers.suggest` / `volunteers.invite`, "Suggested volunteers" panel on the admin activity page.
- Welcome: tally stroke (`animate-strike`) after the last name lands.
- `docs/demo-script.md`; e2e now covers the calendar save (stubbed dialog), the reminder, and an invite to Creek Cleanup.

**Entries ledger (2026-11-25, uncommitted)**
- Reports "All entries" is now a month-grouped ledger (`EntryLedger`, `TypeMark`), chosen from `app/src/renderer/prototypes/entries.html` with the impeccable and emil-design-eng skills.
- Fixed a pre-existing bug: PDFs saved in dark theme printed dark cards with invisible titles. `reports.savePdf` now drops the dark class for the print and restores it.

## 6. Specific next steps

1. **Commit** the first-run setup work as one commit, then push if the user asks.
2. **The tsconfig decision:** change `ignoreDeprecations` to `"5.0"` (recommended) or upgrade TypeScript. Until then, `npm run typecheck` fails.
3. **Try it by hand:**
   - Start with a fresh data folder (`SERVEHUB_DATA_DIR`) to see Welcome.
   - Create an organization and check the sidebar name.
   - Try both example tiles.
   - Look at the sign-up page in light mode, which wasn't checked.
4. **Docs:** update `docs/architecture.md` for the setup flow (not touched this round), and offer to "update the floorplan".
5. **Still open from earlier:**
   - Remove the old prototype at `app/src/renderer/prototypes/redesign/` and the setup-era files (`install.ps1`, `test-env/`, `scripts/verify-setup.ps1`, `shadcn-registry.md`).
   - Whether to keep tracking the dated `graphify-out/<date>/` snapshots.
   - The 6 unrequested 21st skills.
   - Drag-to-throw on the real review stack (it needs `motion`, or the hand-written spring from the deleted prototype).
   - A backend "undo review" endpoint.
   - A screen-reader pass on the deck, the stack and the Welcome tiles.
   - The rederive FBLA prep.
6. **After code edits:** run `graphify update .`.
