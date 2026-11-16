# Graph Report - fblacode26-27  (2026-11-15)

## Corpus Check
- 134 files · ~67,012 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .css 2)

## Summary
- 980 nodes · 3451 edges · 45 communities (37 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.93)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c06999ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Screens and Pages
- Backend Services
- Redesign Prototype
- Desktop Packaging
- App Shell and Menus
- Design System Spec
- Components
- types.ts
- Architecture Overview
- UI Primitives
- Build Dependencies
- Sidebar Components
- Lint Tooling
- Session Handoff Notes
- shadcn Config
- Runtime Dependencies
- Build Scripts
- Form Fields
- Figma Design Source
- End-to-End Tests
- Stress-Test Data Modes
- Chart Components
- Sheet Components
- Product Brief
- Renderer TS Config
- Redesign Critique Signals
- Node TS Config
- auth.tsx
- Design Taste Lessons
- Vite Build Config
- Redesign Critique Report
- devDependencies
- Root TS Config
- Setup Test Environment
- Setup Doctor Script
- Product Context
- Figma Mockup Notes
- Root Package
- Typography Rules
- Status Color Rules
- Renderer Surface Brief
- Window Typings

## God Nodes (most connected - your core abstractions)
1. `cn()` - 165 edges
2. `Button()` - 70 edges
3. `react` - 52 edges
4. `PageBody()` - 38 edges
5. `PageHeader()` - 37 edges
6. `useQuery()` - 37 edges
7. `lucide-react` - 35 edges
8. `Loader()` - 35 edges
9. `Approvals()` - 35 edges
10. `EmptyState()` - 33 edges

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

## Communities (45 total, 8 thin omitted)

### Community 0 - "Screens and Pages"
Cohesion: 0.08
Nodes (128): FriendlyError(), RouteError(), router, ActivityCard(), DateTile(), SignupButton(), WhenWhere(), CertificateView() (+120 more)

### Community 1 - "Backend Services"
Cohesion: 0.07
Nodes (103): all(), Db, one(), openDb(), run(), tx(), SCHEMA, ACTIVITIES (+95 more)

### Community 2 - "Redesign Prototype"
Cohesion: 0.06
Nodes (67): CreateAccountForm(), Errors, Field(), focusFirst(), SignInForm(), useBusy(), without(), FEATURED (+59 more)

### Community 3 - "Desktop Packaging"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 4 - "App Shell and Menus"
Cohesion: 0.11
Nodes (25): ADMIN_NAV, AppShell(), NavItem, useNavCounts(), VOLUNTEER_NAV, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+17 more)

### Community 5 - "Design System Spec"
Cohesion: 0.10
Nodes (19): Colors, Design System: ServeHub, Do:, Do's and Don'ts, Don't:, Elevation & Depth, Hierarchy, Layout (+11 more)

### Community 6 - "Components"
Cohesion: 0.15
Nodes (10): Buttons, Capacity Bar (signature), Cards / Containers, Chips (Pills), Components, Date Tile, Empty and Error States, Inputs / Fields (+2 more)

### Community 7 - "types.ts"
Cohesion: 0.05
Nodes (68): Handlers, MIN_MATCH, minutes(), scoreActivity(), api(), ApiError, Query, readTheme() (+60 more)

### Community 8 - "Architecture Overview"
Cohesion: 0.10
Nodes (22): Shift matching that explains itself, Demo accounts, Offline Help assistant (src/shared/help.ts), How it meets the prompt, How it's built, Libraries and licenses, Recommended for you scoring (skills 50, availability 30, interests 20), Run it (+14 more)

### Community 9 - "UI Primitives"
Cohesion: 0.10
Nodes (32): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+24 more)

### Community 10 - "Build Dependencies"
Cohesion: 0.15
Nodes (12): author, description, electron-builder@^26.15.3, @types/react@^19.3.0, @types/react-dom@^19.3.0, main, name, productName (+4 more)

