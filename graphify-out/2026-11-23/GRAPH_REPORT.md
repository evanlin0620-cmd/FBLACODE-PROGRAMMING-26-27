# Graph Report - fblacode26-27  (2026-11-19)

## Corpus Check
- 135 files · ~69,694 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .css 2)

## Summary
- 965 nodes · 3389 edges · 52 communities (42 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e920fe2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Screens and Pages
- cn
- Redesign Prototype
- Desktop Packaging
- App Shell and Menus
- Design System Spec
- Components
- types.ts
- ServeHub architecture
- auth.tsx
- activity.tsx
- spotsLabel
- session.tsx
- ServeHub handoff (2026-11-15)
- shadcn Config
- Runtime Dependencies
- Build Scripts
- ErrorBoundary
- eslint.config.mjs
- Figma Design Source
- End-to-End Tests
- ApiError
- Claude setup for this repo
- Chart Components
- Product Brief
- app/ — the ServeHub Electron app
- Renderer TS Config
- Redesign Critique Signals
- Node TS Config
- src/main.tsx
- worst-case.ts
- reports.ts
- Design Taste Lessons
- Vite Build Config
- Redesign Critique Report
- app/package.json
- Root TS Config
- Setup Test Environment
- Setup Doctor Script
- ServeHub
- Figma Mockup Notes
- Root Package
- Typography Rules
- Status Color Rules
- Renderer Surface Brief
- Window Typings
- main/index.ts
- Project Design Context
- Colors

## God Nodes (most connected - your core abstractions)
1. `cn()` - 127 edges
2. `Button()` - 69 edges
3. `react` - 47 edges
4. `useQuery()` - 40 edges
5. `PageBody()` - 39 edges
6. `PageHeader()` - 38 edges
7. `Loader()` - 36 edges
8. `lucide-react` - 35 edges
9. `Approvals()` - 35 edges
10. `useMutation()` - 34 edges

## Surprising Connections (you probably didn't know these)
- `Rules worth knowing` --references--> `tx()`  [INFERRED]
  docs/architecture.md → app/src/main/db/index.ts
- `Could be an automatic check` --references--> `fmtCount()`  [INFERRED]
  docs/design-taste.md → app/src/renderer/src/lib/format.ts
- ``src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)` --references--> `activity()`  [INFERRED]
  docs/architecture.md → app/tests/unit/smart.test.ts
- ``src/shared`` --references--> `Handlers`  [INFERRED]
  docs/architecture.md → app/src/main/ipc.ts
- `4. Changes made` --references--> `checkSkillsExist()`  [INFERRED]
  handoff.md → app/src/main/services/activities.ts

## Import Cycles
- 2-file cycle: `app/src/main/services/activities.ts -> app/src/main/services/signups.ts -> app/src/main/services/activities.ts`

## Hyperedges (group relationships)
- **ServeHub color-meaning rules** — app_design_three_signals_rule, app_design_word_not_just_color_rule, app_design_riverside_green, app_design_pills, app_design_capacity_bar_signature [EXTRACTED 1.00]
- **shadcn blocks used by the Figma mockups** — docs_design_figma_servehub_figma_file, shadcn_registry_sidebar_07, shadcn_registry_login_03, shadcn_registry_dashboard_01, shadcn_registry_chart_bar_default [EXTRACTED 1.00]
- **ServeHub motion system and its rationale** — app_design_motion, app_design_withviewtransition, app_design_usewelcome, app_design_sign_in_hero, docs_design_taste_emil_kowalski_motion_rules, docs_design_taste_calm_working_screens [INFERRED 0.85]

## Communities (52 total, 10 thin omitted)

### Community 0 - "Screens and Pages"
Cohesion: 0.10
Nodes (106): UI, router, ActivityCard(), DateTile(), WhenWhere(), CertificateView(), FormField(), numberValue() (+98 more)

### Community 1 - "cn"
Cohesion: 0.11
Nodes (29): class-variance-authority@^0.7.1, FieldProps, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants (+21 more)

### Community 2 - "Redesign Prototype"
Cohesion: 0.05
Nodes (70): CreateAccountForm(), Errors, Field(), focusFirst(), SignInForm(), useBusy(), without(), FEATURED (+62 more)

### Community 3 - "Desktop Packaging"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 4 - "App Shell and Menus"
Cohesion: 0.12
Nodes (21): AppShell(), count(), MENU, NAV, NavItem, Section(), SidebarData, useSidebarData() (+13 more)

### Community 5 - "Design System Spec"
Cohesion: 0.14
Nodes (13): Design System: ServeHub, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy, Layout, Named Rules (+5 more)

### Community 6 - "Components"
Cohesion: 0.15
Nodes (10): Buttons, Capacity Bar (signature), Cards / Containers, Chips (Pills), Components, Date Tile, Empty and Error States, Inputs / Fields (+2 more)

### Community 7 - "types.ts"
Cohesion: 0.06
Nodes (62): Handlers, ApiMap, ApiName, answer(), Faq, FAQS, normalize(), STOP_WORDS (+54 more)

### Community 8 - "ServeHub architecture"
Cohesion: 0.13
Nodes (14): Shift matching that explains itself, Recommended for you scoring (skills 50, availability 30, interests 20), Electron + React + Tailwind + shadcn/ui + node:sqlite stack, Automatic waitlist promotion, CSV formula-injection escaping, Four-layer renderer/preload/ipc/services/db flow, Layers, Result / AppError / ApiError error path (+6 more)

### Community 9 - "auth.tsx"
Cohesion: 0.20
Nodes (19): home(), RequireRole(), DeckItem, FanDeck(), FieldGroup(), useSession(), AuthFrame(), Brand() (+11 more)

### Community 10 - "activity.tsx"
Cohesion: 0.26
Nodes (19): SignupButton(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+11 more)

### Community 11 - "spotsLabel"
Cohesion: 0.43
Nodes (6): TypeBand(), Slots(), SpotsRow(), spotsLabel(), ShiftCard(), Dealt()

### Community 12 - "session.tsx"
Cohesion: 0.40
Nodes (5): readTheme(), SessionContext, SessionProvider(), SessionValue, ORGANIZATION

### Community 13 - "ServeHub handoff (2026-11-15)"
Cohesion: 0.12
Nodes (15): Motion, Sign-in Hero, useWelcome once-per-login entrance, withViewTransition list refreshes, PublicOnly(), useWelcome(), Motion, 1. Goal (+7 more)

### Community 14 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 15 - "Runtime Dependencies"
Cohesion: 0.13
Nodes (15): dependencies, clsx@^2.1.1, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1, recharts@^3.8.0, sonner@^2.0.8, tailwind-merge@^3.7.0 (+7 more)

### Community 16 - "Build Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 17 - "ErrorBoundary"
Cohesion: 0.40
Nodes (3): ErrorBoundary, FriendlyError(), RouteError()

### Community 18 - "eslint.config.mjs"
Cohesion: 0.15
Nodes (12): @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, eslint@^9.39.5, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, @electron-toolkit/eslint-config-prettier, @electron-toolkit/eslint-config-ts (+4 more)

### Community 19 - "Figma Design Source"
Cohesion: 0.27
Nodes (11): ServeHub renderer surface (all screens), ServeHub Design System, 240px sidebar navigation, Figma screens (Login, Volunteer Dashboard, Browse, Help, Admin Impact, Hour Approvals), ServeHub Figma file tJfyvE4fPnORzU8PZv0IHr, Figma Tokens page (Color Light/Dark, Scale), chart-bar-default block, dashboard-01 block (+3 more)

### Community 20 - "End-to-End Tests"
Cohesion: 0.21
Nodes (6): launch(), shot(), Bridge, logout(), menu(), @playwright/test

### Community 22 - "Claude setup for this repo"
Cohesion: 0.40
Nodes (4): Claude setup for this repo, Keeping context light, Skills by department, When tools overlap

### Community 23 - "Chart Components"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 25 - "Product Brief"
Cohesion: 0.15
Nodes (12): Creative North Star: The Volunteer Desk, Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning (+4 more)

### Community 27 - "Renderer TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, jsx, paths, extends, include, @renderer/* (+2 more)

### Community 28 - "Redesign Critique Signals"
Cohesion: 0.33
Nodes (5): Redesign Prototype Critique (22/40), Design Health Score (Nielsen heuristics), Personas Alex, Sam, Jordan, Renderer index.html (CSP, mounts main.tsx), Redesign prototype page (current vs unslopped)

### Community 29 - "Node TS Config"
Cohesion: 0.20
Nodes (9): compilerOptions, baseUrl, composite, paths, types, extends, include, @shared/* (+1 more)

### Community 30 - "src/main.tsx"
Cohesion: 0.33
Nodes (4): @fontsource-variable/geist@^5.3.0, react-dom@^19.3.0, @fontsource-variable/geist, react-dom

### Community 31 - "worst-case.ts"
Cohesion: 0.11
Nodes (20): DataToggle(), MODES, applyDataMode(), COUNTS, DataMode, dataMode(), empty(), Obj (+12 more)

### Community 32 - "reports.ts"
Cohesion: 0.07
Nodes (102): Shape of the code, all(), Db, one(), openDb(), run(), tx(), SCHEMA (+94 more)

### Community 34 - "Design Taste Lessons"
Cohesion: 0.18
Nodes (10): Could be an automatic check, Data and layout (from the worst-case test, `?data=worst`), Learned in testing, Needs your answer, Automatic check: no transition-all, ServeHub design taste, Tooling, Worst-case data lessons (?data=worst) (+2 more)

### Community 35 - "Vite Build Config"
Cohesion: 0.22
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 36 - "Redesign Critique Report"
Cohesion: 0.29
Nodes (6): Design Health Score (pre-fix, as assessed), Design Specificity, Minor, Persona red flags, Priority Issues, Questions

### Community 37 - "app/package.json"
Cohesion: 0.09
Nodes (28): author, description, devDependencies, electron-builder@^26.15.3, @electron-toolkit/tsconfig@^2.0.0, @playwright/test@^1.65.0, prettier@^3.9.10, react@^19.3.0 (+20 more)

### Community 38 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 39 - "Setup Test Environment"
Cohesion: 0.33
Nodes (6): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, AI-sounding text fixture, [env-smoke-test] page loaded console log, Smoke Test Page (deliberately flawed UI)

### Community 43 - "ServeHub"
Cohesion: 0.16
Nodes (11): FBLA judges / 7-minute demo, Riverside Community Partners (demo nonprofit), ServeHub Product, Demo accounts, Offline Help assistant (src/shared/help.ts), How it meets the prompt, How it's built, Libraries and licenses (+3 more)

### Community 44 - "Figma Mockup Notes"
Cohesion: 0.50
Nodes (3): Accessibility notes shown in the mockups, Pages and frames, ServeHub — Figma design

### Community 46 - "Root Package"
Cohesion: 0.67
Nodes (3): devDependencies, shadcn@^4.23.0, shadcn

### Community 53 - "main/index.ts"
Cohesion: 0.18
Nodes (9): @electron-toolkit/utils@^4.0.0, electron@^44.7.2, APP_PAGE, createWindow(), isAppUrl(), norm(), api, electron (+1 more)

### Community 56 - "Project Design Context"
Cohesion: 0.20
Nodes (9): Avoid, Components, Constraints, Decisions, Must, Project, Project Design Context, Sources (+1 more)

### Community 57 - "Colors"
Cohesion: 0.33
Nodes (6): Colors, Named Rules, Neutral, Primary, Secondary, Tertiary

## Knowledge Gaps
- **19 isolated node(s):** `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Shift matching that explains itself`, `FBLA study material (floorplan, rederive)`, `withViewTransition list refreshes` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 277 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ServeHub handoff (2026-11-15)` connect `ServeHub handoff (2026-11-15)` to `ServeHub architecture`, `activity.tsx`, `Design Taste Lessons`, `Figma Design Source`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useQuery()` (e.g. with `UI` and ``src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)`) actually correct?**
  _`useQuery()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Shift matching that explains itself` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Screens and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.10435178856231488 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `Screens and Pages`, `Redesign Prototype`, `App Shell and Menus`, `auth.tsx`, `activity.tsx`, `spotsLabel`, `Chart Components`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.11261261261261261 - nodes in this community are weakly interconnected._
- **Why does `ServeHub Design System` connect `Figma Design Source` to `Design Taste Lessons`, `ServeHub`, `ServeHub handoff (2026-11-15)`, `Product Brief`, `Redesign Critique Signals`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._