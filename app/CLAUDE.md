# app/ — the Turnout Electron app

## Commands (run from `app/`)

```bash
npm run dev          # app with live reload
npm run typecheck    # node + web
npm test             # Vitest unit tests (business rules, in-memory SQLite)
npm run test:e2e     # builds, then Playwright drives the real app; refreshes tests/e2e/screenshots
npm run lint
```

Before calling UI or service work done: typecheck, `npm test`, and `npm run test:e2e` for anything a user can see. Four lint errors predate this work (`ipc.ts` return type, `session.tsx` exports, `profile.tsx` effect); don't count them as yours.

## Shape of the code

UI → `api('name', input)` → preload → `main/ipc.ts` → `services/` → `db/`. Each layer talks only to the next. Details: `../docs/architecture.md`.

- A new backend call needs three edits: the entry in `shared/api.ts`, the handler in `main/ipc.ts`, the function in `services/`.
- Every service function starts with a `require*` guard from `services/context.ts` and validates input with `parse(schema, input)`. Schemas live in `shared/schemas.ts`.
- Services take a `Ctx` (db, user, now). Use `ctx.now()` rather than `new Date()` so tests can set the clock.
- SQL goes through the `one` / `all` / `run` helpers with `?` parameters. Multi-step writes go in `tx`.
- New rules get a unit test in `tests/unit/` (see `helpers.ts` for `makeWorld`).

## UI

- Pages in `renderer/src/pages`, shared pieces in `components/`, shadcn primitives in `components/ui/`.
- Data with `useQuery` / `useMutation` from `lib/hooks.ts`; forms with `FormField`; page frame with `PageHeader` + `PageBody` + `Loader`.
- The organization's name comes from `useSession().org`. Capacity is drawn with `Slots` / `SpotsRow`; a shift card starts with `TypeBand`, coloured by `lib/activity-style.ts`.
- Use color tokens (`text-text-2`, `bg-card`) so dark mode works. The full design rules are in `DESIGN.md`; read it before changing how something looks.
- Smallest supported window is 960x640. Check there as well as 1280x800.