### Community 11 - "Sidebar Components"
Cohesion: 0.13
Nodes (19): NavItemLink(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarGroupLabel(), SidebarInput(), SidebarMenuAction(), SidebarMenuButton() (+11 more)

### Community 12 - "Lint Tooling"
Cohesion: 0.15
Nodes (12): @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, eslint@^9.39.5, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, @electron-toolkit/eslint-config-prettier, @electron-toolkit/eslint-config-ts (+4 more)

### Community 13 - "Session Handoff Notes"
Cohesion: 0.12
Nodes (13): Motion, Sign-in Hero, useWelcome once-per-login entrance, withViewTransition list refreshes, useWelcome(), 1. Goal, 2. Current state, 4. Changes made (+5 more)

### Community 14 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 15 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @electron-toolkit/utils@^4.0.0, @fontsource-variable/geist@^5.3.0, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1 (+13 more)

### Community 16 - "Build Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 17 - "Form Fields"
Cohesion: 0.18
Nodes (13): FieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator() (+5 more)

### Community 19 - "Figma Design Source"
Cohesion: 0.27
Nodes (11): ServeHub renderer surface (all screens), ServeHub Design System, 240px sidebar navigation, Figma screens (Login, Volunteer Dashboard, Browse, Help, Admin Impact, Hour Approvals), ServeHub Figma file tJfyvE4fPnORzU8PZv0IHr, Figma Tokens page (Color Light/Dark, Scale), chart-bar-default block, dashboard-01 block (+3 more)

### Community 20 - "End-to-End Tests"
Cohesion: 0.22
Nodes (4): launch(), shot(), Bridge, @playwright/test

### Community 21 - "Stress-Test Data Modes"
Cohesion: 0.11
Nodes (20): DataToggle(), MODES, applyDataMode(), COUNTS, DataMode, dataMode(), empty(), Obj (+12 more)

### Community 23 - "Chart Components"
Cohesion: 0.22
Nodes (12): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+4 more)

### Community 24 - "Sheet Components"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

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

### Community 30 - "auth.tsx"
Cohesion: 0.16
Nodes (16): App(), ErrorBoundary, home(), PublicOnly(), RequireRole(), ThemedToaster(), useSession(), AuthFrame() (+8 more)

### Community 34 - "Design Taste Lessons"
Cohesion: 0.17
Nodes (11): Could be an automatic check, Data and layout (from the worst-case test, `?data=worst`), Learned in testing, Motion, Needs your answer, Automatic check: no transition-all, ServeHub design taste, Tooling (+3 more)

### Community 35 - "Vite Build Config"
Cohesion: 0.29
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 36 - "Redesign Critique Report"
Cohesion: 0.29
Nodes (6): Design Health Score (pre-fix, as assessed), Design Specificity, Minor, Persona red flags, Priority Issues, Questions

### Community 37 - "devDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, electron@^44.7.2, @electron-toolkit/tsconfig@^2.0.0, @playwright/test@^1.65.0, prettier@^3.9.10, react@^19.3.0, react-dom@^19.3.0, tailwindcss@^4.3.4 (+11 more)

### Community 38 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 39 - "Setup Test Environment"
Cohesion: 0.33
Nodes (6): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, AI-sounding text fixture, [env-smoke-test] page loaded console log, Smoke Test Page (deliberately flawed UI)

### Community 43 - "Product Context"
Cohesion: 0.50
Nodes (3): FBLA judges / 7-minute demo, Riverside Community Partners (demo nonprofit), ServeHub Product

### Community 44 - "Figma Mockup Notes"
Cohesion: 0.50
Nodes (3): Accessibility notes shown in the mockups, Pages and frames, ServeHub — Figma design

### Community 46 - "Root Package"
Cohesion: 0.67
Nodes (3): devDependencies, shadcn@^4.23.0, shadcn

## Knowledge Gaps
- **19 isolated node(s):** `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `withViewTransition list refreshes`, `FBLA study material (floorplan, rederive)`, `240px sidebar navigation` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 262 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives` to `Screens and Pages`, `Redesign Prototype`, `App Shell and Menus`, `Sidebar Components`, `Form Fields`, `Chart Components`, `Sheet Components`, `auth.tsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `withViewTransition list refreshes` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Screens and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.083770055631702 - nodes in this community are weakly interconnected._
- **Why does `ServeHub handoff (2026-11-15)` connect `Session Handoff Notes` to `Architecture Overview`, `Screens and Pages`, `Design Taste Lessons`, `Figma Design Source`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Backend Services` be split into smaller, more focused modules?**
  _Cohesion score 0.06876727473742399 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Redesign Prototype` to `Screens and Pages`, `App Shell and Menus`, `devDependencies`, `types.ts`, `UI Primitives`, `Build Dependencies`, `Sidebar Components`, `Form Fields`, `Chart Components`, `Sheet Components`, `auth.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Redesign Prototype` be split into smaller, more focused modules?**
  _Cohesion score 0.06491885143570537 - nodes in this community are weakly interconnected._