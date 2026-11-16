# ServeHub handoff (2026-11-15)

## 1. Goal

ServeHub is the FBLA Coding & Programming entry: an offline Electron desktop app for a nonprofit's volunteer program, used by volunteers and admins. This round of work had two aims:

- Make the frontend feel polished and intentional for a nonprofit audience. That meant a new sign-in hero (inspired by the Cardova Dribbble shot, toned down for an NPO), a coordinated motion system, and stress-testing every screen with worst-case data.
- Help the author understand and explain their own code at FBLA, using the floorplan map, the rederive Socratic walkthrough, and `docs/architecture.md`.

## 2. Current state

- Everything below is **uncommitted** on `main`. The last commit is `8faab20 Motion polish and accessibility fixes from DevTools audit`.
- After the motion work: typecheck passed, 44 unit tests passed, 2 e2e tests passed. After the last change (stress-test gating) only typecheck and two builds were re-run.
- `out/` holds a plain production build (no stress-test switch), so `npm start` is demo-safe.
- `npm run lint` still reports errors, all in lines this session didn't touch: `lib/hooks.ts:34` (setLoading in an effect), `lib/session.tsx`, `pages/volunteer/profile.tsx`, `components/form.tsx`, `components/ui/*`.
- No dev server or Electron window is running.
- These are waiting on the author:
  - **Break-test fixes:** fix all 8 findings, or only the 2 that are broken (see section 6).
  - **Recommendations prototype:** pick Ledger, Spotlight or Scorecard.
  - **Rederive:** answer the opening question, "Why did you build ServeHub? What problem existed before any of this code did?"
  - **`docs/design-taste.md`:** answer its "Needs your answer" items, and decide whether `CLAUDE.md` should point to it.
  - **Floorplan:** never answered the offer to write a `CLAUDE.local.md`.

## 3. Active files

All paths are under `app/src/renderer/` unless they start with another root.

| File | Why it matters |
|---|---|
| `src/assets/main.css` | Motion tokens (`--ease-snappy`, `--ease-glide`, `animate-enter`/`appear`/`reveal`/`fill`, hero `rise`/`settle`), view-transition rules, reduced-motion override |
| `src/lib/utils.ts` | `withViewTransition()` and `entrance()` helpers |
| `src/lib/hooks.ts` | `reload()` now resolves after the new data is painted (flushSync); `useWelcome()` |
| `src/lib/api.ts` | The one door to the backend; stress-test hook behind `VITE_STRESS_TEST` |
| `src/App.tsx` | Routes and guards; `PublicOnly` passes `state={{ welcome: true }}`; renders `DataToggle` only with the flag |
| `src/pages/auth.tsx` | Sign-in hero, word stagger, pills |
| `src/pages/volunteer/dashboard.tsx` | Welcome entrance, Meter fill, named view transitions; this is where the chosen prototype goes |
| `src/pages/admin/impact.tsx` | Staggered stat entrance |
| `src/pages/volunteer/hours.tsx` | View transition on log, `table-fixed` columns |
| `src/components/activity.tsx` | `SignupButton` / `ActivityCard` take `onChange` and wrap it in a view transition |
| `src/dev/worst-case.ts`, `src/dev/data-toggle.tsx` | Worst-case / Empty data modes (opt-in only) |
| `prototypes/recommendations.html` + `prototypes/recommendations/` | Three dashboard-recommendation variants to compare |
| `app/tsconfig.web.json` | Includes `src/renderer/prototypes/**/*` (remove after a pick) |
| `app/DESIGN.md` | Sign-in Hero and Motion sections |
| `docs/design-taste.md` | Learned taste rules plus open questions |
| `docs/architecture.md`, `floorplan/`, `.rederive/map.md` | Study material for the FBLA explanation (`.rederive/` is git-excluded) |
| `.claude/launch.json` | `servehub-dev` (no debug-port flags) and `knowledge-graph` |

## 4. Changes made

**Sign-in hero and welcome flow**
- New hero on `auth.tsx`. Words stagger with an eased curve, `420 * (1 - (1 - i/LAST)^2)` ms, and the pills follow at 1000/1100/1170 ms.
- Signing in or up navigates with `state.welcome`. The dashboard plays its entrance only then; `useWelcome()` clears the flag with `replaceState`, so pressing Back doesn't replay it.

**Motion system (Emil Kowalski rules)**
- Nothing animates on plain navigation or keyboard actions.
- UI motion uses strong ease-out and stays under 300 ms. Stagger gaps shrink as the list goes on.
- Volunteer dashboard entrance: three containers at 0/50/90 ms. The Meter fills at 220 ms.
- Impact page entrance: stats at 0/40/70/90 ms, panels at 120 ms.
- Certificate: a `clip-path` reveal right after one is issued.
- Help: answers fade only, at 150 ms.
- View transitions on signup, cancel and log-hours:
  - Only named rows animate, and the root crossfade is off.
  - Leaving rows fade out in 150 ms. Arriving rows wait 100 ms, then fade in over 180 ms.
- Approvals and My Shifts deliberately have no view transitions (see section 5).
- Reduced motion turns off durations and delays.
- Tooltips no longer animate when they open instantly.

