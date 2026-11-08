# ServeHub

ServeHub is a volunteer management app for nonprofits, built for the FBLA Coding & Programming event (2026-27 topic: *Serving the Community: Nonprofit Volunteer Management*).

Volunteers find shifts, sign up (or join a waitlist), log their hours, and download a service certificate. Coordinators create activities, approve hours, find volunteers by skill, and report on community impact. It's a Windows desktop app that runs fully offline and keeps its data in a local SQLite database.

## Run it

You need Node.js 22 or newer.

```bash
npm install
npm run dev          # start the app with live reload
npm test             # 43 unit tests for the business rules
npm run test:e2e     # builds the app and clicks through both roles with Playwright
npm run build:win    # makes a Windows installer in dist/
```

On first launch the app loads a demo nonprofit, Riverside Community Partners. An admin can put the demo data back at any time in **Settings → Reset demo data**.

### Demo accounts

These are test accounts that exist only in the demo data.

| Role | Email | Password |
|---|---|---|
| Admin | admin@servehub.test | ServeHub2026 |
| Volunteer | maria@servehub.test | Volunteer2026 |

The other demo volunteers (jordan@, aisha@, ethan@, sofia@, liam@, grace@, noah@servehub.test) use the same volunteer password. The login screen also has one-click **Try a demo account** buttons.

## How it meets the prompt

| Requirement | Where it is |
|---|---|
| Volunteer profiles: contact info, skills, availability, interests | My profile (`pages/volunteer/profile.tsx`, `services/profiles.ts`) |
| Track completed hours | My hours, plus the dashboard progress bar toward a personal goal |
| Admin can create, update, and delete activities | Activities (`pages/admin/activities.tsx`, `services/activities.ts`). Delete is refused once hours are logged; cancel instead. |
| Volunteers browse and sign up for shifts | Find activities, then Sign up |
| Log hours; admin approves or rejects | My hours and Hour approvals (bulk approve; rejecting requires a reason) |
| Community Service certificate | My hours → Get my certificate (saved as a PDF, with a verification code) |
| Search activities by date, skill, or type | Find activities filters |
| Search volunteers by name or skill | Volunteers ("Spanish" finds translators) |
| Data saved when the app closes | SQLite file in the user's app-data folder (`src/main/db`) |
| Secure login and role-based access | Salted scrypt password hashes. Every backend call checks the role (`services/context.ts`). |
| Validation and no crashes | zod rules check format; services check meaning (see below). Errors show under the field or as a message, never a crash. |
| Bonus: email simulator | Every confirmation, waitlist move, and approval goes to Notifications. Admins see all of them in Email outbox. |
| Bonus: data visualization | Impact dashboard and Reports charts |
| Bonus: waitlist | A full shift puts new sign-ups on a waitlist. When someone cancels, the first person moves up automatically and is notified. |

Extras for the rating sheet:
- **Intelligent features:** "Recommended for you" scores each shift out of 100 and explains why (skills 50, availability 30, interests 20). The Help assistant answers typed questions offline (`src/shared/help.ts`).
- **Customizable reports:** filter by date range, activity type, and volunteer, then export to CSV or PDF.
- **Audit log:** records who approved, edited, or cancelled what.
- **Accessibility:** every input has a label, errors are announced to screen readers, focus rings are visible, it works by keyboard (`/` jumps to search, `?` opens Help), dark mode is available, and nothing relies on color alone.

### Validation that checks meaning, not just format

- You can't sign up twice, and you can't hold two shifts that overlap in time.
- Hours must be more than 0, in quarter hours, no more than the shift's length, and logged only after a shift you were confirmed for has ended. You can't log the same shift twice.
- An activity must end after it starts, on the same day, and in the future. Its capacity can't drop below the number of people already confirmed.
- Two availability blocks on the same day can't overlap.

## How it's built

```
Renderer (React UI)  --window.api.call(name, input)-->  Main process
  no Node or database access                             ipc.ts: one router, catches every error
                                                         services/: business rules + role checks
                                                         db/: SQLite schema, transactions, demo data
```

- **TypeScript** everywhere, so the UI and backend share one set of types (`src/shared/api.ts` lists every call).
- **Electron** with `contextIsolation`, `sandbox`, and no `nodeIntegration`. The UI can only call the approved API.
- **SQLite** through Node's built-in `node:sqlite`, so there is no native package to compile. Sign-ups run in a transaction (`BEGIN IMMEDIATE`), so two people can't take the last spot at once.
- **React + Tailwind + shadcn/ui** for the interface. The design comes from the team's Figma mockups (see `../docs/design/figma.md`) and is documented in `DESIGN.md`.

```
src/
  main/       index.ts (window + startup), ipc.ts (API router)
              db/ (schema, helpers, seed)  services/ (auth, activities, signups, hours, profiles, reports, recommendations, log)
  preload/    the one bridge function exposed to the UI
  shared/     types, zod rules, API contract, help FAQ, date helpers (used by both sides)
  renderer/   React app: pages/, components/, lib/
tests/
  unit/       Vitest tests on an in-memory database
  e2e/        Playwright tests on the real app; screenshots saved to tests/e2e/screenshots/
```

## Libraries and licenses

All of these are open source. None are copied into our code; they're installed with npm.

| Library | Version | License | Used for |
|---|---|---|---|
| Electron | 44 | MIT | Desktop app shell |
| electron-vite, Vite | 6, 8 | MIT | Build and dev server |
| @electron-toolkit/utils | 4 | MIT | Window helpers |
| electron-builder | 26 | MIT | Windows installer |
| React, React DOM | 19 | MIT | User interface |
| React Router | 8 | MIT | Page navigation |
| Tailwind CSS, tailwind-merge, tw-animate-css | 4, 3, 1 | MIT | Styling |
| shadcn/ui components (copied into `components/ui` by the shadcn CLI) | n/a | MIT | Buttons, tables, dialogs, sidebar, and other components |
| Radix UI | 1.8 | MIT | Accessible building blocks under shadcn/ui |
| class-variance-authority | 0.7 | Apache-2.0 | Component variants |
| clsx | 2 | MIT | Class names |
| lucide-react | 1 | ISC | Icons |
| Recharts | 3 | MIT | Charts |
| Sonner | 2 | MIT | Toast messages |
| zod | 4 | MIT | Input validation |
| Geist (via @fontsource-variable/geist) | 5 | SIL OFL 1.1 | Font, bundled so it works offline |
| TypeScript | 5.9 | Apache-2.0 | Language |
| Vitest | 5 | MIT | Unit tests |
| Playwright | 1.65 | Apache-2.0 | End-to-end tests and screenshots |

All demo names, organizations, and data are made up.
