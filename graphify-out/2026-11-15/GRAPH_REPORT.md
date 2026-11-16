# Graph Report - fblacode26-27  (2026-11-15)

## Corpus Check
- 225 files · ~193,215 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 24 file(s) not represented in the graph (top: .log 16, (none) 4, .css 4)

## Summary
- 1565 nodes · 4028 edges · 96 communities (82 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 131 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8faab20e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Apple Fluid Motion
- Break UI & Prototyping
- Rederive Structure Script
- Animation Audit Workflow
- Sonner & UI Libraries
- Smoke Test Harness
- Swift Language Skills
- Gesture Dismiss Recipes
- activities.tsx
- animate skill
- Mobile Web Baseline
- Animation Performance
- Rederive Learning Loop
- Animation Standards Reference
- review-animations skill
- types.ts
- activities.ts
- app-shell.tsx
- Press Feedback
- npx
- Expo Animation Recipes
- electron-builder.yml
- Choreographing Motion
- Animation Recipes
- app/package.json
- cn
- Worst-Case Catalog
- Components
- Animation Standards Reference
- reports.ts
- smart.test.ts
- Animation Audit Playbook
- Write Swift
- session.tsx
- sidebar.tsx
- Apple Design
- The Fixes
- Prototyping Variants
- Glossary
- components.json
- dependencies
- Animation Performance
- auth.ts
- volunteer.tsx
- Finding Animation Opportunities
- scripts
- Removing Animations
- Gesture-Driven UI
- chart.tsx
- app.ts
- field.tsx
- react
- Working With Sonner
- Product
- recommendations/main.tsx
- compilerOptions
- The list
- compilerOptions
- hours.ts
- Design Engineering
- ServeHub
- electron.vite.config.ts
- Component Building Principles
- Emil Design Engineering skill
- Break UI skill
- help.ts
- tsconfig.json
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- Core Philosophy
- Debugging Animations
- ServeHub — Figma design
- package.json
- ServeHub app (all renderer screens)
- main.tsx
- index.d.ts
- eslint.config.mjs
- Workflow
- 2026-11-16T01-49-03Z__src-renderer-prototypes-redesign.md
- sheet.tsx
- Ask Emil
- ServeHub design taste
- Layers

## God Nodes (most connected - your core abstractions)
1. `cn()` - 165 edges
2. `Button()` - 71 edges
3. `react` - 53 edges
4. `PageBody()` - 40 edges
5. `lucide-react` - 39 edges
6. `PageHeader()` - 39 edges
7. `Loader()` - 35 edges
8. `useQuery()` - 35 edges
9. `Approvals()` - 34 edges
10. `EmptyState()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Rules worth knowing` --references--> `tx()`  [INFERRED]
  docs/architecture.md → app/src/main/db/index.ts
- ``src/shared`` --references--> `Handlers`  [INFERRED]
  docs/architecture.md → app/src/main/ipc.ts
- `Could be an automatic check` --references--> `fmtCount()`  [INFERRED]
  docs/design-taste.md → app/src/renderer/src/lib/format.ts
- ``src/renderer` (React 19 + react-router hash routes + Tailwind 4 + shadcn/ui)` --references--> `activity()`  [INFERRED]
  docs/architecture.md → app/tests/unit/smart.test.ts
- ``src/main` (Electron main process, the backend)` --references--> `openDb()`  [INFERRED]
  docs/architecture.md → app/src/main/db/index.ts

## Import Cycles
- 2-file cycle: `app/src/main/services/activities.ts -> app/src/main/services/signups.ts -> app/src/main/services/activities.ts`

## Hyperedges (group relationships)
- **Emil Kowalski animation skill suite (build, perf, name, find, audit, remove, review)** — agents_skills_animate_skill_animate, agents_skills_animate_expo_skill_animate_expo, agents_skills_animation_performance_skill_animation_performance, agents_skills_animation_vocabulary_skill_animation_vocabulary, agents_skills_find_animation_opportunities_skill_find_animation_opportunities, agents_skills_improve_animations_skill_improve_animations, agents_skills_remove_animations_skill_remove_animations, agents_skills_review_animations_skill_review_animations [EXTRACTED 1.00]
- **Skills derived from Emil Kowalski's design engineering philosophy** — agents_skills_emil_design_eng_skill_emil_design_eng, agents_skills_ask_sonner_skill_ask_sonner, agents_skills_break_ui_skill_break_ui, agents_skills_mobile_native_skill_mobile_native, agents_skills_pick_ui_library_skill_pick_ui_library, agents_skills_prototype_skill_prototype [EXTRACTED 1.00]
- **Environment smoke test harness** — claude_skills_env_smoke_test_skill_env_smoke_test, claude_skills_env_smoke_test_skill_verify_setup_ps1, test_env_fixtures_ai_sounding_ai_sounding_text, test_env_fixtures_ui_sample_smoke_test_page, claude_project_overview [EXTRACTED 1.00]
- **Fluid gesture-driven motion (springs, velocity, interruptibility, boundaries)** — agents_skills_apple_design_skill_interruptibility, agents_skills_apple_design_skill_spring_damping_response, agents_skills_apple_design_skill_velocity_handoff, agents_skills_apple_design_skill_momentum_projection, agents_skills_apple_design_skill_rubber_banding, agents_skills_emil_design_eng_skill_momentum_dismissal [INFERRED 0.85]
- **Velocity-based gesture dismissal with boundary resistance** — agents_skills_animate_expo_recipes_project, agents_skills_animate_expo_recipes_rubberband, agents_skills_animate_expo_recipes_bottom_sheet_drag_to_dismiss, agents_skills_animate_recipes_drag_to_dismiss, agents_skills_review_animations_standards_momentum_dismissal [INFERRED 0.85]
- **Should-it-animate frequency/purpose gates** — agents_skills_review_animations_standards_frequency_table, agents_skills_animate_skill_build_sequence, agents_skills_find_animation_opportunities_skill_four_question_gate, agents_skills_remove_animations_skill_removal_gate_tree, agents_skills_animate_skill_purpose_categories [INFERRED 0.85]

## Communities (96 total, 14 thin omitted)

### Community 0 - "Apple Fluid Motion"
Cohesion: 0.20
Nodes (3): Apple Design skill, Designing Fluid Interfaces (WWDC 2018), Apple's eight design principles

### Community 1 - "Break UI & Prototyping"
Cohesion: 0.20
Nodes (5): Demo data / Worst case toggle, Picker behavior contract (keys 1-N, arrows, R, ?v= param), setActive(), Prototype Picker spec, Prototype skill

### Community 2 - "Rederive Structure Script"
Cohesion: 0.18
Nodes (3): lines(), list_files(), read()

### Community 3 - "Animation Audit Workflow"
Cohesion: 0.21
Nodes (9): Opportunity hunt seams, Animation Audit Playbook, Eight audit categories, Plan Template, plans/README.md index, improve-animations skill, HIGH / MEDIUM / LOW severity, Block / Approve verdict (+1 more)

### Community 4 - "Sonner & UI Libraries"
Cohesion: 0.24
Nodes (9): Sonner API Reference, toast() options and functions, <Toaster /> props, Ask Sonner skill, Sonner toast library, Sonner troubleshooting table, Emil Kowalski, Curated library list (base-ui, cmdk, motion, recharts, Virtuoso, zustand...) (+1 more)

### Community 5 - "Smoke Test Harness"
Cohesion: 0.29
Nodes (9): .mcp.json project MCP servers, fblacode26-27 Claude setup test environment, test-env/settings.template.json, env-smoke-test skill, Smoke test checks (doctor, humanizer, impeccable, chrome-devtools, browser, connectors), scripts/verify-setup.ps1 (doctor script), AI-sounding text fixture, [env-smoke-test] page loaded console log (+1 more)

### Community 6 - "Swift Language Skills"
Cohesion: 0.29
Nodes (5): Sendable and data-race fixes, Structured concurrency (async let, task groups), Swift 6 migration order, Swift Testing (@Test, #expect), Write Swift skill

### Community 8 - "activities.tsx"
Cohesion: 0.07
Nodes (150): Motion, HourRow, DashboardFrame(), home(), PublicOnly(), RequireRole(), router, ActivityCard() (+142 more)

### Community 9 - "animate skill"
Cohesion: 0.24
Nodes (6): Expo Animation Recipes, EASE_OUT / EASE_IN_OUT / EASE_SHEET Easing.bezier constants, Animation Recipes (web), animate skill, --ease-out / --ease-in-out / --ease-drawer tokens, Six animation purposes

### Community 11 - "Animation Performance"
Cohesion: 0.20
Nodes (8): CADisableMinimumFrameDurationOnPhone (120fps), animate-expo skill, Reanimated spring configs (duration + dampingRatio), animation-performance skill, Find / diagnose / report workflow, Frame budget (16.7ms / 8ms at 120Hz), Layout / paint / composite property tiers, Jank symptom table

### Community 12 - "Rederive Learning Loop"
Cohesion: 0.40
Nodes (4): history.sh script, Decision map (.rederive/map.md), Learning log (.rederive/log.md), Rederive skill

### Community 13 - "Animation Standards Reference"
Cohesion: 0.20
Nodes (8): Main thread vs hardware-accelerated drivers, Motion 14.2+ hardware-accelerated x/y/scale, animation-vocabulary skill, Motion effect glossary, /vocabulary page, Emil Kowalski animation philosophy, Animation Standards Reference, Feel debugging (slow motion, frame-by-frame, real device, fresh eyes)

### Community 14 - "review-animations skill"
Cohesion: 0.19
Nodes (8): Never Ship table (web), find-animation-opportunities skill, "You Don't Need Animations" (Emil Kowalski), Invocation variants (quick, deep, plan, execute, reconcile), Reducing table, remove-animations skill, Aggressive escalation triggers, review-animations skill

### Community 15 - "types.ts"
Cohesion: 0.11
Nodes (39): ApiMap, ActivityFilter, activityFilterSchema, ActivityInput, activitySchema, availabilitySchema, certificateCodeSchema, CreateAdminInput (+31 more)

### Community 17 - "activities.ts"
Cohesion: 0.19
Nodes (31): run(), tx(), activeSignups(), ActivityRow, cancelActivity(), checkSkillsExist(), createActivity(), deleteActivity() (+23 more)

### Community 19 - "app-shell.tsx"
Cohesion: 0.11
Nodes (26): ADMIN_NAV, AppShell(), NavItem, useNavCounts(), VOLUNTEER_NAV, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+18 more)

### Community 26 - "Expo Animation Recipes"
Cohesion: 0.06
Nodes (33): Bottom sheet you can drag to dismiss, Collapsing header on scroll, Expo Animation Recipes, Firing something once at a threshold, Keyboard-synced UI, List entrances, Press feedback, Screen transitions (Expo Router) (+25 more)

### Community 27 - "electron-builder.yml"
Cohesion: 0.06
Nodes (33): appId, appImage, artifactName, asarUnpack, directories, buildResources, dmg, artifactName (+25 more)

### Community 28 - "Choreographing Motion"
Cohesion: 0.06
Nodes (32): Carry: steer a shared layout animation through its parent, Choreography Recipes, Direction-aware steps, Imperative orchestration (`useAnimate`), Overlap: CSS stagger with a delay variable, Overlap: Motion variants with a non-uniform stagger, Sequence: morph between two rich states with a crossfade, Sequence: one draw after another (+24 more)

### Community 29 - "Animation Recipes"
Cohesion: 0.06
Nodes (31): Accordion / collapse, Animation Recipes, Button press, Drag to dismiss, Drawer / sheet, Dropdown, popover, menu, select, Hold to confirm, Masking a crossfade that won't settle (+23 more)

### Community 31 - "app/package.json"
Cohesion: 0.10
Nodes (27): author, description, devDependencies, electron-builder@^26.15.3, @electron-toolkit/tsconfig@^2.0.0, prettier@^3.9.10, react@^19.3.0, tailwindcss@^4.3.4 (+19 more)

### Community 32 - "cn"
Cohesion: 0.16
Nodes (19): AlertDialogMedia(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card() (+11 more)

### Community 33 - "Worst-Case Catalog"
Cohesion: 0.06
Nodes (29): Collections, Emails, URLs, identifiers, Environment, Images and media, Labels, titles, and copy from data, Numbers and money, People and names, States (+21 more)

### Community 34 - "Components"
Cohesion: 0.07
Nodes (29): Buttons, Capacity Bar (signature), Cards / Containers, Chips (Pills), Colors, Components, Date Tile, Design System: ServeHub (+21 more)

### Community 35 - "Animation Standards Reference"
Cohesion: 0.07
Nodes (25): Aggressive Escalation Triggers, Initial Response, Operating Posture, Part 1 — Findings table (REQUIRED), Part 2 — Verdict (REQUIRED), Remedial Preference Hierarchy, Required Output Format, Reviewing Animations (+17 more)

### Community 36 - "reports.ts"
Cohesion: 0.17
Nodes (33): all(), one(), listActivities(), loadActivities(), roster(), createAdmin(), parse(), requireAdmin() (+25 more)

### Community 37 - "smart.test.ts"
Cohesion: 0.16
Nodes (18): ACTIVITIES, DEMO_ADMIN, DEMO_VOLUNTEER, seedDemo(), SKILLS, VOLUNTEERS, hashPassword(), MIN_MATCH (+10 more)

### Community 38 - "Animation Audit Playbook"
Cohesion: 0.08
Nodes (22): 1. Purpose & frequency, 2. Easing & duration, 3. Physicality & origin, 4. Interruptibility, 5. Performance, 6. Accessibility, 7. Cohesion & tokens, 8. Missed opportunities (+14 more)

### Community 39 - "Write Swift"
Cohesion: 0.09
Nodes (22): 10. ARC and object lifetime, 11. Testing — Swift Testing by default, 12. Macros, 13. Logging and debugging, 14. Unsafe code and interop, 15. Modern syntax you should be using, 16. Migrating an existing codebase to Swift 6, 1. Model data with value types (+14 more)

### Community 40 - "session.tsx"
Cohesion: 0.06
Nodes (34): App(), ErrorBoundary, FriendlyError(), RouteError(), ThemedToaster(), DataToggle(), MODES, applyDataMode() (+26 more)

### Community 41 - "sidebar.tsx"
Cohesion: 0.13
Nodes (22): MonthChart(), NavItemLink(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarInput(), SidebarMenuAction(), SidebarMenuButton() (+14 more)

### Community 42 - "Apple Design"
Cohesion: 0.09
Nodes (21): 10. Gesture design details (the "feel" checklist), 11. Frame-level smoothness, 12. Materials & depth — translucency conveys hierarchy, 13. Multimodal feedback — motion + sound + haptics, 14. Reduced motion & accessibility, 15. Typography — optical sizing, tracking, leading, 16. Design foundations — the eight principles, 17. Process (+13 more)

### Community 43 - "The Fixes"
Cohesion: 0.09
Nodes (21): 10. Status bar color doesn't match, 11. Right in Chrome, wrong on phone, 1. Hover state stuck after tap, 2. Gray/blue flash on tap, 3. Layout has the wrong height, 4. Page zooms into the input, 5. Tap feels laggy, 6. Pull-to-refresh hijacks scroll (+13 more)

### Community 44 - "Prototyping Variants"
Cohesion: 0.10
Nodes (19): Behavior contract, Markup, Reference wiring, Rules, Styles, The Picker, Hard Rules, Initial Response (+11 more)

### Community 45 - "Glossary"
Cohesion: 0.11
Nodes (18): Animation Vocabulary, Easing — how speed changes over an animation, Entrances & Exits — how elements appear and disappear, Examples, Feedback & Interaction — responding to the user's actions, Glossary, Initial Response, Instructions (+10 more)

### Community 46 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 47 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @electron-toolkit/utils@^4.0.0, lucide-react@^1.69.0, radix-ui@^1.8.1, react-router@^8.5.1, recharts@^3.8.0 (+10 more)

### Community 48 - "Animation Performance"
Cohesion: 0.11
Nodes (17): Animation Performance, Hard Rules, Initial Response, Operating Posture, Phase 1: Find what animates, Phase 2: Diagnose, Phase 3: Report, React: Don't Animate Through State (+9 more)

### Community 49 - "auth.ts"
Cohesion: 0.10
Nodes (21): electron@^44.7.2, Db, openDb(), SCHEMA, createWindow(), isAppUrl(), Handlers, handlers (+13 more)

### Community 50 - "volunteer.tsx"
Cohesion: 0.09
Nodes (44): FEATURED, IMPACT, LOGGABLE, OrgContext, ORGS, Rec, RUNNER_UP, useOrg() (+36 more)

### Community 51 - "Finding Animation Opportunities"
Cohesion: 0.12
Nodes (16): 1. Frequency — how often will a user see this?, 2. Purpose — why does this animate?, 3. Speed — can it stay inside budget?, 4. Function — does motion help or hinder here?, Finding Animation Opportunities, Hard Rules, Initial Response, Operating Posture (+8 more)

### Community 52 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, build:linux, build:mac, build:unpack, build:win, dev, format (+8 more)

### Community 53 - "Removing Animations"
Cohesion: 0.12
Nodes (15): Cleanup, Hard Rules, Initial Response, Operating Posture, Part 1 — Removed and reduced, Part 2 — Kept (REQUIRED), Part 3 — Cleanup and verdict, Reducing (+7 more)

### Community 54 - "Gesture-Driven UI"
Cohesion: 0.13
Nodes (14): First decision: build it, or use a solution that exists?, Gesture-Driven UI, Hold gestures are asymmetric, Interruptibility is non-negotiable, Linked values, Motion drag props, Reduced motion, Release phase rules (+6 more)

### Community 55 - "chart.tsx"
Cohesion: 0.25
Nodes (10): ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload(), INITIAL_DIMENSION, THEMES (+2 more)

### Community 56 - "app.ts"
Cohesion: 0.20
Nodes (5): @playwright/test@^1.65.0, launch(), shot(), Bridge, @playwright/test

### Community 57 - "field.tsx"
Cohesion: 0.18
Nodes (13): FieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend(), FieldSeparator() (+5 more)

### Community 58 - "react"
Cohesion: 0.15
Nodes (18): ErrorPanel(), LoadingSkeleton(), Badge(), badgeVariants, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader() (+10 more)

### Community 59 - "Working With Sonner"
Cohesion: 0.15
Nodes (11): Functions, Sonner API Reference, `toast()` options, `<Toaster />`, Initial Response, Picking the right call, Recipes, Setup (+3 more)

### Community 60 - "Product"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 61 - "recommendations/main.tsx"
Cohesion: 0.19
Nodes (20): Factor, Rec, RECS, spots(), useSignup(), Ledger(), Row(), Harness() (+12 more)

### Community 62 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, baseUrl, composite, jsx, paths, extends, include, @renderer/* (+2 more)

### Community 63 - "The list"
Cohesion: 0.18
Nodes (10): Charts, Common mismatches to catch, How to use this, Initial Response, Interaction & performance, Motion & visuals, Picking The Right Library, State & styling (+2 more)

### Community 64 - "compilerOptions"
Cohesion: 0.20
Nodes (9): compilerOptions, baseUrl, composite, paths, types, extends, include, @shared/* (+1 more)

### Community 65 - "hours.ts"
Cohesion: 0.40
Nodes (9): requireVolunteer(), hourLogsFor(), hoursForReview(), loggableShifts(), logHours(), myHours(), toHourLog(), mySignups() (+1 more)

### Community 66 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 67 - "ServeHub"
Cohesion: 0.25
Nodes (7): Demo accounts, How it meets the prompt, How it's built, Libraries and licenses, Run it, ServeHub, Validation that checks meaning, not just format

### Community 68 - "electron.vite.config.ts"
Cohesion: 0.29
Nodes (6): electron-vite@^6.0.0, @tailwindcss/vite@^4.3.4, @vitejs/plugin-react@^6.1.2, electron-vite, @tailwindcss/vite, @vitejs/plugin-react

### Community 69 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 70 - "Emil Design Engineering skill"
Cohesion: 0.38
Nodes (3): Emil Design Engineering skill, Before/After/Why review table format, motion (Framer Motion)

### Community 71 - "Break UI skill"
Cohesion: 0.33
Nodes (5): Environment worst cases (320px, zoom, dark, RTL, touch), Unbreakable strings (emails, URLs, IDs), Worst-Case Catalog, Break UI skill, UI failure signatures table

### Community 72 - "help.ts"
Cohesion: 0.32
Nodes (7): answer(), Faq, FAQS, normalize(), STOP_WORDS, SYNONYMS, Role

### Community 73 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 74 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 75 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 76 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 77 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 78 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 79 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 80 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 81 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 82 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

### Community 83 - "ServeHub — Figma design"
Cohesion: 0.50
Nodes (3): Accessibility notes shown in the mockups, Pages and frames, ServeHub — Figma design

### Community 84 - "package.json"
Cohesion: 0.67
Nodes (3): devDependencies, shadcn@^4.23.0, shadcn

### Community 86 - "main.tsx"
Cohesion: 0.33
Nodes (4): @fontsource-variable/geist@^5.3.0, react-dom@^19.3.0, @fontsource-variable/geist, react-dom

### Community 89 - "eslint.config.mjs"
Cohesion: 0.15
Nodes (12): @electron-toolkit/eslint-config-prettier@^3.0.1, @electron-toolkit/eslint-config-ts@^4.0.0, eslint@^9.39.5, eslint-plugin-react@^7.37.5, eslint-plugin-react-hooks@^7.1.1, eslint-plugin-react-refresh@^0.5.7, @electron-toolkit/eslint-config-prettier, @electron-toolkit/eslint-config-ts (+4 more)

### Community 90 - "Workflow"
Cohesion: 0.12
Nodes (16): Conflicts, Hard Rules, Invocation Variants, Learning Taste, Make it a check, Needs your answer, Phase 1: Collect corrections, Phase 2: Filter (+8 more)

### Community 91 - "2026-11-16T01-49-03Z__src-renderer-prototypes-redesign.md"
Cohesion: 0.29
Nodes (6): Design Health Score (pre-fix, as assessed), Design Specificity, Minor, Persona red flags, Priority Issues, Questions

### Community 92 - "sheet.tsx"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 93 - "Ask Emil"
Cohesion: 0.29
Nodes (6): Ask Emil, Common situations, References underneath, Standalone, The main flow: idea → ship, Upkeep: a codebase that already exists

### Community 95 - "ServeHub design taste"
Cohesion: 0.22
Nodes (8): Could be an automatic check, Data and layout (from the worst-case test, `?data=worst`), Learned in testing, Motion, Needs your answer, ServeHub design taste, Tooling, Your taste

### Community 97 - "Layers"
Cohesion: 0.33
Nodes (5): Layers, Rules worth knowing, ServeHub architecture, `src/preload`, Tests

## Ambiguous Edges - Review These
- `Smoke Test Page (deliberately flawed UI)` → `Before/After/Why review table format`  [AMBIGUOUS]
  test-env/fixtures/ui-sample.html · relation: conceptually_related_to

## Knowledge Gaps
- **22 isolated node(s):** `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Apple's eight design principles`, `Designing Fluid Interfaces (WWDC 2018)`, `Reanimated spring configs (duration + dampingRatio)` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 698 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `activities.tsx`, `sidebar.tsx`, `volunteer.tsx`, `app-shell.tsx`, `chart.tsx`, `field.tsx`, `react`, `sheet.tsx`, `recommendations/main.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **What connects `@electron-toolkit/tsconfig/tsconfig.node.json`, `@electron-toolkit/tsconfig/tsconfig.web.json`, `Apple's eight design principles` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `activities.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06769473620302349 - nodes in this community are weakly interconnected._
- **Why does `Motion` connect `activities.tsx` to `Components`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1091753774680604 - nodes in this community are weakly interconnected._
- **Why does `Design System: ServeHub` connect `Components` to `activities.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Smoke Test Page (deliberately flawed UI)` and `Before/After/Why review table format`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._