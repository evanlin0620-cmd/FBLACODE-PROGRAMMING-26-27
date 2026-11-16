# Graph Report - fblacode26-27  (2026-11-15)

## Corpus Check
- 137 files · ~67,808 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 995 nodes · 3471 edges · 53 communities (45 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 105 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Screens and Pages
- Backend Services
- Redesign Prototype
- Desktop Packaging
- App Shell and Menus
- Design System Spec
- Recommendations Prototype
- Shared API Contract
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
- Validation Schemas
- Figma Design Source
- End-to-End Tests
- Stress-Test Data Modes
- Session and API Client
- Chart Components
- Sheet Components
- Product Brief
- Match Scoring
- Renderer TS Config
- Redesign Critique Signals
- Node TS Config
- Sign-in Hero
- shadcn Registry Index
- Route Guards
- Help Q&A Engine
- Design Taste Lessons
- Vite Build Config
- Redesign Critique Report
- Renderer Entry
- Root TS Config
- Setup Test Environment
- App Root and Errors
- Setup Doctor Script
- Preload Bridge
- Product Context
- Figma Mockup Notes
- Root Package
- Typography Rules
- Status Color Rules
- Renderer Surface Brief
- Window Typings

## God Nodes (most connected - your core abstractions)
1. `cn()` - 165 edges
2. `Button()` - 72 edges
3. `react` - 54 edges
4. `lucide-react` - 40 edges
5. `PageBody()` - 40 edges
6. `PageHeader()` - 39 edges
7. `Loader()` - 35 edges
8. `useQuery()` - 35 edges
9. `Approvals()` - 34 edges
10. `EmptyState()` - 33 edges

## Surprising Connections (you probably didn't know these)
- ``src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)` --references--> `activity()`  [INFERRED]
  docs/architecture.md → app/tests/unit/smart.test.ts
- `Could be an automatic check` --references--> `fmtCount()`  [INFERRED]
  docs/design-taste.md → app/src/renderer/src/lib/format.ts
- `Rules worth knowing` --references--> `tx()`  [INFERRED]
  docs/architecture.md → app/src/main/db/index.ts
- ``src/shared`` --references--> `Handlers`  [INFERRED]
  docs/architecture.md → app/src/main/ipc.ts
- ``src/shared`` --references--> `api()`  [INFERRED]
  docs/architecture.md → app/src/renderer/src/lib/api.ts

## Import Cycles
- 2-file cycle: `app/src/main/services/activities.ts -> app/src/main/services/signups.ts -> app/src/main/services/activities.ts`

## Hyperedges (group relationships)
- **ServeHub color-meaning rules** — app_design_three_signals_rule, app_design_word_not_just_color_rule, app_design_riverside_green, app_design_pills, app_design_capacity_bar_signature [EXTRACTED 1.00]
- **ServeHub motion system and its rationale** — app_design_motion, app_design_withviewtransition, app_design_usewelcome, app_design_sign_in_hero, docs_design_taste_emil_kowalski_motion_rules, docs_design_taste_calm_working_screens [INFERRED 0.85]
- **shadcn blocks used by the Figma mockups** — docs_design_figma_servehub_figma_file, shadcn_registry_sidebar_07, shadcn_registry_login_03, shadcn_registry_dashboard_01, shadcn_registry_chart_bar_default [EXTRACTED 1.00]

## Communities (53 total, 8 thin omitted)

### Community 0 - "Screens and Pages"
Cohesion: 0.08
Nodes (131): DashboardFrame(), FriendlyError(), RouteError(), router, ActivityCard(), DateTile(), SignupButton(), WhenWhere() (+123 more)

### Community 1 - "Backend Services"
Cohesion: 0.07
Nodes (98): all(), Db, one(), openDb(), run(), tx(), SCHEMA, ACTIVITIES (+90 more)

### Community 2 - "Redesign Prototype"
Cohesion: 0.06
Nodes (68): CreateAccountForm(), Errors, Field(), focusFirst(), SignInForm(), useBusy(), without(), FEATURED (+60 more)

### Community 3 - "Desktop Packaging"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 4 - "App Shell and Menus"
Cohesion: 0.11
Nodes (27): ADMIN_NAV, AppShell(), NavItem, useNavCounts(), VOLUNTEER_NAV, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+19 more)

### Community 5 - "Design System Spec"
Cohesion: 0.07
Nodes (28): Buttons, Cards / Containers, Chips (Pills), Colors, Components, Date Tile, Design System: ServeHub, Do: (+20 more)

### Community 6 - "Recommendations Prototype"
Cohesion: 0.19
Nodes (20): Factor, Rec, RECS, spots(), useSignup(), Ledger(), Row(), Harness() (+12 more)

### Community 7 - "Shared API Contract"
Cohesion: 0.17
Nodes (26): ApiMap, ActivityFilter, ActivityInput, CreateAdminInput, LogHoursInput, LoginInput, ProfileInput, ReviewHoursInput (+18 more)

### Community 8 - "Architecture Overview"
Cohesion: 0.10
Nodes (21): Shift matching that explains itself, Demo accounts, Offline Help assistant (src/shared/help.ts), How it meets the prompt, How it's built, Libraries and licenses, Recommended for you scoring (skills 50, availability 30, interests 20), Run it (+13 more)

### Community 9 - "UI Primitives"
Cohesion: 0.14
Nodes (21): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+13 more)

### Community 10 - "Build Dependencies"
Cohesion: 0.10
Nodes (20): author, description, electron-builder@^26.15.3, @electron-toolkit/tsconfig@^2.0.0, prettier@^3.9.10, tailwindcss@^4.3.4, @types/react@^19.3.0, @types/react-dom@^19.3.0 (+12 more)

### Community 11 - "Sidebar Components"
Cohesion: 0.13
Nodes (18): NavItemLink(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarInput(), SidebarMenuAction(), SidebarMenuButton(), sidebarMenuButtonVariants (+10 more)

### Community 12 - "Lint Tooling"
Cohesion: 0.13
Nodes (19): devDependencies, @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, eslint@^9.39.5, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, react@^19.3.0 (+11 more)

### Community 13 - "Session Handoff Notes"
Cohesion: 0.13
Nodes (15): Motion, useWelcome once-per-login entrance, withViewTransition list refreshes, Recommendations prototype page, useWelcome(), 1. Goal, 2. Current state, 3. Active files (+7 more)

### Community 14 - "shadcn Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 15 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @electron-toolkit/utils@^4.0.0, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1, recharts@^3.8.0 (+10 more)

### Community 16 - "Build Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 17 - "Form Fields"
Cohesion: 0.18
Nodes (13): FieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator() (+5 more)

### Community 18 - "Validation Schemas"
Cohesion: 0.13
Nodes (14): activityFilterSchema, activitySchema, availabilitySchema, certificateCodeSchema, createAdminSchema, email, idsSchema, logHoursSchema (+6 more)

### Community 19 - "Figma Design Source"
Cohesion: 0.21
Nodes (13): ServeHub renderer surface (all screens), ServeHub Design System, 240px sidebar navigation, Creative North Star: The Volunteer Desk, Product Principles, Figma screens (Login, Volunteer Dashboard, Browse, Help, Admin Impact, Hour Approvals), ServeHub Figma file tJfyvE4fPnORzU8PZv0IHr, Figma Tokens page (Color Light/Dark, Scale) (+5 more)

### Community 20 - "End-to-End Tests"
Cohesion: 0.20
Nodes (5): @playwright/test@^1.65.0, launch(), shot(), Bridge, @playwright/test

### Community 21 - "Stress-Test Data Modes"
Cohesion: 0.22
Nodes (12): DataToggle(), MODES, applyDataMode(), COUNTS, DataMode, dataMode(), empty(), Obj (+4 more)

### Community 22 - "Session and API Client"
Cohesion: 0.22
Nodes (10): api(), ApiError, Query, readTheme(), SessionContext, SessionProvider(), SessionValue, ApiName (+2 more)

### Community 23 - "Chart Components"
Cohesion: 0.24
Nodes (11): ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION (+3 more)

### Community 24 - "Sheet Components"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 25 - "Product Brief"
Cohesion: 0.18
Nodes (10): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+2 more)

### Community 26 - "Match Scoring"
Cohesion: 0.27
Nodes (10): Handlers, MIN_MATCH, minutes(), scoreActivity(), timeOf(), weekdayOf(), Profile, Recommendation (+2 more)

### Community 27 - "Renderer TS Config"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, jsx, paths, extends, include, @renderer/* (+2 more)

### Community 28 - "Redesign Critique Signals"
Cohesion: 0.20
Nodes (7): Redesign Prototype Critique (22/40), Design Health Score (Nielsen heuristics), Personas Alex, Sam, Jordan, Capacity Bar (signature), Riverside Green #15803d, Renderer index.html (CSP, mounts main.tsx), Redesign prototype page (current vs unslopped)

### Community 29 - "Node TS Config"
Cohesion: 0.20
Nodes (9): compilerOptions, baseUrl, composite, paths, types, extends, include, @shared/* (+1 more)

### Community 30 - "Sign-in Hero"
Cohesion: 0.33
Nodes (8): AuthFrame(), Brand(), DEMO, HEADLINE, Hero(), useLanding(), wordDelay(), ORGANIZATION

### Community 31 - "shadcn Registry Index"
Cohesion: 0.22
Nodes (8): block (97), example (239), font (52), hook (1), internal (13), lib (1), style (2), theme (5)

### Community 32 - "Route Guards"
Cohesion: 0.32
Nodes (8): home(), PublicOnly(), RequireRole(), useSession(), Data and layout (from the worst-case test, `?data=worst`), Learned in testing, Motion, Tooling

### Community 33 - "Help Q&A Engine"
Cohesion: 0.32
Nodes (7): answer(), Faq, FAQS, normalize(), STOP_WORDS, SYNONYMS, Role

### Community 34 - "Design Taste Lessons"
Cohesion: 0.25
Nodes (7): Could be an automatic check, Needs your answer, Automatic check: no transition-all, ServeHub design taste, Worst-case data lessons (?data=worst), Your taste, Break-test findings (8)

### Community 35 - "Vite Build Config"
Cohesion: 0.29
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 36 - "Redesign Critique Report"
Cohesion: 0.29
Nodes (6): Design Health Score (pre-fix, as assessed), Design Specificity, Minor, Persona red flags, Priority Issues, Questions

### Community 37 - "Renderer Entry"
Cohesion: 0.33
Nodes (4): @fontsource-variable/geist@^5.3.0, react-dom@^19.3.0, @fontsource-variable/geist, react-dom

### Community 38 - "Root TS Config"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 39 - "Setup Test Environment"
Cohesion: 0.33
Nodes (6): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, AI-sounding text fixture, [env-smoke-test] page loaded console log, Smoke Test Page (deliberately flawed UI)

### Community 40 - "App Root and Errors"
Cohesion: 0.40
Nodes (3): App(), ErrorBoundary, ThemedToaster()

### Community 42 - "Preload Bridge"
Cohesion: 0.50
Nodes (3): electron@^44.7.2, api, electron

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
- **18 isolated node(s):** `[env-smoke-test] page loaded console log`, `.mcp.json project MCP servers`, `test-env/settings.template.json`, `AI-sounding text fixture`, `@electron-toolkit/tsconfig/tsconfig.node.json` (+13 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 267 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Primitives` to `Screens and Pages`, `Redesign Prototype`, `App Shell and Menus`, `Recommendations Prototype`, `Sidebar Components`, `Form Fields`, `Chart Components`, `Sheet Components`, `Sign-in Hero`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `[env-smoke-test] page loaded console log`, `.mcp.json project MCP servers`, `test-env/settings.template.json` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Screens and Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.08214285714285714 - nodes in this community are weakly interconnected._
- **Why does `ServeHub handoff (2026-11-15)` connect `Session Handoff Notes` to `Architecture Overview`, `Design Taste Lessons`, `Figma Design Source`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `Backend Services` be split into smaller, more focused modules?**
  _Cohesion score 0.07271161417322834 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Redesign Prototype` to `Screens and Pages`, `App Shell and Menus`, `Renderer Entry`, `Recommendations Prototype`, `UI Primitives`, `Build Dependencies`, `Sidebar Components`, `Lint Tooling`, `Form Fields`, `Session and API Client`, `Chart Components`, `Sheet Components`, `Sign-in Hero`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `Redesign Prototype` be split into smaller, more focused modules?**
  _Cohesion score 0.05860805860805861 - nodes in this community are weakly interconnected._