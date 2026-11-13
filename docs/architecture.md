# ServeHub architecture

ServeHub is an offline desktop app (Electron) for one nonprofit's volunteer program.
Everything runs on one computer: the UI, the backend logic and a local SQLite file.
There is no server and no network traffic; "emails" are rows in a simulated outbox.

Code lives in `app/src`, split into four layers. Each layer only talks to the one next to it.

```
renderer (React UI)  ──api('name', input)──▶  preload  ──ipcRenderer.invoke('api')──▶  main/ipc.ts
                                                                                          │
                                                       services (rules + RBAC + zod)  ◀──┘
                                                                  │
                                                       db (node:sqlite, one file)
```

`src/shared` is imported by both sides: types, zod schemas, the API contract, time helpers, help content.

## Layers

### `src/main` (Electron main process, the backend)

| File | Job |
|------|-----|
| `index.ts` | Entry point. Opens the DB in `userData/servehub.db`, seeds demo data on first run, registers IPC, creates a sandboxed window (`contextIsolation`, no Node, `sandbox: true`). Blocks navigation away from the app and opens only `https://` links externally. |
| `ipc.ts` | The single IPC channel `api`. Checks the sender is the app's own page, looks up the handler by name, builds a `Ctx`, and always returns `Result` (`{ ok, data }` or `{ ok: false, error }`). `AppError` becomes a friendly message; anything else is logged and returned as `INTERNAL`. Holds the logged-in `session` (main process only, the UI can't forge it). Also owns the two file-writing actions: CSV export and print-to-PDF via a save dialog. |
| `db/index.ts` | `openDb` (foreign keys on, WAL for files), `tx` (`BEGIN IMMEDIATE` … `COMMIT`/`ROLLBACK`), and the `one` / `all` / `run` query helpers. |
| `db/schema.ts` | `CREATE TABLE IF NOT EXISTS` for users, volunteer_profiles, skills, volunteer_skills, availability, activities, activity_skills, signups, hour_logs, notifications, certificates, audit_log. CHECK constraints repeat the key rules (hours 0–24, end after start, capacity > 0). |
| `db/seed.ts` | `seedDemo`: wipes all tables and loads a demo nonprofit with dates relative to "now". Used on first run and by the admin "Reset demo data" button. Demo logins are in the file header and README. |
| `services/context.ts` | `Ctx = { db, user, now }`, the RBAC guards `requireUser` / `requireAdmin` / `requireVolunteer`, and `parse` (zod → `AppError('VALIDATION', fields)`). Every service starts with a guard. |
| `services/auth.ts` | scrypt password hashing, sign-up (always volunteer), login, admin-created admins. |
| `services/activities.ts` | `loadActivities` (one query with sign-up counts and the viewer's status/waitlist position, plus one batched skills query), list/filter, create/update/cancel/delete, roster, `checkSkillsExist`. |
| `services/signups.ts` | Sign up (waitlist when full, no overlapping shifts), cancel, `promoteFromWaitlist`, my shifts. All writes in one `tx`. |
| `services/hours.ts` | Log hours (confirmed, finished, ≤ shift length, no duplicates), approval queue, bulk approve/reject, `approvedTotal`. |
| `services/profiles.ts` | Volunteer profile (skills, interests, availability, goal), admin directory search and volunteer record. |
| `services/recommendations.ts` | Pure scoring: skills 50 + availability 30 + interest 20, minus 25 when full. No DB access. |
| `services/reports.ts` | Volunteer dashboard, admin impact stats (incl. skill gaps), customizable hours report, CSV text, certificate issue/verify. Totals count approved hours only. |
| `services/log.ts` | `notify` (outbox row) and `audit` (audit row) write helpers, inbox, mark-read, admin outbox and audit list. |

### `src/preload`

`index.ts` exposes exactly one function to the page: `window.api.call(name, input)` → `ipcRenderer.invoke('api', name, input)`. The page gets no Node, file system or raw IPC. `index.d.ts` types `window.api` for the renderer.

### `src/shared`

| File | Job |
|------|-----|
| `api.ts` | `ApiMap`: every call name with its input and output type. `ipc.ts` must implement all of them (typed `Handlers`), and the renderer's `api()` is typed from it, so a mismatch is a compile error. |
| `schemas.ts` | zod schemas for every form. The UI uses them for messages; the services run them again because the UI is not trusted. `fieldErrors` turns zod issues into `{ field: message }`. |
| `types.ts` | Data types (`Activity`, `HourLog`, `Profile`, …), `ACTIVITY_TYPES`, `WEEKDAYS`, `ORGANIZATION`, and `Result<T>`. |
| `errors.ts` | `AppError(code, message, fields?)`, the only error services throw on purpose. |
| `time.ts` | Stamps are local-time strings `YYYY-MM-DDTHH:mm` (they sort in time order, so SQL compares them directly). `toStamp`, `hoursBetween`, `weekdayOf`, `timeOf`, `prettyStamp`. |
| `help.ts` | FAQ content and search for the Help page. |

### `src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)

- `App.tsx`: route tree with role guards (`PublicOnly`, `RequireRole`), error boundary, toaster.
- `lib/api.ts`: typed `api(name, input)`; unwraps `Result` or throws `ApiError(code, message, fields)`.
- `lib/hooks.ts`: `useQuery` (load on mount and when input changes, ignores stale answers, `reload()`) and `useMutation` (double-click guard, field errors for forms, toast for other errors).
- `lib/session.tsx`: mirrors the main-process session (`auth.me`) and the light/dark theme.
- `lib/format.ts`: display formatting (`fmtDay`, `fmtRange`, `fmtHours`, `nowStamp`, `today`, …).
- `lib/utils.ts`: `cn` and `returnFocusOnClose` (focus restore for state-driven dialogs).
- `components/`: `app-shell` (sidebar nav with badge counts, keyboard shortcuts), `page` (header, body, `Loader`, empty/error states, `ChartTable` for screen readers), `form` (`FormField` with labels and announced errors), `status` (pills, capacity bar, meter), `activity` (card, sign-up button), `certificate-view`; `ui/` is generated shadcn/ui.
- `pages/`: `auth`, `help`, `notifications`; `volunteer/` (dashboard, browse, activity-detail, shifts, hours, certificate, profile); `admin/` (impact, activities, approvals, volunteers, reports, system = outbox/audit/settings).

## A request end to end

Example: a volunteer clicks **Sign up**.

1. `SignupButton` calls `useMutation('signups.join').run(activityId)`.
2. `api()` calls `window.api.call('signups.join', id)`; preload forwards it with `ipcRenderer.invoke('api', …)`.
3. `ipc.ts` checks the sender URL, finds the handler, builds `Ctx { db, user: session, now }`.
4. `signups.signUp` runs `requireVolunteer`, `parse(idSchema)`, then one `tx`: re-reads the activity, checks it's open and not started, rejects duplicates and overlapping shifts, counts confirmed, inserts as `confirmed` or `waitlisted`, writes a notification.
5. The result travels back as `{ ok: true, data: { status, position } }`; the hook shows a toast and the page calls `reload()`.

Failures follow the same path back: `AppError` → `{ ok: false, error: { code, message, fields } }` → `ApiError` → field messages under inputs or a toast.

## Rules worth knowing

- Access control is enforced in the services, not in the router or the UI. The UI guards only decide what to show.
- Validation runs twice: zod in the service (trust boundary) and the same schema's messages in the UI. Meaning checks (full, ended, overlap) live only in services.
- Multi-row writes go through `tx`. IPC handlers are synchronous except the two save-dialog actions, so the single main process serialises all DB work.
- Only approved hours count toward totals, reports and certificates.
- Every admin change writes an `audit_log` row; every user-facing event writes a `notifications` row (the simulated email outbox).
- CSV export prefixes cells starting with `= + - @` with `'` so spreadsheet apps don't run them as formulas.

## Tests

- `npm test` (vitest): `tests/unit/*` exercise the services against an in-memory DB (`openDb(':memory:')`, fixed `now`): access control, activities, sign-ups/waitlist, hours, recommendations, reports and CSV.
- `npm run test:e2e` (Playwright + Electron): `tests/e2e/*` boot the built app with `SERVEHUB_DATA_DIR` pointed at a temp folder and walk the main flows, saving screenshots.
- `npm run typecheck` checks the node (main/preload/shared) and web (renderer) projects separately.
