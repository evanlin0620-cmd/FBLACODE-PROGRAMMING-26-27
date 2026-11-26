# Graph Report - fblacode26-27  (2026-11-25)

## Corpus Check
- 145 files · ~78,627 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .css 2)

## Summary
- 1032 nodes · 3673 edges · 51 communities (41 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 115 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e3e6578`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Screens and Pages
- App.tsx
- volunteer.tsx
- Desktop Packaging
- App Shell and Menus
- Design System: ServeHub
- ServeHub architecture
- types.ts
- ServeHub
- shadcn-registry.md
- ServeHub design taste
- Components
- ServeHub
- Motion
- shadcn Config
- Runtime Dependencies
- Build Scripts
- worst-case.ts
- session.tsx
- Figma Design Source
- End-to-End Tests
- Claude setup for this repo
- Chart Components
- Colors
- Product Brief
- Renderer TS Config
- Redesign Prototype Critique (22/40)
- Node TS Config
- brand/main.tsx
- help.ts
- reports.ts
- electron.vite.config.ts
- Redesign Critique Report
- app/package.json
- Root TS Config
- Setup Test Environment
- Setup Doctor Script
- app/ — the Turnout Electron app
- entries/main.tsx
- Figma Mockup Notes
- Root Package
- Typography Rules
- Status Color Rules
- Renderer Surface Brief
- Window Typings
- main/index.ts
- demo-script.md
- Project Design Context

## God Nodes (most connected - your core abstractions)
1. `cn()` - 132 edges
2. `Button()` - 72 edges
3. `react` - 50 edges
4. `useQuery()` - 41 edges
5. `PageBody()` - 39 edges
6. `run()` - 38 edges
7. `PageHeader()` - 38 edges
8. `useMutation()` - 38 edges
9. `lucide-react` - 37 edges
10. `Loader()` - 37 edges

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

## Communities (51 total, 10 thin omitted)

### Community 0 - "Screens and Pages"
Cohesion: 0.05
Nodes (192): UI, ActivityCard(), CalendarButton(), DateTile(), SignupButton(), TypeBand(), TypeMark(), WhenWhere() (+184 more)

### Community 1 - "App.tsx"
Cohesion: 0.26
Nodes (11): App(), ErrorBoundary, FriendlyError(), home(), PublicOnly(), RequireRole(), RouteError(), router (+3 more)

### Community 2 - "volunteer.tsx"
Cohesion: 0.06
Nodes (62): CreateAccountForm(), Errors, Field(), focusFirst(), SignInForm(), useBusy(), without(), FEATURED (+54 more)

### Community 3 - "Desktop Packaging"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 4 - "App Shell and Menus"
Cohesion: 0.12
Nodes (20): AppShell(), count(), MENU, NAV, NavItem, Section(), SidebarData, useSidebarData() (+12 more)

### Community 5 - "Design System: ServeHub"
Cohesion: 0.14
Nodes (13): Design System: ServeHub, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy, Layout, Named Rules (+5 more)

### Community 6 - "ServeHub architecture"
Cohesion: 0.17
Nodes (11): Electron + React + Tailwind + shadcn/ui + node:sqlite stack, Automatic waitlist promotion, CSV formula-injection escaping, Four-layer renderer/preload/ipc/services/db flow, Layers, Result / AppError / ApiError error path, Rules worth knowing, ServeHub architecture (+3 more)

### Community 7 - "types.ts"
Cohesion: 0.08
Nodes (48): Handlers, ApiMap, ActivityFilter, activityFilterSchema, ActivityInput, activitySchema, availabilitySchema, certificateCodeSchema (+40 more)

### Community 8 - "ServeHub"
Cohesion: 0.15
Nodes (10): Shift matching that explains itself, Recommended for you scoring (skills 50, availability 30, interests 20), 1. Goal, 2. Current state, 4. Changes made, 6. Specific next steps, Failed attempts log, Recommendation variants: Ledger, Spotlight, Scorecard (+2 more)

### Community 9 - "shadcn-registry.md"
Cohesion: 0.18
Nodes (10): empty(), block (97), example (239), font (52), hook (1), internal (13), lib (1), style (2) (+2 more)

### Community 10 - "ServeHub design taste"
Cohesion: 0.17
Nodes (11): Could be an automatic check, Data and layout (from the worst-case test, `?data=worst`), Learned in testing, Motion, Needs your answer, Automatic check: no transition-all, ServeHub design taste, Tooling (+3 more)

### Community 11 - "Components"
Cohesion: 0.15
Nodes (10): Buttons, Capacity Bar (signature), Cards / Containers, Chips (Pills), Components, Date Tile, Empty and Error States, Inputs / Fields (+2 more)

### Community 12 - "ServeHub"
Cohesion: 0.16
Nodes (11): FBLA judges / 7-minute demo, Riverside Community Partners (demo nonprofit), ServeHub Product, Demo accounts, Offline Help assistant (src/shared/help.ts), How it meets the prompt, How it's built, Libraries and licenses (+3 more)

### Community 13 - "Motion"
Cohesion: 0.33
Nodes (4): Motion, Sign-in Hero, useWelcome once-per-login entrance, withViewTransition list refreshes

### Community 14 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 15 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1, recharts@^3.8.0, sonner@^2.0.8 (+8 more)

### Community 16 - "Build Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 17 - "worst-case.ts"
Cohesion: 0.25
Nodes (9): DataToggle(), MODES, COUNTS, DataMode, dataMode(), Obj, TEN_SKILLS, walk() (+1 more)

### Community 18 - "session.tsx"
Cohesion: 0.20
Nodes (12): applyDataMode(), api(), ApiError, Args, Mutation, Query, readTheme(), SessionContext (+4 more)

### Community 19 - "Figma Design Source"
Cohesion: 0.27
Nodes (11): ServeHub renderer surface (all screens), ServeHub Design System, 240px sidebar navigation, Figma screens (Login, Volunteer Dashboard, Browse, Help, Admin Impact, Hour Approvals), ServeHub Figma file tJfyvE4fPnORzU8PZv0IHr, Figma Tokens page (Color Light/Dark, Scale), chart-bar-default block, dashboard-01 block (+3 more)

### Community 20 - "End-to-End Tests"
Cohesion: 0.24
Nodes (6): launch(), shot(), Bridge, logout(), menu(), @playwright/test

### Community 22 - "Claude setup for this repo"
Cohesion: 0.40
Nodes (4): Claude setup for this repo, Keeping context light, Skills by department, When tools overlap

### Community 23 - "Chart Components"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 24 - "Colors"
Cohesion: 0.33
Nodes (6): Colors, Named Rules, Neutral, Primary, Secondary, Tertiary

### Community 25 - "Product Brief"
Cohesion: 0.15
Nodes (12): Creative North Star: The Volunteer Desk, Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning (+4 more)

### Community 27 - "Renderer TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, jsx, paths, extends, include, @renderer/* (+2 more)

### Community 28 - "Redesign Prototype Critique (22/40)"
Cohesion: 0.33
Nodes (5): Redesign Prototype Critique (22/40), Design Health Score (Nielsen heuristics), Personas Alex, Sam, Jordan, Renderer index.html (CSP, mounts main.tsx), Redesign prototype page (current vs unslopped)

### Community 29 - "Node TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, ignoreDeprecations, paths, types, extends, include (+2 more)

### Community 30 - "brand/main.tsx"
Cohesion: 0.20
Nodes (8): @fontsource-variable/geist@^5.3.0, react-dom@^19.3.0, MarkProps, OPTIONS, Panel(), Prototype(), @fontsource-variable/geist, react-dom

### Community 31 - "help.ts"
Cohesion: 0.26
Nodes (11): useUser(), AnswerCard(), HelpPage(), SHORTCUTS, answer(), Faq, FAQS, normalize() (+3 more)

### Community 32 - "reports.ts"
Cohesion: 0.06
Nodes (120): Shape of the code, all(), Db, one(), openDb(), run(), tx(), SCHEMA (+112 more)

### Community 35 - "electron.vite.config.ts"
Cohesion: 0.22
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 36 - "Redesign Critique Report"
Cohesion: 0.29
Nodes (6): Design Health Score (pre-fix, as assessed), Design Specificity, Minor, Persona red flags, Priority Issues, Questions

### Community 37 - "app/package.json"
Cohesion: 0.07
Nodes (40): author, description, devDependencies, electron-builder@^26.15.3, @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, @electron-toolkit/tsconfig@^2.0.0, eslint@^9.39.5 (+32 more)

### Community 38 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 39 - "Setup Test Environment"
Cohesion: 0.33
Nodes (6): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, AI-sounding text fixture, [env-smoke-test] page loaded console log, Smoke Test Page (deliberately flawed UI)

### Community 43 - "entries/main.tsx"
Cohesion: 0.16
Nodes (18): ActivityRow, HourRow, ByVolunteer(), day(), DIRECTIONS, Hours(), Ledger(), monthKey() (+10 more)

### Community 44 - "Figma Mockup Notes"
Cohesion: 0.50
Nodes (3): Accessibility notes shown in the mockups, Pages and frames, ServeHub — Figma design

### Community 46 - "Root Package"
Cohesion: 0.67
Nodes (3): devDependencies, shadcn@^4.23.0, shadcn

### Community 53 - "main/index.ts"
Cohesion: 0.16
Nodes (10): @electron-toolkit/utils@^4.0.0, electron@^44.7.2, APP_PAGE, createWindow(), isAppUrl(), norm(), registerIpc(), api (+2 more)

### Community 56 - "Project Design Context"
Cohesion: 0.20
Nodes (9): Avoid, Components, Constraints, Decisions, Must, Project, Project Design Context, Sources (+1 more)

## Knowledge Gaps
- **19 isolated node(s):** `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Automatic check: no transition-all`, `withViewTransition list refreshes`, `Offline Help assistant (src/shared/help.ts)` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 286 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Screens and Pages` to `volunteer.tsx`, `entries/main.tsx`, `App Shell and Menus`, `Chart Components`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useQuery()` (e.g. with `UI` and ``src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)`) actually correct?**
  _`useQuery()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Automatic check: no transition-all` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Screens and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05161218092252575 - nodes in this community are weakly interconnected._
- **Why does `ServeHub handoff (2026-11-15)` connect `ServeHub` to `Screens and Pages`, `ServeHub architecture`, `ServeHub design taste`, `Motion`, `Figma Design Source`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Should `volunteer.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06229797237731413 - nodes in this community are weakly interconnected._
- **Why does `ServeHub Design System` connect `Figma Design Source` to `ServeHub`, `ServeHub design taste`, `ServeHub`, `Product Brief`, `Redesign Prototype Critique (22/40)`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._