**Stress testing (break-ui)**
- `dev/worst-case.ts` rewrites real API answers with worst-case values that stay inside the schema limits: 85-character titles, long Polish and Spanish names, 10 skills, 1284 waitlisted. It also has an Empty mode.
- `dev/data-toggle.tsx` is the switch for these modes.
- Both are compiled in only when started with `VITE_STRESS_TEST=1`. Two builds confirmed this: one with the flag contains the switch, one without doesn't.

**Prototypes**
- Three versions of the dashboard recommendations (Ledger, Spotlight, Scorecard) on an isolated Vite page with a picker.
- The production build was checked and excludes them.

**Docs and study material**
- `app/DESIGN.md`: Sign-in Hero and Motion sections.
- `docs/design-taste.md`.
- `docs/architecture.md`.
- Floorplan map in `floorplan/`.
- Rederive map in `.rederive/map.md`.

**Review fixes (ponytail)**
- Removed the debug-port flags from the `servehub-dev` launch config.
- Gated the stress-test switch behind `VITE_STRESS_TEST`.

**Also in the uncommitted tree** (cleanup and security, already in place before the motion work)
- CSV export escapes cells starting with `= + - @`, which stops spreadsheet formula injection. A unit test covers it in `tests/unit/smart.test.ts`.
- `checkSkillsExist` is shared by the activity and profile saves.
- Removed dead helpers: `overlaps` and `dateOf` from `shared/time.ts`, `lib/org.ts` (replaced by `ORGANIZATION` from `@shared/types`), and the `PreloadApi` type.
- Field hints are no longer announced while an error is showing.
- Saving an activity on Manage Activity reloads the page data.
- e2e screenshots were regenerated.

## 5. Failed attempts

| Tried | What went wrong | What replaced it |
|---|---|---|
| Passing the welcome flag only from the login page's own `navigate()` | `PublicOnly`'s `<Navigate>` redirect fired first and dropped the state | Set `state={{ welcome: true }}` on the `PublicOnly` redirect too |
| Leaving `location.state.welcome` in history | Back/forward replayed the entrance | `useWelcome()` clears it with `replaceState` |
| Default view-transition root crossfade | Whole page ghosted during a row change | `::view-transition-*(root) { animation: none }` and named rows only |
| Arriving row animating at the same time as its neighbors slid | New row overlapped the sliding row | 100 ms delay on `vt-arrive` |
| View transitions for removals in Approvals and My Shifts | The bordered card snapped shorter and table columns re-flowed mid-animation | Removed them there (comment in each file); `table-fixed` with set widths on My Hours |
| Styling prototypes through the app's main CSS | Tailwind didn't scan `prototypes/`, so classes were missing | Prototype has its own `styles.css` with `@source '.'` |
| Bulk import rewrite with PowerShell `Get-Content`/`Set-Content` | Turned `·` and `’` into mojibake (`Â·`, `â€™`) in the prototype files | Repaired with a Node script; saved as a memory rule: use Edit or Node, never PowerShell text cmdlets |
| Exporting `entrance`, `useWelcome`, `spots` from component files | react-refresh lint errors | Moved them into `lib/` and `data.ts` |
| Updating `latest.current` during render in `hooks.ts` | "Cannot access refs during render" lint error | Moved into `useLayoutEffect` |
| Assigning `location.href` in the data toggle | "This value cannot be modified" lint error | `location.assign(url)` |
| Gating the stress test on `import.meta.env.DEV` | Switch showed in every `npm run dev`, which is how the app gets demoed | Gated on `VITE_STRESS_TEST === '1'` |

## 6. Specific next steps

1. **Re-run the checks before anything else**, since tests weren't re-run after the last change:
   ```bash
   npm --prefix app run typecheck
   ```
   ```bash
   npm --prefix app test
   ```
   ```bash
   npm --prefix app run test:e2e
   ```
2. **Open the real Electron window once** (`npm --prefix app run dev`). Confirm that the switch is gone, the sign-in hero plays, and the dashboard entrance runs only right after sign-in.
3. **Break-test fixes** (author's choice: all, or only 1 and 2). To reproduce, start with the flag (`$env:VITE_STRESS_TEST='1'; npm run dev` in PowerShell) and pick Worst case.
   1. Broken: Approvals at 960 px wide; the action buttons are pushed off the card.
   2. Broken: Volunteers directory at 960 px; columns are pushed off the card.
   3. Raw counts like `1284` and `1000` need thousands separators.
   4. The MapPin icon is squished on dashboard recommendation cards (needs `shrink-0`).
   5. A card with 10 skills stretches its whole Browse row (cap the chips, show "+N").
   6. The Activity detail header wraps its back button.
   7. "1 of 1 spots left" reads oddly. Say "Last spot" instead.
   8. In Empty mode, the Impact chart is blank and the skill-gap copy is misleading. These need real empty states.
4. **Pick a recommendations prototype.** Open `prototypes/recommendations.html` through the dev server. Then:
   - move the chosen variant into `pages/volunteer/dashboard.tsx`
   - delete `src/renderer/prototypes/`
   - remove the prototypes line from `app/tsconfig.web.json`
5. **Answer the rederive question** and keep going with `/rederive`, so the walkthrough continues toward FBLA prep.
6. **Fill in `docs/design-taste.md` → "Needs your answer"**, and decide whether to link it from `CLAUDE.md`.
7. **Optionally clear the pre-existing lint errors** listed in section 2.
8. **Commit** once the checks pass. Run `graphify update .` after any code edit.
